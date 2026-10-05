# review: mobile-forgot-password (#117)
Fecha: 2026-10-05
Veredicto: RECHAZADO

Worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/117-mobile-forgot-password`, HEAD `d39a9ea5`, H0 `90a19d86`,
origin/main `b2a9c2aa`. Implementó Codex CLI; revisa Claude (reviewer).

## Alcance
- `git diff --name-only 90a19d86 HEAD` da 16 ficheros, los mismos que la lista cerrada del handoff.
- `git diff b2a9c2aa HEAD -- package.json bun.lock app.json backend-pet-tracker` sale vacío: no hay dependencias nuevas ni cambios en backend.
- Contrato backend contrastado con el código. Ruta: `POST /v1/auth/forgot-password` (`@Controller('auth')` + `setGlobalPrefix('v1')`).
  - Body `{ email }` validado con `z.email().max(320)`.
  - 400 con `errors` de zod (`parseBody`).
  - 429 del `email-rate-limit.guard.ts` (3 por hora).
  - 200 sin depender de si la cuenta existe.
  - El cliente lo mapea como pide R2.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `grep -c '"status": "in_progress"' feature_list.json` da 1 (#117).
- [x] progress/current.md actualizado.
  - Describe la sesión #117, el flujo con Codex y la base.
  - Todavía no recoge que Codex terminó. Eso le toca al cierre del leader.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica en móvil. El cliente HTTP vive en `src/api/` y la pantalla solo importa `forgotPassword` desde `../../api/auth`.
- [x] Contratos puros: `ForgotPasswordRequest` en `src/api/types.ts` y `ForgotPasswordState` como unión discriminada.
- [x] La pantalla depende del cliente por su función exportada. El route `src/app/(auth)/forgot.tsx` es delgado (convención de #39).
- [x] Sin lógica de negocio en infraestructura. `forgotPassword` reutiliza `postJson`, `readJson` y `validationErrors`, como `resetPassword`.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra: los describe `#117 R1`…`#117 R11`, más `#61 R8` y `#127 R1` reapuntados.
- [x] El historial muestra test primero. Son 18 commits desde H0:
  - Los pares test→feat en orden: R2, R1, R3, R4, R5, R7, R6.
  - R8, R9 y R11 nacen verdes; el handoff lo permite.
  - La trazabilidad va sola en el último commit.
  - Los 18 asuntos coinciden literalmente con el handoff (`grep -cF` de cada asunto contra el handoff: los 18 aparecen).
- [x] Los nacidos verdes tienen sonda que prueba su candado (M8-c, M9-b y M11-a en el informe). Repetí M11-a: cae.
- [ ] **Cláusulas universales con un candado por rama: NO.** Hay tres cláusulas con ramas sin candado. Ver Observaciones 1-3.

## Checklist C5 — Trazabilidad
- [x] traceability.md no tiene filas "pendiente".
- [x] Los commits siguen el formato `test|feat(mobile): <desc> (#117 Rn)`. Los hashes de traceability son ancestros de HEAD.

## Checklist C6 — Spec aprobada
- [x] requirements.md tiene `status: approved` y `- [x] Aprobado por humano`.
  - La casilla no lleva fecha en línea. La firma está en el commit `6a85ea5c` (2026-10-04), que cita la página de Notion `3ef6115a-9b27-811c-8cd6-e29408fdfe4c`.
  - El único cambio posterior a la firma es `20dd8afc`, que solo arregla los backticks de las anclas.

## Checklist C7 — Sin código huérfano
- [x] El stub reemplazado ya no existe. `src/app/(auth)/forgot.tsx` queda como route delgado y `forgot.comingSoon` sale del catálogo en los dos idiomas.
  - `grep -rn comingSoon src` solo encuentra el `it` que asevera su ausencia.
  - `ui-copy-table` no tiene filas de la ruta vieja.
