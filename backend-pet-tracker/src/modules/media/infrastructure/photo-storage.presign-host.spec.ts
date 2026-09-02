import { createS3Client } from '@/aws/aws-clients';
import { buildResourceNames } from '@/aws/resource-names';
import { PhotoStorageS3Adapter } from './photo-storage.s3.adapter';

const KEY = 'pets/photo.jpg';
const LAN_ENDPOINT = 'http://192.168.7.42:4566';
const names = buildResourceNames('');
const s3 = createS3Client({
  mode: 'local',
  endpoint: 'http://localhost:4566',
  presignEndpoint: LAN_ENDPOINT,
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test',
});
const storage = new PhotoStorageS3Adapter(s3, names);

describe('R4: la URL prefirmada nace firmada con el host LAN', () => {
  afterAll(() => s3.destroy());

  it.each([
    ['subida', () => storage.createUploadUrl(KEY, 300)],
    ['descarga', () => storage.createDownloadUrl(KEY, 300)],
  ] as const)(
    'firma la URL de %s con el host y path de LocalStack accesibles por LAN',
    async (_kind, createUrl) => {
      const url = new URL(await createUrl());

      expect(url.host).toBe('192.168.7.42:4566');
      expect(url.pathname).toBe(`/${names.mediaBucket}/${KEY}`);
      expect(url.searchParams.get('X-Amz-Signature')).toBeTruthy();
      expect(url.searchParams.get('X-Amz-SignedHeaders')).toContain('host');
    },
  );
});
