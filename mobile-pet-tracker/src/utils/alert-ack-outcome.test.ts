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

describe('#134 R4: el helper resuelve las ramas comunes en los dos idiomas', () => {
  it.each<{ language: 'en' | 'es'; expected: string }>([
    { language: 'en', expected: 'Cannot reach server' },
    { language: 'es', expected: 'No se pudo conectar con el servidor' },
  ])('unreachable $language', async ({ language, expected }) => {
    const handlers = makeHandlers(language);

    await expect(
      settleAlertAck(
        () => Promise.resolve({ kind: 'unreachable', message: 'network down' }),
        alert,
        handlers,
      ),
    ).resolves.toBeUndefined();

    expect(handlers.showError).toHaveBeenCalledTimes(1);
    expect(handlers.showError).toHaveBeenCalledWith(expected);
    expect(handlers.showError).not.toHaveBeenCalledWith('network down');
    expect(handlers.signOut).not.toHaveBeenCalled();
    expect(handlers.onAcked).not.toHaveBeenCalled();
    expect(handlers.onNotFound).not.toHaveBeenCalled();
  });

  it('unauthorized', async () => {
    const handlers = makeHandlers('es');

    await expect(
      settleAlertAck(() => Promise.resolve({ kind: 'unauthorized' }), alert, handlers),
    ).resolves.toBeUndefined();

    expect(handlers.signOut).toHaveBeenCalledTimes(1);
    expect(handlers.signOut).toHaveBeenCalledWith();
    expect(handlers.showError).not.toHaveBeenCalled();
    expect(handlers.onAcked).not.toHaveBeenCalled();
    expect(handlers.onNotFound).not.toHaveBeenCalled();
  });

  it.each<{
    kind: 'error' | 'missing-config';
    language: 'en' | 'es';
    expected: string;
  }>([
    { kind: 'error', language: 'en', expected: 'Something went wrong' },
    { kind: 'error', language: 'es', expected: 'Algo salió mal' },
    { kind: 'missing-config', language: 'en', expected: 'Something went wrong' },
    { kind: 'missing-config', language: 'es', expected: 'Algo salió mal' },
  ])('$kind $language', async ({ kind, language, expected }) => {
    const handlers = makeHandlers(language);

    await expect(
      settleAlertAck(() => Promise.resolve({ kind }), alert, handlers),
    ).resolves.toBeUndefined();

    expect(handlers.showError).toHaveBeenCalledTimes(1);
    expect(handlers.showError).toHaveBeenCalledWith(expected);
    expect(handlers.signOut).not.toHaveBeenCalled();
    expect(handlers.onAcked).not.toHaveBeenCalled();
    expect(handlers.onNotFound).not.toHaveBeenCalled();
  });
});

describe('#134 R5: el helper convierte toda excepción en el error genérico', () => {
  it.each<{ language: 'en' | 'es'; expected: string }>([
    { language: 'en', expected: 'Something went wrong' },
    { language: 'es', expected: 'Algo salió mal' },
  ])('la petición rechaza, $language', async ({ language, expected }) => {
    const handlers = makeHandlers(language);
    const request = () => Promise.reject(new Error('request failed'));

    await expect(settleAlertAck(request, alert, handlers)).resolves.toBeUndefined();

    expect(handlers.showError).toHaveBeenCalledTimes(1);
    expect(handlers.showError).toHaveBeenCalledWith(expected);
    expect(handlers.signOut).not.toHaveBeenCalled();
    expect(handlers.onAcked).not.toHaveBeenCalled();
    expect(handlers.onNotFound).not.toHaveBeenCalled();
  });

  it('la petición lanza de forma síncrona, es', async () => {
    const handlers = makeHandlers('es');
    const request = () => {
      throw new Error('sync failure');
    };

    await expect(settleAlertAck(request, alert, handlers)).resolves.toBeUndefined();

    expect(handlers.showError).toHaveBeenCalledTimes(1);
    expect(handlers.showError).toHaveBeenCalledWith('Algo salió mal');
    expect(handlers.signOut).not.toHaveBeenCalled();
    expect(handlers.onAcked).not.toHaveBeenCalled();
    expect(handlers.onNotFound).not.toHaveBeenCalled();
  });

  it.each<{ language: 'en' | 'es'; expected: string }>([
    { language: 'en', expected: 'Something went wrong' },
    { language: 'es', expected: 'Algo salió mal' },
  ])('signOut rechaza tras unauthorized, $language', async ({ language, expected }) => {
    const handlers = makeHandlers(language);
    handlers.signOut.mockRejectedValueOnce(new Error('sign-out failed'));

    await expect(
      settleAlertAck(() => Promise.resolve({ kind: 'unauthorized' }), alert, handlers),
    ).resolves.toBeUndefined();

    expect(handlers.signOut).toHaveBeenCalledTimes(1);
    expect(handlers.signOut).toHaveBeenCalledWith();
    expect(handlers.showError).toHaveBeenCalledTimes(1);
    expect(handlers.showError).toHaveBeenCalledWith(expected);
    expect(handlers.onAcked).not.toHaveBeenCalled();
    expect(handlers.onNotFound).not.toHaveBeenCalled();
  });
});
