# review: mobile-role-aware-actions (#216)
Fecha: 2026-10-27T15:20Z
Revisor: subagente `reviewer` (Claude Code). Primera revisión.
Branch: `feature/216-mobile-role-aware-actions`, HEAD revisado `0bb40b8d`.
Veredicto: APROBADO

Contexto de la revisión:
- La implementó el subagente `implementer` (fallback; Codex sin cuota), no Codex. Se pierde la separación «quien implementa no revisa». Por eso no di por buena ninguna cifra del reporte sin medirla yo: rojos, verdes, sondas, anclas, lista cerrada y guardas.
- `./init.sh` no lo corrí, por regla del leader. Lo corre el job `verify` del CI de la PR (`bash ./init.sh`).
- No usé Monitor ni esperas en background. Antes de cada jest comprobé `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'`, cada uno en su propio comando. Esperé a que terminaran los jest de wt-209 y de wt-223.
- Skill cargada: `expo:expo-overview`. C8 se revisó contra `docs/ui-guidelines.md`.
- Árbol: todas las mutaciones y checkouts se revirtieron con `git checkout HEAD -- <ruta>`. Tras cada una, `git diff --quiet && git diff --cached --quiet` salió limpio. El único fichero nuevo es este.

## Checklist C2 — Estado coherente
- [x] Ninguna feature tiene `"status": "in_progress"` en `feature_list.json` (cuenta 0; el máximo es 1).
- [x] `progress/current.md` declara el fallback al subagente `implementer` para #216, en §«Fallback al subagente `implementer` (#216, 2026-10-27)». Lo exige CLAUDE.md §Excepciones.

## Checklist C3 — Arquitectura
- [x] Solo cambian la capa de presentación móvil (`src/screens/*`) y dos ficheros de test compartidos. No hay cambios en backend, dominio ni `src/api/`.
- [x] Las pantallas leen el rol de puertos que ya existen (`getPet` y `listPets` de `src/api/pets`), con claves de `petKeys` que ya existen. No hay acceso nuevo a infraestructura.
- [x] No hay lógica de negocio nueva aparte de la decisión de UI `isOwner`. El 403 del backend sigue siendo la red de seguridad, que la spec deja fuera de alcance.
- [x] No se creó ningún fichero de producción, ni hook ni util. Cada pantalla tiene una declaración `isOwner` con la forma literal de design.md.

## Checklist C4 — TDD
- [x] Cada R1–R7 tiene un `describe('#216 R<n>: …')` y cada `it` lleva `#216 R<n>` en su nombre.
- [x] Historial test-primero: 7 pares `test(mobile)` → `feat(mobile)`, sin commits mixtos.
  - Cada commit `test` toca solo ficheros de test.
  - Cada commit `feat` toca solo el fichero de producción de su R.
- [x] Rojos y verdes medidos por mí (§Rojo→verde medido). Todos los rojos caen por aserción o por espera agotada. Ninguno cae por `ReferenceError`, `TypeError`, `SyntaxError` ni por un import roto.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». Cada fila nombra su test y sus dos hashes. Los 14 hashes existen en la rama con el mensaje citado.
- [x] Los commits siguen el formato `test(mobile): #216 <desc> (R<n>)` / `feat(mobile): #216 <desc> (R<n>)`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla de aprobación marcada: firma delegada del leader (mandato 2026-10-23, ampliado 2026-10-26), fechada 2026-10-27, commit `6ca2ff21`.
- [x] Ni `requirements.md`, ni `design.md`, ni `tasks.md` cambian después de `6ca2ff21`.
- [ ] La casilla del smoke de #216 en dev build sigue vacía. No bloquea este veredicto, pero sí `done`: es el lote G4 de `progress/smoke_mejoras-producto.md`, un gate humano (Hallazgo 5).

## Checklist C7 — Sin código huérfano
- [x] N/A: la feature no reemplaza nada. Solo envuelve en condiciones nodos que ya existen, y no queda ningún componente ni test muerto.

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Los cuatro ficheros de producción no tienen hex, ni clases arbitrarias (`[...]`), ni `StyleSheet` nuevo.
- [x] La única clase nueva es la de `pairing-owner-only`: `text-center text-sm font-normal leading-body text-muted`.
  - Es literal de la spec.
  - `leading-body` es un token real.
  - Copia la nota `geofence-editor-read-only` y añade `text-center`.
