import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
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
  let poller: PollerService;
  let consumer: PositionsConsumerService;

  beforeEach(() => {
    jest.useFakeTimers();
    registry = { addInterval: jest.fn() };
    poller = { runOnce: jest.fn() } as unknown as PollerService;
    consumer = {
      drainOnce: jest.fn(),
    } as unknown as PositionsConsumerService;
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
    );
  }

  it('con NODE_ENV=test no agenda nada aunque POLLER_ENABLED=true (los e2e de #5/#7 no arrancan workers)', () => {
    service({ POLLER_ENABLED: 'true', NODE_ENV: 'test' }).onApplicationBootstrap();
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
    expect(poller.runOnce).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(POLLER_INTERVAL_MS);
    expect(poller.runOnce).toHaveBeenCalledTimes(2);
  });
});
