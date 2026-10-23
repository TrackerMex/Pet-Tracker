---
feature: "mobile-canvas-foundations"
status: spec_ready
tags: [mobile, ui, design]
---

# Diseño — [[mobile-canvas-foundations]]

## Decisiones técnicas

Rutas relativas a `mobile-pet-tracker/`. Las decisiones con su porqué están en
requirements.md § Decisiones (D1 a D9); aquí va solo cómo se materializan.

1. **Tokens en `src/theme/global.css`** (R1, R3, R5, R14). Los colores de estado
   cambian de valor en su sitio del bloque `@variant light` (tanto la forma
   corta, que lee `useThemeColors` por `--x`, como la `--color-x`). Los labios
   y sombras nuevos van solo en forma `--color-`, como `--color-lip` y
   `--color-lip-gray`, porque ningún componente los pide por forma corta y
   `useThemeColors` resuelve primero `--color-x`. Tracking e interlineado van
   en `@theme` tras `--tracking-code`: Tailwind v4 genera `tracking-*` y
   `leading-*` desde ahí. Ninguno lleva `--text-*--line-height`: uniwind
   multiplica el interlineado sin unidad por el tamaño, así que la clase
   `leading-*` solo vale con una `text-*` en el mismo elemento (misma regla que
   el tracking en `em`).
2. **Labio por estilo, no por borde** (R6 a R10). Hoy el labio es
   `border-b-N` dentro del alto del botón. El canvas lo pinta como
   `box-shadow` que cuelga fuera. `useChunkyLip()` ya devuelve `boxShadow` para
   `primary`, `primaryCompact` y `neutral`; #197 lo amplía a 11 claves y migra
   las cinco recetas `border-b-N` que quedan. Los valores son los literales
   del canvas: offset y color, sin blur ni spread. Las tres `tile*` son
   `inset` con offset negativo (labio interior inferior).
3. **`rise`** (R11 a R13). `MOTION_RISE_TIMING` reutiliza `MOTION_SURFACE_MS`
   (400) y fija el `ease-out` de CSS como `Easing.bezier(0, 0, 0.58, 1)`. La
   firma de `homeEntering(delayMs, offsetY)` no cambia; cambia la animación
   interna y el valor que pasa `HomeEntrance`. Bajo reduce motion,
   `HomeEntrance` no pasa `entering`: más simple que mantener un fundido que
   el canvas no tiene.
4. **`useShadows()`** (R14, R15) copia el patrón de `useChunkyLip()`: pide
   colores a `useThemeColors`, memoriza con `useMemo` sobre los colores
   (no sobre el array, que es nuevo en cada render) y devuelve
   `Record<clave, ViewStyle>` con `boxShadow`. `card` usa dos capas y su color
   lejano oscuro es transparente porque el canvas oscuro solo define la cercana.
5. **`ToggleSwitch`** (R16, R17) envuelve el `Switch` de heroui-native 1.0.8:
   pista con `animation.backgroundColor.value = [lipGray, accent]`, pulgar con
   `animation.left.value = 3` (heroui lo interpreta como distancia a cada
   borde). Props explícitos, sin spread: #187 R1 trata un spread sobre un
   elemento heroui como `className` opaco y el inventario solo admite
   `password-input`. `style` y `hitSlop` existen porque las tres pantallas que
   lo adoptarán pasan `KEEP_OPACITY` y `hitSlop`.
6. **`ScreenHeader`** (R18, R19) compone el `BackButton` existente (que ya
   resuelve `router.back()` o `fallback`) con trazo 2.4 y el título en
   contenido de D-H. El tamaño elige entre dos `className` literales completos
   en un objeto constante, para que uniwind los vea al compilar.
7. **Sin cablear** (R20). Componente, tests y carta; ninguna pantalla los
   importa y `src/app/_layout.tsx` no cambia. CF lo comprueba con un `it.each`
   sobre los imports de producción.
8. **Test de canvas único** (CF). Un solo fichero
   `src/__tests__/canvas-foundations.test.ts` lee los artboards congelados en
   `specs/mobile-canvas-foundations/canvas/` (ruta `join(process.cwd(), '..', …)`,
   como los demás tests de fidelidad que leen `docs/`) y compara cada literal
   del canvas con el valor de producción. Así ningún candado es tautológico:
   si alguien cambia el token, falla contra el canvas, no contra una copia.

## Archivos afectados

La app móvil no tiene capas domain/application/infrastructure en este cambio:
todo es presentación (tema, componentes, pantallas) más la carta.

**Tema (`src/theme/`)**
- `global.css` — modificado (R1, R3, R5, R14)
- `chunky-lip.ts` — modificado (R6)
- `motion.ts` — modificado (R11)
- `shadows.ts` — nuevo (R15)

**Componentes (`src/components/`)**
- `toggle-switch.tsx` — nuevo (R16, R17)
- `screen-header.tsx` — nuevo (R19)
- `back-button.tsx` — modificado: prop `strokeWidth` (R18)
- `celebration.tsx` — modificado: `tracking-title` (R4)

