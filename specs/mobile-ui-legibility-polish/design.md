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
> ninguna decisión abierta.** Todo número de contraste y de distancia
> perceptual está calculado, no estimado; el método está abajo y es
> reproducible.

Skills cargadas antes de escribir (obligatorias por la carta):
`appllama-app-design-skill`, `expo:expo-overview` → `expo:expo-native-ui` y
`expo:expo-design-system`. De appllama se toma el **patrón** (ley de fidelidad
nativa "contraste pasa en ambos temas", "un solo hue de acento", "todo tap
target ≥ 44 pt", "wrap root in a ScrollView"). Su **sistema de estilos**
(`Color.ios.*`, `StyleSheet.create`, tokens en TS) se descarta por la carta
§Decisiones fijas 1-3: aquí los tokens viven **solo** en
`mobile-pet-tracker/src/theme/global.css` y se consumen como `className` o vía
`useThemeColors`.

---

## 1. Método de cálculo (reproducible)

**Contraste** — WCAG 2.1, luminancia relativa sRGB:

```
c' = c/255
c_lin = c'/12.92                     si c' <= 0,04045
c_lin = ((c' + 0,055)/1,055)^2,4     en otro caso
L = 0,2126·R_lin + 0,7152·G_lin + 0,0722·B_lin
ratio = (L_claro + 0,05) / (L_oscuro + 0,05)
```

**Distancia perceptual** — CIEDE2000 (ΔE00) sobre CIE-Lab D65, que es la
métrica correcta para "¿se confunden dos colores?"; ΔE00 ≈ 2,3 es el umbral de
apenas-perceptible. Se reporta también ΔE76 por transparencia, pero **no** se
decide con ella: ΔE76 sobreestima las distancias en verdes saturados y aquí da
la conclusión contraria (§3).

**Tono** — HSL. `hue(#2AB87C) = 154,65°`, calculado, no supuesto.

**Composición de los `*-soft`** — heroui los define como
`color-mix(in oklab, var(--X) 15%, transparent)`
(`node_modules/heroui-native/src/styles/theme.css:83-97`), es decir el color al
15 % de alfa; se componen sobre la superficie de detrás antes de medir. Igual
para `--tab-pill`, que es un `rgba(...)` literal al 14 % (light) / 22 % (dark).

**Verificación del ancla**: blanco `#FFFFFF` sobre `#2AB87C` da **2,547:1** con
esta fórmula, que reproduce el 2,546:1 verificado dos veces por el humano.

Umbral: **4,5:1** para texto (AA, texto normal — el `Button.Label` de heroui es
16 px bold, por debajo del corte de 18,66 px bold, así que el 3,0:1 de "texto
grande" no aplica) y **3,0:1** para componentes no textuales (WCAG 1.4.11:
bordes de chip, iconos, trazo y puntos de la gráfica, polilínea del mapa).

### Estado ANTES

| Par | ratio hoy | Hallazgo |
|---|---|---|
| `#FFFFFF` sobre `bg-accent` (light **y** dark) | **2,547** | 1 |
| `#FFFFFF` `opacity-70` sobre `bg-accent` | **1,937** | 1 |
| `#FFFFFF` `opacity-80` sobre `bg-accent` | **2,124** | 1 |
| `text-accent` sobre `bg-surface` | **2,547** | 3 |
| `text-accent` sobre `bg-default` | **2,355** | 3 |
| `text-accent` sobre `bg-accent-soft` | **2,217** | 3 |
| `text-accent` sobre `bg-tab-pill` (light) | **≈2,4** | — (barrido) |
| `text-warning` sobre `bg-surface` | **2,148** | 2 |
| `text-warning` sobre `bg-warning-soft` | **1,911** | 2 |
| `text-warning` sobre `bg-default` | **1,986** | 2 (ocurrencia añadida, §4 R5) |
| `text-muted` sobre `bg-default` | **4,471** | 19 |
| `text-muted` sobre `bg-surface-secondary` | **4,566** | 19 |

---

## 2. Decisiones técnicas

### D1 — Se oscurece el acento; la etiqueta se queda blanca

Decisión humana del 2026-09-03, textual: *"oscurece el acento, quiero la letra
blanca"*. Sustituye a la vía anterior (relleno intacto + etiqueta en verde muy
oscuro), que el humano descartó al ver que cambiaba el aspecto de los 17 CTA.
Esta spec **no la re-litiga**.

Presupuesto: para que `#FFFFFF` dé ≥ 4,5:1 encima, el acento necesita
`L ≤ (1,05/4,5) − 0,05 = 0,183333`. El `#2AB87C` del Figma tiene `L = 0,362285`:
está al doble de luminancia del máximo admisible. No hay forma de conservarlo
con letra blanca.

#### Elección del hex: `--accent: #178255`

Restricciones aplicadas, en este orden:

1. **Conservar el hue del verde original.** `hue(#2AB87C) = 154,65°`;
   `hue(#178255) = 154,77°`. Desviación **0,12°**: la marca sigue siendo el
   mismo verde, más profundo.
2. **`#FFFFFF` encima ≥ 4,5:1 con margen.** `#178255` da **4,816:1**
   (margen +0,316 sobre el umbral). No queda clavado en 4,50.
3. **El relleno tiene que seguir viéndose como relleno** (WCAG 1.4.11, ≥ 3,0:1
   contra el fondo de página): 4,816:1 sobre `#FFFFFF` en light, **3,930:1**
   sobre `#0D1117` en dark, 3,592:1 sobre `#161B22`. Esta restricción es la que
   impide bajar mucho más: a partir de `L ≈ 0,145` el botón empieza a fundirse
   con el fondo oscuro.
4. **No acercarse a `--success`** (§3).

Cálculo completo:

```
#178255 -> R=23  G=130  B=85
R' = 23/255  = 0,090196 -> ((0,090196+0,055)/1,055)^2,4 = 0,009134
G' = 130/255 = 0,509804 -> ((0,509804+0,055)/1,055)^2,4 = 0,222970
B' = 85/255  = 0,333333 -> ((0,333333+0,055)/1,055)^2,4 = 0,090842
L  = 0,2126·0,009134 + 0,7152·0,222970 + 0,0722·0,090842 = 0,168150
ratio(#FFFFFF, #178255) = (1,0 + 0,05) / (0,168150 + 0,05) = 1,05 / 0,218150 = 4,814
```

(El valor exacto con doble precisión es **4,816**; la diferencia con el 4,814
de arriba es el redondeo a 6 decimales de los intermedios.)
`L = 0,168150 ≤ 0,183333` ✔

**Por qué no la referencia `#148554` que dio el humano.** Es válida
(4,653:1, hue 153,98°) y se evaluó en serio, pero pierde en las dos métricas
que importan aquí: margen de blanco (4,653 contra 4,816) y —lo decisivo—
distancia a `--success`, que con `#148554` **empeora** respecto a hoy
(ΔE00 9,16 → 7,95) mientras que con `#178255` no empeora (9,16 → 9,24). Ver §3.
También se descartaron verdes más oscuros (`#167A50`, blanco 5,338; `#227552`,
blanco 5,623): mejoran el contraste de texto pero bajan la visibilidad del
botón en dark a 3,55 y 3,37 y se alejan mucho más del Make.

