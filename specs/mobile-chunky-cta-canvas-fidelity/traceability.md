---
feature: "mobile-chunky-cta-canvas-fidelity"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-chunky-cta-canvas-fidelity]]

Rutas relativas a `mobile-pet-tracker/`. «Nuevo» = `src/__tests__/chunky-cta-canvas-fidelity.test.ts`.
Los hashes los pone quien implementa tras cada commit (cadena en [[tasks]]).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/global-css.test.ts` :: `#177 R1: global.css declara el labio del primario en los dos temas` (2 `it`) | pendiente |
| R2 | `src/theme/__tests__/chunky-lip.test.tsx` :: `#177 R2.1` a `#177 R2.7` (7 `it`); R2.5 lo prueba además Nuevo `#177 R12.1/R12.2` | pendiente |
| R3 | Nuevo :: `#177 R3.1` (16), `#177 R3.2` (16), `#177 R3.3`; pruebas colocadas de los 14 ficheros cta | pendiente |
| R4 | Nuevo :: `#177 R4.1` (6), `#177 R4.2` (6), `#177 R4.3`; `consistency-classnames.test.ts` `#166 R3` | pendiente |
| R5 | Nuevo :: `#177 R5.1`, `#177 R5.2`; `screens/forgot/index.test.tsx` bloque `#167 R9` | pendiente |
| R6 | Nuevo :: `#177 R6.2` (seis recuentos) | pendiente |
| R7 | Nuevo :: `#177 R7.1` a `#177 R7.5` | pendiente |
| R8 | Nuevo :: `#177 R8.1` (3), `#177 R8.2`, `#177 R8.3` (6), `#177 R8.4` | pendiente |
| R9 | `src/__tests__/heroui-text-size-merge.test.ts` :: `#187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9)`; prueba de piso exacto (S10) | pendiente |
| R10 | `consistency-classnames.test.ts` (puntos 1 a 8), `design-drift.test.ts` (9 a 11), `account-screens-polish.test.ts` (12) y las pruebas colocadas de R10 | pendiente |
| R11 | Nuevo :: `#177 R11.1` a `#177 R11.5` | pendiente |
| R12 | Nuevo :: `#177 R12.1/R12.2`, `#177 R12.3`; guards existentes enteros (`design-drift`, `legibility-classnames`, `ui-copy-table`, `profile-canvas-fidelity`) | pendiente |
| R13 | `keeps` de R3.1 y R4.1; comandos `git diff H0..HEAD` de R13.2 y R13.3 (reviewer) | pendiente |
| R14 | Casilla humana «Smoke R14 en dev build de Android hecho por el humano»; sin test automático (Jest ve la forma del estilo, no el píxel) | pendiente (humano) |

Regla: el reviewer no aprueba si alguna fila queda «pendiente», salvo R14, que
cierra el humano (casilla propia en [[requirements]] § Gate humano de cierre).
**No rebasar** tras rellenar los hashes: un rebase los invalida; si pasa, se
reapuntan a los hashes nuevos en un commit aparte.
Convención de commit: `feat(#177 R<n>): <desc> (R<n>)`.
Ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5.
