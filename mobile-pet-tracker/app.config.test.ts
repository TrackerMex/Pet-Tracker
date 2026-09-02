/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { ConfigContext } from 'expo/config';

import resolveConfig from './app.config';
import appJson from './app.json';

describe('R1: la config resuelta inyecta la clave de Android desde el entorno', () => {
  const originalApiKey = process.env.GOOGLE_MAPS_API_KEY_ANDROID;

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.GOOGLE_MAPS_API_KEY_ANDROID;
      return;
    }

    process.env.GOOGLE_MAPS_API_KEY_ANDROID = originalApiKey;
  });

  it('R5 (android-map-never-ready): fija android.config.googleMaps.apiKey y no declara plugin de mapas', () => {
    process.env.GOOGLE_MAPS_API_KEY_ANDROID = '  test-key  ';

    const resolved = resolveConfig({
      config: appJson.expo,
    } as ConfigContext);

    expect(resolved).toMatchObject(appJson.expo);
    expect(resolved.android?.config?.googleMaps?.apiKey).toBe('test-key');
    expect(resolved.plugins).toEqual(appJson.expo.plugins);
  });
});

describe('R2: sin la variable no se declara el plugin y se avisa sin lanzar', () => {
  const originalApiKey = process.env.GOOGLE_MAPS_API_KEY_ANDROID;
  let warnSpy: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();

    if (originalApiKey === undefined) {
      delete process.env.GOOGLE_MAPS_API_KEY_ANDROID;
      return;
    }

    process.env.GOOGLE_MAPS_API_KEY_ANDROID = originalApiKey;
  });

  it.each([
    ['ausente', undefined],
    ['vacía', ''],
    ['solo espacios', '   '],
  ])('acepta una variable %s y devuelve la config base', (_case, apiKey) => {
    if (apiKey === undefined) {
      delete process.env.GOOGLE_MAPS_API_KEY_ANDROID;
    } else {
      process.env.GOOGLE_MAPS_API_KEY_ANDROID = apiKey;
    }

    let resolved: ReturnType<typeof resolveConfig> | undefined;

    expect(() => {
      resolved = resolveConfig({ config: appJson.expo } as ConfigContext);
    }).not.toThrow();
    expect(resolved?.plugins).toEqual(appJson.expo.plugins);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    const warning = warnSpy.mock.calls[0]?.[0];

    expect(warning).toEqual(
      expect.stringContaining('GOOGLE_MAPS_API_KEY_ANDROID'),
    );
    expect(warning).toEqual(expect.stringContaining('docs/verification.md'));
  });
});

describe('R3: la clave viaja por entorno, nunca por el repo', () => {
  it('documenta solo el nombre privado de la variable, sin credenciales', () => {
    const envExample = readFileSync(join(__dirname, '.env.example'), 'utf8');

    expect(envExample).toMatch(/^GOOGLE_MAPS_API_KEY_ANDROID=\s*$/m);
    expect(envExample).not.toContain('EXPO_PUBLIC_GOOGLE');
    expect(envExample).not.toMatch(/AIza[0-9A-Za-z_-]{10,}/);
  });
});

describe('R4 (auth-reset-deep-link): RESET_LINK_HOST declara el intent filter de App Links', () => {
  const originalApiKey = process.env.GOOGLE_MAPS_API_KEY_ANDROID;
  const originalResetLinkHost = process.env.RESET_LINK_HOST;

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.GOOGLE_MAPS_API_KEY_ANDROID;
    } else {
      process.env.GOOGLE_MAPS_API_KEY_ANDROID = originalApiKey;
    }

    if (originalResetLinkHost === undefined) {
      delete process.env.RESET_LINK_HOST;
    } else {
      process.env.RESET_LINK_HOST = originalResetLinkHost;
    }
  });

  it('preserva app.json e inyecta un unico filtro https verificado', () => {
    process.env.GOOGLE_MAPS_API_KEY_ANDROID = 'maps-test-key';
    process.env.RESET_LINK_HOST = '  reset.example.test  ';

    const resolved = resolveConfig({ config: appJson.expo } as ConfigContext);

    expect(resolved).toMatchObject(appJson.expo);
    expect(resolved.android?.intentFilters).toEqual([
      {
        autoVerify: true,
        action: 'VIEW',
        data: [
          {
            scheme: 'https',
            host: 'reset.example.test',
            pathPrefix: '/reset-password',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ]);
  });
});

describe('R4 (auth-reset-deep-link): sin RESET_LINK_HOST avisa y no declara intent filters', () => {
  const originalApiKey = process.env.GOOGLE_MAPS_API_KEY_ANDROID;
  const originalResetLinkHost = process.env.RESET_LINK_HOST;
  let warnSpy: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    process.env.GOOGLE_MAPS_API_KEY_ANDROID = 'maps-test-key';
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();

    if (originalApiKey === undefined) {
      delete process.env.GOOGLE_MAPS_API_KEY_ANDROID;
    } else {
      process.env.GOOGLE_MAPS_API_KEY_ANDROID = originalApiKey;
    }

    if (originalResetLinkHost === undefined) {
      delete process.env.RESET_LINK_HOST;
    } else {
      process.env.RESET_LINK_HOST = originalResetLinkHost;
    }
  });

  it.each([
    ['ausente', undefined],
    ['vacío', ''],
    ['solo espacios', '   '],
  ])('acepta un host %s sin lanzar', (_case, resetLinkHost) => {
    if (resetLinkHost === undefined) {
      delete process.env.RESET_LINK_HOST;
    } else {
      process.env.RESET_LINK_HOST = resetLinkHost;
    }

    const resolved = resolveConfig({ config: appJson.expo } as ConfigContext);

    expect(resolved.android?.intentFilters).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const warning = warnSpy.mock.calls[0]?.[0];
    expect(warning).toEqual(expect.stringContaining('RESET_LINK_HOST'));
    expect(warning).toEqual(expect.stringContaining('docs/verification.md'));
  });
});
