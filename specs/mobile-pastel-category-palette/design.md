---
feature: "mobile-pastel-category-palette"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-pastel-category-palette]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI: §Dirección de arte 1
> es la regla que origina esta feature, §Decisiones fijas 1-3 la que la limita)
> y [[../../docs/conventions|conventions]] §Convenciones de la app móvil.
>
> Este documento es la fuente **autosuficiente** para Codex CLI: rutas exactas,
> nombres de símbolos exactos, hex exactos y clases exactas. **No queda ninguna
> decisión abierta.** Todo número de contraste y de distancia perceptual está
> **calculado**, no estimado; el método es el mismo de #61 y se reproduce en §1.
>
> Esta feature no toca ninguna capa de `docs/architecture.md`: es UI pura sobre
> `mobile-pet-tracker/`, sin dominio, sin aplicación, sin infraestructura, sin
> red.

---

## 1. Método de cálculo (reproducible)

Idéntico al de `specs/mobile-ui-legibility-polish/design.md` §1, para que los
números de esta spec y los de #61 se puedan comparar directamente.

**Contraste** — WCAG 2.1, luminancia relativa sRGB:

```
c' = c/255
c_lin = c'/12.92                     si c' <= 0,04045
c_lin = ((c' + 0,055)/1,055)^2,4     en otro caso
L = 0,2126·R_lin + 0,7152·G_lin + 0,0722·B_lin
ratio = (L_claro + 0,05) / (L_oscuro + 0,05)
```

**Distancia perceptual** — CIEDE2000 (ΔE00) sobre CIE-Lab D65. ΔE00 ≈ **2,3** es
el umbral de apenas-perceptible; es la métrica correcta para "¿se confunden dos
colores?" y la que ya usó #61 §1. No se decide con ΔE76.

**Tono** — HSL, calculado, no supuesto.

**Composición de los `*-soft`** — heroui los deriva como
`color-mix(in oklab, var(--X) 15%, transparent)`
(`node_modules/heroui-native/src/styles/theme.css:83-85`), es decir el color al
15 % de alfa: se componen sobre la superficie de detrás antes de medir. Los
valores compuestos ya publicados por #61 §5.4 y codificados en
`src/theme/__tests__/global-css.test.ts:231-234` se reusan tal cual:
claro `accent-soft #DCECE6`, `tab-pill #DFEEE7`, `warning-soft #FEF0DA`;
oscuro `accent-soft #0E2220`, `tab-pill #0F2A25`, `warning-soft #383422`.

**Verificación del ancla**: `#FFFFFF` sobre `#2AB87C` da **2,547:1** con esta
implementación, que reproduce el 2,546:1 verificado dos veces por el humano en
#61. `#FFFFFF` sobre `#178255` da **4,816:1**, que reproduce el valor publicado
de #61 R2. El aparato de cálculo de esta spec es, por tanto, el mismo.

**Umbral**: **4,5:1** para texto normal (AA). El badge del tipo de documento es
`text-2xs` (10 px) `font-bold`, muy por debajo del corte de texto grande
(18,66 px bold), así que el 3,0:1 **no** aplica en ningún caso de esta spec.

### 1.1 Por qué NO se exige 3,0:1 entre la superficie pastel y la card

WCAG 1.4.11 pide 3,0:1 a los componentes no textuales **cuyo color transporta
información**. Una superficie pastel al 96 % de claridad nunca dará 3,0:1 contra
un blanco — eso es lo que significa "pastel", y el diseño del Make asume lo
mismo. La salida no es subir el contraste hasta dejar de ser pastel: es que el
color **no sea el portador**. Por R7 y R8, cada sitio que usa un token
categórico muestra además el emoji del tipo y su texto, así que se cumple WCAG
1.4.1 (Use of Color) y 1.4.11 no aplica al relleno. Lo que sí se exige, y se
calcula, es el 4,5:1 del **texto encima** del pastel (§3.1) y la separación
perceptual entre pasteles (§3.2).

---

## 2. Cuántas categorías hay de verdad (contadas en el código, no en el mock)

### 2.1 Tipos de recordatorio: **siete**, cerrados

`mobile-pet-tracker/src/api/types.ts:192-199` declara `ReminderType` como unión
de siete literales, y `mobile-pet-tracker/src/utils/reminder-meta.ts:6-14` los
cubre los siete: `vaccine`, `deworming`, `medication`, `appointment`, `weight`,
`food`, `custom`. Es un conjunto **cerrado**: `REMINDER_TYPE_META` está tipado
`Record<ReminderType, …>`, así que TypeScript obliga a cubrir cualquier tipo
nuevo.

### 2.2 Tipos de documento: **abiertos**, texto libre

Éste es el hallazgo que cambia el diseño del mapeo. El tipo de documento **no es
un enum**:

- `mobile-pet-tracker/src/api/media.ts:5` — `type: string`.
- `backend-pet-tracker/src/modules/media/application/dto/create-pet-document.dto.ts:5`
  — `type: z.string().trim().min(1).max(40)`.
- `backend-pet-tracker/src/modules/media/domain/entities/pet-document.entity.ts:4`
  — `type: string`.

