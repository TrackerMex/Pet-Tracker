---
feature: "mobile-reminders-alerts-to-stack"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-reminders-alerts-to-stack]] (#114)

> Ver [[requirements]] para los requisitos, [[../../docs/ui-guidelines|ui-guidelines]]
> para la carta de UI móvil y [[../../docs/architecture|architecture]] para las
> capas (aquí solo aplica la capa de UI de la app Expo: nada de backend).
>
> **El molde es #95** (`specs/mobile-detail-screens-to-stack/`): mismo
> `RootStack`, mismas opciones de cabecera, misma excepción A11, mismo andamiaje
> de tests de navegación. Todo lo que sigue se verificó **contra el árbol en
> `a833f153`**, no contra el enunciado. Las citas son por contenido o por commit,
> nunca por número de línea.

## Skills y documentación

Cargadas: `expo:expo-overview` → `expo:expo-router` (Stack, `Stack.Protected`,
cabeceras), como manda `docs/ui-guidelines.md` §Skills. **Codex solo tiene
`building-native-ui`**, así que toda la guía de routing que necesita está escrita
en este documento (D1, D2, D6 y D8); no debe buscar otra skill de router.

Documentación y fuentes leídas (versión fijada `expo 57.0.14`,
`expo-router 57.0.14`):

- <https://docs.expo.dev/versions/v57.0.0/sdk/router/> — `router.dismissTo`:
  *"Dismisses screens until the provided href is reached. If the href is not
  found, it will instead replace the current screen with the provided `href`."*
  `ScreenProps.dangerouslySingular` aparece en la referencia sin descripción.
- `node_modules/expo-router/build/layouts/stack-utils/StackScreen.d.ts` —
  `dangerouslySingular`: *"When enabled, the navigator will reuse an existing
  screen instead of pushing a new one. Only supported when used inside a Layout
  component."* (`getId` está `@deprecated` en su favor).
- `node_modules/expo-router/build/react-navigation/routers/StackRouter.js`,
  `case 'POP_TO'`: si la ruta existe en la pila, desapila hasta ella; si no,
  *"remove the current route and add the new one"*.
- `node_modules/expo-router/build/link/Redirect.js` — `Redirect` es
  `router.replace(href)` dentro de `useFocusEffect`.
- **Ojo**: la página sin versión <https://docs.expo.dev/router/advanced/stack/>
  afirma que por defecto el Stack ignora un segundo push a la misma pantalla. **En
  SDK 57 no es así**: la sonda S7 apila dos `alerts`. Manda la sonda.

## Entorno (verificado, no supuesto)

| Qué | Valor en `a833f153` | Fuente |
|---|---|---|
| `expo` / `expo-router` / `react-native-screens` | `57.0.14` / `57.0.14` / `4.26.2` | `node_modules/*/package.json` |
| Dependencias nuevas | **ninguna** | — |
| `.expo/types/router.d.ts` | no existe | `ls` |
| `bunx jest --silent` | 80 suites, 1426 tests, `exit=0` | medido sin pipe |
| `bunx tsc --noEmit` / `bunx expo lint` | `exit=0`, 0 bytes | medido |
| `dangerouslySingular` en `<Stack.Screen>` | tipa (`tsc` `exit=0`, 0 bytes con la sonda) | sonda S9 |

---

## §0 Errata del enunciado de #114 (`feature_list.json`)

La spec usa los valores de esta sección, no los del enunciado.

| # | El enunciado dice | Verificado | Consecuencia |
|---|---|---|---|
| E1 | `alerts` se abre *"desde home, profile y el toque de notificacion"* | **Falso para Profile.** `src/screens/profile/index.tsx` no contiene `alerts`. Se abre desde la campana de Home (`router.push('/alerts')`) y dos veces desde `use-push-registration.ts` (listener en caliente y `getLastNotificationResponseAsync` en frío) | la prueba de humo entra por la campana |
| E2 | *"la auditoria de #63 anoto que reminders conserva deleteCandidate al volver"* | **Caducado.** #97 (`mobile-reminders-alerts-state-reset`, `b0d17b5c` y vecinos) ya resetea `deleteCandidate` y `actionError` en el cleanup del `useFocusEffect` de `reminders`, y `actionError` en el de `alerts` (#97 R1, R2, R4) | el criterio lo cierra el desmontaje de R2; los resets se quedan (D5) |
| E3 | *"Hoy no tienen boton de volver y se salen por la barra"* | Cierto. Se ocultan de la barra porque `FloatingTabBar` itera solo `TABS` (cinco entradas) y `(tabs)/_layout.tsx` declara cinco `Tabs.Screen`; `reminders` y `alerts` son hijas implícitas del `Tabs`. Desde #91, con una de ellas activa (`activeTabIndex < 0`) la burbuja no se monta | tras R1 la barra no se pinta sobre ellas (las tapa el Stack) y las ramas de #91 pierden disparador (deuda en [[requirements]]) |
| E4 | `files_affected` | Se queda corto: faltan `add-reminder` (R7), ocho ficheros de test y tres specs/docs ajenos (A13, A14) | §Archivos afectados |
| E5 | (planteamiento del leader) *en frío, alerts quedaría sin nada debajo* | **Falso.** El segundo efecto de `usePushRegistration` no consulta la respuesta pendiente mientras `pathname === '/'`; solo lo hace cuando el `Redirect` de `src/app/index.tsx` ya dejó `(tabs)` en Home. Resultado: `["(tabs)", "alerts"]` (sonda S6) | sin `unstable_settings` (D2) |
| E6 | la decisión 8 de #95 (*"tocar una notificación en una pantalla de detalle apila una segunda `(tabs)`"*) | Cierto hoy (sonda S2). **Esta feature la supera**: con `alerts` en la pila raíz, el mismo `router.push('/alerts')` apila `alerts`, no `(tabs)` | R3; no se enmienda #95 (describía una consecuencia, no un requisito) |

---

## §1 Sondas ejecutadas (tests desechables en `src/__probe114__/`, borrados; `git status` limpio al terminar)

Montaje de todas: `renderRouter` de `expo-router/testing-library` con el árbol
real de `src/app` recorrido por `readdirSync` (el `routes()` de #95), layouts
reales de `(tabs)` y `(auth)`, `useAuth` controlable por store, y stubs con
contador de montajes para `reminders`, `alerts` y `add-reminder`. "Propuesto" =
un layout raíz de sonda que declara el `RootStack` de D1 (las mismas ocho
`Stack.Screen`), con `(tabs)/reminders` y `(tabs)/alerts` reubicadas como
`reminders` y `alerts`.

| Sonda | Árbol | Resultado | Sostiene |
|---|---|---|---|
| S1 | base, layout raíz real | `push('/reminders')` → pila `["(tabs)"]`; tras entrar, salir y reentrar, `reminders` lleva **1** montaje; sin sesión, cada `push` a `/reminders` o `/alerts` **añade** una `(auth)` | rojos de R1–R2 |
| S2 | base | en `/add-reminder`, `push('/alerts')` → `["(tabs)", "add-reminder", "(tabs)"]`, y atrás desde Alertas cae en `/home` **dentro** de la segunda `(tabs)` | E6, R3 |
| S3 | base, layout raíz real **y hook real** | arranque en frío con respuesta pendiente → `/alerts` con pila `["(tabs)"]` | rojo de R3 |
| S4 | propuesto | `push('/reminders')` → `["(tabs)", "reminders"]`; `push('/add-reminder')` → `[…, "add-reminder"]`; atrás → `["(tabs)", "reminders"]` con **el mismo** montaje; atrás y reentrar → montaje nuevo; cerrar sesión en `/alerts` → `/login`, `["(auth)"]`; `push` a las dos sin sesión → la pila no crece | R2, D5 |
| S5 | propuesto | desde `reminders`, `add-reminder` con `<Redirect href="/reminders" />` → `["(tabs)", "reminders", "reminders"]` (montaje nuevo); con `router.dismissTo('/reminders')` en un `useEffect` → `["(tabs)", "reminders"]` sin montaje nuevo; desde Home con `dismissTo` → `["(tabs)", "reminders"]` y atrás → `/home` | R7 |
| S6 | propuesto, hook real | frío → `["(tabs)", "alerts"]`, atrás → `/home` con `canGoBack() === false`; en `/add-reminder`, toque → `["(tabs)", "add-reminder", "alerts"]`; segundo toque → **igual**, sin montaje nuevo; atrás → `/add-reminder` | R3, E5 |
| S7 | propuesto **sin** `dangerouslySingular` | dos `push('/alerts')` → `["(tabs)", "alerts", "alerts"]` | D2 |
| S8 | propuesto | cerrar sesión con `add-reminder` (con el `useEffect` de `dismissTo`) encima de `reminders` → `/login`, `["(auth)"]`, sin error de acción no manejada | R7 no pelea con la guarda |
| S9 | propuesto | `bunx tsc --noEmit` con `<Stack.Screen name="alerts" dangerouslySingular={…} />` y `router.dismissTo('/reminders')` | `exit=0`, 0 bytes |
| S11 de #95 | — | dos `it` con `renderRouter` en el mismo fichero: el segundo no navega | **un solo `it` por fichero** (D8) |

---

## D1 — Las dos rutas pasan al `Stack.Protected` de `RootStack`

| Hoy | Después (`git mv`) | Único cambio de contenido |
|---|---|---|
| `src/app/(tabs)/reminders.tsx` | `src/app/reminders.tsx` | `'../../screens/reminders'` → `'../screens/reminders'` |
| `src/app/(tabs)/alerts.tsx` | `src/app/alerts.tsx` | `'../../screens/alerts'` → `'../screens/alerts'` |

Los nombres de export (`RemindersRoute`, `AlertsRoute`) no cambian. **Las URL
no cambian** (un grupo `(…)` no aporta segmento), así que **ningún** `push` del
código cambia por el movimiento: `home` (`'/reminders'`, `'/alerts'`), `profile`
(`'/reminders' as Href`), `use-push-registration` (`'/alerts'` dos veces) y
`reminders` (`'/add-reminder' as Href`).

En `src/app/_layout.tsx`, dentro del `<Stack.Protected>` de `RootStack`, **tras**
`<Stack.Screen name="pairing" … />`:

```tsx
<Stack.Screen name="reminders" options={{ ...headerOptions, title: t('reminders.reminders') }} />
<Stack.Screen name="alerts" dangerouslySingular options={{ ...headerOptions, title: t('alerts.title') }} />
```

(`options` entra en R4; en el verde de R1 van **sin** `options`.) No se toca
nada más del fichero: la guarda, los cuatro `Stack.Screen` abiertos, el orden de
providers y `headerOptions` son los de #95. `src/app/(tabs)/_layout.tsx` **no
cambia**: sigue declarando cinco `Tabs.Screen`; al irse los ficheros, el `Tabs`
deja de tener hijas implícitas.

**Guarda.** Quedan protegidas por el mismo `Stack.Protected` que las seis. Con la
guarda a `false` el historial protegido desaparece y un `push` sin sesión no
añade nada (S4), exactamente lo que #95 R3 prueba para las seis; R2 lo canda para
estas dos.

## D2 — Notificación: el hook no cambia; `alerts` es singular; frío sin ancla

- **Caliente.** `router.push('/alerts')` desde cualquier pantalla apila `alerts`
  en la pila raíz (S6), así que la segunda `(tabs)` de S2 desaparece sin tocar el
  hook. Volver regresa a la pantalla de origen **montada**, con lo que tuviera
  escrito.
- **Repetido.** Sin más, dos toques apilan dos `alerts` (S7): una regresión frente
  a hoy, donde un toque estando en Alertas no hace nada. Se evita con
  `dangerouslySingular` en su `Stack.Screen` (S6). Es declarativo, vive en el
  layout y no toca el hook. No se usa `router.push('/alerts', {
  dangerouslySingular: true })` en el hook: filtra el historial y monta otra
  instancia, y obligaría a tocar un fichero que hoy no cambia.
- **Frío.** No hace falta `unstable_settings` ni `initialRouteName`: el hook ya
  espera a que `pathname` salga de `/` (E5), y en ese momento `(tabs)` está en la
  pila (S6). Un ancla además cargaría `(tabs)` bajo `reset-password`.

## D3 — Cabecera y cuerpo

**Cabecera** (R4): los mismos `headerOptions` de #95 D3, con `title`
`t('reminders.reminders')` y `t('alerts.title')`. Son las claves que ya titulaban
cada pantalla; duplicarlas contradiría D1–D2 de `specs/mobile-ui-language/design.md`.

**Cuerpo** (R5), elemento por elemento:

| Pantalla | Hoy | Después | Lo que se queda |
|---|---|---|---|
| `src/screens/reminders/index.tsx` | primer hijo del `ScrollView`: `<View className="flex-row items-center justify-between gap-3">` con el `Text` de `t('reminders.reminders')` (`text-2xl font-black text-foreground`) y el `Button` `reminders-add-link` | `<View testID="reminders-actions" className="flex-row justify-end">` con **solo** el `Button` `reminders-add-link`, sin cambios en él | `Text` (se usa más abajo) |
| `src/screens/alerts/index.tsx` | `ListHeaderComponent={<View className="gap-3"><Text …>{t('alerts.title')}</Text>{displayedActionError ? <Text testID="alerts-action-error" …/> : null}</View>}` | `ListHeaderComponent={displayedActionError ? (<Text testID="alerts-action-error" className="text-danger">{displayedActionError}</Text>) : null}` | `Text`; el `testID` y la clase del error no cambian |

Por qué "Nuevo" no va a la cabecera: `headerRight` metería la navegación a
`/add-reminder` en el layout y rompería el `toEqual` exacto de las opciones que
comparten las ocho; en el cuerpo sigue donde el usuario lo encuentra hoy (arriba
a la derecha). Por qué `ListHeaderComponent` pasa a `null` sin error: un
`View` vacío como cabecera de la lista cuenta como hijo del contenedor y el
`gap: 16` dejaría una banda de 16 px bajo la cabecera nativa. `VirtualizedList`
propaga sus props al `ScrollView` (`…this.props` en
`@react-native/virtualized-lists/Lists/VirtualizedList.js`), por eso el test
puede leer `ListHeaderComponent` de `getByTestId('alerts-list').props`, como ya
lee `data` y `contentContainerStyle`.

## D4 — Métricas (R6)

| Pantalla | Nodo | Antes | Después |
|---|---|---|---|
| reminders | `ScrollView` `screen-reminders` | `padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96` | `padding: 24, gap: 16, paddingBottom: insets.bottom + 24` |
| alerts | `FlatList` `alerts-list` | ídem | ídem |

`useSafeAreaInsets` se queda (el inset inferior sigue haciendo falta) y
`contentInsetAdjustmentBehavior="automatic"` también. Con el doble de insets de
los dos ficheros de test (`top: 40, bottom: 24`) el valor esperado es
`{ padding: 24, gap: 16, paddingBottom: 48 }`. La regla y su motivo son los de
#95 D4; A13 solo añade estas dos pantallas a la lista de A11.

## D5 — Estado local: qué cubre ahora el Stack y qué no

Con R2, **salir hacia atrás desmonta**. Pero perder el foco sin desmontar sigue
existiendo en `reminders`:

| Pantalla | Pérdida de foco sin desmontar, tras #114 | Consecuencia |
|---|---|---|
| reminders | **sí**: `add-reminder` (botón "Nuevo") y `alerts` (toque de notificación) se apilan encima y `reminders` queda montada debajo (S4, S6) | el cleanup de #97 R1–R2 sigue siendo el que cierra el sheet de borrado y limpia el error al volver. **Se queda** |
| alerts | **no hoy**: desde Alertas no se navega, y un toque de notificación la reutiliza (D2). **Sí con #100**, que apilará el detalle encima | el cleanup de #97 R4 queda sin camino hasta #100. **Se queda**: no es incorrecto, cuesta cero líneas, y retirarlo obligaría a #100 a reponerlo junto con su test |

Por eso **no** hay un requisito "R7 de #95" aquí: ningún `useFocusEffect` se
borra ni cambia, y los tests de #97 siguen verdes sin tocarse.

Lo que el desmontaje **sí** retira (decisión 3 de P1), pieza por pieza, contra
§Estado que SÍ debe sobrevivir de `specs/mobile-reminders-alerts-state-reset/requirements.md`:

| Pieza (#97) | Hoy al volver | Tras #114 al volver atrás y reentrar | Por qué se acepta |
|---|---|---|---|
| `acked` (#97 R6) | sobrevive | se pierde; hasta que vuelve el refetch se pinta el estado de la caché (el ack no escribe en la caché) | un ack repetido es `200` idempotente (`ack-alert.use-case.ts`, `acked + ack`); escribir el ack en la caché movería la fila de grupo al pulsar y rompería #78 R7 |
| `ackingId` / `ackingIdRef` (#97 R5) | sobreviven | se pierden si se sale con un ack en vuelo | el ack repetido es idempotente |
| `deletingId` (#97 R3) | sobrevive | se pierde si se sale con un borrado en vuelo | un segundo `DELETE` sobre una fila ya borrada devuelve `not-found`, que `handleDelete` ya trata con un `refetch` silencioso |
| scroll y páginas de `alerts-list` | sobreviven | se empieza arriba; las páginas cacheadas se pintan y se refetchean | es la semántica de push/pop: cada entrada es una visita nueva |

Nada de esto se candea con test nuevo: son consecuencias de plataforma que el
`it` de R2 ya prueba en su raíz (montaje nuevo al reentrar).

## D6 — `add-reminder` sin mascota: `dismissTo` en vez de `Redirect` (R7)

`src/screens/add-reminder/index.tsx`, componente exportado `AddReminderScreen`:

```tsx
export function AddReminderScreen() {
  const { selectedPetId } = useSelectedPet();

  useEffect(() => {
    if (selectedPetId === null) router.dismissTo('/reminders' as Href);
  }, [selectedPetId]);

  if (selectedPetId === null) return null;

  return <AddReminderContent petId={selectedPetId} />;
}
```

- El import de `expo-router` pierde `Redirect` (queda
  `import { router, type Href } from 'expo-router';`) y el de `react` gana
  `useEffect` (queda `import { useEffect, useState } from 'react';`).
- `useEffect` y no `useFocusEffect`: #95 R7 canda **cero** `useFocusEffect(` en
  este fichero (`detail-stack.test.tsx`).
- `dismissTo` cubre los dos orígenes (S5): con `reminders` debajo desapila hasta
  ella sin montarla otra vez; sin ella, sustituye `add-reminder` por `reminders`,
  que es lo que hacía el `Redirect`. Al cerrar sesión con la pantalla abierta, la
  guarda gana y no hay error (S8).
- `AddReminderContent` y su `router.back()` tras el alta **no** cambian.

## D7 — Copy: cero claves; tablas de uso

- `src/i18n/catalog.ts` **no cambia**; `language-provider.test.tsx` **no se
  toca** (su suma `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6` = `303` sigue
  igual). Pacto con #113 en [[requirements]] §Coordinación.
- `src/__tests__/ui-copy-table.ts`:

  | Array | Fila | Commit |
  |---|---|---|
  | `R8_REMINDERS` | **entra** `{ file: 'src/app/_layout.tsx', key: 'reminders.reminders' }, // #114 R4`, junto a la de `addReminder.addReminder` de #95 | R4 verde |
  | `R8_REMINDERS` | **sale** `{ file: 'src/screens/reminders/index.tsx', key: 'reminders.reminders' }` | R5 verde |
  | `R12_ALERTS` | **entra** `{ file: 'src/app/_layout.tsx', key: 'alerts.title' }, // #114 R4` al principio | R4 verde |
  | `R12_ALERTS` | **sale** `{ file: 'src/screens/alerts/index.tsx', key: 'alerts.title' }` | R5 verde |

- `src/__tests__/ui-language.test.ts`:
  - `#65 R8` › `resuelve las 49 ocurrencias normativas`: la suma
    `50 + 1 - 2` gana ` + 1` en R4 y ` - 1` en R5, con el comentario final
    `// +1 #95 R4, -2 #95 R5, +1 #114 R4, -1 #114 R5`. El título dice "49" antes
    y después; entre R4 y R5 queda desfasado, como en #95.
  - `#78 R12` › `registra cada ocurrencia de la pantalla`: el `every` pasa a
    admitir los dos ficheros, `file === 'src/screens/alerts/index.tsx' || file ===
    'src/app/_layout.tsx'`, con el comentario `// #114 R4: el título lo pinta la
    cabecera`. `checkUses(R12_ALERTS)` no cambia. En R4.
  - `SCREEN_FILES` (`19 + 2 + 1 + 1`) **no cambia**: `_layout.tsx` ya entró con #95.
- `specs/mobile-ui-language/design.md` §2 (en R4): la fila de
  `reminders.reminders` gana, dentro de su última celda y como en la de
  `addReminder.addReminder`, ` ← se pinta desde \`src/app/_layout.tsx\` por #114
  (R4)`; la de `alerts.title` gana al final de la línea, **después** de
  `← añadida por #78 (R3)` (el regex del `it` `#78 R12` › `documenta las catorce
  claves…` exige que ese sufijo siga), ` · se pinta desde \`src/app/_layout.tsx\`
  por #114 (R4)`.

## D8 — Plan de tests, fichero por fichero

**Ficheros nuevos**, los dos en `src/app/__tests__/`. No se extienden
`detail-stack.navigation.test.tsx` ni `detail-stack.guard.test.tsx`: la sonda S11
de #95 prohíbe un segundo `it` con `renderRouter` en un fichero, y alargar su
único `it` mezclaría la evidencia de #95 con la de #114.

1. **`reminders-alerts-stack.navigation.test.tsx`** — **un solo `it`** en
   `describe('#114 R2: reminders y alerts se apilan y desapilan sobre (tabs)')`.
   Andamiaje **copiado** de `detail-stack.navigation.test.tsx` (mismos dobles,
   mismo store de `useAuth` con `useSyncExternalStore`, mismo `routes()` que
   recorre `src/app` y lanza ante un `_layout` inesperado, mismo `rootStack()`),
   con estos cambios en `routes()`: las claves que terminan en `reminders` y en
   `alerts` reciben un stub que cuenta montajes con un inicializador perezoso de
   `useState` (`mockRemindersMounts`, `mockAlertsMounts`); `add-reminder`, un
   stub que pinta un `Text`. El `it`, en este orden:
   - `initialUrl: '/home'`; pila `["(tabs)"]`.
   - Para `['/reminders', 'reminders']` y `['/alerts', 'alerts']`: `push` →
     pathname y pila `["(tabs)", nombre]`; `back` → `/home` y `["(tabs)"]`.
     Después, contadores `1` y `1`.
   - `push('/reminders')` → contador de reminders `2`. `push('/add-reminder')` →
     `["(tabs)", "reminders", "add-reminder"]`; `back` → `/reminders`,
     `["(tabs)", "reminders"]`, contador **sigue en `2`**.
   - `push('/add-reminder')`; `dismissTo('/reminders')` → `/reminders`,
     `["(tabs)", "reminders"]`, contador en `2`. `back` → `/home`.
   - `push('/add-reminder')` desde Home; `dismissTo('/reminders')` → `/reminders`
     y `["(tabs)", "reminders"]`.
   - `push('/alerts')` → `["(tabs)", "reminders", "alerts"]`.
   - Store a `{ status: 'unauthenticated', token: null }` y notificar →
     `/login` y `["(auth)"]`. Para `/reminders` y `/alerts`: `push`, vaciar
     temporizadores dentro de `act` (`jest.runOnlyPendingTimers()`, tres pasadas,
     como #95 R3) → sigue `/login` y `["(auth)"]`.
2. **`reminders-alerts-stack.notification.test.tsx`** — **un solo `it`** en
   `describe('#114 R3: el toque de notificación apila alerts una sola vez')`.
   Igual que el anterior **salvo**: `../../hooks/use-push-registration` **no** se
   mockea (hook real); se mockean `expo-notifications` (el mismo doble que
   `src/hooks/use-push-registration.navigation.test.tsx`: `AndroidImportance` y
   sus siete funciones, cada una `jest.fn()`), `expo-device` (`isDevice: true`), `expo-constants` (`projectId`) y
   `../../api/push-tokens` (`registerPushToken` resuelve `{ kind: 'ok' }`); el
   store de `useAuth` incluye `setPushToken: jest.fn()` creado **una vez** fuera
   del store (el efecto del hook depende de su identidad); `index` es la ruta
   **real** (`src/app/index.tsx`, la del `Redirect` por sesión). El `it`:
   - Permisos concedidos, token de Expo, `addNotificationResponseReceivedListener`
     devuelve `{ remove: jest.fn() }`, y `getLastNotificationResponseAsync`
     devuelve una promesa que el test resuelve a mano.
   - Store en `loading`; `renderRouter(routes(), { initialUrl: '/' })`; store a
     `authenticated` con token y notificar; resolver la respuesta pendiente con
     `{}`; `waitFor` pathname `/alerts` → pila `["(tabs)", "alerts"]`.
   - `back` → `/home`, `["(tabs)"]`, `router.canGoBack()` `false`.
   - `push('/add-reminder')` → `["(tabs)", "add-reminder"]`. Toque en caliente =
     llamar dentro de `act` al último callback registrado en
     `addNotificationResponseReceivedListener` con `{}` → `/alerts` y
     `["(tabs)", "add-reminder", "alerts"]`; anotar el contador de alerts.
   - Segundo toque → la pila **igual** y el contador **igual**.
   - `back` → `/add-reminder` y `["(tabs)", "add-reminder"]`.
   - `afterEach(() => jest.useRealTimers())` en los dos ficheros (S12 de #95).

**Ficheros que ganan tests**

- `src/app/__tests__/detail-stack.test.tsx` —
  `describe('#114 R1: reminders y alerts viven en la raíz de src/app')`:
  `it.each` de dos filas `[ruta nueva, ruta vieja, import]` =
  `['reminders.tsx', '(tabs)/reminders.tsx', '../screens/reminders']` y
  `['alerts.tsx', '(tabs)/alerts.tsx', '../screens/alerts']` (existe la nueva, no
  la vieja, y el fuente contiene `from '<import>'`), más un `it` que asevera que el
  listado ordenado de `src/app/(tabs)/` es exactamente `['__tests__',
  '_layout.tsx', 'food.tsx', 'health.tsx', 'home.tsx', 'map.tsx',
  'profile.tsx']`. **3 tests.**
- `src/app/__tests__/layout.test.tsx` (los dobles de #95 ya bastan):
  - `describe('#114 R1: la guarda de RootStack declara reminders y alerts tras las seis')`,
    un `it`: el quinto hijo de `Stack` es el `Stack.Protected`, sus hijos son
    **ocho**, y `slice(6)` mapeado a `[type, props.name, props.dangerouslySingular]`
    es `[[Stack.Screen, 'reminders', undefined], [Stack.Screen, 'alerts', true]]`.
    **1 test.**
  - `describe('#114 R4: reminders y alerts declaran su cabecera nativa')`,
    `it.each` de `[['reminders', 't:reminders.reminders'], ['alerts',
    't:alerts.title']]` con el mismo `toEqual` de opciones que `#95 R4`. **2
    tests.**
- `src/screens/reminders/index.test.tsx` —
  `describe('#114 R5: el título vive en la cabecera nativa')`, un `it` (con el
  `beforeEach` de `R5: reminders monta con métricas y estados`; importar `es` de
  `../../i18n/catalog`): `listReminders` devuelve una promesa que el test
  resuelve; `renderReminders()`; `findByTestId('reminders-loading')` →
  `queryByText(es['reminders.reminders'])` `null`, `reminders-actions` con
  `className` `'flex-row justify-end'` y `within(...)` contiene
  `reminders-add-link`; resolver con `{ kind: 'ok', reminders: [makeReminder()] }`;
  `findByTestId(\`reminder-row-${makeReminder().id}\`)` → otra vez
  `queryByText(es['reminders.reminders'])` `null` y `reminders-add-link` visible.
  **1 test.**
- `src/screens/alerts/index.test.tsx` — ídem, `describe('#114 R5: el título vive
  en la cabecera nativa')`, un `it` (con el `beforeEach` de `#78 R4`): promesa
  controlada; `findByTestId('alerts-loading')` → `queryByText(es['alerts.title'])`
  `null`; resolver con `{ kind: 'ok', items: [makeAlert()], nextCursor: null }`;
  `findByTestId(\`alert-row-${makeAlert().id}\`)` → `queryByText(es['alerts.title'])`
  `null`, `queryByTestId('alerts-action-error')` `null` y
  `getByTestId('alerts-list').props.ListHeaderComponent` `toBeNull()`. **1 test.**
- `src/screens/add-reminder/index.test.tsx` — el doble de `expo-router` gana
  `dismissTo: jest.fn()` en `router`; `describe('#114 R7: sin mascota,
  add-reminder desapila hasta reminders')`, un `it` (con el `beforeEach` de
  `R8: formulario de alta con chips y pickers`): `renderAddReminder(false)`;
  `waitFor` → `mockRouter.dismissTo` llamado **una vez** con `'/reminders'`;
  `mockRouter.push` y `mockRouter.back` sin llamadas;
  `queryByTestId('screen-add-reminder')` y `queryByTestId('add-reminder-redirect')`
  `null`. **1 test.**

**Reparto del delta** (base `a833f153` → cierre, medido por fichero con
`bunx jest --json --runTestsByPath …`):

| Fichero | Base | Cierre | Δ |
|---|---:|---:|---:|
| `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` (nuevo) | — | 1 | +1 |
| `src/app/__tests__/reminders-alerts-stack.notification.test.tsx` (nuevo) | — | 1 | +1 |
| `src/app/__tests__/detail-stack.test.tsx` | 12 | 14 | +2 (+3 #114 R1, −1 #95 listado) |
| `src/app/__tests__/layout.test.tsx` | 15 | 18 | +3 |
| `src/screens/reminders/index.test.tsx` | 25 | 26 | +1 |
| `src/screens/alerts/index.test.tsx` | 32 | 33 | +1 |
| `src/screens/add-reminder/index.test.tsx` | 21 | 21 | 0 (+1 #114 R7, −1 R8 redirect) |
| `src/screens/home/index.test.tsx` | 140 | 140 | 0 |
| `src/app/(tabs)/__tests__/alerts.test.tsx` | 3 | 3 | 0 |
| `src/__tests__/ui-language.test.ts` | 25 | 25 | 0 |
| **Total** | **1426** | **1435** | **+9** (suites 80 → 82) |

## D9 — Inventario de aserciones heredadas que cambian

Tests de **otras specs** que cambian porque su premisa deja de ser cierta. Cada
fila dice qué hecho cambió y qué R lo cambia. Van en el commit **verde** donde su
premisa se invierte, salvo las de métricas (R6), que van en el rojo.

| # | Fichero › `describe` › `it` | Spec dueña | Cambio | R |
|---|---|---|---|---|
| 1 | `src/app/__tests__/detail-stack.test.tsx` › `#95 R2: las seis rutas de detalle viven en la raíz de src/app` › `(tabs) conserva solo las cinco pestañas y sus dos destinos existentes` | #95 | se borra: su listado lo sustituye el `it` de `#114 R1`. Nota en la fila R2 de `specs/mobile-detail-screens-to-stack/traceability.md`: `← el listado de (tabs) lo canda #114 R1` | R1 |
| 2 | `src/app/__tests__/layout.test.tsx` › `#95 R2: el layout raíz monta el provider y el Stack de detalle` › `declara cuatro rutas abiertas y las seis de detalle bajo una guarda` | #95 | `Children.toArray(protectedGroup.props.children)` gana `.slice(0, 6)` antes del `.map`, con `// #114 R1: reminders y alerts van detrás`; el resto igual | R1 |
| 3 | `src/app/(tabs)/__tests__/alerts.test.tsx` (import) | mobile-alerts-center (#78) | `import AlertsRoute from '../alerts'` → `'../../alerts'`; el `jest.mock('../../../screens/alerts')` no cambia (es relativo al test) | R1 (A14) |
| 4 | `src/screens/home/index.test.tsx` › `#78 R10: la campana vive en el hero y lleva al centro de alertas` › `usa la ruta real sin cast Href y conserva el feedback de pulsado` | #78 | `appRoutes(join(process.cwd(), 'src/app/(tabs)'))` → `appRoutes(join(process.cwd(), 'src/app'))` | R1 |
| 5 | ídem › `#70 R10: enlace a la lista de recordatorios` › `lleva a la lista de recordatorios existente` | mobile-home-reminders-section | el mismo cambio; nota en su fila R10 de `specs/mobile-home-reminders-section/traceability.md`: `← desde #114 cruza con src/app/` | R1 |
| 6 | `src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts` (`#65 R8`, `#78 R12`) | mobile-ui-language (#65), #78 | tabla de D7 | R4, R5 |
| 7 | `src/screens/alerts/index.test.tsx` › `#78 R4: …` › `pinta tres esqueletos mientras espera la primera página` | #78 | fuera las dos aserciones sobre `es['alerts.title']` (visible y `className`); el resto igual, título igual | R5 |
| 8 | ídem › `#78 R4: …` › `respeta las dimensiones, el inset automático y los safe areas` | #78 | `toEqual({ padding: 24, gap: 16, paddingBottom: 48 })`; `it` → `'respeta las dimensiones bajo cabecera nativa, el inset automático y los safe areas (#114 R6)'` | R6 |
| 9 | `src/screens/reminders/index.test.tsx` › `R5: reminders monta con métricas y estados` › `uses uniform metrics, selects the first pet, and shows row skeletons` | mobile-reminders | R5: fuera `expect(screen.getByText('Recordatorios')).toBeVisible()`; R6: `toEqual({ padding: 24, gap: 16, paddingBottom: 48 })` e `it` → `'uses the metrics under the native header, selects the first pet, and shows row skeletons (#114 R6)'` | R5, R6 |
| 10 | `src/screens/add-reminder/index.test.tsx` › `R8: formulario de alta con chips y pickers` › `redirects a cold deep-link without a selected pet` | mobile-reminders | se borra (lo sustituye `#114 R7`), y el doble de `expo-router` pierde su `Redirect`, que queda muerto. Nota en la fila R8 de `specs/mobile-reminders/traceability.md`: `← el caso sin mascota lo canda #114 R7 (A14)` | R7 |

**Verificado que no cambian**: `detail-stack.navigation.test.tsx` y
`detail-stack.guard.test.tsx` (solo recorren las seis de #95; su `routes()`
recoge las dos rutas movidas como stubs sin efecto);
`src/hooks/use-push-registration.test.tsx` (dobla `router.push` y el hook no
cambia) y `use-push-registration.navigation.test.tsx` (árbol sintético plano);
`src/components/__tests__/floating-tab-bar.test.tsx` (estado sintético con una
ruta `alerts`, sigue siendo válido como prueba del componente);
`src/app/__tests__/tabs-layout.test.tsx` y `src/app/(tabs)/__tests__/layout.test.tsx`
(`(tabs)/_layout.tsx` no cambia); `language-provider.test.tsx` (catálogo intacto);
`design-drift.test.ts`, `consistency-classnames.test.ts` y
`legibility-classnames.test.ts` (leen `src/screens/reminders` y
`src/screens/alerts`, que no se mueven; ninguno de sus recuentos toca el `Text` ni
la fila que cambian); y los tests de #97 en `reminders` y `alerts` (D5).

## Archivos afectados

Capa: **UI móvil** (`mobile-pet-tracker/`). Nada de backend, infra ni CI.

**Producción**: `src/app/_layout.tsx` (R1, R4); `src/app/reminders.tsx` y
`src/app/alerts.tsx`, movidos (R1); `src/screens/reminders/index.tsx` y
`src/screens/alerts/index.tsx` (R5, R6); `src/screens/add-reminder/index.tsx` (R7).

**Tests**: los dos nuevos de D8, más `src/app/__tests__/detail-stack.test.tsx`,
`src/app/__tests__/layout.test.tsx`, `src/app/(tabs)/__tests__/alerts.test.tsx`,
`src/screens/{reminders,alerts,add-reminder,home}/index.test.tsx`,
`src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts`.

**Docs y specs**: `docs/conventions.md` y `docs/ui-guidelines.md` (A13);
`specs/mobile-alerts-center/requirements.md` y `specs/mobile-reminders/requirements.md`
(A14); `specs/mobile-ui-language/design.md` §2 (D7); notas de trazabilidad en
`specs/mobile-detail-screens-to-stack/`, `specs/mobile-home-reminders-section/` y
`specs/mobile-reminders/` (D9).

**No se toca**: `src/hooks/use-push-registration.ts`,
`src/components/floating-tab-bar.tsx`, `src/app/(tabs)/_layout.tsx`,
`src/i18n/catalog.ts`, `src/providers/`, `src/screens/home/index.tsx`,
`src/screens/profile/index.tsx`, `app.json`, `app.config.ts` ni `package.json`.

## Coordinación con otras sesiones

- **#113** (Backend, mitad móvil de #104): candado del catálogo y `ui-copy-table`,
  en [[requirements]] §Coordinación. #113 mueve la constante; #114 no.
- **#112** toca `src/screens/home/index.test.tsx` en el mismo `describe('#70 R10')`
  que la fila 5 de D9, pero en otro `it` (`muestra feedback visual al pulsar el
  enlace`). Hunks separados; quien mergee segundo resuelve si git no puede.
- **#100** nace dentro del `Stack.Protected` de `RootStack`. Si su toque navega
  al detalle con `data.alertId`, debe revisar la interacción con
  `dangerouslySingular` de `alerts` y reactivar el sentido del reset de #97 R4
  (D5).
- `init.sh` aborta con dos features `in_progress` a la vez (memoria del leader):
  si #113 y #114 se solapan, el leader decide cuál lleva el estado.

## Alternativas descartadas

- **Extender los tests de navegación de #95**: S11 lo impide y mezclaría evidencias (D8).
- **Un grupo `(app)/` o `(lists)/` con su propio `Stack`**: añade un navegador
  anidado y una segunda guarda para dos pantallas; #95 ya lo descartó por coste.
- **"Nuevo" en `headerRight`**: navegación en el layout y opciones distintas de
  las otras siete (D3).
- **Título en el cuerpo con `title: ''` en la cabecera** (como `docs` y `pairing`
  en #95): la carta pide el título en la cabecera cuando existe, y aquí es un
  rótulo fijo, no un dato.
- **`router.push('/alerts', { dangerouslySingular: true })` en el hook**: toca el
  hook y remonta la pantalla (D2).
- **`unstable_settings.anchor`**: innecesario (E5) y carga `(tabs)` bajo
  `reset-password`.
- **Retirar los resets de foco de #97 como hizo #95 R7 con los de #63**: en
  `reminders` siguen haciendo falta; en `alerts` volverían con #100 (D5).
- **Sembrar la caché con el overlay `acked` al desmontar**: ~10 líneas para un
  efecto que dura un refetch y que el backend absorbe (D5).
- **Mantener `<Redirect>` y marcar `reminders` como singular**: `Redirect` es un
  `replace`, y el `case 'REPLACE'` de `StackRouter.js` solo consulta `getId` entre
  las rutas precargadas, no en la pila: seguiría habiendo dos `reminders`.
