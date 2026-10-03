# impl: mobile-ui-legibility-polish

Fecha: 2026-09-03
Feature: **#61**, branch `feature/61-mobile-ui-legibility-polish`
Implementador: subagente `implementer` de Claude Code (**fallback declarado**,
`CLAUDE.md` §Excepciones — el humano pidió explícitamente que lo hiciera Claude
en vez de Codex CLI; declarado en `progress/current.md`).

Skills cargadas antes de tocar `mobile-pet-tracker/`, en el orden que manda la
carta: `expo:expo-overview` → `expo:expo-native-ui` → `expo:expo-design-system`.
De ellas se tomó el patrón (raíz en `ScrollView`,
`contentInsetAdjustmentBehavior`, tap target ≥ 44 pt, un solo hue de acento) y
**no** su sistema de estilos: `docs/ui-guidelines.md` §Decisiones fijas 1-3 gana,
así que cero `Color.ios.*`, cero `StyleSheet.create`, cero hex fuera de
`src/theme/`. Los tokens siguen viviendo solo en `src/theme/global.css`.

---

## Resultado en una línea

Los 12 requisitos cerrados en **33 commits** (11 rojos + 11 verdes + 11 de cierre
de trazabilidad, uno por requisito), suite móvil en **54 suites / 691 tests verdes**
(base: 53 / 613), `./init.sh` verde de punta a punta. Ninguna desviación de la
spec; dos hallazgos anotados para el reviewer, ninguno bloqueante.

---

## Requisitos cubiertos — un commit rojo y uno verde por cada uno

El orden de `design.md` §11 se respetó literalmente: R1 antes que R2, para que
la etiqueta del botón destructivo dejara de resolver con el token del acento
**antes** de que el acento se moviera.

| R | Rojo | Verde | Test que lo nombra |
|---|---|---|---|
| R1 | `87dd3ce` | `bbb7931` | `src/__tests__/legibility-classnames.test.ts::#61 R1: la etiqueta destructiva usa el token de danger` |
| R2 | `ed5e9ae` | `0abaf8c` | `src/theme/__tests__/global-css.test.ts::#61 R2: el relleno de acento pasa AA con etiqueta blanca` |
| R3 | `0860e10` | `67a9177` | `src/__tests__/legibility-classnames.test.ts::#61 R3: ningún texto sobre bg-accent se compone con opacidad` |
| R4 | `caadc07` | `aacf81e` | `global-css.test.ts::#61 R4: token accent-strong con AA como tinta en los dos temas` + `legibility-classnames.test.ts::#61 R4: el acento como tinta usa accent-strong` |
| R5 | `7f4eb6e` | `e8e939d` | `global-css.test.ts::#61 R5: token warning-strong con AA sobre surface y warning-soft` + `legibility-classnames.test.ts::#61 R5: text-warning deja de usarse como color de texto` |
| R6 | `83f94eb` | `f20366c` | `global-css.test.ts::#61 R6: muted light pasa AA sobre bg-default sin tocar dark` |
| R7 | `90ed300` | `66844d2` | `src/app/(auth)/__tests__/register.test.tsx::#61 R7: register usa las métricas de pantalla uniformes` |
| R8 | `a929d27` | `2fdece3` | `login.test.tsx` + `forgot.test.tsx` + `src/screens/reset-password/index.test.tsx`, los tres `::#61 R8: …` |
| R9 | `f001bc5` | `0e39709` | `src/screens/profile/index.test.tsx::#61 R9: la etiqueta de sección de pet-info-card vuelve a #46 R10` |
| R10 | `59d3fe7` | `397b74c` | Los **7** archivos de `requirements.md` R10, todos `::#61 R10: los controles táctiles declaran TOUCH_SLOP` |
| R11 | `895ccb0` | `26fe409` | `src/app/(tabs)/__tests__/map.test.tsx::#61 R11: el overlay de stats reparte los cuatro tiles en 2x2 sin envolver` |
| R12 | — | — | Gate mecánico, sin test de jest. Evidencia abajo |

Ningún commit mezcla test rojo con implementación: C4 de `CHECKPOINTS.md` queda
cumplida y el `git log` lo enseña. El rojo de R10 lo es por módulo inexistente
(`src/theme/touch-target.ts` es implementación, no test, según `tasks.md` §R10
paso 2); los otros diez fallan por assert.

`specs/mobile-ui-legibility-polish/traceability.md` no tiene ninguna fila
"pendiente" salvo **AC10**, que es el gate humano no delegable a IA.

