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

## Ronda 2

Arranque de la ronda 2 (2026-10-05). H0 de esta ronda: `453d0cd8`.

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-backend
$ git branch --show-current
feature/117-mobile-forgot-password
$ git rev-parse --short HEAD
453d0cd8
```

Sin skills adicionales: esta ronda cambia solo tests; las decisiones de UI y producción permanecen cerradas.

### Anclas de arranque

```text
$ M=mobile-pet-tracker/src
$ git diff --quiet d39a9ea5 HEAD -- mobile-pet-tracker; echo "exit=$?"
exit=0
$ test ! -e mobile-pet-tracker/.expo/types/router.d.ts; echo "exit=$?"
exit=0
$ grep -cF "describe('#117 R2: forgotPassword mapea la respuesta por kind'" $M/api/__tests__/auth.test.ts
1
$ grep -cF "it('mapea 500 a error'" $M/api/__tests__/auth.test.ts
1
$ grep -cF 'function response(status: number, body: unknown): Response {' $M/api/__tests__/auth.test.ts
1
$ grep -cF '.mockResolvedValueOnce(invalidJsonResponse(400))' $M/api/__tests__/auth.test.ts
1
$ grep -cF 'mapea %i a error' $M/api/__tests__/auth.test.ts
0
$ grep -cF 'export async function forgotPassword(' $M/api/auth.ts
1
$ grep -cF 'switch (result.response.status) {' $M/api/auth.ts
1
$ grep -cF "describe('#117 R3: la ruta forgot delega en ForgotScreen'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('link-login navega a /login sin petición de red'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "describe('#117 R5: enviar pasa la pantalla a «Revisa tu correo»'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "describe('#117 R6: reenviar repite la misma petición'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "describe('#117 R7: cada kind distinto de ok pinta su copy en forgot-error'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "describe('#117 R9: las métricas del stub sobreviven al cambio de estado'" $M/screens/forgot/index.test.tsx
1
$ grep -cF 'let resolveRequest!: (state: ForgotPasswordState) => void;' $M/screens/forgot/index.test.tsx
2
$ grep -cF 'const pending = new Promise<ForgotPasswordState>((resolve) => { resolveRequest = resolve; });' $M/screens/forgot/index.test.tsx
1
$ grep -cF 'const mockRouter = jest.mocked(router);' $M/screens/forgot/index.test.tsx
1
$ grep -cF "async function submitForgot(email = 'ana@example.com') {" $M/screens/forgot/index.test.tsx
1
$ grep -cF 'al reenviar pinta «%s» en forgot-error' $M/screens/forgot/index.test.tsx
0
$ grep -cF 'retira forgot-error en cuanto arranca' $M/screens/forgot/index.test.tsx
0
$ grep -cF 'de la spec en los dos estados' $M/screens/forgot/index.test.tsx
0
$ grep -cF 'también desde «Revisa tu correo»' $M/screens/forgot/index.test.tsx
0
$ grep -cF 'el tile Lock sigue en pie' $M/screens/forgot/index.test.tsx
0
$ grep -cF 'setError(null);' $M/screens/forgot/index.tsx
1
$ grep -cF "setError(t('forgot.invalidEmail'));" $M/screens/forgot/index.tsx
1
$ grep -cF "setError(t('common.cannotReachServer'));" $M/screens/forgot/index.tsx
1
$ grep -cF "setError(t('common.somethingWentWrong'));" $M/screens/forgot/index.tsx
1
$ grep -cF "case 'ok':" $M/screens/forgot/index.tsx
1
$ grep -cF 'setSubmittedEmail(target);' $M/screens/forgot/index.tsx
1
$ grep -cF 'setSent(false);' $M/screens/forgot/index.tsx
0
$ grep -cF '{sent ? (' $M/screens/forgot/index.tsx
1
$ grep -cF 'onPress={() => void send(submittedEmail)}' $M/screens/forgot/index.tsx
1
$ grep -cF 'className="flex-1 bg-background"' $M/screens/forgot/index.tsx
1
$ grep -cF 'contentInsetAdjustmentBehavior="automatic"' $M/screens/forgot/index.tsx
1
$ grep -cF "onPress={() => router.push('/login')}" $M/screens/forgot/index.tsx
1
$ grep -cF 'className="size-16 items-center justify-center rounded-xl bg-accent-soft"' $M/screens/forgot/index.tsx
1
$ grep -cF "'common.somethingWentWrong': 'Algo salió mal'," $M/i18n/catalog.ts
1
$ grep -cF "'common.cannotReachServer': 'No se pudo conectar con el servidor'," $M/i18n/catalog.ts
1
$ grep -cF 'Ingresa un correo electrónico válido' $M/i18n/catalog.ts
1
$ grep -cF 'Demasiados intentos. Inténtalo más tarde.' $M/i18n/catalog.ts
1
$ grep -cF 'Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.' $M/i18n/catalog.ts
1
$ grep -cF '.parent' $M/screens/docs/index.test.tsx
2
```

45 anclas verificadas; todas coinciden.

### Base medida

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts src/screens/forgot/index.test.tsx > /tmp/117-r2-base.log 2>&1; echo "exit=$?"
Test Suites: 2 passed, 2 total
Tests:       60 passed, 60 total
Snapshots:   0 total
Time:        6.015 s
exit=0
```

Lecturas completas: requirements.md §Enmienda E1 (E1.1–E1.8), tasks.md §Enmienda E1 (T12–T18 y No hacer), review (veredicto y barrido), tests existentes, producción y convenciones de esperas/commits. Sin decisiones nuevas de comportamiento.

#### T12-verde-inicial

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts --json --outputFile /tmp/117-r2-T12-verde-inicial.json > /tmp/117-r2-T12-verde-inicial.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       44 passed, 44 total
Snapshots:   0 total
Time:        1.974 s, estimated 2 s
exit=0
```

### Sonda M2-f

Cambio temporal en `mobile-pet-tracker/src/api/auth.ts`; no se añade al índice.

#### M2-f

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts --json --outputFile /tmp/117-r2-M2-f.json > /tmp/117-r2-M2-f.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 41 passed, 44 total
Snapshots:   0 total
Time:        1.52 s, estimated 2 s
exit=1
```

`#117 R2: forgotPassword mapea la respuesta por kind mapea 201 a error`

```text
Error: expect(received).resolves.toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
-   "kind": "error",
+   "kind": "ok",
  }
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@jest/expect/node_modules/expect/build/index.js:174:22)
    at toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:326:67)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:327:4)
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-each/build/bind.js:81:13)
    at Promise.then.completed (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:316:40)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at _runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:444:34)
```

`#117 R2: forgotPassword mapea la respuesta por kind mapea 302 a error`

```text
Error: expect(received).resolves.toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
-   "kind": "error",
+   "kind": "ok",
  }
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@jest/expect/node_modules/expect/build/index.js:174:22)
    at toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:326:67)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:327:4)
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-each/build/bind.js:81:13)
    at Promise.then.completed (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:316:40)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at _runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:444:34)
```

`#117 R2: forgotPassword mapea la respuesta por kind mapea 404 a error`

```text
Error: expect(received).resolves.toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
-   "kind": "error",
+   "kind": "ok",
  }
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@jest/expect/node_modules/expect/build/index.js:174:22)
    at toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:326:67)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:327:4)
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-each/build/bind.js:81:13)
    at Promise.then.completed (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:316:40)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at _runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:444:34)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M2-f | `mapea 201 a error`<br>`mapea 302 a error`<br>`mapea 404 a error` | aserción, `resolves.toEqual`. Expected kind: 'error'; Received kind: 'ok' | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/api/auth.ts
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/api/auth.ts; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M2-g

Cambio temporal en `mobile-pet-tracker/src/api/auth.ts`; no se añade al índice.

#### M2-g

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts --json --outputFile /tmp/117-r2-M2-g.json > /tmp/117-r2-M2-g.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 passed, 44 total
Snapshots:   0 total
Time:        1.319 s, estimated 2 s
exit=1
```

`#117 R2: forgotPassword mapea la respuesta por kind mapea 201 a error`

```text
Error: expect(received).resolves.toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
-   "kind": "error",
+   "kind": "ok",
  }
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@jest/expect/node_modules/expect/build/index.js:174:22)
    at toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:326:67)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:327:4)
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-each/build/bind.js:81:13)
    at Promise.then.completed (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:316:40)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at _runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:444:34)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M2-g | `mapea 201 a error` | aserción, `resolves.toEqual`. Expected kind: 'error'; Received kind: 'ok' | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/api/auth.ts
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/api/auth.ts; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M2-h

Cambio temporal en `mobile-pet-tracker/src/api/auth.ts`; no se añade al índice.

#### M2-h

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts --json --outputFile /tmp/117-r2-M2-h.json > /tmp/117-r2-M2-h.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 passed, 44 total
Snapshots:   0 total
Time:        1.336 s, estimated 2 s
exit=1
```

`#117 R2: forgotPassword mapea la respuesta por kind mapea 503 a error`

```text
Error: expect(received).resolves.toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
-   "kind": "error",
+   "kind": "ok",
  }
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@jest/expect/node_modules/expect/build/index.js:174:22)
    at toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:326:67)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:327:4)
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-each/build/bind.js:81:13)
    at Promise.then.completed (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:316:40)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at _runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:444:34)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M2-h | `mapea 503 a error` | aserción, `resolves.toEqual`. Expected kind: 'error'; Received kind: 'ok' | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/api/auth.ts
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/api/auth.ts; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M2-i

Cambio temporal en `mobile-pet-tracker/src/api/auth.ts`; no se añade al índice.

#### M2-i

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts --json --outputFile /tmp/117-r2-M2-i.json > /tmp/117-r2-M2-i.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 passed, 44 total
Snapshots:   0 total
Time:        1.299 s, estimated 2 s
exit=1
```

`#117 R2: forgotPassword mapea la respuesta por kind mapea 302 a error`

```text
Error: expect(received).resolves.toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
-   "kind": "error",
+   "kind": "ok",
  }
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@jest/expect/node_modules/expect/build/index.js:174:22)
    at toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:326:67)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/api/__tests__/auth.test.ts:327:4)
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-each/build/bind.js:81:13)
    at Promise.then.completed (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:316:40)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at _runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:444:34)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M2-i | `mapea 302 a error` | aserción, `resolves.toEqual`. Expected kind: 'error'; Received kind: 'ok' | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/api/auth.ts
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/api/auth.ts; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T12-verde-final

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts --json --outputFile /tmp/117-r2-T12-verde-final.json > /tmp/117-r2-T12-verde-final.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       44 passed, 44 total
Snapshots:   0 total
Time:        1.351 s, estimated 2 s
exit=0
```

Commit T12: `a3426e90` test(mobile): lock every other status as error in the forgot client (#117 R2, E1). Solo `mobile-pet-tracker/src/api/__tests__/auth.test.ts`.

#### T13-verde-inicial

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-T13-verde-inicial.json > /tmp/117-r2-T13-verde-inicial.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        6.439 s
exit=0
```

### Sonda M6-e

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M6-e

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M6-e.json > /tmp/117-r2-M6-e.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 23 passed, 24 total
Snapshots:   0 total
Time:        6.646 s, estimated 7 s
exit=1
```

`#117 R6: reenviar repite la misma petición un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: Unable to find an element with text: Revisa tu correo

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="ana@example.com"
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Ingresa un correo electrónico válido
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:253:19)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M6-e | `un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»` | consulta, `getByText`. Consulta getByText('Revisa tu correo'): Unable to find an element with text: Revisa tu correo | un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»: passed |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M6-f

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M6-f

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M6-f.json > /tmp/117-r2-M6-f.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 23 passed, 24 total
Snapshots:   0 total
Time:        5.464 s, estimated 7 s
exit=1
```

`#117 R6: reenviar repite la misma petición un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: Unable to find an element with text: Revisa tu correo

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="ana@example.com"
          />
        </View>
        <Text
          testID="forgot-error"
        >
          No se pudo conectar con el servidor
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:253:19)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M6-f | `un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»` | consulta, `getByText`. Consulta getByText('Revisa tu correo'): Unable to find an element with text: Revisa tu correo | un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»: passed |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M6-g

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M6-g

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M6-g.json > /tmp/117-r2-M6-g.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 22 passed, 24 total
Snapshots:   0 total
Time:        5.486 s, estimated 6 s
exit=1
```

`#117 R6: reenviar repite la misma petición un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: Unable to find an element with text: Revisa tu correo

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="ana@example.com"
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:253:19)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: Unable to find an element with text: Revisa tu correo

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="ana@example.com"
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:253:19)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M6-g | `un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | consulta, `getByText`. Consulta getByText('Revisa tu correo'): Unable to find an element with text: Revisa tu correo | un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»: passed |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T13-verde-final

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-T13-verde-final.json > /tmp/117-r2-T13-verde-final.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        5.803 s, estimated 6 s
exit=0
```

Commit T13: `7c2937e2` test(mobile): lock resend errors for every non-ok kind (#117 R6, E1). Solo `mobile-pet-tracker/src/screens/forgot/index.test.tsx`.

#### T14-verde-inicial

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-T14-verde-inicial.json > /tmp/117-r2-T14-verde-inicial.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        6.494 s
exit=0
```

### Sonda M7-h

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M7-h

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M7-h.json > /tmp/117-r2-M7-h.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 24 passed, 26 total
Snapshots:   0 total
Time:        6.237 s, estimated 7 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(received).toBeNull()

Received: <Text className="text-danger" selectable={true} testID="forgot-error">Algo salió mal</Text>
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:218:50)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(received).toBeNull()

Received: <Text className="text-danger" selectable={true} testID="forgot-error">Demasiados intentos. Inténtalo más tarde.</Text>
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:239:50)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M7-h | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción, `toBeNull`. Expected: null; Received: nodo Text forgot-error con el error anterior mientras vuela la petición | un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»: passed |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M7-i

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M7-i

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M7-i.json > /tmp/117-r2-M7-i.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Snapshots:   0 total
Time:        5.734 s, estimated 7 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(received).toBeNull()

Received: <Text className="text-danger" selectable={true} testID="forgot-error">Demasiados intentos. Inténtalo más tarde.</Text>
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:239:50)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M7-i | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción, `toBeNull`. Expected: null; Received: nodo Text forgot-error con Demasiados intentos. Inténtalo más tarde. | un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver: passed |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M4-f

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M4-f

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M4-f.json > /tmp/117-r2-M4-f.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Snapshots:   0 total
Time:        6 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(received).toBeNull()

Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": true, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-secondary button__root--size-md disabled:element-disabled w-full rounded-xl" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": {"callStart": null, "callback": undefined, "current": 1, "easing": [Function reactNativeReanimated_EasingJs19], "onFrame": [Function timing], "onStart": [Function anonymous], "progress": 0, "reduceMotion": false, "startTime": undefined, "startValue": 1, "timestamp": undefined, "toValue": 1, "type": "timing"}}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-resend"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": {"callStart": null, "callback": undefined, "current": NaN, "easing": [Function reactNativeReanimated_EasingJs21], "onFrame": [Function timing], "onStart": [Function anonymous], "progress": 0, "reduceMotion": false, "startTime": undefined, "startValue": 0, "timestamp": undefined, "toValue": 0, "type": "timing"}}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-secondary button__label--size-md font-bold text-foreground">Reenviar</Text></View>
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:219:51)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M4-f | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción, `toBeNull`. Expected: null; Received: nodo forgot-resend durante el envío del formulario | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M6-h

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M6-h

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M6-h.json > /tmp/117-r2-M6-h.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Snapshots:   0 total
Time:        5.912 s, estimated 6 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Si existe una cuenta para Ana@Example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
Received:
  Si existe una cuenta para , te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
    at Object.toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:244:47)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M6-h | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción, `toHaveTextContent`. Expected: Si existe una cuenta para Ana@Example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.; Received: Si existe una cuenta para , te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam. | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M6-i

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M6-i

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M6-i.json > /tmp/117-r2-M6-i.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 25 passed, 26 total
Snapshots:   0 total
Time:        5.817 s, estimated 6 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
-   "email": "Ana@Example.com",
+   "email": "  Ana@Example.com ",
  }
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:238:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M6-i | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción, `toEqual`. Expected: { email: 'Ana@Example.com' }; Received: { email: '  Ana@Example.com ' } | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T14-verde-final

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-T14-verde-final.json > /tmp/117-r2-T14-verde-final.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        5.86 s, estimated 6 s
exit=0
```

Commit T14: `2ad3fb99` test(mobile): lock forgot-error clearing as soon as a new request starts (#117 R7, E1). Solo `mobile-pet-tracker/src/screens/forgot/index.test.tsx`.

#### T15-verde-inicial

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-T15-verde-inicial.json > /tmp/117-r2-T15-verde-inicial.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        6.278 s
exit=0
```

