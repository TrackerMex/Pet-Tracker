# review: reminder-advance-already-past (#125, P2, backend + móvil)
Fecha: 2026-09-25T05:02Z
Veredicto: APROBADO

Worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/125-reminder-advance-already-past`, HEAD `97054568` (comprobado al
empezar y al terminar; árbol limpio). Commits revisados: `459013a8..97054568`
sobre `efc28b05`. Merge-base con `origin/main`: `40ec1b46` (`origin/main` ya
está en `2da66b86` por #122; todo diff de este informe es `40ec1b46...HEAD`).
Firma `699e90cf` (espejo `6169eca4`).

Skills cargadas: `expo:expo-overview` y después `expo:expo-native-ui`. La carta
(`docs/ui-guidelines.md`) gana sobre la skill donde chocan (NativeWind).

`./init.sh` **no** lo corrió el reviewer (el clasificador lo deniega a
subagentes; LocalStack y Postgres compartidos). Se leyó el log del leader sobre
este mismo tip. Las sondas se hicieron en un worktree desechable
(`git worktree add --detach` en el scratchpad, `node_modules` enlazados),
restaurando cada una con `git diff --exit-code` = 0, y ya se eliminó.

R5 (smoke en dev build de Android) es del humano y sigue abierto, como marca
la spec. Este veredicto cubre R1-R4.

---

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `[(125, 'reminder-advance-already-past', 'in_progress')]`
- [x] progress/current.md describe la sesión activa de #125 (base, firma, plan con Codex, siguiente paso)

## Checklist C3 — Arquitectura
- [x] `reminder-push-body.ts` (application) solo importa `isSupportedTimeZone` de `@/pipeline/local-day`: un núcleo puro de `Intl`, sin framework ni IO. Es el mismo import que ya hacen `pets/application/owner-local-day.ts` y tres use-cases de `activity`
- [x] El dispatcher (infrastructure) depende de la interfaz de dominio `PetRepository` (token `PET_REPOSITORY`) y de la función de application: dependencias hacia dentro
- [x] Ningún puerto, módulo, repositorio, migración, e2e, catálogo, `package.json` ni lockfile cambia (`git diff --name-only 40ec1b46...HEAD | grep -E "package.json|lock|catalog|test/|migrations|module.ts|repository"` → exit 1, sin coincidencias)
- [x] Sin lógica de negocio fuera de su sitio. Los otros consumidores del dispatcher siguen bien: `reminders-scheduler.service.spec.ts` lo dobla entero, y `test/pet-reminders.e2e-spec.ts` lo saca del contenedor Nest real (`app.get(RemindersDispatchService)`). En el log del leader el e2e da 27 pasadas + 3 omitidas (las 3 son `aws-real-*`, que se omiten por diseño), así que R7/R8 de `pet-reminders` corrieron en verde con el `PET_REPOSITORY` de verdad inyectado y la lectura de zona dentro del `try` (R7 exige `sent`: una lectura que fallase dejaría la fila sin marcar)

## Checklist C4 — TDD
- [x] Cada R1-R4 tiene tests que lo nombran (`#125 R<n>:`). Los 26 títulos nuevos (5 `describe`, 7+7 filas de `it.each`, 7 `it`) son literales de requirements.md (comprobado por script con `in`: 0 que falten; solo las 3 filas de `#123 R4`, que ya existían, no salen en la spec de #125)
- [x] Historial test-primero: 4 rojos y 4 verdes alternos, un commit por paso, con los 9 mensajes literales del handoff
- [x] Todos los rojos fallan por aserción. Ninguno por `ReferenceError`, `TypeError` ni `Cannot find module` (reejecutados uno a uno, tabla §1)
- [x] Ningún rojo se consigue mutando un doble. Todos son naturales (D10): los esqueletos de R1/R2 son los que nombra tasks.md, y los rojos de R3/R4 corren contra la pantalla de antes / el verde anterior
- [x] Los candados movidos van solo en los rojos que declara la spec y cambian exactamente como está escrito (§2)

