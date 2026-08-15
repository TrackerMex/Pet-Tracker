---
feature: "device-provisioning-admin"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[device-provisioning-admin]]

> Ver [[requirements]] y [[../../docs/architecture|architecture]].
>
> Esta spec está escrita para ser **autosuficiente**: quien implemente
> (Codex CLI) no tiene acceso a la conversación que la originó. Toda ruta,
> símbolo y assertion que aparece aquí es literal.

## D1 — Script CLI, no endpoint admin

`feature_list.json` #24 deja la forma abierta. Se elige **script CLI
idempotente**, no endpoint HTTP:

1. **No hay modelo de rol de plataforma.** El único rol del sistema es
   `pet_users.role` (`'owner' | 'caretaker' | ...`), que es rol **por
   mascota**: `ClaimDeviceUseCase` lo consulta con
   `pets.findMembership(petId, userId)`. No existe ninguna noción de
   "administrador de la plataforma" ni tabla donde vivir. Un endpoint
   `POST /v1/admin/devices` necesitaría inventar ese mecanismo
   (¿tabla `platform_admins`? ¿claim en el JWT? ¿API key aparte?) — es una
   feature mayor que el aprovisionamiento en sí, y hacerlo mal deja una ruta
   de alta de collares accesible con un JWT normal.
2. **Hay precedente directo en el repo** para scripts de datos standalone:
   `scripts/seed-devices.ts`, `scripts/seed-vaccines.ts`,
   `scripts/backfill-weights.ts`, `scripts/provision-local.ts`. Todos con el
   mismo molde (`loadDotenv` + `Pool` + `drizzle` + función exportada y
   testeada aparte del `main()`).
3. **La superficie de ataque es cero**: no hay ruta que autorizar porque no
   hay ruta. Quien puede correr el script ya tiene `DATABASE_URL` y
   `WIALON_TOKEN` en las manos (R5).

## D2 — Dónde vive cada pieza

`scripts/` está fuera del layout de capas de `docs/architecture.md` (no es
`domain`/`application`/`infrastructure` de ningún módulo), igual que los
otros cuatro scripts: escriben con Drizzle directamente, sin pasar por
`DeviceRepository`. Eso es deliberado y ya es la convención — el script no
es parte de la aplicación desplegada.

Lo único que **sí** entra en `src/` es el generador del `activation_code`,
por dos razones: es una regla de negocio (el formato del secreto impreso en
la caja) y necesita **test unitario**, y el jest de unidad solo mira
`rootDir: src` (`package.json` §jest, `testRegex: .*\.spec\.ts$`) — un
archivo en `scripts/` solo puede testearse desde `test/*.e2e-spec.ts`.

Precedente exacto de un helper criptográfico en capa `application`:
`src/modules/auth/application/verification-token.ts`
(`randomBytes` de `node:crypto`, funciones puras exportadas, sin decoradores
de Nest). Se copia ese molde.

| Pieza | Ruta | Capa |
|---|---|---|
| Generador del código | `backend-pet-tracker/src/modules/devices/application/activation-code.ts` | `application` (devices) |
| Test unitario del generador | `backend-pet-tracker/src/modules/devices/application/activation-code.spec.ts` | — |
| Script de aprovisionamiento | `backend-pet-tracker/scripts/provision-device.ts` | fuera de capas (convención de `scripts/`) |
| Test del script | `backend-pet-tracker/test/provision-device.e2e-spec.ts` | — |

## D3 — `generateActivationCode()`: Crockford base32 sobre `randomBytes`

`backend-pet-tracker/src/modules/devices/application/activation-code.ts`:

