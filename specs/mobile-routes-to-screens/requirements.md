---
feature: "mobile-routes-to-screens"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, refactor]
---

# Requisitos — [[mobile-routes-to-screens]] (#102)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D14) y [[tasks]] para el orden
> de commits. Reglas de capas: [[../../docs/architecture|architecture]].
> Carta de UI (C8): [[../../docs/ui-guidelines|ui-guidelines]].

## 0. Qué es esta feature, en una frase

Mover el cuerpo de **cuatro** rutas anteriores a #39 de
`mobile-pet-tracker/src/app/(tabs)/<x>.tsx` al patrón vigente *route delgado +
`src/screens/<x>/index.tsx`*, y mover sus tests junto al screen body.
**Refactor puro: cero cambio de comportamiento, cero cambio de aserción.**
La suite existente es el candado y no se le añade ni se le quita un solo test.

## 0.1 Contexto verificado (medido en este worktree, no heredado)

Todo lo de esta sección se midió contra el árbol en
`/home/claude/sites/Pet-Tracker-wt-ui`, branch `feature/102-mobile-routes-to-screens`,
cortada de `origin/main` en `3a52028b`. **Tres datos que circulaban eran falsos**
y se corrigen aquí (lección `premisas-de-explore-sin-verificar`).

| # | Hecho | Estado |
|---|---|---|
| 1 | `map.tsx` son **406** líneas | **CORRIGE** a `feature_list.json` #102 y al encargo, que decían 388. `3a52028b` es el merge de PR #143 (#94), que engordó el fichero. `git show '3a52028b:mobile-pet-tracker/src/app/(tabs)/map.tsx' \| wc -l` → 406 |
| 2 | `food.tsx` son **374** líneas | **CORRIGE** a `feature_list.json` #102, que dice 325. #98 lo engordó |
| 3 | `ui-copy-table.ts` tiene **87** ocurrencias de `(tabs)`, no 90 | **CORRIGE** al encargo. De esas 87, **68** son de las cuatro rutas de esta feature y **19** son de `food.tsx`, que no se toca |
| 4 | Los cuerpos de pantalla **no cambian ni un import** | `src/app/(tabs)/<x>.tsx` y `src/screens/<x>/index.tsx` están ambos a profundidad 3 bajo `src/`. Verificado: `map.tsx:14-35` y `screens/home/index.tsx:28-63` usan los dos el prefijo `'../../'` |
| 5 | Los tests **sí** cambian de prefijo, un nivel menos | `src/app/(tabs)/__tests__/map.test.tsx:18` usa `'../../../api/pets'`; `src/screens/home/index.test.tsx:16` usa `'../../api/activity'`. El helper compartido pasa de `'../../../../test/render-with-providers'` a `'../../../test/render-with-providers'` |
| 6 | `ui-language.test.ts` **no se edita** | No contiene ni una sola ocurrencia literal de `(tabs)` (`grep -n '(tabs)'` → vacío). Ver R7 |
| 7 | Baseline total, sin pipe | `Test Suites: 77 passed` · `Tests: 1386 passed` · `JEST_EXIT=0` |
| 8 | Baseline por suite, sin pipe | `map` 58 · `health` 28 · `weight-log` 32 · `meal-schedule` 23 · `screens` 2 · `design-drift` 41 · `consistency-classnames` 57 · `legibility-classnames` 26 · `ui-language` 25 · `ui-copy-table` 2 |
| 9 | Los cinco candados son los **únicos** sitios del repo que nombran las cuatro rutas | `grep -rn` sobre `src/` y `test/` por `(tabs)/map`, `'../map'`, `join('app','(tabs)','map.tsx')` y sus tres hermanos no devuelve nada fuera de esos cinco ficheros y de los propios tests que se mueven. `_layout.tsx` y `floating-tab-bar.tsx` referencian el **nombre de ruta** (`"map"`), no el fichero, y Expo Router lo sigue resolviendo porque el fichero de ruta permanece |

## 0.2 Alcance: CUATRO rutas. `food.tsx` queda fuera

El criterio de aceptación 4 de la entrada #102 autoriza literalmente esta
recorte: *"#98 mergeada antes de empezar, **o food.tsx queda fuera de esta
feature**"*.

#98 está mergeada, pero **#106 + #107 están `in_progress` ahora mismo** editando
`src/app/(tabs)/food.tsx` y `src/app/(tabs)/__tests__/food.test.tsx`
(verificado en `specs/mobile-meals-bar-motion/design.md:192-195` desde el
worktree principal). Mover esos dos ficheros bajo los pies de Codex rompería la
regla de **un solo escritor sobre el working tree** de `CLAUDE.md`.

