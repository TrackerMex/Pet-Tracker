# review: mobile-reminder-date-year (#240)
Fecha: 2026-11-04
Veredicto: APROBADO (condicionado a que el `./init.sh` del leader salga 0)

> El reviewer **no** corrió `./init.sh`, ni jest, ni tsc, ni lint: la VPS está
> ocupada con el init.sh de otra feature y con otro Codex, y el leader lo
> prohibió de forma explícita. Corre `./init.sh` después de este veredicto. Si
> no sale 0 (medido sin pipe), este APROBADO **no vale** y el veredicto pasa a
> RECHAZADO. La evidencia de jest, tsc y lint de abajo viene de los logs que
> Codex dejó en disco. Los leí y cuadran con el reporte, pero no son una
> corrida independiente.

Worktree: `/home/claude/sites/Pet-Tracker-wt-240`, branch
`feature/240-mobile-reminder-date-year`. B (commit del handoff) = `3b650137`.
H0 = `d64a2b02`. HEAD = `498037f1`.

## Checklist C2 — Estado coherente
- [x] Máximo una feature `in_progress` en `feature_list.json`. En el worktree hay 0, y #240 sigue en `spec_ready`.
- [x] `progress/current.md` no describe una sesión rota. No menciona #240. El handoff prohibía a Codex tocarlo, así que el registro es cosa del leader (ver no bloqueante 1).
- [x] El reporte del implementer existe (`progress/impl_mobile-reminder-date-year.md`, sin trackear) y también el marcador `.done`.

## Checklist C3 — Arquitectura
- [x] Es un cambio de presentación en `mobile-pet-tracker/src/screens/reminders/index.tsx`. No añade imports, capas, dependencias ni copy.
- [x] domain / application / infrastructure: N/A. El backend no cambia.

## Checklist C4 — TDD
- [x] Cada R tiene su test con el R-id en el título. `index.test.tsx:2908` `#240 R1: %s` (4 filas), `:2919` `#240 R2: %s` (4), `:2931` `#240 R3: %s` (5), `:2943` `#240 R4: %s` (5) y `:2953` `#240 R5: …`. Las enmiendas están en `:633` y `:641` con `(enmendado por #240 R1)` y en `:797` con `(enmendado por #240 R5)`.
- [x] El historial va test primero. Los tres commits de test (`edb52ddd`, `9cdadea3` y `c281f522`) solo tocan `index.test.tsx`. El commit `b14c20e7` solo toca `index.tsx` y `498037f1` solo toca la trazabilidad. Los mensajes son los literales de `tasks.md`.
- [x] El rojo de `9cdadea3` (log `t1`) es `9 failed, 158 passed, 167 total`, o sea P + 5 con P = 153. Son exactamente los nueve de tasks §«R1, R2, R3 y R5» (1): R1 ×4, R3 filas 3 y 5, R5 y los dos `#178 R6` enmendados.
- [x] Los rojos fallan por su aserción. En `t1` hay 8 «Unable to find an element with text» y 1 `toHaveBeenCalledWith`. Hay 0 `Cannot find module`, `TypeError`, `SyntaxError` o testID ausente. Ningún rojo viene de un `ReferenceError` ni de una mutación de un doble.
- [x] `c281f522` (log `t_r4`) da `9 failed, 163 passed, 172 total` (P + 10), con la misma lista de nueve.
- [x] Lo que nace verde se cierra por mutación, vía (b). La spec lo declaró por escrito antes del handoff. Las sondas de los logs `s1` a `s8` dan al menos los rojos mínimos de su fila, todos por aserción:
  - S1 da 4 rojos: R3 filas 1, 3, 4 y 5. Mínimo cumplido.
  - S2 da 1 rojo: R3 fila 2. Mínimo cumplido.
  - S3 da 5 rojos: R3 filas 1 a 5. Mínimo cumplido.
  - S4 da 10 rojos: R2 ×4, R3 filas 1, 2 y 4, `#65 R15 … (enmendado por #240 R5)` y `#178 R6 … hora lejana …`. Suma un extra, `R6: lista con pills… renders summaries…`, cuya causa es la fecha del 27 ago 2026 que pasa a llevar año. Es esperable.
  - S5 da 9 rojos, el mismo conjunto que T1. Mínimo cumplido.
  - S6 da 4 rojos: R1 fila 3, R2 fila 2 y R3 filas 3 y 5. Mínimo cumplido.
  - S7 da 2 rojos: `#240 R5` y `#65 R15 …`. Mínimo cumplido.
  - S8 da 1 rojo: R4 fila 3. Mínimo cumplido.
  - Ninguna sonda quedó plantada: `git status --short -- mobile-pet-tracker specs` está vacío y el diff de producción es solo la ternaria.

