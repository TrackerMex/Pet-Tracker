---
feature: "media-docs-api"
status: approved
tags: [harness, spec, backend]
---

# Diseño — [[media-docs-api]]

> Ver [[requirements]] (R1–R4) y `docs/architecture.md` para las capas.
> Feature 100% backend; nace de la decisión Q1 del gate de #40. Patrón de
> spec: #47 reminders-api.

## Decisiones técnicas

- **D1 — El contrato del GET lo fija el móvil, campo a campo** (verificado
  2026-08-25 contra `mobile-pet-tracker/src/api/media.ts`,
  `src/api/__tests__/media.test.ts` y `src/screens/docs/index.tsx`):
  - URL exacta que dispara el cliente:
    `GET <EXPO_PUBLIC_API_URL>/v1/pets/<petId>/media` con header
    `Authorization: Bearer <jwt>` (`listPetDocs` → `getJson`).
  - Respuesta 200: **array JSON en la raíz** — `Array.isArray(body)` es la
    primera comprobación del cliente; un envoltorio `{docs: [...]}` rompe
    la pantalla con `kind: 'error'`.
  - Cada elemento pasa `isPetDocument`: `id: string`, `type: string`,
    `name: string`, `date: string` — los 4 obligatorios y de tipo string.
    Campos extra se toleran (el guard no los mira). La interfaz móvil
    declara además `vet?: string | null`.
  - Render (`DocsScreen`): `type` se pinta tal cual en mayúsculas CSS
    (ej. 'Vacunación'), `name` tal cual, `date` **cruda sin formatear**
    (el fake del test muestra '2026-07-12') → el backend devuelve
    `YYYY-MM-DD`, no ISO datetime. `id` alimenta `key` de React y
    `testID="doc-<id>"`.
  - Mapeo de status del cliente: 401 → unauthorized, 403 → forbidden,
    404 → not-found, resto ≠200 → error. El 404 de no-miembro ya lo da
    `PetAccessGuard`; no hay que fabricar nada.

  `PetDocumentResponse` queda: `{id: string, type: string, name: string,
  date: string ('YYYY-MM-DD'), vet: string | null, key: string}`. `vet`
  viaja siempre (null si no se dio); `key` va porque la descripción de la
  feature lo lista y costará una feature de descarga después — el móvil lo
  ignora hoy. Sirve a R1, R2, R3.

