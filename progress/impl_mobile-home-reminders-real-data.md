# Implementación — mobile-home-reminders-real-data (#85)

## Alcance y baseline

- Branch: `feature/85-mobile-home-reminders-real-data`.
- Base de deltas: `20c7b3c`; implementación retomada sobre `df9b398` tras A7.
- `env -u FORCE_COLOR ./init.sh`: exit 0 antes de escribir código.
- Móvil: 68 suites, 1078 tests y 1 snapshot, todo verde.
- Backend: 163 suites/1243 tests; infra: 2/14; e2e: 25 suites/354 tests
  pasados y 3 suites/8 tests omitidos.
- Alcance respetado: cero cambios en backend, infra, hosting, API móvil,
  componentes compartidos, tema o rutas.

## Implementación por R-id

- **R1**: rojo `5ad5bc6`; verde `41e7a99`. La Home observa la copy restaurada
  en español e inglés; los candados de catálogo y usos quedaron 114/114 verdes
  sin cambiar ningún recuento.
- **R2**: rojo `109cdaa`; verde `2fb06c5`. `localDayOf` construye el instante
  crudo, usa getters locales y rellena mes/día a dos dígitos.
- **R3**: rojo `37f7d74`; verde `4788104`. El helper filtra por estado y día
  local inclusivo, ordena por instante/id y corta en tres. Su verificación por
  mutación M3 quedó validada con la evidencia corregida por A8.
- **R4**: rojo `c2d5dfd`; verde `fc7a31d`. La Home monta una única petición de
  recordatorios para la mascota seleccionada y ninguna sin selección. A10
  adapta el doble posicional heredado de tres a cuatro hooks por render. Home
  quedó 90/90 verde; la suite móvil, 68 suites/1089 tests y 1 snapshot verde;
  `bun run typecheck`, exit 0.
- **R5**: rojo `10c9636`; verde `4262348`. La sección pinta tras la vacuna
  hasta tres filas reales, ordenadas, con título, día local y contador común.
  `ad08010` endurece el candado de ISO con hora tras la primera sonda de M2;
  `a7733b8` adapta solo el título heredado de cardinalidad. Home y helper
  quedaron 108/108 verdes.
- **R6**: rojo `bb83edc`; verde `d4733ef`. Cada tipo resuelve su icono mediante
  el mapa exhaustivo, y el hueco/tinta desde `REMINDER_TYPE_META`. R6 quedó 3/3
  verde; `#70 R13` y `#64 R9`, 4/4 y 2/2 verdes respectivamente.
- **R7**: rojo versionado `4078fdc`; verde `c5e30e2`. Los dos candados ligan el
  contenido y la posición a su propia fila. Home quedó 100/100 verde y el
  `git diff` vacío tras restaurar M9/M10.
- **R8**: rojo `7dac461`; verde `fecd8e8`. Las filas permanecen no pulsables y
  separadas para accesibilidad; solo cada contador anuncia su texto expandido,
  incluido `In 1 days` en inglés. R8 y `#70 R11` quedaron 4/4 verdes.
- **R9**: rojo versionado `1d8c3d5`; verde `68b3d90`. Carga y los cinco estados
  de fallo dejan cero filas propias, conservan la cabecera y la ranura de la
  vacuna. R9 junto con `#70 R9`/`#70 R1` quedó 24/24 verde.
- **R10**: rojo versionado `7016683`; verde `3b7bcfa`. Las filas conservan el
  `Card` compartido, las recetas exactas y la píldora ámbar con cifras
  tabulares. R10 y los candados globales enumerados quedaron 44/44 verdes.
- **R11**: rojo versionado `ff4a627`; verde `f80fac1`. M13 confirmó que el
  candado inglés de R1 observa la UI. Las seis llamadas de copy siguen con una
  ocurrencia y la tabla bilingüe existente ya contiene los valores restaurados.
- **R12**: candado `fce3ffc`. El bloque nominal nació verde; la sonda temporal
  `#fff` en `format.ts` lo puso rojo detectando exactamente ese fichero. Tras
  retirarla, `design-drift.test.ts` quedó 28/28 verde.
- **R13**: verde `5febedb`. Antes del delta, los seis ficheros de inventario
  dejaron 3 fallos/241 verdes, todos del único `TABULAR_NUMS` nuevo. Tras mover
  los cinco usos del sumando nombrado, quedaron 244/244 verdes.

## Prueba de mutación

Todas las mutaciones se plantan en código de producción, de una en una.

