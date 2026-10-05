/home/claude/sites/Pet-Tracker-wt-backend
feature/117-mobile-forgot-password
20dd8afc

H0 = `20dd8afc` (HEAD al arrancar). Todos los diffs de alcance se miden contra H0.

## base

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts 'src/app/(auth)/__tests__/forgot.test.tsx' src/screens/reset-password/index.test.tsx > /tmp/117-base.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/reset-password/index.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/app/(auth)/__tests__/forgot.test.tsx (5.002 s)
PASS src/api/__tests__/auth.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
Test Suites: 8 passed, 8 total
Tests:       243 passed, 243 total
Snapshots:   0 total
Time:        5.891 s, estimated 14 s
exit=0
src/screens/reset-password/index.test.tsx: 19 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/providers/__tests__/language-provider.test.tsx: 22 tests; passed
src/app/(auth)/__tests__/forgot.test.tsx: 4 tests; passed
src/api/__tests__/auth.test.ts: 29 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
```

## Arranque, skills y anclas

`git fetch origin`: exit=0. `git merge-base --is-ancestor b2a9c2aa HEAD; echo "exit=$?"`: `exit=0`.
`git log -1 --format=%H origin/main`: b2a9c2aa2af25ed8966af09ffcea1a97ededa291
Skills cargadas: `building-native-ui` (plugin Expo, `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`), `.agents/skills/appllama-app-design-skill/SKILL.md` y `ponytail:ponytail` (full). No animate-expo ni native-data-fetching.
Requirements/design/tasks/traceability leídos, aprobación humana presente. Contexto Appllama leído por git show en origin/feature/118-mobile-welcome-splash, sin copiarlo. La carta sustituye simulator loop por smoke humano.
Las comprobaciones por grep siguientes son de solo lectura; ninguna ancla se ajustó.
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx: '+ 9 + 9, // #105 R5'
56:      260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9, // #105 R5
coincidencias=1; esperadas=1; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/__tests__/ui-language.test.ts: 'expect(R1_AUTH).toHaveLength(29)'
71:    expect(R1_AUTH).toHaveLength(29);
coincidencias=1; esperadas=1; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/__tests__/ui-language.test.ts: "'resuelve las 29 ocurrencias normativas'"
70:  it('resuelve las 29 ocurrencias normativas', () => {
coincidencias=1; esperadas=1; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/__tests__/ui-language.test.ts: 'toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1)'
490:    expect(SCREEN_FILES).toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #100 R10, #41 R10, #146 R10, #105 R5
coincidencias=1; esperadas=1; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/__tests__/ui-language.test.ts: 'ALL_USES.map((use) => use.file)'
404:const SCREEN_FILES = ALL_USES.map((use) => use.file).filter(
coincidencias=1; esperadas=1; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/__tests__/ui-copy-table.ts: "file: 'src/app/(auth)/forgot.tsx'"
16:  { file: 'src/app/(auth)/forgot.tsx', key: 'forgot.forgotPassword' },
17:  { file: 'src/app/(auth)/forgot.tsx', key: 'forgot.comingSoon' },
18:  { file: 'src/app/(auth)/forgot.tsx', key: 'forgot.email' },
19:  { file: 'src/app/(auth)/forgot.tsx', key: 'forgot.sendRecoveryLink' },
20:  { file: 'src/app/(auth)/forgot.tsx', key: 'forgot.backToSignIn' },
coincidencias=5; esperadas=5; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts: "join('app', '(auth)', 'forgot.tsx')"
68:    [join('app', '(auth)', 'forgot.tsx'), 'forgot-submit'],
166:    expect(readSource(join('app', '(auth)', 'forgot.tsx'))).toContain(
236:    const forgot = readSource(join('app', '(auth)', 'forgot.tsx'));
250:    [join('app', '(auth)', 'forgot.tsx'), 1],
coincidencias=4; esperadas=4; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts: "[join('app', '(auth)', 'forgot.tsx'), 1],"
148:    [join('app', '(auth)', 'forgot.tsx'), 1],
coincidencias=1; esperadas=1; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/__tests__/design-drift.test.ts: 'forgot'
(sin coincidencias)
coincidencias=0; esperadas=0; grep exit=1
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/__tests__/ui-language.test.ts: 'forgot'
(sin coincidencias)
coincidencias=0; esperadas=0; grep exit=1
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/i18n/catalog.ts: "'forgot."
10:  'forgot.forgotPassword': 'Forgot password',
11:  'forgot.comingSoon': 'Password recovery coming soon',
12:  'forgot.email': 'Email',
13:  'forgot.sendRecoveryLink': 'Send recovery link',
14:  'forgot.backToSignIn': 'Back to sign in',
367:  'forgot.forgotPassword': 'Recuperar contraseña',
368:  'forgot.comingSoon': 'La recuperación de contraseña estará disponible pronto',
369:  'forgot.email': 'Correo electrónico',
370:  'forgot.sendRecoveryLink': 'Enviar enlace de recuperación',
371:  'forgot.backToSignIn': 'Volver al inicio de sesión',
coincidencias=10; esperadas=10; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/reset-password/index.tsx: "import { HeaderHeightContext } from 'expo-router/react-navigation';"
1:import { HeaderHeightContext } from 'expo-router/react-navigation';
coincidencias=1; esperadas=1; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/../specs/mobile-ui-language/design.md: '| src/app/(auth)/forgot.tsx | 5 | R1 |'
(sin coincidencias)
coincidencias=0; esperadas=1; grep exit=1
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/../specs/mobile-ui-language/design.md: '| src/app/(auth)/__tests__/forgot.test.tsx | 1 |'
(sin coincidencias)
coincidencias=0; esperadas=1; grep exit=1
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/../specs/mobile-ui-language/design.md: '**`mobile-pet-tracker/src/app/(auth)/forgot.tsx`** — 5 ocurrencias'
231:**`mobile-pet-tracker/src/app/(auth)/forgot.tsx`** — 5 ocurrencias
coincidencias=1; esperadas=1; grep exit=0
```
```text
/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/../specs/mobile-ui-language/design.md: '29 ocurrencias, 23 claves'
214:### §2.1 — R1 — grupo `(auth)` (29 ocurrencias, 23 claves)
coincidencias=1; esperadas=1; grep exit=0
```
`src/screens/forgot/` no existe. `.expo/types/router.d.ts` no existe.

## Bloqueo antes de T1

La orden exige parar si cualquier ancla no coincide exactamente. Dos patrones literales de las filas de §1 de specs/mobile-ui-language/design.md no coinciden: las rutas reales están rodeadas por backticks. Salida real:
```text
81:| `src/app/(auth)/forgot.tsx` | 5 | R1 |
231:**`mobile-pet-tracker/src/app/(auth)/forgot.tsx`** — 5 ocurrencias
105:| `src/app/(auth)/__tests__/forgot.test.tsx` | 1 |
```
Los valores semánticos son 5/R1 y 1, pero los patrones literales sin backticks dan 0 en lugar de 1. No se reinterpretan sin autorización del humano.
La medida inicial Jest ya estaba en marcha cuando se observó el fallo de ancla; terminó en exit=0 (8 suites / 243 tests). Base por suite: auth 29, language-provider 22, ui-language 29, consistency 55, legibility 26, design-drift 59, forgot stub 4, reset-password 19.
Typecheck/lint no ejecutados: parada previa a T1. Ningún rojo/verde, sonda o commit de implementación. Traceability permanece intacta. No push ni PR.
Único cambio desde H0: progress/impl_mobile-forgot-password.md (archivo nuevo sin commit). Ningún otro worktree tocado.

## Reanudación 2026-10-04 — nuevo H0

```text
/home/claude/sites/Pet-Tracker-wt-backend
feature/117-mobile-forgot-password
90a19d86
```

H0 vigente = `90a19d86`; sustituye `20dd8afc` para todos los diffs de alcance de esta reanudación. Se conserva íntegro el registro anterior. El leader corrigió las anclas; la base Jest previa (8 suites / 243 tests, exit=0) sigue vigente por autorización explícita y árbol móvil idéntico.

## Anclas verificadas de la reanudación (27 comandos)

`M=mobile-pet-tracker/src`

```sh
grep -cF '+ 9 + 9, // #105 R5' $M/providers/__tests__/language-provider.test.tsx
```
```text
1
```

```sh
grep -cF 'expect(R1_AUTH).toHaveLength(29);' $M/__tests__/ui-language.test.ts
```
```text
1
```

```sh
grep -cF "it('resuelve las 29 ocurrencias normativas'" $M/__tests__/ui-language.test.ts
```
```text
1
```

```sh
grep -cF 'toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #100 R10, #41 R10, #146 R10, #105 R5' $M/__tests__/ui-language.test.ts
```
```text
1
```

```sh
grep -cF 'const SCREEN_FILES = ALL_USES.map((use) => use.file).filter(' $M/__tests__/ui-language.test.ts
```
```text
1
```

```sh
grep -ci 'forgot' $M/__tests__/ui-language.test.ts
```
```text
0
```

```sh
grep -cF "{ file: 'src/app/(auth)/forgot.tsx', key: 'forgot." $M/__tests__/ui-copy-table.ts
```
```text
5
```

```sh
grep -cF "join('app', '(auth)', 'forgot.tsx')" $M/__tests__/consistency-classnames.test.ts
```
```text
4
```

```sh
grep -cF 'expect(primaryRadius).toHaveLength(13 + 1 + 1); // #146 R8, #146 R9' $M/__tests__/consistency-classnames.test.ts
```
```text
1
```

```sh
grep -cF ')).toBe(13 + 1 + 1); // #146 R8, #146 R9' $M/__tests__/consistency-classnames.test.ts
```
```text
1
```

```sh
grep -cF 'expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link' $M/__tests__/consistency-classnames.test.ts
```
```text
1
```

```sh
grep -cF 'expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1);' $M/__tests__/consistency-classnames.test.ts
```
```text
1
```

```sh
grep -cF "[join('app', '(auth)', 'forgot.tsx'), 1]," $M/__tests__/legibility-classnames.test.ts
```
```text
1
```

```sh
grep -cF ').toBe(13 + 1 + 1);' $M/__tests__/legibility-classnames.test.ts
```
```text
1
```

```sh
grep -cF "it('no deja ningún text-accent suelto en las fuentes'" $M/__tests__/legibility-classnames.test.ts
```
```text
1
```

```sh
grep -ci 'forgot' $M/__tests__/design-drift.test.ts
```
```text
0
```

```sh
grep -c "^  'forgot\." $M/i18n/catalog.ts
```
```text
10
```

```sh
grep -cF "'forgot.comingSoon'" $M/i18n/catalog.ts
```
```text
2
```

```sh
grep -cF "import { HeaderHeightContext } from 'expo-router/react-navigation';" $M/screens/reset-password/index.tsx
```
```text
1
```

```sh
grep -cF '| `src/app/(auth)/forgot.tsx` | 5 | R1 |' specs/mobile-ui-language/design.md
```
```text
1
```

```sh
grep -cF '| `src/app/(auth)/__tests__/forgot.test.tsx` | 1 |' specs/mobile-ui-language/design.md
```
```text
1
```

```sh
grep -cF '**`mobile-pet-tracker/src/app/(auth)/forgot.tsx`** — 5 ocurrencias' specs/mobile-ui-language/design.md
```
```text
1
```

```sh
grep -cF '### §2.1 — R1 — grupo `(auth)` (29 ocurrencias, 23 claves)' specs/mobile-ui-language/design.md
```
```text
1
```

```sh
grep -cF "describe('#61 R8: forgot tiene contenedor de scroll con safe areas'" 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
```
```text
1
```

```sh
grep -cF "describe('#127 R1: el botón de envío de forgot lleva su receta en el árbol'" 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
```
```text
1
```

```sh
test ! -e $M/screens/forgot; echo "exit=$?"
```
```text
exit=0
```

```sh
test ! -e mobile-pet-tracker/.expo/types/router.d.ts; echo "exit=$?"
```
```text
exit=0
```

27/27 coinciden. fetch exit=0; ancestor exit=0; origin/main = b2a9c2aa2af25ed8966af09ffcea1a97ededa291. `git diff 20dd8afc 90a19d86 -- mobile-pet-tracker/`: vacío. Skills ya cargadas en la primera corrida; siguen aplicándose.

## base-lint

```sh
bun run lint > /tmp/117-base-lint.log 2>&1; echo "exit=$?"
```

```text

exit=0
$ expo lint

```

## base-typecheck

```sh
bun run typecheck > /tmp/117-base-typecheck.log 2>&1; echo "exit=$?"
```

```text

exit=0
$ tsc --noEmit

```

`test ! -e .expo/types/router.d.ts` (desde mobile-pet-tracker/): exit=0.

## base-typecheck-guard

```sh
bun run typecheck > /tmp/117-base-typecheck-guard.log 2>&1; echo "exit=$?"
```

```text

exit=0
$ tsc --noEmit

```

## T1-rojo

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts --json --outputFile /tmp/117-T1-rojo.json > /tmp/117-T1-rojo.log 2>&1; echo "exit=$?"
```

```text
FAIL src/api/__tests__/auth.test.ts
Test Suites: 1 failed, 1 total
Tests:       8 failed, 29 passed, 37 total
Snapshots:   0 total
Time:        1.816 s
exit=1
src/api/__tests__/auth.test.ts: 37 tests; failed

#117 R2: forgotPassword mapea la respuesta por kind hace POST a /auth/forgot-password con { email } y mapea 200 a ok sin leer el body
TypeError: (0 , _auth.forgotPassword) is not a function

#117 R2: forgotPassword mapea la respuesta por kind mapea 429 a rate-limited sin leer el body
TypeError: (0 , _auth.forgotPassword) is not a function

#117 R2: forgotPassword mapea la respuesta por kind mapea un 400 con errors de zod a validation
TypeError: (0 , _auth.forgotPassword) is not a function

#117 R2: forgotPassword mapea la respuesta por kind mapea un 400 sin errors a error
TypeError: (0 , _auth.forgotPassword) is not a function

#117 R2: forgotPassword mapea la respuesta por kind mapea 500 a error
TypeError: (0 , _auth.forgotPassword) is not a function

#117 R2: forgotPassword mapea la respuesta por kind mapea un rechazo de fetch a unreachable
TypeError: (0 , _auth.forgotPassword) is not a function

#117 R2: forgotPassword mapea la respuesta por kind mapea base URL ausente undefined a missing-config sin hacer fetch
TypeError: (0 , _auth.forgotPassword) is not a function

#117 R2: forgotPassword mapea la respuesta por kind mapea base URL ausente "" a missing-config sin hacer fetch
TypeError: (0 , _auth.forgotPassword) is not a function
```

T1 rojo: excepción de sujeto ausente declarada en tasks.md T1. Ocho casos R2 caen por TypeError al invocar forgotPassword aún no exportado; los 29 anteriores siguen verdes. No existe matcher Expected/Received porque el sujeto no existe.

Commit: `7ba0b3a9` — test(mobile): lock the forgotPassword client by kind (#117 R2)

## T1-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts --json --outputFile /tmp/117-T1-verde.json > /tmp/117-T1-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/api/__tests__/auth.test.ts
Test Suites: 1 passed, 1 total
Tests:       37 passed, 37 total
Snapshots:   0 total
Time:        1.738 s, estimated 2 s
exit=0
src/api/__tests__/auth.test.ts: 37 tests; passed
```

