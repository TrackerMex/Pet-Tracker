---
feature: "mobile-ui-consistency-polish"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-ui-consistency-polish]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez
> aprobado. Ver [[design]] para las decisiones técnicas, los inventarios sitio
> a sitio y las excepciones declaradas, y
> [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI, gana siempre sobre
> `appllama-app-design-skill`) más [[../../docs/conventions|conventions]]
> §Convenciones de la app móvil y §Dimensiones de pantalla uniformes para las
> reglas que la implementación debe respetar.

Feature #62. Segundo lote del pulido derivado de `progress/audit_ui_polish.md`
(auditoría del 2026-09-03). Cubre **exactamente** los hallazgos 8, 9, 10, 11,
12, 14, 15, 16, 17, 20, 22, 23, 24, 25 y 26 de esa auditoría. Los hallazgos
1-7, 13, 19 y 21 son de la feature #61, ya implementada y mergeada en `main`, y
**no se re-abren**. El hallazgo 18 (`--radius-card` 20 px vs 16 px) está
**fuera** por decisión humana del 2026-09-03. Nada de lo que el audit dejó en
su §Fuera de alcance entra aquí "de paso".

Esta feature parte del árbol **con #61 ya dentro**: `--accent` vale `#178255`,
existe `--accent-strong` para el acento como tinta, existe `TOUCH_SLOP` en
`src/theme/touch-target.ts` y existen los tests `#61 R1`-`#61 R11`. Ninguno de
esos valores se re-litiga.

---

## Invariante duro de la feature (aplica a TODOS los R-ids)

> Este bloque es parte del contrato de cada requisito. Un requisito que se
> cumpla violándolo NO está cumplido.

- **Cero cambios de conducta, lógica, navegación o contratos de API.** Ningún
  `useState`, ningún `useEffect`, ninguna llamada a `api/`, ningún `router.*`,
  ningún handler cambia de forma o de momento de ejecución. En particular: el
  reset de estado de las pantallas de detalle es la feature **#63** y **no se
  arregla aquí**.
- **Ningún `testID` se renombra ni se elimina.** Los tests de conducta de
  #33-#37 se anclan a ellos. *Añadir* un `testID` nuevo sí está permitido y dos
  requisitos lo hacen (R3, R9): quedan enumerados en [[design]] §6.
- **Ningún texto visible cambia.** Ni una cadena, ni mayúsculas/minúsculas, ni
  puntuación, ni idioma.
- **Los diffs son solo de `className`, props de estilo/render (`style`,
  `placeholderTextColor`), el argumento de `useThemeColors`, el cambio de un
  glifo por un componente de icono ya usado en el repo, y estructura visual de
  contenedores** (envolver en el `Card` compartido, pasar un `isLast` a una
  fila). Nada más.
- **Grep-clean de #46 y #72 intacto**: cero hex fuera de
  `mobile-pet-tracker/src/theme/`, cero clases arbitrarias `[...]`, cero
  `StyleSheet.create`, cero `shadow*`/`elevation` legacy. Verificado por
  `src/__tests__/design-drift.test.ts`, que ya está verde y debe seguirlo.
- **Tokens solo en `mobile-pet-tracker/src/theme/global.css`.** Esta feature
  **no añade ni cambia ningún token**: `global.css` no se toca en ningún
  requisito. De `appllama-app-design-skill` se toma el patrón (ley anti-slop 4,
  *shape lock*; leyes de fidelidad nativa), **nunca** su sistema de estilos.
- **Los 8 emoji de iconografía no se tocan** (`📄` de
  `src/screens/docs/index.tsx:18` y los 7 de `src/utils/reminder-meta.ts:7-13`).
  Son otra cosa que los 7 glifos de R7; la distinción, con evidencia, está en
  [[design]] §2 D6.
- **`--radius-card: 20px` (#72 R1) no se reabre**, y `--accent: #178255` (#61
  R2) tampoco.
- **Ningún cambio de motion.** El backlog de
  `progress/audit_animations_mobile.md` sigue cerrado.

---

## Requisitos funcionales

### Bloque A — La escala de radios (hallazgos 10, 8, 22, 23)

