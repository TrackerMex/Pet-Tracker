import type { Alert } from '../api/types';
import { en, es, type TranslationKey } from '../i18n/catalog';

import { settleAlertAck, type AlertAckHandlers } from './alert-ack-outcome';

const alert: Alert = {
  id: 'alert-1',
  petId: 'pet-1',
  petName: 'Rex',
  type: 'geofence_exit',
  status: 'open',
  geofenceId: 'geofence-1',
  payload: {},
  openedAt: '2026-10-09T12:00:00.000Z',
  ackedAt: null,
  closedAt: null,
};

const next: Alert = {
  ...alert,
  status: 'acked',
  ackedAt: '2026-10-09T12:01:00.000Z',
};

function makeHandlers(language: 'en' | 'es') {
  const catalog = language === 'en' ? en : es;
  return {
    t: jest.fn((key: TranslationKey) => catalog[key]),
    signOut: jest.fn(async () => {}),
    showError: jest.fn<void, [string]>(),
    onAcked: jest.fn<void, [Alert]>(),
    onNotFound: jest.fn<void, []>(),
  } satisfies AlertAckHandlers;
}

describe('#134 R3: el helper entrega las ramas delegadas a la pantalla', () => {
  it('ok entrega el Alert devuelto sin copiarlo', async () => {
    const handlers = makeHandlers('es');

    await expect(
      settleAlertAck(() => Promise.resolve({ kind: 'ok', alert: next }), alert, handlers),
    ).resolves.toBeUndefined();

    expect(handlers.onAcked).toHaveBeenCalledTimes(1);
    expect(handlers.onAcked.mock.calls[0][0]).toBe(next);
    expect(handlers.signOut).not.toHaveBeenCalled();
    expect(handlers.showError).not.toHaveBeenCalled();
    expect(handlers.onNotFound).not.toHaveBeenCalled();
  });

  it('already-closed entrega una copia cerrada del Alert de la fila', async () => {
    const handlers = makeHandlers('es');

    await expect(
      settleAlertAck(() => Promise.resolve({ kind: 'already-closed' }), alert, handlers),
    ).resolves.toBeUndefined();

    expect(handlers.onAcked).toHaveBeenCalledTimes(1);
    expect(handlers.onAcked).toHaveBeenCalledWith({ ...alert, status: 'closed' });
    expect(handlers.onAcked.mock.calls[0][0]).not.toBe(alert);
    expect(alert.status).toBe('open');
    expect(handlers.signOut).not.toHaveBeenCalled();
    expect(handlers.showError).not.toHaveBeenCalled();
    expect(handlers.onNotFound).not.toHaveBeenCalled();
  });

  it('not-found delega en onNotFound', async () => {
    const handlers = makeHandlers('es');

    await expect(
      settleAlertAck(() => Promise.resolve({ kind: 'not-found' }), alert, handlers),
    ).resolves.toBeUndefined();

    expect(handlers.onNotFound).toHaveBeenCalledTimes(1);
    expect(handlers.onNotFound).toHaveBeenCalledWith();
    expect(handlers.signOut).not.toHaveBeenCalled();
    expect(handlers.showError).not.toHaveBeenCalled();
    expect(handlers.onAcked).not.toHaveBeenCalled();
  });
});