---

## Archivos creados

- `mobile-pet-tracker/src/theme/touch-target.ts` — exporta `TOUCH_SLOP`
  (`{ top: 6, bottom: 6, left: 6, right: 6 }`), la holgura táctil compartida de
  R10. Constante TS y no token de `global.css` porque `hitSlop` no es expresable
  en CSS; el precedente en el repo es `TAB_INDICATOR_SPRING`.
- `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` — tests de
  **uso** de token (R1, R3, R4-uso, R5-uso). Lee las fuentes `.tsx` y afirma
  sobre el `className`, siguiendo el patrón que #72 dejó en
  `design-drift.test.ts`. Incluye los dos invariantes greppables de R4 y el de
  R5.

## Archivos modificados

**Tokens y carta**

- `src/theme/global.css` — `--accent` y `--color-accent` a `#178255` en los dos
  variants; `--focus` y `--tab-pill`/`--color-tab-pill` arrastrados con él;
  `--accent-strong`/`--color-accent-strong` nuevos (`#107148` light,
  `#2AB87C` dark); `--warning-strong` nuevo (`#92610A` / `#FBBF24`);
  `--muted`/`--color-muted` a `#667085` solo en light. Bloque `@theme inline`
  nuevo con los dos espejos `--color-*` que registran las utilidades `text-*`.
  `--accent-foreground` sigue en `#FFFFFF` y `--radius-card` no se tocó.
- `docs/ui-guidelines.md` — punto **11** en §Decisiones fijas: la desviación
  declarada del Figma en el acento, con el texto de `design.md` §7. Queda
  escrito en la carta y no solo en la spec, para que la próxima auditoría no
  proponga volver al `#2AB87C` como si fuese un descuido.

**Pantallas y componentes** (los 13 `className` de tinta, los 6 imperativos, los
4 nodos con opacidad, los 3 de aviso, los 13 `hitSlop`, las 4 ramas de scroll)

| Archivo | Qué cambió | R |
|---|---|---|
| `src/screens/reminders/index.tsx` | `text-danger-foreground` en el label destructivo; 1 aviso | R1, R5 |
| `src/app/(tabs)/food.tsx` | 2 `opacity-*` fuera; 1 tinta; `useThemeColors` | R3, R4 |
| `src/app/(tabs)/meal-schedule.tsx` | 2 `opacity-*` fuera; `useThemeColors`; 1 `hitSlop` | R3, R4, R10 |
| `src/components/floating-tab-bar.tsx` | 1 tinta; `useThemeColors` | R4 |
| `src/components/weight-chart.tsx`, `src/components/pet-map.tsx` | `useThemeColors` | R4 |
| `src/app/(auth)/login.tsx` | 2 tintas; raíz → `ScrollView` | R4, R8 |
| `src/app/(auth)/forgot.tsx` | 1 tinta; raíz → `ScrollView` | R4, R8 |
| `src/app/(auth)/register.tsx` | `contentContainerStyle` + insets + `testID`; fuera el `View` intermedio | R7 |
| `src/screens/reset-password/index.tsx` | 2 tintas; las **3** ramas → `ScrollView` | R4, R8 |
| `src/app/(tabs)/home.tsx` | 1 tinta; 1 aviso; `useThemeColors` | R4, R5 |
| `src/app/(tabs)/health.tsx` | 1 tinta; 1 aviso; 1 `hitSlop` | R4, R5, R10 |
| `src/app/(tabs)/map.tsx` | 2 tintas; overlay 2×2 + `numberOfLines` | R4, R11 |
| `src/app/(tabs)/weight-log.tsx` | 1 `hitSlop` | R10 |
| `src/screens/profile/index.tsx` | 1 tinta; label de sección; 2 `hitSlop` | R4, R9, R10 |
| `src/screens/add-pet/index.tsx` | 1 tinta; 4 `hitSlop` | R4, R10 |
| `src/screens/add-reminder/index.tsx` | 3 `hitSlop` | R10 |
| `src/screens/docs/index.tsx` | 1 `hitSlop` | R10 |

**Tests preexistentes** — solo bloques `describe('#61 R…')` añadidos, más el
`jest.mock` de `react-native-safe-area-context` que R7/R8 necesitan (el mismo de
`home.test.tsx:45-48`, sancionado por `design.md` §D7). Cero líneas eliminadas,
verificado mecánicamente abajo.

---

## Los asserts que se tocaron, y por qué

