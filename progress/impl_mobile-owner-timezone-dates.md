# Implementación — #90 `mobile-owner-timezone-dates`

Fecha: 2026-09-17
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend`
Branch: `feature/90-mobile-owner-timezone-dates`

## Preflight

- `git pull --ff-only`: `Already up to date.`
- `git branch --show-current`: `feature/90-mobile-owner-timezone-dates`.
- Skills cargadas antes de editar código: Expo `building-native-ui` (equivalente instalado de `expo-overview`), Expo `native-data-fetching` (equivalente instalado de `expo-data-fetching`) y Ponytail full.
- `mobile-pet-tracker/.expo/types/router.d.ts`: no existía.
- `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep`: sin salida, exit 1.
- `./init.sh`: exit 0; backend 170/170 suites, infra 2/2 suites, móvil 73/73 suites (1286 tests), E2E 27/30 ejecutadas (3 `aws-real-*` omitidas), lint y typecheck verdes.
- Spec aprobada y P1 aceptada verificadas en `specs/mobile-owner-timezone-dates/requirements.md`.

## R1 — `civilTodayIso`

### Rojo

Se añadió el test de los casos (a)–(e) y un esqueleto que ignora `timeZone` y devuelve el día local del dispositivo. Comando, desde `mobile-pet-tracker/`:

Commit rojo: `819fa5c9`.

```text
$ bunx jest --runTestsByPath src/utils/civil-today-iso.test.ts
FAIL src/utils/civil-today-iso.test.ts
  #90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo
    ✕ resuelve el mismo instante en Pacific/Kiritimati como 2026-09-18 (5 ms)
    ✓ resuelve el mismo instante en Pacific/Pago_Pago como 2026-09-17 (1 ms)
    ✓ rellena mes y día con cero (1 ms)
    ✓ usa el día del dispositivo sin zona
    ✓ usa el día del dispositivo sin lanzar para una zona inválida (1 ms)
    ✕ usa new Date() cuando now no se proporciona (1 ms)

  ● #90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo › resuelve el mismo instante en Pacific/Kiritimati como 2026-09-18

    Expected: "2026-09-18"
    Received: "2026-09-17"

  ● #90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo › usa new Date() cuando now no se proporciona

    Expected: "2026-09-18"
    Received: "2026-09-17"

