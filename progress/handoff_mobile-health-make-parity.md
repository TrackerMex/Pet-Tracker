# Handoff a Codex CLI — #115 mobile-health-make-parity

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `2bfd4477`, aprobación vía Notion el 2026-10-06). Feature móvil, solo
> presentación: Salud gana el hero a sangre de Home (patrón A9), la gráfica
> de peso de weight-log y la fecha y los días de la próxima vacuna. La prueba
> de humo en el dev build de Android (R9, S1-S9) es del humano y cierra la
> feature, no la spec.
>
> Antes del handoff el leader corrigió `tasks.md` T4: `#69 R10` nace verde en
> el rojo de T4 (suma la tabla `counters` contra una constante; fila y suma
> suben juntas). Es el mismo fallo que la CORRECCION 1 de #116.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-health-make-parity.md. El
hash es H0 (el commit que anade este handoff): todos los
`git diff --name-only` se miden contra el. PARA si la branch no es
feature/115-mobile-health-make-parity o si `git status --short` no sale
vacio. No toques Pet-Tracker-wt-backend (#117), Pet-Tracker-wt-118,
Pet-Tracker-wt-146, Pet-Tracker-wt-148, Pet-Tracker-wt-ui ni ningun otro
worktree, ni cambies de branch en ninguno. node_modules ya esta instalado.

Feature: mobile-health-make-parity (#115)
Branch: feature/115-mobile-health-make-parity
Spec aprobada: specs/mobile-health-make-parity/requirements.md
(status: approved, firma 2bfd4477)
Lee tambien, enteros: specs/mobile-health-make-parity/design.md, tasks.md
y traceability.md. tasks.md es tu guion (T0-T6 y «Cierre de Codex»; T7 es
del humano). En requirements.md: «Contexto y decisiones cerradas» (todo
esta decidido, P1-P3 incluidas: no reabras nada), «Medidas en la base»,
las convenciones de todos los requisitos (helper elementChild, fixtures,
insets, esperas) y R1-R8 con sus tablas de tests: los titulos de describe
e it son LITERALES, copialos. En design.md: §1.1 datos y simbolos con
nombre fijo, §1.2 lista cerrada de ficheros, §1.3 arbol, §1.4 clases
contra guards, §1.5 movimiento (NO se anima), §2 mutaciones M1-M22.

== QUE HACES ==

Todo en src/screens/health/index.tsx (H):
1. R4: los pesos pasan a la clave de weight-log:
   `healthKeys.weights(selectedPetId ?? '', undefined)` y
   `listWeights(baseUrl, token ?? '', selectedPetId!)` (tres argumentos).
2. R2/R3: hero a sangre (A9). Con mascotas: el scroll tiene como UNICOS
   hijos `pet-hero` (`<PetHeroHeader pet={selectedPet} variant="bleed">`
   con el PetSwitcher en el slot, sin status ni highlight) y
   `health-content` (style exacto `{ paddingHorizontal: 24, gap: 16 }`)
   con vacunas y peso; sin titulo «Salud». Sin contenido (pendiente,
   error, unreachable, missing-config, vacia): `health-states` (style
   exacto `{ paddingHorizontal: 24, paddingTop: insets.top + 12, gap: 16 }`)
   con el titulo y la rama. `contentContainerStyle` exacto
   `{ gap: 16, paddingBottom: insets.bottom + 96 }` en todas las ramas.
3. R5: `<WeightChart entries={weight.data.weights} />` como hijo [2] de
   `weight-card`, entre la fila de variacion y `weight-log-link`, solo con
   `ok` y al menos un registro.
4. R6/R1: la card de proxima vacuna pinta `next-vaccine-date`
   (`fmtDate(nextDoseAt, locale)`, nunca el ISO) en la columna y
   `next-vaccine-days` como hijo [2] de la card (className exacto
   `text-lg font-black text-warning-strong`, `style={TABULAR_NUMS}`), con
   las claves de Home `home.nextVaccineToday` (days === 0, sin
   accessibilityLabel) o `home.nextVaccineDays` + accessibilityLabel
   `home.nextVaccineDaysLeft` (days > 0). `fmtDate` y `calendarDaysUntil`
   se importan de '../home/format' (ese fichero NO se toca). Cero claves
   nuevas en el catalogo.
Sin animacion: 0 react-native-reanimated en H. Sin hex, sin clases
arbitrarias `[...]`, sin StyleSheet.create.

== BASE ==

origin/main = 8afae724 (merge de #116); la branch lo contiene y
mobile-pet-tracker/ no ha cambiado desde la base de la spec (8afae724). Al
arrancar: `git fetch origin` y
`git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"` -> exit=0.
Si da 1 (origin/main avanzo: #117 u otra feature mergeada antes que tu),
PARA y anotalo en el impl. El merge de main en la branch lo hace el
leader, no tu. Nunca rebasees.

`test ! -e .expo/types/router.d.ts; echo "exit=$?"` (desde
mobile-pet-tracker/) -> exit=0 (medido por el leader en H0). Repitelo
antes de CADA `bun run typecheck`; si da 1, PARA y pide al humano que lo
borre. Nunca `rm -f` (tu sandbox lo deniega).

Base medida por el leader el 2026-10-06 sobre el arbol de H0 (desde
mobile-pet-tracker/, `bunx jest --runTestsByPath --maxWorkers=2` de las 8
suites de tasks.md T0, exit=0): 8 suites / 264 tests / 0 failed.
  src/screens/health/index.test.tsx                   29
  src/components/__tests__/weight-chart.test.tsx       4
  src/components/__tests__/pet-hero-header.test.tsx   37
  src/__tests__/consistency-classnames.test.ts        55
  src/__tests__/legibility-classnames.test.ts         27
  src/__tests__/ui-language.test.ts                   30
  src/__tests__/design-drift.test.ts                  60
  src/providers/__tests__/language-provider.test.tsx  22
Tu medida manda: mide al arrancar (con typecheck y lint de base) y anota
antes/despues en el impl. Delta esperado al cierre: health/index.test.tsx
+26 (R2 8 = 3 + it.each de 5, R3 3, R5 6 = 4 + it.each de 2, R6 9 =
it.each de 7 + 2; R4 solo adapta y retitula) -> 55; las otras 7 suites 0
(cambian valores y filas, no numero de it). Total 290. Cero it borrados.

== ANCLAS ==

Ejecutalas TODAS desde mobile-pet-tracker/ antes de tocar nada y copia la
salida al impl. Si alguna no da EXACTAMENTE lo esperado, PARA y avisa.
Son los valores de H0 (requirements.md «Medidas en la base»; el leader
las ha corrido todas en H0). Los numeros de linea no son anclas.
H=src/screens/health/index.tsx

 0. grep -cF -- '- [x] Spec aprobada por humano (fecha: 2026-10-06' ../specs/mobile-health-make-parity/requirements.md   -> 1
 1. grep -cF "healthKeys.weights(selectedPetId ?? '', 1)" $H           -> 1
 2. grep -cF "healthKeys.weights(selectedPetId ?? '', undefined)" $H   -> 0
 3. grep -cF 'selectedPetId!, fetch, 1)' $H                            -> 1
 4. grep -cF '<WeightChart entries={weight.data.weights} />' $H        -> 0
 5. grep -cF '<PetHeroHeader' $H                                       -> 0
 6. grep -cF 'variant="bleed"' $H                                      -> 0
 7. grep -cF "from '../home/format'" $H                                -> 0
 8. grep -cF 'calendarDaysUntil(' $H                                   -> 0
 9. grep -cF 'fmtDate(' $H                                             -> 0
10. grep -cF 'useLocale()' $H                                          -> 0
11. grep -cF '{nextVaccine.nextDoseAt}' $H                             -> 1
12. grep -cF 'testID="next-vaccine-days"' $H                           -> 0
13. grep -cF 'testID="next-vaccine-date"' $H                           -> 0
14. grep -cF 'testID="health-states"' $H                               -> 0
15. grep -cF 'testID="health-content"' $H                              -> 0
16. grep -cF 'padding: 24' $H                                          -> 1
17. grep -cF 'paddingHorizontal: 24' $H                                -> 0
18. grep -cF 'insets.top + 12' $H                                      -> 1
19. grep -cF 'insets.bottom + 96' $H                                   -> 1
20. grep -cF 'style={TABULAR_NUMS}' $H                                -> 2
21. grep -cF 'style={CONTINUOUS_CORNER}' $H                            -> 2
22. grep -cF 'text-accent-strong' $H                                   -> 1
23. grep -cF 'text-warning-strong' $H                                  -> 1
24. grep -cF "t('health.health')" $H                                   -> 1
25. grep -cF '<PetSwitcher' $H                                         -> 1
26. grep -cF 'home.nextVaccineOverdue' $H                              -> 0
27. grep -cF 'getPet' $H                                               -> 0
28. grep -cF 'react-native-reanimated' $H                              -> 0
29. grep -cF 'StyleSheet.create' $H                                    -> 0
30. grep -cE '#[0-9A-Fa-f]{3,8}\b' $H                                  -> 0
31. grep -cE '\w-\[' $H                                                -> 0
32. grep -cF "{ file: 'src/screens/health/index.tsx', key: 'home." src/__tests__/ui-copy-table.ts   -> 0
33. grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2); // +1 #90 R5, +1 #95 R4, -2 #95 R5' src/__tests__/ui-language.test.ts   -> 1
34. grep -cF "[join('screens', 'health', 'index.tsx'), 2]," src/__tests__/consistency-classnames.test.ts   -> 2   (#62 R14 directUses + #62 R15 counters)
35. grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1, // #146 R18, #105 R11, #116 R5' src/__tests__/consistency-classnames.test.ts   -> 1
36. grep -cF 'padding: 24, paddingBottom: 120' src/screens/health/index.test.tsx   -> 1
37. grep -cF 'expect.any(Function)' src/screens/health/index.test.tsx             -> 2
38. grep -cF "healthKeys.weights('pet-1', undefined)" src/screens/health/index.test.tsx   -> 0
Anclas negativas (R7: NO se mueven; mismo valor en H0 y al cerrar):
39. grep -cF "[join('screens', 'health', 'index.tsx'), 1]," src/__tests__/legibility-classnames.test.ts   -> 1   (#61 R4 inkSites)
40. grep -cF '13 + 1 + 1' src/__tests__/legibility-classnames.test.ts                 -> 1
41. grep -cF '+ 2, // #118 R11' src/__tests__/legibility-classnames.test.ts           -> 1
42. grep -cF '+ 8, // #118 R1' src/providers/__tests__/language-provider.test.tsx     -> 1
43. grep -cF "'screens/health/index.tsx': 0," src/__tests__/design-drift.test.ts      -> 1
44. grep -cF "import { Card } from '../../components/card';" $H                       -> 1

Valores al cerrar (copialos al impl): 1 -> 0, 2 -> 1, 3 -> 0, 4 -> 1,
5 -> 1, 6 -> 1, 7 -> 1, 8 -> 1, 9 -> 1, 10 -> 1, 11 -> 0, 12 -> 1,
13 -> 1, 14 -> 1, 15 -> 1, 16 -> 0, 17 -> 2, 18 -> 1, 19 -> 1, 20 -> 3,
21 -> 2, 22 -> 1, 23 -> 2, 24 -> 1, 25 -> 1, 26 -> 0, 27 -> 0, 28 -> 0,
29 -> 0, 30 -> 0, 31 -> 0, 32 -> 3, 33 -> 0, 34 -> 1 (queda solo
directUses), 35 -> 0, 36 -> 0, 37 -> 0, 38 -> 1, 39-44 sin cambios.
Y en positivo al cerrar:
  grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1' src/__tests__/ui-language.test.ts   -> 1
  grep -cF "[join('screens', 'health', 'index.tsx'), 2 + 1], // #115 R6" src/__tests__/consistency-classnames.test.ts   -> 1
  grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6' src/__tests__/consistency-classnames.test.ts   -> 1
Los `+ 1` y `+ 3` de R7 son DELTAS sobre la expresion que encuentres; si
la expresion de H0 hubiera cambiado, aplica el delta sobre la nueva y
anotalo (no recalcules absolutos). La fila de Salud que cambia es la de
`counters` de `#62 R15`, NO la de `directUses` de `#62 R14` (las dos dicen
`[join('screens', 'health', 'index.tsx'), 2],` en H0).

== COMMITS ==

Mensajes LITERALES de tasks.md, en este orden. Rojo SIEMPRE antes que su
verde; un commit con todo incumple C4 (paso en #19):
  test(mobile-health): #115 R4 red, weights without limit
  feat(mobile-health): #115 R4 share the weight-log query
  test(mobile-health): #115 R2 R3 red, bleed hero and A9 wrappers
  feat(mobile-health): #115 R2 R3 bleed pet hero with A9 layout
  test(mobile-health): #115 R5 red, weight chart in the card
  feat(mobile-health): #115 R5 render WeightChart history
  test(mobile-health): #115 R6 red, next vaccine date and countdown
      <- incluye R1 (3 filas en ui-copy-table.ts y `+ 3` en
         ui-language.test.ts) y R7 (fila de Salud de `counters` y suma de
         `#69 R10` en consistency-classnames.test.ts): sus rojos son parte
         de este rojo
  feat(mobile-health): #115 R6 show next dose date and days left
  docs(mobile-health-make-parity): trace #115 R1-R8
El ultimo lleva SOLO specs/mobile-health-make-parity/traceability.md y
progress/impl_mobile-health-make-parity.md. Un refactor, si hiciera
falta, va en su propio commit `refactor(mobile-health): #115 R<n> <que>`
tras su verde; tasks.md solo preve uno opcional en T3.

Rojos: cada uno debe caer EXACTAMENTE como dice tasks.md («por asercion»
o «por consulta», it por it). Nunca por SyntaxError, ReferenceError,
TypeError, import roto o fallo de typecheck en el test. Si cae otro it, o
uno cae por el motivo contrario al declarado, PARA y reportalo: si un it
declarado «por consulta» cae «por asercion», la espera no es la que fija
requirements (corrige la espera, nunca la asercion). Cuentas esperadas:
- T1: 3 rojos por asercion (los dos toHaveBeenCalledWith de mockListWeights
  y `#87 R13`).
- T2: 13 rojos. Por consulta: los 3 primeros it de R2, las 5 filas del
  it.each, el it adaptado de safe area (`health-states` no existe) y los
  3 de R3. Por asercion: el it adaptado del hub (contentContainerStyle).
- T3: 2 rojos por consulta (`con dos o mas registros...` sin
  `weight-chart`; `con un registro...` sin `weight-chart-empty`). NACEN
  VERDES (declaralo en el impl): `sin registros...`, las 2 filas de
  `con error de peso...` y `mientras el peso carga...`.
- T4: 13 rojos. Por consulta 9: las 7 filas a-g, `pinta los dias...` y
  el it adaptado `highlights the nearest future dose...` (`1 may 2099`
  no esta). Por asercion 4: `ordena la card...` (espera
  `findByTestId('next-vaccine-card')` y despues cuenta hijos: 2 frente a
  3), `#65 R5 › resuelve las 32 ocurrencias normativas` y `#65 R18 ›
  resuelve cada ocurrencia de la tabla contra la clave exacta` (las dos
  por checkUses, uses 0 frente a 1 en las 3 filas `home.*` de Salud) y
  `#62 R15 › screens/health/index.tsx aplica TABULAR_NUMS a sus 3 valores`
  (2 frente a 3). `#69 R10` en VERDE (tasks.md T4, corregido).

Sondas M1-M22 (T5, design.md §2), una a una sobre el verde de T4, NO se
commitean. Por cada una: plantar, correr la suite que nombra la fila,
anotar en el impl el it que cae con su matcher, Expected y Received (o la
consulta que falla) y si coincide con la columna «Como» de design §2, y
revertir con
  git checkout HEAD -- <ruta>
y comprobar, con salida al impl:
  git diff --quiet -- <ruta>; echo "exit=$?"   -> 0
  git diff --cached --quiet; echo "exit=$?"    -> 0
Nunca `git checkout -- <ruta>` a secas ni desde otro commit: deja el
indice sucio. Si una sonda no cae donde dice design §2, PARA y reportalo:
es un candado ciego, no un detalle.

== REGLAS CRITICAS ==

- Convenciones: docs/conventions.md. Titulos de describe e it LITERALES de
  requirements.md (en espanol los nuevos; los existentes que adaptas
  conservan su titulo salvo el retitulo de `#87 R13` en R4).
- Esperas: docs/conventions.md §Esperas sobre el arbol renderizado. Nunca
  esperar al contador de un mock (`toHaveBeenCalledTimes`) para luego
  aseverar: `waitFor`/`findBy*` hasta que el arbol muestre el dato y
  despues aseverar. Las props del espia de WeightChart se leen SOLO
  despues de esperar el nodo en el arbol. Toda ausencia va despues de una
  presencia del mismo escenario.
- Fechas (R6): `jest.useFakeTimers()` + `jest.setSystemTime(new Date(anio,
  mes - 1, dia, 12, 0))` dentro del it, y `afterEach(() =>
  jest.useRealTimers())` dentro del describe de R6. Hora LOCAL, nunca un
  ISO con Z. Los literales de fecha y de dias de la tabla a-g son los
  esperados: copialos tal cual (medidos en node con es-MX y en-US).
- Mocks: el espia de WeightChart envuelve el componente real
  (`jest.requireActual('../../components/weight-chart')`). NO mockees
  react-native-svg: src/screens/weight-log/index.test.tsx ya pinta el
  WeightChart real sin ese mock. El helper `elementChild` se copia en
  intencion de src/components/__tests__/pet-hero-header.test.tsx (funcion
  local, no lo exportes ni lo muevas). `renderHealth` gana un idioma
  opcional ('es' por defecto) que llega a `LanguageProvider initial`. No
  copies mocks de otras suites sin verificar contra esta.
- UI movil: docs/ui-guidelines.md rige (gate C8). Skills a cargar, y di
  en el impl cuales cargaste: del plugin expo de Codex (1.0.2, medido por
  el leader el 2026-10-06), `building-native-ui`; del repo
  (.agents/skills/), `appllama-app-design-skill` (la carta la exige al
  cambiar una pantalla; aqui solo para releer el patron, la spec gana) y
  `animate-expo` (solo su puerta de frecuencia, que aqui decide NO
  animar). En la 1.0.2 NO existen expo-overview, expo-native-ui,
  expo-design-system ni expo-animation: pedirlas da silencio, no error.
  Si tu catalogo instalado SI las trae (plugin mas nuevo), puedes cargar
  expo-native-ui y expo-design-system, y lo dices en el impl. Appllama MCP
  no hace falta: el diseno esta cerrado en la spec.
- R8: ni `bun add`, ni cambios en package.json, bun.lock ni app.json.
  Todo con bun/bunx, nunca npm/npx. Al cerrar, desde la raiz del repo y
  con salida al impl:
    git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock   (vacio)
    git diff --stat origin/main -- backend-pet-tracker/                                    (vacio)
    git diff --name-only H0 HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md'
        (exactamente los 7 ficheros de abajo)
  y anclas 28-31 en 0.
- Jest: siempre `--runTestsByPath` desde mobile-pet-tracker/. Ninguna ruta
  de esta feature lleva parentesis; si abres alguna que si, entre comillas
  simples. Tras cada comando, el numero de suites que imprime jest debe
  ser el de ficheros pedidos.
- Mide SIN pipe: `cmd > /tmp/j.txt 2>&1; echo "exit=$?"`. `cmd | tail`
  devuelve el codigo de tail. Copia las lineas de resumen al impl.
- Cierre (T6): `bun run typecheck`, `bun run lint` y `bunx jest` ENTERO,
  cada uno con exit 0, sin pipe. Mientras corre la suite entera, no lances
  otra.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones. Esta feature no toca backend.
- No toques ningun fichero fuera de design.md §1.2. En particular, NO:
  src/components/weight-chart.tsx, src/components/pet-hero-header.tsx,
  src/components/pet-switcher.tsx, src/screens/home/ (incluido format.ts),
  src/screens/weight-log/, src/i18n/catalog.ts, src/api/,
  legibility-classnames.test.ts, design-drift.test.ts,
  language-provider.test.tsx, specs/mobile-ui-language/design.md,
  docs/ui-guidelines.md, backend-pet-tracker/.
- Rellena specs/mobile-health-make-parity/traceability.md con los hashes
  solo en el ultimo commit (R9 queda «gate humano»; R7 y R8 citan su
  comando de verificacion). No rebasees despues de escribir hashes.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, y las casillas de R9 y de §Aprobacion de
  requirements.md. Los escribe el leader o el humano. Todo lo que tengas
  que contar va en progress/impl_mobile-health-make-parity.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (los 7 de design.md §1.2, ni uno mas):
  mobile-pet-tracker/src/screens/health/index.tsx
  mobile-pet-tracker/src/screens/health/index.test.tsx
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  specs/mobile-health-make-parity/traceability.md
  progress/impl_mobile-health-make-parity.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de arriba; cualquier otro fichero ajeno en
`git diff --name-only H0 HEAD` es motivo de parada.

Criterios de aceptacion: R1-R8 de requirements.md. R9 (smoke en el dev
build de Android) es del humano: no lo marques.

Al terminar, progress/impl_mobile-health-make-parity.md debe tener: pwd,
branch, H0 y status; skills cargadas; la salida de las 45 anclas en H0 y
la de cierre (mas las 3 positivas); la base medida por suite con
typecheck y lint de base (exit); los commits con hash y R-id; por cada
rojo, el comando, las cuentas, el exit y cada it rojo con su matcher,
Expected y Received (o la consulta que falla); por cada verde, sus
cuentas y exit; las 22 sondas con el it que cae, como cae y los dos
`git diff --quiet` en 0; el cierre (typecheck, lint, jest entero) con
exit; las tres salidas de R8; el delta final por suite; y cualquier
decision que la spec no cerrara literalmente.
```

---

## CORRECCION 1 — parada en T3 (2026-10-06)

> Pegar este bloque en Codex CLI para retomar. Sustituye solo el cierre de
> T3; el resto del handoff sigue vigente.

```
Retoma #115 en /home/claude/sites/Pet-Tracker, branch
feature/115-mobile-health-make-parity. Lee primero
progress/impl_mobile-health-make-parity.md (tu propio informe, sigue sin
commit) y esta CORRECCION 1 del handoff.

Diagnostico (verificado por el leader en HEAD b6c08b2a: 45 passed, 1 failed):
el requisito R5 dice «[2] es o contiene weight-chart». Tu test de
src/screens/health/index.test.tsx usa
  expect(within(elementChild(card, 2)).queryByTestId('weight-chart')).not.toBeNull();
y within() excluye el nodo raiz. La raiz de WeightChart ya es weight-chart
(src/components/weight-chart.tsx), asi que el hijo [2] ES el nodo y within no
lo ve. La implementacion es correcta; el test no cubre la rama «es».

Que haces, sin reescribir historia (nada de reset, amend ni rebase; b6c08b2a
se queda como commit no verde documentado):

1. En ese it («con dos o mas registros, pasa el historial entero y en orden
   entre la variacion y el enlace»), cambia esa linea por la forma simetrica
   del it de un registro:
     expect(elementChild(card, 2).props.testID).toBe('weight-chart');
   Ancla antes del cambio y despues (desde mobile-pet-tracker/):
     grep -cF "expect(within(elementChild(card, 2)).queryByTestId('weight-chart')).not.toBeNull();" src/screens/health/index.test.tsx   -> 1 antes, 0 despues
     grep -cF "expect(elementChild(card, 2).props.testID).toBe('weight-chart');" src/screens/health/index.test.tsx   -> 0 antes, 1 despues
2. En src/screens/health/index.tsx, b6c08b2a dejo mal sangrados el bloque de
   WeightChart y la linea siguiente (weight-card-empty) a 14 espacios; sus
   hermanos del weight-card van a 16. Devuelvelos a 16 espacios (las
   lineas interiores un nivel mas). Sin otro cambio en ese fichero.
3. Mide el verde de T3 como dice el handoff (46 passed, 0 failed en Salud) y
   registralo en el impl. Solo si el registrador da exit=0 y la cuenta
   coincide, un unico commit con los dos ficheros:
     fix(mobile-health): #115 R5 green, assert the chart slot itself
   REGLA NUEVA para todo lo que queda: ningun git commit si el registrador o
   jest devolvio exit distinto de 0 o «Cuenta y suites esperadas: False».
   Encadenalo: <registrador> && git commit ...
4. La sonda M4 sigue cayendo por asercion en [1] y [2] con este cambio;
   M2, M3 y M5 no dependen de esa linea.
5. En traceability.md, R5 cita el red 7e7f4a90 y como verde ESTE commit de
   fix; anota b6c08b2a como «impl, no verde: asercion de test corregida en
   <hash del fix>». En el impl deja la parada tal cual y anade la seccion
   «T3 — verde tras CORRECCION 1».
6. Continua con T4, T5 y T6 segun el handoff. La lista cerrada de R8 no
   cambia: este fix toca los mismos dos ficheros de produccion y test.
```

---

## CORRECCION 2 — merge de origin/main tras #117 (2026-10-06)

> Pegar este bloque en Codex CLI para retomar. La CORRECCION 1 sigue
> vigente entera; esta solo cambia la base y el comando de la lista cerrada.

```
Retoma #115 en /home/claude/sites/Pet-Tracker, branch
feature/115-mobile-health-make-parity. Paraste bien: origin/main avanzo a
e002a4a5 (#117) y el merge era del leader. Ya esta hecho:

  a3548767 Merge origin/main (e002a4a5, #117) into feature/115-mobile-health-make-parity

Merge sin conflictos. Comprueba antes de tocar nada:
  git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"   -> exit=0

Medido por el leader despues del merge:
- Anclas 32-35 y 39-44 (ficheros compartidos que toco #117): mismo valor
  que en H0. Las anclas de $H y de index.test.tsx ya muestran T1-T3 y
  coinciden con sus valores de cierre.
- Anclas de la CORRECCION 1: 1 y 0, sin cambios.
- Las otras 7 suites: 237 tests, exit=0. Cambia una sola:
    src/providers/__tests__/language-provider.test.tsx   22 -> 24 (#117)
  Las demas igual que en T0.

Cambios sobre el handoff:
1. Total de cierre: Salud 55 + 237 = 292 (antes 290). language-provider
   cierra en 24, no en 22. Ese fichero sigue prohibido para ti.
2. La lista cerrada ya NO se mide desde H0 (el merge mete los ficheros de
   #117). Comando nuevo, desde la raiz del repo:
     git diff --name-only origin/main...HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md' ':!.claude/agents/leader.md'
   Ahora da 3 (health/index.tsx, health/index.test.tsx, traceability.md).
   Al cerrar, exactamente los 7 ficheros de la lista del handoff.
   Cualquier otro fichero es motivo de parada.
3. Si origin/main vuelve a avanzar, para otra vez igual: el merge es del
   leader. No rebasees.

Despues sigue la CORRECCION 1 desde su paso 1, con su regla de commits
(registrador && git commit), y luego T4, T5 y T6.
```

---

## CORRECCION 3 — ronda 2, Enmienda E1–E2 (2026-10-06)

> Pegar este bloque en Codex CLI. La Enmienda E1–E2 está firmada en
> `52bfe254`. El guion es `tasks.md` T8; este bloque fija base, anclas,
> regla de fechas nueva y la parada del PNG. CORRECCION 1 y 2 siguen
> vigentes (registrador && commit; lista cerrada desde `origin/main...HEAD`).

```
Retoma #115 en /home/claude/sites/Pet-Tracker, branch
feature/115-mobile-health-make-parity, en el VPS (Linux). Ronda 2: el
reviewer rechazo la ronda 1 y el humano aprobo la Enmienda E1-E2 (firma
52bfe254). Lee primero, enteros:
- specs/mobile-health-make-parity/requirements.md: R2, R6 (columna TZ y
  fila h), R8, R9, R10 y la seccion «Enmienda E1–E2».
- specs/mobile-health-make-parity/design.md: §1.2 (lista cerrada de 10),
  §1.8 (readAlpha y countAlpha: copialos tal cual) y §2 M23-M28.
- specs/mobile-health-make-parity/tasks.md: T8, pasos 1 a 10. Es tu guion.
- progress/review_mobile-health-make-parity.md: por que se rechazo.
Anota H2 = git rev-parse HEAD al arrancar; es el HEAD de este handoff.

Skills: del plugin expo (1.0.2) building-native-ui; $imagegen para el arte;
del repo (.agents/skills/) appllama-app-design-skill y su
references/image-assets.md (fondo transparente, sin halo blanco ni mate).

BASE (medida por el leader sobre esta branch, origin/main e002a4a5):
desde la raiz:
  git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"   -> exit=0
  grep -cF -- '- [x] Enmienda E1–E2 aprobada por humano (fecha: 2026-10-06' specs/mobile-health-make-parity/requirements.md   -> 1
desde mobile-pet-tracker/:
  test ! -e .expo/types/router.d.ts; echo "exit=$?"   -> exit=0
  bunx jest src/screens/health/index.test.tsx app.assets.test.ts   -> exit 0, 62 passed (Salud 55 + app.assets 7)
  git diff --name-only origin/main...HEAD -- assets/   -> vacio
  sha256sum assets/images/splash-icon.png   -> 8767ad5e565a736a433627a3b9f0f96f7c888e68b023338dd9d0b59efacf2913 (igual que android-icon-foreground.png)
Si algo no cuadra, para y anotalo en el impl.

ANCLAS (desde mobile-pet-tracker/; mide antes y despues y escribe el valor
medido al lado del declarado):
 E1.1, src/screens/health/index.test.tsx:
  grep -cF "expect(hero.parent!.parent).toBe(screen.getByTestId('screen-health'));" src/screens/health/index.test.tsx   -> 0 antes, 1 despues
  grep -cF "expect(hero.parent).toBe(content.parent);" src/screens/health/index.test.tsx   -> 1 y 1 (la linea nueva va justo debajo)
 E1.2, mismo fichero:
  grep -cF "process.getBuiltinModule('process')" src/screens/health/index.test.tsx   -> 0 / 1
  grep -cF "America/Mexico_City" src/screens/health/index.test.tsx   -> 0 / 1 (solo la fila h)
  grep -c "row: '" src/screens/health/index.test.tsx   -> 7 / 8
  grep -cF "jest.setSystemTime(new Date(year, month - 1, day, 12, 0));" src/screens/health/index.test.tsx   -> 1 / 0
 R10:
  grep -cF "import { inflateSync } from 'node:zlib';" app.assets.test.ts   -> 0 / 1
  grep -cF "#115 R10" app.assets.test.ts   -> 0 / 1
  grep -c 'splash-icon' scripts/make-icons.mjs   -> 1 / 0
  grep -c "node:fs" scripts/make-icons.mjs   -> 1 / 0
  git diff --name-only origin/main...HEAD -- assets/   -> vacio / solo mobile-pet-tracker/assets/images/splash-icon.png
 Produccion de Salud intacta en toda la ronda:
  git diff --quiet $H2 HEAD -- src/screens/health/index.tsx; echo "exit=$?"   -> exit=0 al cerrar

REGLA DE FECHAS NUEVA: la regla «Fechas (R6)» del handoff original
(setSystemTime con 12, 0) queda sustituida por requirements R6 (Enmienda
E1.2): <ahora> con la hora y el minuto de la columna «Ahora», y la TZ de la
fila fijada antes de jest.useFakeTimers() con
  const hostProcess = process.getBuiltinModule('process');
  hostProcess.env.TZ = <TZ de la fila>
y restaurada en un finally del propio it. process.env.TZ a secas no sirve
(jest copia process.env y Date no se entera). Patron vivo:
src/screens/meal-schedule/index.test.tsx (#147 E1.2). Los dos it de R6 que
fijan 2026-12-31 12:00 a mano (orden de la card y receta) no cambian.

COMMITS (literales de tasks T8, cada uno como <registrador> && git commit):
 1. test(mobile-health): #115 E1.1 lock hero and content under the scroll
    Salud 55 verdes; sonda M25 antes del commit (cae ese it por asercion).
 2. test(mobile-health): #115 E1.2 time zone row for next vaccine days
    Salud 56 verdes; sondas M23 (cae solo la fila h) y M24 (caen a-h).
 3. test(mobile-assets): #115 R10 red, splash without square or pin
    Rojo previsto, como el de T4 en la ronda 1: Jest exit=1 con exactamente
    2 fallos, «esquinas» ([676, 676, 676, 676]) y «pin» (1600), los dos por
    asercion; «fuera», «cara» y los 7 it de #101 en verde. Registrador exit=0.
 Sondas M23-M25 sobre src/screens/health/index.tsx; restaurar con
   git checkout HEAD -- src/screens/health/index.tsx
   git diff --quiet -- src/screens/health/index.tsx; echo "exit=$?"   -> 0
   git diff --cached --quiet; echo "exit=$?"   -> 0

CANDIDATO (T8 paso 4; receta de requirements R10, pasos 1-3, todo en
/tmp/115-splash/, nada de eso se commitea):
 - $imagegen edita assets/images/pet-tracker-app-icon.png (1254x1254 RGB)
   con este prompt, literal:
     Edit this image. Keep the exact same robot puppy mascot: same pose,
     proportions, colors, lighting and position on the canvas. Remove
     everything else: the violet square background, the gradient, the glow,
     the white location pin and its halo, and any drop shadow. Output a
     square PNG with a fully transparent background (real alpha), clean
     anti-aliased edges, no white halo and no colored matte.
 - Si la salida no es cuadrada, para. Si no trae alfa real (tipo de color
   distinto de 6, o las esquinas con alfa > 0), repite el mismo prompt
   cambiando la ultima frase por «on a flat pure #00FFFF background» y quita
   ese fondo en el script de composicion antes de redimensionar (el cian no
   aparece en la mascota: morado, blanco, gris, verde y rojo). Anota en el
   impl si usaste este respaldo.
 - jimp-compact: redimensiona a 676x676 con Jimp.RESIZE_BICUBIC y compon en
   (174, 174) sobre lienzo 1024x1024 0x00000000; escribe
   assets/images/splash-icon.png. Previews de 1024x1024 en /tmp/115-splash/:
   preview-splash.png (#9460FC), preview-welcome-light.png (#FFFFFF) y
   preview-welcome-dark.png (#0D1117).
 - bunx jest app.assets.test.ts   -> exit 0, 11 passed.
 - No ejecutes scripts/make-icons.mjs ni expo prebuild.

PARADA DEL PNG (T8 paso 5). Escribe en el impl una seccion «Ronda 2 —
PARADA del PNG» con: H2, los tres commits con su hash, el sha256sum del
candidato, las rutas de la salida de imagegen y de las tres previews, y si
usaste el respaldo cian. Deja el candidato en el arbol sin stage
(git diff --cached --quiet -> exit 0) y PARA. El humano lo mira y firma la
casilla «PNG del splash» de requirements.md en el repo; la marca de Notion
no cuenta. Cuando te diga que sigas, desde mobile-pet-tracker/:
  grep -cF -- "- [x] Candidato de \`splash-icon.png\` aprobado" ../specs/mobile-health-make-parity/requirements.md   -> 1
  grep -cF "$(sha256sum assets/images/splash-icon.png | cut -c1-64)" ../specs/mobile-health-make-parity/requirements.md   -> 1
Si el humano lo rechaza, te pegara el motivo: anota motivo y sha256sum del
rechazado en el impl y vuelve a CANDIDATO.

DESPUES DE LA FIRMA: T8 pasos 6 a 10 tal cual.
 6. feat(mobile-assets): #115 R10 transparent splash with the mascot alone
    Solo assets/images/splash-icon.png y scripts/make-icons.mjs. Antes, en
    verde y con exit 0: app.assets.test.ts, app.config.test.ts y
    src/screens/welcome/index.test.tsx.
 7. Sondas M26-M28 (los PNG de M27 y M28 en /tmp/115-splash/); restaurar con
    git checkout HEAD -- assets/images/splash-icon.png y los dos
    git diff --quiet de arriba con ese path, exit 0.
 8. Anclas de R10 con el valor medido al lado.
 9. Cierre, cada comando sin pipe y con su exit:
    - Lista cerrada R8 (desde la raiz), exactamente los 10 de design §1.2:
      git diff --name-only origin/main...HEAD -- . ':!feature_list.json' ':!STATUS.md' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!progress/review_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md' ':!.claude/agents/leader.md'
      Hoy da 7. Cualquier fichero fuera de los 10 es motivo de parada.
    - bun run typecheck, bun run lint y bunx jest: exit 0. Salud 56,
      app.assets 11, las otras seis suites de control sin cambio, total de
      Jest 2139 + 5 = 2144 si origin/main sigue en e002a4a5.
 10. docs(mobile-health-make-parity): trace #115 E1-E2 and R10
    traceability.md (R2 y R6 con su commit de E1; fila R10 con rojo y verde;
    §Verificacion R8 con la lista de 10; R9 pasa a S1..S11) e impl con la
    seccion «Ronda 2» de T8 paso 10.

Ficheros que puedes tocar en esta ronda, y ninguno mas:
  mobile-pet-tracker/src/screens/health/index.test.tsx
  mobile-pet-tracker/app.assets.test.ts
  mobile-pet-tracker/assets/images/splash-icon.png
  mobile-pet-tracker/scripts/make-icons.mjs
  specs/mobile-health-make-parity/traceability.md
  progress/impl_mobile-health-make-parity.md
src/screens/health/index.tsx solo para sondas, siempre restaurado.

Prohibido: ./init.sh (lo coordina el leader con la otra sesion), push,
rebase, merge, amend y reset. Si origin/main avanza, para: el merge es del
leader. Ningun commit si el registrador o jest dio un exit distinto del
previsto en ese paso.
```