**Uno solo, y es la excepción declarada E1 de `design.md` §6**: los **10
literales de color en 9 líneas** de
`mobile-pet-tracker/src/theme/__tests__/global-css.test.ts`.

```
-      muted: '#6B7280',                                            (75, R6)
-      accent: '#2AB87C',                                           (78, R2)
-      focus: '#2AB87C',                                            (83, R2)
-    ['light', '#2AB87C', '#FFFFFF', '#6B7280', …],                 (95, R2+R6)
-    ['dark', '#2AB87C', '#FFFFFF', '#9CA3AF', …],                  (96, R2)
-      accent: '#2AB87C',                                          (125, R2)
-      focus: '#2AB87C',                                           (130, R2)
-    ['light', …, 'rgba(42,184,124,0.14)'],                        (137, R2)
-    ['dark', …, 'rgba(42,184,124,0.22)'],                         (138, R2)
```

Todos son asserts de **valor de token** de #46 R1/R2, la codificación de la
paleta del Figma que esta feature contradice a propósito y por escrito. Ninguno
es un assert de conducta. Van repartidos en sus dos commits: los 8 de R2 en
`0abaf8c`, los 2 de R6 en `f20366c`.

**Ningún otro test se puso rojo en toda la implementación.** Las ocho
comprobaciones que `design.md` §6 anticipaba como "no producen excepción" se
confirmaron una a una en verde: `card.test.tsx` (afirma la clase `bg-accent`, no
su valor), `pet-switcher.test.tsx` (`border-accent`), `pet-map.test.tsx` (mockea
`useThemeColors` ignorando argumentos), `reminders/index.test.tsx:160`
(`bg-danger` en el `Button`, no en el `Button.Label`), `map.test.tsx:558`
(el `style` del overlay), `health.test.tsx:359-367` (`#F59E0B`/`#FBBF24` del
icono, y `--warning` no se movió), `floating-tab-bar.test.tsx` y
`design-drift.test.ts`.

---

## R12 — gate mecánico

**Suite móvil completa** (`bun test` en `mobile-pet-tracker/`):

```
Test Suites: 54 passed, 54 total
Tests:       691 passed, 691 total
Snapshots:   1 passed, 1 total
```

Base en `origin/main`: 53 suites / 613 tests. Esta feature suma 1 suite
(`legibility-classnames.test.ts`) y 78 tests.

**`git diff origin/main...HEAD`**:

- Archivos bajo `backend-pet-tracker/`: **0**
- Archivos bajo `infra/`: **0**
- `*.test.tsx` preexistentes con líneas eliminadas o modificadas: **0** (los 12
  suman `-0` líneas; todo son bloques añadidos)
- Único test preexistente con contenido previo modificado:
  `src/theme/__tests__/global-css.test.ts`, **9 líneas**, que son exactamente las
  de la tabla E1

**Conteos anti-slop rehechos sobre `src/`** (`tasks.md` R12 paso 3):

| Comprobación | Cuenta |
|---|---|
| hex fuera de `src/theme/` | **0** |
| clases arbitrarias `[...]` | **0** |
| `StyleSheet.create` | **0** |
| `shadow*` / `elevation:` legacy | **0** |
| `text-accent` suelto (sin `-strong` ni `-foreground`) | **0** |
| `text-warning` como color de texto | **0** |
| `useThemeColors` pidiendo `'accent'` | **0** |

---

## Output de `$BUILD_CMD` / `./init.sh`

`./init.sh` termina en verde de punta a punta:

```
✅ Build correcto
✅ Tests pasados
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.

  Features: 56/62 completadas | 5 pendientes
```

`bun run lint` y `bun run typecheck` en `mobile-pet-tracker/` también limpios.

---

## Decisiones de implementación (ninguna abre la spec)

- **Los nombres de variable local de `useThemeColors` no se renombraron.** En
  `weight-chart.tsx`, `home.tsx`, `food.tsx`, `meal-schedule.tsx` y
  `floating-tab-bar.tsx` la variable sigue llamándose `accent` aunque el
  argumento sea ahora `'accent-strong'`. El invariante de `requirements.md`
  limita los diffs a "el argumento de `useThemeColors`", y renombrar la
  variable habría ampliado la superficie del diff sin ganar nada verificable.
  Si el reviewer lo prefiere al revés, es un refactor de una línea por sitio.
- **Los `describe` nuevos llevan el prefijo `#61 R<n>`**, como fija `design.md`
  §D7: los R-ids del repo son por feature y ya colisionan.
