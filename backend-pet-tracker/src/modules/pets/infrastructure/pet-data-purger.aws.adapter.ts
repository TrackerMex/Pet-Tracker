import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import {
  DynamoDBClient,
  QueryCommand,
  BatchWriteItemCommand,
} from '@aws-sdk/client-dynamodb';
import type { AttributeValue, WriteRequest } from '@aws-sdk/client-dynamodb';
import {
  S3_CLIENT,
  DYNAMODB_CLIENT,
  AWS_RESOURCE_NAMES,
} from '@/aws/aws.constants';
import {
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
} from '@/aws/constants';
import type { AwsResourceNames } from '@/aws/resource-names';
import type { PetDataPurger } from '@/modules/pets/domain/ports/pet-data-purger';

const BATCH_WRITE_MAX_ITEMS = 25;
const BATCH_WRITE_ATTEMPTS = 3;

@Injectable()
export class PetDataPurgerAwsAdapter implements PetDataPurger {
  private readonly logger = new Logger(PetDataPurgerAwsAdapter.name);
  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    @Inject(DYNAMODB_CLIENT) private readonly dynamo: DynamoDBClient,
    @Inject(AWS_RESOURCE_NAMES) private readonly names: AwsResourceNames,
  ) {}

  async purge(petIds: readonly string[]): Promise<void> {
    for (const petId of petIds) {
      try {
        await this.purgeS3(petId);
      } catch (error) {
        this.logFailure('s3', petId, `pets/${petId}/`, error);
      }
      try {
        await this.purgeDynamo(petId);
      } catch (error) {
        this.logFailure('dynamodb', petId, `PET#${petId}`, error);
      }
    }
  }

  private async purgeS3(petId: string): Promise<void> {
    let continuationToken: string | undefined;
    do {
      const page = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.names.mediaBucket,
          Prefix: `pets/${petId}/`,
          ContinuationToken: continuationToken,
        }),
      );
      if (page.Contents?.length) {
        const result = await this.s3.send(
          new DeleteObjectsCommand({
            Bucket: this.names.mediaBucket,
            Delete: {
              Objects: page.Contents.map(({ Key }) => ({ Key })),
              Quiet: true,
            },
          }),
        );
        if (result.Errors?.length)
          throw new Error(`S3 delete errors: ${JSON.stringify(result.Errors)}`);
      }
      continuationToken = page.IsTruncated
        ? page.NextContinuationToken
        : undefined;
    } while (continuationToken);
  }

  private async purgeDynamo(petId: string): Promise<void> {
    let exclusiveStartKey: Record<string, AttributeValue> | undefined;
    const table = this.names.positionsTable;
    do {
      const page = await this.dynamo.send(
        new QueryCommand({
          TableName: table,
          KeyConditionExpression: `${TABLE_POSITIONS_PARTITION_KEY} = :pk`,
          ExpressionAttributeValues: { ':pk': { S: `PET#${petId}` } },
          ProjectionExpression: `${TABLE_POSITIONS_PARTITION_KEY}, ${TABLE_POSITIONS_SORT_KEY}`,
          ExclusiveStartKey: exclusiveStartKey,
        }),
      );
      const items = page.Items ?? [];
      for (
        let offset = 0;
        offset < items.length;
        offset += BATCH_WRITE_MAX_ITEMS
      ) {
        let pending: WriteRequest[] = items
          .slice(offset, offset + BATCH_WRITE_MAX_ITEMS)
          .map((Key) => ({ DeleteRequest: { Key } }));
        for (
          let attempt = 0;
          attempt < BATCH_WRITE_ATTEMPTS && pending.length;
          attempt++
        ) {
          const result = await this.dynamo.send(
            new BatchWriteItemCommand({ RequestItems: { [table]: pending } }),
          );
          pending = result.UnprocessedItems?.[table] ?? [];
        }
        if (pending.length)
          throw new Error(
            `UnprocessedItems after ${BATCH_WRITE_ATTEMPTS} attempts`,
          );
      }
      exclusiveStartKey = page.LastEvaluatedKey;
    } while (exclusiveStartKey);
  }

  private logFailure(
    store: 's3' | 'dynamodb',
    petId: string,
    target: string,
    error: unknown,
  ): void {
    const reason = error instanceof Error ? error.message : String(error);
    this.logger.error(
      `PET_PURGE_FAILED store=${store} petId=${petId} target=${target} reason=${reason}`,
    );
  }
}