La intersección de ficheros entre #102 y #106/#107 es **vacía**: su §D10 sacó a
propósito su candado de `design-drift.test.ts` y lo metió en `food.test.tsx`,
así que los cinco candados compartidos son de #102 sin disputa.

Las cuatro rutas que entran:

| Ruta | Líneas | Test hoy | Tests |
|---|---|---|---|
| `src/app/(tabs)/map.tsx` | **406** | `src/app/(tabs)/__tests__/map.test.tsx` | 58 |
| `src/app/(tabs)/weight-log.tsx` | 341 | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 32 |
| `src/app/(tabs)/meal-schedule.tsx` | 324 | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 23 |
| `src/app/(tabs)/health.tsx` | 279 | `src/app/(tabs)/__tests__/health.test.tsx` | 28 |

## 0.3 Cómo se prueba un refactor puro — C4 vía (b), declarado antes del handoff

`CHECKPOINTS.md` C4 exige que un requisito que **solo asevera una propiedad** de
artefactos ya presentes declare por escrito, antes del handoff, cuál de las dos
vías usa. **Esta spec elige la vía (b) para R2–R9**, y define la mutación así:

> **La mutación es el propio movimiento.** El commit rojo de cada ruta mueve el
> cuerpo y el test a `src/screens/<x>/` y **deja los cinco candados compartidos
> apuntando a la ruta vieja**. Los candados se ponen **rojos por su propia
> aserción** — `readFileSync` sobre un fichero que ya no existe, y recuentos que
> no cuadran —, que es exactamente el drift para el que fueron escritos. El
> commit verde repunta los candados y la suite vuelve a 77/1386.

Esto **no** es ninguno de los dos patrones que C4 prohíbe:

- No es un `ReferenceError` de un helper de test que aún no existe (C4, punto
  cuarto): el rojo lo produce el candado leyendo el árbol de producción.
- No es la mutación de un doble de test (C4, punto quinto): no se toca ningún
  mock. Lo que se mueve es **código de producción**, y el candado lo ve.

El rojo se acota a propósito: el commit rojo **sí** arregla los imports del test
que se mueve, de modo que `map.test.tsx` siga en 58/58 verde y el rojo quede
**solo** en los candados compartidos. Así la evidencia es atribuible candado a
candado, y no queda enmascarada por un fallo de resolución de módulo.

---

## Requisitos funcionales

### R1 — Enmienda a `docs/conventions.md:445-446` (gate humano propio)

`docs/conventions.md:445-446` dice hoy, literalmente:

```
  - Las pantallas anteriores a #39 NO se migran en frío: se mueven a este
    patrón solo cuando una feature las toque de fondo.
```

Esta feature **contradice esa convención vigente**. El humano abrió la entrada a
sabiendas el 2026-09-21 y la propia entrada dice que *"la spec debe empezar por
enmendar esa viñeta de conventions.md o el trabajo entero queda fuera de norma, y
esa enmienda necesita su propia firma"*.

- **R1**: WHEN el humano firma la casilla de §Aprobación de la enmienda R1, THE
  SYSTEM SHALL sustituir las líneas 445-446 de `docs/conventions.md` por un texto
  que (a) **mantenga** la prohibición general de migrar en frío, (b) **nombre la
  excepción única** que autoriza #102, y (c) **fije el precio** de cualquier
  excepción futura, de modo que la viñeta siga siendo útil y no quede como puerta
  abierta a migraciones en frío arbitrarias.

  **Texto normativo de la enmienda** (esto es lo que Codex escribe, literal;
  sustituye a las dos líneas actuales):

  ```
    - Las pantallas anteriores a #39 NO se migran en frío: se mueven a este
      patrón solo cuando una feature las toque de fondo.
      **Excepción nombrada (enmienda A10 de #102, 2026-09-22)**: se admite una
      migración en frío si, y solo si, la feature que la pide cumple las cuatro
      condiciones a la vez — (1) es un refactor puro, sin un solo cambio de
      aserción ni de comportamiento; (2) declara el recuento de tests por suite
      antes y después, y ambos son idénticos; (3) no solapa ficheros con
      ninguna feature `in_progress`; y (4) su spec trae la enmienda a esta
      viñeta con su propia casilla de firma humana. Una migración en frío que
      no cumpla las cuatro sigue prohibida, y "ya que estamos" nunca es
      justificación: la regla por defecto no cambia.
  ```

  *Test / comprobación exacta*: no hay test automático — es una enmienda a un
  doc, y su gate es la casilla de §Aprobación → *Enmienda R1*. El `reviewer`
  comprueba dos cosas observables: (a) `grep -n 'enmienda A10 de #102'
  docs/conventions.md` devuelve exactamente una línea, y (b) la viñeta conserva
  la frase `NO se migran en frío`. **R1 se cierra antes de que Codex toque una
  sola línea de `mobile-pet-tracker/`.**

