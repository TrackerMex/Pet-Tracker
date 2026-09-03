# review: mobile-ui-legibility-polish

Fecha: 2026-09-03
Feature: **#61**, branch `feature/61-mobile-ui-legibility-polish` (HEAD `14996a7`, 46 commits sobre `origin/main` en `f84c926`)
Revisor: subagente `reviewer` de Claude Code

## Veredicto: **RECHAZADO**

Tres bloqueos. Ninguno está en el código de producción, que es correcto y que
he verificado línea a línea: el diff respeta el invariante duro entero, los
seis valores de contraste que la spec afirma los he recalculado yo y salen, y
los siete conteos anti-slop de C8 dan cero. Lo que falla es **la evidencia**:
un requisito cuyo test no prueba lo que dice probar, un gate humano firmado
sobre un texto distinto del implementado, y un rojo intermitente que no he
podido atribuir a la base.

Los tres son baratos de cerrar. Ninguno pide reescribir la feature.

> **Nota de independencia.** `progress/current.md` §Implementador declara el
> fallback: implementó el subagente `implementer`, no Codex CLI, a petición
> explícita del humano. Implementador y revisor son el mismo modelo, que es
> justo lo que el arnés quería evitar. He compensado no dando por buena
> ninguna cifra del reporte: `./init.sh`, la suite móvil, los ratios de
> contraste, los conteos y los rojos de cada R-id están regenerados por mí,
> y dos afirmaciones del reporte **no** se sostuvieron (B1 y B3).

---

## Bloqueos

### B1 — R11: la cláusula principal del requisito no tiene test que la defienda (C4, C5)

R11 manda dos cosas: (a) repartir los cuatro tiles **en dos filas de dos**,
que es lo que lleva el ancho útil de texto por tile de 53,5 pt a 139 pt y por
tanto es *el arreglo*, y (b) declarar `numberOfLines={1}` en los cuatro `Text`
de valor.

El `describe('#61 R11: …')` de `map.test.tsx` solo discrimina (b).

Mutación que lo demuestra, ejecutada por mí en un worktree limpio sobre HEAD —
aplané el 2×2 de vuelta a una sola fila de cuatro, **conservando**
`numberOfLines={1}`, con typecheck limpio:

```
=== full map.test.tsx bajo la mutación (2x2 revertido) ===
PASS src/app/(tabs)/__tests__/map.test.tsx
Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
```

Los **45** tests del archivo pasan con la maqueta revertida. No es solo el
bloque de R11: no hay nada en toda la suite que lo sujete (el único snapshot
del repo es `pet-avatar.test.tsx.snap`, ajeno). El commit rojo `895ccb0`
tampoco lo prueba — sus 4 fallos son los cuatro `numberOfLines`.

Consecuencia práctica: mañana alguien devuelve el overlay a una fila de cuatro
y CI sigue verde, que es exactamente la regresión que C4 existe para impedir.
La fila R11 de `traceability.md` afirma una cobertura que no tiene.

**Qué falta**: un assert sobre la estructura — que el contenedor de los tiles
tenga dos hijos, cada uno `flex-row gap-2`, con `stat-speed`/`stat-distance` en
el primero y `stat-updated`/`stat-gps` en el segundo. Sirve el patrón de
lectura de fuente que ya usa `legibility-classnames.test.ts`, o un
`toBeOnTheScreen`/parent-walk sobre el árbol renderizado.

### B2 — C6: R2, R3 y R4 se reescribieron después de la firma humana, y quien re-aprobó fue Claude

Cronología reconstruida por mí, en UTC, de los commits de la spec:

| Commit | UTC | Autor | Qué |
|---|---|---|---|
| `e51aead` | 18:02:56 | Claude | spec de #61 en draft (vía `--accent-contrast`) |
| `cdc8b82` | **19:42:10** | **AlexisSM377** | **firma humana**: `- [ ]` → `- [X] Aprobado por humano (fecha: 2026-09-03)` |
| `d341903` | 19:44:21 | Claude | revierte la decisión de contraste en `feature_list.json` |
| `d8cee0b` | 19:59:56 | Claude | **spec rehecha**: R2, R3 y R4 cambian de contenido |
| `29f94aa` | 20:01:20 | Claude | frontmatter `draft` → `approved` |

`git log --format='%an' d8cee0b..HEAD` no devuelve **ningún** commit humano: todo
lo posterior a la reescritura lo firma Claude.

