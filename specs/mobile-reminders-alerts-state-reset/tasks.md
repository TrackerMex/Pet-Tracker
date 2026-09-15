---
feature: "mobile-reminders-alerts-state-reset"
status: spec_ready   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-reminders-alerts-state-reset]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Orden y sujeto.** El orden es obligatorio y no es alfabético:
> - R1 y R2 **crean** el cleanup de `reminders`; R3 asierta una propiedad de ese
>   cleanup, así que va después.
> - R4 **crea** el `useFocusEffect` de `alerts` (y con él su cleanup y el
>   `jest.mock('expo-router', …)` del fichero de test); R5 y R6 asertan
>   propiedades de ese cleanup, así que van después.
> - R7 **crea** el refetch por foco; R8 necesita una segunda descarga para poder
>   observar nada, así que va el último. Antes de R7 no hay ningún camino por el
>   que llegue una página nueva a la pantalla.
>
> Ningún requisito asevera aquí sobre un nodo que otro requisito deba crear
> después: las dos pantallas, sus dos ficheros de test y todos los `testID` que
> se usan ya existen en `0e4aa810`.
>
> **Requisitos de verificación (C4, tercer y quinto punto), declarados antes del
> handoff.** R3, R5 y R6 cierran huecos de candado sobre **código ya correcto**:
> hoy nadie resetea `deletingId`, `ackingId`, `ackingIdRef` ni `acked`, así que
> su test pasaría en verde sin que exista candado alguno. Se cierran por la vía
> de la **mutación de producción**: la mutación **se versiona en el commit rojo**
> y **se revierte en el verde**, y la evidencia (salida roja + `git diff` vacío
> tras revertir) va al reporte de implementación. Mutar el doble de test no vale
> (C4, quinto punto).
>
> **Commits test-primero, obligatorio (C4, segundo punto).** Un commit por paso:
> primero el rojo que nombra su R-id, después el verde. Nada de implementación +
> tests + docs en un solo commit. Formato:
> `test(reminders-alerts-state-reset): <desc> (R1)` para el rojo y
> `feat(reminders-alerts-state-reset): <desc> (R1)` para el verde
> (`docs/conventions.md` §Commits).
>
> **Títulos de `describe` con prefijo de feature**, sin excepción: los dos
> ficheros ya acumulan R-ids de otras specs (`docs/conventions.md` §Prefijo de
> feature). Se escribe `describe('#97 R1: …')`, nunca `describe('R1: …')`.

---

## 0 — Precondiciones (una vez, antes de tocar nada)

- [ ] Cargar `expo:expo-overview` y después `expo:expo-router`
      (`docs/ui-guidelines.md` §Skills lo exige para todo trabajo móvil; en
      Codex CLI vienen del plugin `expo`). La API de foco que se usa aquí es de
      `expo-router@57.0.14`: verificarla en
      `https://docs.expo.dev/versions/v57.0.0/`, no de memoria.
- [ ] Comprobar que `mobile-pet-tracker/.expo/types/router.d.ts` **no** existe.
      Esta feature no crea, mueve ni borra ninguna ruta, así que no debería
      aparecer; si existiera y `npx tsc --noEmit` se quejara de rutas fantasma,
      **bórralo** antes de seguir — está en `.gitignore`.
- [ ] Baseline verde dirigido, **sin `./init.sh`** (el Postgres de Docker está
      compartido entre worktrees; el gate completo lo corre el reviewer). Los
      paréntesis van escapados a propósito:

      cd mobile-pet-tracker && npx jest src/screens/reminders src/screens/alerts \
        'src/app/\(tabs\)/__tests__/alerts' src/providers/__tests__/language-provider

      **Cuenta las suites que imprime jest: tienen que ser cuatro.** Si son
      menos, el filtro está mal escrito y el verde no vale
      (`docs/conventions.md` §Filtros de jest con rutas que llevan paréntesis).
- [ ] Leer [[design]] §D5 (dónde va cada cosa), §D6 (cómo se simula foco y blur
      y qué le falta a cada fichero de test) y §D7 (el ref). **No copies el
      bloque de mock de otra suite**: `alerts` no necesita `router`, `Redirect`
      ni `useIsFocused`, y `reminders` ya trae el suyo.
