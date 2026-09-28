---
feature: "mobile-notifications-permission-recovery"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-notifications-permission-recovery]] (#99)

> Disciplina TDD: por requisito, **(1) commit rojo → (2) commit verde →
> (3) refactor**, un commit por paso, **nunca implementación y test juntos**
> (el único código de producción que viaja en un rojo es el esqueleto de R1,
> nombrado abajo). Anclas por contenido (`grep -n`), nunca por número de línea.
> Todo `describe` nuevo lleva el prefijo `#99 R<n>:`. Mensajes en inglés:
> `test(<scope>): <desc> (Rn)` el rojo, `feat(<scope>): <desc> (Rn)` el verde,
> `refactor(<scope>): …` si lo hay; `<scope>` = `push` (R1, R2) o `profile`
> (R3). La trazabilidad se rellena **una sola vez**, en el commit final
> `docs(push): fill #99 traceability` tras el último verde ([[traceability]]).

## Antes de empezar

- [ ] Worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
      `feature/99-mobile-notifications-permission-recovery`, y
      `git merge-base --is-ancestor d7cb0d60 HEAD; echo "exit=$?"` → `exit=0`.
- [ ] `test ! -e mobile-pet-tracker/.expo/types/router.d.ts; echo "exit=$?"` →
      `exit=0`. Si da `1`, **parar y pedir al humano** que lo borre
      (gitignorado, rompe `tsc` con rutas fantasma).
- [ ] **No lanzar `./init.sh` ni el e2e** (Postgres y LocalStack compartidos
      entre worktrees; lo corre el leader). Esta feature se verifica con jest,
      tsc y lint (§Cierre).
- [ ] Medir y **anotar en el reporte** las bases, sin pipe, desde
      `mobile-pet-tracker/`:
      `bunx jest --runTestsByPath src/hooks/use-push-registration.test.tsx; echo "exit=$?"` (26 en `d7cb0d60`),
      `bunx jest --runTestsByPath src/screens/profile/index.test.tsx; echo "exit=$?"` (33),
      `bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts; echo "exit=$?"` (9 + 25)
      y `bun run --cwd mobile-pet-tracker test; echo "exit=$?"` (83 / 1510,
      medido por el leader en `d7cb0d60`). Los deltas de esta spec van **sobre esa base**.
      Comprobar también que la suma de `expect(englishKeys).toHaveLength(` y
      `expect(R7_PROFILE).toHaveLength(` siguen siendo las de
      [[requirements]] P16; si otra feature las movió, el `+ 2` va sobre lo
      que haya.
- [ ] Código de test nuevo: nada de la forma `<palabra>-[` (guard
      `describe('C8: la UI no usa clases arbitrarias'`).
- [ ] Sin comentarios nuevos en producción. **Sin dependencias nuevas.** Sin
      tocar `src/app/_layout.tsx`, `src/providers/auth-provider.tsx`,
      `src/screens/home/`, `app.json`, `app.config.ts`, `package.json` ni
      `bun.lock`.
- [ ] Todo con **bun**: `bunx jest`, `bunx tsc`, `bun run …`. Nada de `npx` ni
      `npm`.
- [ ] Skills (nombres de Claude; el leader da los de Codex en el handoff):
      `expo-overview` → `expo-native-ui`, `expo-router`,
      `appllama-app-design-skill`. La carta `docs/ui-guidelines.md` gana.

## Orden y por qué (candado del sujeto ausente)

`R1 → R2 → R3`, y R4 (humano) al final.

- R1 **crea** el símbolo `useNotificationsBlocked` (esqueleto en su rojo) y
  los helpers `useRegistrationProbe` y `flushEvaluation`, que usa R2.
- R2 usa `useRegistrationProbe` y `flushEvaluation` (ya existen) y trae en su
  rojo los helpers de `AppState` que solo él usa.
- R3 mockea `useNotificationsBlocked`, que existe desde R1, y asevera nodos de
  Perfil que existen hoy (`screen-profile`, `profile-add-pet`,
  `language-toggle`, `profile-sign-out`) más los dos `testID` que crea su
  propio verde.
- Los candados de catálogo que se mueven van en el rojo de R3 (el cambio que
  los pone en verde es el de su verde), salvo las filas de `ui-copy-table.ts`
  y de la tabla de idioma, que van en el verde ([[requirements]] §Candados).

---

## R1 — El hook publica el bloqueo

- [ ] **(1) Commit rojo** `test(push): publish the blocked notification permission state (R1)`.
  - `mobile-pet-tracker/src/hooks/use-push-registration.ts`, **esqueleto**
    (única producción de este commit): al final del fichero,
    `export function useNotificationsBlocked(): boolean` que devuelve `false`.
  - `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`:
    - `act` en el import de `@testing-library/react-native`;
      `useNotificationsBlocked` en el de `./use-push-registration`;
    - **inmediatamente antes de**
      `describe('R15: importar el modulo no toca expo-notifications'`: los
      helpers `useRegistrationProbe` y `flushEvaluation` y el `describe`
      `#99 R1: el hook publica el bloqueo solo con el permiso denegado y sin poder pedirse`
      con el `it.each` de 5 filas y los dos `it` de [[requirements]] R1,
      literales.
  Rojo esperado (medido): filas 1 y 2 y `al desmontar el aviso se apaga`,
  **3**, por aserción; 30 verdes (**33** en el fichero).
- [ ] **(2) Commit verde** `feat(push): track a notification permission that can no longer be requested (R1)`.
  Solo `use-push-registration.ts`:
  - `useSyncExternalStore` en el import de `'react'`;
  - el almacén de módulo del Contrato de [[requirements]] (booleano, `Set`,
    `setNotificationsBlocked` que avisa solo si cambia) y
    `useNotificationsBlocked` con `useSyncExternalStore` en lugar del
    esqueleto, **encima** de `export function usePushRegistration(): void {`;
  - en el efecto de registro, antes de `void (async () => {`:
    `let active = true;`;
  - dentro de esa función, justo antes de `if (!permissions.granted) {`:
    `if (active) setNotificationsBlocked(!permissions.granted && !permissions.canAskAgain);`;
  - `return () => responseSubscription.remove();` pasa a una limpieza con
    `active = false;`, `setNotificationsBlocked(false);` y
    `responseSubscription.remove();`.
  Verde: el fichero entero (33).
- [ ] **(3) Refactor**: ninguno previsto.

## R2 — Reevaluar al volver a primer plano

- [ ] **(1) Commit rojo** `test(push): re-evaluate the blocked permission when the app returns to the foreground (R2)`.
  Solo `use-push-registration.test.tsx`:
  - `AppState` y `type AppStateStatus` en el import de `'react-native'`;
  - después del `describe` de R1 (y todavía antes de R15): los helpers
    `mockAddAppStateListener`, `mockRemoveAppStateListener`,
    `appStateListener` y `captureAppStateListener`, y el `describe`
    `#99 R2: al volver a primer plano con el aviso encendido se reevalúa el permiso sin pedirlo`
    con su `beforeEach`, los dos `it.each` (3 + 3 filas) y los dos `it` de
    [[requirements]] R2, literales.
  Sin cambios de producción. Rojo esperado (medido): las 3 filas de vuelta,
  las 3 de no reevaluación y `retira el listener de AppState al desmontar`,
  **7**, por aserción; 34 verdes (**41** en el fichero).
- [ ] **(2) Commit verde** `feat(push): register the push token after returning from settings with permission (R2)`.
  Solo `use-push-registration.ts`:
  - `AppState` en el import de `'react-native'`;
  - `void (async () => { … })();` pasa a
    `const evaluate = async (ask: boolean): Promise<void> => { … };` (flecha)
    seguido de `void evaluate(true);`, con
    `if (ask && !permissions.granted && permissions.canAskAgain) {` como
    condición de la petición;
  - después de `void evaluate(true);`:
    `const appStateSubscription = AppState.addEventListener('change', (state) => { if (state === 'active' && <booleano de módulo>) void evaluate(false); });`;
  - en la limpieza, `appStateSubscription.remove();` antes de
    `responseSubscription.remove();`.
  Verde: el fichero entero (41).
- [ ] **(3) Refactor**: ninguno previsto.

## R3 — El aviso en Perfil

- [ ] **(1) Commit rojo** `test(profile): show the blocked notifications notice with a settings action (R3)`.
  - `mobile-pet-tracker/src/screens/profile/index.test.tsx`: el arnés de
    [[requirements]] R3 (`jest.mock` del hook, imports, `readFileSync`,
    `mockUseNotificationsBlocked`, `mockOpenSettings`, `NOTICE_ES`) y, **al
    final del fichero** (después de
    `describe('#72 R3: el mock del picker no hereda implementación entre tests'`),
    el `describe`
    `#99 R3: Perfil avisa de las notificaciones bloqueadas y abre la configuración de la app`
    con su `beforeEach`, su `afterEach` y los **cinco** `it`, literales.
  - `src/providers/__tests__/language-provider.test.tsx`: ` + 2` en la suma y
    el comentario ([[requirements]] §Candados).
  - `src/__tests__/ui-language.test.ts`: `#65 R7` a `36` y
    `35 - 1 + 2` ([[requirements]] §Candados).
  Sin cambios de producción. Rojo esperado (medido): los 5 `it` de `#99 R3`,
  `mantiene la base más las claves de #68…` y
  `resuelve las 36 ocurrencias normativas`, **7**, por aserción.
  `bunx tsc --noEmit` pasa en este commit.
- [ ] **(2) Commit verde** `feat(profile): add the blocked notifications notice and its copy (R3)`.
  - `src/i18n/catalog.ts`: las dos claves de [[design]] D6, cada una en una
    línea, después de `'profile.signOut': 'Sign out',` (`en`) y de
    `'profile.signOut': 'Cerrar sesión',` (`es`).
  - `src/screens/profile/index.tsx`: `Linking` en el import de
    `'react-native'`; `import { useNotificationsBlocked } from '../../hooks/use-push-registration';`
    después del import de `use-pet-selection`;
    `const notificationsBlocked = useNotificationsBlocked();` después de
    `const [photoError, setPhotoError] = useState<string | null>(null);`; y
    el bloque del Contrato de [[requirements]] justo antes de
    `{pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (`.
  - `src/__tests__/ui-copy-table.ts`: las dos filas de §Candados.
  - `specs/mobile-ui-language/design.md` §2.7: las dos filas de §Candados,
    con el copy de D6.
  Verde: `profile/index.test.tsx` (38), `language-provider.test.tsx` (9),
  `ui-language.test.ts` (25).
- [ ] **(3) Refactor**: ninguno previsto.

## R4 — Smoke en dev build de Android (humano)

- [ ] Lo corre el humano tras el veredicto del `reviewer`, con los pasos de
      [[requirements]] §Prueba de humo, y firma su casilla allí. Codex no lo
      marca.

---

## Sondas (no se commitean; cada una roja y restaurada con `git diff` vacío)

Las corre Codex antes del cierre y las repite el `reviewer`. Anotar en el
reporte cuántos tests se ponen rojos con cada una y compararlo con las tablas
de [[requirements]].

- **`use-push-registration.ts`**, con
  `bunx jest --runTestsByPath src/hooks/use-push-registration.test.tsx`:
  M1-M7 de R1 y N1-N7 de R2.
- **`src/screens/profile/index.tsx`**, con
  `bunx jest --runTestsByPath src/screens/profile/index.test.tsx src/__tests__/ui-language.test.ts`:
  P1-P9 de R3.

---

## Cierre (Codex, antes de escribir `progress/impl_mobile-notifications-permission-recovery.md`)

Todo **sin pipe** (el código de salida de un pipe es el del último comando),
desde `mobile-pet-tracker/` salvo que se diga otra cosa:

- [ ] `bunx jest --runTestsByPath src/hooks/use-push-registration.test.tsx; echo "exit=$?"`
      → `exit=0`, **41**.
- [ ] `bunx jest --runTestsByPath src/screens/profile/index.test.tsx; echo "exit=$?"`
      → `exit=0`, **38**.
- [ ] `bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts 'src/app/(tabs)/__tests__/screens.test.tsx' src/hooks/use-push-registration.navigation.test.tsx; echo "exit=$?"`
      → `exit=0`, **9 + 25 + 2 + 1** (4 suites: comprobar que jest imprime
      cuatro).
- [ ] `bun run --cwd mobile-pet-tracker test; echo "exit=$?"` → `exit=0`,
      **+0 suites y +20 tests** sobre la base (con `d7cb0d60`: 83 / 1530).
- [ ] `test ! -e .expo/types/router.d.ts` y después
      `bun run typecheck; echo "exit=$?"` y `bun run lint; echo "exit=$?"` →
      `exit=0`.
- [ ] Greps (desde `mobile-pet-tracker/`):
      `grep -rln "useNotificationsBlocked" src --include=*.ts --include=*.tsx`
      → exactamente `src/hooks/use-push-registration.ts`,
      `src/hooks/use-push-registration.test.tsx`,
      `src/screens/profile/index.tsx` y `src/screens/profile/index.test.tsx`
      (criterio 4: el aviso no vive en ningún otro sitio);
      `grep -c "requestPermissionsAsync" src/hooks/use-push-registration.ts` → `1`;
      `grep -c "void evaluate(false)" src/hooks/use-push-registration.ts` → `1`;
      `grep -c "void evaluate(true)" src/hooks/use-push-registration.ts` → `1`;
      `grep -c "AppState.addEventListener('change'" src/hooks/use-push-registration.ts` → `1`;
      `grep -c "Linking.openSettings()" src/screens/profile/index.tsx` → `1`;
      `grep -c "testID=\"notifications-blocked-notice\"" src/screens/profile/index.tsx` → `1`;
      `grep -rn "sendIntent\|expo-intent-launcher" src` → vacío.
- [ ] `git diff --stat origin/main...HEAD -- mobile-pet-tracker specs/mobile-ui-language`
      → exactamente los nueve ficheros de [[design]] §Archivos afectados (ni
      `package.json`, ni `bun.lock`, ni `_layout.tsx`, ni `auth-provider.tsx`).
- [ ] Commit final `docs(push): fill #99 traceability` con los seis hashes en
      [[traceability]], y el reporte con las bases, las sondas y los recuentos.
