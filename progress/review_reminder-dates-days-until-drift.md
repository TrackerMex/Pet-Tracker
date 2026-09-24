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

## Ronda 2

Fecha: 2026-09-24 04:19 UTC
Veredicto: **APROBADO**

**En una línea:** la Enmienda E1 cierra H1, H2, H3 y H4. En HEAD, U8, U9, U10,
U11, U12 y U15 salen rojas, y S8 y S9 también. H4 queda verde en 13 zonas y en
el barrido de las 419. Producción es idéntica a `5b1cb8e9` y la pantalla es
idéntica a `origin/main`. Sobreviven dos mutaciones UTC parciales de un solo
getter del lado `to` (N1). Son de severidad **baja** y el grep de cierre
(`getUTC` ×0) las caza al leer el fichero, así que no bloquean. Recomiendo
registrarlas como deuda.

Rango revisado: `45908678..c113e79b`, los 5 commits de la ronda 2 sobre
`02c70791`.
- Comprobé `HEAD = c113e79b` al empezar y al terminar.
- `origin/main = 993b62fa` es ancestro de HEAD (`merge-base --is-ancestor` → 0). `git ls-remote origin refs/heads/main` → `993b62fa`, así que el remoto no se ha movido.
- No toqué `/home/claude/sites/Pet-Tracker`.
- Los checkouts por commit y todas las sondas se hicieron en un worktree desechable del scratchpad (`wt84`), con `node_modules` enlazado. Retiré el worktree al terminar.
- Skills: cargué `expo:expo-overview`. No aplica ninguna skill hoja: son tests de lógica pura y de una pantalla que no cambia.

### C6 — Spec aprobada (E1)
- [x] E1 solo añade texto a la spec firmada: `git diff 5b1cb8e9 7024a55b -- specs/` da +225/−0 (`grep '^-[^-]'` → `exit=1`, 0 líneas quitadas). No toca D1-D4, R1-R4 ni la firma original.
- [x] La firma `7024a55b` solo marca la casilla de E1: `git diff 9ad946e0 7024a55b -- specs/` → 1 línea.
- [x] Entre la firma y HEAD solo cambia la trazabilidad: `git diff 7024a55b HEAD -- specs/reminder-dates-days-until-drift/` → solo `traceability.md`, con 3 filas que pasan de «pendiente» a hash (R5, R6 y el candado movido).

### C4 — TDD de la ronda 2 (reproducido commit a commit)

Comando: `bunx jest --ci --silent --runTestsByPath src/utils/reminder-dates.test.ts src/screens/reminders/index.test.tsx --json`

| Paso | Commit | Resultado reproducido |
|---|---|---|
| base | `02c70791` | `exit=0`, 45 tests (17 + 28) |
| R5 rojo | `45908678` | `exit=1`, `3 failed / 45 passed`. Fallan solo las 3 filas de R5, por aserción `toBe`: `-29`, `-30` y `-30` frente a `1`. Los otros 17 del util y los 28 de la pantalla quedan verdes. La mutación versionada es U8, literal: `return to.getDate() - from.getDate();` |
| R5 verde | `c759482b` | `exit=0`, 48 tests. `git diff --quiet 720817f8 c759482b -- …/reminder-dates.ts` → `exit=0` |
| R6 rojo | `32313d9f` | `exit=1`, `1 failed / 48 passed`. Falla el `it` de R6 por aserción: aparece `reminder-upcoming-plus-eleven` cuando se esperaba `null`. Los 28 previos quedan verdes. La mutación versionada es `<= 8` en la píldora y `<= 11` en el badge |
| R6 verde | `3e530242` | `exit=0`, 49 tests. `git diff --quiet origin/main 3e530242 -- …/screens/reminders/index.tsx` → `exit=0` |
| trazabilidad | `c113e79b` | `exit=0`, 49 tests. Solo cambian `traceability.md` e `impl_…md` |

