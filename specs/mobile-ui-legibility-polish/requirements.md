---
feature: "mobile-ui-legibility-polish"
status: draft        # draft | approved
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

---

## Invariante duro de la feature (aplica a TODOS los R-ids)

> Este bloque es parte del contrato de cada requisito. Un requisito que se
> cumpla violándolo NO está cumplido.

- **Cero cambios de conducta, lógica, navegación o contratos de API.** Ningún
  `useState`, ningún `useEffect`, ninguna llamada a `api/`, ningún `router.*`,
  ningún handler cambia de forma o de momento de ejecución.
- **Ningún `testID` se renombra ni se elimina.** Los tests de conducta de
  #33-#37 se anclan a ellos. *Añadir* un `testID` nuevo sí está permitido y
  tres requisitos lo hacen explícitamente (R7, R8): quedan enumerados en
  [[design]] §testIDs añadidos.
- **Ningún texto visible cambia.** Ni una cadena, ni mayúsculas/minúsculas, ni
  puntuación, ni idioma. `uppercase` y `tracking-widest` son transformaciones
  de estilo, no cambios de texto.
- **Los diffs son solo de `className`, de props de estilo/render
  (`contentContainerStyle`, `hitSlop`, `numberOfLines`), y de estructura
  visual de contenedores** (envolver en un `ScrollView`, partir una fila en
  dos filas). Nada más.
- **Grep-clean de #46 y #72 intacto**: cero hex fuera de
  `mobile-pet-tracker/src/theme/`, cero clases arbitrarias `[...]`, cero
  `StyleSheet.create`, cero `shadow*`/`elevation` legacy. Verificado por
  `src/__tests__/design-drift.test.ts`, que ya está verde y debe seguirlo.
- **Tokens solo en `mobile-pet-tracker/src/theme/global.css`.** De
  `appllama-app-design-skill` se toma el patrón (jerarquía, anti-slop, ley de
  contraste), **nunca** su sistema de estilos: prohibidos `Color.ios.*`,
  `StyleSheet.create`, hex sueltos y clases arbitrarias.
