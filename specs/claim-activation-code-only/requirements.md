---
feature: "claim-activation-code-only"
status: approved        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[claim-activation-code-only]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #26 (description + acceptance_criteria). Deuda
> destapada al escribir `specs/device-provisioning-admin/design.md` §Riesgo
> heredado de #7, opción 3 ("Cerrarlo: reducir `DEVICE_IDENTIFIER_FIELDS` a
> `['activationCode']` … es código de #7, **fuera de alcance de esta spec**:
> sería una entrada nueva en `feature_list.json`"). Esta es esa entrada.
>
> **El hueco**: `DEVICE_IDENTIFIER_FIELDS`
> (`backend-pet-tracker/src/modules/devices/domain/repositories/device.repository.ts:10`)
> es `['esn', 'imei', 'serialNumber', 'activationCode']`, y el `superRefine`
> de `claim-device.dto.ts:23-36` solo exige que venga **exactamente uno** de
> los cuatro — no que sea el `activationCode`. Cualquiera de los otros tres
> reclama el collar igual que el código secreto. Los IMEI de un lote de
> fábrica son casi consecutivos: con un IMEI válido se enumeran los vecinos y
> se reclaman collares ajenos en la ventana entre la venta y la activación
> legítima, quedándose con la ubicación GPS de esa mascota. El único mitigante
> actual es que tras el claim legítimo el segundo claim ya da `409`.
>
> Depende de `devices-claim` (#7, `done`) — cuyo contrato público de
> `POST /v1/devices/claim` cambia aquí, por el mismo criterio que llevó #22 a
> separarse de #5 — y convive con `device-provisioning-admin` (#24, `done`),
> que genera `activation_code` de ~50 bits (`PT-` + 10 chars base32,
> `src/modules/devices/application/activation-code.ts`), no enumerable.
>
> **Lo que NO se retira**: `esn`, `imei` y `serial_number` siguen siendo
> columnas `UNIQUE` de `devices`, siguen apareciendo en las respuestas HTTP
> (`esn` es una de las 5 claves de `DeviceStatusResponse`) y siguen siendo
> buscables por `DeviceRepository.findByIdentifier()` desde código interno.
> Lo que se retira es su uso como **credencial** en el borde HTTP.

## Requisitos funcionales

### El borde HTTP acepta una sola credencial

- **R1**: `ClaimDeviceSchema`
  (`backend-pet-tracker/src/modules/devices/application/dto/claim-device.dto.ts`)
  SHALL declarar exactamente dos campos: `petId` (`z.uuid()`, sin cambios) y
  `activationCode`, este último **obligatorio** con el mismo
  `IdentifierSchema` de hoy (`z.string().trim().min(1).max(64)`, línea 8) y
  sin `.optional()`. Las claves `esn`, `imei` y `serialNumber` SHALL
  desaparecer del schema, y el bloque `.superRefine((data, ctx) => {...})`
  (líneas 23-36) SHALL desaparecer con ellas — la obligatoriedad de un único
  campo ya no necesita una regla XOR. Consecuencias observables, todas sobre
  `POST /v1/devices/claim`:

  - **(a)** IF el body es `{ petId, activationCode }` con `activationCode` no
    vacío THEN `safeParse` SHALL devolver `success: true` y `result.data`
    SHALL tener exactamente las claves `petId` y `activationCode`.
  - **(b)** IF el body NO trae la clave `activationCode` (incluido el caso
    peligroso de un cliente viejo que manda solo `imei`, solo `esn` o solo
    `serialNumber`) THEN THE SYSTEM SHALL responder `400` con al menos un
    issue de path `activationCode`, y THE SYSTEM SHALL NOT ejecutar
    `ClaimDeviceUseCase` — verificable porque ninguna fila de `pet_devices`
    se crea y `devices.status` sigue en `available`.
  - **(c)** IF el body trae `activationCode` válido **y además** `imei`,
    `esn` o `serialNumber` (cliente viejo que manda de más) THEN THE SYSTEM
    SHALL ignorar esas claves en silencio — mismo trato que cualquier otra
    clave desconocida, porque `ClaimDeviceSchema` es `z.object` (no
    `z.strictObject`) y ya las descarta sin error — y SHALL completar el
    claim por el `activationCode` con `201`. `result.data` SHALL NOT
    contener ninguna de las tres claves. Esta es la decisión de la opción
    (a) de `feature_list.json` #26, cerrada en [[design]] D1; la opción (b)
    (rechazar con `400`) queda descartada allí.

  Los tests de #7 sobre este schema (`claim-device.dto.spec.ts`,
  `describe('R4: ...')`, 5 de sus 6 `it`) SHALL quedar **actualizados**, no
  eliminados — ver [[design]] D5, tabla de tests, para el mapeo exacto
  archivo → assertion vieja → assertion nueva.

