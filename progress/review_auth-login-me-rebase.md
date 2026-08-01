# review: auth-login-me — rebase sobre main + cierre del PR #5
Fecha: 2026-08-01
Veredicto: APROBADO

Alcance: solo lo nuevo del rebase (reporte en `progress/impl_auth-login-me-rebase.md`).
La feature completa ya fue aprobada en `progress/review_auth-login-me.md`.

## 1. Commits sobre origin/main

`git log --oneline origin/main..HEAD`: los 12 commits originales reaplicados
(`3798ade`..`f5f4895`) + los 4 nuevos esperados (`28179a1`, `c8ab4d6`,
`69c7935`, `8ae4687`) + `d68ab11` (docs: el propio reporte del rebase,
esperado — progress/ es versionado). Total 17. ✓

## 2. Revisión commit a commit (git show)

- **`28179a1` (refactor alias)**: solo líneas de import. 22 imports
  cross-layer → `@/modules/<modulo>/<capa>/...` en exactamente los 7
  archivos que dice el reporte (login-user.use-case.ts/spec, auth.guard.ts/
  spec, jwt-token-service.ts, users.controller.ts/spec). Cero cambios de
  lógica. ✓
- **`c8ab4d6` (fix APP_GUARD)**: elimina la aserción imposible
  `moduleRef.get(APP_GUARD)` y añade un `it` propio nombrado por su R-id
  (`R5: registra AuthGuard como guard global via APP_GUARD`) que aserta
  `{ provide: APP_GUARD, useClass: AuthGuard }` sobre
  `Reflect.getMetadata('providers', AuthModule)` — exactamente lo que Nest
  lee al registrar el guard global. El test DI original queda sin la
  aserción imposible. Comentario obsoleto de argon2 eliminado. ✓
- **`69c7935` (traceability)**: re-mapea los 4 hashes pre-rebase
  (`501bd01→c54c43d`, `42310f6→ab4972e`, `4c37f52→23c35eb`,
  `f87f45b→bc59aa6` — los 4 hashes destino existen en el log) y añade
  `auth.module.spec.ts::R5` + `c8ab4d6` a la fila R5. Sin filas
  "pendiente" (verificado en el working tree). ✓
- **`8ae4687` (e2e raíz)**: `test/app.e2e-spec.ts` pasa de esperar 200
  "Hello Pet Tracker!" a 401 en `GET /v1`. Consistente con la spec: R5
  exige 401 antes del handler en toda ruta sin `@Public()`, y la lista
  pública de R7 (`GET /v1/health`, `POST /v1/auth/{register,verify-email,
  login}`) no incluye la raíz. El test nombra R5 en su título. No se tocó
  `AppController` (correcto: hacerla pública sería decisión de diseño
  fuera de spec). ✓

## 3. Resolución de STATUS.md

- Sesión **2026-08-01** de main intacta y arriba del todo; orden más
  reciente primero (2026-08-01 → 2026-07-31 (2) → 2026-07-31 → ...). ✓
- Seguimientos cerrados de #2 (e2e LocalStack 10/10) y #3 (migraciones
  contra Postgres real) conservados en sus bloques. ✓
- Hallazgo de argon2 acotado: "propio de AQUEL sandbox — resuelto", con
  constancia de que en esta máquina los 2 specs corren y pasan. ✓
- Bloque #4 actualizado: PR #5 abierto, causa del CI rojo (APP_GUARD)
  explicada y marcada corregida en este rebase, pendiente merge humano. ✓

## 4. Convención de imports (alcance: auth/ y users/)

`grep` de imports relativos cross-layer en `src/modules/`: cero resultados
en `auth/` y `users/`. Los restos (5× `../..` + 1× `../application`) están
todos en `src/modules/health/` — deuda de #1, fuera de alcance, no
bloquea. ✓

## 5-6. Verificación independiente (ejecutada por el reviewer)

- `./init.sh` (raíz): **verde** — install, STATUS sync, build, tests, lint,
  typecheck. 4/18 completadas, próxima #5.
- `pnpm run test:e2e` (backend-pet-tracker/, Docker ya corriendo): **3
  suites / 15 tests, 0 fallos**. Sin problema de `JWT_SECRET`.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (de hecho 0 — #4 está `done`, correcto en cierre)
- [x] progress/current.md sin sesión activa colgada

## Checklist C3 — Arquitectura
- [x] El refactor `28179a1` no altera dependencias entre capas (solo forma de import)
- [x] domain sigue sin imports de infrastructure (sin cambios de lógica en el rebase)

## Checklist C4 — TDD (commits nuevos con R-id)
- [x] `c8ab4d6`: test nombra R5 en el título del `it`
- [x] `8ae4687`: test e2e nombra R5 en el título del `it`

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente"
- [x] Hashes re-mapeados apuntan a commits existentes post-rebase
- [x] Commits siguen formato `tipo(auth-login-me): <desc> (R5)` donde aplica

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada (2026-07-31)

## Checklist C7 — Sin código huérfano
- [x] N/A en lo esencial — el rebase no reemplaza componentes; lo único
  eliminado (aserción imposible + comentario obsoleto de argon2) fue
  correctamente retirado, sin restos

## Observaciones (no bloqueantes)
1. `d68ab11` (reporte del rebase) es posterior al push registrado
   (`37b4120...8ae4687`) — queda pendiente de push al PR #5 junto con el
   cierre (este review incluido).
2. La fila R5 de traceability no lista el e2e `app.e2e-spec.ts::R5`; no es
   exigible (la fila ya tiene dos tests que nombran R5), pero podría
   añadirse por completitud.

## Output de ./init.sh
```
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
Test Suites: 43 passed, 43 total
Tests:       167 passed, 167 total
✅ Tests pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 4/18 completadas | 14 pendientes
  Próxima feature: [#5] pets-crud-permissions (P1)
```

## Output de pnpm run test:e2e
```
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
```
