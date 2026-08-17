import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { WIALON_SID_TTL_MS } from './wialon-http.client';
import { WialonApiError } from './wialon.errors';
import { WialonHttpClient } from './wialon-http.client';

const BASE_URL = 'https://wialon.test/wialon/ajax.html';
const loadIntervalFixture: unknown = JSON.parse(
  readFileSync(
    join(__dirname, '__fixtures__', 'wialon-load-interval.json'),
    'utf8',
  ),
);

interface RecordedCall {
  svc: string;
  params: unknown;
  sid: string | null;
}

/**
 * fetch mockeado (sin red): responde en orden la lista de payloads y graba
 * cada llamada decodificada (svc, params, sid) para las aserciones.
 */
function fetchStub(payloads: unknown[]): {
  fetchFn: typeof fetch;
  calls: RecordedCall[];
} {
  const calls: RecordedCall[] = [];
  let index = 0;

  const fetchFn = ((_url: unknown, init?: { body?: unknown }) => {
    const rawBody = typeof init?.body === 'string' ? init.body : '';
    const body = new URLSearchParams(rawBody);
    calls.push({
      svc: body.get('svc') ?? '',
      params: JSON.parse(body.get('params') ?? 'null'),
      sid: body.get('sid'),
    });
    const payload = payloads[Math.min(index, payloads.length - 1)];
    index += 1;
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(payload),
    });
  }) as unknown as typeof fetch;

  return { fetchFn, calls };
}

const LOGIN_OK = { eid: 'sid-123', user: { nm: 'test' } };

describe('R4: WialonHttpClient mapea la respuesta real (pos.y/x/s/c/sc) y {error: N} => WialonApiError tipado', () => {
  it('getMessages hace login por token y pide messages/load_interval con los flags del plan', async () => {
    const { fetchFn, calls } = fetchStub([LOGIN_OK, loadIntervalFixture]);
    const client = new WialonHttpClient(BASE_URL, 'real-token', fetchFn);

    const fromTs = 1_754_049_600_000;
    const toTs = 1_754_049_690_000;
    await client.getMessages('900001', fromTs, toTs);

    expect(calls).toHaveLength(2);
    expect(calls[0]).toEqual({
      svc: 'token/login',
      params: { token: 'real-token' },
      sid: null,
    });
    expect(calls[1].svc).toBe('messages/load_interval');
    expect(calls[1].sid).toBe('sid-123');
    expect(calls[1].params).toEqual({
      itemId: 900001,
      timeFrom: 1_754_049_600,
      timeTo: 1_754_049_690,
      flags: 1,
      flagsMask: 65281,
      loadCount: 500,
    });
  });

  it('mapea pos.y->lat, pos.x->lng, pos.s->speedKmh, pos.c->course, pos.sc->sats, t*1000->ts y bateria desde params', async () => {
    const { fetchFn } = fetchStub([LOGIN_OK, loadIntervalFixture]);
    const client = new WialonHttpClient(BASE_URL, 'real-token', fetchFn);

    const positions = await client.getMessages('900001', 0, 2_000_000_000_000);

    // El mensaje sin `pos` del fixture se omite: 4 mensajes -> 3 posiciones.
    expect(positions).toHaveLength(3);
    expect(positions[0]).toEqual({
      lat: 19.43261,
      lng: -99.13332,
      ts: 1_754_049_600_000,
      speedKmh: 4,
      course: 180,
      sats: 8,
      altitude: 2240,
      batteryPct: 87,
    });
    // Sin bateria en params: batteryPct ausente, no 0.
    expect(positions[1].batteryPct).toBeUndefined();
    expect(positions[1].ts).toBe(1_754_049_630_000);
  });

  it('listUnits busca avl_unit via core/search_items y mapea id/nm', async () => {
    const searchResponse = {
      items: [
        { id: 900001, nm: 'SIM-001' },
        { id: 900002, nm: 'SIM-002' },
      ],
    };
    const { fetchFn, calls } = fetchStub([LOGIN_OK, searchResponse]);
    const client = new WialonHttpClient(BASE_URL, 'real-token', fetchFn);

    const units = await client.listUnits();

    expect(calls[1].svc).toBe('core/search_items');
    expect(calls[1].params).toMatchObject({
      spec: { itemsType: 'avl_unit' },
    });
    expect(units).toEqual([
      { unitId: '900001', name: 'SIM-001' },
      { unitId: '900002', name: 'SIM-002' },
    ]);
  });

  it('una respuesta {error: N} lanza WialonApiError con el codigo, nunca un error crudo', async () => {
    const { fetchFn } = fetchStub([{ error: 4 }]);
    const client = new WialonHttpClient(BASE_URL, 'bad-token', fetchFn);

    const attempt = client.getMessages('900001', 0, 1000);

    await expect(attempt).rejects.toBeInstanceOf(WialonApiError);
    await expect(client.getMessages('900001', 0, 1000)).rejects.toMatchObject({
      code: 4,
      name: 'WialonApiError',
    });
  });

  it('un fallo HTTP (status no-ok) tambien llega como error de dominio tipado', async () => {
    const fetchFn = (() =>
      Promise.resolve({
        ok: false,
        status: 503,
        json: () => Promise.resolve({}),
      })) as unknown as typeof fetch;
    const client = new WialonHttpClient(BASE_URL, 'real-token', fetchFn);

    await expect(client.listUnits()).rejects.toMatchObject({
      name: 'WialonTransportError',
    });
  });
});

