Estado: COMPLETO

# impl: mobile-role-aware-actions (#216)
Fecha: 2026-10-27T14:52Z
Implementador: subagente `implementer` (Claude Code), según la Adenda 1 del handoff. No se lanzó `./init.sh` ni se usó Monitor.

## Discrepancias del handoff (para el leader y el reviewer)

Ninguna afecta al código. No paré por ellas porque ninguna es una cifra del árbol que no cuadre con la spec: son de redacción o de medida en el propio handoff.

1. **Diff final desde `abdd87c8`.** `git diff --name-only abdd87c8..HEAD` da la lista cerrada + reporte + traceability **y además** `progress/current.md` y `progress/handoff_mobile-role-aware-actions.md`. Esos dos ficheros los trae solo el commit de la Adenda del leader (`758e06c4`), que la propia Adenda cuenta dentro del rango. Ningún commit mío los toca. `git diff --name-only 758e06c4..HEAD` es exactamente la lista cerrada + `progress/impl_mobile-role-aware-actions.md` + `specs/mobile-role-aware-actions/traceability.md`.
2. **Sonda de R2, redacción literal.** «quita `&& !isOwner`» deja `testID === 'quick-action-reminder' ? null : (`, que esconde el tile a todos. Cae la fila `owner`, no las otras tres. La intención (el tile vuelve para todos, como antes de la feature) es `&& !isOwner` → `&& false`. Con ella caen `family`, `walker` y `vet`, que son las filas que espera el handoff. Corrí las dos variantes y las dos están abajo.
3. **Sonda de R6.** «invierte las dos ramas del ternario» se plantó como `isOwner ? (` → `!isOwner ? (`. Es el mismo comportamiento que intercambiar las ramas, con un diff de una línea.
4. **Ruta del lint.** tasks.md dice `/tmp/lint-216.log` y el handoff dice `../progress/lint-216.log` («salvo el lint (la ruta de arriba)»). Usé la del handoff. git ignora el fichero (`.gitignore:13:*.log`).

## Primer comando

```
$ cd /home/claude/sites/Pet-Tracker-wt-216 && pwd && git branch --show-current && git log --oneline -2
/home/claude/sites/Pet-Tracker-wt-216
feature/216-mobile-role-aware-actions
758e06c4 docs(progress): #216 handoff addendum 1 after the dev merge
abdd87c8 Merge remote-tracking branch 'origin/dev' into feature/216-mobile-role-aware-actions
```

La ruta, la branch y los dos commits son los que pide la Adenda 1 (la Adenda arriba, `abdd87c8` debajo).

## Anclas

**T0, en `abdd87c8` + Adenda, antes del primer test:** las 41 anclas dan su cifra «base», sin ninguna discrepancia.
- Peso: 0,0,0,0,1,1.
- Inicio: 0,0,0,3,1,1,0,1,1.
- Recordatorios: 0,0,0,0,1,1,1.
- Pairing: 0,0,0,1,1,2,1,1.
- Copy: 1,0,1,0,0,0.
- Comentarios `#216`: 0 en los cuatro de producción y 0 en los seis de test.

**Llegada, en `25ad085d`:** las 41 dan su cifra «después».
- Peso: 2,1,1,1,1,1.
- Inicio: 3,1,1,3,1,1,1,0,1.
- Recordatorios: 4,1,1,1,0,1,1.
- Pairing: 3,1,1,1,2,2,1,1.
- Copy: 2,1,0,1,1,1.
- Comentarios `#216`: 0 en los cuatro de producción. En los de test: weight-log 4, home 4, reminders 7, pairing 4, ui-copy-table 1, ui-language 2.

## Archivos modificados

Todos bajo `mobile-pet-tracker/`:
- `src/screens/weight-log/index.tsx` (R1):
  - `useQuery` de `getPet` bajo `petKeys.detail(petId)` y `isOwner`;
  - `{isOwner ? (<RiseIn delayMs={80}>…</RiseIn>) : null}`.
- `src/screens/home/index.tsx` (R2, R3):
  - `isOwner` con la lista;
  - el tile Recordatorio con `&& !isOwner` en el `map`;
  - `collar-pair-link` con `device === null && isOwner`.
- `src/screens/reminders/index.tsx` (R4, R5):
  - `isOwner` con `pets.data`;
  - `accessory` y `action` del vacío condicionados;
  - el `Button` de borrar/cancelar serie dentro de `{isOwner ? (…) : null}`.
- `src/screens/pairing/index.tsx` (R6, R7):
  - `isOwner` bajo `selectedPet`;
  - formulario o nota `pairing-owner-only`;
  - spacer y `device-unpair` en un fragmento condicional.
