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

## Ronda 2
Fecha: 2026-10-05. HEAD `49de71b6`. H0 `453d0cd8`. Rango revisado: `453d0cd8..49de71b6` (7 commits de Codex).
Veredicto: RECHAZADO

En una frase: Codex cumplió la enmienda E1 al pie de la letra y sin desvíos, y el rechazo viene de una cláusula universal que E1 no cubría. R4 viñeta 1 dice «WHILE no se ha enviado (`sent === false`) THE SYSTEM SHALL renderizar título, instrucciones, `Label` y `link-login`», y ningún test la comprueba en dos de sus flujos: con la petición en vuelo y tras un error. El hueco está en la spec y en mi barrido previo a la firma, no en la ejecución.

### Alcance
- Commits del rango:
  - `a3426e90` test(mobile): lock every other status as error in the forgot client (#117 R2, E1)
  - `7c2937e2` test(mobile): lock resend errors for every non-ok kind (#117 R6, E1)
  - `2ad3fb99` test(mobile): lock forgot-error clearing as soon as a new request starts (#117 R7, E1)
  - `3f347525` test(mobile): lock the forgot scroll container props in both states (#117 R9, E1)
  - `99c5b354` test(mobile): lock link-login from the sent state (#117 R3, E1)
  - `2c6a2210` test(mobile): lock the Lock tile in both states (#117 R5, E1)
  - `49de71b6` docs(mobile): trace #117 amendment E1 to its tests and commits
- `git diff --numstat 453d0cd8..49de71b6` toca exactamente los 4 ficheros de la lista cerrada:
  - `mobile-pet-tracker/src/api/__tests__/auth.test.ts`: +6 / −0
  - `mobile-pet-tracker/src/screens/forgot/index.test.tsx`: +97 / −0
  - `progress/impl_mobile-forgot-password.md`: +1692 / −0
  - `specs/mobile-forgot-password/traceability.md`: +17 / −7
- Producción: 0 líneas, tanto desde `453d0cd8` como desde `d39a9ea5`. `git diff d39a9ea5..49de71b6 -- mobile-pet-tracker` solo toca los dos ficheros de test.
- Los dos diffs de test son solo adiciones (−0).
- E1.5 y E1.8 no tienen commit, como pide la enmienda. E1.5 ya lo cumplía `7ba0b3a9` de la ronda 1, y E1.8 solo cambia la lectura de la spec.

## Checklist C2 — Estado coherente (ronda 2)
- [x] Solo 1 feature in_progress: `grep -c '"status": "in_progress"' feature_list.json` da 1, y es #117.
- [x] `progress/current.md` recoge la firma de E1 (`75cb3104`) y el handoff de la ronda 2 (`453d0cd8`).

## Checklist C3 — Arquitectura (ronda 2)
- [x] No aplica cambio: la producción es la misma que aprobó C3 en la ronda 1, porque el diff de producción es 0.

## Checklist C4 — TDD (ronda 2)
- [x] Cada `it` nuevo vive en un `describe` que nombra su R-id: `#117 R2`, `#117 R3`, `#117 R5`, `#117 R6`, `#117 R7` y `#117 R9`. Medido con `grep -cF` sobre los títulos exactos de E1.1-E1.4: 1 cada uno.
- [x] La ronda es solo de tests sobre un código que ya estaba verde, así que no hay historial rojo→verde que exigir. El rojo lo sustituyen las 17 sondas de `tasks.md` §Enmienda E1, que replanté yo (tabla abajo). Hay un commit por R-id, y cada uno incluye la etiqueta `E1`.

## Checklist C5 — Trazabilidad (ronda 2)
- [x] `traceability.md` no tiene filas "pendiente".
- [x] Los 23 hashes citados pasan `git cat-file -t` = `commit` y `git merge-base --is-ancestor <h> HEAD`.
- [x] La fila E1.5 cita `7ba0b3a9`.
- [x] Formato de los commits: `test(mobile): <desc> (#117 Rn, E1)` y `docs(mobile): …`.

## Checklist C6 — Spec aprobada (ronda 2)
- [x] `requirements.md` está en `status: approved`.
- [x] La casilla de §Enmienda E1 está marcada. Commit de firma `75cb3104`, aprobación vía Notion.

## Checklist C7 — Sin código huérfano (ronda 2)
- [x] N/A en esta ronda. No reemplaza nada, y la retirada del stub de la ronda 1 sigue intacta.

## Checklist C8 — UI móvil (ronda 2)
- [x] Sin cambio de UI.
- [x] Hay 0 `-[` en las líneas añadidas y `git diff --check 453d0cd8..49de71b6` sale vacío.
- [x] Typecheck `tsc --noEmit` en `mobile-pet-tracker/`: exit 0. Antes y después, `test ! -e mobile-pet-tracker/.expo/types/router.d.ts` = 0. No lo borré.
- [ ] Smoke S1-S9 en dev build de Android: sigue pendiente del humano. Este veredicto ni lo marca ni lo bloquea.

### Evidencia de `./init.sh` (leída, no ejecutada)
El leader corrió `./init.sh` porque el clasificador se lo deniega al subagente. Yo leí la evidencia en el scratchpad de la sesión:
- `init-117-r2.exit` = `0`.
- `init-117-r2.head` = `49de71b6`. HEAD sigue en `49de71b6` al cerrar esta revisión.
- `init-117-r2.log`:
  - backend: `Test Suites: 176 passed`, `Tests: 1348 passed`.
  - infra: `Test Suites: 2 passed`, `Tests: 14 passed`.
  - mobile: `Test Suites: 93 passed, 93 total`, `Tests: 2049 passed, 2049 total`. Coincide con la cifra global de E1 (93 / 2049).
  - e2e: `Test Suites: 3 skipped, 29 passed, 29 of 32 total`, `Tests: 8 skipped, 438 passed, 446 total`.
  - lint (backend, infra, `expo lint`) y `tsc --noEmit` verdes.
  - Termina en `✅ Todo verde. Listo para trabajar.`

### Corrida independiente
- `bunx jest --runTestsByPath src/api/__tests__/auth.test.ts src/screens/forgot/index.test.tsx`, desde `mobile-pet-tracker/` y sin pipe: exit 0 con 73 / 73. Son 44 de auth más 29 de forgot, las cifras de E1.
- No corrí la suite global ni las otras 6 suites del handoff, por instrucción del leader. Su verde viene de `init-117-r2.log`.

### Sondas de mutación de E1 (replantadas por mí)
Método de cada sonda:
- Reemplazo literal en producción, con recuento de ancla = 1.
- `bunx jest --runTestsByPath` sobre las dos suites, con `--json`.
- Revertido con `git checkout HEAD -- <ruta>`. Después, `git diff --quiet -- <ruta>` = 0 y `git diff --cached --quiet` = 0. Las 17 sondas revirtieron con 0 / 0 / 0.

| Sonda | Mutación (`tasks.md` §Enmienda E1) | Cae | Línea | Modo | Debe seguir verde |
|---|---|---|---|---|---|
| M2-f | `default:` devuelve `ok` si status < 500 | filas 201, 302 y 404 de E1.1 | `auth.test.ts:326` | aserción | fila 503 y `mapea 500 a error`: verdes |
| M2-g | `case 201:` junto a `case 200:` | fila 201 | `auth.test.ts:326` | aserción | — |
| M2-h | `case 503: return { kind: 'ok' }` | fila 503 | `auth.test.ts:326` | aserción | — |
| M2-i | `if (3xx) return { kind: 'ok' }` antes del `switch` | fila 302 | `auth.test.ts:326` | aserción | — |
| M6-e | `setSent(false)` antes de `forgot.invalidEmail` | fila `validation` de E1.2 | `index.test.tsx:320` | consulta | `it` del 429: verde |
| M6-f | `setSent(false)` antes de `common.cannotReachServer` | fila `unreachable` | `:320` | consulta | `it` del 429: verde |
| M6-g | `setSent(false)` antes de `common.somethingWentWrong` | filas `error` y `missing-config` | `:320` | consulta | `it` del 429: verde |
| M7-h | `setError(null)` movido a `case 'ok':` | los dos `it` de E1.3 | `:245` y `:266` | aserción | `un envío posterior que resuelve ok…`: verde |
| M7-i | `if (!sent) setError(null)` | solo el `it` del reenvío | `:266` | aserción | `it` del formulario: verde |
| M4-f | `{sent \|\| submitting ? (` en `forgot-resend` | `it` del formulario | `:246` | aserción | — |
| M6-h | `setSubmittedEmail(sent ? '' : target)` | `it` del reenvío | `:271` | aserción | — |
| M6-i | `send(error ? email : submittedEmail)` en `forgot-resend` | `it` del reenvío | `:265` | aserción | — |
| M9-e | `className={sent ? 'flex-1' : 'flex-1 bg-background'}` | `it` de E1.4 | `:370` | aserción | — |
| M9-f | `contentInsetAdjustmentBehavior={sent ? 'never' : 'automatic'}` | `it` de E1.4 | `:371` | aserción | — |
| M9-g | `className="flex-1"` | `it` de E1.4 | `:366` | aserción | — |
| M3-e | `router.push(sent ? '/' : '/login')` | `it` nuevo de R3 | `:74` | aserción | `link-login navega a /login sin petición de red`: verde |
| M5-g | tile `Lock` envuelto en `{!sent && (…)}` | `it` del tile, segunda comprobación | `:198` | aserción | — |

Las 17 caen donde y como dice `tasks.md`, y todo lo que debía seguir verde siguió verde. Coinciden con la tabla de Codex en `progress/impl_mobile-forgot-password.md` §Ronda 2.

### Barrido exhaustivo de cláusulas universales (R1-R11 y E1)
Las filas en OK del barrido previo a la firma (§Barrido de la enmienda E1, tabla 1) siguen en OK, porque la producción no cambió y los tests solo crecieron.

Los seis huecos de ese barrido quedan cerrados:

| Hueco | Rama | Candado ahora | Sonda que lo prueba |
|---|---|---|---|
| H1 | R2 «cualquier otro status», 3xx | E1.1, fila 302 | M2-f, M2-i |
| H2 | R3 `link-login` desde el estado enviado | `link-login navega a /login también desde «Revisa tu correo», sin petición nueva` | M3-e |
| H3 | R4 `forgot-resend` en vuelo | E1.3 `it` 1, `toBeNull` de `forgot-resend` en vuelo | M4-f |
| H4 | R5 tile `Lock` en el estado enviado | `el tile Lock sigue en pie en los dos estados` | M5-g |
| H5 | R6 cuerpo tras un reenvío ok | E1.3 `it` 2, literal de `forgot-body` con `Ana@Example.com` | M6-h |
| H6 | R6 argumento del reenvío tras un error | E1.3 `it` 2, `mock.calls[2][1]` contra `calls[0][1]` | M6-i |

También quedan en OK las ramas que nombra la propia E1: E1.1 cubre 2xx, 3xx, 4xx y 5xx; E1.2 los cuatro kinds; E1.3 los dos botones; E1.4 los dos estados. Cada rama tiene sonda propia en la tabla de arriba.

Ramas nuevas sin candado. Todas las mutaciones dejan las dos suites en 73 / 73 con exit 0 y revierten con 0 / 0 / 0:

| R | Cláusula | Rama | Sonda | Mutación | Efecto visible | Estado |
|---|---|---|---|---|---|---|
| R4 v1 | WHILE `sent === false`: `forgot-title` = «Recuperar contraseña» | en vuelo | X-a | `{sent \|\| submitting ? t('forgot.checkYourEmail') : …}` | cabecera de éxito «Revisa tu correo» antes de saber el resultado; si falla, el usuario vio éxito y vuelve el formulario | **sin candado, bloquea** |
| R4 v1 | WHILE `sent === false`: `forgot-body` = instrucciones | en vuelo | X-b | `{sent \|\| submitting ? t('forgot.sentTo', …) : …}` | cuerpo «Si existe una cuenta para , te enviamos…» con el correo vacío | **sin candado, bloquea** |
| R4 v1 | WHILE `sent === false`: `forgot-body` = instrucciones | tras un error | X-c | `{sent ? sentTo : error ?? t('forgot.instructions')}` | el error sustituye a las instrucciones y sale dos veces | **sin candado, bloquea** |
| R4 v1 | WHILE `sent === false`: `link-login` | en vuelo | X-d | `link-login` envuelto en `{!submitting && (…)}` | sin vuelta a «Iniciar sesión» mientras vuela; con red lenta, hasta el timeout | **sin candado, bloquea** |
| R4 v1 | WHILE `sent === false`: `link-login` | tras un error | X-e | `link-login` envuelto en `{!error && (…)}` | sin vuelta a «Iniciar sesión» tras cualquier error | **sin candado, bloquea** |
| R4 v1 | WHILE `sent === false`: `Label` «Correo electrónico» | tras un error | X-f | `Label` envuelto en `{!error && (…)}` | el campo pierde su etiqueta visible | sin candado, menor |
| R6 v3 | IF el reenvío no es ok: «permanecer en el estado enviado» | cuerpo | X-g | `{sent && !error ? sentTo : instructions}` | tras un reenvío fallido, título «Revisa tu correo» con las instrucciones del formulario | fuera de la letra, informativa |
| R6 v3 | IF el reenvío no es ok: «permanecer en el estado enviado» | `forgot-submit` | X-h | `{!sent \|\| error ? (` en `forgot-submit` | `forgot-submit` aparece tras un reenvío fallido | fuera de la letra, informativa |
| R6 v1/v2 | reenvío en vuelo | `forgot-title` | X-i | `{sent && !submitting ? t('forgot.checkYourEmail') : …}` | el título pasa a «Recuperar contraseña» mientras vuela el reenvío | fuera de la letra, informativa |

Por qué X-g, X-h y X-i quedan fuera de la letra:
- El paréntesis de R6 viñeta 3 enumera qué es «el estado enviado»: título `Revisa tu correo`, `forgot-resend` presente y habilitado, y sin `forgot-email`. No incluye el cuerpo ni la ausencia de `forgot-submit`, y ese paréntesis está candado en sus 5 kinds.
- El render del estado enviado lo da R5 viñeta 3, que es un WHEN (`WHEN el resultado es ok`) y no un WHILE.
- R6 viñeta 2 habla de «al resolver ok», no del tramo en vuelo.

R4 viñeta 1, en cambio, es un WHILE que enumera cada elemento. Sus ramas «en vuelo» y «tras un error» son del mismo tipo que H3/M4-f (un elemento de un WHILE sin candado en un flujo del mismo estado), que el humano firmó dentro de E1 para cerrarlo.

## Observaciones (ronda 2)

### Defectos (motivo del rechazo)
1. **R4 viñeta 1 sin candado con la petición en vuelo (X-a, X-b, X-d).**
   - La cláusula es «WHILE no se ha enviado (`sent === false`) THE SYSTEM SHALL renderizar `forgot-title` con `t('forgot.forgotPassword')`, `forgot-body` con `t('forgot.instructions')`, `TextField` con `Label`, … `LinkButton testID="link-login"`». Mientras vuela la primera petición, `sent` sigue en `false`.
   - Hay dos `it` con ventana en vuelo desde el formulario, y en ninguno se comprueban título, cuerpo ni `link-login`:
     - R5 `it` 1, `envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición`. Tras el `waitFor` de `index.test.tsx:163` solo comprueba las llamadas al mock y `forgot-email` visible. El `findByText('Revisa tu correo')` posterior no distingue la mutación, porque con X-a el texto ya estaba antes de resolver.
     - E1.3 `it` 1, `un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver`. Tras el `waitFor` de `:244` solo comprueba la ausencia de `forgot-error` y `forgot-resend`.
   - El riesgo más alto es X-a: una cabecera de éxito optimista. Es un patrón habitual de UI, y si la petición falla el usuario ya ha leído «Revisa tu correo».
2. **R4 viñeta 1 sin candado tras un error (X-c, X-e).**
   - Las 5 filas de R7, `mapea %p a «%s» en forgot-error, seleccionable, y deja el formulario en pie` (`index.test.tsx:204-222`), comprueban `forgot-error`, `selectable`, `forgot-title`, el valor de `forgot-email`, `forgot-submit` habilitado y la ausencia de `forgot-resend`.
   - No comprueban `forgot-body` = instrucciones, ni que `link-login` exista, ni el `Label` «Correo electrónico».
   - R7 viñeta 3 («conservar el formulario») no enumera esos tres elementos, pero R4 viñeta 1 sí, y es la cláusula que rige mientras `sent === false`.
   - Ningún otro `it` llega a ese estado y comprueba esos elementos. `un envío posterior que resuelve ok…` y E1.3 `it` 1 pasan por él sin mirar cuerpo ni enlace.

Codex no tiene ninguna culpa aquí. E1 no le pedía nada de esto, y mi barrido previo a la firma (§Barrido de la enmienda E1, tabla 1) solo partió R4 por sus viñetas 2 y 3: la viñeta 1 no tiene fila. Cerrarlo necesita una enmienda E2 del leader que el humano firme. Por lo leído, bastaría con añadir aseveraciones a `it` existentes:
- en los dos `it` en vuelo de arriba: título, cuerpo y `link-login`;
- en las filas de R7: cuerpo, `link-login` y `Label`.

En ese caso las cifras no cambiarían: 2 suites / 73, global 93 / 2049. La forma exacta y sus sondas son decisión de la enmienda, no de este veredicto.

### Huecos menores (no bastan solos para rechazar)
- X-f: el `Label` desaparece tras un error. La mutación es poco plausible, pero el campo se queda sin etiqueta visible. Si E2 toca las filas de R7, entra con coste 0.

### Informativas (fuera de la letra de la spec)
- X-g, X-h y X-i: el estado enviado no tiene un WHILE que enumere su render.
  - R5 viñeta 3 es un WHEN `ok`.
  - R6 viñeta 3 define «permanecer en el estado enviado» con un paréntesis de tres elementos.
  - R6 viñeta 2 no cubre el tramo en vuelo del reenvío.
- Si el leader quiere simetría con R4, la enmienda podría añadir «WHILE `sent === true` THE SYSTEM SHALL renderizar …» con su lista. No es un incumplimiento de la spec firmada.

### Sobre el trabajo de Codex en esta ronda
- Lista cerrada respetada, diff de producción 0 y tests solo con adiciones.
- Los literales y títulos de E1.1-E1.4 están tal cual: `grep -cF` da 1 en cada título nuevo.
- Las 17 sondas son reproducibles y caen en el `it`, la línea y el modo que dice `tasks.md`.
- Las esperas siguen §Esperas: espera sobre el árbol (`toBeDisabled`) antes de comprobar `mock.calls[2][1]`.
- Trazabilidad completa con hashes ancestros, y typecheck y lint verdes.
- Si E2 se limita a aseveraciones nuevas en `it` existentes, la ronda 3 es mecánica.

### Estado del árbol al terminar
- `git status --short` vacío, `git diff --quiet` = 0 y `git diff --cached --quiet` = 0 antes de este commit.
- HEAD `49de71b6`, branch `feature/117-mobile-forgot-password`.
- `mobile-pet-tracker/.expo/types/router.d.ts` sigue ausente.
- No corrí `./init.sh` ni la suite global, y no hice push.

## Barrido previo a la firma de E2

Fecha: 2026-10-05. HEAD 2f058cdd. Barrido cerrado.

Veredicto del barrido: REQUIERE CAMBIOS

Resumen: el spike de E2 compila y pasa (29/29, tsc y lint en 0) y las 16 sondas de T19 y T20 (27 corridas: 11 sobre `spike-t19` y 16 sobre `spike-full`) caen donde dice tasks.md, sin divergencias. Pero el barrido estado × flujo encuentra cinco defectos: D2, D4 y D5 son ramas sin candado que una mutación plausible deja en verde (Y-4, Y-8, Y-10, Y-11, medidas); D1 y D3 son anclas sin recuento y afirmaciones falsas de tasks.md sobre la cobertura del helper. Las correcciones con código (D2, D4, D5) están verificadas juntas en `spike-fix`: 31/31, tsc 0, lint 0, y cada sonda cae en la línea propuesta. Las sondas nuevas de D3 están medidas sobre `spike-full`.

### 1. Spike de E2.4 y E2.5

Método:
- `build.py` (scratchpad `e2/`) parte de `git show HEAD:…/index.test.tsx` y aplica el código literal de E2.4 justo después de `submitForgot`, las 13 líneas de E2.5 y los 3 cambios de línea. Cada edición se localiza por el título literal del `it` y por la ancla literal dentro de ese `it`.
- Dos variantes: `spike-t19` (estado intermedio de T19: sin `expectSentState` ni P3, P7-P13) y `spike-full` (E2 entera).
- Jest: el spike vive en el scratchpad y se copia como `src/screens/forgot/e2spike.test.tsx` sin seguimiento solo durante cada corrida; se borra en el `finally`.
- `tsc` y lint: superposición temporal sobre `index.test.tsx`, restaurada con `git checkout HEAD --`; `git diff --quiet -- mobile-pet-tracker` = 0 y `git diff --cached --quiet` = 0 tras cada una.

| Comprobación | `spike-t19` | `spike-full` |
|---|---|---|
| `bunx jest --runTestsByPath` | 29 / 29, exit 0 | 29 / 29, exit 0 |
| `test ! -e .expo/types/router.d.ts` | 0 (antes y después) | 0 (antes y después) |
| `bunx tsc --noEmit` | exit 0 | exit 0 |
| `bun run lint` | exit 0, sin warnings | exit 0, sin warnings |

`mockRouter.push.mockClear()` tipa: `tsc` exit 0 con el helper literal.

Anclas de E2.5, medidas con `grep -cF` sobre `index.test.tsx` en HEAD:

| Ancla | En el fichero | Dentro de su `it` | Desambiguada en la spec |
|---|---:|---:|---|
| P2 `expect(screen.getByTestId('forgot-email')).toBeVisible();` | 1 | 1 | sí |
| P5 `await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());` | **2** | 1 | por título del `it` («el primer» sobra: solo hay uno en el `it`) |
| P6 `expect(screen.queryByTestId('forgot-resend')).toBeNull();` | **3** | 1 | por título del `it` |
| P8 `expect(mockForgotPassword.mock.calls[1][1]).toEqual(mockForgotPassword.mock.calls[0][1]);` | 1 | 1 | sí |
| P12 `expect(screen.queryByTestId('forgot-error')).toBeNull();` | **7** | **2** | por título y ordinal («el primer…, el que va antes del `act`») |
| Cambio 1 y 3 `await submitForgot();` | **9** | 1 y 1 | por título del `it` |
| Cambio 2 `expect(screen.getByTestId('forgot-email').props.value).toBe('ana@example.com');` | 1 | 1 | sí |
| E2.4 `async function submitForgot(` | 1 | — | sí |
| E2.4 `describe('#117 R5: enviar pasa la pantalla a «Revisa tu correo»'` | 1 | — | sí |
| Los 9 títulos de `it` citados en E2.5 | 1 cada uno | — | sí |

Todas existen y son inequívocas leídas con su `it`. Las de recuento ≠ 1 en el fichero van al defecto D1 (§Defectos).


### 2. Sondas de T19 y T20

Cada sonda se planta sobre `index.tsx` con su ancla en recuento 1 y se corre contra el spike con `bunx jest --runTestsByPath … --json --outputFile`. Tras cada una: `git checkout HEAD --` del fichero de producción, `git diff --quiet -- mobile-pet-tracker` = 0 y `git diff --cached --quiet` = 0. Las 27 corridas revirtieron en 0/0/0.

T19, contra `spike-t19`:

| Sonda | Esperado (tasks.md) | Medido | Modo | Verdes exigidos |
|---|---|---|---|---|
| X-a | P2, P6 | R5 `it` 1 (P2), E1.3 `it` 1 (P6) | aserción | — |
| X-b | P2, P6 | P2, P6 | aserción | — |
| X-c | P4 ×5, P5 | las 5 filas de R7 (P4), E1.3 `it` 1 (P5) | aserción | — |
| X-d | P2, P6 | P2, P6 | consulta | `it` de R3 en verde |
| X-e | P4 ×5, P5 | P4 ×5, P5 | consulta | `it` de R3 en verde |
| X-f | P4 ×5, P5 | P4 ×5, P5 | consulta | R4 `it` 1 en verde |
| M3-f | P2, P6 | P2, P6, en la línea del recuento de `push` | aserción | `it` de R3 en verde |
| M4-g | fila `validation`, cambio 2 | solo esa fila, en el cambio 2 | aserción | las otras 4 filas en verde |
| M4-h | P2, cambio 2 ×5, P5 | P2, las 5 filas en el cambio 2, P5 | aserción | — |
| M5-h | P2, P6 | P2, P6 | aserción | `it` del tile en verde |
| M7-k | P2 y las esperas de E1.3 | P2, E1.3 `it` 1 (l.245 en HEAD), E1.3 `it` 2 (l.266) | aserción | — |

T20, contra `spike-full`:

| Sonda | Esperado (tasks.md) | Medido | Modo |
|---|---|---|---|
| X-g | P10, P11 ×4 | P10, P11 ×4, en el cuerpo | aserción |
| X-h | P10, P11 ×4 | P10, P11 ×4, en `forgot-submit` nulo | aserción |
| X-i | P8, P12 | P8, P12 | aserción |
| M5-i | 9 `it` | P3, P7, P8, P10, P11 ×4, P12, en el `Label` nulo | aserción |
| M7-j | P10, P11 ×4 | P10, P11 ×4, en `selectable` | aserción |
| X-d | lo de T19 más P8, P12 | ídem | consulta |
| X-e | lo de T19 más P10, P11 | ídem | consulta |
| M3-f | lo de T19 más P8, P12 | ídem | aserción |
| M5-h | lo de T19 más P8, P12 | ídem | aserción |
| M7-k | lo de T19 más P8 | ídem | aserción |
| X-a, X-b, X-c, X-f, M4-g, M4-h | igual que en T19 | igual que en T19 | igual |

Divergencias: ninguna. Todas las sondas de tasks.md caen donde dicen, por la vía que dicen, y dejan en verde lo que exigen.

### 3. Barrido estado × flujo

Las líneas «l.N» son de `index.test.tsx` en HEAD 2f058cdd. «Y-n» son sondas propias del barrido, plantadas igual que las de §2. Su código exacto está en §Defectos.

| Cláusula y rama | Candado | Sonda que lo prueba | Estado |
|---|---|---|---|
| R4: `forgot-submit` deshabilitado con vacío en A1 | R4 `it` 2 (l.128), `#127 R1` (l.100) | M4-a (ronda 1) | ok |
| R4: `forgot-submit` deshabilitado con vacío en A3 | **ninguno** | Y-8: **verde** 29/29 | **D4** |
| E2.1: `forgot-submit` deshabilitado en A2 | l.163 | aserción directa sobre el nodo | ok |
| E2.1: `forgot-submit` habilitado en A3 | l.220 ×5, l.241 | aserción directa | ok |
| E2.1: `forgot-submit` deshabilitado en A4 | l.244 | aserción directa | ok |
| E2.1: `forgot-submit` habilitado en A3 alcanzado desde A4 | **ninguno**: ningún `it` llega a A3 desde A4 | Y-4: **verde** | **D5** |
| R7: copy del nuevo `kind` en A3 desde A4 | **ninguno** | Y-11: **verde** | **D5** |
| E2.1: sin `forgot-resend` en A1 | R4 `it` 3 (l.141) | — | ok |
| E2.1: sin `forgot-resend` en A2 | solo el helper (P2) | M4-f cae en P2 | ok, pero sin sonda en tasks.md: **D3a** |
| E2.1: sin `forgot-resend` en A3 | l.221 ×5, P4, P5 | Y-6 cae en l.221 ×5 y P5 | ok |
| E2.1: sin `forgot-resend` en A4 | l.246, P6 | M4-f cae en l.246 | ok |
| E2.2: `forgot-resend` habilitado en B1 sin error previo | l.180 | aserción directa | ok |
| E2.2: `forgot-resend` habilitado en B1 tras error | **ninguno**: P7 solo mira presencia | Y-4: **verde** 29/29 | **D2** |
| E2.2: `forgot-resend` deshabilitado en B2 | l.286 | aserción directa | ok |
| E2.2: `forgot-resend` habilitado en B3 | l.304, l.322, l.261 | aserción directa | ok |
| E2.2: `forgot-resend` deshabilitado en B4 | l.264 | aserción directa | ok |
| E2.2: `forgot-resend` habilitado en B5 | l.290, l.268 | aserción directa | ok |
| R6/E1.2: copy del nuevo `kind` en B3 desde B4 | **ninguno** | Y-10: **verde** | **D5** |
| E2.2: sin `forgot-email` en B1 y B3 | l.178, l.303, l.321 | — | ok |
| E2.2: sin `forgot-email` en B2 y B4 | solo el helper (P8, P12) | Y-1 cae en P8 y P12 | ok, pero tasks.md lo da por cubierto por esperas existentes: **D3b** |
| E2.3: texto de `link-login` en los 9 flujos | solo los helpers | Y-2 cae en P2, P6, P8, P12 | ok, sin sonda en tasks.md: **D3c** |
| E2.3: `link-login` navega sin POST nuevo | R3 `it` 2 y 3, helper en P1-P13 | M3-f (push); Y-3 (recuento) cae en P4 ×5, P5, P10, P11 ×4 | ok, el recuento sin sonda en tasks.md: **D3d** |
| R5: correo citado tras reenvío | cuerpo en P9, P13, l.271; argumento del POST en l.288, l.265 | X-g | ok |
| R5: correo enviado tras error, recortado | P7 (cuerpo) | Y-9 (`send(error ? email : email.trim())`) cae en P7 | ok |
| R7: `selectable` en A3 | l.217 ×5, P4, P5 | aserción directa sobre la prop en las 5 filas | ok |
| E2.2: `selectable` en B3 | P10, P11 ×4 | M7-j | ok |

Respuestas a los puntos señalados por el leader:

- **`forgot-submit` por flujo A.** Candado en A1, A2, A3 y A4. Faltan A3 con el campo vaciado (D4) y A3 alcanzado desde A4 (D5).
- **`forgot-resend` deshabilitado en B2 y B4.** Candado en l.286 y l.264. El hueco está en el habilitado de B1 tras error (D2).
- **Correo enviado tras un reenvío.** El cuerpo está candado en P9, P13 y l.271, y el argumento del POST en l.288 y l.265. No se prueba un reenvío desde B5 (tercer POST). Riesgo bajo: el cuerpo de P13 ya ata `submittedEmail` y el reenvío lee esa misma variable.
- **`selectable`.** A3 está candado por l.217 y P4/P5, B3 por P10/P11. A3 se apoya en la aserción directa de las 5 filas (l.217); B3 tiene sonda en E2 (M7-j).
- **`link-login` desde todos los flujos.** Los 9 flujos pasan por P1-P13. La navegación tiene sonda (M3-f). El texto y el recuento no la tienen en tasks.md (D3c, D3d), aunque Y-2 e Y-3 prueban que esas líneas no son ciegas.
- **`expectLinkLoginNavigates` a mitad de `it` (P2, P5, P6, P8, P12).** No altera lo que el resto del `it` asevera:
  - `onPress` solo llama a `router.push`, un `jest.fn` que el helper limpia antes;
  - ninguno de esos `it` asevera sobre `mockRouter` después del punto;
  - las aserciones de recuento del mock de red (l.287, l.265) van antes del punto;
  - la promesa pendiente sigue sin resolver, así que el `act` del `press` no vacía nada;
  - el spike pasa 29/29.

  Solo un `onPress` que mutase estado arrastraría algo, y eso es justo lo que Y-3 detecta.

### 4. Cifras de E2

| Cifra | Declarada en E2 | Comprobación | Resultado |
|---|---|---|---|
| `forgot/index.test.tsx` | 29 → 29 | `spike-full` 29/29 | coincide |
| Suite de `auth` | 44, intacta | E2 no la toca | coincide |
| Las 8 suites del handoff | 285 → 285 | impl ronda 2 («Tests: 285 passed, 285 total») y la tabla de este review; E2 no añade `it` | coincide (no recorrida: veto del leader) |
| Global | 93 / 2049 → 93 / 2049 | `init-117-r2.log` de la ronda 2; +0 `it` | coincide (no recorrida: veto del leader) |
| Lista cerrada | 3 ficheros (T21) | el spike solo toca `index.test.tsx` | coincide |
| Candados globales | no se mueven | consistency y legibility excluyen `*.test.tsx`; design-drift no casa nada en el spike (0 `-[`, 0 `signOut(`) | coincide |

Si se acepta la corrección de D5 (dos `it` nuevos), las cifras pasan a forgot 29 → 31, 8 suites 285 → 287 y global 93 / 2049 → 93 / 2051. La lista cerrada no cambia: es el mismo fichero.

### Defectos

**D1: las anclas de E2.5 no declaran su recuento.**
- P5, P6, P12 y `await submitForgot();` no son únicas en el fichero (2, 3, 7 y 9; ver la tabla de §1). La spec las desambigua con prosa («el primer…», el título del `it`), pero no da ningún `grep -cF` esperado, que es lo que paró a Codex en #118 y #117.
- Corrección: junto a cada ancla de E2.5, escribir «`grep -cF '<ancla>' mobile-pet-tracker/src/screens/forgot/index.test.tsx` → N; dentro del `it` → 1». Los valores: P2 1, P5 2, P6 3, P8 1, P12 7 (dentro del `it`: 2, se usa el primero), cambio 2 1, `await submitForgot();` 9. Quitar «el primer» de P5: dentro de su `it` solo hay uno.

**D2: E2.2 afirma «habilitado en B1» y es falso para B1 tras error.**
- En el `it` 'un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver', P7 solo comprueba que `forgot-resend` existe. Ninguna espera existente mira si está habilitado.
- Sonda Y-4 en `index.tsx`:
  `    } finally {\n      setSubmitting(false);` → `    } finally {\n      if (!error || sent) setSubmitting(false);`
  Es un cierre obsoleto: tras error → ok, `submitting` se queda en `true` y `forgot-resend` sigue deshabilitado. Contra `spike-full`: **29/29 en verde**.
- Corrección en E2.5: en ese `it`, justo antes de P7, añadir:
  `await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());`
- Ancla: la línea va tras `await act(async () => { resolveRequest({ kind: 'ok' }); });`, que da `grep -cF` 4 en el fichero y 1 dentro del `it`. Después vienen `findByText('Revisa tu correo')` y el segundo `queryByTestId('forgot-error')).toBeNull()` del `it`.
- Sonda nueva en la tabla de T20: Y-4, que cae en ese `it` en la línea nueva, por aserción (`not.toBeDisabled`). Medido en `spike-fix`.
- Corregir también el texto de E2.2: «habilitado en B1 (con y sin error previo), B3 y B5».

**D3: tasks.md afirma «una sonda por línea del helper» y «las líneas sin sonda propia están cubiertas de antemano por las esperas existentes». No es cierto para cuatro líneas.**
- a) `expectFormState` → `expect(screen.queryByTestId('forgot-resend')).toBeNull();`. En A2 (P2) es el único candado. Añadir a la tabla de T19 la sonda M4-f: en el bloque de `forgot-resend`, `{sent ? (` → `{sent || submitting ? (`. Esperado: cae en P2 y en la espera existente l.246, por aserción. Medido así.
- b) `expectSentState` → `expect(screen.queryByTestId('forgot-email')).toBeNull();`. Las esperas existentes solo cubren B1 (l.178) y B3 (l.303, l.321); en B2 y B4 el único candado es el helper. Añadir a la tabla de T20 la sonda Y-1: `{!sent ? (\n          <TextField className="w-full">` → `{!sent || submitting ? (` en el `TextField`, y el `Label` envuelto en `{!sent && (…)}` para aislar la línea. Esperado: cae en P8 y P12, por aserción. Medido así.
- c) La línea de texto de `link-login` en los dos helpers. Añadir a T19 y T20 la sonda Y-2: `{t('forgot.backToSignIn')}` → `{submitting ? t('forgot.resend') : t('forgot.backToSignIn')}`. Esperado: cae en P2 y P6 (T19), y en P8 y P12 (T20), por aserción (`toHaveTextContent`). Medido así.
- d) `expect(mockForgotPassword).toHaveBeenCalledTimes(requests)` en `expectLinkLoginNavigates`. Añadir a T20 la sonda Y-3: `onPress={() => router.push('/login')}` → `onPress={() => { if (error) void send(submittedEmail); router.push('/login'); }}`.
  - Esperado: cae en P4 ×5 y P5 por aserción en el recuento.
  - También en P10 y P11 ×4, por `TypeError` del mock sin valor. Son 11 `it`. Medido así.
- Reescribir la frase de tasks.md así:
  - `forgot-submit` presente: esperas existentes en A1-A4.
  - `forgot-resend` presente: esperas existentes salvo en B1 tras error, que cubre la línea nueva de D2.
  - `forgot-email` ausente: esperas existentes solo en B1 y B3; en B2 y B4, sonda Y-1.

**D4: R4 «WHILE `email.trim() === ''` … `forgot-submit` `isDisabled`» solo tiene candado en A1.**
- Es una cláusula universal sobre todo `sent === false`, pero ningún `it` vacía el campo en A3. E2.1 la enumera solo como «deshabilitado en A1 mientras el campo está vacío».
- Sonda Y-8: `isDisabled={email.trim() === '' || submitting}` → `isDisabled={(email.trim() === '' && !error) || submitting}`. Contra `spike-full`: **29/29 en verde**.
- Corrección en E2.5: en el `it.each` de R7, tras P4, añadir:
  ```
  await fireEvent.changeText(screen.getByTestId('forgot-email'), '   ');
  expect(screen.getByTestId('forgot-submit')).toBeDisabled();
  ```
  El ancla es P4 misma: `await expectFormState('  Ana@Example.com ', copy);` da `grep -cF` 1 en el spike.
- Sonda Y-8: esperado, cae en las 5 filas en la línea nueva, por aserción. Medido así en `spike-fix`.
- Corregir E2.1: «deshabilitado en A1 y A3 mientras el campo está vacío, y en A2 y A4».
- El hueco existe desde la ronda 1, pero E2.1 es la cláusula que dice enumerar el estado de `forgot-submit` por flujo.

**D5: R7 (WHEN en el estado (a) el resultado tiene un `kind` distinto de `ok`) y R6/E1.2 (reenvío distinto de `ok`) nunca se ejercitan tras un error previo.**
- Ningún `it` llega a A3 desde A4 ni a B3 desde B4. E2.1 y E2.2 definen A3 y B3 «tras un resultado distinto de `ok`», sin excluir el segundo.
- Sondas, todas en verde 29/29 contra `spike-full`:
  - Y-11: `          setError(t('forgot.tooManyAttempts'));` → `          if (!error) setError(t('forgot.tooManyAttempts'));`. El segundo fallo deja la pantalla sin `forgot-error`.
  - Y-10: lo mismo con `          setError(t('common.somethingWentWrong'));`.
  - Y-4 (de D2): tras error → error, `forgot-submit` se queda deshabilitado.
- Corrección: dos `it` nuevos.
  - Uno en `describe('#117 R7: …')`, antes de `it('un envío posterior que resuelve ok limpia forgot-error`:
    ```
    it('un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind', async () => {
      mockForgotPassword.mockResolvedValueOnce({ kind: 'error' }).mockResolvedValueOnce({ kind: 'rate-limited' });
      await renderRoute();
      await submitForgot();
      expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Algo salió mal');
      await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
      await fireEvent.press(screen.getByTestId('forgot-submit'));
      await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('Demasiados intentos. Inténtalo más tarde.'));
      await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
      await expectFormState('ana@example.com', 'Demasiados intentos. Inténtalo más tarde.');
    });
    ```
  - Otro en `describe('#117 R6: …')`, tras su `it.each`, antes de `describe('#117 R8: forgot se aparta del teclado en Android'` (`grep -cF` 1):
    ```
    it('un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind', async () => {
      mockForgotPassword
        .mockResolvedValueOnce({ kind: 'ok' })
        .mockResolvedValueOnce({ kind: 'rate-limited' })
        .mockResolvedValueOnce({ kind: 'error' });
      await renderRoute();
      await submitForgot();
      expect(await screen.findByText('Revisa tu correo')).toBeVisible();
      await fireEvent.press(screen.getByTestId('forgot-resend'));
      expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Demasiados intentos. Inténtalo más tarde.');
      await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
      await fireEvent.press(screen.getByTestId('forgot-resend'));
      await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('Algo salió mal'));
      await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
      await expectSentState('ana@example.com', 'Algo salió mal');
    });
    ```
- Sondas nuevas y esperado, medido así en `spike-fix`. En el spike los dos `it` van en el `describe` de R7; el reparto por `describe` propuesto no cambia lo que asevera cada uno.
  - Y-11: cae en el `it` del formulario, por consulta (`forgot-error` ausente).
  - Y-10: cae en el `it` del reenvío, por consulta.
  - Y-4: cae en el `it` del formulario, por aserción (`not.toBeDisabled`).
- Corregir E2.1 (A3) y E2.2 (B3): «… distinto de `ok`, también cuando lo precede otro error (A4 → A3, B4 → B3)».
- Actualizar las cifras: forgot 29 → 31, 8 suites 285 → 287, global 93 / 2049 → 93 / 2051.
- Verificación conjunta de D2, D4 y D5 en `spike-fix` (sobre `spike-full`):
  - jest 31/31, exit 0;
  - `tsc --noEmit` exit 0 (con `router.d.ts` ausente);
  - `bun run lint` exit 0;
  - restaurado con `git checkout HEAD --`, diff 0 y cached 0.

### Observaciones (no bloquean)

- **E2.6.** Que las props de estilo y de teclado no se comprueben por flujo no es defecto. R8 y R9 ya las miran en los dos estados, y ninguna rama de estado las condiciona en `index.tsx`. No esconde riesgo real.
- **Reenvío desde B5 (tercer POST).** No se prueba. El cuerpo de P13 ata `submittedEmail` y el reenvío lee esa misma variable. Riesgo bajo.
- **Nombres de sonda.** Y-1 a Y-4, Y-6 y Y-8 a Y-11 son nombres del barrido. Al pasarlas a tasks.md conviene renombrarlas en la serie M/X de la spec.

Ficheros del barrido (scratchpad, fuera del repo): `e2/build.py`, `e2/build_fix.py`, `e2/probe.py`, `e2/probes.py`, `e2/spike-{t19,full,fix}.test.tsx` y `e2/out-*.json`.

### Remedición tras integrar D1-D5

Fecha: 2026-10-05. Medido contra el texto de la spec y de tasks.md en HEAD 6f7298a6.

**Método.** Los dos estados intermedios se construyen con `e2/build2.py <t19|t20>` (scratchpad). El script extrae de `git show 6f7298a6:specs/mobile-forgot-password/requirements.md` los helpers, las líneas P, P4b, P7a, los 3 cambios y el código literal de E2.7a y E2.7b, y los coloca donde dice la spec.

- El spike se copia como `src/screens/forgot/e2spike.test.tsx` (sin seguimiento) solo durante cada corrida.
- Se ejecuta únicamente con `bunx jest --runTestsByPath`.
- Después se borra y se restaura `index.tsx` con `git checkout HEAD --`.
- Cada corrida comprueba revert, diff y cached, y en todas dieron 0/0/0.
- No se corrió `init.sh` ni la suite global.

#### Bases

| Estado | jest | tsc --noEmit | lint |
|---|---|---|---|
| T19 (helpers sin `expectSentState`; P1, P2, P4, P4b, P5, P6; 3 cambios; E2.7a en R7) | 30/30, exit 0 | 0 | 0, sin avisos |
| T20 (todo, con E2.7b como último `it` de R6) | 31/31, exit 0 | 0 | 0, sin avisos |

Notas sobre la medición:

- tsc y lint se midieron superponiendo el spike sobre `index.test.tsx`, que después se restauró con `git checkout HEAD --` (diff 0, cached 0).
- `router.d.ts` estuvo ausente durante toda la medición.

#### Sondas de T19 contra el estado T19 (17 de 17 coinciden)

| Sonda | Debe caer (tasks.md) | Medido | Modo medido | Debe seguir verde: medido |
|---|---|---|---|---|
| X-a | P2, P6 | P2, P6 | aserción | — |
| X-b | P2, P6 | P2, P6 | aserción | — |
| X-c | R7 ×5, P5, E2.7a | R7 ×5, P5, E2.7a | aserción | — |
| X-d | P2, P6 | P2, P6 | consulta | los dos `it` de R3 verdes |
| X-e | R7 ×5, P5, E2.7a | R7 ×5, P5, E2.7a | consulta | los dos `it` de R3 verdes |
| X-f | R7 ×5, P5, E2.7a | R7 ×5, P5, E2.7a | consulta | R4 `it` 1 verde |
| M3-f | P2, P6 | P2, P6 | aserción | los dos `it` de R3 verdes |
| M3-g | P2, P6 | P2, P6 | aserción | los dos `it` de R3 verdes |
| M3-h | R7 ×5, P5, E2.7a | R7 ×5, P5, E2.7a | R7 ×5 y P5 por aserción en el recuento; E2.7a por excepción, `TypeError: Cannot read properties of undefined (reading 'kind')` | los dos `it` de R3 verdes |
| M4-f | P2, E1.3 `it` 1 | P2, E1.3 `it` 1 (en su `toBeNull` existente) | aserción | — |
| M4-g | la fila `validation` de R7 (cambio 2) | solo esa fila | aserción | las otras 4 filas verdes |
| M4-h | P2, R7 ×5 (cambio 2), P5 | P2, R7 ×5, P5 | aserción | E2.7a verde |
| M4-i | R7 ×5 (P4b) | R7 ×5 en P4b | aserción | R4 `it` 2 verde |
| M5-h | P2, P6 | P2, P6 | aserción | `it` de la tile verde |
| M7-k | P2, E1.3 `it` 1, E1.3 `it` 2 | P2, E1.3 `it` 1, E1.3 `it` 2 | aserción | E2.7a verde |
| M7-l | E2.7a | E2.7a (segundo `not.toBeDisabled`) | aserción | — |
| M7-m | E2.7a | E2.7a | consulta | fila `rate-limited` de R7 verde |

#### Sondas de T20 contra el estado T20 (15 de 15 coinciden)

| Sonda | Debe caer (tasks.md) | Medido | Modo medido |
|---|---|---|---|
| X-g | P10, P11 ×4, E2.7b | P10, P11 ×4, E2.7b | aserción |
| X-h | P10, P11 ×4, E2.7b | P10, P11 ×4, E2.7b | aserción |
| X-i | P12, P8 | P12, P8 | aserción |
| M5-i | P3, P7, P8, P10, P11 ×4, P12, E2.7b (10 `it`) | los mismos 10 | aserción |
| M5-j | P12, P8 | P12, P8 | aserción |
| M7-j | P10, P11 ×4, E2.7b | P10, P11 ×4, E2.7b | aserción |
| M6-j | E2.7b | E2.7b | consulta |
| M7-l | E2.7a, P7a | E2.7a, P7a | aserción |
| X-d | lo de T19, más P12 y P8 | 4 `it`: P2, P6, P12, P8 | consulta |
| X-e | lo de T19, más P10, P11 ×4 y E2.7b | 13 `it` | consulta |
| M3-f | lo de T19, más P12 y P8 | 4 `it` | aserción |
| M3-g | lo de T19, más P12 y P8 | 4 `it` | aserción |
| M3-h | lo de T19, más P10, P11 ×4 y E2.7b | 13 `it` | R7 ×5 y P5 por aserción; E2.7a, P10, P11 ×4 y E2.7b por excepción (`TypeError`) |
| M5-h | lo de T19, más P12 y P8 | 4 `it` | aserción |
| M7-k | lo de T19, más P8 | 4 `it` | aserción |

Las sondas de T19 que no figuran en la tabla de T20 son X-a, X-b, X-c, X-f, M4-f, M4-g, M4-h, M4-i y M7-m. En el estado T20 dan el mismo recuento que en T19, así que ninguna cae además en un `it` del estado enviado.

#### Divergencias

| Sonda o ancla | Esperado | Medido |
|---|---|---|

Sin divergencias. Las casillas que el leader había derivado sin medirlas se confirman todas:

- X-c, X-e, X-f y M3-h en E2.7a;
- X-g, X-h, M5-i, M7-j, X-e y M3-h en E2.7b;
- «debe seguir verde» de M4-h y M7-k (E2.7a) y de M7-m (fila `rate-limited`).

Para la casilla «anotar el modo medido» de M3-h:

- sin D6: E2.7a cae por excepción (`TypeError`), y en T20 también E2.7b;
- con el arreglo de D6, E2.7a y E2.7b pasan a caer por aserción en `expect(mockForgotPassword).toHaveBeenCalledTimes(requests);` de los helpers, porque la llamada de más consume el mock siguiente en vez de recibir `undefined`;
- P10 y P11 ×4 siguen cayendo por excepción.

#### Anclas

El bloque `grep -cF` de §E2.5 «Recuento de las anclas», ejecutado contra `index.test.tsx` en HEAD, da `1, 2, 3, 1, 7, 9, 1`, igual que lo declarado.

Las dos anclas de colocación de E2.7 dan 1 cada una:

- `it('un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»'`
- `describe('#117 R8: forgot se aparta del teclado en Android'`

También dan 1 los `describe` de R5, R6 y R7, el título del `it.each` `un %p al reenviar pinta «%s» en forgot-error` y `async function submitForgot(`.

#### Defecto nuevo D6: E2.7 solo candada en dos de sus cuatro líneas de copy

E2.7 dice **WHEN** «un envío desde el formulario o un reenvío resuelve con un `kind` distinto de `ok` y ya había un error en pantalla». Es universal sobre el `kind` nuevo. En `send()`, cada `kind` distinto de `ok` tiene su propia línea `setError(...)`, y son cuatro, porque `error` y `missing-config` comparten una. E2.7a solo recorre la de `tooManyAttempts`, y E2.7b solo la de `somethingWentWrong`.

Las otras dos líneas admiten la misma mutación que motivó E2.7 y pasan en verde en el estado T20 (31/31):

| Sonda | Cambio en `index.tsx` | Resultado en T20 |
|---|---|---|
| Z-val | `if (!error) setError(t('forgot.invalidEmail'));` en lugar de `setError(t('forgot.invalidEmail'));` | verde 31/31 |
| Z-unr | `if (!error) setError(t('common.cannotReachServer'));` en lugar de `setError(t('common.cannotReachServer'));` | verde 31/31 |

Es una rama real sin candado, porque cada `case` del `switch` es su propia rama. No reabre el límite de E2.6.

**Arreglo propuesto, ya medido.** Alargar los dos `it` de E2.7 con un paso más, sin añadir `it`. Así se respeta «No crear más `it` que los dos de E2.7», y las cifras no cambian: 30 tras T19, 31 tras T20, 287 en las 8 suites, 93 / 2051 en la global. El código literal queda así.

E2.7a:

```ts
  it('un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind', async () => {
    mockForgotPassword
      .mockResolvedValueOnce({ kind: 'error' })
      .mockResolvedValueOnce({ kind: 'rate-limited' })
      .mockResolvedValueOnce({ kind: 'validation', errors: [{ path: 'email', message: 'Invalid email' }] });
    await renderRoute();
    await submitForgot();
    expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Algo salió mal');
    await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
    await fireEvent.press(screen.getByTestId('forgot-submit'));
    await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('Demasiados intentos. Inténtalo más tarde.'));
    await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
    await expectFormState('ana@example.com', 'Demasiados intentos. Inténtalo más tarde.');
    await fireEvent.press(screen.getByTestId('forgot-submit'));
    await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('Ingresa un correo electrónico válido'));
    await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());
    await expectFormState('ana@example.com', 'Ingresa un correo electrónico válido');
  });
```

E2.7b:

```ts
  it('un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind', async () => {
    mockForgotPassword
      .mockResolvedValueOnce({ kind: 'ok' })
      .mockResolvedValueOnce({ kind: 'rate-limited' })
      .mockResolvedValueOnce({ kind: 'error' })
      .mockResolvedValueOnce({ kind: 'unreachable', message: 'network down' });
    await renderRoute();
    await submitForgot();
    expect(await screen.findByText('Revisa tu correo')).toBeVisible();
    await fireEvent.press(screen.getByTestId('forgot-resend'));
    expect(await screen.findByTestId('forgot-error')).toHaveTextContent('Demasiados intentos. Inténtalo más tarde.');
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    await fireEvent.press(screen.getByTestId('forgot-resend'));
    await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('Algo salió mal'));
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    await expectSentState('ana@example.com', 'Algo salió mal');
    await fireEvent.press(screen.getByTestId('forgot-resend'));
    await waitFor(() => expect(screen.getByTestId('forgot-error')).toHaveTextContent('No se pudo conectar con el servidor'));
    await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled());
    await expectSentState('ana@example.com', 'No se pudo conectar con el servidor');
  });
```

Con esto, cada una de las cuatro líneas `setError` de un `kind` distinto de `ok` queda recorrida al menos una vez con un error previo en pantalla. Cada pareja de copys consecutivos sigue siendo distinta, así que la frase de E2.7 sobre las esperas se mantiene si se dice «cada copy es distinto del anterior».

Medición del arreglo, en `spike-t19fix` y `spike-t20fix`, que son T19 y T20 con E2.7a y E2.7b sustituidos por el código de arriba:

- Bases: 30/30 y 31/31, exit 0; tsc 0 y lint 0 en los dos.
- Restauración en las dos: diff 0, cached 0.
- Z-val cae solo en E2.7a, por consulta (`forgot-error` ausente en la espera de «Ingresa un correo electrónico válido»), en T19 y en T20.
- Z-unr cae solo en E2.7b, por consulta, en T20. En T19 sigue verde, porque E2.7b aún no existe.
- Las 17 sondas de T19 y las 15 de T20, más las adicionales, dan los mismos `it` caídos que sin el arreglo. El único cambio es el modo de M3-h en E2.7a y E2.7b, descrito arriba.

Filas que habría que añadir a tasks.md, con nombres propuestos en la serie de la spec:

| Sonda | Cambio | Tabla | Debe caer | Modo |
|---|---|---|---|---|
| M7-n (Z-val) | `if (!error) setError(t('forgot.invalidEmail'));` en lugar de `setError(t('forgot.invalidEmail'));` | T19 (y sigue igual en T20) | E2.7a | consulta |
| M6-k (Z-unr) | `if (!error) setError(t('common.cannotReachServer'));` en lugar de `setError(t('common.cannotReachServer'));` | T20 | E2.7b | consulta |

Además, la casilla de M3-h en E2.7a y E2.7b pasaría a «aserción en el recuento de `mockForgotPassword`».

#### Informativas (no bloquean)

- **Z-res.** El cambio es `if (!error || !sent) setSubmitting(false);` en el `finally` de `send`. Cae en E1.3 `it` 2 y en E2.7b, por aserción. La rehabilitación de `forgot-resend` tras un segundo error ya tiene candado, aunque tasks.md no lista una sonda para ella. Si se quiere, puede añadirse como M7-o a la tabla de T20.
- **Guarda cruzada con `sent` por `kind`.** Una guarda como `if (!(error && sent)) setError(t('forgot.invalidEmail'));` seguiría verde tras el arreglo, porque cada línea `setError` queda recorrida en un solo flujo. En `index.tsx`, el `switch` de `send` no lee `sent`, así que esa rama no existe en producción. Su exclusión entra en el mismo razonamiento que E2.6, y no pido cambio.

Ficheros de esta remedición (scratchpad, fuera del repo): `e2/build2.py`, `e2/spike-{t19,t20,t19fix,t20fix}.test.tsx`, `e2/out-i_*.json` y `e2/{tsc,lint}-i-*.log`.

Veredicto del barrido: REQUIERE CAMBIOS

## Ronda 3
Fecha: 2026-10-05. HEAD `c9d67ddd`. H0 `68ad1bb2`. Rango revisado: `68ad1bb2..c9d67ddd` (3 commits de Codex).
Veredicto: APROBADO

En una frase: Codex aplicó la enmienda E2 al pie de la letra (helpers, P1-P13 con P4b y P7a, y los dos `it` de E2.7 idénticos a la spec, sin tocar producción), las 27 sondas de `tasks.md` §Enmienda E2 caen exactamente donde dicen al replantarlas yo una a una, y el barrido de cierre no deja ninguna cláusula de R3-R7, E1 o E2 sin candado medido.

### Alcance
- Commits del rango:
  - `c783b41e` test(mobile): lock the form render in every unsent flow (#117 R4, R7, R3, E2)
  - `a7d0fcae` test(mobile): lock the sent-state render in every flow (#117 R5, R6, R3, E2)
  - `c9d67ddd` docs(mobile): trace #117 amendment E2 to its tests and commits
- `git diff --name-only 68ad1bb2 c9d67ddd` toca exactamente los 3 ficheros de la lista cerrada:
  - `mobile-pet-tracker/src/screens/forgot/index.test.tsx`: +114 / −3
  - `progress/impl_mobile-forgot-password.md`: +6940 / −0
  - `specs/mobile-forgot-password/traceability.md`: +15 / −5
- Producción (`src/screens/forgot/index.tsx`), `src/api/auth.ts` y `src/api/__tests__/auth.test.ts`: diff 0.
- Las 3 bajas del test son exactamente los 3 cambios de línea de E2.5: los dos `await submitForgot();` que pasan a la forma con aseveración y el `toBe('ana@example.com')` del valor del campo.
- `c783b41e` solo toca el test (+70 / −3); `a7d0fcae` solo toca el test (+44 / −0).

### Literalidad (E2.4, E2.5, E2.7)
- Bloque de helpers de E2.4 (`LOCK_TILE_CLASS`, `lockTile`, `expectForgotError`, `expectLinkLoginNavigates`, `expectFormState`, `expectSentState`): comparado como subcadena exacta contra el bloque de `requirements.md`, 1 aparición.
- P1-P13, P4b y P7a: cada uno en el `it` y en el sitio que fija la tabla de E2.5.
- Las 53 anclas `grep -cF` de base del handoff §Ronda 3 dan su cifra sobre H0 (53 / 53). Sobre HEAD cambian 5, y los 5 deltas son los de E2:
  - `not.toBeDisabled` de `forgot-submit` dentro de `waitFor`: 2 → 5.
  - `toBeNull` de `forgot-resend`: 3 → 4.
  - `toBeNull` de `forgot-error`: 7 → 8.
  - `props.value).toBe('ana@example.com')`: 1 → 0, por el cambio de línea de E2.5.
  - `vuelve a fallar pinta el copy del nuevo kind`: 0 → 2, que son E2.7a y E2.7b.
- E2.7a (`un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`) está en el `describe` de R7, antes de `un envío posterior…`. E2.7b (`un segundo reenvío que vuelve a fallar pinta el copy del nuevo kind`) es el último `it` del `describe` de R6, antes de R8. Los dos bloques coinciden literalmente con `requirements.md`.
- El diff de títulos de `it` contra H0 solo añade esos dos. No hay renombrados, reordenados ni `describe` nuevos. El `it` del tile de E1.7 es idéntico a H0.
- §Esperas: todas las esperas nuevas miran el árbol. Hay 0 esperas nuevas sobre `mockForgotPassword.mock.calls` o su recuento.

## Checklist C2 — Estado coherente (ronda 3)
- [x] Solo 1 feature in_progress: `grep -c '"status": "in_progress"' feature_list.json` da 1, y es #117.
- [x] `progress/current.md` recoge la firma de E2 (`ca95f2f0`) y el handoff de la ronda 3 (H0 `68ad1bb2`).

## Checklist C3 — Arquitectura (ronda 3)
- [x] No aplica cambio: la producción es la misma que aprobó C3 en la ronda 1, porque el diff de producción es 0.

## Checklist C4 — TDD (ronda 3)
- [x] Los dos `it` nuevos viven en `describe` que nombran su R-id (`#117 R7` y `#117 R6`). Los puntos P1-P13 entran en `it` existentes de `#117 R4`, `#117 R5`, `#117 R6` y `#117 R7`.
- [x] Ronda solo de tests sobre código verde: no hay historial rojo→verde que exigir. El rojo lo sustituyen las sondas de `tasks.md` §Enmienda E2, replantadas por mí (tabla abajo). Un commit por tarea (T19, T20, T21), con la etiqueta `E2`.

## Checklist C5 — Trazabilidad (ronda 3)
- [x] `traceability.md` no tiene filas "pendiente" (`grep -c pendiente` = 0).
- [x] Las filas R3-R7 tienen sus entradas `E2:` con `c783b41e` (T19) y `a7d0fcae` (T20). Los dos pasan `git merge-base --is-ancestor <h> HEAD` = 0.
- [x] E2.7a figura en la fila R7 y E2.7b en la fila R6.
- [x] Las 5 líneas retiradas son las filas R3-R7 de las rondas 1 y 2, que vuelven con sus celdas intactas más la entrada E2. Se añade la sección `## Enmienda E2 — ronda 3`.
- [x] Los 25 hashes distintos que cita `traceability.md` dan `git cat-file -t` = `commit` y son ancestros de HEAD.
- [x] Formato de los commits: `test(mobile): <desc> (#117 Rn…, E2)` y `docs(mobile): …`.

## Checklist C6 — Spec aprobada (ronda 3)
- [x] `requirements.md` está en `status: approved`.
- [x] La casilla de §Enmienda E2 está marcada. Commit de firma `ca95f2f0`, aprobación vía Notion, ancestro de HEAD.

## Checklist C7 — Sin código huérfano (ronda 3)
- [x] N/A en esta ronda. No reemplaza nada, y la retirada del stub de la ronda 1 sigue intacta.

## Checklist C8 — UI móvil (ronda 3)
- [x] Sin cambio de UI.
- [x] Hay 0 `-[` en las líneas añadidas bajo `mobile-pet-tracker/`, y `git diff --check 68ad1bb2 c9d67ddd` sale vacío (exit 0).
- [x] Antes del typecheck, `test ! -e mobile-pet-tracker/.expo/types/router.d.ts` = 0. No lo borré.
- [x] `bun run typecheck` (`tsc --noEmit`): exit 0. `bun run lint` (`expo lint`): exit 0.
- [ ] Smoke S1-S9 en dev build de Android: sigue pendiente del humano. Este veredicto ni lo marca ni lo bloquea.

### Corridas independientes (todas desde `mobile-pet-tracker/`, sin pipe, árbol sin mutar)
- Suite de forgot, base antes de las sondas: exit 0, 1 suite, 31 / 31.
- Las 8 suites del handoff (comando literal de §Ronda 3): exit 0, 8 suites, 287 / 287.
- Global, la última, tras `pgrep -f '[i]nit.sh'` = exit 1 (nadie corría init.sh) y con `git diff --quiet -- src` = 0: `bunx jest --maxWorkers=2`, exit 0, `Test Suites: 93 passed, 93 total`, `Tests: 2051 passed, 2051 total` (15:49:45Z a 15:50:47Z).
- Ninguna corrida sobre el árbol sin mutar salió roja, así que no hizo falta repetir ninguna.

### Sondas de mutación de E2 (replantadas por mí)
Una cada vez sobre `src/screens/forgot/index.tsx`, con la suite de forgot como dice el handoff. Tras cada una: `git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx`, y luego `git diff --quiet -- <ruta>` = 0 y `git diff --cached --quiet` = 0. Las 27 dieron exit 1 y revert 0/0. Cada sonda repetida en T19 y T20 se corrió una vez y se comparó con la suma de las dos filas. Las líneas son de `index.test.tsx` en `c9d67ddd`.

| Sonda | Mutación (`tasks.md` §Enmienda E2) | Cae | Línea | Modo | Debe seguir verde |
|---|---|---|---|---|---|
| X-a | `sent \|\| submitting` en `forgot-title` | R5 `it` 1 (P2), E1.3 `it` 1 (P6): 2 | `:222`, `:327` | aserción | — |
| X-b | `sent \|\| submitting` en `forgot-body` | P2, P6: 2 | `:222`, `:327` | aserción | — |
| X-c | `error ?? instrucciones` en `forgot-body` | R7 ×5 (P4), E2.7a, P5: 7 | `:279`, `:296`, `:321` | aserción | — |
| X-d | `link-login` en `{!submitting && …}` | P2, P6, P12, P8: 4 | `:222`, `:327`, `:350`, `:374` | consulta | los dos `it` de R3: verdes |
| X-e | `link-login` en `{!error && …}` | R7 ×5, E2.7a, P5, R6 429 (P10), R6 ×4 (P11), E2.7b: 13 | `:279`, `:296`, `:321`, `:392`, `:411`, `:429` | consulta | los dos `it` de R3: verdes |
| X-f | `Label` en `{!error && …}` | R7 ×5, E2.7a, P5: 7 | `:279`, `:296`, `:321` | consulta | R4 `it` 1: verde |
| M3-f | `if (!submitting) router.push` | P2, P6, P8, P12: 4 | `:180` | aserción | R3: verdes |
| M3-g | texto de `link-login` según `submitting` | P2, P6, P8, P12: 4 | helper | aserción | R3: verdes |
| M3-h | `if (error) void send(…)` antes del `push` | R7 ×5, E2.7a, P5, R6 429, R6 ×4, E2.7b: 13 | `:182` (en R6 429 y ×4, además `TypeError` por el mock agotado) | aserción | R3: verdes |
| M4-f | `{sent \|\| submitting ? (` en `forgot-resend` | P2, E1.3 `it` 1: 2 | `:222`, `:326` | aserción | — |
| M4-g | `setEmail(target)` antes de `forgot.invalidEmail` | solo la fila `validation` de R7 ×5: 1 | `:276` | aserción | las otras 4 filas: verdes |
| M4-h | `setEmail(target)` tras `setError(null)` | P2, R7 ×5, P5: 7 | `:222`, `:276`, `:321` | aserción | E2.7a: verde |
| M4-i | `(email.trim() === '' && !error) \|\| submitting` | R7 ×5 (P4b): 5 | `:281` | aserción | R4 `it` 2: verde |
| M5-h | tile en `{!submitting && …}` | P2, P6, P12, P8: 4 | helper | aserción | `el tile Lock sigue en pie…`: verde |
| M7-k | `{error \|\| submitting ? (` en `forgot-error` | R5 `it` 1, E1.3 `it` 1, E1.3 `it` 2, R6 `it` 1: 4 | `:325`, `:349` | aserción | E2.7a: verde |
| M7-l | `if (!error \|\| sent) setSubmitting(false)` | E2.7a, E1.3 `it` 1 (P7a): 2 | `:295`, `:331` | aserción | — |
| M7-m | `if (!error)` ante `forgot.tooManyAttempts` | E2.7a: 1 | `:294` | consulta | fila `rate-limited`: verde |
| M7-n | `if (!error)` ante `forgot.invalidEmail` | E2.7a: 1 | `:298` | consulta | fila `validation`: verde |
| X-g | `sent && !error` en `forgot-body` | R6 429, R6 ×4, E2.7b: 6 | `:392`, `:411`, `:429` | aserción | — |
| X-h | `{!sent \|\| error ? (` en `forgot-submit` | R6 429, R6 ×4, E2.7b: 6 | `:392`, `:411`, `:429` | aserción | — |
| X-i | `sent && !submitting` en `forgot-title` | P12, P8: 2 | `:350`, `:374` | aserción | — |
| M5-i | `TextField` siempre en pie y `Input` sin `testID` en enviado | P3, P7, P8, P10, P11 ×4, P12, E2.7b: 10 | `:239`, `:332`, … | aserción | — |
| M5-j | `TextField` en vuelo del reenvío y `Label` en `{!sent && …}` | P12, P8: 2 | `:350`, `:374` | aserción | — |
| M7-j | `selectable={!sent}` en `forgot-error` | R6 429, R6 ×4, E2.7b: 6 | `:392`, `:411`, `:429` | aserción | — |
| M6-j | `if (!error)` ante `common.somethingWentWrong` | E2.7b: 1 | `:427` | consulta | — |
| M6-k | `if (!error)` ante `common.cannotReachServer` | E2.7b: 1 | `:431` | consulta | — |
| M7-o | `if (!error \|\| !sent) setSubmitting(false)` | E1.3 `it` 2, E2.7b: 2 | `:352`, `:428` | aserción | — |

Resultado: 27 / 27 coinciden con su fila de `tasks.md` (o con la suma T19 + T20) y con el reporte de Codex. Ninguna divergencia.

### Barrido de cierre (R3-R7, E1 y E2)
Matriz de E2: cada elemento del render de R4 (título, instrucciones, `Label`, `forgot-email`, `forgot-submit`, `link-login`, tile) y de R5/R6 (cabecera, cuerpo con el correo, `forgot-resend`, `link-login`, tile, ausencia de `forgot-email` y `forgot-submit`) en cada flujo A1-A4 y B1-B5. Además de las 27 sondas de la tabla, planté 11 sondas propias en las celdas que la tabla no ataca de forma directa. Todas cayeron, todas con revert 0/0:

| Sonda | Mutación | Celda | Cae | Modo |
|---|---|---|---|---|
| Y1 | `sent \|\| error` en `forgot-title` | A3 título | R7 ×5, E2.7a, P5: 7 | aserción |
| Y2 | `Label` en `{!submitting && …}` | A2/A4 `Label` | P2, P6: 2 | consulta |
| Y3 | texto de `link-login` según `error` | A3/B3 `link-login` | R7 ×5, E2.7a, P5, R6 429, R6 ×4, E2.7b: 13 | aserción |
| Y4 | tile en `{!error && …}` | A3/B3 tile | los mismos 13 | aserción |
| Y5 | `sent && !submitting` en `forgot-body` | B2/B4 cuerpo | P12, P8: 2 | aserción |
| Y6 | `{!sent \|\| submitting ? (` en `forgot-submit` | B2/B4 `forgot-submit` | P12, P8: 2 | aserción |
| Y7 | `push` solo si `!error \|\| sent` | A3 navegación | R7 ×5, E2.7a, P5: 7 | aserción |
| Y8 | `push` solo si `!error \|\| !sent` | B3 navegación | R6 429, R6 ×4, E2.7b: 6 | aserción |
| Y9 | `if (sent) setError(…)` en `case 'ok'` | B5 error tras reenvío ok | P9 (`:378`), E1.3 `it` 2 (`:353`): 2 | aserción |
| Y10 | `setSubmittedEmail(sent ? target.toUpperCase() : target)` | B5 cuerpo | P9 (`:378`), P13 (`:355`): 2 | aserción |
| Y11 | `setSubmitting(sent)` en el `finally` | B2-B5 `forgot-resend` | P12, P8, R6 429, R6 ×4, E2.7b: 8 | aserción |

Cláusulas estáticas sin cambio de producción en esta ronda:
- R3 `grep -c "Platform" src/screens/forgot/index.tsx` = 0: sigue en 0.
- R5 «ningún temporizador ni TTL»: 0 `setTimeout` en producción.

Conclusión: ninguna cláusula de un R-id aprobado, de E1 ni de E2 queda sin candado medido.

## Observaciones (ronda 3)

### Defectos
Ninguno.

### Informativas (no bloquean)
1. La guarda cruzada con `sent` y las props de estilo por flujo siguen fuera de la letra, porque E2.6 las excluye de forma expresa. Las mutaciones que solo tienen sentido con una rama que la producción no tiene (por ejemplo, una cuenta de reenvíos para separar B5 de B1) no tienen candado propio. Hoy B5 y B1 comparten estado en producción, y Y9/Y10 muestran que P9 y P13 cazan cualquier diferencia de render que se pueda plantar sin estado nuevo.
2. M3-h en R6 429 y R6 ×4 cae por dos vías: la aserción del recuento en `:182` y un `TypeError` por el mock agotado (`reading 'kind'`). Está documentado en el reporte de Codex. El modo esperado (aserción en el recuento) se cumple.
3. El reporte de Codex de la ronda 3 suma 6940 líneas, casi todo registros por sonda. No es un defecto, pero sí un coste de lectura que conviene tener en cuenta en futuras rondas.

### Sobre el trabajo de Codex en esta ronda
Sin divergencias («Divergencias: Ninguna» en el reporte, y lo confirmo). Las cifras de su reporte (forgot 31, 8 suites 287, global 93 / 2051, typecheck y lint en 0) coinciden con las mías.

### Estado del árbol al terminar
- Todas las sondas están revertidas. `git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx` = 0 y `git diff --cached --quiet` = 0.
- Antes del commit, el único cambio es este fichero de review.

## Output de ./init.sh (ronda 3)
No lo ejecuté: el clasificador lo deniega a subagentes y la otra sesión comparte LocalStack/Postgres. Lo corrió el leader sobre `c9d67ddd`. Leí la evidencia en el scratchpad:
- `init-r3.start`: `2026-10-05T15:31:31Z`, HEAD `c9d67ddd`.
- `init-r3.exit`: `exit=0`, fin `2026-10-05T15:38:21Z`, HEAD `c9d67ddd`. HEAD sigue en `c9d67ddd` al cerrar esta revisión.
- `init-r3.log`:
```
backend:  Test Suites: 176 passed   Tests: 1348 passed
infra:    Test Suites: 2 passed     Tests: 14 passed
mobile:   Test Suites: 93 passed, 93 total
          Tests:       2051 passed, 2051 total
e2e:      Test Suites: 3 skipped, 29 passed, 29 of 32 total
          Tests:       8 skipped, 438 passed, 446 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
