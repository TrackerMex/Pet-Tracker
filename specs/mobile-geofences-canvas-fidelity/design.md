---
feature: mobile-geofences-canvas-fidelity
id: 189
status: draft        # draft | approved
tags: [mobile, ui, canvas, geofences, spec]
---

# Diseño — #189 Zonas seguras y Editor de zona fieles al canvas

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]] para las capas.
> Es trabajo solo de presentación en `mobile-pet-tracker/` (capa de UI): no toca domain, application ni
> backend. Reglas de UI: `docs/ui-guidelines.md`.

## Decisiones técnicas

- **Título en el contenido (D-H), R1, R8.** La cabecera nativa de las dos pantallas pasa a `title: ''`
  y queda solo con el botón de volver, como el resto de pantallas empujadas. En Zonas el título es el
  primer hijo del scroll en todas las ramas (para que no cambie de sitio al pasar de cargando a lista);
  el contador solo con la lista cargada. En el Editor el artboard dibuja el título como píldora de
  cristal sobre el mapa: se reproduce con el patrón que ya existe en `alert-detail` (`BlurView` de
  `expo-blur` con el texto sobre `bg-glass-surface-strong`), para no abrir un tercer patrón de cristal.
  Las ramas de estado del Editor, que no tienen mapa, usan un título de texto plano.
- **Color por posición, icono fijo (D1), R4/R5.** Se añade `zoneCategory(index)` a
  `src/utils/category-palette.ts`, junto a `documentCategory`, para que **el único sitio que escribe
  nombres de clase de categoría siga siendo la paleta** (candado de la carta). El icono es `Map`, ya
  usado para el acceso a geocercas en Perfil: un solo glifo coherente con el resto de la app. La tinta
  del icono se resuelve con `useThemeColors`, una sola llamada con los cinco tokens `*-strong`
  (regla D-I): sin hex.