```typescript
import { randomBytes } from 'node:crypto';

/**
 * Crockford base32 sin I/L/O/U: 32 simbolos exactos, asi que `byte % 32` es
 * uniforme (256 es multiplo de 32, no hay sesgo de modulo) y ningun caracter
 * se confunde con otro al teclearlo desde la caja del collar.
 */
export const ACTIVATION_CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export const ACTIVATION_CODE_PREFIX = 'PT-';
export const ACTIVATION_CODE_BODY_LENGTH = 10;

/**
 * Secreto impreso en la caja del collar (device-provisioning-admin R4): 10
 * simbolos de base32 = 50 bits de entropia criptografica. Aridad cero a
 * proposito — no puede derivar del IMEI ni del serial ni de un contador,
 * que serian enumerables y permitirian reclamar collares ajenos.
 */
export function generateActivationCode(): string {
  return (
    ACTIVATION_CODE_PREFIX +
    Array.from(
      randomBytes(ACTIVATION_CODE_BODY_LENGTH),
      (byte) => ACTIVATION_CODE_ALPHABET[byte % ACTIVATION_CODE_ALPHABET.length],
    ).join('')
  );
}
```

13 caracteres en total, holgadamente dentro de `varchar(64)` de
`devices.activation_code`. El prefijo `PT-` no colisiona con los `ACT-00x`
de los simulados (R6), así que un vistazo a la columna sigue distinguiendo
seed de aprovisionamiento sin mirar `is_simulated`.

**No se añade dependencia nueva**: `node:crypto` es stdlib y ya se usa en
`verification-token.ts`.

## D4 — `scripts/provision-device.ts`

Molde de `scripts/backfill-weights.ts`: función exportada (testeable, recibe
`db` y el cliente por parámetro) + `main()` que hace el cableado y el
parseo de argumentos. Contenido de referencia:

```typescript
import { parseArgs } from 'node:util';
import { ConfigService } from '@nestjs/config';
import { config as loadDotenv } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { uuidv7 } from 'uuidv7';
import { devices } from '@/db/schema/devices.schema';
import { createWialonClient } from '@/integrations/wialon/wialon.factory';
import { WialonHttpClient } from '@/integrations/wialon/wialon-http.client';
import type { WialonClient } from '@/integrations/wialon/wialon-client.interface';
import { generateActivationCode } from '@/modules/devices/application/activation-code';

export interface ProvisionDeviceInput {
  wialonUnitId: string;
  imei?: string;
  serialNumber?: string;
  esn?: string;
  model?: string;
}

export interface ProvisionDeviceResult {
  created: boolean;
  deviceId: string;
  activationCode: string | null;
}

/** La unidad pedida no esta en la cuenta de Wialon (R2). */
export class WialonUnitNotFoundError extends Error {
  constructor(
    readonly unitId: string,
    readonly visibleUnits: number,
  ) {
    super(
      `wialon unit "${unitId}" no existe en la cuenta ` +
        `(${visibleUnits} unidades visibles); no se inserto ninguna fila`,
    );
    this.name = 'WialonUnitNotFoundError';
  }
}

/** El factory resolvio el simulador — aprovisionar contra el es un falso positivo (R5). */
export class SimulatedWialonClientError extends Error {
  constructor() {
    super(
      'provision-device exige la API real de Wialon: pon SIM_MODE=false y un ' +
        'WIALON_TOKEN real en .env (hoy resuelve FakeWialonClient)',
    );
    this.name = 'SimulatedWialonClientError';
  }
}

export function assertRealWialonClient(client: WialonClient): void {
  if (!(client instanceof WialonHttpClient)) {
    throw new SimulatedWialonClientError();
  }
}

/**
 * Da de alta un collar fisico en `devices` (R1-R3). Idempotente por
 * `wialon_unit_id`: si ya existe no toca nada — regenerar el
 * activation_code invalidaria la caja ya impresa.
 */
export async function provisionDevice(
  db: NodePgDatabase,
  wialon: WialonClient,
  input: ProvisionDeviceInput,
): Promise<ProvisionDeviceResult> {
  const [existing] = await db
    .select()
    .from(devices)
    .where(eq(devices.wialonUnitId, input.wialonUnitId));

  if (existing) {
    return {
      created: false,
      deviceId: existing.id,
      activationCode: existing.activationCode,
    };
  }

  // R2: la verificacion va ANTES del insert, siempre.
  const units = await wialon.listUnits();
  if (!units.some((unit) => unit.unitId === input.wialonUnitId)) {
    throw new WialonUnitNotFoundError(input.wialonUnitId, units.length);
  }

  const row = {
    id: uuidv7(),
    wialonUnitId: input.wialonUnitId,
    imei: input.imei ?? null,
    serialNumber: input.serialNumber ?? null,
    esn: input.esn ?? null,
    model: input.model ?? null,
    activationCode: generateActivationCode(),
    status: 'available',
    isSimulated: false,
  };

  await db.insert(devices).values(row);

  return {
    created: true,
    deviceId: row.id,
    activationCode: row.activationCode,
  };
}

/**
 * Excepcion documentada (misma que seed-devices.ts / provision-local.ts):
 * script standalone fuera del bootstrap de Nest — carga el .env raiz con
 * dotenv y lee DATABASE_URL de process.env. `new ConfigService()` sin
 * argumentos cae a process.env, que es justo lo que createWialonClient()
 * necesita: se reutiliza el factory de #8 en vez de duplicar aqui la regla
 * de SIM_MODE/WIALON_TOKEN/base URL.
 */
async function main(): Promise<void> {
  loadDotenv({ path: '../.env' });

  const { values } = parseArgs({
    options: {
      'unit-id': { type: 'string' },
      imei: { type: 'string' },
      serial: { type: 'string' },
      esn: { type: 'string' },
      model: { type: 'string' },
    },
  });

  const wialonUnitId = values['unit-id'];
  if (!wialonUnitId) {
    throw new Error(
      'falta --unit-id: pnpm run provision:device -- --unit-id <wialon unit id> [--imei ...] [--serial ...] [--esn ...] [--model ...]',
    );
  }

  const wialon = createWialonClient(new ConfigService());
  assertRealWialonClient(wialon);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const result = await provisionDevice(drizzle(pool), wialon, {
      wialonUnitId,
      imei: values.imei,
      serialNumber: values.serial,
      esn: values.esn,
      model: values.model,
    });

    // eslint-disable-next-line no-console
    console.log(
      result.created
        ? `provision-device: alta OK, device ${result.deviceId}, activation_code ${result.activationCode}`
        : `provision-device: ya estaba dado de alta, device ${result.deviceId}, activation_code ${result.activationCode} (sin cambios)`,
    );
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('provision-device failed:', error);
    process.exitCode = 1;
  });
}
```

