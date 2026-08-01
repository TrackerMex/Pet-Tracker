import { CreatePetSchema } from './create-pet.dto';

function isoDateDaysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

function validBody(overrides: Record<string, unknown> = {}) {
  return { name: 'Firulais', species: 'dog', birthDate: '2024-01-15', ...overrides };
}

describe('R4: el schema de POST /v1/pets acepta el body valido', () => {
  it('acepta el minimo con birthDate', () => {
    const result = CreatePetSchema.safeParse(validBody());
    expect(result.success).toBe(true);
  });

  it('acepta el minimo con approxAgeMonths', () => {
    const result = CreatePetSchema.safeParse({
      name: 'Michi',
      species: 'cat',
      approxAgeMonths: 6,
    });
    expect(result.success).toBe(true);
  });

  it('acepta la ficha completa con todos los opcionales', () => {
    const result = CreatePetSchema.safeParse(
      validBody({
        breed: 'Labrador',
        sex: 'male',
        weightKg: 25.5,
        size: 'large',
        color: 'golden',
        sterilized: true,
        microchip: '985112004567890',
      }),
    );
    expect(result.success).toBe(true);
  });
});

describe('R4: el schema de POST /v1/pets rechaza cada campo invalido', () => {
  it.each([
    ['name ausente', { name: undefined }],
    ['name vacio', { name: '' }],
    ['name de mas de 120 caracteres', { name: 'a'.repeat(121) }],
    ['species fuera de dog/cat', { species: 'bird' }],
    ['birthDate con formato no ISO', { birthDate: '15/01/2024' }],
    ['birthDate inexistente en el calendario', { birthDate: '2024-02-30' }],
    ['birthDate posterior a hoy', { birthDate: isoDateDaysFromNow(1) }],
    ['sex fuera de male/female', { sex: 'other' }],
    ['size fuera de small/medium/large', { size: 'xl' }],
    ['sterilized no booleano', { sterilized: 'yes' }],
    ['microchip de mas de 32 caracteres', { microchip: 'a'.repeat(33) }],
    ['weightKg cero', { weightKg: 0 }],
    ['weightKg negativo', { weightKg: -1 }],
    ['weightKg por encima de numeric(5,2)', { weightKg: 1000 }],
  ])('rechaza %s', (_label, overrides) => {
    const result = CreatePetSchema.safeParse(validBody(overrides));
    expect(result.success).toBe(false);
  });

  it.each([
    ['approxAgeMonths no entero', 6.5],
    ['approxAgeMonths negativo', -1],
    ['approxAgeMonths mayor a 480', 481],
  ])('rechaza %s', (_label, approxAgeMonths) => {
    const result = CreatePetSchema.safeParse({
      name: 'Michi',
      species: 'cat',
      approxAgeMonths,
    });
    expect(result.success).toBe(false);
  });

  it('acepta birthDate de hoy (solo lo posterior es invalido)', () => {
    const result = CreatePetSchema.safeParse(
      validBody({ birthDate: isoDateDaysFromNow(0) }),
    );
    expect(result.success).toBe(true);
  });
});

describe('R5: exactamente uno de birthDate | approxAgeMonths', () => {
  it('rechaza el body con ambos presentes', () => {
    const result = CreatePetSchema.safeParse(
      validBody({ approxAgeMonths: 12 }),
    );
    expect(result.success).toBe(false);
  });

  it('rechaza el body sin ninguno de los dos', () => {
    const result = CreatePetSchema.safeParse({
      name: 'Firulais',
      species: 'dog',
    });
    expect(result.success).toBe(false);
  });
});
