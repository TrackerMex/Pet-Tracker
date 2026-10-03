/home/claude/sites/Pet-Tracker-wt-backend
feature/100-mobile-alert-detail-screen

## Inicio y base

- Skills cargadas: `building-native-ui`, `native-data-fetching` (Expo; caché local `openai-curated/expo/11c74d6b`, versión declarada 1.0.1/1.0.0), `appllama-app-design-skill` y `ponytail` (full).
- HEAD inicial: `7f62681251123c936653be2dcf997a7ddb97aac4`.
- Blobs: `_layout.tsx` `84059b575560b99c400dbc5363cb9aed3b5f262f`; `screens/alerts/index.tsx` `7b89deb42bf50527639177b848fdf1178876e2d8`; `i18n/catalog.ts` `b675534de09d6bd5a19bbd2b17156d925230b5a3`.
- `.expo/types/router.d.ts` ausente (`exit=0`). Base: `bunx jest --silent > /tmp/base100.txt 2>&1` `exit=0`: 83 suites, 1550 tests, 1 snapshot; `bunx tsc --noEmit > /tmp/tsc100.txt 2>&1` `exit=0`, 0 bytes; `bunx expo lint > /tmp/lint100.txt 2>&1` `exit=0`, 0 bytes.

## Commits completados

| Paso | Rojo | Verde |
|---|---|---|
| A15–A17 | — | `fc55c55c` `docs(specs): apply amendments A15-A17 of #100` |
| R1 | `ae9f4087` | `bf26a10a` |
| R2 | `4d0100db` | `b1559720` |
| R3 | `12f07895` | `94caf5e8` |
| R4 | `f1981f74` | `a9cd5edb` |

Los asuntos de R1–R4 son los literales de `tasks.md`; los hashes de la tabla son los commits finales. El rojo R4 se enmendó antes del verde para corregir dos aserciones del test: HeroUI añade `skeleton__root` a la clase, y el estado `unauthorized` debe esperarse hasta que la consulta termine. El rojo corregido siguió dando exactamente 6 fallos y 10 verdes.

## Mediciones por paso

- A15–A17: los cuatro `grep -c` dieron `1`; `bunx jest --runTestsByPath 'src/__tests__/hero-header-amendments.test.ts' > /tmp/a15.log 2>&1` dio `exit=0`, 1 suite, 3 tests.
- R1 rojo: `bunx jest --runTestsByPath 'src/providers/__tests__/language-provider.test.tsx' > /tmp/r1.log 2>&1` dio `exit=1`, 1 suite, 2 fallos de 10: `#65 R12` Expected length `309`, Received length `306`; `#100 R1` Expected `"Alert"`, Received `undefined`. Verde: mismo comando en `/tmp/r1g.log`, `exit=0`, 1 suite, 10 tests; `bunx jest --runTestsByPath 'src/__tests__/ui-language.test.ts' > /tmp/r1b.log 2>&1`, `exit=0`, 1 suite, 25 tests.
- R2 rojo: `bunx jest --runTestsByPath 'src/app/__tests__/detail-stack.test.tsx' 'src/app/__tests__/layout.test.tsx' > /tmp/r2.log 2>&1` dio `exit=1`, 2 suites, 4 fallos de 35: ruta Expected `true`, Received `false`; guardia heredada y guardia nueva Expected length `9`, Received length `8`; cabecera Expected objeto con `title: 't:alerts.detailTitle'`, Received `undefined`. Verde: mismo comando en `/tmp/r2g.log`, `exit=0`, 2 suites, 35 tests. `test ! -e .expo/types/router.d.ts` dio `exit=0`; `bunx tsc --noEmit > /tmp/tsc-r2.log 2>&1` dio `exit=0`, 0 bytes.
- M-P1: `bunx jest --runTestsByPath 'src/app/__tests__/detail-stack.navigation.test.tsx' 'src/app/__tests__/detail-stack.guard.test.tsx' 'src/app/__tests__/reminders-alerts-stack.navigation.test.tsx' > /tmp/m-p1.log 2>&1` dio `exit=0`, `Test Suites: 3 passed, 3 total`, `Tests: 3 passed, 3 total`. No hicieron falta stubs ni cambios en `design.md`.
- R3 rojo: `bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' > /tmp/r3.log 2>&1` dio `exit=1`, 1 suite, 9 fallos de 9: Expected los elementos `alert-detail-card`, `alert-detail-status`, `alert-detail-opened-at` y `screen-alert-detail`; Received ninguno porque el stub devolvía `null`. Verde: `bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' 'src/screens/alerts/index.test.tsx' 'src/__tests__/ui-language.test.ts' > /tmp/r3g.log 2>&1` dio `exit=0`, 3 suites, 67 tests.
- R4 rojo corregido: `bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' > /tmp/r4-corrected-red.log 2>&1` dio `exit=1`, 1 suite, 6 fallos y 10 verdes de 16. Expected esqueleto o error; Received ningún elemento con esos `testID` (5 fallos); salida Expected `"/alerts"`, Received ninguna llamada. `unauthorized` quedó verde, excepción prevista. Verde: mismo comando en `/tmp/r4g.log`, `exit=0`, 1 suite, 16 tests. El primer intento de verde había dado 2 fallos por las dos aserciones de prueba descritas arriba; se corrigieron en el rojo antes de versionar producción.

