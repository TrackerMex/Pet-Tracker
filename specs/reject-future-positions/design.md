---
feature: "reject-future-positions"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[reject-future-positions]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
> Rutas relativas a `backend-pet-tracker/`.

## Capas tocadas

Ningún módulo `domain`/`application` cambia. Tres piezas, dos capas:

| Pieza | Capa | Qué cambia |
|---|---|---|
| `src/pipeline/constants.ts` | núcleo puro (sin imports) | una constante más (R8) |
| `src/pipeline/types.ts` | núcleo puro | `'future_ts'` en `DiscardReason` (R1) |
| `src/pipeline/validate-positions.ts` | núcleo puro | parámetro `nowMs?` + una guarda en `normalize()` (R1-R3) |
| `src/workers/positions-consumer.service.ts` | infrastructure (worker) | pasa `now.getTime()` y loguea `discarded` (R4, R5) |
| `src/workers/poller.service.ts` | infrastructure (worker) | tope y recuperación del watermark (R6, R7) |

`src/pipeline/` conserva su regla de pureza: `normalize()` sigue sin leer el
reloj, sin red y sin imports fuera de `./`. El test estático que lo verifica
(`validate-positions.spec.ts:83`) debe seguir verde **sin editarse** — es la
verificación de R3.

## Decisiones técnicas

### D1 — El tope se aplica en la **lectura y en la escritura** del watermark

**Sirve a**: R6, R7. **Es la decisión central de la feature.**

Ninguna de las dos capas sola cierra los criterios de aceptación:

- **Solo en la escritura** (`min(lastTs, now)`): evita envenenar nuevos
  devices, pero **no recupera ninguno ya envenenado**. Un device envenenado
  nunca llega a la escritura: su `getMessages(unitId, futuro, now)` devuelve
  `[]` y `pollAssignment()` hace `return` en la línea 97, mucho antes del
  `advanceWatermark` de la línea 127. El 4º criterio de aceptación exige
  explícitamente recuperación sin tocar la base a mano; solo-escritura lo
  incumple.
- **Solo en la lectura** (ignorar el watermark futuro al calcular `fromTs`):
  recupera al envenenado en cada ciclo, pero deja la fila envenenada para
  siempre y vuelve a escribir un `lastTs` futuro en cuanto llegue otra
  posición mala. Es una tirita permanente, no una cura.

**Ambos**, entonces, y con esta división de trabajo:

- La **escritura** (R6) es el tope duro que impide crear el problema.
- La **lectura** (R7) es la que repara lo ya creado y la que hace al sistema
  robusto aunque la validación de R1 se saltee o el tope de R6 se pierda en
  un refactor futuro.

Y el efecto conjunto es una **reparación real en disco**: con el watermark
envenenado ignorado en la lectura, el ciclo baja a
`fromTs = now - CLAIM_WATERMARK_LOOKBACK_MINUTES`, publica lo que encuentre y
escribe `min(lastTs, now)` — un valor **anterior** al envenenado. El
watermark retrocede a propósito y la fila queda sana. Es la única escritura
del sistema que hace retroceder un watermark, y es deliberada.

Forma exacta de `pollAssignment()` (las líneas 88-96 de hoy):

```
nowMs         = now.getTime()
lookbackMs    = nowMs - CLAIM_WATERMARK_LOOKBACK_MINUTES * 60_000
watermarkMs   = assignment.ingestWatermark?.getTime() ?? null

si watermarkMs === null:        fromTs = lookbackMs          // igual que hoy
sino si watermarkMs > nowMs:    logger.warn({...}); fromTs = lookbackMs   // R7
sino:                           fromTs = watermarkMs         // igual que hoy

... getMessages(unitId, fromTs, nowMs) ... publicar ...

lastTs = Math.max(...positions.map(p => p.ts))
advanceWatermark(deviceId, new Date(Math.min(lastTs, nowMs)))            // R6
```