- [x] No hay copy nuevo: la nota usa `t('pairing.errorForbiddenClaim')`, que ya está en el catálogo. La tabla de copy y `#65 R10` se enmiendan como manda la spec.
- [x] No hay pulsables nuevos. Las acciones se ocultan, no se deshabilitan.
- [x] Los dos sha256 del canvas coinciden con los de design.md.

## Requisito por requisito

| R | Producción (forma literal de design.md) | Test | Medido |
|---|---|---|---|
| R1 | `weight-log/index.tsx`: `useQuery` con `queryKey: petKeys.detail(petId)` y `getPet(baseUrl, token ?? '', petId)`. `isOwner` con la forma de la spec. `{isOwner ? ( <RiseIn delayMs={80}>…weight-form…</RiseIn> ) : null}` | `#216 R1: Peso solo deja registrar al dueño`: `it.each` de 4 filas y el `it` de carga con `pending()` | 5 rojos en `3a43f090` (incluida la fila `owner`, como pide tasks.md), verde en `aafcb08e` |
| R2 | `home/index.tsx`: `isOwner` con `petList.find(...)`. En el `map`, `testID === 'quick-action-reminder' && !isOwner ? null : (`. `QUICK_ACTIONS` y `quickActionInks[index]` no cambian | `#216 R2: el tile Recordatorio es solo del dueño`: 4 filas, con la tabla de bindings literal de la spec | 3 rojos en `612f4219` (`toEqual(tiles)`), verde en `72eb564a` |
| R3 | `home/index.tsx`: `{detail.data.pet.device === null && isOwner ? (` | `#216 R3: Vincular collar en Inicio es solo del dueño`: 4 filas | 3 rojos en `e7388a2c` (`toBeNull` sobre `collar-pair-link`), verde en `51a17821` |
| R4 | `reminders/index.tsx`: `isOwner` con `pets.data.pets.find(({ id }) => id === selectedPetId)`. `accessory={isOwner ? (`. `action={isOwner ? { … } : undefined}` | `#216 R4: Nuevo es solo del dueño`: dos `it.each` de 4 filas (A y B) y el `it` del cambio de mascota | 7 rojos en `b7d2d7af`, verde en `99d986a2` |
| R5 | `reminders/index.tsx`: el `Button` de borrar/cancelar serie, único, dentro de `{isOwner ? (…) : null}` | `#216 R5: borrar y cancelar serie son solo del dueño`: 4 filas (`children` 3/2, `children[0]` y `children[1]` exactos) | 3 rojos en `a8d8bc4e` (`toHaveLength`), verde en `5c951a03` |
| R6 | `pairing/index.tsx`: `isOwner` bajo `selectedPet`. Dentro del segundo `{phase === 'idle' && selectedPet?.device === null ? (`: el formulario `gap-4`, o el `Text` `pairing-owner-only` | `#216 R6: el formulario de vincular es solo del dueño`: 4 filas. Guardas `#65 R10` (enmendado) y `#65 R18` | 3 rojos en `9a25520b` (la espera de `pairing-owner-only`). Las 2 guardas en rojo con `uses: 2` esperado y `uses: 1` recibido. Verde en `9424f976` |
| R7 | `pairing/index.tsx`: `{isOwner ? (<><View testID="device-unpair-spacer" …/><Button testID="device-unpair" …/></>) : null}` | `#216 R7: desvincular es solo del dueño`: 4 filas | 3 rojos en `792ae211` (`toBeNull` sobre `device-unpair`), verde en `25ad085d` |

Anclas: medí las 41 en HEAD y todas dan su cifra «después» de la spec. En los cuatro ficheros de producción, `grep -c '#216'` da 0 en cada uno. En los de test, todas las apariciones son `#216 R<n>` (0 que no lo sean).

Lista cerrada: `git diff --name-only 758e06c4..HEAD` da exactamente los 10 ficheros móviles de la spec, `progress/impl_mobile-role-aware-actions.md` y `specs/mobile-role-aware-actions/traceability.md`.