## Bloqueo en R5: parada obligatoria por rojo distinto

Con solo los tests de R5 y el mapa `screenSignOutCalls` modificados, `bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' 'src/__tests__/design-drift.test.ts' > /tmp/r5.log 2>&1` dio `exit=1`, 2 suites, **11 fallos y 69 verdes de 80**. Se esperaban **10 fallos**: los nueve nuevos de R5 por `alert-detail-ack` ausente y el heredado `preserves every mutation sign-out with zero delta` (Expected `screens/alert-detail/index.tsx: 1`, Received `0`). Esos diez sí fallaron, pero además falló `#100 R3: respeta las métricas A11 bajo cabecera nativa`: Expected `alert-detail-card`, Received una pantalla con `alert-detail-loading`, porque el test leyó la tarjeta antes de que terminara la consulta. El log también termina con `A worker process has failed to exit gracefully and has been force exited`.

Por la regla explícita «otro test, otra aserción, otro número de fallos → PARA», esa primera corrida de R5 no se commiteó ni corrigió en aquella sesión. La sección siguiente documenta la reanudación autorizada por el leader.

## Decisiones

- La skill Expo solicitada como v1.0.2 no estaba en la ruta de caché indicada por el catálogo; se cargó el paquete local disponible `openai-curated/expo/11c74d6b` (skills `building-native-ui` y `native-data-fetching`). La spec aprobada siguió mandando en clases, copy y navegación.
- El test de cabecera de R2 escribe `#95 R4` en su título para cumplir el guard que prohíbe una cita `#95` suelta en tests; el significado y las aserciones previstos son los mismos.

## Reanudación 1 y desviaciones

- Confirmación previa: `pwd` → `/home/claude/sites/Pet-Tracker-wt-backend`; `git branch --show-current` → `feature/100-mobile-alert-detail-screen`; HEAD `7e84c9e4`, cuyo padre era `a9cd5edb`. `git stash push -- mobile-pet-tracker` apartó solo R5; `git status --short -- mobile-pet-tracker` salió vacío. `git stash pop` aplicó sin conflicto.
- Corrección solo de test R3: `1ea6fa53` `test(alert-detail): wait for the card before reading the A11 metrics (R3)`. En el `it` de A11 se espera `alert-detail-card` antes de leer la raíz; las aserciones, literales y nombre permanecen iguales. `bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' > /tmp/r3fix.log 2>&1` → `exit=0`, 1 suite, 16 tests. La primera corrida `/tmp/r5.log` había dado 11 fallos: diez previstos y `#100 R3` Expected `alert-detail-card`, Received `alert-detail-loading`. Tras la corrección, `bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' 'src/__tests__/design-drift.test.ts' > /tmp/r5b.log 2>&1` → `exit=1`, 2 suites, exactamente 10 fallos y 70 verdes: nueve por `alert-detail-ack` ausente y uno del mapa `signOut` (Expected `1`, Received `0`).
- R5 rojo `b9803cc5`, verde `0ca6e4dc`. Verde: mismo comando en `/tmp/r5g.log` → `exit=0`, 2 suites, 80 tests. Los dos `git grep` de `queryKey: [` y `useFocusEffect` en `screens/alert-detail` no dieron coincidencias.
- R6 rojo `8f7a0134`, verde `f1149451`. Rojo: `bunx jest --runTestsByPath 'src/screens/alerts/index.test.tsx' > /tmp/r6.log 2>&1` → `exit=1`, 1 suite, siete fallos: tres nuevos por enlace ausente y cuatro ejecuciones heredadas por clase Expected `min-h-11 min-w-0 flex-1 gap-1`, Received `min-w-0 flex-1 gap-1` (el `it.each` de tipos ejecuta tres casos). Verde en `/tmp/r6g.log` → `exit=0`, 1 suite, 36 tests.

