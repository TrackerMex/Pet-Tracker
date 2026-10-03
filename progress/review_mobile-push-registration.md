# review: mobile-push-registration (#79)

Fecha: 2026-09-17
Rama: `feature/79-mobile-push-registration` @ `447ccd21`
Base: `origin/main` @ `29689598`
Veredicto: **APROBADO** (R1-R11; R12 queda abierto como gate humano, según la propia spec)

---

## Resumen

Los 24 commits de `a6690b38` a `447ccd21` implementan R1-R11 con historial
test-primero verificado commit a commit, no solo leído del reporte. El candado
de orden de R5 —lo único de esta feature que protege un bug real— se probó por
**mutación** y está vivo. `./init.sh` verde ejecutado por el reviewer, sin pipe.
Ningún fichero vetado fue tocado. Delta de i18n: cero, byte a byte.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#79 `mobile-push-registration`)
- [x] `progress/current.md` describe la sesión activa, la coordinación con #90 y
      el bloqueo real (`extra.eas.projectId` ausente)

```
$ python3 -c "...status=='in_progress'..."
79 mobile-push-registration in_progress
```

El propio `init.sh` lo confirma (línea 41): `⚠️ Feature en progreso: mobile-push-registration`.

## Checklist C3 — Arquitectura

Feature exclusivamente móvil; las capas domain/application/infrastructure de
`docs/architecture.md` aplican a `backend-pet-tracker/`, que **no se toca**.
Se valida en su lugar el reparto de módulos de la app móvil:

- [x] Transporte aislado en `src/api/push-tokens.ts`, con la misma unión
      discriminada por `kind` y el mismo orden de parámetros
      (`baseUrl` primero, `fetchFn` último con default) que `src/api/alerts.ts`
- [x] `expo-notifications` se importa en **un solo módulo de producción**,
      `src/hooks/use-push-registration.ts` — verificado: ningún otro fichero de
      `src/` lo importa, así que ninguna suite ajena tuvo que mockearlo
- [x] `src/app/_layout.tsx:18-22` monta un componente que devuelve `null`,
      hermano de `<Stack />` dentro de `<QueryProvider>` y dentro de
      `<AuthProvider>` — no envuelve ni retrasa el render de `<Stack />` (R11)
- [x] El import de `auth-provider.tsx` → `../api/push-tokens` es la decisión
      cerrada y firmada de la spec (§Aprobación, D5/D6 descartadas), con
      precedente en `src/hooks/use-pet-selection.ts:4`
- [x] `src/api/http.ts` sigue siendo el único sitio con `try/catch → unreachable`;
      no se duplicó por sexta vez (D7)

## Checklist C4 — TDD

- [x] Cada R1-R11 tiene al menos un test que lo nombra en su `describe`
- [x] El historial muestra rojo → verde, no todo junto. **Los 11 rojos se
      reprodujeron en un worktree aparte, haciendo checkout de cada commit de
      test y corriendo su fichero**; ninguno se aceptó desde el reporte:

| R | commit de test | exit | causa del rojo |
|---|---|---|---|
| R1 | `a4f0bc8c` | 1 | aserción: `Expected: "~57.0.12" / Received: undefined` |
| R2 | `fc64f48b` | 1 | aserción: `Expected value: ["expo-notifications", {...}]` ausente del array; `permissions` `Received has value: undefined` |
| R3 | `b9bf0010` | 1 | `Cannot find module '../push-tokens'` — primer test de un módulo nuevo |
| R4 | `fed46e38` | 1 | `TypeError: deletePushToken is not a function` (export aún inexistente) |
| R5 | `4f18dd80` | 1 | aserción: `Number of calls: 0` en `deletePushToken`; `setPushToken` `Received: undefined` |
| R6 | `0b809f8b` | 1 | `Cannot find module './use-push-registration'` — primer test del hook |
| R7 | `68a514d4` | 1 | aserción: `Expected number of calls: 1 / Received: 0` en `getPermissionsAsync` |
| R8 | `9fe60971` | 1 | aserción: `Number of calls: 0` en `setPushToken` y `registerPushToken` |
| R9 | `ac5a63a8` | 1 | la promesa rechazada **escapa**: el test falla con `offline` sin absorber — exactamente lo que R9 prohíbe |
| R10 | `1d404ebc` | 1 | aserción: handler `Expected: 1 / Received: 0`; `router.push` `Received number of calls: 0` |
| R11 | `bdc95eff` | 1 | aserción: `getPermissionsAsync` `Expected number of calls: 1 / Received: 0` |

