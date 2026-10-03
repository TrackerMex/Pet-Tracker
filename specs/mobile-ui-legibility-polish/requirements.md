---
feature: "mobile-ui-legibility-polish"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-ui-legibility-polish]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, los cálculos de contraste y las
> excepciones declaradas, y [[../../docs/ui-guidelines|ui-guidelines]] (carta de
> UI, gana siempre sobre `appllama-app-design-skill`) más
> [[../../docs/conventions|conventions]] §Convenciones de la app móvil y
> §Dimensiones de pantalla uniformes para las reglas que la implementación
> debe respetar.

Feature #61. Primer lote del pulido derivado de `progress/audit_ui_polish.md`
(auditoría del 2026-09-03). Cubre **exactamente** los hallazgos 1, 2, 3, 4, 5,
6, 7, 13, 19 y 21 de esa auditoría. Los hallazgos 8-12, 14-18, 20 y 22-26 son
de la feature #62 y **no entran aquí ni "de paso"**.

> **Decisión de contraste revisada el 2026-09-03**, después de que el humano
> leyera esta spec en draft. La primera vía (relleno `#2AB87C` intacto +
> etiqueta en verde muy oscuro) cambiaba el aspecto de los 17 CTA y quedó
> **descartada**. La vía vigente, textual: *"oscurece el acento, quiero la
> letra blanca"*. El token `--accent-contrast` ya no existe en ninguna parte de
> esta spec.

---

## Invariante duro de la feature (aplica a TODOS los R-ids)

> Este bloque es parte del contrato de cada requisito. Un requisito que se
> cumpla violándolo NO está cumplido.

- **Cero cambios de conducta, lógica, navegación o contratos de API.** Ningún
  `useState`, ningún `useEffect`, ninguna llamada a `api/`, ningún `router.*`,
  ningún handler cambia de forma o de momento de ejecución.
- **Ningún `testID` se renombra ni se elimina.** Los tests de conducta de
  #33-#37 se anclan a ellos. *Añadir* un `testID` nuevo sí está permitido y
  dos requisitos lo hacen explícitamente (R7, R8): quedan enumerados en
  [[design]] §5.
- **Ningún texto visible cambia.** Ni una cadena, ni mayúsculas/minúsculas, ni
  puntuación, ni idioma.
- **Los diffs son solo de valores de token, `className`, props de
  estilo/render (`contentContainerStyle`, `hitSlop`, `numberOfLines`), el
  argumento de `useThemeColors`, y estructura visual de contenedores**
  (envolver en un `ScrollView`, partir una fila en dos filas). Nada más.
- **Grep-clean de #46 y #72 intacto**: cero hex fuera de
  `mobile-pet-tracker/src/theme/`, cero clases arbitrarias `[...]`, cero
  `StyleSheet.create`, cero `shadow*`/`elevation` legacy. Verificado por
  `src/__tests__/design-drift.test.ts`, que ya está verde y debe seguirlo.
- **Tokens solo en `mobile-pet-tracker/src/theme/global.css`.** De
  `appllama-app-design-skill` se toma el patrón, **nunca** su sistema de
  estilos: prohibidos `Color.ios.*`, `StyleSheet.create`, hex sueltos y clases
  arbitrarias.
- **`--accent-foreground` conserva `#FFFFFF`** en los dos temas. La etiqueta
  sobre el acento se queda blanca; lo que se mueve es el relleno.
