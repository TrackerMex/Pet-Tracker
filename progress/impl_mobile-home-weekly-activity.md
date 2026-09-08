# Implementación: mobile-home-weekly-activity (#68)

Fecha: 2026-09-07

Branch: `feature/68-mobile-home-weekly-activity`

Base de medición: `4a5f6dd`

Implementador: Codex CLI

## Resultado

Quedaron implementados y trazados R1–R20, incluidos R1b, R14b, R20b y la
enmienda E1. La Home consume los siete días que ya descargaba, presenta la
actividad semanal con selector, eje Y, rejilla, media, tendencia, detalle y
animación accesible; la pantalla vive ahora en `src/screens/home/`; y
`device.connectivity` se resuelve por catálogo en Emparejado.

No se añadió ninguna llamada de red, ruta de backend ni recurso AWS. No se tocó
ningún fichero de `backend-pet-tracker/` ni `infra/`. La feature permanece
`in_progress`: el smoke humano en dev build Android sigue siendo un gate no
delegable. No se abrió PR, no se hizo merge y no se marcó la feature como
`done`.

## Rojo → verde por requisito

Los commits siguen el orden obligatorio de `tasks.md`; R1b forma parte del
bloque de dependencia de R1. Cada prueba roja quedó separada de la
implementación que la puso verde.

| R-id | Resultado | Rojo | Verde |
|---|---|---|---|
| R1 | Dependencia exacta, transformación ESM y único import por `/v2` | `90cde79` | `d96b664` |
| R1b | Versión fijada y cinco constantes geométricas documentadas | `287bdf3` | `a471331` |
| R15 | Route Home delgado, pantalla y pruebas migradas sin rebajar asserts | `572d732` | `97136ad` |
| R2 | API del componente acotada a datos recibidos, sin red ni Router | `9ea68fb` | `40e4c2e` |
| R3 | Columnas en orden recibido y etiquetas derivadas de cada fecha | `14721b9` | `f036d3e` |
| R4 | Parseo local por componentes de `YYYY-MM-DD` | `9154c41` | `b77fdca` |
| R5 | `source` distingue un hueco de un cero o un nulo medido | `521414b` | `d2f98ec` |
| R7 | Eje Y, rejilla, formato estable y media sin días ausentes | `e52f6e4` | `2f0d626` |
| R11 | Dimensión numérica obtenida mediante `onLayout` | `9417c87` | `6d514e2` |
| R6 | Selector de las tres métricas sin refetch | `a398211` | `a563829` |
| R9 | Resumen localizado y una etiqueta accesible por columna | `8f7c50a` | `b655e79` |
| R10 | Entrada escalonada en UI thread y bypass con reduced motion | `709e71f` | `9e16364` |
| R12 | Tendencia localizada ligada a la métrica seleccionada | `c4250ff` | `15caa13` |
| R13 | Estado vacío solo cuando toda la semana está ausente | `22ba924` | `8b6ed14` |
| R8 | Tooltip, detalle completo y acción de mapa solo para hoy | `b6c98d1` | `796b5b6` |
| R14 | Tarjeta entre resumen y posición, mismos datos y mismas peticiones | `23ae28a` | `b7561e6` |
| R14b | Skeleton dimensionado y silencio de la tarjeta ante error | `23ae28a` | `b7561e6` |
| R16 | Mapa de conectividad conocido/desconocido/nulo y uso en Emparejado | `aad245f` | `e66d935` |
| R17 | Copy nuevo en ambos catálogos y todas sus llamadas registradas | `3b1f250` | `8ed8ee4` |
| R18 | Colores por tokens resueltos y sin escapes de estilo | `2620934` | `fe6e721` |
| R19 | Reubicaciones y deltas reales de los candados | `05dc74f` | `4f4806d` |
| R20 | Gate móvil, typecheck, carta y grep-clean | `314a9ee` | `41b4411` |
| R20b | Cinco mutaciones independientes detectadas y restauradas | mutaciones temporales descritas abajo | `41b4411` |
| E1 | `device.connectivity` retirado de los enum crudos de la carta | `314a9ee` | `41b4411` |

La trazabilidad con los mensajes completos vive en
`specs/mobile-home-weekly-activity/traceability.md`.

## Prueba de mutación de R20b

Cada mutación se plantó sola sobre el mismo árbol, se ejecutó con
`bun run test -- --runInBand --silent` y se restauró antes de continuar. Tras
la quinta se comprobó que
`git diff --exit-code -- src/screens/home/weekly-activity-chart.tsx` no dejaba
ningún cambio.

