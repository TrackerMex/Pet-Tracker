---
feature: "mobile-ui-consistency-polish"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-ui-consistency-polish]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI, gana sobre
> `appllama-app-design-skill`) y [[../../docs/conventions|conventions]]
> §Convenciones de la app móvil / §Dimensiones de pantalla uniformes.
>
> Este documento es la fuente autosuficiente para Codex CLI: rutas exactas,
> nombres de símbolos exactos y clases exactas. **No hay ninguna decisión
> abierta.**

Skills cargadas antes de escribir (obligatorias por la carta §Skills):
`expo:expo-overview` → `expo:expo-design-system` y `expo:expo-native-ui`, más
`appllama-app-design-skill`. De appllama se toma el **patrón** (ley anti-slop 4
*shape lock*: "un rol, una forma"; ley anti-slop 2: un solo acento; ley de
fidelidad nativa 3: iconos reales, no glifos). Su **sistema de estilos**
(`Color.ios.*`, `StyleSheet.create`, tokens en TS) se descarta por la carta
§Decisiones fijas 1-3.

> **Estado del árbol sobre el que se escribió esta spec**: worktree
> `Pet-Tracker-wt-ui`, branch `feature/62-mobile-ui-consistency-polish`, base
> `b222d33` (con #61 y #42 ya en `main`). Todos los números de línea de este
> documento se verificaron leyendo el código en esa base. **Si una línea no
> coincide, manda el `testID` / la receta de `className`, no el número.**

---

## 1. Qué problema resuelve la feature

`progress/audit_ui_polish.md` encontró un patrón repetido: **el mismo rol
renderizado de varias formas**. El audit lo midió, no lo estimó, y su tabla
§Conteos anti-slop deja tres métricas en rojo que esta feature cierra:

| Métrica del audit | Medido el 2026-09-03 | Causa | Requisito |
|---|---|---|---|
| Radios no-cápsula distintos | **4 en uso**, escala no declarada | hallazgos 8, 10, 22, 23 | R1-R4 |
| Glifos tipográficos como iconografía | **5** (hoy **7**) | hallazgo 12 | R7 |
| `borderCurve: 'continuous'` | **0** | hallazgo 14 | R14 |
| `fontVariant: ['tabular-nums']` | **0** | hallazgo 15 | R15 |

Y un defecto que **no** es de gusto visual: los `TextInput` crudos no pasan
`placeholderTextColor`, así que React Native pinta el placeholder con su gris
oscuro fijo, que no mira el tema. El humano lo confirmó en dev build de Android
el 2026-09-04: el placeholder "Reminder title" sale casi negro sobre fondo
oscuro (R12).

---

## 2. Decisiones técnicas

### D1 — Título de card: `text-base font-bold text-foreground` (hallazgo 9)

El audit encontró **cuatro** tratamientos para un mismo rol. El diseño
(`specs/mobile-figma-polish/design-src/App.tsx:413,427,539,560,626,1545,1570`)
usa **uno**: `text-sm font-bold text-foreground`.

**No se copia el `text-sm` literal.** El audit abre con una advertencia de
método que condiciona todo valor absoluto: el `PhoneFrame` del Make mide
260 × 530 px (`App.tsx:805-818`) y el anclaje `mx-4` = 16 px del diseño contra
el `padding: 24` de la convención da la razón exacta **24/16 = 1,5 = 390/260**.
Un `text-sm` (14 px) copiado 1:1 renderiza proporcionalmente ~1,5× más pequeño
sobre un teléfono real de 390 dp. El equivalente proporcional está entre 16 y
21 px; **16 px (`text-base`) es el escalón más conservador** y ya es el valor
efectivo de 4 de los 6 sitios (`font-bold` sin clase de tamaño).

Ganancia adicional, y por eso `text-base` y no "dejar `font-bold` a secas": un
`Text` sin clase de tamaño hereda el tamaño por defecto de la plataforma, que
**no es el mismo en iOS y en Android**. Declarar `text-base` hace el título
determinista, que es lo que #60 (soporte iOS) va a necesitar.

**Dos roles, no uno.** La spec separa por escrito lo que el audit dejó
implícito, porque el `text-xs uppercase` que el audit contaba como "cuarto
tratamiento" **no es** un título de card mal escrito:

| Rol | Definición | Tratamiento | Ocurrencias |
|---|---|---|---|
| **Título de card** | El `Text` que nombra lo que una `Card` contiene y es hermano de sus datos | `text-base font-bold text-foreground` | **6** (§4 R5) |
| **Etiqueta de sección** | Micro-label en versalitas que nombra un grupo, dentro o fuera de card | `text-xs font-semibold uppercase tracking-widest text-muted` | **11**, sin cambio |

Y quedan **fuera** por ser un tercer rol, el **texto principal de una fila**
(`font-bold text-foreground` sin clase de tamaño): `health.tsx:146` y `:181`
(nombre de vacuna), `food.tsx:198` (hora de comida), `meal-schedule.tsx:213`,
`weight-log.tsx:262` (peso), `reminders/index.tsx:270` (título de recordatorio),
`docs/index.tsx:24` (nombre de documento), `home.tsx:236` ("Pair a collar"),
`pairing/index.tsx:335` ("Done"). Ninguno introduce inconsistencia visible: 16 px
bold es exactamente lo que R5 fija para el título, así que la app queda con un
solo peso/tamaño para todo lo bold de 16 px. También quedan fuera
`pet-card-name` (`text-xl font-bold`, nombre de entidad en un hero) y
`docs-empty` (`text-lg font-bold`, título de estado vacío).

### D2 — Botón primario sólido: gana `rounded-xl` (12 px) (hallazgo 10)

Hoy conviven dos radios en los **12** botones con `bg-accent`: `rounded-2xl`
(16 px) en el grupo `(auth)` y `rounded-xl` (12 px) en los otros ocho. Gana
`rounded-xl`, por tres razones en orden de peso:

1. **Alinea botón con input.** `--field-radius: 0.75rem` = 12 px
   (`global.css:60` y `:98`) es el radio de todos los campos de heroui. En un
   formulario, el par que el ojo compara es el input y el botón que lo cierra;
   con `rounded-2xl` el botón es más redondo que el campo que tiene encima.
2. **Es el diff más corto**: cambia 4 `className` en vez de 8.
3. **El Make no arbitra.** También tiene dos (`App.tsx:116` `rounded-2xl` para
   el CTA de flujo, `App.tsx:1597` `rounded-xl` para guardar en formulario),
   pero con la escala **invertida**: en `design-src/theme.css:108-111`
   `--radius-xl` vale 24 px y `rounded-2xl` cae al default de Tailwind (16 px),
   o sea que en el diseño el botón de formulario es el *más* redondeado y en la
   app es al revés. Copiar el diseño aquí no es posible sin remapear los
   radios de Tailwind, que es un cambio de sistema. Se decide por la regla del
   repo.

### D3 — La escala se declara como regla, no como token suelto (hallazgo 23)

El audit marca "Radios no-cápsula distintos: **1 escala declarada** / **4 en
uso** — Falla", y anota que la carta declara el token de card pero **no** la
escala. El criterio de aceptación 1 de #62 lo exige por escrito. La escala:

| Rol | Clase | Valor | Se obtiene de |
|---|---|---|---|
| Superficie de card | `rounded-card` | 20 px (`--radius-card`) | `src/components/card.tsx` |
| Control, tile, input, botón, píldora de dato | `rounded-xl` | 12 px (= `--field-radius`) | `className` |
| Cápsula | `rounded-full` | — | `className` |

`rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm` quedan **prohibidos en
`mobile-pet-tracker/src/`**. No son un cuarto rol: son drift. Con eso la
métrica del audit pasa de "4 en uso" a "2 en uso, que son la escala declarada".

El texto exacto para insertar en `docs/ui-guidelines.md` está en §7. La spec
**no** edita la carta; la escribe Codex durante R1.

### D4 — Las 4 superficies pasan al `Card` compartido **sin variant nuevo** (hallazgo 22)

El criterio de aceptación 3 pide migrar y añadir variant solo si se justifica
que ninguno de los tres sirve. **No se añade.** Razonamiento:

- Los tres variants (`surface`, `accent`, `secondary`,
  `card.tsx:4-9`) se diferencian por **color de superficie y padding**. Lo que
  las 4 superficies necesitan es exactamente eso: `surface` con el fondo
  neutro `bg-default` en tres de ellas.
- `card.tsx:25` fusiona el `className` del llamador **al final** con `twMerge`,
  y ese contrato ya está aseverado por `card.test.tsx:33-38`
  (`className="p-3"` gana sobre el `p-4` de la variante). `twMerge` resuelve el
  conflicto `bg-surface` / `bg-default` igual que el de padding. Es el escape
  hatch documentado del componente, no un fork.
- `expo-design-system` §"The component contract" lo dice explícitamente:
  *"Add a variant only when a real screen needs it"* y *"accept a `style` prop
  and merge it last, so callers can adjust layout without forking"*. Un cuarto
  variant cuyo único delta es un `bg-*` sería una abstracción sin cliente
  propio.

**Consecuencia asumida y declarada** (punto 3 del gate): las tres superficies
`bg-default` ganan `border border-border` + `shadow-sm`, y `map-empty-overlay`
gana borde y sombra. Eso es exactamente "parecerse a las cards del resto de la
app", que es el objetivo del hallazgo 22 y lo que el humano verá en el smoke.

`weight-row-*` (`weight-log.tsx:247`) **no** migra: el audit lo excluye porque
sigue el diseño, que usa un radio menor para filas de historial
(`App.tsx:1608`). `pet-card-error` (`home.tsx:140`) tampoco: es un `HeroUICard`
sin clase de radio, no una receta de card a mano, y el audit no lo lista.

### D5 — Hallazgo 16: `placeholderTextColor`, **no** migración a `TextField`

El criterio de aceptación 4 fija el **resultado** ("ningún placeholder queda
ilegible en tema oscuro… y un test lo fija"), no la vía. Se elige la prop.

**Por qué no migrar a `TextField` + `Input` de heroui:**

1. **Sería un cambio de árbol y de conducta, que el invariante prohíbe.**
   `heroui-native`'s `Input` lee el contexto que monta `TextField` y compone un
   `HeroTextInput` con su propia máquina de foco/`isDisabled`
   (`node_modules/heroui-native/src/components/input/input.tsx:105-131`).
   Eso no es "estructura visual de contenedores". El audit lo mandó fuera de
   alcance por esta razón exacta y la spec de #61 lo repitió.
2. **Ni siquiera produciría la consistencia que promete.** Los 5 campos crudos
   se etiquetan con `FieldLabel` /`Text`
   (`text-xs font-semibold uppercase tracking-widest text-muted`,
   `add-pet/index.tsx:67-73`), no con el `Label` de heroui
   (`text-2xs font-semibold text-foreground`, p. ej.
   `weight-log.tsx:130-132`). Migrar obligaría a **cambiar el aspecto de las
   etiquetas** (más drift, y en dirección contraria a la etiqueta de sección
   que D1 acaba de declarar canónica) o a usar `TextField` sin `Label`, que no
   es como se usa heroui en las otras cinco pantallas.
3. **El defecto es exactamente una prop que falta.** heroui resuelve el color
   del placeholder desde el token `--field-placeholder`, vía la clase
   `accent-field-placeholder`
   (`node_modules/heroui-native/src/components/input/input.styles.ts:56-57`,
   aplicada en `input.tsx:113-127`). Y `--field-placeholder: var(--muted)`
   (`global.css:58` en light, `:96` en dark). Pasar
   `placeholderTextColor={muted}` a un `TextInput` crudo le da **el mismo
   color, del mismo token, reactivo al tema**.

**Por qué `useThemeColors(['muted'])` y no `['field-placeholder']`.** El
resolver (`src/theme/use-theme-colors.ts:21-26`) lee `--color-<token>` y, si no
existe, `--<token>`. `--color-muted` es un hex literal en los dos variants
(`global.css:49` y `:87`); `--field-placeholder` es `var(--muted)`, una
indirección que el resolver devolvería tal cual. Se pide el token que resuelve.

**El borde también se va.** `--field-border: transparent` (`global.css:59`,
`:97`) hace que los campos de heroui no tengan borde; los crudos declaran
`border border-border`. Quitarlo iguala las dos recetas sin tocar nada más
(`bg-default` ya coincide con `--field-background`, y `rounded-xl` = 12 px ya
coincide con `--field-radius`). Es el arreglo que el propio audit propuso.

### D6 — Hallazgo 12: glifos ≠ emoji. La lista completa, con evidencia

Son dos conjuntos disjuntos. **Codex no debe tocar el segundo.**

**(A) Glifos tipográficos que hacen de icono — 7, TODOS se sustituyen (R7):**

| Carácter | Sitio | Sustituto | El mismo rol ya usa el icono en |
|---|---|---|---|
| `←` | `src/screens/docs/index.tsx:68` | `<ArrowLeft size={20} color={foreground} />` | `weight-log.tsx:135`, `meal-schedule.tsx:131` |
| `←` | `src/screens/add-pet/index.tsx:234` | idem | idem |
| `←` | `src/screens/add-reminder/index.tsx:125` | idem | idem |
| `←` | `src/screens/pairing/index.tsx:240` | idem | idem |
| `›` | `src/screens/profile/index.tsx:285` | `<ChevronRight size={20} color={muted} />` | `home.tsx:324`, `health.tsx:252`, `food.tsx:294` |
| `›` | `src/screens/profile/index.tsx:297` | idem | idem |
| `›` | `src/screens/profile/index.tsx:310` | idem | idem |

Son **7 y no los 5 del audit**: `pairing/index.tsx:240` y
`profile/index.tsx:310` los añadió la feature #42 (`pairing`) después de la
auditoría. Se incluyen porque el criterio de aceptación 5 pide "**cero** glifos
tipográficos haciendo de iconografía", que es un conteo global, no una lista.

Ningún test consulta `'←'` ni `'›'`: verificado con
`grep -rn "←\|›" --include="*.test.tsx" mobile-pet-tracker/src` → 0
coincidencias.

**(B) Emoji que hacen de icono — 8, NINGUNO se toca (fuera de alcance):**

| Emoji | Sitio | Por qué no entra |
|---|---|---|
| `📄` | `src/screens/docs/index.tsx:18` | El audit lo agrupa con los 7 de abajo en su §Fuera de alcance: sustituirlo es cambio de conducta/asset, feature propia |
| `💉 🪱 💊 🩺 ⚖️ 🍖 📌` | `src/utils/reminder-meta.ts:7-13`, renderizados en `src/screens/reminders/index.tsx:254` y `src/screens/add-reminder/index.tsx:155` | **Bloqueados por tests**: `src/screens/add-reminder/index.test.tsx:187` afirma `'💉 Vaccine'` y `src/screens/reminders/index.test.tsx:341` afirma `'💉'`. Sustituirlos cambia texto visible |

Tras R7, el conteo anti-slop "Emoji como iconografía en el chrome" sigue
valiendo **8** y sigue en rojo **a propósito**. El reviewer lo anota así, no lo
levanta como bloqueo.

### D7 — Hallazgo 26: Forgot pasa a `useThemeColors(['accent-strong'])`

`src/app/(auth)/forgot.tsx:8,15` es el único consumidor de `useThemeColor` de
heroui-native en `src/`. La carta §Decisiones fijas 9 lo prohíbe. Diferencia
práctica: el del repo cae a `--color-foreground` cuando la variable no resuelve
(`use-theme-colors.ts:17-19`); el de heroui devuelve la cadena literal
`'invalid'`, que en jest deja el icono del candado con un color inválido.

**Pide `'accent-strong'`, no `'accent'`.** El audit proponía `['accent']`, pero
ese texto es anterior a #61, que partió el acento por rol y dejó como
invariante verificado *"cero llamadas a `useThemeColors` que pidan `'accent'`
en `src/`"*
(`src/__tests__/legibility-classnames.test.ts:145-149`, hoy verde).
Migrar a `['accent']` **rompería ese test**. Y sustancialmente es lo correcto:
el `Lock` de `forgot.tsx:35` se dibuja **encima** de `bg-accent-soft`, y la
regla mecánica de la carta §Decisiones fijas 11 es "fondo ⇒ `--accent`; encima
de otra cosa ⇒ `--accent-strong`". Ratios ya calculados por #61: `#107148`
sobre `bg-accent-soft` = 4,941:1 en light y 6,501:1 en dark (umbral no textual
3,0:1) — mejora también la legibilidad del icono.

Forma exacta:

```tsx
// src/app/(auth)/forgot.tsx
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
// …
import { useThemeColors } from '../../theme/use-theme-colors';

const [accentStrong] = useThemeColors(['accent-strong']);
// …
<Lock size={28} color={accentStrong} />
```

### D8 — Hallazgos 14 y 15: dos constantes compartidas y un alcance acotado por evidencia

Ninguna de las dos micro-reglas es expresable como clase de Tailwind, así que
van por `style`. Precedente en el repo: `TOUCH_SLOP` de
`src/theme/touch-target.ts`, creado por #61 R10 por la misma razón. Se añade un
único archivo hermano:

```ts
// mobile-pet-tracker/src/theme/native-styles.ts
/**
 * Estilos nativos que Tailwind/uniwind no puede expresar. Mismo motivo y mismo
 * precedente que TOUCH_SLOP de ./touch-target.ts: no son valores de diseño
 * repetidos (esos son tokens de global.css), son props de estilo de React
 * Native sin utilidad CSS equivalente.
 */

/** Esquina continua (estilo iOS) en toda superficie redondeada no-cápsula. */
export const CONTINUOUS_CORNER = { borderCurve: 'continuous' } as const;

/** Cifras de ancho fijo: los dígitos dejan de bailar al refrescarse. */
export const TABULAR_NUMS = { fontVariant: ['tabular-nums'] } as const;
```

**Alcance de `borderCurve` (R14): lo que el repo dibuja por su cuenta.**
`heroui-native` ya declara `borderCurve` en 32 de sus componentes —incluidos
`Button`, `Input`, `Skeleton`, `Surface` (la base de su `Card`), `Chip` y
`Avatar`
(`node_modules/heroui-native/src/components/{button,input,skeleton,surface}/*.styles.ts`)—
así que de las **81** ocurrencias de `rounded-xl`/`rounded-card` de `src/`,
**61** ya son continuas: 22 en `Skeleton`, 21 en `Button`, 15 en `Input` y 3 en
`HeroUICard`. Lo que falta son los `View`, `Pressable` y `TextInput` de React
Native, más el `Card` del repo: **33 sitios**, enumerados en §4 R14. Aplicarlo
a un componente de heroui sería redundante y aplicarlo a una cápsula está
prohibido por la propia micro-regla ("no-cápsula").

**Corrección a la evidencia del audit.** El hallazgo 14 propone añadirlo en
`floating-tab-bar.tsx:111`. **Es incorrecto**: esa superficie es
`rounded-full` (`floating-tab-bar.tsx:111`) y el indicador de pestaña usa
`borderRadius: 999` (`:145`). Las dos son cápsulas y quedan fuera por
definición. `pet-avatar.tsx:24` (`borderRadius: size / 2`) y
`pet-switcher.tsx:32-33` (`rounded-full`) también.

**La fusión en `card.tsx` no puede ser un array.** `map.test.tsx:410` asevera
`screen.getByTestId('map-empty-overlay').props.style` con
`expect.objectContaining({ top: 52 })`, y tras R3 ese `style` lo pasa el
llamador a través del `Card`. Un `style={[CONTINUOUS_CORNER, style]}` dejaría
`props.style` como array y rompería un test preexistente. Se fusiona con
`StyleSheet.flatten`, que devuelve un objeto plano:

```tsx
// src/components/card.tsx
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import { CONTINUOUS_CORNER } from '../theme/native-styles';
// …
export function Card({ variant = 'surface', onPress, className, style, ...rest }: CardProps) {
  const mergedClassName = twMerge(variantClassNames[variant], className);
  const mergedStyle = StyleSheet.flatten([CONTINUOUS_CORNER, style]);

  if (onPress) {
    return (
      <Pressable
        {...rest}
        accessibilityRole="button"
        className={mergedClassName}
        style={mergedStyle}
        onPress={onPress}
      />
    );
  }

  return <View {...rest} className={mergedClassName} style={mergedStyle} />;
}
```

`StyleSheet.flatten` **no es** `StyleSheet.create`. El grep-clean de la carta
§Decisiones fijas 3 prohíbe crear un segundo sistema de estilos
(`StyleSheet.create`); `flatten` es el helper de fusión de React Native y no
declara ningún estilo. `src/__tests__/design-drift.test.ts` comprueba
`/StyleSheet/i` solo sobre los 7 archivos de la feature #33 (`api/media.ts`,
`api/users.ts`, `components/pet-avatar.tsx`, `screens/add-pet/index.tsx`,
`screens/docs/index.tsx`, `screens/profile/index.tsx`,
`utils/theme-preference.ts`) — `components/card.tsx` **no** está en esa lista,
y el check de `pairing` prohíbe literalmente `StyleSheet\.create`. Verificado:
la suite sigue verde.

**Alcance de `tabular-nums` (R15): todo `Text` cuyo contenido sea un número.**
14 sitios (§4 R15). Se excluye `stat-gps`, que nunca renderiza un número
(`'No signal' | 'Live' | 'Stale'`, `map.tsx:190-195`), y todas las etiquetas.
El caso urgente es el overlay del mapa, que se repinta cada 15 s
(`map.tsx:66`, `POLL_MS = 15000`); el resto es higiene.

---

## 3. Alternativas descartadas

- **Un cuarto variant en `Card` (`default`) para las superficies `bg-default`
  del hallazgo 22**: §2 D4. El `className` del llamador ya es el escape hatch
  documentado y aseverado.
- **Migrar los `TextInput` crudos a `TextField` + `Input`**: §2 D5. Cambia el
  árbol y el manejo de foco, obliga a re-estilar las etiquetas y no es
  necesario para arreglar el defecto real.
- **Copiar el `text-sm` literal del Make para el título de card**: §2 D1. El
  Make está expresado dentro de un `PhoneFrame` de 260 px; copiar valores
  absolutos 1:1 encoge la tipografía ~1,5× en proporción.
- **`rounded-2xl` (16 px) como radio del botón primario**: §2 D2. Desalinea
  botón e input dentro del mismo formulario y es el doble de diff.
- **Remapear `--radius-xl`/`--radius-2xl` de Tailwind para reproducir la escala
  invertida del Make** (`design-src/theme.css:108-111`): sería un cambio del
  sistema de estilos, no un pulido; y `global.css` no se toca en esta feature.
- **Añadir `borderCurve` a `floating-tab-bar.tsx:111`**, como propone el
  hallazgo 14: es una cápsula. §2 D8.
- **Añadir `borderCurve` a los componentes de heroui envolviéndolos**:
  redundante, ya lo traen. §2 D8.
- **`style={[CONTINUOUS_CORNER, style]}` en `card.tsx`**: rompe
  `map.test.tsx:410`. §2 D8.
- **`useThemeColors(['accent'])` en Forgot**, como propone el hallazgo 26:
  rompe el invariante verde de #61 R4 y pinta tinta con el token de relleno.
  §2 D7.
- **Extraer un componente `Tile` compartido** para las ~10 recetas
  `size-N items-center justify-center rounded-xl bg-*`: es una abstracción que
  ningún criterio de aceptación pide, con API mayor que su implementación
  (`expo-design-system` §"When to extract"), y multiplicaría el riesgo del
  diff. Los tiles se alinean por clase, no por componente.
- **Cambiar `--radius-card` a 16 px** (hallazgo 18): decisión humana del
  2026-09-03, cerrada. §9.
- **Añadir `hitSlop` a `pairing-link`** de paso: §9.

---

## 4. Inventario sitio a sitio

> Regla mecánica que resuelve el 90 % de las dudas: **si la esquina la dibuja
> un componente de heroui-native, no se toca; si la dibuja un `View`,
> `Pressable`, `TextInput` o el `Card` del repo, es del repo y se toca.**

### R1 — Botón primario sólido (12 sitios, cambian 4)

`className` que contiene exactamente `bg-accent` (no `bg-accent-soft`):

| Archivo | Línea | `className` hoy | Después |
|---|---|---|---|
| `src/app/(auth)/login.tsx` | 102 | `w-full rounded-2xl bg-accent` | `w-full rounded-xl bg-accent` |
| `src/app/(auth)/forgot.tsx` | 57 | `w-full rounded-2xl bg-accent` | `w-full rounded-xl bg-accent` |
| `src/app/(auth)/register.tsx` | 274 | `w-full rounded-2xl bg-accent` | `w-full rounded-xl bg-accent` |
| `src/screens/reset-password/index.tsx` | 192 | `w-full rounded-2xl bg-accent` | `w-full rounded-xl bg-accent` |
| `src/app/(tabs)/weight-log.tsx` | 193 | `rounded-xl bg-accent` | **sin cambio** |
| `src/app/(tabs)/meal-schedule.tsx` | 241 | `rounded-xl bg-accent` | **sin cambio** |
| `src/screens/add-pet/index.tsx` | 422 | `rounded-xl bg-accent` | **sin cambio** |
| `src/screens/add-reminder/index.tsx` | 279 | `rounded-xl bg-accent` | **sin cambio** |
| `src/screens/profile/index.tsx` | 193 | `rounded-xl bg-accent` | **sin cambio** |
| `src/screens/reminders/index.tsx` | 135 | `rounded-xl bg-accent` | **sin cambio** |
| `src/screens/pairing/index.tsx` | 322 | `min-h-11 w-full rounded-xl bg-accent` | **sin cambio** |
| `src/screens/pairing/index.tsx` | 377 | `min-h-11 w-full rounded-xl bg-accent` | **sin cambio** |

Más el texto de §7 en `docs/ui-guidelines.md`.

### R2 — Skeletons con la forma de su contenido (3 sitios)

| Archivo | Línea | `testID` | `className` hoy | Después | Sustituye a |
|---|---|---|---|---|---|
| `src/app/(tabs)/home.tsx` | 136 | `pet-card-skeleton` | `h-32 w-full rounded-2xl` | `h-32 w-full rounded-card` | `Card` `pet-card` (`:150`) |
| `src/app/(tabs)/health.tsx` | 130 | `vaccines-skeleton` | `h-24 w-full rounded-2xl` | `h-24 w-full rounded-card` | `Card` `next-vaccine-card` (`:135`) y `vaccine-row-*` (`:176`) |
| `src/screens/reminders/index.tsx` | 158 | `reminder-row-skeleton-${index+1}` | `h-20 w-full rounded-2xl` | `h-20 w-full rounded-card` | `Card` `reminder-row-*` (`:248`) |

Los asserts de #72 R8 comprueban la clase de **dimensión** (`h-12`/`h-40`/
`flex-1`), no el radio: no se rompen.

