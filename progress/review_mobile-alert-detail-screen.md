# review: mobile-alert-detail-screen (#100)
Fecha: 2026-09-28T22:29Z
Veredicto: APROBADO, pendiente de humo

> Revisado sobre `HEAD` `b1dae7ce`, branch `feature/100-mobile-alert-detail-screen`
> (worktree `Pet-Tracker-wt-backend`). Implementó Codex CLI (`ae9f4087..b1dae7ce`).
> La prueba de humo en dev build de Android (pasos 1–8 y «Prueba de humo
> superada» de `requirements.md`) es del humano: sus casillas siguen sin marcar y
> este veredicto no las cierra. #100 no pasa a `done` hasta que el humano las marque.
>
> No se ejecutó `init.sh` (LocalStack y Postgres se comparten con otra sesión). Se
> juzgó el log del leader, `/tmp/init100.log` (`exit=0`, escrito a las 22:09 sobre
> este HEAD). En `mobile-pet-tracker/` se corrieron en primer plano `tsc`, `lint`
> y jest dirigido. Los commits rojos y las sondas de mutación **no** se corrieron
> en el árbol revisado. Se corrieron en copias `git archive` de cada commit en el
> scratchpad, con `node_modules` enlazado. El árbol revisado sigue limpio
> (`git status` vacío) y no se hizo ningún commit.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress. Hay 0 en `in_progress`. Por convención #100
      sigue `spec_ready` hasta `done`, como #124, #126 y #77.
- [x] `progress/current.md` describe la sesión activa de #100.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure. No se toca el backend:
      `git diff a9965ee3 HEAD -- backend-pet-tracker infra` está vacío.
- [x] repositories/contratos en domain son interfaces puras (sin cambios).
- [x] application depende de interfaces, no implementaciones (sin cambios).
- [x] infrastructure sin lógica de negocio (sin cambios).
- [x] Móvil:
  - `src/app/alerts/[alertId].tsx` es un route delgado y la pantalla vive en
    `src/screens/alert-detail/`.
  - La consulta se extrae a `src/hooks/use-alerts-list.ts` y la tabla de tipos a
    `src/utils/alert-meta.ts`.
  - Es la estructura de conventions.md desde #39.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra: `#100 R1` a `#100 R10`, con
      los `describe` que cita `traceability.md`.
- [x] El historial muestra test-primero. Cada rojo se corrió de forma
      independiente sobre su commit y ninguno falla por `ReferenceError`,
      `Cannot find module` o `TypeError` (0 líneas en los diez logs).

| R | Rojo | Resultado propio | Por qué falla |
|---|---|---|---|
| R1 | `ae9f4087` | 2 fallos / 10 | `#100 R1` y el recuento heredado `#65 R12` |
| R2 | `4d0100db` | 4 / 35 | `#100 R2` ×3 y el `toHaveLength(8 + 1)` heredado de `#114 R1` (D9) |
| R3 | `12f07895` | 9 / 34 | los 9 de R3: el stub de R2 devuelve `null` |
| R4 | `f1981f74` | 6 / 16 | los 6 declarados. `unauthorized` sale verde, como se declaró; su rojo es la sonda P1 |
| R5 | `b9803cc5` | 10 / 80 | los 9 de R5 y `#87 R19` `preserves every mutation sign-out with zero delta` |
| R6 | `8f7a0134` | 7 / 36 | los 3 de R6 y los 4 `#78 R6` de literales heredados (D9) |
| R7 | `848df9fe` | 3 / 52 | las 2 filas con `alertId` válido (declarado) y el `it` del router |
| R8 (b) | `67084429` | 1 / 1 | `findByTestId('alert-detail-ack')` (línea 135). Es la línea válida (b) de la Reanudación 3. La mutación plantada es `pages[0]` |
| R9 (b) | `36cf98bf` | 2 / 21 | `#114 R3` en la aserción de pila justo tras el segundo toque (línea 144, antes del `back`) y `#114 R1` de `layout.test.tsx` (declarado) |
| R10 (b) | `5bdf0cd6` | 2 / 26 | `checkUses` (línea 59): `common.retry` da `uses: 0`, en el `it` nuevo y en el heredado de la tabla completa |

