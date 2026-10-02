# explore: mobile-geofence-editor (teclado)
Fecha: 2026-10-02T22:24Z
Branch: feature/146-mobile-geofence-editor (worktree Pet-Tracker-wt-146, HEAD 9dbe3de5; origin/main cb14497c)
Alcance: solo lectura. Contexto: paso 9 de la prueba de humo de
`specs/mobile-geofence-editor/requirements.md:1414` (Guardar inalcanzable con el teclado abierto).
Skills cargadas: `expo:expo-overview`, `expo:expo-native-ui`. `expo:expo-ui` no se cargó entera:
un grep de "keyboard" en su SKILL.md y sus referencias no da nada, porque no trata el teclado.
Leyenda: **[V]** = verificado (árbol o documentación, con fuente). **[I]** = inferido (no comprobado en dispositivo).

---

## 1. Causa probable del fallo en toda la app

**Conclusión:** el manifest pide `adjustResize`, pero con edge-to-edge Android **no redimensiona** la
vista raíz cuando sale el teclado. RN solo recibe el inset del IME y emite `keyboardDidShow`. Cada
ScrollView mantiene su altura completa y su parte de abajo queda tapada por el teclado, así que no
hay nada que desplazar para llegar a Guardar. Ninguna pantalla consume ese inset, de ahí que fallen
todas.

Cadena de hechos:

1. **[V]** `app.json` no declara `android.softwareKeyboardLayoutMode` ni `edgeToEdgeEnabled`
   (`mobile-pet-tracker/app.json:13-25`). `app.config.ts` solo toca `android.config.googleMaps`
   (`app.config.ts:47-55`).
2. **[V]** En SDK 57, `softwareKeyboardLayoutMode` vale `resize` por defecto: "This maps to the
   `android:windowSoftInputMode` property. Defaults to `resize`. Valid values: `resize`, `pan`".
   Fuente: https://docs.expo.dev/versions/v57.0.0/config/app/ §android.softwareKeyboardLayoutMode.
   El config plugin hace lo mismo: `node_modules/@expo/config-plugins/build/android/WindowSoftInputMode.js:41-42`
   ("Default to `adjustResize`"). El manifest generado lleva, por tanto, `adjustResize`.
3. **[V]** En SDK 57 el edge-to-edge ya no se puede configurar: la página v57 de app config no tiene
   la clave `edgeToEdgeEnabled` (grep vacío), y prebuild avisa de que "`edgeToEdgeEnabled`
   customization is no longer available - Android 16 makes edge-to-edge mandatory"
   (`node_modules/@expo/prebuild-config/build/plugins/unversioned/edge-to-edge/withEdgeToEdge.js:26-27`).
4. **[V]** RN 0.86 activa el edge-to-edge en `ReactActivityDelegate.onCreate` → `updateEdgeToEdgeFeatureFlag`
   (`node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/ReactActivityDelegate.java:141`).
   Lo activa si targetSdk ≥ 35 y el dispositivo es Android 16+, o Android 15 sin opt-out
   (`.../views/view/WindowUtil.kt:45-68`). También lo activa si la propiedad gradle `edgeToEdgeEnabled=true`
   está puesta (`@react-native/gradle-plugin/.../ProjectUtils.kt:62-67` y `GenerateEntryPointTask.kt:100-102`).
   En cualquiera de los dos casos llama a `WindowCompat.setDecorFitsSystemWindows(this, false)`
   (`WindowUtil.kt:164-165`).
5. **[V]** Referencia de Android, `Window.setDecorFitsSystemWindows`: "If set to true, the framework
   will inspect ... the `WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE` flag and fits content
   according to these flags. If set to false, the framework will not fit the content view to the
   insets and will just pass through the WindowInsets to the content view. If the app targets
   VANILLA_ICE_CREAM [API 35] or above, the behavior will be like setting this to false, and cannot
   be changed." Fuente: https://developer.android.com/reference/android/view/Window#setDecorFitsSystemWindows(boolean)