### R3 — Las 4 superficies al `Card` compartido

| # | Sitio hoy | Elemento hoy | Después |
|---|---|---|---|
| 1 | `src/app/(tabs)/home.tsx:172` `testID="collar-card"` | `HeroUICard className="gap-3 rounded-2xl bg-default p-4"` | `<Card testID="collar-card" className="gap-3 bg-default">` |
| 2 | `src/app/(tabs)/home.tsx:311` `testID="last-position-card"` | `Pressable accessibilityRole="button" className="gap-2 rounded-2xl bg-default p-4" onPress={…}` | `<Card testID="last-position-card" className="gap-2 bg-default" onPress={() => router.push('/map')}>` |
| 3 | `src/app/(tabs)/food.tsx:227` | `HeroUICard key={warning.code} className="rounded-2xl border border-border bg-default p-4"` | ``<Card key={warning.code} testID={`warning-card-${warning.code}`} className="bg-default">`` |
| 4 | `src/app/(tabs)/map.tsx:254` `testID="map-empty-overlay"` | `View style={{position:'absolute',top:insets.top+12,left:16,right:16}} className="items-center rounded-2xl bg-surface p-3"` | `<Card testID="map-empty-overlay" style={{…igual…}} className="items-center p-3">` |

`className` resultante que `twMerge` produce (para que el test pueda
aseverarlo):

