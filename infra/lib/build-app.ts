import { App } from 'aws-cdk-lib';
import { join } from 'path';
import { DEV_REGION, PetTrackerDevStack } from './pet-tracker-dev-stack';

export const PROD_CONTEXT_KEYS = [
  'apiDomain', 'hostedZoneId', 'hostedZoneName',
  'alarmEmail', 'resendFrom', 'resetLinkHost',
] as const;
export const BACKEND_IMAGE_DIRECTORY = join(__dirname, '..', '..', 'backend-pet-tracker');

export function buildApp(app: App, imageDirectory = BACKEND_IMAGE_DIRECTORY): App {
  new PetTrackerDevStack(app, 'PetTrackerDev', { env: { region: DEV_REGION } });
  void imageDirectory;
  return app;
}
