#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import {
  DEV_REGION,
  PetTrackerDevStack,
} from '../lib/pet-tracker-dev-stack';

const app = new App();

new PetTrackerDevStack(app, 'PetTrackerDev', {
  env: { region: DEV_REGION },
});
