import { ListAlertsQuerySchema } from './list-alerts.dto';

describe('R17: la query string de GET /v1/alerts es strictObject (400 en lo demas)', () => {
  it('acepta la query vacia — sin ?status devuelve los tres estados', () => {
    expect(ListAlertsQuerySchema.safeParse({}).success).toBe(true);
  });

  it('acepta los tres estados de alert_events', () => {
    for (const status of ['open', 'acked', 'closed']) {
      expect(ListAlertsQuerySchema.safeParse({ status }).success).toBe(true);
    }
  });

  it('rechaza cualquier otro valor de status', () => {
    for (const status of ['nope', 'OPEN', '', 'resolved']) {
      expect(ListAlertsQuerySchema.safeParse({ status }).success).toBe(false);
    }
  });

  it('rechaza ?limit= — el tamaño de pagina es constante (R18, mismo criterio D4 de #9)', () => {
    expect(ListAlertsQuerySchema.safeParse({ limit: '5' }).success).toBe(false);
  });

  it('rechaza cualquier clave desconocida', () => {
    expect(ListAlertsQuerySchema.safeParse({ petId: 'x' }).success).toBe(false);
    expect(ListAlertsQuerySchema.safeParse({ userId: 'x' }).success).toBe(
      false,
    );
  });

  it('acepta un cursor no vacio', () => {
    expect(ListAlertsQuerySchema.safeParse({ cursor: 'abc' }).success).toBe(
      true,
    );
    expect(ListAlertsQuerySchema.safeParse({ cursor: '' }).success).toBe(false);
  });
});
