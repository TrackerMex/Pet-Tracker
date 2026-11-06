import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';
export const SHUTDOWN_DRAIN_TIMEOUT_MS = 20_000;
@Injectable()
export class InFlightTicks implements BeforeApplicationShutdown {
  run(task: () => unknown): void {
    void task;
  }
  drain(timeoutMs: number): Promise<'drained' | 'timeout'> {
    void timeoutMs;
    return Promise.resolve('timeout');
  }
  beforeApplicationShutdown(): Promise<void> {
    return Promise.resolve();
  }
}
