---
feature: "mobile-docs-upload"
tags: [harness, spec, mobile, design]
---

# Diseño — [[mobile-docs-upload]] (#158)

> Decisiones de alto nivel. Sin código: los nombres exactos de símbolos, testIDs
> y literales están en [[requirements]]; el orden de commits, en [[tasks]].

## §Base medida (base congelada `65f37841`)

Medida una sola vez. Si al arrancar alguna salida no coincide, **para** y avisa
al leader: alguien movió la base. Comandos desde `mobile-pet-tracker/` salvo los
marcados con `(raíz)`.

| # | Comando | Salida en la base |
|---|---|---|
| B1 | `grep -cF 'downloadUrl' src/api/media.ts` | `0` |
| B2 | `grep -cF 'export async function uploadPhotoToUrl' src/api/media.ts` | `1` |
| B3 | `grep -cF 'contentType: PhotoContentType,' src/api/media.ts` | `2` (`requestPhotoUploadUrl` y `uploadPhotoToUrl`) |
| B4 | `grep -cF 'expo-document-picker' package.json` | `0` |
| B5 | `grep -cF 'expo-web-browser' package.json` | `1` |
| B6 | `grep -rlF 'WebBrowser' src` | sin salida (código de salida `1`) |
| B7 | `grep -cF 'testID="screen-docs"' src/screens/docs/index.tsx` | `1` |
| B8 | `grep -cF 'KeyboardAvoidingView' src/screens/docs/index.tsx` | `0` |
| B9 | `grep -cF 'const { token } = useAuth();' src/screens/docs/index.tsx` | `1` |
| B10 | `grep -cF 'signOut(' src/screens/docs/index.tsx` | `0` |
| B11 | `grep -cF 'rounded-xl bg-accent' src/screens/docs/index.tsx` | `0` |
| B12 | `grep -cF "body={t('docs.emptyBody')}" src/screens/docs/index.tsx` | `1` |
| B13 | `grep -cF "jest.mock('../../api/media', () => ({ listPetDocs: jest.fn() }));" src/screens/docs/index.test.tsx` | `1` |
| B14 | `grep -cF "it('no ofrece acción'" src/screens/docs/index.test.tsx` | `1` |
| B15 | `grep -cF 'docs: [' src/screens/docs/index.test.tsx` | `9` |
| B16 | `grep -cF "'screens/docs/index.tsx': 0," src/__tests__/design-drift.test.ts` | `1` |
| B17 | `grep -cF '13 + 1 + 1 + 1 + 1' src/__tests__/consistency-classnames.test.ts` | `2` (el `it` de radio primario y el de acento) |
| B18 | `grep -cF 'expect(R7_PROFILE).toHaveLength(35 - 1 + 2 + 1); // #95 R5, +2 #99 R3, +1 #41 R9' src/__tests__/ui-language.test.ts` | `1` |
| B19 | `grep -cF "{ file: 'src/screens/docs/index.tsx', key:" src/__tests__/ui-copy-table.ts` | `6` |
| B20 | `grep -cF '+ 5, // #155 R1' src/providers/__tests__/language-provider.test.tsx` | `1` (el recuento evalúa a **371**) |
| B21 | `grep -cF '"docs.emptyBody", "When your pet' src/components/__tests__/empty-state.test.tsx` | `1` |
| B22 | `grep -cF '### §2.21 — Añadidos por #155 — Pingo en los estados vacíos' ../specs/mobile-ui-language/design.md` | `1` |
| B23 | `grep -cF '§2.22' ../specs/mobile-ui-language/design.md` | `0` |
| B24 | `grep -cF 'paddingBottom: 291' src/screens/weight-log/index.test.tsx` | `1` |
| B25 | `grep -cF 'testID="geofences-add" className="rounded-xl bg-accent"' src/screens/geofences/index.tsx` | `1` |
| B26 | `grep -cF 'export function civilTodayIso(' src/utils/civil-today-iso.ts` | `1` |
| B27 | (raíz) `grep -cF "@RequirePetRole('owner')" backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts` | `2` |
| B28 | (raíz) `grep -cF '@HttpCode(' backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts` | `1` (`NO_CONTENT` de confirm; crear responde 201) |
| B29 | (raíz) `grep -cF 'PET_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024' backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts` | `1` |
| B30 | (raíz) `grep -cF 'contentType' backend-pet-tracker/src/modules/media/application/dto/create-pet-document.dto.ts` | `0` |
| B31 | (raíz) `grep -cF 'ContentType:' backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts` | `0` |
| B32 | (raíz) `grep -cF 'PET_DOCUMENT_TOO_LARGE' backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts` | `1` |
| B33 | (raíz) `grep -cF 'PET_DOCUMENT_NOT_UPLOADED' backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts` | `1` |
| B34 | `grep -cF '<HeaderHeightContext.Provider value={91}>' src/screens/weight-log/index.test.tsx` | `1` (de ahí sale el 91 de R11) |
| B35 | `grep -cF 'HeaderHeightContext' src/screens/docs/index.test.tsx` | `0` (`renderDocs()` no da cabecera: R11 la añade) |
| B36 | `grep -cF 'testID="docs-list-skeleton"' src/screens/docs/index.tsx` | `1` |
| B37 | `grep -cF 'testID="docs-error"' src/screens/docs/index.tsx` | `1` |
| B38 | `grep -cF "{docs.data && docs.data.kind !== 'ok' ? (" src/screens/docs/index.tsx` | `1` (`docs-error` sale con cualquier `kind` que no sea `ok`) |
| B39 | `grep -cF '{{petName}}' src/i18n/catalog.ts` | `2` (`pairing.readySubtitle` en `en` y `es`; DA8) |
| B40 | `grep -cF "const petName = pet.data?.kind === 'ok' ? pet.data.pet.name : null;" src/screens/docs/index.tsx` | `1` (DA8) |
| B41 | `grep -cF 'function pending<T>(): Promise<T> {' src/screens/docs/index.test.tsx` | `1` |
| B42 | (raíz) `grep -cF 'es idempotente (crea colas, tabla DynamoDB, bucket y bus en LocalStack).' docs/demo-runbook.md` | `1` (§Prueba de humo) |
| B43 | (raíz) `grep -cF '# AWS_PRESIGN_ENDPOINT_URL=http://192.168.x.x:4566' .env.example` | `1` (comentada) |
| B44 | (raíz) `grep -cxF 'AWS_MODE=local' .env.example` | `1` |
| B45 | `grep -cF 'refetchOnWindowFocus: false,' src/providers/query-provider.tsx` | `1` (premisa de §Coexistencia de errores) |
| B46 | `grep -rlF 'petDocs' src --include='*.ts' --include='*.tsx' --exclude='*.test.*' --exclude-dir=__tests__` | dos rutas, `src/api/query-keys.ts` y `src/screens/docs/index.tsx`, en cualquier orden (§Coexistencia de errores) |
| B47 | `grep -cF 'useFakeTimers' src/screens/docs/index.test.tsx` | `0` (el `setTimeout` real vacía el lote de TanStack en R3) |
| B48 | `grep -cF 'button__root--variant-danger-soft' src/screens/geofences/index.test.tsx` | `1` (HeroUI expone `variant` como clase del nodo host; R5) |
| B49 | `grep -cF 'refetchOnReconnect: false,' src/providers/query-provider.tsx` | `1` (§Coexistencia de errores) |
| B50 | `grep -cF 'refetchInterval' src/screens/docs/index.tsx` | `0` (§Coexistencia de errores) |
| B51 | `grep -cF 'useFocusEffect' src/screens/docs/index.tsx` | `0` (§Coexistencia de errores) |

