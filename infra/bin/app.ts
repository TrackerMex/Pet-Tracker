#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { buildApp } from '../lib/build-app';

buildApp(new App());
