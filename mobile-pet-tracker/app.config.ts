import type { ConfigContext, ExpoConfig } from 'expo/config';

type GoogleMapsPlugin = [
  string,
  { androidGoogleMapsApiKey: string },
];

export default ({ config }: ConfigContext): ExpoConfig => {
  const androidGoogleMapsApiKey =
    process.env.GOOGLE_MAPS_API_KEY_ANDROID?.trim() ?? '';
  const googleMapsPlugin: GoogleMapsPlugin = [
    'react-native-maps',
    { androidGoogleMapsApiKey },
  ];

  return {
    ...config,
    name: config.name ?? 'mobile-pet-tracker',
    slug: config.slug ?? 'mobile-pet-tracker',
    plugins: [...(config.plugins ?? []), googleMapsPlugin],
  };
};