Otros hechos medidos (sin `grep -cF` de una línea):

- El recuento de claves de `language-provider.test.tsx` evalúa a 371 en `en` y en `es`.
- `R7_PROFILE` tiene 37 filas y `SCREEN_FILES` tiene 29 ficheros. `src/screens/docs/index.tsx` ya está en `SCREEN_FILES`.
- `jest-expo` trae dobles de los módulos nativos `ExpoDocumentPicker` y `ExpoWebBrowser` (`node_modules/jest-expo/src/preset/moduleMocks/expoModules.js`). Los tests que montan la ruta de docs sin mockear esos paquetes (`src/app/__tests__/detail-stack.navigation.test.tsx`) no revientan al importarlos.
- `PetState` (`src/api/pets.ts`) tiene cuatro `kind` además de `ok`: `unauthorized`, `error`, `unreachable` y `missing-config`. `PetDocsState` (`src/api/media.ts`) tiene seis: `not-found`, `forbidden`, `unauthorized`, `error`, `unreachable` y `missing-config`. De ahí salen los diez y los siete candados de R3.
- `bunx jest <fichero> --silent` en la base: `src/screens/docs/index.test.tsx` tiene 16 tests, `src/api/__tests__/media.test.ts` 15 y `src/providers/__tests__/language-provider.test.tsx` 24. Los totales por commit de tasks.md parten de ahí.
- `node_modules/expo/bundledNativeModules.json` resuelve `expo-document-picker` para SDK 57. El rango lo escribe `bunx expo install`, no la spec.

