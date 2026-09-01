import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey =
    process.env.GOOGLE_MAPS_API_KEY_ANDROID?.trim() ?? '';
  const resolvedConfig: ExpoConfig = {
    ...config,
    name: config.name ?? 'mobile-pet-tracker',
    slug: config.slug ?? 'mobile-pet-tracker',
  };

  if (!googleMapsApiKey) {
    console.warn(
      'GOOGLE_MAPS_API_KEY_ANDROID no está definida; el build de Android quedará sin com.google.android.geo.API_KEY y GoogleMaps.View no podrá cargar el mapa. Consulta docs/verification.md §Feature 52 — android-maps-api-key.',
    );

    return resolvedConfig;
  }

  return {
    ...resolvedConfig,
    android: {
      ...resolvedConfig.android,
      config: {
        ...resolvedConfig.android?.config,
        googleMaps: {
          ...resolvedConfig.android?.config?.googleMaps,
          apiKey: googleMapsApiKey,
        },
      },
    },
  };
};
