# Handoff a Codex CLI — #148 mobile-keyboard-avoiding-forms

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `faa72f2e`, aprobación vía Notion el 2026-10-04, `page_last_edited_at`
> 2026-10-04T01:38:50Z). Feature móvil. La prueba de humo en el dev build de
> Android (R10, siete casillas) es del humano y cierra la feature, no la spec.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-148   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse --short HEAD` y pega las tres salidas al principio de
progress/impl_mobile-keyboard-avoiding-forms.md. El hash es H0 (el commit
que anade este handoff) y es el «HEAD del handoff» de requirements.md R9 y
de tasks.md §R9: todos los `git diff --name-only` se miden contra el. Para
si la branch no es feature/148-mobile-keyboard-avoiding-forms.
No toques /home/claude/sites/Pet-Tracker (sesion de #105),
Pet-Tracker-wt-backend, Pet-Tracker-wt-ui ni ningun otro worktree, ni
cambies de branch en ninguno.

Feature: mobile-keyboard-avoiding-forms (#148)
Branch: feature/148-mobile-keyboard-avoiding-forms
Spec aprobada: specs/mobile-keyboard-avoiding-forms/requirements.md
(status: approved, firma faa72f2e)
Lee tambien, enteros: specs/mobile-keyboard-avoiding-forms/design.md,
tasks.md y traceability.md. tasks.md es tu guion: §Antes de nada, el
ORDEN de pantallas (login, weight-log, register, reset-password, add-pet,
add-reminder, pairing; NO es el numerico), los tres pasos por pantalla,
los mensajes de commit literales y §Cierre de Codex. En requirements.md:
§Hechos medidos (los valores 200 y 291 y su aritmetica), la plantilla del
`it` de R1-R7 con su tabla de titulos literales y las reglas 1-6, la tabla
de sondas M-a..M-d, el describe/it de R8 con sus titulos, §Aserciones
existentes que se reapuntan (10 `it`, 13 lecturas) y §Wrappers de test.
En design.md: D2 (patron de produccion y el simbolo exacto por pantalla),
D3 (el testID migra a la KAV, el ScrollView pasa a <x>-form), D8 y D9
(candados globales que no se mueven y lista cerrada de 16 ficheros).

== QUE HACES ==

Siete pantallas con inputs se apartan del teclado en Android. Cada una
envuelve su ScrollView en una KeyboardAvoidingView raiz calcada de
src/screens/geofence-editor/index.tsx (#146 E1):

  <KeyboardAvoidingView testID="screen-<x>" className="flex-1"
    behavior="padding" keyboardVerticalOffset={headerHeight}>

con `const headerHeight = useContext(HeaderHeightContext);` (import de
'expo-router/react-navigation') DENTRO del componente que renderiza los
inputs (tabla de design.md D2: Login, Register, ResetPasswordScreen,
AddPetScreen, AddReminderContent, PairingScreen, WeightLogContent). El
ScrollView pasa a testID="<x>-form" y conserva className,
contentInsetAdjustmentBehavior y contentContainerStyle EXACTOS (las
metricas A11 no cambian). En add-pet, add-reminder, pairing y weight-log el
ScrollView anade keyboardShouldPersistTaps="handled" (R8). Sin `Platform`,
sin `?? 0`, sin `enabled`, sin `useHeaderHeight()` en produccion. En
reset-password la KAV va SOLO en la rama formulario (el `return` que
contiene testID="reset-submit"); las ramas reset-missing-token y
reset-success conservan su ScrollView testID="screen-reset-password".

  R1  login           200  sin Provider
  R7  weight-log      291  Provider 91   + R8
  R2  register        200  sin Provider
  R3  reset-password  200  sin Provider (solo rama formulario)
  R4  add-pet         291  Provider 91   + R8
  R5  add-reminder    291  Provider 91   + R8
  R6  pairing         291  Provider 91   + R8
  R9  alcance cerrado: sin test nuevo, medicion al cerrar (tasks.md §R9)
  R10 gate humano (smoke en Android): no es tuyo, no lo marques

== BASE ==

HEAD de la branch contiene origin/main 9cf45204 (merge de #101); la spec se
escribio y se midio sobre ese arbol y mobile-pet-tracker/ no ha cambiado
desde entonces en esta branch. Verifica:
`git merge-base --is-ancestor 9cf45204 HEAD; echo "exit=$?"` -> exit=0.

Base medida por el leader el 2026-10-04 sobre el arbol de H0 (desde
mobile-pet-tracker/, `bunx jest --runTestsByPath` de las 12 suites,
--maxWorkers=2, exit=0): 12 suites / 376 tests / 0 failed / 0 snapshots.
Por suite:
  src/app/(auth)/__tests__/login.test.tsx        10
  src/screens/weight-log/index.test.tsx          31
  src/app/(auth)/__tests__/register.test.tsx     12
  src/screens/reset-password/index.test.tsx      18
  src/screens/add-pet/index.test.tsx             24
  src/screens/add-reminder/index.test.tsx        39
  src/screens/pairing/index.test.tsx             52
  src/__tests__/design-drift.test.ts             57
  src/__tests__/consistency-classnames.test.ts   54
  src/__tests__/legibility-classnames.test.ts    26
  src/__tests__/ui-language.test.ts              29
  src/app/__tests__/layout.test.tsx              24
Tu medida manda: mide cada suite con el comando de su seccion de tasks.md
al arrancar y anota antes/despues en el impl. Delta esperado al cierre:
+1 `it` en login, register y reset-password; +2 en add-pet, add-reminder,
pairing y weight-log (+11 en total: 197 en las 7 suites de pantalla, 387
en las 12); cero `it` borrados; las 5 suites globales sin cambios (190).

Anclas: verifica al arrancar que cada ancla grep de requirements.md da
EXACTAMENTE 1 coincidencia en su fichero: los simbolos de §Hechos medidos
(columna «Componente que renderiza los inputs»), los titulos literales de
`it` de §Aserciones existentes que se reapuntan, las funciones/wrappers de
§Wrappers de test, y `function setPlatform` (1 en add-pet/index.test.tsx,
1 en add-reminder/index.test.tsx). `grep -c "Platform"` = 0 en los 7
ficheros de produccion. Si alguna no da su numero, PARA y avisa en el
impl; no re-anclas tu.

== COMMITS ==

Mensajes LITERALES de tasks.md, en este orden (15 commits):
  test(mobile): lock the keyboard padding of login (#148 R1)
  feat(mobile): keep the login form above the keyboard (#148 R1)
  test(mobile): lock the keyboard padding of weight-log (#148 R7, R8)
  feat(mobile): keep the weight-log form above the keyboard (#148 R7, R8)
  test(mobile): lock the keyboard padding of register (#148 R2)
  feat(mobile): keep the register form above the keyboard (#148 R2)
  test(mobile): lock the keyboard padding of reset-password (#148 R3)
  feat(mobile): keep the reset-password form above the keyboard (#148 R3)
  test(mobile): lock the keyboard padding of add-pet (#148 R4, R8)
  feat(mobile): keep the add-pet form above the keyboard (#148 R4, R8)
  test(mobile): lock the keyboard padding of add-reminder (#148 R5, R8)
  feat(mobile): keep the add-reminder form above the keyboard (#148 R5, R8)
  test(mobile): lock the keyboard padding of pairing (#148 R6, R8)
  feat(mobile): keep the pairing form above the keyboard (#148 R6, R8)
  docs(mobile): trace #148 R1-R9 to their tests and commits
El ultimo lleva SOLO specs/mobile-keyboard-avoiding-forms/traceability.md
y progress/impl_mobile-keyboard-avoiding-forms.md. Si una pantalla
necesita refactor, va en su propio commit
`refactor(mobile): <que> (#148 R<n>)` tras su verde y lo cuentas en el
reporte. Las sondas de mutacion NO generan commits.

== REGLAS CRITICAS ==

- Convenciones: docs/conventions.md (prefijo de feature en describe:
  `#148 R<n>:`, nunca `#148` suelto; titulos literales de requirements.md,
  no los traduzcas ni los acortes).
- Esperas: docs/conventions.md §Esperas sobre el arbol renderizado. La
  espera final de cada `it` de R1-R7 es
  `await waitFor(() => expect(screen.getByTestId('screen-<x>')).toHaveStyle({ paddingBottom: <N> }))`:
  espera al NODO y vuelve a consultarlo DENTRO del waitFor. Nunca esperes a
  un contador de mock ni consultes el arbol fuera del waitFor. En
  add-reminder y weight-log, antes de tomar el host,
  `await waitFor(() => expect(screen.getByTestId('screen-<x>')).toBeVisible())`.
- UI movil: docs/ui-guidelines.md rige (gate C8). Skill de Codex a cargar:
  `building-native-ui`. NO hay skill de router ni de teclado en tu catalogo:
  el patron entero esta en design.md D2 y en
  src/screens/geofence-editor/index.tsx; no pidas skills por otros nombres.
  `appllama-app-design-skill` (.agents/skills/) no aplica aqui: no se disena
  ni redisena ninguna pantalla, las metricas A11 no cambian. Di en el
  reporte cuales cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md): por pantalla, un commit ROJO (los
  describe nuevos + los reapuntes a <x>-form + Provider/imports del wrapper)
  y un commit VERDE (produccion). Un commit con todo incumple C4 (paso en
  #19). Cada rojo falla EXACTAMENTE lo que requirements.md declara: el `it`
  de R<n> por ASERCION en `toHaveStyle({ paddingBottom: 0 })` (el host es
  hoy el ScrollView, sin esa clave); el `it` de R8 y los `it` reapuntados
  por CONSULTA `getByTestId('<x>-form')`. Nunca por SyntaxError,
  ReferenceError, TypeError o import roto. Si falla otro `it` (por ejemplo
  `#90 R6` de add-pet), PARA y reportalo. No ajustes ninguna asercion para
  que cuadre.
- Volteo de plataforma: `(Platform as { OS: string }).OS = 'android'`
  DENTRO del `it`, antes de render, restaurado en el afterEach del describe
  nuevo. Nunca a nivel de fichero ni en un beforeEach global. En add-pet y
  add-reminder reutiliza `setPlatform` / `originalPlatform` existentes. El
  evento es `keyboardDidShow` (NO keyboardWillShow). El evento layout lleva
  `persist() {}`.
- Sondas M-a, M-b, M-c, M-d (tabla de requirements.md): se plantan sobre
  el verde de cada pantalla, una a una, anotas que `it` cae y con que
  asercion o consulta, y las reviertes con `git checkout HEAD -- <ruta>`;
  `git diff --cached --stat` vacio despues. M-d solo aplica a las cuatro
  con R8; para login/reset-password anota el `it` existente que la cubre y
  para register anota «sin cubridor» (§Fuera de alcance). Nunca
  `git checkout <commit> -- <ruta>`, ni git stash, ni rm -f.
- Jest: siempre `--runTestsByPath` y cada ruta con `(auth)` ENTRE COMILLAS
  (los parentesis son regex sin escapar: jest salta el fichero con exit 0).
  Tras cada comando, el numero de suites que imprime jest debe ser el de
  ficheros pedidos (1 por pantalla; 5 en el comando de §Antes de nada).
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de CADA
  `bunx tsc --noEmit`. Si existe, PARA y pide al humano que lo borre. Nunca
  `rm -f` (tu sandbox lo deniega).
- Sin dependencias nuevas: ni `bun add`, ni cambios en package.json,
  bun.lock ni app.json. Todo con bun/bunx, nunca npm/npx.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten otras
  sesiones. Se mide con bunx jest, bunx tsc --noEmit y bunx expo lint,
  desde mobile-pet-tracker/.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail`
  devuelve el codigo de tail. Copia las lineas de resumen al reporte.
- Candados globales (R9.4): si design-drift, consistency-classnames,
  legibility-classnames, ui-language o layout.test.tsx se ponen rojos,
  PARA y reportalo en el impl; no los toques.
- No toques backend-pet-tracker/, src/app/_layout.tsx,
  src/app/__tests__/layout.test.tsx, src/app/(tabs)/food.tsx, los route
  files delgados (src/app/pets/add.tsx, add-reminder.tsx, pairing.tsx,
  reset-password.tsx, weight-log.tsx), src/i18n/catalog.ts ni
  src/__tests__/ui-copy-table.ts (lista completa en requirements.md R9.1).
- Rellena specs/mobile-keyboard-avoiding-forms/traceability.md con los
  hashes solo en el ultimo commit. No rebasees despues de escribir hashes.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Los escribe el leader tras el veredicto
  del reviewer. Todo lo que tengas que contar va en
  progress/impl_mobile-keyboard-avoiding-forms.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`):
los 16 de design.md §Archivos afectados (7 de produccion, 7 tests,
traceability.md y el impl). Nada mas.

Criterios de aceptacion: R1-R9 de requirements.md. R10 (smoke) es del
humano: no lo marques.

Al terminar, escribe progress/impl_mobile-keyboard-avoiding-forms.md con:
pwd, branch y H0; skills cargadas; la salida de las anclas; la base medida
por suite (jest) y tsc/lint con exit; los commits con hash y R-id; por
cada rojo, el comando, las cuentas, el exit y cada `it` rojo con su
matcher, Expected y Received (o la consulta que falla); por cada verde,
sus cuentas y exit; cada sonda M-a..M-d por pantalla con el `it` que cae y
su asercion o consulta; el cierre (las 7 suites de pantalla + las 5
globales, tsc, lint) con exit; las comprobaciones de R9 (`git diff
--name-only H0 HEAD`; `grep -c "Platform"`, `useHeaderHeight(`, `?? 0` y
`enabled=` = 0 en los 7 de produccion; recuento de `<TextInput` en src/
igual a la base; `t('` nuevos = 0; package.json sin cambios); el delta
final por fichero; y cualquier decision que la spec no cerrara
literalmente.
```