## §Ocurrencias de copy en `src/screens/docs/index.tsx`

`checkUses` cuenta las apariciones exactas de `t('<clave>'` por fichero. La
pantalla traduce **todos** los errores en un único punto: el estado guarda el
tipo de error, no el texto, y el render lo traduce. Así cada clave aparece
exactamente una vez, salvo `docs.upload`:

| Clave | Veces | Dónde |
|---|---|---|
| `docs.upload` | 3 | etiqueta de `docs-upload`, `label` de la acción de `EmptyState` y etiqueta de `docs-upload-submit` |
| `docs.type` | 1 | `Label` |
| `docs.name` | 1 | `Label` |
| `docs.date` | 1 | `Label` |
| `docs.datePlaceholder` | 1 | `placeholder` de `docs-date-input` |
| `docs.vet` | 1 | `Label` |
| `docs.cancel` | 1 | etiqueta de `docs-upload-cancel` |
| `docs.errorFileFormat` | 1 | traducción del error |
| `docs.errorFileTooLarge` | 1 | traducción del error (selector y 409 comparten la rama) |
| `docs.errorInvalidForm` | 1 | traducción del error (validación local y 400 comparten la rama) |
| `docs.errorUploadForbidden` | 1 | traducción del error |
| `docs.errorUploadFailed` | 1 | traducción del error |
| `common.cannotReachServer` | 1 | traducción del error |
| `common.somethingWentWrong` | 1 | traducción del error (el rechazo de `getDocumentAsync` de R5, el de `openBrowserAsync` de R10 y las filas de R9 que lo piden comparten la rama) |
| **Total** | **16** | `R7_PROFILE` pasa de 37 a 53 |

Las seis filas de docs que ya existen (`docs.documentsOf`, `docs.pet`,
`docs.noDocumentsYet`, `docs.emptyBody`, `docs.couldNotLoadDocuments`,
`common.retry`) no cambian de recuento.

## §Decisiones

### D1 — Formulario en línea dentro de la pantalla Docs, no una ruta nueva

El precedente es weight-log: formulario y lista en la misma pantalla empujada.
Sin ruta nueva no se toca `_layout.tsx`, ni la excepción A11 de la carta, ni
`SCREEN_FILES`. El formulario ocupa el sitio del botón `docs-upload` y lo oculta
mientras está abierto, así no se pueden abrir dos selectores.

El `KeyboardAvoidingView` (R11) es el patrón de #148. Envuelve al `ScrollView`
con un testID propio para que `screen-docs` siga en el `ScrollView`: los tests de
#95 R6 (`contentContainerStyle`) y de #155 R7 (`slot.parent?.parent` es
`screen-docs`) siguen valiendo sin tocarlos.

### D2 — Selector `expo-document-picker`

Es el selector de archivos del sistema de Expo (`getDocumentAsync`, API de SDK
57 comprobada en `docs.expo.dev/versions/v57.0.0/sdk/document-picker`):
`{ canceled, assets: [{ uri, name, mimeType?, size? }] }`. `expo-image-picker`,
que ya está instalado, solo elige fotos y vídeos: no sirve para un PDF.