Y el texto que el humano firmó dice **lo contrario** del que se implementó.
R2 en `cdc8b82`:

> SHALL exponer un token `--accent-contrast` con el valor **`#0B402A`** … y
> THE SYSTEM SHALL **conservar `--accent`** … con sus valores actuales exactos
> (**`#2AB87C`** y `#FFFFFF`)

R2 en HEAD:

> SHALL definir `--accent` y `--color-accent` con el valor **`#178255`** …

La casilla `[X]` con fecha 2026-09-03 que hoy luce `requirements.md` viajó
literal desde el documento anterior; además la §Aprobación pasó de pedir la
firma de **dos** puntos a pedir la de **cuatro**, y esos cuatro no están
firmados por nadie en el historial.

`progress/current.md` §"Gate humano: cerrado" lo reconoce por escrito ("La
firma cayó sobre el texto **previo** a la reversión, pero el humano había
pedido esa vía por chat antes de firmar"). Doy crédito a que la reversión salió
del humano — la cita textual y `d341903` lo respaldan — pero **una decisión
reportada por un agente no es la firma**: C6 pide el gate, y el flujo del repo
(memoria `vps-spec-approval-flow`) dice que lo cierra el humano con su commit.

**Qué falta**: un commit del humano sobre el `requirements.md` actual. Es una
casilla. No hay que rehacer nada más.

### B3 — Rojo intermitente en `add-pet` que sí reproduje en HEAD y NO en `origin/main`

El reporte lo declara preexistente y exculpa a la feature con esta frase:

> **Reproducido en `origin/main` en un worktree limpio, a la primera ejecución.**

No me replicó. Suite móvil completa, misma máquina, mismo `node_modules`,
ejecuciones secuenciales:

| Rama | Ejecuciones | Fallos |
|---|---|---|
| **HEAD** (`14996a7`) | **9** | **1** — `FAIL src/screens/add-pet/index.test.tsx`, 1 test / 690 verdes |
| **`origin/main`** (`f84c926`) | **12** | **0** |

Con esas cifras no puedo afirmar que #61 lo introduzca (1/9 contra 0/12 no es
significativo), pero **tampoco puedo firmar que sea preexistente**, que es lo
que el reporte pide que acepte. La afirmación exculpatoria no está sostenida
por la evidencia que yo genero, y la regla del revisor es que no apruebo con
un rojo sin explicar.

Contexto que lo agrava: #53 `mobile-jest-mock-hygiene` se mergeó hoy (PR #100)
precisamente para arreglar la higiene del mock de `launchImageLibraryAsync` en
esa suite — dejó el `beforeEach` de fichero con `mockReset()` +
`mockResolvedValue({canceled:true})` y un `describe('R1 (mobile-jest-mock-hygiene)')`
de guardia. Que el área siga con flakiness después de esa feature merece
diagnóstico, no una nota al pie. Y #61 añade **4 tests de render nuevos** a ese
mismo archivo (el `describe('#61 R10')`), que es una variable nueva sobre el
timing.

**Qué falta**: o el diagnóstico de la causa (por qué
`mockLaunchImageLibrary` devuelve `undefined` en `add-pet/index.tsx:105` solo
bajo suite completa), o una tanda de ejecuciones sobre `origin/main` que
reproduzca el fallo y cierre el asunto. Si aparece en la base, se anota como
deuda de #62 y deja de contar contra #61.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress`: `Counter({'done': 56, 'pending': 5, 'in_progress': 1})`, y la única es #61
- [x] `progress/current.md` describe la sesión activa, declara el fallback al subagente `implementer` y el drift de rama ya resuelto
- [x] `progress/history.md` — sesión aún abierta, no procede entrada
- [ ] **Suite móvil estable** — ver B3
- [ ] `STATUS.md` desactualizado: `init.sh` avisa `56/60 declarado vs 56/62 real`. Tarea de cierre del `leader`, no del implementer, pero está abierta

## Checklist C3 — Arquitectura

`docs/architecture.md` define las capas domain / application / infrastructure
para los módulos de backend. Esta feature no toca backend (0 archivos bajo
`backend-pet-tracker/` e `infra/`, verificado), así que la regla de dependencia
no tiene superficie donde aplicarse. Lo que sí aplica y se cumple:

- [x] Tokens **solo** en `mobile-pet-tracker/src/theme/global.css` — cero hex fuera de `src/theme/`
- [x] `TOUCH_SLOP` vive en `src/theme/touch-target.ts`, no duplicado en 7 pantallas. Es la ubicación correcta: `expo:expo-design-system` manda que todo valor visual repetido sea token del tema, y `hitSlop` no es expresable en CSS. Precedente en repo: `TAB_INDICATOR_SPRING`
- [x] Rutas finas + `src/screens/` respetado; ningún archivo nuevo fuera de convención

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra (`describe('#61 R<n>: …')`)
- [x] Historial test-primero **real**: los 11 rojos preceden a su verde por SHA y por reloj
- [ ] **R11: el test no discrimina la cláusula principal** — B1

Verificación independiente: hice checkout de **cada commit rojo** en un
worktree aislado y ejecuté su(s) archivo(s) de test filtrando por el R-id.
Los once fallan sin su implementación:

| R | Rojo | Verde | Resultado en el commit rojo |
|---|---|---|---|
| R1 | `87dd3ce` | `bbb7931` | 2 failed, 1 passed |
| R2 | `ed5e9ae` | `0abaf8c` | 4 failed, 3 passed |
| R3 | `0860e10` | `67a9177` | 4 failed |
| R4 | `caadc07` | `aacf81e` | 16 failed, 3 passed (2 suites) |
| R5 | `7f4eb6e` | `e8e939d` | 7 failed, 5 passed (2 suites) |
| R6 | `83f94eb` | `f20366c` | 1 failed, 2 passed |
| R7 | `90ed300` | `66844d2` | 3 failed |
| R8 | `a929d27` | `2fdece3` | 6 failed, 3 suites |
| R9 | `f001bc5` | `0e39709` | 1 failed |
| R10 | `59d3fe7` | `397b74c` | 7 suites failed — `Cannot find module '…/theme/touch-target'` |
| R11 | `895ccb0` | `26fe409` | 4 failed, 1 passed ← **solo los `numberOfLines`** |

Dos matices que el reporte declara y confirmo:

- El rojo de R10 es por módulo inexistente, no por assert. Lo compensé con una
  **mutación sobre HEAD**: borré los 13 `hitSlop={TOUCH_SLOP}` de las fuentes
  dejando el módulo en pie → `Test Suites: 7 failed, 7 total; Tests: 15 failed`.
  El test de R10 no es decorativo.
- La misma mutación aplicada a R11 es la que produce B1.

Los 33 commits de implementación son 11 rojos + 11 verdes + 11 de trazabilidad,
sin ninguno que mezcle test con implementación. Esto es lo que #19 incumplió
con Codex; aquí está bien hecho.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin filas "pendiente" salvo AC10, que es el gate humano y por definición no automatizable
- [x] Commits con formato `feat(mobile-ui-legibility): <desc> (R…)` / `test(...)` / `docs(...)`
- [ ] **La fila de R11 afirma una cobertura que el test no da** — B1
- [ ] Cosmético: `traceability.md` sigue con `status: draft` en el frontmatter. No es criterio de C5 y media docena de specs del repo están igual, pero conviene cerrarlo
- [ ] Cosmético: §"Criterios obsoletos" propone reescribir AC1 y AC10 "para que el humano lo pegue", pero **ya están pegados**: `d8cee0b` los actualizó en `feature_list.json`. La sección quedó desfasada; también lo dice de más el impl report en §Pendiente

## Checklist C6 — Spec aprobada

- [x] `requirements.md` tiene `status: approved` y la casilla marcada con fecha
- [ ] **Requisitos modificados tras la aprobación sin volver a pasar por el gate** — B2

## Checklist C7 — Sin código huérfano

- [x] `--accent-contrast`, el token de la vía descartada, no existe en ninguna parte de `mobile-pet-tracker/src` ni de `docs/` — ni como token muerto ni comentado
- [x] La migración de tinta es completa, no parcial: **0** `text-accent` sueltos, **0** `text-warning` como color de texto, **0** `useThemeColors(['accent'])`. No queda un consumidor del token viejo conviviendo con el nuevo
- [x] Cero archivos borrados por la rama, y ninguno debía borrarse: la feature sustituye valores y clases, no componentes
- [x] Los `.test.tsx` de código eliminado — no aplica, no se eliminó código

## Checklist C8 — UI móvil conforme a la carta

