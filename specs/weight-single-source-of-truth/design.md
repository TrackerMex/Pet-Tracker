---
feature: "weight-single-source-of-truth"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[weight-single-source-of-truth]]

> Ver [[requirements]] y [[../../docs/architecture|architecture]].
>
> Esta spec está escrita para ser **autosuficiente**: quien implemente
> (Codex CLI) no tiene acceso a la conversación que la originó. Toda ruta,
> símbolo y assertion de test que aparece aquí es literal.

## Decisión de fondo: eliminar los escritores, no sumar uno más

`feature_list.json` #22 planteaba dos caminos: (a) que `weightKg` deje de
aceptarse en `POST`/`PATCH /v1/pets`, o (b) que los use-cases de `pets`
inserten también una fila en `weights`. Se elige **(a)**:

1. **(b) crea una dependencia circular de módulos.** `HealthModule` ya
   importa `PetsModule` (`health.module.ts:6,25`, para que
   `PetAccessGuard` resuelva `PET_REPOSITORY`). Si `PetsModule` necesitara
   `WEIGHT_REPOSITORY` de `HealthModule` para insertar filas de `weights`
   desde `create-pet.use-case.ts`/`update-pet.use-case.ts`, el grafo de
   imports de Nest se vuelve circular (`Pets → Health → Pets`). Resolverlo
   con `forwardRef()` es exactamente el tipo de andamiaje que
   `docs/architecture.md` pide evitar cuando hay una alternativa más
   simple.
2. **(b) duplica la lógica transaccional de D4/D7 de `health-weights`** (el
   `UPDATE` condicional "solo si es la medición más reciente", dentro de la
   misma transacción que el `INSERT`) en dos lugares más
   (`create-pet.use-case.ts`, `update-pet.use-case.ts`). Cada copia es una
   oportunidad de que diverja.