El suelo de recuperación **reutiliza** `CLAIM_WATERMARK_LOOKBACK_MINUTES`
(ya importado en la línea 11) en vez de inventar una constante nueva: un
device envenenado está exactamente en la misma situación que uno recién
reclamado — se sabe que no hay watermark utilizable y se mira hacia atrás la
misma ventana. Una constante propia sería un segundo número que calibrar sin
motivo.

`fromTs = nowMs` (topar el watermark a `now` en vez de bajarlo al suelo)
**no** sirve: `getMessages(unitId, now, now)` es un intervalo vacío y el
device seguiría sin ingerir nada. El criterio dice "vuelve a ingestar", no
"deja de fallar".

### D2 — `nowMs` es un parámetro **opcional** de `normalize()`

**Sirve a**: R3, R9b.

`normalize(raw: RawPosition[], nowMs?: number)`. Con `nowMs` ausente, la
guarda de R1 no se evalúa y la función devuelve exactamente lo de hoy.

- **Nunca** un valor por defecto `nowMs = Date.now()`: rompería la pureza que
  `validate-positions.spec.ts:83` verifica estáticamente, y convertiría la
  suite en no determinista.
- **No obligatorio**, aunque sería el contrato más estricto: obligaría a
  editar los 21 sitios de llamada de `validate-positions.spec.ts` y el de
  `trips.spec.ts:106`, justo lo que el 6º criterio de aceptación prohíbe. El
  riesgo que introduce la opcionalidad (un llamador futuro que olvide
  `nowMs`) es exactamente el que cubre la redundancia de D1: aunque la
  validación no corra, el watermark no se va al futuro.
- Hay **un solo llamador de producción** de `normalize()` —
  `positions-consumer.service.ts:179`, verificado con
  `grep -rn "normalize(" src test`. Los demás resultados son el propio
  `validate-positions.ts`, los dos specs y `trips.spec.ts`. No hay un segundo
  camino de producción que arreglar por separado.

`positions-consumer.service.ts` no necesita fontanería nueva para el reloj:
`handleMessage(parsed, now)` ya recibe el `Date` que `drainOnce(now)`
propaga desde la línea 83.

### D3 — `future_ts` es una **razón de descarte**, no un flag de calidad

**Sirve a**: R1, R8.

El pipeline tiene hoy dos familias de anomalía, y no son intercambiables:

| Familia | Dónde vive el nombre | Efecto | Ejemplos |
|---|---|---|---|
| Razón de descarte | union `DiscardReason` en `types.ts:24`, literal en `validate-positions.ts` | la posición **sale** de `accepted` | `invalid_coordinates`, `missing_ts`, `duplicate_ts` |
| Flag de calidad | `export const FLAG_*` en `constants.ts:23-24` | la posición **se queda**, marcada | `suspect_jump`, `low_accuracy` |

Una posición futura **se descarta**, así que es de la primera familia:
`'future_ts'` entra en el union `DiscardReason`, con el mismo sufijo `_ts`
que sus dos hermanas (`missing_ts`, `duplicate_ts`).

Deliberadamente **no** se crea un `export const FLAG_FUTURE_TS` ni un
`DISCARD_FUTURE_TS` en `constants.ts`: sus tres hermanas son literales de
string y añadir una constante solo para la nueva dejaría el archivo con dos
convenciones para la misma cosa. Lo que sí manda `constants.ts` es el
**umbral** — que es lo que el 5º criterio de aceptación pide y lo que hay
que poder recalibrar sin buscar por el código.

Dónde queda observable: en `NormalizeResult.discarded` (contrato de la
función) y, en producción, en el `warn` de R5 — hoy el consumidor
destructura `const { accepted } = normalize(...)` y el array de descartes se
pierde sin dejar rastro. Ese log es lo que convierte "descartado" en
"observado"; sin él, el flag existiría solo para los tests.

### D4 — `FUTURE_TS_TOLERANCE_MS = 5 * 60_000`

**Sirve a**: R2, R8.

