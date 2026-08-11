# Implementación — health-weights #15

## Inicio

- Branch: `feature/15-health-weights`.
- Spec aprobada: `specs/health-weights/requirements.md` (R1..R10).
- Baseline: `./init.sh` exit 0 tras levantar y provisionar Docker; 123 suites / 889 tests backend, 2 suites / 14 tests infra y 181 e2e verdes (6 skipped).
- Estrategia: TDD por requisito con commits separados de test rojo e implementación verde.

## Requisitos

- R1 — rojo `281663d`; verde `0e1dae1`. Se añadió `weights` a
  `health.schema.ts` y se generó la migración nueva
  `0010_low_miracleman.sql`, sin modificar `0009` ni alterar `pets`.
- R2 — rojo `0abc655`; verde `8da976c`. POST crea la medición, convierte
  `numeric(5,2)` manualmente y responde el shape congelado con `weightKg`
  numérico.
- R3 — rojo `f5a4fea`; verde `1b2d1f9`. El `UPDATE` usa `NOT EXISTS` con
  comparación estricta de `measured_at`: retroactivas no pisan y el empate sí.
- R4 — rojo `5033761`; verde `9b65281`. El `INSERT` y el `UPDATE` condicional
  usan el mismo callback de `db.transaction`; un fallo descarta la inserción.
- R5 — rojo `2c27056`; verde `b34a2b0`. GET ordena por fecha/id descendente y
  calcula `variation` con redondeo y fila sonda `limit + 1` sobre el historial
  completo.

## Verificación final

Pendiente.

## Decisiones

Ninguna fuera de las decisiones cerradas en la spec.
