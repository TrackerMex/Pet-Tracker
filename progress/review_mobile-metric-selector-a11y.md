# review: mobile-metric-selector-a11y (#74)
Fecha: 2026-09-28
Veredicto: APROBADO

> Revisado sobre `HEAD` `892c5543`, branch `feature/74-mobile-metric-selector-a11y`,
> opción de R3 firmada **A** (casilla de §Aprobación, firma `8f7aca56`). Todo lo
> marcado «con B» en la spec no aplica. Implementó Codex CLI (`ea01cec7..892c5543`).
> R6 (TalkBack en dev build de Android) queda para el humano y no bloquea este
> veredicto.
>
> Las comprobaciones que mutan el árbol (commits rojos y sondas) se corrieron en
> un worktree temporal desanclado en `892c5543`, con `node_modules` enlazado al
> del worktree principal. No se tocó `/home/claude/sites/Pet-Tracker` mientras
> el `init.sh` del leader corría. El worktree temporal ya está borrado, y el
> principal sigue limpio (`git status --short` vacío) en `892c5543`.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene solo `#74 mobile-metric-selector-a11y`
- [x] `progress/current.md` actualizado: describe la sesión de #74 hasta el handoff
- [x] Codex no tocó los artefactos del leader. `git diff --stat 2c2303a4..892c5543` lista solo `weekly-activity-chart.tsx`, `weekly-activity-chart.test.tsx`, `progress/impl_mobile-metric-selector-a11y.md` y `specs/mobile-metric-selector-a11y/traceability.md`. No aparecen `progress/current.md`, `progress/history.md`, `STATUS.md` ni `feature_list.json`

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica, el diff no toca el backend
- [x] repositories/contratos en domain son interfaces puras: no aplica
- [x] application depende de interfaces, no implementaciones: no aplica
- [x] infrastructure sin lógica de negocio: no aplica
- [x] En la app móvil no hay imports nuevos en producción. El test solo añade `import { Platform } from 'react-native'`. Ni la gráfica ni el test contienen `use-api` ni `useApi`, salvo la línea que ya existía, `expect(source).not.toContain('use-api');` (`#87 R19`)

## Checklist C4 — TDD
- [x] Cada R<n> con test lo nombra. `#74 R1: …`, `#74 R2: …` (dos `it`) y `#74 R3: …` (un `it.each` con dos filas). R4 y R5 no tienen test propio, y R6 es el gate humano. Los tres casos se declararon en la spec antes del handoff (§Qué firma el humano punto 7, y traceability.md §Requisitos sin test propio)
- [x] Historial test-primero: tres pares rojo/verde, luego R4 y el commit de docs. Todo lo verifiqué yo en el worktree temporal (tablas de abajo)
- [x] Las vías **b** de R2 y R3 respetan C4. Cada rojo versiona una mutación de **producción**, que toca solo `weekly-activity-chart.tsx`. No se muta ningún doble, y ningún rojo falla por `ReferenceError` ni `TypeError`

### Commits rojos y verdes, re-medidos (gráfica, `--runTestsByPath`, sin pipe)

| Commit | Rol | Blob gráfica | Blob test | exit | Tests | `it` rojos y matcher |
|---|---|---|---|---|---|---|
| `ea01cec7` | R1 rojo | `128c09bd` (base) | `567bc373` | 1 | 1 failed, 36 passed / 37 | `#74 R1 … › declara el rol radiogroup en el contenedor de las tres opciones`: `toBe` |
| `613a2e23` | R1 verde | `e8e6633b` | `567bc373` | 0 | 37 / 37 | — |
| `5911d142` | R2 rojo (P2red) | `e82cb355` | `c0ec0cb8` | 1 | 2 failed, 37 passed / 39 | los dos `it` de `#74 R2`: `toEqual` ×2 |
| `12afe47d` | R2 verde | `e8e6633b` | `c0ec0cb8` | 0 | 39 / 39 | — |
| `43115c35` | R3 rojo (P3redA) | `32de7886` | `ce1685a5` | 1 | 2 failed, 39 passed / 41 | las filas `android` e `ios` de `#74 R3`: `toEqual` ×2 |
| `ed868658` | R3 verde | `c258abed` | `ce1685a5` | 0 | 41 / 41 | — |
| `8ed1b9fc` | R4 | `c258abed` | `d9687b16` | 0 | 41 / 41 | — |
| `892c5543` | docs R5 | `c258abed` | `d9687b16` | 0 | 41 / 41 | — |