## Rojo→verde medido

Ejecuté jest sobre la producción de cada commit de test, en dos pasadas, y comparé contra los tests que ya están en HEAD. Ambas pasadas usaron `bunx jest --runTestsByPath <los 4 ficheros de pantalla> -t "#216 R" --testTimeout=30000`.

**Pasada A.** Producción de los commits `test` de R1, R3, R5 y R7, que no tienen otro test después: `3a43f090`, `e7388a2c`, `a8d8bc4e` y `792ae211`. Los tests de esos commits son idénticos a los de HEAD.
- `Tests: 14 failed, 678 skipped, 22 passed, 714 total`, exit 1.
- R1: caen las 5 (4 filas y el `it` de carga). Las filas caen en la espera de `getQueryData(petKeys.detail('pet-1'))` (`Received: undefined`). El `it` de carga cae en `toBeNull` sobre `weight-form`.
- R3: caen `family`, `walker` y `vet`, en `toBeNull` sobre `collar-pair-link`.
- R5: caen `family`, `walker` y `vet`, en `toHaveLength` (esperado 2, recibido 3).
- R7: caen `family`, `walker` y `vet`, en `toBeNull` sobre `device-unpair`.
- Las 22 que pasan: R2 (4), R4 (9), R6 (4), las filas `owner` de R3, R5 y R7, la enmienda `#199 R22` y la enmienda `opens the add-reminder route`. Las de R2, R4 y R6 pasan porque su producción ya está en esos commits.

**Pasada B.** Producción y tests de los commits `test` de R2, R4 y R6 (`612f4219`, `b7d2d7af` y `9a25520b`), y de `aafcb08e` para Peso.
- `Tests: 13 failed, 678 skipped, 11 passed, 702 total`, exit 1.
- R2: caen `family`, `walker` y `vet`, en `toEqual(tiles)`.
- R4: caen 7: las 3 filas no dueñas de A (`toHaveLength`), las 3 de B (`toBeNull`) y el `it` del cambio de mascota (espera agotada).
- R6: caen `family`, `walker` y `vet` con `Unable to find an element with testID: pairing-owner-only`, la espera que prescribe la spec.
- R1: verde en `aafcb08e`.
- `src/__tests__/ui-language.test.ts` en `9a25520b`: `2 failed, 35 passed, 37 total`. Caen `#65 R10 … (enmendado por #216 R6)` y `#65 R18 › resuelve cada ocurrencia de la tabla contra la clave exacta`. En los dos, la clave `pairing.errorForbiddenClaim` espera `"uses": 2` y recibe `"uses": 1`.

Las filas que nacen verdes son exactamente las siete de tasks.md: las filas `owner` de R2, R3, R4 A, R4 B, R5, R6 y R7. Ninguna fila no dueña nace verde, así que ningún candado de no dueño es tautológico.

## Sondas propias

Las planté en producción, las corrí con `-t "#216 R"` sobre home y reminders y las revertí. Resultado: `Tests: 4 failed, 436 skipped, 18 passed, 458 total`, exit 1.

| Id | Mutación | Filas rojas | Qué prueba |
|---|---|---|---|
| M1 | Home: `QUICK_ACTIONS.filter(({ testID }) => testID !== 'quick-action-reminder' \|\| isOwner).map(… => (` en lugar del `null` dentro del `map` | R2 `family`, `walker` y `vet`: tinta de Documentos esperada `--color-category-blue-strong`, recibida `--color-category-amber-strong` | El candado del índice que pide R2 («si el tile se filtra antes del `map`, Documentos recibe la tinta ámbar de la posición 1») muerde. El implementer no plantó esta sonda (Hallazgo 1) |
| M2 | Recordatorios: `isOwner` con `pets.data.pets.some(({ myRole }) => myRole === 'owner')` («alguna mascota») | Solo `#216 R4 al pasar a una mascota que no es del dueño, Nuevo se va` | El `it` del cambio de mascota atrapa un `isOwner` que no mire la seleccionada, como promete la spec. Las filas de una sola mascota siguen verdes, como se espera |

