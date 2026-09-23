---
feature: "mobile-detail-screens-to-stack"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-detail-screens-to-stack]] (#95)

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil y
> [[../../docs/architecture|architecture]] para las capas (aquí solo aplica la
> capa de infraestructura/UI de la app Expo: nada de backend).
>
> Todo lo que sigue se verificó **contra el árbol en `2be1b023`**, no contra el
> enunciado, y los ficheros compartidos (`docs/conventions.md`,
> `docs/ui-guidelines.md`, `CHECKPOINTS.md`) se leyeron con
> `git show origin/main:<ruta>`. Las citas son por contenido o por commit, no por
> número de línea: los números los mueve el trabajo de otros.

## Skills cargadas

`expo:expo-overview` → `expo:expo-router` (Stack, cabeceras, grupos, rutas
protegidas) y `expo:expo-native-ui` para el look de la cabecera, como manda
`docs/ui-guidelines.md` §Skills. El handoff a Codex debe pedir las equivalentes
de su catálogo (`.claude/agents/leader.md` §Catálogo real de skills de Codex:
**sus nombres, no los nuestros**).

Documentación del SDK leída (versión fijada, `expo ~57.0.14`,
`expo-router 57.0.14`):

- <https://docs.expo.dev/versions/v57.0.0/sdk/router/> — `Stack.Screen` con
  `name` y `options` (`title`, `headerShown`, `animation`), `useFocusEffect`.
- <https://docs.expo.dev/router/advanced/stack/> — opciones desde el layout con
  `<Stack.Screen name options />`; la API de composición (`Stack.Title`,
  `Stack.Header`) está en **alfa** desde SDK 55 y **no se usa**; animación por
  defecto de plataforma.
- <https://docs.expo.dev/router/advanced/protected/> — `Stack.Protected guard`:
  al pasar `guard` de `true` a `false` *"all of its history entries will be
  removed from the navigation history"*; navegar a una ruta con guarda `false`
  redirige al ancla o a la primera pantalla disponible. **`redirectTo` es de
  SDK 58**: no existe aquí y no se usa.
- En el árbol: `node_modules/expo-router/build/views/Protected.js` (`Protected`
  es el `Group` de primitives) y `layouts/withLayoutContext.js` (filtra los
  hijos de un `Protected` con `guard` falso); opciones de cabecera en
  `react-navigation/native-stack/types.d.ts` (`headerTitleStyle` admite
  `fontFamily`; no hay opción de nombre accesible para el botón de volver en
  Android).

## Entorno (verificado, no supuesto)

| Qué | Valor en `2be1b023` | Fuente |
|---|---|---|
| `expo` / `expo-router` | `57.0.14` / `57.0.14` | `node_modules/*/package.json` |
| `react-native-screens` | `4.26.2` (rango `~4.26.0`, igual que `bundledNativeModules.json`) | `package.json`, `node_modules/expo/bundledNativeModules.json` |
| `react-native-safe-area-context` | `5.7.0` (`~5.7.0`) | ídem |
| `@testing-library/react-native` | `14.0.1` (`render` es asíncrono) | `node_modules` |
| Dependencias nuevas | **ninguna** | — |
| `.expo/types/router.d.ts` | no existe (gitignorado por `mobile-pet-tracker/.gitignore`) | `ls` |
| `bunx jest --silent` | 77 suites, 1412 tests, verde | medido |
| `bunx tsc --noEmit` / `bunx expo lint` | exit 0, salida vacía | medido |

`react-native-screens` ya está enlazado en el dev build de Android: por eso la
prueba de humo no pide regenerarlo.

---

## §0 Errata del enunciado de #95 (`feature_list.json`)

La spec usa los valores de esta sección, no los del enunciado.

| # | El enunciado dice | Verificado | Consecuencia |
|---|---|---|---|
| E1 | *"hoy router.push a estas rutas es un teleport sin transicion"* (M3) | **Caducado.** M3 es del 2026-08-24; el 2026-08-25 #mobile-tab-glass R6 (`3da2d36a`) puso `animation: 'fade'` en el `Tabs` de `(tabs)/_layout.tsx`, que aplica a todas sus rutas, ocultas incluidas. Hoy es un **fundido de pestaña**, no un teleport; sigue sin ser push/pop | R2 sigue siendo necesario; la prueba de humo pide ver la transición **de plataforma**, no "alguna" transición |
| E2 | el `paddingBottom: insets.bottom + 96`, los seis botones y el reset de #63 viven en `src/app/(tabs)/` | **Caducado.** Desde #102 (`d0df4df2`, `1d16260d`, merge `fadd0de7`) los seis routes de `(tabs)` son delgados y **todo** vive en `src/screens/<x>/index.tsx` | todas las rutas de fichero de esta spec apuntan a `src/screens/` |
| E3 | `progress/audit_ui_polish.md:125` | Cierto: la viñeta "Dar cabecera nativa a las pantallas de detalle…" sigue ahí, pero nombra **cinco** pantallas (no `pairing`) | irrelevante para el alcance: `pairing` también tiene botón a mano (`pairing-back`) |
| E4 | *"claves de copy nuevas en los dos idiomas"* | **Innecesarias.** Cuatro pantallas ya titulan con una clave de su ámbito; `docs` y `pairing` tienen encabezado propio en el cuerpo | cero claves nuevas y seis retiradas (D3, D8) |
| E5 | (#94) migrar `map.tsx` a `src/screens/` queda para #95 | **Hecho por #102**: `b5562651`, mergeado en `fadd0de7` | §Fuera de alcance, no se reabre |
| E6 | las seis pantallas de detalle | La lista es exacta **para las que tienen botón de volver a mano**. Pero `(tabs)` tiene **ocho** rutas no-pestaña: esas seis más `reminders` y `alerts`, sin botón de volver, alcanzables solo por `router.push` | `reminders` y `alerts` se quedan (deuda candidata en [[requirements]] §Fuera de alcance) |
| E7 | subir el `Redirect` a `/login` al layout raíz | Subirlo tal cual lo activaría sobre `(auth)` y `reset-password`. La guarda equivalente para las seis es `Stack.Protected` (D2); el `Redirect` de `(tabs)` se queda | decisión 2 de §Qué firma el humano |
| E8 | las aserciones de `TOUCH_SLOP` de #61 R10 | Aplican a **cinco** botones de volver, no seis: `pairing-back` nunca llevó `hitSlop` (es `size-11`, 44 pt ya) | D10 |
| E9 | borrar `.expo/types/router.d.ts` antes de tocar código | No existe en este worktree; `rm -f` es inocuo y se mantiene en [[tasks]] | — |
| E10 | subir `SelectedPetProvider` lo pone también sobre `(auth)` | Cierto, y con una consecuencia que el enunciado no nombra: la selección sobreviviría al cierre de sesión | R1 |
| E11 | `files_affected` | Se queda corto: faltan los seis `src/screens/*`, doce ficheros de test y dos specs ajenas | §Archivos afectados |

---

## §1 Sondas ejecutadas (tests desechables, borrados después)

Para no prescribir una API sobre una suposición, el spec_author corrió en
`2be1b023` tests temporales en `src/__probe95__/` (borrados; `git status`
limpio al terminar) con `renderRouter` de `expo-router/testing-library`.

| Sonda | Montaje | Resultado | Sostiene |
|---|---|---|---|
| S1 | Stack raíz con `(tabs)` y `pairing` hermanos; `push('/pairing')` y luego `push('/map')` | pila raíz `["(tabs)", "pairing", "(tabs)"]`: **segunda** instancia de `(tabs)` | R8, decisión 8 |
| S2 | ídem, `push('/pairing')` y luego `dismissTo('/map')` | pila `["(tabs)"]`, pathname `/map` | R8 |
| S3 | **layouts reales** de `2be1b023` (raíz, `(tabs)`, `(auth)`) con las rutas del árbol real sustituidas por stubs; `push('/pairing')`; `add-reminder` con contador de montajes, back y re-push | pila raíz `["(tabs)"]` tras el push (no apila) y **un solo montaje** tras volver y reentrar | rojo real de R2 |
| S4 | los mismos layouts reales; cierre de sesión en `/pairing` y seis `push` sin sesión | termina en `/login`, pero **cada push añade una entrada `(auth)`**: `["(auth)", "(auth)", …]` | rojo real de R3 |
| S5 | pantalla del Stack que renderiza `<Redirect href="/food" />` con `(tabs)` debajo | pila `["(tabs)", "(tabs)"]` | §Fuera de alcance (Redirect de "sin mascota") |
| S6 | `Stack.Protected` con guarda que pasa a `false` estando en `pairing` | `/login`, pila `["(auth)"]`: el historial protegido desaparece | R3 |
| S7 | `push('/pairing')` sin sesión desde `/login` con `Stack.Protected` | se queda en `/login`, pila `["(auth)"]` | R3 |
| S8 | `/reset-password?token=x` sin sesión | se queda en `/reset-password` | R3 |
| S9 | `Stack.Screen name="pets/[petId]/docs"` en la raíz + `push('/pets/p1/docs')` | apila `"pets/[petId]/docs"` | R2 |
| S10 | layout raíz que no monta el `Stack` hasta que resuelve una promesa (como `RootLayout` con `themeReady`) | `renderRouter` con `initialUrl` funciona igual | viabilidad de R2/R3 con el `RootLayout` real |
| S11 | **dos `it` con `renderRouter` en el mismo fichero** | el segundo `router.push` **no navega** (el store global de expo-router queda atado al primer montaje), con o sin `cleanup()` y `useRealTimers()` | **un solo `it` por fichero de navegación** (D9) |
| S12 | `renderRouter` activa fake timers (`testing-library/index.js`) | confirmado; el precedente `use-push-registration.navigation.test.tsx` restaura con `jest.useRealTimers()` en `afterEach` | D9 |
| S13 | la pila raíz en `getRouterState()` | es `routes[0].state.routes` (la entrada 0 es `__root`) | helper `rootStack` de D9 |

---

## D1 — El Stack es el raíz que ya existe; las seis rutas pasan a ser sus hijas

`src/app/_layout.tsx` ya monta `<Stack screenOptions={{ headerShown: false }} />`
con `index`, `(auth)`, `(tabs)` y `reset-password` como hijos implícitos. Las
seis rutas de detalle se mueven a la raíz de `src/app/` y pasan a ser **hermanas
de `(tabs)`** en ese mismo Stack: `router.push` desde una pestaña apila la
pantalla encima de `(tabs)`, y la pantalla tapa entera la `(tabs)`,
`FloatingTabBar` incluido.

| Hoy | Después (`git mv`) | Único cambio de contenido |
|---|---|---|
| `src/app/(tabs)/add-reminder.tsx` | `src/app/add-reminder.tsx` | `'../../screens/add-reminder'` → `'../screens/add-reminder'` |
| `src/app/(tabs)/pets/add.tsx` | `src/app/pets/add.tsx` | `'../../../screens/add-pet'` → `'../../screens/add-pet'` |
| `src/app/(tabs)/pets/[petId]/docs.tsx` | `src/app/pets/[petId]/docs.tsx` | `'../../../../screens/docs'` → `'../../../screens/docs'` |
| `src/app/(tabs)/weight-log.tsx` | `src/app/weight-log.tsx` | `'../../screens/weight-log'` → `'../screens/weight-log'` |
| `src/app/(tabs)/meal-schedule.tsx` | `src/app/meal-schedule.tsx` | `'../../screens/meal-schedule'` → `'../screens/meal-schedule'` |
| `src/app/(tabs)/pairing.tsx` | `src/app/pairing.tsx` | `'../../screens/pairing'` → `'../screens/pairing'` |

Los nombres de export (`AddReminderRoute`, `AddPetScreen` reexportado,
`DocsRoute`, `WeightLogRoute`, `MealScheduleRoute`, `PairingRoute`) no cambian.
`src/app/(tabs)/pets/` desaparece entera.

**Las URL no cambian**, porque un grupo `(…)` no aporta segmento
(`expo-router` §Route structure). Inventario de los sitios que navegan a las seis
o desde ellas, por `grep` en `src/` (fuera de tests) en `2be1b023` —
**ninguno cambia por el movimiento**:

| Desde | Llamada | Qué hace después |
|---|---|---|
| `src/screens/home/index.tsx` | `router.push('/pairing')`; `router.push(href(selectedPetId))` con `QUICK_ACTIONS` a `/weight-log`, `/add-reminder` y `` `/pets/${petId}/docs` `` | apila sobre `(tabs)` |
| `src/screens/profile/index.tsx` | `router.push('/pets/add' as Href)`, `` `/pets/${pet.id}/docs` ``, `'/pairing'` | apila |
| `src/screens/health/index.tsx` | `router.push('/weight-log')` | apila |
| `src/app/(tabs)/food.tsx` | `router.push('/meal-schedule' as Href)` | apila |
| `src/screens/reminders/index.tsx` | `router.push('/add-reminder' as Href)` | apila |
| `add-reminder`, `add-pet` (alta correcta) | `router.back()` | desapila a la pestaña de origen |
| `pairing` (`leaveReady('back')`) | `router.back()` | desapila |
| `pairing` (`leaveReady('map')`) | `router.push('/map')` | **pasa a `router.dismissTo('/map')`** por R8, no por el movimiento |
| `add-reminder`, `weight-log`, `meal-schedule` sin mascota | `<Redirect href=…>` | sin cambio (§Fuera de alcance, sonda S5) |

**Orden obligatorio dentro del commit verde de R2.** El 2026-08-25 el smoke de
#40 metió `pets/add` y `docs` **dentro** de `(tabs)` precisamente porque fuera no
tenían `SelectedPetProvider` y reventaban
(`specs/mobile-pets-profile/traceability.md` R10, `644a00c` → `5bae7b0`). El
movimiento de ficheros y la subida del provider van **en el mismo commit**;
nunca el movimiento antes.

## D2 — Guarda con `Stack.Protected`; provider en la raíz, con selección por sesión

**`RootStack`** es un componente nuevo, **no exportado**, en
`src/app/_layout.tsx`, **declarado después** de `export default function
RootLayout`: el candado de #87 R4 en `src/app/__tests__/layout.test.tsx` exige
que el primer `'<Stack '` del fichero aparezca después de `'<QueryProvider>'`, y
declararlo antes lo pone rojo. Lee `status` de `useAuth()`, `t` de
`useTranslate()` y los dos colores de `useThemeColors(['background',
'foreground'])`, y devuelve:

- `<Stack screenOptions={{ headerShown: false }}>` con, en este orden,
  `<Stack.Screen name="index" />`, `<Stack.Screen name="(tabs)" />`,
  `<Stack.Screen name="(auth)" />` y `<Stack.Screen name="reset-password" />`,
- seguidos de `<Stack.Protected guard={status === 'authenticated'}>` con los
  seis `<Stack.Screen>` de D1 en el orden de esa tabla (sus `options`, en R4).

Nunca devuelve `null`: `src/theme/__tests__/font-registration.test.ts` (R3)
asevera que `_layout.tsx` no contiene `return null`.

**Qué rutas quedan guardadas, exactamente**: las seis, y solo por esta guarda.
`(tabs)` conserva la suya (`src/app/(tabs)/_layout.tsx`: `loading → null`,
`unauthenticated → <Redirect href="/login" />`), `(auth)` la suya inversa
(`authenticated → /home`), e `index` y `reset-password` no llevan ninguna.
Por qué no se envuelve también `(tabs)` en el `Protected`: con
`status === 'loading'` la guarda es `false` y `(tabs)` desaparecería del
navegador durante el arranque; eso cambia el camino del arranque en frío por
notificación (#79 R10, cubierto por
`src/hooks/use-push-registration.navigation.test.tsx`) y el R1 de
#mobile-tabs-shell, sin ganar nada. Durante `loading` las seis tampoco están
registradas; solo importaría a un deep link en frío hacia ellas, y no hay ninguno
(§Fuera de alcance).

**Cómo se prueba** (R3), con los layouts reales montados por `renderRouter`
(D9): cierre de sesión estando en `/pairing` → `/login` y pila `["(auth)"]`
(sonda S6); seis `push` sin sesión → `/login` y la pila **no crece** (S4 y S7);
`/reset-password` sin sesión → se queda (S8).

**`SelectedPetProvider`** sale de `src/app/(tabs)/_layout.tsx` y entra en
`src/app/_layout.tsx` así:

```
<QueryProvider>
  <SelectedPetProvider>
    <PushRegistration />
    <RootStack />
  </SelectedPetProvider>
</QueryProvider>
```

Tiene que ser antepasado común de `(tabs)` y de las seis: `add-pet` llama a
`selectPet` tras el alta y la pestaña de origen tiene que verlo. Dos providers
serían dos selecciones.

**R1 — selección por sesión.** Hoy el cierre de sesión desmonta el provider con
`(tabs)` y la selección muere; en la raíz no se desmonta nunca. El provider pasa
a guardar el par `{ token, petId }` y a **derivar** la selección:

```
const { token } = useAuth();
const [selection, setSelection] = useState<{ token: string | null; petId: string | null }>({ token: null, petId: null });
const selectedPetId = selection.token === token ? selection.petId : null;
const selectPet = useCallback((id: string) => setSelection({ token, petId: id }), [token]);
```

Derivar y no sincronizar: un `useEffect` que pusiera el estado a `null` al
cambiar el token es **error** de lint (`react-hooks/set-state-in-effect`, visto
en la revisión de #63, `progress/review_mobile-detail-screens-state-reset.md`
§Hallazgos 1). El contrato público de `useSelectedPet()` no cambia.

Consecuencia en tests: todo fichero que renderiza el `SelectedPetProvider` real
ya mockea `useAuth` con un valor (verificado fichero a fichero: `screens.test`,
`food.test`, `meal-schedule`, `profile`, `weight-log`, `add-reminder`, `map`,
`home`, `pairing`, `health`, `reminders`). El único que no lo hace es
`src/providers/__tests__/selected-pet-provider.test.tsx`, que lo gana en R1. Si
algún test cambiara el `token` del doble a mitad de un `it`, la selección se
vaciaría: si aparece un rojo así, se arregla el test, no la producción.

## D3 — Cabecera nativa: opciones, títulos y botón de volver

Opciones de cada una de las seis, todas en `RootStack` (una constante local
compartida más el `title` de cada una):

```
{
  headerShown: true,
  title: <tabla de R4>,
  headerStyle: { backgroundColor: background },
  headerTintColor: foreground,
  headerTitleStyle: { fontFamily: 'Inter-Bold' },
  headerShadowVisible: false,
}
```

- **Colores**: sin `headerStyle` la cabecera toma el `DefaultTheme` de React
  Navigation (fondo blanco) también en tema oscuro, porque la app no monta
  `ThemeProvider` de navegación. Son colores imperativos, así que van vía
  `useThemeColors` (carta §Decisiones fijas 9); `'background'` ya se resuelve así
  en `src/components/pet-hero-header.tsx`.
- **Tipografía**: `'Inter-Bold'` es la familia que `useFonts` registra en el
  mismo fichero y que `global.css` expone como `--font-bold`. Sin ella el título
  sale en la fuente del sistema, distinta del resto de la app.
- **Sombra**: `headerShadowVisible: false` retira la elevación Android de la
  cabecera; la app es plana y la carta prohíbe sombras legacy en lo que dibuja el
  repo.
- **Transición**: **ninguna** clave `animation`. La carta §Animación no
  prescribe transición de navegación; la de plataforma es la que da
  `react-native-screens` por defecto (en Android, la nueva pantalla entra encima
  de la actual). El `animation: 'fade'` de `(tabs)` sigue siendo solo del cambio
  de pestaña, en su propio navegador.
- **Por qué en el layout y no dentro de cada pantalla**: el título existe desde el
  primer fotograma del push, toda la cabecera vive en un sitio y un solo test la
  enumera. Precio: `src/app/_layout.tsx` entra en la tabla de uso de copy (D8).

**Títulos.** Cuatro pantallas reutilizan la clave que ya pintaban como `Text`
grande (`text-2xl font-black`) en su cuerpo: el título de la pantalla **es** esa
clave, y duplicarla contradiría D1–D2 de `specs/mobile-ui-language/design.md`
(ámbito por pantalla, una clave por significado). Ese `Text` se va del cuerpo
(R5): la carta dice *"Títulos de pantalla: header del stack cuando exista, no
Text suelto"* (`docs/ui-guidelines.md` §Micro-reglas, `52dcb521`).

`docs` y `pairing` llevan **`title: ''` explícito** —sin él la cabecera pintaría
el nombre de la ruta (`pets/[petId]/docs`)— y conservan su encabezado del
cuerpo, porque no es un título de pantalla suelto:

- `docs` pinta "Documentos de / <mascota>", con `docs-header-skeleton` mientras
  carga: es la identidad de la mascota (un dato), no un rótulo fijo.
- `pairing` pinta tres encabezados de estado firmados por #42 ("Vincular
  collar", "Dispositivo GPS", "El collar está listo"). Un título fijo en la
  cabecera duplicaría "Dispositivo GPS" en el estado vinculado.

La alternativa —claves nuevas `docs.title` y `pairing.title`— queda como
pregunta del gate.

**Botón de volver: el nativo.** Su objetivo táctil de 48 dp lo garantiza la
barra de Android, así que las cinco aserciones de `TOUCH_SLOP` de #61 R10 sobre
botones de volver pierden su sujeto (D10). Su nombre accesible lo pone la
plataforma en el idioma del sistema: `native-stack` no ofrece opción para
fijarlo en Android (solo `headerBackTitle`, que es de iOS). Se acepta
(decisión 5 de §Qué firma el humano).

## D4 — Métricas, una por una

Cada una de las seis tiene **exactamente un** `contentContainerStyle` con
`paddingTop: insets.top + 12` y `paddingBottom: insets.bottom + 96`, y **un**
`useSafeAreaInsets` (contado en `2be1b023`; ninguna rama de estado lleva su
propio `ScrollView`).

| Pantalla | Fichero (componente) | Antes | Después |
|---|---|---|---|
| add-reminder | `src/screens/add-reminder/index.tsx` (`AddReminderContent`) | `padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96` | `padding: 24, gap: 16, paddingBottom: insets.bottom + 24` |
| add-pet | `src/screens/add-pet/index.tsx` (`AddPetScreen`) | ídem | ídem |
| docs | `src/screens/docs/index.tsx` (`DocsScreen`) | ídem | ídem |
| weight-log | `src/screens/weight-log/index.tsx` (`WeightLogContent`) | ídem | ídem |
| meal-schedule | `src/screens/meal-schedule/index.tsx` (`MealScheduleContent`) | ídem | ídem |
| pairing | `src/screens/pairing/index.tsx` (`PairingScreen`) | ídem | ídem |

`useSafeAreaInsets` se queda: el inset inferior sigue haciendo falta, porque la
barra de navegación del sistema no la consume la cabecera. Con el doble de insets
de los tests (`top: 40, bottom: 24`, presente en los seis ficheros de test) el
valor esperado es `{ padding: 24, gap: 16, paddingBottom: 48 }`.

Por qué nada de `paddingTop`: con cabecera opaca el contenido empieza **debajo**
de ella, pero `useSafeAreaInsets()` sigue devolviendo el inset del dispositivo;
sumarlo dejaría una banda vacía bajo la cabecera. `padding: 24` ya da el aire
superior. Por qué `+ 24` abajo: la barra de navegación del sistema sigue ahí
(edge-to-edge), y 24 es la holgura que ya usan `(auth)` y `reset-password`.

## D5 — Qué se retira de cada pantalla (R5), elemento por elemento

| Pantalla | Nodo que se retira | Imports y variables que quedan huérfanos y se borran | Lo que se queda |
|---|---|---|---|
| add-reminder | la fila `View className="flex-row items-center gap-3"` entera: `Pressable testID="add-reminder-back"` (con `accessibilityLabel={t('addReminder.backToReminders')}`, `hitSlop={TOUCH_SLOP}` y `ArrowLeft`) y el `Text` de `t('addReminder.addReminder')` | `import { ArrowLeft } from 'reicon-react-native'`; `foreground` de `useThemeColors` → `const [muted] = useThemeColors(['muted'])` | `router` (alta correcta), `Pressable` y `TOUCH_SLOP` (chips) |
| add-pet | la fila de cabecera: `Pressable testID="add-pet-back"` y el `Text` de `t('addPet.addPet')` | `ArrowLeft`; `const [muted] = useThemeColors(['muted'])` | `router`, `Pressable`, `TOUCH_SLOP` |
| docs | el `Pressable testID="docs-back"`; la fila `flex-row items-center gap-3` desaparece y su columna pasa a ser el primer hijo del `ScrollView` con `className="gap-1"` (sin `flex-1`, que en la columna del scroll no aporta y puede colapsarla) | `import { router } from 'expo-router'` entero; `Pressable` del import de `react-native`; `ArrowLeft`; `TOUCH_SLOP`; `useThemeColors` y su llamada | el eyebrow `t('docs.documentsOf')`, el nombre `petName ?? t('docs.pet')` y `docs-header-skeleton` |
| weight-log | la fila de cabecera: `Pressable testID="weight-log-back"` y el `Text` de `t('weightLog.weightLog')` | `router` del import de `expo-router`; `Pressable`; `ArrowLeft` de la lista de `reicon-react-native`; `TOUCH_SLOP`; `'foreground'` y su variable → `[success, danger, muted]` | `Redirect` |
| meal-schedule | la fila de cabecera: `Pressable testID="meal-schedule-back"` y el `Text` de `t('mealSchedule.mealSchedule')` | `router`; `Pressable`; `ArrowLeft` de la lista; `TOUCH_SLOP`; `'foreground'` y su variable → `[accent, accentForeground]` | `Redirect` |
| pairing | el `Pressable testID="pairing-back"`, primer hijo del `ScrollView` | `import { ArrowLeft } from 'reicon-react-native'`; `useThemeColors` y `const [foreground] = …` | `router` (`leaveReady`), `Pressable` (se usa más abajo) y los tres encabezados de estado |

`useFocusEffect` y `useCallback` **no** se tocan en R5: los retira R7 (D6). Todo
lo anterior lo delata `bunx expo lint` con una línea de warning
(`@typescript-eslint/no-unused-vars` es `warn`), y por eso [[requirements]] pide
salida **vacía**, no solo exit 0.

## D6 — Retirada del reset de #63 (R7), y el punto 1 de su D3 revisitado

Con el Stack, perder el foco en las seis es desmontarlas (montaje nuevo al
reentrar, candado en R2); ninguna empuja otra pantalla encima, y `pairing` sale
al mapa con `dismissTo`, que también la desmonta. El `useFocusEffect` de #63 es
redundante y se borra:

| Fichero | Se borra | Imports que quedan huérfanos |
|---|---|---|
| `src/screens/add-reminder/index.tsx` | el `useFocusEffect(useCallback(() => () => { setType('vaccine'); … }, []))` | `useFocusEffect` (de `expo-router`), `useCallback` (de `react`) |
| `src/screens/add-pet/index.tsx` | ídem | ídem |
| `src/screens/weight-log/index.tsx` | ídem (`setWeightText('')`, `setMeasuredAtDraft(null)`, …) | ídem |
| `src/screens/meal-schedule/index.tsx` | `useFocusEffect(useCallback(() => () => setGenerateError(null), []))` | ídem |
| `src/screens/pairing/index.tsx` | **solo** el tercer `useFocusEffect`, el de `() => () => resetPairingState()` | ninguno: siguen los dos de refetch y el `useEffect` de #63 R6 |

**El punto 1 de D3 de #63, revisitado como pidió su reviewer.** El `useEffect`
de #63 R6, con su `eslint-disable-next-line react-hooks/set-state-in-effect`,
**se conserva** tal cual. R6 es un cambio *dentro* de la pantalla (el
`PetSwitcher` de la propia `pairing`), no de navegación, así que el Stack no lo
cubre; y cambiarlo por el patrón de "ajustar estado durante el render" es un
refactor ortogonal con riesgo propio que esta feature no necesita. La supresión
es mínima, nominal y motivada, como juzgó aquella revisión.

**Caso límite aceptado (decisión 7).** Hoy, salir durante un envío en vuelo deja
la instancia montada con `submitting = true`, y reentrar no permite reenviar
(#63 R7). Con el Stack, salir desmonta; reentrar monta una instancia con
`submitting = false`, así que pulsar volver *durante* la petición, reentrar y
volver a enviar puede duplicar el POST. Pide tres gestos dentro de la ventana de
una petición. No se añade `usePreventRemove` ni `gestureEnabled: false`: sería
bloquear la salida para proteger un caso que el usuario no provoca por accidente.

## D7 — `pairing` sale al mapa con `dismissTo` (R8), y lo que no se cambia

`leaveReady('map')` pasa de `router.push('/map')` a `router.dismissTo('/map')`
(sondas S1 y S2). El resto de `leaveReady` no cambia: sigue poniendo
`phase = 'idle'` y `readyDevice = null` antes de navegar, que es lo que asevera
#42 R7.

**No se cambia** el `router.push('/alerts')` de
`src/hooks/use-push-registration.ts`. Tocar una notificación estando en una
pantalla de detalle apila una segunda `(tabs)` enfocada en `alerts` encima de la
pantalla (mismo mecanismo que S1), y atrás vuelve a la pantalla de detalle, lo
que es defendible como "push". Cambiarlo por `dismissTo` tiraría el formulario a
medio llenar. #100 cambiará el destino del toque a una pantalla de detalle de
alerta que nacerá en el Stack: ese es el momento de revisarlo.

## D8 — Copy: cero claves nuevas, seis retiradas

- **Se retiran** de `en` y `es` en `src/i18n/catalog.ts`:
  `weightLog.backToHealth`, `mealSchedule.backToFood`, `docs.backToProfile`,
  `addReminder.backToReminders`, `addPet.backToProfile` y `pairing.back`. En
  `src/providers/__tests__/language-provider.test.tsx`, dentro del `describe`
  `#65 R12`, la suma `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4` gana ` - 6` al final
  y su comentario "− 6 de #95 R5 (las seis claves de volver)". **Candado
  compartido**: ver §Coordinación.
- **`src/__tests__/ui-copy-table.ts`** (tabla normativa de usos de #65). Filas que
  entran en R4, todas con `file: 'src/app/_layout.tsx'`: `weightLog.weightLog` en
  `R5_HEALTH`, `mealSchedule.mealSchedule` en `R6_FOOD`, `addReminder.addReminder`
  en `R8_REMINDERS` y `addPet.addPet` en `R9_ADD_PET`. Filas que salen en R5: las
  seis de las claves retiradas y las cuatro de esos mismos títulos con su fichero
  de pantalla. En `src/__tests__/ui-language.test.ts`:

  | `toHaveLength` | `2be1b023` | tras R4 | tras R5 | título del `it` (se actualiza en R5) |
  |---|---|---|---|---|
  | `R5_HEALTH` | `32 + 1` | `+ 1` | `- 2` | "33" → "32" |
  | `R6_FOOD` | `35 + 3` | `+ 1` | `- 2` | "38" → "37" |
  | `R7_PROFILE` | `35` | — | `- 1` | "35" → "34" |
  | `R8_REMINDERS` | `50` | `+ 1` | `- 2` | "50" → "49" |
  | `R9_ADD_PET` | `42` | `+ 1` | `- 2` | "42" → "41" |
  | `R10_PAIRING` | `42 + 2 + 1 + 4` | — | `- 1` | sin número |
  | `SCREEN_FILES` | `19 + 2 + 1` | `+ 1` (`src/app/_layout.tsx` entra en el escaneo de copy literal) | — | — |

  Cada sumando nuevo lleva su comentario `// #95 R4` o `// #95 R5`.
- **`specs/mobile-ui-language/design.md` §2** (registro normativo): las seis filas
  de las claves retiradas ganan el sufijo `← retirada por #95 (R5)` y las cuatro
  de los títulos, `← se pinta desde src/app/_layout.tsx por #95 (R4)`. No entra
  ninguna fila nueva.

## D9 — Plan de tests, fichero por fichero

**Ficheros nuevos**, los tres en `src/app/__tests__/` (el directorio ya contiene
tests, y el helper de abajo salta `__tests__` al recorrer rutas):

1. **`detail-stack.test.tsx`** — sin `renderRouter`, solo `fs`:
   - `describe('#95 R2: las seis rutas de detalle viven en la raíz de src/app')`:
     `it.each` de seis filas `[ruta nueva, ruta vieja, import esperado]` (existe
     la nueva, no existe la vieja y el fuente contiene `from '<import esperado>'`,
     tabla de D1), más un `it` que asevera que el listado ordenado de
     `src/app/(tabs)/` es exactamente `['__tests__', '_layout.tsx', 'alerts.tsx',
     'food.tsx', 'health.tsx', 'home.tsx', 'map.tsx', 'profile.tsx',
     'reminders.tsx']` (cardinalidad por hijos, no por patrón). **7 tests.**
   - `describe('#95 R7: el reset de #63 queda solo donde no lo cubre el Stack')`:
     `it.each` de cinco ficheros: los cuatro sin `useFocusEffect` en el fuente, y
     `pairing` con `source.match(/useFocusEffect\(/g)` de longitud **2** y
     conteniendo `}, [resetPairingState, selectedPetId]);`. **5 tests.**
2. **`detail-stack.navigation.test.tsx`** — **un solo `it`** (sonda S11), en
   `describe('#95 R2: push y back apilan y desapilan sobre (tabs)')`. **1 test.**
3. **`detail-stack.guard.test.tsx`** — **un solo `it`**, en
   `describe('#95 R3: la guarda protege las seis y deja libres (auth) y reset-password')`.
   **1 test.**

**Montaje común de 2 y 3** (intención, verificada en S3 y S4 con los layouts
reales; cada doble se escribe contra el fichero destino, no se copia de otra
suite):

- **Árbol de rutas desde el árbol real**: un helper recorre `src/app` con
  `readdirSync` (vía `jest.requireActual('fs')`, como `layout.test.tsx`),
  **salta** los directorios `__tests__` y devuelve las claves sin extensión
  (`'(tabs)/home'`, `'pets/[petId]/docs'`, `'index'`…). A `_layout`,
  `(tabs)/_layout` y `(auth)/_layout` les asigna el **default real**, importado
  estáticamente (`../_layout`, `../(tabs)/_layout`, `../(auth)/_layout`); si
  aparece cualquier otro `_layout`, el helper lanza, para que un layout nuevo no
  se sustituya en silencio. Al resto de claves les asigna un stub que pinta un
  `Text`; a la de `add-reminder` (esté en el grupo que esté), un stub que cuenta
  montajes con un inicializador perezoso de `useState`. Así el test lee **dónde
  están de verdad** los ficheros, y por eso en `2be1b023` es rojo.
- **Dobles**: `standard-navigation` → `{}` (como el precedente); `expo-font` →
  `useFonts` que devuelve `[true]`; `../../utils/theme-preference` y
  `../../utils/language-preference` → getters que resuelven `undefined` (más
  `setStoredLanguage`, que importa `LanguageProvider`); `heroui-native` →
  `HeroUINativeProvider` que pasa los hijos; `react-native-gesture-handler` →
  `GestureHandlerRootView` que pasa los hijos; `../../hooks/use-push-registration`
  → `usePushRegistration: jest.fn()`; `../../components/floating-tab-bar` →
  `FloatingTabBar` que no pinta nada. `LanguageProvider`, `QueryProvider`,
  `SelectedPetProvider` y los tres layouts son **reales**.
- **`useAuth` controlable**: el doble de `../../providers/auth-provider` expone
  un `AuthProvider` que pasa los hijos y un `useAuth` que lee un store del test
  con `useSyncExternalStore` (obtenido con `jest.requireActual('react')` dentro de
  la factoría; las variables del store se llaman `mock…` para que `jest.mock` las
  admita), de modo que se pueda pasar de `authenticated` a `unauthenticated` a
  mitad del `it` y forzar el re-render (S6).
- **Helper `rootStack(app)`** =
  `app.getRouterState().routes[0].state.routes.map((r) => r.name)` (S13).
- Cada navegación es `await act(async () => router.<acción>(…))` seguida de
  `await waitFor(…)` sobre `app.getPathname()`. Tras un push que **no** debe
  navegar (R3), vaciar temporizadores pendientes dentro de `act`
  (`jest.runOnlyPendingTimers()`, tres pasadas) antes de aseverar, porque
  `renderRouter` activa fake timers (S12). `afterEach(() => jest.useRealTimers())`.

**El `it` de R2**: `initialUrl: '/home'`; pila `["(tabs)"]`. Para cada una de
las seis `[href, nombre]` —`['/add-reminder', 'add-reminder']`,
`['/pets/add', 'pets/add']`, `['/pets/pet-1/docs', 'pets/[petId]/docs']`,
`['/weight-log', 'weight-log']`, `['/meal-schedule', 'meal-schedule']` y
`['/pairing', 'pairing']`— `push` → pathname `href` y pila `["(tabs)", nombre]`;
`back` → `/home` y `["(tabs)"]`. Después: contador de `add-reminder` = 1; un
`push('/add-reminder')` más → contador = 2; `back`. Por último `push('/pairing')`
y `dismissTo('/map')` → `/map` y `["(tabs)"]`.

**El `it` de R3**: `initialUrl: '/home'`, autenticado; `push('/pairing')`; pasar
el store a `unauthenticated` con `token: null` → `/login` y `["(auth)"]`. Para
cada `href` de las seis, `push` → sigue en `/login` y la pila **sigue siendo**
`["(auth)"]`. Por último `push('/reset-password?token=abc')` →
`/reset-password` y `["(auth)", "reset-password"]`.

**`src/app/__tests__/layout.test.tsx`** (+8):

- El doble de `expo-router` pasa a exponer `Stack` como `jest.fn` que conserva la
  conducta actual (`root-stack` o `QueryStack`) y que lleva `Stack.Screen` y
  `Stack.Protected` como estáticos `jest.fn(() => null)`. No pinta sus hijos: el
  test **inspecciona los elementos** de `props.children` de la última llamada
  (`Children.toArray`), sin renderizarlos.
- El doble de `../../providers/language-provider` añade
  `useTranslate: () => (key) => \`t:${key}\``, y se añade un doble de
  `../../theme/use-theme-colors` que devuelve `token:<nombre>` por token (el doble
  de `uniwind` de este fichero no trae `useUniwind`).
- `describe('#95 R2: el layout raíz monta el provider y el Stack de detalle')`:
  (a) orden en el fuente: `<QueryProvider>` < `<SelectedPetProvider>` <
  `<PushRegistration />` < `<RootStack />` < `</SelectedPetProvider>` <
  `</QueryProvider>`, y `function RootStack` después de
  `export default function RootLayout`; (b) hijos de `Stack`: `screenOptions`
  igual a `{ headerShown: false }`, **cinco** hijos, los cuatro primeros
  `Stack.Screen` con nombres `index`, `(tabs)`, `(auth)` y `reset-password` y sin
  `options`, y el quinto `Stack.Protected` con `guard === true` y **seis** hijos
  `Stack.Screen` con los nombres de D1 en orden. **2 tests.**
- `describe('#95 R4: cada pantalla de detalle declara su cabecera nativa')`:
  `it.each` de seis filas `[name, title]` con `t:<clave>` o `''`; `options`
  `toEqual` el objeto de D3 con `backgroundColor: 'token:background'` y
  `headerTintColor: 'token:foreground'`. **6 tests.**

**Reparto del delta** (base `2be1b023` → cierre):

| Fichero | Base | Cierre | Δ |
|---|---:|---:|---:|
| `src/app/__tests__/detail-stack.test.tsx` (nuevo) | — | 12 | +12 |
| `src/app/__tests__/detail-stack.navigation.test.tsx` (nuevo) | — | 1 | +1 |
| `src/app/__tests__/detail-stack.guard.test.tsx` (nuevo) | — | 1 | +1 |
| `src/app/__tests__/layout.test.tsx` | 7 | 15 | +8 |
| `src/providers/__tests__/selected-pet-provider.test.tsx` | 2 | 3 | +1 |
| `src/providers/__tests__/language-provider.test.tsx` | 8 | 9 | +1 |
| `src/screens/add-reminder/index.test.tsx` | 23 | 21 | −2 (−2 #63, −1 #61, +1 R5) |
| `src/screens/add-pet/index.test.tsx` | 20 | 20 | 0 (−1 #63, −1 #61, +1 R5, +1 R6) |
| `src/screens/docs/index.test.tsx` | 13 | 13 | 0 (−1 volver, −1 #61, +1 R5, +1 R6) |
| `src/screens/weight-log/index.test.tsx` | 32 | 31 | −1 (−1 #63, −1 #61, +1 R5) |
| `src/screens/meal-schedule/index.test.tsx` | 23 | 22 | −1 (−1 #63, −1 #61, +1 R5) |
| `src/screens/pairing/index.test.tsx` | 54 | 52 | −2 (−3 #63, −1 volver, +1 R5, +1 R8) |
| `src/__tests__/consistency-classnames.test.ts` | 57 | 53 | −4 (#62 R7) |
| `src/__tests__/design-drift.test.ts` | 55 | 55 | 0 (−1 métrica, +1 R6) |
| **Total** | **1412** | **1426** | **+14** (suites 77 → 80) |

## D10 — Inventario de aserciones heredadas que cambian

Tests de **otras specs** que esta feature modifica o borra porque su premisa deja
de ser cierta. Ningún cambio de esta tabla es "arreglar un test para que pase":
cada fila dice qué hecho cambió y qué R lo cambia.

| # | Fichero › `describe` › `it` | Spec dueña | Cambio | R |
|---|---|---|---|---|
| 1 | `src/app/(tabs)/__tests__/layout.test.tsx` › `R1: (tabs) exige sesión` › `wraps authenticated tabs in the shared selected pet provider` | mobile-tabs-shell | se invierte: `mockSelectedPetProvider` **no** se llama; `it` → `'ya no monta SelectedPetProvider: lo aporta el layout raíz (#95 R2)'` | R2 |
| 2 | ídem › `R10: las rutas de mascotas heredan SelectedPetProvider` › `mantiene AddPet y Docs dentro del grupo (tabs)` | mobile-pets-profile | imports a `'../../pets/add'` y `'../../pets/[petId]/docs'`; `it` → `'resuelve AddPet y Docs como rutas del Stack raíz'`. El `describe` no cambia: es el ancla de su trazabilidad | R2 |
| 3 | `src/app/__tests__/tabs-layout.test.tsx` | mobile-tab-glass | se borra el `jest.mock` de `selected-pet-provider`, que queda muerto | R2 |
| 4 | `src/screens/pairing/index.test.tsx`: import de `PairingRoute` | mobile-device-pairing | `'../../app/(tabs)/pairing'` → `'../../app/pairing'` | R2 |
| 5 | ídem › `R4: /pairing monta dentro de (tabs) con selector de mascota y estados de carga` | mobile-device-pairing | `describe` → `'R4: /pairing monta en el Stack raíz con selector de mascota y estados de carga'` (A12), y la fila R4 de `specs/mobile-device-pairing/traceability.md` se actualiza al título nuevo | R2 |
| 6 | `src/screens/home/index.test.tsx` › `#71 R1: la Home dibuja la rejilla de accesos rápidos` › `no apunta a ninguna ruta inexistente` | mobile-home-quick-actions | el helper `appRoutes` deja de añadir al prefijo los directorios de grupo (`/^\(.*\)$/`) y esta llamada pasa a `join(process.cwd(), 'src/app')`; las otras dos llamadas (`/alerts`, `/reminders`) siguen sobre `(tabs)` y no cambian | R2 |
| 7 | `src/screens/pairing/index.test.tsx` › `R4 …` › `goes back from the screen header` | mobile-device-pairing | se borra | R5 |
| 8 | `src/screens/docs/index.test.tsx` › `R8: pantalla Docs` › `navigates back from the header` | mobile-pets-profile | se borra, junto con el `jest.mock('expo-router')` y los imports de `router` y `TOUCH_SLOP`, que quedan muertos | R5 |
| 9 | `add-reminder` › `R8: formulario de alta con chips y pickers` › `uses uniform metrics and navigates back` | mobile-reminders | R5: fuera el `getByText('Agregar recordatorio')` y la pulsación de `add-reminder-back`; R6: `toEqual({ padding: 24, gap: 16, paddingBottom: 48 })`; `it` → `'uses the metrics under the native header (#95 R6)'` | R5, R6 |
| 10 | `weight-log` › `R7: weight log lista el historial` › `shows loading, safe padding, and navigates back` | mobile-health | R5: fuera `getByText('Registro de peso')` y la pulsación; R6: `toEqual` exacto; `it` → `'shows loading and the metrics under the native header (#95 R6)'` | R5, R6 |
| 11 | ídem › `R5 (mobile-design-drift): aplica el safe area superior al contenido` | mobile-design-drift | `expect(style).not.toHaveProperty('paddingTop')`; `it` → `'R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa'`; se actualiza la fila R5 de `specs/mobile-design-drift/traceability.md` (mitad weight-log) | R6 |
| 12 | `meal-schedule` › `R7: meal schedule muestra horarios y perfil` › `shows loading, safe padding, and navigates back` | mobile-food | R5: fuera `getByText('Horario de comidas')` y la pulsación; R6: `toEqual` exacto; `it` → `'shows loading and the metrics under the native header (#95 R6)'` | R5, R6 |
| 13 | `meal-schedule`: doble de `reicon-react-native` | — | se borra la entrada `ArrowLeft` | R5 |
| 14 | `pairing` › `R4 …` › `renders the real route with uniform metrics and a dimensioned skeleton` | mobile-device-pairing | `toEqual({ padding: 24, gap: 16, paddingBottom: 48 })`; el `it` gana el sufijo ` (#95 R6)` | R6 |
| 15 | `#61 R10: los controles táctiles declaran TOUCH_SLOP` en `meal-schedule`, `weight-log` y `docs` (un `it` en cada uno: el del botón de volver) | mobile-ui-legibility-polish | se borran los tres `describe` | R5 |
| 16 | ídem en `add-pet` y `add-reminder` (`it.each`) | mobile-ui-legibility-polish | se quitan `'add-pet-back'` y `'add-reminder-back'` de sus listas; el resto de casos no cambia | R5 |
| 17 | `src/__tests__/consistency-classnames.test.ts` › `#62 R7: ningún glifo tipográfico hace de icono` › `it.each(backScreens)('%s usa ArrowLeft de reicon')` | mobile-ui-consistency-polish | se borran `backScreens` y ese `it.each` (4 casos); los otros dos `it` del `describe` no cambian | R5 |
| 18 | `src/__tests__/design-drift.test.ts` › `R11 (mobile-device-pairing): …` › `keeps the uniform screen metric %s` | mobile-device-pairing | la lista pasa a `['padding: 24', 'gap: 16', 'insets.bottom + 24']`, y el `describe` gana `it('#95 R6: pairing no reserva el inset superior ni la banda del FloatingTabBar')` con `not.toContain('insets.top + 12')` y `not.toContain('insets.bottom + 96')` (A12) | R6 |
| 19 | `pairing` › `R7: tras el 201 muestra "El collar está listo"…` › `resets ready and opens the map from the primary CTA` | mobile-device-pairing | `expect(mockRouter.dismissTo).toHaveBeenCalledWith('/map')` en lugar de `push`; el doble de `expo-router` gana `dismissTo: jest.fn()` | R8 |
| 20 | `add-reminder` › `R1: el formulario vuelve a sus valores iniciales al perder el foco` y `R7: el guarda de envío sobrevive al blur`; `add-pet` › `R2: …`; `weight-log` › `R3: …` (con el sufijo `#90 R3`); `meal-schedule` › `R4: …`; `pairing` › `R5: …` (dos `it`) y `R7: …` | mobile-detail-screens-state-reset (#63) | se borran los ocho `it`, más los dobles de `useFocusEffect`, sus helpers de blur y los `act` que queden sin uso en los cuatro ficheros que ya no los necesitan. En `pairing` el doble de `useFocusEffect` **se queda** (lo usan los tests de refetch de #42 y #87). Las filas R1–R5 y R7 de `specs/mobile-detail-screens-state-reset/traceability.md` y la fila correspondiente de `specs/mobile-owner-timezone-dates/traceability.md` ganan `← retirado por #95 (R7, C7)` | R7 |
| 21 | `src/__tests__/ui-language.test.ts` y `ui-copy-table.ts` | mobile-ui-language (#65) | tabla de D8 | R4, R5 |
| 22 | `language-provider.test.tsx` › `#65 R12` | mobile-ui-language | ` - 6` en la suma (D8) | R5 |

Las filas de trazabilidad de #61 R10 (13 casos) y #62 R7 (12 casos) ganan una
nota con los casos retirados por #95 R5 (5 y 4).

## Archivos afectados

Capa: **infraestructura / UI móvil** (`mobile-pet-tracker/`). Ningún fichero de
backend, infra ni CI.

**Producción**

- `src/app/_layout.tsx` — `SelectedPetProvider`, `RootStack` con
  `Stack.Protected` y cabeceras (R2, R4).
- `src/app/(tabs)/_layout.tsx` — sale `SelectedPetProvider` (R2).
- `src/app/add-reminder.tsx`, `src/app/pets/add.tsx`,
  `src/app/pets/[petId]/docs.tsx`, `src/app/weight-log.tsx`,
  `src/app/meal-schedule.tsx`, `src/app/pairing.tsx` — movidos desde `(tabs)` (R2).
- `src/providers/selected-pet-provider.tsx` — selección por sesión (R1).
- `src/screens/{add-reminder,add-pet,docs,weight-log,meal-schedule,pairing}/index.tsx`
  — cabecera a mano fuera (R5), métricas (R6), reset de #63 fuera en cinco (R7) y
  `dismissTo` en `pairing` (R8).
- `src/i18n/catalog.ts` — seis claves fuera (R5).

**Tests**: los tres nuevos de D9 más `src/app/__tests__/layout.test.tsx`,
`src/app/__tests__/tabs-layout.test.tsx`,
`src/app/(tabs)/__tests__/layout.test.tsx`,
`src/providers/__tests__/selected-pet-provider.test.tsx`,
`src/providers/__tests__/language-provider.test.tsx`,
`src/screens/{add-reminder,add-pet,docs,weight-log,meal-schedule,pairing}/index.test.tsx`,
`src/screens/home/index.test.tsx`, `src/__tests__/consistency-classnames.test.ts`,
`src/__tests__/design-drift.test.ts`, `src/__tests__/ui-copy-table.ts` y
`src/__tests__/ui-language.test.ts`.

**Docs y specs**: `docs/conventions.md` y `docs/ui-guidelines.md` (A11, R6);
`specs/mobile-device-pairing/design.md` (A12, ya escrita) y su `traceability.md`
(fila R4); `specs/mobile-ui-language/design.md` §2 (D8); y notas de trazabilidad
en `specs/mobile-detail-screens-state-reset/`, `specs/mobile-owner-timezone-dates/`,
`specs/mobile-design-drift/`, `specs/mobile-ui-legibility-polish/` y
`specs/mobile-ui-consistency-polish/`.

**No se toca**: `src/components/floating-tab-bar.tsx`,
`src/hooks/use-push-registration.ts`, `src/hooks/use-pet-selection.ts`,
`src/app/(tabs)/food.tsx`, `src/screens/reminders/`, `src/screens/alerts/`,
`src/theme/`, `app.json`, `app.config.ts` ni `package.json`.

## Coordinación con otras sesiones

- **El candado de longitud del catálogo** (`language-provider.test.tsx`, suma del
  `describe` `#65 R12`) y la tabla `ui-copy-table.ts` son **ficheros
  compartidos**. La futura **#113** de Backend (mitad móvil de #104) también
  añadirá claves. Quien mergee segundo recalcula sobre la suma del primero, y los
  deltas de cada feature (`- 6` aquí) se conservan como sumandos con su
  comentario.
- **#112 `mobile-reminders-see-all-source-lock-nesting`** toca
  `src/screens/home/index.test.tsx`, el mismo fichero que la fila 6 de D10, en
  zonas distintas (el helper `appRoutes` frente al candado de
  `reminders-see-all`).
- **#103 `meal-schedule-editing`** (pendiente) cita un fichero que ya no es el
  cuerpo de la pantalla ([[requirements]] §Fuera de alcance, deuda).
- **#100** debe nacer dentro del `Stack.Protected` de `RootStack`.
- **#104 / #113** tocan `src/app/(tabs)/food.tsx`, que esta feature no toca.
- Ninguna feature está `in_progress` en `feature_list.json` en `2be1b023`.

## Alternativas descartadas

- **Grupo `(app)/` que envuelva `(tabs)` y las seis**, con guarda y provider en su
  `_layout`: es el patrón clásico de autenticación de Expo Router y no pondría
  nada sobre `(auth)`, pero mueve `(tabs)` entera. Solo en tests eso son 44
  referencias literales a `(tabs)` en diez ficheros —candados de #62, #65, #68,
  #87, #94, #102 y #108 entre ellos— más un `../` en cada uno de los trece routes.
  Mucho diff para ninguna conducta, cuando la selección por sesión (R1) cuesta
  cinco líneas.
- **Grupo `(detail)/` solo para las seis, con su propio `Stack`**: el provider
  tendría que seguir siendo antepasado común de `(tabs)` y `(detail)`, o sea
  raíz, así que no ahorra R1; y añade un navegador anidado y un segundo guard.
- **Título dentro de cada pantalla** (`<Stack.Screen options={{ title }} />` en el
  componente): el título llega tras el primer render, reparte la cabecera en seis
  ficheros y obliga a doblar `Stack` en seis suites.
- **API de composición** (`Stack.Title`, `Stack.Header`): alfa desde SDK 55.
- **`headerLeft` propio para conservar los seis botones y sus `testID`**:
  descarta la cabecera nativa, que es el objetivo.
- **Animación propia** (`slide_from_right`, o M3 con `FadeIn`): la carta no la
  pide y la de plataforma es la que el usuario espera.
- **`Stack.Protected` también sobre `(tabs)`**: D2.
- **`router.dismissTo('/alerts')` en el toque de notificación**: D7.
- **`usePreventRemove` durante un envío**: D6.