- **R1**: WHEN un desarrollador consulta `docs/ui-guidelines.md` THE SYSTEM
  SHALL declarar la escala de radios como **regla escrita** en §Decisiones
  fijas de este repo, con el texto exacto de [[design]] §7 (tres radios, uno
  por rol: `rounded-card` para superficie de card, `rounded-xl` para control /
  tile / input / botón, `rounded-full` para cápsula; `rounded-2xl`,
  `rounded-lg`, `rounded-md` y `rounded-sm` prohibidos en
  `mobile-pet-tracker/src/`); AND WHEN se renderiza cualquiera de los **12**
  botones primarios sólidos de acento (`className` que contiene exactamente
  `bg-accent`, enumerados en [[design]] §4 R1) THE SYSTEM SHALL aplicarles
  `rounded-xl`, cambiando las **4** ocurrencias que hoy usan `rounded-2xl`
  (`src/app/(auth)/login.tsx:102`, `src/app/(auth)/forgot.tsx:57`,
  `src/app/(auth)/register.tsx:274`,
  `src/screens/reset-password/index.tsx:192`) y dejando las 8 restantes sin
  cambio, de modo que el botón primario tenga **un solo radio** en toda la app.
  - Test: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` ::
    `describe('#62 R1: la escala de radios está declarada y el botón primario tiene un solo radio')`

- **R2**: WHEN se renderiza un `Skeleton` que sustituye a una superficie de
  `Card` THE SYSTEM SHALL darle el radio de esa superficie, `rounded-card`, en
  las **3** ocurrencias que hoy declaran `rounded-2xl`
  (`src/app/(tabs)/home.tsx:136` `pet-card-skeleton`,
  `src/app/(tabs)/health.tsx:130` `vaccines-skeleton`,
  `src/screens/reminders/index.tsx:158` `reminder-row-skeleton-*`), conservando
  su clase de dimensión (`h-32`, `h-24`, `h-20`), su `w-full` y su `testID`, de
  modo que el placeholder no cambie de forma al resolverse.
  - Test: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` ::
    `describe('#62 R2: cada skeleton tiene la forma del contenido que sustituye')`

- **R3**: WHEN se renderiza cualquiera de las **4** superficies que hoy
  escriben la receta de card a mano THE SYSTEM SHALL componerlas con el `Card`
  compartido de `mobile-pet-tracker/src/components/card.tsx`, con su `variant`
  por defecto (`surface`) y **sin añadir ningún variant nuevo**, pasando por
  `className` únicamente lo que difiere de la receta (`bg-default` donde el
  fondo sea el neutro, más las utilidades de layout que ya tenían), según la
  tabla de [[design]] §4 R3; AND THE SYSTEM SHALL conservar el `style` absoluto
  de `map-empty-overlay` **como objeto plano** en `props.style` (lo asevera
  `map.test.tsx:410`), el `onPress` y el `accessibilityRole="button"` de
  `last-position-card`, y el `testID` de los tres `Text`
  `plan-warning-<code>`; AND THE SYSTEM SHALL eliminar el import
  `Card as HeroUICard` de `src/app/(tabs)/food.tsx:2`, que queda huérfano (C7).
  - Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx` ::
    `describe('#62 R3: collar-card y last-position-card usan el Card compartido')`;
    `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` ::
    `describe('#62 R3: los avisos de plan usan el Card compartido')`;
    `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` ::
    `describe('#62 R3: el overlay vacío del mapa usa el Card compartido')`

- **R4**: WHEN Tailwind compila cualquier fuente de producción de
  `mobile-pet-tracker/src/` THE SYSTEM SHALL no encontrar **ninguna**
  ocurrencia de `rounded-2xl` ni de `rounded-lg`, llevando a `rounded-xl` los
  **6** sitios que quedan tras R1-R3 y que la escala de R1 clasifica como tile
  o control: `src/screens/reminders/index.tsx:194`, `:207` y `:228` (las tres
  píldoras de resumen, hoy 16 px conviviendo con la fila `Card` de 20 px y el
  tile de icono de 12 px), `src/app/(tabs)/food.tsx:158` (tile `size-14`),
  `src/app/(auth)/forgot.tsx:34` (tile `size-16`) y
  `src/app/(tabs)/weight-log.tsx:250` (tile `size-8`, hoy `rounded-lg`),
  conservando el resto de cada `className` y todos los `testID`.
  - Test: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` ::
    `describe('#62 R4: la app solo usa los radios de la escala declarada')`

