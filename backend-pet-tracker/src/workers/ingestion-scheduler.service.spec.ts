import { ConfigService } from '@nestjs/config';
import { InFlightTicks } from '@/lifecycle/in-flight-ticks';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  CONSUMER_INTERVAL_MS,
  CONSUMER_INTERVAL_NAME,
  IngestionSchedulerService,
  POLLER_INTERVAL_MS,
  POLLER_INTERVAL_NAME,
} from './ingestion-scheduler.service';
import type { PollerService } from './poller.service';
import type { PositionsConsumerService } from './positions-consumer.service';

function configWith(values: Record<string, string>): ConfigService {
  return { get: (key: string) => values[key] } as unknown as ConfigService;
}

describe('R8: scheduling gated — cron solo con POLLER_ENABLED=true y NODE_ENV distinto de test; runOnce() invocable', () => {
  let registry: { addInterval: jest.Mock };
  let runOnce: jest.Mock;
  let drainOnce: jest.Mock;
  let poller: PollerService;
  let consumer: PositionsConsumerService;

  beforeEach(() => {
    jest.useFakeTimers();
    registry = { addInterval: jest.fn() };
    runOnce = jest.fn();
    drainOnce = jest.fn();
    poller = { runOnce } as unknown as PollerService;
    consumer = { drainOnce } as unknown as PositionsConsumerService;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function service(values: Record<string, string>): IngestionSchedulerService {
    return new IngestionSchedulerService(
      configWith(values),
      registry as unknown as SchedulerRegistry,
      poller,
      consumer,
      new InFlightTicks(),
    );
  }

  it('con NODE_ENV=test no agenda nada aunque POLLER_ENABLED=true (los e2e de #5/#7 no arrancan workers)', () => {
    service({
      POLLER_ENABLED: 'true',
      NODE_ENV: 'test',
    }).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('sin POLLER_ENABLED no agenda nada', () => {
    service({ NODE_ENV: 'development' }).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('con POLLER_ENABLED=false no agenda nada', () => {
    service({
      POLLER_ENABLED: 'false',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('con POLLER_ENABLED=true y NODE_ENV=development agenda poller y consumer en SchedulerRegistry', () => {
    service({
      POLLER_ENABLED: 'true',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();

    const names = registry.addInterval.mock.calls.map(
      (call: unknown[]) => call[0],
    );
    expect(names).toEqual([POLLER_INTERVAL_NAME, CONSUMER_INTERVAL_NAME]);
  });

  it('el tick del poller invoca PollerService.runOnce() cada 1 minuto (constante, no env)', () => {
    expect(POLLER_INTERVAL_MS).toBe(60_000);

    service({
      POLLER_ENABLED: 'true',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();

    jest.advanceTimersByTime(POLLER_INTERVAL_MS);
    expect(runOnce).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(POLLER_INTERVAL_MS);
    expect(runOnce).toHaveBeenCalledTimes(2);
    expect(drainOnce).toHaveBeenCalled();
  });
});

function deferred245() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe('#245 R7: ingestion-poller corre su tick vía InFlightTicks', () => {
  let ticks: InFlightTicks;
  let task: ReturnType<typeof deferred245>;
  let tick: jest.Mock<Promise<void>, []>;
  let scheduler: IngestionSchedulerService;
  beforeEach(() => {
    jest.useFakeTimers();
    ticks = new InFlightTicks();
    task = deferred245();
    tick = jest.fn<Promise<void>, []>().mockReturnValue(task.promise);
    scheduler = new IngestionSchedulerService(
      configWith({ POLLER_ENABLED: 'true', NODE_ENV: 'development' }),
      { addInterval: jest.fn() } as unknown as SchedulerRegistry,
      { runOnce: tick } as unknown as PollerService,
      {
        drainOnce: jest.fn().mockResolvedValue(undefined),
      } as unknown as PositionsConsumerService,
      ticks,
    );
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  it('#245 R7: ingestion-poller: drain no se resuelve mientras el tick está pendiente', async () => {
    scheduler.onApplicationBootstrap();
    jest.advanceTimersByTime(POLLER_INTERVAL_MS);
    expect(tick).toHaveBeenCalledTimes(1);
    let settled = false;
    const drain = ticks.drain(1000).then((value) => {
      settled = true;
      return value;
    });
    await jest.advanceTimersByTimeAsync(0);
    expect(settled).toBe(false);
    task.resolve();
    await expect(drain).resolves.toBe('drained');
  });
  it('#245 R7: ingestion-poller: tras beforeApplicationShutdown el intervalo no invoca poller.runOnce', () => {
    scheduler.onApplicationBootstrap();
    void ticks.beforeApplicationShutdown();
    jest.advanceTimersByTime(POLLER_INTERVAL_MS);
    expect(tick).not.toHaveBeenCalled();
  });
});

describe('#245 R7: ingestion-consumer corre su tick vía InFlightTicks', () => {
  let ticks: InFlightTicks;
  let task: ReturnType<typeof deferred245>;
  let tick: jest.Mock<Promise<void>, []>;
  let scheduler: IngestionSchedulerService;
  beforeEach(() => {
    jest.useFakeTimers();
    ticks = new InFlightTicks();
    task = deferred245();
    tick = jest.fn<Promise<void>, []>().mockReturnValue(task.promise);
    scheduler = new IngestionSchedulerService(
      configWith({ POLLER_ENABLED: 'true', NODE_ENV: 'development' }),
      { addInterval: jest.fn() } as unknown as SchedulerRegistry,
      {
        runOnce: jest.fn().mockResolvedValue(undefined),
      } as unknown as PollerService,
      { drainOnce: tick } as unknown as PositionsConsumerService,
      ticks,
    );
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  it('#245 R7: ingestion-consumer: drain no se resuelve mientras el tick está pendiente', async () => {
    scheduler.onApplicationBootstrap();
    jest.advanceTimersByTime(CONSUMER_INTERVAL_MS);
    expect(tick).toHaveBeenCalledTimes(1);
    let settled = false;
    const drain = ticks.drain(1000).then((value) => {
      settled = true;
      return value;
    });
    await jest.advanceTimersByTimeAsync(0);
    expect(settled).toBe(false);
    task.resolve();
    await expect(drain).resolves.toBe('drained');
  });
  it('#245 R7: ingestion-consumer: tras beforeApplicationShutdown el intervalo no invoca consumer.drainOnce', () => {
    scheduler.onApplicationBootstrap();
    void ticks.beforeApplicationShutdown();
    jest.advanceTimersByTime(CONSUMER_INTERVAL_MS);
    expect(tick).not.toHaveBeenCalled();
  });
});
