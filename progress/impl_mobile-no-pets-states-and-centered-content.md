# Informe de implementación — #181, ronda 2

R8 (B2) y las mediciones de mutación (P1) quedan cerrados en esta ronda.
**B1 no resuelto**: no se encontró una reproducción determinista. No se aplica
ningún arreglo al picker ni a Perfil. Las tres corridas completas de diagnóstico
pasan, pero eso no demuestra la causa ni elimina la caída intermitente registrada
por el leader. La feature sigue a la espera del gate y de la revisión del leader.

## Retracción y entrega

Retiro la alegación de la ronda 1 de una «excepción explícita del handoff» para
no indexar el informe. Este informe y traceability se entregan commiteados, sin
excepciones ni cambios pendientes. No se usa el informe como sustituto del gate.

## Entorno y referencias

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-181`, correcto.
- Rama: `feature/181-mobile-no-pets-states-and-centered-content`, correcta.
- `git status --short` inicial: vacío.
- HANDOFF ronda 2: `f9d4179c53f7a7fe6805fc944eae8b1094efe42b`.
- Veredicto leído completo: `progress/review_mobile-no-pets-states-and-centered-content.md`, commit `73f5585b`.
- Spec sin cambios: firma `a64859d8`; leídos R8, R10, §3 y R9.
- **M1–M19 no se repiten ni se vuelven a medir**. Referencia: sección
  «M1–M19 antes de c1» de
  `git show 73f5585b:progress/impl_mobile-no-pets-states-and-centered-content.md`.
- Las precondiciones R8.1/R8.2 y las cuatro regex de R8.3 se verificaron contra
  el árbol antes de escribir el describe. Se cumplían y no se cambió producción.

## Commits de esta ronda y recuentos

| Cambio | Commit | Mensaje | Declaraciones de test añadidas |
|---|---|---|---|
| B1 | sin commit; sin arreglo | diagnóstico e instrumentación temporal revertida | 0 |
| R8 | `8da45c961ebfaf211e95213f7cf88a107813dc81` | test(mobile): exige los candados agregados de R8 (R8) | 3 |
| Informe y trazabilidad | commit que contiene este informe | docs(mobile-no-pets-states-and-centered-content): registra la ronda 2 (R8, R10) | 0 |

El hash del commit de documentación se obtiene sin autorreferencia con
`git log -1 --format=%H -- progress/impl_mobile-no-pets-states-and-centered-content.md`.
El hash histórico de c13 se fija en traceability a `6d3233181ebf033c3cbc510c9d1b3c222bc48b71`.

El recuento se comprobó sobre las líneas añadidas de declaraciones de test en
`git show` del commit R8. Total añadido esta ronda: **3**. En
`src/__tests__/no-pets-states.test.ts` hay **5 declaraciones locales** (2 de R9
más 3 de R8). Jest ejecuta **7 casos** en ese fichero porque importar
`ui-copy-table` registra sus dos auto-tests. Esa diferencia se observó en la
primera corrida verde y no se ocultó alterando el runner ni el módulo importado.

## B1 — diagnóstico sin arreglo

Se instrumentó únicamente `src/screens/profile/index.test.tsx`. La fábrica del
mock usó un Proxy que delegaba al mismo mock y devolvía su valor original.
Se registró por llamada: nombre de prueba (`currentTestName`), existencia de
`getMockImplementation()`, resultado de
`ImagePicker.launchImageLibraryAsync === mockLaunchImageLibrary`, retorno
inmediato indefinido o no, resolución indefinida o no, flag de mock del timer,
pila de llamada, y el nombre de prueba al resolver. También se registraron
beforeEach/afterEach. No se añadieron valores de respuesta ni reintentos.

Evidencia: `/tmp/181-picker-r2.jsonl` y
`/tmp/181-r2-picker-instrumentation.patch`. Antes de escribir R8 se revirtió
con `git checkout HEAD -- src/screens/profile/index.test.tsx` desde mobile y
se comprobaron ambos diffs vacíos. El fichero de Perfil no tiene cambios en
esta ronda.

Se observaron **30 llamadas y 30 resoluciones** en las cinco ejecuciones
instrumentadas: implementación presente, identidad igual y valor definido en
todas; ninguna resolución cambió de prueba. Son cinco llamadas a través de
la pantalla y una del candado #72 R3 por ejecución. La instrumentación puede
alterar el timing: no se presenta como prueba de ausencia de una carrera.

| Hipótesis | Evidencia y conclusión |
|---|---|
| Promesa o efecto previo llega tarde al picker | No hubo llamadas adicionales ni resoluciones durante otra prueba en las ejecuciones observadas. No confirmada; sin corrida fallida no se descarta en general. |
| Cola Once o espía cambia la implementación/propiedad | En las 30 llamadas hay implementación, identidad estable y resultado definido. La lectura no encuentra una cola Once del picker. No se obtuvo el estado de un fallo que confirme o descarte el origen intermitente. |
| Carga, timers u orden dentro del worker | Se probaron el fichero aislado, una combinación serial y tres corridas completas paralelas con cachés nuevas. No reprodujeron el fallo; la relación con carga/orden sigue sin determinarse. |

No se halló causa de producción ni se atribuye el problema a código de
producción por inferencia. Tampoco se introdujo un mockResolvedValue adicional,
it.skip, reintento de prueba, forceExit o debilitamiento de aserciones.

### Corridas y comandos

Todas desde el worktree indicado y con `cd` absoluto. En los comandos con
--runTestsByPath se verificó que Test Suites coincide con el número de rutas.

| Corrida | Orden | EXIT | Test Suites | Tests | Fallos |
|---|---|---|---|---|---|
| Perfil aislado | `bunx jest --runInBand --runTestsByPath 'src/screens/profile/index.test.tsx'` | 0 | 1 passed, 1 total | 138 passed, 138 total | ninguno |
| Combinación serial | `bunx jest --runInBand --runTestsByPath 'src/screens/profile/index.test.tsx' 'src/screens/reminders/index.test.tsx' 'src/screens/home/index.test.tsx'` | 0 | 3 passed, 3 total | 429 passed, 429 total | ninguno |
| Completa 1 | `bun run --cwd mobile-pet-tracker test --cacheDirectory=/tmp/181-jc-1` | 0 | 113 passed, 113 total | 3754 passed, 3754 total | ninguno; Time:        219.538 s |
| Completa 2 | `bun run --cwd mobile-pet-tracker test --cacheDirectory=/tmp/181-jc-2` | 0 | 113 passed, 113 total | 3754 passed, 3754 total | ninguno; Time:        200.639 s |
| Completa 3 | `bun run --cwd mobile-pet-tracker test --cacheDirectory=/tmp/181-jc-3` | 0 | 113 passed, 113 total | 3754 passed, 3754 total | ninguno; Time:        198.126 s |

Las completas usan la orden mobile de init.config.sh, que init.sh evalúa en su
bloque de tests; no se ejecutó init.sh. Antes de cada una, `pgrep -fl '[j]est'`
salió vacío. Las tres cachés no existían antes de usarlas. Salidas guardadas
con la redirección y `echo EXIT=$?` prescritos en `/tmp/181-full-1.log`,
`/tmp/181-full-2.log`, `/tmp/181-full-3.log`; EXIT=0 observado en las tres.
Una snapshot pasó en cada corrida. Se agotaron las tres de diagnóstico;
no se hizo la cuarta, reservada a un arreglo que no existe.

Logs de aislado y combinación: `/tmp/181-diag-alone.log` y
`/tmp/181-diag-combo.log`, con sus JSON del mismo prefijo.
**Orden determinista que reproduzca la caída: ninguna encontrada.**

### #114 R5 y #173 R5

Se comprobó el log histórico de c1 señalado por el reviewer: #114 R5 fallaba
buscando `reminders-loading`; #173 R5 buscando `pet-info-card`. Sus mensajes
son búsquedas agotadas, distintos del TypeError de picked.canceled. Los dos
describes pasaron en la combinación y en las tres completas de esta ronda.
**No se comprobó que tengan la misma causa que B1, ni una causa distinta**;
no se reproducen y esa relación queda abierta.

## R8 — tests nuevos sobre el árbol verde

Archivo: `src/__tests__/no-pets-states.test.ts`. Vía (b) de C4 autorizada por
el handoff, sin enmendar requirements. Los tres casos pasan antes de mutar:

- **Verde** — #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos
- **Verde** — #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios
- **Verde** — #181 R8: candados agregados y de catálogo #181 R8.3: mantiene las tres pantallas sin drift de estilos

R8.1 comprueba las filas mediante toContainEqual y las tres regex de copy en
Perfil y Recordatorios. R8.2 cuenta los EmptyState. R8.3 aplica exactamente las
cuatro regex prescritas a Inicio, Recordatorios y Perfil, sin relajarlas.
Cada caso se puso rojo con su mutación R8-M1, R8-M2 o R8-M3, respectivamente.

## R8 y R10 — mediciones de esta ronda

Todas se miden sobre el árbol de `8da45c961ebfaf211e95213f7cf88a107813dc81`, después del commit R8.
La base de los diez ficheros de referencia pasó sin mutar: 10 suites / 831
tests. Antes de plantar cada mutación y después de restaurarla con
`git checkout HEAD -- <ruta>` pasaron `git diff --quiet` y
`git diff --cached --quiet`. Ninguna mutación se commiteó ni sobrevive.
Se midieron **16 casos**: tres de R8 y trece de R10, al separar Inicio y
Recordatorios para X9 y X10. X5 es equivalente y no se planta.

Cada corrida usa --runTestsByPath con rutas literales entre comillas simples;
la ruta de food con (tabs) no se escapó. La cantidad de suites de la tabla
coincide con la cantidad de ficheros pasados. Se registran todos los tests
que caen, incluidos los adicionales. No hizo falta ampliar los ficheros de
referencia: todos los fallos pertenecen a la lista del handoff. Los 38 fallos
son de aserción, sin errores de compilación, ReferenceError ni TypeError.

| Mutación | Cambio | Resultado de suites | Tests rojos / verdes | Archivo :: nombre completo del test que cae | Commit de referencia |
|---|---|---|---|---|---|
| R8-M1 | Perfil: body common.noPetsBody → common.noPetsYet | 2 failed, 2 total | 2 / 143 | `src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.1: conserva un único testID y muestra pose talk, copy y acción para añadir<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| R8-M2 | Perfil: EmptyState de petsEmpty → expresión null | 2 failed, 2 total | 4 / 104 | `src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios<br>`src/components/__tests__/empty-state.test.tsx` :: #155 R10: los vacíos que no se ilustran siguen en texto src/screens/profile/index.tsx pinta 1 EmptyState<br>`src/components/__tests__/empty-state.test.tsx` :: #155 R10: los vacíos que no se ilustran siguen en texto ningún otro fichero usa EmptyState | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| R8-M3 | Perfil: comentario // #181 E4 | 2 failed, 2 total | 2 / 115 | `src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.3: mantiene las tres pantallas sin drift de estilos<br>`src/__tests__/design-drift.test.ts` :: R9: mobile-pets-profile sin drift keeps arbitrary text, hex colors, and StyleSheet out of feature sources | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X1 | Hook: eliminar la línea de clearPet de la rama vacía | 6 failed, 1 passed, 7 total | 7 / 607 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R7: Inicio converge al crear la primera mascota limpia la selección rancia y selecciona la mascota que llega al revalidar la lista<br>`src/app/(tabs)/__tests__/food.test.tsx` :: #181 R6: food hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío<br>`src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/health/index.test.tsx` :: #181 R6: health hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.2: limpia exactamente una vez con lista ok vacía y selección rancia | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X2 | Hook: eliminar la guarda común isRefreshing | 1 failed, 1 total | 3 / 14 | `src/hooks/use-pet-selection.test.tsx` :: R10: usePetSelection respeta el foco y la revalidación no pisa la selección mientras la pantalla enfocada revalida<br>`src/hooks/use-pet-selection.test.tsx` :: #87 R8: usePetSelection acepta la forma mínima y no conoce use-api does not select while the minimal source shape is refreshing<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia durante la revalidación | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X3 | Hook: llamar clearPet antes de retornar con kind no ok | 1 failed, 1 total | 5 / 12 | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia sin datos<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind error<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unreachable<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind missing-config<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unauthorized | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X4 | Inicio: quitar selectedPetId !== null de pet-hero-error | 1 failed, 1 passed, 2 total | 1 / 233 | `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X6 | Recordatorios: quitar selectedPetId !== null de reminders-error | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X7 | Perfil: quitar && !petsEmpty de petLoading | 1 failed, 1 passed, 2 total | 1 / 144 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S5: lista vacía revalidando y detalle pendiente no muestran esqueletos | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X8 | Perfil: quitar selectedPetId !== null de profile-pet-error | 1 failed, 1 passed, 2 total | 1 / 144 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X9-home | Inicio: trasladar EmptyState al scroll, sin retorno anticipado | 1 failed, 1 passed, 2 total | 3 / 231 | `src/screens/home/index.test.tsx` :: #155 R4: Inicio sin mascotas presenta a Pingo queda en el sitio del vacío que sustituye (enmendado por #181 R3)<br>`src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X9-reminders | Recordatorios: trasladar EmptyState al scroll, sin retorno anticipado | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R4: Recordatorios distingue una cuenta sin mascotas R4.2: centra solo el vacío y retira los controles que necesitan mascota | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X10-home | Inicio: justify-center → justify-start | 1 failed, 1 passed, 2 total | 1 / 233 | `src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X10-reminders | Recordatorios: justify-center → justify-start | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R4: Recordatorios distingue una cuenta sin mascotas R4.2: centra solo el vacío y retira los controles que necesitan mascota | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X11 | Perfil: sustituir EmptyState por el Text anterior | 2 failed, 2 total | 4 / 141 | `src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.1: conserva un único testID y muestra pose talk, copy y acción para añadir<br>`src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.2 R5.3: centra en horizontal dentro del scroll y mantiene las acciones de cuenta<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X12 | Inicio: añadir clearPet a la desestructuración y ejecutar clearPet() | 1 failed, 1 passed, 2 total | 1 / 23 | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.4: solo proveedor y hook mencionan clearPet en producción | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X5 | Quitar !petsEmpty de reminders-error | equivalente; no plantada | — | El retorno anticipado elimina el scroll cuando petsEmpty es verdadero | `8da45c961ebfaf211e95213f7cf88a107813dc81`; exención de la spec firmada `a64859d8` |

