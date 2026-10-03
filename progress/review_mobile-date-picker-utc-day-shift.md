# review: mobile-date-picker-utc-day-shift (#123, bug P1)
Fecha: 2026-09-24T16:55Z
Veredicto: APROBADO

Worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/123-mobile-date-picker-utc-day-shift`, HEAD `fe76ec44` (comprobado al
empezar y al terminar). Commits revisados: `4e63ef3d..fe76ec44` sobre
`4a184361`. Base `70f841f3`. Firma `b279cdfb` (espejo `045b091b`).

Skills cargadas: `expo:expo-overview` y después `expo:expo-ui`. Fuente de verdad
de las props: `@expo/ui` 57.0.11 instalado en `node_modules/@expo/ui/`.

R8 (smoke en un dev build de Android en México) es del humano y sigue abierto,
como marca la spec. Este veredicto cubre R1-R7.

---

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (en esta branch: `[(123, 'in_progress')]`; `origin/main`: ninguna)
- [x] progress/current.md describe la sesión activa de #123

## Checklist C3 — Arquitectura
- [x] Sin cambios en backend. Móvil: `src/utils/date-picker-value.ts` es un helper puro que solo importa `Platform` de `react-native`. Las pantallas dependen del helper y el helper no depende de ellas
- [x] Nada en `node_modules/`, `patches/`, `package.json` ni `bun.lock`. Sin cambios nativos
- [x] Ubicación según `docs/conventions.md` (los helpers sueltos van en `src/utils/` con su test al lado)
- [x] Sin lógica de negocio fuera de su sitio

## Checklist C4 — TDD
- [x] Cada R1-R7 tiene al menos un test que lo nombra (`#123 R<n>:`). Los 9 títulos de `describe`, los 4 de `it` y los 16 de las filas de `it.each` son literales de requirements.md (comprobado con `grep -F`)
- [x] Historial test-primero: 7 rojos y 7 verdes alternos, un commit por paso, con los mensajes literales del handoff (`diff` con la lista: exit 0)
- [x] Ningún rojo falla por `ReferenceError` ni por `Cannot find module`. Todos fallan por aserción (tabla de abajo, reejecutada commit a commit)
- [x] Ningún rojo se consigue mutando un doble. Todos son naturales (D8): el esqueleto identidad o la pantalla sin conversión son el defecto real
- [x] Las propiedades sobre código ya correcto (mínimo, máximo y hora sin convertir) viajan en `it` con rojo natural. Su vigilancia se prueba con las sondas AR_MIN_TO, AR_MIN_FROM, AR_TIME_FROM, AR_TIME_TO_VALUE y AP_MAX_TO: todas rojas (tabla de sondas)

## Checklist C5 — Trazabilidad
- [x] traceability.md: ninguna fila de R1-R7 en «pendiente». R8 es el gate humano y queda pendiente, tal como lo diseña la spec
- [x] Los 14 hashes son ancestros de HEAD (`git merge-base --is-ancestor`, exit 0 los 14)
- [x] Formato de commit: `test(<scope>): … (Rn)` / `fix(<scope>): … (Rn)`, fijado por tasks.md de la spec aprobada
- [ ] Rellenada **tras cada commit**: **no**. Solo se rellenó al final, en `fe76ec44` (hallazgo H1, baja, no bloquea)

## Checklist C6 — Spec aprobada
- [x] requirements.md, design.md, tasks.md y traceability.md con `status: approved`; casilla humana marcada (2026-09-24, vía Notion)
- [x] `git diff b279cdfb HEAD -- specs/mobile-date-picker-utc-day-shift/` → solo `traceability.md`, 7 filas de `pendiente | pendiente` → hash rojo | hash verde. Ningún requisito se tocó
- [x] `git diff 045b091b b279cdfb` → solo cambian el frontmatter (4×), la casilla de aprobación y `progress/current.md`

## Checklist C7 — Sin código huérfano
- [x] N/A: la feature no reemplaza ningún módulo (añade un helper y dos llamadas por pantalla)

