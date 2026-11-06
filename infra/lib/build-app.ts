import { App } from 'aws-cdk-lib';

export const PROD_CONTEXT_KEYS = [
  'apiDomain', 'hostedZoneId', 'hostedZoneName',
  'alarmEmail', 'resendFrom', 'resetLinkHost',
] as const;
export const BACKEND_IMAGE_DIRECTORY = '';

export function buildApp(app: App, imageDirectory = BACKEND_IMAGE_DIRECTORY): App {
  void app;
  void imageDirectory;
  return new App();
}
