import type { AuditLogger } from '@/audit/audit-log.repository';
import type { AlertEvent } from '@/modules/alerts/domain/entities/alert-event.entity';
import {
  AlertAlreadyClosedError,
  AlertNotFoundError,
} from '@/modules/alerts/domain/errors/alert.errors';
import type { AlertRepository } from '@/modules/alerts/domain/repositories/alert.repository';
import { AckAlertUseCase } from './ack-alert.use-case';

const USER_ID = 'user-1';
const ALERT_ID = '01924a3f-0000-7000-8000-0000000000bb';
const PET_ID = '01924a3f-0000-7000-8000-0000000000aa';
const NOW = new Date('2026-08-07T10:00:00.000Z');
const ACKED_AT_ORIGINAL = new Date('2026-08-06T09:00:00.000Z');

type MockOf<T> = { [K in keyof T]: jest.Mock };

function alert(overrides: Partial<AlertEvent> = {}): AlertEvent {
  return {
    id: ALERT_ID,
    petId: PET_ID,
    petName: 'Firulais',
    type: 'geofence_exit',
    status: 'open',
    geofenceId: 'geofence-1',
    payload: { geofenceName: 'Casa' },
    openedAt: new Date('2026-08-05T08:00:00.000Z'),
    ackedAt: null,
    closedAt: null,
    ...overrides,
  };
}

function repositoryStub(found: AlertEvent | null): MockOf<AlertRepository> {
  return {
    listForMember: jest.fn(),
    findForMember: jest.fn().mockResolvedValue(found),
    ack: jest.fn().mockResolvedValue(NOW),
  };
}

function auditStub(): MockOf<AuditLogger> {
  return { record: jest.fn().mockResolvedValue(undefined) };
}

function useCase(
  repository: MockOf<AlertRepository>,
  audit: MockOf<AuditLogger> = auditStub(),
): AckAlertUseCase {
  return new AckAlertUseCase(repository, audit);
}

describe('R20: POST /v1/alerts/:id/ack pasa open -> acked con acked_at, sin tocar closed_at', () => {
  it('actualiza la fila y devuelve el mismo shape de elemento de R16', async () => {
    const repository = repositoryStub(alert());

    const result = await useCase(repository).execute(ALERT_ID, USER_ID, NOW);

    expect(repository.ack).toHaveBeenCalledWith(ALERT_ID, NOW);
    expect(result.status).toBe('acked');
    expect(result.ackedAt).toEqual(NOW);
    expect(result.closedAt).toBeNull();
    expect(result.petName).toBe('Firulais');
  });
});

describe('R21: maquina de estados del ack y 404 generico', () => {
  it('acked -> ack de nuevo es idempotente: conserva el acked_at original y no reescribe', async () => {
    const repository = repositoryStub(
      alert({ status: 'acked', ackedAt: ACKED_AT_ORIGINAL }),
    );

    const result = await useCase(repository).execute(ALERT_ID, USER_ID, NOW);

    expect(repository.ack).not.toHaveBeenCalled();
    expect(result.status).toBe('acked');
    expect(result.ackedAt).toEqual(ACKED_AT_ORIGINAL);
  });

  it('closed -> ack es AlertAlreadyClosedError (409): una alerta resuelta no se entera', async () => {
    const repository = repositoryStub(
      alert({ status: 'closed', closedAt: NOW }),
    );

    await expect(
      useCase(repository).execute(ALERT_ID, USER_ID, NOW),
    ).rejects.toBeInstanceOf(AlertAlreadyClosedError);
    expect(repository.ack).not.toHaveBeenCalled();
  });

  it('alerta inexistente o sin membresia activa: el MISMO AlertNotFoundError', async () => {
    const repository = repositoryStub(null);

    await expect(
      useCase(repository).execute(ALERT_ID, USER_ID, NOW),
    ).rejects.toBeInstanceOf(AlertNotFoundError);
    expect(repository.findForMember).toHaveBeenCalledWith(ALERT_ID, USER_ID);
  });

  it('un :id que no es uuid sintactico es 404 sin tocar la base', async () => {
    const repository = repositoryStub(alert());

    for (const id of ['no-soy-uuid', '', '123']) {
      await expect(
        useCase(repository).execute(id, USER_ID, NOW),
      ).rejects.toBeInstanceOf(AlertNotFoundError);
    }
    expect(repository.findForMember).not.toHaveBeenCalled();
  });

  it('carrera: si el motor cierra entre el SELECT y el UPDATE, el ack es 409', async () => {
    const repository = repositoryStub(alert());
    repository.ack.mockResolvedValue(null);

    await expect(
      useCase(repository).execute(ALERT_ID, USER_ID, NOW),
    ).rejects.toBeInstanceOf(AlertAlreadyClosedError);
  });
});

describe('R22: auditoria alert.ack solo cuando el ack cambia el estado', () => {
  it('registra {userId, action, entity, entityId, meta:{petId, type}} en el ack efectivo', async () => {
    const repository = repositoryStub(alert());
    const audit = auditStub();

    await useCase(repository, audit).execute(ALERT_ID, USER_ID, NOW);

    expect(audit.record).toHaveBeenCalledTimes(1);
    expect(audit.record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'alert.ack',
      entity: 'alert_events',
      entityId: ALERT_ID,
      meta: { petId: PET_ID, type: 'geofence_exit' },
    });
  });

  it('2 llamadas al endpoint producen 1 sola entrada de auditoria', async () => {
    const audit = auditStub();
    const first = repositoryStub(alert());
    await useCase(first, audit).execute(ALERT_ID, USER_ID, NOW);

    const second = repositoryStub(alert({ status: 'acked', ackedAt: NOW }));
    await useCase(second, audit).execute(ALERT_ID, USER_ID, NOW);

    expect(audit.record).toHaveBeenCalledTimes(1);
  });

  it('un ack rechazado (409) no audita nada', async () => {
    const audit = auditStub();
    const repository = repositoryStub(alert({ status: 'closed' }));

    await expect(
      useCase(repository, audit).execute(ALERT_ID, USER_ID, NOW),
    ).rejects.toBeInstanceOf(AlertAlreadyClosedError);
    expect(audit.record).not.toHaveBeenCalled();
  });
});
