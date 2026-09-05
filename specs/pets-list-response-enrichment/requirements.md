---
feature: "pets-list-response-enrichment"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[pets-list-response-enrichment]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #66 (`description` + los 5 `acceptance_criteria`)
> y `progress/explore_design-gap-vs-make.md` §2.3.1, §2.4 y §7 (Bloque 0).
> Todas las rutas de esta spec son relativas a `backend-pet-tracker/` salvo
> que se indique lo contrario. **Feature de backend**: la sesión de UI móvil
> no la implementa y `mobile-pet-tracker/` no se toca (ver §Contexto,
> "El cliente móvil").

## Contexto — el fallo exacto

`GET /v1/pets` devuelve `photoUrl: null` para **todas** las mascotas, tengan
foto o no. No es un bug de datos: es alcance recortado a propósito en
`pet-photos-s3` (#6), cuya decisión D2 —"`photoUrl` solo se resuelve en el
detalle, no en el listado"— el humano confirmó el 2026-08-05
(`specs/pet-photos-s3/requirements.md:145-151` y `:190`). Esta feature
**supersede D2 de #6**; la spec de #6 no se edita (C6: spec aprobada no se
modifica), queda este registro.

La cadena hoy, con líneas verificadas sobre `chore/design-gap-backlog`:

```ts
// src/modules/pets/infrastructure/pets.controller.ts:69-79
@Get()
async list(@CurrentUser() user: CurrentUserPayload): Promise<PetProfileResponse[]> {
  const memberships = await this.listPets.execute(user.id);
  const now = new Date();
  return memberships.map(({ pet, role }) =>
    toPetProfileResponse(pet, role, now),        // ← device, photoUrl, nextVaccine
  );                                             //   caen en su default: null
}
```

```ts
// src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts:53-60
export function toPetProfileResponse(
  pet: Pet, myRole: PetRole, now: Date = new Date(),
  device: DeviceStatusResponse | null = null,
  photoUrl: string | null = null,
  nextVaccine: NextPetVaccine | null = null,
): PetProfileResponse { ... photoUrl, ... }
```

`ListPetsUseCase` (`src/modules/pets/application/use-cases/list-pets.use-case.ts`,
22 líneas) solo delega en `PetRepository.findAllByMember(userId)` y devuelve
`PetWithRole[]` (`{ pet, role }`). La entidad `Pet` **ya trae `photoKey`**
(`pet.entity.ts:40`; `toDomain` lo mapea desde `pets.photo_key` en
`pet.drizzle.repository.ts:146`): el dato está en memoria en cada elemento
del listado y se descarta.

El detalle sí lo resuelve, y así es como se produce hoy `photoUrl`
(verificado, no supuesto):

```ts
// src/modules/pets/application/use-cases/get-pet.use-case.ts:19-20, 59-65
export const PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600;   // 1 h
...
const photoUrl = pet.photoKey !== null
  ? await this.photoUrlResolver.resolveDownloadUrl(pet.photoKey, PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS)
  : null;
```

`PET_PHOTO_URL_RESOLVER` (puerto en
`src/modules/pets/domain/ports/pet-photo-url-resolver.ts`) lo implementa
`PetPhotoUrlResolverImpl` (`src/modules/media/infrastructure/pet-photo-url.resolver.ts`)
delegando en `PHOTO_STORAGE` → `PhotoStorageS3Adapter.createDownloadUrl`
(`src/modules/media/infrastructure/photo-storage.s3.adapter.ts:33-39`), que
es `getSignedUrl(this.s3, new GetObjectCommand({Bucket, Key}), { expiresIn })`
de `@aws-sdk/s3-request-presigner`. **Es una firma SigV4 calculada en local**:
no hay petición a S3 ni a ningún servicio AWS para producir la URL. Los dos
providers llegan a `PetsModule` por `PetPhotoReadModule`
(`src/modules/media/pet-photo-read.module.ts`, ya importado en
`pets.module.ts:24`), así que `ListPetsUseCase` puede inyectar
`PET_PHOTO_URL_RESOLVER` **sin tocar ningún módulo**.

