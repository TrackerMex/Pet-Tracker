import { randomUUID } from 'node:crypto';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { config as loadDotenv } from 'dotenv';
import { createS3Client, resolveAwsConfigFromEnv } from '@/aws/aws-clients';
import {
  AwsResourceNames,
  resolveResourceNamesFromEnv,
} from '@/aws/resource-names';
import { PhotoStorageS3Adapter } from '@/modules/media/infrastructure/photo-storage.s3.adapter';

loadDotenv({ path: '../.env', quiet: true });

const runSmoke = (process.env.AWS_MODE ?? '').trim().toLowerCase() === 'aws';

function assertNoStaticCredentials(): void {
  if (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error(
      'AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY deben estar ausentes para ' +
        'usar la sesión de aws login',
    );
  }
}

(runSmoke ? describe : describe.skip)(
  'R5: round-trip PUT/GET contra el bucket real de media',
  () => {
    const objectKey = `smoke/${Date.now()}-${randomUUID()}.bin`;
    const fixtureBytes = Buffer.from(
      `pet-tracker-media-aws-smoke-${randomUUID()}`,
      'utf8',
    );
    let names: AwsResourceNames | undefined;
    let s3: S3Client | undefined;
    let storage: PhotoStorageS3Adapter | undefined;

    beforeAll(() => {
      assertNoStaticCredentials();
      const config = resolveAwsConfigFromEnv(process.env);
      names = resolveResourceNamesFromEnv(process.env);
      s3 = createS3Client(config);
      storage = new PhotoStorageS3Adapter(s3, names);
    });

    afterAll(async () => {
      try {
        if (s3 && names) {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: names.mediaBucket,
              Key: objectKey,
            }),
          );
        }
      } finally {
        s3?.destroy();
      }
    }, 30000);

    it('rechaza credenciales estáticas antes de llamar a AWS', () => {
      expect(assertNoStaticCredentials).not.toThrow();
    });

    it('firma PUT y GET, conserva los bytes y borra el objeto al cerrar', async () => {
      if (!storage) {
        throw new Error('PhotoStorageS3Adapter no inicializado');
      }

      const uploadUrl = await storage.createUploadUrl(objectKey, 300);
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: fixtureBytes,
      });
      expect(uploadResponse.status).toBeGreaterThanOrEqual(200);
      expect(uploadResponse.status).toBeLessThan(300);

      const downloadUrl = await storage.createDownloadUrl(objectKey, 300);
      const downloadResponse = await fetch(downloadUrl);
      expect(downloadResponse.status).toBe(200);
      const downloadedBytes = Buffer.from(await downloadResponse.arrayBuffer());

      expect(downloadedBytes.equals(fixtureBytes)).toBe(true);
    }, 30000);
  },
);