Notas de diseño:

- **`parseArgs` de `node:util`** (stdlib, estable en Node 24, que es el
  runtime de esta máquina) en vez de añadir `commander`/`yargs`: cinco flags
  de tipo string no justifican una dependencia. `parseArgs` toma
  `process.argv.slice(2)` por defecto, que con
  `ts-node ... scripts/provision-device.ts --unit-id 123` es exactamente
  `['--unit-id', '123']`.
- **El orden `SELECT` existente → `listUnits()` → `INSERT` importa**: en el
  camino idempotente (R3) no se llama a Wialon en absoluto (no hay nada que
  verificar, no se va a insertar); en el camino de alta, `listUnits()` es
  siempre anterior al `INSERT` (R2). El test de R2 comprueba las dos cosas:
  el error y que el conteo de filas no cambió.
- **Sin `onConflictDoNothing`**: la colisión por `wialon_unit_id` ya la
  resuelve el `SELECT` previo, y una colisión por `imei`/`esn`/
  `serial_number` **debe** fallar ruidosamente (R3) — silenciarla dejaría al
  humano creyendo que dio de alta un collar que no existe en la tabla.
  Postgres permite múltiples `NULL` en un índice UNIQUE, así que aprovisionar
  varios collares sin `--imei` no colisiona entre sí.
- **`status: 'available'` explícito** aunque la columna ya tenga ese
  default: es una assertion del requisito, no una casualidad del schema.
