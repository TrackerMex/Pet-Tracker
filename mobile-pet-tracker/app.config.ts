import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey =
    process.env.GOOGLE_MAPS_API_KEY_ANDROID?.trim() ?? '';
  const resetLinkHost = process.env.RESET_LINK_HOST?.trim() ?? '';
  const resolvedConfig: ExpoConfig = {
    ...config,
    name: config.name ?? 'mobile-pet-tracker',
    slug: config.slug ?? 'mobile-pet-tracker',
  };
  const warnings: string[] = [];

  if (!googleMapsApiKey) {
    warnings.push(
      'GOOGLE_MAPS_API_KEY_ANDROID no está definida; el build de Android quedará sin com.google.android.geo.API_KEY y GoogleMaps.View no podrá cargar el mapa. Consulta docs/verification.md §Feature 52 — android-maps-api-key.',
    );
  }

  if (!resetLinkHost) {
    warnings.push(
      'RESET_LINK_HOST no está definida; el build de Android quedará sin intent filters de App Links. Consulta docs/verification.md §Feature 59 — auth-reset-deep-link.',
    );
  }

  if (warnings.length > 0) {
    console.warn(warnings.join(' '));
  }

  if (!googleMapsApiKey && !resetLinkHost) {
    return resolvedConfig;
  }

  return {
    ...resolvedConfig,
    android: {
      ...resolvedConfig.android,
      ...(googleMapsApiKey
        ? {
            config: {
              ...resolvedConfig.android?.config,
              googleMaps: {
                ...resolvedConfig.android?.config?.googleMaps,
                apiKey: googleMapsApiKey,
              },
            },
          }
        : {}),
      ...(resetLinkHost
        ? {
            intentFilters: [
              {
                autoVerify: true,
                action: 'VIEW',
                data: [
                  {
                    scheme: 'https',
                    host: resetLinkHost,
                    pathPrefix: '/reset-password',
                  },
                ],
                category: ['BROWSABLE', 'DEFAULT'],
              },
            ],
          }
        : {}),
    },
  };
};
