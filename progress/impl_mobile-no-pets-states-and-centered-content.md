# Informe de implementación — #181, ronda 3

**R8 queda demostrado mediante sus tres pares versionados rojo/verde. B1 sigue
no resuelto:** no se obtuvo ninguna orden determinista en rojo y no se aplicó
el arreglo hipotético de las seis pulsaciones. Las tres completas pasaron,
pero no demuestran la causa ni eliminan la caída histórica. R10 conserva la
medición de la ronda 2, como exige el handoff cuando no hay commit B1.

## Base y alcance

- Worktree confirmado: `/home/claude/sites/Pet-Tracker-wt-181`.
- Rama confirmada: `feature/181-mobile-no-pets-states-and-centered-content`.
- Estado inicial: `git status --short` vacío.
- HANDOFF de ronda 3: `00abcc940eb272860a144df15091a2bb4e6d3683`.
- Spec aprobada: firma de la vía R8 en `d3fab6ed`; requirements y tasks sin cambios.
  Se leyeron R8, R10, §3, la enmienda final R8, tasks R8 y las dos secciones
  obligatorias del handoff de ronda 2.
- Tras los pares, todo `mobile-pet-tracker/src` coincide con HANDOFF.
  Los únicos cambios netos de la ronda son este informe y traceability.
- **Ninguna skill cargada en esta ronda.** No se cargaron skills de Expo ni
  se usó Appllama. La carta UI permanece como gate C8 del reviewer.

## Commits de esta ronda

| Paso | Hash | Mensaje | Líneas añadidas que declaran it |
|---|---|---|---|
| R8-M1 rojo | `abc4ff8c4619154775d4ed47e428ed4081b06d16` | test(mobile): candado R8-M1 en Perfil, mutación versionada en rojo (R8) | 0 |
| R8-M1 verde | `393002ab0f3228c65c4b89ca5b8b855ef73e4d42` | test(mobile): candado R8-M1 en Perfil, mutación revertida en verde (R8) | 0 |
| R8-M2 rojo | `7e1f50aa620a69f3e8f4f94c5076b9b409007a20` | test(mobile): candado R8-M2 en Perfil, mutación versionada en rojo (R8) | 0 |
| R8-M2 verde | `04a0a9366ffe429501ea624ec2f71a06a39bb147` | test(mobile): candado R8-M2 en Perfil, mutación revertida en verde (R8) | 0 |
| R8-M3 rojo | `169006a227c090ad2223bf505b1f0a8989b3197c` | test(mobile): candado R8-M3 en Perfil, mutación versionada en rojo (R8) | 0 |
| R8-M3 verde | `7fa5a6409bf87f3eb415bad7cee07b440c3e6bb9` | test(mobile): candado R8-M3 en Perfil, mutación revertida en verde (R8) | 0 |

El cierre documental tiene el mensaje
`docs(mobile-no-pets-states-and-centered-content): registra la ronda 3 (B1, R8, R10)`.
Su hash se devuelve junto a la ruta del informe y puede resolverse con
`git log -1 --format=%H -- progress/impl_mobile-no-pets-states-and-centered-content.md`.
No se incluye un hash autorreferente en el contenido que determina ese hash.
El cierre añade **0 it**; el diff documental no añade declaraciones ejecutables.

Para los seis commits, se midieron en `git show --format= --unified=0 <hash>`
las líneas que casan `^\+\s*it\(`: **0 en cada uno, total 0**.
`src/__tests__/no-pets-states.test.ts` permanece sin cambios: **5 declaraciones
locales**, dos R9 y tres R8; Jest ejecuta **7 casos** porque importar
`ui-copy-table` registra dos auto-tests. No se cambió el runner.

## B1 — diagnóstico, sin arreglo

