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

describe('#157 R7: getObjectSize hace HEAD al bucket de media', () => {
  it('#157 R7: resuelve ContentLength cuando el HEAD responde', async () => {
    const { send, storage } = buildDeps();
    send.mockResolvedValue({ ContentLength: 18 });

    await expect(storage.getObjectSize('pets/p/docs/d')).resolves.toBe(18);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toBeInstanceOf(HeadObjectCommand);
    expect(send.mock.calls[0][0].input).toEqual({
      Bucket: 'bucket-under-test',
      Key: 'pets/p/docs/d',
    });
  });

  it('#157 R7: resuelve null cuando el HEAD falla con 404', async () => {
    const { send, storage } = buildDeps();
    send.mockRejectedValue(
      Object.assign(new Error('NotFound'), {
        name: 'NotFound',
        $metadata: { httpStatusCode: 404 },
      }),
    );

    await expect(storage.getObjectSize('pets/p/docs/d')).resolves.toBeNull();
  });

  it('#157 R7: relanza cualquier otro error, por ejemplo un 403', async () => {
    const { send, storage } = buildDeps();
    const boom = Object.assign(new Error('Forbidden'), {
      $metadata: { httpStatusCode: 403 },
    });
    send.mockRejectedValue(boom);

    await expect(storage.getObjectSize('pets/p/docs/d')).rejects.toBe(boom);
  });
});

describe('#161 R1: getObjectSize devuelve ContentLength o falla sin él', () => {
  it('#161 R1 (a): resuelve el ContentLength tal cual, sin límite (10485761)', async () => {
    const { send, storage } = buildDeps();
    send.mockResolvedValue({ ContentLength: 10485761 });

    await expect(storage.getObjectSize('pets/p/docs/d')).resolves.toBe(
      10485761,
    );
  });

  it('#161 R1 (a): resuelve 0 cuando el objeto está vacío', async () => {
    const { send, storage } = buildDeps();
    send.mockResolvedValue({ ContentLength: 0 });

    await expect(storage.getObjectSize('pets/p/docs/d')).resolves.toBe(0);
  });

  it('#161 R1 (b): rechaza si el HEAD responde sin ContentLength', async () => {
    const { send, storage } = buildDeps();
    send.mockResolvedValue({});

    await expect(storage.getObjectSize('pets/p/docs/d')).rejects.toThrow(
      /^HeadObject response has no ContentLength$/,
    );
  });
});
