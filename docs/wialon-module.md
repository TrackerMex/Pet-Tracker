# Wialon module — fuente canónica del diseño de ingesta

> Creado por la feature #8 `wialon-ingestion-pipeline` (decisión D1 de su
> spec). Los planes 005/006/007 citan este documento en sus chequeos de
> deriva. La fuente en **código** de umbrales y contratos es
> `backend-pet-tracker/src/pipeline/constants.ts` y
> `backend-pet-tracker/src/workers/ingestion.constants.ts` — este doc los
> referencia, no los duplica con valores propios.

## Interfaz `WialonClient`

`src/integrations/wialon/wialon-client.interface.ts` (token `WIALON_CLIENT`):

```typescript
interface WialonClient {
  listUnits(): Promise<{ unitId: string; name: string }[]>;
  getMessages(unitId: string, fromTs: number, toTs: number): Promise<RawPosition[]>;
}
```

`fromTs`/`toTs` en epoch **ms**. `RawPosition` vive en `src/pipeline/types.ts`
(núcleo puro): `{lat, lng, ts, speedKmh?, course?, altitude?, sats?,
accuracyM?, batteryPct?}`.

Selección de implementación (`wialon.factory.ts`, R1): `FakeWialonClient`
salvo `SIM_MODE=false` **y** `WIALON_TOKEN` real (no vacío, no `PENDING`).
Default dev: fake. Env vars en la tabla de `docs/conventions.md`.

## API real (WialonHttpClient)

Base: `WIALON_BASE_URL` (default `https://hst-api.wialon.com/wialon/ajax.html`).
Login **por token en cada ejecución**: `svc=token/login` → `sid` (`eid`).

| Llamada | Parámetros | Uso |
|---|---|---|
| `core/search_items` | `itemsType: 'avl_unit'` | `listUnits()` — mapea `id→unitId`, `nm→name` |
| `messages/load_interval` | `{itemId, timeFrom, timeTo, flags: 1, flagsMask: 65281, loadCount: 500}` (tiempos en segundos) | `getMessages()` |

Mapeo de mensajes: `pos.y→lat`, `pos.x→lng`, `pos.s→speedKmh`, `pos.c→course`,
`pos.sc→sats`, `pos.z→altitude`, `t*1000→ts`, batería desde `params`
(`battery_pct`/`battery`) si existe. Mensajes sin `pos` se omiten.

Errores: `{error: N}` → `WialonApiError(N)`; fallos de red/HTTP →
`WialonTransportError`. Nunca un error crudo de fetch/SDK al llamador.
**La conexión real está diferida**: el cliente se prueba contra fixtures; el
smoke test con token real es trabajo futuro (STATUS/PR #12).

## Simulador (FakeWialonClient)

Determinista y stateless (R2/R3, D2): cada posición es función pura de
`(SIM_SEED, unitId, slot de 30 s)` — PRNG mulberry32 propio sembrado con
FNV-1a; sin `Math.random` ni estado entre llamadas. Intervalo `(fromTs, toTs]`,
un punto por slot de 30 s.

- Paseo: arranca en `SIM_HOME_LAT`/`SIM_HOME_LNG` al inicio de cada día
  simulado; velocidad ≤ 4 km/h con pausas; ruido ~10 m por eje (velocidad
  implícita entre consecutivos < 8 km/h).
- Anomalías cada ~50 slots: un salto de 1000 m (~120 km/h implícitos, dispara
  `suspect_jump`) y un duplicado exacto (mismo ts y coordenadas).
- Batería: 100 % al inicio del día, −1 % por cada 30 min simulados.
- `listUnits()` devuelve los `wialonUnitId` de `SIMULATED_DEVICES`
  (`src/db/seed/simulated-devices.ts`, seed de #7): `900001..900003`.

Fixture de referencia: `src/pipeline/__fixtures__/walk.json` (204 puntos,
seed 1, unidad 900001, 200 slots desde 2026-08-01T00:00Z + glitch `(0,0)`
insertado en el índice 10).

## Pipeline puro y umbrales

`normalize(raw)` (`src/pipeline/validate-positions.ts`, sin I/O): descarta
lat/lng fuera de rango o `(0,0)`, sin `ts` y duplicados exactos por
`device_ts` (queda la primera); ordena ascendente; marca flags sin descartar.

Umbrales (fuente: `src/pipeline/constants.ts` — los importan #10/#11/#12):

| Constante | Significado |
|---|---|
| `SUSPECT_JUMP_SPEED_KMH` (60) | velocidad implícita > umbral ⇒ flag `suspect_jump` |
| `LOW_ACCURACY_MAX_ACCURACY_M` (100) / `LOW_ACCURACY_MIN_SATS` (4) | precisión pobre ⇒ flag `low_accuracy` |
| `BATTERY_LOW_THRESHOLD_PCT` (20) | cruce descendente ⇒ evento `battery.low` |

## Poller, watermark y consumidor

- **Poller** (`src/workers/poller.service.ts`, cron 1 min gated por
  `POLLER_ENABLED=true && NODE_ENV != 'test'`): por cada asignación activa
  (`pet_devices.released_at IS NULL` + `wialon_unit_id` no nulo) llama
  `getMessages(unitId, watermark, now)` y publica a SQS `positions-raw`
  mensajes `{version: 1, deviceId, petId, unitId, positions}` (≤ 100
  posiciones). Watermark (`devices.ingest_watermark`): si es NULL usa
  `now − CLAIM_WATERMARK_LOOKBACK_MINUTES` (10, de #7); avanza al ts del
  último mensaje **después** de publicar y solo si hubo posiciones
  (at-least-once; los duplicados los absorbe el PutItem idempotente).
- **Consumidor** (`src/workers/positions-consumer.service.ts`): long-polling
  batch ≤ 10, valida con zod; escribe DynamoDB `positions`
  (`pk = PET#<petId>`, `sk = device_ts` ms, `expires_at` en **segundos**,
  +90 días); actualiza `devices` + `pets.last_position` solo con asignación
  activa y solo si el ts entrante es más reciente; borra el mensaje al
  terminar. Malformados: log + no-delete → la RedrivePolicy (3 recepciones)
  los mueve a `positions-raw-dlq`.

## Contrato de eventos (congelado — D9)

Bus `pet-tracker`, `source: 'pet-tracker'` (constantes en
`src/workers/ingestion.constants.ts`). Consumidores: planes 006/007/010, #12.
Cualquier cambio de shape incrementa `detail.version`.

```
position.updated   (uno por mensaje SQS procesado con ≥1 aceptada)
detail: { version: 1, petId, deviceId,
          position: { lat, lng, ts, speedKmh, course, sats, accuracyM,
                      batteryPct, flags },
          batteryPct: number | null }

battery.low        (solo en cruce descendente del umbral 20 — flanco, D8)
detail: { version: 1, petId, deviceId, batteryPct }
```

Histéresis de batería: **dispara < 20 aquí; #12 cierra la alerta con ≥ 30.**