## Checklist C8 — UI móvil
- [x] Grep-clean: el diff no cambia marcado, clases, hex ni `StyleSheet`. Ninguna línea añadida contiene `<palabra>-[` (grep, exit 1 = sin coincidencias). `design-drift.test.ts` está en verde
- [x] Dimensiones, Skeleton, componentes compartidos, tappables y animaciones: N/A (cero cambios de vista)
- [x] El handoff nombró la skill de Codex con su nombre real (`expo-ui-jetpack-compose`) y Codex la cargó (reporte §cabecera)

---

## 1. Rojos y verdes, commit a commit (worktree desechable, host UTC)

Cada commit se reejecutó con `bunx jest --runTestsByPath <fichero>`.

| Commit | R | Exit | Recuento | Motivo |
|---|---|---|---|---|
| 4e63ef3d | R1 rojo | 1 | 4 fallos / 1 ok | aserción `toEqual` (filas 1-4). La fila 5 (Kiritimati) queda verde, como dice la spec |
| e87c4e4f | R1 verde | 0 | 5/5 | — |
| fbb3afdc | R2 rojo | 1 | 4 fallos / 6 ok | aserción `toBe`: `'…T20:00:00.000Z'` y `'…T00:30:00.000Z'`. La fila 4 queda verde en un host UTC, como dice la spec |
| e0f9e411 | R2 verde | 0 | 10/10 | — |
| 06892186 | R3 rojo | 1 | 2 fallos / 10 ok | `toBe`: devuelve otro objeto |
| 08b68ba4 | R3 verde | 0 | 12/12 | — |
| 928de550 | R4 rojo | 1 | 3 fallos / 21 ok | `Unable to find an element with text: 24/9/2026`, `1/10/2026`, `1/1/2027` (la etiqueta) |
| 3a5c20b2 | R4 verde | 0 | 24/24 | — |
| 4d02bb34 | R5 rojo | 1 | 1 fallo / 24 ok | `value`: recibido `"2026-09-24T20:00:00.000Z"` |
| 86204625 | R5 verde | 0 | 25/25 | — |
| b4bf8d41 | R6 rojo | 1 | 3 fallos / 20 ok (con `#90 R6` verde) | etiqueta `24/9/2026`, `1/10/2025`, `1/1/2026` |
| 752528ba | R6 verde | 0 | 23/23 | — |
| 25c0175f | R7 rojo | 1 | 1 fallo / 23 ok | `value`: recibido `"2026-09-24T20:00:00.000Z"` |
| 6d5769d7 | R7 verde | 0 | 24/24 | — |

Coincide con el reporte de Codex en recuentos y motivos.

## 2. Corrección en producción frente a `@expo/ui` 57.0.11

- **Ruta Android** (`DateTimePicker.android.tsx`): con `presentation="dialog"` y `mode="date"` monta `DatePickerDialog`, que recibe `initialDate: value.toISOString()`. La capa JS (`jetpack-compose/DatePicker/index.tsx`) pasa `new Date(initialDate).getTime()` y devuelve `new Date(date)`. En el nativo (`DatePickerView.kt`, `ExpoDatePickerDialogContent`): `initialSelectedDateMillis = initialDate` y el OK devuelve `state.selectedDateMillis`. Ninguna capa toca la zona.
  - `toPickerValue` = `Date.UTC(día local)`: el diálogo abre en el día local.
  - `fromPickerValue` = medianoche local del día UTC devuelto: la pantalla guarda el día tocado.
  - Son exactamente las inversas de lo que hace el diálogo. El propio paquete trata cada celda como día UTC: `isSelectableDate(utcTimeMillis)` compara contra `toUtcDayMillis(...)`.
