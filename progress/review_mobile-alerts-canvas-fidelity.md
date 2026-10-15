# review: mobile-alerts-canvas-fidelity
Fecha: 2026-10-15
Veredicto: RECHAZADO

HEAD revisado: `5d221d42f37df21df72474a5fcfb1a51d3d610e7` (H0 = `eeacbf11dae2c43d5a052b405212281e4916fda8`), worktree `/home/claude/sites/Pet-Tracker-wt-174`.
Una sola causa de rechazo, mecánica y de solo test (hallazgo 1). Todo lo demás verificado conforme.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json` id 174; init.sh del leader corrió sin abortar en la regla de una sola `in_progress`)
- [x] progress/current.md actualizado (entradas del 2026-10-15 hasta REANUDACION 6)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (N/A: feature solo móvil, sin backend tocado; `git diff --name-only` no lista `backend-pet-tracker/`)
- [x] repositories/contratos en domain son interfaces puras (N/A)
- [x] application depende de interfaces, no implementaciones (N/A)
- [x] infrastructure sin lógica de negocio (N/A)
- [x] Lista cerrada de rutas: 15 de código/docs (`docs/ui-guidelines.md` y 14 bajo `mobile-pet-tracker/src/`) más 8 de `specs/` = 23; nada fuera de `progress/`.

## Checklist C4 — TDD
- [ ] Cada R<n> tiene al menos un test que lo nombra: **R9 no** (hallazgo 1). R1–R8 y R10–R12 sí.
- [x] Historial test-primero: los 12 commits rojos de Codex (935bc377, 2cf3af42, 51643651, d50a7725, be884964, e203fb4d, 3b08e217, d5f65426, 0bea4c53, 3ea1e9e2, efeda6b1, 4c09c120) tocan solo ficheros de test (`git show --stat`); los verdes (f80ba7d8, f35d9a61, 05e0df84, 4d3f2d3a, 3fd6deb1, b3f4460c, 26077014, cb819344, f7fac40d, 006a0f36, 8b457481) no tocan ningún test. Excepciones documentadas y comprobadas: c5b (d50a7725, E2.1), c7b (f518850c, solo test, nace verde, E4.1: `jest.mock('react-native-reanimated/mock', …)` en `alert-detail.navigation.test.tsx:47`, ya no el mock sobre `react-native-reanimated` suelto) y c23 (788b4d4a, R12 nace verde; sondas S12.1–S12.6 del informe, todas con el recuento declarado y S12.6 = 3 fallos por E5.1).
- [x] Candados no tautológicos (muestreo propio): el rojo de R9 (3ea1e9e2) cambia la aserción de `className` exacto por rama (`acked` y `closed`) frente a `text-2xs`; R10 usa el doble de `HomeEntrance`; R8 aserta `hitSlop` `{6,6,6,6}` (34 + 12 = 46 >= 44) y el `it` nuevo de CC; F evalúa contra el fuente real, no contra símbolos importados.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" salvo R13, que es el gate humano esperado (smoke en dev build de Android, `requirements.md:543` `- [ ] Smoke #174 …(fecha: ____)` sigue sin marcar, correcto).
- [x] Los 25 hashes de la trazabilidad existen (`git cat-file -e`) y son ancestros de HEAD (`git merge-base --is-ancestor`): 25/25 OK.
- [x] Commits siguen `feat|test|docs(mobile): #174 R<n> …` (el formato con scope `mobile` y R-id en el asunto es el que fijó el handoff; consistente en los 25).

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casillas humanas marcadas: aprobación (2026-10-13) y E1–E5 (2026-10-15, vía Notion), `requirements.md:843-848`.
- [x] Las 7 casillas de enmienda que Codex añadió en las otras specs y en `docs/ui-guidelines.md` siguen sin marcar (`- [ ] Enmienda #174 aprobada por humano`), a propósito; no cuentan como defecto.

## Checklist C7 — Sin código huérfano
- [x] Lo reemplazado (`min-h-20`, `text-2xs`, `shadow-sm` en las filas) está retirado y candado por `#174 R12: grep-limpio › retira las clases salientes de las filas`; grep propio: 0 ocurrencias en `src/screens/alerts/index.tsx`.
- [x] No hay tests huérfanos: los `it` antiguos se reescribieron en su sitio con sufijo `(enmendado por #174 Rn)`.
- [ ] N/A

