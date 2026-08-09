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

  it('usa un upsert por species+name en una sola escritura', async () => {
    const onConflictDoUpdate = jest.fn().mockResolvedValue(undefined);
    const values = jest.fn().mockReturnValue({ onConflictDoUpdate });
    const insert = jest.fn().mockReturnValue({ values });

    await seedVaccineCatalog({ insert } as never);

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
