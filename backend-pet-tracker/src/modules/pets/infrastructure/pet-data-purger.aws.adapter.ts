import { Inject, Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  S3_CLIENT,
  DYNAMODB_CLIENT,
  AWS_RESOURCE_NAMES,
} from '@/aws/aws.constants';
import type { AwsResourceNames } from '@/aws/resource-names';
import type { PetDataPurger } from '@/modules/pets/domain/ports/pet-data-purger';

@Injectable()
export class PetDataPurgerAwsAdapter implements PetDataPurger {
  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    @Inject(DYNAMODB_CLIENT) private readonly dynamo: DynamoDBClient,
    @Inject(AWS_RESOURCE_NAMES) private readonly names: AwsResourceNames,
  ) {}
  purge(petIds: readonly string[]): Promise<void> {
    void petIds;
    return Promise.resolve();
  }
}