- **`--radius-card: 20px` (#72 R1) no se reabre.** El hallazgo 18 del audit
  queda fuera; ver [[design]] §9.
- **El tema oscuro no se degrada como tinta.** El acento usado como texto,
  icono o trazo conserva en dark exactamente el `#2AB87C` de hoy, con sus
  ratios actuales (6,13:1 a 6,79:1). Lo que sí cambia en dark es el **relleno**,
  que es justo el par que hoy falla (2,547:1).

Umbral de contraste usado en toda la feature: **WCAG 2.1 AA para texto normal,
≥ 4,5:1**, con la fórmula de luminancia relativa sRGB de la spec
(`L = 0,2126·R + 0,7152·G + 0,0722·B` sobre canales linealizados;
`ratio = (L_claro + 0,05) / (L_oscuro + 0,05)`). El umbral de 3,0:1 de "texto
grande" **no** aplica a texto: el `Button.Label` de heroui es 16 px bold, por
debajo del corte de 18,66 px bold. Sí se usa 3,0:1 como umbral de **componente
no textual** (bordes, iconos, trazos de gráfica), que es el que fija WCAG 1.4.11.

---

## Requisitos funcionales

### Bloque A — Contraste de color (hallazgos 21, 1, 3, 2, 19)

- **R1**: WHEN se renderiza el botón de confirmación destructiva del bottom
  sheet de recordatorios (`mobile-pet-tracker/src/screens/reminders/index.tsx`,
  `Button.Label` dentro del `Button` con `testID="reminders-delete-confirm"`)
  THE SYSTEM SHALL resolver el color de su etiqueta con la utilidad
  `text-danger-foreground` y no con `text-accent-foreground`, conservando el
  resto de su `className` (`font-bold`), su `testID`, su `variant="danger"` y
  su texto `Delete` sin cambios.
  - Test: `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` ::
    `describe('#61 R1: la etiqueta destructiva usa el token de danger')`

- **R2**: WHEN Tailwind compila `mobile-pet-tracker/src/theme/global.css` THE
  SYSTEM SHALL definir `--accent` y `--color-accent` con el valor **`#178255`**
  en los variants `light` **y** `dark` (hoy `#2AB87C` en ambos), tal que la
  relación de contraste entre `#FFFFFF` y `#178255` sea **≥ 4,5:1** (valor
  calculado: **4,816:1**) en los dos temas; AND THE SYSTEM SHALL arrastrar el
  mismo cambio a los dos tokens que hoy repiten literalmente el valor del
  acento — `--focus` a `#178255` en ambos variants, y
  `--tab-pill`/`--color-tab-pill` a `rgba(23,130,85,0.14)` en `light` y
  `rgba(23,130,85,0.22)` en `dark`; AND THE SYSTEM SHALL conservar
  `--accent-foreground` y `--color-accent-foreground` con el valor `#FFFFFF`
  en ambos variants.
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#61 R2: el relleno de acento pasa AA con etiqueta blanca')`

- **R3**: WHEN se renderiza texto sobre una superficie de relleno de acento
  (`bg-accent`, es decir los 10 `Button` con esa clase y las 2 `Card`
  `variant="accent"`) THE SYSTEM SHALL mantener `text-accent-foreground` como
  su color, AND SHALL eliminar las utilidades `opacity-70` y `opacity-80` de
  las **4** ocurrencias enumeradas en [[design]] §4 R3, porque la composición
  de opacidad deja el color efectivo en 3,202:1 y 3,686:1 sobre `#178255`,
  por debajo del umbral de 4,5:1 que R2 acaba de conseguir.
  - Test: `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` ::
    `describe('#61 R3: ningún texto sobre bg-accent se compone con opacidad')`

- **R4**: WHEN Tailwind compila `global.css` THE SYSTEM SHALL exponer un token
  `--accent-strong` (más su espejo `--color-accent-strong` para el resolver JS)
  con el valor **`#107148`** en el variant `light` y **`#2AB87C`** en el
  variant `dark`, registrado como utilidad `text-accent-strong`; AND WHEN el
  acento se usa como **tinta** — texto, enlace, icono, borde de foco de
  gráfica o trazo — sobre cualquier superficie que no sea `bg-accent`, THE
  SYSTEM SHALL resolverlo con `text-accent-strong` en las **13** ocurrencias de
  `className` y con `useThemeColors(['accent-strong'])` en las **6**
  ocurrencias imperativas enumeradas en [[design]] §4 R4, tal que el contraste
  sea ≥ 4,5:1 sobre `bg-surface` (light 6,039 / dark 6,792), `bg-default`
  (5,584 / 6,128), `bg-surface-secondary` (5,703 / 6,432) y `bg-accent-soft`
  (4,941 / 6,501), y ≥ 3,0:1 en los usos no textuales; AND THE SYSTEM SHALL
  dejar **cero** llamadas a `useThemeColors` que pidan `'accent'` en
  `mobile-pet-tracker/src/`.
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#61 R4: token accent-strong con AA como tinta en los dos temas')`
    (token y ratios) y
    `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` ::
    `describe('#61 R4: el acento como tinta usa accent-strong')` (sitios)

- **R5**: WHEN Tailwind compila `global.css` THE SYSTEM SHALL exponer un token
  `--warning-strong` con el valor **`#92610A`** en el variant `light` y
  **`#FBBF24`** en el variant `dark`, registrado como utilidad
  `text-warning-strong`; AND WHEN se renderiza **texto** de estado de aviso
  THE SYSTEM SHALL resolver su color con `text-warning-strong` en las **3**
  ocurrencias enumeradas en [[design]] §4 R5, tal que el contraste sea ≥ 4,5:1
  sobre `bg-surface` (5,335:1) y sobre `bg-warning-soft` (4,748:1) en light y
  ≥ 4,5:1 sobre las mismas en dark (10,362 / 7,477:1); AND THE SYSTEM SHALL
  conservar `--warning` y `--color-warning` con sus valores actuales
  (`#F59E0B` light, `#FBBF24` dark) y seguir usando el ámbar puro para iconos
  y rellenos (`color={warning}` de `useThemeColors`, `bg-warning-soft`), que
  no cambian.
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#61 R5: token warning-strong con AA sobre surface y warning-soft')`
    (token y ratios) y
    `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` ::
    `describe('#61 R5: text-warning deja de usarse como color de texto')`
    (sitios)

- **R6**: WHEN Tailwind compila `global.css` THE SYSTEM SHALL definir
  `--muted` y `--color-muted` con el valor **`#667085`** en el variant `light`
  (hoy `#6B7280`), tal que el contraste de `text-muted` sea ≥ 4,5:1 sobre
  `bg-default` (**4,601:1**, hoy 4,471:1), sobre `bg-surface` (4,975:1) y
  sobre `bg-surface-secondary` (4,699:1); AND THE SYSTEM SHALL conservar
  `--muted` y `--color-muted` con el valor `#9CA3AF` **sin cambios** en el
  variant `dark`, donde ya pasa AA (6,148:1 sobre `bg-default`).
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#61 R6: muted light pasa AA sobre bg-default sin tocar dark')`

### Bloque B — Safe areas y scroll (hallazgos 5, 6)

- **R7**: WHEN se renderiza la pantalla de registro
  (`mobile-pet-tracker/src/app/(auth)/register.tsx`) THE SYSTEM SHALL aplicar
  el padding en el `contentContainerStyle` de su `ScrollView` con el valor
  exacto `{ padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom:
  insets.bottom + 96 }` obtenido de `useSafeAreaInsets()`, SHALL declarar
  `contentInsetAdjustmentBehavior="automatic"` y `testID="screen-register"` en
  ese `ScrollView`, y SHALL eliminar el `View` intermedio que hoy lleva
  `className="gap-4 p-6"` promoviendo sus hijos a hijos directos del
  `ScrollView`, sin cambiar ningún `testID` existente ni ningún texto.
  - Test: `mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx` ::
    `describe('#61 R7: register usa las métricas de pantalla uniformes')`

- **R8**: WHEN se renderiza cualquiera de las pantallas
  `mobile-pet-tracker/src/app/(auth)/login.tsx`,
  `mobile-pet-tracker/src/app/(auth)/forgot.tsx` o
  `mobile-pet-tracker/src/screens/reset-password/index.tsx` (sus **tres**
  ramas de retorno) THE SYSTEM SHALL usar un `ScrollView` como elemento raíz,
  con `keyboardShouldPersistTaps="handled"`,
  `contentInsetAdjustmentBehavior="automatic"`, `className="flex-1
  bg-background"`, el `testID` que le corresponda (`screen-login`,
  `screen-forgot`, `screen-reset-password`) y `contentContainerStyle={{
  flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16, paddingTop:
  insets.top + 12, paddingBottom: insets.bottom + 24 }}`, añadiendo
  `alignItems: 'center'` **solo** donde el `View` de hoy declara `items-center`
  (forgot y las dos ramas tempranas de reset-password), de modo que con el
  teclado abierto el contenido sea alcanzable por scroll y que el centrado
  vertical actual se conserve.
  - Test: `mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx` ::
    `describe('#61 R8: login tiene contenedor de scroll con safe areas')`;
    `mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx` ::
    `describe('#61 R8: forgot tiene contenedor de scroll con safe areas')`;
    `mobile-pet-tracker/src/screens/reset-password/index.test.tsx` ::
    `describe('#61 R8: las tres ramas de reset tienen contenedor de scroll')`

### Bloque C — Regresión y usabilidad (hallazgos 7, 13, 4)

- **R9**: WHEN se renderiza la etiqueta de sección de la card de información
  de mascota (`mobile-pet-tracker/src/screens/profile/index.tsx`, el `Text`
  con el contenido `Información` dentro de la `Card` con
  `testID="pet-info-card"`) THE SYSTEM SHALL aplicarle
  `className="pb-2 text-xs font-semibold uppercase tracking-widest text-muted"`,
  el mismo tratamiento que #46 R10 fijó y que la card `me-card` de la misma
  pantalla conserva, sin cambiar el texto.
  - Test: `mobile-pet-tracker/src/screens/profile/index.test.tsx` ::
    `describe('#61 R9: la etiqueta de sección de pet-info-card vuelve a #46 R10')`

- **R10**: WHEN se renderiza cualquiera de los 13 controles táctiles
  enumerados en [[design]] §4 R10 (3 filas de enlace, 5 recetas de chip,
  5 botones de volver) THE SYSTEM SHALL declarar en su `Pressable` la prop
  `hitSlop={TOUCH_SLOP}`, donde `TOUCH_SLOP` es la constante compartida
  `{ top: 6, bottom: 6, left: 6, right: 6 }` exportada desde
  `mobile-pet-tracker/src/theme/touch-target.ts`, de modo que el área táctil
  de cada control mida **≥ 44 pt** en ambos ejes (caja mínima medida 32 pt +
  12 pt de slop = 44 pt; cálculo por receta en [[design]]) sin que cambie el
  tamaño visible del control, su `className`, su `testID` ni su texto.
  - Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/health.test.tsx`,
    `.../weight-log.test.tsx`, `.../meal-schedule.test.tsx`,
    `mobile-pet-tracker/src/screens/profile/index.test.tsx`,
    `.../add-pet/index.test.tsx`, `.../add-reminder/index.test.tsx`,
    `.../docs/index.test.tsx` — en los siete,
    `describe('#61 R10: los controles táctiles declaran TOUCH_SLOP')`

- **R11**: WHEN se renderiza el overlay de estadísticas del mapa
  (`mobile-pet-tracker/src/app/(tabs)/map.tsx`, dentro de la `Card` del `View`
  con `testID="map-stats"`) THE SYSTEM SHALL disponer los **cuatro** tiles en
  dos filas de dos (`stat-speed` y `stat-distance` en la primera,
  `stat-updated` y `stat-gps` en la segunda), cada fila un `View
  className="flex-row gap-2"` dentro de un `View className="gap-2"`, y SHALL
  declarar `numberOfLines={1}` en los cuatro `Text` de valor, de modo que el
  ancho útil de texto por tile pase de 53,5 pt a **139 pt** (cálculo en
  [[design]]) y ningún valor se corte ni salte de línea con las cadenas que la
  pantalla renderiza hoy; AND THE SYSTEM SHALL conservar los cuatro tiles, sus
  cuatro `testID`, sus etiquetas, el `className` de cada tile y el `style`
  absoluto del `View` `map-stats`.
  - Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` ::
    `describe('#61 R11: el overlay de stats reparte los cuatro tiles en 2x2 sin envolver')`

### Bloque D — Invariante verificable

- **R12**: WHEN el reviewer valida la feature THE SYSTEM SHALL presentar la
  suite móvil completa (`bun test` en `mobile-pet-tracker/`) en verde sin que
  ningún assert de conducta preexistente haya sido reescrito, AND `git diff
  origin/main...HEAD --stat` SHALL no listar ningún archivo bajo
  `backend-pet-tracker/`, ningún archivo bajo `infra/`, y ningún `*.test.tsx`
  preexistente salvo por bloques `describe('#61 R…')` **añadidos**; el único
  archivo de test preexistente modificado en su contenido previo SHALL ser
  `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts`, y solo en los
  **10 literales de color** de las 9 líneas enumeradas en [[design]] §6
  (excepción declarada E1).
  - Verificación: `bun test` + `git diff origin/main...HEAD --stat` ejecutados
    por el `reviewer` (no es un test de jest; es un gate mecánico de revisión).

---

## Fuera de alcance

- **Los hallazgos 8-12, 14-18, 20 y 22-26 del audit.** Son la feature #62
  (`mobile-ui-consistency-polish`). No se tocan aquí ni "de paso".
- **El hallazgo 18** (`--radius-card` 20 px vs 16 px). Decisión humana del
  2026-09-03: no se reabre. Queda como punto a comparar en el próximo smoke,
  al mismo tamaño físico.
- **Un token de texto sobre acento (`--accent-contrast`)**: descartado por el
  humano el 2026-09-03 tras leer esta spec en draft. No queda ni como token
  muerto ni como alternativa comentada; solo como línea de historial en
  [[design]] §10.
- **`--surface-secondary` (`#F0FBF6` / `#12231B`)**: es un verde muy pálido de
  superficie, no una repetición del valor del acento, y ninguna etiqueta de
  esta feature falla sobre él. No se mueve.
- **`--success` (`#0F9B5A`)**: `text-success` da 3,586:1 sobre `bg-surface` y
  3,316:1 sobre `bg-default` en light. Es un fallo AA **preexistente** que
  ningún hallazgo de la auditoría recoge. No entra aquí; queda anotado en
  [[design]] §3 como candidato para la próxima auditoría.
- **Elevar a AA la etiqueta de la pestaña activa de `floating-tab-bar` sobre
  `bg-tab-pill`**: R4 la migra al token de tinta y con eso pasa de 2,4:1 a
  5,038:1 en light y 5,983:1 en dark, así que cumple AA por efecto colateral;
  pero el componente no es ninguno de los diez hallazgos y no se rediseña.
- **`pet-switcher.tsx:32-33`**, listado por el hallazgo 13. Medido durante la
  redacción de esta spec: el chip mide **52 pt** (Avatar `sm` = 40 pt + `p-1`
  = 8 pt + `border-2` = 4 pt), ya por encima de 44 pt. La evidencia del audit
  es incorrecta en ese punto.
- Migrar los `TextInput` crudos a `TextField` de heroui, sustituir los emoji
  de iconografía, unificar el idioma de la UI, cabeceras nativas para las
  pantallas de detalle, errores inline por campo y action sheet nativo para el
  confirm destructivo: todo lo que el audit dejó fuera por exigir cambio de
  conducta sigue fuera.
- Cualquier cambio de motion (`progress/audit_animations_mobile.md`).
- Cualquier archivo bajo `backend-pet-tracker/` o `infra/`.

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-03) ← gate obligatorio antes de implementar