### R2 — `map` se muda a `src/screens/map/`

- **R2** *(requisito de verificación; vía (b) de C4, ver §0.3)*: WHEN corre la
  suite móvil tras el commit verde de `map`, THE SYSTEM SHALL encontrar el cuerpo
  de la pantalla del Mapa en `mobile-pet-tracker/src/screens/map/index.tsx`
  exportado como **`export function MapScreen()`** (named, no default), su test
  en `mobile-pet-tracker/src/screens/map/index.test.tsx` con sus **58** tests
  intactos, y `mobile-pet-tracker/src/app/(tabs)/map.tsx` reducido **exactamente**
  a este cuerpo y nada más:

  ```tsx
  import { MapScreen } from '../../screens/map';

  export default function MapRoute() {
    return <MapScreen />;
  }
  ```

  Y THE SYSTEM SHALL dejar los siguientes candados apuntando a la ruta nueva,
  **sin mover ni un recuento**:

  | Candado | Sitio | Valor viejo | Valor nuevo |
  |---|---|---|---|
  | `src/__tests__/ui-copy-table.ts` | `R4_MAP`, `:102-118` | `file: 'src/app/(tabs)/map.tsx'` ×**17** | `file: 'src/screens/map/index.tsx'` ×**17** |
  | `src/__tests__/consistency-classnames.test.ts` | `:277` | `[join('app','(tabs)','map.tsx'), 4]` | `[join('screens','map','index.tsx'), 4]` |
  | `src/__tests__/consistency-classnames.test.ts` | `:341` | `[join('app','(tabs)','map.tsx'), 3]` | `[join('screens','map','index.tsx'), 3]` |
  | `src/__tests__/legibility-classnames.test.ts` | `:126` | `[join('app','(tabs)','map.tsx'), 2]` | `[join('screens','map','index.tsx'), 2]` |
  | `src/__tests__/design-drift.test.ts` | `:433` (`#87 R19`) | `'app/(tabs)/map.tsx': 0` | `'screens/map/index.tsx': 0` |
  | `src/__tests__/design-drift.test.ts` | `:529` (`#94 R10`) | `'app/(tabs)/map.tsx': 1` | `'screens/map/index.tsx': 1` |
  | `src/__tests__/design-drift.test.ts` | `:84-86` (ternario) | ver **R6** | ver **R6** |

  *Rojo esperado (vía b)*: en el commit de movimiento, sin repuntar candados,
  `bunx jest --runTestsByPath 'src/__tests__/ui-copy-table.ts'
  'src/__tests__/ui-language.test.ts' 'src/__tests__/design-drift.test.ts'
  'src/__tests__/consistency-classnames.test.ts'
  'src/__tests__/legibility-classnames.test.ts'` termina **rojo**, por ENOENT
  sobre `src/app/(tabs)/map.tsx` en las aserciones de esos candados.

  *Test que lo cierra*: `mobile-pet-tracker/src/screens/map/index.test.tsx`
  (58 tests, idénticos) más las cinco suites de candado arriba, todas verdes en
  sus recuentos de §0.1(8).

### R3 — `health` se muda a `src/screens/health/`