## Checklist C5 — Trazabilidad
- [x] traceability.md: ninguna fila de R1-R4 queda en «pendiente». R5 es el gate humano y sigue pendiente, como diseña la spec
- [x] Los 8 hashes son ancestros de HEAD (`git merge-base --is-ancestor`, exit 0 en los 8), y se rellenaron en un solo commit final (`97054568`), como pide la spec
- [x] Formato de commit: `test(<scope>): … (Rn)` / `feat(<scope>): … (Rn)`, con `<scope>` = `reminders` / `add-reminder`

## Checklist C6 — Spec aprobada
- [x] requirements/design/tasks/traceability con `status: approved`; casilla humana marcada (2026-09-24, vía Notion)
- [x] `git diff 699e90cf HEAD -- specs/reminder-advance-already-past/` → solo `traceability.md`: 4 filas pasan de `pendiente | pendiente` a `hash rojo | hash verde`. Ningún requisito se tocó

## Checklist C7 — Sin código huérfano
- [x] N/A: no reemplaza ningún módulo. El literal `` `Recordatorio: ${reminder.title}` `` desaparece del dispatcher (`grep -c Recordatorio` = 0) y pasa a vivir solo en `reminderPushBody`

## Checklist C8 — UI móvil
- [x] Grep-clean: las líneas añadidas en `mobile-pet-tracker/` no tienen hex, `<palabra>-[`, `StyleSheet.create`, shadow ni elevation. El grep solo da falsos positivos: `#125` en los títulos de `describe` (el regex de hex lo toma por color). `opacity-50` es una utilidad estándar que ya se usa en `src/screens/reminders/index.tsx` (P10). `design-drift.test.ts` y `consistency-classnames.test.ts` están en verde (log del leader, móvil 83/1503)
- [x] Dimensiones, Skeleton y animaciones: N/A (no cambian)
- [x] Componentes: el chip sigue siendo el mismo `Pressable` con cápsula; no se crea componente ni receta paralela
- [x] Tappables: `hitSlop={TOUCH_SLOP}` no cambia (`#61 R10` en verde). El estado desactivado va por `Pressable disabled` (a11y `disabled: true`, `onPress` inerte), y el chip no cambia de tamaño. El chip sigue sin feedback de pulsado: es una deuda transversal anterior, que la spec anota en §Fuera de alcance. #125 no la crea ni la amplía
- [x] El handoff nombró la skill de Codex con su nombre real (`building-native-ui`) y Codex dice haberla cargado

---

## 1. Rojos y verdes, commit a commit (worktree desechable, host UTC)

Backend: `pnpm exec jest src/modules/reminders`, `pnpm exec eslint src/modules/reminders`, `pnpm exec tsc --noEmit`.
Móvil: `bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx`, `bunx eslint src/screens/add-reminder`, `bunx tsc --noEmit`.
Todos los exit se midieron sin pipe (la salida se redirige a un fichero y luego se lee).

| Commit | R | jest exit | Recuento | Motivo del rojo | eslint | tsc |
|---|---|---|---|---|---|---|
| `459013a8` | R1 rojo | 1 | 7 fallan / 55 | las 7 filas: `Expected "Recordatorio: Vacuna antirrábica · …"`, `Received "Recordatorio: Vacuna antirrábica"` | **1** (2 × `no-unused-vars`: `dueAt`, `timeZone` del esqueleto) | 0 |
| `2c0bcb42` | R1 verde | 0 | 55/55 | — | 0 | 0 |
| `123b4c4f` | R2 rojo | 1 | 3 fallan / 57 (fichero: 3 rojos + 3 verdes de R5) | R6: cuerpo sin `· 13 de agosto a las 11:00`; dos zonas: `findOwnerTimezone.mock.calls` `[]`; lectura fallida: cuerpos `["…failed", "…sent"]` | 0 | 0 |
| `241ecf96` | R2 verde | 0 | 57/57 | — | 0 | 0 |
| `ab4e9a58` | R3 rojo | 1 | 11 fallan / 34 | 7 filas + 2 `it` + `renders alert choices…` + fila 1 de `#123 R4`, todos por `toEqual` / `toHaveBeenCalledWith` | 0 | 0 |
| `6fedbc87` | R3 verde | 0 | 34/34 | — | 0 | 0 |
| `ec96b49b` | R4 rojo | 1 | 3 fallan / 37 | los 3 `it` de R4, por aserción | 0 | 0 |
| `b10b7f1e` | R4 verde | 0 | 37/37 | — | 0 | 0 |

