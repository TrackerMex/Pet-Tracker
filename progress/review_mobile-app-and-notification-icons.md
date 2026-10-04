# review: mobile-app-and-notification-icons (#101)

Fecha: 2026-10-03T20:00:44+00:00
pwd: `/home/claude/sites/Pet-Tracker-wt-icon`
branch: `feature/101-mobile-app-and-notification-icons`
HEAD: `3bb824e9` (docs del leader; último commit de Codex `7e8cfe50`; handoff `bcd3000b`; base `d29d49d5`)
Veredicto: **APROBADO** (R1–R9). R10 queda explícitamente fuera: gate humano (tres casillas «Smoke R10» de `requirements.md` §Aprobación).

`init.sh` NO lo corrió el reviewer (Postgres/LocalStack compartidos): se lee `progress/init_101.log` del leader (§init.sh).

---

## Checklist C2–C7 (CHECKPOINTS.md)

| Check | Resultado | Evidencia (comando → línea decisiva) |
|---|---|---|
| C2 — Estado coherente | [x] | `grep -c '"status": "in_progress"' feature_list.json` → `1` (id 101). `progress/current.md` describe #101 en `in_progress`, handoff entregado, línea base 90/1913 y esperado 91/1928. |
| C3 — Arquitectura | [x] | `git diff --stat d29d49d5 HEAD -- mobile-pet-tracker/src` → vacío, exit 0. Todo vive en capa de configuración (`app.json`, PNG, un script one-off, dos tests de raíz). `scripts/make-icons.mjs` importa solo `node:fs` y `jimp-compact` (líneas 1 y 3). Sin lógica de dominio. |
| C4 — TDD test-primero | [x] | `git log --oneline bcd3000b..3bb824e9`: por cada R el `test(...)` precede al `feat(...)` en el orden de tasks.md R2, R8, R3, R4, R5, R6, R7, R9; R9 solo `test` (32f4c403). `git log --stat`: cada commit `test(...)` toca solo `app.assets.test.ts`/`app.config.test.ts`; cada `feat(...)` toca PNG/script/app.json (y en R6/R7 las dos relajaciones de `#79 R2` prescritas). Rojos reproducidos por el reviewer en R3 y R7 (§R1–R9). |
| C5 — Trazabilidad | [x] | `traceability.md`: R1–R9 con hash; R10 «pendiente» por diseño (gate humano, sin test jest). `git cat-file -e` sobre los 15 hashes TDD + `7e8cfe50` + `add2dade` → todos `ok`, mensajes idénticos a la tabla del reporte. Formato `test|feat(mobile-app-and-notification-icons): <desc> (R<n>)` en los 15 (docs/conventions.md §Commits). |
| C6 — Spec aprobada | [x] | `requirements.md` frontmatter `status: approved`; casilla `- [x] Aprobado por humano (fecha: 2026-10-03)` con página Notion, `page_last_edited_at` y cuenta; firma `add2dade` existe. |
| C7 — Sin código huérfano | [x] | Reemplazado: `android-icon-background.png` → `git rm` en `e6d959dd` (R5, D1); `test -e assets/images/android-icon-background.png` → exit 1. `git grep -n 'android-icon-background' bcd3000b -- app.config.test.ts src` → vacío: ningún test lo referenciaba. Las dos aserciones de `#79 R2` cuyos valores ahora posee #101 se relajan (no se borran) exactamente como design.md §Cambios en app.config.test.ts. |
| C8 — Carta UI (guard) | [x] | `rg -n '[A-Za-z0-9_-]+-\[[^]]+\]' app.assets.test.ts app.config.test.ts` → sin coincidencias, `rg exit=1`. No hay pantalla: no aplica el resto de la carta (design.md §Sin pantalla). |

### Lista cerrada de ficheros (handoff §FICHEROS)