- **R3** *(requisito de verificación; vía (b) de C4)*: WHEN corre la suite móvil
  tras el commit verde de `health`, THE SYSTEM SHALL encontrar el cuerpo en
  `mobile-pet-tracker/src/screens/health/index.tsx` como
  **`export function HealthScreen()`**, su test en
  `mobile-pet-tracker/src/screens/health/index.test.tsx` con sus **28** tests
  intactos, y `src/app/(tabs)/health.tsx` reducido al route delgado
  (`HealthRoute` → `<HealthScreen />`, forma literal de R2). Y THE SYSTEM SHALL
  repuntar estos candados sin mover ningún recuento:

  | Candado | Sitio | Valor viejo | Valor nuevo |
  |---|---|---|---|
  | `ui-copy-table.ts` | `R5_HEALTH`, `:122-134` | `'src/app/(tabs)/health.tsx'` ×**13** | `'src/screens/health/index.tsx'` ×**13** |
  | `consistency-classnames.test.ts` | `:110` (`#62 R2`, skeleton) | `join('app','(tabs)','health.tsx')` | `join('screens','health','index.tsx')` |
  | `consistency-classnames.test.ts` | `:275` | `[…'health.tsx'), 2]` | `[join('screens','health','index.tsx'), 2]` |
  | `consistency-classnames.test.ts` | `:351` | `[…'health.tsx'), 2]` | `[join('screens','health','index.tsx'), 2]` |
  | `legibility-classnames.test.ts` | `:124` (`#61 R4`, tinta) | `[…'health.tsx'), 1]` | `[join('screens','health','index.tsx'), 1]` |
  | `legibility-classnames.test.ts` | `:155` (`#61 R5`, warning) | `join('app','(tabs)','health.tsx')` | `join('screens','health','index.tsx')` |
  | `design-drift.test.ts` | `:432` (`#87 R19`) | `'app/(tabs)/health.tsx': 0` | `'screens/health/index.tsx': 0` |
  | `design-drift.test.ts` | `:84-86` (ternario) | ver **R6** | ver **R6** |

  *Test que lo cierra*: `src/screens/health/index.test.tsx` (28) más las suites
  de candado en sus recuentos de §0.1(8).

### R4 — `weight-log` se muda a `src/screens/weight-log/`

- **R4** *(requisito de verificación; vía (b) de C4)*: WHEN corre la suite móvil
  tras el commit verde de `weight-log`, THE SYSTEM SHALL encontrar el cuerpo en
  `mobile-pet-tracker/src/screens/weight-log/index.tsx` como
  **`export function WeightLogScreen()`**, su test en
  `mobile-pet-tracker/src/screens/weight-log/index.test.tsx` con sus **32** tests
  intactos, y `src/app/(tabs)/weight-log.tsx` reducido al route delgado
  (`WeightLogRoute` → `<WeightLogScreen />`). Y THE SYSTEM SHALL repuntar:

  | Candado | Sitio | Valor viejo | Valor nuevo |
  |---|---|---|---|
  | `ui-copy-table.ts` | `R5_HEALTH`, `:135-153` | `'src/app/(tabs)/weight-log.tsx'` ×**19** | `'src/screens/weight-log/index.tsx'` ×**19** |
  | `consistency-classnames.test.ts` | `:174` (`#62 R3`, tile) | `readSource(join('app','(tabs)','weight-log.tsx'))` | `readSource(join('screens','weight-log','index.tsx'))` |
  | `consistency-classnames.test.ts` | `:279` | `[…'weight-log.tsx'), 1]` | `[join('screens','weight-log','index.tsx'), 1]` |
  | `consistency-classnames.test.ts` | `:352` | `[…'weight-log.tsx'), 2]` | `[join('screens','weight-log','index.tsx'), 2]` |
  | `design-drift.test.ts` | `:435` (`#87 R19`) | `'app/(tabs)/weight-log.tsx': 1` | `'screens/weight-log/index.tsx': 1` |
  | `design-drift.test.ts` | `:84-86` (ternario) | ver **R6** | ver **R6** |

  **Ojo, `weight-log` vive dentro del bloque `R5_HEALTH`** de `ui-copy-table.ts`,
  no en un bloque propio. `ui-language.test.ts:133` fija
  `expect(R5_HEALTH).toHaveLength(32 + 1)`; **ese 33 no se mueve**, porque
  cambiar el campo `file` de 19 filas no cambia cuántas filas hay.

  *Test que lo cierra*: `src/screens/weight-log/index.test.tsx` (32) más las
  suites de candado en sus recuentos de §0.1(8).

### R5 — `meal-schedule` se muda a `src/screens/meal-schedule/`

