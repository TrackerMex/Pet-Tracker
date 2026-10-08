# review: nutrition-ai-explainer (#18, proveedor Anthropic). Ronda 2 (enmienda E1)
Fecha: 2026-10-08
HEAD revisado: 8b0a74c2 · H0E1: 5b069b93 · firma E1: c4b86430 · ronda 1 (rechazo): c09ee51c
Veredicto: **APROBADO** (código y tests). **R19 sigue pendiente del humano.**

Motivo, en una línea: F1–F5 de la ronda 1 están cerrados. Las 9 mutaciones que
sobrevivían en c09ee51c (10 sondas en mi tabla, porque `args-swapped` va con y
sin trim) mueren contra HEAD. Las 18 sondas S-E1 de la impl dan los mismos
rojos que declara tasks.md §E1. Cada `test(...)` E1 es rojo por aserción y su
`fix(...)` lo vuelve verde, en commits separados. El init.sh del leader en
8b0a74c2 sale con exit=0.

**R19 (prueba de humo con clave real) queda fuera de este veredicto.** No la
corrí y no la doy por cumplida. La casilla `[ ] Prueba de humo con clave real…`
de §Aprobación sigue sin marcar, como corresponde. La feature no puede pasar a
`done` hasta que el humano la ejecute y la marque.

---

## Checklist C2: estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json`: `18 nutrition-ai-explainer`.
- [x] `progress/current.md` describe #18: branch `feature/18-nutrition-ai-explainer-claude`, rechazo de la ronda 1 en `5575c5f2`, enmienda E1 con firma c4b86430 y handoff E1 (E1-c1…E1-c18), solo unitario.

## Checklist C3: arquitectura
- [x] La ronda solo toca `infrastructure/ai/` (lista cerrada de 6 ficheros). El dominio y el use-case no cambian.
- [x] `AnthropicSdkLoader` es un tipo local del adaptador, con default `async () => await import('@anthropic-ai/sdk')`. No entra ninguna dependencia nueva en el dominio ni en la aplicación.
- [x] El factory sigue siendo el único lector de `ANTHROPIC_*`. Los adaptadores no inyectan `ConfigService`.

## Checklist C4: TDD
- [x] Todos los tests nuevos viven bajo `describe` que nombran `R3`, `R5`, `R10` o `R11 (nutrition-ai-explainer #18)`. Los de E1.3 llevan además `E1.3`.
- [x] Los rojos y verdes de E1-c1…E1-c17 los reproduje yo (tabla de abajo). Todos los rojos son de aserción (`toEqual`, `toBe`, `toBeNull` o `toHaveBeenCalledTimes`), ninguno es ReferenceError ni TypeError del test.
- [x] Cada rojo nace de una mutación de producción versionada en el commit `test(...)`, salvo E1-c3, cuyo rojo es la producción de c09ee51c. Los `fix(...)` restauran el texto de c09ee51c (c2), f7dc3072 (c6) y 7ef04fc7 (c9, c11, c13, c15 y c17), con diff 0 contra esa fuente.
- [x] E1-c7 (refactor del seam) va antes de su test por la excepción explícita de E1.3, que mantiene tsc en verde. Queda declarado en la impl (§Final E1).
- [x] **Los candados cubren las cláusulas que dicen cubrir: SÍ.** Ver §Mutaciones: no sobrevive ninguna sobre una rama que prescriban R3, R5, R10 o R11.
- [x] Ningún assert se quitó. Las únicas líneas `-` en los specs entre 5b069b93 y HEAD son los dos `toBeInstanceOf` de los anti-vacíos (sustituidos por `toBeInstanceOf` más `toEqual` de `constructorArgs`) y el ternario del `error` de R11 (ampliado con la rama `objeto`). La tabla B de la ronda 1 sigue en rojo: no se quitó ninguna aserción y el diff neto de producción contra c09ee51c es solo el seam de E1.3.

## C4 — rojos y verdes de E1-c1…E1-c17 reproducidos por el reviewer

Método: por cada commit, `git show <c>:<ruta> > <ruta>` de los 4 archivos de `$AI`
(los únicos tocados en la ronda), jest del spec con `--json`, y `git checkout HEAD -- <4 rutas>`.
Tras cada uno, `git diff --quiet` = 0 y `git diff --cached --quiet` = 0.

