Veredicto: aprobado

# review: mobile-pet-members (#214)
Fecha: 2026-10-27 12:23 UTC
Worktree: /home/claude/sites/Pet-Tracker-wt-214
Branch: feature/214-mobile-pet-members
HEAD revisado: 0a54a98d (base H0 08fe7dab)
Alcance del veredicto: solo 0a54a98d. Un commit nuevo bajo `mobile-pet-tracker/`, incluido el merge con `dev` (ver menor 3), exige relanzar el reviewer.
`./init.sh` no lo corrió el reviewer (el clasificador se lo deniega). Lo corre el leader después de este veredicto, y el veredicto queda condicionado a que salga verde.

## Hallazgos

### Bloqueantes
Ninguno.

### Menores

1. **Cobertura de R13: la nota del código del dueño no tiene candado.**
   - Dónde: `mobile-pet-tracker/src/screens/pet-members/index.tsx:292-297`.
   - R13 dice que el dueño ve `pet-members-code-note` = `t('members.codeNote')`. Ningún test comprueba que la nota aparezca para el dueño ni su texto. Solo hay dos `toBeNull` de la vista family, en `index.test.tsx:204` y `:214`.
   - Mutación M6: cambiar `{isOwner ? (` por `{false ? (` en la línea 292. Sobrevive con 309/309 verdes en pet-members, design-drift, consistency-classnames, profile-canvas-fidelity y ui-language.
   - La lista de tests de R13 en requirements.md no pedía ese `it`, así que el hueco viene de la spec y no del implementador. Mismo criterio que la observación 1 de `review_188.md`: no bloquea.
   - Arreglo sugerido: un `it('R13: el dueño ve la nota del código', …)` que aserte el texto «Cada código sirve una sola vez. Si nadie lo usa, vence solo.».

2. **Al texto de esa nota le falta `flex-1`; riesgo de desborde en el dispositivo.**
   - Dónde: `mobile-pet-tracker/src/screens/pet-members/index.tsx:295`.
   - Su `Text` es `text-13 font-semibold leading-note text-foreground`, sin `flex-1`, dentro de un `flex-row`. El literal de R13 no trae `flex-1`, así que cumple la letra de la spec.
   - En cambio, sus gemelas declaradas «misma nota que `pet-members-code-note`» sí lo llevan: `pet-members-owner-note` (`:301`) y `join-pet-note` (`join-pet/index.tsx:73`).
   - Con unos 60 caracteres en `text-13`, la línea no cabe en un teléfono. Un `Text` sin `flex-1` ni `flexShrink` en una fila puede salirse de la caja en lugar de partirse en dos líneas.
   - Verificar en el smoke G4. Si se desborda, es una enmienda de una palabra a R13 más su candado (el del menor 1).

3. **La rama está en conflicto con `origin/dev` (para el leader, no es del implementador).**
   - Reproducir: `git merge-tree --write-tree --name-only HEAD origin/dev` da 17 ficheros en CONFLICT.
     - `_layout.tsx`, `profile/index.tsx`, `jest-setup.js`;
     - los guards `alerts-canvas`, `canvas-foundations`, `chunky-cta`, `consistency-classnames`, `design-drift`, `profile-canvas`, `ui-copy-table`, `ui-language`, `zones-canvas`;
     - los tests de layout, detail-stack, home, profile y language-provider.
   - La causa: después de H0 entraron en `dev` (ca2d0abb) #217 y #213, que design.md §7.3 daba como ausentes.
   - Una PR CONFLICTING no corre checks. Las cifras agregadas de los candados (ALL_USES, `+ 51`, consumidores de `useChunkyLip`, inventarios de `CTA_ROWS` y `radii`) hay que volver a medirlas sobre el merge.
   - El merge es un commit nuevo y necesita su propia corrida completa y revisión antes de mergear la PR.

4. **La guarda «sin cambios desde H0» del handoff no sale vacía por cómo está construida (harness).**
   - Dónde: `progress/handoff_mobile-pet-members.md:585`.
   - La orden incluye `mobile-pet-tracker/src/providers` entero, así que lista `src/providers/__tests__/language-provider.test.tsx` (23 líneas). Ese fichero está autorizado (fila 48), pero la línea 586 dice que queda «fuera de esta orden», y no es así.
   - El resto de la guarda sale vacío: ninguna producción de `src/providers`, `src/theme`, `src/components`, `api/{http,pets,users}.ts`, `pairing`, `reminders`, `meal-schedule`, `category-palette.ts`, `init.sh` ni `backend-pet-tracker` cambia.
   - Arreglo para futuros handoffs: excluir `':!mobile-pet-tracker/src/providers/__tests__'`.

