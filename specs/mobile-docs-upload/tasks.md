---
feature: "mobile-docs-upload"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-docs-upload]] (#158)

> Disciplina TDD: por cada requisito, (1) un commit de test en rojo, (2) un
> commit de implementación mínima en verde y (3) refactor con los tests en
> verde. **Nunca** un commit con test e implementación juntos (C4 de
> `CHECKPOINTS.md`). Todos los comandos se lanzan desde `mobile-pet-tracker/`.
>
> Cada `describe` nuevo empieza por `#158 R<n>:` para que `-t '#158 R<n>'` lo
> filtre. Ninguna ruta de esta feature lleva paréntesis, así que no hay nada que
> escapar en los paths de jest.

## Recuentos

`it` nuevos por requisito. Una fila de `it.each` cuenta como un test.

| Req | Fichero | `it` nuevos | Desglose |
|---|---|---|---|
| R1 | `language-provider.test.tsx` | 1 | 1 `it` |
| R2 | `media.test.ts` | 54 | `downloadUrl` 3 + resolver 24 + constante 1 + create (11 filas + 1 de petición) 12 + confirm (12 filas + 1 de petición) 13 + `PUT` con PDF 1 |
| R3 | `docs/index.test.tsx` | 21 | con documentos 1 + vacío 1 + entradas 2 + lista no ok 7 + mascota no ok 10 |
| R4 | `docs/index.test.tsx` | 6 | 3 roles × 2 listas |
| R5 | `docs/index.test.tsx` | 16 | selector 7 + orden con error 2 + volver a pulsar 2 + formulario abierto 2 + props 1 + cancelar 2 |
| R6 | `docs/index.test.tsx` | 5 | ramas 3 + orden y cancelar con error 2 |
| R7 | `docs/index.test.tsx` | 3 | PDF 1 + PNG 1 + `refetch` no ok 1 |
| R8 | `docs/index.test.tsx` | 7 | etapas 6 + rehabilitar 1 |
| R9 | `docs/index.test.tsx` | 23 | filas 19 + `unauthorized` 2 + nuevo intento 2 |
| R10 | `docs/index.test.tsx` | 9 | abrir 4 + rechazo 4 + limpiar al pulsar 1 |
| R11 | `docs/index.test.tsx` | 2 | `paddingBottom` 1 + `keyboardShouldPersistTaps` 1 |
| R12 | — | 0 | cambia expresiones y títulos, no añade `it` |

Totales tras el commit rojo de cada requisito. La base está medida en [[design]] §Base medida, «Otros hechos medidos».

| Commit | `docs/index.test.tsx` | `media.test.ts` | `language-provider.test.tsx` | Rojos esperados en ese commit |
|---|---|---|---|---|
| base `65f37841` | 16 | 15 | 24 | — |
| R1 rojo | 16 | 15 | 25 | el `it` nuevo, el recuento 383, las filas de `copyRows` de `docs.emptyBody` y `pinta la pose…` |
| R2 rojo | 16 | 69 | 25 | los 54 nuevos, salvo las filas que ya pasen por casualidad (ninguna prevista) |
| R3 rojo | 37 | 69 | 25 | 4: con documentos, vacío y las 2 entradas. Las 17 filas de lista y mascota no ok son SHALL NOT y salen verdes de entrada. Además, `consistency-classnames` (17 ≠ 18) |
| R4 rojo | 43 | 69 | 25 | 0: las 6 filas salen verdes de entrada si R3 solo mira `owner`. Se commitea igual como candado y se dice en el informe |
| R5 rojo | 59 | 69 | 25 | 15: todas menos la fila `canceled`, que puede salir verde. Además, `consistency-classnames` (18 ≠ 19) |
| R6 rojo | 64 | 69 | 25 | 5 |
| R7 rojo | 67 | 69 | 25 | 3 |
| R8 rojo | 74 | 69 | 25 | 6: las etapas. `rehabilitar` puede salir verde porque los botones aún no se bloquean |
| R9 rojo | 97 | 69 | 25 | 22 o 23: la fila «Error de R6» del nuevo intento puede salir verde si el verde de R6 ya fija el error con el resultado de validar (R6 no lo exige ni lo prohíbe). Además, `design-drift` (`screenSignOutCalls` 0 ≠ 1) |
| R10 rojo | 106 | 69 | 25 | 9 |
| R11 rojo | 108 | 69 | 25 | 2 |
| R12 rojo | 108 | 69 | 25 | `ui-language` (37 ≠ 53) |

## Reglas comunes de los tests de pantalla (`src/screens/docs/index.test.tsx`)

- Montaje: siempre `await renderDocs()`, el helper que ya existe (`renderWithProviders` + `HeroUINativeProvider` + `LanguageProvider initial="es"`). Desde R11 envuelve también `HeaderHeightContext.Provider`. Los literales esperados son los `es` de [[requirements]].
- Esperas: `await waitFor(...)` o `findBy*` **sobre el texto final ya pintado** (el literal `es` entero, o el nombre de la fila nueva), nunca sobre el contador de llamadas de un mock. Hay dos excepciones, escritas en su requisito: las 6 etapas de R8, porque una etapa pendiente no pinta texto, y las filas de la mascota no `ok` de R3, que esperan el estado de la consulta.
- Timers: el fichero no usa timers falsos (ancla B47). El único `it` que los usa es el de props de R5, y los restaura en `afterEach`.
- Clases: se aseveran sobre `props.className` del nodo host, una a una con `expect.stringContaining`, porque HeroUI añade clases suyas. HeroUI no pasa `variant` al host: lo convierte en la clase `button__root--variant-<v>` del botón y `button__label--variant-<v>` de su etiqueta (ancla B48). La etiqueta se busca con `within(<botón>).getByText(<texto>)`.
- Dobles, prescritos por intención. Compruébalos contra el fichero antes de escribirlos (ancla B13):
  - `../../api/media`: hoy el factory solo trae `listPetDocs: jest.fn()`. Pasa a conservar **reales** las funciones puras del módulo (`resolveDocumentContentType`, `DOCUMENT_MAX_BYTES`) con `...jest.requireActual('../../api/media')` y a dejar como `jest.fn()` las cuatro que hablan con la red: `listPetDocs`, `createPetDocument`, `uploadPhotoToUrl` y `confirmPetDocumentUpload`. Es el patrón de `src/screens/profile/index.test.tsx`.
  - `expo-document-picker`: `getDocumentAsync` es un `jest.fn()` que cada test resuelve, o rechaza, con el resultado que necesita.
  - `expo-web-browser`: `openBrowserAsync` es un `jest.fn()`.
  - Lectura del archivo local: `globalThis.fetch` se sustituye por un `jest.fn()` que resuelve `{ blob: jest.fn().mockResolvedValue(<blob>) }` y se restaura en `afterEach`, como en el test del perfil. La API está mockeada, así que ese `fetch` solo lo usa la lectura del asset.
  - `useAuth`: el `signOut` es un `jest.fn()` con nombre, para poder asertarlo.
- Estados: «pendiente» es `pending()`, el helper que ya existe (ancla B41). Cualquier otro estado es `mockResolvedValue({ kind: '<kind>' })`, con `message` cuando el tipo lo pide (`unreachable`).
- Roles: `{ ...makePet(), myRole: '<rol>' }`. `makePet()` devuelve `owner`.
- Toda fixture de `PetDocument` lleva `downloadUrl` desde R2. B15 cuenta 9 apariciones de `docs: [` en el test de la pantalla; las que no son `[]` necesitan el campo. La fixture `doc-1` pinta la fila `doc-doc-1`; R7 añade `doc-2`.
- Comentarios en el código de producción: en `src/api/media.ts` y en `src/screens/docs/index.tsx` un comentario solo puede citar la feature como `#158 R<n>`. Un `(#158)` o un `#158:` casa con `HEX_LITERAL` de `design-drift`, que solo exceptúa `#<n> R<n>`.
- Formulario relleno (R8 y R9): Tipo `Vacunación`, Nombre `Antirrábica`, Fecha `2026-10-01` y Veterinario `Dra. Pérez`, escritos con `fireEvent.changeText` sobre los cuatro inputs.

## T0 — Arranque (sin commit de código)

- [ ] `git log -1 --format=%h` en la branch y comprueba que su base es `65f37841` o la contiene.
- [ ] Vuelve a medir [[design]] §Base medida (B1-B51). Si alguna salida no coincide, **para** y avisa.
- [ ] `test ! -e .expo/types/router.d.ts`. Si falla, **para** y pide al humano que lo borre: son tipos de rutas obsoletos que rompen el typecheck.
- [ ] `bunx expo install expo-document-picker`. Commit propio: `chore(mobile-docs-upload): add expo-document-picker`. Después, `bunx tsc --noEmit` en verde.

## R1 — catálogo: doce claves nuevas y la frase nueva de Pingo

- [ ] (1) Rojo. En `src/providers/__tests__/language-provider.test.tsx`:
  - añade `+ 12 // #158 R1` al recuento, después de `+ 5, // #155 R1` (ancla B20); el recuento pasa de 371 a 383;
  - añade `it('#158 R1: ...')`, que comprueba los 13 pares `en`/`es` de [[requirements]] §Copy nueva, la cabecera `### §2.22 — Añadidos por #158 — Subir documentos` en `specs/mobile-ui-language/design.md` y, para cada una de las 13 claves, una fila que case con `| — | \`<clave>\`[^\n]*← (?:añadida|cambiada) por #158 \(R1\)`. Usa el patrón del `it` `#73 R5` del mismo fichero.

  Cambia además los dos literales viejos de `docs.emptyBody`:
  - `copyRows` de `src/components/__tests__/empty-state.test.tsx` (ancla B21);
  - el `it('pinta la pose, el título y la frase de Pingo')` de `src/screens/docs/index.test.tsx`, que pasa a esperar `Cuando se suba un documento médico de tu mascota, te lo guardo aquí.`

  `bunx jest src/providers/__tests__/language-provider.test.tsx src/components/__tests__/empty-state.test.tsx src/screens/docs/index.test.tsx`
- [ ] (2) Verde.
  - Añade las 12 claves a `en` y a `es` de `src/i18n/catalog.ts` y cambia `docs.emptyBody`.
  - Añade `§2.22` a `specs/mobile-ui-language/design.md`, justo antes de `## 3. La infraestructura`. Usa la cabecera de tabla `| # | Clave | \`en\` | \`es\` | Origen |` y una fila por clave. La fila de #155 se queda.
- [ ] (3) Refactor: nada previsto.

## R2 — API de media

Fichero de test: `src/api/__tests__/media.test.ts`. Usa el helper `response(status, body)` que ya existe.

- [ ] (1) Rojo: un `describe('#158 R2: ...')` con 54 tests:
  - `listPetDocs`: `it.each` de 3 filas con un elemento cuyo `downloadUrl` está ausente, es `null` o es `42`; las tres dan `{ kind: 'error' }`;
  - `resolveDocumentContentType`: `it.each` con las 24 filas de la tabla de R2.2, con su resultado exacto (`null` incluido, con `toBeNull()`);
  - `DOCUMENT_MAX_BYTES` vale `10485760`, escrito como literal en el test (no `10 * 1024 * 1024` importado de otro sitio);
  - `createPetDocument`: `it.each` con las 11 filas de la tabla de R2.3, y un `it` más que asevera el método `POST`, la ruta `/pets/pet-1/media`, la cabecera `Authorization` y el body JSON enviados;
  - `confirmPetDocumentUpload`: `it.each` con las 12 filas de la tabla de R2.4, y un `it` más que asevera el método `POST`, la ruta `/pets/pet-1/media/<documentId>/confirm`, la cabecera `Authorization` y el body `{}`;
  - `uploadPhotoToUrl` con `'application/pdf'` manda esa cabecera `Content-Type` y no manda `Authorization`.

  Las fixtures de R8 que ya existen ganan `downloadUrl`. `bunx jest src/api/__tests__/media.test.ts`
- [ ] (2) Verde: R2 en `src/api/media.ts`. Las fixtures de `PetDocument` de `src/screens/docs/index.test.tsx` ganan `downloadUrl` en este mismo commit, porque el campo pasa a ser obligatorio. `bunx tsc --noEmit` en verde.
- [ ] (3) Refactor: nada previsto. No extraigas un helper común con `resolvePhotoContentType`: ese recorta en `?` y `#` porque recibe una URI, y R2.2 no recorta ([[design]] D2).

## R3 — el owner ve la acción

- [ ] (1) Rojo: `describe('#158 R3: ...')` en `src/screens/docs/index.test.tsx`, con 21 tests:
  - owner con `[doc-1]`: `docs-upload` existe, su texto es `Subir documento` y los hijos del contenedor (`screen-docs` → `children[0]`) son `['View', 'docs-upload', 'doc-doc-1']`. Además, `props.className` de `docs-upload` contiene `rounded-xl` y `bg-accent`, y la de su etiqueta contiene `font-bold` y `text-accent-foreground`;
  - owner con `[]`: `docs-empty-action` existe con `Subir documento`;
  - `it.each` de 2 entradas (`docs-upload` con `[doc-1]`, `docs-empty-action` con `[]`): al pulsarla, `getDocumentAsync` se llama una vez con el objeto exacto de R3;
  - `it.each` de 7 filas, con owner y mascota ok: lista `pending()` (`docs-list-skeleton` presente) y los seis `kind` que no son `ok` (`docs-error` presente). En las 7, primero `await screen.findByText('Luna')`: el nombre solo se pinta con la mascota en `ok` (ancla B40), y sin esa espera la fila `pending()` asevera antes de que la pantalla sepa que es owner. Después, la presencia de `docs-list-skeleton` o de `docs-error`, y por último `docs-upload` y `docs-empty-action` son `null`;
  - `it.each` de 10 filas: mascota `pending()`, `unauthorized`, `error`, `unreachable` y `missing-config`, cada una con lista `[doc-1]` y con lista `[]`. Cada fila sigue estos pasos en orden, cada uno en su propio `await`. No juntes el estado y la ausencia en un mismo `waitFor`: puede aseverar sobre el árbol de antes.
    1. Espera a que la lista esté pintada: `await screen.findByTestId('doc-doc-1')` o `'docs-empty'`.
    2. En las 8 filas con la mascota resuelta, `await waitFor(() => expect(queryClient.getQueryState(petKeys.detail('pet-1'))?.status).toBe('success'))`, con el `queryClient` que devuelve `renderDocs()`. En las 2 filas `pending()` la consulta no resuelve y este paso no se hace.
    3. Vacía el lote de notificación de TanStack Query: `await act(async () => { await new Promise((r) => setTimeout(r, 0)); })`. `act` se añade al import de `@testing-library/react-native`. Con timers reales (ancla B47), es el `setTimeout` correcto.
    4. Asevera que `docs-upload` y `docs-empty-action` son `null`.

  En el mismo commit:
  - el `it('no ofrece acción')` de `#155 R7` (ancla B14) pasa a usar `{ ...makePet(), myRole: 'family' }` y se renombra `no ofrece acción a quien no es owner (#158 R4)`. Va aquí y no en R4: con owner, el verde de R3 lo pondría rojo;
  - `src/__tests__/consistency-classnames.test.ts`: los **dos** recuentos `13 + 1 + 1 + 1 + 1` (ancla B17) pasan a `13 + 1 + 1 + 1 + 1 + 1`, con el comentario `// #158 R3: docs-upload`.

  `bunx jest src/screens/docs/index.test.tsx -t '#158 R3|#155 R7' && bunx jest src/__tests__/consistency-classnames.test.ts`
- [ ] (2) Verde: R3 en `src/screens/docs/index.tsx` (`isOwner` con la forma de geofences, ancla B25).
- [ ] (3) Refactor: nada previsto.

## R4 — family, walker y vet no ven la acción

- [ ] (1) Rojo, o verde de entrada si R3 ya lo cumple; dilo en el informe. `it.each(['family', 'walker', 'vet'] as const)` en dos `describe`, con `[doc-1]` y con `[]`: 6 tests.
  - Con documentos: `docs-upload` es `null`.
  - Con la lista vacía: `docs-empty-action` es `null` y los hijos de `docs-empty` son `['docs-empty-pose', 'docs-empty-title', 'docs-empty-body']`.

  `bunx jest src/screens/docs/index.test.tsx -t '#158 R4'`
- [ ] (2) Verde: si hiciera falta, ajustar la condición de R3.
- [ ] (3) Refactor: nada previsto.

## R5 — selector y formulario

- [ ] (1) Rojo: `describe('#158 R5: ...')`, con 16 tests:
  - `it.each` con las 7 filas de la tabla de R5. Para la fila de rechazo, `getDocumentAsync.mockRejectedValue(new Error('no native module'))`. Las filas de error esperan el literal `es` con `findByText` y aseveran que `docs-upload-form` es `null`. La fila `canceled` asevera que `docs-upload-form` y `docs-action-error` son `null` y que la entrada sigue. Las dos que abren aseveran que `docs-upload-form` existe;
  - `it.each` de 2 filas, con error del selector (tipo inválido) y owner:
    - con `[]`, los hijos son `['View', 'docs-action-error', 'docs-empty']`;
    - con `[doc-1]`, los hijos son `['View', 'docs-upload', 'docs-action-error', 'doc-doc-1']`.

    En las dos, `docs-action-error` tiene `props.selectable === true` y `props.className === 'text-danger'`;
  - `it.each` de 2 entradas (`docs-empty-action` con `[]`, `docs-upload` con `[doc-1]`): con un error pintado, `getDocumentAsync.mockReturnValueOnce(pending())`, se pulsa otra vez la entrada y `docs-action-error` es `null`;
  - `it.each` de 2 filas, con el formulario abierto:
    - con `[]`, los hijos son `['View', 'docs-upload-form', 'docs-empty']`;
    - con `[doc-1]`, los hijos son `['View', 'docs-upload-form', 'doc-doc-1']`.

    En las dos, `docs-upload` y `docs-empty-action` son `null` y `docs-upload-file` tiene el nombre del asset;
  - un `it` de props:
    - los cuatro inputs según la tabla de R5. Cada `Input` contiene `rounded-xl` y `bg-default` en `props.className`, y cada etiqueta (`getByText('Tipo')`, etc.) contiene `text-2xs`, `font-semibold` y `text-foreground`. Se asevera clase a clase con `expect.stringContaining`, porque HeroUI puede añadir clases suyas; si HeroUI quita alguna de las prescritas, **para** y avisa;
    - la fecha usa `jest.useFakeTimers()` + `jest.setSystemTime(new Date('2026-10-09T12:00:00Z'))`, y el valor esperado es el literal `'2026-10-09'`, nunca una llamada a `civilTodayIso` desde el test. `jest.useRealTimers()` va en `afterEach`;
    - `docs-upload-submit` tiene el texto `Subir documento`. Su `props.className` contiene `rounded-xl` y `bg-accent`, y la de su etiqueta contiene `font-bold` y `text-accent-foreground`;
    - `docs-upload-cancel` tiene el texto `Cancelar`. Su `props.className` contiene `rounded-xl` y `button__root--variant-outline`, y la de su etiqueta contiene `font-semibold` y `button__label--variant-outline` (el `variant="outline"`, ancla B48);
  - `it.each` de 2 entradas (`[]` vuelve a `docs-empty-action`, `[doc-1]` vuelve a `docs-upload`):
    - lee el valor inicial de `docs-date-input`, escribe en los cuatro campos y pulsa `docs-upload-cancel`;
    - asevera que el formulario es `null` y que vuelve la entrada de esa fila;
    - abre otra vez el formulario: tipo, nombre y veterinario son `''`, y la fecha es el valor leído al principio;
    - ni `createPetDocument` ni `globalThis.fetch` se llaman.

  En el mismo commit, `consistency-classnames`: los dos recuentos pasan a `13 + 1 + 1 + 1 + 1 + 1 + 1`, con el comentario `// #158 R5: docs-upload-submit`.
  `bunx jest src/screens/docs/index.test.tsx -t '#158 R5' && bunx jest src/__tests__/consistency-classnames.test.ts`
- [ ] (2) Verde: R5 en la pantalla. El error se guarda como tipo y se traduce en un único punto ([[design]] §Ocurrencias).
- [ ] (3) Refactor: nada previsto.

## R6 — validación

- [ ] (1) Rojo: `describe('#158 R6: ...')`, con 5 tests:
  - `it.each` de 3 ramas (tipo `'   '`, nombre `''` y fecha `'09/10/2026'`, con los otros dos campos válidos). Cada una espera el literal de `docs.errorInvalidForm` y asevera que ni `globalThis.fetch` ni `createPetDocument` se llamaron;
  - `it.each` de 2 listas, con el error de validación pintado:
    - con `[]`, los hijos son `['View', 'docs-upload-form', 'docs-action-error', 'docs-empty']`;
    - con `[doc-1]`, los hijos son `['View', 'docs-upload-form', 'docs-action-error', 'doc-doc-1']`.

    Después se pulsa `docs-upload-cancel` y `docs-action-error` es `null`.

  `-t '#158 R6'`
- [ ] (2) Verde.
- [ ] (3) Refactor: nada previsto.

## R7 — subida correcta

- [ ] (1) Rojo: `describe('#158 R7: ...')`, con 3 tests:
  - PDF. El asset es `{ uri: 'file:///cache/vacuna.pdf', name: 'vacuna.pdf', mimeType: 'application/pdf', size: 1000 }`. `listPetDocs` resuelve primero `[doc-1]` y después `[doc-1, doc-2]`.
    - Se escribe Tipo `' Vacunación '`, Nombre `' Antirrábica '`, Fecha `' 2026-10-01 '` y Veterinario `' Dra. Pérez '`, se pulsa enviar y se espera con `waitFor` a que `doc-doc-2` contenga el nombre de la fixture nueva.
    - Orden con `mock.invocationCallOrder`: lectura del asset, `createPetDocument`, `uploadPhotoToUrl`, `confirmPetDocumentUpload` y segunda llamada a `listPetDocs`.
    - `input` es `toEqual({ type: 'Vacunación', name: 'Antirrábica', date: '2026-10-01', vet: 'Dra. Pérez' })`.
    - `uploadPhotoToUrl` recibe el `uploadUrl` del create, el blob y `'application/pdf'`; `confirmPetDocumentUpload` recibe el `documentId` del create.
    - Tras el éxito, `docs-upload-form` es `null` y `docs-upload` vuelve.
  - PNG sin `mimeType`. El asset es `{ uri: 'file:///cache/radiografia.png', name: 'radiografia.png', size: 2000 }` y el Veterinario es `'   '`. `input` no tiene la propiedad `vet` (`expect(input).not.toHaveProperty('vet')`) y `uploadPhotoToUrl` recibe `'image/png'`.
  - `refetch` no ok: la segunda llamada a `listPetDocs` resuelve `{ kind: 'error' }`. Se espera a `docs-error`; `docs-upload-form`, `docs-upload` y `docs-empty-action` son `null`.

  `-t '#158 R7'`
- [ ] (2) Verde.
- [ ] (3) Refactor: nada previsto.

## R8 — botones bloqueados mientras sube

- [ ] (1) Rojo: `describe('#158 R8: ...')`, con 7 tests:
  - `it.each` con las 6 etapas de R8. En cada una, esa etapa queda en `pending()` y las anteriores resuelven `ok`:
    - `globalThis.fetch` pendiente;
    - `fetch` resuelve `{ blob: jest.fn(() => pending()) }`;
    - `createPetDocument` pendiente;
    - `uploadPhotoToUrl` pendiente;
    - `confirmPetDocumentUpload` pendiente;
    - segunda llamada a `listPetDocs` pendiente.

    En cada fila, tras pulsar enviar con el formulario relleno, **primero** espera a que la cadena llegue a su etapa: `await waitFor(() => expect(<mock>).toHaveBeenCalledTimes(1))`. Por filas, `<mock>` es `globalThis.fetch`, el `jest.fn` de `blob`, `createPetDocument`, `uploadPhotoToUrl`, `confirmPetDocumentUpload` y, en la última, `listPetDocs` con `toHaveBeenCalledTimes(2)`. Es una excepción a §Esperas: una etapa pendiente no pinta texto, y sin esta espera el `disabled` que se ve puede ser el del momento de pulsar, antes de que la cadena llegue a la etapa. Después de esa espera, y no antes:
    - `accessibilityState.disabled === true` en `docs-upload-submit` y en `docs-upload-cancel`;
    - una segunda pulsación de enviar deja `globalThis.fetch` en 1 llamada y `createPetDocument` en las llamadas que tenía (0 en las dos primeras filas, 1 en el resto);
    - una pulsación de `docs-upload-cancel` deja `docs-upload-form` en pantalla.
  - Rehabilitar: con `createPetDocument` en `{ kind: 'forbidden' }`, espera `Solo el dueño puede subir documentos` con `findByText` y asevera que los dos botones vuelven a `disabled` falso.

  `-t '#158 R8'`
- [ ] (2) Verde.
- [ ] (3) Refactor: nada previsto.

## R9 — errores

- [ ] (1) Rojo: `describe('#158 R9: ...')`, con 23 tests:
  - `it.each` con las 19 filas de la tabla de R9. Las dos filas de lectura usan `globalThis.fetch.mockRejectedValue(...)` y `{ blob: jest.fn().mockRejectedValue(...) }`. Cada fila, con el formulario relleno:
    - espera su literal `es` con `findByText`;
    - asevera que `docs-upload-form` sigue y que los **cuatro** inputs conservan su valor (`props.value`);
    - asevera que `docs-upload-submit` y `docs-upload-cancel` tienen `accessibilityState.disabled` falso;
    - asevera que `listPetDocs` tiene una sola llamada;
    - asevera que el paso siguiente no se llamó: `createPetDocument` en las filas de lectura, `uploadPhotoToUrl` en las de crear y `confirmPetDocumentUpload` en las de `PUT`. En las de confirmar ya basta con la aserción de `listPetDocs`.
  - `it.each` de 2 filas para `unauthorized`, en crear y en confirmar: `signOut` se llama una vez y `docs-action-error` es `null`.
  - Nuevo intento: `it.each` de 2 filas, una por origen del error anterior. Con la lectura del archivo pendiente, el error solo se ha podido quitar al pulsar, no después de leer.
    - Error de R9: create en `{ kind: 'error' }`, `await screen.findByText('Algo salió mal')`, `globalThis.fetch.mockReturnValueOnce(pending())`, se pulsa otra vez enviar y, justo después de la pulsación, `docs-action-error` es `null`.
    - Error de R6: con el formulario relleno salvo Tipo `'   '`, se pulsa enviar, `await screen.findByText('Añade un tipo, un nombre y una fecha con formato AAAA-MM-DD')`. Se escribe Tipo `Vacunación`, `globalThis.fetch.mockReturnValueOnce(pending())`, se pulsa otra vez enviar y, justo después de la pulsación, `docs-action-error` es `null`. Entre escribir y pulsar no se asevera nada: la spec no dice si escribir quita el error. La fila de R9, que no escribe, es la que fija que se quita al pulsar.

  En el mismo commit, `src/__tests__/design-drift.test.ts`: `'screens/docs/index.tsx': 0,` (ancla B16) pasa a `1`, con el comentario `// #158 R9`.
  `-t '#158 R9'` y `bunx jest src/__tests__/design-drift.test.ts`
- [ ] (2) Verde: una sola llamada `signOut(` en el fichero.
- [ ] (3) Refactor: nada previsto.

## R10 — abrir un documento

- [ ] (1) Rojo: `describe('#158 R10: ...')`, con 9 tests:
  - `it.each(['owner', 'family', 'walker', 'vet'] as const)`: pulsar `doc-doc-1` llama una vez a `openBrowserAsync` con la `downloadUrl` de la fixture, y la fila tiene `accessibilityRole` `button`;
  - `it.each` con los mismos 4 roles: `openBrowserAsync` rechaza, se pinta `Algo salió mal`, `doc-doc-1` sigue, y los hijos son `['View', 'docs-upload', 'docs-action-error', 'doc-doc-1']` para owner y `['View', 'docs-action-error', 'doc-doc-1']` para los otros tres;
  - limpiar al pulsar, con `family`:
    - el primer `openBrowserAsync` rechaza y se espera `Algo salió mal`;
    - el segundo devuelve `pending()`;
    - tras pulsar otra vez `doc-doc-1`, `docs-action-error` es `null` y `openBrowserAsync` lleva 2 llamadas.

  `-t '#158 R10'`
- [ ] (2) Verde: `onPress` en la `Card` de `DocumentRow`. La `Card` ya pone la esquina continua: no añadas `style={CONTINUOUS_CORNER}` nuevo (el inventario de docs sigue en 1).
- [ ] (3) Refactor: nada previsto.

## R11 — teclado

- [ ] (1) Rojo: `describe('#158 R11: ...')`, con 2 tests.
  - Antes, `renderDocs()` envuelve `<DocsScreen petId="pet-1" />` en `<HeaderHeightContext.Provider value={91}>`, igual que `renderWeightLog` (ancla B34). Importa `HeaderHeightContext` de `expo-router/react-navigation`. Hoy no está (ancla B35). Sin ese provider el resultado real es 200, no 291.
  - Copia el procedimiento del `it` de `#148 R7` de `src/screens/weight-log/index.test.tsx` (ancla B24) sobre `docs-keyboard-avoider`:
    - `Platform.OS = 'android'` dentro del `it`, restaurado en `afterEach`;
    - `layout` de alto 700, `keyboardDidShow` con `screenY: 500`, y `paddingBottom: 291` esperado con `waitFor`.
  - Otro `it`: `screen-docs` tiene `keyboardShouldPersistTaps` `'handled'`.

  Los `it` de `#95 R6` (`contentContainerStyle`) y de `#155 R7` (`slot.parent?.parent` es `screen-docs`) no se tocan y tienen que seguir en verde.
  `-t '#158 R11|#95 R6|#155 R7'`
- [ ] (2) Verde.
- [ ] (3) Refactor: nada previsto.

## R12 — copy registrada e inventarios

- [ ] (1) Rojo: en `src/__tests__/ui-language.test.ts`, la longitud de `R7_PROFILE` (ancla B18) pasa a `35 - 1 + 2 + 1 + 16` con `// #158 R12`, y el título del `it` pasa a `resuelve las 53 ocurrencias normativas`. Rojo esperado: 37 ≠ 53. `bunx jest src/__tests__/ui-language.test.ts`
- [ ] (2) Verde: las 16 filas de [[design]] §Ocurrencias en `R7_PROFILE` de `src/__tests__/ui-copy-table.ts`, junto a las seis de docs (ancla B19 → 22). `checkUses(ALL_USES)` y el escaneo de literales fijos tienen que seguir en verde; `SCREEN_FILES` sigue en 29.
- [ ] (3) Comprobación de cierre, sin commit si todo cuadra:
  - `grep -cF 'rounded-xl bg-accent' src/screens/docs/index.tsx` da `2`;
  - `grep -cF 'signOut(' src/screens/docs/index.tsx` da `1`;
  - `grep -cF 'bg-accent-soft' src/screens/docs/index.tsx` da `0`;
  - `grep -cE 'text-accent([^-]|$)' src/screens/docs/index.tsx` da `0`;
  - `grep -cF 'StyleSheet' src/screens/docs/index.tsx src/screens/docs/index.test.tsx` da `0` en los dos.

## R13 — prueba de humo (humano)

- [ ] (1) No lleva test automático. El humano sigue [[requirements]] §Prueba de humo después del veredicto del reviewer.
- [ ] (2) El humano marca `- [ ] Smoke R13 superado en dev build de Android (fecha: ____)`.
- [ ] (3) —

## T-final

- [ ] `bunx jest` entero en `mobile-pet-tracker/`, `bunx tsc --noEmit` y `bunx expo lint --no-cache`, los tres en verde y medidos sin pipe.
- [ ] `git diff --stat 65f37841..HEAD` solo toca los ficheros de [[design]] §Ficheros afectados, más `progress/impl_mobile-docs-upload.md` y `specs/mobile-docs-upload/traceability.md`.
