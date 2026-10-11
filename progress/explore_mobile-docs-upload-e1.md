# Diagnóstico E1 de #158: el documento subido no lleva tipo (smoke R13, paso 6)

Fecha: 2026-10-11. Autor: leader. Árbol: wt-158, HEAD `791a6f97`.

## Síntoma (relatado por el humano en el smoke R13)

El documento se sube, el confirm pasa y la fila aparece en la lista con el
archivo completo. Al pulsar la fila (paso 6), Chrome en el teléfono no sabe
mostrarlo porque el objeto no tiene tipo.

## Causa

1. Expo SDK 57 sustituye el `fetch` global en nativo por `expo/fetch`:
   `mobile-pet-tracker/node_modules/expo/src/winter/runtime.native.ts`,
   `install('fetch', () => require('./fetch').fetch)`, salvo con
   `EXPO_PUBLIC_USE_RN_FETCH=1`. El análisis del `NetworkingModule` de React
   Native no aplica: esa ruta no se usa.
2. Con un `Blob` como cuerpo, `expo/fetch` **pisa** la cabecera
   `Content-Type` explícita con `body.type`:
   - `node_modules/expo/src/winter/fetch/RequestUtils.ts`, en `normalizeBodyInitAsync`, rama
     `body instanceof Blob || isBlob(body)`: `overriddenHeaders: [['Content-Type', body.type]]`;
   - `overrideHeaders` quita toda cabecera del llamante con la misma clave, sin
     distinguir mayúsculas, y añade la nueva.
3. El blob sale de `await (await fetch(asset.uri)).blob()` en
   `src/screens/docs/index.tsx` (`submitDocument`). En `FetchResponse.blob()`
   el tipo es `this.headers.get('content-type') ?? ''`. Una respuesta de un
   `file://` local no trae `content-type`, así que `blob.type === ''`.
4. `uploadPhotoToUrl` (`src/api/media.ts`) pasa ese blob tal cual con
   `headers: { 'Content-Type': contentType }`. Por el punto 2, el PUT sale
   con `Content-Type` vacío.
5. Con `Content-Type` vacío, S3/LocalStack guarda el tipo por defecto.
   Medido por el leader contra el LocalStack del VPS (`localstack/localstack:4.14`,
   la misma imagen de `docker-compose.yml`), con una URL prefirmada igual que
   `PhotoStorageS3Adapter.createUploadUrl` (sin ContentType en la firma):
   - PUT con `Content-Type: application/pdf`: HEAD y GET devuelven
     `application/pdf`;
   - PUT con `Content-Type: ''`: HEAD y GET devuelven `binary/octet-stream`.
   El backend y LocalStack están bien: guardan y devuelven lo que llega en el PUT.

## Alcance

- `uploadPhotoToUrl` tiene tres llamantes: `src/screens/docs/index.tsx`,
  `src/screens/add-pet/index.tsx` y `src/screens/profile/index.tsx`. Las
  fotos de mascota tienen el mismo defecto, pero no se nota porque `<Image>`
  no mira el `Content-Type`. El arreglo en la función compartida cubre los tres.
- Los objetos ya subidos con `binary/octet-stream` no se reparan: en el
  smoke se vuelve a subir.

## Arreglo propuesto (mínimo, en la función compartida)

En `uploadPhotoToUrl`, el cuerpo pasa a ser un blob con el tipo correcto:
`body: new Blob([body], { type: contentType })`. Así lo que `expo/fetch`
copia a la cabecera coincide con `contentType`. El `Blob` global de la app
es el de React Native (`createBlob.ts`: «remove this when we install
expo-blob as globalThis.Blob»), y su constructor acepta partes `Blob`
(`BlobManager.createFromParts`). En jest, el `Blob` de Node también.

Candado: un it de `src/api/__tests__/media.test.ts` que llama a
`uploadPhotoToUrl` con un blob **sin tipo** (`new Blob(['x'])`) y asevera
que el `body` que recibe `fetchFn` es un `Blob` con `type === contentType`,
una fila por cada `contentType` admitido. La mutación `body` (sin envolver)
lo pone rojo.

