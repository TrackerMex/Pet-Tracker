Worktree: /home/claude/sites/Pet-Tracker-wt-209
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-209 && pwd && git branch --show-current && git log --oneline -2`. Confirma en el reporte que la salida es esa ruta y la branch `feature/209-mobile-nutrition-questionnaire`. Los dos commits deben ser, de arriba abajo, el del handoff (`docs(progress): #209 Codex handoff`) y `001d5ed4` (H0).

Feature: mobile-nutrition-questionnaire (#209). Branch: feature/209-mobile-nutrition-questionnaire. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): 001d5ed4. La spec está aprobada: firma delegada del leader, con las erratas de la ronda 3 dentro de H0. Su padre, 1dbac74f, es el merge de `origin/dev` b185ae61, que trajo tres features:
  - #219;
  - #218: fondo `surface` del `BottomSheet` y la guarda `#218 R3`;
  - #208: alta de vacuna, que movió varias bases de R3, R23 y R24; las cifras de la spec ya las incluyen.
H0 solo toca `specs/` y `progress/`, así que el código de 1dbac74f y el de H0 son el mismo. NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install --frozen-lockfile`. El punto «Si `origin/dev` avanzó» del Cierre de tasks.md es del leader, no tuyo.
Spec aprobada: specs/mobile-nutrition-questionnaire/requirements.md (status: approved). Lee también design.md, tasks.md y traceability.md enteros. Contexto, no instrucciones: progress/firma_mobile-nutrition-questionnaire.md. No hay decisiones abiertas ni nada que preguntar.
Orden: tasks.md manda en el contenido de cada paso. La cadena de abajo sigue su orden con dos cambios declarados:
  - R6 va tras R9, como permite tasks.md §R6.
  - R23 se parte en dos: el catálogo, tras R3, y la tabla, tras R22 (ver «Cadena»).
Criterios de aceptación: R1 a R26 de requirements.md. Son del humano y no las tocas: la casilla de smoke en dispositivo y la casilla `- [ ] Enmienda #209 aprobada por humano` de R26.
Entorno: el worktree ya tiene `.env` y `mobile-pet-tracker/node_modules`; no los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker, nunca npm ni npx. Ninguna dependencia nueva (requirements.md §Reglas): si crees que hace falta una, PARA.
Árbol: git ignora `progress/*.log` y `progress/impl_*.done`. El chequeo de árbol limpio se acota: `cd /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`. Nunca `test -z "$(git status --short)"` tras `git add`.

Archivos (lista cerrada: la de design.md §Archivos por capa más los tests que nombra cada R-id; si necesitas otro, PARA y pregunta al leader). Todos van bajo mobile-pet-tracker/ salvo los que empiezan por `../`:
  Producción nueva:
  - src/app/nutrition-profile.tsx (ruta delgada, R3)
  - src/screens/nutrition-questionnaire/index.tsx (esqueleto en R3; wizard y Generando de R4 a R18 y R25)
  Producción modificada:
  - src/api/http.ts (`putJson`, R1)
  - src/api/types.ts (`NutritionProfileInput`, R2)
  - src/api/nutrition.ts (`UpsertNutritionProfileState` y `upsertNutritionProfile`, R2)
  - src/app/_layout.tsx (un `Stack.Screen`, R3)
  - src/screens/food/index.tsx (consulta de perfil y `food-profile-empty`, R19)
  - src/screens/meal-schedule/index.tsx (enlaces de perfil, «Generar plan» solo para owner y píldoras, R20 a R22)
  - src/i18n/catalog.ts (77 claves × 2 idiomas, R23)
  Test nuevo:
  - src/screens/nutrition-questionnaire/index.test.tsx (R3 a R18)
  Tests modificados:
  - src/api/__tests__/nutrition.test.ts (R1, R2)
  - src/app/__tests__/layout.test.tsx (R3)
  - src/screens/food/index.test.tsx (R19)
  - src/screens/meal-schedule/index.test.tsx (R20 a R22)
  - src/providers/__tests__/language-provider.test.tsx (R23, catálogo)
  - src/__tests__/ui-copy-table.ts y src/__tests__/ui-language.test.ts (R23, tabla)
  - src/__tests__/consistency-classnames.test.ts, src/__tests__/chunky-cta-canvas-fidelity.test.ts, src/__tests__/legibility-classnames.test.ts, src/__tests__/alerts-canvas-fidelity.test.ts y src/__tests__/profile-canvas-fidelity.test.ts (R24)
  - src/__tests__/design-drift.test.ts (R24 y R25)
  Arnés y docs:
  - ../docs/ui-guidelines.md (solo la sección de R26)
  - ../specs/mobile-nutrition-questionnaire/traceability.md (solo en el commit final)
  - ../progress/impl_mobile-nutrition-questionnaire.md (tu reporte)
No tocar:
  - src/api/: todo salvo http.ts, types.ts y nutrition.ts. Incluye src/api/query-keys.ts: `nutritionKeys.profile` y `nutritionKeys.plan` ya existen.
  - src/components/, src/theme/ y src/hooks/: `ScreenHeader`, `PingRing`, `PingoFloat`, `TOUCH_SLOP`, `MOTION_PING_TIMING` y `chunkyLip` se consumen.
  - src/providers/ (solo su test de idioma), src/i18n/ salvo catalog.ts, y el resto de src/app/ (solo la ruta nueva y `_layout.tsx`).
  - test/, package.json y bun.lock.
  - src/__tests__/sheet-surface-background.test.ts, src/app/__tests__/detail-stack.guard.test.tsx y cualquier otro test fuera de la lista.
  - backend-pet-tracker/, init.sh, init.config.sh, feature_list.json y STATUS.md.
  - progress/history.md, progress/current.md, progress/handoff_*.md y progress/firma_*.md.
  - specs/ salvo traceability.md, y docs/ salvo ui-guidelines.md.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill.
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills), no los nuestros. La spec o la carta pueden nombrar `expo:expo-overview`: NO existe en Codex, no la busques.
    - `building-native-ui`:
      - la raíz `KeyboardAvoidingView` (R18);
      - el `ScrollView` con `key={step}`;
      - las tarjetas, filas BCS y chips;
      - los `TextInput` de `NumberField` y `OtherField`;
      - la vista Generando.
    - `native-data-fetching`: las dos `useQuery` de R4, la de perfil de Nutrición con `enabled` (R19) e `invalidateQueries` (R16).
    - `expo-tailwind-setup`: uniwind y clases Tailwind v4.
    - `appllama-app-design-skill` (en `.agents/skills/`) es obligatoria según la carta §Skills. Solo toma el patrón: los valores los mandan la spec y la carta. Codex no tiene el MCP de appllama; si la skill pide sus herramientas, sáltalas.
    - `expo-overview`, `expo-router`, `expo-animation` y `expo-design-system` no existen en Codex. Su terreno lo cubren estos literales y ficheros:
      - la ruta delgada es el literal de R3;
      - `useLocalSearchParams`, `router.push({ pathname: '/nutrition-profile', params: { petId } })` y `router.back()` son literales de requirements.md;
      - `usePreventRemove` se importa de `expo-router/react-navigation` como en src/screens/add-pet/index.tsx, y su doble de test sigue el de src/screens/add-pet/index.test.tsx;
      - no animas nada nuevo: `PingRing` (src/components/ping-ring.tsx) con `MOTION_PING_TIMING` (src/theme/motion.ts) y `PingoFloat` ya existen y se consumen, y el círculo «en curso» es un `View` estático (design.md, decisión 13).
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera siempre al mismo nodo que aserta el test, nunca a un contador de mock:
    - el positivo final;
    - o, si la rama no pinta nada nuevo, la desaparición de `nutrition-questionnaire-skeleton`.
    requirements.md no da una espera por `it`, así que esta regla vale para todos. En R16 las promesas de `fetch` se resuelven a mano dentro de `await act(...)` y se espera al nodo de la fase siguiente. Sin timers falsos (tasks.md §R16).
  - Dobles del test del cuestionario. Esto es la intención; contrástala con los ficheros modelo antes de escribir:
    - `getPet` se dobla como módulo (`jest.mock('../../api/pets', …)`), como en src/screens/meal-schedule/index.test.tsx.
    - `../../api/nutrition` NO se dobla. R14 aserta el `JSON.parse` del `body` de la llamada PUT, y R16 controla a mano las promesas de `fetch`.
    - `fetch` se dobla con `jest.spyOn(global, 'fetch')`:
      - responde por método y ruta: el GET y el PUT de `/pets/<petId>/nutrition-profile`, y la llamada de `generateNutritionPlan`;
      - `process.env.EXPO_PUBLIC_API_URL` se fija en `beforeEach`, como en src/screens/vaccine-create/index.test.tsx;
      - `mockRestore()` va en `afterEach`.
    - Movimiento reducido: el doble de requirements.md §R16, con `__esModule: true`; sin él, el doble pierde la exportación por defecto.
    - `expo-router`, `auth-provider`, `react-native-safe-area-context` y `use-theme-colors`: como en los tests de Horario y de alta de vacuna.
    - Nada de `jest.mock(…, { virtual: true })`: lo veta `jest-virtual-mock-lock`.
  - RNTL 14: `await fireEvent`, `await render`, `await renderRouter` y `await act`. Sin await, un it contamina al siguiente.
  - RNTL oculta a accesibilidad los nodos decorativos. Si un `getByTestId` no encuentra un nodo que existe (anillos, Pingo, badges), pasa `{ includeHiddenElements: true }`. No quites la accesibilidad del componente.
  - Los valores de la spec son literales del test escritos a mano, nunca importados de producción (candado tautológico). Incluye:
    - `NINE_ROWS`, `FOUR_TYPES`, `ERROR_ROWS`, `THREE_ACTIVITIES` y `FOUR_FOODS`;
    - las precargas 350, 90, 220 y 130;
    - los textos en español;
    - rutas, cuerpos JSON, testIDs, clases y cifras de inventario.
  - Copy:
    - Todo sale de src/i18n/catalog.ts, con los literales de la tabla de R23 y en su orden. No traduces: copias la columna `en`.
    - No hay clave de kg (`'nutritionQuestionnaire.unitKg'` = 0).
    - La forma de los usos la manda requirements.md §R23 «Forma de los usos»:
      - cada clave sale una vez como `t('clave'` o `labelKey: 'clave'`, salvo `common.somethingWentWrong` y `nutritionQuestionnaire.other`, que salen dos veces;
      - las constantes con `labelKey` son `ACTIVITY_OPTIONS`, `BCS_ROWS`, `FOOD_TYPES` (con `note: { labelKey }`), `ALLERGIES`, `DISEASES`, `SAVE_ERRORS` y `GENERATING_ROWS`;
      - los mapas `ACTIVITY_LABEL` y `FOOD_LABEL` de Horario;
      - la CTA es el ternario literal `step === 'health' ? t('nutritionQuestionnaire.saveAndGenerate') : t('nutritionQuestionnaire.next')`.
    - `checkUses` solo ve `t('<clave>'` y `labelKey: '<clave>'` literales. Nunca `t(variable)` sobre una clave que no aparezca como `labelKey: '…'`.
  - Títulos de `it`: los nuevos llevan, literal, el título de requirements.md, que empieza por `#209 R<n>:`; con los dos puntos, `-t '#209 R1:'` no recoge `R10`–`R19`. Solo hay dos `describe` nuevos, los que fija la spec:
    - `describe('#209 R23: el cuestionario resuelve su copy por clave')`, al final de ui-language.test.ts, tras `describe('#208 R20: alta de vacuna')`;
    - `describe('#209 R25: Cuestionario sin deriva')`, en design-drift.test.ts, justo antes de `describe('#178 R13: Recordatorios sin deriva')`.
    En los demás ficheros existentes, los `it` nuevos van al final del fichero.
  - Regla mecánica de R24, para todo `it` viejo que tocas en R3, R22, R23 y R24:
    - la cifra nueva se escribe como base + delta;
    - `// #209 R<n>` va DELANTE de los comentarios que ya tiene la línea;
    - el sufijo ` (enmendado por #209 R<n>)` va una sola vez, al final del nombre del `it`, detrás de los sufijos que ya lleva.
    Hay dos excepciones firmadas, en las que el texto de requirements.md manda tal cual:
    - el `consumers` de chunky acaba en `// #201 R13 // #209 R24: sale screens/food/index.tsx, que entra por CTA_ROWS`;
    - el `rounded-16` de food en `#178 R13` queda `'screens/food/index.tsx': 2 + 1, // #200 R9 // #209 R24`.
  - Comentarios en producción: ninguno que cite `#209`, ni siquiera `#209 R<n>`, porque algunas guardas de hex cuentan cualquier `#` seguido de tres dígitos. En los tests, solo como `#209 R<n>`, nunca `#209` desnudo: el exento de `HEX_LITERAL` es solo `#NNN R<n>`.
  - Recetas de carta (R25):
    - Prohibidos `StyleSheet.create`, hex fuera de `src/theme/`, clases `[...]`, `text-accent` desnudo, `useThemeColor`, sombras legacy, emoji y dependencias vetadas (`expo-linear-gradient`, `expo-symbols`, `lottie-react-native`, `@rive-app`).
    - Nada de `@expo/ui/community/bottom-sheet` (`#218 R3`): esta feature no usa hojas.
    - Las guardas leen también index.test.tsx de algunas pantallas: no pongas `StyleSheet` en el test del cuestionario.
  - La forma de R25 manda sobre las cifras de R24: componentes locales, `.map` sobre constantes y ternarios con literales completos. Constrúyela así desde R5, no al final. Si una cifra de R24 no cuadra, PARA antes de cambiarla: la producción no sigue R25 o la spec está mal, y eso lo decide el leader.
  - Nombres y literales obligatorios (los buscan las filas de `CTA_ROWS`):
    - CTA del wizard: `testID="nutrition-questionnaire-next"`, `className` con `h-14 rounded-16 bg-accent`, `style={chunkyLip.primary}` tal cual, `isDisabled={!canContinue}` y `onPress={() => void handleNext()}`.
    - CTA de Nutrición: `testID="food-create-profile"`, `w-full h-14 rounded-16 bg-accent` y `onPress={openNutritionProfile}`.
    - Ninguna de las dos lleva `KEEP_OPACITY`.
  - Raíz del formulario: la etiqueta literal de requirements.md §R18, `<KeyboardAvoidingView testID="screen-nutrition-questionnaire" className="flex-1" behavior="padding" keyboardVerticalOffset={0}>`, y el `ScrollView` con `keyboardShouldPersistTaps="handled"`. Va desde R5: por eso R18 nace verde (ver «Nacen verdes»).
  - `react-hooks/purity` veta `Date.now()` y `new Date()` sin argumento en render. Si el lint marca algo, PARA y reporta.
  - Inventarios (R24, tasks.md §R24): las seis guardas de `src/__tests__/` que lista R24 se ponen rojas desde el primer `feat` que añade clases del wizard. Siguen rojas hasta el commit único de R24 (2), y esos rojos son los esperados (ver «Filas en vuelo»). No adelantes enmiendas de R24 a commits anteriores. layout.test.tsx se enmienda en R3, no en R24.
  - Sondas de mutación: ver «Sondas». Cada R lleva una mutación plantada en producción, vista en rojo y revertida, y no se commitea. Sin la sonda el candado no está probado: anótalo en el reporte.
  - TDD por requisito: test rojo que nombra el R-id, después el verde. Antes de cada commit de test, comprueba que los `it` nuevos fallan por la aserción, no por un import roto ni por una excepción de producción:
    - un «Unable to find» de RNTL vale como rojo;
    - las únicas excepciones son las de R1 y R2 (`… is not a function`), que tasks.md acepta.
    Los `it` que nacen verdes son la lista cerrada de «Nacen verdes» (abajo): el commit de test los lleva igual y el reporte usa la frase «nace verde: <motivo>». Cualquier otro `it` que pase en su commit (1), PARA y avisa.
  - UN COMMIT POR PASO como mínimo, test rojo antes que su implementación (C4 de CHECKPOINTS.md). Formas de tasks.md:
    - `test(mobile): #209 R<n> rojo` lleva solo el test;
    - `feat(mobile): #209 R<n> <qué>` lleva solo la producción;
    - el refactor, si lo hay, va en `refactor(mobile): #209 R<n> <qué>`.
    Nunca test y producción en el mismo commit, ni un commit para varios R-ids. Mensajes fijados:
    - `test(mobile): #209 R24 enmiendas de carta`;
    - `docs(ui): #209 R26 enmienda`;
    - `docs(mobile): #209 traceability and implementation report`.
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso. Nunca `git add -A` ni `commit -a`. El móvil no tiene prettier: no lo ejecutes.
  - Cada cadena de comandos termina en su línea `git commit -m`. Las cabeceras de sección van como comentario de shell (`# -- R1 test --`). Entrega líneas expandidas, sin macros `$'…'`.
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(mobile): #209 traceability and implementation report`, tras el último verde. No mezcles ficheros de arnés en los commits TDD. No rebasees tras rellenarlo.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker && bunx jest --runTestsByPath '<ruta>' --testTimeout=30000`. Antes, comprueba `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'`:
    - cada uno en su propio comando, y los dos deben salir vacíos;
    - otros worktrees corren jest en esta máquina: si no están vacíos, espera y vuelve a mirar;
    - nunca mates sus procesos, y nunca esperes e `init.sh` en el mismo comando.
    El posicional sin `--runTestsByPath` es regex y sale 0 sin correr nada: las rutas van siempre con `--runTestsByPath` y entre comillas. Un timeout aislado se mide sin flag antes de tocar nada.
  - Tipos: antes de cada `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts` desde mobile-pet-tracker/. Si existe, PARA; nunca `rm -f`. tsc solo tras un `feat`: los commits rojos de R1 y R2 importan símbolos que aún no existen.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-209.log 2>&1 && test ! -s ../progress/lint-209.log`. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`.
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-nutrition-questionnaire.md.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación se corrige y se anota en el reporte: ENOENT sobre una ruta, o `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla de la spec no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.
  - Flakes de carga conocidos: `#199 R18` (timeouts), Nutrición `#200 R9`/`#200 R10` (src/screens/food), Inicio `#152 R8` y Salud `#168 R2`.
    - Rojo en la suite completa y verde aislado: es carga. Anota el rojo y el verde aislado y sigue.
    - Rojo aislado: PARA.
    Ojo: `#200 R9`/`R10` están en un fichero que tocas (src/screens/food/index.test.tsx); la regla es la misma. Cualquier otro rojo de tu alcance o de un candado, PARA.