### Ningún claim tiene éxito por imei, esn o serialNumber

- **R2**: WHEN un usuario `owner` de una mascota accesible envía
  `POST /v1/devices/claim` con `{ petId }` más **únicamente** `imei`, `esn` o
  `serialNumber` de un device que existe en `devices`, está `available` y no
  tiene fila activa en `pet_devices` — es decir, un device perfectamente
  reclamable con su `activationCode` —, THE SYSTEM SHALL responder `400` y
  SHALL NOT reclamarlo por ninguna vía: tras las tres llamadas, la tabla
  `pet_devices` SHALL NOT tener ninguna fila con ese `device_id`,
  `devices.status` SHALL seguir en `'available'` y `audit_log` SHALL NOT
  tener ninguna entrada `device.claim` con ese `entity_id`. Verificable con
  un test e2e por cada uno de los tres campos (`test/devices.e2e-spec.ts`,
  `describe('R2 (claim-activation-code-only #26): ...')`), sobre un device
  sembrado con los tres identificadores poblados. Inmediatamente después,
  el mismo device SHALL reclamarse con `201` enviando su `activationCode`
  — la prueba de que el `400` es por credencial rechazada y no porque el
  device estuviese en mal estado.

### `toDeviceIdentifier` produce siempre `activationCode`

- **R3**: `toDeviceIdentifier(dto)`
  (`claim-device.dto.ts:41-51`) SHALL devolver siempre
  `{ field: 'activationCode', value: dto.activationCode }` para cualquier
  `ClaimDeviceDto` válido, sin bucle sobre ningún array y sin la rama
  `throw new Error('ClaimDeviceDto without device identifier')` (línea 50),
  que deja de ser alcanzable al ser `activationCode` obligatorio.
  `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.ts`
  SHALL NOT modificarse por esta feature (ni una línea): sigue llamando
  `this.devices.findByIdentifier(toDeviceIdentifier(dto))` en su línea 56, y
  el orden membresía (404) → rol (403) → device (404/409) de R5-R9 de #7
  queda intacto. Verificable con `git diff --stat`: `claim-device.use-case.ts`
  no aparece en el diff de la feature.

### El repositorio conserva su capacidad de búsqueda

- **R4**: `DeviceRepository.findByIdentifier(identifier: DeviceIdentifier)`
  (`device.repository.ts:33`) SHALL conservar su firma y su capacidad: el
  tipo `DeviceIdentifierField` SHALL seguir admitiendo los cuatro valores
  `'esn' | 'imei' | 'serialNumber' | 'activationCode'`, y
  `DeviceDrizzleRepository.findByIdentifier()` SHALL seguir resolviendo los
  cuatro contra su columna `UNIQUE` vía el mapa `IDENTIFIER_COLUMNS`
  (`device.drizzle.repository.ts:24-29`, sin cambios). Lo que cambia es qué
  puede construir el borde HTTP, no lo que puede pedir el código interno.
  Verificable con un test e2e que obtiene el repositorio del contenedor
  (`app.get<DeviceRepository>(DEVICE_REPOSITORY)`) y comprueba que
  `findByIdentifier({ field: 'imei', value: <imei sembrado> })` devuelve el
  `Device` esperado, igual que `{ field: 'activationCode', ... }`.

- **R5**: `DEVICE_IDENTIFIER_FIELDS` (`device.repository.ts:10-15`) SHALL
  dejar de existir como export — no SHALL reducirse a un array de un
  elemento. `DeviceIdentifierField` SHALL pasar a declararse como unión
  literal explícita en el mismo archivo, sin derivarse de ningún array
  (`export type DeviceIdentifierField = 'esn' | 'imei' | 'serialNumber' |
  'activationCode';`). Justificación en [[design]] D2: el array existía
  únicamente para (i) derivar el tipo con `as const` y (ii) alimentar los dos
  bucles de `claim-device.dto.ts` (líneas 24 y 42), que R1 y R3 eliminan;
  con esos bucles fuera, el array queda como una indirección sin ningún
  iterador, y además es el símbolo compartido que hacía que el dominio
  publicara "estos cuatro son credenciales intercambiables" — exactamente el
  acoplamiento que causó este hueco. Verificable porque
  `grep -rn "DEVICE_IDENTIFIER_FIELDS" backend-pet-tracker/src backend-pet-tracker/test`
  SHALL NOT devolver ninguna línea, y `pnpm -C backend-pet-tracker run build`
  SHALL terminar en verde.

### El camino feliz no cambia

