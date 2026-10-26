# Implementación mobile-date-field (#220)

Fecha: 2026-10-26. Estado: implementación y verificación C1–C13 completadas. Smoke nativo a cargo del humano.

Primer comando ejecutado, literalmente:

```sh
cd /home/claude/sites/Pet-Tracker-wt-220 && pwd && git branch --show-current
```

Salida:

```text
/home/claude/sites/Pet-Tracker-wt-220
feature/220-mobile-date-field
```

HEAD inicial: `9dbe543a9686bf35d7ea4ad6ec77b43674d17f90` (solo añade el handoff sobre H0 `c584ba3c`). Árbol inicial limpio. Spec aprobada; F2/F3 aceptadas. No se ejecuta `./init.sh`, no se hace merge/rebase, push ni PR.

## Anclas T0

Ejecutadas literalmente desde `mobile-pet-tracker/src`, en el orden del handoff:

| Ancla | Salida |
|---|---|
| add-pet: líneas `style={CONTINUOUS_CORNER}` | 6 |
| add-reminder: líneas `style={CONTINUOUS_CORNER}` | 4 |
| add-pet: líneas `ExpoDateTimePicker` | 2 |
| add-reminder: líneas `ExpoDateTimePicker` | 3 |
| meal-schedule: líneas `ExpoDateTimePicker` | 2 |
| referencias `weightLog.yyyyMmDd` | 4 |
| referencias `docs.datePlaceholder` | 5 |
| módulos nuevos inexistentes (`No such file`) | 2 |
| `git ls-files theme/global.css` | 1 |
| `git diff --stat c584ba3c -- theme/global.css` | 0 |

Guarda desde `mobile-pet-tracker`: `test ! -e .expo/types/router.d.ts && echo sin-router-d-ts` → `sin-router-d-ts`.

Antes de T0, ambos `pgrep` del handoff estaban vacíos. Suite base ejecutada con `bun run test > ../progress/t0-220.log 2>&1; echo exit=$?`.

Resultado final literal (log completo: `progress/t0-220.log`, ignorado por git):

```text
exit=1
Test Suites: 1 failed, 154 passed, 155 total
Tests:       1 failed, 5449 passed, 5450 total
Time:        269.235 s
Ran all test suites.
error: script "test" exited with code 1
```

El resumen vuelve a imprimir el mismo `FAIL` de Mapa: hay una suite fallida y un único test fallido.

Salida literal conjunta de las diez anclas:

```text
6
4
2
3
2
4
5
2
1
0
```

## T0: flake de Mapa

El leader autorizó continuar en «Reanudación 1 tras el bloqueo de T0» del handoff (commit `5d11c897`). Aisló `src/screens/map/index.test.tsx` con ambos `pgrep` vacíos: `bunx jest --runTestsByPath src/screens/map/index.test.tsx --testTimeout=30000` → exit 0, `Tests: 303 passed, 303 total`. Identificó el rojo de #72 R2 como flake de carga.

Base aceptada por el leader: **155 suites y 5450 tests**. Se conserva arriba el resultado original completo. La regla de reanudación permite aislar suites ajenas que fallen en una corrida completa y seguir si pasan solas; un fallo persistente aislado o de nuestro alcance/candados sigue obligando a parar.

No hubo cambios en fuentes o tests durante T0 ni commits de implementación anteriores a la reanudación. H0 sigue siendo `c584ba3c`.

## Skills

Cargadas: `ponytail:ponytail`, `building-native-ui`, `expo-tailwind-setup`, `appllama-app-design-skill`.