3. **(a) es literalmente la feature**: "weight-single-source-of-truth"
   significa que solo hay un lugar en el código que escribe
   `pets.current_weight_kg` —
   `WeightDrizzleRepository.create()` (`health-weights` #15, ya en `main`).
   Eliminar los otros dos escritores logra eso sin tocar ese archivo.
4. El costo de (a) — dar de alta una mascota con peso conocido requiere dos
   llamadas en vez de una — se acepta explícitamente (ver
   [[requirements]] §Fuera de alcance).

## D1 — `weightKg` se ignora en silencio, no se rechaza con 400

`PetFieldsSchema` (`create-pet.dto.ts:21-33`) es `z.object({...})`, **no**
`z.strictObject`: hoy, cualquier clave no listada en el schema ya se
descarta sin error para `POST`/`PATCH /v1/pets`. Esto está probado en
`update-pet.dto.spec.ts:24-29`
(`"descarta claves no reconocidas (quedan fuera del no-op de R15)"`, que
verifica `UpdatePetSchema.safeParse({ unknownField: 1 })` → `success: true`,
`data: {}`). Quitar `weightKg` del schema hace que caiga exactamente en ese
mismo camino ya probado — no se introduce ninguna rama nueva de validación.

Se descartó hacer el schema estricto para rechazar `weightKg` con `400`
porque introduciría una asimetría: todo el resto de claves desconocidas
seguiría aceptándose en silencio, y esta única excepción no tiene
justificación de negocio (el cliente que todavía envía `weightKg` por
inercia no está haciendo nada "inválido", solo está enviando un campo que
ya no tiene efecto).

## D2 — Capas afectadas y símbolos exactos a modificar

### `application/dto` (pets)

- `backend-pet-tracker/src/modules/pets/application/dto/create-pet.dto.ts`:
  quitar la línea `weightKg: z.number().gt(0).lte(999.99).optional(),` de
  `PetFieldsSchema`. `UpdatePetSchema` la pierde automáticamente por
  heredar de `PetFieldsSchema.partial()` — **no se toca
  `update-pet.dto.ts`**.

### `application/use-cases` (pets)

- `backend-pet-tracker/src/modules/pets/application/use-cases/create-pet.use-case.ts`:
  `CreatePetDto` deja de tener `weightKg` (por el cambio de schema), así
  que la función `toNewPet()` ya no necesita desestructurarlo ni
  condicionar `currentWeightKg`:
  ```
  function toNewPet(dto: CreatePetDto): NewPet {
    return dto;
  }
  ```
  (o, si `NewPet` y `CreatePetDto` terminan siendo estructuralmente
  idénticos, eliminar `toNewPet()` y pasar `dto` directo a
  `createWithOwner()` — a discreción de quien implemente, siempre que
  `NewPet` ya no tenga `currentWeightKg`, ver más abajo).

- `backend-pet-tracker/src/modules/pets/application/use-cases/update-pet.use-case.ts`:
  `toFieldChanges()` pierde toda la rama de `weightKg`/`currentWeightKg`:
  ```
  function toFieldChanges(dto: UpdatePetDto): PetFieldChanges {
    const changes: PetFieldChanges = { ...dto };

    if (dto.birthDate !== undefined) {
      changes.approxAgeMonths = null;
    } else if (dto.approxAgeMonths !== undefined) {
      changes.birthDate = null;
    }

    return changes;
  }
  ```

### `domain/repositories` (pets)

- `backend-pet-tracker/src/modules/pets/domain/repositories/pet.repository.ts`:
  quitar `currentWeightKg?: number;` de la interface `NewPet` (líneas
  13-25) y quitar `currentWeightKg?: number;` de la interface
  `PetFieldChanges` (líneas 65-79). `pet.entity.ts` **no se toca**: `Pet`
  sigue exponiendo `currentWeightKg: number | null` como campo de
  **lectura** — sigue siendo la proyección que `GET` devuelve (R6); solo
  deja de ser un campo de **escritura** desde `pets`.

### `infrastructure/repositories` (pets)

- `backend-pet-tracker/src/modules/pets/infrastructure/repositories/pet.drizzle.repository.ts`:
  - `createWithOwner()`: quitar la línea
    `currentWeightKg: toWeightColumn(data.currentWeightKg),` del `.values({...})`
    del `INSERT` en `pets` (la columna queda en su default `NULL`, no hace
    falta escribir nada). Quitar la función `toWeightColumn()` (líneas
    137-140) — queda sin ningún caller.
  - `update()`: simplifica el `.set({...})`, que hoy separa `currentWeightKg`
    del resto de `changes` para convertirlo a `String(...)`
    (líneas 114-129). Al no existir ya esa clave en `PetFieldChanges`, pasa
    a:
    ```
    async update(petId: string, changes: PetFieldChanges): Promise<Pet> {
      const [row] = await this.db
        .update(pets)
        .set({ ...changes, updatedAt: new Date() })
        .where(eq(pets.id, petId))
        .returning();

      return toDomain(row);
    }
    ```
  - `toDomain()` **no se toca**: sigue leyendo
    `row.currentWeightKg == null ? null : Number(row.currentWeightKg)` — la
    lectura de la columna es responsabilidad de R6, sin cambios.

## D3 — Riesgo sobre tests existentes (barrido completo, no solo el trío citado por #22)

`feature_list.json` #22 cita "los tres tests de #5" apoyándose en el
inventario de `specs/health-weights/design.md` §Riesgo, escrito antes de
decidir esta feature. Un barrido completo (`grep -r weightKg`) encuentra
**nueve** ubicaciones en seis archivos, no tres. Todas SHALL quedar
actualizadas, ninguna borrada del todo — la disciplina TDD normal (test
rojo → implementación → verde) aplica igual a un test que cambia de
comportamiento esperado que a uno nuevo.

| # | Archivo | Qué decía antes | Qué debe decir después |
|---|---|---|---|
| 1 | `src/modules/pets/application/dto/create-pet.dto.spec.ts:33-46` ("acepta la ficha completa") | Incluía `weightKg: 25.5` entre los opcionales válidos | Quitar la línea `weightKg: 25.5,` del objeto — el resto del test (los demás opcionales) sigue igual |
| 2 | `src/modules/pets/application/dto/create-pet.dto.spec.ts:49-68` (rechaza cada campo inválido) | 3 casos `it.each`: `weightKg` cero / negativo / por encima de `999.99` → esperaban `success: false` | Quitar esos 3 casos del arreglo `it.each` (ya no aplican: el campo no existe). Añadir un test nuevo en el mismo `describe`: `it('ignora weightKg si viene en el body (R1 #22)', () => { const result = CreatePetSchema.safeParse(validBody({ weightKg: -1 })); expect(result.success).toBe(true); expect(result.success && 'weightKg' in result.data).toBe(false); })` |
| 3 | `src/modules/pets/application/dto/update-pet.dto.spec.ts:3-11` (acepta subconjuntos válidos) | Caso `it.each` `['solo weightKg', { weightKg: 12.25 }]` → esperaba `success: true` | Quitar ese caso del arreglo (sigue dando `true`, pero por la razón equivocada — ya no es "acepta weightKg", es "lo descarta") |
| 4 | `src/modules/pets/application/dto/update-pet.dto.spec.ts:13-22` (rechaza cada campo inválido) | Caso `it.each` `['weightKg cero', { weightKg: 0 }]` → esperaba `success: false` | Quitar ese caso (rompería: `{weightKg:0}` ahora parsea a `{}`, `success: true`). El test ya existente en el mismo archivo, línea 24-29 (`'descarta claves no reconocidas'`), ya cubre genéricamente este comportamiento — opcionalmente añadir `weightKg` a su `it.each` si se prefiere nombrarlo explícito, no es obligatorio |
| 5 | `src/modules/pets/application/use-cases/create-pet.use-case.spec.ts:33-40` (`buildDto()`) | `weightKg: 25.5` en el DTO de prueba | Quitar la línea `weightKg: 25.5,`. `CreatePetDto` deja de tener esa propiedad — dejarla es un error de compilación TS (excess property en objeto literal) |
| 6 | `src/modules/pets/application/use-cases/create-pet.use-case.spec.ts:61-79` (R2, "delega en createWithOwner...") | Esperaba `createWithOwner` llamado con `{..., currentWeightKg: 25.5}` | Quitar `currentWeightKg: 25.5,` del objeto esperado en `toHaveBeenCalledWith` |
| 7 | `src/modules/pets/application/use-cases/update-pet.use-case.spec.ts:43-55` (R13, "pasa al repositorio solo lo enviado, con weightKg mapeado") | `execute(PET_ID, USER_ID, { name: 'Firu', weightKg: 12.5 })` → esperaba `update` llamado con `{ name: 'Firu', currentWeightKg: 12.5 }` | Quitar `weightKg: 12.5` del input y `currentWeightKg: 12.5` del esperado: `execute(PET_ID, USER_ID, { name: 'Firu' })` → `update` llamado con `{ name: 'Firu' }`. Renombrar el `it(...)` para quitar "con weightKg mapeado" |
| 8 | `src/modules/pets/application/use-cases/update-pet.use-case.spec.ts:83-98` (R15, "audita pet.update con nombres de campos") | `execute(PET_ID, USER_ID, { name: 'Firu', weightKg: 12.5 })` → esperaba `meta: { fields: ['name', 'weightKg'] }` | Quitar `weightKg: 12.5` del input; `meta: { fields: ['name'] }` |
| 9 | `src/modules/pets/infrastructure/repositories/pet.drizzle.repository.spec.ts:11-18` (`buildNewPet()`) | `currentWeightKg: 25.5` en el `NewPet` de prueba | Quitar la línea — `NewPet` ya no tiene esa propiedad |
| 10 | `src/modules/pets/infrastructure/repositories/pet.drizzle.repository.spec.ts:120-128` ("convierte weightKg a string...") | Esperaba `captured.petInsert?.currentWeightKg` === `'25.5'` | Reemplazar por un test que pruebe lo contrario: `it('no envia current_weight_kg al insertar pets (R1 #22)', async () => { const { db, captured } = buildTransactionDbDouble(); const repository = new PetDrizzleRepository(db); await repository.createWithOwner(buildNewPet(), OWNER_ID); expect(captured.petInsert).not.toHaveProperty('currentWeightKg'); })` |
| 11 | `test/pets.e2e-spec.ts:484-507` (R13, "persiste el subconjunto enviado...") | Creaba la mascota con `weightKg: 20`, hacía `PATCH {..., weightKg: 22.5}`, esperaba `body.currentWeightKg === 22.5` | Quitar `weightKg: 20` del `createPetViaApi` y `weightKg: 22.5` del `PATCH` — sustituir por un campo editable real, p. ej. `color: 'golden'`, para seguir probando "el PATCH persiste el subconjunto enviado". Esperar `body.currentWeightKg` **`toBeNull()`** (nunca se escribió) y `body.color` `toBe('golden')`. Añadir en el mismo `describe` un caso nuevo: `it('PATCH con weightKg es un no-op sobre current_weight_kg (R2 #22)', async () => { ... PATCH { weightKg: 99 } ... expect(response.status).toBe(200); expect(profileBody(response).currentWeightKg).toBeNull(); })` reutilizando una mascota sin peso |
| 12 | `test/pets.e2e-spec.ts:509-524` (R13b, "un campo invalido rechaza el body completo") | `PATCH { name: 'Valid name', weightKg: -5 }` → esperaba `400` | `weightKg: -5` ya no es inválido (se ignora), así que ya no produce `400`. Sustituir por un campo que sí siga siendo inválido tras esta feature, p. ej. `microchip: 'a'.repeat(33)` (mismo límite que `create-pet.dto.spec.ts:61`) |

Filas 1, 3, 5, 9, 11 son ediciones de datos de prueba (quitar una línea) sin
cambio de intención del test. Filas 2, 4, 6, 7, 8, 10, 12 son cambios de
**comportamiento esperado** y necesitan el ciclo rojo→verde completo: el
test editado debe fallar contra el código viejo antes de tocar
`create-pet.dto.ts` / los use-cases / el repositorio, igual que un test
nuevo.

**Nada de esta tabla toca**: `pet.entity.ts`, `pet-profile-response.mapper.ts`,
`pet-profile-response.mapper.spec.ts`, el array `PROFILE_KEYS` en sí (solo
las dos filas 11-12 de arriba, que están en el mismo archivo pero en
`describe` distintos), ni ningún archivo de `health-weights` (#15). Esto
cierra R6.

## D4 — Script de backfill

### Ubicación y forma: sigue el patrón de `seed-vaccines.ts` / `seed-devices.ts`

`backend-pet-tracker/scripts/` ya tiene precedente de scripts standalone de
datos (`seed-devices.ts`, `seed-vaccines.ts`), ejecutados vía
`ts-node -r tsconfig-paths/register`, no vía migración de drizzle-kit (no
hay cambio de DDL que generar). El backfill de R3/R4 sigue exactamente ese
molde en un archivo nuevo:

`backend-pet-tracker/scripts/backfill-weights.ts`:

```typescript
import { config as loadDotenv } from 'dotenv';
import { and, eq, isNull, isNotNull } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { uuidv7 } from 'uuidv7';
import { weights } from '@/db/schema/health.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';

/**
 * Backfill de mascotas dadas de alta antes de weight-single-source-of-truth
 * (#22): copia pets.current_weight_kg a una fila de weights cuando esa
 * mascota no tiene ninguna (R3). Idempotente: una segunda ejecucion no
 * inserta nada porque el LEFT JOIN + isNull ya no encuentra candidatos.
 */
export async function backfillWeights(db: NodePgDatabase): Promise<number> {
  const candidates = await db
    .select({
      petId: pets.id,
      weightKg: pets.currentWeightKg,
      createdAt: pets.createdAt,
      ownerId: petUsers.userId,
    })
    .from(pets)
    .innerJoin(
      petUsers,
      and(
        eq(petUsers.petId, pets.id),
        eq(petUsers.role, 'owner'),
        eq(petUsers.status, 'active'),
      ),
    )
    .leftJoin(weights, eq(weights.petId, pets.id))
    .where(and(isNotNull(pets.currentWeightKg), isNull(weights.id)));

  if (candidates.length === 0) {
    return 0;
  }

  await db.insert(weights).values(
    candidates.map((row) => ({
      id: uuidv7(),
      petId: row.petId,
      weightKg: row.weightKg as string,
      bodyCondition: null,
      measuredAt: row.createdAt.toISOString().slice(0, 10),
      createdBy: row.ownerId,
    })),
  );

  return candidates.length;
}

async function main(): Promise<void> {
  loadDotenv({ path: '../.env' });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const count = await backfillWeights(drizzle(pool));
    // eslint-disable-next-line no-console
    console.log(`backfill-weights: ${count} filas insertadas`);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('backfill-weights failed:', error);
    process.exitCode = 1;
  });
}
```

Notas de diseño:

- **`LEFT JOIN weights` + `isNull(weights.id)`** en vez de una subconsulta
  `NOT EXISTS`: es la forma idiomática en `drizzle-orm` de expresar
  "mascotas sin ninguna fila en `weights`" en una sola consulta, sin N+1.
  Con múltiples filas de `weights` por mascota el `LEFT JOIN` no duplica
  falsos candidatos: si existe **alguna** fila, todas las filas del join
  para esa mascota tienen `weights.id` no nulo y el `WHERE isNull(...)` las
  descarta todas.
- **`innerJoin(petUsers, ...)`** filtra a mascotas con owner activo: es la
  fuente de `created_by` (NOT NULL FK a `users`). Una mascota con
  `current_weight_kg` pero sin owner activo no puede backfillearse sin
  inventar un usuario — se omite (R3, caso IF).
- **`row.weightKg as string`**: `pets.currentWeightKg` es `numeric(5,2)` y
  viaja como string por el driver `pg` (mismo patrón documentado en
  `pet.drizzle.repository.ts` y `specs/health-weights/design.md` D2); se
  reinserta tal cual, sin pasar por `Number()`, para no perder precisión
  ni reintroducir el redondeo que D2 de `health-weights` delega a
  Postgres.
- **Un solo `INSERT` con `.values([...])` (batch)**, no una escritura por
  fila dentro de un loop: menos round-trips, y no hace falta transacción
  explícita porque cada fila insertada es independiente (a diferencia del
  `INSERT`+`UPDATE` de `WeightDrizzleRepository.create()`, aquí no hay
  ningún `UPDATE` de `pets` que deba ir atado, R4).
- `ponytail:` techo conocido — hay una ventana entre el `SELECT` (candidatos)
  y el `INSERT` en la que una escritura concurrente en `weights` para esa
  misma mascota (p. ej. un `POST /v1/pets/:petId/weights` real del usuario)
  podría colar una fila entre medio; el resultado sería una fila de
  backfill "de más" para esa mascota, no una pérdida de datos. Aceptable
  para un script de una sola ejecución manual, no un camino caliente; si
  algún día se ejecuta en paralelo con tráfico real, la subida es envolver
  todo el `SELECT`+`INSERT` en una transacción `SERIALIZABLE`.
- `package.json`: añadir el script
  `"backfill:weights": "ts-node -r tsconfig-paths/register scripts/backfill-weights.ts"`,
  mismo patrón que `seed:vaccines` / `seed:devices`.

### Test del backfill

Nuevo `backend-pet-tracker/test/backfill-weights.e2e-spec.ts`, mismo
bootstrap que `test/health-weights.e2e-spec.ts:88-97`
(`Test.createTestingModule({ imports: [AppModule] })`, `app.get(DRIZZLE)`).
A diferencia de los e2e existentes, las mascotas de este test se siembran
por **inserción directa en `pets`/`pet_users`** (no vía `POST /v1/pets`,
que tras R1 ya no acepta `weightKg`), fijando `current_weight_kg`
directamente en la fila. Importa `backfillWeights` desde
`../scripts/backfill-weights` (ruta relativa: `scripts/` está fuera de
`src/`, el alias `@/` no lo alcanza).

Casos mínimos (R3, R4):

1. Mascota con `current_weight_kg` poblado y cero filas en `weights` → tras
   `backfillWeights(db)`, existe exactamente una fila en `weights` con
   `weightKg` igual al valor original, `measuredAt` igual a la fecha (sin
   hora) de `created_at` de la mascota, `bodyCondition: null` y
   `createdBy` igual al `user_id` de su membresía owner; `current_weight_kg`
   y `updated_at` de la mascota quedan intactos (R4).
2. Mascota con `current_weight_kg: NULL` → no genera ninguna fila.
3. Mascota que ya tiene una fila en `weights` → no genera una fila
   adicional (no duplica).
4. Ejecutar `backfillWeights(db)` dos veces seguidas sobre la misma mascota
   del caso 1 → la segunda llamada devuelve `0` y el conteo de filas en
   `weights` para esa mascota sigue siendo 1 (idempotencia).

## D-alcance-schema — por qué no hay migración nueva

Ni `pets.schema.ts` ni `health.schema.ts` cambian: la columna
`pets.current_weight_kg` sigue siendo `numeric(5,2)` nullable sin default
(sigue siendo la caché de proyección, solo cambia quién puede escribirla) y
la tabla `weights` no gana columnas. `drizzle-kit generate` no produce
ningún archivo nuevo en `src/db/migrations/` para esta feature — el
backfill es una operación de datos (DML), no de schema (DDL), igual que
`seed-vaccines.ts`/`seed-devices.ts` no generan migraciones tampoco.

## Archivos afectados

**Modificados — `application` (pets)**

- `backend-pet-tracker/src/modules/pets/application/dto/create-pet.dto.ts`
- `backend-pet-tracker/src/modules/pets/application/use-cases/create-pet.use-case.ts`
- `backend-pet-tracker/src/modules/pets/application/use-cases/update-pet.use-case.ts`

**Modificados — `domain` (pets)**

- `backend-pet-tracker/src/modules/pets/domain/repositories/pet.repository.ts`

**Modificados — `infrastructure` (pets)**

- `backend-pet-tracker/src/modules/pets/infrastructure/repositories/pet.drizzle.repository.ts`

**Nuevo — script de datos**

- `backend-pet-tracker/scripts/backfill-weights.ts` (D4)
- `backend-pet-tracker/package.json` — añade el script `backfill:weights`

**Tests modificados (D3, tabla completa)**

- `backend-pet-tracker/src/modules/pets/application/dto/create-pet.dto.spec.ts`
- `backend-pet-tracker/src/modules/pets/application/dto/update-pet.dto.spec.ts`
- `backend-pet-tracker/src/modules/pets/application/use-cases/create-pet.use-case.spec.ts`
- `backend-pet-tracker/src/modules/pets/application/use-cases/update-pet.use-case.spec.ts`
- `backend-pet-tracker/src/modules/pets/infrastructure/repositories/pet.drizzle.repository.spec.ts`
- `backend-pet-tracker/test/pets.e2e-spec.ts`

**Tests nuevos**

- `backend-pet-tracker/test/backfill-weights.e2e-spec.ts` (D4)

**Documentación**

- `docs/data-model.md` — filas `pets` y `weights` (R5): anotar el escritor
  único y el backfill.

Sin variables de entorno nuevas, sin dependencias nuevas, sin cambios en
`app.module.ts`, `health.module.ts` ni `pets.module.ts` — esta feature no
añade ningún provider ni controller nuevo, solo elimina código.

## Alternativas descartadas

- **Que los use-cases de `pets` inserten en `weights`** (opción (b) del
  planteamiento de #22): dependencia circular de módulos y duplicación de
  la lógica transaccional D4/D7 de `health-weights` — ver §Decisión de
  fondo.
- **`PetFieldsSchema` estricto (`z.strictObject`) rechazando `weightKg` con
  `400`**: asimetría con el resto de claves desconocidas, que siguen
  aceptándose en silencio (D1).
- **Migración de schema para `pets.current_weight_kg`**: la columna no
  cambia de tipo, nulabilidad ni nombre; no hay nada que migrar a nivel de
  DDL (D-alcance-schema).
- **Backfill como migración de drizzle-kit** (`0012_*.sql` con `INSERT ...
  SELECT`): sin precedente en el repo — las dos operaciones de datos
  existentes (`seed-vaccines.ts`, `seed-devices.ts`) son scripts standalone,
  no migraciones; mezclar DML con el directorio de DDL versionado de
  drizzle-kit rompería esa convención sin necesidad.
- **Backfill fila por fila en un loop con `SELECT` + `INSERT` individuales**:
  N+1 innecesario; el `LEFT JOIN` + batch `INSERT` de D4 hace lo mismo en
  dos queries.