Anclas de la base (T0) y de llegada. Córrelas tal cual desde /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker antes del primer test, con la cifra `base → después`, y pega la salida en el reporte:
  - La base la midió el leader en H0 y todas coinciden.
  - Las de ficheros nuevos dan `No such file or directory` en T0, y es lo esperado.
  - Ante cualquier otra diferencia con la base, PARA.
  - Al cierre, las mismas dan la cifra «después».
  - Un `grep -c` cuenta líneas, no apariciones.
  grep -cF -- 'export async function putJson' src/api/http.ts   # R1: 0 → 1
  grep -cF -- 'name="nutrition-profile"' src/app/_layout.tsx   # R3: 0 → 1
  grep -cF -- 'name="edit-profile"' src/app/_layout.tsx   # R3: 1 → 1
  grep -cF -- 'toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 1 → 0
  grep -cF -- 'toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 0 → 1
  grep -cF -- 'toHaveLength(9 + 1 + 1 + 1 + 1 + 1 + 1); // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 1 → 0
  grep -cF -- 'toHaveLength(9 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 0 → 1
  grep -cF -- 'toHaveLength(10 + 1 + 1 + 1 + 1 + 1); // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 1 → 0
  grep -cF -- 'toHaveLength(10 + 1 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 0 → 1
  grep -cF -- 'toHaveLength(11 + 1 + 1 + 1 + 1); // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 1 → 0
  grep -cF -- 'toHaveLength(11 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 0 → 1
  grep -cF -- 'Children.toArray(group.props.children).at(-1);' src/app/__tests__/layout.test.tsx   # R3: 1 → 0
  grep -cF -- 'Children.toArray(group.props.children).at(-1 - 1); // #209 R3' src/app/__tests__/layout.test.tsx   # R3: 0 → 1
  grep -cF -- "it('#194 R4: edit-profile es la última pantalla protegida (enmendado por #209 R3)', async () => {" src/app/__tests__/layout.test.tsx   # R3: 0 → 1
  grep -cF -- '(enmendado por #208 R4) (enmendado por #209 R3)' src/app/__tests__/layout.test.tsx   # R3: 0 → 4
  grep -cF -- '(enmendado por #209 R3)' src/app/__tests__/layout.test.tsx   # R3: 0 → 5
  grep -cF -- '+ 26, // #208 R19' src/providers/__tests__/language-provider.test.tsx   # R23: 1 → 0
  grep -cF -- '+ 26 // #208 R19' src/providers/__tests__/language-provider.test.tsx   # R23: 0 → 1
  grep -cF -- '+ 77, // #209 R23' src/providers/__tests__/language-provider.test.tsx   # R23: 0 → 1
  grep -cF -- '+ 5 - 2, // #220 R16' src/providers/__tests__/language-provider.test.tsx   # R23: 0 → 0
  grep -cF -- '(enmendado por #208 R19) (enmendado por #209 R23)' src/providers/__tests__/language-provider.test.tsx   # R23: 0 → 1
  grep -cF -- "'nutritionQuestionnaire." src/i18n/catalog.ts   # R23: 0 → 154
  grep -cF -- "'nutritionQuestionnaire.unitKg'" src/i18n/catalog.ts   # R23: 0 → 0
  grep -cF -- "'dateField." src/i18n/catalog.ts   # R23: 10 → 10
  grep -cF -- "'welcome.pingoGreeting'" src/i18n/catalog.ts   # R23: 2 → 2
  grep -cF -- 'R20_NUTRITION_QUESTIONNAIRE' src/__tests__/ui-copy-table.ts   # R23: 0 → 3
  grep -cF -- '...R19_VACCINE_CREATE,' src/__tests__/ui-copy-table.ts   # R23: 1 → 1
  grep -cF -- 'R19_VACCINE_CREATE, R20_NUTRITION_QUESTIONNAIRE,' src/__tests__/ui-copy-table.ts   # R23: 0 → 1
  grep -cF -- '(enmendado por #208 R20) (enmendado por #209 R23)' src/__tests__/ui-copy-table.ts   # R23: 0 → 1
  grep -cF -- 'R20_NUTRITION_QUESTIONNAIRE' src/__tests__/ui-language.test.ts   # R23: 0 → 3
  grep -cF -- '+ 1 // #208 R20: screens/vaccine-create/index.tsx' src/__tests__/ui-language.test.ts   # R23: 1 → 1
  grep -cF -- '+ 1 // #209 R23: screens/nutrition-questionnaire/index.tsx' src/__tests__/ui-language.test.ts   # R23: 0 → 1
  grep -cF -- '(enmendado por #208 R20) (enmendado por #209 R23)' src/__tests__/ui-language.test.ts   # R23: 0 → 1
  grep -cF -- "'Alimento dry 350 kcal/100 g'" src/screens/meal-schedule/index.test.tsx   # R22: 3 → 0
  grep -cF -- "'Actividad medium'" src/screens/meal-schedule/index.test.tsx   # R22: 3 → 0
  grep -cF -- "'Activity medium'" src/screens/meal-schedule/index.test.tsx   # R22: 1 → 0
  grep -cF -- "'Food dry 350 kcal/100 g'" src/screens/meal-schedule/index.test.tsx   # R22: 1 → 0
  grep -cF -- '(enmendado por #209 R22)' src/screens/meal-schedule/index.test.tsx   # R22: 0 → 4
  grep -cF -- 'toHaveLength(16 + 1 + 1 + 1 + 1 + 1); // #208 R21 // #194 R6 // #191 R11 // #201 R13' src/__tests__/consistency-classnames.test.ts   # R24 #62 R1: 1 → 0
  grep -cF -- 'toHaveLength(16 + 1 + 1 + 1 + 1 + 1 + 2); // #209 R24 // #208 R21 // #194 R6 // #191 R11 // #201 R13' src/__tests__/consistency-classnames.test.ts   # R24 #62 R1: 0 → 1
  grep -cF -- 'expect(textInputs).toHaveLength(6 + 1 + 3); // #208 R21' src/__tests__/consistency-classnames.test.ts   # R24 #62 R12: 1 → 0
  grep -cF -- 'expect(textInputs).toHaveLength(6 + 1 + 3 + 2); // #209 R24 // #208 R21' src/__tests__/consistency-classnames.test.ts   # R24 #62 R12: 0 → 1
  grep -cF -- "[join('screens', 'nutrition-questionnaire', 'index.tsx'), 6], // #209 R24" src/__tests__/consistency-classnames.test.ts   # R24 #62 R14: 0 → 1
  grep -cF -- "[join('screens', 'reset-password', 'index.tsx'), 1], // #205 R13" src/__tests__/consistency-classnames.test.ts   # R24: 1 → 1
  grep -cF -- '+ 2 + 7 // #208 R21' src/__tests__/consistency-classnames.test.ts   # R24: 2 → 2
  grep -cF -- '+ 6 // #209 R24' src/__tests__/consistency-classnames.test.ts   # R24 #62 R14 y #98 R10: 0 → 2
  grep -cF -- '+ 1 - 1 - 2 // #220 R4; #220 R14; #220 R15' src/__tests__/consistency-classnames.test.ts   # R24: 2 → 2
  grep -cF -- "'screens/food/index.tsx': 1, // #209 R24" src/__tests__/consistency-classnames.test.ts   # R24 #166 R2: 0 → 1
  grep -cF -- "'screens/nutrition-questionnaire/index.tsx': 1, // #209 R24" src/__tests__/consistency-classnames.test.ts   # R24 #166 R2: 0 → 1
  grep -cF -- 'toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 5); // #209 R24 // #189 R13' src/__tests__/consistency-classnames.test.ts   # R24 #166 R3: 0 → 1
  grep -cF -- "literalId('nutrition-questionnaire-next'), 'h-14 rounded-16 bg-accent', ['isDisabled={!canContinue}', 'onPress={() => void handleNext()}']], // #209 R24" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 CTA_ROWS: 0 → 1
  grep -cF -- "literalId('food-create-profile'), 'w-full h-14 rounded-16 bg-accent', ['onPress={openNutritionProfile}']], // #209 R24" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 CTA_ROWS: 0 → 1
  grep -cF -- "'screens/food/index.tsx', 'screens/profile/index.tsx', 'screens/map/index.tsx'].sort(); // #201 R13" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 consumers: 1 → 0
  grep -cF -- '].sort(); // #201 R13 // #209 R24: sale screens/food/index.tsx, que entra por CTA_ROWS' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 consumers: 0 → 1
  grep -cF -- "'screens/food/index.tsx': 2 + 1, // #209 R24" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 radii: 0 → 1
  grep -cF -- "'screens/nutrition-questionnaire/index.tsx': 2, // #209 R24" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 radii: 0 → 1
  grep -cF -- 'toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 2); // #209 R24 // #200 R5' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 #177 R6.2 text-17: 0 → 1
  grep -cF -- 'toBe(5 + 11 + 1 + 1 - 1 - 1 + 1 + 1 + 2); // #209 R24 // #194 R6' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 #177 R6.2 etiqueta: 0 → 1
  grep -cF -- 'toBe(10 + 1 + 1 + 5); // #209 R24 // #189 R13' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 #177 R7.1: 0 → 1
  grep -cF -- 'toBe(26 + 1 + 1 + 1 + 2 + 2 + 1 + 1 + 1 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 3); // #209 R24 // #204 R9' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 #177 R7.3: 0 → 1
  grep -cF -- "toEqual({ 'screens/alerts/index.tsx': 1, 'screens/meal-schedule/index.tsx': 1 + 2 }); // #209 R24" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 #177 R7.5: 0 → 1
  grep -cF -- "'screens/food/index.tsx': 2 + 1, // #200 R9 // #209 R24" src/__tests__/design-drift.test.ts   # R24 #178 R13: 0 → 1
  grep -cF -- "'screens/nutrition-questionnaire/index.tsx': 2, // #209 R24" src/__tests__/design-drift.test.ts   # R24 #178 R13: 0 → 1
  grep -cF -- "join('screens', 'nutrition-questionnaire', 'index.tsx'), // #209 R24" src/__tests__/design-drift.test.ts   # R24 #178 R13 rounded-14: 0 → 1
  grep -cF -- "'screens/nutrition-questionnaire/index.tsx', // #209 R24" src/__tests__/design-drift.test.ts   # R24 #179 R13 text-17: 0 → 1
  grep -cF -- 'expect(schedule.match(/hitSlop=\{TOUCH_SLOP\}/g)).toHaveLength(1 + 2); // #209 R24' src/__tests__/design-drift.test.ts   # R24 #179 R13: 0 → 1
  grep -cF -- "['<Text className=\"text-13 font-extrabold text-foreground\">', 2 + 2], // #209 R24" src/__tests__/design-drift.test.ts   # R24 #179 R13 etiquetas: 0 → 1
  grep -cF -- 'expect(schedule.split(label)).toHaveLength(parts);' src/__tests__/design-drift.test.ts   # R24 #179 R13 etiquetas: 0 → 1
  grep -cF -- 'expect(schedule.split(label)).toHaveLength(2);' src/__tests__/design-drift.test.ts   # R24 #179 R13 etiquetas: 1 → 0
  grep -cF -- '#209 R25' src/__tests__/design-drift.test.ts   # R25: 0 → 4
  grep -cF -- "[join('screens', 'nutrition-questionnaire', 'index.tsx'), 1], // #209 R24" src/__tests__/legibility-classnames.test.ts   # R24 #61 R4: 0 → 1
  grep -cF -- '+ 1, // #198 R4: +1 Inicio' src/__tests__/legibility-classnames.test.ts   # R24 #61 R4: 1 → 0
  grep -cF -- '+ 1 // #198 R4: +1 Inicio' src/__tests__/legibility-classnames.test.ts   # R24 #61 R4: 0 → 1
  grep -cF -- '+ 1, // #209 R24' src/__tests__/legibility-classnames.test.ts   # R24 #61 R4: 0 → 1
  grep -cF -- "'screens/meal-schedule/index.tsx', 'screens/nutrition-questionnaire/index.tsx'], // #179 R6; #174 R12; #209 R24" src/__tests__/alerts-canvas-fidelity.test.ts   # R24 #174 R12 rounded-10: 0 → 1
  grep -cF -- "'screens/nutrition-questionnaire/index.tsx', // #209 R24" src/__tests__/alerts-canvas-fidelity.test.ts   # R24 #174 R12 text-15 y tracking-title: 0 → 2
  grep -cF -- "'screens/nutrition-questionnaire/index.tsx', // #209 R24" src/__tests__/profile-canvas-fidelity.test.ts   # R24 #173 R2 y R2.4: 0 → 2
  grep -cF -- '#209 R24' src/__tests__/consistency-classnames.test.ts   # R24: 0 → ≥ 8 (sube uno por cada `it` con sufijo)
  grep -cF -- '#209 R24' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24: 0 → ≥ 10
  grep -cF -- '#209 R24' src/__tests__/design-drift.test.ts   # R24: 0 → ≥ 7
  grep -cF -- '#209 R24' src/__tests__/legibility-classnames.test.ts   # R24: 0 → ≥ 2
  grep -cF -- '#209 R24' src/__tests__/alerts-canvas-fidelity.test.ts   # R24: 0 → ≥ 3
  grep -cF -- '#209 R24' src/__tests__/profile-canvas-fidelity.test.ts   # R24: 0 → ≥ 2
  grep -cF -- '## Enmienda #209' ../docs/ui-guidelines.md   # R26: 0 → 1
  grep -cE -- '- \[[ xX]\] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md   # R26: 0 → 1
  Las cifras «≥» de R24 son mínimos de la spec. En el reporte da la cifra real y la lista de `it` con ` (enmendado por #209 R24)`, que debe ser la de los `it` que nombran las tablas de R24.