- [x] Las mutaciones de la ruta (b) se revierten byte a byte en su verde
      (`4429bdd9`, `3983e29e` y `d7d43a01`). Producción no cambia después de
      `d7d43a01`.
- [x] Sondas de mutación del reviewer, corridas sobre una copia de `HEAD`:
  - **P1** (la pide R4). Quitar `firstPage?.kind === 'ok' &&` de la condición de
    salida deja 4 rojos en R4, todos en el matcher `mockDismissTo` y no en una
    consulta:
    - error, unreachable y missing-config fallan en la línea 215;
    - `no pinta estado ni navega cuando la primera página es unauthorized` falla
      en la línea 234.
  - **P2** (variante d de S3, D8). Borrar `void refetchAlerts();` del
    `useFocusEffect` del centro pone rojo R8:
    - Falla dentro del `waitFor` de la línea 146, porque
      `alert-row-alert-2-status` no aparece.
    - Es el rojo que S3 describe («atrás → `alert-row-alert-2-status` aparece»):
      la píldora solo existe cuando la fila ya no está `open`.
  - El control sin mutación sobre la misma copia da 26/26 en verde.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas "pendiente". Registra:
  - los pares R1–R10;
  - el segundo rojo de R8;
  - las correcciones solo de test de R3, R4 y R8;
  - A15–A17, con firma `cf52c00f` y aplicación `fc55c55c`.
- [x] Los 26 hashes citados son ancestros de `HEAD` (`git merge-base --is-ancestor`).
- [x] Los commits siguen el formato `test|feat|fix(<scope>): <desc> (R<n>)`.
      Los rojos de la ruta (b) nombran la mutación plantada.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved`.
- [x] `- [x] Aprobado por humano (fecha: 2026-09-28)` está marcada, con la firma
      vía Notion `cf52c00f`. A15, A16 y A17 también están firmadas.
- [x] Ningún requisito cambió tras la firma: `git diff cf52c00f HEAD` sobre la
      carpeta de la spec solo toca `traceability.md`.
- [x] Las enmiendas están aplicadas, con recuento 1 en cada una:
  - A15: `enmienda A15 de #100` en `docs/conventions.md` y `docs/ui-guidelines.md`.
  - A16: en `specs/mobile-push-registration/requirements.md`.
  - A17: en `specs/mobile-alerts-center/requirements.md`.
  - Las tres filas `← añadida por #100 (R1)` están en `specs/mobile-ui-language/design.md`.

## Checklist C7 — Sin código huérfano
- [x] Nada se reemplaza. Lo que se movió no deja restos:
  - el centro ya no tiene `useInfiniteQuery` ni la tabla de tipos inline;
  - `ALERT_TYPE_META` y `UNKNOWN_ALERT_META` solo viven en `src/utils/alert-meta.ts`;
  - `R12_ALERTS` apunta las tres etiquetas de tipo a `alert-meta.ts`.
- [x] No hay tests de código eliminado que retirar.
- [ ] N/A — esta feature no reemplaza nada existente (solo mueve código).

## Checklist C8 — UI móvil (carta `docs/ui-guidelines.md`)
- [x] Grep-clean sobre los 7 ficheros de producción tocados: cero hex, cero
      clases `[...]`, cero `StyleSheet.create`, cero `shadow*`/`elevation:` y
      ningún `ActivityIndicator`.
- [x] Dimensiones:
  - `paddingBottom: insets.bottom + 24` con `useSafeAreaInsets`.
  - El top lo da la cabecera nativa (`contentInsetAdjustmentBehavior="automatic"`),
    según la excepción A11 ampliada por A15.
