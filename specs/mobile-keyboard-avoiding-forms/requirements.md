---
feature: "mobile-keyboard-avoiding-forms"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-keyboard-avoiding-forms]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D9, cerradas por el leader) y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI que rige.
> Base congelada: `origin/main` = `9cf45204`. Anclas por contenido grepeable,
> nunca por número de línea.

## Contexto

Con edge-to-edge (RN 0.86, targetSdk ≥ 35) `adjustResize` ya no encoge la
ventana: Android manda el inset del IME y emite `keyboardDidShow`, y ninguna
pantalla con inputs lo consume salvo `src/screens/geofence-editor/index.tsx`
(#146 E1). El humano confirmó en el dev build de Android (2026-10-02) que en
Login y en Registro de peso el formulario no se desplaza con el teclado
abierto. Evidencia completa en
`progress/explore_mobile-keyboard-avoiding-forms.md` (§C inventario, §D
candados globales, §H medidas del leader).

Todas las rutas son relativas a `mobile-pet-tracker/`.

### Hechos medidos en `9cf45204` que fijan los valores de esta spec

| # | Pantalla | Fichero de producción | Componente que renderiza los inputs (ancla grep) | Cabecera nativa | Offset en test | `paddingBottom` esperado | `keyboardShouldPersistTaps` hoy |
|---|---|---|---|---|---|---|---|
| R1 | login | `src/app/(auth)/login.tsx` | `export default function Login()` | no (`(auth)/_layout.tsx` → `headerShown: false`) | sin Provider → `undefined` → 0 | **200** | `"handled"` |
| R2 | register | `src/app/(auth)/register.tsx` | `export default function Register()` | no | sin Provider | **200** | `"handled"` |
| R3 | reset-password | `src/screens/reset-password/index.tsx` | `export function ResetPasswordScreen()` (rama formulario, la que contiene `testID="reset-submit"`) | no (`<Stack.Screen name="reset-password" />` fuera de `Stack.Protected`) | sin Provider | **200** | `"handled"` |
| R4 | add-pet | `src/screens/add-pet/index.tsx` | `export function AddPetScreen()` | sí (`Stack.Protected`, `headerOptions`) | `HeaderHeightContext.Provider value={91}` | **291** | ausente |
| R5 | add-reminder | `src/screens/add-reminder/index.tsx` | `function AddReminderContent({ petId }` | sí | Provider 91 | **291** | ausente |
| R6 | pairing | `src/screens/pairing/index.tsx` | `export function PairingScreen()` | sí (título vacío, `headerShown: true`) | Provider 91 | **291** | ausente |
| R7 | weight-log | `src/screens/weight-log/index.tsx` | `function WeightLogContent({ petId }` | sí | Provider 91 | **291** | ausente |

Aritmética (KAV `behavior="padding"`, `_relativeKeyboardHeight`, medida en
§A.3/§E del explore y en el spike de §H):

```
keyboardY     = endCoordinates.screenY − (keyboardVerticalOffset ?? 0)
paddingBottom = max(frame.y + frame.height − keyboardY, 0)

sin cabecera: 0 + 700 − (500 − 0)  = 200
con cabecera: 0 + 700 − (500 − 91) = 291
```

`frame` viene del `fireEvent(host, 'layout', …)` con `{ x: 0, y: 0, width: 400, height: 700 }`
y `endCoordinates.screenY` del evento `keyboardDidShow` que emite el test.
El valor 91 es la convención de #146; la altura real de la cabecera en el
teléfono no está medida y la cubre §Prueba de humo.

## Requisitos funcionales

### R1–R7 — cada pantalla se aparta del teclado en Android

- **R1 (login)**: WHEN Android muestra el teclado (`keyboardDidShow`) sobre
  `/login` THE SYSTEM SHALL añadir al host `testID="screen-login"` un
  `paddingBottom` igual al solape del teclado con su `frame`
  (`frame.y + frame.height − endCoordinates.screenY`; 200 en el test), de modo
  que el ScrollView `testID="login-form"` encoja y `login-submit` quede
  alcanzable desplazando.
- **R2 (register)**: ídem sobre `/register`, host `screen-register`,
  ScrollView `register-form`, acción `register-submit`; 200 en el test.
- **R3 (reset-password)**: WHEN Android muestra el teclado sobre la **rama
  formulario** de `/reset-password` (la que renderiza `reset-password`,
  `reset-password-confirm` y `reset-submit`) THE SYSTEM SHALL añadir al host
  `screen-reset-password` el mismo `paddingBottom` (200 en el test); las ramas
  `reset-missing-token` y `reset-success` conservan su `ScrollView
  testID="screen-reset-password"` sin KAV.
- **R4 (add-pet)**: WHEN Android muestra el teclado sobre `/pets/add` THE
  SYSTEM SHALL añadir al host `screen-add-pet` un `paddingBottom` igual a
  `frame.y + frame.height − (endCoordinates.screenY − headerHeight)` (291 en el
  test, con `headerHeight` = `useContext(HeaderHeightContext)`), ScrollView
  `add-pet-form`, acción `add-pet-submit`.
- **R5 (add-reminder)**: ídem sobre `/add-reminder`, host `screen-add-reminder`,
  ScrollView `add-reminder-form`, acción `add-reminder-submit`; 291.
- **R6 (pairing)**: ídem sobre `/pairing`, host `screen-pairing`, ScrollView
  `pairing-form`, acción `pairing-submit`; 291. La KAV envuelve el único
  `ScrollView` del componente (todas sus ramas de estado viven dentro), así
  que el host existe también en la rama `pairing-skeleton`.
- **R7 (weight-log)**: ídem sobre `/weight-log`, host `screen-weight-log`,
  ScrollView `weight-log-form`, acción `weight-submit`; 291. El `Redirect`
  a `/health` sin mascota no cambia.

En las siete, IF la pantalla se monta sin `HeaderHeightContext.Provider`
(tests, o la app sin cabecera) THEN THE SYSTEM SHALL tratar el offset como 0
sin `?? 0` ni `Platform` en producción (la KAV ya hace `?? 0`).

#### Test de R1–R7: un `describe` por pantalla, título literal

Un `describe` nuevo **al final** de cada fichero de test, con un solo `it`.
Sustituye `<n>`, `<pantalla>`, `<x>`, `<N>` por la fila de la tabla:

```tsx
describe('#148 R<n>: <pantalla> se aparta del teclado en Android', () => {
  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;
  });

  it('el host screen-<x> añade paddingBottom <N> al abrir el teclado', async () => {
    (Platform as { OS: string }).OS = 'android';
    // preparación: la misma (mocks, env) del it existente que lee las métricas
    // de este fichero (columna "it existente" de §Aserciones que se reapuntan)
    await <renderDeLaSuite>();
    // add-reminder y weight-log: antes del host,
    // await waitFor(() => expect(screen.getByTestId('screen-<x>')).toBeVisible());

    const host = screen.getByTestId('screen-<x>');
    expect(host).toHaveStyle({ paddingBottom: 0 });
    await fireEvent(host, 'layout', { persist() {}, nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 700 } } });
    await act(async () => {
      DeviceEventEmitter.emit('keyboardDidShow', {
        startCoordinates: { screenX: 0, screenY: 800, width: 400, height: 0 },
        endCoordinates: { screenX: 0, screenY: 500, width: 400, height: 300 },
        duration: 0, easing: 'keyboard', isEventFromThisApp: true,
      });
    });
    await waitFor(() => expect(screen.getByTestId('screen-<x>')).toHaveStyle({ paddingBottom: <N> }));
  });
});
```

Títulos literales (Codex los copia tal cual):

| R | `describe` | `it` |
|---|---|---|
| R1 | `#148 R1: login se aparta del teclado en Android` | `el host screen-login añade paddingBottom 200 al abrir el teclado` |
| R2 | `#148 R2: register se aparta del teclado en Android` | `el host screen-register añade paddingBottom 200 al abrir el teclado` |
| R3 | `#148 R3: reset-password se aparta del teclado en Android` | `el host screen-reset-password añade paddingBottom 200 al abrir el teclado` |
| R4 | `#148 R4: add-pet se aparta del teclado en Android` | `el host screen-add-pet añade paddingBottom 291 al abrir el teclado` |
| R5 | `#148 R5: add-reminder se aparta del teclado en Android` | `el host screen-add-reminder añade paddingBottom 291 al abrir el teclado` |
| R6 | `#148 R6: pairing se aparta del teclado en Android` | `el host screen-pairing añade paddingBottom 291 al abrir el teclado` |
| R7 | `#148 R7: weight-log se aparta del teclado en Android` | `el host screen-weight-log añade paddingBottom 291 al abrir el teclado` |

Reglas del `it` (todas medidas en §H del explore):

1. **Volteo de plataforma acotado al `it`.** `Platform.OS = 'android'` se
   asigna dentro del `it`, **antes de `render`** (la KAV elige
   `keyboardDidShow`/`keyboardWillShow` en `componentDidMount`), y se restaura
   en el `afterEach` del `describe` nuevo. Nunca en un `beforeEach` de fichero:
   bajo volteo de fichero entero `#90 R6` de add-pet se pone rojo. En
   `add-pet/index.test.tsx` y `add-reminder/index.test.tsx` ya existen
   `const originalPlatform = Platform.OS;` y `function setPlatform(os: string)`
   (grep `function setPlatform`): reutilízalos (`setPlatform('android')` /
   `setPlatform(originalPlatform)`) en vez de duplicar el mecanismo. En los
   otros cinco ficheros se añade a nivel de módulo
   `const originalOS = Platform.OS;` y los imports `Platform`,
   `DeviceEventEmitter` de `'react-native'` y `act`, `fireEvent`, `waitFor` de
   `'@testing-library/react-native'` que falten.
2. **Es `keyboardDidShow`**, no `keyboardWillShow` como en #146: bajo el
   volteo, un test que solo emita el evento iOS se queda en
   `paddingBottom: 0` (zona ciega RV-5).
3. `persist() {}` es obligatorio: el `onLayout` de la KAV llama a
   `event.persist()`.
4. La espera final cumple `docs/conventions.md` §`Esperas sobre el árbol
   renderizado`: espera al nodo con `waitFor` y vuelve a consultarlo dentro.
5. Reset-password monta la rama formulario con `renderRoute('token-148')`.
   Pairing y add-pet montan con la misma preparación que su `it` de métricas.
6. Sin Provider en login/register/reset-password (esperan 200). Con
   `<HeaderHeightContext.Provider value={91}>` en add-pet/add-reminder/
   pairing/weight-log (esperan 291): dónde va el Provider está en
   §Wrappers de test.

#### Rojo real de R1–R7 en `9cf45204`

El `it` nuevo cae **por aserción** en `expect(host).toHaveStyle({ paddingBottom: 0 })`:
el host es hoy el `ScrollView` (`className="flex-1 bg-background"`), sin clave
`paddingBottom`. No cae por consulta: `screen-<x>` ya existe.

#### Sondas de mutación de R1–R7 (Codex las planta y revierte, una a una, en cada una de las 7)

| Id | Mutación en el fichero de producción | Dónde cae (sin cabecera: R1–R3) | Dónde cae (con cabecera: R4–R7) |
|---|---|---|---|
| M-a | quitar la KAV y devolver `testID="screen-<x>"` al ScrollView (estado de `9cf45204`) | `it` nuevo por aserción en `toHaveStyle({ paddingBottom: 0 })` (sin clave); además los `it` reapuntados y el de R8 caen **por consulta** `getByTestId('<x>-form')` | ídem |
| M-b | `behavior={Platform.OS === 'ios' ? 'padding' : undefined}` | bajo el volteo la KAV es un `View` inerte: el host **no tiene clave** `paddingBottom`; cae por aserción en `toHaveStyle({ paddingBottom: 0 })` (y también caería el `waitFor` final). Además R9 cae: `grep -c Platform` pasa de 0 a 1 | ídem |
| M-c | offset mal: en R1–R3 `keyboardVerticalOffset={91}` literal; en R4–R7 quitar el prop `keyboardVerticalOffset` | llega **291**, cae por aserción en `waitFor(... paddingBottom: 200)` | llega **200**, cae por aserción en `waitFor(... paddingBottom: 291)` |
| M-d | quitar `keyboardShouldPersistTaps="handled"` del ScrollView | (R1–R3 no lo pierden: lo candan `'centra el contenido dentro de un ScrollView con los insets aplicados'` en login y `'la rama del formulario no centra en horizontal'` en reset-password; register no lo canda, ver §Fuera de alcance) | el `it` de R8 cae por aserción `toBe('handled')` (recibe `undefined`) |

Cada sonda deja la suite de esa pantalla en **n−1** (M-a: n−2 o más por las
consultas) y vuelve al verde al revertirla. Codex anota en
`progress/impl_mobile-keyboard-avoiding-forms.md` el `it` que cayó y la
aserción o consulta, por pantalla y por sonda.

### R8 — el primer toque con el teclado abierto llega al control (4 pantallas)

- **R8**: WHILE el teclado está abierto sobre add-pet, add-reminder, pairing o
  weight-log, WHEN el usuario toca una vez la acción principal
  (`add-pet-submit`, `add-reminder-submit`, `pairing-submit`,
  `weight-submit`) THE SYSTEM SHALL entregar ese toque al botón en vez de
  consumirlo para cerrar el teclado: el ScrollView `<x>-form` declara
  `keyboardShouldPersistTaps="handled"` (hoy ausente en las cuatro → valor por
  defecto `never`). Login, register y reset-password ya lo llevan y no lo
  cambian.

Test: un `describe` por fichero (cuatro), al final, tras el de R4–R7:

```tsx
describe('#148 R8: <pantalla> entrega el primer toque con el teclado abierto', () => {
  it('el scroll <x>-form declara keyboardShouldPersistTaps handled', async () => {
    // misma preparación que el it de R<n>; sin volteo de plataforma
    await <renderDeLaSuite>();
    // add-reminder y weight-log: await waitFor(() => expect(screen.getByTestId('screen-<x>')).toBeVisible());
    expect(screen.getByTestId('<x>-form').props.keyboardShouldPersistTaps).toBe('handled');
  });
});
```

| Pantalla | `describe` | `it` |
|---|---|---|
| add-pet | `#148 R8: add-pet entrega el primer toque con el teclado abierto` | `el scroll add-pet-form declara keyboardShouldPersistTaps handled` |
| add-reminder | `#148 R8: add-reminder entrega el primer toque con el teclado abierto` | `el scroll add-reminder-form declara keyboardShouldPersistTaps handled` |
| pairing | `#148 R8: pairing entrega el primer toque con el teclado abierto` | `el scroll pairing-form declara keyboardShouldPersistTaps handled` |
| weight-log | `#148 R8: weight-log entrega el primer toque con el teclado abierto` | `el scroll weight-log-form declara keyboardShouldPersistTaps handled` |

Rojo real en `9cf45204`: **por consulta**, `getByTestId('<x>-form')` no
encuentra nada (el testID aún no existe). Sonda: M-d (cae por aserción
`toBe('handled')`, recibe `undefined`).

### R9 — alcance cerrado: nada fuera de los 14 ficheros de código, cero candados globales movidos

- **R9**: WHEN el reviewer mide el diff de la feature contra el HEAD del
  handoff THE SYSTEM SHALL cumplir, todo a la vez:
  1. `git diff --name-only <HEAD del handoff>` ⊆ los 14 ficheros de código de
     [[design]] §Archivos afectados + `specs/mobile-keyboard-avoiding-forms/traceability.md`
     + `progress/impl_mobile-keyboard-avoiding-forms.md`. En particular **no
     toca** `src/__tests__/design-drift.test.ts`,
     `src/__tests__/consistency-classnames.test.ts`, `src/i18n/catalog.ts`,
     `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`,
     `src/providers/__tests__/language-provider.test.tsx`,
     `src/app/_layout.tsx`, `src/app/__tests__/layout.test.tsx`,
     `src/app/(tabs)/food.tsx` (reparto con #105 en vuelo) ni los route files
     delgados (`src/app/pets/add.tsx`, `src/app/add-reminder.tsx`,
     `src/app/pairing.tsx`, `src/app/reset-password.tsx`,
     `src/app/weight-log.tsx`).
  2. `grep -c "Platform" <fichero>` = **0** en los 7 ficheros de producción
     (medido 0 en `9cf45204`, §H; declarado 0). Sin `?? 0`, sin `enabled`, sin
     `useHeaderHeight(` (grep = 0 en los 7).
  3. Recuento de `<TextInput` en `src/` igual al de la base (6, candado
     `#62 R12` de consistency-classnames: `expect(textInputs).toHaveLength(6)`),
     cero `t('` nuevos, cero dependencias nuevas en `package.json`.
  4. Las suites globales `src/__tests__/design-drift.test.ts`,
     `src/__tests__/consistency-classnames.test.ts`,
     `src/__tests__/legibility-classnames.test.ts`,
     `src/__tests__/ui-language.test.ts` y `src/app/__tests__/layout.test.tsx`
     siguen en verde sin cambios. IF alguna se pone roja durante la
     implementación THEN Codex **para** y lo reporta en
     `progress/impl_mobile-keyboard-avoiding-forms.md` en vez de tocarla.

R9 no tiene test nuevo: lo verifica el reviewer con los comandos de arriba y
`bunx jest --runTestsByPath` sobre esas cinco suites; su fila de
[[traceability]] cita el commit de cierre y la medición.

### R10 — gate humano: prueba de humo en Android

- **R10**: WHEN la implementación está revisada THE SYSTEM SHALL quedar `done`
  solo después de que el humano marque las **siete** casillas de §Prueba de
  humo (gate humano) en el dev build de Android. jest-expo corre como iOS y
  el volteo de `Platform.OS` es sintético: el teléfono es la única prueba de
  la altura real de la cabecera y del inset del IME.

## Aserciones existentes que se reapuntan

El `testID="screen-<x>"` migra a la KAV (host). Las lecturas de props del
ScrollView (`contentContainerStyle`, `keyboardShouldPersistTaps`,
`contentInsetAdjustmentBehavior`) pasan a `getByTestId('<x>-form')`;
`toBeVisible()` sigue sobre `screen-<x>`. Nada más cambia en esos `it`
(valores `toEqual` idénticos: las métricas A11 no se mueven). Medido en
`9cf45204` (difiere de los recuentos de §D del explore en login y
reset-password; manda lo medido):

| Fichero | `it` existente (título literal) | Lecturas que se reapuntan a `<x>-form` | Se queda en `screen-<x>` |
|---|---|---|---|
| `src/app/(auth)/__tests__/login.test.tsx` | `centra el contenido dentro de un ScrollView con los insets aplicados` | `screenRoot` = `getByTestId('login-form')`: `.props.contentContainerStyle`, `.props.keyboardShouldPersistTaps`, `.props.contentInsetAdjustmentBehavior` (3) | — |
| ídem | `no centra horizontalmente, que no lo hacía el View de hoy` | `.props.contentContainerStyle` (1) | — |
| `src/app/(auth)/__tests__/register.test.tsx` | `aplica el padding del contentContainerStyle con los safe-area insets` | `.props.contentContainerStyle` (1) | — |
| ídem | `declara el ajuste automático de inset del contenedor de scroll` | `.props.contentInsetAdjustmentBehavior` (1) | — |
| `src/screens/reset-password/index.test.tsx` | `la rama del formulario no centra en horizontal` | `screenRoot` = `getByTestId('reset-password-form')`: `.props.contentContainerStyle`, `.props.keyboardShouldPersistTaps` (2) | — |
| ídem | `la rama sin token centra también en horizontal` y `la rama de éxito centra también en horizontal` | **ninguna**: esas ramas conservan su `ScrollView testID="screen-reset-password"` | todo |
| `src/screens/add-pet/index.test.tsx` | `usa solo el inset inferior del dispositivo` (describe `#95 R6: métricas bajo cabecera nativa`) | `.props.contentContainerStyle` (1) | — |
| ídem | `renders the complete two-section form and deterministic preview` | — | `toBeVisible()` |
| `src/screens/add-reminder/index.test.tsx` | `uses the metrics under the native header (#95 R6)` | `.props.contentContainerStyle` (1) | el `waitFor(... toBeVisible())` previo |
| ídem | `retira el botón y el título del cuerpo` | — | `toBeVisible()` |
| `src/screens/pairing/index.test.tsx` | `renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)` | `.props.contentContainerStyle` (1) | `toBeVisible()` |
| ídem | `retira el botón de volver del cuerpo` | — | `toBeVisible()` |
| `src/screens/weight-log/index.test.tsx` | `shows loading and the metrics under the native header (#95 R6)` | `.props.contentContainerStyle` (1) | el `waitFor(... toBeVisible())` previo |
| ídem | `R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa` | `.props.contentContainerStyle` → `.not.toHaveProperty('paddingTop')` (1) | el `waitFor(... toBeVisible())` previo |
| ídem | `retira el botón y el título del cuerpo` | — | `toBeVisible()` |

Total: 10 `it` reapuntados, 13 lecturas de props (login 4, register 2,
reset-password 2, add-pet 1, add-reminder 1, pairing 1, weight-log 2).
Ningún test de las 7 asevera
`children`/`parent` de `screen-<x>` ni usa snapshots (grep vacío en
`9cf45204`).

### Wrappers de test (dónde va `HeaderHeightContext.Provider value={91}`)

`import { HeaderHeightContext } from 'expo-router/react-navigation';` solo en
los cuatro ficheros con cabecera. Envuelve al componente de pantalla, dentro
del `LanguageProvider`, como en `geofence-editor/index.test.tsx`:

| Fichero | Función/wrapper (ancla grep) | Cambio |
|---|---|---|
| `src/screens/add-pet/index.test.tsx` | `async function renderAddPet()` (JSX inline) | `<AddPetScreen />` → `<HeaderHeightContext.Provider value={91}><AddPetScreen /></HeaderHeightContext.Provider>` |
| `src/screens/add-reminder/index.test.tsx` | `async function renderAddReminder(selected = true)` | envuelve `<AddReminderScreen />` igual (el `SelectionProbe` queda fuera del Provider o dentro, indiferente) |
| `src/screens/weight-log/index.test.tsx` | `async function renderWeightLog(selected = true)` (dentro de `renderWithProviders(`) | envuelve `<WeightLogScreen />` igual |
| `src/screens/pairing/index.test.tsx` | `function PairingWrapper({ children }` | `<SelectedPetProvider>{children}</SelectedPetProvider>` → `<SelectedPetProvider><HeaderHeightContext.Provider value={91}>{children}</HeaderHeightContext.Provider></SelectedPetProvider>` |
| `login.test.tsx`, `register.test.tsx` (`function AuthScreenWrapper`), `reset-password/index.test.tsx` (`async function renderRoute(token?: string)`) | — | **sin cambio**: montan sin Provider y esperan 200 |

El Provider en el wrapper afecta a toda la suite: es inocuo para los `it`
existentes (ninguno lee el offset) y deja cada test como en la app, donde la
cabecera siempre provee su altura.

## Fuera de alcance

- **`src/app/(auth)/forgot.tsx`**: su único `<Input` vive en
  `<TextField className="w-full" isDisabled>` (copy `forgot.comingSoon`); el
  teclado nunca se abre y no hay casilla de smoke posible. El día que se
  habilite deberá adoptar este patrón. Se retira de `files_affected`.
- **geofence-editor**: ya lo tiene (#146 E1); es el patrón de referencia.
- **iOS**: aparcada por #60; `behavior="padding"` se aplica igual en las dos
  plataformas, pero nadie lo prueba en iOS.
- **`react-native-keyboard-controller`**: no instalado; módulo nativo, dev
  build nuevo, `KeyboardProvider` en raíz. No entra sin decisión del humano.
- **Auto-scroll al input enfocado**: la KAV no lo da; el humano desplaza a
  mano hasta el botón (weight-log tiene `weight-submit` en mitad del scroll).
- **Doble inset `insets.bottom` + padding de la KAV** (explore §G.14):
  posible espacio sobrante bajo el teclado; no afecta a la alcanzabilidad y no
  se corrige.
- **`src/app/_layout.tsx` y los candados globales** listados en R9.1: reparto
  con #105 en vuelo.
- **Candado de `keyboardShouldPersistTaps` en register**: el prop existe en
  producción desde #61 pero `register.test.tsx` no lo asevera; no es
  regresión de #148 y R8 cubre solo las cuatro que lo estrenan.
- **Migrar `(auth)/*` a `src/screens/`**: `docs/conventions.md` §Estructura
  Expo oficial, "no se migran en frío"; la KAV se envuelve in situ.
- **Medir la altura real de la cabecera**: el 91 es convención de test; el
  teléfono manda (R10).

## Prueba de humo (gate humano)

Gate distinto de §Aprobación (lección `gate-humano-sin-casilla-donde-firmar`):
cierra la feature, no la spec. Dispositivo: **dev build de Android** en
OnePlus Nord 5 (nunca Expo Go); basta recargar el bundle, no hace falta
rebuild. El teléfono sale dos veces en `adb devices` (IP y mDNS): usar
siempre `adb -s <ip:puerto>`.

Dispositivo/serial: `__________`  Fecha: `__________`  Cuenta: `__________`
Versión del bundle (commit): `__________`

Observable común, en cada casilla: *con el teclado abierto sobre el último
campo del formulario, el botón de la acción principal es visible o
alcanzable desplazando el formulario, y un solo toque lo pulsa (no hace
falta un primer toque para cerrar el teclado).*

1. **login (R1)** — precondición: sesión cerrada. Abrir `/login`, tocar
   `login-password` (último campo), teclado abierto → `login-submit`
   (`login.signIn`) alcanzable y un toque lo pulsa.
   - [ ] Superada (fecha: ____)
2. **register (R2)** — precondición: sesión cerrada. Abrir `/register` desde
   `link-register`, tocar `register-country` (último campo, o el último que
   abra teclado), teclado abierto → `register-submit`
   (`register.createAccount`) alcanzable desplazando y un toque lo pulsa.
   - [ ] Superada (fecha: ____)
3. **reset-password (R3)** — precondición: app instalada, da igual la sesión.
   Abrir por deep link:
   `adb -s <ip:puerto> shell am start -a android.intent.action.VIEW -d "mobilepettracker://reset-password?token=<cualquiera>"`.
   Tocar `reset-password-confirm`, teclado abierto → `reset-submit`
   (`resetPassword.updatePassword`) alcanzable y un toque lo pulsa.
   - [ ] Superada (fecha: ____)
4. **add-pet (R4)** — precondición: sesión iniciada. Abrir `/pets/add`, tocar
   `microchip-input` (último campo de texto), teclado abierto →
   `add-pet-submit` (`addPet.savePet`) alcanzable desplazando y un toque lo
   pulsa.
   - [ ] Superada (fecha: ____)
5. **add-reminder (R5)** — precondición: sesión iniciada **y mascota
   seleccionada** (sin ella la pantalla vuelve a `/reminders`). Abrir
   `/add-reminder` desde Recordatorios, tocar `title-input`, teclado abierto →
   `add-reminder-submit` (`addReminder.saveReminder`) alcanzable y un toque lo
   pulsa.
   - [ ] Precondición cumplida (mascota seleccionada)
   - [ ] Superada (fecha: ____)
6. **pairing (R6)** — precondición: sesión iniciada, mascota seleccionada en
   **plan free y sin collar emparejado** (es la única rama que muestra
   `activation-code-input`; con collar emparejado o plan tracked no hay
   input). Abrir `/pairing`, tocar `activation-code-input`, teclado abierto →
   `pairing-submit` (`pairing.pairCollar`) alcanzable y un toque lo pulsa
   (puede fallar la petición con un código inventado; lo que se mide es que
   el toque llega).
   - [ ] Precondición cumplida (plan free, collar sin emparejar)
   - [ ] Superada (fecha: ____)
7. **weight-log (R7)** — precondición: sesión iniciada **y mascota
   seleccionada** (sin ella redirige a `/health`). Abrir `/weight-log` desde
   Salud, tocar `weight-bc-input` (último campo), teclado abierto →
   `weight-submit` (`weightLog.logWeight`) alcanzable desplazando (está en
   mitad del scroll, sobre el historial) y un toque lo pulsa.
   - [ ] Precondición cumplida (mascota seleccionada)
   - [ ] Superada (fecha: ____)

Si alguna casilla falla, el humano anota la pantalla y lo que vio en
`progress/impl_mobile-keyboard-avoiding-forms.md` y la feature no pasa a
`done`.

## Aprobación

Dos gates, dos casillas: esta autoriza implementar (firma D1–D9 de
[[design]]); las de §Prueba de humo cierran la feature.

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