- Se instala con `bunx expo install expo-document-picker`. Es un **módulo nativo**: el dev build hay que reconstruirlo antes del humo.
- `copyToCacheDirectory: true` deja el archivo legible al momento. El blob se lee con `fetch(uri).blob()`, como la foto del perfil (`src/screens/profile/index.tsx`). No hace falta `expo-file-system`.
- El tipo se comprueba en cliente porque el backend no lo hace (§0). El `type` del selector solo filtra lo que el sistema enseña, y algunos proveedores lo ignoran; por eso hay además `resolveDocumentContentType`.
- Regla estrecha de `resolveDocumentContentType` (R2.2): la extensión solo decide cuando el `mimeType` falta, viene vacío o es `application/octet-stream`. Cualquier otro `mimeType` no reconocido da `null`. Un proveedor que dice `image/heic` sabe lo que tiene, aunque el nombre acabe en `.jpg`: subirlo como `image/jpeg` dejaría en S3 un archivo que el visor no abre. Descartada la regla ancha («si el mime no se reconoce, manda la extensión»).
- `fileName` no se recorta en `?` ni en `#`, a diferencia de `resolvePhotoContentType`, que recibe una URI. Aquí es el nombre visible del asset: un `Factura #12.pdf` sin `mimeType` tiene que dar PDF. La extensión es lo que va tras el último `.`, en minúsculas.
- El tamaño se comprueba en cliente cuando el asset lo trae. Cuando no lo trae, decide el `409 PET_DOCUMENT_TOO_LARGE` de confirm.

### D3 — Abrir con `expo-web-browser`, no con `Linking.openURL` (DA4)

`openBrowserAsync` abre una Custom Tab sobre la app: el usuario vuelve con un
gesto y no sale de Pet Tracker. Ya está instalado, así que no hace falta
reconstruir nada por él. Se mockea con un `jest.fn`.

Límite conocido: Android no pinta PDFs en una Custom Tab, los descarga.
`Linking.openURL` tiene el mismo límite y además saca al usuario de la app.

### D4 — API: dos funciones nuevas y se reutiliza el `PUT` de la foto

- `createPetDocument` y `confirmPetDocumentUpload` siguen el molde de `requestPhotoUploadUrl`: `postJson` de `./http`, `missing-config` sin `baseUrl`, un `kind` por estado.
- El `code` del 409 se lee con `readJson` como en `src/api/geofences.ts`.
- `uploadPhotoToUrl` ya hace un `PUT` con un `Blob` cualquiera. Solo se ensancha el tipo de `contentType`. No se renombra, porque renombrarla tocaría el perfil y sus tests, que quedan fuera. *(Enmienda E1: «un `Blob` cualquiera» no basta en nativo; el cuerpo se re-envuelve con el tipo, ver D8.)*
- `downloadUrl` pasa a ser obligatorio en `PetDocument`. El backend de #157 lo manda siempre (`pet-document.mapper.ts`).

### D5 — Secuencia y estado de la subida

Orden: leer el blob, crear, `PUT`, confirmar, `refetch`. El blob se lee **antes**
de crear: si el archivo local no se puede leer, no queda ningún documento
pendiente en el backend.

- Estado de la pantalla: el asset elegido (abre o cierra el formulario), los cuatro campos, `uploading` y el tipo del último error.
- Errores y `signOut` se resuelven en un único punto. Eso da una sola llamada `signOut(` (design-drift 0 → 1) y una sola aparición de cada clave de error (§Ocurrencias).
- Tras el éxito se hace `refetch` de la consulta de la lista (como `weights.refetch()` en weight-log), sin estado optimista.
- La fecha por defecto es `civilTodayIso(undefined)`, la fecha civil del dispositivo. Usar la del perfil exigiría una consulta `getMe` más en la pantalla y en sus tests (DA7).
- Los `maxLength` de los inputs son los límites del DTO. Así un texto largo no llega a ser un 400.

### D6 — Errores: tres familias de copy

| Familia | Ramas | Clave |
|---|---|---|
| El archivo no subió | lectura local, `PUT` error o inalcanzable, `409 NOT_UPLOADED` | `docs.errorUploadFailed` |
| Red de la API | `unreachable` en crear o confirmar | `common.cannotReachServer` |
| Permiso | `403` en crear o confirmar | `docs.errorUploadForbidden` |

El `PUT` inalcanzable no usa `common.cannotReachServer` porque el `PUT` va a
S3 (LocalStack en local), no a la API. Decir «servidor» confundiría al
diagnosticar un fallo de IP LAN en `AWS_PRESIGN_ENDPOINT_URL`.

### D7 — Copy

