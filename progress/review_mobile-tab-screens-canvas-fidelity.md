# review: mobile-tab-screens-canvas-fidelity
Fecha: 2026-10-15
Veredicto: APROBADO (condicionado: R16 y las casillas humanas quedan para el humano; ver Observaciones)

Rama `feature/173-mobile-tab-screens-canvas-fidelity`, HEAD `91b705ab`, H0 `adad3359295766758851761dce337f028671bc4b`. 33 commits sobre H0: 30 de Codex (c1 a c30, pares test/feat por requisito) más commits de docs del leader. Árbol limpio e índice vacío al terminar la revisión.

## Qué ejecuté yo y qué leí del log

Ejecutado por mí en esta revisión:
- `mcheck.py` (medidas M1 a M51 de la spec): 51 de 51 en ok.
- Reproducción independiente de 14 rojos, cada uno con el checkout del commit rojo (`.` más `../specs ../docs`), restauración con `git checkout HEAD -- . ../specs ../docs` y `git diff --quiet && git diff --cached --quiet` después. Recuentos de tests fallidos: R1 2, R2 2, R3 4, R4 6, R5 7, R6 12, R7 18, R8 12, R9 24, R10 14, R11 23, R12 3, R14 16, R17 1. Coinciden con los del informe del implementer. R6 se midió con `jest -i` porque el worker de jest se cae con JSON circular en rojos multi-fichero.
- Unas 60 mutaciones sobre producción, cada una restaurada con `git checkout HEAD --`; unas 50 murieron. Las que sobreviven están en Observaciones.
- Lectura completa de `src/screens/profile/index.test.tsx` (1752 líneas) y `src/__tests__/profile-canvas-fidelity.test.ts` (153 líneas), de `requirements.md` (961 líneas), `tasks.md`, `traceability.md`, del informe del implementer y de `progress/current.md`.
- Verificación de la fuente `assets/fonts/Inter-ExtraBold.ttf`: es Inter 4.001 ExtraBold genuina.
- Greps de la carta y de C8 (los 10 bloques R14, sus firmas sin marcar y el texto de la carta).
- Diff contra H0 de la lista cerrada de rutas, y del botón `profile-sign-out` (sin cambios).
- Ficheros sueltos de jest con `bunx jest --testTimeout=30000 --runTestsByPath <fichero>` con `(tabs)` escapado. El flake conocido `R1: me card > shows the real account name and email` no se disparó en ninguna corrida suelta.

Leído del log, NO ejecutado por mí (el clasificador deniega `./init.sh` al subagente y el leader ya lo corrió): `init-review-173.log` y `init-review-173.exit` en el scratchpad `h173/`, corrida sobre HEAD `91b705ab` con árbol limpio, EXIT=0. La primera corrida (`init-review-173-run1-sin-env.log`) falló solo por falta de `.env` en el worktree; no es un defecto del código.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #173).
- [x] `progress/current.md` actualizado (Reanudaciones 1 a 10).

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica, la feature es solo móvil; `git diff --stat adad3359..HEAD -- backend-pet-tracker` vacío.
- [x] repositories/contratos en domain son interfaces puras: no aplica, sin cambios de backend.
- [x] application depende de interfaces, no implementaciones: no aplica.
- [x] infrastructure sin lógica de negocio: no aplica. En móvil, la pantalla `src/screens/profile/index.tsx` es el único sitio con lógica nueva (`formatLastSignal`, cambio de tema e idioma) y la ruta `src/app/(tabs)/profile.tsx` sigue delgada.
- [x] Lista cerrada de rutas de la spec respetada: el diff contra H0 no toca nada fuera de ella.

## Checklist C4 — TDD
- [x] Cada R-id tiene al menos un test que lo nombra. R1 a R15 y R17 los nombran en `describe`/`it` (`#173 R4`, `R5`, `R8`, `R9`, `R11`, `R12` en `profile/index.test.tsx`; R1 a R3, R14 y R15 en `profile-canvas-fidelity.test.ts` y en los tests de tokens, Card, PetSwitcher y `_layout`; `#168 R4/R5/R6/R7 (enmendado por #173 Rn)` y `R2` para R17). R16 es gate humano, sin test.
- [x] El historial muestra test primero: cada requisito tiene su commit `test(mobile)` inmediatamente antes de su `feat(mobile)` (pares c91efe84/2d462afa, 9591e3f1/ca83aaf9, 7056ca0e/a18abc0d, fc6715cf/36356ae8, aaeb9bab/166c8af4, f785d96c/fe0dc8a5, 89795331/bf21fbbd, 427079ac/92308138, b73f4963/9b01360f, 44e0b9c6/94614567, 506ad153/74641446, b10028b7/83112c89, 1bb49c33/4369cafc, 0b6d8329/9222e981). Los rojos de 14 de ellos los reproduje (ver arriba). R13 va en un `refactor` (5e48dc40) sobre catálogo y tabla de copy, cubierto por los candados de delta que cambian en los commits de R7 a R12. R15 (2ed3a7fc) es solo candados de grep-limpio; su prueba de rojo es la sonda S15 del implementer.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" salvo R16, que es gate humano y la spec lo exceptúa expresamente (fila 26 y regla de la línea 29).
- [x] Commits en formato `feat(<scope>): <desc> (R-ids)`; aquí `feat(mobile): ... (#173 Rn)`, el estilo del repositorio.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla humana marcada (aprobación vía Notion, 2026-10-13).
- Nota: el frontmatter de `traceability.md` dice `status: draft`. Ver O3.

