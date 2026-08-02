// Los 3 collares simulados del MVP (devices-claim R2, plan 005 §Paso 2).
// Movido de scripts/seed-devices.ts en #8: el FakeWialonClient debe importar
// estos wialonUnitId (wialon-ingestion-pipeline R2, "importados, no
// re-tecleados") y src/ no puede importar desde scripts/ sin romper el
// layout del build (rootDir). scripts/seed-devices.ts lo re-exporta.
export const SIMULATED_DEVICES = [
  { esn: 'SIM-001', activationCode: 'ACT-001', wialonUnitId: '900001' },
  { esn: 'SIM-002', activationCode: 'ACT-002', wialonUnitId: '900002' },
  { esn: 'SIM-003', activationCode: 'ACT-003', wialonUnitId: '900003' },
] as const;
