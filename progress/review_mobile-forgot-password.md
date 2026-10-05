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

## Barrido de la enmienda E1 (antes de la firma)
Fecha: 2026-10-05. HEAD `5362da73`. El código es el de `d39a9ea5`: `git diff --stat d39a9ea5..HEAD` solo toca `progress/` y `specs/`.

Método:
- Leí `requirements.md` R1-R11 y §Enmienda E1, y `tasks.md` §Enmienda E1.
- Leí el árbol en `d39a9ea5`: `src/screens/forgot/index.tsx`, `forgotPassword` en `src/api/auth.ts`, `src/screens/forgot/index.test.tsx` y el bloque `#117` de `src/api/__tests__/auth.test.ts`.
- Spike con tres ficheros de test sin seguimiento, fuera del árbol durante la escritura y copiados al árbol solo para cada corrida:
  - `e1spike.test.tsx`: la suite actual más los 7 `it` de E1.2-E1.4, tal como están escritos.
  - `e1extra.test.tsx`: mis `it` para probar los huecos.
  - `e1spike-auth.test.ts`: `auth.test.ts` más el `it.each` de E1.1 y una fila 302 mía.
- Cada sonda se plantó en producción y se corrió con `bunx jest --runTestsByPath`.
- Después se revirtió con `git checkout HEAD -- <ruta>`.
- Al final borré los spikes. `git status --short` sale vacío y `git diff --cached --quiet` sale 0.
- No corrí `./init.sh` ni la suite global.

### 1. Cláusulas universales, rama por rama

