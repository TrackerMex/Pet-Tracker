# explore: 189-smoke-hallazgos
Fecha: 2026-10-21 (worktree Pet-Tracker-wt-189, HEAD 18f86849). Solo lectura; no se tocó código ni se corrió init.sh.

Leyenda: **[V]** verificado contra el árbol / node_modules; **[H]** hipótesis (no verificable sin dispositivo).

---------------------------------------------------------------------
## H1. «Flash» en todas las geocercas al desactivar / eliminar / (Añadir zona)

### Veredicto
Causa más probable: **hipótesis (a)**, el atenuado `disabled` de heroui-native disparado por el `busy` global. La (b) queda **descartada por el código de Reanimated**. No es regresión de #189: el `busy` global con `isDisabled` ya existía en `4204530e`. (#189 solo cambió el borrado de `Button` a `Pressable`, lo que **redujo** el atenuado de los botones de borrar.)

### (a) Atenuado por `busy` — [V]
- `src/screens/geofences/index.tsx`: `busy` es un solo `useState(false)` (l.31). `write()` hace `setBusy(true)` al entrar y `setBusy(false)` en `finally` (l.47, 70), con un `await geofences.refetch()` en medio (l.55). Así `busy` es true durante POST/PATCH + refetch.
- Consumidores de `busy`: `Pressable` editar `disabled={busy}` (l.128), `Switch` `isDisabled={busy}` (l.140), `Pressable` borrar `disabled={busy}` (l.148), `Button geofences-add` `isDisabled={busy || atLimit}` (l.183).
- heroui-native 1.0.8 (`node_modules/heroui-native/src/components/switch/switch.styles.ts:29-31` y `button/button.styles.ts:44-46`): la variante `isDisabled: true` añade la clase `disabled:element-disabled`. `src/styles/utilities.css:10-13`: `@utility element-disabled { opacity: var(--opacity-disabled); pointer-events: none; }` y `variables.css:17`: `--opacity-disabled: 0.5`. O sea, mientras `busy` es true, **todos** los `Switch` de la lista y el botón «Añadir zona» pasan a opacidad 0.5 a la vez y vuelven a 1 al terminar: ese es el «flash» en todas las filas.
- Los `Pressable` planos (editar, borrar) **no** se atenúan: `disabled` de RN no pinta nada y su `style` solo cambia opacidad en `pressed`. La `Card` tampoco cambia. Es decir, lo que parpadea son los interruptores y Añadir zona, no la tarjeta entera.
- La spec ya tenía el hueco: `requirements.md` R7.2 dice «`busy` (escritura en curso) **no** cambia el aspecto: conserva la receta primaria con `isDisabled`». Es falso con heroui: `isDisabled` cambia el aspecto (opacidad 0.5). El spec_author asumió que `isDisabled` era invisible.
- Observación lateral [V]: el artboard `Zonas.dc.html` dibuja «Añadir zona» deshabilitado (`disabled`, `background: var(--default)`, color muted) **sin** opacidad. La implementación, con 5 zonas, apila `bg-default` + `disabled:element-disabled` (0.5): más apagado que el artboard. El test `index.test.tsx:870` pinta esa clase a propósito (`${count === 5 ? 'disabled:element-disabled ' : ''}...`), así que está candado.

### (b) `HomeEntrance` se re-dispara — [V] descartada
- `home-entrance.tsx`: `Animated.View` con `entering={homeEntering(index * STAGGER, offset)}`; `useReducedMotion()` se lee en cada render pero el `entering` solo se configura al **montar**.
- Reanimated 4.5.1, `node_modules/react-native-reanimated/src/createAnimatedComponent/AnimatedComponent.tsx`: `ENTERING` se configura en el constructor (l.107-111). `componentDidUpdate` (l.323-345) solo reconfigura `LAYOUT` y `EXITING`. Cambiar la prop `entering` (p. ej. `index` distinto al borrar una fila) **no** relanza la animación.
- No hay remonte: `key={geofence.id}` estable; `geofences.refetch()` deja `geofences.data` definido (React Query conserva `data` durante el refetch; `staleTime: 0` en `providers/query-provider.tsx:30` no lo vacía), por lo que el ternario nunca vuelve a `Skeleton` (`geofences.data === undefined` solo en la primera carga); el `HomeEntrance` es hijo directo de un `.map` dentro de la misma rama del ternario, y el padre no cambia de tipo.
- Matiz [H]: en un borrado, las filas siguientes **cambian de color de tile** (color por posición, decisión D1 aprobada) y el contador y la barra cambian. Eso es un cambio visible, pero no un flash de todas las filas.