**Lint rojo en el rojo de R1.** No es un hallazgo. tasks.md §R1 lo autoriza por
escrito: «El lint de parámetros sin usar se exige en §Cierre, no en este rojo».
El repo no tiene hook de pre-commit (no hay `.husky`), y el CI corre sobre la
cabeza de la PR o de `main`, nunca por commit. El rojo es rojo por definición:
lo que no se puede es un rojo por `ReferenceError`, y este no lo es. `tsc` da 0
en los 8 commits y el lint da 0 desde el primer verde. `eslint` sin `--fix`
sobre `459013a8` muestra solo esos 2 errores: no quedó formato suelto. El
esqueleto de R2 (`private readonly pets` sin usar) sí pasa el lint.

## 2. Candados movidos (solo en los rojos declarados)

| Candado | Commit | Delta observado | ¿Igual a la spec? |
|---|---|---|---|
| `R5` (3 `new RemindersDispatchService(`) y `R6` (1) | `123b4c4f` | cuarto argumento `petsStub().client` en los 4 | sí |
| `R6` literal del cuerpo | `123b4c4f` | `` `Recordatorio: ${due.title} · 13 de agosto a las 11:00` `` | sí |
| `renders alert choices and selects seven days by default` | `ab4e9a58` | 2 × `{ selected: true }` → `{ selected: true, disabled: false }` (los de `type-chip-*` no cambian) | sí |
| `posts the exact trimmed input and navigates back on success` | `ab4e9a58` | `pickDate` y `dueAt` 25 → 28, solo en ese `it` (el `pickDate(new Date(2026, 7, 25, 12, 0))` sigue dos veces en el fichero; el del 28 aparece una) | sí |
| `#123 R4` | `ab4e9a58` | sexta columna `aviso` `0 / 10080 / 10080` y `advanceMinutes: aviso` | sí |

Ninguna otra línea de test existente cambia: las líneas `-` del diff de los dos
ficheros de test son exactamente estas.

## 3. Estado final (tip `97054568`)

| Comando | Exit | Resultado |
|---|---|---|
| `pnpm -C backend-pet-tracker exec jest src/modules/reminders` | 0 | 7 suites / 57 |
| `pnpm -C backend-pet-tracker exec tsc --noEmit` | 0 | — |
| `pnpm -C backend-pet-tracker run lint` (lleva `--fix`) | 0 | `git status --short` vacío después |
| `bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx` | 0 | 37 |
| `bun run typecheck` (móvil; `router.d.ts` ausente, `test !` exit 0) | 0 | — |
| `bun run lint` (móvil) | 0 | — |
| `TZ=America/Mexico_City` / `Pacific/Auckland` / `Asia/Tokyo` `jest src/modules/reminders` | 0 / 0 / 0 | 57 cada uno |
| `TZ=America/Mexico_City` / `Pacific/Auckland` / `Pacific/Chatham` `add-reminder` | 0 / 0 / 0 | 37 cada uno |
| Log del leader (`init-125-review.log`, HEAD `97054568`) | `EXIT 0` | backend 171/1307, infra 2/14, móvil 83/1503, e2e 27 + 3 omitidas (389 + 8 omitidos); lint y typecheck verdes |

Deltas contra la base `40ec1b46` (170/1298, 83/1491): backend +1 suite y +9
tests, móvil +0 suites y +12 tests. Los dos coinciden con §Candados. e2e +0, catálogo +0.

Greps de cierre de tasks.md: todos dan lo esperado. `'UTC'` 1, `formatToParts` 1,
`\.format(` 0, `hourCycle: 'h23'` 1, `isSupportedTimeZone` 2,
`findOwnerTimezone(reminder.petId)` 1, `reminderPushBody(` 1, `Recordatorio` (en el
dispatcher) 0. En móvil: `useState(Date.now)` 1, `setNow(Date.now())` 2,
`Date.now()` 4, `disabled={disabled}` 1, `opacity-50` 1, `60_000` 1,
`accessibilityState={{ selected }}` 2.

Alcance: `git diff --stat 40ec1b46...HEAD` → 14 ficheros. Los 6 de código son
los de design §Archivos afectados. El resto es arnés: `feature_list.json`,
`progress/current.md`, handoff, reporte de implementación y los 4 de
`specs/reminder-advance-already-past/`.

