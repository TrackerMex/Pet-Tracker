# Implementación — device-telemetry-reset-on-reassign (#92)

## R1

### Rojo — `4160f514`

- `pnpm test -- claim-device` — exit `1`: el test `#92 R1` recibió el
  snapshot previo (`batteryPct: 37`, `lastMessageAt: 2026-08-01T11:59:00Z`,
  `status: available`) en vez de la entidad resuelta por `claim`; los otros
  24 tests pasaron.
- `pnpm test:e2e -- devices.e2e-spec` — exit `1`: el `it` (a) recibió
  `batteryPct: 37` donde esperaba `null`; el `it` (b) recibió
  `batteryPct: 63` donde esperaba `null`; los otros 27 tests pasaron.

### Verde

- `pnpm test` — exit `0`: 166 suites, 1278 tests.
- `pnpm test:e2e -- devices.e2e-spec` — exit `0`: 1 suite, 29 tests.
- `pnpm lint` — exit `0`.
- `pnpm build` — exit `0`.

## R2

## R3