| # | `props.className` después |
|---|---|
| 1 | `rounded-card border border-border p-4 shadow-sm gap-3 bg-default` |
| 2 | `rounded-card border border-border p-4 shadow-sm gap-2 bg-default` |
| 3 | `rounded-card border border-border p-4 shadow-sm bg-default` |
| 4 | `rounded-card border border-border bg-surface shadow-sm items-center p-3` |

> El orden exacto lo decide `twMerge`; los tests deben usar `toContain` sobre
> las clases que importan (`rounded-card`, `bg-default` / `bg-surface`,
> `border`), no igualdad de cadena.

Efectos colaterales que hay que atender en el mismo commit:

- `src/app/(tabs)/food.tsx:2` — `Card as HeroUICard` queda sin usos:
  **eliminar del import** (C7). `Spinner` sigue en uso (`:83`) y se queda.
- `src/app/(tabs)/home.tsx:2` — `HeroUICard` **sigue en uso** en
  `pet-card-error` (`:140`): el import se queda.
- `src/app/(tabs)/map.tsx:15` ya importa el `Card` compartido; `home.tsx:18` y
  `food.tsx:10` también.
- `home.test.tsx:586` hace `fireEvent.press(screen.getByTestId('last-position-card'))`:
  el `Card` con `onPress` renderiza un `Pressable` con
  `accessibilityRole="button"` (`card.tsx:27-35`), así que sigue verde.
