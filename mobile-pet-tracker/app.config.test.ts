/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { ConfigContext } from 'expo/config';

import resolveConfig from './app.config';
import appJson from './app.json';

jest.mock('node:fs', () => ({
  ...jest.requireActual<typeof import('node:fs')>('node:fs'),
  existsSync: jest.fn(),
}));

const mockExistsSync = jest.mocked(existsSync);

beforeEach(() => {
  mockExistsSync.mockReset();
  mockExistsSync.mockReturnValue(true);
});

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
    } as unknown as ConfigContext);

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
      resolved = resolveConfig({
        config: appJson.expo,
      } as unknown as ConfigContext);
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

    const resolved = resolveConfig({
      config: appJson.expo,
    } as unknown as ConfigContext);

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

    const resolved = resolveConfig({
      config: appJson.expo,
    } as unknown as ConfigContext);

    expect(resolved.android?.intentFilters).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const warning = warnSpy.mock.calls[0]?.[0];
    expect(warning).toEqual(expect.stringContaining('RESET_LINK_HOST'));
    expect(warning).toEqual(expect.stringContaining('docs/verification.md'));
  });
});

describe('#79 R2: app.json declara el plugin de notificaciones y POST_NOTIFICATIONS', () => {
  const expo = appJson.expo as {
    android: { package: string; permissions?: string[] };
    plugins: unknown[];
  };

  it('conserva los plugins existentes y añade expo-notifications', () => {
    expect(expo.plugins).toContain('expo-router');
    expect(expo.plugins).toContain('expo-secure-store');
    expect(expo.plugins).toContainEqual([
      'expo-splash-screen',
      expect.any(Object),
    ]);
    expect(expo.plugins).toContainEqual([
      'expo-notifications',
      { defaultChannel: 'default' },
    ]);
  });

  it('declara el permiso de Android sin cambiar el package', () => {
    expect(expo.android.permissions).toContain('POST_NOTIFICATIONS');
    expect(expo.android.package).toBe('com.trackermex.pettracker');
  });
});

describe('#101 R2: icono de la app', () => {
  it('expo.icon es ./assets/images/icon.png', () => {
    expect(appJson.expo.icon).toBe('./assets/images/icon.png');
  });
});

describe('#101 R8: favicon', () => {
  it('web.favicon es ./assets/images/favicon.png', () => {
    expect(appJson.expo.web.favicon).toBe('./assets/images/favicon.png');
  });
});

describe('#101 R3: foreground del adaptive icon', () => {
  it('android.adaptiveIcon.foregroundImage es ./assets/images/android-icon-foreground.png', () => {
    expect(appJson.expo.android.adaptiveIcon.foregroundImage).toBe(
      './assets/images/android-icon-foreground.png',
    );
  });
});

describe('#101 R4: monochrome del adaptive icon', () => {
  it('android.adaptiveIcon.monochromeImage es ./assets/images/android-icon-monochrome.png', () => {
    expect(appJson.expo.android.adaptiveIcon.monochromeImage).toBe(
      './assets/images/android-icon-monochrome.png',
    );
  });
});

describe('#101 R5: fondo plano del adaptive icon', () => {
  it('android.adaptiveIcon.backgroundColor es #9460FC y no declara backgroundImage', () => {
    expect(appJson.expo.android.adaptiveIcon.backgroundColor).toBe('#9460FC');
    expect(
      (appJson.expo.android.adaptiveIcon as { backgroundImage?: string }).backgroundImage,
    ).toBeUndefined();
  });
});

describe('#101 R6: splash con el perrito sobre violeta', () => {
  it('el plugin expo-splash-screen declara splash-icon.png sobre #9460FC con imageWidth 200', () => {
    expect(appJson.expo.plugins).toContainEqual([
      'expo-splash-screen',
      {
        backgroundColor: '#9460FC',
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
      },
    ]);
  });
});

describe('#79 R14: google-services.json se declara solo cuando existe', () => {
  const originalApiKey = process.env.GOOGLE_MAPS_API_KEY_ANDROID;
  const originalResetLinkHost = process.env.RESET_LINK_HOST;
  let warnSpy: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    process.env.GOOGLE_MAPS_API_KEY_ANDROID = 'maps-test-key';
    process.env.RESET_LINK_HOST = 'reset.example.test';
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

  it('declara android.googleServicesFile cuando el fichero existe', () => {
    mockExistsSync.mockReturnValue(true);

    const resolved = resolveConfig({
      config: appJson.expo,
    } as unknown as ConfigContext);

    expect(mockExistsSync).toHaveBeenCalledWith(
      join(__dirname, 'google-services.json'),
    );
    expect(resolved.android?.googleServicesFile).toBe(
      './google-services.json',
    );
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('sin el fichero avisa, omite la clave y resuelve la config', () => {
    mockExistsSync.mockReturnValue(false);
    let resolved: ReturnType<typeof resolveConfig> | undefined;

    expect(() => {
      resolved = resolveConfig({
        config: appJson.expo,
      } as unknown as ConfigContext);
    }).not.toThrow();
    expect(
      Object.hasOwn(resolved?.android ?? {}, 'googleServicesFile'),
    ).toBe(false);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    const warning = warnSpy.mock.calls[0]?.[0];

    expect(warning).toEqual(expect.stringContaining('google-services.json'));
    expect(warning).toEqual(expect.stringContaining('docs/verification.md'));
  });
});