| Commit | Tipo | Spec | exit | Tests | Rojos y causa |
|---|---|---|---|---|---|
| 807b5662 E1-c1 | test | factory | 1 | 2 failed, 16 passed, 18 | los dos anti-vacíos, `toEqual` (llega `apiKey: 'modelo-de-prueba'`) |
| 8273dce8 E1-c2 | fix | factory | 0 | 18/18 | — |
| dca3aecd E1-c3 | test | factory | 1 | 1 failed, 18 passed, 19 | `pasa clave y modelo recortados (E1.1)`, `toEqual` (llega `'\t clave-de-prueba \n'`) |
| f7dc3072 E1-c4 | feat | factory | 0 | 19/19 | — |
| 34ee1311 E1-c5 | test | factory | 1 | 2 failed, 23 passed, 25 | `ANTHROPIC_ENABLED y ANTHROPIC_API_KEY…` (Received `key-missing`) y `…y ANTHROPIC_MODEL…` (Received `model-missing`), `toBe` |
| fa5df45b E1-c6 | fix | factory | 0 | 25/25 | — |
| 7ef04fc7 E1-c7 | refactor | factory y adaptador | 0 y 0 | 25/25 y 25/25 | — |
| 9d99df4c E1-c8 | test | adaptador | 1 | 2 failed, 26 passed, 28 | los dos primeros `it` de E1.3, `resolves.toBeNull()`: «Received promise rejected instead of resolved» |
| c4276761 E1-c9 | fix | adaptador | 0 | 28/28 | — |
| bdb097b9 E1-c10 | test | adaptador | 1 | 4 failed, 29 passed, 33 | content string/objeto/numero/array-like, `toEqual` del warn (llega `message: 'blocks.filter is not a function'`) |
| 9e2ef4ef E1-c11 | fix | adaptador | 0 | 33/33 | — |
| 76de3247 E1-c12 | test | adaptador | 1 | 2 failed, 33 passed, 35 | `anti-vacio: bloque no-text con text` (`toBe`, llega `'texto oculto Tu perro necesita...'`); `degrada solo bloque no-text con text` (`toBeNull`, llega `'no es explicacion'`) |
| ea01b8ac E1-c13 | fix | adaptador | 0 | 35/35 | — |
| 1344163b E1-c14 | test | adaptador | 1 | 1 failed, 35 passed, 36 | `degrada sin stop_reason…`, `toEqual` (`stopReason: undefined` frente a `null`) |
| 834619e4 E1-c15 | fix | adaptador | 0 | 36/36 | — |
| 54c74b78 E1-c16 | test | adaptador | 1 | 1 failed, 36 passed, 37 | `degrada objeto: [object Object]`, `toEqual` (llega `'no soy Error'`) |
| aba336be E1-c17 | fix | adaptador | 0 | 37/37 | — |

## Checklist C5: trazabilidad
- [x] Ninguna fila dice "pendiente" salvo R19 (`pendiente — gate humano`).
- [x] Hay filas E1.1, E1.2, E1.3, E1.4, E1.5, E1.7 y E1.8. E1.6 deroga texto aprobado y no lleva test. Los 17 hashes citados son ancestros de HEAD (`git merge-base --is-ancestor`): 17/17.
- [x] Los commits siguen `test|fix|feat|refactor|docs(nutrition-ai-explainer): … (Rn, E1.x)`.

## Checklist C6: spec aprobada
- [x] `requirements.md` tiene `status: approved`, con la casilla `[x] Enmienda E1 aprobada por humano (fecha: 2026-10-08)` (firma c4b86430, vía Notion).
- [ ] Casilla de R19: sin marcar, como corresponde. Es un gate humano y sigue pendiente.

## Checklist C7: sin código huérfano
- [x] Las variables `openai` y `OPENAI_` no aparecen en `src`, `test` ni `package.json`. Solo `nutrition-scope.spec.ts` las menciona, en sus aserciones negativas.
- [x] La ronda no reemplaza nada más. El seam sustituye al `import()` inline y no deja rastro del anterior.

---