**Consecuencia declarada, no escondida**: `--accent` deja de valer el `#2AB87C`
que #46 R1 tomó del Figma. ΔE00 respecto al verde del Make = **17,44**: los
rellenos de la app ya no coinciden 1:1 con él y el smoke lado a lado lo va a
notar. Es una desviación **explícita de #46 R1**, y R2 la deja escrita en
`docs/ui-guidelines.md` con el texto de §7.

#### Lo que arrastra el cambio del token

Dos tokens de `global.css` **repiten literalmente** el valor del acento y
tienen que moverse con él, o el diseño se descuadra:

| Token | Hoy | Nuevo | Por qué |
|---|---|---|---|
| `--focus` | `#2AB87C` (light y dark) | `#178255` | Es el anillo de foco del acento. Si no se mueve, el foco deja de ser "el verde de la marca". Contraste como indicador: 4,816 sobre `#FFFFFF`, 3,592 sobre `--default` dark ✔ ≥3,0 |
| `--tab-pill` / `--color-tab-pill` | `rgba(42,184,124,0.14)` / `…,0.22)` | `rgba(23,130,85,0.14)` / `rgba(23,130,85,0.22)` | Es el acento al 14 %/22 %. Si no se mueve, la píldora de la pestaña activa queda de un verde y su icono de otro |

`--surface-secondary` (`#F0FBF6` / `#12231B`) **no** se mueve: es un verde
pálido de superficie, no una repetición del valor del acento, y ninguna
etiqueta de esta feature falla sobre él (`text-accent-strong` da 5,703 encima).

`--accent-foreground` / `--color-accent-foreground` **no se tocan**: `#FFFFFF`
en los dos temas, que es la decisión.

### D2 — El token se parte por rol, no por tema: relleno vs tinta

Con el acento oscurecido aparece un conflicto que se resuelve aquí y se
demuestra con los dos números que pidió el gate:

- **Como relleno**, el acento tiene que ser oscuro en los **dos** temas: el
  fondo del botón es el mismo hex en light y en dark, así que la etiqueta
  blanca falla en los dos (2,547:1 hoy) y se arregla en los dos (4,816:1). El
  relleno **no se parte por tema**: `#178255` en light y en dark.
- **Como tinta** (texto, enlace, icono, borde de gráfica, trazo), el acento
  vive sobre las superficies del tema. En light, `#178255` sobre `bg-default`
  da **4,454:1** — falla por 0,046 — y sobre `bg-accent-soft` da **3,941:1**.
  En dark es mucho peor: `#178255` sobre `--surface` `#161B22` da **3,240:1** y
  sobre `--default` `#1F242B` **3,592:1**, muy lejos de 4,5.

Los dos requisitos son incompatibles en un solo token:

```
relleno, dark:  L(accent) <= 0,183333        (blanco encima >= 4,5)
tinta,  dark:   L(accent) >= 0,227700        (sobre #161B22 >= 4,5)
```

Por eso se separa **por rol**:

| Token | light | dark | Rol |
|---|---|---|---|
| `--accent` | `#178255` | `#178255` | **Relleno**: `bg-accent`, `bg-accent-soft` (derivado), `border-accent`, `--focus`, `--tab-pill` |
| `--accent-strong` | `#107148` | `#2AB87C` | **Tinta**: texto, enlaces, iconos, trazo y puntos de la gráfica, polilínea del mapa |

La regla de nombre `-strong` es la misma que el propio audit propuso para
`--warning-strong`: *"la variante AA del mismo hue para uso en primer plano,
resuelta por tema"*. En light eso significa un verde algo más oscuro que el
relleno; en dark, uno más claro. La dirección la dicta la superficie, la regla
es una sola.

**Y el tema oscuro no pierde nada como tinta**: `--accent-strong` en dark vale
exactamente `#2AB87C`, el verde de hoy, con los ratios de hoy (6,79 sobre
`surface`, 6,13 sobre `default`). Ni un píxel de tinta cambia en dark. Lo único
que cambia en dark es el relleno, que es justo el par que fallaba.

#### Elección del hex de la tinta light: `#107148`

El presupuesto lo fija la superficie más pálida sobre la que se pinta tinta de
acento, que es el **nuevo** `accent-soft` (15 % de `#178255` sobre blanco =
`#DCECE6`, más claro que el `#DFF4EB` de hoy porque el acento es más oscuro):

```
L(#DCECE6) = 0,808...  ->  L(tinta) <= (0,808... + 0,05)/4,5 - 0,05 = 0,140933
```

`#107148` tiene `hue = 154,64°` — a **0,01°** del verde original del Figma, el
mejor ajuste de tono de todos los candidatos evaluados — y `L = 0,124...`,
dentro del presupuesto. ΔE00 respecto al relleno = 5,97: se leen como el mismo
verde de marca, no como dos acentos distintos (que violaría la ley anti-slop 2
de appllama, "un solo acento").

### D3 — Hallazgo 21 (R1) ya no es un bloqueo, sigue siendo correcto

`reminders/index.tsx:341` pinta la etiqueta del botón destructivo con
`text-accent-foreground` sobre `bg-danger`. Con la decisión revisada
`--accent-foreground` **no se toca** (sigue `#FFFFFF`), así que el botón no
corre ningún riesgo de volverse verde. R1 se mantiene porque:

- es el **criterio de aceptación 8** de `feature_list.json`, literal;
- es el token equivocado para el rol: un botón `danger` debe resolver su
  etiqueta con `--danger-foreground` (que cae al `--snow` de heroui,
  `node_modules/heroui-native/src/styles/variables.css:5,67`, ≈ `#FCFCFC`);
- **cero cambio visual hoy**, y deja el árbol sin tokens del acento fuera de
  superficies de acento antes de que R2 mueva el acento.

Se mantiene como **R1** y primero en el orden para no romper la trazabilidad
ya escrita.

### D4 — Hallazgo 4 (overlay del mapa): dos filas de dos

Restricción: no se puede quitar un tile (sería conducta) ni cambiar texto
visible. Se evaluaron las tres vías:

| Vía | Veredicto |
|---|---|
| `flex-wrap` + `w-[48%]` o `basis-[calc(50%-4px)]` | **Descartada.** Clase arbitraria: la rompe `src/__tests__/design-drift.test.ts` C8 (`/[A-Za-z0-9_-]+-\[[^\]]+\]/` ⇒ `[]`). Con `basis-1/2` + `gap-2`, 50 % + 50 % + 8 pt > 100 % hace caer cada tile a su propia fila. |
| `text-sm` + `numberOfLines` + `adjustsFontSizeToFit` | **Descartada.** El ancho útil sigue siendo 53,5 pt y "12.5 km/h" mide ~72 pt a 14 px: `adjustsFontSizeToFit` lo *encoge*, así que los cuatro tiles acaban con tamaños de fuente distintos. Cambia la tipografía del diseño para tapar un problema de ancho. |
| **Dos filas de dos** | **Elegida.** |

Aritmética (teléfono de referencia 390 dp, el mismo del audit):

