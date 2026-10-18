Worktree: /home/claude/sites/Pet-Tracker-wt-181

Primera acción: en el reporte, confirma `pwd` (debe ser esa ruta) y `git branch --show-current` (debe ser `feature/181-mobile-no-pets-states-and-centered-content`). Si no coincide, PARA.

PROHIBIDO: `./init.sh` y la suite completa de tests. Los corre el leader después; el Postgres y LocalStack son compartidos con otra sesión. Nada que cree recursos AWS ni cueste dinero.

Feature: #181 mobile-no-pets-states-and-centered-content. Branch: feature/181-mobile-no-pets-states-and-centered-content.
Spec aprobada: `specs/mobile-no-pets-states-and-centered-content/requirements.md` (status: approved, firma a64859d8). Léela entera: §0 base y premisas P1 a P4, §1 anclas M1 a M19, §2 requisitos R1 a R10, §3 candados movidos, §4 fuera de alcance, §6 smoke (humano).
Lee también `design.md` (decisiones y archivos), `tasks.md` (reglas de ejecución y plan de commits c1 a c13) y `traceability.md` (la rellenas tú).

## Respuestas del humano (2026-10-18)

Definitivas; no las reabras. Ya están en la spec; se repiten aquí para no tener que inferirlas.

1. D6: la cuenta de referencia es una cuenta recién creada, sin mascotas. Las dos ramas de la causa (P2a y P2b) quedan cubiertas.
2. La guarda del `refetch()` al enfocar Inicio, Perfil y Recordatorios NO entra en #181. Se registró como feature nueva #193. No la implementes.
3. Perfil: basta el centrado horizontal (R5.3). Nada de contenedor a pantalla completa.
4. Perfil sin mascotas: se quedan dos botones «Añadir mascota», el de la cápsula `profile-add-pet` y el del `EmptyState` (R5.1, R5.2).
5. Sin mascotas, los títulos desaparecen. La forma exacta por pantalla es la de R3 a R5.
6. Las pantallas de detalle (weight-log, meals-history, meal-schedule, add-reminder) no llevan sondas propias (§4).

## Base, H0 y ficheros

- Base H0 (la de la spec, §0 y §1): `44acd74b`. `docs/` y `mobile-pet-tracker/` no cambian entre H0 y este árbol (`git diff --stat 44acd74b HEAD -- docs mobile-pet-tracker` vacío), así que mide las anclas sobre el árbol de trabajo.
- Antes del primer commit, mide M1 a M19 (§1) con grep por contenido, no por número de línea, y compara con la tabla de la spec. Si alguno no coincide, PARA y repórtalo. No ajustes la spec.
- HANDOFF = hash del commit que añade este handoff: `git log -1 --format=%H -- progress/handoff_mobile-no-pets-states-and-centered-content.md`. Tus cambios se miden desde HANDOFF, no desde H0: `git diff --name-only HANDOFF..HEAD` y `git ls-files --others --exclude-standard`.
- Dependencias: `mobile-pet-tracker/node_modules` ya está instalado (`bun install --frozen-lockfile`, lo hizo el leader). Si falta o `bun` falla, PARA y repórtalo; no instales nada.
- Puedes tocar solo esta lista (de `design.md` §Archivos afectados):
  - En `mobile-pet-tracker/`: `src/providers/selected-pet-provider.tsx`, `src/hooks/use-pet-selection.ts`, `src/screens/home/index.tsx`, `src/screens/reminders/index.tsx`, `src/screens/profile/index.tsx`.
  - Tests en `mobile-pet-tracker/`: `src/screens/home/index.test.tsx`, `src/screens/reminders/index.test.tsx`, `src/screens/profile/index.test.tsx`, `src/hooks/use-pet-selection.test.tsx`, `src/providers/__tests__/selected-pet-provider.test.tsx`, `src/app/(tabs)/__tests__/food.test.tsx`, `src/screens/health/index.test.tsx`, `src/screens/add-pet/index.test.tsx`, `src/screens/alert-detail/index.test.tsx`, `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`, `src/components/__tests__/empty-state.test.tsx`, `src/__tests__/no-pets-states.test.ts` (nuevo).
  - En la raíz del repo: `docs/conventions.md` (solo R9.1), `specs/mobile-no-pets-states-and-centered-content/traceability.md`, `progress/impl_mobile-no-pets-states-and-centered-content.md` (nuevo).
- No los toques: `progress/history.md`, `progress/current.md`, `STATUS.md`, `feature_list.json`, `progress/review_*`, `docs/ui-guidelines.md`, `mobile-pet-tracker/src/components/empty-state.tsx`, `mobile-pet-tracker/src/i18n/catalog.ts`, `mobile-pet-tracker/src/app/(tabs)/map.tsx`, `mobile-pet-tracker/src/screens/map/`, `backend-pet-tracker/`.

## Reglas críticas

