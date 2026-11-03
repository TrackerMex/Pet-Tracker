# review: mobile-welcome-secondary-pressed (#231)
Fecha: 2026-11-03
Veredicto: APROBADO (re-revisión 2026-11-03; el RECHAZADO inicial queda superado, ver sección Re-revisión)

Razon en una linea: el codigo y los tests de R1-R6 estan bien, pero `specs/mobile-welcome-secondary-pressed/traceability.md` sigue con TODAS las filas "pendiente" (falta el commit 4 `docs(spec): #231 traceability`), y no se corrieron la suite completa, tsc ni lint. Codex paro por una contradiccion del propio handoff (ver Observaciones), no por un defecto de su trabajo.

Alcance revisado: R1-R6. R7 queda pendiente humano (gate G4, casilla sin firmar): comprobado que NO se implemento (ni `it('#231 R7 ...')` ni seccion en `docs/ui-guidelines.md`; `docs/` sin cambios). No es defecto.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (#231 sigue `spec_ready` en feature_list.json; ninguna otra in_progress; el cambio de estado lo hace el leader)
- [x] progress/current.md no tocado por Codex (acordado en el handoff)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (N/A: solo capa UI movil)
- [x] contratos en domain interfaces puras (N/A)
- [x] application depende de interfaces (N/A)
- [x] infrastructure sin logica de negocio (N/A)

## Checklist C4 — TDD
- [x] Cada R<n> de R1-R6 tiene test que lo nombra: R1 (2 it en welcome/index.test.tsx describe R8), R2 (describe '#231 R2'), R3 (welcome test A + chunky-cta-canvas-fidelity test B), R4 (global-css.test.ts), R5 (it existentes sin tocar), R6 (`#231 R6: los candados enmendados nombran su enmienda` + sufijo en los 3 pins; los 4 titulos afectados llevan `(enmendado por #231 R1, R3)`).
- [x] Historial test-primero: 63a6ca21 test (rojo, tests + 3 pins enmendados + R4) -> 17813a57 test R2 (nace verde, justificado en el reporte) -> 64a80f25 feat (unico cambio de produccion, 1 linea). Rojo por asercion documentado en el reporte (no por import roto).

## Checklist C5 — Trazabilidad
- [ ] traceability.md sin filas "pendiente": FALLA. `status: draft` y R1-R7 todas "pendiente | pendiente". `git diff 71a0e0f9..HEAD --stat` no incluye `specs/`. Falta el commit 4 del handoff. R7 debe quedar "pendiente (espera gate G4)" (esperado); R1-R6 deben llevar test y hash.
- [~] Formato de commit: `feat(mobile): ...  (R1, R3)` y `test(mobile): ... (R2)` / `(R1, R3, R4, R6)`; coherente con el handoff.

## Checklist C6 — Spec aprobada
- [x] requirements.md `status: approved`, casilla "Aprobado por humano (firma delegada ...)" marcada para R1-R6. G4 y G2 sin marcar (correcto, humanos).

## Checklist C7 — Sin codigo huerfano
- [x] N/A — esta feature no reemplaza nada existente (solo enmienda en sitio de 3 pins).

## Verificacion independiente (corrida por el reviewer en el worktree, sin ./init.sh)
`bunx jest src/screens/welcome src/__tests__/chunky-cta-canvas-fidelity src/__tests__/consistency-classnames src/theme/__tests__/global-css --runInBand --silent` -> 4 suites, 358 tests, exit 0.

Diff contra H0 (71a0e0f9), lista cerrada de ficheros: los 5 ficheros de `mobile-pet-tracker/` esperados (welcome/index.tsx, welcome/index.test.tsx, chunky-cta-canvas-fidelity.test.ts, consistency-classnames.test.ts, global-css.test.ts) + `progress/handoff_mobile-welcome-secondary-pressed.md` (ver Observaciones). Nada de backend, docs, global.css, home, dependencias. Cambio de produccion: solo el tag de `welcome-have-account`: `variant="outline"` y `dark:border-muted` al final; `style`, `onPress`, testID y etiqueta intactos; `welcome-get-started` sin tocar.

Pines enmendados con `(enmendado por #231 R1, R3)`: welcome test `es un boton de superficie...`, chunky `#177 R4.1` y `#177 R4.2`, consistency `#166 R3` it.each. Los tres con valores correctos (NEW_CLASSES, variante 'outline').

Mutaciones plantadas por el reviewer (cada una revertida con `git checkout HEAD -- <fichero>`; `node_modules` restaurado con cp y cmp; `git status` final limpio salvo el reporte sin commit):
- R1a (quitar `variant="outline"`): rojo en `#231 R1 secundario`, `#177 R4.1`, `#166 R3`.
- R3a (quitar `dark:border-muted`): rojo en `#231 R3` A, B (inventario), R4, pin `es un boton de superficie`, `#177 R4.1`.
- R3c (zona ciega: `dark:border-muted` copiado a `home-join-pet-button`): rojo `#231 R3: la excepcion dark:border-* vive solo en Bienvenida`.
- R4a (`dark:border-lip-gray`): rojo `#231 R4` (y R3 A, pins, inventarios).
- R4d (`--muted` oscuro a `#2A2F37` en global.css): rojo `#231 R4` (y 3 candados de paleta previos).
- R2 (outline -> `themeColorAccentHover` en button.tsx de heroui-native): rojo `#231 R2`.
- R6 (quitar el sufijo de consistency-classnames): rojo `#231 R6`.

## Observaciones (para corregir)
1. Falta el commit 4 `docs(spec): #231 traceability`: rellenar `specs/mobile-welcome-secondary-pressed/traceability.md` con test (archivo::nombre) y hash de commit para R1-R6 (63a6ca21 / 17813a57 / 64a80f25), R5 por los it existentes, R7 "pendiente (espera gate G4)". Sin filas pendientes para R1-R6 no hay aprobacion (regla del reviewer / C5). No rebasear tras escribirla.
2. Sin ejecutar por el PARA de Codex: suite movil completa (`bunx jest --ci`), tsc y lint finales, recomputacion final de T0. El leader debe obtenerlos (junto con `./init.sh`) antes del cierre.
3. Causa del PARA, defecto del HANDOFF y no de Codex: H0 `71a0e0f9` queda antes del commit `f47114d1` del propio handoff, y a la vez el handoff prohibe `progress/handoff_*.md` en el diff. Solucion: el leader corrige el control a `git diff --name-only f47114d1..HEAD` (o autoriza la excepcion del fichero del handoff) y reanuda a Codex solo para el commit 4 y las verificaciones finales. No se ve en el trabajo de Codex ninguna desviacion que obligue a reabrir R1-R6.
4. Pendientes humanos (no defectos): R7 (G4), G2 (smoke Android en lote), casillas correspondientes.
5. Reporte `progress/impl_...md` sin commit (segun handoff); mutaciones R4b/R4c/R4d del reporte de Codex no verificadas por el, pero R4a y R4d si las verifique yo.

## Re-revisión (acotada) — 2026-11-03
Veredicto: APROBADO. Alcance: solo las dos causas del rechazo (C5 y verificaciones finales). Sin jest ni init.sh (los corre el leader).

- C5 traceability.md (commit 7ba76320): R1-R6 con archivo::test y hashes literales completos. `git cat-file -e` confirma los tres (63a6ca21 test rojo, 17813a57 test R2, 64a80f25 feat). Los nombres de test citados existen en el código (grep -cF = 1 cada uno; sufijo `enmendado por #231 R1, R3` presente en welcome, chunky y consistency). R7 = "pendiente (espera gate G4)": pendiente humano, no defecto. Ninguna otra fila pendiente.
- Lista cerrada: `git diff --name-only f47114d1..HEAD` = exactamente 5 ficheros de mobile-pet-tracker (welcome/index.tsx, welcome/index.test.tsx, chunky-cta-canvas-fidelity.test.ts, consistency-classnames.test.ts, global-css.test.ts) + specs/mobile-welcome-secondary-pressed/traceability.md. Sin handoff, backend, docs, global.css, home ni dependencias.
- Producción sin cambios: `git diff 64a80f25..HEAD -- mobile-pet-tracker` vacío; el único commit nuevo (7ba76320) toca solo traceability.md.
- Informe de Codex (progress/impl_...md): guardas completas 79 suites / 1643 tests exit 0 (el primer intento tuvo un timeout de 60 s en celebration #171 R7.4 bajo carga, documentado, archivo aislado 66/66 verde y reintento con --runInBand verde); suite completa 178 suites / 6547 tests exit 0; tsc exit 0 con log de 0 bytes; lint LINT_OK con log de 0 bytes (el SIGKILL inicial documentado y repetido en aislado); mutaciones R4a-R4d y R6 completadas rojas y restauradas; T0 recomputado coherente; logs temporales borrados.
- Pendiente para el leader (no del implementer): `./init.sh` propio antes del cierre/PR a dev; G2 y G4 humanos sin marcar (correcto).