## Verificación independiente (sin init.sh)

Todo se corrió en primer plano en el worktree, mientras wt-222 corría su init.sh y su e2e de backend. No hubo rojos que repetir.

- **Suites nuevas** (api, utils, pet-members, pet-invite, join-pet; `--runTestsByPath --testTimeout=30000`): 5/5 suites, 130/130 tests.
- **Suites modificadas de pantalla y app** (profile, home, layout, detail-stack.guard, `(tabs)/screens`, use-pet-selection, language-provider): 7/7 suites, 654/654 tests.
- **Guards de carta** (alerts-canvas, canvas-foundations, chunky-cta, consistency-classnames, design-drift, profile-canvas, sheet-surface-background, ui-language, zones-canvas, home-pingo-phrase, no-pets-states, collar-alerts-canvas): 12/12 suites, 483/483 tests.
- **Las 21 suites `.test.*` tocadas, juntas** (`--json`): 21/21 suites, 1243/1243 tests.
- **Corrida completa** (`bunx jest --testTimeout=30000 --silent`): 163/163 suites, 5773/5773 tests, 0 fallos, exit 0, 2 min 41 s. Coincide con el reporte.
- **Tipos**: `test ! -e .expo/types/router.d.ts` dio OK, y `bunx tsc --noEmit` salió con exit 0.
- **Lint**: `bunx expo lint --no-cache > /tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/lint-214.log 2>&1` salió con exit 0, y el log tiene 0 bytes (`test ! -s` OK).
- **`git diff --check 08fe7dab..HEAD`**: limpio.

### Mutaciones

Cada mutación se revirtió con `git checkout HEAD -- <fichero>`. Después de cada reversión, `git diff --quiet HEAD` y `git diff --cached --quiet` salieron con exit 0.

| # | Fichero:línea | Mutación | Resultado |
|---|---|---|---|
| M1 | `screens/profile/index.tsx:221` | quitar el mapeo `unauthorized` → `error` del subtítulo | rojo: `R5: oculta el subtítulo si la lista falla` (signOut llamado) |
| M2 | `screens/pet-members/index.tsx:89` | `rejected` no cierra el sheet | rojo: `R11: rejected invalida y avisa` |
| M3 | `screens/pet-members/index.tsx:100` | `error` cierra el sheet | rojo: `R11: error deja el sheet abierto` |
| M4 | `screens/join-pet/index.tsx:38` | `already-member` deja `border-accent` | rojo: `R20: ya miembro sustituye la nota y el botón por Ir a Inicio` |
| M5 | `screens/pet-members/index.tsx:234` | pintar `{me.email}` en el encabezado | rojo: `R9: ningún texto de la pantalla contiene el correo de getMe` (el candado que se arregló en f0894424 ya muerde) |
| M6 | `screens/pet-members/index.tsx:292` | ocultar `pet-members-code-note` al dueño | **sobrevive** (menor 1) |

## Checklists

### C2 — Estado coherente
- [x] No hay más de una feature `in_progress`: `feature_list.json` tiene 0, en la rama, en `origin/dev` y en `origin/main`. Así init.sh no aborta en :156.
- [x] `progress/current.md`: Codex no lo toca porque está fuera de la lista cerrada. El estado de #214 (`spec_ready` en la rama, `pending` en `dev`) lo cierra el leader.

### C3 — Arquitectura (móvil)
- [x] Las rutas son delgadas: `app/join-pet.tsx`, `app/pets/[petId]/members.tsx` e `invite.tsx` solo importan la pantalla de `src/screens/`, y members le pasa `petId`.
- [x] La red está aislada en `src/api/pet-members.ts`, con estados discriminados por `kind` y `fetchFn` inyectable. Las pantallas consumen funciones y claves de `query-keys.ts`.
- [x] La lógica pura vive en `src/utils/pet-members.ts` (`memberInitials`, `formatInviteCode`, `inviteDateParts`).
- [x] No toca producción fuera de la lista cerrada. El diff 08fe7dab..HEAD tiene 41 ficheros: los 40 de la lista más `progress/handoff_mobile-pet-members.md`, que solo tocan los 5 commits `docs(progress)` del leader.

