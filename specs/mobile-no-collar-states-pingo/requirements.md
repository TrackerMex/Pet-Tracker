---
feature: "mobile-no-collar-states-pingo"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-no-collar-states-pingo]] (#159)

> Notación EARS. Ver [[design]]. Base medida: commit 65f37841.

## Mediciones previas (premisas verificadas)

Todo medido en el commit **65f37841** (origin/main con #152, #153, #155, #157
y #161). Las anclas son por contenido (`grep -cF`), nunca por línea.

### M1 — Qué da el 402 que la app llama `no-tracking`

- `backend-pet-tracker/src/modules/subscriptions/infrastructure/guards/pet-tracking.guard.ts`,
  `PetTrackingGuard.canActivate`: si `isPetTracked(petId)` es falso lanza
  `HttpException` 402 con cuerpo
  `{ statusCode: 402, code: 'DEVICE_SUBSCRIPTION_REQUIRED', message: 'Pet tracking requires an active device subscription' }`.
  El cuerpo es **el mismo** sea cual sea la causa.
- `subscription.drizzle.repository.ts`, `SubscriptionDrizzleRepository.isPetTracked`:
  verdadero solo si existe una fila de `pet_devices` de la mascota con
  `released_at IS NULL` **y** una `device_subscriptions` de ese dispositivo que
  cumple `entitledDeviceSubscription()` (`entitlement.predicate.ts`:
  `status = 'active'` y `current_period_end > now() - DEVICE_SUBSCRIPTION_GRACE_DAYS días`).
- Luego el 402 sale en **dos** situaciones que el cuerpo no distingue:
  (a) la mascota no tiene collar emparejado; (b) tiene collar, pero su
  suscripción no existe, no está `active` o venció más allá de la gracia.
- Lo lanzan los controladores con `@UseGuards(PetAccessGuard, PetTrackingGuard)`:
  `positions.controller.ts`, `geofences.controller.ts`, `activity.controller.ts`
  y `trips.controller.ts`. En la app, los cuatro mapean el 402 a
  `{ kind: 'no-tracking' }` (`src/api/positions.ts`, `geofences.ts`,
  `activity.ts`, `trips.ts`) sin leer el cuerpo.

### M2 — Lo que la app ya recibe sí distingue (a) de (b)

- `GET /v1/pets/:petId` (`pets.controller.ts`, `PetsController.detail`, sin
  `@RequirePetRole`: cualquier rol activo) devuelve `device` con el collar
  activo o `null`. Lo resuelve `GetPetUseCase.execute` vía
  `PetDeviceDrizzleReader.findActiveDevice`, con **el mismo predicado** que la
  primera mitad de `isPetTracked`: `pet_devices.pet_id = petId AND released_at IS NULL`.
- Por tanto, con el detalle en la mano: `device === null` ⇒ caso (a), y el 402
  es seguro; `device !== null` + 402 ⇒ caso (b).
- La app ya lo consume: `getPet` (`src/api/pets.ts`) con
  `queryKey: petKeys.detail(petId)`, y `PetProfile.device: DeviceStatus | null`
  (`src/api/types.ts`).
- `GET /v1/pets` (`PetsController.list`) **no** sirve: llama a
  `toPetProfileResponse(pet, role, now, null, photoUrl)`, con `device: null`
  para toda mascota (lo fija `test/pets.e2e-spec.ts`, `expect(body.device).toBeNull()`).
- Ventana de carrera aceptada: detalle y 402 son dos peticiones; si el collar
  se empareja o se suelta entre ambas, la pantalla puede mostrar durante un
  ciclo el caso equivocado. Se corrige en el siguiente refetch.

### M3 — Quién puede emparejar

- `POST /v1/devices/claim` (`devices.controller.ts`, `DevicesController.claim`
  → `ClaimDeviceUseCase.execute`): membresía activa primero (404) y luego
  `membership.role !== 'owner'` ⇒ `InsufficientPetRoleError` ⇒ **403**
  (`device-error.mapper.ts`). Solo el dueño empareja.
- `DELETE /v1/pets/:petId/device` (`pet-device.controller.ts`, `release`):
  `@RequirePetRole('owner')`. Solo el dueño desempareja.
- Roles reales (`pet-membership.ts`, `PetRole`): `'owner' | 'family' | 'walker' | 'vet'`.
  No existen «caregiver» ni «viewer» (la entrada de `feature_list.json` los
  nombra; es una premisa falsa, ver §Premisas falsas).
- El claim, además, responde **409 `PET_ALREADY_HAS_DEVICE`** si la mascota ya
  tiene collar activo (`findActiveByPetId`). En el caso (b) emparejar no
  resuelve nada: el collar ya está.
- La app ya oculta acciones solo-dueño con `myRole === 'owner'`
  (`PetProfile.myRole`): `canSetLostMode` en `src/screens/map/index.tsx` (rol
  del listado) e `isOwner` → `geofences-add` en `src/screens/geofences/index.tsx`
  (rol del detalle).

### M4 — Las cuatro pantallas, tal como están

Rutas relativas a `mobile-pet-tracker/`.

- **Mapa** (`src/screens/map/index.tsx`). Ya pide el detalle:
  `const detail = useQuery({ queryKey: petKeys.detail(selectedPetId ?? ''), ...` .
  La rama sin seguimiento es
  `{petsReady && last.data?.kind === 'no-tracking' ? (` → `View`
  `flex-1 items-center justify-center p-6 bg-background` → `Text testID="map-no-tracking"`
  con `t('map.trackingNeedsCollar')`. `PetMap` solo se monta bajo
  `{petsReady && last.data?.kind === 'ok' ? (`: las dos condiciones se excluyen,
  así que **en el estado sin seguimiento no hay mapa** y la regla 10 de la carta
  no se aplica a este envoltorio. El vacío sin mascotas de #155 (`map-no-pets`)
  usa ese mismo envoltorio con un `EmptyState` dentro. El destino de emparejar
  es `/pairing`, y `src/screens/pairing/index.tsx` opera sobre
  `useSelectedPet().selectedPetId`, que es la misma mascota que pinta el mapa.
- **Zonas seguras** (`src/screens/geofences/index.tsx`). La ruta trae `petId`
  (`GeofencesScreen({ petId })`) y la pantalla pide el detalle (`pet`). Pinta un
  solo ternario sobre `geofences.data.kind`: `'ok'` con lista vacía →
  `EmptyState testID="geofences-empty"` (pose `collar`, #155 R8); `'no-tracking'`
  → `<Card testID="geofences-no-tracking" className="items-center py-8">` con
  `t('geofences.needsCollar')`. **Son ramas excluyentes del mismo ternario: no
  pueden coexistir.** `geofences-add` solo se pinta con `isOwner && geofences.data?.kind === 'ok'`.
  La única entrada en la app es `geofences-link` de Perfil (mascota
  seleccionada), y Perfil ya ofrece `pairing-link` justo encima. La pantalla
  **no** usa `useSelectedPet` y su suite (`src/screens/geofences/index.test.tsx`,
  `function mount(`) no monta `SelectedPetProvider`.
- **Editor de zona** (`src/screens/geofence-editor/index.tsx`).
  `messageFor(t, kind)` traduce `'no-tracking'` a `t('geofences.needsCollar')`
  y sirve para dos sitios: la carga (`<Card testID="geofence-editor-no-tracking" className="items-center py-8">`)
  y el error al guardar (`geofence-editor-error`). Junto a la carga hay dos
  tarjetas de guarda hermanas en texto: `geofence-editor-not-found` y
  `geofence-editor-owner-only`. El mapa del editor (`PetMap`) solo existe en el
  formulario. La lista que lee es `geofenceKeys.list(petId)`, la misma que la
  pantalla de zonas, así que el 402 solo llega aquí por enlace directo o porque
  el plan caduca a mitad de una edición.
- **Inicio** (`src/screens/home/index.tsx`). `summary-note` es un `Text` dentro
  de `summary-card`, al lado de la celda de peso:
  `activity.data.kind === 'no-tracking' ? t('home.activityNeedsCollar') : t('home.couldNotLoadActivity')`.
  La tarjeta de collar de la misma pantalla ya ofrece `collar-pair-link`
  (`router.push('/pairing')`) cuando `detail.data.pet.device === null`.
- **Documentación**. El paso 5 de la verificación de emparejado
  (`grep -cF 'Live tracking requires a collar' docs/verification.md` → `1`)
  es exactamente el caso (b): collar con suscripción `canceled`. Hoy la app le
  dice a ese dueño que necesita un collar, y ya lo tiene.

### Premisas falsas de la entrada de `feature_list.json`

- **«caregiver/viewer»**: esos roles no existen. Son `family`, `walker` y `vet` (M3).
- **«sin collar» como estado único**: el 402 junta dos casos (M1). Un copy que
  hable solo de «sin collar» le miente al dueño del caso (b) (ver M4,
  Documentación).

## Clasificación de los estados sin collar

El criterio es el de #155: Pingo ilustra el estado cuando **ese estado es el
contenido entero de su espacio** (no hay otra cosa que mirar) y el vacío no
flota sobre un mapa vivo. Se queda en texto si es una nota dentro de una
tarjeta con más contenido, o una guarda hermana de otras guardas en texto.

| Estado | Decisión | Por qué |
|---|---|---|
| `map-no-tracking` | **Ilustrar**: `EmptyState`, pose `collar`, mismo envoltorio `flex-1 … bg-background` | Ocupa la pestaña entera y no hay mapa debajo (M4: `PetMap` exige `last.data?.kind === 'ok'`), así que la regla 10 no aplica. Es el gemelo de `map-no-pets`, que #155 ya ilustró en ese envoltorio. |
| `geofences-no-tracking` | **Ilustrar**: `EmptyState`, pose `collar`, en lugar de la `Card` | Es el contenido entero de la pantalla. No hay mapa. Es excluyente con `geofences-empty` (mismo ternario, M4), así que nunca se ven dos Pingos a la vez. |
| `geofence-editor-no-tracking` | **Texto** (se queda la `Card`; el copy pasa a ser veraz) | Es una de tres guardas hermanas en texto (`not-found`, `owner-only`). Solo se llega por enlace directo o si el plan caduca a mitad de una edición. La misma clave pinta también el error al guardar, debajo del botón Guardar del formulario, que va sobre el mapa del editor: ahí no cabe una ilustración. |
| `summary-note` (Inicio) | **Texto** (el copy pasa a ser veraz) | Es una nota dentro de `summary-card`, al lado de la celda de peso. La acción de emparejar ya vive en la tarjeta de collar de la misma pantalla (`collar-pair-link`). |

**Regla 10.** Ningún `EmptyState` de esta feature es ancestro ni hermano
superpuesto de un `PetMap`: el del mapa solo se monta cuando `PetMap` no está,
y en Zonas seguras no hay mapa. R2 lo fija con un test.

## Tabla de literales (en / es)

Literales **finales**. Ningún test ni fichero los inventa: se copian de aquí
byte a byte (apóstrofo recto `'`, sin espacios al final).

**Por qué un solo copy por pantalla, y no uno por caso.** Cada copy es verdad
en los dos casos de M1: «cuando tenga un collar con plan activo» se cumple
tanto si falta el collar (a) como si falta el plan (b). La pantalla no tiene
que adivinar el caso para no mentir. El caso solo decide si sale el botón (R3).

**Voz.** Los dos cuerpos los dice Pingo (carta, punto 7): primera persona,
tuteo, sin emoji ni exclamación, acaban en punto. Los títulos siguen el patrón
de #155 (`No safe zones yet`): sin punto. `geofences.needsCollar` es una guarda
del editor, no habla Pingo, y acaba en punto como sus hermanas
(`geofenceEditor.notFound`). `home.activityNeedsCollar` es la nota de la
tarjeta y va sin punto, como su hermana `home.couldNotLoadActivity`
(`Could not load activity`). Los cuerpos dicen «tu mascota» y no
`{{petName}}`; la razón está en design.md §Alternativas descartadas (A3).

| # | Clave | Qué le pasa | `en` | `es` | Dónde se pinta |
|---|---|---|---|---|---|
| L1 | `map.noTrackingTitle` | nueva | `No live location` | `Sin ubicación en vivo` | `map-no-tracking-title` |
| L2 | `map.noTrackingBody` | nueva | `Once your pet has a collar with an active plan, I'll show you where they are.` | `Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.` | `map-no-tracking-body` |
| L3 | `geofences.noTrackingTitle` | nueva | `Safe zones unavailable` | `Zonas seguras no disponibles` | `geofences-no-tracking-title` |
| L4 | `geofences.noTrackingBody` | nueva | `Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.` | `Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.` | `geofences-no-tracking-body` |
| L5 | `home.pairCollar` | se reutiliza, sin cambio | `Pair a collar` | `Vincular collar` | `map-no-tracking-action` (y, como hoy, `collar-pair-link` en Inicio) |
| L6 | `geofences.needsCollar` | valor reescrito | `Safe zones need a collar with an active plan.` | `Las zonas seguras necesitan un collar con plan activo.` | `geofence-editor-no-tracking` y `geofence-editor-error` |
| L7 | `home.activityNeedsCollar` | valor reescrito | `Activity needs a collar with an active plan` | `La actividad necesita un collar con plan activo` | `summary-note` |
| L8 | `map.trackingNeedsCollar` | **se borra** de `en` y de `es` | (era `Live tracking requires a collar`) | (era `El rastreo en vivo requiere un collar`) | ninguno |

Valores que dejan de existir y que hoy están en tests (lo que cada R reescribe):
`'El rastreo en vivo requiere un collar'` (1 en `src/screens/map/index.test.tsx`),
`'Las zonas seguras requieren un collar'` (2 en `src/screens/geofences/index.test.tsx`,
2 en `src/screens/geofence-editor/index.test.tsx`, 1 en
`src/providers/__tests__/language-provider.test.tsx`),
`'La actividad requiere un collar'` (3 en `src/screens/home/index.test.tsx`).
Recuentos con `grep -cF '<valor>' <fichero>` en 65f37841.

## Requisitos funcionales

Rutas relativas a `mobile-pet-tracker/` salvo las que empiezan por `specs/` o
`docs/`. «Sin seguimiento» significa que la petición devolvió
`{ kind: 'no-tracking' }`, el 402 de M1. El test exacto de cada R está en
`tasks.md`.

### R1 — Catálogo: las cuatro claves nuevas

- **R1.1** THE SYSTEM SHALL declarar L1–L4 en `en` y en `es` de
  `src/i18n/catalog.ts` con los literales exactos de la tabla.
- **R1.2** THE SYSTEM SHALL mantener L2 y L4 sin `!` ni `¡`, sin emoji
  (`\p{Extended_Pictographic}`) y terminadas en `.` en los dos idiomas. L1 y L3
  quedan sin `!`, sin `¡`, sin emoji y **sin** `.` final.
- **R1.3** THE SYSTEM SHALL registrar L1–L4 en `specs/mobile-ui-language/design.md`,
  en una sección nueva con el encabezado exacto
  `### §2.23 — Añadidos por #159 — Pingo sin collar` (va después de §2.21; §2.22
  está reservada para #158, ver design.md §Coordinación con #158). Cada clave
  lleva una fila `` | — | `<clave>` | `<en>` | `<es>` | ← añadida por #159 (R1) | ``.
- **R1.4** El candado de longitud del catálogo
  (`src/providers/__tests__/language-provider.test.tsx`) sube **+4**.

### R2 — Mapa: el estado sin seguimiento lo presenta Pingo

- **R2.1** WHEN el listado de mascotas resuelve `ok` con al menos una mascota
  AND la última posición de la mascota seleccionada resuelve `no-tracking`,
  THE SYSTEM SHALL pintar `EmptyState` con `testID="map-no-tracking"`,
  `pose="collar"`, título L1 y cuerpo L2.
- **R2.2** THE SYSTEM SHALL montar ese `EmptyState` como **único hijo** del
  `View` con `className="flex-1 items-center justify-center p-6 bg-background"`,
  y el padre de ese `View` es `screen-map`. Es el sitio del `Text` al que sustituye.
- **R2.3** (regla 10) WHILE se ve `map-no-tracking`, THE SYSTEM SHALL NOT
  montar `map-view`. Siguen ausentes, como hoy, `stat-speed` y
  `lost-mode-button`, y no arranca el sondeo.
- **R2.4** THE SYSTEM SHALL borrar `map.trackingNeedsCollar` (L8) de `en` y de
  `es`, y registrarla en §2.23 con la fila
  `` | — | `map.trackingNeedsCollar` ← retirada por #159 (R2) | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` | ``
  (formato de `forgot.comingSoon ← retirada por #117`). El candado de longitud
  del catálogo baja **−1**.
- **R2.5** `docs/verification.md`, paso 5 (**Free**): la frase
  `` el tab Map muestra `Live tracking requires a collar` ``
  pasa a `` el tab Map muestra a Pingo con `No live location`, sin el botón `Pair a collar` (la mascota ya tiene collar) ``.

### R3 — Mapa: el dueño de una mascota sin collar puede ir a emparejar

- **R3.1** WHILE se ve `map-no-tracking`, WHEN el detalle de la mascota
  seleccionada (`petKeys.detail(selectedPetId)`, la query `detail` que ya
  existe) resuelve `ok` con `pet.myRole === 'owner'` AND `pet.device === null`,
  THE SYSTEM SHALL pintar la acción del `EmptyState` (`map-no-tracking-action`)
  con la etiqueta L5 (`Vincular collar` en español).
- **R3.2** WHEN el usuario pulsa `map-no-tracking-action`, THE SYSTEM SHALL
  llamar a `router.push('/pairing')` **una vez**, con ese argumento exacto.

### R4 — Mapa: nadie más ve el botón

WHILE se ve `map-no-tracking`, THE SYSTEM SHALL pintar título y cuerpo
**y no** pintar `map-no-tracking-action` en cada uno de estos casos, cada uno
con su propio candado:

- **R4.1** el detalle resuelve `ok` con `myRole` `family`;
- **R4.2** … `walker`;
- **R4.3** … `vet` (las tres con `device: null`: son roles que reciben 403 al
  emparejar, M3);
- **R4.4** el detalle resuelve `ok` con `myRole: 'owner'` y `device` no nulo
  (caso b de M2: emparejar devolvería 409, M3);
- **R4.5** el detalle resuelve `{ kind: 'error' }`;
- **R4.6** … `{ kind: 'unreachable', message }`;
- **R4.7** … `{ kind: 'missing-config' }`;
- **R4.8** el detalle sigue pendiente.

(`{ kind: 'unauthorized' }` cierra la sesión y no deja pantalla que mirar:
queda fuera de esta lista.)

### R5 — Zonas seguras: el estado sin seguimiento lo presenta Pingo

- **R5.1** WHEN la lista de zonas resuelve `no-tracking` AND el detalle ya
  resolvió, THE SYSTEM SHALL pintar `EmptyState` con
  `testID="geofences-no-tracking"`, `pose="collar"`, título L3 y cuerpo L4,
  **en lugar** de la `Card` (el contenedor tiene `className` `items-center gap-3 py-8`,
  el de `EmptyState`, no el de `Card`).
- **R5.2** THE SYSTEM SHALL montarlo como hijo directo del contenedor del
  `ScrollView` `screen-geofences`, y como su **único** hijo en ese estado.
  No se pintan `geofences-retry`, `geofences-add` ni `geofences-empty`.
- **R5.3** WHEN el idioma es inglés, THE SYSTEM SHALL pintar
  `Safe zones unavailable` y
  `Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.`
- **R5.4** `geofences-empty` y `geofences-no-tracking` siguen siendo ramas
  excluyentes del mismo ternario. La pantalla deja de usar `geofences.needsCollar`.

### R6 — Zonas seguras: nadie ve el botón

WHILE se ve `geofences-no-tracking`, THE SYSTEM SHALL NOT pintar
`geofences-no-tracking-action`, con un candado por caso:

- **R6.1** detalle `ok` con `myRole: 'owner'`;
- **R6.2** … `family`;
- **R6.3** … `walker`;
- **R6.4** … `vet`;
- **R6.5** detalle `{ kind: 'error' }`.

Por qué tampoco el dueño: design.md D3.

### R7 — Editor de zona: la guarda sigue en texto y dice la verdad

- **R7.1** THE SYSTEM SHALL dar a `geofences.needsCollar` el valor L6 en `en` y
  en `es`, y registrarlo en §2.23 con la fila
  `` | — | `geofences.needsCollar` | `<en L6>` | `<es L6>` | ← cambiada por #159 (R7) | ``.
  La fila de #41 (`← añadida por #41 (R1)`) no se toca.
- **R7.2** WHEN la carga de la lista del editor resuelve `no-tracking`, THE
  SYSTEM SHALL pintar `geofence-editor-no-tracking` (la `Card` de hoy) con
  `Las zonas seguras necesitan un collar con plan activo.` y sin `geofence-editor-retry`.
- **R7.3** WHEN guardar resuelve `no-tracking`, THE SYSTEM SHALL pintar ese
  mismo literal en `geofence-editor-error` y conservar el borrador.
- **R7.4** THE SYSTEM SHALL mantener en `src/screens/geofence-editor/index.tsx`
  exactamente un `<Card testID="geofence-editor-no-tracking"` y ningún `<EmptyState`.

### R8 — Inicio: la nota sigue en texto y dice la verdad

- **R8.1** THE SYSTEM SHALL dar a `home.activityNeedsCollar` el valor L7 en `en`
  y en `es`, sin `!`, `¡`, emoji ni `.` final, y registrarlo en §2.23 con la fila
  `` | — | `home.activityNeedsCollar` | `<en L7>` | `<es L7>` | ← cambiada por #159 (R8) | ``.
- **R8.2** WHEN la actividad diaria resuelve `no-tracking`, THE SYSTEM SHALL
  pintar `summary-note` con `La actividad necesita un collar con plan activo`.
- **R8.3** THE SYSTEM SHALL mantener en `src/screens/home/index.tsx`
  exactamente un `<Text` seguido de `testID="summary-note"` y el mismo número
  de `<EmptyState` que hoy (1).

### R9 — Sin movimiento ni dependencias nuevas (reduce motion)

- **R9.1** WHILE reduce motion está activo **o no**, THE SYSTEM SHALL pintar
  `map-no-tracking` y `geofences-no-tracking` sin animación. Se verifica en
  estático, como #155 R11: ni `src/screens/map/index.tsx` ni
  `src/screens/geofences/index.tsx` contienen `react-native-reanimated`,
  `Animated` (palabra completa), `LayoutAnimation`, `entering=` ni `MOTION_`.
  `src/components/empty-state.tsx` no cambia: sus candados de #155 R11 siguen
  verdes sin tocarse.
- **R9.2** THE SYSTEM SHALL NOT añadir dependencias: `mobile-pet-tracker/package.json`
  y `mobile-pet-tracker/bun.lock` sin diff contra la base.

### R10 — Prueba de humo humana en dev build de Android

- **R10.1** El humano, en un **dev build de Android** (nunca Expo Go), con su
  cuenta de dueño y una mascota recién creada desde la app (nace sin collar),
  comprueba que:
  1. en la pestaña Mapa, con esa mascota seleccionada, sale Pingo con el
     collar, `Sin ubicación en vivo`, la frase L2 y el botón `Vincular collar`;
  2. el botón abre la pantalla de emparejar;
  3. en Perfil → Zonas seguras sale Pingo con el collar,
     `Zonas seguras no disponibles` y la frase L4, **sin** botón;
  4. en Inicio, la nota de la tarjeta de resumen dice
     `La actividad necesita un collar con plan activo`;
  5. con reduce motion activado en Ajustes de Android, los pasos 1 y 3 se ven
     igual y nada se mueve.
  Se firma en su casilla propia de §Aprobación. Los roles no dueño y el caso (b)
  los cubren los tests (R4, R6): la prueba de humo no los exige.

## Fuera de alcance

Cada punto dice qué es: **delimitación** (algo que esta spec decide no hacer)
u **observación** (algo medido en el árbol que podría ser una feature; no se
abre aquí).

- **Delimitación. Backend sin cambios.** El 402 sigue con el mismo cuerpo para
  los dos casos. No hace falta otro: el detalle ya distingue (a) de (b) (M2), y
  el copy es verdad en ambos. No hay decisión de backend abierta.
- **Delimitación. Un copy por caso.** No se escriben textos distintos para
  «sin collar» y «plan vencido» (design.md A1).
- **Delimitación. Editor y nota de Inicio sin Pingo.** Se quedan en texto
  (§Clasificación). Solo cambia su literal.
- **Delimitación. Cuándo se vuelve a pedir la última posición.** El mapa deja
  de sondear con `no-tracking` (M4). Esta feature no cambia eso ni lo que pasa
  al volver de `/pairing`.
- **Delimitación. Otros consumidores del 402.** `src/api/trips.ts` (ruta del
  día en el mapa) mapea el mismo 402 y no pinta nada propio en ese estado;
  sigue igual.
- **Observación. Enlaces a emparejar visibles para todos los roles.**
  `collar-pair-link` en Inicio (sale con `detail.data.pet.device === null`, sin
  mirar `myRole`) y `pairing-link` en Perfil (sin condición) se pintan también
  a `family`, `walker` y `vet`, que reciben 403 al reclamar (M3). Medido en el
  código de 65f37841. Candidata a feature propia.
- **Observación, sin verificar en dispositivo. Emparejar lee el collar del
  listado.** `src/screens/pairing/index.tsx` calcula
  `hasSelectedDevice = selectedPet?.device != null` con la mascota de
  `listPets`, y `GET /v1/pets` devuelve siempre `device: null` (M2). Si es así,
  la vista del collar emparejado no sale nunca. Choca con el paso 4 de
  `docs/verification.md`, así que hay que comprobarlo en un dev build antes de
  abrir feature. No afecta a esta spec: el botón de R3 solo sale cuando la
  mascota **no** tiene collar.

## Decisiones abiertas para el humano

Cada una trae la opción por defecto de esta spec. Se aprueban en la segunda
casilla de §Aprobación.

- **A1 — Clasificación.** Ilustrar `map-no-tracking` y `geofences-no-tracking`;
  dejar en texto `geofence-editor-no-tracking` y `summary-note` (§Clasificación).
- **A2 — Un copy por pantalla, verdad en los dos casos.** La alternativa (dos
  copys según `device`) está descartada en design.md A1.
- **A3 — Botón de emparejar solo en el Mapa, solo para el dueño y solo sin
  collar** (R3, R4). En Zonas seguras no hay botón para nadie (R6, design.md D3).
- **A4 — Copy final L1–L8**, que incluye reescribir L6 y L7 y borrar L8.
- **A5 — «tu mascota» y no `{{petName}}`** en L2 y L4 (design.md A3).

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-09) ← gate obligatorio antes de implementar
- [x] Decisiones A1–A5 y copy final L1–L8 aprobados (fecha: 2026-10-09)
- [ ] Prueba de humo R10 superada en dev build de Android (fecha: ____) ← gate de cierre; el leader no marca `done` sin ella

## Enmienda E1 — R3 y R4: el rol y el collar del botón salen del detalle, no del listado

> Escrita el 2026-10-09 sobre la spec aprobada (firma `b304538f`), tras la
> revisión **rechazada** (`progress/review_mobile-no-collar-states-pingo.md`,
> sobre la punta de Codex `664b95a7`), por su bloqueante B1. No toca D1-D7,
> ni el texto de R1-R10, ni la firma original. **Solo tests**: la producción
> de `664b95a7` es correcta y queda idéntica. Su casilla va **sin marcar**: el
> humano reabre el gate solo para esta enmienda.

### El hecho medido (B1 del reviewer)

R3.1 y R4.1-R4.3 dicen «el detalle resuelve…», y D2 (design.md) fija que el
rol y el collar salen **del mismo detalle**, sin cruzar listado y detalle. El
código lo cumple:

```tsx
const canPairCollar =
  detail.data?.kind === 'ok' &&
  detail.data.pet.myRole === 'owner' &&
  detail.data.pet.device === null;
```

Pero ningún test lo exige. En todos los `it` de R3 y R4 el rol del listado
(`pets: [makePet(…)]`) y el del detalle (`pet: makePet(…)`) son el mismo,
porque así lo prescribió tasks.md T3/T4. El hueco nace en la spec, no en el
implementador.

| Id | Mutación en `src/screens/map/index.tsx` | Qué rompe en producción | Estado en `664b95a7` |
|---|---|---|---|
| Z1 | `detail.data.pet.myRole === 'owner' &&` pasa a `selectedPet?.myRole === 'owner' &&` | el botón obedece al rol del listado, no al del detalle | **verde** 109/109 |

El collar sí tiene un candado contra el listado (R4.4: listado `device: null`,
detalle con collar), pero solo en una dirección. Si `canPairCollar` exigiera
además el collar del listado, ningún test lo vería. La enmienda cierra las dos
direcciones del rol y la que falta del collar.

### Decisión: E1 añade tests a R3 y R4, no reescribe su texto

El texto de R3.1 y R4.1-R4.3 ya dice lo correcto. E1 solo añade sus candados
contra el listado: cinco `it` nuevos en `src/screens/map/index.test.tsx`, en
los `describe` de #159 que ya existen. Los `it` de `664b95a7` no cambian.

**R3.1, la inversa del rol.** Al final de
`describe('#159 R3: el dueño sin collar puede ir a emparejar'`:

- `it('pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle')`:
  listado `[makePet({ myRole: 'family' })]`, detalle
  `{ kind: 'ok', pet: makePet() }` (owner, `device: null`), última posición
  `{ kind: 'no-tracking' }`. Espera `map-no-tracking-action` con
  `Vincular collar` visible.

**R3.1, la inversa del collar.** En el mismo `describe`:

- `it('pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle')`:
  listado `[makePet({ device: makeDevice('online') })]`, detalle
  `{ kind: 'ok', pet: makePet() }`, última posición `{ kind: 'no-tracking' }`.
  Espera lo mismo.

**R4.1-R4.3, cada rol con su candado contra el listado.** Al final de
`describe('#159 R4: nadie más ve el botón de emparejar'`:

- `it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s aunque el listado diga owner')`:
  listado `[makePet()]` (owner), detalle `{ kind: 'ok', pet: makePet({ myRole: role }) }`
  servido con el helper `noTrackingAfterDetail` que ya existe en ese
  `describe`. Espera título y cuerpo visibles y `map-no-tracking-action`
  ausente, igual que los `it` de R4 que ya existen.

### Cómo se prueba que los candados vigilan (CHECKPOINTS.md C4, quinto punto)

Es un candado sobre código **ya correcto**. Por eso su rojo es una **mutación de
producción**: se versiona en el commit rojo y se revierte en el verde. Nunca
una mutación del doble.

La mutación del rojo es el error que D2 prohíbe: leer rol y collar **del
listado**. Las dos últimas líneas de `canPairCollar` pasan a:

```tsx
  selectedPet?.myRole === 'owner' &&
  selectedPet?.device === null;
```

Con ella fallan los cinco `it` nuevos, y además R4.4 ya existente, que cae en
cascada. tasks.md §Enmienda E1 da la tabla exacta.

Después, cinco sondas sin commit, restauradas, sobre el árbol verde (E1a-E1e
en tasks.md), cada una con su recuento esperado. Separan el rol del collar y
la sustitución del OR y del AND.

### Aprobación de la Enmienda E1

- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-09, vía Notion) ← gate obligatorio antes de la ronda 2 de Codex

## Enmienda E2 — R3: la inversa del rol, con los tres roles del listado, con y sin collar

> Escrita el 2026-10-09 sobre la Enmienda E1 (firma `f3ca7b8e`), tras la
> revisión de la ronda 2 **rechazada** (`progress/review_mobile-no-collar-states-pingo.md`
> §Ronda 2, sobre la punta de Codex `340967ba`), por su bloqueante B2, y
> ensanchada con el barrido del reviewer (§Barrido de la Enmienda E2, X1). No
> toca D1-D7, ni el texto de R1-R10, ni las firmas anteriores. **Solo tests**: la
> producción de `664b95a7` sigue siendo correcta y queda idéntica. Su casilla
> va **sin marcar**: el humano reabre el gate solo para esta enmienda.

### El hecho medido (B2 y X1 del reviewer)

Con el detalle owner y sin collar, el botón debe salir **sea cual sea el
listado**: `myRole` ∈ {owner, family, walker, vet} × collar ∈ {sin, con}, ocho
casos. Tras E1 hay test para tres: owner sin collar (R3), owner con collar (E1)
y family sin collar (E1). Estas mutaciones leen el rol o el collar **del
listado**, justo lo que D2 prohíbe, y sobreviven a la suite de `340967ba`:

| Id | Mutación en `const canPairCollar =` de `src/screens/map/index.tsx` | Estado en `340967ba` |
|---|---|---|
| P6 | `detail.data.pet.myRole === 'owner' &&` pasa a `selectedPet?.myRole !== 'walker' && detail.data.pet.myRole === 'owner' &&` | **verde** 114/114 |
| P6b | igual, con `'vet'` | **verde** 114/114 |
| X1 | `detail.data.pet.myRole === 'owner' &&` pasa a `(selectedPet?.myRole === 'owner' \|\| selectedPet?.device === null) && detail.data.pet.myRole === 'owner' &&` | **verde** 114/114 |

El hueco nace en la spec (E1 prescribió solo `family` sin collar), no en el
implementador.

### Decisión: el `it` de `family` pasa a `it.each` con los seis listados no-owner

En `describe('#159 R3: el dueño sin collar puede ir a emparejar'`, el `it`
`'pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle'`
se **reemplaza** por un `it.each` de seis filas:
{family, walker, vet} × {sin collar (`device: null`), con collar
(`device: makeDevice('online')`)}. El listado es `[makePet({ myRole: role, device })]`,
el detalle `{ kind: 'ok', pet: makePet() }` (owner, `device: null`) y la última
posición `{ kind: 'no-tracking' }`. Espera `map-no-tracking-action` con
`Vincular collar` visible. El título nombra rol y collar
(`… aunque el listado diga $role $collar: …`), para que la traza distinga cada
fila. El cuerpo exacto está en tasks.md §Enmienda E2.

Con E1, el resto de casos ya estaba cubierto. Owner sin collar y owner con
collar siguen en sus `it`. El fichero pasa de 114 a 119 `it` (−1 + 6). Ningún
otro `it` cambia.

### Cómo se prueba que el candado vigila (CHECKPOINTS.md C4, quinto punto)

Otra vez es un candado sobre código **ya correcto**. Su rojo es una **mutación
de producción**, versionada en el commit rojo y revertida en el verde: la suma
de P6 y P6b. La línea `detail.data.pet.myRole === 'owner' &&` de
`canPairCollar` pasa a tres:

```tsx
  selectedPet?.myRole !== 'walker' &&
  selectedPet?.myRole !== 'vet' &&
  detail.data.pet.myRole === 'owner' &&
```

Con ella fallan, por consulta, las cuatro filas `walker` y `vet`, con y sin
collar. Las dos filas `family` siguen verdes. Las sondas E2a-E2d de tasks.md
separan cada rol y X1. El barrido del reviewer ya midió que esta mutación pasa
typecheck y lint.

### Aprobación de la Enmienda E2

- [ ] Enmienda E2 aprobada por humano (fecha: ____, vía Notion) ← gate obligatorio antes de la ronda 3 de Codex