- [x] Los mensajes de los 4 commits TDD son los literales de tasks.md §Enmienda E1.
- [x] Ningún rojo cae por `TypeError` ni por `ReferenceError`. Los dos mutan producción, nunca un doble.
- [x] El rojo de R6 cae en la 4.ª aserción, que tapa la 5.ª (`pill-week` = `0`). S8 confirma por separado que esa 5.ª aserción está viva (tabla de sondas).
- [x] Producción en HEAD = `5b1cb8e9`: `git diff --quiet 5b1cb8e9 HEAD -- …/reminder-dates.ts …/screens/reminders/index.tsx` → `exit=0`.
- [x] Pantalla en HEAD = `origin/main`: `git diff --quiet origin/main HEAD -- …/screens/reminders/index.tsx` → `exit=0`.

### Tests contra el texto de E1 (comprobado literalmente)
- [x] Comparé con `grep -cF` contra requirements.md y contra el test (1 y 1 cada uno):
  - los títulos de los dos `describe`, el título del `it` de R6 y los tres títulos de fila de R5;
  - `const from` y las filas `zero`, `positive` y `negative`.
  - Las fechas de `plus-eight` y `plus-eleven` también coinciden (`new Date(2026, 8, 18|21, 9, 0).toISOString()`).
- [x] R5:
  - Es un único `it.each` de 3 filas con título `'%s'` y cuerpo `expect(daysUntil(from, to)).toBe(expected)`.
  - Las filas 1 y 2 usan componentes locales.
  - El helper es propio del `describe`: recibe `(localYear, localMonth, localDay, iso)`. Los getters locales devuelven lo que recibe; `getUTC*` y `getTime` salen del instante; termina en `as unknown as Date`.
- [x] R6:
  - El `beforeEach` y el `afterEach` son idénticos a los de R3: `diff` de los dos bloques → `exit=0`.
  - Tiene un solo `it` y las cinco aserciones de la spec.
- [x] Los tests de R1-R3 y el helper de R2 no cambian. Los hunks de la ronda 2 solo tocan las 4 líneas del candado heredado y añaden bloques al final de cada fichero. En los tests, `git diff origin/main HEAD` da +97/−0 en `index.test.tsx`.
- [x] En las líneas de test añadidas desde `5b1cb8e9`:
  - `toEqual`, `Date.UTC`, `DAY_MS`, `86_400_000` y `getTimezoneOffset` salen 0 veces (`grep` → `exit=1`).
  - El patrón C8 `<palabra>-[` sale 0 veces (`exit=1`).

### H1-H4 de la ronda 1: cerrados

Todas las mutaciones de la ronda 1 se volvieron a correr en HEAD: `c113e79b`, con producción sin cambios.

| # | Mutación | Ronda 1 (`5b1cb8e9`) | Ronda 2 (HEAD) |
|---|---|---|---|
| U8 | `return to.getDate() - from.getDate();` | verde (82/1467) | **rojo** 3/20: R5 filas 1-3 (`-29`, `-30`, `-30`) |
| U9 | `getMonth()` → `0` | verde | **rojo** 3/20: R5 filas 1-3 |
| U10 | `getFullYear()` → `2026` | verde | **rojo** 2/20: R5 filas 2 y 3 |
| U11 | los dos `getMonth` → `getUTCMonth` | verde | **rojo** 1/20: R5 fila 3 (`335`) |
| U12 | los dos `getFullYear` → `getUTCFullYear` | verde | **rojo** 1/20: R5 fila 3 (`-364`) |
| U15 | `getMonth() + 1` | verde | **rojo** 1/20: R5 fila 1 (`2`) |
| S8 | píldora `<= 8` | verde | **rojo** 1/29: R6 no encuentra `0` en `pill-week` |
| S9 | badge `<= 11` | verde | **rojo** 1/29: R6 encuentra `reminder-upcoming-plus-eleven` |

