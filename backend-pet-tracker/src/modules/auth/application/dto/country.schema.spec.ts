import { CountrySchema } from './country.schema';

describe('R12: CountrySchema exige ISO 3166-1 alpha-2 en mayusculas', () => {
  it('acepta un codigo valido', () => {
    expect(CountrySchema.safeParse('MX').success).toBe(true);
  });

  it('rechaza minusculas', () => {
    expect(CountrySchema.safeParse('mx').success).toBe(false);
  });

  it('rechaza longitud distinta de 2', () => {
    expect(CountrySchema.safeParse('MEX').success).toBe(false);
    expect(CountrySchema.safeParse('M').success).toBe(false);
  });
});