6. **[V]** targetSdk: el catálogo de RN fija `targetSdk = "36"` (`node_modules/react-native/gradle/libs.versions.toml:4`)
   y el plugin de Expo lo lee del catálogo con 35 como valor de reserva
   (`node_modules/expo-modules-autolinking/.../ExpoRootProjectPlugin.kt:55`). **[I]** El dev build
   apunta a API 36. No se ha podido mirar el build real: `android/` no está versionado (CNG).
7. **[V]** Con el teclado abierto, RN solo emite eventos. `ReactRootView.checkForKeyboardEvents` lee
   `WindowInsetsCompat.Type.ime()` y emite `keyboardDidShow` con `height = ime.bottom - systemBars.bottom`
   y `screenY = getWindowVisibleDisplayFrame().bottom` (`node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/ReactRootView.java:950-985`).
   Ningún fichero de `src/` escucha esos eventos ni usa `KeyboardAvoidingView` (grep de
   `KeyboardAvoidingView|automaticallyAdjustKeyboardInsets|Keyboard.(addListener|dismiss)` vacío).
8. **[I]** Encaja con lo observado. Si `adjustResize` funcionara, Login (un ScrollView a pantalla
   completa, `src/app/(auth)/login.tsx:53`) encogería y se podría desplazar. Que no se desplace ni
   Login ni Registro de peso indica que la raíz no encoge. Queda sin verificar en qué versión de
   Android corre el teléfono (15 o 16) y si la plantilla CNG pone `edgeToEdgeEnabled=true` en
   `gradle.properties`. Ninguna de las dos cosas cambia la conclusión: los puntos 4 y 5 cubren los
   dos caminos.

**Aviso sobre la guía de Expo:** la guía "Keyboard handling" (https://docs.expo.dev/guides/keyboard-handling/,
no está versionada: la URL `/versions/v57.0.0/guides/...` no existe) recomienda
`behavior={Platform.OS === 'ios' ? 'padding' : undefined}`, porque "for Android, just having the
KeyboardAvoidingView prevents covering the input". **[V]** Ese consejo da por hecho que la ventana se
redimensiona. Con `behavior` sin definir, `KeyboardAvoidingView` pinta un `View` normal y no hace nada
(`node_modules/react-native/Libraries/Components/Keyboard/KeyboardAvoidingView.js:290-298`, caso `default`).
Bajo edge-to-edge no basta. La documentación actual de RN (https://reactnative.dev/docs/keyboardavoidingview,
página no versionada) dice "On both iOS and Android, setting `behavior` is recommended".

---

## 2. Opciones para el editor sin dependencias nativas nuevas

Layout actual, verificado: raíz `View testID="screen-geofence-editor" className="flex-1"` > mapa
`View flex-1` + `ScrollView testID="geofence-editor-form"` con `style={{ flexGrow: 0, flexShrink: 1 }}`
(`src/screens/geofence-editor/index.tsx:136-142`). La ruta tiene cabecera nativa
(`src/app/_layout.tsx:104`, `headerShown: true` en `headerOptions`, `:79-85`).

### Opción A: `KeyboardAvoidingView` de react-native como raíz, `behavior="padding"` y offset de cabecera

- **Funciona en Android edge-to-edge:** **[V]** por código. En Android, KAV escucha
  `keyboardDidShow`/`keyboardDidHide` (`KeyboardAvoidingView.js:211-212`). Calcula
  `max(frame.y + frame.height - (screenY - keyboardVerticalOffset), 0)` (`:98-110`) y lo aplica como
  `paddingBottom` en el caso `'padding'` (`:275-283`). No necesita que la ventana encoja.
  **[I]** Todo depende de que `screenY` (`getWindowVisibleDisplayFrame().bottom`) excluya el IME
  bajo edge-to-edge. RN 0.86 lo usa así en su propio código, pero solo la prueba de humo lo confirma.
