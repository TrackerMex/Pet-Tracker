---
feature: "claim-activation-code-only"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[claim-activation-code-only]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> **Esta spec es el handoff completo para Codex CLI**: no queda ninguna
> decisión abierta. Rutas, símbolos y tests están nombrados exactamente.
> Si algo parece ambiguo al implementar, es un bug de esta spec — pararse y
> reportarlo, no improvisar.

## Estado actual (leído, no supuesto)

| Símbolo | Archivo:línea | Qué hace hoy |
|---|---|---|
| `DEVICE_IDENTIFIER_FIELDS` | `src/modules/devices/domain/repositories/device.repository.ts:10-15` | `['esn','imei','serialNumber','activationCode'] as const`. Dos consumidores en todo el repo: la derivación del tipo (línea 17) y `claim-device.dto.ts` (líneas 24 y 42) |
| `DeviceIdentifierField` | `device.repository.ts:17` | `(typeof DEVICE_IDENTIFIER_FIELDS)[number]` |
| `DeviceIdentifier` | `device.repository.ts:20-23` | `{ field: DeviceIdentifierField; value: string }` |
| `findByIdentifier` | `device.repository.ts:33` (impl. `device.drizzle.repository.ts:35-43`) | Resuelve el campo contra su columna `UNIQUE` vía el mapa `IDENTIFIER_COLUMNS` (`device.drizzle.repository.ts:24-29`). **Único caller hoy**: `claim-device.use-case.ts:56` |
| `ClaimDeviceSchema` | `claim-device.dto.ts:15-36` | `z.object` con `petId` + los 4 identificadores `.optional()`, más un `superRefine` que exige `present.length === 1` |
| `toDeviceIdentifier` | `claim-device.dto.ts:41-51` | Recorre `DEVICE_IDENTIFIER_FIELDS` y devuelve el primero definido |
| Validación HTTP | `devices.controller.ts:38, 55-70` | `parseBody(ClaimDeviceSchema, body)` con `safeParse` explícito → `BadRequestException` con `errors[].path` |

**No existe ningún `ValidationPipe` global**: `grep -rn "useGlobalPipes\|APP_PIPE\|forbidNonWhitelisted\|whitelist" backend-pet-tracker/src` no devuelve nada. Cada controller hace su propio `schema.safeParse(body)` sobre un `z.object` plano (mismo patrón en `pets.controller.ts`). Tampoco hay ni un solo `z.strictObject` en el repositorio. Dato central para D1.

## D1 — Decisión cerrada: opción (a), los tres campos desaparecen del schema y se ignoran en silencio