Qué desfase legítimo cubre: el collar **no tiene NTP**. Toma la hora del
GPS, y mientras no haya fijado satélites corre con su RTC libre; el `ts` que
llega es literalmente el reloj del collar (`wialon-http.client.ts:166`,
`ts: message.t * 1000`). El servidor sí está sincronizado. Entre ambos hay
deriva de RTC, latencia de la plataforma Wialon y redondeos de zona: del
orden de segundos a un par de minutos.

Por qué 5 minutos separa bien las dos poblaciones:

- **Deriva legítima**: segundos a minutos. Queda dentro con holgura, así que
  no se pierde telemetría real (R2 — el criterio de aceptación #2 existe
  precisamente para que el arreglo no cueste datos buenos).
- **Hardware roto**: RTC sin configurar, epoch del GPS sin fijar, reloj de
  fábrica. Adelanta horas, días o años — el caso real del 2026-08-14 y los
  `ts` de 2027 del episodio local. Queda fuera por varios órdenes de
  magnitud. No hay ninguna población de fallo conocida en la franja de
  5-60 minutos, así que el valor exacto no es delicado.

Coste del margen: una posición aceptada con `ts` hasta `now + 5 min` topa el
watermark en `now` (R6), así que los ciclos siguientes del poller
(`POLLER_INTERVAL_MS = 60_000`) la vuelven a traer hasta que el reloj del
servidor la alcanza — como mucho 5 reenvíos. Los duplicados los absorbe la
idempotencia de #8 R13 (`sk = device_ts` en DynamoDB) y el guard "solo si
más reciente" de #8 R14. Es el precio consciente de no falsear el `ts`.

Es constante de código, no variable de entorno: se recalibra con una spec y
un commit, igual que `SUSPECT_JUMP_SPEED_KMH` o
`GEOFENCE_EXIT_MAX_ACCURACY_M`. Un umbral de producto que cada entorno
pudiera mover en silencio es justo lo que hace irreproducibles los bugs de
telemetría.

### D5 — Orden de las guardas dentro de `normalize()`

**Sirve a**: R1.

La comprobación va **después** de `hasValidTs()` (necesita un `ts` numérico
finito para comparar) y **antes** de `seenTs.has(position.ts)`: una posición
futura no debe registrarse en `seenTs` ni consumir la primera aparición de
un `ts`. El bloque queda entre las líneas 40 y 41 de hoy, y el `continue`
del descarte mantiene el resto del bucle intacto.

`assignQualityFlags()` no cambia: opera sobre `accepted`, del que la futura
ya salió, así que ninguna posición futura puede inflar el cálculo de
velocidad implícita y disparar un `suspect_jump` falso en su vecina.

### D6 — El guard de sha256 de #30 **no** se toca

**Sirve a**: R9c, R9d.

`src/pipeline/geofence-eval-untouched.spec.ts` congela por sha256
`geofence-eval.ts` y `geofence-eval.spec.ts` (líneas 35-38). #27 **no
modifica ninguno de los dos**: la validación de `ts` vive en
`validate-positions.ts` y los topes en los workers. No hay recálculo de
hashes ni precedente de R2 de #30 que aplicar aquí.

Su segundo `describe` (`R19`, líneas 52-75) sí ve el cambio de
`constants.ts`, pero **no se rompe**: asevera valores concretos de 17
constantes, no el conjunto de claves exportadas. Añadir
`FUTURE_TS_TOLERANCE_MS` lo deja verde. Su `it` se titula "añade unicamente
BATTERY_RECOVERY_THRESHOLD_PCT = 30 (R11)", lo cual pasa a leerse raro en
retrospectiva — pero es el título de un test de #12/#30 que asevera lo que
asevera, y **editarlo no aporta nada**: quien busque el inventario de
umbrales vigente lo tiene en `docs/wialon-module.md` §Pipeline puro y
umbrales, que sí se actualiza. No tocar ese archivo.

## Archivos afectados

