import { calculateAgeMonths } from './pet.entity';

const CREATED_AT = new Date('2026-01-10T12:00:00.000Z');

describe('R6: ageMonths con birth_date son los meses completos hasta hoy', () => {
  it('devuelve 24 en el cumplemes exacto', () => {
    expect(
      calculateAgeMonths(
        { birthDate: '2024-01-15', approxAgeMonths: null, createdAt: CREATED_AT },
        new Date('2026-01-15T00:00:00.000Z'),
      ),
    ).toBe(24);
  });

  it('devuelve 23 un dia antes del cumplemes (mes incompleto no cuenta)', () => {
    expect(
      calculateAgeMonths(
        { birthDate: '2024-01-15', approxAgeMonths: null, createdAt: CREATED_AT },
        new Date('2026-01-14T23:59:59.000Z'),
      ),
    ).toBe(23);
  });

  it('borde fin de mes: nacido el 31/01, al 28/02 aun no cumple el mes', () => {
    expect(
      calculateAgeMonths(
        { birthDate: '2024-01-31', approxAgeMonths: null, createdAt: CREATED_AT },
        new Date('2024-02-28T00:00:00.000Z'),
      ),
    ).toBe(0);
  });

  it('borde fin de mes: nacido el 31/01, al 01/03 ya cumplio un mes', () => {
    expect(
      calculateAgeMonths(
        { birthDate: '2024-01-31', approxAgeMonths: null, createdAt: CREATED_AT },
        new Date('2024-03-01T00:00:00.000Z'),
      ),
    ).toBe(1);
  });

  it('devuelve 0 para un cachorro de dias', () => {
    expect(
      calculateAgeMonths(
        { birthDate: '2026-01-05', approxAgeMonths: null, createdAt: CREATED_AT },
        new Date('2026-01-20T00:00:00.000Z'),
      ),
    ).toBe(0);
  });

  it('birth_date tiene precedencia si ambos campos estuvieran presentes', () => {
    expect(
      calculateAgeMonths(
        { birthDate: '2024-01-15', approxAgeMonths: 99, createdAt: CREATED_AT },
        new Date('2026-01-15T00:00:00.000Z'),
      ),
    ).toBe(24);
  });
});

describe('R6: ageMonths con approx_age_months avanza anclado a created_at', () => {
  it('devuelve la edad declarada el mismo dia del alta', () => {
    expect(
      calculateAgeMonths(
        { birthDate: null, approxAgeMonths: 6, createdAt: CREATED_AT },
        new Date('2026-01-10T18:00:00.000Z'),
      ),
    ).toBe(6);
  });

  it('suma los meses completos transcurridos desde el alta', () => {
    expect(
      calculateAgeMonths(
        { birthDate: null, approxAgeMonths: 6, createdAt: CREATED_AT },
        new Date('2026-03-10T00:00:00.000Z'),
      ),
    ).toBe(8);
  });

  it('no suma el mes en curso si aun no se completa', () => {
    expect(
      calculateAgeMonths(
        { birthDate: null, approxAgeMonths: 6, createdAt: CREATED_AT },
        new Date('2026-03-09T23:59:59.000Z'),
      ),
    ).toBe(7);
  });
});
