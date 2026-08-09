import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { seedVaccineCatalog, VACCINE_CATALOG_SEED } from './vaccine-catalog';

describe('R2: seed idempotente del catalogo de vacunas', () => {
  it('declara exactamente cuatro vacunas dog y tres cat con sus schemes', () => {
    expect(VACCINE_CATALOG_SEED).toEqual([
      {
        species: 'dog',
        name: 'Rabia',
        scheme: { firstDoseMonths: 3, boosterMonths: 12 },
      },
      {
        species: 'dog',
        name: 'Polivalente (DHPPi)',
        scheme: { firstDoseMonths: 2, series: [2, 3, 4], boosterMonths: 12 },
      },
      {
        species: 'dog',
        name: 'Leptospirosis',
        scheme: { firstDoseMonths: 3, boosterMonths: 12 },
      },
      {
        species: 'dog',
        name: 'Tos de las perreras',
        scheme: { firstDoseMonths: 3, boosterMonths: 12 },
      },
      {
        species: 'cat',
        name: 'Triple felina (FVRCP)',
        scheme: { firstDoseMonths: 2, series: [2, 3], boosterMonths: 12 },
      },
      {
        species: 'cat',
        name: 'Leucemia felina (FeLV)',
        scheme: { firstDoseMonths: 2, boosterMonths: 12 },
      },
      {
        species: 'cat',
        name: 'Rabia',
        scheme: { firstDoseMonths: 3, boosterMonths: 12 },
      },
    ]);
  });

  it('elimina extras y hace upsert por species+name en una transaccion', async () => {
    const onConflictDoUpdate = jest.fn().mockResolvedValue(undefined);
    const values = jest.fn().mockReturnValue({ onConflictDoUpdate });
    const insert = jest.fn().mockReturnValue({ values });
    const where = jest.fn().mockResolvedValue(undefined);
    const remove = jest.fn().mockReturnValue({ where });
    const transaction = jest.fn(async (work: (tx: unknown) => Promise<void>) =>
      work({ insert, delete: remove }),
    );

    await seedVaccineCatalog({ transaction } as never);

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledTimes(1);
    expect(where).toHaveBeenCalledTimes(1);
    expect(values).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ species: 'dog', name: 'Rabia' }),
        expect.objectContaining({ species: 'cat', name: 'Rabia' }),
      ]),
    );
    expect(onConflictDoUpdate).toHaveBeenCalledTimes(1);
  });

  it('package.json expone seed:vaccines mediante ts-node y tsconfig-paths', () => {
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, '..', '..', '..', 'package.json'), 'utf8'),
    ) as { scripts?: Record<string, string> };

    expect(packageJson.scripts?.['seed:vaccines']).toMatch(
      /ts-node -r tsconfig-paths\/register scripts\/seed-vaccines\.ts/,
    );
  });
});