- [x] La carga usa un `Skeleton` dimensionado (`h-44 w-full rounded-card`), no un spinner.
- [x] Reutiliza `Card` de `src/components/card`. La tabla de tipos se comparte
      con el centro (`alertTypeMeta`); no se duplica.
- [x] Tappables:
  - los `Button` de HeroUI (`min-h-11`) traen su propio feedback;
  - el enlace de fila es un `Pressable` `min-h-11` con opacidad 0.8 al pulsar.
- [x] Sin animaciones nuevas.
- [x] Del bloque *Cuatro estados* de `expo:expo-data-fetching`:
  - la carga pinta el esqueleto;
  - el error pinta un texto con botón «Reintentar»;
  - el contenido es la tarjeta, y el estado «no está» sale al centro;
  - el ack en vuelo se bloquea (`isDisabled` más `ackingRef`);
  - el error de acción es inline y conserva la tarjeta.

## Observaciones

**Hallazgos bloqueantes: 0.**

### Puntos que el leader pidió juzgar

1. **Commits solo de test posteriores a su verde. Ninguno debilita aserciones.**
   - `1ea6fa53` (R3 A11). Ahora espera `alert-detail-card` antes de leer la raíz.
     Las cuatro aserciones y sus valores son idénticos. Aplica conventions.md
     §Esperas sobre el árbol renderizado: se espera al nodo que luego se asevera.
   - `93108204` (R4 unauthorized). Mete la ausencia de `alert-detail-loading`
     dentro del `waitFor`:
     - Sigue siendo obligatoria. Si el esqueleto no se fuera, el `waitFor`
       agotaría el tiempo.
     - Ancla las ausencias siguientes (tarjeta, error y `dismissTo`) al estado
       final.
     - La sonda P1 demuestra que `expect(mockDismissTo).not.toHaveBeenCalled()`
       (línea 234) sigue mordiendo.
   - `9c07ed8e` (R8 lint). Convierte la flecha del doble de `reicon` en
     `function MockIcon`, por `react/display-name`. La conducta es idéntica y no
     toca ninguna aserción.

2. **Doble de `QueryProvider` en `alert-detail.navigation.test.tsx` (`67084429`).
   Es aceptable para R8.**
   - El doble reutiliza el `createQueryClient` real: los mismos cinco mandos,
     salvo `gcTime = 0` y un `onUnauthorized` vacío.
   - Pierde dos conductas: el `signOut` del `QueryCache` ante `unauthorized` y el
     `clear()` en `'unauthenticated'`. Ninguna es alcanzable en el escenario de R8:
     - ningún `listAlerts`/`ackAlert` devuelve `unauthorized`;
     - el doble de auth es fijo en `authenticated`.
   - Las dos conductas siguen cubiertas en
     `src/providers/__tests__/query-provider.test.tsx` (`#87 R5` y `#87 R6`).
   - Con `gcTime = 0`, que el centro se remontara podría dar un verde falso por
     una carga fresca. La sonda P2 lo descarta: sin la recarga de foco, R8 falla.
   - Cautela, no hallazgo: el `client` se crea en el ámbito del módulo, dentro de
     la factoría del mock. Con un solo `it` es inocuo, pero un segundo `it` en
     ese fichero heredaría la caché.

3. **Temporizadores reales en R8 y los 5 avisos «not configured to support act».
   Aceptable.**
   - Los temporizadores reales los autorizó la Reanudación 3. Es el remedio que ya
     documenta la nota `renderrouter-fake-timers-setstate-async`.
   - Los 5 avisos salen de `setThemeReady` del `RootLayout` y del estado interno
     de expo-router (`PreventRemoveProvider` y `useSyncState`). Se actualizan
     mientras el `waitFor` de RNTL tiene desactivado `IS_REACT_ACT_ENVIRONMENT`.
     No tocan ninguna aserción.
   - En el log completo hay 10 avisos: 5 de este fichero y 5 preexistentes de
     `src/screens/map/index.test.tsx`.
   - También hay 2 «overlapping act() calls» en
     `reminders-alerts-stack.notification.test.tsx`. Son **preexistentes**:
     medido, salen 2 con el fichero de la base `3cf09ca5` y 2 con el de `HEAD`.
     El vaciado de R9 no los introduce.

