import {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import type { Message } from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  DETAIL_TYPE_BATTERY_LOW,
  DETAIL_TYPE_POSITION_UPDATED,
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_NOTIFICATIONS,
} from '@/aws/constants';
import { SQS_CLIENT } from '@/aws/aws.constants';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { evaluate } from '@/pipeline/geofence-eval';
import type {
  ActiveGeofenceForEval,
  CloseOpenAlertInput,
  OpenAlertInput,
} from './alerts-engine-store';
import { ALERTS_ENGINE_STORE } from './alerts-engine-store';
import type { AlertsEngineStore } from './alerts-engine-store';
import {
  ALERT_TYPE_BATTERY_LOW,
  ALERT_TYPE_GEOFENCE_EXIT,
  CONSUMER_RECEIVE_MAX_MESSAGES,
  CONSUMER_WAIT_TIME_SECONDS,
} from './alerts-engine.constants';
import {
  batteryLowDetailSchema,
  geofenceEventEnvelopeSchema,
  positionUpdatedDetailSchema,
} from './geofence-event-message.schema';
import type {
  BatteryLowDetail,
  PositionUpdatedDetail,
} from './geofence-event-message.schema';
import { BATTERY_RECOVERY_THRESHOLD_PCT } from '@/pipeline/constants';

// Tope de iteraciones por drenado — mismo criterio que positions-consumer.
const MAX_DRAIN_ITERATIONS = 50;

type ParsedGeofenceEvent =
  | { kind: typeof DETAIL_TYPE_POSITION_UPDATED; detail: PositionUpdatedDetail }
  | { kind: typeof DETAIL_TYPE_BATTERY_LOW; detail: BatteryLowDetail }
  | { kind: 'unknown' };

interface NotifyParams {
  kind: 'alert' | 'alert_resolved';
  alertId: string;
  petId: string;
  type: 'geofence_exit' | 'battery_low';
  geofenceName?: string;
  batteryPct?: number;
}

/**
 * Consumidor de geofence-events (R5-R16): toda la logica vive en drainOnce()
 * para que los tests y el e2e (R18) lo invoquen sin esperas de reloj (D10);
 * el scheduling es una cascara aparte (AlertsEngineSchedulerService, R17).
 *
 * Orden por evento position.updated con exit/enter (D3, orden a prueba de
 * caidas): alert_events se escribe/actualiza ANTES que geofence_state — una
 * caida a mitad de camino deja el estado sin avanzar, y la redelivery
 * reintenta la escritura en base (idempotente por R2) antes de completar la
 * persistencia del estado.
 */
@Injectable()
export class AlertsEngineConsumerService {
  private readonly logger = new Logger(AlertsEngineConsumerService.name);
  private queueUrls = new Map<string, string>();

  constructor(
    @Inject(ALERTS_ENGINE_STORE) private readonly store: AlertsEngineStore,
    @Inject(SQS_CLIENT) private readonly sqs: SQSClient,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
  ) {}

