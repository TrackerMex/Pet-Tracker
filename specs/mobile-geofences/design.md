---
feature: "mobile-geofences"
status: approved    # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-geofences]] (#41)

> El molde es `specs/mobile-alert-detail-screen/` (#100). Comparte con ella:
>
> - el formato de sondas;
> - el inventario de aserciones heredadas;
> - el delta por fichero;
> - la ruta en el `Stack.Protected` raíz con cabecera nativa.
>
> **Contra qué árbol se verificó.** Todo lo que sigue se verificó contra
> `03f57706`, la base de [[requirements]]. El backend se verificó contra
> `origin/main` `4e8d6cc3`, que ya incluye #145.
>
> **Convenciones de este documento:**
>
> - las citas son por contenido o por commit, nunca por número de línea;
> - las rutas son relativas a `mobile-pet-tracker/`, salvo las de `docs/`,
>   `specs/` y `backend-pet-tracker/`;
> - las decisiones de producto son P1–P16 de [[requirements]]; aquí, D-n son
>   decisiones técnicas.

## Skills y documentación

- **Codex** (plugin `expo@openai-curated` v1.0.2):
  - Carga `building-native-ui`, que cubre `ScrollView`, métricas,
    `Text selectable`, `Switch` y `Alert`.
  - Carga `native-data-fetching`, que cubre TanStack Query.
  - **Codex no tiene skill de router.** Todo lo que necesita de
    `expo-router` está escrito en D1; no hay que buscarlo en otra parte.
  - No pedir skills por otros nombres (deuda B5).
- **Sesiones Claude** (reviewer): `expo:expo-overview`,
  `expo:expo-native-ui`, `expo:expo-router` y `expo:expo-data-fetching`.
- **Carta y convenciones.**
  - Carta: `docs/ui-guidelines.md` (C8).
  - Convenciones: `docs/conventions.md` §Prefijo de feature, §Filtros de jest
    y §Tests (regla `waitFor` de TanStack).

## Entorno (verificado, no supuesto)

| Pieza | Versión / hecho | Dónde |
|---|---|---|
| Expo SDK | 57 | `package.json` |
| `expo-router` | 57.0.14, con `typedRoutes` activo. `router.push` de una ruta con parámetro lleva `as Href`, como `'/pairing' as Href` en el Perfil | `package.json`, `app.json`, `src/screens/profile/index.tsx` |
| `heroui-native` | 1.0.8. `Switch` (`isSelected`, `isDisabled`, `onSelectedChange`) pinta un nodo host con `role="switch"` y `accessibilityState { checked, disabled }`. `Skeleton` y `Button` (`variant="danger-soft"`, `size="sm"`) ya están en uso | `package.json`, sonda S3 |
| `uniwind` | 1.11.0. `className` llega al nodo host | `package.json` |
| `@tanstack/react-query` | 5.102.8. **No hay `useMutation`** en `src/`: las escrituras son una función `async` y un `refetch`, como en el centro de alertas (#97) | `package.json`, `git grep useMutation` |
| `createQueryClient` | `staleTime: 0`, `retry: false`, sin recarga por foco de ventana ni por reconexión. Su `QueryCache.onSuccess` llama a `onUnauthorized` cuando una consulta resuelve `{ kind: 'unauthorized' }`: **el 401 de un `GET` lo cierra el proveedor, no la pantalla** | `src/providers/query-provider.tsx` |
| `renderWithProviders` | Asíncrono, `gcTime: 0`, acepta `onUnauthorized` y `wrapper`, y devuelve `{ ...result, queryClient }` | `test/render-with-providers.tsx` |
| `src/api/http.ts` | Exporta `apiUrl`, `getJson`, `postJson`, `deleteJson` y `readJson`, que devuelven `GetResult`. **No hay helper `PATCH`** | `src/api/http.ts` |
| Claves | `petKeys.detail(petId)` = `['pets', 'detail', petId]`, que comparten Perfil y Mapa. `mediaKeys` es el último bloque del fichero | `src/api/query-keys.ts` |
| Rol | `PetProfile.myRole: 'owner' \| 'family' \| 'walker' \| 'vet'`, servido por `getPet`. No existe un rol `viewer` | `src/api/types.ts`, `src/api/pets.ts` |
| Backend: guardas | `@UseGuards(PetAccessGuard, PetTrackingGuard)` en la clase. `POST`, `PATCH` y `DELETE` llevan `@RequirePetRole('owner')`; los dos `GET` no llevan rol | `backend-pet-tracker/src/modules/geofences/infrastructure/geofences.controller.ts` |
| Backend: códigos | Quien no es miembro recibe 404. Un rol que no es dueño recibe 403 al escribir, **también en una mascota sin rastreo**, porque el rol se mira antes. Una mascota sin rastreo recibe 402, **también en los `GET`**. `DELETE` → `@HttpCode(HttpStatus.NO_CONTENT)` (204). `PATCH` → 200 con la zona | ídem, `backend-pet-tracker/src/modules/pets/infrastructure/guards/pet-access.guard.ts` y `backend-pet-tracker/src/modules/subscriptions/infrastructure/guards/pet-tracking.guard.ts` |
| Backend: límites | `GEOFENCE_MAX_PER_PET = 5`. Nombre con `trim`, de 1 a 120. `radiusM` de 20 a 2000. `active` es un booleano opcional. `CreateGeofenceSchema` es `.strict()` con `type: z.literal('safe_circle')` | `backend-pet-tracker/src/modules/geofences/geofences.constants.ts`, esquemas del módulo |
| Backend: orden | La lista se ordena por `asc(geofences.createdAt)`, es decir, en orden de creación | `geofence.drizzle.repository.ts` |
| Backend: #145 (done) | `DELETE` → 204 aunque la zona tenga una alerta abierta, y cierra las alertas no cerradas de la zona (R1, R2). Un `PATCH` que cambia `active` reinicia el estado y cierra esas alertas (R3) | `specs/geofence-alert-consistency/requirements.md` |
| `.env.example` | `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/v1`, que **ya** incluye `/v1` | `mobile-pet-tracker/.env.example` |
| `.expo/types/router.d.ts` | No existe (está gitignorado); `tsc` pasa sin él | base |

## §0 Errata del enunciado

| # | El enunciado dice | Verificado | Consecuencia |
|---|---|---|---|
| E1 | "borrar una zona con una alerta sin cerrar probablemente da 500 hoy (inferido, sin test)" | **Falso desde #145**: `DELETE` responde 204 también con una alerta abierta (#145 R1) y cierra las alertas no cerradas de la zona (#145 R2). | R3 trata el 204 como `ok`. El cuerpo de la confirmación (P4) lo cuenta. Se corrige la descripción en `feature_list.json`. |
| E2 | "una zona por mascota" | Mal formulado. Cada zona pertenece a **una** mascota y no se comparte (`geofences.pet_id` `NOT NULL`, decisión 9 (a) del explore). Una mascota puede tener **hasta 5** (`GEOFENCE_MAX_PER_PET`). | La pantalla es una lista (R5). Se corrige la descripción. |
| E3 | "roles owner/viewer" (explore, premisa 5) | Los roles son `owner`, `family`, `walker` y `vet`. | R8 cubre los tres que no son dueño. |
| E4 | (no lo dice) | Un rol que no es dueño recibe **403** al escribir, también si la mascota no tiene rastreo, y quien no es miembro recibe 404. | Las escrituras mapean 403 a `error` (P6). Un 404 recarga la lista. |
| E5 | (no lo dice) | El 401 de la lista **no** debe llamar a `signOut` desde la pantalla: lo hace el `QueryCache` del proveedor (Entorno). | R5, rama 5: la pantalla no pinta nada. Lo asevera un `it` de R5. |
| E6 | `files_affected`: 7 entradas | Acierta la ruta (`src/app/pets/[petId]/geofences.tsx`), pero faltan los tests, los candados, `_layout`, los docs y las specs. Son 19 ficheros móviles y 4 entradas de raíz ([[#Archivos afectados]]). | Se amplía en `feature_list.json`. |
| E7 | "fila Geocercas" en el Perfil | El catálogo ya dice "zona" en `alerts.typeGeofenceExit` ("Salió de la zona" / "Left the safe zone"). | P1: "Zonas seguras". |
| E8 | (no lo dice) | `map.trackingNeedsCollar` dice "El rastreo en vivo requiere un collar". | No sirve para el 402 de la lista; se añade una clave nueva (P9). |
| E9 | (no lo dice) | No hay helper `PATCH` ni `useMutation` (explore, premisa 11). | Se añade `patchJson` a `http.ts` (R3) y la escritura es manual (D4). |
| E10 | (no lo dice) | `pairing-link` del Perfil **no** lleva `hitSlop`; `documents-link` y `reminders-link` sí (`TOUCH_SLOP`). | La fila nueva lleva `hitSlop={TOUCH_SLOP}` (R9). |
| E11 | (no lo dice) | No hay API ni script para añadir miembros a una mascota. | Para la prueba de humo de solo lectura hace falta un `insert` manual (P16). |
| E12 | (no lo dice) | La base `03f57706` **no** es `main` + #60: su merge-base con `main` es `0af5d921`. | Se midió también el merge simulado con `4e8d6cc3` (§1, S1). El delta es el mismo. |

## §1 Sondas ejecutadas

Las sondas se hicieron sobre copias en el scratchpad del spec_author; el
worktree no se tocó. Los logs quedan en ese scratchpad y no se versionan.

| Sonda | Árbol | Resultado | Sostiene |
|---|---|---|---|
| S0 | `git archive 03f57706`, suite móvil entera, sin pipe | 86 suites / 1640 tests / 1 snapshot, `exit=0`. `tsc` y `expo lint` dan `exit=0` con 0 bytes | Base de [[requirements]] |
| S1 | Merge sin commit de `origin/main` `4e8d6cc3` con `03f57706`, sin conflictos en `mobile-pet-tracker/` | Base 86 / 1655 / 1. Con #41 aplicada, 88 / 1731 / 1. Las anclas de R1, R4 y R9 y los literales de D8 son idénticos a los de `03f57706` | Delta +2 / +76, independiente de la base |
| S2 | Implementación de referencia de #41 sobre `03f57706`, en once pasos rojo→verde (Paso 0 y R1–R10), con la tabla de [[tasks]] | Cada rojo falla **exactamente** los `it` declarados en [[tasks]], con su clase de fallo. Cada verde pasa con `tsc` a 0 bytes. Cierre: 88 / 1716 / 1, `tsc` y `lint` a 0 bytes | Todo el plan de tests (D7) y el orden |
| S3 | `Switch` real de heroui-native en RNTL, dentro de S2 y S4 | El nodo host lleva `role="switch"`, `accessibilityState { checked, disabled }`, `hitSlop` y `accessibilityLabel`. `fireEvent.press` sobre un `Switch` deshabilitado **no** llama a `onSelectedChange`: con `isDisabled={false}` (M14), el `it` de bloqueo se pone rojo | R6 |
| S4 | Mutaciones M1–M57 sobre la implementación de referencia (M11 y M16 retiradas) | **Todas mueren** (tabla siguiente) | Que ningún test sea tautológico |
| S5 | Los ocho ficheros que recorren `src/app/` con el router real (D7), en el verde de R4 | Verdes con `pets/[petId]/geofences` en la guarda | La ruta nueva no rompe la navegación existente |

**Mutaciones de S4.** Cada una se plantó sola sobre el verde final y se
corrió su fichero de test.

| Id | Mutación | Muere en |
|---|---|---|
| M1 | Quitar la guarda `!baseUrl` de `listGeofences` | `#41 R2` › `'maps missing base URL %p without fetching'` |
| M2 | Quitar la guarda de las dos escrituras | `#41 R3` › `'maps missing base URL %p without fetching'` |
| M3 | No comprobar el tipo de `radiusM` | `#41 R2` › `'maps %s to error'` (radio en string) |
| M4 | `DELETE` con 200 como respuesta correcta | `#41 R3` (`'deletes without a body and maps 204 to ok'`, fila 200) |
| M5 | `PATCH` cambiado a `PUT` | `#41 R3` › `'patches only the active flag %p'` |
| M6 | 404 de escritura mapeado a `error` | `#41 R3` (filas 404) |
| M7 | 402 cambiado a 403 en la lista | `#41 R2` (filas 402 y 403) |
| M8 | `geofenceKeys.list` sin `petId` | `#41 R2` en `query-keys.test.ts` |
| M9 | `dangerouslySingular` en el `Stack.Screen` nuevo | `#41 R4` › `'declara pets/[petId]/geofences como décimo hijo y no singular'` |
| M10 | Título con otra clave | `#41 R4` (cabecera), `#78 R12`, `#41 R10`, `#65 R18` |
| M12 | El esqueleto deja de esperar a `getPet` | `#41 R5` › `'sigue en esqueleto mientras el rol de la mascota no ha llegado'` |
| M13 | Sin `Math.round` | `#41 R5` (filas, `'Radio de 150 m'`) |
| M14 / M15 | `isDisabled={false}` en el `Switch` / en el borrado | `'bloquea los dos interruptores…'` / `'deshabilita los dos borrados…'` |
| M17 | Sin `refetch` tras `ok` | 4 `it` de R6 y R7 |
| M18 | Sin `signOut` ante `unauthorized` | `#87 R19` y 2 `it` (R6 y R7) |
| M19 | Botón destructivo con estilo `default` | `#41 R7` › `'abre la confirmación nativa exacta y Cancelar no borra'` |
| M20 / M21 | Ser dueño sin mirar el rol / un estado que no es `ok` cuenta como dueño | `#41 R8` |
| M22 | Píldora siempre "Activa" | `#41 R8` |
| M23 | Sin `contentInsetAdjustmentBehavior` | `#41 R5` › `'respeta las métricas A11 bajo cabecera nativa'` |
| M24 | "Reintentar" vuelve a pedir la mascota y no la lista | los 3 `it` de error de R5 |
| M25 | El 401 de la lista pinta el error | `#41 R5` › `'deja el 401 de la lista al manejador global y no pinta estado'` |
| M26 | No limpiar `actionError` al empezar | los 4 `it` de error de R6 |
| M27 | `Switch` sin `accessibilityLabel` | `#41 R6` › `'pinta el interruptor con el estado del servidor y su etiqueta accesible'` |
| M28 | `missing-config` pinta `cannotReachServer` | 3 `it` |
| M29 | El enlace del Perfil empuja la ruta de documentos | `#41 R9` |
| M30 | La etiqueta del enlace es `profile.gpsSettings` | `#65 R7`, `#65 R18`, la fila GPS de R10 de `device-pairing` (excepción) y `#41 R9` |
| M31–M45, M48–M52 | La decisión de la fila 2 copia la de la fila 1, o difiere de ella con `index === 0`. Afecta a: nombre, clase del nombre, clase del radio, clase de la tarjeta, clase de la columna, `hitSlop`, clase del borrado, clase de la píldora, ser dueño, tarjeta pulsable, texto de la píldora, `isSelected`, etiqueta accesible, destino del borrado, destino del `PATCH`, `selectable`, radio, clase de la etiqueta, `size` y esquina | `#41 R5`–`R8` (D3, tabla por fila) |
| M46 / M47 | Chevrón de 28 / etiqueta `font-normal` en el enlace del Perfil | `#41 R9` y `#62 R7` |
| M53 / M54 | Solo la fila 1 se deshabilita durante la escritura (`Switch` / borrado) | `'bloquea los dos interruptores…'` / `'deshabilita los dos borrados…'` |
| M55 / M56 | La fila 1 escribe con otro id / con otro valor | `'bloquea los dos interruptores…'` |
| M57 | El borrado de la fila 1 apunta a otro id | los 2 `it.each` de error de R7 |

## D1 — Ruta y pila (guía de router para Codex)

- **Fichero.** `src/app/pets/[petId]/geofences.tsx` es un route delgado
  (`docs/conventions.md` §Estructura Expo), hermano de
  `src/app/pets/[petId]/docs.tsx`:

  ```tsx
  import { useLocalSearchParams } from 'expo-router';
  import { GeofencesScreen } from '../../../screens/geofences';
  export default function GeofencesRoute() {
    const { petId } = useLocalSearchParams<{ petId: string }>();
    return <GeofencesScreen petId={petId} />;
  }
  ```

- **Pila.** En `src/app/_layout.tsx` se inserta una sola línea, justo después
  de la que declara `name="alerts/[alertId]"` (ancla `grep -F 'name="alerts/[alertId]"'`):

  ```tsx
  <Stack.Screen name="pets/[petId]/geofences" options={{ ...headerOptions, title: t('geofences.title') }} />
  ```

  Queda como décimo hijo del `Stack.Protected` de la sesión.
  - **Sin `dangerouslySingular`.** La pantalla solo se abre desde el Perfil,
    y "atrás" vuelve a él.
  - `headerOptions` es el mismo objeto de #95 R4 (cabecera nativa, fondo y
    tinta del tema, `Inter-Bold`, sin sombra), así que la flecha de volver y
    el título los pone la pila.
- **Navegación.** La única entrada es
  `router.push(`/pets/${pet.id}/geofences` as Href)` desde el Perfil (D9).
  No hay deep link ni toque de notificación.

## D2 — Cliente HTTP y estados (`src/api/geofences.ts`)

- **Mismo patrón que `src/api/pets.ts`:** una unión discriminada por `kind`
  y funciones puras con `fetchFn` inyectable.
  - La validación del cuerpo de la lista (`isGeofence`) mira solo lo que la
    pantalla usa para decidir: `id`, `name`, `radiusM` y `active`.
  - El resto de campos se tipa pero no se comprueba. No se pinta y #146 lo
    revalidará al editar.
- **`writeState(response, okStatus)`** es un helper privado del fichero que
  comparten las dos escrituras. Así, el 200 de `DELETE` y el 204 de `PATCH`
  caen en `error` (lo aseveran los tests), y no hay una tabla por función.
- **`patchJson`** va en `src/api/http.ts`, entre `postJson` y `deleteJson`,
  con la misma forma que `postJson`. Es un helper genérico, no algo propio de
  geocercas. #146 lo reutilizará para editar.
- **`geofenceKeys.list(petId)`** va al final de `src/api/query-keys.ts`. Su
  dominio es propio (`'geofences'`), así que invalidar las mascotas no recarga
  las zonas, ni al revés.

**Esqueletos de los commits rojos.** Son lo mínimo para que el test
compile y falle por aserción, no por import:

| Commit rojo | Esqueleto |
|---|---|
| R2 | Las interfaces de [[requirements]] R2; `listGeofences(_baseUrl, _token, _petId, _fetchFn = fetch)`, que devuelve `{ kind: 'missing-config' }`; y `geofenceKeys = { list: (_petId: string) => ['geofences', 'list'] as const }` |
| R3 | `GeofenceWriteState` y las dos funciones de escritura, que devuelven `{ kind: 'missing-config' }` |

## D3 — Precedencia de pintado y decisiones por fila

**Precedencia.** La raíz pinta **una** rama, en el orden de [[requirements]]
R5. La condición del esqueleto es `geofences.data === undefined || pet.data === undefined`
(P10). Así, un `getPet` en error **no** bloquea la lista: deja la pantalla en
solo lectura (R8). El `Text` `geofences-action-error` va **fuera** de la
cadena, como último hijo de la raíz, y se pinta con cualquier rama.

**Decisiones por fila.** Se cuentan por **hijos del nodo host**, no por
`testID`: la columna no tiene `testID` y en el test sale como `undefined`.
Cada decisión se asevera en **las dos filas** de la fixture (Casa y Parque),
y cada valor que difiere entre ellas cruza (M31–M57).

| Elemento | Decisiones aseveradas en las dos filas | R |
|---|---|---|
| Tarjeta `geofence-<id>` | Clase exacta (superficie de `Card` + `flex-row items-center gap-3`), `style` `{ borderCurve: 'continuous' }`, sin `role`, orden del backend (regex `/^geofence-geofence-\d$/`) | R5 |
| Hijo 0: columna | Clase `min-w-0 flex-1 gap-1`; hijos `[-name, -radius]` | R5 |
| Nombre | Texto, `selectable`, clase `font-bold text-foreground` | R5 |
| Radio | Texto con `Math.round` (149.6 → "150"), clase `text-sm font-normal text-muted` | R5 |
| Hijo 1 del dueño: `Switch` | `checked` de cada fila, etiqueta con su nombre, `hitSlop` 10, `role` `switch`, `disabled: false` en reposo, `disabled: true` en **las dos** filas mientras se escribe, `onSelectedChange` con **su** id y **el contrario de su** valor | R6 |
| Hijo 2 del dueño: borrado | Clase exacta del `Button` y de su `Button.Label`, texto "Eliminar", `size` `sm`, `variant` `danger-soft`, `role` `button`, deshabilitado en **las dos** filas mientras se escribe, habilitado en reposo, destino del `Alert` y del `DELETE` con **su** id | R7 |
| Hijo 1 sin ser dueño: píldora | Texto "Activa" o "Inactiva" según **su** `active`, clase exacta; hijos de la tarjeta `[undefined, -status]` | R8 |

**Fixtures de dos filas.** Valores cruzados; `makeGeofence()` da por
defecto `geofence-1`, `Casa`, 150 m y activa.

| `describe` | Fila 1 | Fila 2 | Por qué |
|---|---|---|---|
| `#41 R5` (filas) | `geofence-2`, `Parque`, `149.6`, activa | `geofence-1`, `Casa`, `1000`, inactiva | Los ids van **al revés** del orden alfabético, para que se vea un `sort` en el cliente. `149.6` ejercita el redondeo |
| `#41 R6`–`R8` | `geofence-1`, `Casa`, activa | `geofence-2`, `Parque`, inactiva | `checked`, valor enviado y píldora difieren entre filas |
| `#41 R7` › `'confirmar borra…'` | `geofence-1`, `Casa` | `geofence-2`, `Parque` | Se confirma en la **fila 2**: el destino del `DELETE` no puede ser el de la fila 1 |
| `it` de error y de sesión de R6 y R7 | `geofence-1`, `Casa` | — | Una fila: M55–M57 los alcanzan por la fila 1 |

## D4 — Escritura: `busy`, recarga y errores

- **Estado.** Dos `useState`: `busy: boolean` y `actionError: string | null`.
  No hay `useRef` de cerrojo: `isDisabled={busy}` bloquea el toque en el
  propio heroui (S3), y el test lo asevera pulsando otra vez las dos filas
  durante el vuelo.
- **`write(request)`.** Una sola función para las dos escrituras:
  1. `setBusy(true)` y `setActionError(null)`.
  2. `await request()` y despacho por `kind` (tabla de [[requirements]] R6).
  3. Ante `ok`, `not-found` y `no-tracking`: `await geofences.refetch()`.
  4. Si la promesa se rechaza (`catch`): `somethingWentWrong`.
  5. Siempre (`finally`): `setBusy(false)`.
- **Sin actualización optimista ni `invalidateQueries`.** El `refetch` de la
  lista es la fuente de verdad (P2). No se invalida `petKeys`, porque una
  zona no cambia la mascota.
- **`signOut` desde la pantalla** solo se usa para las escrituras.
  `design-drift.test.ts` (#87 R19) cuenta los `signOut(` de cada pantalla con
  mutaciones; esta pantalla tiene **1**.

## D5 — Rol y solo lectura

La comprobación es
`const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner'`,
el mismo patrón que `canSetLostMode` del Perfil. Cualquier otra cosa (otro
rol, o `getPet` en `error`, `unreachable` o `missing-config`) cae en solo
lectura. Un `getPet` en `unauthorized` lo cierra el proveedor. El backend
sigue siendo el que decide: si un rol que no es dueño consiguiera escribir,
recibiría 403 y vería el error genérico (P6).

## D6 — Copy: catálogo, spec de idioma y tabla de uso

- **Catálogo.** Once claves (tabla de [[requirements]] R1) en
  `src/i18n/catalog.ts`, en `en` y `es`, en el mismo orden y justo después
  de `'alerts.openedAt'` en cada idioma. El candado de longitud pasa de 309 a
  320 (`+ 11`).
- **Spec de idioma.** En `specs/mobile-ui-language/design.md`, una sección
  `### §2.15 — Añadidos por #41 — Zonas seguras` antes de
  `## 3. La infraestructura`. Lleva la misma cabecera de tabla que §2.14 y
  una fila por clave, con el sufijo `← añadida por #41 (R1)`. El test de R1
  la lee con esta regex por clave:

  ```
  '\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #41 \\(R1\\)'
  ```

- **Tabla de uso** (`src/__tests__/ui-copy-table.ts`):
  - **`R7_PROFILE`** gana la fila
    `{ file: 'src/screens/profile/index.tsx', key: 'geofences.title' }, // #41 R9`,
    justo después de la fila de `profile.gpsSettings`.
  - **`R14_GEOFENCES`** es un bloque nuevo, exportado, con **18** filas en el
    orden en que aparecen en el código:

    | # | `file` | `key` |
    |---|---|---|
    | 1 | `src/app/_layout.tsx` | `geofences.title` |
    | 2 | `src/screens/geofences/index.tsx` | `common.cannotReachServer` (escritura) |
    | 3 | ídem | `common.somethingWentWrong` (escritura, `kind`) |
    | 4 | ídem | `common.somethingWentWrong` (escritura, `catch`) |
    | 5 | ídem | `geofences.deleteTitle` |
    | 6 | ídem | `geofences.deleteBody` |
    | 7 | ídem | `geofences.cancel` |
    | 8 | ídem | `geofences.delete` (botón del `Alert`) |
    | 9 | ídem | `geofences.empty` |
    | 10 | ídem | `geofences.radius` |
    | 11 | ídem | `geofences.activeLabel` |
    | 12 | ídem | `geofences.delete` (botón de la fila) |
    | 13 | ídem | `geofences.statusActive` |
    | 14 | ídem | `geofences.statusInactive` |
    | 15 | ídem | `geofences.needsCollar` |
    | 16 | ídem | `common.cannotReachServer` (lista) |
    | 17 | ídem | `common.somethingWentWrong` (lista) |
    | 18 | ídem | `common.retry` |

  - **`ALL_USES`** gana `...R14_GEOFENCES` al final, y lo mismo el array de
    bloques del `it('cuadra ALL_USES con la suma de los doce bloques')`,
    que vive en el mismo `ui-copy-table.ts` y corre dentro de
    `ui-language.test.ts`.
- **`SCREEN_FILES`** de `ui-language.test.ts` se deriva de los ficheros
  únicos de `ALL_USES`. Gana uno, `src/screens/geofences/index.tsx`, porque
  `_layout.tsx` ya estaba. Por eso su candado sube `+ 1` en R10.

## D7 — Plan de tests por fichero

**Reglas comunes:**

- Los `describe` nuevos llevan el prefijo `#41 R<n>:`.
- Los mocks se prescriben **por intención** y se comprueban contra el fichero
  destino; no se calcan a ciegas.
- Tras un cambio de TanStack se espera con `waitFor`, no con un `act` suelto
  (`docs/conventions.md` §Tests).
- Cada invariante tiene su `expect`.
- Ningún test asevera contra un símbolo importado de producción: los literales
  esperados van escritos en el test.

**`src/api/__tests__/geofences.test.ts` (nuevo, 35 tests).** Sin mocks de
módulo: `fetchFn` es un `jest.fn()` que resuelve `Response`s construidos en el
test.

- **Fixtures.** `baseUrl = 'http://example.test/v1/'`, con barra final para
  ejercitar `apiUrl`. Helpers `response(status, body)`,
  `invalidJsonResponse(status)` y `makeGeofence(id, active = true)`.
- **`#41 R2` (16 tests):**
  - `'gets the pet geofences with the bearer token and returns them in backend order'`.
    URL exacta `'http://example.test/v1/pets/pet-1/geofences'` y opciones
    exactas `{ headers: { Authorization: 'Bearer jwt-token' } }`.
  - `'maps an empty array to ok with no geofences'`.
  - `it.each` `'maps HTTP %i'`: 402 → `no-tracking`, 401 → `unauthorized`,
    403, 404 y 500 → `error`.
  - `it.each` `'maps %s to error'` (6): JSON inválido; un objeto en vez de un
    array; un elemento sin `name`; `radiusM` en string; `active` en string;
    un elemento `null`.
  - `'maps a fetch rejection to unreachable'`.
  - `it.each([undefined, ''])` `'maps missing base URL %p without fetching'`.
- **`#41 R3` (19 tests):**
  - `it.each([true, false])` `'patches only the active flag %p'`: método
    `PATCH`, `Content-Type`, cuerpo exacto `'{"active":true}'` /
    `'{"active":false}'`.
  - `'deletes without a body and maps 204 to ok'`, con opciones exactas
    `{ method: 'DELETE', headers: { Authorization: 'Bearer jwt-token' } }`.
  - `it.each` `'setGeofenceActive maps HTTP %i'`: 404, 402, 401, y 403, 400,
    500 y **204** → `error`.
  - `it.each` `'deleteGeofence maps HTTP %i'`: 404, 402, 401, y 403, 500 y
    **200** → `error`.
  - `'maps fetch rejections to unreachable'`.
  - `it.each` `'maps missing base URL %p without fetching'`.

**`src/api/__tests__/query-keys.test.ts` (+2).** Importa `geofenceKeys`.
`#41 R2` va tras `#87 R7`:
- clave exacta `['geofences', 'list', 'p1']`;
- `p1` ≠ `p2`.

**`src/app/__tests__/detail-stack.test.tsx` (+1).** Tras el `describe` de
`#100 R2`. Comprueba:
- `existsSync` del route;
- que contiene `useLocalSearchParams`;
- que contiene `"from '../../../screens/geofences'"`.

**`src/app/__tests__/layout.test.tsx` (+2).** `describe` nuevo de `#41 R4`
con el mismo `beforeEach` que el de `#100 R2`. Tiene dos `it`:
- `children` de la guarda de longitud 10, y `children[9]` =
  `[Stack.Screen, 'pets/[petId]/geofences', undefined]` (tipo, `name`,
  `dangerouslySingular`);
- `options` `toEqual` el objeto completo de cabecera, con
  `title: 't:geofences.title'`, igual que el `it` de cabecera de `#100 R2`.

**`src/screens/geofences/index.test.tsx` (nuevo, 33 tests).**

- **Dobles por intención:**
  - `../../api/geofences` → `deleteGeofence`, `listGeofences` y
    `setGeofenceActive` como `jest.fn()`, para controlar cada respuesta;
  - `../../api/pets` → `getPet`, para controlar el rol;
  - `../../providers/auth-provider` → `useAuth`, que devuelve
    `{ status: 'authenticated', token: 'token-1', signIn, signOut: mockSignOut }`;
  - `react-native-safe-area-context` → `requireActual` más
    `useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 })`.
- **Montaje.** `heroui-native` **real**, bajo `HeroUINativeProvider`, con
  `LanguageProvider initial={language}` (por defecto `'es'`), vía
  `renderWithProviders(<GeofencesScreen petId="pet-1" />, { onUnauthorized, wrapper })`.
- **`beforeEach`:**
  - `clearAllMocks`;
  - `mockReset` de los cuatro dobles de API;
  - `EXPO_PUBLIC_API_URL = 'http://example.test/v1'`;
  - `getPet` resuelve dueño.
- **Helpers:**
  - `makeGeofence(overrides)`: por defecto `geofence-1`, `Casa`, radio 150,
    activa;
  - `petState(myRole)`;
  - `childTestIds(node)`, que da los `testID` de los hijos host, con
    `undefined` si no hay;
  - `alertButton(label)`, que saca un botón del último `Alert.alert`.
- **`#41 R5` (11):**
  1. Esqueleto mientras carga: clase y llamadas `(apiUrl, 'token-1', 'pet-1')`.
  2. Esqueleto mientras el rol no llega: la lista ya resolvió y `getPet`
     sigue pendiente.
  3. Métricas A11.
  4. Vacío, con la clase exacta de la tarjeta.
  5. Dos filas (D3).
  6. Radio en inglés.
  7. 402, sin "Reintentar".
  8–10. `it.each` de error (`error`, `missing-config`, `unreachable`):
     texto, `selectable`, clase exacta de "Reintentar", y al pulsarlo 2
     llamadas a la lista y aparece la fila.
  11. 401: `onUnauthorized` una vez, `signOut` nunca, y ni error ni vacío
      tras irse el esqueleto.
- **`#41 R6` (10):**
  1. Interruptores de las dos filas.
  2. Valor contrario, una llamada y recarga.
  3. Bloqueo de las dos filas en vuelo, con la promesa de `setGeofenceActive`
     pendiente.
  4–5. `it.each` de `not-found` y `no-tracking`: recarga sin error.
  6–9. `it.each` de `error`, `missing-config`, `unreachable` y rechazo:
     error `selectable`, interruptor intacto, la lista no se recarga, y el
     siguiente intento con `ok` borra el error.
  10. `unauthorized` → `signOut` una vez.
- **`#41 R7` (7).** `jest.spyOn(Alert, 'alert')` y `restoreAllMocks` en
  `afterEach`.
  1. Botones de las dos filas e hijos `[undefined, -active, -delete]`.
  2. Bloqueo de los dos borrados mientras el interruptor escribe, sin
     `Alert`.
  3. Argumentos exactos del `Alert`; "Cancelar" no borra.
  4. Confirmar en la fila 2 (`geofence-2`, "¿Eliminar Parque?") borra una
     vez con su id y la lista recargada ya no la trae (2 llamadas a la lista).
  5–6. `it.each` de `error` y `unreachable` con una fila (`geofence-1`): el
     error se pinta, la tarjeta sigue y el `DELETE` se llamó una vez con
     `geofence-1`.
  7. `unauthorized` → `signOut` una vez.
- **`#41 R8` (5):**
  1–3. `it.each` de `family`, `walker` y `vet`: píldoras de las dos filas,
     clase, hijos `[undefined, -status]`, `queryAllByRole('switch')` vacío y
     ningún `-delete`.
  4. `getPet` en `error` → solo lectura.
  5. Píldora en inglés.

**`src/screens/profile/index.test.tsx` (+1).** Contra el blob `b52c4b44`. El
`describe` de `#41 R9` tiene un `beforeEach` propio:
- `clearAllMocks`, `env` y `useAuth`;
- `mockGetMe` pendiente;
- `listPets` y `getPet` con una mascota `pet-1`.

El `it` asevera:
- el texto y el rol;
- `hitSlop` `{ top: 6, bottom: 6, left: 6, right: 6 }`;
- la clase y el `style` continuo;
- la clase del `Text`;
- el orden de los `/-link$/`: `documents-link`, `pairing-link`,
  `geofences-link`, `reminders-link`;
- un `push` con `'/pets/pet-1/geofences'`.

**Ficheros de candado** (D8): `language-provider.test.tsx` (+1),
`ui-language.test.ts` (+1), y Δ 0 en `consistency-classnames.test.ts` y
`design-drift.test.ts`.

**Recorridos con el router real (S5).** Ninguno cambia y se corren en el
verde de R4:
- `src/app/__tests__/alert-detail.navigation.test.tsx`;
- `src/app/__tests__/alert-detail.notification.test.tsx`;
- `src/app/__tests__/detail-stack.guard.test.tsx`;
- `src/app/__tests__/detail-stack.navigation.test.tsx`;
- `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`;
- `src/app/__tests__/reminders-alerts-stack.notification.test.tsx`;
- `src/hooks/use-pet-selection.test.tsx`;
- `src/hooks/use-push-registration.navigation.test.tsx`.

| Fichero | Base | Cierre | Δ |
|---|---:|---:|---:|
| `src/providers/__tests__/language-provider.test.tsx` | 10 | 11 | +1 |
| `src/api/__tests__/query-keys.test.ts` | 18 | 20 | +2 |
| `src/api/__tests__/geofences.test.ts` (nuevo) | — | 35 | +35 |
| `src/app/__tests__/layout.test.tsx` | 20 | 22 | +2 |
| `src/app/__tests__/detail-stack.test.tsx` | 15 | 16 | +1 |
| `src/screens/geofences/index.test.tsx` (nuevo) | — | 33 | +33 |
| `src/screens/profile/index.test.tsx` | 39 | 40 | +1 |
| `src/__tests__/ui-language.test.ts` | 26 | 27 | +1 |
| `src/__tests__/design-drift.test.ts` | 55 | 55 | 0 |
| `src/__tests__/consistency-classnames.test.ts` | 53 | 53 | 0 |
| **Total** (medido en `03f57706`) | 86 suites / 1640 | 88 suites / 1716 | **+2 / +76** |

Por requisito: R1 1, R2 18, R3 19, R4 3, R5 11, R6 10, R7 7, R8 5, R9 1 y
R10 1, que suman 76.

## D8 — Inventario de aserciones heredadas que cambian

| # | Fichero › describe › it | Spec dueña | Cambio | R |
|---|---|---|---|---|
| 1 | `language-provider.test.tsx` › `#65 R12: …` › `'mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas'` | #65 | La expresión termina en `- 6 + 1 + 2 + 3 + 11,` y el comentario gana `+ 11 de #41 R1 (geofences.*)` | R1 |
| 2 | `layout.test.tsx` › `#114 R1: …` › `'declara ocho rutas protegidas y alerts singular'` | #114 | `toHaveLength(8 + 1)` → `toHaveLength(8 + 1 + 1); // #100 R2, #41 R4` | R4 |
| 3 | `layout.test.tsx` › `#100 R2: …` › `'declara alerts/[alertId] como noveno hijo y singular'` | #100 | `toHaveLength(9)` → `toHaveLength(9 + 1); // #41 R4` | R4 |
| 4 | `design-drift.test.ts` › mapa `screenSignOutCalls` (lo lee el `it` `'preserves every mutation sign-out with zero delta'` de `#87 R19`) | #108 / #87 | Gana `'screens/geofences/index.tsx': 1,` justo después de `'screens/alert-detail/index.tsx': 1,` | R6 |
| 5 | `consistency-classnames.test.ts` › `#62 R7: …` › `'profile usa tres ChevronRight de reicon'` | #62 | Título → `'profile usa cuatro ChevronRight de reicon'`; `toHaveLength(3)` → `toHaveLength(3 + 1); // #41 R9` | R9 |
| 6 | `consistency-classnames.test.ts` › `#62 R14: …` › fila `[join('screens', 'profile', 'index.tsx'), 3]` de `directUses` | #62 | `3` → `3 + 1], // #41 R9` | R9 |
| 7 | `consistency-classnames.test.ts` › `#62 R14: …` › `'fusiona la esquina una vez y la entrega a las dos ramas de Card'` | #62 | `toBe(33 + 1 + 1 - 1 - 1)` → `toBe(33 + 1 + 1 - 1 - 1 + 1); // #41 R9: geofences-link`. **No se pone rojo**: la tabla y el literal se mueven juntos en el mismo commit | R9 |
| 8 | `consistency-classnames.test.ts` › `#98 R10: …` › `'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban'` | #98 | `toBe(31)` → `toBe(31 + 1); // #41 R9: geofences-link` | R9 |
| 9 | `ui-copy-table.ts` › `R7_PROFILE` | #65 | Nueva fila `geofences.title` tras la de `profile.gpsSettings` | R9 |
| 10 | `ui-language.test.ts` › `#65 R7: …` › `'resuelve las 36 ocurrencias normativas'` | #65 | `toHaveLength(35 - 1 + 2)` → `toHaveLength(35 - 1 + 2 + 1); // #95 R5, +2 #99 R3, +1 #41 R9` | R9 |
| 11 | `ui-copy-table.ts` › `ALL_USES` y, en el mismo fichero, `#65: la tabla de uso de copy está disponible al runner` › `'cuadra ALL_USES con la suma de los doce bloques'` (corre dentro de `ui-language.test.ts`, que importa la tabla) | #65 | Añade `R14_GEOFENCES` a los dos arrays | R10 |
| 12 | `ui-language.test.ts` › `#65 R18: …` › `'no deja ningún valor fijo del catálogo como literal entero en las pantallas'` | #65 | `SCREEN_FILES` de `toHaveLength(19 + 2 + 1 + 1 + 1 + 1)` → `toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1); // #100 R10, #41 R10` | R10 |

**Verificado que no cambian:**

- `legibility-classnames.test.ts`: las clases nuevas están en su vocabulario.
- `hero-header-amendments.test.ts`: A18 no toca sus anclas.
- `src/screens/home/index.test.tsx` y el resto de la suite: verdes en el
  cierre de S2 (88 / 1716).
- Los ocho recorridos con el router real (S5).
- `#62 R14` sobre el `Card`: la tarjeta de la fila usa `Card`, que ya fusiona
  la esquina, así que **no** suma esquinas directas.

## D9 — La fila del Perfil (anclas de R9)

- **Blob y anclas.** Se especifica contra el blob `ef3e7362` de
  `src/screens/profile/index.tsx` (`03f57706`). Codex la busca **por
  contenido**:
  1. `grep -n 'testID="pairing-link"'` da **una** línea.
  2. El `</Pressable>` que cierra ese bloque es el primero tras
     `{t('profile.gpsSettings')}`.
  3. La fila nueva va justo después, todavía dentro de `{pet ? (<>…</>) : null}`.
     `reminders-link` queda fuera de ese bloque y después.
- **Bloque literal:**

  ```tsx
  <Pressable
    accessibilityRole="button"
    testID="geofences-link"
    hitSlop={TOUCH_SLOP}
    className="flex-row items-center justify-between rounded-xl bg-default px-3 py-2"
    style={CONTINUOUS_CORNER}
    onPress={() => router.push(`/pets/${pet.id}/geofences` as Href)}
  >
    <Text className="font-semibold text-foreground">
      {t('geofences.title')}
    </Text>
    <ChevronRight size={20} color={muted} />
  </Pressable>
  ```

- **Sin imports nuevos.** `TOUCH_SLOP`, `CONTINUOUS_CORNER`, `ChevronRight`,
  `router`, `Href` y `muted` ya están en el fichero.
- **Antes del handoff**, comprobar sobre la base del handoff. Por la
  enmienda E1 de [[requirements]] (2026-10-02), esa base es `4e8d6cc3` sin
  #60, cuyo blob del Perfil es `4cc1c08b`. El leader lo comprobó ese día y
  dio 1 y 3:
  - el `grep` de `pairing-link` (1 línea);
  - `grep -c '<ChevronRight' src/screens/profile/index.tsx` → `3`.

  Si alguno no da eso, se recuentan las filas 5–10 de D8.

## Archivos afectados

**Producción** (`mobile-pet-tracker/`):
- `src/api/geofences.ts` (nuevo);
- `src/api/http.ts`;
- `src/api/query-keys.ts`;
- `src/app/pets/[petId]/geofences.tsx` (nuevo);
- `src/app/_layout.tsx`;
- `src/screens/geofences/index.tsx` (nuevo);
- `src/screens/profile/index.tsx`;
- `src/i18n/catalog.ts`.

**Tests**:
- `src/api/__tests__/geofences.test.ts` (nuevo);
- `src/api/__tests__/query-keys.test.ts`;
- `src/app/__tests__/layout.test.tsx`;
- `src/app/__tests__/detail-stack.test.tsx`;
- `src/screens/geofences/index.test.tsx` (nuevo);
- `src/screens/profile/index.test.tsx`;
- `src/providers/__tests__/language-provider.test.tsx`;
- `src/__tests__/consistency-classnames.test.ts`;
- `src/__tests__/design-drift.test.ts`;
- `src/__tests__/ui-copy-table.ts`;
- `src/__tests__/ui-language.test.ts`.

**Docs y specs** (raíz):
- `docs/conventions.md` y `docs/ui-guidelines.md` (A18);
- `specs/mobile-ui-language/design.md` (R1);
- esta spec (trazabilidad).

**No se toca**:
- `backend-pet-tracker/`, `infra/`, `init.sh`, CI;
- `mobile-pet-tracker/package.json` y `mobile-pet-tracker/app.json`;
- `src/components/card.tsx`, `src/api/pets.ts`;
- `src/screens/map/` y `src/components/pet-map*`.

Diffstat de la implementación de referencia: 22 ficheros, +1328 / −14.

## Coordinación con otras sesiones

Ver [[requirements]] §Coordinación. En corto:

- **#60.** Por la enmienda E1 (2026-10-02), el handoff ya no espera a #60.
  D9 se verificó sobre `4e8d6cc3`.
- **Candados compartidos.** El catálogo, `SCREEN_FILES`, los recuentos de
  `#62` y `#98`, los hijos de la guarda y el nombre del bloque `R14_*` los
  recuenta quien mergee segundo.
- **#146** reutiliza `src/api/geofences.ts`, `patchJson`, `geofenceKeys` y
  esta pantalla, a la que añadirá crear y editar.

## Alternativas descartadas

- **`useMutation` de TanStack.** No hay ninguna en el repo, y añadir la
  primera abre otra convención (claves de mutación, `onSettled`,
  invalidación) para dos escrituras. El patrón `write()` + `refetch` ya está
  probado en el centro de alertas.
- **Interruptor optimista** (`setQueryData` antes del `PATCH`). Al fallar hay
  que revertir, y con #145 R3 el `PATCH` tiene efectos en el servidor
  (cierra alertas) que el cliente no ve. El `refetch` es más simple y siempre
  es cierto (P2).
- **Confirmación con un sheet** (como recordatorios). `Alert.alert` es
  nativo, accesible y ya es el patrón de una acción destructiva de una sola
  decisión en `pairing` (P11).
- **Reutilizar `map.trackingNeedsCollar`**: dice otra cosa (P9).
- **Reutilizar `pairing.cancel` y `reminders.delete`**: el catálogo es por
  dominio (P13).
- **Ruta dentro de `(tabs)` o con su propio `_layout`**: la pantalla es de
  detalle y se apila sobre el Perfil. Su sitio es el `Stack.Protected` raíz,
  como `pets/[petId]/docs` y `alerts/[alertId]`.
- **Ocultar la pantalla a quien no es dueño**: el `GET` está abierto a todos
  los roles y la información es útil para la familia (P5, decisión 5 (a) del
  explore).
- **Esconder la fila del Perfil a quien no es dueño**: misma razón (P8).
- **Esqueleto solo con la lista**: produce un parpadeo de la versión de solo
  lectura a la del dueño (P10, M12).