- **Offset obligatorio:** **[V]** `frame` sale de `onLayout`, que es relativo al padre
  (`KeyboardAvoidingView.js:125-129`), y `screenY` va en coordenadas de ventana. Con cabecera, sin
  offset, el padding se queda corto en la altura de la cabecera más la barra de estado. Esa franja del
  formulario queda bajo el teclado y Guardar puede caer justo ahí. Por eso
  `keyboardVerticalOffset = altura de cabecera`.
  - Cómo obtenerla: **[V]** `useHeaderHeight` lanza un error fuera de un navegador ("Couldn't find the
    header height", `node_modules/expo-router/build/react-navigation/elements/Header/useHeaderHeight.js:9-10`),
    y el test monta la pantalla sin navegador (`src/screens/geofence-editor/index.test.tsx:78`).
    La alternativa que no lanza es `use(HeaderHeightContext) ?? 0`, con `HeaderHeightContext` exportado
    desde `expo-router/react-navigation` (`node_modules/expo-router/react-navigation.d.ts:1` →
    `build/react-navigation/index.d.ts:2` → `elements/index.d.ts:60`). Hoy ningún fichero de `src/`
    importa `expo-router/react-navigation` ni `@react-navigation`.
- **Encaje con el layout:** **[I]** el `paddingBottom` reduce el alto disponible de la raíz. El mapa
  (`flex-1`, base 0) cede espacio primero. El formulario (`flexGrow 0, flexShrink 1`, base = alto del
  contenido) conserva su alto mientras quepa, y si no cabe se encoge y pasa a desplazarse, que es lo
  que pide el paso 9. Lo más probable es que el mapa se reduzca a 0 o casi 0 mientras se escribe.
  Decisión abierta: aceptarlo o darle un alto mínimo.
- **className en KAV:** **[V]** uniwind envuelve `KeyboardAvoidingView` y traduce `className`
  (`node_modules/uniwind/dist/common/components/native/KeyboardAvoidingView.js:10-17`). KAV pasa
  `...props` (incluidos `testID` y `className`) a su `View` host (`KeyboardAvoidingView.js:275-283`).
- **Animación:** **[I]** en Android el padding llega con `keyboardDidShow`, cuando el teclado ya está
  abierto: es un salto, sin animación sincronizada. El paso 9 solo exige alcanzabilidad.
- **Qué puede asegurar jest:**
  - **[I]** El test 18 (`index.test.tsx:194-200`: raíz `className` `flex-1`, `childTestIds(raíz)` =
    `[map, form]`) debería seguir pasando si `testID` y `className` pasan al KAV, porque
    `getByTestId` devuelve el `View` host con los mismos hijos. El implementer lo tiene que comprobar
    ejecutando la suite.
  - Las props `behavior="padding"` y `keyboardVerticalOffset` viven en el componente compuesto, no en
    el host. Hay dos formas de asertarlas. La primera es `UNSAFE_getByType(KeyboardAvoidingView).props`:
    **[V]** hoy hay 0 usos de `UNSAFE_` en los tests de `src/`, así que es una decisión de convención.
    La segunda es emitir un evento de teclado y mirar el `paddingBottom` del host. **[I]** Es frágil:
    jest-expo hereda el preset de RN (`node_modules/jest-expo/jest-preset.js:8-9`), cuya plataforma
    por defecto es presumiblemente iOS, y en iOS KAV escucha `keyboardWillShow`, no `keyboardDidShow`.
    Además el cálculo es asíncrono y depende de `onLayout`.
  - Lo que jest **no** ve: si el padding resultante deja Guardar alcanzable en el teléfono. Eso queda
    para el paso 9.

### Opción B: `behavior="height"`

**[V]** Fija `height: initialFrameHeight - bottom` y `flex: 0` (`KeyboardAvoidingView.js:236-257`).
Choca con `className="flex-1"` de la raíz: que ese `flex: 0` gane dependería del orden de mezcla de
uniwind. Hace el mismo cálculo que A (necesita el mismo offset) y no aporta nada. Descartable.

### Opción C: `automaticallyAdjustKeyboardInsets` en el ScrollView

**[V]** Solo existe en iOS: `@platform ios` (`node_modules/react-native/Libraries/Components/ScrollView/ScrollView.js:181-190`).
No sirve para el fallo de Android.

### Opción D: `Keyboard.addListener` + estado + `paddingBottom` a mano

**[V]** Es lo que KAV hace por dentro en Android. Su ventaja frente a A: con
`paddingBottom = e.endCoordinates.height + insets.bottom` en la raíz no hace falta conocer la altura
de cabecera. La raíz llega hasta el borde inferior de la ventana y RN resta la barra de navegación de
`height` (`ReactRootView.java:962`). **[I]** El cálculo no está probado en dispositivo. A cambio es
código propio: suscripción, limpieza y estado. La skill `expo-native-ui` (SKILL.md:100) desaconseja
`Keyboard.addListener` cuando se usa con una animación temporizada, y aquí no hay animación. Sirve
como plan B si A mide mal en el teléfono.

### Opción E: `useSafeAreaInsets`

**[I]** `react-native-safe-area-context` (~5.7.0, `package.json:39`) da los insets de barras de
sistema y recortes de pantalla, no el del IME. No resuelve el teclado por sí solo; solo sirve como
sumando en D.

---

## 3. Opciones a nivel de app

| Opción | Qué exige | Qué arregla |
|---|---|---|
| `softwareKeyboardLayoutMode: "resize"` explícito | Nada: **[V]** ya es el valor por defecto (§1.2). | Nada. Es el estado actual. La receta de `expo-router/references/tabs.md:377-388` (skill) no cambia nada aquí. |
| `softwareKeyboardLayoutMode: "pan"` | **[V]** Cambia `android:windowSoftInputMode` en el manifest (doc v57, §1.2): es un cambio nativo y obliga a **regenerar el dev build**. | **[I]** Desplaza la ventana para que se vea el input enfocado, pero no hace desplazable el contenido: en el editor, Guardar seguiría bajo el teclado. Tampoco está verificado cómo se comporta `adjustPan` bajo edge-to-edge. La guía de Expo lo recomienda para otro problema (tab bar empujada). No cumple el paso 9. |
| `react-native-keyboard-controller` | **[V]** No está instalado (ni en `package.json` ni en `node_modules/`). El rango de SDK 57 es exactamente `"1.21.9"` (`node_modules/expo/bundledNativeModules.json:107`). Es un módulo nativo: **regenerar el dev build** (la página v57 lo da por incluido en Expo Go, https://docs.expo.dev/versions/v57.0.0/sdk/keyboard-controller/, pero el runtime de humo es el dev build). Requiere `react-native-reanimated` (instalado 4.5.1, `package.json:38`) y `KeyboardProvider` en la raíz, junto a `GestureHandlerRootView` (`src/app/_layout.tsx:58-71`). Instalación con `bunx expo install react-native-keyboard-controller`. Es una dependencia nueva: la spec tiene que declararla. | Todas las pantallas con inputs, al cambiar su `ScrollView` por `KeyboardAwareScrollView`: desplaza solo hasta el input enfocado y anima a la par que el teclado. Es lo que recomiendan la guía de Expo y las skills (`expo-native-ui` SKILL.md:100, `expo-animation` RECIPES.md:253-275, `expo-design-system` native-slop.md:28, "Keyboard Blindness"). |
| KAV `behavior="padding"` por pantalla (solo JS) | Nada nativo. El offset depende de la pantalla: 0 en `(auth)` (`src/app/(auth)/_layout.tsx:12`, `headerShown: false`) y en `reset-password` (`src/app/_layout.tsx:92`, sin cabecera); la altura de cabecera en weight-log, add-pet, add-reminder y pairing (`src/app/_layout.tsx:94-99`). | Lo mismo que A, pantalla a pantalla. No desplaza solo hasta el input enfocado y no anima. |

**[V]** Hay pantallas con `<Input` que la lista del humano no incluye: `src/screens/add-pet/index.tsx`,
`src/screens/add-reminder/index.tsx` y `src/screens/pairing/index.tsx`, además de las cinco citadas
y el editor (grep de `<Input|<TextInput|<TextArea` sobre `src/`, sin tests).

---

## 4. Recomendación (el leader y el spec_author deciden)

**(a) Mínimo para cerrar #146, solo el editor y solo JS:** sustituir la raíz `View` del editor por un
`KeyboardAvoidingView` de `react-native`, con `testID="screen-geofence-editor" className="flex-1"`,
`behavior="padding"` sin distinguir plataforma y
`keyboardVerticalOffset={use(HeaderHeightContext) ?? 0}` (de `expo-router/react-navigation`).
No necesita un dev build nuevo ni ninguna dependencia, y **no depende de (b)**. Hace falta una
enmienda a R6 (`requirements.md:478-486`): el árbol cambia de raíz y hay que fijar la forma de asertar
las props (ver §2.A). El paso 9 sigue siendo el gate real. Si en el teléfono el padding se queda
corto o se pasa, el plan B es la opción D dentro del mismo editor.

**(b) Transversal, como feature aparte:** Login, Registro, Olvidé, Reset y Registro de peso, más
Add pet, Add reminder y Pairing. Hay dos caminos:
1. **KAV `padding` por pantalla:** solo JS, sin rebuild, mismo patrón que (a). Arregla la
   alcanzabilidad, pero no desplaza solo hasta el input enfocado ni anima.
2. **`react-native-keyboard-controller` 1.21.9:** `KeyboardProvider` en la raíz y
   `KeyboardAwareScrollView` en cada formulario. Exige regenerar el dev build y declarar la dependencia
   en la spec, y da la mejor experiencia. Si se elige este camino, el KAV de (a) pasa a ser provisional
   y conviene migrar el editor en la misma feature.

En los dos casos conviene codificar la regla en `docs/ui-guidelines.md` o `docs/conventions.md`
(ver §5), porque hoy ninguna pantalla tiene manejo de teclado y es justo el fallo "Keyboard Blindness"
del catálogo de la skill.

**Preguntas abiertas para el spec_author:**
- ¿Se acepta que el mapa se reduzca a 0 o casi 0 con el teclado abierto, o se le da un alto mínimo?
- ¿Las props de KAV se asertan con `UNSAFE_getByType`, que sería el primer uso en el repo, o el
  teclado queda solo en el humo, como ya dice `requirements.md:1274`?
- Si (b) va a usar keyboard-controller pronto, ¿compensa hacer (a) con KAV o se espera a (b)?
  (a) no exige esperar.

---

## 5. Qué dicen ui-guidelines.md y conventions.md del teclado

**[V] Nada.** `grep -iE 'teclado|keyboard|softwareKeyboard|adjustResize|edge-to-edge|edgeToEdge'`
más `grep -w IME` sobre `docs/ui-guidelines.md` y `docs/conventions.md` dan 0 coincidencias en el
worktree (HEAD 9dbe3de5). En `origin/main` (cb14497c) `git show ... | grep -ciE 'teclado|keyboard'`
da 0 en los dos ficheros. Sobre el teclado solo hablan la spec de #146 (`requirements.md:1274`, `:1414`
y `:1470`, donde se deja solo a la prueba de humo) y las skills de Expo (`expo-native-ui` SKILL.md:99-100:
`keyboardShouldPersistTaps="handled"` y "A form's primary action must never sit under the keyboard").

---

## Verificación del leader (2026-10-02)

- **Falso:** §2.A propone `UNSAFE_getByType(KeyboardAvoidingView).props`.
  RNTL 14.0.1 eliminó las consultas `UNSAFE_*` (`node_modules/@testing-library/react-native/docs/guides/migration-v14.md:345-349`):
  solo renderiza nodos host.
- **Medido, al revés de lo que dice §2.A:** emitir un evento de teclado sí sirve en
  jest. Una sonda aislada (KAV `behavior="padding"`, `HeaderHeightContext` = 91,
  `fireEvent` de `layout` con `persist`, `DeviceEventEmitter.emit('keyboardWillShow', …)`
  con `screenY` 500) dio `paddingBottom` 0 antes del evento y 291 después, con
  `Platform.OS` `ios`. Es el candado de E1.2 en `specs/mobile-geofence-editor/requirements.md`.
- **Verificado:** el stack nativo de expo-router provee el mismo `HeaderHeightContext`
  que exporta `expo-router/react-navigation`
  (`build/react-navigation/native-stack/views/NativeStackView.native.js:228`).
  React es 19.2.3, pero el repo usa `useContext` y no `use`, así que E1 sigue el
  idioma del repo.