### Nueva parada obligatoria en el rojo de R7

Con los tests de R7 aún **sin commit**, `bunx jest --runTestsByPath 'src/hooks/use-push-registration.test.tsx' 'src/app/__tests__/alert-detail.notification.test.tsx' > /tmp/r7.log 2>&1` → `exit=1`, 2 suites, **11 fallos**, 41 verdes de 52. Se esperaban tres fallos: dos filas con `alertId` válido y el test de pila. El test de pila sí falló por su aserción: Expected `/alerts/alert-1`, Received `/alerts`. Las diez filas nuevas del hook, incluidas las ocho que debían quedar verdes, fallaron antes de sus aserciones con `expo-notifications unavailable in Expo Go`. El error procede del `jest.doMock` del test heredado R15 que antecede al nuevo bloque; no se ha modificado el test para acomodar el rojo porque la instrucción exige **PARAR** ante otro número o causa de fallos.

HEAD actual: `f1149451`. Quedan sin commit `src/hooks/use-push-registration.test.tsx`, el nuevo `src/app/__tests__/alert-detail.notification.test.tsx` y este reporte. R7 verde, R8–R10, mutaciones, trazabilidad, suite de cierre, TypeScript y lint finales no se ejecutaron. La prueba de humo sigue reservada al humano. No hubo push ni PR.

## Reanudación 2: R7 cerrado y parada en R8

- Confirmación: `pwd` → `/home/claude/sites/Pet-Tracker-wt-backend`; `git branch --show-current` → `feature/100-mobile-alert-detail-screen`; HEAD de entrada `c13707a6`, padre `f1149451`.
- R7: el bloque `describe` nuevo se movió intacto antes de `#99 R1`, porque R15 usa un `jest.doMock` persistente y debe quedar al final. El rojo corregido dio `exit=1`, 2 suites, exactamente 3 fallos por aserción: dos href Expected `{ pathname: '/alerts/[alertId]', params: { alertId: ... } }`, Received `'/alerts'`; pila Expected `/alerts/alert-1`, Received `/alerts`. Los otros ocho casos quedaron verdes. Rojo `848df9fe`. Verde `9664ca9b`: `/tmp/r7g.log` `exit=0`, 2 suites, 52 tests; `/tmp/r7c.log` `exit=0`, 1 suite, 1 test de `use-push-registration.navigation.test.tsx`.
- R8: el rojo versionado `4f848e56` plantó la mutación `found` solo en `pages[0]`; `/tmp/r8.log` dio `exit=1`, 2 suites, exactamente 1 fallo: Expected `/alerts/alert-2`, Received `/alerts`; los 25 tests de la pantalla quedaron verdes. Al revertir la mutación, `/tmp/r8g.log` dio `exit=1`: Expected `Leída`, Received `Sin leer` después del ack. No se creó el commit verde.
- Se probó una sincronización alternativa del test de integración con temporizadores reales y un `QueryClient` de duración corta: `/tmp/r8probe15.log` dio `exit=0`, 1 suite y 1 test. Antes de enmendar el rojo, se replantó la mutación y se repitieron los dos ficheros exigidos. `/tmp/r8red-recheck.log` dio `exit=1`, 2 suites, **1 fallo y 25 verdes**, pero el fallo fue **otra aserción**: `Unable to find an element with testID: alert-detail-ack` (esperado por `tasks.md`: ruta `/alerts/alert-2`, recibido `/alerts`). También informó `A worker process has failed to exit gracefully and has been force exited`. Por la regla explícita de parar ante otra aserción en un rojo, se restauró el test modificado sin enmendar ni crear más commits.
- HEAD de parada `4f848e56`. `git status --short` muestra solo este reporte sin seguimiento; producción y tests coinciden con el rojo versionado de R8. R8 verde, R9, R10, trazabilidad y cierre siguen pendientes. Sin push ni PR.