4. **«A worker process has failed to exit gracefully». No bloquea y es preexistente.**
   - Sale una vez en la corrida móvil completa (`/tmp/init100.log:20046`), que
     termina en 86/86 suites y 1595/1595 tests.
   - Ya consta en `progress/logs-111/pre1.txt` y `full3.txt` (en `origin/main`).
   - `specs/mobile-flaky-waits/requirements.md` lo registra como «dato secundario
     sin explicación».
   - No se puede atribuir a un fichero sin `--detectOpenHandles`, que queda fuera
     de esta revisión.

5. **Deuda candidata. Decide el humano; los ids se verifican contra `origin/main`.**
   - **#133 (propuesta).** El `jest.doMock('expo-notifications', …)` de `R15` en
     `src/hooks/use-push-registration.test.tsx` (línea 696) persiste y obliga a
     que `R15` sea el último `describe`. Confirmado:
     - `#100 R7` tuvo que ir antes de `#99 R1` (Reanudación 2);
     - `R15` sigue siendo el último (línea 674).

     Alcance: acotar ese `doMock` (con `jest.isolateModules`, o con
     `jest.dontMock` y `resetModules` al salir de `R15`) para que el orden de los
     `describe` deje de importar. No cambia producción.
   - **#134 (propuesta, si se registran las dos).** Confirmado: el switch de
     `ackAlert` está duplicado entre `src/screens/alerts/index.tsx` (líneas
     86–117) y `src/screens/alert-detail/index.tsx` (líneas 51–78).
     - Seis de los siete desenlaces son idénticos: ok, already-closed,
       unreachable, unauthorized, error/missing-config y `catch`.
     - `not-found` difiere a propósito: el centro pinta un error y el detalle
       hace `dismissTo`.

     Alcance: extraer la clasificación del resultado a un helper y dejar a cada
     pantalla solo `not-found` y el destino del `ok`. Sin cambio de conducta.
     Delimitación: esto **no** es la invalidación de caché. D2 y R5 la excluyen a
     propósito.

6. **Deriva y alcance. Limpio.**
   - `git diff a9965ee3 HEAD -- backend-pet-tracker infra`: vacío.
   - Contra la base real (`3cf09ca5`, el merge de main): vacío también sobre
     `package.json`, `app.json` y `bun.lock`.
   - `weekly-activity-chart*` aparece en el diff contra `a9965ee3` solo porque
     viene de #74, por el merge `93925e0e`. No es de #100.
   - Los 20 ficheros móviles del diff contra `3cf09ca5` están en la lista
     permitida del handoff.
   - `git grep` de `queryKey: [`, `useFocusEffect`, `useQueryClient`,
     `invalidateQueries` y `setQueryData` en `src/screens/alert-detail`: sin
     coincidencias en producción. Solo sale un `setQueryData` en el test, que
     siembra la caché vieja de R4.

### Otras observaciones no bloqueantes

7. **Nombres de `it.each` sin interpolar.**
   - R3 y R5 usan filas en array, así que `$type`, `$status`, `$language` y
     `$kind` salen literales. Hay 3, 3, 2 y 4 tests con el mismo nombre, y un
     fallo no dice qué fila rompió.
   - La spec prescribió esos nombres, que solo funcionan con filas objeto.
   - En R7 del hook, las etiquetas salen cruzadas: `navega con data "hot" en modo { alertId: 'alert-9' }`.
   - Afecta a la legibilidad, no a la cobertura: cada `describe` nombra su R-id.