- `src/screens/weight-log/index.test.tsx`: R1 y la enmienda `#199 R22`.
- `src/screens/home/index.test.tsx`: R2 y R3.
- `src/screens/reminders/index.test.tsx`: R4, R5 y la enmienda `opens the add-reminder route`.
- `src/screens/pairing/index.test.tsx`: R6 y R7.
- `src/__tests__/ui-copy-table.ts`: la fila `// #216 R6` en `R10_PAIRING`.
- `src/__tests__/ui-language.test.ts`: `#65 R10` gana `+ 1`, el comentario y el nombre enmendado.

Arnés, solo en el commit final: `specs/mobile-role-aware-actions/traceability.md` y este reporte.

No se creó ningún fichero de producción.

## Commits y corridas

Todas las corridas se lanzaron con `bunx jest --runTestsByPath '<ruta>' --testTimeout=30000`, tras comprobar `pgrep` de jest y de init.sh vacíos, cada uno en su propio comando.

| Commit | Corrida | exit | Tests |
|---|---|---|---|
| `3a43f090` test R1 | weight-log `-t "#216 R1"` | 1 | 5 failed, 104 skipped, 1 passed, 110 total |
| `aafcb08e` feat R1 | weight-log entero | 0 | 110 passed, 110 total |
| `612f4219` test R2 | home `-t "#216 R2"` | 1 | 3 failed, 323 skipped, 1 passed, 327 total |
| `72eb564a` feat R2 | home entero | 0 | 327 passed, 327 total |
| `e7388a2c` test R3 | home `-t "#216 R3"` | 1 | 3 failed, 327 skipped, 1 passed, 331 total |
| `51a17821` feat R3 | home entero | 0 | 331 passed, 331 total |
| `b7d2d7af` test R4 | reminders `-t "#216 R4"` | 1 | 7 failed, 113 skipped, 3 passed, 123 total |
| `99d986a2` feat R4 | reminders entero | 0 | 123 passed, 123 total |
| `a8d8bc4e` test R5 | reminders `-t "#216 R5"` | 1 | 3 failed, 123 skipped, 1 passed, 127 total |
| `5c951a03` feat R5 | reminders entero | 0 | 127 passed, 127 total |
| `9a25520b` test R6 | pairing `-t "#216 R6"` | 1 | 3 failed, 138 skipped, 1 passed, 142 total |
| `9a25520b` test R6 | ui-language + ui-copy-table | 1 | 2 failed, 37 passed, 39 total (Suites: 1 failed, 1 passed) |
| `9424f976` feat R6 | pairing + ui-language + ui-copy-table | 0 | 181 passed, 181 total (Suites: 3 passed) |
| `792ae211` test R7 | pairing `-t "#216 R7"` | 1 | 3 failed, 142 skipped, 1 passed, 146 total |
| `25ad085d` feat R7 | pairing entero | 0 | 146 passed, 146 total |

Causa de cada rojo:
- **R1.** Las cuatro filas caen en el `waitFor` de `getQueryData(petKeys.detail('pet-1'))` (Received `undefined`). El `it` de carga cae en `queryByTestId('weight-form')` `toBeNull`. El `passed` es `#199 R22 … (enmendado por #216 R1)`, que `-t` también selecciona.
- **R2.** `family`/`walker`/`vet` caen en el `toEqual(tiles)`: sobra `quick-action-reminder`.
- **R3.** `family`/`walker`/`vet` caen en `queryByTestId('collar-pair-link')` `toBeNull`.
- **R4.** Siete rojos:
  - A, `family`/`walker`/`vet`: `toHaveLength` (Received length 3);
  - B, `family`/`walker`/`vet`: `toBeNull` sobre `reminders-empty-action`/`reminders-add-link`;
  - el `it` del cambio de mascota: el `waitFor` agota el tiempo en `toBeNull`.

  La enmienda `opens the add-reminder route (enmendado por #216 R4)` sale verde ya en la corrida del rojo.
- **R5.** `family`/`walker`/`vet` caen por aserción: Expected length 2, Received length 3.
- **R6, pantalla.** `family`/`walker`/`vet` caen en la consulta: `Unable to find an element with testID: pairing-owner-only`, que es la espera que prescribe la spec.
- **R6, guardas.** Caen `#65 R10 … (enmendado por #216 R6)` y `#65 R18 › resuelve cada ocurrencia de la tabla contra la clave exacta`. En los dos: `uses: 2` esperado, `uses: 1` recibido para `pairing.errorForbiddenClaim`.
- **R7.** `family`/`walker`/`vet` caen en `expect(received).toBeNull()` sobre `device-unpair`.

## Filas que nacen verdes