**Pantallas**
- `src/app/(tabs)/food.tsx`, `src/screens/health/index.tsx`,
  `src/screens/profile/index.tsx` — `tracking-title` (R4)
- `src/screens/add-reminder/index.tsx` — chips (R7)
- `src/screens/alerts/index.tsx` — ack (R8)
- `src/screens/meal-schedule/index.tsx` — resumen, Editar, Añadir (R9)
- `src/screens/home/home-entrance.tsx` — rise (R12, R13)

**Tests nuevos**: `src/__tests__/canvas-foundations.test.ts`,
`src/theme/__tests__/shadows.test.tsx`,
`src/components/__tests__/toggle-switch.test.tsx`,
`src/components/__tests__/screen-header.test.tsx`.

**Tests enmendados**: los de requirements.md § «Candados que esta feature
revierte» (inventario cerrado) más los `it` nuevos de GC, CL, MT y BB.

**Docs (raíz del repo)**: `docs/ui-guidelines.md` (R21).

**No cambian**: `src/app/_layout.tsx`, `package.json`, `bun.lock`,
`src/theme/use-theme-colors.ts`, `generate-plan-button`.

## Texto canónico de la Enmienda #197

Cada bloque va entre una línea ` ```markdown ` y una línea ` ``` `; su
contenido se copia byte a byte en `docs/ui-guidelines.md`. CF (R21) lee este
fichero, extrae cada bloque por su título `### Bloque «…»` y comprueba que la
carta contiene el bloque exactamente una vez. Las líneas conservan la sangría
de la carta (tres espacios en la regla de tipografía, cuatro en el punto 13).

### Bloque «Línea de tracking»

Sustituye a la línea que hoy empieza por `   Tracking fuera de la escala de Tailwind`.

```markdown
   Tracking fuera de la escala de Tailwind (fidelidad al canvas, #174): `--tracking-title: -0.02em`, `--tracking-caps: 0.06em`, `--tracking-eyebrow: 0.08em`, `--tracking-code: 0.14em`, `--tracking-display: -0.5px`, `--tracking-section: 1.5px`, `--tracking-mono: 0.04em`, `--tracking-dialog: -0.01em` (#197); la clase `tracking-*` va con una clase `text-*` en el mismo elemento, porque uniwind multiplica el `em` por su tamaño.
```

### Bloque «Línea de interlineado»

Línea nueva, justo debajo de la de tracking.

```markdown
   Interlineado fuera de la escala de Tailwind (fidelidad al canvas, #197): `--leading-body: 1.4`, `--leading-note: 1.45`; la clase `leading-*` va con una clase `text-*` en el mismo elemento, porque uniwind multiplica el interlineado sin unidad por su tamaño. Los interlineados en píxeles del canvas usan la escala de Tailwind (`leading-3.5`, `leading-5.25`, `leading-8`, `leading-8.5`) y 1.5 es `leading-normal`.
```

### Bloque «Punto 13»

Sustituye, en el mismo orden y sitio, a las líneas del **Chip seleccionado**,
los **Secundarios de Horario** y el **Secundario compacto de fila**.

```markdown
    - **Chip seleccionado** (fidelidad al canvas, #178; labio por estilo, #197): cápsula `rounded-full bg-accent` con `style={chunkyLip.primaryCompact}`, un labio de 3 px que cuelga fuera del alto; el chip sin seleccionar no lleva labio.
    - **Secundarios de Horario** (fidelidad al canvas, #179; labio por estilo, #197): «Editar» `h-9 rounded-10 border-2 border-lip-gray bg-surface` con `style={chunkyLip.neutralCompact}` y «Añadir comida» `h-12.5 rounded-14 border-2 border-lip-gray bg-surface` con `style={chunkyLip.neutral}`, con el labio colgando fuera del alto; el resumen verde lleva `chunkyLip.summary`; «Generar plan» es tonal de la categoría violeta y sigue sin labio hasta #200.
    - **Secundario compacto de fila** (#174; labio por estilo, #197): el ack de cada fila abierta de Alertas lleva `h-8.5 rounded-10 border-2 border-lip-gray bg-surface px-3` con `style={chunkyLip.neutralCompact}`, etiqueta `text-xs font-extrabold text-foreground` y `hitSlop={TOUCH_SLOP}` (34 + 12 = 46 de diana). Es la única excepción a la receta del secundario neutro; el inventario de #166 R3 lo lista por su `testID`.
```

### Bloque «Enmienda»

Se añade al final del fichero, tras la casilla de la Enmienda #195 y una línea
en blanco.

