# review: mobile-auth
Fecha: 2026-08-21 (UTC)
Veredicto: APROBADO (R1-R10; R11 smoke humano sigue pendiente como gate propio)

## Alcance revisado

- Commits `00a81df..08e47f5` en `feature/33-mobile-auth` (implementación de Codex CLI, R1-R10).
- Spec: `specs/mobile-auth/requirements.md` (approved, commit humano `187e401`).
- R11 (smoke humano Expo Go) fuera de alcance de esta revisión; verificado que nada lo bloquea.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`#33 mobile-auth` en `feature_list.json`)
- [x] `progress/current.md` describe la sesión activa con historial R1-R10
- [x] `progress/history.md` tiene la entrada de la sesión anterior (#32)

## Checklist C3 — Arquitectura
- [x] N/A capas backend (`docs/architecture.md` es de backend; la spec lo fija en su preámbulo)
- [x] Convenciones móviles: kebab-case en archivos nuevos, componentes en `src/app`/`src/providers`/`src/api`
- [x] `src/api/` puro: `login`/`register` reciben `baseUrl`/`fetchFn` por parámetro; `grep -r "expo-secure-store" mobile-pet-tracker/src/api/` vacío (solo aparece en `src/providers/`)
- [x] Storage exclusivo del `AuthProvider` (`src/providers/auth-provider.tsx`), key `auth_token`, restaura sesión en mount con guard de unmount y catch → `unauthenticated`

## Checklist C4 — TDD
- [x] Cada R1-R9 tiene `describe('R<n>: ...')` que lo nombra (verificado por grep, 9 suites)
- [x] Historial test-primero: `93c5257`→`a4b3841` (R1/R2), `f33103f`→`1008107` (R3/R4), `26aa7f1`→`fdd96b1` (R5), `4cdb79a`→`e51e972` (R7), `3d2de99`→`765ec59` (R8), `3fe20ae`→`4b0c78c` (R9)
- [x] R6 usa la excepción C4 documentada en la spec (mudanza mecánica): `5102370` es rename 100% de la pantalla y rename con 1 línea (import) en la suite — diff verificado
- [x] Ajustes de tests en commits verdes (`e51e972`) son mecánicos (act/regex), sin debilitar asserts

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" para R1-R10 (R11 es gate humano por diseño de la spec, con checkbox propio en requirements §R11)
- [x] Cada requisito tiene test y commits rojo→verde registrados; hashes verificados contra `git log`
- [x] Commits siguen `feat|test|docs(mobile-auth): <desc> (R<n>)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`
- [x] Casilla humana marcada (2026-08-20), commit del humano `187e401` (AlexisSM377)
- [x] Ningún requisito modificado tras la aprobación (el único cambio post-gate es el flip draft→approved del frontmatter en `9fbccae`, registro del gate)

## Checklist C7 — Sin código huérfano
- [x] `src/app/index.tsx` (health de #32) movido a `src/app/health.tsx`; el nuevo `index.tsx` es el splash
- [x] Su suite movida a `health.test.tsx`; el nuevo `index.test.tsx` cubre R5
- [x] Grep de importadores del path viejo: sin resultados

## Verificación de puntos críticos de la spec
- [x] R1/R2: `src/api/auth.ts` mapea todos los kinds (200/401/400-validation/otros/throw/missing-config), saneo de `/` final igual que `healthUrl`, tipos a mano en `src/api/types.ts`
- [x] D10: sin codegen OpenAPI (grep en `package.json` vacío)
- [x] R5: splash con `splash-icon.png`, `testID="splash-logo"`, `bg-background`, Redirect por sesión
- [x] R7: login con todos los kinds, `signIn`+`router.replace('/health')`, links a register/forgot
- [x] R8: DTO completo espejo del backend, timezone vía `Intl`, submit `isDisabled` sin terms, errores por campo mapeados por `path`, auto-login encadenado con fallback a `/login`
- [x] R9: forgot stub sin imports de red efectivos; test asserta que `login`/`register` nunca se llaman
- [x] Expo Go: única dependencia nueva `expo-secure-store@~57.0.1` (bundleada en Expo Go SDK 57) + plugin en `app.json`; sin dev builds
- [x] Sin `StyleSheet` ni colores hex en componentes nuevos (tokens de #32)
- [x] R10 contención: `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` vacío (ejecutado por el reviewer)
- [x] Suite móvil ejecutada por el reviewer: 9 suites, 59 tests, todos verdes

## Observaciones

Ninguna bloqueante. Notas no bloqueantes:

1. Los e2e del backend se saltaron porque LocalStack no responde en el puerto
   4566 (comportamiento previsto del harness, mismo estado que reportó Codex;
   mobile-auth no toca backend ni AWS, contención verificada vacía). No cuenta
   como regresión: los 1111 tests unitarios del backend pasan.
2. `register.tsx` envía `timezone: deviceTimezone()` que puede ser `undefined`
   si `Intl` falla; el backend responde con su 400 de validación, que la UI ya
   mapea. Aceptable dentro de D7.
3. Nada bloquea R11: `expo-secure-store@~57.0.1` está bundleado en Expo Go
   SDK 57, no hay módulos nativos nuevos ni dev builds; `bunx expo start --go`
   sigue siendo viable.

## Output de ./init.sh (ejecutado por el reviewer, exit 0)

```
✅ node disponible / pnpm disponible / bun disponible
✅ .env encontrado (DATABASE_URL definida)
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-auth
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
backend:  Test Suites: 143 passed | Tests: 1111 passed
infra:    Test Suites: 2 passed   | Tests: 14 passed
móvil:    Test Suites: 9 passed   | Tests: 59 passed
✅ Tests pasados
⚠️  Puerto 4566 sin respuesta — se saltan los e2e (levanta la infra con: docker compose up -d)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
(exit code: 0)
```
