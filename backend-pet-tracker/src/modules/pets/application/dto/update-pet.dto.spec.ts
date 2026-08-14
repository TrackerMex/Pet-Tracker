import { UpdatePetSchema } from './update-pet.dto';

describe('R13: el schema de PATCH acepta subconjuntos validos del DTO de creacion', () => {
  it.each([
    ['solo name', { name: 'Firu' }],
    ['varios campos', { breed: 'Criollo', sterilized: false, size: 'medium' }],
    ['body vacio (no-op de R15)', {}],
  ])('acepta %s', (_label, body) => {
    expect(UpdatePetSchema.safeParse(body).success).toBe(true);
  });

  it.each([
    ['name vacio', { name: '' }],
    ['species fuera de dog/cat', { species: 'bird' }],
    ['approxAgeMonths no entero', { approxAgeMonths: 3.5 }],
    ['birthDate futura', { birthDate: '2999-01-01' }],
    ['microchip de mas de 32 caracteres', { microchip: 'a'.repeat(33) }],
  ])('rechaza %s (mismas reglas que R4)', (_label, body) => {
    expect(UpdatePetSchema.safeParse(body).success).toBe(false);
  });

  it('descarta claves no reconocidas (quedan fuera del no-op de R15)', () => {
    const result = UpdatePetSchema.safeParse({ unknownField: 1 });

    expect(result.success).toBe(true);
    expect(result.success && result.data).toEqual({});
  });

  it('descarta weightKg como campo no reconocido (R2 #22)', () => {
    const result = UpdatePetSchema.safeParse({ weightKg: 99 });

    expect(result.success).toBe(true);
    expect(result.success && result.data).toEqual({});
  });
});

describe('R14: PATCH con birthDate y approxAgeMonths a la vez responde 400', () => {
  it('rechaza el body con ambos presentes', () => {
    expect(
      UpdatePetSchema.safeParse({
        birthDate: '2024-01-15',
        approxAgeMonths: 12,
      }).success,
    ).toBe(false);
  });

  it('acepta solo birthDate', () => {
    expect(UpdatePetSchema.safeParse({ birthDate: '2024-01-15' }).success).toBe(
      true,
    );
  });

  it('acepta solo approxAgeMonths', () => {
    expect(UpdatePetSchema.safeParse({ approxAgeMonths: 12 }).success).toBe(
      true,
    );
  });
});
