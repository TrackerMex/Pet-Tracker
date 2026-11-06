import { Logger } from '@nestjs/common';
import { InFlightTicks, SHUTDOWN_DRAIN_TIMEOUT_MS } from './in-flight-ticks';
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
describe('R6: InFlightTicks sigue los ticks y los drena al apagar', () => {
  let ticks: InFlightTicks;
  let error: jest.SpyInstance;
  let warn: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    ticks = new InFlightTicks();
    error = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });
  it('R6: run invoca la tarea antes de retornar', () => {
    const task = jest.fn();
    ticks.run(task);
    expect(task).toHaveBeenCalledTimes(1);
  });
  it('R6: drain sin tareas resuelve drained y no deja timers', async () => {
    await expect(ticks.drain(1000)).resolves.toBe('drained');
    expect(jest.getTimerCount()).toBe(0);
  });
  it('R6: drain espera a la tarea pendiente y resuelve drained al terminar', async () => {
    const task = deferred();
    ticks.run(() => task.promise);
    let settled = false;
    const drain = ticks.drain(1000).then((value) => {
      settled = true;
      return value;
    });
    await jest.advanceTimersByTimeAsync(999);
    expect(settled).toBe(false);
    task.resolve();
    await expect(drain).resolves.toBe('drained');
    expect(jest.getTimerCount()).toBe(0);
  });
  it('R6: drain resuelve timeout al cumplirse el plazo con una tarea pendiente', async () => {
    const task = deferred();
    ticks.run(() => task.promise);
    let settled = false;
    const drain = ticks.drain(1000).then((value) => {
      settled = true;
      return value;
    });
    await jest.advanceTimersByTimeAsync(999);
    expect(settled).toBe(false);
    await jest.advanceTimersByTimeAsync(1);
    await expect(drain).resolves.toBe('timeout');
  });
  it('R6: un rechazo de la tarea se registra con Logger.error y no se propaga', async () => {
    ticks.run(() => Promise.reject(new Error('tick-boom-245')));
    const drain = ticks.drain(1000);
    await jest.advanceTimersByTimeAsync(0);
    await expect(drain).resolves.toBe('drained');
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('tick-boom-245'),
    );
  });
  it('R6: tras beforeApplicationShutdown, run no invoca la tarea', () => {
    const first = jest.fn();
    ticks.run(first);
    expect(first).toHaveBeenCalledTimes(1);
    void ticks.beforeApplicationShutdown();
    const second = jest.fn();
    ticks.run(second);
    expect(second).not.toHaveBeenCalled();
  });
  it('R6: beforeApplicationShutdown espera SHUTDOWN_DRAIN_TIMEOUT_MS y avisa de las pendientes', async () => {
    expect(SHUTDOWN_DRAIN_TIMEOUT_MS).toBe(20000);
    ticks.run(() => deferred().promise);
    ticks.run(() => deferred().promise);
    let settled = false;
    const shutdown = ticks.beforeApplicationShutdown().then(() => {
      settled = true;
    });
    await jest.advanceTimersByTimeAsync(19999);
    expect(settled).toBe(false);
    await jest.advanceTimersByTimeAsync(1);
    await shutdown;
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/\b2\b/));
  });
});