También corrí la suite móvil completa sobre los tres rojos, en el worktree temporal. Los únicos rojos de la suite son los `it` nombrados, y las cifras coinciden con las del handoff para la base 1545:

- `ea01cec7`: `exit=1`, `Test Suites: 1 failed, 82 passed, 83 total`, `Tests: 1 failed, 1545 passed, 1546 total`, `Snapshots: 1 passed, 1 total`.
- `5911d142`: `exit=1`, `Test Suites: 1 failed, 82 passed, 83 total`, `Tests: 2 failed, 1546 passed, 1548 total`.
- `43115c35`: `exit=1`, `Test Suites: 1 failed, 82 passed, 83 total`, `Tests: 2 failed, 1548 passed, 1550 total`.

Diffs de producción entre blobs, con `git diff <blob> <blob>`:

- `128c09bd → e8e6633b` (R1 verde): solo `+      accessibilityRole="radiogroup"` debajo de `testID="weekly-activity-metric"`.
- `e8e6633b → e82cb355` (P2red): `+      accessible` y `+      accessibilityLabel="Metrica"` debajo del rol, y `<Card testID="weekly-activity-card" accessible className="gap-2">`. Es la mutación literal de tasks.md §R2.
- El verde de R2 (`12afe47d`) devuelve la gráfica a `e8e6633b`.
- `e8e6633b → 32de7886` (P3redA): solo `-              minimumFontScale={METRIC_LABEL_MIN_FONT_SCALE}`.
- `e8e6633b → c258abed` (R3 verde): solo las dos líneas del comentario de A. El `checkout HEAD~1` restauró `e8e6633b`, y el comentario lo llevó a `c258abed`.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas «pendiente» en R1-R5. Solo R6 dice «pendiente», y es el gate humano
- [x] Todos los hashes citados existen y son ancestros de `HEAD`. `git cat-file -t` da `commit` y `git merge-base --is-ancestor <h> HEAD` da `exit=0` para `ea01cec7`, `613a2e23`, `5911d142`, `12afe47d`, `43115c35`, `ed868658` y `8ed1b9fc`
- [x] Los commits siguen el formato firmado en traceability.md §Convención de commit (`test|fix|docs(mobile): <desc> (R<n>)`). Además, los ocho mensajes son **literalmente** los del handoff y van en su orden: `diff` entre la lista del handoff y `git log --reverse --format=%s 2c2303a4..892c5543` da `exit=0`, y ningún commit tiene cuerpo
- [x] Codex solo cambió las dos columnas de hash en traceability.md, sin tocar ninguna otra celda

## Checklist C6 — Spec aprobada
- [x] `requirements.md`, `design.md`, `tasks.md` y `traceability.md` llevan `status: approved`. La casilla de §Aprobación está marcada con fecha 2026-09-28 y «opción de R3: A», y la firma es `8f7aca56`
- [x] No hay commits sobre `requirements.md`, `design.md` ni `tasks.md` después de la firma (`git log 8f7aca56..HEAD` sobre los tres está vacío)

## Checklist C7 — Sin código huérfano
- [x] N/A: esta feature no reemplaza ningún componente, use-case ni endpoint. R4 borra un mock de test muerto, y la spec sustituye un handoff sin ejecutar (`progress/handoff_mobile-home-weekly-activity_a11y.md`), que es un documento y no código

## Checklist C8 — UI móvil (docs/ui-guidelines.md)
- [x] Grep-clean. Las líneas añadidas no tienen hex, y `grep -ciE "stylesheet|text-\[10px\]"` da 0 en los dos ficheros. Tampoco hay clases arbitrarias nuevas, `StyleSheet.create` ni shadow/elevation
- [x] Dimensiones, safe areas y estados de carga: sin cambios, porque el diff no toca layout
- [x] Componentes compartidos. `card.tsx` sigue sin tocar (blob `ca32acde`, `git diff --exit-code` da 0), y la gráfica sigue usando `Card`
- [x] Tappables: sin cambios. Las tres opciones conservan su `Pressable` con rol `radio`, su estado y su `h-11`, que ya candaba `#68 R6`
- [x] Animaciones: ninguna nueva
- [x] §Decisiones fijas 6 (copy desde el catálogo). El diff no añade texto visible ni ningún `accessibilityLabel` en el árbol final. El `accessibilityLabel="Metrica"` solo existió en el rojo versionado de R2 y se revirtió. `catalog.ts`, `language-provider.test.tsx` y `ui-copy-table.ts` siguen sin tocar
- [x] §Diseño con candado, «rol y agrupación accesible» como invariante que inventariar. Esta feature cierra justo ese invariante con dos `expect` (R1 y R2), y deja sondas medidas
- [x] Nada del diff contradice la carta