### C4 — TDD
- [x] Cada R1–R24 tiene `it` que lo nombra. Comparé las 146 filas de R1–R23 de traceability.md con los títulos reales de jest (`--json`) y coinciden las 146.
- [x] La fila R24 «corrida completa» no es un `it`. De las 49 filas R24 de candados enmendados, 42 se casaron con su título real; las otras 7 son dobles, datos o agregados, sin título. El `it` «cuadra ALL_USES» vive en `ui-copy-table.ts` y corre, en verde, desde `ui-language.test.ts`.
- [x] El historial va test → feat por cada R, en el orden R23, R1, R2, utils, R22, R3, R8–R12, R16, R17, R13–R15, R18–R21, R4–R7.
  - Los commits test que crean producción (3a8a1f41 api, 37a8d14a query-keys, 5b75dc6f utils) traen solo esqueletos: funciones que devuelven `{ kind: 'error' }`, `''` o `['', petId]`.
  - Las ediciones de candados dentro de feat (fa4b55f6 consumidores de `useChunkyLip` para R11, 75ac271c `rounded-tile` para R16) son las enmiendas de la fila R24 que ese R necesita.
  - Las correcciones de test de las adendas A1, A3 y A4 van en commits `test` propios (94460e21, 435d633a, 1db5b19e, f0894424).
- [x] Los «nace verde» están declarados uno a uno en traceability.md y en el reporte.

### C5 — Trazabilidad
- [x] traceability.md no tiene ninguna fila «pendiente». La única aparición de la palabra es la regla de la línea 223.
- [x] Los 32 hashes citados existen y son de la rama: todos son ancestros de HEAD y ninguno de H0.
- [x] Los commits siguen `tipo(mobile): #214 <desc> (R-ids)`. Los del leader son `docs(progress): #214 …`. No hay commits ajenos ni merges.

### C6 — Spec aprobada
- [x] requirements.md tiene `status: approved` y la casilla `[x] Aprobado por humano (fecha: 2026-10-27)` en la línea 811 (firma delegada del mandato).
- [ ] La casilla del smoke de #214 (línea 812) está abierta. Es del humano (G4) y no bloquea este veredicto.

### C7 — Sin código huérfano
- [x] N/A: la feature no reemplaza nada existente.

### C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Las 6 pantallas y rutas nuevas no tienen hex: los únicos `#NNN` son comentarios `#214 R<n>` en pet-invite. Tampoco usan `StyleSheet`, sombras ni `elevation`. Los `[...]` de las className son índices JS (`CATEGORY_SLOTS[slot]`), no valores arbitrarios.
- [x] `home/index.tsx` y `profile/index.tsx` tienen 0 apariciones de `#214`, como pide design-drift.
- [x] Las safe areas se resuelven con `useSafeAreaInsets` en las 3 pantallas.
- [x] La carga usa `Skeleton` de heroui-native (`pet-members-loading`, `pet-members-header-skeleton`).
- [x] Reutiliza `ScreenHeader`, `ProfileWideTile` (local de Perfil, según P2), `CATEGORY_SLOTS`, `useChunkyLip` y `useThemeColors`. Las hojas son `BottomSheet` de `@expo/ui/community/bottom-sheet` con `backgroundStyle` surface y un solo `useThemeColors(['surface'])`.
- [x] Los tappables son `Button` de HeroUI, con feedback propio; no hay `Pressable` crudo. Quitar y Revocar miden `h-11` (44 pt).
- [x] No hay animaciones nuevas.
- [x] El copy coincide: las 51 claves × 2 idiomas de `catalog.ts` son iguales, carácter a carácter, a la tabla de design.md §5. Hay 2 apariciones de `'members.leaveBodyNoOwner'` y 2 de `'welcome.pingoGreeting'`.
- [x] Dependencias: `package.json` y `bun.lock` añaden solo `expo-clipboard ~57.0.2` (R23). `jest-setup.js` añade solo su doble global.

## Queda para el humano
- **Rebuild del dev build**: `expo-clipboard` es un módulo nativo nuevo y no funciona en el build actual.
- **Smoke G4 en dispositivo** (requirements.md:812). Comprobar en concreto:
  - que `pet-members-code-note` parte la línea dentro de la caja (menor 2);
  - copiar y compartir en pet-invite;
  - el KAV de join-pet con el teclado abierto;
  - salir de la mascota y volver a Inicio.
- **`dev` → `main`**: lo mergea el humano.

## Output de ./init.sh
No ejecutado por el reviewer (denegado por el clasificador; lo corre el leader tras el veredicto). La evidencia de arriba es la corrida independiente de jest, tsc y lint en primer plano.