### X1: S3 permanece verde

- `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.
- `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.
- `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.

X2: la guarda eliminada está antes de las ramas y protege tanto la limpieza
como la selección automática. Por eso caen también las dos pruebas anteriores
sobre revalidación, además de R2.3. Se plantó la línea real del código, conforme
al handoff. X3 cae con los cuatro kind exigidos y, adicionalmente, con datos
indefinidos. X1 hace caer R7 como consecuencia adicional de no limpiar.

X4, X6, X7 y X8 caen únicamente en el escenario previsto: S4 de Inicio, S4 de
Recordatorios, S5 de Perfil y S4 de Perfil, respectivamente. No se atribuye
su detección a S2 ni a S3. X9-Inicio hace caer además S3 y el candado anterior
#155 R4 enmendado, porque el retorno anticipado también es su defensa de error.
X10 conserva verde ese candado anterior y cae la prueba que lee la clase del
contenedor. X11 cae también en R8.1/R8.2; R8-M2 cae además en el inventario
compartido, y R8-M3 también en design-drift. Todos esos nombres están en la tabla.

Los logs y JSON están en `/tmp/181-r2-<mutación>.log` y
`/tmp/181-r2-<mutación>.json`; el resumen validado en
`/tmp/181-r2-mutations.json`. Los archivos probados en cada corrida constan en
el footer del log y en testResults del JSON. Se ejecutó cada fichero entero,
sin filtrar nombres ni omitir los casos que podrían detectar otros efectos.

## Verificación final del árbol restaurado

- Typecheck: `test ! -e .expo/types/router.d.ts && bun run typecheck`, **EXIT=0**.
  No se borró el fichero protegido. Log `/tmp/181-typecheck-r2.txt`.
- Lint: la cadena exacta del handoff con `bunx expo lint --no-cache`, guarda
  de Failed to run y tamaño de salida, **EXIT=0 al primer intento**.
  `/tmp/181-lint-r2.txt`: **0 bytes**. Sin reintentos.
- Ficheros de referencia antes de mutar: **Test Suites: 10 passed, 10 total**;
  **Tests: 831 passed, 831 total**, EXIT=0.
- Ficheros afectados/relevantes tras restaurar:
  `bunx jest --runInBand --runTestsByPath 'src/screens/profile/index.test.tsx' 'src/__tests__/no-pets-states.test.ts'`:
  **Test Suites: 2 passed, 2 total**; **Tests: 145 passed, 145 total**,
  EXIT=0. Son Perfil 138 y no-pets-states 7 casos de ejecución.
  Log `/tmp/181-r2-final-files.log`.
- Guardas antes del commit documental: `bunx jest src/__tests__`:
  **Test Suites: 13 passed, 13 total**;
  **Tests: 334 passed, 334 total**, EXIT=0.
  Log `/tmp/181-r2-final-guards.log`.

El `--json --outputFile=...` añadido a las corridas acotadas y guardas solo
conserva evidencia, no cambia la selección de tests. El incremento de las
guardas incluye los tres casos R8 y los dos auto-tests que registra la nueva
importación de ui-copy-table en no-pets-states.

Ficheros de la base verde de referencia (las 10 rutas literales):

- `src/screens/home/index.test.tsx`.
- `src/screens/profile/index.test.tsx`.
- `src/app/(tabs)/__tests__/food.test.tsx`.
- `src/screens/reminders/index.test.tsx`.
- `src/screens/health/index.test.tsx`.
- `src/__tests__/no-pets-states.test.ts`.
- `src/components/__tests__/empty-state.test.tsx`.
- `src/hooks/use-pet-selection.test.tsx`.
- `src/__tests__/design-drift.test.ts`.
- `src/providers/__tests__/selected-pet-provider.test.tsx`.

Archivos ejecutados en cada medición, sin filtros de nombres:

| Medición | Rutas literales desde mobile-pet-tracker |
|---|---|
| R8-M1 | `src/screens/profile/index.test.tsx`; `src/__tests__/no-pets-states.test.ts` |
| R8-M2 | `src/__tests__/no-pets-states.test.ts`; `src/components/__tests__/empty-state.test.tsx` |
| R8-M3 | `src/__tests__/no-pets-states.test.ts`; `src/__tests__/design-drift.test.ts` |
| X1 | `src/screens/profile/index.test.tsx`; `src/__tests__/no-pets-states.test.ts`; `src/screens/home/index.test.tsx`; `src/app/(tabs)/__tests__/food.test.tsx`; `src/screens/reminders/index.test.tsx`; `src/screens/health/index.test.tsx`; `src/hooks/use-pet-selection.test.tsx` |
| X2 | `src/hooks/use-pet-selection.test.tsx` |
| X3 | `src/hooks/use-pet-selection.test.tsx` |
| X4 | `src/screens/home/index.test.tsx`; `src/__tests__/no-pets-states.test.ts` |
| X6 | `src/screens/reminders/index.test.tsx`; `src/__tests__/no-pets-states.test.ts` |
| X7 | `src/screens/profile/index.test.tsx`; `src/__tests__/no-pets-states.test.ts` |
| X8 | `src/screens/profile/index.test.tsx`; `src/__tests__/no-pets-states.test.ts` |
| X9-home | `src/screens/home/index.test.tsx`; `src/__tests__/no-pets-states.test.ts` |
| X9-reminders | `src/screens/reminders/index.test.tsx`; `src/__tests__/no-pets-states.test.ts` |
| X10-home | `src/screens/home/index.test.tsx`; `src/__tests__/no-pets-states.test.ts` |
| X10-reminders | `src/screens/reminders/index.test.tsx`; `src/__tests__/no-pets-states.test.ts` |
| X11 | `src/screens/profile/index.test.tsx`; `src/__tests__/no-pets-states.test.ts` |
| X12 | `src/hooks/use-pet-selection.test.tsx`; `src/__tests__/no-pets-states.test.ts` |

## Skills, límites y desviaciones

- **Ninguna skill cargada en esta ronda**. Es trabajo de tests y mutaciones
  temporales; no se cargaron skills de Expo ni Appllama, ni se usó su MCP.
  La carta UI sigue siendo el gate C8 y permanece intacta.
- B1 no resuelto con diagnóstico completo es el resultado alternativo
  permitido por el handoff. No hay arreglo ni commit de B1.
- El cierre de R8 por mutación y sin commit rojo está autorizado por el
  handoff. Las precondiciones se cumplían antes de escribirlo.
- X2 se mide en la posición real de su guarda común, como pide el handoff.
  Los efectos adicionales de X1, X3, X9, X11 y R8 se anotan sin ocultarlos.
- Las tres completas se usaron solo para B1. Sin suite de backend o infra,
  init.sh, cambios de dependencias, recursos AWS, stash, otros worktrees,
  otras ramas, push ni PR.
- Producción y profile/index.test.tsx quedan idénticos a HANDOFF. Solo se
  versionan no-pets-states.test.ts, este informe y traceability.md.
- A20 de docs/conventions, progress/current, STATUS, feature_list y los
  informes del reviewer no se tocaron. Smoke Android: pendiente del humano.
- No se verificaron la causa de la caída histórica, su relación con los
  otros dos timeouts, el gate completo del leader ni el smoke nativo.

Siguiente paso: el leader ejecuta su gate y revisa B1 con este diagnóstico;
el humano conserva la firma A20 y el smoke. Este informe no declara la
feature done ni sustituye esas decisiones.
