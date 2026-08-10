import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import {
  DEV_REGION,
  PetTrackerDevStack,
} from '../lib/pet-tracker-dev-stack';

describe('R1: el stack sintetiza sin credenciales AWS', () => {
  it('construye el template en memoria sin consultar la cuenta', () => {
    const stack = new PetTrackerDevStack(new App(), 'PetTrackerDev', {
      env: { region: DEV_REGION },
    });

    expect(() => Template.fromStack(stack)).not.toThrow();
  });
});