Hash revisado: 0a54a98d

## Segunda revisión (HEAD 7c079da8)
Fecha: 2026-10-27
Hash revisado: 7c079da8 (delta 0a54a98d..7c079da8: 09559c79, 91a70ed3, d06f4f69, 52f7449b, 7c079da8)
Estado: terminada

### 1. El merge 91a70ed3 suma los dos lados
Padres 09559c79 y ca2d0abb; merge-base 0c37e77a (mismo árbol de `mobile-pet-tracker/` que 08fe7dab). `git merge-tree --write-tree --name-only 09559c79 ca2d0abb` da los 17 CONFLICT esperados.
- **Ficheros sin conflicto**: `git diff <árbol de merge-tree> 91a70ed3` lista solo los 17. El resto del árbol es la auto-fusión de git, byte a byte.
- **Lo que #214 añade sobre dev = lo que añadía antes.** Comparé las líneas `+`/`-` de `git diff ca2d0abb 91a70ed3` con las de `git diff 08fe7dab 0a54a98d`, fichero a fichero:
  - 5 de los 17 coinciden exactos: `_layout.tsx`, `profile/index.tsx`, `jest-setup.js`, `home/index.test.tsx` y `profile/index.test.tsx`.
  - Otros 5 difieren solo en el sufijo de dev dentro de un título: `alerts-canvas`, `design-drift`, `profile-canvas`, `ui-language` y `detail-stack.guard`.
  - En los 7 restantes, quitando los sufijos `(enmendado por #208|#213|#217 …)`, solo queda la base de las cifras: la expresión de dev con el mismo `+ N` de #214 detrás. Son `canvas-foundations`, `zones`, `chunky-cta`, `consistency`, `ui-copy-table`, `layout.test` y `language-provider`.
  - Fuera de los 17: los otros 21 ficheros de `mobile-pet-tracker/` (38 en total) dan las mismas líneas en los dos diffs, y la lista de ficheros es idéntica.
- **Lo que el merge trae al lado de #214 = el delta de dev.** Comparé `git diff 0a54a98d 91a70ed3` con `git diff 0c37e77a ca2d0abb` en los 17. Quitando los sufijos `#214`, solo difieren:
  - las cifras con el `+ N` de #214;
  - las listas con las entradas de #214;
  - el sitio de una línea en blanco entre `describe` (layout, home, profile, ui-language).
  - No se pierde ninguna línea de dev ni aparece ninguna línea nueva que no sea de #214.
- **Cifras agregadas**: todas son la expresión de dev más el delta de #214, el mismo que en 0a54a98d. Las sumé a mano y cuadran con la tabla del reporte (§A):
  - `Stack.Protected`: 15+3 = 18.
  - Dependencias en `canvas-foundations` y `zones`: 42+1 = 43.
  - Claves del catálogo: `+ 54 // #213 R22` seguido de `+ 51, // #214 R22`.
  - `text-17`: 35+4 = 39. `<Text … text-accent-foreground>`: 18+4 = 22.
  - `border-lip-gray`: 15+4 = 19, en chunky y en consistency.
  - `\brounded-16\b`: 47+11 = 58. `rounded-16 bg-accent`: 21+4 = 25.
  - `textInputs`/`withPlaceholder`: 10/8 → 11/9.
  - `neutralInventory`: 12+5 = 17 ids (incluye `reminders-cancel-series-keep` de dev).
  - Radios de `home/index.tsx` en design-drift: `1 + 1`.
  - Inventario `chunkyLip.neutral`: conserva `reminders` = 2 de dev y añade home 1, pet-invite 1 y pet-members 3.
  - `primaryCompact`: conserva `vaccines-add` de dev.
- **Título «seis placeholders»** (nota del reporte): es la fusión correcta de los dos cambios. Dev añadió el sufijo `#208 R21` y #214 cambió «cinco» por «seis». No es comportamiento.
- `feature_list.json`: frente a dev solo cambia la fila 214 (`spec_ready`). Es del leader.

