---
feature: "device-provisioning-admin"
status: approved        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[device-provisioning-admin]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #24 (description + acceptance_criteria).
> Bloqueante para probar collares GPS **físicos**: hoy la tabla `devices`
> solo se llena con `backend-pet-tracker/scripts/seed-devices.ts`
> (SIM-001..003 / ACT-001..003, `is_simulated=true`, pensados para el
> `FakeWialonClient` de #8) y `ClaimDeviceUseCase` (#7) valida contra
> `devices` vía `DeviceDrizzleRepository.findByIdentifier()`, **no** contra
> Wialon. Consecuencia: un collar real que no esté en esa tabla es
> inclaimable y no existe ningún camino para meterlo.
>
> Depende de `devices-claim` (#7, `done`) — cuyo flujo **no se toca** — y de
> `wialon-ingestion-pipeline` (#8, `done`), de quien reutiliza el puerto
> `WialonClient` y su factory. `device-subscriptions` (#25) depende de esta,
> pero las suscripciones están fuera de alcance aquí.
>
> **La decisión abierta quedó cerrada en el gate el 2026-08-14: Opción A**
> (§Decisión abierta, más abajo) — el IMEI lo teclea el humano en `--imei`.
> La spec se implementa **tal cual, sin enmiendas**; la opción B se descartó.

## Requisitos funcionales

### Alta de un collar real

- **R1**: WHEN se ejecuta
  `pnpm -C backend-pet-tracker run provision:device -- --unit-id <id> [--imei <imei>] [--serial <serial>] [--esn <esn>] [--model <model>]`
  (script nuevo `backend-pet-tracker/scripts/provision-device.ts`, función
  exportada `provisionDevice(db, wialon, input)`) contra una base donde
  **no** existe ninguna fila de `devices` con ese `wialon_unit_id`, y la
  cuenta de Wialon sí contiene esa unidad (R2), THE SYSTEM SHALL insertar
  exactamente **una** fila en `devices` con: `id` = `uuidv7()`;
  `wialon_unit_id` = el valor de `--unit-id`; `imei` / `serial_number` /
  `esn` / `model` = el valor de su flag o `NULL` si no se pasó;
  `activation_code` = el valor devuelto por `generateActivationCode()` (R4);
  `status` = `'available'`; `is_simulated` = `false`; y
  `battery_pct`, `connectivity`, `last_message_at`, `ingest_watermark` en
  `NULL` (los rellena el pipeline de #8 / el claim de #7, no el
  aprovisionamiento). THE SYSTEM SHALL además escribir el `activation_code`
  generado por stdout — es el secreto que va impreso en la caja del collar y
  no hay otro momento en que se pueda leer sin consultar la base — y salir
  con código 0. IF falta `--unit-id` THEN THE SYSTEM SHALL abortar con un
  error explícito que nombre el flag ausente, sin insertar ninguna fila.

### Verificación contra la cuenta real antes de insertar

- **R2**: WHILE se aprovisiona un `wialon_unit_id` que no está todavía en
  `devices`, THE SYSTEM SHALL llamar a `WialonClient.listUnits()` **antes**
  de cualquier `INSERT` y SHALL insertar la fila únicamente si algún
  `WialonUnit.unitId` devuelto en **esa misma ejecución** es exactamente
  igual (comparación de strings, sin normalizar) al `--unit-id` pedido.
  IF ningún `unitId` coincide THEN THE SYSTEM SHALL lanzar
  `WialonUnitNotFoundError` con un mensaje que nombre el `unitId` pedido y
  el número de unidades visibles en la cuenta, SHALL dejar `devices`
  **sin ninguna fila nueva** (verificable comparando el conteo de filas
  antes y después) y SHALL salir con código distinto de 0. IF `listUnits()`
  falla contra la API real (`WialonApiError` / `WialonTransportError` de
  `src/integrations/wialon/wialon.errors.ts`) THEN THE SYSTEM SHALL
  propagar ese error tal cual, también sin insertar ninguna fila.

### Idempotencia y colisiones de identificador

- **R3**: IF ya existe una fila de `devices` con el `wialon_unit_id` pedido
  THEN THE SYSTEM SHALL devolver `{ created: false }` con el `id` y el
  `activation_code` **existentes**, SHALL NOT insertar una segunda fila,
  SHALL NOT regenerar el `activation_code` (regenerarlo invalidaría la caja
  ya impresa) y SHALL NOT modificar ninguna otra columna de esa fila
  — verificable porque `activation_code`, `status`, `is_simulated` y
  `updated_at` son idénticos antes y después de la segunda ejecución — y
  SHALL salir con código 0 (reprovisionar no es un error). IF el
  `wialon_unit_id` es nuevo pero alguno de `--imei` / `--serial` / `--esn`
  ya pertenece a **otra** fila (violación de un índice UNIQUE distinto de
  `wialon_unit_id`, error `23505` de Postgres) THEN THE SYSTEM SHALL fallar
  con ese error y dejar `devices` sin ninguna fila nueva — el `INSERT` es
  una sola sentencia, no hay estado parcial que limpiar.

### El `activation_code` es un secreto criptográfico

- **R4**: WHEN se invoca `generateActivationCode()`
  (`backend-pet-tracker/src/modules/devices/application/activation-code.ts`),
  THE SYSTEM SHALL devolver una cadena que casa exactamente con
  `/^PT-[0-9A-HJKMNP-TV-Z]{10}$/` — prefijo `PT-` más 10 caracteres del
  alfabeto Crockford base32 (`0123456789ABCDEFGHJKMNPQRSTVWXYZ`, sin `I`,
  `L`, `O` ni `U` para que no se confundan al teclear desde la caja) —
  derivada de `randomBytes()` de `node:crypto`, es decir ~50 bits de
  entropía criptográfica. THE FUNCTION SHALL tener aridad **cero**
  (`generateActivationCode.length === 0`): por construcción no puede derivar
  el código del IMEI, del serial, del `wialon_unit_id` ni de un contador —
  el IMEI es enumerable/adivinable y si el código se derivara de él
  cualquiera podría reclamar collares ajenos. WHEN se generan 1000 códigos
  seguidos, THE SYSTEM SHALL producir 1000 valores distintos.

### El camino es interno, nunca expuesto al usuario final

- **R5**: THE SYSTEM SHALL NOT añadir ninguna ruta HTTP nueva: tras esta
  feature, el conjunto de rutas registradas por `AppModule` SHALL ser
  idéntico al de antes (verificable porque ningún archivo `*.controller.ts`
  se crea ni se modifica, ver [[design]] §Archivos afectados). El único
  camino de aprovisionamiento es el script de R1, que se ejecuta en la
  terminal de quien administra la plataforma, con acceso a `DATABASE_URL` y
  a `WIALON_TOKEN`. IF `createWialonClient()` resuelve un `FakeWialonClient`
  (es decir, `SIM_MODE` distinto de `'false'`, o `WIALON_TOKEN` ausente /
  vacío / `PENDING`) THEN THE SYSTEM SHALL abortar el script con un error
  explícito **antes** de llamar a Wialon y sin insertar ninguna fila
  (`assertRealWialonClient()`, [[design]] D4): aprovisionar un collar
  `is_simulated=false` validándolo contra el simulador sería un falso
  positivo, y el mensaje de error "esa unidad no existe en la cuenta" sería
  engañoso justo en el flujo que esta feature existe para habilitar.

### Coexistencia con el seed de simulados

- **R6**: WHEN se ejecuta `pnpm -C backend-pet-tracker run seed:devices`
  después de haber aprovisionado uno o más collares reales, THE SYSTEM SHALL
  seguir sembrando SIM-001..003 con `is_simulated=true` exactamente como
  antes y SHALL NOT modificar ni borrar ninguna fila con
  `is_simulated=false` — los dos caminos coexisten en la misma tabla y se
  distinguen **solo** por `is_simulated`. `scripts/seed-devices.ts`,
  `src/db/seed/simulated-devices.ts` y su `onConflictDoNothing` sobre
  `devices.esn` SHALL quedar **sin ninguna modificación** por esta feature.

### El collar aprovisionado es reclamable con el flujo de #7 sin cambios

- **R7**: WHEN un collar aprovisionado por R1 se reclama con
  `POST /v1/devices/claim` enviando `{ petId, activationCode }` con el
  código generado y un JWT del `owner` activo de esa mascota, THE SYSTEM
  SHALL responder `201` y dejar la fila activa en `pet_devices`
  (`released_at IS NULL`) más `devices.status = 'assigned'`, exactamente
  igual que con un collar simulado. Ningún archivo de
  `src/modules/devices/application/` ni de
  `src/modules/devices/infrastructure/` SHALL modificarse para lograrlo
  (`ClaimDeviceUseCase`, `ClaimDeviceDto`, `DeviceDrizzleRepository`,
  `DevicesController` quedan intactos) — si hiciera falta tocarlos, el
  aprovisionamiento estaría produciendo filas que el claim no entiende y el
  requisito falla.

### Documentación de los dos caminos

- **R8**: WHEN se cierra esta feature, `docs/data-model.md` fila `devices`
  SHALL documentar los dos caminos de alta (seed de simulados vs
  aprovisionamiento real) y qué los distingue (`is_simulated`), y
  `docs/wialon-module.md` SHALL documentar que `listUnits()` tiene un
  segundo consumidor además del poller: el script de aprovisionamiento, que
  lo usa como verificación de existencia. Verificable leyendo ambos
  documentos.

## Decisión abierta — cerrarla en el gate humano

**No la inventes: el humano elige y anota su elección aquí antes de aprobar.**

`WialonClient.listUnits()` devuelve hoy solo `{ unitId, name }`
(`src/integrations/wialon/wialon-client.interface.ts`), porque
`WialonHttpClient` llama a `core/search_items` con `flags: 1`
(`SEARCH_UNITS_PARAMS`, `wialon-http.client.ts:11-21`), que es el bloque de
datos **base** de una `avl_unit`. Si la cuenta real expone además el
identificador único del equipo (`uid` en la nomenclatura de Wialon, que en
un tracker GPS es el IMEI), el aprovisionamiento podría leerlo de ahí en vez
de que el humano lo teclee. **Ningún agente ha llamado a la API real ni ha
usado el token** para averiguarlo — por eso queda abierta.

- [X] **Opción A — ELEGIDA por el humano el 2026-08-14.** La spec se
      implementa tal cual, sin enmiendas: el IMEI
      lo teclea el humano en `--imei`, leyéndolo de la etiqueta del collar.
      Coste: cero cambios en el puerto `WialonClient`, cero riesgo de
      suposiciones sobre la API. Riesgo: un typo en el IMEI queda
      persistido; se acepta porque el IMEI **no** es la credencial (R4) y el
      campo que sí importa para la ingesta, `wialon_unit_id`, sí se verifica
      contra la cuenta (R2). Si se elige A, **no hay que tocar nada de esta
      spec**: se implementa tal cual.
- [ ] ~~**Opción B**~~ (descartada 2026-08-14): leer el IMEI de Wialon. Coste detallado en [[design]]
      §Decisión abierta (ampliar `SEARCH_UNITS_PARAMS.flags`, ampliar
      `WialonUnit` con `uniqueId?: string` — puerto compartido con el
      pipeline #8 —, actualizar `FakeWialonClient`, `docs/wialon-module.md`
      y añadir fixture + test de mapeo). Si se elige B, **la spec se enmienda
      antes del handoff a Codex**: R1 gana el sub-caso "sin `--imei`, se
      toma el `uniqueId` de la unidad" y aparece un R9 para el mapeo del
      puerto. [[design]] §Decisión abierta incluye los dos `curl` exactos
      que el humano puede correr para pegar aquí la forma real de un
      `items[]`.

## Fuera de alcance

- **Cualquier cambio en `devices-claim` (#7)**: `ClaimDeviceUseCase`,
  `ClaimDeviceDto`, `DeviceDrizzleRepository`, `DevicesController`,
  `POST /v1/devices/claim` y `DELETE` de release no se tocan (R7).
- **Cualquier cambio en `wialon-ingestion-pipeline` (#8)**:
  `PollerService`, `PositionsConsumerService` y el contrato de eventos no se
  tocan. Bajo la opción A, `WialonUnit` tampoco cambia.
- **Un endpoint HTTP de administración.** Se descarta a propósito: exigiría
  antes un modelo de **rol de plataforma** que hoy no existe —
  `pet_users.role` es rol **por mascota**, no global (ver [[design]] D1).
  Si algún día se quiere el endpoint, esa spec deberá especificar el
  mecanismo de autorización de plataforma explícitamente; esta no lo hace.
- **Suscripciones / facturación del collar** (`device-subscriptions` #25):
  esta feature deja la fila en `devices` y nada más.
- **`src/aws/provisioning.ts`** (aprovisionamiento de recursos AWS): nombre
  parecido, dominio distinto; no se toca.
- **Cambios de schema (DDL)**: `devices` ya tiene todas las columnas
  necesarias; `drizzle-kit generate` no debe producir ninguna migración
  nueva en esta feature (ver [[design]] §Sin migración).
- **Registrar el aprovisionamiento en `audit_log`**: la tabla exige un
  `user_id` de `users` y el script no corre en nombre de ningún usuario de
  la aplicación. Si más adelante hace falta trazabilidad de plataforma, es
  una decisión aparte (probablemente junto con el modelo de rol de
  plataforma que hoy no existe).
- **Ejecutar el script contra la cuenta real de Wialon y contra un collar
  físico**: Codex CLI / el implementer solo lo ejecutan contra la base local
  de Docker con un `WialonClient` de prueba inyectado (ver [[design]] §Test).
  La corrida real, con token y hardware, la hace el humano (`CLAUDE.md`
  §Excepciones).
- **Cerrar el hueco heredado de #7 por el que un `imei` / `esn` /
  `serial_number` adivinado también sirve para reclamar** (ver [[design]]
  §Riesgo heredado de #7): esta feature no lo empeora ni lo arregla —
  requiere tocar `DEVICE_IDENTIFIER_FIELDS`, que es código de #7.
  **Resuelto en el gate el 2026-08-14: escalado a feature nueva #26
  `claim-activation-code-only`**, con su propia spec y su propio gate, por
  el mismo criterio que llevó #22 a separarse de #5 (un cambio de contrato
  público no cabe como apéndice de otra feature). #24 no se bloquea por
  ello.

## Aprobación

- [X] Decisión abierta cerrada — **Opción A**, 2026-08-14
- [X] Riesgo heredado de #7 leído — **escalado a feature nueva #26
      `claim-activation-code-only`**, 2026-08-14
- [X] Aprobado por humano (fecha: 2026-08-14) ← gate obligatorio antes de implementar