- **R6**: WHEN un usuario `owner` envía `POST /v1/devices/claim` con
  `{ petId, activationCode }` válidos sobre un device disponible, THE SYSTEM
  SHALL comportarse exactamente igual que antes de esta feature: `201` con
  las mismas 5 claves de `DeviceStatusResponse`
  (`model`, `batteryPct`, `connectivity`, `lastMessageAt`, `esn` — `esn`
  sigue siendo **salida**, nunca credencial), una fila en `pet_devices` con
  `released_at IS NULL`, `devices.status = 'assigned'`,
  `devices.ingest_watermark` en `now - CLAIM_WATERMARK_LOOKBACK_MINUTES`
  (10 min) y una entrada `device.claim` en `audit_log` con
  `meta = { petId }`. Los códigos de error de #7 SHALL mantenerse sin
  cambios: `404` genérico del guard (R5 de #7), `403` (R6), `404`
  `DEVICE_NOT_FOUND` (R7), `409` `DEVICE_ALREADY_ASSIGNED` (R8), `409`
  `PET_ALREADY_HAS_DEVICE` (R9). Verificable porque los `describe` R3, R5-R15
  de `test/devices.e2e-spec.ts` siguen verdes tras sustituir únicamente la
  credencial que envían.

### Los tests de #7 se actualizan, no se borran

- **R7**: Los tests existentes de `devices-claim` (#7) que hoy afirman que el
  claim funciona por `esn`, `imei` o `serialNumber` SHALL quedar
  **actualizados** para afirmar el nuevo comportamiento, y SHALL NOT
  eliminarse ni comentarse. El inventario completo y normativo está en
  [[design]] D5 (3 archivos, 30 ubicaciones); ningún `it` ni `describe`
  existente desaparece del archivo salvo los dos casos que [[design]] D5
  marca explícitamente como "sustituido por" (con su reemplazo nombrado en
  la misma fila). WHEN se cierra la feature, [[traceability]] SHALL incluir
  una fila por cada test **modificado** de #7 que cambie de comportamiento
  esperado (no las meras ediciones de datos de prueba), con la justificación
  de por qué el comportamiento viejo dejó de ser correcto — el reviewer
  rechaza si un test de #7 desapareció sin fila que lo justifique.

### Documentación del contrato

- **R8**: WHEN se cierra esta feature, `docs/data-model.md` fila `devices`
  (línea 51) SHALL dejar de decir "el claim busca por cualquiera de los 4
  primeros" y SHALL documentar que la **única** credencial aceptada por
  `POST /v1/devices/claim` es `activation_code`, y que las otras tres
  columnas `UNIQUE` siguen existiendo como identificadores de inventario y
  de búsqueda interna (`findByIdentifier`), no de autorización. Verificable
  leyendo esa fila.

## Fuera de alcance

- **Rechazar `imei`/`esn`/`serialNumber` con `400`** cuando llegan junto a un
  `activationCode` válido: descartado a propósito (opción (b) de
  `feature_list.json` #26). Ver [[design]] D1 — el repositorio no tiene ni un
  solo `z.strictObject` ni un `ValidationPipe` global con
  `forbidNonWhitelisted`, así que hacerlo estricto solo para este endpoint
  introduciría la misma asimetría que #22 rechazó explícitamente, y además
  convertiría en `400` un claim que trae la credencial correcta.
- **Rate limiting / bloqueo por intentos fallidos sobre `activation_code`**:
  el código de #24 es `PT-` + 10 chars base32 (~50 bits), no enumerable por
  fuerza bruta a través de HTTP; añadir un contador de intentos es otra
  feature. Nota conocida: los tres devices del seed local
  (`scripts/seed-devices.ts`) siguen con códigos adivinables `ACT-001..003`
  — es deliberado, son `is_simulated=true` para desarrollo local, y el gate
  de #24 R5 ya impide que el camino de aprovisionamiento real los produzca.
- **Rotar o invalidar el `activation_code` tras un claim exitoso**: hoy la
  columna se conserva y el `409` de R8 de #7 es lo que impide el segundo
  claim. No cambia aquí.
- **Cualquier cambio en el flujo interno del claim**: `ClaimDeviceUseCase`,
  `DevicesController`, `device-error.mapper.ts`, `device-status.mapper.ts` y
  `DeviceDrizzleRepository` no se tocan (R3, R4, R6). Esta feature solo
  estrecha el schema de entrada y el símbolo del dominio que lo alimentaba.
- **Cambiar el schema de la tabla `devices`**: `esn`, `imei` y
  `serial_number` siguen siendo columnas `UNIQUE` nullables; no hay
  migración de DDL en esta feature.
- **El cliente móvil**: no existe en este repositorio; adaptar cualquier
  cliente externo al contrato nuevo queda fuera de esta spec de backend.
- **`GET /v1/pets/:petId/device` y la clave `device` del perfil**: su
  respuesta sigue incluyendo `esn` sin ningún cambio (R6).

## Aprobación

- [X] Aprobado por humano (fecha: 26-08-15) ← gate obligatorio antes de implementar