## Reanudación 3: nueva parada obligatoria antes del rojo adicional de R8

- `pwd` → `/home/claude/sites/Pet-Tracker-wt-backend`; `git branch --show-current` → `feature/100-mobile-alert-detail-screen`. HEAD de entrada `b4123e5c`, hijo del rojo `4f848e56`. La mutación de R8 sigue plantada.
- Se aplicó en `src/app/__tests__/alert-detail.navigation.test.tsx` la sincronización de temporizadores reales, ack resuelto dentro de `act` y un cliente creado con `createQueryClient` real y `gcTime=0`. No se cambiaron aserciones, literales, el único `it` ni producción. El diff del test contra `4f848e56` queda sin commit en el worktree para revisión.
- Primera medición con el doble parcial de `createQueryClient`: `/tmp/r8red3.log`, `exit=1`, 2 suites, 1 fallo R8 permitido (b) y 25 verdes; el log informó que un worker no salió limpiamente. Ese doble no acortó la vida del cliente usado por `QueryProvider`, que llama a su función local. Antes de commitear se cambió al wrapper de la variante `/tmp/r8probe15.log`, construido con `createQueryClient` real y solo `gcTime=0`.
- Medición exigida tras ese cambio: `bunx jest --runTestsByPath 'src/app/__tests__/alert-detail.navigation.test.tsx' 'src/screens/alert-detail/index.test.tsx' > /tmp/r8red3final.log 2>&1; echo "exit=$?"` → **`exit=1`, 2 suites fallidas, 2 fallos y 24 verdes de 26**. R8 falló por el caso (b) autorizado: `Unable to find an element with testID: alert-detail-ack`; el árbol muestra `alert-row-alert-1` y cabecera `title="Alertas"`. El fallo extra fue `#100 R4: ... unauthorized`: Expected `alert-detail-loading` null, Received `<View ... testID="alert-detail-loading" />`. Por la regla «cualquier otra cosa: PARA», no se repitió ni corrigió el test y no se creó el commit rojo adicional.
- HEAD de parada `b4123e5c`. Solo cambian sin commit el test de navegación R8 y este reporte sin seguimiento. R8 verde, R9, R10 y cierre no ejecutados. Sin push ni PR.

## Reanudación 4 y cierre definitivo

Las secciones de «parada» anteriores son historia de los gates; esta sección contiene el resultado final. El worktree confirmado fue `/home/claude/sites/Pet-Tracker-wt-backend`, la rama `feature/100-mobile-alert-detail-screen` y el HEAD de entrada `9a5f13d9` (hijo de `b4123e5c`).

### Corrección heredada de R4

`git stash push -- mobile-pet-tracker` apartó únicamente el test sin commit de R8; `git status --short -- mobile-pet-tracker` quedó vacío. En el `it` de `unauthorized` de R4 se movió solo `expect(screen.queryByTestId('alert-detail-loading')).toBeNull();` al final del `waitFor` existente. Las otras tres aserciones posteriores quedaron en su orden. Esto espera al render, además de esperar a que Query escriba `{ kind: 'unauthorized' }` en caché. Las tres corridas `bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' > /tmp/r4fixN.log 2>&1; echo "exit=$?"` (`N=1,2,3`) dieron `exit=0`, `Test Suites: 1 passed, 1 total`, `Tests: 25 passed, 25 total`. Commit solo de test: `93108204` `test(alert-detail): wait for the skeleton to leave before the unauthorized checks (R4)`. `git stash pop` aplicó sin conflicto.

### Desviaciones R8

