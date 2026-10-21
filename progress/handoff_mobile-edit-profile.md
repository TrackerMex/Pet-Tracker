Worktree: /home/claude/sites/Pet-Tracker-wt-194
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader.
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-194 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/194-mobile-edit-profile`.

Feature: mobile-edit-profile (#194). Branch: feature/194-mobile-edit-profile.
H0: el HEAD con el que arrancas. Es el commit de este handoff, descendiente de `8662635f` (firma de la spec; leader; Notion «Estado del gate» = Aprobado, página `4006115a-9b27-81ed-9091-dbc440dc6c5e`, `page_last_edited_at` 2026-10-21T19:18:24.824Z). Ese commit y el de este handoff solo tocan `specs/`, `progress/` y `feature_list.json`. Anota `git rev-parse HEAD` en el reporte.
Spec aprobada: specs/mobile-edit-profile/requirements.md (status: approved). Lee también design.md y tasks.md. D1 a D8 y P1 a P7 están cerradas ahí y son la única fuente de decisiones: no hay nada pendiente de preguntar.
Orden: el de tasks.md, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11 (solo el guion) y el Cierre. R4 deja un stub de pantalla que R5 reemplaza; R9 va tras R7.
Criterios de aceptación: R1 a R10 de requirements.md. R11 (prueba de humo en Android) la cierra el humano: tú solo entregas su guion en el reporte.
Contexto: desde Perfil el usuario abre `/edit-profile`, corrige nombres, apellidos, teléfono y país, `PATCH /v1/me` envía solo lo cambiado, la tarjeta de Perfil se refresca por `setQueryData(userKeys.me(), …)` y la pantalla se cierra. El correo y la zona horaria NO se editan ni se envían (D1, D2).
Entorno: el worktree ya tiene `.env` en la raíz y `mobile-pet-tracker/node_modules`. No los regeneres ni los abras. Usa `bun` para todo en mobile-pet-tracker; nunca npm ni npx. No añadas dependencias. No toques `backend-pet-tracker/`.
Árbol: `progress/current.md` y `progress/handoff_*.md` son del leader. El chequeo de árbol limpio se acota a `git status --short -- mobile-pet-tracker/ specs/ docs/`.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader). Rutas de `mobile-pet-tracker/` desde la raíz del worktree:
  - mobile-pet-tracker/src/i18n/catalog.ts
  - mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  - specs/mobile-ui-language/design.md (solo la sección nueva §2.38 de R1)
  - mobile-pet-tracker/src/utils/account-rules.ts
  - mobile-pet-tracker/src/utils/account-rules.test.ts
  - mobile-pet-tracker/src/api/users.ts
  - mobile-pet-tracker/src/api/__tests__/users.test.ts
  - mobile-pet-tracker/src/app/edit-profile.tsx (nuevo)
  - mobile-pet-tracker/src/app/_layout.tsx
  - mobile-pet-tracker/src/app/__tests__/detail-stack.test.tsx
  - mobile-pet-tracker/src/app/__tests__/layout.test.tsx
  - mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx
  - mobile-pet-tracker/src/app/__tests__/detail-stack.navigation.test.tsx
  - mobile-pet-tracker/src/screens/edit-profile/index.tsx (nuevo)
  - mobile-pet-tracker/src/screens/edit-profile/index.test.tsx (nuevo)
  - mobile-pet-tracker/src/screens/profile/index.tsx
  - mobile-pet-tracker/src/screens/profile/index.test.tsx
  - mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  - mobile-pet-tracker/src/__tests__/ui-language.test.ts
  - mobile-pet-tracker/src/__tests__/design-drift.test.ts (solo `screenSignOutCalls`)
  - mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
  - mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  - mobile-pet-tracker/src/__tests__/edit-profile.test.ts (nuevo)
  - docs/ui-guidelines.md y docs/conventions.md (solo R10)
  - specs/mobile-edit-profile/traceability.md (solo en el commit final)
  - progress/impl_mobile-edit-profile.md (tu reporte)
No tocar: src/components/** (salvo importar `FieldErrorMessage`), src/utils/form-rules.ts, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, ni los ficheros de `specs/mobile-edit-profile/` salvo traceability.md.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill. Las casillas humanas (Aprobación, `Enmienda #194 aprobada por humano`, `Enmienda A22 aprobada por humano`, `Prueba de humo (R11)`) NO se marcan: son del humano. R10 las escribe sin marcar.
  - Skills, con los nombres del catálogo de Codex (no los nuestros):
    - `building-native-ui`: UI nativa (formulario, ScrollView, teclado).
    - `expo-tailwind-setup`: uniwind y Tailwind, solo si tocas clases.
    - `native-data-fetching`: `useQuery`, `setQueryData`, cliente HTTP.
    - Pantalla nueva: `appllama-app-design-skill` (en `.agents/skills/` del repo), obligatoria según la carta. Solo toma el patrón: los valores los mandan la spec y la carta, y la receta es la del formulario de registro.
    - `expo-overview`, `expo-router`, `expo-animation` y `expo-design-system` no existen en Codex: no los busques. Aquí no hay animación nueva.
    - Codex no tiene el MCP de appllama: si una skill pide sus herramientas, sáltalas y sigue la carta.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado (cítala, no la reinventes). Espera sobre el árbol, al mismo nodo que aserta el test (`waitFor` o `findBy*`), nunca a un contador de mock. Espera primero a que aparezca el efecto (mensaje, `router.back` ya llamado, valor de caché) y solo después aserta ausencias y contadores.
  - RNTL 14: `await` en `render`, `fireEvent.*` y `act`. Sin await, un it contamina al siguiente. Si usas renderRouter, `await app;`.
  - RNTL oculta a accesibilidad los nodos decorativos: si un `getByTestId` no encuentra un nodo, pasa `{ includeHiddenElements: true }` en esa consulta.
  - Mocks de `src/screens/edit-profile/index.test.tsx`: sigue la preparación de `src/screens/docs-upload-form/index.test.tsx` (providers `HeroUINativeProvider`, `LanguageProvider`, `QueryClientProvider` con `createQueryClient`, `useAuth` mockeado con `{ token: 'jwt-token', signOut }`, `jest.mock('../../api/users')`). Verifica los literales de mock contra ese fichero, no contra esta línea: la spec prescribe la intención. `useRouter`/`router.back` se mockea como lo hacen los tests vecinos. `EXPO_PUBLIC_API_URL` se fija en el test.
  - Si necesitas un doble de react-native-reanimated, no sustituyas `default` por un spread de `requireActual`: pierde `__esModule`.
  - Literales de copy: se copian de requirements.md §«Copy nuevo» tal cual: `profile.editProfile` = `Edit profile` / `Editar perfil`; `editProfile.save` = `Save changes` / `Guardar cambios`. No los traduzcas ni los inventes. Los tests escriben el copy esperado literal; nunca lo importan de `catalog.ts`. Los mensajes de validación se escriben a mano en los tests tal como los fija el catálogo vigente (`Enter your first name`, `Enter your last name`, `Use at least 7 characters`, `Enter your country's 2-letter code, like MX`, `Use only letters A to Z`, `Use 120 characters or fewer`, `Something in your details doesn't look right. Check them and try again.`, `Cannot reach server`, `Something went wrong`); verifica cada uno contra `catalog.ts` y, si difiere, PARA y reporta.
  - Un `t(` por clave en cada fichero: la pantalla y Perfil llaman `t('<clave>')` una sola vez por clave (`checkUses` cuenta ocurrencias exactas). `profile.editProfile` se usa como título en la pantalla y como etiqueta en Perfil: una vez en cada fichero.
  - Nombres de test: todo `it` nuevo o reescrito empieza por `#194 Rn:`. Comentarios de código que citen la feature: `#194 Rn`, nunca `#194` suelto (choca con HEX_LITERAL de design-drift).
  - Sin clases nuevas más allá de las de requirements.md §«Clases que usa la feature». Nada de hex, clases con corchetes, `StyleSheet`, `text-accent` o `text-accent-strong` sueltos, ni `rounded-` fuera de `card|xl|full|24|16`. `text-13` y `text-17` solo sobre `Text` plano de react-native. `src/screens/edit-profile/index.tsx` Y su `index.test.tsx` no contienen `StyleSheet` en ninguna forma (el candado `#68 R18` de design-drift lee ambos).
  - La pantalla no contiene la cadena `timezone` ni `deviceTimezone`, ni un `Input` de correo (D1, D2).
  - Si algún `testID` nuevo cambia el resultado de un test existente por un selector de prefijo o regex, PARA y reporta.
  - TDD por requisito: test rojo que nombra el R-id en el `it`, después verde, después refactor, según tasks.md. Un bloque no empieza hasta que el anterior esté en verde. Los candados de inventario de cada R se editan en el commit rojo de ese R (requirements.md §Deltas de candados y el bloque de cada R).
  - Commits test-primero, obligatorio: dos commits por requisito: rojo `test(mobile): <qué> (#194 Rn)` y, aparte, verde `feat(mobile): <qué> (#194 Rn)`. R10 lleva `docs(ui): enmienda #194 (#194 R10)` tras su rojo. Un único commit con test, implementación y docs incumple C4 de CHECKPOINTS.md y el reviewer lo rechaza. Mensajes en inglés (docs/conventions.md §Commits). Registra en el reporte el hash de cada commit y la línea `Tests:` tras cada uno.
  - NV: un test que nace verde se anota como NV en el reporte con el requisito previo que ya lo cubre; no fuerces un rojo. Candidatos conocidos: R2 `validateRegister conserva`, R7 caso 7, R9 caso 3.
  - Sondas: las S de cada R en requirements.md. Mutan solo producción, se corren en el commit verde de su R, se revierten con `git checkout HEAD -- <ruta>` y después `git diff --quiet HEAD -- <ruta>` y `git diff --cached --quiet` salen 0. Anota en el reporte, por sonda, los rojos reales frente a los esperados.
  - Commits: `git add` con rutas explícitas, solo los ficheros de cada requisito. Nunca `git add -A` ni `commit -a`. No mezcles ficheros de arnés en los commits TDD.
  - Antes de cada commit: `bunx prettier --check` no existe en móvil; no formatees ficheros ajenos. En `backend-pet-tracker` no hay cambios.
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(mobile): ...` tras el último verde. Sin filas «pendiente».
  - Tu reporte es progress/impl_mobile-edit-profile.md. Incluye: commits, `Tests:` tras cada uno, T0, NV, rojos y sondas con su consulta, skills cargadas y no encontradas, lint y typecheck, desviaciones y el guion de R11 (requirements.md §R11, tal cual).
  - No abras la PR ni la edites. No marques `done` ni toques `status` de feature_list.json.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo con otra herramienta.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.
  - Nada de recursos AWS ni `cdk deploy`.
  - Tipos: antes de cada `bun run typecheck` o `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts`. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache`, redirect al log y sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-194/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-194.log 2>&1 && test ! -s ../progress/lint-194.log`. Los logs (`progress/lint-194.log`, `progress/test-194.log`) quedan sin commitear (`*.log` está en .gitignore).
  - Jest: un posicional es una regex, así que rutas con paréntesis (`(tabs)`) saltan ficheros con exit 0. Ninguna ruta de esta feature las tiene; para varios ficheros usa `bun run test --runInBand --runTestsByPath <rutas>`.

Anclas de la base (H0). Todas desde `mobile-pet-tracker/`. El leader las corrió el 2026-10-21 sobre `8662635f`. Ante una diferencia, PARA y reporta.
  bun -e "import {en} from './src/i18n/catalog.ts'; console.log(Object.keys(en).length)"   # 436
  grep -n '^### §2\.' ../specs/mobile-ui-language/design.md | tail -1   # §2.37 — Añadidos por #191 — Nueva mascota en dos pasos; esta feature toma §2.38
  for k in profile.editProfile editProfile.save; do grep -cF "'$k'" src/i18n/catalog.ts; done   # 0 y 0
  test ! -e src/app/edit-profile.tsx && test ! -d src/screens/edit-profile && echo vacio   # vacio
  grep -n 'toHaveLength(' src/app/__tests__/layout.test.tsx | grep '+ 1'   # cuatro del grupo protegido: 8+1+1+1+1+1, 9+1+1+1+1, 10+1+1+1, 11+1+1 (suman 13); R4 suma + 1 a cada una
  grep -c 'R16_WELCOME' src/__tests__/ui-copy-table.ts   # 3 (último bloque; R17_EDIT_PROFILE no existe)
  grep -n 'SCREEN_FILES).toHaveLength' -A14 src/__tests__/ui-language.test.ts | grep 'R13'   # última línea de la fórmula: + 1 // #190 R13
  grep -n "'screens/profile/index.tsx': 2" src/__tests__/design-drift.test.ts   # una línea (603)
  grep -n "name: 'ok', state: account" src/screens/profile/index.test.tsx   # children: ['me-identity', 'theme-row', 'language-toggle']
  grep -n 'firstName.trim()\|phone.trim()\|country.length' src/utils/account-rules.ts   # dentro de validateRegister (líneas 42 a 48)
  grep -rhoE 'enmienda A[0-9]+ de #[0-9]+' ../docs | sort -V | tail -1   # enmienda A21 de #152; esta feature toma A22
  grep -n '+ 3 - 1' src/providers/__tests__/language-provider.test.tsx   # una línea: `+ 3 - 1, // #191 R1` (la coma pasa a la línea nueva de #194)
  grep -n "text-17/g\|rounded-16\\\\b/g" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # 8 + 15 + 1; 5 + 11 + 1; 26 + 1 (cada una suma + 1 // #194 R6)
  grep -n "toHaveLength(16 + 1)" src/__tests__/consistency-classnames.test.ts   # una línea; R6 suma + 1