describe('R6 (wialon-session-reuse #29): WIALON_SID_TTL_MS está por debajo de la caducidad de Wialon', () => {
  it('la constante existe y no supera los 5 minutos documentados', () => {
    const WIALON_DOCUMENTED_INACTIVITY_MS = 5 * 60_000;
    expect(WIALON_SID_TTL_MS).toBe(4 * 60_000);
    expect(WIALON_SID_TTL_MS).toBeLessThan(WIALON_DOCUMENTED_INACTIVITY_MS);
  });

  it('la fuente exporta la justificación completa y no usa literales de 4 minutos', () => {
    const source = readFileSync(
      join(__dirname, 'wialon-http.client.ts'),
      'utf8',
    );
    expect(source).toContain('WIALON_SID_TTL_MS');
    expect(source).toContain('help.wialon.com');
    expect(source).not.toMatch(/240_?000/);
    expect(source.length).toBeGreaterThan(1000);
  });
});

describe('R1 (wialon-session-reuse #29): el sid se cachea y se comparte entre listUnits() y getMessages()', () => {
  it('una misma instancia reutiliza el sid entre listUnits() y llamadas posteriores', async () => {
    const { fetchFn, calls } = fetchStub([
      LOGIN_OK,
      loadIntervalFixture,
      loadIntervalFixture,
      loadIntervalFixture,
      loadIntervalFixture,
    ]);
    const client = new WialonHttpClient(BASE_URL, 'real-token', fetchFn);

    await client.listUnits();
    await client.getMessages('900001', 1_754_049_600_000, 1_754_049_690_000);
    await client.getMessages('900001', 1_754_049_700_000, 1_754_049_790_000);
    await client.getMessages('900001', 1_754_049_800_000, 1_754_049_890_000);

    expect(calls.filter((call) => call.svc === 'token/login')).toHaveLength(1);
    expect(calls).toHaveLength(5);
    for (const call of calls.filter((call) => call.svc !== 'token/login')) {
      expect(call.sid).toBe('sid-123');
    }
  });

  it('dos instancias mantienen cachés de sid independientes', async () => {
    const { fetchFn, calls } = fetchStub([
      LOGIN_OK,
      loadIntervalFixture,
      { eid: 'sid-456', user: { nm: 'other' } },
      loadIntervalFixture,
    ]);
    const clientA = new WialonHttpClient(BASE_URL, 'real-token', fetchFn);
    const clientB = new WialonHttpClient(BASE_URL, 'real-token', fetchFn);

    await clientA.getMessages('900001', 1_754_049_600_000, 1_754_049_690_000);
    await clientB.getMessages('900001', 1_754_049_600_000, 1_754_049_690_000);

    const loginCalls = calls.filter((call) => call.svc === 'token/login');
    expect(loginCalls).toHaveLength(2);
    expect(calls).toHaveLength(4);
    expect(loginCalls[0].params).toEqual({ token: 'real-token' });
    expect(loginCalls[1].params).toEqual({ token: 'real-token' });
  });
});