`git diff --stat bcd3000b 7e8cfe50` → exactamente 13 ficheros: `app.assets.test.ts`, `app.config.test.ts`, `app.json`, `android-icon-background.png` (Bin 17549 → 0), `android-icon-foreground.png`, `android-icon-monochrome.png`, `favicon.png`, `icon.png`, `pet-tracker-notification-96.png` (Bin 0 → 3633), `splash-icon.png`, `scripts/make-icons.mjs`, `progress/impl_*.md`, `traceability.md`. Nada fuera de la lista.
`3bb824e9` (leader) solo toca `progress/current.md`, `design.md`, `requirements.md` (errata del recuento): `git show --stat 3bb824e9`. Sin código.

### Restricciones (requirements.md §Restricciones)

- Cero dependencias: `git diff --stat d29d49d5 HEAD -- mobile-pet-tracker/package.json bun.lock mobile-pet-tracker/bun.lock mobile-pet-tracker/src` → vacío, exit 0. `bun install --frozen-lockfile` → `Checked 1324 installs across 1145 packages (no changes)`, exit 0.
- `bunx tsc --noEmit` → exit 0, sin salida; antes `test ! -e .expo/types/router.d.ts` → exit 0 (no existía, nada que borrar).
- `git diff --check d29d49d5 HEAD` → exit 0.
- Regla de prefijo: `grep -nE '#101' … | grep -vE '#101 R[0-9]+:'` → ninguno suelto.

---

## R1–R9, uno por uno

Todo desde `mobile-pet-tracker/`. IHDR medido por el reviewer con `node -e` (firma + `readUInt32BE(16/20)` + bytes 24/25), no por el test:

```
icon.png                                           sig=89504e470d0a1a0a w=1024 h=1024 depth=8 type=6
favicon.png                                        sig=89504e470d0a1a0a w=48   h=48   depth=8 type=6
android-icon-foreground.png                        sig=89504e470d0a1a0a w=1024 h=1024 depth=8 type=6
android-icon-monochrome.png                        sig=89504e470d0a1a0a w=1024 h=1024 depth=8 type=6
splash-icon.png                                    sig=89504e470d0a1a0a w=1024 h=1024 depth=8 type=6
pet-tracker-notification-96.png                    sig=89504e470d0a1a0a w=96   h=96   depth=8 type=6
pet-tracker-app-icon.png                           sig=89504e470d0a1a0a w=1254 h=1254 depth=8 type=2
pet-tracker-notification-monochrome-original.png   sig=89504e470d0a1a0a w=1254 h=1254 depth=8 type=6
pet-tracker-notification-color-96.png              sig=89504e470d0a1a0a w=96   h=96   depth=8 type=6
```

Focal verde en HEAD: `bun run test --runInBand --runTestsByPath app.assets.test.ts app.config.test.ts` → `PASS ./app.config.test.ts`, `PASS ./app.assets.test.ts`, `Test Suites: 2 passed`, `Tests: 28 passed, 28 total`, exit 0.

