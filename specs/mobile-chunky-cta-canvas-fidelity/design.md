---
feature: "mobile-chunky-cta-canvas-fidelity"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-chunky-cta-canvas-fidelity]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta que rige la UI móvil.
> Esta feature no toca el backend: la regla de capas de
> [[../../docs/architecture|architecture]] no aplica.

## Decisiones técnicas

- **El labio es una sombra sólida externa, no un borde (R1, R2; D1).** El canvas
  dibuja `box-shadow: 0 4px 0 var(--lip)`: el cuerpo mide 56 y el labio cuelga
  fuera. Con `border-b-4` el cuerpo útil mide 52. React Native 0.86 trae
  `boxShadow` como estilo (sin `shadowColor`/`elevation`, que la carta prohíbe),
  y `heroui-native` 1.0.8 reenvía `style` al `Pressable` raíz del `Button` como
  `[buttonStyleSheet.buttonRoot, style]`, sin `overflow: 'hidden'`, así que la
  sombra no se recorta. Verificado leyendo el componente; ningún `Button` de
  `src` pasa hoy `style`, no hay precedente que se rompa.
- **El color del labio sale de tokens, no de hex (R1, R2).** `--color-lip`
  (nuevo) y `--color-lip-gray` (existente) viven en `src/theme/global.css`, por
  tema. Un hook `useChunkyLip()` los lee con `useThemeColors(['lip', 'lip-gray'])`
  y devuelve tres estilos listos (`primary`, `primaryCompact`, `neutral`). Así
  `src` no tiene un solo hex nuevo y el tema oscuro funciona sin código extra.
- **Estabilidad de referencia (R2.3).** `useThemeColors` devuelve un array nuevo
  en cada render y, si no encuentra un token, cae al color de primer plano. El
  `useMemo` depende de las dos cadenas, no del array, para no re-crear estilos
  en cada render ni forzar re-render de `PopIn` y `Button`.
- **Tolerancia a dobles de prueba (R2.4).** Dos pruebas de pantalla
  (`alert-detail`, `geofence-editor`) sustituyen `useThemeColors` o `uniwind`. El
  hook no desestructura con supuestos: si el doble devuelve una lista corta, el
  color queda `undefined` y no lanza.
- **Dónde se llama el hook (R7.4).** Una vez por componente que renderiza el
  `Button` o el tile (`const chunkyLip = useChunkyLip();`), nunca dentro de una
  rama condicional. Si el `Button` vive en un auxiliar que no es componente, el
  hook se llama en el componente envolvente y el auxiliar cierra sobre
  `chunkyLip`. Codex lo comprueba al leer cada fichero; el recuento de
  consumidores (17) lo candan R7.4 y la sonda S6.
- **17/800 con `Text` plano, no con `Button.Label` (R3.2, R4.2, R6, R9; D3).**
  `heroui-native` 1.0.8 compone `className` con `tailwind-merge` 3.6, que expulsa
  `text-13/15/17` de la escala propia delante de una clase de color. #187 lo
  midió y estableció la regla: `text-<n>` solo en el `Text` de react-native hijo.
  La receta la sigue: 15 `Button.Label` pasan a `Text`. El candado AST de #187
  (`heroui-text-size-merge.test.ts`) mide después 211 elementos HeroUI y 167 con
  `className`, y sus pisos se bajan a eso con una decisión humana explícita (D3).