## Ronda 1: hallazgos cerrados
| Hallazgo (c09ee51c) | Cierre | Evidencia contra HEAD |
|---|---|---|
| F1: argumentos de la rama positiva sin candado | E1.1: `toEqual` de `constructorArgs` con literales en los dos anti-vacíos, más el `it` del recorte | args-swapped, args-swapped-trim y model-altered dan 3 rojos cada uno; S-E1.1a…e en rojo |
| F2: orden de las guardas solo con el par 1<3 | E1.2: `it.each` de los 6 pares | guard-reordered, key-before-enabled y model-before-key dan 1 rojo cada uno; enabled-truly-last da 2 rojos (filas 4 y 5) |
| F3: la carga perezosa fuera del `try` | E1.3: seam `AnthropicSdkLoader` y 3 `it` | lazy-init-outside-try da 2 rojos («Received promise rejected instead of resolved»); S-E1.3a…c en rojo |
| F4: content que no es array, solo con `null` | E1.4: filas string, objeto, numero, undefined y array-like | content-nonarray da 4 rojos; S-E1.4a…d en rojo |
| F5: el filtro `type === 'text'` no se observaba | E1.5: bloque no-text con `text`, solo y combinado | no-filter da 2 rojos; S-E1.5a…c en rojo |

Además entran E1.7 (`stopReason ?? null` con fila `sin stop_reason`) y E1.8 (`instanceof Error` con fila `objeto`). Sus mutaciones versionadas, aplicadas contra HEAD, dan 1 rojo cada una.

---

## Mutaciones contra HEAD (8b0a74c2)

Método: script `mut.py`, una sustitución por mutación con el ancla verificada como única. Se corre jest del spec afectado con `--json` y `ANTHROPIC_BASE_URL=http://127.0.0.1:9`, y luego `git checkout HEAD -- <ruta>`. Tras las 43 mutaciones, `git diff --quiet -- backend-pet-tracker` = 0 y `git diff --cached --quiet` = 0 en todas.

### A. Supervivientes de la ronda 1: ahora mueren todas
| Mutación | Spec | exit | Rojos |
|---|---|---|---|
| R5-args-swapped `(key, model, null)` | factory | 1 | 3/25 (`toEqual`, llega `apiKey: 'modelo-de-prueba'`) |
| R5-args-swapped-trim `(key.trim(), model.trim(), null)` | factory | 1 | 3/25 |
| R5-model-altered `model.trim()+'x'` | factory | 1 | 3/25 |
| R3-guard-reordered (= S-E1.2a) | factory | 1 | 1/25 (`gana node-env-test`, llega `not-enabled`) |
| R5-key-before-enabled (= S-E1.2b) | factory | 1 | 1/25 (`gana not-enabled`, llega `key-missing`) |
| R5-enabled-truly-last | factory | 1 | 2/25 (pares ENABLED+KEY y ENABLED+MODEL) |
| R5-model-before-key (= S-E1.2c) | factory | 1 | 1/25 (`gana key-missing`, llega `model-missing`) |
| R11-lazy-init-outside-try | adaptador | 1 | 2/37 (los dos `degrada` de E1.3) |
| R10-content-nonarray `!= null` | adaptador | 1 | 4/37 (string, objeto, numero, array-like; `message: 'blocks.filter is not a function'`) |
| R10-no-filter | adaptador | 1 | 2/37 |

### B. Las 18 sondas de la impl (§Sondas E1), reproducidas por mí
La impl documenta 18 sondas. El handoff decía 17, pero eso fue un error de recuento del leader y no un defecto de Codex.
| Sonda | exit | Rojos | ¿Coincide con tasks.md §E1? |
|---|---|---|---|
| S-E1.1a | 1 | 3/25 | sí |
| S-E1.1b, c, d, e | 1 | 1/25 cada una (`pasa clave y modelo recortados (E1.1)`) | sí |
| S-E1.2a, b, c | 1 | 1/25 cada una | sí |
| S-E1.3a | 1 | 1/37 (`toHaveBeenCalledTimes(1)`, llegan 0) | sí |
| S-E1.3b | 1 | 1/37 | sí |
| S-E1.3c (import inline, sin seam) | 1 | 4/37 (los 3 de E1.3 y R9 `construye el cliente perezoso…`; el import real lanza `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` y no hay red) | sí |
| S-E1.4a | 1 | 5/37 | sí |
| S-E1.4b | 1 | 2/37 | sí |
| S-E1.4c, d | 1 | 1/37 cada una (array-like) | sí |
| S-E1.5a, b, c | 1 | 1/37 cada una (`degrada solo bloque no-text con text`) | sí |
| E1.7 versionada (`stopReason: response.stop_reason`) | 1 | 1/37 | sí |
| E1.8 versionada (duck-typing `message`) | 1 | 1/37 | sí |