## Checklist C5 — Trazabilidad
- [x] `specs/mobile-reminder-date-year/traceability.md` tiene 8 filas (R1 ×3, R2, R3, R4 y R5 ×2) y ninguna dice «pendiente».
- [x] Los hashes existen (`git cat-file -e` OK para `edb52ddd`, `9cdadea3`, `c281f522`, `b14c20e7` y `498037f1`). Los mensajes citados coinciden letra a letra con los asuntos reales.
- [x] Los commits siguen el formato: `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)`, y los de test usan `test(mobile): … (R…)`.
- [x] Nadie rebaseó tras la trazabilidad: `498037f1` es HEAD y los hashes de la tabla siguen vivos.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` lleva `status: approved` y la casilla `[X] Aprobado por humano (fecha: 2026-11-04; firma delegada del leader…)` (`requirements.md:435`). La firma es `dc626852`. La casilla G2 sigue abierta, como corresponde.
- [x] La spec no cambió tras la firma: `git log dc626852..HEAD -- specs/mobile-reminder-date-year/ specs/mobile-routine-canvas-fidelity/requirements.md` solo da `498037f1` (trazabilidad).
- [x] La sección `## Enmienda #240 — Año en la fecha de Recordatorios` existe en `specs/mobile-routine-canvas-fidelity/requirements.md:1256` y Codex no la tocó.

## Checklist C7 — Sin código huérfano
- [x] N/A. Esta feature no reemplaza ningún componente ni módulo. Solo cambia las opciones de una llamada que ya existía.

## Checklist C8 — Carta de UI (aplica, toca móvil)
- [x] Grep-clean en lo añadido: 0 hex, 0 `StyleSheet`, 0 clases arbitrarias y 0 `.only` / `.skip`. `git diff --check` sale 0.
- [x] `docs/ui-guidelines.md:366` (regla 6, las fechas siguen al idioma elegido) se cumple: se mantiene `locale` (`es-MX` / `en-US`), y R5 junto con `#65 R15` lo vigilan.
- [x] Dimensiones, Skeleton, tappables y animaciones: N/A, porque no hay layout, carga, interacción ni animación nuevos.

## Verificación del alcance y del código

