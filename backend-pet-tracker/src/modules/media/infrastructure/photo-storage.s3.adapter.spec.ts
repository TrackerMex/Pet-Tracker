import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { buildResourceNames } from '@/aws/resource-names';
import { PhotoStorageS3Adapter } from './photo-storage.s3.adapter';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://signed.example'),
}));

describe('R4: PhotoStorageS3Adapter usa los nombres inyectados', () => {
  const names = buildResourceNames('');
  const s3 = {} as S3Client;
  const storage = new PhotoStorageS3Adapter(s3, names);

  beforeEach(() => jest.clearAllMocks());

  it.each([
    [
      'upload',
      () => storage.createUploadUrl('pets/photo.jpg', 300),
      PutObjectCommand,
    ],
    [
      'download',
      () => storage.createDownloadUrl('pets/photo.jpg', 300),
      GetObjectCommand,
    ],
  ] as const)(
    'firma %s contra mediaBucket',
    async (_kind, createUrl, Command) => {
      await createUrl();

      expect(getSignedUrl).toHaveBeenCalledWith(s3, expect.any(Command), {
        expiresIn: 300,
      });
      const command = (getSignedUrl as jest.Mock).mock.calls[0][1] as
        PutObjectCommand | GetObjectCommand;
      expect(command.input).toMatchObject({
        Bucket: names.mediaBucket,
        Key: 'pets/photo.jpg',
      });
    },
  );
});
