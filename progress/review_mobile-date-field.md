# review: mobile-date-field (#220)
Fecha: 2026-10-26
Revisado: HEAD 7c00e952 (branch feature/220-mobile-date-field), H0 c584ba3c
Veredicto: APROBADO (sujeto a que el leader corra ./init.sh; el reviewer no lo corrio por instruccion expresa)

## Checklist C2 - Estado coherente
- [x] Codex no toco feature_list.json, STATUS.md, progress/current.md ni progress/history.md (diff H0..HEAD sin esas rutas). Los unicos ficheros fuera de mobile-pet-tracker/src son handoff, impl report y specs/mobile-date-field (design/requirements = enmienda 1 del leader en 504aee66, traceability = C13).
- [x] Worktree limpio al terminar (las mutaciones se revirtieron con git checkout; `git status --short` vacio).

## Checklist C3 - Arquitectura
- [x] date-field.tsx es presentacion pura; sin imports de infraestructura/API.
- [x] civil-date.ts: utilidades puras sin dependencias.
- [x] Unico importador de utils/date-picker-value en produccion: components/date-field.tsx (las pantallas dejaron de importarlo; meal-schedule no lo usa).
- [x] Cero cambios (diff vacio desde H0) en package.json, bun.lock, theme/ (global.css), screens/meal-schedule, utils/form-rules.ts, utils/date-picker-value.ts, utils/reminder-dates.ts.
- [x] Los 20 ficheros moviles tocados coinciden con la lista cerrada (19 + legibility por Enmienda 1).

## Checklist C4 - TDD
- [x] Cada R1..R18 tiene al menos un `it` que lo nombra (`#220 R<n>:`), ver tabla abajo.
- [x] Historial test-primero verificado commit a commit con `git show --stat`: a6cb67d4 test / 2d7baf24 feat (R1); 865ae690+f7948393 test / 1adba14a feat (R2-R11); faf9cf94 test / 57e3fe1f feat (R12); 84911d37 test / 41663fe9 feat (R13); 92d22a84 test / fda5417a feat (R14); fcfea405+aa7eabb6 test / bc818706 feat (R15). Ningun commit mezcla produccion y test de la misma pantalla; los candados enmendados viajan en el feat de su pantalla, como manda tasks.md. b39d2864 (legibility) es test-only y verde por la Enmienda 1 (el rojo se descubrio en C6; documentado).
- Nota (no bloqueante): los `it` de fuente de R4/R17/R18 nacieron verdes en C4 (declarado en el reporte; R17 se prueba ademas contra cadenas mutantes).

## Checklist C5 - Trazabilidad
- [x] traceability.md sin filas "pendiente" (grep = 0). Hashes de test/feat verificados contra `git log`: todos existen y corresponden al mensaje citado.
- [x] Commits `test(#220)`/`feat(#220)` con R-ids; mensajes en ingles tras el prefijo.
- [x] Casos de texto que el selector ya no puede introducir: 8 filas, cada una con su `it` puro de utils/form-rules.test.ts.

## Checklist C6 - Spec aprobada
- [x] requirements.md status: approved, casilla "Aprobado por humano" marcada (firma delegada, requirements.md:409). La casilla de smoke (G2) queda sin marcar, correcto: es del humano.

## Checklist C7 - Sin codigo huerfano
- [x] Retirados `Calendar/Clock/Host/ExpoDateTimePicker/toPickerValue/fromPickerValue/showDatePicker/showTimePicker` de add-pet y add-reminder; `dateToIso` privado eliminado; ancla ExpoDateTimePicker: add-pet 0, add-reminder 0, meal-schedule 2.
- [x] Claves `weightLog.yyyyMmDd` y `docs.datePlaceholder`: 0 referencias en src (catalogo, tabla, pantallas, language-provider).
- [x] Anclas de esquinas: add-pet 5, add-reminder 2, date-field 1.

## Candados enmendados (cifras verificadas en el diff)
- add-pet-two-steps 6 a 5; directUses add-pet 5, add-reminder `3 + 1 - 2`, fila date-field 1; totales Card y global `+ 1 - 1 - 2` (53 global); design-drift add-reminder `['Bell']`; R5_HEALTH `- 1` (49); R7_PROFILE `- 1` (68); R18_DATE_FIELD 5 filas en ALL_USES y blocks; SCREEN_FILES `+ 1`; catalogo `+ 5 - 2` (458/458); #158 R1 a 12 pares; legibility 4 consumidores (date-field.tsx primero). Sin tautologias: los literales (cifras, claves, textos) son del test; los espias de R7 envuelven la funcion real y usan centinelas, no TZ.

