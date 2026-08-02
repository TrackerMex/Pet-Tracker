import { staleSeconds } from './stale-seconds';

describe('R4: staleSeconds = max(0, floor((now - ts) / 1000)) con reloj inyectado', () => {
  // Reloj fijo: la funcion es pura, el test no depende del reloj real.
  const now = new Date('2026-08-02T12:00:00.000Z');
  const nowMs = now.getTime();

  it('un ts de hace 90 000 ms da 90 segundos', () => {
    expect(staleSeconds(nowMs - 90_000, now)).toBe(90);
  });

  it('un ts futuro (desfase del dispositivo) da 0, nunca negativo', () => {
    expect(staleSeconds(nowMs + 5_000, now)).toBe(0);
  });

  it('un ts igual a now da 0', () => {
    expect(staleSeconds(nowMs, now)).toBe(0);
  });

  it('trunca hacia abajo los milisegundos sobrantes', () => {
    expect(staleSeconds(nowMs - 1_999, now)).toBe(1);
  });
});