### Sonda M9-e

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M9-e

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M9-e.json > /tmp/117-r2-M9-e.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 26 passed, 27 total
Snapshots:   0 total
Time:        6.216 s, estimated 7 s
exit=1
```

`#117 R9: las métricas del stub sobreviven al cambio de estado forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "flex-1 bg-background"
Received: "flex-1"
    at Object.toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:343:63)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M9-e | `forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados` | aserción, `toBe`. Segunda aserción className. Expected: flex-1 bg-background; Received: flex-1 | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M9-f

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M9-f

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M9-f.json > /tmp/117-r2-M9-f.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 26 passed, 27 total
Snapshots:   0 total
Time:        6.564 s, estimated 7 s
exit=1
```

`#117 R9: las métricas del stub sobreviven al cambio de estado forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "automatic"
Received: "never"
    at Object.toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:344:84)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M9-f | `forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados` | aserción, `toBe`. Segunda aserción contentInsetAdjustmentBehavior. Expected: automatic; Received: never | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

### Sonda M9-g

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M9-g

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M9-g.json > /tmp/117-r2-M9-g.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 26 passed, 27 total
Snapshots:   0 total
Time:        6.496 s, estimated 7 s
exit=1
```

`#117 R9: las métricas del stub sobreviven al cambio de estado forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "flex-1 bg-background"
Received: "flex-1"
    at Object.toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:339:63)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M9-g | `forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados` | aserción, `toBe`. Primera aserción className. Expected: flex-1 bg-background; Received: flex-1 | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T15-verde-final

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-T15-verde-final.json > /tmp/117-r2-T15-verde-final.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        6.021 s, estimated 7 s
exit=0
```

Commit T15: `3f347525` test(mobile): lock the forgot scroll container props in both states (#117 R9, E1). Solo `mobile-pet-tracker/src/screens/forgot/index.test.tsx`.

#### T16-verde-inicial

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-T16-verde-inicial.json > /tmp/117-r2-T16-verde-inicial.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        6.903 s
exit=0
```

### Sonda M3-e

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M3-e

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M3-e.json > /tmp/117-r2-M3-e.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        7.04 s
exit=1
```

`#117 R3: la ruta forgot delega en ForgotScreen link-login navega a /login también desde «Revisa tu correo», sin petición nueva`

```text
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "/login"
Received: "/"

Number of calls: 1
    at Object.toHaveBeenCalledWith (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:74:29)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M3-e | `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | aserción, `toHaveBeenCalledWith`. Expected: /login; Received: / | link-login navega a /login sin petición de red: passed |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T16-verde-final

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-T16-verde-final.json > /tmp/117-r2-T16-verde-final.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        7.126 s
exit=0
```

Commit T16: `99c5b354` test(mobile): lock link-login from the sent state (#117 R3, E1). Solo `mobile-pet-tracker/src/screens/forgot/index.test.tsx`.

#### T17-verde-inicial

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-T17-verde-inicial.json > /tmp/117-r2-T17-verde-inicial.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        7.252 s
exit=0
```

### Sonda M5-g

Cambio temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`; no se añade al índice.

#### M5-g

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-M5-g.json > /tmp/117-r2-M5-g.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 28 passed, 29 total
Snapshots:   0 total
Time:        6.742 s, estimated 8 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» el tile Lock sigue en pie en los dos estados`

```text
Error: expect(received).toBeDefined()

Received: undefined
    at Object.toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:8)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | it que cayó | Modo / matcher / Expected y Received | Debe seguir verde (medido) |
|---|---|---|---|
| M5-g | `el tile Lock sigue en pie en los dos estados` | aserción, `toBeDefined`. Segunda comprobación del tile. Expected: defined; Received: undefined | — (sin cláusula en la tabla) |

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T17-verde-final

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r2-T17-verde-final.json > /tmp/117-r2-T17-verde-final.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        6.105 s, estimated 7 s
exit=0
```

#### Guard de router antes de typecheck-T17

```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
```

#### typecheck-T17

```text
$ bun run typecheck > /tmp/117-r2-typecheck-T17.log 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
```

