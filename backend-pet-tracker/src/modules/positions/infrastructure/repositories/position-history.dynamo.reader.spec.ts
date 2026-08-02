import { readFileSync } from 'fs';
import { join } from 'path';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  TABLE_POSITIONS,
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
} from '@/aws/constants';
import { POSITIONS_PAGE_LIMIT } from '@/modules/positions/positions.constants';
import { PositionHistoryDynamoReader } from './position-history.dynamo.reader';

const PET_A = '018f5a3e-0000-7000-8000-000000000001';

interface QueryInput {
  TableName?: string;
  KeyConditionExpression?: string;
  ExpressionAttributeValues?: Record<string, unknown>;
  ScanIndexForward?: boolean;
  Limit?: number;
  ExclusiveStartKey?: Record<string, unknown>;
  FilterExpression?: string;
}

function fakeDocuments(output: Record<string, unknown> = { Items: [] }) {
  const sent: QueryCommand[] = [];
  const documents = {
    send: jest.fn((command: QueryCommand) => {
      sent.push(command);
      return Promise.resolve(output);
    }),
  } as unknown as DynamoDBDocumentClient;

  return {
    documents,
    lastInput: (): QueryInput => sent[sent.length - 1].input as QueryInput,
    sent,
  };
}

describe('R10: una sola Query por pagina, pk = PET#<petId>, sk BETWEEN inclusive, ascendente y Limit fijo', () => {
  it('emite la KeyConditionExpression del contrato con los limites en epoch ms', async () => {
    const { documents, lastInput, sent } = fakeDocuments();
    const reader = new PositionHistoryDynamoReader(documents);

    await reader.queryPage({
      petId: PET_A,
      fromMs: 1_754_121_600_000,
      toMs: 1_754_125_200_000,
      startAfterSk: null,
    });

    expect(sent).toHaveLength(1);
    expect(lastInput().TableName).toBe(TABLE_POSITIONS);
    expect(lastInput().KeyConditionExpression).toBe(
      `${TABLE_POSITIONS_PARTITION_KEY} = :pk AND ${TABLE_POSITIONS_SORT_KEY} BETWEEN :from AND :to`,
    );
    expect(lastInput().ExpressionAttributeValues).toEqual({
      ':pk': `PET#${PET_A}`,
      ':from': 1_754_121_600_000,
      ':to': 1_754_125_200_000,
    });
  });

  it('lee en orden cronologico ascendente con el Limit nombrado del modulo', async () => {
    const { documents, lastInput } = fakeDocuments();
    const reader = new PositionHistoryDynamoReader(documents);

    await reader.queryPage({
      petId: PET_A,
      fromMs: 1,
      toMs: 2,
      startAfterSk: null,
    });

    expect(lastInput().ScanIndexForward).toBe(true);
    expect(lastInput().Limit).toBe(POSITIONS_PAGE_LIMIT);
    expect(POSITIONS_PAGE_LIMIT).toBe(1000);
  });

  it('sin cursor no manda ExclusiveStartKey', async () => {
    const { documents, lastInput } = fakeDocuments();
    const reader = new PositionHistoryDynamoReader(documents);

    await reader.queryPage({
      petId: PET_A,
      fromMs: 1,
      toMs: 2,
      startAfterSk: null,
    });

    expect(lastInput().ExclusiveStartKey).toBeUndefined();
  });

  it('con cursor construye la pk desde el petId de la ruta, no desde el cursor', async () => {
    const { documents, lastInput } = fakeDocuments();
    const reader = new PositionHistoryDynamoReader(documents);

    await reader.queryPage({
      petId: PET_A,
      fromMs: 1,
      toMs: 9_999,
      startAfterSk: 4_242,
    });

    expect(lastInput().ExclusiveStartKey).toEqual({
      [TABLE_POSITIONS_PARTITION_KEY]: `PET#${PET_A}`,
      [TABLE_POSITIONS_SORT_KEY]: 4_242,
    });
  });

  it('no usa FilterExpression: el filtro de flags es del caso de uso', async () => {
    const { documents, lastInput } = fakeDocuments();
    const reader = new PositionHistoryDynamoReader(documents);

    await reader.queryPage({
      petId: PET_A,
      fromMs: 1,
      toMs: 2,
      startAfterSk: null,
    });

    expect(lastInput().FilterExpression).toBeUndefined();
  });

  it('devuelve el sk del LastEvaluatedKey, o null si la pagina agoto el rango', async () => {
    const withMore = fakeDocuments({
      Items: [],
      LastEvaluatedKey: {
        [TABLE_POSITIONS_PARTITION_KEY]: `PET#${PET_A}`,
        [TABLE_POSITIONS_SORT_KEY]: 777,
      },
    });
    const exhausted = fakeDocuments({ Items: [] });

    await expect(
      new PositionHistoryDynamoReader(withMore.documents).queryPage({
        petId: PET_A,
        fromMs: 1,
        toMs: 2,
        startAfterSk: null,
      }),
    ).resolves.toEqual({ items: [], lastKey: 777 });
    await expect(
      new PositionHistoryDynamoReader(exhausted.documents).queryPage({
        petId: PET_A,
        fromMs: 1,
        toMs: 2,
        startAfterSk: null,
      }),
    ).resolves.toEqual({ items: [], lastKey: null });
  });

  it('proyecta los items al contrato publico via el mapper', async () => {
    const { documents } = fakeDocuments({
      Items: [
        {
          pk: `PET#${PET_A}`,
          sk: 1_000,
          lat: 19.4,
          lng: -99.1,
          speed_kmh: 3,
          course: 10,
          altitude: 2240,
          sats: 8,
          accuracy_m: 15,
          battery_pct: 60,
          device_ts: 1_000,
          received_ts: 1_100,
          processed_ts: 1_200,
          flags: [],
          expires_at: 99,
        },
      ],
    });
    const reader = new PositionHistoryDynamoReader(documents);

    const page = await reader.queryPage({
      petId: PET_A,
      fromMs: 1,
      toMs: 2_000,
      startAfterSk: null,
    });

    expect(page.items).toEqual([
      {
        ts: 1_000,
        lat: 19.4,
        lng: -99.1,
        speedKmh: 3,
        course: 10,
        altitude: 2240,
        sats: 8,
        accuracyM: 15,
        batteryPct: 60,
        flags: [],
      },
    ]);
  });

  it('no usa Scan en ningun caso', () => {
    const code = readFileSync(
      join(__dirname, 'position-history.dynamo.reader.ts'),
      'utf-8',
    )
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');

    expect(code).not.toMatch(/ScanCommand/);
  });
});
