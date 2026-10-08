# Enmienda de spec — nutrition-ai-explainer (#18), 2026-10-08

Autor: `spec_author`. Worktree `Pet-Tracker-wt-18`, branch
`feature/18-nutrition-ai-explainer-claude`, base congelada `c4e6be8b`
(desde `origin/main` `36c8050d`). Spec en `specs/nutrition-ai-explainer/`
(`status: draft`, casillas de §Aprobación sin marcar).

## Preguntas abiertas (6)

Texto completo en `requirements.md` § Preguntas abiertas para el humano.

- **P4** — ¿Enviar `thinking` u `output_config.effort`? Su validez depende del
  modelo, que llega por env. En Haiku 5.5 el razonamiento adaptativo está
  activo por defecto y cuenta contra `max_tokens`. Por defecto no se envía
  nada; el `warn` de R10 deja `stopReason` y `usage` para decidir tras R19.
- **P5** — ¿El SDK TypeScript lee otras `ANTHROPIC_*` de `process.env` (p. ej.
  `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`) aunque reciba `apiKey`
  explícita? La skill no lo confirma para TS; Codex lo anota en `impl_`.
- **P6** — Versión fijada del SDK: `0.128.0` frente a la más reciente vista
  (`0.132.1`).
- **P7** — `plans/presupuesto-produccion.md` sigue presupuestando GPT-5 mini
  (A11 = 2). No se edita; decide el humano.
