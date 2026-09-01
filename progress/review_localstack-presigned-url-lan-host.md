# review: localstack-presigned-url-lan-host
Fecha: 2026-09-01
Veredicto: APROBADO (cubre R1–R5; R6 es gate humano posterior y queda fuera de este veredicto)

Base de comparación: `58d19c3` (último commit del leader antes del implementer).
Commits revisados: `f3fa40a` → `2e2dca0` → `9f100a0` → `b2cff5b` → `364fbf9`.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #57, verificado por script)
- [x] progress/current.md actualizado — describe la sesión activa (leader); Codex no lo tocó

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — domain/application sin una línea de diff
- [x] repositories/contratos en domain son interfaces puras — el puerto `PhotoStorage` intacto
- [x] application depende de interfaces, no implementaciones — sin cambios en application
- [x] infrastructure sin lógica de negocio — el cambio entero vive en
      `backend-pet-tracker/src/aws/aws-clients.ts` (infraestructura compartida),
      exactamente los tres hunks de design D1–D2

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra: `presign-endpoint.spec.ts`
      → `R1:`, `R2:`, `R3:`; `photo-storage.presign-host.spec.ts` → `R4:`
      (archivos nuevos por-feature, R-ids sin sufijo según design §D5)
- [x] Historial de commits muestra test-primero: `f3fa40a` (solo
      `presign-endpoint.spec.ts`, 156+) y `2e2dca0` (solo
      `photo-storage.presign-host.spec.ts`, 35+) preceden a `9f100a0` (solo
      `aws-clients.ts`, 19+/1−). `git show --stat` confirma **cero líneas de
      producción en los commits de test**.
- [x] Rojo reproducido por el reviewer en worktree aislado (`git worktree add`,
      node_modules symlinkeados, patrón del review de #54):
      - en `f3fa40a`: `jest src/aws/presign-endpoint.spec.ts` → exit 1,
        `1 failed, 9 passed, 10 total` — idéntico al reporte
      - en `2e2dca0`: `jest .../photo-storage.presign-host.spec.ts` → exit 1,
        `2 failed, 2 total`, host recibido `localhost:4566` — idéntico al reporte

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" en R1–R5; cada fila con
      test::describe y commit rojo→verde. La fila R6 dice "pendiente" **por
      diseño**: es el smoke humano en dispositivo físico, la propia tabla y la
      spec lo declaran cierre exclusivo del humano — no computa contra este
      veredicto (mismo criterio que #55 R3).
- [x] Commits siguen el formato con R-ids: `test(aws): … (R1-R3)`,
      `test(media): … (R4)`, `fix(aws): … (R1-R4)`, `docs(aws): … (R5)`

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada
      (2026-09-01, commit humano `fe38957`)
- [x] Ningún requisito modificado tras la aprobación: desde `58d19c3` el único
      fichero de `specs/` tocado es `traceability.md` (la tabla que el
      implementer debe rellenar)

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature no reemplaza nada existente (añade una variable
      opcional; ausente ⇒ comportamiento previo intacto, pineado por R2)

## Comprobaciones específicas de #57

### Allowlist R5 / contención
`git diff --name-status 58d19c3...HEAD` toca exactamente 8 rutas, todas en la
allowlist: `.env.example`, `aws-clients.ts`, los dos specs nuevos,
`docs/conventions.md`, `docs/verification.md`, el impl report y
`traceability.md`. Diff negativo re-ejecutado por el reviewer
(`git diff --exit-code 58d19c3...HEAD -- <lista prohibida>`) → exit 0, **cero
líneas** en `photo-storage.s3.adapter.ts`, su spec, `aws.module.ts`,
provisioning, `scripts/provision-local.ts`, `docker-compose.yml`,
`mobile-pet-tracker/`, `infra/`, `progress/current.md`, `feature_list.json` y
el resto de `specs/`.

### R3 — modo aws intacto
El diff de `aws-clients.ts` tiene solo 3 hunks: campo opcional
`presignEndpoint` en `AwsRuntimeConfig`, lectura con `trim()` en
`resolveAwsConfigFromConfigService` (spread condicional, solo `local`), y
override de `endpoint` dentro de la rama `local` de `createS3Client` — solo
`S3Client`. `assertNoEndpoint`, `assertEndpoint`, `resolveAwsConfigFromEnv`,
`resolveAwsClientOptions` y los dos errores nombrados: sin diff. Los tests R3
asertean el guard vivo (`UnexpectedAwsEndpointError`) y `s3.config.endpoint
=== undefined` en modo aws con la variable presente.

### R4 — presigner real + mutación manual
`photo-storage.presign-host.spec.ts` no contiene `jest.mock` (grep exit 1):
firma con el presigner real y aserta host `192.168.7.42:4566`, pathname
path-style `/pet-tracker-media-local/pets/photo.jpg`, `X-Amz-Signature`
presente y `X-Amz-SignedHeaders` conteniendo `host`, para `createUploadUrl` y
`createDownloadUrl`. **Mutación ejecutada por el reviewer** (en worktree, en
HEAD): quitado el override `...(config.presignEndpoint ? { endpoint: … } : {})`
de `createS3Client` → las dos suites se ponen rojas (2 suites failed, 3 tests
failed: R1 + los dos de R4). Mutación revertida y worktree eliminado; working
tree principal limpio (`git status` vacío).

### Docs R5
- `.env.example:39-47` — bloque comentado, literal de design §D7
- `docs/conventions.md:237` — fila de `AWS_PRESIGN_ENDPOINT_URL` en
  §Variables de entorno, literal de §D7
- `docs/verification.md:571-624` — `### Feature 57` tras Feature 54 y antes de
  "Notas para el implementer", con los 4 pasos del runbook R6 (host LAN en la
  URL de API, `curl -fsS` exit 0, subida+carga en dispositivo, logcat sin
  `ConnectException`) más troubleshooting (firewall 4566, IP que cambia de red,
  10.0.2.2 no sustituye el smoke)

### Violaciones de proceso de #44 — no repetidas
- `feature_list.json`: sin diff desde `58d19c3`; #57 sigue `in_progress`,
  nada marcado done por Codex
- Spec aprobada: intacta salvo `traceability.md`
- `progress/current.md`: sin diff desde `58d19c3`
- Sin push, sin `cdk deploy`, sin recursos AWS reales

## Observaciones
Ninguna que bloquee. Las cifras del reporte del implementer coinciden exactas
con la re-ejecución independiente (rojo de ambos commits de test, verde final,
suite completa). El flake móvil que el implementer vio en su primer `./init.sh`
(add-pet, feature #53 pendiente) no apareció en la corrida del reviewer.

**Queda abierto para cerrar la feature**: R6 (smoke humano en dispositivo
físico, runbook en `docs/verification.md` §Feature 57) + marcar la segunda
casilla de §Aprobación y la fila R6 de traceability. Sin eso, #57 no se marca
done aunque este review esté aprobado.

## Output de ./init.sh (ejecutado por el reviewer, exit 0)
```
✅ Build exitoso
Backend:  Test Suites: 158 passed, 158 total / Tests: 1210 passed, 1210 total
Infra:    Test Suites: 2 passed, 2 total   / Tests: 14 passed, 14 total
Móvil:    Test Suites: 51 passed, 51 total / Tests: 569 passed, 569 total / Snapshots: 1 passed
E2E:      Test Suites: 3 skipped, 23 passed, 23 of 26 total / Tests: 8 skipped, 349 passed, 357 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
(log completo de 9699 líneas en el scratchpad de la sesión del reviewer;
exit code 0 confirmado por el harness de la tarea en background)
