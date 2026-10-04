# explore: mobile-keyboard-avoiding-forms (#148)
Fecha: 2026-10-04
Base congelada: 9cf45204 (origin/main) en /home/claude/sites/Pet-Tracker-wt-148
Anclas: fichero + texto grepeable; no números de línea.

## A. Patrón de referencia (#146 E1)

### A.1 Producción: `mobile-pet-tracker/src/screens/geofence-editor/index.tsx`

Anclas (`grep -n "HeaderHeightContext\|KeyboardAvoidingView\|headerHeight" mobile-pet-tracker/src/screens/geofence-editor/index.tsx`):

- `import { HeaderHeightContext } from 'expo-router/react-navigation';`
- `import { Alert, KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';`
- Dentro de `GeofenceEditorForm`: `const headerHeight = useContext(HeaderHeightContext);` (junto a `const insets = useSafeAreaInsets();`).
- Raíz del formulario: `<KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>` con hijos `<View testID="geofence-editor-map" className="flex-1">` y un `<ScrollView testID="geofence-editor-form" ...>` que cierra con `</ScrollView>\n  </KeyboardAvoidingView>;`.
- Sin `Platform.OS`, sin `?? 0`, sin `enabled`.
- Nota: el mismo fichero conserva otro `<ScrollView testID="screen-geofence-editor" className="flex-1 bg-background"` (estado de carga/error, `grep -n 'testID="screen-geofence-editor"'` da dos hits): el testID se comparte entre la rama skeleton y la rama formulario.

### A.2 Test: `mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx`

- `import { HeaderHeightContext } from 'expo-router/react-navigation';` y `import { Alert, DeviceEventEmitter } from 'react-native';`
- Wrapper del `mount()`: `<HeroUINativeProvider><LanguageProvider initial={language}><HeaderHeightContext.Provider value={91}>{children}</HeaderHeightContext.Provider></LanguageProvider></HeroUINativeProvider>` (no usa `test/render-with-providers.tsx`).
- Bloque literal (final del `it('compone mapa y formulario sin fondo sobre el mapa y con las métricas A11 en el formulario'`), copiado de 9cf45204:

```tsx
    expect(root).toHaveStyle({ paddingBottom: 0 });
    await fireEvent(root, 'layout', { persist() {}, nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 700 } } });
    await act(async () => {
      DeviceEventEmitter.emit('keyboardWillShow', {
        startCoordinates: { screenX: 0, screenY: 800, width: 400, height: 0 },
        endCoordinates: { screenX: 0, screenY: 500, width: 400, height: 300 },
        duration: 0, easing: 'keyboard', isEventFromThisApp: true,
      });
    });
    await waitFor(() => expect(screen.getByTestId('screen-geofence-editor')).toHaveStyle({ paddingBottom: 291 }));
```

- `root` es `screen.getByTestId('screen-geofence-editor')`; antes del bloque el test ya asevera `expect(root.props.className).toBe('flex-1')` y `childTestIds(root)` = `['geofence-editor-map', 'geofence-editor-form']`.

### A.3 Aritmética del 291

KAV (`node_modules/react-native/Libraries/Components/Keyboard/KeyboardAvoidingView.js`, método `_relativeKeyboardHeight`) calcula, en `behavior="padding"`:

```
keyboardY   = endCoordinates.screenY - keyboardVerticalOffset = 500 - 91 = 409
frame.y + frame.height = 0 + 700 = 700   (viene del fireEvent 'layout' con y:0, height:700)
paddingBottom = max(frame.y + frame.height - keyboardY, 0) = 700 - 409 = 291
```

El `fireEvent(root, 'layout', ...)` es imprescindible: sin `frame` la KAV no calcula nada (de ahí el `paddingBottom: 0` previo). `startCoordinates` no entra en el cálculo. Si el Provider vale `undefined` (sin cabecera), `keyboardVerticalOffset` es `undefined` y KAV lo trata como 0 → el mismo evento daría `700 - 500 = 200`.

### A.4 Spec: `specs/mobile-geofence-editor/requirements.md` §`## Enmienda E1 — el formulario se aparta del teclado (paso 9)`

(`grep -n "## Enmienda E1" specs/mobile-geofence-editor/requirements.md` → dos hits: la enmienda y su firma `### Enmienda E1 — teclado sobre el formulario (2026-10-02)`.) Decisiones escritas en E1.1:

- `behavior="padding"` en las dos plataformas, sin `Platform.OS`: la guía de Expo recomienda `undefined` en Android dando por hecho que la ventana se redimensiona; con `behavior` sin definir la KAV es un `View` inerte.
- `keyboardVerticalOffset={headerHeight}`: el `frame` es relativo al padre y `screenY` va en coordenadas de ventana; sin offset el padding se queda corto justo en la altura de la cabecera.
- `useContext(HeaderHeightContext)` y no `useHeaderHeight()`: este último lanza fuera de un navegador; los tests montan sin él. Sin Provider vale `undefined` y KAV lo trata como 0 (no hace falta `?? 0`).
- P-E1 (producto): el mapa `flex-1` cede alto primero; aceptado.
- E1.2: refuerza un `it` existente, sin `it` nuevo; `mount()` envuelve en `HeaderHeightContext.Provider value={91}`.

### A.5 Explore previo: `progress/explore_mobile-geofence-editor-keyboard.md`

Opciones descartadas (grep `### Opción`):

- **Opción B `behavior="height"`**: mismo cálculo que A, mismo offset, no aporta nada. Descartable.
- **Opción C `automaticallyAdjustKeyboardInsets` en el ScrollView**: `@platform ios` (`node_modules/react-native/Libraries/Components/ScrollView/ScrollView.js`, grep `automaticallyAdjustKeyboardInsets`). No sirve para Android.
- **Opción D `Keyboard.addListener` + estado + paddingBottom a mano**: es lo que KAV hace por dentro en Android; no necesita offset de cabecera pero reimplementa KAV.
- **`react-native-keyboard-controller`**: no instalado (ni `package.json` ni `node_modules/`); rango SDK 57 `"1.21.9"` (`node_modules/expo/bundledNativeModules.json`); módulo nativo → regenerar dev build; requiere `KeyboardProvider` en raíz. Dependencia nueva: #148 la excluye explícitamente ("no entra sin decisión del humano").
- El explore ya tabuló (fila "KAV `behavior="padding"` por pantalla") el offset esperado: **0 en `(auth)`** (`headerShown: false`) **y en `reset-password`** (montada en `src/app/_layout.tsx` fuera del `Stack.Protected`, sin `headerOptions`); altura de cabecera en weight-log, add-pet, add-reminder y pairing.