### 2. Enmienda 1 de R13 (09559c79, d06f4f69, 52f7449b)
- **Spec**: requirements.md R13 cambia una sola cosa, `flex-1` delante del className del texto de `pet-members-code-note`. Añade el `it` `'R13: el dueño ve la nota del código'` y la casilla `[x] Enmienda 1 … firma delegada (2026-10-27)`. tasks.md añade los pasos (1)–(3), con las casillas abiertas porque el implementer no podía tocar ese fichero (reporte §C). Coincide con los menores 1 y 2 de la primera revisión.
- **Rojo d06f4f69**: es solo un `it` nuevo (7 líneas) en `pet-members/index.test.tsx:539`, con el montaje de dueño `renderInviteCta()`.
  - Busca el `Text` con `within(getByTestId('pet-members-code-note')).getByText(<literal>)` y vuelve a asertar el texto con `exact: true`.
  - Aserta `props.className` contra `/(^| )flex-1( |$)/`.
  - El literal está escrito en el test, no se importa de `catalog.ts`. El className es el que pasa la pantalla. No es tautológico.
  - El `index.tsx` de d06f4f69 es el de HEAD sin `flex-1`: 52f7449b cambia una línea y 7c079da8 no toca `mobile-pet-tracker/`. Por eso la mutación M8 de abajo reproduce el rojo del commit. Cae solo en `index.test.tsx:543` (`toMatch`), con «Received string: "text-13 font-semibold leading-note text-foreground"». El `getByText` y el `toHaveTextContent` pasan.
- **Verde 52f7449b**: diff de una línea en `pet-members/index.tsx:295`, que solo añade la clase `flex-1`. El texto queda igual que en sus gemelas `pet-members-owner-note` (`:301`) y `join-pet-note`.
- **Mutaciones** (cada una revertida con `git checkout HEAD -- src/screens/pet-members/index.tsx`; después, `git diff --quiet HEAD` = 0 y `git diff --cached --quiet` = 0):

| # | Fichero:línea | Mutación | Resultado (suite pet-members) |
|---|---|---|---|
| M7 | `screens/pet-members/index.tsx:292` | `{isOwner ? (` → `{false ? (` (la M6 que sobrevivía en la 1.ª revisión) | rojo, 1 failed / 54 passed: `R13: el dueño ve la nota del código`, «Unable to find an element with testID: pet-members-code-note» |
| M8 | `screens/pet-members/index.tsx:295` | quitar `flex-1 ` del `Text` | rojo, 1 failed / 54 passed: el mismo `it`, en `toMatch` (`:543`) |

Con HEAD sin mutar, la suite da 55/55 y exit 0. Los menores 1 y 2 de la primera revisión quedan cerrados.

### 3. Corridas independientes (sin init.sh, en primer plano, sobre 7c079da8)
Antes de jest, `pgrep` solo veía un jest de una suite en `Pet-Tracker-wt-209`, que acabó antes de la corrida grande. No hubo rojos que repetir.
- **Las 13 suites de los 17 ficheros más pet-members** (`--runTestsByPath --testTimeout=30000`): exit 0, 14/14 suites, 1225/1225 tests.
  - Las suites: alerts-canvas, canvas-foundations, chunky-cta, consistency-classnames, design-drift, profile-canvas, ui-language (corre el `it` «cuadra ALL_USES» de `ui-copy-table.ts`), zones-canvas, detail-stack.guard, layout, language-provider, home, profile y pet-members.
  - `_layout.tsx`, `profile/index.tsx` y `jest-setup.js` no tienen suite propia: los cubren layout, profile y todas las demás.
  - Ninguna ruta lleva `(tabs)`.
- **Tipos**: `test ! -e .expo/types/router.d.ts` = 0, y `bunx tsc --noEmit` = 0 con log vacío.
- **Lint**: `bunx expo lint --no-cache > /tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/r2/lint.log 2>&1 && test ! -s <ese log>` = 0, log de 0 bytes.
- No repetí la corrida completa (el reporte da 166/166 suites y 6035/6035 tests). La cubre el init.sh del leader.
- `origin/dev` sigue en ca2d0abb (`git ls-remote`), que es ancestro de HEAD. La rama ya no está en conflicto con dev, así que el menor 3 de la primera revisión queda cerrado.

### 4. Trazabilidad y commits
- traceability.md añade la fila R13 `R13: el dueño ve la nota del código` con `d06f4f69`, verde en `52f7449b`, y la línea del merge `91a70ed3` (padre de dev ca2d0abb).
  - Los 4 hashes existen (`git cat-file -t` = commit) y son ancestros de HEAD.
  - Los 35 hashes entre backticks del fichero siguen siendo ancestros de HEAD: no hubo rebase.
  - No hay ninguna fila «pendiente»; la única aparición de la palabra es la regla de la línea 227.
