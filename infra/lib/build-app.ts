import { App } from 'aws-cdk-lib';
import { join } from 'path';
import { DEV_REGION, PetTrackerDevStack } from './pet-tracker-dev-stack';

export const PROD_CONTEXT_KEYS = [
  'apiDomain', 'hostedZoneId', 'hostedZoneName',
  'alarmEmail', 'resendFrom', 'resetLinkHost',
] as const;
export const BACKEND_IMAGE_DIRECTORY = join(__dirname, '..', '..', 'backend-pet-tracker');

export function buildApp(app: App, imageDirectory = BACKEND_IMAGE_DIRECTORY): App {
  const missing = PROD_CONTEXT_KEYS.filter((key) => {
    const value: unknown = app.node.tryGetContext(key);
    return typeof value !== 'string' || value.trim() === '';
  });
  if (missing.length > 0 && missing.length < PROD_CONTEXT_KEYS.length) {
    throw new Error(`Missing prod context keys: ${missing.join(', ')}`);
  }
  new PetTrackerDevStack(app, 'PetTrackerDev', { env: { region: DEV_REGION } });
  void imageDirectory;
  return app;
}