| R | Cláusula | Rama | Candado | Estado |
|---|---|---|---|---|
| R1 | seis claves «en `en` y en `es`» | 6 × 2 | `#117 R1 › registra las seis claves…`: bucle `english[key]` / `spanish[key]` por fila | OK |
| R1 | retirar `forgot.comingSoon` «de los dos idiomas» | en, es | `#117 R1 › retira forgot.comingSoon de los dos idiomas` | OK |
| R1 | `{{email}}` «en los dos idiomas» | en, es | literal del it 1 y `markerNames`, que ya existía | OK |
| R1 | «conservar sin cambios» seis claves | 6 × 2 | ancla estática: `git diff b2a9c2aa..HEAD -- src/i18n/catalog.ts` solo da −2 (`comingSoon`) y +12 | OK, medido |
| R2 | `baseUrl` «`undefined` o `''`» | 2 | `it.each([undefined, ''])` | OK |
| R2 | 400 «sin `errors` (o con JSON inválido)» | 2 | `mapea un 400 sin errors a error`, con dos llamadas (E1.5) | OK |
| R2 | «cualquier otro status» | 2xx | E1.1, fila 201 | OK |
| R2 | «cualquier otro status» | 3xx | ninguno | **H1** |
| R2 | «cualquier otro status» | 4xx | E1.1, fila 404 | OK |
| R2 | «cualquier otro status» | 5xx | `mapea 500 a error` y E1.1, fila 503 | OK |
| R2 | «cualquier otro status» | 1xx | inalcanzable: fetch no entrega respuestas informativas | no aplica |
| R2 | «no lanzar en ninguna de las ramas» | todas | cada rama tiene su `resolves.toEqual` | OK (3xx si se acepta H1) |
| R3 | route «sin `t(`, sin `useThemeColors`, sin JSX propio» | 3 | ancla estática: el route tiene 5 líneas y solo devuelve `<ForgotScreen />` | OK, leído |
| R3 | `grep -c Platform` = 0 | — | medido: 0 | OK |
| R3 | «WHEN se pulsa `link-login`» → `push('/login')` sin `forgotPassword` | estado (a) | `#117 R3 › link-login navega a /login sin petición de red` | OK |
| R3 | «WHEN se pulsa `link-login`» → `push('/login')` sin `forgotPassword` | estado enviado | ninguno | **H2** |
| R4 | «WHILE `email.trim() === ''`» | `''`, `'   '`, con valor, `''` | R4 it 2 | OK |
| R4 | «WHILE no se ha enviado (`sent === false`) … no renderizar `forgot-resend`» | antes del envío | R4 it 3 | OK |
| R4 | «WHILE no se ha enviado (`sent === false`) … no renderizar `forgot-resend`» | tras un error | R7, las 5 filas del `it.each` | OK |
| R4 | «WHILE no se ha enviado (`sent === false`) … no renderizar `forgot-resend`» | en vuelo | ninguno | **H3** |
| R4 | «… ni `forgot-error`» | — | contradice R7; ver §5 | redacción |
| R5 | «WHILE la petición vuela», `forgot-submit` deshabilitado | primer envío | R5 it 1 | OK |
| R5 | «WHILE la petición vuela», `forgot-submit` deshabilitado | reenvío desde el formulario | E1.3 it 1, paso 5 | OK |
| R5 | «El tile `Lock` se conserva» | estado enviado | ninguno de render. Los candados de consistency leen el texto fuente y no ven un render condicional | **H4** |
| R6 | «WHILE `sent` WHEN se pulsa `forgot-resend`» → mismo segundo argumento | primer reenvío | R6 it 1 (`calls[1][1]` contra `calls[0][1]`) | OK |
| R6 | «WHILE `sent` WHEN se pulsa `forgot-resend`» → mismo segundo argumento | reenvío tras un error de reenvío | ninguno | **H6** |
| R6 | `forgot-resend` deshabilitado mientras vuela | primer reenvío | R6 it 1 | OK |
| R6 | `forgot-resend` deshabilitado mientras vuela | tras un error | E1.3 it 2, paso 7 | OK |
| R6 | reenvío ok: «mismo título y cuerpo», `forgot-resend` habilitado | título y botón | R6 it 1 y E1.3 it 2, paso 10 | OK |
| R6 | reenvío ok: «mismo título y cuerpo», `forgot-resend` habilitado | cuerpo | ninguno | **H5** |
| R6 | «IF … `kind` distinto de `ok`»: título, `forgot-resend` presente y habilitado, sin `forgot-email` | 5 kinds | `rate-limited` en R6 it 2; las otras 4 en las filas de E1.2 | OK |
| R7 | 5 kinds en el estado (a), «y nada más del cuerpo» | 5 | `it.each` de 5 filas con `toHaveTextContent` exacto | OK |
| R7 | `error` y `missing-config` comparten una sola llamada a `t(` | — | `checkUses` (M7-g) | OK |
| R7 | «WHILE se muestra `forgot-error` en (a)»: título, campo con su valor, `forgot-submit` habilitado, sin `forgot-resend` | 5 kinds | las 5 filas | OK |
| R7 | «WHEN arranca un envío nuevo»: limpiar el error | formulario | E1.3 it 1 | OK |
| R7 | «WHEN arranca un envío nuevo»: limpiar el error | reenviar | E1.3 it 2 | OK |
| R7 | «WHEN ese envío resuelve ok»: sin `forgot-error` | formulario | R7 it 2 y E1.3 it 1, paso 8 | OK |
| R7 | «WHEN ese envío resuelve ok»: sin `forgot-error` | reenviar | E1.3 it 2, paso 10 | OK |
| R8 | KAV con `paddingBottom` | estado (a) | R8 it | OK |
| R8 | KAV con `paddingBottom` | estado enviado | inalcanzable: sin campo de texto no hay teclado | no aplica |
| R9 | ScrollView «único … para los dos estados» | `contentContainerStyle` | `#61 R8` y R9 it | OK |
| R9 | ScrollView «único … para los dos estados» | `keyboardShouldPersistTaps` | `#61 R8` y R9 it | OK |
| R9 | ScrollView «único … para los dos estados» | `contentInsetAdjustmentBehavior` | `#61 R8` y E1.4 | OK con E1.4 |
| R9 | ScrollView «único … para los dos estados» | `className` | E1.4 | OK con E1.4 |
| R9 | ScrollView «único … para los dos estados» | `testID` en el estado enviado | R9 it, por consulta | OK |
| R10 | deltas de los candados globales | — | suite global y anclas grep estáticas | OK, no son ramas de comportamiento |
| R11 | 200 «con cualquier cuerpo» | `requested: true` y `false`, `{}`, JSON inválido | R2 it 1 y los 3 casos de R11. El `res.json` no llamado cierra cualquier otro cuerpo | OK |
| R11 | «dos correos distintos» | 2 | R11 pantalla | OK |

