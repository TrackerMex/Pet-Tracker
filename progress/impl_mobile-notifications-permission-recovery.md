# Implementación #99 — mobile-notifications-permission-recovery

## Identidad antes de editar

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-backend`
- `git branch --show-current`: `feature/99-mobile-notifications-permission-recovery`
- `git merge-base --is-ancestor d7cb0d60 HEAD`: `exit=0`
- `test ! -e mobile-pet-tracker/.expo/types/router.d.ts`: `exit=0`
- Worktree inicial limpio (`git status --short` vacío).
- Spec aprobada: `requirements.md`, `design.md`, `tasks.md` y `traceability.md` leídas completas antes de editar.
- Skills cargadas: `expo:building-native-ui`, `.agents/skills/appllama-app-design-skill`, `ponytail:ponytail` (full). La carta `docs/ui-guidelines.md` manda sobre las skills para el estilo y el smoke.

## Línea base del leader

- En `b602ff6e`, `./init.sh` exit=0: backend unit 171 suites / 1307 tests; infra 2 / 14; móvil 83 / 1508; e2e 27 suites passed + 3 skipped, 389 tests passed + 8 skipped.
- En `d7cb0d60`, suite móvil: 83 / 1510.

## Bases medidas en este worktree

- `bunx jest --runTestsByPath src/hooks/use-push-registration.test.tsx`: exit=0, 1 suite / 26 tests.
- `bunx jest --runTestsByPath src/screens/profile/index.test.tsx`: exit=0, 1 / 33 (avisos de Uniwind/HeroUI ya presentes en la base).
- `bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts`: exit=0, 2 / 34 (9 + 25).
- `bun run --cwd mobile-pet-tracker test`: exit=0, 83 / 1510.

## TDD por requisito

| Paso | Commit | Comprobación |
|---|---|---|
| R1 rojo | `87225d80` | `bunx jest --runTestsByPath src/hooks/use-push-registration.test.tsx`: exit=1, 3 fallos por aserción y 30 verdes (33). Fallaron las filas «denegado y canAskAgain false de entrada», «segunda negativa en este arranque» y «al desmontar el aviso se apaga». El rojo solo lleva el esqueleto de `useNotificationsBlocked()`. |
| R1 verde | `3f185965` | Mismo fichero: exit=0, 33/33. El estado de módulo se publica, notifica cambios y se limpia. |
| R2 rojo | `897d7bc4` | Mismo fichero: exit=1, 7 fallos por aserción y 34 verdes (41). Fallaron las tres filas «al volver a active», las tres «no reevalúa» y «retira el listener de AppState al desmontar». Los siete fallan por listener ausente. |
| R2 verde | `c235f02a` | Mismo fichero: exit=0, 41/41. `active` con bloqueo relee con `evaluate(false)` y retira el listener al limpiar. |
| R3 rojo | `05c41906` | Perfil + language-provider + ui-language: exit=1, 7 fallos y 65 verdes (72). Fallaron los cinco `it` de `#99 R3`, «mantiene la base más las claves de #68…» y «resuelve las 36 ocurrencias normativas». `test ! -e .expo/types/router.d.ts`: exit=0; `bunx tsc --noEmit`: exit=0. |
| R3 verde | `e10fcf1c` | Las tres suites: exit=0, 72/72 (Perfil 38, idioma 9 + 25). |

En el primer ensayo no versionado del rojo R2 hubo una fila con estado heredado de `mockResolvedValueOnce`; el `beforeEach` de R2 restablece `mockGetPermissions`. La corrida repetida, la que se commiteó, dio exactamente los siete fallos de listener ausente.

Candados movidos: `englishKeys` añade `+ 2` y su comentario nombra ambas claves; `#65 R7` pasa a 36 con `35 - 1 + 2`; las dos filas de `R7_PROFILE` y las dos de `specs/mobile-ui-language/design.md` §2.7 entraron en el verde. Ningún otro test existente cambió.

## Sondas temporales

Cada sonda corrió con `bunx jest --runTestsByPath` sobre el fichero indicado en `tasks.md` §Sondas, dio `exit=1` y se restauró con `git diff --exit-code` vacío. Los números son tests fallidos observados frente a los declarados en `requirements.md`.

