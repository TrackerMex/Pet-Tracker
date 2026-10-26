# explore: ui-tema-barra-drawer
Fecha: 2026-10-26
Worktree: /home/claude/sites/Pet-Tracker-wt-ui (rama docs/ui-ola0-mejoras, base origin/main). Solo lectura. Rutas relativas a `mobile-pet-tracker/` salvo que se diga otra cosa. Anclas por contenido (las líneas caducan al mergear).
Skills: expo:expo-overview cargada. SDK 57.0.14, RN 0.86.2, Android only (CNG puro: no hay `android/`).
Limite del informe: no hay dispositivo; lo que depende de pintado nativo va marcado **HIPOTESIS** con la prueba que lo confirma.

---

## (A) Libreria de animacion del cambio de tema + flash al cambiar de tab

### Que es y como se cablea
- Libreria: `react-native-nitro-theme-transition@1.0.0` (+ su peer `react-native-nitro-modules@0.37.0`, pin exacto). `package.json`: ambas en `dependencies`. En `bun.lock`, `react-native-nitro-modules` solo aparece como dependencia directa y como peer de nitro-theme-transition: nadie mas la usa.
- Un solo punto de uso en codigo: `src/theme/theme-transition.ts`
  - `export const THEME_FADE = { kind: 'fade', durationMs: 400, settleFrames: 4 }`.
  - `export function useThemeTransition()` devuelve `switchTheme(next)`: si `useReducedMotion()` -> `Uniwind.setTheme(next)` directo; si no, `getWithThemeTransition()` hace un `require('react-native-nitro-theme-transition')` perezoso, solo si `hasNitroModules()` (sonda en `src/theme/nitro-availability.ts`, `TurboModuleRegistry.get('NitroModules')`), y llama `withThemeTransition(apply, THEME_FADE)`. Siempre `void setStoredTheme(next)` (persistencia, `src/utils/theme-preference.ts`, SecureStore).
- Un solo llamador: `src/screens/profile/index.tsx` (`const switchTheme = useThemeTransition();` y el boton `theme-toggle`).
- Tema inicial: `src/app/_layout.tsx` hace `Uniwind.setTheme(theme)` antes del primer render (gate `themeReady`); no pasa por nitro.
- Dato clave de plataforma: `Uniwind.setTheme('light'|'dark')` llama internamente `Appearance.setColorScheme(...)` (uniwind `config.common.ts`). Es decir, el esquema nativo de RN/Android queda forzado al tema elegido en la app.

### Specs / registro que la introdujeron
- Feature #43 `mobile-theme-transition` (status done, P3 "polish 100% prescindible"): `specs/mobile-theme-transition/{requirements,design,tasks,traceability}.md`, `progress/impl_mobile-theme-transition.md`, `progress/review_mobile-theme-transition.md`, entrada en `feature_list.json` (id 43).
- La propia spec ya preveia la salida: requirements.md §"Criterio de salida" / "Decision del gate humano" (descartar = revertir `package.json`/`bun.lock` y `theme-transition.ts`, "queda el toggle sin fade de #40"). Registro del humano (2026-08-26): "mantener — dispositivo android: las animaciones no se hacen como lo muestra el prototipo de la libreria".
- #32 `mobile-ui-foundation` (requirements §fuera de alcance) dejo nitro explicitamente para #43.
- Menciones tangenciales (no la introducen): `specs/mobile-reanimated-double-dead-weight/{design,tasks}.md` (cita `theme-transition.test.tsx:18` como doble legitimo), `specs/mobile-jest-mock-hygiene/design.md` (cuenta `jest.fn(<impl>)` de `theme-transition.test.tsx` y `screens.test.tsx`), `specs/pet-online-pill/requirements.md` y `specs/mobile-alerts-canvas-fidelity/requirements.md` (citan el fichero de test).

### Que hace el "flash al cambiar de tab": hallazgo importante
La libreria NO esta cableada a la navegacion: solo se invoca al pulsar el toggle de Perfil. Un flash blanco/negro "al cambiar de tab" no sale de `withThemeTransition` a menos que quede un snapshot colgado tras el toggle (no hay evidencia de eso; el fade dura 400 ms + 4 frames).