`feature_list.json` #26 deja abierta la elección entre **(a)** quitarlos del
schema (se ignoran en silencio, precedente `weightKg` en #22) y **(b)**
rechazarlos con `400`. **Se elige (a)**, con `activationCode` pasando de
`.optional()` a **obligatorio** — que es la mitad que de verdad cierra el
hueco.

### En términos de seguridad: (a) y (b) son equivalentes, y (a) no deja rendija

La propiedad de seguridad que hay que garantizar es una sola: *el único valor
que puede seleccionar una fila de `devices` desde el borde HTTP es el
`activation_code`*. Con (a) se cumple por construcción — `z.object` descarta
las claves desconocidas **antes** de que exista un `ClaimDeviceDto`, así que
`toDeviceIdentifier` no tiene de dónde sacar un `imei` ni aunque venga en el
body, y `findByIdentifier` solo puede recibir `field: 'activationCode'`. Los
tres casos que importan:

| Body | Hoy (#7) | Tras esta feature | Por qué |
|---|---|---|---|
| `{ petId, activationCode }` | `201` | `201`, idéntico (R6) | Camino feliz, sin cambios |
| `{ petId, imei }` — **el caso peligroso** | `201`, reclama el collar | `400`, issue en `path: 'activationCode'` (R1b, R2) | `activationCode` es obligatorio; `imei` se descarta y el objeto queda sin la clave requerida. **No hay claim silencioso**: el `400` es por `activationCode` ausente, no por `imei` presente |
| `{ petId, activationCode, imei }` | `400` (el `superRefine` exige exactamente uno) | `201` por el `activationCode`, `imei` ignorado (R1c) | Cambio deliberado: el cliente trae la credencial correcta |

El riesgo que (a) tendría en abstracto — "un campo ignorado en silencio deja
pasar algo" — no aplica aquí precisamente porque el campo que se ignora
**no** es el que decide, y el que decide es obligatorio. Si `activationCode`
se hubiera dejado `.optional()`, (a) sería un agujero (`{petId, imei}` →
`success: true` con `dto.activationCode === undefined` → `findByIdentifier`
con `value: undefined`). Por eso R1 exige explícitamente que
`activationCode` **no** lleve `.optional()`, y por eso la tercera fila de la
tabla de tests de D5 es un test rojo, no una edición de datos.

### En términos de contrato público: (b) costaría una asimetría permanente

1. **(b) no tiene dónde apoyarse.** No hay `ValidationPipe` global con
   `forbidNonWhitelisted`, no hay `z.strictObject` en ningún schema del
   repositorio, y `PetFieldsSchema` (#22 D1) descarta claves desconocidas sin
   error por decisión explícita. Implementar (b) significa un `superRefine`
   nuevo que enumere `['esn','imei','serialNumber']` y los rechace: el
   endpoint `POST /v1/devices/claim` pasaría a ser el único de la API
   estricto sobre claves desconocidas, y solo sobre tres de ellas
   (`{ petId, activationCode, foo: 1 }` seguiría dando `201`). Esa asimetría
   es exactamente la que #22 rechazó por escrito en su
   §Fuera de alcance: *"hacerlo estricto solo para `weightKg` introduciría
   una asimetría sin motivo"*. Aplicar aquí el criterio contrario, con la
   misma forma de problema, dejaría el harness incoherente.
2. **(b) rompe un claim legítimo.** Bajo (b), `{ petId, activationCode, imei }`
   es `400`: un cliente que manda la credencial correcta acompañada de
   metadatos de más se queda sin poder reclamar. Es una regresión de
   disponibilidad a cambio de cero seguridad, porque el `imei` de ese body
   nunca se iba a consultar.
3. **La ventaja de (b) es de DX y ya la da (a).** El argumento a favor de (b)
   es que un cliente viejo reciba "imei ya no se acepta" en vez de
   "activationCode requerido". Pero (a) ya responde `400` con
   `errors: [{ path: 'activationCode', ... }]` (el `parseBody` de
   `devices.controller.ts:60-65` serializa el path), que es accionable: dice
   qué falta. Y el mensaje de #26 que hay que evitar — un claim que *tiene
   éxito* por `imei` — no ocurre en ninguna de las dos opciones.
4. **La población de clientes afectada es cero.** No hay app móvil en este
   repositorio; el único consumidor de `POST /v1/devices/claim` en el árbol
   es `test/devices.e2e-spec.ts`, que se actualiza en esta misma feature. No
   hay a quién dar un mensaje de deprecación.

**Conclusión**: (a). Menos código (el `superRefine` desaparece en vez de
crecer), coherente con el resto de la API, sin regresiones, y con la
propiedad de seguridad garantizada por la obligatoriedad de `activationCode`
en vez de por una lista negra que habría que mantener.

## D2 — `DEVICE_IDENTIFIER_FIELDS` se elimina; `DeviceIdentifierField` conserva sus cuatro miembros

Tres opciones sobre la mesa, y la que pide el criterio de aceptación 4 de
`feature_list.json` #26 ("deja de ser un array de cuatro elementos") admite
más de una lectura. Postura tomada (R5), para que el implementador no elija:

| Opción | Qué pasa | Veredicto |
|---|---|---|
| Reducir a `['activationCode'] as const` | El tipo queda con un miembro; el array sobrevive sin ningún iterador (R1 y R3 borran los dos bucles que lo recorrían) | **Descartada.** Indirección muerta. Y arrastra a `DeviceIdentifierField` a un solo miembro, lo que **rompe** el criterio 5: `IDENTIFIER_COLUMNS` (`device.drizzle.repository.ts:24-29`) dejaría de tener sentido con sus cuatro claves y `findByIdentifier({field:'imei'})` dejaría de compilar — se perdería capacidad del repositorio, que es justo lo que #26 dice que **no** debe pasar |
| Borrar el array y el tipo | `DeviceIdentifier` pasaría a `{ field: string; value: string }` o `findByIdentifier` a un parámetro por columna | **Descartada.** `field: string` deja `IDENTIFIER_COLUMNS[identifier.field]` sin comprobación de tipos — un typo se convierte en `undefined` pasado a `eq()`, error en runtime en vez de en compilación |
| **Borrar el array, declarar el tipo a mano** | `export type DeviceIdentifierField = 'esn' \| 'imei' \| 'serialNumber' \| 'activationCode';` | **Elegida (R5).** Una línea, cero exports nuevos, uno menos que hoy |

Por qué la elegida es la correcta y no solo la más corta:

- **Separa dos cosas que nunca debieron ser una.** `DEVICE_IDENTIFIER_FIELDS`
  servía a dos amos: la lista de columnas por las que el repositorio *puede
  buscar* (dominio, legítima) y la lista de credenciales que el DTO *acepta*
  (borde HTTP, política de autorización). Ese símbolo compartido es
  literalmente el mecanismo del bug: alguien añadió `activationCode` a un
  array que ya tenía tres identificadores de inventario, y el DTO heredó la
  política equivocada gratis. Tras el cambio, la capacidad del repositorio
  vive en el tipo y la política del borde vive en un literal
  `'activationCode'` escrito una sola vez en `claim-device.dto.ts` — para
  volver a abrir el hueco habría que reescribir el DTO a propósito, no basta
  con tocar un array del dominio.
- **Conserva la capacidad del repositorio (criterio 5, R4).** El mapa
  `IDENTIFIER_COLUMNS` de la infraestructura sigue con sus cuatro entradas y
  sigue tipado; `findByIdentifier({ field: 'imei', value })` sigue siendo una
  llamada válida para código interno (un futuro soporte que busque un collar
  por su etiqueta física, o `provision-device.ts` de #24). No se toca ni una
  línea de `device.drizzle.repository.ts`.
- **El array no aporta nada más.** Ningún test ni ningún otro módulo lo
  importa (`grep` confirma: solo `claim-device.dto.ts`). Un `as const` cuyo
  único propósito es derivar un tipo que se puede escribir en la misma línea
  es ceremonia.

El comentario de las líneas 5-9 de `device.repository.ts` ("Columnas por las
que el claim puede buscar un device (R4/R7)") queda **falso** tras el cambio
y se reescribe: pasa a describir el tipo como las columnas `UNIQUE`
buscables **internamente**, con la nota de que el borde HTTP solo acepta
`activationCode` (#26 R1).

## D3 — Forma final del código

### `domain/repositories/device.repository.ts`

Sustituir las líneas 5-17 (el bloque de comentario + `DEVICE_IDENTIFIER_FIELDS`
+ la derivación del tipo) por:

```typescript
/**
 * Columnas UNIQUE de `devices` por las que el repositorio puede buscar
 * (decision D4 de devices-claim): un identificador matchea a lo sumo una
 * fila. OJO: esto es capacidad de busqueda interna, NO politica del borde
 * HTTP — POST /v1/devices/claim acepta unicamente activationCode como
 * credencial (claim-activation-code-only #26, R1).
 */
export type DeviceIdentifierField =
  | 'esn'
  | 'imei'
  | 'serialNumber'
  | 'activationCode';
```

El resto del archivo (`DEVICE_REPOSITORY`, `DeviceIdentifier`,
`ActivePetDevice`, la interface `DeviceRepository` entera) no cambia. El
comentario de la línea 19 (`/** El unico identificador presente en el body
del claim (XOR de R4). */`) también queda falso: pasa a
`/** Identificador con el que se busca la fila de devices. */`.

### `application/dto/claim-device.dto.ts`

El archivo entero queda así (51 líneas → ~30):

```typescript
import { z } from 'zod';
import { DeviceIdentifier } from '@/modules/devices/domain/repositories/device.repository';

/** Codigo de activacion: string no vacio de hasta 64 chars (#26 R1). */
const ActivationCodeSchema = z.string().trim().min(1).max(64);

/**
 * POST /v1/devices/claim: petId UUID + el activation_code del collar, la
 * UNICA credencial de claim (claim-activation-code-only #26, R1). esn,
 * imei y serialNumber dejaron de aceptarse: son enumerables y con hardware
 * real permitian reclamar collares ajenos. Como esto es z.object (no
 * z.strictObject), si llegan se descartan en silencio igual que cualquier
 * otra clave desconocida (#26 D1, opcion (a)) — nunca reclaman nada,
 * porque activationCode es obligatorio.
 */
export const ClaimDeviceSchema = z.object({
  petId: z.uuid(),
  activationCode: ActivationCodeSchema,
});

export type ClaimDeviceDto = z.infer<typeof ClaimDeviceSchema>;

/** El schema garantiza activationCode presente (#26 R1, R3). */
export function toDeviceIdentifier(dto: ClaimDeviceDto): DeviceIdentifier {
  return { field: 'activationCode', value: dto.activationCode };
}
```

Notas: desaparecen el import de `DEVICE_IDENTIFIER_FIELDS`, el `superRefine`
entero y el `throw new Error('ClaimDeviceDto without device identifier')`
(inalcanzable). `IdentifierSchema` se renombra a `ActivationCodeSchema` (era
local, no exportado — nadie más lo importa); mantener el nombre viejo
también sería válido, pero el nuevo no miente.

### `application/use-cases/claim-device.use-case.ts` — cero cambios (R3)

`toDeviceIdentifier(dto)` sigue devolviendo un `DeviceIdentifier`, así que la
línea 56 compila igual. `git diff --stat` **no debe listar este archivo**.

### `infrastructure/` — cero cambios (R4, R6)

`devices.controller.ts`, `device-error.mapper.ts`, `device-status.mapper.ts`,
`device.drizzle.repository.ts` y `pet-device.drizzle.reader.ts` no se tocan.

### Comentarios de otros archivos que quedan falsos

- `src/db/schema/devices.schema.ts:16-18`: *"el claim busca por cualquiera de
  esn/imei/serial_number/activation_code"* → reescribir a que el claim busca
  solo por `activation_code` (#26) y que las otras tres son `UNIQUE` por
  inventario. Es un comentario, no DDL: **no hay migración** en esta feature.
- `docs/data-model.md:51` — es R8, requisito con su propia fila de
  trazabilidad.

## D4 — Estrategia para `test/devices.e2e-spec.ts`

El archivo tiene **24 llamadas a `claim(...)` que hoy mandan `esn`**, más 3
assertions de respuesta que también contienen `esn: device.esn` y que **no**
se tocan (`esn` es salida, no credencial). Sin cuidado, un find/replace
global rompe el contrato de respuesta.

**Regla mecánica, sin ambigüedad**: sustituir `esn: <x>.esn` por
`activationCode: <x>.activationCode` **solo** dentro del objeto literal que
se pasa como segundo argumento a `claim(...)`. Las tres ocurrencias que
quedan tal cual están dentro de un `toEqual({...})` y son, por número de
línea del archivo actual:

- `L295` — `describe('R3: claim feliz …')`, cuerpo esperado del `201`
- `L565` — `describe('R11: GET /v1/pets/:petId/device …')`
- `L661` — `describe('R12: el perfil GET /v1/pets/:petId rellena la clave device')`

Igual de intocables: el bloque `describe('R2: seed:devices …')` (L145-273) y
su assertion de `esn`/`activationCode` de los `SIM-001..003` (L172-198), y la
constante `CLAIM_KEYS` (L250-256), que incluye `'esn'` porque es una de las 5
claves de la respuesta.

**`seedDevice()` (L88-105) pasa a poblar los cuatro identificadores**, para
que R2 y R4 tengan valores reales con los que atacar (las cuatro columnas son
`varchar(64) UNIQUE` nullable, `src/db/schema/devices.schema.ts:29-32`, así
que los patrones con `RUN_ID` caben de sobra):

```typescript
await db.insert(devices).values({
  id,
  esn: `E2E-${label}-${RUN_ID}`,
  imei: `IMEI-${label}-${RUN_ID}`,
  serialNumber: `SER-${label}-${RUN_ID}`,
  activationCode: `ACT-${label}-${RUN_ID}`,
  model: 'e2e-collar',
  isSimulated: true,
  ...overrides,
});
```

`seedDevice()` devuelve la fila leída de la base, así que
`device.activationCode` es `string | null` para TypeScript; el helper
`claim(user, body)` acepta `Record<string, unknown>`, de modo que **no hay
error de compilación** y no hace falta ningún `!` ni cast. No introducir
helpers nuevos para esto.

Para el test de R4 (capacidad del repositorio) hay que añadir dos imports al
principio del archivo:

```typescript
import { DEVICE_REPOSITORY } from '@/modules/devices/domain/repositories/device.repository';
import type { DeviceRepository } from '@/modules/devices/domain/repositories/device.repository';
```

y obtener el repositorio del contenedor ya construido en el `beforeAll`
existente (`app.get<DeviceRepository>(DEVICE_REPOSITORY)`), igual que el
archivo ya hace con `DRIZZLE` y `TOKEN_SERVICE` (L121-122).

**Infra**: `test/devices.e2e-spec.ts` necesita Postgres arriba
(`docker compose up -d` desde la raíz) — en la sesión que escribió esta spec
`init.sh` los saltó por Docker apagado. Si `docker port` no muestra el puerto
publicado de Postgres, ver la nota de memoria del proyecto sobre contenedores
viejos con `PortBindings` inválido: el runner **salta** los e2e en silencio y
un "verde" así no vale como evidencia.

## D5 — Tests de #7 que cambian (inventario completo y normativo, R7)

Barrido: `grep -rn "esn\|imei\|serialNumber" ` sobre los tres archivos de
test que tocan el claim. **Ninguna fila se borra sin reemplazo nombrado.**
Las filas marcadas 🔴 cambian el comportamiento esperado y necesitan el ciclo
rojo→verde completo (el test editado debe fallar contra el código actual
antes de tocar `src/`); las marcadas ⚪ son ediciones de datos de prueba sin
cambio de intención.

### `src/modules/devices/application/dto/claim-device.dto.spec.ts`

| # | Ubicación | Qué decía antes | Qué debe decir después |
|---|---|---|---|
| 1 🔴 | L6-16, `it.each(['esn','imei','serialNumber','activationCode'])('acepta petId + %s como unico identificador')` | Los 4 campos parsean OK | Sustituido por dos `it` en el mismo `describe`, renombrado a `describe('R1 (claim-activation-code-only #26): ClaimDeviceSchema exige petId UUID y activationCode')`: (i) `it('acepta petId + activationCode (R1a)')` → `safeParse({petId: PET_ID, activationCode: 'ACT-001'})` `success: true` y `Object.keys(result.data).sort()` es `['activationCode','petId']`; (ii) `it.each(['esn','imei','serialNumber'])('rechaza petId + %s sin activationCode (R1b)')` → `success: false` **y** `result.error.issues.some(i => i.path[0] === 'activationCode')` es `true` |
| 2 🔴 | L18-28, `it('recorta espacios del identificador')` | `esn: '  SIM-001  '` → `result.data.esn === 'SIM-001'` | Mismo test con `activationCode: '  ACT-001  '` → `result.data.activationCode === 'ACT-001'`. Es 🔴: contra el código actual el `esn` del test sigue existiendo, contra el nuevo `result.data.esn` es `undefined` |
| 3 ⚪ | L30-36, `it('rechaza petId ausente y petId no-UUID')` | Usaba `esn: 'SIM-001'` | Cambiar las dos apariciones a `activationCode: 'ACT-001'` (sigue `false` por el `petId`, pero ahora por la razón correcta) |
| 4 ⚪ | L38-40, `it('rechaza cero identificadores presentes')` | `{petId}` solo → `false` | Renombrar a `it('rechaza body sin activationCode (R1b #26)')`; el cuerpo no cambia |
| 5 🔴 | L42-50, `it('rechaza dos identificadores presentes')` | `{petId, esn, imei}` → `false` por el XOR | Sustituido por `it('ignora imei/esn/serialNumber si vienen junto al activationCode (R1c #26)')`: `safeParse({petId: PET_ID, activationCode: 'ACT-001', esn: 'SIM-001', imei: '123456789012345', serialNumber: 'SER-1'})` → `success: true`, y `'imei' in result.data` / `'esn' in result.data` / `'serialNumber' in result.data` los tres `false` |
| 6 ⚪ | L52-63, `it('rechaza identificador vacio, no-string o de mas de 64 caracteres')` | Los 3 casos sobre `esn` | Los mismos 3 casos sobre `activationCode` (`'   '`, `12345`, `'x'.repeat(65)`). Obligatorio cambiarlo: dejándolo en `esn` el test seguiría verde pero probando otra cosa (el `400` vendría del `activationCode` ausente) |
| 7 ⚪ | L66-78, `describe('R4: toDeviceIdentifier extrae el unico identificador presente')` | Ya usa `activationCode` y espera `{field:'activationCode', value:'ACT-001'}` | El cuerpo del `it` **no cambia** — ya es exactamente la aserción de R3 #26. Renombrar el `describe` a `describe('R3 (claim-activation-code-only #26): toDeviceIdentifier devuelve siempre activationCode')` |

### `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts`

| # | Ubicación | Qué decía antes | Qué debe decir después |
|---|---|---|---|
| 8 ⚪ | L22, `const DTO = { petId: PET_ID, esn: 'SIM-001' };` | DTO de prueba por `esn` | `const DTO = { petId: PET_ID, activationCode: 'ACT-001' };`. Obligatorio: `ClaimDeviceDto` pierde la propiedad `esn` y el literal deja de compilar (excess property). Los ~10 `it` del archivo usan `DTO` y no necesitan más cambios |
| 9 🔴 | L106-109, `expect(deps.findByIdentifier).toHaveBeenCalledWith({field:'esn', value:'SIM-001'})` | El use case buscaba por `esn` | `toHaveBeenCalledWith({ field: 'activationCode', value: 'ACT-001' })` |
| — | L24-43 `buildDevice()` | Ya trae `activationCode: 'ACT-001'` y `imei: null` | **Sin cambios** |

### `test/devices.e2e-spec.ts`

| # | Ubicación | Qué decía antes | Qué debe decir después |
|---|---|---|---|
| 10 ⚪ | L88-105, `seedDevice()` | Solo poblaba `esn` | Poblar los 4 identificadores (código exacto en D4) |
| 11 🔴 | Las 24 llamadas a `claim(...)` con `esn:` — L284, 330, 334, 357, 364, 384, 401, 416, 420, 428, 442, 457, 458, 483, 487, 508, 530, 553, 646, 674, 709, 736, 772, 795 | Reclamaban por `esn` | `activationCode: <x>.activationCode` (regla de D4). Excepción **L401** (`describe('R7: identificador sin device…')`): pasa a `activationCode: \`NOPE-${RUN_ID}\`` — sigue siendo un código que no existe, y sigue esperando `404 DEVICE_NOT_FOUND` |
| 12 🔴 | L324-344, `describe('R4: body invalido responde 400…')`, `it('rechaza petId no-UUID, cero identificadores y dos identificadores')` | 3 llamadas: `{petId:'not-a-uuid', esn}`, `{petId}`, `{petId, esn, imei}` — la tercera `400` por el XOR | Renombrar el `it` a `'rechaza petId no-UUID, activationCode ausente y solo-identificadores-viejos'`. Llamadas: `{petId:'not-a-uuid', activationCode: device.activationCode}` → `400`; `{petId: pet.id}` → `400`; **conservar** `{petId: pet.id, esn: device.esn, imei: '123456789012345'}` → sigue `400`, ahora por `activationCode` ausente (#26 R1b). La assertion final de cero filas en `pet_devices` no cambia |
| 13 | L295, L565, L661 (`esn: device.esn` dentro de `toEqual`) y L250-256 (`CLAIM_KEYS`) y L145-273 (`describe('R2: seed:devices…')`) | Contrato de **respuesta** y seed | **Sin cambios** — R6 los usa como prueba de que la salida no se movió |

### Tests nuevos de esta feature (no son de #7)

Los tres nuevos `describe` van en `test/devices.e2e-spec.ts`, después del
bloque `R4` existente:

- `describe('R2 (claim-activation-code-only #26): imei, esn y serialNumber no reclaman nada')`
  → `it.each(['imei','esn','serialNumber'])`: `owner` + mascota + device
  sembrado; `claim(owner, { petId: pet.id, [field]: device[field] })` →
  `400`; cero filas en `pet_devices` con ese `device_id`; `devices.status`
  sigue `'available'`; cero entradas `device.claim` en `audit_log` con ese
  `entityId`. Luego, en el mismo `it`,
  `claim(owner, { petId: pet.id, activationCode: device.activationCode })`
  → `201` (el device estaba sano; el `400` era por credencial). Usar un
  device y una mascota nuevos por cada `field` para que el `201` final de
  una iteración no contamine la siguiente.
- `describe('R1c (claim-activation-code-only #26): un imei ajeno junto al activationCode correcto se ignora')`
  → sembrar `victim` y `attackerDevice`; `claim(owner, { petId, activationCode: attackerDevice.activationCode, imei: victim.imei })` → `201`, y la
  fila de `pet_devices` apunta a `attackerDevice.id`, **no** a `victim.id`;
  `victim` sigue `'available'` y sin fila.
- `describe('R4 (claim-activation-code-only #26): findByIdentifier sigue buscando por los 4 campos')`
  → con el repositorio del contenedor, `findByIdentifier({field:'imei', value: device.imei})`,
  `{field:'esn', ...}`, `{field:'serialNumber', ...}` y
  `{field:'activationCode', ...}` devuelven los cuatro el mismo `Device` con
  `id === device.id`; `{field:'imei', value:'no-existe'}` devuelve `null`.

## Archivos afectados

### domain

- `backend-pet-tracker/src/modules/devices/domain/repositories/device.repository.ts`
  — borrar `DEVICE_IDENTIFIER_FIELDS`, declarar `DeviceIdentifierField` como
  unión literal, reescribir los comentarios de L5-9 y L19 (R4, R5).

### application

- `backend-pet-tracker/src/modules/devices/application/dto/claim-device.dto.ts`
  — schema con `petId` + `activationCode` obligatorio, sin `superRefine`;
  `toDeviceIdentifier` de una línea (R1, R3).
- `backend-pet-tracker/src/modules/devices/application/dto/claim-device.dto.spec.ts`
  — filas 1-7 de D5.
- `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.spec.ts`
  — filas 8-9 de D5.
- `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.ts`
  — **NO se toca** (R3).

### infrastructure

- Ninguno. `devices.controller.ts`, `device.drizzle.repository.ts` y los
  mappers no se tocan (R4, R6).
- `backend-pet-tracker/src/db/schema/devices.schema.ts` — solo el comentario
  de L16-18; ninguna columna, ninguna migración.

### test / docs

- `backend-pet-tracker/test/devices.e2e-spec.ts` — filas 10-13 de D5 más los
  tres `describe` nuevos.
- `docs/data-model.md` fila `devices` (L51) — R8.

## Alternativas descartadas

- **Opción (b): rechazar `imei`/`esn`/`serialNumber` con `400`.** Ver D1:
  asimetría con el resto de la API (no hay `strictObject` ni whitelist
  global en ningún sitio), regresión de disponibilidad para el body
  `{petId, activationCode, imei}`, y cero ganancia de seguridad sobre (a).
- **Dejar `activationCode` como `.optional()` y confiar en que los otros tres
  ya no están.** Es el error sutil que convertiría (a) en un agujero:
  `{petId, imei}` parsearía con `success: true` y `findByIdentifier` recibiría
  `value: undefined`. R1 lo prohíbe explícitamente.
- **Reducir `DEVICE_IDENTIFIER_FIELDS` a `['activationCode']`** (la opción 3
  literal de `specs/device-provisioning-admin/design.md` §Riesgo heredado):
  ver D2 — arrastraría `DeviceIdentifierField` a un solo miembro y le
  quitaría al repositorio la capacidad que el criterio 5 de #26 exige
  conservar.
- **Borrar las columnas `imei`/`esn`/`serial_number` de `devices`.** Siguen
  siendo el vínculo entre la fila y la etiqueta física del collar (#24 R1 los
  puebla desde `provision:device`) y `esn` es parte del contrato de respuesta
  de `DeviceStatusResponse`. Quitar la credencial no es quitar el dato.
- **Un endpoint nuevo `POST /v1/devices/claim-v2`** dejando el viejo intacto:
  el viejo seguiría siendo explotable, que es justo lo que hay que cerrar. El
  cambio incompatible es el punto de la feature, no un efecto colateral.
- **Añadir rate limiting al claim en esta feature.** Con `activation_code` de
  ~50 bits (#24 R4) no es la mitigación que falta; mezclarlo aquí ampliaría
  el alcance sin cerrar nada más. Fuera de alcance en [[requirements]].
