---
feature: "mobile-ui-legibility-polish"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-ui-legibility-polish]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI, gana sobre
> `appllama-app-design-skill`) y [[../../docs/conventions|conventions]]
> §Convenciones de la app móvil / §Dimensiones de pantalla uniformes.
>
> Este documento es la fuente autosuficiente para Codex CLI: rutas exactas,
> nombres de símbolos exactos, valores hex exactos y clases exactas. **No hay
> ninguna decisión abierta.** Todo número de contraste está calculado, no
> estimado; el método está abajo y es reproducible.

Skills cargadas antes de escribir (obligatorias por la carta):
`appllama-app-design-skill`, `expo:expo-overview` → `expo:expo-native-ui` y
`expo:expo-design-system`. De appllama se toma el **patrón** (ley de fidelidad
nativa "contraste pasa en ambos temas", "todo tap target ≥ 44 pt", "wrap root
in a ScrollView", disciplina anti-slop mecánica). Su **sistema de estilos**
(`Color.ios.*`, `StyleSheet.create`, tokens en TS, `theme/colors.ts`) se
descarta por la carta §Decisiones fijas 1-3: aquí los tokens viven **solo** en
`mobile-pet-tracker/src/theme/global.css` y se consumen como `className`.

---

## 1. Método de cálculo del contraste (reproducible)

Fórmula WCAG 2.1, luminancia relativa sRGB:

```
c' = c/255
c_lin = c'/12.92                     si c' <= 0,04045
c_lin = ((c' + 0,055)/1,055)^2,4     en otro caso
L = 0,2126·R_lin + 0,7152·G_lin + 0,0722·B_lin
ratio = (L_claro + 0,05) / (L_oscuro + 0,05)
```

Los tokens `*-soft` de heroui son `color-mix(in oklab, var(--X) 15%,
transparent)` (`node_modules/heroui-native/src/styles/theme.css:83-97`), es
decir el color al 15 % de alfa; se componen sobre la superficie que tienen
detrás antes de medir:

| soft | composición | resultado |
|---|---|---|
| `accent-soft` light | `#2AB87C` @15 % sobre `#FFFFFF` | `#DFF4EB` |
| `accent-soft` dark | `#2AB87C` @15 % sobre `#0D1117` | `#112A26` |
| `warning-soft` light | `#F59E0B` @15 % sobre `#FFFFFF` | `#FEF0DA` |
| `warning-soft` dark | `#FBBF24` @15 % sobre `#161B22` | `#383422` |

**Verificación del ancla**: blanco `#FFFFFF` sobre `#2AB87C` da **2,547:1** con
esta fórmula, que reproduce el 2,546:1 verificado dos veces por el humano. El
método es el correcto.

Umbral aplicado: **4,5:1** (AA, texto normal). El corte de "texto grande"
(18,66 px bold / 24 px regular, umbral 3,0:1) **no** se usa en ningún requisito:
el `Button.Label` de heroui es 16 px bold y queda por debajo del corte, y
aplicar dos umbrales distintos según el nodo haría la spec no verificable.

### Estado ANTES (lo que esta feature arregla)

| Par | ratio hoy | Hallazgo |
|---|---|---|
| `#FFFFFF` sobre `bg-accent` | **2,547** | 1 |
| `text-accent` sobre `bg-surface` | **2,547** | 3 |
| `text-accent` sobre `bg-default` | **2,355** | 3 |
| `text-accent` sobre `bg-accent-soft` | **2,217** | 3 |
| `text-warning` sobre `bg-surface` | **2,148** | 2 |
| `text-warning` sobre `bg-warning-soft` | **1,911** | 2 |
| `text-warning` sobre `bg-default` | **1,986** | 2 (ocurrencia añadida, §7) |
| `text-muted` sobre `bg-default` | **4,471** | 19 |
| `text-muted` sobre `bg-surface-secondary` | **4,566** | 19 |

Todos los fallos son del tema **claro**, salvo el primero: `--accent` vale
`#2AB87C` en los dos temas, así que la etiqueta blanca sobre el relleno de
acento falla también en dark. Es la razón por la que `--accent-contrast` es
**invariante de tema** (§3).

---

## 2. Decisiones técnicas

### D1 — Contraste: dos tokens de texto, no uno (y por qué no puede ser uno)

Decisión humana cerrada el 2026-09-03: `--accent` conserva `#2AB87C` exacto y
se añade un token de texto más oscuro. Esta spec lo cumple y **no lo
re-litiga**. Lo que sí resuelve, porque el humano no lo cerró y la aritmética
lo obliga, es que **los dos roles de "texto de acento" no caben en un solo
token**:

- **Rol A — texto SOBRE el relleno de acento** (hallazgo 1). El fondo es
  `#2AB87C` en light **y** en dark. Para 4,5:1 el texto necesita luminancia
  relativa `L ≤ 0,041619`. Es un valor **invariante de tema**: debe ser el
  mismo verde muy oscuro en los dos temas.
- **Rol B — texto de acento SOBRE superficies neutras** (hallazgo 3, links y
  valores). En **light** el fondo es claro (`#FFFFFF`, `#F5F6F8`, `#F0FBF6`,
  `#DFF4EB`) y el texto necesita `L ≤ 0,165781`. En **dark** el fondo es
  oscuro (`#161B22`, `#1F242B`) y `#2AB87C` **ya pasa** (6,79:1 / 6,13:1):
  oscurecerlo ahí lo **rompería**.

Prueba de que un token único es imposible: en dark, el rol A exige
`L ≤ 0,041619` y el rol B exige, sobre `bg-surface` `#161B22`,
`L ≥ 0,2277`. Son incompatibles. Por tanto:

| Token | light | dark | Rol |
|---|---|---|---|
| `--accent-contrast` | `#0B402A` | `#0B402A` | Texto **sobre** `bg-accent` |
| `--accent-strong` | `#167A50` | `#2AB87C` | Texto/enlace de acento **sobre** neutro |

`--accent-strong` en dark vale exactamente `#2AB87C`: **el tema oscuro no
cambia ni un píxel** en el rol B, que es lo que exige el invariante.

**Nomenclatura**: `-strong` = "la variante AA del mismo hue, solo para texto
sobre superficies neutras" — es la convención que el propio audit propuso para
`--warning-strong` (hallazgo 2), así que `--accent-strong` y `--warning-strong`
comparten regla. `-contrast` = "el color que contrasta contra ese relleno";
no se llama `--accent-foreground-*` porque `--accent-foreground` ya existe,
vale `#FFFFFF`, está aserido por #46 R1/R2 en `global-css.test.ts:79` y `:126`,
y **no se toca** (por eso el hallazgo 21 no explota; ver D2).

#### Elección del hex de `--accent-contrast`: `#0B402A`

Presupuesto: `L(#2AB87C) = 0,362285` ⇒ el texto necesita
`L ≤ (0,362285 + 0,05)/4,5 − 0,05 = 0,041619`.

`#0B402A` se derivó del **mismo hue del acento** (HSL H = 154,6°, el de
`#2AB87C`) bajado a L = 14,8 % y S = 70 %, para que la etiqueta se lea como
"acento muy oscuro" y no como negro, y que la marca no cambie de familia.

```
#0B402A -> R=11  G=64  B=42
R' = 11/255  = 0,043137 -> ((0,043137+0,055)/1,055)^2,4 = 0,003347
G' = 64/255  = 0,250980 -> ((0,250980+0,055)/1,055)^2,4 = 0,051269
B' = 42/255  = 0,164706 -> ((0,164706+0,055)/1,055)^2,4 = 0,023161
L  = 0,2126·0,003347 + 0,7152·0,051269 + 0,0722·0,023161 = 0,039051
ratio = (0,362285 + 0,05) / (0,039051 + 0,05) = 0,412285 / 0,089051 = 4,630
```

**4,630:1 ≥ 4,5:1** ✔ (margen 0,13). `L = 0,039051 ≤ 0,041619` ✔. Como bonus,
sobre blanco da 11,79:1, así que nunca es el eslabón débil en ninguna otra
superficie.

Candidatos descartados: `#15804F` (4,96:1 sobre blanco pero **1,95:1** sobre
`bg-accent`: sirve para el rol B, no para el A) y `#0F5132` / `#14532D`
(3,68 y 3,58:1 sobre `bg-accent`: no llegan).

#### La opacidad tenía que caer

4 de los 17 nodos del rol A llevan `opacity-70` u `opacity-80`. La opacidad
compone el texto contra el relleno y **destruye el contraste ganado**:

```
#0B402A al 70 % sobre #2AB87C -> #146443 -> 2,811:1   FALLA
#0B402A al 80 % sobre #2AB87C -> #11583A -> 3,324:1   FALLA
```

No hay ningún verde que pase 4,5:1 tras un `opacity-70` sobre `#2AB87C` sin ser
literalmente negro puro. Por eso R3 **elimina** `opacity-70` y `opacity-80` de
esos 4 nodos. La jerarquía dentro de las cards de acento la siguen llevando el
tamaño y el peso (`text-xs` vs `text-3xl font-black`), que es como la lleva el
resto de la app. Es un cambio de `className` puro: no toca texto ni `testID`.
(Referencia: hoy el blanco con `opacity-70` da **1,937:1** — lo que hay ahora
es peor que lo que se propone en cualquier lectura.)

#### `--warning-strong: #92610A` (light)

Presupuesto: el fondo más exigente es `warning-soft` compuesto, `#FEF0DA`
(`L = 0,890...`) ⇒ `L_texto ≤ 0,157673`.

```
#92610A -> L = 0,110...  ->  sobre #FFFFFF  5,335:1  ✔
                             sobre #FEF0DA  4,748:1  ✔
```

Descartados: `text-warning-soft-foreground`, que heroui ya deriva
(`color-mix(in oklab, var(--warning) 65%, var(--foreground) 35%)` ≈ `#A46D0F`)
— da **3,92:1** sobre `warning-soft`, no llega a AA, y además su valor exacto
no es aserible desde `global.css` porque lo calcula heroui. Y `#B45309`, el
valor que propuso el audit: **4,469:1** sobre `warning-soft`, falla por 0,03 —
exactamente el mismo error de 0,03 que esta feature está arreglando en
`--muted`. En dark `--warning-strong` vale `#FBBF24`, idéntico a `--warning`:
el tema oscuro no cambia.

#### `--muted: #667085` (light)

Es el valor que propuso el audit y se ha recalculado aquí: **4,601:1** sobre
`bg-default` (hoy 4,471), 4,975:1 sobre `bg-surface`, 4,699:1 sobre
`bg-surface-secondary`. Es un ajuste de ~3 % de luminancia, imperceptible como
cambio de diseño, y arregla las once ocurrencias del hallazgo 19 con **un solo
cambio de token** en lugar de once `className`. Dark (`#9CA3AF`) no se toca.

Efecto colateral aceptado: los iconos que resuelven su color con
`useThemeColors(['muted'])` (chevrons de fila) pasan de `#6B7280` a `#667085`.
Los iconos no están sujetos al umbral de 4,5:1 y el delta es invisible.

### D2 — Hallazgo 21 va primero, por dependencia declarada

`reminders/index.tsx:341` pinta la etiqueta del botón destructivo con
`text-accent-foreground` sobre `bg-danger`. Hoy no se nota porque
`--accent-foreground` y `--danger-foreground` valen ambos blanco
(`--danger-foreground` cae al `--snow` de heroui,
`node_modules/heroui-native/src/styles/variables.css:5,67`, ≈ `#FCFCFC`).

Esta spec **añade** `--accent-contrast` en vez de **cambiar**
`--accent-foreground`, así que el botón destructivo no se volvería verde por sí
solo. Aun así R1 va primero y se implementa antes que R2/R3, por dos razones:
(a) es la instrucción explícita del humano ("en el mismo requisito o antes que
el cambio de token"); (b) deja el árbol en un estado donde ningún token del
acento se usa fuera de una superficie de acento, que es la invariante semántica
que hace segura toda la fase siguiente. **Cero cambio visual hoy.**

### D3 — Hallazgo 4 (overlay del mapa): dos filas de dos, no `flex-wrap`

Restricción: no se puede quitar un tile (sería conducta) ni cambiar texto
visible. Se evaluaron las tres vías:

| Vía | Veredicto |
|---|---|
| `flex-wrap` + `w-[48%]` o `basis-[calc(50%-4px)]` | **Descartada.** Clase arbitraria: la rompe `src/__tests__/design-drift.test.ts` C8 (`/[A-Za-z0-9_-]+-\[[^\]]+\]/` ⇒ `[]`). Y con `basis-1/2` + `gap-2` la suma 50 % + 50 % + 8 pt > 100 % hace que cada tile caiga a su propia fila. |
| `text-sm` + `numberOfLines` + `adjustsFontSizeToFit` | **Descartada.** El ancho útil sigue siendo 53,5 pt y "12.5 km/h" mide ~72 pt a 14 px: `adjustsFontSizeToFit` lo *encoge*, así que los cuatro tiles acaban con tamaños de fuente distintos. Cambia la tipografía del diseño para tapar un problema de ancho. |
| **Dos filas de dos** | **Elegida.** |

Aritmética (teléfono de referencia 390 dp, el mismo que usa el audit):

```
ancho del overlay      = 390 − 16 (left) − 16 (right)          = 358
dentro de la Card p-3  = 358 − 12 − 12                         = 334
HOY  4 tiles: (334 − 3 gaps × 8) / 4 = 77,5 ; − p-3 del tile   =  53,5 pt
NUEVO 2 tiles/fila: (334 − 1 gap × 8) / 2 = 163 ; − p-3        = 139,0 pt
```

Cadena más larga que la pantalla renderiza hoy: `"12.5 km/h"` ≈ **82 pt** a
16 px Inter-Black (medida del audit). 139 > 82 con 57 pt de margen; incluso
`"999.9 km/h"` (~95 pt) cabe. El ancho deja de ser el binding constraint, así
que **no hace falta encoger la fuente**: los valores conservan
`text-base font-black`, que es la fidelidad al Make (`App.tsx:502`).
`numberOfLines={1}` se añade como garantía dura y, sobre todo, porque es lo
único de este requisito que un test de jest puede afirmar (jest-expo no tiene
motor de layout).

Agrupación: `stat-speed` + `stat-distance` arriba (los dos valores de acento),
`stat-updated` + `stat-gps` abajo (los dos valores `muted`). Agrupa por rol y
color, y conserva el orden de lectura actual.

Coste aceptado: el overlay crece ~60 pt de alto. Está anclado con
`bottom: insets.bottom + 96` y crece hacia arriba sobre el mapa, que es una
vista nativa detrás; no colisiona con nada. El `style` absoluto del `View`
`map-stats` **no cambia** (lo asevera `map.test.tsx:558`).

Se descartó explícitamente `adjustsFontSizeToFit`: con 57 pt de margen no
aporta nada y añade una prop de render que nadie más en el repo usa.

### D4 — Hallazgo 13 (44 pt): `hitSlop`, no padding

El criterio de aceptación 6 de `feature_list.json` dice, literalmente, "sin
cambiar el tamaño visible del control". Eso **elimina el padding**:

- **Padding** (`py-2` → `py-3`, la propuesta del audit): las tres recetas
  tienen fondo propio (`bg-default` en las filas, `bg-default`/`bg-accent-soft`
  en los chips, `bg-default` en los botones de volver), así que subir el
  padding **agranda la superficie coloreada**: el control se ve 8 pt más alto.
  Es exactamente lo que el criterio prohíbe. Además `size-10` → `size-11` en
  los botones de volver cambia el diámetro del círculo a la vista.
- **`hitSlop`**: extiende el rectángulo táctil sin tocar el layout ni un solo
  píxel pintado. Es la única vía compatible con la restricción.

Valor único para las tres recetas: `{ top: 6, bottom: 6, left: 6, right: 6 }`,
exportado como `TOUCH_SLOP` desde
`mobile-pet-tracker/src/theme/touch-target.ts`. Un solo valor para no repartir
tres constantes por el árbol (carta §Decisiones fijas 2: valor visual repetido
⇒ token; `hitSlop` no es expresable en CSS, así que su sitio es una constante
TS, como `TAB_INDICATOR_SPRING` en `floating-tab-bar.tsx`).

Por qué 6 y no 4: la caja de cada receta no se puede medir en jest, así que hay
que acotarla por abajo y elegir un slop que funcione en todo el rango:

| Receta | Caja mínima | + 12 pt | ≥ 44 |
|---|---|---|---|
| Fila de enlace `px-3 py-2` (texto 14 px, line box ≈ 17) | 8+8+17 = **33** | 45 | ✔ |
| Chip `px-3 py-2` con `text-sm` | 8+8+17 = **33** | 45 | ✔ |
| Chip `px-4 py-2` con texto 16 px (species) | 8+8+19 = **35** | 47 | ✔ |
| Botón de volver `size-10` | **40** | 52 | ✔ |
| Botón de volver `rounded-full p-2` con icono 20 | 8+8+20 = **36** | 48 | ✔ |

Con slop 4 la primera fila daría 41 pt y **fallaría**; con 6 pasa todo el rango.

Solape aceptado y declarado: los chips viven en contenedores `flex-row
flex-wrap gap-2` y `flex-row gap-2` (8 pt de hueco). Con 6 pt por lado, dos
chips vecinos solapan 4 pt de banda táctil; en esa banda gana el hermano que
aparece antes en el árbol. Es un 9 % de un objetivo de 44 pt, entre dos chips
del mismo grupo, y el error es reversible con un toque. Las filas de enlace
(separadas por `gap: 16` del `contentContainerStyle`) y los botones de volver
(`flex-row gap-3`, sin pressable vecino) no solapan.

Nota de plataforma: en Android `hitSlop` solo entrega toques dentro de los
límites del padre. Los 13 controles están holgadamente dentro de contenedores
mayores (el `contentContainerStyle` de la pantalla, o un `flex-row` de
cabecera), así que los 6 pt caen siempre dentro del padre.

**`pet-switcher.tsx:32-33` queda fuera.** El audit lo lista como "`p-1` sobre
un `Avatar size="sm"` ≈ 36 pt", pero heroui define `sm` como
`calc(var(--spacing) * 10)` = **40 pt**
(`node_modules/heroui-native/src/styles/components/avatar.css:16-19`). Con
`p-1` (4 pt × 2) y `border-2` (2 pt × 2, box-sizing interior en RN) el chip
mide **52 pt**. Ya cumple; añadirle slop solaparía con sus vecinos sin ganar
nada. La evidencia del audit es incorrecta en ese punto y esta spec lo corrige.

### D5 — Hallazgo 6: qué tests se anclan al árbol de login / forgot / reset

Se comprobó **archivo por archivo**, no por muestreo. Resultado:

```
grep -rn "UNSAFE_|toJSON()|toMatchSnapshot|screen.root|getByType|ScrollView|parent" \
  src/app/(auth)/__tests__/ src/screens/reset-password/index.test.tsx
→ 0 coincidencias
```

- `src/app/(auth)/__tests__/login.test.tsx`: consulta solo por `testID`
  (`login-email`, `login-password`, `login-submit`, `login-error`,
  `link-register`, `link-forgot`) y por texto. **No se rompe.**
- `src/app/(auth)/__tests__/forgot.test.tsx`: `getByText`, `getByTestId`,
  `toHaveProp('editable')`, `toBeDisabled()`. **No se rompe.**
- `src/screens/reset-password/index.test.tsx`: `testID` y texto. **No se
  rompe.**
- `src/app/(auth)/__tests__/layout.test.tsx`: prueba el `Redirect` del layout,
  no el árbol de las pantallas. **No se rompe.**

Conclusión: **envolver las tres pantallas en un `ScrollView` no rompe ningún
test existente**, y por tanto R8 **no** introduce ninguna excepción al
invariante. Los `testID` `screen-login` / `screen-forgot` /
`screen-reset-password` son **añadidos** (nunca renombrados) y siguen la
convención `screen-<nombre>` que ya usan las once pantallas con scroll.

Métricas: `padding: 24` (= el `p-6` de hoy) y `gap: 16` (= el `gap-4` de hoy),
así que el interior no se mueve. `flexGrow: 1` + `justifyContent: 'center'`
conserva el centrado vertical exacto.

**Desviación declarada de `conventions.md` §Dimensiones**: las tres pantallas
usan `paddingBottom: insets.bottom + 24`, no `+ 96`. El `+96` existe para
despejar `floating-tab-bar.tsx`, que solo se monta bajo `(tabs)`; el grupo
`(auth)` no tiene barra flotante, y en un layout centrado con `flexGrow: 1` un
`+96` sin contrapartida arriba desplazaría el bloque visiblemente hacia arriba
— un cambio visual que esta feature no quiere. `register.tsx` (R7) **sí** usa
`+96`, porque el criterio de aceptación 4 pide explícitamente que se alinee
"como las otras once pantallas con scroll" y, al ser un formulario largo que
scrollea desde arriba, el padding extra es solo holgura de scroll.

### D6 — Dónde vive cada test

| Tipo de requisito | Archivo | Patrón preexistente |
|---|---|---|
| Valor de token + ratio (R2, R4-token, R5-token, R6) | `src/theme/__tests__/global-css.test.ts` | #46 R1/R2 y #72 R1: leer `global.css`, extraer `@theme` / `@variant`, parsear variables |
| Uso del token en `className` (R1, R3, R4-uso, R5-uso) | `src/__tests__/legibility-classnames.test.ts` (**nuevo**) | #72: `src/__tests__/design-drift.test.ts`, que ya escanea las fuentes `.tsx` |
| Árbol renderizado (R7, R8, R10, R11) | Los test files de pantalla ya existentes | `@testing-library/react-native`, mock `useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 })` como `home.test.tsx:45-48` |
| R12 | Sin test de jest | Gate mecánico del `reviewer`: `bun test` + `git diff --stat` |

Los `describe` nuevos se nombran **`#61 R<n>: …`**. Es una decisión de esta
spec y hay que respetarla: los R-ids del repo son por feature y ya colisionan
(`global-css.test.ts` tiene `describe('R1: …')` de #46 y `profile/index.test.tsx`
tiene `describe('R1: …')` de #33). Sin el prefijo la trazabilidad sería
ambigua.

Con el mock de insets estándar (top 40, bottom 24) los valores esperados son:
`paddingTop: 52`; `paddingBottom: 120` para R7 (`24 + 96`) y `48` para R8
(`24 + 24`).

---

## 3. Cambios exactos en `mobile-pet-tracker/src/theme/global.css`

### 3.1 Registro de las utilidades

Las utilidades `text-*` de Tailwind v4 se generan desde claves `--color-*`
declaradas en un bloque `@theme`. heroui lo hace en
`node_modules/heroui-native/src/styles/theme.css:1` con
`@theme inline static { --color-accent: var(--accent); … }`, y por eso
`text-accent` funciona aunque `--accent` se defina en el `@variant` de
`global.css`. Los tokens nuevos no están en ese bloque, así que hay que
registrarlos. Añadir **después** del bloque `@theme { … }` que ya existe:

```css
@theme inline {
  --color-accent-contrast: var(--accent-contrast);
  --color-accent-strong: var(--accent-strong);
  --color-warning-strong: var(--warning-strong);
}
```

El bloque `@theme { --font-*; --radius-card; --text-2xs }` existente **no se
toca** (`--radius-card: 20px` sigue igual: hallazgo 18 cerrado).

### 3.2 Variables por variant

En `@variant light`, junto al resto de tokens de color:

```css
--accent-contrast: #0B402A;
--accent-strong: #167A50;
--warning-strong: #92610A;
```

y cambiar las dos líneas de muted que ya están ahí:

```css
--muted: #667085;         /* antes #6B7280 */
--color-muted: #667085;   /* antes #6B7280 */
```

En `@variant dark`, junto al resto de tokens de color:

```css
--accent-contrast: #0B402A;
--accent-strong: #2AB87C;
--warning-strong: #FBBF24;
```

Nada más cambia en `dark`: `--muted: #9CA3AF` se queda como está.

**No** se añaden espejos `--color-accent-contrast` / `--color-accent-strong` /
`--color-warning-strong` dentro de los `@variant`. Los espejos `--color-*` que
hay en `global.css` existen para el resolver JS `useThemeColors`
(`src/theme/use-theme-colors.ts`), y ninguno de los tres tokens nuevos se
consume de forma imperativa: los tres son exclusivamente color de texto vía
`className`. Si en el futuro alguno se necesita en un icono, se añade su espejo
entonces.

### 3.3 Tabla de verificación (los números que los tests deben afirmar)

| Token | Tema | Valor | Superficie | Ratio | AA |
|---|---|---|---|---|---|
| `--accent-contrast` | light | `#0B402A` | `bg-accent` `#2AB87C` | **4,630** | ✔ |
| `--accent-contrast` | dark | `#0B402A` | `bg-accent` `#2AB87C` | **4,630** | ✔ |
| `--accent-strong` | light | `#167A50` | `bg-surface` `#FFFFFF` | 5,338 | ✔ |
| `--accent-strong` | light | `#167A50` | `bg-default` `#F5F6F8` | **4,937** | ✔ |
| `--accent-strong` | light | `#167A50` | `bg-surface-secondary` `#F0FBF6` | 5,042 | ✔ |
| `--accent-strong` | light | `#167A50` | `bg-accent-soft` `#DFF4EB` | **4,646** | ✔ |
| `--accent-strong` | dark | `#2AB87C` | `bg-surface` `#161B22` | 6,792 | ✔ |
| `--accent-strong` | dark | `#2AB87C` | `bg-default` `#1F242B` | 6,128 | ✔ |
| `--accent-strong` | dark | `#2AB87C` | `bg-accent-soft` `#112A26` | 5,962 | ✔ |
| `--warning-strong` | light | `#92610A` | `bg-surface` `#FFFFFF` | 5,335 | ✔ |
| `--warning-strong` | light | `#92610A` | `bg-warning-soft` `#FEF0DA` | **4,748** | ✔ |
| `--warning-strong` | dark | `#FBBF24` | `bg-surface` `#161B22` | 10,362 | ✔ |
| `--warning-strong` | dark | `#FBBF24` | `bg-warning-soft` `#383422` | 7,477 | ✔ |
| `--muted` | light | `#667085` | `bg-default` `#F5F6F8` | **4,601** | ✔ |
| `--muted` | light | `#667085` | `bg-surface` `#FFFFFF` | 4,975 | ✔ |
| `--muted` | light | `#667085` | `bg-surface-secondary` `#F0FBF6` | 4,699 | ✔ |
| `--muted` | dark | `#9CA3AF` (sin cambio) | `bg-default` `#1F242B` | 6,148 | ✔ |

---

## 4. Sitios exactos por requisito

Números de línea sobre `origin/main` a fecha 2026-09-03. Si Codex encuentra el
símbolo en otra línea, manda el **símbolo**, no el número.

### Sitios R1 — `text-accent-foreground` → `text-danger-foreground` (1)

| Archivo | Línea | JSX |
|---|---|---|
| `src/screens/reminders/index.tsx` | 341 | `<Button.Label className="font-bold text-accent-foreground">` dentro del `Button` `testID="reminders-delete-confirm"` |

`className` resultante: `"font-bold text-danger-foreground"`.

### Sitios R3 — `text-accent-foreground` → `text-accent-contrast` (17)

Etiquetas de `Button` con `className` que contiene `bg-accent`:

| Archivo | Línea | `testID` del `Button` |
|---|---|---|
| `src/app/(auth)/login.tsx` | 91 | `login-submit` |
| `src/app/(auth)/forgot.tsx` | 44 | `forgot-submit` |
| `src/app/(auth)/register.tsx` | 266 | `register-submit` |
| `src/app/(tabs)/weight-log.tsx` | 195 | (botón de guardar peso) |
| `src/app/(tabs)/meal-schedule.tsx` | 243 | (botón de acción) |
| `src/screens/add-pet/index.tsx` | 421 | (botón de guardar) |
| `src/screens/profile/index.tsx` | 196 | (botón principal) |
| `src/screens/add-reminder/index.tsx` | 279 | (botón de guardar) |
| `src/screens/reset-password/index.tsx` | 153 | `reset-submit` |
| `src/screens/reminders/index.tsx` | 138 | (botón principal, `bg-accent` en `:135`) |

Texto dentro de `Card variant="accent"` (`card.tsx:6`, `rounded-card bg-accent p-5`):

| Archivo | Línea | `className` hoy | `className` después |
|---|---|---|---|
| `src/app/(tabs)/food.tsx` | 142 | `text-xs font-semibold uppercase tracking-widest text-accent-foreground opacity-70` | `text-xs font-semibold uppercase tracking-widest text-accent-contrast` |
| `src/app/(tabs)/food.tsx` | 147 | `text-3xl font-black text-accent-foreground` | `text-3xl font-black text-accent-contrast` |
| `src/app/(tabs)/food.tsx` | 153 | `font-semibold text-accent-foreground opacity-80` | `font-semibold text-accent-contrast` |
| `src/app/(tabs)/meal-schedule.tsx` | 174 | `text-xs font-semibold uppercase tracking-widest text-accent-foreground opacity-70` | `text-xs font-semibold uppercase tracking-widest text-accent-contrast` |
| `src/app/(tabs)/meal-schedule.tsx` | 177 | `text-3xl font-black text-accent-foreground` | `text-3xl font-black text-accent-contrast` |
| `src/app/(tabs)/meal-schedule.tsx` | 180 | `font-semibold text-accent-foreground opacity-80` | `font-semibold text-accent-contrast` |
| `src/app/(tabs)/meal-schedule.tsx` | 186 | `font-bold text-accent-foreground` | `font-bold text-accent-contrast` |

`src/components/card.tsx` **no se toca**: el variant `accent` solo declara el
relleno, no el color de texto. Sus asserts de `card.test.tsx:10-37` siguen
válidos.

Tras R1 + R3 no debe quedar **ninguna** ocurrencia de `text-accent-foreground`
en `src/` (18 hoy → 0).

### Sitios R4 — `text-accent` → `text-accent-strong` (12)

| Archivo | Línea | Contexto | Superficie |
|---|---|---|---|
| `src/app/(auth)/login.tsx` | 101 | `LinkButton.Label` "Create account" | `bg-background` |
| `src/app/(auth)/login.tsx` | 110 | `LinkButton.Label` "Forgot password?" | `bg-background` |
| `src/app/(auth)/forgot.tsx` | 50 | `LinkButton.Label` "Back to sign in" | `bg-background` |
| `src/screens/reset-password/index.tsx` | 71 | `LinkButton.Label` (rama sin token) | `bg-background` |
| `src/screens/reset-password/index.tsx` | 97 | `LinkButton.Label` (rama éxito) | `bg-background` |
| `src/app/(tabs)/home.tsx` | 310 | `Text` "View on map" | `bg-default` (`last-position-card`) |
| `src/app/(tabs)/health.tsx` | 213 | `Text` `weight-current` | `bg-surface` (`weight-card`) |
| `src/app/(tabs)/food.tsx` | 213 | pill "Served" | `bg-surface` |
| `src/app/(tabs)/map.tsx` | 284 | `Text` `stat-speed` | `bg-default` (tile) |
| `src/app/(tabs)/map.tsx` | 295 | `Text` `stat-distance` | `bg-default` (tile) |
| `src/screens/profile/index.tsx` | 249 | `Button.Label` "Change photo" | `bg-accent-soft` |
| `src/screens/add-pet/index.tsx` | 251 | `Button.Label` "Choose photo" | `bg-accent-soft` |

**Ocurrencias añadidas a la evidencia del audit** (mismo defecto, misma clase,
encontradas por grep al redactar esta spec; el criterio de aceptación 2 de
`feature_list.json` las cubre al decir "text-accent como color de enlace sobre
bg-surface **y sobre bg-default** pasa AA"): `food.tsx:213`, `map.tsx:284` y
`map.tsx:295`. Arreglar dos de las tres superficies y dejar la tercera sería
un fix parcial del mismo hallazgo.

**Excluido, declarado**: `src/components/floating-tab-bar.tsx:191`
(`text-2xs font-semibold text-accent` de la pestaña activa). No pertenece a
ningún hallazgo en alcance; el audit declaró el componente limpio de punta a
punta, su fondo es `bg-tab-pill` sobre `BlurView`/`GlassView` (no una superficie
neutra sólida, así que su ratio no es calculable con la misma fórmula), y es un
**indicador de estado activo** que se lee junto a un icono del mismo color. Si
el humano quiere revisarlo, es una entrada nueva de auditoría, no un arrastre
de esta.

Los iconos que resuelven `accent` de forma imperativa (`home.tsx:311`
`<ChevronRight color={accent} />`, `home.tsx:308`, `forgot.tsx:19`
`<Lock color={accent} />`) **no cambian**: el acento puro queda reservado a
iconos y rellenos, como hace el diseño.

### Sitios R5 — `text-warning` → `text-warning-strong` (3)

| Archivo | Línea | Contexto | Superficie |
|---|---|---|---|
| `src/app/(tabs)/health.tsx` | 142 | `Text` "Next due", `text-2xs font-semibold text-warning` | `bg-surface` (`next-vaccine-card`) |
| `src/screens/reminders/index.tsx` | 264 | badge "Upcoming!", `rounded-full bg-warning-soft px-2 py-0.5 text-2xs font-bold text-warning` | `bg-warning-soft` |
| `src/app/(tabs)/home.tsx` | 216 | `Text` `collar-battery`, rama `'font-semibold text-warning'` | `bg-default` (`collar-card`) |

`home.tsx:216` es una **ocurrencia añadida** a la evidencia del audit (el
hallazgo 2 solo citaba Health y Reminders): es `text-warning` como color de
texto sobre `bg-default`, **1,986:1**, el mismo defecto y la misma clase, y el
criterio de aceptación 2 dice "text-warning deja de usarse como color de texto
sobre esas superficies". Su rama hermana `'font-semibold text-success'` **no**
se toca: `--success` no está en el alcance de ningún hallazgo de esta feature.

`health.tsx:139` (`<Syringe color={warning} />`) y todos los `bg-warning-soft`
**no cambian**: el ámbar puro sigue siendo icono y relleno.
`health.test.tsx:359-367`, que afirma `color: '#F59E0B'` / `'#FBBF24'` en el
icono, sigue verde porque `--warning` no cambia.

### Sitios R10 — `hitSlop={TOUCH_SLOP}` (13 `Pressable`)

Filas de enlace:

| Archivo | Línea | `testID` |
|---|---|---|
| `src/app/(tabs)/health.tsx` | 246 | `weight-log-link` |
| `src/screens/profile/index.tsx` | 279 | `documents-link` |
| `src/screens/profile/index.tsx` | 291 | `reminders-link` |

Recetas de chip (cada una renderiza N chips; el `hitSlop` va en el `Pressable`
de la receta, así que lo heredan todos):

| Archivo | Línea | `testID` |
|---|---|---|
| `src/screens/add-reminder/index.tsx` | 146 | `type-chip-${reminderType}` |
| `src/screens/add-reminder/index.tsx` | 259 | `advance-chip-${option.minutes}` |
| `src/screens/add-pet/index.tsx` | 55 | `OptionalChip`, prop `testID` (`sex-*`, `size-*`, `sterilized-*`) |
| `src/screens/add-pet/index.tsx` | 275 | `species-${value}` |
| `src/screens/add-pet/index.tsx` | 345 | `age-mode-*` |

Botones de volver:

| Archivo | Línea | `testID` |
|---|---|---|
| `src/screens/docs/index.tsx` | 63 | `docs-back` |
| `src/screens/add-pet/index.tsx` | 228 | `add-pet-back` |
| `src/screens/add-reminder/index.tsx` | 120 | `add-reminder-back` |
| `src/app/(tabs)/weight-log.tsx` | 130 | `weight-log-back` |
| `src/app/(tabs)/meal-schedule.tsx` | 126 | `meal-schedule-back` |

### Sitio R11 — `src/app/(tabs)/map.tsx:279-325`

Estructura resultante (todo lo demás dentro de cada tile queda igual):

```tsx
<Card className="p-3">
  <View className="gap-2">
    <View className="flex-row gap-2">
      {/* tile stat-speed */}
      {/* tile stat-distance */}
    </View>
    <View className="flex-row gap-2">
      {/* tile stat-updated */}
      {/* tile stat-gps */}
    </View>
  </View>
</Card>
```

Los cuatro `Text` de valor (`stat-speed`, `stat-distance`, `stat-updated`,
`stat-gps`) añaden `numberOfLines={1}` y conservan
`className="text-base font-black text-accent-strong"` (los dos primeros, por
R4) y `"text-base font-black text-muted"` (los dos últimos). Las cuatro
etiquetas (`mt-1 text-2xs font-normal text-muted`) no cambian. El `View`
`map-stats` y su `style` absoluto no cambian.

---

## 5. Archivos afectados

Toda la feature vive en la capa de **presentación** de la app móvil. No toca
`domain`, `application` ni `infrastructure` de `docs/architecture.md`: no hay
lógica de negocio en ninguno de estos archivos, solo `className`, props de
estilo y estructura visual.

### Producción

| Archivo | Qué cambia | R |
|---|---|---|
| `mobile-pet-tracker/src/theme/global.css` | 3 tokens nuevos × 2 variants + bloque `@theme inline` + `--muted`/`--color-muted` light | R2, R4, R5, R6 |
| `mobile-pet-tracker/src/theme/touch-target.ts` | **Nuevo**. Exporta `TOUCH_SLOP` | R10 |
| `mobile-pet-tracker/src/app/(auth)/login.tsx` | raíz → `ScrollView`; 2 `text-accent`; 1 `text-accent-foreground` | R3, R4, R8 |
| `mobile-pet-tracker/src/app/(auth)/forgot.tsx` | raíz → `ScrollView`; 1 `text-accent`; 1 `text-accent-foreground` | R3, R4, R8 |
| `mobile-pet-tracker/src/app/(auth)/register.tsx` | `contentContainerStyle` + insets + `testID`; 1 `text-accent-foreground` | R3, R7 |
| `mobile-pet-tracker/src/screens/reset-password/index.tsx` | 3 ramas → `ScrollView`; 2 `text-accent`; 1 `text-accent-foreground` | R3, R4, R8 |
| `mobile-pet-tracker/src/app/(tabs)/map.tsx` | overlay 2×2 + `numberOfLines`; 2 `text-accent` | R4, R11 |
| `mobile-pet-tracker/src/app/(tabs)/health.tsx` | 1 `text-warning`; 1 `text-accent`; `hitSlop` en `weight-log-link` | R4, R5, R10 |
| `mobile-pet-tracker/src/app/(tabs)/home.tsx` | 1 `text-warning`; 1 `text-accent` | R4, R5 |
| `mobile-pet-tracker/src/app/(tabs)/food.tsx` | 3 `text-accent-foreground` (2 con opacidad); 1 `text-accent` | R3, R4 |
| `mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx` | 4 `text-accent-foreground` (2 con opacidad); `hitSlop` en el botón de volver | R3, R10 |
| `mobile-pet-tracker/src/app/(tabs)/weight-log.tsx` | 1 `text-accent-foreground`; `hitSlop` en el botón de volver | R3, R10 |
| `mobile-pet-tracker/src/screens/profile/index.tsx` | label de sección; 1 `text-accent`; 1 `text-accent-foreground`; `hitSlop` ×2 | R3, R4, R9, R10 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | 1 `text-danger-foreground`; 1 `text-accent-foreground`; 1 `text-warning` | R1, R3, R5 |
| `mobile-pet-tracker/src/screens/add-pet/index.tsx` | 1 `text-accent-foreground`; 1 `text-accent`; `hitSlop` ×4 | R3, R4, R10 |
| `mobile-pet-tracker/src/screens/add-reminder/index.tsx` | 1 `text-accent-foreground`; `hitSlop` ×3 | R3, R10 |
| `mobile-pet-tracker/src/screens/docs/index.tsx` | `hitSlop` en `docs-back` | R10 |

### Tests

| Archivo | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` | **Nuevo**. Escaneo de fuentes para R1, R3, R4-uso, R5-uso |
| `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` | `describe` nuevos para R2, R4-token, R5-token, R6 **+ la excepción declarada** (2 literales) |
| `.../(auth)/__tests__/register.test.tsx` | `describe('#61 R7: …')` |
| `.../(auth)/__tests__/login.test.tsx`, `.../forgot.test.tsx`, `src/screens/reset-password/index.test.tsx` | `describe('#61 R8: …')` |
| `src/screens/profile/index.test.tsx` | `describe('#61 R9: …')` y `describe('#61 R10: …')` |
| `.../(tabs)/__tests__/health.test.tsx`, `.../weight-log.test.tsx`, `.../meal-schedule.test.tsx`, `src/screens/add-pet/index.test.tsx`, `.../add-reminder/index.test.tsx`, `.../docs/index.test.tsx` | `describe('#61 R10: …')` |
| `.../(tabs)/__tests__/map.test.tsx` | `describe('#61 R11: …')` |

---

## 6. Excepciones al invariante (declaradas, no descubiertas)

Solo hay **una**, y hay que firmarla en el gate:

> **E1 — R6 obliga a editar dos literales de un test preexistente.**
> `src/theme/__tests__/global-css.test.ts` afirma `muted: '#6B7280'` (línea 75,
> del `describe('R1: …')` de #46) y `'#6B7280'` como parámetro `muted` de la
> fila `light` del `it.each` (línea 95, del `describe('R2: …')` de #46). Cambiar
> `--muted` a `#667085` los pone en rojo. Son asserts de **valor de token**, no
> de conducta, y son la codificación de la paleta light de #46 R1/R2 — así que
> esta feature **contradice explícitamente** ese valor concreto de #46 R1/R2 y
> lo dice aquí en vez de dejar que Codex lo descubra a mitad del handoff. El
> arreglo permitido es **exactamente** sustituir esos dos `'#6B7280'` por
> `'#667085'`. Nada más de ese archivo se reescribe.
>
> Nota: `global-css.test.ts` es `.ts`, no `.tsx`, así que la letra del criterio
> de aceptación 9 ("git diff no toca ningún `.test.tsx` salvo tests nuevos que
> nombren su R-id") se cumple igualmente. Se declara por su espíritu, no por su
> letra.

Comprobaciones hechas que **no** produjeron excepción:

- Los tres tests de `(auth)` y el de `reset-password` no se anclan al árbol
  (§D5): R8 no rompe nada.
- `src/screens/reminders/index.test.tsx:160` afirma
  `getByTestId('reminders-delete-confirm').props.className` contiene
  `'bg-danger'` — es el `className` del `Button`, no el del `Button.Label`. R1
  no lo toca.
- `src/components/__tests__/pet-switcher.test.tsx:90` afirma
  `'border-accent'` en el chip. R10 excluye pet-switcher; sigue verde.
- `src/app/(tabs)/__tests__/map.test.tsx:558` afirma el `style` del `View`
  `map-stats`. R11 no lo toca.
- `src/app/(tabs)/__tests__/food.test.tsx:161-171` y
  `.../meal-schedule.test.tsx:185-200` solo afirman dimensiones de `Skeleton`.
  R3 no las toca.
- `src/app/(tabs)/__tests__/health.test.tsx:359-367` afirma `color: '#F59E0B'` /
  `'#FBBF24'` en el icono. `--warning` no cambia; sigue verde.
- `src/app/(tabs)/__tests__/health.test.tsx:75` **mockea**
  `useThemeColors('muted')` como `'#6B7280'` pero no lo asevera. Queda
  desactualizado tras R6 y **no se toca**: tocarlo sí sería editar un `.test.tsx`
  preexistente sin necesidad. Anotado como higiene para #62.
- `src/__tests__/design-drift.test.ts` (C8, clases arbitrarias): ninguna
  propuesta de esta spec introduce `[...]`; sigue verde.

---

## 7. Alternativas descartadas

- **Oscurecer `--accent` entero** (o el `--accent-solid` que proponía el audit
  para el hallazgo 1): descartado por el humano el 2026-09-03. El relleno
  conserva `#2AB87C`, el valor Figma aprobado en #46 R1.
- **Un solo token para los dos roles de texto de acento**: aritméticamente
  imposible en dark (§D1). Se demuestra, no se afirma.
- **Cambiar `--accent-foreground` de `#FFFFFF` a `#0B402A`** en vez de añadir
  `--accent-contrast`: rompería `global-css.test.ts:79` y `:126` (dos asserts
  más de #46) y, sobre todo, pintaría de verde la etiqueta del botón
  destructivo del hallazgo 21 mientras no se arreglara. Añadir un token deja
  ese riesgo en cero.
- **`text-accent-soft-foreground` / `text-warning-soft-foreground`** (los
  derivados que heroui ya expone, sin token nuevo): 3,68:1 y 3,92:1. No llegan
  a AA, y su hex exacto lo calcula heroui con `color-mix(in oklab, …)`, así que
  no es aserible leyendo `global.css`. Un requisito no verificable no es un
  requisito.
- **`#B45309` para `--warning-strong`** (propuesta del audit): 4,469:1 sobre
  `warning-soft`. Falla por 0,03, el mismo error que esta feature arregla en
  `--muted`.
- **`#15804F` para el texto de acento** (propuesta del audit): 1,948:1 sobre
  `bg-accent`. Sirve para el rol B, no para el A. Se usa una variante suya
  (`#167A50`, con más margen sobre `bg-default`: 4,937 contra 4,588) solo para
  el rol B.
- **Padding en vez de `hitSlop`** para los 44 pt: agranda la superficie pintada
  y viola el criterio de aceptación 6 (§D4).
- **`flex-wrap` + `basis-1/2` o `w-[48%]`** para el overlay del mapa: clase
  arbitraria (rompe C8) o desbordamiento por el `gap` (§D3).
- **`adjustsFontSizeToFit` + `text-sm`** en el overlay: con 2×2 sobran 57 pt de
  margen; encoger la fuente cambiaría la tipografía del diseño para tapar un
  problema de ancho que ya no existe (§D3).
- **Migrar el label de sección de `pet-info-card` a un componente compartido**
  (`SectionLabel`): tentador —el tratamiento se repite 10 veces— pero es
  consistencia visual, o sea **#62**, y la regla de extracción de la carta pide
  ≥2 pantallas + rol nombrable + API menor que la implementación. R9 solo
  restaura el `className` que #46 R10 fijó.

---

## 8. Hallazgo 18 (`--radius-card`): fuera, con nota para el smoke

Decisión humana del 2026-09-03: **no se reabre**. Los 20 px ya pasaron el smoke
lado a lado con el Figma. La lectura del audit (que las cards del Make usan
`rounded-2xl`, que en Tailwind v4 cae al default de 16 px porque
`design-src/theme.css:108-111` no remapea `--radius-2xl`) queda **anotada como
punto a comparar en el próximo smoke, al mismo tamaño físico** — el `PhoneFrame`
del Make mide 260 × 530 px y un valor absoluto copiado 1:1 renderiza ~1,5 ×
más pequeño en proporción sobre un teléfono de 390 dp, lo que tira en la
dirección contraria (hacia radios mayores). Nada de esta feature toca
`--radius-card`.

---

## 9. Orden de implementación (obligatorio)

1. **R1** — hallazgo 21. Cero cambio visual; deja el árbol sin tokens de acento
   fuera de superficies de acento **antes** de tocar nada del acento.
2. **R2** → **R3** — token `--accent-contrast` y sus 17 sitios.
3. **R4**, **R5**, **R6** — el resto de contraste. Independientes entre sí.
4. **R7**, **R8** — safe areas y scroll.
5. **R9**, **R10**, **R11** — regresión, tap targets y overlay.
6. **R12** — gate mecánico del reviewer sobre el árbol completo.

Cada uno con su ciclo TDD completo (ver [[tasks]]): commit rojo que nombra el
R-id, commit verde, commit de refactor si hace falta. C4 de
[[../../CHECKPOINTS|CHECKPOINTS]] exige el historial rojo→verde; en #19 se
entregó todo en un solo commit y eso **no** se repite aquí.
