import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';
import {
  TABLE_POSITIONS,
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
} from '@/aws/constants';
import type {
  PositionHistoryPage,
  PositionHistoryQuery,
  PositionHistoryReader,
} from '@/modules/positions/domain/repositories/position-history.reader';
import {
  POSITIONS_PAGE_LIMIT,
  POSITIONS_READ_DOC_CLIENT,
} from '@/modules/positions/positions.constants';
import { toStoredPosition } from '@/modules/positions/infrastructure/mappers/position-response.mapper';

/**
 * Una unica `Query` por pagina sobre la tabla `positions` (R10). Nunca
 * `Scan`, y la `pk` se construye siempre desde el `petId` que el guard
 * autorizo: el cursor solo aporta el `sk` de arranque, asi que ni un cursor
 * fabricado a mano puede cruzar de particion (R14).
 */
@Injectable()
export class PositionHistoryDynamoReader implements PositionHistoryReader {
  constructor(
    @Inject(POSITIONS_READ_DOC_CLIENT)
    private readonly documents: DynamoDBDocumentClient,
  ) {}

  async queryPage(query: PositionHistoryQuery): Promise<PositionHistoryPage> {
    const partitionKey = `PET#${query.petId}`;

    const result = await this.documents.send(
      new QueryCommand({
        TableName: TABLE_POSITIONS,
        // BETWEEN es inclusive en ambos extremos, como exige R10.
        KeyConditionExpression: `${TABLE_POSITIONS_PARTITION_KEY} = :pk AND ${TABLE_POSITIONS_SORT_KEY} BETWEEN :from AND :to`,
        ExpressionAttributeValues: {
          ':pk': partitionKey,
          ':from': query.fromMs,
          ':to': query.toMs,
        },
        // D5: ascendente — el consumidor natural es el trazado del recorrido.
        ScanIndexForward: true,
        Limit: POSITIONS_PAGE_LIMIT,
        ExclusiveStartKey:
          query.startAfterSk === null
            ? undefined
            : {
                [TABLE_POSITIONS_PARTITION_KEY]: partitionKey,
                [TABLE_POSITIONS_SORT_KEY]: query.startAfterSk,
              },
      }),
    );

    const lastEvaluatedKey = result.LastEvaluatedKey as
      Record<string, unknown> | undefined;
    const lastSk = lastEvaluatedKey?.[TABLE_POSITIONS_SORT_KEY];

    return {
      items: (result.Items ?? []).map((item) =>
        toStoredPosition(item as Record<string, unknown>),
      ),
      lastKey: typeof lastSk === 'number' ? lastSk : null,
    };
  }
}