Doce claves nuevas en el espacio `docs.*`. Se reutilizan solo `common.*`. El
catálogo ya repite literales por pantalla (`geofences.cancel`,
`reminders.cancel`, `pairing.cancel`; `weightLog.yyyyMmDd`), así que
`docs.cancel` y `docs.datePlaceholder` siguen ese precedente. Ningún literal sale
del canvas de propuesta UI: la copy no aprobada no se copia (DA1).

### D8 — El cuerpo del `PUT` se re-envuelve con el tipo declarado (Enmienda E1, R14)

- Causa, medida por el leader en `progress/explore_mobile-docs-upload-e1.md`: en
  nativo `fetch` es `expo/fetch` (`node_modules/expo/src/winter/runtime.native.ts`,
  `install('fetch', () => require('./fetch').fetch)`). En
  `node_modules/expo/src/winter/fetch/RequestUtils.ts`, con un `Blob` como cuerpo,
  `normalizeBodyInitAsync` devuelve `overriddenHeaders: [['Content-Type', body.type]]`,
  que sustituye la cabecera del llamante. El blob que lee Docs de un `file://`
  tiene `type === ''` (`FetchResponse.ts`: `this.headers.get('content-type') ?? ''`).
- Arreglo: `body: new Blob([body], { type: contentType })` dentro de
  `uploadPhotoToUrl`. Es una línea en la función por la que pasan los tres
  llamantes, así que cubre también las fotos de add-pet y de perfil, que tienen
  el mismo defecto aunque `<Image>` no lo deja ver.
- El `Blob` del teléfono es el de React Native: su constructor llama a
  `BlobManager.createFromParts(parts, options)`, que acepta partes `Blob` y toma
  `type: options ? options.type : ''`. En jest es el `Blob` de Node, con el mismo
  contrato. `bunx tsc --noEmit` y `bunx eslint --no-cache` aceptan la línea
  (medido en una copia fuera del árbol).
- Alternativas descartadas:
  - poner el tipo en el blob de la pantalla Docs: arregla un llamante de tres y
    deja las fotos igual;
  - `EXPO_PUBLIC_USE_RN_FETCH=1`: cambia la implementación de `fetch` de toda la
    app para arreglar una cabecera;
  - leer el archivo a un `ArrayBuffer` y mandarlo así: carga hasta 10 MB en
    memoria de JS y cambia el contrato `body: Blob` de la función;
  - firmar la URL con `ContentType` en el backend: el backend está fuera de
    alcance, y no evita que `expo/fetch` mande la cabecera vacía; solo haría
    que el `PUT` fallase por firma.

## §Coexistencia de `docs-action-error` y `docs-error`

Hoy no pueden estar pintados a la vez, y por eso R5 no fija la posición de uno
respecto al otro. La lista de documentos solo pasa de `ok` a otro `kind` con un
refetch, y ningún refetch llega con un error de acción vivo:

- el cliente de consultas no refresca por foco (B45) ni por reconexión (B49), y la pantalla no tiene `refetchInterval` ni `useFocusEffect` (B50 y B51);
- la clave `petDocs` solo aparece en `src/api/query-keys.ts` y en la propia pantalla (B46), así que nadie más invalida la lista;
- el único refetch propio es el paso 6 de R7. Ese intento empezó quitando el error (R9, nuevo intento), y si el refetch no da `ok`, R7 pinta `docs-error` y no un error de acción;
- `docs-retry` solo existe con la lista ya en otro `kind`, y entonces no hay entradas (R3) ni filas (R10) que generen errores de acción.

Si alguien activa el refetch por foco o por reconexión, añade un intervalo o
invalida `petDocs` desde otro fichero, B45, B46, B49, B50 o B51 cambian de valor y esta premisa hay que revisarla.

El hueco de la **mascota** que se refresca desde otra pantalla mientras docs
está montada queda fuera de alcance como delimitación ([[requirements]]
§Fuera de alcance).

## §Coordinación con #159

#159 (`mobile-no-collar-states-pingo`) toca algunos de los mismos ficheros de
test. Fuente: `specs/mobile-no-collar-states-pingo/design.md` §Coordinación con
#158 (K1-K9), en la branch `feature/159-mobile-no-collar-states-pingo`.