  async drainOnce(now: Date = new Date()): Promise<void> {
    let queueUrl: string;
    try {
      queueUrl = await this.resolveQueueUrl(QUEUE_GEOFENCE_EVENTS);
    } catch (error) {
      this.logger.error({
        scope: 'alerts-engine-consumer',
        message: `drain skipped, cannot resolve queue url: ${describeError(error)}`,
      });
      return;
    }

    for (let iteration = 0; iteration < MAX_DRAIN_ITERATIONS; iteration++) {
      const received = await this.sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: queueUrl,
          MaxNumberOfMessages: CONSUMER_RECEIVE_MAX_MESSAGES,
          WaitTimeSeconds: CONSUMER_WAIT_TIME_SECONDS,
        }),
      );

      const messages = received.Messages ?? [];
      if (messages.length === 0) {
        return;
      }

      for (const sqsMessage of messages) {
        await this.consumeMessage(queueUrl, sqsMessage, now);
      }
    }
  }

  private async consumeMessage(
    queueUrl: string,
    sqsMessage: Message,
    now: Date,
  ): Promise<void> {
    const parsed = this.parseBody(sqsMessage);
    if (parsed === null) {
      // R5: malformado — sin delete, la RedrivePolicy lo lleva a la DLQ
      // tras SQS_MAX_RECEIVE_COUNT intentos. Jamas se escribe a mano.
      return;
    }

    if (parsed.kind === 'unknown') {
      // R6: rama defensiva — la regla de R4 ya filtra en origen, no se
      // espera alcanzar esto en produccion. Se borra sin reintentar.
      this.logger.error({
        scope: 'alerts-engine-consumer',
        messageId: sqsMessage.MessageId,
        message: 'unrecognized detail-type, dropping message without retry',
      });
      await this.sqs.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: sqsMessage.ReceiptHandle,
        }),
      );
      return;
    }

    try {
      await this.handleMessage(parsed, now);
      await this.sqs.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: sqsMessage.ReceiptHandle,
        }),
      );
    } catch (error) {
      // R16: el fallido no envenena el lote — queda sin borrar y vuelve por
      // redelivery; la idempotencia de R2/R7 hace seguro el reintento.
      this.logger.error({
        scope: 'alerts-engine-consumer',
        messageId: sqsMessage.MessageId,
        message: describeError(error),
      });
    }
  }

  private parseBody(sqsMessage: Message): ParsedGeofenceEvent | null {
    let json: unknown;
    try {
      json = JSON.parse(sqsMessage.Body ?? '');
    } catch {
      this.logger.error({
        scope: 'alerts-engine-consumer',
        messageId: sqsMessage.MessageId,
        message: 'malformed message body: invalid JSON',
      });
      return null;
    }

    const envelope = geofenceEventEnvelopeSchema.safeParse(json);
    if (!envelope.success) {
      this.logger.error({
        scope: 'alerts-engine-consumer',
        messageId: sqsMessage.MessageId,
        message: `malformed message body: ${envelope.error.message}`,
      });
      return null;
    }

    const detailType = envelope.data['detail-type'];

    if (detailType === DETAIL_TYPE_POSITION_UPDATED) {
      const detail = positionUpdatedDetailSchema.safeParse(
        envelope.data.detail,
      );
      if (!detail.success) {
        this.logger.error({
          scope: 'alerts-engine-consumer',
          messageId: sqsMessage.MessageId,
          message: `malformed message body: ${detail.error.message}`,
        });
        return null;
      }
      return { kind: DETAIL_TYPE_POSITION_UPDATED, detail: detail.data };
    }

    if (detailType === DETAIL_TYPE_BATTERY_LOW) {
      const detail = batteryLowDetailSchema.safeParse(envelope.data.detail);
      if (!detail.success) {
        this.logger.error({
          scope: 'alerts-engine-consumer',
          messageId: sqsMessage.MessageId,
          message: `malformed message body: ${detail.error.message}`,
        });
        return null;
      }
      return { kind: DETAIL_TYPE_BATTERY_LOW, detail: detail.data };
    }

    return { kind: 'unknown' };
  }

  private async handleMessage(
    parsed: Exclude<ParsedGeofenceEvent, { kind: 'unknown' }>,
    now: Date,
  ): Promise<void> {
    if (parsed.kind === DETAIL_TYPE_POSITION_UPDATED) {
      await this.evaluateGeofences(parsed.detail);
      await this.evaluateBatteryRecovery(parsed.detail);
    } else {
      await this.openBatteryLowAlert(parsed.detail, now);
    }
  }

  /** #30 R7: pliega cada lote ordenado sobre el estado de cada geocerca. */
  private async evaluateGeofences(
    detail: PositionUpdatedDetail,
  ): Promise<void> {
    const activeGeofences = await this.store.listActiveGeofencesForPet(
      detail.petId,
    );
    const positions = [
      ...(detail.positions ?? [detail.position]),
    ].sort((a, b) => a.ts - b.ts);

    for (const geofence of activeGeofences) {
      const previousUpdatedAtMs =
        geofence.state.updatedAt === null
          ? null
          : Date.parse(geofence.state.updatedAt);

      let state = geofence.state;
      let pendingStateWrite = false;
      for (const position of positions) {
        if (
          previousUpdatedAtMs !== null &&
          position.ts <= previousUpdatedAtMs
        ) {
          continue;
        }

        const result = evaluate(
          state,
          {
            shape: 'circle',
            centerLat: geofence.centerLat,
            centerLng: geofence.centerLng,
            radiusM: geofence.radiusM,
          },
          {
            lat: position.lat,
            lng: position.lng,
            accuracyM: position.accuracyM ?? undefined,
            flags: position.flags,
          },
          position.ts,
        );
        state = result.state;

        if (result.event === 'exit') {
          await this.handleExit(detail, geofence, state, position);
          pendingStateWrite = false;
        } else if (result.event === 'enter') {
          await this.handleEnter(detail, geofence, state, position);
          pendingStateWrite = false;
        } else {
          pendingStateWrite = true;
        }
      }

      if (pendingStateWrite) {
        await this.store.updateGeofenceState(geofence.id, state);
      }
    }
  }

  /** R8: INSERT -> notifica solo si tomo efecto -> SIEMPRE persiste el estado despues. */
  private async handleExit(
    detail: PositionUpdatedDetail,
    geofence: ActiveGeofenceForEval,
    newState: ActiveGeofenceForEval['state'],
    position: PositionUpdatedDetail['position'],
  ): Promise<void> {
    const openInput: OpenAlertInput = {
      petId: detail.petId,
      type: ALERT_TYPE_GEOFENCE_EXIT,
      geofenceId: geofence.id,
      payload: { position, geofenceName: geofence.name },
      openedAt: new Date(position.ts),
    };

    const opened = await this.store.openAlert(openInput);

    if (opened !== null) {
      await this.notify({
        kind: 'alert',
        alertId: opened.id,
        petId: detail.petId,
        type: 'geofence_exit',
        geofenceName: geofence.name,
      });
    }

    await this.store.updateGeofenceState(geofence.id, newState);
  }

  /** R9: UPDATE condicional -> persiste el estado -> notifica solo si afecto una fila. */
  private async handleEnter(
    detail: PositionUpdatedDetail,
    geofence: ActiveGeofenceForEval,
    newState: ActiveGeofenceForEval['state'],
    position: PositionUpdatedDetail['position'],
  ): Promise<void> {
    const closeInput: CloseOpenAlertInput = {
      petId: detail.petId,
      type: ALERT_TYPE_GEOFENCE_EXIT,
      geofenceId: geofence.id,
      closedAt: new Date(position.ts),
    };

    const closed = await this.store.closeOpenAlert(closeInput);

    await this.store.updateGeofenceState(geofence.id, newState);

    if (closed !== null) {
      await this.notify({
        kind: 'alert_resolved',
        alertId: closed.id,
        petId: detail.petId,
        type: 'geofence_exit',
        geofenceName: geofence.name,
      });
    }
  }

  /** R11: cierre de battery_low en position.updated, independiente del bucle de geocercas. */
  private async evaluateBatteryRecovery(
    detail: PositionUpdatedDetail,
  ): Promise<void> {
    const batteryPct = detail.batteryPct;
    if (
      typeof batteryPct !== 'number' ||
      batteryPct < BATTERY_RECOVERY_THRESHOLD_PCT
    ) {
      return;
    }

    const closed = await this.store.closeOpenAlert({
      petId: detail.petId,
      type: ALERT_TYPE_BATTERY_LOW,
      geofenceId: null,
      closedAt: new Date(detail.position.ts),
    });

    if (closed !== null) {
      await this.notify({
        kind: 'alert_resolved',
        alertId: closed.id,
        petId: detail.petId,
        type: 'battery_low',
        batteryPct,
      });
    }
  }

  /** R12: apertura de battery_low; opened_at usa el reloj inyectado (sin ts en el detail). */
  private async openBatteryLowAlert(
    detail: BatteryLowDetail,
    now: Date,
  ): Promise<void> {
    const opened = await this.store.openAlert({
      petId: detail.petId,
      type: ALERT_TYPE_BATTERY_LOW,
      geofenceId: null,
      payload: { batteryPct: detail.batteryPct },
      openedAt: now,
    });

    if (opened !== null) {
      await this.notify({
        kind: 'alert',
        alertId: opened.id,
        petId: detail.petId,
        type: 'battery_low',
        batteryPct: detail.batteryPct,
      });
    }
  }

  /** R15: shape congelado (D5) del mensaje `notifications`. */
  private async notify(params: NotifyParams): Promise<void> {
    const pet = await this.pets.findById(params.petId);
    const petName = pet?.name ?? 'tu mascota';
    const { title, body } = buildCopy(params, petName);

    const queueUrl = await this.resolveQueueUrl(QUEUE_NOTIFICATIONS);
    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({
          version: 1,
          kind: params.kind,
          alertId: params.alertId,
          petId: params.petId,
          title,
          body,
          data: { petId: params.petId, alertId: params.alertId },
        }),
      }),
    );
  }

  /** El provisioning (#2/#12) no persiste URLs: se deriva del nombre y se cachea. */
  private async resolveQueueUrl(queueName: string): Promise<string> {
    const cached = this.queueUrls.get(queueName);
    if (cached !== undefined) {
      return cached;
    }

    const response = await this.sqs.send(
      new GetQueueUrlCommand({ QueueName: queueName }),
    );
    if (!response.QueueUrl) {
      throw new Error(`queue ${queueName} has no QueueUrl`);
    }

    this.queueUrls.set(queueName, response.QueueUrl);
    return response.QueueUrl;
  }
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Copy simple (D5: el texto exacto no es parte del contrato verificable). */
function buildCopy(
  params: NotifyParams,
  petName: string,
): { title: string; body: string } {
  if (params.type === 'geofence_exit') {
    const geofenceName = params.geofenceName ?? 'su geocerca';
    return params.kind === 'alert'
      ? {
          title: `${petName} salió de ${geofenceName}`,
          body: `${petName} salió del área segura "${geofenceName}".`,
        }
      : {
          title: `${petName} regresó a ${geofenceName}`,
          body: `${petName} volvió a entrar en "${geofenceName}".`,
        };
  }

  const batteryPct = params.batteryPct ?? 0;
  return params.kind === 'alert'
    ? {
        title: `Batería baja de ${petName}`,
        body: `El collar de ${petName} tiene ${batteryPct}% de batería.`,
      }
    : {
        title: `Batería de ${petName} recuperada`,
        body: `El collar de ${petName} volvió a ${batteryPct}% de batería.`,
      };
}
