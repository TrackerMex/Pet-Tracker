import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
} from '@/aws/constants';
import { AWS_RESOURCE_NAMES } from '@/aws/aws.constants';
import type { AwsResourceNames } from '@/aws/resource-names';
import {
  ACTIVITY_DAILY_DOC_CLIENT,
  ACTIVITY_MAX_PAGES_PER_DAY,
  ACTIVITY_PAGE_LIMIT,
} from '@/modules/activity/activity.constants';
import type { DailyPositionsReader } from '@/modules/activity/domain/repositories/daily-positions.reader';
import type { ProcessedPosition } from '@/pipeline/types';

/**
 * Adaptador DynamoDB del puerto de #10 (R12): una `Query` por pagina sobre
 * la tabla `positions`, paginando por dentro hasta agotar el dia o alcanzar
 * el tope defensivo. Nunca `Scan`, y la `pk` se construye siempre desde el
 * `petId` que el guard (o el barrido) ya autorizo.
 */
@Injectable()
export class DailyPositionsDynamoReader implements DailyPositionsReader {
  private readonly logger = new Logger(DailyPositionsDynamoReader.name);

  constructor(
    @Inject(ACTIVITY_DAILY_DOC_CLIENT)
    private readonly documents: DynamoDBDocumentClient,
    @Inject(AWS_RESOURCE_NAMES) private readonly names: AwsResourceNames,
  ) {}

  async readDay(
    petId: string,
    startMs: number,
    endMs: number,
  ): Promise<ProcessedPosition[]> {
    const partitionKey = `PET#${petId}`;
    const positions: ProcessedPosition[] = [];
    let startKey: Record<string, unknown> | undefined = undefined;
    let pagesRead = 0;

    do {
      const result = await this.documents.send(
        new QueryCommand({
          TableName: this.names.positionsTable,
          // BETWEEN es inclusive en ambos extremos: `endMs - 1` conserva el
          // rango semiabierto [startMs, endMs) que resuelve local-day.ts.
          KeyConditionExpression: `${TABLE_POSITIONS_PARTITION_KEY} = :pk AND ${TABLE_POSITIONS_SORT_KEY} BETWEEN :from AND :to`,
          ExpressionAttributeValues: {
            ':pk': partitionKey,
            ':from': startMs,
            ':to': endMs - 1,
          },
          ScanIndexForward: true,
          Limit: ACTIVITY_PAGE_LIMIT,
          ExclusiveStartKey: startKey,
        }),
      );

      for (const raw of result.Items ?? []) {
        positions.push(toProcessedPosition(raw as Record<string, unknown>));
      }

      startKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
      pagesRead += 1;
    } while (startKey !== undefined && pagesRead < ACTIVITY_MAX_PAGES_PER_DAY);

    if (startKey !== undefined) {
      // Se computa con lo leido, nunca se lanza: un dia raro no puede
      // convertirse en un 500 ni tumbar el barrido nocturno.
      this.logger.warn({
        scope: 'activity-daily-reader',
        petId,
        // El reader no conoce la tz del owner: la fecha del log es la del
        // instante de arranque en UTC, suficiente para localizar el dia.
        date: new Date(startMs).toISOString().slice(0, 10),
        pagesRead,
        message: 'page limit reached, computing with the positions read so far',
      });
    }

    return positions;
  }
}

/**
 * Item de la tabla `positions` -> tipo del nucleo puro. Lista explicita de
 * campos, sin spread: `received_ts`, `processed_ts`, `device_ts` y
 * `expires_at` son internos del pipeline y no entran al computo. `null` del
 * item pasa a ausencia, que es como `ProcessedPosition` declara sus
 * opcionales.
 */
function toProcessedPosition(item: Record<string, unknown>): ProcessedPosition {
  const position: ProcessedPosition = {
    lat: numberOr(item.lat, 0),
    lng: numberOr(item.lng, 0),
    ts: numberOr(item[TABLE_POSITIONS_SORT_KEY], 0),
    flags: Array.isArray(item.flags)
      ? item.flags.filter((flag): flag is string => typeof flag === 'string')
      : [],
  };

  assignIfNumber(position, 'speedKmh', item.speed_kmh);
  assignIfNumber(position, 'course', item.course);
  assignIfNumber(position, 'altitude', item.altitude);
  assignIfNumber(position, 'sats', item.sats);
  assignIfNumber(position, 'accuracyM', item.accuracy_m);
  assignIfNumber(position, 'batteryPct', item.battery_pct);

  return position;
}

type OptionalNumberKey =
  'speedKmh' | 'course' | 'altitude' | 'sats' | 'accuracyM' | 'batteryPct';

function assignIfNumber(
  position: ProcessedPosition,
  key: OptionalNumberKey,
  value: unknown,
): void {
  if (typeof value === 'number') {
    position[key] = value;
  }
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' ? value : Number(value ?? fallback);
}