Base de tests (T0): mídela tú, una sola vez, tras las anclas y antes del primer test.
  1. Comprueba `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'`, cada uno en su propio comando. Los dos deben salir vacíos.
  2. Corre los tres comandos de abajo desde /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker, sin pipe. Cada uno sale exit 0 salvo flakes conocidos.
  # -- T0 guardas -- (comando de requirements.md §R24; base derivada por la spec)
  timeout 580 bunx jest src/__tests__ src/app/__tests__/layout.test.tsx > ../progress/t0-guards-209.log 2>&1; echo exit=$?
    Esperado: exit=0, `Test Suites: 37 passed, 37 total` y `Tests: 965 passed, 965 total`. Por suite, si hace falta diagnosticar: chunky 84, consistency 81 y design-drift 115.
  # -- T0 ampliado -- (comando de requirements.md §R24 y tasks.md §R24 (2b))
  timeout 580 bunx jest src/__tests__ src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/meal-schedule src/screens/food > ../progress/t0-ext-209.log 2>&1; echo exit=$?
    Esperado: exit=0, 40 suites y `Tests: 1200 passed, 1200 total`. Es una cifra derivada por el leader: 1232 finales menos los 32 `it` nuevos que caen en ese alcance (11 de guardas, 5 de Nutrición y 16 de Horario).
  # -- T0 completa --
  bun run test > ../progress/full-209-t0.log 2>&1; echo exit=$?
    Anota la línea `Tests:` y la de `Test Suites:`. Es la base de la corrida final.
  Si la cifra de T0 guardas o la de T0 ampliado no coincide, PARA y reporta las dos líneas `Tests:`. Los demás `.log` de T0 se quedan en progress/, y git los ignora.

