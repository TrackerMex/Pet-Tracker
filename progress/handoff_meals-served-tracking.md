# Handoff a Codex CLI — #83 `meals-served-tracking`

Feature: `meals-served-tracking` (#83), branch: `feature/83-meals-served-tracking`.
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` (base `origin/main` 0e4aa810,
ya mergeada en la branch). Trabaja SOLO ahí. El tree principal
`/home/claude/sites/Pet-Tracker` lo usa otra sesión (#97, móvil): no lo toques.
Antes de empezar: `git pull` y `git branch --show-current` =
`feature/83-meals-served-tracking`.

Spec aprobada: `specs/meals-served-tracking/requirements.md` (status: approved,
firma humana en `84804302`). Lee también `design.md`, `tasks.md` y
`traceability.md`, y el explore `progress/explore_meals-served-tracking.md`.
Las premisas corregidas están en `requirements.md` §0.2 (C1-C7): construye
sobre la versión corregida, no sobre el explore ni sobre este prompt.

Feature backend pura (`backend-pet-tracker/`). Sin móvil, sin env nuevas, sin
dependencias nuevas, sin tocar `init.sh`, CI ni `.env.example`. Una migración
nueva (la siguiente al journal, `0017_meal_servings.sql` con el journal de
hoy), aditiva: solo `CREATE TABLE "meal_servings"`.

Base de datos: este worktree tiene su PROPIA base, `pet_tracker_wt`
(`DATABASE_URL` del `.env` raíz, puerto 5433; `drizzle.config.ts` la carga
solo). Estado de partida verificado por el leader: journal
`drizzle.__drizzle_migrations` con 17 filas, última `created_at`
1789440631931 (= `when` de `0016_drop_devices_connectivity`). `pnpm db:migrate`
y `pnpm db:generate` corren solo contra esa base, desde `backend-pet-tracker/`,
nunca con `psql` crudo. La base compartida `pet_tracker` NO se toca: la migra
el leader tras el merge (`design.md` §Aplicación de la migración en dos bases).

Decisiones cerradas (no reabrir): D1-D4 del humano (backend solo; cualquier
miembro activo sirve y deshace, sin `@RequirePetRole`; 409 `MEAL_ALREADY_SERVED`
por UNIQUE y `DELETE …/meals/:mealTime` sobre la franja de hoy; el conteo solo
cuenta franjas del plan vigente) y D5-D12 de `design.md` (tabla literal en
`nutrition.schema.ts`; el cliente no manda fecha; dos use cases lineales con
cuatro errores de dominio y orden fijo body → plan → pertenencia → unicidad;
`servedInPlan` como único punto de verdad de D4; puerto `PET_MEALS_READER` en
pets con adaptador y `PetMealsReadModule` en nutrition; sin e2e permanente
contra `information_schema`; 409 vía `onConflictDoNothing` + `returning`, sin
parsear errores de pg; `201` con seis claves y `204` vacío).

Archivos a crear/modificar: exactamente los de `design.md` §Archivos afectados
(lista cerrada). `PetRepository` no cambia (P6: `MockOf<PetRepository>` en
`alerts-engine-consumer.service.spec.ts` rompería). `GenerateNutritionPlanUseCase`
y `POST …/generate` no cambian (C5). Migraciones `0000`-`0016` y sus snapshots
no se tocan.

Reglas críticas:
- Seguir `docs/architecture.md` y `docs/conventions.md`.
- TDD en el orden de `tasks.md` §Orden (R1, R11, R2, R6, R4, R5, R7, R3, R8,
  R9, R10, R12). **UN COMMIT POR REQUISITO COMO MÍNIMO, test rojo antes que su
  implementación**: `test(meals-served-tracking): … (R<n>)` en rojo, luego
  `feat(meals-served-tracking): … (R<n>)` en verde, luego `docs(...)` si el
  requisito toca docs. Un único commit con todo incumple C4 de `CHECKPOINTS.md`.
  El rojo de R1 y R11 es "el módulo no existe" (artefacto bajo prueba,
  precedente #93 R1); el rojo de R2-R10 debe ser de aserciones, no de tipos.
- R1: si `pnpm db:generate` emite cualquier sentencia sobre otra tabla, PARA sin
  commitear, `git checkout -- src/db/migrations` y repórtalo en el impl §R1.
  Renombra el `.sql` y el `tag` del journal a `0017_meal_servings`; `when` y
  snapshot se dejan como salieron.
- Candados que se mueven: solo los de la tabla "Se mueven" de `requirements.md`
  §Candados (seis listas de claves del perfil a 25, dobles de
  `get-pet.use-case.spec.ts` con quinto argumento, `test/nutrition.e2e-spec.ts:478`,
  `docs/conventions.md:295,303`, `docs/data-model.md`). Si cualquier otro de la
  tabla "Siguen verdes" se pone rojo, la implementación está mal: PARA y
  anótalo en el impl.
- R12 es requisito de verificación (C4 vía (b)), sin rojo propio: `pnpm test` y
  `tsc --noEmit` verdes con R1-R11 commiteados y la migración sin aplicar;
  después `pnpm db:migrate` (journal 18 filas, tabla presente), segunda corrida
  idempotente, `pnpm db:generate` no-op, `pnpm test:e2e` con `test/meals.e2e-spec.ts`
  ejecutada (30 suites, 3 `aws-real` skipped), `./init.sh` verde. Pega cada
  salida literal en el impl.
- Suites: `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test:e2e`
  desde `backend-pet-tracker/`. Postgres no se comparte, pero LocalStack sí (14
  de las suites e2e lo tocan): antes de cada `pnpm test:e2e` o `./init.sh`,
  `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` debe estar vacío; si
  hay otro vivo, espera y repite una sola corrida limpia. `./init.sh` desde #96
  aborta si 5433 o 4566 no responden: la infra debe estar arriba
  (`docker compose up -d` ya lo está en el VPS).
- Actualizar `specs/meals-served-tracking/traceability.md` tras cada commit
  (hash rojo, verde y docs por R; evidencias de R12). No rebasear la branch
  después.
- No crear recursos AWS reales ni correr `cdk deploy`.
- **Push** de la branch al terminar:
  `git push origin feature/83-meals-served-tracking`.

Criterios de aceptación: R1-R12 de `requirements.md`.

Al terminar: `./init.sh` verde desde la raíz del worktree (pgrep antes, exit
code medido sin pipe), `git diff --stat origin/main` limitado a los ficheros de
`design.md` §Archivos afectados más `progress/impl_meals-served-tracking.md` y
`traceability.md`, todo en `progress/impl_meals-served-tracking.md` (una sección
por R con evidencias), push, y para. No abras el PR: lo abre el leader tras el
veredicto del reviewer.
