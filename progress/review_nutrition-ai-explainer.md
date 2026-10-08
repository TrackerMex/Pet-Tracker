# review: nutrition-ai-explainer (#18, proveedor Anthropic)
Fecha: 2026-10-08
HEAD revisado: 5575c5f2 · H0: 704af9e5 · firma de la spec: 1837ab0a
Veredicto: **RECHAZADO**

Motivo, en una línea: 9 mutaciones de producción sobreviven en verde. 7 de
ellas tocan cláusulas que exige la spec (orden de selección R3/R5, argumentos
de la rama positiva de R5 y el «nunca una excepción» de R11). El origen está en
las prescripciones *Test* de `requirements.md`. Codex hizo lo prescrito y la
producción de hoy es correcta, pero estos candados no vigilan las cláusulas.
Mismo patrón que #147 E2 (memoria «cláusulas universales candadas en un caso»).
La vía es una enmienda del leader con un candado por cada rama, seguida de otra
ronda de Codex.

**R19 (prueba de humo con clave real) sigue pendiente del humano.** Este review
no la cubre ni la da por cumplida. La casilla de §Aprobación sigue `[ ]`.

---

## Checklist C2: estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json`: `18 nutrition-ai-explainer`.
- [x] `progress/current.md` describe #18 (branch, worktree, firma 1837ab0a, handoff).

## Checklist C3: arquitectura
- [x] `domain/ports/nutrition-explainer.ts` es puro: Symbol, tipos e interfaz, sin imports de infraestructura.
- [x] `domain/repositories/nutrition.repository.ts` es una interfaz pura con `setAiExplanation` como sexto método.
- [x] El use-case depende de `NUTRITION_EXPLAINER`, `SUBSCRIPTION_REPOSITORY` y la interfaz del repositorio, no de los adaptadores ni de `ConfigService`.
- [x] Infraestructura sin lógica de negocio. El factory es el único lector de `ANTHROPIC_*` (A14 = solo factory.ts). Los adaptadores no inyectan `ConfigService`.

## Checklist C4: TDD
- [x] Cada R1–R18 tiene un test que nombra `R<n> (nutrition-ai-explainer #18)`. R2 y R4 se cubren con aserciones del `it` de R1, como declara traceability; R4 además con `env-drift.test.mjs`.
- [x] El orden de los 34 commits respeta el handoff: cada `test(...)` precede a su `feat(...)`. Se omiten el 27 y el 31, que son guardas nacidas verdes (R14 y R16-unit) acreditadas con sondas en impl §Sondas, líneas 5303 y 5344, ambas con exit=1 por aserción.
- [x] Rojos verificados por mí en worktrees temporales `/tmp/rev18-<hash>`, con node_modules enlazado y borrados después (§Sondas, tabla A). Todos fallan por aserción o por el `throw` `not implemented (Rn)` de una firma mínima, que permite el handoff (líneas 164–167). Ninguno falla por ReferenceError ni TypeError del test.
- [ ] **Los candados cubren las cláusulas que dicen cubrir: NO.** Ver F1–F3: 7 mutaciones sobre cláusulas de R3, R5 y R11 pasan en verde.

## Checklist C5: trazabilidad
- [x] Ninguna fila dice "pendiente" salvo R19 (`pendiente — gate humano`), que es lo esperado.
- [x] Los 31 hashes citados existen (`git cat-file -e`) y son ancestros de HEAD (`git merge-base --is-ancestor`): 31/31.
- [x] Los commits siguen `test|feat|build|docs(nutrition-ai-explainer): … (Rn)`.

## Checklist C6: spec aprobada
- [x] `requirements.md` tiene `status: approved`, con la casilla `[x] Aprobado por humano (fecha: 2026-10-08)` (firma 1837ab0a, vía Notion).
- [ ] Casilla de R19: sin marcar, como corresponde. Es un gate humano y sigue pendiente.

## Checklist C7: sin código huérfano
- [x] La implementación OpenAI anterior nunca se mergeó. No quedan `openai` ni `OPENAI_` en src, test ni package.json, salvo las aserciones negativas de `nutrition-scope.spec.ts:22-25`.
- [x] El bloque R26 de #17 (sin IA) se derogó en el commit rojo de R1 (2047dfc4). El e2e se renombró a R5.

---

## Hallazgos que bloquean