Los temporizadores falsos de `renderRouter` dejaban la actualización del ack en una cola de `act`: la llamada devolvía `ok`, `setAcked` se ejecutaba, pero el detalle no volvía a pintarse. Probes: `/tmp/r8probe6.log` mantuvo `Sin leer` aun esperando la llamada; `/tmp/r8probe7.log` descartó freeze (`freezeEnabled() = false`) y confirmó la pila correcta; `/tmp/r8probe8.log` confirmó `ackAlert` resuelto con `ok` y la ruta `/alerts/alert-2`, sin render nuevo; `/tmp/r8probe9.log` mostró que quitar `await` de eventos agravaba los avisos de `act`; `/tmp/r8probe10.log` comprobó que cambiar a temporizadores reales después de navegar era tarde; `/tmp/r8probe11.log` mantuvo el fallo con promesa de ack controlada bajo temporizadores falsos; `/tmp/r8probe12.log` pasó al usar reales desde el montaje, pero Jest quedó abierto por el cliente de Query; `/tmp/r8probe13.log` descartó excluir `setImmediate` y `nextTick` de los temporizadores falsos; `/tmp/r8probe14.log` pasó, pero volver a falsos al final no cerró el handle; `/tmp/r8probe15.log` pasó y salió con `exit=0` al crear el cliente con `gcTime=0`.

El primer rojo de R8 (`4f848e56`, `/tmp/r8.log`) ya tenía 1 fallo y 25 verdes: Expected `/alerts/alert-2`, Received `/alerts`. Con la sincronización definitiva y la mutación aún plantada, `/tmp/r8red4.log` dio `exit=1`, `Test Suites: 1 failed, 1 passed, 2 total`, `Tests: 1 failed, 25 passed, 26 total`; falló la línea permitida (a), `getPathname()` Expected `/alerts/alert-2`, Received `/alerts`. Commit rojo adicional `67084429` `test(alert-detail): drive the round trip with real timers (R8, keeps mutation: found reads pages[0] only)`. El rojo anterior de `/tmp/r8red3final.log` fue el caso (b): `Unable to find an element with testID: alert-detail-ack`, con cabecera `Alertas` y `alert-row-alert-1`; allí el segundo fallo era la carrera heredada de R4, ya corregida.

Diff exacto de la sincronización versionada en `67084429` contra `4f848e56` (`git diff --unified=0 4f848e56 67084429 -- mobile-pet-tracker/src/app/__tests__/alert-detail.navigation.test.tsx`):

```diff
diff --git a/mobile-pet-tracker/src/app/__tests__/alert-detail.navigation.test.tsx b/mobile-pet-tracker/src/app/__tests__/alert-detail.navigation.test.tsx
index 423ec00a..cab0e3c4 100644
--- a/mobile-pet-tracker/src/app/__tests__/alert-detail.navigation.test.tsx
+++ b/mobile-pet-tracker/src/app/__tests__/alert-detail.navigation.test.tsx
@@ -9 +9 @@ import { Text } from 'react-native';
-import { ackAlert, listAlerts } from '../../api/alerts';
+import { ackAlert, listAlerts, type AckAlertState } from '../../api/alerts';
@@ -52,0 +53,7 @@ jest.mock('../../providers/auth-provider', () => ({
+jest.mock('../../providers/query-provider', () => {
+  const React = jest.requireActual<typeof import('react')>('react');
+  const { QueryClientProvider } = jest.requireActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
+  const { createQueryClient } = jest.requireActual<typeof import('../../providers/query-provider')>('../../providers/query-provider');
+  const client = createQueryClient(undefined, 0);
+  return { QueryProvider: ({ children }: { children: React.ReactNode }) => React.createElement(QueryClientProvider, { client }, children) };
+});
@@ -115,4 +122,2 @@ describe('#100 R8: fila, detalle y vuelta al centro con la alerta leída', () =>
-    jest.mocked(ackAlert).mockImplementation(async () => {
-      serverAcked = true;
-      return { kind: 'ok', alert: makeAlert('alert-2', 'acked') };
-    });
+    let resolveAck!: (result: AckAlertState) => void;
+    jest.mocked(ackAlert).mockReturnValue(new Promise((resolve) => { resolveAck = resolve; }));
@@ -120,0 +126 @@ describe('#100 R8: fila, detalle y vuelta al centro con la alerta leída', () =>
+    jest.useRealTimers();
@@ -129,0 +136,4 @@ describe('#100 R8: fila, detalle y vuelta al centro con la alerta leída', () =>
+    await act(async () => {
+      serverAcked = true;
+      resolveAck({ kind: 'ok', alert: makeAlert('alert-2', 'acked') });
+    });
```