## T1-global-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/heroui-smoke.test.tsx src/__tests__/hosting-artifacts.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/api/__tests__/activity.test.ts src/api/__tests__/alerts.test.ts src/api/__tests__/auth.test.ts src/api/__tests__/devices.test.ts src/api/__tests__/geofences.test.ts src/api/__tests__/health-records.test.ts src/api/__tests__/media.test.ts src/api/__tests__/nutrition.test.ts src/api/__tests__/pets.test.ts src/api/__tests__/positions.test.ts src/api/__tests__/push-tokens.test.ts src/api/__tests__/query-keys.test.ts src/api/__tests__/reminders.test.ts src/api/__tests__/subscriptions.test.ts src/api/__tests__/trips.test.ts src/api/__tests__/users.test.ts 'src/app/(auth)/__tests__/forgot.test.tsx' 'src/app/(auth)/__tests__/layout.test.tsx' 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' 'src/app/(tabs)/__tests__/alerts.test.tsx' 'src/app/(tabs)/__tests__/food.test.tsx' 'src/app/(tabs)/__tests__/layout.test.tsx' 'src/app/(tabs)/__tests__/profile.test.tsx' 'src/app/(tabs)/__tests__/screens.test.tsx' src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/alert-detail.notification.test.tsx src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/reminders-alerts-stack.notification.test.tsx src/app/__tests__/tabs-layout.test.tsx src/components/__tests__/card.test.tsx src/components/__tests__/floating-tab-bar.test.tsx src/components/__tests__/pet-avatar.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/components/__tests__/pet-map.test.tsx src/components/__tests__/pet-switcher.test.tsx src/components/__tests__/weight-chart.test.tsx src/hooks/use-pet-selection.test.tsx src/hooks/use-push-registration.navigation.test.tsx src/hooks/use-push-registration.test.tsx src/providers/__tests__/auth-provider.test.tsx src/providers/__tests__/language-provider.test.tsx src/providers/__tests__/query-provider.test.tsx src/providers/__tests__/selected-pet-provider.test.tsx src/screens/add-pet/index.test.tsx src/screens/add-reminder/index.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/screens/docs/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/screens/health/index.test.tsx src/screens/home/format.test.ts src/screens/home/index.test.tsx src/screens/home/weekly-activity-chart.test.tsx src/screens/map/index.test.tsx src/screens/meal-schedule/index.test.tsx src/screens/meals-history/index.test.tsx src/screens/pairing/index.test.tsx src/screens/profile/index.test.tsx src/screens/reminders/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/weight-log/index.test.tsx src/theme/__tests__/font-registration.test.ts src/theme/__tests__/global-css.test.ts src/theme/__tests__/theme-transition.degraded.test.tsx src/theme/__tests__/theme-transition.test.tsx src/theme/__tests__/use-theme-colors.test.tsx src/utils/__tests__/category-palette.test.ts src/utils/__tests__/month-grid.test.ts src/utils/civil-today-iso.test.ts src/utils/date-picker-value.test.ts src/utils/device-connectivity.test.ts src/utils/language-preference.test.ts src/utils/reminder-dates.test.ts src/utils/theme-preference.test.ts src/utils/zoom-for-radius.test.ts --json --outputFile /tmp/117-T1-global-verde.json > /tmp/117-T1-global-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/meals-history/index.test.tsx (6.555 s)
PASS src/utils/__tests__/month-grid.test.ts
PASS src/utils/zoom-for-radius.test.ts
PASS src/screens/geofence-editor/index.test.tsx (10.228 s)
PASS src/screens/profile/index.test.tsx (7.18 s)
PASS src/app/(tabs)/__tests__/food.test.tsx (5.559 s)
PASS src/screens/home/index.test.tsx (17.256 s)
PASS src/screens/weight-log/index.test.tsx
PASS src/screens/pairing/index.test.tsx (5.372 s)
PASS src/screens/map/index.test.tsx (5.158 s)
PASS src/app/(auth)/__tests__/forgot.test.tsx
PASS src/screens/geofences/index.test.tsx
PASS src/screens/alerts/index.test.tsx
PASS src/screens/reminders/index.test.tsx
PASS src/screens/home/weekly-activity-chart.test.tsx
PASS src/screens/reset-password/index.test.tsx
PASS src/screens/add-reminder/index.test.tsx
PASS src/screens/health/index.test.tsx
PASS src/app/__tests__/alert-detail.navigation.test.tsx
PASS src/app/__tests__/detail-stack.navigation.test.tsx
PASS src/app/(auth)/__tests__/register.test.tsx
PASS src/screens/alert-detail/index.test.tsx
PASS src/screens/add-pet/index.test.tsx
PASS src/hooks/use-push-registration.navigation.test.tsx
PASS src/components/__tests__/floating-tab-bar.test.tsx
PASS src/screens/meal-schedule/index.test.tsx (6.13 s)
PASS src/app/(tabs)/__tests__/screens.test.tsx
PASS src/api/__tests__/auth.test.ts
PASS src/screens/docs/index.test.tsx
PASS src/app/__tests__/alert-detail.notification.test.tsx
PASS src/app/(tabs)/__tests__/layout.test.tsx
PASS src/app/__tests__/detail-stack.guard.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
PASS src/app/__tests__/tabs-layout.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.notification.test.tsx
PASS src/components/__tests__/pet-hero-header.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/app/(auth)/__tests__/login.test.tsx
PASS src/utils/device-connectivity.test.ts
PASS src/theme/__tests__/theme-transition.test.tsx
PASS src/components/__tests__/pet-avatar.test.tsx
PASS src/components/__tests__/pet-switcher.test.tsx
PASS src/api/__tests__/users.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/components/__tests__/weight-chart.test.tsx
PASS src/components/__tests__/pet-map.test.tsx
PASS src/api/__tests__/devices.test.ts
PASS src/__tests__/heroui-smoke.test.tsx
PASS src/providers/__tests__/auth-provider.test.tsx
PASS src/hooks/use-push-registration.test.tsx
PASS src/api/__tests__/pets.test.ts
PASS src/app/__tests__/index.test.tsx
PASS src/providers/__tests__/query-provider.test.tsx
PASS src/utils/__tests__/category-palette.test.ts
PASS src/api/__tests__/positions.test.ts
PASS src/app/__tests__/detail-stack.test.tsx
PASS src/api/__tests__/nutrition.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/providers/__tests__/selected-pet-provider.test.tsx
PASS src/theme/__tests__/theme-transition.degraded.test.tsx
PASS src/api/__tests__/media.test.ts
PASS src/theme/__tests__/global-css.test.ts
PASS src/api/__tests__/geofences.test.ts
PASS src/utils/theme-preference.test.ts
PASS src/screens/home/format.test.ts
PASS src/app/(tabs)/__tests__/alerts.test.tsx
PASS src/__tests__/hosting-artifacts.test.ts
PASS src/api/__tests__/trips.test.ts
PASS src/theme/__tests__/font-registration.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/app/(tabs)/__tests__/profile.test.tsx
PASS src/utils/civil-today-iso.test.ts
PASS src/api/__tests__/reminders.test.ts
PASS src/hooks/use-pet-selection.test.tsx
PASS src/components/__tests__/card.test.tsx
PASS src/app/(auth)/__tests__/layout.test.tsx
PASS src/utils/reminder-dates.test.ts
PASS src/api/__tests__/health-records.test.ts
PASS src/api/__tests__/activity.test.ts
PASS src/theme/__tests__/use-theme-colors.test.tsx
PASS src/api/__tests__/subscriptions.test.ts
PASS src/utils/language-preference.test.ts
PASS src/api/__tests__/query-keys.test.ts
PASS src/api/__tests__/alerts.test.ts
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/utils/date-picker-value.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/api/__tests__/push-tokens.test.ts
Test Suites: 89 passed, 89 total
Tests:       1982 passed, 1982 total
Snapshots:   1 passed, 1 total
Time:        69.669 s, estimated 73 s
exit=0
src/screens/meals-history/index.test.tsx: 28 tests; passed
src/utils/__tests__/month-grid.test.ts: 12 tests; passed
src/utils/zoom-for-radius.test.ts: 8 tests; passed
src/screens/geofence-editor/index.test.tsx: 68 tests; passed
src/screens/profile/index.test.tsx: 39 tests; passed
src/app/(tabs)/__tests__/food.test.tsx: 57 tests; passed
src/screens/home/index.test.tsx: 169 tests; passed
src/screens/weight-log/index.test.tsx: 33 tests; passed
src/screens/pairing/index.test.tsx: 54 tests; passed
src/screens/map/index.test.tsx: 64 tests; passed
src/app/(auth)/__tests__/forgot.test.tsx: 4 tests; passed
src/screens/geofences/index.test.tsx: 49 tests; passed
src/screens/alerts/index.test.tsx: 36 tests; passed
src/screens/reminders/index.test.tsx: 31 tests; passed
src/screens/home/weekly-activity-chart.test.tsx: 60 tests; passed
src/screens/reset-password/index.test.tsx: 19 tests; passed
src/screens/add-reminder/index.test.tsx: 41 tests; passed
src/screens/health/index.test.tsx: 29 tests; passed
src/app/__tests__/alert-detail.navigation.test.tsx: 1 tests; passed
src/app/__tests__/detail-stack.navigation.test.tsx: 2 tests; passed
src/app/(auth)/__tests__/register.test.tsx: 13 tests; passed
src/screens/alert-detail/index.test.tsx: 25 tests; passed
src/screens/add-pet/index.test.tsx: 26 tests; passed
src/hooks/use-push-registration.navigation.test.tsx: 1 tests; passed
src/components/__tests__/floating-tab-bar.test.tsx: 18 tests; passed
src/screens/meal-schedule/index.test.tsx: 59 tests; passed
src/app/(tabs)/__tests__/screens.test.tsx: 2 tests; passed
src/api/__tests__/auth.test.ts: 37 tests; passed
src/screens/docs/index.test.tsx: 13 tests; passed
src/app/__tests__/alert-detail.notification.test.tsx: 1 tests; passed
src/app/(tabs)/__tests__/layout.test.tsx: 5 tests; passed
src/app/__tests__/detail-stack.guard.test.tsx: 2 tests; passed
src/app/__tests__/reminders-alerts-stack.navigation.test.tsx: 1 tests; passed
src/app/__tests__/tabs-layout.test.tsx: 1 tests; passed
src/app/__tests__/reminders-alerts-stack.notification.test.tsx: 1 tests; passed
src/components/__tests__/pet-hero-header.test.tsx: 37 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/app/(auth)/__tests__/login.test.tsx: 11 tests; passed
src/utils/device-connectivity.test.ts: 13 tests; passed
src/theme/__tests__/theme-transition.test.tsx: 6 tests; passed
src/components/__tests__/pet-avatar.test.tsx: 8 tests; passed
src/components/__tests__/pet-switcher.test.tsx: 1 tests; passed
src/api/__tests__/users.test.ts: 8 tests; passed
src/app/__tests__/layout.test.tsx: 25 tests; passed
src/components/__tests__/weight-chart.test.tsx: 4 tests; passed
src/components/__tests__/pet-map.test.tsx: 16 tests; passed
src/api/__tests__/devices.test.ts: 27 tests; passed
src/__tests__/heroui-smoke.test.tsx: 1 tests; passed
src/providers/__tests__/auth-provider.test.tsx: 8 tests; passed
src/hooks/use-push-registration.test.tsx: 53 tests; passed
src/api/__tests__/pets.test.ts: 36 tests; passed
src/app/__tests__/index.test.tsx: 3 tests; passed
src/providers/__tests__/query-provider.test.tsx: 11 tests; passed
src/utils/__tests__/category-palette.test.ts: 12 tests; passed
src/api/__tests__/positions.test.ts: 22 tests; passed
src/app/__tests__/detail-stack.test.tsx: 18 tests; passed
src/api/__tests__/nutrition.test.ts: 71 tests; passed
src/providers/__tests__/language-provider.test.tsx: 22 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/providers/__tests__/selected-pet-provider.test.tsx: 3 tests; passed
src/theme/__tests__/theme-transition.degraded.test.tsx: 1 tests; passed
src/api/__tests__/media.test.ts: 15 tests; passed
src/theme/__tests__/global-css.test.ts: 51 tests; passed
src/api/__tests__/geofences.test.ts: 63 tests; passed
src/utils/theme-preference.test.ts: 8 tests; passed
src/screens/home/format.test.ts: 13 tests; passed
src/app/(tabs)/__tests__/alerts.test.tsx: 3 tests; passed
src/__tests__/hosting-artifacts.test.ts: 7 tests; passed
src/api/__tests__/trips.test.ts: 17 tests; passed
src/theme/__tests__/font-registration.test.ts: 3 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/app/(tabs)/__tests__/profile.test.tsx: 1 tests; passed
src/utils/civil-today-iso.test.ts: 6 tests; passed
src/api/__tests__/reminders.test.ts: 27 tests; passed
src/hooks/use-pet-selection.test.tsx: 7 tests; passed
src/components/__tests__/card.test.tsx: 7 tests; passed
src/app/(auth)/__tests__/layout.test.tsx: 3 tests; passed
src/utils/reminder-dates.test.ts: 20 tests; passed
src/api/__tests__/health-records.test.ts: 33 tests; passed
src/api/__tests__/activity.test.ts: 9 tests; passed
src/theme/__tests__/use-theme-colors.test.tsx: 1 tests; passed
src/api/__tests__/subscriptions.test.ts: 10 tests; passed
src/utils/language-preference.test.ts: 8 tests; passed
src/api/__tests__/query-keys.test.ts: 22 tests; passed
src/api/__tests__/alerts.test.ts: 28 tests; passed
src/__tests__/hero-header-amendments.test.ts: 3 tests; passed
src/utils/date-picker-value.test.ts: 12 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/api/__tests__/push-tokens.test.ts: 10 tests; passed
```

Commit: `9cb64956` — feat(mobile): add the forgotPassword client to the auth api (#117 R2)

## T2-rojo

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/providers/__tests__/language-provider.test.tsx --json --outputFile /tmp/117-T2-rojo.json > /tmp/117-T2-rojo.log 2>&1; echo "exit=$?"
```

```text
FAIL src/providers/__tests__/language-provider.test.tsx
Test Suites: 1 failed, 1 total
Tests:       1 failed, 22 passed, 23 total
Snapshots:   0 total
Time:        2.066 s
exit=1
src/providers/__tests__/language-provider.test.tsx: 23 tests; failed

#117 R1: el catálogo trae las claves de recuperar contraseña registra las seis claves en los dos idiomas, con {{email}} en forgot.sentTo, y en la tabla de la spec de idioma
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Enter the email linked to your account and we'll send you a link to reset your password."
Received: undefined
```

