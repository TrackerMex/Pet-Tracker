# Handoff fix 1 — review C7: módulo backend health huérfano (#40)

Veredicto del reviewer: RECHAZADO por un único bloqueante
(`progress/review_mobile-pets-profile.md` §Observaciones — léelo entero).
Branch: `feature/40-mobile-pets-profile`.

## Bloqueante (C7)

Q2/R3 eliminó el único consumidor de producción del backend health check.
Quedaron huérfanos:

- `mobile-pet-tracker/src/api/health.ts` (`healthUrl`, `fetchHealth`,
  `HealthState`) — ningún importador fuera de su test.
- `mobile-pet-tracker/src/api/__tests__/health.test.ts`.

Qué hacer: BORRAR ambos archivos. OJO: NO tocar
`src/api/health-records.ts` (vacunas/pesos, #37 — tiene consumidores
vivos). Documentar el borrado en el cuerpo del commit como parte de la
excepción C4/Q2 (mismo criterio que el commit `ea75755`) y actualizar la
fila R3 de `specs/mobile-pets-profile/traceability.md`.

## Menor (mismo ciclo)

`src/app/(tabs)/__tests__/screens.test.tsx` se modificó en `91c9ad2` (R9)
fuera de la lista de R9: es solo scaffolding de mocks, las aserciones de
#33 están intactas. Déjalo anotado en
`progress/impl_mobile-pets-profile.md` §R9 o en la fila R9 de la
trazabilidad — sin cambiar código.

## Al terminar

`bun run test` (quedarán 45 suites), `bun run typecheck`, `bun run lint`
verdes en `mobile-pet-tracker/`; `./init.sh` exit 0 desde la raíz; append
del resultado en `progress/impl_mobile-pets-profile.md`. Commit en la
branch, no pushees.