**H4:**
- El control se ve: en `5b1cb8e9`, con `TZ=Pacific/Gambier`, `reminder-dates.test.ts` da `exit=1` y `negative` recibe `-2`.
- En HEAD, `reminder-dates.test.ts` da `exit=0` y 20/20 en 13 zonas: `Pacific/Gambier`, `America/Adak`, `Pacific/Kiritimati`, `Pacific/Chatham`, `Asia/Kolkata`, `America/St_Johns`, `America/Mexico_City`, `Pacific/Marquesas`, `Pacific/Pago_Pago`, `Australia/Lord_Howe`, `America/Santiago`, `Pacific/Auckland` y `UTC`.
- `reminders/index.test.tsx` da 29/29 con `Gambier`, `Kiritimati` y `Mexico_City`.
- Barrido de las **419** zonas (`UTC` + `Intl.supportedValuesOf('timeZone')`) con la fórmula de producción, sobre:
  - las filas heredadas y las filas 1-2 de R5;
  - los dos recordatorios de R6, que pasan por `toISOString()` → `new Date`.
- Resultado del barrido: **0 zonas con problemas**. Ninguna hora local cae en un hueco de cambio de hora, todas dan el esperado y U8 pone rojas las filas 1-2 de R5 en todas las zonas.

### Sondas nuevas de la ronda 2 (HEAD, cada una revertida; `git diff --shortstat` vacío tras cada una)

| # | Mutación | Resultado |
|---|---|---|
| U1 / U2 / U3 / U4 | `Math.round` / `floor` / `trunc` / `ceil` sobre ms | **rojo** 6 / 10 / 9 / 10 de 20 |
| U5 | los seis getters → `getUTC*` | **rojo** 4/20 (R2 ×3, R5 fila 3) |
| U6 | `toISOString().slice(0, 10)` | **rojo** 4/20 |
| U7 | resta invertida `/ -DAY_MS` (`-0`) | **rojo** 6/20 |
| U14 | los tres getters de `to` → UTC | **rojo** 1/20 |
| U16 | mes de `to` ← `from.getMonth()` | **rojo** 3/20 |
| U17 | año de `to` ← `from.getFullYear()` | **rojo** 2/20 |
| U18 | los dos `getDate` → `getUTCDate` | **rojo** 4/20 |
| U20 | solo `from.getFullYear` → UTC | **rojo** 1/20 |
| U21 / U22 | aproximaciones `año*365 + mes*30 + día` / `mes*31 + día` | **rojo** 2/20 y 3/20 |
| U25 | `Date.UTC` con horas + `Math.round` | **rojo** 8/20 |
| U27 | solo `from.getMonth` → UTC | **rojo** 1/20 |
| U28 / U29 | solo `to.getDate` / solo `from.getDate` → UTC | **rojo** 1/20 y 3/20 |
| **U19** | **solo `to.getMonth` → `getUTCMonth`** | **VERDE: sobrevive**. 20/20, y **82/82 suites y 1471/1471 tests** en la suite completa (N1) |
| **U26** | **solo `to.getFullYear` → `getUTCFullYear`** | **VERDE: sobrevive**. 20/20, y **82/82 y 1471/1471** en la suite completa (N1) |
| U13 / U23 | medianoches locales con `Math.round` / sin redondeo | verde. Es el techo conocido de D1: solo difiere en un cambio de hora. Lo cierra el grep de cierre (`Date.UTC(` ×2) |
| U24 | `Math.floor` sobre la fórmula correcta | verde. **Mutante equivalente**: el resultado ya es entero |
| S1 | argumentos intercambiados en las dos llamadas | **rojo** 4/29 |
| S4 / S5 / S6 / S7 | `< 7` / `< 10` / píldora `> 0` / badge `> 0` | **rojo** 1/29 cada una (R3) |
| S15 / S16 | píldora `<= 9` / badge `<= 12` | **rojo** 1/29 (R6) |
| S17 / S18 | píldora `<= 10` / badge `<= 7` (umbrales cruzados) | **rojo** 2/29 (R3 y R6) |
| S20 / S21 | píldora / badge sin cota superior (`<= 1000`) | **rojo** 3/29 y 2/29 |
| S19 | píldora sin `reminder.status === 'scheduled'` | verde (N2, fuera del alcance) |
| S22 | badge sin `!inactive` | verde (N2, fuera del alcance) |

S2, S3 y S10-S14 salieron rojas en la ronda 1. Los tests en los que cayeron
siguen intactos y la pantalla no ha cambiado, así que siguen rojas por
monotonía.