Cadena (tasks.md manda en el contenido de cada paso; aquí van los ficheros, las corridas y los mensajes). Reglas de toda la cadena:
  - Cada R es un par `# -- R<n> test --` / `# -- R<n> feat --`, más un `refactor` opcional con todo verde.
  - Tras cada commit, corre los ficheros del paso con la forma de «Jest de un fichero», con los dos pgreps vacíos antes: `bunx jest --runTestsByPath '<ruta>' '<ruta>' … --testTimeout=30000` desde mobile-pet-tracker/. Pega su línea `Tests:`.
  - Rojo esperado en un (1): fallan todos los `it` nuevos del R, salvo los de «Nacen verdes». El resto de los ficheros corridos, en verde.
  - Verde en un (2): todos los `it` de los ficheros corridos en verde. Cualquier rojo, PARA, salvo «Flakes de carga conocidos».
  - Las seis guardas de R24 no se corren en los pasos de R4 a R22; sus rojos en vuelo se ven en la corrida r24pre.
  - Donde un paso no da `add:`, el (1) añade solo el fichero de test que tocó y el (2) solo el fichero de producción que tocó. Antes de `git add`, `git diff --name-only` debe listar solo esos ficheros.
  - Rutas del test del cuestionario: NQ = 'src/screens/nutrition-questionnaire/index.test.tsx' y NQP = src/screens/nutrition-questionnaire/index.tsx.

  # -- T0 -- Anclas, «Base de tests (T0)» y corrida completa t0. Sin commit.

  # -- R1 test -- En src/api/__tests__/nutrition.test.ts, al final, va `it('#209 R1: putJson envía PUT con cuerpo JSON y Bearer')`:
    - con la llamada `putJson(baseUrl, '/pets/pet-1/nutrition-profile', 'token-1', { a: 1 }, fetchFn)`;
    - con el `toHaveBeenCalledWith` literal de requirements.md §R1;
    - importando `putJson` de `../http`.
    Corre 'src/api/__tests__/nutrition.test.ts'. Rojo: ese `it`, con `putJson is not a function` (tasks.md: «Rojo porque putJson no existe»). Mensaje: `test(mobile): #209 R1 rojo`.
  # -- R1 feat -- `putJson` en src/api/http.ts, justo después de `patchJson`: es una copia suya con `method: 'PUT'`. Corre el mismo fichero. Mensaje: `feat(mobile): #209 R1 putJson`.

  # -- R2 test -- Los tres `it` R2 en el mismo fichero:
    - el de `ok`, que aserta la URL `profileEndpoint`;
    - `it.each` de status 400, 401, 403, 404 y 500;
    - sin red.
    Corre el mismo fichero. Rojo: los 7 tests, con `upsertNutritionProfile is not a function`. Mensaje: `test(mobile): #209 R2 rojo`.
  # -- R2 feat -- `NutritionProfileInput` en src/api/types.ts, y `UpsertNutritionProfileState` y `upsertNutritionProfile` en src/api/nutrition.ts, sobre `putJson` y con la firma y la tabla de R2. Corre el mismo fichero. Después `test ! -e .expo/types/router.d.ts` y `bunx tsc --noEmit`. add: src/api/types.ts src/api/nutrition.ts. Mensaje: `feat(mobile): #209 R2 upsertNutritionProfile`.

  # -- R3 test -- Un solo commit rojo con tres cambios:
    - NQ (nuevo), con solo `it('#209 R3: la ruta nutrition-profile es delgada y está en el Stack')`:
      - lee las dos fuentes con `readFileSync`;
      - su primera aserción es `expect(existsSync(<ruta de src/app/nutrition-profile.tsx>)).toBe(true)`, para que el rojo sea de aserción;
      - NO importa la pantalla.
    - En layout.test.tsx, `it('#209 R3: nutrition-profile es el último hijo protegido, justo tras edit-profile')`:
      - va justo detrás del `it('#194 R4: edit-profile es la última pantalla protegida…')`;
      - aserta `names.at(-1)` y el `indexOf` de requirements.md §R3.
    - Las cinco enmiendas de la tabla de R3, con las anclas de arriba. El `describe` de `#208 R4` no se toca.
    Corre NQ y 'src/app/__tests__/layout.test.tsx'. Rojo: 7 tests:
    - el de NQ;
    - el nuevo de layout;
    - los cuatro de cuentas, con `Expected length: 16` / `Received length: 15`;
    - el de `edit-profile`, con `.at(-1 - 1)`.
    add: NQ src/app/__tests__/layout.test.tsx. Mensaje: `test(mobile): #209 R3 rojo`.
  # -- R3 feat -- Tres cambios de producción:
    - src/app/nutrition-profile.tsx, con exactamente `export { NutritionQuestionnaireScreen as default } from '../screens/nutrition-questionnaire';`;
    - en src/app/_layout.tsx, `<Stack.Screen name="nutrition-profile" options={{ headerShown: false }} />` como último hijo de `Stack.Protected`, justo tras el de `edit-profile`;
    - NQP como esqueleto mínimo: `export function NutritionQuestionnaireScreen()` que devuelve `null`. Así R4 no nace verde.
    Corre los dos ficheros de R3. Después `test ! -e .expo/types/router.d.ts`, `bunx tsc --noEmit` y lint. add: src/app/nutrition-profile.tsx src/app/_layout.tsx src/screens/nutrition-questionnaire/index.tsx. Mensaje: `feat(mobile): #209 R3 ruta y Stack`.

  # -- R23 (catálogo) test -- Solo src/providers/__tests__/language-provider.test.tsx:
    - `+ 26, // #208 R19` pasa a `+ 26 // #208 R19`, sin coma, y debajo va `+ 77, // #209 R23`;
    - el sufijo ` (enmendado por #209 R23)` va al final del `it('#194 R1: mantiene la base más las claves de #68 …')`, el que acaba en `(enmendado por #208 R19)`. No va en el otro `#194 R1`, el de las claves de edición de perfil.
    Aquí no entran la tabla ni el `describe` de R23. Corre 'src/providers/__tests__/language-provider.test.tsx'. Rojo: `#194 R1`, con `Expected length: 561` / `Received length: 484` (tasks.md lo escribe al revés; jest imprime primero la esperada). Mensaje: `test(mobile): #209 R23 rojo (catálogo)`.
  # -- R23 (catálogo) feat -- Las 77 claves de la tabla de R23 en src/i18n/catalog.ts, en `en` y en `es`:
    - en cada bloque van al final, tras `'welcome.pingoGreeting'`, en el orden de la tabla;
    - `en` copia la columna `en` y `es` la columna `es`;
    - sin clave de kg.
    Corre 'src/providers/__tests__/language-provider.test.tsx' 'src/__tests__/ui-language.test.ts'. El segundo no se toca y debe seguir verde. Si un literal nuevo coincide con un literal entero de una pantalla existente, `#194 R5` cae y ese rojo no está previsto: PARA. Mensaje: `feat(mobile): #209 R23 claves del cuestionario`.

  # -- R4 test -- En NQ, el andamiaje de dobles (ver «Dobles del test del cuestionario») y los dos `it` R4. Corre NQ. Rojo: los dos `it` R4, mientras R3 sigue verde. Mensaje: `test(mobile): #209 R4 rojo`.
  # -- R4 feat -- En NQP:
    - `NutritionQuestionnaireScreen` lee `petId` con `useLocalSearchParams`;
    - lanza las consultas `petKeys.detail(petId)` y `nutritionKeys.profile(petId)`;
    - pinta `nutrition-questionnaire-skeleton` con `Skeleton` de HeroUI y sin `Spinner`;
    - pinta el error de carga con `t('common.somethingWentWrong')` y llama a `signOut()` en `unauthorized`;
    - monta `QuestionnaireForm` con `initial` por props, sin `useEffect`.
    Corre NQ. Mensaje: `feat(mobile): #209 R4 carga`.

  # -- R5 test -- `it('#209 R5: pinta cabecera, contador «1 de 4» y la barra con un segmento hecho')`. Corre NQ. Mensaje: `test(mobile): #209 R5 rojo`.
  # -- R5 feat -- Seis piezas en NQP:
    - `ScreenHeader` con `testID="nutrition-questionnaire"`, `size={24}` y el accesorio `nutrition-questionnaire-step-label` con `addPet.stepProgress`;
    - `nutrition-questionnaire-step-bar`, con 4 segmentos;
    - la burbuja `nutrition-questionnaire-bubble`;
    - la raíz KAV literal de R18 y el `ScrollView` con `key={step}` y `keyboardShouldPersistTaps="handled"`;
    - el pie con la CTA única de «Nombres y literales obligatorios», con `canContinue` en `false` y `handleNext` sin efecto hasta R7 y R8;
    - todo con la forma de R25.
    Corre NQ. Mensaje: `feat(mobile): #209 R5 cabecera, contador y barra`.

  # -- R7 test -- Los dos `it` R7, con los literales a mano. Corre NQ. Mensaje: `test(mobile): #209 R7 rojo`.
  # -- R7 feat -- Las tarjetas de `ACTIVITY_OPTIONS` (con `labelKey`), el radio y `canContinue` en Actividad. Siguiente todavía no navega. Corre NQ. Mensaje: `feat(mobile): #209 R7 actividad`.

  # -- R8 test -- `NINE_ROWS`, escrita a mano con 9 filas, el `it.each` y `#209 R8: Siguiente está desactivado hasta elegir condición`. Corre NQ. Mensaje: `test(mobile): #209 R8 rojo`.
  # -- R8 feat -- Las filas `BCS_ROWS` y los badges con banda. `handleNext` pasa de Actividad a Condición. Corre NQ. Mensaje: `feat(mobile): #209 R8 condición`.

  # -- R9 test -- El `it.each([[1, 'Alimento'], [6, 'Alimento'], [7, 'Peso objetivo'], [9, 'Peso objetivo']])`. Corre NQ. Mensaje: `test(mobile): #209 R9 rojo`.
  # -- R9 feat -- `nextStep` completo y `stepNumber`. Cada destino pinta su título. `canContinue` es `true` en Peso objetivo y Alimento hasta R10 y R12. Corre NQ. Después tsc y lint. Mensaje: `feat(mobile): #209 R9 rama de condición`.

  # -- R6 test -- Los dos `it` R6. Corre NQ. Mensaje: `test(mobile): #209 R6 rojo`.
  # -- R6 feat -- `prevStep` y `usePreventRemove(phase === 'form' && step !== 'activity', () => setStep(prevStep(step)))`. `nutrition-questionnaire-back` retrocede, y en Actividad sale con `router.back()`. Corre NQ. Mensaje: `feat(mobile): #209 R6 volver entre pasos`.

  # -- R10 test -- Los cuatro `it` R10, con el `it.each` de cinco filas. Corre NQ. Mensaje: `test(mobile): #209 R10 rojo`.
  # -- R10 feat -- El resumen `rounded-16`, Cambiar (`text-accent-strong`), el campo, el peso actual, la nota y la validación. Corre NQ. Mensaje: `feat(mobile): #209 R10 peso objetivo`.

  # -- R11 test -- `FOUR_TYPES`, escrita a mano con 4 filas, y los dos `it` R11. Corre NQ. Mensaje: `test(mobile): #209 R11 rojo`.
  # -- R11 feat -- Chips de `FOOD_TYPES` (receta de `OptionalChip`, sin labio), campo kcal, precarga y nota por tipo. Corre NQ. Mensaje: `feat(mobile): #209 R11 alimento y precargas`.

  # -- R12 test -- `it.each([['79', true], ['80', false], ['600', false], ['601', true], ['', true]])`. Corre NQ. Mensaje: `test(mobile): #209 R12 rojo`.
  # -- R12 feat -- La validación entera de 80 a 600. Corre NQ. Mensaje: `feat(mobile): #209 R12 cotas de kcal`.

  # -- R13 test -- Los `it` R13, con el `it.each(['allergy', 'disease'])`. Corre NQ. Mensaje: `test(mobile): #209 R13 rojo`.
  # -- R13 feat -- Las listas `ALLERGIES` y `DISEASES`, el campo «Otra» (`OtherField`) y el contador. Los chips usan la receta de chip elegido de la regla 13: `rounded-full bg-accent` y `style={isChecked ? chunkyLip.primaryCompact : undefined}`. Corre NQ. Mensaje: `feat(mobile): #209 R13 salud y otra`.

  # -- R14 test -- Los seis `it` R14. Asertan el `JSON.parse` del `body` de la llamada PUT del doble de `fetch`, incluida la ausencia de claves con `not.toHaveProperty`. Corre NQ. Mensaje: `test(mobile): #209 R14 rojo`.
  # -- R14 feat -- `buildInput(form)`, función pura del mismo fichero. La CTA de Salud pone `phase = 'saving'` y llama a `upsertNutritionProfile` con la firma de R2 y `buildInput(form)`. Corre NQ. Mensaje: `feat(mobile): #209 R14 cuerpo del PUT`.

  # -- R15 test -- Los tres `it` R15. El de `bodyCondition null` llega a Condición con la actividad precargada y sin pulsar ninguna tarjeta. Corre NQ. Mensaje: `test(mobile): #209 R15 rojo`.
  # -- R15 feat -- `initialFromProfile(profile, labels)`, pura. Corre NQ. Mensaje: `feat(mobile): #209 R15 modo edición`.

  # -- R16 test -- Los cuatro `it` R16, con promesas de `fetch` a mano y sin timers. El de «PUT en vuelo» aserta además los dos anillos. Corre NQ. Mensaje: `test(mobile): #209 R16 rojo`.
  # -- R16 feat -- `phase`, `CuestionarioGenerando` (dos `PingRing` con `MOTION_PING_TIMING`, ninguno con movimiento reducido, y `PingoFloat`), las dos invalidaciones y `router.back()`. Corre NQ. Mensaje: `feat(mobile): #209 R16 generando`.

  # -- R17 test -- `ERROR_ROWS`, con una fila por cada fila de la tabla de R17 (9) y el texto en español literal, y el `it.each`. Corre NQ. Mensaje: `test(mobile): #209 R17 rojo`.
  # -- R17 feat -- La traducción de resultados con `SAVE_ERRORS`, copiada del `switch` de `handleGenerate` de Horario sin extraerla, y la vuelta a Salud con las respuestas intactas. Corre NQ. Mensaje: `feat(mobile): #209 R17 errores`.

  # -- R18 test -- `it('#209 R18: la raíz es un KAV con behavior padding y el scroll persiste taps')`. Corre NQ. Nace verde, porque R5 ya dejó la raíz así: declara «nace verde» y haz el commit del test solo (tasks.md §R18). Si sale rojo, haz el `feat` de R18 con la raíz literal. Después tsc y lint. Mensaje: `test(mobile): #209 R18 teclado`.

  # -- R19 test -- En src/screens/food/index.test.tsx:
    - la factoría de `jest.mock('../../api/nutrition', …)` gana `getNutritionProfile: jest.fn()`;
    - el `beforeEach` de nivel superior le da un `ok` por defecto con un perfil literal escrito a mano. Así los `it` existentes, con el plan en 404, siguen pintando el vacío actual;
    - van los `it` R19 al final del fichero.
    Corre 'src/screens/food/index.test.tsx'. Rojo: `#209 R19: owner sin perfil ve Crear perfil nutricional y navega al cuestionario`. Nacen verdes los tres de roles y el de «owner con perfil y sin plan». Mensaje: `test(mobile): #209 R19 rojo`.
  # -- R19 feat -- La consulta `nutritionKeys.profile(activePetId)` con `enabled` según design.md §Nutrición y `food-profile-empty` en línea, sin `EmptyState`. La CTA `food-create-profile` lleva `openNutritionProfile`, que hace `router.push({ pathname: '/nutrition-profile', params: { petId } })`. Corre el mismo fichero. Mensaje: `feat(mobile): #209 R19 entrada en Nutrición`.

  # -- R20 test -- Los `it` R20 en src/screens/meal-schedule/index.test.tsx. Corre 'src/screens/meal-schedule/index.test.tsx'. Rojo: los dos de owner. Nacen verdes los tres de roles. Mensaje: `test(mobile): #209 R20 rojo`.
  # -- R20 feat -- `nutrition-profile-edit` y `nutrition-profile-create`, solo con `isOwner`:
    - no son `Button`: son el `Pressable` literal de requirements.md §R25 «Enlaces de Horario», `<Pressable testID="nutrition-profile-edit" hitSlop={TOUCH_SLOP} className="h-9 flex-row items-center justify-center rounded-xl border-2 border-lip-gray bg-surface px-3" style={chunkyLip.neutralCompact} onPress={openNutritionProfile}>`, y lo mismo con `testID="nutrition-profile-create"`;
    - `openNutritionProfile` es local a Horario y hace el mismo `router.push` que en Nutrición;
    - la etiqueta es `<Text className="text-13 font-extrabold text-foreground">`;
    - «Editar perfil» pinta `t('profile.editProfile')` con `accessibilityLabel={t('nutritionQuestionnaire.editProfileLabel')}`.
    Corre el mismo fichero. Mensaje: `feat(mobile): #209 R20 enlaces en Horario`.

  # -- R21 test -- Los `it` R21. Corre el fichero de Horario. Rojo: los tres de roles. Nace verde `#209 R21: owner ve Generar plan`. Mensaje: `test(mobile): #209 R21 rojo`.
  # -- R21 feat -- `generate-plan-button` envuelto en `isOwner`. Corre el fichero de Horario. Mensaje: `feat(mobile): #209 R21 generar plan solo owner`.

  # -- R22 test -- En un mismo commit rojo van los dos `it.each` R22 y las enmiendas de literales de los cuatro `it` existentes de la tabla «Tests existentes que R22 contradice», cada uno con su sufijo. Corre el fichero de Horario. Rojo: 7 filas nuevas y los cuatro enmendados (`Expected … Actividad Media` / `Received … Actividad medium`). Mensaje: `test(mobile): #209 R22 rojo`.
  # -- R22 feat -- Los mapas `ACTIVITY_LABEL` y `FOOD_LABEL`, locales a Horario, con la forma de R23. Corre el fichero de Horario. Después tsc y lint. Mensaje: `feat(mobile): #209 R22 píldoras en español`.

  # -- R23 (tabla) test -- Commit de test único. Nace verde, porque las claves y los usos ya existen. Lleva:
    - el bloque `R20_NUTRITION_QUESTIONNAIRE` de 96 filas en src/__tests__/ui-copy-table.ts: 82 del cuestionario, 4 de Nutrición y 10 de Horario;
    - su registro en `ALL_USES` (tras `...R19_VACCINE_CREATE,`) y en `blocks`;
    - el import en ui-language.test.ts, tras `  R19_VACCINE_CREATE,`;
    - `+ 1 // #209 R23: screens/nutrition-questionnaire/index.tsx`, justo después de `+ 1 // #208 R20: screens/vaccine-create/index.tsx`;
    - el sufijo ` (enmendado por #209 R23)` en los dos `it` `#194 R5`, detrás de `(enmendado por #208 R20)`;
    - el `describe` R23 nuevo, con `it('#209 R23: el bloque del cuestionario tiene 96 filas')`: `toHaveLength(96)` y `checkUses(R20_NUTRITION_QUESTIONNAIRE)`.
    `#158 R1` no se toca. Corre 'src/__tests__/ui-language.test.ts'. Si una fila no cuadra:
    - si es la fila del test la mal escrita, la corriges en el test;
    - si los usos de una pantalla difieren de requirements.md §R23 «Forma de los usos», la producción no sigue la spec: PARA.
    add: src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts. Mensaje: `test(mobile): #209 R23 tabla de copy`.

  # -- R24 (1) -- Corrida completa r24pre (ver «Corridas completas»). Lista en el reporte cada `it` rojo con su suite. Todos deben estar en «Filas en vuelo». Sin commit.
  # -- R24 (2) -- Las enmiendas mecánicas de requirements.md §R24 (tablas de las seis guardas), con las anclas de arriba. Va en un solo commit, que deja verdes las seis suites y layout. Corre:
    'src/__tests__/design-drift.test.ts' 'src/__tests__/consistency-classnames.test.ts' 'src/__tests__/chunky-cta-canvas-fidelity.test.ts' 'src/__tests__/legibility-classnames.test.ts' 'src/__tests__/alerts-canvas-fidelity.test.ts' 'src/__tests__/profile-canvas-fidelity.test.ts' 'src/app/__tests__/layout.test.tsx'
    Todo verde. add: los seis ficheros de guardas. Mensaje: `test(mobile): #209 R24 enmiendas de carta`.
  # -- R24 (2b) -- Con los dos pgreps vacíos, corre los comandos de T0 guardas y T0 ampliado, cambiando el log a `r24-guards-209.log` y `r24-ext-209.log`. Esperado:
    - guardas: exit=0, 37 suites y `Tests: 973 passed, 973 total`;
    - ampliado: exit=0, 40 suites y `Tests: 1229 passed, 1229 total`.
    Son 976 y 1232 de la spec menos los tres `it` de R25, que aún no existen. Si no cuadra, PARA. Sin commit.

  # -- R25 (1) -- En src/__tests__/design-drift.test.ts, el `describe('#209 R25: Cuestionario sin deriva')`:
    - va justo antes de `describe('#178 R13: Recordatorios sin deriva')`;
    - lleva `const featureFiles = ['screens/nutrition-questionnaire/index.tsx']`;
    - lleva los tres `it` de requirements.md §R24, con `MEALS_BAR_STYLE_ESCAPES`, `/text-accent(?![-\w])/` y la regex de dependencias.
    Corre 'src/__tests__/design-drift.test.ts'. Lo previsto es que nazca verde, porque el wizard sigue R25 desde R5. Entonces declara «nace verde» y haz el commit del test solo, con mensaje `test(mobile): #209 R25 recetas de carta`.
    Si sale rojo:
    - el mensaje es `test(mobile): #209 R25 rojo`;
    - sigue R25 (2) `feat(mobile): #209 R25 recetas de carta`, que ajusta las clases;
    - si ese ajuste mueve una cifra de R24, PARA.
    Después:
    - guardas: `Tests: 976 passed, 976 total` (37 suites);
    - ampliado: `Tests: 1232 passed, 1232 total` (40 suites);
    - tsc y lint.

  # -- R26 -- Primero `grep -cF '## Enmienda #209' ../docs/ui-guidelines.md` = 0. Añade al final de ../docs/ui-guidelines.md la sección literal de requirements.md §R26:
    - el título `## Enmienda #209 — Cuestionario de nutrición`;
    - tres viñetas;
    - una línea en blanco;
    - la casilla `- [ ] Enmienda #209 aprobada por humano`, SIN marcar. La marca el humano.
    Anclas de R26 de arriba. add: ../docs/ui-guidelines.md. Mensaje: `docs(ui): #209 R26 enmienda`.

  # -- Cierre -- Ver «Cierre».

