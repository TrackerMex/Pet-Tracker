import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import type { RemindersDispatchService } from './reminders-dispatch.service';
import {
  REMINDERS_INTERVAL_MS,
  REMINDERS_INTERVAL_NAME,
} from './reminders.constants';
import { RemindersSchedulerService } from './reminders-scheduler.service';

function configWith(values: Record<string, string>): ConfigService {
  return { get: (key: string) => values[key] } as unknown as ConfigService;
}

describe('R12: scheduler gateado por REMINDERS_ENABLED y NODE_ENV', () => {
  let registry: { addInterval: jest.Mock };
  let dispatchOnce: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    registry = { addInterval: jest.fn() };
    dispatchOnce = jest.fn();
  });

  afterEach(() => jest.useRealTimers());

  function service(values: Record<string, string>): RemindersSchedulerService {
    return new RemindersSchedulerService(
      configWith(values),
      registry as unknown as SchedulerRegistry,
      { dispatchOnce } as unknown as RemindersDispatchService,
    );
  }

  it.each([
    [{ REMINDERS_ENABLED: 'true', NODE_ENV: 'test' }],
    [{ REMINDERS_ENABLED: 'false', NODE_ENV: 'development' }],
    [{ NODE_ENV: 'development' }],
  ])('no agenda con config %o', (config) => {
    expect(service(config).shouldSchedule()).toBe(false);
    service(config).onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('agenda cada minuto con REMINDERS_ENABLED=true fuera de test', () => {
    const scheduler = service({
      REMINDERS_ENABLED: 'true',
      NODE_ENV: 'development',
    });

    expect(scheduler.shouldSchedule()).toBe(true);
    scheduler.onApplicationBootstrap();
    expect(registry.addInterval).toHaveBeenCalledWith(
      REMINDERS_INTERVAL_NAME,
      expect.anything(),
    );
    jest.advanceTimersByTime(REMINDERS_INTERVAL_MS);
    expect(dispatchOnce).toHaveBeenCalledTimes(1);
  });
});