**Consecuencia del fallo** (explore §2.3.1): el selector de mascotas con
avatares del rediseño (`pet-switcher.tsx`, hero de la Home, cabecera
fotográfica #67) no se puede construir con una llamada — o hace N
`GET /v1/pets/:id`, o se arregla aquí. Es la trampa de mayor frecuencia del
diseño: afecta a Home, Profile y a cualquier carrusel.

**El cliente móvil ya está preparado.** `mobile-pet-tracker/src/api/types.ts:66`
tipa `photoUrl: string | null` para `PetProfile`, que es el tipo tanto del
listado (`listPets` → `PetsState.pets: PetProfile[]`, `api/pets.ts:5`) como
del detalle. `src/components/pet-switcher.tsx:38-42` **ya renderiza
`pet.photoUrl` cuando no es null** sobre los elementos de `listPets`
(`home.tsx:133-137`), y `pet-switcher.test.tsx:44-65` ya lo cubre. Rellenar
el valor es **aditivo**: ningún tipo cambia, ningún consumidor se rompe, y no
hay tarea de `types.ts` en esta spec ([[design]] §D5). El único cambio de
comportamiento visible en la app es que los avatares del selector pasan de
inicial a foto — sin tocar una línea de UI.

**Todo se verifica sin AWS real**: en unitario con el puerto mockeado (como
`get-pet.use-case.spec.ts`), en e2e contra LocalStack como el resto de
`test/*.e2e-spec.ts`.

## Requisitos funcionales

### Bloque A — resolución en la capa application

- **R1**: WHEN `ListPetsUseCase.execute(userId)` recibe de
  `PetRepository.findAllByMember(userId)` una o más membresías, THE SYSTEM
  SHALL devolver un `PetListItem[]` (`{ pet, role, photoUrl }`, interfaz
  exportada por `list-pets.use-case.ts`) **en el mismo orden**, donde para
  cada elemento `photoUrl` es: **(a)** el valor resuelto por
  `PET_PHOTO_URL_RESOLVER.resolveDownloadUrl(pet.photoKey,
  PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS)` cuando `pet.photoKey !== null`, y
  **(b)** `null` **sin invocar el resolver** cuando `pet.photoKey === null`.
  El resolver SHALL invocarse exactamente una vez por mascota con foto —
  nunca por mascota sin foto — y con `expiresInSeconds` **igual a 3600**, la
  misma constante que usa `GetPetUseCase`. WHEN no hay membresías, THE
  SYSTEM SHALL devolver `[]` sin invocar el resolver.

  - Test: `src/modules/pets/application/use-cases/list-pets.use-case.spec.ts`,
    describe nuevo `R1 (pets-list-response-enrichment #66): el listado resuelve
    photoUrl por mascota con foto y deja null sin foto`, con dos `it`:
    - **(a)** tres membresías en orden [A con `photoKey: 'pets/a/photo-1'`
      (`owner`), B con `photoKey: null` (`family`), C con
      `photoKey: 'pets/c/photo-2'` (`vet`)] y el resolver stub
      `resolveDownloadUrl: jest.fn((key) => Promise.resolve(\`https://signed.example/${key}\`))`:
      el resultado SHALL tener longitud 3, `result.map((i) => i.photoUrl)`
      SHALL ser `['https://signed.example/pets/a/photo-1', null,
      'https://signed.example/pets/c/photo-2']`, `result.map((i) => i.role)`
      SHALL ser `['owner', 'family', 'vet']`, y el stub SHALL haber sido
      llamado **exactamente 2 veces**: `toHaveBeenNthCalledWith(1,
      'pets/a/photo-1', 3600)` y `toHaveBeenNthCalledWith(2, 'pets/c/photo-2', 3600)`.
    - **(b)** `findAllByMember` resuelve `[]`: el resultado SHALL ser `[]` y
      el resolver `not.toHaveBeenCalled()`.

### Bloque B — el contrato HTTP

- **R2**: WHEN un usuario autenticado envía `GET /v1/pets`, THE SYSTEM SHALL
  serializar cada `PetListItem` con
  `toPetProfileResponse(pet, role, now, null, photoUrl)` de forma que la
  clave `photoUrl` de cada elemento sea la del item, y el resto del contrato
  SHALL NOT cambiar: exactamente las **24 claves** de R8 de #5 (la lista de
  `pet-profile-response.mapper.spec.ts:38-63`), con `device`, `nextVaccine`,
  `nextReminder` y `activitySummary` en `null`. El mapper
  `toPetProfileResponse` y la interfaz `PetProfileResponse` SHALL NOT
  editarse.

  - Test: `src/modules/pets/infrastructure/pets.controller.spec.ts`, describe
    nuevo `R2 (pets-list-response-enrichment #66): GET /v1/pets serializa el
    photoUrl de cada item sin alterar el contrato`, con dos `it`:
    - **(a)** `listExecute` resuelve
      `[{ pet: buildPet(), role: 'owner', photoUrl: 'https://signed.example/a' },
      { pet: buildPet(), role: 'family', photoUrl: null }]`:
      `response[0].photoUrl` SHALL ser `'https://signed.example/a'`,
      `response[1].photoUrl` SHALL ser `null`, y `myRole` `'owner'` /
      `'family'` respectivamente.
    - **(b)** sobre el mismo `response[0]`: `Object.keys(response[0]).sort()`
      SHALL ser igual a la lista de 24 claves (copiada literal al test, no
      importada del mapper), y `device`, `nextVaccine`, `nextReminder`,
      `activitySummary` SHALL ser `null`.

