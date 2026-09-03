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

**2. Hay un test flaky en la suite, y es preexistente — no lo trae #61.**

`src/screens/add-pet/index.test.tsx` ›
`R7: foto opcional tras alta › uploads a chosen preview only after createPet succeeds`
falla de forma intermitente (unas 2 de cada 20 ejecuciones de la suite completa,
nunca en ejecución aislada: 12/12 verdes). El síntoma es
`TypeError: Cannot read properties of undefined (reading 'canceled')` en
`add-pet/index.tsx:105` — `mockLaunchImageLibrary` devuelve `undefined`, o sea
higiene de mocks, no color ni layout.

**Reproducido en `origin/main` en un worktree limpio, a la primera ejecución.**
La feature no lo introduce ni lo agrava: al primer indicio se paró y se verificó
contra la base antes de seguir, en vez de reescribir el test. Hay ya un
`describe('R1 (mobile-jest-mock-hygiene): el mock del picker se reinicializa por
test')` en ese mismo archivo, así que el área tiene historia. **No entra en
#61**: tocarlo sería editar un `.test.tsx` preexistente sin requisito que lo
pida, justo lo que el invariante prohíbe. Vale como hallazgo para #62 o para una
feature de higiene propia.

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
