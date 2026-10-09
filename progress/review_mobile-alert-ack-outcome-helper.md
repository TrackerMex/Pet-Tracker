# review: mobile-alert-ack-outcome-helper (#134)
Fecha: 2026-10-09
HEAD revisado: `b276727e` (H0 `4d87eb8f`, firma de spec `851d8685`)
Veredicto: RECHAZADO

Motivo en una línea: la cláusula de R4 «SHALL esperar (`await`) a `signOut()`»
no tiene candado en la rama que resuelve. Una mutación que quita el `await` y
conserva el manejo del rechazo pasa en verde las tres suites que la miran
(helper 15/15, centro 41/41, detalle 26/26). Ver E1.

El código de producción es correcto y sigue el diseño al pie de la letra. El
rechazo es por un candado que falta. Ese candado viene de la lista de tests que
prescribe la spec (`tasks.md` §R4), no de una desviación de Codex, así que el
arreglo pasa por una enmienda de la spec.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: solo #134)
- [x] progress/current.md actualizado (entrada «#134 … Frontend [3619ed], 2026-10-09»)

## Checklist C3 — Arquitectura
- [x] El helper (`src/utils/alert-ack-outcome.ts`) solo tiene 3 `import type` (AckAlertState, Alert, TranslationKey) y no toca React, Query ni la red
- [x] Las pantallas dependen del helper por import nombrado desde `'../../utils/alert-ack-outcome'`
- [x] Sin lógica de negocio fuera de su sitio. La clasificación vive solo en el helper (R6 = 0/0/0/1/1 en las dos pantallas)
- [x] Sin casts, `@ts-`, `eslint-disable` ni `import * as` en las líneas añadidas

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra (`#134 R1` … `#134 R7` en los describes; los 12 `#134` de `src/` van seguidos de ` R<n>`)
- [x] Los 14 commits TDD están en orden rojo→verde, con R1–R7 en pares y el rojo siempre antes que su verde
- [x] Cada rojo falla por aserción (impl §R1–§R7). C2 y D1 fallan con el error del matcher sobre `null` («received value must be a host instance»), que es el rojo que prescribe `tasks.md`. No hay TypeError, ReferenceError ni `Unable to find`
- [x] Las mutaciones M1–M4 se revierten en su verde. `git diff --quiet 4d87eb8f 55ed823d -- …/alerts/index.tsx` da exit=0, el mismo diff contra `bd912c99` en las dos pantallas da exit=0, y `cd514792..168f0479` sobre el helper y las pantallas da exit=0
- [ ] **Cada cláusula EARS tiene su candado: falla en R4 (E1)**

## Checklist C5 — Trazabilidad
- [x] traceability.md no tiene filas «pendiente». La única coincidencia es la línea «Regla:»
- [x] Los 14 hashes existen, son ancestros de HEAD y su mensaje coincide con `git log`
- [x] Los commits siguen el formato `<tipo>(mobile-alert-ack-outcome-helper): <desc> (R<n>)`, con los mensajes literales de `tasks.md`

## Checklist C6 — Spec aprobada
- [x] requirements.md tiene `status: approved` y la casilla humana marcada (2026-10-09, vía Notion, Q1–Q5 = recomendación). Firma `851d8685`

## Checklist C7 — Sin código huérfano
- [x] El `switch` de las dos pantallas y su `catch` se borraron. No quedan `case '`, `catch` ni `signOut(` en las pantallas
- [x] Las filas que salen de `R12_ALERTS`/`R13_ALERT_DETAIL` se borraron (centro −3, detalle −3; helper +3)
- [ ] N/A

## Checklist C8 — Carta UI (toca mobile-pet-tracker/)
- [x] Grep limpio en el diff: cero hex fuera de theme (todo `#134` va seguido de ` R<n>`), cero `-[`, cero `StyleSheet`, cero `queryKey: [`
- [x] Dimensiones, Skeleton, componentes compartidos, tappables y animaciones: N/A (refactor sin UI)

## Lista cerrada y diffs de cierre
- [x] `git diff --name-only 4d87eb8f HEAD` da exactamente los 11 ficheros del handoff
- [x] `numstat` de las dos suites de pantalla: `29 0` (alerts) y `17 0` (alert-detail), con 0 borrados
- [x] `src/i18n/catalog.ts` y `src/providers/__tests__/language-provider.test.tsx` no tienen diff (exit=0). La ruta existe, como fija el override del handoff
- [x] `package.json`, `bun.lock`, `app.json`, `src/theme`, `src/api`, `backend-pet-tracker/`, `infra/` y `docs/` no tienen diff
- [x] Los commits de docs solo tocan `progress/impl_…` y `traceability.md`. No hay código tras `168f0479` (`git diff --quiet 168f0479 HEAD -- mobile-pet-tracker` da exit=0)

## Cobertura R1–R7 (lectura de los tests)
- R1: C1 (rechazo) y C2 (`signOut` rechaza) están anidados al final de `#78 R8`. Esperan al árbol (`queryByTestId(...)` dentro de `waitFor` con el literal completo) y aseveran `mockSignOut` después. Usan `mockRejectedValueOnce`. Las 7 ramas restantes tienen candado existente (tabla de la spec). ✔
- R2: D1 sigue el mismo patrón. Las 8 ramas restantes tienen candado existente; el catch es la fila `'rejected'`. ✔
- R3: los 3 its cierran las cuatro funciones de efecto. `ok` usa `toBe(next)`; `already-closed` usa `toHaveBeenCalledWith` + `not.toBe(alert)` + `alert.status === 'open'`; `not-found` usa `toHaveBeenCalledWith()`. ✔
- R4: las 7 filas (unreachable ×2, unauthorized ×1, error ×2, missing-config ×2) usan literales escritos; `t` del doble traduce con `en`/`es` y la expectativa es literal, así que no es tautológico. unreachable aserta además `not.toHaveBeenCalledWith('network down')`. **La subcláusula `await signOut()` no tiene candado (E1).**
- R5: rechazo en/es, lanzamiento síncrono es, `signOut` rechaza en/es. Las tres condiciones tienen candado (P1, P2b y P9 lo demuestran). ✔
- R6: el it.each de dos pantallas hace un solo `toEqual` del objeto de cuentas. Mapas, filas, predicado, `11 - 3` y `SCREEN_FILES +1` coinciden con `design.md` §5. ✔
- R7: un it recorre los 3 ficheros con `toEqual({ file, refs: [] })`. P7 (referencia en una pantalla) lo pone rojo. ✔
- Código: la firma y los nombres de `design.md` §2 coinciden literalmente. `request` es un thunk dentro del `try`, el `case` doble es único y el `catch` va sin variable. Cuentas del helper: 7 `case '`, 1 `signOut(`, 1 `cannotReachServer` y 2 `somethingWentWrong`. Cada pantalla conserva su guard (`ackingIdRef`/`ackingRef`), su `setActionError(null)` y su `finally`; `onNotFound` del detalle conserva el bloque de `leavingRef`.

## Sondas de mutación
Cada sonda se plantó en el árbol y se corrió fichero a fichero con
`FORCE_COLOR=0 bunx jest <f>` desde `mobile-pet-tracker/`, sin pipe. Después se
restauró con `git checkout HEAD -- <f>` y se comprobó
`git diff --quiet && git diff --cached --quiet` (todas dieron «tree clean»).
Salidas en `/tmp/134-rev-<id>-*.txt`. No se commiteó nada.

| Id | Mutación (fichero) | Suite → resultado | Test que cae | Tipo de rojo |
|---|---|---|---|---|
| P1 | el helper relanza tras `showError` en el `catch` | helper: 5 rojos | R5 ×5 | aserción (`Received promise rejected instead of resolved`) |
| P2 | intercambia `cannotReachServer`/`somethingWentWrong` en unreachable y en error/missing-config (helper) | helper: 6 rojos; detalle: 3 rojos | R4 unreachable/error/missing-config en+es; `#100 R5` it.each «muestra el error de $kind» | aserción (`toHaveBeenCalledWith`, `toHaveTextContent`) |
| P2b | el `catch` usa `cannotReachServer` (helper) | helper: 5 rojos; centro: 2 rojos | R5 ×5; C1 y C2 | aserción |
| P3 | `await signOut()` → `void signOut()` (helper) | helper: **el proceso de jest muere** por un rechazo no manejado (`Error: sign-out failed`, exit=1, sin línea `Tests:`); centro: 1 rojo | C2 | helper: crash, no aserción; centro: aserción (matcher sobre `null`) |
| **P3c** | `await signOut()` → `void signOut().catch(() => showError(t('common.somethingWentWrong')))` (helper) | **centro: 41/41 verde** | — | **sobrevive** |
| P3b | la misma de P3c | **helper: 15/15 verde**; detalle: 1 rojo | `#100 R5` «cierra sesión una vez si el ack responde unauthorized» | rojo accidental: el `mockSignOut` del detalle devuelve `undefined` sin `mockResolvedValue`, `.catch` sobre `undefined` lanza y el helper pinta el error. No mide la espera |
| **P3d** | `await signOut()` → `void Promise.resolve(signOut()).catch(() => showError(t('common.somethingWentWrong')))` (helper) | **helper: 15/15 verde; detalle: 26/26 verde** | — | **sobrevive** |
| P4 | `already-closed` pasa `alert` sin copiar ni cerrar (helper) | helper: 1 rojo; centro: 1 rojo | R3 already-closed; `#78 R8` «convierte already-closed en la píldora resuelta» | helper: aserción; centro: consulta (`Unable to find … alert-row-alert-1-status`, test existente) |
| P5 | `error` llama `onNotFound()` (helper) | helper: 2 rojos | R4 error en/es | aserción (`toHaveBeenCalledTimes`) |
| P6 | el detalle llama `router.dismissTo('/alerts')` dos veces en `onNotFound` | detalle: 1 rojo | `#100 R5` «sale una sola vez si el servidor responde not-found» | aserción (`toHaveBeenCalledTimes`) |
| P7 | `// alertKeys.list()` en `src/screens/alert-detail/index.tsx` | design-drift: 1 rojo | `#134 R7` | aserción (`toEqual`) |
| P8 | el centro guarda `alert` en vez de `next` en `onAcked` | centro: 7 rojos | `#78 R7`, `#78 R8` ×4, `#97 R6`, `#97 R8` | consulta (`Unable to find`) en tests existentes |
| P9 | `request()` se llama fuera del `try` (helper) | helper: 1 rojo | R5 «la petición lanza de forma síncrona, es» | aserción (`Received promise rejected`) |
| P10 | `onNotFound` del centro pinta `cannotReachServer` | centro: 2 rojos | `#78 R8` «mantiene la fila en not-found…» y «traduce unreachable…» | aserción + consulta (el segundo rojo es de un test existente; causa no investigada) |
| **P11** | el detalle pasa `t: (key) => es[key]` (con `import { es }`) en lugar del `t` de `useTranslate()` | **detalle 26/26, ui-language 30/30, design-drift 65/65: verde** | — | **sobrevive** |

## Observaciones (por severidad)

### E1 — BLOQUEANTE: R4 «SHALL esperar (`await`) a `signOut()`» no tiene candado en la rama que resuelve
- **Cláusula:** `requirements.md` R4, segunda viñeta: «WHEN resuelve `{ kind: 'unauthorized' }`, THE SYSTEM SHALL esperar (`await`) a `signOut()`, llamarlo una vez…». Q1 justifica C2, D1 y R5 porque «el refactor mueve justo ese `await` al helper».
- **Evidencia:** P3c y P3d quitan el `await` y conservan el manejo del rechazo. Pasan en verde `src/utils/alert-ack-outcome.test.ts` (15/15), `src/screens/alerts/index.test.tsx` (41/41) y `src/screens/alert-detail/index.test.tsx` (26/26). P3b solo cae en el detalle por accidente: su `mockSignOut` no devuelve promesa.
- **Por qué no lo ve ningún test:** el it `#134 R4 › unauthorized` usa un `signOut` que resuelve al instante, así que solo cuenta llamadas. Los its `signOut rechaza tras unauthorized` (R5, C2, D1) solo ven que el error llega a pintarse; con el rechazo ya creado, la microtarea del `.catch` corre antes de que se resuelva la promesa del helper. Ninguno observa que `settleAlertAck` sigue pendiente mientras `signOut` no termina.
- **Conducta que se pierde:** en la base, el `finally` de cada pantalla (que libera `ackingIdRef`/`ackingRef` y `setAckingId(null)`/`setAcking(false)`) corría después de que `signOut` terminara. Con P3d corre mientras `signOut` sigue en vuelo, y el botón vuelve a quedar habilitado durante el cierre de sesión. Es justo el cambio de conducta que la feature promete no hacer.
- **Qué falta:** un candado de verificación (nace verde y se cierra con una mutación como P3d) que, con un `signOut` diferido (una promesa que el test resuelve a mano), asevere que la promesa de `settleAlertAck` no ha resuelto mientras `signOut` está pendiente y sí resuelve cuando `signOut` termina. Al ser una fila nueva de R4, cambia los recuentos de la spec (helper 15→16; total +22). Requiere enmienda de `requirements.md` R4, `tasks.md` §R4 y la tabla de la base, más la mutación de cierre (P3d sirve).

### E2 — MEDIA (no bloquea por sí sola; conviene cerrarla en la misma enmienda): el `t` que cada pantalla entrega al helper no tiene candado
- **Evidencia:** P11 (el detalle pasa un `t` fijado a `es`) pasa en verde el detalle, `ui-language` y `design-drift`. Lo mismo vale para el centro por construcción.
- **Por qué es nuevo de #134:** antes del refactor la pantalla llamaba `t('common.cannotReachServer')`/`t('common.somethingWentWrong')` ella misma, y `checkUses` (#78 R12 / #100 R10) contaba esas llamadas. Cambiarlas por `es[...]` ponía el inventario rojo. Ahora las llamadas están en el helper y la pantalla solo pasa `t` como handler, y nada comprueba que sea el de `useTranslate()`. Las suites de pantalla solo ejercitan el ack en `es`.
- **Alcance:** R1/R2 de la spec solo piden los literales en `es`, así que no viola una cláusula escrita. Sí abre una zona ciega en «sin cambio de conducta» para el usuario en inglés. Opciones de candado para el spec_author: una fila en inglés por pantalla para una rama de error del ack (el detalle ya admite `renderDetail(id, 'en')`), o una cuenta estática del atajo `t,` / ausencia de import de `en`/`es` del catálogo en las dos pantallas dentro de `#134 R6`.

### O1 — Informativa
- P3 (`void signOut()` a secas) sí se detecta, pero en la suite del helper **mata el proceso de jest** por un rechazo no manejado (`Error: sign-out failed`, exit=1, sin línea `Tests:`). No es un rojo por aserción. En el centro C2 lo caza por aserción. El candado de E1 también lo convertiría en rojo por aserción en el helper.

### O2 — Informativa
- P4, P8 y P10 caen en tests **existentes** por consulta (`Unable to find`). No son tests de #134 y no se exige cambiarlos.

### O3 — Informativa
- `traceability.md` conserva `status: draft` en su frontmatter. El handoff prohibía tocarlo; lo cierra el leader.

### O4 — Informativa
- `mockAckAlert.mockResolvedValue({ kind: 'unauthorized' })` sin `Once` en C2/D1 viene literal de `tasks.md`. El `beforeEach` de cada bloque lo reescribe, así que no hay fuga. La regla `…Once` se cumple en todos los rechazos nuevos.

### O5 — Informativa
- El log de init.sh muestra, en la parte móvil, «A worker process has failed to exit gracefully». Es un aviso de jest con exit 0; no se atribuye a #134.

## Output de ./init.sh
No lo corrió el reviewer: el clasificador deniega init.sh a los subagentes y comparte Postgres/LocalStack. Lo corrió el leader en HEAD `b276727e`; el reviewer confirmó que `git rev-parse --short HEAD` = `b276727e` y leyó el log
(`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/885d433f-79bc-4751-b859-1a429a236f6e/scratchpad/init_134.txt`):

```
Test Suites: 187 passed, 187 total        (backend unit)
Tests:       1474 passed, 1474 total
...
PASS src/screens/alerts/index.test.tsx
PASS src/screens/alert-detail/index.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/utils/alert-ack-outcome.test.ts
Test Suites: 98 passed, 98 total          (móvil)
Tests:       2386 passed, 2386 total
✅ Tests pasados
$ expo lint
✅ Lint sin errores
$ tsc --noEmit
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
Móvil 98/2386 = base 97/2365 (impl §Base) + 1 suite + 21 tests, que es el delta de la spec. El rechazo no viene del gate: init.sh está verde. Viene de E1.

## Barrido exhaustivo (ronda 1)

Pedido por el leader tras aceptar E1 y E2, para que una sola enmienda cierre
todas las zonas ciegas. Las condiciones son las de las sondas anteriores:
- mismo árbol, HEAD `b276727e`;
- cada sonda se corrió fichero a fichero con `FORCE_COLOR=0 bunx jest <f>` desde `mobile-pet-tracker/`, sin pipe;
- después se restauró con `git checkout HEAD -- <f>` y se comprobó `git diff --quiet && git diff --cached --quiet`. Las 30 sondas dieron «tree clean»;
- no se commiteó nada ni se corrió init.sh;
- salidas en `/tmp/134-rev-<id>-<ruta>.txt`.

Alcance: cada cláusula de `requirements.md` R1–R7 y de `design.md` §2/§3
(tabla de handlers, «conserva su guard, su `setActionError(null)` y su
`try … finally`»).

### Sondas de la ronda

| Id | Mutación (fichero) | Suite: resultado | Test que cae | Tipo |
|---|---|---|---|---|
| P12 | centro: `await settleAlertAck(` → `void settleAlertAck(` | centro: 2 rojos | `#78 R8` «deshabilita durante el vuelo y corta dos pulsaciones seguidas (#72 R2)»; `#97 R5` «mantiene bloqueado el ack que sigue en vuelo» | aserción (`toBeDisabled`) |
| P13 | detalle: la misma mutación | detalle: 1 rojo | `#100 R5` «bloquea la segunda pulsación mientras el ack está en vuelo» | aserción (`toHaveBeenCalledTimes`: 2 en vez de 1) |
| **P14** | centro: `t,` → `t: (key) => es[key],` (+ `import { es }` del catálogo) | **centro 41/41, ui-language 30/30, design-drift 65/65: verde** | — | **sobrevive** (versión centro de P11) |
| P15a | helper: `ok` llama `onAcked` dos veces | helper: 1 rojo | R3 «ok entrega el Alert devuelto sin copiarlo» | aserción |
| P15b | helper: `ok` llama además `showError(t('common.somethingWentWrong'))` | helper: 1 rojo | R3 ok | aserción |
| P15c | helper: `already-closed` llama `onAcked` dos veces | helper: 1 rojo | R3 already-closed | aserción |
| P15d | helper: `not-found` llama además `showError` | helper: 1 rojo | R3 not-found | aserción |
| P15e | helper: `unauthorized` hace `await signOut()` dos veces | helper: 1 rojo | R4 unauthorized | aserción |
| P15f | helper: `unreachable` llama `showError` dos veces | helper: 2 rojos | R4 unreachable en/es | aserción |
| P15g | helper: el `catch` llama `showError` dos veces | helper: 5 rojos | R5 ×5 | aserción |
| P15h | helper: `error`/`missing-config` llaman además `onNotFound()` | helper: 4 rojos | R4 error en/es, missing-config en/es | aserción |
| P16a | centro: quita `setActionError(null)` de `handleAck` | centro: 1 rojo | `#78 R8` «mantiene la fila en not-found, muestra el error y lo limpia al reintentar» | aserción (`toBeNull`) |
| **P16b** | detalle: quita `setActionError(null)` de `handleAck` | **detalle 26/26 verde** | — | **sobrevive** |
| **P17** | centro: quita el guard `if (ackingIdRef.current !== null) return;` | **centro 41/41 verde** | — | **sobrevive** |
| **P18** | detalle: quita `\|\| ackingRef.current` del guard | **detalle 26/26 verde** | — | **sobrevive** |
| P19a | centro: quita `ackingIdRef.current = null;` del `finally` | centro: 2 rojos | `#78 R8` not-found…reintentar; «traduce unreachable…» | consulta (`Unable to find … alerts-action-error`) |
| P19b | centro: quita `setAckingId(null);` del `finally` | centro: 3 rojos | `#78 R8` unauthorized (#72 R2), not-found…reintentar, unreachable | consulta |
| **P20a** | detalle: quita `ackingRef.current = false;` del `finally` | **detalle 26/26 verde** | — | **sobrevive** |
| **P20b** | detalle: quita `setAcking(false);` del `finally` | **detalle 26/26 verde** | — | **sobrevive** |
| P21 | centro: `token ?? ''` → `''` en el thunk | centro: 1 rojo | `#78 R8` «aplica el Alert devuelto por ok y quita el botón» | aserción |
| P22 | detalle: la misma mutación | detalle: 1 rojo | `#100 R5` «marca leída una vez y retira el botón» | aserción |
| **P24** | detalle: `onNotFound` deja de poner `leavingRef.current = true` | **detalle 26/26 verde** | — | **sobrevive** |
| **P25** | detalle: `onNotFound` ignora `leavingRef` (`if (true)`) | **detalle 26/26 verde** | — | **sobrevive** |
| P26 | helper: llama `request()` dos veces | helper 15/15 verde; centro: 2 rojos; detalle: 1 rojo | centro `#100 R6` «conserva Marcar leída sin navegar al pulsarlo» (aserción) y `#78 R8` not-found…reintentar (consulta); detalle «marca leída una vez y retira el botón» (aserción) | muerta en las pantallas (ver nota 1) |
| P28a | helper: comentario `// queryClient` | design-drift: 1 rojo | `#134 R7` | aserción |
| P28b | centro: comentario `// setQueryData` | design-drift: 1 rojo | `#134 R7` | aserción |
| P30 | helper: `already-closed` muta `alert.status` y pasa `{ ...alert }` | helper: 1 rojo | R3 already-closed | aserción |
| P33 | detalle: `onAcked: () => setAcked(alert)` | detalle: 2 rojos | «marca leída una vez y retira el botón»; «muestra Resuelta si el servidor responde already-closed» | aserción |
| P34a | centro: `signOut` → `async () => {}` | centro: 2 rojos | C2; `#78 R8` unauthorized (#72 R2) | aserción |
| P34b | detalle: la misma mutación | detalle: 2 rojos | D1; «cierra sesión una vez si el ack responde unauthorized» | aserción |

**Resultado: 30 sondas, 8 sobreviven** (P14, P16b, P17, P18, P20a, P20b,
P24, P25). A estas se suman las ya informadas en el veredicto: P3c/P3d (E1) y P11 (E2).

Nota 1, P26: R3–R5 no tienen cláusula «llamar `request` una vez» en el
helper. Las pantallas ya la cierran, así que no es una zona ciega de una
cláusula escrita.

### Origen de cada superviviente

`git diff -U0 4d87eb8f HEAD` sobre las dos pantallas solo muestra, de las
líneas sondeadas, los `return;` del `switch` borrado. Las líneas del guard,
del `finally`, de `setActionError(null)` y del bloque `leavingRef`/`dismissTo`
**no cambian en #134**.

Los tests de la base son un subconjunto de los de HEAD: numstat da 0 borrados
y C1/C2/D1 solo cubren rechazos. Por eso esas mutaciones también sobrevivían
en la base. Es una deducción: no se midió en H0, porque el árbol tenía que
quedarse en HEAD.

| Superviviente | Cláusula | Origen |
|---|---|---|
| P3c/P3d (E1) | R4 «esperar (`await`) a `signOut()`» | **nueva de #134**: el `await` se movió al helper |
| P11 + P14 (E2) | `design.md` §3, fila `t`: «`t` de `useTranslate()`» en las dos pantallas | **nueva de #134**: antes `checkUses` contaba los `t('…')` de la pantalla |
| P16b, P20a, P20b | `design.md` §3: el detalle «conserva su `setActionError(null)` y su `finally`» | **preexistente**: ningún test del detalle reintenta tras un error |
| P17, P18 | `design.md` §3: cada pantalla «conserva su guard» | **preexistente**: el botón queda deshabilitado tras el primer render, así que RNTL nunca llega al guard por ref |
| P24, P25 | R2, fila not-found: «`router.dismissTo('/alerts')` una sola vez», frente a la carrera con el `useEffect` que también sale cuando la lista pierde la alerta | **preexistente**: ningún test hace que la lista pierda la alerta alrededor de un ack not-found |

Decide el leader si las preexistentes entran en esta enmienda o se registran
como deuda. Si van a deuda, los límites son exactamente las líneas y escenarios
de esta tabla, sin ampliar.

### Candados propuestos (ensanchados a su cláusula entera)

Recuentos de partida en HEAD: helper 15, centro 41, detalle 26, móvil 98
suites / 2386 tests.

**Restricción transversal:** el candado de R1/R2 exige **0 borrados** en
`git diff --numstat <H0>` de las dos suites de pantalla. Todo lo que sigue
tiene que ser adición pura. En concreto, el wrapper en inglés del centro debe
ser una función **nueva**: no se puede parametrizar `AlertsWrapper` ni
`renderAlerts`, que fijan `initial="es"`. Esperas sobre el árbol
(conventions §Esperas), sin esperar a contadores de mock.

**L1 — E1, R4/R5, helper.** Dos ramas de la misma espera: `signOut` resuelve y `signOut` rechaza.
- Test `#134 R4` «unauthorized espera a signOut antes de resolver» en `src/utils/alert-ack-outcome.test.ts`:
  - `signOut` devuelve una promesa diferida que el test resuelve a mano;
  - tras vaciar microtareas y ver `signOut` llamado una vez, la promesa de `settleAlertAck` sigue sin asentarse;
  - tras resolver `signOut`, resuelve a `undefined`, con las cuatro funciones de efecto aseveradas.
- Test `#134 R5` «signOut rechaza tras unauthorized: no resuelve antes del rechazo, es», en el mismo fichero:
  - con `signOut` pendiente, la promesa no se ha asentado y `showError` no se ha llamado;
  - tras el rechazo, `showError` se llama una vez con `'Algo salió mal'` y la promesa resuelve a `undefined`.
- Tipo: verificación. Las dos nacen verdes y se cierran con P3d.
- Idioma: el idioma del texto ya lo cierran los 5 its de R5; la espera no depende del idioma.
- Delta: helper 15 → **17** (R4 7 → 8, R5 5 → 6).

**L2 — E2, `design.md` §3 fila `t`, las dos pantallas × las dos claves que traduce el helper × en.** Los its en `es` de cada clave ya existen en las dos pantallas; falta `en`.
- Centro, en el describe anidado `#134 R1` de `src/screens/alerts/index.test.tsx`:
  - «muestra Cannot reach server en inglés si ackAlert responde unreachable»;
  - «muestra Something went wrong en inglés si ackAlert responde error».
  - Literal completo con `toHaveTextContent` sobre `alerts-action-error`.
- Detalle, en `#134 R2` de `src/screens/alert-detail/index.test.tsx` (con `renderDetail(id, 'en')`), los mismos dos its sobre `alert-detail-action-error`.
- Tipo: caracterización (verde en la base y en HEAD). P14 cierra el centro y P11 el detalle.
- Cada it se cierra además con una sonda que fije **una sola** clave (por ejemplo `t: (k) => k === 'common.cannotReachServer' ? es[k] : t(k)` y su simétrica), para que sea un candado por clave y no uno compartido.
- Delta: centro 41 → **43**, detalle 26 → **28**.
- Hay que enmendar las tablas de R1/R2 con las filas `unreachable (en)` y `error (en)`.

**L3 — P16b + P20a + P20b, `design.md` §3 «conserva `setActionError(null)` y su `finally`», detalle.** El centro ya lo tiene cerrado: P16a, P19a y P19b caen en «…lo limpia al reintentar».
- Test `#134 R2` «reintenta tras unreachable: rehabilita el botón, limpia el error y vuelve a pedir» en `src/screens/alert-detail/index.test.tsx`:
  1. El primer `ackAlert` resuelve `unreachable` (`mockResolvedValueOnce`) y el segundo queda diferido.
  2. Esperar el texto `No se pudo conectar con el servidor`.
  3. Esperar `alert-detail-ack` habilitado. Esto cierra P20b.
  4. Pulsar otra vez y esperar `alert-detail-ack` deshabilitado. Esto cierra P20a: con el ref atascado, la segunda pulsación sale por el guard y el botón no vuelve a deshabilitarse.
  5. Esperar `queryByTestId('alert-detail-action-error')` en `null`. Esto cierra P16b.
  6. Aseverar después `mockAckAlert` llamado 2 veces.
  7. Resolver el diferido con `ok` para limpiar.
- Las tres mutaciones son independientes del `kind`, porque viven fuera del `switch`, así que una rama representativa basta.
- Tipo: caracterización, cerrada por tres sondas, cada una roja en una aserción distinta.
- Delta: detalle **+1**.

**L4 — P17 + P18, `design.md` §3 «conserva su guard», las dos pantallas.**
- Test `#134 R1` «corta dos pulsaciones en el mismo frame» (centro) y `#134 R2` con el mismo nombre (detalle):
  - el primer `ackAlert` queda diferido;
  - dos pulsaciones del botón de ack **dentro de un único `act`**, para que la segunda llegue al handler antes del re-render que deshabilita el botón;
  - esperar el botón deshabilitado y aseverar `mockAckAlert` llamado 1 vez.
- Tipo: verificación. Nace verde y se cierra con P17 y con P18.
- **Sin spike:** no está comprobado que, en RNTL 14, dos `fireEvent.press` dentro de un `act` (o dos llamadas directas a `props.onPress`) lleguen al handler sin re-render intermedio. El spec_author debe hacer el spike fuera del árbol antes de prescribirlo.
- Delta: centro **+1**, detalle **+1**.

**L5 — P24 + P25, R2 fila not-found «una sola vez», detalle.** Un candado por orden de la carrera.
- Test `#134 R2` «not-found y la lista pierde la alerta después: sale una sola vez». Primero el ack responde `not-found`; después la lista se refresca sin la alerta. `router.dismissTo` debe haberse llamado 1 vez. Lo cierra P24.
- Test `#134 R2` «la lista pierde la alerta con el ack en vuelo y luego responde not-found: sale una sola vez». Con el ack diferido, la lista se refresca sin la alerta (sale el `useEffect`); después el ack resuelve `not-found`. `router.dismissTo` debe haberse llamado 1 vez. Lo cierra P25.
- Tipo: verificación.
- **Sin spike:** hay que comprobar cómo forzar el refetch de la lista en la suite del detalle sin tocar líneas existentes.
- Delta: detalle **+2**.

### Resumen de deltas

| Alcance de la enmienda | helper | centro | detalle | móvil (tests) |
|---|---|---|---|---|
| Solo lo nuevo de #134 (L1 + L2) | 15 → 17 | 41 → 43 | 26 → 28 | 2386 → **2392** (+6) |
| Más lo preexistente (L3 + L4 + L5) | 17 | 43 → 44 | 28 → 32 | 2386 → **2397** (+11) |

Suites sin cambio (98).

No se espera delta en los inventarios globales: `ui-copy-table` y `SCREEN_FILES` cuentan fuente, no tests, y los literales nuevos van en tests. Aun así, el spec_author debe hacer grep de los guards de `design-drift` que escanean tests (por ejemplo `StyleSheet` y `-[`) contra el código que prescriba.