### 2. E1.1-E1.4: literales, sondas y cifras

**Literales** (todos existen tal cual en el árbol):
- Los cuatro títulos de `describe`.
- Los `it` tras los que se inserta:
  - `mapea 500 a error`
  - `un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»`
  - `un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»`
  - el `it` de R9
- Los helpers:
  - `response` e `invalidJsonResponse` (`auth.test.ts:9` y `:16`).
  - `renderRoute`, `submitForgot` y `mockForgotPassword` (`index.test.tsx`).
- El copy `es` de `catalog.ts`, incluidas las líneas 376, 379 y 380.
- Los testID `forgot-error`, `forgot-resend`, `forgot-email`, `forgot-submit` y `forgot-form`.
- Los precedentes de E1.4: `geofences/index.test.tsx:105` y `alert-detail/index.test.tsx:181`.
- Las anclas de las sondas son únicas en su fichero. El script lo comprobó con `count == 1` antes de plantar cada una.

**Sondas** (cada una plantada, corrida y revertida):

| Sonda | Cayó | Modo | Debe seguir verde |
|---|---|---|---|
| M2-f | filas 201 y 404 | aserción | — |
| M2-g | fila 201 | aserción | — |
| M2-h | fila 503 | aserción | — |
| M6-e | fila `validation` de E1.2 | consulta (`Unable to find … Revisa tu correo`) | el `it` del 429: verde |
| M6-f | fila `unreachable` | consulta | el `it` del 429: verde |
| M6-g | filas `error` y `missing-config` | consulta | el `it` del 429: verde |
| M7-h | los dos `it` de E1.3, en el `toBeNull` del paso en vuelo | aserción | `un envío posterior…`: verde |
| M7-i | solo el `it` del reenvío | aserción | el `it` del formulario: verde |
| M9-e | segunda aseveración de `className` | aserción | — |
| M9-f | segunda aseveración de `contentInsetAdjustmentBehavior` | aserción | — |
| M9-g | primera aseveración de `className` | aserción | — |

En todas las sondas cayó exactamente lo que la tabla de `tasks.md` dice, y nada más.

**Cifras**:
- `auth.test.ts`: 40 → 43. El spike dio 44, que son 43 más mi fila 302.
- Suite forgot: 20 → 27. El spike dio 27.
- Las otras dos cifras salen por aritmética sobre el informe de la ronda 1, porque no corrí la suite global:
  - 8 suites del handoff: 272 + 10 = 282.
  - Suite global: 93 suites y 2036 + 10 = 2046.
- Ningún candado global se mueve:
  - `consistency-classnames` excluye `*.test.tsx` (`sourceFiles`).
  - `design-drift` sí los lee, pero solo busca clases arbitrarias `-[…]`.

### 3. Esperas
- Todas las esperas de E1.2-E1.4 son sobre el árbol: `findBy*` y `waitFor` sobre `toBeDisabled`.
- No hay temporizadores falsos.
- `act` solo envuelve el `resolveRequest`, igual que R5 y R6.
- Cada aserción de ausencia va anclada a un nodo positivo previo (§Esperas, segundo párrafo).
- Mejora opcional, no cuenta como hueco: en E1.3 it 1 el paso 4 pulsa `forgot-submit` sin esperar a que se habilite.
  - Hoy es determinista: `setError` y el `setSubmitting(false)` del `finally` caen en el mismo lote.
  - Un `await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled())` antes del paso 4, simétrico al paso 5 del it 2, garantiza que el `toBeDisabled` del paso 5 observa la petición nueva y no un estado anterior.

