# Plan 006: Recorridos, paseos y actividad diaria

> **Instrucciones para el ejecutor**: paso a paso, verificando cada paso; ante STOP, detente y reporta. Al terminar actualiza `plans/README.md` y `STATUS.md`.
>
> **Chequeo de deriva**: el pipeline de ingesta del plan 005 debe estar operativo (posiciones simuladas en DynamoDB con ts recientes, `GET .../positions/last` → 200) y deben existir `apps/api/src/pipeline/geo.ts` (haversine) y el evento `position.updated` en el bus. Si no, STOP.

## Estado

- **Prioridad**: P1 · **Esfuerzo**: M · **Riesgo**: LOW (lógica pura + un endpoint; no toca infra crítica)
- **Depende de**: `plans/005-collar-wialon-ingesta.md`
- **Categoría**: direction (MVP items 12–13 del brief §20; base del §14)

## Por qué importa

Convierte posiciones crudas en valor: historial de recorridos, paseos agrupados y KPIs diarios (distancia, tiempo activo/reposo, comparativa 7 días — brief §14). Es además la línea base individual que el brief exige para alertas de comportamiento futuras. Todo el cómputo es determinista y testeable sin AWS.

## Estado actual

- DynamoDB `positions` llenándose por el simulador (plan 005); endpoint history con cursor ya existe.
- `pipeline/geo.ts` tiene haversine; `ProcessedPosition` en `packages/shared` incluye speed_kmh y flags.
- Modelo: los KPIs diarios NO tienen tabla aún — este plan añade `activity_daily` a Postgres (única migración nueva; ver paso 1).
- Contrato OpenAPI: `GET /v1/pets/{petId}/trips?date` y `GET /v1/pets/{petId}/activity/daily?from&to` ya especificados (plan 001).
- App: pantalla de ubicación con mapa (plan 005); falta historial y actividad.

## Comandos

Los de `plans/002` + `token:dev`. Migración: `npm -w apps/api run db:generate` y `db:migrate`.

## Alcance

**Dentro**: migración `activity_daily` (pet_id FK, date, distance_m int, active_minutes int, rest_minutes int, walk_count int, avg_walk_minutes int, first_walk_at, last_walk_at, time_away_minutes int NULL, computed_at; PK (pet_id, date)), `apps/api/src/pipeline/trips.ts` y `pipeline/activity.ts` (funciones puras), `apps/api/src/handlers/daily-activity.ts` (agregador nocturno), regla Scheduler en `infra/lib/ingestion.ts`, `apps/api/src/modules/positions/` (endpoints trips y activity), pantallas `apps/mobile/app/pets/[petId]/history.tsx` y `activity.tsx`, actualización de `docs/data-model.md` con la tabla nueva.

**Fuera**: geocercas y "tiempo fuera de casa" real (necesita la geocerca hogar del plan 007 — `time_away_minutes` queda NULL y documentado), acelerómetro, sueño/comportamientos (post-MVP §21), objetivos diarios configurables (se usa objetivo fijo 60 min activo para el anillo de progreso de la UI).

## Flujo git

`main`. Commits: `feat(api): trip grouping and daily activity computation`, `feat(infra): nightly activity aggregation`, `feat(mobile): route history and activity screens`.

## Pasos

### Paso 1: Migración `activity_daily`

Añadir la tabla al esquema Drizzle (columnas arriba), `db:generate` + `db:migrate` local y contra dev. Actualizar `docs/data-model.md` (catálogo + DDL) — el modelo aprobado gana una tabla; anotarlo en `STATUS.md` como "extensión aprobada implícitamente por backlog §14" (si el usuario objetó KPIs en la aprobación de 001, STOP).

**Verificar**: `db:migrate` exit 0 en ambos entornos; la tabla existe (`\dt` local o query Data API).

### Paso 2: Agrupación de paseos (`pipeline/trips.ts`)

`groupTrips(positions: ProcessedPosition[]): Trip[]` — puro. Reglas (documentarlas en JSDoc): un punto está "en movimiento" si speed_kmh > 1.8 o la distancia al punto anterior implica > 0.5 m/s; un paseo abre con ≥ 3 puntos consecutivos en movimiento; cierra tras ≥ 10 min sin movimiento (gap de datos > 15 min también cierra); paseos < 5 min o < 100 m se descartan como ruido; excluir puntos `suspect_jump` del cálculo de distancia (usar el resto). `Trip = {startTs, endTs, distanceM, durationMin, path: {lat,lng,ts}[]}`.

**Verificar**: tests con fixtures: (a) `walk.json` del plan 005 → ≥1 paseo con distancia > 0; (b) fixture sintético "reposo total" → 0 paseos; (c) fixture con salto absurdo → distancia sin el salto; (d) gap de 20 min parte dos paseos.

