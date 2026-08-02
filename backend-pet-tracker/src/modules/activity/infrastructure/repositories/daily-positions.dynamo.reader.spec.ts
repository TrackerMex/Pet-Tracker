import { Logger } from '@nestjs/common';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  TABLE_POSITIONS,
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
} from '@/aws/constants';
import {
  ACTIVITY_MAX_PAGES_PER_DAY,
  ACTIVITY_PAGE_LIMIT,
} from '@/modules/activity/activity.constants';
import { DailyPositionsDynamoReader } from './daily-positions.dynamo.reader';

const PET_A = '018f5a3e-0000-7000-8000-000000000001';
const START_MS = Date.UTC(2026, 7, 2, 6, 0, 0);
const END_MS = Date.UTC(2026, 7, 3, 6, 0, 0);

interface QueryInput {
  TableName?: string;
  KeyConditionExpression?: string;
  ExpressionAttributeValues?: Record<string, unknown>;
  ScanIndexForward?: boolean;
  Limit?: number;
  ExclusiveStartKey?: Record<string, unknown>;
}

function item(ts: number, overrides: Record<string, unknown> = {}) {
  return {
    [TABLE_POSITIONS_PARTITION_KEY]: `PET#${PET_A}`,
    [TABLE_POSITIONS_SORT_KEY]: ts,
    lat: 19.4326,
    lng: -99.1332,
    speed_kmh: 4.5,
    course: 180,
    altitude: 2240,
    sats: 9,
    accuracy_m: 12,
    battery_pct: 88,
    device_ts: ts,
    received_ts: ts + 2_000,
    processed_ts: ts + 3_000,
    flags: ['low_accuracy'],
    expires_at: Math.floor(ts / 1000) + 90 * 86_400,
    ...overrides,
  };
}

/** Doble del DocumentClient que devuelve una salida por invocacion. */
function fakeDocuments(outputs: Array<Record<string, unknown>>) {
  const sent: QueryCommand[] = [];
  const documents = {
    send: jest.fn((command: QueryCommand) => {
      sent.push(command);
      const index = Math.min(sent.length - 1, outputs.length - 1);
      return Promise.resolve(outputs[index]);
    }),
  } as unknown as DynamoDBDocumentClient;

  return {
    documents,
    sent,
    inputAt: (index: number): QueryInput => sent[index].input,
  };
}