No hay `z.enum`, ni `IsIn`, ni constante compartida. El usuario puede crear un
documento con el tipo que quiera, hasta 40 caracteres. El diseño del Make usa
cuatro (`App.tsx:840-844`): "Vacunación", "Consulta", "Desparasitación",
"Análisis"; el fixture del test de la app usa "Vacunación"
(`src/screens/docs/index.test.tsx:193`).

**Consecuencia de diseño**: el mapeo de documentos **no puede** ser exhaustivo.
Es una tabla de tipos conocidos con **respaldo obligatorio** a `neutral`, y ese
respaldo no es un parche: un tipo que el usuario acaba de inventar genuinamente
no tiene categoría, y `neutral` es exactamente lo que la fila muestra hoy.

### 2.3 Cuántos colores hay en el Make: **cinco**, no siete

Barrido completo de hex pastel sobre `specs/mobile-figma-polish/design-src/App.tsx`:

| Hex | Apariciones | Rol en el Make |
|---|---|---|
| `#EFF6FF` | 840, 841, 907, 911, 979 | azul — Vacuna / Vacunación |
| `#EEF4FF` | 399 | azul del tile "Mapa" |
| `#FFFBEB` | 736, 843, 908, 934, 980, 1503 | ámbar — Medicamento / Desparasitación |
| `#FFF7ED` | 400, 435 | ámbar del tile "Actividad" |
| `#F0FBF6` | 188, 402, 631, 695, 842, 888, 909, 933, 981, 1067, 1175, 1182, 1199, 1227, 1243, 1286, 1478, 1495, 1610 | verde — Consulta, y acento en general |
| `#F5F3FF` | 737, 844, 910, 982 | violeta — Análisis / Baño / Geocercas |
| `#FFF0F3` | 401 | rosa del tile "Vacunas" |
| `#F5F6F8` | 935, 983 | neutral — "Otro" / "Inactivos" |

Los pares "duplicados" no son dos roles:

- `#EFF6FF` contra `#EEF4FF`: **ΔE00 1,24**, por debajo del umbral de 2,3. Son
  el mismo azul; el segundo es ruido del mock. Se colapsan en uno.
- `#FFFBEB` contra `#FFF7ED`: **ΔE00 3,78**. Perceptiblemente distintos pero
  ambos "ámbar pálido": no son dos categorías, son dos matices del mismo rol.
  Se colapsan en uno, y §3.3 explica cuál se elige y por qué.

Quedan por tanto **cinco tonos** más el neutral: azul, ámbar, verde, violeta,
rosa, neutral. **Seis huecos para siete tipos de recordatorio.**

### 2.4 Cómo se reparten (la decisión, y por qué)

| Tipo | Hueco | Justificación |
|---|---|---|
| `vaccine` | `blue` | El Make lo dice literalmente: "Vacuna" = `#EFF6FF`/`#60A5FA` (`App.tsx:907`, `:979`) |
| `medication` | `amber` | El Make: "Medicamento" = `#FFFBEB`/`#F59E0B` (`App.tsx:908`, `:980`) |
| `appointment` | `green` | El Make: "Consulta" = `#F0FBF6`/`#2AB87C` (`App.tsx:909`, `:981`) |
| `deworming` | `violet` | El Make le da ámbar (`App.tsx:843`), pero ese hueco ya lo ocupa `medication`, que es el uso canónico de la lista de alta de recordatorio. Violeta es el otro tono "clínico" del Make (Análisis, `App.tsx:844`) |
| `food` | `rose` | Rosa es el único pastel del Make sin anclaje semántico (solo el tile "Vacunas", `App.tsx:401`, que es de #71 y va por destino, no por tipo). Es además el único tono cálido libre, y comida es la única categoría cálida restante |
| `weight` | `neutral` | El Make nunca colorea el peso como categoría |
| `custom` | `neutral` | El Make: "Otro" = `#F5F6F8`/`#6B7280` (`App.tsx:983`) — el neutral es literalmente el color del cajón residual |

**La colisión `weight` + `custom` es deliberada.** Alternativa descartada en §6.

Para documentos, la tabla de §4.2 sigue al Make uno a uno (Vacunación→azul,
Consulta→verde, Desparasitación→ámbar, Análisis→violeta) porque ahí no hay
colisión: los documentos no tienen un tipo "medicamento" que compita por el
ámbar.

---

## 3. Los valores, calculados

### 3.0 Presupuesto: las tintas del Make no sirven, igual que en #61

Las cuatro tintas que el Make pone encima de sus pasteles fallan AA todas, y por
mucho:

| Tinta del Make | Sobre su pastel | Ratio | AA |
|---|---|---|---|
| `#60A5FA` | `#EFF6FF` | **2,336** | ✗ |
| `#F59E0B` | `#FFFBEB` | **2,071** | ✗ |
| `#2AB87C` | `#F0FBF6` | **2,405** | ✗ |
| `#A78BFA` | `#F5F3FF` | **2,481** | ✗ |
| `#6B7280` | `#F5F6F8` | **4,471** | ✗ (falla por 0,029) |

Es exactamente el patrón que #61 encontró con el acento (2,547:1) y el mismo que
#61 R6 encontró con el gris (4,471:1 → `#667085`, 4,601:1). **Se conserva el
pastel del Make y se oscurece la tinta**, que es la vía inversa a la que el
humano eligió para el acento en #61 — y aquí es la correcta, porque el pastel
*es* la aportación del diseño y la tinta es un valor que el Make ni siquiera
usa como texto en la mayoría de estos sitios.

Regla de derivación de cada tinta clara: **se conservan hue y saturación HSL de
la tinta del Make y se baja la luminancia HSL hasta cruzar 4,70:1** sobre su
propio pastel. El suelo es 4,70 y no 4,50 para no dejar ningún valor clavado en
el umbral, mismo criterio con el que #61 eligió `#178255` (4,816 con margen
+0,316).