El doble es de `QueryProvider`, no del export `createQueryClient`: el proveedor llama a la función local y sustituir solo el export no cambia el cliente que monta. Usa el `createQueryClient` real con `gcTime=0`. **Observación para el reviewer**: el doble pierde el `signOut` que el proveedor pasa al `QueryCache` y el `client.clear()` al pasar a `unauthenticated`; este test siempre está autenticado y no devuelve `unauthorized`, por lo que esas ramas no se ejercitan aquí. La spec no fijaba cómo sincronizar el ack bajo `renderRouter`.

Tras revertir la mutación, el comando de R8 corrió tres veces: `/tmp/r8g1.log`, `/tmp/r8g2.log`, `/tmp/r8g3.log`; cada una dio `exit=0`, 2 suites y 26 tests. En cada log quedan **5** avisos `The current testing environment is not configured to support act(...)`, ajenos a las aserciones. Verde `4429bdd9` `feat(alert-detail): search every cached page for the alert (R8)`. `git diff --exit-code 9664ca9b HEAD -- mobile-pet-tracker/src/screens/alert-detail/index.tsx` dio `exit=0` y salida vacía. El icono simulado de ese test necesitó un nombre de componente para lint: commit solo de test `9c07ed8e` `test(alert-detail): name the icon double for lint (R8)`; no cambió su comportamiento.

### R9 y R10

- R9 rojo `36cf98bf` `test(reminders-alerts-stack): flush timers before asserting the stack (R9, plants mutation M7)`: `/tmp/r9.log` `exit=1`, 2 suites, 2 fallos y 19 verdes de 21. En `#114 R3`, **la aserción de pila inmediatamente después del segundo toque** falló: Expected `['(tabs)', 'add-reminder', 'alerts']`, Received `['(tabs)', 'add-reminder', 'alerts', 'alerts']`; no llegó al `back` posterior. En `#114 R1`, Expected `dangerouslySingular: true`, Received `undefined`. Verde `3983e29e` `fix(reminders-alerts-stack): keep alerts singular (R9)`: `/tmp/r9g.log` `exit=0`, 2 suites, 21 tests; `git diff --exit-code 4429bdd9 HEAD -- mobile-pet-tracker/src/app/_layout.tsx` → `exit=0`, salida vacía.
- R10 rojo `5bdf0cd6` `test(alert-detail): the detail resolves its copy by key (R10, plants mutation: retry key through a constant)`: `/tmp/r10.log` `exit=1`, 1 suite, 2 fallos y 24 verdes de 26, en el `it` nuevo y el heredado de `#65 R18`; ambos Expected `common.retry` `uses: 1`, Received `uses: 0`. Verde `d7d43a01` `feat(alert-detail): resolve the retry label by literal key (R10)`: `/tmp/r10g.log` `exit=0`, 1 suite, 26 tests; `git diff --exit-code 3983e29e HEAD -- mobile-pet-tracker/src/screens/alert-detail/index.tsx` → `exit=0`, salida vacía.

### Comandos y resultados de cierre