Commit T17: `2c6a2210` test(mobile): lock the Lock tile in both states (#117 R5, E1). Solo `mobile-pet-tracker/src/screens/forgot/index.test.tsx`.

#### Guard de carga antes de ocho

```text
$ pgrep -f init.sh; echo "exit=$?"
exit=1
```

#### ocho

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/reset-password/index.test.tsx src/screens/forgot/index.test.tsx > /tmp/117-r2-ocho.log 2>&1; echo "exit=$?"
Test Suites: 8 passed, 8 total
Tests:       285 passed, 285 total
Snapshots:   0 total
Time:        7.077 s
exit=0
```

#### Guard de carga antes de global

```text
$ pgrep -f init.sh; echo "exit=$?"
exit=1
```

#### global

```text
$ bunx jest --maxWorkers=2 > /tmp/117-r2-global.log 2>&1; echo "exit=$?"
Test Suites: 93 passed, 93 total
Tests:       2049 passed, 2049 total
Snapshots:   1 passed, 1 total
Time:        62.499 s, estimated 66 s
exit=0
```

### Resumen por tarea de E1

Los comandos, resúmenes Jest y fallos completos se conservan arriba. Todas las reversiones dieron 0 en el diff de producción y 0 en el diff del índice antes del commit.

#### T12

Verde inicial y final: 1 suite / 44 tests, exit=0 en ambos.

| Sonda | it que cayó | Consulta / aserción; matcher y Expected/Received | Debe seguir verde (resultado) | Reversión producción / índice |
|---|---|---|---|---|
| M2-f | `mapea 201 a error`<br>`mapea 302 a error`<br>`mapea 404 a error` | aserción, `resolves.toEqual`; Expected kind: 'error'; Received kind: 'ok' | — | exit=0 / exit=0 |
| M2-g | `mapea 201 a error` | aserción, `resolves.toEqual`; Expected kind: 'error'; Received kind: 'ok' | — | exit=0 / exit=0 |
| M2-h | `mapea 503 a error` | aserción, `resolves.toEqual`; Expected kind: 'error'; Received kind: 'ok' | — | exit=0 / exit=0 |
| M2-i | `mapea 302 a error` | aserción, `resolves.toEqual`; Expected kind: 'error'; Received kind: 'ok' | — | exit=0 / exit=0 |

Commit: `a3426e90` test(mobile): lock every other status as error in the forgot client (#117 R2, E1).

#### T13

Verde inicial y final: 1 suite / 24 tests, exit=0 en ambos.

| Sonda | it que cayó | Consulta / aserción; matcher y Expected/Received | Debe seguir verde (resultado) | Reversión producción / índice |
|---|---|---|---|---|
| M6-e | `un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»` | consulta, `getByText`; Consulta getByText('Revisa tu correo'): Unable to find an element with text: Revisa tu correo | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`: verde | exit=0 / exit=0 |
| M6-f | `un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»` | consulta, `getByText`; Consulta getByText('Revisa tu correo'): Unable to find an element with text: Revisa tu correo | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`: verde | exit=0 / exit=0 |
| M6-g | `un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | consulta, `getByText`; Consulta getByText('Revisa tu correo'): Unable to find an element with text: Revisa tu correo | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`: verde | exit=0 / exit=0 |

Commit: `7c2937e2` test(mobile): lock resend errors for every non-ok kind (#117 R6, E1).

#### T14

Verde inicial y final: 1 suite / 26 tests, exit=0 en ambos.

| Sonda | it que cayó | Consulta / aserción; matcher y Expected/Received | Debe seguir verde (resultado) | Reversión producción / índice |
|---|---|---|---|---|
| M7-h | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción, `toBeNull`; Expected: null; Received: nodo Text forgot-error con el error anterior mientras vuela la petición | `un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»`: verde | exit=0 / exit=0 |
| M7-i | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción, `toBeNull`; Expected: null; Received: nodo Text forgot-error con Demasiados intentos. Inténtalo más tarde. | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`: verde | exit=0 / exit=0 |
| M4-f | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción, `toBeNull`; Expected: null; Received: nodo forgot-resend durante el envío del formulario | — | exit=0 / exit=0 |
| M6-h | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción, `toHaveTextContent`; Expected: Si existe una cuenta para Ana@Example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.; Received: Si existe una cuenta para , te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam. | — | exit=0 / exit=0 |
| M6-i | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción, `toEqual`; Expected: { email: 'Ana@Example.com' }; Received: { email: '  Ana@Example.com ' } | — | exit=0 / exit=0 |

Commit: `2ad3fb99` test(mobile): lock forgot-error clearing as soon as a new request starts (#117 R7, E1).

#### T15

Verde inicial y final: 1 suite / 27 tests, exit=0 en ambos.

| Sonda | it que cayó | Consulta / aserción; matcher y Expected/Received | Debe seguir verde (resultado) | Reversión producción / índice |
|---|---|---|---|---|
| M9-e | `forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados` | aserción, `toBe`; Segunda aserción className. Expected: flex-1 bg-background; Received: flex-1 | — | exit=0 / exit=0 |
| M9-f | `forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados` | aserción, `toBe`; Segunda aserción contentInsetAdjustmentBehavior. Expected: automatic; Received: never | — | exit=0 / exit=0 |
| M9-g | `forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados` | aserción, `toBe`; Primera aserción className. Expected: flex-1 bg-background; Received: flex-1 | — | exit=0 / exit=0 |

Commit: `3f347525` test(mobile): lock the forgot scroll container props in both states (#117 R9, E1).

#### T16

Verde inicial y final: 1 suite / 28 tests, exit=0 en ambos.

| Sonda | it que cayó | Consulta / aserción; matcher y Expected/Received | Debe seguir verde (resultado) | Reversión producción / índice |
|---|---|---|---|---|
| M3-e | `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | aserción, `toHaveBeenCalledWith`; Expected: /login; Received: / | `link-login navega a /login sin petición de red`: verde | exit=0 / exit=0 |

Commit: `99c5b354` test(mobile): lock link-login from the sent state (#117 R3, E1).

#### T17

Verde inicial y final: 1 suite / 29 tests, exit=0 en ambos.

| Sonda | it que cayó | Consulta / aserción; matcher y Expected/Received | Debe seguir verde (resultado) | Reversión producción / índice |
|---|---|---|---|---|
| M5-g | `el tile Lock sigue en pie en los dos estados` | aserción, `toBeDefined`; Segunda comprobación del tile. Expected: defined; Received: undefined | — | exit=0 / exit=0 |

Commit: `2c6a2210` test(mobile): lock the Lock tile in both states (#117 R5, E1).

### Decisiones y alcance de E1

Sin decisiones nuevas de comportamiento. En T17 se filtran los hijos string antes de leer props, se compara className por igualdad estricta y se reacquiere forgot-title tras enviar; casts mínimos `unknown[]` y `{ props: { className?: string } }`, sin any explícito, validados por tsc antes del commit.

E1.5 conserva intacto el it existente y registra `7ba0b3a9`; E1.8 no añade it ni commit. Ningún it existente se modificó, renombró o reordenó: los diffs de tests son solo adiciones (+6/−0 en auth y +97/−0 en forgot). No se cargaron skills adicionales en esta ronda. Los guards pgrep se ejecutan literalmente por stdin de bash para evitar que la línea del propio shell se identifique como init.sh. No se lanzó init.sh, expo, graphify, push ni PR; smoke y bookkeeping siguen a cargo del humano/leader.

#### Guard de router antes de typecheck

```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
```

#### lint

```text
$ bun run lint > /tmp/117-r2-lint.log 2>&1; echo "exit=$?"
$ expo lint
exit=0
```

#### typecheck

```text
$ bun run typecheck > /tmp/117-r2-typecheck.log 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
```

### T18 — cierre verificado

| Suite | Base ronda 2 | Cierre | Delta |
|---|---:|---:|---:|
| auth.test.ts | 40 | 44 | +4 |
| screens/forgot/index.test.tsx | 20 | 29 | +9 |
| language-provider.test.tsx | 24 | 24 | 0 |
| ui-language.test.ts | 29 | 29 | 0 |
| consistency-classnames.test.ts | 55 | 55 | 0 |
| legibility-classnames.test.ts | 26 | 26 | 0 |
| design-drift.test.ts | 59 | 59 | 0 |
| screens/reset-password/index.test.tsx | 19 | 19 | 0 |
| 8 suites | 272 | 285 | +13 |
| Global (93 suites) | 2036 | 2049 | +13 |

Typecheck previo a T17 y de cierre: exit=0, con router.d.ts ausente en cada guard. Lint: exit=0. Los 17 fallos de sonda y sus dos guards de reversión coinciden con las tablas de T12–T17; los seis verdes iniciales y finales pasan. Los seis commits test llevan solo su fichero de test. El cierre documental lleva solo traceability e impl; su hash se identifica con `git log -1` para evitar una autorreferencia que lo cambiaría.

### Alcance final contra H0 de ronda 2

Medición contra HEAD tras el commit documental; se comprueba de nuevo la misma lista en el HEAD definitivo al añadir este registro al cierre. Los hashes de los seis commits test no cambian.

```text
$ git diff --name-only 453d0cd8 HEAD
mobile-pet-tracker/src/api/__tests__/auth.test.ts
mobile-pet-tracker/src/screens/forgot/index.test.tsx
progress/impl_mobile-forgot-password.md
specs/mobile-forgot-password/traceability.md
$ git diff --quiet 453d0cd8 HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx mobile-pet-tracker/src/api/auth.ts; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git diff --check 453d0cd8 HEAD; echo "exit=$?"
exit=0
$ git status --short
 M progress/impl_mobile-forgot-password.md
exit=1 (script de registro; AssertionError al exigir status vacío mientras el impl se escribía)
```

La secuencia se detuvo al recibir exit=1; no se lanzó ninguna medición dependiente. Los cuatro checks anteriores del alcance pasaron: lista exacta de 4 ficheros, producción sin diff, índice vacío y diff --check exit=0. El status mostrado corresponde al propio registro aún sin añadir al cierre, no a un cambio extra. Se cierra este bloque y se incorpora el registro al mismo commit documental; la limpieza se comprueba después de ese commit, sin volver a escribir en el impl.

Ronda 2: 6 commits test y un cierre documental, 13 casos nuevos y 17 sondas revertidas. 8 suites / 285 tests y global 93 / 2049, typecheck y lint con exit=0. Sin cambios de dependencias ni candados globales. Lista cerrada de cuatro ficheros respetada; el smoke humano sigue sin marcar.

## Ronda 3

Arranque (2026-10-05). H0 de ronda 3: `68ad1bb2`.

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-backend
$ git branch --show-current
feature/117-mobile-forgot-password
$ git rev-parse --short HEAD
68ad1bb2
```

Sin skills adicionales: esta ronda cambia solo tests, con helpers y puntos cerrados por E2.

### Anclas de arranque

```text
$ M=mobile-pet-tracker/src
$ git diff --quiet 49de71b6 HEAD -- mobile-pet-tracker; echo "exit=$?"
exit=0
$ test ! -e mobile-pet-tracker/.expo/types/router.d.ts; echo "exit=$?"
exit=0
$ grep -cF "expect(screen.getByTestId('forgot-email')).toBeVisible();" $M/screens/forgot/index.test.tsx
1
$ grep -cF "await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());" $M/screens/forgot/index.test.tsx
2
$ grep -cF "expect(screen.queryByTestId('forgot-resend')).toBeNull();" $M/screens/forgot/index.test.tsx
3
$ grep -cF "expect(mockForgotPassword.mock.calls[1][1]).toEqual(mockForgotPassword.mock.calls[0][1]);" $M/screens/forgot/index.test.tsx
1
$ grep -cF "expect(screen.queryByTestId('forgot-error')).toBeNull();" $M/screens/forgot/index.test.tsx
7
$ grep -cF "await submitForgot();" $M/screens/forgot/index.test.tsx
9
$ grep -cF "expect(screen.getByTestId('forgot-email').props.value).toBe('ana@example.com');" $M/screens/forgot/index.test.tsx
1
$ grep -cF "async function submitForgot(email = 'ana@example.com') {" $M/screens/forgot/index.test.tsx
1
$ grep -cF "const mockForgotPassword = jest.mocked(forgotPassword);" $M/screens/forgot/index.test.tsx
1
$ grep -cF "const mockRouter = jest.mocked(router);" $M/screens/forgot/index.test.tsx
1
$ grep -cF "describe('#117 R5: enviar pasa la pantalla a «Revisa tu correo»'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "describe('#117 R7: cada kind distinto de ok pinta su copy en forgot-error'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "describe('#117 R6: reenviar repite la misma petición'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "describe('#117 R8: forgot se aparta del teclado en Android'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('pinta título, instrucciones y forgot-email editable con sus props de teclado'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('deshabilita forgot-submit con el correo vacío o solo espacios y lo habilita al escribir'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('tras ok muestra cabecera y cuerpo con el correo, forgot-resend y link-login, y retira forgot-email y forgot-submit'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('el tile Lock sigue en pie en los dos estados'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "('mapea %p a «%s» en forgot-error, seleccionable, y deja el formulario en pie'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "('un %p al reenviar pinta «%s» en forgot-error sin salir de «Revisa tu correo»'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('link-login navega a /login sin petición de red'" $M/screens/forgot/index.test.tsx
1
$ grep -cF "it('link-login navega a /login también desde «Revisa tu correo», sin petición nueva'" $M/screens/forgot/index.test.tsx
1
$ grep -cE "expectFormState|expectSentState|expectForgotError|expectLinkLoginNavigates|lockTile|LOCK_TILE_CLASS" $M/screens/forgot/index.test.tsx
0
$ grep -cF "vuelve a fallar pinta el copy del nuevo kind" $M/screens/forgot/index.test.tsx
0
$ grep -cF -- "-[" $M/screens/forgot/index.test.tsx
0
$ grep -cF "{sent ? t('forgot.checkYourEmail') : t('forgot.forgotPassword')}" $M/screens/forgot/index.tsx
1
$ grep -cF "{sent ? t('forgot.sentTo', { email: submittedEmail }) : t('forgot.instructions')}" $M/screens/forgot/index.tsx
1
$ grep -cF "{!sent ? (" $M/screens/forgot/index.tsx
2
$ grep -cF "{sent ? (" $M/screens/forgot/index.tsx
1
$ grep -cF "{error ? (" $M/screens/forgot/index.tsx
1
$ grep -cF '<TextField className="w-full">' $M/screens/forgot/index.tsx
1
$ grep -cF '<Label className="text-xs font-semibold text-foreground">' $M/screens/forgot/index.tsx
1
$ grep -cF 'testID="forgot-email"' $M/screens/forgot/index.tsx
1
$ grep -cF 'testID="forgot-submit"' $M/screens/forgot/index.tsx
1
$ grep -cF "isDisabled={email.trim() === '' || submitting}" $M/screens/forgot/index.tsx
1
$ grep -cF '<Text testID="forgot-error" className="text-danger" selectable>' $M/screens/forgot/index.tsx
1
$ grep -cF "<LinkButton testID=\"link-login\" onPress={() => router.push('/login')}>" $M/screens/forgot/index.tsx
1
$ grep -cF '</LinkButton>' $M/screens/forgot/index.tsx
1
$ grep -cF "{t('forgot.backToSignIn')}" $M/screens/forgot/index.tsx
1
$ grep -cF 'className="size-16 items-center justify-center rounded-xl bg-accent-soft"' $M/screens/forgot/index.tsx
1
$ grep -cF 'setError(null);' $M/screens/forgot/index.tsx
1
$ grep -cF "setError(t('forgot.invalidEmail'));" $M/screens/forgot/index.tsx
1
$ grep -cF "setError(t('forgot.tooManyAttempts'));" $M/screens/forgot/index.tsx
1
$ grep -cF "setError(t('common.somethingWentWrong'));" $M/screens/forgot/index.tsx
1
$ grep -cF "setError(t('common.cannotReachServer'));" $M/screens/forgot/index.tsx
1
$ grep -cF '} finally {' $M/screens/forgot/index.tsx
1
$ grep -cF 'setSubmitting(false);' $M/screens/forgot/index.tsx
1
$ grep -cF 'setEmail(' $M/screens/forgot/index.tsx
0
```

56 anclas verificadas; todas coinciden.

### Base medida

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx > /tmp/117-r3-base.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        7.477 s
exit=0
```

Lecturas completas: requirements.md §E2 (E2.1–E2.7), tasks.md §E2 (T19–T21, notas y No hacer), review §Ronda 2 y §Barrido previo a la firma de E2 con su Remedición, suite y producción actuales; convención de esperas sobre el árbol.

### Generación de T19 — comprobación del script temporal

`python3 /tmp/117-r3-build.py T19`: exit=1 antes de TEST.write_text; ninguna edición del test ni medición dependiente. La validación leía l[1:] de ndiff, conservando el espacio separador de "- ". Expected: 4 espacios de sangría en las tres bajas; Received: 5. Se corrige únicamente el lector temporal a l[2:], conservando el candado de exactamente las tres bajas prescritas. No se modifica ninguna aserción de la suite.

#### T19-verde-inicial

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-T19-verde-inicial.json > /tmp/117-r3-T19-verde-inicial.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        6.999 s, estimated 8 s
exit=0
```

#### T19 — X-a

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### X-a

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-a.json > /tmp/117-r3-X-a.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
Snapshots:   0 total
Time:        8.341 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Recuperar contraseña
Received:
  Revisa tu correo
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:186:46)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:209:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Recuperar contraseña
Received:
  Revisa tu correo
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:186:46)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:313:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-a | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Recuperar contraseña<br>Received:<br>  Revisa tu correo<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:186:46)<br>    at Generator.next (<anonymous>) | exigido |
| X-a | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Recuperar contraseña<br>Received:<br>  Revisa tu correo<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:186:46)<br>    at Generator.next (<anonymous>) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — X-b

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### X-b

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-b.json > /tmp/117-r3-X-b.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
Snapshots:   0 total
Time:        9.929 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
Received:
  Si existe una cuenta para , te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:209:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
