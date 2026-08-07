import { decodeAlertCursor, encodeAlertCursor } from './cursor';
import { InvalidAlertCursorError } from './errors/alert.errors';

describe('R18: cursor keyset (opened_at, id) en base64url versionado', () => {
  const payload = {
    openedAtMs: Date.UTC(2026, 7, 1, 12, 0, 0),
    id: '01924a3f-0000-7000-8000-0000000000bb',
    status: null,
  };

  it('encode/decode es una ida y vuelta exacta', () => {
    expect(decodeAlertCursor(encodeAlertCursor(payload))).toEqual(payload);
  });

  it('conserva el filtro de status con el que se emitio', () => {
    const withStatus = { ...payload, status: 'acked' as const };
    expect(decodeAlertCursor(encodeAlertCursor(withStatus))).toEqual(
      withStatus,
    );
  });

  it('no viaja en claro pero tampoco pretende ser secreto: es base64url legible', () => {
    const encoded = encodeAlertCursor(payload);
    expect(encoded).not.toContain('=');
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
  });

  it('lanza InvalidAlertCursorError ante basura, otra version u otro shape', () => {
    const badVersion = Buffer.from(
      JSON.stringify({ v: 99, o: 1, i: 'x', s: null }),
    ).toString('base64url');

    for (const raw of [
      '',
      'no-es-base64url-valido-!!!',
      Buffer.from('{}').toString('base64url'),
      Buffer.from(
        JSON.stringify({ v: 1, o: 'no-numero', i: 'x', s: null }),
      ).toString('base64url'),
      badVersion,
    ]) {
      expect(() => decodeAlertCursor(raw)).toThrow(InvalidAlertCursorError);
    }
  });
});
