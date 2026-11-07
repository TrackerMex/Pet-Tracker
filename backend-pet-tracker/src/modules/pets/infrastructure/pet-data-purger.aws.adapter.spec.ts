import { Logger } from '@nestjs/common';
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
import type { AwsResourceNames } from '@/aws/resource-names';
import { PetDataPurgerAwsAdapter } from './pet-data-purger.aws.adapter';

function buildAdapter() {
  const calls: string[] = [];
  const s3Send = jest.fn((command: unknown): Promise<object> => {
    if (command instanceof ListObjectsV2Command)
      calls.push(`ListObjectsV2:${command.input.Prefix?.split('/')[1]}`);
    if (command instanceof DeleteObjectsCommand)
      calls.push(
        `DeleteObjects:${command.input.Delete?.Objects?.[0]?.Key?.split('/')[1]}`,
      );
    return Promise.resolve({});
  });
  const dynamoSend = jest.fn((command: unknown): Promise<object> => {
    if (command instanceof QueryCommand)
      calls.push(
        `Query:${command.input.ExpressionAttributeValues?.[':pk'].S?.slice(4)}`,
      );
    if (command instanceof BatchWriteItemCommand)
      calls.push('BatchWriteItem:p1');
    return Promise.resolve({});
  });
  const adapter = new PetDataPurgerAwsAdapter(
    { send: s3Send } as unknown as S3Client,
    { send: dynamoSend } as unknown as DynamoDBClient,
    {
      mediaBucket: 'bucket-under-test',
      positionsTable: 'positions-under-test',
    } as AwsResourceNames,
  );
  return { adapter, s3Send, dynamoSend, calls };
}

function inputsOf<T>(
  send: { mock: { calls: [unknown][] } },
  commandType: new (...args: never[]) => { input: T },
): T[] {
  return send.mock.calls.flatMap(([command]) =>
    command instanceof commandType ? [command.input] : [],
  );
}