## Verificaciones independientes del encargo

**1. Tautología.**
- Los esperados son literales del test: `'radiogroup'`, las dos listas cerradas de claves, y `true`, `0.85` y `1.2`.
- La única importación de producción que usan los bloques `#74` es `WEEKLY_METRICS`. Ya estaba importada y ya tiene su candado aparte: `expect(WEEKLY_METRICS).toEqual(['activeMinutes', 'distanceM', 'walkCount'])` en `expone la API acordada y monta la tarjeta con datos recibidos`.
- R2 compara `Object.keys(props).sort()` con `toEqual` contra listas cerradas.

**2. Sondas.** Re-medí las **12** de la opción A, no solo las 5 mínimas, en el worktree temporal y sobre el árbol final. Para cada una: comprobé el blob antes de medir, corrí la gráfica, restauré con `git checkout --`, y `git diff --exit-code -- mobile-pet-tracker/src` dio 0 en todos los casos.

| Sonda | Blob (= «Blob con A») | exit | Tests | Rojos y matcher | ¿= «Exigido»? | ¿= «medido» de Codex? |
|---|---|---|---|---|---|---|
| `collapse` | `7a89e8e7` | 1 | 1 failed / 41 | contenedor `toEqual` | sí | sí |
| `accessible` | `8ed18a4a` | 1 | 1 failed / 41 | contenedor `toEqual` | sí | sí |
| `arialabel` | `43b2d1ac` | 1 | 1 failed / 41 | contenedor `toEqual`, y el diff enseña `+   "aria-label"` | sí | sí |
| `rolealias` | `010f7e73` | 1 | 2 failed / 41 | R1 `toBe`, contenedor `toEqual` | sí | sí |
| `hide` | `93a80942` | 1 | 10 failed / 41 | los 6 de #68 (tres de R6, más R9, R12 y R13) y R1, contenedor y las dos filas de R3. Todos por `Unable to find an element with testID: …`, no por matcher | sí en número y nombres (ver obs. 1) | sí |
| `noRole` | `b34cc1ce` | 1 | 2 failed / 41 | R1 `toBe`, contenedor `toEqual` | sí | sí |
| `cardacc` | `8fc10f1c` | 1 | 1 failed / 41 | tarjeta `toEqual` | sí | sí |
| `cardpress` | `2a460368` | 1 | 1 failed / 41 | tarjeta `toEqual` | sí | sí |
| `nomfs` | `19a29055` | 1 | 2 failed / 41 | filas `android` e `ios`, `toEqual` ×2 | sí | sí |
| `mfs05` | `808d9db8` | 1 | 2 failed / 41 | filas `android` e `ios`, `toEqual` ×2 | sí | sí |
| `nomaxm` | `334e570a` | 1 | 2 failed / 41 | filas `android` e `ios`, `toEqual` ×2 | sí | sí |
| `branch` | `8b9d19fa` | 1 | 1 failed / 41 | fila `android`, `toEqual` | sí | sí |

**3. Comentario de R3.** `grep -n "Android ignores minimumFontScale" src/screens/home/weekly-activity-chart.tsx` da una sola línea, la 59. Las tres líneas a partir de ahí, comprobadas con `cat -A` (sin espacios finales):

```
// Android ignores minimumFontScale: RN 0.86.2 only reads minimumFontSize, which
// <Text> does not expose, so the shrink floor there is 4 dp (#74 R3).
const METRIC_LABEL_MIN_FONT_SCALE = 0.85;
```

Es el literal de tasks.md §R3 (2) «Con A», y cumple la regla de `#` (`#74 R3`).

**4. Greps de R4** (test):
- `jest.mock('uniwind'`: 0.
- `uniwind`: 0.
- `useUniwind`: 0.
- `mockTheme`: 5. Son la declaración, el mock de `use-theme-colors`, el `beforeEach` y los dos usos del `describe` de R9.
- El diff borra exactamente 5 líneas: el bloque de 4 y la línea en blanco.

**5. Greps de R5.4** (gráfica, salvo `use-api`):
- `style={CONTINUOUS_CORNER}`: 1.
- `style={TABULAR_NUMS}`: 4.
- `accessibilityRole="radiogroup"`: 1.
- `Platform`: 0.
- `stylesheet|text-[10px]`: 0 y 0.
- `use-api` en el test: 1, en la línea 501 `expect(source).not.toContain('use-api');`.
- `use-api|useApi` en la gráfica: 0.

