import { App, Stack } from 'aws-cdk-lib';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BACKEND_IMAGE_DIRECTORY, buildApp } from '../lib/build-app';
import { DEV_REGION, PetTrackerDevStack } from '../lib/pet-tracker-dev-stack';

function stackIds(app: App): string[] {
  return app.node.children.filter((child) => Stack.isStack(child)).map((child) => child.node.id);
}

describe('#246 R1: sin contexto prod la app solo tiene PetTrackerDev', () => {
  it('#246 R1: devuelve la misma app con solo PetTrackerDev en us-east-1', () => {
    const app = new App();
    const returned = buildApp(app);
    expect(returned === app).toBe(true);
    expect(stackIds(app)).toEqual(['PetTrackerDev']);
    const stack = app.node.tryFindChild('PetTrackerDev');
    expect(stack instanceof PetTrackerDevStack && stack.region === DEV_REGION).toBe(true);
  });

  it('#246 R1: BACKEND_IMAGE_DIRECTORY es backend-pet-tracker del repo', () => {
    expect(BACKEND_IMAGE_DIRECTORY).toBe(join(__dirname, '..', '..', 'backend-pet-tracker'));
  });

  it('#246 R1: bin/app.ts delega en buildApp', () => {
    const source = readFileSync(join(__dirname, '..', 'bin', 'app.ts'), 'utf8');
    expect(source).toContain('buildApp(new App())');
    expect(source).not.toContain('new PetTrackerDevStack');
  });
});

const PROD_CONTEXT = {
  apiDomain: 'api.pets.example.org',
  hostedZoneId: 'Z0R20EXAMPLE',
  hostedZoneName: 'pets.example.org',
  alarmEmail: 'ops@example.org',
  resendFrom: 'hola@pets.example.org',
  resetLinkHost: 'reset.pets.example.org',
};

describe('#246 R2: contexto prod parcial lanza con las claves que faltan', () => {
  it.each([
    {
      caso: 'solo apiDomain',
      context: { apiDomain: PROD_CONTEXT.apiDomain },
      missing: 'hostedZoneId, hostedZoneName, alarmEmail, resendFrom, resetLinkHost',
    },
    {
      caso: 'sin alarmEmail ni resetLinkHost',
      context: {
        apiDomain: PROD_CONTEXT.apiDomain,
        hostedZoneId: PROD_CONTEXT.hostedZoneId,
        hostedZoneName: PROD_CONTEXT.hostedZoneName,
        resendFrom: PROD_CONTEXT.resendFrom,
      },
      missing: 'alarmEmail, resetLinkHost',
    },
    { caso: 'resendFrom en blanco', context: { ...PROD_CONTEXT, resendFrom: '   ' }, missing: 'resendFrom' },
    { caso: 'hostedZoneId numérico', context: { ...PROD_CONTEXT, hostedZoneId: 12345 }, missing: 'hostedZoneId' },
  ])('#246 R2: $caso', ({ context, missing }) => {
    expect(() => buildApp(new App({ context }))).toThrow(new Error(`Missing prod context keys: ${missing}`));
  });
});