### 4. Huecos
Cada mutación se plantó en el spike:
- Las 8 suites del handoff no se corrieron con ella; se corrieron los `it` de E1.1-E1.4 tal como están escritos, más la suite forgot entera.
- Con cada mutación todos quedaron verdes. Solo cayó mi `it` de prueba.
- Las cinco de pantalla (H2-H6) también se corrieron contra la suite forgot entera, que hoy tiene 20 `it`, y la dejaron verde.
- La de cliente (H1) solo se corrió contra el spike de auth.

1. **H1. R2, «WHEN `status` es cualquier otro (…)»: falta la clase 3xx.**
   - E1.1 dice que 201, 404 y 503 cubren «las tres clases que el 500 no cubre». Falta 3xx. fetch entrega un 3xx sin `Location` o un 304.
   - Mutación que sobrevive: `if (result.response.status >= 300 && result.response.status < 400) return { kind: 'ok' };` justo antes del `switch` de `forgotPassword`.
   - Cambio mínimo: `it.each([201, 302, 404, 503])`.
   - Sonda nueva M2-i, con esa mutación: cae la fila 302 por aserción.
   - Cifras: +1 test.
   - Severidad: menor. La EARS solo pone de ejemplo 500, 404 y 503.
2. **H2. R3, «WHEN se pulsa `link-login` → `router.push('/login')` sin invocar `forgotPassword`»: falta el estado enviado.**
   - `link-login` existe en los dos estados (R4 y R5), pero solo se pulsa en (a).
   - Mutación que sobrevive: `onPress={() => router.push(sent ? '/' : '/login')}`.
   - Cambio mínimo: un `it` nuevo en `#117 R3`, `it('link-login navega a /login también desde «Revisa tu correo», sin petición nueva')`. Pasos:
     - `mockResolvedValue({ kind: 'ok' })`, `renderRoute`, `submitForgot` y `findByText('Revisa tu correo')`.
     - Pulsa `link-login`.
     - `expect(mockRouter.push).toHaveBeenCalledWith('/login')`.
     - `expect(mockForgotPassword).toHaveBeenCalledTimes(1)`.
   - Sonda M3-e: cae por aserción.
   - Cifras: +1 test.
3. **H3. R4, «WHILE no se ha enviado (`sent === false`) THE SYSTEM SHALL no renderizar `forgot-resend`»: falta la petición en vuelo.**
   - Mutación que sobrevive: `{sent || submitting ? (` en el bloque de `forgot-resend`. Muestra «Reenviar», deshabilitado, mientras vuela el primer envío.
   - Cambio mínimo: en E1.3 it 1, paso 6, añadir `expect(screen.queryByTestId('forgot-resend')).toBeNull()`.
   - Sonda M4-f: cae por aserción en ese `it`.
   - Cifras: +0 tests.
4. **H4. R5, «El tile `Lock` se conserva»: ningún render lo comprueba en el estado enviado.**
   - Mutación que sobrevive: envolver el `<View className="size-16 …">` en `{!sent && …}`.
     - Los literales del fuente no cambian, así que `consistency-classnames` sigue verde.
     - Ningún test de pantalla localiza el tile.
   - Cambio mínimo: un `it` nuevo en `#117 R5`, `it('el tile Lock sigue en pie en los dos estados')`.
     - Localiza el tile entre los hijos del padre de `forgot-title`, con el patrón `.parent` de `src/screens/docs/index.test.tsx:221`:
       `(screen.getByTestId('forgot-title').parent?.children ?? []).find((c) => typeof c !== 'string' && c.props.className === 'size-16 items-center justify-center rounded-xl bg-accent-soft')`.
     - Asevera `toBeDefined()` antes y después de `findByText('Revisa tu correo')`.
     - En el spike: verde sin mutación y cae por aserción con ella.
     - El tipado con `tsc` está sin comprobar. El spike usó `as unknown[]` y un cast de `props`.
   - Sonda M5-g: cae por aserción.
   - Cifras: +1 test.
