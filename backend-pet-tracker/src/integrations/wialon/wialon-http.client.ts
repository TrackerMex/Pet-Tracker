import type { RawPosition } from '@/pipeline/types';
import type { WialonClient, WialonUnit } from './wialon-client.interface';
import {
  WialonApiError,
  WialonTransportError,
  isInvalidSessionError,
} from './wialon.errors';

// Parametros fijos del plan 005 §Paso 1 para messages/load_interval.
const LOAD_INTERVAL_FLAGS = 1;
const LOAD_INTERVAL_FLAGS_MASK = 65281;
const LOAD_INTERVAL_MAX_COUNT = 500;

/**
 * 4 minutos, por debajo de los 5 minutos de inactividad de Wialon (si no hay
 * actividad, la sesión deja de ser válida): https://help.wialon.com/en/api/expert-articles/faq/frequently-asked-questions
 */
export const WIALON_SID_TTL_MS = 4 * 60_000;

/** Busqueda de unidades AVL — spec estandar de core/search_items. */
const SEARCH_UNITS_PARAMS = {
  spec: {
    itemsType: 'avl_unit',
    propName: 'sys_name',
    propValueMask: '*',
    sortType: 'sys_name',
  },
  force: 1,
  flags: 1,
  from: 0,
  to: 0,
};

interface WialonPos {
  y: number;
  x: number;
  s?: number;
  c?: number;
  sc?: number;
  z?: number;
}

interface WialonMessage {
  t: number;
  pos?: WialonPos;
  p?: Record<string, unknown>;
}

function extractErrorCode(payload: unknown): number | undefined {
  if (payload !== null && typeof payload === 'object' && 'error' in payload) {
    const code = payload.error;
    if (typeof code === 'number' && code !== 0) {
      return code;
    }
  }
  return undefined;
}

function batteryFromParams(
  params: Record<string, unknown> | undefined,
): number | undefined {
  const candidate = params?.battery_pct ?? params?.battery;
  return typeof candidate === 'number' ? candidate : undefined;
}

/**
 * Cliente contra la API real de Wialon:
 * mantiene `sid` con TTL y re-intenta una vez ante errores de sesión.
 */
export class WialonHttpClient implements WialonClient {
  private sid: string | null = null;
  private sidExpiresAtMs = 0;

  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  async listUnits(): Promise<WialonUnit[]> {
    const response = await this.callWithSession<{
      items?: { id: number; nm: string }[];
    }>('core/search_items', SEARCH_UNITS_PARAMS);

    return (response.items ?? []).map((item) => ({
      unitId: String(item.id),
      name: item.nm,
    }));
  }

  async getMessages(
    unitId: string,
    fromTs: number,
    toTs: number,
  ): Promise<RawPosition[]> {
    const response = await this.callWithSession<{ messages?: WialonMessage[] }>(
      'messages/load_interval',
      {
        itemId: Number(unitId),
        timeFrom: Math.floor(fromTs / 1000),
        timeTo: Math.floor(toTs / 1000),
        flags: LOAD_INTERVAL_FLAGS,
        flagsMask: LOAD_INTERVAL_FLAGS_MASK,
        loadCount: LOAD_INTERVAL_MAX_COUNT,
      },
    );

    return (response.messages ?? [])
      .filter((message): message is WialonMessage & { pos: WialonPos } =>
        Boolean(message.pos),
      )
      .map((message) => toRawPosition(message));
  }

  private async session(): Promise<string> {
    if (this.sid !== null && Date.now() < this.sidExpiresAtMs) {
      return this.sid;
    }

    const sid = await this.login();
    this.sid = sid;
    this.sidExpiresAtMs = Date.now() + WIALON_SID_TTL_MS;
    return sid;
  }

  private async callWithSession<T>(svc: string, params: unknown): Promise<T> {
    const sid = await this.session();
    try {
      return await this.call<T>(svc, params, sid);
    } catch (error) {
      if (!isInvalidSessionError(error)) {
        throw error;
      }

      this.sid = null;
      this.sidExpiresAtMs = 0;
      return await this.call<T>(svc, params, await this.session());
    }
  }

  /** Login por token — devuelve el session id (`eid`). */
  private async login(): Promise<string> {
    const response = await this.call<{ eid: string }>('token/login', {
      token: this.token,
    });
    return response.eid;
  }

  private async call<T>(
    svc: string,
    params: unknown,
    sid?: string,
  ): Promise<T> {
    const body = new URLSearchParams();
    body.set('svc', svc);
    body.set('params', JSON.stringify(params));
    if (sid !== undefined) {
      body.set('sid', sid);
    }

    let payload: unknown;
    try {
      const response = await this.fetchFn(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!response.ok) {
        throw new WialonTransportError(
          svc,
          new Error(`HTTP ${response.status}`),
        );
      }
      payload = await response.json();
    } catch (cause) {
      if (cause instanceof WialonTransportError) {
        throw cause;
      }
      throw new WialonTransportError(svc, cause);
    }

    const errorCode = extractErrorCode(payload);
    if (errorCode !== undefined) {
      throw new WialonApiError(errorCode, svc);
    }

    return payload as T;
  }
}

function toRawPosition(
  message: WialonMessage & { pos: WialonPos },
): RawPosition {
  const position: RawPosition = {
    lat: message.pos.y,
    lng: message.pos.x,
    ts: message.t * 1000,
  };

  if (typeof message.pos.s === 'number') {
    position.speedKmh = message.pos.s;
  }
  if (typeof message.pos.c === 'number') {
    position.course = message.pos.c;
  }
  if (typeof message.pos.z === 'number') {
    position.altitude = message.pos.z;
  }
  if (typeof message.pos.sc === 'number') {
    position.sats = message.pos.sc;
  }
  const batteryPct = batteryFromParams(message.p);
  if (batteryPct !== undefined) {
    position.batteryPct = batteryPct;
  }

  return position;
}
