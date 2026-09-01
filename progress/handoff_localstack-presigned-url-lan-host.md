# Handoff a Codex CLI — #57 `localstack-presigned-url-lan-host`

> Escrito por el leader el 2026-09-01, tras la aprobación humana de la spec
> (commit `fe38957`). El humano pega el prompt de abajo en Codex CLI.

## Prompt

```
Feature: localstack-presigned-url-lan-host (#57), branch: feature/57-localstack-presigned-url-lan-host
Antes de nada: git checkout feature/57-localstack-presigned-url-lan-host && git pull

Spec aprobada: specs/localstack-presigned-url-lan-host/requirements.md (status: approved)
Lee también: specs/localstack-presigned-url-lan-host/design.md y tasks.md — no
hay decisiones abiertas; D1-D7 fijan el diff exacto. Feature de backend puro:
NO cargues skills expo, NO toques mobile-pet-tracker/.

Archivos a crear:
  - backend-pet-tracker/src/aws/presign-endpoint.spec.ts               (R1-R3)
  - backend-pet-tracker/src/modules/media/infrastructure/photo-storage.presign-host.spec.ts  (R4)
Archivos a modificar:
  - backend-pet-tracker/src/aws/aws-clients.ts   (único diff de producción, ~6 líneas)
  - .env.example, docs/conventions.md, docs/verification.md   (R5, bloques literales en design.md §D7)
PROHIBIDO tocar: photo-storage.s3.adapter.ts, photo-storage.s3.adapter.spec.ts,
  aws.module.ts, provisioning, mobile-pet-tracker/**, progress/current.md,
  specs/** (la spec está aprobada: si crees que tiene un error, PARA y
  repórtalo en progress/impl_localstack-presigned-url-lan-host.md, no la edites),
  feature_list.json (el status lo cambia el leader tras el veredicto del reviewer, nunca tú)

Reglas críticas:
  - Arquitectura de docs/architecture.md y convenciones de docs/conventions.md
  - TDD ESTRICTO con historial rojo→verde (C4 de CHECKPOINTS.md). Orden de
    commits obligatorio, uno por paso de tasks.md:
      1. test(aws): require presign endpoint LAN en modo local (R1-R3)   ← solo test, suite ROJA
      2. test(media): URL prefirmada firmada con host LAN (R4)           ← solo test, suite ROJA
      3. fix(aws): firma URLs prefirmadas de S3 con AWS_PRESIGN_ENDPOINT_URL (R1-R4)  ← producción, todo VERDE
      4. docs(aws): document AWS_PRESIGN_ENDPOINT_URL y smoke #57 (R5)
    Meter test + implementación + docs en un solo commit = rechazo directo.
    Registra la salida roja de 1 y 2 en el reporte antes de escribir producción.
  - Actualizar specs/localstack-presigned-url-lan-host/traceability.md tras
    cada commit (es el único fichero de specs/ que sí editas)
  - Commitea en la branch; NO pushees — el leader pushea tras el veredicto del reviewer
  - No crear recursos AWS reales, no cdk deploy, no tocar el guard
    assertNoEndpoint: el modo aws queda con cero líneas de diff (R3)

Criterios de aceptación: R1, R2, R3, R4, R5 de requirements.md (R6 es smoke
humano en dispositivo físico, fuera de tu alcance — al terminar R5 avisa y para).
Cierre: pnpm --filter backend-pet-tracker test, ./init.sh en la raíz y
git diff --stat main...HEAD contra la allowlist de R5; salida completa en
progress/impl_localstack-presigned-url-lan-host.md
```

## Después del handoff (leader)

1. Mientras Codex implementa: no tocar `backend-pet-tracker/` (un solo
   escritor sobre el working tree).
2. Humano confirma fin → leer `progress/impl_localstack-presigned-url-lan-host.md`
   → lanzar `reviewer`.
3. Veredicto aprobado → push de la branch + `gh pr create`.
4. R6 (smoke en dispositivo físico) lo cierra el humano y firma la segunda
   casilla de §Aprobación antes de marcar #57 `done`.