Received:
  Si existe una cuenta para , te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:313:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-b | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>Received:<br>  Si existe una cuenta para , te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-b | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>Received:<br>  Si existe una cuenta para , te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)<br>    at Generator.next (<anonymous>) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — X-c

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### X-c

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-c.json > /tmp/117-r3-X-c.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       7 failed, 23 passed, 30 total
Snapshots:   0 total
Time:        12.68 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
Received:
  Ingresa un correo electrónico válido
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
Received:
  Demasiados intentos. Inténtalo más tarde.
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
Received:
  Algo salió mal
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
Received:
  No se pudo conectar con el servidor
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
Received:
  Algo salió mal
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
Received:
  Demasiados intentos. Inténtalo más tarde.
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:282:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
Received:
  Algo salió mal
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:307:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-c | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>Received:<br>  Ingresa un correo electrónico válido<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-c | `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>Received:<br>  Demasiados intentos. Inténtalo más tarde.<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-c | `mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>Received:<br>  Algo salió mal<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-c | `mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>Received:<br>  No se pudo conectar con el servidor<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-c | `mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>Received:<br>  Algo salió mal<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-c | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>Received:<br>  Demasiados intentos. Inténtalo más tarde.<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-c | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>Received:<br>  Algo salió mal<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:187:45)<br>    at Generator.next (<anonymous>) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — X-d

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### X-d

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-d.json > /tmp/117-r3-X-d.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
Snapshots:   0 total
Time:        9.689 s, estimated 13 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:209:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:313:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-d | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-d | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `link-login navega a /login sin petición de red` | passed |
| `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — X-e

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### X-e

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-e.json > /tmp/117-r3-X-e.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       7 failed, 23 passed, 30 total
Snapshots:   0 total
Time:        9.562 s, estimated 10 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Ingresa un correo electrónico válido
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Demasiados intentos. Inténtalo más tarde.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          No se pudo conectar con el servidor
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="ana@example.com"
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Demasiados intentos. Inténtalo más tarde.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:282:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:307:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-e | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `link-login navega a /login sin petición de red` | passed |
| `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — X-f

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### X-f

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-f.json > /tmp/117-r3-X-f.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       7 failed, 23 passed, 30 total
Snapshots:   0 total
Time:        8.757 s, estimated 10 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with text: Correo electrónico

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Ingresa un correo electrónico válido
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:188:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with text: Correo electrónico

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Demasiados intentos. Inténtalo más tarde.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:188:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with text: Correo electrónico

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:188:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with text: Correo electrónico

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          No se pudo conectar con el servidor
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:188:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with text: Correo electrónico

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:188:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:265:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: Unable to find an element with text: Correo electrónico

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="ana@example.com"
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Demasiados intentos. Inténtalo más tarde.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:188:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:282:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: Unable to find an element with text: Correo electrónico

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByText (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:188:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:307:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-f | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with text: Correo electrónico<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-f | `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with text: Correo electrónico<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-f | `mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with text: Correo electrónico<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-f | `mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with text: Correo electrónico<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-f | `mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with text: Correo electrónico<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-f | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | consulta: Error: Unable to find an element with text: Correo electrónico<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-f | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | consulta: Error: Unable to find an element with text: Correo electrónico<br><br><RNCSafeAreaProvider><br>  <View | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `pinta título, instrucciones y forgot-email editable con sus props de teclado` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M3-f

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M3-f

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M3-f.json > /tmp/117-r3-M3-f.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
Snapshots:   0 total
Time:        6.335 s, estimated 9 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M3-f | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 0<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-f | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 0<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `link-login navega a /login sin petición de red` | passed |
| `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M3-g

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M3-g

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M3-g.json > /tmp/117-r3-M3-g.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
Snapshots:   0 total
Time:        6.536 s, estimated 7 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Volver al inicio de sesión
Received:
  Reenviar
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:44)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:209:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Volver al inicio de sesión
Received:
  Reenviar
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:44)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:313:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M3-g | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Volver al inicio de sesión<br>Received:<br>  Reenviar<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:44)<br>    at Generator.next (<anonymous>) | exigido |
| M3-g | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Volver al inicio de sesión<br>Received:<br>  Reenviar<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:44)<br>    at Generator.next (<anonymous>) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `link-login navega a /login sin petición de red` | passed |
| `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M3-h

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M3-h

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M3-h.json > /tmp/117-r3-M3-h.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       7 failed, 23 passed, 30 total
Snapshots:   0 total
Time:        6.324 s, estimated 7 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 2
Received number of calls: 3
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M3-h | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 2<br>Received number of calls: 3<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `link-login navega a /login sin petición de red` | passed |
| `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M4-f

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M4-f

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M4-f.json > /tmp/117-r3-M4-f.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
Snapshots:   0 total
Time:        6.466 s, estimated 7 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(received).toBeNull()

Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": true, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-secondary button__root--size-md disabled:element-disabled w-full rounded-xl" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-resend"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-secondary button__label--size-md font-bold text-foreground">Reenviar</Text></View>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:191:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:209:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(received).toBeNull()

Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": true, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-secondary button__root--size-md disabled:element-disabled w-full rounded-xl" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-resend"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-secondary button__label--size-md font-bold text-foreground">Reenviar</Text></View>
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:312:51)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M4-f | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(received).toBeNull()<br><br>Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": true, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-secondary button__root--size-md disabled:element-disabled w-full rounded-xl" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-resend"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-secondary button__label--size-md font-bold text-foreground">Reenviar</Text></View><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:191:49)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/as | exigido |
| M4-f | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(received).toBeNull()<br><br>Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": true, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-secondary button__root--size-md disabled:element-disabled w-full rounded-xl" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-resend"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-secondary button__label--size-md font-bold text-foreground">Reenviar</Text></View><br>    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:312:51)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpe | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M4-g

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M4-g

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M4-g.json > /tmp/117-r3-M4-g.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 29 passed, 30 total
Snapshots:   0 total
Time:        7.606 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "  Ana@Example.com "
Received: "Ana@Example.com"
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M4-g | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: "  Ana@Example.com "<br>Received: "Ana@Example.com"<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie` | passed |
| `mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | passed |
| `mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie` | passed |
| `mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M4-h

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M4-h

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M4-h.json > /tmp/117-r3-M4-h.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       7 failed, 23 passed, 30 total
Snapshots:   0 total
Time:        9.148 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "  Ana@Example.com "
Received: "Ana@Example.com"
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:189:58)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:209:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "  Ana@Example.com "
Received: "Ana@Example.com"
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "  Ana@Example.com "
Received: "Ana@Example.com"
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "  Ana@Example.com "
Received: "Ana@Example.com"
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "  Ana@Example.com "
Received: "Ana@Example.com"
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "  Ana@Example.com "
Received: "Ana@Example.com"
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "  Ana@Example.com "
Received: "Ana@Example.com"
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:189:58)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:307:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M4-h | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: "  Ana@Example.com "<br>Received: "Ana@Example.com"<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:189:58)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M4-h | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: "  Ana@Example.com "<br>Received: "Ana@Example.com"<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M4-h | `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: "  Ana@Example.com "<br>Received: "Ana@Example.com"<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M4-h | `mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: "  Ana@Example.com "<br>Received: "Ana@Example.com"<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M4-h | `mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: "  Ana@Example.com "<br>Received: "Ana@Example.com"<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M4-h | `mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: "  Ana@Example.com "<br>Received: "Ana@Example.com"<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:262:60)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M4-h | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: "  Ana@Example.com "<br>Received: "Ana@Example.com"<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:189:58)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M4-i

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M4-i

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M4-i.json > /tmp/117-r3-M4-i.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       5 failed, 25 passed, 30 total
Snapshots:   0 total
Time:        7.107 s, estimated 9 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`

```text
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
    at toBeDisabled (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:267:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`

```text
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
    at toBeDisabled (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:267:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
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
    at toBeDisabled (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:267:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`

```text
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
    at toBeDisabled (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:267:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
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
    at toBeDisabled (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:267:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M4-i | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(instance).toBeDisabled()<br><br>Received instance is not disabled:<br>  <View<br>    accessibilityRole="button"<br>    accessibilityState={ | exigido |
| M4-i | `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(instance).toBeDisabled()<br><br>Received instance is not disabled:<br>  <View<br>    accessibilityRole="button"<br>    accessibilityState={ | exigido |
| M4-i | `mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(instance).toBeDisabled()<br><br>Received instance is not disabled:<br>  <View<br>    accessibilityRole="button"<br>    accessibilityState={ | exigido |
| M4-i | `mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(instance).toBeDisabled()<br><br>Received instance is not disabled:<br>  <View<br>    accessibilityRole="button"<br>    accessibilityState={ | exigido |
| M4-i | `mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(instance).toBeDisabled()<br><br>Received instance is not disabled:<br>  <View<br>    accessibilityRole="button"<br>    accessibilityState={ | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `deshabilita forgot-submit con el correo vacío o solo espacios y lo habilita al escribir` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M5-h

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M5-h

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M5-h.json > /tmp/117-r3-M5-h.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
Snapshots:   0 total
Time:        7.828 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(received).toBeDefined()

Received: undefined
    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:193:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:209:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(received).toBeDefined()

Received: undefined
    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:193:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:313:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M5-h | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(received).toBeDefined()<br><br>Received: undefined<br>    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:193:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-h | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(received).toBeDefined()<br><br>Received: undefined<br>    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:193:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `el tile Lock sigue en pie en los dos estados` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M7-k

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M7-k

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M7-k.json > /tmp/117-r3-M7-k.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 27 passed, 30 total
Snapshots:   0 total
Time:        6.521 s, estimated 8 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(received).toBeNull()

Received: <Text className="text-danger" selectable={true} testID="forgot-error" />
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:168:50)
    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:194:3)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:209:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(received).toBeNull()

Received: <Text className="text-danger" selectable={true} testID="forgot-error" />
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:311:50)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(received).toBeNull()

Received: <Text className="text-danger" selectable={true} testID="forgot-error" />
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:333:50)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M7-k | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="text-danger" selectable={true} testID="forgot-error" /><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:168:50)<br>    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:194:3)<br>    at Generator.next (<anonymous>) | exigido |
| M7-k | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="text-danger" selectable={true} testID="forgot-error" /><br>    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:311:50)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M7-k | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="text-danger" selectable={true} testID="forgot-error" /><br>    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:333:50)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M7-l

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M7-l

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M7-l.json > /tmp/117-r3-M7-l.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 29 passed, 30 total
Snapshots:   0 total
Time:        8.223 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`

```text
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
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:281:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M7-l | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(instance).not.toBeDisabled()<br><br>Received instance is disabled:<br>  <View<br>    accessibilityRole="button"<br>    accessibilityState={ | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M7-m

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M7-m

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M7-m.json > /tmp/117-r3-M7-m.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 29 passed, 30 total
Snapshots:   0 total
Time:        15.016 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: Unable to find an element with testID: forgot-error

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="ana@example.com"
          />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:280:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M7-m | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | consulta: Error: Unable to find an element with testID: forgot-error<br><br><RNCSafeAreaProvider><br>  <View | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19 — M7-n

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M7-n

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M7-n.json > /tmp/117-r3-M7-n.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 29 passed, 30 total
Snapshots:   0 total
Time:        9.928 s, estimated 15 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: Unable to find an element with testID: forgot-error

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="ana@example.com"
          />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:284:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M7-n | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | consulta: Error: Unable to find an element with testID: forgot-error<br><br><RNCSafeAreaProvider><br>  <View | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T19-verde-final

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-T19-verde-final.json > /tmp/117-r3-T19-verde-final.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        7.713 s, estimated 10 s
exit=0
```

#### Guard de router antes de typecheck-T19

```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
```

#### typecheck-T19

```text
$ bun run typecheck > /tmp/117-r3-typecheck-T19.log 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
```

#### lint-T19

```text
$ bun run lint > /tmp/117-r3-lint-T19.log 2>&1; echo "exit=$?"
$ expo lint
exit=0
```

Commit T19: `c783b41e` test(mobile): lock the form render in every unsent flow (#117 R4, R7, R3, E2). Solo `mobile-pet-tracker/src/screens/forgot/index.test.tsx`.

#### T20-verde-inicial

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-T20-verde-inicial.json > /tmp/117-r3-T20-verde-inicial.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        9.162 s
exit=0
```

#### T20 — X-g

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### X-g

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-g.json > /tmp/117-r3-X-g.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       6 failed, 25 passed, 31 total
Snapshots:   0 total
Time:        11.267 s
exit=1
```

`#117 R6: reenviar repite la misma petición un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
Received:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:392:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
Received:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
Received:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
Received:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
Received:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
Received:
  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:429:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-g | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.<br>Received:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-g | `un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.<br>Received:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-g | `un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.<br>Received:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-g | `un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.<br>Received:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-g | `un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.<br>Received:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)<br>    at Generator.next (<anonymous>) | exigido |
