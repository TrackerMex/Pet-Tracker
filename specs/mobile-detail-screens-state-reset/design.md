---
feature: "mobile-detail-screens-state-reset"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-detail-screens-state-reset]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil y
> [[../../docs/architecture|architecture]] para las capas.
>
> Todo lo que sigue se verificó **contra el árbol en `f50b4203`**, no contra el
> enunciado. Las derivas encontradas están anotadas en §Errata del enunciado.

## Skills cargadas

`expo:expo-overview` → `expo:expo-router` (la decisión central es de routing),
como manda `docs/ui-guidelines.md` §Skills. El handoff a Codex debe pedirle las
mismas (`codex plugin add expo@openai-curated`, ya instalado).

---

## D1 — Vía elegida: **reset local en la pérdida de foco**, no Stack

**Decisión**: se resetea el estado local de cada pantalla cuando pierde el foco
de navegación. **No** se saca ninguna ruta de `src/app/(tabs)/` a un Stack.

### Por qué no el Stack (todavía)

El Stack es la vía de fondo correcta y sigue apuntada como deuda
([[requirements]] §Deuda), pero su coste real —medido sobre el árbol, no
estimado— es desproporcionado para cerrar un formulario que no se vacía:

1. **Arrastra el guard de autenticación y el provider de mascota.** El
   `Redirect href="/login"` y el `SelectedPetProvider` viven en
   `src/app/(tabs)/_layout.tsx:14-32`. Fuera de `(tabs)` hay que subirlos a
   `src/app/_layout.tsx`, donde quedan también sobre `(auth)/login`,
   `(auth)/register`, `(auth)/forgot` y `reset-password`. Eso cambia el árbol de
   providers de toda la app y toca al menos
   `src/app/__tests__/layout.test.tsx`, `src/app/__tests__/tabs-layout.test.tsx`
   y `src/app/(tabs)/__tests__/layout.test.tsx`.
2. **Revierte una decisión aprobada de otra feature.**
   `specs/mobile-device-pairing/design.md` §D4 metió `/pairing` bajo `(tabs)`
   con este argumento textual: *"dentro de `(tabs)` la ruta hereda el `Redirect`
   a `/login` y el `SelectedPetProvider` de `_layout.tsx`, y el
   `FloatingTabBar` la ignora (solo pinta `TABS`)"*. Revertirla es cambio de
   spec ajena y pide su propio gate humano.
3. **Rompe la métrica de fondo de las seis pantallas.** Las seis llevan
   `paddingBottom: insets.bottom + 96` (`docs/conventions.md` §Dimensiones):
   esos 96 px existen porque el `FloatingTabBar` flota encima. Una pantalla
   empujada sobre un Stack ya no lo tiene debajo, y el hueco queda como banda
   muerta visible en el smoke.
4. **Arrastra la cabecera.** Con Stack nativo lo coherente es `headerShown:
   true` y retirar los seis botones de volver a mano; eso toca seis `testID`
   asertados hoy (`add-reminder-back`… ), las pruebas de `TOUCH_SLOP` de #61
   R10, y pide claves de copy nuevas en los dos idiomas — con el candado de
   longitud de catálogo (`language-provider.test.tsx:55`) de por medio.
5. **Y aun así no cubre `/pairing` por sí solo**: R6 (reset al cambiar de
   mascota) es un cambio *dentro* de la pantalla, no de navegación. El
   `PetSwitcher` está en la propia `PairingScreen` y cambiar de mascota no
   desmonta nada, viva la ruta donde viva. Con Stack habría que escribir R6
   igualmente.

### Por qué no hay una tercera vía "gratis" de navegador

Se comprobó si el navegador de tabs ofrece un interruptor de desmontaje.
**No lo ofrece.** En `expo-router@57.0.14` —que empaqueta React Navigation en
`node_modules/expo-router/build/react-navigation/`— las opciones de
`BottomTabNavigationOptions` (`bottom-tabs/types.d.ts:180-208`) son `lazy`,
`popToTopOnBlur` y `freezeOnBlur`. **`unmountOnBlur` no está entre ellas**
(cero apariciones en ese fichero); `popToTopOnBlur` actúa sobre un Stack
anidado (aquí no hay ninguno) y `freezeOnBlur` suspende el re-render pero
**conserva el estado**. Es decir: el interruptor barato que habría hecho
innecesario este código no está disponible en el navegador que usa la app.