### Bloque B — Un rol, un tratamiento (hallazgos 9, 11, 12, 17, 20, 24, 25)

- **R5**: WHEN se renderiza el `Text` que titula una `Card` — el que nombra lo
  que la card contiene y es hermano de sus datos — THE SYSTEM SHALL aplicarle
  `className="text-base font-bold text-foreground"` en los **6** sitios
  enumerados en [[design]] §4 R5 (`src/app/(tabs)/home.tsx:247` "Today's
  Summary", `src/app/(tabs)/health.tsx:210` "Weight",
  `src/app/(tabs)/food.tsx:169` "Meals today", `src/app/(tabs)/food.tsx:250`
  "AI recommendation", `src/app/(tabs)/food.tsx:287` "Meal schedule",
  `src/app/(tabs)/meal-schedule.tsx:264` "Nutrition profile"), sustituyendo los
  cuatro tratamientos de hoy (`text-lg font-bold`, `text-sm font-bold`,
  `font-bold` sin clase de tamaño), sin cambiar ningún texto; AND THE SYSTEM
  SHALL **no** tocar la etiqueta de sección en versalitas
  (`text-xs font-semibold uppercase tracking-widest text-muted`), que es otro
  rol y conserva su tratamiento en sus 11 ocurrencias.
  - Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx`,
    `.../health.test.tsx`, `.../food.test.tsx`, `.../meal-schedule.test.tsx` —
    en los cuatro,
    `describe('#62 R5: el título de card usa un único tratamiento')`

- **R6**: WHEN se renderiza la última fila de información de la card
  `pet-info-card` (`src/screens/profile/index.tsx`, el `InfoRow` con
  `label="Última señal"`) THE SYSTEM SHALL renderizarla **sin** separador
  inferior, recibiendo la posición por prop (`isLast`) en vez de por la
  variante `last:border-b-0`, que uniwind no implementa; AND THE SYSTEM SHALL
  conservar el separador (`border-b border-separator`) en las tres filas
  anteriores; AND THE SYSTEM SHALL dejar **cero** variantes de posición
  (`last:`, `first:`, `odd:`, `even:`) en `mobile-pet-tracker/src/`.
  - Test: `mobile-pet-tracker/src/screens/profile/index.test.tsx` ::
    `describe('#62 R6: la última fila de pet-info-card no cuelga su separador')`

- **R7**: WHEN se renderiza un icono de navegación en el chrome de la app THE
  SYSTEM SHALL usar un componente de `reicon-react-native` y **no** un glifo
  tipográfico, sustituyendo los **7** glifos de hoy — `←` en
  `src/screens/docs/index.tsx:68`, `src/screens/add-pet/index.tsx:234`,
  `src/screens/add-reminder/index.tsx:125` y
  `src/screens/pairing/index.tsx:240` por
  `<ArrowLeft size={20} color={foreground} />`, y `›` en
  `src/screens/profile/index.tsx:285`, `:297` y `:310` por
  `<ChevronRight size={20} color={muted} />`, con ambos colores resueltos por
  `useThemeColors` del repo — de modo que queden **cero** ocurrencias de `←` y
  de `›` en `mobile-pet-tracker/src/`; AND THE SYSTEM SHALL conservar los
  `testID`, `accessibilityLabel`, `accessibilityRole`, `hitSlop` y `className`
  de los siete `Pressable` que los contienen; AND THE SYSTEM SHALL **no** tocar
  los 8 emoji de iconografía, que siguen exactamente donde están
  ([[design]] §2 D6).
  - Test: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` ::
    `describe('#62 R7: ningún glifo tipográfico hace de icono')`

