# review: reminders-api (#47)
Fecha: 2026-08-24
Veredicto: APROBADO
Delta revisado: 76bda83..4fb726c en `feature/47-reminders-api` (implementación Codex CLI)

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`#47 reminders-api` en `feature_list.json`)
- [x] progress/current.md actualizado (describe la sesión #47 y el paso pendiente del reviewer)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — `reminder.repository.ts` solo importa la entidad de domain
- [x] repositories/contratos en domain son interfaces puras — `listByPet` y `deleteByPetAndId` añadidos a la interface `ReminderRepository`, sin implementación; token `Symbol('ReminderRepository')`
- [x] application depende de interfaces, no implementaciones — `ListRemindersUseCase` y `DeleteReminderUseCase` inyectan `REMINDER_REPOSITORY` con `import type { ReminderRepository }`
- [x] infrastructure sin lógica de negocio — `ReminderDrizzleRepository` implementa exactamente el SQL de design.md D3 (`eq(petId)` + `orderBy(asc(dueAt))`; `delete` con `and(eq(id), eq(petId))` + `.returning`); el 404-si-no-borró vive en el use case

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra:
  - R1: `list-reminders.use-case.spec.ts` → `describe('R1: ListRemindersUseCase delega en listByPet')`; e2e `describe('R1: GET lista todos los reminders de la mascota por dueAt')`
  - R2: `delete-reminder.use-case.spec.ts` → `describe('R2: DeleteReminderUseCase borra o lanza not-found')`; e2e `describe('R2 (reminders-api #47): DELETE borra solo para el owner')`
  - R3: verificación de regresión/contención (commit `8fa05bb` + este review)
- [x] Historial test-primero verificado **con checkout de los commits rojos en worktrees aislados**:
  - R1: en `b469cf9` el spec existe, `list-reminders.use-case.ts` NO existe, controller sin `@Get()`, interface sin `listByPet`. Jest ejecutado en ese commit: `Test Suites: 1 failed` (module not found). Verde en `c2fa98c`.
  - R2: en `b4e1f90` el spec existe, `delete-reminder.use-case.ts` NO existe, controller sin `@Delete`, interface sin `deleteByPetAndId`. Jest ejecutado en ese commit: `Test Suites: 1 failed`. Verde en `5595a31`.
  - En HEAD ambos specs unitarios: 2 suites / 3 tests passed.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" — R1, R2, R3 con test::nombre y commits rojo+verde
- [x] Commits siguen el formato `<tipo>(reminders-api): <desc> (R<n>)` — los 9 commits del delta, cero fuera de formato

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana `[X]` (fecha 2026-08-24)
- [x] Aprobación humana en commit `e47a686` (autor humano, marca la casilla); `76bda83` (leader) solo voltea el frontmatter a approved. `git diff 76bda83..HEAD -- specs/reminders-api/requirements.md`: sin cambios de requisitos post-aprobación

## Checklist C7 — Sin código huérfano
- [x] N/A — esta feature no reemplaza nada existente; POST, PATCH, dispatcher y scheduler quedan intactos por diseño (R3)

## Contratos verificados contra el código y los e2e
- GET `/v1/pets/:petId/reminders`: 200 `ReminderResponse[]` vía `toReminderResponse`, todos los status (`sent`/`scheduled`/`cancelled` en el mismo test) ordenados `dueAt` asc, `[]` sin filas, 200 para rol `family`, 404 no-miembro (PetAccessGuard, sin `@RequirePetRole`) — R1 completo
- DELETE `/v1/pets/:petId/reminders/:id`: 204 sin body (assert `deleted.text === ''`) + fila desaparecida (select directo vacío y GET posterior `[]`), 204 sobre `cancelled`, 404 id no-UUID sin tocar la base (pre-check `UUID_PATTERN` reutilizado, no duplicado), 404 reminder de otra mascota (fila intacta), 403 miembro no-owner (`@RequirePetRole('owner')`), 404 no-miembro — R2 completo
- Errores tipados: `deleteByPetAndId === false` → `ReminderNotFoundError` en el use case → `mapReminderError` en el controller. Sin DTO nuevo (GET/DELETE sin body), zod existente intacto — D5
- Firmas idénticas a design.md §D3; patrón `vaccines.controller.ts` (D4)

## Contención (R3)
- `git diff 76bda83..HEAD -- mobile-pet-tracker/ infra/` → vacío
- `git diff --name-only 76bda83..HEAD -- backend-pet-tracker/` filtrado por `modules/reminders|pet-reminders.e2e` → vacío (nada fuera del módulo)
- Cero deps nuevas: sin cambios en package.json / pnpm-lock (raíz y backend)
- `test/pet-reminders.e2e-spec.ts`: 0 líneas borradas, solo adiciones; los describes previos R2–R11 de la feature original intactos
- Única deleción del backend: la línea del constructor de `PetRemindersController` (reemplazada por el constructor con los 3 use cases) — dentro del alcance

## Observaciones
(ninguna bloqueante)
- Bookkeeping pendiente del cierre del leader: `STATUS.md` aún dice 37/46; marcar #47 `done` y actualizar corresponde al cierre de sesión, no a esta implementación.

## Output de ./init.sh (ejecutado por el reviewer, exit 0)
```
Backend:  Test Suites: 145 passed, 145 total — Tests: 1114 passed, 1114 total
Infra:    Test Suites: 2 passed, 2 total   — Tests: 14 passed, 14 total
Móvil:    Test Suites: 32 passed, 32 total — Tests: 357 passed, 357 total
E2E:      Test Suites: 2 skipped, 20 passed, 20 of 22 total
          Tests: 6 skipped, 327 passed, 333 total
          (skips = smokes AWS real con gate de entorno, ajenos a #47;
           coincide con lo reportado por Codex: 327 e2e, 33 de pet-reminders)
✅ Todo verde. Listo para trabajar.
EXIT=0
```
