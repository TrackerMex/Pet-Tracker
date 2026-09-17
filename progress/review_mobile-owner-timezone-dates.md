# review: mobile-owner-timezone-dates (#90)
Fecha: 2026-09-17 19:53 UTC
Veredicto: **APROBADO** (provisional emitido 2026-09-17 19:53 UTC pendiente de `./init.sh`; cerrado 2026-09-17 20:00 UTC con `./init.sh` EXIT=0, §8)

Dónde: worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch `feature/90-mobile-owner-timezone-dates`.
`git rev-parse HEAD origin/feature/90-mobile-owner-timezone-dates origin/main` → `274736de` = `274736de`, base `29689598`. `git status --short` vacío al empezar y al terminar (tras los checkouts del paso 1 y las sondas del paso 7). Skills cargadas: `expo:expo-overview`, `expo:expo-data-fetching`. Logs íntegros en el scratchpad de la sesión (`c4-*.log`, `r7-*.log`, `probe-*.log`).

---

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (`grep -c '"status": "in_progress"' feature_list.json` = 1, #90)
- [x] `progress/current.md` describe la sesión activa de #90 (worktree, baseline, coordinación con Frontend)

## Checklist C3 — Arquitectura
- [x] N/A backend: la feature no toca `backend-pet-tracker/` (diff vacío, §3). En móvil respeta `docs/conventions.md` §Convenciones de la app móvil: helper en `src/utils/` con test al lado, pantalla pre-#39 tocada sin migración en frío, sin dependencias nuevas.

## Checklist C4 — TDD
- [x] Cada R1-R6 tiene tests que lo nombran (`#90 R<n>` en describes nuevos; sufijo ` (#90 R<n>)` en los `it` editados); R7 es de verificación y se traza a comandos
- [x] Historial rojo→verde por R reproducido commit a commit (§1): 6 rojos reales o por mutación de producción, 6 verdes; ningún rojo por `ReferenceError`, `Cannot find module` ni mutación de un mock
- [x] R4 y R6 (verificación, vía b): mutaciones M4-i/M4-ii/M6 versionadas en el commit rojo y revertidas en el verde, con evidencia en §1 y §2

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas «pendiente» (el único match de `grep -in pendiente` es la línea 29 de la regla)
- [x] 13 hashes: `git cat-file -t` = commit y `git merge-base --is-ancestor <h> HEAD` = yes para todos (§9)
- [x] Commits `test(mobile-owner-timezone-dates): … (R<n>)` / `feat(…): … (R<n>)` / `docs(…): … (R7)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` frontmatter `status: approved`; `:549` `- [X] Aprobado por humano (fecha: 2026-09-17)`; P1 `- [X] P1 aceptada por humano (fecha: 2026-09-17)`; `design.md`, `tasks.md`, `traceability.md` también `approved`

## Checklist C7 — Sin código huérfano
- [x] `localTodayIso` de `weight-log.tsx:39-44` borrada (diff §6); `rg localTodayIso` en `weight-log.tsx` y su test → 0
- [x] Sus usos sustituidos por `civilTodayIso`; ningún test huérfano
- Nota (no bloqueante): `tasks.md` R3(3) pide `rg -n "localTodayIso" src → 0`, pero `src/app/(tabs)/health.tsx:28,63` tiene una copia **propia y preexistente** (`git show origin/main:…/health.tsx | grep localTodayIso` → `:28`, `:63`). No es código huérfano de esta feature: D-B (humano) cierra producción a `weight-log.tsx` + helper + catálogo y `health.tsx` no está en la lista cerrada. Codex acotó el grep a los dos ficheros correctos. Queda como deuda para el leader: `health.tsx` sigue calculando «hoy» con el dispositivo.

## Checklist C8 — UI móvil
- [x] Grep-clean en los ficheros tocados: `rg -n '#[0-9a-fA-F]{3,8}\b|StyleSheet\.create|\[[0-9]+px\]|shadow[A-Z]|elevation' 'src/app/(tabs)/weight-log.tsx' src/utils/civil-today-iso.ts src/i18n/catalog.ts` → exit 1 (0 matches)
- [x] Sin pantalla ni estilo nuevos (dimensiones, Skeleton, touch targets, animaciones: N/A, el JSX solo cambia `value`/`onChangeText` del `TextField` existente)
- [x] Copy nuevo vía `t()` (una sola llamada literal, `checkUses` = 1)

---

## 1. C4 — historial rojo→verde por R (reproducido)

`git log --oneline 19c853e3..HEAD` = 13 commits (819fa5c9 … 274736de), 6 pares + `docs` R7. Cada rojo y cada verde se sacó con `git checkout -q <hash>` en este worktree (detached) y se corrió `bunx jest --runTestsByPath <rutas>` desde `mobile-pet-tracker/`, exit code medido sin pipe; al final `git checkout feature/90-…` → HEAD `274736de`, `git status --short` vacío.

| R | Commit | Comando (rutas) | `Test Suites:` / `Tests:` | EXIT | Razón del rojo (literal) |
|---|---|---|---|---|---|
| R1 rojo | `819fa5c9` | `src/utils/civil-today-iso.test.ts` | 1 failed, 1 total / 2 failed, 4 passed, 6 | 1 | (a) Kiritimati y (e) `Expected: "2026-09-18"` / `Received: "2026-09-17"`; el esqueleto versionado ignora `timeZone` (`_timeZone`, getters locales) — sin `Cannot find module` |
| R1 verde | `fffd2434` | ídem | 1 passed / 6 passed | 0 | — |
| R2 rojo | `da18d263` | `language-provider.test.tsx` | 1 failed / 2 failed, 5 passed, 7 | 1 | L1 `Expected length: 305` / `Received length: 304`; `#90 R2` `Expected: "Date cannot be after today"` / `Received: undefined` |
| R2 verde | `60923eef` | `language-provider.test.tsx` + `ui-language.test.ts` | 2 passed / 31 passed | 0 | — |
| R3 rojo | `c8ee54b1` | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 1 failed / 6 failed, 20 passed, 26 | 1 | 5 fallos `Expected: "2026-09-18"` / `Received: "2026-09-17"` (las 4 aserciones editadas + `#90 R3` Kiritimati); `#90 R3` Pago_Pago `Expected: "http://example.test/v1", "jwt-token"` / `Number of calls: 0` (`getMe` aún no se llama). Sin `ReferenceError` |
| R3 verde | `d79524cc` | ídem | 1 passed / 26 passed | 0 | — |
| R4 rojo | `c6914614` | `weight-log.test.tsx` + `civil-today-iso.test.ts` | 2 failed / 6 failed, 31 passed, 37 | 1 | (a) y (b)×3 `Expected: "2026-09-17"` / `Received: "2026-09-18"` (M4-i); (c) `RangeError: Invalid time zone specified: Not/A/Zone` y R1(d) `Error name: "RangeError"` (M4-ii). **Rojo por mutación de producción versionada** (§2) |
| R4 verde | `7964d04c` | ídem | 2 passed / 37 passed | 0 | — |
| R5 rojo | `26f6861b` | `weight-log.test.tsx` + `ui-language.test.ts` | 2 failed / 3 failed, 53 passed, 56 | 1 | join crudo: `- La fecha no puede ser posterior a hoy` / `+ measuredAt is too far in the future`; `checkUses` en R5 y R18: `- "uses": 1` / `+ "uses": 0`. El `it` de `Invalid ISO date` ya pasa (fija P1) |
| R5 verde | `b9dc4b69` | ídem | 2 passed / 56 passed | 0 | — |
| R6 rojo | `48e8206f` | `src/screens/add-pet/index.test.tsx` | 1 failed / 1 failed, 19 passed, 20 | 1 | `Expected: … ObjectContaining {"birthDate": "2026-09-17"}` / `Received: … {"birthDate": "2026-09-18", "name": "Nala", "species": "dog"}`, `Number of calls: 1`. **Por M6** (§2). Sin `PICKER_MOCK_UNARMED` |
| R6 verde | `224a8b5c` | ídem | 1 passed / 20 passed | 0 | — |

Los rojos coinciden uno a uno con `requirements.md` §«Cómo se demuestra el rojo».

## 2. Mutaciones M4/M6: versionadas en el rojo, revertidas en el verde

- `git diff d79524cc..c6914614 -- weight-log.tsx civil-today-iso.ts`: M4-i `- … : undefined;` → `+ … : 'Pacific/Kiritimati';`; M4-ii quita el `try { … } catch { … }` entero del helper.
- `git diff d79524cc..7964d04c -- (mismos)` → **0 bytes**: el verde deja producción exactamente como el verde de R3. `git show --stat 7964d04c`: solo `weight-log.tsx` (2), `civil-today-iso.ts` (30), impl y traceability.
- `git diff b9dc4b69..48e8206f -- add-pet/index.tsx`: M6 `getFullYear/getMonth/getDate` → `getUTCFullYear/getUTCMonth/getUTCDate`. `git diff origin/main..224a8b5c -- add-pet/index.tsx` → **0 bytes**. `git show --stat 224a8b5c`: solo `add-pet/index.tsx` (6), impl y traceability.
- HEAD: `git diff origin/main..HEAD -- mobile-pet-tracker/src/screens/add-pet/index.tsx` → vacío. `rg -n "Pacific/Kiritimati" 'src/app/(tabs)/weight-log.tsx' src/utils/civil-today-iso.ts` → exit 1 (0). `try/catch` presente en `civil-today-iso.ts:5-23`.

## 3. Lista cerrada de ficheros

`git diff 19c853e3..HEAD --stat` (implementación) = 14 ficheros: los 12 finales de `design.md` §Archivos afectados (`civil-today-iso.ts`, `civil-today-iso.test.ts`, `catalog.ts`, `language-provider.test.tsx`, `weight-log.tsx`, `weight-log.test.tsx`, `ui-copy-table.ts`, `ui-language.test.ts`, `add-pet/index.test.tsx`, `specs/mobile-ui-language/design.md`, `traceability.md` de #90, `progress/impl_…md`; `add-pet/index.tsx` ausente como debe) + `specs/mobile-detail-screens-state-reset/traceability.md` y `specs/mobile-add-pet-photo-test-flake/traceability.md`, **una línea cada una**, solo el sufijo ` (#90 R3)` en los títulos `restaura los cuatro valores visibles tras el blur` y `submits all fields, clears them, and refetches the list (#72 R2)` (diff pegado en el log; ninguna otra celda cambia). `git diff origin/main..HEAD --stat` añade solo los 7 ficheros de spec/harness previos al handoff (`95678193..19c853e3`).

`git diff origin/main..HEAD -- add-pet/index.tsx profile/index.tsx query-provider.tsx api/users.ts api/health-records.ts api/types.ts test/render-with-providers.tsx test/jest-setup.js package.json bun.lock backend-pet-tracker/ | wc -c` → **0**.

## 4. Candados

Se mueven:
- L1 `language-provider.test.tsx:55` = `toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2 + 1)` (delta); `:50` comentario `+ 1 de #90`; `grep -c "^  '" src/i18n/catalog.ts` = **610**. Nuevo `describe('#90 R2: …')` con la regex `← añadida por #90 \(R2\)` sobre `specs/mobile-ui-language/design.md` (fila presente en §2.5, tabla de `weight-log.tsx`).
- L3 `ui-language.test.ts:133` = `toHaveLength(32 + 1); // +1 #90 R5`, título `33 ocurrencias`; fila `{ file: 'src/app/(tabs)/weight-log.tsx', key: 'weightLog.dateCannotBeAfterToday' }` al final del bloque en `ui-copy-table.ts`.
- L7: 4 aserciones con reloj `jest.setSystemTime(new Date('2026-09-17T23:30:00Z'))` y `'2026-09-18'` (`:189`, `:388-392` en `waitFor`, `:441-445` en `waitFor` sumada a la espera de #72, `:465`); la copia renombrada `deviceTodayIso` y usada solo en `#90 R4`.
- L8: `jest.mock('../../../api/users', () => ({ getMe: jest.fn() }))` + `beforeEach` **de nivel de fichero** (`:107-112`) con `makeProfile('Pacific/Kiritimati')` (nueve strings de `ProfileResponse`).
- L9: `joins backend validation messages, translating the future-date one (#90 R5)` asevera `'Weight is too high\nLa fecha no puede ser posterior a hoy'`; `keeps a malformed-date validation message raw (#90 R5)` asevera `'Invalid ISO date'`.

Siguen verdes (suite completa 74/74 en §8, y por literal): L2 `spanishKeys).toEqual(englishKeys)` + `markerNames` intactos; L4 `ui-language.test.ts:161` `toHaveLength(42)`; L5 valores nuevos no aparecen como literal fuera de `src/i18n` (`rg` → 0); L6 `design-drift.test.ts:391` `'app/(tabs)/weight-log.tsx': 1`; L10 `grep -c QueryClientProvider` en `add-pet/index.test.tsx` e `index.tsx` = 0; L11-L13 diff de `add-pet/index.test.tsx` es solo el bloque `#90 R6` (0 menciones a `PICKER_MOCK_UNARMED`/`pressPickPhoto`/`add-pet-photo` en el diff); L14-L15 `bun run test` 74/74.

## 5. Reglas de tests

- `weight-log.test.tsx`: todas las esperas de fecha terminan en `screen.getByTestId('weight-date-input').props.value` (`:187-191`, `:388-392`, `:441-445`, `:577-579`, `:594-596`, `:614-618`, `:626-630`, `:642-646`); ausencias de `weight-form-error` ancladas a `weight-input` visible (#90 R4 b y c). Ninguna espera en `queryClient.getQueryData` ni en `mockGetMe` (`grep` → 0): `expect(mockGetMe).toHaveBeenCalledWith(apiUrl, 'jwt-token')` es aserción plana tras una espera al árbol. La espera sobre `mockCreateWeight` en `#90 R3` es la propia aserción del payload (mismo patrón que `:428-435`, #72 S7) y la observación del árbol que sigue lleva su propio `waitFor`.
- Describes nuevos: `#90 R1`, `#90 R2`, `#90 R3`, `#90 R4`, `#90 R6`. `it` editados con sufijo ` (#90 R3)` ×4 y ` (#90 R5)` ×1 (+1 `it` nuevo R5).
- `add-pet/index.test.tsx`: `#90 R6` declarado en `:421` tras `#72 R4` (`:402-419`) y antes de `#61 R10`; hereda el `beforeEach` raíz del picker; no contiene `add-pet-photo` ni `pressPickPhoto()`.
- `useFakeTimers`: impl §R3 anota `jest.useFakeTimers()` sin opciones (probó también `{ doNotFake: ['requestAnimationFrame'] }`, mismo resultado); los 5 describes con reloj usan `jest.useFakeTimers()` desnudo — coherente. `afterEach(() => jest.useRealTimers())` en `R3`(#63), `R9`, `#90 R3`, `#90 R4`, `#90 R6`, y en el describe de `civil-today-iso.test.ts`.

## 6. Producción contra la spec

- `src/utils/civil-today-iso.ts`: `export function civilTodayIso(timeZone: string | undefined, now: Date = new Date()): string`; `new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)` reensamblado `${year}-${month}-${day}`; `try` envuelve constructor + `formatToParts`; `catch` → getters locales cero-rellenados; `rg '\.format\('` → 0; sin imports.
- `weight-log.tsx` (diff origin/main..HEAD, 40 líneas): imports `userKeys` (junto a `healthKeys`), `getMe`, `civilTodayIso`; `const MEASURED_AT_IN_FUTURE_MESSAGE = 'measuredAt is too far in the future'` (única); `useQuery({ queryKey: userKeys.me(), queryFn: () => getMe(baseUrl, token ?? '') })` inline; `profileTimeZone = me.data?.kind === 'ok' ? me.data.me.timezone : undefined`; `useState<string | null>(null)`; `const measuredAt = measuredAtDraft ?? civilTodayIso(profileTimeZone)`; `setMeasuredAtDraft(null)` en el cleanup de `useFocusEffect` y tras `case 'ok'`; `value={measuredAt}` / `onChangeText={setMeasuredAtDraft}`; payload sin cambios (usa `measuredAt` derivado); `localTodayIso` borrada; `case 'validation'`: `path === 'measuredAt' && message === MEASURED_AT_IN_FUTURE_MESSAGE ? t('weightLog.dateCannotBeAfterToday') : message`, mismo `.join('\n')`. `grep -c "t('weightLog.dateCannotBeAfterToday')"` = 1.
- Catálogo: clave al final del bloque `weightLog.` en `en` (`:129`) y `es` (`:439`), sin `{{}}`.
- C8 grep-clean (arriba). `rg 'npx|pnpm' progress/impl_…md` → 0; todos los comandos del impl son `bun`/`bunx`.

## 7. Sondas de mutación propias (plantadas sobre HEAD y revertidas)

Cada sonda: edición, `bunx jest --runTestsByPath …`, `git checkout -- <ficheros>`; «0 ficheros sucios» tras cada una; al final `git status --short` vacío, `git diff | wc -c` = 0, HEAD `274736de`.

| Sonda | Mutación | Suites | Resultado |
|---|---|---|---|
| A | `civil-today-iso.ts`: `format(now).split('/')` + reorden en vez de `formatToParts` | helper + weight-log | **Ninguna la caza** (2 passed, 38 passed, EXIT 0). Esperado: el veto a `format()` es por Hermes/ICU (no verificable en jest, `design.md` D2) y su guardia es el grep `\.format\(` de `tasks.md` R1(3), que a HEAD da 0. Se anota como zona ciega conocida; el smoke Android es la verificación real |
| B1 | `weight-log.tsx`: tras `case 'ok'`, `setMeasuredAtDraft(civilTodayIso(undefined))` (reset al dispositivo) | weight-log | Cazada: `#90 R3 › usa Pacific/Kiritimati …` y `R9 › submits all fields … (#72 R2) (#90 R3)` (2 failed, EXIT 1) |
| B2 | `weight-log.tsx`: cleanup de `useFocusEffect` → `setMeasuredAtDraft(civilTodayIso(undefined))` | weight-log | Cazada: `R3 › restaura los cuatro valores visibles tras el blur (#90 R3)` (1 failed, EXIT 1) |
| C | `weight-log.tsx`: discriminador solo `path === 'measuredAt'` (P1 rota) | weight-log | Cazada: `R9 › keeps a malformed-date validation message raw (#90 R5)` (1 failed, EXIT 1) |
| D | `weight-log.tsx`: `getMe(baseUrl, '')` (token perdido) | weight-log | Cazada: `#90 R3` Kiritimati y Pago_Pago (2 failed, EXIT 1) |
| F | `weight-log.tsx`: default congelado al montar (`useState(() => civilTodayIso(profileTimeZone))`), no se actualiza al llegar el perfil | weight-log | Cazada: `#90 R3` Kiritimati + las 4 aserciones editadas (5 failed, EXIT 1) — cubre la cláusula «WHEN el perfil llega después del primer render» |

## 8. R7 / gate

Parte móvil, desde `mobile-pet-tracker/` sobre HEAD limpio, exit codes sin pipe:
```
rm -f .expo/types/router.d.ts        → hecho
bun run typecheck  ($ tsc --noEmit)  → TYPECHECK_EXIT=0
bun run lint       ($ expo lint)     → LINT_EXIT=0
bunx jest --listTests                → LISTTESTS_EXIT=0, S = 74
bun run test                         → TEST_EXIT=0
  Test Suites: 74 passed, 74 total
  Tests:       1302 passed, 1302 total
  Snapshots:   1 passed, 1 total
N = 74 = S. git status --short vacío.
```
Delta contra el baseline del impl (73 suites / 1286 tests): +1 suite (`civil-today-iso.test.ts`), +16 tests (R1 6, R2 1, R3 2, R4 5, R5 1, R6 1) — cuadra.

`./init.sh`, desde la raíz del worktree, tras el aviso del leader «puertos libres» (la otra sesión confirmó su `init.sh` EXIT 0):
```
pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep   → sin salida, exit 1 (vacío)
./init.sh > <scratchpad>/init-review-90.log 2>&1; echo "EXIT=$?"   (primer plano, sin Monitor, sin pipe)
EXIT=0
backend : Test Suites: 170 passed, 170 total / Tests: 1295 passed, 1295 total
infra   : Test Suites: 2 passed, 2 total     / Tests: 14 passed, 14 total
móvil   : Test Suites: 74 passed, 74 total   / Tests: 1302 passed, 1302 total
e2e     : Test Suites: 3 skipped, 27 passed, 27 of 30 total / Tests: 8 skipped, 384 passed, 392 total
lint: ✅ Lint sin errores · typecheck: ✅ Typecheck sin errores · ✅ Todo verde. Listo para trabajar.
grep -c "reading 'canceled'" = 0 · grep -c PICKER_MOCK_UNARMED = 0 · grep -c alerts-error = 0
```
Verde a la primera: no hubo rojo previo ni repetición. Móvil 74 = S y 1302 tests, igual que la corrida local de §8; las 3 suites e2e omitidas son las `aws-real-*` de siempre (mismo recuento que el baseline de `progress/current.md` y el impl). Log íntegro: `init-review-90.log` en el scratchpad de la sesión.

## 9. Trazabilidad

`grep -in pendiente specs/mobile-owner-timezone-dates/traceability.md` → solo `:29` (la regla). Hashes: `819fa5c9 fffd2434 da18d263 60923eef c8ee54b1 d79524cc c6914614 7964d04c 26f6861b b9dc4b69 48e8206f 224a8b5c 274736de` → `git cat-file -t` = `commit` ×13, `git merge-base --is-ancestor <h> HEAD` = yes ×13. Filas R1-R7 con test y par rojo/verde; tabla «Tests de features anteriores actualizados» cubre los 6 `it` editados + `localTodayIso` renombrada + L1 + L3; ningún `it` de #63/#15/#41/#72/#65 desapareció.

## 10. Smoke humano

`progress/impl_mobile-owner-timezone-dates.md` §«Gate humano — smoke Android/Hermes»: «Pendiente de ejecución por el humano», sin rellenar, remite a `requirements.md` §Gate humano pasos 1-7. Correcto: el veredicto es sobre el código; el smoke en dev build de Android lo cierra el humano después (única verificación de `Intl.DateTimeFormat` + `formatToParts` con `timeZone` bajo Hermes).

---

## Observaciones

Ninguna bloqueante. Para el leader:
1. `health.tsx:28` conserva su propia `localTodayIso` (dispositivo). Fuera de la lista cerrada por D-B; `tasks.md` R3(3) pedía `rg localTodayIso src → 0`, que era inalcanzable tal cual (premisa de spec sin verificar contra el árbol). Candidata a deuda/feature.
2. Sonda A: el «nunca `format()`» de R1 solo lo vigila un grep de review, no un test. Aceptable por diseño (D2); anotado para que el smoke Android sea el que lo cierre.

## Output de ./init.sh
```
EXIT=0
Test Suites: 170 passed, 170 total
Tests:       1295 passed, 1295 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 74 passed, 74 total
Tests:       1302 passed, 1302 total
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 384 passed, 392 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

## Veredicto
**APROBADO.** Pasos 1-10 con evidencia reproducida por el reviewer: 12 commits rojo→verde por R (C4, mutaciones M4/M6 versionadas y revertidas), lista cerrada de ficheros respetada, candados movidos como delta y el resto verdes, producción conforme a D1-D8 y P1, 5 de 6 sondas propias cazadas (la restante es zona ciega declarada en D2), gate móvil y `./init.sh` EXIT=0 sin regresiones, trazabilidad completa. Queda solo el smoke humano en dev build de Android (§10), que no forma parte de este veredicto. Dos notas no bloqueantes para el leader en §Observaciones.
