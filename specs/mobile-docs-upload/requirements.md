---
feature: "mobile-docs-upload"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-docs-upload]] (#158)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y la base medida, [[tasks]] para
> el orden test-primero y los candados que se mueven, y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI que rige la
> pantalla.
>
> **Base congelada**: `65f37841` (origin/main tras el merge de #155, PR #203).
> Todos los hechos de esta spec se comprobaron contra ese árbol. Las anclas son
> contenido que se busca con `grep -cF`, nunca números de línea. Los comandos
> y sus salidas sobre la base están en [[design]] §Base medida.
>
> **Solo móvil.** El backend de `media` no se toca: lo tiene abierto otra sesión
> (#162). Lo que falte del backend va a §Decisiones abiertas, no a un requisito.

## §0. Contrato del backend (comprobado contra el árbol, no contra la entrada)

Rutas relativas a `EXPO_PUBLIC_API_URL`, que ya incluye `/v1`. Las tres viven en
`backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts`
(`@Controller('pets/:petId/media')`, con `PetAccessGuard`).

| Endpoint | Quién | Éxito | Errores que el móvil distingue |
|---|---|---|---|
| `GET /pets/:petId/media` | cualquier miembro | `200` con `[{ id, type, name, date, vet, key, downloadUrl }]`, solo documentos confirmados | `401`, `403`, `404` |
| `POST /pets/:petId/media`, body `{ type, name, date, vet? }` | solo `owner` | **`201`** con `{ document: { id, type, name, date, vet, key }, uploadUrl, expiresInSeconds }` | `400` (validación zod), `401`, `403`, `404` |
| `POST /pets/:petId/media/:documentId/confirm`, sin body útil | solo `owner` | **`204`** sin body | `401`, `403`, `404 PET_DOCUMENT_NOT_FOUND`, `409 PET_DOCUMENT_NOT_UPLOADED`, `409 PET_DOCUMENT_TOO_LARGE` |

Hechos del contrato que fijan decisiones de esta spec (prueba en [[design]] §Base medida):

- `POST` de creación no lleva `@HttpCode`: responde **201**, no 200. Solo hay un `@HttpCode(` en el controlador y es el `NO_CONTENT` de confirm.
- El DTO de creación es `type` (trim, 1-40), `name` (trim, 1-120), `date` (`YYYY-MM-DD`, fecha de calendario válida) y `vet` (trim, 1-120, **opcional**). Un `vet` vacío es un 400: el móvil lo omite.
- El DTO **no** lleva `contentType` y el `PutObjectCommand` firmado no fija `ContentType` (D3 del backend). El backend acepta cualquier tipo de archivo: **los tipos permitidos los fija el móvil** (R5).
- El tamaño máximo es `PET_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024` (10 485 760 bytes). El backend lo comprueba en confirm con `HeadObject` y responde `409 PET_DOCUMENT_TOO_LARGE` si `size > max`.
- La URL de subida caduca a los 600 s (`DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS`). La de descarga, a los 3600 s (`DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS`).
- Crear deja el documento **pendiente** (`uploadedAt: null`). La lista solo devuelve confirmados, así que un intento fallido no aparece en la lista pero queda en base de datos (ver §Decisiones abiertas, DA5).

## §Discrepancias con la entrada de `feature_list.json` (gana el árbol)

1. El `PetDocument` del móvil (`src/api/media.ts`) **no tiene `downloadUrl`**; el backend de #157 sí lo envía. R2 lo añade.
2. El test `#155 R7 › no ofrece acción` de `src/screens/docs/index.test.tsx` usa una mascota **owner** y asevera que no hay `docs-empty-action`. Contradice esta feature: R4 lo redirige a los roles que no son owner (ver [[tasks]] T4).
3. `expo-web-browser` ya está en `package.json` pero ningún fichero de `src/` lo usa. `expo-document-picker` **no** está instalado.

## Copy nueva (literales exactos, que Codex no traduce)

Doce claves nuevas y una cambiada. Ninguna tiene interpolación. Los mensajes de
error siguen el estilo del catálogo: sin punto final.

| Clave | `en` | `es` |
|---|---|---|
| `docs.upload` | `Upload document` | `Subir documento` |
| `docs.type` | `Type` | `Tipo` |
| `docs.name` | `Name` | `Nombre` |
| `docs.date` | `Date` | `Fecha` |
| `docs.datePlaceholder` | `YYYY-MM-DD` | `AAAA-MM-DD` |
| `docs.vet` | `Vet (optional)` | `Veterinario (opcional)` |
| `docs.cancel` | `Cancel` | `Cancelar` |
| `docs.errorFileFormat` | `Choose a PDF, JPEG, or PNG file` | `Elige un archivo PDF, JPEG o PNG` |
| `docs.errorFileTooLarge` | `The file is larger than 10 MB` | `El archivo pesa más de 10 MB` |
| `docs.errorInvalidForm` | `Add a type, a name, and a date in YYYY-MM-DD format` | `Añade un tipo, un nombre y una fecha con formato AAAA-MM-DD` |
| `docs.errorUploadForbidden` | `Only the owner can upload documents` | `Solo el dueño puede subir documentos` |
| `docs.errorUploadFailed` | `The file could not be uploaded. Try again` | `No se pudo subir el archivo. Inténtalo de nuevo` |
| `docs.emptyBody` (**cambiada**) | `When a medical document for your pet is uploaded, I'll keep it here.` | `Cuando se suba un documento médico de tu mascota, te lo guardo aquí.` |

`docs.emptyBody` sigue en voz B (Pingo, primera persona, tutea, sin exclamación
ni emoji, termina en punto). Es neutra de rol porque family, walker y vet ven
el mismo vacío sin la acción. Se reutilizan además dos claves existentes:
`common.cannotReachServer` (`No se pudo conectar con el servidor`) y
`common.somethingWentWrong` (`Algo salió mal`).

## Requisitos funcionales

### R1: el catálogo trae las doce claves nuevas y la frase nueva de Pingo

**THE SYSTEM SHALL** declarar en `src/i18n/catalog.ts`, en `en` y en `es`, las
doce claves nuevas de §Copy nueva con sus literales exactos, y cambiar
`docs.emptyBody` a los dos literales nuevos de esa tabla.

**THE SYSTEM SHALL** mantener los candados de catálogo de la base en verde con
sus valores nuevos:

- `src/providers/__tests__/language-provider.test.tsx`: el recuento de claves pasa de **371 a 383** (`+ 12 // #158 R1`), igual en `en` y `es`;
- `specs/mobile-ui-language/design.md`: una sección nueva `### §2.22 — Añadidos por #158 — Subir documentos` con una fila por clave nueva (`← añadida por #158 (R1)`) y una fila para `docs.emptyBody` (`← cambiada por #158 (R1)`). La fila histórica de #155 se queda;
- `src/components/__tests__/empty-state.test.tsx`: la fila `docs.emptyBody` de `copyRows` lleva los literales nuevos.

### R2: la API de media crea, sube y confirma documentos, y la lista trae `downloadUrl`

En `src/api/media.ts`:

1. **THE SYSTEM SHALL** exigir `downloadUrl: string` en `PetDocument`. **IF** un elemento de la lista no trae `downloadUrl` de tipo string, **THEN** `listPetDocs` devuelve `{ kind: 'error' }`. Son tres candados: `downloadUrl` ausente, `null` y `42`.
2. **THE SYSTEM SHALL** exportar `DocumentContentType = 'application/pdf' | 'image/jpeg' | 'image/png'`, `DOCUMENT_MAX_BYTES = 10485760` y `resolveDocumentContentType(mimeType, fileName)`, que devuelve el tipo por `mimeType`, comparado en minúsculas. Solo cuando `mimeType` es `undefined`, `''` o `'application/octet-stream'` (también este en mayúsculas), decide la extensión de `fileName`: lo que va tras su **último** `.`, en minúsculas, sin recortar nada más. `fileName` es el nombre visible del asset y no una URI, así que `?` y `#` son parte del nombre. Las extensiones admitidas son `pdf`, `jpg`, `jpeg` y `png`. **IF** `mimeType` trae cualquier otro valor que no reconoce, **THEN** devuelve `null` sin mirar la extensión: un HEIC llamado `.jpg` no sube como JPEG ([[design]] D2). Si nada encaja, devuelve `null`. Cada fila de esta tabla es un candado, 24 en total:

   | `mimeType` | `fileName` | Resultado | Rama |
   |---|---|---|---|
   | `'application/pdf'` | `'a.bin'` | `'application/pdf'` | mimeType PDF |
   | `'image/jpeg'` | `'a.bin'` | `'image/jpeg'` | mimeType JPEG |
   | `'image/png'` | `'a.bin'` | `'image/png'` | mimeType PNG |
   | `'IMAGE/PNG'` | `'a.bin'` | `'image/png'` | mimeType en mayúsculas |
   | `'image/png'` | `'x.pdf'` | `'image/png'` | el mimeType manda sobre la extensión |
   | `'application/octet-stream'` | `'a.pdf'` | `'application/pdf'` | octet-stream: decide la extensión |
   | `'APPLICATION/OCTET-STREAM'` | `'a.png'` | `'image/png'` | octet-stream en mayúsculas: decide la extensión |
   | `''` | `'a.pdf'` | `'application/pdf'` | mimeType vacío: decide la extensión |
   | `'image/heic'` | `'a.jpg'` | `null` | otro mimeType no reconocido: no mira la extensión |
   | `'text/plain'` | `'a.png'` | `null` | otro mimeType no reconocido: no mira la extensión |
   | `undefined` | `'a.pdf'` | `'application/pdf'` | extensión `.pdf` |
   | `undefined` | `'a.jpg'` | `'image/jpeg'` | extensión `.jpg` |
   | `undefined` | `'a.jpeg'` | `'image/jpeg'` | extensión `.jpeg` |
   | `undefined` | `'a.png'` | `'image/png'` | extensión `.png` |
   | `undefined` | `'A.PNG'` | `'image/png'` | extensión en mayúsculas |
   | `undefined` | `'a.pdf?v=1'` | `null` | sin recorte en `?`: la extensión es `pdf?v=1` |
   | `undefined` | `'a.pdf#p'` | `null` | sin recorte en `#`: la extensión es `pdf#p` |
   | `undefined` | `'Factura #12.pdf'` | `'application/pdf'` | `#` antes del último `.` no corta el nombre |
   | `undefined` | `'informe.v2.pdf'` | `'application/pdf'` | cuenta el último `.`, no el primero |
   | `'image/webp'` | `'a.webp'` | `null` | tipo no admitido |
   | `undefined` | `'a.heic'` | `null` | extensión no admitida |
   | `'text/plain'` | `'a.txt'` | `null` | texto |
   | `undefined` | `'a'` | `null` | sin extensión |
   | `undefined` | `'apdf'` | `null` | la extensión empieza tras un `.`: acabar en `pdf` no basta |
3. **THE SYSTEM SHALL** exportar `createPetDocument(baseUrl, token, petId, input, fetchFn = fetch)`, que hace `POST /pets/${petId}/media` con `input` como body JSON y traduce la respuesta así:

   | Respuesta | Resultado |
   |---|---|
   | sin `baseUrl` | `{ kind: 'missing-config' }`, sin llamar a `fetch` |
   | `fetch` rechaza | `{ kind: 'unreachable', message }` |
   | `201` con `document.id` y `uploadUrl` strings | `{ kind: 'ok', documentId, uploadUrl }` |
   | `201` sin `document.id` string (con `uploadUrl`) | `{ kind: 'error' }` |
   | `201` sin `uploadUrl` string (con `document.id`) | `{ kind: 'error' }` |
   | `400` | `{ kind: 'invalid' }` |
   | `401` | `{ kind: 'unauthorized' }` |
   | `403` | `{ kind: 'forbidden' }` |
   | `404` | `{ kind: 'not-found' }` |
   | `200` con un body de 201 válido | `{ kind: 'error' }` |
   | `500` | `{ kind: 'error' }` |

   Son once filas y cada una es un candado.

4. **THE SYSTEM SHALL** exportar `confirmPetDocumentUpload(baseUrl, token, petId, documentId, fetchFn = fetch)`, que hace `POST /pets/${petId}/media/${documentId}/confirm` con body `{}` y traduce la respuesta así:

   | Respuesta | Resultado |
   |---|---|
   | sin `baseUrl` | `{ kind: 'missing-config' }`, sin llamar a `fetch` |
   | `fetch` rechaza | `{ kind: 'unreachable', message }` |
   | `204` | `{ kind: 'ok' }` |
   | `409` con `code: 'PET_DOCUMENT_NOT_UPLOADED'` | `{ kind: 'not-uploaded' }` |
   | `409` con `code: 'PET_DOCUMENT_TOO_LARGE'` | `{ kind: 'too-large' }` |
   | `409` con otro `code` | `{ kind: 'error' }` |
   | `409` sin body | `{ kind: 'error' }` |
   | `401` | `{ kind: 'unauthorized' }` |
   | `403` | `{ kind: 'forbidden' }` |
   | `404` | `{ kind: 'not-found' }` |
   | `200` | `{ kind: 'error' }` |
   | `500` | `{ kind: 'error' }` |

   Son doce filas y cada una es un candado.

5. **THE SYSTEM SHALL** aceptar `DocumentContentType` en el parámetro `contentType` de `uploadPhotoToUrl`, sin cambiar su nombre ni su comportamiento: `PUT` con cabecera `Content-Type` y sin `Authorization`. *(Enmienda E1: el comportamiento cambia en un punto, el cuerpo del `PUT` pasa a ser un `Blob` con `type === contentType`; ver R14.)*

### R3: el owner ve la acción de subir, en la lista y en el vacío

**WHILE** la mascota resuelve `{ kind: 'ok' }` con `myRole === 'owner'` y no hay
formulario abierto (R5), **THE SYSTEM SHALL**:

- con la lista en `{ kind: 'ok' }` y al menos un documento, pintar un `Button` `testID="docs-upload"`, `className="rounded-xl bg-accent"`, con `Button.Label className="font-bold text-accent-foreground"` y el texto `Subir documento`. Es el segundo hijo del contenedor de `screen-docs`, justo después de la cabecera y antes de la primera fila: los hijos son `['View', 'docs-upload', 'doc-<id>', …]`;
- con la lista en `{ kind: 'ok' }` y vacía, pasar a `EmptyState testID="docs-empty"` la prop `action` con la etiqueta `Subir documento`. Así se pinta `docs-empty-action` dentro del vacío. El vacío sigue siendo un único `<EmptyState` en el fichero.

**WHEN** el owner pulsa `docs-upload` o `docs-empty-action` **THE SYSTEM SHALL**
llamar una vez a
`DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/jpeg', 'image/png'], copyToCacheDirectory: true, multiple: false })`.
Son dos candados, uno por entrada.

**WHILE** la lista de documentos no ha resuelto (se pinta `docs-list-skeleton`) o
ha resuelto con un `kind` distinto de `ok` (se pinta `docs-error`), **THE SYSTEM
SHALL NOT** pintar `docs-upload` ni `docs-empty-action`, tampoco para el owner.
Son siete candados, todos con el owner: la lista pendiente y los seis `kind` que
no son `ok` (`not-found`, `forbidden`, `unauthorized`, `error`, `unreachable` y
`missing-config`).

**WHILE** la consulta de la mascota no ha resuelto `{ kind: 'ok' }`, **THE
SYSTEM SHALL NOT** pintar `docs-upload` ni `docs-empty-action`, ni con la lista
con documentos ni con la lista vacía. Son diez candados: la consulta pendiente y
los cuatro `kind` que no son `ok` (`unauthorized`, `error`, `unreachable` y
`missing-config`), cada uno con la lista `[doc-1]` y con la lista vacía.

### R4: family, walker y vet no ven la acción de subir

**IF** la mascota resuelve con `myRole` `family`, `walker` o `vet`, **THEN THE
SYSTEM SHALL NOT** pintar `docs-upload` ni `docs-empty-action`, ni con la lista
con documentos ni con la lista vacía. Con la lista vacía, los hijos de
`docs-empty` son exactamente `['docs-empty-pose', 'docs-empty-title', 'docs-empty-body']`.

Son seis casos (tres roles × dos estados) y cada uno tiene su propio candado.

### R5: el selector filtra el archivo y, si vale, abre el formulario

**WHEN** `getDocumentAsync` resuelve o rechaza, **THE SYSTEM SHALL** actuar así:

| Resultado del selector | Efecto |
|---|---|
| `{ canceled: true, assets: null }` | `docs-upload-form` y `docs-action-error` ausentes; la entrada pulsada sigue pintada |
| asset cuyo `resolveDocumentContentType(mimeType, name)` es `null` | `docs-action-error` con `Elige un archivo PDF, JPEG o PNG`; sin formulario |
| tipo válido y `size > 10485760` | `docs-action-error` con `El archivo pesa más de 10 MB`; sin formulario |
| tipo inválido y `size > 10485760` | gana el tipo: `Elige un archivo PDF, JPEG o PNG` |
| tipo válido y `size === 10485760` | abre el formulario |
| tipo válido y `size` ausente | abre el formulario (el backend decide en confirm, R9) |
| la promesa rechaza (por ejemplo, un dev build sin el módulo nativo) | `docs-action-error` con `Algo salió mal`; sin formulario |

Son siete filas y cada una es un candado.

`docs-action-error` es un único `Text` `testID="docs-action-error"`, `selectable`,
`className="text-danger"`. Va en el contenedor de `screen-docs` después de
`docs-upload` o del formulario y antes de `docs-empty` y de las filas. Sin
formulario, los hijos son `['View', 'docs-action-error', 'docs-empty']` con la
lista vacía y `['View', 'docs-upload', 'docs-action-error', 'doc-<id>', …]` con
documentos: dos candados. El orden con el formulario abierto lo fija R6, que es
donde el error y el formulario coexisten por primera vez.

**WHEN** el owner vuelve a pulsar `docs-upload` o `docs-empty-action` con un
`docs-action-error` pintado, **THE SYSTEM SHALL** quitarlo antes de abrir el
selector. Son dos candados, uno por entrada.

**WHEN** el formulario se abre **THE SYSTEM SHALL** pintar un `View`
`testID="docs-upload-form"` en el sitio de `docs-upload` (justo después de la
cabecera), dejar de pintar `docs-upload` y `docs-empty-action`, y pintar dentro:

- `Text testID="docs-upload-file"` con el `name` del asset;
- cuatro `TextField`, cada uno con `Label className="text-2xs font-semibold text-foreground"` e `Input className="rounded-xl bg-default"`:

  | Label | `Input testID` | Valor inicial | Props |
  |---|---|---|---|
  | `Tipo` | `docs-type-input` | `''` | `maxLength={40}` |
  | `Nombre` | `docs-name-input` | `''` | `maxLength={120}` |
  | `Fecha` | `docs-date-input` | `civilTodayIso(undefined)` (fecha civil del dispositivo) | `placeholder` = `AAAA-MM-DD` |
  | `Veterinario (opcional)` | `docs-vet-input` | `''` | `maxLength={120}` |

- `Button testID="docs-upload-submit"` `className="rounded-xl bg-accent"` con `Button.Label className="font-bold text-accent-foreground"` y el texto `Subir documento`;
- `Button testID="docs-upload-cancel"` `className="rounded-xl"` `variant="outline"` con `Button.Label className="font-semibold"` y el texto `Cancelar`.

Con la lista vacía y el formulario abierto, los hijos del contenedor son
`['View', 'docs-upload-form', 'docs-empty']`. Con documentos, son
`['View', 'docs-upload-form', 'doc-<id>', …]`.

**WHEN** el owner pulsa `docs-upload-cancel` **THE SYSTEM SHALL** cerrar el
formulario, devolver los cuatro campos al valor inicial de la tabla de arriba
(los ve quien vuelve a abrir el formulario), quitar `docs-action-error` y volver
a pintar la entrada que toca (`docs-upload` con documentos, `docs-empty-action`
con la lista vacía), sin leer el archivo ni llamar a la API. Son dos candados,
uno por entrada. El de quitar `docs-action-error` va en R6, por el mismo motivo
que el orden de arriba.

### R6: el formulario valida antes de llamar a nada

**WHEN** el owner pulsa `docs-upload-submit` **IF** `type.trim()` está vacío,
**OR** `name.trim()` está vacío, **OR** `date.trim()` no casa con
`/^\d{4}-\d{2}-\d{2}$/`, **THEN THE SYSTEM SHALL** pintar `docs-action-error` con
`Añade un tipo, un nombre y una fecha con formato AAAA-MM-DD` y **no** leer el
archivo ni llamar a `createPetDocument`.

Son tres ramas (tipo solo con espacios, nombre vacío y fecha `09/10/2026`) y
cada una tiene su candado.

Con el formulario abierto y ese error pintado, los hijos del contenedor son
`['View', 'docs-upload-form', 'docs-action-error', 'docs-empty']` con la lista
vacía y `['View', 'docs-upload-form', 'docs-action-error', 'doc-<id>', …]` con
documentos. **WHEN** el owner pulsa `docs-upload-cancel` en ese estado, **THE
SYSTEM SHALL** quitar `docs-action-error` (R5). Son dos candados, uno por lista,
y cada uno comprueba el orden y la limpieza.

### R7: una subida correcta aparece en la lista sin recargar a mano

**WHEN** el owner pulsa `docs-upload-submit` con el formulario válido **THE
SYSTEM SHALL**, en este orden:

1. leer el archivo con `fetch(asset.uri)` y `.blob()`;
2. llamar a `createPetDocument(apiUrl, token, petId, input)` con `type`, `name` y `date` recortados y con `vet` recortado **solo si** no queda vacío (si queda vacío, `input` no tiene la propiedad `vet`);
3. llamar a `uploadPhotoToUrl(uploadUrl, blob, contentType)` con el `uploadUrl` de 2 y el tipo de R5;
4. llamar a `confirmPetDocumentUpload(apiUrl, token, petId, documentId)` con el `documentId` de 2;
5. `await` al `refetch` de la consulta `mediaKeys.petDocs(petId)`;
6. cerrar el formulario y volver a pintar `docs-upload`.

La fila nueva aparece porque la lista se vuelve a pedir. No hay estado optimista.

Son dos candados de la secuencia: un PDF con `mimeType` y los cuatro campos con
espacios a los lados (los cuatro llegan recortados), y un PNG sin `mimeType` con
el veterinario solo con espacios (`input` sin `vet` y `contentType` `image/png`).

**IF** el `refetch` del paso 5 resuelve con un `kind` distinto de `ok`, **THEN
THE SYSTEM SHALL** cerrar igualmente el formulario y pintar lo que R3 fija para
esa lista: `docs-error`, sin `docs-upload` ni `docs-empty-action`. Lleva un
candado, con `{ kind: 'error' }`.

### R8: mientras sube, los botones del formulario están bloqueados

**WHILE** la subida de R7 está en curso (desde que pasa la validación de R6
hasta que termina el `refetch` o se pinta un error de R9), **THE SYSTEM SHALL**
pintar `docs-upload-submit` y `docs-upload-cancel` con
`accessibilityState.disabled === true`. Otra pulsación de `docs-upload-submit`
no vuelve a leer el archivo ni a llamar a `createPetDocument`, y una pulsación
de `docs-upload-cancel` no cierra el formulario.

Son seis etapas con un candado cada una: `fetch(asset.uri)` pendiente, `.blob()`
pendiente, `createPetDocument` pendiente, `uploadPhotoToUrl` pendiente,
`confirmPetDocumentUpload` pendiente y el `refetch` pendiente.

**WHEN** la subida termina en un error de R9 **THE SYSTEM SHALL** rehabilitar los
dos botones. Aquí lleva un candado (`createPetDocument` con
`{ kind: 'forbidden' }`); el de cada paso va en las filas de R9.

### R9: cada fallo tiene su mensaje y la pantalla sigue en pie

**WHEN** la subida de R7 falla **THE SYSTEM SHALL** pintar `docs-action-error`
con el literal de esta tabla, mantener `docs-upload-form` abierto con los cuatro
valores que el owner escribió, rehabilitar `docs-upload-submit` y
`docs-upload-cancel` (R8), **no** llamar a ningún paso de R7 posterior al que
falló y **no** volver a pedir la lista:

| Paso | Resultado | Literal `es` |
|---|---|---|
| leer el archivo | `fetch(asset.uri)` rechaza | `No se pudo subir el archivo. Inténtalo de nuevo` |
| leer el archivo | `fetch(asset.uri)` resuelve y `.blob()` rechaza | `No se pudo subir el archivo. Inténtalo de nuevo` |
| crear | `{ kind: 'invalid' }` (400) | `Añade un tipo, un nombre y una fecha con formato AAAA-MM-DD` |
| crear | `{ kind: 'forbidden' }` (403) | `Solo el dueño puede subir documentos` |
| crear | `{ kind: 'unreachable' }` | `No se pudo conectar con el servidor` |
| crear | `{ kind: 'not-found' }` | `Algo salió mal` |
| crear | `{ kind: 'error' }` | `Algo salió mal` |
| crear | `{ kind: 'missing-config' }` | `Algo salió mal` |
| crear | la promesa rechaza | `Algo salió mal` |
| `PUT` | `{ kind: 'error' }` (no 2xx) | `No se pudo subir el archivo. Inténtalo de nuevo` |
| `PUT` | `{ kind: 'unreachable' }` | `No se pudo subir el archivo. Inténtalo de nuevo` |
| confirmar | `{ kind: 'not-uploaded' }` (409) | `No se pudo subir el archivo. Inténtalo de nuevo` |
| confirmar | `{ kind: 'too-large' }` (409) | `El archivo pesa más de 10 MB` |
| confirmar | `{ kind: 'forbidden' }` (403) | `Solo el dueño puede subir documentos` |
| confirmar | `{ kind: 'unreachable' }` | `No se pudo conectar con el servidor` |
| confirmar | `{ kind: 'not-found' }` | `Algo salió mal` |
| confirmar | `{ kind: 'error' }` | `Algo salió mal` |
| confirmar | `{ kind: 'missing-config' }` | `Algo salió mal` |
| confirmar | la promesa rechaza | `Algo salió mal` |

Son diecinueve filas y cada una es un candado que comprueba las cinco
consecuencias de arriba.

**IF** `createPetDocument` o `confirmPetDocumentUpload` devuelve
`{ kind: 'unauthorized' }`, **THEN THE SYSTEM SHALL** llamar a `signOut()` y no
pintar `docs-action-error`. Son dos candados, uno por paso. Las dos ramas pasan
por **una sola** llamada `signOut(` en el fichero.

**WHEN** empieza un nuevo intento (pulsar `docs-upload-submit`) **THE SYSTEM
SHALL** quitar el `docs-action-error` anterior al pulsar, antes de leer el
archivo. Son dos candados, uno por origen del error anterior (un fallo de R9 y
la validación de R6), los dos con la lectura del archivo pendiente.

### R10: cualquier miembro abre un documento

**WHEN** cualquier miembro (owner, family, walker o vet) pulsa la fila
`doc-<id>` **THE SYSTEM SHALL** llamar una vez a
`WebBrowser.openBrowserAsync(document.downloadUrl)`. La fila es la `Card`
compartida con `onPress`, así que expone `accessibilityRole="button"`.

Son cuatro candados, uno por rol.

**IF** `openBrowserAsync` rechaza, **THEN THE SYSTEM SHALL** pintar
`docs-action-error` con `Algo salió mal` y seguir mostrando la lista, para
cualquiera de los cuatro roles. El error va antes de las filas: los hijos son
`['View', 'docs-upload', 'docs-action-error', 'doc-<id>', …]` para el owner y
`['View', 'docs-action-error', 'doc-<id>', …]` para family, walker y vet. Son
cuatro candados, uno por rol.

**WHEN** un miembro pulsa una fila `doc-<id>` con un `docs-action-error` pintado,
**THE SYSTEM SHALL** quitarlo antes de llamar a `openBrowserAsync`. Lleva un
candado, con `family`.

### R11: el formulario se aparta del teclado en Android

**THE SYSTEM SHALL** envolver el `ScrollView` `testID="screen-docs"` en un
`KeyboardAvoidingView` `testID="docs-keyboard-avoider"`, `className="flex-1"`,
`behavior="padding"`, `keyboardVerticalOffset={headerHeight}` (con
`headerHeight = useContext(HeaderHeightContext)` de `expo-router/react-navigation`),
y dar al `ScrollView` `keyboardShouldPersistTaps="handled"`. `screen-docs`
conserva su `contentContainerStyle` actual.

**WHEN** en Android llega `keyboardDidShow` con el teclado en `screenY: 500`
sobre un layout de alto 700 y con una cabecera de 91 (`HeaderHeightContext`),
**THE SYSTEM SHALL** dar a `docs-keyboard-avoider` `paddingBottom: 291`, que es
`700 - (500 - 91)`. Son el mismo evento y las mismas medidas que #148 R7 en
weight-log. Sin cabecera el resultado sería 200 y `keyboardVerticalOffset`
quedaría sin candado.

### R12: la copy y los inventarios globales quedan registrados

**THE SYSTEM SHALL** mantener en verde, con estos valores, los candados
globales que esta feature mueve:

| Candado | Base | Nuevo |
|---|---|---|
| `src/__tests__/ui-copy-table.ts`, filas de `src/screens/docs/index.tsx` en `R7_PROFILE` | 37 filas en `R7_PROFILE` | 53 (+16, detalle en [[design]] §Ocurrencias) |
| `src/__tests__/ui-language.test.ts`, longitud de `R7_PROFILE` | `35 - 1 + 2 + 1` | `35 - 1 + 2 + 1 + 16` y el título del `it` dice `53` |
| `src/__tests__/ui-language.test.ts`, `SCREEN_FILES` | 29 | 29 (sin cambio) |
| `src/__tests__/consistency-classnames.test.ts`, `rounded-xl bg-accent` (los **dos** sitios donde se cuenta) | 17 | 19 |
| `src/__tests__/design-drift.test.ts`, `screenSignOutCalls` de `screens/docs/index.tsx` | 0 | 1 |
| `consistency-classnames`, `style={CONTINUOUS_CORNER}` directo en docs | 1 | 1 (sin cambio) |
| `consistency-classnames`, `bg-accent-soft` en docs | ninguno | ninguno |
| `legibility-classnames`, `text-accent` suelto | ninguno | ninguno |
| `design-drift`, `StyleSheet`, hex y clases `[…]` en `screens/docs/index.tsx` y `api/media.ts` | ninguno | ninguno |

Cada clave nueva aparece en `src/screens/docs/index.tsx` exactamente las veces
que dice [[design]] §Ocurrencias, como `t('<clave>'`.

### R13: prueba de humo en dev build de Android (gate humano propio)

**WHEN** el reviewer ha aprobado, **THE SYSTEM SHALL** pasar la prueba de humo de
§Prueba de humo en un **dev build de Android** con un PDF real y una imagen
real contra LocalStack. La firma el humano en su casilla propia; la casilla de
§Aprobación no la cubre.

*(Enmienda E1: el veredicto que cuenta es el de la ronda de R14, y el paso 6
incluye la comprobación del `ContentType` guardado.)*

### R14: la subida lleva el tipo declarado aunque el archivo no lo traiga (Enmienda E1)

**WHEN** `uploadPhotoToUrl(uploadUrl, body, contentType, fetchFn)`
(`mobile-pet-tracker/src/api/media.ts`) hace el `PUT`, **THE SYSTEM SHALL**
pasar a `fetchFn` como `body` un `Blob` que:

1. es `instanceof Blob`;
2. tiene `type` exactamente igual a `contentType`, sea cual sea el `type` del
   `body` recibido: `''`, un tipo que la app no admite (`'text/plain'`) o un
   tipo admitido distinto de `contentType` (un blob `image/png` subido como
   `image/jpeg`);
3. tiene los mismos bytes que el `body` recibido.

Que sea el mismo objeto o uno nuevo no es requisito: lo que se pide es el
tipo y los bytes que salen en el cable.

La cabecera sigue siendo `headers: { 'Content-Type': contentType }` y sigue
sin `Authorization` (R2.5). Vale para los cuatro `contentType` que la firma
admite (`PhotoContentType | DocumentContentType`): `image/jpeg`, `image/png`,
`image/webp` y `application/pdf`.

**Por qué** (diagnóstico en `progress/explore_mobile-docs-upload-e1.md`): en
nativo, Expo SDK 57 instala `expo/fetch` como `fetch` global, y con un `Blob`
como cuerpo pisa la cabecera `Content-Type` del llamante con `body.type`. El
blob que lee la pantalla Docs desde un `file://` llega con `type === ''`, el
`PUT` sale con `Content-Type` vacío y S3/LocalStack guarda
`binary/octet-stream`. Al abrirlo (R10), Chrome no sabe mostrarlo.

**Arreglo prescrito, sin alternativas**: en `uploadPhotoToUrl`, y solo ahí,
la línea `body,` del objeto que se pasa a `fetchFn` pasa a ser
`body: new Blob([body], { type: contentType }),`. El resto de `media.ts` no
cambia. Los tres llamantes (`src/screens/docs/index.tsx`,
`src/screens/add-pet/index.tsx`, `src/screens/profile/index.tsx`) y sus tests
no se tocan: el arreglo en la función compartida cubre los tres.

Anclas, en `mobile-pet-tracker/`:

| Ancla | Comando | Base `791a6f97` | Tras el verde de R14 |
|---|---|---|---|
| A1 | `grep -cxF '      body,' src/api/media.ts` | `1` | `0` |
| A2 | `grep -cF 'body: new Blob([body], { type: contentType }),' src/api/media.ts` | `0` | `1` |
| A3 | `grep -cF 'export async function uploadPhotoToUrl' src/api/media.ts` | `1` | `1` |
| A4 | `grep -cF '#158 R14' src/api/__tests__/media.test.ts` | `0` | `1` |
| A5 | `grep -cF "method: 'PUT', headers: { 'Content-Type': 'application/pdf' }, body," src/api/__tests__/media.test.ts` | `1` | `0` |
| A6 | `grep -cF "method: 'PUT', headers: { 'Content-Type': 'application/pdf' }, body: expect.any(Blob)," src/api/__tests__/media.test.ts` | `0` | `1` |

**Candado** (en `src/api/__tests__/media.test.ts`, al final del fichero, tras
el `describe` de `#158 R2`): el producto cartesiano `contentType` × tipo del
blob de entrada, en un solo `it.each` de 12 filas dentro de un solo `describe`,
para que el ancla A4 siga en `1`.

- `contentType`: los cuatro valores distintos de `PhotoContentType | DocumentContentType`.
  `image/jpeg` e `image/png` están en los dos tipos y no se repiten.
- Tipo del blob de entrada, tres por `contentType`:
  - `''`, el caso de la pantalla Docs;
  - `'text/plain'`, un tipo que no es ninguno de los `contentType`;
  - un tipo admitido y distinto del declarado: `image/png` para `image/jpeg`,
    `image/webp` y `application/pdf`, e `image/jpeg` para `image/png`.
  El blob se construye siempre con `new Blob([content], { type: inputType })`;
  con `inputType === ''` queda con `type === ''`, igual que un blob sin opciones.
- `content`, la tercera columna: un literal propio por fila, de `'bytes 01'` a
  `'bytes 12'`, que no coincide con ningún `contentType`. Es el contenido del
  blob de entrada, y el paso 6 lo compara con él.

Tabla y título, literales. El orden de cada fila es `[contentType, tipo de
entrada, contenido]`. El `as const` hace falta para que `tsc` acepte la primera
columna como `contentType`. El título solo usa las dos primeras columnas:

```ts
describe('#158 R14: uploadPhotoToUrl sube un Blob con el tipo declarado (Enmienda E1)', () => {
  it.each([
    ['image/jpeg', '', 'bytes 01'],
    ['image/jpeg', 'text/plain', 'bytes 02'],
    ['image/jpeg', 'image/png', 'bytes 03'],
    ['image/png', '', 'bytes 04'],
    ['image/png', 'text/plain', 'bytes 05'],
    ['image/png', 'image/jpeg', 'bytes 06'],
    ['image/webp', '', 'bytes 07'],
    ['image/webp', 'text/plain', 'bytes 08'],
    ['image/webp', 'image/png', 'bytes 09'],
    ['application/pdf', '', 'bytes 10'],
    ['application/pdf', 'text/plain', 'bytes 11'],
    ['application/pdf', 'image/png', 'bytes 12'],
  ] as const)(
    'envía %s con un blob de entrada de tipo «%s»',
    async (contentType, inputType, content) => {
      // pasos 1-7
    },
  );
});
```

Nombres completos de los doce `it` (prefijo
`#158 R14: uploadPhotoToUrl sube un Blob con el tipo declarado (Enmienda E1) › `):

- `envía image/jpeg con un blob de entrada de tipo «»`
- `envía image/jpeg con un blob de entrada de tipo «text/plain»`
- `envía image/jpeg con un blob de entrada de tipo «image/png»`
- `envía image/png con un blob de entrada de tipo «»`
- `envía image/png con un blob de entrada de tipo «text/plain»`
- `envía image/png con un blob de entrada de tipo «image/jpeg»`
- `envía image/webp con un blob de entrada de tipo «»`
- `envía image/webp con un blob de entrada de tipo «text/plain»`
- `envía image/webp con un blob de entrada de tipo «image/png»`
- `envía application/pdf con un blob de entrada de tipo «»`
- `envía application/pdf con un blob de entrada de tipo «text/plain»`
- `envía application/pdf con un blob de entrada de tipo «image/png»`

Cada fila, en este orden:

1. `const fetchFn = jest.fn().mockResolvedValue(response(200, undefined));`,
   con el helper `response` que ya existe en el fichero y sin cast, como el
   `it` de R2 `uploadPhotoToUrl manda application/pdf sin Authorization`;
2. `await expect(uploadPhotoToUrl('http://upload.test/typed', new Blob([content], { type: inputType }), contentType, fetchFn)).resolves.toEqual({ kind: 'ok' });`
3. `const init = fetchFn.mock.calls[0][1];`
4. `expect(init.body).toBeInstanceOf(Blob);`
5. `expect(init.body.type).toBe(contentType);`
6. `await expect(init.body.text()).resolves.toBe(content);`
7. `expect(init.headers).toStrictEqual({ 'Content-Type': contentType });`. Va
   con `toStrictEqual` y no con `toEqual`, que ignora las claves con valor
   `undefined` y dejaría pasar `Authorization: undefined`.

No hay `it` de identidad (`not.toBe(input)`): la identidad no es requisito.

**El `it` de R2 que se mueve** (medido, no supuesto): con el arreglo, el `it`
`#158 R2: API de subida de documentos › uploadPhotoToUrl manda application/pdf sin Authorization`
se pone rojo. Su blob de entrada es `new Blob(['PDF bytes'])`, sin tipo, y en
jest `toHaveBeenCalledWith` compara el `Blob` de Node también por su
propiedad `Symbol(kType)`: espera `''` y recibe `'application/pdf'`. En ese
`it`, y solo en él, el `body,` del objeto esperado pasa a
`body: expect.any(Blob),` (anclas A5 y A6). El tipo y los bytes del cuerpo
los fija ya R14. El `it` de `R7: media photo upload API` `PUTs the raw body
with Content-Type and without Authorization` sigue verde sin cambios, porque
su blob ya trae `type: 'image/png'` y el mismo tamaño. No se toca.

**Mutaciones** (medidas sobre una copia fuera del árbol, base `791a6f97` con
E1 aplicada; el fichero tiene 81 `it`). Las filas de R14 se agrupan por tipo de
entrada: cuatro de `«»`, cuatro de `«text/plain»` y cuatro de tipo admitido
(`«image/png»` o `«image/jpeg»`). La mutación cambia la línea `body` de
`uploadPhotoToUrl`, salvo H5, que cambia `headers`:

| Id | Mutación | Resultado | Dónde falla |
|---|---|---|---|
| T1 | `body,` (sin envolver, la base) | 12 rojos: las doce filas de R14 | paso 5, con `Received: ""` en las de `«»`, `Received: "text/plain"` en las de `«text/plain»` y el tipo de entrada (`"image/png"` o `"image/jpeg"`) en las de tipo admitido. El paso 4 pasa, porque el blob de entrada ya es un `Blob` |
| T2 | `body: new Blob([body]),` (sin `type`) | 13 rojos: las doce de R14 y el `it` de R7 | R14 en el paso 5 (`Received: ""`); R7 en su `toHaveBeenCalledWith` |
| T3 | `body: new Blob([], { type: contentType }),` (sin bytes) | 13 rojos: las doce de R14 y el `it` de R7 | R14 en el paso 6 (`Received: ""`); R7 en su `toHaveBeenCalledWith` |
| T4 | `body: new Blob(['x'], { type: contentType }),` (bytes fijos) | 13 rojos: las doce de R14 y el `it` de R7 | R14 en el paso 6 (`Received: "x"`); R7 en su `toHaveBeenCalledWith` |
| T5 | `body: body.type === '' ? new Blob([body], { type: contentType }) : body,` | 8 rojos: las de `«text/plain»` y las de tipo admitido | paso 5, con el tipo de entrada como `Received` |
| T6 | `body: new Blob([body], { type: body.type \|\| contentType }),` | 8 rojos: las de `«text/plain»` y las de tipo admitido | paso 5, con el tipo de entrada como `Received` |
| T7 | `body: body.type === contentType ? body : new Blob([body], { type: contentType }),` | 81/81 verdes: **mutación equivalente aceptada** | no falla. Solo reutiliza el objeto cuando ya trae `type === contentType`, y entonces `expo/fetch` manda esa misma cabecera y los mismos bytes. En el cable no se distingue del arreglo, y R14 no pide un objeto nuevo |
| S1 | `body: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(body.type) ? body : new Blob([body], { type: contentType }),` | 4 rojos: las de tipo admitido | paso 5, con `Received: "image/png"` (3) o `"image/jpeg"` (1) |
| S2 | `body: new Blob([body], { type: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(body.type) ? body.type : contentType }),` | 4 rojos: las de tipo admitido | paso 5, igual que S1 |
| S3 | `body: body.type.startsWith('image/') ? body : new Blob([body], { type: contentType }),` | 4 rojos: las de tipo admitido | paso 5, igual que S1 |
| S11 | `body: body.type.startsWith('text/') \|\| body.type === '' ? new Blob([body], { type: contentType }) : body,` | 4 rojos: las de tipo admitido | paso 5, igual que S1 |
| S7 | `body: new Blob([contentType], { type: contentType }),` (bytes = el tipo) | 13 rojos: las doce de R14 y el `it` de R7 | R14 en el paso 6, con el `contentType` como `Received`; R7 en su `toHaveBeenCalledWith` |
| H5 | `headers: { 'Content-Type': contentType, Authorization: undefined },` | 13 rojos: las doce de R14 y el `it` de R2 `uploadPhotoToUrl manda application/pdf sin Authorization` | R14 en el paso 7 (`toStrictEqual`); R2 en su aserción de cabeceras |

**Alcance del candado**: jest corre con el `Blob` de Node. El `Blob` de React
Native que la app usa en el teléfono (`react-native/Libraries/Blob/Blob.js`,
`BlobManager.createFromParts`, que acepta partes `Blob` y toma
`options.type`) solo lo cubre la prueba de humo: R13, paso 6, con la
comprobación de E1.

Límites aceptados, sin candado propio:

- **N6.** Envolver solo si `body.size > 0` deja un cuerpo de 0 bytes con `type ''`. Ninguna fila lo prueba: la cláusula 2 no habla de tamaño y la mutación es rebuscada.
- **N7.** El `Blob` de Node pasa `type` a minúsculas y el de React Native (`BlobManager.js`) lo copia tal cual, así que `type: contentType.toUpperCase()` pasa en jest. Lo cubre el paso 6 del smoke, que exige el literal exacto.
- **N8.** Un `File` en vez de un `Blob` cumple la cláusula 1. No hace falta fila: el `toHaveBeenCalledWith` de R7 ya lo rechaza.

## Criterios no funcionales (los comprueba el reviewer y no tienen R-id)

- `bunx expo install expo-document-picker` en `mobile-pet-tracker/`, sin escribir el rango a mano. Es un módulo nativo: el dev build hay que **reconstruirlo** (`bunx expo run:android`) antes del humo. Si `expo install` añade `expo-document-picker` a `plugins` de la configuración de la app, se deja tal cual, sin opciones de iCloud.
- `expo-web-browser` ya está instalado: no se toca su versión.
- grep-clean de la carta (`docs/ui-guidelines.md` §Decisiones fijas): sin hex fuera de `src/theme`, sin clases arbitrarias `[…]`, sin `StyleSheet.create`, radios solo `rounded-card`, `rounded-xl` y `rounded-full`. La pantalla sigue en el layout de pantalla empujada (excepción A11): `padding: 24`, `gap: 16`, `paddingBottom: insets.bottom + 24`.
- La ruta `src/app/pets/[petId]/docs.tsx` no cambia. No hay ruta nueva ni cambios en `src/app/_layout.tsx`.

## Enmienda E1 (smoke R13, paso 6, 2026-10-11)

En el smoke R13 (paso 6), el humano relató que el documento se sube, la fila
aparece y, al pulsarla, Chrome en el teléfono no sabe mostrarlo porque el
objeto no tiene tipo. El leader verificó la causa y la dejó escrita en
`progress/explore_mobile-docs-upload-e1.md`, en `791a6f97`. El `reviewer` había
aprobado ese HEAD: R1–R12 siguen valiendo y **no cambian**, salvo la nota de
R2.5. E1 añade R14 y toca solo dos ficheros de la app, los dos ya en la lista
cerrada ([[design]] §Ficheros afectados): `src/api/media.ts` (una línea) y
`src/api/__tests__/media.test.ts` (un `describe` nuevo y una línea del `it` de
R2).

| Id | Requisito | Cambio | Validación |
|---|---|---|---|
| E1 | R14 (requisito nuevo), R2.5, R13 | el `PUT` lleva un `Blob` con `type === contentType`; un `it` de R2 deja de exigir que el cuerpo sea el mismo blob; el smoke vuelve a subir y comprueba el `ContentType` guardado | copia fuera del árbol: 12 rojos en la base, 81/81 verdes con el arreglo, `tsc --noEmit` y `eslint --no-cache` en verde; de las trece mutaciones de R14, doce en rojo y una equivalente aceptada (T7) |

Consecuencias:

- `src/api/__tests__/media.test.ts` pasa de 69 a 81 `it` (12 filas de R14).
- Los candados globales no se mueven: `design-drift`, `consistency-classnames`,
  `ui-language`, `legibility-classnames` y `language-provider` dan 199/199 en
  la base y con E1 aplicada. No existe ningún inventario de `it` o `expect` de
  `media.test.ts` fuera de [[tasks]] y [[traceability]].
- Los tests de las tres pantallas no se mueven: mockean `../../api/media`
  entero. Con E1 aplicada dan 173/173.
- Ninguna dependencia nueva, ninguna clase, ninguna copy. `bunx expo install`
  no se corre y el dev build **no** hace falta reconstruirlo: el cambio es JS y
  llega por Metro (`bunx expo start -c`).
- El verde de R14 se commitea como `fix(...)`, no como `feat(...)`: corrige un
  comportamiento que R2.5 daba por bueno.

Los textos normativos están en R2.5, R14, §Fuera de alcance de E1 y
§Prueba de humo, marcados «Enmienda E1».

## Fuera de alcance

Cada viñeta está clasificada: **(F)** podría ser una feature futura, **(D)** solo
delimita esta.

- **(F)** Borrar o editar un documento. El backend no tiene ese endpoint.
- **(F)** Limpiar los documentos pendientes que deja un intento fallido. Es del backend (DA5).
- **(F)** Visor de PDF dentro de la app. Aquí se abre en el navegador del sistema (DA4).
- **(F)** Selector de tipos predefinidos. El tipo es texto libre, como en el backend (DA3).
- **(D)** HEIC, WebP, documentos de Office y cualquier tipo que no sea PDF, JPEG o PNG (DA2).
- **(D)** Hacer una foto con la cámara para subirla. Solo se elige un archivo existente.
- **(D)** Subir varios archivos a la vez (`multiple: false`).
- **(D)** Barra o porcentaje de progreso de la subida (DA6).
- **(D)** Que la consulta de la mascota se refresque desde otra pantalla mientras Docs está montada y pase a otro `kind` que no sea `ok`. R3 quitaría las entradas, pero un `docs-action-error` ya pintado seguiría, en un orden de hijos que esta spec no fija. Sin candado ([[design]] §Coexistencia de `docs-action-error` y `docs-error`).
- **(D)** Renovar una `downloadUrl` caducada (3600 s) sin salir de la pantalla. Al volver a entrar, la lista se pide de nuevo y trae URLs nuevas.
- **(D)** Zona horaria del perfil para la fecha por defecto. Se usa la del dispositivo (DA7).
- **(D)** Prueba de humo en iOS.
- **(D)** Cualquier cambio en `backend-pet-tracker/`.

### Fuera de alcance de E1

- **(D)** Reparar los objetos que ya se subieron con `binary/octet-stream`.
  No se migran ni se reescriben: en el smoke se vuelve a subir (§Prueba de
  humo, precondición 8).
- **(D)** El backend. Guarda y devuelve lo que llega en el `PUT`: el leader
  lo midió contra LocalStack 4.14 con una URL prefirmada como la de
  `PhotoStorageS3Adapter.createUploadUrl` (sin `ContentType` en la firma).
  Con `Content-Type: application/pdf`, `HEAD` y `GET` devuelven
  `application/pdf`; con `Content-Type` vacío, `binary/octet-stream`.
- **(F)** El feedback pressed de `Card` (observación 1 de
  `progress/review_mobile-docs-upload.md`). Es transversal y va como
  seguimiento aparte.
- **(F)** Las clases del formulario (observación 2 de esa review). Va como
  seguimiento aparte.
- **(D)** Cambiar de implementación de `fetch` (`EXPO_PUBLIC_USE_RN_FETCH=1`),
  tocar los tres llamantes o leer el archivo a un `ArrayBuffer`
  ([[design]] D8).

## Decisiones abiertas que el humano debe revisar en el gate

El detalle y las alternativas descartadas están en [[design]] §Decisiones.

- **DA1** — Copy nueva de `docs.emptyBody` (§Copy nueva). Es neutra de rol; la alternativa es una frase para el owner y otra para los demás roles (+1 clave).
- **DA2** — Tipos permitidos: solo PDF, JPEG y PNG. El backend acepta cualquiera.
- **DA3** — El tipo es texto libre (1-40), sin lista cerrada.
- **DA4** — Abrir con `expo-web-browser` (Custom Tab dentro de la app) y no con `Linking.openURL`. En Android, un PDF en Custom Tab suele **descargarse** y abrirse con el visor del sistema en vez de verse en la pestaña; una imagen se ve en la pestaña.
- **DA5** — Cada intento fallido después de crear deja un documento pendiente en base de datos, sin limpieza. Es backend y queda para la sesión de #162 o una feature propia.
- **DA6** — Sin indicador de progreso: solo los botones bloqueados de R8.
- **DA7** — La fecha por defecto es la fecha civil del dispositivo, no la de la zona horaria del perfil (weight-log sí usa la del perfil).
- **DA8** — ¿Mantener «de tu mascota» en `docs.emptyBody` (precedente aprobado en #155 y en `geofences.emptyBody`) o pasar a `{{petName}}`, como pide `docs/ui-guidelines.md` en su punto 7? La spec está escrita con la primera opción.
  - **Mantener «de tu mascota»** (lo escrito): no mueve nada. Sigue el precedente, pero no cumple el punto 7 de la carta al pie de la letra.
  - **Pasar a `{{petName}}`**: la frase sería `Cuando se suba un documento médico de {{petName}}, te lo guardo aquí.` y `When a medical document for {{petName}} is uploaded, I'll keep it here.` La interpolación ya existe en el catálogo (`pairing.readySubtitle`) y la pantalla ya calcula `petName`, que es `null` mientras la mascota no resuelve `ok`. Ese hueco obliga a elegir una de dos:
    - una frase de reserva sin nombre, que es una clave más (`docs.emptyBodyNoName`). language-provider pasa de 383 a 384, hay una fila más en el registro §2.22 y `R7_PROFILE` pasa de 53 a 54 (expresión `+ 17`, título `54`);
    - no pintar `docs-empty-body` hasta tener nombre. No hay clave nueva, pero cambian los hijos de `docs-empty` de R4 y de los tests de #155 R7 mientras la mascota está pendiente, y hace falta un candado más para ese estado.

    Con cualquiera de las dos cambian el literal `es` de R1, el de `copyRows` de `empty-state.test.tsx` y el del `it` de #155 R7. `copyRows` compara la cadena cruda del catálogo, así que espera el marcador `{{petName}}` tal cual. El `it` de #155 R7 renderiza la pantalla, así que espera el nombre de la fixture. También cambia el paso 2 de §Prueba de humo. `checkUses` sigue contando un `t('docs.emptyBody'`.

## Aprobación

> Tres casillas, tres gates (lección `gate-humano-sin-casilla-donde-firmar`).
> La de la spec autorizó la implementación de R1–R13; la de la Enmienda E1
> autoriza la ronda de Codex de R14; la del smoke R13, en §Prueba de humo,
> cierra la feature.

### Aprobación de la spec

- [x] Aprobado por humano (fecha: 2026-10-09) ← gate obligatorio antes de implementar

### Enmienda E1 — el `PUT` lleva el tipo declarado (R14)

- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-10) ← gate obligatorio antes de la ronda de Codex de R14. Solo cubre E1: R14, la nota de R2.5, §Fuera de alcance de E1 y los cambios de §Prueba de humo marcados «Enmienda E1»

## Prueba de humo (gate humano propio, después del veredicto del reviewer)

**Dónde**: en el teléfono del humano, con un **dev build de Android**, nunca con
Expo Go. El teléfono debe llegar a las URLs prefirmadas de PUT y de GET, así que
LocalStack tiene que firmar con la IP LAN (#57).

**Precondiciones de entorno**. Si falta alguna, la prueba no vale:

1. En el `.env` raíz:
   - `AWS_MODE=local`, `AWS_ACCESS_KEY_ID=test` y `AWS_SECRET_ACCESS_KEY=test`, los valores de `.env.example`;
   - `AWS_PRESIGN_ENDPOINT_URL=http://<IP LAN>:4566`, con la IP real de la máquina de desarrollo. En `.env.example` esa línea viene **comentada** (`# AWS_PRESIGN_ENDPOINT_URL=http://192.168.x.x:4566`): hay que descomentarla y poner la IP.

   Después, en este orden:
   ```bash
   docker compose up -d localstack
   pnpm -C backend-pet-tracker run provision:local
   pnpm -C backend-pet-tracker run start:dev
   ```
   LocalStack community no persiste, así que el bucket de media no existe hasta que se corre `provision:local` **cada vez** que se levanta LocalStack. Es el comando que `docs/demo-runbook.md` describe con «es idempotente (crea colas, tabla DynamoDB, bucket y bus en LocalStack)». El backend se reinicia para que lea el `.env`.
2. En `mobile-pet-tracker/.env`, `EXPO_PUBLIC_API_URL=http://<IP LAN>:3000/v1`.
3. El firewall de la máquina permite entrada TCP a los puertos 3000 y 4566 (`docker-compose.yml` publica `4566:4566`). Además, la propia máquina tiene que alcanzar su IP LAN en el 4566: en modo local el backend usa `AWS_PRESIGN_ENDPOINT_URL` también como endpoint de su cliente S3, y el `HeadObject` del confirm sale hacia esa IP. Compruébalo desde la máquina de desarrollo:
   ```bash
   curl -s -o /dev/null -w '%{http_code}' http://<IP LAN>:4566/_localstack/health
   ```
   Debe imprimir `200` (en Windows, `curl.exe` con las mismas opciones).
4. El dev build se **reconstruye** después de instalar `expo-document-picker`:
   ```bash
   cd mobile-pet-tracker
   bunx expo run:android
   bunx expo start -c
   ```
   Un dev build anterior a esta feature no tiene el módulo nativo y el selector falla.
   `google-services.json` es **por máquina**: la que compila el dev build y sirve
   Metro tiene que tenerlo, como en #79, #100 y #114.
5. La cuenta owner `<email-owner>` tiene la mascota `<nombre-mascota>`. Una segunda cuenta, `<email-no-owner>`, tiene el rol `<family | walker | vet>` sobre esa misma mascota.
6. En el teléfono hay un PDF real de menos de 10 MB (`<archivo.pdf>`), una imagen JPEG o PNG real (`<imagen.jpg|png>`) y un archivo de más de 10 MB (`<archivo-grande>`).
7. `adb devices -l` puede listar el teléfono dos veces (por IP y por mDNS). Todos los comandos usan `adb -s <ip:puerto>`.
8. **(Enmienda E1)** Los documentos subidos antes de E1 quedaron en S3 con `binary/octet-stream` y no sirven para el paso 6. Hay que volver a subir el PDF y la imagen en los pasos 4 y 5, con Metro sirviendo ya el código de E1 (`bunx expo start -c`; E1 es solo JS y no pide reconstruir el dev build). Las filas de antes de E1 que sigan en la lista no cuentan: usa para `<nombre-pdf>` y `<nombre-imagen>` nombres que no estén ya en ella.

**Pasos**. Todos con la cuenta owner, salvo el 8:

1. `adb -s <ip:puerto> logcat -c`.
2. Abre Documentos de `<nombre-mascota>`. Si no tiene documentos, Pingo muestra `Cuando se suba un documento médico de tu mascota, te lo guardo aquí.` y el botón `Subir documento`. Si ya tiene, el botón `Subir documento` sale encima de la lista.
3. Pulsa `Subir documento` y elige `<archivo-grande>`. Sale `El archivo pesa más de 10 MB` y no se abre el formulario.
4. Pulsa `Subir documento` y elige `<archivo.pdf>`. El formulario muestra el nombre del archivo y la fecha de hoy. Escribe Tipo `Vacunación` y Nombre `<nombre-pdf>`, deja Veterinario vacío y pulsa `Subir documento`. Los botones se bloquean y la fila `<nombre-pdf>` aparece en la lista sin recargar a mano.
5. Para el backend (Ctrl+C en la terminal de `start:dev`). Sube `<imagen.jpg|png>` con Tipo `Consulta` y Nombre `<nombre-imagen>` y pulsa `Subir documento`. Sale `No se pudo conectar con el servidor`, el formulario sigue abierto con lo escrito y la pantalla no se rompe. Vuelve a lanzar `pnpm -C backend-pet-tracker run start:dev`, espera a que escuche en el puerto 3000, pulsa otra vez `Subir documento` y la fila `<nombre-imagen>` aparece. No uses el modo avión: corta la Wi-Fi, y con ella la depuración inalámbrica de adb (Android la apaga y le cambia el puerto) y la conexión con Metro.
6. **(Enmienda E1)** Antes de pulsar nada, comprueba desde la máquina de desarrollo el tipo que guardó S3 para los dos documentos de los pasos 4 y 5. Las claves tienen la forma `pets/<petId>/docs/<documentId>`. El primer comando lista solo las claves que contienen `/docs/`, ordenadas por `LastModified`, y se queda con las dos últimas: la penúltima es el PDF del paso 4 y la última, la imagen del paso 5. Cada línea de la salida es `<clave><TAB><LastModified>`. Después lee el tipo guardado de cada una, sustituyendo `<clave>` por la clave copiada de la salida anterior:
   ```bash
   export AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test AWS_DEFAULT_REGION=us-east-1
   aws --endpoint-url http://<IP LAN>:4566 s3api list-objects-v2 --bucket pet-tracker-media-local --prefix pets/ --query "sort_by(Contents[?contains(Key,'/docs/')], &LastModified)[-2:].[Key,LastModified]" --output text
   aws --endpoint-url http://<IP LAN>:4566 s3api head-object --bucket pet-tracker-media-local --key <clave> --query ContentType --output text
   ```
   La salida de `head-object` es una sola línea con el tipo, sin comillas. Para la clave del PDF tiene que ser exactamente `application/pdf`; para la de la imagen, exactamente `image/jpeg` si subiste un JPEG o `image/png` si subiste un PNG. Cualquier otra salida hace fallar el paso aunque el navegador abra algo. Si sale `binary/octet-stream`, es un documento de antes de E1 o Metro no sirvió el código de E1. El paso también falla, y hay que volver a la precondición 8, si `list-objects-v2` devuelve menos de dos líneas, si las dos claves no son las de los pasos 4 y 5, o si termina con `aws: [ERROR]: In function sort_by(), invalid type for value: None, expected one of: ['array'], received: "null"` (`exit=255`): ese error quiere decir que no hay ningún objeto bajo `pets/`.

   Los dos comandos `aws` valen tal cual en bash y en PowerShell. La consulta va entre comillas dobles y no lleva `$` ni comillas invertidas, así que ninguna de las dos shells la toca. Las credenciales `test`/`test` de LocalStack van en variables de entorno y no en el comando. En PowerShell, en lugar del `export`: `$env:AWS_ACCESS_KEY_ID='test'; $env:AWS_SECRET_ACCESS_KEY='test'; $env:AWS_DEFAULT_REGION='us-east-1'`. La consulta JMESPath se validó con `jmespath` 1.0.1 sobre una salida de ejemplo, sin LocalStack: excluye las fotos (`pets/<petId>/photo-<epoch-ms>`) y devuelve las dos claves de `/docs/` más recientes, de la más antigua a la más nueva.

   Después, pulsa la fila `<nombre-imagen>`: se abre en el navegador dentro de la app y se ve la imagen subida. Pulsa la fila `<nombre-pdf>`: se abre la pestaña y el PDF se ve en ella o se descarga y se abre con el visor del sistema (DA4). En los dos casos es el archivo subido.
7. Comprueba que el teléfono no intentó ir al loopback:
   ```bash
   adb -s <ip:puerto> logcat -d | rg 'ConnectException.*(localhost|127\.0\.0\.1):4566'
   ```
   Debe salir sin coincidencias. En Windows: `adb -s <ip:puerto> logcat -d | findstr ConnectException`, y ninguna línea menciona `:4566`.
8. Cierra sesión, entra con `<email-no-owner>` y abre Documentos de `<nombre-mascota>`. Ves las dos filas y no aparece `Subir documento`. Pulsa `<nombre-pdf>` y se abre como en el paso 6.

- [ ] Smoke R13 superado en dev build de Android (fecha: ____)