- `food.test.tsx:332` hace `queryAllByTestId(/^plan-warning-/)` y espera 0 sin
  avisos. Por eso el `testID` nuevo se llama `warning-card-<code>` y **no**
  `plan-warning-card-<code>`: no debe entrar en ese regex.

### R4 — Los 6 radios fuera de escala que quedan

| Archivo | Línea | `className` hoy | Después | Rol |
|---|---|---|---|---|
| `src/screens/reminders/index.tsx` | 194 | `flex-1 items-center gap-1 rounded-2xl bg-accent-soft p-3` | `…rounded-xl…` | píldora de dato (`pill-active`) |
| `src/screens/reminders/index.tsx` | 207 | `flex-1 items-center gap-1 rounded-2xl bg-default p-3` | `…rounded-xl…` | `pill-week` |
| `src/screens/reminders/index.tsx` | 228 | `flex-1 items-center gap-1 rounded-2xl bg-default p-3` | `…rounded-xl…` | `pill-inactive` |
| `src/app/(tabs)/food.tsx` | 158 | `size-14 items-center justify-center rounded-2xl bg-surface-secondary` | `…rounded-xl…` | tile de icono |
| `src/app/(auth)/forgot.tsx` | 34 | `size-16 items-center justify-center rounded-2xl bg-accent-soft` | `…rounded-xl…` | tile de icono |
| `src/app/(tabs)/weight-log.tsx` | 250 | `` `size-8 shrink-0 items-center justify-center rounded-lg ${tileClassName}` `` | `` `…rounded-xl ${tileClassName}` `` | tile de icono |