## Checklist C7 — Sin código huérfano
- [x] Los literales reemplazados (`profile.information`, `profile.gpsSettings`, `profile.account`, `profile.useLightTheme`) fueron eliminados del catálogo y de la tabla de copy; el grep-limpio R15 lo candada.
- [x] Sus tests también se eliminaron o se enmendaron (los `#168 R4/R5/R6/R7` quedaron "enmendados por #173 Rn").
- [ ] N/A: no aplica; la feature sí reemplaza etiquetas y el interruptor de tema.

## Resultado por punto de validación del leader
1. Spec y enmiendas E1 a E7: conforme. Las siete son correcciones factuales que no cambian el diseño ni la lista cerrada. Ver O4.
2. Historial test-primero: conforme (C4).
3. Medidas M1 a M51: 51 de 51 ok ejecutadas por mí.
4. Lista cerrada de rutas: conforme.
5. Calidad de candados y mutación: suficiente, con las supervivencias O1, O2 y O6.
6. Carta de UI, C8 y los 10 bloques R14: texto de la carta y bloques canónicos verificados; las firmas humanas están sin marcar, como corresponde antes del gate (el candado acepta `[ xX]`).
7. Pureza: `formatLastSignal` recibe `detail.dataUpdatedAt` (E4), sin `Date.now()` en render; `react-hooks/purity` verde en el lint del log.
8. R16 pendiente: humano.

## Observaciones
Ninguna bloqueante. Condiciones de cierre y puntos para el humano:

- Condición de cierre R16: prueba de humo en dev build de Android (claro y oscuro, es y en), a cargo del humano. Tampoco están firmadas las casillas humanas "Enmiendas R14 revisadas" ni la del copy R13.2.
- O1 (candado ausente, error de la spec, no del implementer): `disabled={photoUploading}` en el control `change-photo` (`src/screens/profile/index.tsx`, línea cercana a 353) no tiene candado; la mutación M1 sobrevive. R6.2 lo prescribe literalmente y la lista de tests de la spec no lo recoge. `handleChangePhoto` tampoco tiene guardia de reentrada, así que el candado útil sería un test que pulse dos veces durante una subida pendiente y espere una sola llamada a `launchImageLibraryAsync`. Registrar como deuda.
- O2 (candado ausente): en la rama de foto de `PetSwitcher variant="avatars"` (`src/components/pet-switcher.tsx`, cerca de la línea 46), `size={40}` y `cacheKey={pet.id}` de `PetAvatar` están prescritos por R4.2 pero no candados (M41 y M46 sobreviven). Deuda.
- O3 (trazabilidad): la fila de R13 de `traceability.md` omite los commits rojos `427079ac`, `44e0b9c6` y `506ad153` (los rojos de R8, R10 y R11 que mueven los candados de catálogo), y el frontmatter del fichero sigue en `status: draft`. Es higiene documental, no cambia el veredicto.
- O4 (enmiendas sin casilla): E1 a E7 son correcciones factuales sin firma humana. E3 edita `mobile-ui-language/design.md` §6.3 fuera del mecanismo de casilla firmada, y E4 ancla el tiempo relativo a la última carga del detalle (`dataUpdatedAt`) en lugar de a la hora actual. Conviene que el humano las lea en la PR.
- O5 (patrón habitual): varios commits `feat` ajustan recuentos de candados por delta (ui-language `R7_PROFILE`, `englishKeys`, consistency-classnames) y `bf21fbbd` cambia la aserción `'Hembra'`. Es el patrón de delta del repositorio; cada ajuste lo exige la propia spec.
- O6 (zona preexistente sin candado): la `className` de `profile-sign-out` (`rounded-xl bg-danger-soft`) no está candada (M58 sobrevive). R11.4 dice "sin cambios" y el diff contra H0 confirma que el botón no cambió.
- El flake conocido `R1: me card` no se reprodujo en corridas sueltas, así que no cuenta.

## Output de ./init.sh
Leído de `.../scratchpad/h173/init-review-173.log` (no ejecutado por el reviewer; corrida del leader sobre HEAD `91b705ab`, árbol limpio), `EXIT=0`:

```
Test Suites: 187 passed, 187 total          (backend unitarios)
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total              (backend e2e)
Tests:       14 passed, 14 total
Test Suites: 104 passed, 104 total          (mobile)
Tests:       3213 passed, 3213 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
Todo verde. Listo para trabajar.
Features: 159/173 completadas | 13 pendientes
```

El log solo contiene el aviso conocido de worker force-exit ("A worker process has failed to exit gracefully ...") al final de la suite móvil, preexistente en main. `grep -c "reading 'canceled'"` en el log da 0. Lint y typecheck en verde.