describe('R12: DailyPositionsReader lee un dia entero paginando por dentro', () => {
  it('emite la Query del contrato: pk de la mascota, sk BETWEEN semiabierto y ascendente', async () => {
    const { documents, sent, inputAt } = fakeDocuments([{ Items: [] }]);

    await new DailyPositionsDynamoReader(documents).readDay(
      PET_A,
      START_MS,
      END_MS,
    );

    expect(sent).toHaveLength(1);
    expect(inputAt(0).TableName).toBe(TABLE_POSITIONS);
    expect(inputAt(0).KeyConditionExpression).toBe(
      `${TABLE_POSITIONS_PARTITION_KEY} = :pk AND ${TABLE_POSITIONS_SORT_KEY} BETWEEN :from AND :to`,
    );
    expect(inputAt(0).ExpressionAttributeValues).toEqual({
      ':pk': `PET#${PET_A}`,
      ':from': START_MS,
      // BETWEEN es inclusive: endMs - 1 conserva el rango semiabierto de R7.
      ':to': END_MS - 1,
    });
    expect(inputAt(0).ScanIndexForward).toBe(true);
    expect(inputAt(0).Limit).toBe(ACTIVITY_PAGE_LIMIT);
    expect(inputAt(0).ExclusiveStartKey).toBeUndefined();
  });

  it('concatena tres paginas en una serie ascendente y sin duplicados', async () => {
    const { documents, sent, inputAt } = fakeDocuments([
      {
        Items: [item(START_MS), item(START_MS + 1_000)],
        LastEvaluatedKey: {
          [TABLE_POSITIONS_PARTITION_KEY]: `PET#${PET_A}`,
          [TABLE_POSITIONS_SORT_KEY]: START_MS + 1_000,
        },
      },
      {
        Items: [item(START_MS + 2_000), item(START_MS + 3_000)],
        LastEvaluatedKey: {
          [TABLE_POSITIONS_PARTITION_KEY]: `PET#${PET_A}`,
          [TABLE_POSITIONS_SORT_KEY]: START_MS + 3_000,
        },
      },
      { Items: [item(START_MS + 4_000)] },
    ]);

    const positions = await new DailyPositionsDynamoReader(documents).readDay(
      PET_A,
      START_MS,
      END_MS,
    );

    expect(sent).toHaveLength(3);
    expect(positions.map((position) => position.ts)).toEqual([
      START_MS,
      START_MS + 1_000,
      START_MS + 2_000,
      START_MS + 3_000,
      START_MS + 4_000,
    ]);
    expect(new Set(positions.map((position) => position.ts)).size).toBe(5);
    expect(inputAt(1).ExclusiveStartKey).toEqual({
      [TABLE_POSITIONS_PARTITION_KEY]: `PET#${PET_A}`,
      [TABLE_POSITIONS_SORT_KEY]: START_MS + 1_000,
    });
  });

  it('mapea el item de #8 al ProcessedPosition puro, con null -> undefined', async () => {
    const { documents } = fakeDocuments([
      {
        Items: [
          item(START_MS, {
            speed_kmh: null,
            course: null,
            altitude: null,
            sats: null,
            accuracy_m: null,
            battery_pct: null,
            flags: ['suspect_jump'],
          }),
        ],
      },
    ]);

    const [position] = await new DailyPositionsDynamoReader(documents).readDay(
      PET_A,
      START_MS,
      END_MS,
    );

    expect(position).toEqual({
      lat: 19.4326,
      lng: -99.1332,
      ts: START_MS,
      flags: ['suspect_jump'],
    });
    expect(Object.keys(position).sort()).toEqual(['flags', 'lat', 'lng', 'ts']);
  });

  it('conserva los opcionales presentes y no filtra los atributos internos', async () => {
    const { documents } = fakeDocuments([{ Items: [item(START_MS)] }]);

    const [position] = await new DailyPositionsDynamoReader(documents).readDay(
      PET_A,
      START_MS,
      END_MS,
    );

    expect(position).toEqual({
      lat: 19.4326,
      lng: -99.1332,
      ts: START_MS,
      speedKmh: 4.5,
      course: 180,
      altitude: 2240,
      sats: 9,
      accuracyM: 12,
      batteryPct: 88,
      flags: ['low_accuracy'],
    });
    expect(JSON.stringify(position)).not.toMatch(
      /received_ts|processed_ts|expires_at|device_ts|"pk"|"sk"/,
    );
  });

  it('al tope de paginas computa con lo leido y registra un warn, sin lanzar', async () => {
    const warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    const { documents, sent } = fakeDocuments([
      {
        Items: [item(START_MS)],
        LastEvaluatedKey: {
          [TABLE_POSITIONS_PARTITION_KEY]: `PET#${PET_A}`,
          [TABLE_POSITIONS_SORT_KEY]: START_MS,
        },
      },
    ]);

    const positions = await new DailyPositionsDynamoReader(documents).readDay(
      PET_A,
      START_MS,
      END_MS,
    );

    expect(sent).toHaveLength(ACTIVITY_MAX_PAGES_PER_DAY);
    expect(positions).toHaveLength(ACTIVITY_MAX_PAGES_PER_DAY);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatchObject({
      petId: PET_A,
      pagesRead: ACTIVITY_MAX_PAGES_PER_DAY,
    });
    expect(warn.mock.calls[0][0]).toHaveProperty('date');

    warn.mockRestore();
  });
});