- **`getByText('Create account')` en R7 se cambió por `getAllByText(...)` con
  longitud 2** dentro del propio test nuevo: la cadena aparece dos veces en
  Register (título y etiqueta del botón). Es un assert nuevo, no una reescritura.

---

## Notas para el reviewer

**1. Un consumidor imperativo del acento quedó fuera de la enumeración de R4 —
y mejora igualmente.**

`src/app/(auth)/forgot.tsx:14` resuelve el color del icono `Lock` con
`useThemeColor(['accent'])` de **heroui-native**, no con el `useThemeColors` del
repo. El barrido de `design.md` §4 grepeó el hook del repo y por eso no lo
lista, así que **no se tocó**: cambiarlo habría sido alcance inventado sobre una
spec aprobada.

No es una regresión, es lo contrario. El icono se pinta sobre `bg-accent-soft`,
umbral no textual de 3,0:1 (WCAG 1.4.11):

| | ratio | veredicto |
|---|---|---|
| ANTES `#2AB87C` sobre `#DFF4EB` | **2,217** | fallaba |
| AHORA `#178255` sobre `#DCECE6` (light) | **3,941** | pasa |
| AHORA `#178255` sobre `#0E2220` (dark) | **3,438** | pasa |

Como tinta le correspondería `--accent-strong` por la regla mecánica de la
feature (4,941 light / 6,501 dark), pero eso es un sitio nuevo: **candidato
limpio para #62**, junto con el barrido de `useThemeColor` de heroui que la
auditoría no hizo.

**2. El flaky de `add-pet`: causa diagnosticada y atribución cerrada. Ver §B3.**

La versión anterior de este reporte decía *"Reproducido en `origin/main` en un
worktree limpio, a la primera ejecución"*. **Esa frase estaba mal calibrada** y
el reviewer hizo bien en no firmarla: era cierta pero con n=1, y él no la
replicó en 12 ejecuciones. Una reproducción única no sostiene un "es
preexistente". Corregida abajo con la evidencia que sí lo sostiene, y con la
causa, que es lo que faltaba.

**3. Lo que el gate humano tiene que mirar y ningún test puede.** El guion de 9
puntos está en `tasks.md` §Cierre. Los dos que más piden ojo:

- El acento **se ve distinto** al Figma Make a propósito (ΔE00 = 17,44). Si en
  el smoke lado a lado eso se lee como defecto, la decisión a revisar es la de
  `design.md` §D1, no la implementación.
- La **tinta en dark no cambió ni un píxel** (`--accent-strong` vale exactamente
  el `#2AB87C` de hoy). Si algo se ve distinto en oscuro que no sea un
  **relleno**, es un bug y merece reporte.