| Mutación | Cambio y rojo observado | Restauración |
|---|---|---|
| M1 | Commit `97e06c0`: `localDayOf` cambió a `getUTC*`. `bun run test`, con `TZ` ausente, dejó 1 suite/1 test rojo y 67 suites/1082 tests verdes. Cayó exactamente `#85 R2` → `it('toma el día civil de los getters locales, nunca de los UTC')`: esperaba `2026-09-11`, recibió `2026-09-12`. `3d0ab78` completó el doble de padding para eliminar un `TypeError` secundario antes de registrar la evidencia definitiva. | Getters locales restaurados; `format.test.ts` volvió a 9/9 verde. |
| M2 | La Home pasó temporalmente `reminder.dueAt` crudo a `calendarDaysUntil` y `fmtDate`. Tras endurecer con regex el significado de “contiene” (`ad08010`), `index.test.tsx` dejó 2 fallos/93 verdes: cayó el `it` nominal `pinta fecha y contador reales para un dueAt con hora` por `Invalid Date`, y también el de los nueve nodos. | `localDayOf(reminder.dueAt)` restaurado sin commit; Home volvió a 95/95 verde. |
| M3 | Se retiró temporalmente el filtro `status === 'scheduled'`. `format.test.ts` dejó 1 fallo/12 verdes: cayó exactamente `#85 R3` → `it('descarta enviados, cancelados y pasados, y conserva el de hoy')`. La salida fue `[rem-today, rem-next, rem-sent]`; aflora `rem-sent`, mientras `rem-cancelled` queda cuarto y lo recorta el tope de tres. El `it` espera exactamente `[rem-today, rem-next]`. | Filtro de estado restaurado sin commit; `format.test.ts` volvió a 13/13 verde. |
| M4 | Se retiró temporalmente el filtro `calendarDaysUntil(localDayOf(dueAt), now) >= 0`. `format.test.ts` dejó 1 fallo/12 verdes: cayó exactamente el mismo `it` de R3 que M3, pero con salida `[rem-past, rem-today, rem-next]`. Entró `rem-past`, un motivo e id distintos de M3. | Filtro de futuro restaurado sin commit; `format.test.ts` volvió a 13/13 verde. |
| M5 | El corte inclusivo cambió temporalmente de `>= 0` a `> 0`. `format.test.ts` dejó 1 fallo/12 verdes: cayó exactamente el `it` de R3 prescrito y la salida perdió `rem-today`, conservando solo `[rem-next]`. | Corte inclusivo restaurado sin commit; `format.test.ts` volvió a 13/13 verde. |
| M6 | Se retiró temporalmente `a.id.localeCompare(b.id)` del comparador. `format.test.ts` dejó 1 fallo/12 verdes: cayó exactamente `it('desempata por id ascendente')`; el sort estable conservó la fixture invertida como `[rem-z, rem-a]` en vez de `[rem-a, rem-z]`. Con la condición contraria —fixture entregada ya como `[rem-a, rem-z]`— la mutación habría quedado verde. | Desempate por id restaurado sin commit; `format.test.ts` volvió a 13/13 verde. |
| M7 | Se invirtió temporalmente el comparador primario a `b.dueAt.localeCompare(a.dueAt)`. Las suites de helper y Home dejaron 5 fallos/103 verdes: cayeron los dos `it` de orden y los dos de tope nombrados por A9; el `it` de filtro añadió un quinto rojo porque también fija el orden exacto. | Comparador ascendente restaurado sin commit; ambas suites volvieron a 108/108 verde. |
| M8 | El tope cambió temporalmente de `slice(0, 3)` a `slice(0, 4)`. Helper y Home dejaron exactamente 2 fallos/106 verdes: `devuelve como mucho tres` recibió `rem-plus-4`, y `corta en tres aunque haya cinco` recibió 5 hijos en vez de 4. | Tope de tres restaurado sin commit; ambas suites volvieron a 108/108 verde. |
| M9 | Commit rojo `4078fdc`: el nodo `…-title` pintó la fecha y `…-date` pintó `reminder.title`. Cayó `it('no cruza ningún dato entre las tres filas ni con la vacuna')`: esperaba `Pastilla antipulgas` y recibió `11 sep 2026`. | Datos restaurados en `c5e30e2`; R7 volvió 2/2 verde y el `git diff` quedó vacío. |
| M10 | Commit rojo `4078fdc`: dentro del agrupador se colocó primero el nodo `…-date` y después `…-title`, sin cambiar sus `testID`. Cayó `it('fija la posición de los hijos de cada fila')`: `group.children[0]` recibió `reminders-item-rem-b-date` en vez de `…-title`. Con la condición contraria —aserciones solo mediante `within(fila).getByTestId(...)`— la mutación habría quedado verde porque esa búsqueda ignora el orden. | Posición restaurada en `c5e30e2`; R7 volvió 2/2 verde y el `git diff` quedó vacío. |
| M11 | Se añadió temporalmente al cuerpo `<View className="h-1.5 rounded-full bg-default" />` sin `testID`. Home dejó 5 fallos/90 verdes: cayó el `it` nominal de tres escenarios por 2 hijos en vez de 1, además del tope y tres cardinalidades heredadas. | Hijo intruso retirado sin commit; Home volvió a 95/95 verde. |
| M12 | Se cruzaron temporalmente `medication: Stethoscope` y `appointment: Pill`. R6 dejó 1 fallo/2 verdes: cayó exactamente `it('liga icono, superficie y tinta a su tipo')` porque `rem-b` no contenía `icon-pill`. | Mapa exacto restaurado sin commit; R6, `#70 R13` y `#64 R9` volvieron verdes, y `git diff` quedó vacío. |
| M13 | Commit rojo `ff4a627`: `en['home.reminders']` cambió a `Recordatorios`. R1 dejó 1 fallo/2 verdes: cayó exactamente `it('rotula en inglés')`, que esperaba `Reminders` y recibió `Recordatorios`. | Valor inglés restaurado en `f80fac1`; R1 volvió 3/3 verde y `git diff` quedó vacío. |