Skills cargadas antes de juzgar, en el orden que manda la carta:
`expo:expo-overview` → `expo:expo-design-system` → `expo:expo-native-ui`.
`docs/ui-guidelines.md` gana sobre ellas donde chocan (sistema de estilos:
Tailwind + tokens en `global.css`, no `Color.ios.*` ni `StyleSheet.create`), y
el implementer aplicó bien esa precedencia.

- [x] **Grep-clean** — conteos rehechos por mí, no heredados (abajo)
- [x] **Dimensiones de pantalla**: R7 y R8 dejan las cuatro pantallas de auth con `padding: 24`, `gap: 16`, `paddingTop: insets.top + 12`, `paddingBottom: insets.bottom + 24` (96 en register) vía `useSafeAreaInsets`, safe area arriba **y** abajo. Es literalmente lo que pide `expo:expo-native-ui` §Responsiveness: raíz en `ScrollView`, `contentInsetAdjustmentBehavior="automatic"`, padding en `contentContainerStyle` y no en el `ScrollView`. Las 15 pantallas con scroll lo cumplen ya
- [x] **Skeleton dimensionado**: 32 usos de `Skeleton`, **0** `ActivityIndicator` suelto
- [x] **Componentes compartidos**: sin forks locales. `TOUCH_SLOP` es una constante compartida, no 13 literales `{top:6,…}` repetidos
- [x] **Touch target ≥ 44 pt**: 13 `hitSlop={TOUCH_SLOP}` en las tres recetas (health 1, meal-schedule 1, weight-log 1, profile 2, add-pet 4, add-reminder 3, docs 1). Sin cambiar el tamaño visible, que es lo que pedía AC6
- [x] **Animaciones**: la feature no añade ninguna. `TAB_INDICATOR_SPRING` y `ReduceMotion.System` intactos; ningún token de color entra en un estilo animado

### Conteos anti-slop, rehechos (`audit_ui_polish.md` §Conteos)

Sobre `mobile-pet-tracker/src/**/*.{ts,tsx}`, excluyendo `__tests__/` y `*.test.*`:

| Comprobación | Implementer | **Yo** |
|---|---|---|
| hex fuera de `src/theme/` | 0 | **0** |
| clases arbitrarias `[...]` | 0 | **0** |
| `StyleSheet.create` | 0 | **0** |
| `shadow*` / `elevation:` legacy | 0 | **0** |
| `text-accent` suelto (sin `-strong`/`-foreground`) | 0 | **0** |
| `text-warning` como color de texto | 0 | **0** |
| `useThemeColors` pidiendo `'accent'` | 0 | **0** |

Siete a cero confirmados. Además: `text-accent-strong` aparece **13** veces y
`useThemeColors(['accent-strong'])` en **6** sitios (`floating-tab-bar`,
`pet-map`, `weight-chart`, `home`, `food`, `meal-schedule`), que son
exactamente los 13 + 6 que enumera R4.

---

## Contraste — recalculado por mí, sin aceptar ninguna cifra de la spec

Fórmula de luminancia relativa sRGB (`L = 0,2126·R + 0,7152·G + 0,0722·B` sobre
canales linealizados; `ratio = (L_claro + 0,05)/(L_oscuro + 0,05)`). Los
`*-soft` los compuse al 15 % de alfa sobre su superficie, según
`heroui-native/src/styles/theme.css:83-97`, que verifiqué en disco.

Ancla de control: `#FFFFFF` sobre `#2AB87C` = **2,547** — reproduce el valor
que el humano verificó a mano.

| Par | Yo | Spec | AA |
|---|---|---|---|
| `#FFFFFF` sobre `--accent` `#178255` (light y dark) | **4,816** | 4,816 | ✔ ≥4,5 |
| `#178255` sobre `#0D1117` (visibilidad del relleno en dark, 1.4.11) | **3,930** | 3,930 | ✔ ≥3,0 |
| blanco `opacity-70` sobre el acento | **3,193** | 3,202 | ✗ — por eso R3 la quita |
| blanco `opacity-80` sobre el acento | **3,683** | 3,686 | ✗ — ídem |
| `--accent-strong` light `#107148` sobre surface / default / surface-secondary / accent-soft | **6,039 / 5,584 / 5,703 / 4,950** | 6,039 / 5,584 / 5,703 / 4,941 | ✔ |
| `--accent-strong` dark `#2AB87C` sobre las mismas | **6,792 / 6,128 / 6,432 / 6,498** | 6,792 / 6,128 / 6,432 / 6,501 | ✔ |
| `--warning-strong` light `#92610A` sobre surface / warning-soft | **5,335 / 4,758** | 5,335 / 4,748 | ✔ |
| `--warning-strong` dark `#FBBF24` sobre surface / warning-soft | **10,362 / 7,498** | 10,362 / 7,477 | ✔ |
| `--muted` light `#667085` sobre bg-default / surface / surface-secondary | **4,601 / 4,975 / 4,699** | 4,601 / 4,975 / 4,699 | ✔ |
| `--muted` dark `#9CA3AF` sobre bg-default (sin tocar) | **6,148** | 6,148 | ✔ |
| `text-accent-strong` sobre `tab-pill` light / dark | **5,018 / 5,992** | 5,038 / 5,983 | ✔ |

