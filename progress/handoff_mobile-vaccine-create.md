Worktree: /home/claude/sites/Pet-Tracker-wt-208
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-208 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/208-mobile-vaccine-create`.

Feature: mobile-vaccine-create (#208). Branch: feature/208-mobile-vaccine-create. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): 2eb28ef5, errata E1 del leader sobre la spec firmada. La spec está aprobada (casilla `Aprobado por humano` marcada) y las enmiendas M1–M2 tienen firma delegada en f9492b2e. El merge de `origin/dev` con #220 (`DateField`, `utils/civil-date.ts`) ya está hecho en a315a6af. NO hagas `git fetch`, `git merge` ni `git rebase` de nada: el primer paso de tasks.md («git fetch origin && git merge origin/dev») ya está cumplido y no se repite.
Spec aprobada: specs/mobile-vaccine-create/requirements.md (status: approved), con sus secciones finales «Enmiendas tras el merge de #220» (M1, M2) y «Errata del leader» (E1), que mandan sobre el texto anterior. Lee también design.md y tasks.md. Contexto (no instrucciones): progress/enmiendas_mobile-vaccine-create.md. No hay decisiones abiertas: no hay nada que preguntar.
Orden: tasks.md manda. R1, R2, R3, R4, R19, R5, R6, R7 … R18, R20, R21, R22. Criterios de aceptación: R1 a R22 de requirements.md. La casilla de smoke en dispositivo es del humano; tú no la tocas.
Entorno: el worktree ya tiene `.env` y `mobile-pet-tracker/node_modules` (`bun install --frozen-lockfile` ya corrido). No los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker; nunca npm ni npx. No añadas dependencias (`package.json` y `bun.lock` no cambian).
Árbol: `progress/*.log` y `progress/impl_*.done` los ignora git. El chequeo de árbol limpio se acota: `cd /home/claude/sites/Pet-Tracker-wt-208/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs ../init.config.sh ../init-e2e-gate.test.mjs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`. Nunca `test -z "$(git status --short)"` tras `git add`.

Archivos (lista cerrada, la de design.md §Archivos afectados; si necesitas otro, PARA y pregunta al leader). Todos bajo mobile-pet-tracker/src/ salvo indicación:
  Nuevos:
  - app/pets/[petId]/vaccines/new.tsx (R4)
  - screens/vaccine-create/index.tsx y screens/vaccine-create/index.test.tsx (R4, R7 a R18)
  - utils/vaccine-dates.ts y utils/__tests__/vaccine-dates.test.ts (R2)
  - hooks/vaccine-reminder-notice.ts (R16)
  Modificados:
  - api/health-records.ts, api/types.ts, api/query-keys.ts, api/__tests__/health-records.test.ts (R1)
  - utils/form-rules.ts y utils/form-rules.test.ts (R3; E1: el test va en ese fichero, que ya existe, no en utils/__tests__/)
  - app/_layout.tsx, app/__tests__/layout.test.tsx, app/__tests__/detail-stack.guard.test.tsx (R4)
  - screens/health/index.tsx y screens/health/index.test.tsx (R5, R6, R16)
  - i18n/catalog.ts y providers/__tests__/language-provider.test.tsx (R19)
  - __tests__/ui-copy-table.ts y __tests__/ui-language.test.ts (R20)
  - __tests__/chunky-cta-canvas-fidelity.test.ts, __tests__/consistency-classnames.test.ts, __tests__/design-drift.test.ts (R21)
  - ../../init.config.sh y ../../init-e2e-gate.test.mjs, en la raíz (R22)
  - ../../specs/mobile-vaccine-create/traceability.md (solo en el commit final)
  - ../../progress/impl_mobile-vaccine-create.md (tu reporte)
No tocar: components/date-field.tsx, utils/civil-date.ts, utils/reminder-dates.ts, utils/category-palette.ts, hooks/use-push-registration.ts, api/reminders.ts, theme/, screens/weight-log/, screens/add-reminder/, __tests__/legibility-classnames.test.ts, init.sh, backend-pet-tracker/, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, ni docs/.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill.
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills; no los nuestros). La spec o la carta pueden nombrar `expo:expo-overview`: NO existe en Codex, no la busques.
    - `building-native-ui`: pantalla, formulario y KAV.
    - `native-data-fetching`: queries y mutación con react-query.
    - `expo-ui-swift-ui` y `expo-ui-jetpack-compose`: el picker de `@expo/ui`, que vive dentro de `DateField` (no lo tocas; solo lo consumes).
    - `expo-tailwind-setup`: uniwind y clases Tailwind v4.
    - `appllama-app-design-skill` (en `.agents/skills/`): obligatoria según la carta §Skills. Solo toma el patrón; los valores los mandan la spec y la carta. Codex no tiene el MCP de appllama: si la skill pide sus herramientas, sáltalas.
    - `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` no existen en Codex. Esta feature no anima nada.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera al mismo nodo que aserta el test (el positivo final o, si la rama pinta null, la desaparición del nodo de carga), nunca a un contador de mock. En R15 a R17, espera al efecto visible (la llamada a `router.back` vía el nodo que la sigue, el aviso, la alerta), no a `toHaveBeenCalledTimes` del mock como única espera.
  - RNTL 14: `await fireEvent`, `await render`, `await renderRouter` y `await act`. Sin await, un it contamina al siguiente. Con `renderRouter`, `await` siempre.
  - RNTL oculta a accesibilidad los nodos decorativos: si un `getByTestId` no encuentra un nodo que existe (el tile de la tarjeta vacía, iconos), pasa `{ includeHiddenElements: true }`; no quites la accesibilidad del componente.
  - Jest corre en UTC: `process.env.TZ` NO cambia `Date`. R2 y R15 fijan la zona con `process.getBuiltinModule('process').env.TZ = 'America/Mexico_City'` y la restauran en `afterEach`, como dice requirements.md. El reloj de pantalla, como en convenciones de la spec (día civil 2026-10-06).
  - Valores de la spec (fechas esperadas, `dueAt`, px, clases, `bottom: 104`) son literales del test, nunca importados de producción (candado tautológico). El `dueAt` de R15 es `new Date(2027, 9, 6, 9, 0, 0, 0).toISOString()` y `'2027-10-06T15:00:00.000Z'`, no el helper.
  - El copy sale del catálogo `i18n/catalog.ts`; los literales es/en de R5 a R18 y las 26 claves de R19 están en requirements.md: úsalos tal cual, no inventes otros. `vaccine-create/index.tsx` no contiene como literal ningún texto de usuario.
  - Comentarios de código y títulos de `describe`/`it`: la referencia a la feature va solo como `#208 R<n>`, nunca `#208` desnudo (el exento de `HEX_LITERAL` de design-drift es solo `#NNN R<n>`; R21 lo prohíbe en los cuatro ficheros nuevos). Todo `it` nuevo se titula `#208 R<n>: …`. Los `it` viejos que tocas conservan el nombre y llevan el sufijo ` (enmendado por #208 R<n>)`.
  - Cero `StyleSheet.create`, hex fuera de `src/theme/`, clases `[...]`, `text-accent` desnudo, `text-warning`, `useThemeColors` con `'accent'`, sombras legacy, emoji o dependencias nuevas. design-drift lee también index.test.tsx de algunas pantallas: no pongas `StyleSheet` en tests de pantalla.
  - Inventarios (R20 y R21): requirements.md R21 y M2 son el inventario cerrado con sus deltas exactos. Además, el leader midió estos agregados que se mueven por los mismos nodos y que caen bajo la «regla mecánica para lo no listado» de R21 (entrada o `+ N // #208 R21`, sufijo de título, listados en el reporte con antes y después):
    - `chunky-cta-canvas-fidelity.test.ts`, `it` `#177 R7.3`: la suma de `count(/\brounded-16\b/g)` gana `+ 1 + 1`.
    - `consistency-classnames.test.ts`, `#62 R14`: la suma total de `directUses` gana `+ 2 + 7`.
    - `consistency-classnames.test.ts`, `it` «inventaría los diecisiete primarios con labio…»: `expected` gana `'screens/health/index.tsx': 1` y `'screens/vaccine-create/index.tsx': 1`, y el mapa `rounded-xl bg-accent` pasa a `{ 'screens/health/index.tsx': 1, 'screens/reminders/index.tsx': 1 }`.
    - `consistency-classnames.test.ts`, la línea que da `grep -cF ')).toBe(1); // #177 R10' __tests__/consistency-classnames.test.ts` → 1 (el `count` de `rounded-xl bg-accent`) pasa a `toBe(1 + 1)` con su `// #208 R21`.
    Mide cada uno con su ancla antes de editar. Si al correr la suite aparece en rojo un `it` que no está ni en R21/M2 ni en esta lista, y está en un fichero de la lista cerrada y falla SOLO por nodos que la spec exige, aplica la regla mecánica y anótalo. Si está fuera de la lista cerrada (p. ej. legibility-classnames), PARA. Un candado del inventario que se queda verde sin tocarlo cuando debía moverse es una alerta: PARA y reporta.
  - Adelanto de candados: los nodos de Salud (R5, R6, R16) y de la pantalla de alta (R7 a R17) mueven inventarios que la spec enmienda en R20 y R21. Si el `feat` de un R pone en rojo un `it` de R20/R21 o de la lista de arriba, adelanta a ESE `feat` solo los sumandos o filas que ese nodo mueve, con la cifra acumulada de ese commit, y dilo en el reporte. Ejemplos esperables: el `feat` de R5 mueve R3.3, R7.2, R7.5 y R8.1 de chunky-cta y el mapa `rounded-xl bg-accent`; el de R6 mueve `CTA_ROWS` (fila de `vaccines-empty-action`), R6.2, `radii`, `rounded-16 bg-accent`, `directUses` de Salud y el `#186 R7` (M2: segunda fila `health.noVaccinesYet` en `R5_HEALTH`). Al terminar R21, las cifras son exactamente las de R21 y M2. Los `it` de R20/R21 que así nazcan verdes se dicen en el reporte y se demuestran con la mutación.
  - Sondas de mutación: cada R lleva una mutación plantada en producción, vista en rojo y revertida (no se commitea). Plántala donde el candado pueda no mirar. Como mínimo:
    - R1: ruta `/vaccines-catalog` en lugar de `/vaccine-catalog`; y 400 mapeado a `error`.
    - R2: sumar con `Date` sin recorte (2026-01-31 + 1 da marzo); y leer con getters locales en vez de UTC (rompe la fila TZ).
    - R3: sin `trim()` (rompe `'   '`).
    - R4: el `Stack.Screen` al final del grupo protegido en vez de tras `meals-history`.
    - R5: pintar `vaccines-add` para cualquier rol.
    - R6: pintar la tarjeta para `family`.
    - R10: no recalcular la próxima dosis al cambiar de chip.
    - R12: recordatorio desmarcado por defecto.
    - R14: omitir `nextDoseAt` con catálogo; enviar `notes: ''` en vez de omitirla.
    - R15: `advanceMinutes: 15`; y `dueAt` desde el valor del formulario en vez de la respuesta del 201.
    - R16: no llamar a `showVaccineReminderNotice` si falla el recordatorio; y pintar el aviso para cualquier `petId`.
    - R17: navegar atrás tras un error.
    - R18: pintar `errors[0].message` del servidor.
    - R19: retirar una clave en `en`.
    - R20: añadir un `t()` sin fila.
    - R21: un `text-accent` desnudo en vaccine-create; y un comentario `#208` sin `R<n>`.
    - R22: `seed:vaccines` después de `provision:local`.
    Sin la sonda el candado no está probado: anótalo en el reporte.
  - TDD por requisito: test rojo que nombra el R-id, después verde. Antes de cada commit de test, comprueba que los `it` nuevos fallan por la aserción, no por import roto ni excepción. Excepción esperada: R2 y R4 (`vaccine-dates.ts` y la pantalla no existen), donde el rojo es por import y lo dices.
  - UN COMMIT POR PASO como mínimo, test rojo antes que su implementación (C4 de CHECKPOINTS.md): `test(mobile): #208 R<n> <resumen> (rojo)` y luego `feat(mobile): #208 R<n> <resumen>`, resumen en inglés. Nunca implementación y test en el mismo commit, ni un commit para varios R-ids. El refactor, si lo hay, va en `refactor(mobile): #208 R<n> …`. R20: si todo cuadró ya, el `feat` se omite y se dice (tasks.md).
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso. Nunca `git add -A` ni `commit -a`. El móvil no tiene prettier: no lo ejecutes.
  - Cada cadena termina en su línea `git commit -m`. Las cabeceras de sección van como comentario de shell (`# -- R1 test --`).
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(mobile): #208 traceability and implementation report` tras el último verde. No mezcles ficheros de arnés en los commits TDD. No rebasees tras rellenarlo.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-208/mobile-pet-tracker && bunx jest --runTestsByPath '<ruta>' --testTimeout=30000`, con la ruta entre comillas simples (los corchetes de `[petId]`), solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos (otros worktrees corren jest en esta máquina: si no están vacíos, espera y vuelve a mirar; nunca esperes e `init.sh` en el mismo comando). El posicional sin `--runTestsByPath` es regex y sale 0 sin correr nada. Un timeout aislado se mide sin flag antes de tocar nada.
  - R22, desde la raíz: `cd /home/claude/sites/Pet-Tracker-wt-208 && node --test init-e2e-gate.test.mjs`.
  - Tipos: antes de cada `bun run typecheck`, ejecuta `test ! -e .expo/types/router.d.ts` desde mobile-pet-tracker/. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-208/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-208.log 2>&1 && test ! -s ../progress/lint-208.log`. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`.
  - `react-hooks/purity` veta `Date.now()` y `new Date()` en render: el «hoy» de la pantalla de alta (fecha de aplicación inicial, comparación de R15) se calcula fuera del render, con el patrón de estado `now` de add-reminder o en el manejador. Anótalo.
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-vaccine-create.md.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.
  - Flakes de carga conocidos: si un rojo de la suite completa es una suite que no tocaste y pasa sola, es carga: córrela aislada, anota el rojo y el verde aislado y sigue. Conocidos: `#199 R18` (timeouts), Nutrición `#200 R9`/`#200 R10` (`screens/food`), Inicio `#152 R8`. Salud `#168 R2` es flake conocido aunque esté en un fichero tuyo (lee los hijos de `health-content` sin esperar a `vaccines-section`): rojo en la suite completa y verde aislado se anota y se sigue; rojo aislado, PARA. Cualquier otro rojo de tu alcance o de un candado del inventario, PARA.

Anclas de la base (T0): corre cada una tal cual antes del primer test, desde /home/claude/sites/Pet-Tracker-wt-208/mobile-pet-tracker/src, y pega la salida en el reporte. Salidas esperadas medidas por el leader en H0 (todas coinciden); ante una diferencia, PARA:
  grep -cF 'export function DateField' components/date-field.tsx                          # 1
  grep -cF 'export function isoToLocalDate' utils/civil-date.ts                           # 1
  grep -cF 'export function localDateToIso' utils/civil-date.ts                           # 1
  grep -cF 'export function hhmmToLocalDate' utils/civil-date.ts                          # 1
  grep -cF 'export async function listVaccines' api/health-records.ts                     # 1
  grep -cF 'export async function createWeight' api/health-records.ts                     # 1
  grep -cF 'export interface Vaccine ' api/types.ts                                       # 1
  grep -cF "vaccines: (petId: string) => ['health', 'vaccines', petId] as const," api/query-keys.ts   # 1
  grep -cF 'export function validateWeight' utils/form-rules.ts                           # 1
  ls utils/form-rules.test.ts utils/__tests__/form-rules.test.ts 2>&1 | grep -c 'No such file'   # 1 (E1: existe el primero, no el segundo)
  grep -cF '<Stack.Screen name="meals-history" options={{ headerShown: false }} />' app/_layout.tsx   # 1
  grep -cF 'useLocalSearchParams<{ petId: string }>()' 'app/pets/[petId]/docs-upload.tsx' # 1
  grep -cF 'testID="vaccines-title"' screens/health/index.tsx                             # 1
  grep -cF 'testID="vaccines-empty"' screens/health/index.tsx                             # 1
  grep -cF 'queryFn: () => listPets(' screens/health/index.tsx                            # 1
  grep -cF "t('health.noVaccinesYet')" screens/health/index.tsx                           # 1
  grep -oE '\brounded-16\b' screens/health/index.tsx | wc -l                              # 1
  grep -c useChunkyLip screens/health/index.tsx                                           # 0
  grep -cF 'text-warning-strong' screens/health/index.tsx                                 # 0 (y sigue en 0)
  grep -cF 'text-accent-strong' screens/health/index.tsx                                  # 0 (y sigue en 0)
  grep -cF 'className="rounded-xl bg-accent h-10 gap-1.5 px-3.5" style={chunkyLip.primaryCompact}' screens/reminders/index.tsx   # 1
  grep -cF "'health.noVaccinesYet':" i18n/catalog.ts                                      # 2
  grep -cF "'validation.checkDetails':" i18n/catalog.ts                                   # 2
  grep -cF "'vaccineCreate." i18n/catalog.ts                                              # 0
  grep -cF 'export function combineDateAndTime' utils/reminder-dates.ts                   # 1
  grep -cF 'export async function createReminder' api/reminders.ts                        # 1
  grep -cF 'useSyncExternalStore(' hooks/use-push-registration.ts                         # 1
  grep -cF 'shadows.toast' screens/weight-log/index.tsx                                   # 1
  grep -cF "amber: { surface: 'bg-category-amber', ink: 'text-category-amber-strong' }," utils/category-palette.ts   # 1
  grep -cF "rose: { surface: 'bg-category-rose', ink: 'text-category-rose-strong' }," utils/category-palette.ts      # 1
  grep -cF 'export const R18_DATE_FIELD' __tests__/ui-copy-table.ts                       # 1
  grep -cF 'R19_' __tests__/ui-copy-table.ts                                              # 0
  grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1 + 4 - 1 + 1 + 7 - 1); // #220 R16' __tests__/ui-language.test.ts   # 1
  grep -cF "reminders-add-link'].sort()" __tests__/chunky-cta-canvas-fidelity.test.ts     # 1
  grep -cF "toHaveLength(16 + 1 + 1 + 1)" __tests__/consistency-classnames.test.ts        # 1
  grep -cF "[join('screens', 'health', 'index.tsx'), 2 + 1 + 1 + 1]" __tests__/consistency-classnames.test.ts   # 1
  grep -cE 'expect\(children\)\.toHaveLength\((8|9|10|11) \+' app/__tests__/layout.test.tsx   # 4
  grep -cF "describe('#149 R3: cerrar sesión en un detalle aterriza en welcome'" app/__tests__/detail-stack.guard.test.tsx   # 1
  ls utils/vaccine-dates.ts hooks/vaccine-reminder-notice.ts screens/vaccine-create 'app/pets/[petId]/vaccines' 2>&1 | grep -c 'No such file'   # 4
  (desde mobile-pet-tracker/) test ! -e .expo/types/router.d.ts && echo sin-router-d-ts   # sin-router-d-ts
  (desde la raíz) grep -cF 'E2E_SETUP_CMD="pnpm -C backend-pet-tracker run db:migrate && pnpm -C backend-pet-tracker run provision:local"' init.config.sh   # 1
  (desde la raíz) grep -cF '"seed:vaccines":' backend-pet-tracker/package.json            # 1
Un `grep -c` cuenta líneas, no apariciones.

Base de tests (T0): la midió el leader en a315a6af (mismo código de app que H0) y queda aceptada: 157 suites, 5470 tests, todo verde (siete suites rojas por carga en la corrida completa pasaron en la segunda corrida aislada; logs en progress/base-208.log y progress/base-208-rerun.log). No la repitas. Úsala como T0 de la cuenta encadenada: la cifra de tests de cada commit = anterior + sus `it` añadidos (cada fila de `it.each` cuenta) - los que se reemplacen; anótalo. El aviso final de worker force-exit es preexistente.

Cadena (tasks.md manda; pega la línea `Tests:` del fichero corrido tras cada commit):
  # -- R1 -- test: api/__tests__/health-records.test.ts, cinco `it`. feat: getVaccineCatalog, createVaccine, VaccineCatalogEntry, CreateVaccineInput, healthKeys.vaccineCatalog.
  # -- R2 -- test: utils/__tests__/vaccine-dates.test.ts, nueve filas y el segundo `it.each` en America/Mexico_City (rojo por import). feat: utils/vaccine-dates.ts.
  # -- R3 -- test: utils/form-rules.test.ts, tres `it`. feat: validateVaccine en utils/form-rules.ts.
  # -- R4 -- test: layout.test.tsx (it nuevo y los cuatro `+ 1 // #208 R4`), detail-stack.guard.test.tsx (fila `'/pets/pet-1/vaccines/new', // #208 R4`) y el it de ruta en screens/vaccine-create/index.test.tsx (rojo por import). feat: route, Stack.Screen justo tras meals-history y un VaccineCreateScreen mínimo.
  # -- R19 -- test: language-provider.test.tsx `+ 26, // #208 R19` y sufijo de título. feat: 26 claves en en y en es de i18n/catalog.ts, literales de requirements.md.
  # -- R5 -- test: health/index.test.tsx; mock de reicon gana `Plus` y `BellOff`; it del owner, it.each de tres roles, enmienda de `#199 R15`. feat: vaccines-header y vaccines-add (más el adelanto de candados que haga falta).
  # -- R6 -- test: tarjeta vacía, CTA, it.each de tres roles y los tres it existentes con `makePet({ myRole: 'family' })`. feat: vaccines-empty-card (más el adelanto, incluido M2).
  # -- R7 … R18 -- un par test/feat por R, en screens/vaccine-create/index.test.tsx e index.tsx; R16 añade hooks/vaccine-reminder-notice.ts, el aviso en Salud y `clearVaccineReminderNotice()` en `beforeEach` de los dos ficheros de test.
  # -- R20 -- test: R19_VACCINE_CREATE con 29 filas y `toHaveLength(29)`, `SCREEN_FILES + 1`, el bloque en `blocks`, la segunda fila `health.noVaccinesYet` en R5_HEALTH `// #208 R20` con `+ 1 // #208 R20` y el sufijo de `#186 R7` (lo que no se haya adelantado). feat solo si una fila no cuadra.
  # -- R21 -- test: describe `#208 R21: alta de vacuna sin deriva` con el it `#208 R21: los cuatro ficheros nuevos no tienen deriva de estilo`, y las enmiendas de R21 y de la lista mecánica que queden. feat solo si aparece deriva: se corrige, nunca se afloja la guarda.
  # -- R22 -- test: it `#208 R22: E2E_SETUP_CMD siembra el catálogo de vacunas entre migrar y aprovisionar` en init-e2e-gate.test.mjs. feat: la línea de init.config.sh, literal de requirements.md R22.
  # -- docs -- traceability.md (un hash por R, de su test y de su feat) y el reporte, en un solo commit.
Antes de los `feat` de R6, R16, R20 y R21, el jest completo sin pipe (`bun run test > ../progress/full-208-<rNN>.log 2>&1; echo exit=$?`), con todos los candados del inventario en verde o con su adelanto en ese mismo commit.

Guardas que R1 a R22 cruzan:
  - `package.json`, `bun.lock`, `theme/` e `init.sh` sin cambios desde H0.
  - `components/date-field.tsx`, `utils/civil-date.ts` y `utils/reminder-dates.ts` sin cambios (se consumen, no se tocan).
  - `backend-pet-tracker/` sin cambios.
  - `text-warning-strong` y `text-accent-strong` siguen en 0 en screens/health/index.tsx.
  - `forms-validation-global` y `legibility-classnames` siguen verdes sin tocarlos.

Cierre (tasks.md; lo que el reporte debe traer):
  - `bun run test` completo en verde, guardado en `progress/final-test-208.log`, sin pipe.
  - `node --test init-e2e-gate.test.mjs` desde la raíz en verde.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck`.
  - Lint, como arriba.
  - Grep-clean de R21 sobre los cuatro ficheros nuevos, con la salida pegada.
  - `git diff 2eb28ef5 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/theme mobile-pet-tracker/src/components/date-field.tsx mobile-pet-tracker/src/utils/civil-date.ts mobile-pet-tracker/src/utils/reminder-dates.ts init.sh backend-pet-tracker` vacío.
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only 2eb28ef5..HEAD -- mobile-pet-tracker/ init.config.sh init-e2e-gate.test.mjs specs/`. Debe coincidir con la lista cerrada de arriba.
  - Reporte en progress/impl_mobile-vaccine-create.md: comprobación del primer comando, salida de las anclas T0, commits (hash y mensaje), línea `Tests:` tras cada commit y la cuenta encadenada, resultado de las sondas y mutaciones, `it` que nacieron verdes, adelantos de candados (commit, candado, cifra), skills cargadas y no encontradas, lint y typecheck, cada enmienda de inventario de R20/R21 y de la regla mecánica (candado, antes/después, R), flakes de carga vistos, desviaciones, tabla R1-R22 a test a commit, y la lista de casos de smoke del humano: picker nativo de las dos fechas (aplicación y próxima dosis), teclado con KAV sobre notas, recordatorio creado a las 09:00 locales, «Agregar vacuna» visible solo para el owner, tarjeta vacía con CTA, aviso ámbar y «Crear ahora», alerta rosa sin red.
  - Última acción: crear progress/impl_mobile-vaccine-create.done con una sola línea, la ruta de progress/impl_mobile-vaccine-create.md. Está en .gitignore; no lo commitees (lo vigila scripts/harness/watch-impl.sh).