### F1 (Media; riesgo de seguridad si regresa). Los argumentos de la rama positiva de R5 no tienen candado
- Producción: `backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts:23`, `new AnthropicNutritionExplainer(model, key, null)`.
- Test: `nutrition-explainer.factory.spec.ts:23` (R3 anti-vacío) y `:68` (R5 fila positiva). Solo comprueban `toBeInstanceOf(AnthropicNutritionExplainer)`.
- Mutaciones que pasan en verde:
  - `new AnthropicNutritionExplainer(key, model, null)`: exit 0, 18/18.
  - `new AnthropicNutritionExplainer(model.trim()+'x', key, null)`: exit 0, 18/18.
- Consecuencia si regresa: los dos parámetros son `string` y tsc no protege. En producción la clave viajaría como `model`, el proveedor respondería con un 4xx y el warn de R11 (`message: error.message`) podría reproducir el modelo inválido, que sería la clave, en el log. Además la explicación moriría en silencio. Ningún test automático ejecuta esta rama con valores reales; solo R19, una vez.
- Origen: el *Test* de R5 en `requirements.md` (§R5, «fila positiva: las cuatro cumplidas ⇒ `toBeInstanceOf(AnthropicNutritionExplainer)`») y el anti-vacío de R3.
- Reproducir: `cd backend-pet-tracker && pnpm exec jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`, tras cambiar la línea 23 como arriba.

### F2 (Media). El «en este orden» de R5 y el «antes que cualquier otra condición» de R3 solo tienen candado para el par 1<3
- Producción: `nutrition-explainer.factory.ts:9-22`.
- Test: `nutrition-explainer.factory.spec.ts:31` (`it.each`). Cada fila cumple todas las demás condiciones, así que una sola condición falla. La única fila de orden es `:61` (NODE_ENV=test con la clave PENDING).
- Mutaciones que pasan en verde, todas con exit 0 y 18/18:
  - guarda `NODE_ENV` movida detrás del gate `ANTHROPIC_ENABLED` (viola R3.1, «evaluado antes que cualquier otra condición de R5»);
  - comprobación de la clave (`typeof key !== 'string'`) antes del gate `ANTHROPIC_ENABLED` (orden 3<2);
  - gate `ANTHROPIC_ENABLED` movido al final, detrás de la clave y del modelo (orden 2 al último lugar);
  - comprobación del modelo antes que la de la clave (orden 4<3).
- Consecuencia: el `reason` del log sale equivocado cuando falla más de una condición. Con la configuración por defecto de `.env.example` (sin `ANTHROPIC_ENABLED` y la clave `PENDING`) y el gate movido al final, el warn dice `key-missing` en vez de `not-enabled`. `reason` existe precisamente para que el humano distinga causas en R19 (§R5 de requirements). No cuesta dinero: ninguna de las cuatro mutaciones construye cliente en test.
- Origen: el *Test* de R5 («una fila por rama, cada una con todas las demás condiciones cumplidas» más una sola fila de orden) y el *Test* de R3 (solo NODE_ENV=test con todo válido).
- Reproducir: el mismo comando que en F1, tras reordenar los `if` de `factory.ts:9-22` como se describe.

### F3 (Media). El «nunca una excepción» de R11 no vigila la carga perezosa del SDK
- Producción: `anthropic-nutrition-explainer.ts:45-53`. El `await import('@anthropic-ai/sdk')` y el `new Anthropic({...})` están dentro del `try`, que es lo correcto hoy.
- Test: `anthropic-nutrition-explainer.spec.ts:87` (R9, texto fuente) comprueba `apiKey: this.apiKey`, `timeout: NUTRITION_AI_TIMEOUT_MS` y `maxRetries: NUTRITION_AI_MAX_RETRIES`, pero no que la inicialización esté dentro del `try`. Todos los tests inyectan un doble (cliente distinto de null), así que el camino perezoso no se ejecuta nunca, por diseño de R3.
- Mutación que pasa en verde: sacar el bloque `if (this.client === null) { … }` fuera y por encima del `try`. Exit 0, 25/25.
- Consecuencia si regresa: un fallo de `import` o del constructor (paquete ausente en el bundle, error de opciones) se propaga desde `generate` **después** del INSERT y devuelve un 500, lo que viola R11.
- Origen: el *Test* de R9 y R11. La única vía permitida sin importar el SDK (aserción 12 de R1, A47) es el texto fuente, y no fija la posición respecto del `try`.
- Reproducir: `pnpm exec jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`, tras la mutación.

## Hallazgos que no bloquean por sí solos (conviene cerrarlos en la misma enmienda)

