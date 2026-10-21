Worktree: /home/claude/sites/Pet-Tracker-wt-191

NO lances `./init.sh` aunque AGENTS.md lo pida: lo corre el leader (comparte Postgres y LocalStack con otros worktrees; ahora mismo #190 lo está usando).

# Handoff a Codex CLI — feature #191 mobile-add-pet-two-steps

Antes de tocar nada, confirma en el reporte `pwd` y `git branch --show-current` (debe ser `feature/191-mobile-add-pet-two-steps`). Trabaja SOLO en ese worktree: no uses `/home/claude/sites/Pet-Tracker` (otra sesión) ni `main`.

Feature: mobile-add-pet-two-steps (#191), branch `feature/191-mobile-add-pet-two-steps`.
Spec aprobada: `specs/mobile-add-pet-two-steps/requirements.md` (status: approved, 2026-10-19; D1 a D5 confirmadas con su valor por defecto).
Lee también, enteros: `specs/mobile-add-pet-two-steps/design.md` (decisiones técnicas, §Salida tras guardar, §Deuda del picker, §Archivos afectados, §Qué pasa con cada grupo del `index.test.tsx` actual), `tasks.md` y `traceability.md`.

Resumen: «Nueva mascota» (`mobile-pet-tracker/src/screens/add-pet/index.tsx`) pasa de un formulario largo a dos pasos. Paso 1: título, «1 de 2», barra de dos segmentos, foto + burbuja de Pingo, Tipo, Nombre, Raza, Sexo, Tamaño (con `SegmentedControl` nuevo) y «Continuar». Paso 2: Edad, Esterilizado, Microchip y «Guardar mascota». Atrás en el paso 2 vuelve al paso 1 sin perder datos (`usePreventRemove`). Crear, errores, foto y celebración no cambian de contrato.

Entorno: `.env` ya está copiado y `node_modules` instalado en `mobile-pet-tracker/` (si faltara: `bun install --frozen-lockfile` allí). Bun para todo en móvil (`bunx`, `bun add`; nunca `npx` ni `npm i`). No hay dependencias nuevas.

## Anclas

Desde `mobile-pet-tracker/` (`cd /home/claude/sites/Pet-Tracker-wt-191/mobile-pet-tracker` primero). Cada ancla va sola: `grep -c` sale con código 1 cuando la cuenta es 0, así que no las encadenes con `&&`. Salida esperada en H0 tras el `#`.

```
grep -cF 'FieldErrorMessage' src/screens/add-pet/index.tsx   # 4
grep -cF 'style={CONTINUOUS_CORNER}' src/screens/add-pet/index.tsx   # 5
grep -cF 'rounded-16' src/screens/add-pet/index.tsx   # 1
grep -cF 'text-17' src/screens/add-pet/index.tsx   # 1
grep -cF 'text-accent-strong' src/screens/add-pet/index.tsx   # 1
grep -cF 'hitSlop={TOUCH_SLOP}' src/screens/add-pet/index.tsx   # 3
grep -cF "t('addPet.avatarPreview')" src/screens/add-pet/index.tsx   # 1
grep -cF "t('addPet.addPet')" src/screens/add-pet/index.tsx   # 0
grep -cF 'usePreventRemove' src/screens/add-pet/index.tsx   # 0
grep -cF 'bg-accent-soft' src/screens/add-pet/index.tsx   # 4
grep -cF "title: t('addPet.addPet')" src/app/_layout.tsx   # 1
grep -cF "'addPet.avatarPreview'" src/i18n/catalog.ts   # 2
grep -cF "'addPet.stepProgress'" src/i18n/catalog.ts   # 0
grep -cF "'addPet.pingoGreeting'" src/i18n/catalog.ts   # 0
grep -cF "'addPet.continue'" src/i18n/catalog.ts   # 0
grep -cF "key: 'addPet.avatarPreview'" src/__tests__/ui-copy-table.ts   # 1
grep -cF "{ file: 'src/app/_layout.tsx', key: 'addPet.addPet' }" src/__tests__/ui-copy-table.ts   # 1
grep -cF 'expect(R9_ADD_PET).toHaveLength(42 + 1 - 2 + 4 + 3 - 3);' src/__tests__/ui-language.test.ts   # 1
grep -cF '+ 4, // #186 R1' src/providers/__tests__/language-provider.test.tsx   # 1
grep -cF "['pets/add', 't:addPet.addPet']," src/app/__tests__/layout.test.tsx   # 1
grep -cF 'validateAddPetBasics' src/utils/form-rules.ts   # 0
grep -cF 'export function validateAddPet' src/utils/form-rules.ts   # 1
grep -cF "'screens/add-pet/index.tsx': 1," src/__tests__/chunky-cta-canvas-fidelity.test.ts   # 1
grep -cF "literalId('add-pet-submit')" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # 1
grep -cF "'screens/add-pet/index.tsx': 1," src/__tests__/consistency-classnames.test.ts   # 1
grep -cF "'screens/add-pet/index.tsx'," src/__tests__/design-drift.test.ts   # 2
grep -cF "'screens/add-pet/index.tsx': 1," src/__tests__/design-drift.test.ts   # 1
grep -cF 'goToStep2' src/screens/add-pet/index.test.tsx   # 0
grep -cF 'PICKER_MOCK_UNARMED' src/screens/add-pet/index.test.tsx   # 3
grep -cF "jest.mock('expo-router/react-navigation'" src/screens/add-pet/index.test.tsx   # 0
grep -cF '#95 R5' src/screens/add-pet/index.test.tsx   # 1
grep -cF '#95 R6' src/screens/add-pet/index.test.tsx   # 1
grep -cF '#62 R11' src/screens/add-pet/index.test.tsx   # 1
grep -cF '#61 R10' src/screens/add-pet/index.test.tsx   # 1
grep -cF '### §2.36' ../specs/mobile-ui-language/design.md   # 1
grep -cF '### §2.37' ../specs/mobile-ui-language/design.md   # 0
grep -cF 'Enmienda #191' ../docs/ui-guidelines.md   # 0
grep -cF '13. **Botón con cuerpo**' ../docs/ui-guidelines.md   # 1
grep -cF 'usePreventRemove' node_modules/expo-router/build/react-navigation/core/usePreventRemove.js   # 5
test ! -e src/components/segmented-control.tsx && echo sin-segmented-control   # sin-segmented-control
test ! -e src/components/__tests__/segmented-control.test.tsx && echo sin-test-segmented   # sin-test-segmented
test ! -e src/__tests__/add-pet-two-steps.test.ts && echo sin-two-steps-test   # sin-two-steps-test
test ! -e .expo/types/router.d.ts && echo sin-router-d-ts   # sin-router-d-ts
```

Además, mide con los comandos de B1, B2, B3, B4, B8, B9 y B10 de `requirements.md` §Base medida y compáralos con su columna «En `14ec7307`» (en este árbol dieron: B1 = 429 claves de `en`; B2 = 36 secciones `### §2.`, la última §2.36, así que esta feature escribe **§2.37**; B10 = 35 `it(` y 6 `it.each`, 894 líneas). Si la cifra de H0 difiere, vale la de H0 y el delta de la spec no cambia.

**B6 de la spec no sirve tal cual en este entorno.** El `bun -e "import {usePreventRemove} from 'expo-router/react-navigation'"` falla con un error de sintaxis flow de react-native: no es que falte el símbolo. Lo sustituye la última ancla de arriba (el fichero de `expo-router` 57.0.14 que define el hook) más el mock de R9, que obliga a que el import resuelva. Firma real: `usePreventRemove(preventRemove: boolean, callback: (options: { data: { action } }) => void)`. Si esa ancla no da 5, PARA: R9 cambia de mecanismo.

Si cualquier otra ancla no da su valor, PARA y avisa.

## H0 y T0

- H0 = `git rev-parse HEAD` tras el commit de este handoff. Anótalo en el reporte. Base medida antes del handoff: `76d0c1f9cbc636e90fd608e2f37aa2e318008950` (merge de `origin/main` con #193). Los commits del leader posteriores solo tocan `feature_list.json`, `progress/current.md` y este handoff; las anclas valen en H0.
- Mide T0 (total de `it` de toda la suite móvil en H0), una sola vez y sin pipe, con `<log>` en un fichero temporal fuera del árbol: `cd /home/claude/sites/Pet-Tracker-wt-191/mobile-pet-tracker && bun run test > <log> 2>&1; grep -E '^Tests:' <log>`. Todo rojo en H0 es parada. El aviso final `A worker process has failed to exit gracefully` es preexistente: no paras por él.
- Mide también los totales por fichero de los que vas a tocar (cada uno solo) antes del primer commit. **Esta spec no fija cifras de total**: las mides tú y las reportas.

## Cadena de commits (test primero, rojo → verde por requisito)

Mensajes con `(R<n>)` como pide `tasks.md`. Cada commit rojo contiene SOLO tests (y los inventarios que nombra); cada verde, SOLO producción. En cada rojo, antes de commitear, corre el `it` y anota la aserción exacta que falla. Rojo legítimo = fallo por aserción, o `Unable to find an element with testID: <testID nuevo de esta feature>`. Un `ReferenceError`, un import inexistente o `Test suite failed to run` NO es rojo legítimo (C4): corrige el test. No empaques implementación, tests y docs en un solo commit: en #19 eso incumplió C4.

Desviaciones declaradas por el leader respecto a `tasks.md` (no enmiendan la spec; el estado final es idéntico). Menciónalas en el reporte:

1. **R1 sin las tres filas de la tabla.** `checkUses` de `ui-language.test.ts` (regex `\bt\(\s*['"]clave['"]` sobre el fichero de cada fila de `ui-copy-table.ts`) exige que cada fila tenga su `t('clave')` en su fichero. Si R1 añadiera ya las filas `stepProgress`, `pingoGreeting` y `continue` (o moviera `addPet.addPet`), `#65 R9` y «resuelve cada ocurrencia de la tabla» quedarían rojos hasta R3, R4, R7 y R2. Así que R1 hace **solo** catálogo (+3 −1), borra el `<Text>` de `avatarPreview` y quita su fila de la tabla; cada fila nueva nace en el commit rojo del R que usa la clave. Suma final idéntica a la spec.
2. **Un único verde conjunto para R3, R4, R7, R8 y R10.** Están acoplados: el indicador de paso 2 (R3) y el helper `goToStep2` (R10) necesitan el botón Continuar (R7), y los `it` actuales que alcanzan campos del paso 2 se rompen al desmontarlos en el paso 1. Cada R tiene su commit rojo propio y hay **un** commit verde para los cinco.
3. **Candados globales con rojo declarado en los verdes intermedios** (ver más abajo): se mueven todos en R11, y entre R5 y R11 solo pueden estar rojos los de la lista cerrada.

Secuencia:

```
# -- 1. R1 (copy)
```
- **R1 rojo** `test(mobile): claves de copy del asistente de dos pasos (R1)`. `language-provider.test.tsx` → nuevo `it` `#191 R1: declara las claves del asistente de dos pasos en los dos idiomas`: valores EN/ES literales (`addPet.stepProgress` = `{{current}} of {{total}}` / `{{current}} de {{total}}`; `addPet.pingoGreeting` = `Hi. Tell me about your new companion.` / `Hola. Cuéntame de tu nuevo compañero.`; `addPet.continue` = `Continue` / `Continuar`), `addPet.avatarPreview` ausente en `en` y `es`, marcadores `{{…}}` iguales entre idiomas, y la fórmula de longitud de `en` suma `+ 3 - 1` al final (hoy acaba en `+ 4, // #186 R1`; añade un comentario `// #191 R1` y conserva el existente). `ui-copy-table.ts`: **solo** quita la fila `addPet.avatarPreview`; `ui-language.test.ts`: la fórmula de `R9_ADD_PET` añade ` - 1` (queda `42 + 1 - 2 + 4 + 3 - 3 - 1`, con `// #191 R1` en el comentario de la línea). Rojo esperado: solo el `it` nuevo de `language-provider` (por aserción). Lo de `ui-language.test.ts` nace verde (declara el NV): quitar la fila y bajar la fórmula no depende aún del catálogo. Si algo más se pone rojo, PARA.
- **R1 verde** `feat(mobile): claves de copy del asistente de dos pasos (R1)`. `src/i18n/catalog.ts` (`en` y `es`: alta de las tres claves, baja de `addPet.avatarPreview`), borrar en `add-pet/index.tsx` el `<Text className="font-semibold text-muted">{t('addPet.avatarPreview')}</Text>` (ningún test de la pantalla lo afirma), y la sección `### §2.37` de `specs/mobile-ui-language/design.md` con el formato de §2.36 (filas tipo `| — | \`addPet.stepProgress\` | EN | ES | ← añadida por #191 (R1) |`; abre la sección con la misma explicación breve que §2.36). Verifica: `grep -rn "addPet.avatarPreview" src` sale vacío.

```
# -- 2. R7, parte pura
```
- **R7a rojo** `test(mobile): validateAddPetBasics (R7)`. `src/utils/form-rules.test.ts` → `#191 R7: validateAddPetBasics` (nombre vacío, solo espacios, `'a'`, longitud 120 sin issue; el issue es el mismo `RuleIssue` `nameRequired` que usa `validateAddPet`). El rojo es `TypeError: … validateAddPetBasics is not a function` (símbolo nuevo aún sin exportar): es el rojo normal de una función pura nueva; declara el mensaje exacto en el reporte. Aquí `bun run typecheck` fallará solo por ese símbolo (ver «Antes de cada commit de código»).
- **R7a verde** `feat(mobile): validateAddPetBasics en form-rules (R7)`. Función pura `validateAddPetBasics(values: { name: string }): FieldIssues<'name'>` en `src/utils/form-rules.ts`; `validateAddPet` la reutiliza y conserva firma y comportamiento. Los 89 `it` de `#186 R2` quedan intactos y verdes.

```
# -- 3. R5 (SegmentedControl)
```
- **R5 rojo** `test(mobile): SegmentedControl compartido (R5)`. `src/components/__tests__/segmented-control.test.tsx` → `#191 R5: SegmentedControl`; en `index.test.tsx`: `#191 R5: Tipo, Sexo y Tamaño usan el selector`, **reescritura** de `#62 R11: los chips de especie usan la receta única de chip` (afirmaba `px-3 py-2`) y adaptación de `#61 R10` (los cinco testID siguen con `hitSlop` igual a `TOUCH_SLOP`). Si el rojo es «Cannot find module» del componente, vale: el fichero nuevo no existe.
- **R5 verde** `feat(mobile): SegmentedControl compartido para Tipo, Sexo y Tamaño (R5)`. `src/components/segmented-control.tsx` con la firma exacta de R5; la pantalla lo usa en Tipo (`allowEmpty` falso), Sexo y Tamaño (`allowEmpty` verdadero), con los testID existentes. Tras este verde, `consistency-classnames`, `design-drift` y `alerts-canvas-fidelity` pueden ponerse rojos por inventarios: se tratan en R11, no aquí (ver «Candados»).

```
# -- 4. R2 (título en el contenido)
```
- **R2 rojo** `test(mobile): título en el contenido y cabecera sin título (R2)`. `src/app/__tests__/layout.test.tsx`: la fila pasa a `['pets/add', '']`; en `index.test.tsx` `#191 R2: el título vive en el contenido` **sustituye** a `#95 R5: la pantalla no dibuja cabecera propia` (sigue sin existir `add-pet-back`). `ui-copy-table.ts`: la fila `addPet.addPet` cambia de `src/app/_layout.tsx` a `src/screens/add-pet/index.tsx` (la fórmula de `R9_ADD_PET` no cambia: es un cambio de fichero). Rojos esperados: ambos `it` de R2 y, en `ui-language.test.ts`, `checkUses` (`#65 R9` y «resuelve cada ocurrencia de la tabla») hasta el verde.
- **R2 verde** `feat(mobile): título de Nueva mascota en el contenido (R2)`. `_layout.tsx`: `<Stack.Screen name="pets/add" options={{ ...headerOptions, title: '' }} />` (hoy: `title: t('addPet.addPet')`); la pantalla pinta `<Text testID="add-pet-title" accessibilityRole="header" className="text-2xl font-black tracking-title text-foreground">` con `t('addPet.addPet')` como primer elemento del `ScrollView` `add-pet-form`. Ojo: `src/app/_layout.tsx` conserva otras 3 filas de la tabla (`weightLog`, `geofences`, `geofenceEditor`); `SCREEN_FILES` no cambia.

```
# -- 5. Núcleo: indicador, paso 1, Continuar, paso 2 y helper (cinco rojos y un verde)
```
- **R3 rojo** `test(mobile): indicador de paso y barra de dos segmentos (R3)`. `#191 R3: el indicador de paso` (paso 1 y 2, `accessibilityValue`, EN «1 of 2»). Para alcanzar el paso 2 todavía no hay botón: **no** añadas el helper `goToStep2` aquí; en este commit las aserciones del paso 2 se escriben ya contra `add-pet-continue` y fallan por `Unable to find an element with testID: add-pet-continue` (rojo legítimo). `ui-copy-table.ts`: añade la fila `addPet.stepProgress` y la fórmula de `R9_ADD_PET` pasa a `... - 1 + 1`.
- **R4 rojo** `test(mobile): paso 1 con foto, burbuja y datos básicos (R4)`. `#191 R4: el paso 1 pinta foto, burbuja y datos básicos` (orden de nodos, ausencias por `queryByTestId` de `age-mode-date`, `age-mode-months`, `birth-date-field`, `sterilized-true`, `microchip-input`, `add-pet-submit`; clases de foto y burbuja; `pet-avatar` ausente sin foto y presente tras `pressPickPhoto()`; literal «Hola. Cuéntame de tu nuevo compañero.»). **Sustituye** a `renders the complete two-section form and deterministic preview`. Fila `addPet.pingoGreeting` en `ui-copy-table.ts` y fórmula `... - 1 + 2`. En español, el literal ES va en el test tal cual (no lo importes del catálogo de producción).
- **R7 rojo (pantalla)** `test(mobile): Continuar valida el nombre y avanza (R7)`. `#191 R7: Continuar` (nombre vacío: mensaje bajo el campo, sigue `name-input`, `mockCreatePet` sin llamar, botón no deshabilitado; con «Luna»: aparece `add-pet-submit` y `add-pet-step-label` dice «2 de 2»; mensaje traducido a inglés; corregir y volver a pulsar lo retira). Fila `addPet.continue` y fórmula final `42 + 1 - 2 + 4 + 3 - 3 + 3 - 1` con `#191 R1` en el comentario (equivale a la suma `+ 3 - 1` de la spec).
- **R8 rojo** `test(mobile): paso 2 con datos médicos y su CTA (R8)`. `#191 R8: el paso 2 pinta datos médicos y guarda` (presencia/ausencia por testID; fecha vacía → `birth-date-field-message`; meses `'481'` → `approx-age-input-message`; el modo inactivo no pinta mensaje).
- **R10 rojo** `test(mobile): guardar, errores, foto y celebración desde el paso 2 (R10)`. Helper de test `goToStep2(name = 'Luna')` (escribe el nombre y pulsa `add-pet-continue`; `await` en todo). Adapta con él los `it` actuales de `#186 R4`, `#186 R7`, `#90 R6`, `#123`, `#171 R4` y `#171 R5` **conservando su aserción**, y añade `#191 R10: el 400 se queda en el paso 2 con el aviso y los valores`. Reglas de la deuda #72 (`design.md` §Deuda del picker): para elegir foto usa SOLO `pressPickPhoto()` (conserva el guard `PICKER_MOCK_UNARMED`), no re-enciendas `mockResolvedValueOnce` por tu cuenta, y `await` en todo `fireEvent`/`act`/`render`.
- **Verde conjunto** `feat(mobile): Nueva mascota en dos pasos: indicador, paso 1, Continuar y paso 2 (R3,R4,R7,R8,R10)`. `step` en estado (`1 | 2`), `add-pet-step-label` y `add-pet-step-bar` con sus segmentos (R3); fila foto + burbuja con cola, encabezado `basicDetails`, orden de campos, sin nodos del paso 2 (R4); `handleContinue` con `validateAddPetBasics` y botón `add-pet-continue` con la receta de #177 (`h-14 rounded-16 bg-accent`, `style={chunkyLip.primary}`, `onPress={() => handleContinue()}`, etiqueta `text-17 font-extrabold text-accent-foreground`) (R7); `renderStep2` con edad, esterilizado, microchip y `add-pet-submit` (R8); `handleSubmit` sin cambios de contrato (R10). Sin `useFocusEffect` en add-pet (lo exige `detail-stack.test.tsx`). `FieldErrorMessage` debe seguir en 4 ocurrencias. Todo el copy visible sale de `t()`; el test «no deja ningún valor fijo del catálogo como literal entero» (`wholeLiterals` por AST) aplica a add-pet. `OptionalChip` se queda para Esterilizado y modo de edad. Después de este commit TODO el `index.test.tsx` y `language-provider`/`ui-language`/`layout`/`form-rules` en verde.

```
# -- 6. R6 (métricas del canvas)
```
- **R6 rojo** `test(mobile): métricas y receta de campos del canvas (R6)`. `#191 R6: métricas y receta de campos` (ambos pasos; `contentContainerStyle` exacto con `toEqual` y `useSafeAreaInsets` simulado en `bottom: 24`: `{ paddingHorizontal: 20, paddingTop: 12, gap: 12, paddingBottom: 48 }`; clases de etiquetas e inputs completas; `maxLength` 120, 120, 3, 32). **Reescribe** `#95 R6` y conserva `#62 R12`, `#148 R4`, `#148 R8`, `#186 R4` (`maxLength`).
- **R6 verde** `feat(mobile): métricas y campos de Nueva mascota como el canvas (R6)`. Contenido `{ paddingHorizontal: 20, paddingTop: 12, gap: 12, paddingBottom: insets.bottom + 24 }`; campo = `View className="gap-1.5"` con etiqueta `text-13 font-extrabold text-foreground`; inputs y `birth-date-field` con `h-12 rounded-xl border-2 border-transparent bg-default px-3.5` (los `TextInput`, además, `text-15 font-semibold text-foreground`) y `style={CONTINUOUS_CORNER}`; `ScrollView key={step}` (el scroll vuelve arriba al cambiar de paso).

```
# -- 7. R9 (atrás conserva los datos)
```
- **R9 rojo** `test(mobile): atrás en el paso 2 vuelve al 1 conservando los datos (R9)`. El mock va a nivel de fichero en `index.test.tsx`: `jest.mock('expo-router/react-navigation', () => ({ ...jest.requireActual('expo-router/react-navigation'), usePreventRemove: jest.fn(), __esModule: true }))` conservando `HeaderHeightContext` (el fichero lo importa de ese módulo). Sin navigator, el `usePreventRemove` real lanzaría: por eso el mock. Casos (a) a (f) de R9 de `requirements.md` con `mockUsePreventRemove.mock.lastCall` y `await act(async () => lastCall[1]({ data: { action: { type: 'GO_BACK' } } }))`. Si algún `it` ya existente se rompe por el mock, es un rojo no esperado: PARA.
- **R9 verde** `feat(mobile): atrás en el paso 2 vuelve al paso 1 (R9)`. `usePreventRemove(prevent, callback)` de `expo-router/react-navigation` con `prevent = step === 2 && !submitting && celebratePetName === null && !leaving`; el callback vuelve a `step = 1` conservando todos los valores y limpia `fieldErrors` y `formError`, e ignora la llamada si `submitting`; estado `leaving` + `useEffect` que llama `router.back()` tras renderizar con `prevent` en `false` (design.md §Salida tras guardar); los dos botones de la celebración llaman a `router.replace('/pairing')` y `router.back()` con `prevent` en `false`.
- Tras este verde, corre **la suite móvil completa** y mira los ficheros que mencionan `pets/add`/`AddPetScreen`: `detail-stack.test.tsx`, `detail-stack.guard.test.tsx`, `detail-stack.navigation.test.tsx`, `src/app/(tabs)/__tests__/layout.test.tsx`, `food.test.tsx`, `forms-validation-global.test.ts`. Cualquier rojo fuera de la lista de candados de R11 = PARA.

```
# -- 8. R11 (carta y candados)
```
- Cada candado en su propio par rojo/verde (el rojo es el candado con el valor nuevo; el verde puede ser un commit vacío de producción solo si el valor ya lo cumple el árbol: en ese caso es un commit único `test(mobile): … (R11)` que **nace verde** y lo declaras en el reporte; no inventes producción):
  - `design-drift.test.ts`: `rounded16` de `'screens/add-pet/index.tsx'` 1 → 2; `rounded-14` fuera de Recordatorios añade `components/segmented-control.tsx` (el orden lo fija `sourceFiles`: cópialo de la salida roja); `R9: mobile-pets-profile sin drift` añade `components/segmented-control.tsx`.
  - `chunky-cta-canvas-fidelity.test.ts`: `radii` de `'screens/add-pet/index.tsx'` 1 → 2; `CTA_ROWS` gana una fila `literalId('add-pet-continue')` con las mismas clases que `add-pet-submit` y `keeps` `['onPress={() => handleContinue()}']`.
  - `consistency-classnames.test.ts`: `#166 R2` (`expected`) `'screens/add-pet/index.tsx'` 1 → 2; `directUses`: add-pet 5 → 6 y fila nueva `components/segmented-control.tsx` con 2.
  - `alerts-canvas-fidelity.test.ts`: `token: 'rounded-10'` añade `components/segmented-control.tsx`; `token: 'tracking-title'` y `token: 'text-15'` añaden `screens/add-pet/index.tsx`.
  - Re-mídelos por contenido, no por línea. Cualquier **otro** inventario de «qué ficheros usan tal clase» que se ponga rojo por add-pet o `segmented-control.tsx` → commit propio `test(mobile): inventario … (#191 R11)`. Un rojo de otra naturaleza → PARA y repórtalo en `progress/impl_mobile-add-pet-two-steps.md`. **Ningún candado se relaja, se borra ni se comenta.**
- `src/__tests__/add-pet-two-steps.test.ts` nuevo: `#191 R11: la carta recoge la enmienda` (encabezado `## Enmienda #191 — Nueva mascota en dos pasos`, la línea de radios dentro de la regla 12 antes de «13. **Botón con cuerpo**», casilla con `/- \[[ xX]\] Enmienda #191 aprobada por humano/`) y `#191 R11: add-pet y el selector cumplen los inventarios` (`rounded-16` 2, `style={CONTINUOUS_CORNER}` 6 en add-pet y 2 en el selector, `FieldErrorMessage` 4, `usePreventRemove` 1, ausencia de hex/`StyleSheet`/`[…]` arbitrarias en ambos ficheros). Rojo por aserción antes de tocar `docs/ui-guidelines.md`.
- `docs/ui-guidelines.md` verde: sección `## Enmienda #191 — Nueva mascota en dos pasos` con (a) la línea de radios literal de R11 dentro de la regla 12, (b) la receta del selector segmentado, del indicador de paso y de la burbuja de R3 a R5, (c) las métricas de R6 como aplicación de la excepción «fidelidad al canvas», (d) las desviaciones conscientes de la tabla de `requirements.md`, (e) al final `- [ ] Enmienda #191 aprobada por humano` **sin marcar**. Esa casilla y las de §Cierre del humano de la spec NO las marcas tú ni ninguna IA (R12).

### Candados: qué puede estar rojo y cuándo

Entre el verde de R5 y los commits de R11, los ficheros `design-drift.test.ts`, `chunky-cta-canvas-fidelity.test.ts`, `consistency-classnames.test.ts` y `alerts-canvas-fidelity.test.ts` pueden tener `it` en rojo SOLO por los inventarios de la tabla «Candados globales» de `requirements.md` §Base medida (conteos de `rounded-16`, `style={CONTINUOUS_CORNER}`, `rounded-14`, `rounded-10`, `tracking-title`, `text-15`, filas de `CTA_ROWS`, `R9` sin drift). Tras cada verde intermedio, corre esos cuatro ficheros, anota qué `it` están rojos y por qué, y compáralo con la lista: cualquier rojo fuera de ella es parada. Antes del commit final todos en verde. `forms-validation-global.test.ts` (FieldErrorMessage = 4 en add-pet) NO puede ponerse rojo en ningún momento.

## Reglas críticas

- **Skills (nombres del catálogo de Codex)**: el plugin `expo` de Codex es la v1.0.2 con 13 skills y NO tiene `expo-overview`, `expo-animation` ni `expo-router`. Carga `building-native-ui` (pantalla con componentes nativos, estilo y navegación) y, por ser pantalla/flujo, la skill del repo `appllama-app-design-skill` (`.agents/skills/`, `docs/ui-guidelines.md` §Skills). No hay skill de navegación: el mecanismo de R9 (`usePreventRemove` de `expo-router/react-navigation`) viene entero en la spec y en `design.md`; no busques otro. La feature no tiene animación (fuera de alcance): no cargues `animate-expo` ni añadas constantes a `src/theme/motion.ts`. Di en el reporte exactamente qué skills cargaste.
- Sigue `docs/architecture.md` y `docs/conventions.md` (§Dimensiones, §Esperas sobre el árbol renderizado) y `docs/ui-guidelines.md` (la carta rige la UI móvil; solo la amplías con la sección de R11). Es "Píxel exacto" y "el diseño final como el artifact": las clases de la spec son literales, no las reinterpretes. Sin `StyleSheet`, sin hex, sin clases arbitrarias `[…]`.
- TDD con commits test-primero: cada rojo antes de su verde, sin excepción. Un rojo distinto del descrito (`Test suite failed to run`, `ReferenceError`, un `it` no listado) = PARA y avisa; no ajustes la aserción para que pase.
- Esperas sobre el árbol renderizado (`docs/conventions.md` §«Esperas sobre el árbol renderizado»): espera a un nodo o a un estado, no al contador de un mock. `render`, `fireEvent`, `act` y `rerender` de RNTL 14 son asíncronos: `await` en todos, o el `it` siguiente hereda un `setState` pendiente (y la suite entera de add-pet es sensible a eso, deuda #72). Los nodos decorativos ocultos a accesibilidad no los ve `getBy*` sin `includeHiddenElements`.
- Nunca `toBe`/`toEqual` entre instancias de React ni entre nodos del árbol (tumba el worker de jest con JSON circular). Compara por `props`/`testID`/`Object.is` de valores simples. Si una corrida de varios ficheros en rojo tumba un worker, repite con `-i`.
- Un fichero de jest a la vez, desde `mobile-pet-tracker/`: `bunx jest <ruta>` o `bunx jest <ruta> -t '#191 R1:'` (los dos puntos evitan que `R1` coincida con `R10` y `R11`). Cuidado con paths con paréntesis (`src/app/(tabs)/…`): el posicional de jest es un regex y `(tabs)` hace que el fichero se salte con salida 0; usa `--runTestsByPath` o escapa. Si un `it` agota el tiempo con la máquina cargada, repite el fichero solo antes de juzgarlo.
- Comentarios: solo `#191 R<n>` (por ejemplo `// #191 R5`). Nunca `#191` a secas ni `#NNN` sin `R<n>`: el guard de hex de `design-drift` lo lee como color.
- Antes de cada commit de código: `test ! -e .expo/types/router.d.ts` (si existe, PARA; no lo borres), `bun run typecheck` con salida 0 en cada commit verde (en un commit rojo solo puede fallar por el símbolo o módulo nuevo que el test importa y aún no existe: `validateAddPetBasics`, `segmented-control`; decláralo y no lo ocultes con `any`), y `bunx expo lint --no-cache > <log> 2>&1 && test ! -s <log>` con `<log>` fuera del árbol (el OOM mata eslint y la CLI sale 0: por eso se exige log vacío). Ninguna medición de veredicto usa pipes (`cmd | tail` da el código de `tail`). No hay prettier en móvil.
- Tras modificar código: `graphify update .` desde la raíz del worktree. No commitees `graphify-out/` (está en `.gitignore`).
- Cadenas de comandos: escribe cada cabecera como comentario `# --`, nunca como línea ejecutable, y encadena el registro del rojo con el `git commit` por `&&`. Acota `git status` y `git diff` a las rutas esperadas (`git status --short -- <rutas>`). Si usas `git checkout HEAD -- <ruta>` para revertir una prueba, comprueba después `git diff --cached --quiet -- <ruta>` y `git diff --quiet -- <ruta>`.
- Ficheros que puedes tocar (lista cerrada): `mobile-pet-tracker/src/screens/add-pet/index.tsx`, `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`, `mobile-pet-tracker/src/components/segmented-control.tsx`, `mobile-pet-tracker/src/components/__tests__/segmented-control.test.tsx`, `mobile-pet-tracker/src/app/_layout.tsx`, `mobile-pet-tracker/src/app/__tests__/layout.test.tsx`, `mobile-pet-tracker/src/i18n/catalog.ts`, `mobile-pet-tracker/src/utils/form-rules.ts`, `mobile-pet-tracker/src/utils/form-rules.test.ts`, `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`, `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`, `mobile-pet-tracker/src/__tests__/ui-language.test.ts`, `mobile-pet-tracker/src/__tests__/add-pet-two-steps.test.ts`, los cuatro candados de R11 (`design-drift`, `chunky-cta-canvas-fidelity`, `consistency-classnames`, `alerts-canvas-fidelity`), `docs/ui-guidelines.md`, `specs/mobile-ui-language/design.md`, `specs/mobile-add-pet-two-steps/traceability.md` y `progress/impl_mobile-add-pet-two-steps.md`. Compruébalo al final con `git diff --name-only <H0>..HEAD`; todo lo que salga fuera de esa lista es un error tuyo. No toques backend, `src/api/`, `package.json`, `bun.lock`, `app.json`, `src/theme/`, `Celebration`, `PetAvatar`, `FieldErrorMessage`, `FormError` ni `createPet`.
- Solapes con #189 y #190 (otras features en otros worktrees): `src/i18n/catalog.ts` y `src/app/_layout.tsx`. No los resuelvas tú; si ves que `origin/main` los cambió, avísalo en el reporte y no mergees.
- NO son tuyos: `progress/history.md`, `progress/current.md`, `STATUS.md`, el campo `status` de `feature_list.json`.
- Si el sandbox te deniega un comando, PARA y repórtalo; no lo sustituyas por otro. No crees recursos AWS. NO abras ni edites la PR. NO rebases tras el commit de trazabilidad.

## Criterios de aceptación

- CC1 (desde `mobile-pet-tracker/`): `bunx jest` sin ningún `it` en rojo, fichero a fichero, en todos los que tocas y en `forms-validation-global.test.ts`, `detail-stack.test.tsx`, `detail-stack.guard.test.tsx`, `detail-stack.navigation.test.tsx`, `src/app/(tabs)/__tests__/layout.test.tsx` y `food.test.tsx`; `bun run test` completo con todo verde medido sin pipe (reporta `Tests:` antes y después: T0 y total final; el delta lo explicas por R); `bun run typecheck` con salida 0; `bunx expo lint --no-cache` con código 0 y log vacío.
- CC2: `grep -cF` finales: `FieldErrorMessage` 4 en add-pet; `usePreventRemove` ≥ 1 en add-pet; `rounded-16` 2; `style={CONTINUOUS_CORNER}` 6 en add-pet y 2 en el selector; `grep -rn "addPet.avatarPreview" src` vacío; `#191 R1` presente en el comentario de las fórmulas de `ui-language.test.ts` y `language-provider.test.tsx`, y la suma final de `R9_ADD_PET` termina en `+ 3 - 1` (+3 filas nuevas, −1 la de `avatarPreview`); longitud de `en` = 431 (429 + 3 − 1, medida con el comando de B1).
- CC3: `specs/mobile-add-pet-two-steps/traceability.md` sin filas «pendiente»: R1 a R11 con el `archivo::describe` real y el hash del commit que lo cumple (R12 queda «cierre humano»). Verifica cada hash con `git cat-file -e <hash>`.
- CC4: la casilla `- [ ] Enmienda #191 aprobada por humano` de `docs/ui-guidelines.md` y las dos de §Cierre del humano de la spec siguen **sin marcar**.

## Al terminar

1. Un commit final: `docs(#191): trazabilidad y reporte de implementación (R1-R11)`, con `specs/mobile-add-pet-two-steps/traceability.md` y `progress/impl_mobile-add-pet-two-steps.md`, con `git add` de esas rutas y `git commit -o -- <rutas>`. La trazabilidad va en UN commit final, después de todos los de código. No rebasar.
2. `progress/impl_mobile-add-pet-two-steps.md` incluye: H0, T0, `Tests:` por fichero tras cada commit, los hashes de cada rojo y verde, las skills cargadas, la aserción exacta que falla en cada rojo, los `it` que nacieron verdes (y por qué), las tres desviaciones del leader, la lista de candados que estuvieron rojos entre R5 y R11, el resultado de CC1 a CC4, el `git diff --name-only <H0>..HEAD`, y cada parada o desviación.
3. Última acción: crea `progress/impl_mobile-add-pet-two-steps.done` con una sola línea: la ruta de `progress/impl_mobile-add-pet-two-steps.md`. Es el marcador que vigila `scripts/harness/watch-impl.sh`; no lo commitees (está en `.gitignore`).
