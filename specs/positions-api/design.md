---
feature: "positions-api"
status: approved   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Diseño — [[positions-api]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

## Decisiones técnicas

- **Módulo nuevo `src/modules/positions/` con las 3 capas, sin tocar `pets`
  ni `devices`** — sirve a R1-R16. La feature es de lectura pura y no comparte
  estado con nadie: un módulo propio (`PositionsModule`) que importa
  `PetsModule` (de donde salen `PetAccessGuard` y `PET_REPOSITORY`, ya
  exportados) y se registra en `AppModule`. Mismo mecanismo de reutilización
  que usó `devices-claim` (#7) — es exactamente para lo que #5 exporta el
  guard.

- **Dos orígenes de datos, dos puertos separados** — sirve a R3, R10. `last`
  lee Postgres y `history` lee DynamoDB; son dos tecnologías y dos ciclos de
  vida distintos, así que el dominio declara **dos** interfaces:
  - `LastPositionReader` (token `LAST_POSITION_READER`) —
    `findLastPosition(petId): Promise<CachedPosition | null>`.
    Implementación Drizzle que hace un `SELECT last_position FROM pets WHERE
    id = $1`. **No** se extiende `PetRepository` (contrato cerrado por la spec
    aprobada de #5) — mismo criterio que aplicó #8 al crear `IngestionStore`
    en vez de ensanchar `DeviceRepository` (D14 de #8).
  - `PositionHistoryReader` (token `POSITION_HISTORY_READER`) —
    `queryPage(params): Promise<{items: StoredPosition[], lastKey: number |
    null}>`. Implementación DynamoDB.
  El caso de uso depende de las interfaces; el reviewer puede comprobar que
  `application/` no importa `@aws-sdk/*` ni `drizzle-orm`.

- **`DynamoDBDocumentClient` propio del módulo (D6)** — sirve a R10. Provider
  `POSITIONS_READ_DOC_CLIENT` (Symbol declarado en
  `infrastructure/positions.constants.ts`) construido con
  `DynamoDBDocumentClient.from(client)` a partir del `DYNAMODB_CLIENT` que
  `AwsModule` (`@Global()`) exporta — la misma técnica que `IngestionModule`,
  pero sin importar `IngestionModule` (arrastraría poller y consumidor a
  cualquier proceso que solo quiera servir HTTP). Los nombres de tabla y
  claves se importan de `@/aws/constants` (`TABLE_POSITIONS`,
  `TABLE_POSITIONS_PARTITION_KEY`, `TABLE_POSITIONS_SORT_KEY`), nunca literales
  nuevos.

- **`staleSeconds` como función pura del dominio** — sirve a R4.
  `domain/stale-seconds.ts`: `staleSeconds(ts: number, now: Date): number` con
  el `max(0, ...)` dentro. El caso de uso recibe el reloj (parámetro `now` con
  default `new Date()`, patrón ya usado por `toPetProfileResponse` de #5), así
  el test fija el instante sin `jest.useFakeTimers()`. Cero dependencia de
  framework: es aritmética.

- **El shape de `pets.last_position` se valida con zod al leerlo** — sirve a
  R3, R5. La columna es `jsonb` y la entidad `Pet` la tipa `unknown` (#5): el
  módulo no puede confiar en su forma. `CachedPositionSchema` (zod, en
  `application/dto/`) parsea el jsonb; `safeParse` fallido ⇒ se trata como
  ausente (200 `null`) + `logger.warn`. Convertir un dato corrupto en un `500`
  dejaría el mapa muerto por un item malo; devolver `null` degrada a "sin
  posición", que la UI ya sabe renderizar.

- **Cursor: codec puro y aislado** — sirve a R13, R14.
  `domain/cursor.ts` con dos funciones puras sin I/O:
  `encodeCursor({petId, from, to, includeSuspect, lastSk}): string` y
  `decodeCursor(raw): DecodedCursor` (lanza `InvalidCursorError` de dominio).
  Formato: `base64url(JSON.stringify({v: 1, p, q, k}))`, donde `q` es la huella
  determinista de la consulta (`${fromMs}:${toMs}:${includeSuspect}`). La
  validación cruzada (`p === petId` de la ruta, `q === huella actual`) vive en
  el caso de uso, que ya tiene ambos valores. **La `pk` de la
  `ExclusiveStartKey` nunca sale del cursor**: se reconstruye con
  `` `PET#${petId}` `` desde `request.petMembership.petId` — el cursor solo
  aporta el `sk` de arranque, así que ni un cursor fabricado a mano puede
  cruzar de partición. Ser puro hace el codec testeable a nivel unitario
  (round-trip, manipulación, basura).

- **Filtro de flags en memoria, después de la Query** — sirve a R12, R15.
  DynamoDB permitiría un `FilterExpression` sobre `flags`, pero filtra
  **después** de leer y consume la misma capacidad; el resultado sería idéntico
  y el código, menos testeable (el filtro pasaría a ser un string de
  expresión). Filtrar en el caso de uso con
  `flags.includes(FLAG_LOW_ACCURACY)` — importando la constante de
  `@/pipeline/constants`, nunca el literal — permite un test unitario directo
  con tres items. Consecuencia explícita en R15: una página puede quedar vacía
  con `nextCursor` no nulo, porque la paginación es de la `Query`.

- **Constantes de la feature en un solo archivo** — sirve a R8, R9, R10.
  `positions.constants.ts` del módulo: `DEFAULT_RANGE_MINUTES = 60`,
  `MAX_RANGE_HOURS = 24`, `POSITIONS_PAGE_LIMIT = 1000`, `CURSOR_VERSION = 1`.
  Ningún número mágico en use cases ni controller (regla ya aplicada en #7 con
  `CLAIM_WATERMARK_LOOKBACK_MINUTES` y en #8 con `pipeline/constants.ts`).

- **DTO de query zod con `.strict()`** — sirve a R7. `ListPositionsQuerySchema`
  en `application/dto/list-positions.dto.ts`: `from`/`to`
  `z.string().datetime().optional()`, `cursor` `z.string().min(1).optional()`,
  `includeSuspect` `z.enum(['true','false']).optional()`, y `.strict()` para
  que un parámetro desconocido sea `400` en vez de ignorado silenciosamente.
  El parseo corre en el borde HTTP (`schema.parse(req.query)`), `ZodError` →
  `BadRequestException` (`docs/conventions.md` §DTOs).

- **Errores de dominio → HTTP en el controller** — sirve a R9, R14. En
  `domain/errors/position.errors.ts`, sin imports de `@nestjs/common`:

  | Error de dominio | HTTP | Código en body |
  |---|---|---|
  | `InvalidRangeError` (`from >= to`) | 400 | `INVALID_RANGE` |
  | `RangeTooLargeError` (> 24 h) | 400 | `RANGE_TOO_LARGE` |
  | `InvalidCursorError` (decode, versión, petId o huella) | 400 | `INVALID_CURSOR` |

  El `404` de mascota inexistente/ajena no aparece aquí: lo produce el guard
  (R1) antes de entrar al handler.

- **Un controller con las dos rutas** — sirve a R1, R3, R10.
  `positions.controller.ts` con `@Controller('pets/:petId/positions')` y
  `@UseGuards(PetAccessGuard)` a nivel de clase, sin `@RequirePetRole`
  (precedente: `GET /v1/pets/:petId/device` de #7). `@Get('last')` se declara
  **antes** de `@Get()` para que la ruta literal no compita con nada; ambas
  leen el `petId` de `request.petMembership`, nunca de `@Param`.

- **Mapper único de item DynamoDB → respuesta** — sirve a R11.
  `infrastructure/mappers/position-response.mapper.ts` traduce snake_case del
  item (`speed_kmh`, `accuracy_m`, `battery_pct`) a camelCase y **omite**
  `received_ts`, `processed_ts` y `expires_at`. Lista explícita de campos, sin
  spread del item: un atributo nuevo en la tabla no se filtra al cliente por
  accidente.

## Estructura de capas

```
backend-pet-tracker/src/modules/positions/
├── domain/
│   ├── entities/position.entity.ts        ← CachedPosition, StoredPosition (tipos puros)
│   ├── errors/position.errors.ts          ← InvalidRange / RangeTooLarge / InvalidCursor
│   ├── cursor.ts                          ← encode/decode puros (R13, R14)
│   ├── stale-seconds.ts                   ← funcion pura (R4)
│   └── repositories/
│       ├── last-position.reader.ts        ← interface + LAST_POSITION_READER
│       └── position-history.reader.ts     ← interface + POSITION_HISTORY_READER
├── application/
│   ├── dto/list-positions.dto.ts          ← zod .strict() (R7)
│   ├── dto/cached-position.dto.ts         ← zod del jsonb de pets.last_position (R3/R5)
│   └── use-cases/
│       ├── get-last-position.use-case.ts  ← R3, R4, R5
│       └── list-positions.use-case.ts     ← R8-R15
├── infrastructure/
│   ├── positions.constants.ts             ← POSITIONS_READ_DOC_CLIENT + constantes de D4
│   ├── mappers/position-response.mapper.ts
│   ├── repositories/
│   │   ├── last-position.drizzle.reader.ts
│   │   └── position-history.dynamo.reader.ts
│   └── positions.controller.ts            ← 2 rutas, PetAccessGuard
└── positions.module.ts                    ← importa PetsModule; providers
```

## Archivos afectados

- `backend-pet-tracker/src/modules/positions/**` — módulo nuevo completo, 3
  capas (R1-R15). Todos los imports que cruzan de capa o de módulo usan el
  alias `@/` (`docs/conventions.md` §Imports).
- `backend-pet-tracker/src/app.module.ts` — editado: importa `PositionsModule`
  (única línea fuera del módulo nuevo).
- `backend-pet-tracker/test/positions.e2e-spec.ts` — nuevo: 404 de guard e
  IDOR (R1), `last` con caché y sin caché (R3/R5), rango > 24 h (R9),
  paginación completa con cursor (R13), cursor corrupto y cursor cruzado
  (R14), filtro de flags por defecto y con `includeSuspect` (R12). Siembra
  items directamente en DynamoDB de LocalStack (`PutItem` con el mismo shape
  que escribe #8) para no depender del poller.
- `progress/impl_positions-api.md` — nuevo: reporte del implementer, incluida
  la evidencia manual de R6.
- `specs/positions-api/traceability.md` — completado por el implementer.

Sin migraciones, sin cambios en `src/db/**`, `src/workers/**` ni
`src/pipeline/**`, sin variables de entorno nuevas y sin dependencias nuevas
(`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`, `zod` y `drizzle-orm` ya
están instalados).

## Alternativas descartadas

- **Leer `last` desde DynamoDB (Query `Limit 1`, `ScanIndexForward false`)**:
  descartado — el plan 005 §Paso 5 dice explícitamente "de
  `pets.last_position` (rápido, sin DynamoDB)"; la caché existe justamente
  para que la pantalla del mapa (polling cada 15 s por mascota) no golpee la
  tabla de telemetría. Coste aceptado: si el consumidor de #8 no actualizó la
  caché (asignación liberada, o el WHERE "solo si más reciente"), `last` puede
  ir por detrás de DynamoDB — es el mismo dato que ya expone `GET
  /v1/pets/:petId` en la clave `lastPosition`, así que la incoherencia sería
  peor si cada endpoint leyera de una fuente distinta.
- **Extender `PetRepository` con `findLastPosition`**: descartado — su
  contrato está cerrado por la spec aprobada de #5 y el consumidor es otro;
  precedente literal en D14 de #8. `LastPositionReader` es un puerto de este
  módulo.
- **Importar `IngestionModule` para reutilizar `POSITIONS_DOC_CLIENT`**:
  descartado (D6) — acopla el API de lectura a los workers; además
  `IngestionModule` no exporta ese token, así que habría que editar
  `src/workers/`, lo que R16 prohíbe.
- **`FilterExpression` de DynamoDB para excluir `low_accuracy`**: descartado —
  DynamoDB filtra después de leer (misma capacidad consumida, mismo resultado)
  y convierte una regla de negocio testeable en un string de expresión.
- **Cursor = `LastEvaluatedKey` crudo en base64**: descartado — expone la
  forma de las claves de DynamoDB (incluida la `pk` de otra mascota si se
  fabrica) y no permite validar que el cursor corresponde a esta consulta.
  El sobre `{v, p, q, k}` hace posibles R14 y la evolución del formato.
- **Cursor firmado con HMAC**: no descartado, **elevado a decisión abierta
  D3** — la spec propone sin firma porque la `pk` se reconstruye desde la ruta
  autorizada.
- **Paginar sobre el resultado ya filtrado (rellenar la página hasta N items
  haciendo varias Queries)**: descartado — una petición pasaría a hacer un
  número no acotado de llamadas a DynamoDB (una ventana entera de
  `low_accuracy` obligaría a recorrerla completa antes de responder). La
  paginación de la `Query` con páginas eventualmente vacías (R15) es acotada y
  predecible.
- **Parámetro `?limit=` configurable por el cliente**: descartado (D4) — más
  superficie de validación y de abuso sin caso de uso en el plan 005; el
  tamaño fijo de 1000 cubre 24 h a 30 s (2 880 posiciones ⇒ 3 páginas).
- **Aceptar `from`/`to` en epoch ms además de ISO-8601**: descartado — dos
  formatos de entrada, dos caminos de validación y ambigüedad ("¿1700000000 es
  segundos o milisegundos?"). ISO-8601 es lo que ya usan las respuestas de la
  API (`lastCommunicationAt`, `createdAt`).
- **`204 No Content` o `404` para `last` sin caché**: descartado (ver D2) — el
  precedente de `GET /v1/pets/:petId/device` fija `200 null` para "estado
  vacío" y el 404 de la ruta ya significa "mascota ajena o inexistente".
- **Devolver el item de DynamoDB tal cual (spread)**: descartado — filtraría
  `received_ts`, `processed_ts` y `expires_at`, y cualquier atributo futuro del
  pipeline pasaría al contrato público sin decisión.
