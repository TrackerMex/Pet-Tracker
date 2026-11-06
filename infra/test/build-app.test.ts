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