| X-g | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.<br>Received:<br>  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:200:45)<br>    at Generator.next (<anonymous>) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — X-h

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

### Auditoría literal de E2 (solo lectura)

El bloque completo de helpers E2.4 y ambos bloques E2.7 están copiados literalmente en la suite. Todos los títulos existentes conservan su orden; solo se añaden E2.7a y E2.7b. Las únicas líneas retiradas contra H0 son los tres cambios prescritos en E2.5 (dos submitForgot y un valor de forgot-email). No hay literales de clases arbitrarias. Numstat actual del test: +114 / −3.

#### X-h

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-h.json > /tmp/117-r3-X-h.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       6 failed, 25 passed, 31 total
Snapshots:   0 total
Time:        15.179 s
exit=1
```

`#117 R6: reenviar repite la misma petición un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBeNull()

Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:392:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBeNull()

Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBeNull()

Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": {"callStart": null, "callback": undefined, "current": 1, "easing": [Function reactNativeReanimated_EasingJs19], "onFrame": [Function timing], "onStart": [Function anonymous], "progress": 0, "reduceMotion": false, "startTime": undefined, "startValue": 1, "timestamp": undefined, "toValue": 1, "type": "timing"}}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBeNull()

Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBeNull()

Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: expect(received).toBeNull()

Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:429:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-h | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBeNull()<br><br>Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/h | exigido |
| X-h | `un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBeNull()<br><br>Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/h | exigido |
| X-h | `un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBeNull()<br><br>Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": {"callStart": null, "callback": undefined, "current": 1, "easing": [Function reactNativeReanimated_EasingJs19], "onFrame": [Function timing], "onStart": [Function anonymous], "progress": 0, "reduceMotion": false, "startTime": undefined, "startValue": 1, "timestamp": undefined, "toValue": 1, "type": "timing"}}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar en | exigido |
| X-h | `un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBeNull()<br><br>Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/h | exigido |
| X-h | `un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBeNull()<br><br>Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/h | exigido |
| X-h | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(received).toBeNull()<br><br>Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="forgot-submit"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": NaN}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Enviar enlace de recuperación</Text></View><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:203:49)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/h | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — X-i

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### X-i

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-i.json > /tmp/117-r3-X-i.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 29 passed, 31 total
Snapshots:   0 total
Time:        10.25 s, estimated 15 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Revisa tu correo
Received:
  Recuperar contraseña
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:199:46)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:350:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Revisa tu correo
Received:
  Recuperar contraseña
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:199:46)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:374:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-i | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Revisa tu correo<br>Received:<br>  Recuperar contraseña<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:199:46)<br>    at Generator.next (<anonymous>) | exigido |
| X-i | `forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Revisa tu correo<br>Received:<br>  Recuperar contraseña<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:199:46)<br>    at Generator.next (<anonymous>) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M5-i

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M5-i

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M5-i.json > /tmp/117-r3-M5-i.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       10 failed, 21 passed, 31 total
Snapshots:   0 total
Time:        10.016 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» tras ok muestra cabecera y cuerpo con el correo, forgot-resend y link-login, y retira forgot-email y forgot-submit`

