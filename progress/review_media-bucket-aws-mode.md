---
feature: "media-bucket-aws-mode"
issue: 51
branch: "feature/51-media-bucket-aws-mode"
reviewer: "reviewer (Claude, worktree detached en 926d7c6)"
date: 2026-08-26
verdict: APROBADO
---

# review: media-bucket-aws-mode

Fecha: 2026-08-26 ~21:45 UTC
Veredicto: **APROBADO** — condicionado al gate humano de R5 (smoke AWS real),
que la spec reserva explícitamente al humano. La feature permanece
`in_progress` hasta que el humano ejecute el round-trip real
(`docs/verification.md` §Feature 51), lo registre en
`progress/impl_media-bucket-aws-mode.md` y marque la segunda casilla de
`requirements.md`.

Revisión hecha en worktree detached propio sobre `926d7c6`
(= origin/feature/51-media-bucket-aws-mode), sin tocar el checkout principal.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (#51) en `feature_list.json`
- [x] `progress/current.md` describe la sesión activa de #51 (implementación
      completa, smoke humano y review pendientes)

## Checklist C3 — Arquitectura
- [x] La feature vive entera en la capa compartida `src/aws/` como fija la
      spec; `domain`/`application` sin cambios
- [x] Guards de configuración sin lógica de negocio;
      `PhotoStorageS3Adapter`, `AwsModule` y `buildResourceNames` intactos
- [x] El adapter sigue recibiendo `mediaBucket` por el provider
      `AWS_RESOURCE_NAMES` (interfaz `AwsResourceNames`), sin dependencia nueva

## Checklist C4 — TDD
- [x] Cada R1–R5 tiene tests que lo nombran:
      `src/aws/media-bucket-aws-mode.spec.ts` (R1–R4, describe por R-id),
      `test/aws-real-media.e2e-spec.ts` (R5),
      más los dos `it` autorizados de `resource-names.spec.ts`
- [x] Historial test-primero verificado commit a commit (61c1c66→926d7c6):
      cada R-id tiene commit `test(...)` rojo que SOLO toca tests
      (64af37a, 452efc2, bfb6be3, a86844e, d458f36) seguido de su
      `feat(...)`/`docs(...)` verde que solo toca implementación/docs
      (b3db47e, 8b801f2, 62f5171, f577adc, d05581c). El único retoque de test
      en un commit verde (b3db47e) es un reformat de Prettier sin cambio de
      aserción.

## Checklist C5 — Trazabilidad
- [x] `specs/media-bucket-aws-mode/traceability.md` sin filas "pendiente";
      R5 anota correctamente que la ejecución real queda al humano
- [x] Cada R-id con test (archivo::describe) y par de commits rojo→verde citados;
      hashes verificados contra `git log`
- [x] Commits siguen `test|feat|docs(media-bucket-aws-mode): <desc> (R<n>)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`
- [x] Casilla "Aprobado por humano" marcada (2026-08-26), commit humano
      5642233 (AlexisSM377)
- [x] Ningún requisito modificado tras el gate: el único cambio posterior
      (0af953f) es el flip administrativo del frontmatter draft→approved

## Checklist C7 — Sin código huérfano
- [x] N/A — esta feature no reemplaza nada existente (añade override + guards;
      el modo local conserva su comportamiento y sus tests)

## Verificación del código contra la spec

- **R1**: `resolveResourceNamesFromEnv` y
  `resolveResourceNamesFromConfigService` (ambos resolvers) aplican el
  override `MEDIA_BUCKET_NAME` con `.trim()` solo cuando
  `resolveAwsMode === 'aws'`; los otros nueve nombres salen desnudos
  (`buildResourceNames(suffix='')`, `NODE_ENV=test` ignorado). Test del
  provider `AWS_RESOURCE_NAMES` vía `Test.createTestingModule` incluido.
- **R2**: `MissingMediaBucketNameError` exportada de `resource-names.ts`,
  lanzada ante ausente/`''`/espacios antes de construir nombres; test de
  aborto del `compile()` del módulo incluido. Mensaje cumple design §D2.
- **R3**: `LocalMediaBucketNameError` rechaza `pet-tracker-media-local`
  exacto y prefijo `pet-tracker-media-local-` (tras trim); nombre real
  aceptado. Mensaje cumple design §D3 (namespace global / bucket ajeno).
  Sin imports nuevos de `constants.ts` en tests (D5 respetado).
- **R4**: modo local ignora la variable por completo (test prueba además que
  `ConfigService.get('MEDIA_BUCKET_NAME')` no se invoca);
  `.env.example` la documenta comentada; `node env-drift.mjs` → exit 0,
  0 bytes (re-ejecutado por el reviewer). Contención re-verificada:
  el grep literal de la spec sobre `git diff --stat main...HEAD` deja solo
  la línea resumen, y `git diff --name-only main...HEAD` da exactamente los
  13 archivos del allowlist. `resource-names.spec.ts` cambia SOLO los dos
  `it` autorizados (diff completo revisado).
- **R5 (parte verificable por IA)**: `test/aws-real-media.e2e-spec.ts` usa el
  patrón `runSmoke ? describe : describe.skip`, nombra su R-id, y en modo
  local queda 1 suite / 2 tests skipped sin tocar red (re-ejecutado aislado
  por el reviewer). Guard de credenciales estáticas presente. Borrado del
  objeto de prueba en `afterAll`. `docs/verification.md` §Feature 51
  documenta adapter gated + flujo curl a nivel app.
  **Ejecución real: PENDIENTE — la cierra el humano.**

## Output de ./init.sh (ejecutado por el reviewer en su worktree)

```
Backend:  Test Suites: 150 passed / Tests: 1153 passed
Infra:    Test Suites: 2 passed   / Tests: 14 passed
Móvil:    Test Suites: 47 passed  / Tests: 532 passed (1 snapshot)
E2E:      Test Suites: 21 passed, 3 skipped (gated) / Tests: 336 passed, 8 skipped
Suite R5 aislada: 1 skipped / 2 tests skipped, 0.85 s, sin red
EXIT=0
```

Nota de entorno (no atribuible al diff): la primera corrida de init.sh en el
worktree falló en e2e con `password authentication failed` porque el
bootstrap de `.env` desde `.env.example` apunta a `localhost:5432` y el
Postgres del proyecto en esta máquina vive en `5433` (patrón ya conocido de
puerto 5432 duplicado). Con el `.env` real copiado al worktree, init.sh
completo salió exit 0 al primer reintento. Coincide con la incidencia de
LocalStack/entorno que el implementer documentó sin tocar código.

## Observaciones (no bloqueantes)

1. Frontmatter de `design.md`, `tasks.md` y `traceability.md` sigue
   `status: draft` mientras que en #49 el gate los dejó en `approved`
   (al menos traceability). Cosmético, archivo de harness — puede
   corregirlo el leader en el cierre.
2. `STATUS.md` desactualizado (44/51) ya venía así y queda fuera del
   allowlist de R4, como anotó el implementer.

## Condiciones para `done`

1. Humano ejecuta el smoke R5 real (`docs/verification.md` §Feature 51),
   lo registra en `progress/impl_media-bucket-aws-mode.md` y marca la
   segunda casilla de `requirements.md`.
2. PR y merge por el humano según flujo de branches.
