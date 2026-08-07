import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ALERTS_ENGINE_INTERVAL_MS,
  ALERTS_ENGINE_INTERVAL_NAME,
  AlertsEngineSchedulerService,
} from './alerts-engine-scheduler.service';
import type { AlertsEngineConsumerService } from './alerts-engine-consumer.service';

function configWith(values: Record<string, string>): ConfigService {
  return { get: (key: string) => values[key] } as unknown as ConfigService;
}

describe('R17: scheduler gateado por ALERTS_ENGINE_ENABLED (+ NODE_ENV=test)', () => {
  let registry: { addInterval: jest.Mock };
  let drainOnce: jest.Mock;
  let consumer: AlertsEngineConsumerService;

  beforeEach(() => {
    jest.useFakeTimers();
    registry = { addInterval: jest.fn() };
    drainOnce = jest.fn();
    consumer = { drainOnce } as unknown as AlertsEngineConsumerService;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function service(
    values: Record<string, string>,
  ): AlertsEngineSchedulerService {
    return new AlertsEngineSchedulerService(
      configWith(values),
      registry as unknown as SchedulerRegistry,
      consumer,
    );
  }

  it('con NODE_ENV=test no agenda nada aunque ALERTS_ENGINE_ENABLED=true', () => {
    service({
      ALERTS_ENGINE_ENABLED: 'true',
      NODE_ENV: 'test',
    }).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('sin ALERTS_ENGINE_ENABLED no agenda nada', () => {
    service({ NODE_ENV: 'development' }).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('con ALERTS_ENGINE_ENABLED=false no agenda nada', () => {
    service({
      ALERTS_ENGINE_ENABLED: 'false',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('con ALERTS_ENGINE_ENABLED=true y NODE_ENV=development agenda un intervalo en SchedulerRegistry', () => {
    service({
      ALERTS_ENGINE_ENABLED: 'true',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();

    expect(registry.addInterval).toHaveBeenCalledTimes(1);
    const names = registry.addInterval.mock.calls.map(
      (call: unknown[]) => call[0],
    );
    expect(names).toEqual([ALERTS_ENGINE_INTERVAL_NAME]);
  });

  it('el tick invoca AlertsEngineConsumerService.drainOnce() cada 1 minuto (constante, no env)', () => {
    expect(ALERTS_ENGINE_INTERVAL_MS).toBe(60_000);

    service({
      ALERTS_ENGINE_ENABLED: 'true',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();

    jest.advanceTimersByTime(ALERTS_ENGINE_INTERVAL_MS);
    expect(drainOnce).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(ALERTS_ENGINE_INTERVAL_MS);
    expect(drainOnce).toHaveBeenCalledTimes(2);
  });

  it('invocable directamente (drainOnce) sin depender del scheduler — tests/e2e nunca esperan al cron', async () => {
    await consumer.drainOnce();
    expect(drainOnce).toHaveBeenCalledTimes(1);
  });
});