Las dos skills Expo se localizaron en `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/`. La carta y la spec mandan sobre sus sugerencias genéricas. Appllama MCP y simulator loop se omiten según los límites expresos de la carta; el smoke corresponde al humano. También se consultaron [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) y [Expo UI 57](https://docs.expo.dev/versions/v57.0.0/sdk/ui/), según `mobile-pet-tracker/AGENTS.md`.

No disponibles según el handoff: `expo-overview`, `expo-animation`, `expo-router`, `expo-design-system`; no se buscan sus equivalentes de Claude Code.

## Cadena y comprobaciones

Cadena completada desde C1. A continuación se registran commits, resultados, cuentas y sondas. El smoke del humano sigue pendiente.

Incidencia de invocación sin cambios: tras buscar configuraciones con `rg --files`, se intentó leer `mobile-pet-tracker/jest.config.js` con `sed`; esa ruta no existe (exit 2). Jest se configura en `package.json`, ya leído. Esto no lanzó ni modificó ningún test; la corrida T0 continuó sin cambios.

## Smoke del humano

Pendiente: toque sobre el campo (incluido `pointerEvents="none"`), diálogo nativo, tema oscuro, Peso, Documentos, Alta de mascota y Recordatorio (fecha y hora). La casilla de aprobación de smoke no se toca.

## C1–C2: R1

- `a6cb67d4` — `test(#220): R1 civil-date utilities`. Rojo previsto por import inexistente; typecheck TS2307 por el mismo módulo ausente. `Tests: 0 total`.
- `2d7baf24` — `feat(#220): R1 add civil-date utilities`. Jest verde y typecheck exit 0. `Tests: 29 passed, 29 total`. Cuenta encadenada: 5450 + 29 = 5479; suites 156. Casos locales, cruces de mes/año, fechas inválidas, relleno y reloj falso.

## Sondas C4 (mutaciones temporales en producción, revertidas)

- r2: exit=1; Tests:       6 failed, 11 skipped, 50 passed, 67 total; fuente restaurada. Log `mutation-220-r2.log`.
- r3: exit=1; Tests:       10 failed, 55 skipped, 2 passed, 67 total; fuente restaurada. Log `mutation-220-r3.log`.
- r4-corners: exit=1; Tests:       5 failed, 116 skipped, 25 passed, 146 total; fuente restaurada. Log `mutation-220-r4-corners.log`.
- r5: exit=1; Tests:       1 failed, 62 skipped, 4 passed, 67 total; fuente restaurada. Log `mutation-220-r5.log`.
- r6: exit=1; Tests:       2 failed, 64 skipped, 1 passed, 67 total; fuente restaurada. Log `mutation-220-r6.log`.
- r7: exit=1; Tests:       4 failed, 57 skipped, 6 passed, 67 total; fuente restaurada. Log `mutation-220-r7.log`.
- r8: exit=1; Tests:       1 failed, 61 skipped, 5 passed, 67 total; fuente restaurada. Log `mutation-220-r8.log`.
- r9: exit=1; Tests:       3 failed, 64 skipped, 67 total; fuente restaurada. Log `mutation-220-r9.log`.
- r10: exit=1; Tests:       1 failed, 66 skipped, 67 total; fuente restaurada. Log `mutation-220-r10.log`.
- r11: exit=1; Tests:       2 failed, 60 skipped, 5 passed, 67 total; fuente restaurada. Log `mutation-220-r11.log`.
- r16-uses: exit=1; Tests:       2 failed, 28 skipped, 2 passed, 32 total; fuente restaurada. Log `mutation-220-r16-uses.log`.
- r16-scanner: exit=1; Tests:       1 failed, 31 skipped, 32 total; fuente restaurada. Log `mutation-220-r16-scanner.log`.
- r17: exit=1; Tests:       1 failed, 56 skipped, 10 passed, 67 total; fuente restaurada. Log `mutation-220-r17.log`.
- r16-keys: clave adicional plantada en ambos idiomas; exit 1; Tests:       1 failed, 53 skipped, 54 total; catálogo restaurado.

## C3–C4: componente y candados

C3 `865ae690` (`test(#220): R2-R11 R17 R18 lock DateField`) y corrección `f7948393` (`test(#220): R5 use rendered label query for RNTL 14`) conservaron el rojo esperado por import inexistente: `Tests: 0 total`. El primer typecheck de C3 también detectó `UNSAFE_getByType` retirado en RNTL 14; se corrigió en commit solo de test antes de producción. Tras corregir, TS2307 era el único error.

C4: los 67 tests de C3 dejaron primero el rojo por import permitido. Tras existir el módulo, nacieron verdes los 12 casos de fuente (R4 sin imports crudos, los 10 patrones R17 y R18); los casos de render tuvieron también el rojo intermedio por las claves aún ausentes antes de corregir la inserción. Las sondas anteriores prueban con aserciones rojas R2–R11, R16 y R17. R17 prueba además cada patrón contra su cadena mutante, tal como exige la spec. R18 se verifica por lectura y diff; **sin mutación de producción en meal-schedule/global.css**, que son ficheros expresamente intocables. El cierre no da por probado el smoke nativo.

Cifras medidas antes de las enmiendas: directUses+Card 57, total global 55, R5_HEALTH 50, R7_PROFILE 69, SCREEN_FILES 36. Catálogo: 455 claves de base, 460 tras añadir las cinco. Un primer conteo por regex dio 446 porque omitía las claves sin comillas; se descartó y se midió con `bun` sobre `Object.keys(en)`.

Rojos vistos antes de enmendar: total Card esperado 57/recibido 58; total global 55/56; catálogo 455/460; SCREEN_FILES 36/37 tras registrar R18_DATE_FIELD. Enmiendas C4: nueva fila directUses date-field=1 y ambos totales +1; SCREEN_FILES +1; catálogo +5; cinco filas nuevas de copy más ALL_USES y blocks. La sonda r4-corners quitó el estilo del raíz: rompe la fila nueva y ambos totales. r16-uses rompe los usos registrados, r16-scanner rompe el escaneo de literal en el fichero nuevo y r16-keys rompe la aritmética del catálogo.

Incidencias de invocación corregidas: se consultaron rutas inexistentes `@testing-library/react-native/build` y `hero-text/hero-text.tsx`; una corrección de test usó una ruta relativa duplicada al estar ya dentro del móvil (sin escritura); la inserción inicial del catálogo detectó antes de escribir que `es` tiene una declaración tipada distinta a `en`. Se corrigieron las rutas y el marcador; una corrida intermedia mostró claves aún ausentes por esa inserción abortada. No se introdujeron dependencias ni se tocaron ficheros fuera del alcance.

C4 `1adba14a` — `feat(#220): R2-R11 R16 R17 add DateField`. Verde: `Tests: 373 passed, 373 total` (7 suites; incluye ui-copy-table), typecheck exit 0. Cuenta encadenada: 5479 + 67 + 1 fila directUses + 1 test de copy = **5548**, 157 suites.

Sonda c6-r5-uses: exit 1; Tests:       1 failed, 31 skipped, 32 total; fuente restaurada.

Sonda c6-keys: exit 1; Tests:       1 failed, 53 skipped, 54 total; fuente restaurada.

## C5–C6: Peso

C5 `faf9cf94` — `test(#220): R12 weight log on DateField`. Rojo por consultas/aserciones sobre el selector y el nodo -value aún ausentes: `Tests: 22 failed, 83 passed, 105 total`. Sin error de import ni TypeError; typecheck exit 0. Cuenta 5548 + 1 nuevo R12 - 2 casos de texto retirados = **5547**.

Se conservan errores del servidor, payload/reset por zona del perfil, clases y validación de peso/condición. Casos imposibles de texto: `2026-02-30` y ` 2026-08-20 ` pasan a la traza de `utils/form-rules.test.ts` → `#186 R2: fecha del peso «%s»` (calendario falso y texto recortado). En el test de tres errores simultáneos, `bad-date` tampoco se puede introducir: quedan los dos errores locales alcanzables y se asevera ausencia de error de fecha con día válido; la validación de fecha mal formada se traza a los casos de formato inválido de la misma tabla pura. El título original se conserva con el sufijo exigido.

C6 alcance verde: `Tests: 191 passed, 191 total` (3 suites), typecheck exit 0. Ancla `weightLog.yyyyMmDd` = 0. Enmiendas: R5_HEALTH 50→49, catálogo 460→459 (`+5-1`). Sondas c6-r5-uses/c6-keys arriba. Antes del commit se ejecuta la suite completa en `full-220-c6.log`.

## Reanudación 2: enmienda del candado de accent

El leader firmó la enmienda 1 en `504aee66`, design.md §8, y amplió la lista cerrada únicamente para el it de peticiones de accent de legibility-classnames. El rojo completo anterior (5546 verdes + 1 rojo) y el rojo aislado (25 verdes + 1 rojo) están conservados en los logs de C6. La cuenta aceptada sigue siendo 5547; esta enmienda no añade tests.

Se autorizó añadir `components/date-field.tsx` al inventario de consumidores de accent. El token es necesario para el diálogo nativo de R6; se conserva el veto de text-accent suelto. Los cinco cambios de C6 se conservaron y se commitearon tras repetir el verde completo.

Reanudación 2, commit `b39d2864` — `test(#220): R6 amend the accent-request lock for DateField`. Verde aislado `Tests: 26 passed, 26 total`; typecheck exit 0. Mutación de §8: quitar accent de la petición produce `Tests: 1 failed, 25 passed, 26 total`; producción restaurada. Lista antes 3 consumidores, después 4; cero tests nuevos. El rojo se descubrió en el completo previo a C6 y se reprodujo aislado, por eso este commit es verde conforme al handoff. Los cinco ficheros de C6 no entraron en este commit.

C6 `57e3fe1f` — `feat(#220): R12 R16 migrate weight log`. Suite completa `full-220-c06.log`: exit 0; `Test Suites: 157 passed, 157 total`; `Tests: 5547 passed, 5547 total`. La cuenta encadenada coincide. Typecheck verde previo al commit y guardas del alcance verdes.

## C7–C8: Documentos

C7 `84911d37` — `test(#220): R13 docs upload on DateField`. Rojo de consultas/aserciones, sin import roto ni TypeError: `Tests: 48 failed, 30 passed, 78 total`; typecheck exit 0. Cuenta: 5547 - 2 casos de texto imposibles + 1 R13 nuevo = **5546**.

Texto retirado: fila `09/10/2026` del it.each de error por campo y test `rechaza un calendario falso` (`2026-02-30`); traza a `#186 R2: fecha de documento «%s»` para esos mismos valores. Los espacios de la fecha de envío pasan a elección civil y siguen cubiertos por ` 2026-10-09 ` en reglas puras. El caso simultáneo `bad-date` conserva tipo/nombre inválidos y ahora asevera ausencia de error de fecha válida; la rama de formato inválido queda en la tabla pura. Todos irán a filas explícitas de traceability en C13.

C8 alcance verde: `Tests: 164 passed, 164 total`; typecheck exit 0. Ancla docs.datePlaceholder 5→0. R7_PROFILE 69→68; catálogo 459→458 (`+5-2`); traducciones de #158 R1 13→12. La spec de idioma firmada no se editó: el test itera los 12 pares conservados. Los controles Input crudos de la pantalla pasan de 4 a 3, y la fecha se prueba en DateField; no se eliminan las aserciones de las demás clases ni etiquetas.

Sonda c8-r7-uses: exit 1; Tests:       1 failed, 31 skipped, 32 total; fuente restaurada.

Sonda c8-keys: exit 1; Tests:       1 failed, 53 skipped, 54 total; fuente restaurada.

Sonda c8-pairs: exit 1; Tests:       1 failed, 53 skipped, 54 total; fuente restaurada.

C8 `41663fe9` — `feat(#220): R13 R16 migrate docs upload`. Completo `full-220-c08.log`: exit 0; `Test Suites: 157 passed, 157 total`; `Tests: 5546 passed, 5546 total`.

Sonda c10-datefield-corner: exit 1; Tests:       3 failed, 78 passed, 81 total; fuente restaurada.

Sonda c10-addpet-corner: exit 1; Tests:       4 failed, 77 passed, 81 total; fuente restaurada.

## C9–C10: Alta de mascota

C9 `92d22a84` — `test(#220): R14 add pet on DateField`. Rojo de aserción/consulta: `Tests: 8 failed, 70 passed, 78 total`, typecheck exit 0. Cuenta: 5546 + 1 R14 nuevo = **5547**. Se mantienen todos los casos previos, los payloads y los cruces con wallClock; las etiquetas pasan de numéricas a las formas cortas literales aprobadas en F3. El icono se comprueba en el prefijo decorativo del InputGroup y el texto en -value/placeholder.

C10 antes de enmendar los candados: pantalla verde, cuatro rojos esperados (add-pet-two-steps, fila de add-pet en directUses, suma Card y suma global). Anclas antes: add-pet 6 esquinas y 2 líneas ExpoDateTimePicker. Después: 5 y 0. directUses+Card 58→57; global 56→55 (delta acumulado +1-1=0). Enmiendas con R14 en los títulos y comentarios. Typecheck verde antes de ajustar las cifras; se repetirá con las enmiendas antes del commit.

C10 `fda5417a` — `feat(#220): R14 R17 migrate add pet`. Completo `full-220-c10.log`: exit 0; `Test Suites: 157 passed, 157 total`; `Tests: 5547 passed, 5547 total`. Typecheck de las enmiendas exit 0.

Incidencia al preparar C11: el pgrep mostró una corrida externa de #209 y se había lanzado la propia sin inspeccionar primero esa salida. Se detuvo solo el PID de Jest de este worktree (345099), exit 143; el log se conserva como `c11-concurrency-abort-220.log` y **no cuenta como rojo TDD ni como verificación**. No se tocaron procesos ajenos. Se espera a pgrep vacío para repetir C11; en adelante el lanzamiento depende también del exit code de una guarda explícita.

## C11–C12: Recordatorio

C11 `fcfea405` — `test(#220): R15 add reminder on DateField`. Corrida válida tras guardas vacías: `Tests: 11 failed, 60 passed, 71 total`; typecheck exit 0. Cuenta: 5547 + 1 R15 nuevo = **5548**. Se mantienen todos los casos, incluyendo wallClock y vencimiento/avisos. La corrida abortada por concurrencia no se cuenta.

C12 anclas antes: 4 esquinas, 3 líneas ExpoDateTimePicker y 1 rounded-16. Tras migrar: 2 esquinas, 0 líneas ExpoDateTimePicker y rounded-16 sigue en 1. Las sumas pasan directUses+Card 57→55 y global 55→53 (delta acumulado +1-1-2=-2). El inventario de iconos del screen pasa de Bell/Calendar/Clock a Bell. Se observaron los cuatro rojos de esos inventarios antes de enmendarlos.

Incidencias de implementación corregidas antes del commit: `muted` sigue usándose en el placeholder del título y `useLocale` en la vista previa, por lo que se conservaron (R15 dice retirar solo lo que quede sin uso). Una primera corrida detectó su retirada indebida como ReferenceError/TS2304 y se corrigió. Tras ello quedó una aserción vieja de dos hijos directos del disparador: se adapta a un InputGroup hijo que contiene prefijo e input, conservando los mensajes hermanos y el resto de aserciones. Se registrará en commit aparte de test antes del feat.

Sonda c12-error-structure: exit 1; Tests:       1 failed, 70 skipped, 71 total; fuente restaurada.

Sonda c12-datefield-corner: exit 1; Tests:       3 failed, 76 passed, 79 total; fuente restaurada.

Sonda c12-reminder-corner: exit 1; Tests:       3 failed, 76 passed, 79 total; fuente restaurada.

Sonda c12-icons: exit 1; Tests:       1 failed, 113 skipped, 114 total; fuente restaurada.

Corrección de tests `aa7eabb6` — `test(#220): R4 R6 R15 align native-field test doubles and structure`. Ajusta el it antiguo de error de fecha (rojo observado por esperar 2 hijos directos en lugar de 1 grupo con 2 hijos) y nombra dos dobles anónimos que el primer lint señaló con react/display-name. Verde `Tests: 138 passed, 138 total`; typecheck exit 0; lint final exit 0 y log de 0 bytes. Cero tests nuevos. La sonda c12-error-structure añade un prefijo extra en producción y rompe la aserción interna de dos hijos: rojo visto y revertido. Las otras sondas de C12 prueban cada recuento de esquina e inventario de iconos.

C12 `bc818706` — `feat(#220): R15 R17 migrate add reminder`. Alcance y candados: `Tests: 264 passed, 264 total`. Completo `full-220-c12.log`: `Test Suites: 1 failed, 156 passed, 157 total`; `Tests: 1 failed, 5547 passed, 5548 total` (236.846 s). Único rojo ajeno: Salud, #168 R2 «pone el PetSwitcher como primer hijo de health-content», esperaba vaccines-section y observó aún la rama de carga. Aislado con guardas vacías: `c12-health-isolated-220.log`, exit 0, `Tests: 112 passed, 112 total`. Se aplica la regla de reanudación 1, sin tocar Salud; la cuenta encadenada total coincide en 5548. Se repetirá el completo de cierre en final-test-220.log.

Sonda copy-registry-alluses: exit 1; Tests:       3 failed, 31 skipped, 34 total; registro de copy restaurado. Esta sonda muta el dato del registro que vigila el candado, no su aserción.

Sonda copy-registry-health: exit 1; Tests:       1 failed, 31 skipped, 32 total; registro de copy restaurado. Esta sonda muta el dato del registro que vigila el candado, no su aserción.

Sonda copy-registry-profile: exit 1; Tests:       1 failed, 31 skipped, 32 total; registro restaurado. Se ajustó el selector auxiliar de esta sonda para incluir el comentario preexistente de la fila; el intento anterior detectó ausencia de esa cadena antes de escribir.

## Enmiendas y cifras finales

| Candado | Base / estados de la cadena | Final | R / sonda |
|---|---|---|---|
| add-pet-two-steps: esquinas | 6 | 5 | R14; c10-addpet-corner |
| consistency: directUses DateField | Sin fila → 1 (C4) | 1 | R4; r4-corners y c10/c12-datefield-corner |
| consistency: directUses add-pet | 6 | 5 | R14; c10-addpet-corner |
| consistency: directUses add-reminder | 3+1 | 3+1-2 = 2 | R15; c12-reminder-corner |
| consistency: suma Card | 57 → 58 (C4) → 57 (C10) | 55 | R4/R14/R15; sondas de esquinas |
| consistency: suma global | 55 → 56 (C4) → 55 (C10) | 53 | R4/R14/R15; sondas de esquinas |
| design-drift: iconos add-reminder | Bell, Calendar, Clock | Bell | R15; c12-icons |
| ui-copy-table: DateField | Sin bloque | R18_DATE_FIELD, 5 filas; ALL_USES y blocks lo incluyen | R16; r16-uses y copy-registry-alluses |
| ui-language: R5_HEALTH | 50 | 49 | R16; c6-r5-uses y copy-registry-health |
| ui-language: R7_PROFILE | 69 | 68 | R16; c8-r7-uses y copy-registry-profile |
| ui-language: SCREEN_FILES | 36 | 37 | R16; r16-scanner y copy-registry-alluses |
| language-provider: claves | 455 → 460 (C4) → 459 (C6) | 458 en ambos idiomas | R16; r16-keys, c6-keys, c8-keys |
| language-provider: pares #158 R1 | 13 | 12 | R16; c8-pairs |
| legibility: consumidores de accent | empty-state, toggle-switch, shadows | Añade date-field, 4 consumidores | R6; mutation-220-legibility |

Las mutaciones del registro de copy prueban sus longitudes e inclusión interna alterando filas/datos, no los valores esperados del test. Complementan las mutaciones de componentes/catálogo de producción. R18 se conserva por lectura y diff sin mutar los ficheros protegidos; esa sonda no se ejecutó porque el handoff prohíbe tocarlos.

## Verificaciones de cierre

- `bun run typecheck`: exit 0, `typecheck-final-220.log`, con guarda router.d.ts previa vacía.
- `bunx expo lint --no-cache`: exit 0 y `lint-220.log` de 0 bytes. El primer intento encontró dos dobles anónimos; se corrigieron en aa7eabb6 y se repitió el comando íntegro.
- `graphify update .`: exit 0 (`graphify-220.log`), 29782 nodos, 38094 aristas y 1965 comunidades; salida en graphify-out ignorada por git. Aviso no fatal: 20 SQL no se extrajeron por ausencia de tree_sitter_sql; no se instaló dependencia ni se tocaron SQL. La extracción de código no usó LLM.
- Diferencia vacía desde H0 para package.json, bun.lock, theme/global.css, meal-schedule, form-rules.ts, date-picker-value.ts y reminder-dates.ts.
- Conversión UTC encapsulada: el único importador de date-picker-value en producción es DateField. El Horario conserva su selector de hora y no necesita esas conversiones; quedó sin cambio. Una comprobación auxiliar inicial exigió por error que Horario también importase el helper; se corrigió a la guarda literal «nadie fuera de DateField/Horario», sin modificar código.
- Anclas finales: add-pet 5 esquinas / 0 líneas ExpoDateTimePicker; add-reminder 2 / 0 y rounded-16 sigue en 1; DateField 1 esquina; Horario 2 líneas ExpoDateTimePicker; ambos placeholders retirados 0 referencias en src; global 53 esquinas; R5_HEALTH 49; R7_PROFILE 68; R18_DATE_FIELD 5; SCREEN_FILES 37; catálogo en/es 458/458.

Ficheros móviles tocados desde H0 (`git diff --name-only c584ba3c..HEAD -- mobile-pet-tracker/`), exactamente los 20 de la lista cerrada ampliada:

```text
mobile-pet-tracker/src/__tests__/add-pet-two-steps.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/components/__tests__/date-field.test.tsx
mobile-pet-tracker/src/components/date-field.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/add-pet/index.test.tsx
mobile-pet-tracker/src/screens/add-pet/index.tsx
mobile-pet-tracker/src/screens/add-reminder/index.test.tsx
mobile-pet-tracker/src/screens/add-reminder/index.tsx
mobile-pet-tracker/src/screens/docs-upload-form/index.test.tsx
mobile-pet-tracker/src/screens/docs-upload-form/index.tsx
mobile-pet-tracker/src/screens/weight-log/index.test.tsx
mobile-pet-tracker/src/screens/weight-log/index.tsx
mobile-pet-tracker/src/utils/civil-date.test.ts
mobile-pet-tracker/src/utils/civil-date.ts
```

No se ejecutó init.sh, merge, rebase, push, creación/edición de PR, deploy ni ninguna operación AWS. No se modificaron feature_list.json, STATUS.md, current/history, docs ni las casillas del humano. La ampliación de la spec la firmó el leader.

## Resultado final y traza

Completo de cierre `bun run test > ../progress/final-test-220.log 2>&1; echo exit=$?`:

```text
exit=0
Test Suites: 157 passed, 157 total
Tests:       5548 passed, 5548 total
```

Sin FAIL. Incluye design-drift, consistency-classnames, add-pet-two-steps, ui-language, language-provider, forms-validation-global, heroui-text-size-merge, legibility-classnames, DateField y las cuatro pantallas. La nueva corrida resolvió el flake ajeno de Salud visto antes de C12. No se cambió ningún test de Salud ni Mapa.

Cuenta final: 5450 base + 29 utilidades + 67 componente + 2 registros/candados + 4 nuevos casos de pantalla - 4 casos de texto retirados = **5548**. Los casos combinados inválidos y los de trim reexpresados se conservan en filas explícitas de traceability con sus pruebas puras sustitutas; no eliminan más it.

| R | Test primario | Test commit | Feat commit |
|---|---|---|---|
| R1 | `utils/civil-date.test.ts::#220 R1` | `a6cb67d4` | `2d7baf24` |
| R2 | `components/__tests__/date-field.test.tsx::#220 R2` | `865ae690` | `1adba14a` |
| R3 | `components/__tests__/date-field.test.tsx::#220 R3` | `865ae690` | `1adba14a` |
| R4 | `components/__tests__/date-field.test.tsx::#220 R4` | `865ae690` | `1adba14a` |
| R5 | `components/__tests__/date-field.test.tsx::#220 R5` | `f7948393` | `1adba14a` |
| R6 | `components/__tests__/date-field.test.tsx::#220 R6` | `865ae690` | `1adba14a` |
| R7 | `components/__tests__/date-field.test.tsx::#220 R7` | `865ae690` | `1adba14a` |
| R8 | `components/__tests__/date-field.test.tsx::#220 R8` | `865ae690` | `1adba14a` |
| R9 | `components/__tests__/date-field.test.tsx::#220 R9` | `865ae690` | `1adba14a` |
| R10 | `components/__tests__/date-field.test.tsx::#220 R10` | `865ae690` | `1adba14a` |
| R11 | `components/__tests__/date-field.test.tsx::#220 R11` | `865ae690` | `1adba14a` |
| R12 | `screens/weight-log/index.test.tsx::#220 R12` | `faf9cf94` | `57e3fe1f` |
| R13 | `screens/docs-upload-form/index.test.tsx::#220 R13` | `84911d37` | `41663fe9` |
| R14 | `screens/add-pet/index.test.tsx::#220 R14` | `92d22a84` | `fda5417a` |
| R15 | `screens/add-reminder/index.test.tsx::#220 R15` | `fcfea405` | `bc818706` |
| R16 | `components/__tests__/date-field.test.tsx::#220 R3/R6/R11; __tests__/ui-language.test.ts::#220 R16 y aritmética de language-provider.test.tsx` | `865ae690` | `41663fe9` |
| R17 | `components/__tests__/date-field.test.tsx::#220 R17; candados y completo final de 5548 tests` | `865ae690` | `bc818706` |
| R18 | `components/__tests__/date-field.test.tsx::#220 R18; diff protegido desde c584ba3c vacío` | `865ae690` | `bc818706` |

Correcciones/enmiendas adicionales: f7948393 (consulta RNTL 14), b39d2864 (accent, enmienda firmada), aa7eabb6 (dobles nombrados y estructura del mensaje de fecha). C13 contiene únicamente este reporte y traceability.md; no añade tests ni código. No se reescribe el historial.

El smoke del humano sigue sin ejecutar: toque en el campo con pointerEvents none, diálogo nativo, tema oscuro, Peso, Documentos, Alta de mascota y Recordatorio fecha/hora. Tampoco se verificó iOS en dispositivo. La casilla de requisitos queda intacta; el detalle de estas limitaciones se conserva arriba.

C13: `docs(#220): record DateField traceability and implementation evidence`, únicamente traceability y reporte. El último completo verde sigue siendo de 5548 tests; no hay cambios ejecutables después de él.
