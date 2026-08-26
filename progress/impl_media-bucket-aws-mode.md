---
feature: "media-bucket-aws-mode"
issue: 51
branch: "feature/51-media-bucket-aws-mode"
date: 2026-08-26
status: implementation_complete_human_smoke_pending
---

# Implementación — media-bucket-aws-mode (#51)

## Resultado

- **R1 cerrado:** con `AWS_MODE=aws`, ambos resolvers recortan y usan
  `MEDIA_BUCKET_NAME`; los otros nueve nombres quedan desnudos y el provider
  `AWS_RESOURCE_NAMES` expone el mismo bucket al adapter existente.
- **R2 cerrado:** `MissingMediaBucketNameError` aborta ambos resolvers y el
  bootstrap de Nest ante valor ausente, vacío o compuesto por espacios. El
  mensaje indica el stack, el comando de descubrimiento y el riesgo evitado.
- **R3 cerrado:** `LocalMediaBucketNameError` rechaza tanto
  `pet-tracker-media-local` como cualquier prefijo
  `pet-tracker-media-local-` después del trim, sin rechazar el nombre real.
- **R4 cerrado:** el modo local ignora la variable por completo, conserva
  `pet-tracker-media-local` / `pet-tracker-media-local-test`, no consulta la
  clave mediante `ConfigService` y `.env.example` la documenta comentada. El
  detector de deriva produjo cero bytes y la regresión completa quedó verde.
- **R5 entregado hasta el gate humano:** la suite real hace PUT → GET →
  comparación de bytes → `DeleteObject`, pero queda gated por `AWS_MODE=aws`;
  en local se verificaron 2 tests skipped y cero red. La guía de curl a nivel
  app está en `docs/verification.md`. El round-trip real no fue ejecutado y la
  feature permanece `in_progress`, como exige la spec.

No se creó, modificó ni consultó ningún recurso de la cuenta AWS real.

## TDD y commits

| R-id | Rojo / gate verificable | Verde / documentación |
|---|---|---|
| R1 | `64af37a` — los 5 casos recibían `pet-tracker-media-local` | `b3db47e` — override en ambos resolvers y provider, 21/21 verdes |
| R2 | `452efc2` — 8 fallos: no había clase, throw ni aborto de `compile()` | `8b801f2` — error tipado y guard previo a construir nombres, 32/32 verdes |
| R3 | `bfb6be3` — 5 fallos: los nombres locales eran aceptados | `62f5171` — rechazo exacto/prefijo y mensaje de seguridad, 41/41 verdes |
| R4 | `a86844e` — 26 casos locales verdes y 1 fallo real por faltar el bloque comentado de env | `f577adc` — bloque comentado, 51/51 suites AWS dirigidas y cero deriva; `8d77350` — regresión y contención completas |
| R5 | `d458f36` — gate verificable de la spec: 1 suite / 2 tests skipped en local, sin red | `d05581c` — procedimiento adapter + curl documentado; ejecución real reservada al humano |

Los nombres exactos de las suites y todos los pares están en
`specs/media-bucket-aws-mode/traceability.md`.

## Comandos ejecutados