Nacen verdes. Lista cerrada. Cada uno va en el reporte con «nace verde: <motivo>» y su sonda (ver «Sondas»), que lo pone rojo:
  Seguros:
  - `#209 R19: %s sin perfil ve el vacío actual` × 3 (family, walker, vet): la producción ya pinta el vacío a todos.
  - `#209 R19: owner con perfil y sin plan ve el vacío actual`: ídem.
  - `#209 R20: %s no ve enlaces de perfil` × 3: los enlaces no existen.
  - `#209 R21: owner ve Generar plan`: el botón ya se pinta a todos.
  - `#209 R23: el bloque del cuestionario tiene 96 filas`: el catálogo y los usos ya existen.
  Previstos, porque R5 ya construye la raíz y la forma de R25:
  - `#209 R18: la raíz es un KAV con behavior padding y el scroll persiste taps`.
  - Los tres `it` `#209 R25:`.
  Pueden nacer verdes o rojos, porque depende de cómo dejó el paso anterior la CTA del paso; los dos resultados valen:
  - R10, filas `''` y `'10,5'`;
  - R12, filas `'80'`, `'600'` y `''`.
  Cualquier otro `it` que pase en su (1), PARA.

Filas en vuelo. Las seis guardas de R24 no se corren hasta R24 (1), así que entre R5 (2) y R24 (2) sus rojos solo se ven en la corrida r24pre. En r24pre, el rojo permitido es exactamente este:
  - los `it` de consistency-classnames, chunky-cta-canvas-fidelity, design-drift, legibility-classnames, alerts-canvas-fidelity y profile-canvas-fidelity que enmiendan las tablas de R24;
  - en chunky, además, `#177 R3.3`, `R7.2`, `R7.4` y `R8.1`, que se ponen verdes con las filas de `CTA_ROWS` y el cambio de `consumers`;
  - flakes conocidos con verde aislado.
  Es un máximo: un `it` de la lista que siga verde no es parada, anótalo.
  Todo lo demás debe estar verde en r24pre: layout (enmendado en R3), language-provider (R23 catálogo), ui-language (R23 tabla), Horario (R22), detail-stack.guard, sheet-surface-background y jest-virtual-mock-lock. Un rojo fuera de la lista, PARA y anótalo con nombre, cifra base y cifra que da.

