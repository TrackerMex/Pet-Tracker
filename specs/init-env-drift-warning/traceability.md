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
| R3 | `env-drift.test.mjs::R3 (init-env-drift-warning #23): formatDriftLines separa gates de configuración` | rojo: `0c6aacb test(init-env-drift-warning): require drift warning format (R3)`; verde: este commit — `feat(init-env-drift-warning): format drift warnings (R3)` |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | sin test automatizado — ver §Verificación manual | pendiente |

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
| T0 | Captura de la §2 antes de tocar `init.sh` (`/tmp/env-section-antes.txt`) | pendiente |
| R12.1 | Con el `.env` incompleto (8 claves faltantes, 4 gates), `./init.sh` imprime las 4 líneas literales de R3 | pendiente |
| R12.2 | `.env` sin modificar: mismo `stat -c '%Y %s' .env` antes y después | pendiente |
| R12.3 | `./init.sh; echo $?` imprime `0` | pendiente |
| R12.4 / R9(b) | Con `.env` completo: sin líneas de aviso y `diff` de la §2 vacío | pendiente |

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