Lectura del código contra el contrato:
- `reminderPushBody`: zona efectiva con `isSupportedTimeZone` o `'UTC'`; `formatToParts` con `'es-MX'`, `day: 'numeric'`, `month: 'long'`, `hour`/`minute: '2-digit'`, `hourCycle: 'h23'`; el texto se compone con literales propios y el `·` es U+00B7. Sin `logger`, sin comentarios nuevos
- Dispatcher: la primera línea del `try` es `const timeZone = await this.pets.findOwnerTimezone(reminder.petId);`, antes del `SendMessageCommand`. Nada más del mensaje cambia
- Pantalla: `isAdvancePast` usa `<=`; `effectiveAdvance` filtra `minutes <= preferred && !isAdvancePast` sobre `ADVANCE_OPTIONS` (ascendente), toma `.pop()` y cae a `?? preferred`. `now` es estado `useState(Date.now)` y se refresca en los dos `onValueChange`. Guardar usa `effectiveAdvance(dueAt, advanceMinutes, Date.now())`. El chip lleva `disabled={disabled}`, la misma clase más ` opacity-50` y el mismo `hitSlop`, con `accessibilityState={{ selected }}` sin tocar. La preferencia solo se escribe en el `onPress` (`setAdvanceMinutes` aparece 2 veces: la declaración y el `onPress`)

## 4. Sondas de la spec (tasks.md §Sondas), todas restauradas (`git diff --exit-code` = 0)

**R1, `reminder-push-body.ts`**

| Id | Host | Rojo observado | Tabla |
|---|---|---|---|
| M1 | UTC | filas 1, 2, 3, 5 | igual |
| M1 | America/Mexico_City | filas 4, 5, 6, 7 | igual |
| M2 | UTC | 2, 3, 5, 6, 7 | igual |
| M3 | UTC | 5 | igual |
| M4 | UTC | 1-7 | igual |
| M5 | UTC | 2, 3, 5 | igual |
| M6 | UTC | 6, 7 (`RangeError`) | igual |
| M7 | UTC | 2, 3, 6, 7 | igual |
| Techo (zona del host en vez de `'UTC'`) | UTC | **verde** | igual (techo documentado) |
| Techo | America/Mexico_City | 6, 7 | igual |

**R2, dispatcher**

| Id | Rojo observado | Tabla |
|---|---|---|
| D1 zona constante `'UTC'` | R6, dos zonas, lectura fallida | igual |
| D2 `findOwnerTimezone(reminder.id)` | dos zonas, lectura fallida | igual |
| D3 lectura fuera del `try` | lectura fallida | igual |
| D4 una lectura por tick | dos zonas (mi variante convierte el fallo en `null`, así que también cae «lectura fallida») | cubre la de la tabla |
| D5 fallo → `'UTC'` y publica | lectura fallida | igual |

**R3/R4, pantalla** (recuento sobre las 37 del fichero)

| Id | Rojos | Tabla |
|---|---|---|
| MU1 `< now` | 8: F1, F5, F6, F7, P + 3 de R4 | igual |
| MU2 sin `disabled` en el `Pressable` | 1: P | igual |
| MU3 ignora la preferencia | 4: P, S, `renders alert…`, `posts the exact…` | igual |
| MU5 sin ` opacity-50` | 10: F1, F3-F7, P, S + 2 de R4 | igual |
| MU6 el vencimiento ignora la hora | 1: S | igual |
| MU8 Guardar manda la preferencia cruda | 7: F1, F3-F6, `#123 R4` f1, R4 Guardar | igual |
| MU9 el menor activo | 12: F1-F3, F5, S + 3 de R4 + `renders…`, `posts…`, `#123 R4` f2/f3 | igual |
| MU10 `3_600_000` | 12: F1-F3, F5, P, S + 3 de R4 + `posts…`, `#123 R4` f2/f3 | igual |
| MU11 todos desactivados → `0` | 1: F7 | igual |
| MU16 opacidad en el seleccionado | 12: F1-F7, P, S + 3 de R4 | igual |
| MU12 sin `setNow` en la hora | 1: R4 hora | igual |
| MU13 sin `setNow` en la fecha | 1: R4 fecha | igual |
| MU14 Guardar manda lo seleccionado | 1: R4 Guardar | igual |
| MU15 Guardar con el `now` del estado | 1: R4 Guardar | igual |