Coinciden hasta el redondeo. Las diferencias de ±0,02 están solo en los pares
que involucran un `*-soft` o el `tab-pill`, y son la mezcla oklab de la spec
frente a mi mezcla sRGB: ninguna cruza el umbral. **Ningún par que la spec dice
que pasa AA se queda por debajo de 4,5:1.**

Tokens en `global.css` verificados en disco, uno a uno:
`--accent: #178255` en los dos variants ✔ · `--accent-foreground: #FFFFFF`
intacto en los dos ✔ · `--accent-strong: #107148` light / `#2AB87C` dark ✔ ·
`--warning-strong: #92610A` / `#FBBF24` ✔ · `--muted: #667085` en light con el
`#9CA3AF` de dark intacto ✔ · `--focus` y `--tab-pill` arrastrados ✔ ·
`--radius-card: 20px`, `--warning` y `--success` sin tocar ✔.

---

## Invariante de la feature — verificado, no aceptado

| Cláusula | Cómo lo comprobé | Resultado |
|---|---|---|
| Cero cambios de conducta / lógica / navegación / API | Filtrado del diff de fuentes por `useState`, `useEffect`, `router.*`, `api/`, `fetch(`, `onPress`, `onChangeText` | Los únicos hits son las **9 líneas de `register.tsx` reindentadas** al promover los hijos fuera del `View` intermedio: handlers idénticos, movidos 2 espacios |
| Ningún `testID` renombrado ni eliminado | Conjuntos de `testID` de `origin/main` y de HEAD, comparados | **216 → 222**. Cero pérdidas, cero renombres. Los 6 nuevos son `screen-register`, `screen-login`, `screen-forgot` y `screen-reset-password` ×3, los que R7/R8 autorizan |
| Ningún texto visible cambia | Extracción de nodos de texto JSX del diff y comparación de multiconjuntos | **Cero** cadenas visibles alteradas. Todo lo que entra y sale son valores CSS, `className` y props de estilo |
| Solo tokens, `className`, props de estilo/render, argumento de `useThemeColors` y estructura de contenedores | Lectura del diff completo de fuentes | Se cumple sin excepción |
| Cero archivos bajo `backend-pet-tracker/` e `infra/` | `git diff --name-only` | **0** |

### La excepción E1, comprobada línea a línea

De los 14 archivos de test del diff, **13 son puramente aditivos** (`-0` líneas,
confirmado con `--numstat`). El único con contenido previo modificado es
`src/theme/__tests__/global-css.test.ts`: **9 líneas**, con **10 literales de
color**, exactamente las que declara `design.md` §6:

```
-      muted: '#6B7280',                                  →  '#667085'
-      accent: '#2AB87C',                                 →  '#178255'   (light)
-      focus: '#2AB87C',                                  →  '#178255'   (light)
-    ['light', '#2AB87C', …, '#6B7280', …]                →  2 literales
-    ['dark',  '#2AB87C', …]                              →  '#178255'
-      accent: '#2AB87C',                                 →  '#178255'   (dark)
-      focus: '#2AB87C',                                  →  '#178255'   (dark)
-    ['light', …, 'rgba(42,184,124,0.14)']                →  rgba(23,130,85,0.14)
-    ['dark',  …, 'rgba(42,184,124,0.22)']                →  rgba(23,130,85,0.22)
```