- **`minimumDate`/`maximumDate` sin tocar**: siguen siendo `new Date()` (grep = 1 en cada pantalla). `toUtcDayMillis` los lleva al día local en el nativo. Con el arreglo, el valor inicial de hoy es exactamente `startUtcDayMillis`/`endUtcDayMillis`, así que hoy es seleccionable en add-reminder y en add-pet.
- **Picker de hora sin tocar**: `value={time}` y `setTime(selectedTime)` intactos. `ExpoTimePickerDialogContent` usa `Calendar.getInstance()` en la zona del dispositivo.
- **Rango de años** (`rememberDatePickerYearRange`): toma el año local de `initialDate`. Revisé los casos alcanzables:
  - Offset negativo el 1 de enero: el rango incluye siempre el año UTC de la selección. add-reminder tiene `endYear` 2100; en add-pet, `endYear` es el año actual y la fecha elegida nunca pasa de hoy.
  - Offset positivo: el año local y el año UTC de la medianoche UTC coinciden.
  - Inofensivo, como dice la nota de design.
- **Rama iOS** (`Platform.OS !== 'android'`): las dos funciones devuelven el mismo objeto. Lo prueba R3 con `toBe`, y la sonda GATE_FROM pone rojo `#90 R6`, que confirma que ese candado corre como `'ios'`.
- **D2 frente a `ios/DatePickerView.swift`**: el razonamiento se sostiene.
  - `DatePicker(selection: $date, …, displayedComponents: components)` enlaza un instante que SwiftUI pinta en la zona del entorno (las pantallas no pasan `timeZoneName`, así que es la del dispositivo).
  - Lo devuelve como instante, sin truncar a día UTC: `props.onDateChange(["date": newDate.timeIntervalSince1970 * 1000])`. Su día local es el elegido, así que la identidad es correcta.
  - Aplicar `getUTC*` o `Date.UTC` en iOS desplazaría el día. Web pinta `null`.
  - No verificado en dispositivo (#60), como declara la spec.
- **Comprobación independiente con `Date` reales y zonas reales** (sonda desechable, no versionada):
  - Modelo del diálogo: abre en el día UTC del valor; OK devuelve la medianoche UTC del día tocado; seleccionable si no queda por debajo del mínimo.
  - Lo recorrí cada 30 min en 6 días clave (fin de mes, fin de año, 1 de enero, cambios de horario) en `UTC`, `America/Mexico_City`, `Pacific/Honolulu`, `Europe/Madrid`, `Pacific/Kiritimati`, `Pacific/Pago_Pago`, `America/Sao_Paulo`, `America/Santiago`, `Australia/Lord_Howe` y `Asia/Kathmandu`.
  - En las 10 zonas: abre en el día local, hoy es seleccionable, guarda el día tocado y reabre en él. La misma sonda con el helper identidad (el código de antes) da exit 1.
- **Sonda de pantalla con `Date` reales**: copia de cada fichero de test más un `describe` que dispara la salida real del diálogo, `new Date(Date.UTC(y, m, d))`.
  - add-reminder, en UTC, CDMX, Honolulu, Madrid y Kiritimati: etiqueta, reapertura en `'…T00:00:00.000Z'` del día elegido y `dueAt` correctos. 28/28, exit 0.
  - add-pet, en UTC, CDMX, Madrid, Kiritimati y Pago_Pago: `birthDate` y reapertura correctos. 27/27, exit 0.
  - Control: con las pantallas de `70f841f3`, la sonda de add-reminder en CDMX da 7 fallos (exit 1).

## 3. Fidelidad de los tests

- `wallClock(local, utc)` tiene la forma exacta de la spec (`Object.assign(new Date(l0..l4), { getUTCFullYear, getUTCMonth, getUTCDate })`) en los tres ficheros.
- `setPlatform` usa el mecanismo de D6. `originalPlatform` se captura a nivel de módulo y se restaura en `afterEach`. R1 y R2 corren como `'android'`; R3 como `'ios'` explícito.
- En add-reminder y add-pet los `describe` de #123 van al final del fichero. `#90 R6` corre antes, como `'ios'`, y sigue verde (`✓ envía los getters locales aunque los getters UTC estén en el día siguiente`).
- Las pantallas asertan lo que se muestra: `within(date-field / birth-date-field).getByText(etiqueta)`. También lo que se manda: `mockCreateReminder` con `dueAt` y `mockCreatePet` con `birthDate`, todos como literales de la tabla. R5 y R7 asertan `value`, `minimumDate`/`maximumDate` y (en R5) la hora de las 09:00.
- Arnés de D7: se usan los mocks existentes de cada fichero, sin copiar de otra suite, y add-pet no pulsa `add-pet-photo`.
- **Suites bajo zonas reales en HEAD**: `TZ=<zona> bunx jest --runTestsByPath` de los 3 ficheros da **61/61, exit 0** en `UTC`, `America/Mexico_City`, `Pacific/Honolulu`, `Europe/Madrid`, `Pacific/Kiritimati`, `Pacific/Pago_Pago` y `Asia/Tokyo`. Los dobles y los literales `Z` son deterministas, como afirma D4.

## 4. Sondas (worktree desechable en el scratchpad, cada una restaurada con `git diff` vacío; host UTC salvo que se indique)

Se corrieron sobre los 3 ficheros (61 tests). «Filas» se refiere a las tablas de la spec.

| Sonda | Rojos | Filas / tests rojos | ¿Coincide con la spec? |
|---|---|---|---|
| F0b `new Date(picked)` | 10 | R1 1-4 + R4 ×3 + R6 ×3 | sí |
| F1 día local | 10 | R1 1-4 + R4 ×3 + R6 ×3 | sí |
| F2 mes local | 6 | R1 2,3 + R4 2,3 + R6 2,3 | sí |
| F3 año local | 3 | R1 3 + R4 3 + R6 3 | sí |
| F4 los tres locales | 10 | R1 1-4 + pantallas ×6 | sí |
| F5 día = 1 | 5 | R1 1,4,5 + R4 1 + R6 1 | sí |
| F6 mes = 8 | 6 | R1 2,3 + R4 2,3 + R6 2,3 | sí |
| F7 año = 2026 | 3 | R1 3 + R4 3 + R6 2 | sí |
| F8 +6 h fijas | 1 | R1 4 (Honolulu) | sí |
| F9 +12 h fijas | 1 | R1 5 (Kiritimati) | sí |
| T1 día UTC | 4 | R2 1,2,3,5 | sí |
| T2 mes UTC | 2 | R2 2,3 | sí |
| T3 año UTC | 1 | R2 3 | sí |
| T4 los tres UTC | 4 | R2 1,2,3,5 | sí |
| T5 día = 1 | 6 | R2 1,2,3,5 + R5 + R7 | sí |
| T6 mes = 8 | 2 | R2 3,4 | sí |
| T7 año = 2026 | 1 | R2 4 | sí |
| T9 −6 h y leer UTC | 2 | R2 4,5 | sí |
| Quitar la puerta en `fromPickerValue` | 2 | R3 `ios: fromPickerValue…` + **`#90 R6`** | sí (C3 de la spec) |
| Quitar la puerta en `toPickerValue` | 1 | R3 `ios: toPickerValue…` | sí |
| Quitar las dos puertas | 3 | R3 ×2 + `#90 R6` | sí |
| `Platform.OS === 'ios'` como puerta | 0 | — | equivalente, aceptada por la spec |
| add-reminder: `toPickerValue` en `onValueChange` | 3 | R4 ×3 | sí |
| add-reminder: sin `fromPickerValue` | 3 | R4 ×3 | sí |
| add-reminder: sin `toPickerValue` | 1 | R5 | sí |
| add-reminder: `setTime(fromPickerValue(…))` | 3 | R4 ×3 | sí |
| add-reminder: `value={toPickerValue(time)}` | 1 | R5 | sí |
| add-reminder: `minimumDate={toPickerValue(new Date())}` | 1 | R5 | sí |
| add-reminder: `minimumDate={fromPickerValue(new Date())}` (extra) | 1 | R5 | — |
| add-pet: `toPickerValue` en `onValueChange` | 3 | R6 ×3 | sí |
| add-pet: sin `fromPickerValue` | 3 | R6 ×3 | sí |
| add-pet: sin `toPickerValue` | 1 | R7 | sí |
| add-pet: `maximumDate={toPickerValue(new Date())}` | 1 | R7 | sí |

**Búsqueda en zonas ciegas** (probadas en `UTC`, `America/Mexico_City`, `Europe/Madrid` y `Pacific/Kiritimati`):

| Sonda | UTC | CDMX | Madrid | Kiritimati | Qué la cierra |
|---|---|---|---|---|---|
| TLOCAL: `toPickerValue` = medianoche **local** sin `Date.UTC` | **verde** | 7 rojos | 7 rojos | 7 rojos | grep de cierre `Date.UTC(` = 1. **Techo documentado**, confirmado: solo lo ve el grep en un host UTC |
| TOFFS: `getTime() − offset − (h,m)` en `toPickerValue` | verde | verde | verde | verde | mutante **equivalente** (es la misma cuenta que `Date.UTC(getFullYear…)`); el contrato y el grep `getTime\|getTimezoneOffset…` = 0 lo excluyen |
| FOFFS: `getTime() + getTimezoneOffset()` en `fromPickerValue` | 10 rojos | 1 rojo (Honolulu) | 10 rojos | 10 rojos | tabla R1 y grep. Rojo en el VPS, como dice D4 |
| Atajo +6 h **en la pantalla** (`setDate(new Date(selectedDate.getTime() + 6*3600e3))`) | verde | verde | verde | — | grep `PickerValue(` = 2 por pantalla (con el atajo baja a 1). D5: la pantalla prueba el enrutado y el helper la semántica (R1 filas 4 y 5) |
| Doble conversión `fromPickerValue(fromPickerValue(x))` (en las dos pantallas) | verde | verde | 3 rojos por pantalla | — | idempotente con offset ≤ 0; poco realista. Sin acción |
| **Reapertura sin convertir**: `value={date ?? toPickerValue(new Date())}` (add-reminder) y su análogo en add-pet | **verde** | **verde** | **verde** | **verde** | **nada** (ver H2) |

## Observaciones

Ningún hallazgo bloquea.

- **H1 (baja, proceso; reincide #84).** `traceability.md` se rellenó una sola vez, al final (`fe76ec44`, junto con el reporte). El handoff y tasks.md pedían explícitamente actualizarla tras cada commit. Los hashes son correctos y ancestros de HEAD, así que C5 se cumple en fondo.
  - Nota para el leader: la instrucción choca con la lista cerrada de 14 commits literales. Rellenar la fila N tras el commit N solo cabe metiendo `traceability.md` en el commit TDD siguiente, lo que mezcla ficheros de arnés en un rojo o un verde, o añadiendo commits `docs` que la lista no prevé.
  - Si se quiere cumplir, el handoff tiene que decir cómo. Si no, conviene retirar la instrucción.
- **H2 (baja, hueco de test no declarado; el código es correcto).** La reapertura del diálogo tras elegir una fecha no está candada en pantalla.
  - La regresión `value={date ?? toPickerValue(new Date())}` (convertir solo el valor por defecto) sobrevive a las 61 pruebas en las 4 zonas y a los greps de cierre (`PickerValue(` sigue en 2).
  - En producción solo dañaría offsets positivos. En Madrid el diálogo reabriría en el día anterior (sonda: recibido `"2026-09-23T22:00:00.000Z"` frente a `"2026-09-24T00:00:00.000Z"`), y pulsar OK sin tocar guardaría ese día. En México es inocuo.
  - La spec cubre la reapertura solo en el helper (R2 fila 4) y la da «por construcción» en D1. El código actual convierte `date ?? new Date()` entero, y la sonda de pantalla con `Date` reales lo confirma en 5 zonas.
  - Candidata a deuda: un `it` de reapertura por pantalla, que en Madrid pondría rojo este mutante.
- **H3 (informativa).** El techo TLOCAL (medianoche local sin `Date.UTC`) se comporta exactamente como está documentado: verde en UTC, 7 rojos en CDMX, Madrid y Kiritimati, y lo cierra el grep `Date.UTC(` = 1. TOFFS es un mutante equivalente y el contrato lo excluye.
- **H4 (informativa).** Desde la base, `origin/main` avanzó a `f72c1fc0` (#121): solo `home/index.test.tsx` y ficheros de arnés. `git merge-tree --write-tree origin/main HEAD` da exit 0, sin conflictos. Sin rebase, así que los hashes de la trazabilidad siguen siendo válidos.
- **H5 (informativa).** Los commits de Codex llevan la identidad git de la máquina (`Claude <claude@srv1178023.hstgr.cloud>`). Sin efecto sobre C4 y C5.

## Comandos (exit medido sin pipe)

| Comando (desde `mobile-pet-tracker/` salvo indicación) | Exit | Resultado |
|---|---|---|
| `git rev-parse HEAD` (raíz) | 0 | `fe76ec44…` al empezar y al terminar |
| `test ! -e .expo/types/router.d.ts` | 0 | ausente |
| `bunx tsc --noEmit` | 0 | — |
| `bun run lint` | 0 | — |
| `bunx jest --runTestsByPath` de date-picker-value, add-reminder, add-pet, design-drift, language-provider, reminder-dates, consistency-classnames y detail-stack | 0 | 8 suites / 212 tests |
| `TZ=<7 zonas> bunx jest --runTestsByPath` de los 3 ficheros | 0 ×7 | 61/61 en cada zona |
| `grep -c 'Date.UTC(' src/utils/date-picker-value.ts` | 0 | 1 |
| `grep -o 'getUTC[A-Za-z]*()'` en el helper | 0 | `getUTCFullYear()`, `getUTCMonth()`, `getUTCDate()`, 1 vez cada una |
| `grep -c "Platform.OS !== 'android'"` en el helper | 0 | 2 |
| `grep -c 'getTime\|getTimezoneOffset\|toISOString\|getHours'` en el helper | 1 | 0 (sin coincidencias) |
| `grep -c 'PickerValue('` en add-reminder / add-pet | 0 / 0 | 2 / 2 |
| `grep -c 'getUTC'` en add-reminder / add-pet | 1 / 1 | 0 / 0 |
| `grep -c 'minimumDate={new Date()}'` (add-reminder) / `'maximumDate={new Date()}'` (add-pet) | 0 / 0 | 1 / 1 |
| `git diff --stat origin/main...HEAD -- mobile-pet-tracker` (raíz) | 0 | exactamente los 6 ficheros de design §Archivos afectados, +224 / −4 |
| `git diff origin/main...HEAD -- package.json bun.lock patches src/i18n src/__tests__ src/providers` (móvil) | 0 | 0 líneas: catálogo +0, ui-copy-table +0, sin dependencias ni parches |
| `git diff --check origin/main...HEAD` | 0 | limpio |
| `git merge-base --is-ancestor <14 hashes> HEAD` | 0 ×14 | — |
| `git merge-tree --write-tree origin/main HEAD` | 0 | sin conflictos |

Fuera de los 6 ficheros móviles, el diff contra `origin/main` solo toca ficheros de arnés: `feature_list.json` (#123 → `in_progress`), `progress/current.md`, `progress/handoff_…`, `progress/impl_…` y los 4 ficheros de la spec.

## Output de ./init.sh

No lo corrió el reviewer: el clasificador se lo deniega al subagente y LocalStack y Postgres son compartidos. Lo corrió el leader sobre este mismo HEAD `fe76ec44`.

El log (`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f4719a40-0501-4a5f-80e7-b8287f1de20f/scratchpad/init-123-review.log`) se escribió a las 16:36:31Z, después del commit `fe76ec44` (16:30:41Z). Incluye `PASS src/utils/date-picker-value.test.ts` y los dos ficheros de pantalla. Se midió sin pipe.

```
Test Suites: 170 passed, 170 total          # backend unit
Tests:       1298 passed, 1298 total
Test Suites: 2 passed, 2 total              # infra
Tests:       14 passed, 14 total
Test Suites: 83 passed, 83 total            # móvil (base 70f841f3: 82 / 1471 → +1 suite, +20 tests)
Tests:       1491 passed, 1491 total
Snapshots:   1 passed, 1 total
[✓] migrations applied successfully!
Test Suites: 3 skipped, 27 passed, 27 of 30 total   # e2e
Tests:       8 skipped, 389 passed, 397 total
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 101/123 completadas | 21 pendientes
EXIT 0
```
