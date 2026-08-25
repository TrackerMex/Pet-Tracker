import { CreatePetDocumentSchema } from './create-pet-document.dto';

describe('R2: CreatePetDocumentSchema valida el body', () => {
  it('acepta fecha real, recorta textos y permite omitir vet', () => {
    expect(
      CreatePetDocumentSchema.parse({
        type: '  Vacunación  ',
        name: '  Cartilla anual  ',
        date: '2026-08-25',
      }),
    ).toEqual({
      type: 'Vacunación',
      name: 'Cartilla anual',
      date: '2026-08-25',
    });

    expect(
      CreatePetDocumentSchema.parse({
        type: 'Consulta',
        name: 'Control',
        date: '2030-01-01',
        vet: '  Dra. Rivera  ',
      }),
    ).toEqual({
      type: 'Consulta',
      name: 'Control',
      date: '2030-01-01',
      vet: 'Dra. Rivera',
    });
  });

  it.each([
    ['campos ausentes', {}],
    ['type vacío', { type: '   ', name: 'Cartilla', date: '2026-08-25' }],
    [
      'type mayor a 40',
      { type: 'x'.repeat(41), name: 'Cartilla', date: '2026-08-25' },
    ],
    [
      'name mayor a 120',
      { type: 'Vacuna', name: 'x'.repeat(121), date: '2026-08-25' },
    ],
    [
      'fecha inexistente',
      { type: 'Vacuna', name: 'Cartilla', date: '2026-02-30' },
    ],
    [
      'vet vacío',
      { type: 'Vacuna', name: 'Cartilla', date: '2026-08-25', vet: ' ' },
    ],
    [
      'vet mayor a 120',
      {
        type: 'Vacuna',
        name: 'Cartilla',
        date: '2026-08-25',
        vet: 'x'.repeat(121),
      },
    ],
  ])('rechaza %s', (_label, body) => {
    expect(CreatePetDocumentSchema.safeParse(body).success).toBe(false);
  });
});