Las nueve son **sustituciones de valor**, no supresiones: ningún `expect`
desaparece, ningún caso de `it.each` se pierde, ninguna clave de
`toMatchObject` se cae, ningún test se marca `skip`. Son asserts de valor de
token de #46 R1/R2 — la codificación de la paleta del Figma que esta feature
contradice a propósito y por escrito. **Ningún assert de conducta se relajó ni
se borró en ningún sitio**, y como los otros 13 archivos suman `-0` líneas, ahí
no cabía relajar nada.

---

## R-ids

| R | Implementación | Test nombra el R-id | Rojo verificado | ¿Falla al revertir? | Estado |
|---|---|---|---|---|---|
| R1 | ✔ `text-danger-foreground` en `reminders-delete-confirm` | ✔ | ✔ | ✔ | **OK** |
| R2 | ✔ `--accent`/`--color-accent`/`--focus`/`--tab-pill` a `#178255`; `--accent-foreground` intacto | ✔ | ✔ | ✔ | **OK** |
| R3 | ✔ las 4 `opacity-*` fuera | ✔ | ✔ | ✔ | **OK** |
| R4 | ✔ token + 13 `className` + 6 imperativos; cero `'accent'` restantes | ✔ (2 archivos) | ✔ | ✔ | **OK** |
| R5 | ✔ `--warning-strong` + 3 sitios; ámbar puro conservado en iconos y rellenos | ✔ (2 archivos) | ✔ | ✔ | **OK** |
| R6 | ✔ `--muted` light `#667085`, dark intacto | ✔ | ✔ | ✔ | **OK** |
| R7 | ✔ `contentContainerStyle` + insets + `testID`; `View` intermedio eliminado | ✔ | ✔ | ✔ | **OK** |
| R8 | ✔ las 3 pantallas, las 3 ramas de reset, `alignItems` solo donde había `items-center` | ✔ (3 archivos) | ✔ | ✔ | **OK** |
| R9 | ✔ label de `pet-info-card` vuelve al tratamiento de #46 R10 | ✔ | ✔ | ✔ | **OK** |
| R10 | ✔ los 13 controles | ✔ (7 archivos) | ✔ (módulo ausente) | ✔ (mutación: 15 tests caen) | **OK** |
| R11 | ✔ el 2×2 y los 4 `numberOfLines` **están en el código** | ✔ | parcial | **✗ el 2×2 no** | **RECHAZADO** — B1 |
| R12 | gate mecánico | n/a | n/a | n/a | **Parcial** — el diff cumple; la suite no es estable (B3) |

---

## Los diez criterios de aceptación de #61

| AC | Cubierto por | Estado |
|---|---|---|
| AC1 — acento a `#178255`, etiqueta blanca, tinta a `--accent-strong`, desviación escrita en la carta | R2 + R3 | ✔ Verificado, incluido el punto 11 nuevo de `docs/ui-guidelines.md` §Decisiones fijas |
| AC2 — `text-accent` pasa AA como enlace y `text-warning` deja de ser color de texto | R4 + R5 | ✔ Ratios recalculados; 0 sueltos de cada uno |
| AC3 — `text-muted` sobre `bg-default` pasa AA en claro sin tocar oscuro | R6 | ✔ 4,471 → **4,601**; dark en 6,148 sin cambiar |
| AC4 — Register uniforme y Login/Forgot/Reset con contenedor de scroll | R7 + R8 | ✔ |
| AC5 — label de `pet-info-card` vuelve a #46 R10 | R9 | ✔ |
| AC6 — 44 pt sin cambiar tamaño visible ni `testID` | R10 | ✔ 13 `hitSlop`, 0 `testID` tocados |
| AC7 — el overlay de stats deja de envolver texto | R11 | ⚠️ **El código lo hace; el test no lo defiende** — B1 |
| AC8 — botón destructivo con el token de danger | R1 | ✔ |
| AC9 — suite verde sin reescribir asserts de conducta; diff sin backend ni `.test.tsx` de más | R12 | ⚠️ La parte del diff se cumple **exactamente**; la parte de "suite verde" tropieza con B3 |
| AC10 — **gate humano**: smoke en dev build de Android, lado a lado con el Figma, en claro **y** oscuro | — | **Pendiente por definición.** No cuenta como fallo |

---

## Los dos puntos que el implementer pidió que juzgara

### 1. El icono `Lock` de `forgot.tsx` — fuera de alcance, y correctamente

`forgot.tsx:15` resuelve el color con `useThemeColor(['accent'])` de
**heroui-native**, no con el `useThemeColors` del repo. Es el **único** sitio
del proyecto que usa ese hook (verificado por grep).