### F4 (Baja). El caso «content no es un array» de R10 solo tiene candado con `null`
- `anthropic-nutrition-explainer.ts:60` usa `Array.isArray(response.content)`. El test (`spec.ts:153`) solo tiene la fila `content: null`.
- Mutación `response.content != null`: exit 0, 25/25. Con `content` como string u objeto, el `.filter` lanza, el `catch` emite el warn con forma R11 (`message: '… is not a function'`) en vez de `'ai explanation unusable'` con `stopReason` y `usage`, y devuelve `null`. El resultado coincide; el log no cumple R10.

### F5 (Baja, informativo). El filtro `type === 'text'` de R10 no es observable con los fixtures prescritos
- Si se borra `.filter((block) => block.type === 'text')` (`anthropic-nutrition-explainer.ts:64`), da exit 0, 25/25. Los fixtures `thinking` no traen campo `text`, así que `text ?? ''` neutraliza la mutación. Solo un bloque no-text con propiedad `text` lo cubriría. Hoy no tiene impacto con las formas reales del SDK.

## Observaciones menores (no bloquean)
- O1. El commit 21 (`d5c6d16c`, feat R17) reformatea `test/meal-times.e2e-spec.ts:922-923` a una línea con `// prettier-ignore` para que A44 dé 1. La semántica no cambia y lo declara impl §Decisiones.
- O2. `nutrition.drizzle.repository.ts:38`: `toPlan(row)` sin guarda si la fila desaparece entre INSERT y UPDATE (borrado de la mascota en mitad de la llamada); el resultado sería un TypeError y un 500. `insertPlan` (`:102`) ya seguía ese mismo patrón. La spec no lo cubre.
- O3. El recorte de R8 (`.slice(0, 100)` por unidades UTF-16) puede partir un par sustituto (emoji) en el carácter 100. Trivial.
- O4. La sonda R13-reread falla por `TypeError` (el doble de `db` no tiene `select`) en lugar de por aserción. Falla cerrado, se acepta.

---

## Sondas

Todas se ejecutaron en `/home/claude/sites/Pet-Tracker-wt-18/backend-pet-tracker` con `pnpm exec jest <spec>`. Tras cada una:
- `git checkout HEAD -- <archivo>`;
- `git diff --exit-code` = 0;
- `git diff --cached --exit-code` = 0;
- `git status --short` vacío, salvo este reporte, que no está trackeado.

Todas restauraron limpio. Scripts en el scratchpad de la sesión: `probe.sh` y `mut.py`, con una sola sustitución por sonda y el ancla verificada como única.

### A. Rojos de C4 (worktree temporal por commit, borrado después)
| Commit | Spec | exit | Causa del rojo |
|---|---|---|---|
| 20b3ce7b (R9) | anthropic-nutrition-explainer.spec.ts | 1 | `not implemented (R9)` y `toContain('apiKey: this.apiKey')` |
| a589818c (R3) | nutrition-explainer.factory.spec.ts | 1 | Expected "node-env-test", Received "not-enabled"; Expected constructor Anthropic, Received Null |
| f1bc9aaf (R5) | infrastructure/ai | 1 | 17 rojos: Expected constructor Null, Received Anthropic; warn no emitido |
| 8a32bbba (R13) | nutrition.drizzle.repository.spec.ts | 1 | `not implemented (R13)` (firma mínima permitida) |
| c58292d6 (R12) | generate-nutrition-plan.use-case.spec.ts | 1 | Expected number of calls: 1, Received 0; `not implemented (R12)` |
| ca3108e9 (R15) | generate-nutrition-plan.use-case.spec.ts | 1 | 2 rojos R15 (calls 1 vs 0); 7 verdes |