- El `it` nuevo nombra su R-id: `R13: …`.
- Los commits respetan el alcance de la Adenda 5:
  - d06f4f69 solo toca el test y 52f7449b solo la pantalla; los dos con `--only`.
  - 7c079da8 solo toca traceability y el reporte.
  - El merge lleva el mensaje prescrito.
  - El formato es `test|feat|docs(mobile): #214 … (R13, amendment 1)`.
- `feature_list.json`: 0 features `in_progress`, y #214 sigue en `spec_ready`.

### Hallazgos de la segunda revisión, por severidad

**Bloqueantes**: ninguno.

**Menores**: ninguno en el código del delta.

**Observaciones** (no bloquean):
1. **Título desfasado, heredado de dev.** El título de `consistency-classnames.test.ts`, «da color temático a los seis placeholders», no cuadra con su cifra (`withPlaceholder` = 9). Ya estaba así en dev, que decía «cinco» con 8. Es cosmético y no lo introduce este merge. Si alguien lo corrige, que sea fuera de #214.
2. **Espacios al final de línea en ficheros del harness.** `git diff --check ca2d0abb HEAD` avisa en `progress/firma_mobile-pet-members.md:236`. Viene de ec89c965, un commit del leader anterior a H0, fuera del delta y fuera del código. `git diff --check 0a54a98d HEAD` avisa además en `progress/fix-r21_mobile-reminders-recurrence/c1.patch:8`, que llega de dev con el merge.
3. **Casillas de tasks.md abiertas.** Las tres casillas de «Enmienda 1» en `specs/mobile-pet-members/tasks.md` quedan abiertas porque el fichero no estaba en la lista cerrada. Las marca el leader.
4. **Smoke G4 en dispositivo.** El menor 2 queda arreglado en código. Aun así, sigue valiendo comprobar en el smoke que `pet-members-code-note` parte la línea dentro de su caja.

**Veredicto de la segunda revisión: aprobado.** Queda condicionado, igual que el primero, a que el `./init.sh` del leader salga verde sobre 7c079da8. Un commit nuevo bajo `mobile-pet-tracker/`, merge incluido, exige relanzar al reviewer.

Hash revisado: 7c079da8

## Tercera revisión (HEAD 2a00094f)
Fecha: 2026-10-27
Hash revisado: 2a00094f (delta 7c079da8..2a00094f: 1e074826, d233ea22, d97d498b, 2a00094f)
Estado: terminada

Arranque: branch `feature/214-mobile-pet-members`, HEAD 2a00094f, único cambio `?? progress/review_mobile-pet-members.md`. `git ls-remote origin refs/heads/dev` = 2c103bb4, ancestro de HEAD (`merge-base --is-ancestor` = 0). Padres de d97d498b: d233ea22 y 2c103bb4; merge-base ca2d0abb (el mismo con 7c079da8).

### 1. El merge d97d498b suma los dos lados
- `git merge-tree --write-tree --name-only d233ea22 2c103bb4` da los 3 CONFLICT esperados: `alerts-canvas-fidelity.test.ts`, `ui-language.test.ts` y `language-provider.test.tsx`.
- **Fuera de los 3, es la auto-fusión de git.** `git diff <árbol de merge-tree> d97d498b` solo lista esos 3 ficheros. `git diff d97d498b 2a00094f` solo toca `impl_mobile-pet-members.md` y `traceability.md`. `7c079da8..d233ea22` solo toca `progress/` (current, handoff y smoke).
- **Lo que #214 añade sobre dev = lo que añadía sobre ca2d0abb.** Comparé fichero a fichero las líneas `+`/`-` de `git diff 2c103bb4 d97d498b` y de `git diff ca2d0abb 7c079da8`. La lista de ficheros es la misma, salvo `current.md` y `smoke_mejoras-producto.md`, que son del leader. Las líneas coinciden exactas en todos menos tres:
  - `handoff_mobile-pet-members.md`: la Adenda 6.
  - `alerts-canvas-fidelity.test.ts`: solo el título del `it.each`, que lleva `(enmendado por #222 R9)` antes de `(enmendado por #214 R12, R18)`. Las dos entradas de #214 (`pet-members` en `rounded-10` y `join-pet` en `tracking-title`) son las mismas.
  - `language-provider.test.tsx`: el título lleva `(enmendado por #222 R8)` antes del sufijo de #214. La suma queda `+ 54 // #213 R22`, `+ 1 // #222 R8`, `+ 51, // #214 R22`, así que el delta de #214 sigue siendo `+ 51`.
  - `ui-language.test.ts` coincide exacto: el `describe` de #214 va detrás del de #222.