Las 29 sondas (10 de R1 contando los dos hosts, 5 de R2, 14 de la pantalla) coinciden con las tablas de requirements.md y con el reporte de Codex.

## 5. Sondas del reviewer en zonas ciegas

| Id | Mutación | Resultado |
|---|---|---|
| B1 | `minute: 'numeric'` | **verde**. Mutante equivalente en ICU 78.2: es-MX sigue dando `mm` |
| B2 | `hour: 'numeric'` | **verde**. Equivalente en ICU 78.2 (el esqueleto h23 de es-MX da `HH`); `'2-digit'` lo garantiza sin depender de CLDR |
| B3 | `day: '2-digit'` | rojo, 5 filas |
| B4 | `'es-ES'` | **verde**. Equivalente: mismos nombres de mes y mismo formato |
| B5 | `'en-US'` | rojo, 7 filas |
| D6 | `reminderPushBody(reminder.scheduleName, …)` | rojo: R6 y los 2 de R2 |
| D7 | `reminderPushBody(…, new Date(), …)` | rojo: R6 y los 2 de R2 |
| X2 | el chip `0` nunca se desactiva | rojo: F7 |
| X3 | variante «pegajosa» (en la hora, la preferencia pasa a la efectiva) | rojo: S |
| X7 | sin fecha, todos desactivados | rojo: `renders alert choices…` (candado movido) |
| X8 | `selected` con la preferencia cruda | rojo: 8 |
| X9 | preferencia inicial 4320 | rojo: 9 |
| **X10** | el picker de **fecha** resetea la preferencia a 10080 | **verde, 37/37** (H1) |
| **X11** | los pickers de fecha **y** hora resetean la preferencia a 10080 | **verde, 37/37** (H1) |
| **X1** | todos desactivados → `?? 10080` en vez de `?? preferred` | **verde, 37/37** (H2) |
| **X5** | `const now = new Date().getTime()` en render (con `setNow` intacto) | **verde, 37/37**. Lint exit 0. La variante con `Date.now()` sí la para el lint: `react-hooks/purity`, exit 1 (H3) |
| **X6** | `onPress` guarda `Math.min(option.minutes, selectedAdvance)` | **verde, 37/37** (H5) |

Contraprueba de H1, en el worktree desechable y sin commitear: un `it` de
scratch fija el reloj el 24 de septiembre a las 08:00, elige el 10 de octubre,
pulsa «1 día», cambia al 5 de octubre y luego la hora a las 10:00. Asevera
`expectAdvanceChips([false, false, false, false], 1440)` después de cada cambio.
Sobre el tip pasa (exit 0). Con X11 falla (exit 1: sale seleccionado 10080). El
código es correcto; lo que falta es el candado.

---

## Observaciones

Ningún hallazgo bloquea. La implementación cumple R1-R4 tal como se aprobaron,
y las 29 sondas de la spec coinciden fila a fila.

- **H1 (media, de spec, no bloquea la implementación).** Nada en la suite
  distingue entre «la elección explícita se conserva al cambiar fecha u hora»
  (D6.3, título del `it` de secuencia de R3) y «cada cambio de fecha u hora
  resetea la preferencia a 7 días». X10 y X11 pasan 37/37. El motivo: en los
  pasos c y e de la secuencia el valor esperado (1440) es también el mayor chip
  activo, así que coincide con lo que daría la preferencia reseteada. Y ningún
  otro test cambia fecha u hora con la elección explícita por debajo del mayor
  activo. Si alguien introdujera esa regresión, el usuario que eligió «1 día»
  vería volver «7 días» al cambiar de fecha, y así se guardaría. El código de
  hoy no tiene el defecto: la contraprueba de §5 pasa. La secuencia es literal
  en requirements.md R3 (aprobada), así que Codex no tenía margen. Cerrarlo
  exige enmendar la spec aprobada, y eso queda fuera del alcance del
  implementer. Queda para el leader.
- **H2 (baja).** El fallback de «todos desactivados» no está candado contra una
  constante: `?? 10080` sobrevive, porque la fila 7 usa la preferencia por
  defecto. Solo afecta a qué chip atenuado se ve seleccionado. Guardar no puede
  llegar a ese fallback: si `dueAt > Date.now()`, el chip 0 está activo.
