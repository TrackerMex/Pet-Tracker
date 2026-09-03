---
feature: "mobile-device-pairing"
status: draft   # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-device-pairing]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D11) para las decisiones técnicas,
> `docs/conventions.md` §Convenciones de la app móvil (route delgado +
> screen, dimensiones uniformes) y `docs/ui-guidelines.md` (carta de UI:
> aplica entera — grep-clean, heroui-native, `@expo/ui/community/*`,
> Skeleton dimensionado, C8 de `CHECKPOINTS.md`).
>
> Fuente: `feature_list.json` id 42 (description + acceptance_criteria).
> Contratos verificados contra el código real el 2026-09-03
> (`backend-pet-tracker/src/modules/devices/**`,
> `backend-pet-tracker/src/modules/subscriptions/**`,
> `backend-pet-tracker/test/devices.e2e-spec.ts`,
> `backend-pet-tracker/test/device-subscriptions.e2e-spec.ts`,
> `mobile-pet-tracker/src/api/*.ts`, `src/screens/reminders/`,
> `src/screens/reset-password/`, `src/app/(tabs)/home.tsx`,
> `src/screens/profile/index.tsx`).
>
> Solo se toca `mobile-pet-tracker/` (isla bun + jest-expo). **Ningún
> archivo del backend cambia**: la app consume los contratos existentes de
> #7/#25/#26 tal cual (D1). Skills a cargar antes de implementar:
> `expo-overview` → `expo-router` (ruta nueva dentro de `(tabs)`) y
> `expo-native-ui` (formulario, estados); `appllama-app-design-skill` con
> los límites de la carta.

## Contexto fijo (no reabrir)

Todo lo de esta sección está verificado en el código y **cerrado**. Codex
no tiene acceso a la conversación que originó esta spec: nada de aquí se
renegocia durante la implementación.

### Contratos del backend que consume esta feature (#7, #25, #26)

Prefijo global `v1`; todas las rutas exigen `Authorization: Bearer <jwt>`
(401 sin él). Detalle completo, cuerpos exactos y códigos en [[design]] §D1.