Son exactamente las siete de la lista cerrada de tasks.md. En las siete: «nace verde: el dueño ya ve la acción hoy».
- R2: la fila `owner` de `#216 R2 con el rol %s los tiles son %j`.
- R3: la fila `owner` de `#216 R3 con el rol %s el enlace para vincular se pinta: %s`.
- R4: la fila `owner` del `it.each` A (`… y recordatorios la cabecera tiene %i hijos`).
- R4: la fila `owner` del `it.each` B (`… y sin recordatorios Nuevo se pinta: %s`).
- R5: la fila `owner` de `#216 R5 con el rol %s cada fila tiene %i hijos`.
- R6: la fila `owner` de `#216 R6 con el rol %s el formulario se pinta: %s`.
- R7: la fila `owner` de `#216 R7 con el rol %s desvincular se pinta: %s`.

En R1 no nace verde ninguna fila: la del dueño también espera a `getPet`, como dice tasks.md.

## Sondas

Todas se plantaron en producción y se revirtieron con `git checkout HEAD -- <ruta>`. Tras cada una, `git diff --quiet` y `git diff --cached --quiet` salieron limpios.

| R | Mutación | exit | Tests | Filas rojas |
|---|---|---|---|---|
| R1 | `myRole === 'owner'` → `myRole !== 'vet'` | 1 | 2 failed, 104 skipped, 4 passed | `family`, `walker` (esperado) |
| R2 (literal) | `testID === 'quick-action-reminder' && !isOwner` → `testID === 'quick-action-reminder'` | 1 | 1 failed, 323 skipped, 3 passed | `owner` (ver Discrepancia 2) |
| R2 (intención) | `&& !isOwner` → `&& false` | 1 | 3 failed, 323 skipped, 1 passed | `family`, `walker`, `vet` (esperado) |
| R3 | quitar `&& isOwner` | 1 | 3 failed, 327 skipped, 1 passed | `family`, `walker`, `vet` (esperado) |
| R4 | `accessory` sin condición y `action` del vacío como antes | 1 | 7 failed, 113 skipped, 3 passed | las seis filas no dueñas y el `it` del cambio de mascota (esperado) |
| R5 | `Button` fuera de `{isOwner ? (` (fichero de `HEAD~1`) | 1 | 3 failed, 123 skipped, 1 passed | `family`, `walker`, `vet` (esperado) |
| R6 | `isOwner ? (` → `!isOwner ? (` | 1 | 4 failed, 138 skipped | las cuatro (esperado) |
| R7 | spacer y `device-unpair` fuera del fragmento (fichero de `HEAD~1`) | 1 | 3 failed, 142 skipped, 1 passed | `family`, `walker`, `vet` (esperado) |

## Enmiendas aplicadas

- `#199 R22`: el `it` se renombró a `(enmendado por #216 R1)` y gana su `getPet`. Verde antes y después.
- `opens the add-reminder route (enmendado por #216 R4)`: ahora espera `reminders-add-link` con `findByTestId`.
- `R10_PAIRING` en `src/__tests__/ui-copy-table.ts`: la segunda fila `pairing.errorForbiddenClaim` con `// #216 R6`.
- `#65 R10` en `src/__tests__/ui-language.test.ts`:
  - la longitud pasa de `42 + 2 + 1 + 4 - 1 + 1` a `42 + 2 + 1 + 4 - 1 + 1 + 1`;
  - el comentario gana `; +1 #216 R6: la nota de solo lectura`;
  - el nombre del `it` gana `(enmendado por #216 R6)`.
- **La condicional del helper `form()` de `#199 R7` NO se aplicó.** No hubo rojo que la pidiera: el fichero de Peso entero sale verde (110/110) sin ella.

## Flakes

No vi ninguno. Home `#152 R8` y `#190 R5` no aparecieron en ninguna corrida del fichero entero de Inicio (327/327, 331/331 y 714/714 en la final). Tampoco aparecieron Peso `#199 R18`, Nutrición `#200 R9`/`#200 R10`, Salud `#168 R2` ni Perfil `#173 R5`.

Ruido que no es de #216: los logs de pairing traen `console.warn "color:foreground" is not a valid color or brush` (react-native-svg). Ya sale en la corrida del rojo, antes de tocar producción.

## Skills

- Cargadas:
  - `expo:expo-overview` (entrada);
  - `expo:expo-data-fetching` (la `useQuery` de `getPet` de R1, misma clave `petKeys.detail(petId)` que Inicio);
  - `appllama-app-design-skill`. De esta solo tomé el patrón (estado de solo lectura en lugar del formulario) y no hice llamadas al MCP de Appllama: la spec y la carta fijan todos los valores.