- **H3 (info, techo documentado en D7).** Leer el reloj en render esquivando el
  lint (`new Date().getTime()`) pasa tests y lint. D7 lo nombra («o esquivarlo a
  sabiendas»). La forma `Date.now()` la para `react-hooks/purity`.
- **H4 (info, techo documentado en R1).** Caer a la zona del host en vez de a
  `'UTC'` pasa en verde con host UTC y se pone rojo con host Ciudad de México
  (filas 6 y 7). Lo cierra el grep `'UTC'` = 1, que da lo esperado.
- **H5 (info, anterior a #125).** Ningún test pulsa un chip activo mayor que el
  seleccionado (X6 sobrevive). El `onPress` no cambia en #125; el hueco viene de
  los tests de #39.
- **H6 (info).** El rojo de R1 (`459013a8`) se commiteó con el lint de backend en
  1 (parámetros del esqueleto sin usar). tasks.md §R1 lo autoriza, ninguna regla
  del repo exige lint por commit, y el tip tiene el lint en 0 (§1).
- **H7 (info).** B1, B2 y B4 son mutantes equivalentes bajo ICU 78.2: no revelan
  un hueco, porque producen la misma cadena.

## Output de ./init.sh

No lo ejecutó el reviewer (lo deniega el clasificador a subagentes; entorno
compartido). Log del leader: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f4719a40-0501-4a5f-80e7-b8287f1de20f/scratchpad/init-125-review.log`,
HEAD `97054568`, medido sin pipe:

```
Test Suites: 171 passed, 171 total          (backend unit)
Tests:       1307 passed, 1307 total
Test Suites: 2 passed, 2 total              (infra)
Tests:       14 passed, 14 total
Test Suites: 83 passed, 83 total            (móvil)
Tests:       1503 passed, 1503 total
Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e; los 3 omitidos son aws-real-*)
Tests:       8 skipped, 389 passed, 397 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
EXIT 0
```

---

## Ronda 2

Fecha: 2026-09-25T16:30Z
Veredicto: APROBADO

Alcance: Enmienda E1 (R6, solo tests). Commits `21ff2000` (rojo con X11),
`7d178b03` (verde, revierte X11) y `916b7f63` (trazabilidad). HEAD `916b7f63`,
comprobado al empezar y al terminar. Árbol limpio. Firma de E1 `aedb89be`
(espejo `7238bc6d`). Smoke de R5 firmado por el humano en `07905716`
(CPH2709), ancestro de `aedb89be` (`is-ancestor` → exit 0). Skill cargada:
`expo:expo-overview`. Merge-base con `origin/main` (tras `git fetch`):
`2da66b86` = `origin/main`.

Las sondas se hicieron en un worktree desechable (`git worktree add --detach`
en el scratchpad, con `node_modules` enlazado). Cada una se restauró
(`git diff --exit-code` = 0) y el worktree ya está eliminado.
`Pet-Tracker-wt-backend` no se tocó.

### Checklist ronda 2

- [x] **C2**: solo #125 está `in_progress` en `feature_list.json` de esta branch.
- [x] **C3**: producción idéntica a la de la ronda 1.
  `git diff b10b7f1e HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`
  → vacío, exit 0. `git diff 97054568 HEAD -- backend-pet-tracker` → vacío,
  exit 0.
- [x] **C4**: los dos `it` nombran R6 en su `describe`. El rojo va antes que el
  verde. El rojo lleva la mutación versionada de producción (C4, quinto punto),
  y el verde la revierte: `git diff 7d178b03 21ff2000~1 -- …/index.tsx` → vacío.
- [x] **C5**: la fila R6 tiene `21ff2000` / `7d178b03`, y los diez hashes de la
  tabla son ancestros de HEAD (`is-ancestor` → exit 0 en todos). Los mensajes de
  commit coinciden literalmente con tasks.md §E1. **La fila de R5 sigue
  diciendo «pendiente»**: ver H8.
- [x] **C6**: `git diff aedb89be HEAD -- specs/reminder-advance-already-past/`
  solo cambia la fila R6 de `traceability.md` (1 línea), exit 0. La casilla de
  R5 es del commit del humano `07905716`, anterior a la firma. `status: approved`.
- [x] **C7**: N/A. No se reemplaza nada.
- [x] **C8**: sin cambios de UI. Solo cambia un test.

### 1. Los dos `it` frente al texto de E1

Los dos `it` viven en
`describe('#125 R6: la elección explícita del aviso se conserva al cambiar fecha u hora (Enmienda E1)'`,
que es el último hijo del padre `#125` y va justo después del de R4. Heredan
su `beforeEach`/`afterEach`. Usan reloj `new Date(2026, 8, 24, 8, 0)`, título
`'Rabies'` y los helpers de módulo `pickDate`, `pickTime` y
`expectAdvanceChips`. Los pasos a-e coinciden literalmente con las dos tablas:
chips, selección, payload
`{ type: 'vaccine', title: 'Rabies', dueAt: new Date(2026, 9, 5, 10, 0).toISOString(), advanceMinutes: 1440 }`,
el texto `'La fecha debe ser futura'` y `not.toHaveBeenCalled()`. Ningún valor
esperado sale de un símbolo de producción. Ningún test existente cambia:
`git diff d3d6c9b3 HEAD -- …/index.test.tsx` no tiene ninguna línea `-`, y
`git diff 21ff2000 HEAD` sobre el test sale vacío.

### 2. Rojo, verde y sondas (Jest enfocado, `bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --json`)

El paso de cada fallo sale de la línea del stack que llama al test:
L734 = 1c, L736 = 1d y L759 = 2d.

| Id | Mutación | exit | Resultado |
|---|---|---|---|
| base | HEAD `916b7f63` | 0 | 39/39 |
| **X11** (= rojo `21ff2000`) | reset `10080` en fecha y hora. Tras aplicarla, `git diff --exit-code 21ff2000 -- …/add-reminder/` → 0 | 1 | 37 verdes. Rojos por aserción: 1.º `it` en **c** y 2.º `it` en **d**, como dice E1 |
| **X10** | reset solo en fecha | 1 | 37 verdes. Rojos: 1.º en c y 2.º en d (**H1 cerrado**) |
| reset solo en hora | reset solo en hora | 1 | 37 verdes. Rojos: 1.º en d y 2.º en d |
| **X1** | todos desactivados → `?? 10080` | 1 | 38 verdes. Rojo: 2.º en d (**H2 cerrado**) |
| Y1 | todos desactivados → `?? 0` | 1 | Rojos: 2.º en d y la fila 7 de R3 |
| Y2 | variante «pegajosa» en los dos pickers (la preferencia pasa a la efectiva) | 1 | Rojos: 2.º en d, secuencia de R3 y #123 R4 |
| Y3 | reset a `10080` **solo si** la elección quedó en el pasado, en los dos pickers | 1 | 38 verdes. Rojo: **solo** el 2.º `it` de R6 en d. La secuencia de R3 no la veía; R6 la cierra |
| **Y4** | reset a `10080` **solo si la fecha nueva es posterior** a la anterior | 0 | **verde 39/39** (H9) |
| **Y5** | reset a `10080` en `onDismiss` de los dos pickers | 0 | **verde 39/39** (H10) |

Las cuatro sondas de la spec (X11, X10, X1 y reset solo en hora) dan el rojo
en el paso que dice E1 y coinciden fila a fila con el reporte de Codex.

### 3. Recuentos y el +3 de la suite móvil

- El log del leader
  (`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f4719a40-0501-4a5f-80e7-b8287f1de20f/scratchpad/init-125-review2.log`,
  modificado a las 16:14Z, después del commit del tip a las 16:03Z) termina en
  `EXIT 0`, sin pipe. Recuentos: backend unit 171/1307, infra 2/14, móvil
  **83/1508** y e2e 27 + 3 omitidas (389 + 8 omitidos). Backend, infra y e2e
  son idénticos a la ronda 1.
- 1508 = 1503 + 3 + 2. El +3 lo medí así: corrí Jest sobre
  `src/app/(tabs)/__tests__/food.test.tsx` y `src/screens/home/index.test.tsx`
  con las versiones de `5134d165` (antes del merge `d3d6c9b3`) y con las de
  HEAD. Pasa de 195 a 198: food de 55 a 56 y home de 140 a 142, exit 0 en los
  dos. Son los tres `it('#122 R2: … opacidad 0.8 …')`. Los otros tres cambios
  de ese diff son renombres. `git diff --stat 97054568 HEAD` sobre
  `mobile-pet-tracker`, `backend-pet-tracker` e `infra` solo toca esos dos
  ficheros y `add-reminder/index.test.tsx`. La explicación del leader y la de
  Codex se sostienen.
- En HEAD: `bun run typecheck` → exit 0 y `bun run lint` → exit 0. El fichero
  pasa 39/39 (exit 0) con `TZ=` America/Mexico_City, Pacific/Auckland (cambio
  de horario el 27 de septiembre), Australia/Sydney (el 4 de octubre),
  Pacific/Kiritimati y America/Adak.

### 4. Alcance

La ronda 2 (`e82fbc12..HEAD`) toca solo tres ficheros:
`mobile-pet-tracker/src/screens/add-reminder/index.test.tsx` (+44),
`progress/impl_reminder-advance-already-past.md` (+18) y
`specs/reminder-advance-already-past/traceability.md` (1 línea). La mutación
de `index.tsx` se anula entre el rojo y el verde (+2/−2).

### Observaciones ronda 2

Ningún hallazgo bloquea. H1 y H2 de la ronda 1 quedan **cerrados**.

- **H8 (baja, de cierre, para el leader).** En `traceability.md` la fila R5
  sigue en «pendiente (casilla de [[requirements]] §Prueba de humo)», pero esa
  casilla ya está marcada por el humano en `07905716` (2026-09-25, CPH2709).
  Hay que reflejarlo antes de la PR/done. El preámbulo de ese mismo fichero
  también se quedó atrás respecto de E1. Sigue diciendo «ninguna fila lleva
  mutación versionada», cuando R6 lleva X11. Sus recuentos siguen siendo los de
  R1-R4: add-reminder 37 y móvil 1503, cuando ahora son 39 y 1508.
- **H9 (info, fuera del texto literal de E1).** Y4 sobrevive: «resetear a 7
  días solo cuando la fecha nueva es posterior a la anterior». Todos los
  cambios de fecha después de una elección explícita (R6 1.º c, R6 2.º c y la
  secuencia de R3) llevan la fecha **hacia atrás**. Con la hora no pasa: R6
  cubre las dos direcciones (1.º d: 9→10; 2.º d: 9→8). El código de hoy no
  tiene ese defecto. Cerrarlo exigiría otra enmienda, por ejemplo un paso que
  mueva la fecha hacia adelante con 1440 elegido y 10080 activo. No lo pido.
- **H10 (info, fuera del WHEN de R6).** Y5 sobrevive: si se cierra un picker
  sin elegir nada, la elección se resetea a 7 días. R6 habla de *cambiar*
  fecha u hora, y descartar el diálogo no cambia nada. Los dos tests que
  disparan `onDismiss` (R8 y #123 R5) no hacen antes una elección explícita.
  Solo importaría si el `DateTimePicker` de `@expo/ui` en Android llamara a
  `onDismiss` también después de una selección. El smoke de R5 en CPH2709 no
  lo sugiere.

### Comandos (exit medido sin pipe)

```
git rev-parse HEAD                                              → 916b7f63… (inicio y fin)
git diff aedb89be HEAD -- specs/reminder-advance-already-past/  → solo fila R6; exit 0
git diff b10b7f1e HEAD -- …/add-reminder/index.tsx              → vacío; exit 0
git diff 97054568 HEAD -- backend-pet-tracker                   → vacío; exit 0
git merge-base --is-ancestor <10 hashes de traceability> HEAD   → exit 0 ×10
git merge-base --is-ancestor 07905716 aedb89be                  → exit 0
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx → 39/39, exit 0 (y exit 1 con X11, X10, reset en hora, X1, Y1, Y2 y Y3; exit 0 con Y4 y Y5)
bunx jest --runTestsByPath food.test.tsx home/index.test.tsx    → 195 (5134d165) / 198 (HEAD), exit 0
bun run typecheck                                               → exit 0
bun run lint                                                    → exit 0
TZ=<5 zonas> bunx jest --runTestsByPath …/add-reminder/index.test.tsx → 39/39, exit 0 ×5
```