## Verificación del spec_author (2026-10-11, HEAD `791a6f97`)

Todo medido en `mobile-pet-tracker/`, sin editar el árbol. El arreglo y los
tests se probaron en una copia fuera del árbol (scratchpad, `node_modules`,
`docs/` y `specs/` enlazados al worktree).

- Anclas del diagnóstico, por `grep -cF`, todas `1`:
  `overriddenHeaders: [['Content-Type', body.type]]` en
  `node_modules/expo/src/winter/fetch/RequestUtils.ts`;
  `install('fetch', () => require('./fetch').fetch)` en
  `node_modules/expo/src/winter/runtime.native.ts`;
  `this.headers.get('content-type') ?? ''` en `FetchResponse.ts`. RN
  `BlobManager.createFromParts` acepta partes `Blob` y toma `options.type`.
- Tipos admitidos en `src/api/media.ts`: `PhotoContentType` =
  `image/jpeg | image/png | image/webp`; `DocumentContentType` =
  `application/pdf | image/jpeg | image/png`. Cuatro valores distintos.
- `grep -cxF '      body,' src/api/media.ts` = `1` (solo `uploadPhotoToUrl`).
- Base: `FORCE_COLOR=0 bunx jest src/api/__tests__/media.test.ts` → 69/69, exit 0.
- En jest el `Blob` global es el de Node (propiedades `Symbol(kHandle)`,
  `Symbol(kLength)`, `Symbol(kType)`; `text()` disponible).
- Solo el arreglo, sin tocar tests: cae 1, el `it` de #158 R2
  `uploadPhotoToUrl manda application/pdf sin Authorization` (su
  `toHaveBeenCalledWith` compara `Symbol(kType)`: `''` contra
  `'application/pdf'`). De ahí la línea `body: expect.any(Blob)` de E1. El `it`
  de `R7: media photo upload API` sigue verde.
- Historial del candado: ronda 1, 4 filas, cerrada por B1; ronda 2, 8 filas,
  cerrada por B2. Las cifras de abajo son solo las de la ronda 3.
- Candado final de R14: un `it.each` de 12 filas, `contentType` × tipo de
  entrada (`''`, `'text/plain'`, un tipo admitido distinto), con contenido
  propio por fila (`'bytes 01'` a `'bytes 12'`) y paso 7 con `toStrictEqual`.
- Rojo (tests de E1 sobre el `media.ts` de la base):
  `Tests: 12 failed, 69 passed, 81 total`, exit 1. Los doce caen en el paso 5.
- Verde (con el arreglo): `Tests: 81 passed, 81 total`, exit 0.
- Mutaciones (T1-T7, S1-S3, S11, S7, H5): tabla y rojos medidos en
  `specs/mobile-docs-upload/requirements.md` R14. Doce en rojo; T7 queda en
  verde y se acepta como equivalente.
- `bunx tsc --noEmit` exit 0 y `bunx eslint --no-cache` sobre los dos ficheros
  exit 0, con E1 aplicada.
- Candados globales (`design-drift`, `consistency-classnames`, `ui-language`,
  `legibility-classnames`, `language-provider`): 199/199 en la base y con E1.
  Suites de docs, add-pet y profile: 173/173 con E1 (mockean `../../api/media`).
  Ningún test referencia `media.test` (grep en `*.test.ts*` = 0). Las dos
  cifras se volvieron a medir con el candado final de 12 filas.
- Smoke: bucket `pet-tracker-media-local` y clave `pets/${petId}/docs/${documentId}`
  (`backend-pet-tracker/src/modules/media/domain/document-key.ts`);
  `AWS_REGION=us-east-1` en `.env.example`.
- Precedente de `status` con enmienda pendiente: `approved` con comentario
  (`specs/mobile-alerts-center/requirements.md`, «enmendada tras #87»); las
  enmiendas de #115 y #146 dejan `approved` y añaden casilla propia en §Aprobación.
- JMESPath del paso 6 del smoke validado con `jmespath` 1.0.1 sobre una salida
  de ejemplo con claves `pets/<petId>/photo-<epoch-ms>` y `pets/<petId>/docs/<id>`,
  sin peticiones a LocalStack.