- **`ponytail:` techo conocido** — hay una ventana entre el `SELECT` y el
  `INSERT` en la que dos ejecuciones simultáneas del script con el mismo
  `--unit-id` podrían intentar insertar las dos; la segunda muere con el
  `23505` del índice UNIQUE de `wialon_unit_id`, así que el peor caso es un
  error, nunca una fila duplicada. Es un script manual de una terminal; si
  algún día se automatiza, la subida es un `INSERT ... ON CONFLICT
  (wialon_unit_id) DO NOTHING RETURNING *` seguido de un `SELECT` de
  recuperación.

`backend-pet-tracker/package.json`, junto a los otros scripts:

```json
"provision:device": "ts-node -r tsconfig-paths/register scripts/provision-device.ts"
```

Uso (desde la raíz del repo):

```
pnpm -C backend-pet-tracker run provision:device -- --unit-id 12345678 --imei 861234567890123 --model tk-star-v1
```

## D5 — Nada del flujo de claim cambia (R7)

`ClaimDeviceUseCase` busca con
`DeviceDrizzleRepository.findByIdentifier({ field: 'activationCode', value })`
sobre la columna UNIQUE `devices.activation_code`. Una fila aprovisionada
tiene esa columna poblada, `status = 'available'` y ninguna fila en
`pet_devices`, que es exactamente el estado que el claim espera
(`hasActiveAssignment()` → `false`). Por eso **ningún archivo de
`src/modules/devices/application/` ni de
`src/modules/devices/infrastructure/` se toca**: el aprovisionamiento
produce filas indistinguibles, para el claim, de las del seed — salvo por
`is_simulated`, que el claim no consulta.

`devices.ingest_watermark` se deja en `NULL`: lo fija el claim
(`now - CLAIM_WATERMARK_LOOKBACK_MINUTES`, 10 min) y lo avanza el poller de
#8. Escribirlo en el aprovisionamiento adelantaría la ventana de ingesta de
un collar que aún no está asignado a ninguna mascota, sin ningún beneficio.

## Riesgo heredado de #7 — para conocimiento del humano en el gate

`DEVICE_IDENTIFIER_FIELDS` (`src/modules/devices/domain/repositories/device.repository.ts`)
es `['esn', 'imei', 'serialNumber', 'activationCode']`: el claim de #7 acepta
**cualquiera de los cuatro** como credencial, no solo el `activation_code`.
Un IMEI es enumerable, así que hoy quien adivine el IMEI de un collar puede
reclamarlo aunque nunca haya visto la caja.

Esto **ya es cierto** para los simulados (`SIM-001` es tan adivinable como
un IMEI) y esta feature no lo empeora — pero sí lo hace tocar hardware real
por primera vez. Opciones, en orden de coste:

1. **Aceptarlo para el piloto** y no pasar `--imei` (la columna es nullable;
   sin IMEI almacenado no hay credencial que adivinar). Coste: cero; se
   pierde el vínculo entre la fila y la etiqueta física.
2. **Aceptarlo y almacenar el IMEI** (lo que asume R1 por defecto): el
   vínculo con el hardware queda, el hueco sigue abierto.
3. **Cerrarlo**: reducir `DEVICE_IDENTIFIER_FIELDS` a `['activationCode']`
   y ajustar `ClaimDeviceDto`/`toDeviceIdentifier` + sus tests. Es código de
   #7, **fuera de alcance de esta spec** (R7 exige explícitamente no
   tocarlo): sería una entrada nueva en `feature_list.json`.

Decisión del humano en el gate. La spec se implementa igual bajo 1 y 2.

## Decisión abierta — de dónde sale el IMEI

Ver [[requirements]] §Decisión abierta para la elección. Aquí el coste
técnico de cada opción.

### Qué devuelve hoy `listUnits()`

`WialonHttpClient.listUnits()` llama a `core/search_items` con
`SEARCH_UNITS_PARAMS` (`wialon-http.client.ts:11-21`):

```typescript
{ spec: { itemsType: 'avl_unit', propName: 'sys_name', propValueMask: '*',
          sortType: 'sys_name' }, force: 1, flags: 1, from: 0, to: 0 }
```