**6. R5.3, `tsc` y `eslint`** en el worktree temporal. `test ! -e .expo/types/router.d.ts` da `exit=0`. `bunx tsc --noEmit` da `exit=0`, sin salida. `bunx eslint` de los dos ficheros da `exit=0`, sin salida.

**7. R5.4, R5.5 y R5.6.**
- `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista solo los dos ficheros de la gráfica (`2 files changed, 84 insertions(+), 5 deletions(-)`). `origin/main` es `a07b67c4`, que coincide con el merge-base.
- `git diff --exit-code origin/main...HEAD` sobre `package.json`, `bun.lock`, `src/i18n/catalog.ts`, `src/components/card.tsx`, `language-provider.test.tsx`, `ui-copy-table.ts`, `home/index.tsx` e `index.test.tsx` da 0.
- Blobs finales: gráfica `c258abedde92d2be981be8507d3d898f13c612cb` y test `d9687b162d20a2905b20f3c06158c619cb440d7a`. Coinciden con tasks.md §R5.6, opción A.
- Delta: la base era 83 / 1545 / 1 (medida por el leader en `8f7aca56` y por Codex) y el cierre es 83 / 1550 / 1. Son +0 suites y +5 tests, lo firmado.

**8. Proceso.** El reporte trae `pwd` y la branch al principio. Dice qué skills se cargaron: `expo:building-native-ui` (el nombre del catálogo v1.0.2 que pedía el handoff) y `ponytail:ponytail`, y deja fuera `appllama-app-design-skill` con su motivo. Todo lo demás, comprobado arriba.

## Observaciones

Ninguna bloquea el veredicto: todas son no bloqueantes.

1. **La sonda `hide` rompe la nota de matchers de tasks.md §Sondas.** La tabla «Exigido» se cumple: 10 rojos, con los nombres esperados. Pero la nota general («Todos los rojos de `#74` son por `toEqual`, salvo R1, que es por `toBe`») no se cumple en esta sonda. `importantForAccessibility="no-hide-descendants"` saca el subárbol de las consultas de RNTL, así que los 10 `it` fallan en `getByTestId` («Unable to find an element with testID: weekly-activity-metric…») antes de llegar al `expect`. El fallo es de la spec, que no previó el caso, y no de la implementación. Codex lo reportó tal cual, sin tocar ninguna aserción, que es lo que pedía la spec. Lo he confirmado con mi propio log.
2. **La fila R5 de traceability.md cita `8ed1b9fc` y no `892c5543`.** Es el último commit que fija el árbol de código medido, y un commit no puede escribir su propio hash. Codex lo declara como la única decisión que la spec no cerró literalmente. Es razonable, y no deja la fila en «pendiente».
3. **Los e2e se saltan 3 suites y 8 tests** (`Test Suites: 3 skipped, 27 passed, 27 of 30 total`). No es cosa de #74: los cierres anteriores (`init124.log` e `init126.log` del scratchpad del leader) dan exactamente las mismas cifras.
4. **(F)** *Nota de matchers de las sondas en futuras specs:* las sondas que ocultan subárboles fallan por la consulta y no por el matcher. Las plantillas de §Sondas deberían distinguir «rojo por aserción» de «rojo por consulta», para que el implementer no tenga que interpretarlo. Es un candidato sin id, que asignará el leader.

## Output de ./init.sh

Lo corrió el leader con permiso del humano sobre `892c5543`. El fichero `74_init_head` da `892c5543da1207ecf8bb7c431f341e9c2bdccd4c`, igual que `git rev-parse HEAD`. El fichero `74_init_exit` da `EXIT=0`. Leí el log crudo entero (`74_init.log`, 19 515 líneas sin ANSI). Estas son las líneas que deciden:

```
EXIT=0

→ Ejecutando tests...
> backend-pet-tracker@0.0.1 test /home/claude/sites/Pet-Tracker/backend-pet-tracker
Test Suites: 171 passed, 171 total
Tests:       1307 passed, 1307 total
Snapshots:   0 total

> pet-tracker-infra@0.0.1 test /home/claude/sites/Pet-Tracker/infra
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total

(tests TAP de init: # tests 28 / # fail 0; # tests 5 / # fail 0; # tests 15 / # fail 0)

(móvil)
Test Suites: 83 passed, 83 total
Tests:       1550 passed, 1550 total
Snapshots:   1 passed, 1 total
✅ Tests pasados

→ Tests e2e...
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 389 passed, 397 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

La suite móvil da 83 / 1550 / 1, lo esperado. El log trae 30 bloques `● Console`, como la base, y son ruido. Después del `init.sh`, el worktree principal sigue limpio.
