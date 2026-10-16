# Informe de implementación — #183 mobile-account-client-validation

Estado actual: **Reanudacion 1 verificada — c1–c14 y CIERRE completos; R8 pendiente (humano)**. Suite móvil: **111 suites / 3506 tests verdes**. La primera parada se conserva abajo como historia.

H0: `56a0b84a67ff6594e5a149d91561e5fca376f36a`.

## Comprobación inicial (antes de tocar código)

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-183
$ git branch --show-current
feature/183-mobile-account-client-validation
$ git status --short
```

`git status --short` no produjo salida.

El handoff prevalece sobre AGENTS.md: no se ejecutará `./init.sh`, ni se hará push o PR, ni se editarán los archivos reservados al leader.

R8: pendiente (humano).

## T0

Desde `mobile-pet-tracker/`, en el orden literal del handoff:

```text
1
1
1
1
1
1
0
0
exit=0
0
4
2
exit=0
Test Suites: 8 passed, 8 total
Tests:       300 passed, 300 total
```

Las doce anclas y el gate coinciden. Log completo: `/tmp/jest-t0-183.log`.

## Skills cargadas

- `ponytail:ponytail`.
- `building-native-ui` del plugin expo, localizada en `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- `.agents/skills/appllama-app-design-skill/SKILL.md`.

También leídos requirements, design, tasks, la sección de esperas de conventions, architecture y ui-guidelines. Consultada la [documentación versionada de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) exigida por el AGENTS.md móvil. La spec prevalece: no se añaden estilos ni componentes, y la verificación visual corresponde a R8 humano.

El informe se conserva en memoria durante los commits c1–c14 para respetar el árbol limpio tras cada commit; se escribe en su ruta definitiva al cerrar.

## Commits y verificaciones

### Parada obligatoria en c1 (sin commit)

El handoff declara **B4 = 398**. El catálogo sin modificar de H0 contiene **402** claves en cada idioma. Por eso la fórmula ordenada en c1, con `+ 9`, espera **411**, en lugar de 407. Se detiene el guion conforme a «Si algo no cuadra, PARA y reporta». No se corrigen tests, anclas, producción ni handoff para hacer coincidir la base.

| Paso | Hash | Mensaje previsto | Resultado |
|---|---|---|---|
| c1 | sin commit; HEAD sigue en H0 | `test(mobile): copy de validación (#183 R1)` | `Tests:       2 failed, 35 passed, 37 total` |

Los dos bloques `●` se compararon antes de seguir: ambos coinciden con los títulos y tipos esperados.

| Bloque `●` (título completo) | Tipo observado |
|---|---|
| `#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` | aserción `toHaveLength`: esperado 411, recibido 402 |
| `#183 R1: el copy de la validación en cliente › #183 R1: declara las claves de validación en los dos idiomas y su registro` | aserción `toBe`: esperado `Enter your first name`, recibido `undefined` |

Anclas de c1, en el orden del handoff:

```text
$ command grep -cF '        - 4 + 3 // #173 R13' src/providers/__tests__/language-provider.test.tsx
1
$ command grep -cF '        + 9, // #183 R1' src/providers/__tests__/language-provider.test.tsx
1
$ command grep -cF '        - 4 + 3, // #173 R13' src/providers/__tests__/language-provider.test.tsx
0
```

Comando ejecutado desde `mobile-pet-tracker/`:

```sh
bunx jest --testTimeout=30000 --runTestsByPath src/providers/__tests__/language-provider.test.tsx > /tmp/jest-c1-183.log 2>&1; echo "exit=$?"
```

Salida de exit y contenido íntegro del log:

```text
exit=1
FAIL src/providers/__tests__/language-provider.test.tsx
  #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros
    ✕ mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (5 ms)
    ✓ #95 R5: el catálogo ya no trae las seis claves de volver (7 ms)
    ✓ #73 R5: el catalogo trae home.unknown y deviceConnectivity.offline en los dos idiomas y registrados en la tabla (4 ms)
    ✓ usa español por defecto, traduce e interpola sin ocultar parámetros ausentes (16 ms)
  #98 R3: el catálogo trae las cuatro claves de comidas servidas
    ✓ registra las cuatro claves en los dos idiomas y en la tabla de la spec de idioma (2 ms)
  #173 R13: Perfil retira cuatro claves y añade tres
    ✓ declara profile.gpsLinked en ambos idiomas y registra su añadido (1 ms)
    ✓ declara profile.gpsNoCollar en ambos idiomas y registra su añadido (4 ms)
    ✓ declara profile.gpsCollar en ambos idiomas y registra su añadido (1 ms)
    ✓ retira profile.information de ambos idiomas y documenta la retirada
    ✓ retira profile.gpsSettings de ambos idiomas y documenta la retirada (1 ms)
    ✓ retira profile.account de ambos idiomas y documenta la retirada
    ✓ retira profile.useLightTheme de ambos idiomas y documenta la retirada
  #41 R1: el catálogo trae las once claves de zonas seguras
    ✓ registra las once claves en los dos idiomas y en la tabla de la spec de idioma (4 ms)
  #146 R1: el catálogo trae las claves del editor de zonas
    ✓ registra las claves del editor en los dos idiomas y en la tabla de la spec de idioma (4 ms)
  #100 R1: el catálogo trae las tres claves del detalle de alerta
    ✓ registra las tres claves en los dos idiomas y en la tabla de la spec de idioma (2 ms)
  #90 R2: el catálogo trae weightLog.dateCannotBeAfterToday en los dos idiomas y registrada en la tabla
    ✓ incluye la traducción y su fila normativa (4 ms)
  #65 R15: el locale de fechas y números sigue al idioma elegido
    ✓ maps es to es-MX (2 ms)
    ✓ maps en to en-US (2 ms)
  #78 R3: el catálogo trae las claves del centro de alertas
    ✓ incluye las catorce traducciones en inglés y español (1 ms)
  #147 R1: el catálogo trae las nueve claves del horario editable
    ✓ registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma (3 ms)
  #105 R5: meals history copy matches the approved bilingual table
    ✓ registers food.mealsHistory in both languages and the design table (1 ms)
    ✓ registers food.mealsHistoryLinkSubtitle in both languages and the design table (1 ms)
    ✓ registers mealsHistory.mealsHistory in both languages and the design table
    ✓ registers mealsHistory.previousMonth in both languages and the design table
    ✓ registers mealsHistory.nextMonth in both languages and the design table (1 ms)
    ✓ registers mealsHistory.emptyMonth in both languages and the design table (1 ms)
    ✓ registers mealsHistory.noMealsOnDay in both languages and the design table
    ✓ registers mealsHistory.servedOne in both languages and the design table
    ✓ registers mealsHistory.servedMany in both languages and the design table (1 ms)
  #117 R1: el catálogo trae las claves de recuperar contraseña
    ✓ registra las seis claves en los dos idiomas, con {{email}} en forgot.sentTo, y en la tabla de la spec de idioma (2 ms)
    ✓ retira forgot.comingSoon de los dos idiomas
  #158 R1: claves y nueva frase de Pingo
    ✓ #158 R1: declara los 13 pares exactos y su registro (5 ms)
  #167 R5: el saludo de Pingo en login
    ✓ #167 R5: declara login.pingoGreeting en los dos idiomas y su registro (1 ms)
  #169 R9: claves de peso nuevas
    ✓ registra las dos claves en los dos idiomas y en la tabla de la spec de idioma (1 ms)
  #170 R1: claves de alertas agrupadas y mini-mapa
    ✓ #170 R1: declara los 7 pares exactos y su registro (2 ms)
  #172 R16: el copy de las pantallas de cuenta como el canvas
    ✓ #172 R16: declara las claves de cuenta en los dos idiomas y su registro (2 ms)
  #183 R1: el copy de la validación en cliente
    ✕ #183 R1: declara las claves de validación en los dos idiomas y su registro (1 ms)

  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas

    expect(received).toHaveLength(expected)

    Expected length: 411
    Received length: 402
    Received array:  ["addPet.addPet", "addPet.age", "addPet.approxMonths", "addPet.avatarPreview", "addPet.basicDetails", "addPet.birthDate", "addPet.breed", "addPet.cat", "addPet.celebrateBody", "addPet.celebrateLater", …]

      53 |     const spanishKeys = Object.keys(es).sort();
      54 |
    > 55 |     expect(englishKeys).toHaveLength(
         |                         ^
      56 |       260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9 // #105 R5
      57 |         + 6 - 1 // #117 R1
      58 |         + 8 // #118 R1

      at Object.toHaveLength (src/providers/__tests__/language-provider.test.tsx:55:25)

  ● #183 R1: el copy de la validación en cliente › #183 R1: declara las claves de validación en los dos idiomas y su registro

    expect(received).toBe(expected) // Object.is equality

    Expected: "Enter your first name"
    Received: undefined

      665 |
      666 |     for (const [key, englishValue, spanishValue] of translations) {
    > 667 |       expect(english[key]).toBe(englishValue);
          |                            ^
      668 |       expect(spanish[key]).toBe(spanishValue);
      669 |       expect(languageDesign).toMatch(
      670 |         new RegExp(

      at Object.toBe (src/providers/__tests__/language-provider.test.tsx:667:28)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 35 passed, 37 total
Snapshots:   0 total
Time:        2.277 s
Ran all test suites within paths "src/providers/__tests__/language-provider.test.tsx".

```

Comprobación de solo lectura de la discrepancia:

```sh
cd /home/claude/sites/Pet-Tracker-wt-183/mobile-pet-tracker
bun -e "import { en, es } from './src/i18n/catalog'; console.log('en=' + Object.keys(en).length); console.log('es=' + Object.keys(es).length);"
git diff --quiet 56a0b84a67ff6594e5a149d91561e5fca376f36a -- src/i18n/catalog.ts; echo "catalogo-H0=$?"
```

Salida literal:

```text
en=402
es=402
catalogo-H0=0
```

## Sondas, cierre y estado final

- Ninguna sonda ejecutada: el guion se detuvo en c1 antes del commit.
- c2–c14, posible c15 y CIERRE: no ejecutados.
- No se ejecutaron typecheck, lint, suite móvil completa ni `./init.sh`.
- Sin commits, push, PR, amend, rebase, merge ni prettier.
- Sin cambios de producción, backend, mocks del par sites-99 o archivos reservados al leader.
- Se deja el cambio de tests de c1 sin commit para revisión y este informe en la ruta solicitada. No se modifica traceability porque ningún requisito llegó a verde.
- R8: **pendiente (humano)**.

## Desviaciones

1. B4 del handoff (398) no coincide con H0 (402), confirmado sin modificar el catálogo. Esta es la causa de la parada.
2. El informe se conservó temporalmente en memoria para no introducir un archivo ajeno a los commits de tests/implementación; se materializa al parar. No se llegó a hacer ningún commit.

Estado esperado tras escribir este informe, desde la raíz del worktree:

```text
 M mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
?? progress/impl_mobile-account-client-validation.md
```


## Reanudacion 1

La sección «Reanudación 1 — B4 era 402» del handoff confirma B4=402 y catálogo final de 411 claves. H0 sigue siendo `56a0b84a67ff6594e5a149d91561e5fca376f36a`. El único commit intermedio del leader es `0a98d7a0306ebfa10893570d3efef6c15d088a36`; no se modifica ni se cuenta como implementación.

### ANTES DE TOCAR NADA

Desde la raíz, salida literal de los pasos 1 y 2:

```text
$ git rev-list --count 56a0b84a..HEAD
1
$ git diff --name-only 56a0b84a HEAD
progress/current.md
progress/handoff_mobile-account-client-validation.md
$ git status --short
 M mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
?? progress/impl_mobile-account-client-validation.md
```

Las salidas coinciden exactamente. Desde ahora, el informe se conserva en su ruta y sin trackear, conforme a la regla 9 enmendada.

### c1 — gate repetido

Comando: `bunx jest --testTimeout=30000 --runTestsByPath src/providers/__tests__/language-provider.test.tsx`.

Resultado: `exit=1`, `Tests:       2 failed, 35 passed, 37 total`. Se compararon los títulos y tipos de ambos bloques antes de continuar: coinciden con la tabla y con la parada inicial (`#65 R12`, aserción `toHaveLength`, 402 frente a 411; `#183 R1`, aserción `toBe`, undefined frente a Enter your first name). Log íntegro: `/tmp/jest-c1-resume-183.log`.

### Tabla por commit

| Paso | Hash | Mensaje | Línea Tests: |
|---|---|---|---|
| c1 | `20a548ab9bf43b9be28515144e483028cc826d16` | `test(mobile): copy de validación (#183 R1)` | `Tests:       2 failed, 35 passed, 37 total` |

### c2 — gates

`Tests:       67 passed, 67 total`; TC: guarda `exit=0`, tsc `exit=0`; LINT: `exit=0`, `vacio=0`. Anclas: `18`, `9`, `1` en el orden del handoff.

### S1.1 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s1-1-183.log`.

```text
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 1

    - Array [
    -   "min",
    - ]
    + Array []

      72 |     expect(spanishKeys).toEqual(englishKeys);
      73 |     for (const key of englishKeys) {
    > 74 |       expect(markerNames(es[key as keyof typeof es])).toEqual(
         |                                                       ^
      75 |         markerNames(en[key as keyof typeof en]),
      76 |       );
      77 |     }

      at Object.toEqual (src/providers/__tests__/language-provider.test.tsx:74:55)

  ● #183 R1: el copy de la validación en cliente › #183 R1: declara las claves de validación en los dos idiomas y su registro

    expect(received).toBe(expected) // Object.is equality

    Expected: "Usa al menos {{min}} caracteres"
    Received: "Usa al menos 7 caracteres"

      666 |     for (const [key, englishValue, spanishValue] of translations) {
      667 |       expect(english[key]).toBe(englishValue);
    > 668 |       expect(spanish[key]).toBe(spanishValue);
          |                            ^
      669 |       expect(languageDesign).toMatch(
      670 |         new RegExp(
      671 |           '\\| — \\| `' + escapeRegExp(key) +

      at Object.toBe (src/providers/__tests__/language-provider.test.tsx:668:28)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 35 passed, 37 total
Snapshots:   0 total
Time:        3.073 s
```

S1.1: ambos títulos y tipos coinciden con la tabla (aserción). Salida literal de exit y restauración:

```text
exit=1
exit=0
cached=0
```

### S1.2 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s1-2-183.log`.

```text
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas

    expect(received).toHaveLength(expected)

    Expected length: 411
    Received length: 410
    Received array:  ["addPet.addPet", "addPet.age", "addPet.approxMonths", "addPet.avatarPreview", "addPet.basicDetails", "addPet.birthDate", "addPet.breed", "addPet.cat", "addPet.celebrateBody", "addPet.celebrateLater", …]

      53 |     const spanishKeys = Object.keys(es).sort();
      54 |
    > 55 |     expect(englishKeys).toHaveLength(
         |                         ^
      56 |       260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9 // #105 R5
      57 |         + 6 - 1 // #117 R1
      58 |         + 8 // #118 R1

      at Object.toHaveLength (src/providers/__tests__/language-provider.test.tsx:55:25)

  ● #183 R1: el copy de la validación en cliente › #183 R1: declara las claves de validación en los dos idiomas y su registro

    expect(received).toBe(expected) // Object.is equality

    Expected: "Use only letters A to Z"
    Received: undefined

      665 |
      666 |     for (const [key, englishValue, spanishValue] of translations) {
    > 667 |       expect(english[key]).toBe(englishValue);
          |                            ^
      668 |       expect(spanish[key]).toBe(spanishValue);
      669 |       expect(languageDesign).toMatch(
      670 |         new RegExp(

      at Object.toBe (src/providers/__tests__/language-provider.test.tsx:667:28)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 35 passed, 37 total
Snapshots:   0 total
Time:        2.339 s, estimated 3 s
```

S1.2: ambos títulos y tipos coinciden (aserción); salida literal de exit/restauración: `exit=1`, `exit=0`, `cached=0`.

| c2 | `ca6a57d9b05d59399c94ad766a17d1cbb109555e` | `feat(mobile): copy de validación (#183 R1)` | `Tests:       67 passed, 67 total` |

### c3 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-c3-183.log`.

