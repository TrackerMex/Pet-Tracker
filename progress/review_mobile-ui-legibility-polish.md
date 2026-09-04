# review: mobile-ui-legibility-polish

Feature: **#61**, branch `feature/61-mobile-ui-legibility-polish`
Revisor: subagente `reviewer` de Claude Code

- **Vuelta 1** — 2026-09-03, HEAD `14996a7` (46 commits): **RECHAZADO**, tres bloqueos (B1, B2, B3)
- **Vuelta 2** — 2026-09-03, HEAD `e361b08` (50 commits): **APROBADO, supeditado a B2**

---

## Veredicto (vuelta 2): **APROBADO — condicionado a la firma humana de la spec (B2)**

**B1 y B3 están cerrados**, y los he cerrado con mis propias ejecuciones, no
con las del implementer. Los dos aguantaron el escrutinio:

- **B1** — el assert nuevo de R11 **sí** discrimina. Rehice mi mutación: aplanar
  el overlay a una fila de cuatro pone el test rojo con un diff legible; revertir
  lo devuelve a verde. Antes de este commit, esa misma mutación dejaba los 45
  tests del archivo en verde.
- **B3** — **reproduje el flaky yo mismo en `origin/main`**, en la ejecución 2 de
  una tanda nueva, con el `TypeError` idéntico. Es preexistente. Mis 12 corridas
  limpias de la vuelta 1 fueron mala suerte a ~8 %, no evidencia de lo contrario.

**B2 sigue abierto y no es del implementer.** El `requirements.md` vigente no
tiene firma humana: la de `cdc8b82` cayó sobre un texto cuyo R2 pedía **lo
contrario** del implementado. No hay ningún commit del humano posterior a la
reescritura (`git log --format='%an' d8cee0b..HEAD` → solo Claude, comprobado
otra vez hoy sobre `e361b08`).

Con eso: **el trabajo del implementer queda aprobado.** El cierre de la feature
no depende ya de él, sino de dos gates que solo puede cerrar el humano — su
firma sobre la spec vigente (B2) y el smoke de AC10.

> **Nota de independencia.** `progress/current.md` §Implementador declara el
> fallback: implementó el subagente `implementer`, no Codex CLI, a petición
> explícita del humano. Implementador y revisor son el mismo modelo, que es
> justo lo que el arnés quería evitar. He compensado no dando por buena ninguna
> cifra de sus reportes: `init.sh`, la suite, los ratios de contraste, los
> conteos, los rojos de cada R-id y las dos mutaciones están regenerados por mí.
> En la vuelta 1 eso tumbó dos afirmaciones suyas (B1 y B3); en la vuelta 2 las
> dos correcciones se sostienen.

---

# Vuelta 2 — verificación de los cierres

Diff de la vuelta: **4 commits**, y solo uno toca código.

```
mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx |  52 +++   ← 292b20d
progress/impl_mobile-ui-legibility-polish.md             | 222 ++-
progress/review_mobile-ui-legibility-polish.md           | 473 +++
specs/mobile-ui-legibility-polish/traceability.md        |   4 +-
```

**Nada de producción se movió.** `git diff 14996a7...HEAD --name-only` sobre
`mobile-pet-tracker/src` excluyendo tests, más `global.css` y
`docs/ui-guidelines.md`, devuelve **vacío**. Todo lo que di por bueno en la
vuelta 1 —los valores de token, los once pares de contraste que recalculé, las
safe areas de R7/R8, los 13 `hitSlop`, los siete conteos anti-slop y la
excepción E1— sigue exactamente donde estaba, sin necesidad de recomprobación.
La E1 sigue en sus **9 líneas** y los otros 13 `.test.tsx` siguen a **`-0`**
(`--numstat` rehecho).

## B1 — cerrado

Commit `292b20d`. El `describe('#61 R11')` gana un test que sube por el árbol
renderizado desde cada `stat-*` hasta su fila `flex-row gap-2` y compara los
`stat-*` que contiene, en orden de lectura.