| Sonda | Observado | Comparación con la tabla |
|---|---:|---|
| M1 | 3 | Igual: R1 fila 3 y 2 de R2 |
| M2 | 1 | Igual: R1 fila 2 |
| M3 | 2 | Igual: los dos `it` de desmontaje de R1 |
| M4 | 1 | Igual: evaluación tardía de R1 |
| M5 | 7 | Igual: 3 de R1 y 4 de R2 |
| M6 | 8 | Igual: 3 de R1, 1 de #79 R7 y 4 de R2 |
| M7 | 6 | **Diferencia**: 3 de R1 y 3 de R2; la tabla declara 3 de R1 y 5 de R2. Los tres `it` de R2 que reevalúan sí caen; los casos de «no reevalúa» solo comprueban llamadas, según el contrato de R2, y no observan cambios del snapshot. Queda para el reviewer. |
| N1 | 2 | Igual |
| N2 | 1 | Igual |
| N3 | 1 | Igual |
| N4 | 1 | Igual |
| N5 | 2 | Igual |
| N6 | 1 | Igual |
| N7 | 8 | Igual: 7 de listener duplicado y 1 sin precondiciones |
| P1 | 1 | Igual |
| P2 | 2 | Igual |
| P3 | 1 | Igual |
| P4 | 1 | Igual |
| P5 | 1 | Igual |
| P6 | 4 | Igual: 1 de R3, 1 de #65 R7 y 2 de #65 R18 |
| P7 | 1 | Igual |
| P8 | 1 | Igual |
| P9 | 2 | Igual |

## Cierre

- Hook: exit=0, 1 suite / 41 tests.
- Perfil: exit=0, 1 suite / 38 tests.
- Language-provider, ui-language, `src/app/(tabs)/__tests__/screens.test.tsx` y navegación push: exit=0, **4 suites / 37 tests** (9 + 25 + 2 + 1).
- `bun run --cwd mobile-pet-tracker test`: exit=0, **83 suites / 1530 tests** (+0 suites, +20 tests respecto de `d7cb0d60`), 1 snapshot verde.
- Antes del typecheck: `test ! -e .expo/types/router.d.ts`: exit=0. `bun run typecheck`: exit=0; `bun run lint`: exit=0.
- `grep -rln "useNotificationsBlocked" src --include=*.ts --include=*.tsx`: exactamente `src/hooks/use-push-registration.ts`, su test, `src/screens/profile/index.tsx` y su test.
- Los seis `grep -c` de `requestPermissionsAsync`, `void evaluate(false)`, `void evaluate(true)`, `AppState.addEventListener('change'`, `Linking.openSettings()` y `testID="notifications-blocked-notice"` dieron **1** cada uno.
- `grep -rn "sendIntent\|expo-intent-launcher" src`: salida vacía, exit=1 por ausencia de coincidencias.
- `git diff --stat origin/main...HEAD -- mobile-pet-tracker specs/mobile-ui-language`: exactamente **9 ficheros**: `src/hooks/use-push-registration.ts` y su test; `src/screens/profile/index.tsx` y su test; `src/i18n/catalog.ts`; `src/providers/__tests__/language-provider.test.tsx`; `src/__tests__/ui-language.test.ts`; `src/__tests__/ui-copy-table.ts`; `specs/mobile-ui-language/design.md`. Resumen: 312 inserciones, 16 borrados.
- Trazabilidad R1-R3 rellenada una sola vez con los seis hashes en el commit final. R4 queda pendiente de la prueba de humo del humano.
- Por instrucción del handoff, no se ejecutaron `./init.sh` ni e2e, y no se hizo push ni PR.

## Commits

1. `87225d80` — `test(push): publish the blocked notification permission state (R1)`
2. `3f185965` — `feat(push): track a notification permission that can no longer be requested (R1)`
3. `897d7bc4` — `test(push): re-evaluate the blocked permission when the app returns to the foreground (R2)`
4. `c235f02a` — `feat(push): register the push token after returning from settings with permission (R2)`
5. `05c41906` — `test(profile): show the blocked notifications notice with a settings action (R3)`
6. `e10fcf1c` — `feat(profile): add the blocked notifications notice and its copy (R3)`
7. `HEAD` — `docs(push): fill #99 traceability`; su hash se obtiene con `git rev-parse --short HEAD` (incrustar el hash del propio commit cambiaría ese hash).