Causa candidata mucho mas probable (**HIPOTESIS**, con evidencia de codigo):
1. `src/app/(tabs)/_layout.tsx`: `<Tabs screenOptions={{ headerShown: false, animation: 'fade' }}>` (R6 de #? `mobile-tab-glass`, commit 3da2d36a "fade tab content transitions"). Sin `sceneStyle`.
2. El app no monta ningun `ThemeProvider` de React Navigation (grep de `ThemeProvider|DefaultTheme|DarkTheme|sceneStyle` en `src/`: solo aparece `contentStyle` en `alerts/[alertId]` de `_layout.tsx`). Expo Router usa entonces su tema por defecto, cuyo `colors.background` es `rgb(242, 242, 242)` (claro) y `rgb(1, 1, 1)` (oscuro) (`node_modules/expo-router/build/react-navigation/native/theming/{DefaultTheme,DarkTheme}.js`).
3. Las pantallas pintan `bg-background` = `#FFFFFF` / `#0D1117` (`src/theme/global.css`, `--background`). Con crossfade de opacidad entre escenas, mientras una sale y otra entra, se ve el fondo de escena del navegador (gris 242 / casi negro 1,1,1) a traves de ambas: flash gris-claro/negro-puro, no de la paleta. Coincide con "blanco y negro" y con que ocurra *al cambiar de tab* y no al togglear.
4. Prueba que lo confirma o descarta: en un dev build, cambiar de tab con el tema oscuro (flash a negro puro `#010101` vs `#0D1117`) y claro (gris `#F2F2F2` vs `#FFF`). Si desaparece al poner `sceneStyle: { backgroundColor: <token background> }` en `screenOptions`, esa era la causa.

Conclusion para (A): quitar la libreria **no es la correccion del flash de tabs** segun la evidencia; hay que presentar al humano ambas cosas por separado (ver Decisiones D1 y D2). Si el humano quiere quitarla igual (es prescindible y su verificacion en Android ya salio "no como el prototipo"), el inventario es este.

### Como se quitaria (inventario, sin implementar)
Codigo y config:
- `package.json`: borrar `react-native-nitro-theme-transition` y `react-native-nitro-modules` de `dependencies`, y ambos del regex `transformIgnorePatterns` en `jest`. `bun.lock` se regenera con `bun remove react-native-nitro-theme-transition react-native-nitro-modules` (bun, nunca npm).
- Borrar `src/theme/theme-transition.ts` y `src/theme/nitro-availability.ts`.
- `src/screens/profile/index.tsx`: quitar `import { useThemeTransition }` y `const switchTheme = useThemeTransition();`; el `onPress` de `theme-toggle` pasaria a `Uniwind.setTheme(next); void setStoredTheme(next);` (como en #40). Hay que leer ese bloque (~linea 515-525, `useDarkThemeLabel`) antes de editar: no lo lei entero.
- Tests a borrar: `src/theme/__tests__/theme-transition.test.tsx`, `src/theme/__tests__/theme-transition.degraded.test.tsx`.
- Tests a editar (quitar el `jest.mock` del paquete y de `../../theme/nitro-availability`, y la asercion R2): `src/screens/profile/index.test.tsx` (imports ~l.17, mocks ~l.78-90, `it('R2: el toggle dispara el fade vía withThemeTransition'` ~l.583) y `src/app/(tabs)/__tests__/screens.test.tsx` (mock de `react-native-nitro-theme-transition` ~l.29).
- Si se quita, el `it` de profile que prueba el toggle sin nitro (el R2 de #40, "aplica el tema") debe seguir verde sin relajar: revisar que existe antes de borrar.
- Efecto nativo: quitar una dependencia con codigo nativo exige **rebuild del dev build** (EAS, decision y costo del humano; CLAUDE.md: ninguna IA lanza `eas build`). Sin rebuild, el APK viejo sigue con el modulo pero el JS ya no lo usa: inofensivo.
- Docs/specs: `specs/mobile-theme-transition/*` y `feature_list.json` #43 quedan como historia; seguir su propio criterio de salida: anotar en `feature_list.json` #43 "descartada/retirada <fecha>: <motivo>" (la spec lo contempla). `specs/mobile-jest-mock-hygiene/design.md` cuenta "11 suites / 21 sitios" con `theme-transition.test.tsx` y `screens.test.tsx`: la cifra caduca (ya es dato historico, no ancla).
- `docs/ui-guidelines.md` no menciona nitro ni el fade del tema (grep): no hay que tocar la carta.

Candados que tocaria: `theme-transition.test.tsx`, `theme-transition.degraded.test.tsx` (borrados), `profile/index.test.tsx`, `(tabs)/__tests__/screens.test.tsx` (editados). `design-drift.test.ts` NO referencia nitro (solo fija `@gorhom/bottom-sheet`, `blobatar`, etc. en la prueba de deps ~l.309). No hay test de `package.json` que exija nitro; `app.config.test.ts`/`app.assets.test.ts` no lo miran.

---

## (B) Barra de estado de Android (la hora invisible en tema claro)

### Configuracion actual (hechos)
- `grep` de `StatusBar|statusBar|expo-status-bar|expo-system-ui|SystemUI` en `src/`, `app.json`, `app.config.ts`, `metro.config.js`: **no hay ningun uso**. `expo-status-bar@~57.0.1` y `expo-system-ui@~57.0.2` estan en `dependencies` pero ningun codigo ni plugin los usa. `app.json`: `"userInterfaceStyle": "automatic"`, `android.predictiveBackGestureEnabled: false`, sin `androidStatusBar`, sin `backgroundColor` raiz, sin `androidNavigationBar`. SDK 57 es edge-to-edge siempre (la barra es transparente y el contenido pasa por debajo). `app.config.ts` solo toca `android.config.googleMaps`, `googleServicesFile` e `intentFilters`.
- Spec previa lo deja como deuda conocida: `specs/mobile-detail-screens-to-stack/requirements.md` §fuera de alcance: "Estilo de la barra de estado frente al tema elegido dentro de la app: es preexistente y comun a todas las pantallas". Nunca se asigno a una feature.
- Consecuencia: el estilo de los iconos lo decide el valor por defecto nativo, no el tema de la app.

### Por que en tema claro los iconos pueden salir claros (HIPOTESIS, dos causas que se suman)
1. **Nadie declara el estilo.** Con un `Appearance` forzado por Uniwind (`setColorScheme('light')`) cuando el SO esta en oscuro (o viceversa), el default nativo de los iconos puede no coincidir con el tema de la app. Prueba: dispositivo con SO oscuro + tema de app claro -> iconos claros sobre `#FFFFFF`; con SO claro + app claro -> iconos oscuros bien. Si el humano tiene el SO en oscuro, es esta.
2. **Hero fotografico bajo la barra.** `PetHeroHeader variant="bleed"` (Inicio y Perfil: `src/screens/home/index.tsx`, `src/screens/profile/index.tsx`) pinta la foto a sangre bajo la barra de estado con un velo oscuro superior de 90 px (`pet-hero-scrim-top`, `${scrim}80 -> ${scrim}00` de `#0D1117`). Ahi lo correcto son iconos **claros** en ambos temas; en el resto de pantallas (Mapa, Salud, Comida, Recordatorios, etc., `bg-background`) en tema claro hacen falta iconos **oscuros**. Un unico estilo global no sirve para las dos familias, por eso "en tema claro no se ve" es dependiente de la pantalla. Esto responde a la pregunta del coordinador: si hay contenido oscuro bajo la barra (hero con velo) y icono oscuro, la hora desaparece; si hay fondo claro e icono claro, tambien.
- La captura del drawer de Recordatorios (barra oscura sobre scrim) es una ventana de dialogo nativa con su propio scrim: no es evidencia de nada sobre el estilo del resto de pantallas.

### Correccion minima (sin tomar la decision)
- Base: un `<StatusBar style="auto" />` de `expo-status-bar` en `RootLayout` (`src/app/_layout.tsx`). `style="auto"` deriva de `useColorScheme()` de RN (`expo-status-bar/src/NativeStatusBarWrapper.tsx`), que Uniwind mantiene sincronizado con el tema de la app via `Appearance.setColorScheme`. Con eso: tema claro -> iconos oscuros; tema oscuro -> iconos claros, independiente del SO. Dependencias nuevas: ninguna (ya instaladas).
- Excepcion de los heroes: en las pantallas con `PetHeroHeader variant="bleed"` y foto, `<StatusBar style="light" />` en la pantalla (RN mezcla por orden de montaje; con `useIsFocused`/`useFocusEffect` para que no se quede al cambiar de tab: las pestañas montadas siguen vivas, por lo que un `<StatusBar>` suelto en una pestaña oculta sigue activo; **riesgo real**). Alternativa que evita esto: elegir en `(tabs)/_layout.tsx` segun la ruta activa.
- Alternativa sin codigo de componentes: la pestaña/hero podria llevar un velo ya existente suficiente y aceptar iconos claros siempre en hero; igual requiere la excepcion.
- Prueba en dispositivo (humano): tema claro, SO oscuro y SO claro, en Inicio (hero), Mapa y un detalle con cabecera nativa (`edit-profile`, `pets/[petId]/docs-upload`: cabecera de `react-native-screens`, que puede aplicar su propio `statusBarStyle`).
- `npx expo install` no hace falta. Android: efecto inmediato en JS, sin rebuild.

Candados: no hay test que mire la barra de estado. `src/app/__tests__/layout.test.tsx` (monta `RootLayout`; mockea `expo-font`/`uniwind`...) habria que revisar si un `StatusBar` real rompe su mock; `(tabs)/__tests__/layout.test.tsx` y `src/app/__tests__/tabs-layout.test.tsx` fijan `screenOptions` con `toEqual({ headerShown: false, animation: 'fade' })` (ver D2). `design-drift.test.ts` solo vigila hex/StyleSheet/arbitrarias en listas de ficheros: un `StatusBar` no las toca.

---

## (C) Drawer "¿Eliminar recordatorio?" y fondos que no coinciden

### Componente y origen de cada color (hechos + una hipotesis nativa)
- Es `BottomSheet` de `@expo/ui/community/bottom-sheet` (no es HeroUI): `src/screens/reminders/index.tsx`, `<View testID="reminders-delete-host"><BottomSheet index={deleteCandidate === null ? -1 : 0} enablePanDownToClose onClose={dismissDeleteSheet} snapPoints={['50%', '100%']}><BottomSheetView><View testID="reminders-delete-sheet" className="items-center gap-3 bg-surface px-5 pb-9 pt-3">`. En Android envuelve `ModalBottomSheet` de Material 3 (`node_modules/@expo/ui/src/community/bottom-sheet/BottomSheet.android.tsx`).
- **Blanco (contenido)**: el `View` interno con `bg-surface` = `--surface` `#FFFFFF` (claro) / `#161B22` (oscuro) en `src/theme/global.css`.
- **Rosa (franja superior ~80 px alrededor del handle y franja inferior bajo "Cancelar")**: el **contenedor nativo de la sheet**. `BottomSheet.android.tsx` solo pasa `containerColor` si recibe `backgroundStyle` (`extractBackgroundColor(backgroundStyle)`); la pantalla **no pasa `backgroundStyle`**, asi que en Kotlin (`node_modules/@expo/ui/android/src/main/java/expo/modules/ui/ModalBottomSheetView.kt`) aplica `props.containerColor.composeOrNull ?: BottomSheetDefaults.ContainerColor`, el color de superficie de Material 3, que con Material You / color dinamico del sistema toma el tinte del sistema (rosa en el telefono del humano). Es "el fondo del sistema" que describe el humano. Alto de la sheet: con `snapPoints=['50%','100%']` el alto es el 50 % de la pantalla (no se ajusta al contenido: `fitToContents` solo vale sin snapPoints), asi que el contenido blanco es mas bajo que la sheet y sobra una banda del color nativo debajo (la franja inferior). La franja de arriba es la del drag handle (`showDragHandle` por defecto) y el `pt-3`.
- Estado: la causa (container sin `backgroundStyle`) esta confirmada por el codigo de la libreria; que el tinte sea exactamente el dynamic color del sistema es la parte **HIPOTESIS** (se confirma cambiando el fondo de pantalla del telefono o simplemente comprobando que desaparece al pasar `backgroundStyle`).
- El scrim gris detras es el `scrimColor` por defecto de M3 (`BottomSheetDefaults.ScrimColor`); `BottomSheet.android.tsx` no lo expone, solo `containerColor`. El texto de `types.ts` dice "Android provides scrim color control via `backgroundStyle`" pero el codigo solo extrae `backgroundColor`: no esta disponible el scrim por esta ruta.

### Alinear ambos a tokens (propuesta, un unico fondo)
- Pasar al `BottomSheet` `backgroundStyle={{ backgroundColor: surface }}` con `const [surface] = useThemeColors(['surface'])` (`src/theme/use-theme-colors.ts`; `docs/ui-guidelines.md` regla 9 manda colores imperativos via ese hook y la regla 1 prohibe hex fuera de `src/theme/`). El `View` interno ya es `bg-surface`: ambos fondos pasan a ser el mismo token y la franja desaparece sin tocar el layout.
- Con `bg-surface` en ambos (blanco `#FFF` claro, `#161B22` oscuro) el fondo de la sheet coincide con tarjetas/dialogo (`Card` usa surface). Alternativa de token: `background` en lugar de `surface` (`#FFFFFF` / `#0D1117`); en claro son identicos y en oscuro `surface` sigue la jerarquia de capa de las tarjetas. Recomendacion: `surface` (el contenido ya lo usa, un solo cambio).
- Alto: opcional, quitar `snapPoints` y dejar `enableDynamicSizing` para que la sheet mida al contenido y no sobre nada debajo del boton Cancelar (cambia comportamiento del candado, ver abajo). Con el fondo ya unificado, la banda sobrante ya no se distingue, pero seguiria habiendo espacio vacio de ~50 % en pantallas altas.
- iOS no aplica (la app es Android only; en iOS `BottomSheet.ios.tsx` usa `presentationBackground` con el mismo `backgroundStyle`, asi que la propuesta tambien vale ahi).

### Otros drawers / sheets / modals con el mismo defecto o parecido
Inventario completo de superficies flotantes en `src/` (grep de `BottomSheet|Modal|Dialog|presentation|formSheet|Alert.alert`):
1. **`src/screens/pairing/index.tsx`** — `<View testID="pairing-unpair-host"><BottomSheet index={unpairOpen ? 0 : -1} enablePanDownToClose onClose={closeUnpair} snapPoints={['50%','100%']}>` con el mismo `View` `bg-surface` y **sin `backgroundStyle`**: **mismo defecto exacto** (la copia fue literal; `pairing-unpair-sheet`). Es la unica otra `BottomSheet` del app.
2. `src/components/confirm-dialog.tsx` — `Modal` de RN propio (`transparent`, `statusBarTranslucent`); card `Card` + `bg-surface`/tokens; el scrim es **un hex literal** `const SCRIM = 'rgba(13,17,23,0.4)'` (fuera de `src/theme/`, chocaria con la regla "cero hex fuera de src/theme"; el `HEX_LITERAL` de design-drift no lo detecta por ser `rgba`). Usado por `geofences` y `geofence-editor`. No tiene el defecto de dos fondos; la nota es sobre el scrim hardcodeado.
3. `src/components/celebration.tsx` — `Modal` de RN a pantalla completa, `bg-surface-secondary`, `statusBarTranslucent navigationBarTranslucent`: fondo unico por tokens; sin defecto.
4. `presentation="dialog"` en `src/screens/meal-schedule/index.tsx`, `add-pet/index.tsx`, `add-reminder/index.tsx` (pickers de hora/fecha, probablemente `DateTimePicker`/`@expo/ui`): los renderiza el sistema (Material dialog): **puede tintarse con el tema del sistema** igual que la sheet, pero no lo investigue (no lei esos tres bloques). Es sospecha, no hecho.
5. Cabeceras nativas del Stack con `headerStyle: { backgroundColor: background }` en `_layout.tsx` (`headerOptions` de `edit-profile` y `docs-upload`) y `contentStyle` solo en `alerts/[alertId]`: **el resto de pantallas del `Stack` raiz no declaran `contentStyle`**, es decir su fondo de escena es el tema por defecto de Navigation (`rgb(242,242,242)` / `rgb(1,1,1)`): misma familia de desfase que (A), visible en las transiciones del Stack. Verificar con el mismo criterio.

---

## Riesgos
- (A) Quitar nitro no arregla el flash de tabs si la causa es el fondo de escena de Navigation; el humano puede quedarse sin ninguno de los dos arreglos. Separar D1 y D2.
- (A) Quitar nitro necesita rebuild nativo del dev build; mientras no se haga, hay dos binarios en circulacion (inofensivo).
- (A) El sondeo `hasNitroModules` y los 2 ficheros de test existen por haber tropezado con LogBox en Expo Go (`progress/impl_mobile-theme-transition.md`); borrarlos es limpio pero hay que mantener el test R2 "el toggle aplica el tema" de `profile/index.test.tsx` sin relajar.
- (B) Un `<StatusBar>` por pantalla en pestañas queda activo aunque la pestaña no este enfocada (las pestañas siguen montadas): elegir por ruta activa en `(tabs)/_layout.tsx` o condicionar a `useIsFocused`.
- (B) Hipotesis sin dispositivo: no se puede asegurar si la causa es SO-oscuro/app-claro o el hero. Proponer ambas correcciones en el orden "base primero, medir, excepcion despues".
- (C) `backgroundStyle` solo cubre el contenedor, no el scrim ni el handle; cambiar `snapPoints` altera el contrato que fijan los tests (ver abajo).
- (C) Mismo defecto en `pairing`: arreglar solo Recordatorios dejaria la otra sheet con franja rosa.
- Un `sceneStyle` con hex o `ThemeProvider` con colores literales violaria la regla de cero hex fuera de `src/theme/`: los colores salen de `useThemeColors`, no de literales.
- Coordinacion de worktrees: este informe vive en `progress/` del worktree `-wt-ui`; los cambios de codigo irian por handoff a Codex con la skill `expo:expo-overview` y los nombres reales del catalogo de Codex (ver `.claude/agents/leader.md` §Catalogo real de skills de Codex).

## Decisiones abiertas para el humano (opciones cerradas)
- **D1 — Libreria de tema**: (a) quitar `react-native-nitro-theme-transition` y `react-native-nitro-modules` (cambio instantaneo de tema, estilo #40), o (b) conservarla y arreglar solo el flash de tabs (D2). Recomendacion del explorer: D2 primero, medir; si el flash persiste tras D2, entonces (a).
- **D2 — Flash al cambiar de tab**: (a) `sceneStyle: { backgroundColor: background }` en `screenOptions` de `(tabs)/_layout.tsx`, (b) `ThemeProvider` raiz de React Navigation con colores de tokens (arregla tambien las transiciones del Stack raiz), o (c) quitar `animation: 'fade'` (volver a corte seco; deshace la R6 de `mobile-tab-glass`). Recomendacion: (b); si se quiere minimo, (a).
- **D3 — Barra de estado**: (a) solo `<StatusBar style="auto" />` global, (b) global `auto` + `light` en las pantallas con hero fotografico (Inicio y Perfil), o (c) global `auto` + un velo claro/oscuro para no depender de la foto. Recomendacion: (b), con la seleccion por ruta activa.
- **D4 — Fondo de las sheets**: token `surface` o `background` (en claro es el mismo `#FFF`). Recomendacion: `surface`. Y alcance: (a) solo Recordatorios, (b) Recordatorios + Pairing (misma copia), (c) ademas un componente compartido `AppBottomSheet` que fije fondo, handle y alto para ambas. Recomendacion: (b) con helper minimo solo si la spec lo justifica; (c) es mas amplio de lo pedido.
- **D5 — Alto de la sheet**: mantener `snapPoints={['50%','100%']}` o medir al contenido (quitar `snapPoints`). Cambia el contrato de los tests de Recordatorios y Pairing.
- **D6 — Scrim hardcodeado de `confirm-dialog.tsx`** (`rgba(13,17,23,0.4)`): fuera de alcance de lo pedido; decidir si entra como deuda tokenizable (`--scrim` ya existe en `global.css` pero es opaco).
- **D7 — Rebuild**: (A.a) deja dependencias nativas obsoletas; el dev build lo lanza el humano.

## Candados / tests que tocaria cada cambio
- **A.a (quitar nitro)**: borrar `src/theme/__tests__/theme-transition.test.tsx`, `src/theme/__tests__/theme-transition.degraded.test.tsx`; editar `src/screens/profile/index.test.tsx` (imports/mocks nitro y nitro-availability, el `it('R2: el toggle dispara el fade vía withThemeTransition')`) y `src/app/(tabs)/__tests__/screens.test.tsx` (mock del paquete); `package.json` (`transformIgnorePatterns`, deps). Sin candado de `design-drift`.
- **D2 (a/b)**: `src/app/__tests__/tabs-layout.test.tsx` (R6) y `src/app/(tabs)/__tests__/layout.test.tsx` fijan `screenOptions` con `toEqual({ headerShown: false, animation: 'fade' })`: agregar `sceneStyle` los pone rojos -> enmienda de esos dos tests (y de la spec `specs/mobile-tab-glass`, R6). La opcion (b) en `src/app/_layout.tsx` toca `src/app/__tests__/layout.test.tsx` (monta `RootLayout`) y `src/app/__tests__/detail-stack*.test.tsx` si montan el Stack. `design-drift`: no (sin hex).
- **D3**: `src/app/__tests__/layout.test.tsx` (monta `RootLayout`; puede necesitar mock de `expo-status-bar`) y los tests de `home`/`profile` si la excepcion va dentro de la pantalla. Ningun test actual fija el estilo de la barra.
- **D4/D5 (sheet de Recordatorios)**: `src/screens/reminders/index.test.tsx`: el doble de `@expo/ui/community/bottom-sheet` propaga `...props`, y `confirmDelete()` asserta `expect.objectContaining({ index: 0, onClose, enablePanDownToClose: true, snapPoints: ['50%','100%'] })`: **agregar `backgroundStyle` no lo rompe; quitar `snapPoints` si**. Hay un candado de clase: `expect(sheet.props.className).toBe('items-center gap-3 bg-surface px-5 pb-9 pt-3')` (~l.1363, `reminders-delete-sheet`) y varios `getByTestId('reminders-delete-sheet')`; no cambiar el `className` del contenido. Mocks necesarios para `useThemeColors('surface')`: revisar si el test ya mockea `uniwind`/`use-theme-colors` (no lo verifique). El texto del titulo `'¿Eliminar recordatorio?'` es literal.
- **D4 (pairing)**: `src/screens/pairing/index.test.tsx` (~l.77-90 doble igual de la sheet; `pairing-unpair-sheet`, `community-bottom-sheet`): mismo analisis.
- **Tokenizar `SCRIM` (D6)**: `src/components/__tests__/confirm-dialog*` y `design-drift`/`consistency-classnames` (no los lei; hay que listar con grep antes de firmar).
- Regla general de handoff (memoria del proyecto): ancla `grep -cF` con salida esperada, `cd` literal, commits test-primero, y exigir en el handoff a Codex `expo:expo-overview` + nombres reales de skills de Codex; instruccion de `git status --short` acotado.

## Recomendacion
Tres cambios pequenos e independientes en un solo PR de UI "ola 0": (1) sheets: `backgroundStyle` surface en Recordatorios y Pairing; (2) fondo de escena de Navigation por tokens para matar el flash de tabs (D2) y solo despues decidir retirar nitro (D1); (3) `StatusBar style="auto"` global y excepcion light en los heroes (D3). El unico cambio con costo de build es retirar nitro (rebuild nativo, del humano). Verificacion en dispositivo Android con SO claro y SO oscuro, y con un telefono con Material You activo para (C).
