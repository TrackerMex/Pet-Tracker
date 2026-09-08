# review: mobile-home-weekly-activity (#68)

Fecha: 2026-09-07
Reviewer: subagente `reviewer` (Claude) — implementación escrita por Codex CLI
Branch: `feature/68-mobile-home-weekly-activity`
Rango revisado: `9fd10f4..HEAD` (`3939981`), 43 commits
Base de medición: `4a5f6dd`

**Veredicto: RECHAZADO**

Dos candados que la spec señala por escrito como los que **no pueden ser
decorativos** no ven el cambio que existen para ver. Las cinco mutaciones que
`tasks.md` prescribe mueren —las replanté todas yo—, pero variantes triviales y
semánticamente idénticas de las mutaciones 2 y 3 dejan la suite entera en verde.
Ambos arreglos son **solo de test**: el código de producción es correcto y no
hay que tocarlo. Todo lo demás del protocolo está limpio.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#68, y solo #68)
- [x] `progress/current.md` describe la sesión activa, con el hallazgo de R4, el
      de R19(a) y la autorización humana del candado de catálogo anotados
- [x] `progress/history.md` sin entrada de #68 — correcto, la sesión no está cerrada
- [x] `feature_list.json` mantiene #68 en `in_progress` (no se marcó `done`)

## Checklist C3 — Arquitectura

- [x] Feature 100 % de presentación móvil. **Cero ficheros de
      `backend-pet-tracker/` y cero de `infra/`** — verificado con
      `git diff --name-only 4a5f6dd..HEAD`
- [x] `weekly-activity-chart.tsx` solo importa **tipos** de `src/api/`
      (`import type { DayEntry, WeekComparison }`); ni `use-api`, ni `fetch`, ni
      `expo-router` (R2)
- [x] La navegación la decide la pantalla vía `onSelectDay`, no el componente
- [x] `src/utils/device-connectivity.ts` es un mapa puro sin dependencia de UI

## Checklist C4 — TDD

- [x] 21 pares rojo→verde + 1 commit de evidencia final = 43. Verificado commit
      a commit: **todos los rojos tocan solo ficheros de test** (más
      `traceability.md`/`current.md`); todos los verdes tocan la implementación
- [x] **Ningún rojo falla por `ReferenceError`.** Ejecuté seis rojos en un
      worktree aparte (`14721b9` R3, `9154c41` R4, `521414b` R5, `8f7c50a` R9,
      `709e71f` R10, `b6c98d1` R8): cada uno falla **por aserción**, solo en los
      `it` nuevos, con el resto de la suite en verde
- [x] R20 y R20b son requisitos de verificación **declarados por escrito antes
      del handoff** y cerrados por la vía (b) de C4 (mutación). Evidencia
      independiente abajo
- [ ] **Cada `R<n>` tiene al menos un test que lo nombra** — falla para
      **R1b, R4, R14b, R15, R17 y R19** (ver observación 6). No es desviación de
      Codex: la spec aprobada prescribe esas ubicaciones. Apunte para el harness

### Nota sobre el tipo de commit