```
ancho del overlay      = 390 − 16 (left) − 16 (right)          = 358
dentro de la Card p-3  = 358 − 12 − 12                         = 334
HOY  4 tiles: (334 − 3 gaps × 8) / 4 = 77,5 ; − p-3 del tile   =  53,5 pt
NUEVO 2 tiles/fila: (334 − 1 gap × 8) / 2 = 163 ; − p-3        = 139,0 pt
```

Cadena más larga que la pantalla renderiza hoy: `"12.5 km/h"` ≈ **82 pt** a
16 px Inter-Black (medida del audit). 139 > 82 con 57 pt de margen; incluso
`"999.9 km/h"` (~95 pt) cabe. El ancho deja de ser el binding constraint, así
que los valores conservan `text-base font-black` (fidelidad al Make,
`App.tsx:502`). `numberOfLines={1}` se añade como garantía dura y porque es lo
único de este requisito que un test de jest puede afirmar (jest-expo no tiene
motor de layout).

Agrupación: `stat-speed` + `stat-distance` arriba (los dos valores de acento),
`stat-updated` + `stat-gps` abajo (los dos `muted`). Agrupa por rol y color y
conserva el orden de lectura actual. El overlay crece ~60 pt hacia arriba sobre
el mapa (vista nativa detrás): no colisiona con nada, y el `style` absoluto del
`View` `map-stats` no cambia (lo asevera `map.test.tsx:558`).

### D5 — Hallazgo 13 (44 pt): `hitSlop`, no padding

El criterio de aceptación 6 dice, literalmente, "sin cambiar el tamaño visible
del control". Eso **elimina el padding**:

- **Padding** (`py-2` → `py-3`, la propuesta del audit): las tres recetas
  tienen fondo propio (`bg-default`, `bg-accent-soft`), así que subir el
  padding **agranda la superficie coloreada**: el control se ve 8 pt más alto.
  Es lo que el criterio prohíbe. `size-10` → `size-11` cambia el diámetro del
  círculo a la vista.
- **`hitSlop`**: extiende el rectángulo táctil sin tocar el layout ni un píxel
  pintado. Única vía compatible.

Valor único: `{ top: 6, bottom: 6, left: 6, right: 6 }`, exportado como
`TOUCH_SLOP` desde `mobile-pet-tracker/src/theme/touch-target.ts` (constante TS
porque `hitSlop` no es expresable en CSS; precedente en el repo:
`TAB_INDICATOR_SPRING` en `floating-tab-bar.tsx`).

Por qué 6 y no 4: la caja no se puede medir en jest, así que se acota por abajo
y se elige un slop que funcione en todo el rango:

| Receta | Caja mínima | + 12 pt | ≥ 44 |
|---|---|---|---|
| Fila de enlace `px-3 py-2` (texto 14 px, line box ≈ 17) | 8+8+17 = **33** | 45 | ✔ |
| Chip `px-3 py-2` con `text-sm` | 8+8+17 = **33** | 45 | ✔ |
| Chip `px-4 py-2` con texto 16 px (species) | 8+8+19 = **35** | 47 | ✔ |
| Botón de volver `size-10` | **40** | 52 | ✔ |
| Botón de volver `rounded-full p-2` con icono 20 | 8+8+20 = **36** | 48 | ✔ |

Con slop 4 la primera fila daría 41 pt y **fallaría**; con 6 pasa todo el rango.

Solape aceptado y declarado: los chips viven en `flex-row flex-wrap gap-2` y
`flex-row gap-2` (8 pt de hueco). Con 6 pt por lado, dos chips vecinos solapan
4 pt de banda táctil; en esa banda gana el hermano anterior en el árbol. Es un
9 % de un objetivo de 44 pt, entre chips del mismo grupo, y el error es
reversible con un toque. Las filas de enlace (separadas por `gap: 16`) y los
botones de volver (`flex-row gap-3`, sin pressable vecino) no solapan.

Nota de plataforma: en Android `hitSlop` solo entrega toques dentro de los
límites del padre. Los 13 controles están holgadamente dentro de contenedores
mayores, así que los 6 pt caen siempre dentro del padre.

**`pet-switcher.tsx:32-33` queda fuera.** El audit lo lista como "`p-1` sobre un
`Avatar size="sm"` ≈ 36 pt", pero heroui define `sm` como
`calc(var(--spacing) * 10)` = **40 pt**
(`node_modules/heroui-native/src/styles/components/avatar.css:16-19`). Con `p-1`
(4 pt × 2) y `border-2` (2 pt × 2, box-sizing interior en RN) el chip mide
**52 pt**. Ya cumple; añadirle slop solaparía con sus vecinos sin ganar nada.

### D6 — Hallazgo 6: qué tests se anclan al árbol de login / forgot / reset

Se comprobó **archivo por archivo**, no por muestreo:

```
grep -rn "UNSAFE_|toJSON()|toMatchSnapshot|screen.root|getByType|ScrollView|parent" \
  src/app/(auth)/__tests__/ src/screens/reset-password/index.test.tsx
→ 0 coincidencias
```

- `login.test.tsx`: solo `testID` (`login-email`, `login-password`,
  `login-submit`, `login-error`, `link-register`, `link-forgot`) y texto.
- `forgot.test.tsx`: `getByText`, `getByTestId`, `toHaveProp('editable')`,
  `toBeDisabled()`.
- `reset-password/index.test.tsx`: `testID` y texto.
- `(auth)/__tests__/layout.test.tsx`: prueba el `Redirect`, no el árbol.

Conclusión: **envolver las tres pantallas en un `ScrollView` no rompe ningún
test existente**; R8 no introduce ninguna excepción al invariante. Los `testID`
`screen-login` / `screen-forgot` / `screen-reset-password` son **añadidos**
(nunca renombrados) y siguen la convención `screen-<nombre>` de las once
pantallas con scroll.

Métricas: `padding: 24` (= el `p-6` de hoy) y `gap: 16` (= el `gap-4` de hoy),
así que el interior no se mueve. `flexGrow: 1` + `justifyContent: 'center'`
conserva el centrado vertical exacto.

**Desviación declarada de `conventions.md` §Dimensiones**: las tres pantallas
usan `paddingBottom: insets.bottom + 24`, no `+ 96`. El `+96` existe para
despejar `floating-tab-bar.tsx`, que solo se monta bajo `(tabs)`; el grupo
`(auth)` no tiene barra flotante, y en un layout centrado con `flexGrow: 1` un
`+96` sin contrapartida arriba desplazaría el bloque visiblemente. `register.tsx`
(R7) **sí** usa `+96`, porque el criterio de aceptación 4 pide que se alinee
"como las otras once pantallas con scroll" y, al ser un formulario largo que
scrollea desde arriba, el padding extra es solo holgura.

### D7 — Dónde vive cada test

| Tipo de requisito | Archivo | Patrón preexistente |
|---|---|---|
| Valor de token + ratio (R2, R4-token, R5-token, R6) | `src/theme/__tests__/global-css.test.ts` | #46 R1/R2 y #72 R1: leer `global.css`, extraer `@theme` / `@variant`, parsear variables |
| Uso del token (R1, R3, R4-uso, R5-uso) | `src/__tests__/legibility-classnames.test.ts` (**nuevo**) | #72: `src/__tests__/design-drift.test.ts`, que ya escanea las fuentes `.tsx` |
| Árbol renderizado (R7, R8, R10, R11) | Los test files de pantalla ya existentes | `@testing-library/react-native`, mock `useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 })` como `home.test.tsx:45-48` |
| R9 | `src/screens/profile/index.test.tsx` | Render + `props.className` |
| R12 | Sin test de jest | Gate mecánico del `reviewer` |

