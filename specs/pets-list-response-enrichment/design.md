---
feature: "pets-list-response-enrichment"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[pets-list-response-enrichment]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Rutas relativas a `backend-pet-tracker/` salvo que se diga lo contrario.
> El cambio vive en **application** (`ListPetsUseCase` gana una dependencia
> a un puerto del **domain** que ya existe) y en **infrastructure** (una
> línea del controller). No se crea ningún puerto, adaptador, módulo, DTO,
> tabla ni variable de entorno. Es la misma forma exacta que `GetPetUseCase`
> ya tiene desde #6.

## Decisiones técnicas

### D1 — Política de firmado: siempre, para toda mascota con `photoKey` (R1, OD-1)

Lo que pide `feature_list.json` es "decidir si se firma siempre, solo bajo
`?include=photo`, o si se cachea la URL firmada y con qué caducidad". La
decisión se toma sobre lo que el código hace, no sobre lo que la descripción
supone:

| Hecho | Dónde está verificado |
|---|---|
| La URL prefirmada es `getSignedUrl(s3, GetObjectCommand, { expiresIn })` de `@aws-sdk/s3-request-presigner` | `photo-storage.s3.adapter.ts:33-39` |
| `getSignedUrl` construye la petición y la firma con SigV4 en el proceso; **no hay round-trip a S3** | Comentario del propio adaptador (líneas 12-17, "firmando localmente (SigV4, sin round-trip a S3)") y el test `photo-storage.presign-host.spec.ts`, que firma sin LocalStack levantado |
| Credenciales en `local`: par estático del `.env`, cero I/O | `aws-clients.ts` `resolveAwsClientOptions` (rama no-`aws`: `credentials: { accessKeyId, secretAccessKey }`) |
| Credenciales en `aws`: cadena por defecto del SDK, resuelta y memoizada por el cliente | `resolveAwsClientOptions` (rama `aws`: sin `credentials`, el `S3Client` usa el provider por defecto, que memoiza) |
| N = mascotas **del usuario** con membresía activa, no la flota | `findAllByMember` (`pet.drizzle.repository.ts:66-77`) |

Conclusión: firmar N URLs por listado son N×(microsegundos de CPU) y **cero
peticiones y cero centavos**. Las alternativas se evaluaron contra ese hecho:

| Política | Qué añade | Qué ahorra | Veredicto |
|---|---|---|---|
| **Siempre** (propuesta) | Una dependencia y un `Promise.all` en `ListPetsUseCase`; una línea en el controller | — | La más simple que cumple el criterio 1 ("sin obligar a una llamada por mascota") |
| `?include=photo` | DTO de query con zod, rama en use case y controller, matriz de tests ×2, y **un cambio obligatorio en `mobile-pet-tracker/src/api/pets.ts`** para que el selector reciba fotos | N firmas locales en los listados que no pidan foto | Descartada: el ahorro son microsegundos; el coste es código en dos repos y rompe "la UI móvil no implementa nada" |
| Caché de URLs firmadas (memoria o tabla) | Estado por `photoKey` con su instante de expiración, política de TTL de caché < TTL de firma, lectura/escritura en el camino caliente | Las mismas N firmas locales | Descartada: es una caché de una operación que ya es más barata que consultar la caché. `photoKey` cambia en cada subida (#6 R1 genera clave nueva), así que ni siquiera hay invalidación interesante |

**Lo que sí cuesta** — y cuesta igual con las tres políticas — son los `GET`
de S3 que hace el cliente al cargar cada imagen. Es transferencia y
peticiones, facturadas al descargar, no al firmar. Detalle y techo asumido en
[[requirements]] OD-4.

### D2 — Dónde vive la resolución: `ListPetsUseCase`, espejo de `GetPetUseCase` (R1, R4)

El controller no debe conocer el puerto (regla de capas: la infraestructura
HTTP llama use cases, no orquesta puertos), y el repositorio no debe conocer
URLs (una firma S3 no es persistencia). Queda la application, que es donde
#6 puso exactamente la misma lógica para el detalle. La forma que se pide
implementar — y nada más:

```ts
// src/modules/pets/application/use-cases/list-pets.use-case.ts
import { PET_PHOTO_URL_RESOLVER } from '@/modules/pets/domain/ports/pet-photo-url-resolver';
import type { PetPhotoUrlResolver } from '@/modules/pets/domain/ports/pet-photo-url-resolver';
import { PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS } from './get-pet.use-case';

/** Elemento del listado (#66 R1): la membresía + su photoUrl resuelto o null. */
export interface PetListItem extends PetWithRole {
  photoUrl: string | null;
}

@Injectable()
export class ListPetsUseCase {
  constructor(
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(PET_PHOTO_URL_RESOLVER) private readonly photoUrlResolver: PetPhotoUrlResolver,
  ) {}

  async execute(userId: string): Promise<PetListItem[]> {
    const memberships = await this.pets.findAllByMember(userId);   // una consulta (R4)
    return Promise.all(
      memberships.map(async ({ pet, role }) => ({
        pet,
        role,
        photoUrl:
          pet.photoKey !== null
            ? await this.photoUrlResolver.resolveDownloadUrl(pet.photoKey, PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS)
            : null,
      })),
    );
  }
}
```

Y en el controller, la línea 76-78 pasa a:

```ts
// src/modules/pets/infrastructure/pets.controller.ts — list()
return items.map(({ pet, role, photoUrl }) =>
  toPetProfileResponse(pet, role, now, null, photoUrl),
);
```

Propiedades de esa forma, todas aseveradas en tests:

1. **`Promise.all` conserva el orden** del array de entrada, así que el
   listado sale en el orden en que lo devolvió la base (R1a asevera el
   orden). Las firmas son CPU pura; paralelo o secuencial da lo mismo en
   tiempo, pero `Promise.all` es la expresión natural y de una línea.
2. **La condición `pet.photoKey !== null` es idéntica a la de
   `get-pet.use-case.ts:60`**: mismo criterio de "tiene foto" en detalle y
   listado, y cero firmas para mascotas sin foto (R1b).
3. **`PetListItem extends PetWithRole`**: el tipo del repositorio no cambia;
   el use case lo enriquece. Las claves son exactamente `pet`, `role`,
   `photoUrl` (R4a).
4. **Ningún módulo cambia**: `PetsModule` ya importa `PetPhotoReadModule`
   (`pets.module.ts:24`), que exporta `PET_PHOTO_URL_RESOLVER`
   (`pet-photo-read.module.ts:19`). NestJS resuelve la nueva inyección tal
   cual.

`ponytail:` techo asumido — sin `try/catch` por mascota. Un
`resolveDownloadUrl` que rechaza tumba el listado con 500, igual que hoy
tumba el detalle. El upgrade, si alguna vez se observa, es envolver la
firma y devolver `null` para esa mascota; hoy sería código defensivo contra
un caso que solo ocurre con credenciales rotas.

### D3 — La constante de caducidad se importa de `get-pet.use-case.ts`, no se duplica ni se mueve (R1, OD-2)

`PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600` vive en
`get-pet.use-case.ts:20` y está aprobada por #6 R6. `list-pets.use-case.ts`
la importa con ruta relativa `./get-pet.use-case` — import entre archivos de
la **misma capa** (`application/use-cases/`), que `docs/conventions.md`
§Imports permite explícitamente. Ventajas frente a las dos alternativas:

- **Duplicar el literal** (`3600` en el listado): dos fuentes de verdad; el
  día que cambie una, la foto caduca antes en el listado que en el detalle.
- **Mover la constante al puerto** (`pet-photo-url-resolver.ts`): más
  limpio conceptualmente, pero obliga a editar `get-pet.use-case.ts` (un
  archivo de #6 que esta feature no necesita tocar) y no cambia ninguna
  aserción. Si un tercer use case la necesita, se mueve entonces.

### D4 — `device` no se enriquece en el listado (R4, OD-3)

Es la segunda pregunta que la feature pide cerrar. Investigado:

| Pregunta | Respuesta verificada |
|---|---|
| ¿Qué lleva `device` hoy en el listado? | `null` literal: el controller no pasa el 4.º argumento del mapper (`pets.controller.ts:76-78`) |
| ¿Qué lleva en el detalle? | `toDeviceStatusResponse(device)` con las 5 claves `{model, batteryPct, connectivity, lastMessageAt, esn}` (`device-status.mapper.ts:15-21`), obtenido de `PET_DEVICE_READER.findActiveDevice(petId)` |
| ¿Enriquecerlo obliga a consultas extra por mascota? | **Sí, N+1 en Postgres**: `PetDeviceDrizzleReader.findActiveDevice` es un `SELECT` con `INNER JOIN devices` y `WHERE pet_id = $1 AND released_at IS NULL LIMIT 1` **por mascota** (`pet-device.drizzle.reader.ts:20-26`). El puerto `PetDeviceReader` tiene un único método, unitario |
| ¿Quién lo consumiría en el listado? | Nadie hoy. La Home muestra batería y estado del **hero**, que es la mascota seleccionada, y para ella ya llama `getPet` (`home.tsx:70-71`). El selector (`pet-switcher.tsx`) renderiza avatar + nombre |
| ¿Es fiable la señal? | `device.connectivity` es un pestillo de un solo sentido (`ingestion.drizzle.store.ts:97` escribe `'online'` y nada escribe `'offline'`; explore §2.3.2, decisión G) |

Decisión: **no entra**. A diferencia de `photoUrl` (dato ya en memoria +
firma local), `device` exige I/O por mascota o un método por lote nuevo en el
puerto — es decir, un cambio de contrato de `PetDeviceReader` y de su
implementación Drizzle, con su spec — para servir un dato que ningún consumidor
del listado usa y cuya señal principal está rota. R4(b) lo congela con una
guarda de fuente para que un "ya que estamos" futuro no lo cuele sin spec.
Upgrade path nombrado: `findActiveDevices(petIds: string[]): Promise<Map<string, ActivePetDeviceStatus>>`
con `inArray(petDevices.petId, petIds)` — una consulta — como feature propia.

### D5 — El cliente móvil no cambia (criterio 4 y 5)

Verificado en `mobile-pet-tracker/`:

- `src/api/types.ts:52-77` — `PetProfile.photoUrl: string | null`. El listado
  y el detalle comparten el tipo (`api/pets.ts:5` y `:12`). Rellenar el valor
  es aditivo: **ningún cambio de tipo**. `files_affected` de #66 lista
  `types.ts` como pista; esta spec concluye que no se toca.
- `src/components/pet-switcher.tsx:38-42` — ya hace
  `pet.photoUrl ? <Avatar.Image source={{ uri: pet.photoUrl }} /> : null`
  sobre los elementos de `listPets`. Ese es el consumidor que se destraba.
- `src/components/__tests__/pet-switcher.test.tsx:44-65` — ya prueba que un
  `photoUrl` no nulo renderiza la imagen con esa `uri`.
- Los fixtures con `photoUrl: null` (`home.test.tsx:73`, `food.test.tsx:88`,
  `map.test.tsx:126`, `health.test.tsx:106`, `pets.test.ts:29,180`, etc.)
  siguen siendo respuestas válidas: `null` sigue significando "sin foto".

Cómo se verifica sin que el backend escriba un test de móvil:
`init.config.sh` `TEST_CMD` ya incluye `bun run --cwd mobile-pet-tracker test`,
así que `./init.sh` verde **es** la prueba de compatibilidad, y
`git diff --name-only <base>..HEAD -- mobile-pet-tracker/` vacío es la prueba
de que no hubo cambio (lo comprueba el `reviewer`, ver [[traceability]]).

Efecto visible en la app tras desplegar el backend, sin tocar UI: los chips
del selector de mascotas pasan de inicial a foto. Es el habilitador del
Bloque 1 (#67 y el hero de la Home).

### D6 — Cómo se prueba (R1-R4)

- **Unitario del use case** (R1, R4): mismo patrón que
  `get-pet.use-case.spec.ts:34-56` — `pets = { findAllByMember } as unknown as
  PetRepository` y `photoUrlResolver: PetPhotoUrlResolver = { resolveDownloadUrl }`.
  El `buildPet(id, name)` que ya existe en `list-pets.use-case.spec.ts:10-31`
  gana un tercer parámetro opcional `photoKey: string | null = null`.
- **Unitario del controller** (R2): el `buildController()` de
  `pets.controller.spec.ts:41-70` ya inyecta `listExecute` como `jest.fn()`;
  basta `mockResolvedValue` con items que lleven `photoUrl`.
- **e2e** (R3): en `test/pets.e2e-spec.ts`, con los helpers `seedUser`,
  `createPetViaApi` y el `db` (`NodePgDatabase`) que el `beforeAll` ya
  obtiene. La siembra de `photo_key` es un `db.update(pets)` directo: no hay
  que subir bytes a LocalStack para probar que se firma (ver R3 en
  [[requirements]]).
- **Guarda de fuente** (R4b): `readFileSync` + aserción de longitud, patrón
  de #29 R8 y #28 R11.

## Archivos afectados

### Modificados — application

- `src/modules/pets/application/use-cases/list-pets.use-case.ts` — inyecta
  `PET_PHOTO_URL_RESOLVER`, exporta `PetListItem`, resuelve `photoUrl` en
  `Promise.all`, actualiza su JSDoc (R1, R4).

### Modificados — infrastructure

- `src/modules/pets/infrastructure/pets.controller.ts` — `list()` pasa
  `photoUrl` al mapper (`null` explícito como `device`). Nada más del
  archivo cambia (R2).

### Modificados — tests

- `src/modules/pets/application/use-cases/list-pets.use-case.spec.ts` — dos
  describes nuevos (R1, R4) **y la edición declarada de los dos `it` del
  describe `R7:` de #5** (ver inventario de riesgo).
- `src/modules/pets/infrastructure/pets.controller.spec.ts` — un describe
  nuevo (R2). Los existentes no se tocan.
- `test/pets.e2e-spec.ts` — un describe nuevo (R3). Los existentes no se
  tocan.

### No se tocan (verificable con `git diff --name-only`)

- `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts`
  (+ `.spec.ts`) — R2 lo congela.
- `src/modules/pets/application/use-cases/get-pet.use-case.ts` (+ `.spec.ts`)
  — D3 solo importa de él.
- `src/modules/pets/domain/repositories/pet.repository.ts`,
  `src/modules/pets/infrastructure/repositories/pet.drizzle.repository.ts`
  — R4.
- `src/modules/pets/domain/ports/pet-photo-url-resolver.ts`,
  `src/modules/pets/domain/ports/pet-device-reader.ts`,
  `src/modules/pets/domain/ports/pet-vaccine-reader.ts`.
- `src/modules/media/**` (resolver, adaptador, `pet-photo-read.module.ts`).
- `src/modules/pets/pets.module.ts` — la inyección ya se resuelve.
- `src/db/schema/**`, migraciones, `.env.example`, `infra/`.
- **`mobile-pet-tracker/**`** — D5.

## Inventario de riesgo — qué tests existentes podría romper esto

Auditado el 2026-09-05 sobre `chore/design-gap-backlog` (base de la branch).

| Test existente | ¿Afectado? | Por qué |
|---|---|---|
| `list-pets.use-case.spec.ts:33-63` — describe `R7:` de #5, dos `it` | **Sí — se editan, declarado** | (1) `new ListPetsUseCase(repo)` con un solo argumento deja de compilar (ts-jest) al añadir el segundo parámetro; (2) `expect(result).toEqual(memberships)` falla porque cada item gana `photoUrl: null` (`toEqual` ignora `undefined`, no `null`). Edición mínima: pasar un resolver stub y asertar `result` contra `memberships.map((m) => ({ ...m, photoUrl: null }))`. El **enunciado** de R7 de #5 ("solo membresías activas") no cambia; cambia la forma del item. |
| `pets.controller.spec.ts:110-128` — describe `R7:` de #5 | **No** | `listExecute` resuelve `[{ pet, role: 'family' }]` sin `photoUrl` → el destructuring da `undefined` → el parámetro por defecto del mapper (`photoUrl = null`) aplica. Verde sin editar. |
| `pets.controller.spec.ts` resto (R2, R8, R12, R6, R9, R13, R14, R16, R4) | **No** | No pasan por `list()`. |
| `pet-profile-response.mapper.spec.ts` | **No** | El mapper no cambia (R2). |
| `get-pet.use-case.spec.ts` | **No** | `GetPetUseCase` no cambia. |
| `test/pets.e2e-spec.ts` R7 (`:303-343`) | **No** | Asevera ids y `myRole`, nunca `photoUrl`. Las mascotas de esos `it` se crean sin foto. |
| `test/pets.e2e-spec.ts` R8 (`:345-367`) | **No** | Es el detalle. |
| `test/media.e2e-spec.ts` | **No** | Solo `GET /v1/pets/:petId` y el upload. |
| Resto de e2e (`health-*`, `nutrition`, `reminders`, `positions`, …) que llaman `GET /v1/pets` | **No** | Ninguna siembra `photo_key`; reciben `photoUrl: null` como hoy (verificado con `grep -rn "photoUrl" test/` → solo `pets.e2e-spec.ts` y `media.e2e-spec.ts`). |
| `mobile-pet-tracker/**` (jest-expo) | **No** | Fixtures con `photoUrl: null` siguen válidos; `pet-switcher.test.tsx` ya cubre el caso no nulo. Corren en `TEST_CMD` de `init.sh`. |

Un solo test existente cambia de resultado, y está declarado por adelantado
con su motivo (lección de #27 R9(f) y #28).

## Alternativas descartadas

- **`?include=photo`** — ver D1. Añade un DTO zod, dos ramas y un cambio en
  `api/pets.ts` del móvil para ahorrar microsegundos de CPU.
- **Caché de URLs firmadas** — ver D1. Estado + TTL + invalidación para
  cachear una operación local más barata que la propia caché.
- **Resolver `photoUrl` en el controller** (inyectar el puerto en
  `PetsController`). Rompe la regla de capas: la infraestructura HTTP
  orquestaría puertos de dominio; y duplicaría en el controller la condición
  `photoKey !== null` que ya vive en application (`get-pet.use-case.ts:60`).
- **Añadir `photoUrl` a `PetWithRole` y firmar en `PetDrizzleRepository`**.
  El repositorio conocería S3; la persistencia no firma URLs. Además obligaría
  a inyectar `PHOTO_STORAGE` en el repositorio de pets, cruzando módulos.
- **Un `ListPetsWithPhotosUseCase` nuevo** dejando el actual intacto. Dos use
  cases para una ruta; el controller tendría que elegir. El existente cambia
  de forma de retorno igualmente en cuanto se usa. C7 lo dejaría huérfano.
- **Firmar secuencialmente (`for … of`)** en vez de `Promise.all`. Mismo coste
  (CPU), más líneas, y no aporta orden que `Promise.all` no dé ya.
- **Enriquecer `device` con N `findActiveDevice`** — ver D4: N+1 real en
  Postgres.
- **Enriquecer `device` con un método por lote nuevo** — ver D4: cambio de
  contrato de un puerto de otra feature para un consumidor que no existe.
- **Mover `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS` al puerto** — ver D3.
- **Firmar con `signingDate` redondeada a la hora** para URLs estables y
  caché de cliente efectiva. Es la mejora real si la transferencia de S3
  llega a pesar (OD-4), pero toca `PhotoStorageS3Adapter` (de #6) y el
  detalle, y ningún criterio de #66 la pide. Se registra como upgrade path.