### Diff frente a `origin/main`
- [x] `git diff --stat origin/main...HEAD` → 12 ficheros:
  - los tres ficheros móviles: `reminder-dates.ts` (+4/−1), `reminder-dates.test.ts` (+71/−4) y `reminders/index.test.tsx` (+97/−0);
  - la spec (4 ficheros);
  - `feature_list.json`, `progress/current.md`, `handoff_…`, `impl_…` y `review_…`.
- [x] `src/screens/reminders/index.tsx` tiene diff neto cero.
- [x] Sin dependencias, catálogo ni cambios en backend o infra.

### C5 — Trazabilidad
- [x] Los 10 hashes distintos de `traceability.md` existen (`cat-file -t` → `commit`) y son ancestros de HEAD (`merge-base --is-ancestor` → 0):
  - R1-R3: `72af7d62`, `fe7fd0de`, `e69c93b6`, `5a2a93d6`, `db7e3b0c` y `720817f8`;
  - R5: `45908678` y `c759482b`;
  - R6: `32313d9f` y `3e530242`;
  - candados movidos: `72af7d62` y `45908678`.
  Cada hash hace el papel que le asigna la tabla.
- [x] La única fila en «pendiente» es R4, el smoke humano. La spec la asigna al humano después de este veredicto, igual que en la ronda 1.

### C2 / C3 / C7 / C8
- [x] Solo hay 1 feature `in_progress`: #84. Lo medí con node sobre `feature_list.json`.
- [x] Codex no tocó ningún artefacto del leader: `git diff --stat 02c70791 HEAD -- progress/current.md progress/history.md STATUS.md feature_list.json` → vacío.
- [x] C3: N/A. `daysUntil` sigue siendo una función pura en `src/utils/`.
- [x] C7: `grep -c "Date.UTC(" src/utils/reminder-dates.ts` → `2`; `grep -c "Math.ceil\|getUTC\|getTime"` → `0` (`exit=1`).
- [x] C8: no cambia ninguna vista. Catálogo +0. El patrón C8 sale 0 veces en las líneas añadidas.

### Hallazgos de la ronda 2

**N1 — BAJA, no bloqueante. Sobreviven dos mutaciones UTC parciales de un solo getter del lado `to`: U19 (`to.getMonth` → `to.getUTCMonth`) y U26 (`to.getFullYear` → `to.getUTCFullYear`).**
- **Qué pasa.** Salen verdes en su fichero (20/20) y en la suite móvil completa (82/82, 1471/1471). Ningún doble tiene en `to` un mes o año local distinto del UTC:
  - en los dobles de R2 solo difiere el día;
  - en el `to` de la fila 3 de R5 (1 de enero, 09:00) coinciden.
- **Impacto medido con node:**
  - En `America/Mexico_City`, un recordatorio para hoy a las 20:00 del último día del mes sale como `· en 30 días` con U19. El 31 de diciembre sale `-334` con U19 y `365` con U26.
  - En `Asia/Tokyo`, un recordatorio para el día 1 antes de las 09:00 sale `-29` con U19.
  - En un host UTC no pasa nada.
- **Por qué no bloquea:**
  - Hace falta una edición asimétrica de un solo token. Las variantes simétricas (U5, U11, U12, U18) y todas las del lado `from` salen rojas, igual que U14, que pasa a UTC los tres getters de `to`.
  - El grep de cierre de tasks.md (`getUTC` ×0 en `reminder-dates.ts`) la caza al leer el fichero. Es el mismo cierre que ya se aceptó en la ronda 1 para U13.
  - E1 lista seis sondas para R5 y las seis salen rojas.
  - Cerrarlo exige otra enmienda con firma y otra ronda de Codex, por un error tipográfico de un token.
- **Corrección verificada (solo test, aplicada en el worktree desechable y revertida):** una fila con la forma de los dobles de R5:
  - título: `Ciudad de México, 31 de diciembre 08:00 → 20:00 del mismo día = 0`;
  - `from` = locales 2026, 11, 31, instante `'2026-12-31T14:00:00.000Z'`;
  - `to` = locales 2026, 11, 31, instante `'2027-01-01T02:00:00.000Z'`;
  - esperado `0`.