- `git diff --name-only 3b650137..HEAD` lista solo `mobile-pet-tracker/src/screens/reminders/index.test.tsx`, `mobile-pet-tracker/src/screens/reminders/index.tsx` y `specs/mobile-reminder-date-year/traceability.md`. El reporte está sin trackear.
- En producción (`index.tsx:247-249`), `grep -c '^-[^-]'` da 1 y `grep -c '^+[^+]'` da 3. Es la ternaria literal de design §Decisiones técnicas: `due.getFullYear() === new Date(now).getFullYear() ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short', year: 'numeric' }`. No hay comentario, ni `#240`, ni `getUTCFullYear`. La línea `const time`, el «hasta», el JSX, los imports y la base de #239 están intactos. Las anclas «Tras el cambio» del reporte (0, 1, 1, 1, 2, 4, 2, 5, 0, 0) coinciden con la spec.
- En los tests, los 18 literales de las tablas R1 a R4 (caso, idioma, reloj, `dueAt`, `status`, sección, fila y sufijo o línea) están copiados a mano. Los comparé uno a uno con `requirements.md` y coinciden, sin espacio duro (U+00A0 y U+202F dan 0 en las líneas añadidas). Las cuatro constantes de reloj coinciden con §Convenciones.
- Las aserciones usan `toBeOnTheScreen()`. No hay `toBeVisible`, ni `toBe(nodo)`, ni `toEqual(nodo)`.
- Las esperas van a un nodo positivo: `findByTestId('reminder-row-r')`, o `findByTestId('reminders-past-toggle')` seguido de `expandPast()`. No hay espera a un contador de mock (`docs/conventions.md` §Esperas).
- La fila se busca dentro de la lista de su sección (`reminders-past-list` / `reminders-upcoming-list`). En R4 se busca dentro de `reminder-repeats-r`, que es un `View` (`index.tsx:320`), así que `within` no se salta la raíz.
- La zona se fija con `hostProcess.env.TZ = 'America/Mexico_City'` en `beforeEach` y se restaura desde `originalTimezone` en `afterEach`. El reloj se fija por caso con `jest.useFakeTimers({ now: new Date(clock) })` antes del render, y el `afterEach` hace `jest.clearAllTimers(); jest.useRealTimers();`.
- El `beforeEach` del describe nuevo replica el de `#213 R14` salvo el reloj y los recordatorios, tal como pide tasks §T1.
- `EnglishWrapper` y `renderCase` son locales del `describe` nuevo, que va al final del fichero, después del de #239.
- En R5, el espía se crea antes del render y se restaura en `finally`.
- Enmienda `#65 R15` (`index.test.tsx:779` y `:795-797`): `jest.useFakeTimers({ now: new Date(2026, 7, 24, 9, 0) })` es la primera línea del `beforeEach`, antes de `makeReminder`. El `describe` gana el `afterEach` y la aserción no cambia.
- Enmiendas `#178 R6`: `'2 ene, 09:00'` pasa a `'2 ene 2027, 09:00'` y `'20 ene, 20:05'` a `'20 ene 2027, 20:05'`, con `'3 dic, 11:30'` intacto. `grep -cF` da 2 para `(enmendado por #240 R1)` y 1 para `(enmendado por #240 R5)`.
- No hay ningún `#240` suelto: las 9 apariciones son títulos literales de la spec.
- Los imports, los `jest.mock` y los helpers no cambian. El diff no tiene hunks en la cabecera, y `ReactNode`, `AuthContextValue`, `Reminder` y los tres providers ya se importaban (`index.test.tsx:9-26`).
- Cifras de los logs de Codex:

  | Log | Tests | Encaja con el handoff |
  |---|---|---|
  | `t0` | 153 passed, 153 total | P = 153 |
  | `t_clock` | 153 passed | P, verde |
  | `t1` | 9 failed, 158 passed | P + 5 |
  | `t_r4` | 9 failed, 163 passed | P + 10 |
  | `t2` | 172 passed, 172 total | P + 19 |
  | `static` (`src/__tests__`) | 1061 passed, 1061 total, 43 suites | verde |

  Ningún log contiene «failed to run» ni SIGKILL. `/tmp/tsc-240.log` y `/tmp/lint-240.log` pesan 0 bytes, lo que encaja con tsc 0 y LINT_OK del reporte.

## Observaciones

**Bloqueantes:** ninguno, siempre que el `./init.sh` del leader salga 0.

**No bloqueantes:**
1. En el worktree, `feature_list.json` deja #240 en `spec_ready` y `progress/current.md` no menciona #240. El handoff le prohibía a Codex tocar ambos. Es registro del leader al cerrar (`in_progress` → `done` tras init.sh y merge, con G2 abierto).
2. La fila R2 de `traceability.md:19` cita `b14c20e7`, cuyo mensaje nombra `(R1, R3, R5)` y no R2. Es coherente con design §Decisiones técnicas, que dice que la línea implementa R1, R2, R3 y R5, y el mensaje es el literal de `tasks.md`. No hay que tocarlo.
3. Las filas 1, 2, 4 y 5 de R4 no tienen sonda propia: S8 solo tumba la fila 3, que es lo que exige la spec. Comparten la rama de código con el `it.each` de `#213 R14`, así que el hueco es teórico.
4. El reporte cuenta que hizo una inspección de solo lectura (`pwd && git status && git branch`) antes del comando de identidad. Es inocua.
5. `progress/impl_mobile-reminder-date-year.md` y este review están sin trackear. Que el leader decida cómo versionarlos, como hizo en #239.
6. Para el init.sh del leader: la suite de Recordatorios debe contar 172 tests. Mide el exit code sin pipe y, si sale rojo, guarda el log entero. Los flakes conocidos (`#168 R2`, `#152 R8`, `#200 R9`/`R10`) se repiten una vez antes de concluir nada.
7. G2 (smoke en dispositivo, formatos de Hermes, tema claro y oscuro) es del humano y sigue abierto, por lote al final.

## Output de ./init.sh
```
NO EJECUTADO POR EL REVIEWER (restricción explícita del leader: VPS ocupada).
Lo ejecuta el leader tras este veredicto. APROBADO condicionado a exit 0.
```