### Paso 3: KPIs diarios (`pipeline/activity.ts`) + agregador

`computeDailyActivity(positions, tzUserOffset): DailyActivity` — puro: distancia total (sin flags), minutos activos (suma de ventanas en movimiento), reposo = ventana observada − activo, paseos de `groupTrips`, primera/última hora de paseo. Handler `daily-activity.ts`: Scheduler `cron(15 2 * * ? *)` (02:15 UTC diario) → por cada mascota con collar activo: Query DynamoDB del día anterior **en la zona horaria del owner** (`users.timezone`), computa y upsert en `activity_daily`. También exponer recálculo bajo demanda: si `GET activity/daily` pide el día de hoy, computar al vuelo desde DynamoDB (no persistir).

**Verificar**: tests de `computeDailyActivity` (fixture con 2 paseos → walk_count 2, active_minutes en rango esperado; día vacío → ceros). Tras deploy: invocar el handler a mano (`aws lambda invoke`) y comprobar filas en `activity_daily`.

### Paso 4: Endpoints

- `GET /v1/pets/:petId/trips?date=YYYY-MM-DD` (PetAccessGuard): posiciones del día (tz del usuario) → `groupTrips` → lista sin `path` completo + `GET /v1/pets/:petId/trips/:n?date=` con el path para pintar la polyline (n = índice del día). Cachear nada en MVP.
- `GET /v1/pets/:petId/activity/daily?from&to` (máx 31 días): filas de `activity_daily` + hoy al vuelo + `weekComparison`: para cada métrica, delta % contra la media de los 7 días previos al rango (null si no hay historial).

**Verificar**: curls con token: trips de hoy → ≥1 paseo simulado; activity de 7 días → array con hoy incluido; mascota ajena → 404.

### Paso 5: Pantallas

- `history.tsx`: selector de día (hoy/ayer/calendario), lista de paseos (hora inicio, duración, distancia) y al tocar → mapa con `Polyline` del path (color primario pastel, inicio/fin marcados).
- `activity.tsx`: tarjetas de hoy (distancia, tiempo activo, paseos, con iconos amigables), anillo de progreso contra objetivo fijo 60 min, gráfico de barras 7 días (usar `react-native-svg` directo o `victory-native` — elegir **una** y anotarla en el README móvil), chips de comparativa ("+12 % vs semana pasada"). Textos español, tono cercano (brief §18).
- Enlazar desde el perfil de mascota (grid del plan 004) y rellenar `activitySummary` del perfil (distancia y minutos de hoy).

**Verificar**: `npm -w apps/mobile run typecheck` exit 0; manual: historial muestra un paseo del simulador y la polyline pinta. Si no hay dispositivo: typecheck + pendiente manual.

### Paso 6: Cierre

OpenAPI (endpoint trips/:n añadido), `docs/data-model.md`, `STATUS.md`, fila 006 DONE, commits.

**Verificar**: `npm run verify` exit 0; `git status` limpio.

## Plan de pruebas

- Unitarios puros (núcleo del plan): trips (4 fixtures del paso 2), activity (3 casos del paso 3), manejo de timezone (posición a las 23:50 America/Mexico_City cae en el día local correcto — caso explícito).
- Integración: invocación manual del agregador + curls del paso 4 con evidencia.

## Criterios de done

- [ ] `npm run verify` exit 0; suites de trips/activity en verde.
- [ ] Evidencia curl: trips y activity reales del simulador.
- [ ] `activity_daily` con filas tras invocar el agregador.
- [ ] Historial y actividad visibles en la app (o typecheck + pendiente manual).
- [ ] `docs/data-model.md` y OpenAPI actualizados; `STATUS.md` y fila 006 al día.

## Condiciones de STOP

- Los umbrales de paseo producen resultados absurdos con datos del simulador (0 paseos con movimiento evidente) tras un ajuste razonable → STOP y presenta los números; los umbrales son producto, no los inventes dos veces.
- El Query de un día completo se acerca al límite de 1 MB por página de DynamoDB → pagina internamente; si el agregador excede el timeout, STOP con métricas (no subir memoria/timeout sin reportar).
- Cambios al modelo más allá de `activity_daily` → STOP.

## Notas de mantenimiento

- Los umbrales de `trips.ts` (1.8 km/h, 10 min, 100 m…) son constantes nombradas en un solo archivo `pipeline/constants.ts`: producto querrá calibrarlos con collares reales.
- `time_away_minutes` queda NULL hasta el plan 007 (geocerca hogar); el 007 NO debe olvidar rellenarlo (está en sus notas).
- La comparativa 7 días es la semilla de "detección de cambios de rutina" (post-MVP §21): mantener `activity_daily` como fuente única.