```text
  ● Test suite failed to run

    Cannot find module './account-rules' from 'src/utils/account-rules.test.ts'

    However, Jest was able to find:
    	'./account-rules.test.ts'

    You might want to include a file extension in your import, or update your 'moduleFileExtensions', which is currently ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'].

    See https://jestjs.io/docs/configuration#modulefileextensions-arraystring

    > 1 | import {
        | ^
      2 |   EMAIL_PATTERN,
      3 |   validateLogin,
      4 |   validateRegister,

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.<anonymous> (src/utils/account-rules.test.ts:1:1)

  ● #65 R1: el grupo (auth) resuelve su copy por clave › resuelve las 50 ocurrencias normativas

    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-183/mobile-pet-tracker/src/utils/account-rules.ts'

      50 |   for (const [id, expected] of expectedCounts) {
      51 |     const [file, key] = id.split('\0');
    > 52 |     const source = readFileSync(join(SOURCE_ROOT, file), 'utf8');
         |                    ^
      53 |     const directCalls = source.match(
      54 |       new RegExp(`\\bt\\(\\s*['"]${escapeRegExp(key)}['"]`, 'g'),
      55 |     );

      at readFileSync (src/__tests__/ui-language.test.ts:52:20)
      at Object.checkUses (src/__tests__/ui-language.test.ts:73:5)

  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-183/mobile-pet-tracker/src/utils/account-rules.ts'

      50 |   for (const [id, expected] of expectedCounts) {
      51 |     const [file, key] = id.split('\0');
    > 52 |     const source = readFileSync(join(SOURCE_ROOT, file), 'utf8');
         |                    ^
      53 |     const directCalls = source.match(
      54 |       new RegExp(`\\bt\\(\\s*['"]${escapeRegExp(key)}['"]`, 'g'),
      55 |     );

      at readFileSync (src/__tests__/ui-language.test.ts:52:20)
      at Object.checkUses (src/__tests__/ui-language.test.ts:492:5)

  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › no deja ningún valor fijo del catálogo como literal entero en las pantallas

    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-183/mobile-pet-tracker/src/utils/account-rules.ts'

      505 |
      506 |     for (const file of SCREEN_FILES) {
    > 507 |       const literals = wholeLiterals(readFileSync(join(SOURCE_ROOT, file), 'utf8'));
          |                                      ^
      508 |       const looseCopy = FIXED_COPY.filter((entry) =>
      509 |         literals.has(norm(entry.value)),
      510 |       ).map((entry) => `${entry.language}:${entry.key} = ${entry.value}`);

      at readFileSync (src/__tests__/ui-language.test.ts:507:38)
      at Object._loop (src/__tests__/ui-language.test.ts:506:36)
Test Suites: 2 failed, 2 total
Tests:       3 failed, 27 passed, 30 total
Snapshots:   0 total
Time:        5.125 s
```

c3: `exit=1`. Comparados los cuatro bloques: suite que no arranca por Cannot find module y exactamente tres excepciones ENOENT en los títulos de la tabla.

| c3 | `b310900b7fc217a2f712a7b98cf5572d6fd3be55` | `test(mobile): reglas de cuenta iguales a los DTO (#183 R2)` | `Tests:       3 failed, 27 passed, 30 total` |

c4: gate `exit=0`, `Tests:       96 passed, 96 total`; TC: guarda `exit=0`, tsc `exit=0`; LINT: `exit=0`, `vacio=0`. Anclas R2: nueve labelKey con 1 cada una; import zod 0; regex literal 1.

### S2.1 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s2-1-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: EMAIL_PATTERN decide «alex@example.c» como z.email() de zod 4.4.3 (false)

    expect(received).toStrictEqual(expected) // deep equality

    Expected: false
    Received: true

      41 |     ['', false],
      42 |   ])('#183 R2: EMAIL_PATTERN decide «%s» como z.email() de zod 4.4.3 (%s)', (value, expected) => {
    > 43 |     expect(EMAIL_PATTERN.test(value)).toStrictEqual(expected);
         |                                       ^
      44 |   });
      45 |
      46 |   it.each<[string, { email?: string; password?: string }, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:43:39)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: EMAIL_PATTERN decide «alex.@example.com» como z.email() de zod 4.4.3 (false)

    expect(received).toStrictEqual(expected) // deep equality

    Expected: false
    Received: true

      41 |     ['', false],
      42 |   ])('#183 R2: EMAIL_PATTERN decide «%s» como z.email() de zod 4.4.3 (%s)', (value, expected) => {
    > 43 |     expect(EMAIL_PATTERN.test(value)).toStrictEqual(expected);
         |                                       ^
      44 |   });
      45 |
      46 |   it.each<[string, { email?: string; password?: string }, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:43:39)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: EMAIL_PATTERN decide «.alex@example.com» como z.email() de zod 4.4.3 (false)

    expect(received).toStrictEqual(expected) // deep equality

    Expected: false
    Received: true

      41 |     ['', false],
      42 |   ])('#183 R2: EMAIL_PATTERN decide «%s» como z.email() de zod 4.4.3 (%s)', (value, expected) => {
    > 43 |     expect(EMAIL_PATTERN.test(value)).toStrictEqual(expected);
         |                                       ^
      44 |   });
      45 |
      46 |   it.each<[string, { email?: string; password?: string }, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:43:39)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: EMAIL_PATTERN decide «a..b@example.com» como z.email() de zod 4.4.3 (false)

    expect(received).toStrictEqual(expected) // deep equality

    Expected: false
    Received: true

      41 |     ['', false],
      42 |   ])('#183 R2: EMAIL_PATTERN decide «%s» como z.email() de zod 4.4.3 (%s)', (value, expected) => {
    > 43 |     expect(EMAIL_PATTERN.test(value)).toStrictEqual(expected);
         |                                       ^
      44 |   });
      45 |
      46 |   it.each<[string, { email?: string; password?: string }, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:43:39)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: EMAIL_PATTERN decide «ñu@example.com» como z.email() de zod 4.4.3 (false)

    expect(received).toStrictEqual(expected) // deep equality

    Expected: false
    Received: true

      41 |     ['', false],
      42 |   ])('#183 R2: EMAIL_PATTERN decide «%s» como z.email() de zod 4.4.3 (%s)', (value, expected) => {
    > 43 |     expect(EMAIL_PATTERN.test(value)).toStrictEqual(expected);
         |                                       ^
      44 |   });
      45 |
      46 |   it.each<[string, { email?: string; password?: string }, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:43:39)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: EMAIL_PATTERN decide «alex@-example.com» como z.email() de zod 4.4.3 (false)

    expect(received).toStrictEqual(expected) // deep equality

    Expected: false
    Received: true

      41 |     ['', false],
      42 |   ])('#183 R2: EMAIL_PATTERN decide «%s» como z.email() de zod 4.4.3 (%s)', (value, expected) => {
    > 43 |     expect(EMAIL_PATTERN.test(value)).toStrictEqual(expected);
         |                                       ^
      44 |   });
      45 |
      46 |   it.each<[string, { email?: string; password?: string }, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:43:39)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: EMAIL_PATTERN decide «alex@example.co1» como z.email() de zod 4.4.3 (false)

    expect(received).toStrictEqual(expected) // deep equality

    Expected: false
    Received: true

      41 |     ['', false],
      42 |   ])('#183 R2: EMAIL_PATTERN decide «%s» como z.email() de zod 4.4.3 (%s)', (value, expected) => {
    > 43 |     expect(EMAIL_PATTERN.test(value)).toStrictEqual(expected);
         |                                       ^
      44 |   });
      45 |
      46 |   it.each<[string, { email?: string; password?: string }, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:43:39)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G11

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 1

    - Object {
    -   "email": Object {
    -     "labelKey": "forgot.invalidEmail",
    -   },
    - }
    + Object {}

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)
Test Suites: 1 failed, 1 total
Tests:       8 failed, 58 passed, 66 total
Snapshots:   0 total
Time:        2.344 s
```

### S2.2 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.2-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateLogin L2

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 5

    - Object {}
    + Object {
    +   "password": Object {
    +     "labelKey": "validation.passwordRequired",
    +   },
    + }

      52 |     ['L6', { email: 'a'.repeat(309) + '@example.com' }, {}],
      53 |   ])('#183 R2: validateLogin %s', (_label, changes, expected) => {
    > 54 |     expect(validateLogin({ email: 'alex@example.com', password: 'correct horse', ...changes })).toStrictEqual(expected);
         |                                                                                                 ^
      55 |   });
      56 |
      57 |   it.each<[string, Partial<typeof VALID>, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:54:97)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 passed, 66 total
Snapshots:   0 total
Time:        2.751 s, estimated 3 s
```

### S2.3 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.3-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G3

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 1

    - Object {
    -   "firstName": Object {
    -     "labelKey": "validation.firstNameRequired",
    -   },
    - }
    + Object {}

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 passed, 66 total
Snapshots:   0 total
Time:        2.496 s, estimated 3 s
```

### S2.4 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.4-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G7

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 1

    - Object {
    -   "lastName": Object {
    -     "labelKey": "validation.lastNameRequired",
    -   },
    - }
    + Object {}

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 passed, 66 total
Snapshots:   0 total
Time:        2.561 s, estimated 3 s
```

### S2.5 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.5-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G16

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 1

    - Object {
    -   "phone": Object {
    -     "labelKey": "validation.tooShort",
    -     "params": Object {
    -       "min": 7,
    -     },
    -   },
    - }
    + Object {}

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G20

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 8

    - Object {}
    + Object {
    +   "phone": Object {
    +     "labelKey": "validation.tooLong",
    +     "params": Object {
    +       "max": 20,
    +     },
    +   },
    + }

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 64 passed, 66 total
Snapshots:   0 total
Time:        2.382 s, estimated 3 s
```

### S2.6 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.6-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G4

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 8

    - Object {}
    + Object {
    +   "firstName": Object {
    +     "labelKey": "validation.tooLong",
    +     "params": Object {
    +       "max": 120,
    +     },
    +   },
    + }

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 passed, 66 total
Snapshots:   0 total
Time:        2.501 s, estimated 3 s
```

### S2.7 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.7-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G13

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 1

    - Object {
    -   "email": Object {
    -     "labelKey": "validation.tooLong",
    -     "params": Object {
    -       "max": 320,
    -     },
    -   },
    - }
    + Object {}

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateForgot F4

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 1

    - Object {
    -   "email": Object {
    -     "labelKey": "validation.tooLong",
    -     "params": Object {
    -       "max": 320,
    -     },
    -   },
    - }
    + Object {}

      100 |     ['F5', 'a'.repeat(321), { email: invalidEmail }],
      101 |   ])('#183 R2: validateForgot %s', (_label, email, expected) => {
    > 102 |     expect(validateForgot({ email })).toStrictEqual(expected);
          |                                       ^
      103 |   });
      104 |
      105 |   it.each<[string, string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:102:39)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 64 passed, 66 total
Snapshots:   0 total
Time:        2.542 s, estimated 3 s
```

### S2.8 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.8-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G28

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 1

    - Object {
    -   "password": Object {
    -     "labelKey": "validation.tooShort",
    -     "params": Object {
    -       "min": 8,
    -     },
    -   },
    - }
    + Object {}

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G33

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 0

      Object {
    -   "password": Object {
    -     "labelKey": "validation.tooShort",
    -     "params": Object {
    -       "min": 8,
    -     },
    -   },
        "passwordConfirmation": Object {
          "labelKey": "validation.passwordsDontMatch",
        },
      }

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateResetPassword N2

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 1

    - Object {
    -   "password": Object {
    -     "labelKey": "validation.tooShort",
    -     "params": Object {
    -       "min": 8,
    -     },
    -   },
    - }
    + Object {}

      112 |     ['N7', '1234567', 'x', { password: tooShort(8), passwordConfirmation: mismatch }],
      113 |   ])('#183 R2: validateResetPassword %s', (_label, password, passwordConfirmation, expected) => {
    > 114 |     expect(validateResetPassword({ password, passwordConfirmation })).toStrictEqual(expected);
          |                                                                       ^
      115 |   });
      116 | });
      117 |

      at toStrictEqual (src/utils/account-rules.test.ts:114:71)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateResetPassword N7

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 0

      Object {
    -   "password": Object {
    -     "labelKey": "validation.tooShort",
    -     "params": Object {
    -       "min": 8,
    -     },
    -   },
        "passwordConfirmation": Object {
          "labelKey": "validation.passwordsDontMatch",
        },
      }

      112 |     ['N7', '1234567', 'x', { password: tooShort(8), passwordConfirmation: mismatch }],
      113 |   ])('#183 R2: validateResetPassword %s', (_label, password, passwordConfirmation, expected) => {
    > 114 |     expect(validateResetPassword({ password, passwordConfirmation })).toStrictEqual(expected);
          |                                                                       ^
      115 |   });
      116 | });
      117 |

      at toStrictEqual (src/utils/account-rules.test.ts:114:71)
Test Suites: 1 failed, 1 total
Tests:       4 failed, 62 passed, 66 total
Snapshots:   0 total
Time:        3.063 s
```

### S2.9 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.9-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G29

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 8

    - Object {}
    + Object {
    +   "password": Object {
    +     "labelKey": "validation.tooShort",
    +     "params": Object {
    +       "min": 8,
    +     },
    +   },
    + }

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateResetPassword N3

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 8

    - Object {}
    + Object {
    +   "password": Object {
    +     "labelKey": "validation.tooShort",
    +     "params": Object {
    +       "min": 8,
    +     },
    +   },
    + }

      112 |     ['N7', '1234567', 'x', { password: tooShort(8), passwordConfirmation: mismatch }],
      113 |   ])('#183 R2: validateResetPassword %s', (_label, password, passwordConfirmation, expected) => {
    > 114 |     expect(validateResetPassword({ password, passwordConfirmation })).toStrictEqual(expected);
          |                                                                       ^
      115 |   });
      116 | });
      117 |

      at toStrictEqual (src/utils/account-rules.test.ts:114:71)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 64 passed, 66 total
Snapshots:   0 total
Time:        1.869 s, estimated 3 s
```

### S2.10 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.10-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G25

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 1

    - Object {
    -   "country": Object {
    -     "labelKey": "validation.countryLetters",
    -   },
    - }
    + Object {}

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 passed, 66 total
Snapshots:   0 total
Time:        1.786 s, estimated 2 s
```

### S2.11 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.11-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G21

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "country": Object {
    -     "labelKey": "validation.countryLength",
    +     "labelKey": "validation.countryLetters",
        },
      }

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G22

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "country": Object {
    -     "labelKey": "validation.countryLength",
    +     "labelKey": "validation.countryLetters",
        },
      }

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G23

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "country": Object {
    -     "labelKey": "validation.countryLength",
    +     "labelKey": "validation.countryLetters",
        },
      }

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G24

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "country": Object {
    -     "labelKey": "validation.countryLength",
    +     "labelKey": "validation.countryLetters",
        },
      }

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)
Test Suites: 1 failed, 1 total
Tests:       4 failed, 62 passed, 66 total
Snapshots:   0 total
Time:        1.801 s, estimated 2 s
```

### S2.12 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.12-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G14

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 4

      Object {
        "email": Object {
    -     "labelKey": "forgot.invalidEmail",
    +     "labelKey": "validation.tooLong",
    +     "params": Object {
    +       "max": 320,
    +     },
        },
      }

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)

  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateForgot F5

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 4

      Object {
        "email": Object {
    -     "labelKey": "forgot.invalidEmail",
    +     "labelKey": "validation.tooLong",
    +     "params": Object {
    +       "max": 320,
    +     },
        },
      }

      100 |     ['F5', 'a'.repeat(321), { email: invalidEmail }],
      101 |   ])('#183 R2: validateForgot %s', (_label, email, expected) => {
    > 102 |     expect(validateForgot({ email })).toStrictEqual(expected);
          |                                       ^
      103 |   });
      104 |
      105 |   it.each<[string, string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:102:39)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 64 passed, 66 total
Snapshots:   0 total
Time:        1.948 s, estimated 2 s
```

### S2.13 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.13-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateLogin L6

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 8

    - Object {}
    + Object {
    +   "email": Object {
    +     "labelKey": "validation.tooLong",
    +     "params": Object {
    +       "max": 320,
    +     },
    +   },
    + }

      52 |     ['L6', { email: 'a'.repeat(309) + '@example.com' }, {}],
      53 |   ])('#183 R2: validateLogin %s', (_label, changes, expected) => {
    > 54 |     expect(validateLogin({ email: 'alex@example.com', password: 'correct horse', ...changes })).toStrictEqual(expected);
         |                                                                                                 ^
      55 |   });
      56 |
      57 |   it.each<[string, Partial<typeof VALID>, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:54:97)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 passed, 66 total
Snapshots:   0 total
Time:        2.017 s
```

### S2.14 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-S2.14-183.log`.

```text
  ● #183 R2: reglas de cuenta iguales a los DTO › #183 R2: validateRegister G32

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 1

    - Object {
    -   "passwordConfirmation": Object {
    -     "labelKey": "validation.passwordsDontMatch",
    -   },
    - }
    + Object {}

      90 |     ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
      91 |   ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    > 92 |     expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
         |                                                        ^
      93 |   });
      94 |
      95 |   it.each<[string, string, Record<string, unknown>]>([

      at toStrictEqual (src/utils/account-rules.test.ts:92:56)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 passed, 66 total
Snapshots:   0 total
Time:        2.268 s
```

| c4 | `109e3da9d3642e5efc210c23342d64b18832082a` | `feat(mobile): reglas de cuenta iguales a los DTO (#183 R2)` | `Tests:       96 passed, 96 total` |

Sondas S2.1–S2.14: comparados todos los títulos y tipos antes de avanzar a la siguiente. Coinciden exactamente con la tabla R2, todos de aserción. Restauración literal de cada sonda:

S2.1:

```text
exit=1
exit=0
cached=0
```

S2.2:

```text
exit=1
exit=0
cached=0
```

S2.3:

```text
exit=1
exit=0
cached=0
```

S2.4:

```text
exit=1
exit=0
cached=0
```

S2.5:

```text
exit=1
exit=0
cached=0
```

S2.6:

```text
exit=1
exit=0
cached=0
```

S2.7:

```text
exit=1
exit=0
cached=0
```

S2.8:

```text
exit=1
exit=0
cached=0
```

S2.9:

```text
exit=1
exit=0
cached=0
```

S2.10:

```text
exit=1
exit=0
cached=0
```

S2.11:

```text
exit=1
exit=0
cached=0
```

S2.12:

```text
exit=1
exit=0
cached=0
```

S2.13:

```text
exit=1
exit=0
cached=0
```

S2.14:

```text
exit=1
exit=0
cached=0
```

### c5 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-c5-183.log`.

