# Implementación — mobile-home-quick-actions (#71)

- Fecha: 2026-09-08; correcciones tras review: 2026-09-09
- Branch: `feature/71-mobile-home-quick-actions`
- Base de medición de R14: `f9163bf`
- HEAD al iniciar esta sesión: `71a4db7`
- Estado: implementación terminada; queda `in_progress` para revisión humana.
  No se marca `done`, no se abre PR y no se mergea.

## Resultado

La Home incorpora una rejilla de tres accesos rápidos, entre la tarjeta del
collar y la actividad semanal:

1. Peso → `/weight-log`, `Weight`, hueco `violet`.
2. Recordatorio → `/add-reminder`, `CalendarPlus`, hueco `amber`.
3. Documentos → `/pets/<selectedPetId>/docs`, `FileText`, hueco `blue`.

La sección es navegación pura: no añade datos, llamadas a API, rutas,
dependencias, tokens ni cambios de backend. Los fondos proceden de
`CATEGORY_SLOTS` y la tinta se deriva del mismo `slot` con `useThemeColors`.

## Requisitos y commits TDD

Se respetó el orden prescrito:
`R1 → R2 → R3 → R4 → R5 → R6 → R7 → R8 → R9 → R10 → R12 → R11 → R13 → R14 → R15`.

| R-id | Resultado | Rojo → verde |
|---|---|---|
| R1 | tabla, rótulo y tres tiles en orden | `4552103` → `5eb6c2c`; corrección `9a4854e` → `7bf12d5` |
| R2 | navegación exacta y cruce con rutas reales, sin cast común | `20355a6` → `48a0fe0`; correcciones `167e505`, `7f967b3`, `da9a847` → `ba92380` y `db588de` |
| R3 | solo tres destinos ganan sitio; ninguna pestaña | `d4c506e` → `feb786f`; corrección `9a4854e` → `7bf12d5` |
| R4 | icono, etiqueta, color, tinta y destino ligados por tile con `within(tile)` | `b9b6926` → `50527a6`; corrección `8246d2e` → `41838b5` |
| R5 | fondo desde `CATEGORY_SLOTS`; tinta derivada y observada por hueco | `5c73799` → `9f6b76c`; corrección `8246d2e` → `41838b5` |
| R6 | `min-h-11`, `flex-1`, sin `hitSlop` | `e98030e` → `494bae2` |
| R7 | `Weight`, `CalendarPlus`, `FileText`, tamaño 24 y sin glifos del tab bar | preparación `a1796c9`; `8e21f05` → `bb3ae19` |
| R8 | `rounded-xl` y un solo `CONTINUOUS_CORNER` dentro del `.map()` | `f8040c3` → `063d6c9` |
| R9 | tres botones independientes, sin agrupar la fila para accesibilidad | `d89b5fd` → `412d32c` |
| R10 | rejilla entre collar y gráfica; ausente sin mascota | `2f9ec85` → `af5c099` |
| R12 | recuentos conservados: pets, detalle y actividad | `c1a4b30` → `7fb35af` |
| R11 | cuatro usos registrados y copy documentada | `cf6ec2e` → `84198eb` |
| R13 | bloque nominal de drift sobre los tres fuentes | `9ea0a17` → `ed591de` |
| R14 | deltas declarados; rojo natural `+4` del catálogo | `17c8c01` → `bf18ed2` |
| R15/R15b | suite/typecheck y mutaciones de producción | `7ed1283`…`8b9bef4`; correcciones `9a4854e`…`41838b5`; detalle abajo |

`17c8c01` es deliberadamente un commit vacío: captura el árbol rojo natural
que dejaron las cuatro claves de R1 frente a la base histórica. La spec autoriza
en `language-provider.test.tsx` únicamente el cambio posterior de la suma; no
se alteró otra línea para fabricar ese rojo.

## Deltas de R14 contra `f9163bf`

No se colapsó ninguna base histórica a una cifra absoluta.

| # | Candado | Delta medido |
|---:|---|---|
| 1 | longitud del catálogo | `260 + 16 + 1` → `260 + 16 + 1 + 4` |
| 2 | filas `R3_HOME` | `21 + 15 + 1` → `21 + 15 + 1 + 4` |
| 3 | esquinas continuas de Home / total cerrado | `1 → 2`; `33 + 1` → `33 + 1 + 1` |
| 4 | bloques nominales de drift | `+1 describe` para #71 |
| 5 | `SCREEN_FILES` | sin cambio: conserva `19 + 2` |
| 6 | ficheros con clases categóricas | sin cambio: solo `utils/category-palette.ts` |
| 7 | usos de `bg-accent-soft` | sin cambio; el candado conserva su base enumerada |
| 8 | cifras tabulares | sin cambio |
| 9 | acento como tinta | sin cambio |
| 10 | botones primarios | sin cambio |
| 11 | radios fuera de escala | sin cambio: lista vacía |
| 12 | `ALL_USES` frente a sus bloques | cuadra por consistencia interna; solo entra el `+4` de R3_HOME |
| 13 | orden heredado de `home-content` | sin cambio; ambos candados por lista blanca siguen verdes |
| 14 | glifos tipográficos | sin cambio; #62 R7 sigue verde |

