import { Inject, Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CLIENT } from '@/aws/aws.constants';
import { BUCKET_MEDIA } from '@/aws/constants';
import type { PhotoStorage } from '../domain/ports/photo-storage';

/**
 * Implementa PHOTO_STORAGE (R1, R6, R8) firmando localmente (SigV4, sin
 * round-trip a S3) contra el bucket pet-tracker-media-local ya provisionado
 * por localstack-provisioning (#2). D3: el PUT no fija ContentType en la
 * firma — cualquier Content-Type real es aceptado al subir.
 */
@Injectable()
export class PhotoStorageS3Adapter implements PhotoStorage {
  constructor(@Inject(S3_CLIENT) private readonly s3: S3Client) {}

  createUploadUrl(key: string, expiresInSeconds: number): Promise<string> {
    const command = new PutObjectCommand({ Bucket: BUCKET_MEDIA, Key: key });
    return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
  }

  createDownloadUrl(key: string, expiresInSeconds: number): Promise<string> {
    const command = new GetObjectCommand({ Bucket: BUCKET_MEDIA, Key: key });
    return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
  }
}
