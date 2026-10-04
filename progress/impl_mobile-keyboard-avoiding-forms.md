```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-148
$ git branch --show-current
feature/148-mobile-keyboard-avoiding-forms
$ git rev-parse --short HEAD
eb595a29
```

H0 (HEAD del handoff): `eb595a29`. Todas las mediciones de alcance se hacen contra H0.

**Resultado R1–R9:** 12 suites / 387 tests verdes (+11), tsc/lint exit=0, 25 sondas rojas y sus 25 reversiones verdes, 16 ficheros permitidos. 15 commits literales + 1 refactor de indentación. R10 reservado al humano.

## Inicio

2026-10-04: verificada la branch requerida. Lectura del handoff y de la spec completa antes de implementar. Sin init.sh, push ni PR, conforme al alcance explícito de esta sesión.

## Skills y lecturas

- `building-native-ui`: `/home/claude/.codex/.tmp/plugins/plugins/expo/skills/building-native-ui/SKILL.md`.
- `ponytail` (full): `/home/claude/.codex/plugins/cache/ponytail/ponytail/4.10.0/skills/ponytail/SKILL.md`.
- Spec completa, conventions, ui-guidelines, architecture, verification, CHECKPOINTS y AGENTS móvil leídos. AGENTS móvil exige leer https://docs.expo.dev/versions/v57.0.0/: leído antes de editar código. La spec y el handoff específicos prevalecen sobre consejos genéricos de la skill (useContext, className, dev build y ausencia de rediseño). No aplica appllama.
- `git merge-base --is-ancestor 9cf45204 HEAD; echo "exit=$?"`: `exit=0`.
- `test ! -e .expo/types/router.d.ts` desde mobile: `exit=0`.

## Anclas al arrancar

```text
grep -F -c 'export default function Login()' src/app/(auth)/login.tsx -> 1
grep -F -c 'centra el contenido dentro de un ScrollView con los insets aplicados' src/app/(auth)/__tests__/login.test.tsx -> 1
grep -F -c 'no centra horizontalmente, que no lo hacía el View de hoy' src/app/(auth)/__tests__/login.test.tsx -> 1
grep -F -c 'function AuthScreenWrapper' src/app/(auth)/__tests__/login.test.tsx -> 1
grep -F -c 'async function renderLogin()' src/app/(auth)/__tests__/login.test.tsx -> 1
grep -c "Platform" src/app/(auth)/login.tsx -> 0
grep -F -c 'function WeightLogContent({ petId }' src/screens/weight-log/index.tsx -> 1
grep -F -c 'shows loading and the metrics under the native header (#95 R6)' src/screens/weight-log/index.test.tsx -> 1
grep -F -c 'R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa' src/screens/weight-log/index.test.tsx -> 1
grep -F -c 'retira el botón y el título del cuerpo' src/screens/weight-log/index.test.tsx -> 1
grep -F -c 'async function renderWeightLog(selected = true)' src/screens/weight-log/index.test.tsx -> 1
grep -c "Platform" src/screens/weight-log/index.tsx -> 0
grep -F -c 'export default function Register()' src/app/(auth)/register.tsx -> 1
grep -F -c 'aplica el padding del contentContainerStyle con los safe-area insets' src/app/(auth)/__tests__/register.test.tsx -> 1
grep -F -c 'declara el ajuste automático de inset del contenedor de scroll' src/app/(auth)/__tests__/register.test.tsx -> 1
grep -F -c 'function AuthScreenWrapper' src/app/(auth)/__tests__/register.test.tsx -> 1
grep -F -c 'async function renderRegister()' src/app/(auth)/__tests__/register.test.tsx -> 1
grep -c "Platform" src/app/(auth)/register.tsx -> 0
grep -F -c 'export function ResetPasswordScreen()' src/screens/reset-password/index.tsx -> 1
grep -F -c 'la rama del formulario no centra en horizontal' src/screens/reset-password/index.test.tsx -> 1
grep -F -c 'la rama sin token centra también en horizontal' src/screens/reset-password/index.test.tsx -> 1
grep -F -c 'la rama de éxito centra también en horizontal' src/screens/reset-password/index.test.tsx -> 1
grep -F -c 'async function renderRoute(token?: string)' src/screens/reset-password/index.test.tsx -> 1
grep -c "Platform" src/screens/reset-password/index.tsx -> 0
grep -F -c 'export function AddPetScreen()' src/screens/add-pet/index.tsx -> 1
grep -F -c 'usa solo el inset inferior del dispositivo' src/screens/add-pet/index.test.tsx -> 1
grep -F -c 'renders the complete two-section form and deterministic preview' src/screens/add-pet/index.test.tsx -> 1
grep -F -c 'async function renderAddPet()' src/screens/add-pet/index.test.tsx -> 1
grep -F -c 'function setPlatform' src/screens/add-pet/index.test.tsx -> 1
grep -c "Platform" src/screens/add-pet/index.tsx -> 0
grep -F -c 'function AddReminderContent({ petId }' src/screens/add-reminder/index.tsx -> 1
grep -F -c 'uses the metrics under the native header (#95 R6)' src/screens/add-reminder/index.test.tsx -> 1
grep -F -c 'retira el botón y el título del cuerpo' src/screens/add-reminder/index.test.tsx -> 1
grep -F -c 'async function renderAddReminder(selected = true)' src/screens/add-reminder/index.test.tsx -> 1
grep -F -c 'function setPlatform' src/screens/add-reminder/index.test.tsx -> 1
grep -c "Platform" src/screens/add-reminder/index.tsx -> 0
grep -F -c 'export function PairingScreen()' src/screens/pairing/index.tsx -> 1
grep -F -c 'renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)' src/screens/pairing/index.test.tsx -> 1
grep -F -c 'retira el botón de volver del cuerpo' src/screens/pairing/index.test.tsx -> 1
grep -F -c 'function PairingWrapper({ children }' src/screens/pairing/index.test.tsx -> 1
grep -F -c 'async function renderPairing()' src/screens/pairing/index.test.tsx -> 1
grep -c "Platform" src/screens/pairing/index.tsx -> 0
Recuento base <TextInput en src/: 8
```

Todas las anclas dan 1 y Platform da 0 en los siete ficheros.

Recuento base de producción `<TextInput`: **6**, excluyendo `*.test.*` como `sourceFiles()` del candado #62 R12. El recuento bruto 8 de arriba incluye la regex del candado y un doble en profile/index.test.tsx; ambos se medirán al cierre.

## base: login

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/base-login.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        3.073 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
exit=0
```

## base: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/base-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        6.287 s, estimated 48 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=0
```

## base: register

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/register.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/base-register.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        4.152 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
exit=0
```

## base: reset-password

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/base-reset-password.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        4.678 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
exit=0
```

## base: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/base-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        3.795 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=0
```

## base: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/base-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       39 passed, 39 total
Snapshots:   0 total
Time:        4.226 s, estimated 35 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=0
```

## base: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/base-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       52 passed, 52 total
Snapshots:   0 total
Time:        6.824 s, estimated 37 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=0
```

## base: globales

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/layout.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/base-globales.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 5 passed, 5 total
Tests:       190 passed, 190 total
Snapshots:   0 total
Time:        3.532 s
Ran all test suites within paths "src/__tests__/design-drift.test.ts", "src/__tests__/consistency-classnames.test.ts", "src/__tests__/legibility-classnames.test.ts", "src/__tests__/ui-language.test.ts", "src/app/__tests__/layout.test.tsx".
exit=0
```

## base: tsc

Comando desde `mobile-pet-tracker/`:

```bash
bunx tsc --noEmit > /tmp/pet148-eb595a29/base-tsc.log 2>&1; echo "exit=$?"
```

Guarda previa `test ! -e .expo/types/router.d.ts`: `exit=0`.

```text

exit=0
```

Salida:

```text

```

## base: lint

Comando desde `mobile-pet-tracker/`:

```bash
bunx expo lint > /tmp/pet148-eb595a29/base-lint.log 2>&1; echo "exit=$?"
```

```text

exit=0
```

Salida:

```text

```