## Calidad de date-field.tsx
- Contrato publico identico a la tabla de requirements.md (props, defectos, Fragment sin contenedor, sin FieldError/TextInput, imports literales de Host y ExpoDateTimePicker).
- Valor civil sin desfase UTC: usa isoToLocalDate/localDateToIso; Android pasa por toPickerValue/fromPickerValue; limites a mediodia local sin conversion; modo hora sin conversion; "hoy" se lee en el manejador del toque (lint de pureza verde).
- `pointerEvents="none"`, `editable={false}`, rol button, accessibilityLabel (label o valor/placeholder), icono prefijo decorativo, borrar con nombre accesible y size-11 (44). Tokens: h-12 rounded-xl bg-default, CONTINUOUS_CORNER, solo `text-sm` en heroui; sin hex, sin clases arbitrarias, sin StyleSheet. Acorde con docs/ui-guidelines.md (rounded-xl para inputs, diana >= 44).

## Verificacion independiente (sin ./init.sh)
- `test ! -e .expo/types/router.d.ts`: ok. `bun run typecheck`: exit 0.
- `bunx expo lint --no-cache` > log: exit 0, log de 0 bytes.
- Jest de las 14 suites afectadas (civil-date, date-field, las 4 pantallas, add-pet-two-steps, consistency-classnames, design-drift, legibility-classnames, ui-language, forms-validation-global, heroui-text-size-merge, language-provider), `--testTimeout=30000`, sin otros jest corriendo: `Test Suites: 14 passed; Tests: 768 passed`.
- Completo final del implementer (progress/final-test-220.log, no re-corrido por mi para no cargar la maquina compartida): 157 suites, 5548 tests, 0 FAIL. Un FAIL de Salud #168 R2 en una corrida intermedia (C12) paso aislado; flake de carga conocido, no cuenta.

## Mutaciones propias (sobre produccion, revertidas)
date-field.tsx contra su test (67 tests): quitar `setHours(12)` del limite (rojo, 1); quitar clamp maxDate (rojo, 1); quitar clamp minDate (rojo, 1); `allowClear && valid` a `valid` (rojo, 4); quitar `fromPickerValue` al elegir (rojo, 4); quitar regex de hora (rojo, 3); limites tambien en modo hora (rojo, 1); quitar `isInvalid` (rojo, 1); quitar `toPickerValue` del valor inicial (rojo, 2); `toPickerValue` en modo hora (rojo, 3); quitar accessibilityLabel (rojo, 15); quitar `pointerEvents` (rojo, 2); `onDismiss` vacio (rojo, 1).
Pantallas: quitar `maxDate` en Peso (rojo, 1), `minDate` en Recordatorio (rojo, 2), `maxDate` en Alta de mascota (rojo, 2). civil-date `getMonth() + 1` (rojo, 11).

## Observaciones (no bloqueantes; seguimiento sugerido)
1. Mutacion superviviente: quitar `isInvalid={Boolean(fieldErrors.<campo>)}` en `screens/weight-log/index.tsx` (prop del DateField, ~linea 252), `screens/docs-upload-form/index.tsx` (~linea 187) y `screens/add-pet/index.tsx` (~linea 398) deja los tests de pantalla en verde. R12/R13/R14 prescriben ese cableado, pero ningun `it` de pantalla aserta `android:border-danger` en el nodo `-value` de la fecha (R5 si lo candado en el componente). Cobertura de seguimiento sugerida: un `it` por pantalla que provoque el error de fecha y compruebe el token. No rechazo porque el texto de test de R12-R14 en la spec no lo pide y el error de fecha en cliente solo es alcanzable por el servidor (400) o validadores que el selector ya impide.
2. Mutacion superviviente: quitar `event.stopPropagation()` del boton de borrar (date-field.tsx:96). RNTL no propaga la pulsacion al Pressable padre, asi que el test no puede distinguirlo; en RN real el Pressable interno ya captura el toque, asi que es inocuo. Se cubre en el smoke G2 del humano ("no abre el selector al borrar").
3. Semilla del selector: `openPicker` ignora silenciosamente una `minDate`/`maxDate` no analizable cuando `value` es null (no abre el selector). Fuera de contrato (las pantallas pasan siempre ISO validos).
4. Pendiente del humano, sin cambio: smoke G2 en dev build Android (tap sobre `pointerEvents="none"`, dialogo nativo, tema oscuro, cuatro pantallas); enmienda de docs/ui-guidelines.md que nombre date-field.tsx (seguimiento declarado en la spec).

## Pendiente para el cierre del leader
- Correr `./init.sh` (no lo corre el reviewer) antes de marcar done; verificar drift (`git diff` del HEAD revisado 7c00e952 contra origin) antes de `status: done`.
