import {
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AWS_RESOURCE_NAMES, SQS_CLIENT } from '@/aws/aws.constants';
import type { AwsResourceNames } from '@/aws/resource-names';
import { WIALON_CLIENT } from '@/integrations/wialon/wialon-client.interface';
import type { WialonClient } from '@/integrations/wialon/wialon-client.interface';
import { CLAIM_WATERMARK_LOOKBACK_MINUTES } from '@/modules/devices/application/use-cases/claim-device.use-case';
import { INGESTION_STORE } from './ingestion-store';
import type { ActiveAssignment, IngestionStore } from './ingestion-store';

/** Tope de posiciones por mensaje SQS (R9). */
export const POSITIONS_PER_MESSAGE_MAX = 100;

/**
 * Poller de ingesta (R9-R11): toda la logica vive en runOnce() para que los
 * tests y el e2e lo invoquen sin esperas de reloj (D10); el scheduling es
 * una cascara aparte (IngestionSchedulerService, R8).
 */
@Injectable()
export class PollerService {
  private readonly logger = new Logger(PollerService.name);
  private queueUrl: string | null = null;
  private running = false;

  constructor(
    @Inject(INGESTION_STORE) private readonly store: IngestionStore,
    @Inject(WIALON_CLIENT) private readonly wialon: WialonClient,
    @Inject(SQS_CLIENT) private readonly sqs: SQSClient,
    @Inject(AWS_RESOURCE_NAMES) private readonly names: AwsResourceNames,
  ) {}

  async runOnce(now: Date = new Date()): Promise<void> {
    // Guard de solape en memoria (R11, D4): proceso unico local — si el
    // ciclo anterior sigue en curso, este tick se salta.
    if (this.running) {
      return;
    }
    this.running = true;

    try {
      // SQS/LocalStack caido: un solo log de error por tick y reintento al
      // siguiente — jamas tumbar el proceso NestJS (R11, D12).
      let queueUrl: string;
      try {
        queueUrl = await this.resolveQueueUrl();
      } catch (error) {
        this.logger.error({
          scope: 'poller',
          message: `cycle skipped, cannot resolve queue url: ${describeError(error)}`,
        });
        return;
      }

      const assignments = await this.store.listActiveAssignments();
      for (const assignment of assignments) {
        try {
          await this.pollAssignment(assignment, queueUrl, now);
        } catch (error) {
          // Un device que falla no aborta el ciclo de los demas (R11).
          this.logger.error({
            scope: 'poller',
            deviceId: assignment.deviceId,
            unitId: assignment.unitId,
            message: describeError(error),
          });
        }
      }
    } catch (error) {
      this.logger.error({
        scope: 'poller',
        message: `cycle failed: ${describeError(error)}`,
      });
    } finally {
      this.running = false;
    }
  }

  private async pollAssignment(
    assignment: ActiveAssignment,
    queueUrl: string,
    now: Date,
  ): Promise<void> {
    // Watermark NULL o futuro: no es utilizable, asi que se recupera con el
    // mismo lookback que inicializa el claim de #7. Uno pasado se conserva.
    const nowMs = now.getTime();
    const lookbackTs = nowMs - CLAIM_WATERMARK_LOOKBACK_MINUTES * 60_000;
    const watermarkTs = assignment.ingestWatermark?.getTime();
    const hasFutureWatermark = watermarkTs !== undefined && watermarkTs > nowMs;

    if (hasFutureWatermark) {
      this.logger.warn({
        scope: 'poller',
        deviceId: assignment.deviceId,
        unitId: assignment.unitId,
        ingestWatermark: assignment.ingestWatermark?.toISOString(),
        message: 'future ingest watermark ignored',
      });
    }

    const fromTs =
      watermarkTs === undefined || hasFutureWatermark
        ? lookbackTs
        : watermarkTs;

    const positions = await this.wialon.getMessages(
      assignment.unitId,
      fromTs,
      nowMs,
    );
    if (positions.length === 0) {
      return;
    }

    for (
      let offset = 0;
      offset < positions.length;
      offset += POSITIONS_PER_MESSAGE_MAX
    ) {
      await this.sqs.send(
        new SendMessageCommand({
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify({
            version: 1,
            deviceId: assignment.deviceId,
            petId: assignment.petId,
            unitId: assignment.unitId,
            positions: positions.slice(
              offset,
              offset + POSITIONS_PER_MESSAGE_MAX,
            ),
          }),
        }),
      );
    }

    // Despues de publicar, nunca antes (R10), y nunca mas alla de now (R6):
    // este tope protege el watermark aunque el filtro del consumidor se omita.
    // Si el send falla, el siguiente ciclo re-publica (at-least-once; los
    // duplicados los absorbe la idempotencia de R13).
    const lastTs = Math.max(...positions.map((position) => position.ts));
    await this.store.advanceWatermark(
      assignment.deviceId,
      new Date(Math.min(lastTs, nowMs)),
    );
  }

  /** El provisioning (#2) no persiste URLs: se deriva del nombre y se cachea. */
  private async resolveQueueUrl(): Promise<string> {
    if (this.queueUrl !== null) {
      return this.queueUrl;
    }

    const response = await this.sqs.send(
      new GetQueueUrlCommand({ QueueName: this.names.positionsRaw }),
    );
    if (!response.QueueUrl) {
      throw new Error(`queue ${this.names.positionsRaw} has no QueueUrl`);
    }

    this.queueUrl = response.QueueUrl;
    return this.queueUrl;
  }
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