| Comando | Exit | Resultado relevante |
|---|---:|---|
| `git pull && git checkout feature/51-media-bucket-aws-mode` | 0 | Rama actualizada y seleccionada |
| `./init.sh` (baseline) | 0 | 149 suites / 1126 tests backend; 21 suites / 336 tests e2e; infra y móvil verdes |
| Jest dirigido R1 (rojo) | 1 esperado | 5 fallos: el bucket seguía siendo local |
| Jest dirigido R1 (verde) | 0 | 2 suites, 21 tests |
| Jest dirigido R2 (rojo) | 1 esperado | 8 fallos de guard/bootstrap ausente |
| Jest dirigido R2 (verde) | 0 | 3 suites, 32 tests |
| Jest dirigido R3 (rojo) | 1 esperado | 5 fallos de rechazo/clase ausente |
| Jest dirigido R3 (verde) | 0 | 4 suites, 41 tests, incluido `resource-names-guard` |
| Jest dirigido R4 (rojo) | 1 esperado | Solo falló la documentación comentada; los 26 casos de modo local ya protegían la regresión |
| Jest dirigido R4 (verde) + suites AWS existentes | 0 | 4 suites, 51 tests |
| `node env-drift.mjs` | 0 | Cero bytes de salida; la línea comentada no es una clave |
| Suite R5 en modo local | 0 | 1 suite / 2 tests skipped; sin red |
| `docker compose up -d` | 0 | Postgres y LocalStack locales healthy |
| `pnpm -C backend-pet-tracker run lint` | 0 | Sin errores; Prettier ajustó un salto de línea del test R4 |
| `pnpm -C backend-pet-tracker test` | 0 | 150 suites, 1153 tests |
| `pnpm -C backend-pet-tracker run test:e2e` (primer intento) | 1 | Estado compartido previo en colas: 3 suites ajenas fallaron; las tres pasaron aisladas (20/20, 33/33 y 31/31) |
| `pnpm -C backend-pet-tracker run test:e2e` (segundo intento) | 1 | Una corrida fallida de alerts dejó miles de mensajes y saturó LocalStack; timeouts en 3 suites ajenas |
| Purga de las 6 colas `*-test` + restart LocalStack + `provision:local` | 0 | Solo artefactos e2e locales; colas de desarrollo intactas; provisioning idempotente |
| `pnpm -C backend-pet-tracker run test:e2e` (final) | 0 | 21 suites / 336 tests verdes; 3 suites / 8 tests gated skipped |
| `./init.sh` (final) | 0 | Todo verde: build; backend 150/1153; infra 2/14; móvil 47/532; e2e 21/336 con 3 suites gated; lint y typecheck |

## Contención y modo local

- El grep literal de R4 sobre `git diff --stat main...HEAD` solo conserva la
  línea resumen `11 files changed, ...`; no es una ruta fuera del allowlist.
  El equivalente sin abreviación, `git diff --name-only main...HEAD` con el
  mismo allowlist, produjo salida vacía.
- Desde el inicio de implementación (`61c1c66`) cambiaron únicamente:
  `.env.example`, los tres archivos previstos de `src/aws/`, la suite e2e
  nueva, `docs/verification.md`, `specs/media-bucket-aws-mode/` y `progress/`.
- `backend-pet-tracker/src/aws/resource-names.spec.ts` solo modifica los dos
  `it` autorizados por R1. `buildResourceNames`, `resolveResourceSuffix`,
  `constants.ts`, `AwsModule`, `PhotoStorageS3Adapter`, provisioning, `infra/`
  y móvil no tienen cambios de implementación.
- Los tests R4 cubren ambos resolvers con/sin `MEDIA_BUCKET_NAME`, con/sin
  `NODE_ENV=test`, y demuestran que `ConfigService.get('MEDIA_BUCKET_NAME')`
  no se invoca en local.
- `.env.example` es el archivo raíz definido por D6 y por
  `docs/conventions.md`; no existe ni se creó una copia dentro de
  `backend-pet-tracker/`.

## Incidencias y límites

1. Las dos primeras corridas e2e finales expusieron contaminación/saturación
   de LocalStack ajena al diff. Se resolvió sin tocar código: se purgaron solo
   `positions-raw[-dlq]-test`, `notifications[-dlq]-test` y
   `geofence-events[-dlq]-test`, se reinició LocalStack y se reprovisionó. La
   corrida completa posterior pasó.
2. Los archivos untracked preexistentes de skills/agentes y
   `progress/review_mobile-theme-transition.md` se preservaron y no se
   incluyeron en ningún commit.
3. `STATUS.md` ya estaba desactualizado (43/50 declarado frente a 44/51 real)
   al iniciar. Se conserva fuera del diff por el allowlist cerrado de R4; la
   feature #51 sigue siendo la única `in_progress` hasta el smoke humano.

## Handoff humano R5

Sigue `docs/verification.md` §`Feature 51 — media-bucket-aws-mode`, registra
el resultado real en este archivo y marca la segunda casilla de
`requirements.md`. Solo después del round-trip AWS real y la review puede
cambiarse #51 a `done`.