5. **H5. R6, «WHEN el reenvío resuelve `ok` … permanecer en el estado enviado (mismo título y cuerpo)»: el cuerpo no tiene candado.**
   - Mutación que sobrevive: `setSubmittedEmail(sent ? '' : target);` en `case 'ok':`. Tras reenviar, el cuerpo queda «Si existe una cuenta para , …».
   - Cambio mínimo, en E1.3 it 2:
     - Paso 2: `submitForgot('  Ana@Example.com ')`.
     - Paso 10: añadir `expect(screen.getByTestId('forgot-body')).toHaveTextContent('Si existe una cuenta para Ana@Example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.')`.
   - Sonda M6-h: cae por aserción.
   - Cifras: +0 tests.
6. **H6. R6, «WHILE `sent === true` WHEN se pulsa `forgot-resend` → mismo segundo argumento que la primera llamada»: falta el reenvío tras un error.**
   - Solo el primer reenvío lo compara (R6 it 1).
   - Mutación que sobrevive: `onPress={() => void send(error ? email : submittedEmail)}`.
     - Con el correo por defecto `ana@example.com`, `email` y `submittedEmail` coinciden. Por eso E1.3 it 2 tal como está escrito no la ve aunque haga la tercera llamada.
   - Cambio mínimo, en E1.3 it 2:
     - Con el correo de H5, después del paso 7 añadir `expect(mockForgotPassword.mock.calls[2][1]).toEqual(mockForgotPassword.mock.calls[0][1])`.
     - Va tras la espera sobre el árbol, como R6 it 1, así que no incumple §Esperas.
   - Sonda M6-i: cae por aserción.
   - Cifras: +0 tests.

**Control de los cambios propuestos.** Un spike con E1.3 it 1 y E1.3 it 2 modificados según H3, H5 y H6:
- Verde sin mutación.
- M7-h sigue tumbando los dos `it`, y M7-i solo el del reenvío.
- Con las mutaciones de H3, H5 y H6 cae cada una en su `it`, por aserción.

**Cifras si se aceptan los seis** (H2 y H4 añaden `it`, H1 añade una fila; H3, H5 y H6 solo añaden aseveraciones):

| Suite | Antes de E1 | E1 tal cual | E1 + huecos |
|---|---:|---:|---:|
| `src/api/__tests__/auth.test.ts` | 40 | 43 | 44 |
| `src/screens/forgot/index.test.tsx` | 20 | 27 | 29 |
| Las 8 suites del handoff | 272 | 282 | 285 |
| Global `mobile-pet-tracker` | 93 / 2036 | 93 / 2046 | 93 / 2049 |

La lista cerrada de ficheros no cambia: todo va en `auth.test.ts` y `index.test.tsx`.

### 5. Observación de redacción (no cuenta como hueco)
R4 viñeta 3 dice: «WHILE no se ha enviado THE SYSTEM SHALL no renderizar `forgot-resend` ni `forgot-error`». R4 viñeta 1 define «no se ha enviado» como `sent === false`.
- R7 exige `forgot-error` justo con `sent === false`, tras un resultado distinto de `ok`. Las dos cláusulas se contradicen en ese caso.
- La producción sigue a R7, y R4 it 3 solo lo comprueba antes del primer envío.
- Un reviewer literal podría leerlo como incumplimiento de R4.
- Propuesta para la enmienda: reescribir la cláusula como «WHILE `sent === false` THE SYSTEM SHALL no renderizar `forgot-resend`; antes del primer envío tampoco `forgot-error` (R7 lo pinta tras un resultado distinto de `ok`)».

Barrido: 6 huecos