### B. Mutaciones de producción que el test **detecta** (rojo esperado)
| Sonda | Archivo | jest exit | Tests |
|---|---|---|---|
| R3-guard-removed | factory.ts | 1 | 3 failed / 18 |
| R5-enabled-trim (`?.trim()`) | factory.ts | 1 | 1 failed (`' true'`) |
| R5-enabled-lower (`?.toLowerCase()`) | factory.ts | 1 | 1 failed (`'TRUE'`) |
| R5-pending-untrimmed | factory.ts | 1 | 1 failed (`' PENDING '`) |
| R5-pending-dropped | factory.ts | 1 | 2 failed |
| R5-key-blank-untrimmed | factory.ts | 1 | 1 failed |
| R5-model-untrimmed | factory.ts | 1 | 1 failed |
| R5-model-check-dropped | factory.ts | 1 | 3 failed |
| R5-reason-swap (model→key-missing) | factory.ts | 1 | 3 failed |
| R5-enabled-removed | factory.ts | 1 | 5 failed |
| R5null-double-warn | null-nutrition-explainer.ts | 1 | 4 failed / 4 |
| R5null-reason-dropped | null-nutrition-explainer.ts | 1 | 4 failed |
| R5null-reason-fixed | null-nutrition-explainer.ts | 1 | 3 failed |
| R5null-extra-field (`input`) | null-nutrition-explainer.ts | 1 | 4 failed |
| R6-prompt-char (nutrición→nutricion) | nutrition-prompt.ts | 1 | R6 rojo; también R9 rojo |
| R6-date-comment | nutrition-prompt.ts | 1 | 1 failed |
| R7-input-spread | nutrition-prompt.ts | 1 | 2 failed |
| R7-result-spread | nutrition-prompt.ts | 1 | 2 failed |
| R7-drop-key | nutrition-prompt.ts | 1 | 1 failed |
| R8-items-21 | nutrition-prompt.ts | 1 | 3 failed |
| R8-chars-101 | nutrition-prompt.ts | 1 | 3 failed |
| R8-diseases-uncapped | nutrition-prompt.ts | 1 | 1 failed |
| R8-tail-not-head | nutrition-prompt.ts | 1 | 1 failed |
| R9-extra-key (`temperature: 0`) | anthropic-…ts | 1 | 1 failed |
| R9-system-in-messages | anthropic-…ts | 1 | 1 failed |
| R9-apikey-model | anthropic-…ts | 1 | 1 failed |
| R9-timeout-literal | anthropic-…ts | 1 | 1 failed |
| R9-timeout-const 30_000 | anthropic-…ts | 1 | 1 failed |
| R9-maxtokens-const 4_096 | anthropic-…ts | 1 | 2 failed |
| R9-retries-const 2 | anthropic-…ts | 1 | 1 failed |
| R10-usage-raw (sin `?? null`) | anthropic-…ts | 1 | 1 failed |
| R10-stop-not-max | anthropic-…ts | 1 | 6 failed |
| R10-join-newline | anthropic-…ts | 1 | 1 failed |
| R10-no-trim | anthropic-…ts | 1 | 2 failed |
| R10-no-warn | anthropic-…ts | 1 | 12 failed |
| R10-first-block-only | anthropic-…ts | 1 | 1 failed |
| R11-string-error | anthropic-…ts | 1 | 6 failed |
| R11-key-in-log | anthropic-…ts | 1 | 7 failed |
| R11-input-in-log | anthropic-…ts | 1 | 7 failed |
| R11-rethrow | anthropic-…ts | 1 | 7 failed |
| R11-double-warn | anthropic-…ts | 1 | 7 failed |
| R12-plan-leak (`plan` sin toPlanResult) | use-case.ts | 1 | 2 failed |
| R12-raw-result (resultado del motor) | use-case.ts | 1 | 1 failed |
| R12-return-inserted (no devuelve UPDATE) | use-case.ts | 1 | 3 failed |
| R12-initial-empty (`''` en INSERT) | use-case.ts | 1 | 1 failed |
| R12-ctx-planid (planId=petId) | use-case.ts | 1 | 2 failed |
| R12-update-other-id | use-case.ts | 1 | 2 failed |
| R14-gate-after (entitlement tras explain) | use-case.ts | 1 | 3 failed |
| R14-gate-removed | use-case.ts | 1 | 3 failed |
| R14-gate-inverted | use-case.ts | 1 | 8 failed |
| R15-hit-null-reinserts | use-case.ts | 1 | 3 failed |
| R15-engine-schedule | use-case.ts | 1 | 3 failed |
| R16-no-short-circuit | use-case.ts | 1 | 1 failed |
| R16-checks-entitlement | use-case.ts | 1 | 1 failed |
| R13-where-petid | drizzle.repository.ts | 1 | 1 failed (toEqual del where) |
| R13-extra-column | drizzle.repository.ts | 1 | 1 failed |
| R13-reread | drizzle.repository.ts | 1 | 1 failed (TypeError del doble, O4) |
| R17-mapper-null | nutrition.mapper.ts | 1 | 2 failed |

### C. Mutaciones que **sobreviven** (verde, exit 0)
| Sonda | Archivo:línea | jest exit | Hallazgo |
|---|---|---|---|
| R5-args-swapped `(key, model, null)` | factory.ts:23 | 0 (18/18) | F1 |
| R5-model-altered `(model.trim()+'x', …)` | factory.ts:23 | 0 (18/18) | F1 |
| R3-guard-reordered (NODE_ENV tras ENABLED) | factory.ts:9-12 | 0 (18/18) | F2 |
| R5-key-before-enabled | factory.ts:11-13 | 0 (18/18) | F2 |
| R5-enabled-truly-last | factory.ts:11-22 | 0 (18/18) | F2 |
| R5-model-before-key | factory.ts:13-22 | 0 (18/18) | F2 |
| R11-lazy-init-outside-try | anthropic-…ts:45-53 | 0 (25/25) | F3 |
| R10-content-nonarray (`!= null`) | anthropic-…ts:60 | 0 (25/25) | F4 |
| R10-no-filter | anthropic-…ts:64 | 0 (25/25) | F5 |