```text
Error: expect(received).toBeNull()

Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:209:2)
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:239:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(received).toBeNull()

Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:332:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(received).toBeNull()

Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:350:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela`

```text
Error: expect(received).toBeNull()

Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:374:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBeNull()

Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:392:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBeNull()

Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBeNull()

Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBeNull()

Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBeNull()

Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: expect(received).toBeNull()

Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text>
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:429:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M5-i | `tras ok muestra cabecera y cuerpo con el correo, forgot-resend y link-login, y retira forgot-email y forgot-submit` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-i | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-i | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-i | `forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-i | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-i | `un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-i | `un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-i | `un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-i | `un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-i | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="font-normal label__text" style={[undefined, undefined]}>Correo electrónico</Text><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:201:52)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M5-j

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M5-j

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M5-j.json > /tmp/117-r3-M5-j.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 29 passed, 31 total
Snapshots:   0 total
Time:        11.079 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(received).toBeNull()

Received: <TextInput autoCapitalize="none" autoComplete="email" className="input__input ios:outline-2 ios:outline-transparent ios:focus:outline-accent android:border-[1.5px] android:border-transparent android:focus:border-accent rtl:text-right input__input--variant-primary ios:shadow-field android:shadow-sm rounded-xl bg-default" editable={true} keyboardType="email-address" onChangeText={[Function bound dispatchSetState]} placeholderTextColorClassName="accent-field-placeholder" selectionColorClassName="accent-accent" style={[{"borderCurve": "continuous"}, undefined]} testID="forgot-email" textContentType="emailAddress" value="  Ana@Example.com " />
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:202:48)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:350:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela`

```text
Error: expect(received).toBeNull()

Received: <TextInput autoCapitalize="none" autoComplete="email" className="input__input ios:outline-2 ios:outline-transparent ios:focus:outline-accent android:border-[1.5px] android:border-transparent android:focus:border-accent rtl:text-right input__input--variant-primary ios:shadow-field android:shadow-sm rounded-xl bg-default" editable={true} keyboardType="email-address" onChangeText={[Function bound dispatchSetState]} placeholderTextColorClassName="accent-field-placeholder" selectionColorClassName="accent-accent" style={[{"borderCurve": "continuous"}, undefined]} testID="forgot-email" textContentType="emailAddress" value="  Ana@Example.com " />
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:202:48)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:374:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M5-j | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción: Error: expect(received).toBeNull()<br><br>Received: <TextInput autoCapitalize="none" autoComplete="email" className="input__input ios:outline-2 ios:outline-transparent ios:focus:outline-accent android:border-[1.5px] android:border-transparent android:focus:border-accent rtl:text-right input__input--variant-primary ios:shadow-field android:shadow-sm rounded-xl bg-default" editable={true} keyboardType="email-address" onChangeText={[Function bound dispatchSetState]} placeholderTextColorClassName="accent-field-placeholder" selectionColorClassName="accent-accent" style={[{"borderCurve": "continuous"}, undefined]} testID="forgot-email" textContentType="emailAddress" value="  Ana@Example.com " /><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:202:48)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-j | `forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción: Error: expect(received).toBeNull()<br><br>Received: <TextInput autoCapitalize="none" autoComplete="email" className="input__input ios:outline-2 ios:outline-transparent ios:focus:outline-accent android:border-[1.5px] android:border-transparent android:focus:border-accent rtl:text-right input__input--variant-primary ios:shadow-field android:shadow-sm rounded-xl bg-default" editable={true} keyboardType="email-address" onChangeText={[Function bound dispatchSetState]} placeholderTextColorClassName="accent-field-placeholder" selectionColorClassName="accent-accent" style={[{"borderCurve": "continuous"}, undefined]} testID="forgot-email" textContentType="emailAddress" value="  Ana@Example.com " /><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:202:48)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M7-j

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M7-j

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M7-j.json > /tmp/117-r3-M7-j.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       6 failed, 25 passed, 31 total
Snapshots:   0 total
Time:        10.819 s, estimated 11 s
exit=1
```

`#117 R6: reenviar repite la misma petición un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)
    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:392:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)
    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)
    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)
    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)
    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)
    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:429:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M7-j | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: true<br>Received: false<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)<br>    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)<br>    at Generator.next (<anonymous>) | exigido |
| M7-j | `un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: true<br>Received: false<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)<br>    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)<br>    at Generator.next (<anonymous>) | exigido |
| M7-j | `un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: true<br>Received: false<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)<br>    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)<br>    at Generator.next (<anonymous>) | exigido |
| M7-j | `un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: true<br>Received: false<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)<br>    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)<br>    at Generator.next (<anonymous>) | exigido |
| M7-j | `un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: true<br>Received: false<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)<br>    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)<br>    at Generator.next (<anonymous>) | exigido |
| M7-j | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(received).toBe(expected) // Object.is equality<br><br>Expected: true<br>Received: false<br>    at toBe (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:173:33)<br>    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)<br>    at Generator.next (<anonymous>) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M6-j

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M6-j

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M6-j.json > /tmp/117-r3-M6-j.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 30 passed, 31 total
Snapshots:   0 total
Time:        9.561 s, estimated 11 s
exit=1
```

`#117 R6: reenviar repite la misma petición un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: Unable to find an element with testID: forgot-error

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Revisa tu correo
        </Text>
        <Text
          testID="forgot-body"
        >
          Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-resend"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Reenviar
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:427:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M6-j | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | consulta: Error: Unable to find an element with testID: forgot-error<br><br><RNCSafeAreaProvider><br>  <View | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M6-k

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M6-k

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M6-k.json > /tmp/117-r3-M6-k.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 30 passed, 31 total
Snapshots:   0 total
Time:        9.449 s, estimated 10 s
exit=1
```

`#117 R6: reenviar repite la misma petición un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: Unable to find an element with testID: forgot-error

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Revisa tu correo
        </Text>
        <Text
          testID="forgot-body"
        >
          Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-resend"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Reenviar
          </Text>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="link-login"
        >
          <Text>
            Volver al inicio de sesión
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:431:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M6-k | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | consulta: Error: Unable to find an element with testID: forgot-error<br><br><RNCSafeAreaProvider><br>  <View | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M7-o

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M7-o

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M7-o.json > /tmp/117-r3-M7-o.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 29 passed, 31 total
Snapshots:   0 total
Time:        8.956 s, estimated 10 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
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
    testID="forgot-resend"
  />
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:352:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind`

```text
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
    testID="forgot-resend"
  />
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:428:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M7-o | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción: Error: expect(instance).not.toBeDisabled()<br><br>Received instance is disabled:<br>  <View<br>    accessibilityRole="button"<br>    accessibilityState={ | exigido |
| M7-o | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(instance).not.toBeDisabled()<br><br>Received instance is disabled:<br>  <View<br>    accessibilityRole="button"<br>    accessibilityState={ | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M7-l

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M7-l

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M7-l.json > /tmp/117-r3-M7-l.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 29 passed, 31 total
Snapshots:   0 total
Time:        8.609 s, estimated 9 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`