- **R1 — Fuentes intactas.** `git diff --stat d29d49d5 HEAD -- assets/expo.icon pet-tracker-app-icon.png pet-tracker-notification-monochrome-original.png pet-tracker-notification-color-96.png` → vacío, exit 0. `git diff --name-status d29d49d5 HEAD -- mobile-pet-tracker/assets/images` → `D android-icon-background.png`, `M` ×5 (foreground, monochrome, favicon, icon, splash), y una sola `A`: `pet-tracker-notification-96.png`. IHDR de las tres fuentes coincide con la tabla de requirements.md. Fila R1 de traceability con hash `32f4c403` existente.
- **R2 — Icono.** Literales en `app.assets.test.ts:23-24` y `app.config.test.ts:225-226`. IHDR 1024×1024/8/6. `app.json` conserva `"icon": "./assets/images/icon.png"` (sin cambio en el diff). Commits `a1c7feef` (test) → `bd2ac966` (feat: `icon.png` Bin 799005 → 1256021 + script). Nace verde; mutación reproducida (§Sondas, MUT).
- **R3 — Foreground.** Literales `app.assets.test.ts:45-46`, `app.config.test.ts:237-238`. IHDR 1024/8/6. bbox (comando literal de design.md) → `{"x0":174,"y0":174,"x1":849,"y1":849}` exacto. Script líneas 14-16: `new Jimp(1024, 1024, 0x00000000).composite(icon.clone().resize(676, 676, Jimp.RESIZE_BICUBIC), 174, 174)`. Rojo reproducido: árbol de tests+assets+app.json en `1681f62f` → `FAIL ./app.assets.test.ts`, `● #101 R3 … mide 1024x1024 RGBA`, `+ "height": 512, + "width": 512`, `Tests: 1 failed, 18 passed, 19 total`, exit 1 (igual que el reporte). Restaurado: `git diff --cached --stat` y `git status --short` vacíos.
- **R4 — Monochrome.** Literales `app.assets.test.ts:56-57`, `app.config.test.ts:245-246`. IHDR 1024/8/6. bbox → `{"x0":206,"y0":251,"x1":818,"y1":773}`, los cuatro dentro de [174, 850] (esperado ≈ x [206, 817], y [251, 773] ±2). Blancura: `nonwhite=0 alpha>0=116978`. Orden D5 en el script: `scan` con `data[k+3] = data[k+3] >= 128 ? 255 : 0` y RGB=255 a 1254 (líneas 21-25) **antes** de `resize(676, 676)` + `composite(…, 174, 174)` (líneas 27-29). Commits `f37d0a73` → `6639f8e7`.
- **R5 — Fondo plano.** Literales `app.config.test.ts:253-254`, `app.assets.test.ts:67-68` (`existsSync` real sobre `join(__dirname, 'assets/images/android-icon-background.png')`, sin mock). `git diff d29d49d5 HEAD -- app.json`: `-"backgroundColor": "#E6F4FE"` / `+"backgroundColor": "#9460FC"` y `-"backgroundImage": …` eliminada. Fichero ausente (`test -e` exit 1). Commits `64ce999f` → `e6d959dd` (Bin 17549 → 0).
- **R6 — Splash.** Literales `app.config.test.ts:262-263`, `app.assets.test.ts:73-74` (ruta leída del tuple del plugin). Diff app.json: `#208AEF→#9460FC`, `imageWidth 76→200`, `image` sin cambio; igualdad profunda `toContainEqual(['expo-splash-screen', {…tres claves…}])`. `cmp android-icon-foreground.png splash-icon.png` → sin salida, exit 0. Script línea 18: `fs.copyFileSync(foreground, splash)`. Relajación de `#79 R2` en el mismo verde `a62caa53`: `{backgroundColor:'#208AEF', image:…, imageWidth:76}` → `expect.any(Object)` (única línea cambiada en ese `it`). Commits `e0cdd4b8` → `a62caa53`.
- **R7 — Notificación.** Literales `app.config.test.ts:275-276`, `app.assets.test.ts:88-89`. Diff app.json: `+"icon": "./assets/images/pet-tracker-notification-96.png"`, `+"color": "#9460FC"`, `defaultChannel` conservado; tuple exacto de tres claves aseverado con igualdad profunda. IHDR 96×96/8/6. Blancura: `nonwhite=0 alpha>0=2856`. Script líneas 31-32: `silhouette.clone().resize(96, 96, Jimp.RESIZE_BICUBIC)` sobre la silueta ya umbralizada a 1254. Relajación de `#79 R2` en el mismo verde `15028e66`: `{ defaultChannel: 'default' }` → `expect.objectContaining({ defaultChannel: 'default' })`. Rojo reproducido: árbol de tests+app.json en `7edffcb9` → `FAIL ./app.assets.test.ts` `● #101 R7 … expect(received).toBeDefined() Received: undefined` (app.assets.test.ts:94) y `FAIL ./app.config.test.ts` `● #101 R7 …`, `Tests: 2 failed, 25 passed, 27 total`, exit 1 (igual que el reporte). Restaurado, índice y status vacíos. Commits `7edffcb9` → `15028e66`.
- **R8 — Favicon.** Literales `app.assets.test.ts:34-35`, `app.config.test.ts:231-232`. IHDR 48×48/8/6. Script líneas 11-12: `icon.clone().resize(48, 48, …)` directo desde la fuente de 1254, no desde `icon.png`. `web.favicon` sin cambio. Commits `7f26654d` → `6be5ea45` (Bin 1129 → 5416). Nace verde; mutación reproducida (§Sondas).
- **R9 — iOS intacto.** Literal `app.config.test.ts:288-289`. `ios.icon` sin cambio en el diff de app.json; `git diff --stat d29d49d5 HEAD -- mobile-pet-tracker/assets/expo.icon` → vacío. Solo commit de test `32f4c403` (nada que implementar, tasks.md). Mutación reproducida (§Sondas).