**Mi mutación, rehecha sobre `e361b08`** — los cuatro tiles devueltos a una sola
fila de cuatro, `numberOfLines={1}` intacto en los cuatro, `tsc --noEmit` limpio:

```
BASELINE (HEAD sin tocar)
  PASS  Tests: 40 skipped, 6 passed, 46 total

BAJO LA MUTACIÓN
  FAIL src/app/(tabs)/__tests__/map.test.tsx
  ● #61 R11 › reparte los tiles en dos filas de dos y no en una fila de cuatro
    - Expected  - 0
    + Received  + 2
      Array [
    +   "stat-updated",
    +   "stat-gps",
  Tests: 1 failed, 40 skipped, 5 passed, 46 total

  (archivo completo bajo la mutación: 1 failed, 45 passed
   — en la vuelta 1 eran 45 passed, 0 failed)

MUTACIÓN REVERTIDA
  PASS  Tests: 46 passed, 46 total
```

Exactamente el comportamiento que pedí: el único test que cae es el nuevo, los
cinco de `numberOfLines` siguen verdes (correcto — la mutación no los toca), y
el worker no revienta.

**Sobre la reducción a arrays de cadenas: no abre ninguna rendija.** La
propiedad que R11 necesita defender es *qué tiles cuelgan de qué fila y en qué
orden*, y eso es precisamente lo que el assert compara. Comparar
`ReactTestInstance` no habría detectado nada más — habría comparado identidad de
nodos, que es una propiedad más débil disfrazada de más fuerte. Y su motivo es
real: un `ReactTestInstance` tiene `parent` circular y jest mata al worker al
serializar el diff (`Converting circular structure to JSON`); un assert que al
fallar tumba el worker en vez de imprimir el fallo es un assert peor. La
elección es correcta y está comentada en el propio helper.

Dos comprobaciones más que hice sobre el helper, por si el ancla fuera frágil:

- `statRow` compara `className` por **igualdad exacta**, no por `includes`, así
  que no puede engancharse a un superconjunto de clases.
- En `map.tsx` hay **exactamente 2** ocurrencias de `className="flex-row gap-2"`
  y son las dos filas de stats. El ancla es inequívoca.
- Si el walk llega a la raíz sin encontrar fila, lanza con mensaje propio en vez
  de dar un falso verde.

La rendija que sí queda, y que no bloquea: el test no afirma que las dos filas
cuelguen del mismo `View className="gap-2"`. Una maqueta que separase las filas
en dos padres distintos pasaría. Es un escenario que nadie va a escribir por
accidente, y la regresión real —volver a la fila de cuatro— está cubierta.

## B3 — cerrado, y lo cerré yo

Pedía una de dos cosas: el diagnóstico de la causa, o una reproducción sobre la
base. El implementer trae las dos. **No acepté sus números: fui a por la
reproducción por mi cuenta.**

### Mi propia reproducción en `origin/main`

Worktree limpio sobre `f84c926` (el merge del PR #100, o sea **con** #53
`mobile-jest-mock-hygiene` ya dentro), `node_modules` enlazado, suite completa
en bucle:

```
### origin/main run 2 FAILED
    TypeError: Cannot read properties of undefined (reading 'canceled')
    > 103 |     if (picked.canceled || !picked.assets[0]) return;
      at canceled (src/screens/add-pet/index.tsx:103:16)
```

**Falló en la ejecución 2.** Es el mismo fallo, no uno parecido: mismo archivo,
misma expresión `picked.canceled`. Y la línea es **103**, no 105 — el desfase de
dos líneas es exactamente el `import { TOUCH_SLOP }` que #61 añade en HEAD, lo
que confirma de paso que el árbol donde reproduje no lleva la feature.

Recuento mío acumulado sobre la base:

| Rama | SHA | Ejecuciones mías | Fallos míos |
|---|---|---|---|
| `origin/main` vuelta 1 | `f84c926` | 12 | 0 |
| `origin/main` vuelta 2 | `f84c926` | 6 (paré al reproducir) | **1** |
| **`origin/main` total** | | **18** | **1** |
| HEAD vuelta 1 (`14996a7`) | | 9 | 1 |
| HEAD vuelta 2 (`e361b08`) | | 3 | 0 |

