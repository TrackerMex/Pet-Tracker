# review: mobile-meal-schedule-canvas-fidelity (#179) — ronda de fusión con main (#183)
Fecha: 2026-10-16
Veredicto: APROBADO

Alcance: solo la fusión de `origin/main` (`f0b636a4d01fa30ecbc8aa0029e4a45fd1f364da`, incluye #183) en la branch
`feature/179-mobile-meal-schedule-canvas-fidelity`. HEAD revisado: `04284a188ffce60acb17b1c59ddaea225956de7b`, árbol
limpio (`git diff --quiet && git diff --cached --quiet` tras mis sondas). El veredicto previo (`1c9a144e`, R1 a R14)
no se re-revisa. Implementó Codex CLI (otra IA); el reviewer es distinto del implementador. Contrasté con el árbol,
no con la nota.

## 1. Topología

- [x] Merge `4cb9afd50cd2153be9902def7009bf969ab0fb32`: `^1 = 61d0cc6bea4d8fa4c069167a433193bc71373841` (H0m),
  `^2 = f0b636a4d01fa30ecbc8aa0029e4a45fd1f364da`. Evidencia: `git rev-parse 4cb9afd5^1 4cb9afd5^2`.
- [x] HEAD `04284a18` tiene un solo padre (`4cb9afd5`) y toca un solo fichero
  (`progress/impl_mobile-meal-schedule-canvas-fidelity.md`, +95). `git rev-list --parents -n1 HEAD`.
- [x] Sin rebase: `58bf412c`, `dd60f5c1` y `f0b636a4` son ancestros de HEAD (`git merge-base --is-ancestor`);
  `git merge-base HEAD origin/main = f0b636a4`. Los 29 hashes de commit citados en `traceability.md` siguen siendo
  ancestros de HEAD (comprobado uno a uno). La historia test-primero de #179 (pares `test(...)` → `feat(...)` de
  R1 a R13 en `git log --first-parent 58bf412c..HEAD`) está intacta.
- [x] La deriva de código de producción/tests desde el commit aprobado `1c9a144e` es exactamente el aporte de main:
  `git diff --name-only 1c9a144e HEAD -- mobile-pet-tracker backend-pet-tracker infra` (14 ficheros) es idéntico a
  `git diff --name-only 58bf412c f0b636a4 -- mobile-pet-tracker backend-pet-tracker infra`. Nada de #179 se movió.

## 2. Conflictos y ediciones manuales

- [x] Solo se resolvieron a mano tres ficheros. `git show --cc 4cb9afd5` (diff combinado, lo único que difiere de
  ambos padres) muestra únicamente hunks en esos tres ficheros; no hay ninguna otra edición manual.
- [x] `mobile-pet-tracker/src/__tests__/ui-language.test.ts:143-144`: título `resuelve las 51 ocurrencias
  normativas` (de main) y cadena `35 + 3 + 1 - 2 + 1 + 3 + 9 + 11 + 2 + 1 + 3` con `+3 #179 R8` añadido al final del
  comentario. Un solo `expect(R6_FOOD).toHaveLength(` en el fichero.
- [x] `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx:70-73`: tras `+ 1 // #174 R2` quedan
  `+ 5 // #179 R3`, `- 2 // #179 R5`, `+ 9, // #183 R1`; coma solo en la última.