### `app.config.test.ts`: solo lo prescrito

`git diff bcd3000b HEAD -- mobile-pet-tracker/app.config.test.ts`: dentro de `#79 R2` cambian únicamente las dos aserciones de design.md (splash → `expect.any(Object)`; notifications → `expect.objectContaining({ defaultChannel: 'default' })`); el resto del diff son los ocho `describe('#101 R<n>: …')` nuevos insertados entre `#79 R2` y `#79 R14`. Ninguna otra aserción preexistente cambia.

### Script `scripts/make-icons.mjs` (D6)

32 líneas; imports `node:fs` y `jimp-compact` únicamente. Idempotencia: `bun scripts/make-icons.mjs` → exit 0; `git status --short assets/images` → vacío (PNG byte-idénticos a los versionados).

### Recuentos

Base del handoff 90 suites / 1913 tests → `progress/init_101.log` líneas 22842-22843: `Test Suites: 91 passed, 91 total`, `Tests: 1928 passed, 1928 total` = +1 suite, +15 tests. Coherente con la errata `3bb824e9` (7 en assets + 8 en config = 15; los 28 de la corrida focal son 7 + 21 preexistentes/ nuevos de config).

---

## Sondas (rojo + restauración; `git status --short` vacío tras cada una)

| # | Mutación | Resultado | Restauración |
|---|---|---|---|
| MUT R2 | `app.assets.test.ts:27` `height: 1024` → `1023` | `● #101 R2 … - "height": 1023, + "height": 1024` | `git checkout HEAD -- app.assets.test.ts` |
| MUT R8 | `app.assets.test.ts:38` `height: 48` → `1023` | `● #101 R8 … - "height": 1023, + "height": 48` | ídem |
| MUT R9 | `app.config.test.ts` `'./assets/expo.icon'` → `'./assets/expo.icon-mutado'` | `● #101 R9 … Expected: "./assets/expo.icon-mutado" Received: "./assets/expo.icon"` | `git checkout HEAD -- app.config.test.ts` |
| (los tres juntos) | — | `Tests: 3 failed, 25 passed, 28 total`, exit 1 | `git diff --stat` vacío |
| (a) | `app.json` `"color": "#9460FC"` → `"#9460FD"` | Cae solo `● #101 R7: … declara icon …, color #9460FC y defaultChannel default` (`1 failed, 27 passed`), exit 1 | `git checkout HEAD -- app.json` |
| (b) | `app.json` `"imageWidth": 200` → `201` | Cae solo `● #101 R6: … con imageWidth 200` (`1 failed, 27 passed`), exit 1 | ídem |
| (c) | clave extra `"extra": true` en el tuple de `expo-splash-screen` | Cae solo `● #101 R6` (igualdad profunda rompe); `#79 R2` con `expect.any(Object)` sigue verde (`1 failed, 27 passed`), exit 1 | ídem |
| (d) | `cp icon.png splash-icon.png` (también 1024×1024 RGBA) | Jest **verde** (`28 passed`, exit 0): el test IHDR no distingue dos PNG con la misma cabecera. `cmp foreground splash` → `differ: byte 35`, exit 1: **el candado es el `cmp` del reviewer**, tal como design.md §Verificaciones del reviewer lo asigna y §Alternativas descartadas lo justifica (no decodificar el PNG en el test). Límite documentado de la spec, no hallazgo. | `git checkout HEAD -- assets/images/splash-icon.png`; `cmp` → exit 0 de nuevo |