- **`--accent` conserva `#2AB87C` exacto** (valor Figma aprobado en #46 R1) en
  light y en dark. **Ningún relleno cambia de color** en esta feature: los
  únicos tokens de color que cambian de valor son `--muted`/`--color-muted` en
  el variant **light** (R6); todo lo demás son tokens **nuevos** que solo se
  usan como color de texto.
- **`--radius-card: 20px` (#72 R1) no se reabre.** El hallazgo 18 del audit
  queda fuera; ver [[design]] §Hallazgo 18.
- **El tema oscuro no se degrada.** Ningún requisito puede bajar un par de
  contraste de dark por debajo del que tiene hoy (6,15:1 a 10,36:1 medidos en
  el audit).

Umbral de contraste usado en toda la feature: **WCAG 2.1 AA para texto normal,
≥ 4,5:1**, con la fórmula de luminancia relativa sRGB de la spec
(`L = 0,2126·R + 0,7152·G + 0,0722·B` sobre canales linealizados;
`ratio = (L_claro + 0,05) / (L_oscuro + 0,05)`). El umbral de 3,0:1 de "texto
grande" **no** aplica: el `Button.Label` de heroui es 16 px bold, por debajo
del corte de 18,66 px bold.

---

## Requisitos funcionales

### Bloque A — Contraste de color (hallazgos 21, 1, 3, 2, 19)

> R1 va **primero por dependencia declarada**: el hallazgo 21 pinta hoy la
> etiqueta de un botón destructivo con el token del acento
> (`text-accent-foreground` sobre `bg-danger`) y solo pasa desapercibido
> porque ambos foregrounds valen `#FFFFFF`. Debe quedar corregido **antes** de
> que se toque nada del acento. Ver [[design]] §Orden de implementación.

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
  SYSTEM SHALL exponer un token `--accent-contrast` con el valor **`#0B402A`**
  en los variants `light` **y** `dark`, registrado como utilidad
  `text-accent-contrast`, tal que la relación de contraste entre
  `#0B402A` y `--accent` (`#2AB87C`) sea **≥ 4,5:1** (valor calculado:
  **4,630:1**) en ambos temas, y THE SYSTEM SHALL conservar `--accent`,
  `--color-accent`, `--accent-foreground` y `--color-accent-foreground` con
  sus valores actuales exactos (`#2AB87C` y `#FFFFFF`) en ambos variants.
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#61 R2: token accent-contrast con AA sobre el relleno de acento')`

- **R3**: WHEN se renderiza texto sobre una superficie de relleno de acento
  (`bg-accent`) THE SYSTEM SHALL resolver su color con `text-accent-contrast`
  en las **17** ocurrencias enumeradas en [[design]] §Sitios R3 (10 etiquetas
  de `Button` con `bg-accent` y 7 nodos de texto dentro de las 2 `Card`
  `variant="accent"`), y THE SYSTEM SHALL eliminar las utilidades
  `opacity-70` y `opacity-80` de las 4 ocurrencias que las llevan, de modo que
  ningún texto sobre `bg-accent` quede por debajo de 4,5:1 por composición de
  opacidad (con `opacity-70` el color efectivo cae a 2,811:1 y con
  `opacity-80` a 3,324:1; cálculo en [[design]]).
  - Test: `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` ::
    `describe('#61 R3: todo texto sobre bg-accent usa text-accent-contrast sin opacidad')`

- **R4**: WHEN Tailwind compila `global.css` THE SYSTEM SHALL exponer un token
  `--accent-strong` con el valor **`#167A50`** en el variant `light` y
  **`#2AB87C`** en el variant `dark`, registrado como utilidad
  `text-accent-strong`; AND WHEN se renderiza texto o enlace de color acento
  sobre una superficie neutra THE SYSTEM SHALL resolver su color con
  `text-accent-strong` en las **12** ocurrencias enumeradas en [[design]]
  §Sitios R4, tal que el contraste sea ≥ 4,5:1 sobre `bg-surface`
  (5,338:1), `bg-default` (4,937:1), `bg-surface-secondary` (5,042:1) y
  `bg-accent-soft` (4,646:1) en light, y ≥ 4,5:1 sobre las mismas superficies
  en dark (6,792 / 6,128 / 6,432 / 5,962:1).
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#61 R4: token accent-strong con AA sobre superficies neutras')`
    (token y ratios) y
    `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` ::
    `describe('#61 R4: los enlaces y valores de acento usan text-accent-strong')`
    (sitios)

- **R5**: WHEN Tailwind compila `global.css` THE SYSTEM SHALL exponer un token
  `--warning-strong` con el valor **`#92610A`** en el variant `light` y
  **`#FBBF24`** en el variant `dark`, registrado como utilidad
  `text-warning-strong`; AND WHEN se renderiza **texto** de estado de aviso
  THE SYSTEM SHALL resolver su color con `text-warning-strong` en las **3**
  ocurrencias enumeradas en [[design]] §Sitios R5, tal que el contraste sea
  ≥ 4,5:1 sobre `bg-surface` (5,335:1) y sobre `bg-warning-soft` (4,748:1) en
  light y ≥ 4,5:1 sobre las mismas en dark (10,362 / 7,477:1); AND THE SYSTEM
  SHALL conservar `--warning` y `--color-warning` con sus valores actuales
  (`#F59E0B` light, `#FBBF24` dark) y seguir usando el ámbar puro para
  iconos y rellenos (`color={warning}` de `useThemeColors`, `bg-warning-soft`),
  que no cambian.
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#61 R5: token warning-strong con AA sobre surface y warning-soft')`
    (token y ratios) y
    `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` ::
    `describe('#61 R5: text-warning deja de usarse como color de texto')`
    (sitios; incluye la aserción de que `text-warning` no aparece como color
    de texto en ningún `.tsx` de producción)

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
  enumerados en [[design]] §Sitios R10 (3 filas de enlace, 5 recetas de chip,
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
  dos literales `#6B7280` del variant light (excepción declarada en
  [[design]] §Excepciones al invariante).
  - Verificación: `bun test` + `git diff origin/main...HEAD --stat` ejecutados
    por el `reviewer` (no es un test de jest; es un gate mecánico de revisión).

---

## Fuera de alcance

- **Los hallazgos 8-12, 14-18, 20 y 22-26 del audit.** Son la feature #62
  (`mobile-ui-consistency-polish`). No se tocan aquí ni "de paso", aunque un
  archivo de esta feature los tenga a la vista.
- **El hallazgo 18** (`--radius-card` 20 px vs 16 px). Decisión humana del
  2026-09-03: no se reabre. Queda como punto a comparar en el próximo smoke,
  al mismo tamaño físico.
- **Oscurecer `--accent`**: descartado por el humano el 2026-09-03. El relleno
  conserva `#2AB87C` exacto.
- **`floating-tab-bar.tsx:191`** (`text-accent` de la pestaña activa sobre
  `bg-tab-pill`). No es ninguno de los hallazgos en alcance; el audit declaró
  el componente limpio de punta a punta. Justificación de la exclusión en
  [[design]].
- **`pet-switcher.tsx:32-33`**, listado por el hallazgo 13. Medido durante la
  redacción de esta spec: el chip mide **52 pt** (Avatar `sm` = 40 pt + `p-1`
  = 8 pt + `border-2` = 4 pt), ya por encima de 44 pt. No necesita arreglo;
  la evidencia del audit es incorrecta en ese punto. Justificación en
  [[design]].
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

El humano debe firmar además, explícitamente, los dos puntos que esta spec
resuelve por escrito y que no puede cerrar sola (detalle en [[design]]):

1. **El valor `#0B402A` para `--accent-contrast`** y su consecuencia visible:
   las etiquetas de los 10 botones primarios y los 7 textos de las 2 cards de
   acento pasan de **blanco a verde muy oscuro**. El relleno sigue siendo
   `#2AB87C` exacto, pero el CTA cambia de aspecto.
2. **La excepción al invariante**: R6 obliga a editar dos literales de
   `src/theme/__tests__/global-css.test.ts` (asserts de valor de token de #46
   R1/R2, no asserts de conducta).

Gate humano de cierre (criterio de aceptación 10 de `feature_list.json`, **no
delegable a IA**): smoke en **dev build de Android**, comparando lado a lado
con el Figma, en tema **claro Y oscuro**, confirmando que ningún relleno
cambió de color y que las etiquetas se leen.