Corridas completas. Cada una sin pipe, desde /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker y con los dos pgreps vacíos antes:
  - t0: `bun run test > ../progress/full-209-t0.log 2>&1; echo exit=$?` (en T0).
  - r24pre: `bun run test > ../progress/full-209-r24pre.log 2>&1; echo exit=$?` (en R24 (1)). Exit 1 esperado, con solo los rojos de «Filas en vuelo».
  - final: `bun run test > ../progress/final-test-209.log 2>&1; echo exit=$?` (tras R26). exit=0, o 1 solo por flakes conocidos con verde aislado.
  En cada una:
  - `grep -c SIGKILL <log>` y `grep -c 'failed to run' <log>` deben dar 0. Si no, la cuenta no vale: repite la corrida.
  - Pega en el reporte las líneas `Test Suites:` y `Tests:`.
  - Cifra del leader, no de la spec: el total de la final es el de t0 más 106 tests nuevos y 1 suite nueva. Desglose de los 106: NQ 66, nutrition API 8, layout 1, Nutrición 5, Horario 16, ui-language 1, chunky 4, consistency 1, legibility 1 y design-drift 3. Si no cuadra, no pares: da en el reporte el desglose real por fichero.

Sondas de mutación. Cada sonda va tras el `feat` (2) de su R y antes del `test` siguiente. Si el R nace verde, va tras su commit de test. Pasos:
  1. Planta la mutación en el fichero de producción.
  2. Corre el fichero de test del R y comprueba que el `it` indicado se pone rojo.
  3. `git checkout HEAD -- <fichero>`.
  4. `git diff --quiet HEAD -- <fichero>` y `git diff --cached --quiet`, los dos exit 0.
  Nunca se commitea una sonda. Si una sonda deja el `it` en verde, anótalo como «mutación verde» y PARA.
  - R1: `method: 'PATCH'` en `putJson` (http.ts). Rojo: `#209 R1:`.
  - R2: 403 se mapea a `error` (nutrition.ts). Rojo: la fila 403 de `#209 R2:`.
  - R3: el `Stack.Screen` de `nutrition-profile` antes de `edit-profile` (_layout.tsx). Rojo: el `it` nuevo de layout y el de `edit-profile`.
  - R4: el error de la mascota se trata como `ok` (NQP). Rojo: `#209 R4: si la mascota falla pinta el error de carga`.
  - R5: `<` en lugar de `<=` en el segmento hecho. Rojo: `#209 R5:`.
  - R6: Volver desde Alimento siempre a Condición. Rojo: `#209 R6: … condición 7 vuelve a Peso objetivo`.
  - R7: `canContinue` en `true` sin actividad. Rojo: `#209 R7: Siguiente está desactivado hasta elegir actividad`.
  - R8: la fila 6 con la banda de la 7. Rojo: la fila 6 de `#209 R8:`.
  - R9: `bcs > 7` en lugar de `>= 7`. Rojo: la fila 7 de `#209 R9:`.
  - R10: acepta 3 decimales. Rojo: la fila `'12,345'`.
  - R11: precarga de `wet` a 350. Rojo: la fila de `wet`.
  - R12: cota inferior 79. Rojo: la fila `'79'`.
  - R13: `pollo` y `carne-de-res` intercambiados en `ALLERGIES`. Rojo: `#209 R13: Salud pinta las dos listas…`.
  - R14: `targetWeightKg` enviado con condición < 7. Rojo: `#209 R14: condición 5 omite targetWeightKg…`.
  - R15: «Otra» no se rellena desde el perfil. Rojo: `#209 R15: «Pollo» marca su chip y «Maíz» rellena Otra`.
  - R16: solo se invalida el plan. Rojo: `#209 R16: generate ok invalida perfil y plan y vuelve atrás`.
  - R17: `forbidden` del PUT pinta el texto genérico. Rojo: su fila de `ERROR_ROWS`.
  - R18: `behavior="height"`. Rojo: `#209 R18:`.
  - R19: la CTA para cualquier rol (food/index.tsx). Rojo: las filas de roles de `#209 R19:`.
  - R20: los enlaces para cualquier rol (meal-schedule/index.tsx). Rojo: las filas de roles de `#209 R20:`.
  - R21: quitar el `isOwner` de `generate-plan-button`. Rojo: las filas de roles de `#209 R21:`.
  - R22: `wet` usa la clave de `dry`. Rojo: la fila de `wet` de `#209 R22: alimento`.
  - R23: quitar una clave del bloque `en` (catalog.ts). Rojo: `#194 R1` de language-provider. Corre también ui-language: anota qué `it` cae, el de R23 o el de consistencia entre idiomas.
  - R24: un `rounded-16` de más en NQP. Rojo: `#177 R7.3` de chunky. Corre la suite de chunky.
  - R25: un `StyleSheet.create` en NQP. Rojo: `#209 R25: no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas`.