- No cargadas: `expo:expo-native-ui` y `expo:expo-tailwind-setup`. La feature solo envuelve en condicionales nodos que ya existen. La única clase nueva, la de `pairing-owner-only`, es literal de la spec y copia la de `geofence-editor-read-only`. Tampoco cargué `expo-router`, `expo-animation`, `expo-ui` ni `expo-design-system`: no hay navegación, animación, control ni token nuevos.
- No encontradas: ninguna. Todas las que nombra la carta existen en Claude Code.

## Verificación final

Desde `/home/claude/sites/Pet-Tracker-wt-216/mobile-pet-tracker`:

- `test ! -e .expo/types/router.d.ts` → no existe. `bunx tsc --noEmit` → exit 0 y salida vacía.
- `bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/screens/home/index.test.tsx src/screens/reminders/index.test.tsx src/screens/pairing/index.test.tsx --testTimeout=30000` → exit 0:
  ```
  PASS src/screens/weight-log/index.test.tsx (16.519 s)
  PASS src/screens/pairing/index.test.tsx (20.715 s)
  PASS src/screens/reminders/index.test.tsx (11.789 s)
  PASS src/screens/home/index.test.tsx (47.376 s)
  Test Suites: 4 passed, 4 total
  Tests:       714 passed, 714 total
  ```
- Suite de guardas, `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ --testTimeout=30000` → exit 0. Ninguna suite «failed to run».
  ```
  Test Suites: 74 passed, 74 total
  Tests:       1581 passed, 1581 total
  ```
- Lint, `bunx expo lint --no-cache > ../progress/lint-216.log 2>&1 && test ! -s ../progress/lint-216.log && echo LINT_OK` → `LINT_OK`, con el log en 0 bytes.
- `grep -noE '#216.{0,3}' <los diez ficheros> | grep -vE '#216 R[1-7]'` → ninguna línea (exit 1 del segundo grep). Los ficheros de test suman 22 apariciones de `#216`, todas `#216 R<n>`.
- Anclas: las 41 en su cifra «después» (ver §Anclas).
- Árbol limpio: el chequeo acotado del handoff (`git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`) da `TREE_CLEAN`, y `git status --short` sale vacío antes del commit final.
- Cuenta de commits: `git log --oneline abdd87c8..HEAD`, de abajo arriba:
  - `758e06c4` (Adenda);
  - los 14 de la cadena: `3a43f090`, `aafcb08e`, `612f4219`, `72eb564a`, `e7388a2c`, `51a17821`, `b7d2d7af`, `99d986a2`, `a8d8bc4e`, `5c951a03`, `9a25520b`, `9424f976`, `792ae211`, `25ad085d`. Son 7 `test` + 7 `feat`, sin `refactor`;
  - el final, `docs(mobile): #216 traceability and implementation report`, que es el que contiene este reporte.

  Total: 16.
- Diff final: ver Discrepancia 1.

## Decisiones de diseño

- Las formas literales de `isOwner` y de cada condición son las de design.md, sin hook ni util, porque el ancla cuenta una declaración por pantalla.
- En la nota de R6 el `Text` cuelga directo del ternario, sin `RiseIn`, como `geofence-editor-read-only`.
- En R7, el spacer y el botón van juntos en un fragmento. El fragmento no añade nodo, así que `#203 R6` (mismo padre, el spacer justo antes del botón) sigue verde.

## Notas para el reviewer

- Discrepancias 1 a 3: el diff con los dos ficheros del leader y las dos sondas reinterpretadas (R2 y R6).
- R5 y R6 usan `toHaveProperty('props.…')` sobre `row.children[n]`, el mismo idioma que el `it` ya existente `ordena mosaico, columna y borrar con la anatomía exacta de cada fila`.
- Los valores de los tests son literales: no se importa ninguno de producción.

## Smoke del humano

Va en el reporte, tal cual; el humano lo corre en dispositivo (lote G4 de `progress/smoke_mejoras-producto.md`). Tú no lo corres:
  - Con una cuenta familiar (no dueña) de una mascota:
    - Peso: se ven la gráfica y el historial, no el formulario;
    - Inicio: no hay tile «Recordatorio» y, sin collar, la tarjeta del collar no tiene el enlace para vincularlo (la tarjeta y su estado sí);
    - Recordatorios: no hay «Nuevo» ni en la cabecera ni en el vacío, y ninguna fila tiene borrar ni cancelar serie;
    - Vincular collar: sin collar, sale la nota «Solo el dueño puede vincular un collar.» en lugar del formulario; con collar, no hay «Desvincular».
  - Con la cuenta dueña: todo lo anterior sigue igual que hoy.
  - Cambiar de una mascota propia a una ajena y volver: las acciones desaparecen y vuelven.
