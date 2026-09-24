# review: reminder-dates-days-until-drift (#84)
Fecha: 2026-09-24 03:40 UTC
Veredicto: RECHAZADO

**En una línea:** la implementación de Codex es correcta y cumple la spec al
pie de la letra. Los seis commits TDD son legítimos y los reproduje uno a uno.
Pero **R1 y R2 no fijan el mes ni el año del día civil**. Si `daysUntil` se
reescribe como `return to.getDate() - from.getDate();`, la suite móvil
**entera** sigue verde (82/82 suites, 1467/1467 tests). Ese es el arreglo
"obvio" más corto. En producción daría `-29` del 30 de septiembre al 1 de
octubre: un error peor que el que esta feature corrige. El hueco viene de las
tablas firmadas (todas las fechas caen entre el 9 y el 20 de septiembre), no de
Codex. Se cierra solo con tests: tres filas nuevas, verificadas abajo (H1).

Rango revisado: `72af7d62..5b1cb8e9`, los 7 commits de Codex sobre
`96566cac`. Worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/84-reminder-dates-days-until-drift`.
- Comprobé `HEAD = 5b1cb8e9` al empezar y al terminar.
- `origin/main = 993b62fa` es ancestro de HEAD (`merge-base --is-ancestor` → 0).
- No toqué `/home/claude/sites/Pet-Tracker`.
- Los checkouts por commit y todas las mutaciones se hicieron en un worktree
  desechable del scratchpad, con `node_modules` enlazado. Ese worktree ya está
  retirado: `git worktree list` no lo muestra.
- Al terminar, el árbol de la branch está limpio salvo este fichero.

Skills: cargué `expo:expo-overview`. No aplica ninguna skill hoja: es lógica
pura, sin UI, navegación, datos ni animación.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `84 reminder-dates-days-until-drift`. Lo medí con node sobre `feature_list.json`.
- [x] `progress/current.md` describe la sesión activa de #84.
- [x] Codex no tocó ningún artefacto del leader: `git diff --stat 96566cac HEAD -- progress/current.md progress/history.md STATUS.md feature_list.json` → 0 bytes.
- [x] Sin dependencias ni cambios fuera de alcance. `git diff origin/main...HEAD` sobre `package.json`, `bun.lock`, `src/i18n`, `src/__tests__`, `src/providers`, `src/screens/home`, `src/screens/reminders/index.tsx`, `backend-pet-tracker`, `infra`, `.github` e `init.sh` → 0 bytes.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: N/A. Solo cambia un util de presentación móvil.
- [x] repositories/contratos en domain son interfaces puras: N/A.
- [x] application depende de interfaces, no implementaciones: N/A.
- [x] infrastructure sin lógica de negocio: N/A.
- [x] `daysUntil` sigue siendo una función pura en `src/utils/`, con la misma firma. La pantalla la importa igual que antes y su fichero no cambia.

## Checklist C4 — TDD
- [x] Cada R1–R3 tiene su `describe` con el prefijo `#84 R<n>:` y el título literal de la spec. R4 es el smoke humano.
- [x] El historial es test-primero. Reproduje cada commit en el worktree desechable con `bunx jest --ci --silent --runTestsByPath … --json`:

