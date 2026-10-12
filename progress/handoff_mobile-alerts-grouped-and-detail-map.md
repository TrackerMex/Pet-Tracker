# Handoff a Codex CLI — #170 mobile-alerts-grouped-and-detail-map

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `f994612f`, aprobación vía Notion el 2026-10-12, «aprobada tal cual»: P1 a
> P8 quedan con la opción que la spec ya prescribe). Primera parte de la fila 4
> del canvas aprobado el 2026-10-06: la lista de Alertas se agrupa en Hoy /
> Esta semana / Anteriores con un contador «N nuevas» y un borde de severidad
> en las filas abiertas; el detalle gana el mismo borde, un mini-mapa con la
> posición de la alerta, la distancia al borde de su zona y un CTA «Ver en el
> mapa». Son 28 commits: R1-R10 y R15 en pares rojo/verde, R11-R14 un commit
> de test cada uno (nacen verdes tras R10), uno de trazabilidad y uno de lista
> cerrada. El smoke R17, en un dev build de Android, es del humano y cierra la
> feature.
>
> `node_modules` ya está en `Pet-Tracker-wt-170/mobile-pet-tracker`. La branch
> ya incluye `origin/main` d2b8b0ae (con #166 mergeada): no hace falta merge
> antes de H0. No hay dependencias nuevas ni assets. Copy nuevo: las siete
> claves de requirements.md §Copy nuevo.
>
> Correcciones del leader en H0, medidas contra los ficheros (mandan sobre
> tasks.md):
>
> 1. **T1, coma final.** La expresión de `expect(englishKeys).toHaveLength(`
>    termina hoy en `        - 1, // #159 R2` con la coma del argumento. La
>    línea nueva va debajo y se lleva la coma: `        - 1 // #159 R2` y
>    `        + 7, // #170 R1`.
> 2. **T10 y T15, longitud de `R13_ALERT_DETAIL`.** La línea entera pasa a
>    `    expect(R13_ALERT_DETAIL).toHaveLength(11 - 3 + 1); // #170 R16` (T10)
>    y a `… + 2); // #170 R16` (T15); el comentario `// #134 R6` se sustituye.
> 3. **Sumas de `consistency-classnames`, líneas exactas.** T4:
>    `      14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6, #170 R16`;
>    T10 la misma con un `+ 1` más; T8:
>    `    ).toBe(33 + 1 + 1 - 1 - 1 + 1 + 1); // #41 R9: geofences-link, #170 R16`.
> 4. **Sonda T4-a.** La pantalla tiene un solo `return` y el contador va antes
>    del `FlatList`: pintarlo siempre tumba también
>    `'baja al marcar leída y desaparece en 0'`. Son 5 rojos, no 4.
> 5. **Sonda T8-a.** `DEFAULT_CENTER` se escribe como literal
>    `{ latitude: 19.4326, longitude: -99.1332 }` en la mutación.
> 6. **Sonda T9-a.** El it `#100 R3` › `'respeta las métricas A11 bajo cabecera nativa'`
>    afirma `flex-1 bg-background` con `payload: {}`: la sonda da 4 rojos, no 3.
> 7. **Sonda T11-b.** `MAP_ZOOM` vale `undefined` bajo el doble de `pet-map`:
>    la mutación usa el literal `zoom={16}`. Se mide tras c23, cuando T12 y
>    T13 existen.
> 8. **Sonda T13-a y T14-b**, concretadas abajo en S13.1 y S14.2.
> 9. **Sonda T16-a.** Tumba dos it, no uno: `'registra cada ocurrencia del detalle'`
>    y `#65 R18` › `'resuelve cada ocurrencia de la tabla contra la clave exacta'`.
>
> 10. **Enmienda E1 (tras la parada en c16).** El verde de T8 también cambia,
>     en `consistency-classnames` › `#98 R10`, el recuento global
>     `expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link`
>     a `….toBe(31 + 1 + 1); // #41 R9: geofences-link, #170 R8: alert-detail-map`
>     (requirements.md §Enmienda E1). La cadena de c16 de abajo ya lo recoge.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-170   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-alerts-grouped-and-detail-map.md.
El hash es H0 (el commit que anade este handoff). En todos los comandos de
abajo, sustituye `<H0>` por ese hash literal: todos los `git diff` se miden
contra el. PARA si la branch no es
feature/170-mobile-alerts-grouped-and-detail-map o si `git status --short`
no sale vacio. No toques /home/claude/sites/Pet-Tracker, Pet-Tracker-wt-167,
Pet-Tracker-wt-168, Pet-Tracker-wt-169, Pet-Tracker-wt-171 ni ningun otro
worktree, ni cambies de branch en ninguno.

Feature: mobile-alerts-grouped-and-detail-map (#170)
Branch: feature/170-mobile-alerts-grouped-and-detail-map
Spec aprobada: specs/mobile-alerts-grouped-and-detail-map/requirements.md
(firma f994612f). Las preguntas P1-P8 de requirements.md estan cerradas con
la opcion que la spec ya prescribe: no reabras ninguna. Lee, enteros:
requirements.md, design.md, tasks.md y traceability.md de
specs/mobile-alerts-grouped-and-detail-map/. tasks.md es tu guion (sus
Reglas, T0-T17). Los titulos de describe e it, las clases, el copy, las
coordenadas y las rutas son LITERALES: copialos tal cual, con sus tildes y
sus simbolos (`%s`, `$fila`, `«»`, `→`, `—`).

== QUE HACES ==

Los 28 commits, en este orden exacto: T1 R1, T2 R2, T7 R7, T3 R3, T4 R4,
T5 R5, T6 R6, T8 R8, T9 R9, T10 R10 (rojo y verde cada uno), T11 R11,
T12 R12, T13 R13, T14 R14 (un commit de test cada uno), T15 R15 (rojo y
verde), el commit de trazabilidad y el de lista cerrada. Rojo SIEMPRE
antes de su verde, en commits separados. Si escribes un verde antes que su
rojo, ese requisito nace verde y pierde su historial (C4 de CHECKPOINTS.md);
en #19 se metio todo en un solo commit y no vale.

Esto manda sobre tasks.md:
- NO lances ./init.sh. Lo corre el leader (comparte Postgres y LocalStack
  con otras sesiones).
- La suite entera (tasks.md T16) va con el comando ALL de abajo
  (FORCE_COLOR=0, salida a fichero, pgrep antes).
- Sondas: primero commiteas el verde (o el test) que las nombra y DESPUES
  plantas cada sonda sobre ese HEAD, la mides y la reviertes. Asi
  `limpio=0` es verificable. S11.2 va tras c23, no tras c21.
- Trazabilidad: traceability.md se rellena entera UNA vez, al final, en el
  commit de trazabilidad (c27). Ningun commit de T1-T15 la toca, aunque
  tasks.md §Reglas diga «tras el commit verde de cada tarea».
- No hay commits `refactor(...)`: tasks.md no preve ninguno.
- Mide con `FORCE_COLOR=0` delante de `bunx jest`, `--runTestsByPath` y la
  salida a un fichero, como en las cadenas de abajo (tasks.md dice
  `bunx jest <ruta>`; vale lo de aqui).
- Typecheck y lint: `bun run typecheck` (es `tsc --noEmit`) y
  `bunx expo lint --no-cache`. Nunca `bun run lint` (usa la cache de eslint
  y en #155 dio un error obsoleto).

== BASE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-170/mobile-pet-tracker && pwd
  -> /home/claude/sites/Pet-Tracker-wt-170/mobile-pet-tracker
Todo lo de esta seccion (salvo M1-M6) y COMMITS va desde ahi. Las anclas H y P,
M1-M6 y el final del CIERRE van desde la raiz
(`cd /home/claude/sites/Pet-Tracker-wt-170 && pwd`).

Error de invocacion: si un comando falla ANTES de que arranquen jest, tsc o
eslint (`No such file or directory`, `command not found`, un `ERR_PNPM_*` o
un `pwd` que no es el esperado) y no has tocado ningun fichero, NO es una
parada: haz el `cd` literal de arriba, repite el comando y anotalo en el
impl. Cualquier otro fallo si es una parada.

origin/main = d2b8b0ae al escribir este handoff, y la branch ya lo incluye:
lo esperado es exit=0. Al arrancar:
`git fetch origin` y `git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
Anota el exit en el impl. Si da 1 (otra feature mergeo antes), NO pares:
trabajas sobre H0 igual y el merge de main en la branch lo hace el leader.
Nunca rebasees ni mergees.

- `test -d node_modules && echo presente` -> presente. Si no sale,
  `bun install --frozen-lockfile`; si el sandbox te lo deniega, PARA.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0 (M6). Va en
  cada cadena de commit; si un dia da 1, PARA y pide al humano que lo
  borre. Nunca `rm -f` (tu sandbox lo deniega).
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la
  maquina; espera a que salga vacio antes de cualquier jest entero (el ALL
  de la base y el del Cierre).

Variable de produccion, definela en la shell antes de las anclas y de cada
cadena que la use; sin comillas al usarla:
  PROD="--include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__"

M1-M6 de requirements.md §Medir al arrancar: ejecutalos tal cual desde la raiz y copia su
salida al impl. Esperado en H0: M1 -> ['done']; M2 -> 1, 1, 1, 1 (son H15-H18
de abajo); M3 -> la expresion termina en `+ 4 // #159 R1` y `- 1, // #159 R2`
(H6); M4 -> las dos sumas de H13 y H14; M5 -> la ultima es `§2.23` (H35),
asi que #170 toma `§2.24`; M6 -> exit=0.

Base medida por el leader el 2026-10-12 en este worktree con el arbol de H0,
con el comando BASE (un solo jest, FORCE_COLOR=0, sin pipe): exit=0,
`Test Suites: 8 passed, 8 total` y `Tests:       309 passed, 309 total`.
Reparto por fichero:
  src/screens/alerts/index.test.tsx                      44
  src/screens/alert-detail/index.test.tsx                29
  src/app/__tests__/layout.test.tsx                      26
  src/providers/__tests__/language-provider.test.tsx     25
  src/__tests__/ui-language.test.ts                      30
  src/__tests__/consistency-classnames.test.ts           63
  src/__tests__/design-drift.test.ts                     65
  src/__tests__/legibility-classnames.test.ts            27
Tu medida manda: repite el comando BASE y anota sus dos lineas en el impl.
Si el total no es 309 o algo nace rojo, mide fichero a fichero, anota y
PARA.

Comando BASE:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/170-base.txt 2>&1; echo "exit=$?"

Comando ALL (la suite entera; con `pgrep -af '[i]nit\.sh'` vacio antes y
sin lanzar nada mas mientras corre):
  FORCE_COLOR=0 bunx jest > /tmp/170-all-base.txt 2>&1; echo "exit=$?"
  -> exit=0. Copia al impl sus lineas `Test Suites:` y `Tests:`. Si exit no
     es 0, anota los `●` y PARA.
  ALL base (leader, H0): exit=0, `Test Suites: 98 passed, 98 total` y
  `Tests:       2775 passed, 2775 total`. Cierre esperado: 100 suites y
  2893 tests (2775 + 118; #170 crea dos ficheros de test).

Comando GUARDAS (los candados de carta; lo corre cada verde; siempre
65 + 27 = 92):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/170-gN-guardas.txt 2>&1`.

Comando FINAL (el BASE mas los dos ficheros nuevos; solo en el Cierre):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts src/utils/alert-sections.test.ts src/utils/alert-location.test.ts > /tmp/170-final.txt 2>&1; echo "exit=$?"

== ANCLAS ==

Ejecutalas TODAS desde la RAIZ antes de tocar nada y copia la salida al
impl. Solo estos comandos son anclas; los numeros de linea no lo son. Si
alguna no da EXACTAMENTE lo esperado, PARA y avisa (ante una diferencia
manda el fichero, no el handoff). Cuando `grep -c` cuenta 0 sale con codigo
1: lo que vale es la cifra impresa. El leader las ha ejecutado todas en H0
sacandolas de este mismo fichero.

H1. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-12) ← gate obligatorio antes de implementar' specs/mobile-alerts-grouped-and-detail-map/requirements.md   -> 1
H2. grep -cF -- '- [ ] Smoke R17 en dev build de Android verificado por humano (fecha: ____, build: ____, tema claro ☐ oscuro ☐)' specs/mobile-alerts-grouped-and-detail-map/requirements.md   -> 1
H3. grep -cF '"status": "in_progress"' feature_list.json   -> 1
H4. grep -rlF '#170' mobile-pet-tracker/src | wc -l   -> 0
H5. ls mobile-pet-tracker/src/utils/alert-sections.ts mobile-pet-tracker/src/utils/alert-sections.test.ts mobile-pet-tracker/src/utils/alert-location.ts mobile-pet-tracker/src/utils/alert-location.test.ts 2>/dev/null | wc -l   -> 0
H6. grep -cF -- '- 1, // #159 R2' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
H7. grep -cF "describe('#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros'" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
H8. grep -cF 'expect(R13_ALERT_DETAIL).toHaveLength(11 - 3); // #134 R6' mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
H9. grep -cF "describe('#100 R10: el detalle de alerta resuelve su copy por clave'" mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
H10. grep -cF "describe('#78 R12: el centro de alertas resuelve su copy por clave'" mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
H11. awk '/^export const R12_ALERTS/,/^];/{ if (/\{ file/) n++ } END { print n }' mobile-pet-tracker/src/__tests__/ui-copy-table.ts   -> 20
H12. awk '/^export const R13_ALERT_DETAIL/,/^];/{ if (/\{ file/) n++ } END { print n }' mobile-pet-tracker/src/__tests__/ui-copy-table.ts   -> 8
H13. grep -cF ').toBe(33 + 1 + 1 - 1 - 1 + 1); // #41 R9: geofences-link' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H14. grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H15. grep -cF '`rounded-xl border-2 border-b-6 border-lip-gray bg-surface`' docs/ui-guidelines.md   -> 1
H16. grep -cF "const recipe = 'rounded-xl border-2 border-b-6 border-lip-gray bg-surface';" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H17. grep -cF 'expect(count(/border-lip-gray/g)).toBe(4);' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H18. grep -cF 'expect(count(/\bborder-b-6\b/g)).toBe(4);' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H19. grep -cF "describe('#166 R3: el secundario neutro lleva el labio gris'" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H20. grep -cF "it('inventaría los cuatro secundarios neutros de toda la app'" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H21. grep -cF "expect(card.props.className).toBe('rounded-card border border-border bg-surface p-4 shadow-sm min-h-44 gap-3');" mobile-pet-tracker/src/screens/alert-detail/index.test.tsx   -> 1
H22. grep -cF "it('respeta las métricas A11 bajo cabecera nativa'" mobile-pet-tracker/src/screens/alert-detail/index.test.tsx   -> 1
H23. grep -cF "it('le da la cabecera nativa de #95 R4 con el título del detalle'" mobile-pet-tracker/src/app/__tests__/layout.test.tsx   -> 1
H24. grep -cF "<Stack.Screen name=\"alerts/[alertId]\" dangerouslySingular options={{ ...headerOptions, title: t('alerts.detailTitle') }} />" mobile-pet-tracker/src/app/_layout.tsx   -> 1
H25. grep -cF "const [background, foreground] = useThemeColors(['background', 'foreground']);" mobile-pet-tracker/src/app/_layout.tsx   -> 1
H26. grep -cF 'export const MAP_ZOOM = 16;' mobile-pet-tracker/src/components/pet-map.tsx   -> 1
H27. grep -cF 'export const DEFAULT_CENTER: MapCoordinates = { latitude: 19.4326, longitude: -99.1332 };' mobile-pet-tracker/src/components/pet-map.tsx   -> 1
H28. grep -cF 'export function zoomForRadius(radiusM: number): number {' mobile-pet-tracker/src/utils/zoom-for-radius.ts   -> 1
H29. grep -cF "border: '" mobile-pet-tracker/src/utils/alert-meta.ts   -> 0
H30. grep -cF 'export const geofenceKeys = {' mobile-pet-tracker/src/api/query-keys.ts   -> 1
H31. grep -cF 'export async function listGeofences(' mobile-pet-tracker/src/api/geofences.ts   -> 1
H32. grep -cF 'export function useSelectedPet(): SelectedPetContextValue {' mobile-pet-tracker/src/providers/selected-pet-provider.tsx   -> 1
H33. grep -cE '^export const (CONTINUOUS_CORNER|TABULAR_NUMS) = ' mobile-pet-tracker/src/theme/native-styles.ts   -> 2
H34. grep -c '^### §2\.24' specs/mobile-ui-language/design.md   -> 0
H35. grep -cF '### §2.23 — Añadidos por #159 — Pingo sin collar' specs/mobile-ui-language/design.md   -> 1
H36. grep -cF 'const queryClient = createQueryClient(jest.fn(), 60_000);' mobile-pet-tracker/src/screens/alert-detail/index.test.tsx   -> 1
H37. grep -cF 'function renderAlertsInEnglish() {' mobile-pet-tracker/src/screens/alerts/index.test.tsx   -> 1
H38. grep -cF "process.getBuiltinModule('process')" mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx   -> 1
H39. grep -cF "jest.mock('uniwind'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx   -> 1
H40. grep -cF 'useSelectedPet: jest.fn()' mobile-pet-tracker/src/screens/add-pet/index.test.tsx   -> 1
H41. grep -cF 'export type MapCoordinates = { latitude: number; longitude: number };' mobile-pet-tracker/src/components/pet-map.tsx   -> 1
H42. grep -cF 'export interface Geofence {' mobile-pet-tracker/src/api/geofences.ts   -> 1
H43. grep -cF '## 3. La infraestructura' specs/mobile-ui-language/design.md   -> 1
H44. grep -cF 'testID="screen-alerts"' mobile-pet-tracker/src/screens/alerts/index.tsx   -> 1

Valores al cerrar (copialos al impl): H1-H3 sin cambios; H4 no se fija
(anota el valor); H5 -> 4; H6 -> 0; H7 -> 1; H8 -> 0; H9 -> 1; H10 -> 1;
H11 -> 25; H12 -> 10; H13 -> 0; H14 -> 0; H15 -> 1; H16 -> 1; H17 -> 0;
H18 -> 0; H19 -> 1; H20 -> 1; H21 no se fija (anota el valor); H22 -> 1;
H23 -> 1; H24 no se fija (anota el valor); H25-H28 -> 1; H29 -> 3;
H30-H32 -> 1; H33 -> 2; H34 -> 1; H35 -> 1; H36 no se fija (anota el
valor); H37-H44 -> 1. Y en positivo al cerrar, desde la raiz:
  P1. grep -cF '+ 7, // #170 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
  P2. grep -cF 'toHaveLength(11 - 3 + 2); // #170 R16' mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
  P3. grep -cF "'alert-detail-view-map'" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 2
  P4. grep -cF 'toBe(4 + 1); // #170 R16' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 2
  P5. grep -c "t('alerts\.section" mobile-pet-tracker/src/screens/alerts/index.tsx   -> 3
  P6. grep -cF 'contentStyle: { backgroundColor: background }' mobile-pet-tracker/src/app/_layout.tsx   -> 1
  P7. grep -cF "router.dismissTo('/map')" mobile-pet-tracker/src/screens/alert-detail/index.tsx   -> 1
  P8. grep -cF 'className="min-h-11 rounded-xl border-2 border-b-6 border-lip-gray bg-surface"' mobile-pet-tracker/src/screens/alert-detail/index.tsx   -> 1
  P9. grep -cF 'export function alertSection(openedAt: string, now: Date): AlertSection' mobile-pet-tracker/src/utils/alert-sections.ts   -> 1
  P10. grep -cE '^export function (alertPosition|distanceMeters|formatDistance)\(' mobile-pet-tracker/src/utils/alert-location.ts   -> 3
  P11. grep -cF '### §2.24 — Añadidos por #170 — Alertas agrupadas y mini-mapa' specs/mobile-ui-language/design.md   -> 1
  P12. grep -cF '← añadida por #170 (R1)' specs/mobile-ui-language/design.md   -> 7
  P13. grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6, #170 R16' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P14. grep -cF ').toBe(33 + 1 + 1 - 1 - 1 + 1 + 1); // #41 R9: geofences-link, #170 R16' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P15. grep -rhoF 'style={CONTINUOUS_CORNER}' mobile-pet-tracker/src/screens/alert-detail/index.tsx | wc -l   -> 1
  P16. grep -rhoF 'style={TABULAR_NUMS}' mobile-pet-tracker/src/screens/alerts/index.tsx mobile-pet-tracker/src/screens/alert-detail/index.tsx | wc -l   -> 2

== COMMITS ==

Todo desde mobile-pet-tracker/ (el `cd` literal de BASE), con PROD
definida. Cada commit va ENCADENADO con && a su verificacion: si cualquier
eslabon falla, el commit no se hace. Nunca commitees fuera de estas cadenas
ni con un exit distinto de 0 en la cadena (en #115 se commiteo un verde con
el registrador en exit=1). Si una cadena no llega al commit, PARA y reporta
en el impl el eslabon que fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 deja
la linea de resumen de jest en texto plano. Formato:
`Tests:       3 failed, 96 passed, 99 total` y en verde
`Tests:       99 passed, 99 total`. Cada medida lleva su `echo "exit=$?"`;
anota el exit en el impl.

Rojos: cada tarea dice si cae por CONSULTA (`Unable to find` en un
`getBy*`/`findBy*`: el nodo aun no existe), por MODULO (`Cannot find
module`, solo T2 y T7) o por ASERCION (Expected/Received). Nunca por
TypeError, ReferenceError, SyntaxError ni `Test suite failed to run` (salvo
el rojo de modulo de T2 y T7, que es justo eso). Las cadenas de T1, T5, T6
y T9, cuyos rojos son todos por asercion, prohiben ademas `Unable to find`.
La cadena comprueba la cuenta y el tipo; tu ademas abres el log y copias al
impl cada it rojo con su matcher y su Expected/Received (o su consulta). Si
un Received ocupa mas de 20 lineas, copia el matcher, el Expected y las 20
primeras lineas del Received, y nada mas.

`●` son SOLO los encabezados de it rojo: Jest tambien imprime bloques
`  ● Console` (console.warn de Uniwind, console.info de HeroUI) que no
cuentan nunca, ni en sondas ni en rojos; se copian al impl sin filtrar. Por
eso los contadores son `grep -E '^  ● ' <log> | grep -cvxF '  ● Console'`.

Typecheck y lint van en TODAS las cadenas, rojas incluidas, y dan exit 0
(salvo los rojos de modulo de T2 y T7, que comprueban su error exacto).

Cada cadena termina igual, tras su `git add`: la lista exacta de lo
stageado y que no quede nada sin stagear en mobile-pet-tracker/, docs/ ni
specs/ (el impl vive en progress/ sin trackear hasta el Cierre; no lo
stagees antes):
  git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
En las cadenas aparece como `<LIMPIO>`. NUNCA `git status --short` tras un
`git add`: falla siempre (lo stageado sale).

Sondas: sobre el HEAD del commit que las nombra, UNA A UNA. Plantas la
mutacion en el fichero de produccion que dice, mides SOLO el fichero de
test que dice la sonda (salida a /tmp/170-sN.txt, con su `echo "exit=$?"`),
copias al impl la linea `Tests:` y los `●`, y reviertes:
  git checkout HEAD -- <fichero de la sonda>
  git diff --cached --quiet && git diff --quiet; echo "limpio=$?"   -> limpio=0
Nunca `git checkout <commit> -- <fichero>` (deja el cambio en el indice).
Si una sonda no da EXACTAMENTE su linea `Tests:` y sus `●`, PARA. Ninguna
sonda se commitea. Todas caen por ASERCION o por CONSULTA de ausencia
(`toBeNull`), nunca por TypeError ni por modulo.

Abreviaturas de las cadenas (rutas desde mobile-pet-tracker/; escribelas
enteras en los comandos, no las abreviaturas):
  A   = src/screens/alerts/index.test.tsx
  D   = src/screens/alert-detail/index.test.tsx
  L   = src/app/__tests__/layout.test.tsx
  LP  = src/providers/__tests__/language-provider.test.tsx
  UL  = src/__tests__/ui-language.test.ts
  CC  = src/__tests__/consistency-classnames.test.ts
  CT  = src/__tests__/ui-copy-table.ts
  S   = src/utils/alert-sections.test.ts
  LOC = src/utils/alert-location.test.ts
Los mensajes de commit son los de tasks.md §Reglas («Commits
test-primero»), con el <what> que se da en cada cadena.

-- T1 R1: las siete claves --

c1, T1 rojo (tasks.md T1 (1), con la correccion 1 del leader: la coma pasa
de `- 1, // #159 R2` a la linea nueva `+ 7, // #170 R1`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/170-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 54 passed, 56 total`, los dos por asercion
  grep -qE '^Tests: +2 failed, 54 passed, 56 total$' /tmp/170-r1.txt \
    && test "$(grep -E '^  ● ' /tmp/170-r1.txt | grep -cvxF '  ● Console')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/170-r1.txt | grep -cF '#170 R1: claves de alertas agrupadas y mini-mapa')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r1.txt | grep -cF 'mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/170-r1.txt \
    && ! grep -qF 'Unable to find' /tmp/170-r1.txt \
    && test "$(grep -cF -- '- 1 // #159 R2' src/providers/__tests__/language-provider.test.tsx)" = 1 \
    && test "$(grep -cF '+ 7, // #170 R1' src/providers/__tests__/language-provider.test.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/providers/__tests__/language-provider.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R1 red alert grouping and mini-map keys'

c2, T1 verde (tasks.md T1 (2): las siete claves en `en` y `es` de
src/i18n/catalog.ts y, en specs/mobile-ui-language/design.md, la seccion
`### §2.24 — Añadidos por #170 — Alertas agrupadas y mini-mapa` con su
tabla de siete filas en el formato de §2.23, justo despues de la tabla de
§2.23 y antes de `## 3. La infraestructura`, con una linea en blanco antes
y despues):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/170-g1.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       56 passed, 56 total`
  <GUARDAS> > /tmp/170-g1-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +56 passed, 56 total$' /tmp/170-g1.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g1-guardas.txt \
    && test "$(grep -cF '### §2.24 — Añadidos por #170 — Alertas agrupadas y mini-mapa' ../specs/mobile-ui-language/design.md)" = 1 \
    && test "$(grep -cF '← añadida por #170 (R1)' ../specs/mobile-ui-language/design.md)" = 7 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R1 alert grouping and mini-map keys'

-- T2 R2: alertSection --

c3, T2 rojo (tasks.md T2 (1): src/utils/alert-sections.test.ts nuevo, con
la tabla de 15 filas). El fichero tiene UNA sola sentencia import del modulo
nuevo, `import { alertSection } from './alert-sections';`, sin un
`import type` aparte (daria dos errores y la cadena pide uno); las filas van
`as const` para que en el verde tipen contra `AlertSection` sin importarlo:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/utils/alert-sections.test.ts > /tmp/170-r2.txt 2>&1; echo "exit=$?"
    -> exit=1, `Test Suites: 1 failed, 1 total` y `Tests:       0 total`, por
       `Cannot find module './alert-sections' from 'src/utils/alert-sections.test.ts'`
  grep -qE '^Test Suites: +1 failed, 1 total$' /tmp/170-r2.txt \
    && grep -qE '^Tests: +0 total$' /tmp/170-r2.txt \
    && grep -qF "Cannot find module './alert-sections' from 'src/utils/alert-sections.test.ts'" /tmp/170-r2.txt \
    && test "$(grep -c 'Cannot find module' /tmp/170-r2.txt)" = "$(grep -cF "Cannot find module './alert-sections'" /tmp/170-r2.txt)" \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError' /tmp/170-r2.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/170-r2-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/170-r2-tsc.txt)" = 1 \
    && grep -qE '^src/utils/alert-sections\.test\.ts\([0-9]+,[0-9]+\): error TS2307:' /tmp/170-r2-tsc.txt \
    && { bunx expo lint --no-cache > /tmp/170-r2-lint.txt 2>&1 || true; } \
    && grep -qF '✖ 1 problem (1 error, 0 warnings)' /tmp/170-r2-lint.txt \
    && test "$(grep -cF "Unable to resolve path to module './alert-sections'" /tmp/170-r2-lint.txt)" = 1 \
    && git add src/utils/alert-sections.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/utils/alert-sections.test.ts' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R2 red alertSection in local time'

c4, T2 verde (tasks.md T2 (2), requirements.md R2):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/utils/alert-sections.test.ts > /tmp/170-g2.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       15 passed, 15 total`
  <GUARDAS> > /tmp/170-g2-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +15 passed, 15 total$' /tmp/170-g2.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g2-guardas.txt \
    && test "$(grep -cF 'export function alertSection(openedAt: string, now: Date): AlertSection' src/utils/alert-sections.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/utils/alert-sections.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/utils/alert-sections.ts' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R2 alertSection in local time'

-- T7 R7: posicion, distancia y formato (va aqui, tras T2) --

c5, T7 rojo (tasks.md T7 (1): src/utils/alert-location.test.ts nuevo, tres
describe con 12 + 4 + 8 filas). UNA sola sentencia import:
`import { alertPosition, distanceMeters, formatDistance } from './alert-location';`:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/utils/alert-location.test.ts > /tmp/170-r7.txt 2>&1; echo "exit=$?"
    -> exit=1, `Test Suites: 1 failed, 1 total` y `Tests:       0 total`, por
       `Cannot find module './alert-location' from 'src/utils/alert-location.test.ts'`
  grep -qE '^Test Suites: +1 failed, 1 total$' /tmp/170-r7.txt \
    && grep -qE '^Tests: +0 total$' /tmp/170-r7.txt \
    && grep -qF "Cannot find module './alert-location' from 'src/utils/alert-location.test.ts'" /tmp/170-r7.txt \
    && test "$(grep -c 'Cannot find module' /tmp/170-r7.txt)" = "$(grep -cF "Cannot find module './alert-location'" /tmp/170-r7.txt)" \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError' /tmp/170-r7.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/170-r7-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/170-r7-tsc.txt)" = 1 \
    && grep -qE '^src/utils/alert-location\.test\.ts\([0-9]+,[0-9]+\): error TS2307:' /tmp/170-r7-tsc.txt \
    && { bunx expo lint --no-cache > /tmp/170-r7-lint.txt 2>&1 || true; } \
    && grep -qF '✖ 1 problem (1 error, 0 warnings)' /tmp/170-r7-lint.txt \
    && test "$(grep -cF "Unable to resolve path to module './alert-location'" /tmp/170-r7-lint.txt)" = 1 \
    && git add src/utils/alert-location.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/utils/alert-location.test.ts' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R7 red position, distance and format'

c6, T7 verde (tasks.md T7 (2), requirements.md R7, design.md D5; importa
SOLO el tipo `MapCoordinates`, H41):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/utils/alert-location.test.ts > /tmp/170-g7.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       24 passed, 24 total`
  <GUARDAS> > /tmp/170-g7-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +24 passed, 24 total$' /tmp/170-g7.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g7-guardas.txt \
    && test "$(grep -cF "import type { MapCoordinates } from '../components/pet-map';" src/utils/alert-location.ts)" = 1 \
    && test "$(grep -c "from '" src/utils/alert-location.ts)" = 1 \
    && test "$(grep -cE '^export function (alertPosition|distanceMeters|formatDistance)\(' src/utils/alert-location.ts)" = 3 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/utils/alert-location.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/utils/alert-location.ts' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R7 position, distance and format'

-- T3 R3: secciones en la lista --

c7, T3 rojo (tasks.md T3 (1): el describe
`#170 R3: agrupa la lista en Hoy, Esta semana y Anteriores` con 9 it, y
las tres filas de `R12_ALERTS` en CT con `// #170 R16`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alerts/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/170-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       8 failed, 75 passed, 83 total` (6 de R3, por
       asercion o consulta segun tasks.md; `#78 R12` › `registra cada
       ocurrencia de la pantalla` y `#65 R18` › `resuelve cada ocurrencia
       de la tabla contra la clave exacta`, por asercion)
  grep -qE '^Tests: +8 failed, 75 passed, 83 total$' /tmp/170-r3.txt \
    && test "$(grep -E '^  ● ' /tmp/170-r3.txt | grep -cvxF '  ● Console')" = 8 \
    && test "$(grep -E '^  ● ' /tmp/170-r3.txt | grep -cF '#170 R3: agrupa la lista en Hoy, Esta semana y Anteriores')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/170-r3.txt | grep -cF '#78 R12: el centro de alertas resuelve su copy por clave')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r3.txt | grep -cF '#65 R18: los sitios resuelven por clave y no queda copy suelta')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r3.txt | grep -cF 'omite la cabecera de')" = 0 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/170-r3.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/ui-copy-table.ts src/screens/alerts/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/screens/alerts/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R3 red list sections'

c8, T3 verde (tasks.md T3 (2), design.md D2; las tres claves con `t('…')`
literal):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alerts/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/170-g3.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       83 passed, 83 total`
  <GUARDAS> > /tmp/170-g3-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +83 passed, 83 total$' /tmp/170-g3.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g3-guardas.txt \
    && test "$(grep -c "t('alerts\.section" src/screens/alerts/index.tsx)" = 3 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alerts/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alerts/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R3 list sections'
  Despues, la sonda de T3, sobre src/screens/alerts/index.tsx, midiendo solo A:
    S3.1  (T3-a) pinta siempre las tres cabeceras en la primera fila, aunque
          su seccion este vacia
          -> `Tests:       3 failed, 50 passed, 53 total` (las tres filas de
             `omite la cabecera de %s cuando la sección queda vacía`)

-- T4 R4: el contador --

c9, T4 rojo (tasks.md T4 (1): el describe `#170 R4: cuenta las alertas nuevas`
con 10 it; las dos filas de `R12_ALERTS` en CT; en CC `#62 R15` la fila
`[join('screens', 'alerts', 'index.tsx'), 1]` y la linea de `#69 R10` de la
correccion 3):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alerts/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/170-r4.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       9 failed, 148 passed, 157 total`
  grep -qE '^Tests: +9 failed, 148 passed, 157 total$' /tmp/170-r4.txt \
    && test "$(grep -E '^  ● ' /tmp/170-r4.txt | grep -cvxF '  ● Console')" = 9 \
    && test "$(grep -E '^  ● ' /tmp/170-r4.txt | grep -cF '#170 R4: cuenta las alertas nuevas')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/170-r4.txt | grep -cF '#78 R12: el centro de alertas resuelve su copy por clave')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r4.txt | grep -cF '#65 R18: los sitios resuelven por clave y no queda copy suelta')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r4.txt | grep -cF '#62 R15: todo contador usa cifras tabulares')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r4.txt | grep -cF 'no pinta el contador con 0 nuevas')" = 0 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/170-r4.txt \
    && test "$(grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6, #170 R16' src/__tests__/consistency-classnames.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/consistency-classnames.test.ts src/__tests__/ui-copy-table.ts src/screens/alerts/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/screens/alerts/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R4 red new alerts counter'

c10, T4 verde (tasks.md T4 (2), design.md D3; `t('alerts.newOne')` y
`t('alerts.newMany', { count })` literales en dos ramas):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alerts/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/170-g4.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       157 passed, 157 total`
  <GUARDAS> > /tmp/170-g4-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +157 passed, 157 total$' /tmp/170-g4.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g4-guardas.txt \
    && test "$(grep -cF "t('alerts.newOne')" src/screens/alerts/index.tsx)" = 1 \
    && test "$(grep -cF "t('alerts.newMany'" src/screens/alerts/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alerts/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alerts/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R4 new alerts counter'
  Despues, la sonda de T4, sobre src/screens/alerts/index.tsx, midiendo solo A:
    S4.1  (T4-a, correccion 4) pinta siempre el contador con el recuento,
          tambien con 0
          -> `Tests:       5 failed, 58 passed, 63 total` (las cuatro filas
             de `no pinta el contador con 0 nuevas: %s` y `baja al marcar
             leída y desaparece en 0`)

-- T5 R5: borde de severidad en la fila --

c11, T5 rojo (tasks.md T5 (1): el describe
`#170 R5: la fila abierta lleva el borde de su tipo`, 3 + 2 filas):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx > /tmp/170-r5.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 94 passed, 97 total`, los tres por asercion
  grep -qE '^Tests: +3 failed, 94 passed, 97 total$' /tmp/170-r5.txt \
    && test "$(grep -E '^  ● ' /tmp/170-r5.txt | grep -cvxF '  ● Console')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/170-r5.txt | grep -cF '#170 R5: la fila abierta lleva el borde de su tipo')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/170-r5.txt | grep -cF 'sin borde de severidad')" = 0 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/170-r5.txt \
    && ! grep -qF 'Unable to find' /tmp/170-r5.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alerts/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alerts/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R5 red severity border on open rows'

c12, T5 verde (tasks.md T5 (2), design.md D4: el campo `border` en
`AlertTypeMeta`, `ALERT_TYPE_META` y `UNKNOWN_ALERT_META` como literales
completos, y en la fila la unica composicion permitida,
`` ` border-2 ${meta.border}` ``, solo si la fila mostrada esta abierta):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx > /tmp/170-g5.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       97 passed, 97 total`
  <GUARDAS> > /tmp/170-g5-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +97 passed, 97 total$' /tmp/170-g5.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g5-guardas.txt \
    && test "$(grep -cF "border: 'border-danger'" src/utils/alert-meta.ts)" = 1 \
    && test "$(grep -cF "border: 'border-warning-strong'" src/utils/alert-meta.ts)" = 1 \
    && test "$(grep -cF "border: 'border-muted'" src/utils/alert-meta.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alerts/index.tsx src/utils/alert-meta.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.tsx mobile-pet-tracker/src/utils/alert-meta.ts ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R5 severity border on open rows'
  Despues, la sonda de T5, sobre src/screens/alerts/index.tsx, midiendo solo A:
    S5.1  (T5-a) aplica el borde de tipo tambien a las filas no abiertas
          -> `Tests:       2 failed, 66 passed, 68 total` (las dos filas de
             `%s: sin borde de severidad`)

-- T6 R6: borde de severidad en el detalle --

c13, T6 rojo (tasks.md T6 (1): el describe
`#170 R6: la tarjeta abierta lleva el borde de su tipo`, 3 + 2 filas, y la
reescritura nombrada del it A11 de `#100 R3`, H21/H22):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx > /tmp/170-r6.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 30 passed, 34 total`, los cuatro por asercion
  grep -qE '^Tests: +4 failed, 30 passed, 34 total$' /tmp/170-r6.txt \
    && test "$(grep -E '^  ● ' /tmp/170-r6.txt | grep -cvxF '  ● Console')" = 4 \
    && test "$(grep -E '^  ● ' /tmp/170-r6.txt | grep -cF '#170 R6: la tarjeta abierta lleva el borde de su tipo')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/170-r6.txt | grep -cF 'respeta las métricas A11 bajo cabecera nativa')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r6.txt | grep -cF 'conserva la tarjeta sin borde de severidad')" = 0 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/170-r6.txt \
    && ! grep -qF 'Unable to find' /tmp/170-r6.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alert-detail/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alert-detail/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R6 red severity border on open detail'

c14, T6 verde (tasks.md T6 (2)):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx > /tmp/170-g6.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       34 passed, 34 total`
  <GUARDAS> > /tmp/170-g6-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +34 passed, 34 total$' /tmp/170-g6.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g6-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alert-detail/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R6 severity border on open detail'
  Despues, la sonda de T6, sobre src/screens/alert-detail/index.tsx, midiendo solo D:
    S6.1  (T6-a) aplica el borde siempre
          -> `Tests:       2 failed, 32 passed, 34 total` (las dos filas de
             `%s: conserva la tarjeta sin borde de severidad`)

-- T8 R8: el mini-mapa --

c15, T8 rojo (tasks.md T8 (1): los cuatro dobles de tasks.md §Reglas
«Dobles por intencion» con sus `beforeEach` de nivel superior; el describe
`#170 R8: pinta el mini-mapa con la posición de la alerta` con 10 + 2 + 1 + 1
it; en CC `#62 R14` la fila `[join('screens', 'alert-detail', 'index.tsx'), 1]`
y la linea de la suma de la correccion 3):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/170-r8.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       5 failed, 108 passed, 113 total` (4 de R8 por
       consulta; la fila de `#62 R14` por asercion)
  grep -qE '^Tests: +5 failed, 108 passed, 113 total$' /tmp/170-r8.txt \
    && test "$(grep -E '^  ● ' /tmp/170-r8.txt | grep -cvxF '  ● Console')" = 5 \
    && test "$(grep -E '^  ● ' /tmp/170-r8.txt | grep -cF '#170 R8: pinta el mini-mapa con la posición de la alerta')" = 4 \
    && test "$(grep -E '^  ● ' /tmp/170-r8.txt | grep -cF '#62 R14: toda esquina no-cápsula que dibuja el repo es continua')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r8.txt | grep -cF ': sin mapa')" = 0 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/170-r8.txt \
    && test "$(grep -cF ').toBe(33 + 1 + 1 - 1 - 1 + 1 + 1); // #41 R9: geofences-link, #170 R16' src/__tests__/consistency-classnames.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/consistency-classnames.test.ts src/screens/alert-detail/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/alert-detail/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R8 red alert mini-map'

c16, T8 verde (tasks.md T8 (2), design.md D6/D7: `AlertDetailMap` tras la
tarjeta, `circles={[]}` y sin `zoom` todavia; y, por la Enmienda E1, en
src/__tests__/consistency-classnames.test.ts la linea entera
`    expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link`
pasa a
`    expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 1); // #41 R9: geofences-link, #170 R8: alert-detail-map`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/170-g8.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       113 passed, 113 total`
  <GUARDAS> > /tmp/170-g8-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +113 passed, 113 total$' /tmp/170-g8.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g8-guardas.txt \
    && test "$(grep -cF 'style={CONTINUOUS_CORNER}' src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cF 'className="h-52 overflow-hidden rounded-card"' src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cF 'expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 1); // #41 R9: geofences-link, #170 R8: alert-detail-map' src/__tests__/consistency-classnames.test.ts)" = 1 \
    && test "$(grep -cF 'toBe(31 + 1); // #41 R9: geofences-link' src/__tests__/consistency-classnames.test.ts)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/consistency-classnames.test.ts src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/alert-detail/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R8 alert mini-map'
  Despues, la sonda de T8, sobre src/screens/alert-detail/index.tsx, midiendo solo D:
    S8.1  (T8-a, correccion 5) pinta el mapa siempre; sin posicion, con el
          centro literal `{ latitude: 19.4326, longitude: -99.1332 }`
          -> `Tests:       10 failed, 38 passed, 48 total` (las diez filas de
             `$fila: sin mapa`)

-- T9 R9: ningun fondo encima del mapa --

c17, T9 rojo (tasks.md T9 (1): en D el describe
`#170 R9: ningún fondo encima del mapa` con 1 + 3 it; en L, dentro de
`#100 R2`, el it nuevo `#170 R9: pinta el fondo del tema bajo el detalle de alerta`
y la reescritura nombrada del `toEqual` de H23, que suma
`contentStyle: { backgroundColor: 'token:background' }`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx src/app/__tests__/layout.test.tsx > /tmp/170-r9.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 76 passed, 79 total`, los tres por asercion
  grep -qE '^Tests: +3 failed, 76 passed, 79 total$' /tmp/170-r9.txt \
    && test "$(grep -E '^  ● ' /tmp/170-r9.txt | grep -cvxF '  ● Console')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/170-r9.txt | grep -cF '#170 R9: ningún fondo encima del mapa')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r9.txt | grep -cF '#170 R9: pinta el fondo del tema bajo el detalle de alerta')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r9.txt | grep -cF 'le da la cabecera nativa de #95 R4 con el título del detalle')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r9.txt | grep -cF 'la raíz conserva flex-1 bg-background')" = 0 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/170-r9.txt \
    && ! grep -qF 'Unable to find' /tmp/170-r9.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/app/__tests__/layout.test.tsx src/screens/alert-detail/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/app/__tests__/layout.test.tsx mobile-pet-tracker/src/screens/alert-detail/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R9 red no background above the map'

c18, T9 verde (tasks.md T9 (2): raiz condicional en el detalle y
`contentStyle: { backgroundColor: background }` en las opciones de
`alerts/[alertId]` de src/app/_layout.tsx, H24/H25):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx src/app/__tests__/layout.test.tsx > /tmp/170-g9.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       79 passed, 79 total`
  <GUARDAS> > /tmp/170-g9-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +79 passed, 79 total$' /tmp/170-g9.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g9-guardas.txt \
    && test "$(grep -cF 'contentStyle: { backgroundColor: background }' src/app/_layout.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/app/_layout.tsx src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/app/_layout.tsx mobile-pet-tracker/src/screens/alert-detail/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R9 no background above the map'
  Despues, la sonda de T9, sobre src/screens/alert-detail/index.tsx, midiendo solo D:
    S9.1  (T9-a, correccion 6) raiz siempre `flex-1`
          -> `Tests:       4 failed, 48 passed, 52 total` (las tres filas de
             `sin mapa (%s), la raíz conserva flex-1 bg-background` y
             `#100 R3` › `respeta las métricas A11 bajo cabecera nativa`)

-- T10 R10: la distancia a la zona --

c19, T10 rojo (tasks.md T10 (1): constantes `ZONE` y `POS_FAR`; el describe
`#170 R10: pinta la zona y la distancia a su borde` con 6 it; la fila de
`alerts.distanceFromZone` en `R13_ALERT_DETAIL` de CT; en UL la longitud de
la correccion 2 con `+ 1`; en CC `#62 R15` la fila
`[join('screens', 'alert-detail', 'index.tsx'), 1]` y otro `+ 1` en la
linea de `#69 R10`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/170-r10.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       9 failed, 145 passed, 154 total` (6 de R10 por
       consulta; `#100 R10`, `#65 R18` y la fila de `#62 R15` por asercion)
  grep -qE '^Tests: +9 failed, 145 passed, 154 total$' /tmp/170-r10.txt \
    && test "$(grep -E '^  ● ' /tmp/170-r10.txt | grep -cvxF '  ● Console')" = 9 \
    && test "$(grep -E '^  ● ' /tmp/170-r10.txt | grep -cF '#170 R10: pinta la zona y la distancia a su borde')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/170-r10.txt | grep -cF '#100 R10: el detalle de alerta resuelve su copy por clave')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r10.txt | grep -cF '#65 R18: los sitios resuelven por clave y no queda copy suelta')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r10.txt | grep -cF '#62 R15: todo contador usa cifras tabulares')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/170-r10.txt \
    && test "$(grep -cF 'expect(R13_ALERT_DETAIL).toHaveLength(11 - 3 + 1); // #170 R16' src/__tests__/ui-language.test.ts)" = 1 \
    && test "$(grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6, #170 R16' src/__tests__/consistency-classnames.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/consistency-classnames.test.ts src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/alert-detail/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/alert-detail/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R10 red zone and distance to its edge'

c20, T10 verde (tasks.md T10 (2), design.md D6 y requirements.md R10: la
consulta con `geofenceKeys.list(petId)` y `enabled: alert.geofenceId !== null`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/170-g10.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       154 passed, 154 total`
  <GUARDAS> > /tmp/170-g10-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +154 passed, 154 total$' /tmp/170-g10.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g10-guardas.txt \
    && test "$(grep -cF 'style={TABULAR_NUMS}' src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cF "t('alerts.distanceFromZone'" src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cF 'enabled: alert.geofenceId !== null' src/screens/alert-detail/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alert-detail/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R10 zone and distance to its edge'

-- T11-T14: ramas que nacen verdes tras T10 (un commit de test cada una) --

Cada cadena: medir solo D, 0 rojos, typecheck, lint, add D, commit. Si
alguna fila nace roja, NO toques produccion: PARA y anotalo (tasks.md las
da por verdes tras T10; un rojo aqui es un fallo de T10).

c21, T11 (tasks.md T11 (1): el describe
`#170 R11: sin geofenceId pinta el mapa sin zona`, 2 filas):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx > /tmp/170-t11.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       60 passed, 60 total`
  grep -qE '^Tests: +60 passed, 60 total$' /tmp/170-t11.txt \
    && test "$(grep -E '^  ● ' /tmp/170-t11.txt | grep -cvxF '  ● Console')" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alert-detail/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alert-detail/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R11 alert without zone'
  Despues, sobre src/screens/alert-detail/index.tsx, midiendo solo D:
    S11.1 (T11-a) quita el `enabled` de la consulta de zonas
          -> `Tests:       2 failed, 58 passed, 60 total` (las dos filas de R11)

c22, T12 (tasks.md T12 (1): el describe
`#170 R12: sin la zona de la alerta no pinta zona`, 2 filas, cache sembrada):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx > /tmp/170-t12.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       62 passed, 62 total`
  grep -qE '^Tests: +62 passed, 62 total$' /tmp/170-t12.txt \
    && test "$(grep -E '^  ● ' /tmp/170-t12.txt | grep -cvxF '  ● Console')" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alert-detail/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alert-detail/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R12 alert zone no longer exists'
  Despues, sobre src/screens/alert-detail/index.tsx, midiendo solo D:
    S12.1 (T12-a) empareja la zona por `zona.name === alert.payload.geofenceName`
          -> `Tests:       1 failed, 61 passed, 62 total` (`otra zona llamada Casa`)
    S12.2 (T12-b) si no hay coincidencia por id, usa la primera zona
          -> `Tests:       1 failed, 61 passed, 62 total` (`otra zona llamada Casa`)

c23, T13 (tasks.md T13 (1): el describe
`#170 R13: si la consulta de zonas no da ok, mapa sin zona y sin error`, 6 filas):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx > /tmp/170-t13.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       68 passed, 68 total`
  grep -qE '^Tests: +68 passed, 68 total$' /tmp/170-t13.txt \
    && test "$(grep -E '^  ● ' /tmp/170-t13.txt | grep -cvxF '  ● Console')" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alert-detail/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alert-detail/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R13 zone query not ok'
  Despues, sobre src/screens/alert-detail/index.tsx, midiendo solo D:
    S13.1 (T13-a) en el detalle cargado, pinta `alert-detail-error` cuando la
          consulta de zonas ha resuelto con un `kind` distinto de `'ok'`
          -> `Tests:       5 failed, 63 passed, 68 total` (las cinco filas
             sembradas de R13; `pendiente` sigue verde)
    S11.2 (T11-b, correccion 7) cuando no hay zona que pintar, pasa a
          `PetMap` el literal `zoom={16}`
          -> `Tests:       10 failed, 58 passed, 68 total` (las dos filas de
             R11, las dos de R12 y las seis de R13)

c24, T14 (tasks.md T14 (1): el describe
`#170 R14: dentro o en el borde no dice distancia`, 2 filas):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx > /tmp/170-t14.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       70 passed, 70 total`
  grep -qE '^Tests: +70 passed, 70 total$' /tmp/170-t14.txt \
    && test "$(grep -E '^  ● ' /tmp/170-t14.txt | grep -cvxF '  ● Console')" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alert-detail/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alert-detail/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R14 inside or on the edge'
  Despues, sobre src/screens/alert-detail/index.tsx, midiendo solo D:
    S14.1 (T14-a) cambia el umbral de la distancia a `d - radiusM > 0`
          -> `Tests:       1 failed, 69 passed, 70 total` (`a 0,41 m del borde`)
    S14.2 (T14-b) en la rama de dentro o en el borde (`Math.round(d - radiusM) < 1`),
          pasa `circles={[]}` y ningun `zoom`
          -> `Tests:       2 failed, 68 passed, 70 total` (las dos filas de R14)

-- T15 R15: «Ver en el mapa» --

c25, T15 rojo (tasks.md T15 (1): el describe
`#170 R15: Ver en el mapa lleva al Mapa con la mascota de la alerta` con
3 + 1 + 2 + 1 + 1 it; la fila de `alerts.viewOnMap` en `R13_ALERT_DETAIL` de
CT y la longitud de la correccion 2 con `+ 2`; en CC `#166 R3` lo que dice
requirements.md R16: la fila
`[join('screens', 'alert-detail', 'index.tsx'), 'alert-detail-view-map', 'secondary']`
al final de `rows`, `'alert-detail-view-map'` el PRIMERO de la lista del
inventario y los dos recuentos (H17, H18) a `toBe(4 + 1); // #170 R16`; el
nombre del it de H20 NO cambia):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/170-r15.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       10 failed, 165 passed, 175 total` (6 de R15 por
       consulta; `#100 R10`, `#65 R18` y los dos de `#166 R3` por asercion)
  grep -qE '^Tests: +10 failed, 165 passed, 175 total$' /tmp/170-r15.txt \
    && test "$(grep -E '^  ● ' /tmp/170-r15.txt | grep -cvxF '  ● Console')" = 10 \
    && test "$(grep -E '^  ● ' /tmp/170-r15.txt | grep -cF '#170 R15: Ver en el mapa lleva al Mapa con la mascota de la alerta')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/170-r15.txt | grep -cF '#100 R10: el detalle de alerta resuelve su copy por clave')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r15.txt | grep -cF '#65 R18: los sitios resuelven por clave y no queda copy suelta')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/170-r15.txt | grep -cF '#166 R3: el secundario neutro lleva el labio gris')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/170-r15.txt | grep -cF 'no lo pinta')" = 0 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/170-r15.txt \
    && test "$(grep -cF 'expect(R13_ALERT_DETAIL).toHaveLength(11 - 3 + 2); // #170 R16' src/__tests__/ui-language.test.ts)" = 1 \
    && test "$(grep -cF "'alert-detail-view-map'" src/__tests__/consistency-classnames.test.ts)" = 2 \
    && test "$(grep -cF 'toBe(4 + 1); // #170 R16' src/__tests__/consistency-classnames.test.ts)" = 2 \
    && test "$(grep -cF "it('inventaría los cuatro secundarios neutros de toda la app'" src/__tests__/consistency-classnames.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/consistency-classnames.test.ts src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/alert-detail/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/alert-detail/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-alerts-grouped-and-detail-map): #170 R15 red view on map CTA'

c26, T15 verde (tasks.md T15 (2), requirements.md R15: `Button` con
`testID="alert-detail-view-map"` literal, `variant="secondary"`, la receta
exacta de P8, sin `style`, `Button.Label` sin `className` con
`t('alerts.viewOnMap')`; al pulsar, `selectPet(alert.petId)` y despues
`router.dismissTo('/map')`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/alert-detail/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/170-g15.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       175 passed, 175 total`
  <GUARDAS> > /tmp/170-g15-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +175 passed, 175 total$' /tmp/170-g15.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/170-g15-guardas.txt \
    && test "$(grep -cF 'testID="alert-detail-view-map"' src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cF "router.dismissTo('/map')" src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cF "t('alerts.viewOnMap')" src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cF 'className="min-h-11 rounded-xl border-2 border-b-6 border-lip-gray bg-surface"' src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cF 'style={CONTINUOUS_CORNER}' src/screens/alert-detail/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alert-detail/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-alerts-grouped-and-detail-map): #170 R15 view on map CTA'
  Despues, sobre src/screens/alert-detail/index.tsx:
    S15.1 (T15-a) llama a `router.dismissTo('/map')` antes que a `selectPet`;
          mide solo D
          -> `Tests:       1 failed, 77 passed, 78 total` (`selecciona la
             mascota de la alerta y después vuelve al Mapa`)
    S15.2 (T15-b) pinta el CTA tambien en carga y en error; mide solo D
          -> `Tests:       2 failed, 76 passed, 78 total` (`no lo pinta
             mientras carga` y `no lo pinta con error`)
    S15.3 (T15-c) quita ` border-lip-gray` del className del CTA; mide solo CC
          -> `Tests:       2 failed, 65 passed, 67 total` (la fila de
             `alert-detail-view-map` del it.each de `#166 R3` e `inventaría
             los cuatro secundarios neutros de toda la app`)
    S16.1 (T16-a, correccion 9) borra `t('alerts.viewOnMap')` y deja la
          etiqueta vacia; mide solo UL
          -> `Tests:       2 failed, 28 passed, 30 total` (`registra cada
             ocurrencia del detalle` y `resuelve cada ocurrencia de la tabla
             contra la clave exacta`)

== CIERRE ==

Desde mobile-pet-tracker/ (el `cd` literal de BASE otra vez), sin pipe, con
salida al impl:
- El comando FINAL -> exit=0, `Test Suites: 10 passed, 10 total` y
  `Tests:       427 passed, 427 total`. Reparto: A 68, D 78, L 27, LP 26,
  UL 30, CC 67, design-drift 65, legibility 27, S 15, LOC 24.
- `pgrep -af '[i]nit\.sh'` vacio; despues el comando ALL con la salida a
  /tmp/170-all.txt -> exit=0, `Test Suites: 100 passed, 100 total` y
  `Tests:       2893 passed, 2893 total`. Copia las dos lineas. Mientras
  corre, no lances otra cosa. (Es la suite entera de tasks.md T16.)
- `bun run typecheck; echo "exit=$?"` -> exit=0 y
  `bunx expo lint --no-cache; echo "exit=$?"` -> exit=0.
- Lo que no se toca:
  `git diff --quiet <H0> -- package.json bun.lock app.json src/components/pet-map.tsx src/components/card.tsx src/api; echo "exit=$?"`   -> exit=0
- Sin sombras nuevas:
  `git diff <H0> -- src | grep -cE '^\+.*(shadow-|elevation|boxShadow)'`   -> 0
Desde la raiz del repo (`cd /home/claude/sites/Pet-Tracker-wt-170 && pwd`):
- Las anclas H1-H44 con sus valores de cierre, P1-P16 y las comprobaciones
  de tasks.md T16 (todas estan entre H11, H12, P2-P5, P13 y P14).
- `git diff --stat <H0> -- backend-pet-tracker/ infra-pet-tracker/ docs/`   -> vacio
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los 16 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-alerts-grouped-and-detail-map/traceability.md,
solo la columna «Commit (hash + mensaje)»: hash corto + mensaje del rojo y
del verde, `rojo → verde`, para R1-R10 y R15; para R11-R14, el hash y el
mensaje de su unico commit de test (nacen verdes: dilo); para R16, los rojos
de T3, T4, T8, T10 y T15 que meten sus filas. La fila R17 se queda
`pendiente (humano): …` tal cual. No toques su frontmatter, ni la columna de
tests, ni el resto del fichero. Termina el impl con la linea
`R17: pendiente del smoke humano`. c27, desde la raiz:
  git add specs/mobile-alerts-grouped-and-detail-map/traceability.md progress/impl_mobile-alerts-grouped-and-detail-map.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-alerts-grouped-and-detail-map.md specs/mobile-alerts-grouped-and-detail-map/traceability.md ' \
    && git commit -m 'docs(mobile-alerts-grouped-and-detail-map): #170 traceability'
Despues, la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-alerts-grouped-and-detail-map.md' ':!specs/mobile-alerts-grouped-and-detail-map/requirements.md' ':!specs/mobile-alerts-grouped-and-detail-map/design.md' ':!specs/mobile-alerts-grouped-and-detail-map/tasks.md' ':!progress/review_mobile-alerts-grouped-and-detail-map.md'
    -> exactamente los 19 ficheros de abajo
y c28, desde la raiz:
  git commit --only progress/impl_mobile-alerts-grouped-and-detail-map.md -m 'docs(mobile-alerts-grouped-and-detail-map): #170 closed file list'
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- UI movil: docs/ui-guidelines.md manda (carta). Cero hex fuera de
  src/theme/, cero `StyleSheet.create`, cero clases entre corchetes, cero
  sombra nueva (`shadow-*`, `elevation`, `boxShadow`), cero animacion. Las
  clases son literales completos; las de borde viven en alert-meta.ts y la
  UNICA composicion permitida es la de design.md D4,
  `` ` border-2 ${meta.border}` ``. Los unicos `style` son
  `style={CONTINUOUS_CORNER}` en `alert-detail-map` y
  `style={TABULAR_NUMS}` en el contador y en la distancia.
- Skills: carga `building-native-ui` y `native-data-fetching` (tu plugin
  expo; la consulta de zonas es TanStack Query) y, de .agents/skills/ del
  repo, `appllama-app-design-skill` (OBLIGATORIA: cambias dos pantallas;
  ver docs/ui-guidelines.md §Skills y sus tres limites) y
  `emil-design-eng`. Las decisiones de la spec mandan sobre cualquier skill.
  Descartado: animacion de cualquier tipo (Reanimated, `entering`,
  `MOTION_*`, LayoutAnimation, Lottie, Rive), `expo-linear-gradient`,
  `expo-symbols`, `SectionList` (design.md §Alternativas descartadas),
  sombras, hex fuera de src/theme/, `StyleSheet.create` o clases
  arbitrarias. Di en el impl cuales cargaste.
- Convenciones: docs/conventions.md, en particular §Tests y §Esperas: se
  espera sobre el arbol renderizado (`findByTestId`, `waitFor` sobre el
  nodo o sus props), NUNCA sobre el contador de un mock; toda ausencia se
  ancla antes a un nodo positivo del mismo escenario. RNTL 14:
  `await fireEvent.press(…)` y `await fireEvent(lista, 'onEndReached')`,
  siempre con await. Zona horaria con
  `process.getBuiltinModule('process')` (H38), nunca `process.env.TZ`.
  `Date.now` con `jest.spyOn(Date, 'now')` y `jest.restoreAllMocks()`.
- Valores esperados LITERALES en los tests (copy, clases, coordenadas,
  rutas, `{ fontVariant: ['tabular-nums'] }`, `{ borderCurve: 'continuous' }`),
  nunca el simbolo importado de produccion: nada de `TABULAR_NUMS`,
  `CONTINUOUS_CORNER`, `ALERT_TYPE_META`, `zoomForRadius` ni `MAP_ZOOM` en
  las aserciones. Las ausencias con `toBeNull()`, `not.toContain(...)` o
  `not.toMatch(re)`, nunca `expect(re.test(x)).toBe(false)`.
- Dobles: los cuatro de tasks.md §Reglas, por intencion, comprobados contra
  el fichero real antes de escribirlos. El de `pet-map` NO hace
  `jest.requireActual('../../components/pet-map')` (arrastraria
  `expo-maps`). Precedentes: H39 (uniwind) y H40 (useSelectedPet).
- Imports en los tests: NOMBRADOS, nunca `import * as` (eslint
  `import/namespace` es error y tumbaria la cadena). Reutiliza lo que ya hay
  en cada fichero (`makeAlert`, `DetailWrapper`, `renderDetail`,
  `renderAlerts`, `renderAlertsInEnglish`, `openingTagWithTestId`,
  `readSource`, `checkUses`...): no los dupliques. Todo describe nuevo va AL
  FINAL de su fichero, salvo el it nuevo de L, que va dentro de `#100 R2`.
- design-drift recorre tambien los tests co-locados (src/screens/**,
  src/utils/**): todo `#170` que escribas, en produccion o en test, va
  seguido de ` R<n>` (un `#170` suelto lo caza el guard de hex).
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo con
  bun/bunx, nunca npm/npx. Nada de prettier (mobile no lo usa).
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten otras
  sesiones y el gate lo corre el leader.
- No toques ningun fichero fuera de la lista de abajo (las sondas,
  revertidas, no cuentan). En particular, NO: src/components/pet-map.tsx,
  src/components/card.tsx, src/api/*, src/theme/*, docs/, assets/.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter de los ficheros de la spec,
  tasks.md, design.md y las casillas de §Aprobación y §Smoke R17 de
  requirements.md. Los escribe el leader o el humano. Todo lo que tengas
  que contar va en progress/impl_mobile-alerts-grouped-and-detail-map.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (19, ni uno mas):
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/app/__tests__/layout.test.tsx
  mobile-pet-tracker/src/app/_layout.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/screens/alert-detail/index.test.tsx
  mobile-pet-tracker/src/screens/alert-detail/index.tsx
  mobile-pet-tracker/src/screens/alerts/index.test.tsx
  mobile-pet-tracker/src/screens/alerts/index.tsx
  mobile-pet-tracker/src/utils/alert-location.test.ts
  mobile-pet-tracker/src/utils/alert-location.ts
  mobile-pet-tracker/src/utils/alert-meta.ts
  mobile-pet-tracker/src/utils/alert-sections.test.ts
  mobile-pet-tracker/src/utils/alert-sections.ts
  progress/impl_mobile-alerts-grouped-and-detail-map.md
  specs/mobile-alerts-grouped-and-detail-map/traceability.md
  specs/mobile-ui-language/design.md
  (y ninguno mas: 16 bajo mobile-pet-tracker/, uno en specs/mobile-ui-language/,
  traceability e impl)
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de la lista cerrada; cualquier otro fichero
ajeno en `git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R16 de requirements.md. El smoke R17 (dev build
de Android, NO Expo Go: expo-maps no corre ahi) es del humano: no lo
marques. Deja en el impl sus pasos, listos para el humano: los cinco puntos
de requirements.md R17, en tema claro y en tema oscuro, y la casilla que
firma (`## Smoke R17`).

Al terminar, progress/impl_mobile-alerts-grouped-and-detail-map.md debe
tener: pwd, branch, H0 y status; el exit de is-ancestor; node_modules
(presente o instalado); skills cargadas; M1-M6; la salida de las 44 anclas
(H1-H44) en H0 y la de cierre, mas P1-P16; la base con su exit (comando
BASE) y el ALL de la base; los 26 commits de T1-T15 con hash y R-id; por
cada rojo, el comando, la linea `Tests:` (o `Test Suites:` en T2 y T7), el
exit y cada it rojo con su matcher y Expected/Received o su consulta; cada
verde y cada commit de T11-T14 con sus lineas `Tests:`, GUARDAS (los
verdes), typecheck y lint; las sondas S3.1, S4.1, S5.1, S6.1, S8.1, S9.1,
S11.1, S12.1, S12.2, S13.1, S11.2, S14.1, S14.2, S15.1, S15.2, S15.3 y
S16.1 con su linea `Tests:` roja, sus `●` y su `limpio=0`; el cierre (FINAL
con 427, ALL con exit y total, typecheck, lint, los dos diffs vacios, el
recuento de sombras, lista cerrada); los pasos del smoke R17; la linea
`R17: pendiente del smoke humano`; y cualquier decision que la spec no
cerrara literalmente.
```