- [ ] Leer [[requirements]] §Reglas para los tests nuevos de `alerts`: ningún
      test nuevo espera a `queryClient.getQueryData(...)` para después asertar en
      síncrono sobre la pantalla. Se espera a la condición **de la pantalla**.

---

## R1 — `reminders` cierra la confirmación de borrado al perder el foco

- [ ] (1) Escribir test que falla para R1, en
      `mobile-pet-tracker/src/screens/reminders/index.test.tsx`, dentro de un
      `describe('#97 R1: la confirmación de borrado no sobrevive a la pérdida de foco', ...)`.
      No hace falta tocar el bloque de mocks: el fichero ya mockea
      `useFocusEffect` y ya declara `mockUseFocusEffect`.
      Añadir el helper de foco/blur de [[design]] §D6 (recorre **todas** las
      llamadas, tolera cero llamadas y cleanups `undefined`, envuelve en `act`).
      Escenario: `listPets` y `listReminders` en `ok` con un recordatorio;
      `fireEvent.press(screen.getByTestId('reminder-delete-reminder-1'))` —solo
      abrir, **no** confirmar, así que no se usa el helper `confirmDelete` del
      fichero, que confirma—; comprobar que `community-bottom-sheet` está
      presente; ejecutar el blur; afirmar que
      `screen.queryByTestId('community-bottom-sheet')`,
      `queryByTestId('reminders-delete-sheet')` y
      `queryByTestId('reminders-delete-confirm')` son `null`.
      El rojo tiene que ser **por la aserción** (el sheet sigue ahí), no un
      `TypeError`: en este commit el callback de producción no devuelve cleanup.
- [ ] (2) Implementación mínima que lo pasa: en `RemindersScreen`, devolver un
      cleanup desde el callback del `useFocusEffect` que ya existe (`:65-69`)
      que ponga `deleteCandidate` a `null`. **Ni un segundo `useFocusEffect`**
      ([[design]] §D1) **ni tocar `deletingId`**.
- [ ] (3) Refactor con tests verdes. Correr el fichero entero: el `it`
      *"refetches when the screen recovers focus"* sigue verde y ningún `it`
      existente cambia de nombre ni desaparece.

## R2 — `reminders` olvida el error de acción al perder el foco

- [ ] (1) Escribir test que falla para R2, en el mismo fichero, en un
      `describe('#97 R2: el error de acción no sobrevive a la pérdida de foco', ...)`.
      Escenario: un recordatorio, `deleteReminder` devuelve `{ kind: 'error' }`,
      usar el helper `confirmDelete('reminder-1')` del fichero, esperar a
      `reminders-action-error`; blur; afirmar
      `screen.queryByTestId('reminders-action-error')` a `null`.
- [ ] (2) Implementación mínima que lo pasa: añadir `setActionError(null)` al
      cleanup de R1.
- [ ] (3) Refactor con tests verdes.

## R3 — `reminders` conserva el guarda del borrado en vuelo

> Requisito de verificación: cierra un hueco de candado sobre código ya
> correcto. Rojo por **mutación de producción versionada en el commit rojo**.

- [ ] (1) Escribir el test de R3 en un
      `describe('#97 R3: el guarda del borrado en vuelo sobrevive a la pérdida de foco', ...)`,
      **y en el mismo commit** mutar producción: añadir `setDeletingId(null)` al
      cleanup que R1/R2 dejaron en `RemindersScreen`. Escenario: dos
      recordatorios; `deleteReminder` devuelve una promesa pendiente;
      `confirmDelete('reminder-1')`; comprobar que
      `reminder-delete-reminder-1` tiene `accessibilityState.disabled === true` y
      `reminder-delete-reminder-2` `false`; ejecutar el blur; afirmar que
      **siguen** así. Con la mutación puesta el test es **rojo por su
      aserción**; pegar esa salida en el reporte.
- [ ] (2) Verde: **revertir la mutación** (quitar `setDeletingId(null)`) y
      comprobar `git diff` limpio respecto del estado de R2. No hay
      implementación nueva: R1/R2 ya dejan el árbol correcto por construcción.
- [ ] (3) Refactor con tests verdes.

## R4 — `alerts` olvida el error del ack al perder el foco