| Paso | Commit | Resultado reproducido |
|---|---|---|
| base | `96566cac` | `exit=0`. 3 suites / 43 tests: `reminder-dates` 4, `reminders/index` 26, `home/format` 13 |
| R1 rojo | `72af7d62` | `exit=1`, `8 failed, 6 passed`, todo por aserción `toBe`. Fallan `positive` (esp. 1, rec. 2) y las filas 1, 2, 3, 6, 7, 9 y 10 (rec. `1`, `-0`, `1`, `2`, `-0`, `8`, `11`). Las filas 4, 5 y 8 quedan verdes, justo lo que pide la spec |
| R1 verde | `fe7fd0de` | `exit=0`, 3 suites / 53 tests (14 + 26 + 13) |
| R2 rojo | `e69c93b6` | `exit=1`, fallan solo las 3 filas de R2 (rec. `1`, `0`, `-1`). R1 y las cuatro filas previas siguen verdes. `reminders/index` 26/26 verde, como se espera en un host UTC. La mutación versionada de producción son los seis getters locales → `getUTC*` |
| R2 verde | `5a2a93d6` | `exit=0`, 56 tests. `git diff fe7fd0de 5a2a93d6 -- …/reminder-dates.ts` → 0 bytes |
| R3 rojo | `db7e3b0c` | `exit=1`, fallan los 2 `it` de `#84 R3` por aserción (`Unable to find … · en 0 días` / `· en -1 días`). Los 26 `it` previos siguen verdes. También caen R1 (7 filas + `positive`) y R2 (filas 1 y 3), como está previsto. La mutación versionada devuelve el cuerpo a `Math.ceil` |
| R3 verde | `720817f8` | `exit=0`, 58 tests (17 + 28 + 13). `git diff 5a2a93d6 720817f8 -- …/reminder-dates.ts` → 0 bytes. `git diff fe7fd0de HEAD -- …/reminder-dates.ts` → 0 bytes |

- [x] Ningún rojo cae por `ReferenceError`. El helper `skewed` entra en el mismo commit en que se usa.
- [x] Ningún rojo cae por mutar un doble: los dos rojos de verificación (R2, R3) mutan `src/utils/reminder-dates.ts` y el verde revierte la mutación.
- [x] Valores esperados literales. En las líneas de test añadidas, `Date.UTC`, `DAY_MS`, `86_400_000` y `getTimezoneOffset` salen 0 veces, y `toEqual` también 0.
- [x] Todas las filas de `daysUntil` usan `toBe`.
- [x] R1 y R3 construyen las fechas con componentes locales: `new Date(2026, 8, …)`, y para `dueAt` se usa `.toISOString()` de una fecha local.
- [x] Los dobles de R2 tienen la forma de `skewed` de `#70 R5` (tres getters locales y tres UTC), más `getTime` con el instante real. Sus valores coinciden con la tabla A/B/C.
- [ ] **Los candados de R1 y R2 no cubren su propio contrato: el mes y el año del día civil.** Ver H1 y H2.

## Checklist C5 — Trazabilidad
- [x] Las filas R1–R3 tienen sus seis hashes. Todos existen (`cat-file -t` → `commit`) y son ancestros de HEAD (`merge-base --is-ancestor` → 0). Cada uno hace el papel que la tabla le asigna.
- [x] La fila `positive` de §Candados ajenos movidos apunta a `72af7d62`.
- [x] La única fila que sigue en «pendiente» es la de R4, el smoke humano. La spec la asigna al humano después de este veredicto, así que no bloquea. La feature no puede pasar a `done` hasta que el humano marque su casilla.
- [x] Los mensajes de commit son los literales de tasks.md: `test(reminder-dates|reminders): … (Rn)` en los rojos y `feat(reminder-dates): … (Rn)` en los verdes.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla marcada (2026-09-23, vía Notion). Firma en `2665ffd3`.
- [x] Entre el espejo y la firma no hay drift. `git diff 62f32f55 2665ffd3 -- specs/` solo cambia los cuatro frontmatter y la casilla.
- [x] Entre la firma y HEAD tampoco. `git diff 2665ffd3 HEAD -- specs/reminder-dates-days-until-drift/` solo toca `traceability.md`: 4 filas de «pendiente» pasan a hash.

## Checklist C7 — Sin código huérfano
- [x] El cuerpo viejo desapareció. `grep -c "Math.ceil\|getUTC\|getTime" src/utils/reminder-dates.ts` → 0 (grep sale con `exit=1`) y `grep -c "Date.UTC("` → 2.
- [ ] N/A: la feature no reemplaza ningún módulo, solo el cuerpo de una función.