- **Los tamaños `text-sm` y `text-base` sobreviven en `Button.Label`.** Los
  conservan `reminders-add-link` (`text-sm`, fijado por `design-drift` #178 R13)
  y `alert-detail-view-map` (`text-base`, fijado por #180): `tailwind-merge` no
  los expulsa, así que no entran en las 15 conversiones.
- **Una sola altura, 56 (D2).** `h-14` en todos los cta y neutros, con las dos
  excepciones nombradas: `alert-detail-view-map` conserva `h-13` (52) y el
  compacto `h-10` (40). Los `min-h-11` de tres cta desaparecen.
- **El tile del candado lleva `bg-accent` antes de `rounded-16` (R5.2, R7.2).** El
  inventario de primarios busca `rounded-16 bg-accent(?=[\s'"\`])`; con el
  orden invertido el tile quedaría contado como botón y el inventario de 16
  ficheros daría 17 en `forgot`. La literal y el orden los fija R5.2 y los repite
  la carta (R11.1). El tile pasa `[CONTINUOUS_CORNER, chunkyLip.primary]`; el
  `PopIn` lo aplica antes de su estilo animado (`[style, animatedStyle]`), sin
  chocar con él (la animación solo mueve opacidad y escala).
- **El candado de inventario cambia de forma, no se afloja (R7, R10).** Hoy el
  inventario de #166 cuenta clases (`border-b-4` 18). Tras esta feature las
  clases del labio desaparecen y el contador pasa a cero; el candado que
  protege es nuevo: hay 16 + 1 + 6 botones y exactamente esos llevan
  `chunkyLip`, y ningún `Button` con `bg-accent` queda fuera de la tabla. Cada
  cláusula universal tiene un `it` por rama (primary, neutral, compacto;
  `alerts` y `meal-schedule` por separado; `bg-accent` fuera de la tabla).
- **Los candados viejos se reescriben en su sitio (R10).** Mismo `it`, misma
  intención, nuevas cifras y sufijo `(enmendado por #177 R10)`. Ninguno se
  borra: borrar un candado esconde la regresión que protegía. Los pisos de
  #187 son el único valor que baja (R9) y llevan su propio commit y su D3.
- **Dos mecánicas del labio conviven (D5).** Los elementos compactos fuera de
  alcance (chip, ack de fila, Horario, tarjeta de resumen) siguen con
  `border-b-3/5/6 border-black/25` o `border-lip-gray`. Los recuentos de R7.1 los
  nombran uno a uno, así que un tercer sitio con `border-b-*` hace caer el
  candado. Una feature posterior los migrará.
- **Docs.** La carta §13 pasa de «nunca una sombra» a «una sombra sólida sin
  desenfoque en `--lip`». Se añade, además, la Enmienda #177 con casilla
  tolerante y un bloque espejo en la spec de #166 (R11).

## Archivos afectados

Capa **theme** (`mobile-pet-tracker/src/theme/`):
- `global.css` — añade `--color-lip` en el tema claro y en el oscuro, junto a `--color-lip-gray`.
- `chunky-lip.ts` — nuevo; exporta `useChunkyLip` y el tipo `ChunkyLip`.
- `__tests__/global-css.test.ts` — `describe` nuevo de R1.
- `__tests__/chunky-lip.test.tsx` — nuevo; siete `it` de R2.

Capa **components** (`src/components/`):
- `celebration.tsx` — cta (`primary.testID`) y neutro (`secondary.testID`), dos etiquetas convertidas.
- `empty-state.tsx` — cta (`${testID}-action`), una etiqueta convertida.

Capa **screens** (`src/screens/<nombre>/index.tsx`), 15 ficheros de producción:
- cta (14 ficheros): `login`, `register`, `forgot`, `reset-password`, `alert-detail`, `welcome`, `pairing`, `home`, `add-pet`, `add-reminder`, `docs-upload-form`, `geofence-editor`, `geofences`, `weight-log` (con `forgot` y `alert-detail` además neutros o tile; el recuento exacto lo dan las tablas de R3, R4 y R5).
- neutro: `welcome`, `forgot`, `docs-upload-form`, `reminders`, `alert-detail` (solo labio).
- compacto: `reminders`.
- tile: `forgot`.
- `alerts` y `meal-schedule` **no se tocan** (R8).

Capa **tests** (`src/__tests__/` y pruebas colocadas):
- `chunky-cta-canvas-fidelity.test.ts` — nuevo; títulos `#177 R<n>: …`.
- Reescritos en su sitio: `consistency-classnames.test.ts`, `design-drift.test.ts`, `account-screens-polish.test.ts`, `heroui-text-size-merge.test.ts` (solo los dos pisos), `alert-detail-canvas-fidelity.test.ts` (solo si una aserción lee la receta vieja; sus líneas de la carta no se mueven).
- Pruebas colocadas de los consumidores que afirman `className` o etiqueta (lista en R10).

Capa **docs/specs**:
- `docs/ui-guidelines.md` — §12, §13, párrafo del candado de #172 y la sección `## Enmienda #177`.
- `specs/mobile-chunky-cta/requirements.md` — bloque `## Enmienda #177` añadido al final.
- `specs/mobile-chunky-cta-canvas-fidelity/traceability.md` y `progress/impl_mobile-chunky-cta-canvas-fidelity.md` — cierre.

## Guards de la carta (recorrido hecho al escribir)

- `design-drift`: sin hex en `src` (el color del labio lo trae el token); sin
  `StyleSheet`; sin `shadowColor|shadowOffset|shadowOpacity|shadowRadius` ni
  `elevation:` (solo `boxShadow`, que la carta permite en la línea «solo
  `boxShadow`»); sin radios `rounded-2xl|lg|md|sm`; las listas de `text-17` y
  `rounded-16` se reescriben (R10 puntos 9 y 10).
- `legibility-classnames`: ninguna combinación nueva de color de texto sobre
  fondo; `text-accent-strong` de Bienvenida sigue en 2 (N1 sustituye la
  etiqueta).
- `ui-copy-table` y `profile-canvas-fidelity`: sin copy nuevo, sin `text-13`,
  `text-26`, `rounded-hero` ni `rounded-tile` nuevos.
- C8: ninguna clase entre corchetes.
- Comentarios: `#177` solo como `#177 R<n>` (`HEX_LITERAL` exime solo ese
  formato).

## Alternativas descartadas

- **`border-b-4 border-lip` dentro del botón (D1 b).** No es fiel: cuerpo de 52
  más 4. Además conserva `border-b-4` en 18 sitios y mantiene el problema que
  se quiere resolver.
- **Clase de tema `shadow-lip` (D1 c).** uniwind 1.11 tiene parser de
  `boxShadow`, pero ningún test de Jest puede comprobar que la clase pinte;
  un fallo sería silencioso en un candado verde.
- **Componente propio `ChunkyButton`.** Esconde el `Button` de HeroUI y obliga a
  reescribir 23 sitios y sus pruebas colocadas; la receta ya cabe en una cadena
  de clases más un `style`.
- **`Button.Label className="text-17 …"`.** Vetado por #187 (la clase se
  expulsa): sería una receta que parece correcta y pinta a 16 px.
- **Una función de estilo `chunkyLip(theme)` sin hook.** Obliga a pasar el
  tema a mano desde cada pantalla; el hook reutiliza `useThemeColors`, que ya
  resuelve claro y oscuro.
- **Mover todos los labios compactos a la mecánica nueva en esta feature (D5).**
  Ensancha el alcance a #174, #178 y #179 con sus radios propios; se registra
  como feature posterior.