## rojo: login

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/rojo-login.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 8 passed, 11 total
Snapshots:   0 total
Time:        3.657 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
exit=1
```

### #61 R8: login tiene contenedor de scroll con safe areas › centra el contenido dentro de un ScrollView con los insets aplicados

```text
Unable to find an element with testID: login-form
```

### #61 R8: login tiene contenedor de scroll con safe areas › no centra horizontalmente, que no lo hacía el View de hoy

```text
Unable to find an element with testID: login-form
```

### #148 R1: login se aparta del teclado en Android › el host screen-login añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (/home/claude/sites/Pet-Tracker-wt-148/mobile-pet-tracker/src/app/(auth)../../../../../__tests__/login.test.tsx:189:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       3 failed, 8 passed, 11 total
Snapshots:   0 total
Time:        3.657 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
```

## verde: login

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/verde-login.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        6.247 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
exit=0
```

## M-a: login

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/M-a-login.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 8 passed, 11 total
Snapshots:   0 total
Time:        3.543 s, estimated 7 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
exit=1
```

### #61 R8: login tiene contenedor de scroll con safe areas › centra el contenido dentro de un ScrollView con los insets aplicados

```text
Unable to find an element with testID: login-form
```

### #61 R8: login tiene contenedor de scroll con safe areas › no centra horizontalmente, que no lo hacía el View de hoy

```text
Unable to find an element with testID: login-form
```

### #148 R1: login se aparta del teclado en Android › el host screen-login añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (/home/claude/sites/Pet-Tracker-wt-148/mobile-pet-tracker/src/app/(auth)../../../../../__tests__/login.test.tsx:189:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       3 failed, 8 passed, 11 total
Snapshots:   0 total
Time:        3.543 s, estimated 7 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
```

Restaurada M-a con `git checkout HEAD -- mobile-pet-tracker/src/app/(auth)/login.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-a: login

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-a-login.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        3.027 s, estimated 4 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
exit=0
```

## M-b: login

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/M-b-login.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 10 passed, 11 total
Snapshots:   0 total
Time:        3.649 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
exit=1
```

### #148 R1: login se aparta del teclado en Android › el host screen-login añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (/home/claude/sites/Pet-Tracker-wt-148/mobile-pet-tracker/src/app/(auth)../../../../../__tests__/login.test.tsx:189:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 10 passed, 11 total
Snapshots:   0 total
Time:        3.649 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
```

Restaurada M-b con `git checkout HEAD -- mobile-pet-tracker/src/app/(auth)/login.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-b: login

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-b-login.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        3.016 s, estimated 4 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
exit=0
```

## M-c: login

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/M-c-login.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 10 passed, 11 total
Snapshots:   0 total
Time:        4.47 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
exit=1
```

### #148 R1: login se aparta del teclado en Android › el host screen-login añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 200;
+ paddingBottom: 291;
at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-148/mobile-pet-tracker/src/app/(auth)../../../../../__tests__/login.test.tsx:201:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 10 passed, 11 total
Snapshots:   0 total
Time:        4.47 s
```

Restaurada M-c con `git checkout HEAD -- mobile-pet-tracker/src/app/(auth)/login.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-c: login

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-c-login.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        3.597 s, estimated 5 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx".
exit=0
```

M-d en login: no aplica a R8; cubridor existente: `centra el contenido dentro de un ScrollView con los insets aplicados`.

Interpretación del rojo de login: R1 cae por `toHaveStyle({ paddingBottom: 0 })`, Expected `{ paddingBottom: 0 }`, Received estilo sin clave `paddingBottom`; los dos #61 R8 caen exclusivamente por consulta `getByTestId('login-form')`. No hay fallos técnicos. Commits: `eba73094` (test R1) → `5fc9650e` (producción R1).

## rojo: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/rojo-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 29 passed, 33 total
Snapshots:   0 total
Time:        6.577 s, estimated 7 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=1
```

### R7: weight log lista el historial › shows loading and the metrics under the native header (#95 R6)

```text
Unable to find an element with testID: weight-log-form
```

### R7: weight log lista el historial › R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa

```text
Unable to find an element with testID: weight-log-form
```

### #148 R7: weight-log se aparta del teclado en Android › el host screen-weight-log añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/weight-log/index.test.tsx:706:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### #148 R8: weight-log entrega el primer toque con el teclado abierto › el scroll weight-log-form declara keyboardShouldPersistTaps handled

```text
Unable to find an element with testID: weight-log-form
```

Rojo validado de weight-log: R7 por aserción `toHaveStyle({ paddingBottom: 0 })`, Expected `{ paddingBottom: 0 }`, Received estilo sin clave `paddingBottom`; todos los demás `it` rojos arriba por consulta `getByTestId('weight-log-form')`. Lista de fallos exactamente igual a la spec, sin errores técnicos.

Commit `34621c02`: `test(mobile): lock the keyboard padding of weight-log (#148 R7, R8)` (solo `mobile-pet-tracker/src/screens/weight-log/index.test.tsx`).