- [x] `specs/mobile-ui-language/design.md`: `### §2.32 — Añadidos por #183 — Validación en cliente de las pantallas de
  cuenta` (línea 1009) y `### §2.33 — Añadidos por #179 — Horario e Historial del canvas` (línea 1023), separadas por
  una línea en blanco; 9 filas `← añadida por #183 (R1)` y 5 filas `← añadida por #179 (R3)`; cero marcadores; la
  casilla de plantilla `- [ ] Enmienda aprobada por humano (fecha: ____)` (línea 1471) sigue sin marcar y es única
  (#65 R19). No queda ninguna referencia viva a `§2.32` de #179 en `specs/mobile-meal-schedule-canvas-fidelity/` ni en
  `docs/` (solo en `progress/`, que es histórico).
- [x] Aporte de cada lado intacto (líneas `+`/`-` de `git diff -U0`): contra `f0b636a4` el merge aporta
  exactamente lo que #179 aportó contra `58bf412c` en `feature_list.json`, `ui-copy-table.ts` y `catalog.ts`
  (idénticas), y en `ui-language.test.ts`, `language-provider.test.tsx` y `design.md` solo difieren en las tres
  resoluciones prescritas (cadena, comas y número de sección). Otros 20 ficheros fuera de `progress/` (los 6 anteriores
  más estos 20 = los 26 no-`progress/` de la lista de 30): diff idéntico, comparado por hash del `git diff` de cada
  lado. Los 4 ficheros de `progress/` de la lista (`current.md`, handoff, impl, review de #179) no los comparé
  uno a uno; solo la lista de nombres (M6).
- [x] Lista cerrada (M6): `git diff --name-only f0b636a4 4cb9afd5` excluyendo el handoff de fusión = 30 ficheros,
  idéntica a `git diff --name-only 58bf412c dd60f5c1` (`diff` vacío). Contra HEAD también idéntica.
- [x] Marcadores: `git grep -nE '^(<<<<<<<|=======$|>>>>>>>)'` solo da `progress/handoff_mobile-docs-upload.md`
  (líneas 1210, 1214, 1219, tres líneas de marcador, no dos), que es idéntico en `f0b636a4` (3 líneas) y no
  está en la lista de 30: heredado de main, no es de esta ronda.
- [x] `feature_list.json` parsea; sin ids duplicados; una sola `in_progress` (#179); #183 `done`; el único cambio de
  #179 es `pending` → `in_progress`.

## 3. Recuentos contra el árbol real

Medí con `bun` importando `ui-copy-table.ts` y `catalog.ts` de cada revisión (no con el handoff):

| Magnitud | 58bf412c (base) | f0b636a4 (main) | dd60f5c1 (#179) | HEAD (fusión) | Cuadra |
|---|---|---|---|---|---|
| `R6_FOOD.length` | 64 | 64 | 67 | **67** | 64 + 0 (#183) + 3 (#179 R8) = 67 |
| claves `en` = `es` del catálogo | 410 | 419 | 413 | **422** | 410 + 9 + (5 − 2) = 422 |
| filas `ALL_USES` | 540 | 551 | 543 | **554** | 540 + 11 + 3 = 554 |
| ficheros distintos (`SCREEN_FILES`) | 32 | 33 | 32 | **33** | cadena `… + 1 // #183 R2` = 33 |
| filas duplicadas `file\|key` | 52 | 52 | 52 | 52 | sin duplicados nuevos |

- `R6_FOOD`: la cadena `35+3+1-2+1+3+9+11+2+1+3` = 67 = medido. Las filas netas de #179 en `R6_FOOD`: `−dailyGrams −mealsPerDay
  +perDay +mealsPerDayUnit` (0 neto), `_layout.tsx → screens/meal-schedule` y `_layout.tsx → screens/meals-history` (0
  neto) y `+activity +condition +food` (R8, +3). #183 no añade filas a `R6_FOOD`.
- Cadena de claves de `language-provider.test.tsx`: sumada entera da 422 = `Object.keys(en).length` = `Object.keys(es).length`.
  `+5 #179 R3` = `perDay, mealsPerDayUnit, activity, condition, food`; `-2 #179 R5` = `dailyGrams, mealsPerDay`;
  `+9 #183 R1` = las nueve `validation.*`.
- Sin solapamiento ni doble conteo: los conjuntos de claves añadidas/borradas de #179 (`mealSchedule.*`) y #183
  (`validation.*`) son disjuntos; ninguna rama borra una clave que la otra use; cero claves duplicadas en `en`; `en` y
  `es` tienen el mismo conjunto. No hay `R8_*` agregado ni ficheros de copy tocados por ambos lados salvo los tres
  registros compartidos (`catalog.ts`, `ui-copy-table.ts`, `design.md`), que auto-fusionaron sin solaparse.
- El título `51` de `#65 R6` es decorativo y no coincide con el recuento real (67); ya era así en main (`50` con
  longitud 64). No bloquea (ver O2).

## 4. Gate

- `./init.sh` no lo corrí (denegado al reviewer; lo corrió el leader sobre este HEAD). Leí `/tmp/179m-init.exit`
  (`exit=0`) y `/tmp/179m-init.log` (mtime 18:22, posterior al commit `04284a18` de 17:30; el único cambio de HEAD
  respecto al merge es un fichero de `progress/`): backend `187 suites / 1474 tests`, segundo bloque `2 / 14`,
  mobile `112 suites / 3661 tests` (`Snapshots: 1 passed`), e2e `30 passed, 3 skipped` suites y
  `468 passed, 8 skipped` tests, lint y typecheck verdes, "Todo verde". Aviso preexistente `A worker process has
  failed to exit gracefully` (una vez, fuera de alcance). 3611 (main) + 50 (#179) = 3661: coincide.
- Jest puntual mío, con `pgrep` vacío antes (sin procesos ajenos), `-i`, `--testTimeout=30000`:
  `src/__tests__/ui-language.test.ts` + `src/providers/__tests__/language-provider.test.tsx` →
  `Test Suites: 2 passed`, `Tests: 73 passed`, cero `●`.

## 5. Sonda de la zona fundida (mutaciones plantadas y restauradas)

Cada mutación se restauró con `git checkout HEAD -- <ruta>` y `git diff --quiet` (verificado; árbol limpio al final).

| Sonda | Mutación | Cae en rojo en |
|---|---|---|
| S1 | cadena `R6_FOOD` `… + 1 + 3` → `… + 1 + 2` (`ui-language.test.ts`) | `#65 R6: Food resuelve su copy por clave › resuelve las 51 ocurrencias normativas` (1 failed / 30) |
| S2 | cadena de claves `+ 9, // #183 R1` → `+ 8,` (`language-provider.test.tsx`) | `#65 R12 › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` (1 failed / 43) |
| S3 | quitar `mealSchedule.food` del catálogo `es` (`catalog.ts`) | `#179 R3 › registra las cinco traducciones exactas…`, `#65 R12 › mantiene la base…`, `#65 R18 › mantiene el catálogo consistente entre los dos idiomas` y `› no deja ningún valor fijo…` (4 failed / 73) |
| S4 | borrar la fila `validation.countryLetters` de §2.32 (`design.md`) | `#183 R1 › declara las claves de validación en los dos idiomas y su registro` (1 failed / 43) |

Los candados de ambos lados (#179 y #183) siguen mirando en la zona fundida; ninguna sonda pasó en verde.

## Checklist (solo lo relevante a esta ronda)

- [x] C2: solo 1 `in_progress` (#179) en `feature_list.json`.
- [x] C3: la ronda no toca `domain`/`application`/`infrastructure`; las capas no cambian (el aporte de main viene de
  una feature ya revisada).
- [x] C4: no hay R-id nuevo ni tests nuevos; la historia rojo/verde de #179 sigue intacta; la fusión no añade `it`.
- [x] C5: los hashes de `traceability.md` siguen siendo ancestros (sin rebase). Los dos "pendiente (humano)" de
  `traceability.md` (R14, líneas 29 y 37) están fuera de alcance: lo pone el leader al cerrar; la casilla de R14 en
  `requirements.md:1034` ya está `[X]` por AlexisSM377 (2026-10-16).
- [x] C6: `requirements.md` de #179 no se tocó en esta ronda (idéntico al aprobado).
- [x] C7: N/A, la ronda no reemplaza nada.

## Observaciones

1. (no bloqueante, informativa) `progress/handoff_mobile-docs-upload.md:1210-1219` contiene marcadores de conflicto
   (`<<<<<<< HEAD`, `=======`, `>>>>>>> origin/main`), heredados de `f0b636a4`; el handoff decía 2 marcadores y son 3
   líneas de marcador. Es un fichero de main ajeno a #179; conviene limpiarlo en su propia feature o chore, no aquí.
2. (no bloqueante, informativa) El número del título `it('resuelve las 51 ocurrencias normativas')` de `#65 R6`
   no refleja `R6_FOOD.length` (67); era decorativo ya en main y el handoff lo prescribe así. El candado real es
   el `toHaveLength(...)` y la sonda S1 lo confirma.
3. (no bloqueante, ya conocida) Siguen vigentes las observaciones previas de la revisión aprobada de #179
   (`_layout.tsx:99`, `meal-schedule/index.tsx:53`); no se re-evaluaron, fuera de alcance.

Ninguna observación bloqueante.

## Lo que NO pude verificar

- No corrí `./init.sh` ni la suite entera (denegado al reviewer por el clasificador; instrucción expresa). Me apoyo en
  `/tmp/179m-init.log` y `/tmp/179m-init.exit` del leader. No puedo probar desde el árbol que ese log corresponda
  exactamente a `04284a18`; lo respalda que su mtime (18:22) es posterior al commit (17:30) y que `04284a18` solo toca
  un fichero de `progress/`.
- No re-ejecuté typecheck ni lint por separado (cubiertos por el log del leader).
- No ejecuté los e2e de backend ni nada contra LocalStack/Postgres compartidos (fuera de alcance de la ronda).
- No re-revisé el contenido de la feature #179 ni el de #183 (fuera de alcance); solo su cruce.
- No inspeccioné la prueba de humo R14 (firmada por el humano; no es verificable por un reviewer).

## Output de ./init.sh (cita del log del leader, `/tmp/179m-init.log`, `exit=0`)

```
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 112 passed, 112 total
Tests:       3661 passed, 3661 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