**4. Lo que NO se tocó, y estaba en la spec que no se tocara:** `--success`,
`--radius-card`, `--accent-foreground`, `--warning`, el `--muted` de dark,
`pet-switcher.tsx` (mide 52 pt, la evidencia del audit era incorrecta),
`src/components/card.tsx`, `health.test.tsx:75` (mock desactualizado de `muted`,
anotado como higiene para #62), y los hallazgos 8-12, 14-18, 20 y 22-26.

---

## Pendiente, y no es mío

- **AC10, gate humano no delegable**: smoke en dev build de Android, lado a lado
  con el Figma, en tema claro **y** oscuro.
- **Los dos criterios de aceptación obsoletos de `feature_list.json`** (AC1 y
  AC10): la redacción sustitutiva sigue propuesta en `traceability.md`
  §Criterios obsoletos. `acceptance_criteria` es contrato del humano y no se
  editó.
- **PR**: no abierto, por instrucción explícita. La feature no se marca `done`.

---

# Segunda vuelta — cierre de los bloqueos del reviewer

Veredicto de partida: `progress/review_mobile-ui-legibility-polish.md`,
**RECHAZADO** con tres bloqueos. B2 (la firma humana de la spec) es del leader y
del humano y **no se ha tocado**. Aquí van B1 y B3.

El reviewer dio por buenos y verificados el color, las safe areas y los touch
targets, y recalculó los ratios él mismo. **Nada de eso se ha rehecho.**

## B1 — R11 ya tiene un test que defiende la maqueta 2×2

Commit: `292b20d`, `test(mobile-ui-legibility): R11 el test defiende también la
maqueta 2x2`. Único cambio de código de esta vuelta, y solo toca un archivo de
test.

El reviewer tenía razón: el `describe('#61 R11')` solo discriminaba
`numberOfLines`. La cláusula principal —los cuatro tiles en **dos filas de
dos**, que es lo que lleva el ancho útil de 53,5 pt a 139— no tenía nada que la
sujetara, así que era revertible sin poner nada en rojo.

El assert nuevo sube por el árbol renderizado desde cada `stat-*` hasta su fila
`flex-row gap-2` y compara los `stat-*` que esa fila contiene, en orden de
lectura:

```
expect(statsIn(statRow('stat-speed'))).toEqual(['stat-speed', 'stat-distance']);
expect(statsIn(statRow('stat-updated'))).toEqual(['stat-updated', 'stat-gps']);
```

**Verificado con la misma mutación del reviewer, por mí, antes de commitear**:
los cuatro tiles devueltos a una sola fila de cuatro, `numberOfLines={1}`
intacto en los cuatro, `tsc --noEmit` limpio (`grep -c 'flex-row gap-2'` = 1,
`grep -c 'numberOfLines={1}'` = 4).

```
BAJO LA MUTACIÓN
  ● #61 R11: … › reparte los tiles en dos filas de dos y no en una fila de cuatro
    expect(received).toEqual(expected)
      Array [
        "stat-speed",
        "stat-distance",
    +   "stat-updated",
    +   "stat-gps",
      ]

MUTACIÓN REVERTIDA
  Test Suites: 16 passed, 16 total
  Tests:       195 passed, 195 total
```

Un detalle que costó una iteración y que conviene dejar escrito: la primera
versión del assert comparaba instancias (`expect(firstRow).not.toBe(secondRow)`
y `queryByTestId(...)` contra `null`). Falla igual, pero al fallar **mata al
worker de jest**:

```
TypeError: Converting circular structure to JSON
    --> property 'children' -> index 0 -> property 'parent' closes the circle
    at reportSuccess (jest-worker/build/workers/processChild.js:82:11)
  ● Test suite failed to run
    Jest worker encountered 4 child process exceptions, exceeding retry limit
```

Un `ReactTestInstance` tiene `parent` circular y jest no puede serializar el
diff para mandarlo al proceso padre. Por eso el assert final se reduce a
**arrays de cadenas**: mismo poder de detección, diff legible. Queda comentado
en el propio helper para que nadie lo "mejore" de vuelta.

## B3 — el flaky de `add-pet`: reproducido en `origin/main` **y** con la causa encontrada

El reviewer pedía una de dos. **Están las dos.**

### 1. Reproducción en `origin/main`, con el comando exacto

Worktree limpio sobre `origin/main` en **`f84c926`** — el mismo SHA que usó el
reviewer, que es el merge del PR #100 (#53 `mobile-jest-mock-hygiene`) — con
`node_modules` enlazado al del repo principal, o sea el mismo que usamos los
dos. El árbol no contiene **ni una línea** de #61 (`grep -c '#61'` = 0, y la
suite corre **613** tests, el conteo de la base, no los 692 de HEAD).

```bash
git worktree add <scratch>/base origin/main
ln -s <repo>/mobile-pet-tracker/node_modules <scratch>/base/mobile-pet-tracker/node_modules
cd <scratch>/base/mobile-pet-tracker
for i in $(seq 1 13); do bun run test > <scratch>/main$i.log 2>&1; done
```

| Rama | SHA | Ejecuciones | Fallos |
|---|---|---|---|
| `origin/main` (tanda 1) | `f84c926` | 13 | **1** (run 13) |
| `origin/main` (tanda 2, instrumentada) | `f84c926` | 12 | **1** (run 12) |
| `origin/main` (mi observación de la primera vuelta) | `f84c926` | 1 | 1 |
| `origin/main` (**tanda del reviewer**) | `f84c926` | 12 | 0 |

Pooled sobre la base: **3 fallos en 38 ejecuciones ≈ 8 %**, que es del mismo
orden que lo observado en HEAD y explica sin misterio que 12 ejecuciones del
reviewer salieran limpias (a 8 %, la probabilidad de no verlo en 12 es del 36 %).

El fallo en `origin/main` es **el mismo, no uno parecido**: mismo test, misma
línea, mismo par de síntomas.

```
FAIL src/screens/add-pet/index.test.tsx
  ● R7: foto opcional tras alta › uploads a chosen preview only after createPet succeeds
    TypeError: Cannot read properties of undefined (reading 'canceled')
    > 103 |     if (picked.canceled || !picked.assets[0]) return;
  ● R7: foto opcional tras alta › uploads a chosen preview only after createPet succeeds
    Expected: "file:///new-pet.jpg"   Received: null
    > 242 |     await waitFor(() =>
Tests: 1 failed, 612 passed, 613 total
```