| Ruta | Éxito | Errores que la app distingue |
|---|---|---|
| `POST /v1/devices/claim` body `{ petId: uuid, activationCode: string(1..64, trim) }` | `201` con las 5 claves de `DeviceStatus` (`model`, `batteryPct`, `connectivity`, `lastMessageAt`, `esn`) | `400` Validation failed · `402 code DEVICE_SUBSCRIPTION_REQUIRED` · `403` (miembro no owner) · `404` sin `code` (mascota inaccesible) · `404 code DEVICE_NOT_FOUND` · `409 code DEVICE_ALREADY_ASSIGNED` · `409 code PET_ALREADY_HAS_DEVICE` |
| `DELETE /v1/pets/:petId/device` | `204` sin body | `403` (no owner) · `404` genérico o `404 code DEVICE_NOT_ASSIGNED` |
| `GET /v1/pets` y `GET /v1/pets/:petId` | `200`; cada perfil trae `device: DeviceStatus \| null` (R12 de #7) | — |
| `GET /v1/pets/:petId/positions/last` | `200` (`null` o posición) **solo si `isPetTracked(petId)`** | `402 code DEVICE_SUBSCRIPTION_REQUIRED` cuando la mascota no tiene collar activo con suscripción vigente |

- **No existe endpoint HTTP de suscripciones.** `SubscriptionsModule` solo
  exporta `SUBSCRIPTION_REPOSITORY` (`isPetTracked`) y `PetTrackingGuard`;
  el estado de plan solo es observable desde fuera como el `402` de las
  rutas de tracking. Esta spec no añade ninguno (D2).
- `activationCode` es la **única** credencial de claim (#26): la app nunca
  envía `imei`/`esn`/`serialNumber`.
- El claim exige suscripción vigente del collar (`402` si no la tiene,
  #25). Por tanto un `201` implica que la mascota queda **tracked** en ese
  instante.
- Liberar el collar (`DELETE`) no toca la suscripción: el collar vuelve a
  `available` y un nuevo claim responde `201` (R13 de #7).

### Diseño (Figma Make) — lo que hay y lo que no

- El Make `K3GsL0HHUCW3AaFj3osx0B` fue accesible vía MCP el 2026-09-03
  (índice de 63 fuentes + 139 imágenes; `get_metadata`/`get_screenshot` no
  aplican a archivos Make). Su `src/app/App.tsx` es el volcado versionado
  en `specs/mobile-figma-polish/design-src/App.tsx`.
- La lista `FrameId` (línea 1705) **no contiene ninguna pantalla de
  pairing ni "tracker is ready"**. El único frame relacionado es
  `gpsconfig` ("Config. Dispositivo GPS", líneas 1634–1700): pantalla de
  **estado** del collar ya vinculado (batería, conexión, geocercas, alertas,
  botón "Apagar dispositivo GPS"). El perfil del diseño (líneas 724–742)
  enlaza a ella con la fila "Configuración del Dispositivo GPS".
- **No hay escaneo QR en el diseño → no se instala `expo-camera`** (D3).
  La credencial se teclea (código impreso en la caja, #24).
- Las vistas de formulario y de éxito se definen en esta spec (D3) con el
  lenguaje visual del Make (secciones en `Card`, pill "GPS activo") y las
  pantallas existentes (`add-pet`, `reset-password`, `reminders`).

### Estado móvil verificado

- Patrón de cliente API: funciones puras con `fetchFn: typeof fetch = fetch`
  inyectable, resultado discriminado por `kind`, helpers `getJson` /
  `postJson` / `deleteJson` / `readJson` de `src/api/http.ts`. Tests en
  `src/api/__tests__/*.test.ts` mockeando solo `fetchFn`.
- Patrón de pantalla (desde #39): route delgado en `src/app/(tabs)/<x>.tsx`
  + cuerpo en `src/screens/<x>/index.tsx` + test junto al cuerpo. Las rutas
  hijas de `(tabs)` heredan el redirect de auth y `SelectedPetProvider`
  (`src/app/(tabs)/_layout.tsx`); el `FloatingTabBar` solo pinta los 5 tabs,
  así que una ruta extra no aparece en la barra (`reminders`, `pets/add`).
- Selección de mascota: `listPets` + `useApi` + `usePetSelection` +
  `PetSwitcher` (idéntico a `src/screens/reminders/index.tsx`).
- `useApi` cierra sesión sola ante `kind: 'unauthorized'` en los fetch de
  carga; las acciones (submit) llaman `signOut()` explícitamente.
- `PetProfile.device: DeviceStatus | null` ya existe en `src/api/types.ts`
  y `listPets` lo devuelve por mascota: la pantalla **no necesita** un
  `GET /pets/:petId/device` propio (D5).
- Home ya muestra la collar card con `Free` / `No collar — health only`
  cuando `device === null`; el perfil ya muestra la fila `Dispositivo GPS`
  con `pet.device?.model`. Ninguno enlaza a ninguna pantalla de pairing.

### Gate humano (bloquea el cierre, no delegable a IA)

**G1** — smoke en **dev build de Android** (nunca Expo Go) contra el
backend local con `SIM_MODE=true` y los collares simulados
(`pnpm run seed:devices`: `ACT-001..003`, suscripción `grandfathered`
activa). Guion completo en [[design]] §D11. Si hay un collar real
aprovisionado con `provision:device` (#24) y `WIALON_TOKEN`, se repite el
claim feliz con su `activation_code`; no es obligatorio para cerrar.

## Requisitos funcionales

### Clientes API (`src/api/`)

- **R1**: WHEN se invoca `claimDevice(baseUrl, token, { petId, activationCode }, fetchFn)`
  — función nueva exportada por `mobile-pet-tracker/src/api/devices.ts` —
  THE SYSTEM SHALL hacer exactamente un `POST` a
  `${baseUrl}/devices/claim` con `Authorization: Bearer <token>`,
  `Content-Type: application/json` y body `JSON.stringify({ petId, activationCode })`
  (sin ninguna otra clave), y devolver `ClaimDeviceState` según esta tabla:
  `201` con body objeto que contenga las claves `model` y `esn` →
  `{ kind: 'ok', device }` (`device` tipado como `DeviceStatus` de
  `src/api/types.ts`); `201` con body sin esas claves o JSON inválido →
  `{ kind: 'error' }`; `400` → `{ kind: 'invalid' }`; `401` →
  `{ kind: 'unauthorized' }`; `402` → `{ kind: 'subscription-required' }`;
  `403` → `{ kind: 'forbidden' }`; `404` con `body.code === 'DEVICE_NOT_FOUND'`
  → `{ kind: 'not-found' }`; `409` con `body.code === 'DEVICE_ALREADY_ASSIGNED'`
  → `{ kind: 'already-claimed' }`; `409` con `body.code === 'PET_ALREADY_HAS_DEVICE'`
  → `{ kind: 'pet-has-device' }`; cualquier otro `404`/`409` (sin `code`
  reconocido) o cualquier otro status → `{ kind: 'error' }`; rechazo de
  `fetchFn` → `{ kind: 'unreachable', message }`; `baseUrl` `undefined` o
  `''` → `{ kind: 'missing-config' }` sin invocar `fetchFn`.
  Test: `src/api/__tests__/devices.test.ts` →
  `describe('R1: claimDevice publica el claim y mapea la respuesta por kind')`.

- **R2**: WHEN se invoca `releaseDevice(baseUrl, token, petId, fetchFn)` —
  función nueva exportada por `src/api/devices.ts` — THE SYSTEM SHALL hacer
  exactamente un `DELETE` a `${baseUrl}/pets/${petId}/device` con
  `Authorization: Bearer <token>` y devolver `ReleaseDeviceState`: `204` →
  `{ kind: 'ok' }`; `404` (con o sin `code`) → `{ kind: 'not-assigned' }`;
  `403` → `{ kind: 'forbidden' }`; `401` → `{ kind: 'unauthorized' }`;
  otro status → `{ kind: 'error' }`; rechazo → `{ kind: 'unreachable', message }`;
  sin `baseUrl` → `{ kind: 'missing-config' }` sin fetch.
  Test: `src/api/__tests__/devices.test.ts` →
  `describe('R2: releaseDevice libera el collar y mapea por kind')`.

- **R3**: WHEN se invoca `getPetTracking(baseUrl, token, petId, fetchFn)` —
  función nueva exportada por `mobile-pet-tracker/src/api/subscriptions.ts`
  — THE SYSTEM SHALL hacer exactamente un `GET` a
  `${baseUrl}/pets/${petId}/positions/last` con `Authorization: Bearer <token>`
  (delegando en `getLastPosition` de `src/api/positions.ts`, D2) y devolver
  `PetTrackingState`: `402` → `{ kind: 'ok', tracked: false }`; `200` (body
  `null` o posición válida) → `{ kind: 'ok', tracked: true }`; `401` →
  `{ kind: 'unauthorized' }`; otro status o body `200` malformado →
  `{ kind: 'error' }`; rechazo → `{ kind: 'unreachable', message }`; sin
  `baseUrl` → `{ kind: 'missing-config' }` sin fetch.
  Test: `src/api/__tests__/subscriptions.test.ts` →
  `describe('R3: getPetTracking deriva tracked/free del gate 402 de positions/last')`.

### Pantalla `/pairing` (`src/app/(tabs)/pairing.tsx` → `src/screens/pairing/index.tsx`)

- **R4**: WHEN se navega a `/pairing` THE SYSTEM SHALL renderizar
  `PairingScreen` (export nombrado de `src/screens/pairing/index.tsx`)
  desde el route delgado `src/app/(tabs)/pairing.tsx` (export default
  `PairingRoute`), dentro del grupo `(tabs)` — hereda auth redirect y
  `SelectedPetProvider` — con: `ScrollView testID="screen-pairing"` y las
  dimensiones uniformes (`contentContainerStyle` con `padding: 24`,
  `gap: 16`, `paddingTop: insets.top + 12`, `paddingBottom: insets.bottom + 96`);
  botón atrás `testID="pairing-back"` que llama `router.back()`; carga de
  mascotas con `listPets(process.env.EXPO_PUBLIC_API_URL, token)` vía
  `useApi` + `usePetSelection` y refetch en `useFocusEffect`; WHILE
  `pets.data === undefined` un bloque `testID="pairing-skeleton"` con
  `Skeleton` de heroui dimensionados como el contenido final (sin Spinner);
  IF `pets.data.kind ∈ {error, unreachable, missing-config}` THEN texto
  `testID="pairing-error-pets"` `Something went wrong` y botón
  `testID="pairing-retry"` que invoca `pets.refetch`; IF `pets.data.kind === 'ok'`
  con lista vacía THEN texto `testID="pairing-no-pets"` `Add a pet first`;
  IF hay mascotas THEN el `PetSwitcher` compartido (`pets`, `selectedPetId`,
  `onSelect: selectPet`).
  Test: `src/screens/pairing/index.test.tsx` →
  `describe('R4: /pairing monta dentro de (tabs) con selector de mascota y estados de carga')`.

- **R5**: WHILE la mascota seleccionada tiene `device === null` (según
  `listPets`) y la pantalla no está en fase `ready`, THE SYSTEM SHALL
  mostrar la **vista de vinculación**: título `Pair collar`; nota
  `testID="pairing-plan-free"` con el texto exacto
  `Free plan — health only. Pair a collar with an active plan to see the map.`
  dentro de un `Card variant="secondary"`; `TextInput testID="activation-code-input"`
  (label `Activation code`, ayuda `Printed on the collar box`,
  `autoCapitalize="characters"`, `autoCorrect={false}`, `maxLength={64}`);
  botón `testID="pairing-submit"` con label `Pair collar`, **deshabilitado**
  (`isDisabled`) mientras `code.trim() === ''` o hay una petición en vuelo;
  al montar la vista **no** se invoca `claimDevice`; al pulsar el botón se
  invoca `claimDevice` **exactamente una vez** con
  `(process.env.EXPO_PUBLIC_API_URL, token, { petId: selectedPetId, activationCode: code.trim() })`.
  Test: `src/screens/pairing/index.test.tsx` →
  `describe('R5: sin collar muestra el formulario de vinculación y publica el claim solo al enviar')`.

- **R6**: IF `claimDevice` resuelve con un `kind` distinto de `ok` THEN THE
  SYSTEM SHALL mantener el formulario, re-habilitar `pairing-submit` y
  mostrar `Text testID="pairing-error"` (`selectable`) con el mensaje
  exacto: `not-found` e `invalid` →
  `Invalid activation code. Check the code printed on the box.`;
  `already-claimed` → `This collar is already paired to another pet.`;
  `pet-has-device` → `This pet already has a collar. Unpair it first.`;
  `subscription-required` →
  `This collar has no active plan. Contact support to activate it.`;
  `forbidden` → `Only the owner can pair a collar.`; `unreachable` →
  `Cannot reach server`; `error` y `missing-config` → `Something went wrong`;
  `unauthorized` → invoca `signOut()` de `useAuth` sin mostrar mensaje.
  Test: `src/screens/pairing/index.test.tsx` →
  `describe('R6: el claim mapea cada kind a su mensaje y permite reintentar')`.

- **R7**: WHEN `claimDevice` resuelve `{ kind: 'ok', device }` THE SYSTEM
  SHALL pasar a fase `ready` (estado local de la pantalla) y renderizar la
  **vista "tracker is ready"** `testID="pairing-ready"`: título exacto
  `Tracker is ready`; subtítulo `<nombre de la mascota>'s collar is paired. GPS tracking is on.`;
  `Card` con filas `Model` (`testID="ready-model"`, `device.model ?? '—'`)
  y `ESN` (`testID="ready-esn"`, `device.esn ?? '—'`); botón primario
  `testID="ready-map"` label `View on map` que resetea la fase y llama
  `router.push('/map')`; enlace `testID="ready-done"` label `Done` que
  resetea la fase y llama `router.back()`; el formulario
  (`activation-code-input`, `pairing-submit`) **no** está montado en esta
  vista; además se invoca `pets.refetch()` tras el `ok` para que la vuelta
  a `/pairing` muestre la vista de estado (R8), nunca el formulario.
  Test: `src/screens/pairing/index.test.tsx` →
  `describe('R7: tras el 201 muestra "Tracker is ready" con el collar y sus CTAs')`.

- **R8**: WHILE la mascota seleccionada tiene `device !== null` (según
  `listPets`) y la pantalla no está en fase `ready`, THE SYSTEM SHALL
  mostrar la **vista de estado** (GpsConfig del diseño): título
  `GPS device`; `Card testID="device-status-card"` con filas `Model`
  (`testID="device-model"`), `Battery` (`testID="device-battery"`,
  `` `${batteryPct}%` `` o `—`), `Connection` (`testID="device-connectivity"`,
  valor o `—`), `Last message` (`testID="device-last-message"`,
  `new Date(lastMessageAt).toLocaleString()` o `No messages yet`) y `ESN`
  (`testID="device-esn"`); y el **estado de plan** obtenido con
  `getPetTracking(baseUrl, token, selectedPetId)` vía `useApi` (refetch en
  `useFocusEffect`): WHILE carga → `Skeleton testID="plan-skeleton"`; IF
  `tracked: true` → pill `testID="plan-tracked"` texto `GPS tracking active`
  (`bg-accent-soft`, texto `text-success`); IF `tracked: false` → bloque
  `testID="plan-free"` texto exacto
  `Free plan — health only. This collar has no active plan.`; IF
  `kind ∈ {error, unreachable, missing-config}` → texto
  `testID="plan-unknown"` `Plan status unavailable`. `getPetTracking` **no**
  se invoca cuando `device === null` (R5) ni en fase `ready` (R7).
  Test: `src/screens/pairing/index.test.tsx` →
  `describe('R8: con collar muestra el estado del dispositivo y el plan tracked/free según subscriptions')`.

- **R9**: WHEN en la vista de estado se pulsa `testID="device-unpair"`
  (label `Unpair collar`, estilo destructivo `bg-danger` /
  `text-accent-foreground`) THE SYSTEM SHALL abrir `Alert.alert` de
  react-native con título `Unpair collar?`, mensaje
  `Location history stays, but live tracking stops until you pair a collar again.`
  y botones `Cancel` (`style: 'cancel'`) y `Unpair` (`style: 'destructive'`);
  `releaseDevice` **no** se invoca al pulsar `device-unpair` ni `Cancel`;
  al confirmar `Unpair` se invoca `releaseDevice(baseUrl, token, selectedPetId)`
  exactamente una vez y: `ok` o `not-assigned` → `pets.refetch()` (con el
  `device: null` resultante la pantalla vuelve a R5); `forbidden` →
  `pairing-error` con `Only the owner can unpair the collar.`; `unreachable`
  → `Cannot reach server`; `error` / `missing-config` →
  `Something went wrong`; `unauthorized` → `signOut()`. Mientras la
  petición está en vuelo `device-unpair` queda deshabilitado.
  Test: `src/screens/pairing/index.test.tsx` →
  `describe('R9: desvincular pide confirmación nativa, libera el collar y vuelve al formulario')`.

### Puntos de entrada

- **R10**: THE SYSTEM SHALL enlazar a `/pairing` desde dos sitios, sin
  alterar ningún texto ni `testID` existente de esas pantallas: (a) en
  `src/screens/profile/index.tsx`, una fila `Pressable`
  `testID="pairing-link"` (mismo markup que `documents-link`:
  `accessibilityRole="button"`, `rounded-xl bg-default px-3 py-2`, chevron
  `›`) con label exacto `Configuración del Dispositivo GPS`, colocada
  inmediatamente después de `documents-link` (solo visible con mascota
  cargada) y que invoca `router.push('/pairing')`; (b) en
  `src/app/(tabs)/home.tsx`, dentro de la `collar-card` y **solo** cuando
  `detail.data.pet.device === null`, un `Pressable testID="collar-pair-link"`
  (`accessibilityRole="button"`, touch target ≥ 44pt) con label `Pair a collar`
  que invoca `router.push('/pairing')`; con collar presente
  `collar-pair-link` no se renderiza.
  Tests: `src/screens/profile/index.test.tsx` →
  `describe('R10 (mobile-device-pairing): el perfil enlaza a /pairing')`;
  `src/app/(tabs)/__tests__/home.test.tsx` →
  `describe('R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing')`.
  Las suites existentes de perfil y home siguen verdes sin reescribir
  asserts.

### Conformidad con la carta de UI (C8)

- **R11**: THE SYSTEM SHALL mantener `src/screens/pairing/index.tsx` (y
  cualquier sub-componente privado en `src/screens/pairing/`) grep-clean
  según `docs/ui-guidelines.md` §3 — cero hex, cero clases arbitrarias
  `[...]`, cero `StyleSheet.create`, cero shadow/elevation legacy — usando
  el `Card` compartido (`from '../../components/card'`), el `PetSwitcher`
  compartido (`from '../../components/pet-switcher'`) y las cuatro
  dimensiones uniformes literales (`padding: 24`, `gap: 16`,
  `insets.top + 12`, `insets.bottom + 96`).
  Test: `src/__tests__/design-drift.test.ts` →
  `describe('R11 (mobile-device-pairing): pairing usa el Card compartido y las dimensiones uniformes')`
  (mismo estilo que el describe `R3` de ese archivo: lee el fuente y
  asierta los cinco literales), más el describe `C8` ya existente que
  escanea todo `src/`.

## Fuera de alcance

- **Escaneo QR / `expo-camera`**: el diseño no lo muestra (D3). Si algún
  día la caja trae QR, es feature aparte con su spec y su evaluación de
  permisos de cámara en dev build.
- **Endpoint de suscripción en el backend** (`GET /v1/pets/:petId/subscription`
  con `planCode`/`currentPeriodEnd`): fuera; el estado se deriva del `402`
  (D2). Queda anotado como deuda para el leader.
- **Pagos / activación de plan desde la app**: #25 dejó Stripe fuera; el
  `402` del claim solo informa (`Contact support`).
- **Secciones Geocercas y Alertas del frame `gpsconfig`**: dependen de #41
  (`mobile-geofences`, pending) y de un centro de alertas móvil inexistente.
- **Hero con foto de mascota** del frame `gpsconfig`: `PetHero` es privado
  de `profile`; promoverlo a `src/components/` toca perfil y sus tests sin
  aportar al flujo. Se usa `PetSwitcher` + título.
- **Animaciones nuevas y haptics**: ninguna (no hay precedente de
  `entering=` en pantallas; `expo-haptics` no está instalado).
- **iOS**: cubierto por #60; esta feature no añade nada específico.
- **Modificar `src/api/positions.ts`, `pets.ts` o `types.ts`**: no hace
  falta; `DeviceStatus` ya existe.

## Deuda que esta feature deja anotada (para el backlog del leader)

- Endpoint de entitlement propio (`GET /v1/pets/:petId/subscription`) que
  devuelva `status`, `planCode` y `currentPeriodEnd`; cuando exista,
  `getPetTracking` cambia su sonda por ese GET sin tocar la pantalla.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
