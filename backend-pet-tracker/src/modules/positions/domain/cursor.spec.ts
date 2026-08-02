import { CURSOR_VERSION } from '@/modules/positions/positions.constants';
import { decodeCursor, encodeCursor, queryFingerprint } from './cursor';
import { InvalidCursorError } from './errors/position.errors';

const PET_A = '018f5a3e-0000-7000-8000-000000000001';
const PET_B = '018f5a3e-0000-7000-8000-000000000002';

const FINGERPRINT = queryFingerprint(
  1_754_121_600_000,
  1_754_125_200_000,
  false,
);

function envelope(raw: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(raw, 'base64url').toString('utf-8')) as Record<
    string,
    unknown
  >;
}

function fabricate(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
}

describe('R13: el cursor es base64url opaco {v, p, q, k} y hace round-trip exacto', () => {
  it('codifica version, petId, huella de consulta y sk de arranque', () => {
    const cursor = encodeCursor({
      petId: PET_A,
      fingerprint: FINGERPRINT,
      lastSk: 1_754_123_456_789,
    });

    expect(envelope(cursor)).toEqual({
      v: CURSOR_VERSION,
      p: PET_A,
      q: FINGERPRINT,
      k: 1_754_123_456_789,
    });
  });

  it('no serializa la pk: la particion se reconstruye desde la ruta', () => {
    const cursor = encodeCursor({
      petId: PET_A,
      fingerprint: FINGERPRINT,
      lastSk: 1,
    });

    expect(Object.keys(envelope(cursor)).sort()).toEqual(['k', 'p', 'q', 'v']);
    expect(JSON.stringify(envelope(cursor))).not.toContain('PET#');
  });

  it('es base64url: sin +, / ni relleno =', () => {
    const cursor = encodeCursor({
      petId: PET_A,
      fingerprint: FINGERPRINT,
      lastSk: 1_754_123_456_789,
    });

    expect(cursor).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('decodeCursor(encodeCursor(x)) devuelve x', () => {
    const payload = {
      petId: PET_A,
      fingerprint: FINGERPRINT,
      lastSk: 1_754_123_456_789,
    };

    expect(decodeCursor(encodeCursor(payload))).toEqual(payload);
  });

  it('la huella es determinista y distingue rango e includeSuspect', () => {
    expect(queryFingerprint(10, 20, false)).toBe(
      queryFingerprint(10, 20, false),
    );
    expect(queryFingerprint(10, 20, false)).not.toBe(
      queryFingerprint(10, 21, false),
    );
    expect(queryFingerprint(10, 20, false)).not.toBe(
      queryFingerprint(10, 20, true),
    );
  });
});

describe('R14: un cursor que no decodifica, no es v=1 o esta incompleto es InvalidCursorError', () => {
  it('basura que no es base64url valido', () => {
    expect(() => decodeCursor('???')).toThrow(InvalidCursorError);
  });

  it('base64url valido cuyo contenido no es JSON', () => {
    const notJson = Buffer.from('no soy json', 'utf-8').toString('base64url');

    expect(() => decodeCursor(notJson)).toThrow(InvalidCursorError);
  });

  it('JSON que no es un objeto', () => {
    expect(() => decodeCursor(fabricate([1, 2, 3] as never))).toThrow(
      InvalidCursorError,
    );
  });

  it('version distinta de 1', () => {
    expect(() =>
      decodeCursor(fabricate({ v: 2, p: PET_A, q: FINGERPRINT, k: 1 })),
    ).toThrow(InvalidCursorError);
  });

  it('sk ausente o no numerico', () => {
    expect(() =>
      decodeCursor(fabricate({ v: 1, p: PET_A, q: FINGERPRINT })),
    ).toThrow(InvalidCursorError);
    expect(() =>
      decodeCursor(fabricate({ v: 1, p: PET_A, q: FINGERPRINT, k: 'x' })),
    ).toThrow(InvalidCursorError);
  });

  it('petId o huella ausentes', () => {
    expect(() =>
      decodeCursor(fabricate({ v: 1, q: FINGERPRINT, k: 1 })),
    ).toThrow(InvalidCursorError);
    expect(() => decodeCursor(fabricate({ v: 1, p: PET_A, k: 1 }))).toThrow(
      InvalidCursorError,
    );
  });

  it('un cursor de otra mascota decodifica, pero con su petId a la vista para que el caso de uso lo rechace', () => {
    const foreign = encodeCursor({
      petId: PET_B,
      fingerprint: FINGERPRINT,
      lastSk: 7,
    });

    expect(decodeCursor(foreign).petId).toBe(PET_B);
    expect(decodeCursor(foreign).petId).not.toBe(PET_A);
  });
});