### A.6 RV-5 (zona ciega de plataforma)

`progress/review_mobile-geofence-editor.md`, tabla de sondas (grep `RV-5`):

| RV-5 | `behavior={Platform.OS === "ios" ? "padding" : undefined}` | verde: zona ciega, jest-expo corre como iOS | 68/68, exit=0 | no cae |

Observación 1 del review (grep `Zona ciega por plataforma`): jest-expo corre con `Platform.OS === 'ios'`; KAV en iOS escucha `keyboardWillShow` (el evento que emite el test), en Android `keyboardDidShow`. Una mutación que deja `behavior` solo en iOS pasa en verde en la plataforma del fallo. Hoy producción no importa `Platform` (grep verificado en 9cf45204: `grep -rn "Platform" mobile-pet-tracker/src/screens/geofence-editor/index.tsx` vacío).

Sondas que lo cubrirían (hechos, no decisión):
- (a) Un candado negativo por fichero: `grep -c "Platform" <pantalla>.tsx` = 0 (ancla negativa; comparar valor medido con declarado).
- (b) `jest.doMock('react-native/Libraries/Utilities/Platform', ...)` o `Platform.OS = 'android'` en un `it` que emita `keyboardDidShow` en vez de `keyboardWillShow` y espere el mismo `paddingBottom`. Requiere verificar que KAV en RN 0.86 se suscribe según `Platform.OS` en construcción (`componentDidMount` → `Keyboard.addListener('keyboardDidShow'|'keyboardWillShow')`): no medido aquí (§Sin medir).
- (c) Aseverar el prop en el composite vía `UNSAFE_getByType(KeyboardAvoidingView)`: **no disponible**, RNTL 14 (ver §E) no tiene `UNSAFE_*`.

## B. Inventario de pantallas con campos de texto

Comando (9cf45204):

```
grep -rln "<TextInput\|<Input\b" mobile-pet-tracker/src --include=*.tsx | grep -v test | sort
```

Resultado: 9 ficheros.

