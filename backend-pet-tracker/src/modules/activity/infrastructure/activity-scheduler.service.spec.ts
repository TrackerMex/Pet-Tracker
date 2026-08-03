import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ACTIVITY_TICK_INTERVAL_MS,
  ACTIVITY_TICK_NAME,
} from '@/modules/activity/activity.constants';
import type { AggregateDailyActivityUseCase } from '@/modules/activity/application/use-cases/aggregate-daily-activity.use-case';
import { ActivitySchedulerService } from './activity-scheduler.service';

const REPO_ROOT = join(__dirname, '..', '..', '..', '..', '..');

function configWith(values: Record<string, string>): ConfigService {
  return { get: (key: string) => values[key] } as unknown as ConfigService;
}

describe('R15: el tick del agregador solo se agenda con la env activa y fuera de test', () => {
  let registry: { addInterval: jest.Mock };
  let runOnce: jest.Mock;
  let aggregator: AggregateDailyActivityUseCase;

  beforeEach(() => {
    jest.useFakeTimers();
    registry = { addInterval: jest.fn() };
    runOnce = jest.fn().mockResolvedValue({
      processed: 0,
      skipped: 0,
      failed: 0,
    });
    aggregator = {
      runOnce,
    } as unknown as AggregateDailyActivityUseCase;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function service(values: Record<string, string>): ActivitySchedulerService {
    return new ActivitySchedulerService(
      configWith(values),
      registry as unknown as SchedulerRegistry,
      aggregator,
    );
  }

  it('solo la combinacion (true, NODE_ENV != test) devuelve true en shouldSchedule', () => {
    const combinations: Array<[string, string, boolean]> = [
      ['true', 'development', true],
      ['true', 'test', false],
      ['false', 'development', false],
      ['false', 'test', false],
    ];

    for (const [enabled, nodeEnv, expected] of combinations) {
      expect(
        service({
          ACTIVITY_AGGREGATOR_ENABLED: enabled,
          NODE_ENV: nodeEnv,
        }).shouldSchedule(),
      ).toBe(expected);
    }
  });

  it('sin la variable definida no agenda nada', () => {
    const scheduler = service({ NODE_ENV: 'development' });

    expect(scheduler.shouldSchedule()).toBe(false);
    scheduler.onApplicationBootstrap();
    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('con NODE_ENV=test no agenda nada aunque la variable este activa', () => {
    service({
      ACTIVITY_AGGREGATOR_ENABLED: 'true',
      NODE_ENV: 'test',
    }).onApplicationBootstrap();

    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('no reutiliza POLLER_ENABLED para gatearse', () => {
    service({
      POLLER_ENABLED: 'true',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();

    expect(registry.addInterval).not.toHaveBeenCalled();
  });

  it('agenda un intervalo horario que invoca runOnce(new Date())', () => {
    expect(ACTIVITY_TICK_INTERVAL_MS).toBe(3_600_000);

    service({
      ACTIVITY_AGGREGATOR_ENABLED: 'true',
      NODE_ENV: 'development',
    }).onApplicationBootstrap();

    expect(registry.addInterval).toHaveBeenCalledTimes(1);
    const names = registry.addInterval.mock.calls.map(
      (call: unknown[]) => call[0],
    );
    expect(names).toEqual([ACTIVITY_TICK_NAME]);

    jest.advanceTimersByTime(ACTIVITY_TICK_INTERVAL_MS);
    expect(runOnce).toHaveBeenCalledTimes(1);
    const clocks = runOnce.mock.calls.map((call: unknown[]) => call[0]);
    expect(clocks[0]).toBeInstanceOf(Date);
    jest.advanceTimersByTime(ACTIVITY_TICK_INTERVAL_MS);
    expect(runOnce).toHaveBeenCalledTimes(2);
  });

  it('no vuelve a llamar a ScheduleModule.forRoot ni usa decorador @Cron', () => {
    const code = readFileSync(
      join(__dirname, 'activity-scheduler.service.ts'),
      'utf-8',
    )
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');

    expect(code).not.toMatch(/ScheduleModule/);
    expect(code).not.toMatch(/@Cron|@Interval|addCronJob/);
  });
});

describe('R22: ACTIVITY_AGGREGATOR_ENABLED documentada donde manda AGENTS.md §4', () => {
  it('esta en .env.example con valor true', () => {
    const example = readFileSync(join(REPO_ROOT, '.env.example'), 'utf-8');

    expect(example).toMatch(/^ACTIVITY_AGGREGATOR_ENABLED=true$/m);
  });

  it('esta en la tabla de variables de entorno de docs/conventions.md', () => {
    const conventions = readFileSync(
      join(REPO_ROOT, 'docs', 'conventions.md'),
      'utf-8',
    );

    expect(conventions).toMatch(/\| `ACTIVITY_AGGREGATOR_ENABLED` \|/);
  });

  it('se lee por ConfigService, nunca por process.env', () => {
    const source = readFileSync(
      join(__dirname, 'activity-scheduler.service.ts'),
      'utf-8',
    );

    expect(source).toMatch(
      /config\.get<string>\('ACTIVITY_AGGREGATOR_ENABLED'\)/,
    );
    expect(source).not.toMatch(/process\.env/);
  });
});