(`index.tsx:103` en la base es `:105` en HEAD: los dos los desplaza el `import`
de `TOUCH_SLOP` que añadió R10. Mismo `if`.)

### 2. La causa, que es lo que de verdad faltaba

No es higiene de mocks, y por eso #53 no lo curó. **Es un press que no se
despacha de forma síncrona.**

Instrumenté el archivo **en el worktree de la base** (no en la rama) para
registrar quién llama al picker y cuándo respecto al final de cada test, y
cacé el fallo en la ejecución 12. El orden de los eventos es concluyente:

```
[[ANTES-PRESS]]
[[TRAS-PRESS]] llamadas = 0        ← el press retornó SIN llamar al picker
[[FIN]]    R7: foto opcional tras alta uploads a chosen preview …
[[PICKER]] durante: R1 (mobile-jest-mock-hygiene): … uses a canceled default …
[[FIN]]    R1 (mobile-jest-mock-hygiene): …
TypeError: Cannot read properties of undefined (reading 'canceled')
```

En una ejecución sana esa misma traza da `[[PICKER-R7]] durante: R7 …` y
`[[TRAS-PRESS]] llamadas = 1`.

La cadena causal completa:

1. `add-pet-photo` **no es un `Pressable` de React Native**: es un `Button` de
   **heroui-native** (`add-pet/index.tsx:247-252`). Su `onPress` no se invoca
   de forma síncrona dentro del `fireEvent.press` — pasa por el press feedback
   de heroui.
2. Bajo la suite completa en paralelo, ese despacho **se sale del test**:
   `await fireEvent.press(...)` retorna con `mock.calls.length === 0`.
3. Como `handlePickPhoto` no ha corrido, `photoAsset` sigue en `null`, el
   `waitFor` agota su presupuesto y falla → **síntoma 2** (`Received: null`).
4. El handler corre **después**, ya dentro del test siguiente, contra un mock
   que un `beforeEach` posterior reinicializó (o contra el teardown del
   archivo): `launchImageLibraryAsync()` devuelve `undefined` y revienta en
   `picked.canceled` → **síntoma 1**, la `TypeError`.

Descarté antes la hipótesis obvia —que el presupuesto de 1000 ms de `waitFor`
(`@testing-library/react-native/dist/config.js:15`, `asyncUtilTimeout: 1000`)
se quedara corto— con un experimento en el worktree: forzando
`waitFor(..., { timeout: 1 })` el test **sigue pasando** en aislamiento, porque
en el camino sano el estado ya está puesto en la primera comprobación. El
timeout no es la causa; es la víctima.

### Veredicto de B3

- **No lo introduce #61.** Reproducido dos veces en `f84c926`, un árbol sin una
  sola línea de la feature.
- **No lo agrava #61.** Los 4 tests que #61 añade a ese archivo
  (`describe('#61 R10')`) son `render` + `getByTestId` sobre `Pressable`s
  planos; ninguno toca el picker, ninguno pulsa `add-pet-photo` (en todo el
  archivo hay **un solo** `fireEvent.press` sobre él, el de la línea 242, que es
  de la base) y todos corren **después** del test que falla.
- **No se arregla aquí.** El arreglo es de una línea en un `.test.tsx`
  preexistente —esperar al picker antes de aserverar el preview, p. ej.
  `await waitFor(() => expect(mockLaunchImageLibrary).toHaveBeenCalled())`
  justo tras el press— y el invariante duro de #61 prohíbe tocar un test
  preexistente sin un requisito que lo pida. **Deuda para #62**, ahora con
  causa y con arreglo propuesto en vez de con una nota al pie.

## Estado de la suite tras esta vuelta

```
Test Suites: 54 passed, 54 total
Tests:       692 passed, 692 total
Snapshots:   1 passed, 1 total
```

691 → **692**: el test de estructura de R11. `tsc --noEmit` limpio.

## Lo que sigue sin ser mío

- **B2**: la firma humana sobre el `requirements.md` vigente. Es una casilla y un
  commit del humano; no lo he tocado.
- **AC10**: el smoke en dev build de Android.
- Los dos cosméticos que apunta el reviewer en C5 (el `status: draft` del
  frontmatter de `traceability.md` y la §"Criterios obsoletos", que quedó
  desfasada porque `d8cee0b` ya pegó las redacciones en `feature_list.json`)
  son de ficheros del leader.