### (c) Otras causas — [V] no aplican
- `Card` recibe `className` literal constante (no cambia con `busy`).
- `useChunkyLip` está memoizado por `[lip, lipGray]`; `useThemeColors` devuelve array nuevo por render pero solo se usa para el `color` de iconos (sin memo aguas abajo, sin remonte).
- El `Alert.alert` de Android no desmonta la pantalla.

### ¿Regresión de #189 o preexistente? — [V] preexistente
`git show 4204530e:.../geofences/index.tsx`: `busy` global (l.23), `Pressable` editar `disabled={busy}` (l.104), `Switch isDisabled={busy}` (l.116), **`Button` borrar `isDisabled={busy}`** (l.125, heroui: también atenuaba), `Button` añadir `isDisabled={busy || atLimit}` (l.154). `HomeEntrance` en la pantalla **no existía** antes: nace en d1cff68a (R3 de #189), pero no causa el flash. Los tests de bloqueo («bloquea los dos interruptores…») vienen de 74ba7ceb (#41, 2026-10-02).

### Tests / candados que corrigen cualquier fix — [V]
Comportamiento (todos los interruptores/borrados/editar bloqueados con `busy`; mantienen `accessibilityState.disabled`):
- `src/screens/geofences/index.test.tsx` l.227-240 «bloquea los dos interruptores mientras escribe sin anticipar el estado» (los dos toggles `disabled: true`, solo 1 llamada).
- l.262-279 (reintento: `disabled` true durante la escritura y false tras `finishRetry`).
- l.321-335 «deshabilita los dos borrados mientras el interruptor escribe y no abre Alert».
- l.453-459 «no abre el editor mientras una escritura está en vuelo».
- l.327/361, 776/791 (`disabled` false al terminar), 745.
- l.503-516 y 868-888: Añadir zona con 5 zonas (`disabled` true; clase con `disabled:element-disabled`).
Literales de código fuente:
- `src/__tests__/chunky-cta-canvas-fidelity.test.ts:65`: fila `geofences-add` con ancla `isDisabled={busy || atLimit}` (`keeps`), más l.102-114: `className={atLimit ? '…bg-default' : '…'}` y `style={atLimit ? undefined : chunkyLip.primary}` literales. Añadir `style` al Añadir zona toca este candado.
- Editor (mismo patrón, no reportado por el humano): l.64 `isDisabled={busy || name.trim() === ''}` y `R12`/`R13` de requirements (`isDisabled={busy}` en `geofence-editor-active` y `-delete`).
- Spec: R7.1 `isDisabled={busy}`, R7.2 (frase «busy no cambia el aspecto»), R17 «el bloqueo mientras `busy`» (invariante), l.443 de la tabla de enmiendas (ancla `isDisabled={busy || atLimit}`).
Nota: en jest `className`/uniwind no se resuelve a estilos, así que un test de «no se atenúa» solo puede probar props (`style` explícito) o fuente, no el 0.5 real.

### Corrección mínima propuesta (H1)
Mantener `busy`, `isDisabled` y `accessibilityState.disabled` (candados de comportamiento y R17 intactos) y **anular solo el atenuado**:
1. Opción A (recomendada, mínima): `style={{ opacity: 1 }}` (o `disabled:opacity-100` en className) en el `Switch` de cada fila y en `geofences-add` cuando `busy && !atLimit`. **[H]**: que el `style` inline gane al `opacity` de `element-disabled` de uniwind/heroui, y que `rContainerStyle` del Switch no incluya `opacity`, hay que medirlo en el dispositivo (en jest no se ve). Para Añadir zona, como `style` está literal-candado, o se enmienda el literal (`style={atLimit ? undefined : chunkyLip.primary}` → p. ej. `chunkyLip.primary` combinado con opacidad) o se evita tocarlo atenuando solo el `Switch` (que es lo que más parpadea) y aceptando que Añadir zona sí se aprecia atenuado.
2. Opción B: `pendingId` por fila: solo la fila afectada se bloquea/atenúa. Choca con los tests «bloquea los dos…» y con R17 («bloqueo mientras busy» en todas las filas); exige enmienda y no elimina el parpadeo (el de la fila afectada).
3. Opción C: quitar `busy` de `geofences-add` (navegar al editor durante una escritura es inocuo). Toca R7.1, el literal de chunky-cta:65 y el test de la tabla de enmiendas.
Cualquiera es **enmienda a la spec firmada** (R7.2 afirma algo falso) y a los candados citados; no es un parche libre.

---------------------------------------------------------------------
## H2. Posición de «Zona segura» en el Editor

### Qué hay hoy — [V]
- `src/app/_layout.tsx:105-106`: `pets/[petId]/geofences` y `…/geofence-editor` son `{ ...headerOptions, title: '' }` con `headerOptions` (l.78-85) = `headerShown: true`, `headerStyle: { backgroundColor: background }` (**cabecera opaca**), `headerTintColor`, `headerTitleStyle`, `headerShadowVisible: false`. **No** hay `headerTransparent`, `headerLeft`, `headerTitle` ni `headerBackVisible` en ninguna pantalla del repo (grep en `src`): todas usan el botón atrás nativo. No hay precedente de botón volver de vidrio.
- Altura de la cabecera en Android [V]: `expo-router/build/react-navigation/native-stack/views/NativeStackView.native.js:52,104`: `ANDROID_DEFAULT_HEADER_HEIGHT = 56` más `insets.top` (se corrige luego con el layout medido, l.177-203). `HeaderHeightContext` (usado en el Editor, `useContext(HeaderHeightContext)`, l.~101) = 56 + `insets.top`. En el árbol de `GeofenceEditorForm` el contenido **empieza debajo** de la cabecera opaca.
- Botón volver nativo [V/H]: es la flecha estándar de Android con `headerTintColor`, sin vidrio ni 44×44 (no se declara `headerLeft`). El tamaño/posición exactos del icono nativo no se pueden leer del árbol: **[H]**, hay que medirlo en el dispositivo.
- Píldora [V]: `geofence-editor/index.tsx:150`, `BlurView … absolute left-4 top-3` **dentro de `geofence-editor-map`**, o sea 12 px bajo la cabecera y a x=16. Verticalmente queda en `insets.top + 56 + 12` ≈ 92 (con insets 24); el artboard la pone con centro en y=74 (header `top:52`, fila de 44) y a x=70.
- Artboard `EditorZona.dc.html` l.37-39 [V]: el mapa (SVG 390×430) ocupa **desde y=0**, bajo la barra de estado; `<header>` absoluto `top:52 left:16 right:16`, `flex`, `gap:10`, botón volver de vidrio 44×44 + píldora (padding 10/16, radio 999, 16/800). No existe cabecera nativa en el artboard.

### Por qué está donde está (decisión firmada) — [V]
- `requirements.md` D3 (l.~29): «Se pierden dos cosas del artboard: **el botón de volver de cristal (queda el de la cabecera nativa)** y la sombra de la hoja» y §5 «Fuera de alcance»: «botón de volver de cristal sobre el mapa: queda el de la cabecera nativa».
- R8.2 prescribe literal `absolute left-4 top-3` dentro de `geofence-editor-map`, **después** de `PetMap`. D2/R1.1: cabecera `title: ''` que «solo aporta el botón de volver». `ui-guidelines.md` l.272, 651, 789 lo respaldan («El botón atrás pertenece a la cabecera nativa con `title: ''`»).
- Conclusión: con cabecera **opaca** nativa la píldora **no puede** estar en la misma fila que el botón atrás; la posición actual es la consecuencia directa de D2/D3 aprobadas, no un error de implementación. Lo que el humano pide ahora es **otra decisión** (enmendar D3/§5), no un arreglo de offsets.

### ¿«Zona segura» podría ser otra cosa? — [V]
- `geofenceEditor.title` = «Zona segura» (`i18n/catalog.ts:578`; en: «Safe zone»:132): es la píldora del Editor (o, en las ramas R8.3, el `Text` 26/900 dentro del `ScrollView`).
- La lista usa `geofences.title` = «Zonas seguras» (catalog l.561). **Misma clase de diferencia en Zonas** (`Zonas.dc.html` l.27-30): el artboard pone el botón volver 44×44 (`margin-left:-10`, sin vidrio), el `h1` «Zonas seguras» 26/900 y el contador «5/5» **en la misma fila** (padding-top 56). En la implementación el título va en el `ScrollView` **debajo** de la cabecera nativa (`paddingTop: 24`, `paddingHorizontal: 20`): x=20 en lugar de ≈62 (20 + 44 − 10 + 8) e y ≈ `insets.top + 56 + 24` en lugar de ≈ 56..100. Si el humano se refiere a «Zonas seguras», es lo mismo: D2 lo deja bajo el botón atrás. El resto del artboard Zonas coincide en lo medido: gap 12, filas `padding 12/14`, tile 44 radio 14, nombre 16/800, radio 12, aviso 18/`13px`, botón 56, barra de 6 px con gap 4.
- Otras diferencias de posición en `EditorZona.dc.html`: sin diferencias de posición relevantes en el resto. Hoja `top:404`, mapa 430 ⇒ solapa 26 = `-mt-6.5` ✓; sugerencia `top:368` (borde inferior ≈395, 35 sobre el mapa) ≈ `bottom-9` ✓; agarradero 40×5 ✓; botones 54 vs 56 (D5 ya decidida). La única discrepancia vertical del mapa es que el artboard lo extiende bajo la barra de estado/cabecera (y=0) y la implementación lo arranca bajo la cabecera opaca (≈ 80 px menos de mapa visible arriba).

### Opciones para colocar la píldora a la derecha del botón volver (misma fila)
| Opción | Qué toca | Riesgos |
|---|---|---|
| **P1. `headerTransparent` + `headerTitle` con la píldora, botón atrás nativo** (Android: con `headerTitle` y sin `headerLeft` la flecha nativa se conserva, `useHeaderConfigProps.js` `backButtonInCustomView`) | `_layout.tsx` opciones del Editor (`headerTransparent: true`, `headerTitle`), mapa que sube bajo la cabecera | `title: ''` deja de ser `{...headerOptions, title: ''}` (candado `layout.test.tsx:497-510` y `R1.1`); `headerTitle` es estático en `_layout` y no conoce `theme`/estado de las ramas R8.3; el `BlurView` de la píldora quedaría **sobre cabecera**, no sobre el mapa, salvo que el mapa suba bajo ella; la flecha nativa (sin vidrio) sobre un mapa claro/oscuro puede perder contraste **[H]**. |
| **P2. Píldora absoluta con `top = insets.top + 6` y `left = 16 + 44 + 10`, cabecera `headerTransparent` fijada desde el propio Editor** (`<Stack.Screen options={{ headerTransparent: true }} />` solo en la rama formulario) | `GeofenceEditorForm` | La flecha nativa de Android no mide 44 ni está en x=16: el `left` 70 es del artboard, **[H]** no del dispositivo, hay que medirlo; con cabecera transparente el contenido pasa a empezar en y=0 y `keyboardVerticalOffset={headerHeight}` deja de ser correcto (debería ser 0): cambia el resultado del candado `paddingBottom: 291` (hoy 700 − (500 − 91); pasaría a 200) que la spec declara «se conserva idéntico» (R9). Además las ramas R8.3 (esqueleto, no-tracking, error, no encontrada, solo dueño) siguen con cabecera opaca y `Text` en el `ScrollView`: habría dos regímenes de cabecera según la rama. |
| **P3. Botón de vidrio propio (`headerLeft` custom 44×44 con `BlurView` + `router.back()`) + `headerTitle` píldora + `headerTransparent`** | `_layout.tsx` o Stack.Screen del Editor; componente nuevo | Es lo único fiel al artboard, pero **revierte D3/§5** (botón de vidrio fuera de alcance), introduce un componente nuevo y afecta accesibilidad (etiqueta «Volver», foco, gesto atrás). Candados de `layout.test.tsx` y `R8.2/R9`. |
| **P4. Dejar como está** (D3 firmada) | nada | El humano ve la diferencia en el smoke, ya documentada como «se pierde». |

Tests que prescriben la posición actual: `geofence-editor/index.test.tsx:619` (`'absolute left-4 top-3 overflow-hidden rounded-full'`), l.627/675/687 (orden de hijos de `geofence-editor-map`: `['map-view','geofence-editor-title-blur', …]`), l.226 (`paddingBottom: 291`, dependiente del `HeaderHeightContext` mockeado a 91 en l.85), l.637-644/852-854 (R8.3, título plano primero), `layout.test.tsx:497-510` (+ el `it` «le da la cabecera nativa de #95 R4 con el título del editor de zonas»), y la spec: R8.1-R8.3, R9, D2/D3/§5, M9 (l.104).

### Corrección mínima propuesta (H2)
No es un ajuste de CSS: exige **enmendar D3/R8.2** con el gate humano. Si el humano lo pide:
- Mínima en código: **P2 restringido a la rama formulario** y medido en dispositivo: `<Stack.Screen options={{ headerTransparent: true }} />` dentro de `GeofenceEditorForm`, mapa por debajo, píldora con `top = insets.top + (56 − altura_píldora)/2` y `left` = ancho medido del botón nativo + 10, y `keyboardVerticalOffset={0}` (reabre el candado 291 → 200: enmendar con cuenta explícita). Mantiene el botón atrás nativo (no toca §5 salvo la frase «cabecera nativa»).
- Fiel al artboard: P3. Mayor coste.
- Menos riesgo: P4 y registrar la diferencia como «aceptada por D3».

---------------------------------------------------------------------
## Decisiones abiertas para el humano
1. **H1:** ¿Quieres que durante una escritura los interruptores y «Añadir zona» **no cambien de aspecto** (solo se bloqueen), o prefieres algún indicador de ocupado (p. ej. solo la fila afectada atenuada)? Es decisión de producto sobre el feedback visual; la opción técnica A cumple la primera.
2. **H1:** el «Añadir zona» con 5 zonas ahora se pinta `bg-default` **y** al 50 % de opacidad; el artboard lo pinta sin atenuar. ¿Lo alineas con el artboard (sin 0.5)?
3. **H2:** ¿Aceptas la posición actual de la píldora (consecuencia de D3: botón atrás nativo y cabecera opaca) o abres una enmienda para subir el mapa bajo una cabecera transparente (P2) o para construir el botón de vidrio propio (P3)? Para P2/P3 hace falta además decir si la enmienda toca el candado `291`.
4. **H2:** «Zonas seguras» en la lista tiene el mismo desfase respecto de su artboard (título bajo el botón atrás en lugar de en su fila). ¿Entra en la misma enmienda o se deja como D2?

## Corrección mínima propuesta (resumen)
- **H1:** dejar `busy`/`isDisabled` como están y anular solo el atenuado heroui en el `Switch` (y, si se acepta tocar el literal, en Añadir zona); verificar en dispositivo que el `style` inline gana al `opacity` de `disabled:element-disabled`. Enmienda de R7.2 (su frase es falsa) y, si se toca Añadir zona, de `chunky-cta-canvas-fidelity.test.ts:65/102-114`. Causa verificada en `heroui-native` + `Geofences/index.tsx`; (b) y (c) descartadas.
- **H2:** requiere enmienda de D3/R8.2; mínima = P2 solo en la rama formulario con medidas del dispositivo; ver riesgos arriba. No implementar sin gate.
