import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InFlightTicks } from '@/lifecycle/in-flight-ticks';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RemindersDispatchService } from './reminders-dispatch.service';
import {
  REMINDERS_INTERVAL_MS,
  REMINDERS_INTERVAL_NAME,
} from './reminders.constants';

@Injectable()
export class RemindersSchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RemindersSchedulerService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly dispatcher: RemindersDispatchService,
    private readonly ticks: InFlightTicks,
  ) {}

  onApplicationBootstrap(): void {
    if (!this.shouldSchedule()) return;

    this.schedulerRegistry.addInterval(
      REMINDERS_INTERVAL_NAME,
      setInterval(
        () => this.ticks.run(() => this.dispatcher.dispatchOnce()),
        REMINDERS_INTERVAL_MS,
      ),
    );
    this.logger.log(
      `reminders dispatcher scheduled (${REMINDERS_INTERVAL_MS} ms)`,
    );
  }

  shouldSchedule(): boolean {
    return (
      this.config.get<string>('REMINDERS_ENABLED') === 'true' &&
      this.config.get<string>('NODE_ENV') !== 'test'
    );
  }
}