Test Suites: 1 failed, 1 total
Tests:       2 failed, 4 passed, 6 total
Snapshots:   0 total
Time:        1.682 s
Ran all test suites within paths "src/utils/civil-today-iso.test.ts".
exit=1
```

Rojo válido: las dos fallas son por el día civil esperado; no hay `Cannot find module` ni `ReferenceError`.

### Verde

Se sustituyó el esqueleto por `Intl.DateTimeFormat('en-US', { timeZone, year, month, day }).formatToParts(now)`, reensamblando `year-month-day`; todo el camino queda dentro de `try/catch` y el `catch` usa los getters locales del dispositivo.

Commit verde: `fffd2434`.

```text
$ bunx jest --runTestsByPath src/utils/civil-today-iso.test.ts
PASS src/utils/civil-today-iso.test.ts
  #90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo
    ✓ resuelve el mismo instante en Pacific/Kiritimati como 2026-09-18 (19 ms)
    ✓ resuelve el mismo instante en Pacific/Pago_Pago como 2026-09-17 (1 ms)
    ✓ rellena mes y día con cero (1 ms)
    ✓ usa el día del dispositivo sin zona
    ✓ usa el día del dispositivo sin lanzar para una zona inválida
    ✓ usa new Date() cuando now no se proporciona (2 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        1.66 s, estimated 2 s
Ran all test suites within paths "src/utils/civil-today-iso.test.ts".
exit=0
```

- `bun run typecheck`: exit 0.
- `rg -n '\.format\(' src/utils/civil-today-iso.ts`: sin coincidencias, exit 1 esperado.

## R2 — catálogo y registro de copy

### Rojo

Se movió L1 como delta (`+ 1`, comentario `+ 1 de #90`) y se añadió el describe `#90 R2` antes del catálogo y de la fila normativa.

Commit rojo: `da18d263`.

```text
$ bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx
FAIL src/providers/__tests__/language-provider.test.tsx
  #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros
    ✕ mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (4 ms)
    ✓ #73 R5: el catalogo trae home.unknown y deviceConnectivity.offline en los dos idiomas y registrados en la tabla (5 ms)
    ✓ usa español por defecto, traduce e interpola sin ocultar parámetros ausentes (15 ms)
  #90 R2: el catálogo trae weightLog.dateCannotBeAfterToday en los dos idiomas y registrada en la tabla
    ✕ incluye la traducción y su fila normativa (1 ms)
  #65 R15: el locale de fechas y números sigue al idioma elegido
    ✓ maps es to es-MX (3 ms)
    ✓ maps en to en-US (2 ms)
  #78 R3: el catálogo trae las claves del centro de alertas
    ✓ incluye las catorce traducciones en inglés y español (2 ms)

Expected length: 305
Received length: 304

Expected: "Date cannot be after today"
Received: undefined

Test Suites: 1 failed, 1 total
Tests:       2 failed, 5 passed, 7 total
Snapshots:   0 total
Time:        1.822 s
Ran all test suites within paths "src/providers/__tests__/language-provider.test.tsx".
exit=1
```

Rojo válido: L1 falla 304 ≠ 305 y la clave es `undefined`.

### Verde

Se añadió `weightLog.dateCannotBeAfterToday` al final de ambos bloques `weightLog.` y su fila `← añadida por #90 (R2)` en §2.5. No se tocó aún `ui-copy-table.ts`.

Commit verde: `60923eef`.

```text
$ bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/ui-language.test.ts

Test Suites: 2 passed, 2 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        2.846 s
Ran all test suites within paths "src/providers/__tests__/language-provider.test.tsx", "src/__tests__/ui-language.test.ts".
exit=0
```

- `grep -c "^  '" src/i18n/catalog.ts`: `610`, exit 0 (base 608 + 2).

## R3 — fecha por defecto en la zona del perfil

### Elección de fake timers

Se probaron las dos variantes exigidas en este mismo fichero:

- `jest.useFakeTimers()`: 1 suite, 20 tests pasan y 6 fallan únicamente por el rojo esperado; `waitFor` y el árbol siguen avanzando.
- `jest.useFakeTimers({ doNotFake: ['requestAnimationFrame'] })`: el mismo resultado (1 suite, 20 pasan, los mismos 6 rojos), sin timeout ni diferencia observable.

Se conserva `jest.useFakeTimers()` sin opciones: es la variante mínima y mantiene vivos `waitFor`, TanStack Query y el árbol renderizado.

### Rojo

Se añadieron el mock raíz de `getMe`, el perfil completo, el reloj `2026-09-17T23:30:00Z`, el par Kiritimati/Pago_Pago y los cuatro candados anteriores con sufijo `(#90 R3)`. Todas las esperas de fecha terminan en `weight-date-input.props.value`.

Commit rojo: `c8ee54b1`.

Salida literal de la corrida elegida (`--silent` solo suprime el ruido de HeroUI, no filtra ni canaliza el proceso):

```text
$ bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/weight-log.test.tsx' --silent
FAIL src/app/(tabs)/__tests__/weight-log.test.tsx (7.049 s)
  ● R3: el formulario vuelve a sus valores iniciales al perder el foco › restaura los cuatro valores visibles tras el blur (#90 R3)

    expect(received).toBe(expected) // Object.is equality

    Expected: "2026-09-18"
    Received: "2026-09-17"

  ● R9: alta de peso con degradación por kind › renders the inline form with the local date prefilled (#90 R3)

    expect(received).toBe(expected) // Object.is equality

    Expected: "2026-09-18"
    Received: "2026-09-17"

  ● R9: alta de peso con degradación por kind › submits all fields, clears them, and refetches the list (#72 R2) (#90 R3)

    expect(received).toBe(expected) // Object.is equality

    Expected: "2026-09-18"
    Received: "2026-09-17"

  ● R9: alta de peso con degradación por kind › omits body condition when its field is blank (#90 R3)

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

      "http://example.test/v1",
      "jwt-token",
      "pet-1",
      Object {
    -   "measuredAt": "2026-09-18",
    +   "measuredAt": "2026-09-17",
        "weightKg": 12.4,
      },

    Number of calls: 1

  ● #90 R3: la fecha por defecto sale de la zona del perfil › usa Pacific/Kiritimati para el valor visible, el payload y el reset

    expect(received).toBe(expected) // Object.is equality

    Expected: "2026-09-18"
    Received: "2026-09-17"

  ● #90 R3: la fecha por defecto sale de la zona del perfil › usa Pacific/Pago_Pago para el valor visible, el payload y el reset

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "http://example.test/v1", "jwt-token"

    Number of calls: 0

Test Suites: 1 failed, 1 total
Tests:       6 failed, 20 passed, 26 total
Snapshots:   0 total
Time:        7.208 s
exit=1
```

Rojo válido: cinco fallas prueban la fecha del dispositivo (`09-17` frente a `09-18`) y Pago_Pago prueba que producción todavía no llama `getMe`; no hay `ReferenceError`.

### Verde

`WeightLogContent` consulta `userKeys.me()` inline mediante `getMe(baseUrl, token ?? '')`; lee la zona solo para `kind: 'ok'`. El estado pasó a `measuredAtDraft: string | null`, y el valor visible/enviado es `measuredAtDraft ?? civilTodayIso(profileTimeZone)`. El montaje, blur y éxito regresan el borrador a `null`.

Commit verde: `d79524cc`.

```text
$ bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/weight-log.test.tsx'
PASS src/app/(tabs)/__tests__/weight-log.test.tsx (7.035 s)

Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        7.206 s, estimated 8 s
Ran all test suites within paths "src/app/(tabs)/__tests__/weight-log.test.tsx".
exit=0
```

- `bun run typecheck`: exit 0.
- `rg -n "localTodayIso" 'src/app/(tabs)/weight-log.tsx' 'src/app/(tabs)/__tests__/weight-log.test.tsx'`: sin coincidencias, exit 1 esperado.
- Se actualizaron `specs/mobile-detail-screens-state-reset/traceability.md` y `specs/mobile-add-pet-photo-test-flake/traceability.md` con los títulos nuevos; no se alteraron sus requisitos.

## R4 — fallback al dispositivo (mutación M4)

### Rojo — M4 versionada

- M4-i: el fallback de `profileTimeZone` se mutó de `undefined` a `'Pacific/Kiritimati'`.
- M4-ii: se quitó el `try/catch` completo de `civilTodayIso`.
- Se añadieron los cinco escenarios de `#90 R4`; las ausencias de error se anclan primero a `weight-input`, y las fechas esperan directamente a `weight-date-input.props.value`.

Commit rojo con ambas mutaciones: `c6914614`.

```text
$ bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/weight-log.test.tsx' src/utils/civil-today-iso.test.ts --silent
FAIL src/utils/civil-today-iso.test.ts
  ● #90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo › usa el día del dispositivo sin lanzar para una zona inválida

    expect(received).not.toThrow()

    Error name:    "RangeError"
    Error message: "Invalid time zone specified: Not/A/Zone"

FAIL src/app/(tabs)/__tests__/weight-log.test.tsx (11.873 s)
  ● #90 R4: sin zona del perfil la fecha cae al dispositivo › usa el día del dispositivo mientras el perfil está pendiente

    Expected: "2026-09-17"
    Received: "2026-09-18"

  ● #90 R4: sin zona del perfil la fecha cae al dispositivo › usa el día del dispositivo cuando me devuelve unreachable

    Expected: "2026-09-17"
    Received: "2026-09-18"

  ● #90 R4: sin zona del perfil la fecha cae al dispositivo › usa el día del dispositivo cuando me devuelve error

    Expected: "2026-09-17"
    Received: "2026-09-18"

  ● #90 R4: sin zona del perfil la fecha cae al dispositivo › usa el día del dispositivo cuando me devuelve missing-config

    Expected: "2026-09-17"
    Received: "2026-09-18"

  ● #90 R4: sin zona del perfil la fecha cae al dispositivo › usa el día del dispositivo sin lanzar para una zona inválida

    RangeError: Invalid time zone specified: Not/A/Zone

Test Suites: 2 failed, 2 total
Tests:       6 failed, 31 passed, 37 total
Snapshots:   0 total
Time:        12.33 s
exit=1
```

Rojo válido: (a) y las tres filas de (b) fallan por la fecha mutada; (c) y R1(d) fallan por el `RangeError` de M4-ii. El timeout adicional de (c) es la consecuencia del error no capturado durante la actualización asíncrona de Query, no la causa del rojo.

### Verde — reversión de M4

Se restauró `undefined` para estados no `ok` y el `try/catch` completo del helper; no se cambió ninguna aserción de R4.

Commit verde que revierte ambas mutaciones: `7964d04c`.

```text
$ bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/weight-log.test.tsx' src/utils/civil-today-iso.test.ts --silent
PASS src/utils/civil-today-iso.test.ts
PASS src/app/(tabs)/__tests__/weight-log.test.tsx (5.897 s)

Test Suites: 2 passed, 2 total
Tests:       37 passed, 37 total
Snapshots:   0 total
Time:        6.288 s, estimated 12 s
exit=0
```

- `bun run typecheck`: exit 0.
- `rg -n "Pacific/Kiritimati" src --glob '!*.test.*'`: sin coincidencias, exit 1 esperado.

## R5 — 400 futuro traducido y formato crudo

### Rojo

Se reescribió el test del join con el contrato byte a byte, se añadió el caso P1 de formato crudo y se movió L3 como delta (`32 + 1`, fila nueva en `ui-copy-table.ts`).

Commit rojo: `26f6861b`.

```text
$ bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/weight-log.test.tsx' src/__tests__/ui-language.test.ts --silent
FAIL src/__tests__/ui-language.test.ts
  ● #65 R5: Health resuelve su copy por clave › resuelve las 33 ocurrencias normativas

      Object {
        "file": "src/app/(tabs)/weight-log.tsx",
        "key": "weightLog.dateCannotBeAfterToday",
    -   "uses": 1,
    +   "uses": 0,
      }

  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

      Object {
        "file": "src/app/(tabs)/weight-log.tsx",
        "key": "weightLog.dateCannotBeAfterToday",
    -   "uses": 1,
    +   "uses": 0,
      }

FAIL src/app/(tabs)/__tests__/weight-log.test.tsx (6.531 s)
  ● R9: alta de peso con degradación por kind › joins backend validation messages, translating the future-date one (#90 R5)

    - Expected  - 1
    + Received  + 1

      Weight is too high
    - La fecha no puede ser posterior a hoy
    + measuredAt is too far in the future

Test Suites: 2 failed, 2 total
Tests:       3 failed, 53 passed, 56 total
Snapshots:   0 total
Time:        6.963 s
exit=1
```

Rojo válido: el mensaje futuro sigue crudo y los dos `checkUses` cuentan 0 frente a 1. El nuevo test de `Invalid ISO date` ya pasa, fijando P1. La longitud de L3 pasa porque la fila y el delta se añaden juntos, como ordena `tasks.md`; el candado rojo vivo es `checkUses`.

### Verde

Se añadió una sola constante `MEASURED_AT_IN_FUTURE_MESSAGE` y el `map` sustituye únicamente `path === 'measuredAt' && message === MEASURED_AT_IN_FUTURE_MESSAGE`; conserva orden, mensajes restantes y `join('\n')`.

Commit verde: `b9dc4b69`.

```text
$ bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/weight-log.test.tsx' src/__tests__/ui-language.test.ts --silent
PASS src/__tests__/ui-language.test.ts
PASS src/app/(tabs)/__tests__/weight-log.test.tsx (7.234 s)

Test Suites: 2 passed, 2 total
Tests:       56 passed, 56 total
Snapshots:   0 total
Time:        7.766 s
exit=0
```

```text
$ bunx jest --runTestsByPath src/__tests__/ui-language.test.ts src/providers/__tests__/language-provider.test.tsx --silent
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/ui-language.test.ts

Test Suites: 2 passed, 2 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        2.425 s, estimated 3 s
exit=0
```

- `bun run typecheck`: exit 0.
- Los valores de catálogo no aparecen literales en `weight-log.tsx` (rg sin coincidencias, exit 1).
- `t('weightLog.dateCannotBeAfterToday')` aparece exactamente una vez, en la línea del mapeo.

## R6 — regresión de `birthDate` (mutación M6)

### Rojo — M6 versionada

Se añadió `#90 R6` después de `#72 R4`, con `jest.useFakeTimers()` (misma variante mínima validada en R3), reloj `23:30Z` y un `Date` real cuyos getters UTC están sesgados al día 18. Hereda el `beforeEach` raíz de `expo-image-picker` y no pulsa `add-pet-photo`. M6 cambió únicamente `dateToIso` a getters UTC.

Commit rojo con M6: `48e8206f`.

```text
$ bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --silent
FAIL src/screens/add-pet/index.test.tsx (11.014 s)
  ● #90 R6: birthDate manda el día civil local del picker, no el UTC › envía los getters locales aunque los getters UTC estén en el día siguiente

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "http://example.test/v1", "jwt-token", ObjectContaining {"birthDate": "2026-09-17"}
    Received: "http://example.test/v1", "jwt-token", {"birthDate": "2026-09-18", "name": "Nala", "species": "dog"}

    Number of calls: 1

Test Suites: 1 failed, 1 total
Tests:       1 failed, 19 passed, 20 total
Snapshots:   0 total
Time:        11.171 s
exit=1
```

Rojo válido: la única falla es el payload UTC `2026-09-18` frente al día local `2026-09-17`; no aparece `PICKER_MOCK_UNARMED`.

### Verde — reversión de M6

Se restauraron `getFullYear`/`getMonth`/`getDate` y no se cambió el test.

Commit verde que revierte M6: `224a8b5c`.

```text
$ bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --silent
PASS src/screens/add-pet/index.test.tsx (5.392 s)

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        5.516 s, estimated 12 s
exit=0
```

- `bun run typecheck`: exit 0.
- `git diff origin/main -- mobile-pet-tracker/src/screens/add-pet/index.tsx`: vacío (0 bytes).
- El bloque `#90 R6` no contiene `add-pet-photo` ni llama `pressPickPhoto()`.

## R7 — verificación final

Todas las mediciones de R7 se hicieron directamente sobre la salida de cada
comando, sin pipes.

| Verificación | Resultado |
|---|---|
| `mobile-pet-tracker/.expo/types/router.d.ts` | Ya estaba ausente; `test ! -e …` confirma ausencia, exit 0. |
| `bun run typecheck` | `tsc --noEmit`, exit 0. |
| `bun run lint` | `expo lint`, exit 0. |
| `bunx jest --listTests` | Exit 0; `S = 74` rutas contadas directamente desde la salida. |
| `bun run test` | Exit 0; `Test Suites: 74 passed, 74 total`; `Tests: 1302 passed, 1302 total`; `N = S = 74`. |
| C8: `rg -n '#[0-9a-fA-F]{3,8}\b\|StyleSheet\.create\|\[[0-9]+px\]' …` | Cero coincidencias; exit 1 esperado de `rg`. |
| `grep -c "^  '" src/i18n/catalog.ts` | `610`, exit 0 (608 + 2 entradas bilingües). |
| Diff de `package.json` y `bun.lock` contra `origin/main` | Vacío, exit 0. |
| Diff de los ficheros que no se tocan y `backend-pet-tracker/` | Vacío, exit 0. Incluye `add-pet/index.tsx`, perfil, query provider, APIs/tipos, helpers de test, dependencias y todo backend. |
| `pgrep -af 'init\.sh\|test:e2e\|jest-e2e'` antes del gate | Sin salida, exit 1; no había otro gate activo. |
| `./init.sh` desde la raíz | Exit 0: build verde; backend 170/170 suites y 1295/1295 tests; infra 2/2 y 14/14; móvil 74/74 y 1302/1302; E2E 27 pasadas de 30, 3 suites omitidas, 384 pasados y 8 omitidos de 392; lint y typecheck verdes. |

El diff de implementación desde el handoff `19c853e3` contiene 14 ficheros: los
12 finales de la lista cerrada de diseño (sin el `add-pet/index.tsx` transitorio)
y las dos traceabilities ajenas que el propio handoff obliga a sincronizar al
cambiar títulos de #63 y #72. El diff completo contra `origin/main` contiene
además los siete ficheros de preparación/spec ya presentes en la branch al
recibirla (`95678193..19c853e3`). No hay cambios de dependencias, backend, CI,
`init.sh` ni AWS real.

## Gate humano — smoke Android/Hermes

Ejecutado por el humano siguiendo los pasos 1–7 de
`specs/mobile-owner-timezone-dates/requirements.md` §Gate humano.

- **Fecha/hora**: 2026-09-17 09:48 (hora CDMX).
- **Zona del perfil**: `America/Mexico_City`.
- **Zona del dispositivo**: `Asia/Tokyo`.
- **Build**: dev build de Android.

| Paso | Resultado |
|---|---|
| 2. Default | Muestra `2026-09-17` (día CDMX) — OK |
| 3. Hoy → 201 | Fila nueva con `2026-09-17` — OK |
| 4. Mañana → 400 traducido | `La fecha no puede ser posterior a hoy` — OK |
| 5. Formato → crudo | `2026-13-45` → `Invalid ISO date` — OK |
| 6. Fallback (modo avión) | Fecha del dispositivo (Tokio), sin error de formulario — OK |

Gate humano superado sin señales de desviación en `Intl` con `timeZone` bajo
Hermes.