Los 43 commits llevan `feat(...)`, rojos incluidos, porque así lo prescribió el
prompt de handoff. **Juzgo C4 cumplido de todos modos**: el checkpoint pide el
*patrón* rojo→verde, y lo verifiqué por contenido (qué ficheros toca cada
commit) y por ejecución (seis rojos corridos), no por el mensaje. Que los rojos
fuesen `test(...)` sería más legible; es apunte para el harness, no defecto
de #68.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` con las **23 filas rellenas**, ninguna en "pendiente"
- [x] Cada requisito con su test prescrito y sus dos hashes (rojo y verde)
- [x] Formato `feat(mobile-home-weekly-activity): <desc> (R-ids)` en los 43

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved`
- [x] Casilla humana marcada con fecha (`- [X] Aprobado por humano (fecha: 2026-09-07)`)
- [x] Casilla de la enmienda E1 marcada
- [x] **Firmadas por el humano en su propio commit `3812900`** (AlexisSM377):
      un fichero, dos líneas, sin código colado
- [x] **Ningún requisito modificado después de la firma**: el único commit sobre
      `requirements.md` posterior a `3812900` es `9fd10f4`, y solo cambia
      `status: spec_ready` → `status: approved` en el frontmatter

## Checklist C7 — Sin código huérfano

- [x] `src/app/(tabs)/__tests__/home.test.tsx` eliminado; git lo registra como
      rename a `src/screens/home/index.test.tsx`
- [x] `src/app/(tabs)/home.tsx` reescrito a route delgado de **5 líneas**,
      exactamente en la forma que R15 prescribe
- [x] Cero importadores colgando de la ruta vieja (`grep` sobre `src/`)
- [x] **Ningún `testID` murió**: 22 en el `home.tsx` de `4a5f6dd`, 48 ahora;
      la intersección es completa, cero desaparecidos
- [x] **Ningún assert borrado ni debilitado** en el test migrado: 38 → 43 `it`
      (ninguno perdido), 113 → 131 `expect(`

## Checklist C8 — UI móvil conforme a la carta

- [x] Grep-clean de los ficheros de la feature: cero hex, cero clases
      arbitrarias, cero `StyleSheet.create`, cero radios fuera de escala
- [x] `Skeleton` dimensionado en la carga (R14b), no spinner suelto
- [x] `Card` compartido reutilizado, sin fork local
- [x] Columnas táctiles con `min-h-11` (44 pt) y feedback de selección
- [x] Animación Reanimated en UI thread, con bypass por `useReducedMotion()`,
      sin variables CSS ni `PlatformColor` en estilos animados
- [x] **Contraste AA recalculado contra los tokens que usa la implementación**
      (no los que dice la spec): las 12 parejas texto/superficie pasan en los
      dos temas. El margen más justo es `muted` sobre `surface-secondary` en
      claro: **4,70:1** (mínimo 4,5). Detalle abajo

---

## Verificación independiente

### `./init.sh` — corrido por mí, en primer plano, exit 0

`pgrep -f init.sh` antes de lanzar: sin otro gate en marcha. Tail de la corrida:

```
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 354 passed, 362 total
Time:        88.995 s
Ran all test suites.
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 63/73 completadas | 9 pendientes

=== EXIT: 0 ===
```

Avisos no bloqueantes y ajenos a #68: `.env`, `STATUS.md`, y
`NodeVersionSupportWarning` del AWS SDK (node 20 vs. futuro ≥22).

### Suite móvil, referencia verde medida por mí

```
Test Suites: 67 passed, 67 total
Tests:       1023 passed, 1023 total
Time:        59.4 s
```

### Prueba de mutación de R20b — **replantada entera por mí**, no leída del informe

Cada mutación se plantó sola sobre el árbol limpio, se corrió `bun run test --
--runInBand --silent` completa, y se restauró con `git checkout --`. El árbol
quedó limpio al terminar (`git status --porcelain` vacío).

| # | Mutación | Resultado medido |
|---|---|---|
| 1 | etiqueta del eje desde tabla fija indexada | **ROJA** — `R3 › usa el día real de cada fecha en los dos idiomas` |
| 2 | `new Date(year, month-1, day)` → `new Date(date)` | **ROJA** — solo `R3 › no se desplaza un día en una zona horaria negativa` |
| 3 | rama `missing` por `metricValue(...) === null` | **ROJA** — solo `R5 › usa source aunque una métrica stored sea null` |
| 4 | `accessibilityLabel` del día `missing` → `undefined` | **ROJA** — `R9 › anuncia los huecos…` + 2 candados de copy de `ui-language` |
| 5 | import `/v2` → raíz | **ROJA** — `R1 › importa la gráfica solo desde …/v2` + 18 derivados |

Las cinco mueren. Coincide con lo que declara Codex. **Pero ver observaciones 1
y 2**: las variantes de las mutaciones 2 y 3 no mueren.

(En la corrida de la mutación 1 reapareció el flaky conocido **#72** del image
picker en `add-pet/index.test.tsx`. Es independiente de #68 y no volvió a salir
en ninguna de las otras ~15 corridas.)

### El candado de catálogo de `language-provider.test.tsx` — vivo, no decorativo

Cambio exacto (único del fichero):

```
-  // 259 en `303fc19` + 1 de `home.walks` (#67 R7b).
-  it('mantiene 260 claves exactas y los mismos marcadores en ambos idiomas', () => {
-    expect(englishKeys).toHaveLength(260);
+  // 259 en `303fc19` + 1 de `home.walks` (#67 R7b) + 16 de #68.
+  it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas', () => {
+    expect(englishKeys).toHaveLength(260 + 16);
```

- La base histórica **sigue visible como suma** (`260 + 16`), no reescrita a `276`
- `expect(spanishKeys).toEqual(englishKeys)` y el bucle de marcadores **intactos**
- El `+16` es real: el catálogo suma exactamente **16 claves en `en` y 16 en
  `es`**, y sus valores coinciden literalmente con la tabla de R17
- **Sigue pudiendo fallar** — planté tres violaciones y cada una lo pone rojo:
  clave añadida a los dos idiomas (`Expected 276, Received 277`), clave añadida
  solo a `en` (rompe la paridad), clave de #68 borrada de los dos

### R18 y el grep-clean — el bloque existe y muerde

La premisa es correcta: **no hay candado global de "cero hex fuera de
`src/theme/`"**. El único que persigue hex está en
`design-drift.test.ts:100` bajo `describe('R9: mobile-pets-profile sin drift')`,
acotado a ocho ficheros nominales de #40. Lo global es solo `text-[10px]`.

R18 añadió su bloque propio, `#68 R18: la actividad semanal no mete drift de
estilo` (`design-drift.test.ts:189`), con los **11** ficheros correctos de la
feature. Inyecté un hex (`// probe #a1b2c3`) en cinco de ellos, uno a uno:
**los cinco ponen el bloque rojo**.

### R19 — cada grep rehecho por mí

| Inventario | Base en `4a5f6dd` | Ahora | Delta | Veredicto |
|---|---:|---:|---:|---|
| `style={CONTINUOUS_CORNER}` en Home | 1 (`home.tsx`) | 1 (`screens/home/index.tsx`) | 0 | reubicación limpia |
| `style={CONTINUOUS_CORNER}` en la gráfica | — | 1 | +1 | total `33` → `33 + 1` ✔ |
| `style={TABULAR_NUMS}` en Home | 4 | 4 | 0 | reubicación limpia |
| `style={TABULAR_NUMS}` en la gráfica | — | 4 | +4 | total `14` → `14 + 4` ✔ |
| `text-accent-strong` en Home | 1 | 1 | 0 | reubicación limpia |
| `text-accent-strong` en la gráfica | — | 0 | 0 | total sigue en `13` ✔ |
| `text-warning-strong` (#61 R5) | `home.tsx` | `screens/home/index.tsx` | 0 | reubicación **no enumerada**, assert intacto |
| import del `Card` (design-drift R3) | `app/(tabs)/home.tsx` | `screens/home/index.tsx` | 0 | reubicación **no enumerada**, assert intacto |
| llamadas `t()` en la gráfica | — | **15** | +15 | `R3_HOME` `21` → `21 + 15` ✔ (14 `weeklyActivity.*` + reutilización de `home.sleep`) |
| filas `R10_PAIRING` | 42 | 44 | +2 | `42 + 2` ✔ |
| `SCREEN_FILES` | 19 | 21 | +2 | `19 + 2` ✔ |
| entrypoints delgados | 3 | 4 | +1 | ✔ |
| assert de dependencia | — | `chart-kit === '7.0.4'` | +1 | ✔ |

**Ninguna cifra bajó. Ningún assert se debilitó.** Todos los números conservan
la base histórica como suma visible (`21 + 15`, `33 + 1`, `14 + 4`, `42 + 2`,
`19 + 2`, `260 + 16`). Las 21 filas originales de `R3_HOME` siguen todas, solo
cambian de ruta. Las dos reubicaciones que la tabla aprobada no enumeraba
conservan su aserción palabra por palabra.

### E1 — la enmienda quedó como la spec la enuncia

`docs/ui-guidelines.md` §Dirección de arte 6, tercer corolario: `device.connectivity`
sale de la lista, se añade la nota de que se resuelve por catálogo en
`src/utils/device-connectivity.ts` (#68 R16), y se retira la frase sobre la
jerga del proveedor, que era específica de `connectivity`.

- **Los otros cuatro enum siguen crudos**: `pet.sex`, `document.type`,
  `foodType`, `activityLevel` — presentes en el texto y asertados por
  `describe('#68 E1: …')` en `design-drift.test.ts:235`
- **La enmienda no se coló más allá de lo firmado**: es el único hunk del
  fichero en todo el rango
- La condición `connectivity === 'online'` de la Home sigue intacta (territorio de #73)

### R1 — dependencia

- `package.json`: `"react-native-chart-kit": "7.0.4"` — **exacta, sin `^` ni `~`**
- `bun.lock` fija `react-native-chart-kit@7.0.4`
- **Un solo import en todo `src/`**: `from 'react-native-chart-kit/v2'`
  (`weekly-activity-chart.tsx:16`). Cero imports de la raíz, cero de `dist/`
- `transformIgnorePatterns` incluye `react-native-chart-kit` y `paths-js`

### Accesibilidad y contraste

Verificado en el tarball que el `BarChart` renderiza su raíz como
`View { accessible: true, accessibilityRole: "image" }`
(`dist/v2/react-native/charts/bar/BarChart.js:182`), que colapsa el subárbol.
En el fuente, `weekly-activity-day-row` es **hermano** de
`weekly-activity-chart-layout`, no descendiente: las siete columnas viven fuera
del gráfico, cada una con `accessible`, `accessibilityRole="button"` y su
`accessibilityLabel` de catálogo, y el contenedor **sin** `accessibilityLabel`.

Ratios calculados contra los tokens que usa el código:

| Pareja | Claro | Oscuro | Mínimo |
|---|---:|---:|---:|
| `foreground` sobre `surface` | 18,92:1 | 16,28:1 | 4,5 |
| `muted` sobre `surface` (texto 10 px) | 4,97:1 | 6,81:1 | 4,5 |
| `foreground` sobre `surface-secondary` | 17,87:1 | 15,42:1 | 4,5 |
| `muted` sobre `surface-secondary` | **4,70:1** | 6,45:1 | 4,5 |
| `accent-strong` sobre `surface` (barras) | 6,04:1 | 6,79:1 | 3,0 |
| `accent-strong` sobre `surface-secondary` | 5,70:1 | 6,43:1 | 3,0 |

Todas pasan. La de 4,70:1 (etiquetas del panel de detalle en tema claro) pasa
con poco margen: si alguien toca `--muted` o `--surface-secondary`, cae.

### Deriva de ficheros — no hay un séptimo

Los 24 ficheros del rango se reparten así: 18 están en `design.md` §4
—incluida `specs/mobile-ui-language/design.md`, que §4 sí enumera— y los 6 que
Codex declara fuera son exactamente los seis que declara:
`docs/ui-guidelines.md`, `bun.lock`, `language-provider.test.tsx`,
`progress/current.md`, `traceability.md` y su propio informe. **Ninguno más.**

---

## Observaciones

### Bloqueantes

**1. El candado de R4 es un grep de una sola grafía y se esquiva con un
renombre.** `src/screens/home/weekly-activity-chart.test.tsx:469-482`.

El hecho del runtime que reporta Codex es **cierto**, y lo medí: dentro de un
worker de `jest-expo`, `process.env` es una copia (`isRealProcessEnv: false`),
así que reasignar `TZ` no ejecuta `tzset` —la zona sigue en UTC, offset 0
antes y después— y la mitad conductual del `it` (`expect(weekdayLabel(
'2026-09-06','es-MX','short')).toBe('dom')`) **pasa igual con la mutación 2
plantada**. Lo único que mata la mutación es la línea estructural:

```js
expect(readFileSync(chartSourcePath, 'utf8')).not.toContain('new Date(date)');
```

Eso prohíbe **una cadena literal**, no una conducta. Lo demostré: renombré el
parámetro de `weekdayLabel` de `date` a `isoDate` y dejé el mismo bug de
parseo UTC —

```ts
export function weekdayLabel(isoDate: string, locale: string, style: 'short' | 'long'): string {
  return new Date(isoDate).toLocaleDateString(locale, { weekday: style });
}
```

— y **la suite entera se queda verde: 67/67 suites, 1023/1023 tests**. El
requisito que R4 protege (un día entero de desfase en toda zona de offset
negativo, invisible en un runner UTC) queda sin candado real.

*Vía de arreglo, sin tocar producción*: asertar la construcción en vez de su
grafía, p. ej. espiar el constructor —`jest.spyOn(global, 'Date')` y
`expect(spy).toHaveBeenCalledWith(2026, 8, 6)`— o sacar el caso a un proyecto
Jest con `TZ` fijado al arrancar el worker, donde la mitad conductual sí vive.

**2. El discriminante `source` de R5 solo está vigilado en 4 de sus 8 sitios.**
`src/screens/home/weekly-activity-chart.tsx`.

Planté la mutación 3 **línea a línea**, una por una, sobre las ocho decisiones
por `day.source`. Resultado:

| Línea | Qué decide | Suite |
|---:|---|---|
| 188 | `accessibilityLabel` del día | **roja** (36 tests) |
| **283** | **el valor que se entrega al `BarChart`** | **VERDE** |
| **287** | **denominador de la media (`measuredValues`)** | **VERDE** |
| **296** | **ancla de la línea de media** | **VERDE** |
| 298 | estado vacío (`hasMeasuredDay`) | **roja** |
| 475 | valor del tooltip | **roja** |
| 521 | glifo `—` vs. valor en la columna | **roja** |
| **551** | **`noDataForDay` del panel de detalle** | **VERDE** |

La implementación es correcta en los ocho. El problema es el candado: **la
línea 283 es justamente la que enuncia la primera cláusula de R5** ("SHALL
pasar al `BarChart` el valor `null`"), y §0.1 de la spec dice que la mutación 3
se planta "para demostrar que el candado lo ve". Lo ve en un sitio de cinco con
carga semántica. El `it` que existe (`pasa null al gráfico para missing y
conserva cero para stored`) no lo pilla porque su fixture usa `missing` con
`activeMinutes: null` y `stored` con `0`: por `=== null` da la misma respuesta.

*Vía de arreglo, sin tocar producción*: extender el `it` de
`source: 'stored'` + métrica `null` para que también asserte lo que llega al
`BarChart` (`latestBarChartProps().data`), la media y el panel de detalle de ese
mismo día. Es un fixture, no un rediseño.

### No bloqueantes

**3. El verde de R19 (`4f4806d`) cambió el producto para encajar en un candado,
en vez de parar y reportar.** El botón de mapa de R8 estaba como
`className="rounded-xl bg-accent"` + `text-accent-foreground`, lo que habría
movido el inventario **cerrado en doce** de `#62 R1`
(`consistency-classnames.test.ts:102`) a trece — un total que la tabla de R19 no
autoriza. R19 dice literalmente *"para y repórtalo: no lo absorbas subiendo el
número"*. Codex no lo absorbió (bien) pero tampoco paró: degradó el botón a
`variant="secondary"` + `text-foreground`. Está **declarado** en su informe, la
variante es un patrón que el repo ya usa en cuatro pantallas y no rompe ningún
requisito de R8 (`testID`, copy y `router.push('/map')` intactos) — pero es una
decisión visual que no firmó nadie.

**4. Ese mismo botón no declara clase de fondo.**
`src/screens/home/index.tsx:377-379` deja `className="min-h-11 w-full rounded-xl"`
con `variant="secondary"`, mientras los otros dos `Button` secundarios del repo
sí nombran su token (`add-pet/index.tsx:263` → `bg-accent-soft`;
`profile/index.tsx:358` → `bg-default`). El fondo cae al de heroui por defecto,
así que es la única pareja de contraste que no pude calcular. Punto para el
smoke humano.

**5. El candado de R18 prohíbe `StyleSheet` a secas, no `StyleSheet.create`.**
La regex `/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i` se aplica también a los
ficheros de test de la feature, así que el verde `fe6e721` tuvo que quitar
`StyleSheet.flatten` de dos tests y escribir a mano un `mergeObjectStyles`. Los
asserts de reemplazo **no son más débiles**, pero el candado es más estricto que
C8 ("cero `StyleSheet.create`") y que el propio repo, que usa
`StyleSheet.flatten` en `components/card.tsx`.

**6. Seis requisitos no tienen ningún test que nombre su R-id** (C4, primer
punto): **R1b** y **R4** viven dentro de `describe('R1: …')` y
`describe('R3: …')`; **R14b** dentro de `describe('R14: …')`; **R15**, **R17** y
**R19** se cierran con candados preexistentes titulados por otras features
(`R9: mobile-pets-profile`, `#65 R3`, `#62 R14/R15`, `#61 R4/R5`). En los seis
casos es **exactamente donde la spec aprobada mandó ponerlos**, así que el
arreglo va en el `spec_author`/harness, no en la implementación. Lo dejo
anotado, no bloquea.

---

## Pendiente humano (no delegable, ajeno a este veredicto)

Smoke firmado en **dev build de Android** (nunca Expo Go), tema claro y oscuro,
con una mascota con al menos un día sin dato y otro de cero: distinción visual
hueco/cero, letras del eje contra los días reales, alineación de las siete
columnas con sus barras, selector sin parpadeo, tooltip y detalle, enlace al
mapa solo en hoy, animación con y sin "reducir movimiento", sin desbordamiento
horizontal, conexión ya no dice `LTE`, y TalkBack anunciando siete columnas.
Añadir a ese guion la comprobación del punto 4 (fondo del botón de mapa).

---
---

# Segundo veredicto — correcciones tras el rechazo

Fecha: 2026-09-08
Rango revisado: `db53dde..HEAD`
**Nota de rango**: el encargo citaba 7 commits hasta `241741e`. Hay **8**: el
octavo, `0556830` (`docs: abre la casilla D1 del botón de mapa`), es del propio
leader y llegó después del mensaje. Lo reviso igual (punto 11).

**Veredicto: APROBADO**

Los dos bloqueantes quedan cerrados y la observación 4 también. Replanté yo el
bypass exacto que mató al candado anterior y la mutación en los cuatro sitios,
uno por uno. Quedan cuatro apuntes nuevos, ninguno bloqueante, y el gate humano
—ahora doble— sigue abierto.

## Verificación independiente

`pgrep -f init.sh` antes de lanzar: solo mi propio shell. `./init.sh` corrido por
mí en primer plano: **exit 0**, con `✅ Lint sin errores`, `✅ Typecheck sin
errores` y `✅ Todo verde`. Suite móvil medida aparte:

```
Test Suites: 67 passed, 67 total
Tests:       1023 passed, 1023 total
```

Mismo recuento que antes: no se añadió ni se borró ningún `it`. Los `expect`
**suben** (118 → 127 en el test de la gráfica, 131 → 132 en el de la Home): los
candados se reforzaron, no se aflojaron.

## Bloqueante 1 (R4) — **CERRADO**

Codex tomó la vía (a): espía `global.Date`, delega en el constructor real con
`Reflect.construct`, asserta `dateConstructor.mock.calls` igual a
`[[2026, 8, 6]]`, y **eliminó** el `not.toContain('new Date(date)')`.

Replanté la mutación exacta que dejaba verde al candado anterior —renombrar el
parámetro a `isoDate` y dejar `new Date(isoDate).toLocaleDateString(...)`— y
**ahora se pone rojo por aserción** (`Expected [[2026,8,6]]` /
`Received [['2026-09-06']]`). El agujero concreto está tapado.

Busqué la siguiente vía de escape. Ninguna pasa:

| Construcción alternativa que también desplaza el día | Resultado |
|---|---|
| `new Date(isoDate)` (renombre del parámetro) | **roja** por aserción del espía |
| `new Date(Date.parse(date))` | **roja** |
| `new Date(Date.UTC(year, month - 1, day))` | **roja** |
| `new Date(Date.UTC(...) + 0)` (aritmética de ms) | **roja** |

Razoné además el hueco teórico —una construcción correcta seguida de un
desplazamiento posterior (`setDate`, `toISOString` y reparseo)— y también cae:
lo primero rompe la mitad conductual (`toBe('dom')` da `'sáb'` ya en UTC) y lo
segundo suma una segunda llamada al constructor. **No encontré ninguna vía que
pase en silencio.**

## Bloqueante 2 (R5) — **CERRADO, con el matiz que pediste**

Replanté la mutación en las cuatro líneas, **una por una**, y anoté qué mata
cada una leyendo la aserción que falla:

| Línea | Qué decide | Muere por | Aserción que falla |
|---:|---|---|---|
| **283** | valor entregado al `BarChart` | **conducta** | `latestBarChartProps().data` → `value: 90` en vez de `null` |
| **287** | denominador de la media | **solo el parser AST** | `measuredValues: false` |
| **296** | ancla de la línea de media | **solo el parser AST** | `averageAnchorIndex: false` |
| **551** | `noDataForDay` del panel de detalle | **conducta** | `detail-active-minutes` deja de mostrar `'—'` |

Las dos que llevan conducta observable —283 y 551, las que de verdad le llegan
al usuario— **mueren por conducta**, gracias al fixture centinela (`missing` con
`activeMinutes: 90`, `stored` con `null`), que es exactamente el arreglo que
pedí. Las otras dos mueren **solo por el parser**, y lo digo explícitamente
porque me lo pediste.

### ¿Es cierto que 287 y 296 son mutantes equivalentes en caja negra?

**Sí, y lo verifiqué en vez de creerlo.** Demostración por casos, dado un 283
correcto (`value = source === 'missing' ? null : metricValue(day, m)`):

```
measuredValues = chartData.flatMap(({day, value}) => COND && typeof value === 'number' ? [value] : [])
```

- Si `typeof value === 'number'`, entonces `value` no es null, luego `source !== 'missing'`
  **y** `metricValue(day, m) !== null`: original y mutante valen ambos `true`.
- Si `typeof value !== 'number'`, el segundo operando corta y el día queda fuera
  sea cual sea `COND`.

Para toda entrada posible la salida es idéntica; ningún fixture puede
distinguirlas. Idéntico argumento para 296, que lleva la misma guarda
`typeof value === 'number'`. Confirmación empírica: con la mutación de 287
plantada corrí la **suite completa** y el único fallo en 1023 tests es la
aserción del AST — **ninguna prueba de conducta se mueve, en ningún fichero**.

Conclusión: **no había un test de conducta posible en 287/296**, así que el
nivel estructural no sustituye a conducta disponible — cubre una posición que de
otro modo quedaría sin candado alguno. **Esa es la diferencia con R4**, y por eso
lo acepto aquí habiéndolo rechazado allí: el candado viejo de R4 vigilaba con una
cadena literal una posición que **sí** era observable (el espía lo demuestra), y
se esquivaba con un renombre inocente. Aquí no hay conducta que observar y el
esquive exige plantar un señuelo a propósito.

### Esquivando el parser

- **Señuelo en 283** (comparación presente pero decidiendo por `null`): **roja**.
  El sitio que importa está defendido por conducta, así que el señuelo no cuela.
- **Señuelo en 287** (`... && (day.source === 'missing' || true)`): **verde**.
  El parser sí se esquiva ahí — pero la consecuencia es nula, porque la posición
  es un mutante equivalente demostrado. Queda como apunte 7.

## Observación 4 — **CERRADA**

`bg-default` añadido (`index.tsx:378`), con un assert nuevo que lo fija
(`index.test.tsx`: `expect(mapButton.props.className).toContain('bg-default')`).
Era la única pareja de contraste que me faltaba; calculada:

| Pareja | Claro | Oscuro | Mínimo |
|---|---:|---:|---:|
| `text-foreground` sobre `bg-default` | **17,50:1** | **14,69:1** | 4,5 |

Pasa AA con margen enorme en los dos temas. El precedente que cita Codex es
exacto: `profile/index.tsx:357-361` usa el mismo trío
`rounded-xl bg-default` + `variant="secondary"` + `text-foreground`.

Dato para el smoke, no defecto: la **superficie** del botón contra la card que
lo contiene queda en 1,08:1 (claro) y 1,11:1 (oscuro), así que su borde es casi
invisible. No lo cuento como hallazgo porque es una propiedad de la pareja de
tokens que el repo ya lleva en Profile, y porque quien identifica el control es
su etiqueta, no su borde.

## Sin deriva

- **Cero ficheros de `backend-pet-tracker/` y cero de `infra/`** en todo el rango
  de la feature (`4a5f6dd..HEAD`)
- **`weekly-activity-chart.tsx` no tiene ni un cambio** en el rango de
  correcciones, y quedó sin diff tras las ~12 mutaciones que planté
  (`git status --porcelain` vacío al terminar)
- **Ningún candado de recuento tocado**: el diff sobre `src/__tests__/` y
  `src/providers/` en el rango nuevo está **vacío**. Ninguna cifra bajada
- **Ningún assert debilitado**: cero `it` eliminados, `expect` al alza en los dos
  ficheros de test
- **Ninguna dependencia nueva**: `package.json` y `bun.lock` intactos en el rango.
  El `import * as ts from 'typescript'` del test usa la devDependency que ya
  existía (`~6.0.3`)
- **`traceability.md` sin filas pendientes**: las 23 filas siguen rellenas; la
  única coincidencia de "pendiente" es la línea de la regla al pie
- Los 8 commits van en pares rojo→verde con tipo `fix(...)` y sus R-ids; el repo
  ya usa `docs(`/`style(`/`fix(` además de `feat(`, así que C5 aguanta

## Observaciones nuevas (ninguna bloqueante)

**7. El parser AST vigila la grafía, no la conducta, en 287 y 296.** Un señuelo
inerte (`&& (day.source === 'missing' || true)`) lo deja verde con la decisión
tomada por `null`. Consecuencia práctica **nula** —ambas posiciones son mutantes
equivalentes demostrados—, pero conviene saber que ahí el candado no prueba nada
que un usuario pueda notar.

**8. El parser da falso positivo en dos refactors honestos.** Reescribí
`chartData` de dos formas correctas y equivalentes, y las dos ponen el test rojo
sin que nada esté mal: `const { source } = day; source === 'missing'`
(`isSource` exige un `PropertyAccessExpression`, y un identificador pelado no lo
es) y un helper compartido `isMissing(day)`. Un `switch (day.source)` o un
`['missing'].includes(...)` caerían igual. Es un impuesto: fija la **grafía** del
código correcto, así que el próximo que ordene esa función se come un rojo que no
señala ningún defecto.

**9. Tres de las cuatro vías de escape de R4 mueren por accidente, no por
diseño.** `Date.parse`, `Date.UTC` y la aritmética de milisegundos fallan con
`TypeError: Date.parse is not a function`, porque `jest.spyOn(global, 'Date')`
deja un mock sin métodos estáticos. Mueren —que es lo que importa— pero el
mensaje despista a quien se los encuentre: parece un fallo de entorno y es el
candado haciendo su trabajo.

**10. El espía de R4 fija el constructor a exactamente una llamada.**
`toEqual([[2026, 8, 6]])` no admite que `weekdayLabel` construya dos `Date`, aunque
lo hiciera correctamente. Misma familia que el apunte 8, más leve.

**11. `0556830` abre una casilla humana nueva dentro de una spec `approved`.**
Es del leader, es **aditiva** —añade el bloque D1 en §Enmiendas con dos opciones
sin marcar— y **no modifica el texto de ningún requisito**, así que C6 aguanta:
no es saltarse el gate, es abrirlo. Resuelve bien mi observación 3 (la decisión
visual sin firmar del botón de mapa). Efecto práctico: **#68 gana un segundo gate
humano** además del smoke. La opción (a) es la implementada, así que firmarla no
cuesta ningún commit de código.

### De la revisión anterior, siguen abiertas y siguen sin bloquear

- **Observación 3** → reencaminada a la casilla D1 de `0556830`. Pendiente de firma.
- **Observación 5** (R18 prohíbe `StyleSheet` a secas, no `StyleSheet.create`) → sin tocar.
- **Observación 6** (R1b, R4, R14b, R15, R17 y R19 sin test que nombre su R-id) → sin
  tocar; sigue siendo apunte para el `spec_author`, no defecto de #68.

## Gates humanos pendientes antes de `done`

1. **Smoke firmado en dev build de Android**, tema claro y oscuro, con un día sin
   dato y otro de cero: el guion completo de [[requirements]] §Aprobación.
2. **Casilla D1** de §Enmiendas: (a) dejarlo en `secondary` con `bg-default` —lo
   implementado, coste cero— o (b) volver a acción acentuada, que arrastra una
   enmienda firmada a `specs/mobile-figma-polish/`.

---
---

# Tercer veredicto — D1(b), defectos del smoke y sustitución del selector

Fecha: 2026-09-08
Rango revisado: `eb4195e..HEAD` (`77f7819`), 14 ficheros
Base de deltas: `4a5f6dd`
Tandas: (1) `eb4195e..f4543dd` D1(b)/E2 · (2) `3299704`+`9ea5ac1` defectos del
smoke · (3) `e486e4d`+`8003451` sustitución y `18e3a85`+`7c3738c`+`1620d9f`
tabs animadas

**Veredicto: APROBADO**

La sustitución que contradice R6 está descrita en D2 **exactamente** como el
diff la ejecuta —verifiqué las dieciséis promesas una a una—, la carta
§Decisiones fijas 5 no se tocó, el contraste del par nuevo lo recalculé y pasa
AA en los dos temas, y ningún inventario se movió salvo el 12→13 que E2 firma.
Repliqué las cinco mutaciones que Codex declara y añadí nueve mías: **doce de
catorce mueren**. Las dos que sobreviven son huecos de candado, no defectos de
producto, y van como observaciones 1 y 2.

**La casilla D2 sigue sin firmar. Ese es el gate**, y no lo cierra el reviewer.

## Verificación independiente

### `./init.sh` — corrido por mí, en primer plano, exit 0

`pgrep -f init.sh` antes de lanzar: ningún gate hermano en marcha.

**La primera corrida falló, y no por #68.** Salió
`❌ Más de 1 feature en in_progress (1)` con exit 1, teniendo `feature_list.json`
exactamente una (`#68`). Causa: mi shell trae `FORCE_COLOR=3`, así que el
`console.log(<número>)` de `init.sh:131` emite `\e[33m1\e[39m` y la comparación
`[ "$IN_PROGRESS" = "1" ]` de `init.sh:141` no casa. Es fragilidad del harness
—apunte, no defecto de la feature—; se cierra con `.toString()` en el `console.log`
o comparando con `-eq`. Relanzado con `FORCE_COLOR` fuera:

```
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 354 passed, 362 total
Time:        111.042 s
✅ Tests e2e pasados
→ Lint...    ✅ Lint sin errores
→ Typecheck... ✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 63/73 completadas | 9 pendientes
=== EXIT: 0 ===
```

Avisos no bloqueantes y ajenos a #68: `.env` (3 claves), `unrs-resolver` y
`NodeVersionSupportWarning` del AWS SDK.

### Suite móvil, referencia medida por mí

```
Test Suites: 67 passed, 67 total
Tests:       1025 passed, 1025 total
```

Coincide con el último gate de Codex. (El informe cita 1024 en la tanda de la
sustitución y 1025 tras las tabs animadas: el delta es el `it` nuevo de la
píldora, no una regresión.) **El flaky #72 de Add Pet no apareció ni una vez**
en ~16 corridas.

## Checklist

**C2 — Estado coherente**
- [x] Solo `#68` en `in_progress`; no se marcó `done`
- [x] `progress/current.md` con las tres tandas anotadas, incluido el punto de
      parada respetado y la autorización de viva voz
- [x] Sin PR, sin merge, branch correcta

**C3 — Arquitectura**
- [x] **Cero ficheros de `backend-pet-tracker/` y cero de `infra/`** en
      `4a5f6dd..HEAD`
- [x] `weekly-activity-chart.tsx` sigue sin red, sin Router y sin `useApi`
- [x] El selector nuevo es estado local; cero llamadas nuevas

**C4 — TDD**
- [x] Los cuatro rojos (`1e8a2f0`, `3299704`, `e486e4d`, `18e3a85`) tocan
      **solo ficheros de test** —`1e8a2f0` añade además el texto de E2, que es
      su enmienda firmada—; los cuatro verdes (`705daea`, `9ea5ac1`, `8003451`,
      `7c3738c`) tocan **solo producción**
- [x] **Rojo comprobado por ejecución, no por mensaje**: puse el test de
      `18e3a85` sobre la producción de su padre `4df7a9f` → falla **por
      aserción** en los dos `it` nuevos (`R6 › desliza una única píldora…`,
      `R9 › adapta píldora, texto e icono…`), con 34 verdes y cero
      `ReferenceError`

**C5 — Trazabilidad**
- [x] `traceability.md` sin filas "pendiente" (la única coincidencia es la línea
      de la regla al pie)
- [x] Las filas R6 y R9 registran los seis commits nuevos con su hash y su
      mensaje íntegro, y narran las tres tandas en orden
- [x] Formato `fix(mobile-home-weekly-activity): <desc> (R-ids)` / `docs(...)`

**C6 — Spec aprobada**
- [x] `status: approved`, casilla humana `[X]` con fecha
- [x] El diff de `requirements.md` en el rango es **puramente aditivo**: cero
      líneas borradas, ningún texto de requisito modificado
- [x] **D1 opción (b) la firmó el humano en su propio commit** `4673bed`
      (AlexisSM377); **E2 en `efc1e32`** (AlexisSM377, un fichero, una línea, la
      casilla y nada más), **04:18 UTC, cinco minutos antes** del candado
      `1e8a2f0` que la consume
- [ ] **D2 sin firmar** (`requirements.md:777`). Gate humano abierto, ver abajo

**C7 — Sin código huérfano**
- [x] El `SegmentedControl` se fue entero: cero `@expo/ui` y cero `useUniwind`
      en producción, y el candado `not.toContain('@expo/ui/community/segmented-control')`
      lo fija
- [x] El `appearance` de la tanda 2 se retiró con su control, y su candado se
      reemplazó por el de tokens (`not.toContain('appearance=')`)
- [ ] Queda andamiaje muerto en el test: `jest.mock('uniwind', …)`
      (`weekly-activity-chart.test.tsx:53-56`) ya no lo necesita nadie —
      producción no importa `uniwind` y `useThemeColors` está mockeado entero.
      Lo quité y la suite queda **36/36**. Observación 4

**C8 — Carta de UI**
- [x] Grep-clean de los dos ficheros de producción tocados: cero hex, cero
      clases arbitrarias, cero `StyleSheet.create`, cero shadow/elevation, cero
      radios fuera de escala
- [x] Touch target 44 pt (`h-11`) con feedback de presión (`opacity: pressed`),
      y el `h-11` está **candado** (mutación 13)
- [x] Animación Reanimated en UI thread, sin `Color`/var CSS en estilos
      animados (solo `width` y `translateX` numéricos), interrumpible por
      construcción (retarget del mismo shared value)
- [x] `borderCurve` no aplica al selector: `rounded-full` es cápsula, y la
      micro-regla exime a las cápsulas
- [x] Contraste AA recalculado, ver abajo

## 1. La sustitución contra D2 — descrita exactamente

R6 (`requirements.md:285-292`) sigue diciendo *"SHALL implementarlo con
`SegmentedControl`"* y la producción ya no lo hace. Cotejé D2 promesa por
promesa contra el diff:

| D2 promete | En el código | Candado |
|---|---|---|
| grupo privado de tres `Pressable` en el fichero de la feature | `MetricSelector`, no exportada, `weekly-activity-chart.tsx:251` | — |
| `role="radio"` | `accessibilityRole="radio"` `:342` | mut. 8 roja |
| `accessibilityLabel` de catálogo | `:341`, desde `metricLabels` (`t()`) | mut. 11 roja |
| `accessibilityState.selected` | `:343` | mut. 7 roja |
| altura táctil `h-11` | `:344` | mut. 13 roja |
| `numberOfLines={1}` | `:370` | mut. 1 roja |
| reparto de ancho proporcional al copy | `flexGrow: label.length` `:348` | mut. 10 roja |
| píldora Reanimated, precedente `floating-tab-bar.tsx` | `METRIC_TAB_SPRING` `:52-56` | mut. 4 y 6 rojas |
| spring crítico 250 ms, `ReduceMotion.System` | idéntico a `TAB_INDICATOR_SPRING` (`floating-tab-bar.tsx:57-61`) | mut. 6 roja |
| tres métricas en el orden de `WEEKLY_METRICS` | `:332` | verde de R6 |
| `testID="weekly-activity-metric"` | `:325` | — |
| `values` por catálogo (R17) | `metricLabels` `:406-410` | — |
| estado local | `useState(selectedMetricIndex)` | verde de R6 |
| ninguna dependencia nueva, `expo-haptics` sin instalar | `package.json` y `bun.lock` **sin diff** en el rango; cero `expo-haptics` | — |
| ningún token nuevo en `global.css` | fichero no tocado | — |
| ninguna llamada a la API | sin diff en `src/api/` | verde de R2/R14 |

**Nada que el diff haga queda fuera de D2, y nada que D2 prometa falta.** Lo que
D2 no enuncia es cosmético y no la contradice: el icono `Check`, el par de
tokens final (`bg-tab-pill`/`text-accent-strong`, que llegó en la tanda de tabs)
y el trío `adjustsFontSizeToFit`/`minimumFontScale`/`maxFontSizeMultiplier`.
D2 tampoco enumera `onChange`/`tintColor` entre lo que "NO cambia" — correcto,
porque desaparecen con el control; no sobrepromete.

**§Decisiones fijas 5 intacta**: `git diff --stat eb4195e HEAD -- docs/ui-guidelines.md`
sale **vacío**. El único hunk del fichero en toda la feature sigue siendo E1. La
capa root de `@expo/ui` no se adopta: el reemplazo son primitivas de RN, y el
punto 5 sigue listando `community/segmented-control` para quien lo necesite. Se
abandona un control por ilegible, no la regla de capas. ✔

## 2. Accesibilidad

**Lo que se conserva y muerde:**

- Cada opción lleva `accessible`, `role="radio"`, `accessibilityLabel` de
  catálogo y `accessibilityState.selected`. **Los tres están candados**: quitar
  el estado deja 2 tests rojos, quitar la etiqueta o degradar el rol a `button`
  deja 1 cada uno
- El icono lleva `accessible={false}`: no duplica anuncio
- **Los siete anuncios por columna siguen intactos.** El `day-row` no tiene ni
  una línea de diff en la tanda 3, y el candado sigue vivo: anulé el
  `accessibilityLabel` de la columna y caen 2 tests

**Lo que se pierde, y es el hallazgo:** el grupo **no se anuncia como grupo**. El
contenedor (`weekly-activity-chart.tsx:325-328`) es un `View` pelado, sin
`accessibilityRole="radiogroup"` —rol que RN 0.86.2 sí soporta
(`ViewAccessibility.d.ts:209`)—. TalkBack leerá tres radios sueltos sin el "1 de
3" posicional que el `SegmentedButtonRow` de Compose daba gratis. Ver
observación 1.

## 3. `adjustsFontSizeToFit` en Android — **sí actúa; el suelo que lo acompaña no**

Contesto lo que se preguntó, verificado contra el RN instalado (0.86.2), no de
memoria:

- **El prop NO es inerte en Android.** Está implementado:
  `TextLayoutManager.kt:840` entra en la rama y `:942 adjustSpannableFontToFit()`
  hace la búsqueda binaria de tamaño hasta que cabe en `maximumNumberOfLines`.
  Que los tipos de TS lo declaren dentro de `TextPropsIOS`
  (`Libraries/Text/Text.d.ts:22-26`) es un tipado desactualizado, no la conducta.
  El camino legacy también lo tiene (`ReactTextViewManager.kt:264`). **El candado
  de "una sola línea" descansa sobre algo que actúa: en Android el texto encoge,
  no se recorta con elipsis.**
- **Pero `minimumFontScale={0.85}` sí es inerte en Android**, y eso es el
  hallazgo. El suelo del algoritmo sale de `PA_KEY_MINIMUM_FONT_SIZE`
  (`TextLayoutManager.kt:841-844`), que el C++ rellena con
  `paragraphAttributes.minimumFontSize` (`conversions.h:1155`) — **otro prop**.
  `<Text>` solo expone `minimumFontScale` (`TextNativeComponent.js:44-45`);
  `minimumFontSize` no tiene prop pública de `Text` y queda `NaN`
  (`ParagraphAttributes.h:70`), así que el suelo cae al *fallback*
  `4.dpToPx()` (`:961-962`). En iOS el 0,85 sí manda.

Consecuencia para el re-smoke: en el Android estrecho "Minutos activos" **no
saltará de línea** —el defecto medido queda resuelto— pero puede encoger por
debajo de `--text-2xs: 10px`, el menor tamaño que la carta declara
(§Decisiones fijas 2), sin tope efectivo. Y **ningún test lo vigila**: quité
`minimumFontScale` y la suite queda 36/36. Ver observación 2.

## 4. La píldora animada — el candado de reduced motion existe

No me basté con que el código lo tenga: **planté la mutación**.
`reduceMotion: ReduceMotion.System` → `ReduceMotion.Never` deja el test **rojo**
(`R6 › desliza una única píldora…`, vía
`expect.objectContaining({ reduceMotion: ReduceMotion.System })` sobre las dos
llamadas a `withSpring`). El candado fija la configuración accesible, no solo la
duración.

El precedente se sigue al pie de la letra: `METRIC_TAB_SPRING` es
carácter por carácter `TAB_INDICATOR_SPRING` de `floating-tab-bar.tsx:57-61`
(duplica la constante en vez de importarla, lo cual prefiero a acoplar la
gráfica al tab bar). Interrumpible: retargetear el mismo shared value con
`withSpring` corta la animación en curso, igual que el precedente. Primera
posición sin animar (`indicatorWidth.get() <= 0`), animada a partir de ahí.

Comprobé además la geometría, porque la píldora es absoluta y el contenedor
tiene `p-1` + `border`: con `YGErrataAll`, que es el defecto de RN
(`YogaLayoutableShadowNode.cpp:604`), el hijo absoluto sin insets **excluye el
padding** (`AbsoluteLayout.cpp:29-32`), así que el origen es el borde y el
desfase contra el `x` de `onLayout` es de 1 px. Irrelevante; lo dejo escrito
para que nadie lo re-investigue.

## 5. Contraste del par nuevo — recalculado, pasa

Composité `bg-tab-pill` sobre `bg-default` (que es la superficie real del
contenedor) en los dos temas:

| Pareja | Claro | Oscuro | Mínimo |
|---|---:|---:|---:|
| `accent-strong` sobre píldora (**reposo, activa**) | **4,67:1** | **4,90:1** | 4,5 |
| icono `Check` sobre píldora | 4,67:1 | 4,90:1 | 3,0 |
| `foreground` sobre `bg-default` (inactivas) | 17,50:1 | 14,69:1 | 4,5 |
| `accent-strong` sobre `bg-default` (**en tránsito**, la nueva ya activa) | 5,58:1 | 6,13:1 | 4,5 |
| `foreground` sobre píldora (**en tránsito**, la vieja aún debajo) | 14,63:1 | 11,75:1 | 4,5 |

Todas pasan AA para texto normal (la etiqueta es `text-xs` semibold). Mis
números coinciden con los de Codex (4,68/4,89) dentro del redondeo.

**El argumento de Codex es correcto y lo verifiqué**: el par anterior
(`bg-accent` + blanco) daba 4,82:1 en reposo —también pasaba—, pero mientras la
píldora viajaba la etiqueta recién activa quedaba **blanca sobre `bg-default`**,
es decir **1,08:1**: invisible. El cambio empeora el reposo en 0,15 y arregla un
tránsito ilegible. Bien resuelto.

Sigue siendo el par más justo de la feature: 4,67 con 0,17 de margen. Si alguien
toca `--tab-pill`, `--default` o `--accent-strong`, se cae.

## 6. Inventarios — solo se movió el que E2 firma

- **Un único fichero de candados tocado en todo el rango**:
  `consistency-classnames.test.ts`. `src/providers/__tests__/` sin diff
- **Una única cifra movida**: `toHaveLength(12)` → `(13)`, exactamente lo que E2
  autoriza, con el nombre del `it` actualizado a "los trece"
- **La segunda aserción de #62 R1 sigue en cero**: `expect(filesMatching(/rounded-2xl bg-accent…/)).toEqual([])`
  no se tocó ni una letra
- **Esquinas continuas: la cifra no se movió** — 1 `style={CONTINUOUS_CORNER}`
  en la gráfica antes (`2ebfb97:549`) y 1 ahora (`:682`). **La cifra es
  correcta; la explicación del informe no**: Codex escribe que "las tres
  opciones conservan `CONTINUOUS_CORNER` desde su `Pressable`" y los tres
  `Pressable` **no llevan ninguno** — ni deben, porque `rounded-full` es cápsula
  y la micro-regla exime a las cápsulas. Retirar la superficie redundante fue lo
  correcto; el relato de por qué no lo es
- **Catálogo intacto en número**: el diff de `catalog.ts` son 2 líneas, `-`/`+`
  de **la misma clave** (`weeklyActivity.metricDistance`), así que el candado
  `260 + 16` de `language-provider.test.tsx` sigue siendo cierto
- **`R3_HOME` no se movió**: 16 llamadas `t('` en la gráfica antes y ahora
- Filas de cifras tabulares, `text-accent-strong`, entrypoints delgados y
  dependencias aprobadas: sin diff

## 7. Mutaciones — replantadas por mí, no leídas de su tabla

Cada una sola sobre árbol limpio, suite dirigida completa, `git checkout --`
después. `git status --porcelain` vacío al terminar.

| # | Mutación | Origen | Resultado |
|---:|---|---|---|
| 1 | `numberOfLines={1}` → `{2}` | Codex | **ROJA** |
| 2 | etiqueta activa → `text-foreground` | Codex | **ROJA** |
| 3 | `Check` con `color="black"` fijo | Codex | **ROJA** |
| 4 | `indicatorX.set(withSpring(…))` → asignación directa | Codex | **ROJA** |
| 5 | `bg-tab-pill` → `bg-accent` | Codex | **ROJA** |
| 6 | `ReduceMotion.System` → `ReduceMotion.Never` | mía | **ROJA** |
| 7 | sin `accessibilityState` | mía | **ROJA** (2 tests) |
| 8 | `role="radio"` → `"button"` | mía | **ROJA** |
| 9 | sin `adjustsFontSizeToFit` | mía | **ROJA** |
| 10 | `flexGrow: label.length` → `1` | mía | **ROJA** |
| 11 | sin `accessibilityLabel` | mía | **ROJA** |
| 12 | indicador montado siempre (sin esperar medida) | mía | **ROJA** |
| 13 | `h-11` → `h-9` | mía | **ROJA** |
| 14 | **sin `minimumFontScale`** | mía, zona ciega | **VERDE** → obs. 2 |
| 15 | columna sin `accessibilityLabel` (los 7 anuncios) | mía | **ROJA** (2 tests) |
| 16 | **`accessible` + `accessibilityLabel` en el contenedor del selector** | mía, zona ciega | **VERDE** → obs. 1 |
| 17 | quitar el `jest.mock('uniwind')` del test | mía | **VERDE** → obs. 4 |

Las cinco de Codex mueren, y coinciden con lo que declara. De las nueve mías,
siete mueren.

## 8. Deriva — ninguna

- 14 ficheros en `eb4195e..HEAD`; **cero de `backend-pet-tracker/`, cero de
  `infra/`** (verificado también contra `4a5f6dd`)
- Los **seis** ficheros móviles están todos en `design.md` §4
  (`:443-446`, `:498`, `:509`); los otros ocho son las dos specs, dos handoffs,
  `current.md`, el informe, la trazabilidad y `design.md` de #62
- `package.json` y `bun.lock` **sin diff**; `expo-haptics` sigue sin instalar
- **El flaky #72 no salió ni una vez** en ~16 corridas mías

---

## Observaciones

### No bloqueantes

**1. El grupo del selector no se anuncia como grupo, y nada lo vigila.**
`src/screens/home/weekly-activity-chart.tsx:325-328`. El contenedor es un `View`
sin `accessibilityRole="radiogroup"` (RN 0.86.2 lo soporta:
`ViewAccessibility.d.ts:209`). Con TalkBack son tres radios sueltos, sin el "1
de 3" que el control nativo daba. Es lo único que la sustitución empeoró.

Peor que la ausencia es el hueco de candado que la acompaña: **planté
`accessible` + `accessibilityLabel="Metrica"` en ese mismo contenedor y la suite
queda 36/36 en verde** (mutación 16). En un dispositivo eso **colapsa las tres
opciones en un solo nodo** — exactamente el fallo que R9 dedica una cláusula
entera a prohibir para el contenedor de las siete columnas
(*"SHALL **no** declarar `accessibilityLabel` en el contenedor"*), y que allí sí
tiene candado. El selector nuevo no heredó esa guardia.

*Arreglo, ambas mitades baratas*: añadir `accessibilityRole="radiogroup"` al
contenedor, y en `R6 › ofrece tres opciones accesibles…` asertar sobre
`selector.props` que el rol es el de grupo y que **no** trae `accessible` ni
`accessibilityLabel` propios, espejando la aserción que ya existe para el
contenedor del gráfico.

**2. El suelo de encogimiento del texto es inerte en Android y no está candado.**
`weekly-activity-chart.tsx:372` (`minimumFontScale={METRIC_LABEL_MIN_FONT_SCALE}`,
0,85). Por §3 de arriba: Android lee `minimumFontSize`, que `<Text>` no expone,
así que el suelo real es `4 dp` y el 0,85 solo actúa en iOS. Quitar la línea
entera deja la suite **36/36** (mutación 14): el candado de R6 vigila
`numberOfLines` y `adjustsFontSizeToFit`, no el suelo.

No es un defecto de producto —el prop es correcto y en iOS sirve—, pero **el
humano lo va a ver en el re-smoke**: en la pantalla más estrecha "Minutos
activos" encogerá sin tope hasta caber, y puede bajar de los 10 px que la carta
fija como mínimo. Sugerencia para el guion del smoke: mirar el tamaño de
"Minutos activos" con la fuente del sistema al máximo, y decidir ahí si hace
falta un mínimo real (un `fontSize` explícito con `flexShrink`, o acortar el
copy) o si el ancho proporcional ya lo evita.

**3. La cita de línea de D2 está desfasada.** `requirements.md:747-749` cita
*"§Fuera de alcance (`:832-834`)"*, pero esas líneas son la opción (b) de D1; el
bullet que dice "cambiar de capa es una feature separada" está en **`:867-869`**.
El texto citado es literal y correcto — solo el número está mal. Se arregla al
firmar.

**4. Andamiaje muerto en el test.** `weekly-activity-chart.test.tsx:53-56`
mantiene `jest.mock('uniwind', …)`, que era el mecanismo de la tanda 2
(`appearance` vía `useUniwind`). Producción ya no importa `uniwind` y
`useThemeColors` está mockeado entero: quité el bloque y la suite queda 36/36
(mutación 17). `mockTheme` sigue haciendo falta — lo consume el mock de
`useThemeColors`.

**5. `describe('R9: el selector sigue el tema de la app')` cuelga de un R-id que
no lo cubre.** R9 (`requirements.md:366-390`) habla de las siete columnas, del
`accessibilityLabel` del `BarChart` y de `getBarChartAccessibilitySummary`; nada
de tokens del selector. El contenido del test es correcto y necesario —es
territorio de R18/carta—, pero el título hereda un R-id ajeno. Misma familia que
la observación 6 del primer veredicto: apunte para el `spec_author`, no defecto
de #68.

**6. `init.sh` se rompe con `FORCE_COLOR` puesto.** `init.sh:127-148`: el
`console.log` de un número que Node colorea cuando `FORCE_COLOR` está en el
entorno mete `\e[33m…\e[39m` en `IN_PROGRESS`, y la comparación por cadena manda
el flujo al `fail` aunque haya exactamente una feature en curso. Me pasó a mí en
la primera corrida. Apunte de harness, ajeno a #68.

### De los veredictos anteriores, siguen abiertas y siguen sin bloquear

- **Observación 5** (el candado de R18 prohíbe `StyleSheet` a secas) → sin tocar
- **Observación 6** (seis requisitos sin test que nombre su R-id) → sin tocar
- **Observaciones 7-10** (parser AST y espía de `Date`) → sin tocar; la
  producción de R4/R5 no tiene ni un cambio en este rango

## Gates humanos pendientes antes de `done`

1. **Firmar D2** (`specs/mobile-home-weekly-activity/requirements.md:777`). Es
   la constancia versionada de la autorización de viva voz que ya se ejecutó.
   Sin ella, el árbol contradice R6 sin respaldo escrito. **No lo cierra el
   reviewer.**
2. **Re-smoke firmado en dev build de Android**, claro y oscuro, en la pantalla
   más estrecha soportada: que "Minutos activos" ya no salte de línea **y a qué
   tamaño acaba** (observación 2); movimiento de la píldora entre las tres
   métricas y con pulsaciones rápidas; "Reducir movimiento" activado; texto
   grande; y **TalkBack sobre el selector**, para oír si los tres radios sueltos
   molestan (observación 1). Más el guion completo que ya estaba abierto.