## verde: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/verde-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        6.556 s, estimated 7 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=0
```

Commit `1739b277`: `feat(mobile): keep the weight-log form above the keyboard (#148 R7, R8)` (solo `mobile-pet-tracker/src/screens/weight-log/index.tsx`).

## M-a: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-a-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 29 passed, 33 total
Snapshots:   0 total
Time:        6.726 s, estimated 7 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=1
```

### R7: weight log lista el historial › shows loading and the metrics under the native header (#95 R6)

```text
Unable to find an element with testID: weight-log-form
```

### R7: weight log lista el historial › R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa

```text
Unable to find an element with testID: weight-log-form
```

### #148 R7: weight-log se aparta del teclado en Android › el host screen-weight-log añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/weight-log/index.test.tsx:706:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### #148 R8: weight-log entrega el primer toque con el teclado abierto › el scroll weight-log-form declara keyboardShouldPersistTaps handled

```text
Unable to find an element with testID: weight-log-form
```

Restaurada M-a con `git checkout HEAD -- mobile-pet-tracker/src/screens/weight-log/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-a: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-a-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        6.732 s, estimated 7 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=0
```

## M-b: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-b-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 32 passed, 33 total
Snapshots:   0 total
Time:        6.653 s, estimated 7 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=1
```

### #148 R7: weight-log se aparta del teclado en Android › el host screen-weight-log añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/weight-log/index.test.tsx:706:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 32 passed, 33 total
Snapshots:   0 total
Time:        6.653 s, estimated 7 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
```

Restaurada M-b con `git checkout HEAD -- mobile-pet-tracker/src/screens/weight-log/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-b: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-b-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        5.988 s, estimated 7 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=0
```

## M-c: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-c-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 32 passed, 33 total
Snapshots:   0 total
Time:        7.74 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=1
```

### #148 R7: weight-log se aparta del teclado en Android › el host screen-weight-log añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 291;
+ paddingBottom: 200;
at Object.<anonymous> (src/screens/weight-log/index.test.tsx:718:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 32 passed, 33 total
Snapshots:   0 total
Time:        7.74 s
```

Restaurada M-c con `git checkout HEAD -- mobile-pet-tracker/src/screens/weight-log/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-c: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-c-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        6.088 s, estimated 8 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=0
```

## M-d: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-d-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 32 passed, 33 total
Snapshots:   0 total
Time:        6.648 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=1
```

### #148 R8: weight-log entrega el primer toque con el teclado abierto › el scroll weight-log-form declara keyboardShouldPersistTaps handled

```text
expect(received).toBe(expected) // Object.is equality
Expected: "handled"
Received: undefined
at Object.toBe (src/screens/weight-log/index.test.tsx:736:83)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 32 passed, 33 total
Snapshots:   0 total
Time:        6.648 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
```

Restaurada M-d con `git checkout HEAD -- mobile-pet-tracker/src/screens/weight-log/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-d: weight-log

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-d-weight-log.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        6.108 s, estimated 7 s
Ran all test suites within paths "src/screens/weight-log/index.test.tsx".
exit=0
```

## rojo: register

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/register.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/rojo-register.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 10 passed, 13 total
Snapshots:   0 total
Time:        6.145 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
exit=1
```

### #61 R7: register usa las métricas de pantalla uniformes › aplica el padding del contentContainerStyle con los safe-area insets

```text
Unable to find an element with testID: register-form
```

### #61 R7: register usa las métricas de pantalla uniformes › declara el ajuste automático de inset del contenedor de scroll

```text
Unable to find an element with testID: register-form
```

### #148 R2: register se aparta del teclado en Android › el host screen-register añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (/home/claude/sites/Pet-Tracker-wt-148/mobile-pet-tracker/src/app/(auth)../../../../../__tests__/register.test.tsx:273:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       3 failed, 10 passed, 13 total
Snapshots:   0 total
Time:        6.145 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
```

Rojo validado de register: R2 por aserción `toHaveStyle({ paddingBottom: 0 })`, Expected `{ paddingBottom: 0 }`, Received estilo sin clave `paddingBottom`; todos los demás `it` rojos arriba por consulta `getByTestId('register-form')`. Lista de fallos exactamente igual a la spec, sin errores técnicos.

Commit `7e281c59`: `test(mobile): lock the keyboard padding of register (#148 R2)` (solo `mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx`).

## verde: register

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/register.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/verde-register.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        5.527 s, estimated 6 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
exit=0
```

Commit `203e541a`: `feat(mobile): keep the register form above the keyboard (#148 R2)` (solo `mobile-pet-tracker/src/app/(auth)/register.tsx`).

## M-a: register

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/register.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/M-a-register.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 10 passed, 13 total
Snapshots:   0 total
Time:        4.941 s, estimated 6 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
exit=1
```

### #61 R7: register usa las métricas de pantalla uniformes › aplica el padding del contentContainerStyle con los safe-area insets

```text
Unable to find an element with testID: register-form
```

### #61 R7: register usa las métricas de pantalla uniformes › declara el ajuste automático de inset del contenedor de scroll

```text
Unable to find an element with testID: register-form
```

### #148 R2: register se aparta del teclado en Android › el host screen-register añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (/home/claude/sites/Pet-Tracker-wt-148/mobile-pet-tracker/src/app/(auth)../../../../../__tests__/register.test.tsx:273:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       3 failed, 10 passed, 13 total
Snapshots:   0 total
Time:        4.941 s, estimated 6 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
```

Restaurada M-a con `git checkout HEAD -- mobile-pet-tracker/src/app/(auth)/register.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-a: register

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/register.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-a-register.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        4.404 s, estimated 5 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
exit=0
```

## M-b: register

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/register.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/M-b-register.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 12 passed, 13 total
Snapshots:   0 total
Time:        4.825 s, estimated 5 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
exit=1
```

### #148 R2: register se aparta del teclado en Android › el host screen-register añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (/home/claude/sites/Pet-Tracker-wt-148/mobile-pet-tracker/src/app/(auth)../../../../../__tests__/register.test.tsx:273:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 12 passed, 13 total
Snapshots:   0 total
Time:        4.825 s, estimated 5 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
```

Restaurada M-b con `git checkout HEAD -- mobile-pet-tracker/src/app/(auth)/register.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## Resumen parcial R1 y R7/R8

Login: base 10 → verde 11; rojo 3 failed / 8 passed. Weight-log: base 31 → verde 33; rojo 4 failed / 29 passed. Se reapuntan exactamente 4 + 2 lecturas respectivamente, sin cambiar sus valores. Sondas M-a/M-b/M-c y M-d donde aplica observadas rojas, revertidas una a una y medidas verdes otra vez; el índice queda vacío tras cada reversión.

## revertida-M-b: register

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/register.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-b-register.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        4.493 s, estimated 5 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
exit=0
```

## M-c: register

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/register.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/M-c-register.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 12 passed, 13 total
Snapshots:   0 total
Time:        5.699 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
exit=1
```

### #148 R2: register se aparta del teclado en Android › el host screen-register añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 200;
+ paddingBottom: 291;
at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-148/mobile-pet-tracker/src/app/(auth)../../../../../__tests__/register.test.tsx:285:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 12 passed, 13 total
Snapshots:   0 total
Time:        5.699 s
```

Restaurada M-c con `git checkout HEAD -- mobile-pet-tracker/src/app/(auth)/register.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-c: register

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/register.test.tsx" --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-c-register.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        4.444 s, estimated 6 s
Ran all test suites within paths "src/app/(auth)/__tests__/register.test.tsx".
exit=0
```

M-d en register: no aplica a R8; cubridor existente: `sin cubridor (§Fuera de alcance)`.

## rojo: reset-password

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/rojo-reset-password.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 17 passed, 19 total
Snapshots:   0 total
Time:        3.35 s, estimated 5 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
exit=1
```

### #61 R8: las tres ramas de reset tienen contenedor de scroll › la rama del formulario no centra en horizontal

```text
Unable to find an element with testID: reset-password-form
```

### #148 R3: reset-password se aparta del teclado en Android › el host screen-reset-password añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/reset-password/index.test.tsx:295:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 17 passed, 19 total
Snapshots:   0 total
Time:        3.35 s, estimated 5 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
```

Rojo validado de reset-password: R3 por aserción `toHaveStyle({ paddingBottom: 0 })`, Expected `{ paddingBottom: 0 }`, Received estilo sin clave `paddingBottom`; todos los demás `it` rojos arriba por consulta `getByTestId('reset-password-form')`. Lista de fallos exactamente igual a la spec, sin errores técnicos.

Commit `f2f57bfd`: `test(mobile): lock the keyboard padding of reset-password (#148 R3)` (solo `mobile-pet-tracker/src/screens/reset-password/index.test.tsx`).

## verde: reset-password

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/verde-reset-password.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        3.419 s, estimated 4 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
exit=0
```

Commit `0781cd9d`: `feat(mobile): keep the reset-password form above the keyboard (#148 R3)` (solo `mobile-pet-tracker/src/screens/reset-password/index.tsx`).

## M-a: reset-password

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-a-reset-password.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 17 passed, 19 total
Snapshots:   0 total
Time:        4.209 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
exit=1
```

### #61 R8: las tres ramas de reset tienen contenedor de scroll › la rama del formulario no centra en horizontal

```text
Unable to find an element with testID: reset-password-form
```

### #148 R3: reset-password se aparta del teclado en Android › el host screen-reset-password añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/reset-password/index.test.tsx:295:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 17 passed, 19 total
Snapshots:   0 total
Time:        4.209 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
```

Restaurada M-a con `git checkout HEAD -- mobile-pet-tracker/src/screens/reset-password/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-a: reset-password

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-a-reset-password.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        3.3 s, estimated 5 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
exit=0
```

## M-b: reset-password

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-b-reset-password.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 18 passed, 19 total
Snapshots:   0 total
Time:        3.593 s, estimated 4 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
exit=1
```

### #148 R3: reset-password se aparta del teclado en Android › el host screen-reset-password añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/reset-password/index.test.tsx:295:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 18 passed, 19 total
Snapshots:   0 total
Time:        3.593 s, estimated 4 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
```

Restaurada M-b con `git checkout HEAD -- mobile-pet-tracker/src/screens/reset-password/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-b: reset-password

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-b-reset-password.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        3.109 s, estimated 4 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
exit=0
```

## M-c: reset-password

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-c-reset-password.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 18 passed, 19 total
Snapshots:   0 total
Time:        4.653 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
exit=1
```

### #148 R3: reset-password se aparta del teclado en Android › el host screen-reset-password añade paddingBottom 200 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 200;
+ paddingBottom: 291;
at Object.<anonymous> (src/screens/reset-password/index.test.tsx:307:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 18 passed, 19 total
Snapshots:   0 total
Time:        4.653 s
```

Restaurada M-c con `git checkout HEAD -- mobile-pet-tracker/src/screens/reset-password/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-c: reset-password

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-c-reset-password.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        3.187 s, estimated 5 s
Ran all test suites within paths "src/screens/reset-password/index.test.tsx".
exit=0
```

M-d en reset-password: no aplica a R8; cubridor existente: `la rama del formulario no centra en horizontal`.

Reset-password: comparación literal de las dos ramas sin formulario contra H0 (`if (!normalizedToken)` hasta el último `return`): idénticas. En el verde hay una sola KAV y los dos ScrollView de sin-token/éxito mantienen `screen-reset-password`.

## rojo: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/rojo-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 23 passed, 26 total
Snapshots:   0 total
Time:        4.288 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=1
```

### #95 R6: métricas bajo cabecera nativa › usa solo el inset inferior del dispositivo

```text
Unable to find an element with testID: add-pet-form
```

### #148 R4: add-pet se aparta del teclado en Android › el host screen-add-pet añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/add-pet/index.test.tsx:577:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### #148 R8: add-pet entrega el primer toque con el teclado abierto › el scroll add-pet-form declara keyboardShouldPersistTaps handled

```text
Unable to find an element with testID: add-pet-form
```

Rojo validado de add-pet: R4 por aserción `toHaveStyle({ paddingBottom: 0 })`, Expected `{ paddingBottom: 0 }`, Received estilo sin clave `paddingBottom`; todos los demás `it` rojos arriba por consulta `getByTestId('add-pet-form')`. Lista de fallos exactamente igual a la spec, sin errores técnicos.

Commit `0e1332c5`: `test(mobile): lock the keyboard padding of add-pet (#148 R4, R8)` (solo `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`).

## verde: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/verde-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        4.126 s, estimated 5 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=0
```

Commit `2dcf1364`: `feat(mobile): keep the add-pet form above the keyboard (#148 R4, R8)` (solo `mobile-pet-tracker/src/screens/add-pet/index.tsx`).

## M-a: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-a-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 23 passed, 26 total
Snapshots:   0 total
Time:        4.403 s, estimated 5 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=1
```

### #95 R6: métricas bajo cabecera nativa › usa solo el inset inferior del dispositivo

```text
Unable to find an element with testID: add-pet-form
```

### #148 R4: add-pet se aparta del teclado en Android › el host screen-add-pet añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/add-pet/index.test.tsx:577:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### #148 R8: add-pet entrega el primer toque con el teclado abierto › el scroll add-pet-form declara keyboardShouldPersistTaps handled

```text
Unable to find an element with testID: add-pet-form
```

Restaurada M-a con `git checkout HEAD -- mobile-pet-tracker/src/screens/add-pet/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-a: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-a-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        3.811 s, estimated 5 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=0
```

## M-b: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-b-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Snapshots:   0 total
Time:        4.61 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=1
```

### #148 R4: add-pet se aparta del teclado en Android › el host screen-add-pet añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/add-pet/index.test.tsx:577:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Snapshots:   0 total
Time:        4.61 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
```

Restaurada M-b con `git checkout HEAD -- mobile-pet-tracker/src/screens/add-pet/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-b: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-b-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        4.835 s, estimated 5 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=0
```

Add-pet #90 R6: el log rojo muestra `✓ envía los getters locales aunque los getters UTC estén en el día siguiente`; también pasa en el verde 26/26. El volteo nuevo está dentro de su `it`, con `setPlatform`/`originalPlatform` existentes.

## M-c: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-c-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Snapshots:   0 total
Time:        5.768 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=1
```

### #148 R4: add-pet se aparta del teclado en Android › el host screen-add-pet añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 291;
+ paddingBottom: 200;
at Object.<anonymous> (src/screens/add-pet/index.test.tsx:589:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Snapshots:   0 total
Time:        5.768 s
```

Restaurada M-c con `git checkout HEAD -- mobile-pet-tracker/src/screens/add-pet/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-c: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-c-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        3.526 s, estimated 6 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=0
```

## M-d: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-d-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Snapshots:   0 total
Time:        4.226 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=1
```

### #148 R8: add-pet entrega el primer toque con el teclado abierto › el scroll add-pet-form declara keyboardShouldPersistTaps handled

```text
expect(received).toBe(expected) // Object.is equality
Expected: "handled"
Received: undefined
at Object.toBe (src/screens/add-pet/index.test.tsx:605:80)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Snapshots:   0 total
Time:        4.226 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
```

Restaurada M-d con `git checkout HEAD -- mobile-pet-tracker/src/screens/add-pet/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-d: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-d-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        3.84 s, estimated 5 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=0
```

## refactor: add-pet

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/refactor-add-pet.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        4.758 s
Ran all test suites within paths "src/screens/add-pet/index.test.tsx".
exit=0
```

Refactor adicional permitido tras el verde de add-pet: `1aa949ca` — `refactor(mobile): align the add-pet test provider (#148 R4)`. Corrige solo la indentación de dos líneas del Provider; suite verificada 26/26, exit=0. Total previsto: 15 commits literales + este refactor = 16.

## rojo: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/rojo-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 38 passed, 41 total
Snapshots:   0 total
Time:        4.567 s, estimated 5 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=1
```

### R8: formulario de alta con chips y pickers › uses the metrics under the native header (#95 R6)

```text
Unable to find an element with testID: add-reminder-form
```

### #148 R5: add-reminder se aparta del teclado en Android › el host screen-add-reminder añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/add-reminder/index.test.tsx:790:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### #148 R8: add-reminder entrega el primer toque con el teclado abierto › el scroll add-reminder-form declara keyboardShouldPersistTaps handled

```text
Unable to find an element with testID: add-reminder-form
```

Rojo validado de add-reminder: R5 por aserción `toHaveStyle({ paddingBottom: 0 })`, Expected `{ paddingBottom: 0 }`, Received estilo sin clave `paddingBottom`; todos los demás `it` rojos arriba por consulta `getByTestId('add-reminder-form')`. Lista de fallos exactamente igual a la spec, sin errores técnicos.

Commit `24069204`: `test(mobile): lock the keyboard padding of add-reminder (#148 R5, R8)` (solo `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx`).

## verde: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/verde-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       41 passed, 41 total
Snapshots:   0 total
Time:        5.099 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=0
```

Commit `0cb8c34f`: `feat(mobile): keep the add-reminder form above the keyboard (#148 R5, R8)` (solo `mobile-pet-tracker/src/screens/add-reminder/index.tsx`).

## M-a: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-a-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 38 passed, 41 total
Snapshots:   0 total
Time:        4.689 s, estimated 5 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=1
```

### R8: formulario de alta con chips y pickers › uses the metrics under the native header (#95 R6)

```text
Unable to find an element with testID: add-reminder-form
```

### #148 R5: add-reminder se aparta del teclado en Android › el host screen-add-reminder añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/add-reminder/index.test.tsx:790:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### #148 R8: add-reminder entrega el primer toque con el teclado abierto › el scroll add-reminder-form declara keyboardShouldPersistTaps handled

```text
Unable to find an element with testID: add-reminder-form
```

Restaurada M-a con `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-a: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-a-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       41 passed, 41 total
Snapshots:   0 total
Time:        4.205 s, estimated 5 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=0
```

## M-b: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-b-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 passed, 41 total
Snapshots:   0 total
Time:        4.62 s, estimated 5 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=1
```

### #148 R5: add-reminder se aparta del teclado en Android › el host screen-add-reminder añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/add-reminder/index.test.tsx:790:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 passed, 41 total
Snapshots:   0 total
Time:        4.62 s, estimated 5 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
```

Restaurada M-b con `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-b: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-b-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       41 passed, 41 total
Snapshots:   0 total
Time:        3.942 s, estimated 5 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=0
```

## M-c: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-c-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 passed, 41 total
Snapshots:   0 total
Time:        5.72 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=1
```

### #148 R5: add-reminder se aparta del teclado en Android › el host screen-add-reminder añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 291;
+ paddingBottom: 200;
at Object.<anonymous> (src/screens/add-reminder/index.test.tsx:802:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 passed, 41 total
Snapshots:   0 total
Time:        5.72 s
```

Restaurada M-c con `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

Add-reminder: R5/R8 usan exactamente la preparación del test de métricas (env, auth, petición pendiente, mascota seleccionada por SelectionProbe), Provider 91 en renderAddReminder, y esperan la visibilidad de `screen-add-reminder` antes de consultar el host/form. El volteo se limita al `it` de R5 y se restaura con las funciones existentes.

## revertida-M-c: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-c-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       41 passed, 41 total
Snapshots:   0 total
Time:        4.208 s, estimated 6 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=0
```

## M-d: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-d-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 passed, 41 total
Snapshots:   0 total
Time:        5.359 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=1
```

### #148 R8: add-reminder entrega el primer toque con el teclado abierto › el scroll add-reminder-form declara keyboardShouldPersistTaps handled

```text
expect(received).toBe(expected) // Object.is equality
Expected: "handled"
Received: undefined
at Object.toBe (src/screens/add-reminder/index.test.tsx:819:85)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 passed, 41 total
Snapshots:   0 total
Time:        5.359 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
```

Restaurada M-d con `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-d: add-reminder

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-d-add-reminder.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       41 passed, 41 total
Snapshots:   0 total
Time:        4.356 s, estimated 6 s
Ran all test suites within paths "src/screens/add-reminder/index.test.tsx".
exit=0
```

## rojo: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/rojo-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 51 passed, 54 total
Snapshots:   0 total
Time:        7.193 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=1
```

### R4: /pairing monta en el Stack raíz con selector de mascota y estados de carga › renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)

```text
Unable to find an element with testID: pairing-form
```

### #148 R6: pairing se aparta del teclado en Android › el host screen-pairing añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/pairing/index.test.tsx:952:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### #148 R8: pairing entrega el primer toque con el teclado abierto › el scroll pairing-form declara keyboardShouldPersistTaps handled

```text
Unable to find an element with testID: pairing-form
```

Rojo validado de pairing: R6 por aserción `toHaveStyle({ paddingBottom: 0 })`, Expected `{ paddingBottom: 0 }`, Received estilo sin clave `paddingBottom`; todos los demás `it` rojos arriba por consulta `getByTestId('pairing-form')`. Lista de fallos exactamente igual a la spec, sin errores técnicos.

Commit `4ee981c7`: `test(mobile): lock the keyboard padding of pairing (#148 R6, R8)` (solo `mobile-pet-tracker/src/screens/pairing/index.test.tsx`).

## verde: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/verde-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        7.324 s, estimated 8 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=0
```

Commit `8d816701`: `feat(mobile): keep the pairing form above the keyboard (#148 R6, R8)` (solo `mobile-pet-tracker/src/screens/pairing/index.tsx`).

## M-a: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-a-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 51 passed, 54 total
Snapshots:   0 total
Time:        7.245 s, estimated 8 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=1
```

### R4: /pairing monta en el Stack raíz con selector de mascota y estados de carga › renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)

```text
Unable to find an element with testID: pairing-form
```

### #148 R6: pairing se aparta del teclado en Android › el host screen-pairing añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/pairing/index.test.tsx:952:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### #148 R8: pairing entrega el primer toque con el teclado abierto › el scroll pairing-form declara keyboardShouldPersistTaps handled

```text
Unable to find an element with testID: pairing-form
```

Restaurada M-a con `git checkout HEAD -- mobile-pet-tracker/src/screens/pairing/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-a: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-a-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        6.501 s, estimated 8 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=0
```

## M-b: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-b-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        8.252 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=1
```

### #148 R6: pairing se aparta del teclado en Android › el host screen-pairing añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 0;
at Object.toHaveStyle (src/screens/pairing/index.test.tsx:952:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        8.252 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
```

Restaurada M-b con `git checkout HEAD -- mobile-pet-tracker/src/screens/pairing/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-b: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-b-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        6.839 s, estimated 9 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=0
```

## M-c: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-c-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        8.271 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=1
```

### #148 R6: pairing se aparta del teclado en Android › el host screen-pairing añade paddingBottom 291 al abrir el teclado

```text
expect(instance).toHaveStyle()
- Expected
+ Received
- paddingBottom: 291;
+ paddingBottom: 200;
at Object.<anonymous> (src/screens/pairing/index.test.tsx:964:18)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        8.271 s
```

Restaurada M-c con `git checkout HEAD -- mobile-pet-tracker/src/screens/pairing/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-c: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-c-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        6.846 s, estimated 9 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=0
```

## M-d: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/M-d-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        7.381 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=1
```

### #148 R8: pairing entrega el primer toque con el teclado abierto › el scroll pairing-form declara keyboardShouldPersistTaps handled

```text
expect(received).toBe(expected) // Object.is equality
Expected: "handled"
Received: undefined
at Object.toBe (src/screens/pairing/index.test.tsx:980:80)
at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        7.381 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
```

Restaurada M-d con `git checkout HEAD -- mobile-pet-tracker/src/screens/pairing/index.tsx`; `git diff --cached --stat` vacío y diff de producción vacío.

## revertida-M-d: pairing

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx --maxWorkers=2 > /tmp/pet148-eb595a29/revertida-M-d-pairing.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        6.71 s, estimated 8 s
Ran all test suites within paths "src/screens/pairing/index.test.tsx".
exit=0
```

## cierre: pantallas

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx" src/screens/weight-log/index.test.tsx "src/app/(auth)/__tests__/register.test.tsx" src/screens/reset-password/index.test.tsx src/screens/add-pet/index.test.tsx src/screens/add-reminder/index.test.tsx src/screens/pairing/index.test.tsx --maxWorkers=2 --json --outputFile=/tmp/pet148-eb595a29/final-pantallas.json > /tmp/pet148-eb595a29/cierre-pantallas.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 7 passed, 7 total
Tests:       197 passed, 197 total
Snapshots:   0 total
Time:        11.185 s, estimated 17 s
Ran all test suites within paths "src/app/(auth)/__tests__/login.test.tsx", "src/screens/weight-log/index.test.tsx", "src/app/(auth)/__tests__/register.test.tsx", "src/screens/reset-password/index.test.tsx", "src/screens/add-pet/index.test.tsx", "src/screens/add-reminder/index.test.tsx", "src/screens/pairing/index.test.tsx".
exit=0
```








## cierre: globales

Comando desde `mobile-pet-tracker/`:

```bash
bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/layout.test.tsx --maxWorkers=2 --json --outputFile=/tmp/pet148-eb595a29/final-globales.json > /tmp/pet148-eb595a29/cierre-globales.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 5 passed, 5 total
Tests:       190 passed, 190 total
Snapshots:   0 total
Time:        2.666 s
Ran all test suites within paths "src/__tests__/design-drift.test.ts", "src/__tests__/consistency-classnames.test.ts", "src/__tests__/legibility-classnames.test.ts", "src/__tests__/ui-language.test.ts", "src/app/__tests__/layout.test.tsx".
exit=0
```

## cierre: tsc

Comando desde `mobile-pet-tracker/`:

```bash
bunx tsc --noEmit > /tmp/pet148-eb595a29/cierre-tsc.log 2>&1; echo "exit=$?"
```

Guarda previa `test ! -e .expo/types/router.d.ts`: `exit=0`.

```text

exit=0
```

Salida:

```text

```

## cierre: lint

Comando desde `mobile-pet-tracker/`:

```bash
bunx expo lint > /tmp/pet148-eb595a29/cierre-lint.log 2>&1; echo "exit=$?"
```

```text

exit=0
```

Salida:

```text

```

Auditoría textual: la primera lectura de `t('` sobre todo el diff incluyó los nuevos `it('` y `DeviceEventEmitter.emit('` de los tests. Era un error del script temporal de medición, no copy nueva. Se corrigió el ámbito a los siete ficheros de producción y se comprobó además el recuento de producción en todo src/ frente a H0. No se modificaron tests ni candados para esta corrección.

## Auditoría R9 antes del cierre documental

```text
$ git diff --name-only eb595a29 HEAD
mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx
mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx
mobile-pet-tracker/src/app/(auth)/login.tsx
mobile-pet-tracker/src/app/(auth)/register.tsx
mobile-pet-tracker/src/screens/add-pet/index.test.tsx
mobile-pet-tracker/src/screens/add-pet/index.tsx
mobile-pet-tracker/src/screens/add-reminder/index.test.tsx
mobile-pet-tracker/src/screens/add-reminder/index.tsx
mobile-pet-tracker/src/screens/pairing/index.test.tsx
mobile-pet-tracker/src/screens/pairing/index.tsx
mobile-pet-tracker/src/screens/reset-password/index.test.tsx
mobile-pet-tracker/src/screens/reset-password/index.tsx
mobile-pet-tracker/src/screens/weight-log/index.test.tsx
mobile-pet-tracker/src/screens/weight-log/index.tsx
grep -F -c 'Platform' mobile-pet-tracker/src/app/(auth)/login.tsx -> 0
grep -F -c 'useHeaderHeight(' mobile-pet-tracker/src/app/(auth)/login.tsx -> 0
grep -F -c '?? 0' mobile-pet-tracker/src/app/(auth)/login.tsx -> 0
grep -F -c 'enabled=' mobile-pet-tracker/src/app/(auth)/login.tsx -> 0
login: métricas, clases existentes e inset idénticos a H0
login: delta it +1; cero títulos it existentes borrados
grep -F -c 'Platform' mobile-pet-tracker/src/screens/weight-log/index.tsx -> 0
grep -F -c 'useHeaderHeight(' mobile-pet-tracker/src/screens/weight-log/index.tsx -> 0
grep -F -c '?? 0' mobile-pet-tracker/src/screens/weight-log/index.tsx -> 0
grep -F -c 'enabled=' mobile-pet-tracker/src/screens/weight-log/index.tsx -> 0
weight-log: métricas, clases existentes e inset idénticos a H0
weight-log: delta it +2; cero títulos it existentes borrados
grep -F -c 'Platform' mobile-pet-tracker/src/app/(auth)/register.tsx -> 0
grep -F -c 'useHeaderHeight(' mobile-pet-tracker/src/app/(auth)/register.tsx -> 0
grep -F -c '?? 0' mobile-pet-tracker/src/app/(auth)/register.tsx -> 0
grep -F -c 'enabled=' mobile-pet-tracker/src/app/(auth)/register.tsx -> 0
register: métricas, clases existentes e inset idénticos a H0
register: delta it +1; cero títulos it existentes borrados
grep -F -c 'Platform' mobile-pet-tracker/src/screens/reset-password/index.tsx -> 0
grep -F -c 'useHeaderHeight(' mobile-pet-tracker/src/screens/reset-password/index.tsx -> 0
grep -F -c '?? 0' mobile-pet-tracker/src/screens/reset-password/index.tsx -> 0
grep -F -c 'enabled=' mobile-pet-tracker/src/screens/reset-password/index.tsx -> 0
reset-password: métricas, clases existentes e inset idénticos a H0
reset-password: delta it +1; cero títulos it existentes borrados
grep -F -c 'Platform' mobile-pet-tracker/src/screens/add-pet/index.tsx -> 0
grep -F -c 'useHeaderHeight(' mobile-pet-tracker/src/screens/add-pet/index.tsx -> 0
grep -F -c '?? 0' mobile-pet-tracker/src/screens/add-pet/index.tsx -> 0
grep -F -c 'enabled=' mobile-pet-tracker/src/screens/add-pet/index.tsx -> 0
add-pet: métricas, clases existentes e inset idénticos a H0
add-pet: delta it +2; cero títulos it existentes borrados
grep -F -c 'Platform' mobile-pet-tracker/src/screens/add-reminder/index.tsx -> 0
grep -F -c 'useHeaderHeight(' mobile-pet-tracker/src/screens/add-reminder/index.tsx -> 0
grep -F -c '?? 0' mobile-pet-tracker/src/screens/add-reminder/index.tsx -> 0
grep -F -c 'enabled=' mobile-pet-tracker/src/screens/add-reminder/index.tsx -> 0
add-reminder: métricas, clases existentes e inset idénticos a H0
add-reminder: delta it +2; cero títulos it existentes borrados
grep -F -c 'Platform' mobile-pet-tracker/src/screens/pairing/index.tsx -> 0
grep -F -c 'useHeaderHeight(' mobile-pet-tracker/src/screens/pairing/index.tsx -> 0
grep -F -c '?? 0' mobile-pet-tracker/src/screens/pairing/index.tsx -> 0
grep -F -c 'enabled=' mobile-pet-tracker/src/screens/pairing/index.tsx -> 0
pairing: métricas, clases existentes e inset idénticos a H0
pairing: delta it +2; cero títulos it existentes borrados
<TextInput src/ bruto: H0=8, final=8; producción (sourceFiles #62 R12): H0=6, final=6
t(' en producción src/: H0=432, final=432, delta=0
git diff -w --unified=0 eb595a29 HEAD -- <7 ficheros producción>: t(' añadidos = 0
git diff eb595a29 HEAD -- mobile-pet-tracker/package.json: vacío
git diff eb595a29 HEAD -- mobile-pet-tracker/bun.lock: vacío
git diff eb595a29 HEAD -- mobile-pet-tracker/app.json: vacío
git diff --cached --stat: vacío; git diff --name-only: vacío (antes del cierre documental)
```

## Resumen de cierre y delta por suite

Las 7 suites de pantalla: 186 → 197 (+11). Las 5 globales: 190 → 190. Total: 376 → 387, cero tests borrados, cero fallos, cero snapshots. Base de pantallas medida una a una al arrancar; base global medida con el comando de 5 suites (190). Su desglose por fichero se confirma con el JSON de cierre y el diff vacío de los cinco ficheros frente a H0.

| Suite | Base | Final | Delta | Exit base/final |
|---|---:|---:|---:|---|
| `src/app/(auth)/__tests__/login.test.tsx` | 10 | 11 | +1 | 0 / 0 |
| `src/screens/weight-log/index.test.tsx` | 31 | 33 | +2 | 0 / 0 |
| `src/app/(auth)/__tests__/register.test.tsx` | 12 | 13 | +1 | 0 / 0 |
| `src/screens/reset-password/index.test.tsx` | 18 | 19 | +1 | 0 / 0 |
| `src/screens/add-pet/index.test.tsx` | 24 | 26 | +2 | 0 / 0 |
| `src/screens/add-reminder/index.test.tsx` | 39 | 41 | +2 | 0 / 0 |
| `src/screens/pairing/index.test.tsx` | 52 | 54 | +2 | 0 / 0 |
| `src/app/__tests__/layout.test.tsx` | 24 (suite intacta) | 24 | 0 | 0 / 0 |
| `src/__tests__/ui-language.test.ts` | 29 (suite intacta) | 29 | 0 | 0 / 0 |
| `src/__tests__/design-drift.test.ts` | 57 (suite intacta) | 57 | 0 | 0 / 0 |
| `src/__tests__/consistency-classnames.test.ts` | 54 (suite intacta) | 54 | 0 | 0 / 0 |
| `src/__tests__/legibility-classnames.test.ts` | 26 (suite intacta) | 26 | 0 | 0 / 0 |

## Commits en orden

| # | Hash | Mensaje y R-id |
|---|---|---|
| 1 | `eba73094` | `test(mobile): lock the keyboard padding of login (#148 R1)` |
| 2 | `5fc9650e` | `feat(mobile): keep the login form above the keyboard (#148 R1)` |
| 3 | `34621c02` | `test(mobile): lock the keyboard padding of weight-log (#148 R7, R8)` |
| 4 | `1739b277` | `feat(mobile): keep the weight-log form above the keyboard (#148 R7, R8)` |
| 5 | `7e281c59` | `test(mobile): lock the keyboard padding of register (#148 R2)` |
| 6 | `203e541a` | `feat(mobile): keep the register form above the keyboard (#148 R2)` |
| 7 | `f2f57bfd` | `test(mobile): lock the keyboard padding of reset-password (#148 R3)` |
| 8 | `0781cd9d` | `feat(mobile): keep the reset-password form above the keyboard (#148 R3)` |
| 9 | `0e1332c5` | `test(mobile): lock the keyboard padding of add-pet (#148 R4, R8)` |
| 10 | `2dcf1364` | `feat(mobile): keep the add-pet form above the keyboard (#148 R4, R8)` |
| 11 | `1aa949ca` | `refactor(mobile): align the add-pet test provider (#148 R4)` |
| 12 | `24069204` | `test(mobile): lock the keyboard padding of add-reminder (#148 R5, R8)` |
| 13 | `0cb8c34f` | `feat(mobile): keep the add-reminder form above the keyboard (#148 R5, R8)` |
| 14 | `4ee981c7` | `test(mobile): lock the keyboard padding of pairing (#148 R6, R8)` |
| 15 | `8d816701` | `feat(mobile): keep the pairing form above the keyboard (#148 R6, R8)` |
| 16 | `HEAD` (autorreferencia del cierre) | `docs(mobile): trace #148 R1-R9 to their tests and commits` — R1–R9 |

Los 15 mensajes literales de tasks.md mantienen su orden; se intercala un único refactor permitido tras el verde de add-pet (solo indentación). Las sondas no generan commits. El último commit lleva solo traceability e impl.

## Sondas: tabla consolidada

M-a: retirar KAV, devolver testID al ScrollView y retirar taps nuevo donde aplica. M-b: comportamiento solo iOS (import Platform necesario para ejecutar la mutación; se restaura). M-c: 91 literal sin cabecera, u omitir offset con cabecera. M-d: retirar handled en las cuatro de R8.

| Pantalla | Sonda | it que cae / matcher o consulta | Cuenta roja | Reversión |
|---|---|---|---|---|
| login | M-a | `#61 R8: login tiene contenedor de scroll con safe areas › centra el contenido dentro de un ScrollView con los insets aplicados` → consulta `getByTestId('login-form')` sin nodo<br>`#61 R8: login tiene contenedor de scroll con safe areas › no centra horizontalmente, que no lo hacía el View de hoy` → consulta `getByTestId('login-form')` sin nodo<br>`#148 R1: login se aparta del teclado en Android › el host screen-login añade paddingBottom 200 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave | Tests:       3 failed, 8 passed, 11 total; exit=1 | suite completa verde, exit=0; índice vacío |
| login | M-b | `#148 R1: login se aparta del teclado en Android › el host screen-login añade paddingBottom 200 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave | Tests:       1 failed, 10 passed, 11 total; exit=1 | suite completa verde, exit=0; índice vacío |
| login | M-c | `#148 R1: login se aparta del teclado en Android › el host screen-login añade paddingBottom 200 al abrir el teclado` → `waitFor(...toHaveStyle({ paddingBottom: 200 }))`; Expected 200, Received 291 | Tests:       1 failed, 10 passed, 11 total; exit=1 | suite completa verde, exit=0; índice vacío |
| weight-log | M-a | `R7: weight log lista el historial › shows loading and the metrics under the native header (#95 R6)` → consulta `getByTestId('weight-log-form')` sin nodo<br>`R7: weight log lista el historial › R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa` → consulta `getByTestId('weight-log-form')` sin nodo<br>`#148 R7: weight-log se aparta del teclado en Android › el host screen-weight-log añade paddingBottom 291 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave<br>`#148 R8: weight-log entrega el primer toque con el teclado abierto › el scroll weight-log-form declara keyboardShouldPersistTaps handled` → consulta `getByTestId('weight-log-form')` sin nodo | Tests:       4 failed, 29 passed, 33 total; exit=1 | suite completa verde, exit=0; índice vacío |
| weight-log | M-b | `#148 R7: weight-log se aparta del teclado en Android › el host screen-weight-log añade paddingBottom 291 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave | Tests:       1 failed, 32 passed, 33 total; exit=1 | suite completa verde, exit=0; índice vacío |
| weight-log | M-c | `#148 R7: weight-log se aparta del teclado en Android › el host screen-weight-log añade paddingBottom 291 al abrir el teclado` → `waitFor(...toHaveStyle({ paddingBottom: 291 }))`; Expected 291, Received 200 | Tests:       1 failed, 32 passed, 33 total; exit=1 | suite completa verde, exit=0; índice vacío |
| weight-log | M-d | `#148 R8: weight-log entrega el primer toque con el teclado abierto › el scroll weight-log-form declara keyboardShouldPersistTaps handled` → `toBe('handled')`; Expected handled, Received undefined | Tests:       1 failed, 32 passed, 33 total; exit=1 | suite completa verde, exit=0; índice vacío |
| register | M-a | `#61 R7: register usa las métricas de pantalla uniformes › aplica el padding del contentContainerStyle con los safe-area insets` → consulta `getByTestId('register-form')` sin nodo<br>`#61 R7: register usa las métricas de pantalla uniformes › declara el ajuste automático de inset del contenedor de scroll` → consulta `getByTestId('register-form')` sin nodo<br>`#148 R2: register se aparta del teclado en Android › el host screen-register añade paddingBottom 200 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave | Tests:       3 failed, 10 passed, 13 total; exit=1 | suite completa verde, exit=0; índice vacío |
| register | M-b | `#148 R2: register se aparta del teclado en Android › el host screen-register añade paddingBottom 200 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave | Tests:       1 failed, 12 passed, 13 total; exit=1 | suite completa verde, exit=0; índice vacío |
| register | M-c | `#148 R2: register se aparta del teclado en Android › el host screen-register añade paddingBottom 200 al abrir el teclado` → `waitFor(...toHaveStyle({ paddingBottom: 200 }))`; Expected 200, Received 291 | Tests:       1 failed, 12 passed, 13 total; exit=1 | suite completa verde, exit=0; índice vacío |
| reset-password | M-a | `#61 R8: las tres ramas de reset tienen contenedor de scroll › la rama del formulario no centra en horizontal` → consulta `getByTestId('reset-password-form')` sin nodo<br>`#148 R3: reset-password se aparta del teclado en Android › el host screen-reset-password añade paddingBottom 200 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave | Tests:       2 failed, 17 passed, 19 total; exit=1 | suite completa verde, exit=0; índice vacío |
| reset-password | M-b | `#148 R3: reset-password se aparta del teclado en Android › el host screen-reset-password añade paddingBottom 200 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave | Tests:       1 failed, 18 passed, 19 total; exit=1 | suite completa verde, exit=0; índice vacío |
| reset-password | M-c | `#148 R3: reset-password se aparta del teclado en Android › el host screen-reset-password añade paddingBottom 200 al abrir el teclado` → `waitFor(...toHaveStyle({ paddingBottom: 200 }))`; Expected 200, Received 291 | Tests:       1 failed, 18 passed, 19 total; exit=1 | suite completa verde, exit=0; índice vacío |
| add-pet | M-a | `#95 R6: métricas bajo cabecera nativa › usa solo el inset inferior del dispositivo` → consulta `getByTestId('add-pet-form')` sin nodo<br>`#148 R4: add-pet se aparta del teclado en Android › el host screen-add-pet añade paddingBottom 291 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave<br>`#148 R8: add-pet entrega el primer toque con el teclado abierto › el scroll add-pet-form declara keyboardShouldPersistTaps handled` → consulta `getByTestId('add-pet-form')` sin nodo | Tests:       3 failed, 23 passed, 26 total; exit=1 | suite completa verde, exit=0; índice vacío |
| add-pet | M-b | `#148 R4: add-pet se aparta del teclado en Android › el host screen-add-pet añade paddingBottom 291 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave | Tests:       1 failed, 25 passed, 26 total; exit=1 | suite completa verde, exit=0; índice vacío |
| add-pet | M-c | `#148 R4: add-pet se aparta del teclado en Android › el host screen-add-pet añade paddingBottom 291 al abrir el teclado` → `waitFor(...toHaveStyle({ paddingBottom: 291 }))`; Expected 291, Received 200 | Tests:       1 failed, 25 passed, 26 total; exit=1 | suite completa verde, exit=0; índice vacío |
| add-pet | M-d | `#148 R8: add-pet entrega el primer toque con el teclado abierto › el scroll add-pet-form declara keyboardShouldPersistTaps handled` → `toBe('handled')`; Expected handled, Received undefined | Tests:       1 failed, 25 passed, 26 total; exit=1 | suite completa verde, exit=0; índice vacío |
| add-reminder | M-a | `R8: formulario de alta con chips y pickers › uses the metrics under the native header (#95 R6)` → consulta `getByTestId('add-reminder-form')` sin nodo<br>`#148 R5: add-reminder se aparta del teclado en Android › el host screen-add-reminder añade paddingBottom 291 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave<br>`#148 R8: add-reminder entrega el primer toque con el teclado abierto › el scroll add-reminder-form declara keyboardShouldPersistTaps handled` → consulta `getByTestId('add-reminder-form')` sin nodo | Tests:       3 failed, 38 passed, 41 total; exit=1 | suite completa verde, exit=0; índice vacío |
| add-reminder | M-b | `#148 R5: add-reminder se aparta del teclado en Android › el host screen-add-reminder añade paddingBottom 291 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave | Tests:       1 failed, 40 passed, 41 total; exit=1 | suite completa verde, exit=0; índice vacío |
| add-reminder | M-c | `#148 R5: add-reminder se aparta del teclado en Android › el host screen-add-reminder añade paddingBottom 291 al abrir el teclado` → `waitFor(...toHaveStyle({ paddingBottom: 291 }))`; Expected 291, Received 200 | Tests:       1 failed, 40 passed, 41 total; exit=1 | suite completa verde, exit=0; índice vacío |
| add-reminder | M-d | `#148 R8: add-reminder entrega el primer toque con el teclado abierto › el scroll add-reminder-form declara keyboardShouldPersistTaps handled` → `toBe('handled')`; Expected handled, Received undefined | Tests:       1 failed, 40 passed, 41 total; exit=1 | suite completa verde, exit=0; índice vacío |
| pairing | M-a | `R4: /pairing monta en el Stack raíz con selector de mascota y estados de carga › renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)` → consulta `getByTestId('pairing-form')` sin nodo<br>`#148 R6: pairing se aparta del teclado en Android › el host screen-pairing añade paddingBottom 291 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave<br>`#148 R8: pairing entrega el primer toque con el teclado abierto › el scroll pairing-form declara keyboardShouldPersistTaps handled` → consulta `getByTestId('pairing-form')` sin nodo | Tests:       3 failed, 51 passed, 54 total; exit=1 | suite completa verde, exit=0; índice vacío |
| pairing | M-b | `#148 R6: pairing se aparta del teclado en Android › el host screen-pairing añade paddingBottom 291 al abrir el teclado` → `toHaveStyle({ paddingBottom: 0 })`; Expected 0, Received sin clave | Tests:       1 failed, 53 passed, 54 total; exit=1 | suite completa verde, exit=0; índice vacío |
| pairing | M-c | `#148 R6: pairing se aparta del teclado en Android › el host screen-pairing añade paddingBottom 291 al abrir el teclado` → `waitFor(...toHaveStyle({ paddingBottom: 291 }))`; Expected 291, Received 200 | Tests:       1 failed, 53 passed, 54 total; exit=1 | suite completa verde, exit=0; índice vacío |
| pairing | M-d | `#148 R8: pairing entrega el primer toque con el teclado abierto › el scroll pairing-form declara keyboardShouldPersistTaps handled` → `toBe('handled')`; Expected handled, Received undefined | Tests:       1 failed, 53 passed, 54 total; exit=1 | suite completa verde, exit=0; índice vacío |

M-d fuera de R8: login lo canda `centra el contenido dentro de un ScrollView con los insets aplicados`; reset-password, `la rama del formulario no centra en horizontal`; register: **sin cubridor**, según §Fuera de alcance. No se añaden tests para esa deuda.

## Decisiones y límites

- Sin decisiones nuevas de UI: patrón D2, métricas A11 y contenidos originales preservados. No refactor funcional ni dependencias nuevas.
- Los comandos añaden `--maxWorkers=2` como la medición del leader. En cierre se añade JSON en /tmp para obtener el desglose real por suite. Cada comando de pantalla imprime 1 suite; globales 5, cierre de pantallas 7.
- El recuento bruto de TextInput incluye tests (8); el recuento de producción del candado sourceFiles() es 6. Ambos permanecen iguales.
- Un SHA de commit no puede incrustarse en su propio contenido sin cambiar ese SHA. Por eso R9 y la fila 16 usan autorreferencia `HEAD` + mensaje literal, con resolver reproducible; los 15 commits anteriores llevan sus hashes reales. El SHA final se entrega al humano fuera del commit. No se rebasea después de escribir trazabilidad.
- R10 queda para el humano: ninguna casilla de smoke marcada. No se declara la feature done ni se tocan history/current/STATUS/feature_list. Sin init.sh, infra, push ni PR, como exige el handoff.

## R9: árbol preparado para el commit de cierre

Tras añadir solo traceability e impl al índice, esta lista representa el árbol del cierre, frente a H0. El control posterior al commit es `git diff --name-only eb595a29 HEAD` y se contrasta contra esta misma lista en terminal al entregar el SHA final; no se modifican archivos después de ese control.

```text
$ git diff --cached --name-only eb595a29
mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx
mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx
mobile-pet-tracker/src/app/(auth)/login.tsx
mobile-pet-tracker/src/app/(auth)/register.tsx
mobile-pet-tracker/src/screens/add-pet/index.test.tsx
mobile-pet-tracker/src/screens/add-pet/index.tsx
mobile-pet-tracker/src/screens/add-reminder/index.test.tsx
mobile-pet-tracker/src/screens/add-reminder/index.tsx
mobile-pet-tracker/src/screens/pairing/index.test.tsx
mobile-pet-tracker/src/screens/pairing/index.tsx
mobile-pet-tracker/src/screens/reset-password/index.test.tsx
mobile-pet-tracker/src/screens/reset-password/index.tsx
mobile-pet-tracker/src/screens/weight-log/index.test.tsx
mobile-pet-tracker/src/screens/weight-log/index.tsx
progress/impl_mobile-keyboard-avoiding-forms.md
specs/mobile-keyboard-avoiding-forms/traceability.md
```

`git diff --cached --name-only` del último commit contiene solo:

```text
progress/impl_mobile-keyboard-avoiding-forms.md
specs/mobile-keyboard-avoiding-forms/traceability.md
```

## Delta final por fichero contra H0

Conteo de líneas de `git diff --cached --numstat eb595a29` del árbol de cierre. La mayor parte del delta de producción es la indentación al envolver el scroll; la auditoría anterior compara sus clases y métricas sin cambios.

| Fichero | Añadidas | Retiradas |
|---|---:|---:|
| `mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx` | 31 | 3 |
| `mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx` | 32 | 3 |
| `mobile-pet-tracker/src/app/(auth)/login.tsx` | 85 | 76 |
| `mobile-pet-tracker/src/app/(auth)/register.tsx` | 143 | 134 |
| `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` | 57 | 4 |
| `mobile-pet-tracker/src/screens/add-pet/index.tsx` | 208 | 198 |
| `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx` | 59 | 3 |
| `mobile-pet-tracker/src/screens/add-reminder/index.tsx` | 172 | 162 |
| `mobile-pet-tracker/src/screens/pairing/index.test.tsx` | 60 | 3 |
| `mobile-pet-tracker/src/screens/pairing/index.tsx` | 243 | 232 |
| `mobile-pet-tracker/src/screens/reset-password/index.test.tsx` | 30 | 1 |
| `mobile-pet-tracker/src/screens/reset-password/index.tsx` | 70 | 61 |
| `mobile-pet-tracker/src/screens/weight-log/index.test.tsx` | 64 | 3 |
| `mobile-pet-tracker/src/screens/weight-log/index.tsx` | 167 | 157 |
| `progress/impl_mobile-keyboard-avoiding-forms.md` | 2425 | 0 |
| `specs/mobile-keyboard-avoiding-forms/traceability.md` | 19 | 10 |

## Entrega

Listo para que el leader revise el reporte y lance el reviewer. R10 (smoke Android) sigue sin firmar. El commit documental se identifica por el mensaje literal y su SHA se entrega en la respuesta final; se comprueban después `git status --short` vacío y los 16 ficheros de R9 contra H0. Logs y scripts auxiliares están fuera del repositorio, en `/tmp/pet148-eb595a29/`; el repositorio no contiene archivos temporales.
