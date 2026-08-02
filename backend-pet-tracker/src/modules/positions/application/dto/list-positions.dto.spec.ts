import { ListPositionsQuerySchema } from './list-positions.dto';

describe('R7: la query string se valida con zod estricto (4 opcionales, nada mas)', () => {
  it('acepta la query vacia: los cuatro parametros son opcionales', () => {
    expect(ListPositionsQuerySchema.safeParse({}).success).toBe(true);
  });

  it('acepta los cuatro parametros con valores validos', () => {
    const result = ListPositionsQuerySchema.safeParse({
      from: '2026-08-02T08:00:00.000Z',
      to: '2026-08-02T09:00:00.000Z',
      cursor: 'eyJ2IjoxfQ',
      includeSuspect: 'true',
    });

    expect(result.success).toBe(true);
  });

  it('rechaza un from que no parsea a un instante ISO-8601 completo', () => {
    expect(ListPositionsQuerySchema.safeParse({ from: 'ayer' }).success).toBe(
      false,
    );
    expect(
      ListPositionsQuerySchema.safeParse({ from: '2026-08-02' }).success,
    ).toBe(false);
  });

  it('rechaza un to invalido igual que un from invalido', () => {
    expect(ListPositionsQuerySchema.safeParse({ to: 'manana' }).success).toBe(
      false,
    );
  });

  it('rechaza includeSuspect con un valor distinto de true/false', () => {
    expect(
      ListPositionsQuerySchema.safeParse({ includeSuspect: '1' }).success,
    ).toBe(false);
    expect(
      ListPositionsQuerySchema.safeParse({ includeSuspect: 'TRUE' }).success,
    ).toBe(false);
  });

  it('rechaza un parametro no reconocido en vez de ignorarlo', () => {
    expect(ListPositionsQuerySchema.safeParse({ foo: 'bar' }).success).toBe(
      false,
    );
    expect(
      ListPositionsQuerySchema.safeParse({
        from: '2026-08-02T08:00:00.000Z',
        limit: '10',
      }).success,
    ).toBe(false);
  });

  it('rechaza un cursor vacio', () => {
    expect(ListPositionsQuerySchema.safeParse({ cursor: '' }).success).toBe(
      false,
    );
  });

  it('acepta un instante con desfase horario explicito', () => {
    expect(
      ListPositionsQuerySchema.safeParse({ from: '2026-08-02T08:00:00-06:00' })
        .success,
    ).toBe(true);
  });
});
