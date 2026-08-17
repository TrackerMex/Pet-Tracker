# Implementación — device-subscriptions #25

## Inicio

- Branch: `feature/25-device-subscriptions`.
- Spec aprobada: `specs/device-subscriptions/requirements.md` (R1..R18), gate
  humano del 2026-08-17.
- Estrategia: orden obligatorio de `tasks.md` y TDD por requisito, con el test
  rojo antes de la implementación verde cuando el requisito añade conducta.

## Requisitos

- R1 — rojo `ae15c15`; verde `d8eb957`. Schema y migración de
  `device_subscriptions`.
- R17 — rojo `f171ffa`; verde `e86435f`. Backfill de devices existentes y seed
  idempotente.
- R2 — rojo `7f75218`; verde `238b7df`. Predicado SQL único de entitlement.
- R3 — rojo `fe506d6`; verde `1686166`. Repositorio por pet/device y siete
  estados de vigencia.
- R4 — rojo `07cc06d`; verde `c61c729`. El poller selecciona solo devices con
  entitlement.
- R5 — `1a95002`. Propiedad verde: vencer no libera `pet_devices`.
- R13 — rojo `6b07d89`; verde `6ba4350`. CLI idempotente
  `subscription:set`.
- R6 — rojo `0341d62`; verde `4356417`. Watermark reiniciado solo al reactivar.
- R7 — rojo `a6bc9ca`; verde `a4682cd`. El claim valida la suscripción al final.
- R8 — rojo `e5bb926`; verde `b8df30d`. Guard 402 con precedencia 404 fijada.
- R15 — rojo `c06fd74`; verde `b8bc340`. Wiring de `SubscriptionsModule`.
- R9 — rojo `8256ac4`; verde `6a217d4`. Diez rutas exactas de tracking gateadas.
- R10 — rojo `fc1dcd7`; verde `5ebc02b`. Alertas list/ack filtradas por
  entitlement.
- R11 — `e534063`. Propiedad verde: owner, family, walker y vet comparten el
  entitlement del collar.
- R16 — `746c476`. Propiedad verde: perfil con 24 claves y device con 5.
- R14 — `3a83c14`. Restricción verde: cero proveedores de pago en `src/`.
- R12 — `cf77e6a`. Contrato de #18 documentado, sin anticipar nutrición.
- R18 — rojo documental `cec3fc4`; verde `b16192b`. ERD y catálogo actualizados.

Commits de regresión y calidad:

- `90cb9f1` — fixtures históricos de tracking con entitlement.
- `ee6c2df` — corrección de lint en el e2e nuevo.
- La tabla `specs/device-subscriptions/traceability.md` registra los commits de
  cada requisito.

## Verificación final

- `./init.sh`: exit 0.
- Build backend y `cdk synth`: verdes, sin deploy/bootstrap.
- Backend unit: 136 suites / 1,000 tests pasados.
- Infra: 2 suites / 14 tests pasados.
- Harness de entorno: 28 tests pasados.
- E2E: 18 suites pasadas de 20, 2 omitidas por sus gates existentes; 292 tests
  pasados y 6 omitidos.
- Lint y typecheck: verdes.
- Grep de proveedores de pago en `src/`: sin coincidencias.
- `pet-access.guard.ts` y los mappers de respuesta: intactos.

## Entorno y límites

- El journal local de Drizzle tenía las migraciones 0009–0011 aplicadas sin sus
  filas. Se verificaron y reconciliaron solo esas filas en Postgres Docker antes
  de aplicar 0012 localmente.
- No se crearon recursos AWS, no se ejecutó `cdk deploy` y no se tocó ninguna
  base no local.
- El smoke con el collar Wialon real y `subscription:set` sobre ese collar quedan
  reservados al humano por requerir token y hardware reales.
- Se preservaron sin tocar `.agents/`, `.codex/` y `skills-lock.json`, no
  rastreados y ajenos a la feature.