- `src/providers/__tests__/language-provider.test.tsx` es el único candado que se pisa. #158 suma 12 (de 371 a 383). #159 suma 4 y resta 1 (375 y luego 374). Quien mergee segundo deja la longitud en 386.
- `src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts` no se pisan: #158 solo toca `R7_PROFILE`, y #159 `R4_MAP` y `R14_GEOFENCES`.
- En `src/components/__tests__/empty-state.test.tsx`, #158 solo cambia la fila `docs.emptyBody` de `copyRows`. #159 cambia K7 de map y geofences y añade `describe` al final.
- En `specs/mobile-ui-language/design.md`, la §2.22 es de #158 y la §2.23 de #159.
- UI-Pet confirmó, medido sobre `65f37841` + `b6049e61`, que #159 no mueve `rounded-xl bg-accent`, `design-drift` ni `SCREEN_FILES`.

## §Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Ruta nueva `pets/[petId]/docs-upload` | Mueve `_layout.tsx`, la excepción A11 de la carta, `SCREEN_FILES` y el test de rutas delgadas para un formulario de cuatro campos. |
| Bottom sheet (`@gorhom/bottom-sheet`) | El teclado dentro de una sheet necesita su propio manejo y no hay precedente con inputs en el repo. |
| `Linking.openURL` | Saca de la app y tiene el mismo límite con PDFs (D3). |
| `expo-file-system` para leer el archivo | `fetch(uri).blob()` ya funciona con `copyToCacheDirectory` y lo usa el perfil. |
| Renombrar `uploadPhotoToUrl` a algo genérico | Toca el perfil y sus tests sin ganar comportamiento. |
| Estado optimista de la fila nueva | El `refetch` trae además la `downloadUrl` firmada, que el cliente no tiene. |
| Selector de tipo con lista cerrada | El backend guarda texto libre y `documentCategory` ya clasifica texto libre (DA3). |

## §Ficheros afectados por capa

| Capa | Fichero | Cambio |
|---|---|---|
| infraestructura (API) | `mobile-pet-tracker/src/api/media.ts` | R2; R14 (Enmienda E1: una línea en `uploadPhotoToUrl`) |
| infraestructura (test) | `mobile-pet-tracker/src/api/__tests__/media.test.ts` | R2; las fixtures de R8 ganan `downloadUrl`; R14 (Enmienda E1: `describe` nuevo con un `it.each` de 12 filas, `contentType` × tipo del blob de entrada, y una línea del `it` de R2 `uploadPhotoToUrl manda application/pdf sin Authorization`) |
| presentación | `mobile-pet-tracker/src/screens/docs/index.tsx` | R3-R11 |
| presentación (test) | `mobile-pet-tracker/src/screens/docs/index.test.tsx` | R3-R11; las fixtures ganan `downloadUrl`; T4 redirige `no ofrece acción` |
| i18n | `mobile-pet-tracker/src/i18n/catalog.ts` | R1 |
| candados | `src/providers/__tests__/language-provider.test.tsx`, `src/components/__tests__/empty-state.test.tsx`, `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`, `src/__tests__/consistency-classnames.test.ts`, `src/__tests__/design-drift.test.ts` | R1, R12 |
| ledger | `specs/mobile-ui-language/design.md` | R1, §2.22 |
| dependencias | `mobile-pet-tracker/package.json`, `mobile-pet-tracker/bun.lock` y, si `expo install` lo añade, el `plugins` de la configuración de la app | `expo-document-picker` |

No cambian: `src/app/pets/[petId]/docs.tsx`, `src/app/_layout.tsx`,
`src/components/empty-state.tsx`, `src/components/card.tsx` y todo
`backend-pet-tracker/`.

## §Skills para el handoff

Nuestras (para el leader y el reviewer): `expo:expo-overview`,
`expo:expo-native-ui`, `expo:expo-ui`, `expo:expo-design-system`,
`expo:expo-tailwind-setup`, `expo:expo-dev-client` (reconstruir el dev build) y
`appllama-app-design-skill`, que la carta exige en tareas de UI.

Para **Codex** (nombres de `.claude/agents/leader.md` §Catálogo real de skills
de Codex): `building-native-ui` (sustituye a `expo-overview` y a
`expo-native-ui`), `native-data-fetching`, `expo-tailwind-setup` y
`expo-dev-client`. No hay equivalente de `expo-design-system` ni de
appllama: las decisiones de UI van escritas en [[requirements]] (clases,
testIDs y orden de hijos), no se delegan a una skill. No hay animación en esta
feature.
