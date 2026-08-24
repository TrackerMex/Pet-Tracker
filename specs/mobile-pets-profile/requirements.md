---
feature: "mobile-pets-profile"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-pets-profile]] (#40)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Diseño de referencia (versionado en #46):
> `specs/mobile-figma-polish/design-src/App.tsx` — funciones `ProfileScreen`
> (línea ~657), `DocsScreen` (~838) y `AddPetScreen` (~1113). Figma Make:
> https://www.figma.com/make/K3GsL0HHUCW3AaFj3osx0B
>
> Convenciones duras que aplican a TODA pantalla nueva
> (`docs/conventions.md` §Convenciones de la app móvil):
> route file delgado en `src/app/…` + cuerpo en `src/screens/<nombre>/index.tsx`
> con tests colocados; layout uniforme patrón `home.tsx`
> (`paddingTop: insets.top + 12`, `padding: 24`, `gap: 16`,
> `paddingBottom: insets.bottom + 96`); `Skeleton` dimensionado como el
> contenido final, nunca spinner suelto; solo tokens uniwind vía `className`
> (cero hex, cero `StyleSheet.create`, cero `text-[10px]` — usar `text-2xs`;
> guardia automática en `mobile-pet-tracker/src/__tests__/design-drift.test.ts`).
> `docs/ui-guidelines.md` (PR #73 ui-charter) aplica al implementar si ya
> está mergeado en la branch.
>
> Smoke humano 100% **Expo Go** (`bunx expo start --go`), SDK 57, Android.
> Prohibido cualquier librería que exija dev build: `@expo/ui` root/universal
> crashea en Expo Go — solo `Host` + `@expo/ui/community/*` (patrón real en
> `mobile-pet-tracker/src/screens/add-reminder/index.tsx`).

## Contexto backend (verificado en esta branch)

Endpoints que YA existen y esta feature consume:

| Endpoint | Fuente |
|---|---|
| `GET /v1/me` → `ProfileResponse {id,email,firstName,lastName,phone,country,timezone,createdAt,updatedAt}` | `backend-pet-tracker/src/modules/users/infrastructure/users.controller.ts` |
| `POST /v1/pets` (CreatePetSchema: `name`+`species` obligatorios, exactamente uno de `birthDate`\|`approxAgeMonths`; opcionales `breed,sex,size,color,sterilized,microchip`) | `backend-pet-tracker/src/modules/pets/application/dto/create-pet.dto.ts` |
| `GET /v1/pets`, `GET /v1/pets/:petId` (incluye `photoUrl` resuelto) | `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts` |
| `POST /v1/pets/:petId/photo-upload-url` body `{contentType: 'image/jpeg'\|'image/png'\|'image/webp'}` → `{uploadUrl, expiresInSeconds}`; el backend persiste `photoKey` al emitir la URL, el cliente solo hace `PUT` de los bytes a `uploadUrl` (S3/LocalStack) | `backend-pet-tracker/src/modules/media/infrastructure/media.controller.ts` |
| `GET /v1/pets/:petId/vaccines` | `backend-pet-tracker/src/modules/health/infrastructure/vaccines.controller.ts` |

**DEPENDENCIA declarada (no existe endpoint):** no hay `GET /v1/pets/:petId/media`
ni upload de documentos genéricos — el módulo `media` solo emite la URL
presignada de LA foto de perfil. Ver R8 y Pregunta abierta Q1.

## Requisitos funcionales

### Profile (reescritura del tab)

- **R1 — users/me real**: WHEN el tab Profile monta con sesión activa THE
  SYSTEM SHALL pedir `GET /me` vía `getMe(baseUrl, token, fetchFn)` en
  `src/api/users.ts` (patrón fetchFn/kind de `src/api/reminders.ts`; sin
  imports de React ni expo-secure-store en `src/api/`) con kinds
  `ok | unauthorized | error | unreachable | missing-config`, consumido con
  `useApi` (`src/hooks/use-api.ts`); AND SHALL mostrar `firstName lastName`
  y `email` en una card de cuenta (`testID="me-card"`, componente `Card` de
  `src/components/card.tsx`); IF kind ≠ ok THEN SHALL mostrar el estado
  degradado en la card sin romper el resto de la pantalla (unauthorized lo
  resuelve `useApi` con signOut, ya implementado).
  *Tests: `mobile-pet-tracker/src/api/__tests__/users.test.ts` (nuevo,
  `describe('R1: getMe ...')`, fetchFn fake por kind) y
  `mobile-pet-tracker/src/screens/profile/index.test.tsx`
  (`describe('R1: me card', ...)`). ROJO primero.*

- **R2 — pantalla Profile según Figma**: WHEN Profile renderiza con datos de
  la mascota activa THE SYSTEM SHALL seguir la estructura del `ProfileScreen`
  del diseño: (a) hero superior con la foto de la mascota (o avatar R5) y
  nombre + raza superpuestos, (b) `PetSwitcher` compartido
  (`src/components/pet-switcher.tsx`) para cambiar de mascota activa,
  (c) fila de pills con `sex`, `sterilized`, edad y `currentWeightKg` cuando
  existan, (d) card "Información" (`testID="pet-info-card"`) con filas
  Raza / Microchip / Dispositivo GPS / Última señal desde el `PetProfile` de
  `GET /pets/:petId` (valor "No registrado" cuando el campo es null),
  (e) filas de navegación a Documentos (R8) y Recordatorios (R3), y
  (f) botón "Cambiar foto" (`testID="change-photo"`, R7). El cuerpo vive en
  `src/screens/profile/index.tsx` y `src/app/(tabs)/profile.tsx` queda como
  route file delgado (<10 líneas, solo renderiza `<ProfileScreen />`);
  WHILE los datos cargan THE SYSTEM SHALL mostrar `Skeleton`s dimensionados
  como el contenido final (convención de layout uniforme arriba, testID raíz
  `screen-profile` conservado).
  *Test: `mobile-pet-tracker/src/screens/profile/index.test.tsx`
  (`describe('R2: estructura Figma', ...)`) + extensión mínima de
  `src/app/(tabs)/__tests__/profile.test.tsx` para el route file delgado.
  ROJO primero.*

- **R3 — contratos conservados**: WHEN Profile se reescribe THE SYSTEM SHALL
  conservar sin cambio de contrato: (a) el `Pressable`
  `testID="reminders-link"` con `accessibilityRole="button"` que llama
  `router.push('/reminders')` (contrato anotado en
  `specs/mobile-reminders/requirements.md` R10 y design §D10), y (b) el
  botón `testID="profile-sign-out"` que llama `signOut()` de
  `useAuth`. El check de backend health (`backend-health-state`/
  `backend-health-retry`) se ELIMINA (decisión Q2 del gate, 2026-08-24):
  no aparece en el Figma y el estado degradado de cada card ya delata un
  backend caído. Sus tests en
  `src/app/(tabs)/__tests__/profile.test.tsx` se retiran (excepción C4
  documentada en el commit).
  *Test: `mobile-pet-tracker/src/screens/profile/index.test.tsx`
  (`describe('R3: reminders-link y sign out', ...)` con mock de
  `expo-router` assert `router.push('/reminders')`). ROJO primero.*

- **R4 — toggle de tema persistente**: WHEN el usuario pulsa
  `testID="theme-toggle"` THE SYSTEM SHALL alternar el tema con
  `Uniwind.setTheme(...)` (comportamiento actual) AND persistir la elección
  (`'light' | 'dark'`) vía helper `src/utils/theme-preference.ts` respaldado
  por `expo-secure-store` (ya instalado; cero dependencias nuevas); AND WHEN
  la app arranca THE SYSTEM SHALL restaurar el tema persistido antes del
  primer render estable (en `src/app/_layout.tsx`); IF no hay preferencia
  guardada o la lectura falla THEN SHALL usar el default actual sin crashear.
  Sin animación de transición: el fade de tema es la feature #43.
  *Tests: `mobile-pet-tracker/src/utils/theme-preference.test.ts` (nuevo,
  colocado) y `describe('R4: toggle persiste', ...)` en
  `src/screens/profile/index.test.tsx` con mock de expo-secure-store.
  ROJO primero.*

### Avatar determinista (decisión humana 2026-08-21)

- **R5 — fallback blobatar**: WHEN una mascota no tiene `photoUrl` THE
  SYSTEM SHALL renderizar un avatar determinista generado con el paquete
  core `blobatar` (`bun add blobatar`, ÚNICA dependencia JS nueva;
  `@blobatar/react` PROHIBIDO por ser web-only): `blobatar(name)` devuelve
  un SVG string que se pinta con `SvgXml` de `react-native-svg` (ya
  instalado en #32; las animaciones motion.css del paquete quedan fuera).
  El render vive en un componente compartido
  `src/components/pet-avatar.tsx` (`testID="pet-avatar"`) usado por: el
  hero de Profile (R2), el preview de AddPet (R6) y el pet card de Home
  (`src/app/(tabs)/home.tsx`, reemplazando el fallback de inicial bajo el
  mismo `testID="pet-card-photo"`); IF la mascota tiene `photoUrl` THEN la
  foto manda y el blobatar no se genera. Mismo nombre → mismo SVG
  (determinismo observable).
  *Tests: `mobile-pet-tracker/src/components/__tests__/pet-avatar.test.tsx`
  (nuevo: determinismo `blobatar('Luna') === blobatar('Luna')` vía snapshot
  del prop `xml`, foto-manda, fallback) y extensión de
  `src/app/(tabs)/__tests__/home.test.tsx` (`describe('R5: ...')`).
  ROJO primero.*

### AddPet

- **R6 — alta de mascota**: WHEN el usuario abre la ruta `/pets/add`
  (route file delgado `src/app/pets/add.tsx` → cuerpo en
  `src/screens/add-pet/index.tsx`) THE SYSTEM SHALL mostrar el formulario
  del `AddPetScreen` del diseño: selector Perro/Gato (`species`), nombre,
  raza, sexo, tamaño, esterilizado, microchip, y edad como fecha de
  nacimiento **o** meses aproximados (la fecha con
  `DateTimePicker` de `@expo/ui/community/datetimepicker` envuelto en
  `Host`, mismo patrón que `src/screens/add-reminder/index.tsx`); WHEN el
  usuario guarda con datos válidos THE SYSTEM SHALL llamar
  `createPet(baseUrl, token, input, fetchFn)` (nueva función en
  `src/api/pets.ts`, mismo patrón de kinds que `CreateReminderState`) con un
  body que cumpla `CreatePetSchema` (exactamente uno de
  `birthDate`|`approxAgeMonths`; campos opcionales omitidos, no enviados
  vacíos) y, en `ok`, navegar de vuelta a Profile con la mascota nueva
  visible (refetch de `listPets`); IF la validación cliente falla o el
  backend responde ≠201 THEN SHALL mostrar el error en
  `testID="add-pet-error"` sin perder lo tecleado, AND WHILE el POST vuela
  el botón guardar SHALL estar deshabilitado.
  *Tests: `mobile-pet-tracker/src/api/__tests__/pets.test.ts` (extender:
  `describe('R6: createPet', ...)` con assert del body exacto) y
  `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` (nuevo).
  ROJO primero.*

### Foto vía URL presignada

- **R7 — subida de foto**: WHEN el usuario pulsa `change-photo` en Profile
  (o el selector de foto en AddPet tras un alta `ok`) THE SYSTEM SHALL abrir
  la galería con `expo-image-picker` (instalar con `bunx expo install
  expo-image-picker` — versión bundled SDK 57, funciona en Expo Go); WHEN
  hay imagen elegida THE SYSTEM SHALL (1) pedir
  `requestPhotoUploadUrl(baseUrl, token, petId, contentType, fetchFn)`
  (nueva `src/api/media.ts`, contentType derivado del asset y limitado a
  `image/jpeg|image/png|image/webp`) y (2) hacer `PUT` de los bytes del
  asset a `uploadUrl` con ese `Content-Type` (`uploadPhotoToUrl(uploadUrl,
  body, contentType, fetchFn)` en `src/api/media.ts`; la URL presignada NO
  lleva el token de auth ni pasa por `http.ts`), y (3) en éxito refrescar el
  `PetProfile` para mostrar el `photoUrl` nuevo; la URL presignada se pide
  SOLO después de que el usuario confirmó una imagen (no antes, porque el
  backend persiste `photoKey` al emitirla); IF el picker se cancela THEN no
  se llama a la API; IF el POST o el PUT fallan THEN SHALL mostrar el error
  en `testID="photo-upload-error"` y dejar la foto anterior intacta.
  *Tests: `mobile-pet-tracker/src/api/__tests__/media.test.ts` (nuevo:
  kinds del POST + assert del PUT con Content-Type y body) y
  `describe('R7: cambiar foto', ...)` en `src/screens/profile/index.test.tsx`
  con `expo-image-picker` mockeado. ROJO primero.*

### Docs

- **R8 — pantalla Docs**: WHEN el usuario abre la fila "Documentos" de
  Profile THE SYSTEM SHALL navegar a `/pets/[petId]/docs` (route file
  delgado `src/app/pets/[petId]/docs.tsx` → cuerpo en
  `src/screens/docs/index.tsx`) y mostrar la lista de documentos de la
  mascota según el `DocsScreen` del diseño (header con nombre de la mascota,
  lista de items con tipo/nombre/fecha), con `Skeleton` dimensionado, estado
  vacío (`testID="docs-empty"`) y degradación por kind; el origen de datos
  es la nueva feature backend **`media-docs-api` (#49)**
  (`GET /v1/pets/:petId/media` + upload de documentos; patrón #47
  reminders-api — decisión Q1 del gate, 2026-08-24). #40 implementa la
  pantalla contra ese contrato con `listPetDocs` en `src/api/media.ts` y
  fetchFn fake en tests; **el smoke real de Docs queda bloqueado hasta que
  #49 esté `done`** (el resto del smoke R10 no depende de #49).
  *Test: `mobile-pet-tracker/src/screens/docs/index.test.tsx` (nuevo) +
  `describe('R8: navegación a docs', ...)` en
  `src/screens/profile/index.test.tsx`. ROJO primero.*

### Tipado y contención

- **R9 — verde global sin drift**: WHEN se ejecutan `bun run typecheck`,
  `bun run lint` y `bun run test` en `mobile-pet-tracker/` THE SYSTEM SHALL
  salir con exit 0, con las suites de #33–#39 y #46 intactas (únicos diffs
  sobre tests existentes: las extensiones nombradas en R2, R3, R5 y R6) y la
  guardia `src/__tests__/design-drift.test.ts` verde sobre el código nuevo
  (cero `text-[10px]`, cero hex, cero `StyleSheet`); las únicas dependencias
  nuevas SHALL ser `blobatar` (core) y `expo-image-picker` (bundled SDK 57);
  `@gorhom/bottom-sheet` no se toca (peer dependency).
  *Verificación: comandos anteriores + diff de `package.json` en la review.*

### Smoke humano (gate)

- **R10 — smoke Expo Go**: WHEN la implementación está aprobada por el
  reviewer THE HUMAN SHALL verificar en Expo Go (Android, SDK 57) contra el
  backend local + LocalStack: (a) alta de mascota completa desde `/pets/add`,
  (b) **subida de foto real desde el dispositivo** con la foto visible en
  Profile y Home tras refetch (S3 = LocalStack, nada de AWS real), (c) una
  mascota sin foto muestra el mismo blobatar en Profile y Home tras recargar
  (determinismo), (d) el toggle de tema persiste tras cerrar y reabrir la
  app, (e) `reminders-link` sigue navegando a Reminders. Este requisito es
  **gate humano**: la feature no se marca `done` sin este smoke.
  *Verificación: checklist en §Aprobación, ejecutada por el humano.*

## Fuera de alcance

- Fade/animación de transición del tema — es la feature **#43**.
- AWS real: S3 es **LocalStack** en dev; nada de `cdk deploy` ni cuentas
  reales (el smoke R10 es local).
- Editar/eliminar mascota (PATCH/DELETE existen en backend pero el Figma no
  trae pantalla; decisión Q3: feature posterior).
- Filas Figma "Geocercas configuradas" y "Configuración del Dispositivo
  GPS" del Profile: las pantallas destino no existen en la app móvil aún;
  las filas no se renderizan en esta feature (decisión Q4).
- Upload/preview de documentos médicos genéricos (PDF, etc.) — backend de
  la feature #49 `media-docs-api` (decisión Q1); #40 solo la pantalla.
- Edición del perfil de usuario (`PATCH /me`) — Profile solo muestra.
- Migración en frío de otras pantallas pre-#39 al patrón screens/ (solo se
  migra `profile.tsx`, que esta feature toca de fondo).

## Decisiones del gate (respondidas por el humano, 2026-08-24)

- **Q1 (Docs)**: feature backend `media-docs-api` aparte (#49, `pending` en
  `feature_list.json`). R8 redactado en firme contra ese contrato; smoke de
  Docs bloqueado hasta #49 `done`.
- **Q2 (backend health)**: **eliminarlo** de Profile (R3 en firme).
- **Q3 (CRUD)**: editar/eliminar mascota queda FUERA de #40, feature
  posterior.
- **Q4 (filas Figma sin destino)**: Geocercas y Config GPS NO se renderizan
  hasta que existan sus pantallas.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [X] Q1–Q4 respondidas y R8 redactado en firme (2026-08-24)
- [ ] Smoke R10 ejecutado por el humano (fecha: ____) ← gate antes de `done`
