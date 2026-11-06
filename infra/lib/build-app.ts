import { App } from 'aws-cdk-lib';
import { PetTrackerProdStack, PROD_PRIMARY_REGION } from './pet-tracker-prod-stack';
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
  if (missing.length === 0) {
    const values = Object.fromEntries(PROD_CONTEXT_KEYS.map((key) => {
      const value = app.node.tryGetContext(key) as string;
      return [key, value.trim()];
    })) as Record<(typeof PROD_CONTEXT_KEYS)[number], string>;
    new PetTrackerProdStack(app, `PetTrackerProd-${PROD_PRIMARY_REGION}`, {
      env: { region: PROD_PRIMARY_REGION }, ...values, imageDirectory,
    });
  }
  return app;
}