Síntoma histórico: cinco pruebas de Perfil (tres de «R7: cambiar foto» y dos
de «#168 R4 (enmendado por #173 R6)») caen en la completa con
`TypeError: Cannot read properties of undefined (reading 'canceled')`.
El punto de consumo es `if (picked.canceled || !picked.assets[0]) return;`
en `src/screens/profile/index.tsx`, dentro de handleChangePhoto. Que picked
sea undefined describe el fallo observado; su origen sigue sin demostrarse.

Hipótesis de la opción 5B: las seis llamadas sin await podrían dejar trabajo
asíncrono activo dentro de la siguiente prueba. Se confirmaron por contenido:

- `fireEvent.press(screen.getByTestId('reminders-link'));`
- `fireEvent.press(screen.getByTestId('profile-sign-out'));`
- `fireEvent.press(screen.getByTestId('pet-chip-pet-2'));`
- `fireEvent.press(screen.getByTestId('documents-link'));`
- `fireEvent.press(action);`
- `fireEvent.press(toggle);`

Se leyó el precedente de #95 R3, enmienda E1 de
`specs/mobile-sign-out-lands-on-welcome/requirements.md`. Allí se demostró una
fuga de render; aquí sigue siendo una hipótesis y no una causa demostrada.
La lectura vuelve a mostrar `mockReset()` seguido sincrónicamente de
`mockResolvedValue` en el beforeEach superior del picker. El handoff de ronda 2
ya había descartado por lectura las opciones globales de reset/restore y la
reasignación del módulo; sin una ejecución fallida no se amplía esa evidencia
hasta afirmar que una carrera es imposible.

### Instrumentación

**Añadida en ronda 3: ninguna. Revertida en ronda 3: ninguna**, porque no se
modificó el test durante la reproducción «sin cambiar nada» del paso 1.
Se comprobó el diff limpio antes y después del diagnóstico. Tampoco se cambió
el componente ni se añadieron respuestas al mock para ocultar el fallo.

Se consultó la instrumentación añadida y revertida en ronda 2, conservada en
`/tmp/181-r2-picker-instrumentation.patch` y `/tmp/181-picker-r2.jsonl`, descrita
por `39369bf37659fd4a57a6c81ced6a1beca0b68573`: Proxy alrededor del mismo mock,
delegación con Reflect.apply y devolución del valor original. Registraba nombre
de test al llamar y resolver, implementación presente, identidad del namespace,
retorno/resolución undefined, timer y pila, además de beforeEach/afterEach.
Sus 30 llamadas y 30 resoluciones tuvieron implementación, identidad estable
y valor definido; ninguna cambió de test al resolver. No se reutilizan como
instrumentación nueva ni como prueba de ausencia de la carrera.

### Corridas sin cambios

| Corrida | Orden | EXIT | Test Suites | Tests | Fallos y duración |
|---|---|---|---|---|---|
| Perfil aislado | `bunx jest --runTestsByPath 'src/screens/profile/index.test.tsx'` | 0 | Test Suites: 1 passed, 1 total | Tests:       138 passed, 138 total | ninguno; Time:        16.083 s |
| Combinación serial | `bunx jest --runInBand --runTestsByPath 'src/screens/profile/index.test.tsx' 'src/screens/reminders/index.test.tsx' 'src/screens/home/index.test.tsx'` | 0 | Test Suites: 3 passed, 3 total | Tests:       429 passed, 429 total | ninguno; Time:        40.095 s, estimated 48 s |
| Completa 1 | `bun run --cwd mobile-pet-tracker test --cacheDirectory=/tmp/181-jc-1` | 0 | Test Suites: 113 passed, 113 total | Tests:       3759 passed, 3759 total | ninguno; Time:        205.991 s |
| Completa 2 | `bun run --cwd mobile-pet-tracker test --cacheDirectory=/tmp/181-jc-2` | 0 | Test Suites: 113 passed, 113 total | Tests:       3759 passed, 3759 total | ninguno; Time:        198.004 s |
| Completa 3 | `bun run --cwd mobile-pet-tracker test --cacheDirectory=/tmp/181-jc-3` | 0 | Test Suites: 113 passed, 113 total | Tests:       3759 passed, 3759 total | ninguno; Time:        193.93 s |

Aislado y combinación se ejecutaron desde
`/home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker` con cd absoluto.
Se comprobó que la línea Test Suites equivale a las 1 y 3 rutas literales.
Logs: `/tmp/181-r3-alone.log` y `/tmp/181-r3-combo.log`.
La combinación se lanzó mientras terminaba el proceso del fichero aislado;
esas dos órdenes acotadas se solaparon. Las completas se lanzaron después
de finalizar ambos procesos, con la comprobación de pgrep vacía en cada una.

Las completas se ejecutaron desde el worktree raíz. Se leyó el bloque de
init.sh que evalúa TEST_CMD y la orden mobile de init.config.sh, sin ejecutar
init.sh. Antes de cada completa, `pgrep -fl '[j]est'` devolvió salida vacía
(EXIT=1: ningún proceso). No fue necesario esperar por procesos ajenos.
Se comprobó la inexistencia de cada caché antes de usarla. Las cachés y logs
homónimos de ronda 2 se preservaron, sin borrar evidencia, en
`/tmp/181-r2-preserved-before-r3/` antes de estas ejecuciones.

Las tres órdenes completas terminaron con las redirecciones prescritas:

```sh
cd /home/claude/sites/Pet-Tracker-wt-181 && test ! -e /tmp/181-jc-1 && bun run --cwd mobile-pet-tracker test --cacheDirectory=/tmp/181-jc-1 > /tmp/181-full-1.log 2>&1; echo EXIT=$?
cd /home/claude/sites/Pet-Tracker-wt-181 && test ! -e /tmp/181-jc-2 && bun run --cwd mobile-pet-tracker test --cacheDirectory=/tmp/181-jc-2 > /tmp/181-full-2.log 2>&1; echo EXIT=$?
cd /home/claude/sites/Pet-Tracker-wt-181 && test ! -e /tmp/181-jc-3 && bun run --cwd mobile-pet-tracker test --cacheDirectory=/tmp/181-jc-3 > /tmp/181-full-3.log 2>&1; echo EXIT=$?
```

Una snapshot pasó en cada completa. Las tres son diagnóstico de B1; no hubo
cuarta corrida, reservada a un arreglo que no existe. No hubo timeouts ni
repeticiones por ruido de carga. El total 3759 frente a 3754 del diagnóstico
de ronda 2 añade los tres R8 y los dos auto-tests del import incorporados
después de aquel diagnóstico.

**Orden determinista que reproduzca B1: ninguna encontrada. Causa: no resuelta.**
No hay arreglo ni commit B1. Tampoco se demostró causa en producción que
justificara cambiar handleChangePhoto. No se introdujeron it.skip, reintentos,
mockResolvedValue adicionales, forceExit ni aserciones más débiles.

`#114 R5` (Recordatorios) y `#173 R5` (Perfil) pasaron en la combinación y las
completas; sus búsquedas históricas de reminders-loading/pet-info-card no
reaparecieron. **No se comprobó que tengan la misma causa que B1 ni una causa
distinta.** La diferencia de mensaje no se usa para establecer causalidad.

## R8 — tres pares rojo/verde

| Par | B_k | Commit rojo | Commit verde | Rojo (EXIT=1) | Verde (EXIT=0) |
|---|---|---|---|---|---|
| R8-M1 | `00abcc940eb272860a144df15091a2bb4e6d3683` | `abc4ff8c4619154775d4ed47e428ed4081b06d16` | `393002ab0f3228c65c4b89ca5b8b855ef73e4d42` | Test Suites: 1 failed, 1 total; Tests: 1 failed, 6 passed, 7 total | Test Suites: 1 passed, 1 total; Tests: 7 passed, 7 total |
| R8-M2 | `393002ab0f3228c65c4b89ca5b8b855ef73e4d42` | `7e1f50aa620a69f3e8f4f94c5076b9b409007a20` | `04a0a9366ffe429501ea624ec2f71a06a39bb147` | Test Suites: 1 failed, 1 total; Tests: 2 failed, 5 passed, 7 total | Test Suites: 1 passed, 1 total; Tests: 7 passed, 7 total |
| R8-M3 | `04a0a9366ffe429501ea624ec2f71a06a39bb147` | `169006a227c090ad2223bf505b1f0a8989b3197c` | `7fa5a6409bf87f3eb415bad7cee07b440c3e6bb9` | Test Suites: 2 failed, 2 total; Tests: 2 failed, 115 passed, 117 total | Test Suites: 2 passed, 2 total; Tests: 117 passed, 117 total |

| Mutación | Archivo | Nombre completo del it que cae por aserción |
|---|---|---|
| R8-M1 | `src/__tests__/no-pets-states.test.ts` | #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos |
| R8-M2 | `src/__tests__/no-pets-states.test.ts` | #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos |
| R8-M2 | `src/__tests__/no-pets-states.test.ts` | #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios |
| R8-M3 | `src/__tests__/no-pets-states.test.ts` | #181 R8: candados agregados y de catálogo #181 R8.3: mantiene las tres pantallas sin drift de estilos |
| R8-M3 | `src/__tests__/design-drift.test.ts` | R9: mobile-pets-profile sin drift keeps arbitrary text, hex colors, and StyleSheet out of feature sources |

M1 cambia solo body common.noPetsBody por common.noPetsYet. M2 sustituye el
EmptyState por la expresión JS `null`, sin llaves. M3 añade `// #181 E4`
encima de `const baseUrl`. Todos los fallos son aserciones, sin compilación
fallida, ReferenceError, TypeError o timeout. M1 falla en el body esperado;
M2 falla en el título esperado y el recuento 1 frente a 0; M3 detecta el
comentario prohibido tanto en R8.3 como en design-drift.

Antes de cada mutación, ambos diffs estaban vacíos y la precondición ejecutó
no-pets-states en verde: 1 suite / 7 tests. Cada B_k se registró antes de mutar.
Solo Perfil se añadió al índice de cada rojo. Para cada verde se hizo
`git checkout B_k -- mobile-pet-tracker/src/screens/profile/index.tsx`:
diff sin indexar vacío e índice con la restauración. Tras el verde,
`git diff --quiet B_k HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`
salió 0. Estado limpio tras los tres pares; las mutaciones no sobreviven.

Comandos, desde mobile con cd absoluto y rutas literales:

```sh
cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx jest --runTestsByPath 'src/__tests__/no-pets-states.test.ts'
cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx jest --runTestsByPath 'src/__tests__/no-pets-states.test.ts' 'src/__tests__/design-drift.test.ts'
```

La primera orden se usa en las tres bases y en rojo/verde de M1/M2; la segunda
en rojo/verde de M3, con ese mismo orden de archivos. Solo se añadieron flags
`--json --outputFile=/tmp/181-r3-Mk-<base|red|green>.json` para guardar evidencia
y redirecciones a los logs homónimos. Se ejecutaron ficheros enteros, sin
filtros de nombres. Se verificaron 1 o 2 suites según las rutas de cada orden.
JSON consolidado de hashes, B_k y resultados: `/tmp/181-r3-pairs.json`.

## R10 — medición conservada, no repetida

Fuente versionada: `39369bf37659fd4a57a6c81ced6a1beca0b68573`. Árbol medido:
commit `8da45c961ebfaf211e95213f7cf88a107813dc81`, objeto tree
`a8ff384773119cdb68afb347cb69d1f56b44402b`.
No hay commit de B1: conservar esta tabla sin re-medirla es la regla explícita
del handoff de ronda 3. Se verificó con git diff que src, test, package.json
y bun.lock de mobile coinciden con esa base después de cerrar R8.

| Mutación | Cambio | Resultado de suites | Tests rojos / verdes | Archivo :: nombre completo del test que cae | Commit de referencia |
|---|---|---|---|---|---|
| X1 | Hook: eliminar la línea de clearPet de la rama vacía | 6 failed, 1 passed, 7 total | 7 / 607 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R7: Inicio converge al crear la primera mascota limpia la selección rancia y selecciona la mascota que llega al revalidar la lista<br>`src/app/(tabs)/__tests__/food.test.tsx` :: #181 R6: food hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío<br>`src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/health/index.test.tsx` :: #181 R6: health hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.2: limpia exactamente una vez con lista ok vacía y selección rancia | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X2 | Hook: eliminar la guarda común isRefreshing | 1 failed, 1 total | 3 / 14 | `src/hooks/use-pet-selection.test.tsx` :: R10: usePetSelection respeta el foco y la revalidación no pisa la selección mientras la pantalla enfocada revalida<br>`src/hooks/use-pet-selection.test.tsx` :: #87 R8: usePetSelection acepta la forma mínima y no conoce use-api does not select while the minimal source shape is refreshing<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia durante la revalidación | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X3 | Hook: llamar clearPet antes de retornar con kind no ok | 1 failed, 1 total | 5 / 12 | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia sin datos<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind error<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unreachable<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind missing-config<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unauthorized | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X4 | Inicio: quitar selectedPetId !== null de pet-hero-error | 1 failed, 1 passed, 2 total | 1 / 233 | `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X5 | Quitar !petsEmpty de reminders-error | equivalente; no plantada | — | El retorno anticipado elimina el scroll cuando petsEmpty es verdadero | `8da45c961ebfaf211e95213f7cf88a107813dc81`; exención de la spec firmada `a64859d8` |
| X6 | Recordatorios: quitar selectedPetId !== null de reminders-error | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X7 | Perfil: quitar && !petsEmpty de petLoading | 1 failed, 1 passed, 2 total | 1 / 144 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S5: lista vacía revalidando y detalle pendiente no muestran esqueletos | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X8 | Perfil: quitar selectedPetId !== null de profile-pet-error | 1 failed, 1 passed, 2 total | 1 / 144 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X9-home | Inicio: trasladar EmptyState al scroll, sin retorno anticipado | 1 failed, 1 passed, 2 total | 3 / 231 | `src/screens/home/index.test.tsx` :: #155 R4: Inicio sin mascotas presenta a Pingo queda en el sitio del vacío que sustituye (enmendado por #181 R3)<br>`src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X9-reminders | Recordatorios: trasladar EmptyState al scroll, sin retorno anticipado | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R4: Recordatorios distingue una cuenta sin mascotas R4.2: centra solo el vacío y retira los controles que necesitan mascota | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X10-home | Inicio: justify-center → justify-start | 1 failed, 1 passed, 2 total | 1 / 233 | `src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X10-reminders | Recordatorios: justify-center → justify-start | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R4: Recordatorios distingue una cuenta sin mascotas R4.2: centra solo el vacío y retira los controles que necesitan mascota | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X11 | Perfil: sustituir EmptyState por el Text anterior | 2 failed, 2 total | 4 / 141 | `src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.1: conserva un único testID y muestra pose talk, copy y acción para añadir<br>`src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.2 R5.3: centra en horizontal dentro del scroll y mantiene las acciones de cuenta<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X12 | Inicio: añadir clearPet a la desestructuración y ejecutar clearPet() | 1 failed, 1 passed, 2 total | 1 / 23 | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.4: solo proveedor y hook mencionan clearPet en producción | `8da45c961ebfaf211e95213f7cf88a107813dc81` |

### Independencia de S3 con X1

- `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.
- `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.
- `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.

X2 elimina la guarda real `if (pets.isRefreshing) return;`, situada antes de ambas
ramas del hook: protege tanto la limpieza como la selección automática. Por eso
caen R2.3 y los dos candados anteriores de revalidación. La diferencia con el
texto «de la rama de limpieza» de la spec se conserva explícitamente.

X3 cae con los cuatro kind exigidos y, además, sin datos. X4, X6, X7 y X8
caen por S4 de Inicio, S4 de Recordatorios, S5 de Perfil y S4 de Perfil,
respectivamente; no se atribuye su detección a S2 o S3. X9 y X10 se midieron
por separado en Inicio y Recordatorios. X9-Inicio cae además en S3 y #155 R4;
X11 cae también en R8.1/R8.2. X12 añade `clearPet` a la desestructuración de
Inicio y ejecuta `clearPet()` allí; se verifica por el escaneo del hook,
sin renderizar la pantalla mutada. X5 es equivalente y no se planta:
`petsEmpty` ya retiró el scroll mediante el retorno anticipado de R4.2.

Las 13 mediciones R10 tienen 30 fallos de aserción en total. La base previa
pasó 10 suites / 831 tests. Los ficheros se corrieron enteros con
--runTestsByPath, sin filtros, y su número coincide con Test Suites.
Logs y JSON originales: `/tmp/181-r2-X<id>.log` y `.json` (X9/X10 con sufijos
-home/-reminders); resumen `/tmp/181-r2-mutations.json`.

## Verificación final

Árbol verificado después de los seis commits R8:
`7fa5a6409bf87f3eb415bad7cee07b440c3e6bb9`. El cierre solo añade documentación.

- Typecheck: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && test ! -e .expo/types/router.d.ts && bun run typecheck`, EXIT=0.
  El fichero protegido no existía y no se borró.
- Lint: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx expo lint --no-cache > /tmp/181-lint-r3.txt 2>&1; ! grep -qF 'Failed to run' /tmp/181-lint-r3.txt && test ! -s /tmp/181-lint-r3.txt`, EXIT=0 al primer intento, 0 bytes, sin Failed to run.
- Ficheros de Perfil y candados: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx jest --runTestsByPath 'src/screens/profile/index.test.tsx' 'src/__tests__/no-pets-states.test.ts' 'src/__tests__/design-drift.test.ts'`, EXIT=0.
  **Test Suites: 3 passed, 3 total**; **Tests: 255 passed, 255 total**.
- Guardas antes del commit documental: `cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx jest src/__tests__`, EXIT=0.
  **Test Suites: 13 passed, 13 total**; **Tests: 334 passed, 334 total**.

En los dos últimos comandos se añadieron --json/--outputFile para conservar
resultados, sin alterar la selección. Logs y JSON:
`/tmp/181-r3-final-files.log` / `.json` y `/tmp/181-r3-final-guards.log` / `.json`.
Todas las corridas con --runTestsByPath respetaron la cuenta de suites.

## Límites, desviaciones y lo no verificado

- B1 no resuelto es la salida alternativa autorizada por la opción 5B.
  La hipótesis de las seis pulsaciones, la causa histórica y su relación con
  #114 R5/#173 R5 siguen sin demostrarse. Se agotaron tres completas.
- No se añadió instrumentación nueva: las cinco ejecuciones de ronda 3
  conservaron los tests para reproducir sin cambios; la instrumentación de
  ronda 2 se cita con su procedencia. No se aplicó el arreglo sin rojo previo.
- R8 cumple la vía aprobada en la spec: seis commits de mutación y restauración,
  sin modificar los it existentes. R10 se conserva con base identificada,
  sin mediciones nuevas ni alteración de su evidencia.
- Se preservaron los logs/cachés previos en /tmp para usar directorios nuevos.
  Los flags JSON solo guardan evidencia. No hubo bloqueos de hooks, denegaciones
  del sandbox, dependencias nuevas ni cambios fuera de la lista permitida.
- Sin init.sh, suites de backend/infra, instalaciones, AWS, stash, otras ramas
  o worktrees, push ni PR. No se tocaron requirements/tasks, A20, UI guidelines,
  progress/current/history/review, STATUS ni feature_list.
- Smoke de Android, firma humana A20, gate completo y aprobación de la feature
  corresponden al humano/leader y no se ejecutaron aquí. No hay fila de smoke
  en traceability ni se declara la feature done.
