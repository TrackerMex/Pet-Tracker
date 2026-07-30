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
  S3_CLIENT,
  SQS_CLIENT,
} from './aws.constants';

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