| # | Mutación temporal | Salida que demuestra que murió |
|---|---|---|
| 1 | `weekdayLabel(day.date, ...)` → tabla fija indexada | `FAIL` en R3, `usa el día real de cada fecha en los dos idiomas`; la secuencia recibida empezó artificialmente en lunes |
| 2 | `new Date(year, month - 1, day)` → `new Date(date)` | `FAIL` únicamente en el `it` prescrito por R4, `no se desplaza un día en una zona horaria negativa`; rechazó literalmente `new Date(date)` |
| 3 | rama de hueco por `metricValue(...) === null` | `FAIL` únicamente en R5, `usa source aunque una métrica stored sea null`; desapareció el valor del día `stored` plantado por el test |
| 4 | etiqueta accesible del día `missing` → `undefined` | `FAIL` únicamente en R9, `anuncia los huecos sin colapsar las siete columnas`; recibió `undefined` en vez del anuncio localizado |
| 5 | import `/v2` → import raíz | `FAIL` en R1, `importa la gráfica solo desde react-native-chart-kit/v2`; la API v1 causó además fallos derivados al intentar montar la gráfica |

Las dos mutaciones de zona ciega quedaron rojas como exige la spec. En la
segunda, el runtime Jest en UTC no cambia de zona al reasignar `process.env.TZ`;
por eso el mismo `it` contiene además el candado estructural que prohíbe la
construcción con la cadena cruda. En la tercera, el único fallo fue el caso
deliberado `source: 'stored'` con métrica nula.

## Deltas medidos de R19

Los candados conservan la base histórica en la expresión y suman únicamente el
delta de esta feature:

| Inventario | Delta medido contra `4a5f6dd` | Tratamiento |
|---|---:|---|
| Usos de copy de Home (`R3_HOME`) | `+15` | Una fila por llamada real de la gráfica |
| Usos de copy de Emparejado (`R10_PAIRING`) | `+2` | Las dos ramas `labelKey` del helper |
| Ficheros inspeccionados por `ALL_USES` | `+2` | Gráfica y helper de conectividad |
| Claves pares del catálogo | `+16` | Mismo delta en español e inglés |
| Fila de cifras tabulares | `+4` | Nueva fila para la gráfica |
| Fila de esquinas continuas | `+1` | Nueva fila para la gráfica |
| Entrypoints delgados | `+1` | Route Home migrado |
| Assert de dependencias aprobadas | `+1` | Pin exacto de chart-kit |
| Inventario de botón primario | `0` | La acción de mapa usa la variante secundaria aprobada |
| Inventario de acento como tinta | `0` | El color imperativo entra por tokens, no por clase |

La migración de R15 solo cambió rutas, sin mover cifras, para las filas de
esquinas continuas, cifras tabulares, acento como tinta y todo `R3_HOME`. Se
rehicieron también dos reubicaciones que la tabla aprobada no enumeraba: el
candado de import del `Card` compartido en `design-drift.test.ts` y el de
`text-warning-strong` en `legibility-classnames.test.ts`.

## Verificación final

- Suite móvil completa de referencia: exit 0.
- Suite dirigida de gráfica, catálogo, copy, diseño, radios, legibilidad y
  conectividad después de restaurar mutaciones: exit 0.
- `bun run typecheck`: exit 0.
- Grep manual de producción: sin coincidencias para hex fuera de `src/theme/`,
  clases arbitrarias, `StyleSheet.create`, sombras/elevation legacy o radios
  prohibidos. Las coincidencias al buscar en todo `src/` fueron únicamente las
  regex y literales con los que los propios tests prohíben esos patrones.
- `./init.sh` final: exit 0; build, tests, e2e, lint y typecheck verdes. Los
  avisos existentes de `.env`, `STATUS.md` y futura versión mínima del AWS SDK
  no abortaron el gate y no pertenecen a #68.
- `graphify update .`: exit 0. Actualizó `graphify-out` sin cambio versionado;
  avisó que la extracción SQL opcional no estaba instalada, sin impedir la
  actualización del grafo de código.
- Estado posterior a `init.sh`: ningún cambio en `backend-pet-tracker/` ni
  `infra/`.

Durante una corrida anterior a la referencia verde reapareció una vez el flaky
conocido #72 del image picker. Se separó de R20b, se repitió la mutación
afectada desde base verde y tanto esa corrida como el `init.sh` final quedaron
limpios.

## Premisas de la spec que no coincidieron con el árbol o el runtime

1. R15 no enumeraba dos candados adicionales por la ruta antigua de Home: el
   import del `Card` compartido y el color de advertencia. Ambos se reubicaron
   sin cambiar su cifra ni debilitar el assert.
2. Reasignar `process.env.TZ` dentro de un worker de `jest-expo` no ejecuta un
   `tzset` efectivo. El caso R4 conserva la prueba prescrita y añade dentro del
   mismo `it` la prohibición estructural que mata la mutación en CI UTC.