- [x] **Ningún rojo falla por un `ReferenceError` de un helper de test** (la
      prohibición literal de C4). Los dos rojos por resolución de módulo (R3, R6)
      son el primer test de un módulo de **producción** que aún no existe, que es
      el rojo canónico de TDD, no un símbolo de test ausente
- [x] Los dos commits de test extra dejan la historia coherente:
  - `b7fbd56e` (R8) solo añade `await` al `unmount()` del segundo montaje. Se
    reprodujo: el rojo **sigue rojo** con las mismas tres aserciones antes del
    verde `8e85b485`
  - `0ba7eb7e` (R5) es refactor de test puro **posterior al verde**: saca el
    registro de observaciones de la fase de render a un `useEffect`
    (`observeAuthProbe`), sin tocar producción ni relajar ninguna aserción

### Prueba de mutación sobre R5 (lo más importante de la feature)

No me fié del test: **invertí el orden a mano** en un worktree de scratch,
moviendo `SecureStore.deleteItemAsync(TOKEN_KEY)` por delante del `DELETE`.

```
baseline (sin mutar) : EXIT=0  Tests: 4 skipped, 4 passed, 8 total
MUTADO               : EXIT=1  Tests: 1 failed, 4 skipped, 3 passed, 8 total
  ● #79 R5: signOut borra el push token antes que la sesión
    › hace DELETE con el JWT vigente antes de borrar SecureStore
    expect(received).toBeLessThan(expected)
    Expected: < 500
    Received:   501
POST-REVERT          : EXIT=0  Tests: 4 skipped, 4 passed, 8 total
```

El candado vive: el `invocationCallOrder` detecta la inversión. La mutación se
revirtió y **el árbol real nunca se tocó** (se trabajó en un `git worktree`
aparte, ya eliminado; `git status` del repo limpio antes y después).

Producción, `src/providers/auth-provider.tsx:73-85`: el `await deletePushToken(...)`
precede a `await SecureStore.deleteItemAsync(TOKEN_KEY)` y al
`setState({status:'unauthenticated'})`. El `DELETE` sale con el JWT vigente.

## Checklist C5 — Trazabilidad

- [x] R1-R11 sin "pendiente". La única fila pendiente es **R12**, que es el gate
      humano (smoke en dev build de Android) y así debe quedarse
- [x] Los 25 hashes citados son ancestros de HEAD:
      `git merge-base --is-ancestor <hash> HEAD` → OK en los 25, sin excepción
      (incluidos `a4f0bc8c` y `b1204355`, anteriores a `a6690b38` por la enmienda E1)
- [x] Commits con el formato `feat|test(mobile-push-registration): <desc> (R<n>)`
- [x] **Nadie coló cambios fuera del rango.** Los commits previos a `a6690b38`
      que tocan `mobile-pet-tracker/` son exactamente dos, ambos citados en la
      trazabilidad: `a4f0bc8c` (test rojo de R1) y `b1204355` (la instalación de
      E1: `package.json` + `bun.lock`). El resto son spec, docs y harness

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y `- [X] Aprobado por humano (fecha: 2026-09-17)`
- [x] Enmienda **E1** firmada: `- [X] E1 aprobada por humano (fecha: 2026-09-17)`
- [x] Tareas humanas A y B firmadas con fecha
- [x] Los cuatro ficheros de `specs/mobile-push-registration/` en `approved`
- [x] Ningún requisito se modificó tras la firma salvo por E1, que pasó por su
      propio gate

## Checklist C7 — Sin código huérfano

- [ ] N/A — esta feature no reemplaza ni deja obsoleto nada. Solo añade
      (`push-tokens.ts`, `use-push-registration.ts`) y extiende hacia atrás
      (`deleteJson`, `AuthContextValue`). No hay tests ni módulos que borrar.

## Checklist C8 — Carta de UI

- [x] La feature no pinta un píxel; C8 se cierra por vacío, pero el grep-clean se
      corrió igual sobre los cuatro ficheros nuevos y sobre las líneas añadidas a
      los tres modificados: **cero** hex, clases arbitrarias `[...]`,
      `StyleSheet.create`, shadow y `elevation`

---

## Verificaciones no delegables al reporte

### 1. Orden observable de R5
Probado por mutación (arriba). **Aprobado.**

### 2. R4 compatible hacia atrás
```
$ git diff origin/main..HEAD -- mobile-pet-tracker/src/api/devices.ts mobile-pet-tracker/src/api/reminders.ts
(vacío)
```
`src/api/http.ts` gana `body?: unknown` como **quinto** parámetro; cuando no se
pasa, ni `Content-Type` ni `body` entran en el objeto de `fetch` (spread
condicional), así que la petición de los dos llamadores existentes es la de hoy.