> **Nota de auditoría (2026-09-04).** La casilla de arriba se marcó en el commit
> `cdc8b82`, sobre el texto **anterior** a la reversión de la decisión de color:
> aquel R2 exigía conservar `#2AB87C` y añadir un token de texto oscuro. El
> humano había pedido por chat la vía contraria, la spec se rehizo con ella
> (`d8cee0b`) y el **leader** volvió a poner `approved` por su cuenta
> (`29f94aa`). El `reviewer` lo levantó como bloqueo B2 de C6: en el repo no
> quedaba commit humano sobre el texto vigente. Por eso la firma de abajo.

El humano debe firmar además, explícitamente, los cuatro puntos que esta spec
resuelve por escrito y que no puede cerrar sola (detalle en [[design]]):

1. **`--accent: #178255`** y su consecuencia declarada: los rellenos de la app
   dejan de coincidir 1:1 con el Figma Make. Es una **desviación explícita de
   #46 R1**, argumentada en [[design]] §2 D1, y R2 la deja escrita también en
   `docs/ui-guidelines.md` con el texto propuesto en [[design]] §7.
2. **El token se mantiene único por tema para el relleno** (`#178255` en light
   y dark) y se **parte** para la tinta (`--accent-strong`: `#107148` light,
   `#2AB87C` dark). Los dos números que lo justifican están en [[design]] §2 D2.
