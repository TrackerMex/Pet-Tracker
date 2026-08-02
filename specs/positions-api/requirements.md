---
feature: "positions-api"
status: approved   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Requisitos — [[positions-api]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 9 (description + acceptance_criteria),
> `plans/005-collar-wialon-ingesta.md` §Paso 5 (parte de lectura),
> `docs/data-model.md` (fila `pets` → `last_position`, §DynamoDB tabla
> `positions`), `docs/wialon-module.md` §Poller, watermark y consumidor.
>
> Depende de (todo `done`, se reutiliza tal cual, **no se redefine**):
> - `pets-crud-permissions` (#5): `PetAccessGuard` + `@RequirePetRole()` y el
>   token `PET_REPOSITORY`, exportados por `PetsModule`.
> - `localstack-provisioning` (#2): `AwsModule` es `@Global()` y exporta
>   `DYNAMODB_CLIENT`; las constantes de tabla/claves viven en
>   `src/aws/constants.ts` (`TABLE_POSITIONS`, `TABLE_POSITIONS_PARTITION_KEY`,
>   `TABLE_POSITIONS_SORT_KEY`).
> - `wialon-ingestion-pipeline` (#8): es **el único escritor** de los datos que
>   esta feature lee — items de `positions` (`pk = PET#<petId>`, `sk = device_ts`
>   en ms, atributos `lat, lng, speed_kmh, course, altitude, sats, accuracy_m,
>   battery_pct, device_ts, received_ts, processed_ts, flags, expires_at`) y la
>   caché `pets.last_position` (`{lat, lng, ts, accuracy, battery}`) +
>   `pets.last_communication_at`. Los nombres de flag (`low_accuracy`,
>   `suspect_jump`) se importan de `src/pipeline/constants.ts`, nunca se
>   re-teclean.
>
> Endpoints cubiertos (ambos de **solo lectura**, ninguno `@Public()`):
> `GET /v1/pets/:petId/positions/last` y
> `GET /v1/pets/:petId/positions?from&to&cursor&includeSuspect`.
>
> Esta feature **no escribe nada**: sin migraciones, sin tablas ni columnas
> nuevas, sin variables de entorno nuevas, sin dependencias nuevas.

## Requisitos funcionales

### Autorización (reutilización, sin mecanismo nuevo)

- **R1**: WHEN llega una petición autenticada a `GET
  /v1/pets/:petId/positions/last` o a `GET /v1/pets/:petId/positions`, THE
  SYSTEM SHALL autorizarla exclusivamente con el `PetAccessGuard` existente
  (#5) declarado con `@UseGuards(PetAccessGuard)` y **sin** `@RequirePetRole`
  — cualquier rol con membresía activa (`owner`, `family`, `walker`, `vet`)
  lee posiciones (R12 de #5). IF el `:petId` no existe, existe pero el usuario
  no tiene fila en `pet_users` con `status = 'active'`, o no es un UUID
  sintácticamente válido, THEN THE SYSTEM SHALL responder `404` con el mismo
  body genérico del guard (R9/R10 de #5) **sin ejecutar ninguna consulta a
  DynamoDB ni a `pets`**. Tests e2e obligatorios: usuario B sobre mascota de A
  → `404` en las dos rutas; `:petId` = `not-a-uuid` → `404`. THE SYSTEM SHALL
  NOT introducir ningún guard, decorador ni consulta de membresía propios de
  esta feature.

- **R2**: WHEN el `PetAccessGuard` autoriza la petición, THE SYSTEM SHALL
  derivar la mascota consultada **únicamente** de `request.petMembership.petId`
  (el valor que el guard validó), y SHALL NOT tomar el identificador de
  mascota de ningún otro origen (body, query string, cursor). Verificable por
  inspección del controller y por el test de R14 (cursor de otra mascota).

### Última posición — `GET /v1/pets/:petId/positions/last`

- **R3**: WHEN un miembro activo pide `GET /v1/pets/:petId/positions/last` y
  `pets.last_position` de esa mascota contiene un objeto que valida contra el
  shape escrito por #8 (`{lat: number, lng: number, ts: number, accuracy:
  number|null, battery: number|null}`), THE SYSTEM SHALL responder `200` con
  un cuerpo JSON de **exactamente** estas seis claves: `lat`, `lng`, `ts`,
  `accuracy`, `battery`, `staleSeconds` — los cinco primeros copiados de la
  caché sin transformar, `staleSeconds` calculado según R4. THE SYSTEM SHALL
  NOT consultar DynamoDB en esta ruta (verificable: el caso de uso de `last`
  no recibe cliente DynamoDB alguno en su constructor).

- **R4**: WHEN THE SYSTEM construye la respuesta de R3, THE SYSTEM SHALL
  calcular `staleSeconds = max(0, floor((now − ts) / 1000))`, donde `ts` es el
  `device_ts` en epoch ms de la caché y `now` es el reloj del **servidor**
  (fuente de tiempo inyectada, no un `Date.now()` incrustado, para que el test
  la fije). IF `ts` es posterior a `now` (desfase de reloj del dispositivo)
  THEN `staleSeconds` SHALL ser `0`, nunca negativo. Verificable con test
  unitario de la función pura con reloj fijo: `ts = now − 90 000 ms` → `90`;
  `ts = now + 5 000 ms` → `0`.

- **R5**: IF `pets.last_position` es `NULL` (mascota sin collar, o con collar
  pero sin ninguna posición ingerida todavía) THEN THE SYSTEM SHALL responder
  `200` con el cuerpo JSON literal `null` — no `404`, no `204`. IF
  `pets.last_position` no es `NULL` pero no valida contra el shape de R3
  (jsonb corrupto o escrito por una versión anterior) THEN THE SYSTEM SHALL
  responder igualmente `200` con `null` y registrar un log de nivel `warn` con
  el `petId`, sin propagar el error al cliente. Verificable e2e: mascota recién
  creada sin collar → `200` con body `null`.

- **R6**: WHEN el pipeline (#8) ha ingerido posiciones del simulador para una
  mascota con collar activo durante al menos un ciclo del poller, THE SYSTEM
  SHALL responder a `GET /v1/pets/:petId/positions/last` con `200`, `lat`/`lng`
  no nulos y `staleSeconds < 120`. Es el criterio de aceptación literal de la
  feature ("`last` → 200 con lat/lng frescos del simulador, ts < 2 min") y se
  verifica como **evidencia manual** documentada en
  `progress/impl_positions-api.md` (cadena real simulador → poller → SQS →
  consumidor → Postgres), no como test automatizado dependiente del reloj.

### Histórico — validación de la consulta

- **R7**: WHEN llega `GET /v1/pets/:petId/positions` THE SYSTEM SHALL validar
  la query string con un schema zod que acepta exactamente cuatro parámetros
  opcionales — `from`, `to` (cadenas ISO-8601 con instante completo, p. ej.
  `2026-08-02T08:00:00.000Z`), `cursor` (string) e `includeSuspect` (`'true'`
  o `'false'`) — y SHALL responder `400` (`ZodError` →
  `BadRequestException`, `docs/conventions.md` §Manejo de errores) IF algún
  parámetro presente no parsea a un instante válido, IF `includeSuspect` trae
  un valor distinto de `'true'`/`'false'`, o IF la query string incluye un
  parámetro no reconocido. Verificable con casos: `from=ayer` → 400;
  `includeSuspect=1` → 400; `foo=bar` → 400.

- **R8**: WHEN `to` está ausente, THE SYSTEM SHALL usar el instante actual del
  reloj del servidor; WHEN `from` está ausente, THE SYSTEM SHALL usar
  `to − DEFAULT_RANGE_MINUTES` con `DEFAULT_RANGE_MINUTES = 60` declarado como
  constante nombrada del módulo (nunca un literal suelto). Verificable con
  reloj fijo: petición sin `from` ni `to` sobre datos sembrados → la `Query`
  emitida cubre `[now − 60 min, now]`.

- **R9**: IF `from >= to` después de aplicar los defaults de R8 THEN THE
  SYSTEM SHALL responder `400` con código `INVALID_RANGE` en el body de error,
  sin consultar DynamoDB. IF `to − from > 24 h` (`MAX_RANGE_HOURS = 24`,
  constante nombrada) THEN THE SYSTEM SHALL responder `400` con código
  `RANGE_TOO_LARGE`, sin consultar DynamoDB. Verificable e2e: rango de 25 h →
  `400` + `RANGE_TOO_LARGE`; rango de exactamente 24 h → **no** es `400`.

### Histórico — consulta y contrato de respuesta

- **R10**: WHEN la consulta valida (R7-R9), THE SYSTEM SHALL ejecutar sobre la
  tabla DynamoDB `positions` una única `Query` por página con
  `KeyConditionExpression` = `pk = :pk AND sk BETWEEN :from AND :to`, donde
  `:pk` = `PET#<petId>` con el `petId` de R2, `:from`/`:to` son los epoch **ms**
  de los límites (ambos **inclusive**), `ScanIndexForward = true` (orden
  cronológico ascendente por `sk`) y `Limit = POSITIONS_PAGE_LIMIT` (constante
  nombrada, valor `1000`, del plan 005 §Paso 5). THE SYSTEM SHALL NOT usar
  `Scan` ni construir la `pk` a partir de ningún dato que venga del cliente.

- **R11**: WHEN THE SYSTEM devuelve una página de histórico, THE SYSTEM SHALL
  responder `200` con un objeto de exactamente dos claves: `items` (array) y
  `nextCursor` (string o `null`); y cada elemento de `items` SHALL tener
  exactamente estas claves, mapeadas desde los atributos escritos por #8:
  `ts` (← `sk`/`device_ts`), `lat`, `lng`, `speedKmh` (← `speed_kmh`),
  `course`, `altitude`, `sats`, `accuracyM` (← `accuracy_m`), `batteryPct`
  (← `battery_pct`) y `flags` (array de strings). THE SYSTEM SHALL NOT exponer
  `received_ts`, `processed_ts` ni `expires_at` (atributos internos del
  pipeline). Los elementos SHALL venir ordenados por `ts` estrictamente
  ascendente dentro de la página y entre páginas sucesivas.

- **R12**: WHILE `includeSuspect` está ausente o vale `'false'`, THE SYSTEM
  SHALL omitir de `items` todo elemento cuyo array `flags` contenga
  `low_accuracy`, y SHALL incluir los elementos marcados únicamente con
  `suspect_jump`. WHILE `includeSuspect = 'true'`, THE SYSTEM SHALL devolver
  todos los elementos del rango sin filtrar por `flags` (incluidos
  `low_accuracy`, `suspect_jump` y los que lleven ambos). Verificable con tres
  items sembrados (limpio / `low_accuracy` / `suspect_jump`): por defecto
  devuelve 2, con el flag devuelve 3. Ver decisión abierta **D1**.

- **R13**: WHEN la `Query` de R10 devuelve un `LastEvaluatedKey`, THE SYSTEM
  SHALL emitir en `nextCursor` una cadena **base64url opaca** que codifica un
  JSON con: `v` (versión del formato, entero, `1`), `p` (el `petId` de la
  ruta), `q` (huella de la consulta: `from`, `to` e `includeSuspect`
  normalizados) y `k` (el `sk` del `LastEvaluatedKey`; la `pk` **no** se
  serializa porque se reconstruye desde la ruta). WHEN la `Query` no devuelve
  `LastEvaluatedKey`, THE SYSTEM SHALL emitir `nextCursor: null`. WHEN el
  cliente repite la petición con `cursor = <nextCursor>` y los mismos
  `from`/`to`/`includeSuspect`, THE SYSTEM SHALL continuar la lectura desde el
  `sk` codificado (`ExclusiveStartKey = {pk: PET#<petId de la ruta>, sk: k}`)
  sin repetir ni saltar elementos. Verificable e2e: sembrar N posiciones,
  paginar siguiendo `nextCursor` hasta `null` y comprobar que la concatenación
  de páginas es la lista completa, ordenada y sin duplicados.

- **R14** (seguridad): IF el `cursor` recibido no decodifica como base64url,
  no parsea como JSON, no trae `v = 1`, tiene `p` distinto del `:petId` de la
  ruta, o tiene una huella `q` distinta de la de la petición actual, THEN THE
  SYSTEM SHALL responder `400` con código `INVALID_CURSOR` **sin ejecutar
  ninguna Query**, y SHALL NOT devolver dato alguno de otra mascota ni de otro
  rango. Además, aun con un cursor manipulado, la `pk` de la
  `ExclusiveStartKey` SHALL construirse siempre desde el `:petId` de la ruta
  (R2/R10): el cursor solo puede mover el punto de arranque **dentro** de la
  partición ya autorizada. Tests obligatorios: cursor `"???"` → 400; cursor
  legítimo de la mascota A reenviado en la ruta de la mascota B (con un
  usuario miembro de ambas) → 400 y cero items de A.

- **R15**: WHEN el filtrado de R12 vacía una página que aún tiene
  `LastEvaluatedKey`, THE SYSTEM SHALL responder `200` con `items: []` y un
  `nextCursor` no nulo — la paginación es de la `Query`, no del resultado
  filtrado, y el cliente sigue el cursor hasta recibir `null`. IF no hay
  ninguna posición en el rango THEN THE SYSTEM SHALL responder `200` con
  `{items: [], nextCursor: null}`, nunca `404`.

### No regresión

- **R16**: WHEN se implementa esta feature, THE SYSTEM SHALL NOT generar
  ninguna migración Drizzle, SHALL NOT modificar el contrato de respuesta de
  `GET /v1/pets` ni de `GET /v1/pets/:petId` (R8 de #5 — ni claves nuevas ni
  renombradas), SHALL NOT modificar ningún archivo de `src/workers/**` ni
  `src/pipeline/**`, y SHALL NOT añadir variables de entorno. Verificable con
  `git diff main --stat` y con la suite existente en verde.

## Decisiones abiertas (requieren input humano en el gate)

- **D1 — Qué filtra exactamente `includeSuspect=true` (R12)**: el nombre del
  parámetro dice "suspect" pero el criterio de aceptación habla de
  `low_accuracy`; el pipeline (#8) produce **dos** flags independientes
  (`low_accuracy` y `suspect_jump`). La spec propone la lectura literal del
  plan 005 ("excluye por defecto puntos con flag `low_accuracy` salvo
  `?includeSuspect=true`"): **modo por defecto** = se ocultan solo los
  `low_accuracy`, y los `suspect_jump` sí se devuelven (son movimiento real,
  marcado para que el consumidor decida — el plan 006 de recorridos los
  necesita para segmentar); **`includeSuspect=true`** = ningún filtro por
  flags. Alternativa B: el modo por defecto oculta **ambos** flags (mapa
  "limpio") y el parámetro los reactiva ambos — más coherente con el nombre,
  pero se aparta del criterio de aceptación, que solo menciona `low_accuracy`.
  Alternativa C: renombrar a `includeLowAccuracy` (coherente con lo que hace,
  rompe el contrato OpenAPI del plan 005) o exponer dos parámetros
  independientes (`includeLowAccuracy`, `includeSuspectJump`).
  **Confirmar A, o elegir B/C.**

- **D2 — Respuesta cuando `pets.last_position` es NULL (R5)**: la spec propone
  `200` con body `null`, por precedente directo de `GET /v1/pets/:petId/device`
  (R11 de #7: "sin collar es estado, no error" — el móvil renderiza el
  formulario de asociación a partir del `null`) y porque el `404` de estas
  rutas ya está reservado por el guard a "mascota inexistente o ajena":
  devolver `404` por "sin posiciones" haría indistinguibles dos casos con
  significado y acción de UI opuestos. Alternativas: `404` con código
  `NO_POSITION` (obliga al cliente a distinguir dos 404 por el body), o `204`
  sin cuerpo (semánticamente defendible, pero incoherente con el resto de la
  API, que nunca usa 204 en `GET`). **Confirmar `200 null` o elegir otra.**

- **D3 — Cursor base64url opaco y autodescriptivo, sin firma (R13/R14)**: el
  cursor lleva `{v, p, q, k}` en claro (base64url no es cifrado); la defensa
  real es que la `pk` siempre viene de la ruta ya autorizada por el guard, más
  la validación `p == :petId` y la huella `q`. Un atacante puede leer y
  fabricar cursores, pero eso no le da acceso a nada fuera de la partición que
  ya podía leer. Alternativa: firmar el cursor con HMAC (`JWT_SECRET` u otra
  clave) para hacerlo infalsificable — coste: una clave más en el borde de
  lectura y un modo de fallo nuevo (rotar la clave invalida los cursores en
  vuelo) a cambio de una amenaza que el modelo ya neutraliza.
  **Confirmar el cursor sin firma o exigir HMAC.**

- **D4 — Defaults de `from`/`to` y tamaño de página (R8/R10)**: la spec
  propone `to = now`, `from = to − 60 min` y `Limit = 1000` (el valor del plan
  005). Alternativas: exigir ambos parámetros (`400` si falta alguno — más
  explícito, peor DX para el "dame lo último" del mapa), o una ventana por
  defecto distinta (15 min, como la verificación del plan; o 24 h = el
  máximo). El tamaño de página podría además exponerse como `?limit=` — la
  spec lo deja **fijo** para no multiplicar superficie de validación.
  **Confirmar los tres valores o ajustarlos.**

- **D5 — Orden ascendente y `staleSeconds` contra el reloj del servidor
  (R4/R10)**: histórico ascendente por `sk` (`ScanIndexForward = true`) porque
  el consumidor natural es el trazado del recorrido en el mapa (plan 006) y
  porque la paginación hacia adelante en el tiempo es la que el cursor modela;
  la alternativa (descendente, "lo más nuevo primero") serviría a un feed, que
  ninguna pantalla del plan 005 pide. `staleSeconds` se calcula contra el
  reloj del servidor y el `device_ts` cacheado — no contra
  `pets.last_communication_at` (que #8 escribe con el mismo valor) ni contra
  `received_ts` (que vive en DynamoDB y forzaría la consulta que R3 prohíbe).
  Consecuencia aceptada: mide la antigüedad **del dato del dispositivo**, e
  incluye la latencia de ingesta. **Confirmar, o pedir orden descendente / otra
  fuente de tiempo.**

- **D6 — Módulo `positions` con su propio `DynamoDBDocumentClient`**: la
  lectura no importará `IngestionModule` (workers) para reaprovechar
  `POSITIONS_DOC_CLIENT`; declarará su propio provider a partir del
  `DYNAMODB_CLIENT` que `AwsModule` (`@Global()`) ya exporta. Motivo: acoplar
  el API de lectura a un módulo de workers arrastraría poller y consumidor a
  cualquier contexto que solo quiera servir HTTP. Coste: dos
  `DynamoDBDocumentClient` en el proceso (envoltorios baratos sobre el mismo
  cliente low-level). **Confirmar, o exigir extraer el token a un módulo
  compartido en `src/aws/`** (implicaría editar `src/workers/`, que R16
  prohíbe).

## Fuera de alcance

- **Recorridos, paseos y KPIs de actividad diaria** (`activity_daily`, `GET
  .../trips`): son la feature #10 / `plans/006-recorridos-actividad.md`. Aquí
  no se agrega, no se segmenta en paseos y no se calcula distancia.
- **Escritura de posiciones**: la ingesta completa (poller, SQS, consumidor,
  DynamoDB, caché de `pets`) es de #8 y está `done`; esta feature solo lee.
- **Geocercas, alertas y push** (plan 007): esta feature no consume ni emite
  eventos de EventBridge.
- **Tiempo real / WebSocket** (plan 010): el cliente hace polling.
- **Pantallas móviles** (`plans/005` §Paso 6: mapa, marcador, banner "hace X"):
  fuera del backend.
- **Exportación de histórico** (CSV/GPX) y **descarga de rangos > 24 h en una
  sola llamada**: el límite de 24 h por página es un requisito (R9), no una
  limitación a sortear.
- **Endpoint agregado multi-mascota** (`GET /v1/positions` para el tab Mapa):
  no está en el contrato del plan 005; el cliente llama a `/positions/last`
  por mascota.
- **Cambios en el shape de `pets.last_position` o en los atributos de la tabla
  `positions`**: contrato congelado por #8; si la lectura necesitara un
  atributo que el pipeline no escribe, sería un cambio de #8, no de aquí.
- **Consultas geoespaciales** (radio, cercanía, PostGIS) y **agregaciones**
  (velocidad media, bounding box): post-MVP.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-02) ← gate obligatorio antes de implementar

Decisiones abiertas D1-D6 aprobadas íntegras como las propone la spec
(2026-08-02): D1 modo por defecto oculta solo `low_accuracy`; D2 `200 null`;
D3 cursor base64url sin firma; D4 `to=now`, `from=to−60min`, `Limit=1000`
fijo; D5 orden ascendente + `staleSeconds` contra reloj del servidor y
`device_ts`; D6 `DocumentClient` propio del módulo desde `AwsModule`.
