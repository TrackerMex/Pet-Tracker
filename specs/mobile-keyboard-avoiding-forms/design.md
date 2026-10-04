---
feature: "mobile-keyboard-avoiding-forms"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-keyboard-avoiding-forms]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/ui-guidelines|ui-guidelines]] (C8) para la carta de UI. Todas
> las decisiones D1–D9 están cerradas por el leader (2026-10-04, base
> `9cf45204`); la aprobación de la spec las firma. Rutas relativas a
> `mobile-pet-tracker/`.

## Decisiones técnicas

- **D1 — Siete pantallas, forgot fuera.** login, register (routes "gordos" en
  `src/app/(auth)/`, se envuelven in situ: `docs/conventions.md` §Estructura
  Expo oficial, "no se migran en frío"), reset-password, add-pet,
  add-reminder, pairing, weight-log (`src/screens/<x>/index.tsx`). forgot
  queda fuera: su único `<Input` está deshabilitado (`isDisabled`,
  `forgot.comingSoon`), el teclado nunca se abre y no hay smoke posible.
  geofence-editor ya lo tiene (#146 E1). Sirve a R1–R7.
- **D2 — Patrón de producción idéntico, calcado de geofence-editor.** En cada
  pantalla: `import { HeaderHeightContext } from 'expo-router/react-navigation';`,
  `KeyboardAvoidingView` añadido al import de `'react-native'`, `useContext`
  añadido al import de `'react'`, y
  `const headerHeight = useContext(HeaderHeightContext);` **dentro del
  componente que renderiza los inputs**:

  | Pantalla | Símbolo que recibe el `useContext` (ancla grep) |
  |---|---|
  | login | `export default function Login()` |
  | register | `export default function Register()` |
  | reset-password | `export function ResetPasswordScreen()` |
  | add-pet | `export function AddPetScreen()` |
  | add-reminder | `function AddReminderContent({ petId }` (no `AddReminderScreen`, que solo decide) |
  | pairing | `export function PairingScreen()` |
  | weight-log | `function WeightLogContent({ petId }` (no `WeightLogScreen`, que solo redirige) |

  Raíz nueva:
  `<KeyboardAvoidingView testID="screen-<x>" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>`
  envolviendo al `ScrollView` actual, que queda como único hijo. Sin
  `Platform`, sin `?? 0`, sin `enabled`, sin `useHeaderHeight()` (lanza fuera
  de un navegador; los tests montan sin él). `behavior="padding"` en las dos
  plataformas: con `behavior` sin definir la KAV es un `View` inerte y el
  consejo de Expo de usar `undefined` en Android da por hecho que la ventana
  se redimensiona, cosa que con edge-to-edge ya no pasa. La KAV envuelve
  **solo la rama que renderiza los inputs**: en reset-password las ramas
  `reset-missing-token` y `reset-success` conservan su `ScrollView
  testID="screen-reset-password"`; add-pet, add-reminder, pairing y
  weight-log tienen un único `ScrollView` con sus estados dentro, así que
  la KAV lo envuelve entero, y las ramas sin scroll (`return null` de
  `AddReminderScreen`, `Redirect` de `WeightLogScreen`) no cambian. Sirve a
  R1–R7, R9.
- **D3 — El `testID="screen-<x>"` migra a la KAV; el ScrollView pasa a
  `<x>-form`.** `login-form`, `register-form`, `reset-password-form`,
  `add-pet-form`, `add-reminder-form`, `pairing-form`, `weight-log-form`. El
  ScrollView conserva `className="flex-1 bg-background"`,
  `contentInsetAdjustmentBehavior="automatic"` y su `contentContainerStyle`
  exacto: las métricas A11 (`docs/ui-guidelines.md`, enmienda A11 de #95) no
  cambian y los `toEqual` existentes siguen valiendo tras reapuntarlos. La
  lista de `it` reapuntados está en [[requirements]] §Aserciones existentes
  que se reapuntan. Es la misma elección de #146 (host = KAV, porque RNTL 14
  no tiene `UNSAFE_getByType` y el efecto se asevera en el nodo host).
- **D4 — `keyboardShouldPersistTaps="handled"` en las cuatro que no lo
  tienen** (add-pet, add-reminder, pairing, weight-log). Con el valor por
  defecto `never` el primer toque sobre el botón cierra el teclado en vez de
  pulsarlo. login, register y reset-password ya lo llevan. Sirve a R8.
- **D5 — Offset por pantalla.** Sin cabecera (login, register,
  reset-password: `(auth)/_layout.tsx` y el `Stack` raíz van con
  `headerShown: false`): el test monta **sin** `HeaderHeightContext.Provider`,
  `keyboardVerticalOffset` llega `undefined`, la KAV lo trata como 0 y espera
  `paddingBottom: 200`. Con cabecera (add-pet, add-reminder, pairing,
  weight-log: `Stack.Protected` con `headerOptions`): el wrapper del test
  añade `<HeaderHeightContext.Provider value={91}>` y espera 291. Aritmética
  en [[requirements]] §Hechos medidos. La altura real en el teléfono la cubre
  el smoke (R10).
- **D6 — Sonda RV-5 obligatoria en las siete** (zona ciega iOS de jest-expo):
  el `it` nuevo voltea `Platform.OS = 'android'` antes de `render`, emite
  `keyboardDidShow` y restaura en `afterEach`; acotado al `it`, nunca en un
  `beforeEach` de fichero (`#90 R6` de add-pet se pone rojo bajo volteo de
  fichero entero). Medido en explore §H: bajo el volteo, la mutación
  `behavior={Platform.OS === 'ios' ? 'padding' : undefined}` deja el host sin
  clave `paddingBottom` y la sonda es roja.
- **D7 — Títulos literales.** Un `describe('#148 R<n>: <pantalla> se aparta
  del teclado en Android')` con un `it` por pantalla; el candado de
  persistTaps va en un `describe('#148 R8: …')` **separado**, con su propio
  `it`, en cada uno de los cuatro ficheros (una fila de trazabilidad limpia
  por R-id y un rojo por consulta que no se mezcla con el rojo por aserción
  de R<n>). Literales en [[requirements]].
- **D8 — Candados globales: ninguno se mueve** (explore §D). #148 no toca
  `design-drift`, `consistency-classnames` (`textInputs toHaveLength(6)`),
  `legibility-classnames`, `ui-copy-table`/`ui-language`, `catalog.ts`,
  `language-provider.test.tsx`, `src/app/_layout.tsx`,
  `src/app/__tests__/layout.test.tsx` ni `src/app/(tabs)/food.tsx` (reparto
  con #105 en vuelo). Sin copy nuevo, sin `<TextInput` nuevo, sin
  dependencias nuevas, sin tocar los route files delgados (`app/pets/add.tsx`
  < 10 líneas, candado design-drift). Si un candado global se mueve, Codex
  para y reporta. Sirve a R9.
- **D9 — Lista cerrada de ficheros** (§Archivos afectados). `files_affected`
  de #148 en `feature_list.json` pasa a esos 14 ficheros de código (sale
  `forgot.tsx`).

## Archivos afectados

Capa: todo es `infrastructure` de UI móvil (pantallas y sus tests). Codex solo
puede tocar estos 16 ficheros:

| # | Fichero | Qué cambia |
|---|---|---|
| 1 | `src/app/(auth)/login.tsx` | imports + `useContext` en `Login` + KAV raíz `screen-login`; ScrollView → `login-form` |
| 2 | `src/app/(auth)/register.tsx` | ídem en `Register`; `register-form` |
| 3 | `src/screens/reset-password/index.tsx` | ídem en `ResetPasswordScreen`, solo la rama formulario; `reset-password-form` |
| 4 | `src/screens/add-pet/index.tsx` | ídem en `AddPetScreen`; `add-pet-form`; + `keyboardShouldPersistTaps="handled"` |
| 5 | `src/screens/add-reminder/index.tsx` | ídem en `AddReminderContent`; `add-reminder-form`; + persistTaps |
| 6 | `src/screens/pairing/index.tsx` | ídem en `PairingScreen`; `pairing-form`; + persistTaps |
| 7 | `src/screens/weight-log/index.tsx` | ídem en `WeightLogContent`; `weight-log-form`; + persistTaps |
| 8 | `src/app/(auth)/__tests__/login.test.tsx` | describe R1; reapunte de 2 `it`; imports |
| 9 | `src/app/(auth)/__tests__/register.test.tsx` | describe R2; reapunte de 2 `it`; imports |
| 10 | `src/screens/reset-password/index.test.tsx` | describe R3; reapunte de 1 `it`; imports |
| 11 | `src/screens/add-pet/index.test.tsx` | describes R4 y R8; reapunte de 1 `it`; Provider 91 en `renderAddPet`; reutiliza `setPlatform` |
| 12 | `src/screens/add-reminder/index.test.tsx` | describes R5 y R8; reapunte de 1 `it`; Provider 91 en `renderAddReminder`; reutiliza `setPlatform` |
| 13 | `src/screens/pairing/index.test.tsx` | describes R6 y R8; reapunte de 1 `it`; Provider 91 en `PairingWrapper`; imports |
| 14 | `src/screens/weight-log/index.test.tsx` | describes R7 y R8; reapunte de 2 `it`; Provider 91 en `renderWeightLog`; imports |
| 15 | `specs/mobile-keyboard-avoiding-forms/traceability.md` | filas R1–R10 |
| 16 | `progress/impl_mobile-keyboard-avoiding-forms.md` | reporte de Codex |

Delta de tests esperado: +1 `it` en login, register y reset-password; +2 en
add-pet, add-reminder, pairing y weight-log (R<n> + R8). Cero `it` borrados.
Codex mide el recuento base de cada suite al arrancar (no se congela aquí:
`#105` puede mover el árbol) y anota antes/después en el impl.

## Alternativas descartadas

- **`behavior={Platform.OS === 'ios' ? 'padding' : undefined}`** (receta
  oficial): inerte en Android con edge-to-edge; es exactamente la zona ciega
  que RV-5 cubre.
- **`behavior="height"`**: mismo cálculo, mismo offset, no aporta nada (#146
  explore, Opción B).
- **`automaticallyAdjustKeyboardInsets` en el ScrollView**: `@platform ios`.
- **`Keyboard.addListener` + estado + `paddingBottom` a mano**: reimplementa
  la KAV.
- **`react-native-keyboard-controller`**: no instalado, módulo nativo, dev
  build nuevo; excluido sin decisión del humano (y daría auto-scroll al input,
  que aquí queda fuera).
- **`useHeaderHeight()`**: lanza fuera de un navegador; los tests montan sin
  él.
- **Un solo `it` con padding + persistTaps**: mezcla rojo por aserción y rojo
  por consulta en un mismo `it` y deja R8 sin fila propia; descartado por D7.
- **Candado negativo `grep -c Platform = 0` como único cubridor de RV-5**: se
  mantiene en R9 como ancla negativa, pero no sustituye a la sonda de
  comportamiento (D6), que es la que mira lo que corre.