describe('#247 R15: PetDataPurgerAwsAdapter purga S3 y DynamoDB por mascota', () => {
  let spy: jest.SpyInstance;
  const messages = () => spy.mock.calls.map(([message]) => String(message));
  beforeEach(() => {
    spy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
  });
  afterEach(() => {
    spy.mockRestore();
  });

  it('#247 R15: con [] no envía nada', async () => {
    const { adapter, s3Send, dynamoSend } = buildAdapter();
    await expect(adapter.purge([])).resolves.toBeUndefined();
    expect(s3Send).not.toHaveBeenCalled();
    expect(dynamoSend).not.toHaveBeenCalled();
  });
  it('#247 R15: lista pets/<petId>/ y borra la página con DeleteObjects Quiet', async () => {
    const { adapter, s3Send } = buildAdapter();
    const k1 = 'pets/p1/photo-1',
      k2 = 'pets/p1/docs/d1';
    s3Send.mockResolvedValueOnce({ Contents: [{ Key: k1 }, { Key: k2 }] });
    await expect(adapter.purge(['p1'])).resolves.toBeUndefined();
    expect(inputsOf(s3Send, ListObjectsV2Command)).toEqual([
      { Bucket: 'bucket-under-test', Prefix: 'pets/p1/' },
    ]);
    expect(inputsOf(s3Send, DeleteObjectsCommand)).toEqual([
      {
        Bucket: 'bucket-under-test',
        Delete: { Objects: [{ Key: k1 }, { Key: k2 }], Quiet: true },
      },
    ]);
  });
  it('#247 R15: pagina ListObjectsV2 con ContinuationToken y no borra páginas vacías', async () => {
    const { adapter, s3Send } = buildAdapter();
    s3Send
      .mockResolvedValueOnce({
        Contents: [{ Key: 'pets/p1/photo-1' }],
        IsTruncated: true,
        NextContinuationToken: 't1',
      })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});
    await expect(adapter.purge(['p1'])).resolves.toBeUndefined();
    expect(inputsOf(s3Send, ListObjectsV2Command)).toEqual([
      { Bucket: 'bucket-under-test', Prefix: 'pets/p1/' },
      {
        Bucket: 'bucket-under-test',
        Prefix: 'pets/p1/',
        ContinuationToken: 't1',
      },
    ]);
    expect(inputsOf(s3Send, DeleteObjectsCommand)).toHaveLength(1);
  });
  it('#247 R15: consulta PET#<petId> solo por claves y borra en lotes de 25', async () => {
    const { adapter, dynamoSend } = buildAdapter();
    const items = Array.from({ length: 30 }, (_, i) => ({
      pk: { S: 'PET#p1' },
      sk: { N: String(i + 1) },
    }));
    const lastKey = items[29];
    dynamoSend
      .mockResolvedValueOnce({ Items: items, LastEvaluatedKey: lastKey })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});
    await expect(adapter.purge(['p1'])).resolves.toBeUndefined();
    const query = {
      TableName: 'positions-under-test',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': { S: 'PET#p1' } },
      ProjectionExpression: 'pk, sk',
    };
    expect(inputsOf(dynamoSend, QueryCommand)).toEqual([
      query,
      { ...query, ExclusiveStartKey: lastKey },
    ]);
    expect(inputsOf(dynamoSend, BatchWriteItemCommand)).toEqual(
      [items.slice(0, 25), items.slice(25)].map((keys) => ({
        RequestItems: {
          'positions-under-test': keys.map((Key) => ({
            DeleteRequest: { Key },
          })),
        },
      })),
    );
  });
  it('#247 R15: reenvía UnprocessedItems hasta 3 intentos por lote', async () => {
    const { adapter, dynamoSend } = buildAdapter();
    const key = { pk: { S: 'PET#p1' }, sk: { N: '1' } };
    const request = { DeleteRequest: { Key: key } };
    dynamoSend
      .mockResolvedValueOnce({ Items: [key] })
      .mockResolvedValueOnce({
        UnprocessedItems: { 'positions-under-test': [request] },
      })
      .mockResolvedValueOnce({});
    await expect(adapter.purge(['p1'])).resolves.toBeUndefined();
    const input = { RequestItems: { 'positions-under-test': [request] } };
    expect(inputsOf(dynamoSend, BatchWriteItemCommand)).toEqual([input, input]);
    expect(messages()).toEqual([]);
    dynamoSend.mockClear();
    dynamoSend
      .mockResolvedValue({
        UnprocessedItems: { 'positions-under-test': [request] },
      })
      .mockResolvedValueOnce({ Items: [key] });
    await expect(adapter.purge(['p1'])).resolves.toBeUndefined();
    expect(inputsOf(dynamoSend, BatchWriteItemCommand)).toEqual([
      input,
      input,
      input,
    ]);
    expect(messages()).toHaveLength(1);
    expect(
      messages()[0].startsWith(
        'PET_PURGE_FAILED store=dynamodb petId=p1 target=PET#p1 reason=',
      ),
    ).toBe(true);
  });
  it('#247 R15: un fallo de S3 se registra y sigue con DynamoDB y la siguiente mascota', async () => {
    const { adapter, s3Send, calls } = buildAdapter();
    s3Send.mockRejectedValueOnce(new Error('s3 down'));
    await expect(adapter.purge(['p1', 'p2'])).resolves.toBeUndefined();
    expect(calls).toEqual(['Query:p1', 'ListObjectsV2:p2', 'Query:p2']);
    expect(messages()).toEqual([
      'PET_PURGE_FAILED store=s3 petId=p1 target=pets/p1/ reason=s3 down',
    ]);
    spy.mockClear();
    s3Send
      .mockResolvedValueOnce({ Contents: [{ Key: 'pets/p1/photo-1' }] })
      .mockResolvedValueOnce({
        Errors: [{ Key: 'pets/p1/photo-1', Code: 'AccessDenied' }],
      });
    await expect(adapter.purge(['p1'])).resolves.toBeUndefined();
    expect(messages()).toHaveLength(1);
    expect(
      messages()[0].startsWith(
        'PET_PURGE_FAILED store=s3 petId=p1 target=pets/p1/ reason=',
      ),
    ).toBe(true);
  });
  it('#247 R15: purga en serie, S3 antes que DynamoDB por mascota, y nunca rechaza', async () => {
    const { adapter, s3Send, dynamoSend, calls } = buildAdapter();
    await expect(adapter.purge(['p1', 'p2'])).resolves.toBeUndefined();
    expect(calls).toEqual([
      'ListObjectsV2:p1',
      'Query:p1',
      'ListObjectsV2:p2',
      'Query:p2',
    ]);
    s3Send.mockRejectedValue('s3 unavailable');
    dynamoSend.mockRejectedValue(new Error('dynamo unavailable'));
    await expect(adapter.purge(['p1', 'p2'])).resolves.toBeUndefined();
    expect(messages()).toEqual([
      'PET_PURGE_FAILED store=s3 petId=p1 target=pets/p1/ reason=s3 unavailable',
      'PET_PURGE_FAILED store=dynamodb petId=p1 target=PET#p1 reason=dynamo unavailable',
      'PET_PURGE_FAILED store=s3 petId=p2 target=pets/p2/ reason=s3 unavailable',
      'PET_PURGE_FAILED store=dynamodb petId=p2 target=PET#p2 reason=dynamo unavailable',
    ]);
  });
});
