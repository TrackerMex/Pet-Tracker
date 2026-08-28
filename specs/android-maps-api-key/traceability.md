---
feature: "android-maps-api-key"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[android-maps-api-key]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `app.config.test.ts::R1: la config resuelta inyecta la clave de Android desde el entorno` | `4396b75 test(android-maps-api-key): define config injection in red (R1)` → `28906d4 feat(android-maps-api-key): inject Android Maps plugin (R1)` |
| R2 | `app.config.test.ts::R2: sin la variable no se declara el plugin y se avisa sin lanzar` | `8be06f1 test(android-maps-api-key): define missing-key warning in red (R2)` → `7d1778c feat(android-maps-api-key): warn without empty plugin (R2)` |
| R3 | `app.config.test.ts::R3: la clave viaja por entorno, nunca por el repo` | pendiente |
| R4 | sin test (documentación) — `docs/verification.md::Feature 52 — android-maps-api-key`, verificada por el reviewer | pendiente |
| R5 | sin test — `progress/impl_android-maps-api-key.md::Verificación R5` (typecheck/lint/test móvil, `./init.sh`, allowlist del diff) | pendiente |
| R6 | pendiente (smoke humano en dev build de Android — lo registra el humano) | pendiente |

Rutas relativas a `mobile-pet-tracker/` salvo las que empiezan por `docs/`
o `progress/`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente" — para R4 y
R5 la fila registra la sección escrita y los comandos ejecutados, y para R6
el smoke lo registra el humano en `progress/impl_android-maps-api-key.md`
antes de que la feature pase a `done` (ver [[requirements]] §Aprobación,
segunda casilla).
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