### 3. i18n delta cero — byte a byte
```
src/i18n/catalog.ts                                main=86b82f5f head=86b82f5f worktree=86b82f5f
src/providers/__tests__/language-provider.test.tsx main=1b8306e7 head=1b8306e7 worktree=1b8306e7
```
Mismo blob en `origin/main`, en HEAD y en disco. El acuerdo con la sesión que
trabaja #90 está intacto: #79 no compitió por ese fichero.

### 4. Dependencias
- `package.json`: **una sola** línea añadida, `"expo-notifications": "~57.0.19"`
  — el rango de la enmienda E1, no el `~57.0.12` caducado
- `bun.lock` actualizado; lo que entra además son transitivas de
  `expo-notifications` (`badgin`, `expo-application`, `expo-constants@57.0.18`,
  bump de `@expo/image-utils`), ninguna dependencia directa nueva
- `node_modules/expo-notifications/package.json` → `"version": "57.0.19"`
- `find . -name package-lock.json -not -path "*/node_modules/*"` → **sin
  resultados**. No hay `yarn.lock` ni `pnpm-lock.yaml` en la app móvil. La isla
  de bun se respeta

### 5. Ni un `npx` nuevo
Grep sobre todos los ficheros del diff. Cinco apariciones, **todas admisibles**:
`docs/conventions.md:414` (es la frase que lo prohíbe), `progress/current.md:36`
y `:40` (el bloqueo y su nota de "cita historica"), `requirements.md:607` y `:609`
(el relato de E1, marcado como cita). **Cero `npx` en código, en `tasks.md`, en
`design.md` y en los comandos del reporte de Codex.**

### 6. Ficheros vetados sin tocar
```
$ git diff --stat origin/main..HEAD -- app.config.ts src/api/types.ts test/jest-setup.js \
    src/screens/ src/components/ backend-pet-tracker/ src/api/devices.ts src/api/reminders.ts \
    src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx src/providers/language-provider.tsx
(vacío)
```
La lista completa de `design.md` §Explícitamente NO tocados se respeta.

### 7. Consistencia del recuento de suites (detector de ficheros saltados)
```
$ bunx jest --listTests | wc -l
75
init.sh, bloque móvil:  Test Suites: 75 passed, 75 total
```
**Coinciden.** Ningún fichero se saltó en silencio — el fallo que este repo ya
sufrió con `(tabs)` sin escapar no está presente. Son 2 suites más que en
`origin/main` (73), exactamente los dos ficheros de test nuevos.

### 8. `extra.eas.projectId` ausente: el camino degradado
No es motivo de rechazo y está implementado y probado:
- `src/hooks/use-push-registration.ts:20-25` lee
  `Constants.expoConfig?.extra?.eas?.projectId` y devuelve `undefined` también
  para la cadena vacía; `:36-37` corta el efecto
- `src/hooks/use-push-registration.test.tsx:178-184`:
  `it.each([undefined, ''])('no hace nada con projectId %p')` asevera **cero
  llamadas** en los siete mocks de `expo-notifications` y cero en
  `registerPushToken`
- El código no inventa ni fija ningún UUID

## Lo que "suele faltar" — comprobado uno a uno

- **R7, no insistir con el permiso denegado**: `use-push-registration.ts:62-66`
  solo llama `requestPermissionsAsync()` con `!granted && canAskAgain`. Test
  `'no insiste cuando el permiso ya no se puede pedir'`
  (`use-push-registration.test.tsx:211-222`) asevera `requestPermissions` **no
  llamado**, `getExpoPushTokenAsync` **no llamado** y `registerPushToken` **no
  llamado**. No hay diálogo en cada arranque
- **R9, un fallo de red no bloquea el login**: el efecto envuelve todo en
  `try/catch` que absorbe (`:53-79`), el hook no devuelve nada y el componente
  de `_layout.tsx` devuelve `null` como hermano de `<Stack />`. Tests: el probe
  sigue `'mounted'` tras un `getExpoPushTokenAsync` rechazado, y los tres `kind`
  de fallo de `registerPushToken` no producen un segundo intento en el mismo
  montaje