- **R5** *(requisito de verificación; vía (b) de C4)*: WHEN corre la suite móvil
  tras el commit verde de `meal-schedule`, THE SYSTEM SHALL encontrar el cuerpo
  en `mobile-pet-tracker/src/screens/meal-schedule/index.tsx` como
  **`export function MealScheduleScreen()`**, su test en
  `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx` con sus **23**
  tests intactos, y `src/app/(tabs)/meal-schedule.tsx` reducido al route delgado
  (`MealScheduleRoute` → `<MealScheduleScreen />`). Y THE SYSTEM SHALL repuntar:

  | Candado | Sitio | Valor viejo | Valor nuevo |
  |---|---|---|---|
  | `ui-copy-table.ts` | `R6_FOOD`, `:177-195` | `'src/app/(tabs)/meal-schedule.tsx'` ×**19** | `'src/screens/meal-schedule/index.tsx'` ×**19** |
  | `consistency-classnames.test.ts` | `:278` | `[…'meal-schedule.tsx'), 1]` | `[join('screens','meal-schedule','index.tsx'), 1]` |
  | `legibility-classnames.test.ts` | `:92` (`#61 R3`) | `join('app','(tabs)','meal-schedule.tsx')` | `join('screens','meal-schedule','index.tsx')` |
  | `design-drift.test.ts` | `:434` (`#87 R19`) | `'app/(tabs)/meal-schedule.tsx': 1` | `'screens/meal-schedule/index.tsx': 1` |
  | `design-drift.test.ts` | `:84-86` (ternario) | ver **R6** | ver **R6** |

  **Ojo, `meal-schedule` vive dentro del bloque `R6_FOOD`** de `ui-copy-table.ts`,
  compartido con `food.tsx`. `ui-language.test.ts:140` fija
  `expect(R6_FOOD).toHaveLength(35 + 3)`; **ese 38 no se mueve**. Las **19** filas
  de `food.tsx` dentro de ese mismo bloque **no se tocan** (§0.2).

  *Test que lo cierra*: `src/screens/meal-schedule/index.test.tsx` (23) más las
  suites de candado en sus recuentos de §0.1(8).

### R6 — el ternario de `design-drift.test.ts` **se invierte**, no se colapsa

`src/__tests__/design-drift.test.ts:83-88` resuelve hoy la ruta de cada pantalla
del `describe.each` de `R3` (*"%s importa el Card compartido"*) así:

```ts
screen === 'profile' || screen === 'home'
  ? join(sourceRoot, 'screens', screen, 'index.tsx')
  : join(sourceRoot, 'app', '(tabs)', `${screen}.tsx`),
```

El `describe.each` lista siete pantallas: `home`, `food`, `meal-schedule`,
`health`, `weight-log`, `profile`, `map`. Tras esta feature, **seis de las siete
viven en `screens/` y solo `food` sigue en `app/(tabs)/`** — porque `food` queda
fuera (§0.2).

> **Corrección explícita a una premisa del encargo.** El encargo sugería que
> *"tras la migración las cuatro viven en `screens/`, así que el ternario sobra:
> puede colapsar a una sola rama"*. **Es falso con el alcance de cuatro rutas**:
> colapsar a `join(sourceRoot,'screens',screen,'index.tsx')` haría que la rama de
> `food` leyera `src/screens/food/index.tsx`, que no existe → ENOENT → rojo.
> El ternario no sobra: **se invierte**.

- **R6** *(requisito de verificación; vía (b) de C4)*: WHEN corre
  `src/__tests__/design-drift.test.ts` tras el commit verde de `meal-schedule`,
  THE SYSTEM SHALL resolver la ruta de las siete pantallas del `describe.each` de
  `R3` con **una sola condición nombrada sobre `food`**, en esta forma exacta:

  ```ts
  screen === 'food'
    ? join(sourceRoot, 'app', '(tabs)', `${screen}.tsx`)
    : join(sourceRoot, 'screens', screen, 'index.tsx'),
  ```

  y THE SYSTEM SHALL conservar intacta la aserción que sigue,
  `expect(contents).toContain("from '../../components/card'")`, **sin tocar ni un
  carácter** — que es legítima porque las dos formas de fichero están a la misma
  profundidad (§0.1(4)).

  **Durante los commits intermedios** (R2–R4), la condición crece nombrando la
  ruta ya migrada (`screen === 'profile' || screen === 'home' || screen === 'map'`,
  y así), de modo que la suite quede verde en **cada** commit. La forma invertida
  de arriba es el paso **(3) refactor** del bloque de R5 en [[tasks]], no un
  commit aparte.

  *Test que lo cierra*: `src/__tests__/design-drift.test.ts`,
  `describe('R3: Card compartido elimina rounded arbitrario')`, **41** tests en
  la suite — el mismo número que en §0.1(8).

### R7 — los tests mudados entran en el escaneo de `design-drift` y no lo ensucian

Hay una asimetría entre los tres candados que recorren directorios, y **es la
trampa silenciosa de esta feature**:

| Fichero | `sourceFiles()` excluye… | Consecuencia al mudar los tests |
|---|---|---|
| `src/__tests__/consistency-classnames.test.ts:24-36` | carpetas `__tests__/` **y** ficheros `*.test.tsx` colocados | **inmune** |
| `src/__tests__/legibility-classnames.test.ts:24-36` | carpetas `__tests__/` **y** ficheros `*.test.tsx` colocados | **inmune** |
| `src/__tests__/design-drift.test.ts:25-35` | **solo** carpetas `__tests__/` | **expuesto**: los cuatro tests mudados dejan de estar en una carpeta `__tests__/` y entran por primera vez en el escaneo |