Con esto, y con R1-R3, `rounded-2xl` y `rounded-lg` desaparecen de `src/`. El
resto de tiles de icono ya está en `rounded-xl` (`health.tsx:139` `size-11`,
`reminders/index.tsx:253` `size-11`, `meal-schedule.tsx:210` `size-10`,
`docs/index.tsx:17` `size-10`), así que los 6 se alinean con la mayoría.

### R5 — Título de card (6 sitios)

| Archivo | Línea | Texto | `className` hoy | Después |
|---|---|---|---|---|
| `src/app/(tabs)/home.tsx` | 247 | `Today&apos;s Summary` | `text-lg font-bold text-foreground` | `text-base font-bold text-foreground` |
| `src/app/(tabs)/health.tsx` | 210 | `Weight` | `text-sm font-bold text-foreground` | idem |
| `src/app/(tabs)/food.tsx` | 169 | `Meals today` | `font-bold text-foreground` | idem |
| `src/app/(tabs)/food.tsx` | 250 | `AI recommendation` | `font-bold text-foreground` | idem |
| `src/app/(tabs)/food.tsx` | 287 | `Meal schedule` | `font-bold text-foreground` | idem |
| `src/app/(tabs)/meal-schedule.tsx` | 264 | `Nutrition profile` | `font-bold text-foreground` | idem |

`food.tsx:250` y `:287` son **ocurrencias añadidas** a la evidencia del
hallazgo 9 (que citaba `food.tsx:169`): son el título de `food-ai-card` y de
`meal-schedule-link`, mismo rol y mismo archivo, y dejarlos fuera sería un fix
parcial del mismo criterio de aceptación. El sitio de `profile` que el hallazgo
citaba (`:260`, "Información") **ya lo cerró #61 R9** como etiqueta de sección.

### R6 — `InfoRow` sin variante muerta

`src/screens/profile/index.tsx:27-36`. Firma y cuerpo exactos:

```tsx
function InfoRow({
  isLast = false,
  label,
  value,
}: {
  isLast?: boolean;
  label: string;
  value: string | null;
}) {
  return (
    <View
      className={
        isLast
          ? 'flex-row items-center justify-between gap-4 py-3'
          : 'flex-row items-center justify-between gap-4 border-b border-separator py-3'
      }
    >
```

> **Nota para R14**: `InfoRow` **no** lleva `CONTINUOUS_CORNER`. No tiene
> ninguna clase `rounded-*`, así que no es una esquina redondeada y no entra en
> los 33 sitios de §4 R14. El `View` queda solo con `className`.

Los 4 llamadores están en `src/screens/profile/index.tsx:264-275`; el último
(`label="Última señal"`) recibe `isLast`:

```tsx
<InfoRow label="Raza" value={pet.breed} />
<InfoRow label="Microchip" value={pet.microchip} />
<InfoRow label="Dispositivo GPS" value={pet.device?.model ?? null} />
<InfoRow
  isLast
  label="Última señal"
  value={…}
/>
```

`InfoRow` es una función privada del módulo, sin `testID` ni texto propio: su
firma no es contrato de nadie.

### R7 — Los 7 glifos (tabla completa en §2 D6)

Colores: `docs`, `add-pet`, `add-reminder` y `pairing` ya resuelven o pueden
resolver `foreground` con `useThemeColors(['foreground'])` (patrón idéntico al
de `weight-log.tsx:133` y `meal-schedule.tsx:129`); `profile` ya llama a
`useThemeColors` y solo necesita añadir `'muted'` a su lista si no lo pide ya.
Import: `import { ArrowLeft } from 'reicon-react-native'` /
`import { ChevronRight } from 'reicon-react-native'`, ambos ya usados en el
repo.

### R8 — El Spinner de Home

```tsx
// src/app/(tabs)/home.tsx:2
import { Button, Card as HeroUICard, Skeleton } from 'heroui-native';
// :108
{pets.data === undefined ? (
  <Skeleton testID="home-loading" className="h-12 w-full rounded-card" />
) : null}
```

`home.test.tsx:140` solo hace `toBeVisible()` sobre `home-loading`: sigue
verde. `food.tsx:83` **no** cambia — ya envuelve su `Spinner` en un contenedor
`h-10` y el audit lo da por bueno.

### R9 — La gráfica dentro de una card

```tsx
// src/app/(tabs)/weight-log.tsx:140-142
{weights.data?.kind === 'ok' ? (
  <Card testID="weight-chart-card">
    <WeightChart entries={weights.data.weights} />
  </Card>
) : null}
```

`Card` ya está importado (`weight-log.tsx:20`, y
`design-drift.test.ts` lo asevera). El `testID="weight-chart"` del SVG no se
toca; `weight-log.test.tsx:269` sigue verde.

### R10 — El badge del tipo de documento

```tsx
// src/screens/docs/index.tsx:21-23
<Text className="self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted">
  {document.type}
</Text>
```