- **Lo que el merge trae al lado de #214 = el delta de dev.** Comparé `git diff 7c079da8 d97d498b` con `git diff ca2d0abb 2c103bb4`. Son los mismos 44 ficheros, más los 3 de `progress/` del leader. Las líneas son idénticas en 41 de los 44. Solo difieren los 3 en conflicto, y únicamente porque llevan al lado los sufijos o las entradas de #214. No se pierde ninguna línea de dev: las bajas de food, health y profile en el inventario de `tracking-title`, el `+ 1 // #222 R8` y el `describe('#222 R8 …')` están todos.
- **Auto-fusionados con cifras**: en `canvas-foundations`, `profile-canvas-fidelity`, `ui-copy-table`, `screens.test.tsx`, `catalog.ts` y `profile/index{,.test}.tsx`, los dos lados tocan líneas distintas.
  - Dependencias: 42 + 1 = 43, igual que `Object.keys(dependencies).length` de `package.json`. Dev no toca `package.json`.
  - `ALL_USES` es la suma de sus bloques, no una cifra congelada. #222 suma sus filas a `R5_HEALTH` y `R6_FOOD` (+1 cada uno, cifras de dev), y #214 suma las suyas a `R21_PET_MEMBERS`.
  - `variant="avatars"` y `tracking-tight` (#222 R9) no los toca #214.
  - En `profile/index.tsx`, `addPetCapsule`/`profile-heading` de #222 y `ProfileWideTile`/`membersQuery` de #214 no se solapan.
  - Las cifras cuadran con la tabla de la Adenda 6 del reporte. Claves: 539 de dev + 51 = 590, y la mutación M9 lo mide.

### 2. Corridas independientes (sin init.sh, en primer plano, sobre 2a00094f)
- **Los 3 en conflicto y los auto-fusionados con suite**, con `bunx jest --runTestsByPath … --testTimeout=30000`: exit 0, 8/8 suites y 480/480 tests. Las suites: alerts-canvas, ui-language, language-provider, canvas-foundations, profile-canvas, ui-copy-table, `(tabs)/__tests__/screens.test.tsx` y `profile/index.test.tsx`. `catalog.ts` y `profile/index.tsx` no tienen suite propia: los cubren language-provider/ui-language y profile. Los `● Console` son avisos de Uniwind y react-native-svg, no fallos.
- **Tipos**: `test ! -e .expo/types/router.d.ts` = 0, y `bunx tsc --noEmit` = 0 con log vacío.
- **Lint**: `bunx expo lint --no-cache > <scratchpad>/lint.log 2>&1` = 0, y `test ! -s` sobre ese log = 0 (0 bytes).
- No repetí la corrida completa (el reporte da 167/167 suites y 6077/6077 tests). La cubre el init.sh del leader.

### 3. Mutaciones en las cifras fusionadas
Cada mutación se revirtió con `git checkout HEAD -- <f>`. Al final, `git diff --quiet HEAD` = 0 y `git diff --cached --quiet` = 0.

| # | Fichero | Mutación | Resultado |
|---|---|---|---|
| M9 | `providers/__tests__/language-provider.test.tsx` (conflicto) | quitar `+ 51, // #214 R22` y cerrar la suma en `+ 1, // #222 R8` | rojo, 1 failed / 108 passed: `#194 R1 …`, «Expected length: 539, Received length: 590» |
| M10 | `__tests__/alerts-canvas-fidelity.test.ts` (conflicto) | quitar `'screens/join-pet/index.tsx', // #214 R18` del inventario de `tracking-title` | rojo, 1 failed / 26 passed: `limita tracking-title a su inventario…`, el diff pide `+ "screens/join-pet/index.tsx"` |

### 4. Trazabilidad, commits y estado
- traceability.md solo añade la línea del segundo merge (`d97d498b`, padre de dev 2c103bb4).
  - Los 36 hashes entre backticks del fichero son ancestros de HEAD: no hubo rebase.
  - No hay ninguna fila «pendiente»; la palabra solo sale en la regla de la línea 230.
- El merge lleva el mensaje prescrito y las líneas de atribución. 2a00094f solo toca traceability y el reporte.
- `feature_list.json`: frente a dev solo cambia la fila 214 (`spec_ready`), y no hay ninguna feature `in_progress`.
- d233ea22 declara en `progress/current.md` el fallback al `implementer` (CLAUDE.md §Excepciones) para las Adendas 5 y 6, y dice que se pierde la separación entre quien implementa y quien revisa. Lo tengo en cuenta: este delta no trae código de producto, solo títulos, una suma y un `describe` de tests.
- `git diff --check 2c103bb4 HEAD -- mobile-pet-tracker` sale limpio.

### 5. Pasos de smoke de 1e074826 frente a la spec
Comparé cada literal con `catalog.ts` (es) y con R4–R21:
- Son correctos: «Familia» y «Solo tú cuidas a …» (R4, R5), «Dueño» (R9), «Invitar a alguien» → invitación (R13), el código 5+5 con guion (R14, `formatInviteCode`), «Vence el … · sirve una sola vez» y «Mensaje que se enviará» (R14).
- También cuadran: «Copiar código» → «Código copiado» con el código con guion en el portapapeles, y «Compartir» → `Share.share` con el mensaje (R15).
- Lo mismo con la familia: «Invitaciones pendientes» y la nota del código (R12, R13), «Unirme» → Inicio con la mascota (R21) y «Salir de esta mascota» con confirmación (R16, R17).
- En la parte de dueño, también: «¿Quitar a <B>?» (R11), y que la invalidación de `memberKeys.list` deja el subtítulo de Perfil en «Solo tú…».
- Son ciertos el «menor 4 de la segunda revisión» y que la spec diga que el smoke «bloquea `done`» (requirements.md:818–821).
- Tres puntos no cuadran (ver hallazgos).

### Hallazgos de la tercera revisión, por severidad

**Bloqueantes**: ninguno.

**Menores** (son del leader, en `progress/smoke_mejoras-producto.md`, y no afectan al código ni al veredicto; conviene corregirlos antes de que el humano corra G4):
1. **Paso 6: «desde Perfil o desde Inicio» es falso en general.** R7 solo pinta `home-join-pet` mientras Inicio muestra `home-no-pets-screen`. La cuenta B se define como «sin esa mascota», no «sin mascotas». Si B tiene alguna mascota propia, Inicio no ofrece «Unirme con código» y el paso no se puede hacer por ahí. Propuesta: «desde Perfil; desde Inicio solo si B no tiene ninguna mascota (R7)». Para probar R7 en el dispositivo hace falta una B con cero mascotas.
2. **La nota del rebuild sitúa mal el fallo y cita mal el mensaje.**
   - Qué dice la nota: «Sin rebuild, «Copiar código» rompe con «Cannot find module»».
   - Por qué falla antes: `expo-clipboard` 57.0.2 llama a `requireNativeModule('ExpoClipboard')` al cargar el módulo (`node_modules/expo-clipboard/build/ExpoClipboard.js:3`), y `src/screens/pet-invite/index.tsx:2` lo importa arriba del todo.
   - Qué pasa en realidad: sin rebuild, el error es «Cannot find native module 'ExpoClipboard'». Salta al evaluar la pantalla de invitación, en el paso 2 o antes, no al pulsar «Copiar código».
   - El rebuild sí hace falta, así que la conclusión es correcta.
3. **Paso 9 sin precondición.** Las invitaciones de los pasos 2 y 8 son de un solo uso y B ya las consumió, así que en el paso 9 no queda ninguna pendiente. Falta «Invita otra vez y, sin usarla, …». Con una sola invitación, revocarla quita toda la sección (R12: `[]` → sin `pet-invites-heading`), no solo la fila.

**Observaciones** (no bloquean):
1. **La cabecera del smoke dice «Reviewer APROBADO sobre `7c079da8`».** Tras esta revisión, el hash revisado es 2a00094f.
2. **Detalle impreciso en el reporte (Adenda 6 §A).** Dice que `join-pet` entra «en la lista de `segmented-control`». La entrada de #214 en esa lista (`rounded-10`) es `screens/pet-members/index.tsx` (R12). `join-pet` entra en `tracking-title`. El código está bien; solo es la redacción.
3. **`git diff --check 7c079da8 HEAD`** avisa de «new blank line at EOF» en `components/__tests__/tab-pet-header.test.tsx:97`. Llega de dev (#222) con el merge y no lo introduce #214.
4. `progress/impl_mobile-pet-members.done` no está en el árbol. Lo ignora git (`.gitignore:27`), y es de suponer que lo consumió `watch-impl.sh`. No afecta al veredicto.

**Veredicto de la tercera revisión: aprobado.** Queda condicionado a que el `./init.sh` del leader salga verde sobre 2a00094f. Un commit nuevo bajo `mobile-pet-tracker/`, merge incluido, exige relanzar al reviewer.

Hash revisado: 2a00094f