Si una cifra de los candados de R6 (chunky, consistency) difiere de la del leader en H0, vale la tuya y el delta no cambia.

Base de tests (T0): `cd /home/claude/sites/Pet-Tracker-wt-194/mobile-pet-tracker && bun run test > ../progress/test-194.log 2>&1`, y luego `grep -E '^(Test Suites|Tests):' ../progress/test-194.log`. Anota tu cifra como T0 y úsala como base de todo el Cierre. El aviso final de «worker force-exit» es preexistente en main: no pares por él. Si un test da timeout y hay otra jest corriendo en la máquina (hay sesiones paralelas), repítelo sin flags antes de dar el rojo por bueno.

Tests nuevos esperados: los de cada R en requirements.md (R1: 2; R2: `it.each` + 1; R3: 7; R4: 1 en detail-stack + 1 `it` en layout + fila `it.each` + listas; R5: 6 + grep-clean; R6: 6; R7: 7; R8: 7; R9: 3 + `it.each` reescrito; R10: 4 con el `it.each`). Cuenta los reales y anótalos.

Guardas que esta feature cruza:
  - Tras cada requisito que toque clases o copy, corre `bun run test --runInBand --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/heroui-text-size-merge.test.ts src/__tests__/ui-language.test.ts src/__tests__/chunky-cta-canvas-fidelity.test.ts`. Los inventarios `inkSites`, `R7_PROFILE`, `account-screens-polish`, `forms-validation-global`, `heroui-text-size-merge` y `profile-canvas-fidelity` NO deben cambiar (requirements.md §Deltas de candados): si alguno se pone rojo por esta feature, PARA y reporta.
  - `screens/edit-profile/index.tsx` debe tener 1 llamada `signOut(` tras R8 (0 antes), y `queryKey: [` literal está prohibido: usa `userKeys.me()`.
  - `FieldErrorMessage` aparece 5 veces en la fuente de la pantalla (1 import + 4 usos) y no se importa `FieldError` de `heroui-native`.

Cierre (tasks.md §Cierre):
  - `bun run test` en verde. El total es T0 más tus tests nuevos reales.
  - Guardas en verde: design-drift, consistency-classnames, legibility-classnames, heroui-text-size-merge.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck`.
  - Lint, como arriba.
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only HEAD0..HEAD -- mobile-pet-tracker/ docs/ specs/` (sustituye HEAD0 por H0). Debe coincidir con la lista de Archivos de arriba.
  - Reporte en progress/impl_mobile-edit-profile.md con lo pedido en «Reglas críticas».
  - Última acción: crear progress/impl_mobile-edit-profile.done con una sola línea, la ruta de progress/impl_mobile-edit-profile.md. Está en .gitignore; no lo commitees.
