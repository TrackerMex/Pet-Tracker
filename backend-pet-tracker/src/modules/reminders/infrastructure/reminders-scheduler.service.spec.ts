import { ConfigService } from '@nestjs/config';
import { InFlightTicks } from '@/lifecycle/in-flight-ticks';
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
      new InFlightTicks(),
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

function deferred245() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe('#245 R7: reminders-dispatch corre su tick vía InFlightTicks', () => {
  let ticks: InFlightTicks;
  let task: ReturnType<typeof deferred245>;
  let tick: jest.Mock<Promise<void>, []>;
  let scheduler: RemindersSchedulerService;
  beforeEach(() => {
    jest.useFakeTimers();
    ticks = new InFlightTicks();
    task = deferred245();
    tick = jest.fn<Promise<void>, []>().mockReturnValue(task.promise);
    scheduler = new RemindersSchedulerService(
      configWith({ REMINDERS_ENABLED: 'true', NODE_ENV: 'development' }),
      { addInterval: jest.fn() } as unknown as SchedulerRegistry,
      { dispatchOnce: tick } as unknown as RemindersDispatchService,
      ticks,
    );
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  it('#245 R7: reminders-dispatch: drain no se resuelve mientras el tick está pendiente', async () => {
    scheduler.onApplicationBootstrap();
    jest.advanceTimersByTime(REMINDERS_INTERVAL_MS);
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
  it('#245 R7: reminders-dispatch: tras beforeApplicationShutdown el intervalo no invoca dispatcher.dispatchOnce', () => {
    scheduler.onApplicationBootstrap();
    void ticks.beforeApplicationShutdown();
    jest.advanceTimersByTime(REMINDERS_INTERVAL_MS);
    expect(tick).not.toHaveBeenCalled();
  });
});