Las suites completas de `consistency-classnames`, `legibility-classnames`,
`ui-language` y `design-drift` pasaron antes de mover la fila 1. El único rojo
restante fue el `+4` previsto de `language-provider`; tras aplicarlo, las
cinco suites quedaron verdes. Ninguna cifra no enumerada se movió.

## Prueba de mutación R15b

Cada mutación se plantó por separado en
`src/screens/home/index.tsx`, se ejecutó el candado focalizado, se versionó en
rojo, se revirtió en otro commit de producción y se volvió a ejecutar en
verde. No se mutó ningún mock.

| # | Mutación de producción | Evidencia roja | Commit rojo → verde |
|---:|---|---|---|
| 1 | tile Peso: `/weight-log` → `/add-reminder` | 2 fallos: `lleva cada tile a su ruta existente` y `liga icono, etiqueta, color y destino…`; ambos recibieron `/add-reminder` | `7ed1283` → `55f6f7b` |
| 2 | intercambio de `Icon` entre Recordatorio y Documentos | 2 fallos: R4 no encontró `icon-calendar-plus` dentro del tile 2 y R7 no encontró `icon-file-text` dentro del tile 3 | `d94f57d` → `098bab5` |
| 3 | intercambio de `labelKey` entre tiles 2 y 3 | R4 no encontró `Recordatorio` dentro del tile 2; el registro R11 siguió verde porque ambas claves conservan un uso | `d7460dd` → `8498798` |
| 4 | Peso: `slot: 'violet'` → `'amber'` | R4 esperaba `bg-category-violet` y recibió `bg-category-amber`; el candado de forma R5 siguió verde | `acb5368` → `685bf22` |
| 5 | cuarto tile con `Map`, `tabs.map`, `green`, `/map` | 3 fallos: R1 encontró `quick-action-map`, R2 contó cuatro destinos y R3 contó cuatro definiciones | `9c2605f` → `2c84a52` |
| 6 | rejilla detrás de `weekly-activity-card` | R10 recibió `weekly-activity-card` antes de `quick-actions`; los dos órdenes heredados siguieron verdes | `15ab56c` → `7a20b4a` |
| 7 | retirada de `min-h-11` | R6 recibió el `className` sin el objetivo táctil mínimo | `0c2d790` → `8b9bef4` |

Todas las restauraciones pasaron sus mismos filtros focalizados. Antes de las
mutaciones, `bun run test --runInBand --silent` terminó con 68 suites, 1054
tests y 1 snapshot verdes; `bun run typecheck` terminó con exit 0. Tras corregir
los dos `fireEvent.press` para esperar la API asíncrona de RNTL 14, el fichero
Home pasa 68/68 sin ámbitos `act()` solapados. `bun run lint` termina sin
errores ni warnings.

## Premisas contrastadas con el árbol

Cuatro matices de redacción de la spec no describen literalmente el arnés, pero
no requieren enmienda ni dejan un comportamiento sin vigilar:

1. R7/tasks dice “tres usos `size={24}`” al hablar de lectura de fuente. El
   contrato cerrado de `design.md` exige un único `<Icon size={24}>` dentro del
   `.map()`: hay una ocurrencia textual y tres instancias renderizadas. El test
   comprueba ambas cosas y usa `within(tile)` para cada instancia.
2. La mutación 3 pone roja la suite por R4, no por el contador R11. R11 cuenta
   usos por clave; intercambiar dos claves conserva esos recuentos. R4 es el
   candado semántico que liga la etiqueta al tile.
3. La mutación 4 pone roja la suite por R4, no por el candado de forma R5.
   Cambiar un `slot` mantiene correctamente la derivación
   `CATEGORY_SLOTS[slot]`/``category-${slot}-strong``; R4 fija qué hueco
   corresponde a Peso.
4. R2 afirma que el repo usaba `as Href` en dos sitios. Tras retirar de Home el
   cast común innecesario, `src/` conserva siete usos: cuatro en Profile y uno
   en Add Reminder, Reminders y Food. El `router.push` único del `.map()` acepta
   las tres rutas sin cast y `tsc --noEmit` queda verde; por tanto `/weight-log`
   vuelve a typecheckear sin quedar cubierto por `as Href`.

No se editó ninguna spec `approved` para resolver estos matices.

## Alcance de ficheros