8. **La cláusula «SHALL NOT invalidar ni escribir la caché» de R5 no tiene test.**
   Se verificó por lectura y grep (ver punto 6). Es un hueco del plan de tests de
   la spec, no del implementer.

9. **Incoherencia interna de la spec en R4.**
   - El EARS sale al centro «IF todas las páginas son `ok`». D3 prescribe
     `firstPage?.kind === 'ok'` con la premisa de que en la práctica todas las
     páginas cargadas son `ok`.
   - La premisa no es exacta: un `fetchNextPage` puede dejar `[ok, error]`. En
     ese caso el código sale a `/alerts`, cuando el EARS literal no pintaría nada.
   - El implementer siguió el diseño firmado, y la conducta resultante (volver al
     centro en lugar de quedarse en blanco) es razonable.
   - Queda anotado para quien reutilice ese EARS.

10. **Comentarios de recuento que pierden contexto (`ui-language.test.ts`).**
    - `SCREEN_FILES` suma `+ 1 + 1` bajo una sola etiqueta `// #100 R10`. D9
      pedía `// #100 R3` y `// #100 R10`, y el verde de R3 lo tuvo; el rojo de
      R10 lo sobrescribió.
    - El predicado de `R12_ALERTS` perdió `// #114 R4: el título lo pinta la
      cabecera` al ganar `// #100 R3`.
    - La suma visible es correcta. Es cosmético.

11. **Lookup con `in` en `alertTypeMeta`.** Usa `type in ALERT_TYPE_META`, que
    acepta claves del prototipo (`toString`). Viene del centro y D3 lo
    prescribe. `Object.hasOwn` sería lo correcto. Fuera de alcance.

12. **Integración con `origin/main`.** `origin/main` avanzó a `035be7fe`, con #130
    mergeada. `git merge-tree` contra `HEAD` da conflicto **solo en `STATUS.md`**;
    el código móvil mezcla limpio. Al integrar:
    - hacer merge y no rebase, para no invalidar los hashes de `traceability.md`;
    - volver a pasar los gates.

## Verificación independiente del reviewer (`mobile-pet-tracker/`, primer plano, sin pipe)

```
test ! -e .expo/types/router.d.ts            → exit=0
bunx tsc --noEmit > tsc.log 2>&1             → exit=0, 0 bytes
bunx expo lint > lint.log 2>&1               → exit=0, 0 bytes
bunx jest --runTestsByPath <12 ficheros nuevos o tocados> → exit=0
  Test Suites: 12 passed, 12 total
  Tests:       243 passed, 243 total
```

## Output de ./init.sh

Lo corrió el leader sobre `b1dae7ce`. El log completo está en `/tmp/init100.log`
(1,7 MB). Extracto:

```
Test Suites: 171 passed, 171 total          (backend unit)
Tests:       1307 passed, 1307 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 86 passed, 86 total            (mobile)
Tests:       1595 passed, 1595 total
A worker process has failed to exit gracefully and has been force exited. ...   (línea 20046, preexistente, ver punto 4)
Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e; los 3 skipped son la base habitual, cf. impl_meals-served-tracking.md)
Tests:       8 skipped, 389 passed, 397 total
exit=0
```

Las 8 líneas `ERROR` de Nest son ruido esperado de tests de rutas de error:
- 6 de unit tests a las 22:06:24:
  - `AlertsEngineConsumerService` y `PositionsConsumerService`: mensaje
    malformado con `messageId: 'bad'`;
  - `PollerService`: `sqs unavailable`, `wialon down for device-1` y dos
    `cycle skipped … ECONNREFUSED 127.0.0.1:4566`.
- 2 líneas de un e2e (`ExceptionsHandler` y la `severity: 'ERROR'` de su causa):
  un `DrizzleQueryError` por la FK `pet_users_user_id_users_id_fk` (`23503`),
  que ya aparece en cinco reviews anteriores (entre ellas `review_alerts-center-notifier.md`
  y `review_health-weights.md`).
- #100 no toca el backend.