**Precisión, para quien grepee `node_modules` y crea que esto es falso:** el
identificador `unmountOnBlur` **sí aparece** en el árbol, en
`node_modules/expo-router/build/ui/TabContext.d.ts:7`
(`ExpoTabsNavigatorScreenOptions`), consumido por
`node_modules/expo-router/build/ui/TabSlot.js:64-67`. Pero eso es la API de
**tabs headless** (`expo-router/ui`: `TabSlot` / `TabList` / `TabTrigger`), un
navegador distinto del que la app usa. `src/app/(tabs)/_layout.tsx` monta el
`Tabs` clásico de `expo-router` con un `tabBar` propio (`FloatingTabBar`), y
`expo-router/ui` no se importa en ningún sitio de `src/` (grep verificado).
Migrar a tabs headless para ganar ese interruptor no es una tercera vía barata:
es reescribir el layout de tabs entero, más caro que D1 y que el propio Stack.

### Por qué el reset en **blur** y no en el submit

`add-reminder` y `add-pet` llaman `router.back()` tras un alta correcta
(`add-reminder/index.tsx:89`, `add-pet/index.tsx:198`). Limpiar justo antes de
esa llamada sería el diff más corto, y es el **arreglo del síntoma**: deja
intacto el caso de salir con la flecha de volver sin guardar, y el de salir por
la barra de tabs — los dos producen exactamente el mismo formulario sucio. La
pérdida de foco es el **único punto por el que pasan todas las salidas**, así
que el candado va ahí.

### Por qué blur (cleanup) y no focus

El criterio de aceptación 2 del enunciado prescribe literalmente *"el cleanup de
`useFocusEffect`"*. Se usa la misma mecánica en las cinco pantallas para que
haya un solo patrón que revisar. Efecto secundario deseable: la pantalla queda
limpia **mientras** está fuera de foco, así que ni siquiera hay un fotograma
con el valor viejo al volver.

### Por qué no se extrae un hook compartido

El cuerpo es una línea por pantalla (`useFocusEffect(useCallback(() => () =>
reset(), []))`). Un `useResetOnBlur` sería una abstracción con una sola forma
de uso sobre un one-liner de una API que ya se usa en cinco ficheros del repo
(`home`, `profile`, `reminders`, `pairing` ×2, `map`). No se crea. Si una sexta
pantalla llegara con lógica de reset no trivial, se extrae entonces.

---

## D2 — Alcance por pantalla, con evidencia

`useFocusEffect` se añade **solo** donde hay estado que sobreviva de forma
visible. La auditoría está abajo.

| Pantalla | Fichero (en `mobile-pet-tracker/`) | `useState` | ¿Defecto? | R |
|---|---|---|---|---|
| add-reminder | `src/screens/add-reminder/index.tsx` | 9 | **Sí, completo** | R1 |
| add-pet | `src/screens/add-pet/index.tsx` | 15 | **Sí, completo** | R2 |
| weight-log | `src/app/(tabs)/weight-log.tsx` | 5 | **Sí, parcial** | R3 |
| meal-schedule | `src/app/(tabs)/meal-schedule.tsx` | 2 | **Sí, parcial** | R4 |
| pairing | `src/screens/pairing/index.tsx` | 6 | **Sí, completo** | R5, R6 |
| docs | `src/screens/docs/index.tsx` | **0** | **No** | — |

---

## Auditoría de las pantallas bajo `(tabs)` (criterio de aceptación 4)

Una por una, con la evidencia que la sostiene. Ninguna conclusión es por
analogía.

### `add-pet` — **tiene el defecto, el peor de los cinco**

`src/screens/add-pet/index.tsx` declara **quince** `useState` en el cuerpo de
`AddPetScreen` (líneas 90-107 en `f50b4203`): `species`, `name`, `breed`,
`sex`, `size`, `sterilized`, `microchip`, `ageMode`, `birthDate`,
`approxAgeMonths`, `showDatePicker`, `photoAsset`, `submitting`, `formError`,
`photoError`. En el alta correcta (`case 'ok'`) hace `selectPet(...)`, sube la
foto y llama `router.back()` (línea 198) **sin resetear nada**: los catorce
campos —incluida la foto elegida, que se pinta en el `PetAvatar` de preview—
siguen ahí al reentrar. Es el mismo mecanismo que `add-reminder`, y además con
un campo visual muy evidente (el avatar con la foto de la mascota anterior).