- [ ] (1) Escribir test que falla para R4, en
      `mobile-pet-tracker/src/screens/alerts/index.test.tsx`, en un
      `describe('#97 R4: el error del ack no sobrevive a la pérdida de foco', ...)`.
      En el mismo commit: añadir `jest.mock('expo-router', () => ({
      useFocusEffect: jest.fn() }))` —**solo** ese símbolo, [[design]] §D6—,
      importar `useFocusEffect` de `expo-router`, declarar
      `const mockUseFocusEffect = jest.mocked(useFocusEffect);` y escribir el
      helper de foco/blur. `act` ya está importado en el fichero.
      Escenario: una alerta `open`, `ackAlert` devuelve `{ kind: 'error' }`,
      pulsar `alert-row-alert-1-ack`, **esperar a la pantalla** (`await
      waitFor(() => expect(screen.getByTestId('alerts-action-error'))…)`, nunca a
      la caché); blur; afirmar `queryByTestId('alerts-action-error')` a `null`.
      Rojo por la aserción: en este commit producción no registra ningún
      `useFocusEffect` y el helper no encuentra llamadas.
- [ ] (2) Implementación mínima que lo pasa: en `AlertsScreen`, capturar
      `const refetchAlerts = alerts.refetch;` y añadir el `useFocusEffect` de
      [[design]] §D5 con un cleanup que **solo** ponga `actionError` a `null`.
      El `void refetchAlerts()` del cuerpo entra en R7, no aquí.
- [ ] (3) Refactor con tests verdes. Correr el fichero entero: los `describe`
      de `#78 R4`, `R6`, `R7`, `R8` y `R9` siguen verdes — en particular el `it`
      *"no vuelve a cargar la lista tras el ack"*, que cuenta llamadas a
      `listAlerts`.

## R5 — `alerts` conserva el guarda del ack en vuelo, estado **y** ref

> Requisito de verificación, igual que R3: mutación de producción versionada en
> el rojo.

- [ ] (1) Escribir los **dos** `it` de R5 en un
      `describe('#97 R5: el guarda del ack en vuelo sobrevive a la pérdida de foco', ...)`,
      **y en el mismo commit** mutar producción añadiendo al cleanup de R4
      `setAckingId(null);` **y** `ackingIdRef.current = null;`.
      - `it` de comportamiento: `ackAlert` devuelve una promesa pendiente,
        pulsar `alert-row-alert-1-ack`, esperar a que quede deshabilitado; blur;
        afirmar que **sigue** deshabilitado y que `ackAlert` sigue con **una**
        llamada tras intentar pulsarlo otra vez.
      - `it` de fuente ([[design]] §D7, zona ciega del ref): leer
        `src/screens/alerts/index.tsx`, quedarse con el trozo que va desde
        `useFocusEffect(` hasta la declaración de `handleAck`, y afirmar que no
        contiene `AckingId` ni `ackingIdRef`. Para leer el fuente desde una
        suite de jest, el patrón del repo es el de
        `src/app/(tabs)/__tests__/alerts.test.tsx:6-15` (`declare function
        require(...)` + `readFileSync`/`join`); ese fichero lo usa contra
        `floating-tab-bar.tsx` y `_layout.tsx`.
      Con la mutación puesta los **dos** `it` son rojos por su aserción.
      **Segunda sonda, en zona distinta**: dejar solo
      `ackingIdRef.current = null;` — el `it` de comportamiento se queda
      **verde** y el de fuente se pone **rojo**. Pegar las dos salidas en el
      reporte: son la prueba de que el ref tiene candado propio.
- [ ] (2) Verde: revertir las dos mutaciones y comprobar `git diff` limpio
      respecto del estado de R4.
- [ ] (3) Refactor con tests verdes.

## R6 — `alerts` conserva el overlay del ack al perder el foco

> Requisito de verificación, igual que R3 y R5.

- [ ] (1) Escribir el test de R6 en un
      `describe('#97 R6: la alerta atendida sigue atendida al volver a la pantalla', ...)`,
      **y en el mismo commit** mutar producción añadiendo `setAcked({});` al
      cleanup de R4. Escenario: `listAlerts` devuelve **una vez** una página con
      una alerta `open` y **después** siempre una promesa pendiente (para que
      ninguna descarga nueva pueda explicar el resultado, ni ahora ni cuando R7
      añada el refetch por foco); `ackAlert` devuelve `{ kind: 'ok', alert }` con
      la alerta `acked`; pulsar el ack y esperar a que la pantalla pinte
      `alert-row-alert-1-status`; ejecutar **blur y después foco**; afirmar que
      `alert-row-alert-1-status` sigue con `es['alerts.statusAcked']` y que
      `queryByTestId('alert-row-alert-1-ack')` es `null`.
      Con la mutación puesta el test es rojo por su aserción.
