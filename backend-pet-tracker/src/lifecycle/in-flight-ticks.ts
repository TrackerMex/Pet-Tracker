import { BeforeApplicationShutdown, Injectable, Logger } from '@nestjs/common';
export const SHUTDOWN_DRAIN_TIMEOUT_MS = 20_000;
@Injectable()
export class InFlightTicks implements BeforeApplicationShutdown {
  private readonly logger = new Logger(InFlightTicks.name);
  private readonly pending = new Set<Promise<void>>();
  private closing = false;
  run(task: () => unknown): void {
    if (this.closing) return;
    let result: Promise<unknown>;
    try {
      result = Promise.resolve(task());
    } catch (error) {
      result = Promise.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
    const tracked = result
      .then(() => undefined)
      .catch((error: unknown) => {
        this.logger.error(
          error instanceof Error ? error.message : String(error),
        );
      })
      .finally(() => {
        this.pending.delete(tracked);
      });
    this.pending.add(tracked);
  }
  async drain(timeoutMs: number): Promise<'drained' | 'timeout'> {
    if (this.pending.size === 0) return 'drained';
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        Promise.allSettled([...this.pending]).then(() => 'drained' as const),
        new Promise<'timeout'>((resolve) => {
          timer = setTimeout(() => resolve('timeout'), timeoutMs);
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  }
  async beforeApplicationShutdown(): Promise<void> {
    this.closing = true;
    if ((await this.drain(SHUTDOWN_DRAIN_TIMEOUT_MS)) === 'timeout')
      this.logger.warn(
        `Shutdown drain timed out with ${this.pending.size} pending tasks`,
      );
  }
}
