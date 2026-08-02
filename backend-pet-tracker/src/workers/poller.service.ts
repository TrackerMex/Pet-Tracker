import {
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SQS_CLIENT } from '@/aws/aws.constants';
import { QUEUE_POSITIONS_RAW } from '@/aws/constants';
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

  constructor(
    @Inject(INGESTION_STORE) private readonly store: IngestionStore,
    @Inject(WIALON_CLIENT) private readonly wialon: WialonClient,
    @Inject(SQS_CLIENT) private readonly sqs: SQSClient,
  ) {}

  async runOnce(now: Date = new Date()): Promise<void> {
    const queueUrl = await this.resolveQueueUrl();
    const assignments = await this.store.listActiveAssignments();

    for (const assignment of assignments) {
      await this.pollAssignment(assignment, queueUrl, now);
    }
  }

  private async pollAssignment(
    assignment: ActiveAssignment,
    queueUrl: string,
    now: Date,
  ): Promise<void> {
    // Watermark NULL: primer ciclo tras un claim viejo o dato legado —
    // mismo lookback que inicializa el claim de #7 (R9).
    const fromTs =
      assignment.ingestWatermark?.getTime() ??
      now.getTime() - CLAIM_WATERMARK_LOOKBACK_MINUTES * 60_000;

    const positions = await this.wialon.getMessages(
      assignment.unitId,
      fromTs,
      now.getTime(),
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
  }

  /** El provisioning (#2) no persiste URLs: se deriva del nombre y se cachea. */
  private async resolveQueueUrl(): Promise<string> {
    if (this.queueUrl !== null) {
      return this.queueUrl;
    }

    const response = await this.sqs.send(
      new GetQueueUrlCommand({ QueueName: QUEUE_POSITIONS_RAW }),
    );
    if (!response.QueueUrl) {
      throw new Error(`queue ${QUEUE_POSITIONS_RAW} has no QueueUrl`);
    }

    this.queueUrl = response.QueueUrl;
    return this.queueUrl;
  }
}
