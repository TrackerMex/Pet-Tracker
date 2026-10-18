# Handoff a Codex CLI: #180 mobile-alert-detail-canvas-fidelity

Worktree: /home/claude/sites/Pet-Tracker-wt-180
Antes de tocar nada, confirma en tu reporte: `pwd` (debe dar /home/claude/sites/Pet-Tracker-wt-180) y `git branch --show-current` (debe dar feature/180-mobile-alert-detail-canvas-fidelity). Si no coincide, PARA.

Feature: mobile-alert-detail-canvas-fidelity (#180). Branch: feature/180-mobile-alert-detail-canvas-fidelity.
Spec aprobada: specs/mobile-alert-detail-canvas-fidelity/requirements.md (status: approved). Firma de la spec base: 6f2b8403 (2026-10-17). Firma de la enmienda E1: 42222344 (2026-10-18).
Lee también: specs/mobile-alert-detail-canvas-fidelity/design.md (§9 es la E1), tasks.md, traceability.md y docs/ui-guidelines.md (rige la UI móvil).

## Reanudación tras E2 (leer antes que lo demás)

Este handoff se reanuda tras el bloqueo de H0: reporte «BLOQUEADO» en `progress/impl_mobile-alert-detail-canvas-fidelity.md` (commit `508f0c04`). Antes de tocar nada:

- No reanudes sin la firma de la Enmienda E2 (`specs/mobile-alert-detail-canvas-fidelity/requirements.md`, sección «## Enmienda E2»). El log del HEAD debe incluir el commit `docs(spec): firma la enmienda E2 de #180 desde Notion`. Si no está, PARA.
- H0 es el HEAD al reanudar. Regístralo y repite M1-M25 y P1-P14 sobre ese H0. Si una medida difiere de la base del reporte «BLOQUEADO» sin cambio de código, PARA y reporta.
- Aplica `tasks.md` con las reasignaciones de E2.1-E2.9: R3.7 se prueba en R10, no en R3; las aserciones de E2.2 se reescriben en los pasos que indica.
- El reporte de reanudación es una sección nueva en `progress/impl_mobile-alert-detail-canvas-fidelity.md`. No borres la sección «BLOQUEADO».
- Solo `bunx`. No `pnpm`, `npx`, `npm` ni `bun add`. No ejecutes `./init.sh`.

## Reanudación tras E3 (leer antes que lo demás)

Este handoff se reanuda tras el paro en R8 (B3, sección «Resultado de la reanudación» de `progress/impl_mobile-alert-detail-canvas-fidelity.md`, commit `3c099eaa`). R1 ya está hecho: rojo `b07bc024`, verde `e37300ec`. No lo rehagas.

- No reanudes sin la firma de la Enmienda E3 (`specs/mobile-alert-detail-canvas-fidelity/requirements.md`, sección «## Enmienda E3»). El log del HEAD debe incluir `docs(spec): firma la enmienda E3 de #180 desde Notion`. Si no está, PARA.
- H0 es el HEAD al reanudar. Repite M1-M25 y P1-P14 sobre ese H0. La base es la columna «Al detenerse» del reporte (commit `3c099eaa`). Si una medida difiere sin cambio de código, PARA y reporta.
- Empieza en R8: rojo solo LP (K4 y K5). Las filas K2 y K3 de `alerts.mapLabel` van en el rojo de R5 (E3.1-E3.3).
- Jest: `bunx jest <ruta> --testTimeout=30000`. Si un fichero no termina tras el resumen (handles en `alert-detail/index.test.tsx`), añade `--forceExit`, sin tocar aserciones ni timeouts, y repórtalo como desviación.
- El reporte de la reanudación es otra sección nueva en `progress/impl_mobile-alert-detail-canvas-fidelity.md`. No borres las anteriores.
- Lo demás de «Reanudación tras E2» sigue vigente: solo `bunx`, no `init.sh`, sin tocar ficheros del leader.

## Precedencia

Donde la Enmienda E1 (requirements.md, sección «## Enmienda E1») y el texto de un R choquen, manda E1. R enmendados por E1: R4.1, R5.2, R6.1, R7.1, R7.3, R12, R14.1. R nuevos: R4.5, R5.5, R5.6, R7.4, R7.5. Donde la Enmienda E2 (requirements.md, sección «## Enmienda E2») choque con E1 o con un R, manda E2. Donde la Enmienda E3 (requirements.md, sección «## Enmienda E3») choque con E2, E1 o con un R, manda E3. No reabras las decisiones de §0 de requirements.md: las que E1 cambia (D2, D3, D4) se leen con E1; el resto vale tal cual.

## Orden y precondiciones

- Sigue tasks.md en su orden: H0 (pasos 1-10, incluidos los de E1: 7 precondiciones P11-P14, 8 sonda de expo-blur, 9 sonda del ping, 10 orden de la lista de motion.test.ts) y luego los R-id por bloques.
- Cada requisito: commit rojo (test que nombra el R-id) y commit verde (implementación). Test primero, siempre.
- Precondiciones P1-P10 (requirements §2) y P11-P14 (requirements, Enmienda E1.3). Si una falla, PARA y reporta. No improvises.
- H0 es el HEAD al reanudar (tras E2, no el commit que añade este handoff). Regístralo en progress/impl_mobile-alert-detail-canvas-fidelity.md.

## Archivos

Según design.md §2 y la Enmienda E1, todos bajo mobile-pet-tracker/ salvo que se diga otra cosa:
- src/app/_layout.tsx (title '' en alerts/[alertId])
- src/screens/alert-detail/index.tsx
- src/screens/alert-detail/ping-ring.tsx (nuevo)
- src/theme/motion.ts (MOTION_ALERT_PING_MS)
- src/theme/global.css (par glass-surface-strong, claro y oscuro)
- src/utils/alert-meta.ts (y alert-meta.test.ts, nuevo)
- src/i18n/catalog.ts (alerts.mapLabel)
- Tests: los que nombran tasks.md y los candados de requirements §4 y E1.4 (K7-K24).
- Docs (R12): docs/ui-guidelines.md (§12 y §13), las filas de R12.1 de la E1 (specs/mobile-alerts-grouped-and-detail-map/requirements.md, specs/mobile-chunky-cta/requirements.md) y design.md §5 de esta spec.
- NO tocar: package.json y bun.lock. R5.6 prohíbe dependencias nuevas: expo-blur ~57.0.2 ya está instalada. No ejecutes `bun add`.

## Skills (nombres del catálogo de Codex, no los nuestros)

- No hay skill de router: no cargues ninguna skill de routing (`expo-overview` no existe aquí).
- `building-native-ui`: UI nativa, safe areas, HIG. Sustituye a expo-native-ui.
- `expo-tailwind-setup`: uniwind y tokens del tema.
- `.agents/skills/appllama-app-design-skill`: obligatoria al cambiar una pantalla. La carta (docs/ui-guidelines.md) gana siempre sobre ella.
- `.agents/skills/animate-expo`: movimiento del ping (R4). El plugin de Codex no tiene skill de animación; las decisiones de movimiento (1800 ms, ease-out, reduce motion, doble de withTiming) están en la spec y mandan sobre la skill.
- En el reporte, di qué skills cargaste, por su nombre exacto.

## Commits

- Un commit rojo y uno verde por requisito, test primero (C4 de CHECKPOINTS.md). Incluye el R-id en el mensaje.
- Commitea con `git commit --only <rutas> -m ...` para no arrastrar ficheros ajenos.
- Al final, UN commit `docs(mobile): #180 traceability con hashes`, con traceability.md, tras el último verde.
- No metas en los commits TDD ficheros de arnés: progress/*, STATUS.md ni feature_list.json.

## Comandos

- Cada cadena empieza con `cd /home/claude/sites/Pet-Tracker-wt-180/mobile-pet-tracker && …` (cd explícito).
- Jest de un fichero: `bunx jest <ruta> --testTimeout=30000`. Escapa los paréntesis de las rutas (`\(tabs\)`). Antes de correr jest, `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` deben salir vacíos.
- NO ejecutes `./init.sh`. Lo corre el leader o el reviewer con permiso del humano.
- Tras cada verde: `bunx tsc --noEmit`. Antes, `test ! -e .expo/types/router.d.ts`; si el fichero existe, PARA. Nunca `rm -f`.
- Tras cada verde: `bunx expo lint --no-cache > log 2>&1 && ! grep -qF 'Failed to run' log` (el SIGKILL por OOM sale con código 0).
- Dependencias: ninguna. No uses npx, npm ni bun add.
- Sondas (H0 pasos 6, 8 y 9): en ficheros temporales del scratchpad, sin commitear. El doble de expo-blur solo si la sonda del paso 8 da rojo en las rutas: commit propio.

## Tests

- RNTL 14: `await` en fireEvent, render y act.
- Esperas: sigue docs/conventions.md §«Esperas sobre el árbol renderizado». Espera a la misma observación que aserta el test. No esperes a la caché de Query ni al contador de un mock y consultes el DOM después.
- Date.now() no va en el render (react-hooks/purity).
- Los literales de texto los fija la spec (R8, R12.2 y E1). No inventes copy.

## Prohibido

- No toques progress/history.md, progress/current.md, STATUS.md ni el campo status de feature_list.json. Son del leader y se escriben tras el veredicto del reviewer.
- No abras ni edites la PR. No mergees. No hagas rebase. Sí puedes `git merge origin/main` (tasks.md H0 paso 1).
- No marques la casilla del smoke (§6 de requirements): el smoke en dev build de Android lo hace el humano.
- Nada de AWS ni cdk.
- Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.

## Criterios de aceptación

Todos los R-id de requirements.md, con sus tests: R1-R14 con las enmiendas y los nuevos de la Enmienda E1. Medidas M1-M25 (base de H0 más delta) y candados K de requirements §4 y E1.4.

## Al terminar

Escribe progress/impl_mobile-alert-detail-canvas-fidelity.md con: H0 (hash), commits rojo y verde por R-id, medidas base y finales, skills cargadas, resultado de las sondas y cualquier desviación. Si algo no cuadra con la spec, PARA y reporta antes de improvisar. En el chat devuelve solo «listo» y la ruta del fichero.
