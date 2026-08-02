import { ConfigService } from '@nestjs/config';
import { FakeWialonClient } from './fake-wialon.client';
import { WialonHttpClient } from './wialon-http.client';
import type { WialonClient } from './wialon-client.interface';

// Defaults de D11 (requirements): fake salvo opt-in explicito a la API real.
export const WIALON_DEFAULT_BASE_URL =
  'https://hst-api.wialon.com/wialon/ajax.html';
export const SIM_DEFAULT_SEED = 1;
export const SIM_DEFAULT_HOME_LAT = 19.4326;
export const SIM_DEFAULT_HOME_LNG = -99.1332;

/** Valor centinela del token: "aun no hay token real" — resuelve fake (R1). */
const WIALON_TOKEN_PENDING = 'PENDING';

/**
 * Selecciona la implementacion de WIALON_CLIENT (R1): WialonHttpClient solo
 * con SIM_MODE=false y WIALON_TOKEN real; FakeWialonClient en cualquier otro
 * caso (default dev). Config solo via ConfigService.
 */
export function createWialonClient(config: ConfigService): WialonClient {
  const simMode = config.get<string>('SIM_MODE');
  const token = config.get<string>('WIALON_TOKEN');
  const hasRealToken =
    typeof token === 'string' &&
    token.trim() !== '' &&
    token !== WIALON_TOKEN_PENDING;

  if (simMode === 'false' && hasRealToken) {
    const baseUrl =
      config.get<string>('WIALON_BASE_URL') ?? WIALON_DEFAULT_BASE_URL;
    return new WialonHttpClient(baseUrl, token);
  }

  return new FakeWialonClient({
    seed: numberFromConfig(config, 'SIM_SEED', SIM_DEFAULT_SEED),
    homeLat: numberFromConfig(config, 'SIM_HOME_LAT', SIM_DEFAULT_HOME_LAT),
    homeLng: numberFromConfig(config, 'SIM_HOME_LNG', SIM_DEFAULT_HOME_LNG),
  });
}

function numberFromConfig(
  config: ConfigService,
  key: string,
  fallback: number,
): number {
  const raw = config.get<string>(key);
  const parsed = Number(raw);
  return raw !== undefined && raw !== '' && Number.isFinite(parsed)
    ? parsed
    : fallback;
}