```text
  ● #183 R3: login valida en cliente › #183 R3: «» en login-email no llama a la API y marca el campo

    Unable to find an element with testID: login-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-login"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"login-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-header"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-greeting"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"login-pingo"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-bubble"[39m
                [36m>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"login-bubble-text"[39m
                  [36m>[39m
                    [0mQué bueno verte de nuevo.[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mIniciar sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mCorreo electrónico[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"login-email"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mContraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"login-password"[39m
                    [33mvalue[39m=[32m"correct horse"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"login-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-forgot"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0m¿Olvidaste tu contraseña?[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"login-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mIniciar sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-register"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCrear cuenta[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      433 |
      434 |   async function expectField(field: 'email' | 'password', message: string) {
    > 435 |     await waitFor(() => expect(screen.getByTestId(`login-${field}-message`)).toHaveTextContent(message));
          |                  ^
      436 |     const text = screen.getByTestId(`login-${field}-message`);
      437 |     const row = screen.getByTestId(`login-${field}-message-row`);
      438 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/login/index.test.tsx:435:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/screens/login/index.test.tsx:440:4)
      at apply (src/screens/login/index.test.tsx:434:29)
      at expectField (src/screens/login/index.test.tsx:445:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: «alex.example.com» en login-email no llama a la API y marca el campo

    Unable to find an element with testID: login-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-login"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"login-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-header"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-greeting"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"login-pingo"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-bubble"[39m
                [36m>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"login-bubble-text"[39m
                  [36m>[39m
                    [0mQué bueno verte de nuevo.[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mIniciar sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mCorreo electrónico[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"login-email"[39m
                  [33mvalue[39m=[32m"alex.example.com"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mContraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"login-password"[39m
                    [33mvalue[39m=[32m"correct horse"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"login-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-forgot"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0m¿Olvidaste tu contraseña?[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"login-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mIniciar sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-register"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCrear cuenta[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      433 |
      434 |   async function expectField(field: 'email' | 'password', message: string) {
    > 435 |     await waitFor(() => expect(screen.getByTestId(`login-${field}-message`)).toHaveTextContent(message));
          |                  ^
      436 |     const text = screen.getByTestId(`login-${field}-message`);
      437 |     const row = screen.getByTestId(`login-${field}-message-row`);
      438 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/login/index.test.tsx:435:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/screens/login/index.test.tsx:434:29)
      at expectField (src/screens/login/index.test.tsx:445:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: «alex@example.c» en login-email no llama a la API y marca el campo

    Unable to find an element with testID: login-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-login"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"login-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-header"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-greeting"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"login-pingo"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-bubble"[39m
                [36m>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"login-bubble-text"[39m
                  [36m>[39m
                    [0mQué bueno verte de nuevo.[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mIniciar sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mCorreo electrónico[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"login-email"[39m
                  [33mvalue[39m=[32m"alex@example.c"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mContraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"login-password"[39m
                    [33mvalue[39m=[32m"correct horse"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"login-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-forgot"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0m¿Olvidaste tu contraseña?[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"login-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mIniciar sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-register"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCrear cuenta[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      433 |
      434 |   async function expectField(field: 'email' | 'password', message: string) {
    > 435 |     await waitFor(() => expect(screen.getByTestId(`login-${field}-message`)).toHaveTextContent(message));
          |                  ^
      436 |     const text = screen.getByTestId(`login-${field}-message`);
      437 |     const row = screen.getByTestId(`login-${field}-message-row`);
      438 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/login/index.test.tsx:435:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/screens/login/index.test.tsx:434:29)
      at expectField (src/screens/login/index.test.tsx:445:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: «ñu@example.com» en login-email no llama a la API y marca el campo

    Unable to find an element with testID: login-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-login"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"login-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-header"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-greeting"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"login-pingo"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-bubble"[39m
                [36m>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"login-bubble-text"[39m
                  [36m>[39m
                    [0mQué bueno verte de nuevo.[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mIniciar sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mCorreo electrónico[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"login-email"[39m
                  [33mvalue[39m=[32m"ñu@example.com"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mContraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"login-password"[39m
                    [33mvalue[39m=[32m"correct horse"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"login-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-forgot"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0m¿Olvidaste tu contraseña?[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"login-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mIniciar sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-register"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCrear cuenta[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      433 |
      434 |   async function expectField(field: 'email' | 'password', message: string) {
    > 435 |     await waitFor(() => expect(screen.getByTestId(`login-${field}-message`)).toHaveTextContent(message));
          |                  ^
      436 |     const text = screen.getByTestId(`login-${field}-message`);
      437 |     const row = screen.getByTestId(`login-${field}-message-row`);
      438 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/login/index.test.tsx:435:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/screens/login/index.test.tsx:434:29)
      at expectField (src/screens/login/index.test.tsx:445:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: sin contraseña no llama a la API y marca login-password

    Unable to find an element with testID: login-password-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-login"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"login-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-header"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-greeting"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"login-pingo"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-bubble"[39m
                [36m>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"login-bubble-text"[39m
                  [36m>[39m
                    [0mQué bueno verte de nuevo.[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mIniciar sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mCorreo electrónico[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"login-email"[39m
                  [33mvalue[39m=[32m"alex@example.com"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mContraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"login-password"[39m
                    [33mvalue[39m=[32m""[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"login-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-forgot"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0m¿Olvidaste tu contraseña?[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"login-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mIniciar sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-register"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCrear cuenta[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      433 |
      434 |   async function expectField(field: 'email' | 'password', message: string) {
    > 435 |     await waitFor(() => expect(screen.getByTestId(`login-${field}-message`)).toHaveTextContent(message));
          |                  ^
      436 |     const text = screen.getByTestId(`login-${field}-message`);
      437 |     const row = screen.getByTestId(`login-${field}-message-row`);
      438 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/login/index.test.tsx:435:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/screens/login/index.test.tsx:434:29)
      at Object.expectField (src/screens/login/index.test.tsx:454:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: con los dos campos mal pinta los dos mensajes a la vez

    Unable to find an element with testID: login-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-login"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"login-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-header"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-greeting"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"login-pingo"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-bubble"[39m
                [36m>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"login-bubble-text"[39m
                  [36m>[39m
                    [0mQué bueno verte de nuevo.[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mIniciar sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mCorreo electrónico[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"login-email"[39m
                  [33mvalue[39m=[32m"alex.example.com"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mContraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"login-password"[39m
                    [33mvalue[39m=[32m""[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"login-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-forgot"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0m¿Olvidaste tu contraseña?[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"login-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mIniciar sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-register"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCrear cuenta[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      433 |
      434 |   async function expectField(field: 'email' | 'password', message: string) {
    > 435 |     await waitFor(() => expect(screen.getByTestId(`login-${field}-message`)).toHaveTextContent(message));
          |                  ^
      436 |     const text = screen.getByTestId(`login-${field}-message`);
      437 |     const row = screen.getByTestId(`login-${field}-message-row`);
      438 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/login/index.test.tsx:435:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/screens/login/index.test.tsx:434:29)
      at Object.expectField (src/screens/login/index.test.tsx:463:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: envía a la API el correo sin espacios alrededor

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

      "http://example.test/v1",
      Object {
    -   "email": "Alex@Example.com",
    +   "email": "  Alex@Example.com  ",
        "password": "correct horse",
      },

    Number of calls: 1

      479 |     await renderLogin();
      480 |     await submit('  Alex@Example.com  ', 'correct horse');
    > 481 |     expect(mockLogin).toHaveBeenCalledWith(apiUrl, { email: 'Alex@Example.com', password: 'correct horse' });
          |                       ^
      482 |   });
      483 |
      484 |   it('#183 R3: en inglés los dos mensajes dicen «Enter a valid email address» y «Enter your password»', async () => {

      at Object.toHaveBeenCalledWith (src/screens/login/index.test.tsx:481:23)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: en inglés los dos mensajes dicen «Enter a valid email address» y «Enter your password»

    Unable to find an element with testID: login-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-login"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"login-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-header"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Back"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-greeting"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"login-pingo"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-bubble"[39m
                [36m>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"login-bubble-text"[39m
                  [36m>[39m
                    [0mGood to see you again.[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mSign in[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mEmail[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"login-email"[39m
                  [33mvalue[39m=[32m"alex.example.com"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPassword[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"login-password"[39m
                    [33mvalue[39m=[32m""[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Show password"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"login-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-forgot"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mForgot password?[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"login-error"[39m
                [36m>[39m
                  [0mSomething went wrong[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mSign in[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-register"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCreate account[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      433 |
      434 |   async function expectField(field: 'email' | 'password', message: string) {
    > 435 |     await waitFor(() => expect(screen.getByTestId(`login-${field}-message`)).toHaveTextContent(message));
          |                  ^
      436 |     const text = screen.getByTestId(`login-${field}-message`);
      437 |     const row = screen.getByTestId(`login-${field}-message-row`);
      438 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/login/index.test.tsx:435:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/screens/login/index.test.tsx:434:29)
      at Object.expectField (src/screens/login/index.test.tsx:489:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: corregir y reenviar quita los mensajes y llama una vez a la API

    Unable to find an element with testID: login-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-login"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"login-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-header"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-greeting"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"login-pingo"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-bubble"[39m
                [36m>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"login-bubble-text"[39m
                  [36m>[39m
                    [0mQué bueno verte de nuevo.[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mIniciar sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"login-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mCorreo electrónico[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"login-email"[39m
                  [33mvalue[39m=[32m"alex.example.com"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mContraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"login-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"login-password"[39m
                    [33mvalue[39m=[32m""[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"login-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-forgot"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0m¿Olvidaste tu contraseña?[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"login-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"login-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"login-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mIniciar sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-register"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCrear cuenta[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      433 |
      434 |   async function expectField(field: 'email' | 'password', message: string) {
    > 435 |     await waitFor(() => expect(screen.getByTestId(`login-${field}-message`)).toHaveTextContent(message));
          |                  ^
      436 |     const text = screen.getByTestId(`login-${field}-message`);
      437 |     const row = screen.getByTestId(`login-${field}-message-row`);
      438 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/login/index.test.tsx:435:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/screens/login/index.test.tsx:434:29)
      at Object.expectField (src/screens/login/index.test.tsx:498:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       9 failed, 30 passed, 39 total
Snapshots:   0 total
Time:        21.131 s
```

c5: `exit=1`; comparados los nueve títulos y tipos: ocho consultas y una aserción (correo recortado), exactamente los de R3.

| c5 | `725e47065bd83d78e30537ca1cda3112e5d946e5` | `test(mobile): login valida en cliente (#183 R3)` | `Tests:       9 failed, 30 passed, 39 total` |

c6: gate `exit=0`, `Tests:       39 passed, 39 total`; TC guarda `exit=0`, tsc `exit=0`; LINT `exit=0`, `vacio=0`; anclas R3 `2`, `2`, `2`, `1`.

### S3.1 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s3-1-183.log`.

```text
  ● #183 R3: login valida en cliente › #183 R3: envía a la API el correo sin espacios alrededor

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

      "http://example.test/v1",
      Object {
    -   "email": "Alex@Example.com",
    +   "email": "  Alex@Example.com  ",
        "password": "correct horse",
      },

    Number of calls: 1

      479 |     await renderLogin();
      480 |     await submit('  Alex@Example.com  ', 'correct horse');
    > 481 |     expect(mockLogin).toHaveBeenCalledWith(apiUrl, { email: 'Alex@Example.com', password: 'correct horse' });
          |                       ^
      482 |   });
      483 |
      484 |   it('#183 R3: en inglés los dos mensajes dicen «Enter a valid email address» y «Enter your password»', async () => {

      at Object.toHaveBeenCalledWith (src/screens/login/index.test.tsx:481:23)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 38 passed, 39 total
Snapshots:   0 total
Time:        8.907 s, estimated 11 s
```

### S3.2 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s3-2-183.log`.

```text
  ● #183 R3: login valida en cliente › #183 R3: «» en login-email no llama a la API y marca el campo

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="login-error">Algo salió mal</Text>

      445 |     await expectField('email', 'Ingresa un correo electrónico válido');
      446 |     expect(screen.queryByTestId('login-password-message')).toBeNull();
    > 447 |     expect(screen.queryByTestId('login-error')).toBeNull();
          |                                                 ^
      448 |     expect(mockLogin).not.toHaveBeenCalled();
      449 |   });
      450 |

      at toBeNull (src/screens/login/index.test.tsx:447:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: «alex.example.com» en login-email no llama a la API y marca el campo

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="login-error">Algo salió mal</Text>

      445 |     await expectField('email', 'Ingresa un correo electrónico válido');
      446 |     expect(screen.queryByTestId('login-password-message')).toBeNull();
    > 447 |     expect(screen.queryByTestId('login-error')).toBeNull();
          |                                                 ^
      448 |     expect(mockLogin).not.toHaveBeenCalled();
      449 |   });
      450 |

      at toBeNull (src/screens/login/index.test.tsx:447:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: «alex@example.c» en login-email no llama a la API y marca el campo

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="login-error">Algo salió mal</Text>

      445 |     await expectField('email', 'Ingresa un correo electrónico válido');
      446 |     expect(screen.queryByTestId('login-password-message')).toBeNull();
    > 447 |     expect(screen.queryByTestId('login-error')).toBeNull();
          |                                                 ^
      448 |     expect(mockLogin).not.toHaveBeenCalled();
      449 |   });
      450 |

      at toBeNull (src/screens/login/index.test.tsx:447:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: «ñu@example.com» en login-email no llama a la API y marca el campo

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="login-error">Algo salió mal</Text>

      445 |     await expectField('email', 'Ingresa un correo electrónico válido');
      446 |     expect(screen.queryByTestId('login-password-message')).toBeNull();
    > 447 |     expect(screen.queryByTestId('login-error')).toBeNull();
          |                                                 ^
      448 |     expect(mockLogin).not.toHaveBeenCalled();
      449 |   });
      450 |

      at toBeNull (src/screens/login/index.test.tsx:447:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: sin contraseña no llama a la API y marca login-password

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="login-error">Algo salió mal</Text>

      454 |     await expectField('password', 'Escribe tu contraseña');
      455 |     expect(screen.queryByTestId('login-email-message')).toBeNull();
    > 456 |     expect(screen.queryByTestId('login-error')).toBeNull();
          |                                                 ^
      457 |     expect(mockLogin).not.toHaveBeenCalled();
      458 |   });
      459 |

      at Object.toBeNull (src/screens/login/index.test.tsx:456:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: con los dos campos mal pinta los dos mensajes a la vez

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="login-error">Algo salió mal</Text>

      464 |     await expectField('password', 'Escribe tu contraseña');
      465 |     expect(screen.getAllByTestId(/^login-.+-message-row$/)).toHaveLength(2);
    > 466 |     expect(screen.queryByTestId('login-error')).toBeNull();
          |                                                 ^
      467 |     expect(mockLogin).not.toHaveBeenCalled();
      468 |   });
      469 |

      at Object.toBeNull (src/screens/login/index.test.tsx:466:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: en inglés los dos mensajes dicen «Enter a valid email address» y «Enter your password»

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="login-error">Something went wrong</Text>

      489 |     await expectField('email', 'Enter a valid email address');
      490 |     await expectField('password', 'Enter your password');
    > 491 |     expect(screen.queryByTestId('login-error')).toBeNull();
          |                                                 ^
      492 |     expect(mockLogin).not.toHaveBeenCalled();
      493 |   });
      494 |

      at Object.toBeNull (src/screens/login/index.test.tsx:491:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R3: login valida en cliente › #183 R3: corregir y reenviar quita los mensajes y llama una vez a la API

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2

      502 |     expect(screen.queryByTestId('login-email-message')).toBeNull();
      503 |     expect(screen.queryByTestId('login-password-message')).toBeNull();
    > 504 |     expect(mockLogin).toHaveBeenCalledTimes(1);
          |                       ^
      505 |   });
      506 | });
      507 |

      at Object.toHaveBeenCalledTimes (src/screens/login/index.test.tsx:504:23)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       8 failed, 31 passed, 39 total
Snapshots:   0 total
Time:        8.67 s, estimated 9 s
```

### S3.3 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s3-3-183.log`.

```text
  ● #183 R3: login valida en cliente › #183 R3: envía a la API el correo sin espacios alrededor

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "http://example.test/v1", {"email": "Alex@Example.com", "password": "correct horse"}

    Number of calls: 0

      479 |     await renderLogin();
      480 |     await submit('  Alex@Example.com  ', 'correct horse');
    > 481 |     expect(mockLogin).toHaveBeenCalledWith(apiUrl, { email: 'Alex@Example.com', password: 'correct horse' });
          |                       ^
      482 |   });
      483 |
      484 |   it('#183 R3: en inglés los dos mensajes dicen «Enter a valid email address» y «Enter your password»', async () => {

      at Object.toHaveBeenCalledWith (src/screens/login/index.test.tsx:481:23)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 38 passed, 39 total
Snapshots:   0 total
Time:        7.87 s, estimated 9 s
```

| c6 | `5c951711f5625a2da9ec5f321ddb70948b90eaf1` | `feat(mobile): login valida en cliente (#183 R3)` | `Tests:       39 passed, 39 total` |

S3.1–S3.3: títulos y tipos comparados antes de avanzar, todos coinciden (1, 8 y 1 aserciones).

S3.1:

```text
exit=1
exit=0
cached=0
```

S3.2:

```text
exit=1
exit=0
cached=0
```

S3.3:

```text
exit=1
exit=0
cached=0
```

### c7 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-c7-183.log`.

```text
  ● #183 R4: registro valida en cliente › #183 R4: first-name con {"register-first-name": ""} pinta «Escribe tu nombre» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-first-name-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: first-name con {"register-first-name": "   "} pinta «Escribe tu nombre» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-first-name-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"   "[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: first-name con {"register-first-name": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"} pinta «Usa 120 caracteres o menos» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-first-name-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: last-name con {"register-last-name": ""} pinta «Escribe tus apellidos» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-last-name-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: last-name con {"register-last-name": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"} pinta «Usa 120 caracteres o menos» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-last-name-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: email con {"register-email": "alex@example.c"} pinta «Ingresa un correo electrónico válido» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.c"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: email con {"register-email": "ñu@example.com"} pinta «Ingresa un correo electrónico válido» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"ñu@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: email con {"register-email": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com"} pinta «Usa 320 caracteres o menos» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: phone con {"register-phone": "123456"} pinta «Usa al menos 7 caracteres» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-phone-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"123456"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: phone con {"register-phone": "111111111111111111111"} pinta «Usa 20 caracteres o menos» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-phone-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"111111111111111111111"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: country con {"register-country": "M"} pinta «Escribe las 2 letras de tu país, como MX» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-country-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"M"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: country con {"register-country": ""} pinta «Escribe las 2 letras de tu país, como MX» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-country-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: country con {"register-country": "M1"} pinta «Usa solo letras de la A a la Z» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-country-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"M1"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: country con {"register-country": "ña"} pinta «Usa solo letras de la A a la Z» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-country-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"ÑA"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: password con {"register-password": "1234567", "register-password-confirmation": "1234567"} pinta «Usa al menos 8 caracteres» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-password-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"1234567"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"1234567"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: password con {"register-password": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "register-password-confirmation": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"} pinta «Usa 128 caracteres o menos» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-password-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: password-confirmation con {"register-password-confirmation": "correct horsE"} pinta «Las contraseñas no coinciden» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-password-confirmation-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horsE"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mEse correo ya está registrado[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: con el formulario vacío pinta los siete mensajes a la vez y no llama a la API

    Unable to find an element with testID: register-first-name-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m""[39m
              [36m/>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-email-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-email-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-email-message"[39m
                  [36m>[39m
                    [0mIngresa un correo electrónico válido[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"x"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      694 |     await fireEvent.changeText(screen.getByTestId('register-password-confirmation'), 'x');
      695 |     await submit();
    > 696 |     await waitFor(() => {
          |                  ^
      697 |       for (const [field, message] of Object.entries(messages)) {
      698 |         expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message);
      699 |       }

      at src/screens/register/index.test.tsx:696:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: en inglés los siete mensajes salen en inglés

    Unable to find an element with testID: register-first-name-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Back"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCreate account[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mFirst name[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mLast name[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mEmail[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m""[39m
              [36m/>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-email-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-email-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-email-message"[39m
                  [36m>[39m
                    [0mEnter a valid email address[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPhone[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mCountry[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mPassword[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Show password"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirm password[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"x"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Show password"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mI accept the terms[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCreate account[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      694 |     await fireEvent.changeText(screen.getByTestId('register-password-confirmation'), 'x');
      695 |     await submit();
    > 696 |     await waitFor(() => {
          |                  ^
      697 |       for (const [field, message] of Object.entries(messages)) {
      698 |         expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message);
      699 |       }

      at src/screens/register/index.test.tsx:696:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: envía el correo sin espacios a register y al login que le sigue

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

      "http://example.test/v1",
    @@ -1,8 +1,8 @@
      Object {
        "country": "MX",
    -   "email": "Alex@Example.com",
    +   "email": "  Alex@Example.com  ",
        "firstName": "Alex",
        "lastName": "Smith",
        "password": "correct horse",
        "passwordConfirmation": "correct horse",
        "phone": "+525555555555",,

    Number of calls: 1

      733 |     await fireEvent.changeText(screen.getByTestId('register-email'), '  Alex@Example.com  ');
      734 |     await submit();
    > 735 |     expect(mockRegister).toHaveBeenCalledWith(apiUrl, {
          |                          ^
      736 |       firstName: 'Alex', lastName: 'Smith', email: 'Alex@Example.com', phone: '+525555555555',
      737 |       password: 'correct horse', passwordConfirmation: 'correct horse', country: 'MX',
      738 |       timezone: 'America/Mexico_City', termsAccepted: true,

      at Object.toHaveBeenCalledWith (src/screens/register/index.test.tsx:735:26)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 passed, 2 total
Tests:       20 failed, 74 passed, 94 total
Snapshots:   0 total
Time:        40.965 s
```

