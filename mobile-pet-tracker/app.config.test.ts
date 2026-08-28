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

  it('conserva app.json y añade al final el plugin con la clave recortada', () => {
    process.env.GOOGLE_MAPS_API_KEY_ANDROID = '  test-key  ';

    const resolved = resolveConfig({
      config: appJson.expo,
    } as ConfigContext);
    const { plugins: _plugins, ...staticConfig } = appJson.expo;
    const mapsPlugin = [
      'react-native-maps',
      { androidGoogleMapsApiKey: 'test-key' },
    ];

    expect(resolved).toMatchObject(staticConfig);
    expect(resolved.plugins).toContainEqual(mapsPlugin);
    expect(resolved.plugins).toEqual([...appJson.expo.plugins, mapsPlugin]);
  });
});