| Archivo | Capa | Cambio |
|---|---|---|
| `src/pipeline/constants.ts` | núcleo puro | R8: `export const FUTURE_TS_TOLERANCE_MS = 5 * 60_000` con JSDoc de justificación (D4). Ninguna constante existente cambia de nombre ni de valor |
| `src/pipeline/types.ts` | núcleo puro | R1: `'future_ts'` añadido al union `DiscardReason` (línea 24) |
| `src/pipeline/validate-positions.ts` | núcleo puro | R1-R3: `nowMs?: number` en la firma, import de `FUTURE_TS_TOLERANCE_MS` desde `./constants`, guarda nueva entre las líneas 40 y 41 (D5), JSDoc de `normalize()` actualizado |
| `src/pipeline/validate-positions.spec.ts` | test | R1, R2, R3, R8: 4 describes **nuevos** al final del archivo; los describes `R5`/`R6`/`R7` de #8 no se tocan |
| `src/workers/positions-consumer.service.ts` | infrastructure | R4: `normalize(parsed.positions, now.getTime())` en la línea 179; R5: destructurar también `discarded` y un `this.logger.warn` con el conteo, más un helper local `countByReason(discarded: DiscardedStat[]): Record<string, number>` |
| `src/workers/positions-consumer.service.spec.ts` | test | R4, R5: 2 describes **nuevos** al final; ningún `it` existente se edita |
| `src/workers/poller.service.ts` | infrastructure | R6, R7: cálculo de `fromTs` de D1 con el `warn` de recuperación, y `Math.min(lastTs, nowMs)` en la línea 126-127; comentario de las líneas 86-87 y 123-125 actualizado |
| `src/workers/poller.service.spec.ts` | test | R6, R7: 2 describes **nuevos** al final; los describes `R9`/`R10`/`R11` de #8 no se tocan |
| `docs/wialon-module.md` | doc | fila nueva en la tabla de umbrales (§Pipeline puro y umbrales, línea 80-94) para `FUTURE_TS_TOLERANCE_MS`, y mención de `future_ts` en la descripción de `normalize(raw)` de la línea 74 |

## Inventario de riesgo del 6º criterio — qué tests podría romper una validación nueva en el pipeline puro

Auditado uno por uno. El riesgo real era que algún test construyera
posiciones con `ts` futuro o relativo a `Date.now()`:

| Test / fixture | Cómo construye los `ts` | ¿Riesgo? |
|---|---|---|
| `src/pipeline/__fixtures__/walk.json` | absolutos, desde `1785542430000` (2026-08-02T00:00:20Z), 204 puntos de 30 s | **No**. Pasados y fijos; no envejecen hacia el futuro |
| `src/pipeline/validate-positions.spec.ts` | literales pequeños (`ts: 1000`, `1_000_000`) más el fixture | **No**. Además llama a `normalize()` sin `nowMs` (D2), así que la guarda ni se evalúa |
| `src/pipeline/trips.spec.ts:101-106` | `normalizedWalkFixture()` → `normalize(raw).accepted` sobre `walk.json`, sin `nowMs` | **No** |
| `src/pipeline/activity.spec.ts`, `local-day.spec.ts`, `time-away.spec.ts` | no llaman a `normalize()` | **No** |
| `src/pipeline/time-away.spec.ts:97` | `jest.useFakeTimers().setSystemTime(new Date('2030-01-01'))` | **No** para #27 — es una suite distinta, no toca `normalize()` ni el poller. Sí es la pista de cómo un proceso jest huérfano acabó poleando con un `now` de años en el futuro (§Contexto de [[requirements]]) |
| `src/workers/positions-consumer.service.spec.ts` | `NOW = 2026-08-01T12:00Z` fijo y `BASE_TS = NOW.getTime() - 60_000`; **todas** las llamadas son `drainOnce(NOW)` | **No**. `BASE_TS` es anterior a `NOW`, así que pasar `now.getTime()` a `normalize()` (R4) no cambia ningún resultado |
| `src/workers/poller.service.spec.ts` | `NOW = 2026-08-01T12:00Z` fijo, watermark `11:55`, `positionAt(ts)` con `ts` derivados de `NOW` hacia atrás | **No** para R7 (watermark pasado ⇒ rama `else`, `fromTs = watermarkMs`, idéntico a hoy). **Revisar** en R6: cualquier `it` que asevere `advanceWatermark` con un `lastTs` **posterior** a `NOW` rompería. Auditado el describe `R10` (líneas 208-268): los `ts` usados son anteriores a `NOW`, así que `Math.min(lastTs, nowMs) === lastTs` y quedan verdes |
| `test/ingestion.e2e-spec.ts` | `runOnce()`/`drainOnce()` sin argumento ⇒ `now` real, y el `FakeWialonClient` acota `ts <= toTs` | **No**. El fake no puede emitir futuro (§Contexto); el tope de R6 es un no-op ahí |
| `src/pipeline/geofence-eval-untouched.spec.ts` | asevera valores de constantes, no claves | **No** (D6) |