Con esto la pregunta de la vuelta 1 queda contestada: **el rojo existe en la
base**. Mis 12 corridas limpias no eran evidencia de ausencia — a la tasa
observada, no verlo en 12 tiradas es lo más probable. La corrección de la frase
del reporte es honesta: retira explícitamente el "reproducido a la primera" con
n=1, reconoce que no sostenía la conclusión, y la sustituye por una tasa con su
aritmética. La redacción nueva **sí** se sostiene.

### El diagnóstico, y por qué me lo creo

La cadena que propone: `add-pet-photo` es un `Button` de **heroui-native**, no un
`Pressable`; su `onPress` no se despacha síncronamente dentro del
`fireEvent.press`; bajo suite completa el despacho se sale del test; el
`waitFor` del preview agota su presupuesto (**síntoma 2**, `Received: null`) y el
handler corre después contra un mock ya reinicializado, devolviendo `undefined`
(**síntoma 1**, la `TypeError`).

Lo que verifiqué en el código, no en su palabra:

- `add-pet/index.tsx:247-253` — es un `Button` de heroui con `onPress`, **no** un
  `Pressable`. Confirmado.
- `handlePickPhoto` hace `await ImagePicker.launchImageLibraryAsync(...)` y lee
  `picked.canceled` en la línea siguiente. Un `jest.fn()` sin implementación
  devuelve `undefined`, y `await undefined` da `undefined`: la `TypeError`
  observada es exactamente lo que produce esa ruta. Coherente.
- Los dos síntomas son del **mismo** test y compatibles entre sí: si el press no
  despacha, el picker no se llama en el test (preview `null`) y la llamada
  aparece después. No son dos fallos distintos pegados con cinta.

Explica además por qué #53 no lo curó: #53 arregló la **higiene del mock** (el
`beforeEach` de fichero con `mockReset()` + `mockResolvedValue`), y la causa no
está en el mock sino en **cuándo se despacha el press**. Es una explicación que
predice el hecho incómodo, no una que lo esquive.

### Por qué #61 no lo introduce ni lo agrava — el argumento estructural

Este es el que más peso tiene, porque no depende de tasas:

- En todo `add-pet/index.test.tsx` hay **un solo** `fireEvent.press` sobre
  `add-pet-photo`: la línea 242, dentro de `describe('R7')`, y es de la base
  (el archivo suma `-0` líneas).
- El bloque que #61 añade, `describe('#61 R10')`, arranca en la **línea 280** —
  después de R7 (208) y del describe de higiene de #53 (270). Sus tests son
  `it.each` + `expect(...props.hitSlop)`: **cero** `fireEvent`, **cero**
  referencias al picker. Comprobado por grep sobre el bloque.
- Un test que corre **después** no puede hacer fallar a uno que corre antes.
- Y en fuentes, #61 solo añadió a ese archivo 4 `hitSlop` y un `className`.

La superficie causal del fallo está intacta en #61. Con la reproducción en base
**más** este argumento, el rojo pasa de "sin explicar" a **deuda conocida,
diagnosticada y con arreglo propuesto**. Mi regla era no aprobar con un rojo sin
explicar; ahora hay explicación, la he auditado, y aguanta.

**Deuda para #62** (no para #61): el arreglo es una línea en un `.test.tsx`
preexistente — un `await waitFor(() => expect(mockLaunchImageLibrary).toHaveBeenCalled())`
tras el press — y el invariante duro de #61 prohíbe tocar un test preexistente
sin requisito que lo pida. Que se arregle aquí habría sido *peor*.

## B2 — sigue abierto, y no es del implementer

Recomprobado hoy sobre `e361b08`: el único commit humano de la rama sigue siendo
`cdc8b82`, anterior a la reescritura de la spec. Detalle completo abajo, en la
sección de la vuelta 1. **No cuenta contra el implementer**: es una casilla y un
commit del humano.

## Suite e `init.sh`, ejecutados por mí en la vuelta 2