- **R3**: WHEN un usuario con membresía activa envía `GET /v1/pets` contra
  Postgres + LocalStack teniendo dos mascotas —una con `pets.photo_key` no
  nulo y otra con `photo_key` nulo— THE SYSTEM SHALL responder `200` con:
  para la mascota con clave, un `photoUrl` de tipo string tal que
  `new URL(photoUrl)` tiene `searchParams.get('X-Amz-Signature')` no vacío,
  `searchParams.get('X-Amz-Expires') === '3600'` y `pathname` que termina en
  `/<photo_key>`; para la otra, `photoUrl: null`; ambos elementos con
  exactamente las 24 claves `PROFILE_KEYS`. Además el `pathname` del
  `photoUrl` del listado SHALL ser **idéntico** al `pathname` del `photoUrl`
  que devuelve `GET /v1/pets/:petId` para la misma mascota (misma clave,
  mismo bucket, mismo adaptador).

  - Test: `test/pets.e2e-spec.ts`, describe nuevo `R3
    (pets-list-response-enrichment #66): GET /v1/pets devuelve photoUrl
    prefirmada para la mascota con photo_key`, un `it`. Siembra: `seedUser`,
    dos `createPetViaApi`, y para la primera
    `db.update(pets).set({ photoKey: \`pets/${petA.id}/e2e-photo-${RUN_ID}\` }).where(eq(pets.id, petA.id))`
    (`eq` y `pets` ya están importados en ese archivo). No se sube ningún
    objeto a S3: la prueba byte a byte del presign ya existe para el detalle
    (`test/media.e2e-spec.ts:367-400`, R9 de #6) y el listado pasa por el
    mismo puerto y adaptador — lo que este `it` demuestra es que el listado
    **firma** y que firma **la misma URL** que el detalle.

### Bloque C — lo que no debe pasar

- **R4**: WHILE resuelve el listado de un usuario con N mascotas, THE SYSTEM
  SHALL invocar `PetRepository.findAllByMember` **exactamente una vez** y
  ningún otro método del repositorio, SHALL NOT consultar `PET_DEVICE_READER`
  ni `PET_VACCINE_READER` (`ListPetsUseCase` SHALL depender únicamente de
  `PET_REPOSITORY` y `PET_PHOTO_URL_RESOLVER`), y cada `PetListItem` SHALL
  tener exactamente las claves `pet`, `role`, `photoUrl`. La interfaz
  `PetRepository`, `PetWithRole` y `PetDrizzleRepository` SHALL NOT cambiar
  (la firma local no necesita ningún dato que el `SELECT` de
  `findAllByMember` no traiga ya).

  - Test: `src/modules/pets/application/use-cases/list-pets.use-case.spec.ts`,
    describe nuevo `R4 (pets-list-response-enrichment #66): sin N+1 — una
    consulta al repositorio y sin puertos de device ni vacuna`, con dos `it`:
    - **(a)** tres membresías (dos con foto): `findAllByMember`
      `toHaveBeenCalledTimes(1)`; el mock de repositorio expone **solo**
      `findAllByMember` (cualquier otra llamada lanzaría `TypeError` y
      rompería el test); y para cada item `Object.keys(item).sort()` SHALL
      ser `['pet', 'photoUrl', 'role']`.
    - **(b)** guarda de fuente (patrón de #29 R8):
      `readFileSync(path.join(__dirname, 'list-pets.use-case.ts'), 'utf-8')`
      SHALL contener `PET_PHOTO_URL_RESOLVER`, SHALL NOT contener
      `PET_DEVICE_READER` ni `PET_VACCINE_READER`, y SHALL tener longitud
      > 500 (aserción anti-vacío obligatoria, herencia de #28 R11).

## Decisiones que el humano debe confirmar

> Ninguna bloquea la escritura de tests; las cuatro se cierran marcando esta
> sección al aprobar. Se dejan por escrito porque `CLAUDE.md` fija que las
> decisiones de costo las cierra un humano — aquí se propone el default y se
> argumenta con lo que el código hace, no con lo que la descripción de la
> feature supone.

- **OD-1 — Política de firmado: firmar siempre (propuesta).** La descripción
  de #66 dice que "firmar N URLs prefirmadas de S3 en cada listado cuesta".
  Verificado en `photo-storage.s3.adapter.ts:33-39` y en `aws-clients.ts`:
  **no cuesta dinero**. `getSignedUrl` es una firma SigV4 (cadena de
  HMAC-SHA256) calculada en el proceso Node; no emite ninguna petición a
  AWS, y AWS factura S3 por peticiones, almacenamiento y transferencia — una
  firma calculada en nuestra CPU no es ninguna de las tres. Las credenciales
  tampoco cuestan: en `AWS_MODE=local` son el par estático del `.env`
  (`resolveAwsClientOptions`, cero I/O); en `AWS_MODE=aws` las resuelve la
  cadena por defecto del SDK **una vez y las memoiza** hasta cerca de su
  expiración. Coste por URL: microsegundos de CPU. N es el número de
  mascotas **de un usuario** (una cifra de un dígito en la práctica), no de
  la flota. **El coste real de S3 son los `GET` que hace el cliente al
  cargar cada imagen, y esos ocurren igual con cualquier política**: la app
  descarga las fotos que muestra, las haya firmado quien las haya firmado.
  Las tres alternativas y por qué se descartan están en [[design]] §D1;
  resumen: `?include=photo` añade DTO, rama y un cambio obligatorio en el
  cliente móvil (que esta feature no puede tocar) para ahorrar
  microsegundos; una caché de URLs firmadas añade estado, TTL propio e
  invalidación para ahorrar los mismos microsegundos. **Acción del humano**:
  confirmar "siempre", o elegir otra. Si elige `?include=photo`, R1-R3 ganan
  un DTO de query y el criterio "la UI móvil no implementa nada" deja de
  cumplirse (`api/pets.ts` tendría que pasar el parámetro).

- **OD-2 — Caducidad: 3600 s, la misma constante que el detalle.** R1 fija
  que el listado reutiliza `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS` de
  `get-pet.use-case.ts:20`, aprobada en #6 R6 como "exactamente 3600
  segundos (1 h)". Una sola constante, un solo valor: cambiarla cambia
  detalle y listado a la vez, que es lo deseable (una foto no debería
  caducar antes en un sitio que en otro). **Acción del humano**: confirmar
  1 h. Si prefiere otro valor, cambia la cifra en `get-pet.use-case.ts:20`
  y en los `3600` literales de R1(a), R3 y de `get-pet.use-case.spec.ts:150`
  — y entonces es un cambio de #6 que hay que anotar en su spec.

- **OD-3 — `device` NO entra en el listado (propuesta).** Tres motivos,
  en orden de peso, detalle en [[design]] §D4: (1) es un **N+1 en base de
  datos real**, no una firma local — `PetDeviceDrizzleReader.findActiveDevice(petId)`
  (`pet-device.drizzle.reader.ts:20-26`) es un `SELECT … JOIN … WHERE pet_id
  = $1 LIMIT 1` por mascota, y el puerto no tiene método por lote; (2) **ningún
  consumidor lo necesita en el listado**: la Home ya pide `GET /v1/pets/:id`
  de la mascota seleccionada (`home.tsx:70-71`) y de ahí saca `device` para el
  hero; el selector solo muestra avatar y nombre; (3) `device.connectivity`
  es hoy un pestillo roto en `'online'` (explore §2.3.2, decisión G) — servirlo
  en N mascotas multiplicaría una señal falsa. **Acción del humano**:
  confirmar que queda fuera. Si lo quiere, la forma correcta es un
  `findActiveDevices(petIds: string[])` con `inArray` en el puerto
  `PetDeviceReader` (una consulta, no N) — feature aparte, no un añadido a
  esta.

- **OD-4 — El coste que sí existe y el techo asumido (informativa).** Cada
  llamada a `getSignedUrl` produce una URL distinta (`X-Amz-Date` y
  `X-Amz-Signature` cambian), así que una caché de imágenes indexada por URL
  **falla en cada refetch del listado** y vuelve a descargar las N fotos.
  Ese es el único coste real (peticiones `GET` y transferencia de S3), es
  el **mismo comportamiento que ya tiene el detalle** para el hero, y a
  escala MVP es despreciable (orden de magnitud, precio público us-east-1 a
  2026-09: fracciones de centavo por mil `GET`, ~0,09 USD/GB de salida; no
  es dato load-bearing de ningún requisito). `ponytail:` techo asumido — la
  URL cambia por llamada. Upgrade path si la transferencia llega a medirse:
  firmar con `signingDate` redondeada a la hora para que la URL sea estable
  dentro de la ventana (caché de cliente por URL vuelve a acertar), o CDN
  con cookies firmadas; ambos fuera de alcance. **Acción del humano**:
  ninguna, salvo que quiera la variante de firma redondeada ya — en ese caso
  se añade un R5 a esta spec antes de aprobar.

## Fuera de alcance

- **El pestillo `'online'` de la ingesta y el umbral de silencio**
  (`src/workers/ingestion.drizzle.store.ts:97`; decisión G del informe).
  Feature aparte (`device-connectivity-signal`, Bloque 3 del explore §7).
- **`nextReminder` y `activitySummary`**, hardcodeados a `null` en
  `pet-profile-response.mapper.ts:44-47` y `:84-85`. Feature
  `pet-profile-summary-slots` del Bloque 3, sin id asignado.
- **`device` y `nextVaccine` en el listado**: siguen `null` (R2, R4, OD-3).
- **Cualquier cambio de UI móvil**, incluido `mobile-pet-tracker/src/api/types.ts`:
  el tipo ya es `string | null` y el selector ya lo renderiza ([[design]]
  §D5). `git diff --name-only` de la feature SHALL NOT listar nada bajo
  `mobile-pet-tracker/`.
- **`photoUrl` en `POST /v1/pets`, `PATCH /v1/pets/:petId` y
  `POST /v1/pets/:petId/lost-mode`**: siguen devolviendo `null` (alcance de
  #6). Resolverlo obliga a inyectar el puerto en tres use cases más; ningún
  criterio de #66 lo pide. Si el móvil llegara a usar la respuesta del PATCH
  para refrescar el avatar, es una feature de dos líneas por endpoint.
- **`?include=photo`, caché de URLs firmadas, firma con `signingDate`
  redondeada, CDN / CloudFront, URL estable**: OD-1 y OD-4.
- **Miniaturas, redimensionado o segunda URL (`hero` + `thumb` del Make)**:
  una sola URL a dos tamaños, como fija el explore §2.4.
- **Degradación parcial si el presign falla** (devolver `null` en esa
  mascota y seguir): el detalle tampoco lo hace; un `getSignedUrl` que
  rechaza significa credenciales rotas y todo AWS lo está. Consistencia con
  #6 antes que un `try/catch` nuevo.
- **Cambios en `PetRepository`, `PetDrizzleRepository`, el puerto
  `PetPhotoUrlResolver`, `PhotoStorageS3Adapter`, `PetPhotoReadModule`,
  `pets.module.ts`, el mapper y `GetPetUseCase`**: congelados (R2, R4;
  [[design]] §Archivos afectados).
- **Migraciones, variables de entorno e infraestructura**: ninguna.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [ ] OD-1 política de firmado: "siempre" confirmado / otra: ____
- [ ] OD-2 caducidad 3600 s compartida con el detalle: confirmada / otra: ____
- [ ] OD-3 `device` fuera del listado: confirmado / entra (feature aparte): ____
- [ ] OD-4 leída (no requiere acción) / se pide firma redondeada como R5: ____