## A8 — corrección de la evidencia prescrita para M3

La fixture normativa (`requirements.md:256-260`) contiene dos elegibles antes
de los estados descartados: `rem-today` y `rem-next`. Al retirar el filtro de
estado, ordenar y aplicar el tope obligatorio de tres, la salida es
`rem-today`, `rem-next`, `rem-sent`; `rem-cancelled` queda cuarto y se recorta.
La corrida dejó 1 fallo/12 verdes por `rem-sent`. A8 confirma esta medición,
mantiene intactos la fixture y el candado, y corrige únicamente la evidencia
esperada. M3 se restauró sin commit y la suite dirigida volvió a 13/13 verde.

## A9 — corrección del orden de M7 y M8

`tasks.md:95-96` ordena plantar M3..M8 durante R3 y comprobar que cada mutación
cae por todos los `it` que R15 nombra. Sin embargo, R15/M7 y R15/M8 exigen
también los `it` de Home `las ordena por fecha ascendente bajo la fila de la
vacuna` y `corta en tres aunque haya cinco`; `requirements.md:404-421` y el
propio orden normativo los crean recién en R5. En este punto solo existen los
candados de `format.test.ts`.

A9 resuelve la incompatibilidad sin retirar candados: R3 verifica M3..M6 y R5
verificará M7/M8 una sola vez, cuando también existan sus dos `it` de Home.
Tras la firma se plantaron M5 y M6, ambas cayeron por el `it` prescrito, se
restauraron y la suite dirigida quedó 13/13 verde.

## A10 — adaptación del doble posicional de R4

La implementación mínima exacta de R4 —`listReminders`, `remindersFn` y un
cuarto `useApi(remindersFn)`— puso verdes los dos candados nuevos y la
adaptación de #70, pero dejó la suite de Home en 1 fallo/89 verdes. Cayó el
test heredado `R10: preserva la mascota durante el refetch` con
`TypeError: Cannot read properties of undefined (reading 'nextVaccine')`.

Ese test sustituye `useApi` con un contador posicional `hookCall++ % 3`; tres
llamadas por render mantienen el ciclo alineado, pero la cuarta exigida por R4
desplaza qué estado recibe cada hook en renders posteriores. El mock por
defecto de `listReminders` prescrito por A6 no interviene porque el test
sustituye el hook entero.

A10 autoriza únicamente cambiar `% 3` por `% 4`, conservando la intención y
las dos aserciones del test. Con esa adaptación y la implementación mínima de
R4, `index.test.tsx` quedó 90/90 verde y la suite móvil completa 1089/1089.
La deuda de reemplazar el doble posicional por uno indexado por función queda
registrada en #86 y fuera de #85.

## A11 — aislamiento del mock en R5