Rojos reales reproducidos desde commits (R3 `1681f62f`, R7 `7edffcb9`): ver §R1–R9. Restauración con `git checkout HEAD -- <4 rutas>` + `git restore --source=HEAD --staged --worktree -- <4 rutas>` (el checkout desde commit deja en el índice `A android-icon-background.png`, que `restore` elimina): `git diff --cached --stat` vacío, `git status --short` solo `?? progress/review_*.md`.

---

## Hallazgos

Ninguno bloqueante.

---

## Observaciones no bloqueantes

1. `app.assets.test.ts:94` añade `expect(plugin[1].icon).toBeDefined()` antes del único `toEqual` que design.md prescribe por `it`. Es un guard de precondición para que el rojo de R7 sea una aserción limpia y no un `TypeError` de `join(undefined)` (reporte §R7). No debilita el candado del fichero; se anota por ser una línea más que la letra de design.md.
2. Sonda (d): el candado de «copia byte a byte» de R6 vive fuera de jest (`cmp` del reviewer), por decisión explícita de la spec. Quien regenere los PNG sin correr `cmp` puede desalinear splash y foreground sin que la suite lo vea. Si se quiere cerrar en jest en una feature futura, basta un `readFileSync(...).equals(...)` de dos ficheros (sin decodificar PNG); no se pide aquí.
3. En la reproducción del rojo de R7, `git checkout 7edffcb9 -- assets/images` no borra `pet-tracker-notification-96.png` del árbol (checkout no elimina lo ausente en el origen), así que el PNG seguía en disco; el rojo decisivo es el de `app.json` sin `icon` (`toBeDefined`), el mismo que documenta el reporte.
4. bbox del monochrome `x1 = 818` frente al «≈ 817» de design.md: dentro del ±2 anunciado.
5. `progress/init_101.log` línea 22840 avisa de un worker de jest que no cierra limpiamente (timers); el reporte lo sitúa ya en la base y `init.sh exit=0`.
6. `progress/init_101.log` no aparece en `git status` (ignorado); el reviewer no lo tocó.

---

## init.sh (log del leader, `progress/init_101.log`; el reviewer NO lo corrió)

```
línea 1:      HEAD=3bb824e90d912d9ab4cd37b636d368feb2b0163b branch=feature/101-mobile-app-and-notification-icons pwd=/home/claude/sites/Pet-Tracker-wt-icon date=2026-10-03T19:54:32Z
línea 305:    Test Suites: 174 passed, 174 total        (backend unit)
línea 306:    Tests:       1335 passed, 1335 total
línea 318:    Test Suites: 2 passed, 2 total            (infra)
línea 319:    Tests:       14 passed, 14 total
línea 22842:  Test Suites: 91 passed, 91 total          (móvil)
línea 22843:  Tests:       1928 passed, 1928 total
línea 22844:  Snapshots:   1 passed, 1 total
línea 23148:  Test Suites: 3 skipped, 28 passed, 28 of 31 total   (e2e)
línea 23149:  Tests:       8 skipped, 423 passed, 431 total
última línea: init.sh exit=0
```

HEAD del log = HEAD revisado (`3bb824e9`). Sin regresiones: backend, infra y e2e iguales a la base; móvil +1/+15.

---

## Veredicto final

**aprobado** — R1–R9 cumplen la spec aprobada (`add2dade`), CHECKPOINTS C2–C7 (+ guard C8) y las verificaciones de design.md §Verificaciones del reviewer, con rojos y mutaciones reproducidos por el reviewer.

Queda fuera y pendiente del humano, no de Codex: **R10** (dev build de Android, prebuild limpio + `run:android`; tres casillas «Smoke R10» en `requirements.md` §Aprobación). La feature no se marca `done` sin ellas (tasks.md §R10, CLAUDE.md §Reglas duras).

Árbol al cerrar: `git diff --cached --stat` vacío; `git status --short` → solo `?? progress/review_mobile-app-and-notification-icons.md`.