Commit: `11bc5588` — test(mobile): lock the six forgot catalog keys (#117 R1)

## T2-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts --json --outputFile /tmp/117-T2-verde.json > /tmp/117-T2-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/ui-language.test.ts
FAIL src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/legibility-classnames.test.ts
Test Suites: 1 failed, 4 passed, 5 total
Tests:       2 failed, 190 passed, 192 total
Snapshots:   0 total
Time:        2.943 s, estimated 3 s
exit=1
src/__tests__/ui-language.test.ts: 29 tests; passed
src/providers/__tests__/language-provider.test.tsx: 23 tests; failed

#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas
Error: expect(received).toHaveLength(expected)

Expected length: 358
Received length: 352
Received array:  ["addPet.addPet", "addPet.age", "addPet.approxMonths", "addPet.avatarPreview", "addPet.basicDetails", "addPet.birthDate", "addPet.breed", "addPet.cat", "addPet.checkPetDetails", "addPet.chooseBirthDate", …]

#117 R1: el catálogo trae las claves de recuperar contraseña registra las seis claves en los dos idiomas, con {{email}} en forgot.sentTo, y en la tabla de la spec de idioma
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Enter the email linked to your account and we'll send you a link to reset your password."
Received: undefined
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
```

## Parada en la preparación del verde T2

El intento etiquetado `T2-verde` NO es un verde: exit=1. Error del implementador en `/tmp/117-T2.py`: buscó `export const es =`, pero el fichero real declara `export const es: Record<TranslationKey, string> = {` (línea 358). El script había escrito únicamente el delta `+ 6` del candado de longitud; no llegó a escribir catalog.ts ni design.md. La shell continuó al chequeo después del error del script (faltó detener la secuencia al fallar).

Además del `it` de R1 aún rojo, cayó otro `it`:

- `#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas`.
- Aserción: `toHaveLength`; Expected length: 358; Received length: 352.
- Suite del intento: 5 suites (4 passed / 1 failed), 192 tests (190 passed / 2 failed), exit=1. Detalle íntegro del matcher y ambos fallos en el bloque T2-verde anterior.

Se para por la regla explícita «Si cae otro it, PARA y repórtalo». No se ajustan aserciones ni se continúa con el verde. Los candados inmutables de consistency, legibility y design-drift siguieron verdes.

Estado al parar:

- T1 terminado: rojo `7ba0b3a9`, verde `9cb64956`. Global verde T1: 89 suites / 1982 tests, exit=0.
- T2 solo rojo commiteado: `11bc5588`. Su medición anterior fue 1 suite / 23 tests, 1 failed / 22 passed, exit=1 por `toBe`: clave ausente (Expected literal de instructions; Received undefined), como se esperaba.
- Cambio sin commit en language-provider.test.tsx: únicamente el delta `+6` de la preparación incompleta del verde T2.
- catalog.ts y specs/mobile-ui-language/design.md siguen intactos; ningún verde T2 creado.
- progress/impl_mobile-forgot-password.md sigue nuevo sin commit, con el registro anterior preservado.
- Sin sondas de mutación aún; traceability intacta; smoke humano intacto; ningún push/PR, rebase ni cambio de branch/worktree.
- Decisión no cerrada por la spec: ninguna. En T1 se comprobó también JSON inválido de 400 dentro del `it` existente de 400 sin errors, conservando el recuento normativo.

## Reanudación 2026-10-05 — completar verde T2

```text
/home/claude/sites/Pet-Tracker-wt-backend
feature/117-mobile-forgot-password
11bc5588
```

H0 sigue siendo `90a19d86`; HEAD `11bc5588` es el rojo T2. Decisión explícita del leader: el fallo Expected 358 / Received 352 fue el estado intermedio del verde incompleto, no una regresión ni bloqueo. Se conserva el delta `+6` sin cambios. Se completa T2 con la declaración tipada real de es; cada edición se valida por su exit antes de medir. El registro anterior se conserva íntegro.

## T2-verde-completo

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts --json --outputFile /tmp/117-T2-verde-completo.json > /tmp/117-T2-verde-completo.log 2>&1; echo "exit=$?"
```

```text
PASS src/providers/__tests__/language-provider.test.tsx (5.147 s)
PASS src/__tests__/ui-language.test.ts (6.374 s)
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
Test Suites: 5 passed, 5 total
Tests:       192 passed, 192 total
Snapshots:   0 total
Time:        9.631 s
exit=0
src/providers/__tests__/language-provider.test.tsx: 23 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
```

Commit: `6ff636d3` — feat(mobile): add the forgot copy in both languages (#117 R1)

## T3-rojo

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx src/providers/__tests__/language-provider.test.tsx --json --outputFile /tmp/117-T3-rojo.json > /tmp/117-T3-rojo.log 2>&1; echo "exit=$?"
```

```text
FAIL src/providers/__tests__/language-provider.test.tsx
FAIL src/screens/forgot/index.test.tsx (12.519 s)
Test Suites: 2 failed, 2 total
Tests:       3 failed, 25 passed, 28 total
Snapshots:   0 total
Time:        14.192 s
exit=1
src/providers/__tests__/language-provider.test.tsx: 24 tests; failed

#117 R1: el catálogo trae las claves de recuperar contraseña retira forgot.comingSoon de los dos idiomas
Error: expect(received).toBeUndefined()

Received: "Password recovery coming soon"
src/screens/forgot/index.test.tsx: 4 tests; failed

#117 R3: la ruta forgot delega en ForgotScreen renderiza screen-forgot y forgot-form con el título desde la ruta y sin el aviso del stub
Error: Unable to find an element with testID: forgot-form
    at Object.getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:50:19)

#61 R8: forgot tiene contenedor de scroll con safe areas conserva el centrado de hoy dentro de un ScrollView con insets
Error: Unable to find an element with testID: forgot-form
    at Object.getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:69:31)
```

T3 rojo: los tres fallos coinciden con el guion (dos consultas de forgot-form ausente y toBeUndefined de comingSoon). El candado #127 R1 nació verde por conservar el stub su className; también nació verde R3 it 2 (la navegación ya existía). Los cuatro it eliminados se conservan, reapuntan o invierten según §Aserciones existentes; ninguna aserción se descarta sin sustitución.

Commit: `0fe5e0fe` — test(mobile): lock the forgot route, screen tree and stub removal (#117 R3, R1)

## T3-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' 'src/app/(auth)/__tests__/layout.test.tsx' --json --outputFile /tmp/117-T3-verde.json > /tmp/117-T3-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/screens/forgot/index.test.tsx (6.244 s)
PASS src/__tests__/consistency-classnames.test.ts
PASS src/app/(auth)/__tests__/register.test.tsx
PASS src/__tests__/legibility-classnames.test.ts
PASS src/app/(auth)/__tests__/layout.test.tsx
PASS src/app/(auth)/__tests__/login.test.tsx
Test Suites: 9 passed, 9 total
Tests:       224 passed, 224 total
Snapshots:   0 total
Time:        8.858 s, estimated 17 s
exit=0
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/screens/forgot/index.test.tsx: 4 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/app/(auth)/__tests__/register.test.tsx: 13 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/app/(auth)/__tests__/layout.test.tsx: 3 tests; passed
src/app/(auth)/__tests__/login.test.tsx: 11 tests; passed
```

`test ! -e .expo/types/router.d.ts` (desde mobile-pet-tracker/): exit=0.

## T3-typecheck

```sh
bun run typecheck > /tmp/117-T3-typecheck.log 2>&1; echo "exit=$?"
```

```text

exit=0
$ tsc --noEmit

```

## T3-global-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/heroui-smoke.test.tsx src/__tests__/hosting-artifacts.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/api/__tests__/activity.test.ts src/api/__tests__/alerts.test.ts src/api/__tests__/auth.test.ts src/api/__tests__/devices.test.ts src/api/__tests__/geofences.test.ts src/api/__tests__/health-records.test.ts src/api/__tests__/media.test.ts src/api/__tests__/nutrition.test.ts src/api/__tests__/pets.test.ts src/api/__tests__/positions.test.ts src/api/__tests__/push-tokens.test.ts src/api/__tests__/query-keys.test.ts src/api/__tests__/reminders.test.ts src/api/__tests__/subscriptions.test.ts src/api/__tests__/trips.test.ts src/api/__tests__/users.test.ts 'src/app/(auth)/__tests__/layout.test.tsx' 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' 'src/app/(tabs)/__tests__/alerts.test.tsx' 'src/app/(tabs)/__tests__/food.test.tsx' 'src/app/(tabs)/__tests__/layout.test.tsx' 'src/app/(tabs)/__tests__/profile.test.tsx' 'src/app/(tabs)/__tests__/screens.test.tsx' src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/alert-detail.notification.test.tsx src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/reminders-alerts-stack.notification.test.tsx src/app/__tests__/tabs-layout.test.tsx src/components/__tests__/card.test.tsx src/components/__tests__/floating-tab-bar.test.tsx src/components/__tests__/pet-avatar.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/components/__tests__/pet-map.test.tsx src/components/__tests__/pet-switcher.test.tsx src/components/__tests__/weight-chart.test.tsx src/hooks/use-pet-selection.test.tsx src/hooks/use-push-registration.navigation.test.tsx src/hooks/use-push-registration.test.tsx src/providers/__tests__/auth-provider.test.tsx src/providers/__tests__/language-provider.test.tsx src/providers/__tests__/query-provider.test.tsx src/providers/__tests__/selected-pet-provider.test.tsx src/screens/add-pet/index.test.tsx src/screens/add-reminder/index.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/screens/docs/index.test.tsx src/screens/forgot/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/screens/health/index.test.tsx src/screens/home/format.test.ts src/screens/home/index.test.tsx src/screens/home/weekly-activity-chart.test.tsx src/screens/map/index.test.tsx src/screens/meal-schedule/index.test.tsx src/screens/meals-history/index.test.tsx src/screens/pairing/index.test.tsx src/screens/profile/index.test.tsx src/screens/reminders/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/weight-log/index.test.tsx src/theme/__tests__/font-registration.test.ts src/theme/__tests__/global-css.test.ts src/theme/__tests__/theme-transition.degraded.test.tsx src/theme/__tests__/theme-transition.test.tsx src/theme/__tests__/use-theme-colors.test.tsx src/utils/__tests__/category-palette.test.ts src/utils/__tests__/month-grid.test.ts src/utils/civil-today-iso.test.ts src/utils/date-picker-value.test.ts src/utils/device-connectivity.test.ts src/utils/language-preference.test.ts src/utils/reminder-dates.test.ts src/utils/theme-preference.test.ts src/utils/zoom-for-radius.test.ts --json --outputFile /tmp/117-T3-global-verde.json > /tmp/117-T3-global-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/geofence-editor/index.test.tsx (12.674 s)
PASS src/screens/profile/index.test.tsx (13.993 s)
PASS src/screens/meals-history/index.test.tsx
PASS src/screens/forgot/index.test.tsx
PASS src/screens/home/index.test.tsx (33.711 s)
PASS src/screens/meal-schedule/index.test.tsx (6.355 s)
PASS src/app/(tabs)/__tests__/food.test.tsx (5.342 s)
PASS src/screens/pairing/index.test.tsx (5.728 s)
PASS src/screens/map/index.test.tsx (5.878 s)
PASS src/screens/geofences/index.test.tsx
PASS src/app/(auth)/__tests__/register.test.tsx
PASS src/screens/reminders/index.test.tsx
PASS src/screens/alerts/index.test.tsx
PASS src/screens/weight-log/index.test.tsx
PASS src/screens/home/weekly-activity-chart.test.tsx
PASS src/screens/health/index.test.tsx
PASS src/screens/add-reminder/index.test.tsx
PASS src/screens/alert-detail/index.test.tsx
PASS src/app/__tests__/alert-detail.navigation.test.tsx
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/screens/add-pet/index.test.tsx
PASS src/app/__tests__/alert-detail.notification.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
PASS src/app/(tabs)/__tests__/layout.test.tsx
PASS src/app/(tabs)/__tests__/screens.test.tsx
PASS src/app/__tests__/tabs-layout.test.tsx
PASS src/screens/docs/index.test.tsx
PASS src/components/__tests__/floating-tab-bar.test.tsx
PASS src/components/__tests__/pet-hero-header.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.notification.test.tsx
PASS src/app/__tests__/detail-stack.navigation.test.tsx
PASS src/screens/reset-password/index.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/app/(auth)/__tests__/login.test.tsx
PASS src/app/__tests__/layout.test.tsx
PASS src/app/__tests__/detail-stack.guard.test.tsx
PASS src/components/__tests__/pet-map.test.tsx
PASS src/components/__tests__/weight-chart.test.tsx
PASS src/hooks/use-push-registration.navigation.test.tsx
PASS src/app/(tabs)/__tests__/profile.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/api/__tests__/auth.test.ts
PASS src/components/__tests__/pet-switcher.test.tsx
PASS src/api/__tests__/nutrition.test.ts
PASS src/components/__tests__/pet-avatar.test.tsx
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/__tests__/heroui-smoke.test.tsx
PASS src/providers/__tests__/query-provider.test.tsx
PASS src/utils/__tests__/month-grid.test.ts
PASS src/hooks/use-push-registration.test.tsx
PASS src/api/__tests__/geofences.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/api/__tests__/alerts.test.ts
PASS src/providers/__tests__/auth-provider.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/app/__tests__/index.test.tsx
PASS src/utils/zoom-for-radius.test.ts
PASS src/providers/__tests__/selected-pet-provider.test.tsx
PASS src/components/__tests__/card.test.tsx
PASS src/app/(auth)/__tests__/layout.test.tsx
PASS src/api/__tests__/positions.test.ts
PASS src/utils/reminder-dates.test.ts
PASS src/app/__tests__/detail-stack.test.tsx
PASS src/hooks/use-pet-selection.test.tsx
PASS src/app/(tabs)/__tests__/alerts.test.tsx
PASS src/api/__tests__/query-keys.test.ts
PASS src/api/__tests__/reminders.test.ts
PASS src/utils/theme-preference.test.ts
PASS src/theme/__tests__/global-css.test.ts
PASS src/theme/__tests__/use-theme-colors.test.tsx
PASS src/api/__tests__/health-records.test.ts
PASS src/utils/civil-today-iso.test.ts
PASS src/api/__tests__/subscriptions.test.ts
PASS src/theme/__tests__/theme-transition.degraded.test.tsx
PASS src/theme/__tests__/theme-transition.test.tsx
PASS src/screens/home/format.test.ts
PASS src/api/__tests__/devices.test.ts
PASS src/api/__tests__/activity.test.ts
PASS src/api/__tests__/trips.test.ts
PASS src/utils/__tests__/category-palette.test.ts
PASS src/utils/language-preference.test.ts
PASS src/utils/device-connectivity.test.ts
PASS src/api/__tests__/pets.test.ts
PASS src/api/__tests__/push-tokens.test.ts
PASS src/theme/__tests__/font-registration.test.ts
PASS src/api/__tests__/media.test.ts
PASS src/__tests__/hosting-artifacts.test.ts
PASS src/utils/date-picker-value.test.ts
PASS src/api/__tests__/users.test.ts
Test Suites: 89 passed, 89 total
Tests:       1984 passed, 1984 total
Snapshots:   1 passed, 1 total
Time:        91.558 s
exit=0
src/screens/geofence-editor/index.test.tsx: 68 tests; passed
src/screens/profile/index.test.tsx: 39 tests; passed
src/screens/meals-history/index.test.tsx: 28 tests; passed
src/screens/forgot/index.test.tsx: 4 tests; passed
src/screens/home/index.test.tsx: 169 tests; passed
src/screens/meal-schedule/index.test.tsx: 59 tests; passed
src/app/(tabs)/__tests__/food.test.tsx: 57 tests; passed
src/screens/pairing/index.test.tsx: 54 tests; passed
src/screens/map/index.test.tsx: 64 tests; passed
src/screens/geofences/index.test.tsx: 49 tests; passed
src/app/(auth)/__tests__/register.test.tsx: 13 tests; passed
src/screens/reminders/index.test.tsx: 31 tests; passed
src/screens/alerts/index.test.tsx: 36 tests; passed
src/screens/weight-log/index.test.tsx: 33 tests; passed
src/screens/home/weekly-activity-chart.test.tsx: 60 tests; passed
src/screens/health/index.test.tsx: 29 tests; passed
src/screens/add-reminder/index.test.tsx: 41 tests; passed
src/screens/alert-detail/index.test.tsx: 25 tests; passed
src/app/__tests__/alert-detail.navigation.test.tsx: 1 tests; passed
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/screens/add-pet/index.test.tsx: 26 tests; passed
src/app/__tests__/alert-detail.notification.test.tsx: 1 tests; passed
src/app/__tests__/reminders-alerts-stack.navigation.test.tsx: 1 tests; passed
src/app/(tabs)/__tests__/layout.test.tsx: 5 tests; passed
src/app/(tabs)/__tests__/screens.test.tsx: 2 tests; passed
src/app/__tests__/tabs-layout.test.tsx: 1 tests; passed
src/screens/docs/index.test.tsx: 13 tests; passed
src/components/__tests__/floating-tab-bar.test.tsx: 18 tests; passed
src/components/__tests__/pet-hero-header.test.tsx: 37 tests; passed
src/app/__tests__/reminders-alerts-stack.notification.test.tsx: 1 tests; passed
src/app/__tests__/detail-stack.navigation.test.tsx: 2 tests; passed
src/screens/reset-password/index.test.tsx: 19 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/app/(auth)/__tests__/login.test.tsx: 11 tests; passed
src/app/__tests__/layout.test.tsx: 25 tests; passed
src/app/__tests__/detail-stack.guard.test.tsx: 2 tests; passed
src/components/__tests__/pet-map.test.tsx: 16 tests; passed
src/components/__tests__/weight-chart.test.tsx: 4 tests; passed
src/hooks/use-push-registration.navigation.test.tsx: 1 tests; passed
src/app/(tabs)/__tests__/profile.test.tsx: 1 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/api/__tests__/auth.test.ts: 37 tests; passed
src/components/__tests__/pet-switcher.test.tsx: 1 tests; passed
src/api/__tests__/nutrition.test.ts: 71 tests; passed
src/components/__tests__/pet-avatar.test.tsx: 8 tests; passed
src/__tests__/hero-header-amendments.test.ts: 3 tests; passed
src/__tests__/heroui-smoke.test.tsx: 1 tests; passed
src/providers/__tests__/query-provider.test.tsx: 11 tests; passed
src/utils/__tests__/month-grid.test.ts: 12 tests; passed
src/hooks/use-push-registration.test.tsx: 53 tests; passed
src/api/__tests__/geofences.test.ts: 63 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/api/__tests__/alerts.test.ts: 28 tests; passed
src/providers/__tests__/auth-provider.test.tsx: 8 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/app/__tests__/index.test.tsx: 3 tests; passed
src/utils/zoom-for-radius.test.ts: 8 tests; passed
src/providers/__tests__/selected-pet-provider.test.tsx: 3 tests; passed
src/components/__tests__/card.test.tsx: 7 tests; passed
src/app/(auth)/__tests__/layout.test.tsx: 3 tests; passed
src/api/__tests__/positions.test.ts: 22 tests; passed
src/utils/reminder-dates.test.ts: 20 tests; passed
src/app/__tests__/detail-stack.test.tsx: 18 tests; passed
src/hooks/use-pet-selection.test.tsx: 7 tests; passed
src/app/(tabs)/__tests__/alerts.test.tsx: 3 tests; passed
src/api/__tests__/query-keys.test.ts: 22 tests; passed
src/api/__tests__/reminders.test.ts: 27 tests; passed
src/utils/theme-preference.test.ts: 8 tests; passed
src/theme/__tests__/global-css.test.ts: 51 tests; passed
src/theme/__tests__/use-theme-colors.test.tsx: 1 tests; passed
src/api/__tests__/health-records.test.ts: 33 tests; passed
src/utils/civil-today-iso.test.ts: 6 tests; passed
src/api/__tests__/subscriptions.test.ts: 10 tests; passed
src/theme/__tests__/theme-transition.degraded.test.tsx: 1 tests; passed
src/theme/__tests__/theme-transition.test.tsx: 6 tests; passed
src/screens/home/format.test.ts: 13 tests; passed
src/api/__tests__/devices.test.ts: 27 tests; passed
src/api/__tests__/activity.test.ts: 9 tests; passed
src/api/__tests__/trips.test.ts: 17 tests; passed
src/utils/__tests__/category-palette.test.ts: 12 tests; passed
src/utils/language-preference.test.ts: 8 tests; passed
src/utils/device-connectivity.test.ts: 13 tests; passed
src/api/__tests__/pets.test.ts: 36 tests; passed
src/api/__tests__/push-tokens.test.ts: 10 tests; passed
src/theme/__tests__/font-registration.test.ts: 3 tests; passed
src/api/__tests__/media.test.ts: 15 tests; passed
src/__tests__/hosting-artifacts.test.ts: 7 tests; passed
src/utils/date-picker-value.test.ts: 12 tests; passed
src/api/__tests__/users.test.ts: 8 tests; passed
```

Commit: `14752498` — feat(mobile): move forgot to its own screen behind a thin route (#117 R3, R1)

## T4-rojo

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-T4-rojo.json > /tmp/117-T4-rojo.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/forgot/index.test.tsx (5.669 s)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 5 passed, 7 total
Snapshots:   0 total
Time:        5.82 s
exit=1
src/screens/forgot/index.test.tsx: 7 tests; failed

#117 R4: el formulario pide el correo pinta título, instrucciones y forgot-email editable con sus props de teclado
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not false

#117 R4: el formulario pide el correo deshabilita forgot-submit con el correo vacío o solo espacios y lo habilita al escribir
Error: expect(instance).not.toBeDisabled()

Received instance is disabled:
  <View
    accessibilityRole="button"
    accessibilityState={
      {
        "disabled": true,
      }
    }
    accessible={true}
    testID="forgot-submit"
  />
```

T4 rojo: R4 it 1 `not.toBe(false)` recibió editable=false (Jest imprime solo Expected: not false); R4 it 2 recibió forgot-submit disabled=true tras escribir ana@example.com, esperando habilitado. R4 it 3 nació verde (no había error ni resend).

Commit: `ee307c0e` — test(mobile): lock the forgot form state (#117 R4)

## T4-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/ui-language.test.ts --json --outputFile /tmp/117-T4-verde.json > /tmp/117-T4-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/screens/forgot/index.test.tsx (5.973 s)
Test Suites: 5 passed, 5 total
Tests:       176 passed, 176 total
Snapshots:   0 total
Time:        6.548 s
exit=0
src/__tests__/ui-language.test.ts: 29 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/screens/forgot/index.test.tsx: 7 tests; passed
```

## T4-global-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/heroui-smoke.test.tsx src/__tests__/hosting-artifacts.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/api/__tests__/activity.test.ts src/api/__tests__/alerts.test.ts src/api/__tests__/auth.test.ts src/api/__tests__/devices.test.ts src/api/__tests__/geofences.test.ts src/api/__tests__/health-records.test.ts src/api/__tests__/media.test.ts src/api/__tests__/nutrition.test.ts src/api/__tests__/pets.test.ts src/api/__tests__/positions.test.ts src/api/__tests__/push-tokens.test.ts src/api/__tests__/query-keys.test.ts src/api/__tests__/reminders.test.ts src/api/__tests__/subscriptions.test.ts src/api/__tests__/trips.test.ts src/api/__tests__/users.test.ts 'src/app/(auth)/__tests__/layout.test.tsx' 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' 'src/app/(tabs)/__tests__/alerts.test.tsx' 'src/app/(tabs)/__tests__/food.test.tsx' 'src/app/(tabs)/__tests__/layout.test.tsx' 'src/app/(tabs)/__tests__/profile.test.tsx' 'src/app/(tabs)/__tests__/screens.test.tsx' src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/alert-detail.notification.test.tsx src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/reminders-alerts-stack.notification.test.tsx src/app/__tests__/tabs-layout.test.tsx src/components/__tests__/card.test.tsx src/components/__tests__/floating-tab-bar.test.tsx src/components/__tests__/pet-avatar.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/components/__tests__/pet-map.test.tsx src/components/__tests__/pet-switcher.test.tsx src/components/__tests__/weight-chart.test.tsx src/hooks/use-pet-selection.test.tsx src/hooks/use-push-registration.navigation.test.tsx src/hooks/use-push-registration.test.tsx src/providers/__tests__/auth-provider.test.tsx src/providers/__tests__/language-provider.test.tsx src/providers/__tests__/query-provider.test.tsx src/providers/__tests__/selected-pet-provider.test.tsx src/screens/add-pet/index.test.tsx src/screens/add-reminder/index.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/screens/docs/index.test.tsx src/screens/forgot/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/screens/health/index.test.tsx src/screens/home/format.test.ts src/screens/home/index.test.tsx src/screens/home/weekly-activity-chart.test.tsx src/screens/map/index.test.tsx src/screens/meal-schedule/index.test.tsx src/screens/meals-history/index.test.tsx src/screens/pairing/index.test.tsx src/screens/profile/index.test.tsx src/screens/reminders/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/weight-log/index.test.tsx src/theme/__tests__/font-registration.test.ts src/theme/__tests__/global-css.test.ts src/theme/__tests__/theme-transition.degraded.test.tsx src/theme/__tests__/theme-transition.test.tsx src/theme/__tests__/use-theme-colors.test.tsx src/utils/__tests__/category-palette.test.ts src/utils/__tests__/month-grid.test.ts src/utils/civil-today-iso.test.ts src/utils/date-picker-value.test.ts src/utils/device-connectivity.test.ts src/utils/language-preference.test.ts src/utils/reminder-dates.test.ts src/utils/theme-preference.test.ts src/utils/zoom-for-radius.test.ts --json --outputFile /tmp/117-T4-global-verde.json > /tmp/117-T4-global-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/profile/index.test.tsx (8.443 s)
PASS src/screens/geofence-editor/index.test.tsx (5.637 s)
PASS src/screens/home/index.test.tsx (19.198 s)
PASS src/screens/meal-schedule/index.test.tsx (6.089 s)
PASS src/screens/forgot/index.test.tsx
PASS src/screens/map/index.test.tsx
PASS src/screens/pairing/index.test.tsx
PASS src/screens/geofences/index.test.tsx
PASS src/app/(tabs)/__tests__/food.test.tsx
PASS src/screens/reminders/index.test.tsx
PASS src/screens/alerts/index.test.tsx
PASS src/screens/weight-log/index.test.tsx
PASS src/screens/home/weekly-activity-chart.test.tsx
PASS src/screens/add-reminder/index.test.tsx
PASS src/screens/health/index.test.tsx
PASS src/screens/add-pet/index.test.tsx
PASS src/app/__tests__/alert-detail.notification.test.tsx
PASS src/app/(auth)/__tests__/register.test.tsx
PASS src/app/__tests__/alert-detail.navigation.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/screens/alert-detail/index.test.tsx
PASS src/screens/meals-history/index.test.tsx
PASS src/components/__tests__/floating-tab-bar.test.tsx
PASS src/screens/reset-password/index.test.tsx
PASS src/app/(tabs)/__tests__/layout.test.tsx
PASS src/screens/docs/index.test.tsx
PASS src/app/__tests__/detail-stack.navigation.test.tsx
PASS src/app/(tabs)/__tests__/screens.test.tsx
PASS src/hooks/use-push-registration.navigation.test.tsx
PASS src/components/__tests__/pet-hero-header.test.tsx
PASS src/app/(auth)/__tests__/login.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.notification.test.tsx
PASS src/app/__tests__/detail-stack.guard.test.tsx
PASS src/app/__tests__/tabs-layout.test.tsx
PASS src/components/__tests__/pet-map.test.tsx
PASS src/api/__tests__/geofences.test.ts
PASS src/hooks/use-push-registration.test.tsx
PASS src/components/__tests__/pet-avatar.test.tsx
PASS src/utils/language-preference.test.ts
PASS src/api/__tests__/positions.test.ts
PASS src/components/__tests__/weight-chart.test.tsx
PASS src/app/__tests__/layout.test.tsx
PASS src/components/__tests__/pet-switcher.test.tsx
PASS src/api/__tests__/subscriptions.test.ts
PASS src/theme/__tests__/font-registration.test.ts
PASS src/__tests__/heroui-smoke.test.tsx
PASS src/app/(auth)/__tests__/layout.test.tsx
PASS src/api/__tests__/nutrition.test.ts
PASS src/utils/civil-today-iso.test.ts
PASS src/hooks/use-pet-selection.test.tsx
PASS src/theme/__tests__/theme-transition.test.tsx
PASS src/providers/__tests__/query-provider.test.tsx
PASS src/providers/__tests__/selected-pet-provider.test.tsx
PASS src/app/(tabs)/__tests__/alerts.test.tsx
PASS src/utils/__tests__/month-grid.test.ts
PASS src/app/__tests__/index.test.tsx
PASS src/providers/__tests__/auth-provider.test.tsx
PASS src/api/__tests__/auth.test.ts
PASS src/api/__tests__/health-records.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/utils/__tests__/category-palette.test.ts
PASS src/api/__tests__/activity.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/theme/__tests__/global-css.test.ts
PASS src/theme/__tests__/theme-transition.degraded.test.tsx
PASS src/app/(tabs)/__tests__/profile.test.tsx
PASS src/__tests__/hosting-artifacts.test.ts
PASS src/api/__tests__/media.test.ts
PASS src/api/__tests__/trips.test.ts
PASS src/api/__tests__/push-tokens.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/api/__tests__/query-keys.test.ts
PASS src/theme/__tests__/use-theme-colors.test.tsx
PASS src/components/__tests__/card.test.tsx
PASS src/utils/reminder-dates.test.ts
PASS src/api/__tests__/alerts.test.ts
PASS src/app/__tests__/detail-stack.test.tsx
PASS src/screens/home/format.test.ts
PASS src/api/__tests__/reminders.test.ts
PASS src/utils/theme-preference.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/utils/date-picker-value.test.ts
PASS src/utils/device-connectivity.test.ts
PASS src/api/__tests__/pets.test.ts
PASS src/utils/zoom-for-radius.test.ts
PASS src/api/__tests__/devices.test.ts
PASS src/api/__tests__/users.test.ts
Test Suites: 89 passed, 89 total
Tests:       1987 passed, 1987 total
Snapshots:   1 passed, 1 total
Time:        69.223 s, estimated 89 s
exit=0
src/screens/profile/index.test.tsx: 39 tests; passed
src/screens/geofence-editor/index.test.tsx: 68 tests; passed
src/screens/home/index.test.tsx: 169 tests; passed
src/screens/meal-schedule/index.test.tsx: 59 tests; passed
src/screens/forgot/index.test.tsx: 7 tests; passed
src/screens/map/index.test.tsx: 64 tests; passed
src/screens/pairing/index.test.tsx: 54 tests; passed
src/screens/geofences/index.test.tsx: 49 tests; passed
src/app/(tabs)/__tests__/food.test.tsx: 57 tests; passed
src/screens/reminders/index.test.tsx: 31 tests; passed
src/screens/alerts/index.test.tsx: 36 tests; passed
src/screens/weight-log/index.test.tsx: 33 tests; passed
src/screens/home/weekly-activity-chart.test.tsx: 60 tests; passed
src/screens/add-reminder/index.test.tsx: 41 tests; passed
src/screens/health/index.test.tsx: 29 tests; passed
src/screens/add-pet/index.test.tsx: 26 tests; passed
src/app/__tests__/alert-detail.notification.test.tsx: 1 tests; passed
src/app/(auth)/__tests__/register.test.tsx: 13 tests; passed
src/app/__tests__/alert-detail.navigation.test.tsx: 1 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/screens/alert-detail/index.test.tsx: 25 tests; passed
src/screens/meals-history/index.test.tsx: 28 tests; passed
src/components/__tests__/floating-tab-bar.test.tsx: 18 tests; passed
src/screens/reset-password/index.test.tsx: 19 tests; passed
src/app/(tabs)/__tests__/layout.test.tsx: 5 tests; passed
src/screens/docs/index.test.tsx: 13 tests; passed
src/app/__tests__/detail-stack.navigation.test.tsx: 2 tests; passed
src/app/(tabs)/__tests__/screens.test.tsx: 2 tests; passed
src/hooks/use-push-registration.navigation.test.tsx: 1 tests; passed
src/components/__tests__/pet-hero-header.test.tsx: 37 tests; passed
src/app/(auth)/__tests__/login.test.tsx: 11 tests; passed
src/app/__tests__/reminders-alerts-stack.navigation.test.tsx: 1 tests; passed
src/app/__tests__/reminders-alerts-stack.notification.test.tsx: 1 tests; passed
src/app/__tests__/detail-stack.guard.test.tsx: 2 tests; passed
src/app/__tests__/tabs-layout.test.tsx: 1 tests; passed
src/components/__tests__/pet-map.test.tsx: 16 tests; passed
src/api/__tests__/geofences.test.ts: 63 tests; passed
src/hooks/use-push-registration.test.tsx: 53 tests; passed
src/components/__tests__/pet-avatar.test.tsx: 8 tests; passed
src/utils/language-preference.test.ts: 8 tests; passed
src/api/__tests__/positions.test.ts: 22 tests; passed
src/components/__tests__/weight-chart.test.tsx: 4 tests; passed
src/app/__tests__/layout.test.tsx: 25 tests; passed
src/components/__tests__/pet-switcher.test.tsx: 1 tests; passed
src/api/__tests__/subscriptions.test.ts: 10 tests; passed
src/theme/__tests__/font-registration.test.ts: 3 tests; passed
src/__tests__/heroui-smoke.test.tsx: 1 tests; passed
src/app/(auth)/__tests__/layout.test.tsx: 3 tests; passed
src/api/__tests__/nutrition.test.ts: 71 tests; passed
src/utils/civil-today-iso.test.ts: 6 tests; passed
src/hooks/use-pet-selection.test.tsx: 7 tests; passed
src/theme/__tests__/theme-transition.test.tsx: 6 tests; passed
src/providers/__tests__/query-provider.test.tsx: 11 tests; passed
src/providers/__tests__/selected-pet-provider.test.tsx: 3 tests; passed
src/app/(tabs)/__tests__/alerts.test.tsx: 3 tests; passed
src/utils/__tests__/month-grid.test.ts: 12 tests; passed
src/app/__tests__/index.test.tsx: 3 tests; passed
src/providers/__tests__/auth-provider.test.tsx: 8 tests; passed
src/api/__tests__/auth.test.ts: 37 tests; passed
src/api/__tests__/health-records.test.ts: 33 tests; passed
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/utils/__tests__/category-palette.test.ts: 12 tests; passed
src/api/__tests__/activity.test.ts: 9 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/theme/__tests__/global-css.test.ts: 51 tests; passed
src/theme/__tests__/theme-transition.degraded.test.tsx: 1 tests; passed
src/app/(tabs)/__tests__/profile.test.tsx: 1 tests; passed
src/__tests__/hosting-artifacts.test.ts: 7 tests; passed
src/api/__tests__/media.test.ts: 15 tests; passed
src/api/__tests__/trips.test.ts: 17 tests; passed
src/api/__tests__/push-tokens.test.ts: 10 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/api/__tests__/query-keys.test.ts: 22 tests; passed
src/theme/__tests__/use-theme-colors.test.tsx: 1 tests; passed
src/components/__tests__/card.test.tsx: 7 tests; passed
src/utils/reminder-dates.test.ts: 20 tests; passed
src/api/__tests__/alerts.test.ts: 28 tests; passed
src/app/__tests__/detail-stack.test.tsx: 18 tests; passed
src/screens/home/format.test.ts: 13 tests; passed
src/api/__tests__/reminders.test.ts: 27 tests; passed
src/utils/theme-preference.test.ts: 8 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/__tests__/hero-header-amendments.test.ts: 3 tests; passed
src/utils/date-picker-value.test.ts: 12 tests; passed
src/utils/device-connectivity.test.ts: 13 tests; passed
src/api/__tests__/pets.test.ts: 36 tests; passed
src/utils/zoom-for-radius.test.ts: 8 tests; passed
src/api/__tests__/devices.test.ts: 27 tests; passed
src/api/__tests__/users.test.ts: 8 tests; passed
```

Commit: `be75a850` — feat(mobile): make the forgot email editable and gate submit on it (#117 R4)

## T5-rojo

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-T5-rojo.json > /tmp/117-T5-rojo.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/forgot/index.test.tsx (8.03 s)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 7 passed, 9 total
Snapshots:   0 total
Time:        8.191 s
exit=1
src/screens/forgot/index.test.tsx: 9 tests; failed

#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición
Error: expect(instance).toBeDisabled()

Received instance is not disabled:
  <View
    accessibilityRole="button"
    accessibilityState={
      {
        "disabled": false,
      }
    }
    accessible={true}
    testID="forgot-submit"
  />

#117 R5: enviar pasa la pantalla a «Revisa tu correo» tras ok muestra cabecera y cuerpo con el correo, forgot-resend y link-login, y retira forgot-email y forgot-submit
Error: Unable to find an element with text: Revisa tu correo
    at Object.findByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:161:25)
```

Commit: `c243a37c` — test(mobile): lock the check-your-email state after sending (#117 R5)

## T5-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts --json --outputFile /tmp/117-T5-verde.json > /tmp/117-T5-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/forgot/index.test.tsx (7.533 s)
Test Suites: 6 passed, 6 total
Tests:       202 passed, 202 total
Snapshots:   0 total
Time:        8.085 s, estimated 9 s
exit=0
src/__tests__/design-drift.test.ts: 59 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/screens/forgot/index.test.tsx: 9 tests; passed
```

### Notas operativas de T3 y cierre previsto

- El primer staging de T3 incluyó por error un path ya eliminado y staged por git rm; git add devolvió pathspec absent. Se corrigió el staging sin esa ruta (la eliminación ya estaba en el índice). El rojo `0fe5e0fe` contiene exclusivamente la eliminación y tests; el delta -1 del verde se excluyó del rojo y se aplicó después. No se creó commit mixto.
- Tras T3, se enumeraron explícitamente las tres suites de src/app/(auth)/__tests__ con --runTestsByPath: login, register y layout; ninguna forgot. Las nueve suites solicitadas fueron las nueve ejecutadas. Los tres grep de ruta vieja/Platform medidos después dieron 0.
- M3-a se plantará con el árbol inline del stub y sin delegación a ForgotScreen, pero usando forgot.instructions (clave vigente) en vez de la retirada comingSoon. Motivo: useTranslate hace replace sobre el literal; restaurar una clave inexistente produciría TypeError antes de la consulta. La mutación debe caer por forgot-form ausente, según la tabla, y no por una clave inválida.
- `graphify update .` de tasks.md no se ejecutará: el alcance explícito del handoff permite únicamente los 16 ficheros enumerados; no autoriza escribir artefactos del grafo fuera de ellos. No afecta al producto ni a los tests.

## T5-global-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/heroui-smoke.test.tsx src/__tests__/hosting-artifacts.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/api/__tests__/activity.test.ts src/api/__tests__/alerts.test.ts src/api/__tests__/auth.test.ts src/api/__tests__/devices.test.ts src/api/__tests__/geofences.test.ts src/api/__tests__/health-records.test.ts src/api/__tests__/media.test.ts src/api/__tests__/nutrition.test.ts src/api/__tests__/pets.test.ts src/api/__tests__/positions.test.ts src/api/__tests__/push-tokens.test.ts src/api/__tests__/query-keys.test.ts src/api/__tests__/reminders.test.ts src/api/__tests__/subscriptions.test.ts src/api/__tests__/trips.test.ts src/api/__tests__/users.test.ts 'src/app/(auth)/__tests__/layout.test.tsx' 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' 'src/app/(tabs)/__tests__/alerts.test.tsx' 'src/app/(tabs)/__tests__/food.test.tsx' 'src/app/(tabs)/__tests__/layout.test.tsx' 'src/app/(tabs)/__tests__/profile.test.tsx' 'src/app/(tabs)/__tests__/screens.test.tsx' src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/alert-detail.notification.test.tsx src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/reminders-alerts-stack.notification.test.tsx src/app/__tests__/tabs-layout.test.tsx src/components/__tests__/card.test.tsx src/components/__tests__/floating-tab-bar.test.tsx src/components/__tests__/pet-avatar.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/components/__tests__/pet-map.test.tsx src/components/__tests__/pet-switcher.test.tsx src/components/__tests__/weight-chart.test.tsx src/hooks/use-pet-selection.test.tsx src/hooks/use-push-registration.navigation.test.tsx src/hooks/use-push-registration.test.tsx src/providers/__tests__/auth-provider.test.tsx src/providers/__tests__/language-provider.test.tsx src/providers/__tests__/query-provider.test.tsx src/providers/__tests__/selected-pet-provider.test.tsx src/screens/add-pet/index.test.tsx src/screens/add-reminder/index.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/screens/docs/index.test.tsx src/screens/forgot/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/screens/health/index.test.tsx src/screens/home/format.test.ts src/screens/home/index.test.tsx src/screens/home/weekly-activity-chart.test.tsx src/screens/map/index.test.tsx src/screens/meal-schedule/index.test.tsx src/screens/meals-history/index.test.tsx src/screens/pairing/index.test.tsx src/screens/profile/index.test.tsx src/screens/reminders/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/weight-log/index.test.tsx src/theme/__tests__/font-registration.test.ts src/theme/__tests__/global-css.test.ts src/theme/__tests__/theme-transition.degraded.test.tsx src/theme/__tests__/theme-transition.test.tsx src/theme/__tests__/use-theme-colors.test.tsx src/utils/__tests__/category-palette.test.ts src/utils/__tests__/month-grid.test.ts src/utils/civil-today-iso.test.ts src/utils/date-picker-value.test.ts src/utils/device-connectivity.test.ts src/utils/language-preference.test.ts src/utils/reminder-dates.test.ts src/utils/theme-preference.test.ts src/utils/zoom-for-radius.test.ts --json --outputFile /tmp/117-T5-global-verde.json > /tmp/117-T5-global-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/profile/index.test.tsx (8.206 s)
PASS src/screens/forgot/index.test.tsx
PASS src/screens/meal-schedule/index.test.tsx (5.429 s)
PASS src/screens/home/index.test.tsx (17.576 s)
PASS src/screens/geofence-editor/index.test.tsx
PASS src/app/(tabs)/__tests__/food.test.tsx
PASS src/screens/map/index.test.tsx
PASS src/app/(auth)/__tests__/register.test.tsx
PASS src/screens/pairing/index.test.tsx (5.247 s)
PASS src/app/__tests__/alert-detail.notification.test.tsx
PASS src/screens/geofences/index.test.tsx
PASS src/screens/alerts/index.test.tsx
PASS src/screens/reminders/index.test.tsx
PASS src/screens/health/index.test.tsx
PASS src/screens/alert-detail/index.test.tsx
PASS src/screens/home/weekly-activity-chart.test.tsx
PASS src/screens/meals-history/index.test.tsx
PASS src/screens/weight-log/index.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/screens/add-reminder/index.test.tsx
PASS src/app/__tests__/detail-stack.navigation.test.tsx
PASS src/screens/add-pet/index.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/screens/reset-password/index.test.tsx
PASS src/app/__tests__/alert-detail.navigation.test.tsx
PASS src/components/__tests__/floating-tab-bar.test.tsx
PASS src/app/(tabs)/__tests__/layout.test.tsx
PASS src/screens/docs/index.test.tsx
PASS src/app/(tabs)/__tests__/screens.test.tsx
PASS src/app/__tests__/tabs-layout.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
PASS src/app/(auth)/__tests__/login.test.tsx
PASS src/hooks/use-push-registration.navigation.test.tsx
PASS src/components/__tests__/pet-hero-header.test.tsx
PASS src/app/__tests__/detail-stack.guard.test.tsx
PASS src/__tests__/heroui-smoke.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.notification.test.tsx
PASS src/theme/__tests__/font-registration.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/components/__tests__/weight-chart.test.tsx
PASS src/components/__tests__/pet-avatar.test.tsx
PASS src/components/__tests__/pet-switcher.test.tsx
PASS src/theme/__tests__/theme-transition.test.tsx
PASS src/providers/__tests__/query-provider.test.tsx
PASS src/hooks/use-push-registration.test.tsx
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/screens/home/format.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/api/__tests__/nutrition.test.ts
PASS src/api/__tests__/query-keys.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/providers/__tests__/auth-provider.test.tsx
PASS src/api/__tests__/push-tokens.test.ts
PASS src/app/__tests__/index.test.tsx
PASS src/app/__tests__/detail-stack.test.tsx
PASS src/api/__tests__/health-records.test.ts
PASS src/hooks/use-pet-selection.test.tsx
PASS src/components/__tests__/card.test.tsx
PASS src/app/(auth)/__tests__/layout.test.tsx
PASS src/app/(tabs)/__tests__/alerts.test.tsx
PASS src/api/__tests__/subscriptions.test.ts
PASS src/providers/__tests__/selected-pet-provider.test.tsx
PASS src/app/(tabs)/__tests__/profile.test.tsx
PASS src/api/__tests__/geofences.test.ts
PASS src/theme/__tests__/use-theme-colors.test.tsx
PASS src/theme/__tests__/global-css.test.ts
PASS src/components/__tests__/pet-map.test.tsx
PASS src/utils/language-preference.test.ts
PASS src/utils/__tests__/month-grid.test.ts
PASS src/api/__tests__/reminders.test.ts
PASS src/utils/reminder-dates.test.ts
PASS src/api/__tests__/positions.test.ts
PASS src/api/__tests__/devices.test.ts
PASS src/utils/zoom-for-radius.test.ts
PASS src/api/__tests__/activity.test.ts
PASS src/api/__tests__/auth.test.ts
PASS src/utils/civil-today-iso.test.ts
PASS src/api/__tests__/trips.test.ts
PASS src/utils/theme-preference.test.ts
PASS src/utils/__tests__/category-palette.test.ts
PASS src/theme/__tests__/theme-transition.degraded.test.tsx
PASS src/__tests__/hosting-artifacts.test.ts
PASS src/api/__tests__/pets.test.ts
PASS src/api/__tests__/media.test.ts
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/api/__tests__/users.test.ts
PASS src/api/__tests__/alerts.test.ts
PASS src/utils/device-connectivity.test.ts
PASS src/utils/date-picker-value.test.ts
Test Suites: 89 passed, 89 total
Tests:       1989 passed, 1989 total
Snapshots:   1 passed, 1 total
Time:        64.286 s, estimated 70 s
exit=0
src/screens/profile/index.test.tsx: 39 tests; passed
src/screens/forgot/index.test.tsx: 9 tests; passed
src/screens/meal-schedule/index.test.tsx: 59 tests; passed
src/screens/home/index.test.tsx: 169 tests; passed
src/screens/geofence-editor/index.test.tsx: 68 tests; passed
src/app/(tabs)/__tests__/food.test.tsx: 57 tests; passed
src/screens/map/index.test.tsx: 64 tests; passed
src/app/(auth)/__tests__/register.test.tsx: 13 tests; passed
src/screens/pairing/index.test.tsx: 54 tests; passed
src/app/__tests__/alert-detail.notification.test.tsx: 1 tests; passed
src/screens/geofences/index.test.tsx: 49 tests; passed
src/screens/alerts/index.test.tsx: 36 tests; passed
src/screens/reminders/index.test.tsx: 31 tests; passed
src/screens/health/index.test.tsx: 29 tests; passed
src/screens/alert-detail/index.test.tsx: 25 tests; passed
src/screens/home/weekly-activity-chart.test.tsx: 60 tests; passed
src/screens/meals-history/index.test.tsx: 28 tests; passed
src/screens/weight-log/index.test.tsx: 33 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/screens/add-reminder/index.test.tsx: 41 tests; passed
src/app/__tests__/detail-stack.navigation.test.tsx: 2 tests; passed
src/screens/add-pet/index.test.tsx: 26 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/screens/reset-password/index.test.tsx: 19 tests; passed
src/app/__tests__/alert-detail.navigation.test.tsx: 1 tests; passed
src/components/__tests__/floating-tab-bar.test.tsx: 18 tests; passed
src/app/(tabs)/__tests__/layout.test.tsx: 5 tests; passed
src/screens/docs/index.test.tsx: 13 tests; passed
src/app/(tabs)/__tests__/screens.test.tsx: 2 tests; passed
src/app/__tests__/tabs-layout.test.tsx: 1 tests; passed
src/app/__tests__/reminders-alerts-stack.navigation.test.tsx: 1 tests; passed
src/app/(auth)/__tests__/login.test.tsx: 11 tests; passed
src/hooks/use-push-registration.navigation.test.tsx: 1 tests; passed
src/components/__tests__/pet-hero-header.test.tsx: 37 tests; passed
src/app/__tests__/detail-stack.guard.test.tsx: 2 tests; passed
src/__tests__/heroui-smoke.test.tsx: 1 tests; passed
src/app/__tests__/reminders-alerts-stack.notification.test.tsx: 1 tests; passed
src/theme/__tests__/font-registration.test.ts: 3 tests; passed
src/app/__tests__/layout.test.tsx: 25 tests; passed
src/components/__tests__/weight-chart.test.tsx: 4 tests; passed
src/components/__tests__/pet-avatar.test.tsx: 8 tests; passed
src/components/__tests__/pet-switcher.test.tsx: 1 tests; passed
src/theme/__tests__/theme-transition.test.tsx: 6 tests; passed
src/providers/__tests__/query-provider.test.tsx: 11 tests; passed
src/hooks/use-push-registration.test.tsx: 53 tests; passed
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/screens/home/format.test.ts: 13 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/api/__tests__/nutrition.test.ts: 71 tests; passed
src/api/__tests__/query-keys.test.ts: 22 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/providers/__tests__/auth-provider.test.tsx: 8 tests; passed
src/api/__tests__/push-tokens.test.ts: 10 tests; passed
src/app/__tests__/index.test.tsx: 3 tests; passed
src/app/__tests__/detail-stack.test.tsx: 18 tests; passed
src/api/__tests__/health-records.test.ts: 33 tests; passed
src/hooks/use-pet-selection.test.tsx: 7 tests; passed
src/components/__tests__/card.test.tsx: 7 tests; passed
src/app/(auth)/__tests__/layout.test.tsx: 3 tests; passed
src/app/(tabs)/__tests__/alerts.test.tsx: 3 tests; passed
src/api/__tests__/subscriptions.test.ts: 10 tests; passed
src/providers/__tests__/selected-pet-provider.test.tsx: 3 tests; passed
src/app/(tabs)/__tests__/profile.test.tsx: 1 tests; passed
src/api/__tests__/geofences.test.ts: 63 tests; passed
src/theme/__tests__/use-theme-colors.test.tsx: 1 tests; passed
src/theme/__tests__/global-css.test.ts: 51 tests; passed
src/components/__tests__/pet-map.test.tsx: 16 tests; passed
src/utils/language-preference.test.ts: 8 tests; passed
src/utils/__tests__/month-grid.test.ts: 12 tests; passed
src/api/__tests__/reminders.test.ts: 27 tests; passed
src/utils/reminder-dates.test.ts: 20 tests; passed
src/api/__tests__/positions.test.ts: 22 tests; passed
src/api/__tests__/devices.test.ts: 27 tests; passed
src/utils/zoom-for-radius.test.ts: 8 tests; passed
src/api/__tests__/activity.test.ts: 9 tests; passed
src/api/__tests__/auth.test.ts: 37 tests; passed
src/utils/civil-today-iso.test.ts: 6 tests; passed
src/api/__tests__/trips.test.ts: 17 tests; passed
src/utils/theme-preference.test.ts: 8 tests; passed
src/utils/__tests__/category-palette.test.ts: 12 tests; passed
src/theme/__tests__/theme-transition.degraded.test.tsx: 1 tests; passed
src/__tests__/hosting-artifacts.test.ts: 7 tests; passed
src/api/__tests__/pets.test.ts: 36 tests; passed
src/api/__tests__/media.test.ts: 15 tests; passed
src/__tests__/hero-header-amendments.test.ts: 3 tests; passed
src/api/__tests__/users.test.ts: 8 tests; passed
src/api/__tests__/alerts.test.ts: 28 tests; passed
src/utils/device-connectivity.test.ts: 13 tests; passed
src/utils/date-picker-value.test.ts: 12 tests; passed
```

Commit: `9e4c8378` — feat(mobile): request the recovery link and switch to check your email (#117 R5)

## T6-rojo

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-T6-rojo.json > /tmp/117-T6-rojo.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/forgot/index.test.tsx (11.674 s)
Test Suites: 1 failed, 1 total
Tests:       6 failed, 9 passed, 15 total
Snapshots:   0 total
Time:        11.833 s
exit=1
src/screens/forgot/index.test.tsx: 15 tests; failed

#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie
Error: Unable to find an element with testID: forgot-error
    at findByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:184:32)

#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie
Error: Unable to find an element with testID: forgot-error
    at findByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:184:32)

#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie
Error: Unable to find an element with testID: forgot-error
    at findByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:184:32)

#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie
Error: Unable to find an element with testID: forgot-error
    at findByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:184:32)

#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie
Error: Unable to find an element with testID: forgot-error
    at findByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:184:32)

#117 R7: cada kind distinto de ok pinta su copy en forgot-error un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»
Error: Unable to find an element with testID: forgot-error
    at Object.findByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:25)
