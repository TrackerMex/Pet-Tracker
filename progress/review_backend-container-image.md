# review: backend-container-image (#245)
Fecha: 2026-11-06
Veredicto: APROBADO
Base: H0 08dd2515, HEAD 76444c93 (55 commits, `git rev-list --count 08dd2515..HEAD`)

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene 0 en `in_progress`. #245 está en `spec_ready` y #246 y #247 en `pending`. init.sh lo confirma: «Sin features en progreso (sesión limpia)».
- [x] progress/current.md describe la sesión activa del leader. Observación, no bloquea: no nombra #245 ni el plan de producción AWS (0 coincidencias en origin/main y en origin/dev). Las reviews de #237, #238 y #241 registraron el mismo hueco como observación.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: la feature no toca ninguna capa domain.
- [x] repositories/contratos en domain son interfaces puras: no se tocan.
- [x] application depende de interfaces, no implementaciones: no se toca application.
- [x] infrastructure sin lógica de negocio. Las piezas nuevas son transversales: `config/env.validation.ts`, `db/pool-config.ts`, `db/migrate.ts`, `lifecycle/` y `app-setup.ts`. Los cambios en schedulers y `health.controller.ts` son de infraestructura: envolver los ticks en `InFlightTicks.run` y el endpoint `live`.

## Checklist C4 — TDD
- [x] Cada R<n> (R1–R23) tiene al menos un test que lo nombra. Los 78 nombres de test de traceability.md existen literalmente en sus ficheros.
- [x] El historial de commits muestra test primero, no todo junto. Volví a correr los commits rojos con los ficheros del rojo y HEAD restaurado después. Todos dieron exit=1 por aserción, con 0 errores de invocación (ReferenceError, Cannot find module, error TS o TypeError):
  - `9d46c0d4` (R5): el test R5 en rojo.
  - `58dde171` (R8 unit): los dos tests R8 en rojo.
  - `6db96567` (R13): el test R13 en rojo.
  - `279e79a6` (R6): los 9 tests R6 en rojo.
  - `ab06d779` (R17, enmienda 3): los dos tests R17 en rojo.

  La evidencia de Codex en `progress/impl_backend-container-image.md` muestra:
  - el rojo de R22 cayó por aserción: la salida recibida fue `DrizzleQueryError`, sin `DatabaseConfigError`;
  - el rojo de R14 usó stubs y también cayó por aserción.
- [x] Requisitos de verificación (R15 y R23) por la vía (b): su cierre se prueba por mutación, abajo.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente": las 23 filas están llenas. Cada hash y cada asunto coinciden con `git log`. La fila de R17 lista `b918e1bf` y `b9ebb0c4`.
- [x] Los commits siguen el formato `feat(<scope>): <desc> (R-ids)`. El prefijo `fix(` de `b9ebb0c4` lo prescribe tasks.md para la enmienda 3.

## Checklist C6 — Spec aprobada
- [x] requirements.md tiene `status: approved` y la casilla marcada con la firma delegada del 2026-11-06. Las tres enmiendas del leader son commits propios y van antes de su implementación:
  - `430aabf6`: casts en los scripts;
  - `8a6e1fa0`: el PEM pasa a `/app/rds-global-bundle.pem`.

  R17 en el árbol coincide con la enmienda 3:
  - `COPY --from=build --chmod=0444 /app/certs/rds-global-bundle.pem /app/rds-global-bundle.pem`;
  - `ENV NODE_EXTRA_CA_CERTS=/app/rds-global-bundle.pem`.

## Checklist C7 — Sin código huérfano
- [x] N/A: la feature no reemplaza ningún módulo. Arregla `start:prod` (`node dist/src/main.js`) y quita la carga de dotenv de los dos scripts de un solo uso. No queda ningún importador de dotenv en esos scripts.

## Alcance de ficheros
Los 54 ficheros cambiados desde H0 están en design.md §Archivos afectados o son ficheros de spec y progress.

## Mutaciones (tasks.md y zona ciega)
Las mutaciones se aplicaron una a una y se revirtieron con `git checkout HEAD -- <ruta>`. Todas dieron exit=1 con 0 errores de invocación. Los logs están en `/tmp/rev-245-<id>.log`.