## Checklist C8 — UI móvil conforme a la carta
- [x] Grep-clean en `screens/alerts/index.tsx` y `utils/alert-meta.ts`: 0 hex, 0 `[...]` en className, 0 `StyleSheet`, 0 emoji. `text-xs` (4 usos) está en el texto firmado de R7/R8/R9.
- [x] Dimensiones: `contentContainerStyle` 20/24/`insets.bottom + 24`/gap 12 (R5) con `useSafeAreaInsets`.
- [x] Componentes compartidos reutilizados (`Card`, `PopIn`, `HomeEntrance`, `CATEGORY_SLOTS`); sin forks.
- [x] Ack con feedback y touch target 46 (h-8.5 + `TOUCH_SLOP`).
- [x] Animaciones: `PopIn` y `HomeEntrance` ya honran `useReducedMotion`; solo las cinco primeras filas.
- [x] Tokens nuevos en `src/theme/global.css` (`--radius-10`, `--tracking-title`, `--tracking-caps`); `tracking-*` junto a su `text-*` (candado F).

## Observaciones

### Bloqueante
1. **C4: R9 no tiene ningún test que lo nombre.** El único test que fija R9 (píldoras `acked` y `closed` con `className` exacto, `mobile-pet-tracker/src/screens/alerts/index.test.tsx:472-520`, `it('alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8)'`) lleva solo los sufijos R7 y R8. `grep -n "174 R9" mobile-pet-tracker/src` da 0 resultados. El comportamiento sí está bien candado (rojo real en 3ea1e9e2, verde en f7fac40d, `alerts/index.tsx:251-252` coincide con el texto de R9.1/R9.2), pero C4 primera casilla y la regla del reviewer piden que el R-id aparezca. Origen: el texto firmado de R9 dice «(ya renombrado en R8)» (`requirements.md:362`) y el handoff (`progress/handoff_mobile-alerts-canvas-fidelity.md:310`) dice «sin renombre nuevo»; Codex siguió ambos al pie de la letra, así que no es defecto de implementación sino hueco de la spec y del handoff.
   - Corrección mínima, solo test, sin tocar producción: añadir ` (enmendado por #174 R9)` al título de ese `it` (línea 472) o un comentario `// #174 R9` en el bucle de píldoras, y apuntar el nombre nuevo en la fila R9 de `traceability.md:19` (y, si se renombra, en la fila R8 que cita el mismo `it`). Cambio de una línea: cabe en la excepción «trivial» del fallback a `implementer` de `CLAUDE.md`, a criterio del leader. Tras el cambio basta `jest --runTestsByPath src/screens/alerts/index.test.tsx` y re-lanzar el reviewer sobre ese commit; no hace falta repetir init.sh si el diff es solo el título/comentario.

### No bloqueantes
2. `design.md`, `tasks.md` y `traceability.md` de #174 siguen con `status: draft` en el frontmatter (`requirements.md` ya está `approved`). Los de las features hermanas (`mobile-tab-headers-canvas`, `mobile-tab-screens-canvas-fidelity`, `mobile-alerts-grouped-and-detail-map`) quedan en `approved`. Es higiene del leader al cierre; C6 solo exige `requirements.md`.
3. `classNames()` de `src/__tests__/alerts-canvas-fidelity.test.ts:172` no captura 2 de los 22 `className=` de `alerts/index.tsx` (el de `Card` con backticks anidados y el de la píldora con ternario). Medido con node: 20 de 22. Ninguno lleva hoy `[...]` ni `tracking-*`, así que el candado de `[...]` y el de `tracking-*` no tienen falso negativo actual; solo una clase arbitraria futura en esos dos nodos pasaría el grep-limpio. Es la zona ciega de siempre de un regex de className; no pedida por la spec.
4. R13 (humo en dev build de Android) queda pendiente de gate humano, como corresponde; no marcado.

## Verificación independiente (sin init.sh, por el permiso denegado al subagente)
- init.sh del leader sobre este HEAD, log crudo leído: `init-exit=0`; móvil `Test Suites: 111 passed, 111 total`, `Tests: 3428 passed, 3428 total`, `Snapshots: 1 passed`; backend `187 passed / 1474 passed`; infra `14 passed`; e2e `30 passed, 3 skipped (468 passed, 8 skipped)`; lint y typecheck sin errores; los `● Console` son logs.
- Jest propio por fichero (8 suites tocadas: `alerts/index.test.tsx`, `global-css.test.ts`, `language-provider.test.tsx`, `layout.test.tsx`, `consistency-classnames.test.ts`, `profile-canvas-fidelity.test.ts`, `alerts-canvas-fidelity.test.ts`, `alert-detail.navigation.test.tsx`): `Test Suites: 8 passed, 8 total`, `Tests: 326 passed, 326 total`, sin timeouts.
- `bunx tsc --noEmit` en `mobile-pet-tracker`: exit 0.

## Output de ./init.sh
Tomado del log del leader (`initsh-174.log`, líneas finales):
```
Test Suites: 111 passed, 111 total
Tests:       3428 passed, 3428 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
init-exit=0
```