### 3.1 Tabla final de tokens y contrastes

**Tema claro** — superficies exactamente las del Make; tintas derivadas.

| Hueco | Superficie | Tinta | Tinta sobre su superficie | Tinta sobre `#FFFFFF` | Hue Make → nuevo |
|---|---|---|---|---|---|
| `blue` | `#EFF6FF` | `#0768E0` | **4,746** ✔ | 5,165 | 213,12° → 213,18° (Δ 0,06°) |
| `amber` | `#FFF7ED` | `#A55E07` | **4,705** ✔ | 4,995 | 33,33° → 33,04° (Δ 0,29°) |
| `green` | `#F0FBF6` | `#107148` | **5,703** ✔ | 6,039 | 154,65° → 154,64° (Δ 0,01°) |
| `violet` | `#F5F3FF` | `#7549F7` | **4,725** ✔ | 5,182 | 255,14° → 255,17° (Δ 0,03°) |
| `rose` | `#FFF0F3` | `#D80B34` | **4,732** ✔ | 5,227 | 348,00° → 348,00° (Δ 0,00°) |
| `neutral` | `#F5F6F8` (`--default`) | `#667085` (`--muted`) | **4,601** ✔ | 5,196 | — (de #61 R6) |

**Tema oscuro** — diseñado, no copiado: el Make no trae tema oscuro.

Regla de derivación del oscuro, en dos pasos:

1. **Superficie**: hue de la familia, y saturación/luminancia HSL buscadas de
   modo que la **luminancia relativa** sea exactamente la de
   `--surface-secondary` oscuro (`#12231B`, L = 0,0141) — la superficie tintada
   oscura que #46 ya diseñó y que pasó el smoke lado a lado —, con la
   restricción de separarse ΔE00 ≥ 5,0 de `--surface` (`#161B22`) y de
   `--default` (`#1F242B`). Esa restricción es la que impide copiar el tono del
   pastel claro: los neutros oscuros del repo son **azulados** (hue ≈ 215°), así
   que un azul categórico ingenuo desaparece sobre la card.
2. **Tinta**: hue de la familia, saturación 0,70, luminancia HSL subida hasta
   pasar 4,55:1 sobre **las cuatro** superficies oscuras posibles (la propia,
   `--default`, `--surface` y `--background`), no solo la propia.

| Hueco | Superficie | L rel. | Tinta | Sobre su superficie | Sobre `--default` | Sobre `--surface` |
|---|---|---|---|---|---|---|
| `blue` | `#0B203A` | 0,0141 | `#4A8DDF` | **4,810** ✔ | 4,583 ✔ | 5,080 ✔ |
| `amber` | `#271E14` | 0,0141 | `#C17B22` | **4,776** ✔ | 4,551 ✔ | 5,044 ✔ |
| `green` | `#12231B` | 0,0141 | `#2AB87C` | **6,432** ✔ | 6,128 ✔ | 6,792 ✔ |
| `violet` | `#221C33` | 0,0141 | `#9579E7` | **4,811** ✔ | 4,583 ✔ | 5,080 ✔ |
| `rose` | `#39131A` | 0,0141 | `#E35E78` | **4,788** ✔ | 4,562 ✔ | 5,056 ✔ |
| `neutral` | `#1F242B` (`--default`) | 0,0173 | `#9CA3AF` (`--muted`) | **6,148** ✔ | — | 6,792 ✔ |

Las cinco superficies oscuras comparten L = 0,0141 **por construcción**: es la
propiedad que hace que las cinco categorías pesen lo mismo sobre la card, y es
comprobable con un test (R2).

### 3.2 Que no se confundan entre sí — ΔE00 superficie contra superficie

**Tema claro** (umbral 2,3):

| | amber | green | violet | rose | neutral |
|---|---|---|---|---|---|
| **blue** | 9,9 | 7,6 | 4,9 | 9,9 | **3,7** |
| **amber** | — | 8,5 | 10,5 | 8,0 | 6,3 |
| **green** | | — | 11,1 | 14,1 | 6,3 |
| **violet** | | | — | 6,2 | 5,2 |
| **rose** | | | | — | 7,2 |

Mínimo **3,7** (azul contra neutral), 1,6× el umbral. Es el riesgo declarado en
[[requirements]] §Riesgo conocido.

**Tema oscuro**:

| | amber | green | violet | rose | neutral |
|---|---|---|---|---|---|
| **blue** | 20,7 | 20,3 | 9,7 | 23,4 | **9,3** |
| **amber** | — | 15,5 | 19,0 | 16,6 | 12,4 |
| **green** | | — | 22,9 | 33,3 | 12,9 |
| **violet** | | | — | 15,3 | 11,7 |
| **rose** | | | | — | 20,5 |

Mínimo **9,3**: el oscuro separa mucho mejor que el claro, porque el paso 1 de
§3.1 impuso ΔE00 ≥ 5,0 contra los neutros y eso empujó las cinco superficies a
tonos bien distintos.

### 3.3 Que no se confundan con los tokens de estado

ΔE00 mínimo de cada superficie categórica contra **todas** las superficies de
estado compuestas (`accent-soft`, `tab-pill`, `warning-soft`, `danger-soft`,
`success-soft`), en los dos temas:

| Hueco | mín. claro | contra | mín. oscuro | contra |
|---|---|---|---|---|
| `blue` | 9,4 | `accent-soft` | 16,1 | `accent-soft` |
| `amber` | **4,9** | `warning-soft` | 8,9 | `warning-soft` |
| `green` | **3,5** | `tab-pill` | **3,6** | `accent-soft` |
| `violet` | 10,2 | `danger-soft` | 10,2 | `danger-soft` |
| `rose` | **4,6** | `danger-soft` | 9,8 | `danger-soft` |
| `neutral` | 8,5 | `tab-pill` | 9,6 | `accent-soft` |

Y las tintas contra las tintas de estado:

| Par | ΔE00 claro | ΔE00 oscuro |
|---|---|---|
| tinta `amber` contra `--warning-strong` | 6,3 | 21,0 |
| tinta `rose` contra `--danger` | 9,6 | 9,2 |
| tinta `green` contra `--accent-strong` | **0,0** (deliberado) | **0,0** (deliberado) |
| tinta `green` contra `--success` | 15,4 | 7,2 |
| tinta `blue` contra `--muted` | 16,1 | 18,8 |
| tinta `violet` contra `--muted` | 18,9 | 17,9 |

**Mínimo absoluto de toda la paleta: 3,5** (verde categórico contra `--tab-pill`
en claro), 1,5× el umbral. No es accidente: es la consecuencia directa de la
decisión de que la familia verde **sea** la familia del acento (§3.4).

Los dos casos que merecen una frase, no solo un número:

- **Ámbar categórico contra ámbar de aviso** (ΔE00 4,9 en superficie, 6,3 en
  tinta, en claro). Es el único par que **coexiste en pantalla**: en la fila de
  recordatorio, un `medication` próximo a vencer muestra el tile ámbar de
  categoría y, a su lado, el badge `bg-warning-soft` de "Upcoming!". Por eso
  (a) se elige el ámbar **anaranjado** del Make (`#FFF7ED`, hue 33°) y no el
  amarillento (`#FFFBEB`, hue 48°), que es el que está más cerca de
  `warning-soft`, y (b) la etiqueta del tipo **no** se convierte en badge de
  color ([[requirements]] §Fuera de alcance 4), de modo que las dos cápsulas
  ámbar nunca aparecen juntas: lo que coexiste es un cuadrado de 44 px con un
  emoji y una cápsula de texto, formas distintas en posiciones distintas.
- **Rosa categórico contra rojo de peligro** (ΔE00 4,6 en superficie). No
  coexisten: `text-danger` solo aparece en `reminders-error` y
  `reminders-action-error`, que son estados de fallo de pantalla completa, nunca
  dentro de una fila.

### 3.4 Por qué la familia verde no estrena valores

`--surface-secondary` vale ya `#F0FBF6` en claro (idéntico al verde pastel del
Make) y `#12231B` en oscuro; `--accent-strong` vale `#107148` en claro y
`#2AB87C` en oscuro, y **#61 R4 ya demostró con test que `accent-strong` pasa AA
sobre `surface-secondary` en los dos temas**. Declarar un segundo verde a 3-4
ΔE00 del primero sería crear exactamente la confusión que esta feature existe
para evitar. Los tokens `--color-category-green*` se declaran con esos mismos
hex y un test los ata a sus originales (R1, R2) para que no se separen nunca.

Esto **no** crea confusión con un token de estado: `--accent` es la **marca**,
no un estado. En el Make, "Consulta" está pintada literalmente con el verde de
marca (`App.tsx:909`), así que la coincidencia es fidelidad al diseño, no
descuido.

---

## 4. Qué se escribe, exactamente

### 4.1 `mobile-pet-tracker/src/theme/global.css`

**Diez líneas nuevas en el bloque de tema claro**, insertadas dentro de
`@variant light { … }` (hoy líneas 25-61), inmediatamente después de
`--color-success: #0F9B5A;` (hoy línea 54) y antes de `--focus: #178255;`
(hoy línea 55):

```css
      --color-category-blue: #EFF6FF;
      --color-category-blue-strong: #0768E0;
      --color-category-amber: #FFF7ED;
      --color-category-amber-strong: #A55E07;
      --color-category-green: #F0FBF6;
      --color-category-green-strong: #107148;
      --color-category-violet: #F5F3FF;
      --color-category-violet-strong: #7549F7;
      --color-category-rose: #FFF0F3;
      --color-category-rose-strong: #D80B34;
```

**Diez líneas nuevas en el bloque de tema oscuro**, dentro de
`@variant dark { … }` (hoy líneas 63-99), en la posición equivalente:
inmediatamente después de `--color-success: #34D399;` (hoy línea 92) y antes de
`--focus: #178255;` (hoy línea 93):

```css
      --color-category-blue: #0B203A;
      --color-category-blue-strong: #4A8DDF;
      --color-category-amber: #271E14;
      --color-category-amber-strong: #C17B22;
      --color-category-green: #12231B;
      --color-category-green-strong: #2AB87C;
      --color-category-violet: #221C33;
      --color-category-violet-strong: #9579E7;
      --color-category-rose: #39131A;
      --color-category-rose-strong: #E35E78;
```

Nada más cambia en el archivo. En concreto:

- **Solo la forma `--color-*`**, sin gemelo sin prefijo. El gemelo
  (`--tab-pill` junto a `--color-tab-pill`) existe únicamente en tokens que
  heroui-native consume por su nombre propio; heroui no conoce la paleta
  categórica. `--color-<nombre>` es lo que genera las utilidades
  `bg-<nombre>` / `text-<nombre>` en uniwind y lo primero que lee
  `useThemeColors` (`src/theme/use-theme-colors.ts:23`), así que basta.
- **No se toca el bloque `@theme inline`**: solo hace falta para tokens que se
  declaran sin el prefijo `--color-` y necesitan espejo; aquí se declaran ya
  prefijados.
- **No se toca el bloque `@theme`** (fuentes, `--radius-card`, `--text-2xs`).
- **Convención de nombres**: `-strong` es el sufijo que este repo ya usa para
  "la variante de este tono que pasa AA como tinta" (`--accent-strong` de #61
  R4, `--warning-strong` de #61 R5). La paleta categórica lo hereda en vez de
  inventar `-ink`, `-fg` o `-text`.

### 4.2 `mobile-pet-tracker/src/utils/category-palette.ts` — **archivo nuevo**

Único sitio del repo donde se escriben los nombres de clase de la paleta. El
contenido exacto que la implementación debe producir:

```ts
/**
 * Paleta pastel categórica (#64). Los valores viven en src/theme/global.css;
 * aquí solo vive el reparto categoría → hueco y el nombre de clase.
 *
 * Los nombres de clase se escriben ENTEROS y como literales: el escáner de
 * utilidades de Tailwind solo genera las clases que ve escritas, así que
 * `bg-category-${slot}` produciría estilo vacío en tiempo de ejecución.
 */
export type CategorySlot =
  | 'blue'
  | 'amber'
  | 'green'
  | 'violet'
  | 'rose'
  | 'neutral';

export const CATEGORY_SLOTS: Record<
  CategorySlot,
  { surface: string; ink: string }
> = {
  blue: { surface: 'bg-category-blue', ink: 'text-category-blue-strong' },
  amber: { surface: 'bg-category-amber', ink: 'text-category-amber-strong' },
  green: { surface: 'bg-category-green', ink: 'text-category-green-strong' },
  violet: { surface: 'bg-category-violet', ink: 'text-category-violet-strong' },
  rose: { surface: 'bg-category-rose', ink: 'text-category-rose-strong' },
  neutral: { surface: 'bg-default', ink: 'text-muted' },
};

/**
 * El tipo de documento es texto libre en el contrato del backend
 * (create-pet-document.dto.ts: z.string().trim().min(1).max(40)), no un enum:
 * la tabla cubre los tipos que el diseño nombra, en los dos idiomas en que
 * pueden llegar por API, y todo lo demás cae en `neutral`.
 */
const DOCUMENT_TYPE_SLOTS: Record<string, CategorySlot> = {
  'vacunación': 'blue',
  'vacunacion': 'blue',
  'vacuna': 'blue',
  'vaccination': 'blue',
  'vaccine': 'blue',
  'consulta': 'green',
  'consultation': 'green',
  'checkup': 'green',
  'desparasitación': 'amber',
  'desparasitacion': 'amber',
  'deworming': 'amber',
  'análisis': 'violet',
  'analisis': 'violet',
  'analysis': 'violet',
  'lab': 'violet',
};

export function documentCategory(type: string): CategorySlot {
  return DOCUMENT_TYPE_SLOTS[type.trim().toLowerCase()] ?? 'neutral';
}
```

Por qué la normalización es solo `trim().toLowerCase()` y la tabla lista las dos
grafías (con y sin tilde) en vez de usar `normalize('NFD')`: `String.prototype.normalize`
y los escapes de propiedad Unicode no están garantizados en Hermes en la versión
que corre este proyecto, y catorce claves literales son más baratas y más
predecibles que un polyfill.

Por qué `documentCategory` vive aquí y no en un `document-meta.ts` propio: no
hay ninguna otra metadata de documento (la fila usa el emoji fijo `📄` y no
tiene etiqueta traducida), así que un archivo entero para una tabla sería un
archivo por sí mismo.

### 4.3 `mobile-pet-tracker/src/utils/reminder-meta.ts` — se amplía

`REMINDER_TYPE_META` gana un tercer campo, `category`, y el tipo del `Record`
pasa a incluirlo. `label` y `emoji` no se tocan.

```ts
import type { ReminderType } from '../api/types';
import type { CategorySlot } from './category-palette';

export const REMINDER_TYPE_META: Record<
  ReminderType,
  { label: string; emoji: string; category: CategorySlot }
> = {
  vaccine: { label: 'Vaccine', emoji: '💉', category: 'blue' },
  deworming: { label: 'Deworming', emoji: '🪱', category: 'violet' },
  medication: { label: 'Medication', emoji: '💊', category: 'amber' },
  appointment: { label: 'Appointment', emoji: '🩺', category: 'green' },
  weight: { label: 'Weight', emoji: '⚖️', category: 'neutral' },
  food: { label: 'Food', emoji: '🍖', category: 'rose' },
  custom: { label: 'Other', emoji: '📌', category: 'neutral' },
};
```

Al estar tipado `Record<ReminderType, …>`, un octavo tipo de recordatorio en el
futuro **no compila** hasta que se le asigne hueco. Es la garantía barata de que
la paleta no se queda atrás.

### 4.4 `mobile-pet-tracker/src/screens/reminders/index.tsx` — un `className`

Import nuevo: `import { CATEGORY_SLOTS } from '../../utils/category-palette';`
(junto al `REMINDER_TYPE_META` que ya se importa en `:29`).

Línea `270`:

| | |
|---|---|
| Hoy | `className="size-11 items-center justify-center rounded-xl bg-accent-soft"` |
| Después | ``className={`size-11 items-center justify-center rounded-xl ${CATEGORY_SLOTS[meta.category].surface}`}`` |

`meta` ya está en alcance (`:259`, `const meta = REMINDER_TYPE_META[reminder.type];`).
El `style={CONTINUOUS_CORNER}` de `:271`, el emoji de `:273` y la etiqueta de
`:278` no se tocan. **Ningún otro `bg-accent-soft` de este archivo cambia**: el
de `:198` es la píldora de resumen `pill-active`, que es estado, no categoría.

### 4.5 `mobile-pet-tracker/src/screens/docs/index.tsx` — dos `className`

Imports nuevos:
`import { CATEGORY_SLOTS, documentCategory } from '../../utils/category-palette';`

Dentro de `DocumentRow` (`:17`), antes del `return`:

```ts
  const slot = CATEGORY_SLOTS[documentCategory(document.type)];
```

| Línea | Hoy | Después |
|---|---|---|
| 21 | `className="size-10 items-center justify-center rounded-xl bg-accent-soft"` | ``className={`size-10 items-center justify-center rounded-xl ${slot.surface}`}`` |
| 26 | `className="self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted"` | ``className={`self-start rounded-full px-2 py-0.5 text-2xs font-bold ${slot.surface} ${slot.ink}`}`` |

El orden de las clases dentro del literal es indiferente para uniwind, pero se
fija así para que el test pueda afirmar una cadena exacta. Con
`slot = neutral`, la línea 26 resuelve a
`'self-start rounded-full px-2 py-0.5 text-2xs font-bold bg-default text-muted'`
— las mismas clases que hoy, en distinto orden: por eso el test de #62 R10 se
actualiza (R8) en vez de "romperse".

El emoji `📄` de `:24`, el `testID` de `:19`, el nombre y la fecha no se tocan.

### 4.6 `docs/ui-guidelines.md` — §Dirección de arte 1 gana su tabla

Al final del punto 1 de §Dirección de arte se añade la tabla cerrada, para que
#71 y los bloques siguientes no tengan que leer esta spec:

```markdown
Los seis huecos, cerrados (feature #64, 2026-09-04). Toda sección categórica
consume estos tokens; ninguna inventa un hex ni una clase arbitraria:

| Hueco | Superficie | Tinta | Tipos que lo ocupan |
|---|---|---|---|
| azul | `bg-category-blue` | `text-category-blue-strong` | recordatorio `vaccine`; documento de vacunación |
| ámbar | `bg-category-amber` | `text-category-amber-strong` | recordatorio `medication`; documento de desparasitación |
| verde | `bg-category-green` | `text-category-green-strong` | recordatorio `appointment`; documento de consulta |
| violeta | `bg-category-violet` | `text-category-violet-strong` | recordatorio `deworming`; documento de análisis |
| rosa | `bg-category-rose` | `text-category-rose-strong` | recordatorio `food` |
| neutral | `bg-default` | `text-muted` | recordatorio `weight` y `custom`; cualquier tipo de documento desconocido |

El reparto vive en `src/utils/category-palette.ts` y es el **único** sitio donde
se escriben esos nombres de clase. El color nunca es el único portador de la
categoría: la superficie siempre acompaña a un emoji y a un texto.
```

---

## 5. Los diecinueve `bg-accent-soft`: cuáles son categoría y cuáles no

El criterio, aplicado sitio a sitio: **es categoría si el color cambiaría al
cambiar el *tipo* del dato**; es acento si el color es el mismo para todos los
datos y solo dice "esto es de la marca" o "esto está seleccionado".

| Archivo:línea | Qué es | ¿Categoría? |
|---|---|---|
| `screens/reminders/index.tsx:270` | Contenedor del emoji del **tipo** de recordatorio | **Sí** → R7 |
| `screens/docs/index.tsx:21` | Contenedor del icono de la fila de documento | **Sí** → R8 |
| `screens/docs/index.tsx:26` (hoy `bg-default`) | Badge que muestra `{document.type}` | **Sí** → R8 |
| `components/pet-switcher.tsx:32` | Anillo de la mascota **seleccionada** | No: selección |
| `screens/add-pet/index.tsx:60`, `:283`, `:358` | Chip **seleccionado** (opcional / especie / modo de edad) | No: selección. Pintar el chip no-seleccionado de su color destruiría la única señal de "elegido" |
| `screens/add-reminder/index.tsx:153` | Chip de tipo **seleccionado** | No: selección. Es el mismo caso que arriba, aunque el dato subyacente sí sea una categoría — el color dice "elegido", no "vacuna" |
| `screens/add-reminder/index.tsx:271` | Chip de antelación **seleccionado** | No: selección |
| `app/(auth)/forgot.tsx:31` | Contenedor decorativo del `Lock` | No: acento |
| `app/(tabs)/home.tsx:183` | Círculo del icono de conectividad del collar | No: acento |
| `app/(tabs)/home.tsx:240` | CTA "Pair a collar" | No: acento |
| `app/(tabs)/home.tsx:329` | Círculo del icono "View on map" | No: acento |
| `screens/add-pet/index.tsx:253`, `screens/profile/index.tsx:266` | `Skeleton` | No: hueco de carga, sin dato |
| `screens/profile/index.tsx:61` | Respaldo del avatar sin foto | No: acento |
| `screens/profile/index.tsx:94` | Píldoras de atributos (esterilizado, edad, peso) | No: no son una taxonomía, son hechos heterogéneos de una misma mascota |
| `screens/pairing/index.tsx:297` | Círculo del ✓ de éxito | No: estado |
| `screens/pairing/index.tsx:450` | Píldora "GPS tracking active" | No: estado |
| `screens/reminders/index.tsx:198` | Píldora de resumen `pill-active` | No: estado (activo / semana / inactivo) |

Cambian **tres** sitios (dos `bg-accent-soft` y el `bg-default` del badge). Los
otros **diecisiete** `bg-accent-soft` se quedan como están, y el test de R9 lo
fija contando que `reminders/index.tsx` conserva exactamente un
`bg-accent-soft`, que `docs/index.tsx` no conserva ninguno y que el total de
`src/` baja de 19 a 17.

---

## 6. Alternativas descartadas

- **Inventar un sexto tono para no colisionar `weight` con `custom`.** El Make
  no lo tiene (§2.3: sus dos azules distan ΔE00 1,24 y sus dos ámbares 3,78, y
  reutilizar cualquiera de ellos daría dos huecos indistinguibles). Un tono
  fuera del diseño rompería la fidelidad que es el motivo de la feature.
  Descartada: el par que colisiona es el más barato posible (`custom` es por
  definición el cajón residual; `weight` es el único tipo clínico que el Make
  nunca colorea) y sus emoji y etiquetas los siguen distinguiendo.
- **Reusar la familia `warning` como el hueco ámbar** (`bg-warning-soft` +
  `text-warning-strong`, cero tokens nuevos y AA ya demostrado por #61 R5).
  Descartada: en la fila de recordatorio el ámbar de aviso ya significa "vence
  pronto"; pintar la categoría `medication` con el mismo par diría que
  medicación *es* un aviso. Es exactamente el "un rol, un tratamiento" que la
  carta pide y que #62 pasó una feature entera arreglando.
- **Convertir la etiqueta del tipo de recordatorio en badge de color**, como el
  Make (`App.tsx:947`). Descartada por §3.3: el Make puede hacerlo porque su
  badge de urgencia contiguo es rojo, y el de la app es ámbar desde #61 R3.
- **Colorear también los chips de tipo de `add-reminder`** (donde el dato sí es
  una categoría). Descartada: hoy el único indicador de "chip elegido" es
  `bg-accent-soft` + `border-accent`; pintar los siete de su color deja la
  selección sin señal, lo que es un cambio de conducta percibida, prohibido por
  el invariante. Cuando #71 u otra feature rediseñe ese selector, tendrá los
  tokens listos.
- **Un hash del `type` del documento a uno de los cinco tonos**, que evita la
  tabla y funciona con cualquier cadena. Descartada: daría a un documento de
  vacunación un color al azar, justo lo contrario de lo que el diseño pide, y
  el color dejaría de significar nada.
- **Aplicar `documentCategory` sobre el tipo normalizado con
  `normalize('NFD')`** para cubrir tildes sin duplicar claves. Descartada por
  §4.2: riesgo de runtime en Hermes a cambio de ahorrar siete líneas.
- **Declarar los tokens también en su forma sin prefijo** (`--category-blue`
  junto a `--color-category-blue`), como hacen `--tab-pill` y `--glass-surface`.
  Descartada: ese gemelo existe solo porque heroui-native lee esos nombres;
  heroui no conoce esta paleta, así que el gemelo sería veinte líneas muertas.
- **Un `theme.ts` con los tokens en TypeScript**, como propone
  `expo-design-system` por defecto. Descartada por la carta §Decisiones fijas 1:
  `global.css` es la única entrada de tokens de este repo, y un segundo sistema
  está explícitamente prohibido.
- **Bajar la claridad de los cinco pasteles claros** para separarlos más entre
  sí (el mínimo es 3,7). Descartada: dejarían de ser los hex del Make y el smoke
  lado a lado lo vería; el problema real no es la distancia entre pasteles sino
  que el color no sea el único portador, y eso ya lo garantizan R7 y R8. Si el
  gate humano decide lo contrario al ver la pantalla, el ajuste es una feature
  con su propio número, no un cambio silencioso aquí.

---

## 7. Archivos afectados

| Ruta | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/theme/global.css` | +10 líneas en `@variant light`, +10 en `@variant dark` (§4.1) |
| `mobile-pet-tracker/src/utils/category-palette.ts` | **Nuevo**: `CategorySlot`, `CATEGORY_SLOTS`, `documentCategory` (§4.2) |
| `mobile-pet-tracker/src/utils/reminder-meta.ts` | `REMINDER_TYPE_META` gana `category` (§4.3) |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | 1 import + 1 `className` (§4.4) |
| `mobile-pet-tracker/src/screens/docs/index.tsx` | 1 import + 1 `const` + 2 `className` (§4.5) |
| `docs/ui-guidelines.md` | Tabla de los seis huecos en §Dirección de arte 1 (§4.6) |
| `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` | +4 `describe` (R1-R4) |
| `mobile-pet-tracker/src/utils/__tests__/category-palette.test.ts` | **Nuevo**: +2 `describe` (R5, R6) |
| `mobile-pet-tracker/src/screens/reminders/index.test.tsx` | +1 `describe` (R7) |
| `mobile-pet-tracker/src/screens/docs/index.test.tsx` | +1 `describe` (R8) y **actualización** de la aserción de `:205-207` (enmienda a #62 R10, declarada en [[requirements]] R8) |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | +2 `describe` (R9, R10) |

Ningún archivo de `backend-pet-tracker/` se toca. Ninguna dependencia se añade.

### 7.1 Tests existentes que este cambio roza

Verificado uno a uno antes de escribir, para que el implementador no se lleve
sorpresas:

- `consistency-classnames.test.ts:97-104` (#62 R1) cuenta doce
  `rounded-xl bg-accent` con la regex `/rounded-xl bg-accent(?=[\s'"`])/`.
  `bg-accent-soft` **no** casa (le sigue un guion), así que quitar dos
  `bg-accent-soft` no altera el conteo.
- `consistency-classnames.test.ts:259-319` (#62 R14) cuenta los
  `style={CONTINUOUS_CORNER}` por archivo: 1 en `docs/index.tsx` y 4 en
  `reminders/index.tsx`. Esta feature no añade ni quita ninguno.
- `consistency-classnames.test.ts:157-167` (#62 R4) afirma clases exactas en
  `food.tsx`, `forgot.tsx` y `weight-log.tsx`. Ninguno se toca.
- `docs/index.test.tsx:204-207` (#62 R10) es el **único** test que se actualiza,
  y la enmienda está declarada y firmada en [[requirements]] R8.
- `reminders/index.test.tsx:353-358` afirma `toContain('opacity-50')` sobre el
  `className` de la fila entera, no sobre el tile. Sigue verde.

---

## 8. Verificación del reviewer

Además de C1-C8 de [[../../CHECKPOINTS|CHECKPOINTS]], con C8 completo por ser
feature móvil:

1. La suite móvil entera en verde, sin ningún assert de conducta reescrito. El
   único assert modificado es el `className` exacto de `docs/index.test.tsx:205`
   (§7.1), y sigue siendo una aserción exacta.
2. Grep-clean rehecho a mano, no leído del reporte: cero hex fuera de
   `src/theme/`, cero `[...]`, cero `StyleSheet.create`, cero `shadow`/
   `elevation` legacy.
3. `git grep -n 'bg-category-\|text-category-' mobile-pet-tracker/src` devuelve
   coincidencias **solo** en `utils/category-palette.ts` y en los tests.
4. `git diff` no toca `backend-pet-tracker/` ni renombra ningún `testID`.
5. Historial test-primero por requisito (C4): diez pares rojo→verde, no un
   commit único. Es el fallo que #19 dejó documentado.
