import { ALERTS_PAGE_SIZE } from '@/modules/alerts/alerts.constants';
import {
  decodeAlertCursor,
  encodeAlertCursor,
} from '@/modules/alerts/domain/cursor';
import type { AlertEvent } from '@/modules/alerts/domain/entities/alert-event.entity';
import { InvalidAlertCursorError } from '@/modules/alerts/domain/errors/alert.errors';
import type { AlertRepository } from '@/modules/alerts/domain/repositories/alert.repository';
import { ListAlertsUseCase } from './list-alerts.use-case';

const USER_ID = 'user-1';

type MockOf<T> = { [K in keyof T]: jest.Mock };

function alert(index: number, overrides: Partial<AlertEvent> = {}): AlertEvent {
  return {
    id: `0000000${String(index).padStart(4, '0')}-0000-7000-8000-00000000000a`,
    petId: 'pet-1',
    petName: 'Firulais',
    type: 'geofence_exit',
    status: 'open',
    geofenceId: 'geofence-1',
    payload: {},
    openedAt: new Date(Date.UTC(2026, 7, 1, 0, 0, index)),
    ackedAt: null,
    closedAt: null,
    ...overrides,
  };
}

function repositoryStub(rows: AlertEvent[]): MockOf<AlertRepository> {
  return {
    listForMember: jest.fn().mockResolvedValue(rows),
    findForMember: jest.fn(),
    ack: jest.fn(),
  };
}

describe('R16: GET /v1/alerts agrega las alertas de todas mis mascotas en una lista', () => {
  it('devuelve los elementos tal cual los ordena el repositorio (opened_at DESC, id DESC)', async () => {
    const rows = [
      alert(2, { petId: 'pet-a', petName: 'Firulais' }),
      alert(1, { petId: 'pet-b', petName: 'Michi' }),
    ];
    const repository = repositoryStub(rows);

    const result = await new ListAlertsUseCase(repository).execute({
      userId: USER_ID,
    });

    expect(result.items).toEqual(rows);
    expect(result.items.map((item) => item.petId)).toEqual(['pet-a', 'pet-b']);
    expect(result.nextCursor).toBeNull();
  });
});

describe('R17: filtro ?status= exacto; ausente devuelve los tres estados', () => {
  it('propaga el status al repositorio cuando viene', async () => {
    const repository = repositoryStub([]);

    await new ListAlertsUseCase(repository).execute({
      userId: USER_ID,
      status: 'open',
    });

    expect(repository.listForMember).toHaveBeenCalledWith(
      expect.objectContaining({ userId: USER_ID, status: 'open' }),
    );
  });

  it('sin el parametro no filtra por estado', async () => {
    const repository = repositoryStub([]);

    await new ListAlertsUseCase(repository).execute({ userId: USER_ID });

    expect(repository.listForMember).toHaveBeenCalledWith(
      expect.objectContaining({ status: undefined }),
    );
  });
});

describe('R18: paginacion keyset {items, nextCursor} sin duplicados ni saltos', () => {
  const total = ALERTS_PAGE_SIZE + 1;
  const all = Array.from({ length: total }, (_, i) => alert(total - i));

  it('pide una fila de sonda (PAGE_SIZE + 1) para saber si hay pagina siguiente', async () => {
    const repository = repositoryStub(all);

    await new ListAlertsUseCase(repository).execute({ userId: USER_ID });

    expect(repository.listForMember).toHaveBeenCalledWith(
      expect.objectContaining({ limit: ALERTS_PAGE_SIZE + 1 }),
    );
  });

  it('trunca al tamaño de pagina y emite nextCursor apuntando al ultimo devuelto', async () => {
    const repository = repositoryStub(all);
    const useCase = new ListAlertsUseCase(repository);

    const first = await useCase.execute({ userId: USER_ID });

    expect(first.items).toHaveLength(ALERTS_PAGE_SIZE);
    expect(first.nextCursor).not.toBeNull();

    const last = first.items[ALERTS_PAGE_SIZE - 1];
    expect(decodeAlertCursor(first.nextCursor as string)).toEqual({
      openedAtMs: last.openedAt.getTime(),
      id: last.id,
      status: null,
    });
  });

  it('la segunda pagina reanuda justo despues del ultimo y concatena sin duplicados', async () => {
    const repository = repositoryStub(all);
    const useCase = new ListAlertsUseCase(repository);

    const first = await useCase.execute({ userId: USER_ID });

    repository.listForMember.mockResolvedValue(all.slice(ALERTS_PAGE_SIZE));
    const second = await useCase.execute({
      userId: USER_ID,
      cursor: first.nextCursor as string,
    });

    expect(repository.listForMember).toHaveBeenLastCalledWith(
      expect.objectContaining({
        after: {
          openedAtMs: first.items[ALERTS_PAGE_SIZE - 1].openedAt.getTime(),
          id: first.items[ALERTS_PAGE_SIZE - 1].id,
        },
      }),
    );
    expect(second.nextCursor).toBeNull();

    const concatenated = [...first.items, ...second.items].map((a) => a.id);
    expect(concatenated).toEqual(all.map((a) => a.id));
    expect(new Set(concatenated).size).toBe(total);
  });

  it('un cursor indecodificable lanza InvalidAlertCursorError sin consultar la base', async () => {
    const repository = repositoryStub([]);
    const useCase = new ListAlertsUseCase(repository);

    for (const cursor of [
      '',
      'basura',
      Buffer.from('{}').toString('base64url'),
    ]) {
      await expect(
        useCase.execute({ userId: USER_ID, cursor }),
      ).rejects.toBeInstanceOf(InvalidAlertCursorError);
    }
    expect(repository.listForMember).not.toHaveBeenCalled();
  });

  it('un cursor emitido con otro filtro de status no sirve para esta consulta', async () => {
    const repository = repositoryStub([]);
    const cursor = encodeAlertCursor({
      openedAtMs: 1,
      id: 'x',
      status: 'open',
    });

    await expect(
      new ListAlertsUseCase(repository).execute({ userId: USER_ID, cursor }),
    ).rejects.toBeInstanceOf(InvalidAlertCursorError);
  });
});

describe('R19: aislamiento — el conjunto de mascotas sale del pet_users del usuario', () => {
  it('el use case no acepta ningun parametro que amplie el conjunto de mascotas', async () => {
    const repository = repositoryStub([]);

    await new ListAlertsUseCase(repository).execute({
      userId: USER_ID,
      status: 'open',
      cursor: undefined,
    });

    const calls = repository.listForMember.mock.calls as unknown[][];
    const input = calls[0][0] as Record<string, unknown>;
    expect(Object.keys(input).sort()).toEqual(
      ['userId', 'status', 'after', 'limit'].sort(),
    );
    expect(input.userId).toBe(USER_ID);
  });

  it('un usuario sin ninguna membresia recibe la lista vacia, no un error', async () => {
    const result = await new ListAlertsUseCase(repositoryStub([])).execute({
      userId: 'sin-mascotas',
    });

    expect(result).toEqual({ items: [], nextCursor: null });
  });
});