```markdown
## Enmienda #197 — cimientos del canvas

Fecha: 2026-10-23. Feature #197 `mobile-canvas-foundations`. Fija los tokens y las piezas que consumen las pantallas de la ola 2 del canvas; no cambia el layout de ninguna pantalla.

1. **Colores claros.** `--border` y `--separator` `rgba(13,17,23,0.08)`, `--danger` `#D92D20`, `--warning` `#B54708` y `--warning-strong` `#93370D` (AA sobre `bg-surface` y sobre `bg-warning-soft`). El tema oscuro no cambia.
2. **Tipografía.** Los tokens de la línea de tracking y de la de interlineado son los únicos fuera de la escala de Tailwind. `tracking-tight` no se usa en la app: el título grande lleva `tracking-title`.
3. **Labios por estilo.** Todo labio es `style={chunkyLip.<variante>}` de `useChunkyLip()` (`src/theme/chunky-lip.ts`) y cuelga por debajo del alto del elemento; ningún `className` lleva `border-b-N` ni `border-black/25` como labio. Variantes: `primary`, `primaryCompact`, `hero`, `summary`, `neutral`, `neutralCompact`, `danger`, `violet`, `tileViolet`, `tileAmber` y `tileBlue`. Una variante nueva se añade al hook con el literal de su artboard; no se compone a mano en la pantalla.
4. **Entrada `rise`.** Excepción a «springs sobre timings»: la entrada escalonada de Inicio usa `MOTION_RISE_TIMING` (400 ms, `ease-out`) y sube `MOTION_RISE_OFFSET_Y` (14). Bajo reduce motion no hay entrada. Otro elemento solo usa este timing con una enmienda.
5. **Sombras.** Toda sombra nueva sale de `useShadows()` (`src/theme/shadows.ts`): `card`, `dialog`, `floating`, `label`, `marker`, `ring`, `segment`, `sheet`, `tabBar` y `toast`; no se añaden `shadowColor` ni `elevation` de React Native. Horario e Historial de comidas siguen sin sombra (#179).
6. **Interruptor.** Todo interruptor binario será `ToggleSwitch` (`src/components/toggle-switch.tsx`): pista de 48 x 28 en `lip-gray` apagada y `accent` encendida, pulgar blanco de 22 a 3 del borde y sin sombra. Cada pantalla lo adopta en su feature de la ola 2.
7. **Cabecera en contenido.** `ScreenHeader` (`src/components/screen-header.tsx`) es la forma del canvas para D-H: volver de 44 con trazo 2.4 y `-ml-2.5`, eyebrow opcional, título de 26 (o 24) `font-black tracking-title` y un accesorio opcional a la derecha. La pantalla que lo adopta pone `headerShown: false` en su ruta dentro de su propia feature; mientras no lo adopte, D-H rige tal como está escrita.

Detalle y tests en `specs/mobile-canvas-foundations/requirements.md` (R1 a R23).

- [ ] Enmienda #197 aprobada por humano
```

Al firmar, el humano cambia `[ ]` por `[X]` en la carta; CF compara el bloque
con la casilla normalizada por la regex `/- \[[ xX]\] Enmienda #197 aprobada por humano/`,
así que la firma no pone el test en rojo.

## Alternativas descartadas

- **Labio como `border-b-N` con el alto compensado**: es lo que había. Mete el
  labio dentro del alto (el cuerpo mide menos que en el canvas) y obliga a una
  clase por grosor. `boxShadow` sin blur es el literal del canvas y ya lo usa
  `useChunkyLip()`.
- **Clases `shadow-*` de Tailwind para sombras y labios**: uniwind no traduce
  `box-shadow` con varias capas ni `inset` de forma fiable y no admite colores
  de token sin clases arbitrarias `[…]`, que la carta prohíbe. El hook con
  `boxShadow` de React Native (nueva arquitectura) cubre todos los casos.
- **Spring para `rise`**: un spring no reproduce `400ms ease-out` ni su
  duración fija, y el escalonado de 60 ms dejaría de cuadrar con el canvas.
- **Conservar el fundido bajo reduce motion**: el canvas lo anula con
  `animation:none`; mantenerlo era una decisión de #152 que el canvas
  contradice.
- **Cablear `ToggleSwitch` y `ScreenHeader` aquí**: multiplicaría el diff por
  cada pantalla y mezclaría cimientos con layout; el plan de paridad
  (`progress/plan_canvas-parity-2026-10-23.md` §2) reserva el cableado a la ola 2.
- **`ScreenHeader` como `header` del stack** (`options.header`): el canvas
  pinta el título dentro del contenido que hace scroll (D-H); una cabecera
  nativa fija no lo reproduce.
- **`Switch` de `@expo/ui`**: es nativo de plataforma y no admite la pista de
  48 x 28 ni los colores de token del canvas; heroui-native ya está instalado
  y es animable.
- **`expo-linear-gradient` para el degradado inferior**: vetado; el degradado
  queda fuera de alcance.
- **Un test de fidelidad por pantalla**: los literales del canvas son de
  cimientos, no de pantalla; un solo CF evita repartir el mismo candado en
  cinco ficheros.