c7: `exit=1`; comparados los veinte títulos: 17 filas inválidas y dos formularios vacíos por consulta, correo recortado por aserción. Coinciden con R4; ui-language y los ocho casos válidos nacen verdes.

| c7 | `87b4fcb20164c1e87959168a210ed3d011d3c0a0` | `test(mobile): registro valida en cliente (#183 R4)` | `Tests:       20 failed, 74 passed, 94 total` |

c8: gate `exit=0`, `Tests:       94 passed, 94 total`; TC guarda `exit=0`, tsc `exit=0`; LINT `exit=0`, `vacio=0`; anclas R4 `0`, `0`, `7`, `7`, `1`.

### S4.1 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s4-1-183.log`.

```text
  ● #183 R4: registro valida en cliente › #183 R4: envía el correo sin espacios a register y al login que le sigue

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

      "http://example.test/v1",
    @@ -1,8 +1,8 @@
      Object {
        "country": "MX",
    -   "email": "Alex@Example.com",
    +   "email": "  Alex@Example.com  ",
        "firstName": "Alex",
        "lastName": "Smith",
        "password": "correct horse",
        "passwordConfirmation": "correct horse",
        "phone": "+525555555555",,

    Number of calls: 1

      733 |     await fireEvent.changeText(screen.getByTestId('register-email'), '  Alex@Example.com  ');
      734 |     await submit();
    > 735 |     expect(mockRegister).toHaveBeenCalledWith(apiUrl, {
          |                          ^
      736 |       firstName: 'Alex', lastName: 'Smith', email: 'Alex@Example.com', phone: '+525555555555',
      737 |       password: 'correct horse', passwordConfirmation: 'correct horse', country: 'MX',
      738 |       timezone: 'America/Mexico_City', termsAccepted: true,

      at Object.toHaveBeenCalledWith (src/screens/register/index.test.tsx:735:26)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 93 passed, 94 total
Snapshots:   0 total
Time:        28.179 s
```

### S4.2 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s4-2-183.log`.

```text
  ● #183 R4: registro valida en cliente › #183 R4: envía el correo sin espacios a register y al login que le sigue

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

      "http://example.test/v1",
      Object {
    -   "email": "Alex@Example.com",
    +   "email": "  Alex@Example.com  ",
        "password": "correct horse",
      },

    Number of calls: 1

      738 |       timezone: 'America/Mexico_City', termsAccepted: true,
      739 |     });
    > 740 |     expect(mockLogin).toHaveBeenCalledWith(apiUrl, { email: 'Alex@Example.com', password: 'correct horse' });
          |                       ^
      741 |   });
      742 | });
      743 |

      at Object.toHaveBeenCalledWith (src/screens/register/index.test.tsx:740:23)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 93 passed, 94 total
Snapshots:   0 total
Time:        24.248 s, estimated 25 s
```

### S4.3 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s4-3-183.log`.

```text
  ● #172 R10: bordes de error del registro › #172 R10: los siete campos del registro marcan isInvalid

    expect(received).toBe(expected) // Object.is equality

    Expected: 7
    Received: 6

      61 |   it('#172 R10: los siete campos del registro marcan isInvalid', () => {
      62 |     const source = readFileSync(join(sourceRoot, 'screens/register/index.tsx'), 'utf8');
    > 63 |     expect(source.split('isInvalid={Boolean(fieldErrors.').length - 1).toBe(7);
         |                                                                        ^
      64 |   });
      65 | });
      66 |

      at Object.toBe (src/__tests__/account-screens-polish.test.ts:63:72)

  ● #167 R7: Pingo en la cabecera del registro › #172 R10: cada campo con error lleva icono y texto seleccionable

    Unable to find an element with testID: register-phone-error

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-first-name-error"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"register-first-name-message-row"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-alert-circle"[39m
                    [36m/>[39m
                    [36m<Text[39m
                      [33mtestID[39m=[32m"register-first-name-message"[39m
                    [36m>[39m
                      [0mfirstName no vale[0m
                    [36m</Text>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-last-name-error"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"register-last-name-message-row"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-alert-circle"[39m
                    [36m/>[39m
                    [36m<Text[39m
                      [33mtestID[39m=[32m"register-last-name-message"[39m
                    [36m>[39m
                      [0mlastName no vale[0m
                    [36m</Text>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-email-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-email-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-email-message"[39m
                  [36m>[39m
                    [0memail no vale[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"+525555555555"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-country-error"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"register-country-message-row"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-alert-circle"[39m
                    [36m/>[39m
                    [36m<Text[39m
                      [33mtestID[39m=[32m"register-country-message"[39m
                    [36m>[39m
                      [0mcountry no vale[0m
                    [36m</Text>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-password-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-password-message"[39m
                  [36m>[39m
                    [0mpassword no vale[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-password-confirmation-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-password-confirmation-message"[39m
                  [36m>[39m
                    [0mpasswordConfirmation no vale[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"register-error"[39m
              [36m>[39m
                [0mtermsAccepted no vale[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      421 |     await submit();
      422 |     for (const [field, path] of fields) {
    > 423 |       const error = screen.getByTestId(`register-${field}-error`);
          |                            ^
      424 |       const row = within(error).getByTestId(`register-${field}-message-row`);
      425 |       const text = within(row).getByTestId(`register-${field}-message`);
      426 |       expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at Object.getByTestId (src/screens/register/index.test.tsx:423:28)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: phone con {"register-phone": "123456"} pinta «Usa al menos 7 caracteres» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-phone-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"123456"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: phone con {"register-phone": "111111111111111111111"} pinta «Usa 20 caracteres o menos» solo en ese campo y no llama a la API

    Unable to find an element with testID: register-phone-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m"Alex"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m"Smith"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m"alex@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m"111111111111111111111"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m"MX"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"correct horse"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      661 |     await changeFields(changes);
      662 |     await submit();
    > 663 |     await waitFor(() => expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message));
          |                  ^
      664 |     const text = screen.getByTestId(`register-${field}-message`);
      665 |     const row = screen.getByTestId(`register-${field}-message-row`);
      666 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(1);

      at src/screens/register/index.test.tsx:663:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: con el formulario vacío pinta los siete mensajes a la vez y no llama a la API

    Unable to find an element with testID: register-phone-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Volver"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNombres[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-first-name-error"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"register-first-name-message-row"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-alert-circle"[39m
                    [36m/>[39m
                    [36m<Text[39m
                      [33mtestID[39m=[32m"register-first-name-message"[39m
                    [36m>[39m
                      [0mEscribe tu nombre[0m
                    [36m</Text>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mApellidos[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-last-name-error"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"register-last-name-message-row"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-alert-circle"[39m
                    [36m/>[39m
                    [36m<Text[39m
                      [33mtestID[39m=[32m"register-last-name-message"[39m
                    [36m>[39m
                      [0mEscribe tus apellidos[0m
                    [36m</Text>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m""[39m
              [36m/>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-email-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-email-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-email-message"[39m
                  [36m>[39m
                    [0mIngresa un correo electrónico válido[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mTeléfono[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPaís[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-country-error"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"register-country-message-row"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-alert-circle"[39m
                    [36m/>[39m
                    [36m<Text[39m
                      [33mtestID[39m=[32m"register-country-message"[39m
                    [36m>[39m
                      [0mEscribe las 2 letras de tu país, como MX[0m
                    [36m</Text>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-password-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-password-message"[39m
                  [36m>[39m
                    [0mUsa al menos 8 caracteres[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirmar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"x"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-password-confirmation-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-password-confirmation-message"[39m
                  [36m>[39m
                    [0mLas contraseñas no coinciden[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAcepto los términos[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCrear cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      694 |     await fireEvent.changeText(screen.getByTestId('register-password-confirmation'), 'x');
      695 |     await submit();
    > 696 |     await waitFor(() => {
          |                  ^
      697 |       for (const [field, message] of Object.entries(messages)) {
      698 |         expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message);
      699 |       }

      at src/screens/register/index.test.tsx:696:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: en inglés los siete mensajes salen en inglés

    Unable to find an element with testID: register-phone-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-register"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"register-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-top"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Back"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-back"[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-pingo-float"[39m
                [36m>[39m
                  [36m<ViewManagerAdapter_ExpoImage[39m
                    [33mplaceholder[39m=[32m{[]}[39m
                    [33mtestID[39m=[32m"register-pingo"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mCreate account[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-names-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mFirst name[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-first-name"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-first-name-error"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"register-first-name-message-row"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-alert-circle"[39m
                    [36m/>[39m
                    [36m<Text[39m
                      [33mtestID[39m=[32m"register-first-name-message"[39m
                    [36m>[39m
                      [0mEnter your first name[0m
                    [36m</Text>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mLast name[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-last-name"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-last-name-error"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"register-last-name-message-row"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-alert-circle"[39m
                    [36m/>[39m
                    [36m<Text[39m
                      [33mtestID[39m=[32m"register-last-name-message"[39m
                    [36m>[39m
                      [0mEnter your last name[0m
                    [36m</Text>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mEmail[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"register-email"[39m
                [33mvalue[39m=[32m""[39m
              [36m/>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-email-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-email-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-email-message"[39m
                  [36m>[39m
                    [0mEnter a valid email address[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-contact-row"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mPhone[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-phone"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mCountry[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-country"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-country-error"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"register-country-message-row"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-alert-circle"[39m
                    [36m/>[39m
                    [36m<Text[39m
                      [33mtestID[39m=[32m"register-country-message"[39m
                    [36m>[39m
                      [0mEnter your country's 2-letter code, like MX[0m
                    [36m</Text>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mPassword[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password"[39m
                  [33mvalue[39m=[32m""[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Show password"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-password-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-password-message"[39m
                  [36m>[39m
                    [0mUse at least 8 characters[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mConfirm password[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-group"[39m
              [36m>[39m
                [36m<TextInput[39m
                  [33meditable[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"register-password-confirmation"[39m
                  [33mvalue[39m=[32m"x"[39m
                [36m/>[39m
                [36m<View>[39m
                  [36m<View[39m
                    [33maccessibilityLabel[39m=[32m"Show password"[39m
                    [33maccessibilityRole[39m=[32m"button"[39m
                    [33maccessible[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"register-password-confirmation-toggle"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-eye"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"register-password-confirmation-error"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"register-password-confirmation-message-row"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"icon-alert-circle"[39m
                  [36m/>[39m
                  [36m<Text[39m
                    [33mtestID[39m=[32m"register-password-confirmation-message"[39m
                  [36m>[39m
                    [0mPasswords don't match[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "checked": true,
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mrole[39m=[32m"checkbox"[39m
                [33mtestID[39m=[32m"register-terms"[39m
              [36m>[39m
                [36m<View[39m
                  [33maria-disabled[39m=[32m{false}[39m
                  [33maria-hidden[39m=[32m{false}[39m
                  [33mrole[39m=[32m"presentation"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m>[39m
                  [36m<RNSVGSvgView>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGSvgView>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mI accept the terms[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"register-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"register-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mCreate account[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      694 |     await fireEvent.changeText(screen.getByTestId('register-password-confirmation'), 'x');
      695 |     await submit();
    > 696 |     await waitFor(() => {
          |                  ^
      697 |       for (const [field, message] of Object.entries(messages)) {
      698 |         expect(screen.getByTestId(`register-${field}-message`)).toHaveTextContent(message);
      699 |       }

      at src/screens/register/index.test.tsx:696:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 2 failed, 2 total
Tests:       6 failed, 71 passed, 77 total
Snapshots:   0 total
Time:        28.679 s
```

### S4.4 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s4-4-183.log`.

```text
  ● #167 R7: Pingo en la cabecera del registro › #172 R12: un correo sin arroba no llama a la API y marca el campo

    expect(jest.fn()).not.toHaveBeenCalled()

    Expected number of calls: 0
    Received number of calls: 1

    1: "http://example.test/v1", {"country": "MX", "email": "alex.example.com", "firstName": "Alex", "lastName": "Smith", "password": "correct horse", "passwordConfirmation": "correct horse", "phone": "+525555555555", "termsAccepted": true, "timezone": "UTC"}

      444 |     await waitFor(() => expect(screen.getByTestId('register-email-message'))
      445 |       .toHaveTextContent('Ingresa un correo electrónico válido'));
    > 446 |     expect(mockRegister).not.toHaveBeenCalled();
          |                              ^
      447 |   });
      448 |
      449 |   it('#172 R12: en inglés el correo inválido dice «Enter a valid email address»', async () => {

      at Object.toHaveBeenCalled (src/screens/register/index.test.tsx:446:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #167 R7: Pingo en la cabecera del registro › #172 R12: en inglés el correo inválido dice «Enter a valid email address»

    expect(jest.fn()).not.toHaveBeenCalled()

    Expected number of calls: 0
    Received number of calls: 1

    1: "http://example.test/v1", {"country": "MX", "email": "alex.example.com", "firstName": "Alex", "lastName": "Smith", "password": "correct horse", "passwordConfirmation": "correct horse", "phone": "+525555555555", "termsAccepted": true, "timezone": "UTC"}

      457 |     await waitFor(() => expect(screen.getByTestId('register-email-message'))
      458 |       .toHaveTextContent('Enter a valid email address'));
    > 459 |     expect(mockRegister).not.toHaveBeenCalled();
          |                              ^
      460 |   });
      461 |
      462 |   it('#172 R12: tras un correo inválido el envío sigue activo y el corregido sí llama a la API', async () => {

      at Object.toHaveBeenCalled (src/screens/register/index.test.tsx:459:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #167 R7: Pingo en la cabecera del registro › #172 R12: tras un correo inválido el envío sigue activo y el corregido sí llama a la API

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2

      474 |       .toHaveTextContent('Ese correo ya está registrado'));
      475 |     expect(screen.queryByTestId('register-email-message')).toBeNull();
    > 476 |     expect(mockRegister).toHaveBeenCalledTimes(1);
          |                          ^
      477 |   });
      478 |
      479 |   it.each(['alex@example', 'alex @example.com'])('#172 R12: «%s» tampoco es un correo y no llama a la API', async (email) => {

      at Object.toHaveBeenCalledTimes (src/screens/register/index.test.tsx:476:26)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #167 R7: Pingo en la cabecera del registro › #172 R12: «alex@example» tampoco es un correo y no llama a la API

    expect(jest.fn()).not.toHaveBeenCalled()

    Expected number of calls: 0
    Received number of calls: 1

    1: "http://example.test/v1", {"country": "MX", "email": "alex@example", "firstName": "Alex", "lastName": "Smith", "password": "correct horse", "passwordConfirmation": "correct horse", "phone": "+525555555555", "termsAccepted": true, "timezone": "UTC"}

      485 |     await waitFor(() => expect(screen.getByTestId('register-email-message'))
      486 |       .toHaveTextContent('Ingresa un correo electrónico válido'));
    > 487 |     expect(mockRegister).not.toHaveBeenCalled();
          |                              ^
      488 |   });
      489 |
      490 |   it('#172 R11: cabecera, rejilla, términos, error y envío cuelgan del scroll', async () => {

      at toHaveBeenCalled (src/screens/register/index.test.tsx:487:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #167 R7: Pingo en la cabecera del registro › #172 R12: «alex @example.com» tampoco es un correo y no llama a la API

    expect(jest.fn()).not.toHaveBeenCalled()

    Expected number of calls: 0
    Received number of calls: 1

    1: "http://example.test/v1", {"country": "MX", "email": "alex @example.com", "firstName": "Alex", "lastName": "Smith", "password": "correct horse", "passwordConfirmation": "correct horse", "phone": "+525555555555", "termsAccepted": true, "timezone": "UTC"}

      485 |     await waitFor(() => expect(screen.getByTestId('register-email-message'))
      486 |       .toHaveTextContent('Ingresa un correo electrónico válido'));
    > 487 |     expect(mockRegister).not.toHaveBeenCalled();
          |                              ^
      488 |   });
      489 |
      490 |   it('#172 R11: cabecera, rejilla, términos, error y envío cuelgan del scroll', async () => {

      at toHaveBeenCalled (src/screens/register/index.test.tsx:487:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: first-name con {"register-first-name": ""} pinta «Escribe tu nombre» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: first-name con {"register-first-name": "   "} pinta «Escribe tu nombre» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: first-name con {"register-first-name": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"} pinta «Usa 120 caracteres o menos» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: last-name con {"register-last-name": ""} pinta «Escribe tus apellidos» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: last-name con {"register-last-name": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"} pinta «Usa 120 caracteres o menos» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: email con {"register-email": "alex@example.c"} pinta «Ingresa un correo electrónico válido» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: email con {"register-email": "ñu@example.com"} pinta «Ingresa un correo electrónico válido» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: email con {"register-email": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com"} pinta «Usa 320 caracteres o menos» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: phone con {"register-phone": "123456"} pinta «Usa al menos 7 caracteres» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: phone con {"register-phone": "111111111111111111111"} pinta «Usa 20 caracteres o menos» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: country con {"register-country": "M"} pinta «Escribe las 2 letras de tu país, como MX» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: country con {"register-country": ""} pinta «Escribe las 2 letras de tu país, como MX» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: country con {"register-country": "M1"} pinta «Usa solo letras de la A a la Z» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: country con {"register-country": "ña"} pinta «Usa solo letras de la A a la Z» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: password con {"register-password": "1234567", "register-password-confirmation": "1234567"} pinta «Usa al menos 8 caracteres» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: password con {"register-password": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "register-password-confirmation": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"} pinta «Usa 128 caracteres o menos» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: password-confirmation con {"register-password-confirmation": "correct horsE"} pinta «Las contraseñas no coinciden» solo en ese campo y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      667 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      668 |     expect(text.props.selectable).toBe(true);
    > 669 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      670 |     expect(mockRegister).not.toHaveBeenCalled();
      671 |   });
      672 |

      at toBeNull (src/screens/register/index.test.tsx:669:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: con el formulario vacío pinta los siete mensajes a la vez y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Ese correo ya está registrado</Text>

      700 |     });
      701 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(7);
    > 702 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      703 |     expect(mockRegister).not.toHaveBeenCalled();
      704 |   }
      705 |

      at toBeNull (src/screens/register/index.test.tsx:702:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R4: registro valida en cliente › #183 R4: en inglés los siete mensajes salen en inglés

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-error">Email already registered</Text>

      700 |     });
      701 |     expect(screen.getAllByTestId(/^register-.+-message-row$/)).toHaveLength(7);
    > 702 |     expect(screen.queryByTestId('register-error')).toBeNull();
          |                                                    ^
      703 |     expect(mockRegister).not.toHaveBeenCalled();
      704 |   }
      705 |

      at toBeNull (src/screens/register/index.test.tsx:702:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 passed, 2 total
Tests:       24 failed, 70 passed, 94 total
Snapshots:   0 total
Time:        20.526 s, estimated 27 s
```

