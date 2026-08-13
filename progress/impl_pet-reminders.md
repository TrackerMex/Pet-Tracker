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
- R4 — rojo `f899527`; verde `713d285`. `PetAccessGuard` y rol owner protegen
  el POST con precedencia 404 antes de 403/validación.
- R5 — rojo `0479f29`; verde `c2e1e3e`. Dispatcher selecciona vencidos en
  orden, envía antes de marcar y reintenta solo fallos sin frenar el lote.
- R6 — rojo `a58fbe3`; verde `13f5859`. Payload reminder exacto y schema
  discriminado alert/reminder sin cambiar claves ni tests de alertas.
- R7 — rojo `355d5cc`; verde `15b0274`. Notifier valida token vigente, usa el
  push existente, marca sent condicionalmente y elimina skips/duplicados.

## Verificación final

Pendiente.

## Desviaciones

Ninguna.