- [x] Sus tests también se eliminaron.
  - `src/app/(auth)/__tests__/forgot.test.tsx` se borró (D).
  - Sus dos `describe` (`#61 R8`, `#127 R1`) se reapuntaron a `forgot-form` en la suite nueva.

## Checklist C8 — UI móvil (docs/ui-guidelines.md)
- [x] Grep limpio en `src/screens/forgot/index.tsx`:
  - 0 hex, 0 `StyleSheet`, 0 `shadow`/`elevation`.
  - 0 clases arbitrarias `-[`, ni en la pantalla ni en su suite (design-drift lee los `*.test.tsx` co-ubicados).
- [x] Safe areas con `useSafeAreaInsets` (top + 12, bottom + 24). KAV `behavior="padding"` con `HeaderHeightContext`.
- [x] No hay estado de carga de contenido. Durante el envío, submit y resend quedan deshabilitados; no hay Spinner.
- [x] Reutiliza componentes compartidos: heroui-native `Button`/`LinkButton`/`TextField`/`Input`, tile `bg-accent-soft` con `CONTINUOUS_CORNER` y `useThemeColors`.
- [x] Tappables con feedback de heroui, `w-full` y la receta `rounded-xl bg-accent` (#127 R1 reapuntado).
- [ ] Smoke S1-S9 en dev build de Android: **pendiente del humano**. Este veredicto no lo marca ni lo bloquea.

## Observaciones

### Defectos (motivo del rechazo)

Las tres son cláusulas universales de la spec aprobada con una sola rama candada.
Una mutación realista sobre otra rama deja las 8 suites verdes. El hueco nace
en la lista de tests que prescribió la spec, y Codex la cumplió al pie de la
letra. Aun así, el candado no cubre lo que la EARS promete, y la regla del
proyecto rechaza este patrón («Cláusulas universales candadas en un caso», #147).

1. **R2 «WHEN status es cualquier otro (`500`, `404`, `503`…) THE SYSTEM SHALL devolver `{ kind: 'error' }`»: solo hay candado para 500.**
   - Sonda P6, en `mobile-pet-tracker/src/api/auth.ts:259`:
     `default: return result.response.status >= 500 ? { kind: 'error' } : { kind: 'ok' };`
   - Resultado: `src/api/__tests__/auth.test.ts`, 40/40 verde, exit 0. **Sobrevive.**
   - El único `it` de la rama es `mapea 500 a error`. El 404 y el 503 que nombra la EARS no tienen fila.
   - Riesgo real: un 404 (base URL o ruta mal configurada) se pintaría como «Revisa tu correo», un éxito falso.
2. **R6 «IF el reenvío resuelve un `kind` distinto de `ok` THEN … permanecer en el estado enviado»: solo hay candado para `rate-limited`.**
   - Sonda P5, en `mobile-pet-tracker/src/screens/forgot/index.tsx:42`: `setSent(false);` antes de `setError(t('common.cannotReachServer'));`.
   - Resultado: `src/screens/forgot/index.test.tsx`, 20/20 verde, exit 0. **Sobrevive.**
   - El único `it` es `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`. No hay ninguna fila para `unreachable`, `validation`, `error` ni `missing-config` en el reenvío.
   - M6-b («`setSent(false)` en cualquier kind ≠ ok») cae solo porque muta también la rama 429.
   - Riesgo real: un corte de red al reenviar devolvería al usuario al formulario vacío.
3. **R7 «WHEN arranca un envío nuevo THE SYSTEM SHALL limpiar `forgot-error`» (y D11: el error vive en los dos estados): solo hay candado para el envío desde el formulario.**
   - Sonda P4, en `mobile-pet-tracker/src/screens/forgot/index.tsx:27`: `if (!sent) setError(null);`.
   - Resultado: `src/screens/forgot/index.test.tsx`, 20/20 verde, exit 0. **Sobrevive.**
   - El único `it` de limpieza es `un envío posterior que resuelve ok limpia forgot-error…`, y pasa por `forgot-submit`. Ningún test hace un reenvío con error seguido de un reenvío.
   - Riesgo real: tras un 429 al reenviar, el siguiente reenvío correcto deja visible «Demasiados intentos…».

### Huecos menores (no bastan solos para rechazar; se listan por el barrido exhaustivo)

4. **R9 «un único ScrollView … para los dos estados»: en el estado enviado solo hay candado para `contentContainerStyle` y `keyboardShouldPersistTaps`.**
   - Sonda P7, en `index.tsx:62`: `className={sent ? 'flex-1' : 'flex-1 bg-background'}`.
     - Corrí `index.test.tsx` más consistency, legibility y design-drift: 160/160 verde. **Sobrevive.**
   - Sonda P8, en `index.tsx:64`: `contentInsetAdjustmentBehavior={sent ? 'never' : 'automatic'}`. 20/20 verde. **Sobrevive.**
   - La lista de tests de R9 en la spec pedía exactamente esas dos aserciones. Son mutaciones poco probables, pero la cláusula «los dos estados» las abarca.

### Puntos que pidió el leader

5. **(a) Segunda llamada con JSON inválido en `#117 R2 › mapea un 400 sin errors a error`: es una OBSERVACIÓN, no un defecto.**
   - Cubre la rama «(o con JSON inválido)» de la EARS de R2, que la lista de tests de la spec omitía.
   - No cambia el sentido del candado, conserva el recuento normativo de `it` (7 en el describe) y Codex lo declaró en el informe (línea 736).
   - Único coste: es diagnóstico. Un mismo `it` reporta dos casos, y si cae la primera aserción la segunda no se evalúa.
6. **(b) Reanudación del verde T2 en `6ff636d3`: coherente, sin residuo.**
   - El catálogo tiene las mismas 6 claves añadidas en `en` y `es`, y `forgot.comingSoon` sale de los dos.
   - `forgot.sentTo` lleva `{{email}}` en los dos idiomas (lo asevera `#117 R1 › markerNames`).
   - En el catálogo hay 20 líneas `'forgot.` (10 por idioma) y 0 `comingSoon`.
   - `specs/mobile-ui-language/design.md` §2.1:
     - Cabecera «36 ocurrencias, 28 claves».
     - `comingSoon` marcada como retirada.
     - Seis filas añadidas y dos de «uso añadido por #117 (R7)».
     - Cada clave nueva aparece una sola vez.
   - La fila §1 pasa a `src/screens/forgot/index.tsx (movida por #117) | 12`.
   - `git status` limpio. El script fallido `/tmp/117-T2.py` no entró en el árbol.
   - El informe recoge la parada y la decisión del leader (líneas 716-747).
   - Nota de proceso: la secuencia de Codex siguió tras fallar el script, como él mismo anota.

### Contadores globales (deltas)
- Catálogo: `... + 6 - 1` (#117 R1). `ui-language`:
  - `R1_AUTH` pasa a `29 + 7`, con título «resuelve las 36 …».
  - `SCREEN_FILES` lleva `+ 1 - 1` con comentario.
  - `ui-copy-table`: 5 filas viejas fuera y 12 nuevas para `src/screens/forgot/index.tsx`, delta +7 que cuadra con R1_AUTH. 0 filas de la ruta vieja.
- `consistency-classnames`: 4 reapuntados a `join('screens','forgot','index.tsx')`, 0 de la ruta vieja y sin cambio de totales.
- `legibility-classnames`: la fila de `inkSites` está reapuntada, con recuento 1.
- `design-drift`: sin diff.
- Nit, ajeno a #117: `ui-language.test.ts:168` titula «resuelve las 36» un `R7_PROFILE` de `35 - 1 + 2 + 1` (37). Ya estaba así en H0.

### Sondas de mutación (todas revertidas con `git checkout HEAD --`)

El cierre da `git status --short` con solo `?? progress/review_mobile-forgot-password.md` y `git diff --cached --stat` vacío.

| Sonda | Dónde | Resultado | Tipo de rojo |
|---|---|---|---|
| M2-b (Codex) | `auth.ts:249` lee `readJson` antes del `switch` | 5 rojos (R2 it 1 y 2, R11 ×3) | aserción (`not.toHaveBeenCalled`) |
| M11-a (Codex) | `auth.ts:251` exige `requested === true` en 200 | 4 rojos (R2 it 1, R11 ×3) | aserción (`toEqual`, `not.toHaveBeenCalled`) |
| M6-b (Codex) | `setSent(false)` en los 4 `setError(t(` | 1 rojo (R6 it 2) | consulta (`getByText('Revisa tu correo')`) |
| M10-c (Codex) | fila `inkSites` a `app/(auth)/forgot.tsx` | 1 rojo (`#61 R4`) | aserción (`Received has value: null`) |
| P1a | cuerpo con `email` (sin recortar) en vez de `submittedEmail` | 1 rojo (R5 it 2) | aserción (`toHaveTextContent`) |
| P1b | «Revisa tu correo» sin el correo interpolado | 2 rojos (R5 it 2, R11) | aserción |
| P2 | reenviar con `send(email)` | 1 rojo (R6 it 1) | aserción (`toEqual` de los argumentos) |
| P3 | cliente: 400 de zod tratado como `error` | 1 rojo (R2 it 3) | aserción (`toEqual`) |
| P9 | `forgot-resend` `isDisabled={false}` | 1 rojo (R6 it 1) | aserción (`toBeDisabled`) |
| P13 | `isDisabled` sin `trim()` | 1 rojo (R4 it 2) | aserción (`toBeDisabled`) |
| **P4** | `if (!sent) setError(null)` | **sobrevive** (20/20) | — |
| **P5** | `setSent(false)` solo en `unreachable` | **sobrevive** (20/20) | — |
| **P6** | `default: status >= 500 ? error : ok` | **sobrevive** (40/40) | — |
| **P7** | `className` sin `bg-background` en enviado | **sobrevive** (160/160, 4 suites) | — |
| **P8** | `contentInsetAdjustmentBehavior` `never` en enviado | **sobrevive** (20/20) | — |

Las cuatro sondas de Codex que repetí reproducen su tabla (informe, línea 3040).

### Jest independiente (8 ficheros del handoff)
`bunx jest --runTestsByPath --maxWorkers=2 <8 ficheros>` dio exit 0, 8 suites y 272 tests.
- La base del handoff era 243.
- Los deltas son auth +11, language-provider +2, suite nueva +20 y `forgot.test.tsx` −4: 243 + 11 + 2 + 20 − 4 = 272.

## Output de ./init.sh
Por instrucción del leader no lo corrí yo, porque el clasificador lo deniega a subagentes.
- Lo corrió el leader sobre HEAD `d39a9ea5`.
- `init-117.head` = `d39a9ea5`, que coincide con `git rev-parse --short HEAD`. `init-117.exit` = `exit=0`.
- Las líneas de error de Nest muestreadas (64, 101, 107, 113, 117, 121) son trazas de tests de rutas de error (poller, consumers).
- La 24753 es el FK de Drizzle del test de rollback `pets.e2e-spec.ts:207`.
- Lint y typecheck OK; termina con «✅ Todo verde».
```
Test Suites: 176 passed, 176 total          (backend unit, log:218)
Tests:       1348 passed, 1348 total
Test Suites: 2 passed, 2 total              (log:231)
Tests:       14 passed, 14 total
Test Suites: 93 passed, 93 total            (mobile, log:24565)
Tests:       2036 passed, 2036 total
Test Suites: 3 skipped, 29 passed, 29 of 32 total   (e2e, log:24879)
Tests:       8 skipped, 438 passed, 446 total
  Features: 138/148 completadas | 9 pendientes
```