- **Fila sobre `Card`, como Documentos (R5).** `Card` ya hace `twMerge`; se usa
  `flex-row items-center gap-3 px-3.5 py-3 shadow-none` como las filas de documentos, y el tile es un
  `View` propio de 44 × 44 (no un componente de heroui, por lo que `rounded-14` y las clases de
  categoría no chocan con `twMerge`). Nada de `text-<n>` a medida sobre `Card` ni sobre componentes de
  heroui (Enmienda #187): los textos son `Text` de React Native hijos.
- **Borrar desde la fila se conserva como icono (D4).** Quitar la capacidad sería un cambio de
  comportamiento que el canvas no pide explícitamente (el canvas simplemente no la dibuja); se
  conserva en forma de papelera 44 × 44 con el tono tonal de peligro que ya usa la app, con etiqueta
  accesible propia (`geofences.deleteLabel`) porque ya no hay texto visible.
- **Un solo `Button` para «Añadir zona» y para «Guardar» con dos recetas por ternario (R7, R13).**
  Mantener un único `testID` evita ramas duplicadas y conserva las anclas de los candados (#166/#177).
  Las clases se escriben como **literales completos** en el ternario, no se componen por
  concatenación, porque uniwind las detecta por texto. La receta deshabilitada es la «gris» de la
  carta §13 (`bg-default`, texto `text-muted`, sin labio): es la que el humano reservó a esta feature.
- **Hoja estática con la estructura actual (D3), R9.** Mapa arriba que se encoge y formulario debajo ya
  funcionan con el teclado en edge-to-edge (el `KeyboardAvoidingView` con `behavior="padding"` y la
  regresión de `paddingBottom: 291` están fijados por test). Rehacerlo como hoja arrastrable abriría un
  riesgo que esta feature no necesita. La «hoja» es el propio `ScrollView` del formulario con
  `rounded-t-hero` y un margen negativo (`-mt-6.5`) que monta 26 px sobre el mapa; el agarradero es
  decorativo, como en el artboard. Hay que comprobar en H0 que `-mt-6.5` y `rounded-t-hero` compilan
  en uniwind (la escala de espaciado de Tailwind v4 admite 6.5 = 26 px); si alguna no resuelve, se
  avisa al leader y se enmienda la spec: nunca se recurre a valores entre corchetes.
- **Radio en tres piezas (R11).** Cabecera con el valor a la derecha en `accent-strong`, slider sin
  tocar y etiquetas de extremos. Los extremos se derivan de las **mismas constantes** que el slider
  (`minValue`/`maxValue`), no de literales repetidos, para que cambiar el rango no deje la etiqueta
  mintiendo (un test lo candada).
- **Acciones en fila (R13).** `Eliminar` (1 parte) y `Guardar` (2 partes) en una fila de `gap-2.5`;
  `flex-1`/`flex-2` va **primero** en la clase para que el ancla `h-14 rounded-16 …` de los candados
  de la receta siga siendo una subcadena contigua. Al crear, `Guardar` ocupa toda la fila.
- **Entrada animada con `HomeEntrance` (D7), R5/R6.** Reutiliza el componente de Home (60 ms de escalón,
  desplazamiento 12, respeta reduce-motion). El aviso entra después de la última fila.
- **Candados y carta en el mismo PR (R16, R18, §4).** Se añaden clases fuera de la escala
  (`rounded-14`, `rounded-tile`, `rounded-t-hero`, `rounded-16`): cada una con su línea nominal en la
  carta y su entrada en los inventarios, y un fichero nuevo `geofences-canvas-fidelity.test.ts` para
  los candados propios de estas dos pantallas, en vez de engrosar los agregados.

## Archivos afectados (todos bajo `mobile-pet-tracker/` salvo la carta y la spec)

Capa de presentación (UI) únicamente:

- `src/screens/geofences/index.tsx`: encabezado, barra, fila nueva, aviso, botón, métricas.
- `src/screens/geofence-editor/index.tsx`: píldora de título, hoja, campos, bloque Radio, acciones.
- `src/app/_layout.tsx`: `title: ''` en las dos `Stack.Screen`.
- `src/utils/category-palette.ts`: `ZONE_SLOT_ORDER` y `zoneCategory`.
- `src/i18n/catalog.ts`: cinco claves nuevas por idioma.
- Tests: `src/screens/geofences/index.test.tsx`, `src/screens/geofence-editor/index.test.tsx`,
  `src/utils/__tests__/category-palette.test.ts`, `src/app/__tests__/layout.test.tsx`,
  `src/__tests__/geofences-canvas-fidelity.test.ts` (nuevo), `src/__tests__/ui-copy-table.ts`,
  `src/__tests__/ui-language.test.ts`, `src/providers/__tests__/language-provider.test.tsx`,
  `src/__tests__/chunky-cta-canvas-fidelity.test.ts`, `src/__tests__/design-drift.test.ts`,
  `src/__tests__/profile-canvas-fidelity.test.ts`, `src/__tests__/consistency-classnames.test.ts`
  y, si se mueve, `src/__tests__/legibility-classnames.test.ts`.
- Docs: `docs/ui-guidelines.md` (y `docs/conventions.md` solo si un candado lo exige).
- Sin cambios: `src/api/geofences.ts`, backend, `src/theme/global.css` (los tokens ya existen).

## Alternativas descartadas

- **Hoja arrastrable con módulo de bottom sheet**: coste y riesgo de teclado sin que el artboard
  dibuje ningún gesto (el agarradero es decorativo). Queda como D3 pendiente de humano.
- **Color derivado del `id` de la zona**: estable ante borrados, pero puede repetir color entre zonas
  vecinas y obliga a un hash que hay que candar; con 5 zonas máximo el reparto por posición es
  determinista y se ve como el artboard. Queda como alternativa en D1.
- **Color por radio**: acopla un dato geométrico a un significado visual que el usuario no espera.
- **Quitar el borrado de la fila (D4)**: más fiel al artboard pero un paso más para liberar cupo.
- **Título nativo (D2)**: conservaría el título fuera del contenido y no puede alojar el contador del
  artboard.
- **Dos `Button` para estado normal y deshabilitado**: dos `testID` o ramas que dividen los candados.
- **Sombra de la hoja con valor ad hoc**: la carta prohíbe valores sin token; queda fuera de alcance.
- **Icono de círculo discontinuo propio (SVG)**: añade un activo no verificado en `reicon`; `Map` cubre
  la función y se declara como decisión D1.

## Enmienda E4 (2026-10-21): bloqueo sin atenuado y cabeceras transparentes

Decisiones técnicas de alto nivel; requisitos y literales exactos en `requirements.md` §4.4 (R19-R24).

**Capas**: solo presentación (UI) y tema. Sin cambios de dominio, aplicación, API ni backend.

### Bloqueo sin atenuado (R19, R20)

- **Causa**: heroui añade `disabled:element-disabled` (opacidad 0.5) a `Switch` y `Button` cuando
  `isDisabled`. `busy` activa `isDisabled` en las filas y en «Añadir zona»: de ahí el parpadeo, y de ahí el
  gris del límite demasiado apagado. R7.2 original lo negaba por error.
- **Solución (opción A del humano)**: `KEEP_OPACITY = { opacity: 1 }` en `src/theme/native-styles.ts`
  (junto a `CONTINUOUS_CORNER` y `TABULAR_NUMS`) aplicado por `style`. `style` es lo último que componen
  uniwind (`[className, style]`), el `Switch` (`[…, style]`) y el `Button` (`[buttonRoot, style]`), así que
  gana a la clase de forma determinista. `isDisabled`, `accessibilityState.disabled`, la clase
  `disabled:element-disabled` y el bloqueo de R17 no se tocan.
- **Candado de fuente genérico**: toda etiqueta `<Switch`/`<Button` con `isDisabled=` debe llevar
  `KEEP_OPACITY` (barrido, no lista de `testID`): un elemento nuevo con `isDisabled` y sin la constante pone
  rojo el candado.
- **Límite de jest**: no resuelve `className` ni dibuja el 0.5. Los tests prueban la forma; el efecto real
  lo comprueba el humano en el smoke (§6, pasos 6-7).
- **Alcance en el Editor** (DE4-1): los tres elementos con `isDisabled`, incluido Guardar con nombre vacío,
  para que la receta gris sea una sola en las dos pantallas.

### Dos regímenes de cabecera (R21, R22, R23)

| Pantalla / rama | Cabecera | Dónde se declara | Cómo se prueba |
|---|---|---|---|
| Zonas (`pets/[petId]/geofences`) | transparente, siempre | `_layout.tsx`: `{ ...headerOptions, title: '', ...TRANSPARENT_HEADER_OPTIONS }` | `layout.test.tsx` (`toEqual`) |
| Editor, rama formulario | transparente | `Stack.Screen options={TRANSPARENT_HEADER_OPTIONS}` en `GeofenceEditorForm` | mock de `Stack.Screen` en el test del Editor |
| Editor, ramas de estado | opaca (como hoy) | `Stack.Screen options={opaqueHeader}` en la rama de estados | ídem, cinco ramas + transición |

- **Por qué `_layout.tsx` en Zonas y `Stack.Screen` en el Editor**: Zonas tiene un solo régimen y las
  opciones por ruta ya están candadas en `layout.test.tsx`. El Editor tiene dos regímenes según la rama; la
  ruta no sabe en qué rama está, así que la rama declara su cabecera. La ruta del Editor queda opaca como
  base.
- **Cada rama declara su `Stack.Screen`**: `Stack.Screen` llama a `navigation.setOptions` en un efecto y
  **no restaura** al desmontarse; si solo el formulario declarase, la transición formulario → estado
  (p. ej. la lista pasa a `no-tracking`) dejaría la cabecera transparente sobre una pantalla opaca.
- **Identidad estable de las opciones**: constante de módulo (`TRANSPARENT_HEADER_OPTIONS`) y `useMemo` por
  `background` (opaca). Un objeto nuevo por render dispararía `setOptions` en cada render. El `Stack.Screen`
  es **hermano** del `KeyboardAvoidingView`/`ScrollView` (fragmento), para no romper R8.3 ni R9.
- **`headerStyle` obligatorio**: en react-navigation `headerStyle.backgroundColor` gana a
  `headerTransparent`; las opciones transparentes llevan las dos y se aplican **después** de `headerOptions`.
- **Insets**: bajo cabecera transparente `insets.top` ya no está consumido; por eso `paddingTop: insets.top
  + HEADER_ROW_TOP` en Zonas y `top: insets.top` en la fila de la píldora. `contentInsetAdjustmentBehavior`
  sale de Zonas (iOS lo sumaría dos veces; es no-op en Android).
- **Teclado**: el `KeyboardAvoidingView` pasa a empezar en `y = 0`, así que `keyboardVerticalOffset={0}` y
  se elimina `HeaderHeightContext` del Editor. El candado 291 pasa a 200 (`700 − (500 − 0)`); el `Provider
  value={91}` del test se conserva como guarda inerte.
- **Geometría en un solo sitio**: `src/theme/header-layout.ts` (precedente `touch-target.ts`) con las seis
  constantes. Los tests combinan cableado (la pantalla usa la constante) y ventana con literales propios del
  test (42 ± 8 y 70 ± 8), para que no sea tautología. Ajustes dentro de N = 8 dp: solo ese fichero, sin
  firma; fuera, enmienda E5 (DE4-2).

### Archivos afectados por E4 (bajo `mobile-pet-tracker/` salvo spec y carta)

- Tema: `src/theme/native-styles.ts` (+`KEEP_OPACITY`), `src/theme/header-layout.ts` (nuevo).
- Pantallas: `src/screens/geofences/index.tsx`, `src/screens/geofence-editor/index.tsx`.
- Ruta: `src/app/_layout.tsx` (opciones de Zonas).
- Tests: ambos de pantalla, `src/app/__tests__/layout.test.tsx`, `chunky-cta-canvas-fidelity.test.ts`,
  `geofences-canvas-fidelity.test.ts`.
- Docs: `docs/ui-guidelines.md`, `docs/conventions.md` (una frase).
- Sin cambios: dominio, aplicación, API, backend, `global.css`, `design-drift`, `consistency-classnames`,
  `heroui-text-size-merge` (delta esperado cero; si se ponen rojos, PARA).

### Alternativas descartadas (E4)

- **Clase `disabled:opacity-100`** en lugar de `style`: el orden entre utilidades en conflicto no está
  garantizado; `style` gana siempre.
- **Quitar `isDisabled` y bloquear con un guard en `onPress`**: cambia `accessibilityState` y R17.
- **Opción B/C de H1** (animar el atenuado, o mostrar un spinner en `busy`): más superficie sin que el
  artboard lo dibuje; el humano eligió la A.
- **`Stack.Screen` solo en el formulario del Editor**: deja la cabecera transparente tras una transición a
  estado (ver arriba).
- **Cabecera transparente por ruta también en el Editor**: las ramas de estado se pintarían bajo una barra
  transparente sin mapa debajo.
- **Contenido de Zonas bajo cabecera opaca con título en la fila**: el título no puede alojarse en la
  cabecera nativa con `title: ''` y el contador del artboard (D2, ya descartado).
- **Botón de volver propio de cristal**: sigue fuera de alcance (§5).

### Riesgo abierto: destello opaco → transparente al abrir el Editor

Las opciones del formulario se aplican en un efecto, así que el primer fotograma puede verse con la
cabecera opaca de la ruta. Se comprueba en el smoke (§6, paso 9). **Fallback** si aparece: declarar la ruta
del Editor con `TRANSPARENT_HEADER_OPTIONS` y que las ramas de estado sean las que fijen la opaca (otra
enmienda: cambia `layout.test.tsx` y R22.2).
