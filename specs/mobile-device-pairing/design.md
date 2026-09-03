---
feature: "mobile-device-pairing"
status: draft   # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-device-pairing]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> `docs/conventions.md` §Convenciones de la app móvil y
> `docs/ui-guidelines.md` (carta de UI). Solo se toca `mobile-pet-tracker/`.

## Decisiones técnicas

### D1 — Contratos backend, copiados del código (no se inventa nada)

Verificado el 2026-09-03 en `backend-pet-tracker/src/modules/devices/` y
`backend-pet-tracker/src/modules/subscriptions/`. Prefijo global `v1`.

**`POST /v1/devices/claim`** — `DevicesController.claim`
(`infrastructure/devices.controller.ts`), DTO `ClaimDeviceSchema`
(`application/dto/claim-device.dto.ts`):

```
body: { petId: z.uuid(), activationCode: z.string().trim().min(1).max(64) }
       (claves desconocidas se descartan en silencio, #26 D1)
201:  { model, batteryPct, connectivity, lastMessageAt, esn }   ← DeviceStatusResponse
      (device-status.mapper.ts; lastMessageAt ISO string | null)
400:  { statusCode: 400, message: 'Validation failed', errors: [{ path, message }] }
401:  guard JWT global
402:  { statusCode: 402, code: 'DEVICE_SUBSCRIPTION_REQUIRED', message: 'Pet tracking requires an active device subscription' }
403:  ForbiddenException genérica (InsufficientPetRoleError: miembro activo no owner)
404:  NotFoundException genérica sin `code` (PetNotAccessibleError: mascota inexistente o sin membresía)
404:  { statusCode: 404, code: 'DEVICE_NOT_FOUND', message: 'Device not found' }
409:  { statusCode: 409, code: 'DEVICE_ALREADY_ASSIGNED', message: 'Device is not claimable' }
      (fila activa en pet_devices, status 'inactive' o carrera 23505)
409:  { statusCode: 409, code: 'PET_ALREADY_HAS_DEVICE', message: 'Pet already has an active device' }
```

Orden de evaluación en `ClaimDeviceUseCase.execute`: membresía (404) → rol
(403) → device (404) → disponibilidad (409) → mascota con collar (409) →
suscripción (402) → transacción de claim. Tests fuente:
`test/devices.e2e-spec.ts` R3–R9 y `R7 (device-subscriptions #25)`.

**`DELETE /v1/pets/:petId/device`** — `PetDeviceController.release`
(`infrastructure/pet-device.controller.ts`, `@RequirePetRole('owner')`):

```
204:  sin body
403:  ForbiddenException genérica (miembro no owner)
404:  genérico del PetAccessGuard (sin membresía / uuid malformado)
404:  { statusCode: 404, code: 'DEVICE_NOT_ASSIGNED', message: 'Pet has no active device' }
```

**`GET /v1/pets/:petId/device`** existe (`200` `DeviceStatusResponse | null`)
pero **no se usa** (D5): `GET /v1/pets` ya trae `device` por mascota.

**`GET /v1/pets/:petId/positions/last`** — gate `PetTrackingGuard`
(`subscriptions/infrastructure/guards/pet-tracking.guard.ts`):

```
402:  { statusCode: 402, code: 'DEVICE_SUBSCRIPTION_REQUIRED', message: 'Pet tracking requires an active device subscription' }
      ← isPetTracked(petId) === false: sin collar activo, o collar sin fila
        device_subscriptions con status 'active' y current_period_end > now() - 3 días (gracia)
200:  null (sin cache) o { lat, lng, ts, accuracy, battery, staleSeconds }
```

Tests fuente: `test/device-subscriptions.e2e-spec.ts`
`R9 (device-subscriptions #25)` (las 10 rutas gateadas; `GET /pets/:id`,
`GET|DELETE /pets/:id/device`, salud y reminders **no** están gateadas) y
`R3` (derivación con gracia de 3 días).