No corrí sondas e2e propias para no competir por el Postgres compartido con wt-157. Los candados e2e de R13, R16 y R18 se acreditan con impl §Sondas (líneas 5397, 5438 y 5478) y con el init.sh en verde.

---

## Otras verificaciones
- **Alcance**: el diff `704af9e5..5575c5f2` toca 30 archivos, igual que la lista cerrada del handoff. No hay `sk-ant-` en el diff. `.env.example` conserva `ANTHROPIC_API_KEY=PENDING`.
- **Aislamiento por usuario**: el `planId` viene del plan recién insertado o del `latestPlan` del `petId` ya autorizado por el controller. `setAiExplanation` actualiza `where id = planId`, con candado unitario (R13-where-petid en rojo) y e2e. Los logs de los dos adaptadores llevan solo `scope`, `petId`, `planId`, `message` y `reason` o `stopReason`/`usage`. No llevan clave, alergias ni prompt (R11-key-in-log y R11-input-in-log en rojo).
- **P5 contrastado con el SDK 0.128.0** (`node_modules/@anthropic-ai/sdk/src/client.ts`): `:616` tiene `baseURL = readEnv('ANTHROPIC_BASE_URL')`. En `:627-628`, `authToken` se lee de `ANTHROPIC_AUTH_TOKEN` cuando no se pasa, aunque haya `apiKey` explícito. En `:945`, `authHeaders` combina `apiKeyAuth` y `bearerAuth`. Lo que afirma el reporte es exacto.
- **Export por defecto de R9**: `index.d.mts:1` es `export { Anthropic as default } from "./client.mjs";`, como afirma el reporte.
- **Anclas negativas A1–A53**, medidas por mí: todas coinciden con la columna «Tras #18». Valores: A1=0, A2=1, A3=27, A4=3, A5=0, A6=3, A7=1, A8=1, A9=19, A10=1, A11=2, A12=0, A13=nutrition-scope.spec.ts, A14=solo factory.ts, A15=1, A16=6, A17=3 specs previas + use-case.spec, A18 vacío, A19=0, A20–A21=1, A22=0, A23–A27=1, A28=2, A29–A31=1, A32=5, A33–A36=1, A37=2, A38=0, A39=1, A40=0, A41 vacío, A42=1, A43=0, A44=1, A45=1, A46=4, A47 vacío, A48=1, A49=0, A50=0, A51=1, A52=0, A53 vacío.

## Output de ./init.sh (corrido por el leader en 5575c5f2, sin pipe, exit=0)
Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/6ed2d261-8457-4604-a236-240be5b8271d/scratchpad/init18.log`. Lo leí y coincide con lo esperado:
```
⚠️    gates ausentes (apagan features enteras en silencio): ANTHROPIC_ENABLED      (esperado, .env local)
⚠️    configuración ausente: ANTHROPIC_API_KEY, ANTHROPIC_MODEL, RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
backend unit:  Test Suites: 183 passed, 183 total · Tests: 1431 passed, 1431 total
env-drift:     Test Suites: 2 passed · Tests: 14 passed
mobile unit:   Test Suites: 96 passed, 96 total · Tests: 2275 passed, 2275 total
e2e:           Test Suites: 3 skipped, 30 passed, 30 of 33 total · Tests: 8 skipped, 444 passed, 452 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
No hay ninguna línea `FAIL` en el log. Tras init.sh el árbol de wt-18 está limpio (el `eslint --fix` no dejó cambios).

## Qué tiene que pasar para aprobar
1. El leader enmienda las prescripciones *Test* de R3, R5, R9/R11 y R10 para que cada rama de F1–F4 tenga su candado (F5 es opcional), y el humano firma la enmienda.
2. Codex añade esos candados, cada uno con su rojo (la mutación de producción versionada en el commit rojo y revertida en el verde, según C4 punto 4) o con su sonda documentada.
3. Reviewer de nuevo: las 9 sondas de la tabla C deben quedar en rojo y la tabla B debe seguir en rojo.
4. R19 sigue siendo un gate humano independiente, pendiente.