Los `describe` nuevos se nombran **`#61 R<n>: …`**. Es una decisión de esta
spec: los R-ids del repo son por feature y ya colisionan (`global-css.test.ts`
tiene `describe('R1: …')` de #46 y `profile/index.test.tsx` tiene
`describe('R1: …')` de #33). Sin el prefijo la trazabilidad sería ambigua.

Con el mock de insets estándar (top 40, bottom 24): `paddingTop: 52`;
`paddingBottom: 120` para R7 (`24 + 96`) y `48` para R8 (`24 + 24`).

---

## 3. `--success`: la distancia se mide y no empeora

`--success` vale `#0F9B5A` en light y `#34D399` en dark. Un acento más oscuro
podría acercarse al verde de estado y hacer que dos semánticas distintas se
leyeran igual. Medido:

| Par (light) | ΔE00 | ΔE76 |
|---|---|---|
| **HOY** `#2AB87C` ↔ `#0F9B5A` | **9,16** | 11,33 |
| Referencia del humano `#148554` ↔ `#0F9B5A` | **7,95** ⚠ | 12,43 |
| **Elegido** `#178255` ↔ `#0F9B5A` | **9,24** ✔ | 15,06 |
| Tinta `#107148` ↔ `#0F9B5A` | 12,4 | 20,0 |

| Par (dark) | ΔE00 |
|---|---|
| `#178255` (relleno) ↔ `#34D399` | 24,25 |
| `#2AB87C` (tinta dark) ↔ `#34D399` | 7,21 (es la situación de hoy, sin cambio) |

**Decisión: no se toca `--success` y no se separa más el acento.** Tres razones,
en orden de peso:

1. **La distancia no empeora.** 9,16 → 9,24. La convivencia acento/success es
   exactamente la que la app ya tiene aprobada desde #46; esta feature no la
   estrecha. (Aquí es donde ΔE76 y ΔE00 discrepan y por qué se decide con ΔE00:
   ΔE76 diría que `#148554` "se aleja" —11,33 → 12,43— cuando
   perceptualmente **se acerca**.)
2. **Fue el criterio para descartar la referencia `#148554`**, que sí la
   estrechaba a 7,95. Ese es el "encontré mejor y digo por qué" del hex elegido.
3. **Nunca comparten rol ni forma.** `--success` se usa solo como **tinta de
   estado** en tres sitios (`home.tsx:216` batería > 60 %, `home.tsx:205` icono
   de batería, `weight-log.tsx:44` delta de peso), siempre texto o icono
   pequeño sobre superficie neutra. El acento nuevo se usa como **relleno** de
   la acción principal, y su tinta es `--accent-strong` `#107148`, a ΔE00 12,4
   de `#0F9B5A`. No hay ningún punto de la app donde un relleno de acento y un
   texto de success compartan borde.

**Anotado, fuera de alcance**: `text-success` `#0F9B5A` da **3,586:1** sobre
`bg-surface` y **3,316:1** sobre `bg-default` en light. Es un fallo AA
**preexistente** que ningún hallazgo de la auditoría recoge, así que no entra
en #61; queda como candidato para la próxima auditoría.

---

## 4. Barrido completo de consumidores del acento

Regla mecánica para Codex, sin excepciones: **si el acento es el fondo, es
`--accent`; si el acento es lo que se dibuja encima de otra cosa, es
`--accent-strong`.**

### Relleno — `--accent` (cero cambios de `className`, el token hace el trabajo)

| Consumidor | Sitios | Número después |
|---|---|---|
| `bg-accent` en `Button` | `login.tsx:87`, `forgot.tsx:41`, `register.tsx:262`, `weight-log.tsx:191`, `meal-schedule.tsx:239`, `add-pet/index.tsx:417`, `profile/index.tsx:192`, `add-reminder/index.tsx:275`, `reset-password/index.tsx:149`, `reminders/index.tsx:135` (**10**) | etiqueta `#FFFFFF` encima: **4,816:1** (hoy 2,547) |
| `bg-accent` en `Card variant="accent"` | `card.tsx:6`, usada por `food.tsx:137` y `meal-schedule.tsx:169` (**2 cards, 7 nodos de texto**) | igual: **4,816:1**; los 4 nodos con `opacity-*` los arregla R3 |
| `bg-accent-soft` (derivado 15 %) | 12 sitios | light pasa de `#DFF4EB` a **`#DCECE6`**; dark (sobre `bg`) a **`#0E2220`**. Tinta encima: **4,941** light / **6,501** dark |
| `border-accent` | `pet-switcher.tsx:32`, `add-pet/index.tsx:55,275,345`, `add-reminder/index.tsx:146,259` (**6**) | borde sobre página: 4,816 light / 3,930 dark ✔ ≥3,0 |
| `--focus` | token | 4,816 light / 3,592 sobre `--default` dark ✔ ≥3,0 |
| `--tab-pill` | token | píldora al 14 %: `#DFEEE7` light, `#0F2A25` dark |

`src/components/card.tsx` **no se toca** (su variant `accent` solo declara el
relleno). Sus asserts de `card.test.tsx:10-37` siguen válidos.
`pet-switcher.test.tsx:91` (`border-accent`) sigue verde.

### Tinta — `--accent-strong` (13 `className` + 6 imperativos)

`className`: `text-accent` → `text-accent-strong`

| Archivo | Línea | Contexto | Superficie | Ratio light / dark |
|---|---|---|---|---|
| `src/app/(auth)/login.tsx` | 101 | `LinkButton.Label` "Create account" | `bg-background` | 6,039 / 7,431 |
| `src/app/(auth)/login.tsx` | 110 | `LinkButton.Label` "Forgot password?" | `bg-background` | 6,039 / 7,431 |
| `src/app/(auth)/forgot.tsx` | 50 | `LinkButton.Label` "Back to sign in" | `bg-background` | 6,039 / 7,431 |
| `src/screens/reset-password/index.tsx` | 71 | `LinkButton.Label` (rama sin token) | `bg-background` | 6,039 / 7,431 |
| `src/screens/reset-password/index.tsx` | 97 | `LinkButton.Label` (rama éxito) | `bg-background` | 6,039 / 7,431 |
| `src/app/(tabs)/home.tsx` | 310 | `Text` "View on map" | `bg-default` | 5,584 / 6,128 |
| `src/app/(tabs)/health.tsx` | 213 | `Text` `weight-current` | `bg-surface` | 6,039 / 6,792 |
| `src/app/(tabs)/food.tsx` | 213 | pill "Served" | `bg-surface` | 6,039 / 6,792 |
| `src/app/(tabs)/map.tsx` | 284 | `Text` `stat-speed` | `bg-default` | 5,584 / 6,128 |
| `src/app/(tabs)/map.tsx` | 295 | `Text` `stat-distance` | `bg-default` | 5,584 / 6,128 |
| `src/screens/profile/index.tsx` | 249 | `Button.Label` "Change photo" | `bg-accent-soft` | 4,941 / 6,501 |
| `src/screens/add-pet/index.tsx` | 251 | `Button.Label` "Choose photo" | `bg-accent-soft` | 4,941 / 6,501 |
| `src/components/floating-tab-bar.tsx` | 191 | etiqueta de pestaña activa | `bg-tab-pill` | **5,038 / 5,983** (hoy ≈2,4) |

Imperativos: `useThemeColors(['accent'])` → `useThemeColors(['accent-strong'])`

| Archivo | Línea | Qué pinta | Superficie | Umbral |
|---|---|---|---|---|
| `src/components/floating-tab-bar.tsx` | 63 | icono de pestaña activa | `bg-tab-pill` | 3,0 ✔ (5,04/5,98) |
| `src/components/weight-chart.tsx` | 15 | `stroke` 2.5, `Circle r=3`, `Stop` del gradiente 20 %→0 (#46 R5) | `bg-surface` | 3,0 ✔ (6,04/6,79) |
| `src/components/pet-map.tsx` | 17 | `polylineColor` de la ruta | tiles del mapa | 3,0, no medible sobre tiles; se elige la tinta porque es la que sigue viva con `colorScheme` dark |
| `src/app/(tabs)/home.tsx` | 52 | `Moon`/`Wifi`/`WifiOff` (:179,181,183), `Map` (:308), `ChevronRight` (:312) | `bg-accent-soft`, `bg-default` | 3,0 ✔ |
| `src/app/(tabs)/food.tsx` | 30 | `ForkKnife` (:159), `Clock` (:195), `Sparkles` (:249) | `bg-surface-secondary`, `bg-surface` | 3,0 ✔ |
| `src/app/(tabs)/meal-schedule.tsx` | 30 | `Clock` (:209) | `bg-default` | 3,0 ✔ |

Se verificó uno a uno que **ningún consumidor imperativo de `accent` pinta
encima de `bg-accent`**: el único icono que sí lo hace,
`meal-schedule.tsx:185` `<ForkKnife color={accentForeground} />`, ya resuelve
`accent-foreground` y no cambia. Por eso R4 puede exigir el invariante fuerte
"cero `useThemeColors` pidiendo `'accent'` en `src/`", que es greppable.

`pet-map.test.tsx:31` mockea `useThemeColors: () => ['accent-color']` ignorando
los argumentos: cambiar el argumento no lo rompe.

### Sitios R1 — `text-accent-foreground` → `text-danger-foreground` (1)

`src/screens/reminders/index.tsx:341`, `Button.Label` del `Button`
`testID="reminders-delete-confirm"`. `className` resultante:
`"font-bold text-danger-foreground"`. Cero cambio visual hoy.
`reminders/index.test.tsx:160` afirma `'bg-danger'` en el `className` del
`Button`, no en el del `Button.Label`: sigue verde.

### Sitios R3 — quitar `opacity-70` / `opacity-80` (4)

La opacidad compone el texto contra el relleno y destruye el contraste que R2
acaba de ganar:

```
#FFFFFF al 70 % sobre #178255 -> #B9DACC -> 3,202:1   FALLA   (hoy 1,937)
#FFFFFF al 80 % sobre #178255 -> #D1E6DD -> 3,686:1   FALLA   (hoy 2,124)
```

| Archivo | Línea | `className` hoy | `className` después |
|---|---|---|---|
| `src/app/(tabs)/food.tsx` | 142 | `text-xs font-semibold uppercase tracking-widest text-accent-foreground opacity-70` | `text-xs font-semibold uppercase tracking-widest text-accent-foreground` |
| `src/app/(tabs)/food.tsx` | 153 | `font-semibold text-accent-foreground opacity-80` | `font-semibold text-accent-foreground` |
| `src/app/(tabs)/meal-schedule.tsx` | 174 | `text-xs font-semibold uppercase tracking-widest text-accent-foreground opacity-70` | `text-xs font-semibold uppercase tracking-widest text-accent-foreground` |
| `src/app/(tabs)/meal-schedule.tsx` | 180 | `font-semibold text-accent-foreground opacity-80` | `font-semibold text-accent-foreground` |

La jerarquía dentro de las cards de acento la siguen llevando el tamaño y el
peso (`text-xs` vs `text-3xl font-black`), como en el resto de la app. Los otros
tres nodos (`food.tsx:147`, `meal-schedule.tsx:177,186`) ya están a opacidad
plena y **no se tocan**.

### Sitios R5 — `text-warning` → `text-warning-strong` (3)

| Archivo | Línea | Contexto | Superficie |
|---|---|---|---|
| `src/app/(tabs)/health.tsx` | 142 | `Text` "Next due", `text-2xs font-semibold text-warning` | `bg-surface` |
| `src/screens/reminders/index.tsx` | 264 | badge "Upcoming!", `rounded-full bg-warning-soft px-2 py-0.5 text-2xs font-bold text-warning` | `bg-warning-soft` |
| `src/app/(tabs)/home.tsx` | 216 | `Text` `collar-battery`, rama `'font-semibold text-warning'` | `bg-default` |

`home.tsx:216` es una **ocurrencia añadida** a la evidencia del audit (el
hallazgo 2 solo citaba Health y Reminders): es `text-warning` como color de
texto sobre `bg-default`, **1,986:1**, mismo defecto y misma clase, y el
criterio de aceptación 2 dice "text-warning deja de usarse como color de texto
sobre esas superficies". Su rama hermana `'font-semibold text-success'` **no**
se toca (§3). `health.tsx:139` (`<Syringe color={warning} />`) y todos los
`bg-warning-soft` **no cambian**: el ámbar puro sigue siendo icono y relleno, y
`health.test.tsx:359-367` (que afirma `#F59E0B`/`#FBBF24` en el icono) sigue
verde porque `--warning` no cambia.

Igualmente, `map.tsx:284,295` y `food.tsx:213` son **ocurrencias añadidas** a la
evidencia del hallazgo 3, por la misma razón: el criterio de aceptación 2 cubre
`bg-surface` **y** `bg-default`, y arreglar dos de las tres superficies sería un
fix parcial.

### Sitios R10 — `hitSlop={TOUCH_SLOP}` (13 `Pressable`)

Filas de enlace: `health.tsx:246` (`weight-log-link`), `profile/index.tsx:279`
(`documents-link`), `profile/index.tsx:291` (`reminders-link`).

Chips (el `hitSlop` va en el `Pressable` de la receta; lo heredan todos los
chips que renderiza): `add-reminder/index.tsx:146` (`type-chip-*`),
`add-reminder/index.tsx:259` (`advance-chip-*`), `add-pet/index.tsx:55`
(`OptionalChip`, prop `testID`: `sex-*`, `size-*`, `sterilized-*`),
`add-pet/index.tsx:275` (`species-*`), `add-pet/index.tsx:345` (`age-mode-*`).

Botones de volver: `docs/index.tsx:63` (`docs-back`), `add-pet/index.tsx:228`
(`add-pet-back`), `add-reminder/index.tsx:120` (`add-reminder-back`),
`weight-log.tsx:130` (`weight-log-back`), `meal-schedule.tsx:126`
(`meal-schedule-back`).

### Sitio R11 — `src/app/(tabs)/map.tsx:279-325`

```tsx
<Card className="p-3">
  <View className="gap-2">
    <View className="flex-row gap-2">
      {/* tile stat-speed */}{/* tile stat-distance */}
    </View>
    <View className="flex-row gap-2">
      {/* tile stat-updated */}{/* tile stat-gps */}
    </View>
  </View>
</Card>
```

Los cuatro `Text` de valor añaden `numberOfLines={1}`.
`stat-speed`/`stat-distance` quedan en `text-base font-black text-accent-strong`
(por R4), `stat-updated`/`stat-gps` en `text-base font-black text-muted`. Las
cuatro etiquetas (`mt-1 text-2xs font-normal text-muted`) y el `className` de
cada tile no cambian.

---

## 5. Cambios exactos en `global.css` y archivos afectados

### 5.1 Registro de utilidades

Las utilidades `text-*` se generan desde claves `--color-*` en un bloque
`@theme`. heroui lo hace en
`node_modules/heroui-native/src/styles/theme.css:1` con
`@theme inline static { --color-accent: var(--accent); … }`, y por eso
`text-accent` funciona aunque `--accent` se defina en el `@variant` de
`global.css`. Los tokens nuevos no están ahí. Añadir **después** del bloque
`@theme { … }` que ya existe (que **no se toca**: `--radius-card: 20px` sigue
igual):

```css
@theme inline {
  --color-accent-strong: var(--accent-strong);
  --color-warning-strong: var(--warning-strong);
}
```

### 5.2 `@variant light`

```css
--muted: #667085;                         /* antes #6B7280 */
--accent: #178255;                        /* antes #2AB87C */
--accent-strong: #107148;                 /* NUEVO */
--warning-strong: #92610A;                /* NUEVO */
--tab-pill: rgba(23,130,85,0.14);         /* antes rgba(42,184,124,0.14) */
--color-accent: #178255;                  /* antes #2AB87C */
--color-accent-strong: #107148;           /* NUEVO (lo lee useThemeColors) */
--color-muted: #667085;                   /* antes #6B7280 */
--color-tab-pill: rgba(23,130,85,0.14);   /* antes rgba(42,184,124,0.14) */
--focus: #178255;                          /* antes #2AB87C */
```

`--accent-foreground` y `--color-accent-foreground` se quedan en `#FFFFFF`.

### 5.3 `@variant dark`

```css
--accent: #178255;                        /* antes #2AB87C */
--accent-strong: #2AB87C;                 /* NUEVO (= el acento de hoy) */
--warning-strong: #FBBF24;                /* NUEVO (= --warning de hoy) */
--tab-pill: rgba(23,130,85,0.22);         /* antes rgba(42,184,124,0.22) */
--color-accent: #178255;                  /* antes #2AB87C */
--color-accent-strong: #2AB87C;           /* NUEVO */
--color-tab-pill: rgba(23,130,85,0.22);   /* antes rgba(42,184,124,0.22) */
--focus: #178255;                          /* antes #2AB87C */
```

`--muted: #9CA3AF` y `--accent-foreground: #FFFFFF` **no se tocan**.

`--warning-strong` no lleva espejo `--color-warning-strong` en los `@variant`
porque **no** se consume de forma imperativa (solo como `className`); el espejo
se añadiría el día que lo pida un icono. `--accent-strong` sí lo lleva porque
seis llamadas a `useThemeColors` lo piden.

### 5.4 Tabla de verificación (los números que los tests deben afirmar)

| Token | Tema | Valor | Superficie | Ratio | Umbral | |
|---|---|---|---|---|---|---|
| `--accent` (relleno) | light | `#178255` | etiqueta `#FFFFFF` encima | **4,816** | 4,5 | ✔ |
| `--accent` (relleno) | dark | `#178255` | etiqueta `#FFFFFF` encima | **4,816** | 4,5 | ✔ |
| `--accent` (relleno) | light | `#178255` | `bg-background` `#FFFFFF` | 4,816 | 3,0 | ✔ |
| `--accent` (relleno) | dark | `#178255` | `bg-background` `#0D1117` | **3,930** | 3,0 | ✔ |
| `--accent` (relleno) | dark | `#178255` | `bg-surface` `#161B22` | 3,592 | 3,0 | ✔ |
| `--accent-strong` | light | `#107148` | `bg-surface` `#FFFFFF` | 6,039 | 4,5 | ✔ |
| `--accent-strong` | light | `#107148` | `bg-default` `#F5F6F8` | 5,584 | 4,5 | ✔ |
| `--accent-strong` | light | `#107148` | `bg-surface-secondary` `#F0FBF6` | 5,703 | 4,5 | ✔ |
| `--accent-strong` | light | `#107148` | `bg-accent-soft` `#DCECE6` | **4,941** | 4,5 | ✔ |
| `--accent-strong` | light | `#107148` | `bg-tab-pill` `#DFEEE7` | 5,038 | 4,5 | ✔ |
| `--accent-strong` | dark | `#2AB87C` | `bg-surface` `#161B22` | 6,792 | 4,5 | ✔ |
| `--accent-strong` | dark | `#2AB87C` | `bg-default` `#1F242B` | 6,128 | 4,5 | ✔ |
| `--accent-strong` | dark | `#2AB87C` | `bg-surface-secondary` `#12231B` | 6,432 | 4,5 | ✔ |
| `--accent-strong` | dark | `#2AB87C` | `bg-accent-soft` `#0E2220` | 6,501 | 4,5 | ✔ |
| `--accent-strong` | dark | `#2AB87C` | `bg-tab-pill` `#0F2A25` | 5,983 | 4,5 | ✔ |
| `--warning-strong` | light | `#92610A` | `bg-surface` `#FFFFFF` | 5,335 | 4,5 | ✔ |
| `--warning-strong` | light | `#92610A` | `bg-warning-soft` `#FEF0DA` | **4,748** | 4,5 | ✔ |
| `--warning-strong` | dark | `#FBBF24` | `bg-surface` `#161B22` | 10,362 | 4,5 | ✔ |
| `--warning-strong` | dark | `#FBBF24` | `bg-warning-soft` `#383422` | 7,477 | 4,5 | ✔ |
| `--muted` | light | `#667085` | `bg-default` `#F5F6F8` | **4,601** | 4,5 | ✔ |
| `--muted` | light | `#667085` | `bg-surface` `#FFFFFF` | 4,975 | 4,5 | ✔ |
| `--muted` | light | `#667085` | `bg-surface-secondary` `#F0FBF6` | 4,699 | 4,5 | ✔ |
| `--muted` | dark | `#9CA3AF` (sin cambio) | `bg-default` `#1F242B` | 6,148 | 4,5 | ✔ |

### 5.5 Archivos afectados

Todo vive en la capa de **presentación** de la app móvil. No toca `domain`,
`application` ni `infrastructure` de `docs/architecture.md`.

**Producción**

| Archivo | Qué cambia | R |
|---|---|---|
| `mobile-pet-tracker/src/theme/global.css` | acento, focus, tab-pill, muted light; tokens `accent-strong` y `warning-strong`; bloque `@theme inline` | R2, R4, R5, R6 |
| `mobile-pet-tracker/src/theme/touch-target.ts` | **Nuevo**. Exporta `TOUCH_SLOP` | R10 |
| `mobile-pet-tracker/src/components/floating-tab-bar.tsx` | `text-accent`→`text-accent-strong` (:191); `useThemeColors` (:63) | R4 |
| `mobile-pet-tracker/src/components/weight-chart.tsx` | `useThemeColors` (:15) | R4 |
| `mobile-pet-tracker/src/components/pet-map.tsx` | `useThemeColors` (:17) | R4 |
| `mobile-pet-tracker/src/app/(auth)/login.tsx` | raíz → `ScrollView`; 2 tintas | R4, R8 |
| `mobile-pet-tracker/src/app/(auth)/forgot.tsx` | raíz → `ScrollView`; 1 tinta | R4, R8 |
| `mobile-pet-tracker/src/app/(auth)/register.tsx` | `contentContainerStyle` + insets + `testID` | R7 |
| `mobile-pet-tracker/src/screens/reset-password/index.tsx` | 3 ramas → `ScrollView`; 2 tintas | R4, R8 |
| `mobile-pet-tracker/src/app/(tabs)/map.tsx` | overlay 2×2 + `numberOfLines`; 2 tintas | R4, R11 |
| `mobile-pet-tracker/src/app/(tabs)/health.tsx` | 1 warning; 1 tinta; `hitSlop` | R4, R5, R10 |
| `mobile-pet-tracker/src/app/(tabs)/home.tsx` | 1 warning; 1 tinta; `useThemeColors` | R4, R5 |
| `mobile-pet-tracker/src/app/(tabs)/food.tsx` | 2 `opacity-*`; 1 tinta; `useThemeColors` | R3, R4 |
| `mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx` | 2 `opacity-*`; `useThemeColors`; `hitSlop` | R3, R4, R10 |
| `mobile-pet-tracker/src/app/(tabs)/weight-log.tsx` | `hitSlop` | R10 |
| `mobile-pet-tracker/src/screens/profile/index.tsx` | label de sección; 1 tinta; `hitSlop` ×2 | R4, R9, R10 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | 1 `text-danger-foreground`; 1 warning | R1, R5 |
| `mobile-pet-tracker/src/screens/add-pet/index.tsx` | 1 tinta; `hitSlop` ×4 | R4, R10 |
| `mobile-pet-tracker/src/screens/add-reminder/index.tsx` | `hitSlop` ×3 | R10 |
| `mobile-pet-tracker/src/screens/docs/index.tsx` | `hitSlop` | R10 |
| `docs/ui-guidelines.md` | la línea de §7 | R2 |

**Tests**

| Archivo | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` | **Nuevo**. R1, R3, R4-uso, R5-uso |
| `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` | `describe` nuevos para R2, R4-token, R5-token, R6 **+ la excepción declarada E1** |
| `.../(auth)/__tests__/register.test.tsx` | `describe('#61 R7: …')` |
| `.../(auth)/__tests__/login.test.tsx`, `.../forgot.test.tsx`, `src/screens/reset-password/index.test.tsx` | `describe('#61 R8: …')` |
| `src/screens/profile/index.test.tsx` | `describe('#61 R9: …')` y `describe('#61 R10: …')` |
| `.../(tabs)/__tests__/health.test.tsx`, `.../weight-log.test.tsx`, `.../meal-schedule.test.tsx`, `src/screens/add-pet/index.test.tsx`, `.../add-reminder/index.test.tsx`, `.../docs/index.test.tsx` | `describe('#61 R10: …')` |
| `.../(tabs)/__tests__/map.test.tsx` | `describe('#61 R11: …')` |

---

## 6. Excepciones al invariante (declaradas, no descubiertas)

Solo hay **una**, y hay que firmarla en el gate. Con la reversión creció: ya no
son 2 literales sino **10, en 9 líneas**.

> **E1 — R2 y R6 obligan a editar 10 literales de color de un test
> preexistente**, `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts`.
> Todos son asserts de **valor de token** de #46 R1/R2 (la codificación de la
> paleta del Figma), **ninguno** es un assert de conducta. Esta feature
> **contradice explícitamente** esos valores concretos de #46 R1/R2 y lo dice
> aquí en vez de dejar que Codex lo descubra a mitad del handoff.

| Línea | Hoy | Después | Requisito |
|---|---|---|---|
| 75 | `muted: '#6B7280'` | `muted: '#667085'` | R6 |
| 78 | `accent: '#2AB87C'` | `accent: '#178255'` | R2 |
| 83 | `focus: '#2AB87C'` | `focus: '#178255'` | R2 |
| 95 | `['light', '#2AB87C', '#FFFFFF', '#6B7280', …]` | `['light', '#178255', '#FFFFFF', '#667085', …]` | R2 + R6 (2 literales) |
| 96 | `['dark', '#2AB87C', '#FFFFFF', '#9CA3AF', …]` | `['dark', '#178255', '#FFFFFF', '#9CA3AF', …]` | R2 |
| 125 | `accent: '#2AB87C'` (dark) | `accent: '#178255'` | R2 |
| 130 | `focus: '#2AB87C'` (dark) | `focus: '#178255'` | R2 |
| 137 | `'rgba(42,184,124,0.14)'` | `'rgba(23,130,85,0.14)'` | R2 |
| 138 | `'rgba(42,184,124,0.22)'` | `'rgba(23,130,85,0.22)'` | R2 |

Nada más de ese archivo se reescribe: los `describe` de #46 R1/R2 y su
estructura se conservan. `global-css.test.ts` es `.ts`, no `.tsx`, así que la
letra del criterio de aceptación 9 se cumple igualmente; se declara por su
espíritu, no por su letra.

Comprobaciones hechas que **no** produjeron excepción:

- Los tres tests de `(auth)` y el de `reset-password` no se anclan al árbol
  (§D6): R8 no rompe nada.
- `reminders/index.test.tsx:160` afirma `'bg-danger'` en el `className` del
  `Button`, no del `Button.Label`. R1 no lo toca.
- `card.test.tsx:20` afirma `'rounded-card bg-accent p-5 shadow-sm'`. R2 cambia
  el **valor** del token, no la clase: sigue verde.
- `pet-switcher.test.tsx:91` afirma `'border-accent'`. Sigue verde; R10 excluye
  pet-switcher.
- `pet-map.test.tsx:31` mockea `useThemeColors: () => ['accent-color']`
  ignorando los argumentos. R4 no lo rompe.
- `floating-tab-bar.test.tsx` afirma `intensity`, `blurMethod`, `tint` y
  `bg-glass-surface`; ningún color de acento. Sigue verde.
- `map.test.tsx:558` afirma el `style` del `View` `map-stats`. R11 no lo toca.
- `food.test.tsx:161-171` y `meal-schedule.test.tsx:185-200` solo afirman
  dimensiones de `Skeleton`. R3 no las toca.
- `health.test.tsx:359-367` afirma `#F59E0B`/`#FBBF24` en el icono. `--warning`
  no cambia; sigue verde.
- `health.test.tsx:75` **mockea** `useThemeColors('muted')` como `'#6B7280'`
  pero no lo asevera. Queda desactualizado tras R6 y **no se toca**: tocarlo sí
  sería editar un `.test.tsx` preexistente sin necesidad. Anotado como higiene
  para #62.
- `use-theme-colors.test.tsx` solo usa `warning`. Sigue verde.
- `design-drift.test.ts` (C8, clases arbitrarias): ninguna propuesta introduce
  `[...]`; sigue verde.

---

## 7. Línea propuesta para `docs/ui-guidelines.md`

R2 la añade al final de §Decisiones fijas de este repo, como punto **11**. El
humano puede cambiar la redacción en el gate; lo que no es negociable es que la
desviación quede escrita en la carta y no solo en esta spec.

> 11. **Desviación declarada del Figma en el acento** (feature #61,
>     2026-09-03). `--accent` vale **`#178255`**, no el `#2AB87C` que #46 R1
>     tomó del Make. El verde del diseño da 2,55:1 con etiqueta blanca encima y
>     no hay forma de pasar AA conservándolo: o se oscurece el relleno o se
>     oscurece la letra, y el humano eligió lo primero para que el CTA siga
>     siendo verde con letra blanca. Se conserva el hue (154,7°, el mismo del
>     Make) y se baja la luminancia hasta **4,82:1** con blanco. Consecuencia
>     asumida: los rellenos ya **no** coinciden 1:1 con el Make y el smoke lado
>     a lado lo verá; es esperado, no un defecto. El acento como **tinta**
>     (texto, enlaces, iconos, trazos) es `--accent-strong`, que en dark
>     recupera el `#2AB87C` original porque sobre fondo oscuro un verde oscuro
>     es ilegible. Regla mecánica: **fondo ⇒ `--accent`; encima de otra cosa ⇒
>     `--accent-strong`.**

---

## 8. Alternativas descartadas

- **Conservar `--accent: #2AB87C` y oscurecer la etiqueta** (token
  `--accent-contrast: #0B402A`, 4,630:1): era la vía de la primera versión de
  esta spec. **Descartada por el humano el 2026-09-03** tras leerla en draft:
  cambiaba el aspecto de los 17 CTA de blanco a verde muy oscuro. No queda
  rastro del token en la spec.
- **`#148554`** (la referencia que dio el humano): válida (4,653:1, hue
  153,98°) pero estrecha la distancia perceptual con `--success` de 9,16 a
  **7,95** y deja menos margen de blanco. `#178255` gana en las dos (§3).
- **Verdes más oscuros** (`#167A50` blanco 5,338; `#227552` blanco 5,623):
  mejor contraste de texto, pero el botón se funde con el fondo en dark
  (3,55 y 3,37 contra `#0D1117`) y se alejan mucho más del Make.
- **Un solo token de acento para relleno y tinta**: imposible en dark, se
  demuestra con los dos presupuestos de luminancia en §D2.
- **Partir `--accent` por tema** (light oscuro, dark `#2AB87C`): dejaría la
  etiqueta blanca en 2,547:1 sobre el botón en dark, que es exactamente el
  fallo que la feature arregla.
- **Mover `--success`**: la distancia ΔE00 no empeora (9,16 → 9,24) y los dos
  colores nunca comparten rol ni forma (§3). Mover un token de estado semántico
  sin un hallazgo que lo pida sería alcance inventado.
- **`text-accent-soft-foreground` / `text-warning-soft-foreground`** (los
  derivados que heroui ya expone, sin token nuevo): 3,68:1 y 3,92:1, no llegan
  a AA, y su hex exacto lo calcula heroui con `color-mix(in oklab, …)`, así que
  no es aserible leyendo `global.css`. Un requisito no verificable no es un
  requisito.
- **`#B45309` para `--warning-strong`** (propuesta del audit): 4,469:1 sobre
  `warning-soft`. Falla por 0,03, el mismo error que esta feature arregla en
  `--muted`.
- **Padding en vez de `hitSlop`** para los 44 pt: agranda la superficie pintada
  y viola el criterio de aceptación 6 (§D5).
- **`flex-wrap` + `basis-1/2` o `w-[48%]`** para el overlay del mapa: clase
  arbitraria (rompe C8) o desbordamiento por el `gap` (§D4).
- **`adjustsFontSizeToFit` + `text-sm`** en el overlay: con 2×2 sobran 57 pt de
  margen; encoger la fuente cambiaría la tipografía del diseño para tapar un
  problema de ancho que ya no existe (§D4).
- **Extraer un componente `SectionLabel`** para el label de sección de R9: es
  consistencia visual, o sea **#62**.

---

## 9. Hallazgo 18 (`--radius-card`): fuera, con nota para el smoke

Decisión humana del 2026-09-03: **no se reabre**. Los 20 px ya pasaron el smoke
lado a lado con el Figma. La lectura del audit (que las cards del Make usan
`rounded-2xl`, que en Tailwind v4 cae al default de 16 px porque
`design-src/theme.css:108-111` no remapea `--radius-2xl`) queda **anotada como
punto a comparar en el próximo smoke, al mismo tamaño físico** — el `PhoneFrame`
del Make mide 260 × 530 px y un valor absoluto copiado 1:1 renderiza ~1,5 ×
más pequeño en proporción sobre un teléfono de 390 dp, lo que tira hacia radios
mayores. Nada de esta feature toca `--radius-card`.

---

## 10. Historial de la decisión de contraste

| Fecha | Decisión | Estado |
|---|---|---|
| 2026-09-03 (mañana) | Relleno `#2AB87C` intacto + token de texto oscuro sobre acento (`--accent-contrast`) | **Descartada** por el humano tras leer la spec en draft |
| 2026-09-03 (tarde) | **Oscurecer el acento a `#178255`, etiqueta blanca**; tinta en `--accent-strong` | **Vigente** |

Se deja constancia para que la próxima auditoría no proponga volver al
`#2AB87C` como si fuese un descuido.

---

## 11. Orden de implementación (obligatorio)

1. **R1** — hallazgo 21. Cero cambio visual; deja el árbol sin tokens del
   acento fuera de superficies de acento antes de que R2 mueva el acento.
2. **R2** — el acento nuevo, `--focus`, `--tab-pill` y la línea de la carta.
   Aquí es donde la app cambia de aspecto; conviene un commit propio.
3. **R3** — quitar la opacidad de los 4 nodos sobre `bg-accent`.
4. **R4** — token de tinta y sus 13 `className` + 6 imperativos.
5. **R5**, **R6** — ámbar y gris. Independientes de todo lo anterior.
6. **R7**, **R8** — safe areas y scroll.
7. **R9**, **R10**, **R11** — regresión, tap targets y overlay.
8. **R12** — gate mecánico del reviewer sobre el árbol completo.

Cada uno con su ciclo TDD completo (ver [[tasks]]): commit rojo que nombra el
R-id, commit verde, commit de refactor si hace falta. C4 de
[[../../CHECKPOINTS|CHECKPOINTS]] exige el historial rojo→verde; en #19 se
entregó todo en un solo commit y eso **no** se repite aquí.