```text
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
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:295:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
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
    testID="forgot-resend"
  />
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:331:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M7-l | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(instance).not.toBeDisabled()<br><br>Received instance is disabled:<br>  <View<br>    accessibilityRole="button"<br>    accessibilityState={ | exigido |
| M7-l | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(instance).not.toBeDisabled()<br><br>Received instance is disabled:<br>  <View<br>    accessibilityRole="button"<br>    accessibilityState={ | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| — | La fila no prescribe it verde |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — X-d

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### X-d

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-d.json > /tmp/117-r3-X-d.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 27 passed, 31 total
Snapshots:   0 total
Time:        6.544 s, estimated 9 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:222:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:327:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Revisa tu correo
        </Text>
        <Text
          testID="forgot-body"
        >
          Si existe una cuenta para Ana@Example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
          testID="forgot-resend"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Reenviar
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:350:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Revisa tu correo
        </Text>
        <Text
          testID="forgot-body"
        >
          Si existe una cuenta para Ana@Example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
          testID="forgot-resend"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Reenviar
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:374:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-d | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-d | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-d | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-d | `forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `link-login navega a /login sin petición de red` | passed |
| `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — X-e

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### X-e

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-X-e.json > /tmp/117-r3-X-e.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       13 failed, 18 passed, 31 total
Snapshots:   0 total
Time:        6.585 s, estimated 7 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Ingresa un correo electrónico válido
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:279:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Demasiados intentos. Inténtalo más tarde.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:279:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:279:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          No se pudo conectar con el servidor
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:279:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:279:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="ana@example.com"
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Demasiados intentos. Inténtalo más tarde.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:296:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Recuperar contraseña
        </Text>
        <Text
          testID="forgot-body"
        >
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <View>
          <View
            accessible={true}
          >
            <Text>
              Correo electrónico
            </Text>
          </View>
          <TextInput
            editable={true}
            testID="forgot-email"
            value="  Ana@Example.com "
          />
        </View>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-submit"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Enviar enlace de recuperación
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:321:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Revisa tu correo
        </Text>
        <Text
          testID="forgot-body"
        >
          Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
        <Text
          testID="forgot-error"
        >
          Demasiados intentos. Inténtalo más tarde.
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-resend"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Reenviar
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:392:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Revisa tu correo
        </Text>
        <Text
          testID="forgot-body"
        >
          Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
        <Text
          testID="forgot-error"
        >
          Ingresa un correo electrónico válido
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-resend"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Reenviar
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Revisa tu correo
        </Text>
        <Text
          testID="forgot-body"
        >
          Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-resend"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Reenviar
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Revisa tu correo
        </Text>
        <Text
          testID="forgot-body"
        >
          Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
        <Text
          testID="forgot-error"
        >
          No se pudo conectar con el servidor
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-resend"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Reenviar
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Revisa tu correo
        </Text>
        <Text
          testID="forgot-body"
        >
          Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-resend"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Reenviar
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:411:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: Unable to find an element with testID: link-login

<RNCSafeAreaProvider>
  <View
    testID="screen-forgot"
  >
    <RCTScrollView
      testID="forgot-form"
    >
      <View>
        <View>
          <RNSVGSvgView>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGSvgView>
        </View>
        <Text
          testID="forgot-title"
        >
          Revisa tu correo
        </Text>
        <Text
          testID="forgot-body"
        >
          Si existe una cuenta para ana@example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
        <Text
          testID="forgot-error"
        >
          Algo salió mal
        </Text>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,
            }
          }
          accessible={true}
          testID="forgot-resend"
        >
          <View
            pointerEvents="none"
            style={
              {
                "opacity": 0,
              }
            }
          />
          <Text>
            Reenviar
          </Text>
        </View>
      </View>
    </RCTScrollView>
  </View>
</RNCSafeAreaProvider>
    at getByTestId (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:17)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:429:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| X-e | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |
| X-e | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | consulta: Error: Unable to find an element with testID: link-login<br><br><RNCSafeAreaProvider><br>  <View | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `link-login navega a /login sin petición de red` | passed |
| `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M3-f

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M3-f

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M3-f.json > /tmp/117-r3-M3-f.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 27 passed, 31 total
Snapshots:   0 total
Time:        6.283 s, estimated 7 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M3-f | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 0<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-f | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 0<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-f | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 0<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-f | `forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 0<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:180:27)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `link-login navega a /login sin petición de red` | passed |
| `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M3-g

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M3-g

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M3-g.json > /tmp/117-r3-M3-g.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 27 passed, 31 total
Snapshots:   0 total
Time:        6.913 s, estimated 7 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Volver al inicio de sesión
Received:
  Reenviar
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:44)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:222:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Volver al inicio de sesión
Received:
  Reenviar
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:44)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:327:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Volver al inicio de sesión
Received:
  Reenviar
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:44)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:350:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Volver al inicio de sesión
Received:
  Reenviar
    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:44)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:374:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M3-g | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Volver al inicio de sesión<br>Received:<br>  Reenviar<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:44)<br>    at Generator.next (<anonymous>) | exigido |
| M3-g | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Volver al inicio de sesión<br>Received:<br>  Reenviar<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:192:44)<br>    at Generator.next (<anonymous>) | exigido |
| M3-g | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Volver al inicio de sesión<br>Received:<br>  Reenviar<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:44)<br>    at Generator.next (<anonymous>) | exigido |
| M3-g | `forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción: Error: expect(instance).toHaveTextContent()<br><br>Expected instance to have text content:<br>  Volver al inicio de sesión<br>Received:<br>  Reenviar<br>    at toHaveTextContent (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:205:44)<br>    at Generator.next (<anonymous>) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `link-login navega a /login sin petición de red` | passed |
| `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M3-h

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M3-h

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M3-h.json > /tmp/117-r3-M3-h.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       13 failed, 18 passed, 31 total
Snapshots:   0 total
Time:        6.549 s, estimated 7 s
exit=1
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 2
Received number of calls: 3
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 2
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`

```text
TypeError: Cannot read properties of undefined (reading 'kind')
    at kind (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.tsx:30:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 2
Received number of calls: 3
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`

```text
TypeError: Cannot read properties of undefined (reading 'kind')
    at kind (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.tsx:30:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 2
Received number of calls: 3
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
TypeError: Cannot read properties of undefined (reading 'kind')
    at kind (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.tsx:30:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 2
Received number of calls: 3
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`

```text
TypeError: Cannot read properties of undefined (reading 'kind')
    at kind (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.tsx:30:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 2
Received number of calls: 3
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`

```text
TypeError: Cannot read properties of undefined (reading 'kind')
    at kind (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.tsx:30:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 2
Received number of calls: 3
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind`

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 3
Received number of calls: 4
    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M3-h | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 2<br>Received number of calls: 3<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 1<br>Received number of calls: 2<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M3-h | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»` | excepción: TypeError: Cannot read properties of undefined (reading 'kind')<br>    at kind (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.tsx:30:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)<br>Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 2<br>Received number of calls: 3<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30) | exigido |
| M3-h | `un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»` | excepción: TypeError: Cannot read properties of undefined (reading 'kind')<br>    at kind (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.tsx:30:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)<br>Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 2<br>Received number of calls: 3<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30) | exigido |
| M3-h | `un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | excepción: TypeError: Cannot read properties of undefined (reading 'kind')<br>    at kind (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.tsx:30:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)<br>Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 2<br>Received number of calls: 3<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30) | exigido |
| M3-h | `un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»` | excepción: TypeError: Cannot read properties of undefined (reading 'kind')<br>    at kind (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.tsx:30:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)<br>Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 2<br>Received number of calls: 3<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30) | exigido |
| M3-h | `un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»` | excepción: TypeError: Cannot read properties of undefined (reading 'kind')<br>    at kind (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.tsx:30:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)<br>Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 2<br>Received number of calls: 3<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30) | exigido |
| M3-h | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción: Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)<br><br>Expected number of calls: 3<br>Received number of calls: 4<br>    at toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:182:30)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `link-login navega a /login sin petición de red` | passed |
| `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M5-h

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M5-h

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M5-h.json > /tmp/117-r3-M5-h.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 27 passed, 31 total
Snapshots:   0 total
Time:        6.134 s, estimated 7 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(received).toBeDefined()

Received: undefined
    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:193:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:222:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(received).toBeDefined()

Received: undefined
    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:193:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:327:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(received).toBeDefined()

Received: undefined
    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:206:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:350:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela`

```text
Error: expect(received).toBeDefined()

Received: undefined
    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:206:22)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:374:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M5-h | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(received).toBeDefined()<br><br>Received: undefined<br>    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:193:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-h | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(received).toBeDefined()<br><br>Received: undefined<br>    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:193:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-h | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción: Error: expect(received).toBeDefined()<br><br>Received: undefined<br>    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:206:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M5-h | `forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción: Error: expect(received).toBeDefined()<br><br>Received: undefined<br>    at toBeDefined (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:206:22)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `el tile Lock sigue en pie en los dos estados` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20 — M7-k

Sonda temporal en `mobile-pet-tracker/src/screens/forgot/index.tsx`, sin staging.

#### M7-k

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-M7-k.json > /tmp/117-r3-M7-k.log 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 27 passed, 31 total
Snapshots:   0 total
Time:        6.218 s
exit=1
```

`#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`

```text
Error: expect(received).toBeNull()

Received: <Text className="text-danger" selectable={true} testID="forgot-error" />
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:168:50)
    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:194:3)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:185:31)
    at Object.expectFormState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:222:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`

```text
Error: expect(received).toBeNull()

Received: <Text className="text-danger" selectable={true} testID="forgot-error" />
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:325:50)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R7: cada kind distinto de ok pinta su copy en forgot-error un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`

```text
Error: expect(received).toBeNull()

Received: <Text className="text-danger" selectable={true} testID="forgot-error" />
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:349:50)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

`#117 R6: reenviar repite la misma petición forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela`

```text
Error: expect(received).toBeNull()

Received: <Text className="text-danger" selectable={true} testID="forgot-error" />
    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:168:50)
    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
    at new Promise (<anonymous>)
    at /home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
    at apply (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:198:31)
    at Object.expectSentState (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:374:11)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

| Sonda | Cada it que cayó | Modo medido / matcher / Expected y Received | Correspondencia con la fila |
|---|---|---|---|
| M7-k | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="text-danger" selectable={true} testID="forgot-error" /><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:168:50)<br>    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:194:3)<br>    at Generator.next (<anonymous>) | exigido |
| M7-k | `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="text-danger" selectable={true} testID="forgot-error" /><br>    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:325:50)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M7-k | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="text-danger" selectable={true} testID="forgot-error" /><br>    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:349:50)<br>    at Generator.next (<anonymous>)<br>    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17) | exigido |
| M7-k | `forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción: Error: expect(received).toBeNull()<br><br>Received: <Text className="text-danger" selectable={true} testID="forgot-error" /><br>    at toBeNull (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:168:50)<br>    at expectForgotError (/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/src/screens/forgot/index.test.tsx:207:3)<br>    at Generator.next (<anonymous>) | exigido |

| Debe seguir verde | Estado medido |
|---|---|
| `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | passed |

Todos los it exigidos cayeron; resultado apto para continuar según la regla de E2.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx
exit=0
$ git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