```
Test Suites: 54 passed, 54 total
Tests:       692 passed, 692 total
Snapshots:   1 passed, 1 total
```

Tres ejecuciones, tres verdes. Confirma los 692 (691 + el test de estructura de
R11). `./init.sh` termina en **exit code 0** con todo en verde (build, tests,
e2e, lint, typecheck). Los tres avisos de `.env` (`RESEND_*`, `RESET_LINK_HOST`)
vienen de #59 y son preexistentes; el de `STATUS.md desactualizado (56/60 vs
56/62)` es tarea de cierre del `leader`.

## Trazabilidad de la vuelta 2

`traceability.md` actualiza las filas de R11 (añade `292b20d`, "assert de
maqueta 2×2, verificado por mutación tras el rechazo del reviewer") y de R12
(revalidado, 54 suites / 692 tests). Sin filas "pendiente" salvo AC10.

---

# Vuelta 1 — evidencia base (sigue vigente)

Todo lo de esta sección se verificó sobre `14996a7` y **no se ha movido** en la
vuelta 2 (diff de producción vacío). Se conserva como registro.

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress`: `{'done': 56, 'pending': 5, 'in_progress': 1}`, y es #61
- [x] `progress/current.md` describe la sesión activa, declara el fallback al subagente `implementer` y el drift de rama ya resuelto
- [x] `progress/history.md` — sesión aún abierta, no procede entrada
- [x] Suite móvil estable — **cerrado en vuelta 2** (B3)
- [ ] `STATUS.md` desactualizado (`56/60` vs `56/62`). Tarea de cierre del `leader`

## Checklist C3 — Arquitectura

`docs/architecture.md` define domain / application / infrastructure para los
módulos de backend. Esta feature toca **0** archivos bajo `backend-pet-tracker/`
e `infra/`, así que la regla de dependencia no tiene superficie donde aplicarse.
Lo que sí aplica y se cumple:

- [x] Tokens **solo** en `src/theme/global.css` — cero hex fuera de `src/theme/`
- [x] `TOUCH_SLOP` en `src/theme/touch-target.ts`, no duplicado en 7 pantallas. Ubicación correcta: `expo:expo-design-system` manda que todo valor visual repetido sea token del tema, y `hitSlop` no es expresable en CSS. Precedente: `TAB_INDICATOR_SPRING`
- [x] Rutas finas + `src/screens/` respetado

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra (`describe('#61 R<n>: …')`)
- [x] Historial test-primero real: los 11 rojos preceden a su verde por SHA y por reloj
- [x] **R11 discrimina su cláusula principal** — cerrado en vuelta 2 (B1)

Hice checkout de **cada commit rojo** en un worktree aislado y ejecuté su(s)
archivo(s) filtrando por el R-id. Los once fallan sin su implementación:

| R | Rojo | Verde | En el commit rojo |
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
| R11 | `895ccb0` | `26fe409` + `292b20d` | 4 failed (`numberOfLines`); la maqueta 2×2 la cubre `292b20d` |

El rojo de R10 es por módulo inexistente, no por assert. Lo compensé con una
mutación sobre HEAD: borrados los 13 `hitSlop={TOUCH_SLOP}` de las fuentes
dejando el módulo en pie → `7 suites failed, 15 tests failed`. No es decorativo.

Los 33 commits de implementación son 11 rojos + 11 verdes + 11 de trazabilidad,
ninguno mezcla test con implementación. Esto es lo que #19 incumplió con Codex;
aquí está bien hecho.

## Checklist C5 — Trazabilidad

- [x] Sin filas "pendiente" salvo AC10, gate humano no automatizable
- [x] Commits en formato `feat(mobile-ui-legibility): <desc> (R…)` / `test(...)` / `docs(...)`
- [x] La fila de R11 ya refleja la cobertura real (vuelta 2)
- [ ] Cosmético: `traceability.md` sigue con `status: draft` en el frontmatter (media docena de specs del repo están igual)
- [ ] Cosmético: §"Criterios obsoletos" propone reescribir AC1 y AC10 "para que el humano lo pegue", pero `d8cee0b` **ya los pegó** en `feature_list.json`. Sección desfasada