La implementación mínima exacta de R5 puso verdes sus cinco `it`, pero dejó
`index.test.tsx` en 3 fallos/92 verdes. Los tres fallos son candados heredados
de #70 que esperaban cuerpos con cero recordatorios reales y recibieron la
última fixture de R5 (`rem-1`).

La causa es el andamiaje prescrito: los tests de R5 llaman a
`mockListReminders.mockResolvedValue(...)`, y su `afterEach` no restaura un
`jest.fn` de módulo. Después, los `beforeEach` heredados solo ejecutan
`jest.clearAllMocks()`, que limpia llamadas pero conserva precisamente esa
implementación. Por tanto, ya no vuelve por sí sola la respuesta `[]` escrita
en la factoría.

A11 añade un `beforeEach` de nivel de fichero que repone la respuesta vacía
antes de cada test; cada `describe` puede sobrescribirla después. Con él, R5 y
los heredados quedaron 95/95 verdes sin tocar ningún `describe` de #70. La
factoría permanece intacta.

## Bloqueo C4 antes de R9: dos rojos imposibles por el orden prescrito

R5 prescribe literalmente derivar `upcoming` con
`reminders.data?.kind === 'ok' ? upcomingReminders(...) : []`
(`tasks.md:150`). Esa guarda ya está en producción (`index.tsx:182-185`). Sin
embargo, R9 ordena después `Escribir test que falla` y reconoce a la vez que
`El ternario de R5 ya cubre los dos casos` (`tasks.md:232-239`). Sus pruebas de
carga y de los cinco fallos nacerían verdes por construcción.

R10 repite el mismo problema: R5 ya obliga a las recetas exactas de fila,
título, fecha y contador, incluida `TABULAR_NUMS` (`tasks.md:150-154`), y R6
añade el disco exacto. Producción ya contiene esos valores
(`index.tsx:634-662`). R10 vuelve a ordenar `Escribir test que falla`, pero su
rojo es condicional a que una receta anterior esté mal (`tasks.md:245-253`).
Con R5/R6 verdes, su prueba también nacería verde.

Esto contradice `CHECKPOINTS.md` C4: un requisito que solo asevera una
propiedad dejada por otro requisito debe declararse de verificación antes del
handoff y seguir la vía (a) test previo o (b) mutación de producción. R7 sí lo
declara y versiona M9/M10; R12 sí prescribe una sonda. R9 y R10 no hacen
ninguna de las dos cosas. Adelantar sus tests exigiría reescribir el historial,
que está prohibido; fabricar un fallo no autorizado también incumpliría la
spec.

La salida mínima necesita una A12 aprobada: declarar R9 y R10 requisitos de
verificación por C4(b), prescribir para cada uno una sonda de producción
versionada que haga caer su propia aserción y restaurarla en el verde. Esas dos
sondas pueden quedar fuera de las trece M1-M13 de R15, pero la enmienda debe
decirlo expresamente para no crear otra discrepancia de recuento. Se paró antes
de escribir los tests de R9; R8 y `#70 R11` estaban 4/4 verdes, typecheck y lint
dirigido en exit 0, y no hay cambios de backend.

## Bloqueo de evidencia P9 tras A12

A12 prescribe una sonda válida —añadir el estado `ok` de recordatorios a la
condición de `reminders-next-vaccine`—, pero atribuye al rojo un efecto que esa
edición no puede producir: afirma que desaparece
`reminders-section-skeleton` (`requirements.md:1315-1317`).

En producción son ramas hermanas independientes. El skeleton depende solo de
`detail.data === undefined` (`index.tsx:566-571`); la línea que P9 modifica es
la condición separada de la tarjeta (`index.tsx:573-606`). Cuando el perfil
está cargando, `nextVaccine` ya es nulo con o sin P9, de modo que la sonda no
cambia el skeleton y el escenario conserva exactamente uno.

P9 sí mata los dos casos nominales de R9 por el motivo correcto: con detalle
resuelto y vacuna presente, recordatorios pendientes o fallidos apagan
`reminders-next-vaccine`, por lo que `body.children.length` pasa de 1 a 0. La
corrección mínima es conservar la sonda y sustituir únicamente la evidencia
`desaparece el reminders-section-skeleton` por
`desaparece reminders-next-vaccine y el cuerpo pasa de un hijo a cero`; el
subescenario de perfil cargando debe seguir esperando un skeleton.

Se paró antes de escribir tests o mutar producción. El árbol seguía limpio,
R1-R8 permanecían cerrados y no se tocó backend.

