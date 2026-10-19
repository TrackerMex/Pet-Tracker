Worktree: /home/claude/sites/Pet-Tracker-wt-187

# Handoff a Codex CLI — feature #187 mobile-account-heroui-text-sizes

Antes de tocar nada, confirma en el reporte `pwd` y `git branch --show-current`
(debe ser `feature/187-mobile-account-heroui-text-sizes`). Trabaja SOLO en ese
worktree: no uses `/home/claude/sites/Pet-Tracker` (otra sesión) ni `main`.

Feature: mobile-account-heroui-text-sizes (#187), branch `feature/187-mobile-account-heroui-text-sizes`
Spec aprobada: `specs/mobile-account-heroui-text-sizes/requirements.md` (status: approved,
firmada por el leader en el commit `docs(spec): status approved en las cuatro specs de #187`,
tras la aprobación del humano en Notion; D1 = (a) `Text` plano de `react-native`).
Lee también: `specs/mobile-account-heroui-text-sizes/design.md`, `tasks.md` (cadena
de 8 commits c1 a c8, rojos esperados por commit) y `traceability.md`.

## Arranque

1. `H0=$(git rev-parse HEAD)` (es el commit de este handoff). Anótalo en el reporte.
2. Corre las anclas A1 a A11 de `requirements.md` § Base medida y compáralas con su
   valor. Si una no da su valor, **PARA y avisa**. (A1 a A11 coincidieron al
   medirlas el leader en este árbol, ya con `origin/main` de #185 mergeado.)
3. Mide T0 (total de `it` de toda la suite móvil en H0), una sola vez y sin pipe:
   `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" && bun run test > <log> 2>&1; grep -E '^Tests:' <log>`
   con `<log>` en un fichero temporal fuera del árbol. El aviso `A worker process
   has failed to exit gracefully` es preexistente: se cuenta solo en la medida.
4. Mide los totales por fichero de la tabla de `tasks.md` (13, 40, 65, 49, 49), un
   fichero a la vez.

## Alcance (lista cerrada, exactamente estos 13 ficheros)

Todo bajo `mobile-pet-tracker/` salvo donde se indica:

1. `src/__tests__/heroui-text-size-merge.test.ts` (nuevo)
2. `src/__tests__/account-screens-polish.test.ts`
3. `src/screens/login/index.tsx`, 4. `src/screens/register/index.tsx`,
   5. `src/screens/forgot/index.tsx`, 6. `src/screens/reset-password/index.tsx`
7. a 10. los cuatro `index.test.tsx` de esas pantallas
11. `docs/ui-guidelines.md` (raíz del repo; solo se añade la sección del final)
12. `specs/mobile-account-heroui-text-sizes/traceability.md`
13. `progress/impl_mobile-account-heroui-text-sizes.md`

Nada de dependencias nuevas, ni `src/theme/global.css`, `package.json`, `bun.lock`.

## Reglas críticas

- Sigue `docs/architecture.md` y `docs/conventions.md`; en móvil, `docs/ui-guidelines.md`.
- **Skills (nombres del catálogo de Codex, no los nuestros)**: carga
  `building-native-ui` y `expo-tailwind-setup` (uniwind/Tailwind). No hay skill de
  Expo para auditar un AST ni para animación: aquí no aplican. NO cargues
  `appllama-app-design-skill` (no se diseña ninguna pantalla nueva: son 17
  cambios de etiqueta con receta literal). Di en el reporte cuáles cargaste.
- **TDD con commits test-primero, sin excepción.** Cada commit de test deja el rojo
  medido en la tabla de `tasks.md` § Rojos esperados por commit, y NUNCA va junto a
  su implementación (en #19 se mezcló y se incumplió C4 de `CHECKPOINTS.md`).
  La cadena es c1 a c8 con los mensajes exactos de `tasks.md`. Un rojo que no es el
  de la tabla (`Unable to find`, `Found multiple elements`, `Test suite failed to
  run`, un `it` no listado) = **PARA y avisa**; no ajustes la aserción.
- Cada comando de móvil empieza por `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" &&`
  en la misma cadena. Un error de invocación (`ERR_PNPM_RECURSIVE_EXEC_NO_PACKAGE`,
  ENOENT del fichero que ibas a crear) no es un rojo: PARA y avisa. Móvil es `bun`
  (`bunx jest <ruta>`, `bun run typecheck`, `bun run lint`); nunca `npx` ni `npm i -g`.
- **Un fichero de jest a la vez**, con `bunx jest <ruta>`; nunca dos jest a la vez.
  Las esperas de tests de RN: `await` en `render`/`fireEvent`/`act` como hace cada
  suite; copia el patrón del primer `it` existente (RNTL 14 es asíncrono).
- **NO lances `./init.sh`** (lo corre el leader/humano; comparte Postgres y LocalStack).
- Antes de cada commit de código: `test ! -e .expo/types/router.d.ts` (si existe,
  PARA; nunca `rm -f`, tu sandbox lo deniega) y `bun run typecheck` con salida 0. Lint:
  `bunx expo lint --no-cache > <log> 2>&1 && test ! -s <log>` (el CLI traga un SIGKILL
  y sale 0; si el log contiene `Failed to run`, repite). No hay prettier en móvil.
- Comentarios de código: solo `#187 R<n>` (`// #187 R2`); nunca `#187` a secas ni una
  nota copiada de la spec (el guard de hex de `design-drift` los lee como color).
- Los `it` de R2 y R3 usan `toBe` exacto sobre un `Text` plano. Las consultas de
  botón van siempre acotadas: `within(screen.getByTestId('<testID>')).getByText('<texto>')`.
- Cadenas de comandos: escribe cada cabecera como comentario `# --`, nunca como
  línea ejecutable, y encadena el registro de rojo con el `git commit` por `&&`.
- Tras c5 corre las sondas S1 a S6 y tras c1 las S7 a S17; revierte cada una con
  `git checkout HEAD -- <ruta>` y comprueba `git diff --quiet -- <ruta>` y
  `git diff --cached --quiet -- <ruta>`. Borra `src/components/zz-sonda.tsx` (S4).
- Traceability (c8): rellena `traceability.md` con los hashes reales de c1 a c7 en UN
  commit final `docs(#187): trazabilidad y reporte de implementación (R1-R5)` junto con
  `progress/impl_mobile-account-heroui-text-sizes.md`. Verifica cada hash con
  `git cat-file -e`. No mezcles ficheros de arnés en los commits TDD. **No rebasar.**
- NO son tuyos: `progress/history.md`, `progress/current.md`, `STATUS.md`, el campo
  `status` de `feature_list.json`. Los escribe el leader tras el veredicto.
- Si el sandbox te deniega un comando, PARA y repórtalo; no lo sustituyas por otro.
- No crear recursos AWS ni `cdk deploy`. NO abras ni edites la PR.
- R6 (smoke en dev build de Android) y su casilla son del humano; no los toques.

## Criterios de aceptación

R1 (24 `it` del candado, hallazgos 17 → 5 → 0), R2 (12 etiquetas a 13 px), R3 (5
botones a 17 px), R4 (invariantes: `profile-canvas-fidelity` y `design-drift` verdes
sin editarlos; `git diff --quiet H0 -- src/theme/global.css package.json bun.lock`),
R5 (sección de la carta y su `it`). Total final: T0 + 42 `it`.

## Al terminar

Escribe el resultado en `progress/impl_mobile-account-heroui-text-sizes.md`: H0, T0,
el `Tests:` de cada fichero tras cada commit, los hashes de c1 a c8, las skills cargadas,
resultado de cada sonda, y cada parada o desviación.
Última acción: crear `progress/impl_mobile-account-heroui-text-sizes.done` con una sola
línea: la ruta de `progress/impl_mobile-account-heroui-text-sizes.md`. Es el marcador que
vigila `scripts/harness/watch-impl.sh`; no lo commitees (está en `.gitignore`).