`rounded-full` ⇒ cápsula ⇒ **sin** `CONTINUOUS_CORNER`. `text-2xs` es el token
de `global.css:15` (10 px), no una clase arbitraria. Contraste `text-muted`
`#667085` sobre `bg-default` `#F5F6F8` = **4,601:1** (calculado por #61 R6),
AA ✔.

### R11 — Los chips de especie

`src/screens/add-pet/index.tsx`:

| Línea | Hoy | Después |
|---|---|---|
| 279 | `rounded-full border border-accent bg-accent-soft px-4 py-2` | `rounded-full border border-accent bg-accent-soft px-3 py-2` |
| 280 | `rounded-full border border-border bg-default px-4 py-2` | `rounded-full border border-border bg-default px-3 py-2` |
| 284 | `font-semibold text-foreground` | `text-sm font-semibold text-foreground` |

Queda idéntico a `OptionalChip` (`:57-58`, `:62`) y a los chips de modo de edad
(`:350-351`, `:355`). **Comprobación de #61 R10**: el chip pasa de caja mínima
35 pt (texto 16 px) a 33 pt (texto 14 px); con `hitSlop={TOUCH_SLOP}` (6 pt por
lado) el objetivo táctil queda en **45 pt ≥ 44** — el mismo cálculo que #61
design §D5 hizo para los chips `px-3 py-2` con `text-sm`. No se degrada nada.

### R12 — Los `TextInput` crudos

Receta única después: `rounded-xl bg-default px-4 py-3 text-foreground`
(más `min-h-12` donde ya estaba), `placeholderTextColor={muted}` cuando hay
`placeholder`, y `style={CONTINUOUS_CORNER}` por R14.

| Archivo | Línea (`<TextInput`) | `testID` | `placeholder` | Quita | Añade |
|---|---|---|---|---|---|
| `src/screens/add-pet/index.tsx` | 294 | `name-input` | `Pet name` | `border border-border` | `placeholderTextColor={muted}` |
| `src/screens/add-pet/index.tsx` | 306 | `breed-input` | `Optional` | `border border-border` | `placeholderTextColor={muted}` |
| `src/screens/add-pet/index.tsx` | 371 | `approx-age-input` | `Months` | `border border-border` | `placeholderTextColor={muted}` |
| `src/screens/add-pet/index.tsx` | 410 | `microchip-input` | `Optional` | `border border-border` | `placeholderTextColor={muted}` |
| `src/screens/add-reminder/index.tsx` | 167 | `title-input` | `Reminder title` | `border border-border` | `placeholderTextColor={muted}` |
| `src/screens/pairing/index.tsx` | 361 | `activation-code-input` | — (no tiene) | `border border-border` | — |

`muted` sale de `const [muted] = useThemeColors(['muted'])` en cada pantalla.
Hoy **ninguna de las tres** llama a `useThemeColors`, así que las tres añaden
el import `import { useThemeColors } from '../../theme/use-theme-colors'` (y en
`add-pet`/`add-reminder`/`pairing` la llamada puede compartirse con el
`foreground` que R7 necesita: `const [foreground, muted] = useThemeColors(['foreground', 'muted'])`).

Los `Pressable` que hacen de pseudo-campo (`date-field`, `time-field`,
`birth-date-field`) **no** son `TextInput` y su texto de placeholder ya está
tokenizado (`className={date ? 'text-foreground' : 'text-muted'}`,
`add-reminder/index.tsx:188`, `add-pet/index.tsx:366`). No se tocan salvo por
R14. Por eso los `TextInput` crudos son **5 con placeholder**, no los 8 que
contaba el audit: ese conteo incluía los tres pseudo-campos.

### R13 — Forgot (código exacto en §2 D7)

### R14 — Los 33 sitios de `CONTINUOUS_CORNER`

`style={CONTINUOUS_CORNER}` en el elemento (o `style={StyleSheet.flatten([…])}`
en `card.tsx`). Si el elemento ya tiene `style`, se fusiona con
`StyleSheet.flatten([CONTINUOUS_CORNER, …])`.

| Archivo | Sitios (línea del `className` / `testID`) | N |
|---|---|---|
| `src/components/card.tsx` | las **dos** ramas de retorno (`Pressable` de `:29`, `View` de `:38`) vía `StyleSheet.flatten` | 2 |
| `src/app/(auth)/forgot.tsx` | `:34` (tile `size-16`) | 1 |
| `src/app/(tabs)/home.tsx` | `:233` (`Pressable` `collar-pair-link`) | 1 |
| `src/app/(tabs)/health.tsx` | `:139` (tile `size-11`), `:248` (`Pressable` `weight-log-link`) | 2 |
| `src/app/(tabs)/food.tsx` | `:158` (tile `size-14`), `:185` (`View` `meal-row-${index}`, className ternario en `:190-191`) | 2 |
| `src/app/(tabs)/map.tsx` | `:282`, `:294`, `:308`, `:320` (los cuatro tiles de `map-stats`) | 4 |
| `src/app/(tabs)/meal-schedule.tsx` | `:210` (tile `size-10`) | 1 |
| `src/app/(tabs)/weight-log.tsx` | `:250` (tile `size-8`) | 1 |
| `src/screens/docs/index.tsx` | `:17` (tile `size-10`) | 1 |
| `src/screens/profile/index.tsx` | `:40` (`PetHero`, `rounded-card`), `:281` (`documents-link`), `:291` (`pairing-link`), `:306` (`reminders-link`) | 4 |
| `src/screens/reminders/index.tsx` | `:194`, `:207`, `:228` (las tres píldoras), `:253` (tile `size-11`) | 4 |
| `src/screens/add-pet/index.tsx` | `name-input`, `breed-input`, `approx-age-input`, `microchip-input`, `Pressable` `birth-date-field` (`:360`) | 5 |
| `src/screens/add-reminder/index.tsx` | `title-input`, `Pressable` `date-field` (`:182`), `Pressable` `time-field` (`:197`) | 3 |
| `src/screens/pairing/index.tsx` | `Pressable` `ready-done` (`:329`), `activation-code-input` | 2 |
| **Total** | | **33** |

**Fuera por ser cápsula** (`rounded-full` / `borderRadius: 999`), verificado uno
a uno: `components/floating-tab-bar.tsx:111` y `:145`,
`components/pet-switcher.tsx:32-33`, `components/pet-avatar.tsx:24`,
`home.tsx:177` y `:319`, `food.tsx:194`, `docs/index.tsx:21` (el badge de R10),
`reminders/index.tsx:264`, `profile/index.tsx:74`, los chips `rounded-full` de
`add-pet` y `add-reminder`, y los cinco botones de volver
(`size-10`/`size-11 … rounded-full`).

**Fuera por ser de heroui-native** (ya lo traen): los 22 `Skeleton`, los 21
`Button`, los 15 `Input` y los 3 `HeroUICard`.

### R15 — Los 14 contadores de `TABULAR_NUMS`

`style={TABULAR_NUMS}` en el `Text` del **valor** (nunca en su etiqueta).

| Archivo | Línea del `<Text` | `testID` / contenido | Por qué es contador |
|---|---|---|---|
| `src/app/(tabs)/map.tsx` | 283 | `stat-speed` | `12.5 km/h`, repinta cada 15 s |
| `src/app/(tabs)/map.tsx` | 295 | `stat-distance` | `1.4 km`, repinta cada 15 s |
| `src/app/(tabs)/map.tsx` | 309 | `stat-updated` | `5m ago`, repinta cada 15 s |
| `src/app/(tabs)/home.tsx` | 209 | `collar-battery` | `84%` |
| `src/app/(tabs)/home.tsx` | 273 | `summary-activity` | `fmtMinutes` |
| `src/app/(tabs)/home.tsx` | 285 | `summary-sleep` | `fmtMinutes` |
| `src/app/(tabs)/home.tsx` | 295 | `summary-distance` | `fmtKm` |
| `src/app/(tabs)/health.tsx` | 212 | `weight-current` | `12.4 kg` |
| `src/app/(tabs)/health.tsx` | 223 | `weight-variation` | `fmtVariation` |
| `src/app/(tabs)/weight-log.tsx` | 262 | `{entry.weightKg} kg` (dentro de `weight-row-*`) | columna de pesos comparables |
| `src/app/(tabs)/weight-log.tsx` | 265 | `{fmtVariation(entry.variation)}` | columna de deltas |
| `src/screens/reminders/index.tsx` | 196 | contador de `pill-active` | |
| `src/screens/reminders/index.tsx` | 209 | contador de `pill-week` | |
| `src/screens/reminders/index.tsx` | 230 | contador de `pill-inactive` | |

`health.tsx:223` (`weight-variation`) es una **ocurrencia añadida** a los 13 del
audit: renderiza el mismo `fmtVariation` que `weight-log.tsx:265`, que el audit
sí lista. **`stat-gps` queda fuera**: nunca es numérico.

---

## 5. Conteos anti-slop esperados tras la implementación (R16)

El reviewer rehace `progress/audit_ui_polish.md` §Conteos anti-slop sobre
`mobile-pet-tracker/src/**/*.{ts,tsx}` excluyendo `__tests__/` y `*.test.tsx`,
y debe obtener **exactamente** esto:

| Métrica | Objetivo | Hoy | Esperado tras #62 | Grep |
|---|---|---|---|---|
| Hues de acento distintos | 1 | 1 | **1** | — |
| Radios no-cápsula distintos | la escala declarada | 4 | **2** (`rounded-card`, `rounded-xl`) | `rounded-2xl` ⇒ 0, `rounded-lg` ⇒ 0, `rounded-md`/`rounded-sm` ⇒ 0 |
| Glifos tipográficos como iconografía | 0 | 7 | **0** | `←` ⇒ 0, `›` ⇒ 0 |
| Emoji como iconografía en el chrome | 0 | 8 | **8** — sigue en rojo **a propósito**, §2 D6 | — |
| `borderCurve: 'continuous'` | toda esquina no-cápsula del repo | 0 | **33** usos de `CONTINUOUS_CORNER` | `grep -c CONTINUOUS_CORNER` por archivo, tabla §4 R14 |
| `fontVariant: ['tabular-nums']` | todo contador | 0 | **14** usos de `TABULAR_NUMS` | tabla §4 R15 |
| Tratamientos del título de card | 1 | 4 | **1** (`text-base font-bold text-foreground`, 6 sitios) | — |
| Radios del botón primario sólido | 1 | 2 | **1** (`rounded-xl`, 12 botones) | `rounded-2xl bg-accent` ⇒ 0 |
| `useThemeColor` de heroui en `src/` | 0 | 1 | **0** | `grep -rn "useThemeColor\b"` ⇒ 0 |
| `useThemeColors` pidiendo `'accent'` | 0 | 0 | **0** (invariante de #61 R4) | — |
| `TextInput` con `placeholder` y sin `placeholderTextColor` | 0 | 5 | **0** | — |
| `TextInput` con `border border-border` | 0 | 6 | **0** | — |
| Variantes de posición (`last:`/`first:`/`odd:`/`even:`) | 0 | 1 | **0** | — |
| Recetas de card a mano fuera de `Card` | 0 de las 4 del hallazgo 22 | 4 | **0** | — |
| Gradientes sin razón de marca | 0 | 0 | **0** | — |
| Etiquetas duplicadas para una misma intención | 0 | 0 | **0** | — |
| Hex fuera de `src/theme/` | 0 | 0 | **0** | grep-clean #46/#72 |
| Clases arbitrarias `[...]` | 0 | 0 | **0** | grep-clean #46/#72 |
| `StyleSheet.create` | 0 | 0 | **0** | grep-clean #46/#72 (`StyleSheet.flatten` no cuenta, §2 D8) |
| `shadow*`/`elevation` legacy | 0 | 0 | **0** | grep-clean #46/#72 |

---

## 6. Dónde vive cada test, y qué se añade

| Tipo de requisito | Archivo | Patrón preexistente que copia |
|---|---|---|
| Clase / prop en la fuente, conteos globales | `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` (**nuevo**) | `src/__tests__/legibility-classnames.test.ts` de #61: helpers `sourceFiles()`, `filesMatching()`, `readSource()`, `elementWithTestId()` — se copian tal cual |
| Árbol renderizado | Los test files de pantalla ya existentes | `@testing-library/react-native`; `screen.getByText('X').props.className` como `profile/index.test.tsx:681`; `props.className` como `map.test.tsx:250` |
| `Card` compartido | `src/components/__tests__/card.test.tsx` | `describe` nuevo, sin tocar los 5 existentes |
| R16 | Sin test de jest | Gate mecánico del `reviewer` |

Los `describe` nuevos se nombran **`#62 R<n>: …`**, por la misma razón que #61
usó `#61 R<n>`: los R-ids son por feature y ya colisionan entre features en el
mismo archivo.

**`testID` nuevos (2, ninguno renombrado ni eliminado):**

| `testID` | Dónde | Requisito |
|---|---|---|
| `warning-card-${warning.code}` | `src/app/(tabs)/food.tsx` (el `Card` que envuelve cada aviso de plan) | R3 |
| `weight-chart-card` | `src/app/(tabs)/weight-log.tsx` (el `Card` que envuelve `WeightChart`) | R9 |

**Excepciones al invariante: ninguna.** Se comprobó archivo por archivo que
ningún test preexistente se rompe:

- `card.test.tsx:5-51` — asevera `className` y `accessibilityRole`, nunca
  `style`. R14 no lo toca.
- `map.test.tsx:410` — asevera `map-empty-overlay.props.style` con
  `objectContaining`. Por eso `card.tsx` fusiona con `StyleSheet.flatten` en
  vez de con un array (§2 D8).
- `map.test.tsx:559` y `:1155` — aseveran el `style` de `map-stats`, un `View`
  sin radio: no se toca.
- `map.test.tsx:1096` — recorre el árbol buscando
  `props.className === 'flex-row gap-2'` (maqueta 2×2 de #61 R11). R14 añade
  `style`, no cambia ningún `className`: sigue verde.
- `map.test.tsx:250`, `:350`, `:893`, `:963`, `:965` — `className` de
  `map-loading`, `screen-map`, `lost-mode-error` y `map-last-error-state`:
  ninguno se toca.
- `home.test.tsx:140` — `home-loading` con `toBeVisible()`, sin props: R8 sigue
  verde (`Skeleton` de heroui renderiza una vista visible, igual que
  `health-loading`).
- `home.test.tsx:328,350,371,423` — `collar-card` con `toBeVisible()`.
  `home.test.tsx:580,586,614` — `last-position-card` con `toBeVisible()`,
  `fireEvent.press` y `queryByTestId`. Todos sobreviven a R3.
- `food.test.tsx:332,355,360` — `plan-warning-*` por `testID` exacto y por
  regex `/^plan-warning-/`: el `testID` nuevo evita ese prefijo.
- `health.test.tsx:211` — `health-loading` contiene `h-12`: no se toca.
  `health.test.tsx:316` — `vaccines-skeleton` con `toBeVisible()`: R2 solo
  cambia el radio. `health.test.tsx:359-367` — color del icono `#F59E0B` /
  `#FBBF24`: `--warning` no cambia.
- `weight-log.test.tsx:170` — `weight-log-loading` contiene `h-40`: no se toca.
  `:269` — `weight-chart` por `testID`: R9 lo envuelve, no lo mueve.
- `reminders/index.test.tsx:160` — `className` de `reminders-delete-confirm`
  (`bg-danger`): no se toca. `:200` — 3 `reminder-row-skeleton-*`. `:323-329` —
  `within(pill-*)` por texto. `:341` — `'💉'`. `:353,358` — `opacity-50` de
  `reminder-row-*`. Todos verdes.
- `docs/index.test.tsx:96-111` — `testID` de documento y su orden: R10 solo
  cambia el `className` del `Text` del tipo.
- `profile/index.test.tsx:681` — `className` de "Información" (#61 R9): R6 toca
  `InfoRow`, no ese `Text`.
- `add-reminder/index.test.tsx:187` — `'💉 Vaccine'`. `add-pet` y
  `add-reminder`: ningún test asevera `placeholder` ni `className` de sus
  `TextInput` (verificado con `grep -rn "placeholder" --include="*.test.tsx"`,
  que solo devuelve los "placeholders de tabs" de `screens.test.tsx:71-87`,
  que son otra cosa).
- `design-drift.test.ts` — ninguna propuesta introduce `[...]`, hex ni
  `StyleSheet.create`. `legibility-classnames.test.ts:145-149` — R13 pide
  `'accent-strong'`, no `'accent'`.

---

## 7. Texto exacto a insertar en `docs/ui-guidelines.md` (lo escribe R1)

Se añade al final de §Decisiones fijas de este repo, como punto **12**. El
humano puede reescribirlo en el gate; lo que no es negociable es que la escala
quede en la carta y no solo en esta spec (criterio de aceptación 1).

> 12. **Escala de radios** (feature #62, 2026-09-04). Tres radios, uno por rol,
>     y ninguno más:
>     - **Superficie de card** → `rounded-card` (token `--radius-card`, 20 px).
>       Se obtiene usando `src/components/card.tsx`, no repitiendo la clase.
>     - **Control, tile, input, botón y píldora de dato** → `rounded-xl`
>       (12 px), que es el mismo valor que `--field-radius: 0.75rem`, de modo
>       que botón e input comparten esquina dentro de un formulario.
>     - **Cápsula** (chip, avatar, píldora de pestaña, botón circular de
>       volver) → `rounded-full`.
>
>     `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm` quedan
>     **prohibidos en `mobile-pet-tracker/src/`**: no son un cuarto rol, son
>     drift. El grep que lo verifica vive en
>     `src/__tests__/consistency-classnames.test.ts`.
>
>     Dos corolarios mecánicos: todo `Skeleton` lleva el radio del contenido
>     que sustituye (card ⇒ `rounded-card`, control ⇒ `rounded-xl`), y toda
>     esquina no-cápsula **que el repo dibuja por su cuenta** (`View`,
>     `Pressable`, `TextInput`, el `Card` compartido) declara
>     `style={CONTINUOUS_CORNER}` de `src/theme/native-styles.ts` — los
>     componentes de heroui-native ya lo traen de fábrica y no se envuelven
>     para añadírselo.

---

## 8. Solape con la feature #63 (`mobile-detail-screens-state-reset`)

#63 (pending, P2) va a tocar `src/screens/add-reminder/index.tsx` y
`src/screens/pairing/index.tsx` para resetear estado local. #62 toca esos
mismos dos archivos:

| Archivo | Qué toca #62 | Qué tocará #63 |
|---|---|---|
| `src/screens/add-reminder/index.tsx` | `←` → `ArrowLeft` (R7), `placeholderTextColor` + `border` del `title-input` (R12), 3 × `CONTINUOUS_CORNER` (R14) | los 9 `useState` de `:39-47` y su reset |
| `src/screens/pairing/index.tsx` | `←` → `ArrowLeft` (R7), `border` del `activation-code-input` (R12), 2 × `CONTINUOUS_CORNER` (R14) | `code`, `actionError`, `phase`, `readyDevice` y el cleanup de `useFocusEffect` |

**No se solapan en líneas ni en concepto**: #62 solo cambia `className` y props
de estilo; #63 solo cambia estado. **La que se implemente segunda rebasa** su
branch sobre `main` y resuelve el conflicto de contexto, que será trivial.

**#62 no arregla el reset de estado**, aunque el defecto sea visible mientras
edita esos archivos: es cambio de conducta y pertenece a #63.

---

## 9. Cosas detectadas al redactar la spec que quedan anotadas, no arregladas

1. **`pairing-link` sin `hitSlop`** (`src/screens/profile/index.tsx:288-301`).
   Es una fila de enlace `px-3 py-2` (~36 pt) sin `TOUCH_SLOP`, creada por #42
   después de que #61 R10 cerrara sus 13 sitios. Es un residuo del hallazgo
   **13** (feature #61), no de los 15 de #62. R7 edita ese `Pressable` (le
   cambia el `›` por `ChevronRight`) pero **no** le añade `hitSlop`: si se
   quiere cerrar, es una línea y una decisión del `leader`, no de esta spec.
2. **Hallazgo 18 (`--radius-card` 20 px vs 16 px)**: cerrado por decisión
   humana del 2026-09-03. No se reabre. Queda como punto a comparar en el
   próximo smoke, **al mismo tamaño físico** — el `PhoneFrame` del Make mide
   260 × 530 px y un valor absoluto copiado 1:1 renderiza ~1,5× más pequeño en
   proporción sobre un teléfono de 390 dp, lo que tira hacia radios mayores,
   no menores. `global.css` no se toca en toda la feature.
3. **`summary-skeleton`** (`home.tsx:252`, `rounded-xl`) sustituye a una fila
   sin radio propio: no hay forma final que igualar. Fuera de R2.
4. **`pet-card-error`** (`home.tsx:140`) es un `HeroUICard` sin clase de radio:
   no es una receta de card a mano y el audit no lo lista. Fuera de R3.

---

## 10. Orden de implementación (obligatorio)

1. **R1** — la escala en la carta + el radio del botón primario. Es la
   decisión que gobierna R2, R3 y R4; va primero para que el resto tenga regla
   contra la que medirse.
2. **R2** — los 3 skeletons.
3. **R3** — las 4 superficies al `Card` compartido. Antes que R14, para que sus
   esquinas las herede del componente y no haya que tocarlas dos veces.
4. **R4** — los 6 radios restantes. Cierra "cero `rounded-2xl` / `rounded-lg`".
5. **R5** … **R13** — independientes entre sí, en orden de id.
6. **R14** — `CONTINUOUS_CORNER`, sobre el árbol ya estabilizado por R1-R13.
7. **R15** — `TABULAR_NUMS`.
8. **R16** — gate mecánico del `reviewer` sobre el árbol completo.

Cada uno con su ciclo TDD completo (ver [[tasks]]): commit rojo que nombra el
R-id, commit verde, commit de refactor si hace falta. C4 de
[[../../CHECKPOINTS|CHECKPOINTS]] exige el historial rojo→verde; en #19 se
entregó todo en un solo commit y eso **no** se repite aquí.