3. El `Intl.NumberFormat` disponible en el runtime devuelve punto para el
   decimal de `es-MX`, mientras la salida aprobada exige coma. Se mantiene
   `Intl.NumberFormat` y se normaliza el separador español.
4. R19 y `design.md` §4 omitían el candado de longitud de catálogo de
   `src/providers/__tests__/language-provider.test.tsx`. La adición aprobada
   producía `+16`; tras autorización humana expresa se cambió solo ese assert,
   conservando su base como suma visible.
5. `design.md` §4 afirma que `mobile-pet-tracker/` es la única raíz tocada,
   pero E1 obliga a editar `docs/ui-guidelines.md` y el proceso obliga a
   actualizar trazabilidad y progreso. Se aplicaron esas obligaciones y se
   enumeran abajo.

## Archivos fuera de `design.md` §4

No se tocó ningún archivo adicional sin dejarlo declarado:

- `docs/ui-guidelines.md`: cambio exacto de E1, aprobado por el humano aunque
  omitido en la lista §4.
- `mobile-pet-tracker/bun.lock`: actualización reproducible de la dependencia
  exacta instalada para R1.
- `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`:
  delta de catálogo descubierto por la suite y autorizado expresamente por el
  humano; solo cambia el candado de base `+ 16`.
- `progress/current.md`: bitácora obligatoria de la sesión.
- `specs/mobile-home-weekly-activity/traceability.md`: actualización incremental
  obligatoria tras los commits.
- `progress/impl_mobile-home-weekly-activity.md`: este informe, pedido en el
  cierre.

`graphify update .` no dejó archivos versionados modificados. Fuera de la lista
anterior, el diff de implementación coincide con §4.

## Correcciones tras el veredicto

El veredicto del reviewer no exigía corregir la lógica de la gráfica: el parseo
local de fecha y las decisiones por `day.source` ya eran correctos. Se
reforzaron sus candados sin modificar producción en R4 ni R5.

### R4 — construcción local observable

Se eligió la vía (a) aprobada: espiar `global.Date` y delegar cada llamada al
constructor real mediante `Reflect.construct`. Es la alternativa más pequeña:
no añade otro proyecto ni otro worker Jest y comprueba la construcción local
con componentes numéricos independientemente del nombre del parámetro. El
candado anterior por `not.toContain('new Date(date)')` quedó eliminado.

- Test primero: `cab9028` — `fix(mobile-home-weekly-activity): guard numeric date construction (R4)`.
- Verificación verde tras restaurar producción: `b833f1d` — `fix(mobile-home-weekly-activity): verify numeric date construction (R4)`.
- Mutación nueva: parámetro renombrado a `isoDate` y
  `new Date(isoDate).toLocaleDateString(...)`. Salida de la suite móvil completa:
  exit 1 en `no se desplaza un día en una zona horaria negativa`; el espía
  esperaba la llamada `[2026, 8, 6]` y recibió `['2026-09-06']`. La producción
  se restauró sin diff.

### R5 — `source` en cada decisión

El caso `source:'stored'` con métrica nula ahora verifica, sobre ese mismo día,
el dato entregado a `BarChart`, la media y el panel de detalle. El fixture añade
un día `missing` con un valor centinela no nulo, de modo que `source` y el valor
dejen de coincidir accidentalmente.

Además, el test parsea el TSX y exige una comparación entre la propiedad
`source` y `'missing'` dentro de los contextos semánticos `chartData`,
`measuredValues`, `averageAnchorIndex` y el condicional que contiene
`weeklyActivity.noDataForDay`. No busca una cadena de fuente concreta: acepta
inversión de operandos y ambas polaridades estrictas. Este segundo nivel es
necesario porque, una vez que `chartData` normaliza correctamente el hueco a
`null`, las variantes por valor del denominador y del ancla pueden ser mutantes
equivalentes en caja negra si se plantan aisladas.

- Test primero: `6420f75` — `fix(mobile-home-weekly-activity): guard every missing-data decision (R5)`.
- Verificación verde tras restaurar producción: `8fd2780` — `fix(mobile-home-weekly-activity): verify missing-data decisions (R5)`.

Las mutaciones se plantaron una por una y cada corrida usó
`bun run test -- --runInBand --silent` sobre la suite móvil completa:

| Decisión mutada | Salida nueva que demuestra que murió |
|---|---|
| `chartData`: el valor enviado al gráfico pasa a decidirse por `metricValue(...) === null` | exit 1 en el `it` de R5; `latestBarChartProps().data` recibió el valor centinela del día `missing` donde esperaba `null` |
| `measuredValues`: el denominador pasa a decidirse por la métrica | exit 1 en el mismo `it`; el guard del contexto `measuredValues` recibió `false` donde exige el discriminante `source` |
| `averageAnchorIndex`: el ancla pasa a decidirse por la métrica | exit 1 en el mismo `it`; el guard del contexto `averageAnchorIndex` recibió `false` donde exige el discriminante `source` |
| Panel de detalle: `noDataForDay` pasa a decidirse por `metricValue(...) === null` | exit 1 en el mismo `it`; desapareció `weekly-activity-detail-active-minutes` y apareció “Sin datos de este día” para la entrada `stored` |

La corrida del denominador coincidió con una reaparición del flaky conocido de
selección de foto en Add Pet; el fallo prescrito de R5 estuvo presente en esa
misma salida. La corrida siguiente dejó Add Pet verde y la referencia restaurada
de la suite móvil completa terminó con exit 0. Tras cada mutación se restauró la
línea correspondiente; `weekly-activity-chart.tsx` no conserva ningún diff.

### Superficie explícita del botón de mapa

Se mantuvo `variant="secondary"`, porque cambiar su jerarquía sería resolver la
observación visual 3 que el humano dejó fuera de este encargo. Se añadió
`bg-default`: es el precedente neutral de Profile y empareja el
`text-foreground` existente. `bg-accent-soft` se reserva en el precedente de
Add Pet para la acción acentuada de elegir foto.

- Rojo: `60f3f9c` — `fix(mobile-home-weekly-activity): test explicit map action surface (R8)`; el botón no contenía `bg-default`.
- Verde: `c433e77` — `fix(mobile-home-weekly-activity): declare map action surface (R8)`; caso dirigido, candados de estilo relacionados, lint y typecheck en verde.

No se tocaron las observaciones 3, 5 ni 6, ni ningún fichero de backend o
infraestructura.

### Gate final de la corrección

- `./init.sh`: exit 0 en una única corrida final limpia, con build, tests, e2e,
  lint y typecheck verdes.
- `graphify update .`: exit 0; actualizó el grafo sin dejar cambios
  versionados. El aviso por la dependencia SQL opcional ausente no bloqueó la
  extracción del código.
- Auditoría de alcance: el diff correctivo no contiene ficheros de
  `backend-pet-tracker/` ni `infra/`; la feature sigue `in_progress` y no se
  abrió PR ni se hizo merge.

## D1 opcion (b)

La firma humana de D1(b) y E2 sustituye la decisión neutral documentada en
“Superficie explícita del botón de mapa”. El botón de
`weekly-activity-day-map` vuelve al patrón primario sólido del repositorio:
`min-h-11 w-full rounded-xl bg-accent`, variante primaria por defecto y label
`text-accent-foreground`. Conserva el área táctil, `testID`, copy,
`router.push('/map')` y la condición que lo muestra solo para hoy.

- Rojo `1e8a2f0` — `fix(mobile-home-weekly-activity): require thirteenth primary action (D1,E2)`: el caso de Home recibió todavía `secondary/bg-default`, y el candado global esperaba trece coincidencias pero recibió doce.
- Verde `705daea` — `fix(mobile-home-weekly-activity): restore primary map action (D1,E2)`: los casos dirigidos de Home y consistencia quedaron verdes.
- La segunda aserción de #62 R1, que prohíbe `rounded-2xl bg-accent`, no se modificó y sigue verde.
- `specs/mobile-ui-consistency-polish/requirements.md` solo cambia **12** por
  **13** en R1; conserva estado, requisitos y las cuatro ocurrencias históricas
  de `rounded-2xl`.
- `specs/mobile-ui-consistency-polish/design.md` sí enumeraba los doce sitios.
  §4 R1 pasa a trece y añade `src/screens/home/index.tsx`; “cambian 4” queda
  intacto porque describe las cuatro correcciones históricas de radio, mientras
  el sitio de #68 se incorpora ya conforme a `rounded-xl`.
- Las suites dirigidas completas de Home, consistencia, legibilidad y drift,
  además de lint y typecheck, terminaron con exit 0. No se movió ningún otro
  inventario y no se ajustó ningún otro candado.
- `./init.sh` final terminó con exit 0: build, suites completas —incluida la
  móvil con el nuevo candado—, e2e, lint y typecheck verdes.
- `graphify update .` terminó con exit 0 y no dejó cambios versionados; mantuvo
  únicamente el aviso conocido por la dependencia SQL opcional ausente.

## Pendiente humano

Queda el smoke firmado en dev build Android, tema claro y oscuro, con un día
sin dato y otro de cero confirmado, incluida la revisión visual, reduced motion
y TalkBack. Hasta ese gate, #68 debe seguir `in_progress` y el leader decide el
push y la apertura del PR.
