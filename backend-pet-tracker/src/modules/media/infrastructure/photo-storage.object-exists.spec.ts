import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { AwsResourceNames } from '@/aws/resource-names';
import { PhotoStorageS3Adapter } from './photo-storage.s3.adapter';

function buildDeps() {
  const send = jest.fn<Promise<unknown>, [HeadObjectCommand]>();
  const storage = new PhotoStorageS3Adapter(
    { send } as unknown as S3Client,
    { mediaBucket: 'bucket-under-test' } as AwsResourceNames,
  );
  return { send, storage };
}

describe('#157 R7: objectExists hace HEAD al bucket de media', () => {
  it('#157 R7: resuelve true cuando el HEAD responde', async () => {
    const { send, storage } = buildDeps();
    send.mockResolvedValue({});

    await expect(storage.objectExists('pets/p/docs/d')).resolves.toBe(true);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toBeInstanceOf(HeadObjectCommand);
    expect(send.mock.calls[0][0].input).toEqual({
      Bucket: 'bucket-under-test',
      Key: 'pets/p/docs/d',
    });
  });

  it('#157 R7: resuelve false cuando el HEAD falla con 404', async () => {
    const { send, storage } = buildDeps();
    send.mockRejectedValue(
      Object.assign(new Error('NotFound'), {
        name: 'NotFound',
        $metadata: { httpStatusCode: 404 },
      }),
    );

    await expect(storage.objectExists('pets/p/docs/d')).resolves.toBe(false);
  });

  it('#157 R7: relanza cualquier otro error, por ejemplo un 403', async () => {
    const { send, storage } = buildDeps();
    const boom = Object.assign(new Error('Forbidden'), {
      $metadata: { httpStatusCode: 403 },
    });
    send.mockRejectedValue(boom);

    await expect(storage.objectExists('pets/p/docs/d')).rejects.toBe(boom);
  });
});
