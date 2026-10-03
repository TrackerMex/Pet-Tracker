# Handoff a Codex CLI — #90 `mobile-owner-timezone-dates`

Feature: `mobile-owner-timezone-dates` (#90), branch: `feature/90-mobile-owner-timezone-dates`.
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` (base `origin/main` 29689598,
spec firmada en `e5d11b4a`, frontmatters `approved`). Trabaja SOLO ahí. El tree
principal `/home/claude/sites/Pet-Tracker` lo usa otra sesión (#79, móvil): no lo
toques. Antes de empezar: `git pull` y `git branch --show-current` =
`feature/90-mobile-owner-timezone-dates`.

Spec aprobada: `specs/mobile-owner-timezone-dates/requirements.md` (status:
approved, firma humana y **P1 aceptada**: el 400 de fecha futura se discrimina por
`path === 'measuredAt'` Y el mensaje byte a byte `'measuredAt is too far in the
future'`; el segundo `it` de R5, formato crudo, se escribe). Lee también
`design.md`, `tasks.md`, `traceability.md` y el explore
`progress/explore_mobile-owner-timezone-dates.md`. Los hechos verificados están
en `requirements.md` §0 (F1-F9): construye sobre ellos, no sobre el enunciado de
`feature_list.json` ni sobre este prompt.

Feature móvil pura (`mobile-pet-tracker/`). Carga las skills `expo-overview` y
`expo-data-fetching` del plugin `expo` antes de tocar nada; no se toca pantalla
ni estilo, así que no hay skill de UI que cargar. Sin backend, sin dependencias
nuevas, sin tocar `init.sh`, CI, `package.json` ni `bun.lock`. Borra
`mobile-pet-tracker/.expo/types/router.d.ts` si existe (gitignorado; rompe `tsc`
con rutas fantasma).

Decisiones cerradas (no reabrir): D-A (a) zona del perfil propio vía
`useQuery(userKeys.me())` inline en `WeightLogContent`, ruta real `GET /v1/me`;
D-B B1 solo `weight-log.tsx` cambia en producción, `add-pet/index.tsx` queda
byte a byte como en `origin/main` al cerrar (M6 es transitoria); D-C C-A campo de
fecha libre, sin validación local; P1 aceptada; design.md D1-D8 (helper
`civilTodayIso` con `Intl.DateTimeFormat` + `formatToParts` y `try/catch` con
fallback al dispositivo; `measuredAtDraft: string | null` y valor derivado
`measuredAtDraft ?? civilTodayIso(profileTimeZone)` en los tres puntos; constante
única con el literal del backend; un solo `t('weightLog.dateCannotBeAfterToday')`
literal en `weight-log.tsx`).

Archivos a crear/modificar: exactamente los de `design.md` §Archivos afectados
(lista cerrada) más `progress/impl_mobile-owner-timezone-dates.md`. Los ficheros
«que NO se tocan» de esa sección tienen que dar diff vacío contra `origin/main`.

Reglas críticas:
- Seguir `docs/ui-guidelines.md` y `docs/conventions.md` (§Tests entera: prefijo
  `#90 R<n>` en describes nuevos y sufijo ` (#90 R<n>)` en `it` editados;
  paréntesis en filtros de jest; **esperas sobre el árbol renderizado**: toda
  espera termina en la misma observación que asevera,
  `weight-date-input.props.value`, nunca en la caché de Query ni en un contador de
  mock).
- TDD en el orden de `tasks.md`: R1, R2, R3, R4, R5, R6, R7. **UN PAR DE COMMITS
  POR REQUISITO, test rojo antes que su implementación**:
  `test(mobile-owner-timezone-dates): … (R<n>)` en rojo, luego
  `feat(mobile-owner-timezone-dates): … (R<n>)` en verde. Un único commit con todo
  incumple C4 de `CHECKPOINTS.md`. El rojo de R1 lleva el esqueleto del helper que
  ignora `timeZone` (no `Cannot find module`); R4 y R6 son de verificación: su rojo
  es la mutación M4 (i y ii) / M6 de `design.md` §Mutaciones, **versionada en el
  commit rojo y revertida en el verde**. Pega la salida literal de cada rojo en el
  impl.
- Candados que se mueven: solo L1, L3, L7, L8, L9 de `requirements.md` §Candados,
  siempre como delta (`+ 1` sobre el literal actual de
  `language-provider.test.tsx:55`, `32 + 1` en `ui-language.test.ts:133`). Si
  cualquier candado de «Siguen verdes» se pone rojo, la implementación está mal:
  PARA y anótalo en el impl. `PICKER_MOCK_UNARMED` (#72 R4) no se toca; el test de
  R6 no pulsa `add-pet-photo`.
- Los argumentos de `jest.useFakeTimers` en `weight-log.test.tsx` se deciden
  probando en ese fichero (dos precedentes distintos en el repo) y se anotan en
  el impl; no se calcan sin probar. Tras editar títulos de `it`, `grep -rn
  "<título>" specs/` y actualizar las traceabilities ajenas que los citen
  (#63 y #72).
- Comandos, desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath <ruta>` o
  filtro posicional con `\(tabs\)` escapado; `bun run test`, `bun run typecheck`,
  `bun run lint`. Comprobar siempre que `Test Suites:` cuenta los ficheros
  esperados. **Nunca medir con pipe.**
- R7: `bunx jest --listTests | wc -l` = S y `bun run test` con N == S; C8
  grep-clean; diffs vacíos de `tasks.md` §R7; `./init.sh` desde la raíz del
  worktree con `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` vacío
  antes (LocalStack compartido con la otra sesión) y exit code medido sin pipe.
- Actualizar `specs/mobile-owner-timezone-dates/traceability.md` tras cada commit
  (hash rojo y verde por R; evidencias de R7). No rebasear la branch después.
- No crear recursos AWS reales ni correr `cdk deploy`.
- **Push** de la branch al terminar:
  `git push origin feature/90-mobile-owner-timezone-dates`.

Criterios de aceptación: R1-R7 de `requirements.md`. El smoke en dev build de
Android (§Gate humano) lo corre el humano después: deja el hueco en el impl.

Al terminar: `./init.sh` verde desde la raíz del worktree, `git diff --stat
origin/main` limitado a `design.md` §Archivos afectados más el impl, todo en
`progress/impl_mobile-owner-timezone-dates.md` (una sección por R con evidencias,
salidas de los rojos, mutaciones M4/M6 y su reversión, tabla de R7), push, y
para. No abras el PR: lo abre el leader tras el veredicto del reviewer.