| Id | Mutación | Rojo observado |
|---|---|---|
| R17-add | `ADD https://...` antes de `USER` | solo «R17: ninguna instrucción ADD descarga de una URL» (1 failed, 17 passed) |
| R19a | `COPY --from=build /app/.env ./.env` | solo el test R19 «.dockerignore excluye… y el Dockerfile no nombra .env» |
| R19b | `*.pem` en .dockerignore | solo «R19: .dockerignore no excluye el PEM de R17» |
| R23 | `"scripts"` en el exclude de tsconfig.build | solo el test R23 |
| E3 | destino del PEM de vuelta en `/etc/ssl/...` | los dos tests R17 (2 failed, 16 passed) |
| R16-user | `USER node` antes del COPY de migraciones | test R16 «runtime fija NODE_ENV… corre como node…» |
| R10 | `json: true` siempre | los dos tests «R10: con NODE_ENV "test"/undefined la salida no es JSON» |
| R12a | guard de producción desactivado | los tres casos de R12 fuera de producción |
| R12b | `problems.length >= 0` | «R12: en producción con configuración válida devuelve el mismo objeto» |
| R15u | `migrations-inexistente` (unit) | «R14: MIGRATIONS_FOLDER es <dir>/migrations y contiene meta/_journal.json» |
| R9 (ciega) | `trust proxy` true | «R9: con dos entradas, req.ip es la de la derecha» |
| R3 (ciega) | `rejectUnauthorized: false` | el test principal de R3 |
| R6 (ciega) | sin `clearTimeout` en drain | «R6: drain espera a la tarea pendiente y resuelve drained al terminar» |

No volví a correr la mutación e2e de R15, porque comparte la DB con los worktrees vecinos (orden del leader). Codex dejó su evidencia en `/tmp/impl-245-R15-mutation.log`: el test R15 cae con `Can't find meta/_journal.json file`. La mutación R15u en unit cubre el mismo símbolo, `MIGRATIONS_FOLDER`.

Estado al terminar: `git status --short` muestra solo `?? progress/review_backend-container-image.md` y `git diff --cached --quiet` devuelve 0.

## Gate de Docker
`progress/docker-gate_backend-container-image.txt` (commit `76444c93`) coincide línea a línea con lo que espera tasks.md:
- `build exit=0`.
- El inspect imprimió, en orden: `1000`, `-r--r--r--`, `ro-ok`, `ca-ok`, `extra-ca=114`, `no-env`, `no-dev`, `argon2-ok`, `migrations-ok`, `scripts-ok`, y después `inspect exit=0`. El valor 114 es igual a `grep -c "BEGIN CERTIFICATE"` del PEM.
- `default exit=1`, con la línea JSON `EnvValidationError: Invalid production environment: SIM_MODE, JWT_SECRET`.
- `provision exit=1`, con `falta --unit-id`.
- `subscription exit=1`, con `DatabaseConfigError ... PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, DB_POOL_MAX`.
- `migrate exit=1`, con una línea de error JSON que nombra PGHOST.
- 0 líneas «Permission denied». El exit 13 que motivó la enmienda 3 ya no aparece.

## Observaciones
Ninguna bloquea:
1. `progress/current.md` no nombra #245 (C2, ver arriba).
2. La corrida unit de cierre de Codex usó `--testTimeout=30000`, que tasks.md no prescribe. No cambia el veredicto: el init.sh del leader pasa sin ese flag (207/1743).
3. `.dockerignore` añade `.git` y `*.log`, que el diseño no exige. No excluyen nada que la imagen necesite.
4. R11 se candó con texto estático en `src/main.spec.ts`.
5. Riesgo latente que el leader ya aceptó: tras R13, ConfigModule valida y congela una copia del entorno, así que los fixtures que cambien `SIM_MODE` o `ANTHROPIC_ENABLED` en tiempo de ejecución dejan de tener efecto.
6. La mutación e2e de R15 no se volvió a correr (DB compartida). Ver §Mutaciones.

## Output de ./init.sh
El reviewer no corrió `./init.sh`, por orden expresa del leader: comparte Postgres y LocalStack con wt-246 y wt-247. El leader lo corrió sobre HEAD `76444c93`. Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/514dba8a-c290-4329-b2f8-7d88945d9888/scratchpad/init-245.log`. El HEAD y el árbol siguen igual que en esa corrida: el `--fix` del lint no dejó cambios.

Una corrida anterior quedó roja solo por el flake conocido `#168 R2` de Salud (móvil, fuera de alcance). Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/514dba8a-c290-4329-b2f8-7d88945d9888/scratchpad/init-245-rojo-168R2.log`.

```
✅ Sin features en progreso (sesión limpia)
✅ Build exitoso
Test Suites: 207 passed, 207 total
Tests:       1743 passed, 1743 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 184 passed, 184 total
Tests:       6827 passed, 6827 total
✅ Tests pasados
✅ Esquema y recursos e2e listos
Test Suites: 3 skipped, 35 passed, 35 of 38 total
Tests:       8 skipped, 605 passed, 613 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