### D2 — Estado free vs tracked: sonda sobre `positions/last` (no hay endpoint)

`SubscriptionsModule` no expone HTTP. El backend tiene **un único**
derivador (`isPetTracked`, #25) y lo aplica como `402` en las rutas de
tracking; ese `402` *es* el estado de suscripción tal como el backend lo
ve (incluida la gracia). `src/api/subscriptions.ts` expone:

```ts
export type PetTrackingState =
  | { kind: 'ok'; tracked: boolean }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function getPetTracking(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<PetTrackingState>
```

Implementación: delega en `getLastPosition(baseUrl, token, petId, fetchFn)`
de `src/api/positions.ts` (ya mapea `402 → 'no-tracking'`) y traduce
`'no-tracking' → { kind: 'ok', tracked: false }`, `'ok' → { kind: 'ok', tracked: true }`,
el resto pasa tal cual. `positions/last` es la ruta gateada más barata
(lectura de la cache jsonb de `pets`) y no tiene efectos.

`// ponytail: sonda sobre positions/last; cuando exista GET /pets/:id/subscription se cambia aquí sin tocar pantallas`

El test de R3 mockea **`fetchFn`**, no el módulo `positions`, y asierta la
URL `http://example.test/v1/pets/pet-1/positions/last` con el bearer.

### D3 — Diseño: Make accesible, sin frame de pairing, sin QR

- Lectura del Make `K3GsL0HHUCW3AaFj3osx0B` por MCP (`get_design_context`,
  nodeId `0:1`, 2026-09-03): devolvió el índice de fuentes (63) e imágenes
  (139), el mismo conjunto documentado en
  `specs/mobile-figma-polish/design-src/README.md`. `get_metadata` y
  `get_screenshot` no soportan archivos Make. La fuente de verdad usada es
  el volcado versionado `specs/mobile-figma-polish/design-src/App.tsx`.
- `FrameId` (App.tsx:1705) = splash, login, forgot, register, home, map,
  health, food, profile, docs, addmedical, reminders, addreminder,
  **gpsconfig**, geofences, mealschedule, weightlog, addpet. **No hay**
  frame de pairing, de entrada de código ni "tracker is ready"; **no hay**
  QR ni cámara en ninguna parte del Make.
- **Decisión cerrada: sin QR, sin `expo-camera`.** La credencial se escribe
  a mano (`TextInput`, mayúsculas, 64 chars). Evaluación pedida por la
  feature: `expo-camera` exigiría permiso de cámara, un config plugin,
  regenerar el dev build y un flujo de fallback manual de todos modos; sin
  QR impreso no aporta nada. Si la caja trae QR en el futuro, es feature
  propia (dev build de Android, nunca Expo Go).
- `gpsconfig` (App.tsx:1634–1700) se traduce a la **vista de estado** de
  R8: sección "Estado del dispositivo" (batería, conexión) → `Card` con
  filas `Model / Battery / Connection / Last message / ESN`; pill "GPS
  activo" → pill `plan-tracked` / bloque `plan-free`; botón rojo claro
  "Apagar dispositivo GPS" → `device-unpair` (`bg-danger`). Geocercas y
  Alertas fuera (dependen de #41 y de un centro de alertas móvil que no
  existe).
- Perfil del Make (App.tsx:724–742): fila "Configuración del Dispositivo
  GPS" con chevron → `pairing-link` de R10 con ese label literal.
- Vista de vinculación (R5) y vista "tracker is ready" (R7) se definen aquí
  con el lenguaje del Make: `Card variant="secondary"` para la nota de
  plan (verde suave, como las notas "¡Casi listo!" de addpet:1287),
  icono en círculo `bg-accent-soft` + título `text-2xl font-black` para el
  éxito (mismo esqueleto que el `succeeded` de `reset-password`).

### D4 — Ubicación de la ruta: `src/app/(tabs)/pairing.tsx`

`feature_list.json` sugiere `src/app/pairing/`; se sigue en cambio el
precedente de `reminders.tsx`, `add-reminder.tsx`, `pets/add.tsx` y
`pets/[petId]/docs.tsx`: dentro de `(tabs)` la ruta hereda el
`Redirect` a `/login` y el `SelectedPetProvider` de `_layout.tsx`, y el
`FloatingTabBar` la ignora (solo pinta `TABS`). Fuera de `(tabs)` habría
que duplicar el provider y el guard. `files_affected` es pista, no
restricción (`docs/specs.md` §Schema).

```ts
// src/app/(tabs)/pairing.tsx
import { PairingScreen } from '../../screens/pairing';

export default function PairingRoute() {
  return <PairingScreen />;
}
```

### D5 — Una pantalla, tres vistas, cero llamadas extra

`PairingScreen` (`src/screens/pairing/index.tsx`) decide qué vista pintar
con dos entradas: `phase: 'idle' | 'ready'` (estado local, con
`readyDevice: DeviceStatus | null`) y el `device` de la mascota
seleccionada en `pets.data.pets`:

```
phase === 'ready'            → vista ready (R7)
device === null              → vista de vinculación (R5/R6)
device !== null              → vista de estado (R8/R9)
```

- `listPets` ya devuelve `device` por mascota (R12 de #7): no se añade
  `getPetDevice` a `devices.ts` (YAGNI). Tras claim y tras release se
  llama `pets.refetch()`; además `useFocusEffect` refetchea al volver.
- `getPetTracking` solo se instancia (`useMemo` → `useApi`) cuando
  `device !== null && phase === 'idle'`; en los otros casos el `fn` es
  `null` y `useApi` no llama nada.
- Los sub-componentes privados (`claim-form.tsx`, `device-status.tsx`,
  `tracker-ready.tsx`) **pueden** vivir en `src/screens/pairing/` si el
  `index.tsx` crece; nunca en `src/components/` (regla de promoción de la
  carta §4). Los tests importan solo `PairingScreen` desde `'.'` y el
  route desde `'../../app/(tabs)/pairing'`.
- Puerta de un solo sentido: la vista ready no tiene camino de vuelta al
  formulario; sus dos CTAs (`ready-map` → `router.push('/map')`,
  `ready-done` → `router.back()`) resetean `phase` a `'idle'` antes de
  navegar, y como `pets` ya se refetcheó, `/pairing` reabre en la vista de
  estado.

### D6 — Confirmación de unpair con `Alert.alert` nativo

Acción destructiva de un paso → diálogo nativo del sistema
(`Alert.alert(title, message, [{ text: 'Cancel', style: 'cancel' }, { text: 'Unpair', style: 'destructive', onPress }])`).
Es la primitiva nativa de la plataforma para esto (HIG y Material), cero
dependencias y cero layout. Descartado el `@expo/ui/community/bottom-sheet`
que usa `reminders` para borrar: allí el sheet muestra una referencia rica
(título del recordatorio); aquí basta un sí/no. `Alert` no está en la
lista de componentes RN prohibidos de la carta §5 (Picker, SafeAreaView,
WebView). En tests: `jest.spyOn(Alert, 'alert')` y ejecutar el `onPress`
del botón `Unpair` de la llamada capturada.

### D7 — Copy: inglés, strings exactos

La mayoría de pantallas post-#39 están en inglés (`home`, `map`,
`reminders`, `add-pet`, `reset-password`); el perfil mezcla. La pantalla
nueva va en inglés; la única excepción es el label del enlace en perfil,
que copia el literal del Make (`Configuración del Dispositivo GPS`) para
convivir con `Documentos`/`Información`.

| Dónde | testID | Texto exacto |
|---|---|---|
| Título R5 | — | `Pair collar` |
| Nota plan R5 | `pairing-plan-free` | `Free plan — health only. Pair a collar with an active plan to see the map.` |
| Label input R5 | — | `Activation code` |
| Ayuda input R5 | — | `Printed on the collar box` |
| Botón R5 | `pairing-submit` | `Pair collar` |
| Error R6 | `pairing-error` | ver tabla de R6 en [[requirements]] |
| Título R7 | — | `Tracker is ready` |
| Subtítulo R7 | — | `` `${pet.name}'s collar is paired. GPS tracking is on.` `` |
| Filas R7 | `ready-model`, `ready-esn` | labels `Model`, `ESN`; valor o `—` |
| CTAs R7 | `ready-map`, `ready-done` | `View on map`, `Done` |
| Título R8 | — | `GPS device` |
| Filas R8 | `device-model`, `device-battery`, `device-connectivity`, `device-last-message`, `device-esn` | labels `Model`, `Battery`, `Connection`, `Last message`, `ESN` |
| Plan R8 | `plan-tracked` / `plan-free` / `plan-unknown` | `GPS tracking active` / `Free plan — health only. This collar has no active plan.` / `Plan status unavailable` |
| Botón R9 | `device-unpair` | `Unpair collar` |
| Alert R9 | — | `Unpair collar?` / `Location history stays, but live tracking stops until you pair a collar again.` / `Cancel` / `Unpair` |
| Perfil R10 | `pairing-link` | `Configuración del Dispositivo GPS` |
| Home R10 | `collar-pair-link` | `Pair a collar` |
| Estados R4 | `pairing-error-pets` / `pairing-retry` / `pairing-no-pets` | `Something went wrong` / `Retry` / `Add a pet first` |

Filas de valor: mismo `InfoRow` que `profile` (label `text-sm text-muted`,
valor `text-sm font-semibold text-foreground`, separador `border-separator`)
reimplementado en `src/screens/pairing/` — el de `profile` es privado y
usa `No registrado` como fallback; aquí el fallback es `—`. Todo texto de
valor y de error lleva `selectable` (carta §Micro-reglas).

### D8 — Sin animación nueva, sin haptics

Ninguna pantalla de `src/screens/` usa `entering=` hoy; la carta permite
FadeIn para resultados de fetch pero no lo exige. Se omite (YAGNI);
`progress/audit_animations_mobile.md` es el sitio para proponerlo después.
`expo-haptics` no está instalado; no se añade.

### D9 — Tests: patrón y nombres

- API (`src/api/__tests__/devices.test.ts`, `subscriptions.test.ts`):
  mismo esqueleto que `pets.test.ts` (`response(status, body)`,
  `invalidJsonResponse`, `baseUrl = 'http://example.test/v1/'`, asserts
  de `toHaveBeenCalledWith(url, { method, headers, body })`, `it.each` por
  status, `missing-config` sin fetch).
- Pantalla (`src/screens/pairing/index.test.tsx`): mismo esqueleto que
  `src/screens/reminders/index.test.tsx` — `jest.mock('../../api/pets')`,
  `jest.mock('../../api/devices')`, `jest.mock('../../api/subscriptions')`,
  `jest.mock('../../providers/auth-provider')` (`useAuth` →
  `{ token: 'jwt-token', signOut: jest.fn() }`), `jest.mock('expo-router')`
  con `router: { push, back }`, `useFocusEffect: jest.fn()`,
  `useIsFocused: () => true`; `useSafeAreaInsets` mockeado a
  `{ top: 40, bottom: 24 }`; wrapper `HeroUINativeProvider` +
  `SelectedPetProvider`; `makePet()` con `device: null` o con un
  `DeviceStatus` completo. Para R4 se renderiza el route default de
  `src/app/(tabs)/pairing.tsx` (como hace `reset-password/index.test.tsx`).
- Los `describe` se copian literalmente de [[requirements]]. En archivos
  compartidos con otras features (`profile/index.test.tsx`,
  `(tabs)/__tests__/home.test.tsx`, `src/__tests__/design-drift.test.ts`)
  el sufijo `(mobile-device-pairing)` es obligatorio (hallazgo H5 de
  `progress/review_auth-forgot-password.md`).
- Higiene de mocks: `beforeEach(() => jest.clearAllMocks())` y
  `mockResolvedValue` fijados dentro del `beforeEach` (lección de #53).

### D10 — Sin cambios de backend ni de env

Cero migraciones, cero endpoints, cero variables de entorno nuevas.
`EXPO_PUBLIC_API_URL` ya existe. No se toca `app.json`/`app.config.ts`.

### D11 — Guion del gate humano G1 (dev build de Android, `SIM_MODE`)

Prerrequisitos: `docker compose up -d`, `.env` raíz con `SIM_MODE=true`
(default) y `POLLER_ENABLED=true`; backend arriba; dev build de Android
instalado con `EXPO_PUBLIC_API_URL` apuntando a la IP LAN
(`docs/verification.md` §Feature 52/54 para regenerar el build). Un
usuario con **dos mascotas** (A y B) sin collar.

```bash
cd backend-pet-tracker
pnpm run seed:devices            # SIM-001..003 / ACT-001..003, suscripción grandfathered activa
```

1. **Código inválido**: Home → collar card `Pair a collar` (o Perfil →
   `Configuración del Dispositivo GPS`) → mascota A → `ACT-999` → `Pair
   collar` → mensaje `Invalid activation code…`; el botón vuelve a estar
   habilitado.
2. **Éxito**: `ACT-001` → vista `Tracker is ready` con `Model sim-collar`
   y `ESN SIM-001` → `View on map` → el tab Map muestra posiciones del
   simulador en ≤ 2 min de cron.
3. **Ya reclamado**: mascota B → `ACT-001` → `This collar is already paired
   to another pet.`
4. **Tracked**: volver a `/pairing` con A → vista `GPS device` con pill
   `GPS tracking active`.
5. **Free**: en otra terminal
   `pnpm run subscription:set -- --unit-id 900001 --status canceled`
   → salir y volver a `/pairing` (refetch en foco) → bloque `Free plan —
   health only…`; el tab Map muestra `Live tracking requires a collar`.
   Reactivar: `pnpm run subscription:set -- --unit-id 900001 --status active`
   → pill `GPS tracking active` y posiciones de nuevo **sin re-claim**
   (R5/R6 de #25).
6. **Sin plan al reclamar (402)**:
   `pnpm run subscription:set -- --unit-id 900003 --status canceled` →
   mascota B → `ACT-003` → `This collar has no active plan…`.
7. **Unpair**: mascota A → `Unpair collar` → diálogo nativo → `Cancel` no
   hace nada; `Unpair` → vuelve al formulario; Home muestra `Free`; nuevo
   claim de `ACT-001` en B → `Tracker is ready` (el collar quedó
   `available`).
8. **Solo owner** (opcional si hay segunda cuenta con rol `family` sobre A):
   claim → `Only the owner can pair a collar.`

Collar real (opcional): con `WIALON_TOKEN` real y `SIM_MODE=false`,
`pnpm run provision:device -- --unit-id <wialon_unit_id>` imprime el
`activation_code`; repetir el paso 2 con él. Registrar solo resultados y
status en `progress/impl_mobile-device-pairing.md`; el guion se copia a
`docs/verification.md` § `Feature 42 — mobile-device-pairing` en el cierre.

## Archivos afectados

Todo bajo `mobile-pet-tracker/`. Sin capas domain/application/infrastructure
(cliente móvil): la separación es `src/api/` (contrato HTTP puro, sin
React) ↔ `src/screens/` (UI) ↔ `src/app/` (routing).

| Archivo | Cambio | R |
|---|---|---|
| `src/api/devices.ts` | **nuevo**: `ClaimDeviceInput`, `ClaimDeviceState`, `claimDevice`, `ReleaseDeviceState`, `releaseDevice` | R1, R2 |
| `src/api/__tests__/devices.test.ts` | **nuevo** | R1, R2 |
| `src/api/subscriptions.ts` | **nuevo**: `PetTrackingState`, `getPetTracking` | R3 |
| `src/api/__tests__/subscriptions.test.ts` | **nuevo** | R3 |
| `src/app/(tabs)/pairing.tsx` | **nuevo**: route delgado `PairingRoute` | R4 |
| `src/screens/pairing/index.tsx` | **nuevo**: `PairingScreen` (+ sub-componentes privados opcionales en la misma carpeta) | R4–R9, R11 |
| `src/screens/pairing/index.test.tsx` | **nuevo** | R4–R9 |
| `src/screens/profile/index.tsx` | + fila `pairing-link` tras `documents-link` | R10 |
| `src/screens/profile/index.test.tsx` | + describe `R10 (mobile-device-pairing)` | R10 |
| `src/app/(tabs)/home.tsx` | + `collar-pair-link` dentro de `collar-card` cuando `device === null` | R10 |
| `src/app/(tabs)/__tests__/home.test.tsx` | + describe `R10 (mobile-device-pairing)` | R10 |
| `src/__tests__/design-drift.test.ts` | + describe `R11 (mobile-device-pairing)` | R11 |
| `docs/verification.md` | + sección `Feature 42 — mobile-device-pairing` (guion D11) | cierre |
| `specs/mobile-device-pairing/traceability.md` | filas R1–R11 + G1 | cierre |

Firmas exactas (`src/api/devices.ts`):

```ts
import type { DeviceStatus } from './types';

export interface ClaimDeviceInput { petId: string; activationCode: string }

export type ClaimDeviceState =
  | { kind: 'ok'; device: DeviceStatus }
  | { kind: 'invalid' }
  | { kind: 'not-found' }
  | { kind: 'already-claimed' }
  | { kind: 'pet-has-device' }
  | { kind: 'subscription-required' }
  | { kind: 'forbidden' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function claimDevice(
  baseUrl: string | undefined,
  token: string,
  input: ClaimDeviceInput,
  fetchFn: typeof fetch = fetch,
): Promise<ClaimDeviceState>

export type ReleaseDeviceState =
  | { kind: 'ok' }
  | { kind: 'not-assigned' }
  | { kind: 'forbidden' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function releaseDevice(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<ReleaseDeviceState>
```

Guard del `201`: `isDeviceStatus(body)` = objeto no nulo con las claves
`model` y `esn` presentes (`'model' in body && 'esn' in body`); el `code`
de los `404`/`409` se lee con `readJson` y se compara como string.

## Alternativas descartadas

- **QR + `expo-camera`**: el Make no lo muestra; permiso de cámara, plugin
  y dev build nuevo para nada (D3).
- **Endpoint backend `GET /v1/pets/:petId/subscription`**: cambia el
  contrato público y `files_affected` es solo móvil; por el mismo criterio
  que separó #26 de #24 sería spec propia. Se anota como deuda (D2).
- **Dos rutas (`/pairing` y `/pairing/ready`) con `router.replace`**: la
  vista ready es estado local y el refetch de `pets` ya garantiza que la
  vuelta caiga en la vista de estado; una ruta menos (D5).
- **`getPetDevice` en `devices.ts`**: `listPets` ya trae `device` (D5).
- **Pre-chequeo `myRole !== 'owner'` para ocultar el formulario**: el
  backend ya responde `403` y R6 lo mapea; una rama y un test menos.
- **Bottom sheet de confirmación** (patrón de `reminders`): `Alert.alert`
  nativo cubre un sí/no destructivo (D6).
- **Promover `PetHero` a `src/components/`** para el hero del frame
  `gpsconfig`: toca perfil y sus tests; `PetSwitcher` + título basta.
- **react-query**: umbral de adopción no alcanzado (design §D2 de #36);
  `useApi` sigue bastando.
