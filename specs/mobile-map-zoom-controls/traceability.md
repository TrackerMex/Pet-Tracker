---
feature: "mobile-map-zoom-controls"
status: approved  # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-map-zoom-controls]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/components/__tests__/pet-map.test.tsx::R1 (mobile-map-zoom-controls): el wrapper oculta los controles nativos de zoom` | `e052b07 test(map): require hidden zoom controls (R1)` → `bf14baf fix(map): hide native zoom controls (R1)` |
| R2 | sin test propio — `progress/impl_mobile-map-zoom-controls.md::Verificación R2` (typecheck / lint / test móvil, `./init.sh`, allowlist de `git diff --stat`, grep-clean C8) + `docs/verification.md::### Feature 55 — mobile-map-zoom-controls` | pendiente |
| R3 | sin test — smoke humano en dev build de Android: controles `+` / `−` ausentes **y** pinch-to-zoom acercando y alejando, registrado en `progress/impl_mobile-map-zoom-controls.md::Resultado del smoke R3` y con la casilla marcada en [[requirements]] §Aprobación | pendiente |

Rutas relativas a `mobile-pet-tracker/` salvo las que empiezan por `docs/`,
`specs/` o `progress/`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente". Para R2 la
fila registra los comandos ejecutados y la sección escrita; **R3 la cierra
solo el humano** — ninguna IA puede correr un dev build en un dispositivo
real. Ojo: el test de R1 pasa verde igual con los controles visibles en
pantalla (mockea `GoogleMaps.View`), así que una tabla completa sin R3 marcado
**no** significa que los botones hayan desaparecido.

Convención de commit: `test(map): … (R1)` en rojo → `fix(map): … (R1)` en
verde → `docs(map): … (R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