Los cambios de esta implementación se limitan a la lista de `design.md` §7. La
única modificación propia fuera de esa lista es `progress/current.md`, exigida
por `AGENTS.md` para documentar la sesión mientras está activa. No se tocó la
barra de tabs, `_layout.tsx`, `src/app/`, `src/components/`, `src/theme/`,
`src/utils/`, backend ni infraestructura; tampoco se añadieron dependencias.

La branch contiene dos commits de documentación ajenos a #71 y pertenecientes
a otra sesión de Claude: `71a4db7` añadió el runbook de demo y una fila a
`AGENTS.md` antes de que empezara esta implementación; `997c080` corrigió una
línea del mismo runbook durante la primera corrida final. Se conservaron sin
reescribir historia ni revertir trabajo ajeno y deben nombrarse al abrir la PR.

## Gate final inicial

- `env -u FORCE_COLOR ./init.sh`: única corrida final, exit 0. Build verde;
  backend unitario verde; móvil 68/68 suites, 1054/1054 tests y 1/1 snapshot;
  e2e 25 suites y 354 tests verdes, con 3 suites/8 tests omitidos por el arnés;
  lint y typecheck verdes.
- `graphify update .`: exit 0 después del gate. Actualizó el grafo local a
  11034 nodos, 17031 aristas y 684 comunidades; `graphify-out/` sigue ignorado
  y no añadió cambios versionados. Avisó de que 16 ficheros SQL no aportaron al
  grafo por no estar instalado el extra opcional `tree_sitter_sql`.
- Aviso no bloqueante ya existente durante `init.sh`: AWS SDK comunica que sus
  versiones posteriores a la primera semana de enero de 2027 exigirán Node 22;
  la ejecución actual con Node 20.20.2 terminó verde.

## Correcciones tras el veredicto

El veredicto rechazado quedó registrado en `c18f099`. El preflight del
2026-09-09 terminó con exit 0 antes de editar: 68 suites / 1054 tests móviles y
25 suites / 354 tests e2e verdes.

| Observación | Rojo → verde | Evidencia |
|---|---|---|
| O1 — exactamente tres tiles renderizados | `9a4854e` → `7bf12d5` | Con un cuarto `Pressable` inline a `/pairing`, la regex amplia `/^quick-action-/` recibió `quick-action-extra`; al retirar solo la mutación, el test volvió a verde. |
| O2 — tinta ligada a cada tile | `8246d2e` → `41838b5` | Con `quickActionInks[0]`, R4 esperaba `--color-category-amber-strong` en Recordatorio y recibió violeta. El icono se consulta con `within(tile)`; restaurar `[index]` dejó el candado verde. |
| O3 — cast no declarado | `da9a847` → `ba92380`; ajuste `db588de` | El test R2 quedó rojo contra el cast común; se retiraron el cast y el import, y tanto el test como `tsc --noEmit` pasaron. La aserción final usa regex para no sumar una coincidencia ficticia al inventario literal. |
| O5 — evidencia de M5 | documentación | La fila original queda corregida: M5 provoca tres fallos, no dos. |

Después de las correcciones se replantaron, una por una, las siete mutaciones
originales de producción sobre el filtro de seis suites (198 tests), restaurando
`src/screens/home/index.tsx` entre ejecuciones:

| Mutación | Resultado rojo tras el review |
|---|---|
| M1 destino | 2 fallos: navegación exacta y cruce R4 |
| M2 icono | 2 fallos: cruce R4 e iconografía R7 |
| M3 etiqueta | 1 fallo: cruce R4 |
| M4 hueco/color | 1 fallo: R4 detectó primero la tinta ámbar en Peso |
| M5 cuarto tile `/map` | 3 fallos: árbol renderizado R1, inventario R2 y filtro R3 |
| M6 colocación | 1 fallo: R10 |
| M7 objetivo táctil | 1 fallo: R6 |

El control posterior pasó 6/6 suites y 198/198 tests. No quedó ninguna mutación
en producción, no se movió ninguna cifra de candado y no se tocó backend ni
infraestructura.

Gate correctivo final:

- `env -u FORCE_COLOR ./init.sh`: única corrida final posterior a las
  correcciones, exit 0. Build verde; backend 163/163 suites y 1243/1243 tests;
  infraestructura 2/2 suites y 14/14 tests; móvil 68/68 suites, 1054/1054 tests
  y 1/1 snapshot; e2e 25 suites y 354 tests verdes, con 3 suites/8 tests
  omitidos por el arnés; lint y typecheck verdes.
- `graphify update .`: exit 0 después del gate. Actualizó el grafo local a
  11063 nodos, 17058 aristas y 691 comunidades; `graphify-out/` permanece
  ignorado. Conserva el aviso no bloqueante de 16 SQL omitidos por no estar
  instalado el extra opcional `tree_sitter_sql`.
- Avisos preexistentes no bloqueantes: faltan `RESEND_API_KEY`, `RESEND_FROM` y
  `RESET_LINK_HOST` en `.env`; AWS SDK anuncia el requisito futuro de Node 22.