Los tres consumidores expuestos en `design-drift.test.ts` son
`C8 → filesMatching(/[A-Za-z0-9_-]+-\[[^\]]+\]/)`,
`R3 → filesContaining('rounded-[20px]')` y
`R4 → filesContaining('text-[10px]')`, los tres con `.toEqual([])`.

- **R7** *(requisito de verificación; vía (b) de C4)*: WHILE los cuatro tests
  mudados viven en `src/screens/<x>/index.test.tsx` —fuera de toda carpeta
  `__tests__/` y por tanto dentro del escaneo de
  `design-drift.test.ts:sourceFiles()`—, THE SYSTEM SHALL mantener en **cero** las
  tres listas de violación de `design-drift.test.ts`, sin añadir ninguna excepción,
  sin lista de exclusión y **sin modificar `sourceFiles()`**.

  **`sourceFiles()` de `design-drift.test.ts` es intocable.** Modificarlo fue el
  bloqueante **H1** que hizo **RECHAZAR** la ronda 1 de #94
  (`specs/mobile-map-staleness-single-source/requirements.md` §E2). Si algún día
  entra un fichero sucio, se limpia el fichero, no el helper.

  *Comprobación exacta que lo cierra*: medido hoy contra el árbol, los cuatro
  tests traen **cero** coincidencias de las tres formas —
  `grep -cE "[A-Za-z0-9_-]+-\[[^]]+\]"` da `0` en los cuatro, y
  `grep -n 'rounded-\[20px\]\|text-\[10px\]'` no devuelve nada —, así que el
  requisito **ya se cumple por construcción** y el candado se limita a vigilarlo.
  Codex **vuelve a medirlo después de mudar** y lo escribe en
  `progress/impl_mobile-routes-to-screens.md`. El cierre observable es
  `bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'` → **41 passed,
  exit 0**.

### R8 — el recuento no se mueve: 77 suites, 1386 tests, y typecheck limpio

- **R8** *(requisito de verificación; vía (b) de C4)*: WHEN corre la suite móvil
  completa tras el último commit de la feature, THE SYSTEM SHALL reportar
  **exactamente** `Test Suites: 77 passed, 77 total` y
  `Tests: 1386 passed, 1386 total` con **exit code 0**, y cada suite tocada SHALL
  reportar **exactamente** el recuento que ya tenía:

  | Suite (ruta **tras** la feature) | Tests, antes y después |
  |---|---|
  | `src/screens/map/index.test.tsx` | **58** |
  | `src/screens/health/index.test.tsx` | **28** |
  | `src/screens/weight-log/index.test.tsx` | **32** |
  | `src/screens/meal-schedule/index.test.tsx` | **23** |
  | `src/app/(tabs)/__tests__/screens.test.tsx` | **2** |
  | `src/__tests__/design-drift.test.ts` | **41** |
  | `src/__tests__/consistency-classnames.test.ts` | **57** |
  | `src/__tests__/legibility-classnames.test.ts` | **26** |
  | `src/__tests__/ui-language.test.ts` | **25** |
  | `src/__tests__/ui-copy-table.ts` | **2** |

  Y THE SYSTEM SHALL dejar `bunx tsc --noEmit` **sin una sola salida** y con exit
  0, y `mobile-pet-tracker/package.json` **sin una sola dependencia nueva**
  (`git diff --stat` sobre `package.json` y `bun.lock` debe ser **vacío**).

  Y THE SYSTEM SHALL presentar los movimientos como **renames** ante git: para
  cada una de las cuatro rutas, `git log --stat -M` (o
  `git diff -M --stat <commit>^ <commit>`) SHALL mostrar el par
  `src/app/(tabs)/<x>.tsx → src/screens/<x>/index.tsx` y
  `src/app/(tabs)/__tests__/<x>.test.tsx → src/screens/<x>/index.test.tsx`, y el
  diff de contenido del **cuerpo de pantalla** SHALL ser **vacío salvo la línea de
  export** (`export default function XScreen()` → `export function XScreen()`).

  *Comprobación exacta*, sin pipe en ningún caso (lección `exit-code-tras-pipe`:
  `./cmd | tail` devuelve el código de `tail`, no el del comando):

  ```bash
  cd mobile-pet-tracker
  rm -f .expo/types/router.d.ts
  bun run test > /tmp/final.txt; echo "JEST_EXIT=$?"
  bunx tsc --noEmit > /tmp/tsc.txt; echo "TSC_EXIT=$?"
  ```