- Cada comando empieza con `cd` a su ruta absoluta (`/home/claude/sites/Pet-Tracker-wt-181` o su subcarpeta `mobile-pet-tracker`). No asumas el directorio que dejó el comando anterior.
- Arquitectura: `docs/architecture.md`. Convenciones: `docs/conventions.md`. Carta: `docs/ui-guidelines.md`, en especial §Decisiones fijas: sin hex sueltos, sin `StyleSheet`, sin clases arbitrarias.
- Ningún fichero nuevo puede contener `use-api` ni `useApi`. El guard de #87 R19 en `design-drift` escanea todo `src/` y exige una sola huella.
- El literal «enmienda A20 de #181» de R9.2 no lo marca `design-drift`, que no escanea `__tests__`. Si otro guard lo marca, PARA y repórtalo. No lo escapes ni cambies el texto.
- Commits test-primero (C4): cada requisito con tests nuevos (R1 a R5 y R9) tiene un commit rojo, que falla por aserción y no por símbolo ausente, y ese commit se hace antes de escribir su implementación; el verde va después, en commit aparte. Cada commit se cierra antes del siguiente paso. La excepción es c10 (R6 y R7): sus sondas nacen verdes y se cierran por mutación (R10). Sigue el plan c1 a c13 de `tasks.md` tal cual. Si un rojo pasa sin implementación, repórtalo; no lo des por bueno.
- Mensajes de commit: `test(mobile): <desc> (R1)` para rojo y para c10, `feat(mobile): <desc> (R2)` para verde, y `docs(mobile-no-pets-states-and-centered-content): <desc>` para c12 y c13. Cada commit añade sus ficheros con `git add <ruta>` explícita. Nunca `git add -A` ni `commit -a`.
- `traceability.md` se rellena una sola vez, en c13, con los hashes de c1 a c12. Ignora «tras cada commit» de su cabecera: el plan de `tasks.md` lo fija en c13, y en #84 y #123 esa instrucción no se cumplió.
- Skills del catálogo real de Codex, no los nuestros:
  - Carga `building-native-ui` (equivale a `expo-native-ui`) y `expo-tailwind-setup`.
  - Carga `.agents/skills/appllama-app-design-skill/SKILL.md`. Es obligatoria aquí, porque cambia estados vacíos. No tienes el MCP de appllama: aplica el patrón del fichero y no intentes llamadas al MCP.
  - Sin equivalente en Codex; no cargues sustitutos cercanos: `expo-design-system` (la fuente es `docs/ui-guidelines.md` y `mobile-pet-tracker/src/theme/global.css`), `expo-animation` (esta feature no añade movimiento), `expo-router` (no cambian rutas) y `expo-overview` (Codex no tiene router de skills).
  - En el reporte di qué skills cargaste y cuáles no.
- Jest: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker` (ruta literal). Ficheros concretos: `bunx jest --runTestsByPath <rutas>`, que toma cada ruta literal. Las rutas con `(tabs)` van entre comillas simples y sin escapar, porque `--runTestsByPath` no las interpreta como regex. Usa `bun`, nunca `npx` ni `npm`. Mobile no tiene prettier.
- RNTL 14: `await` en `render`, `fireEvent` y `act`. Las esperas van con `waitFor` o `findBy…`, nunca con `advanceTimersByTime` suelto.
- Typecheck: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && test ! -e .expo/types/router.d.ts && bun run typecheck`. Si el fichero existe, PARA. Nunca `rm -f`.
- Lint: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx expo lint --no-cache > /tmp/181-lint.txt 2>&1; ! grep -qF 'Failed to run' /tmp/181-lint.txt && test ! -s /tmp/181-lint.txt`. Salida vacía significa verde. Si sale `Failed to run` (SIGKILL por memoria), no es verde: espera 60 s y repite la cadena, como mucho tres veces. A la tercera, PARA.
- Guardas: al cerrar R4 (c7), al cerrar R5 (c9) y antes de c13, corre `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx jest src/__tests__`.
- Mutaciones (R10): planta X1 a X4 y X6 a X12 de §2 R10, una a una, sobre el árbol verde. X5 no se planta: es equivalente y la spec lo documenta. Con X1 plantada, S3 tiene que seguir verde (R10); si cae, depende de la raíz y se rehace. Anota el `it` que cae. Revierte con `cd /home/claude/sites/Pet-Tracker-wt-181 && git checkout HEAD -- <ruta>` y comprueba `git diff --quiet && git diff --cached --quiet` antes de la siguiente.
- No añadas dependencias: la spec no declara ninguna. Si crees que hace falta una, PARA y repórtalo.
- Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
- No abras ni edites la PR. Al cerrar, no dejes cambios sin commitear, salvo el impl report si aún no lo has añadido.

## Al terminar

Escribe `progress/impl_mobile-no-pets-states-and-centered-content.md` con: hash y mensaje de cada commit; M1 a M19 medidos y si coinciden con la spec; n2 a n5 (recuentos reales de `it` añadidos por commit); tabla de X1 a X4 y X6 a X12 (mutación, `it` que cae, commit; X5 consta como equivalente); skills cargadas; resultados de `typecheck`, jest (ficheros) y lint. Devuelve al leader solo la ruta del informe.

Criterios de aceptación: R1 a R10 de requirements.md, con los sub-requisitos R2.1 a R2.5, R3.1 a R3.3, R4.1 a R4.3, R5.1 a R5.3, R6, R7, R8.1 a R8.3, R9.1 a R9.3 y R10. La fila de smoke queda pendiente para el humano.