- **R8**: WHILE la pantalla Home espera la lista de mascotas
  (`src/app/(tabs)/home.tsx:108`) THE SYSTEM SHALL renderizar
  `<Skeleton testID="home-loading" className="h-12 w-full rounded-card" />`
  —la misma receta que `src/app/(tabs)/health.tsx:89`— en vez del `Spinner`
  suelto de hoy, de modo que el contenido de debajo no salte al resolverse; AND
  THE SYSTEM SHALL eliminar `Spinner` del import de `heroui-native` de
  `home.tsx:2`, que queda huérfano (C7), conservando el `testID`
  `home-loading`.
  - Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx` ::
    `describe('#62 R8: home carga con Skeleton dimensionado, no con Spinner suelto')`

- **R9**: WHEN se renderiza la gráfica de peso (`src/app/(tabs)/weight-log.tsx:141`)
  THE SYSTEM SHALL envolverla en el `Card` compartido con
  `testID="weight-chart-card"`, de modo que la gráfica deje de flotar sobre el
  fondo entre dos cards; AND THE SYSTEM SHALL conservar el
  `testID="weight-chart"` del SVG, las props que recibe `WeightChart` y la
  condición que lo monta, **sin** añadir la cabecera "Evolución de peso" del
  diseño (sería texto nuevo).
  - Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/weight-log.test.tsx` ::
    `describe('#62 R9: la gráfica de peso vive dentro de una card')`