### R9 — `food.tsx` queda como deuda nombrada y los datos falsos se corrigen

- **R9**: WHEN se cierra la feature, THE SYSTEM SHALL dejar registrado en
  `feature_list.json` que la migración de `src/app/(tabs)/food.tsx` **no** entra
  en #102 y por qué, con el tamaño **corregido a 374 líneas** (la entrada dice
  325) y el de `map.tsx` **corregido a 406** (la entrada dice 388), de modo que
  quien reabra la deuda no herede los tres números falsos de §0.1.

  *Comprobación exacta que lo cierra*: tras el cierre,
  `grep -c '325' ` sobre la descripción de #102 en `feature_list.json` SHALL dar
  **0**, y la descripción SHALL contener la cadena `food.tsx` junto a la razón
  (#106/#107 `in_progress` sobre ese fichero). Lo verifica el `reviewer` leyendo
  la entrada; no hay test automático porque `feature_list.json` es harness, no
  código.

---

## Fuera de alcance

Cada viñeta clasificada, y con su premisa verificada (lección
`fuera-de-alcance-no-todo-es-feature`): **[D]** = delimitación de esta feature,
**[F]** = trabajo futuro real.

- **[D] `food.tsx` y `food.test.tsx`.** No se tocan. Razón en §0.2: #106/#107
  los tienen en vuelo. **[F]** su migración, cuando #106/#107 mergeen — R9 la
  deja nombrada.
- **[D] Añadir un test de delegación al route delgado.** Las migraciones
  anteriores (#78 `alerts`, `profile`) dejaron en `(tabs)/__tests__/<x>.test.tsx`
  un test pequeño que mockea el módulo de pantalla y asevera que la ruta delega
  (`src/app/(tabs)/__tests__/profile.test.tsx`, `R2: route Profile delgada`).
  **Esta feature NO lo hace**: sería una aserción nueva y subiría el total a
  1390, contra el criterio de aceptación 3 de la entrada (*"el recuento de tests
  por suite es idéntico antes y después"*) y contra R8. Ver [[design]] **D7**.
  **[F]** si se quiere esa cobertura, es una feature aparte con su propio delta
  declarado.
- **[D] `src/app/(tabs)/__tests__/screens.test.tsx`.** No se toca. Premisa
  verificada: importa **solo** `ProfileScreen from '../profile'`, y `profile.tsx`
  ya es route delgado; ninguna de las cuatro rutas de #102 aparece en él. Sus
  **2** tests siguen donde están. Ver [[design]] **D8**.
- **[D] La carpeta `src/app/(tabs)/__tests__/` no desaparece.** Premisa
  verificada: tras la feature le quedan **cinco** ficheros — `alerts.test.tsx`,
  `food.test.tsx`, `layout.test.tsx`, `profile.test.tsx`, `screens.test.tsx`.
  Ver [[design]] **D9**.
- **[D] `src/__tests__/ui-language.test.ts` no se edita.** Premisa verificada en
  §0.1(6): no contiene ni una ocurrencia de `(tabs)`, y todos sus `toHaveLength`
  miden **longitudes de bloque** de `ui-copy-table.ts`, no rutas. Ver **R7** y
  [[design]] **D5**.
- **[D] `design-drift.test.ts:127-130`** (los cuatro *entrypoints delgados* de
  `#94 R9`: `home`, `profile`, `pets/add`, `pets/[petId]/docs`). **No se amplía**
  con las cuatro rutas nuevas aunque ahora también sean delgadas: sería una
  aserción nueva. Ver [[design]] **D10**. **[F]** ampliarlo es la misma feature
  futura que el test de delegación.
- **[D] Los inventarios de `design-drift.test.ts` que solo nombran `screens/…`,
  `home` o `food`** (`:108-110`, `:204-212`, `:251-254`, `:272-273`, `:292-295`,
  `:313-316`, `:336-337`). Premisa verificada: son **allow-lists explícitas**
  recorridas con `flatMap` sobre un array literal, **no** escaneos de directorio,
  y ninguna nombra una de las cuatro rutas. Que se añadan cuatro carpetas nuevas
  bajo `src/screens/` **no** las mueve. Quedan escritas aquí para que nadie las
  ajuste por reflejo. Ver [[design]] **D11**.
- **[D] Cualquier cambio de conducta, de copy, de estilo o de layout.** Refactor
  puro. Cero claves i18n nuevas, cero tokens nuevos, cero dependencias.
- **[D] `backend-pet-tracker/`.** #102 no lo toca, y por eso **`./init.sh` no se
  lanza** (§Entorno). Los puertos de Postgres/LocalStack son de la sesión vecina
  (`init-sh-concurrente-worktrees`).
- **[D] La prueba de humo en dev build de Android.** Un refactor sin cambio de
  conducta no la necesita; los 1386 tests y `tsc` son el gate. Si el humano la
  quiere igualmente, es una casilla que él añade, no un requisito de esta spec.

---

## Entorno: reglas que el handoff a Codex DEBE repetir

Ninguna de estas la ve un test; todas han parado trabajo antes (lección
`supuestos-de-entorno-en-specs-moviles`: #79 necesitó cinco enmiendas y **todas**
eran de entorno).

1. **Skills.** Antes de tocar nada, Codex carga de su plugin `expo` las
   equivalentes a las que cargó esta spec: **`expo-overview`** (entrada y router)
   y **`expo-project-structure`** (que es la que fija *route delgado +
   `src/screens/`*). Lo exige `docs/ui-guidelines.md` §Skills y `CLAUDE.md` §UI
   móvil.
2. **`bun` / `bunx` para todo.** Nunca `npx`, nunca `npm i -g`
   (`bun-para-todo-en-movil`).
3. **Rutas de jest con `(tabs)` entre comillas simples y con
   `--runTestsByPath`.** Sin escapar, `(tabs)` se interpreta como **regex** y
   jest **salta los ficheros en silencio con exit 0**
   (`jest-paths-con-parentesis`). Comprobar siempre que jest imprime el número de
   suites esperado.
4. **Medir sin pipe**: `cmd > fichero; echo $?`. Un `| tail` devuelve el exit code
   de `tail` (`exit-code-tras-pipe`).
5. **Borrar `mobile-pet-tracker/.expo/types/router.d.ts` ANTES de tocar código.**
   Está gitignorado y rompe `tsc` con rutas fantasma
   (`expo-router-types-obsoletos`). **Es especialmente crítico aquí**: esta
   feature mueve ficheros de ruta, que es justo lo que ese fichero indexa.
6. **Cero dependencias nuevas** (R8).
7. **No se lanza `./init.sh`.** #102 no toca `backend-pet-tracker/`.
8. **Un solo escritor**: `src/app/(tabs)/food.tsx` y
   `src/app/(tabs)/__tests__/food.test.tsx` son de #106/#107. No se abren.
9. **`git mv`**, no borrar-y-crear, para que R8 vea renames.

---

## Aprobación

> Esta feature tiene **dos** gates humanos y **dos** casillas. No se comparten:
> la enmienda a `docs/conventions.md` autoriza que la feature exista, y la
> aprobación de la spec autoriza implementarla. Lección
> `gate-humano-sin-casilla-donde-firmar`: en #94 un gate remitía a §Aprobación,
> que era el gate previo, y el humano no tenía dónde firmar.

### Enmienda R1 — migración en frío de pantallas anteriores a #39

Lo que se firma aquí es el **texto normativo de R1**: la excepción A10 a
`docs/conventions.md:445-446`, con sus cuatro condiciones y con la regla por
defecto intacta. Sin esta casilla, #102 **no existe** y se cierra sin implementar
(criterio de aceptación 1 de la entrada).

- [X] Enmienda R1 (A10 de `docs/conventions.md`) aprobada por humano (fecha: 2026-09-21)

### Aprobación de la spec

- [X] Aprobado por humano (fecha: 2026-09-21) ← gate obligatorio antes de implementar

Al marcar esta casilla, el humano ratifica además:

1. El **recorte a cuatro rutas** de §0.2, con `food.tsx` fuera y su migración
   como deuda nombrada (R9).
2. Las **tres correcciones de datos falsos** de §0.1: `map.tsx` son 406 líneas
   (no 388), `food.tsx` son 374 (no 325) y `ui-copy-table.ts` tiene 87
   ocurrencias de `(tabs)` (no 90).
3. La elección de la **vía (b) de C4** y la definición de mutación de §0.3: el
   rojo legítimo lo produce el movimiento del fichero de producción, visto por el
   candado.
4. La decisión **D7**: no se añade test de delegación al route delgado, para que
   el total siga en 1386.
5. La decisión **D12**: `design-drift.test.ts:sourceFiles()` es intocable (R7).