| Fichero | En files_affected #148 | Tipo |
|---|---|---|
| `src/app/(auth)/forgot.tsx` | sí | route "gordo", 1 `<Input` |
| `src/app/(auth)/login.tsx` | sí | route "gordo", 2 `<Input` |
| `src/app/(auth)/register.tsx` | sí | route "gordo", 7 `<Input` |
| `src/screens/add-pet/index.tsx` | sí | screen, 4 `<TextInput` (react-native) |
| `src/screens/add-reminder/index.tsx` | sí | screen, 1 `<TextInput` (react-native) |
| `src/screens/geofence-editor/index.tsx` | **no (ya resuelto en #146 E1)** | screen, es el patrón de referencia; sobra de la lista con razón |
| `src/screens/pairing/index.tsx` | sí | screen, 1 `<TextInput` (react-native) |
| `src/screens/reset-password/index.tsx` | sí | screen, 2 `<Input` |
| `src/screens/weight-log/index.tsx` | sí | screen, 3 `<Input` |

- **Sobra**: nada. **Falta**: nada. La lista de 8 de #148 coincide con el grep menos geofence-editor.
- **meal-schedule** (`src/screens/meal-schedule/`): existe en 9cf45204 pero `grep -rln "TextField\|Input\b" mobile-pet-tracker/src/screens/meal-schedule` vacío → sin inputs en main. #147 está en vuelo (ver §F): si mergea con inputs, la spec debe volver a medir.
- **docs, alert-detail, components/** (`src/components/`, incluido pet-switcher): `grep -rln "TextField\|Input\b" mobile-pet-tracker/src/components` vacío. Sin inputs.
- `src/app/_layout.tsx`: `grep -n "TextInput\|Keyboard" mobile-pet-tracker/src/app/_layout.tsx` vacío. El grep global `grep -rn "TextInput\|Keyboard\b\|KeyboardAvoidingView\|react-native-keyboard" mobile-pet-tracker/src --include=*.tsx --include=*.ts | grep -v "test\."` solo lista add-pet, add-reminder y pairing (imports de `TextInput`) y geofence-editor. Ningún otro fichero toca el teclado.
- Componente de input: `(auth)/*`, weight-log y reset-password usan `<Input` (heroui-native, ver §C); add-pet, add-reminder y pairing usan `TextInput` de react-native.

## C. Tabla pantalla a pantalla

Hechos comunes (9cf45204, `mobile-pet-tracker/`):

- Cabeceras. `src/app/_layout.tsx`: `<Stack screenOptions={{ headerShown: false }}>`; `headerOptions = { headerShown: true, headerStyle: { backgroundColor: background }, headerTintColor: foreground, headerTitleStyle: { fontFamily: 'Inter-Bold' }, headerShadowVisible: false }` se aplica solo a las `Stack.Screen` dentro de `<Stack.Protected guard={status === 'authenticated'}>` (`add-reminder`, `pets/add`, `weight-log`, `pairing`, ...). `(auth)` y `reset-password` van fuera y sin options → sin cabecera. `src/app/(auth)/_layout.tsx`: `<Stack screenOptions={{ headerShown: false }} />` (candado `src/app/(auth)/__tests__/layout.test.tsx`, grep `headerShown: false`). `src/app/(tabs)/_layout.tsx`: `<Tabs screenOptions={{ headerShown: false, animation: 'fade' }}` (ninguna de las 8 vive ahí). Candado del stack raíz: `src/app/__tests__/layout.test.tsx` grep `[Stack.Screen, 'reset-password', undefined]` y `expect(props?.screenOptions).toEqual({ headerShown: false })`.
- Ninguna de las 8 usa `useHeaderHeight`, `HeaderHeightContext` ni importa `expo-router/react-navigation` (grep vacío en cada fichero, columna "hooks" abajo). Las 8 usan `useSafeAreaInsets()` de `react-native-safe-area-context` y meten `insets.bottom + N` en `contentContainerStyle.paddingBottom`.
- Las 8 tienen raíz `<ScrollView testID="screen-<x>" className="flex-1 bg-background" contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{...}}>`. Solo las 4 de login/register/forgot/reset-password llevan `keyboardShouldPersistTaps="handled"`; `grep -c keyboardShouldPersistTaps` = 0 en add-pet, add-reminder, pairing y weight-log.
- Ningún test de las 8 hace `toHaveStyle` sobre la raíz, ni `fireEvent(root, 'layout')`, ni usa `UNSAFE_*`, ni emite eventos de teclado (grep `toHaveStyle\|'layout'\|UNSAFE_\|DeviceEventEmitter\|HeaderHeightContext` vacío en los 8 ficheros de test). Todos asertan `screen.getByTestId('screen-<x>').props.contentContainerStyle` con `toEqual({...})` exacto (candado de métricas A11) y, los 4 de auth/reset, `props.keyboardShouldPersistTaps` y `props.contentInsetAdjustmentBehavior`. **Si la KAV pasa a ser la raíz con el testID, estos `props.*` dejan de existir en el nodo y los `toEqual` se rompen** (ver §D y §G).
- Insets en test: `jest.mock('react-native-safe-area-context', () => ({ ...jest.requireActual(...), useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }) }))` en 24 ficheros de test (`grep -rln "jest.mock('react-native-safe-area-context'" src --include=*.test.tsx | wc -l`), de ahí los `paddingBottom: 48` (= 24 + 24) y `120` (= 24 + 96) aseverados.
- "Filas antes del botón" = recuento grep de `<TextField|<TextInput|<Input|<Text|<Pressable|<PetAvatar|<DateTimePicker|<Card|<HeroUICard|<WeightChart|<Skeleton` entre el inicio del fichero y la línea del `testID` de la acción principal. Es una estimación de altura, no un recuento de nodos.

| # | Pantalla | Fichero / ruta / cabecera | Gordo o delgado | Raíz | Inputs y acción principal | Filas antes del botón → estimación | Hooks de layout | Tests | Teléfono |
|---|---|---|---|---|---|---|---|---|---|
| 1 | login | `src/app/(auth)/login.tsx` (135 líneas); ruta `/login`; `(auth)/_layout.tsx` → **sin cabecera** | **gordo** (default export `Login` con la lógica) | `ScrollView testID="screen-login" className="flex-1 bg-background" keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic"`; `contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}` | 2 `<Input` heroui-native dentro de `<TextField>` (`login-email`, `login-password`); `<Button testID="login-submit"` **dentro** del ScrollView bajo el último input, seguido de `link-register` y `link-forgot` | 6 → **corta** (título + 2 campos + error) | `useSafeAreaInsets` sí; header: no | `src/app/(auth)/__tests__/login.test.tsx` (6 `it`); `render(<Login />, { wrapper: AuthScreenWrapper })` con `AuthScreenWrapper` local (`HeroUINativeProvider` + `LanguageProvider initial="es"`); `screen.getByTestId('screen-login')` → `props.contentContainerStyle` toEqual (`paddingBottom: 48`), `props.keyboardShouldPersistTaps`, `props.contentInsetAdjustmentBehavior`; `login-submit.props.className` | **confirmado** (falla) |
| 2 | register | `src/app/(auth)/register.tsx` (290); ruta `/register`; **sin cabecera** | **gordo** | igual que login pero `contentContainerStyle={{ padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96 }}` (sin `flexGrow`/`justifyContent`) | 7 `<Input` en `<TextField isInvalid={...}>` (`register-first-name`, `-last-name`, `-email`, `-phone`, `-password`, `-password-confirmation`, country); `register-terms` y `<Button testID="register-submit"` **dentro**, al final | 17 → **larga** | `useSafeAreaInsets` sí; header: no | `register.test.tsx` (9 `it`); `AuthScreenWrapper`; `getByTestId('screen-register').props.contentContainerStyle` (`paddingBottom: 120`), `.props.contentInsetAdjustmentBehavior`; `register-submit.props.className` | sin confirmar |
| 3 | forgot | `src/app/(auth)/forgot.tsx` (75); ruta `/forgot`; **sin cabecera** | **gordo** | igual que login más `alignItems: 'center'` en `contentContainerStyle` | 1 `<Input` (`forgot-email`) dentro de `<TextField className="w-full" isDisabled>` → **el campo está deshabilitado** (`forgot.comingSoon`): el teclado no llega a abrirse en esta pantalla; `<Button testID="forgot-submit"` dentro | 4 → **corta** (icono Lock + título + texto + campo) | `useSafeAreaInsets` sí; header: no | `forgot.test.tsx` (4 `it`); `AuthScreenWrapper`; `getByTestId('screen-forgot')` → `contentContainerStyle` (`paddingBottom: 48`), `keyboardShouldPersistTaps`, `contentInsetAdjustmentBehavior` | sin confirmar |
| 4 | add-pet | `src/screens/add-pet/index.tsx` (448); ruta `/pets/add` vía `src/app/pets/add.tsx` (`export default AddPetScreen`, 2 líneas; candado design-drift `keeps the four Expo Router entrypoints thin` < 10 líneas); `Stack.Protected` con `{...headerOptions, title: t('addPet.addPet')}` → **con cabecera** | **delgado** | `ScrollView testID="screen-add-pet" className="flex-1 bg-background" contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}`; **sin** `keyboardShouldPersistTaps` | 4 `<TextInput` de react-native (`name-input`, `breed-input`, `microchip-input` y uno en la fila de fecha junto a `birth-date-picker`), entre chips `sex-*`, `size-*`, `sterilized-*` y `pet-avatar`; acción = último `<Button` antes de `</ScrollView>` (`Button.Label className="font-bold text-accent-foreground"`), **sin testID** (el inventario `grep -o 'testID="[^"]*"'` no lista ningún `*-submit`) | 10 antes de `name-input`; muchas más antes del botón (chips + fecha) → **larga** | `useSafeAreaInsets` sí; header: no | `src/screens/add-pet/index.test.tsx` (14 `it`); `render(` con wrapper inline `HeroUINativeProvider`+`LanguageProvider initial="es"`; `getByTestId('screen-add-pet')` → `toBeVisible()` y `.props.contentContainerStyle` toEqual `{ padding: 24, gap: 16, paddingBottom: 48 }` | sin confirmar |
| 5 | add-reminder | `src/screens/add-reminder/index.tsx` (319); ruta `/add-reminder` vía `src/app/add-reminder.tsx` (delgado, `return <AddReminderScreen />`); `Stack.Protected` `title: t('addReminder.addReminder')` → **con cabecera** | **delgado** (`AddReminderScreen` → `<AddReminderContent petId={selectedPetId} />`) | `ScrollView testID="screen-add-reminder"` con las mismas props que add-pet; **sin** `keyboardShouldPersistTaps` | 1 `<TextInput` (`title-input`) + `date-field`/`time-field` (Pressables con `date-picker`/`time-picker`) + chips de antelación; `<Button testID="add-reminder-submit"` **dentro**, al final | 14 → **media/larga** | `useSafeAreaInsets` sí; header: no | `index.test.tsx` (22 `it`); wrapper inline; `getByTestId('screen-add-reminder')` → `toBeVisible()` (dentro de `waitFor`) y `contentContainerStyle` (`paddingBottom: 48`) | sin confirmar |
| 6 | pairing | `src/screens/pairing/index.tsx` (491); ruta `/pairing` vía `src/app/pairing.tsx` (delgado); `Stack.Protected` `{...headerOptions, title: ''}` → **con cabecera** (título vacío) | **delgado** | `ScrollView testID="screen-pairing"`, mismas props que add-pet; **sin** `keyboardShouldPersistTaps`; candado design-drift `#95 R6`: `not.toContain('insets.top + 12')` y `not.toContain('insets.bottom + 96')` | 1 `<TextInput` (código de activación, bajo `t('pairing.activationCode')`, sin testID en el inventario) **solo en la rama plan-free** de la máquina de estados (`pairing-skeleton` / `plan-*` / `pairing-ready`); `<Button testID="pairing-submit"` justo debajo, **dentro** del ScrollView; otras ramas tienen `pairing-retry`, botones de `ready-*` | 18 (incluye ramas no visibles a la vez) → **media**: en la rama con input hay `Card` de plan + label + input + botón | `useSafeAreaInsets` sí; header: no | `index.test.tsx` (31 `it`); `renderWithProviders(<PairingRoute />, { wrapper: PairingWrapper })` (`test/render-with-providers.tsx` = `QueryClientProvider`; `PairingWrapper` = `HeroUINativeProvider`+`LanguageProvider`); `getByTestId('screen-pairing')` → `toBeVisible()` y `contentContainerStyle` (`paddingBottom: 48`) | sin confirmar |
| 7 | reset-password | `src/screens/reset-password/index.tsx` (202); ruta `/reset-password` vía `src/app/reset-password.tsx` (delgado); `<Stack.Screen name="reset-password" />` **fuera** de `Stack.Protected`, sin options → hereda `headerShown: false` → **sin cabecera** | **delgado** | **tres** `<ScrollView testID="screen-reset-password"` (ramas `reset-missing-token`, `reset-success`, formulario), todas `className="flex-1 bg-background" keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic"` y `contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}` | 2 `<Input` en `<TextField>` (`reset-password`, `reset-password-confirm`); `<Button testID="reset-submit"` **dentro** | 8 → **corta** | `useSafeAreaInsets` sí (tres veces); header: no | `index.test.tsx` (10 `it`); `render(<LanguageProvider initial="es">…, { wrapper: HeroUINativeProvider })`; `getByTestId('screen-reset-password')` → `contentContainerStyle` toEqual `metrics` (`paddingBottom: 48`), `contentInsetAdjustmentBehavior`, `keyboardShouldPersistTaps`, en **dos** `it` (dos ramas); `reset-submit.props.className` | sin confirmar |
| 8 | weight-log | `src/screens/weight-log/index.tsx` (311); ruta `/weight-log` vía `src/app/weight-log.tsx` (delgado); `Stack.Protected` `title: t('weightLog.weightLog')` → **con cabecera** | **delgado** (`WeightLogScreen` → `Redirect /health` sin mascota, si no `<WeightLogContent petId=...>`) | `ScrollView testID="screen-weight-log"`, mismas props que add-pet; **sin** `keyboardShouldPersistTaps` | 3 `<Input` heroui-native en `<TextField>` (`weight-input`, `weight-date-input`, `weight-bc-input`) dentro de `<Card className="gap-4">`, precedidos por `<Card testID="weight-chart-card">` con `WeightChart`; `<Button testID="weight-submit"` **dentro del Card, en mitad del scroll**: debajo sigue la lista de historial (`HeroUICard` por entrada, hasta `</ScrollView>`) | 10 → **larga** (gráfica + formulario + historial) | `useSafeAreaInsets` sí; header: no | `index.test.tsx` (19 `it`); `renderWithProviders(` + wrapper inline; `jest.mock` safe-area (`bottom: 24`); `getByTestId('screen-weight-log')` → `toBeVisible()` y `contentContainerStyle` toEqual `{ padding: 24, gap: 16, paddingBottom: 48 }` en dos `it` | **confirmado** (falla) |

Notas:
- Offset de cabecera esperado: `undefined`/0 en 1, 2, 3 y 7 (sin Provider de `HeaderHeightContext` en la app: no hay cabecera nativa); altura real de cabecera en 4, 5, 6 y 8 (provista por el stack nativo de expo-router, ver §A.4). La altura numérica en el teléfono no está medida (§Sin medir).
- `docs/conventions.md` §`Estructura Expo oficial` (grep `Estructura Expo oficial`): "Las pantallas anteriores a #39 NO se migran en frío: se mueven a este patrón solo cuando una feature las toque de fondo". Las 3 de `(auth)` son gordas; el hecho queda aquí, la decisión de si #148 "las toca de fondo" no.
- `src/app/(tabs)/__tests__/screens.test.tsx` no nombra ninguna de las 8 (solo `screen-profile` entre las de testID; grep `login\|weight-log\|pairing\|add-pet` vacío).

## D. Candados globales afectados

Pregunta medida: ¿qué candado de `mobile-pet-tracker/src/__tests__/` o de `src/app/**/__tests__/` se mueve si (a) la raíz de una de las 8 pasa a `<KeyboardAvoidingView className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>` y (b) se añaden los imports `KeyboardAvoidingView` (react-native), `HeaderHeightContext` (`expo-router/react-navigation`) y `useContext`.

| Fichero | Candado (grep) | Qué cuenta | Valor hoy que toca a las 8 | ¿Lo mueve (a)+(b)? |
|---|---|---|---|---|
| `src/__tests__/design-drift.test.ts` (664 líneas, 35 `it`) | `C8: la UI no usa clases arbitrarias` | `ARBITRARY_CLASS = [A-Za-z0-9_-]+-\[[^\]]+\]` sobre todo `src/` | 0 | no (`flex-1` no es arbitraria) |
| ídem | `it.each([... 'weight-log' ...])('%s importa el Card compartido')` | `readFileSync` de weight-log contiene el import de Card | pasa | no |
| ídem | `R9: mobile-pets-profile sin drift` → `featureFiles` incluye `screens/add-pet/index.tsx`; `FEATURE_STYLE_ESCAPES = text-\[10px\]|HEX_LITERAL|StyleSheet` | regex sobre add-pet | 0 escapes | no (no hay `StyleSheet` ni hex) |
| ídem | `keeps the four Expo Router entrypoints thin` | `app/pets/add.tsx` (y home, profile, docs) `< 10` líneas | add.tsx = 2 líneas | no, **salvo que la KAV se ponga en el route file** |
| ídem | `R11 (mobile-device-pairing)`: `toContain("from '../../components/card'")`, `toContain("from '../../components/pet-switcher'")`, métricas; `#95 R6`: `not.toContain('insets.top + 12')`, `not.toContain('insets.bottom + 96')`; `PAIRING_STYLE_ESCAPES` | strings y regex sobre `screens/pairing/index.tsx` | pasa | no, mientras no se añada `insets.top + 12` a pairing |
| ídem | `#87 R19 ... screenSignOutCalls` | nº de `signOut(` por fichero: `'screens/weight-log/index.tsx': 1`, `'screens/pairing/index.tsx': 2` (add-pet, add-reminder y `(auth)` no están en el mapa) | 1 / 2 | no |
| ídem | inventario de imports permitidos | **no existe**: `grep -n "allowed\|ALLOWED\|imports" design-drift.test.ts` solo devuelve los `toContain` de pairing | — | no hay candado que prohíba importar de `expo-router/react-navigation` (geofence-editor ya lo hace) |
| `src/__tests__/consistency-classnames.test.ts` (534, 23 `it`) | `#62 R1 primaryButtons` (`openingTagWithTestId` de `login-submit`, `forgot-submit`, `register-submit`, `reset-submit`) y `rounded-xl bg-accent` global `toHaveLength(13 + 1 + 1)` | tag de apertura del botón y recuento global | 15 | no (no se tocan botones) |
| ídem | `#62 R12: los TextInput crudos comparten una sola receta` | `<TextInput\b[\s\S]*?\/>` global `toHaveLength(6)`; 5 con `placeholder=` y `placeholderTextColor={muted}`; 0 con `border border-border` | 6 = add-pet 4 + add-reminder 1 + pairing 1 | no, **salvo que la spec añada o quite un `<TextInput`** |
| ídem | `#62 R14 directUses` | esquina continua por fichero: forgot 1, weight-log 1, add-pet 5, add-reminder 3, pairing 2 | ídem | no |
| ídem | `#62 R15` tabular | weight-log 2, geofence-editor 1 | ídem | no |
| ídem | `lleva los tres tiles restantes a rounded-xl` | `toContain` de `size-16 items-center justify-center rounded-xl bg-accent-soft` (forgot) y `size-8 shrink-0 ... ${tileClassName}` (weight-log) | pasa | no |
| ídem | recuentos de `flex-1`, `bg-background`, `ScrollView`, `KeyboardAvoidingView` | **no existen** (grep vacío en el fichero) | — | no |
| `src/__tests__/legibility-classnames.test.ts` | `#61 R4 inkSites` | sitios de tinta accent-strong: login 2, forgot 1, reset-password 2, add-pet 1 | ídem | no (KAV no lleva texto) |
| `src/__tests__/ui-copy-table.ts` + `ui-language.test.ts` | `R1_AUTH` (login/forgot/register, "29 ocurrencias"), `#65 R9` add-pet (41), `#65 R10` pairing, `#65 R11` reset-password (15), weight-log dentro de las tablas de Health | filas `{ file, key }` por fichero y recuento de `t('...')` | fijos | no, mientras no haya copy nuevo (una KAV no añade `t()`) |
| `src/__tests__/hosting-artifacts.test.ts` | `reset-password/index.html` + `mobilepettracker://reset-password` | artefacto web del deep link | — | no |
| `src/app/__tests__/layout.test.tsx` | `expect(props?.screenOptions).toEqual({ headerShown: false })`, `children toHaveLength(5)`, lista `[Stack.Screen, 'reset-password', undefined]`, `[Stack.Screen, 'add-reminder']`, `'pets/add'`, `'weight-log'`... | forma exacta del `Stack` raíz | fija | no, mientras #148 no toque `src/app/_layout.tsx` (no está en files_affected) |
| `src/app/(auth)/__tests__/layout.test.tsx` | `screenOptions` toEqual `{ headerShown: false }` | layout de `(auth)` | fija | no |
| `src/app/(tabs)/__tests__/screens.test.tsx` | solo pantallas de tabs (`screen-profile`...) | — | — | no nombra ninguna de las 8 |