y mapea `items[].id → unitId`, `items[].nm → name`. `flags` es una **máscara
de bits de bloques de datos** de la unidad; `1` es el bloque **base**
(`id`, `nm`, `cls`, `mu`, `uacl`). El identificador único del equipo (`uid`,
que en un tracker GPS es el IMEI) **no** está en ese bloque: vive en el
bloque de propiedades avanzadas/restringidas de la unidad, junto a `hw`
(tipo de hardware) y `ph` (teléfono de la SIM). En la documentación de
Wialon ese bloque suele figurar como `0x00000100` (256), lo que daría
`flags: 257`.

**Ese valor no está verificado contra la cuenta real**: escribir la spec no
incluyó ninguna llamada a la API ni uso del token (regla explícita del
encargo). Tampoco está verificado que el token de la cuenta tenga el bit de
ACL necesario para leer propiedades restringidas — un token sin ese permiso
devuelve la unidad **sin** el campo, sin error, con lo que el script
necesitaría el fallback `--imei` de todas formas.

### Cómo cerrar la decisión sin que la cierre un agente

El humano corre estos dos `curl` (login por token + búsqueda con el bloque
avanzado) y pega en esta sección las claves de **un** elemento de `items[]`:

```bash
curl -s -X POST 'https://hst-api.wialon.com/wialon/ajax.html' \
  -d 'svc=token/login' --data-urlencode 'params={"token":"<TOKEN>"}'
# -> copia el valor de "eid" y usalo como <SID>

curl -s -X POST 'https://hst-api.wialon.com/wialon/ajax.html' \
  -d 'svc=core/search_items' -d 'sid=<SID>' --data-urlencode \
  'params={"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"sys_name"},"force":1,"flags":257,"from":0,"to":0}'
```

Si el `items[0]` resultante trae `uid` (o `uid2`) con el IMEI del collar →
opción B es viable. Si no lo trae con `flags: 257`, o si sale `{"error":N}`
→ opción A y punto.

### Coste de la opción B, si se elige

1. `SEARCH_UNITS_PARAMS.flags`: `1` → el valor confirmado por el `curl`
   (`257` si la hipótesis se confirma). Afecta también al poller de #8, que
   llama al mismo `listUnits()`; una respuesta con más campos no lo rompe
   (mapea solo `id`/`nm`), pero es un cambio en una ruta caliente que hoy
   está verde.
2. `WialonUnit` (`wialon-client.interface.ts`) gana `uniqueId?: string`.
   **Opcional**, para no romper a `FakeWialonClient` ni a los mocks de
   `poller.service.spec.ts` (`listUnits: jest.fn().mockResolvedValue([])`).
3. `WialonHttpClient.listUnits()` mapea `item.uid → uniqueId`; nuevo fixture
   `src/integrations/wialon/__fixtures__/wialon-search-items.json` con la
   respuesta real anonimizada + un caso en `wialon-http.client.spec.ts` que
   afirme el mapeo y los `flags` nuevos.
4. `FakeWialonClient.listUnits()` devuelve un `uniqueId` sintético por
   unidad simulada (o lo omite, si se prefiere que el fake no invente
   IMEIs).
5. `docs/wialon-module.md`: actualizar el bloque de la interfaz y la tabla
   de `core/search_items`.
6. R1 gana el sub-caso "si no se pasó `--imei`, se usa el `uniqueId` de la
   unidad verificada en R2; si Wialon tampoco lo trae, `imei` queda `NULL`"
   y aparece un R9 para el mapeo del puerto, con su test.

Coste estimado: ~4 archivos de `src/` más 2 de tests, tocando un puerto
compartido con una feature `done`. Frente al beneficio (ahorrar un tecleo de
15 dígitos por collar), por eso la opción A es el **default** de esta spec.

## Sin migración