```

Commit: `d05462f1` — test(mobile): lock the forgot error copy for every non-ok kind (#117 R7)

## T6-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts --json --outputFile /tmp/117-T6-verde.json > /tmp/117-T6-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/ui-language.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/forgot/index.test.tsx (6.401 s)
Test Suites: 6 passed, 6 total
Tests:       208 passed, 208 total
Snapshots:   0 total
Time:        7.059 s, estimated 12 s
exit=0
src/__tests__/ui-language.test.ts: 29 tests; passed
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/screens/forgot/index.test.tsx: 15 tests; passed
```

## T6-global-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/heroui-smoke.test.tsx src/__tests__/hosting-artifacts.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/api/__tests__/activity.test.ts src/api/__tests__/alerts.test.ts src/api/__tests__/auth.test.ts src/api/__tests__/devices.test.ts src/api/__tests__/geofences.test.ts src/api/__tests__/health-records.test.ts src/api/__tests__/media.test.ts src/api/__tests__/nutrition.test.ts src/api/__tests__/pets.test.ts src/api/__tests__/positions.test.ts src/api/__tests__/push-tokens.test.ts src/api/__tests__/query-keys.test.ts src/api/__tests__/reminders.test.ts src/api/__tests__/subscriptions.test.ts src/api/__tests__/trips.test.ts src/api/__tests__/users.test.ts 'src/app/(auth)/__tests__/layout.test.tsx' 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' 'src/app/(tabs)/__tests__/alerts.test.tsx' 'src/app/(tabs)/__tests__/food.test.tsx' 'src/app/(tabs)/__tests__/layout.test.tsx' 'src/app/(tabs)/__tests__/profile.test.tsx' 'src/app/(tabs)/__tests__/screens.test.tsx' src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/alert-detail.notification.test.tsx src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/reminders-alerts-stack.notification.test.tsx src/app/__tests__/tabs-layout.test.tsx src/components/__tests__/card.test.tsx src/components/__tests__/floating-tab-bar.test.tsx src/components/__tests__/pet-avatar.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/components/__tests__/pet-map.test.tsx src/components/__tests__/pet-switcher.test.tsx src/components/__tests__/weight-chart.test.tsx src/hooks/use-pet-selection.test.tsx src/hooks/use-push-registration.navigation.test.tsx src/hooks/use-push-registration.test.tsx src/providers/__tests__/auth-provider.test.tsx src/providers/__tests__/language-provider.test.tsx src/providers/__tests__/query-provider.test.tsx src/providers/__tests__/selected-pet-provider.test.tsx src/screens/add-pet/index.test.tsx src/screens/add-reminder/index.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/screens/docs/index.test.tsx src/screens/forgot/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/screens/health/index.test.tsx src/screens/home/format.test.ts src/screens/home/index.test.tsx src/screens/home/weekly-activity-chart.test.tsx src/screens/map/index.test.tsx src/screens/meal-schedule/index.test.tsx src/screens/meals-history/index.test.tsx src/screens/pairing/index.test.tsx src/screens/profile/index.test.tsx src/screens/reminders/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/weight-log/index.test.tsx src/theme/__tests__/font-registration.test.ts src/theme/__tests__/global-css.test.ts src/theme/__tests__/theme-transition.degraded.test.tsx src/theme/__tests__/theme-transition.test.tsx src/theme/__tests__/use-theme-colors.test.tsx src/utils/__tests__/category-palette.test.ts src/utils/__tests__/month-grid.test.ts src/utils/civil-today-iso.test.ts src/utils/date-picker-value.test.ts src/utils/device-connectivity.test.ts src/utils/language-preference.test.ts src/utils/reminder-dates.test.ts src/utils/theme-preference.test.ts src/utils/zoom-for-radius.test.ts --json --outputFile /tmp/117-T6-global-verde.json > /tmp/117-T6-global-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/profile/index.test.tsx (9.476 s)
PASS src/screens/forgot/index.test.tsx
PASS src/screens/meal-schedule/index.test.tsx (5.909 s)
PASS src/screens/home/index.test.tsx (19.2 s)
PASS src/screens/pairing/index.test.tsx
PASS src/screens/geofence-editor/index.test.tsx (5.509 s)
PASS src/screens/map/index.test.tsx (5.096 s)
PASS src/app/(tabs)/__tests__/food.test.tsx (5.986 s)
PASS src/screens/geofences/index.test.tsx
PASS src/screens/reminders/index.test.tsx
PASS src/screens/alerts/index.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/screens/home/weekly-activity-chart.test.tsx
PASS src/screens/add-reminder/index.test.tsx
PASS src/screens/weight-log/index.test.tsx
PASS src/app/(auth)/__tests__/register.test.tsx
PASS src/screens/health/index.test.tsx
PASS src/screens/alert-detail/index.test.tsx
PASS src/screens/meals-history/index.test.tsx
PASS src/screens/add-pet/index.test.tsx
PASS src/app/__tests__/alert-detail.notification.test.tsx
PASS src/app/(tabs)/__tests__/screens.test.tsx
PASS src/screens/docs/index.test.tsx
PASS src/hooks/use-push-registration.navigation.test.tsx
PASS src/components/__tests__/floating-tab-bar.test.tsx
PASS src/app/__tests__/tabs-layout.test.tsx
PASS src/app/(tabs)/__tests__/layout.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
PASS src/app/__tests__/detail-stack.navigation.test.tsx
PASS src/components/__tests__/pet-switcher.test.tsx
PASS src/screens/reset-password/index.test.tsx
PASS src/app/(auth)/__tests__/login.test.tsx
PASS src/app/__tests__/alert-detail.navigation.test.tsx
PASS src/components/__tests__/pet-hero-header.test.tsx
PASS src/app/__tests__/detail-stack.guard.test.tsx
PASS src/hooks/use-push-registration.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.notification.test.tsx
PASS src/components/__tests__/pet-avatar.test.tsx
PASS src/api/__tests__/positions.test.ts
PASS src/utils/language-preference.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/__tests__/heroui-smoke.test.tsx
PASS src/components/__tests__/weight-chart.test.tsx
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/providers/__tests__/query-provider.test.tsx
PASS src/components/__tests__/pet-map.test.tsx
PASS src/theme/__tests__/theme-transition.test.tsx
PASS src/providers/__tests__/auth-provider.test.tsx
PASS src/utils/__tests__/month-grid.test.ts
PASS src/utils/reminder-dates.test.ts
PASS src/app/__tests__/index.test.tsx
PASS src/__tests__/legibility-classnames.test.ts
PASS src/app/(tabs)/__tests__/alerts.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/app/(auth)/__tests__/layout.test.tsx
PASS src/app/(tabs)/__tests__/profile.test.tsx
PASS src/components/__tests__/card.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/api/__tests__/pets.test.ts
PASS src/theme/__tests__/global-css.test.ts
PASS src/hooks/use-pet-selection.test.tsx
PASS src/utils/device-connectivity.test.ts
PASS src/providers/__tests__/selected-pet-provider.test.tsx
PASS src/api/__tests__/trips.test.ts
PASS src/api/__tests__/geofences.test.ts
PASS src/theme/__tests__/use-theme-colors.test.tsx
PASS src/theme/__tests__/theme-transition.degraded.test.tsx
PASS src/api/__tests__/auth.test.ts
PASS src/api/__tests__/users.test.ts
PASS src/screens/home/format.test.ts
PASS src/__tests__/hosting-artifacts.test.ts
PASS src/utils/zoom-for-radius.test.ts
PASS src/api/__tests__/health-records.test.ts
PASS src/api/__tests__/query-keys.test.ts
PASS src/api/__tests__/nutrition.test.ts
PASS src/theme/__tests__/font-registration.test.ts
PASS src/app/__tests__/detail-stack.test.tsx
PASS src/utils/theme-preference.test.ts
PASS src/utils/__tests__/category-palette.test.ts
PASS src/api/__tests__/devices.test.ts
PASS src/api/__tests__/push-tokens.test.ts
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/api/__tests__/alerts.test.ts
PASS src/utils/date-picker-value.test.ts
PASS src/api/__tests__/reminders.test.ts
PASS src/api/__tests__/subscriptions.test.ts
PASS src/api/__tests__/media.test.ts
PASS src/utils/civil-today-iso.test.ts
PASS src/api/__tests__/activity.test.ts
Test Suites: 89 passed, 89 total
Tests:       1995 passed, 1995 total
Snapshots:   1 passed, 1 total
Time:        61.628 s, estimated 64 s
exit=0
src/screens/profile/index.test.tsx: 39 tests; passed
src/screens/forgot/index.test.tsx: 15 tests; passed
src/screens/meal-schedule/index.test.tsx: 59 tests; passed
src/screens/home/index.test.tsx: 169 tests; passed
src/screens/pairing/index.test.tsx: 54 tests; passed
src/screens/geofence-editor/index.test.tsx: 68 tests; passed
src/screens/map/index.test.tsx: 64 tests; passed
src/app/(tabs)/__tests__/food.test.tsx: 57 tests; passed
src/screens/geofences/index.test.tsx: 49 tests; passed
src/screens/reminders/index.test.tsx: 31 tests; passed
src/screens/alerts/index.test.tsx: 36 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/screens/home/weekly-activity-chart.test.tsx: 60 tests; passed
src/screens/add-reminder/index.test.tsx: 41 tests; passed
src/screens/weight-log/index.test.tsx: 33 tests; passed
src/app/(auth)/__tests__/register.test.tsx: 13 tests; passed
src/screens/health/index.test.tsx: 29 tests; passed
src/screens/alert-detail/index.test.tsx: 25 tests; passed
src/screens/meals-history/index.test.tsx: 28 tests; passed
src/screens/add-pet/index.test.tsx: 26 tests; passed
src/app/__tests__/alert-detail.notification.test.tsx: 1 tests; passed
src/app/(tabs)/__tests__/screens.test.tsx: 2 tests; passed
src/screens/docs/index.test.tsx: 13 tests; passed
src/hooks/use-push-registration.navigation.test.tsx: 1 tests; passed
src/components/__tests__/floating-tab-bar.test.tsx: 18 tests; passed
src/app/__tests__/tabs-layout.test.tsx: 1 tests; passed
src/app/(tabs)/__tests__/layout.test.tsx: 5 tests; passed
src/app/__tests__/reminders-alerts-stack.navigation.test.tsx: 1 tests; passed
src/app/__tests__/detail-stack.navigation.test.tsx: 2 tests; passed
src/components/__tests__/pet-switcher.test.tsx: 1 tests; passed
src/screens/reset-password/index.test.tsx: 19 tests; passed
src/app/(auth)/__tests__/login.test.tsx: 11 tests; passed
src/app/__tests__/alert-detail.navigation.test.tsx: 1 tests; passed
src/components/__tests__/pet-hero-header.test.tsx: 37 tests; passed
src/app/__tests__/detail-stack.guard.test.tsx: 2 tests; passed
src/hooks/use-push-registration.test.tsx: 53 tests; passed
src/app/__tests__/reminders-alerts-stack.notification.test.tsx: 1 tests; passed
src/components/__tests__/pet-avatar.test.tsx: 8 tests; passed
src/api/__tests__/positions.test.ts: 22 tests; passed
src/utils/language-preference.test.ts: 8 tests; passed
src/app/__tests__/layout.test.tsx: 25 tests; passed
src/__tests__/heroui-smoke.test.tsx: 1 tests; passed
src/components/__tests__/weight-chart.test.tsx: 4 tests; passed
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/providers/__tests__/query-provider.test.tsx: 11 tests; passed
src/components/__tests__/pet-map.test.tsx: 16 tests; passed
src/theme/__tests__/theme-transition.test.tsx: 6 tests; passed
src/providers/__tests__/auth-provider.test.tsx: 8 tests; passed
src/utils/__tests__/month-grid.test.ts: 12 tests; passed
src/utils/reminder-dates.test.ts: 20 tests; passed
src/app/__tests__/index.test.tsx: 3 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/app/(tabs)/__tests__/alerts.test.tsx: 3 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/app/(auth)/__tests__/layout.test.tsx: 3 tests; passed
src/app/(tabs)/__tests__/profile.test.tsx: 1 tests; passed
src/components/__tests__/card.test.tsx: 7 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/api/__tests__/pets.test.ts: 36 tests; passed
src/theme/__tests__/global-css.test.ts: 51 tests; passed
src/hooks/use-pet-selection.test.tsx: 7 tests; passed
src/utils/device-connectivity.test.ts: 13 tests; passed
src/providers/__tests__/selected-pet-provider.test.tsx: 3 tests; passed
src/api/__tests__/trips.test.ts: 17 tests; passed
src/api/__tests__/geofences.test.ts: 63 tests; passed
src/theme/__tests__/use-theme-colors.test.tsx: 1 tests; passed
src/theme/__tests__/theme-transition.degraded.test.tsx: 1 tests; passed
src/api/__tests__/auth.test.ts: 37 tests; passed
src/api/__tests__/users.test.ts: 8 tests; passed
src/screens/home/format.test.ts: 13 tests; passed
src/__tests__/hosting-artifacts.test.ts: 7 tests; passed
src/utils/zoom-for-radius.test.ts: 8 tests; passed
src/api/__tests__/health-records.test.ts: 33 tests; passed
src/api/__tests__/query-keys.test.ts: 22 tests; passed
src/api/__tests__/nutrition.test.ts: 71 tests; passed
src/theme/__tests__/font-registration.test.ts: 3 tests; passed
src/app/__tests__/detail-stack.test.tsx: 18 tests; passed
src/utils/theme-preference.test.ts: 8 tests; passed
src/utils/__tests__/category-palette.test.ts: 12 tests; passed
src/api/__tests__/devices.test.ts: 27 tests; passed
src/api/__tests__/push-tokens.test.ts: 10 tests; passed
src/__tests__/hero-header-amendments.test.ts: 3 tests; passed
src/api/__tests__/alerts.test.ts: 28 tests; passed
src/utils/date-picker-value.test.ts: 12 tests; passed
src/api/__tests__/reminders.test.ts: 27 tests; passed
src/api/__tests__/subscriptions.test.ts: 10 tests; passed
src/api/__tests__/media.test.ts: 15 tests; passed
src/utils/civil-today-iso.test.ts: 6 tests; passed
src/api/__tests__/activity.test.ts: 9 tests; passed
```

Commit: `4390db9c` — feat(mobile): map every non-ok kind to its forgot error copy (#117 R7)

## T7-rojo

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-T7-rojo.json > /tmp/117-T7-rojo.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/forgot/index.test.tsx (7.463 s)
Test Suites: 1 failed, 1 total
Tests:       2 failed, 15 passed, 17 total
Snapshots:   0 total
Time:        7.611 s
exit=1
src/screens/forgot/index.test.tsx: 17 tests; failed

#117 R6: reenviar repite la misma petición forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela
Error: expect(instance).toBeDisabled()

Received instance is not disabled:
  <View
    accessibilityRole="button"
    accessibilityState={
      {
        "disabled": false,
      }
    }
    accessible={true}
    testID="forgot-resend"
  />

#117 R6: reenviar repite la misma petición un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»
Error: Unable to find an element with testID: forgot-error
    at Object.findByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:231:25)
```