Guardas que R1 a R26 cruzan. Córrelas antes del commit final y pega su salida:
  - Producción sin comentarios de la feature. Desde mobile-pet-tracker/, `grep -c '#209' src/api/http.ts src/api/types.ts src/api/nutrition.ts src/app/nutrition-profile.tsx src/app/_layout.tsx src/screens/nutrition-questionnaire/index.tsx src/screens/food/index.tsx src/screens/meal-schedule/index.tsx src/i18n/catalog.ts` da 0 en cada uno.
  - Tests sin `#209` desnudo. `grep -cP -- '#209(?! R[0-9])'` da 0 en cada fichero de test tocado.
  - Sin hojas. `grep -c '@expo/ui/community/bottom-sheet' src/screens/nutrition-questionnaire/index.tsx src/screens/food/index.tsx src/screens/meal-schedule/index.tsx` da 0 en cada uno.
  - Sin `StyleSheet` en el test. `grep -c 'StyleSheet' src/screens/nutrition-questionnaire/index.test.tsx` da 0.
  - Ficheros intactos: `cd /home/claude/sites/Pet-Tracker-wt-209 && git diff --quiet 001d5ed4..HEAD -- backend-pet-tracker init.sh init.config.sh feature_list.json STATUS.md progress/history.md progress/current.md mobile-pet-tracker/src/theme mobile-pet-tracker/src/components mobile-pet-tracker/src/hooks mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/test mobile-pet-tracker/src/__tests__/sheet-surface-background.test.ts mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx && echo intactos`.
  - Commits. `cd /home/claude/sites/Pet-Tracker-wt-209 && git log --oneline 001d5ed4..HEAD -- . ':!progress/handoff_mobile-nutrition-questionnaire.md'` lista solo tus commits, sin el del handoff.
  - Ficheros tocados. `cd /home/claude/sites/Pet-Tracker-wt-209 && git diff --name-only 001d5ed4..HEAD -- . ':!progress/handoff_mobile-nutrition-questionnaire.md'` debe dar exactamente estas 26 rutas, en este orden. Si sale otra o falta una, PARA:
    docs/ui-guidelines.md
    mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
    mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
    mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
    mobile-pet-tracker/src/__tests__/design-drift.test.ts
    mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
    mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
    mobile-pet-tracker/src/__tests__/ui-copy-table.ts
    mobile-pet-tracker/src/__tests__/ui-language.test.ts
    mobile-pet-tracker/src/api/__tests__/nutrition.test.ts
    mobile-pet-tracker/src/api/http.ts
    mobile-pet-tracker/src/api/nutrition.ts
    mobile-pet-tracker/src/api/types.ts
    mobile-pet-tracker/src/app/__tests__/layout.test.tsx
    mobile-pet-tracker/src/app/_layout.tsx
    mobile-pet-tracker/src/app/nutrition-profile.tsx
    mobile-pet-tracker/src/i18n/catalog.ts
    mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
    mobile-pet-tracker/src/screens/food/index.test.tsx
    mobile-pet-tracker/src/screens/food/index.tsx
    mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
    mobile-pet-tracker/src/screens/meal-schedule/index.tsx
    mobile-pet-tracker/src/screens/nutrition-questionnaire/index.test.tsx
    mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx
    progress/impl_mobile-nutrition-questionnaire.md
    specs/mobile-nutrition-questionnaire/traceability.md
    (las dos últimas entran con el commit final; antes de él son 24)
  - Árbol limpio con el chequeo acotado de «Árbol».
  - La casilla de R26 sin marcar: `grep -cF -- '- [ ] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md` = 1.

Cierre (tasks.md §Cierre). Lo que el reporte progress/impl_mobile-nutrition-questionnaire.md debe traer:
  - La salida del primer comando.
  - Skills cargadas y no encontradas.
  - T0: la salida de las anclas y las líneas `Tests:` de T0 guardas, T0 ampliado y t0 completa.
  - Tabla R-id → `it` (nombre completo) → hash rojo → hash verde (y refactor si lo hubo).
  - Por commit, la línea `Tests:` de los ficheros corridos.
  - Nacen verdes: cada uno con «nace verde: <motivo>».
  - R24 (1): la lista de `it` rojos de r24pre con su suite.
  - R24 (2b) y R25: las líneas `Tests:` de guardas y ampliado.
  - Sondas: por R, la mutación, el fichero, el `it` que cayó y la salida de los dos `git diff --quiet`.
  - Corridas completas: exit, `Test Suites:`, `Tests:`, cuentas de SIGKILL y de «failed to run», y los flakes con su verde aislado.
  - Anclas finales, la salida de «Guardas», y tsc y lint finales.
  - Errores de invocación corregidos y cualquier desviación. Lo previsto es que no haya ninguna.
  - El bloque «Smoke del humano», tal cual.
  Pasos finales, en este orden:
  1. Corrida final y «Guardas».
  2. Escribe el reporte.
  3. Rellena traceability.md: la columna de estado de cada R pasa de `pendiente` a sus hashes rojo y verde.
  4. `git add ../specs/mobile-nutrition-questionnaire/traceability.md ../progress/impl_mobile-nutrition-questionnaire.md` y `git commit -m 'docs(mobile): #209 traceability and implementation report'`.
  5. Chequeo de árbol limpio.
  6. Última acción: `cd /home/claude/sites/Pet-Tracker-wt-209 && printf '%s\n' progress/impl_mobile-nutrition-questionnaire.md > progress/impl_mobile-nutrition-questionnaire.done`. El `.done` no se commitea: git lo ignora.

Smoke del humano. Va en el reporte, tal cual. Lo corre el humano en el dev build Android (lote G4 de progress/smoke_mejoras-producto.md); tú no lo corres:
  - Nutrición, owner sin perfil: «Crear perfil nutricional» abre el cuestionario. Con otro rol, el vacío de siempre.
  - Horario, owner: «Editar perfil» con perfil y «Crear perfil nutricional» sin él. Con otro rol, ni enlaces ni «Generar plan».
  - Cuestionario:
    - los cuatro pasos y la rama de condición ≥ 7 a Peso objetivo;
    - Volver y el gesto del sistema retroceden un paso;
    - en Actividad, Volver sale.
  - Teclado: el KAV sube el pie y la CTA con el campo de peso, el de kcal y los dos «Otra».
  - Guardar y generar:
    - Generando pinta los dos anillos de ping, y ninguno con movimiento reducido activado;
    - el perfil se guarda;
    - el plan se genera y la pantalla vuelve atrás con el plan nuevo.
  - Errores: sin red, el error vuelve a Salud con las respuestas intactas.
  - en-US: el copy y las píldoras de Horario («Activity Medium», «Food Dry 350 kcal/100 g»).
  - Casillas del humano: la de smoke en dispositivo y `- [ ] Enmienda #209 aprobada por humano` de docs/ui-guidelines.md (R26).

## Adenda 1 (leader, tras la parada en T0 ampliado)

Paraste bien. Tu medida es la buena y la cifra del handoff estaba mal. El leader la derivó de la semilla de
ronda 2, que no tenía los 21 `it` nuevos de Horario (16) y Nutrición (5). El leader volvió a medir las tres
suites fuera de guardas sobre `21d43079`: `language-provider` 54, `meal-schedule` 80 y `food` 122. Suman 256,
y 965 + 256 = 1221.

Las cifras del T0 ampliado quedan así. Sustituyen a las del cuerpo; las de guardas no cambian:

- **T0 ampliado:** 40 suites y `Tests: 1221 passed, 1221 total`. Ya lo tienes medido, no lo repitas.
- **R24 (2b), ampliado:** 40 suites y `Tests: 1250 passed, 1250 total`. Es 1253 menos los tres `it` de R25.
- **Tras R25 y en la verificación final, ampliado:** `Tests: 1253 passed, 1253 total`.

La spec ya está corregida: `requirements.md` §R24 y `tasks.md` R24 (2b), errata ronda 4.

Retoma la cadena con la T0 completa (`bun run test > ../progress/full-209-t0.log`) y sigue desde ahí. Si en
R24 (2b) la cifra ampliada no da 1250, para y reporta las dos líneas `Tests:` y el recuento por suite de
`language-provider`, `meal-schedule` y `food` (con `--json`).

Flake conocido en `food`: `#200 R9: pulsar cada enlace navega como hoy (meals-history-link)`. Puede caer bajo
carga. Si cae solo ese `it`, repite la corrida una vez antes de parar.

**Base de las comprobaciones finales.** La errata va en `48346f15`, que toca `requirements.md` y `tasks.md`. En
las tres comprobaciones del Cierre («Ficheros intactos», «Commits» y «Ficheros tocados»), sustituye `001d5ed4`
por `48346f15`. La lista de 26 rutas no cambia.

## Adenda 2 (leader, tras la «mutación verde» de la sonda R8)

Paraste bien. La receta era del leader y estaba mal: en requirements.md §R8 las filas 6 y 7 son las dos
`amber`, así que cambiar la banda de la 6 por la de la 7 no cambia nada. El candado de R8 está bien; la sonda
no.

Sustituye la sonda R8 de «Sondas de mutación» por esta, y **solo** esta:

- R8: la fila 6 con la banda de la 8 (`rose`) en la producción del paso Condición. Rojo: la fila 6 de
  `#209 R8:`.

Pasos, los de siempre: planta la mutación, corre el fichero de test de R8, comprueba que la fila 6 se pone
roja, `git checkout HEAD --` del fichero, y `git diff --quiet HEAD -- <fichero>` y `git diff --cached --quiet`
con exit 0.

Después retoma la cadena en R9 (test). El resto de las sondas no cambia. Si otra sonda da «mutación verde»,
para igual que ahora.

Esta adenda es commit del leader con `#209` en el asunto, como la Adenda 1, y solo toca este fichero.

## Adenda 3 (leader, tras la parada en R21)

Paraste bien. La spec no listaba los 13 casos de Horario que R21 contradice. Ya los lista: requirements.md
§R21, tabla «Tests existentes que R21 contradice», y tasks.md R21, errata ronda 5. Léelas enteras antes de
seguir.

Lo que cambia en la cadena:

- **R21 test.** En el mismo commit rojo van los `it` R21 y las enmiendas de los seis `it` existentes de la
  tabla, cada uno con el sufijo ` (enmendado por #209 R21)`. Corre el fichero de Horario.
  - Rojos: los tres `#209 R21: %s no ve Generar plan` y `el familiar no ve ni Añadir ni Generar (enmendado
    por #209 R21)`.
  - Nace verde `#209 R21: owner ve Generar plan`, como ya decía el cuerpo.
  - Los otros cinco `it` enmendados (11 casos) pasan antes y después. No son `it` nuevos: no van en la lista
    de «Nacen verdes» ni disparan su PARA.
  - Anclas antes del commit, desde `mobile-pet-tracker/`, en `src/screens/meal-schedule/index.test.tsx`:
    `grep -cF '(enmendado por #209 R21)'` = 6 y `grep -cF 'el familiar solo ve Generar ocupando el ancho
    disponible'` = 0.
  - Mensaje: `test(mobile): #209 R21 rojo`.
