Worktree: /home/claude/sites/Pet-Tracker-wt-186

# Handoff a Codex CLI — feature #186 mobile-forms-validation-global

Antes de tocar nada, confirma en el reporte `pwd` y `git branch --show-current`
(debe ser `feature/186-mobile-forms-validation-global`). Trabaja SOLO en ese
worktree: no uses `/home/claude/sites/Pet-Tracker` (otra sesión) ni `main`.

Feature: mobile-forms-validation-global (#186), branch `feature/186-mobile-forms-validation-global`
Spec aprobada: `specs/mobile-forms-validation-global/requirements.md` (status: approved, firmada en el
commit `docs(spec): firma #186 …`, tras la aprobación del humano en Notion). Preguntas P1 a P7 con su
valor por defecto: componente fino `FieldErrorMessage` (P1 A); migran las cuatro pantallas de cuenta,
así que **R8 va** (P2 A); «editar perfil» queda fuera (es #194); `geofence-editor` y `pairing` no se
tocan (P4); coma decimal aceptada (P5); sin borde rojo en `TextInput` crudos (P6); copy tal cual (P7).
Lee también: `specs/mobile-forms-validation-global/design.md`, `tasks.md` y `traceability.md`.

## Arranque

1. `H0=$(git rev-parse HEAD)` (commit de este handoff). Anótalo en el reporte.
2. Corre las anclas B1 a B12 de `requirements.md` § Base medida y compáralas con su valor. Se midieron en
   `d799d714` y el leader las re-midió en el merge con main (`679ac2fe`, #177 dentro): B1 a B11 dan lo
   mismo. Si una no da su valor, **PARA y avisa**.
3. Mide T0 (total de `it` de toda la suite móvil en H0), una sola vez y sin pipe:
   `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" && bun run test > <log> 2>&1; grep -E '^Tests:' <log>`
   con `<log>` fuera del árbol. El aviso final `A worker process has failed to exit gracefully` es
   preexistente: no se para por él.
4. Mide el total de cada fichero de test que vas a tocar (cada uno solo) antes del primer commit.

## Alcance (lista cerrada)

Todo bajo `mobile-pet-tracker/` salvo donde se indica:

- Nuevos: `src/components/field-error-message.tsx`, `src/components/__tests__/field-error-message.test.tsx`,
  `src/utils/form-rules.ts`, `src/utils/form-rules.test.ts`, `src/__tests__/forms-validation-global.test.ts`.
- Pantallas y sus tests: `src/screens/{add-pet,add-reminder,docs-upload-form,weight-log}/index.tsx` e `index.test.tsx`.
- R8: solo la producción de `src/screens/{login,register,forgot,reset-password}/index.tsx`. **Sus tests no
  cambian** (esa es la prueba de que el refactor es transparente).
- Catálogo y candados: `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx`,
  `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`.
- Raíz del repo: `docs/ui-guidelines.md` (enmienda #186, R9) y `specs/mobile-ui-language/design.md` (§2.36, R1).
- `specs/mobile-forms-validation-global/traceability.md` y `progress/impl_mobile-forms-validation-global.md`.

Prohibido: dependencias nuevas, `package.json`, `bun.lock`, `app.json`, `backend-pet-tracker/`,
`src/components/form-error.tsx`, `src/utils/account-rules.ts`, `geofence-editor`, `pairing`, `meal-schedule`.
Ninguna clase `className` nueva ni cambiada (R3, §Sin clases nuevas).

## Reglas críticas

- Sigue `docs/architecture.md` y `docs/conventions.md`; en móvil, `docs/ui-guidelines.md`.
- **Skills (nombres del catálogo de Codex, no los nuestros; catálogo instalado = plugin 1.0.2, 13 skills)**:
  carga `building-native-ui`. Del repo (`.agents/skills/`) NO cargues `appllama-app-design-skill` (no se
  diseña ninguna pantalla nueva) ni `animate-expo` (no hay animación). No hay skill de Expo para
  formularios ni validación: no cargues ninguna otra del plugin. Di en el reporte cuáles cargaste.
- **TDD con commits test-primero, sin excepción.** Por cada R: primero el rojo
  `test(mobile): <qué> (#186 Rn)` y, en un commit aparte, el verde `feat(mobile): <qué> (#186 Rn)`.
  Excepciones de título: el verde de R1 es `feat(mobile): copy de validación (#186 R1)` y el de R9 trae la
  enmienda `docs(ui): enmienda #186 (#186 R9)`. Nunca el test junto a su implementación (en #19 se mezcló y
  se incumplió C4 de `CHECKPOINTS.md`). Orden: R1, R2, R3, R4, R5, R6, R7, R8, R9 (R9 va después de R8 para
  que las cuentas de sus candados 5 y 6 cuadren). R8 no tiene verde sin rojo: su rojo es el candado 3 de
  `forms-validation-global.test.ts`; los candados 1 y 2 nacen verdes y se declaran.
  Un rojo que no es el que la spec declara (`Unable to find`, `Found multiple elements`,
  `Test suite failed to run` salvo los `Cannot find module` declarados de R2 y R3, un `it` no listado; en R2
  los rojos de `ui-language.test.ts` son **seis**, cuatro bloques + SCREEN_FILES + `checkUses(ALL_USES)`) =
  **PARA y avisa**; no ajustes la aserción. Los nacidos en verde (NV) se cruzan con los `it` previos y se
  declaran en el reporte.
- Cada comando de móvil empieza por `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" &&` en la
  misma cadena. Un error de invocación (ENOENT del fichero que ibas a crear) no es un rojo: PARA y avisa.
  Un fallo de una lectura auxiliar (`sed`, `cat`, `grep` con ruta mal escrita) NO es parada: anótalo en el
  reporte y relee con la ruta correcta. Solo paran los comandos que ejecutan tests, crean o tocan ficheros.
  Móvil es `bun` (`bunx jest <ruta>`, `bun run typecheck`); nunca `npx` ni `npm i -g`.
- **Un fichero de jest a la vez**, `bunx jest <ruta>`; nunca dos jest a la vez. La ruta con paréntesis es
  regex: no pases rutas con `(tabs)`. Si un `it` agota el tiempo con la máquina cargada, repite el fichero
  solo sin flags antes de juzgarlo.
- **Esperas sobre el árbol renderizado**: rige `docs/conventions.md` §Esperas sobre el árbol renderizado
  (esperar a un nodo o a un estado, nunca al contador de un mock; primero el mensaje, luego las ausencias y
  los contadores). `render`, `fireEvent` y `act` de RNTL 14 son asíncronos: con `await`.
- **Literales de copy** en los tests: escritos a mano, nunca importados de `catalog.ts` ni de `form-rules.ts`.
- **NO lances `./init.sh`** (lo corre el leader; comparte Postgres y LocalStack).
- Antes de cada commit de código: `test ! -e .expo/types/router.d.ts` (si existe, PARA; nunca `rm -f`) y
  `bun run typecheck` con salida 0, sin pipe. Lint:
  `bunx expo lint --no-cache > <log> 2>&1 && test ! -s <log>` con `<log>` fuera del árbol (el CLI traga un
  SIGKILL y sale 0; si el log contiene `Failed to run`, repite). No hay prettier en móvil.
- Un fichero nuevo se añade con `git add <ruta>` ANTES de correr las anclas (`git grep` no lo ve).
- Comentarios de código: solo `#186 R<n>` (`// #186 R5`); nunca `#186` a secas (el guard de hex de
  `design-drift` lo lee como color).
- Mocks que no se tocan: `HomeEntrance` en `src/screens/login/index.test.tsx` y el de reicon en
  `src/screens/register/index.test.tsx` (anclas de cierre en `requirements.md` § Convenciones).
- Cadenas de comandos: escribe cada cabecera como comentario `# --`, nunca como línea ejecutable, y encadena
  el registro de rojo con el `git commit` por `&&`. Acota `git status` y `git diff` a las rutas esperadas
  (`git status --short` tras `git add` sale vacío y falla). Cada cuenta de commit es la anterior más lo que
  ese commit añade, no un total suelto.
- Sondas S1.x a S9.x de `requirements.md`: córrelas en el commit verde de su R, revierte con
  `git checkout HEAD -- <ruta>` y comprueba `git diff --quiet HEAD -- <ruta>` y `git diff --cached --quiet`.
  Una sonda que no da el rojo esperado BLOQUEA: avisa. Si una premisa de entorno falla (el candado 5 de R3
  mide que `FieldError` pinta fuera de `TextField`), **PARA y avisa**.
- Traceability: rellena `traceability.md` con los hashes reales en UN commit final
  `docs(#186): trazabilidad y reporte de implementación (R1-R9)` junto con
  `progress/impl_mobile-forms-validation-global.md`. Verifica cada hash con `git cat-file -e`.
  No mezcles ficheros de arnés en los commits TDD. **No rebasar.**
- NO son tuyos: `progress/history.md`, `progress/current.md`, `STATUS.md`, el campo `status` de
  `feature_list.json`, ni las casillas «Enmienda #186 aprobada por humano» y «Prueba de humo R10» (del humano).
- Si el sandbox te deniega un comando, PARA y repórtalo; no lo sustituyas por otro.
- No crear recursos AWS ni `cdk deploy`. NO abras ni edites la PR.

## Criterios de aceptación

R1 a R9 de `requirements.md`. R10 es del humano. Total final de la suite: T0 más los `it` nuevos que midas;
anótalos por R.

## Al terminar

Escribe el resultado en `progress/impl_mobile-forms-validation-global.md`: H0, T0, el `Tests:` de cada
fichero tras cada commit, los hashes de cada rojo y verde, las skills cargadas, el resultado de cada sonda,
los NV declarados, el número exacto de `it` rojos de `ui-language.test.ts` en R2 (se esperan seis: cuatro bloques, SCREEN_FILES y `checkUses(ALL_USES)`), y cada
parada o desviación.
Última acción: crear `progress/impl_mobile-forms-validation-global.done` con una sola línea: la ruta de
`progress/impl_mobile-forms-validation-global.md`. Es el marcador que vigila
`scripts/harness/watch-impl.sh`; no lo commitees (está en `.gitignore`).