## Checklist C6 — Spec aprobada

- [x] `requirements.md` tiene `status: approved` y la casilla marcada con fecha
- [ ] **B2 — requisitos modificados tras la aprobación sin volver a pasar por el gate**

Cronología en UTC, reconstruida por mí:

| Commit | UTC | Autor | Qué |
|---|---|---|---|
| `e51aead` | 18:02:56 | Claude | spec en draft (vía `--accent-contrast`) |
| `cdc8b82` | **19:42:10** | **AlexisSM377** | **firma humana**: `- [ ]` → `- [X] Aprobado por humano (fecha: 2026-09-03)` |
| `d341903` | 19:44:21 | Claude | revierte la decisión de contraste en `feature_list.json` |
| `d8cee0b` | 19:59:56 | Claude | **spec rehecha**: R2, R3 y R4 cambian de contenido |
| `29f94aa` | 20:01:20 | Claude | frontmatter `draft` → `approved` |

El texto que el humano firmó dice **lo contrario** del implementado. R2 en `cdc8b82`:

> SHALL exponer un token `--accent-contrast` con el valor **`#0B402A`** … y THE
> SYSTEM SHALL **conservar `--accent`** … con sus valores actuales exactos
> (**`#2AB87C`** y `#FFFFFF`)

R2 en HEAD:

> SHALL definir `--accent` y `--color-accent` con el valor **`#178255`** …

La casilla `[X]` viajó literal desde el documento anterior, y la §Aprobación pasó
de pedir la firma de **dos** puntos a la de **cuatro** — ninguno firmado sobre el
texto actual. `progress/current.md` §"Gate humano: cerrado" lo reconoce por
escrito. Doy crédito a que la reversión salió del humano (la cita textual y
`d341903` lo respaldan), pero **una decisión reportada por un agente no es la
firma**: C6 pide el gate, y el flujo del repo lo cierra el humano con su commit.

**Qué falta**: un commit del humano sobre el `requirements.md` actual. Es una
casilla.

## Checklist C7 — Sin código huérfano

- [x] `--accent-contrast`, el token de la vía descartada, no existe en `mobile-pet-tracker/src` ni en `docs/` — ni muerto ni comentado
- [x] Migración de tinta completa, no parcial: **0** `text-accent` sueltos, **0** `text-warning` como color de texto, **0** `useThemeColors(['accent'])`
- [x] Cero archivos borrados, y ninguno debía borrarse: la feature sustituye valores y clases, no componentes

## Checklist C8 — UI móvil conforme a la carta

Skills cargadas antes de juzgar: `expo:expo-overview` → `expo:expo-design-system`
→ `expo:expo-native-ui`. `docs/ui-guidelines.md` gana donde chocan (Tailwind +
tokens en `global.css`, no `Color.ios.*` ni `StyleSheet.create`), y el
implementer aplicó bien esa precedencia.

- [x] **Grep-clean** — conteos rehechos por mí (abajo)
- [x] **Dimensiones**: R7/R8 dejan las cuatro pantallas de auth con `padding: 24`, `gap: 16`, `paddingTop: insets.top + 12`, `paddingBottom: insets.bottom + 24` (96 en register), safe area arriba **y** abajo. Es literalmente lo que pide `expo:expo-native-ui` §Responsiveness: raíz en `ScrollView`, `contentInsetAdjustmentBehavior="automatic"`, padding en `contentContainerStyle` y no en el `ScrollView`
- [x] **Skeleton dimensionado**: 32 usos de `Skeleton`, **0** `ActivityIndicator` suelto
- [x] **Componentes compartidos**: sin forks locales; `TOUCH_SLOP` es constante compartida, no 13 literales repetidos
- [x] **Touch target ≥ 44 pt**: 13 `hitSlop={TOUCH_SLOP}` (health 1, meal-schedule 1, weight-log 1, profile 2, add-pet 4, add-reminder 3, docs 1), sin cambiar el tamaño visible
- [x] **Animaciones**: la feature no añade ninguna; `TAB_INDICATOR_SPRING` y `ReduceMotion.System` intactos; ningún token de color entra en estilo animado