### C. Barrido de las cláusulas universales de R3, R5, R10 y R11 (16 mutaciones mías)
| Mutación | exit | Resultado | Clasificación |
|---|---|---|---|
| X3: ENABLED con `toLowerCase()` | 1 | 1 rojo (fila `TRUE`) | muere |
| X3b: ENABLED con `trim()` | 1 | 1 rojo (fila ` true`) | muere |
| X6: modelo `model === ''` sin trim | 1 | 1 rojo (fila `'   '`) | muere |
| X7: clave `key === ''` sin trim | 1 | 1 rojo (fila `'   '`) | muere |
| X8: centinela sin trim | 1 | 1 rojo (fila `' PENDING '`) | muere |
| X14: `usage: response.usage` sin `?? null` | 1 | 1 rojo (`content null sin usage`) | muere |
| X15: `String(error)` cambiado por `'unknown'` | 1 | 2 rojos (string y objeto) | muere |
| X16: sin `.trim()` final | 1 | 2 rojos | muere |
| X18: `stop_reason !== 'max_tokens'` | 1 | 7 rojos | muere |
| X19: `.join(' ')` | 1 | 1 rojo (`dos bloques`) | muere |
| X5: 4º argumento (loader que lanza) en el factory | 0 | 25/25 | zona ciega declarada. La caza el ancla E1-A29 (`grep -cF` de la llamada literal con tres argumentos, que pasa a dar 0) |
| X1: NODE_ENV `=== 'test'` cambiado por `!== 'development'` | 0 | 25/25 | sobrevive. Ver O1 |
| X2: ENABLED acepta también `'yes'` | 0 | 25/25 | sobrevive. Ver O2 |
| X4: centinela con `toUpperCase()` | 0 | 25/25 | sobrevive. Ver O2 |
| X13: `text.length > 1` | 0 | 37/37 | sobrevive. Ver O3 |
| X17: `String(block.text)` en vez de `block.text ?? ''` | 0 | 37/37 | sobrevive. Ver O4 |

Ninguna superviviente está en una rama sin candado. Cada rama de R3, R5, R10 y R11 tiene al menos un candado que muere bajo mutación (tablas A, B y C). Las supervivientes muestrean un dominio infinito, un borde o un caso que la spec no prescribe. Por eso no bloquean.

**Candados tautológicos.** No hay. Los `toEqual` de E1.1 (`model: 'modelo-de-prueba', apiKey: 'clave-de-prueba', client: null`) y el de E1.3 (`[{ apiKey: 'clave-de-prueba', timeout: 15000, maxRetries: 0 }]`) usan literales y no importan constantes de producción. Una mutación de `NUTRITION_AI_TIMEOUT_MS` o de `NUTRITION_AI_MAX_RETRIES` los pone en rojo (S-E1.3c, y el R9 heredado).

---

## Observaciones (no bloquean)

Las cuatro siguen la letra de la spec. Son huecos de las prescripciones *Test*, no defectos de Codex. Si el leader decide registrar deuda, que copie los límites tal como están aquí.

- **O1. El lado «distinto de test» de R3.1 solo se muestrea con `'development'`.**
  - La producción es correcta: `nutrition-explainer.factory.ts:9` es `=== 'test'`, literal como dice R3.1.
  - Ninguna fila ni ancla fija el comparador. A32 cuenta la guarda `!==` de los schedulers, no esta.
  - Por eso `!== 'development'` pasa en verde, y con ese cambio `production` o un `NODE_ENV` ausente apagarían la IA en silencio. El repo no fija `NODE_ENV` fuera de `src` y `test`, y R19 probablemente corra en desarrollo, así que tampoco lo cazaría.
  - Cierre posible: que el anti-vacío de R3 recorra `['development', 'production']`. Es una línea.
