import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { SQSClient } from '@aws-sdk/client-sqs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { AppConfigModule } from '../config/config.module';
import { AwsModule } from './aws.module';
import {
  DYNAMODB_CLIENT,
  EVENTBRIDGE_CLIENT,
  AWS_RESOURCE_NAMES,
  S3_CLIENT,
  SQS_CLIENT,
} from './aws.constants';
import { AwsResourceNames } from './resource-names';

describe('R1: AwsModule expone los 4 clientes AWS SDK v3 vía ConfigService', () => {
  it('resuelve cada token con el cliente concreto correspondiente', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppConfigModule.forRoot(['test/fixtures/.env.aws-fixture']),
        AwsModule,
      ],
    }).compile();

    expect(moduleRef.get(SQS_CLIENT)).toBeInstanceOf(SQSClient);
    expect(moduleRef.get(DYNAMODB_CLIENT)).toBeInstanceOf(DynamoDBClient);
    expect(moduleRef.get(S3_CLIENT)).toBeInstanceOf(S3Client);
    expect(moduleRef.get(EVENTBRIDGE_CLIENT)).toBeInstanceOf(EventBridgeClient);

    await moduleRef.close();
  });
});

function collectTsFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? collectTsFiles(path)
      : path.endsWith('.ts')
        ? [path]
        : [];
  });
}

describe('R4: AWS_RESOURCE_NAMES resuelve nombres sufijados', () => {
  it('expone los nombres de test desde ConfigService', async () => {
    const values: Record<string, string> = {
      AWS_MODE: 'local',
      NODE_ENV: 'test',
      AWS_ENDPOINT_URL: 'http://localhost:4566',
      AWS_REGION: 'us-east-1',
      AWS_ACCESS_KEY_ID: 'test',
      AWS_SECRET_ACCESS_KEY: 'test',
    };
    const config = {
      get: (key: string) => values[key],
    } as ConfigService;
    const moduleRef = await Test.createTestingModule({
      imports: [AwsModule],
    })
      .overrideProvider(ConfigService)
      .useValue(config)
      .compile();

    expect(moduleRef.get<AwsResourceNames>(AWS_RESOURCE_NAMES)).toEqual({
      positionsRaw: 'positions-raw-test',
      positionsRawDlq: 'positions-raw-dlq-test',
      notifications: 'notifications-test',
      notificationsDlq: 'notifications-dlq-test',
      geofenceEvents: 'geofence-events-test',
      geofenceEventsDlq: 'geofence-events-dlq-test',
      geofenceEventsRule: 'geofence-events-test',
      positionsTable: 'positions-test',
      mediaBucket: 'pet-tracker-media-local-test',
      eventBus: 'pet-tracker-test',
    });

    await moduleRef.close();
  });

  it('no lee NODE_ENV ni AWS_MODE directamente desde process.env en src', () => {
    const directEnvRead = new RegExp(
      'process[.]env[.](NODE_ENV|AWS_MODE)',
    );
    const offenders = collectTsFiles(join(__dirname, '..')).filter((file) =>
      directEnvRead.test(readFileSync(file, 'utf8')),
    );

    expect(offenders).toEqual([]);
  });
});