- `bunx jest --silent > /tmp/close100.txt 2>&1; echo "exit=$?"` → `exit=0`; `Test Suites: 86 passed, 86 total`; `Tests: 1595 passed, 1595 total`; `Snapshots: 1 passed, 1 total`. Frente a la base medida de 83 suites, 1550 tests y 1 snapshot: **+3 suites, +45 tests, 0 regresiones**. El log contiene exactamente la advertencia: `A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.` Se registra conforme a Reanudación 1, sin perseguirla.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc100c.txt 2>&1; echo "exit=$?"` → `exit=0`; `/tmp/tsc100c.txt` 0 bytes. `bunx expo lint > /tmp/lint100c.txt 2>&1; echo "exit=$?"` → `exit=0`; `/tmp/lint100c.txt` 0 bytes. El primer lint previo al commit `9c07ed8e` había dado `exit=1`, `react/display-name` en el icono simulado; ese fue el motivo del commit extra.
- C8: `rg -n -i -P '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet\.create|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src --glob '!**/theme/**' --glob '!**/__tests__/**' --glob '!**/*.test.ts' --glob '!**/*.test.tsx'` → sin coincidencias (`rg_exit=1`). El primer barrido incluía un snapshot con SVG hex, fuera de producción; se excluyeron los artefactos de tests. `design-drift.test.ts` pasó en la suite completa. El detalle usa `Card`, `Skeleton`, `useSafeAreaInsets`, clases Uniwind y un botón de al menos 44 pt; el enlace de fila conserva feedback `pressed`.
- `git grep -n 'queryKey: \[' -- mobile-pet-tracker/src/screens/alert-detail` → salida vacía (`grep_exit=1`); `git grep -n 'useFocusEffect' -- mobile-pet-tracker/src/screens/alert-detail` → salida vacía (`grep_exit=1`). `git diff a9965ee3 -- backend-pet-tracker infra mobile-pet-tracker/package.json mobile-pet-tracker/app.json` → salida vacía (`diff_exit=0`). M-P1 ya había dado 3 suites verdes tras R2, sin modificar `routes()` ni `design.md`.

La tabla `specs/mobile-alert-detail-screen/traceability.md` recoge los pares rojo → verde de R1–R10, los dos rojos de R8, las correcciones de test de R3, R4 y R8, y `fc55c55c` para A15–A17. La prueba de humo sigue a cargo del humano: su casilla no se marcó. No se hizo push ni se abrió PR. Los commits del leader que añadieron secciones a `progress/handoff_mobile-alert-detail-screen.md` y actualizaron `progress/current.md` son anteriores a este cierre; esta implementación no editó esos archivos.

### Resumen verificable de cada rojo versionado

| R | Log, suites, fallos | Expected → Received |
|---|---|---|
| R1 | `/tmp/r1.log`: 1 suite, 2 fallos | Catálogo 309 → 306; clave `alerts.detailTitle` con `"Alert"` → `undefined`. |
| R2 | `/tmp/r2.log`: 2 suites, 4 fallos | Ruta en disco `true` → `false`; guarda con 9 hijos → 8; opciones de cabecera con `title: 't:alerts.detailTitle'` → `undefined`. |
| R3 | `/tmp/r3.log`: 1 suite, 9 fallos | `screen-alert-detail` y los nodos de tarjeta, estado y fecha presentes → ningún `testID` de pantalla, porque el stub devolvía `null`. |
| R4 | `/tmp/r4-corrected-red.log`: 1 suite, 6 fallos, 10 verdes | Cinco estados con esqueleto o error → elemento ausente; `router.dismissTo('/alerts')` → ninguna llamada. El caso `unauthorized` verde era la excepción declarada. |
| R5 | `/tmp/r5b.log`: 2 suites, 10 fallos, 70 verdes | Nueve casos con `alert-detail-ack` → elemento ausente; mapa de `signOut` para el detalle `1` → `0`. |
| R6 | `/tmp/r6.log`: 1 suite, 7 fallos | Tres casos con `alert-row-<id>-link` → elemento ausente; cuatro casos de clase `'min-h-11 min-w-0 flex-1 gap-1'` → `'min-w-0 flex-1 gap-1'`. |
| R7 | rojo corregido tras mover el bloque: 2 suites, 3 fallos, 49 verdes | Hot y cold con `alert-9`: href `{ pathname: '/alerts/[alertId]', params: { alertId: 'alert-9' } }` → `'/alerts'`; pila `/alerts/alert-1` → `/alerts`. Las ocho filas sin id quedaron verdes. |
| R8 | `/tmp/r8.log` y `/tmp/r8red4.log`: 2 suites, 1 fallo, 25 verdes cada uno | `getPathname()` `/alerts/alert-2` → `/alerts`. |
| R9 | `/tmp/r9.log`: 2 suites, 2 fallos, 19 verdes | Tras el segundo toque, pila `['(tabs)', 'add-reminder', 'alerts']` → la misma más otra `alerts`; prop singular `true` → `undefined`. |
| R10 | `/tmp/r10.log`: 1 suite, 2 fallos, 24 verdes | En ambos candados de copy, `common.retry` `uses: 1` → `uses: 0`. |

El log del rojo corregido de R7 se observó en la ejecución, pero su ruta `/tmp/r7b.log` se reutilizó después para la comprobación verde del stack heredado; esta tabla conserva el resultado observado. `/tmp/r7.log` mantiene el primer rojo no válido (11 fallos por el `doMock` persistente de R15), ya descrito arriba. El reviewer debe saber que R15 deja registrado ese `doMock` y por ello permanece como último `describe`; decidir una corrección de esa deuda queda fuera de este cierre.