- **O2. Muestreo de los continuos de R5.** «Cualquier otro valor apaga» está candado con las 5 filas prescritas (`undefined`, `'false'`, `'TRUE'`, `'1'` y `' true'`).
  - Aceptar `'yes'` (X2) sobrevive.
  - Comparar el centinela sin distinguir mayúsculas (X4) también, aunque no tiene impacto con claves reales `sk-ant-…`.
  - Ningún muestreo cierra un dominio infinito. El comparador `=== 'true'` lo fija el texto de R5, que no tiene ancla.
- **O3. Borde de R10 «vacío tras `trim()`».** Pasar a `text.length > 1` (X13) sobrevive porque ningún fixture trae un texto de un solo carácter. No tiene impacto práctico.
- **O4. Bloque `type: 'text'` sin campo `text`.** No lo prescribe R10 y el tipo del SDK lo excluye. El `?? ''` es defensivo y no tiene candado (X17).

---

## Otras verificaciones
- **Lista cerrada.** `git diff --name-only 5b069b93 8b0677b5` da los 6 ficheros del handoff. 8b0a74c2 solo añade §Final E1 a la impl (+197 líneas, 0 borradas).
- **Las 38 anclas E1 en HEAD**, medidas por mí, coinciden con la columna «tras E1»:
  - A1=1, A2=0, A3=1, A4=1, A5=1, A6=1, A7=1, A8=1, A9=0, A10=4, A11=1, A12=1, A13=0;
  - A14 a A21 = 1, A22=2, A23=2, A24=7, A25=2, A26=0, A27=0, A28=0, A29=1;
  - A30 a A33 = 1, A34=3, A35=3, A36=3, A37=1 (solo el spec del adaptador), A38=4.
- **Sin red, sin SDK en los tests.**
  - `grep -rn "claude-" backend-pet-tracker/src` da 0.
  - Ningún `*.spec.ts` ni `*.e2e-spec.ts` importa `@anthropic-ai/sdk` ni lo pasa por `jest.mock`. Solo aparece en el default del loader (`anthropic-nutrition-explainer.ts:50`) y en la cadena de versión de `nutrition-scope.spec.ts:30`.
  - Las sondas se corrieron con `ANTHROPIC_BASE_URL=http://127.0.0.1:9`. S-E1.3c demuestra que el import real ni siquiera llega a cargarse en jest.
- **tsc.** La impl declara `tsc --noEmit` con exit=0 y 0 errores en cada commit E1. El init.sh del leader lo confirma en HEAD.

## Output de ./init.sh (corrido por el leader en 8b0a74c2, sin pipe, exit=0)
Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/6ed2d261-8457-4604-a236-240be5b8271d/scratchpad/init_e1_8b0a74c2.log`. La primera línea es `8b0a74c270e5422a549d8d4b387483bb7296ce39`; arranca a las 2026-10-08T21:33:49Z y termina a las 21:38:23Z.
```
⚠️    gates ausentes (apagan features enteras en silencio): ANTHROPIC_ENABLED      (esperado, .env local)
⚠️    configuración ausente: ANTHROPIC_API_KEY, ANTHROPIC_MODEL, RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
backend unit:  Test Suites: 183 passed, 183 total · Tests: 1450 passed, 1450 total   (ronda 1: 1431; +7 factory, +12 adaptador)
env-drift:     Test Suites: 2 passed, 2 total · Tests: 14 passed, 14 total
mobile unit:   Test Suites: 96 passed, 96 total · Tests: 2275 passed, 2275 total
e2e:           Test Suites: 3 skipped, 30 passed, 30 of 33 total · Tests: 8 skipped, 444 passed, 452 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
exit=0
```
No hay ninguna línea `FAIL` en el log. No corrí init.sh ni ningún e2e, por instrucción del leader. El Postgres es compartido con wt-161.

## Qué falta para `done`
1. **R19**: el humano corre la prueba de humo con clave real (`docs/verification.md` § Feature 18) y marca su casilla en §Aprobación. Ni el reviewer ni ninguna IA pueden marcarla.
2. Opcional, a criterio del leader: registrar O1 como deuda, con sus límites tal como están aquí.
