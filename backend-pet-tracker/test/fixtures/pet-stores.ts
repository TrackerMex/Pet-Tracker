import type { INestApplication } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  S3_CLIENT,
  DYNAMODB_CLIENT,
  AWS_RESOURCE_NAMES,
} from '@/aws/aws.constants';
import type { AwsResourceNames } from '@/aws/resource-names';
import { uuidv7 } from 'uuidv7';

interface PetStores {
  s3: S3Client;
  dynamo: DynamoDBClient;
  names: AwsResourceNames;
}
export function petStoresOf(app: INestApplication): PetStores {
  return {
    s3: app.get<S3Client>(S3_CLIENT),
    dynamo: app.get<DynamoDBClient>(DYNAMODB_CLIENT),
    names: app.get<AwsResourceNames>(AWS_RESOURCE_NAMES),
  };
}
export async function seedPetStores(
  stores: PetStores,
  petId: string,
): Promise<void> {
  for (const Key of [
    `pets/${petId}/photo-1`,
    `pets/${petId}/docs/${uuidv7()}`,
  ]) {
    await stores.s3.send(
      new PutObjectCommand({
        Bucket: stores.names.mediaBucket,
        Key,
        Body: 'e2e',
      }),
    );
  }
  for (let i = 1; i <= 30; i++)
    await stores.dynamo.send(
      new PutItemCommand({
        TableName: stores.names.positionsTable,
        Item: { pk: { S: `PET#${petId}` }, sk: { N: String(i) } },
      }),
    );
}
export async function countPetStores(
  stores: PetStores,
  petId: string,
): Promise<{ s3Objects: number; dynamoItems: number }> {
  const s3 = await stores.s3.send(
    new ListObjectsV2Command({
      Bucket: stores.names.mediaBucket,
      Prefix: `pets/${petId}/`,
    }),
  );
  const dynamo = await stores.dynamo.send(
    new QueryCommand({
      TableName: stores.names.positionsTable,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': { S: `PET#${petId}` } },
      Select: 'COUNT',
    }),
  );
  return {
    s3Objects: (s3.Contents ?? []).length,
    dynamoItems: dynamo.Count ?? 0,
  };
}
export async function cleanPetStores(
  stores: PetStores,
  petId: string,
): Promise<void> {
  const s3 = await stores.s3.send(
    new ListObjectsV2Command({
      Bucket: stores.names.mediaBucket,
      Prefix: `pets/${petId}/`,
    }),
  );
  for (const { Key } of s3.Contents ?? [])
    await stores.s3.send(
      new DeleteObjectCommand({ Bucket: stores.names.mediaBucket, Key }),
    );
  const dynamo = await stores.dynamo.send(
    new QueryCommand({
      TableName: stores.names.positionsTable,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': { S: `PET#${petId}` } },
      ProjectionExpression: 'pk, sk',
    }),
  );
  for (const Key of dynamo.Items ?? [])
    await stores.dynamo.send(
      new DeleteItemCommand({ TableName: stores.names.positionsTable, Key }),
    );
}