### Conteos anti-slop, rehechos

Sobre `mobile-pet-tracker/src/**/*.{ts,tsx}`, excluyendo `__tests__/` y `*.test.*`:

| Comprobación | Implementer | **Yo** |
|---|---|---|
| hex fuera de `src/theme/` | 0 | **0** |
| clases arbitrarias `[...]` | 0 | **0** |
| `StyleSheet.create` | 0 | **0** |
| `shadow*` / `elevation:` legacy | 0 | **0** |
| `text-accent` suelto | 0 | **0** |
| `text-warning` como color de texto | 0 | **0** |
| `useThemeColors` pidiendo `'accent'` | 0 | **0** |

Siete a cero confirmados. Además `text-accent-strong` aparece **13** veces y
`useThemeColors(['accent-strong'])` en **6** sitios — los 13 + 6 que enumera R4.

## Contraste — recalculado por mí

Fórmula de luminancia relativa sRGB; los `*-soft` compuestos al 15 % de alfa
sobre su superficie según `heroui-native/src/styles/theme.css:83-97`, verificado
en disco. Ancla de control: `#FFFFFF` sobre `#2AB87C` = **2,547**, que reproduce
el valor que el humano verificó a mano.

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

Coinciden hasta el redondeo. Las diferencias de ±0,02 salen solo en los pares con
un `*-soft` o el `tab-pill`, y son la mezcla oklab de la spec frente a mi mezcla
sRGB: ninguna cruza el umbral. **Ningún par que la spec dice que pasa AA se queda
por debajo de 4,5:1.**

Tokens verificados en disco uno a uno: `--accent: #178255` en los dos variants ✔
· `--accent-foreground: #FFFFFF` intacto ✔ · `--accent-strong: #107148` light /
`#2AB87C` dark ✔ · `--warning-strong: #92610A` / `#FBBF24` ✔ · `--muted:
#667085` light con el `#9CA3AF` de dark intacto ✔ · `--focus` y `--tab-pill`
arrastrados ✔ · `--radius-card`, `--warning` y `--success` sin tocar ✔.

## Invariante de la feature — verificado, no aceptado

| Cláusula | Cómo lo comprobé | Resultado |
|---|---|---|
| Cero cambios de conducta / lógica / navegación / API | Filtrado del diff por `useState`, `useEffect`, `router.*`, `api/`, `fetch(`, `onPress`, `onChangeText` | Los únicos hits son las **9 líneas de `register.tsx` reindentadas** al promover los hijos fuera del `View` intermedio: handlers idénticos, movidos 2 espacios |
| Ningún `testID` renombrado ni eliminado | Conjuntos de `testID` de `origin/main` y de HEAD, comparados | **216 → 222**. Cero pérdidas, cero renombres. Los 6 nuevos son `screen-register`, `screen-login`, `screen-forgot` y `screen-reset-password` ×3, los que R7/R8 autorizan |
| Ningún texto visible cambia | Extracción de nodos de texto JSX del diff y comparación de multiconjuntos | **Cero** cadenas visibles alteradas |
| Solo tokens, `className`, props de estilo/render, argumento de `useThemeColors` y estructura de contenedores | Lectura del diff completo de fuentes | Se cumple sin excepción |
| Cero archivos bajo `backend-pet-tracker/` e `infra/` | `git diff --name-only` | **0** |

### La excepción E1, comprobada línea a línea

De los 14 archivos de test del diff, **13 son puramente aditivos** (`-0`,
confirmado con `--numstat`). El único con contenido previo modificado es
`src/theme/__tests__/global-css.test.ts`: **9 líneas** con **10 literales de
color**, exactamente las de `design.md` §6:

```
-      muted: '#6B7280',                        →  '#667085'
-      accent: '#2AB87C',                       →  '#178255'   (light)
-      focus: '#2AB87C',                        →  '#178255'   (light)
-    ['light', '#2AB87C', …, '#6B7280', …]      →  2 literales
-    ['dark',  '#2AB87C', …]                    →  '#178255'
-      accent: '#2AB87C',                       →  '#178255'   (dark)
-      focus: '#2AB87C',                        →  '#178255'   (dark)
-    ['light', …, 'rgba(42,184,124,0.14)']      →  rgba(23,130,85,0.14)
-    ['dark',  …, 'rgba(42,184,124,0.22)']      →  rgba(23,130,85,0.22)
```

Las nueve son **sustituciones de valor**, no supresiones: ningún `expect`
desaparece, ningún caso de `it.each` se pierde, ninguna clave de `toMatchObject`
se cae, ningún test se marca `skip`. Son asserts de valor de token de #46 R1/R2 —
la paleta del Figma que esta feature contradice a propósito y por escrito.
**Ningún assert de conducta se relajó ni se borró en ningún sitio**, y como los
otros 13 archivos suman `-0`, ahí no cabía relajar nada.

## R-ids

| R | Implementación | Test nombra el R-id | Rojo verificado | ¿Falla al revertir? | Estado |
|---|---|---|---|---|---|
| R1 | ✔ `text-danger-foreground` en `reminders-delete-confirm` | ✔ | ✔ | ✔ | **OK** |
| R2 | ✔ `--accent`/`--color-accent`/`--focus`/`--tab-pill` a `#178255`; `--accent-foreground` intacto | ✔ | ✔ | ✔ | **OK** |
| R3 | ✔ las 4 `opacity-*` fuera | ✔ | ✔ | ✔ | **OK** |
| R4 | ✔ token + 13 `className` + 6 imperativos; cero `'accent'` restantes | ✔ (2 archivos) | ✔ | ✔ | **OK** |
| R5 | ✔ `--warning-strong` + 3 sitios; ámbar puro conservado | ✔ (2 archivos) | ✔ | ✔ | **OK** |
| R6 | ✔ `--muted` light `#667085`, dark intacto | ✔ | ✔ | ✔ | **OK** |
| R7 | ✔ `contentContainerStyle` + insets + `testID`; `View` intermedio eliminado | ✔ | ✔ | ✔ | **OK** |
| R8 | ✔ 3 pantallas, 3 ramas de reset, `alignItems` solo donde había `items-center` | ✔ (3 archivos) | ✔ | ✔ | **OK** |
| R9 | ✔ label de `pet-info-card` vuelve a #46 R10 | ✔ | ✔ | ✔ | **OK** |
| R10 | ✔ los 13 controles | ✔ (7 archivos) | ✔ (módulo ausente) | ✔ (mutación: 15 tests caen) | **OK** |
| R11 | ✔ el 2×2 y los 4 `numberOfLines` | ✔ | ✔ | ✔ (mutación, vuelta 2) | **OK** |
| R12 | gate mecánico | n/a | n/a | n/a | **OK** — diff conforme, suite 692 verdes, flaky atribuido a la base |

## Los diez criterios de aceptación de #61

| AC | Cubierto por | Estado |
|---|---|---|
| AC1 — acento a `#178255`, etiqueta blanca, tinta a `--accent-strong`, desviación escrita en la carta | R2 + R3 | ✔ Incluye el punto 11 nuevo de `docs/ui-guidelines.md` §Decisiones fijas |
| AC2 — `text-accent` pasa AA como enlace y `text-warning` deja de ser color de texto | R4 + R5 | ✔ Ratios recalculados; 0 sueltos de cada uno |
| AC3 — `text-muted` sobre `bg-default` pasa AA en claro sin tocar oscuro | R6 | ✔ 4,471 → **4,601**; dark en 6,148 |
| AC4 — Register uniforme y Login/Forgot/Reset con scroll | R7 + R8 | ✔ |
| AC5 — label de `pet-info-card` vuelve a #46 R10 | R9 | ✔ |
| AC6 — 44 pt sin cambiar tamaño visible ni `testID` | R10 | ✔ 13 `hitSlop`, 0 `testID` tocados |
| AC7 — el overlay de stats deja de envolver texto | R11 | ✔ **Cerrado en vuelta 2**: el código lo hace y ahora el test lo defiende |
| AC8 — botón destructivo con el token de danger | R1 | ✔ |
| AC9 — suite verde sin reescribir asserts de conducta; diff sin backend ni `.test.tsx` de más | R12 | ✔ 54 suites / 692 tests; el flaky es de la base, reproducido por mí en `f84c926` |
| AC10 — **gate humano**: smoke en dev build de Android, lado a lado con el Figma, en claro **y** oscuro | — | **Pendiente por definición** |

