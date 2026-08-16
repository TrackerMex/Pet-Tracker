import {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import type { Message } from '@aws-sdk/client-sqs';
import { Logger } from '@nestjs/common';
import {
  DETAIL_TYPE_BATTERY_LOW,
  DETAIL_TYPE_POSITION_UPDATED,
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_NOTIFICATIONS,
} from '@/aws/constants';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { AlertsEngineConsumerService } from './alerts-engine-consumer.service';
import type { AlertsEngineStore } from './alerts-engine-store';

const NOW = new Date('2026-08-01T12:00:00.000Z');
const GEOFENCE_ID = 'geofence-1';
const PET_ID = 'pet-1';

// Geocerca circular fija para todos los escenarios de evaluate() (100 m).
const CENTER_LAT = 19.4326;
const CENTER_LNG = -99.1332;
const RADIUS_M = 100;
const EARTH_RADIUS_M = 6_371_000;

// Punto a ~0 m del centro (queda dentro con cualquier radio > 0).
const AT_CENTER = { lat: CENTER_LAT, lng: CENTER_LNG };
// Punto a ~1113 m del centro (0.01 grados de latitud) — fuera de sobra.
const FAR_AWAY = { lat: CENTER_LAT + 0.01, lng: CENTER_LNG };

function pointAtDistance(distanceM: number): { lat: number; lng: number } {
  const dLatDeg = (distanceM / EARTH_RADIUS_M) * (180 / Math.PI);
  return { lat: CENTER_LAT + dLatDeg, lng: CENTER_LNG };
}

type MockOf<T> = { [K in keyof T]: jest.Mock };

interface SqsStub {
  client: SQSClient;
  send: jest.Mock;
  deleted: string[];
  sentToNotifications: () => Array<Record<string, unknown>>;
}

const CONSUME_QUEUE_URL = 'http://localhost:4566/000000000000/geofence-events';
const NOTIFICATIONS_QUEUE_URL =
  'http://localhost:4566/000000000000/notifications';

function sqsStub(batches: Message[][]): SqsStub {
  const deleted: string[] = [];
  const sent: Array<Record<string, unknown>> = [];
  let receiveIndex = 0;

  const send = jest.fn((command: unknown) => {
    if (command instanceof GetQueueUrlCommand) {
      const name = command.input.QueueName;
      if (name === QUEUE_GEOFENCE_EVENTS) {
        return Promise.resolve({ QueueUrl: CONSUME_QUEUE_URL });
      }
      if (name === QUEUE_NOTIFICATIONS) {
        return Promise.resolve({ QueueUrl: NOTIFICATIONS_QUEUE_URL });
      }
      return Promise.reject(
        new Error(`unexpected queue name: ${String(name)}`),
      );
    }
    if (command instanceof ReceiveMessageCommand) {
      const batch = receiveIndex < batches.length ? batches[receiveIndex] : [];
      receiveIndex += 1;
      return Promise.resolve({ Messages: batch });
    }
    if (command instanceof DeleteMessageCommand) {
      deleted.push(command.input.ReceiptHandle as string);
      return Promise.resolve({});
    }
    if (command instanceof SendMessageCommand) {
      sent.push(
        JSON.parse(command.input.MessageBody ?? '{}') as Record<
          string,
          unknown
        >,
      );
      return Promise.resolve({ MessageId: `sent-${sent.length}` });
    }
    return Promise.reject(new Error('unexpected command'));
  });

  return {
    client: { send } as unknown as SQSClient,
    send,
    deleted,
    sentToNotifications: () => sent,
  };
}

function storeStub(): MockOf<AlertsEngineStore> {
  return {
    listActiveGeofencesForPet: jest.fn().mockResolvedValue([]),
    updateGeofenceState: jest.fn().mockResolvedValue(undefined),
    openAlert: jest.fn().mockResolvedValue({ id: 'alert-1' }),
    closeOpenAlert: jest.fn().mockResolvedValue({ id: 'alert-1' }),
  };
}

function petsStub(name = 'Firulais'): MockOf<PetRepository> {
  return {
    createWithOwner: jest.fn(),
    findAllByMember: jest.fn(),
    findMembership: jest.fn(),
    findById: jest.fn().mockResolvedValue({ id: PET_ID, name }),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

function envelope(
  detailType: string,
  detail: unknown,
): Record<string, unknown> {
  return { 'detail-type': detailType, detail };
}

interface PositionDetail {
  lat: number;
  lng: number;
  ts: number;
  speedKmh: number | null;
  course: number | null;
  sats: number | null;
  accuracyM: number | null;
  batteryPct: number | null;
  flags: string[];
}

function basePosition(overrides: Partial<PositionDetail> = {}): PositionDetail {
  return {
    lat: AT_CENTER.lat,
    lng: AT_CENTER.lng,
    ts: NOW.getTime(),
    speedKmh: null,
    course: null,
    sats: null,
    accuracyM: null,
    batteryPct: null,
    flags: [],
    ...overrides,
  };
}

function positionUpdatedDetail(
  overrides: {
    position?: Partial<PositionDetail>;
    batteryPct?: number | null;
  } = {},
): Record<string, unknown> {
  return {
    version: 1,
    petId: PET_ID,
    deviceId: 'device-1',
    position: basePosition(overrides.position),
    batteryPct: overrides.batteryPct ?? null,
  };
}

function positionUpdatedDetailV2(
  positions: PositionDetail[],
  overrides: { batteryPct?: number | null } = {},
): Record<string, unknown> {
  return {
    version: 2,
    petId: PET_ID,
    deviceId: 'device-1',
    position: positions[positions.length - 1],
    positions,
    batteryPct: overrides.batteryPct ?? null,
  };
}

function batteryLowDetail(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    version: 1,
    petId: PET_ID,
    deviceId: 'device-1',
    batteryPct: 15,
    ...overrides,
  };
}

function message(id: string, body: unknown): Message {
  return {
    MessageId: id,
    ReceiptHandle: `rh-${id}`,
    Body: typeof body === 'string' ? body : JSON.stringify(body),
  };
}

interface Harness {
  service: AlertsEngineConsumerService;
  sqs: SqsStub;
  store: MockOf<AlertsEngineStore>;
  pets: MockOf<PetRepository>;
}

function makeHarness(
  batches: Message[][],
  overrides: {
    store?: MockOf<AlertsEngineStore>;
    pets?: MockOf<PetRepository>;
  } = {},
): Harness {
  const sqs = sqsStub(batches);
  const store = overrides.store ?? storeStub();
  const pets = overrides.pets ?? petsStub();
  const service = new AlertsEngineConsumerService(store, sqs.client, pets);
  return { service, sqs, store, pets };
}

function activeGeofence(state: {
  state: 'unknown' | 'inside' | 'outside';
  updatedAt: string | null;
}): {
  id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  radiusM: number;
  state: typeof state;
} {
  return {
    id: GEOFENCE_ID,
    name: 'Casa',
    centerLat: CENTER_LAT,
    centerLng: CENTER_LNG,
    radiusM: RADIUS_M,
    state,
  };
}

describe('R5: recepcion y parseo del sobre EventBridge — batch <=10, long-polling, malformado sin delete', () => {
  it('recibe con MaxNumberOfMessages 10 y WaitTimeSeconds >= 1 y drena hasta que la cola queda vacia', async () => {
    const { service, sqs } = makeHarness([
      [
        message(
          'a',
          envelope(DETAIL_TYPE_POSITION_UPDATED, positionUpdatedDetail()),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    const receives = sqs.send.mock.calls
      .filter(([c]: [unknown]) => c instanceof ReceiveMessageCommand)
      .map(([c]: [ReceiveMessageCommand]) => c.input);
    expect(receives).toHaveLength(2);
    for (const input of receives) {
      expect(input.QueueUrl).toBe(CONSUME_QUEUE_URL);
      expect(input.MaxNumberOfMessages).toBe(10);
      expect(input.WaitTimeSeconds).toBeGreaterThanOrEqual(1);
    }
  });

  it('JSON invalido: sin delete, log de error', async () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const { service, sqs } = makeHarness([
      [message('bad', 'no es json {{{')],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(sqs.deleted).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: 'bad',
        message: expect.stringContaining('malformed') as unknown,
      }),
    );
    errorSpy.mockRestore();
  });

  it('sobre valido pero sin detail-type/detail: sin delete, log de error', async () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const { service, sqs } = makeHarness([
      [message('bad-envelope', { foo: 'bar' })],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(sqs.deleted).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('detail-type reconocido pero detail no cumple su schema: sin delete, log de error', async () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const { service, sqs } = makeHarness([
      [
        message(
          'bad-detail',
          envelope(DETAIL_TYPE_POSITION_UPDATED, { nope: true }),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(sqs.deleted).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('mensaje valido se borra tras procesarse; uno invalido en el mismo lote no envenena a los demas', async () => {
    const { service, sqs } = makeHarness([
      [
        message(
          'ok-1',
          envelope(DETAIL_TYPE_POSITION_UPDATED, positionUpdatedDetail()),
        ),
        message('bad', 'esto no es json'),
        message(
          'ok-2',
          envelope(DETAIL_TYPE_POSITION_UPDATED, positionUpdatedDetail()),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(sqs.deleted).toEqual(['rh-ok-1', 'rh-ok-2']);
  });
});

describe('R6: despacho por detail-type; detail-type no reconocido — log y delete sin reintentar', () => {
  it('position.updated dispatcha a evaluacion de geocercas (listActiveGeofencesForPet)', async () => {
    const { service, store } = makeHarness([
      [
        message(
          'a',
          envelope(DETAIL_TYPE_POSITION_UPDATED, positionUpdatedDetail()),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(store.listActiveGeofencesForPet).toHaveBeenCalledWith(PET_ID);
  });

  it('battery.low dispatcha a apertura de alerta de bateria (openAlert battery_low)', async () => {
    const { service, store } = makeHarness([
      [message('a', envelope(DETAIL_TYPE_BATTERY_LOW, batteryLowDetail()))],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(store.openAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'battery_low', petId: PET_ID }),
    );
  });

  it('detail-type desconocido: log y borra el mensaje sin llamar al store', async () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const { service, sqs, store } = makeHarness([
      [message('unknown-type', envelope('device.offline', { petId: PET_ID }))],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(sqs.deleted).toEqual(['rh-unknown-type']);
    expect(store.listActiveGeofencesForPet).not.toHaveBeenCalled();
    expect(store.openAlert).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('R7: evaluacion por geocerca activa — guard de ts mas reciente que geofence_state.updatedAt', () => {
  it('omite la geocerca por completo si position.ts no es estrictamente mayor que updatedAt persistido', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'inside', updatedAt: NOW.toISOString() }),
    ]);
    const { service } = makeHarness(
      [
        [
          message(
            'a',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetail({
                position: { ts: NOW.getTime() },
              }),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.updateGeofenceState).not.toHaveBeenCalled();
    expect(store.openAlert).not.toHaveBeenCalled();
    expect(store.closeOpenAlert).not.toHaveBeenCalled();
  });

  it('con updatedAt null (nunca evaluada) no omite: evalua igual', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'unknown', updatedAt: null }),
    ]);
    const { service } = makeHarness(
      [
        [
          message(
            'a',
            envelope(DETAIL_TYPE_POSITION_UPDATED, positionUpdatedDetail()),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.updateGeofenceState).toHaveBeenCalledTimes(1);
  });

  it('con ts estrictamente mayor evalua (no omite)', async () => {
    const store = storeStub();
    const earlier = new Date(NOW.getTime() - 60_000).toISOString();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'inside', updatedAt: earlier }),
    ]);
    const { service } = makeHarness(
      [
        [
          message(
            'a',
            envelope(DETAIL_TYPE_POSITION_UPDATED, positionUpdatedDetail()),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.updateGeofenceState).toHaveBeenCalledTimes(1);
  });
});

describe('R10: event null (unknown inicial y low_accuracy) — solo persiste estado, sin alert_events ni notificacion', () => {
  it('primera evaluacion desde unknown: persiste el estado calculado, sin abrir/cerrar ni notificar', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'unknown', updatedAt: null }),
    ]);
    const { service, sqs } = makeHarness(
      [
        [
          message(
            'a',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetail({
                position: { ...AT_CENTER },
              }),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.updateGeofenceState).toHaveBeenCalledWith(GEOFENCE_ID, {
      state: 'inside',
      updatedAt: new Date(NOW.getTime()).toISOString(),
    });
    expect(store.openAlert).not.toHaveBeenCalled();
    expect(store.closeOpenAlert).not.toHaveBeenCalled();
    expect(sqs.sentToNotifications()).toHaveLength(0);
  });

  it('sigue dentro (inside->inside): persiste el mismo estado sin alertar', async () => {
    const store = storeStub();
    const earlier = new Date(NOW.getTime() - 60_000).toISOString();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'inside', updatedAt: earlier }),
    ]);
    const { service, sqs } = makeHarness(
      [
        [
          message(
            'a',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetail({
                position: { ...AT_CENTER },
              }),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.updateGeofenceState).toHaveBeenCalledWith(GEOFENCE_ID, {
      state: 'inside',
      updatedAt: new Date(NOW.getTime()).toISOString(),
    });
    expect(store.openAlert).not.toHaveBeenCalled();
    expect(sqs.sentToNotifications()).toHaveLength(0);
  });
});

describe('R8: exit — INSERT anti-spam; notifica solo si tomo efecto; SIEMPRE persiste el nuevo estado despues', () => {
  function farAwayMessage(): Message {
    return message(
      'a',
      envelope(
        DETAIL_TYPE_POSITION_UPDATED,
        positionUpdatedDetail({
          position: { ...FAR_AWAY },
        }),
      ),
    );
  }

  it('INSERT exitoso: notifica kind alert y luego persiste geofence_state outside', async () => {
    const store = storeStub();
    const earlier = new Date(NOW.getTime() - 60_000).toISOString();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'inside', updatedAt: earlier }),
    ]);
    const { service, sqs } = makeHarness([[farAwayMessage()], []], { store });

    await service.drainOnce(NOW);

    expect(store.openAlert).toHaveBeenCalledWith({
      petId: PET_ID,
      type: 'geofence_exit',
      geofenceId: GEOFENCE_ID,
      payload: expect.objectContaining({ geofenceName: 'Casa' }) as unknown,
      openedAt: new Date(NOW.getTime()),
    });
    expect(sqs.sentToNotifications()).toHaveLength(1);
    expect(sqs.sentToNotifications()[0]).toMatchObject({
      kind: 'alert',
      alertId: 'alert-1',
    });

    const openOrder = store.openAlert.mock.invocationCallOrder[0];
    const stateOrder = store.updateGeofenceState.mock.invocationCallOrder[0];
    expect(openOrder).toBeLessThan(stateOrder);
    expect(store.updateGeofenceState).toHaveBeenCalledWith(GEOFENCE_ID, {
      state: 'outside',
      updatedAt: new Date(NOW.getTime()).toISOString(),
    });
  });

  it('INSERT rechazado por anti-spam (openAlert -> null): no notifica, pero igual persiste geofence_state', async () => {
    const store = storeStub();
    store.openAlert.mockResolvedValue(null);
    const earlier = new Date(NOW.getTime() - 60_000).toISOString();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'inside', updatedAt: earlier }),
    ]);
    const { service, sqs } = makeHarness([[farAwayMessage()], []], { store });

    await service.drainOnce(NOW);

    expect(sqs.sentToNotifications()).toHaveLength(0);
    expect(store.updateGeofenceState).toHaveBeenCalledWith(GEOFENCE_ID, {
      state: 'outside',
      updatedAt: new Date(NOW.getTime()).toISOString(),
    });
  });
});

describe('R9: enter — UPDATE condicional a closed; notifica solo si afecto una fila; persiste el nuevo estado', () => {
  function atCenterMessage(): Message {
    return message(
      'a',
      envelope(
        DETAIL_TYPE_POSITION_UPDATED,
        positionUpdatedDetail({
          position: { ...AT_CENTER },
        }),
      ),
    );
  }

  it('UPDATE afecta una fila: notifica alert_resolved tras persistir el nuevo estado inside', async () => {
    const store = storeStub();
    const earlier = new Date(NOW.getTime() - 60_000).toISOString();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'outside', updatedAt: earlier }),
    ]);
    const { service, sqs } = makeHarness([[atCenterMessage()], []], { store });

    await service.drainOnce(NOW);

    expect(store.closeOpenAlert).toHaveBeenCalledWith({
      petId: PET_ID,
      type: 'geofence_exit',
      geofenceId: GEOFENCE_ID,
      closedAt: new Date(NOW.getTime()),
    });
    expect(store.updateGeofenceState).toHaveBeenCalledWith(GEOFENCE_ID, {
      state: 'inside',
      updatedAt: new Date(NOW.getTime()).toISOString(),
    });
    expect(sqs.sentToNotifications()).toHaveLength(1);
    expect(sqs.sentToNotifications()[0]).toMatchObject({
      kind: 'alert_resolved',
      alertId: 'alert-1',
    });
  });

  it('UPDATE afecta 0 filas (closeOpenAlert -> null): no notifica, pero igual persiste geofence_state', async () => {
    const store = storeStub();
    store.closeOpenAlert.mockResolvedValue(null);
    const earlier = new Date(NOW.getTime() - 60_000).toISOString();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'outside', updatedAt: earlier }),
    ]);
    const { service, sqs } = makeHarness([[atCenterMessage()], []], { store });

    await service.drainOnce(NOW);

    expect(sqs.sentToNotifications()).toHaveLength(0);
    expect(store.updateGeofenceState).toHaveBeenCalledWith(GEOFENCE_ID, {
      state: 'inside',
      updatedAt: new Date(NOW.getTime()).toISOString(),
    });
  });
});

describe('R11: cierre de battery_low con bateria >=30 en position.updated, independiente del bucle de geocercas', () => {
  it('batteryPct >= 30 cierra la alerta abierta de bateria y notifica alert_resolved', async () => {
    const { service, sqs, store } = makeHarness([
      [
        message(
          'a',
          envelope(
            DETAIL_TYPE_POSITION_UPDATED,
            positionUpdatedDetail({ batteryPct: 35 }),
          ),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(store.closeOpenAlert).toHaveBeenCalledWith({
      petId: PET_ID,
      type: 'battery_low',
      geofenceId: null,
      closedAt: new Date(NOW.getTime()),
    });
    const batteryResolved = sqs
      .sentToNotifications()
      .filter(
        (m) =>
          m.kind === 'alert_resolved' &&
          (m.data as { alertId: string }).alertId === 'alert-1',
      );
    expect(batteryResolved.length).toBeGreaterThanOrEqual(1);
  });

  it('sin geocercas activas igual cierra la alerta de bateria (independiente del bucle R7-R10)', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([]);
    const { service } = makeHarness(
      [
        [
          message(
            'a',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetail({ batteryPct: 40 }),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.closeOpenAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'battery_low' }),
    );
  });

  it('batteryPct < 30 no cierra ni notifica nada por bateria', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([]);
    const { service } = makeHarness(
      [
        [
          message(
            'a',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetail({ batteryPct: 25 }),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.closeOpenAlert).not.toHaveBeenCalled();
  });

  it('batteryPct ausente (null) no cierra ni notifica nada por bateria', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([]);
    const { service } = makeHarness(
      [
        [
          message(
            'a',
            envelope(DETAIL_TYPE_POSITION_UPDATED, positionUpdatedDetail()),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.closeOpenAlert).not.toHaveBeenCalled();
  });
});

describe('R12: apertura de battery_low desde mensaje battery.low', () => {
  it('INSERT exitoso: payload {batteryPct}, opened_at = reloj inyectado (now), notifica kind alert', async () => {
    const { service, sqs, store } = makeHarness([
      [
        message(
          'a',
          envelope(
            DETAIL_TYPE_BATTERY_LOW,
            batteryLowDetail({ batteryPct: 12 }),
          ),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    expect(store.openAlert).toHaveBeenCalledWith({
      petId: PET_ID,
      type: 'battery_low',
      geofenceId: null,
      payload: { batteryPct: 12 },
      openedAt: NOW,
    });
    expect(sqs.sentToNotifications()).toHaveLength(1);
    expect(sqs.sentToNotifications()[0]).toMatchObject({
      kind: 'alert',
      alertId: 'alert-1',
    });
  });

  it('INSERT rechazado por anti-spam (openAlert -> null): no notifica nada', async () => {
    const store = storeStub();
    store.openAlert.mockResolvedValue(null);
    const { service, sqs } = makeHarness(
      [
        [message('a', envelope(DETAIL_TYPE_BATTERY_LOW, batteryLowDetail()))],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(sqs.sentToNotifications()).toHaveLength(0);
  });
});

describe('R13: exit/exit/enter para la misma mascota+geocerca -> exactamente 1 open, 1 resolved', () => {
  it('el segundo exit (mismo estado previo, aun rechazado por el indice) no duplica ni notifica; el enter cierra una vez', async () => {
    const store = storeStub();
    const earlier = new Date(NOW.getTime() - 60_000).toISOString();
    // listActiveGeofencesForPet siempre devuelve 'inside' hasta el enter:
    // simula la ventana de caida de D3 (geofence_state no avanzo entre el
    // primer y el segundo exit) — updateGeofenceState no altera este stub.
    store.listActiveGeofencesForPet
      .mockResolvedValueOnce([
        activeGeofence({ state: 'inside', updatedAt: earlier }),
      ])
      .mockResolvedValueOnce([
        activeGeofence({ state: 'inside', updatedAt: earlier }),
      ])
      .mockResolvedValueOnce([
        activeGeofence({ state: 'outside', updatedAt: NOW.toISOString() }),
      ]);
    store.openAlert
      .mockResolvedValueOnce({ id: 'alert-1' })
      .mockResolvedValueOnce(null);

    const { service, sqs } = makeHarness(
      [
        [
          message(
            'exit-1',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetail({
                position: { ...FAR_AWAY, ts: NOW.getTime() },
              }),
            ),
          ),
        ],
        [
          message(
            'exit-2',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetail({
                position: {
                  ...FAR_AWAY,
                  ts: NOW.getTime() + 1000,
                },
              }),
            ),
          ),
        ],
        [
          message(
            'enter-1',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetail({
                position: {
                  ...AT_CENTER,
                  ts: NOW.getTime() + 2000,
                },
              }),
            ),
          ),
        ],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.openAlert).toHaveBeenCalledTimes(2);
    expect(store.closeOpenAlert).toHaveBeenCalledTimes(1);

    const alerts = sqs.sentToNotifications().filter((m) => m.kind === 'alert');
    const resolved = sqs
      .sentToNotifications()
      .filter((m) => m.kind === 'alert_resolved');
    expect(alerts).toHaveLength(1);
    expect(resolved).toHaveLength(1);
  });
});

describe('R14: idempotencia ante redelivery del mismo mensaje procesado con exito', () => {
  it('redelivery normal (geofence_state ya avanzo): el guard de R7 omite, sin segunda escritura ni notificacion', async () => {
    // Stub con estado mutable: updateGeofenceState escribe, listActiveGeofencesForPet lee.
    let currentState: {
      state: 'unknown' | 'inside' | 'outside';
      updatedAt: string | null;
    } = {
      state: 'inside',
      updatedAt: new Date(NOW.getTime() - 60_000).toISOString(),
    };
    const store: MockOf<AlertsEngineStore> = {
      listActiveGeofencesForPet: jest.fn(() =>
        Promise.resolve([activeGeofence(currentState)]),
      ),
      updateGeofenceState: jest.fn((_id: string, state) => {
        currentState = state as typeof currentState;
        return Promise.resolve();
      }),
      openAlert: jest.fn().mockResolvedValue({ id: 'alert-1' }),
      closeOpenAlert: jest.fn().mockResolvedValue({ id: 'alert-1' }),
    };

    const body = envelope(
      DETAIL_TYPE_POSITION_UPDATED,
      positionUpdatedDetail({
        position: { ...FAR_AWAY, ts: NOW.getTime() },
      }),
    );
    const { service, sqs } = makeHarness(
      [[message('dup', body)], [message('dup', body)], []],
      {
        store,
      },
    );

    await service.drainOnce(NOW);

    expect(store.openAlert).toHaveBeenCalledTimes(1);
    expect(
      sqs.sentToNotifications().filter((m) => m.kind === 'alert'),
    ).toHaveLength(1);
  });
});

describe('R15: shape congelado del mensaje notifications', () => {
  it('geofence_exit: version 1, kind, alertId, petId, title/body con nombre de mascota y geocerca, data', async () => {
    const store = storeStub();
    const earlier = new Date(NOW.getTime() - 60_000).toISOString();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'inside', updatedAt: earlier }),
    ]);
    const { service, sqs } = makeHarness(
      [
        [
          message(
            'a',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetail({
                position: { ...FAR_AWAY },
              }),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    const [sent] = sqs.sentToNotifications();
    expect(sent).toEqual({
      version: 1,
      kind: 'alert',
      alertId: 'alert-1',
      petId: PET_ID,
      title: expect.stringContaining('Firulais') as unknown,
      body: expect.stringContaining('Casa') as unknown,
      data: { petId: PET_ID, alertId: 'alert-1' },
    });
  });

  it('battery_low: title/body incluyen el nombre de la mascota y el batteryPct relevante', async () => {
    const { service, sqs } = makeHarness([
      [
        message(
          'a',
          envelope(
            DETAIL_TYPE_BATTERY_LOW,
            batteryLowDetail({ batteryPct: 17 }),
          ),
        ),
      ],
      [],
    ]);

    await service.drainOnce(NOW);

    const [sent] = sqs.sentToNotifications();
    expect(sent.title).toEqual(expect.stringContaining('Firulais'));
    expect(String(sent.body)).toContain('17');
  });

  it('el mensaje se envia a la cola notifications (no a geofence-events)', async () => {
    const store = storeStub();
    const { service, sqs } = makeHarness(
      [
        [message('a', envelope(DETAIL_TYPE_BATTERY_LOW, batteryLowDetail()))],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    const sendCalls = sqs.send.mock.calls.filter(
      ([c]: [unknown]) => c instanceof SendMessageCommand,
    ) as [SendMessageCommand][];
    expect(sendCalls).toHaveLength(1);
    expect(sendCalls[0][0].input.QueueUrl).toBe(NOTIFICATIONS_QUEUE_URL);
  });
});

describe('R16: error no controlado — mensaje sin borrar, log, no interrumpe el resto del lote', () => {
  it('un fallo del store en un mensaje no borra ese mensaje pero los demas del lote se procesan y borran', async () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const store = storeStub();
    store.listActiveGeofencesForPet
      .mockRejectedValueOnce(new Error('postgres unreachable'))
      .mockResolvedValue([]);

    const { service, sqs } = makeHarness(
      [
        [
          message(
            'boom',
            envelope(DETAIL_TYPE_POSITION_UPDATED, positionUpdatedDetail()),
          ),
          message(
            'ok',
            envelope(DETAIL_TYPE_POSITION_UPDATED, positionUpdatedDetail()),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(sqs.deleted).toEqual(['rh-ok']);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: 'boom',
        message: expect.stringContaining('postgres unreachable') as unknown,
      }),
    );
    errorSpy.mockRestore();
  });
});

describe('R7 (geofence-eval-full-batch #30): evalúa el lote entero en orden ascendente de ts', () => {
  const ts1 = NOW.getTime();
  const ts2 = ts1 + 1_000;
  const ts3 = ts2 + 1_000;
  const previousUpdatedAt = new Date(ts1 - 60_000).toISOString();

  function batchHarness(positions: PositionDetail[]): Harness {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'inside', updatedAt: previousUpdatedAt }),
    ]);
    return makeHarness(
      [
        [
          message(
            'batch',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetailV2(positions),
            ),
          ),
        ],
        [],
      ],
      { store },
    );
  }

  it('(a) abre exit en la posición intermedia y termina outside a 95 m', async () => {
    const nearOutside = pointAtDistance(95);
    const { service, store } = batchHarness([
      basePosition({ ...FAR_AWAY, ts: ts2 }),
      basePosition({ ...AT_CENTER, ts: ts1 }),
      basePosition({ ...nearOutside, ts: ts3 }),
    ]);

    await service.drainOnce(NOW);

    expect(store.openAlert).toHaveBeenCalledTimes(1);
    expect(store.openAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'geofence_exit' }),
    );
    expect(store.closeOpenAlert).not.toHaveBeenCalled();
    const finalUpdate = (
      store.updateGeofenceState.mock.calls as Array<[string, unknown]>
    ).at(-1);
    expect(finalUpdate?.[1]).toEqual({
      state: 'outside',
      updatedAt: new Date(ts3).toISOString(),
    });
  });

  it('(b) detecta exit y enter dentro del mismo lote y envía ambas notificaciones', async () => {
    const { service, store, sqs } = batchHarness([
      basePosition({ ...FAR_AWAY, ts: ts2 }),
      basePosition({ ...AT_CENTER, ts: ts1 }),
      basePosition({ ...AT_CENTER, ts: ts3 }),
    ]);

    await service.drainOnce(NOW);

    expect(store.openAlert).toHaveBeenCalledTimes(1);
    expect(store.closeOpenAlert).toHaveBeenCalledTimes(1);
    expect(sqs.sentToNotifications().map(({ kind }) => kind)).toEqual([
      'alert',
      'alert_resolved',
    ]);
    const finalUpdate = (
      store.updateGeofenceState.mock.calls as Array<[string, unknown]>
    ).at(-1);
    expect(finalUpdate?.[1]).toEqual({
      state: 'inside',
      updatedAt: new Date(ts3).toISOString(),
    });
  });

  it('(c) suspect_jump intermedio no altera el estado ni abre alerta', async () => {
    const { service, store } = batchHarness([
      basePosition({ ...FAR_AWAY, ts: ts2, flags: ['suspect_jump'] }),
      basePosition({ ...AT_CENTER, ts: ts1 }),
      basePosition({ ...AT_CENTER, ts: ts3 }),
    ]);

    await service.drainOnce(NOW);

    expect(store.openAlert).not.toHaveBeenCalled();
    const finalUpdate = (
      store.updateGeofenceState.mock.calls as Array<[string, unknown]>
    ).at(-1);
    expect(finalUpdate?.[1]).toEqual({
      state: 'inside',
      updatedAt: new Date(ts3).toISOString(),
    });
  });
});

describe('R10 (geofence-eval-full-batch #30): un detail v1 sin positions[] se sigue procesando', () => {
  it('abre la alerta y borra el mensaje legado', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({
        state: 'inside',
        updatedAt: new Date(NOW.getTime() - 60_000).toISOString(),
      }),
    ]);
    const { service, sqs } = makeHarness(
      [
        [
          message(
            'legacy-v1',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetail({ position: { ...FAR_AWAY } }),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.openAlert).toHaveBeenCalledTimes(1);
    expect(sqs.deleted).toContain('rh-legacy-v1');
  });
});

describe('R8 (geofence-eval-full-batch #30): la alerta lleva el ts de la posición que cruzó', () => {
  const ts1 = NOW.getTime() + 10_000;
  const ts2 = ts1 + 1_000;
  const ts3 = ts2 + 1_000;
  const previousUpdatedAt = new Date(NOW.getTime() - 60_000).toISOString();

  it('abre el exit con el ts y payload de la posición intermedia', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'inside', updatedAt: previousUpdatedAt }),
    ]);
    const { service } = makeHarness(
      [
        [
          message(
            'exit-ts',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetailV2([
                basePosition({ ...AT_CENTER, ts: ts1 }),
                basePosition({ ...FAR_AWAY, ts: ts2 }),
                basePosition({ ...pointAtDistance(95), ts: ts3 }),
              ]),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    const [openInput] = (
      store.openAlert.mock.calls as Array<
        [
          {
            openedAt: Date;
            payload: { position: PositionDetail };
          },
        ]
      >
    )[0];
    expect(openInput.openedAt.getTime()).toBe(ts2);
    expect(openInput.payload.position.ts).toBe(ts2);
    expect(ts2).not.toBe(ts3);
    expect(ts2).not.toBe(NOW.getTime());
  });

  it('cierra el enter con el ts de la posición que reentró', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({ state: 'outside', updatedAt: previousUpdatedAt }),
    ]);
    const { service } = makeHarness(
      [
        [
          message(
            'enter-ts',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetailV2([
                basePosition({ ...FAR_AWAY, ts: ts1 }),
                basePosition({ ...AT_CENTER, ts: ts2 }),
                basePosition({ ...pointAtDistance(95), ts: ts3 }),
              ]),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    const [closeInput] = (
      store.closeOpenAlert.mock.calls as Array<[{ closedAt: Date }]>
    )[0];
    expect(closeInput.closedAt.getTime()).toBe(ts2);
  });
});

describe('R9 (geofence-eval-full-batch #30): el guard monotónico sobrevive al lote', () => {
  const ts1 = NOW.getTime();
  const ts2 = ts1 + 1_000;
  const ts3 = ts2 + 1_000;

  it('(a) una redelivery completa no escribe, notifica ni queda sin borrar', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({
        state: 'inside',
        updatedAt: new Date(ts3).toISOString(),
      }),
    ]);
    const { service, sqs } = makeHarness(
      [
        [
          message(
            'redelivery-batch',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetailV2([
                basePosition({ ...AT_CENTER, ts: ts1 }),
                basePosition({ ...FAR_AWAY, ts: ts2 }),
                basePosition({ ...AT_CENTER, ts: ts3 }),
              ]),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.openAlert).not.toHaveBeenCalled();
    expect(store.closeOpenAlert).not.toHaveBeenCalled();
    expect(store.updateGeofenceState).not.toHaveBeenCalled();
    expect(sqs.sentToNotifications()).toHaveLength(0);
    expect(sqs.deleted).toContain('rh-redelivery-batch');
  });

  it('(b) un lote mixto evalúa solo posiciones posteriores a updatedAt', async () => {
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({
        state: 'inside',
        updatedAt: new Date(ts2).toISOString(),
      }),
    ]);
    const { service } = makeHarness(
      [
        [
          message(
            'mixed-batch',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetailV2([
                basePosition({ ...FAR_AWAY, ts: ts1 }),
                basePosition({ ...AT_CENTER, ts: ts3 }),
              ]),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.openAlert).not.toHaveBeenCalled();
    expect(store.closeOpenAlert).not.toHaveBeenCalled();
    expect(store.updateGeofenceState).toHaveBeenCalledTimes(1);
    expect(store.updateGeofenceState).toHaveBeenCalledWith(GEOFENCE_ID, {
      state: 'inside',
      updatedAt: new Date(ts3).toISOString(),
    });
  });
});

describe('R11 (geofence-eval-full-batch #30): un solo updateGeofenceState por geocerca y mensaje', () => {
  it('pliega 100 posiciones dentro y persiste solo el estado final', async () => {
    const firstTs = NOW.getTime();
    const positions = Array.from({ length: 100 }, (_, index) =>
      basePosition({ ...AT_CENTER, ts: firstTs + index * 30_000 }),
    );
    const lastTs = positions[positions.length - 1].ts;
    const store = storeStub();
    store.listActiveGeofencesForPet.mockResolvedValue([
      activeGeofence({
        state: 'inside',
        updatedAt: new Date(firstTs - 60_000).toISOString(),
      }),
    ]);
    const { service } = makeHarness(
      [
        [
          message(
            'batch-100-state',
            envelope(
              DETAIL_TYPE_POSITION_UPDATED,
              positionUpdatedDetailV2(positions),
            ),
          ),
        ],
        [],
      ],
      { store },
    );

    await service.drainOnce(NOW);

    expect(store.updateGeofenceState).toHaveBeenCalledTimes(1);
    expect(store.updateGeofenceState).toHaveBeenCalledWith(GEOFENCE_ID, {
      state: 'inside',
      updatedAt: new Date(lastTs).toISOString(),
    });
  });
});
