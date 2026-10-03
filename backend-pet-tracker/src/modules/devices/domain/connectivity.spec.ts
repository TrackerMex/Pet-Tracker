import { DEVICE_ONLINE_THRESHOLD_MS } from '@/pipeline/constants';
import { deriveConnectivity } from './connectivity';

describe('#73 R1: deriveConnectivity decide online/offline contra el reloj del servidor con DEVICE_ONLINE_THRESHOLD_MS', () => {
  const now = new Date('2026-09-13T12:00:00.000Z');

  it('el umbral vale exactamente 120 s (2 min), decision G2 enmendada por E1', () => {
    expect(DEVICE_ONLINE_THRESHOLD_MS).toBe(120_000);
  });

  it('un lastMessageAt de hace umbral - 1 s es online', () => {
    expect(
      deriveConnectivity(
        new Date(now.getTime() - DEVICE_ONLINE_THRESHOLD_MS + 1_000),
        now,
      ),
    ).toBe('online');
  });

  it('un lastMessageAt de hace umbral + 1 s es offline', () => {
    expect(
      deriveConnectivity(
        new Date(now.getTime() - DEVICE_ONLINE_THRESHOLD_MS - 1_000),
        now,
      ),
    ).toBe('offline');
  });

  it('un lastMessageAt de hace exactamente el umbral sigue online (limite inclusivo)', () => {
    expect(
      deriveConnectivity(
        new Date(now.getTime() - DEVICE_ONLINE_THRESHOLD_MS),
        now,
      ),
    ).toBe('online');
  });

  it('un lastMessageAt posterior a now (collar adelantado) es online, nunca offline', () => {
    expect(deriveConnectivity(new Date(now.getTime() + 5_000), now)).toBe(
      'online',
    );
  });

  it('sin lastMessageAt (nunca reporto) devuelve null', () => {
    expect(deriveConnectivity(null, now)).toBeNull();
  });
});