## El icono `Lock` de `forgot.tsx` — fuera de alcance, y correctamente

`forgot.tsx:15` resuelve el color con `useThemeColor(['accent'])` de
**heroui-native**, no con el `useThemeColors` del repo. Es el **único** sitio del
proyecto que usa ese hook.

**No es una laguna de R4.** R4 enumera conjuntos **cerrados** — "las 13
ocurrencias de `className` y las 6 imperativas enumeradas en `design.md` §4 R4" —
y su cláusula de barrido dice literalmente "cero llamadas a **`useThemeColors`**",
que es el hook del repo. El icono no cae en ninguna de las tres. Tocarlo habría
sido alcance inventado sobre una spec aprobada, que es peor defecto que dejarlo.

Y no queda fallando: es un icono, componente **no textual**, umbral 3,0:1 de WCAG
1.4.11. Recalculado por mí sobre `bg-accent-soft`: **2,222 → 3,947** en claro y
**3,437** en oscuro. Antes incumplía 1.4.11, ahora lo cumple en los dos temas. La
feature lo mejora de rebote.

La salvedad, anotada: ese sitio es ahora el **único** que contradice la regla
mecánica que esta feature acaba de escribir en la carta ("fondo ⇒ `--accent`;
encima de otra cosa ⇒ `--accent-strong`"). Como tinta le tocaría
`--accent-strong` (4,950 claro / 6,498 oscuro). **Candidato limpio para #62**,
junto con el barrido del `useThemeColor` de heroui. No bloquea.

---

## Pendientes — todos del humano, ninguno del implementer

1. **B2 — la firma de la spec.** Un commit suyo sobre el `requirements.md`
   vigente: re-marcar la casilla de §Aprobación sobre el texto actual y los
   **cuatro** puntos que hoy pide (el hex `#178255`, la tinta partida por tema,
   la convivencia con `--success`, y la excepción E1 de 10 literales en 9
   líneas). Hasta entonces C6 queda formalmente abierto y la feature no debería
   marcarse `done`.
2. **AC10 — el smoke** en **dev build de Android** (no Expo Go), lado a lado con
   el Figma, en tema **claro Y oscuro**. Guion de 9 puntos en `tasks.md` §Cierre.
   Los dos puntos que más ojo piden:
   - el acento **se ve distinto** al Figma Make a propósito (ΔE00 = 17,44); si en
     el smoke se lee como defecto, lo que hay que revisar es la decisión
     `design.md` §D1, no la implementación;
   - la **tinta en dark no cambió ni un píxel** (`--accent-strong` dark vale
     exactamente el `#2AB87C` de hoy). Si algo se ve distinto en oscuro que no
     sea un **relleno**, es un bug.

## Deuda anotada para #62

- **El flaky de `add-pet`** (B3): preexistente, reproducido por mí en
  `origin/main` `f84c926`, con causa diagnosticada (el despacho del `onPress` del
  `Button` de heroui se sale del test) y arreglo propuesto de una línea. No se
  arregla en #61 porque el invariante prohíbe tocar un `.test.tsx` preexistente
  sin requisito que lo pida.
- **El icono `Lock` de `forgot.tsx`** y el barrido del `useThemeColor` de heroui.
- Los dos cosméticos de C5: el `status: draft` del frontmatter de
  `traceability.md` y la §"Criterios obsoletos", desfasada porque `d8cee0b` ya
  pegó las redacciones en `feature_list.json`.
- `STATUS.md` desactualizado (`56/60` vs `56/62`), que avisa `init.sh`.