Commit: `92adb028` — test(mobile): lock resend from check your email (#117 R6)

## T7-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts --json --outputFile /tmp/117-T7-verde.json > /tmp/117-T7-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/ui-language.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/screens/forgot/index.test.tsx (6.011 s)
Test Suites: 6 passed, 6 total
Tests:       210 passed, 210 total
Snapshots:   0 total
Time:        6.591 s, estimated 8 s
exit=0
src/__tests__/ui-language.test.ts: 29 tests; passed
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/screens/forgot/index.test.tsx: 17 tests; passed
```

## T7-global-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/heroui-smoke.test.tsx src/__tests__/hosting-artifacts.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/api/__tests__/activity.test.ts src/api/__tests__/alerts.test.ts src/api/__tests__/auth.test.ts src/api/__tests__/devices.test.ts src/api/__tests__/geofences.test.ts src/api/__tests__/health-records.test.ts src/api/__tests__/media.test.ts src/api/__tests__/nutrition.test.ts src/api/__tests__/pets.test.ts src/api/__tests__/positions.test.ts src/api/__tests__/push-tokens.test.ts src/api/__tests__/query-keys.test.ts src/api/__tests__/reminders.test.ts src/api/__tests__/subscriptions.test.ts src/api/__tests__/trips.test.ts src/api/__tests__/users.test.ts 'src/app/(auth)/__tests__/layout.test.tsx' 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' 'src/app/(tabs)/__tests__/alerts.test.tsx' 'src/app/(tabs)/__tests__/food.test.tsx' 'src/app/(tabs)/__tests__/layout.test.tsx' 'src/app/(tabs)/__tests__/profile.test.tsx' 'src/app/(tabs)/__tests__/screens.test.tsx' src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/alert-detail.notification.test.tsx src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/reminders-alerts-stack.notification.test.tsx src/app/__tests__/tabs-layout.test.tsx src/components/__tests__/card.test.tsx src/components/__tests__/floating-tab-bar.test.tsx src/components/__tests__/pet-avatar.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/components/__tests__/pet-map.test.tsx src/components/__tests__/pet-switcher.test.tsx src/components/__tests__/weight-chart.test.tsx src/hooks/use-pet-selection.test.tsx src/hooks/use-push-registration.navigation.test.tsx src/hooks/use-push-registration.test.tsx src/providers/__tests__/auth-provider.test.tsx src/providers/__tests__/language-provider.test.tsx src/providers/__tests__/query-provider.test.tsx src/providers/__tests__/selected-pet-provider.test.tsx src/screens/add-pet/index.test.tsx src/screens/add-reminder/index.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/screens/docs/index.test.tsx src/screens/forgot/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/screens/health/index.test.tsx src/screens/home/format.test.ts src/screens/home/index.test.tsx src/screens/home/weekly-activity-chart.test.tsx src/screens/map/index.test.tsx src/screens/meal-schedule/index.test.tsx src/screens/meals-history/index.test.tsx src/screens/pairing/index.test.tsx src/screens/profile/index.test.tsx src/screens/reminders/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/weight-log/index.test.tsx src/theme/__tests__/font-registration.test.ts src/theme/__tests__/global-css.test.ts src/theme/__tests__/theme-transition.degraded.test.tsx src/theme/__tests__/theme-transition.test.tsx src/theme/__tests__/use-theme-colors.test.tsx src/utils/__tests__/category-palette.test.ts src/utils/__tests__/month-grid.test.ts src/utils/civil-today-iso.test.ts src/utils/date-picker-value.test.ts src/utils/device-connectivity.test.ts src/utils/language-preference.test.ts src/utils/reminder-dates.test.ts src/utils/theme-preference.test.ts src/utils/zoom-for-radius.test.ts --json --outputFile /tmp/117-T7-global-verde.json > /tmp/117-T7-global-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/profile/index.test.tsx (7.675 s)
PASS src/screens/forgot/index.test.tsx
PASS src/app/(tabs)/__tests__/food.test.tsx
PASS src/screens/home/index.test.tsx (16.7 s)
PASS src/screens/meal-schedule/index.test.tsx (6.017 s)
PASS src/screens/geofence-editor/index.test.tsx (5.48 s)
PASS src/screens/map/index.test.tsx
PASS src/screens/pairing/index.test.tsx
PASS src/screens/geofences/index.test.tsx
PASS src/screens/alerts/index.test.tsx
PASS src/screens/reminders/index.test.tsx
PASS src/screens/health/index.test.tsx
PASS src/screens/home/weekly-activity-chart.test.tsx
PASS src/screens/weight-log/index.test.tsx
PASS src/screens/alert-detail/index.test.tsx
PASS src/screens/add-reminder/index.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/screens/meals-history/index.test.tsx
PASS src/app/(auth)/__tests__/register.test.tsx
PASS src/screens/add-pet/index.test.tsx
PASS src/app/__tests__/alert-detail.notification.test.tsx
PASS src/screens/docs/index.test.tsx
PASS src/app/__tests__/alert-detail.navigation.test.tsx
PASS src/hooks/use-push-registration.navigation.test.tsx
PASS src/app/(tabs)/__tests__/screens.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
PASS src/components/__tests__/floating-tab-bar.test.tsx
PASS src/app/(tabs)/__tests__/layout.test.tsx
PASS src/app/(auth)/__tests__/login.test.tsx
PASS src/screens/reset-password/index.test.tsx
PASS src/app/__tests__/detail-stack.navigation.test.tsx
PASS src/app/__tests__/tabs-layout.test.tsx
PASS src/components/__tests__/pet-hero-header.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.notification.test.tsx
PASS src/app/__tests__/detail-stack.guard.test.tsx
PASS src/app/__tests__/index.test.tsx
PASS src/api/__tests__/auth.test.ts
PASS src/components/__tests__/weight-chart.test.tsx
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/utils/__tests__/category-palette.test.ts
PASS src/components/__tests__/pet-avatar.test.tsx
PASS src/app/__tests__/layout.test.tsx
PASS src/__tests__/heroui-smoke.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/components/__tests__/pet-switcher.test.tsx
PASS src/hooks/use-push-registration.test.tsx
PASS src/providers/__tests__/query-provider.test.tsx
PASS src/providers/__tests__/auth-provider.test.tsx
PASS src/utils/theme-preference.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/theme/__tests__/use-theme-colors.test.tsx
PASS src/theme/__tests__/theme-transition.degraded.test.tsx
PASS src/api/__tests__/reminders.test.ts
PASS src/api/__tests__/nutrition.test.ts
PASS src/api/__tests__/activity.test.ts
PASS src/api/__tests__/positions.test.ts
PASS src/utils/reminder-dates.test.ts
PASS src/app/(tabs)/__tests__/alerts.test.tsx
PASS src/api/__tests__/trips.test.ts
PASS src/api/__tests__/users.test.ts
PASS src/components/__tests__/pet-map.test.tsx
PASS src/api/__tests__/geofences.test.ts
PASS src/theme/__tests__/global-css.test.ts
PASS src/api/__tests__/push-tokens.test.ts
PASS src/app/(tabs)/__tests__/profile.test.tsx
PASS src/api/__tests__/devices.test.ts
PASS src/theme/__tests__/theme-transition.test.tsx
PASS src/utils/civil-today-iso.test.ts
PASS src/api/__tests__/health-records.test.ts
PASS src/api/__tests__/subscriptions.test.ts
PASS src/providers/__tests__/selected-pet-provider.test.tsx
PASS src/utils/zoom-for-radius.test.ts
PASS src/app/(auth)/__tests__/layout.test.tsx
PASS src/utils/language-preference.test.ts
PASS src/screens/home/format.test.ts
PASS src/components/__tests__/card.test.tsx
PASS src/api/__tests__/media.test.ts
PASS src/api/__tests__/pets.test.ts
PASS src/hooks/use-pet-selection.test.tsx
PASS src/utils/__tests__/month-grid.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/utils/device-connectivity.test.ts
PASS src/__tests__/hosting-artifacts.test.ts
PASS src/api/__tests__/alerts.test.ts
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/app/__tests__/detail-stack.test.tsx
PASS src/theme/__tests__/font-registration.test.ts
PASS src/api/__tests__/query-keys.test.ts
PASS src/utils/date-picker-value.test.ts
Test Suites: 89 passed, 89 total
Tests:       1997 passed, 1997 total
Snapshots:   1 passed, 1 total
Time:        59.95 s, estimated 61 s
exit=0
src/screens/profile/index.test.tsx: 39 tests; passed
src/screens/forgot/index.test.tsx: 17 tests; passed
src/app/(tabs)/__tests__/food.test.tsx: 57 tests; passed
src/screens/home/index.test.tsx: 169 tests; passed
src/screens/meal-schedule/index.test.tsx: 59 tests; passed
src/screens/geofence-editor/index.test.tsx: 68 tests; passed
src/screens/map/index.test.tsx: 64 tests; passed
src/screens/pairing/index.test.tsx: 54 tests; passed
src/screens/geofences/index.test.tsx: 49 tests; passed
src/screens/alerts/index.test.tsx: 36 tests; passed
src/screens/reminders/index.test.tsx: 31 tests; passed
src/screens/health/index.test.tsx: 29 tests; passed
src/screens/home/weekly-activity-chart.test.tsx: 60 tests; passed
src/screens/weight-log/index.test.tsx: 33 tests; passed
src/screens/alert-detail/index.test.tsx: 25 tests; passed
src/screens/add-reminder/index.test.tsx: 41 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/screens/meals-history/index.test.tsx: 28 tests; passed
src/app/(auth)/__tests__/register.test.tsx: 13 tests; passed
src/screens/add-pet/index.test.tsx: 26 tests; passed
src/app/__tests__/alert-detail.notification.test.tsx: 1 tests; passed
src/screens/docs/index.test.tsx: 13 tests; passed
src/app/__tests__/alert-detail.navigation.test.tsx: 1 tests; passed
src/hooks/use-push-registration.navigation.test.tsx: 1 tests; passed
src/app/(tabs)/__tests__/screens.test.tsx: 2 tests; passed
src/app/__tests__/reminders-alerts-stack.navigation.test.tsx: 1 tests; passed
src/components/__tests__/floating-tab-bar.test.tsx: 18 tests; passed
src/app/(tabs)/__tests__/layout.test.tsx: 5 tests; passed
src/app/(auth)/__tests__/login.test.tsx: 11 tests; passed
src/screens/reset-password/index.test.tsx: 19 tests; passed
src/app/__tests__/detail-stack.navigation.test.tsx: 2 tests; passed
src/app/__tests__/tabs-layout.test.tsx: 1 tests; passed
src/components/__tests__/pet-hero-header.test.tsx: 37 tests; passed
src/app/__tests__/reminders-alerts-stack.notification.test.tsx: 1 tests; passed
src/app/__tests__/detail-stack.guard.test.tsx: 2 tests; passed
src/app/__tests__/index.test.tsx: 3 tests; passed
src/api/__tests__/auth.test.ts: 37 tests; passed
src/components/__tests__/weight-chart.test.tsx: 4 tests; passed
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/utils/__tests__/category-palette.test.ts: 12 tests; passed
src/components/__tests__/pet-avatar.test.tsx: 8 tests; passed
src/app/__tests__/layout.test.tsx: 25 tests; passed
src/__tests__/heroui-smoke.test.tsx: 1 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/components/__tests__/pet-switcher.test.tsx: 1 tests; passed
src/hooks/use-push-registration.test.tsx: 53 tests; passed
src/providers/__tests__/query-provider.test.tsx: 11 tests; passed
src/providers/__tests__/auth-provider.test.tsx: 8 tests; passed
src/utils/theme-preference.test.ts: 8 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/theme/__tests__/use-theme-colors.test.tsx: 1 tests; passed
src/theme/__tests__/theme-transition.degraded.test.tsx: 1 tests; passed
src/api/__tests__/reminders.test.ts: 27 tests; passed
src/api/__tests__/nutrition.test.ts: 71 tests; passed
src/api/__tests__/activity.test.ts: 9 tests; passed
src/api/__tests__/positions.test.ts: 22 tests; passed
src/utils/reminder-dates.test.ts: 20 tests; passed
src/app/(tabs)/__tests__/alerts.test.tsx: 3 tests; passed
src/api/__tests__/trips.test.ts: 17 tests; passed
src/api/__tests__/users.test.ts: 8 tests; passed
src/components/__tests__/pet-map.test.tsx: 16 tests; passed
src/api/__tests__/geofences.test.ts: 63 tests; passed
src/theme/__tests__/global-css.test.ts: 51 tests; passed
src/api/__tests__/push-tokens.test.ts: 10 tests; passed
src/app/(tabs)/__tests__/profile.test.tsx: 1 tests; passed
src/api/__tests__/devices.test.ts: 27 tests; passed
src/theme/__tests__/theme-transition.test.tsx: 6 tests; passed
src/utils/civil-today-iso.test.ts: 6 tests; passed
src/api/__tests__/health-records.test.ts: 33 tests; passed
src/api/__tests__/subscriptions.test.ts: 10 tests; passed
src/providers/__tests__/selected-pet-provider.test.tsx: 3 tests; passed
src/utils/zoom-for-radius.test.ts: 8 tests; passed
src/app/(auth)/__tests__/layout.test.tsx: 3 tests; passed
src/utils/language-preference.test.ts: 8 tests; passed
src/screens/home/format.test.ts: 13 tests; passed
src/components/__tests__/card.test.tsx: 7 tests; passed
src/api/__tests__/media.test.ts: 15 tests; passed
src/api/__tests__/pets.test.ts: 36 tests; passed
src/hooks/use-pet-selection.test.tsx: 7 tests; passed
src/utils/__tests__/month-grid.test.ts: 12 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/utils/device-connectivity.test.ts: 13 tests; passed
src/__tests__/hosting-artifacts.test.ts: 7 tests; passed
src/api/__tests__/alerts.test.ts: 28 tests; passed
src/__tests__/hero-header-amendments.test.ts: 3 tests; passed
src/app/__tests__/detail-stack.test.tsx: 18 tests; passed
src/theme/__tests__/font-registration.test.ts: 3 tests; passed
src/api/__tests__/query-keys.test.ts: 22 tests; passed
src/utils/date-picker-value.test.ts: 12 tests; passed
```

T7 verde: D11 ya estaba implementada en T6 (forgot-error fuera de !sent). Solo se añadió el onPress de resend; no hubo que cambiar árbol, métricas, clases ni candados.

Commit: `f104949c` — feat(mobile): resend the recovery link with the submitted email (#117 R6)

## T8-nace-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-T8-nace-verde.json > /tmp/117-T8-nace-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/forgot/index.test.tsx (5.894 s)
Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        6.047 s
exit=0
src/screens/forgot/index.test.tsx: 18 tests; passed
```

T8 R8 nace verde (KAV, behavior y offset ya quedaron en T3): el commit test es el registro; no se necesita fix. M8-c demostrará que el candado muerde.

Commit: `574c3674` — test(mobile): lock the forgot keyboard avoidance (#117 R8)

Sonda M8-c plantada temporalmente en `mobile-pet-tracker/src/screens/forgot/index.tsx`; sin staging.

## M8-c

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx -t '#117 R8:' --json --outputFile /tmp/117-M8-c.json > /tmp/117-M8-c.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/forgot/index.test.tsx (5.958 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 17 skipped, 18 total
Snapshots:   0 total
Time:        6.101 s
exit=1
src/screens/forgot/index.test.tsx: 18 tests; failed

#117 R8: forgot se aparta del teclado en Android el host screen-forgot añade paddingBottom 200 al abrir el teclado
Error: expect(instance).toHaveStyle()

- Expected
+ Received

- paddingBottom: 200;
+ paddingBottom: 291;
```

M8-c: revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx` (HEAD 574c3674). `git diff -- mobile-pet-tracker/src/screens/forgot/index.tsx`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

## T9-nace-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-T9-nace-verde.json > /tmp/117-T9-nace-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/forgot/index.test.tsx (6.026 s)
Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        6.171 s
exit=0
src/screens/forgot/index.test.tsx: 19 tests; passed
```

T9 R9 nace verde: D10 conserva un solo ScrollView, por lo que las métricas no divergen. No se necesita fix; M9-b demuestra la aserción toEqual ante un segundo scroll sin alignItems.

Commit: `6b663268` — test(mobile): lock the forgot metrics across both states (#117 R9)

Sonda M9-b plantada temporalmente en `mobile-pet-tracker/src/screens/forgot/index.tsx`; sin staging.

## M9-b

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx -t '#117 R9:' --json --outputFile /tmp/117-M9-b.json > /tmp/117-M9-b.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/forgot/index.test.tsx (5.982 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 18 skipped, 19 total
Snapshots:   0 total
Time:        6.169 s, estimated 7 s
exit=1
src/screens/forgot/index.test.tsx: 19 tests; failed

#117 R9: las métricas del stub sobreviven al cambio de estado «Revisa tu correo» conserva el mismo contentContainerStyle y keyboardShouldPersistTaps
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 0

@@ -1,7 +1,6 @@
  Object {
-   "alignItems": "center",
    "flexGrow": 1,
    "gap": 16,
    "justifyContent": "center",
    "padding": 24,
    "paddingBottom": 48,
```

M9-b: revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx` (HEAD 6b663268). `git diff -- mobile-pet-tracker/src/screens/forgot/index.tsx`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

## T10-nace-verde

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-T10-nace-verde.json > /tmp/117-T10-nace-verde.log 2>&1; echo "exit=$?"
```

```text
PASS src/api/__tests__/auth.test.ts
PASS src/screens/forgot/index.test.tsx (6.597 s)
Test Suites: 2 passed, 2 total
Tests:       60 passed, 60 total
Snapshots:   0 total
Time:        7.185 s
exit=0
src/api/__tests__/auth.test.ts: 40 tests; passed
src/screens/forgot/index.test.tsx: 20 tests; passed
```

T10 R11 nace verde: 40 casos auth y 20 de pantalla (60 total, 2 suites, exit=0). T1 ya devolvía ok solo por status=200 y D3/D10 dan el mismo árbol para ambos correos; no se necesita fix. M11-a se medirá sobre los dos casos citados por la tabla (requested:false y JSON inválido), mediante filtro explícito; el caso {} queda cubierto en el verde completo y en el cierre global.

Commit: `4ad9baff` — test(mobile): lock anti-enumeration in the forgot client and screen (#117 R11)

Sonda M11-a plantada temporalmente en `mobile-pet-tracker/src/api/auth.ts`; sin staging.

## M11-a

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts -t '#117 R11:.*(requested|JSON inválido)' --json --outputFile /tmp/117-M11-a.json > /tmp/117-M11-a.log 2>&1; echo "exit=$?"
```

```text
FAIL src/api/__tests__/auth.test.ts
Test Suites: 1 failed, 1 total
Tests:       2 failed, 38 skipped, 40 total
Snapshots:   0 total
Time:        1.66 s, estimated 3 s
exit=1
src/api/__tests__/auth.test.ts: 40 tests; failed

#117 R11: ok no depende del cuerpo mapea 200 con body {"requested": false} a ok sin leer el body
Error: expect(received).resolves.toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
-   "kind": "ok",
+   "kind": "error",
  }

#117 R11: ok no depende del cuerpo mapea 200 con JSON inválido a ok
Error: expect(received).resolves.toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
-   "kind": "ok",
+   "kind": "error",
  }
```

M11-a: revertida con `git checkout HEAD -- mobile-pet-tracker/src/api/auth.ts` (HEAD 4ad9baff). `git diff -- mobile-pet-tracker/src/api/auth.ts`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

Sonda M1-b plantada temporalmente en `mobile-pet-tracker/src/i18n/catalog.ts`; sin staging.

## M1-b

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/providers/__tests__/language-provider.test.tsx --json --outputFile /tmp/117-M1-b.json > /tmp/117-M1-b.log 2>&1; echo "exit=$?"
```

```text
FAIL src/providers/__tests__/language-provider.test.tsx
Test Suites: 1 failed, 1 total
Tests:       2 failed, 22 passed, 24 total
Snapshots:   0 total
Time:        1.522 s
exit=1
src/providers/__tests__/language-provider.test.tsx: 24 tests; failed

#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas
Error: expect(received).toHaveLength(expected)

Expected length: 357
Received length: 358
Received array:  ["addPet.addPet", "addPet.age", "addPet.approxMonths", "addPet.avatarPreview", "addPet.basicDetails", "addPet.birthDate", "addPet.breed", "addPet.cat", "addPet.checkPetDetails", "addPet.chooseBirthDate", …]

#117 R1: el catálogo trae las claves de recuperar contraseña retira forgot.comingSoon de los dos idiomas
Error: expect(received).toBeUndefined()

Received: "Password recovery coming soon"
```

M1-b: revertida con `git checkout HEAD -- mobile-pet-tracker/src/i18n/catalog.ts` (HEAD 4ad9baff). `git diff -- mobile-pet-tracker/src/i18n/catalog.ts`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

Sonda M2-b plantada temporalmente en `mobile-pet-tracker/src/api/auth.ts`; sin staging.

## M2-b

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts -t '#117 R2:' --json --outputFile /tmp/117-M2-b.json > /tmp/117-M2-b.log 2>&1; echo "exit=$?"
```

```text
FAIL src/api/__tests__/auth.test.ts
Test Suites: 1 failed, 1 total
Tests:       2 failed, 32 skipped, 6 passed, 40 total
Snapshots:   0 total
Time:        1.838 s, estimated 2 s
exit=1
src/api/__tests__/auth.test.ts: 40 tests; failed

#117 R2: forgotPassword mapea la respuesta por kind hace POST a /auth/forgot-password con { email } y mapea 200 a ok sin leer el body
Error: expect(jest.fn()).not.toHaveBeenCalled()

Expected number of calls: 0
Received number of calls: 1

1: called with 0 arguments

#117 R2: forgotPassword mapea la respuesta por kind mapea 429 a rate-limited sin leer el body
Error: expect(jest.fn()).not.toHaveBeenCalled()

Expected number of calls: 0
Received number of calls: 1

1: called with 0 arguments
```

M2-b: revertida con `git checkout HEAD -- mobile-pet-tracker/src/api/auth.ts` (HEAD 4ad9baff). `git diff -- mobile-pet-tracker/src/api/auth.ts`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

Sonda M3-a plantada temporalmente en `mobile-pet-tracker/src/app/(auth)/forgot.tsx`; sin staging.

## M3-a

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx -t '#117 R3:' --json --outputFile /tmp/117-M3-a.json > /tmp/117-M3-a.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/forgot/index.test.tsx (5.939 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 18 skipped, 1 passed, 20 total
Snapshots:   0 total
Time:        6.138 s, estimated 7 s
exit=1
src/screens/forgot/index.test.tsx: 20 tests; failed

#117 R3: la ruta forgot delega en ForgotScreen renderiza screen-forgot y forgot-form con el título desde la ruta y sin el aviso del stub
Error: Unable to find an element with testID: forgot-form
    at Object.getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:53:19)
```

M3-a: revertida con `git checkout HEAD -- mobile-pet-tracker/src/app/(auth)/forgot.tsx` (HEAD 4ad9baff). `git diff -- mobile-pet-tracker/src/app/(auth)/forgot.tsx`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

Sonda M4-b plantada temporalmente en `mobile-pet-tracker/src/screens/forgot/index.tsx`; sin staging.

## M4-b

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx -t '#117 R4:' --json --outputFile /tmp/117-M4-b.json > /tmp/117-M4-b.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/forgot/index.test.tsx (6.219 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 17 skipped, 2 passed, 20 total
Snapshots:   0 total
Time:        6.512 s
exit=1
src/screens/forgot/index.test.tsx: 20 tests; failed

#117 R4: el formulario pide el correo deshabilita forgot-submit con el correo vacío o solo espacios y lo habilita al escribir
Error: expect(instance).toBeDisabled()

Received instance is not disabled:
  <View
    accessibilityRole="button"
    accessibilityState={
      {
        "disabled": false,
      }
    }
    accessible={true}
    testID="forgot-submit"
  />
```

M4-b: revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx` (HEAD 4ad9baff). `git diff -- mobile-pet-tracker/src/screens/forgot/index.tsx`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

Sonda M5-a plantada temporalmente en `mobile-pet-tracker/src/screens/forgot/index.tsx`; sin staging.

## M5-a

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx -t '#117 R5:.*envía el correo recortado' --json --outputFile /tmp/117-M5-a.json > /tmp/117-M5-a.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/forgot/index.test.tsx (5.379 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 19 skipped, 20 total
Snapshots:   0 total
Time:        5.576 s, estimated 7 s
exit=1
src/screens/forgot/index.test.tsx: 20 tests; failed

#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

- Expected
+ Received

  "http://api.test/v1",
  Object {
-   "email": "Ana@Example.com",
+   "email": "  Ana@Example.com ",
  },

Number of calls: 1
```

M5-a: revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx` (HEAD 4ad9baff). `git diff -- mobile-pet-tracker/src/screens/forgot/index.tsx`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

Sonda M6-b plantada temporalmente en `mobile-pet-tracker/src/screens/forgot/index.tsx`; sin staging.

## M6-b

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx -t '#117 R6:' --json --outputFile /tmp/117-M6-b.json > /tmp/117-M6-b.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/forgot/index.test.tsx (5.683 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 18 skipped, 1 passed, 20 total
Snapshots:   0 total
Time:        5.827 s, estimated 6 s
exit=1
src/screens/forgot/index.test.tsx: 20 tests; failed

#117 R6: reenviar repite la misma petición un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»
Error: Unable to find an element with text: Revisa tu correo
    at Object.getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:235:19)
```

M6-b: revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx` (HEAD 4ad9baff). `git diff -- mobile-pet-tracker/src/screens/forgot/index.tsx`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

Sonda M7-g plantada temporalmente en `mobile-pet-tracker/src/screens/forgot/index.tsx`; sin staging.

## M7-g

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/ui-language.test.ts -t 'resuelve las 36 ocurrencias normativas' --json --outputFile /tmp/117-M7-g.json > /tmp/117-M7-g.log 2>&1; echo "exit=$?"
```

```text
FAIL src/__tests__/ui-language.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 1 passed, 29 total
Snapshots:   0 total
Time:        1.615 s
exit=1
src/__tests__/ui-language.test.ts: 29 tests; failed

#65 R1: el grupo (auth) resuelve su copy por clave resuelve las 36 ocurrencias normativas
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "file": "src/screens/forgot/index.tsx",
    "key": "common.somethingWentWrong",
-   "uses": 1,
+   "uses": 2,
  }
```

M7-g: revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx` (HEAD 4ad9baff). `git diff -- mobile-pet-tracker/src/screens/forgot/index.tsx`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

Sonda M10-c plantada temporalmente en `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts`; sin staging.

## M10-c

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/legibility-classnames.test.ts -t '#61 R4:' --json --outputFile /tmp/117-M10-c.json > /tmp/117-M10-c.log 2>&1; echo "exit=$?"
```

```text
FAIL src/__tests__/legibility-classnames.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 12 skipped, 13 passed, 26 total
Snapshots:   0 total
Time:        1.901 s
exit=1
src/__tests__/legibility-classnames.test.ts: 26 tests; failed

#61 R4: el acento como tinta usa accent-strong app/(auth)/forgot.tsx pinta con text-accent-strong (1)
Error: expect(received).toHaveLength(expected)

Matcher error: received value must have a length property whose value must be a number

Received has value: null
```

M10-c: revertida con `git checkout HEAD -- mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` (HEAD 4ad9baff). `git diff -- mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts`: vacío; `git diff --cached --stat`: vacío. Sonda no commiteada.

## Anclas finales R10 y árbol

```sh
grep -nF '+ 9 + 9 + 6 - 1, // #105 R5; #117 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
```
```text
56:      260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9 + 6 - 1, // #105 R5; #117 R1
```

```sh
grep -nF 'expect(R1_AUTH).toHaveLength(29 + 7); // #117 R10' mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
71:    expect(R1_AUTH).toHaveLength(29 + 7); // #117 R10
```

```sh
grep -nF "it('resuelve las 36 ocurrencias normativas'" mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
70:  it('resuelve las 36 ocurrencias normativas', () => {
168:  it('resuelve las 36 ocurrencias normativas', () => {
```

```sh
grep -nF 'toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 - 1)' mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
490:    expect(SCREEN_FILES).toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 - 1); // #100 R10, #41 R10, #146 R10, #105 R5; #117 R10: sale app/(auth)/forgot.tsx, entra screens/forgot/index.tsx
```

```sh
grep -ni forgot mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
490:    expect(SCREEN_FILES).toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 - 1); // #100 R10, #41 R10, #146 R10, #105 R5; #117 R10: sale app/(auth)/forgot.tsx, entra screens/forgot/index.tsx
```

```sh
grep -nF "file: 'src/screens/forgot/index.tsx'" mobile-pet-tracker/src/__tests__/ui-copy-table.ts
```
```text
16:  { file: 'src/screens/forgot/index.tsx', key: 'forgot.invalidEmail' }, // #117 R7
17:  { file: 'src/screens/forgot/index.tsx', key: 'forgot.tooManyAttempts' }, // #117 R7
18:  { file: 'src/screens/forgot/index.tsx', key: 'common.cannotReachServer' }, // #117 R7
19:  { file: 'src/screens/forgot/index.tsx', key: 'common.somethingWentWrong' }, // #117 R7
20:  { file: 'src/screens/forgot/index.tsx', key: 'forgot.checkYourEmail' }, // #117 R5
21:  { file: 'src/screens/forgot/index.tsx', key: 'forgot.sentTo' }, // #117 R5
22:  { file: 'src/screens/forgot/index.tsx', key: 'forgot.resend' }, // #117 R5
23:  { file: 'src/screens/forgot/index.tsx', key: 'forgot.forgotPassword' }, // #117 R10
24:  { file: 'src/screens/forgot/index.tsx', key: 'forgot.instructions' }, // #117 R10
25:  { file: 'src/screens/forgot/index.tsx', key: 'forgot.email' }, // #117 R10
26:  { file: 'src/screens/forgot/index.tsx', key: 'forgot.sendRecoveryLink' }, // #117 R10
27:  { file: 'src/screens/forgot/index.tsx', key: 'forgot.backToSignIn' }, // #117 R10
```

```sh
grep -cF 'src/app/(auth)/forgot.tsx' mobile-pet-tracker/src/__tests__/ui-copy-table.ts
```
```text
0
```

```sh
grep -cF "join('app', '(auth)', 'forgot.tsx')" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
```
```text
0
```

```sh
grep -cF "join('app', '(auth)', 'forgot.tsx')" mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
```
```text
0
```

```sh
grep -ci forgot mobile-pet-tracker/src/__tests__/design-drift.test.ts
```
```text
0
```

```sh
grep -nF 'expect(primaryRadius).toHaveLength(13 + 1 + 1)' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
```
```text
102:    expect(primaryRadius).toHaveLength(13 + 1 + 1); // #146 R8, #146 R9
```

```sh
grep -nF ')).toBe(13 + 1 + 1)' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
```
```text
399:    expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13 + 1 + 1); // #146 R8, #146 R9
```

```sh
grep -nF 'expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1)' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
```
```text
398:    expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link
```

```sh
grep -nF 'expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1)' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
```
```text
400:    expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1); // #147 R4: meal-time-edit y add-meal-time-button; #105 R11
```

```sh
grep -nF "[join('screens', 'forgot', 'index.tsx'), 1]," mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
```
```text
148:    [join('screens', 'forgot', 'index.tsx'), 1], // #117 R10
```

```sh
grep -nF ').toBe(13 + 1 + 1);' mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
```
```text
166:    ).toBe(13 + 1 + 1);
```

```sh
grep -nF "it('no deja ningún text-accent suelto en las fuentes'" mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
```
```text
169:  it('no deja ningún text-accent suelto en las fuentes', () => {
```

```sh
grep -c "^  'forgot\." mobile-pet-tracker/src/i18n/catalog.ts
```
```text
20
```

```sh
grep -cF "'forgot.comingSoon'" mobile-pet-tracker/src/i18n/catalog.ts
```
```text
0
```

```sh
grep -nF '| `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |' specs/mobile-ui-language/design.md
```
```text
81:| `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |
```

```sh
grep -nF '| `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |' specs/mobile-ui-language/design.md
```
```text
105:| `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |
```

```sh
grep -nF '**`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias' specs/mobile-ui-language/design.md
```
```text
231:**`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)
```

```sh
grep -nF '### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)' specs/mobile-ui-language/design.md
```
```text
214:### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)
```

```sh
grep -c Platform mobile-pet-tracker/src/screens/forgot/index.tsx
```
```text
0
```

```sh
grep -cF "t('" mobile-pet-tracker/src/screens/forgot/index.tsx
```
```text
10
```

Recuento normativo regex `\bt\(`: 12; un ScrollView y una KAV. Catálogo 357 claves por idioma (352 + 6 - 1), 10 forgot por idioma.

Candado inmutable consistency-classnames.test.ts:
```text
    expect(primaryRadius).toHaveLength(13 + 1 + 1); // #146 R8, #146 R9
```

Candado inmutable consistency-classnames.test.ts:
```text
    expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13 + 1 + 1); // #146 R8, #146 R9
```

Candado inmutable consistency-classnames.test.ts:
```text
    expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link
```

Candado inmutable consistency-classnames.test.ts:
```text
    expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1); // #147 R4: meal-time-edit y add-meal-time-button; #105 R11
```

Candado inmutable consistency-classnames.test.ts:
```text
      directUses.reduce((total, [, count]) => total + count, 2),
```

Candado inmutable legibility-classnames.test.ts:
```text
      inkSites.reduce((total, [, sites]) => total + sites, 0),
```

Candado inmutable legibility-classnames.test.ts:
```text
    ).toBe(13 + 1 + 1);
```

Candado inmutable legibility-classnames.test.ts:
```text
  it('no deja ningún text-accent suelto en las fuentes', () => {
```

Diff design-drift respecto a H0: vacío. Totales inmutables: primaryRadius=15, rounded-xl bg-accent=15, CONTINUOUS_CORNER=32, bg-accent-soft=19, inkSites=15; directUses sin delta (mismo inventario salvo ruta).

`test ! -e .expo/types/router.d.ts` (desde mobile-pet-tracker/): exit=0.

## cierre-ocho-suites

```sh
bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/reset-password/index.test.tsx src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-cierre-ocho-suites.json > /tmp/117-cierre-ocho-suites.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/legibility-classnames.test.ts
PASS src/api/__tests__/auth.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/screens/reset-password/index.test.tsx (5.231 s)
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/screens/forgot/index.test.tsx (14.001 s)
Test Suites: 8 passed, 8 total
Tests:       272 passed, 272 total
Snapshots:   0 total
Time:        15.129 s
exit=0
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/api/__tests__/auth.test.ts: 40 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/screens/reset-password/index.test.tsx: 19 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/screens/forgot/index.test.tsx: 20 tests; passed
```

## cierre-typecheck

```sh
bun run typecheck > /tmp/117-cierre-typecheck.log 2>&1; echo "exit=$?"
```

```text

exit=0
$ tsc --noEmit

```

## cierre-lint

```sh
bun run lint > /tmp/117-cierre-lint.log 2>&1; echo "exit=$?"
```

```text

exit=0
$ expo lint

```

## cierre-global

```sh
bunx jest --maxWorkers=2 --json --outputFile /tmp/117-cierre-global.json > /tmp/117-cierre-global.log 2>&1; echo "exit=$?"
```

```text
PASS ./app.assets.test.ts
PASS src/screens/forgot/index.test.tsx
PASS src/screens/profile/index.test.tsx
PASS src/screens/meal-schedule/index.test.tsx (5.662 s)
PASS src/screens/home/index.test.tsx (17.476 s)
PASS src/screens/reset-password/index.test.tsx
PASS src/screens/geofence-editor/index.test.tsx (5.43 s)
PASS src/screens/map/index.test.tsx
PASS src/app/(tabs)/__tests__/food.test.tsx
PASS src/screens/pairing/index.test.tsx
PASS src/screens/geofences/index.test.tsx
PASS src/screens/alerts/index.test.tsx
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/reminders/index.test.tsx
PASS src/screens/health/index.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/screens/weight-log/index.test.tsx
PASS src/screens/home/weekly-activity-chart.test.tsx
PASS src/screens/alert-detail/index.test.tsx
PASS src/screens/add-reminder/index.test.tsx
PASS src/app/__tests__/alert-detail.notification.test.tsx
PASS src/screens/add-pet/index.test.tsx
PASS src/app/(auth)/__tests__/register.test.tsx
PASS src/screens/meals-history/index.test.tsx
PASS src/screens/docs/index.test.tsx
PASS src/hooks/use-push-registration.navigation.test.tsx
PASS src/components/__tests__/floating-tab-bar.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.notification.test.tsx
PASS src/app/(tabs)/__tests__/layout.test.tsx
PASS src/app/(tabs)/__tests__/screens.test.tsx
PASS src/components/__tests__/pet-hero-header.test.tsx
PASS src/components/__tests__/pet-switcher.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/app/__tests__/detail-stack.navigation.test.tsx
PASS src/app/__tests__/alert-detail.navigation.test.tsx
PASS src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/app/(auth)/__tests__/login.test.tsx
PASS src/app/__tests__/detail-stack.guard.test.tsx
PASS src/providers/__tests__/selected-pet-provider.test.tsx
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/app/__tests__/tabs-layout.test.tsx
PASS src/api/__tests__/activity.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/__tests__/heroui-smoke.test.tsx
PASS src/api/__tests__/auth.test.ts
PASS src/components/__tests__/weight-chart.test.tsx
PASS src/components/__tests__/pet-avatar.test.tsx
PASS test/__tests__/render-with-providers.test.tsx
PASS src/theme/__tests__/global-css.test.ts
PASS src/api/__tests__/nutrition.test.ts
PASS src/hooks/use-push-registration.test.tsx
PASS src/api/__tests__/subscriptions.test.ts
PASS src/providers/__tests__/query-provider.test.tsx
PASS src/app/__tests__/index.test.tsx
PASS src/api/__tests__/geofences.test.ts
PASS src/providers/__tests__/auth-provider.test.tsx
PASS src/api/__tests__/push-tokens.test.ts
PASS src/api/__tests__/users.test.ts
PASS src/components/__tests__/pet-map.test.tsx
PASS ./app.config.test.ts
PASS src/app/(tabs)/__tests__/profile.test.tsx
PASS src/hooks/use-pet-selection.test.tsx
PASS src/utils/__tests__/month-grid.test.ts
PASS src/theme/__tests__/theme-transition.test.tsx
PASS src/utils/civil-today-iso.test.ts
PASS src/api/__tests__/devices.test.ts
PASS src/__tests__/ui-copy-table.ts
PASS src/components/__tests__/card.test.tsx
PASS src/app/(tabs)/__tests__/alerts.test.tsx
PASS src/theme/__tests__/theme-transition.degraded.test.tsx
PASS src/__tests__/hosting-artifacts.test.ts
PASS src/app/(auth)/__tests__/layout.test.tsx
PASS src/utils/language-preference.test.ts
PASS src/utils/__tests__/category-palette.test.ts
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/api/__tests__/health-records.test.ts
PASS src/screens/home/format.test.ts
PASS src/utils/zoom-for-radius.test.ts
PASS src/theme/__tests__/use-theme-colors.test.tsx
PASS src/api/__tests__/pets.test.ts
PASS src/api/__tests__/trips.test.ts
PASS src/utils/reminder-dates.test.ts
PASS src/api/__tests__/positions.test.ts
PASS src/api/__tests__/alerts.test.ts
PASS src/utils/device-connectivity.test.ts
PASS src/api/__tests__/reminders.test.ts
PASS src/api/__tests__/media.test.ts
PASS src/app/__tests__/detail-stack.test.tsx
PASS src/theme/__tests__/font-registration.test.ts
PASS src/api/__tests__/query-keys.test.ts
PASS src/utils/theme-preference.test.ts
PASS src/utils/date-picker-value.test.ts
Test Suites: 93 passed, 93 total
Tests:       2036 passed, 2036 total
Snapshots:   1 passed, 1 total
Time:        60.1 s, estimated 69 s
exit=0
app.assets.test.ts: 7 tests; passed
src/screens/forgot/index.test.tsx: 20 tests; passed
src/screens/profile/index.test.tsx: 39 tests; passed
src/screens/meal-schedule/index.test.tsx: 59 tests; passed
src/screens/home/index.test.tsx: 169 tests; passed
src/screens/reset-password/index.test.tsx: 19 tests; passed
src/screens/geofence-editor/index.test.tsx: 68 tests; passed
src/screens/map/index.test.tsx: 64 tests; passed
src/app/(tabs)/__tests__/food.test.tsx: 57 tests; passed
src/screens/pairing/index.test.tsx: 54 tests; passed
src/screens/geofences/index.test.tsx: 49 tests; passed
src/screens/alerts/index.test.tsx: 36 tests; passed
src/__tests__/legibility-classnames.test.ts: 26 tests; passed
src/screens/reminders/index.test.tsx: 31 tests; passed
src/screens/health/index.test.tsx: 29 tests; passed
src/__tests__/ui-language.test.ts: 29 tests; passed
src/screens/weight-log/index.test.tsx: 33 tests; passed
src/screens/home/weekly-activity-chart.test.tsx: 60 tests; passed
src/screens/alert-detail/index.test.tsx: 25 tests; passed
src/screens/add-reminder/index.test.tsx: 41 tests; passed
src/app/__tests__/alert-detail.notification.test.tsx: 1 tests; passed
src/screens/add-pet/index.test.tsx: 26 tests; passed
src/app/(auth)/__tests__/register.test.tsx: 13 tests; passed
src/screens/meals-history/index.test.tsx: 28 tests; passed
src/screens/docs/index.test.tsx: 13 tests; passed
src/hooks/use-push-registration.navigation.test.tsx: 1 tests; passed
src/components/__tests__/floating-tab-bar.test.tsx: 18 tests; passed
src/app/__tests__/reminders-alerts-stack.notification.test.tsx: 1 tests; passed
src/app/(tabs)/__tests__/layout.test.tsx: 5 tests; passed
src/app/(tabs)/__tests__/screens.test.tsx: 2 tests; passed
src/components/__tests__/pet-hero-header.test.tsx: 37 tests; passed
src/components/__tests__/pet-switcher.test.tsx: 1 tests; passed
src/__tests__/consistency-classnames.test.ts: 55 tests; passed
src/app/__tests__/detail-stack.navigation.test.tsx: 2 tests; passed
src/app/__tests__/alert-detail.navigation.test.tsx: 1 tests; passed
src/app/__tests__/reminders-alerts-stack.navigation.test.tsx: 1 tests; passed
src/__tests__/design-drift.test.ts: 59 tests; passed
src/app/(auth)/__tests__/login.test.tsx: 11 tests; passed
src/app/__tests__/detail-stack.guard.test.tsx: 2 tests; passed
src/providers/__tests__/selected-pet-provider.test.tsx: 3 tests; passed
src/providers/__tests__/language-provider.test.tsx: 24 tests; passed
src/app/__tests__/tabs-layout.test.tsx: 1 tests; passed
src/api/__tests__/activity.test.ts: 9 tests; passed
src/app/__tests__/layout.test.tsx: 25 tests; passed
src/__tests__/heroui-smoke.test.tsx: 1 tests; passed
src/api/__tests__/auth.test.ts: 40 tests; passed
src/components/__tests__/weight-chart.test.tsx: 4 tests; passed
src/components/__tests__/pet-avatar.test.tsx: 8 tests; passed
test/__tests__/render-with-providers.test.tsx: 3 tests; passed
src/theme/__tests__/global-css.test.ts: 51 tests; passed
src/api/__tests__/nutrition.test.ts: 71 tests; passed
src/hooks/use-push-registration.test.tsx: 53 tests; passed
src/api/__tests__/subscriptions.test.ts: 10 tests; passed
src/providers/__tests__/query-provider.test.tsx: 11 tests; passed
src/app/__tests__/index.test.tsx: 3 tests; passed
src/api/__tests__/geofences.test.ts: 63 tests; passed
src/providers/__tests__/auth-provider.test.tsx: 8 tests; passed
src/api/__tests__/push-tokens.test.ts: 10 tests; passed
src/api/__tests__/users.test.ts: 8 tests; passed
src/components/__tests__/pet-map.test.tsx: 16 tests; passed
app.config.test.ts: 21 tests; passed
src/app/(tabs)/__tests__/profile.test.tsx: 1 tests; passed
src/hooks/use-pet-selection.test.tsx: 7 tests; passed
src/utils/__tests__/month-grid.test.ts: 12 tests; passed
src/theme/__tests__/theme-transition.test.tsx: 6 tests; passed
src/utils/civil-today-iso.test.ts: 6 tests; passed
src/api/__tests__/devices.test.ts: 27 tests; passed
src/__tests__/ui-copy-table.ts: 2 tests; passed
src/components/__tests__/card.test.tsx: 7 tests; passed
src/app/(tabs)/__tests__/alerts.test.tsx: 3 tests; passed
src/theme/__tests__/theme-transition.degraded.test.tsx: 1 tests; passed
src/__tests__/hosting-artifacts.test.ts: 7 tests; passed
src/app/(auth)/__tests__/layout.test.tsx: 3 tests; passed
src/utils/language-preference.test.ts: 8 tests; passed
src/utils/__tests__/category-palette.test.ts: 12 tests; passed
src/__tests__/hero-header-amendments.test.ts: 3 tests; passed
src/api/__tests__/health-records.test.ts: 33 tests; passed
src/screens/home/format.test.ts: 13 tests; passed
src/utils/zoom-for-radius.test.ts: 8 tests; passed
src/theme/__tests__/use-theme-colors.test.tsx: 1 tests; passed
src/api/__tests__/pets.test.ts: 36 tests; passed
src/api/__tests__/trips.test.ts: 17 tests; passed
src/utils/reminder-dates.test.ts: 20 tests; passed
src/api/__tests__/positions.test.ts: 22 tests; passed
src/api/__tests__/alerts.test.ts: 28 tests; passed
src/utils/device-connectivity.test.ts: 13 tests; passed
src/api/__tests__/reminders.test.ts: 27 tests; passed
src/api/__tests__/media.test.ts: 15 tests; passed
src/app/__tests__/detail-stack.test.tsx: 18 tests; passed
src/theme/__tests__/font-registration.test.ts: 3 tests; passed
src/api/__tests__/query-keys.test.ts: 22 tests; passed
src/utils/theme-preference.test.ts: 8 tests; passed
src/utils/date-picker-value.test.ts: 12 tests; passed
```

## Cierre T11 — deltas y resumen

H0 vigente: `90a19d86`. Ningún rebase, push ni PR. Solo quedan el review del leader y el smoke humano S1–S9; no se han marcado sus casillas ni la feature done.

| Suite | Base | Final | Delta |
|---|---:|---:|---:|
| `src/__tests__/consistency-classnames.test.ts` | 55 | 55 | 0 |
| `src/__tests__/design-drift.test.ts` | 59 | 59 | 0 |
| `src/__tests__/legibility-classnames.test.ts` | 26 | 26 | 0 |
| `src/__tests__/ui-language.test.ts` | 29 | 29 | 0 |
| `src/api/__tests__/auth.test.ts` | 29 | 40 | 11 |
| `src/app/(auth)/__tests__/forgot.test.tsx` | 4 | 0 | -4 |
| `src/providers/__tests__/language-provider.test.tsx` | 22 | 24 | 2 |
| `src/screens/forgot/index.test.tsx` | 0 | 20 | 20 |
| `src/screens/reset-password/index.test.tsx` | 19 | 19 | 0 |
| Total de estas suites | 243 | 272 | +29 |

Base: 8 suites, exit=0; typecheck exit=0 (guard verificado); lint exit=0. Cierre: 8 suites, 272 tests, exit=0; typecheck y lint exit=0. Los 4 it de la suite eliminada se reapuntan o invierten tal como declara R3/R4/R9: aviso ausente, correo editable, submit condicional, navegación sin petición y los dos candados con títulos intactos. No hay it perdido sin reemplazo.

### Commits de tests e implementación, por orden

| Hash | Mensaje / R-id |
|---|---|
| `7ba0b3a9` | test(mobile): lock the forgotPassword client by kind (#117 R2) |
| `9cb64956` | feat(mobile): add the forgotPassword client to the auth api (#117 R2) |
| `11bc5588` | test(mobile): lock the six forgot catalog keys (#117 R1) |
| `6ff636d3` | feat(mobile): add the forgot copy in both languages (#117 R1) |
| `0fe5e0fe` | test(mobile): lock the forgot route, screen tree and stub removal (#117 R3, R1) |
| `14752498` | feat(mobile): move forgot to its own screen behind a thin route (#117 R3, R1) |
| `ee307c0e` | test(mobile): lock the forgot form state (#117 R4) |
| `be75a850` | feat(mobile): make the forgot email editable and gate submit on it (#117 R4) |
| `c243a37c` | test(mobile): lock the check-your-email state after sending (#117 R5) |
| `9e4c8378` | feat(mobile): request the recovery link and switch to check your email (#117 R5) |
| `d05462f1` | test(mobile): lock the forgot error copy for every non-ok kind (#117 R7) |
| `4390db9c` | feat(mobile): map every non-ok kind to its forgot error copy (#117 R7) |
| `92adb028` | test(mobile): lock resend from check your email (#117 R6) |
| `f104949c` | feat(mobile): resend the recovery link with the submitted email (#117 R6) |
| `574c3674` | test(mobile): lock the forgot keyboard avoidance (#117 R8) |
| `6b663268` | test(mobile): lock the forgot metrics across both states (#117 R9) |
| `4ad9baff` | test(mobile): lock anti-enumeration in the forgot client and screen (#117 R11) |

### Resumen de las once sondas

| Sonda | Resultado observado | Tipo |
|---|---|---|
| M1-b | Expected length 357 / Received 358; comingSoon Expected undefined / Received Password recovery coming soon | aserción: toHaveLength / toBeUndefined |
| M2-b | response.json Expected 0 llamadas / Received 1 en 200 y 429 | aserción: not.toHaveBeenCalled |
| M3-a | getByTestId(forgot-form) no encuentra el nodo | consulta: getByTestId(forgot-form) |
| M4-b | forgot-submit con espacios Expected disabled=true / Received false | aserción: toBeDisabled con espacios |
| M5-a | Expected Ana@Example.com / Received dos espacios iniciales y uno final | aserción: toHaveBeenCalledWith |
| M6-b | getByText(Revisa tu correo) no encuentra el texto tras 429 | consulta: getByText(Revisa tu correo) |
| M7-g | common.somethingWentWrong Expected uses=1 / Received uses=2 | aserción: toEqual (uses 1 → 2) |
| M8-c | Expected paddingBottom=200 / Received 291 | aserción: toHaveStyle (200 → 291) |
| M9-b | Expected alignItems=center / Received propiedad ausente | aserción: toEqual (alignItems ausente) |
| M10-c | Expected longitud=1 / Received null (cero coincidencias de text-accent-strong en route delgado) | aserción: toHaveLength (1 esperado; null recibido, cero matches) |
| M11-a | Expected kind=ok / Received error en requested:false y JSON inválido | aserción: resolves.toEqual (ok → error) |

Las once sondas dieron exit=1 y se revirtieron con exit=0; sus bloques anteriores contienen cada nombre completo de it y el matcher. En M7-g se filtró el título normativo de 36; también existe un título de 36 de otra sección ya en H0, que pasó. En M5-a se seleccionó el it 1 citado por la tabla. No se cambiaron aserciones para provocar o eliminar fallos.

### Decisiones y límites

D1–D16 se aplicaron literalmente. Sin cambios de diseño, dependencias, backend, pantallas ajenas ni bookkeeping del leader. La declaración tipada real de es se respetó. R8/R9/R11 no precisaron commits fix porque nacieron verdes. Se conserva el smoke en Android para el humano; no se lanzó Expo, init.sh, Postgres ni LocalStack. La única adaptación operativa de una sonda fue M3-a, ya explicada, para probar la delegación sin introducir un TypeError por clave retirada. Graphify se omitió por el límite explícito de 16 ficheros.

Candados finales: catálogo 357 por idioma (+6−1); R1_AUTH=36 (+7); SCREEN_FILES=28 (+1−1); 12 llamadas t en forgot; CONTINUOUS_CORNER=32; rounded-xl bg-accent=15; bg-accent-soft=19; directUses total=34 y fila forgot=1; inkSites=15 y fila forgot=1. La sección Health de ui-language conserva su título y cuenta originales; la revisión del diff corrigió una sustitución de título demasiado amplia antes del verde T6.

### Dependencias

```sh
git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
```
```text
(salida vacía; exit=0)
```

```sh
git diff 90a19d86 -- mobile-pet-tracker/app.json
```
```text
(salida vacía; exit=0)
```

### Suite global por descubrimiento (sin pipe)

`bunx jest --maxWorkers=2` + flags de reporte: 93 suites / 2036 tests / 1 snapshot, exit=0. Los barridos anteriores de todos los *.test.ts(x) de src ejecutaron 89 suites; el descubrimiento global también ejecuta:
- `app.assets.test.ts`: 7 tests.
- `test/__tests__/render-with-providers.test.tsx`: 3 tests.
- `app.config.test.ts`: 21 tests.
- `src/__tests__/ui-copy-table.ts`: 2 tests.

Estas cuatro suites extra aportan 33 tests (sin cambio de sus it). Total final de src: 90 suites / 2005 tests; todo mobile-pet-tracker: 93 / 2036. Todas verdes.

Cierre final autorizado: T1–T11 implementados y verificados. No hay bloqueo de implementación; las paradas anteriores se conservan como historial. La aprobación de smoke, feature_list, STATUS y progress/current/history pertenecen al leader/humano y siguen intactos. Se prepara únicamente el commit documental requerido, con traceability e impl. El hash del propio cierre se identifica mediante `git log -1` (no se inserta una autorreferencia que lo cambiaría).

## Alcance final respecto a H0

Lista preparada con el índice del commit de cierre; se verifica la misma salida contra HEAD después de commitear:

```sh
git diff --name-only 90a19d86 HEAD
```
```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/api/__tests__/auth.test.ts
mobile-pet-tracker/src/api/auth.ts
mobile-pet-tracker/src/api/types.ts
mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx
mobile-pet-tracker/src/app/(auth)/forgot.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/forgot/index.test.tsx
mobile-pet-tracker/src/screens/forgot/index.tsx
progress/impl_mobile-forgot-password.md
specs/mobile-forgot-password/traceability.md
specs/mobile-ui-language/design.md
```

16 ficheros exactos, sin extras.

### Delta final por fichero (líneas añadidas / retiradas)

| Fichero | + | − |
|---|---:|---:|
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | 4 | 4 |
| `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` | 1 | 1 |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | 12 | 5 |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | 3 | 3 |
| `mobile-pet-tracker/src/api/__tests__/auth.test.ts` | 85 | 1 |
| `mobile-pet-tracker/src/api/auth.ts` | 38 | 0 |
| `mobile-pet-tracker/src/api/types.ts` | 4 | 0 |
| `mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx` | 0 | 99 |
| `mobile-pet-tracker/src/app/(auth)/forgot.tsx` | 3 | 73 |
| `mobile-pet-tracker/src/i18n/catalog.ts` | 12 | 2 |
| `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | 36 | 1 |
| `mobile-pet-tracker/src/screens/forgot/index.test.tsx` | 299 | 0 |
| `mobile-pet-tracker/src/screens/forgot/index.tsx` | 147 | 0 |
| `progress/impl_mobile-forgot-password.md` | 3139 | 0 |
| `specs/mobile-forgot-password/traceability.md` | 33 | 17 |
| `specs/mobile-ui-language/design.md` | 17 | 9 |

El impl es nuevo respecto a H0; su recuento incluye este bloque. La suite nueva tiene 20 it/casos normativos, y las sumas de tests y métricas están arriba. `git diff --check`: exit=0. Ningún TODO sin contexto ni log de debug añadido.