## Checklist C8 — UI móvil
- [x] Grep-clean. La feature no toca ficheros de UI. En las líneas añadidas del diff móvil, `<palabra>-[` sale 0 veces. El guard `design-drift` está dentro de la suite completa, que salió verde (82/1467).
- [x] Dimensiones, Skeleton, componentes compartidos, tappables y animaciones: N/A, no cambia ninguna vista.
- [x] Catálogo +0. `git diff origin/main...HEAD` de `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y `src/__tests__/ui-copy-table.ts` → 0 bytes.

## Hallazgos

**H1 — ALTA, bloqueante. R1 no fija el mes ni el año del día civil. Cuatro mutaciones plausibles sobreviven a la suite móvil entera.**
- **Qué pasa.** Todas las filas de R1 caen entre el 9 y el 20 de septiembre. Las filas heredadas `zero`/`positive`/`negative` caen del 23 al 25 de agosto. Ningún test observa `getMonth()` ni `getFullYear()`. El único test que cruza de mes es `R6 renders summaries…` (del 24 de agosto al 10 de septiembre), pero ahí nadie asevera la etiqueta de `later`.
- **Qué sobrevive, en verde, en `reminder-dates` + `reminders/index` + las dos suites de navegación + `detail-stack` (44/44):**
  - U8 `return to.getDate() - from.getDate();`
  - U9 sin mes (`getMonth()` → `0`)
  - U10 sin año (`getFullYear()` → `2026`)
  - U15 mes contado desde 1 (`getMonth() + 1`)
- **U8 contra la suite completa:** `exit=0`, **82/82 suites, 1467/1467 tests**.
- **Impacto medido.** Con U8, del 30 de septiembre a las 20:00 al 1 de octubre a las 09:00 salen `-29` días; del 31 de diciembre al 1 de enero, `-30`. Un recordatorio para mañana mostraría `· en -29 días`, perdería «¡Próximo!» y saldría de «Esta semana» todos los fines de mes. El código de HEAD da `1` en esos casos, tanto con `TZ=UTC` como con `America/Mexico_City`.
- **Por qué bloquea.** El contrato normativo de la spec define «día civil local» como `getFullYear()`, `getMonth()`, `getDate()`, y R1 solo fija el tercero. Es la misma familia que rechazó #113 en la ronda 1: una mutación por descuido, sin condición, que la suite no ve. Además, U8 es justo la reescritura "mínima" que un implementador tendería a hacer.
- **Origen.** Las tablas firmadas, no Codex: copió las filas literalmente.
- **Corrección verificada (solo test).** La apliqué en el worktree desechable y la revertí:
  - R1 +2 filas, con componentes locales:
    - `fin de mes: 30 de septiembre 20:00 → 1 de octubre 09:00 = 1`: `new Date(2026, 8, 30, 20, 0)` → `new Date(2026, 9, 1, 9, 0)`.
    - `fin de año: 31 de diciembre 23:30 → 1 de enero 00:30 = 1`: `new Date(2026, 11, 31, 23, 30)` → `new Date(2027, 0, 1, 0, 30)`.
  - R2 +1 fila, `Ciudad de México, 31 de diciembre 20:00 → 1 de enero 09:00 = 1`, con dos dobles:
    - `from`: locales 2026/11/31, UTC 2027/0/1, `getTime` `'2027-01-01T02:00:00.000Z'`.
    - `to`: locales y UTC 2027/0/1, `getTime` `'2027-01-01T15:00:00.000Z'`.
    - El helper `skewed(localDay, iso)` de HEAD fija año 2026 y mes 8, así que tiene que aceptar también año y mes locales. Lo prescribo como intención, no como código literal.
- **Qué comprobé de la corrección:**
  - Con HEAD sin mutar da **20/20 verde**.
  - **Pone en rojo U8, U9, U10, U11, U12 y U15** (tabla de mutaciones).
  - Mantiene en rojo U1, U2 y U3.
  - Recorrí las 418 zonas IANA con el Node del VPS. En todas, las dos filas de R1 se construyen sin caer en un hueco de cambio de hora y dan `1`. Con `TZ=America/Mexico_City`, los instantes de los dobles son exactamente `2027-01-01T02:00Z` y `15:00Z`.
- **Cómo cerrarlo.** Las tablas están firmadas, así que añadir las filas es una **enmienda** con su propia firma humana.
  - Las filas nuevas verifican código que ya es correcto, así que su rojo es una mutación de producción versionada. U8 vale para las dos filas de R1 y para la de R2. U11 vale solo para la de R2.
  - Los deltas pasan a +16 en `reminder-dates.test.ts` y +18 en la suite. Hay que actualizar la fila de recuento en §Candados.
  - Decide el leader.

**H2 — MEDIA, bloqueante junto con H1 (misma corrección). R2 no fija el mes ni el año UTC.**
- **Qué pasa.** Los dobles A/B/C solo difieren entre local y UTC en el **día**. Una versión parcial de la mutación que R2 existe para cazar sobrevive a `reminder-dates`, `reminders/index`, las dos suites de navegación y `detail-stack`:
  - U11: solo `getMonth` → `getUTCMonth`.
  - U12: solo `getFullYear` → `getUTCFullYear`.
- **Impacto.** En Ciudad de México, el último día de cada mes después de las 18:00, contaría con el mes UTC. Del 30 de septiembre a las 20:00 al 1 de octubre, U11 da `-29`.
- **Corrección.** La fila de R2 de H1 la cierra (U11 → `335`, U12 → `-364`).

**H3 — BAJA, no bloqueante. Los umbrales se pueden aflojar sin que nada falle.**
- **Qué sobrevive, verde en `reminders/index` 28/28:**
  - S8: en la píldora, `days <= 7` → `days <= 8`.
  - S9: en el badge, `days <= 10` → `days <= 11`.
- **Por qué no bloquea.** Ningún test tiene un recordatorio a 8 ni a 11 días. El hueco es anterior a #84, que no toca los umbrales, y la lista de sondas de la spec solo pide endurecerlos (`<`, `>`).
- **Si se enmienda por H1, cerrarlo cuesta poco.** Basta un recordatorio a +8 días (fuera de la píldora) y otro a +11 (sin badge) en el primer `it` de R3.

**H4 — BAJA, no bloqueante. La fila heredada `negative` depende ahora de la zona horaria del host cuando es UTC−9.**
- **Qué pasa.** Con `TZ=Pacific/Gambier` o `TZ=America/Adak` (offset 540 en agosto), `reminder-dates.test.ts` falla: `returns a negative integer` recibe `-2`.
- **Por qué.** La fila usa instantes con `Z`: `from` son las 00:00 locales del 24 de agosto y `to` son las 23:59:59 del 22. En la base `96566cac` las dos zonas salen verdes, porque `Math.ceil` no lee la zona.
- **Dónde no pasa.** Con `UTC`, `America/Mexico_City`, `Pacific/Marquesas`, `Pacific/Kiritimati`, `Asia/Kolkata`, `Pacific/Chatham`, `America/St_Johns` y `Pacific/Pago_Pago`, las 17 filas salen verdes. `reminders/index` sale 28/28 con `Mexico_City`, `Gambier` y `Kiritimati`.
- **Por qué no bloquea.** Ningún host del proyecto está en UTC−9. Aun así, contradice la frase de §Candados «siguen dando 0 y -1» en cualquier host.
- **Arreglo.** Pasar esa fila a componentes locales, en la misma enmienda si se hace.

**H5 — INFO. La trazabilidad se rellenó al final, en un solo commit (`5b1cb8e9`), en vez de tras cada commit como pedía el handoff.** Los hashes son correctos y ancestros de HEAD, así que no tiene impacto.

**H6 — INFO. R4 (smoke en dev build de Android) sigue siendo del humano.** La feature no puede pasar a `done` sin su casilla.

## Mutaciones propias (worktree desechable en `5b1cb8e9`)

Cada mutación la apliqué con un reemplazo exacto de aparición única y la
revertí con `git checkout -- .`. Tras cada reversión, `git diff --shortstat`
salió vacío. Las «U» corren sobre `src/utils/reminder-dates.test.ts`; las
supervivientes, además, sobre `reminders/index`, las dos suites de navegación
y `detail-stack`, y U8 también sobre la suite completa. Las «S» corren sobre
`src/screens/reminders/index.test.tsx`.

| # | Mutación (zona) | Resultado |
|---|---|---|
| U1 | `Math.round` sobre ms (listada en la spec) | **rojo** 12/17: R1 filas 2 (`-0`), 3 y 4; R2 filas 1 y 3 |
| U2 | `Math.floor` sobre ms (listada) | **rojo** 10/17: `negative`, R1 filas 2, 4, 5 y 8; R2 filas 2 y 3 |
| U3 | `Math.trunc` sobre ms (listada) | **rojo** 11/17: R1 filas 2, 4, 5 y 7; R2 filas 2 y 3 |
| — | `Math.ceil` sobre ms (listada) | **rojo**: es el rojo versionado de R3, reproducido arriba |
| — | los seis getters → `getUTC*` (listada) | **rojo**: es el rojo versionado de R2, reproducido arriba |
| U6 | `toISOString().slice(0, 10)` (listada como sonda extra) | **rojo** 14/17: las 3 filas de R2 por `TypeError` (el doble no tiene `toISOString`), como prevé la spec |
| U7 | `-0`: resta invertida dividida por `-DAY_MS` | **rojo** 11/17: `zero`, R1 filas 1–3 y R2 filas 1 y 3 reciben `-0` (`toBe` usa `Object.is`) |
| U14 | `getUTC*` solo del lado `to` | **rojo**: R2 fila 1 |
| **U8** | `return to.getDate() - from.getDate();` | **VERDE: sobrevive**. 17/17 en su fichero, 44/44 con pantalla y navegación, **82/82 suites y 1467/1467 tests** en la suite completa (H1) |
| **U9** | sin mes (`getMonth()` → `0`) | **VERDE: sobrevive**, 17/17 y 44/44 (H1) |
| **U10** | sin año (`getFullYear()` → `2026`) | **VERDE: sobrevive**, 17/17 y 44/44 (H1) |
| **U15** | mes contado desde 1 (`getMonth() + 1`) | **VERDE: sobrevive**, 17/17 y 44/44 (H1) |
| **U11** | UTC parcial: solo `getMonth` → `getUTCMonth` | **VERDE: sobrevive**, 17/17 y 44/44 (H2) |
| **U12** | UTC parcial: solo `getFullYear` → `getUTCFullYear` | **VERDE: sobrevive**, 17/17 y 44/44 (H2) |
| U13 | medianoches locales + `Math.round` | verde: **mutante equivalente**. El redondeo absorbe los días de 23 y 25 h. La forma que prescribe D1 la fija el grep de cierre (2× `Date.UTC(`, 0× `getTime`) |
| S1 | argumentos intercambiados en las dos llamadas de la pantalla (listada) | **rojo** 25/28: R6 y los 2 `it` de R3 |
| S2 | intercambiados **solo** en la píldora | **rojo** 25/28: R6 (`1`) y R3 (`2`, `0`) |
| S3 | intercambiados **solo** en la fila | **rojo** 25/28: R6 (`· en 3 días`) y R3 (`· en 7 días`, `· en -1 días`) |
| S4 | píldora `days <= 7` → `< 7` (listada) | **rojo**: R3 `it` 1 (`2`) |
| S5 | badge `days <= 10` → `< 10` (listada) | **rojo**: R3 `it` 1 (`reminder-upcoming-badge-edge`) |
| S6 | píldora `days >= 0` → `> 0` (listada) | **rojo**: R3 `it` 1 (`2`) |
| S7 | badge `days >= 0` → `> 0` (listada) | **rojo**: R3 `it` 1 (`reminder-upcoming-today-later`) |
| S10 | píldora `days >= 0` → `>= -1` | **rojo**: R3 `it` 2 (`0`) |
| S11 | badge `days >= 0` → `>= -1` | **rojo**: R3 `it` 2 (`toBeNull`) |
| S12 | fórmula vieja en línea **solo** en la llamada de la fila | **rojo**: los 2 `it` de R3 |
| S13 | fórmula vieja en línea **solo** en la llamada de la píldora | **rojo**: los 2 `it` de R3 (`2`, `0`) |
| S14 | etiqueta con `Math.abs(days)` | **rojo**: R3 `it` 2 (`· en -1 días`) |
| **S8** | píldora `days <= 7` → `<= 8` | **VERDE: sobrevive**, 28/28 (H3) |
| **S9** | badge `days <= 10` → `<= 11` | **VERDE: sobrevive**, 28/28 (H3) |

**Todas las sondas que lista la spec salen rojas.** En el rojo versionado de R3,
el primer `it` cae en la primera aserción (la etiqueta), lo que tapa las
demás. Por eso S2, S4, S5, S6, S7 y S13, que mutan una sola decisión cada una,
confirman por separado que las aserciones de la píldora y del badge están
vivas.

**Corrección de H1 aplicada en el worktree desechable** (un `describe` de
sonda con las 3 filas propuestas; revertido tras cada corrida):
- Sin mutar: 20/20 verde.
- **Rojo** con cada mutación: U8 (3 filas, `-29`/`-30`/`-30`), U9 (3, `-29`/`335`/`335`), U10 (2, `-364`), U11 (1, `335`), U12 (1, `-364`), U15 (1, `2`).
- Siguen rojos U1 (6), U2 (10) y U3 (9).

## Comandos (exit medido sin pipe)

- En `/home/claude/sites/Pet-Tracker-wt-backend`:
  - `git rev-parse --short HEAD` → `5b1cb8e9`, al empezar y al terminar.
  - `git status --short` → vacío antes de escribir este fichero.
- `git diff --stat origin/main...HEAD` → exactamente 11 ficheros:
  - la spec (4 ficheros);
  - `feature_list.json`, `progress/current.md`, `progress/handoff_…` y `progress/impl_…`;
  - los tres ficheros móviles: `reminder-dates.ts` (+4/−1), `reminder-dates.test.ts` (+45/−1) y `reminders/index.test.tsx` (+58).
  - `src/screens/reminders/index.tsx` no cambia.
- `bunx jest --ci --silent --runTestsByPath <ficheros> --json` en cada commit del rango → los `exit` de la tabla de C4.
- Con HEAD, `reminder-dates` + `reminders/index` + `home/format` → `exit=0`, 3 suites / 58 tests.
- `bunx tsc --noEmit` en HEAD (worktree desechable, sin `.expo/`) → `exit=0`, 0 bytes.
- `bun run lint` en HEAD → `exit=0`.
- `TZ=<zona> bunx jest --runTestsByPath src/utils/reminder-dates.test.ts` en 9 zonas y `…/reminders/index.test.tsx` en 3 → resultados en H4.
- Recorrido de las 418 zonas de `Intl.supportedValuesOf('timeZone')` para las filas propuestas en H1 → 0 zonas con problemas.
- **No corrí `./init.sh` ni e2e**, por instrucción del leader: el Postgres y el LocalStack son compartidos y el clasificador se lo deniega al subagente.

## Output de ./init.sh

Lo corrió el leader sobre este mismo tip `5b1cb8e9`. Log:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f4719a40-0501-4a5f-80e7-b8287f1de20f/scratchpad/init-84-review.log`
(18 684 líneas, mtime `2026-09-24 03:20 UTC`, posterior al commit `5b1cb8e9` de `2026-09-23 22:57 UTC`).
Lo leí entero en lo que importa:

```
Test Suites: 170 passed, 170 total          # backend unit
Tests:       1298 passed, 1298 total
Test Suites: 2 passed, 2 total              # infra
Tests:       14 passed, 14 total
Test Suites: 82 passed, 82 total            # móvil
Tests:       1467 passed, 1467 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 27 passed, 27 of 30 total   # e2e
Tests:       8 skipped, 389 passed, 397 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
EXIT 0
```

- Móvil 82/1467 = la base propia de Codex (82/1452) +15 tests y +0 suites, el delta que declara la spec.
- Mi corrida de la suite completa con U8 da los mismos recuentos (82/1467).
- El init.sh verde no cambia el veredicto: el rechazo se debe a candados que faltan (H1, H2), no a una regresión.
