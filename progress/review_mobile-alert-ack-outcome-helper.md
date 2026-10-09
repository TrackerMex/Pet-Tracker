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

## Pre-verificación E1

Fecha: 2026-10-09. Árbol de wt-134 en `d09716d1`. E1 está en `0ea2d86d`; `d09716d1` solo toca `progress/current.md`, y `src/` es igual a `b276727e`. Nada se commiteó y no se corrió init.sh ni la suite completa. Se usó jest fichero a fichero (`FORCE_COLOR=0 bunx jest <f>`, sin pipe), con salidas en `/tmp/134-rev-E1-*.txt`. Al terminar, `git checkout HEAD --` de los tres tests, `git diff --quiet && git diff --cached --quiet` en verde y 0 ficheros sin trackear. Este fichero es el único cambio que queda.

### 1. Tests prescritos, copiados tal cual

`deferred`, `flushPromises`, W1 y W2 se insertaron en `src/utils/alert-ack-outcome.test.ts`. `EnglishAlertsWrapper`, `renderAlertsInEnglish`, C3 y C4 se insertaron en `src/screens/alerts/index.test.tsx`, y D2 y D3 en `src/screens/alert-detail/index.test.tsx`. Cada pieza va en el sitio y con el texto que da E1.1/E1.2. W1 y W2 se escribieron paso a paso según la lista de E1.1.

| Comprobación | Resultado |
|---|---|
| helper | **17/17**, exit 0 |
| centro | **43/43**, exit 0 |
| detalle | **28/28**, exit 0 |
| los seis `it` nuevos | aparecen en verde por título en las tres salidas |
| `bun run typecheck` | exit 0 |
| `bunx expo lint --no-cache` | exit 0, sin salida |
| `git diff --numstat` | helper 68/0, centro 32/0, detalle 18/0, con **0 borrados** |
| anclas E1–E13 de `tasks.md` §Ronda 2 | las 13 dan el valor «después» declarado; E10 = 2 y E11–E13 = 0 |

Todo compila y da verde sin tocar nada.

### 2. Mutaciones de los commits rojos (con los tests puestos)

| Mut. | Suite propia | Qué cae | Línea del matcher | ui-language | design-drift | typecheck |
|---|---|---|---|---|---|---|
| M5 | helper 2 rojos / 15 verdes | solo W1 y W2 | `expect(settled).toBe(false)`: Expected `false`, Received `true` | 30/30 | 65/65 | exit 0 |
| M6 | centro 2 / 41 | solo C3 y C4 | `toHaveTextContent`: Received `No se pudo conectar con el servidor` / `Algo salió mal` | 30/30 | 65/65 | exit 0 |
| M7 | detalle 2 / 26 | solo D2 y D3 | igual que M6 | 30/30 | 65/65 | exit 0 |

El ancla de M7 (`import { useAlertsList } from '../../hooks/use-alerts-list';`) existe en el detalle (línea 10). `t,` y `signOut,` aparecen una sola vez en cada pantalla. Los tres rojos son por aserción, como declara E1.

### 3. Sondas E1-S1 a E1-S6

| Sonda | Resultado | Qué cae | Tipo |
|---|---|---|---|
| E1-S1 | helper 2/15 | W1 y W2 en `expect(settled).toBe(false)` | aserción |
| E1-S2 | helper 2/15 | W1 y W2 en `expect(settled).toBe(false)` | aserción |
| E1-S3 | centro 1/42 | solo C3 (Received `No se pudo conectar con el servidor`) | aserción |
| E1-S4 | centro 1/42 | solo C4 (Received `Algo salió mal`) | aserción |
| E1-S5 | detalle 1/27 | solo D2 | aserción |
| E1-S6 | detalle 1/27 | solo D3 | aserción |

El typecheck da exit 0 en las seis. Cada sonda cae en exactamente los `it` declarados.

### 4. Barrido de las cláusulas de E1

Con los tests de E1 puestos, cada mutación se aplicó al fuente y se revirtió:

| Id | Mutación | Resultado | Lectura |
|---|---|---|---|
| Q1 | helper: `await Promise.race([signOut(), new Promise<void>((resolve) => setTimeout(resolve, 0))]);` | helper **17/17 verde** | sobrevive (F2) |
| Q2 | helper: `await signOut();` → `return signOut();` | helper: **jest muere** (`Error: sign-out failed`, exit 1, sin línea `Tests:`) | rojo por caída, no por aserción (F1) |
| Q3 | helper: `await signOut().catch(() => undefined);` | 3 rojos: W2 y R5 «signOut rechaza tras unauthorized» en/es, en `showError` `toHaveBeenCalledTimes(1)` (Received 0) | aserción |
| Q5 | helper: `catch` de `signOut` que llama `showError` en un `setTimeout(…, 0)` (el helper resuelve antes del error) | 3 rojos: los mismos que Q3 | aserción |
| Q7 | helper: el `catch` final relanza (`} catch (error) { throw error;`) | helper: **jest muere** igual que Q2 | rojo por caída (F1) |
| K1 | centro: `t` fija `en` solo para `common.cannotReachServer` | 1 rojo: «traduce unreachable como servidor inalcanzable» | aserción |
| K2 | centro: `t` fija `en` solo para `common.somethingWentWrong` | 4 rojos: C1, C2, «traduce error…», «traduce missing-config…» | aserción |
| K3 | detalle: como K1 | 1 rojo: `it.each` «muestra el error de $kind…» (fila unreachable) | aserción |
| K4 | detalle: como K2 | 4 rojos: D1 y tres filas del `it.each` | aserción |
| Q6Ac | centro: `signOut: () => { void Promise.resolve(signOut()).catch(() => setActionError(t('common.somethingWentWrong'))); return Promise.resolve(); },` | centro 43/43 verde; ui-language 2 rojos (#65 R18, #78 R12); design-drift 2 rojos (#134 R6, #87 R19) | aserción estática |
| Q6Ad | detalle: la misma | detalle 28/28 verde; ui-language 2 rojos (#100 R10, #65 R18); design-drift 2 rojos (#134 R6, #87 R19) | aserción estática |
| Q6Bc | centro: el mismo envoltorio, sin los literales (`const run = signOut;` y `t(key)` con `const key = 'common.somethingWentWrong' as const`) | centro 43/43, ui-language 30/30, design-drift 65/65 y typecheck: **verde** | sobrevive (F3) |
| Q6Bd | detalle: la misma | detalle 28/28, ui-language 30/30, design-drift 65/65 y typecheck: **verde** | sobrevive (F3) |

El `t` de cada pantalla queda cerrado clave por clave en los dos idiomas. E1-S3 a E1-S6 cierran el sentido `es`, y K1 a K4 el sentido `en`, con los `it` en `es` que ya existían.

**F1, cambiar antes de firmar: W1 y W2 convierten en caída de jest dos rojos que hoy son por aserción.**
- **Causa.** El paso 2 de W1 (y W2 lo repite) dice `void done.then(() => { settled = true; });`, sin manejador de rechazo. Si `settleAlertAck` rechaza, la promesa derivada queda sin manejar y Node mata el proceso de jest. La pila apunta a `signOutGate.reject(new Error('sign-out failed'))` de W2, y se pierde el informe de **todos** los `it` del fichero.
- **Medido en HEAD, sin los tests de E1.**
  - Q2 da 2 rojos por aserción en R5 «signOut rechaza tras unauthorized» en/es, con «Received promise rejected instead of resolved».
  - Q7 da 5 rojos por aserción en todo R5.
  - Con E1 tal cual, las dos sondas tumban el proceso. E1 empeora candados de R5 que ya existían.
- **Cambio propuesto**, en E1.1 paso 2 de W1 (W2 lo hereda por «los pasos 1 y 2 de W1»):
  ```ts
  void done.then(
    () => {
      settled = true;
    },
    () => undefined,
  );
  ```
- **Spike medido con este cambio**, y revertido después:
  - helper 17/17;
  - M5, E1-S1 y E1-S2 siguen rojos solo en W1 y W2, en `expect(settled).toBe(false)`;
  - Q2 da rojo por aserción en W2 (`await expect(done).resolves.toBeUndefined()`, «Received promise rejected instead of resolved») y en R5 en/es;
  - Q7 da rojo por aserción en W2 y en los 5 `it` de R5;
  - typecheck y `expo lint --no-cache` dan exit 0.
- **Impacto.** No cambian las cuentas (17/43/28) ni las anclas E1–E13.

**F2, residual sin candado propuesto: Q1, una espera acotada por un temporizador.**
- Q1 no es una rama de la cláusula. Las dos ramas, `signOut` resuelve y `signOut` rechaza, ya tienen candado (W1 y W2). Lo que Q1 cambia es un límite de tiempo.
- Ningún test finito lo cierra: con temporizadores falsos, una carrera con un plazo mayor que el avanzado vuelve a pasar en verde.
- Se apunta para dejar constancia, no para enmendar.

**F3, decide el leader: la espera vista desde la pantalla. Es la fila hermana de la que cierra B2.**
- **Cláusula.** `design.md` §3, fila `signOut`: «`signOut` de `useAuth()`, pasado sin llamarlo». Es nueva de #134 y hermana de la fila `t`. E1 no dice cerrarla.
- **Qué sobrevive.** Un envoltorio en la pantalla que no espera a `signOut` y pinta él mismo el error del rechazo deja el `finally` de la pantalla corriendo antes de que `signOut` termine. Es la misma conducta que motivó B1, ahora desde la pantalla.
- **Qué lo caza hoy.** La forma literal (Q6A) la cazan R6 (`screenSignOutCalls`, `#134 R6`, `#87 R19`) y `checkUses`. La forma que esconde `signOut(` y `t('…')` (Q6B) pasa todo en verde en las dos pantallas.
- **Candado más estrecho, ensanchado a la cláusula (las dos pantallas).** Un `it` por pantalla:
  - `unauthorized`, con `mockSignOut` devolviendo una promesa diferida;
  - con `signOut` pendiente, el botón de ack (`alert-row-alert-1-ack` / `alert-detail-ack`) sigue deshabilitado;
  - al resolver `signOut`, se espera el botón habilitado.
- **La rama que rechaza** no necesita otro `it` en pantalla. Un envoltorio que no espera solo puede propagar el rechazo pintando su propia copia, y C2/D1 más `checkUses` ya miran ese texto. Q6B lo esquiva solo porque oculta el literal.
- **Tipo:** verificación, cerrada por Q6B. **Sin spike:** no está comprobado que el botón vuelva a habilitarse tras `unauthorized` con el `useAuth` doble de cada suite.
- **Delta:** centro +1, detalle +1, móvil 2392 → 2394.
- **Decisión pendiente.** Si entra en E1, también cambian E1.3 y las anclas. Si no, va a la tabla de deuda de E1.5 con estos límites.

### Conclusión

E1 hace lo que declara: verde tal cual, rojos de M5/M6/M7 y de E1-S1 a E1-S6 exactamente en los `it` declarados, y typecheck, lint y numstat limpios. Antes de firmar falta **F1**: añadir `() => undefined` como segundo argumento de `done.then` en W1/W2. **F3** queda a decisión del leader.

### Spike F3

Medido en HEAD `d09716d1` con los tests de E1 puestos (W1/W2, C3/C4, D2/D3) y C5/D4 añadidos al final de `#134 R1` y `#134 R2`, después de C4 y D3. Producción sin tocar. Al terminar se restauraron los tres ficheros de test con `git checkout HEAD --`. Resultado: `git diff --cached --quiet` y `git diff --quiet -- mobile-pet-tracker` en 0, y ningún fichero sin trackear. Solo quedan modificados este fichero y `requirements.md` (F1 del leader, sin tocar).

**Veredicto del spike:** la forma propuesta funciona tal cual en las dos pantallas.
- No hace falta `act` ni ningún vaciado explícito. La pulsación (`await pressAck()` / `await fireEvent.press(...)`) ya vacía en su `act` toda la cadena hasta la llamada a `signOut`, y bajo Q6B también hasta el `finally` (sonda P0).
- El paso 3, «vacía las microtareas», ya lo hace el propio `waitFor`: `wrapAsync` termina con un `setImmediate`. No se añade ninguna instrucción.
- Única elección de sintaxis: el diferido se declara con inicializador (`let finishSignOut: () => void = () => undefined;`) y no con `!`. Así no depende de ninguna regla de lint sobre aserciones no nulas, y no hay función nueva de módulo.

**C5, centro** (`mobile-pet-tracker/src/screens/alerts/index.test.tsx`): se inserta justo antes del `  });` que cierra `describe('#134 R1: caracterización de las ramas sin candado del ack'`, después de C4. Son 19 líneas, con la línea en blanco inicial incluida.

```tsx

    it('mantiene el botón deshabilitado hasta que signOut termina tras unauthorized', async () => {
      let finishSignOut: () => void = () => undefined;
      mockAckAlert.mockResolvedValueOnce({ kind: 'unauthorized' });
      mockSignOut.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          finishSignOut = resolve;
        }),
      );

      await pressAck();

      await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
      expect(screen.getByTestId('alert-row-alert-1-ack')).toBeDisabled();

      finishSignOut();
      await waitFor(() => expect(screen.getByTestId('alert-row-alert-1-ack')).not.toBeDisabled());
      expect(screen.queryByTestId('alerts-action-error')).toBeNull();
    });
```

**D4, detalle** (`mobile-pet-tracker/src/screens/alert-detail/index.test.tsx`): se inserta justo antes del `  });` que cierra `describe('#134 R2: caracterización de la rama sin candado del ack'`, después de D3. Son 20 líneas, con la línea en blanco inicial incluida. Solo usa `fireEvent`, `screen` y `waitFor`, que ya están importados. No añade imports.

```tsx

    it('mantiene el botón deshabilitado hasta que signOut termina tras unauthorized', async () => {
      let finishSignOut: () => void = () => undefined;
      mockAckAlert.mockResolvedValueOnce({ kind: 'unauthorized' });
      mockSignOut.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          finishSignOut = resolve;
        }),
      );

      await renderDetail();
      await fireEvent.press(await screen.findByTestId('alert-detail-ack'));

      await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
      expect(screen.getByTestId('alert-detail-ack')).toBeDisabled();

      finishSignOut();
      await waitFor(() => expect(screen.getByTestId('alert-detail-ack')).not.toBeDisabled());
      expect(screen.queryByTestId('alert-detail-action-error')).toBeNull();
    });
```

**§Esperas: la espera al contador seguida de la consulta al árbol no tiene carrera en esta posición.**
- **Estado del árbol en HEAD.** `isDisabled` pasa a `true` en la pulsación: `setAckingId` / `setAcking` se confirman dentro del `act` de `fireEvent`. Solo vuelve a `false` en el `finally` de la pantalla. Ese `finally` corre únicamente cuando se resuelve el diferido, y el diferido lo resuelve el propio test con `finishSignOut()`, después de la aserción. Entre la espera y la consulta no hay ningún render pendiente que pueda cambiar el valor consultado.
- **Para qué sirve la espera al contador.** No espera a que se pinte nada. Sitúa la aserción en la ventana «`signOut` pendiente» y no en la ventana «ack en vuelo», donde el botón también está deshabilitado y la aserción pasaría por otra razón.
- **Sonda P0** (las dos pantallas): sustituir la espera por un `expect(mockSignOut).toHaveBeenCalledTimes(1)` síncrono justo después de la pulsación da verde. El contador ya vale 1 al volver la pulsación, así que el `waitFor` resuelve en su primera comprobación.
- **Paso 4.** Espera sobre el árbol (`waitFor` + `getByTestId(...).not.toBeDisabled()`), no sobre un contador. Después consulta la ausencia del error con `queryByTestId`.
- **Comprobado.** El botón vuelve a habilitarse tras `unauthorized` con el `useAuth` doble de cada suite. Esto cierra la reserva «Sin spike» de F3.

**Cuentas** (Tests: por fichero, recuento de `it`):

| Fichero | HEAD | con E1 | con E1 + F3 |
|---|---|---|---|
| `src/utils/alert-ack-outcome.test.ts` | 15 | 17 | 17 (medido) |
| `src/screens/alerts/index.test.tsx` | 41 | 43 | **44** (medido) |
| `src/screens/alert-detail/index.test.tsx` | 26 | 28 | **29** (medido) |
| móvil (total) | 2386 | 2392 | **2394** (aritmética: 2386 + 2 + 3 + 3; no se corrió la suite entera) |

**Salidas:**
- **Verde en HEAD, 3 de 3 por suite.** `bunx jest --clearCache` antes de cada corrida. Las tres corridas dan `alerts exit=0 :: Tests: 44 passed, 44 total` y `alert-detail exit=0 :: Tests: 29 passed, 29 total`. Hubo además una corrida previa sin borrar la caché, con el mismo resultado.
- **Q6B, 3 de 3 por pantalla.** El envoltorio sin literales de §4. `bunx jest --clearCache` antes de cada corrida.
  - Centro: `exit=1 :: Tests: 1 failed, 43 passed, 44 total`. Solo cae `#134 R1 › mantiene el botón deshabilitado hasta que signOut termina tras unauthorized`, por aserción: `expect(instance).toBeDisabled()` / `Received instance is not disabled:` en `> 799 | expect(screen.getByTestId('alert-row-alert-1-ack')).toBeDisabled();`.
  - Detalle: `exit=1 :: Tests: 1 failed, 28 passed, 29 total`. Solo cae `#134 R2 › mantiene el botón deshabilitado …`, por aserción: `Received instance is not disabled:` en `> 389 | expect(screen.getByTestId('alert-detail-ack')).toBeDisabled();`.
  - Producción restaurada tras cada corrida.
- **Sonda P0 bajo Q6B.** Sin la espera al contador, el rojo es el mismo en la misma línea (799 / 389). El rojo no depende del vaciado del `waitFor`.
- **Q6A sigue cazado, y ahora también en pantalla.**
  - Centro: la pantalla da `1 failed, 43 passed` (C5). `ui-language` da `2 failed, 28 passed` (`#65 R18`, `#78 R12`). `design-drift` da `2 failed, 63 passed` (`#134 R6 › screens/alerts/index.tsx delega…`, `#87 R19`).
  - Detalle: la pantalla da `1 failed, 28 passed` (D4). `ui-language` da `2 failed, 28 passed` (`#100 R10`, `#65 R18`). `design-drift` da `2 failed, 63 passed` (`#134 R6 › screens/alert-detail/index.tsx delega…`, `#87 R19`).
- **M6 y M7 siguen dando su rojo declarado con C5/D4 puestos.**
  - M6, centro: `2 failed, 42 passed, 44 total`, solo C3 y C4 (`toHaveTextContent`, líneas 775 y 784). `ui-language` da 30/30, `design-drift` 65/65 y typecheck `exit=0`.
  - M7, detalle: `2 failed, 27 passed, 29 total`, solo D2 y D3 (líneas 364 y 373). `ui-language` da 30/30, `design-drift` 65/65 y typecheck `exit=0`.
  - C5 y D4 no caen con M6/M7.
- **typecheck y lint.** `bun run typecheck` da `exit=0`; la única salida es el eco de bun `$ tsc --noEmit`. `bunx expo lint --no-cache` da `exit=0` con 0 bytes de salida.
- **numstat** (E1 + F3, contra HEAD):
  - `alerts/index.test.tsx` `51 0`, es decir, E1 32 + C5 19;
  - `alert-detail/index.test.tsx` `38 0`, es decir, E1 18 + D4 20;
  - `alert-ack-outcome.test.ts` `68 0`.
  - 0 borrados.
- **Anclas medidas.**
  - `grep -cF "mantiene el botón deshabilitado hasta que signOut termina tras unauthorized"` da 1 en cada suite de pantalla con F3 y 0 en HEAD.
  - `grep -cF "finishSignOut"` da 3 en cada suite con F3 y 0 en HEAD.

**Lo que no se midió.**
- La suite móvil entera e `init.sh`, por instrucción.
- La firma `!` (`let finishSignOut!: () => void;`): no se probó contra lint ni typecheck. Si el leader la prefiere, hay que medirla antes de prescribirla.

### Mutaciones M8 y M9

Medido en HEAD `d09716d1` con E1 + C5 + D4 puestos.
- **Base de tests.** E1 se aplicó con F1 tal como figura hoy en `requirements.md` (W1 y W2 con `() => undefined` como segundo argumento de `done.then`). C5 y D4 son el texto exacto de `### Spike F3`.
- **Mutaciones.** M8 y M9 se aplicaron a la vez: es el commit rojo único que añade C5 y D4. No se añade ninguna constante fuera del objeto, ningún import y ningún comentario. No aparece `#134` en ningún sitio.

**Texto literal de M8 y M9.**
- Las dos sustituyen una sola línea: `        signOut,` (8 espacios). Es la línea del tercer argumento de `settleAlertAck(`, el objeto de handlers, entre `        t,` y `        showError: setActionError,`.
- **M8, centro** (`mobile-pet-tracker/src/screens/alerts/index.tsx`). Ancla: `grep -cxF '        signOut,' src/screens/alerts/index.tsx` da `1` en HEAD (hoy en la línea 92; la línea no es ancla).
- **M9, detalle** (`mobile-pet-tracker/src/screens/alert-detail/index.tsx`). Ancla: `grep -cxF '        signOut,' src/screens/alert-detail/index.tsx` da `1` en HEAD (hoy en la línea 55).

La sustituyen estas 6 líneas, idénticas en los dos ficheros:

```tsx
        signOut: () => {
          const run = signOut;
          const key = 'common.somethingWentWrong' as const;
          void Promise.resolve(run()).catch(() => setActionError(t(key)));
          return Promise.resolve();
        },
```

- **numstat** de producción con M8 + M9: `6 1` en cada pantalla.
- **Ancla negativa tras revertir.** `grep -cF 'const run = signOut;'` da `0` en cada pantalla.
- **Por qué esta forma.** Es la forma Q6B del barrido de §4. Esconde `signOut(` (lo lee `screenSignOutCalls`) y `t('…')` (lo lee `checkUses`). Por eso la ven en verde R6, `#87 R19` y la tabla de copy. No espera a `signOut`, y el `finally` de la pantalla rehabilita el botón antes de que `signOut` termine.

**Medición combinada (M8 + M9 a la vez).** Cada corrida va sin pipe y con `bunx jest --clearCache` justo antes.

| Fichero | Salida |
|---|---|
| `src/screens/alerts/index.test.tsx` | `exit=1 :: Tests: 1 failed, 43 passed, 44 total` |
| `src/screens/alert-detail/index.test.tsx` | `exit=1 :: Tests: 1 failed, 28 passed, 29 total` |
| `src/__tests__/ui-language.test.ts` | `exit=0 :: Tests: 30 passed, 30 total` |
| `src/__tests__/design-drift.test.ts` | `exit=0 :: Tests: 65 passed, 65 total` |
| `src/utils/alert-ack-outcome.test.ts` | `exit=0 :: Tests: 17 passed, 17 total` |
| `bun run typecheck` | `exit=0`; la única salida es el eco de bun `$ tsc --noEmit` |
| `bunx expo lint --no-cache` | `exit=0`, 0 bytes de salida |

- **Centro.** Solo cae `#78 R8 › #134 R1 › mantiene el botón deshabilitado hasta que signOut termina tras unauthorized`, por aserción: `expect(instance).toBeDisabled()` / `Received instance is not disabled:` en `> 799 | expect(screen.getByTestId('alert-row-alert-1-ack')).toBeDisabled();`.
- **Detalle.** Solo cae `#100 R5 › #134 R2 › mantiene el botón deshabilitado hasta que signOut termina tras unauthorized`, por aserción: `Received instance is not disabled:` en `> 389 | expect(screen.getByTestId('alert-detail-ack')).toBeDisabled();`.

**Revertir M8 y M9.**
- `git checkout HEAD --` de las dos pantallas deja `git diff --quiet` en 0.
- Con `--clearCache` antes, el centro da `exit=0 :: Tests: 44 passed, 44 total` y el detalle `exit=0 :: Tests: 29 passed, 29 total`.

**Limpieza.**
- Se restauraron los tres ficheros de test con `git checkout HEAD --`.
- `git diff --cached --quiet` y `git diff --quiet -- mobile-pet-tracker` dan 0, y no hay ficheros sin trackear.
- Quedan modificados este fichero, `requirements.md` y `tasks.md`. Los dos últimos son cambios del leader; no se tocaron.

## Ronda 2

Re-revisión de la Enmienda E1. Worktree `/home/claude/sites/Pet-Tracker-wt-134`, branch `feature/134-mobile-alert-ack-outcome-helper`, HEAD `707c566e`. H0 de la ronda 2 = `044ecfe0`. Fecha: 2026-10-09.

### R2.1 — Estado, lista cerrada y diffs

- `git rev-parse HEAD` = `707c566e4baf87ae3c0285a6026f57871eef4260`; branch `feature/134-mobile-alert-ack-outcome-helper`; `git status --short` vacío.
- Commits de la ronda 2 sobre H0 `044ecfe0`: c1 `afd1b4fb` (rojo R4), c2 `d3c2b7eb` (verde), c3 `c19c7ca6` (rojo R1), c4 `bfca523f` (verde), c5 `63f91569` (rojo R2), c6 `190cb1cc` (verde), c7 `670fd9f5` (rojo R1, R2), c8 `c6ec5d8c` (verde), c9 `7a28a26b` (trazabilidad), `707c566e` (impl). Orden y separación rojo/verde según el handoff.
- Lista cerrada (`git diff --name-only 044ecfe0 HEAD` con las 8 exclusiones del handoff): exactamente los 5 ficheros declarados (3 tests, impl, traceability). Sin exclusiones sale la misma lista: el leader no commiteó en mitad.
- `git diff --numstat 044ecfe0 HEAD` de los tests: `36 0` detalle, `49 0` centro, `68 0` helper. 0 borrados.
- `git diff --quiet 044ecfe0 HEAD -- <helper> <2 pantallas> src/__tests__ src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx package.json bun.lock app.json` → exit=0.
- `git diff --stat 044ecfe0 HEAD -- backend-pet-tracker/ infra/ docs/` → vacío.
- Cada verde deja producción igual a H0: `git diff --quiet 044ecfe0 <verde> -- <helper> <2 pantallas>` → exit=0 en `d3c2b7eb`, `bfca523f`, `190cb1cc`, `c6ec5d8c`.
- Cada rojo toca solo su test y su producción: c1 test helper `68 0` y helper `3 2` (M5); c3 test centro `30 0` y centro `2 1` (M6); c5 test detalle `16 0` y detalle `2 1` (M7); c7 tests `19 0` y `20 0`, y cada pantalla `6 1` (M8 y M9). Los diffs de producción de los rojos son literalmente M5, M6, M7, M8 y M9 de E1.1, E1.2 y E1.7.
- traceability.md: 4 filas nuevas justo después de R7 (`R4 (E1)`, `R1 (E1)`, `R2 (E1)`, `R1 y R2 (E1.7)`). Las 7 filas de la ronda 1 no cambian. Los 8 hashes cumplen `git merge-base --is-ancestor <hash> HEAD` (exit=0). Ninguna fila dice «pendiente»; la única aparición de la palabra es la línea de la regla.

### R2.2 — Literalidad de los 8 tests

- Helper: `deferred` y `flushPromises` justo después de `makeHandlers`, iguales al bloque de E1.1. W1 y W2 al final de `describe('#134 R4: …')`, con los títulos literales, `mockReturnValueOnce(signOutGate.promise)`, `void done.then(() => { settled = true; }, () => undefined)`, `flushPromises`, las aserciones de E1.1 en su orden y `'Algo salió mal'` literal en W2.
- Centro: `EnglishAlertsWrapper` y `renderAlertsInEnglish` justo después de `renderAlerts`, literales. C3, C4 y C5 al final de `describe('#134 R1: …')`, en ese orden, con títulos, `mockResolvedValueOnce`, esperas con `queryByTestId` + `toHaveTextContent('<literal completo>')` y el cuerpo de C5 idéntico al de E1.7 (19 líneas). `AlertsWrapper` y `renderAlerts` sin tocar.
- Detalle: D2, D3 y D4 al final de `describe('#134 R2: …')`, con `renderDetail('alert-1', 'en')` en D2/D3 y el cuerpo de D4 idéntico al de E1.7 (20 líneas).
- Sin `act`, sin imports nuevos (el diff no toca ninguna línea `import`), sin formas sin `Once` en los mocks, sin `#134` sueltos, sin `en[...]`/`es[...]` en los valores esperados.

### R2.3 — Rojos de c1, c3, c5 y c7 medidos en un worktree temporal

Worktree desacoplado en el scratchpad (`git worktree add --detach`), con `node_modules` enlazado al de wt-134; borrado al terminar. El HEAD de wt-134 no se movió. Jest por fichero, `FORCE_COLOR=0`, salida a fichero.

| Commit | Suite | exit | `Tests:` | `it` rojos | Matcher / Received |
|---|---|---|---|---|---|
| c1 `afd1b4fb` | helper | 1 | 2 failed, 15 passed, 17 total | W1, W2 | `expect(settled).toBe(false)` (líneas 173 y 198): Expected `false`, Received `true` |
| c3 `c19c7ca6` | centro | 1 | 2 failed, 41 passed, 43 total | C3, C4 | `toHaveTextContent('Cannot reach server')` → Received `No se pudo conectar con el servidor`; `toHaveTextContent('Something went wrong')` → Received `Algo salió mal` |
| c5 `63f91569` | detalle | 1 | 2 failed, 26 passed, 28 total | D2, D3 | ídem, en `alert-detail-action-error` |
| c7 `670fd9f5` | centro | 1 | 1 failed, 43 passed, 44 total | C5 | `toBeDisabled()` (línea 797): «Received instance is not disabled» |
| c7 `670fd9f5` | detalle | 1 | 1 failed, 28 passed, 29 total | D4 | `toBeDisabled()` (línea 387): «Received instance is not disabled» |
| c7 `670fd9f5` | helper + design-drift + ui-language | 0 | 112 passed (17 + 65 + 30) | — | M8 y M9 esconden los literales: los guards siguen verdes, como declara E1.7 |

Cada rojo cae por aserción (el nodo existe), solo en sus `it`, y los demás de la suite siguen verdes. Los verdes ya están medidos arriba: producción igual a H0 en c2, c4, c6 y c8.

### R2.4 — Sondas E1-S1 a E1-S8 y supervivientes de la ronda 1, sobre HEAD `707c566e`

Cada sonda: mutación en el árbol de wt-134, jest por fichero (`FORCE_COLOR=0`, salida a fichero), `git checkout HEAD -- <fichero>` y comprobación de limpieza. La limpieza se mide como `git diff --quiet -- . ':!progress/review_mobile-alert-ack-outcome-helper.md' && git diff --cached --quiet` y sin ficheros sin trackear: el único fichero modificado es este review, que se va escribiendo durante la medición.

| Sonda | Mutación | Suite | exit | `Tests:` | Rojos (matcher) | Limpieza |
|---|---|---|---|---|---|---|
| E1-S1 = P3d | helper: `await signOut();` → `void Promise.resolve(signOut()).catch(() => showError(t('common.somethingWentWrong')));` (numstat `1 1`) | helper | 1 | 2 failed, 15 passed, 17 | W1, W2: `toBe(false)`, Received `true` (173, 198) | exit=0 (solo `M` el review) |
| | | centro | 1 | 1 failed, 43 passed, 44 | C5: `toBeDisabled()` (797) | |
| | | detalle | 1 | 1 failed, 28 passed, 29 | D4: `toBeDisabled()` (387) | |
| E1-S2 = P3c | helper: `await signOut();` → `void signOut().catch(() => showError(t('common.somethingWentWrong')));` (numstat `1 1`) | helper | 1 | 2 failed, 15 passed, 17 | W1, W2: `toBe(false)` (173, 198) | exit=0 |
| | | centro | 1 | 1 failed, 43 passed, 44 | C5: `toBeDisabled()` (797). En la ronda 1, P3c dejaba el centro 41/41 en verde | |
| | | detalle | 1 | 2 failed, 27 passed, 29 | D4: `toBeDisabled()` (387); y el rojo accidental ya conocido de P3b en `#100 R5` «cierra sesión una vez si el ack responde unauthorized» (`toBeNull`, 329: el `mockSignOut` por defecto devuelve `undefined`) | |
| E1-S3 | centro: `import { es }` + `t: (key) => (key === 'common.cannotReachServer' ? es[key] : t(key)),` (numstat `2 1`) | centro | 1 | 1 failed, 43 passed, 44 | solo C3: `toHaveTextContent('Cannot reach server')`, Received `No se pudo conectar con el servidor` (774) | exit=0 |
| E1-S4 | centro: lo mismo con `'common.somethingWentWrong'` | centro | 1 | 1 failed, 43 passed, 44 | solo C4: `toHaveTextContent('Something went wrong')`, Received `Algo salió mal` (782) | exit=0 |
| E1-S5 | detalle: lo de E1-S3 | detalle | 1 | 1 failed, 28 passed, 29 | solo D2: Received `No se pudo conectar con el servidor` (363) | exit=0 |
| E1-S6 | detalle: lo de E1-S4 | detalle | 1 | 1 failed, 28 passed, 29 | solo D3: Received `Algo salió mal` (371) | exit=0 |
| E1-S7 = Q6Bc (B3, centro) | centro: M8 sola (`        signOut,` → el envoltorio de 6 líneas de E1.7; ancla `grep -cxF '        signOut,'` = 1 en cada pantalla; numstat `6 1`) | centro | 1 | 1 failed, 43 passed, 44 | solo C5: `toBeDisabled()`, «Received instance is not disabled» (797) | exit=0 |
| | | ui-language / design-drift | 0 / 0 | 30 / 65 passed | ninguno (el envoltorio esconde los literales, como declara E1.7) | |
| E1-S8 = Q6Bd (B3, detalle) | detalle: M9 sola (numstat `6 1`) | detalle | 1 | 1 failed, 28 passed, 29 | solo D4: `toBeDisabled()`, «Received instance is not disabled» (387) | exit=0 |
| | | ui-language / design-drift | 0 / 0 | 30 / 65 passed | ninguno | |
| P14 (ronda 1) | centro: `import { es }` + `t: (key) => es[key],` (= M6) | centro | 1 | 2 failed, 42 passed, 44 | C3 y C4: `toHaveTextContent`, Received en `es` (774, 782). En la ronda 1 sobrevivía con 41/41 | exit=0 |
| P11 (ronda 1) | detalle: lo mismo (= M7) | detalle | 1 | 2 failed, 27 passed, 29 | D2 y D3: `toHaveTextContent`, Received en `es` (363, 371). En la ronda 1 sobrevivía con 26/26 | exit=0 |

**Resultado.** Las 8 sondas de E1.4 dan el rojo declarado, por aserción y nunca por consulta, en exactamente sus `it`. Las supervivientes de #134 de la ronda 1 caen todas ahora: P3c (= E1-S2), P3d (= E1-S1), P11, P14, y la B3 de M8/M9 (= Q6Bc/Q6Bd = E1-S7/E1-S8). P3c y P3d caen además en C5 y D4, o sea que la espera queda cerrada por dos lados: en el helper (W1/W2) y en las pantallas (C5/D4). Tras cada sonda, el árbol vuelve a HEAD (limpieza exit=0).

### R2.5 — Typecheck, lint e init.sh

- Desde `mobile-pet-tracker/` en HEAD `707c566e`: `test ! -e .expo/types/router.d.ts` → exit=0; `bun run typecheck` → exit=0; `bunx expo lint --no-cache` → exit=0, salida sin avisos ni errores.
- `./init.sh`: no lo lancé (el clasificador lo deniega al reviewer y comparte Postgres/LocalStack). Lo corrió el leader con permiso del humano sobre HEAD `707c566e` (commit de las 22:42:29 UTC; log escrito a las 23:05). Log leído con grep: backend `Test Suites: 187 passed, 187 total` / `Tests: 1474 passed, 1474 total`; `Test Suites: 2 passed` / `Tests: 14 passed`; móvil (líneas 28002-28003) `Test Suites: 98 passed, 98 total` / `Tests: 2394 passed, 2394 total`; e2e `Test Suites: 3 skipped, 30 passed, 30 of 33 total` / `Tests: 8 skipped, 468 passed, 476 total`; `✅ Lint sin errores`, `✅ Typecheck sin errores`, `✅ Todo verde`. 2394 = 2386 + 8, la cuenta de E1.3. HEAD del worktree sin mover durante toda la revisión (`707c566e`).

### R2.6 — Deuda delimitada por E1.5

Las 7 supervivientes anteriores (P16b, P20a, P20b, P17, P18, P24, P25) siguen fuera del diff: `git diff -U0 044ecfe0 HEAD` sobre las dos pantallas sale vacío, y sus líneas siguen en su sitio (`setActionError(null)` del detalle :51, `ackingRef.current = false;` :66, `setAcking(false);` :67, `if (ackingIdRef.current !== null) return;` del centro :84, `|| ackingRef.current` del detalle :48, y los dos `leavingRef` del `onNotFound` :59-60). No son motivo de rechazo. El leader las registra como feature de deuda al cerrar #134.

### Checklist ronda 2

**C2 — Estado coherente**
- [x] Solo 1 feature `in_progress` en `feature_list.json` (#134)
- [x] `progress/current.md` describe #134, E1 y el handoff de la ronda 2

**C3 — Arquitectura**
- [x] Sin cambios de producción en la ronda 2 (`git diff --quiet 044ecfe0 HEAD` sobre el helper y las pantallas, exit=0). Lo de la ronda 1 no cambia.

**C4 — TDD**
- [x] W1/W2 nombran R4 (en `describe('#134 R4: …')`); C3/C4/C5 nombran R1; D2/D3/D4 nombran R2
- [x] Rojo antes del verde, en commits separados (c1-c8). Cada rojo cae por aserción en exactamente sus `it`, medido por mí en cada commit rojo. Cada verde deja producción igual a H0

**C5 — Trazabilidad**
- [x] 4 filas nuevas tras R7, con hashes reales que son ancestros de HEAD; ninguna fila «pendiente»
- [x] Mensajes `test(...)`/`fix(...)`/`docs(...)` con sus R-ids, con el mismo formato que la ronda 1

**C6 — Spec aprobada**
- [x] `status: approved`; `[x] Enmienda E1 aprobada (fecha: 2026-10-09)`, firma en `08d7d0a1`

**C7 — Sin código huérfano**
- [x] N/A en la ronda 2: no se reemplaza nada; solo se añaden tests

**C8 — Carta UI**
- [x] La ronda 2 solo añade tests: sin hex, sin `StyleSheet`, sin clases arbitrarias; `design-drift` 65/65 en verde

### Observaciones de la ronda 2

- O6 (informativa): Codex commitea con la identidad automática `Claude <claude@srv1178023.hstgr.cloud>`, como avisa git en la salida de c9 del impl. No afecta al veredicto.
- O7 (informativa): con P3c (E1-S2), el detalle da además el rojo accidental de P3b en `#100 R5` «cierra sesión una vez…», ya documentado en la ronda 1. No tapa el rojo de D4, que cae por su cuenta.

### Veredicto ronda 2: APROBADO

Sin hallazgos bloqueantes. B1, B2 y B3 de la Enmienda E1 están cerrados: W1/W2 y C5/D4 candan la espera a `signOut` en el helper y en cada pantalla, y C3/C4/D2/D3 candan el `t` de cada pantalla, una clave por `it`. Las supervivientes de #134 de la ronda 1 (P3c, P3d, P11, P14, Q6Bc, Q6Bd) caen todas. Lista cerrada, numstat, producción, typecheck, lint e init.sh del leader en verde.
