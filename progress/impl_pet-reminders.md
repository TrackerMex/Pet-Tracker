# Implementación — pet-reminders #16

## Inicio

- Branch: `feature/16-pet-reminders`.
- Spec aprobada: `specs/pet-reminders/requirements.md` (R1..R12).
- Baseline: `./init.sh` exit 0; 127 suites / 901 tests backend y 2 suites / 14
  tests infra. E2E omitidos porque Postgres no estaba levantado.
- Estrategia: TDD por requisito con commits separados de test rojo e
  implementación verde.

## Requisitos

- R1 — rojo `a834a82`; verde `9745aa8`. Tabla `reminders` y migración
  `0011_fancy_turbo.sql` generada sin alterar tablas existentes.
- R2 — rojo `5decc79`; verde `aaf7788`. POST crea un reminder programado con
  defaults, actor, token vigente y response shape exacto.
- R3 — rojo `ef01906`; verde `a118440`. Zod valida enum, título, ISO con
  offset, futuro, advance y claves desconocidas; rechazos no persisten.

## Verificación final

Pendiente.

## Desviaciones

Ninguna.