| c8 | `ac7ab536776545029eabe928447c5d6473203b78` | `feat(mobile): registro valida en cliente (#183 R4)` | `Tests:       94 passed, 94 total` |

S4.1–S4.4: títulos y tipos comparados antes de avanzar. Coinciden: 1 aserción, 1 aserción, 5 consultas + 1 aserción de la guarda, 24 aserciones (incluidos los cinco #172 R12).

S4.1:

```text
exit=1
exit=0
cached=0
```

S4.2:

```text
exit=1
exit=0
cached=0
```

S4.3:

```text
exit=1
exit=0
cached=0
```

S4.4:

```text
exit=1
exit=0
cached=0
```

### c9 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-c9-183.log`.

```text
  ● #183 R5: recuperar valida en cliente › #183 R5: «alex.example.com» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido»

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"alex.example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"forgot-error"[39m
              [36m>[39m
                [0mAlgo salió mal[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      695 |     await renderRoute();
      696 |     await submitForgot(email);
    > 697 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent(message));
          |                  ^
      698 |     const text = screen.getByTestId('forgot-email-message');
      699 |     const row = screen.getByTestId('forgot-email-message-row');
      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/forgot/index.test.tsx:697:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: «alex@example.c» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido»

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"alex@example.c"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"forgot-error"[39m
              [36m>[39m
                [0mAlgo salió mal[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      695 |     await renderRoute();
      696 |     await submitForgot(email);
    > 697 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent(message));
          |                  ^
      698 |     const text = screen.getByTestId('forgot-email-message');
      699 |     const row = screen.getByTestId('forgot-email-message-row');
      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/forgot/index.test.tsx:697:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: «ñu@example.com» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido»

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"ñu@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"forgot-error"[39m
              [36m>[39m
                [0mAlgo salió mal[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      695 |     await renderRoute();
      696 |     await submitForgot(email);
    > 697 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent(message));
          |                  ^
      698 |     const text = screen.getByTestId('forgot-email-message');
      699 |     const row = screen.getByTestId('forgot-email-message-row');
      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/forgot/index.test.tsx:697:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: «aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com» no llama a la API y marca forgot-email con «Usa 320 caracteres o menos»

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"forgot-error"[39m
              [36m>[39m
                [0mAlgo salió mal[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      695 |     await renderRoute();
      696 |     await submitForgot(email);
    > 697 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent(message));
          |                  ^
      698 |     const text = screen.getByTestId('forgot-email-message');
      699 |     const row = screen.getByTestId('forgot-email-message-row');
      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/forgot/index.test.tsx:697:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: corregir el correo quita el mensaje y envía el recortado

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"alex.example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"forgot-error"[39m
              [36m>[39m
                [0mAlgo salió mal[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      719 |     await renderRoute();
      720 |     await submitForgot('alex.example.com');
    > 721 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent('Ingresa un correo electrónico válido'));
          |                  ^
      722 |     mockForgotPassword.mockResolvedValue({ kind: 'ok' });
      723 |     await submitForgot('  Ana@Example.com ');
      724 |     expect(await screen.findByText('Revisa tu correo')).toBeVisible();

      at Object.<anonymous> (src/screens/forgot/index.test.tsx:721:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       5 failed, 42 passed, 47 total
Snapshots:   0 total
Time:        19.919 s
```

c9: `exit=1`; comparados los cinco títulos y sus tipos: las cinco consultas de R5, sin otro fallo.

| c9 | `a8fc62c074868a6199ff9591eca2af91064c83d2` | `test(mobile): recuperar valida en cliente (#183 R5)` | `Tests:       5 failed, 42 passed, 47 total` |

c10: gate `exit=0`, `Tests:       47 passed, 47 total`; TC guarda `exit=0`, tsc `exit=0`; LINT `exit=0`, `vacio=0`; anclas R5 `1`, `1`, `1`, `1`.

### S5.1 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s5-1-183.log`.

```text
  ● #183 R5: recuperar valida en cliente › #183 R5: «alex.example.com» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido»

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="forgot-error">Algo salió mal</Text>

      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      701 |     expect(text.props.selectable).toBe(true);
    > 702 |     expect(screen.queryByTestId('forgot-error')).toBeNull();
          |                                                  ^
      703 |     expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
      704 |     expect(screen.getByTestId('forgot-submit')).not.toBeDisabled();
      705 |     expect(mockForgotPassword).not.toHaveBeenCalled();

      at toBeNull (src/screens/forgot/index.test.tsx:702:50)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: «alex@example.c» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido»

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="forgot-error">Algo salió mal</Text>

      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      701 |     expect(text.props.selectable).toBe(true);
    > 702 |     expect(screen.queryByTestId('forgot-error')).toBeNull();
          |                                                  ^
      703 |     expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
      704 |     expect(screen.getByTestId('forgot-submit')).not.toBeDisabled();
      705 |     expect(mockForgotPassword).not.toHaveBeenCalled();

      at toBeNull (src/screens/forgot/index.test.tsx:702:50)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: «ñu@example.com» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido»

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="forgot-error">Algo salió mal</Text>

      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      701 |     expect(text.props.selectable).toBe(true);
    > 702 |     expect(screen.queryByTestId('forgot-error')).toBeNull();
          |                                                  ^
      703 |     expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
      704 |     expect(screen.getByTestId('forgot-submit')).not.toBeDisabled();
      705 |     expect(mockForgotPassword).not.toHaveBeenCalled();

      at toBeNull (src/screens/forgot/index.test.tsx:702:50)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: «aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com» no llama a la API y marca forgot-email con «Usa 320 caracteres o menos»

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="forgot-error">Algo salió mal</Text>

      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      701 |     expect(text.props.selectable).toBe(true);
    > 702 |     expect(screen.queryByTestId('forgot-error')).toBeNull();
          |                                                  ^
      703 |     expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
      704 |     expect(screen.getByTestId('forgot-submit')).not.toBeDisabled();
      705 |     expect(mockForgotPassword).not.toHaveBeenCalled();

      at toBeNull (src/screens/forgot/index.test.tsx:702:50)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: corregir el correo quita el mensaje y envía el recortado

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2

      724 |     expect(await screen.findByText('Revisa tu correo')).toBeVisible();
      725 |     expect(screen.queryByTestId('forgot-email-message')).toBeNull();
    > 726 |     expect(mockForgotPassword).toHaveBeenCalledTimes(1);
          |                                ^
      727 |     expect(mockForgotPassword).toHaveBeenCalledWith(apiUrl, { email: 'Ana@Example.com' });
      728 |   });
      729 | });

      at Object.toHaveBeenCalledTimes (src/screens/forgot/index.test.tsx:726:32)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       5 failed, 42 passed, 47 total
Snapshots:   0 total
Time:        9.448 s, estimated 14 s
```

### S5.2 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s5-2-183.log`.

```text
  ● #183 R5: recuperar valida en cliente › #183 R5: «aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com» no llama a la API y marca forgot-email con «Usa 320 caracteres o menos»

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-error-row"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-alert-circle"[39m
              [36m/>[39m
              [36m<Text[39m
                [33mtestID[39m=[32m"forgot-error"[39m
              [36m>[39m
                [0mAlgo salió mal[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      695 |     await renderRoute();
      696 |     await submitForgot(email);
    > 697 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent(message));
          |                  ^
      698 |     const text = screen.getByTestId('forgot-email-message');
      699 |     const row = screen.getByTestId('forgot-email-message-row');
      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/forgot/index.test.tsx:697:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 46 passed, 47 total
Snapshots:   0 total
Time:        11.167 s
```

### S5.3 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s5-3-183.log`.

```text
  ● #183 R5: recuperar valida en cliente › #183 R5: «alex.example.com» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido»

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"alex.example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      695 |     await renderRoute();
      696 |     await submitForgot(email);
    > 697 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent(message));
          |                  ^
      698 |     const text = screen.getByTestId('forgot-email-message');
      699 |     const row = screen.getByTestId('forgot-email-message-row');
      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/forgot/index.test.tsx:697:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: «alex@example.c» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido»

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"alex@example.c"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      695 |     await renderRoute();
      696 |     await submitForgot(email);
    > 697 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent(message));
          |                  ^
      698 |     const text = screen.getByTestId('forgot-email-message');
      699 |     const row = screen.getByTestId('forgot-email-message-row');
      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/forgot/index.test.tsx:697:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: «ñu@example.com» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido»

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"ñu@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      695 |     await renderRoute();
      696 |     await submitForgot(email);
    > 697 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent(message));
          |                  ^
      698 |     const text = screen.getByTestId('forgot-email-message');
      699 |     const row = screen.getByTestId('forgot-email-message-row');
      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/forgot/index.test.tsx:697:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: «aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com» no llama a la API y marca forgot-email con «Usa 320 caracteres o menos»

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      695 |     await renderRoute();
      696 |     await submitForgot(email);
    > 697 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent(message));
          |                  ^
      698 |     const text = screen.getByTestId('forgot-email-message');
      699 |     const row = screen.getByTestId('forgot-email-message-row');
      700 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);

      at src/screens/forgot/index.test.tsx:697:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R5: recuperar valida en cliente › #183 R5: corregir el correo quita el mensaje y envía el recortado

    Unable to find an element with testID: forgot-email-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-forgot"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"forgot-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-top"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Volver"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-back"[39m
              [36m>[39m
                [36m<RNSVGSvgView>[39m
                  [36m<RNSVGGroup>[39m
                    [36m<RNSVGGroup>[39m
                      [36m<RNSVGPath />[39m
                    [36m</RNSVGGroup>[39m
                  [36m</RNSVGGroup>[39m
                [36m</RNSVGSvgView>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-pingo-float"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"forgot-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-lock-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"icon-lock"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-title"[39m
            [36m>[39m
              [0mRecuperar contraseña[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"forgot-body"[39m
            [36m>[39m
              [0mIngresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCorreo electrónico[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<TextInput[39m
                [33meditable[39m=[32m{true}[39m
                [33mtestID[39m=[32m"forgot-email"[39m
                [33mvalue[39m=[32m"alex.example.com"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"forgot-spacer"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"forgot-submit"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnviar enlace de recuperación[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"link-login"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mVolver al inicio de sesión[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      719 |     await renderRoute();
      720 |     await submitForgot('alex.example.com');
    > 721 |     await waitFor(() => expect(screen.getByTestId('forgot-email-message')).toHaveTextContent('Ingresa un correo electrónico válido'));
          |                  ^
      722 |     mockForgotPassword.mockResolvedValue({ kind: 'ok' });
      723 |     await submitForgot('  Ana@Example.com ');
      724 |     expect(await screen.findByText('Revisa tu correo')).toBeVisible();

      at Object.<anonymous> (src/screens/forgot/index.test.tsx:721:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       5 failed, 42 passed, 47 total
Snapshots:   0 total
Time:        15.423 s
```

| c10 | `4d87b606ce918cf3d2d3d8ce9cae1bb3dd4fa6e9` | `feat(mobile): recuperar valida en cliente (#183 R5)` | `Tests:       47 passed, 47 total` |

S5.1–S5.3: títulos y tipos comparados y conformes con R5 (5 aserciones; 1 consulta; 5 consultas).

S5.1:

```text
exit=1
exit=0
cached=0
```

S5.2:

```text
exit=1
exit=0
cached=0
```

S5.3:

```text
exit=1
exit=0
cached=0
```

### c11 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-c11-183.log`.

```text
  ● #183 R6: nueva contraseña valida en cliente › #183 R6: ["1234567", "1234567"] pinta «Usa al menos 8 caracteres» en reset-password-message y no llama a la API

    Unable to find an element with testID: reset-password-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-reset-password"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"reset-password-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-pingo-float"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"reset-pingo"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mRestablecer contraseña[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password"[39m
                    [33mvalue[39m=[32m"1234567"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mConfirmar nueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-confirm-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password-confirm"[39m
                    [33mvalue[39m=[32m"1234567"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-confirm-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"reset-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"reset-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mActualizar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-login"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mVolver al inicio de sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      621 |     await renderRoute('reset-token-r8');
      622 |     await submitReset(password, confirmation);
    > 623 |     await waitFor(() => expect(screen.getByTestId(id)).toHaveTextContent(message));
          |                  ^
      624 |     const text = screen.getByTestId(id);
      625 |     const row = screen.getByTestId(`${id}-row`);
      626 |     expect(screen.getAllByTestId(/^reset-password(-confirm)?-message-row$/)).toHaveLength(1);

      at src/screens/reset-password/index.test.tsx:623:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R6: nueva contraseña valida en cliente › #183 R6: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"] pinta «Usa 128 caracteres o menos» en reset-password-message y no llama a la API

    Unable to find an element with testID: reset-password-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-reset-password"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"reset-password-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-pingo-float"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"reset-pingo"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mRestablecer contraseña[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password"[39m
                    [33mvalue[39m=[32m"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mConfirmar nueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-confirm-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password-confirm"[39m
                    [33mvalue[39m=[32m"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-confirm-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"reset-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"reset-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mActualizar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-login"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mVolver al inicio de sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      621 |     await renderRoute('reset-token-r8');
      622 |     await submitReset(password, confirmation);
    > 623 |     await waitFor(() => expect(screen.getByTestId(id)).toHaveTextContent(message));
          |                  ^
      624 |     const text = screen.getByTestId(id);
      625 |     const row = screen.getByTestId(`${id}-row`);
      626 |     expect(screen.getAllByTestId(/^reset-password(-confirm)?-message-row$/)).toHaveLength(1);

      at src/screens/reset-password/index.test.tsx:623:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R6: nueva contraseña valida en cliente › #183 R6: ["new-password-123", "new-password-124"] pinta «Las contraseñas no coinciden» en reset-password-confirm-message y no llama a la API

    Unable to find an element with testID: reset-password-confirm-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-reset-password"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"reset-password-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-pingo-float"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"reset-pingo"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mRestablecer contraseña[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password"[39m
                    [33mvalue[39m=[32m"new-password-123"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mConfirmar nueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-confirm-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password-confirm"[39m
                    [33mvalue[39m=[32m"new-password-124"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-confirm-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"reset-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"reset-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mActualizar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-login"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mVolver al inicio de sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      621 |     await renderRoute('reset-token-r8');
      622 |     await submitReset(password, confirmation);
    > 623 |     await waitFor(() => expect(screen.getByTestId(id)).toHaveTextContent(message));
          |                  ^
      624 |     const text = screen.getByTestId(id);
      625 |     const row = screen.getByTestId(`${id}-row`);
      626 |     expect(screen.getAllByTestId(/^reset-password(-confirm)?-message-row$/)).toHaveLength(1);

      at src/screens/reset-password/index.test.tsx:623:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R6: nueva contraseña valida en cliente › #183 R6: las dos reglas a la vez pintan los dos mensajes

    Unable to find an element with testID: reset-password-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-reset-password"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"reset-password-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-pingo-float"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"reset-pingo"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mRestablecer contraseña[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password"[39m
                    [33mvalue[39m=[32m"1234567"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mConfirmar nueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-confirm-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password-confirm"[39m
                    [33mvalue[39m=[32m"x"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-confirm-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-error-row"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-alert-circle"[39m
                [36m/>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"reset-error"[39m
                [36m>[39m
                  [0mAlgo salió mal[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"reset-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mActualizar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-login"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mVolver al inicio de sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      634 |     await renderRoute('reset-token-r8');
      635 |     await submitReset('1234567', 'x');
    > 636 |     await waitFor(() => {
          |                  ^
      637 |       expect(screen.getByTestId('reset-password-message')).toHaveTextContent('Usa al menos 8 caracteres');
      638 |       expect(screen.getByTestId('reset-password-confirm-message')).toHaveTextContent('Las contraseñas no coinciden');
      639 |     });

      at Object.<anonymous> (src/screens/reset-password/index.test.tsx:636:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       4 failed, 43 passed, 47 total
Snapshots:   0 total
Time:        11.96 s
```

c11: `exit=1`; comparados los cuatro títulos y tipos, las cuatro consultas previstas en R6. El heredado del 400 sigue verde con submitReset válido.

| c11 | `f874ad4d6fef7ca6e8254eeeaf7de591ffe76192` | `test(mobile): nueva contraseña valida en cliente (#183 R6)` | `Tests:       4 failed, 43 passed, 47 total` |

c12: gate `exit=0`, `Tests:       47 passed, 47 total`; TC guarda `exit=0`, tsc `exit=0`; LINT `exit=0`, `vacio=0`; anclas R6 `2`, `2`, `2`, `1`.

### S6.1 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s6-1-183.log`.

```text
  ● #183 R6: nueva contraseña valida en cliente › #183 R6: ["1234567", "1234567"] pinta «Usa al menos 8 caracteres» en reset-password-message y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="reset-error">Algo salió mal</Text>

      627 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      628 |     expect(text.props.selectable).toBe(true);
    > 629 |     expect(screen.queryByTestId('reset-error')).toBeNull();
          |                                                 ^
      630 |     expect(mockResetPassword).not.toHaveBeenCalled();
      631 |   });
      632 |

      at toBeNull (src/screens/reset-password/index.test.tsx:629:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R6: nueva contraseña valida en cliente › #183 R6: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"] pinta «Usa 128 caracteres o menos» en reset-password-message y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="reset-error">Algo salió mal</Text>

      627 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      628 |     expect(text.props.selectable).toBe(true);
    > 629 |     expect(screen.queryByTestId('reset-error')).toBeNull();
          |                                                 ^
      630 |     expect(mockResetPassword).not.toHaveBeenCalled();
      631 |   });
      632 |

      at toBeNull (src/screens/reset-password/index.test.tsx:629:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R6: nueva contraseña valida en cliente › #183 R6: ["new-password-123", "new-password-124"] pinta «Las contraseñas no coinciden» en reset-password-confirm-message y no llama a la API

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="reset-error">Algo salió mal</Text>

      627 |     expect(row.children).toEqual([within(row).getByTestId('icon-alert-circle'), text]);
      628 |     expect(text.props.selectable).toBe(true);
    > 629 |     expect(screen.queryByTestId('reset-error')).toBeNull();
          |                                                 ^
      630 |     expect(mockResetPassword).not.toHaveBeenCalled();
      631 |   });
      632 |

      at toBeNull (src/screens/reset-password/index.test.tsx:629:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R6: nueva contraseña valida en cliente › #183 R6: las dos reglas a la vez pintan los dos mensajes

    expect(received).toBeNull()

    Received: <Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="reset-error">Algo salió mal</Text>

      639 |     });
      640 |     expect(screen.getAllByTestId(/^reset-password(-confirm)?-message-row$/)).toHaveLength(2);
    > 641 |     expect(screen.queryByTestId('reset-error')).toBeNull();
          |                                                 ^
      642 |     expect(mockResetPassword).not.toHaveBeenCalled();
      643 |   });
      644 |

      at Object.toBeNull (src/screens/reset-password/index.test.tsx:641:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       4 failed, 43 passed, 47 total
Snapshots:   0 total
Time:        10.653 s
```

### S6.2 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s6-2-183.log`.

```text
  ● #183 R6: nueva contraseña valida en cliente › #183 R6: ["new-password-123", "new-password-124"] pinta «Las contraseñas no coinciden» en reset-password-confirm-message y no llama a la API

    Unable to find an element with testID: reset-password-confirm-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-reset-password"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"reset-password-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-pingo-float"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"reset-pingo"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mRestablecer contraseña[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password"[39m
                    [33mvalue[39m=[32m"new-password-123"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mConfirmar nueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-confirm-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password-confirm"[39m
                    [33mvalue[39m=[32m"new-password-124"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-confirm-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"reset-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mActualizar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-login"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mVolver al inicio de sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      621 |     await renderRoute('reset-token-r8');
      622 |     await submitReset(password, confirmation);
    > 623 |     await waitFor(() => expect(screen.getByTestId(id)).toHaveTextContent(message));
          |                  ^
      624 |     const text = screen.getByTestId(id);
      625 |     const row = screen.getByTestId(`${id}-row`);
      626 |     expect(screen.getAllByTestId(/^reset-password(-confirm)?-message-row$/)).toHaveLength(1);

      at src/screens/reset-password/index.test.tsx:623:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #183 R6: nueva contraseña valida en cliente › #183 R6: las dos reglas a la vez pintan los dos mensajes

    Unable to find an element with testID: reset-password-confirm-message

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-reset-password"[39m
      [36m>[39m
        [36m<RCTScrollView[39m
          [33mtestID[39m=[32m"reset-password-form"[39m
        [36m>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-header"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-pingo-float"[39m
              [36m>[39m
                [36m<ViewManagerAdapter_ExpoImage[39m
                  [33mplaceholder[39m=[32m{[]}[39m
                  [33mtestID[39m=[32m"reset-pingo"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mRestablecer contraseña[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"reset-body"[39m
            [36m>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mNueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password"[39m
                    [33mvalue[39m=[32m"1234567"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-error"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"reset-password-message-row"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"icon-alert-circle"[39m
                    [36m/>[39m
                    [36m<Text[39m
                      [33mtestID[39m=[32m"reset-password-message"[39m
                    [36m>[39m
                      [0mUsa al menos 8 caracteres[0m
                    [36m</Text>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mConfirmar nueva contraseña[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"reset-password-confirm-group"[39m
                [36m>[39m
                  [36m<TextInput[39m
                    [33meditable[39m=[32m{true}[39m
                    [33mtestID[39m=[32m"reset-password-confirm"[39m
                    [33mvalue[39m=[32m"x"[39m
                  [36m/>[39m
                  [36m<View>[39m
                    [36m<View[39m
                      [33maccessibilityLabel[39m=[32m"Mostrar contraseña"[39m
                      [33maccessibilityRole[39m=[32m"button"[39m
                      [33maccessible[39m=[32m{true}[39m
                      [33mtestID[39m=[32m"reset-password-confirm-toggle"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mtestID[39m=[32m"icon-eye"[39m
                      [36m/>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"reset-spacer"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"reset-submit"[39m
              [36m>[39m
                [36m<View[39m
                  [33mpointerEvents[39m=[32m"none"[39m
                  [33mstyle[39m=[32m{
                    {
                      "opacity": 0,
                    }
                  }[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mActualizar contraseña[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"link-login"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mVolver al inicio de sesión[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m

      634 |     await renderRoute('reset-token-r8');
      635 |     await submitReset('1234567', 'x');
    > 636 |     await waitFor(() => {
          |                  ^
      637 |       expect(screen.getByTestId('reset-password-message')).toHaveTextContent('Usa al menos 8 caracteres');
      638 |       expect(screen.getByTestId('reset-password-confirm-message')).toHaveTextContent('Las contraseñas no coinciden');
      639 |     });

      at Object.<anonymous> (src/screens/reset-password/index.test.tsx:636:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 45 passed, 47 total
Snapshots:   0 total
Time:        9.488 s, estimated 11 s
```

### S6.3 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s6-3-183.log`.

```text
  ● #183 R6: nueva contraseña valida en cliente › #183 R6: "        " pasa como en el DTO y llama a la API

    expect(received).not.toBeNull()

    Received: null

      647 |     await renderRoute('reset-token-r8');
      648 |     await submitReset(value, value);
    > 649 |     await waitFor(() => expect(screen.queryByTestId('reset-success')).not.toBeNull());
          |                  ^
      650 |     expect(screen.getByTestId('reset-success')).toHaveTextContent('Contraseña actualizada');
      651 |     expect(mockResetPassword).toHaveBeenCalledWith(apiUrl, {
      652 |       token: 'reset-token-r8', password: value, passwordConfirmation: value,

      at src/screens/reset-password/index.test.tsx:649:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 46 passed, 47 total
Snapshots:   0 total
Time:        12.294 s
```

| c12 | `3a25aa5b11a57f2211d02307c031a0161161cfa0` | `feat(mobile): nueva contraseña valida en cliente (#183 R6)` | `Tests:       47 passed, 47 total` |

S6.1–S6.3: títulos y tipos comparados antes de avanzar; coinciden (4 aserciones, 2 consultas, 1 aserción en el caso de ocho espacios).

S6.1:

```text
exit=1
exit=0
cached=0
```

S6.2:

```text
exit=1
exit=0
cached=0
```

S6.3:

```text
exit=1
exit=0
cached=0
```

### c13 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-c13-183.log`.

```text
  ● R8: el submit completa el reset y mapea los errores › #183 R7: un 400 de validación pinta el aviso genérico y no el texto del servidor

    expect(received).toBe(expected) // Object.is equality

    - Expected  - 1
    + Received  + 2

    - Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    + Password is too short
    + Passwords must match

      245 |
      246 |     const error = await screen.findByTestId('reset-error');
    > 247 |     expect(error.props.children).toBe(
          |                                  ^
      248 |       'Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.',
      249 |     );
      250 |     expect(screen.getByTestId('reset-submit')).toBeVisible();

      at Object.toBe (src/screens/reset-password/index.test.tsx:247:34)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #117 R7: cada kind distinto de ok pinta su copy en forgot-error › mapea {"errors": [Array], "kind": "validation"} a «Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.» en forgot-error, seleccionable, y deja el formulario en pie

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    Received:
      Ingresa un correo electrónico válido

      306 |     const error = await screen.findByTestId('forgot-error');
      307 |
    > 308 |     expect(error).toHaveTextContent(copy);
          |                   ^
      309 |     expect(error.props.selectable).toBe(true);
      310 |     expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
      311 |     expect(screen.getByTestId('forgot-email').props.value).toBe('  Ana@Example.com ');

      at toHaveTextContent (src/screens/forgot/index.test.tsx:308:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #117 R7: cada kind distinto de ok pinta su copy en forgot-error › un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    Received:
      Ingresa un correo electrónico válido

      331 |     await expectFormState('ana@example.com', 'Demasiados intentos. Inténtalo más tarde.');
      332 |     await fireEvent.press(screen.getByTestId('forgot-submit'));
    > 333 |     await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.'));
          |                  ^
      334 |     await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
      335 |     await expectFormState('ana@example.com', 'Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.');
      336 |   });

      at Object.<anonymous> (src/screens/forgot/index.test.tsx:333:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #117 R6: reenviar repite la misma petición › un {"errors": [Array], "kind": "validation"} al reenviar pinta «Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.» en forgot-error sin salir de «Revisa tu correo»

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    Received:
      Ingresa un correo electrónico válido

      440 |     await fireEvent.press(screen.getByTestId('forgot-resend'));
      441 |
    > 442 |     expect(await screen.findByTestId('forgot-error')).toHaveTextContent(copy);
          |                                                       ^
      443 |     expect(screen.getByText('Revisa tu correo')).toBeVisible();
      444 |     expect(screen.queryByTestId('forgot-email')).toBeNull();
      445 |     await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());

      at toHaveTextContent (src/screens/forgot/index.test.tsx:442:55)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #65 R1: el grupo (auth) resuelve su copy por clave › resuelve las 51 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/login/index.tsx",
        "key": "validation.checkDetails",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:73:5)

  ● #65 R11: restablecer contraseña resuelve su copy por clave › resuelve las 17 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/reset-password/index.tsx",
        "key": "validation.checkDetails",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:199:5)

  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/login/index.tsx",
        "key": "validation.checkDetails",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:492:5)

  ● R7: login llama a la api y navega › #183 R7: un 400 de validación pinta el aviso genérico y nunca el texto del servidor

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    Received:
      Invalid email address
      Password is too short

      144 |
      145 |     const error = screen.getByTestId('login-error');
    > 146 |     expect(error).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.');
          |                   ^
      147 |     expect(error).not.toHaveTextContent('Invalid email address');
      148 |     expect(error).not.toHaveTextContent('Password is too short');
      149 |     expect(screen.queryAllByTestId(/^login-.+-message-row$/)).toHaveLength(0);

      at Object.toHaveTextContent (src/screens/login/index.test.tsx:146:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● R8: register llama a la api y navega › #183 R7: un 400 de validación pinta el aviso genérico y ningún campo

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    Received:
      Terms must be accepted

      221 |     await submit();
      222 |
    > 223 |     expect(screen.getByTestId('register-error')).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.');
          |                                                  ^
      224 |     for (const message of ['First name is required', 'Invalid email address', 'Terms must be accepted']) {
      225 |       expect(screen.queryByText(message)).toBeNull();
      226 |     }

      at Object.toHaveTextContent (src/screens/register/index.test.tsx:223:50)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 5 failed, 5 total
Tests:       9 failed, 218 passed, 227 total
Snapshots:   0 total
Time:        22.34 s
```

c13: `exit=1`; comparados los nueve títulos y tipos: una aserción en login, una en register, tres en forgot, una en reset, tres en ui-language. Coinciden exactamente con la tabla R7; #172 R10 nace verde con disparo de cliente.

| c13 | `31341795456c9ca7b919c9e79cdb17e0c437b308` | `test(mobile): un 400 pinta el aviso genérico (#183 R7)` | `Tests:       9 failed, 218 passed, 227 total` |

c14: gate `exit=0`, `Tests:       227 passed, 227 total`; TC guarda `exit=0`, tsc `exit=0`; LINT `exit=0`, `vacio=0`. Anclas R7: `validation.checkDetails` 1 en cada pantalla; `errors.map(` 0 en login/reset; mapValidationErrors, ApiFieldError, isRegisterField, serverFieldErrors y RegisterFieldErrors 0 en register; `forgot.invalidEmail` 0 en forgot. c15 no aplica: RegisterFieldErrors se eliminó junto con su mapeo en c14.

### S7.1 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s7-1-183.log`.

```text
  ● #65 R1: el grupo (auth) resuelve su copy por clave › resuelve las 51 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/login/index.tsx",
        "key": "validation.checkDetails",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:73:5)

  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/login/index.tsx",
        "key": "validation.checkDetails",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:492:5)

  ● R7: login llama a la api y navega › #183 R7: un 400 de validación pinta el aviso genérico y nunca el texto del servidor

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    Received:
      Invalid email address
      Password is too short

      144 |
      145 |     const error = screen.getByTestId('login-error');
    > 146 |     expect(error).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.');
          |                   ^
      147 |     expect(error).not.toHaveTextContent('Invalid email address');
      148 |     expect(error).not.toHaveTextContent('Password is too short');
      149 |     expect(screen.queryAllByTestId(/^login-.+-message-row$/)).toHaveLength(0);

      at Object.toHaveTextContent (src/screens/login/index.test.tsx:146:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 2 failed, 2 total
Tests:       3 failed, 66 passed, 69 total
Snapshots:   0 total
Time:        7.613 s
```

### S7.2 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s7-2-183.log`.

```text
  ● R8: register llama a la api y navega › #183 R7: un 400 de validación pinta el aviso genérico y ningún campo

    expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 1
    Received array:  [<View className="w-full flex-row items-center gap-1.5" testID="register-email-message-row"><View color="color:danger" size={14} testID="icon-alert-circle" /><Text className="flex-1 text-13 font-semibold text-danger" selectable={true} testID="register-email-message">Ingresa un correo electrónico válido</Text></View>]

      225 |       expect(screen.queryByText(message)).toBeNull();
      226 |     }
    > 227 |     expect(screen.queryAllByTestId(/^register-.+-message-row$/)).toHaveLength(0);
          |                                                                  ^
      228 |   });
      229 |
      230 |   it.each<[RegisterState, string]>([

      at Object.toHaveLength (src/screens/register/index.test.tsx:227:66)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 93 passed, 94 total
Snapshots:   0 total
Time:        20.992 s, estimated 27 s
```

### S7.3 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s7-3-183.log`.

```text
  ● #65 R1: el grupo (auth) resuelve su copy por clave › resuelve las 51 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/forgot/index.tsx",
        "key": "validation.checkDetails",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:73:5)

  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/forgot/index.tsx",
        "key": "validation.checkDetails",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:492:5)

  ● #117 R7: cada kind distinto de ok pinta su copy en forgot-error › mapea {"errors": [Array], "kind": "validation"} a «Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.» en forgot-error, seleccionable, y deja el formulario en pie

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    Received:
      Ingresa un correo electrónico válido

      306 |     const error = await screen.findByTestId('forgot-error');
      307 |
    > 308 |     expect(error).toHaveTextContent(copy);
          |                   ^
      309 |     expect(error.props.selectable).toBe(true);
      310 |     expect(screen.getByTestId('forgot-title')).toHaveTextContent('Recuperar contraseña');
      311 |     expect(screen.getByTestId('forgot-email').props.value).toBe('  Ana@Example.com ');

      at toHaveTextContent (src/screens/forgot/index.test.tsx:308:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #117 R7: cada kind distinto de ok pinta su copy en forgot-error › un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    Received:
      Ingresa un correo electrónico válido

      331 |     await expectFormState('ana@example.com', 'Demasiados intentos. Inténtalo más tarde.');
      332 |     await fireEvent.press(screen.getByTestId('forgot-submit'));
    > 333 |     await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.'));
          |                  ^
      334 |     await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
      335 |     await expectFormState('ana@example.com', 'Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.');
      336 |   });

      at Object.<anonymous> (src/screens/forgot/index.test.tsx:333:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #117 R6: reenviar repite la misma petición › un {"errors": [Array], "kind": "validation"} al reenviar pinta «Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.» en forgot-error sin salir de «Revisa tu correo»

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    Received:
      Ingresa un correo electrónico válido

      440 |     await fireEvent.press(screen.getByTestId('forgot-resend'));
      441 |
    > 442 |     expect(await screen.findByTestId('forgot-error')).toHaveTextContent(copy);
          |                                                       ^
      443 |     expect(screen.getByText('Revisa tu correo')).toBeVisible();
      444 |     expect(screen.queryByTestId('forgot-email')).toBeNull();
      445 |     await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());

      at toHaveTextContent (src/screens/forgot/index.test.tsx:442:55)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 2 failed, 2 total
Tests:       5 failed, 72 passed, 77 total
Snapshots:   0 total
Time:        11.814 s, estimated 15 s
```

### S7.4 — salida literal (sin bloques Console)

Log completo: `/tmp/jest-s7-4-183.log`.

```text
  ● #65 R11: restablecer contraseña resuelve su copy por clave › resuelve las 17 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/reset-password/index.tsx",
        "key": "validation.checkDetails",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:199:5)

  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/reset-password/index.tsx",
        "key": "validation.checkDetails",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:492:5)

  ● R8: el submit completa el reset y mapea los errores › #183 R7: un 400 de validación pinta el aviso genérico y no el texto del servidor

    expect(received).toBe(expected) // Object.is equality

    - Expected  - 1
    + Received  + 2

    - Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.
    + Password is too short
    + Passwords must match

      245 |
      246 |     const error = await screen.findByTestId('reset-error');
    > 247 |     expect(error.props.children).toBe(
          |                                  ^
      248 |       'Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.',
      249 |     );
      250 |     expect(screen.getByTestId('reset-submit')).toBeVisible();

      at Object.toBe (src/screens/reset-password/index.test.tsx:247:34)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 2 failed, 2 total
Tests:       3 failed, 74 passed, 77 total
Snapshots:   0 total
Time:        8.664 s, estimated 15 s
```

| c14 | `8b5406bb5748096c203756dd862190351a01fa7f` | `feat(mobile): un 400 pinta el aviso genérico (#183 R7)` | `Tests:       227 passed, 227 total` |

S7.1–S7.4: comparados cada título y tipo antes de continuar. Coinciden exactamente: 3, 1, 5 y 3 aserciones. Cada sonda corrió la suite de su pantalla y ui-language; S4.3 incluyó account-screens-polish como exige su tabla.

S7.1:

```text
exit=1
exit=0
cached=0
```

S7.2:

```text
exit=1
exit=0
cached=0
```

S7.3:

```text
exit=1
exit=0
cached=0
```

S7.4:

```text
exit=1
exit=0
cached=0
```

## CIERRE — Reanudacion 1

R1–R7 implementados mediante c1–c14. c15 no aplica. Comienza la verificación final; R8 permanece pendiente (humano).

### CIERRE-guardas — salida literal (sin bloques Console)

Log completo: `/tmp/jest-guardas-183.log`.

```text

Test Suites: 3 passed, 3 total
Tests:       124 passed, 124 total
Snapshots:   0 total
Time:        3.134 s
```

CIERRE 1: guardas `exit=0`, `Tests:       124 passed, 124 total`; TC guarda `exit=0`, tsc `exit=0`; LINT `exit=0`, `vacio=0`.

### CIERRE-timeout-por-defecto — salida literal (sin bloques Console)

Log completo: `/tmp/jest-feature-default-183.log`.

```text

Test Suites: 7 passed, 7 total
Tests:       330 passed, 330 total
Snapshots:   0 total
Time:        28.781 s
```

CIERRE 2: comando sin --testTimeout, `exit=0`, `Test Suites: 7 passed, 7 total`, `Tests:       330 passed, 330 total`.

### Tabla completa por commit (c1–c14)

El commit del leader no se cuenta.

| Paso | Hash | Mensaje literal | Línea Tests: | Rojos |
|---|---|---|---|---|
| c1 | `20a548ab9bf43b9be28515144e483028cc826d16` | `test(mobile): copy de validación (#183 R1)` | `Tests:       2 failed, 35 passed, 37 total` | 2 aserciones |
| c2 | `ca6a57d9b05d59399c94ad766a17d1cbb109555e` | `feat(mobile): copy de validación (#183 R1)` | `Tests:       67 passed, 67 total` | ninguno |
| c3 | `b310900b7fc217a2f712a7b98cf5572d6fd3be55` | `test(mobile): reglas de cuenta iguales a los DTO (#183 R2)` | `Tests:       3 failed, 27 passed, 30 total` | suite que no arranca + 3 excepciones ENOENT |
| c4 | `109e3da9d3642e5efc210c23342d64b18832082a` | `feat(mobile): reglas de cuenta iguales a los DTO (#183 R2)` | `Tests:       96 passed, 96 total` | ninguno |
| c5 | `725e47065bd83d78e30537ca1cda3112e5d946e5` | `test(mobile): login valida en cliente (#183 R3)` | `Tests:       9 failed, 30 passed, 39 total` | 8 consultas + 1 aserción |
| c6 | `5c951711f5625a2da9ec5f321ddb70948b90eaf1` | `feat(mobile): login valida en cliente (#183 R3)` | `Tests:       39 passed, 39 total` | ninguno |
| c7 | `87b4fcb20164c1e87959168a210ed3d011d3c0a0` | `test(mobile): registro valida en cliente (#183 R4)` | `Tests:       20 failed, 74 passed, 94 total` | 19 consultas + 1 aserción |
| c8 | `ac7ab536776545029eabe928447c5d6473203b78` | `feat(mobile): registro valida en cliente (#183 R4)` | `Tests:       94 passed, 94 total` | ninguno |
| c9 | `a8fc62c074868a6199ff9591eca2af91064c83d2` | `test(mobile): recuperar valida en cliente (#183 R5)` | `Tests:       5 failed, 42 passed, 47 total` | 5 consultas |
| c10 | `4d87b606ce918cf3d2d3d8ce9cae1bb3dd4fa6e9` | `feat(mobile): recuperar valida en cliente (#183 R5)` | `Tests:       47 passed, 47 total` | ninguno |
| c11 | `f874ad4d6fef7ca6e8254eeeaf7de591ffe76192` | `test(mobile): nueva contraseña valida en cliente (#183 R6)` | `Tests:       4 failed, 43 passed, 47 total` | 4 consultas |
| c12 | `3a25aa5b11a57f2211d02307c031a0161161cfa0` | `feat(mobile): nueva contraseña valida en cliente (#183 R6)` | `Tests:       47 passed, 47 total` | ninguno |
| c13 | `31341795456c9ca7b919c9e79cdb17e0c437b308` | `test(mobile): un 400 pinta el aviso genérico (#183 R7)` | `Tests:       9 failed, 218 passed, 227 total` | 9 aserciones |
| c14 | `8b5406bb5748096c203756dd862190351a01fa7f` | `feat(mobile): un 400 pinta el aviso genérico (#183 R7)` | `Tests:       227 passed, 227 total` | ninguno |

### Títulos y tipos exactos de los rojos por commit

Comparados con la tabla de cada R antes de continuar. Las salidas literales están en los apartados anteriores.

| Commit | Título completo del bloque ● | Tipo |
|---|---|---|
| c1 | #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas | aserción |
| c1 | #183 R1: el copy de la validación en cliente › #183 R1: declara las claves de validación en los dos idiomas y su registro | aserción |
| c3 | Test suite failed to run | suite que no arranca (Cannot find module) |
| c3 | #65 R1: el grupo (auth) resuelve su copy por clave › resuelve las 50 ocurrencias normativas | excepción ENOENT |
| c3 | #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta | excepción ENOENT |
| c3 | #65 R18: los sitios resuelven por clave y no queda copy suelta › no deja ningún valor fijo del catálogo como literal entero en las pantallas | excepción ENOENT |
| c5 | #183 R3: login valida en cliente › #183 R3: «» en login-email no llama a la API y marca el campo | consulta |
| c5 | #183 R3: login valida en cliente › #183 R3: «alex.example.com» en login-email no llama a la API y marca el campo | consulta |
| c5 | #183 R3: login valida en cliente › #183 R3: «alex@example.c» en login-email no llama a la API y marca el campo | consulta |
| c5 | #183 R3: login valida en cliente › #183 R3: «ñu@example.com» en login-email no llama a la API y marca el campo | consulta |
| c5 | #183 R3: login valida en cliente › #183 R3: sin contraseña no llama a la API y marca login-password | consulta |
| c5 | #183 R3: login valida en cliente › #183 R3: con los dos campos mal pinta los dos mensajes a la vez | consulta |
| c5 | #183 R3: login valida en cliente › #183 R3: envía a la API el correo sin espacios alrededor | aserción |
| c5 | #183 R3: login valida en cliente › #183 R3: en inglés los dos mensajes dicen «Enter a valid email address» y «Enter your password» | consulta |
| c5 | #183 R3: login valida en cliente › #183 R3: corregir y reenviar quita los mensajes y llama una vez a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: first-name con {"register-first-name": ""} pinta «Escribe tu nombre» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: first-name con {"register-first-name": "   "} pinta «Escribe tu nombre» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: first-name con {"register-first-name": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"} pinta «Usa 120 caracteres o menos» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: last-name con {"register-last-name": ""} pinta «Escribe tus apellidos» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: last-name con {"register-last-name": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"} pinta «Usa 120 caracteres o menos» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: email con {"register-email": "alex@example.c"} pinta «Ingresa un correo electrónico válido» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: email con {"register-email": "ñu@example.com"} pinta «Ingresa un correo electrónico válido» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: email con {"register-email": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com"} pinta «Usa 320 caracteres o menos» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: phone con {"register-phone": "123456"} pinta «Usa al menos 7 caracteres» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: phone con {"register-phone": "111111111111111111111"} pinta «Usa 20 caracteres o menos» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: country con {"register-country": "M"} pinta «Escribe las 2 letras de tu país, como MX» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: country con {"register-country": ""} pinta «Escribe las 2 letras de tu país, como MX» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: country con {"register-country": "M1"} pinta «Usa solo letras de la A a la Z» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: country con {"register-country": "ña"} pinta «Usa solo letras de la A a la Z» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: password con {"register-password": "1234567", "register-password-confirmation": "1234567"} pinta «Usa al menos 8 caracteres» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: password con {"register-password": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "register-password-confirmation": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"} pinta «Usa 128 caracteres o menos» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: password-confirmation con {"register-password-confirmation": "correct horsE"} pinta «Las contraseñas no coinciden» solo en ese campo y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: con el formulario vacío pinta los siete mensajes a la vez y no llama a la API | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: en inglés los siete mensajes salen en inglés | consulta |
| c7 | #183 R4: registro valida en cliente › #183 R4: envía el correo sin espacios a register y al login que le sigue | aserción |
| c9 | #183 R5: recuperar valida en cliente › #183 R5: «alex.example.com» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido» | consulta |
| c9 | #183 R5: recuperar valida en cliente › #183 R5: «alex@example.c» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido» | consulta |
| c9 | #183 R5: recuperar valida en cliente › #183 R5: «ñu@example.com» no llama a la API y marca forgot-email con «Ingresa un correo electrónico válido» | consulta |
| c9 | #183 R5: recuperar valida en cliente › #183 R5: «aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com» no llama a la API y marca forgot-email con «Usa 320 caracteres o menos» | consulta |
| c9 | #183 R5: recuperar valida en cliente › #183 R5: corregir el correo quita el mensaje y envía el recortado | consulta |
| c11 | #183 R6: nueva contraseña valida en cliente › #183 R6: ["1234567", "1234567"] pinta «Usa al menos 8 caracteres» en reset-password-message y no llama a la API | consulta |
| c11 | #183 R6: nueva contraseña valida en cliente › #183 R6: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"] pinta «Usa 128 caracteres o menos» en reset-password-message y no llama a la API | consulta |
| c11 | #183 R6: nueva contraseña valida en cliente › #183 R6: ["new-password-123", "new-password-124"] pinta «Las contraseñas no coinciden» en reset-password-confirm-message y no llama a la API | consulta |
| c11 | #183 R6: nueva contraseña valida en cliente › #183 R6: las dos reglas a la vez pintan los dos mensajes | consulta |
| c13 | R8: el submit completa el reset y mapea los errores › #183 R7: un 400 de validación pinta el aviso genérico y no el texto del servidor | aserción |
| c13 | #117 R7: cada kind distinto de ok pinta su copy en forgot-error › mapea {"errors": [Array], "kind": "validation"} a «Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.» en forgot-error, seleccionable, y deja el formulario en pie | aserción |
| c13 | #117 R7: cada kind distinto de ok pinta su copy en forgot-error › un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind | aserción |
| c13 | #117 R6: reenviar repite la misma petición › un {"errors": [Array], "kind": "validation"} al reenviar pinta «Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.» en forgot-error sin salir de «Revisa tu correo» | aserción |
| c13 | #65 R1: el grupo (auth) resuelve su copy por clave › resuelve las 51 ocurrencias normativas | aserción |
| c13 | #65 R11: restablecer contraseña resuelve su copy por clave › resuelve las 17 ocurrencias normativas | aserción |
| c13 | #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta | aserción |
| c13 | R7: login llama a la api y navega › #183 R7: un 400 de validación pinta el aviso genérico y nunca el texto del servidor | aserción |
| c13 | R8: register llama a la api y navega › #183 R7: un 400 de validación pinta el aviso genérico y ningún campo | aserción |

### Resultado global y anclas de cierre

Comando completo de CIERRE 3, ejecutado **una sola vez**, después del bucle de espera literal del handoff:

```sh
bunx jest --testTimeout=30000 > /tmp/jest-all-183.log 2>&1; echo "exit=$?"; command grep -E '^(Test Suites|Tests):' /tmp/jest-all-183.log
```

Salida literal:

```text
fin-espera
exit=0
Test Suites: 111 passed, 111 total
Tests:       3506 passed, 3506 total
```

Coinciden los deltas desde H0: +1 suite y +117 it. Apareció el aviso preexistente `A worker process has failed to exit gracefully`; no hubo fallos ni timeouts. No se repitió ningún comando por carga.

Anclas de CIERRE 4, en el orden literal del handoff (HomeEntrance, mockIcon, diff HomeEntrance, diff mockIcon, backend):

```text
4
2
0
0
0
```

La tabla de §Base medida, recontada por líneas como grep -cF:

| Literal | login | register | forgot | reset-password |
|---|---|---|---|---|
| `isInvalid={Boolean(fieldErrors.` | 2 | 7 | 1 | 2 |
| `<FieldError` | 2 | 7 | 1 | 2 |
| `t(fieldErrors.` | 2 | 7 | 1 | 2 |
| `const EMAIL_PATTERN` | 0 | 0 | 0 | 0 |
| `t('forgot.invalidEmail')` | 0 | 0 | 0 | 0 |
| `t('common.somethingWentWrong')` | 2 | 2 | 1 | 2 |
| `errors.map(` | 0 | 0 | 0 | 0 |
| `mapValidationErrors` | 0 | 0 | 0 | 0 |
| `ApiFieldError` | 0 | 0 | 0 | 0 |
| `t('validation.checkDetails')` | 1 | 1 | 1 | 1 |
| `from '../../utils/account-rules'` | 1 | 1 | 1 | 1 |

`git diff --check`: exit 0, sin salida. Catálogo final: 411 claves por idioma; R1_AUTH: 51; R11_RESET: 17; SCREEN_FILES: 33 (los candados verdes verifican las fórmulas).

S1.2, salida literal de exit y restauración (además del log literal anterior):

```text
exit=1
exit=0
cached=0
```

Las **33 sondas** mutaron exclusivamente producción y nunca se commitearon. Tras cada una se ejecutaron, en este orden, `git checkout HEAD -- <fichero>`, `git diff --quiet HEAD -- <fichero>` y `git diff --cached --quiet`; todas las restauraciones dieron exit=0 y cached=0. Los bloques Console se omiten del informe; los logs completos conservan ese ruido en /tmp.

### Desviaciones de Reanudacion 1

Ninguna. Se aplicó la corrección del leader B4=402; la sección de la primera parada se conserva como historia. Sin timeouts, SIGKILL ni reintentos. c15 no aplica: RegisterFieldErrors se borró con el mapeo en c14.

No se ejecutaron init.sh, push, PR, amend, rebase, merge, prettier, npx ni npm. No se editaron archivos reservados al leader ni el frontmatter de la spec. Las skills cargadas son las indicadas al principio; la spec prevaleció sobre sus recomendaciones de diseño y simulador.

**R8: pendiente (humano)**. No se declara la feature done ni se marca la casilla de humo.

El cierre documental incorpora traceability.md y, después, este informe con el commit --only indicado en el handoff. La comprobación de árbol limpio se ejecuta después del último commit.

### Cierre documental

Trazabilidad commiteada en `922bae1e57509676317448aeb47df926d0b7d94c` — `docs(mobile-account-client-validation): #183 trazabilidad`.

Salida literal de git status --short, desde la raíz, después de ese commit:

```text
?? progress/impl_mobile-account-client-validation.md
```

Solo queda incorporar este informe mediante `git add progress/impl_mobile-account-client-validation.md` y `git commit --only progress/impl_mobile-account-client-validation.md -m 'docs(mobile-account-client-validation): #183 informe de implementación'`, y comprobar después git status --short sin salida.

## Reanudacion 2

Enmienda E1 aprobada en `4046e500`. H0 sigue siendo `56a0b84a67ff6594e5a149d91561e5fca376f36a`; HEAD inicial de esta reanudación: `94ebf827f3a05409a14edd65f217d3e3d169e2a7`. Los siete commits del leader desde `d3ac0fdd` quedan fuera de c16–c20. Se conservan íntegramente las secciones anteriores.

### ANTES DE TOCAR NADA — salida literal

Comando: `pwd`

```text
/home/claude/sites/Pet-Tracker-wt-183
```

Comando: `git branch --show-current`

```text
feature/183-mobile-account-client-validation
```

Comando: `git status --short`

```text
```

Comando: `git rev-list --count d3ac0fdd..HEAD`

```text
7
```

Comando: `git diff --name-only d3ac0fdd HEAD -- mobile-pet-tracker backend-pet-tracker | wc -l`

```text
0
```

Comando: `git status --short`

```text
```

Comando: `sha256sum progress/e1_mobile-account-client-validation/c1[6-9].patch progress/e1_mobile-account-client-validation/c20.patch`

```text
6498fa6e2d44d689318876128e496d6f2204529af7c81f5f62e1eb4da71582f1  progress/e1_mobile-account-client-validation/c16.patch
125b001f3410c7c724472367d10adbe2bd5296d245261fc9f0cb627a584ce56a  progress/e1_mobile-account-client-validation/c17.patch
494bbd1bdd53e02afce1c639d935c092622e17f0783660e3f3306d8431742599  progress/e1_mobile-account-client-validation/c18.patch
a1a10fb89095f17aff51a1272441be512b5dcdfd2a1373f750e10c8f116b2e76  progress/e1_mobile-account-client-validation/c19.patch
db1744205a53add247bbca49560bd95ad7fbff7ff1573d4304a91b230be1efb0  progress/e1_mobile-account-client-validation/c20.patch
```

Comando: `for c in 16 17 18 19 20; do git apply --check progress/e1_mobile-account-client-validation/c$c.patch; echo "c$c exit=$?"; done`

```text
c16 exit=0
c17 exit=0
c18 exit=0
c19 exit=0
c20 exit=0
```

Los bloques vacíos de `git status --short` corresponden a salida sin líneas.

Base: `bunx jest --testTimeout=30000 --runTestsByPath src/utils/account-rules.test.ts src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx`. Log completo: `/tmp/e1-183-base.log`.

```text
exit=0
Test Suites: 5 passed, 5 total
Tests:       263 passed, 263 total
```

Skill cargada en esta reanudación: `ponytail`; el handoff y la spec prevalecen. No se implementan pantallas ni se cambia UI.

### Ejecución c16–c20

Inicio de c16: se aplica únicamente el parche firmado del leader; suite, sondas, TC y LINT antes de cada commit.

#### c16 — gates antes del commit

Parche `c16.patch`: `exit=0`. Suite: `Tests:       71 passed, 71 total`, `exit=0`.

Sondas, salida literal:

```text
OK  c16 RV5: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 RV6: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 RV7: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 A6: 29 rojos (esperados 29) | Tests:       29 failed, 42 passed, 71 total
OK  c16 A10: 29 rojos (esperados 29) | Tests:       29 failed, 42 passed, 71 total
OK  c16 A26: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-loc-_: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-loc--: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-loc-.: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-loc-09: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-loc-plus: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 B6 E-last-_: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-last-+: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-last--: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-last-09: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-dom1-09: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 B4 E-dom--: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-dom-09: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 E-dom+_: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 B5 E-tld6: 1 rojos (esperados 1) | Tests:       1 failed, 70 passed, 71 total
OK  c16 S2.1: 9 rojos (esperados 9) | Tests:       9 failed, 62 passed, 71 total
OK  c16 S2.9: 3 rojos (esperados 3) | Tests:       3 failed, 68 passed, 71 total
exit=0
```

Los títulos coinciden exactamente con los del script y las tablas R2/E1. Los casos puros solo aseveran `toStrictEqual`: todos los rojos son de aserción.

Restauración de producción, índice vacío, guarda del router, TC y LINT (en ese orden):

```text
exit=0
cached=0
exit=0
$ tsc --noEmit
exit=0
exit=0
vacio=0
```

c16 commiteado: `ccf7d49a427ff02e6917d5dd588bbb668d6de923` — `test(mobile): candados de E1 en account-rules (#183 R2)`. Estado desde la raíz tras el commit:

```text
 M progress/impl_mobile-account-client-validation.md
```

Inicio de c17.

#### c17 — gates antes del commit

Parche `c17.patch`: `exit=0`. Suite: `Tests:       40 passed, 40 total`, `exit=0`.

Sondas, salida literal:

```text
OK  c17 RV8: 1 rojos (esperados 1) | Tests:       1 failed, 39 passed, 40 total
OK  c17 S3.2: 9 rojos (esperados 9) | Tests:       9 failed, 31 passed, 40 total
exit=0
```

Títulos exactos contrastados mediante el script con las tablas R3/E1: RV8 es el nuevo `it` de E1; S3.2 son los nueve casos prescritos. Tipo: aserción en ambos escenarios.

Restauración de producción, índice vacío, guarda del router, TC y LINT (en ese orden):

```text
exit=0
cached=0
exit=0
$ tsc --noEmit
exit=0
exit=0
vacio=0
```

c17 commiteado: `7a0cc47318b882dc324e9eab8e3bf077fc8db374` — `test(mobile): candado de E1 en login (#183 R3)`. Estado desde la raíz tras el commit:

```text
 M progress/impl_mobile-account-client-validation.md
```

Inicio de c18.

#### c18 — gates antes del commit

Parche `c18.patch`: `exit=0`. Suite: `Tests:       65 passed, 65 total`, `exit=0`.

Sondas, salida literal:

```text
OK  c18 RV9: 1 rojos (esperados 1) | Tests:       1 failed, 64 passed, 65 total
OK  c18 S4.4: 25 rojos (esperados 25) | Tests:       25 failed, 40 passed, 65 total
exit=0
```

Títulos exactos contrastados mediante el script con R4/E1: RV9 es el nuevo `it`; S4.4 incluye los 20 de R4 y los cinco heredados de #172 R12. Tipo: aserción.

Restauración de producción, índice vacío, guarda del router, TC y LINT (en ese orden):

```text
exit=0
cached=0
exit=0
$ tsc --noEmit
exit=0
exit=0
vacio=0
```

c18 commiteado: `19b0ac1bbb28bd56c8e55907ce0f12a25245cdf1` — `test(mobile): candado de E1 en registro (#183 R4)`. Estado desde la raíz tras el commit:

```text
 M progress/impl_mobile-account-client-validation.md
```

Inicio de c19.

#### c19 — gates antes del commit

Parche `c19.patch`: `exit=0`. Suite: `Tests:       49 passed, 49 total`, `exit=0`.

Sondas, salida literal:

```text
OK  c19 RV10: 1 rojos (esperados 1) | Tests:       1 failed, 48 passed, 49 total
OK  c19 C18: 1 rojos (esperados 1) | Tests:       1 failed, 48 passed, 49 total
OK  c19 C20: 1 rojos (esperados 1) | Tests:       1 failed, 48 passed, 49 total
OK  c19 S5.1: 6 rojos (esperados 6) | Tests:       6 failed, 43 passed, 49 total
OK  c19 S5.3: 6 rojos (esperados 6) | Tests:       6 failed, 43 passed, 49 total
OK  c19 S7.3: 4 rojos (esperados 4) | Tests:       4 failed, 45 passed, 49 total
exit=0
```

Títulos exactos contrastados mediante el script con R5/R7/E1. Tipos: RV10, C18, C20, S5.1 y S7.3 son de aserción; los seis de S5.3 son de consulta (`forgot-email-message` no aparece al quitar `isInvalid`). S7.3 corre solo la pantalla: cuatro rojos, como prescribe E1; la parte de ui-language sigue reservada al reviewer.

Restauración de producción, índice vacío, guarda del router, TC y LINT (en ese orden):

```text
exit=0
cached=0
exit=0
$ tsc --noEmit
exit=0
exit=0
vacio=0
```

c19 commiteado: `4ca57efe5be2a7d10af47c4ca6fd3ffd6e34bf47` — `test(mobile): candados de E1 en recuperar (#183 R5, R7)`. Estado desde la raíz tras el commit:

```text
 M progress/impl_mobile-account-client-validation.md
```

Inicio de c20.

#### c20 — gates antes del commit

Parche `c20.patch`: `exit=0`. Suite: `Tests:       49 passed, 49 total`, `exit=0`.

Sondas, salida literal:

```text
OK  c20 RV11: 1 rojos (esperados 1) | Tests:       1 failed, 48 passed, 49 total
OK  c20 C26: 1 rojos (esperados 1) | Tests:       1 failed, 48 passed, 49 total
OK  c20 C27: 1 rojos (esperados 1) | Tests:       1 failed, 48 passed, 49 total
OK  c20 S6.1: 5 rojos (esperados 5) | Tests:       5 failed, 44 passed, 49 total
OK  c20 S7.4: 2 rojos (esperados 2) | Tests:       2 failed, 47 passed, 49 total
exit=0
```

Títulos exactos contrastados mediante el script con R6/R7/E1. Tipo: aserción en los cinco escenarios. S7.4 corre solo la pantalla: dos rojos, como prescribe E1; la parte de ui-language sigue reservada al reviewer.

Restauración de producción, índice vacío, guarda del router, TC y LINT (en ese orden):

```text
exit=0
cached=0
exit=0
$ tsc --noEmit
exit=0
exit=0
vacio=0
```

c20 commiteado: `9eea5bf4ad64198241e01dd0c106b6cee90f597c` — `test(mobile): candados de E1 en nueva contraseña (#183 R6, R7)`. Estado desde la raíz tras el commit:

```text
 M progress/impl_mobile-account-client-validation.md
```

### Tabla por commit c16–c20

| Paso | Hash | Mensaje literal | Línea Tests: | Sondas | TC | LINT |
|---|---|---|---|---|---|---|
| c16 | `ccf7d49a427ff02e6917d5dd588bbb668d6de923` | `test(mobile): candados de E1 en account-rules (#183 R2)` | `Tests:       71 passed, 71 total` | 22 OK, exit=0 | guarda=0, exit=0 | exit=0, vacio=0 |
| c17 | `7a0cc47318b882dc324e9eab8e3bf077fc8db374` | `test(mobile): candado de E1 en login (#183 R3)` | `Tests:       40 passed, 40 total` | 2 OK, exit=0 | guarda=0, exit=0 | exit=0, vacio=0 |
| c18 | `19b0ac1bbb28bd56c8e55907ce0f12a25245cdf1` | `test(mobile): candado de E1 en registro (#183 R4)` | `Tests:       65 passed, 65 total` | 2 OK, exit=0 | guarda=0, exit=0 | exit=0, vacio=0 |
| c19 | `4ca57efe5be2a7d10af47c4ca6fd3ffd6e34bf47` | `test(mobile): candados de E1 en recuperar (#183 R5, R7)` | `Tests:       49 passed, 49 total` | 6 OK, exit=0 | guarda=0, exit=0 | exit=0, vacio=0 |
| c20 | `9eea5bf4ad64198241e01dd0c106b6cee90f597c` | `test(mobile): candados de E1 en nueva contraseña (#183 R6, R7)` | `Tests:       49 passed, 49 total` | 5 OK, exit=0 | guarda=0, exit=0 | exit=0, vacio=0 |

Los cinco commits contienen exclusivamente su fichero de tests; las 37 sondas restauraron producción. Comienza el cierre de Reanudacion 2.

### Cierre 1 — guardas, TC y LINT

Comando: `bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/account-screens-polish.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/utils/account-rules.test.ts`. Log completo: `/tmp/e1-183-guardas.log`.

```text
exit=0
Test Suites: 6 passed, 6 total
Tests:       252 passed, 252 total
```

Guarda del router, TC y LINT, salida literal:

```text
exit=0
$ tsc --noEmit
exit=0
exit=0
vacio=0
```

### Cierre 2 — siete suites sin --testTimeout

Comando: `bunx jest --runTestsByPath src/utils/account-rules.test.ts src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts src/providers/__tests__/language-provider.test.tsx`. Log completo: `/tmp/e1-183-feature-default.log`.

```text
exit=0
Test Suites: 7 passed, 7 total
Tests:       341 passed, 341 total
```

Inicia el paso 3: espera prescrita y una sola ejecución de la suite móvil completa.

Incidencia de invocación antes de Cierre 3: se escapó por error la llave final del grupo de shell (`\}`). Bash rechazó el grupo antes de la espera y antes de lanzar Jest. Se comprobó que el log completo anterior coincide byte a byte con su copia y que no existe salida del paso 3. Se corrige únicamente la invocación; no se repite ninguna ejecución de la suite completa.

Salida literal del intento de invocación:

```text
/bin/bash: -c: line 20: syntax error: unexpected end of file
```

Exit de la invocación: `2`.

### Cierre 3 — suite móvil completa, una ejecución

Se ejecutó el bucle de espera literal del handoff (hasta 90 iteraciones, `pgrep` de Jest/ESLint/init y `sleep 60`). Esperó a las ejecuciones externas de otras sesiones antes de imprimir `fin-espera`. Después se ejecutó una sola vez:

```sh
bunx jest --testTimeout=30000 > /tmp/jest-all-183.log 2>&1; echo "exit=$?"; command grep -E '^(Test Suites|Tests):' /tmp/jest-all-183.log
```

Salida literal de la espera y de la suite:

```text
fin-espera
exit=0
Test Suites: 111 passed, 111 total
Tests:       3517 passed, 3517 total
```

Coinciden 3506 + 11 = 3517 tests y las mismas 111 suites. No hubo timeouts ni reintentos de tests o LINT. Apareció el aviso preexistente `A worker process has failed to exit gracefully`, permitido por el handoff.

El log completo de la reanudación anterior se preservó antes de este paso en `/tmp/jest-all-183-reanudacion1-before-e1.log`; el de E1 está en `/tmp/jest-all-183.log`.

### Cierre 4 — anclas y alcance

Anclas medidas durante la espera, con los tests ya commiteados. Salida literal: HomeEntrance, mockIcon, los dos diff contra `56a0b84a`, backend y después `git diff --name-only d3ac0fdd HEAD -- . | sort`, desde `mobile-pet-tracker/`:

```text
4
2
0
0
0
mobile-pet-tracker/src/screens/forgot/index.test.tsx
mobile-pet-tracker/src/screens/login/index.test.tsx
mobile-pet-tracker/src/screens/register/index.test.tsx
mobile-pet-tracker/src/screens/reset-password/index.test.tsx
mobile-pet-tracker/src/utils/account-rules.test.ts
```

Anclas por pantalla, contadas por líneas como `grep -cF`; las once filas coinciden con los valores finales de R3–R7:

| Literal | login | register | forgot | reset-password |
|---|---|---|---|---|
| `isInvalid={Boolean(fieldErrors.` | 2 | 7 | 1 | 2 |
| `<FieldError` | 2 | 7 | 1 | 2 |
| `t(fieldErrors.` | 2 | 7 | 1 | 2 |
| `const EMAIL_PATTERN` | 0 | 0 | 0 | 0 |
| `t('forgot.invalidEmail')` | 0 | 0 | 0 | 0 |
| `t('common.somethingWentWrong')` | 2 | 2 | 1 | 2 |
| `errors.map(` | 0 | 0 | 0 | 0 |
| `mapValidationErrors` | 0 | 0 | 0 | 0 |
| `ApiFieldError` | 0 | 0 | 0 | 0 |
| `t('validation.checkDetails')` | 1 | 1 | 1 | 1 |
| `from '../../utils/account-rules'` | 1 | 1 | 1 | 1 |

La comparación final contra `94ebf827` confirma únicamente los cinco tests más trazabilidad e informe. Producción, backend, parches, `sondas_e1.py`, requirements, design y tasks permanecen intactos. Los cinco commits c16–c20 contienen cada uno un solo fichero de tests. La comprobación SHA-256 del prefijo del informe confirma que sus secciones anteriores se conservaron byte a byte.

### Desviaciones de Reanudacion 2

Una incidencia de invocación en Cierre 3: se escapó la llave final del grupo de shell y Bash salió con 2 antes de arrancar Jest. La salida literal y la comprobación del log anterior están arriba. Se corrigió únicamente el comando de shell. La suite completa se ejecutó una sola vez. La espera por procesos externos era la prevista en el handoff.

No se ejecutaron `./init.sh`, push, PR, amend, rebase, merge, prettier, npx ni npm. Los archivos reservados al leader y la casilla humana de R8 permanecen intactos. **R8: pendiente (humano).**

### Cierre documental de E1

Verificaciones y anclas completas. Se incorpora primero la trazabilidad y después este informe mediante el commit `--only` indicado. La comprobación final de `git status --short` se realiza tras el último commit.

Trazabilidad de E1 commiteada: `5bcaf612a88492a0ce2194887e9e838b2338fc4b` — `docs(mobile-account-client-validation): #183 trazabilidad de E1`. Salida literal de `git status --short` desde la raíz después de ese commit:

```text
 M progress/impl_mobile-account-client-validation.md
```

Este informe se incorpora con `docs(mobile-account-client-validation): #183 informe de E1`; a continuación se comprueba el árbol limpio.

## Cierre — merge de origin/main con #174 (deaf4e6d)

Excepción trivial de CLAUDE.md (fallback al subagente `implementer`, como en `e61c5bb5` y `6f96bef6`): resolución del conflicto del `git merge --no-ff --no-commit origin/main` (`deaf4e6d`, trae #174) en el único fichero en conflicto, `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`. Sin spec nueva ni TDD; ningún otro fichero de la app tocado. `specs/mobile-ui-language/design.md` lo resolvió el leader (§2.30 para #174, §2.31 para #183).

- **Hunk de la longitud del catálogo** (tras `- 4 + 3 // #173 R13`): quedan las dos líneas, `+ 1 // #174 R2` (sin coma) y `+ 9, // #183 R1` (cierra con coma), antes del `);`.
- **Hunk del final del fichero**: quedan los dos `describe` completos y sin cambios, primero `#174 R2: días con palabra completa` y después `#183 R1: el copy de la validación en cliente`, separados por una línea en blanco. Las líneas en blanco previas al conflicto quedan como estaban.
- Marcadores: `grep -cE '^(<<<<<<<|=======|>>>>>>>)'` sobre el fichero = `0`. `git diff HEAD` del fichero solo añade lo de #174; `git diff origin/main` solo añade lo de #183 (más la coma movida).

Verificación desde `mobile-pet-tracker/`, en primer plano y exit medido sin pipe:

- `bunx jest --testTimeout=30000 --runTestsByPath src/providers/__tests__/language-provider.test.tsx`: exit 0, `Test Suites: 1 passed, 1 total`, `Tests: 41 passed, 41 total`.
- `bunx tsc --noEmit`: exit 0, sin salida. `.expo/types/router.d.ts` no existía; no hubo que borrar nada.
- `bunx eslint src/providers/__tests__/language-provider.test.tsx`: exit 0, sin salida.

No se ejecutaron `./init.sh` ni la suite móvil completa. Solo `git add` del test y de este informe; sin commit, merge ni push (el commit de merge lo hace el leader).

## Cierre — merge de origin/main con #175 (58bf412c)

Excepción trivial de CLAUDE.md (fallback al subagente `implementer`), igual que el cierre anterior: se resolvió el conflicto del `git merge --no-ff --no-commit origin/main` (`58bf412c`, trae #175, PR #221). Hubo un solo hunk, en el único fichero en conflicto: `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`. Antes de tocar nada se comprobó que `diff --name-only --diff-filter=U` daba solo ese fichero y que tenía exactamente 3 marcadores. No hay spec nueva ni TDD, y no se tocó ningún otro fichero de la app. `specs/mobile-ui-language/design.md` lo resolvió el leader: §2.31 para #175 y §2.32 para #183.

- **Hunk de la longitud del catálogo** (tras `- 4 + 3 // #173 R13`): quedan `+ 7 // #175 R3`, `+ 1 // #174 R2` (sin coma) y `+ 9, // #183 R1` (cierra con coma), antes del `);`. Nada más del fichero cambia. El `describe('#175 R3: claves de Documentos del canvas', …)` lo fusionó git sin conflicto.
- Marcadores: `grep -cE '^(<<<<<<<|=======|>>>>>>>)'` sobre el fichero da `0`. El `git diff HEAD` del fichero solo añade lo de #175. El `git diff origin/main` solo añade lo de #183, más la coma movida.

Verificación desde `mobile-pet-tracker/`, en primer plano y con el exit medido sin pipe:

- `bunx jest --testTimeout=30000 --runTestsByPath src/providers/__tests__/language-provider.test.tsx`: exit 0, `Test Suites: 1 passed, 1 total`, `Tests: 42 passed, 42 total`.
- `bunx tsc --noEmit`: exit 0, sin salida. `.expo/types/router.d.ts` no existía.
- `bunx eslint src/providers/__tests__/language-provider.test.tsx`: exit 0, sin salida.

No se ejecutaron `./init.sh` ni la suite móvil completa. Solo se hizo `git add` del test y de este informe, sin commit, merge ni push.