- **R10**: WHEN se renderiza el tipo de un documento
  (`src/screens/docs/index.tsx:21`, el `Text` que muestra `{document.type}`)
  THE SYSTEM SHALL aplicarle
  `className="self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted"`,
  convirtiéndolo en badge monocromo con fondo (contraste `text-muted` sobre
  `bg-default` = 4,601:1 en light, ya medido por #61 R6), sin introducir ningún
  hue nuevo y sin cambiar el texto `{document.type}`.
  - Test: `mobile-pet-tracker/src/screens/docs/index.test.tsx` ::
    `describe('#62 R10: el tipo de documento se lee como badge')`

- **R11**: WHEN se renderizan los chips de especie de la pantalla de alta de
  mascota (`src/screens/add-pet/index.tsx:279-280`, `testID="species-dog"` y
  `species-cat`) THE SYSTEM SHALL aplicarles la **misma** receta de chip que
  las otras tres del archivo — `px-3 py-2` en el `Pressable` y
  `text-sm font-semibold text-foreground` en su `Text` (`:284`) — conservando
  `hitSlop={TOUCH_SLOP}`, `border-accent`/`border-border`, `rounded-full`, los
  `testID`, el `accessibilityState` y el texto, de modo que el área táctil siga
  midiendo ≥ 44 pt (33 pt de caja + 12 pt de slop = 45 pt; cálculo en
  [[design]] §4 R11) y #61 R10 siga verde.
  - Test: `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` ::
    `describe('#62 R11: los chips de especie usan la receta única de chip')`

### Bloque C — Legibilidad del campo de texto y del color imperativo (hallazgos 16, 26)

- **R12**: WHEN se renderiza un `TextInput` crudo de React Native que declara
  `placeholder` (los **5** de `src/screens/add-pet/index.tsx:294`, `:306`,
  `:371`, `:410` y `src/screens/add-reminder/index.tsx:167`) THE SYSTEM SHALL
  declarar también `placeholderTextColor` con el color resuelto por
  `useThemeColors(['muted'])` del repo, que es el mismo token
  (`--field-placeholder: var(--muted)`, `global.css:58` y `:96`) que
  heroui-native resuelve para su `Input`, de modo que **ningún placeholder
  quede ilegible en tema oscuro**; AND THE SYSTEM SHALL igualar la receta
  visual de los **6** `TextInput` crudos de `src/` (los 5 anteriores más
  `src/screens/pairing/index.tsx:361`) a la de heroui eliminando de su
  `className` las utilidades `border border-border`, porque
  `--field-border: transparent` (`global.css:59`) hace que los campos de heroui
  no tengan borde; AND THE SYSTEM SHALL dejar **cero** `TextInput` en
  `mobile-pet-tracker/src/` que declare `placeholder` sin
  `placeholderTextColor`, y **cero** `TextInput` que declare
  `border border-border`, conservando todos los `testID`, `value`,
  `onChangeText`, `maxLength`, `inputMode`/`keyboardType`,
  `autoCapitalize`/`autoCorrect` y los textos de placeholder sin cambio.

  > La migración a `TextField` + `Input` de heroui queda **descartada por
  > escrito** en [[design]] §2 D5, con sus tres razones.

  - Test: `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx` ::
    `describe('#62 R12: el placeholder del formulario sale del tema')`;
    `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` ::
    `describe('#62 R12: el placeholder del formulario sale del tema')`;
    `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` ::
    `describe('#62 R12: los TextInput crudos comparten una sola receta')`

- **R13**: WHEN la pantalla `src/app/(auth)/forgot.tsx` resuelve el color del
  icono `Lock` THE SYSTEM SHALL usar `useThemeColors` de
  `src/theme/use-theme-colors.ts` pidiendo el token **`'accent-strong'`** —no
  `useThemeColor` de heroui-native y no `'accent'`, que rompería el invariante
  ya verde de #61 R4 (`src/__tests__/legibility-classnames.test.ts:145-149`)—
  porque el icono se dibuja **encima** de `bg-accent-soft` y la carta
  §Decisiones fijas 11 fija "fondo ⇒ `--accent`; encima de otra cosa ⇒
  `--accent-strong`"; AND THE SYSTEM SHALL dejar **cero** importaciones y
  **cero** llamadas de `useThemeColor` de heroui-native en
  `mobile-pet-tracker/src/`.
  - Test: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` ::
    `describe('#62 R13: el color imperativo sale siempre de useThemeColors del repo')`

### Bloque D — Micro-reglas de pulido de la carta (hallazgos 14, 15)

- **R14**: WHEN el repo dibuja por su cuenta una esquina redondeada no-cápsula
  —es decir, un `View`, `Pressable` o `TextInput` de React Native, o el `Card`
  compartido, con una clase `rounded-card` o `rounded-xl`— THE SYSTEM SHALL
  declarar en ese elemento un `style` con `borderCurve: 'continuous'`, tomado
  de la constante compartida `CONTINUOUS_CORNER` exportada desde
  `mobile-pet-tracker/src/theme/native-styles.ts`, en las **33** ocurrencias
  enumeradas archivo por archivo en [[design]] §4 R14; AND en
  `src/components/card.tsx` THE SYSTEM SHALL fusionarla con el `style` del
  llamador mediante `StyleSheet.flatten([CONTINUOUS_CORNER, style])`, de modo
  que `props.style` siga siendo un objeto plano y `map.test.tsx:410` siga
  verde; AND THE SYSTEM SHALL **no** declararla en ninguna cápsula
  (`rounded-full`, `borderRadius: 999`, el avatar circular) ni en ningún
  componente de heroui-native, que ya la trae de fábrica ([[design]] §2 D8).
  - Test: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` ::
    `describe('#62 R14: toda esquina no-cápsula que dibuja el repo es continua')`;
    `mobile-pet-tracker/src/components/__tests__/card.test.tsx` ::
    `describe('#62 R14: el Card compartido fusiona borderCurve con el style del llamador')`

- **R15**: WHEN se renderiza un `Text` cuyo contenido es un número que la
  pantalla refresca o compara (los **14** contadores enumerados en [[design]]
  §4 R15, empezando por `stat-speed`, `stat-distance` y `stat-updated` del
  overlay del mapa, que se repinta cada 15 s por `POLL_MS` de `map.tsx:66`)
  THE SYSTEM SHALL declarar en ese `Text` un `style` con
  `fontVariant: ['tabular-nums']`, tomado de la constante compartida
  `TABULAR_NUMS` de `mobile-pet-tracker/src/theme/native-styles.ts`, de modo
  que los dígitos dejen de bailar horizontalmente entre refrescos; AND THE
  SYSTEM SHALL **no** declararla en `stat-gps`, cuyo contenido nunca es
  numérico (`'No signal' | 'Live' | 'Stale'`, `map.tsx:190-195`), ni en ningún
  `Text` de etiqueta.
  - Test: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` ::
    `describe('#62 R15: todo contador usa cifras tabulares')`;
    `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` ::
    `describe('#62 R15: el overlay del mapa usa cifras tabulares')`

### Bloque E — Invariante verificable

- **R16**: WHEN el reviewer valida la feature THE SYSTEM SHALL presentar la
  suite móvil completa (`bun test` en `mobile-pet-tracker/`) en verde sin que
  ningún assert de conducta preexistente haya sido reescrito; AND
  `git diff origin/main...HEAD --stat` SHALL no listar ningún archivo bajo
  `backend-pet-tracker/`, ningún archivo bajo `infra/`, **ni
  `mobile-pet-tracker/src/theme/global.css`**, ni ningún `*.test.tsx` /
  `*.test.ts` preexistente salvo por bloques `describe('#62 R…')`
  **añadidos**; AND el reviewer SHALL rehacer los conteos anti-slop de
  `progress/audit_ui_polish.md` §Conteos anti-slop y obtener **exactamente**
  los números de la tabla de [[design]] §5, dejándolos escritos en
  `progress/review_mobile-ui-consistency-polish.md`.
  - Verificación: `bun test` + `git diff origin/main...HEAD --stat` + los
    greps de [[design]] §5, ejecutados por el `reviewer` (no es un test de
    jest; es un gate mecánico de revisión).

---

## Fuera de alcance

- **Los hallazgos 1-7, 13, 19 y 21 del audit**: son la feature #61, ya
  implementada y mergeada. No se re-abren ni "de paso".
- **El hallazgo 18** (`--radius-card` 20 px vs 16 px). Decisión humana del
  2026-09-03: no se reabre. Queda como punto a comparar en el próximo smoke,
  al mismo tamaño físico. `global.css` no se toca en toda la feature.
- **Los 8 emoji de iconografía.** `📄` (`src/screens/docs/index.tsx:18`) y los
  7 de `src/utils/reminder-meta.ts:7-13`, renderizados en
  `src/screens/reminders/index.tsx:254` y
  `src/screens/add-reminder/index.tsx:155`. Dos tests los fijan como texto
  visible (`src/screens/add-reminder/index.test.tsx:187` afirma `'💉 Vaccine'`;
  `src/screens/reminders/index.test.tsx:341` afirma `'💉'`), así que
  sustituirlos es cambio de texto visible: feature propia. **R7 no los toca.**
- **Migrar los `TextInput` crudos a `TextField` + `Input` de heroui**:
  descartado por escrito en [[design]] §2 D5. R12 arregla el defecto real
  —el placeholder ilegible en dark— con una prop.
- **Unificar el idioma de la UI**, **cabecera nativa para las pantallas de
  detalle**, **errores inline por campo** y **action sheet nativo para el
  confirm destructivo**: todo lo que el audit dejó fuera por exigir cambio de
  conducta sigue fuera.
- **El reset de estado de las pantallas de detalle** (`add-reminder`,
  `pairing`, y las que resulten): es la feature **#63**, es cambio de conducta,
  y #62 no lo toca aunque edite los mismos archivos. Solape anotado en
  [[design]] §8.
- **`hitSlop` en `src/screens/profile/index.tsx:291` (`pairing-link`)**:
  detectado al redactar esta spec. Es un control de ~36 pt sin `TOUCH_SLOP`,
  creado por #42 después de que #61 R10 cerrara sus 13 sitios, así que es un
  residuo del hallazgo **13** (feature #61), no de ninguno de los 15 de #62. Se
  deja anotado en [[design]] §9 para que el `leader` decida; R7 edita ese
  `Pressable` pero **no** le añade `hitSlop`.
- **`summary-skeleton` (`home.tsx:252`, `rounded-xl`)**: sustituye a una fila
  sin radio propio, así que no hay "forma del contenido final" que igualar. R2
  cubre solo los 3 que el audit enumeró.
- **`weight-row-*` (`weight-log.tsx:247`) y `pet-card-error`
  (`home.tsx:140`)**: son las dos superficies con receta propia que el audit
  **no** manda migrar (la primera sigue el diseño, que usa un radio menor para
  filas de historial; la segunda es un `HeroUICard` sin clase de radio). R3
  cubre exactamente las 4 que sí.
- **`--success` como color de texto** (3,586:1 sobre `bg-surface`): fallo AA
  preexistente que la spec de #61 dejó anotado para la próxima auditoría.
  Ningún hallazgo de #62 lo recoge.
- **`health.test.tsx:75`**, que mockea `useThemeColors('muted')` como
  `'#6B7280'` (valor anterior a #61 R6) sin aseverarlo. Higiene anotada por
  #61; tocarlo sería editar un `.test.tsx` preexistente sin necesidad.
- Cualquier cambio de motion (`progress/audit_animations_mobile.md`).
- Cualquier archivo bajo `backend-pet-tracker/` o `infra/`.

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-04) ← gate obligatorio antes de implementar

El humano debe firmar además, explícitamente, los **cinco** puntos que esta
spec resuelve por escrito y que no puede cerrar sola (detalle en [[design]]):

- [X] 1 — **Título de card: `text-base font-bold text-foreground`**, 6 sitios.
      Gana sobre el `text-sm` literal del Make por la advertencia de escala del
      audit (`PhoneFrame` 260 × 530 ⇒ 1,5×) y porque ya es el valor efectivo de
      4 de los 6. [[design]] §2 D1.
- [X] 2 — **Botón primario sólido: `rounded-xl` (12 px)**, y la escala de
      radios como regla escrita en `docs/ui-guidelines.md` con el texto de
      [[design]] §7. Gana `rounded-xl` porque coincide con
      `--field-radius: 0.75rem`, así que botón e input comparten esquina dentro
      de un formulario, y porque cambia 4 `className` en vez de 8.
      [[design]] §2 D2 y D3.
- [X] 3 — **Las 4 superficies pasan al `Card` compartido sin variant nuevo**.
      Consecuencia asumida y declarada: `collar-card`, `last-position-card` y
      los avisos de plan ganan `border border-border` + `shadow-sm`, y
      `map-empty-overlay` gana borde y sombra. Es el aspecto de card del resto
      de la app, que es justo el objetivo de la feature. [[design]] §2 D4.
- [X] 4 — **El placeholder se arregla con `placeholderTextColor`, no migrando
      a `TextField`**: el resultado obligatorio (ningún placeholder ilegible en
      dark, fijado por test) se cumple igual, sin cambiar el árbol de
      componentes ni el manejo de foco. [[design]] §2 D5.
      **Segunda consecuencia visible del mismo R12**, que el humano firma
      aquí: los 6 campos crudos pierden su `border border-border` para
      igualarse a los de heroui, porque `--field-border` vale `transparent` en
      los dos temas. Si el borde se quiere de vuelta, se cambia el token en la
      carta y se aplica a los 11 campos, no solo a estos 6.
- [X] 5 — **`borderCurve: 'continuous'` en 33 sitios con beneficio visible
      cero en el runtime de smoke**: `borderCurve` es no-op en Android y el
      smoke corre en dev build de Android desde 2026-08-27. Se cumple la carta
      y se gana en iOS (feature #60). Es el único requisito de esta spec cuyo
      coste en diff no tiene contrapartida visible hoy; **si el humano prefiere
      no pagarlo, R14 se cae entero y el resto de la spec queda intacta**.
      [[design]] §2 D8.

Gate humano de cierre (criterio de aceptación 8, **no delegable a IA**): smoke
en **dev build de Android**, comparando lado a lado con el Figma, en tema
**claro Y oscuro**, confirmando que (a) el placeholder "Reminder title" se lee
en tema oscuro, que fue el defecto reportado el 2026-09-04; (b) los skeletons
no cambian de forma al resolverse en Home, Health y Reminders; (c) el título de
card se ve igual en Home, Health, Food y Meal schedule; (d) la última fila de
"Información" en Profile ya no cuelga su separador; y (e) las flechas de volver
y los chevrons se ven iguales en todas las pantallas.