- **P8** — Explicación heredada tras editar horarios (#103): el plan editado
  conserva la explicación del plan anterior.
- **P9** — ¿Proyección del plan persistido (`toPlanResult`) en lugar de
  `computePlan` para el prompt? La spec elige la proyección; confirmar.

## Hechos falsos de la spec vieja y del explore (E-4)

Medidos en `c4e6be8b`; comando que lo demuestra entre paréntesis.

1. Canario de `env-drift.test.mjs` = 24, no 21; destino 27 (A1, A2).
2. Anclas de `docs/conventions.md` por línea desfasadas; `PUSH_ENABLED` en
   543 hoy (`grep -n '^. `PUSH_ENABLED` ' docs/conventions.md`); se ancla por
   contenido (A7).
3. `aiExplanation: null` del mapper no está en la línea 63 (A19).
4. Bloques R25 y R19 de #17 no están en las líneas citadas (A42).
5. `grep -rn 'gpt-' src/` → 0 era falso: el propio `nutrition-scope.spec.ts`
   lo contiene (A13).
6. `NutritionRepository` tiene 5 métodos, no 4 (A16).
7. `insertPlan` del use-case añade `carriedSchedule` y `engineMealsPerDay`
   (A25).
8. `computePlan(input)` ya no equivale al plan persistido tras #103 (A25, A26).
9. `test/meal-times.e2e-spec.ts` asevera `aiExplanation: null` sobre una fila
   con `'explicacion previa'` (A43).
10. `GET nutrition-plan` devuelve 13 claves, no 11
    (`grep -c 'servedToday\|kcalConsumedToday' $NUT/infrastructure/mappers/nutrition.mapper.ts` → 5).
11. Precedente de log con `petId` es `toMatchObject({ petId: PET_B })` (A36).
12. Anclas del explore por número de línea (`devices.module.ts:19`,
    `claim-device.use-case.ts:43`) sustituidas por contenido (A30, A31).
13. `env-drift.test.mjs` no es intocable: cambia una línea (A1, A2).
14. `generate-nutrition-plan.use-case.spec.ts` no existe en la base
    (`test -e $NUT/application/use-cases/generate-nutrition-plan.use-case.spec.ts` falla).
15. `.gitignore` "línea 16": se ancla por contenido (A8).

## Anclas (E-5), re-ejecutadas en el worktree antes del commit

Desde la raíz del repo, con `BE=backend-pet-tracker` y
`NUT=backend-pet-tracker/src/modules/nutrition`. `\|` es el escape de Markdown
de `|`. Columna "Salida medida" = salida real de esta ejecución.

| # | Comando | Salida medida | Tras #18 |
|---|---|---|---|
| A1 | `grep -cF 'assert.equal(keys.length, 24);' env-drift.test.mjs` | 1 | 0 |
| A2 | `grep -cF 'assert.equal(keys.length, 27);' env-drift.test.mjs` | 0 | 1 |
| A3 | `grep -cE '^[A-Z_]+=' .env.example` | 24 | 27 |
| A4 | `grep -cE '^ANTHROPIC_' .env.example` | 0 | 3 |
| A5 | `grep -cE '^OPENAI_' .env.example` | 0 | 0 |
| A6 | ``grep -c '^. `ANTHROPIC_[A-Z_]*` ' docs/conventions.md`` | 0 | 3 |
| A7 | ``grep -c '^. `PUSH_ENABLED` ' docs/conventions.md`` | 1 | 1 |
| A8 | `grep -cx '.env' .gitignore` | 1 | 1 |
| A9 | `grep -c '^### Feature ' docs/verification.md` | 18 | 19 |
| A10 | `grep -cF '### Feature 18 — nutrition-ai-explainer' docs/verification.md` | 0 | 1 |
| A11 | `grep -cF 'GPT-5 mini' plans/presupuesto-produccion.md` | 2 | 2 (no se edita, P7) |
| A12 | `grep -rF 'claude-' $BE/src/ \| wc -l` | 0 | 0 |
| A13 | `grep -rlF 'gpt-' $BE/src/` | $NUT/nutrition-scope.spec.ts | `nutrition-scope.spec.ts` |
| A14 | `grep -rlF 'ANTHROPIC_' $BE/src/ --include=*.ts \| grep -v '\.spec\.ts$'` | (vacío) | `$NUT/infrastructure/ai/nutrition-explainer.factory.ts` |
| A15 | `grep -cF '"@anthropic-ai/sdk": "0.128.0"' $BE/package.json` | 0 | 1 |
| A16 | `grep -cE '^  [a-zA-Z]+\(' $NUT/domain/repositories/nutrition.repository.ts` | 5 | 6 |
| A17 | `grep -rlF 'as unknown as NutritionRepository' $BE/src/` | $NUT/application/use-cases/add-meal-time.use-case.spec.ts, $NUT/application/use-cases/serve-meal.use-case.spec.ts, $NUT/application/use-cases/move-meal-time.use-case.spec.ts | libre (el cast no rompe al añadir un método) |
| A18 | `grep -rlF 'MockOf' $NUT/` | (vacío) | (vacío) |
| A19 | `grep -cF 'aiExplanation: null,' $NUT/infrastructure/mappers/nutrition.mapper.ts` | 1 | 0 |
| A20 | `grep -cF 'aiExplanation: plan.aiExplanation,' $NUT/infrastructure/mappers/nutrition.mapper.ts` | 0 | 1 |
| A21 | `grep -cF 'aiExplanation: row.aiExplanation ?? null' $NUT/infrastructure/repositories/nutrition.drizzle.repository.ts` | 1 | ≥ 1 |
| A22 | `grep -cF 'imports: [PetsModule],' $NUT/nutrition.module.ts` | 1 | 0 |
| A23 | `grep -cF 'imports: [PetsModule, SubscriptionsModule, ConfigModule],' $NUT/nutrition.module.ts` | 0 | 1 |
| A24 | `grep -cF 'latestPlan?.inputsHash === inputsHash' $NUT/application/use-cases/generate-nutrition-plan.use-case.ts` | 1 | libre |
| A25 | `grep -cF '...carriedSchedule(latestPlan, result),' $NUT/application/use-cases/generate-nutrition-plan.use-case.ts` | 1 | 1 |
| A26 | `grep -cF 'aiExplanation: plan.aiExplanation' $NUT/domain/entities/nutrition-plan.entity.ts` | 1 | ≥ 1 (`copyWithMealTimes` intacto) |
| A27 | `grep -cF 'export function toPlanResult(' $NUT/domain/entities/nutrition-plan.entity.ts` | 0 | 1 |
| A28 | `grep -cF 'z.array(z.string())' $NUT/application/dto/nutrition-profile.dto.ts` | 2 | 2 (DTO intacto) |
| A29 | `grep -c 'ai_explanation' $BE/src/db/migrations/0013_wet_may_parker.sql` | 1 | 1 (sin migración nueva) |
| A30 | `grep -cF '@Inject(SUBSCRIPTION_REPOSITORY)' $BE/src/modules/devices/application/use-cases/claim-device.use-case.ts` | 1 | 1 (patrón a copiar) |
| A31 | `grep -cF 'exports: [SUBSCRIPTION_REPOSITORY, PetTrackingGuard]' $BE/src/modules/subscriptions/subscriptions.module.ts` | 1 | 1 |
| A32 | `grep -rlF "this.config.get<string>('NODE_ENV') !== 'test'" $BE/src/ \| wc -l` | 5 | libre (precedente de la guarda) |
| A33 | `grep -cF 'export function redactToken' $BE/src/workers/notifier/notifier.constants.ts` | 1 | 1 (precedente de redacción) |
| A34 | `grep -cF "await import('expo-server-sdk')" $BE/src/workers/notifier/expo-push-sender.ts` | 1 | 1 (precedente de import perezoso) |
| A35 | `grep -cF "const WIALON_TOKEN_PENDING = 'PENDING';" $BE/src/integrations/wialon/wialon.factory.ts` | 1 | 1 (precedente del centinela) |
| A36 | `grep -cF 'toMatchObject({ petId: PET_B })' $BE/src/modules/activity/application/use-cases/aggregate-daily-activity.use-case.spec.ts` | 1 | 1 (precedente de `petId` en log) |
| A37 | `grep -cF 'spyOn(Logger.prototype' $BE/src/modules/activity/application/use-cases/aggregate-daily-activity.use-case.spec.ts` | 2 | 2 (patrón del espía de `warn`) |
| A38 | `grep -cF "describe('R26 (nutrition-profile-engine #17): sin dependencia openai ni env OPENAI_'" $NUT/nutrition-scope.spec.ts` | 1 | 0 |
| A39 | `grep -cF "describe('R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo'" $NUT/nutrition-scope.spec.ts` | 0 | 1 |
| A40 | `grep -cF "describe('R26 (nutrition-profile-engine #17): aiExplanation es null'" $BE/test/nutrition.e2e-spec.ts` | 1 | 0 |
| A41 | `grep -rlF 'must not leak while feature 17 is active' $BE/test/` | $BE/test/nutrition.e2e-spec.ts | (vacío) |
| A42 | `grep -cF "not.toContain('DEVICE_SUBSCRIPTION_REQUIRED')" $BE/test/nutrition.e2e-spec.ts` | 1 | 1 |
| A43 | `grep -cF "toHaveProperty('aiExplanation', null)" $BE/test/meal-times.e2e-spec.ts` | 1 | 0 |
| A44 | `grep -cF "toHaveProperty('aiExplanation', 'explicacion previa')" $BE/test/meal-times.e2e-spec.ts` | 0 | 1 |
| A45 | `grep -cF 'imports: [AppModule],' $BE/test/nutrition.e2e-spec.ts` | 1 | 1 |
| A46 | `grep -cF '"@aws-sdk/client-' $BE/package.json` | 4 | 4 (no hay cliente SSM) |
| A47 | `grep -rlE "from '@anthropic-ai/sdk'\|import\('@anthropic-ai/sdk'\)" $BE/src $BE/test --include=*spec.ts` | (vacío) | (vacío) |
| A48 | `grep -cF "await import('@anthropic-ai/sdk')" $NUT/infrastructure/ai/anthropic-nutrition-explainer.ts` | (vacío) | 1 |
| A49 | `grep -cF "from '@anthropic-ai/sdk'" $NUT/infrastructure/ai/anthropic-nutrition-explainer.ts` | (vacío) | 0 |
| A50 | `grep -cF 'maxRetries: 0' $NUT/infrastructure/ai/anthropic-nutrition-explainer.ts` | (vacío) | 0 |
| A51 | `grep -cF "'PENDING'" $NUT/infrastructure/ai/nutrition-explainer.factory.ts` | (vacío) | 1 |
| A52 | `grep -cF '.explain(' $NUT/infrastructure/ai/nutrition-explainer.factory.spec.ts` | (vacío) | 0 |
| A53 | `grep -c 'process.env' $NUT/infrastructure/ai/*.ts $NUT/domain/ports/nutrition-explainer.ts \| grep -v ':0$'` | (vacío) | (vacío) |