- **R21 feat.** No basta con envolver `generate-plan-button`: `canGenerate` exige `isOwner`. Así, sin owner
  no se pintan `generate-plan-error` ni `meal-schedule-actions`. Corre el fichero de Horario: verde entero.
  Mensaje: `feat(mobile): #209 R21 generar plan solo owner`.
- **Sonda R21.** Sustituye a la del cuerpo: quitar el `isOwner` de `canGenerate`. Rojo: las filas de roles de
  `#209 R21:` y el `it` invertido del familiar. Pasos de siempre, y revierte.

Si sale otro rojo en Horario, PARA y reporta el nombre del `it` y su `Expected`/`Received`.

**Comprobaciones finales.** La errata ronda 5 va en un commit del leader que toca `requirements.md`,
`tasks.md` y este fichero. En «Commits» y «Ficheros tocados» del Cierre, con la base `48346f15` de la
Adenda 1, añade al final del comando tres exclusiones más:
`':!specs/mobile-nutrition-questionnaire/requirements.md' ':!specs/mobile-nutrition-questionnaire/tasks.md' ':!progress/current.md'`.
La lista de 26 rutas no cambia. En «Ficheros intactos», quita `progress/current.md` del comando: lo tocan dos
commits del leader, `b4f0d30f` (el fallback) y el que sigue a esta adenda. Que tú no lo tocas lo prueba
«Commits», que con estas exclusiones lista solo tus commits.

Retoma la cadena en R21 (test) y sigue hasta el commit final. El merge de `origin/dev` es del leader, después
del commit final: no lo hagas tú.

## Adenda 4 (leader, 2026-10-27, el merge de `dev` tras el commit final)

La cadena está cerrada en `da5e5eef`. Falta traer `dev`, que trae #212, #213, #214, #217 y #222, antes de la
revisión. La Adenda 3 decía que el merge era del leader, pero tiene 13 conflictos de código y el leader no
edita código de la aplicación. Lo haces tú. Esta adenda manda sobre todo lo anterior donde lo contradiga.

**0. Arreglo del reporte.** La primera línea de `progress/impl_mobile-nutrition-questionnaire.md` sigue
diciendo `Estado: PARA en R21 (test)…`. Al final de esta adenda pasa a ser `Estado: COMPLETO`, y el
`.done` lleva una línea con la fecha UTC y el estado, no la ruta. Ver el punto 6.

**1. Merge.** El leader ya hizo `git fetch`. Desde `/home/claude/sites/Pet-Tracker-wt-209`:
`git merge origin/dev` (debe apuntar a `fe624698`; compruébalo antes con `git rev-parse --short origin/dev`).
Nunca rebase, nunca `git fetch` otra vez. El leader lo probó y salen en conflicto exactamente estos 13
ficheros. Si salen otros, o falta alguno, PARA antes de resolver nada:

    mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
    mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
    mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
    mobile-pet-tracker/src/__tests__/design-drift.test.ts
    mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
    mobile-pet-tracker/src/__tests__/ui-copy-table.ts
    mobile-pet-tracker/src/__tests__/ui-language.test.ts
    mobile-pet-tracker/src/app/__tests__/layout.test.tsx
    mobile-pet-tracker/src/i18n/catalog.ts
    mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
    mobile-pet-tracker/src/screens/food/index.test.tsx
    mobile-pet-tracker/src/screens/food/index.tsx
    progress/current.md

Tras el merge entran `package.json` y `bun.lock` de `dev` (`expo-clipboard`, de #214). Antes de correr nada,
`cd /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker && bun install --frozen-lockfile`.

**2. Reglas de resolución.** El resultado es la unión: lo de `dev` más lo de #209. No se pierde nada de ninguno
de los dos lados.
- **Cuentas e inventarios** (`toHaveLength(…)`, `+ N // …`, listas de ficheros consumidores, recuentos de
  radios y tamaños de texto): la cifra es la de `dev` más el delta que #209 sumó sobre `b185ae61`. Las
  expresiones aritméticas se quedan con los términos de `dev` y añaden al final los términos de #209 con su
  comentario `// #209 R<n>`. Nunca se re-suma a mano ni se colapsa en un número.
- **Sufijos de `it`**: la cadena de `dev` primero y después ` (enmendado por #209 R<n>)`. Ejemplo:
  `(enmendado por #208 R20) (enmendado por #214 R22) (enmendado por #209 R23)`.
- **Tablas de copy** (`ui-copy-table.ts`): `R20_NUTRITION_QUESTIONNAIRE` va tras `R19_VACCINE_CREATE` y
  `R21_PET_MEMBERS` (de #214) se queda donde la deja `dev`. Si las dos tablas quieren el mismo sitio, `R20`
  antes que `R21`, también en `ALL_USES`, en `blocks` y en el import de ui-language.
- **`catalog.ts`** y **`language-provider.test.tsx`**: las claves de los dos lados, en `es` y en `en`. El `it`
  `#194 R1` suma los términos de #213, #214 y #209 con sus comentarios, según la primera regla.
- **`screens/food/index.tsx` y su test**: #222 R4 y R7 quitaron el título, fijaron la cabecera con avatar y
  añadieron encabezados ocultos para el lector de pantalla. #209 R19 añadió la CTA «Crear perfil nutricional»
  solo para owner. Se queda la estructura de #222 y la CTA de #209 va en el mismo sitio respecto al vacío de
  Nutrición en que la puso R19. Si el nodo que asertan los `it` de R19 ya no existe o cambió de padre por
  #222, PARA y reporta el `it` y su `Expected`/`Received`. No muevas aserciones de #222.
- **`layout.test.tsx`**: las rutas de #214 y #217 más el `Stack.Screen` de `nutrition-profile` de R3, en el
  orden de `_layout.tsx` ya mergeado.
- **`progress/current.md`**: las secciones de los dos lados enteras, primero las de `dev` (#214 y #212) y
  después la de #209. No escribas nada nuevo en ese fichero.

Todo lo que haga falta para dejar verde el árbol mergeado va en el commit del merge: resoluciones y, en
ficheros sin conflicto textual, cuentas que el merge automático dejó mal porque los dos lados sumaron filas.
No hagas commits aparte. Si para ponerlo verde hace falta cambiar producción más allá de la unión de los dos
lados, PARA.

**3. Verificación antes de commitear el merge.** Con los dos pgreps vacíos, como siempre, desde
`mobile-pet-tracker/`:
- `test ! -e .expo/types/router.d.ts` y después `bunx tsc --noEmit`, exit 0.
- El lint, con `--no-cache`, el log y `test ! -s` de siempre.
- Las seis guardas de R24 y layout, una vez, con el comando de R24 (2).
- La suite completa, `bun run test > ../progress/merge-test-209.log 2>&1; echo exit=$?`, sin pipe. Esperado:
  `Test Suites: 168 passed, 168 total` y `Tests: 6183 passed, 6183 total`. Es una cifra del leader: el CI de
  `dev` en `fe624698` da 167 suites y 6077 tests, y #209 suma 1 suite y 106 tests. SIGKILL = 0 y
  `failed to run` = 0. Si cae un flake conocido (`#168 R2`, `#200 R9`/`#200 R10`, `#152 R8`, `#199 R18`,
  `#190 R5`, `#173 R5`), córrelo aislado y anota el verde aislado. Si no cuadra la cifra, no pares: da en el
  reporte el desglose por fichero (`--json`) y la diferencia.

Mensaje del merge: el que propone git, `Merge remote-tracking branch 'origin/dev' into feature/209-mobile-nutrition-questionnaire`,
y en el cuerpo una línea por fichero resuelto que diga qué lado aportó qué.

**4. Anclas.** Corre otra vez las anclas de R23, R24, R25 y R26 del cuerpo. Para cada una, da la cifra en
`da5e5eef` y la cifra tras el merge. Una diferencia que explica `dev` (una fila, un consumidor o un sufijo de
#213, #214 o #222) se anota con su causa y no es parada. Una diferencia que no explica nadie, PARA.

**5. Comprobaciones de cierre tras el merge.** Sustituyen a las del Cierre:
- **Commits**: `git log --oneline --first-parent 48346f15..HEAD -- . ':!progress/handoff_mobile-nutrition-questionnaire.md' ':!specs/mobile-nutrition-questionnaire/requirements.md' ':!specs/mobile-nutrition-questionnaire/tasks.md' ':!progress/current.md'`
  lista tus commits de `d4204afa` a `da5e5eef`, el merge y el commit del punto 6. Ni uno más.
- **Ficheros tocados**: `git diff --name-only fe624698 HEAD -- mobile-pet-tracker docs` da exactamente las 24
  primeras rutas de la lista del Cierre, las que van sin el reporte y sin `traceability.md`.
- **Intactos**: `git diff --quiet fe624698 HEAD -- backend-pet-tracker init.sh init.config.sh STATUS.md progress/history.md mobile-pet-tracker/src/theme mobile-pet-tracker/src/components mobile-pet-tracker/src/hooks mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/test mobile-pet-tracker/src/__tests__/sheet-surface-background.test.ts mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx && echo intactos`.
  `feature_list.json` sale de la lista porque la branch lleva el `spec_ready` de #209, que es del leader.
- Las guardas de «Guardas que R1 a R26 cruzan» (producción sin `#209`, tests sin `#209` desnudo, sin hojas,
  sin `StyleSheet` en el test, la casilla de R26 sin marcar), corridas otra vez sobre el árbol mergeado.
- `traceability.md` no se toca: los hashes de la cadena siguen valiendo, porque no hubo rebase.

**6. Reporte.** Añade al final del reporte la sección `## Merge de dev (Adenda 4)` con:
- la lista de conflictos y cómo resolviste cada uno;
- `bun install`, tsc, lint y guardas;
- la corrida completa con sus líneas `Test Suites:` y `Tests:`, SIGKILL y `failed to run`;
- la tabla de anclas antes y después;
- las comprobaciones del punto 5.

Cambia la primera línea a `Estado: COMPLETO` y deja todo lo demás. Commit:
`git add ../progress/impl_mobile-nutrition-questionnaire.md && git commit -m 'docs(mobile): #209 report after the dev merge'`.
Después, el chequeo de árbol limpio acotado. Por último:
`cd /home/claude/sites/Pet-Tracker-wt-209 && printf '%s COMPLETO\n' "$(date -u +%Y-%m-%dT%H:%MZ)" > progress/impl_mobile-nutrition-questionnaire.done`.

Las demás reglas siguen igual:
- no corras `./init.sh`;
- no uses Monitor;
- no hagas push ni abras la PR;
- `bun` y `bunx`, nunca npm ni npx.
