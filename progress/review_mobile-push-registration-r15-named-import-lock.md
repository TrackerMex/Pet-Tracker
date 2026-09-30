# review: mobile-push-registration-r15-named-import-lock (#137 + #139), ronda 1
Fecha: 2026-09-30T01:12:23Z
Veredicto: APROBADO

HEAD revisado: `d0ce3e607674c0f4b010d4f3f4327d882f24202e`, branch
`feature/137-mobile-push-registration-r15-named-import-lock` en
`/home/claude/sites/Pet-Tracker-wt-backend`, sin pushear. Es el HEAD que
aparece al final del log de init.sh, y `git rev-parse HEAD` seguía dando ese
mismo valor después de que terminara. Árbol limpio (`git status --porcelain`
vacío) antes de escribir este fichero.

Base: `70e1fdcb`, el merge-base con `origin/main`. `origin/main` está ya en
`76849396` (#176), pero esta branch no lo incluye, así que todo lo he medido
contra la branch. Handoff: `730d2df2`. Firma: `0aa09510`.

Entran en alcance los commits de Codex `814f90ff`, `e106acee`, `5ed27bee`,
`942bfc13` y `d0ce3e60`. Los del leader (`e255e691`, `4e03f419`, `9541adc1`,
`0aa09510`, `730d2df2`) quedan fuera.

Skills cargadas: solo `expo:expo-overview`. El cambio es de mocks de jest en el
test de un hook y no tiene UI, así que no cargué ninguna skill hoja.

Entorno de medida:
- No lancé init.sh. Lo lanzó el leader sobre `d0ce3e60` con permiso del humano,
  y yo leí su log crudo:
  `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/be83ee02-f6ed-40e5-bcdd-18a6451c2267/scratchpad/init_137.log`.
- Hice todas las sondas, rojos y checkouts históricos en un worktree desechable,
  `.../scratchpad/wt-review-137` (detached en `d0ce3e60`), con un symlink a los
  `node_modules` de wt-backend. Ya está borrado con `git worktree remove --force`.
- Logs en `.../scratchpad/rv137/`.
- Todo se midió sin pipe (`cmd > log 2>&1; echo "exit=$?"`), y cada corrida del
  fichero imprimió `Test Suites: 1`.
- Después de cada sonda restauré con `git checkout HEAD -- <rutas>`. Las 20
  restauraciones dieron `diff=0 cached=0` y ningún fichero sin trackear aparte
  del symlink.
- No corrí la suite móvil entera. Sus cifras salen del log de init.sh.

## Output de ./init.sh (líneas decisivas, log crudo)

```
218:Test Suites: 171 passed, 171 total          <- backend unit
219:Tests:       1307 passed, 1307 total
231:Test Suites: 2 passed, 2 total              <- infra
232:Tests:       14 passed, 14 total
19457:PASS src/hooks/use-push-registration.navigation.test.tsx
19972:PASS src/hooks/use-push-registration.test.tsx
20217:Test Suites: 86 passed, 86 total          <- móvil
20218:Tests:       1610 passed, 1610 total
20515:Test Suites: 3 skipped, 27 passed, 27 of 30 total   <- e2e
20516:Tests:       8 skipped, 389 passed, 397 total
20532:✅ Lint sin errores
20536:✅ Typecheck sin errores
20539:✅ Todo verde. Listo para trabajar.
d0ce3e607674c0f4b010d4f3f4327d882f24202e
exit=0
```

- En la suite móvil, `86/1610` frente a `86/1609` en la base (`init-137-start.log`,
  sobre `70e1fdcb`): +0 suites y +1 test, como declara R3.4. El log no tiene
  ninguna línea `FAIL`.
- Backend unit, infra y e2e salen idénticos a los del arranque de `current.md`
  (171/1307, 2/14, 27+3 skip / 389+8 skip).
- Los avisos también estaban antes de este cambio, y ninguno lo toca:
  - las 3 claves que faltan en `.env`;
  - las features antiguas sin spec;
  - el `A worker process has failed to exit gracefully` de la suite móvil, que
    ya sale igual en `init-137-start.log` sobre la base.

## Lista cerrada y diff de producción

- `git diff --name-only 730d2df2..d0ce3e60` da exactamente:
  - `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`
  - `progress/impl_mobile-push-registration-r15-named-import-lock.md`
  - `specs/mobile-push-registration-r15-named-import-lock/traceability.md`
- `git diff --stat 70e1fdcb..d0ce3e60 -- mobile-pet-tracker backend-pet-tracker`
  da solo el test: `1 file changed, 18 insertions(+), 12 deletions(-)`. Las 12
  líneas borradas son el `jest.doMock(` del `Proxy` y nada más.
- Blobs en `d0ce3e60`, iguales a la base: hook `316a36f2`, `src/api/push-tokens.ts`
  `1f9afe40`. El test pasa de `0a6e87fe` a `9bf2d34c`.
- El diff final coincide literalmente con los bloques de tasks.md, y
  `git diff --check` da 0:
  - la fábrica que lanza lleva el comentario `#137 R1`;
  - `headerNotificationsModule` va justo encima de `const notificationMocks = [`;
  - el `describe` de `#139 R2` es el último del fichero.
- El `jest.mock('expo-notifications', …)` de la cabecera no cambia.

## C4: historial test-primero, commit a commit (medido en el worktree de sondas)

| Commit | Mensaje (coincide con el literal del handoff) | Ficheros | Medido | ● y primera línea |
|---|---|---|---|---|
| `814f90ff` | `test(mobile): expose the R15 named import blind spot with a versioned mutation (R1)` | test + hook (S3) | `exit=1`, `1 failed, 51 passed, 52 total` | `R15 › no accede…` / `expect(received).not.toThrow()`, `Error message: "expo-notifications unavailable in Expo Go"` |
| `e106acee` | `test(mobile): lock R15 against a named expo-notifications import (R1)` | solo hook, revierte S3 | `exit=0`, `52 passed, 52 total` | — |
| `5ed27bee` | `test(mobile): expose the R15 restore identity gap with a versioned mutation (R2)` | solo test (captura + describe + O1) | `exit=1`, `1 failed, 52 passed, 53 total` | `#139 R2 › jest.requireMock devuelve…` / `expect(received).toBe(expected) // Object.is equality`, diff `-  "MAX": 7` / `+  "MAX": 5` |
| `942bfc13` | `test(mobile): lock the R15 restore to the header module identity (R2)` | solo test, revierte O1 | `exit=0`, `53 passed, 53 total` | — |
| `d0ce3e60` | `docs(mobile): record the R15 named import and restore identity evidence (R1,R2,R3)` | impl + traceability | `exit=0`, `53 passed, 53 total` | — |

Controles de que el candado es lo que muerde:

| Id | Árbol | Esperado | Medido |
|---|---|---|---|
| C0 | test de la base (con el `Proxy`) + hook de `814f90ff` (S3) | verde: la fábrica antigua no ve S3 (P1) | `exit=0`, `52 passed` |
| C0b | test de `e106acee` (sin R2) + O1 en el `finally` | verde: sin R2 la copia pasa (P4) | `exit=0`, `52 passed` |

Ningún rojo sale de un `ReferenceError`. `headerNotificationsModule` entra en el
mismo commit que el `describe` que la usa.

## Sondas del reviewer (sobre `d0ce3e60`, una cada vez)

«Consulta» significa que el rojo salta antes del matcher, porque lanza la propia
lectura (`requireMock` o `requireActual`) y la primera línea no lleva `expect`.
«Matcher» significa que el rojo lo da la aserción.

### R1 (#137)

| Id | Mutación | Rojo esperado, y dónde | Medido | Restauración |
|---|---|---|---|---|
| S3 | hook: `import { type NotificationResponse, setNotificationHandler }` + llamada sin prefijo | 1, R15, matcher `not.toThrow` | `exit=1`, `1 failed, 52 passed, 53 total`; solo `R15 › no accede…`; `expect(received).not.toThrow()` | limpia |
| S4 | hook: `import * as StaticNotifications` + llamada con él | 1, R15, matcher | igual que S3 | limpia |
| S1 | hook: `require(…).setNotificationHandler(null)` en el cuerpo del módulo | 1, R15, matcher | igual que S3 | limpia |
| S2 | hook: `require(…).AndroidImportance.MAX` en el cuerpo + `importance: CHANNEL_IMPORTANCE` | 1, R15, matcher | igual que S3 | limpia |
| Z1 (propia, zona ciega del `Proxy` antiguo) | hook: `export { setNotificationHandler } from 'expo-notifications';` (un reexport con nombre que no lee nada al importarse) | 1, R15, matcher | igual que S3 | limpia |
| Z2 (propia, transitiva por un módulo **no** mockeado; es el complemento de S5) | fichero nuevo `src/hooks/push-probe.ts` con `import 'expo-notifications';`, y el hook hace `import './push-probe';` | 1, R15, matcher | igual que S3, con `Error message: "expo-notifications unavailable in Expo Go"` | limpia (el fichero de la sonda se borró) |
| Z3 (propia) | hook: `void import('expo-notifications');` en el cuerpo del módulo | no informativa | `exit=1`, `2 failed, 51 passed`: `R6 › no hace nada sin sesión autenticada` y `R15 › no accede…`, los dos **por excepción** con `TypeError: A dynamic import callback was invoked without --experimental-vm-modules` | limpia |

### R2 (#139)

| Id | Mutación | Rojo esperado, y dónde | Medido | Restauración |
|---|---|---|---|---|
| O4 (copia) | `finally`: `() => ({ ...headerNotifications })` | 1, `#139 R2`, matcher `toBe` | `exit=1`, `1 failed, 52 passed, 53 total`; solo `#139 R2`; `expect(received).toBe(expected) // Object.is equality` | limpia |
| Z4 (propia; un candado por campos no la vería) | `finally`: `() => new Proxy(headerNotifications, {})`, un proxy transparente con los mismos `jest.fn` | 1, `#139 R2`, matcher | igual que O4. `#133 R1` sigue verde | limpia |
| Z6 (propia; R2 no depende de la caché de `#133 R1`) | O1 + `-t 'no accede a expo-notifications al importar el modulo\|#139 R2'`, con `#133 R1` excluido | 1, `#139 R2`, matcher | `exit=1`, `1 failed, 51 skipped, 1 passed, 53 total`; `toBe` | limpia |
| Z6c (control de Z6) | el mismo filtro, sin mutación | verde | `exit=0`, `51 skipped, 2 passed` | — |
| H1 | quita la restauración | 2 rojos, los dos en la **consulta** | `2 failed, 51 passed`; `#133 R1` y `#139 R2` con `expo-notifications unavailable in Expo Go`, sin `expect` | limpia |
| H2 | `jest.dontMock` | `#133 R1` en el matcher y `#139 R2` en la consulta | `#133 R1`: `expect(jest.fn()).toHaveBeenCalledWith(...expected)`; `#139 R2`: `expo-notifications unavailable in Expo Go` | limpia |
| H3 | un impostor con una `jest.fn` cambiada | 2 rojos, los dos en el matcher | `#133 R1`: `expect(jest.fn()).toHaveBeenCalled()`; `#139 R2`: `toBe` | limpia |
| H5 | la captura de R15 pasa a después del reset | `#133 R1` por excepción y `#139 R2` en el matcher | `#133 R1`: `AggregateError:`; `#139 R2`: `toBe` | limpia |

Que R2 no es tautológico lo verifiqué sobre el código:
- `headerNotificationsModule` es un `const` de ámbito de módulo (línea 77). Se
  evalúa al cargar el fichero, antes de que corra ningún `it`, con el objeto
  que ya dejó en `_mockRegistry` el `import * as Notifications` de la cabecera.
- Solo aparece en su declaración y en la aserción (`grep -n`).
- El `finally` restaura `headerNotifications`, que es otra variable, local del
  `it` de R15, y no reasigna la constante.
- No es un símbolo de producción.
- El único `jest.resetModules()` del fichero es el de R15, y `test/jest-setup.js`
  no resetea módulos entre tests.
- El valor recibido sale del registro de jest después de R15. O1, O4, Z4 y Z6 lo
  ponen rojo, y C0b demuestra que sin R2 esas copias pasan.

## Trazabilidad

- `traceability.md` tiene 0 filas «pendiente». La única coincidencia de
  `grep -i pendiente` es la línea de la regla.
- Los cuatro hashes completos existen (`git cat-file -e`) y son ancestros de
  `d0ce3e60` (`git merge-base --is-ancestor`, rc=0 los cuatro).
- Cada fila apunta a lo que dice:

| R | Test | Rojo | Verde | Verificado |
|---|---|---|---|---|
| R1 | `R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo` | `814f90ff…` | `e106acee…` | el rojo es R15 por S3 y el verde revierte S3 |
| R2 | `#139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia` | `5ed27bee…` | `942bfc13…` | el rojo es `#139 R2` por O1 y el verde revierte O1 |
| R3 | sin test (cierre medido) | no aplica | `942bfc13…` | es el verde de R2, como fija la nota de la tabla |

## R3: cierre, medido por el reviewer

| Punto | Medido |
|---|---|
| R3.1 | `git diff --name-only 70e1fdcb..d0ce3e60 -- mobile-pet-tracker/` da solo el test |
| R3.2 | títulos de la base 52 y finales 53 (`--json` + `jq`); `diff=1` con `11a12` y una sola línea `>`, la de `#139 R2`; ninguna `<`. El orden de los `describe`/`it` existentes no cambia (el único añadido va al final) |
| R3.3 | `1 file changed, 18 insertions(+), 12 deletions(-)` |
| R3.4 | fichero 52 → 53; suite 86/1609 → 86/1610 (log de init.sh) |
| R3.5 | suite `exit=0` sin pipe (init.sh); `router=0`; `bunx tsc --noEmit` `exit=0`; `bunx eslint src/hooks/use-push-registration.test.tsx` `exit=0` |
| R3.6 | grep-clean de tasks.md sobre las líneas añadidas: nada impreso, `exit=1`. Las tres líneas con `#` son `#139 R2`, `#137 R1` y `#139 R2` |

## Criterios de aceptación (`feature_list.json`)

#137:
1. Con S3 plantada, el candado se pone rojo y es el único rojo del fichero. **Cumple** (`814f90ff` y la sonda S3).
2. S1, S2 y S4 siguen poniendo rojo el candado. **Cumple** (las tres medidas, 1 rojo por matcher).
3. `#133 R1` sigue verde con producción intacta. **Cumple** (`d0ce3e60`, 53/53).
4. El diff de producción está vacío y no hay ningún `it` renombrado. **Cumple**. El título de R15 se conserva, como firma el punto 2.
5. Suite verde sin pipe, tsc y lint en 0, delta declarado. **Cumple**.

#139:
1. Con O1 plantada, rojo por aserción y único rojo. **Cumple** (`5ed27bee`).
2. H1, H2, H3 y H5 siguen poniendo rojo `#133 R1`. **Cumple** (medidas; ahora dan 2 rojos, como firma el punto 5).
3. Con producción y el `finally` intactos, el fichero sigue verde. **Cumple**.
4. y 5. Igual que #137. **Cumple**.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (#137, medido con python sobre `feature_list.json`). #139 sigue `spec_ready`, como exige init.sh:156.
- [x] `progress/current.md` describe la sesión activa de #137 + #139 (ver obs. 3).
- [x] Codex no tocó `feature_list.json`, `STATUS.md`, `progress/current.md` ni `progress/history.md` (lista cerrada).

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica, el cambio es solo de test móvil
- [x] repositories/contratos en domain son interfaces puras: no aplica
- [x] application depende de interfaces: no aplica
- [x] infrastructure sin lógica de negocio: no aplica

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra.
  - `#139 R2` va en el título del `describe`.
  - R1 se nombra con el comentario `#137 R1` dentro del `it` de R15, que conserva su título. Es la excepción firmada en el punto 2 de §Qué firma.
  - R3 es un cierre medido sin test, declarado en la spec.
- [x] El historial muestra test-primero: rojo → verde por requisito, en cuatro commits de código, cada uno medido arriba.
- [x] Vía **b** en R1 y R2, declarada por escrito antes del handoff (design D4). Las mutaciones están versionadas en el rojo y revertidas en el verde. La evidencia de mutación está en este reporte.
- [x] Ningún rojo sale de un `ReferenceError`.
- [x] El rojo de R1 es una mutación de producción (S3 en el hook). El de R2 muta la restauración del `finally`, que es el código vigilado, no el doble: la cabecera no se toca. Es la vía firmada en el punto 4 de §Qué firma, porque ninguna mutación de producción puede poner rojo R2.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas «pendiente».
- [x] Cada requisito tiene su test y sus commits registrados, y los hashes son ancestros de HEAD.
- [x] Commits `test(mobile): … (R1)`, `(R2)` y `docs(mobile): … (R1,R2,R3)`, literales de la spec. El tipo `test`/`docs` es el que fija la convención de commit de la propia traceability.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`, casilla marcada (2026-09-29) y decisión del punto 3 registrada.
- [x] Firma en `0aa09510`. Desde entonces solo cambió `traceability.md` (`git diff --stat 0aa09510..d0ce3e60 -- specs/`); requirements, design y tasks no se tocaron. El puntero de #139 también está en `approved`.

## Checklist C7 — Sin código huérfano
- [ ] N/A: esta feature no reemplaza nada existente. La fábrica `Proxy` se sustituye dentro del mismo `it` y no deja restos (el diff borra sus 12 líneas).

## C8 — UI móvil
- [x] Grep-clean limpio (R3.6). No hay pantalla, así que las demás casillas de C8 no aplican.

## Observaciones

No hay ninguna que bloquee.

1. **Z3 no es informativa.** Un `import()` dinámico en el cuerpo del módulo no se
   puede expresar en este jest: sin `--experimental-vm-modules` revienta con
   `TypeError` por excepción, tanto en R6 como en R15, y no en el matcher de R1.
   R1 está redactado para un `require` síncrono durante la evaluación, así que
   este caso queda fuera de lo que el candado puede demostrar en este entorno.
   Lo anoto como límite de medida, igual que S5, no como deuda.
2. **El límite S5 sigue abierto a sabiendas**, como aceptó el humano. Z2 mide su
   complemento: a través de un módulo local **no** mockeado, R1 sí se pone rojo.
   La zona ciega queda restringida a los módulos que el test mockea.
3. **`progress/current.md` en `d0ce3e60`** termina en «Esperando a Codex». Es
   artefacto del leader y le toca ponerlo al día al cerrar (entrega de Codex,
   init.sh y este veredicto). No es un fallo de la implementación.