3. **La convivencia con `--success`**: la distancia perceptual ΔE00 entre el
   acento y `--success` pasa de 9,16 (hoy) a **9,24**, es decir no empeora.
   Argumento y medidas en [[design]] §3.
4. **La excepción al invariante**: R2/R6 obligan a editar **10 literales de
   color en 9 líneas** de `src/theme/__tests__/global-css.test.ts` (asserts de
   valor de token de #46 R1/R2, no asserts de conducta). Lista exacta en
   [[design]] §6.

Los dos criterios de aceptación de #61 que quedaron **obsoletos** al revertirse
la decisión (AC1 y AC10, que exigían justo lo contrario: que ningún relleno
cambiara de color) **ya fueron reescritos** en `feature_list.json` por el leader
el 2026-09-03, con la redacción que [[traceability]] §Criterios obsoletos
propuso. No queda nada que pegar.

### Firma sobre el texto vigente (bloqueo B2 del reviewer)

Marca esta casilla y las cuatro de los puntos, con tu commit, para cerrar C6:

- [X] Firmo el `requirements.md` **vigente** (fecha: ____)
- [X] 1 — `--accent: #178255`, con su desviación declarada de #46 R1
- [X] 2 — relleno único por tema, tinta partida (`--accent-strong`)
- [X] 3 — la convivencia con `--success` (ΔE00 9,16 → 9,24)
- [X] 4 — la excepción de 10 literales en 9 líneas de `global-css.test.ts`

Gate humano de cierre (criterio de aceptación 10, **no delegable a IA**):
smoke en **dev build de Android**, comparando lado a lado con el Figma, en
tema **claro Y oscuro**, confirmando que el acento se ve más oscuro que el
Make **a propósito**, que las etiquetas blancas se leen sobre él, y que el
verde de tinta (links, iconos, gráfica) sigue vivo en dark.