Mi decisión: **no es una laguna de R4**. Dos razones y una salvedad.

- R4 enumera conjuntos **cerrados** — "las 13 ocurrencias de `className` y las
  6 imperativas enumeradas en `design.md` §4 R4" — y su cláusula de barrido
  dice literalmente "cero llamadas a **`useThemeColors`**", que es el hook del
  repo. El icono no cae en ninguna de las tres. Tocarlo habría sido alcance
  inventado sobre una spec aprobada, que es peor defecto que dejarlo.
- No queda fallando. Es un icono, o sea componente **no textual**: umbral 3,0:1
  de WCAG 1.4.11, no 4,5:1. Recalculado por mí sobre `bg-accent-soft`:
  **2,222 → 3,947** en claro y **3,437** en oscuro. Antes incumplía 1.4.11 y
  ahora lo cumple en los dos temas. La feature lo mejora de rebote.

La salvedad, que sí quiero anotada: ese sitio es ahora el **único** que
contradice la regla mecánica que esta misma feature acaba de escribir en la
carta ("fondo ⇒ `--accent`; encima de otra cosa ⇒ `--accent-strong`"). Como
tinta le tocaría `--accent-strong` (4,950 claro / 6,498 oscuro). **Candidato
limpio para #62**, junto con el barrido del `useThemeColor` de heroui que la
auditoría no hizo. No bloquea.

### 2. El flaky de `add-pet` — ver B3

No lo di por bueno y no me replicó. Es el bloqueo B3.

---

## Output de `./init.sh` (ejecutado por mí, exit code 0)

```
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
⚠️    init.sh no modifica .env — añade a mano las que necesites desde .env.example
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-ui-legibility-polish
⚠️  STATUS.md desactualizado (56/60 declarado vs 56/62 real) — actualízalo antes de cerrar la sesión
✅ Build exitoso
✅ Tests pasados
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 56/62 completadas | 5 pendientes
```

Los tres avisos de `.env` (`RESEND_*`, `RESET_LINK_HOST`) vienen de #59 y son
preexistentes a esta rama. El de `STATUS.md` es tarea de cierre del `leader`.

## Suite móvil, ejecutada por mí

```
Test Suites: 54 passed, 54 total
Tests:       691 passed, 691 total
Snapshots:   1 passed, 1 total
```

Confirma los números del reporte (base `origin/main`: 53 suites / 613 tests; la
feature suma 1 suite y 78 tests). Verde en **8 de 9** ejecuciones; la novena es
B3.

---

## Para levantar el rechazo

1. **R11**: añadir al `describe('#61 R11')` un assert sobre la estructura 2×2,
   de modo que aplanar el overlay a una sola fila ponga el test rojo. Es el
   único cambio de código que pido.
2. **C6**: que el humano firme con un commit el `requirements.md` **actual**
   (la casilla ya está marcada de la versión anterior; vale con re-marcarla
   sobre el texto vigente y de paso los cuatro puntos de §Aprobación).
3. **B3**: diagnosticar el flaky o reproducirlo sobre `origin/main`. Si es de
   la base, se anota como deuda y deja de contar contra #61.

Nada de esto toca los tokens, los ratios ni las 17 pantallas: el trabajo de
color, safe areas y touch targets está bien hecho y verificado.

## Pendientes que solo puede cerrar el humano

- **AC10** — smoke en **dev build de Android** (no Expo Go), lado a lado con el
  Figma, en tema **claro Y oscuro**. Guion de 9 puntos en `tasks.md` §Cierre.
  Los dos puntos que más ojo piden:
  - el acento **se ve distinto** al Figma Make a propósito (ΔE00 = 17,44); si
    en el smoke se lee como defecto, lo que hay que revisar es la decisión
    `design.md` §D1, no la implementación;
  - la **tinta en dark no cambió ni un píxel** (`--accent-strong` dark vale
    exactamente el `#2AB87C` de hoy). Si algo se ve distinto en oscuro que no
    sea un **relleno**, es un bug.
- **La firma de C6** (B2): es suya, no del implementer ni del leader.
- **Los cuatro puntos de §Aprobación** de la spec vigente (`#178255`, la tinta
  partida por tema, la convivencia con `--success`, y la excepción E1 de 10
  literales en 9 líneas) — ninguno tiene firma sobre el texto actual.