Tipo del nodo raíz / `props.className` de la raíz: **ningún test de las 8 lo asevera** (grep `props.className` en los 8 tests solo da botones, chips, `weight-log-loading` y `card`; grep `.type).toBe` vacío). Lo que **sí** se mueve está en los tests por pantalla (§C): los `getByTestId('screen-<x>').props.contentContainerStyle / keyboardShouldPersistTaps / contentInsetAdjustmentBehavior` dejan de encontrarse si el testID migra a la KAV (como en #146, donde el ScrollView pasó a `geofence-editor-form` y el test lee `form.props.contentContainerStyle`). Recuento de `it` que leen `props.*` de la raíz: login 3 aserciones, register 2, forgot 3, add-pet 1, add-reminder 1, pairing 1, reset-password 2 `it` × 3, weight-log 2 `it` × 1.

## E. Entorno Android y versiones

`mobile-pet-tracker/app.json` (grep `edgeToEdge\|softwareKeyboard\|"android"`):

- Bloque `"android"`: `package: com.trackermex.pettracker`, `permissions: ["POST_NOTIFICATIONS"]`, `adaptiveIcon`, `predictiveBackGestureEnabled: false`. **No** declara `edgeToEdgeEnabled` ni `softwareKeyboardLayoutMode` (grep vacío) → valores por defecto de SDK 57. El diagnóstico de por qué `adjustResize` no encoge la ventana (edge-to-edge forzado por RN 0.86 con targetSdk ≥ 35) está en `progress/explore_mobile-geofence-editor-keyboard.md` §1 puntos 1-8 y no se ha vuelto a medir aquí.
- `plugins`: `expo-router`, `expo-splash-screen`, `expo-secure-store`, ... (no hay `expo-build-properties`; grep vacío).
- No hay `android/` ni `ios/` commiteados ni en disco (`ls -d mobile-pet-tracker/android mobile-pet-tracker/ios` falla): proyecto CNG, el dev build se genera en prebuild.

`mobile-pet-tracker/package.json`:

| Paquete | Versión |
|---|---|
| expo | `~57.0.14` |
| expo-router | `~57.0.14` |
| react | `19.2.3` |
| react-native | `0.86.2` |
| react-native-reanimated | `4.5.1` |
| react-native-safe-area-context | `~5.7.0` |
| heroui-native | `1.0.8` |
| uniwind | `^1.11.0` |
| @testing-library/react-native | `^14.0.1` (sin `UNSAFE_*`) |
| jest-expo | `^57.0.4`; `"preset": "jest-expo"` (no `jest-expo/android`); `setupFilesAfterEnv: ["<rootDir>/test/jest-setup.js"]` |
| react-native-keyboard-controller | **no instalado** |

`src/app/_layout.tsx`: `grep -n "TextInput\|Keyboard" src/app/_layout.tsx` vacío. No toca el teclado; sus únicas señales relevantes son `headerOptions` y el `Stack` raíz (§C).

KAV en el RN instalado (`node_modules/react-native/Libraries/Components/Keyboard/KeyboardAvoidingView.js`, grep `keyboardWillShow\|keyboardDidShow\|_relativeKeyboardHeight`):

- `componentDidMount`: `if (Platform.OS === 'ios')` → `Keyboard.addListener('keyboardWillShow', this._onKeyboardChange)`; `else` → `Keyboard.addListener('keyboardDidShow', ...)`. La plataforma se lee **al montar**.
- `_relativeKeyboardHeight`: `if (!frame || !keyboardFrame) return 0` (de ahí el `fireEvent 'layout'` obligatorio); `keyboardY = keyboardFrame.screenY - (this.props.keyboardVerticalOffset ?? 0)`; `behavior="padding"` → `max(frame.y + frame.height - keyboardY, 0)`. Confirma la aritmética de §A.3 y que `undefined` vale 0.

## F. Solape con #105 en vuelo

- `git show origin/main:feature_list.json` → #105 `meals-history`, `status: pending`, `files_affected: ["backend-pet-tracker/src/modules/nutrition/", "mobile-pet-tracker/src/screens/"]` (genérico). #147 `mobile-meal-schedule-editing` está **done** en main: su `files_affected` tocó `screens/meal-schedule/*`, `ui-copy-table.ts`, `ui-language.test.ts`, `consistency-classnames.test.ts`, `design-drift.test.ts`, y meal-schedule sigue sin inputs en 9cf45204 (§B).
- Rama `origin/feature/105-meals-history` (15 commits sobre main; `feature_list.json` ahí marca #105 `in_progress`): `git log --oneline origin/main..origin/feature/105-meals-history -- mobile-pet-tracker` **vacío** → la rama aún no toca móvil. `specs/meals-history/design.md` §`## Archivos afectados` → "Móvil" declara: `src/i18n/catalog.ts`, `src/__tests__/ui-copy-table.ts` (R6_FOOD +11), `src/api/types.ts`, `src/api/nutrition.ts`, `src/api/query-keys.ts`, `src/utils/month-grid.ts` (nuevo), `src/app/meals-history.tsx` (nuevo), **`src/app/_layout.tsx`** (`Stack.Screen name="meals-history"` último en `Stack.Protected`), `src/app/(tabs)/food.tsx`, `src/screens/meals-history/*` (nuevo), **`src/app/__tests__/layout.test.tsx`** (4 candados +1), `detail-stack*.test.tsx`, `api/__tests__/*`, `food.test.tsx`, `language-provider.test.tsx`, **`src/__tests__/ui-language.test.ts`** (+11), **`src/__tests__/consistency-classnames.test.ts`** (fila en `counters` + total +2; `bg-accent-soft` +1), **`src/__tests__/design-drift.test.ts`** (`'meals-history'` en R3; fila en `screenSignOutCalls`; `#105 R15`).
- Ficheros comunes con los 8 de #148: **ninguno**. Comunes con los candados de §D: `design-drift.test.ts`, `consistency-classnames.test.ts`, `ui-language.test.ts`, `src/app/__tests__/layout.test.tsx` y `src/app/_layout.tsx` — todos los toca #105 por diseño; #148 **no necesita tocarlos** según §D salvo que la spec decida mover recuentos (p. ej. añadir un `<TextInput`, un `t()` nuevo o tocar `_layout.tsx`). Si #148 añade filas o describes a esos tres candados globales, habrá conflicto de merge textual con #105 (misma zona de fichero).
- `specs/meals-history/design.md` **no existe en 9cf45204** (`ls specs/ | grep meal` solo lista `meal-schedule-editing`, `meals-served-tracking`, `mobile-meal-*`); lo citado arriba viene de la rama de #105.

## G. Riesgos y preguntas abiertas para spec_author

Hechos con su evidencia; la decisión es del spec_author. `[V]` verificado en 9cf45204, `[I]` inferencia.

1. **Offset sin cabecera.** `[V]` login, register, forgot y reset-password no tienen `HeaderHeightContext.Provider` por encima en la app (ningún `Stack` con `headerShown: true` las envuelve, §C). `useContext(HeaderHeightContext)` devuelve `undefined` y KAV hace `keyboardVerticalOffset ?? 0` (§E). Con el mismo evento del test de #146 (layout 700, screenY 500) el host daría `paddingBottom: 200`, no 291. Pregunta: ¿el test de esas 4 monta sin Provider (y asevera 200) o con `Provider value={0}`? Las dos cosas pasan; una sonda `keyboardVerticalOffset={91}` literal (RV-7) sería **roja** en ellas solo si el test monta sin Provider o con 0.
2. **Cuatro pantallas con cabecera.** `[V]` add-pet, add-reminder, pairing (título vacío pero `headerShown: true`) y weight-log reciben la altura real de cabecera del stack nativo (§A.4). Sus tests hoy no proveen el contexto (`renderWithProviders` solo da `QueryClientProvider`; los wrappers locales dan HeroUI + Language): habrá que añadir `HeaderHeightContext.Provider value={91}` como en #146, en wrappers distintos por fichero (§C columna Tests).
3. **Dónde va el testID.** `[V]` #146 puso `testID="screen-geofence-editor"` en la KAV y renombró el ScrollView a `geofence-editor-form`. En las 8, `getByTestId('screen-<x>')` se usa para `props.contentContainerStyle`, `props.keyboardShouldPersistTaps` y `props.contentInsetAdjustmentBehavior` (§C). Si el testID migra a la KAV, esas aserciones (14 `it` en total) deben reapuntar a un testID nuevo del ScrollView; si el testID se queda en el ScrollView, la KAV queda sin testID y la sonda `toHaveStyle({ paddingBottom })` necesita otro identificador. El acceptance de #148 dice "asevera el paddingBottom del host": host = nodo KAV.
4. **forgot no abre teclado.** `[V]` su único `<Input` está en `<TextField className="w-full" isDisabled>` (copy `forgot.comingSoon`). Un KAV ahí es inerte en el teléfono; el test sintético pasaría igual. El acceptance habla de "cada pantalla que la spec declare afectada": forgot puede quedar fuera con este hecho como razón.
5. **Pantallas cortas con `flexGrow: 1, justifyContent: 'center'`.** `[V]` login, forgot y reset-password centran el contenido en todo el alto. `[I]` Al añadir padding inferior de KAV el área útil encoge y el contenido centrado sube; si el contenido es más alto que el área, el ScrollView desplaza. Login está confirmado roto en el teléfono pese a ser corta: la altura "corta" no exime (hecho relatado en la descripción de #148).
6. **weight-log: acción en mitad del scroll.** `[V]` `weight-submit` está dentro del `Card` del formulario y debajo sigue el historial hasta `</ScrollView>`. Con KAV el ScrollView encoge y el usuario puede desplazar hasta el botón. `[I]` No hay auto-scroll al input enfocado (eso lo daría keyboard-controller, excluido); el humano tendrá que desplazar a mano en el smoke.
7. **`keyboardShouldPersistTaps` ausente en 4.** `[V]` add-pet, add-reminder, pairing y weight-log no lo declaran (default RN `never`): con el teclado abierto, el primer toque sobre el botón cierra el teclado en vez de pulsar. geofence-editor sí lo lleva (`handled`, §A.2). Si la spec lo añade, mueve una aserción `toEqual` de `contentContainerStyle`? No: es prop del ScrollView, no del `contentContainerStyle`; pero el test deberá aseverarlo si lo exige (candado nuevo, no existente).
8. **Zona ciega iOS (RV-5).** `[V]` jest preset `jest-expo` sin `/android`; KAV elige el listener por `Platform.OS` **al montar** (§E). Opciones de sonda listadas en §A.6; ninguna verificada en ejecución (§Sin medir). El acceptance exige que "la spec declare la sonda que cubre un behavior solo de iOS".
9. **reset-password: tres raíces con el mismo testID.** `[V]` ramas `reset-missing-token`, `reset-success` y formulario, cada una con su `ScrollView testID="screen-reset-password"`. Solo la rama formulario tiene inputs. El test asevera métricas en dos ramas. Pregunta: ¿KAV solo en la rama con inputs?
10. **add-pet: la acción principal no tiene testID.** `[V]` el último `<Button` antes de `</ScrollView>` no aparece en `grep -o 'testID="[^"]*"'`. La sonda de paddingBottom no lo necesita; la casilla del gate humano ("Guardar alcanzable") sí debe nombrarlo por su label.
11. **Candado R12 de TextInput = 6.** `[V]` `consistency-classnames.test.ts` fija `textInputs toHaveLength(6)`: la spec no puede añadir ni quitar `<TextInput` sin mover el recuento (§D).
12. **Route files delgados.** `[V]` `app/pets/add.tsx` < 10 líneas (candado). La KAV tiene que ir en `src/screens/add-pet/index.tsx`, no en el route. Las 3 de `(auth)` son gordas (§C): convención "no se migran en frío" (`docs/conventions.md` grep `Estructura Expo oficial`); si #148 las envuelve en KAV in situ, no cambia su estructura.
13. **`className` en KAV.** `[V]` #146 asevera `root.props.className === 'flex-1'` sobre la KAV: uniwind acepta `className` en KAV. La KAV de #146 no lleva `bg-background` (lo conserva el ScrollView). Ningún candado cuenta `bg-background` (§D).
14. **Insets inferiores con teclado.** `[I]` Las 8 suman `insets.bottom + 24` en `contentContainerStyle.paddingBottom`; con el teclado abierto el KAV añade su padding en coordenadas de ventana (incluye la barra de navegación). Posible doble inset de `insets.bottom` bajo el teclado; no medido, no afecta a la alcanzabilidad del botón (solo sobra espacio).
15. **Solape con #105.** `[V]` ningún fichero de pantalla común; conflicto textual posible solo si #148 toca `design-drift`, `consistency-classnames`, `ui-language`, `app/__tests__/layout.test.tsx` o `src/app/_layout.tsx` (§F).
16. **Smoke por pantalla.** `[V]` el acceptance pide "una casilla por pantalla"; pairing exige la rama plan-free (collar sin emparejar) y weight-log/add-reminder una mascota seleccionada (`Redirect /health` sin ella). Esas precondiciones de entorno son del tipo que paró #79/#114/#99 (memoria "Supuestos de entorno en specs móviles").

## Sin medir

- Altura real de la cabecera nativa en el teléfono (Android, dev build): no hay cifra en el repo; el test usa 91 por convención de #146.
- Si `Platform.OS` puede fijarse a `'android'` dentro de un `it` de jest-expo antes de montar la KAV (para una sonda RV-5 que emita `keyboardDidShow`): no ejecutado.
- No se corrió jest (0 corridas): la línea base verde de los 8 ficheros de test se asume por `origin/main` (CI) y no se ha reproducido aquí.
- Doble inset de `insets.bottom` + padding KAV (G.14): hipótesis sin medir en dispositivo.
- Pertenencia exacta de weight-log a la tabla `#65 R5 Health` de `ui-copy-table.ts`: no comprobado fila a fila; irrelevante si no hay copy nuevo.

## H. Verificado y medido por el leader (2026-10-04, base 9cf45204)

Correcciones a §C/§G:

- **G.10 es falso.** El botón de guardar de add-pet **sí** tiene testID: `grep -n 'testID="add-pet-submit"' mobile-pet-tracker/src/screens/add-pet/index.tsx` → 1 hit (el `<Button` justo antes de `</ScrollView>`), y `index.test.tsx` lo pulsa en tres `it` (`fireEvent.press(screen.getByTestId('add-pet-submit'))`). La casilla del smoke puede nombrarlo.
- Confirmados contra el árbol: forgot `<TextField className="w-full" isDisabled>` (G.4); tres `testID="screen-reset-password"` (G.9); `keyboardShouldPersistTaps` presente en login/register (1) y reset-password (3), ausente en add-pet/add-reminder/pairing/weight-log (G.7); `grep -c Platform` = 0 en los 8 ficheros; `consistency-classnames.test.ts` `expect(textInputs).toHaveLength(6)` (G.11); `(auth)/_layout.tsx` = `<Stack screenOptions={{ headerShown: false }} />`; `src/app/_layout.tsx` monta `<Stack.Screen name="reset-password" />` fuera de `Stack.Protected`.
- KAV en RN 0.86 (`KeyboardAvoidingView.js`): `componentDidMount` elige `keyboardWillShow` si `Platform.OS === 'ios'` y `keyboardDidShow` en otro caso, **leído al montar**; `keyboardY = screenY - (keyboardVerticalOffset ?? 0)`. jest-expo **no** mockea `react-native/Libraries/Utilities/Platform` (grep vacío en `node_modules/jest-expo/src/preset/setup.js`); `Platform.ios.js` es un objeto plano con `OS: 'ios'` (asignable).

Sonda RV-5 medida (spike fuera del árbol, en el scratchpad de la sesión, ejecutado con `bunx jest --roots <scratch> --modulePaths node_modules`; 0 ficheros del repo tocados):

| Caso | Resultado |
|---|---|
| iOS por defecto, `behavior="padding"`, `fireEvent layout {y:0,height:700}` + `keyboardWillShow` screenY 500, sin Provider | `paddingBottom: 200` |
| `(Platform as { OS: string }).OS = 'android'` antes de `render`, mismo layout + `keyboardDidShow` | `paddingBottom: 200` (la KAV sí se suscribe al evento Android) |
| `Platform.OS = 'android'` + `keyboardWillShow` | se queda en `paddingBottom: 0`: un test que solo emita el evento iOS es ciego bajo el volteo |
| `Platform.OS = 'android'` + mutación `behavior={Platform.OS === 'ios' ? 'padding' : undefined}` | el host **no tiene** clave `paddingBottom` (ni 0): `toHaveStyle({ paddingBottom: 0 })` y `toHaveStyle({ paddingBottom: 200 })` fallan los dos → la sonda es roja |

El volteo se restaura en `afterEach` (`Platform.OS = originalOS`). El `Input` de heroui-native dentro de `HeroUINativeProvider` monta sin error bajo el volteo.

Suites reales bajo el volteo (copia del test con rutas absolutas, `beforeEach` de fichero entero con `Platform.OS = 'android'`):

- `screens/pairing/index.test.tsx`: 31/31 verdes.
- `screens/add-pet/index.test.tsx`: 23/24; rojo solo `#90 R6: birthDate manda el día civil local del picker` (fecha +1 día), un `it` de fechas ajeno al teclado que cambia de comportamiento con `Platform.OS` de fichero entero. Conclusión: **el volteo debe acotarse al `it` nuevo** (asignar antes de `render`, restaurar en `finally`/`afterEach`), nunca en un `beforeEach` de fichero.

RNTL 14 en este repo: `render()` devuelve una promesa (`await render(...)` para usar `view.getByTestId`); los tests del árbol usan `screen.*` tras el render como en #146.
