Worktree: /home/claude/sites/Pet-Tracker-wt-177

# Handoff a Codex CLI — feature #177 mobile-chunky-cta-canvas-fidelity

Antes de tocar nada, confirma en el reporte `pwd` y `git branch --show-current`
(debe ser `feature/177-mobile-chunky-cta-canvas-fidelity`). Trabaja SOLO en ese
worktree: no uses `/home/claude/sites/Pet-Tracker` (otra sesión) ni `main`.

Feature: mobile-chunky-cta-canvas-fidelity (#177), branch `feature/177-mobile-chunky-cta-canvas-fidelity`
Spec aprobada: `specs/mobile-chunky-cta-canvas-fidelity/requirements.md` (status: approved,
firmada en el commit `docs(spec): firma #177 …`, tras la aprobación del humano en Notion).
Decisiones del humano: D1 = (a) hook `useChunkyLip()` con `boxShadow`; D2 = una altura de 56;
D3 = sí, pisos a **211 y 167** (el humano escribió «221», errata: la medida exacta es 211 y
R9.1 la fija); D4 = compacto y tile dentro; D5 = chip, ack de fila, Horario y tarjeta de
resumen fuera; D6 = empty-state solo receta; D7 = «Ya tengo cuenta» a 17/700; D8 = variante
deshabilitada solo en la carta; D9 = `#0E5E3C` claro / `#0B4D31` oscuro; D10 = par asimétrico.
Lee también: `specs/mobile-chunky-cta-canvas-fidelity/design.md`, `tasks.md` (cadena de 12
commits c1 a c12, rojos esperados, tabla de sondas S1 a S14) y `traceability.md`.

## Arranque

1. `H0=$(git rev-parse HEAD)` (es el commit de este handoff). Anótalo en el reporte.
2. Corre las anclas A1 a A14 de `requirements.md` § Base medida y compáralas con su
   valor. Si una no da su valor, **PARA y avisa**. (Las midió el spec_author sobre `d799d714`;
   desde entonces solo se han añadido ficheros de `specs/`, `progress/` y `feature_list.json`.)
3. Mide T0 (total de `it` de toda la suite móvil en H0), una sola vez y sin pipe:
   `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" && bun run test > <log> 2>&1; grep -E '^Tests:' <log>`
   con `<log>` en un fichero temporal fuera del árbol. El aviso final `A worker process has
   failed to exit gracefully` es preexistente: no se para por él.
4. Localiza las pruebas colocadas con el `git grep -lE` de R10 y anota la lista en el reporte.
5. Mide los totales por fichero de los tests que se tocan (cada uno solo) antes del primer commit.

## Alcance (lista cerrada)

Todo bajo `mobile-pet-tracker/` salvo donde se indica:

- Tema: `src/theme/global.css`, `src/theme/chunky-lip.ts` (nuevo), `src/theme/__tests__/global-css.test.ts`,
  `src/theme/__tests__/chunky-lip.test.tsx` (nuevo).
- Candados: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` (nuevo), `consistency-classnames.test.ts`,
  `design-drift.test.ts`, `account-screens-polish.test.ts`, `heroui-text-size-merge.test.ts` (solo los dos
  pisos y el título), y `alert-detail-canvas-fidelity.test.ts` solo si una aserción lee la receta vieja.
- Producción, exactamente estos 17 ficheros bajo `src/`: `components/celebration.tsx`,
  `components/empty-state.tsx`, `screens/{add-pet,add-reminder,alert-detail,docs-upload-form,forgot,geofence-editor,geofences,home,login,pairing,register,reminders,reset-password,weight-log,welcome}/index.tsx`.
- Pruebas colocadas de esos ficheros (R10, las que localiza el grep de H0).
- Raíz del repo: `docs/ui-guidelines.md` (§12 y §13 y la sección de la Enmienda #177, R11) y
  `specs/mobile-chunky-cta/requirements.md` (solo se AÑADE el bloque final de R11.5).
- `specs/mobile-chunky-cta-canvas-fidelity/traceability.md` y `progress/impl_mobile-chunky-cta-canvas-fidelity.md`.

Prohibido: dependencias nuevas, `src/i18n`, `package.json`, `bun.lock`, `app.json`,
`backend-pet-tracker/` (R13.2 y R13.3). No toques `screens/alerts` ni `screens/meal-schedule` (R8).

## Reglas críticas

- Sigue `docs/architecture.md` y `docs/conventions.md`; en móvil, `docs/ui-guidelines.md`.
- **Skills (nombres del catálogo de Codex, no los nuestros)**: carga `building-native-ui` y
  `expo-tailwind-setup` (uniwind/Tailwind). Del repo (`.agents/skills/`) NO cargues
  `appllama-app-design-skill` (no se diseña ninguna pantalla nueva: la receta es literal) ni
  `animate-expo` (no hay animación nueva). No hay skill de Expo para `boxShadow` ni para auditar
  un AST: no cargues ninguna otra del plugin. Di en el reporte cuáles cargaste.
- **TDD con commits test-primero, sin excepción.** Cada commit de test deja el rojo medido en la
  tabla de `tasks.md` y NUNCA va junto a su implementación (en #19 se mezcló y se incumplió C4 de
  `CHECKPOINTS.md`). La cadena es c1 a c12 con los mensajes exactos de `tasks.md`. Un rojo que no es
  el de la tabla (`Unable to find`, `Found multiple elements`, `Test suite failed to run` salvo el
  `Cannot find module '../chunky-lip'` declarado de c1, un `it` no listado) = **PARA y avisa**; no
  ajustes la aserción. Los NV (nacidos en verde) y el aflojamiento de c3 se declaran en el reporte.
- Cada comando de móvil empieza por `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" &&` en la
  misma cadena. Un error de invocación (ENOENT del fichero que ibas a crear,
  `ERR_PNPM_RECURSIVE_EXEC_NO_PACKAGE`) no es un rojo: PARA y avisa. Móvil es `bun` (`bunx jest <ruta>`,
  `bun run typecheck`); nunca `npx` ni `npm i -g`. Si falta `node_modules`: `bun install --frozen-lockfile`.
- **Un fichero de jest a la vez**, `bunx jest <ruta>`; nunca dos jest a la vez. Si un `it` agota el
  tiempo con la máquina cargada, repite el fichero solo sin flags antes de juzgarlo.
- **Esperas sobre el árbol renderizado**: rige `docs/conventions.md` §«Esperas sobre el árbol
  renderizado» (esperar a un nodo o a un estado, nunca al contador de un mock). `render`, `fireEvent` y
  `act` de RNTL 14 son asíncronos: con `await`, o el `it` siguiente hereda un `setState` pendiente.
  Los estilos se leen con `StyleSheet.flatten`.
- **NO lances `./init.sh`** (lo corre el leader; comparte Postgres y LocalStack).
- Antes de cada commit de código: `test ! -e .expo/types/router.d.ts` (si existe, PARA; nunca `rm -f`,
  tu sandbox lo deniega) y `bun run typecheck` con salida 0, sin pipe. Lint:
  `bunx expo lint --no-cache > <log> 2>&1 && test ! -s <log>` con `<log>` fuera del árbol (el CLI traga
  un SIGKILL y sale 0; si el log contiene `Failed to run`, repite). No hay prettier en móvil.
- Un fichero nuevo se añade con `git add <ruta>` ANTES de correr las anclas (`git grep` no lo ve).
- Comentarios de código: solo `#177 R<n>` (`// #177 R5`); nunca `#177` a secas ni una nota copiada de la
  spec (el guard de hex de `design-drift` los lee como color).
- Los nombres y literales de copy no cambian: ninguna clave `t('…')` nueva (R13.1, R13.2).
- Cadenas de comandos: escribe cada cabecera como comentario `# --`, nunca como línea ejecutable, y
  encadena el registro de rojo con el `git commit` por `&&`. Acota `git status`/`git diff` a las rutas
  esperadas (`git status --short` tras `git add` sale vacío y falla).
- Tras c10 corre la prueba de piso exacto (212/168 rojo, 211/167 verde) y las sondas S1 a S14 de
  `tasks.md` (S4, S12 y las de la carta tras c11 si tocan la carta). Revierte cada una con
  `git checkout HEAD -- <ruta>` y comprueba `git diff --cached --quiet -- <ruta>` y
  `git diff --quiet -- <ruta>`. Una sonda que no da rojo BLOQUEA: avisa.
- Traceability (c12): rellena `traceability.md` con los hashes reales de c1 a c11 en UN commit final
  `docs(#177): trazabilidad y reporte de implementación (R1-R14)` junto con
  `progress/impl_mobile-chunky-cta-canvas-fidelity.md`. Verifica cada hash con `git cat-file -e`.
  No mezcles ficheros de arnés en los commits TDD. **No rebasar.**
- NO son tuyos: `progress/history.md`, `progress/current.md`, `STATUS.md`, el campo `status` de
  `feature_list.json`, ni las casillas «Enmienda #177 aprobada por humano» y «Smoke R14» (del humano).
- Si el sandbox te deniega un comando, PARA y repórtalo; no lo sustituyas por otro.
- No crear recursos AWS ni `cdk deploy`. NO abras ni edites la PR.

## Criterios de aceptación

R1 (token, 2 `it`), R2 (hook, 7 `it`), R3 (16 + 16 + 1), R4 (6 + 6 + 1), R5 (2), R6 (recuentos),
R7 (inventarios), R8 (fuera de alcance), R9 (pisos 211/167), R10 (candados enmendados en su sitio),
R11 (carta §12/§13, Enmienda #177, bloque en #166), R12 (guards), R13 (invariantes). R14 es del humano.
Total final de la suite: T0 + 81 `it`.

## Al terminar

Escribe el resultado en `progress/impl_mobile-chunky-cta-canvas-fidelity.md`: H0, T0, el `Tests:` de cada
fichero tras cada commit, los hashes de c1 a c12, las skills cargadas, el resultado de cada sonda y de la
prueba de piso exacto, los NV declarados, el resultado de R13.2 y R13.3, y cada parada o desviación.
Última acción: crear `progress/impl_mobile-chunky-cta-canvas-fidelity.done` con una sola línea: la ruta de
`progress/impl_mobile-chunky-cta-canvas-fidelity.md`. Es el marcador que vigila
`scripts/harness/watch-impl.sh`; no lo commitees (está en `.gitignore`).
