---
feature: "mobile-add-pet-two-steps"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-add-pet-two-steps]] (#191)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de capas. Toda UI de esta feature se rige por
> `docs/ui-guidelines.md` y `docs/conventions.md` §Dimensiones.

La pantalla «Nueva mascota» (`src/screens/add-pet/index.tsx`) pasa de un
formulario largo a **dos pasos** como el artboard «Nueva mascota» (22) del canvas
aprobado (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j, hueco C9 de
`progress/explore_canvas-parity-2026-10-16.md` §N5): título y «1 de 2» en el
contenido, barra de dos segmentos, foto con burbuja de Pingo, «Datos básicos» con
selectores segmentados y «Continuar». El paso 2 reúne lo que hoy es «Datos
médicos» y termina en «Guardar mascota». Reglas del humano: «el diseño final como
el artifact» y «Píxel exacto».

Lo que ya existe y esta feature **no** repite ni toca: la validación por campo de
#186 (`FieldErrorMessage`, `validateAddPet`), la celebración de #171
(`Celebration`, `add-pet-celebration`), la subida de foto tras el alta (#72/#130),
`PetAvatar`, el payload de `createPet` y la receta del botón de #177.

## Decisiones humanas pendientes

El canvas **solo dibuja el paso 1**. Cada decisión lleva un valor por defecto con
su razón, y **la spec está redactada con ese valor**. Mientras la casilla de la
decisión siga sin marcar, el valor es una propuesta, no una decisión. Si el humano
elige la alternativa, la enmienda de la spec es solo la que cada bloque indica.

### Decisión humana pendiente D1 — Partición de campos entre los dos pasos

- **Por defecto**: paso 1 = foto, burbuja, Tipo, Nombre, Raza, Sexo, Tamaño; paso 2
  = Edad (fecha o meses), Esterilizado/a, Microchip. Es la partición que el canvas
  dibuja en el paso 1 y la que pide la descripción de #191.
- **Razón**: la edad es el único dato obligatorio que no está en el paso 1; ponerla
  sola con dos opcionales hace que el paso 2 sea corto y que cada paso valide un
  grupo coherente (identidad / salud).
- **Alternativa**: mover la edad al paso 1 (el paso 2 sería solo opcionales). Cambia
  R4, R7 y R8 y deja a «Continuar» validando nombre y edad.
- [x] D1 confirmada por el humano (valor por defecto) — fecha: 2026-10-19

### Decisión humana pendiente D2 — Botón atrás del paso 2

- **Por defecto**: atrás en el paso 2 (cabecera nativa, botón físico de Android y
  gesto de iOS) vuelve al paso 1 **conservando todo lo escrito**; atrás en el paso 1
  sale de la pantalla como hoy (R9).
- **Razón**: el usuario que se equivoca de nombre no debe perder la edad ni la foto
  ni salir del flujo; salir del formulario de golpe es la peor sorpresa de un asistente
  de dos pasos.
- **Alternativa**: atrás sale siempre de la pantalla. Se borra R9 y el
  `usePreventRemove` de design.md.
- [x] D2 confirmada por el humano (valor por defecto) — fecha: 2026-10-19

### Decisión humana pendiente D3 — ¿Habla Pingo en cada paso?

- **Por defecto**: Pingo habla **solo en el paso 1**, con la frase del canvas
  adaptada a su voz (carta §7: el saludo termina en punto). El paso 2 no lleva
  burbuja.
- **Razón**: el canvas solo dibuja la del paso 1; el paso 2 es el que más campos
  y teclado tiene y una burbuja más empuja el CTA fuera de pantalla.
- **Alternativa**: una frase corta en el paso 2 con `{{petName}}` (por ejemplo
  «Ahora cuéntame de la salud de {{petName}}.»). Añade una clave
  `addPet.pingoStep2` (+1 en el catálogo y en la fórmula de R1) y un `it` en R8.
- [x] D3 confirmada por el humano (valor por defecto) — fecha: 2026-10-19

### Decisión humana pendiente D4 — ¿Cuándo se valida?

- **Por defecto**: al pulsar **Continuar** se valida solo lo del paso 1 (el nombre);
  al pulsar **Guardar mascota** se valida lo del paso 2 (la edad). Ambos con
  `FieldErrorMessage` debajo del campo y sin bloquear el botón (carta #186).
- **Razón**: el error aparece donde está el campo; si solo se validara al guardar, un
  nombre vacío se descubriría en el paso 2 sin campo a la vista.
- **Alternativa**: validar todo solo al guardar y, si falla el nombre, volver al paso 1.
  Quita R7 y añade un retorno al paso 1 en R8.
- [x] D4 confirmada por el humano (valor por defecto) — fecha: 2026-10-19

### Decisión humana pendiente D5 — Selecciones iniciales

- **Por defecto**: Tipo arranca en **Perro** (como hoy); Sexo y Tamaño arrancan **sin
  selección** y se pueden deseleccionar pulsando otra vez (como hoy). Las selecciones
  del canvas (Hembra, Mediano) son datos de muestra, no valores por defecto.
- **Razón**: `sex` y `size` son opcionales en `CreatePetInput`; preseleccionarlos
  enviaría datos que el usuario no eligió.
- **Alternativa**: arrancar con Hembra y Mediano marcados como el artboard. Cambia R5
  y el payload de la prueba de R10.
- [x] D5 confirmada por el humano (valor por defecto) — fecha: 2026-10-19

## Base medida

Base congelada al escribir: `14ec7307` (`origin/main`, merge de #234, ya con #186,
#176 y #177). H0 es el commit del handoff. Toda cifra que otra feature pueda mover
se escribe «base medida en H0 + delta»; el handoff la **vuelve a medir en H0 con el
mismo comando** y, si no coincide con la de `14ec7307`, vale la de H0 y el delta no
cambia. Comandos desde `mobile-pet-tracker/`.

| Id | Qué | Comando | En `14ec7307` |
|---|---|---|---|
| B1 | Claves de `en` | `bun -e "import {en} from './src/i18n/catalog.ts'; console.log(Object.keys(en).length)"` | 429 (la fórmula de `language-provider.test.tsx` acaba en `+ 4, // #186 R1`) |
| B2 | Última sección `### §2.N` de `../specs/mobile-ui-language/design.md` | `grep -c '^### §2\.' ../specs/mobile-ui-language/design.md` y ver la última | 36, la última §2.36 (#186). Esta feature toma **la última en H0 + 1** (§2.37 si nada se mueve) |
| B3 | Fórmula de `expect(R9_ADD_PET).toHaveLength(` | `grep -F 'expect(R9_ADD_PET).toHaveLength(' src/__tests__/ui-language.test.ts` | `42 + 1 - 2 + 4 + 3 - 3` = 45 |
| B4 | Las tres claves nuevas no existen | `for k in stepProgress pingoGreeting continue; do grep -cF "'addPet.$k'" src/i18n/catalog.ts; done` | `0 0 0` |
| B5 | `addPet.avatarPreview` se usa solo en la pantalla y en su fila | `grep -rn "addPet.avatarPreview" src` | `catalog.ts` x2, `ui-copy-table.ts` x1, `add-pet/index.tsx` x1 |
| B6 | `usePreventRemove` sale de `expo-router/react-navigation` | `bun -e "import {usePreventRemove} from 'expo-router/react-navigation'; console.log(typeof usePreventRemove)"` | `function` (si en H0 imprime otra cosa, **parar**: R9 cambia de mecanismo) |
| B7 | Ficheros nuevos no existen | `test ! -e src/components/segmented-control.tsx && test ! -e src/components/__tests__/segmented-control.test.tsx && test ! -e src/__tests__/add-pet-two-steps.test.ts` | sale 0 |
| B8 | `validateAddPetBasics` no existe | `grep -c validateAddPetBasics src/utils/form-rules.ts` | 0 |
| B9 | Fila de cabecera de `pets/add` | `grep -F "['pets/add'," src/app/__tests__/layout.test.tsx` | `['pets/add', 't:addPet.addPet'],` |
| B10 | Tamaño de la suite de la pantalla | `grep -cE '^\s*it\(' src/screens/add-pet/index.test.tsx` y `grep -cE '^\s*it\.each' …` | 35 `it(` y 6 `it.each` (894 líneas) |

Anclas de `src/screens/add-pet/index.tsx` (`grep -cF '<literal>' …`) en `14ec7307`:

| Literal | Cuenta |
|---|---|
| `FieldErrorMessage` | 4 (import + 3 usos; **debe seguir en 4**, `forms-validation-global.test.ts`) |
| `style={CONTINUOUS_CORNER}` | 5 |
| `rounded-16` | 1 |
| `text-17` | 1 |
| `text-accent-strong` | 1 |
| `hitSlop={TOUCH_SLOP}` | 3 |
| `t('addPet.avatarPreview')` | 1 |
| `t('addPet.addPet')` | 0 |
| `usePreventRemove` | 0 |
| `bg-accent-soft` | 4 |

Candados globales que esta feature mueve (valores en `14ec7307`; el implementer los
re-mide en H0 por contenido, no por línea):

| Candado | Dónde | Hoy | Después |
|---|---|---|---|
| `rounded-16` por fichero | `design-drift.test.ts` (inventario `rounded16`), `chunky-cta-canvas-fidelity.test.ts` (const `radii`) | `'screens/add-pet/index.tsx': 1` | `: 2` |
| Primarios con labio por fichero | `consistency-classnames.test.ts` (`#166 R2`, const `expected`) | `'screens/add-pet/index.tsx': 1` | `: 2` |
| Filas de CTA primario | `chunky-cta-canvas-fidelity.test.ts` (`CTA_ROWS`) | una fila con `literalId('add-pet-submit')` | además una fila `literalId('add-pet-continue')` con los mismos classes y `keeps` `['onPress={() => handleContinue()}']` |
| `style={CONTINUOUS_CORNER}` de add-pet | `consistency-classnames.test.ts` (`directUses`) | `5` | `6` (la burbuja); más una fila nueva `components/segmented-control.tsx` con **2** (contenedor y segmento) |
| `rounded-14` fuera de Recordatorios | `design-drift.test.ts` (`outsideReminders(/\brounded-14\b/)`) | `[meal-schedule, meals-history]` | añade `components/segmented-control.tsx` (el orden lo fija `sourceFiles`; el implementer lo copia de la salida roja) |
| `rounded-10` | `alerts-canvas-fidelity.test.ts` (`token: 'rounded-10'`) | `[alerts, meal-schedule]` | añade `components/segmented-control.tsx` |
| `tracking-title` | `alerts-canvas-fidelity.test.ts` (`token: 'tracking-title'`) | sin add-pet | añade `screens/add-pet/index.tsx` |
| `text-15` | `alerts-canvas-fidelity.test.ts` (`token: 'text-15'`) | sin add-pet | añade `screens/add-pet/index.tsx` |
| Hex, `StyleSheet`, `[…]` arbitrarias | `design-drift.test.ts` (`R9: mobile-pets-profile sin drift`) | add-pet limpio | `components/segmented-control.tsx` también limpio |

Cualquier **otro** candado que se ponga rojo por esta feature (por ejemplo, un
inventario de `shadow-sm`, `font-extrabold` o `text-13` que no se ha podido ver en
la medición de la spec) se trata así: si es un inventario de «qué ficheros usan
tal clase» y la causa es add-pet o `segmented-control.tsx`, se **añade el fichero**
en un commit propio `test(mobile): inventario … (#191 R11)`; si el rojo es de otra
naturaleza, **parar y reportar** en `progress/impl_mobile-add-pet-two-steps.md`.
Ningún candado se relaja, se borra ni se comenta para dejar pasar la feature.

## Requisitos funcionales

Los testID nuevos son `add-pet-title`, `add-pet-step-label`, `add-pet-step-bar`,
`add-pet-step-segment-1`, `add-pet-step-segment-2`, `add-pet-photo` (ya existe, cambia
de elemento), `add-pet-bubble`, `add-pet-bubble-tail`, `add-pet-bubble-text` y
`add-pet-continue`. Los testID existentes (`screen-add-pet`, `add-pet-form`,
`pet-avatar`, `photo-upload-error`, `species-dog|cat`, `name-input`, `breed-input`,
`sex-female|male`, `size-small|medium|large`, `age-mode-date|months`,
`birth-date-field`, `birth-date-picker`, `approx-age-input`, `sterilized-true|false`,
`microchip-input`, `add-pet-submit`, `add-pet-error`, `add-pet-celebration*`,
`name-input-error|-message|-message-row` y sus equivalentes de `birth-date-field` y
`approx-age-input`) **no cambian de nombre**.

- **R1** (copy): THE SYSTEM SHALL declarar en el catálogo, en inglés y en español,
  tres claves nuevas y retirar `addPet.avatarPreview`, de modo que:
  `addPet.stepProgress` = `{{current}} of {{total}}` / `{{current}} de {{total}}`;
  `addPet.pingoGreeting` = `Hi. Tell me about your new companion.` /
  `Hola. Cuéntame de tu nuevo compañero.`; `addPet.continue` = `Continue` /
  `Continuar`. La longitud de `en` pasa de la base de B1 a **base + 3 − 1 = base + 2**
  (suma `+ 3 - 1 // #191 R1` a la fórmula de `language-provider.test.tsx`), `es` mantiene
  las mismas claves (el tipo `Record<TranslationKey, string>` lo exige) y los marcadores
  `{{…}}` coinciden entre idiomas. La fórmula de `R9_ADD_PET` suma `+ 3 - 1 // #191 R1`;
  `ui-copy-table.ts` añade las tres filas (`addPet.stepProgress`, `addPet.pingoGreeting`,
  `addPet.continue`, las tres con `file: 'src/screens/add-pet/index.tsx'`), quita la de
  `addPet.avatarPreview` y **cambia** la fila `addPet.addPet` de `src/app/_layout.tsx` a
  `src/screens/add-pet/index.tsx` (cuenta neta de la tabla: +2; la fórmula suma
  `+ 3 - 1`, porque el cambio de fichero de una fila no altera la longitud). El `<Text>` de la pantalla que
  usa `addPet.avatarPreview` se borra en el mismo commit (R4 rehace después la fila de foto). Una
  sección `### §2.<N>` nueva (B2) en `specs/mobile-ui-language/design.md` documenta
  las tres claves con el formato de §2.36.
  - Test: `src/providers/__tests__/language-provider.test.tsx::#191 R1: declara las
    claves del asistente de dos pasos en los dos idiomas` (valores EN/ES literales,
    ausencia de `addPet.avatarPreview`, longitud) y `src/__tests__/ui-language.test.ts`
    (`R9_ADD_PET` + `checkUses`).

- **R2** (título en el contenido): WHEN se monta `AddPetScreen`, THE SYSTEM SHALL
  pintar el título `t('addPet.addPet')` («Nueva mascota» / «Add pet») en
  `<Text testID="add-pet-title" accessibilityRole="header" className="text-2xl font-black tracking-title text-foreground">`
  como primer elemento del `ScrollView` `add-pet-form`, y la `Stack.Screen` `pets/add` de
  `src/app/_layout.tsx` SHALL pasar a `options={{ ...headerOptions, title: '' }}` (la
  cabecera nativa conserva su botón atrás, como `add-reminder`, D-H de la carta).
  - Test: `src/app/__tests__/layout.test.tsx` (la fila pasa a `['pets/add', '']`, test
    existente `%s usa exactamente las opciones de cabecera acordadas`) y
    `src/screens/add-pet/index.test.tsx::#191 R2: el título vive en el contenido`.
    **Sustituye** a `#95 R5: la pantalla no dibuja cabecera propia`, que afirma lo
    contrario (el `it` se reescribe, no se deja en rojo ni se borra la intención:
    sigue sin existir `add-pet-back`).

- **R3** (indicador de paso): WHILE la pantalla está en el paso N (1 o 2), THE SYSTEM
  SHALL pintar en la fila de título, a la derecha, `<Text testID="add-pet-step-label"
  className="text-13 font-extrabold text-muted">` con `t('addPet.stepProgress',
  { current: N, total: 2 })` («1 de 2»), y debajo una barra
  `<View testID="add-pet-step-bar" accessibilityRole="progressbar"
  accessibilityValue={{ min: 1, max: 2, now: N }} className="flex-row gap-1.5">` con dos
  segmentos `add-pet-step-segment-1` y `-2`, cada uno `h-1.5 flex-1 rounded-full`; el
  segmento k lleva `bg-accent` si k ≤ N y `bg-lip-gray` si k > N (nunca las dos clases).
  - Test: `index.test.tsx::#191 R3: el indicador de paso` (paso 1: «1 de 2», seg-1
    `bg-accent`, seg-2 `bg-lip-gray`; paso 2: «2 de 2», ambos `bg-accent`;
    `accessibilityValue` en los dos pasos; en inglés «1 of 2»).

- **R4** (paso 1): WHILE el paso es 1, THE SYSTEM SHALL pintar, en este orden, la fila
  foto + burbuja, el encabezado `t('addPet.basicDetails')`, el selector Tipo
  (`species-dog`, `species-cat`), `name-input`, `breed-input`, el selector Sexo
  (`sex-female`, `sex-male`), el selector Tamaño (`size-small|medium|large`) y el
  botón `add-pet-continue`; y SHALL NOT montar ningún campo del paso 2 ni
  `add-pet-submit`.
  - Foto: `add-pet-photo` es un `Pressable` `size-22 items-center justify-center rounded-full
    border-2 border-dashed border-accent bg-surface-secondary` con `accessibilityRole="button"`,
    `accessibilityLabel={t('addPet.choosePhoto')}`, `hitSlop={TOUCH_SLOP}` y
    `disabled={submitting}`. **Sin foto** pinta el icono `Camera` de
    `reicon-react-native` (tamaño 26, color `accent-strong` por `useThemeColors`) y debajo
    `<Text className="text-11 font-extrabold text-accent-strong">{t('addPet.choosePhoto')}</Text>`.
    **Con foto** (`photoAsset`) pinta dentro `PetAvatar` (`testID="pet-avatar"`, `size={88}`,
    `photoUrl={photoAsset.uri}`, `name={name.trim() || t('addPet.pet')}`) en lugar del icono y
    la etiqueta. El `Pressable` abre el selector con el mismo `handlePickPhoto` de hoy y
    `photo-upload-error` sigue debajo de la fila, igual que hoy.
  - Burbuja (`add-pet-bubble`): `View` `flex-1 rounded-tile bg-surface-secondary px-3 py-2.5`
    con `style={CONTINUOUS_CORNER}`; dentro `<Text testID="add-pet-bubble-text" className="text-13
    font-semibold text-foreground">{t('addPet.pingoGreeting')}</Text>`; y la cola
    `<View testID="add-pet-bubble-tail" className="absolute -left-1.5 top-5.5 size-3 rotate-45
    bg-surface-secondary" />`. Es un `View` y no un `Card` porque `twMerge` no sustituye
    `rounded-card` por `rounded-tile` (misma razón que #178 con `rounded-22`). La fila es
    `flex-row items-center gap-3.5` (canvas: 14).
  - Test: `index.test.tsx::#191 R4: el paso 1 pinta foto, burbuja y datos básicos`
    (orden de los nodos por `getAllByTestId`/jerarquía; ausencia por `queryByTestId` de
    `age-mode-date`, `age-mode-months`, `birth-date-field`, `sterilized-true`, `microchip-input`,
    `add-pet-submit`; clases de foto y burbuja; `pet-avatar` ausente sin foto y presente con
    foto tras `pressPickPhoto()`; literal «Hola. Cuéntame de tu nuevo compañero.»).
    Sustituye a `renders the complete two-section form and deterministic preview`.

- **R5** (selector segmentado compartido): THE SYSTEM SHALL exportar
  `SegmentedControl` de `src/components/segmented-control.tsx` con la firma
  `SegmentedControl<T extends string>({ options, value, onSelect, allowEmpty }: {
  options: readonly { value: T; label: string; testID: string }[]; value: T | null;
  onSelect: (value: T | null) => void; allowEmpty?: boolean })` y usarlo para Tipo
  (`allowEmpty` falso), Sexo y Tamaño (`allowEmpty` verdadero). El contenedor es `View`
  `flex-row gap-1 rounded-14 bg-default p-1` con `style={CONTINUOUS_CORNER}`; cada opción es
  un `Pressable` `h-9.5 flex-1 items-center justify-center rounded-10` con
  `style={CONTINUOUS_CORNER}`, `hitSlop={TOUCH_SLOP}`, `accessibilityRole="button"`,
  `accessibilityState={{ selected }}` y su `testID`; la seleccionada añade `bg-surface shadow-sm`
  y su etiqueta (`Text`) es `text-sm font-extrabold text-accent-strong`; las demás,
  `text-sm font-extrabold text-muted`. WHEN el usuario pulsa la opción ya seleccionada,
  THE SYSTEM SHALL llamar `onSelect(null)` solo si `allowEmpty`; en otro caso no llama
  `onSelect`. WHEN pulsa otra, llama `onSelect(value)`.
  - Test: `src/components/__tests__/segmented-control.test.tsx::#191 R5: SegmentedControl`
    (recetas de clases, `hitSlop`, `accessibilityState`, `allowEmpty` verdadero y falso,
    pulsar otra opción) y `index.test.tsx::#191 R5: Tipo, Sexo y Tamaño usan el selector`
    (D5: perro seleccionado, sexo y tamaño sin selección; pulsar `sex-male` y otra vez
    `sex-male` deja `selected: false`; pulsar `species-dog` estando seleccionado la deja
    seleccionada). **Reescribe** `#62 R11: los chips de especie usan la receta única de
    chip` (afirma `px-3 py-2`) y conserva `#61 R10` (los cinco testID siguen con
    `hitSlop` igual a `TOUCH_SLOP`).

- **R6** (métricas y receta de campos, canvas): THE SYSTEM SHALL aplicar a toda la
  pantalla las métricas del artboard, que la excepción «fidelidad al canvas» de
  `docs/conventions.md` §Dimensiones autoriza: `contentContainerStyle` de `add-pet-form`
  igual a `{ paddingHorizontal: 20, paddingTop: 12, gap: 12, paddingBottom: insets.bottom + 24 }`
  (con `useSafeAreaInsets` simulado en `bottom: 24` el objeto es `{ paddingHorizontal: 20,
  paddingTop: 12, gap: 12, paddingBottom: 48 }`); cada campo es `View className="gap-1.5"` con
  su etiqueta `<Text className="text-13 font-extrabold text-foreground">` (sin `uppercase`
  ni `tracking-widest`); y los `TextInput` (`name-input`, `breed-input`, `approx-age-input`,
  `microchip-input`) y el `Pressable` `birth-date-field` llevan `h-12 rounded-xl
  border-2 border-transparent bg-default px-3.5` (los `TextInput`, además,
  `text-15 font-semibold text-foreground`) más `style={CONTINUOUS_CORNER}`, conservando
  `maxLength` 120, 120, 3 y 32, `placeholderTextColor={muted}` y los `FieldErrorMessage`
  debajo de cada campo. Los chips `OptionalChip` de Esterilizado y los de modo de edad
  conservan su receta de hoy.
  - Test: `index.test.tsx::#191 R6: métricas y receta de campos` (los dos pasos; objeto
    exacto con `toEqual`; clases de etiquetas e inputs por `className` completo).
    **Reescribe** `#95 R6: métricas bajo cabecera nativa` (afirmaba `padding: 24, gap: 16`)
    y conserva `#62 R12`, `#148 R4`, `#148 R8`, `#186 R4` (`maxLength 120 120 32 y 3`).

- **R7** (continuar y validar el paso 1): WHEN el usuario pulsa `add-pet-continue`,
  THE SYSTEM SHALL ejecutar `validateAddPetBasics({ name })` y, si no hay issue, limpiar
  `fieldErrors` y `formError` y pasar al paso 2 **sin llamar a `createPet`**; IF el
  nombre está vacío o solo espacios, THEN THE SYSTEM SHALL pintar bajo `name-input` el
  mensaje `addPet.nameIsRequired` con `<FieldErrorMessage testID="name-input" …>`, quedarse
  en el paso 1 y dejar `add-pet-continue` habilitado. `validateAddPetBasics(values: { name:
  string }): FieldIssues<'name'>` es una función pura **nueva** de `src/utils/form-rules.ts`
  que devuelve `{ name: nameRequired }` con el mismo `RuleIssue` que `validateAddPet`, y
  `validateAddPet` conserva su firma y su comportamiento (su suite de #186 R2, 89 `it`,
  sigue verde sin tocarse). `add-pet-continue` es
  `<Button testID="add-pet-continue" className="h-14 rounded-16 bg-accent"
  style={chunkyLip.primary} onPress={() => handleContinue()}>` con etiqueta
  `<Text className="text-17 font-extrabold text-accent-foreground">{t('addPet.continue')}</Text>`
  (receta de #177, igual que `add-pet-submit`).
  - Test: `src/utils/form-rules.test.ts::#191 R7: validateAddPetBasics` (vacío, solo
    espacios, `'a'`, longitud 120 sin issue) y `index.test.tsx::#191 R7: Continuar` (con
    nombre vacío: mensaje bajo el campo, sigue `name-input`, `mockCreatePet` sin llamar,
    botón no deshabilitado; con «Luna»: aparece `add-pet-submit` y `add-pet-step-label` dice
    «2 de 2»; el mensaje de nombre se traduce a inglés; corregir el nombre y volver a pulsar
    lo retira).

- **R8** (paso 2): WHILE el paso es 2, THE SYSTEM SHALL pintar, tras el título y la barra,
  el encabezado `t('addPet.medicalDetails')`, el campo Edad (chips `age-mode-date` y
  `age-mode-months`, y según el modo `birth-date-field` o `approx-age-input`, con su
  `FieldErrorMessage`), Esterilizado/a (`sterilized-true|false`), `microchip-input` y
  `add-pet-submit` (misma receta que hoy, etiqueta `t('addPet.savePet')`, `isDisabled=
  {submitting}`, `onPress={() => void handleSubmit()}`), y SHALL NOT montar la fila de foto ni la
  burbuja ni los campos del paso 1. WHEN el usuario pulsa `add-pet-submit` con la edad
  inválida, THE SYSTEM SHALL pintar el mensaje del campo de edad que corresponda al modo
  (`addPet.chooseBirthDate` o `addPet.errorAgeRange`), quedarse en el paso 2 y no llamar a
  `createPet`; `handleSubmit` sigue usando `validateAddPet` con los cuatro valores.
  - Test: `index.test.tsx::#191 R8: el paso 2 pinta datos médicos y guarda` (presencia y
    ausencia por `testID`; fecha vacía → `birth-date-field-message`; meses `'481'` →
    `approx-age-input-message`; el modo inactivo no pinta mensaje, ya cubierto por `#186
    R4`).

- **R9** (atrás conserva los datos): WHILE el paso es 2 y no hay un guardado en curso ni la
  celebración abierta, THE SYSTEM SHALL llamar `usePreventRemove(true, callback)` de
  `expo-router/react-navigation` con un `callback` que vuelve al paso 1 conservando
  **todos** los valores (`species`, `name`, `breed`, `sex`, `size`, `photoAsset`, `ageMode`,
  `birthDate`, `approxAgeMonths`, `sterilized`, `microchip`) y que limpia `fieldErrors` y
  `formError`; WHILE el paso es 1, o la celebración está abierta, o se acaba de guardar,
  `usePreventRemove` SHALL recibir `false` y atrás sale de la pantalla como hoy. IF
  `submitting` es verdadero cuando llega el callback, THEN THE SYSTEM SHALL ignorarlo.
  Cuando `handleSubmit` termina bien sin celebración, `router.back()` SHALL llamarse
  con `prevent` ya en `false` (ver design.md §Salida tras guardar); y los dos botones de la
  celebración llaman a `router.replace('/pairing')` y `router.back()` con `prevent` en `false`.
  - Test: `index.test.tsx::#191 R9: atrás en el paso 2 vuelve al 1 con los datos`. Mock de
    `expo-router/react-navigation` con `usePreventRemove: jest.fn()` y
    `...jest.requireActual(...)`, **conservando `HeaderHeightContext` y `__esModule: true`**;
    el test lee `mockUsePreventRemove.mock.lastCall` y ejecuta
    `await act(async () => lastCall[1]({ data: { action: { type: 'GO_BACK' } } }))`.
    Casos: (a) paso 1 → `lastCall[0] === false`; (b) paso 2 → `true`; (c) escribir nombre,
    elegir gato, hembra, tamaño grande, foto, continuar, meses `'24'`, esterilizado sí,
    microchip `'123'`, disparar el callback → paso 1 con todo conservado y `add-pet-step-label`
    «1 de 2»; volver a continuar → paso 2 con `'24'`, sí y `'123'`; (d) con `createPet`
    pendiente, el callback no cambia de paso; (e) tras un guardado correcto sin
    celebración, al llamarse `router.back` (se captura en su `mockImplementation`) el último
    `lastCall[0]` es `false`; (f) con celebración, `lastCall[0]` es `false` y «Ahora no»
    llama `router.back` una vez.

- **R10** (guardar, errores, foto y celebración no cambian): WHEN el usuario pulsa
  `add-pet-submit` con la edad válida, THE SYSTEM SHALL ejecutar el `handleSubmit` de hoy:
  payload de `createPet` idéntico (`name` recortado, `species`, `birthDate` en día civil
  local o `approxAgeMonths` numérico, `breed`, `sex`, `size`, `sterilized`, `microchip`
  solo si no están vacíos), `submitting` deshabilita `add-pet-submit` y `add-pet-photo`,
  los resultados `unauthorized`, `invalid`, `forbidden`, `unreachable`, `error` y
  `missing-config` caen en los mismos mensajes (`add-pet-error` bajo el CTA del paso 2,
  que conserva los valores y el paso), la foto se sube **después** de crear, y la
  celebración `add-pet-celebration` de #171 se muestra solo si `wasFirst`; en otro caso
  `router.back()`.
  - Test: todos los `it` actuales de `#186 R4`, `R7`, `#90 R6`, `#123`, `#171 R4` y `#171
    R5` **se conservan con su aserción** y llegan al paso 2 con un helper de test
    `goToStep2(name = 'Luna')` (escribe el nombre y pulsa `add-pet-continue`); el `it`
    `#191 R10: el 400 se queda en el paso 2 con el aviso y los valores` es nuevo. Las
    reglas de la deuda #72 rigen en esos `it` (ver design.md §Deuda del picker).

- **R11** (carta, candados y trazabilidad de UI): THE SYSTEM SHALL dejar `docs/ui-guidelines.md`
  con una sección `## Enmienda #191 — Nueva mascota en dos pasos` que (a) añade a la escala
  de radios la línea `Fuera de la escala, por fidelidad al canvas (#191): \`rounded-10\`
  (10 px) y \`rounded-14\` (14 px), segmentos y contenedor del selector segmentado de Nueva
  mascota; \`rounded-tile\` (18 px) de la burbuja de Pingo, que es un \`View\` y no un
  \`Card\`.` dentro de la regla 12 (antes de «13. **Botón con cuerpo**»), (b) fija la receta
  del selector segmentado, del indicador de paso y de la burbuja de R3–R5, (c) nombra las
  métricas de R6 como aplicación de la excepción «fidelidad al canvas», (d) anota las
  desviaciones conscientes de la tabla siguiente, y (e) termina en la casilla
  `- [ ] Enmienda #191 aprobada por humano`. THE SYSTEM SHALL además mover los candados de
  la tabla «Candados globales» de §Base medida, cada uno en su propio commit rojo/verde.
  - Test: `src/__tests__/add-pet-two-steps.test.ts::#191 R11: la carta recoge la enmienda`
    (encabezado, línea de radios dentro de la regla 12, casilla con `/- \[[ xX]\] Enmienda
    #191 aprobada por humano/`) y `…::#191 R11: add-pet y el selector cumplen los inventarios`
    (conteos de la tabla: `rounded-16` 2, `style={CONTINUOUS_CORNER}` 6 y 2, `FieldErrorMessage`
    4 en add-pet, `usePreventRemove` 1, ausencia de hex/`StyleSheet`/`[…]` en los dos ficheros),
    más los candados movidos en sus ficheros.

- **R12** (cierre humano): THE SYSTEM SHALL no darse por cerrada hasta que el humano
  marque en esta spec las casillas de §Cierre del humano (smoke en dev build de Android
  y la firma de la enmienda). Esas casillas **no las marca ninguna IA**.
  - Test: no automático; el `reviewer` comprueba que las dos casillas están marcadas
    con fecha por el humano.

### Desviaciones conscientes del canvas

El humano las revisa en el gate junto con la spec; ninguna cierra una decisión.

| Desviación | Canvas | Esta feature | Razón |
|---|---|---|---|
| Frase de la burbuja | «¡Hola! Cuéntame de tu nuevo compañero.» | «Hola. Cuéntame de tu nuevo compañero.» | Carta §7: un saludo de Pingo termina en punto; misma decisión que #172 en el login |
| Pie del CTA | Barra fija abajo con degradado | El botón va al final del `ScrollView` | El degradado necesitaría `expo-linear-gradient`, vetado por el humano; #178/add-reminder ya hacen lo mismo |
| Sombra del segmento activo | `0 2px 6px rgba(13,17,23,.10)` | `shadow-sm` | No hay token exacto; es la sombra que ya usan `Card` y las filas |
| Interlineado de la burbuja | `line-height: 1.4` | el de `text-13` | Ninguna clase de la escala lo da exacto y están prohibidas las arbitrarias; el login ya lo acepta |
| Entrada animada | `rise` 400 ms al entrar y `fill` de la barra | Sin animación al cambiar de paso | Toda animación nueva necesita su constante en `src/theme/motion.ts` (carta §Animación); queda fuera de alcance |
| Botón atrás | Chevrón dentro del contenido | Cabecera nativa con `title: ''` | Es la convención de las pantallas empujadas (D-H); el chevrón nativo es el botón atrás |
| Franja superior | `padding-top: 56` | `paddingTop: 12` bajo la cabecera nativa | La cabecera nativa consume el inset superior (A11 de §Dimensiones) |

## Fuera de alcance

- Diseñar el paso 2 con una imagen nueva del canvas: lo dibuja esta spec por inferencia
  (D1); si el humano lo pide, se hace con otra feature.
- Cambiar `createPet`, el DTO, el backend, `Celebration`, `PetAvatar`,
  `FieldErrorMessage`, `FormError` o `validateAddPet`.
- Animar la entrada o el cambio de paso (fila «Entrada animada» de la tabla).
- Persistir el borrador del formulario si el usuario sale de la pantalla (cerrar la app o
  salir en el paso 1 lo pierde, como hoy).
- Scroll al inicio automático al cambiar de paso más allá de `key={step}` en el `ScrollView`
  (design.md); no hay aserción de test sobre el offset.
- Un tercer paso o una pantalla de resumen antes de guardar.
- Restyle de Esterilizado/a y del modo de edad como selectores segmentados (el canvas no
  los dibuja; conservan `OptionalChip`).
- La barra de pasos como componente compartido para otras pantallas (nace dentro de
  `add-pet`; si #189 u otra la necesita, se extrae entonces).

## Cierre del humano

- [ ] Enmienda #191 aprobada por humano (la casilla vive también en `docs/ui-guidelines.md`)
- [ ] Prueba de humo en dev build de Android hecha por el humano (fecha: ____). Guion:
  Nueva mascota desde Perfil → el título «Nueva mascota» y «1 de 2» se ven y la barra tiene
  un segmento lleno → «Continuar» con el nombre vacío muestra el mensaje bajo el campo →
  nombre + gato + hembra + foto → «Continuar» (la pantalla empieza arriba) → botón atrás de
  la cabecera, botón físico y gesto vuelven al paso 1 con todo lo escrito → de nuevo al paso 2
  → «Guardar mascota» sin edad muestra el mensaje → guardar con edad: la primera mascota
  celebra, las siguientes vuelven → con el teclado abierto el botón del pie sigue
  alcanzable.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-19) ← gate obligatorio antes de implementar