### `weight-log` — **tiene el defecto, pero parcial; el camino feliz ya se limpia**

`src/app/(tabs)/weight-log.tsx` declara cinco `useState` en `WeightLogContent`
(líneas 61-65). A diferencia de `add-reminder`, el alta correcta **sí** se
limpia sola y **no** navega: `case 'ok'` hace `setWeightText('')`,
`setMeasuredAt(localTodayIso())`, `setBodyConditionText('')` y
`weights.refetch()` (líneas 92-95). Así que el flujo "registrar peso, volver,
reentrar" ya sale en blanco hoy.

Lo que **sí** sobrevive, y es el defecto:
- Texto escrito y no enviado: teclear `12.4` en `weight-input`, salir con
  `weight-log-back`, reentrar → `12.4` sigue en el campo.
- `measuredAt` editado a mano (p. ej. `2026-01-02`) y abandonado → persiste, y
  al reentrar otro día muestra una fecha que ya no es "hoy".
- `formError` de una validación fallida: `setFormError(null)` solo ocurre al
  **empezar** un envío (línea 79), así que un `weight-form-error` visible
  sobrevive a la salida y se pinta de nuevo al volver, sin que el usuario haya
  hecho nada.

### `meal-schedule` — **tiene el defecto, pero solo en el mensaje de error**

`src/app/(tabs)/meal-schedule.tsx` declara **dos** `useState` en
`MealScheduleContent` (líneas 43-44): `submitting` y `generateError`. No hay
formulario: la pantalla solo genera un plan con un botón. `submitting` se
apaga en `finally`. Lo que sobrevive es `generateError` (mismo patrón que
arriba: `setGenerateError(null)` solo al arrancar un `handleGenerate`), así que
un `generate-plan-error` —"registra primero un peso", "el plan necesita
perfil"— queda pegado y reaparece al volver aunque la causa ya esté resuelta.
Es menos aparatoso que un formulario sucio, pero es el mismo defecto y cuesta
una línea cerrarlo.

### `docs` — **NO tiene el defecto**

`src/screens/docs/index.tsx` (136 líneas) **no importa `useState` y no lo usa
ni una vez** (`grep -c useState` → `0`). Todo lo que la pantalla muestra sale de
dos `useQuery` (`petKeys.detail(petId)` y `mediaKeys.petDocs(petId)`, líneas
52-59) más `useThemeColors` y `useSafeAreaInsets`. La caché de TanStack Query es
precisamente estado que **debe** sobrevivir ([[requirements]] §Estado que SÍ
debe sobrevivir, punto 3). No se le añade `useFocusEffect` ni test nuevo.

### Adyacentes auditadas y dejadas fuera (no son las cuatro del criterio 4)

Se miraron porque comparten la ubicación bajo `(tabs)` sin ser tabs, pero el
enunciado no las incluye. Se anotan para que el leader decida:

- `src/screens/reminders/index.tsx` — `deletingId`, `deleteCandidate`,
  `actionError` (líneas 61-63). `deleteCandidate` es el que abre el bottom
  sheet de borrado: si sobrevive, el sheet podría reaparecer al volver.
  **Candidato real a la misma medicina.**
- `src/screens/alerts/index.tsx` — `acked`, `ackingId`, `actionError`
  (líneas 63-66). `acked` es un registro optimista de alertas reconocidas; un
  reset a ciegas aquí **sí** podría destruir información útil. Necesita su
  propio análisis, no este.
- `src/app/(tabs)/map.tsx` — `lostModeBusy`, `lostModeFailed` (líneas 91-92).
  Es tab de pleno derecho; queda fuera por definición.

---

## D3 — Mecánica, fichero por fichero

Dos formas y ninguna más.

**Forma A — reset en blur (R1–R5).** En el componente que **posee** el estado:

```
useFocusEffect(
  useCallback(() => () => { /* setters a su valor inicial */ }, []),
);
```

Deps `[]` es correcto y lint-limpio: los `setX` de `useState` son estables por
contrato de React, y ningún valor del render entra en el cuerpo. `submitting` /
`claiming` / `releasing` **no** se tocan (R7).

Dónde va exactamente:

| Fichero | Componente que posee el estado | Import a añadir |
|---|---|---|
| `src/screens/add-reminder/index.tsx` | `AddReminderContent` | `useFocusEffect` de `expo-router`; `useCallback` de `react` |
| `src/screens/add-pet/index.tsx` | `AddPetScreen` | `useFocusEffect` de `expo-router`; `useCallback` de `react` |
| `src/app/(tabs)/weight-log.tsx` | `WeightLogContent` | `useFocusEffect` de `expo-router`; `useCallback` de `react` |
| `src/app/(tabs)/meal-schedule.tsx` | `MealScheduleContent` | `useFocusEffect` de `expo-router`; `useCallback` de `react` |
| `src/screens/pairing/index.tsx` | `PairingScreen` | ninguno nuevo: ya importa `useFocusEffect`, `useCallback` y `useState` |

En `add-reminder`, `time` vuelve a `initialTime()` (función ya existente, línea
36) y no a una constante: debe ser "hoy a las 09:00", no el día del montaje
anterior. En `weight-log`, `measuredAt` vuelve a `localTodayIso()` (línea 39),
por la misma razón.

**Forma B — reset al cambiar de mascota (R6, solo `pairing`).** `PairingScreen`
extrae los cuatro setters a un `resetPairingState` con `useCallback(..., [])` y
lo usa en los dos sitios:

```
useFocusEffect(useCallback(() => () => resetPairingState(), [resetPairingState]));
useEffect(() => { resetPairingState(); }, [resetPairingState, selectedPetId]);
```

Tres cosas quedan cerradas por escrito para que Codex no tenga que decidir:

1. **El `useEffect` dispara también en el montaje.** Es intencionado y es un
   no-op: en el primer render los cuatro valores ya son sus iniciales
   (`''`, `null`, `'idle'`, `null`). No se añade un `useRef` centinela: sería
   complejidad para evitar un render que no cambia nada.
2. **No se mete `selectedPetId` en las deps del `useFocusEffect`.** Funcionaría
   por la semántica de re-suscripción de `useFocusEffect`, pero entonces R6
   solo sería observable a través de la mecánica del mock y no del componente
   real. Con un `useEffect` aparte, el test de R6 es un `fireEvent.press` sobre
   un chip del `PetSwitcher` — comportamiento de usuario, no mecánica de hook.
3. **Este será el tercer `useFocusEffect` del fichero** (ya hay dos, líneas
   101-111, para `refetchPets` y `refetchTracking`). No se toca ninguno de los
   dos, y el test no puede depender del índice de la llamada: ver D4.

---

## D4 — Cómo se observa "perder el foco" en los tests

Ninguna suite móvil monta un `NavigationContainer`: las pantallas se renderizan
sueltas con sus providers. Así que el `useFocusEffect` real no tiene de dónde
sacar el foco, y el patrón vigente del repo —`home/index.test.tsx:91`,
`profile/index.test.tsx:125`, `reminders/index.test.tsx:66`,
`pairing/index.test.tsx:50`— es mockearlo como `jest.fn()` y ejecutar el
callback a mano.

**Intención del helper** (no se copia de ninguna suite; se escribe contra el
fichero destino, y cada fichero parte de un mock distinto):

- Recorrer **todas** las llamadas registradas en `mockUseFocusEffect.mock.calls`,
  ejecutar cada callback y, si devuelve una función, ejecutarla. Recorrerlas
  todas —y no `calls[0]`— es lo que hace el helper inmune al orden y al número
  de `useFocusEffect` del fichero, que en `pairing` son tres.
- Envolver la ejecución en `act(...)` para que el re-render se aplique, y
  afirmar después con `await waitFor(...)`. En `pairing` el recorrido dispara
  también `refetchPets()` y `refetchTracking()`; son inocuos porque `listPets`
  y `getPetTracking` están mockeados en esa suite, pero el `waitFor` es lo que
  evita un warning de act por su resolución.
