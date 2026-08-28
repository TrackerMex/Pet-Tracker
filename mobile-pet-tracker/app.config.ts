import type { ConfigContext, ExpoConfig } from 'expo/config';

type GoogleMapsPlugin = [
  string,
  { androidGoogleMapsApiKey: string },
];

export default ({ config }: ConfigContext): ExpoConfig => {
  const androidGoogleMapsApiKey =
    process.env.GOOGLE_MAPS_API_KEY_ANDROID?.trim() ?? '';
  const resolvedConfig: ExpoConfig = {
    ...config,
    name: config.name ?? 'mobile-pet-tracker',
    slug: config.slug ?? 'mobile-pet-tracker',
  };

  if (!androidGoogleMapsApiKey) {
    console.warn(
      'GOOGLE_MAPS_API_KEY_ANDROID no está definida; el build de Android quedará sin com.google.android.geo.API_KEY y el tab Map crasheará al montar MapView. Consulta docs/verification.md §Feature 52 — android-maps-api-key.',
    );

    return resolvedConfig;
  }

  const googleMapsPlugin: GoogleMapsPlugin = [
    'react-native-maps',
    { androidGoogleMapsApiKey },
  ];

  return {
    ...resolvedConfig,
    plugins: [...(resolvedConfig.plugins ?? []), googleMapsPlugin],
  };
};