Conclusión: ningún test existente necesita edición. Si el implementador se
encuentra teniendo que tocar alguno, el diseño se desvió de la spec y hay
que parar y decirlo, no editar el test.

## Alternativas descartadas

- **`nowMs` obligatorio en `normalize()`**. Contrato más estricto (ningún
  llamador puede olvidarlo), a cambio de editar 22 sitios de llamada en
  specs de #8 y #10 — exactamente lo que prohíbe el 6º criterio de
  aceptación. Descartada (D2); la redundancia de D1 cubre el olvido.
- **`nowMs = Date.now()` como valor por defecto**. Un carácter menos en cada
  llamador y rompe la pureza del núcleo, la reproducibilidad de la suite y
  el test estático de `validate-positions.spec.ts:83`. Descartada (D2).
- **Topar solo en la escritura del watermark**. El diff más corto posible, y
  no recupera a ningún device ya envenenado — que es el 4º criterio de
  aceptación entero. Descartada (D1).
- **Topar solo en la lectura del watermark**. Recupera, pero deja la fila
  envenenada en la base indefinidamente y se vuelve a envenenar con la
  siguiente posición mala. Descartada (D1).
- **`fromTs = min(watermark, now)` en la recuperación**, en vez de bajar al
  suelo del lookback. Deja de fallar pero no ingiere: `getMessages(unitId,
  now, now)` es un intervalo vacío. Descartada (D1).
- **Constante nueva `POISONED_WATERMARK_LOOKBACK_MINUTES`** para el suelo de
  recuperación. Un segundo número que calibrar para la misma pregunta que
  `CLAIM_WATERMARK_LOOKBACK_MINUTES` ya responde. Descartada (D1).
- **Reescribir el `ts` futuro a `now`** en vez de descartarlo. Conserva el
  punto, pero inventa telemetría: la posición pasa a estar fechada donde no
  estuvo, y contamina paseos, geocercas y actividad. Descartada.
- **`FLAG_FUTURE_TS` como flag de calidad** (aceptar la posición marcada, en
  vez de descartarla). Deja entrar al pipeline un punto que puede
  desordenar el cálculo de velocidad implícita y, sobre todo, sigue
  alimentando el `Math.max` del watermark. Descartada (D3); el criterio de
  aceptación dice "se descarta".
- **Un `export const` para el nombre `'future_ts'`** en `constants.ts`. Sus
  tres hermanas del union `DiscardReason` son literales; añadir la constante
  solo para la nueva deja dos convenciones conviviendo. Descartada (D3).
- **Variable de entorno para la tolerancia**. Un umbral de producto que cada
  entorno pueda mover en silencio hace irreproducibles los bugs de
  telemetría. Descartada (D4).
- **Métrica EMF / contador de descartes por razón** en vez del `warn` de R5.
  Es lo correcto a futuro, pero mete instrumentación nueva en una feature de
  corrección de fallo. Fuera de alcance, declarado en [[requirements]].