- **D2 — Roles**: GET para cualquier miembro activo (sin
  `@RequirePetRole`, como los GET de nutrition y el GET de reminders R1 de
  #47); POST solo `owner` (`@RequirePetRole('owner')`), mismo criterio que
  photo-upload-url (D1 de #6). No-miembro/mascota inexistente/`:petId`
  malformado → 404 genérico del guard en ambos. Sirve a R1, R2.

- **D3 — El POST persiste al emitir la URL** (misma semántica que
  `photoKey` en #6): la fila de `pet_documents` se inserta en el POST y el
  documento "existe" desde ese momento, suba o no los bytes el cliente.
  Sin endpoint de confirmación, sin estados, sin verificación de objeto al
  listar. Sirve a R2, R3.
  <!-- ponytail: fila huérfana posible si el PUT nunca ocurre; endpoint de
       confirmación o barrido si alguna vez importa. -->

- **D4 — Reuso íntegro del storage existente**: se inyecta el
  `PHOTO_STORAGE` que `PetPhotoReadModule` ya exporta (y `MediaModule` ya
  importa) — cero adapters nuevos, cero clientes S3 nuevos, cero config
  nueva. La firma PUT no fija `Content-Type` (D3 de #6): un documento
  genérico (PDF, imagen, lo que sea) sube con el content-type que declare
  el cliente, por eso el body del POST no pide `contentType` — una
  whitelist de tipos de documento sería arbitraria y no la consume nadie.
  Expiración: constante propia
  `DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS = 600` (mismo valor que la foto,
  knob independiente). LocalStack vía `S3_CLIENT` global (`AWS_MODE=local`
  → `AWS_ENDPOINT_URL`); ningún recurso AWS real. Sirve a R2, R3.

- **D5 — Tabla nueva `pet_documents`** en `src/db/schema/media.schema.ts`
  (+ re-export en `index.ts`, migración con `pnpm run db:generate`):

  | Columna | Tipo Drizzle | Nota |
  |---|---|---|
  | `id` | `uuid('id').primaryKey()` | uuidv7 generado en el use case (D7) |
  | `petId` | `uuid('pet_id').notNull().references(() => pets.id, { onDelete: 'cascade' })` | como `reminders.pet_id` |
  | `type` | `varchar('type', { length: 40 }).notNull()` | string libre ('Vacunación', 'Consulta') — el móvil lo pinta tal cual, un enum rompería al primer tipo nuevo |
  | `name` | `varchar('name', { length: 120 }).notNull()` | como `vaccines.name` |
  | `date` | `date('date').notNull()` | pg `date`; Drizzle lo lee como string `YYYY-MM-DD` — exactamente lo que el móvil muestra (D1), sin formatear |
  | `vet` | `varchar('vet', { length: 120 })` | nullable; espejo de `vaccines.vet_name` |
  | `key` | `text('key').notNull()` | clave S3; como `pets.photo_key` |
  | `createdBy` | `uuid('created_by').notNull().references(() => users.id)` | como `reminders.created_by` |

  Índice: `index('pet_documents_pet_id_idx').on(table.petId)`. Sin
  `createdAt`: uuidv7 ya ordena temporalmente y el orden del listado es
  por `date`. Orden del listado: `orderBy(desc(petDocuments.date),
  desc(petDocuments.id))` — determinista. Sirve a R1, R2.

- **D6 — DTO zod del POST** (`application/dto/create-pet-document.dto.ts`):

  ```ts
  import { IsoDateSchema } from '@/modules/health/application/dto/iso-date';

  export const CreatePetDocumentSchema = z.object({
    type: z.string().trim().min(1).max(40),
    name: z.string().trim().min(1).max(120),
    date: IsoDateSchema,          // 'YYYY-MM-DD' real, reuso de health
    vet: z.string().trim().min(1).max(120).optional(),
  });
  export type CreatePetDocumentDto = z.infer<typeof CreatePetDocumentSchema>;
  ```

  `IsoDateSchema` se reutiliza de health (ya valida calendario real, no
  solo el formato); sin restricción "no futuro" — un documento puede
  fecharse a futuro (próxima cita). `vet` ausente → `null` en la fila y en
  la respuesta. Sirve a R2.

- **D7 — Firmas exactas** (para el handoff a Codex; todo bajo
  `src/modules/media/` salvo indicación):

  ```ts
  // domain/entities/pet-document.entity.ts (nuevo)
  export interface PetDocument {
    id: string;
    petId: string;
    type: string;
    name: string;
    date: string;        // 'YYYY-MM-DD'
    vet: string | null;
    key: string;
    createdBy: string;
  }

  // domain/document-key.ts (nuevo; función pura, hermana de photo-key.ts)
  export function buildDocumentKey(petId: string, documentId: string): string {
    return `pets/${petId}/docs/${documentId}`;
  }

  // domain/repositories/pet-document.repository.ts (nuevo)
  export const PET_DOCUMENT_REPOSITORY = Symbol('PetDocumentRepository');
  export interface PetDocumentRepository {
    create(document: PetDocument): Promise<void>;
    listByPet(petId: string): Promise<PetDocument[]>;  // date desc, id desc
  }

  // application/use-cases/list-pet-documents.use-case.ts (nuevo)
  @Injectable()
  export class ListPetDocumentsUseCase {
    constructor(@Inject(PET_DOCUMENT_REPOSITORY) private readonly documents: PetDocumentRepository) {}
    execute(petId: string): Promise<PetDocument[]>;    // delega en listByPet
  }

  // application/use-cases/create-pet-document.use-case.ts (nuevo)
  export const DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS = 600;
  export interface PetDocumentUpload {
    document: PetDocument;
    uploadUrl: string;
    expiresInSeconds: number;
  }
  @Injectable()
  export class CreatePetDocumentUseCase {
    constructor(
      @Inject(PET_DOCUMENT_REPOSITORY) private readonly documents: PetDocumentRepository,
      @Inject(PHOTO_STORAGE) private readonly storage: PhotoStorage,
      @Inject(AUDIT_LOGGER) private readonly auditLogger: AuditLogger,
    ) {}
    async execute(petId: string, userId: string, dto: CreatePetDocumentDto): Promise<PetDocumentUpload>;
    // id = uuidv7(); key = buildDocumentKey(petId, id);
    // documents.create({id, petId, ...dto, vet: dto.vet ?? null, key, createdBy: userId});
    // uploadUrl = storage.createUploadUrl(key, DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS);
    // audit SOLO tras éxito: {userId, action: 'pet.document_add', entity: 'pet', entityId: petId, meta: {key}}
  }

  // infrastructure/mappers/pet-document.mapper.ts (nuevo)
  export interface PetDocumentResponse {
    id: string; type: string; name: string; date: string;
    vet: string | null; key: string;
  }
  export function toPetDocumentResponse(document: PetDocument): PetDocumentResponse;
  // omite petId y createdBy

  // infrastructure/repositories/pet-document.drizzle.repository.ts (nuevo)
  @Injectable()
  export class PetDocumentDrizzleRepository implements PetDocumentRepository { /* DRIZZLE inject */ }

  // infrastructure/pet-media.controller.ts (nuevo)
  @Controller('pets/:petId/media')
  @UseGuards(PetAccessGuard)
  export class PetMediaController {
    // constructor: ListPetDocumentsUseCase + CreatePetDocumentUseCase

    @Get()   // sin @RequirePetRole (D2)
    async list(@Req() request: PetAccessRequest): Promise<PetDocumentResponse[]>;
    // → (await this.listPetDocuments.execute(request.petMembership.petId)).map(toPetDocumentResponse)

    @Post()  // 201 por defecto de Nest — sí se crea un recurso, a diferencia de photo-upload-url
    @RequirePetRole('owner')
    async create(@Req() request: PetAccessRequest, @Body() body: unknown):
      Promise<{ document: PetDocumentResponse; uploadUrl: string; expiresInSeconds: number }>;
    // parseBody<CreatePetDocumentDto>(CreatePetDocumentSchema, body) — helper
    // local duplicado del patrón media.controller.ts/pets.controller.ts
  }
  ```

  `media.module.ts` añade `PetMediaController` a `controllers` y
  `ListPetDocumentsUseCase`, `CreatePetDocumentUseCase`,
  `{ provide: PET_DOCUMENT_REPOSITORY, useClass: PetDocumentDrizzleRepository }`
  a `providers`. Sus dependencias ya resuelven: `PetsModule` (guard) y
  `PetPhotoReadModule` (PHOTO_STORAGE) ya están importados; `DRIZZLE`,
  `S3_CLIENT` y `AUDIT_LOGGER` son globales.

## Archivos afectados

Todo en `backend-pet-tracker/`, capas indicadas:

- `src/db/schema/media.schema.ts` — nuevo, tabla `pet_documents` (infra
  compartida Drizzle, D5).
- `src/db/schema/index.ts` — una línea: `export * from './media.schema';`.
- `src/db/migrations/00XX_*.sql` — generada por `pnpm run db:generate`.
- `src/modules/media/domain/entities/pet-document.entity.ts` — nuevo (domain).
- `src/modules/media/domain/document-key.ts` + `document-key.spec.ts` — nuevos (domain).
- `src/modules/media/domain/repositories/pet-document.repository.ts` — nuevo (domain).
- `src/modules/media/application/dto/create-pet-document.dto.ts` +
  `.spec.ts` — nuevos (application).
- `src/modules/media/application/use-cases/list-pet-documents.use-case.ts`
  + `.spec.ts` — nuevos (application).
- `src/modules/media/application/use-cases/create-pet-document.use-case.ts`
  + `.spec.ts` — nuevos (application).
- `src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts`
  — nuevo (infrastructure).
- `src/modules/media/infrastructure/mappers/pet-document.mapper.ts` — nuevo
  (infrastructure).
- `src/modules/media/infrastructure/pet-media.controller.ts` — nuevo
  (infrastructure).
- `src/modules/media/media.module.ts` — registra controller + providers.
- `test/media-docs.e2e-spec.ts` — nuevo, casos R1/R2/R3 (arnés de seed
  igual a `media.e2e-spec.ts`; NO se toca ese archivo).

## Alternativas descartadas

- **Envolver la respuesta del GET (`{docs: [...]}`)**: el cliente móvil ya
  desplegado exige array en la raíz — romperlo invalida #40 (D1).
- **`POST /pets/:petId/media/upload-url` sin persistir (URL suelta como la
  foto)**: la foto persiste `photoKey` en `pets`; aquí el documento ES la
  fila — sin persistencia en el POST el listado nunca vería nada (D3).
- **Endpoint de confirmación de subida / estados pending-uploaded**:
  YAGNI; la foto de perfil vive con la misma semántica desde #6 (D3).
- **`contentType` en el body + whitelist**: la firma no lo usa (D3 de #6)
  y para documentos genéricos la whitelist es arbitraria (D4).
- **Enum de `type`**: el móvil pinta el string tal cual; un enum obliga a
  migración por cada tipo nuevo sin ganar nada (D5).
- **Generar el id en el repositorio (patrón reminders)**: la `key` S3 debe
  contener el id del documento; generarlo en el use case (uuidv7) evita un
  segundo viaje o una clave por epoch con riesgo de colisión (D7).
- **Extender `MediaController` existente**: su `@Controller` está anclado
  a la ruta `photo-upload-url`; un controller nuevo por ruta mantiene R4
  (cero cambios en lo existente) trivialmente verificable.
- **Reutilizar `PHOTO_UPLOAD_URL_EXPIRES_IN_SECONDS`**: acopla la
  expiración de documentos a la de fotos; una constante propia cuesta una
  línea (D4).