#### T20-verde-final

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx --json --outputFile /tmp/117-r3-T20-verde-final.json > /tmp/117-r3-T20-verde-final.log 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        5.934 s, estimated 7 s
exit=0
```

#### Guard de router antes de typecheck-T20

```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
```

#### typecheck-T20

```text
$ bun run typecheck > /tmp/117-r3-typecheck-T20.log 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
```

#### lint-T20

```text
$ bun run lint > /tmp/117-r3-lint-T20.log 2>&1; echo "exit=$?"
$ expo lint
exit=0
```

Commit T20: `a7d0fcae` test(mobile): lock the sent-state render in every flow (#117 R5, R6, R3, E2). Solo `mobile-pet-tracker/src/screens/forgot/index.test.tsx`.

#### Guard de carga antes de ocho

```text
$ pgrep -f init.sh; echo "exit=$?"
exit=1
```

#### ocho

```text
$ bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/reset-password/index.test.tsx src/screens/forgot/index.test.tsx > /tmp/117-r3-ocho.log 2>&1; echo "exit=$?"
Test Suites: 8 passed, 8 total
Tests:       287 passed, 287 total
Snapshots:   0 total
Time:        8.246 s
exit=0
```

#### Guard de carga antes de global

```text
$ pgrep -f init.sh; echo "exit=$?"
exit=1
```

### Tablas consolidadas de T19 y T20

Cada fallo, su matcher y Expected/Received (o consulta/excepción), comando y resumen Jest figuran en los registros individuales anteriores. Las tablas siguientes reúnen los resultados por tarea; cada reversión se midió con los dos comandos quiet y dio exit=0 / exit=0. Los JSON/logs de las sondas repetidas se archivaron por tarea antes de sobrescribir el nombre de log pedido por el handoff.

#### T19 — resumen

Verdes inicial y final: 1 suite / 30 tests, exit=0. Typecheck y lint previos al commit: exit=0, con router.d.ts ausente en el guard de typecheck.

| Sonda | Cada it que cayó | Modos medidos | Debe seguir verde y estado | Reversión producción / índice |
|---|---|---|---|---|
| X-a | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción ×2 | — | exit=0 / exit=0 |
| X-b | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción ×2 | — | exit=0 / exit=0 |
| X-c | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción ×7 | — | exit=0 / exit=0 |
| X-d | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | consulta ×2 | `link-login navega a /login sin petición de red`: passed<br>`link-login navega a /login también desde «Revisa tu correo», sin petición nueva`: passed | exit=0 / exit=0 |
| X-e | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | consulta ×7 | `link-login navega a /login sin petición de red`: passed<br>`link-login navega a /login también desde «Revisa tu correo», sin petición nueva`: passed | exit=0 / exit=0 |
| X-f | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | consulta ×7 | `pinta título, instrucciones y forgot-email editable con sus props de teclado`: passed | exit=0 / exit=0 |
| M3-f | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción ×2 | `link-login navega a /login sin petición de red`: passed<br>`link-login navega a /login también desde «Revisa tu correo», sin petición nueva`: passed | exit=0 / exit=0 |
| M3-g | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción ×2 | `link-login navega a /login sin petición de red`: passed<br>`link-login navega a /login también desde «Revisa tu correo», sin petición nueva`: passed | exit=0 / exit=0 |
| M3-h | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción ×7 | `link-login navega a /login sin petición de red`: passed<br>`link-login navega a /login también desde «Revisa tu correo», sin petición nueva`: passed | exit=0 / exit=0 |
| M4-f | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción ×2 | — | exit=0 / exit=0 |
| M4-g | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie` | aserción ×1 | `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`: passed<br>`mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`: passed<br>`mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`: passed<br>`mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`: passed | exit=0 / exit=0 |
| M4-h | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción ×7 | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`: passed | exit=0 / exit=0 |
| M4-i | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie` | aserción ×5 | `deshabilita forgot-submit con el correo vacío o solo espacios y lo habilita al escribir`: passed | exit=0 / exit=0 |
| M5-h | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción ×2 | `el tile Lock sigue en pie en los dos estados`: passed | exit=0 / exit=0 |
| M7-k | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok` | aserción ×3 | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`: passed | exit=0 / exit=0 |
| M7-l | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | aserción ×1 | — | exit=0 / exit=0 |
| M7-m | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | consulta ×1 | `mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`: passed | exit=0 / exit=0 |
| M7-n | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind` | consulta ×1 | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`: passed | exit=0 / exit=0 |

18 sondas sobre la suite entera; todas produjeron exit=1.

#### T20 — resumen

Verdes inicial y final: 1 suite / 31 tests, exit=0. Typecheck y lint previos al commit: exit=0, con router.d.ts ausente en el guard de typecheck.

| Sonda | Cada it que cayó | Modos medidos | Debe seguir verde y estado | Reversión producción / índice |
|---|---|---|---|---|
| X-g | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`<br>`un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción ×6 | — | exit=0 / exit=0 |
| X-h | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`<br>`un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción ×6 | — | exit=0 / exit=0 |
| X-i | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`<br>`forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción ×2 | — | exit=0 / exit=0 |
| M5-i | `tras ok muestra cabecera y cuerpo con el correo, forgot-resend y link-login, y retira forgot-email y forgot-submit`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`<br>`forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela`<br>`un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`<br>`un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción ×10 | — | exit=0 / exit=0 |
| M5-j | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`<br>`forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción ×2 | — | exit=0 / exit=0 |
| M7-j | `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`<br>`un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción ×6 | — | exit=0 / exit=0 |
| M6-j | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | consulta ×1 | — | exit=0 / exit=0 |
| M6-k | `un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | consulta ×1 | — | exit=0 / exit=0 |
| M7-o | `un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`<br>`un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción ×2 | — | exit=0 / exit=0 |
| M7-l | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver` | aserción ×2 | — | exit=0 / exit=0 |
| X-d | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`<br>`forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | consulta ×4 | `link-login navega a /login sin petición de red`: passed<br>`link-login navega a /login también desde «Revisa tu correo», sin petición nueva`: passed | exit=0 / exit=0 |
| X-e | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`<br>`un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | consulta ×13 | `link-login navega a /login sin petición de red`: passed<br>`link-login navega a /login también desde «Revisa tu correo», sin petición nueva`: passed | exit=0 / exit=0 |
| M3-f | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`<br>`forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción ×4 | `link-login navega a /login sin petición de red`: passed<br>`link-login navega a /login también desde «Revisa tu correo», sin petición nueva`: passed | exit=0 / exit=0 |
| M3-g | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`<br>`forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción ×4 | `link-login navega a /login sin petición de red`: passed<br>`link-login navega a /login también desde «Revisa tu correo», sin petición nueva`: passed | exit=0 / exit=0 |
| M3-h | `mapea {"errors": [Array], "kind": "validation"} a «Ingresa un correo electrónico válido» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "rate-limited"} a «Demasiados intentos. Inténtalo más tarde.» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "error"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "unreachable", "message": "network down"} a «No se pudo conectar con el servidor» en forgot-error, seleccionable, y deja el formulario en pie`<br>`mapea {"kind": "missing-config"} a «Algo salió mal» en forgot-error, seleccionable, y deja el formulario en pie`<br>`un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`<br>`un {"errors": [Array], "kind": "validation"} al reenviar pinta «Ingresa un correo electrónico válido» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "error"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "unreachable", "message": "network down"} al reenviar pinta «No se pudo conectar con el servidor» en forgot-error sin salir de «Revisa tu correo»`<br>`un {"kind": "missing-config"} al reenviar pinta «Algo salió mal» en forgot-error sin salir de «Revisa tu correo»`<br>`un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind` | aserción ×8; excepción ×5 | `link-login navega a /login sin petición de red`: passed<br>`link-login navega a /login también desde «Revisa tu correo», sin petición nueva`: passed | exit=0 / exit=0 |
| M5-h | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`<br>`forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción ×4 | `el tile Lock sigue en pie en los dos estados`: passed | exit=0 / exit=0 |
| M7-k | `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`<br>`un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`<br>`un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok`<br>`forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela` | aserción ×4 | `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`: passed | exit=0 / exit=0 |

17 sondas sobre la suite entera; todas produjeron exit=1.

#### Divergencias de sondas

Ninguna: todos los it exigidos cayeron, sin fallos adicionales; todos los it de Debe seguir verde pasaron y cada modo coincide con la tabla. M3-h en T20 tiene 8 aserciones y 5 excepciones TypeError declaradas (R6 429 y R6 ×4).

### Decisiones de implementación de la ronda 3

No hubo decisiones nuevas de comportamiento: helpers, puntos y dos it copiados de los bloques y filas de E2. Los dos cambios de M5-i y M5-j se plantaron juntos, en una corrida y con una reversión por fila. No se reescribió el it del tile de E1.7, ni se añadieron describe ni más it. Las lecturas de contadores se limitan a las aserciones literales del helper; las esperas permanecen sobre el árbol. Se añadieron flags --json/--outputFile al comando de la suite completa para registrar cada caso, sin -t ni filtros. Sin skills adicionales ni cambios de producción, API, dependencias o candados globales.

#### global

```text
$ bunx jest --maxWorkers=2 > /tmp/117-r3-global.log 2>&1; echo "exit=$?"
Test Suites: 93 passed, 93 total
Tests:       2051 passed, 2051 total
Snapshots:   1 passed, 1 total
Time:        63.79 s, estimated 68 s
exit=0
```

#### Guard de router antes de typecheck

```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
```

#### typecheck

```text
$ bun run typecheck > /tmp/117-r3-typecheck.log 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
```

#### lint

```text
$ bun run lint > /tmp/117-r3-lint.log 2>&1; echo "exit=$?"
$ expo lint
exit=0
```

### T21 — cierre verificado

| Medida | Base ronda 3 | Cierre | Exit |
|---|---:|---:|---:|
| forgot/index.test.tsx | 29 | 31 | 0 |
| auth.test.ts (sin cambios) | 44 | 44 | 0 (en las 8 suites y global) |
| 8 suites del handoff | 285 | 287 | 0 |
| Global (93 suites) | 2049 | 2051 | 0 |
| Typecheck | — | tsc --noEmit | 0 |
| Lint | — | expo lint | 0 |

Los guards pgrep antes de ambos barridos dieron exit=1 (sin init.sh activo). Router.d.ts estuvo ausente antes de cada typecheck (T19, T20 y T21). Ningún candado global se movió.

| Tarea | Hash | Mensaje literal |
|---|---|---|
| T19 | `c783b41e` | test(mobile): lock the form render in every unsent flow (#117 R4, R7, R3, E2) |
| T20 | `a7d0fcae` | test(mobile): lock the sent-state render in every flow (#117 R5, R6, R3, E2) |
| T21 | identificable con git log -1 | docs(mobile): trace #117 amendment E2 to its tests and commits |

T19 y T20 llevan solo la suite de forgot; el cierre lleva únicamente traceability e impl. El hash del propio documento se obtiene mediante git log -1 para evitar una autorreferencia que lo cambiaría. Las celdas de trazabilidad históricas y el contenido íntegro de rondas 1 y 2 se conservan. Sin cambios de dependencias, producción ni API; sin init.sh, Expo, graphify, push ni PR. El smoke y el bookkeeping pertenecen al humano/leader y no se marcaron.

### Alcance final contra H0 de ronda 3

Medido contra HEAD del cierre documental; se verifica la misma lista en el HEAD definitivo al incorporar este registro al cierre. Los hashes de T19 y T20 permanecen intactos. Todos los checks, incluido status, se midieron antes de escribir este registro.

```text
$ git diff --name-only 68ad1bb2 HEAD
mobile-pet-tracker/src/screens/forgot/index.test.tsx
progress/impl_mobile-forgot-password.md
specs/mobile-forgot-password/traceability.md
$ git diff --quiet 68ad1bb2 HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx mobile-pet-tracker/src/api/auth.ts mobile-pet-tracker/src/api/__tests__/auth.test.ts; echo "exit=$?"
exit=0
$ git diff --numstat 68ad1bb2 HEAD -- mobile-pet-tracker/src/screens/forgot/index.test.tsx
114	3	mobile-pet-tracker/src/screens/forgot/index.test.tsx
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git diff --check 68ad1bb2 HEAD; echo "exit=$?"
exit=0
$ git status --short
```

3 ficheros exactos; diff de producción, API y auth.test.ts vacío; numstat del test +114/−3, correspondientes a las tres únicas sustituciones de E2.5. Índice vacío, diff --check exit=0 y árbol limpio en la medición. Se revalida después del commit sin escribir de nuevo en el impl. Ronda 3 completa para revisión del leader; smoke humano pendiente, sin marcar.
