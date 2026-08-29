---
feature: "android-maps-api-key"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[android-maps-api-key]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `app.config.test.ts::R1: la config resuelta inyecta la clave de Android desde el entorno` — desde #54 R5 el mecanismo es `android.config.googleMaps.apiKey`; el requisito de fondo (clave desde el entorno) sigue vigente | `4396b75 test(android-maps-api-key): define config injection in red (R1)` → `28906d4 feat(android-maps-api-key): inject Android Maps plugin (R1)` |
| R2 | `app.config.test.ts::R2: sin la variable no se declara el plugin y se avisa sin lanzar` | `8be06f1 test(android-maps-api-key): define missing-key warning in red (R2)` → `7d1778c feat(android-maps-api-key): warn without empty plugin (R2)` |
| R3 | `app.config.test.ts::R3: la clave viaja por entorno, nunca por el repo` | `729dc24 test(android-maps-api-key): define secret-free env contract in red (R3)` → `e4512ad docs(android-maps-api-key): document private build key (R3)` → `dfb5198 test(android-maps-api-key): type Node env helpers (R3,R5)` |
| R4 | sin test (documentación) — `docs/verification.md::Feature 52 — android-maps-api-key`, verificada por el reviewer | `c234285 docs(android-maps-api-key): add Android dev-build runbook (R4)` |
| R5 | sin test propio — `progress/impl_android-maps-api-key.md::Verificación R5` (typecheck/lint/test móvil, `./init.sh`, allowlist, secretos, `expo config` y C8) | `e21f605 test(android-maps-api-key): verify regression and containment (R5)` |
| R6 | smoke humano corrido el 2026-08-28 con resultado registrado en `progress/impl_android-maps-api-key.md::Resultado del smoke R6`: `grep` de meta-data = 1, Map monta sin crash con la vista nativa creada (watermark visible) y `adb logcat` limpio de las cuatro cadenas | `8fef190 docs(android-maps-api-key): prepare human Android smoke (R6)`; R6 acotado a la clave el 2026-08-28 — el render de tiles/marker salió del alcance y vive en #54 `android-map-never-ready`; falta solo la casilla del humano en [[requirements]] §Aprobación |

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
