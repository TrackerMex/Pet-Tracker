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
- R8 — rojo `1de5b67`; verde `f01d71a`. PATCH reprograma con token nuevo,
  resetea el encolado y deja obsoleto cualquier mensaje anterior.
- R9 — rojo `4179065`; verde `52821a3`. Cancelar antes o después del encolado
  deja status cancelled y ningún mensaje produce push.
- R10 — rojo `56fdd11`; verde `7a29488`. El PATCH resuelve `pet_id` desde el
  reminder, devuelve 404 opaco para id/membresía y 403 para no-owner.
- R11 — rojo `e4fb8e4`; verde `0e2419c`. PATCH estricto con Zod; reminders
  `sent`/`cancelled` devuelven 409 sin mutar la fila.
- R12 — rojo `ef91e6c`; verde `6147f96`. Scheduler local gateado por
  `REMINDERS_ENABLED` y `NODE_ENV`, con env documentada en el mismo commit.

Commits adicionales:

- `4f20037` — compatibilidad de typecheck del constructor del notifier con los
  tests alert congelados de #13; evidencia añadida a R7 en traceability.
- `8c350d1` — modelo de datos local (`enqueued_at` y `schedule_name`).
- Un commit de trazabilidad después de cada requisito; todas las filas R1-R12
  contienen los hashes rojo/verde.

## Verificación final

- `./init.sh`: exit 0.
- Build backend y `cdk synth`: verde, sin deploy/bootstrap.
- Backend unit: 132 suites / 956 tests pasados.
- Infra: 2 suites / 14 tests pasados.
- E2E: 15 suites / 238 tests pasados; 2 suites / 6 tests omitidos por su gate
  existente.
- Lint y typecheck: verdes.
- Suite específica `pet-reminders.e2e-spec.ts`: 25/25 pasada.
- Árbol de la feature limpio. Se preservaron sin tocar `.agents/`, `.codex/`
  y `skills-lock.json`, no rastreados y ajenos a la feature.

## Desviaciones

- Ninguna respecto de requirements R1-R12 ni design D1-D11.
- Entorno local: el journal de Drizzle estaba desincronizado (tablas 0009/0010
  presentes sin sus filas de journal), por lo que se aplicó solo la migración
  0011 al Postgres Docker para ejecutar e2e. No se modificaron recursos AWS.
- No se abrió PR ni se hizo merge; queda para el leader/reviewer.
