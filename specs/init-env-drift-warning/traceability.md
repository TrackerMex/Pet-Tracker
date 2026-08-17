---
feature: "init-env-drift-warning"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[init-env-drift-warning]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `env-drift.test.mjs::R1 (init-env-drift-warning #23): parseEnvKeys aplica las reglas de parseo` | rojo: `d7e5295 test(init-env-drift-warning): require env key parsing (R1)`; verde: `2a1a94c feat(init-env-drift-warning): parse env keys (R1)` |
| R2 | `env-drift.test.mjs::R2 (init-env-drift-warning #23): missingKeys solo reporta example → env` | rojo: `8c0d84e test(init-env-drift-warning): require one-way key diff (R2)`; verde: `5f9c1a5 feat(init-env-drift-warning): report missing env keys (R2)` |
| R3 | `env-drift.test.mjs::R3 (init-env-drift-warning #23): formatDriftLines separa gates de configuración` | rojo: `0c6aacb test(init-env-drift-warning): require drift warning format (R3)`; verde: `7f85092 feat(init-env-drift-warning): format drift warnings (R3)` |
| R4 | `env-drift.test.mjs::R4 (init-env-drift-warning #23): sin deriva no hay salida` | rojo: `1e60bfb test(init-env-drift-warning): require silent complete env (R4)`; verde: `15e188b feat(init-env-drift-warning): add silent drift CLI (R4)` |
| R5 | `env-drift.test.mjs::R5 (init-env-drift-warning #23): sin .env.example el script calla y sale 0` | rojo: `ba75bdc test(init-env-drift-warning): require silent missing files (R5)`; verde: `aeef03d feat(init-env-drift-warning): ignore unreadable env files (R5)` |
| R6 | `env-drift.test.mjs::R6 (init-env-drift-warning #23): el script nunca escribe en disco` | rojo: `e09c1ed test(init-env-drift-warning): require read-only execution (R6)`; verde: `2ba4ccc feat(init-env-drift-warning): use read-only filesystem access (R6)` |
| R7 | `env-drift.test.mjs::R7 (init-env-drift-warning #23): init.sh invoca el chequeo con warn()` | rojo: `d85dc9a test(init-env-drift-warning): require init warning integration (R7)`; verde: `4f738d5 feat(init-env-drift-warning): warn about env key drift (R7,R8,R9)` |
| R8 | `env-drift.test.mjs::R8 (init-env-drift-warning #23): el aviso no aborta` | rojo: `e5ec8ba test(init-env-drift-warning): require non-blocking warning (R8)`; verde: `4f738d5 feat(init-env-drift-warning): warn about env key drift (R7,R8,R9)` |
| R9 | `env-drift.test.mjs::R9 (init-env-drift-warning #23): sin deriva la seccion 2 no cambia` | rojo: `ee356a2 test(init-env-drift-warning): require unchanged quiet section (R9)`; verde: `4f738d5 feat(init-env-drift-warning): warn about env key drift (R7,R8,R9)`; manual: ver `progress/impl_init-env-drift-warning.md` §R9(b) |
| R10 | `env-drift.test.mjs::R10 (init-env-drift-warning #23): init.config.sh mantiene REQUIRED_ENV_VARS y ejecuta la suite` | rojo: `4235ed7 test(init-env-drift-warning): require suite integration (R10)`; verde: `cdd1343 feat(init-env-drift-warning): run drift suite from init (R10)` |
| R11 | `env-drift.test.mjs::R11 (init-env-drift-warning #23): documentacion y cero variables nuevas` | rojo: `45087f1 test(init-env-drift-warning): require verification docs (R11)`; verde: `9a1c23d docs(init-env-drift-warning): document manual verification (R11)` |
| R12 | sin test automatizado — ver §Verificación manual | `ed23bbe docs(init-env-drift-warning): record manual verification (R12)` |

Todos los tests viven en `env-drift.test.mjs` (raíz del repo), suite de
`node --test`. Nombre esperado de cada describe:
`R<n> (init-env-drift-warning #23): <resumen>` (ver [[requirements]]).

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Verificación manual (R9(b) y R12)

R12 no tiene test automatizado: es el procedimiento manual y su evidencia
literal es lo que se revisa. Cada fila se cierra pegando la salida en
`progress/impl_init-env-drift-warning.md`.

| Paso | Qué se comprueba | Resultado |
|---|---|---|
| T0 | Captura de la §2 antes de tocar `init.sh` (`/tmp/env-section-antes.txt`) | verde — ver `progress/impl_init-env-drift-warning.md` §T0 |
| R12.1 | Con el `.env` incompleto (8 claves faltantes, 4 gates), `./init.sh` imprime las 4 líneas literales de R3 | verde — salida literal en `progress/impl_init-env-drift-warning.md` §R12.1 |
| R12.2 | `.env` sin modificar: mismo `stat -c '%Y %s' .env` antes y después | verde — `1786743239 895` antes y después; ver §R12.2 del reporte |
| R12.3 | `./init.sh; echo $?` imprime `0` | verde — ver §R12.3 del reporte |
| R12.4 / R9(b) | Con `.env` completo: sin líneas de aviso y `diff` de la §2 vacío | verde — ver `progress/impl_init-env-drift-warning.md` §R9(b) |

## Archivos que deben quedar SIN cambios

El `reviewer` comprueba en el diff que ninguno de estos aparece modificado
(ver [[design]] §Archivos afectados):

| Archivo | Por qué |
|---|---|
| `backend-pet-tracker/**` | Esta feature no toca la aplicación |
| `infra/**` | Ni infraestructura |
| `.env.example` | Ninguna clave nueva; su CRLF **no** se normaliza (fuera de alcance) |
| `docs/conventions.md` | Cero variables de entorno nuevas ⇒ la tabla no gana filas (R11) |
| `init.sh` líneas 1-74 y 76-276 | El único cambio es el bloque insertado entre la 74 y la 76 (R7) |
| `init.config.sh` salvo `TEST_CMD` | `REQUIRED_ENV_VARS` sigue valiendo `("DATABASE_URL")` (R10) |