- **R10, el tap navega a `/alerts` sin condicional**: `:41` y `:48` son
  `router.push('/alerts')` literal, **sin cast `as Href`** (el diff no añade
  ninguno) y sin rama. El cold start está protegido por `useRef`: el test lo
  fuerza con un `rerender` y sigue habiendo **exactamente un** `push`.
  `setNotificationHandler` se llama **una vez a nivel de módulo** con los cuatro
  campos de SDK 53+, y el test asevera además
  `expect(behavior).not.toHaveProperty('shouldShowAlert')`

---

## Observaciones (ninguna bloqueante)

1. **R5 tiene dos de los tres casos de degradación que su spec enumera.**
   `auth-provider.test.tsx` cubre "sin token publicado" y "el DELETE falla", pero
   **no** el caso `EXPO_PUBLIC_API_URL` indefinida. El código lo maneja
   (`auth-provider.tsx:74`), pero comparte la misma conjunción `&&` que el caso
   sin token, así que una mutación que borre solo ese conjunto no se detectaría.
   Zona ciega pequeña y conocida; se sugiere cerrarla en la próxima feature que
   toque el fichero, no vale la pena reabrir el gate por ella.
2. **`setPushToken` es opcional en `AuthContextValue`** (`setPushToken?:`) en vez
   de obligatorio. Es la consecuencia correcta de la propia prohibición de R11:
   hacerlo obligatorio rompería el typecheck de las fixtures de `useAuth` que
   viven en `src/screens/` y `src/app/(tabs)/`, directorios que la spec veta.
   El candado sigue vivo: el test de estabilidad exige
   `expect(setterBefore).toEqual(expect.any(Function))`.
3. **Cosmético**: `src/app/_layout.tsx:19-21` usa
   `const empty = null; return empty;` donde bastaba `return null`.
4. El reporte de Codex dice que la skill `expo-overview` no estaba disponible en
   su plugin y que usó la doc versionada de SDK 57 en su lugar. Las firmas que
   verifiqué (handler de cuatro campos, `AndroidImportance.MAX`,
   `getExpoPushTokenAsync({projectId})`, `.remove()`,
   `getLastNotificationResponseAsync`) son correctas para v57.

## Nota de coordinación

Al arrancar la revisión había un `jest` en vuelo en el worktree
`Pet-Tracker-wt-backend` (sesión #90), pero era una corrida móvil dirigida
(`--runTestsByPath`), no un `init.sh`: no compite por el Postgres compartido.
Aun así se esperó a que terminara antes de lanzar el gate, y se comprobó con
`pgrep -af "init.sh|jest"` que no había ningún `init.sh` corriendo.

---

## Output de `./init.sh`

Ejecutado por el reviewer desde la raíz del repo, **sin pipe**
(`./init.sh > log 2>&1; echo "INIT_EXIT=$?"`), para que el exit code sea el de
`init.sh` y no el de `tail`.

```
INIT_EXIT=0

✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-push-registration
⚠️  Feature 'harness-init-force-color' (done) sin specs/.../requirements.md
⚠️  STATUS.md desactualizado (84/98 declarado vs 84/101 real)
✅ Build exitoso

→ Ejecutando tests...
backend:        Test Suites: 170 passed, 170 total
                Tests:       1295 passed, 1295 total
infraestructura: Test Suites: 2 passed, 2 total
                Tests:       14 passed, 14 total
móvil:          Test Suites: 75 passed, 75 total
                Tests:       1326 passed, 1326 total
                Snapshots:   1 passed, 1 total
✅ Tests pasados

→ Tests e2e...
✅ Esquema y recursos e2e listos
                Test Suites: 3 skipped, 27 passed, 27 of 30 total
                Tests:       8 skipped, 384 passed, 392 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 84/101 completadas | 16 pendientes
```

Sin regresiones: los avisos son los tres ya conocidos y anotados en el reporte
de Codex (`.env` local incompleto, `STATUS.md` desactualizado, feature en
progreso). Los 3 suites e2e omitidos son los mismos de `origin/main`; esta
feature no toca `backend-pet-tracker/`.

---

## Qué falta para `done` (no es un defecto de la implementación)

R12 sigue abierto por diseño y **no lo cierra ninguna IA**:

1. El humano pega `extra.eas.projectId` en `mobile-pet-tracker/app.json`
   (Tarea A firmada, pero el id aún no ha aterrizado en el árbol; hasta
   entonces el hook degrada por R6.4, que es el comportamiento especificado).
2. Smoke de los 11 pasos de §Prueba de humo en un **dev build de Android** sobre
   teléfono físico, anotando el resultado y la fecha en
   `progress/impl_mobile-push-registration.md` §R12.
3. Con eso firmado, cerrar la fila R12 de `traceability.md` y marcar `done`.
