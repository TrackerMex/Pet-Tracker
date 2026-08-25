---
feature: "mobile-pets-profile"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-pets-profile]] (#40)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Diseño visual: `specs/mobile-figma-polish/design-src/App.tsx`
> (`ProfileScreen`, `DocsScreen`, `AddPetScreen`).

## Decisiones técnicas

- **D1 — Avatar blobatar core + SvgXml (R5)**: única dependencia JS nueva es
  `blobatar` (core, `bun add blobatar`). `@blobatar/react` queda prohibido:
  es web-only (DOM + `dangerouslySetInnerHTML`, validado contra el tarball
  2.4.0, decisión humana 2026-08-21). `blobatar(name)` → SVG string →
  `<SvgXml xml={...} />` de `react-native-svg` (ya instalado en #32). Las
  animaciones motion.css del paquete son web-only y no se portan. El
  componente compartido es `src/components/pet-avatar.tsx` (props:
  `name`, `photoUrl`, `size`, `testID`) porque lo usan tres pantallas
  (Profile, AddPet, Home) — cumple la regla "en components/ solo lo
  reutilizado entre pantallas".

- **D2 — Flujo de foto presignada (R7)**: el backend YA persiste `photoKey`
  al emitir la URL (`request-photo-upload-url.use-case.ts` línea 43), así
  que no hay paso de confirmación: (1) picker, (2) POST
  `/pets/:petId/photo-upload-url` con `contentType` del asset, (3) `PUT`
  bytes a `uploadUrl`, (4) refetch del pet para el `photoUrl` nuevo.
  Consecuencia: la URL se pide SOLO tras confirmar imagen — pedirla antes
  dejaría un `photoKey` colgante apuntando a un objeto inexistente. El `PUT`
  presignado no pasa por `src/api/http.ts` (host distinto, sin Authorization)
  pero sí vive en `src/api/media.ts` con `fetchFn` inyectable para tests.
  El body del PUT sale del asset del picker vía
  `fetch(asset.uri).then(r => r.blob())` (patrón estándar Expo, sin
  dependencia extra).

- **D3 — Picker de imagen (R7)**: `expo-image-picker` instalado con
  `bunx expo install expo-image-picker` (versión bundled SDK 57, corre en
  Expo Go sin dev build). Solo `launchImageLibraryAsync` con
  `mediaTypes: images` y `quality` reducido; "Tomar foto" (cámara) se apoya
  en el mismo paquete y es opcional en v1 — la galería es el camino gateado
  en R10.

- **D4 — Persistencia de tema con expo-secure-store (R4)**: ya está
  instalado y probado (auth-provider); evita añadir
  `@react-native-async-storage/async-storage`. No es un secreto, pero el
  costo de una dependencia nueva supera la pureza semántica. Helper
  `src/utils/theme-preference.ts` (`getStoredTheme` / `setStoredTheme`, con
  try/catch que degrada a `undefined`), restauración en
  `src/app/_layout.tsx` con `Uniwind.setTheme` antes del primer render
  estable. Sin fade (#43).

- **D5 — Capa API (R1, R6, R7, R8)**: mismo patrón fetchFn/kind de
  `src/api/reminders.ts` — funciones puras `(baseUrl, token, ..., fetchFn)`
  → union types por kind; `src/api/` sigue sin imports de React ni
  expo-secure-store. Nuevos: `src/api/users.ts` (`getMe`),
  `src/api/media.ts` (`requestPhotoUploadUrl`, `uploadPhotoToUrl`, y
  `listPetDocs` si Q1 = Opción A), y `createPet` añadido a
  `src/api/pets.ts`. Consumo en pantallas vía `useApi`
  (stale-while-revalidate ya soporta cambio de fn).

- **D6 — Estructura de rutas (R2, R6, R8)**: patrón route-delgado + screen
  body (conventions §Estructura Expo oficial, skill
  expo-project-structure): `src/app/(tabs)/profile.tsx` →
  `src/screens/profile/`; `src/app/pets/add.tsx` → `src/screens/add-pet/`;
  `src/app/pets/[petId]/docs.tsx` → `src/screens/docs/`. Las rutas `pets/*`
  viven fuera del grupo `(tabs)` (stack sobre las tabs, como fija
  `feature_list.json` §files_affected); Expo Router las resuelve por archivo
  sin tocar `_layout.tsx` de tabs. Route files <10 líneas, verificado por
  diff en la review.

- **D7 — Formulario AddPet (R6)**: los campos calcan `CreatePetSchema` del
  backend (fuente de verdad; validación cliente espejo mínima: name
  requerido, exactamente uno de birthDate|approxAgeMonths, opcionales
  omitidos del body). Fecha de nacimiento con `DateTimePicker` de
  `@expo/ui/community/datetimepicker` dentro de `Host` — patrón ya probado
  en Expo Go en `src/screens/add-reminder/index.tsx`. El wizard de 2 pasos
  del Figma se respeta visualmente como dos secciones ("Datos básicos" /
  "Datos médicos") en un solo scroll: mismo contenido, menos estado, sin
  navegación intermedia que complique el back.

- **D8 — Backend health fuera de Profile (R3, Q2)**: el Figma no lo trae.
  Propuesta default: eliminar la card App/health de Profile (su información
  ya emerge como estado degradado de cada card con datos). Alternativa
  documentada: sección "Developer" colapsada al final. Decide el humano en
  el gate; hasta entonces la spec asume eliminación.

- **D9 — Docs como dependencia backend (R8, Q1)**: no existe
  `GET /pets/:petId/media`. Propuesta: feature backend nueva
  `media-docs-api` (patrón #47 reminders-api; decisión del gate de #39:
  API backend en feature aparte, nunca dentro de la feature móvil). #40
  implementa la pantalla contra el contrato acordado con fetchFn fake; el
  smoke de Docs con datos reales queda condicionado a esa feature. La
  alternativa B (listar vacunas existentes) no requiere backend nuevo pero
  se aleja de "Docs lista media de la mascota".

## Archivos afectados

Todo en `mobile-pet-tracker/` (app móvil; capas backend no se tocan salvo
que Q1 apruebe la feature backend APARTE, que tendrá su propia spec):

- `src/app/(tabs)/profile.tsx` — se reduce a route file delgado (R2)
- `src/screens/profile/index.tsx` + `index.test.tsx` — cuerpo nuevo de Profile (R1–R4, R7)
- `src/app/pets/add.tsx` — route delgada AddPet (R6)
- `src/screens/add-pet/index.tsx` + `index.test.tsx` — formulario alta (R6, R7)
- `src/app/pets/[petId]/docs.tsx` — route delgada Docs (R8)
- `src/screens/docs/index.tsx` + `index.test.tsx` — lista de documentos (R8)
- `src/api/users.ts` + `src/api/__tests__/users.test.ts` — getMe (R1)
- `src/api/media.ts` + `src/api/__tests__/media.test.ts` — presigned + PUT (R7, R8)
- `src/api/pets.ts` + `src/api/__tests__/pets.test.ts` — createPet (extensión) (R6)
- `src/components/pet-avatar.tsx` + `src/components/__tests__/pet-avatar.test.tsx` — avatar compartido (R5)
- `src/app/(tabs)/home.tsx` + `src/app/(tabs)/__tests__/home.test.tsx` — fallback del pet card pasa a PetAvatar (R5)
- `src/utils/theme-preference.ts` + `theme-preference.test.ts` — persistencia tema (R4)
- `src/app/_layout.tsx` — restauración del tema al arrancar (R4)
- `package.json` / lockfile bun — `blobatar`, `expo-image-picker` (R5, R7, R9)

## Alternativas descartadas

- **@blobatar/react**: web-only (DOM, dangerouslySetInnerHTML) — crashea en
  React Native; decisión humana ya tomada (2026-08-21).
- **@react-native-async-storage/async-storage para el tema**: dependencia
  nueva para un solo string; expo-secure-store ya instalado lo cubre (D4).
- **@expo/ui root/universal (pickers, forms)**: crashea en Expo Go SDK 57;
  solo `Host` + `@expo/ui/community/*` (restricción dura del repo).
- **react-native-image-picker**: requiere dev build; `expo-image-picker`
  bundled corre en Expo Go.
- **Wizard AddPet con navegación real de 2 pantallas**: más estado y rutas
  para el mismo formulario; dos secciones en un scroll dan la misma
  fidelidad visual (D7).
- **Implementar `GET /pets/:petId/media` dentro de #40**: viola la decisión
  del gate de #39 (backend en feature aparte) y mezclaría capas backend en
  una feature móvil (D9/Q1).
- **Subir la foto vía backend (multipart)**: el backend ya emite URLs
  presignadas (#6); duplicar el camino sería trabajo nuevo sin requisito.