`devices` ya tiene las cinco columnas de identificador, `model`, `status`,
`is_simulated` y los timestamps que esta feature necesita
(`src/db/schema/devices.schema.ts`, migración de #7). No cambia ni un tipo
ni una restricción: `drizzle-kit generate` **no debe** producir ningún
archivo nuevo en `src/db/migrations/`. El aprovisionamiento es DML, como
`seed-devices.ts` / `backfill-weights.ts`.

## Test — `test/provision-device.e2e-spec.ts`

Mismo arnés que `test/devices.e2e-spec.ts` (`Test.createTestingModule({
imports: [AppModule] })`, `app.setGlobalPrefix('v1')`, `db = app.get(DRIZZLE)`,
`tokenService = app.get(TOKEN_SERVICE)`, usuarios sembrados directo en la
base con `uuidv7()` y emails con `RUN_ID`, limpieza en `afterAll`).
Importa `provisionDevice`, `assertRealWialonClient`,
`WialonUnitNotFoundError` desde `../scripts/provision-device` (ruta
relativa: `scripts/` está fuera de `src/`, el alias `@/` no lo alcanza —
mismo patrón que `test/backfill-weights.e2e-spec.ts` y que el import de
`seedSimulatedDevices` en `test/devices.e2e-spec.ts`).

**Nunca hay red en los tests**: el `WialonClient` se inyecta como stub.

```typescript
const UNIT_ID = `e2e-unit-${RUN_ID}`;

function wialonStub(unitIds: string[]): WialonClient {
  return {
    listUnits: () =>
      Promise.resolve(unitIds.map((unitId) => ({ unitId, name: `collar ${unitId}` }))),
    getMessages: () => Promise.resolve([]),
  };
}
```

Casos mínimos:

| Caso | Requisito | Qué afirma |
|---|---|---|
| Alta de un collar nuevo | R1 | tras `provisionDevice(db, wialonStub([UNIT_ID]), { wialonUnitId: UNIT_ID, imei, model })`, la fila de `devices` tiene `wialonUnitId === UNIT_ID`, `isSimulated === false`, `status === 'available'`, `activationCode` no nulo con el formato de R4, `imei`/`model` los pasados, y `ingestWatermark`/`batteryPct`/`connectivity`/`lastMessageAt` en `null`; el resultado es `{ created: true }` |
| Unidad inexistente | R2 | `provisionDevice(db, wialonStub(['otra-unidad']), { wialonUnitId: UNIT_ID })` rechaza con `WialonUnitNotFoundError`, y el conteo de filas de `devices` es idéntico antes y después |
| Segunda ejecución | R3 | tras aprovisionar y volver a llamar con el mismo `wialonUnitId`, el resultado es `{ created: false }` con el mismo `deviceId`; `activationCode` y `updatedAt` de la fila son idénticos a los de la primera ejecución, y sigue habiendo exactamente una fila con ese `wialon_unit_id` |
| Colisión de IMEI | R3 | aprovisionar un `wialonUnitId` **nuevo** con el `imei` de la fila anterior rechaza (error `23505`) y no deja fila nueva |
| Códigos distintos | R4 | dos aprovisionamientos de unidades distintas producen `activationCode` distintos |
| Guarda del simulador | R5 | `assertRealWialonClient(new FakeWialonClient({ seed: 1, homeLat: 0, homeLng: 0 }))` lanza `SimulatedWialonClientError`; `assertRealWialonClient(new WialonHttpClient('https://wialon.test', 'token'))` no lanza |
| Coexistencia con el seed | R6 | tras `seedSimulatedDevices(db)` (importado de `../scripts/seed-devices`), la fila aprovisionada sigue con `isSimulated === false` y su `activationCode` intacto, y las filas `SIM-001..003` están con `isSimulated === true` |
| Claim end-to-end | R7 | con un usuario `owner` de una mascota creada vía `POST /v1/pets`, `POST /v1/devices/claim` con `{ petId, activationCode }` del collar aprovisionado responde `201`, deja una fila de `pet_devices` con `released_at IS NULL` y `devices.status === 'assigned'` |

El test unitario `src/modules/devices/application/activation-code.spec.ts`
cubre R4 aparte: formato con la regexp exacta,
`generateActivationCode.length === 0` (aridad cero) y 1000 llamadas → `new
Set(...).size === 1000`.

`test/provision-device.e2e-spec.ts` necesita Docker levantado
(`docker compose up -d`), como el resto de e2e.

## Archivos afectados

**Nuevos — `application` (devices)**

- `backend-pet-tracker/src/modules/devices/application/activation-code.ts` (D3, R4)
- `backend-pet-tracker/src/modules/devices/application/activation-code.spec.ts` (R4)

**Nuevos — script y su test**

- `backend-pet-tracker/scripts/provision-device.ts` (D4, R1-R3, R5)
- `backend-pet-tracker/test/provision-device.e2e-spec.ts` (R1-R7)

**Modificados**

- `backend-pet-tracker/package.json` — añade el script `provision:device`
- `docs/data-model.md` — fila `devices`: los dos caminos de alta (R8)
- `docs/wialon-module.md` — `listUnits()` tiene un segundo consumidor (R8)

**Explícitamente NO tocados** (si el diff los toca, el reviewer rechaza):
`src/modules/devices/application/use-cases/*`,
`src/modules/devices/application/dto/*`,
`src/modules/devices/domain/**`, `src/modules/devices/infrastructure/**`,
`scripts/seed-devices.ts`, `src/db/seed/simulated-devices.ts`,
`src/db/schema/devices.schema.ts`, `src/db/migrations/**`,
`src/workers/poller.service.ts`, `src/aws/provisioning.ts`, y —bajo la
opción A— todo `src/integrations/wialon/`.

Sin variables de entorno nuevas (reutiliza `DATABASE_URL`, `SIM_MODE`,
`WIALON_TOKEN`, `WIALON_BASE_URL`), sin dependencias nuevas, sin providers ni
controllers nuevos, sin cambios en `app.module.ts` ni `devices.module.ts`.

## Alternativas descartadas

- **Endpoint HTTP de administración** (`POST /v1/admin/devices`): exige
  inventar un modelo de rol de plataforma que hoy no existe — `pet_users.role`
  es rol por mascota (D1).
- **Reutilizar `seed-devices.ts` con flags** para dar de alta también los
  reales: mezclaría en un script el camino idempotente-por-`esn` de los
  simulados con el verificado-contra-Wialon de los reales, y el
  `onConflictDoNothing` sobre `esn` no aplica a filas cuyo `esn` puede ser
  `NULL`. Dos scripts, dos propósitos (R6 exige que el de simulados no
  cambie).
- **Insertar el device a través de `DeviceRepository`**: obligaría a añadir
  un método `create()` al puerto de dominio de #7 y a arrancar un contexto
  de Nest desde el script, sin ganar nada — los otros cuatro scripts del
  repo escriben con Drizzle directo (D2).
- **`activation_code` derivado del IMEI o de un contador** (p. ej.
  `ACT-<imei>` o `ACT-004`): enumerable; cualquiera podría reclamar collares
  ajenos. El requisito de que la función tenga aridad cero (R4) hace que ni
  siquiera sea expresable.
- **`randomUUID()` como `activation_code`**: 36 caracteres con guiones que
  alguien tiene que teclear desde una caja; base32 sin caracteres ambiguos
  es la misma stdlib con menos fricción para el mismo propósito.
- **Añadir `commander`/`yargs`** para parsear cinco flags: `parseArgs` de
  `node:util` ya está en la stdlib de Node 24 (D4).
- **Verificar la unidad con `getMessages()`** en vez de `listUnits()`: un
  collar recién sacado de la caja puede no tener ningún mensaje todavía;
  ausencia de mensajes no es ausencia de unidad. `listUnits()` responde
  exactamente la pregunta que interesa (R2).
- **Escribir `ingest_watermark` en el aprovisionamiento**: es
  responsabilidad del claim (#7) y del poller (#8); ver D5.
