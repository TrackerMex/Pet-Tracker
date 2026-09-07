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