## Sonda P9 de R9

En el commit rojo `1d8c3d5`, la condición de `reminders-next-vaccine` se ligó
temporalmente a `reminders.data?.kind === 'ok'`. R9 dejó 6 fallos/0 verdes: el
`it('no pinta filas mientras carga')` y las cinco ejecuciones de
`it.each` recibieron `body.children.length === 0` en vez de 1. En todos los
casos desapareció la tarjeta de la vacuna; el skeleton independiente no fue la
causa, conforme a A13.

P9 se retiró en `68b3d90`; R9 y los candados heredados `#70 R9`/`#70 R1`
volvieron 24/24 verdes, y `git diff --exit-code` confirmó la restauración.

## Sonda P10 de R10

En el commit rojo `7016683`, la píldora usó temporalmente la superficie y tinta
del tipo del recordatorio en vez del ámbar fijo. Cayó exactamente
`it('aplica la receta de cada nodo y ninguna otra')`: la fila `appointment`
recibió `bg-category-green text-category-green-strong` donde esperaba
`bg-category-amber text-category-amber-strong`.

P10 se retiró en `3b7bcfa`; R10 volvió 1/1 verde, los candados `#62 R14`,
`#62 R4`, `#64 R9`, `#61 R4` y `#61 R5` quedaron 43/43 verdes, y
`git diff --exit-code` confirmó la restauración. P10 queda fuera de M1-M13.

## Sonda de drift de R12

El bloque `#85 R12` nació 1/1 verde sobre sus cinco ficheros nominales. Se
añadió temporalmente `const STYLE_DRIFT_PROBE = '#fff'` a producción en
`screens/home/format.ts`; el test cayó con `Received: ["screens/home/format.ts"]`
frente a `Expected: []`. Retirada la sonda sin commit, el bloque volvió verde,
la suite completa de drift quedó 28/28 y `git diff` solo contenía el test nuevo
antes de versionarlo en `fce3ffc`.

## R13 — recorrido de los candados globales

La corrida previa dejó exactamente tres rojos en `#62 R15`: Home esperaba 6
usos y midió 7; `#69 R14` esperaba delta 2 y midió 3; `#70 R18` esperaba delta
1 y midió 2. El total declarado aún se autocumplía con sus cifras antiguas, por
eso R13 mueve conjuntamente la constante `HOME_TABULAR_DELTA_85`, la fila de
Home, el total cerrado y las dos guardas. No se absorbió ningún otro cambio.

| Fila | Medición contra `20c7b3c` |
|---|---|
| 1 | catálogo 288 (`260 + 16 + 1 + 4 + 7`) por idioma; claves iguales |
| 2 | `R3_HOME` 48 (`21 + 15 + 1 + 4 + 7`); usos exactos verdes |
| 3 | las siete claves literales de `#70 R16` siguen iguales |
| 4 | Home mide 7 usos tabulares: base 4 + deltas 1 + 1 + `HOME_TABULAR_DELTA_85 = 1` |
| 5 | un `describe('#85 R12…')` nuevo, como estaba previsto |
| 6 | cinco entradas nuevas en el doble de `reicon`, las cinco nominales |
| 7 | Home conserva 2 esquinas directas; total cerrado `33 + 1 + 1` |
| 8 | clases categóricas solo en `category-palette.ts`; interpoladas `[]` |
| 9 | `bg-accent-soft` conserva 16 usos |
| 10 | Home conserva 2 `text-accent-strong`; total `13 + 1` |
| 11 | inventario `text-warning-strong` intacto y verde |
| 12 | botones primarios conserva 13 |
| 13 | las cuatro clases de radio prohibidas conservan listas vacías |
| 14 | flechas tipográficas `[]`; Profile conserva 3 `ChevronRight` |
| 15 | `<Syringe size={20}` conserva 2 ocurrencias y `💉` cero |
| 16 | `SCREEN_FILES` conserva `19 + 2` |
| 17 | los cuatro candados de orden de `home-content` siguen verdes |
| 18 | `app/(tabs)/home.tsx` no aparece en el diff y su ruta sigue delgada |
| 19 | consistencia relativa entre idiomas verde |
| 20 | `ALL_USES` cuadra con la suma de sus once bloques |
| 21 | `backend-pet-tracker/test/pet-reminders.e2e-spec.ts` no aparece en el diff |

Tras aplicar solo el delta de la fila 4, las seis suites dirigidas quedaron
244/244 verdes; typecheck y lint del candado, exit 0.