- **Qué comprobé de la corrección:**
  - Con HEAD sin mutar da 21/21.
  - Pone en rojo U19 (`-334`) y U26 (`365`).
  - También caen con ella U5, U11, U12 y U14.
- **Recomendación:** registrarlo como deuda con esta fila exacta, sin ampliarlo.

**N2 — INFO, anterior a #84 y fuera de su alcance. Las guardas de estado de la pantalla no tienen candado.**
- **Qué sobrevive.** Quitar `reminder.status === 'scheduled'` del filtro de la píldora (S19) o `!inactive` del badge (S22) deja la pantalla en 29/29.
- **Por qué.** Los recordatorios `sent` y `cancelled` de los tests previos usan el `dueAt` por defecto (`2026-08-27`) con el reloj real, así que ya están en el pasado.
- **Por qué no es de #84.** Esas guardas no son decisiones de días de calendario y ni la spec ni E1 las cubren. Por monotonía, las dos sobreviven también en `origin/main`: los tests de allí son un subconjunto de los de HEAD y la pantalla es la misma.
- **Recomendación:** si el leader lo ve útil, registrarlo como deuda aparte.

**N3 — INFO, se repite H5.** La trazabilidad de la ronda 2 entró en un único commit final (`c113e79b`). Codex dice que la fue actualizando en el árbol tras cada commit. Un commit no puede llevar su propio hash, así que el handoff admite esa lectura. Los hashes son correctos y ancestros de HEAD, así que no tiene impacto.

**N4 — INFO. R4 (smoke en dev build de Android) sigue siendo del humano.** La feature no puede pasar a `done` hasta que el humano marque su casilla.

### Comandos (exit medido sin pipe)
- `git rev-parse --short HEAD` → `c113e79b`, al empezar y al terminar. `git status --short` → vacío antes de escribir esta sección.
- `bunx jest --ci --silent --runTestsByPath … --json` en cada commit de la ronda: los `exit` de la tabla C4.
- En HEAD, en el worktree desechable:
  - `bunx jest … reminder-dates.test.ts reminders/index.test.tsx home/format.test.ts` → `exit=0`, 20 + 29 + 13 = 62;
  - `bunx tsc --noEmit` → `exit=0`, 0 bytes, sin `.expo/`;
  - `bun run lint` → `exit=0`.
- `bunx jest --ci --silent` (suite completa) con U19 y con U26 → `exit=0`, 82/82 y 1471/1471 en ambos casos (N1).
- `TZ=<zona> bunx jest --runTestsByPath …` en 13 zonas para el util y en 3 para la pantalla: resultados en H4.
- `git diff --quiet` de los puntos 2 y 6: `exit=0` en todos los casos.
- `merge-base --is-ancestor` de los 10 hashes → `0`.
- **No corrí `./init.sh` ni e2e**, por instrucción del leader: el Postgres y el LocalStack son compartidos.

### Output de ./init.sh (ronda 2)

Lo corrió el leader sobre este mismo tip `c113e79b`. Log:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f4719a40-0501-4a5f-80e7-b8287f1de20f/scratchpad/init-84-review2.log`
(18 570 líneas, mtime `2026-09-24 04:06 UTC`, posterior al commit `c113e79b` de `04:00:07 UTC`).
Medido sin pipe, la última línea es `EXIT 0`.

```
Test Suites: 170 passed, 170 total          # backend unit
Tests:       1298 passed, 1298 total
Test Suites: 2 passed, 2 total              # infra
Tests:       14 passed, 14 total
Test Suites: 82 passed, 82 total            # móvil
Tests:       1471 passed, 1471 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 27 passed, 27 of 30 total   # e2e
Tests:       8 skipped, 389 passed, 397 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
EXIT 0
```

- Móvil 82/1471 = la base de Codex (82/1452) +19 tests y +0 suites, el delta de E1 (§Recuentos).
- También cuadra con la ronda 1: 1467 + 4.
