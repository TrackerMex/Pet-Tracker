import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import type { NotifierConsumerService } from './notifier-consumer.service';
import {
  NOTIFIER_INTERVAL_MS,
  NOTIFIER_INTERVAL_NAME,
} from './notifier.constants';
import { NotifierSchedulerService } from './notifier-scheduler.service';

function configWith(values: Record<string, string>): ConfigService {
  return { get: (key: string) => values[key] } as unknown as ConfigService;
}

describe('R15: scheduler gateado por NOTIFIER_ENABLED (+ NODE_ENV=test), D6', () => {
  let registry: { addInterval: jest.Mock };
  let drainOnce: jest.Mock;
  let consumer: NotifierConsumerService;

  beforeEach(() => {
    jest.useFakeTimers();
    registry = { addInterval: jest.fn() };
    drainOnce = jest.fn();
    consumer = { drainOnce } as unknown as NotifierConsumerService;
  });

  afterEach(() => jest.useRealTimers());

  function service(values: Record<string, string>): NotifierSchedulerService {
    return new NotifierSchedulerService(
      configWith(values),
      registry as unknown as SchedulerRegistry,
      consumer,
    );
  }

  it('con NODE_ENV=test no agenda nada aunque NOTIFIER_ENABLED=true', () => {
    service({
      NOTIFIER_ENABLED: 'true',
      NODE_ENV: 'test',
    }).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('sin NOTIFIER_ENABLED no agenda nada (default en codigo: cerrado)', () => {
    service({ NODE_ENV: 'development' }).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('con NOTIFIER_ENABLED=false no agenda nada', () => {
    service({
      NOTIFIER_ENABLED: 'false',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('D6: no reutiliza ALERTS_ENGINE_ENABLED — es una variable independiente', () => {
    service({
      ALERTS_ENGINE_ENABLED: 'true',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('con NOTIFIER_ENABLED=true y NODE_ENV=development agenda un intervalo', () => {
    service({
      NOTIFIER_ENABLED: 'true',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();

    expect(registry.addInterval).toHaveBeenCalledTimes(1);
    expect(
      registry.addInterval.mock.calls.map((call: unknown[]) => call[0]),
    ).toEqual([NOTIFIER_INTERVAL_NAME]);
  });

  it('el tick invoca drainOnce() cada 1 minuto (constante nombrada, no env)', () => {
    expect(NOTIFIER_INTERVAL_MS).toBe(60_000);

    service({
      NOTIFIER_ENABLED: 'true',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();

    jest.advanceTimersByTime(NOTIFIER_INTERVAL_MS);
    expect(drainOnce).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(NOTIFIER_INTERVAL_MS);
    expect(drainOnce).toHaveBeenCalledTimes(2);
  });
});