## Verde en HEAD (`0bb40b8d`)

- Los 4 ficheros de pantalla y `ui-language`: `Test Suites: 5 passed, 5 total`, `Tests: 751 passed, 751 total`, exit 0. Son los 714 de las pantallas más los 37 de ui-language.
- Guardas, `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ --testTimeout=30000`: `Test Suites: 74 passed, 74 total`, `Tests: 1581 passed, 1581 total`, exit 0, ninguna suite «failed to run».
  - Entre ellas pasan `design-drift` (`HEX_LITERAL` y `screenSignOutCalls`), `home-pingo-phrase` (`#190 R12`), `consistency-classnames`, `chunky-cta-canvas-fidelity`, `collar-alerts-canvas-fidelity`, `no-pets-states`, `routine-canvas-fidelity`, `health-weight-canvas-fidelity` y `ui-copy-table`.
- `test ! -e .expo/types/router.d.ts` se cumple: el fichero no existe. `bunx tsc --noEmit` sale con exit 0 y salida vacía.
- `bunx expo lint --no-cache <los 10 ficheros>`: exit 0 y log de 0 bytes.

## Discrepancias del reporte del implementer

1. **Diff desde `abdd87c8`: aceptada.** Los dos ficheros de más (`progress/current.md` y el handoff) los trae solo el commit de la Adenda del leader, `758e06c4`. Desde ese commit, la lista es exactamente la cerrada.
2. **Sonda de R2 reinterpretada: aceptada.** Entre las dos variantes se cubren los dos sentidos del candado.
   - La literal («quita `&& !isOwner`») esconde el tile a todos y tumba la fila `owner`.
   - La de intención (`&& false`) es idéntica al estado de antes de la feature y tumba las tres filas no dueñas.
   - Ninguna de las dos probaba el candado del índice que la spec nombra. Lo medí yo con M1 y muerde.
3. **Sonda de R6 (`isOwner ? (` → `!isOwner ? (`): aceptada.** Invertir la condición equivale a intercambiar las ramas: el dueño ve la nota y el no dueño el formulario. Caen las cuatro filas, que es lo que tiene que pasar con esa mutación.
4. **Ruta del lint: aceptada.** `*.log` está en `.gitignore`. Además repetí el lint de los 10 ficheros y sale limpio.

## Hallazgos

Ninguno bloquea.

1. **Baja (proceso).** La tabla de sondas del implementer no tiene ninguna que ataque el candado del índice de R2, aunque la spec lo nombra de forma explícita. El candado existe y muerde (M1). Queda anotado porque la revisión no puede fiarse de las sondas del mismo modelo que implementó.
2. **Baja (reporte).** En §Enmiendas, el reporte dice que `#199 R22` «gana su `getPet`». No es exacto: ese `it` gana `await screen.findByTestId('weight-form');`. El `getPet` por defecto lo pone el `beforeEach` de nivel superior (`mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() })`). El código sigue tasks.md al pie de la letra; solo falla la redacción.
3. **Informativo (riesgo de flake).** No se aplicó la enmienda condicional del helper `form()` de `#199 R7`, porque no hubo rojo que la pidiera. Ese helper espera `weight-log-empty` y comprueba `weight-form` de forma síncrona, así que depende de que `getPet` resuelva en el mismo vaciado que `listWeights`. Con los dos mocks ya resueltos es determinista. Si algún día sale rojo bajo carga, la corrección es la que ya prescribe tasks.md: `await screen.findByTestId('weight-form')` en el helper.
4. **Informativo (estado).** `feature_list.json` sigue con #216 en `spec_ready`. Moverlo le toca al leader al cerrar.
5. **Informativo (gate humano).** La casilla del smoke de #216 (lote G4) sigue vacía. Bloquea `done`, no esta aprobación.

## Output de ./init.sh

No lo corrí: la regla del leader para esta revisión lo prohíbe. Lo corre el job `verify` del CI de la PR (`bash ./init.sh`), y el leader debe confirmar que sale verde antes de mergear. Lo que sí corrí está arriba: los 5 ficheros afectados (751/751), las guardas (1581/1581), `tsc` y el lint de los 10 ficheros.
