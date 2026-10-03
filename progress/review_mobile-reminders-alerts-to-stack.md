# review: mobile-reminders-alerts-to-stack (#114)
Fecha: 2026-09-23 19:35 UTC
Veredicto: APROBADO

Rango revisado: `c713068c..a8d656ad` (15 commits de Codex) sobre la base
`a833f153`, con HEAD `349c1a41`. Por encima de Codex solo está `349c1a41`, un
commit `docs(harness)` del leader que toca una línea de `progress/current.md`.
Worktree `/home/claude/sites/Pet-Tracker`, branch
`feature/114-mobile-reminders-alerts-to-stack`. Lo comprobé con `pwd`,
`git branch --show-current` y `git rev-parse HEAD` antes de empezar, y el
`.head` del leader coincide. No cambié de branch ni toqué
`Pet-Tracker-wt-backend`. Para checkouts y mutaciones usé un worktree
desechable en el scratchpad, con `node_modules` enlazado; ya está retirado
(`git worktree list` no lo muestra). Al terminar, `git status` del worktree
principal está limpio salvo este fichero.

Firma de la spec: `f5a491ee` (vía Notion, P1 = A, A13 y A14). Skills cargadas:
`expo:expo-overview` → `expo:expo-router`, y `appllama-app-design-skill`, que
`docs/ui-guidelines.md` §Skills exige en toda tarea de UI móvil (ver Obs. 6).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `114 mobile-reminders-alerts-to-stack` (lo medí con node sobre `feature_list.json`)
- [x] progress/current.md actualizado (describe la sesión activa de #114)
- [x] Codex no tocó ningún artefacto del leader:
  - `git diff --stat 636a60de a8d656ad -- progress/current.md progress/history.md STATUS.md feature_list.json` sale vacío.
  - `progress/current.md` solo lo tocan `e808c8d4`, `f5a491ee`, `636a60de` y `349c1a41`, todos del leader.
  - `feature_list.json` solo lo tocan `85c37fb3` y `636a60de`. `history.md` y `STATUS.md` no los toca ningún commit del rango.
- [x] Ningún commit del rango toca `app.json`, `app.config.ts`, `package.json` ni `bun.lock`. No hay dependencias nuevas.
- [x] Ningún commit del rango toca `backend-pet-tracker/`, `infra/`, `init.sh` ni `.github/`: `git diff --stat` de esas rutas sale vacío

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: N/A, solo cambia la capa de UI de `mobile-pet-tracker/`
- [x] repositories/contratos en domain son interfaces puras: N/A
- [x] application depende de interfaces, no implementaciones: N/A
- [x] infrastructure sin lógica de negocio: N/A. Los routes siguen delgados: `src/app/reminders.tsx` y `src/app/alerts.tsx` solo importan su pantalla de `src/screens/` (ui-guidelines §8)

## Checklist C4 — TDD
- [x] Cada R1–R7 tiene un `describe` con el prefijo `#114 R<n>:` literal de la spec. R6 cumple con el sufijo ` (#114 R6)` en los dos `it` heredados, como fija D9.
- [x] Historial test-primero. Hice checkout de cada commit en el worktree desechable y lancé sus ficheros con `--runTestsByPath`. El número de suites que imprime jest coincide con el de ficheros pedidos. **Ningún rojo cae por timeout, `ReferenceError`, módulo inexistente ni mutación de un doble.** Añadir `dismissTo: jest.fn()` en `d7e727d9` es preparación que tasks.md autoriza.

| Paso | Commit | Resultado reproducido |
|---|---|---|
| A14 docs | `c713068c` | antes del primer rojo |
| R1 rojo | `c2ba2c16` | `exit=1`, 2 suites / `4 failed, 27 passed`. Solo fallan los `it` de `#114 R1`: `detail-stack.test.tsx:40` `Expected: true, Received: false` (las dos rutas), `:46` el listado de `(tabs)` con dos entradas de más, y `layout.test.tsx:386` `Expected length: 8, Received length: 6` |
| R2 rojo | `892151b5` | `exit=1`, 1/1. `reminders-alerts-stack.navigation.test.tsx:102`: falta `"reminders"` en `['(tabs)', name]`, **después** de que el `waitFor` del pathname pasara |
| R3 rojo | `dc4f5485` | `exit=1`, 1/1. `reminders-alerts-stack.notification.test.tsx:132`: falta `"alerts"`. El `waitFor` de `/alerts` resolvió, así que no hay timeout |
| R1+R2+R3 verde | `c7883721` | los 10 ficheros de tasks.md → `10 passed`, `204 passed`. Suite completa en ese commit: `82 passed`, `1431 passed`, igual que el `impl` |
| R4 rojo | `a0a27e66` | `exit=1`, `2 failed, 16 passed`: `options` `Received: undefined` en las dos |
| R4 verde | `9f88d0ef` | `layout` + `ui-language` → `2 passed`, `43 passed` |
| R5 rojo | `6e4bdad0` | `exit=1`, `2 failed, 57 passed`. `reminders/index.test.tsx:215` `Received: <Text className="text-2xl font-black text-foreground">Recordatorios</Text>` y `alerts/index.test.tsx:181`, lo mismo con `Alertas` |
| R5 verde | `cc0c971b` | los 3 ficheros de tasks.md más `notification` → `4 passed`, `85 passed` |
| A13 docs | `97d2476a` | antes del rojo de R6 |
| R6 rojo | `277e8fd0` | `exit=1`, `2 failed, 57 passed`: `reminders:235` y `alerts:295` reciben `paddingTop: 52` y `paddingBottom: 120` |
| R6 verde | `a18a7bef` | `2 passed`, `59 passed` |
| R7 rojo | `d7e727d9` | `exit=1`, `1 failed, 21 passed`: `add-reminder/index.test.tsx:158` `Expected number of calls: 1, Received: 0` |
| R7 verde | `36a9eca6` | `add-reminder` + `detail-stack` → `2 passed`, `35 passed` |

- [x] Los siete rojos solo añaden test, sin producción, según `git show --stat` de cada uno. R1, R2 y R3 tienen tres rojos y un verde compartido, como pide tasks.md paso 4
- [x] Lección B1 de #95 aplicada. Los dos `it` de `#114 R5` aseveran la ausencia en carga (`findByTestId('reminders-loading' | 'alerts-loading')`) y **otra vez** tras `findByTestId('reminder-row-…' | 'alert-row-…')`. Lo confirman M1, M2, M3 y M28 (§Mutaciones), plantadas solo en la rama cargada: caen en la segunda aserción (`:222`, `:185`)

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente": la única coincidencia es la línea de la regla (`:25`)
- [x] Los 15 hashes citados existen (`git cat-file -t` → `commit`) y son ancestros de HEAD (`git merge-base --is-ancestor`). Cada uno cumple el papel que la tabla le da: los rojos son `test(...)`, los verdes `feat(...)`, A13 `97d2476a`, A14 `c713068c` y P1 `f5a491ee`. No hubo rebase
- [x] Formato de commits. Los rojos son `test(reminders-alerts-stack): … (R<n>)`, los verdes `feat(reminders-alerts-stack): … (R<n>)`, con `(R1,R2,R3)` en el verde compartido, y los docs `docs(...)`. Los textos coinciden con los de tasks.md
- [x] Notas de D9 en specs ajenas:
  - `mobile-detail-screens-to-stack` R2: `← el listado de (tabs) lo canda #114 R1`.
  - `mobile-home-reminders-section` R10: `← desde #114 cruza con src/app/`; además la celda pasa de `src/app/(tabs)/` a `src/app/` (Obs. 5).
  - `mobile-reminders` R8: `← el caso sin mascota lo canda #114 R7 (A14)`.

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y las casillas P1 = A, A13, A14 y spec marcadas (2026-09-23). La de §Prueba de humo sigue abierta y no me corresponde
- [x] Sin drift de spec: `git diff --stat f5a491ee HEAD -- specs/mobile-reminders-alerts-to-stack/` solo toca `traceability.md` (10+/10−)
- [x] A14 literal. Comparé en python el bloque de §Enmiendas, con `<fecha>` = `2026-09-23`, contra los dos ficheros: está contenido en los dos y va seguido de `\n## Aprobación` (una sola cabecera de ese nombre por fichero). `grep -c 'Enmienda externa A14 — la escribe #114'` da 1 y 1
- [x] A13 literal. El fragmento nuevo aparece una vez en cada doc, el viejo (`` `meal-schedule` y `pairing`— ``) cero veces, y `grep -c 'enmienda A13 de #114'` da 1 y 1. `hero-header-amendments.test.ts` sigue verde en la suite completa

## Checklist C7 — Sin código huérfano
- [x] Componentes reemplazados eliminados:
  - `src/app/(tabs)/reminders.tsx` y `alerts.tsx` salieron con `git mv` (renombrados al 56 % de similitud, solo cambia el import).
  - `<Redirect>` desapareció de `add-reminder`, tanto del import como del render: `git grep -n Redirect -- mobile-pet-tracker/src/screens/add-reminder` sale vacío.
  - `grep` de `(tabs)/alerts`, `(tabs)/reminders` y `add-reminder-redirect` en `src/` solo encuentra las filas de "ruta vieja" del `it.each` de `#114 R1`, que aseveran justamente su ausencia.
- [x] Sus tests también eliminados:
  - `it('redirects a cold deep-link without a selected pet')` y el `Redirect` del doble de `expo-router` salieron en `36a9eca6`.
  - El `it` de listado de `#95 R2` salió en `c7883721`, sustituido por `#114 R1` (D9 fila 1).
- [ ] N/A — (no aplica: la feature sí reemplaza código)

## Checklist C8 — UI móvil (`docs/ui-guidelines.md`)
- [x] Grep-clean en los seis ficheros de producción (`_layout.tsx`, los dos routes, `screens/{reminders,alerts,add-reminder}/index.tsx`): cero hex, cero `className` con `[`, cero `StyleSheet.create`, cero `shadow*`/`elevation`. En las líneas añadidas del diff de producción, cero hex y cero clases arbitrarias
- [x] Métricas por la excepción A11, ya enmendada con A13. Las dos listas llevan exactamente `{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }`. `useSafeAreaInsets` y `contentInsetAdjustmentBehavior="automatic"` se quedan
- [x] Estados de carga: los Skeleton no cambian
- [x] Componentes compartidos: sin forks. El `Button` `reminders-add-link` no cambia; solo cambia su contenedor (`reminders-actions`, `flex-row justify-end`)
- [x] Tappables: sin cambios
- [x] Animaciones: ninguna nueva. La transición de pila es la de plataforma, sin clave `animation` (M14)
- [x] Leyes de navegación de appllama respetadas:
  - `dismissTo` para "cerrar y aterrizar en X" (R7).
  - El título pertenece al navegador (R4/R5).
  - El arranque en frío por notificación deja un stack real debajo, `["(tabs)", "alerts"]` (R3).

## Verificación independiente (sin pipes, exit medido)

- `bunx jest --ci --silent --json` en HEAD, worktree principal: `exit=0`, `82 passed`, `1435 passed`, 1 snapshot.
- Misma medida en `a833f153` (worktree desechable): `exit=0`, `80 passed`, `1426 passed`. El `impl` no llegó a medir la base en verde (lo declara); esta medida la confirma.
- Delta por fichero (JSON base contra JSON HEAD). **Coincide fila a fila con D8.** Ningún otro fichero cambia de recuento ni de estado:

| Fichero | Base | Cierre | Δ |
|---|---:|---:|---:|
| `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` | — | 1 | +1 |
| `src/app/__tests__/reminders-alerts-stack.notification.test.tsx` | — | 1 | +1 |
| `src/app/__tests__/detail-stack.test.tsx` | 12 | 14 | +2 |
| `src/app/__tests__/layout.test.tsx` | 15 | 18 | +3 |
| `src/screens/reminders/index.test.tsx` | 25 | 26 | +1 |
| `src/screens/alerts/index.test.tsx` | 32 | 33 | +1 |
| `src/screens/add-reminder/index.test.tsx` | 21 | 21 | 0 |
| `src/screens/home/index.test.tsx` | 140 | 140 | 0 |
| `src/app/(tabs)/__tests__/alerts.test.tsx` | 3 | 3 | 0 |
| `src/__tests__/ui-language.test.ts` | 25 | 25 | 0 |
| **Total** | **1426** | **1435** | **+9** (suites 80 → 82) |

- `rm -f .expo/types/router.d.ts; bunx tsc --noEmit` → `exit=0`, 0 bytes. `bunx expo lint` → `exit=0`, 0 bytes.
- §Verificación de requirements.md:
  - `git grep -n "Redirect" -- mobile-pet-tracker/src/screens/add-reminder` vacío (`exit=1`).
  - `git diff a833f153 -- catalog.ts use-push-registration.ts floating-tab-bar.tsx '(tabs)/_layout.tsx'` da 0 bytes.
  - `git diff --check a833f153 HEAD` vacío.
  - `ls src/app/(tabs)/` da exactamente `__tests__ _layout.tsx food.tsx health.tsx home.tsx map.tsx profile.tsx`.
- Tests heredados que cambian: **solo los de D9**. Recorrí el diff hunk a hunk:
  - `detail-stack` (fila 1), `layout` con `.slice(0, 6)` y su comentario (fila 2), `(tabs)/__tests__/alerts.test.tsx` con `'../../alerts'` (fila 3) y `home` con `appRoutes(join(process.cwd(), 'src/app'))` dos veces (filas 4–5).
  - `ui-copy-table`/`ui-language` (fila 6); `alerts` sin las dos aserciones del título en "pinta tres esqueletos…" (fila 7) y con la métrica y el título nuevo (fila 8).
  - `reminders` sin `getByText('Recordatorios')`, con la métrica y el título nuevo (fila 9); `add-reminder` (fila 10).
  - Aparte de esas filas, el diff solo añade los `describe` nuevos, el import de `es` en `reminders/index.test.tsx` y `dismissTo` en el doble.
- Catálogo y coordinación con #113:
  - `git diff a833f153 HEAD -- src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx` da **0 bytes**.
  - En `ui-copy-table.ts` solo cambian `R8_REMINDERS` (+1 `_layout` `// #114 R4`, −1 `screens/reminders`) y `R12_ALERTS` (+1 `_layout` `// #114 R4` al principio, −1 `screens/alerts`).
  - En `ui-language.test.ts` solo cambian `#65 R8` (`50 + 1 - 2 + 1 - 1`, con el comentario de D7) y el `every` de `#78 R12`, con su comentario.
  - En `specs/mobile-ui-language/design.md` §2 entran los dos sufijos de D7; el de `alerts.title` va **después** de `← añadida por #78 (R3)`.
  - `grep` de `R6_FOOD`, `#65 R6` y `food` en el diff de `src/__tests__/` sale vacío.

## Mutaciones propias (worktree desechable en HEAD `349c1a41`)

Cada una la apliqué con reemplazo exacto y único y la revertí con
`git checkout -- .`. Tras cada reversión, `git diff --stat` dio 0 bytes. Jest
corrió con `--runTestsByPath` sobre los ficheros de la columna "Suite".

| # | Mutación (zona) | Suite | Resultado |
|---|---|---|---|
| M1 | reminders: `<Text>{t('reminders.reminders')}</Text>` solo en la rama **cargada** (filas) | reminders | **rojo** `#114 R5` `:222` (ausencia tras la fila cargada), `Received: <Text>Recordatorios</Text>` |
| M2 | alerts: título como `ListHeaderComponent` solo con `rows.length > 0` | alerts | **rojo** `#114 R5` `:185` |
| M3 | alerts: título dentro de cada fila (`renderItem`) | alerts | **rojo** `#114 R5` `:185`, más `#78 R6` ×3 (`:402`) |
| M4 | alerts: `<View />` vacío como `ListHeaderComponent` sin error | alerts | **rojo** `#114 R5` `:187` (`ListHeaderComponent` no nulo) |
| M5 | reminders: título solo en la rama de **carga** | reminders | **rojo** `#114 R5` `:215` |
| M6 | `reminders-actions` con `justify-between` | reminders | **rojo** `#114 R5` `:217` |
| M7 | fuera `dangerouslySingular` de `alerts` | layout + nav + notif | **rojo**: `#114 R1` `:392` y `#114 R3` `:146` (el `back` queda en `/alerts`). **No** caen `:143`–`:144` (Obs. 1) |
| M8 | `reminders` fuera del `Stack.Protected` (reubicada tras el grupo) | layout + nav | **rojo**: `#95 R2` `:309`, `#114 R1` `:387` (7 de 8), `#114 R4` `:418` y `#114 R2` `:143` (queda en `/reminders` al cerrar sesión) |
| M9 | `alerts` fuera del `Stack.Protected` | layout + nav | **rojo**: `#95 R2`, `#114 R1`, `#114 R4` y `#114 R2` `:143` (queda en `/alerts`) |
| M10 | orden de los dos últimos: `alerts` antes que `reminders` | layout | **rojo** `#114 R1` `:392` |
| M11 | `reminders` antes de `pairing` (entre las seis) | layout | **rojo** `#95 R2` `:328` (`.slice(0, 6)`) y `#114 R1` `:392` |
| M12 | `headerTintColor: background` solo en `reminders` | layout | **rojo** `#114 R4` reminders `:418` |
| M13 | `headerTitleStyle: { fontFamily: 'Inter-Black' }` solo en `alerts` | layout | **rojo** `#114 R4` alerts |
| M14 | `animation: 'fade'` solo en `alerts` | layout | **rojo** `#114 R4` alerts |
| M15 | títulos de cabecera intercambiados | layout | **rojo** `#114 R4` ×2 |
| M16 | `dangerouslySingular` también en `reminders` | layout + nav | **rojo** `#114 R1` `:392` |
| M17 | reminders `paddingBottom: insets.bottom + 96` (solo esta pantalla) | reminders + alerts | **rojo** solo `#114 R6` reminders `:235` |
| M18 | alerts `paddingTop: insets.top + 12` (solo esta pantalla) | reminders + alerts | **rojo** solo `#114 R6` alerts `:295` |
| M19 | `<Redirect href="/reminders">` de vuelta en `add-reminder` (sin `dismissTo`) | add-reminder | **rojo**, 21/21: `Element type is invalid` (el doble ya no trae `Redirect`). Lo cierra además `git grep Redirect` de §Verificación |
| M20 | `router.push` en vez de `dismissTo` | add-reminder | **rojo** `#114 R7` `:146` (0 llamadas) |
| M21 | `dismissTo` + `router.back()` | add-reminder | **rojo** `#114 R7` `:149` |
| M22 | `dismissTo('/home')` | add-reminder | **rojo** `#114 R7` `:147` |
| M23 | `dismissTo` doble (efecto + render) | add-reminder | **rojo** `#114 R7` `:146` (2 llamadas) |
| M24 | pinta `screen-add-reminder` vacío sin mascota | add-reminder | **rojo** `#114 R7` `:150` |
| M27 | `getId` aleatorio en `reminders` | nav | **rojo** `#114 R2` `:125` (`dismissTo` apila otra `reminders`) |
| M28 | alerts: título en `ListHeaderComponent` con `firstPage?.kind === 'ok'` | alerts | **rojo** `#114 R5` `:185` |
| M29 | copia vieja en `src/app/(tabs)/alerts.tsx` | detail-stack | **rojo** `#114 R1` ×2 |
| M25 | reminders: título solo en la rama de **error** | reminders | verde 26/26. **Sobrevive**: fuera del alcance literal de R5 (Obs. 2) |
| M26 | alerts: título solo en el **vacío** cargado | alerts | verde 33/33. **Sobrevive**: ídem |
| M30 | la alternativa descartada en D2: `router.push('/alerts', { dangerouslySingular: true })` en el listener del hook y sin `dangerouslySingular` en el layout | notif + nav | verde. Sonda con temporizadores vaciados: pila estable y montajes 2→2, así que es **equivalente** en este entorno (Obs. 7) |
| M31 | M30 conservando `dangerouslySingular` en el layout | notif | verde (equivalente) |

Las dos mutaciones que declara el `impl` las reproduje. La (a) coincide con
M7 y cae igual (`:146`). La (b) de Codex quitaba `reminders` del layout; M8
la reubica tras el grupo. Las dos caen en `#114 R1` y `#114 R2`, y M8 además
en `#95 R2`, porque el `Stack` gana un hijo directo.

## Observaciones

1. (No bloqueante, pero conviene cerrarla antes o dentro de #100.) En
   `reminders-alerts-stack.notification.test.tsx`, las dos aserciones que
   siguen al **segundo** toque (`:143` pila igual, `:144` contador igual) son
   **tautológicas tal como están escritas**. Se evalúan tras un `act` que no
   vacía los temporizadores falsos de `renderRouter`, y la navegación todavía
   no se ha aplicado.
   - Sonda con M7 y una traza tras el `act`: `["(tabs)","add-reminder","alerts"]`, montajes 2→2.
   - La misma sonda tras `jest.runOnlyPendingTimers()` dentro de `act`: `["(tabs)","add-reminder","alerts","alerts"]`, montajes 2→3.
   - Con ese vaciado en HEAD (sin mutar), el `it` sigue verde (2→2, pila estable). Con M7, cae en la pila (`:145` de la sonda).

   M7 solo cae hoy por el `back` de `:146`. Tasks.md R1–R3 (3)(a) pedía el
   rojo "en el segundo toque", y el `impl` describe con honestidad dónde
   cayó. No lo marco como bloqueante por tres motivos:
   - La cláusula "la pila no crece" de R3 sí tiene candado vivo, el `back`.
   - Verifiqué aparte que el sistema cumple "no se vuelve a montar": la sonda de HEAD da 2→2.
   - No encontré una mutación realista que remonte sin crecer la pila: M30, la alternativa que D2 decía que remonta, es equivalente aquí.

   El techo es que la cláusula "la pantalla no se vuelve a montar" solo tiene
   hoy una aserción que no puede fallar. Si #100 toca este listener, heredará
   un candado más débil de lo que parece. El criterio de cierre: que M7 caiga
   en `:143`/`:144` y no solo en `:146`.
2. (Informativa, zona ciega fuera de alcance.) M25 (título en la rama de error
   de `reminders`) y M26 (título en el vacío cargado de `alerts`) sobreviven.
   R5 pide la ausencia "tanto cargando como con filas", y eso está cubierto
   (M1–M5, M28). El error y el vacío no los pide.
3. (Higiene del historial, no afecta al veredicto ni está en el `impl`.)
   - El rojo de R2 `892151b5` no tipa: `tsc` da `exit=2`, `TS2322` en `navigation.test.tsx:140` (`token: null`). El verde `c7883721` lo arregla tipando `mockAuthState`, y ese es su único cambio en el fichero del rojo.
   - Entre `dc4f5485` y `cc0c971b`, `bunx expo lint` imprime un `warning` (`'mockRemindersMounts' is assigned a value but never used`, `notification.test.tsx:19`). Lo medí en `c7883721` y `9f88d0ef`: `exit=0` con 355 bytes. Se arregla dentro del verde de **R5**, que toca un fichero de R3.
   - El verde de R7 `36a9eca6` renombra el `it` de su rojo ("ni un Redirect" → "ni una ruta de reemplazo") sin tocar sus aserciones.

   Ninguno debilita un candado, y el cierre sale limpio.
4. (Cosmético, transitorio.) El verde de R4 `9f88d0ef` ya escribe el comentario
   final de `#65 R8` (`… +1 #114 R4, -1 #114 R5`) con la suma `… + 1`, y el
   `- 1` no llega hasta `cc0c971b`. El estado final es exactamente el de D7.
5. (Cosmético.)
   - Sobra una línea en blanco antes del `});` de `#95 R2` en `detail-stack.test.tsx:19`.
   - Hay tres líneas en blanco en `notification.test.tsx:98-100` y dos tras el `jest.mock('expo-router')` de `add-reminder/index.test.tsx`.
   - En `specs/mobile-home-reminders-section/traceability.md` R10, además de la nota de D9, la celda cambia `src/app/(tabs)/` por `src/app/`. Queda cierto, pero la nota por sí sola ya bastaba.

   Lint pasa.
6. (Para el leader, plantilla de handoff.) El handoff mandó a Codex cargar
   "SOLO `building-native-ui`", mientras que `docs/ui-guidelines.md` §Skills
   hace obligatoria `appllama-app-design-skill` en toda tarea de UI móvil. Está
   en `.agents/skills/` y Codex la ve. Codex obedeció al handoff. La cargué yo
   y sus leyes de navegación coinciden con lo implementado (ver C8).
7. (Informativa para #100.) D2 afirma que
   `router.push('/alerts', { dangerouslySingular: true })` "filtra el historial
   y monta otra instancia". En este entorno (M30, con los temporizadores
   vaciados) ni remonta ni hace crecer la pila en el segundo toque. No cambia
   la decisión de D2, que se apoya también en no tocar el hook, pero la
   premisa no se sostiene tal cual.
8. (Honestidad del `impl`, contrastada.)
   - **Cuadran:** las cifras de los rojos, 204/10 en el verde de R1–R3, 1431 en su refactor, 82/1435 al cierre, 282/10 en el JSON dirigido, el reparto por fichero, los greps y las dos mutaciones.
   - **Impreciso:** dice "los cuatro ficheros de producción afectados" y son seis. Los seis salen limpios.
   - **Declarado:** que la base se midió con el rojo de R1 ya escrito, 80 suites y 1430 tests = 1426 + 4. Mi medida en `a833f153` da 80/1426.
   - **Omitido:** el punto 3.

La prueba de humo en dev build de Android es del humano y queda abierta.

## Output de ./init.sh

No lo lanzó el reviewer. Lo lanzó el leader, con permiso del humano, en
`/home/claude/sites/Pet-Tracker`. Leí los ficheros crudos:

- `…/scratchpad/init_114_review.head` = `349c1a41d7d80354038d9cc4bd5f432a4477f622` = `git rev-parse HEAD` al revisar (HEAD no se movió)
- `exit=0` del proceso, según el leader. No hay fichero `.exit`; el log termina en `✅ Todo verde`
- `…/scratchpad/init_114_review.log`: 17293 líneas. `grep` de `FAIL` o `✕` da 0. Estas son las decisivas (ANSI quitado):

```
→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
→ Instalando dependencias...
✅ Dependencias instaladas
→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-reminders-alerts-to-stack
⚠️  Feature 'harness-init-force-color' (done) sin specs/harness-init-force-color/requirements.md — probablemente anterior a la adopción de specs
✅ STATUS.md sincronizado con feature_list.json
→ Build...
✅ Build exitoso
→ Ejecutando tests...
[backend unit]  (l.216) Test Suites: 170 passed, 170 total
                (l.217) Tests:       1298 passed, 1298 total
[infra]         (l.229) Test Suites: 2 passed, 2 total
                (l.230) Tests:       14 passed, 14 total
[node --test]   # tests 28 / # pass 28 / # fail 0
                # tests 5  / # pass 5  / # fail 0
                # tests 15 / # pass 15 / # fail 0
[mobile jest]   (l.16965) Test Suites: 82 passed, 82 total
                (l.16966) Tests:       1435 passed, 1435 total
                (l.16967) Snapshots:   1 passed, 1 total
✅ Tests pasados
→ Tests e2e...
✅ Esquema y recursos e2e listos
[e2e]           (l.17263) Test Suites: 3 skipped, 27 passed, 27 of 30 total
                (l.17264) Tests:       8 skipped, 389 passed, 397 total
✅ Tests e2e pasados
→ Lint...
$ expo lint
✅ Lint sin errores
→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 97/114 completadas | 16 pendientes
```

Los avisos de `.env` y de `harness-init-force-color` ya existían y no afectan
al exit. El bloque móvil (82/1435) coincide con mi corrida independiente.