- [ ] (2) Verde: revertir la mutación y comprobar `git diff` limpio respecto del
      estado de R5.
- [ ] (3) Refactor con tests verdes.

## R7 — `alerts` revalida su lista al ganar el foco

- [ ] (1) Escribir test que falla para R7, en un
      `describe('#97 R7: la lista se revalida al ganar el foco', ...)`.
      Escenario: una página con una alerta, esperar a que la pantalla la pinte,
      comprobar `expect(mockListAlerts).toHaveBeenCalledTimes(1)`; ejecutar el
      **foco**; afirmar `await waitFor(() =>
      expect(mockListAlerts).toHaveBeenCalledTimes(2))`.
- [ ] (2) Implementación mínima que lo pasa: añadir `void refetchAlerts();` al
      cuerpo del callback del `useFocusEffect` de R4, **antes** del `return` del
      cleanup.
- [ ] (3) Refactor con tests verdes. Correr el fichero entero y confirmar que
      ningún `it` de `#78` que cuente llamadas a `listAlerts` se ha movido:
      ninguno ejecuta el callback de foco.

## R8 — el overlay del ack deja de aplicarse cuando la lista ya no da la alerta por abierta

- [ ] (1) Escribir test que falla para R8, en un
      `describe('#97 R8: el overlay del ack caduca cuando la lista trae otro status', ...)`.
      Escenario: `listAlerts` devuelve **primero** una página con la alerta
      `open` y **después** la misma alerta con `status: 'closed'`; `ackAlert`
      devuelve `{ kind: 'ok', alert }` con la alerta `acked`; pulsar el ack y
      esperar a que la pantalla pinte `es['alerts.statusAcked']`; ejecutar el
      **foco** (que dispara el refetch de R7) y esperar a que la pantalla
      cambie; afirmar que `alert-row-alert-1-status` presenta
      `es['alerts.statusClosed']`.
      Rojo por la aserción: hoy el overlay gana siempre y la fila seguiría
      diciendo "Atendida".
- [ ] (2) Implementación mínima que lo pasa: en `AlertsScreen`, condicionar el
      overlay de la línea `rows` (`:85`) al `status` **descargado**, según
      [[design]] §D3. **`fetched` y `ordered` no se tocan**: el orden de #78 R7
      se calcula antes y sigue calculándose igual.
- [ ] (3) Refactor con tests verdes. Correr el fichero entero: los cinco
      `describe` de `#78` siguen verdes, en particular
      *"aplica el Alert devuelto por ok y quita el botón"* y
      *"no mueve la fila abierta al pulsar su ack"*.

---

## Cierre

- [ ] `progress/impl_mobile-reminders-alerts-state-reset.md` escrito: qué commit
      cubre qué R-id, las **cuatro** salidas de mutación (R3; R5 con sus dos
      sondas; R6) con su `git diff` vacío tras revertir, y la salida del comando
      dirigido de [[requirements]] §Verificación **sin pipe** (un
      `./init.sh | tail` devuelve el código de `tail`, no el del gate) con el
      recuento de suites a la vista.
- [ ] `traceability.md` sin ninguna fila "pendiente".
- [ ] `npx tsc --noEmit` y `npx expo lint` verdes en `mobile-pet-tracker/`.
- [ ] `git diff 0e4aa810 --stat` toca **exactamente nueve** ficheros: los dos
      de producción, los dos de test, `specs/mobile-alerts-center/requirements.md`
      (§E9) y los cuatro de esta spec. Si aparece
      `src/i18n/catalog.ts`,
      `src/providers/__tests__/language-provider.test.tsx`,
      `src/app/(tabs)/_layout.tsx`, `src/components/`, `src/theme/` o cualquier
      fichero de ruta, la implementación se salió del alcance.
- [ ] **No rebasar** después de escribir la trazabilidad: invalidaría los hashes
      registrados.
- [ ] El gate humano de [[requirements]] §Gate humano (dev build de Android)
      **no lo cierra ninguna IA**.
