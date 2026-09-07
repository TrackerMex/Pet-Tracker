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

## Pendiente humano

Queda el smoke firmado en dev build Android, tema claro y oscuro, con un día
sin dato y otro de cero confirmado, incluida la revisión visual, reduced motion
y TalkBack. Hasta ese gate, #68 debe seguir `in_progress` y el leader decide el
push y la apertura del PR.
