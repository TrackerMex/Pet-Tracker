---
feature: "mobile-add-reminder-chip-lip-clip"
status: draft        # draft | approved
tags: [mobile, reminders, ui, spec]
---

# Diseño — [[mobile-add-reminder-chip-lip-clip]] (#232)

> Decisiones técnicas de alto nivel. Requisitos en [[requirements]]. Rutas
> relativas a `mobile-pet-tracker/`. Capas de `docs/architecture.md`: todo vive
> en la capa de presentación móvil; sin dominio, sin aplicación, sin
> infraestructura.

## Causa raíz

El labio del chip seleccionado es una `boxShadow` sólida de 3 px sin desenfoque
(`chunkyLip.primaryCompact`) que se pinta **fuera** del cuadro del `Pressable`.
Las filas de Tipo y de Aviso son `ScrollView horizontal`, y un `ScrollView`
recorta a su propio cuadro, que mide lo que miden los chips (38 px, `h-9.5`).
El resto de chips con labio de la app viven en `View` que no recortan; estas dos
filas son el único caso (requirements D5).

## Archivos afectados

| Capa | Archivo | Cambio |
|---|---|---|
| Presentación | `src/screens/add-reminder/index.tsx` | Dos constantes de módulo y su uso en las dos filas |
| Presentación (test) | `src/screens/add-reminder/index.test.tsx` | `describe('#232 R1…')` nuevo al final; un `it` de #213 R5 enmendado |
| Docs | `specs/mobile-add-reminder-chip-lip-clip/*` | Esta spec |

Ningún otro archivo. Ni `src/theme/`, ni `src/i18n/`, ni los guards de
`src/__tests__/`, ni `docs/`.

## La medida, exacta

En `src/screens/add-reminder/index.tsx`, junto a las otras constantes de nivel
de módulo (después de `SELECTED_CHIP`):

- `CHIP_ROW_CONTENT`: objeto de estilo con exactamente
  `gap: 8, paddingRight: 20, paddingBottom: 3`.
- `CHIP_ROW_STYLE`: objeto de estilo con exactamente `marginBottom: -3`.
- Un comentario de una línea que diga que el 3 es el `offsetY` de
  `chunkyLip.primaryCompact` y que el margen negativo devuelve al formulario la
  altura que el relleno suma.

En las dos `ScrollView` (`testID="type-chips-row"` y `testID="advance-chips-row"`):

- `contentContainerStyle={CHIP_ROW_CONTENT}` sustituye al literal
  `contentContainerStyle={{ gap: 8, paddingRight: 20 }}` (2 → 0 ocurrencias).
- `style={CHIP_ROW_STYLE}` se añade; `className="-mr-5"` **no cambia**.
- `horizontal`, `showsHorizontalScrollIndicator={false}`, los chips y todo lo
  demás no cambian.

El nombre de las constantes está fijado porque las anclas de
[[requirements]] §Evidencia las cuentan; la spec no pide otra abstracción.

## Por qué funciona (y qué se vigila)

- **Altura de la fila**: contenido 38 + `paddingBottom` 3 = 41 → el `ScrollView`
  mide 41 y el labio (los 3 px inferiores) cae dentro.
- **Altura aportada al formulario**: `marginBottom: -3` en el `ScrollView`
  resta lo que el relleno suma; el `View` contenedor (`gap-2`, etiqueta +
  fila) mide como antes y las secciones siguientes no se mueven. El labio ocupa
  3 px del `gap: 16` del formulario, que está vacío en ese tramo.
- **Riesgo conocido**: la fila se pinta 3 px por debajo del cuadro de su
  contenedor. React Native tiene `overflow: visible` por defecto en `View`, y
  ningún ancestro de la pantalla lo sobrescribe (el `ScrollView` vertical
  del formulario recorta a su borde inferior, no entre secciones), así que no
  debe recortarse. Lo verifica el paso 1 del smoke G2 en Android, no jest. Si el
  smoke mostrara recorte, el plan B es quitar `CHIP_ROW_STYLE` y aceptar 3 px
  más de separación; sería una enmienda de R2 con nueva firma.
- **Sin deriva con el labio**: R1 lee de `chunky-lip.ts` el `offsetY` real de
  `primaryCompact` y exige que sea igual al relleno. Si alguien sube el labio a
  4, el test falla en las dos filas.
- **Un candado por rama**: R1 y R2 usan `it.each` sobre las dos filas, así una
  fila arreglada y la otra no (la zona ciega obvia) ponen rojo solo a la
  suya.

## Guards de la carta cruzados (sin movimientos)

El cambio no añade ninguna clase de Tailwind/uniwind (`-mr-5` ya estaba), ni
color, ni radio, ni copy. Se cruzó contra `design-drift.test.ts` (patrones de
`HEX_LITERAL`, `ARBITRARY_CLASS`, `StyleSheet`, `SHADOW_ESCAPES`: las
constantes usan nombres `gap`/`paddingRight`/`paddingBottom`/`marginBottom`, y
`SHADOW_ESCAPES` busca `shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation:`),
`consistency-classnames.test.ts` y `legibility-classnames.test.ts` (cuentan
clases en `className`, no estilos de objeto), `chunky-cta-canvas-fidelity.test.ts`
(inventarios de labios por `chunkyLip.*`, que no cambian: sigue habiendo 3
`style={selected ? chunkyLip.primaryCompact : undefined}`) y `ui-copy-table.ts`
(sin claves nuevas ni retiradas). El handoff exige correr esas suites antes y
después, porque un recuento por contenido (no por línea) es lo único que las
protege.

## Alternativas descartadas

1. **`overflow: 'visible'` en el `ScrollView`.** En Android un `ScrollView`
   recorta siempre a su cuadro: no arregla nada.
2. **`paddingBottom` en el `ScrollView` sin compensar.** Funciona pero mueve 3
   px cada sección siguiente en las dos filas (6 px acumulados al llegar a
   Guardar); el humano pidió arreglar el recorte, no reflowar la pantalla.
3. **Subir `h-9.5` a `h-10.5` en el chip.** Cambia el chip del canvas (36/38 px)
   y arrastra los pins de `#178 R10`/`#178 R12`, `#213 R4` y los guards de
   radios y alturas.
4. **Sustituir la `boxShadow` del labio por un `border-b-3`.** Contradice la
   regla 13.3 de la carta («labios por estilo», #197): ningún `className`
   lleva `border-b-N` como labio.
5. **Cambiar la fila a `flex-wrap`.** Revierte #213 R5 (una sola fila que
   sangra hasta el borde).
6. **Un componente `ChipRow` compartido.** Dos usos en un solo fichero; la
   abstracción cuesta más que las dos constantes.
7. **Enmendar la carta.** La regla 13 ya dice «un labio de 3 px que cuelga fuera
   del alto»; el arreglo la cumple. No hay G4.

## Qué no cambia

Sin copy nuevo (no hay G1), sin i18n, sin backend, sin dependencias, sin módulo
nativo, sin tokens, sin artboards (los de `specs/mobile-reminders-recurrence/canvas/`
siguen siendo la referencia y no se copian a esta spec).
