# review: wialon-ingestion-pipeline
Fecha: 2026-08-02
Veredicto: APROBADO

Feature #8, branch `feature/8-wialon-ingestion-pipeline` (21 commits sobre main,
`8284a0f..ddac59b`). Verificación independiente: el reviewer ejecutó `./init.sh`
y la suite e2e contra Docker real (Postgres 17 + LocalStack) él mismo — no se
aceptó el output del reporte del implementer como evidencia.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`wialon-ingestion-pipeline`, verificado en `feature_list.json`)
- [x] progress/current.md actualizado (describe la sesión activa de #8, reviewer en curso)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — `src/pipeline/**` importa solo
      `./constants`, `./geo`, `./types` (cero NestJS/SDK/ORM, verificado por
      lectura); `wialon.errors.ts` no tiene ningún import
- [x] repositories/contratos en domain son interfaces puras —
      `IngestionStore` (`src/workers/ingestion-store.ts`) y `WialonClient`
      (`wialon-client.interface.ts`) son puertos sin implementación
- [x] application depende de interfaces, no implementaciones —
      `PollerService`/`PositionsConsumerService` inyectan `INGESTION_STORE` y
      `WIALON_CLIENT` (tokens), nunca las clases concretas
- [x] infrastructure sin lógica de negocio — `IngestionDrizzleStore` solo
      persiste (el guard WHERE "solo si más reciente" es del contrato R14/D14);
      `git diff main --stat` no toca `src/modules/**`, `src/aws/**` ni
      `src/db/migrations/**` (cero migraciones, como exige la spec)

## Checklist C4 — TDD
- [x] Cada R1-R19 tiene al menos un test que lo nombra — verificado en
      archivos reales: `grep describe('R<n>:` devuelve los 19 ids
      (factory R1; fake R2/R3; http R4; pipeline R5/R6/R7; scheduler R8;
      poller R9-R11; consumer R12-R18; e2e R19 + guard WHERE de R14).
      Muestreo ejecutando por nombre: `jest -t "R13"` → 6 passed,
      `-t "R7"` → 6 passed, `-t "R8"` → 5 passed
- [x] Historial de commits muestra test-primero, no todo junto — 21 commits
      granulares, uno por requisito; `git show --stat` muestra cada `feat`
      con su spec junto a la implementación (mismo patrón aceptado en #7).
      R15 y R18 son commits `test(...)`: comportamiento emergente de
      R12/R13/R14 fijado por test — desviación declarada en el impl report,
      aceptable (la fase roja habría exigido romper requisitos ya verdes)

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" — 19/19 filas con test + hash;
      hashes cotejados contra `git log` (los 19 existen en el branch)
- [x] Commits siguen el formato `feat(<scope>): <desc> (R-ids)` — los 21
      con scope `wialon-ingestion-pipeline` y R-id en el sufijo
      (19 feat/test por requisito + 1 refactor lint + 1 docs de cierre)

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada
      (2026-08-02); R1-R19 + D1-D14 dentro del documento aprobado

## Checklist C7 — Sin código huérfano
- [x] Componentes/módulos reemplazados fueron eliminados —
      `SIMULATED_DEVICES` se movió de `scripts/seed-devices.ts` a
      `src/db/seed/simulated-devices.ts` (única definición); el script la
      re-exporta a propósito para conservar la superficie que usan los e2e
      de #7. Importadores verificados: solo seed, fake client (+su spec) y
      el re-export — sin duplicados ni restos
- [x] Sus tests también — no quedan specs de código movido/eliminado

## Verificación independiente ejecutada

```bash
./init.sh                      # exit 0
docker compose ps              # postgres + localstack Up (healthy)
cd backend-pet-tracker
pnpm run provision:local       # idempotente, ok
pnpm run seed:devices          # ok
pnpm run test:e2e              # 6 suites, 58/58 passed, 12.4 s
```

- Unit: **397/397 passed** (69 suites) — coincide con el impl report
  (364 previos + 33 nuevos).
- e2e: **58/58 passed** — los 55 previos de #2/#5/#7 no se rompen: instancian
  `AppModule` completo con `NODE_ENV=test` y el gating de R8
  (`POLLER_ENABLED==='true' && NODE_ENV!=='test'`, registro dinámico en
  `IngestionSchedulerService`, no decorador) impide agendar cron/consumidor.
  R8 verificado por unit (5 tests) y de facto en la suite.
- e2e de ingesta verifica en infra real: items en `PET#<petId>` con shape de
  data-model (sk=device_ts ms, TTL en segundos), `pets.last_position` dentro
  del intervalo poleado, watermark que avanza y no retrocede, DLQ en 0, y el
  guard WHERE de R14 contra Postgres (update viejo no retrocede caché).

## Convenciones
- 7/7 env vars de D11 (`SIM_MODE`, `SIM_SEED`, `SIM_HOME_LAT/LNG`,
  `WIALON_TOKEN`, `WIALON_BASE_URL`, `POLLER_ENABLED`) presentes en
  `.env.example` **y** en la tabla de `docs/conventions.md`, introducidas en
  los mismos commits (`8284a0f`, `e178dee`).
- Sin `console.log` de debug ni TODOs en el código nuevo (el único
  `console.error` es el handler documentado del script standalone de seed).
- `docs/wialon-module.md` existe (D1); fixture `walk.json` con 204 puntos y
  el glitch `(0,0)` en índice 10, como declara el reporte.

## Desviaciones del impl report — evaluación
1. **`SIMULATED_DEVICES` → `src/db/seed/` con re-export**: aceptable.
   Justificada (rootDir del build impide `src/` → `scripts/`), R2 exige
   importar sin re-teclear, superficie de #7 intacta y verificada.
2. **`jest-e2e.json` `maxWorkers: 1`**: aceptable. El e2e de ingesta y
   `devices.e2e-spec.ts` compiten por el fixture fijo `SIM-001`/`ACT-001`
   (criterio literal de R19); serializar elimina la carrera con coste de
   ~12 s de suite total.
3. **R15/R18 verdes a la llegada del test**: aceptable, no bloqueante.
   Declarado honestamente como commits `test(...)`; los tests existen,
   nombran su R-id y fijan el contrato. Forzar fase roja habría roto
   R12/R13/R14 ya aprobados.

## Observaciones

Bloqueantes: ninguna.

No bloqueantes:
- **NB1 — frontmatter desincronizado en la spec**: `design.md` y
  `traceability.md` de esta feature conservan `status: spec_ready` mientras
  `requirements.md` está `approved`. En #7 (`devices-claim`) se actualizaron
  a `approved`. No afecta C6 (el gate vive en requirements.md), pero rompe
  la convención interna — corregir al cerrar (es edición de `specs/`, la
  puede hacer el leader).
- **NB2 — comentario huérfano en `positions-consumer.service.ts`**
  (`writeBatch`, ~L330): dice "se suprime solo la asignacion" pero no existe
  ningún `eslint-disable` en el archivo (`grep eslint-disable src/workers`
  → vacío); el impl report también menciona "una única supresión comentada"
  que ya no está. El código es correcto (anota `BatchWriteCommandOutput`);
  solo el comentario quedó desfasado. Limpiar en el próximo toque del
  archivo — no amerita commit propio.

## Output de ./init.sh

```
(exit code 0 — tramo final; secciones de entorno/harness previas todas ✅)

→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 69 passed, 69 total
Tests:       397 passed, 397 total
✅ Tests pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 6/18 completadas | 11 pendientes
```

## Output de pnpm run test:e2e (reviewer, contra Docker real)

```
Test Suites: 6 passed, 6 total
Tests:       58 passed, 58 total
Snapshots:   0 total
Time:        12.386 s
```
