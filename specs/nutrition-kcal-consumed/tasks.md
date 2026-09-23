---
feature: "nutrition-kcal-consumed"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[nutrition-kcal-consumed]] (#104)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio** (C4 de `CHECKPOINTS.md`): **como
> mínimo un commit por requisito**, y el test rojo de cada R va en su propio
> commit `test(nutrition-kcal-consumed): … (R<n>)` **antes** que la
> implementación que lo pone verde, `feat(nutrition-kcal-consumed): … (R<n>)`.
> Un commit con test + implementación juntos incumple C4 (pasó en #19).
> R3 y R4 son **requisitos de verificación vía (a)**, declarados en
> [[requirements]]: sus tests se commitean en rojo **antes** del verde de R2,
> y ese mismo commit `feat(…): … (R2,R3,R4)` los pone verdes. No llevan
> commit `feat` propio.
>
> **Títulos con sufijo de feature**: `describe('R<n> (nutrition-kcal-consumed #104): …')`,
> literalmente los de [[requirements]]. Los ficheros que se tocan ya tienen
> R1-R11 de #83 y R16-R27 de #17; sin sufijo, C4 no es verificable por grep.
>
> **Sujeto presente**: cada test rojo usa solo helpers que ya existen en
> `test/meals.e2e-spec.ts` (`seedUser`, `seedPet`, `seedPlan`, `serveMeal`,
> `unserveMeal`, `getPlan`) e imports que el fichero ya tiene (`localDayOf`,
> `shiftDay`, `uuidv7`, `mealServings`, `nutritionPlans`). **No** se crea
> ningún helper nuevo; si hiciera falta uno, va en el commit rojo que lo usa
> por primera vez y ese rojo tiene que caer por su **aserción**, nunca por un
> `ReferenceError`. El único símbolo de producción que falta en un rojo es
> `kcalConsumed` en R1 (artefacto bajo prueba, precedente #83 R11).
>
> **Suites** (desde `backend-pet-tracker/`): `pnpm test` (unit),
> `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test:e2e`. Un fichero:
> `pnpm test -- meal-serving.entity`, `pnpm test:e2e -- meals.e2e-spec`,
> `pnpm test:e2e -- nutrition.e2e-spec`. Cierre: `./init.sh` desde la raíz,
> exit code medido **sin pipe** (`./init.sh; echo "exit=$?"`, nunca
> `./init.sh | tail`).
>
> **Postgres propio, LocalStack compartido**: este worktree usa
> `pet_tracker_wt` (`DATABASE_URL` del `.env` del worktree). Los e2e de
> `meals` y `nutrition` solo tocan Postgres. Antes de `pnpm test:e2e`
> **completo** o `./init.sh`:
> `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` tiene que salir
> vacío (la otra sesión comparte LocalStack `:4566` y el contenedor de
> Postgres). Si no está vacío, esperar; no lanzar en paralelo. Nunca `psql`
> para escribir ni `pnpm db:migrate` (esta feature no tiene migración).
>
> **Sin anclas por número de línea**: localizar cada sitio con el `grep -n`
> del texto citado.

---

## §0 — Antes de la primera tarea

- [ ] `pwd` = `/home/claude/sites/Pet-Tracker-wt-backend` y
      `git branch --show-current` = `feature/104-nutrition-kcal-consumed`
      (HEAD = el commit de la spec aprobada o un hijo). **No** tocar
      `/home/claude/sites/Pet-Tracker` (otra sesión).
- [ ] Leer [[requirements]] completo (§0: P5 "el día", P8 los dos candados
      que se mueven, P10 el `merKcal: 1059` del fixture; C1, C2) y [[design]]
      D2-D5.
- [ ] Comprobar que la base propia tiene la tabla de #83 (solo lectura):
      `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select to_regclass('public.meal_servings')"`
      → `meal_servings`. Si sale vacío, **parar** y avisar (no migrar).
- [ ] Crear `progress/impl_nutrition-kcal-consumed.md` con secciones §0, R1…R4.
      Es el **único** fichero de `progress/` que se escribe:
      `progress/current.md` y `progress/history.md` son del leader.
- [ ] Línea base: `pgrep` de cabecera vacío → `./init.sh; echo "exit=$?"`
      desde la raíz → `exit=0`. Anotar en el impl el recuento de tests unit y
      e2e que imprime. Si no es verde, **parar** sin tocar nada.

## §Orden

R1 (test → feat) → R2 test → R3 test → R4 test → feat (R2,R3,R4) → refactor
→ cierre.

R1 va primero porque `kcalConsumed` es lo que llama el verde de R2. Los tests
de R3 y R4 van **después** del de R2 y **antes** de su verde: así su rojo es
real (la clave `kcalConsumedToday` no existe) y ningún test asevera algo que
solo cree un requisito posterior al suyo en este orden.

---

## R1 — `kcalConsumed` reparte a partes iguales y redondea una vez

- [ ] (1) **Test rojo** — en
      `src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts`,
      cambiar el import a `import { kcalConsumed, servedInPlan } from './meal-serving.entity';`
      y añadir **después** del `describe('R11 (meals-served-tracking #83): …')`
      el `describe` y los tres `it` de [[requirements]] R1, con los literales
      de su tabla escritos a mano (`[0, 530, 1059]`, `[0, 333, 667, 1000]`,
      `[0, 250, 501, 751, 1001]`). Prohibido calcular el esperado con
      `Math.round`, con `kcalConsumed` o con constantes de producción.
      `pnpm test -- meal-serving.entity` → rojo (no se exporta `kcalConsumed`).
      Commit `test(nutrition-kcal-consumed): kcalConsumed reparte a partes iguales (R1)`.
- [ ] (2) **Verde** — añadir `kcalConsumed` a
      `src/modules/nutrition/domain/entities/meal-serving.entity.ts` tras
      `servedInPlan`, literal de [[design]] D2. `pnpm test -- meal-serving.entity`
      verde (R11 de #83 incluido), `pnpm exec tsc --noEmit` y `pnpm lint`
      verdes. Commit `feat(nutrition-kcal-consumed): kcalConsumed en dominio (R1)`.
- [ ] (3) **Refactor** — nada previsto. Evidencia en el impl §R1: salida del
      rojo (el error de import) y del verde.

## R2 — `GET` del plan devuelve `kcalConsumedToday`; `generate` no

- [ ] (1) **Test rojo** — en `test/meals.e2e-spec.ts`, al final del
      `describe('Meals served tracking (e2e)', …)` exterior (después del
      `describe('R10 (meals-served-tracking #83): …')`), el `describe` e `it`
      de [[requirements]] R2 con su tabla de pasos. **En el mismo commit**,
      los dos deltas declarados:
      (a) en el `describe('R9 (meals-served-tracking #83): …')` del mismo
      fichero, `'kcalConsumedToday',` justo después de `'servedToday',` en la
      lista de claves;
      (b) en `test/nutrition.e2e-spec.ts`,
      `expect(latest.body).toEqual({ ...second.body, servedToday: [] });` →
      `expect(latest.body).toEqual({ ...second.body, servedToday: [], kcalConsumedToday: 0 });`.
      `pnpm test:e2e -- meals.e2e-spec` → rojo en R2 (por `kcalConsumedToday`)
      y en R9 de #83 (lista de claves); `pnpm test:e2e -- nutrition.e2e-spec`
      → rojo solo en R24 de #17. Copiar al impl §R2 el mensaje de cada fallo:
      tiene que ser de **aserción** sobre `kcalConsumedToday`.
      Commit `test(nutrition-kcal-consumed): GET del plan con kcalConsumedToday (R2)`.
- [ ] (2) y (3): en «Verde de R2, R3 y R4», **después** de los rojos de R3 y R4.

## R3 — mismo día civil del owner que `servedToday` (verificación, vía (a))

- [ ] (1) **Test rojo** — en `test/meals.e2e-spec.ts`, tras el `describe` de
      R2, el `describe` y los dos `it` de [[requirements]] R3.
      `pnpm test:e2e -- meals.e2e-spec` → rojo en R3 por aserción sobre
      `kcalConsumedToday` (el `serveMeal` y el `servedOn` pasan: son de #83).
      Commit `test(nutrition-kcal-consumed): kcal del dia civil del owner (R3)`.
- [ ] (2) y (3): los del verde compartido más abajo (vía (a), sin `feat` propio).

## R4 — tras cambiar el plan se recalcula con el vigente (verificación, vía (a))

- [ ] (1) **Test rojo** — en `test/meals.e2e-spec.ts`, tras el `describe` de
      R3, el `describe` y los dos `it` de [[requirements]] R4 (los dos
      `db.insert(nutritionPlans)` literales). Rojo por aserción sobre
      `kcalConsumedToday`. Commit
      `test(nutrition-kcal-consumed): kcal con el plan vigente tras regenerar (R4)`.
- [ ] (2) y (3): los del verde compartido más abajo (vía (a), sin `feat` propio).

## Verde de R2, R3 y R4

- [ ] (2) **Verde** — los dos cambios literales de [[design]] D3:
      `get-nutrition-plan.use-case.ts` (`NutritionPlanToday` +
      `kcalConsumedToday`; `execute` calcula `servedToday` una vez y llama a
      `kcalConsumed(plan.merKcal, plan.mealsPerDay, servedToday.length)`;
      import de `kcalConsumed` junto al de `servedInPlan`) y
      `nutrition.mapper.ts` (`NutritionPlanTodayResponse` +
      `kcalConsumedToday`; `toNutritionPlanTodayResponse` lo copia tras
      `servedToday`). Ni una consulta nueva, ni otro `day` (D5).
      `pnpm test:e2e -- meals.e2e-spec` y `pnpm test:e2e -- nutrition.e2e-spec`
      verdes enteros; `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm lint`
      verdes. Commit
      `feat(nutrition-kcal-consumed): GET del plan devuelve kcalConsumedToday (R2,R3,R4)`.
- [ ] (3) **Refactor** — nada previsto. Comprobar que el diff de la feature
      (`git diff 2be1b023 --stat -- backend-pet-tracker`) toca **solo** los
      seis ficheros de [[design]] §Archivos afectados.

## Cierre

- [ ] `pgrep` de cabecera vacío → `./init.sh; echo "exit=$?"` → `exit=0`.
      Anotar en el impl el recuento nuevo: unit = línea base **+3** tests
      (R1); e2e = línea base **+5** tests (R2: 1, R3: 2, R4: 2), **mismas
      suites** en los dos (ningún fichero de test nuevo).
- [ ] Rellenar [[traceability]]: una fila por R con `archivo::describe › it`
      y los hashes. R3 y R4 citan su commit `test` y el `feat (R2,R3,R4)`.
- [ ] `progress/impl_nutrition-kcal-consumed.md` completo (rojos, verdes,
      recuentos, `exit=0`). **No** tocar `progress/current.md`,
      `progress/history.md` ni `feature_list.json`; **no** abrir PR ni
      mergear: eso es del leader tras el `reviewer`.