- **Debe tolerar cero llamadas.** Esto no es cosmético: es lo que hace legítimo
  el rojo de C4. En el commit rojo la producción todavía no llama a
  `useFocusEffect`, así que `mock.calls` está vacío; con un `forEach` el helper
  no hace nada y el test falla **por su aserción** ("se esperaba `''`, se
  recibió `Vacuna anual`"), no por un `TypeError` al leer `calls[0][0]`. Un
  rojo por excepción no demuestra que el candado esté vivo.

### Qué hay que añadir a cada fichero de test (verificado uno por uno)

| Fichero de test | Mock de `expo-router` hoy | Qué añadir |
|---|---|---|
| `src/screens/add-reminder/index.test.tsx` | factory que devuelve `{ router, Redirect }` (líneas 34-48) | `useFocusEffect: jest.fn()` en el objeto devuelto; importar `useFocusEffect` y `act`; `const mockUseFocusEffect = jest.mocked(useFocusEffect)` |
| `src/screens/add-pet/index.test.tsx` | `{ router: { back, replace } }` (líneas 34-36). **No** tiene `Redirect`, y no hace falta: `AddPetScreen` no lo usa | lo mismo |
| `src/app/(tabs)/__tests__/weight-log.test.tsx` | factory `{ router, Redirect }` (líneas 38-52) | lo mismo |
| `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | factory `{ router, Redirect }` (líneas 41-55) | lo mismo |
| `src/screens/pairing/index.test.tsx` | **ya trae** `useFocusEffect: jest.fn()` y `useIsFocused: () => true` (líneas 48-52), ya importa `act` y ya declara `mockUseFocusEffect` (línea 66) | **nada en el mock**; solo el helper y los tests nuevos |

Ninguna de las cuatro primeras importa `act` hoy: hay que añadirlo a su import
de `@testing-library/react-native`.

### Cómo se afirma cada valor reseteado

Por lo que el usuario ve, no por el estado interno:

- `type` → `screen.getByTestId('type-chip-vaccine').props.accessibilityState`
  vuelve a `{ selected: true }` (patrón ya usado en el test
  *"renders all reminder types and selects vaccine by default"*).
- `title` / `code` / `weightText` / `measuredAt` / `bodyConditionText` /
  `microchip` / `name` / `breed` / `approxAgeMonths` → `props.value` del
  `TextInput`/`Input` correspondiente vuelve a su cadena inicial.
- `date` → vuelve el texto de `t('addReminder.selectDate')` en `date-field`.
- `time` → **no se compara una cadena localizada**. Se presiona `time-field` y
  se afirma sobre el `value` del picker: `(picker.props.value as
  Date).getHours() === 9` y `.getMinutes() === 0`, que es exactamente lo que ya
  hace el test *"opens the time picker with 09:00…"* (líneas 239-240).
- `advanceMinutes` → `advance-chip-10080` vuelve a `{ selected: true }`.
- `showDatePicker` / `showTimePicker` → `screen.queryByTestId('date-picker')`
  y `('time-picker')` vuelven a ser `null`.
- `formError` / `photoError` / `generateError` / `actionError` → el `testID` del
  mensaje (`add-reminder-error`, `weight-form-error`, `generate-plan-error`,
  `pairing-error`) vuelve a ser `null`.
- `photoAsset` → el `PetAvatar` (mockeado como `View` en esa suite) vuelve a
  recibir `photoUrl` nulo.
- `phase` / `readyDevice` → `screen.queryByTestId('pairing-ready')` es `null` y
  reaparece la vista `idle` correspondiente.
- R6 → `fireEvent.press(screen.getByTestId('pet-chip-pet-2'))` sobre el
  `PetSwitcher` (`src/components/pet-switcher.tsx:29` fija ese `testID`).

---

## Archivos afectados

Capa: **infrastructure/UI móvil**. Ninguna capa `domain` ni `application` del
backend se toca; `docs/architecture.md` no tiene nada que decir sobre este
cambio más allá de que vive entero en la app Expo.

**Producción (5 ficheros, todos en `mobile-pet-tracker/`):**

- `src/screens/add-reminder/index.tsx` — `useFocusEffect` de reset en
  `AddReminderContent` (R1).
- `src/screens/add-pet/index.tsx` — ídem en `AddPetScreen` (R2).
- `src/app/(tabs)/weight-log.tsx` — ídem en `WeightLogContent` (R3).
- `src/app/(tabs)/meal-schedule.tsx` — ídem en `MealScheduleContent` (R4).
- `src/screens/pairing/index.tsx` — `resetPairingState`, el `useFocusEffect`
  de reset y el `useEffect` sobre `selectedPetId` (R5, R6).

**Tests (5 ficheros):** los cuatro de la tabla de D4 más
`src/screens/pairing/index.test.tsx`.

**No se toca**: `src/app/(tabs)/_layout.tsx`, `src/app/_layout.tsx`,
`src/components/floating-tab-bar.tsx`, `src/providers/selected-pet-provider.tsx`,
`src/screens/docs/index.tsx`, `src/i18n/catalog.ts`, `src/theme/`, ni ningún
fichero de ruta (no se crea, mueve ni borra ninguno).

---

## Alternativas descartadas

- **Sacar las pantallas a un Stack nativo** — la vía de fondo. Descartada
  *ahora* por D1 (cinco costes medidos), **no** descartada para siempre:
  queda como deuda con enunciado listo en [[requirements]].
- **`unmountOnBlur` en `Tabs.Screen`** — habría sido el diff más corto posible
  (seis líneas en `(tabs)/_layout.tsx`, cero cambios en las pantallas). **No
  existe en `BottomTabNavigationOptions`**, que es el tipo de opciones del
  navegador que la app usa; las únicas opciones parientes ahí son
  `popToTopOnBlur` (necesita un Stack anidado) y `freezeOnBlur` (suspende el
  render, conserva el estado). Comprobado en
  `node_modules/expo-router/build/react-navigation/bottom-tabs/types.d.ts:180-208`.
  Existe en la API de tabs headless `expo-router/ui`, que la app no usa —
  ver §Por qué no hay una tercera vía "gratis" de navegador.
- **Resetear justo antes del `router.back()` del alta correcta** — arregla el
  flujo que el humano reportó y deja sucios los otros dos (flecha de volver sin
  guardar, salida por la barra de tabs). Es el arreglo del síntoma.
- **Remontar con `key` variable** en el route delgado — obliga a inventar un
  contador de visitas fuera del componente y tira también la caché de
  TanStack Query de la pantalla.
- **Un hook `useResetOnBlur` compartido** — una sola forma de uso sobre un
  one-liner. Ver D1.
- **Meter `selectedPetId` en las deps del `useFocusEffect` de `pairing`** para
  cubrir R5 y R6 con un solo hook — funciona, pero hace que R6 solo sea
  observable a través del mock. Ver D3, punto 2.
- **Resetear en el *focus* en vez de en el cleanup** — equivalente en efecto,
  pero el criterio de aceptación 2 del enunciado prescribe el cleanup, y
  resetear en blur deja la pantalla limpia también mientras está fuera de foco.

---

## Errata del enunciado de #63 (`feature_list.json`)

Verificado contra `f50b4203`. El enunciado se escribió el 2026-09-04 y sus
referencias han derivado; **la spec usa los valores de esta sección, no los del
enunciado**:

1. *"los nueve `useState` de `add-reminder/index.tsx:39-47`"* → el **recuento es
   correcto** (nueve), las **líneas no**: hoy están en **49-57**. Las líneas
   39-47 caen dentro de `initialTime()` y la firma de `AddReminderContent`.
2. *"`router.back()` (`src/screens/add-reminder/index.tsx:79`)"* → hoy está en
   la **línea 89**. Además hay un segundo `router.back()` en la **línea 133**
   (el botón de volver), que es justamente la salida que el arreglo por submit
   no cubriría.
3. *"Sobreviven cuatro `useState` de `src/screens/pairing/index.tsx`"* → los
   cuatro nombrados (`code`, `actionError`, `phase`, `readyDevice`) son
   correctos y son los que sobreviven de forma visible, pero **el fichero
   declara seis** (líneas 79-84): faltan `claiming` y `releasing`. No es un
   error del enunciado —esos dos se apagan solos en `finally`— pero sí es la
   razón de que R7 exista: hay que decir por escrito que **no** se resetean.
4. *"`src/screens/pairing/index.test.tsx` mockea `useFocusEffect` como
   `jest.fn()`"* → **correcto**, línea 50. Y la consecuencia que el enunciado
   anticipa (capturar el callback y ejecutar su cleanup a mano) es exacta; lo
   que el enunciado no podía prever es que el fichero tendrá **tres**
   `useFocusEffect` tras R5, de ahí el helper de D4.
5. *"las otras pantallas de detalle … `add-pet`, `weight-log`, `meal-schedule` y
   `docs`"* → de las cuatro, **tres** tienen el defecto y **`docs` no**
   (cero `useState`). Ver §Auditoría.
6. `weight-log` y `meal-schedule` **no** siguen el patrón "route delgado +
   `src/screens/`" de `docs/conventions.md` §Estructura: su cuerpo vive entero
   en `src/app/(tabs)/weight-log.tsx` y `meal-schedule.tsx`. Es deuda
   preexistente, **no** se arregla aquí (sería un movimiento de fichero, justo
   lo que D1 evita), pero condiciona dónde va el `useFocusEffect` y dónde vive
   cada test.
