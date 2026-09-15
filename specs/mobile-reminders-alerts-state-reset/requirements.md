---
feature: "mobile-reminders-alerts-state-reset"
status: spec_ready   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-reminders-alerts-state-reset]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas —en particular **D3**, que decide
> pieza por pieza qué se resetea y qué sobrevive— y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil.
>
> **Continuación directa de #63** (`specs/mobile-detail-screens-state-reset/`),
> cuyo §Fuera de alcance dejó estas dos pantallas anotadas para que el leader
> decidiera. Esta spec es esa decisión. El mecanismo es el mismo (D1 de #63);
> **el alcance no**: aquí una de las piezas de estado es una capa optimista
> sobre datos del servidor y resetearla sería una regresión.
>
> **Commit base de toda medición**: `0e4aa810`
> (`Merge pull request #136 … docs/97-reminders-alerts-state-reset`). Ningún
> requisito congela recuentos absolutos de tests ni de elementos: lo que se mide
> es el delta contra ese commit y la consistencia interna de cada fichero.

## Contexto en una línea

`reminders` y `alerts` son rutas **dentro** de `src/app/(tabs)/` que **no** son
pestañas (`(tabs)/_layout.tsx:26-30` declara cinco `Tabs.Screen` y `TABS` de
`floating-tab-bar.tsx:47-53` tiene cinco entradas; ninguna es `reminders` ni
`alerts` — se entra por `router.push` desde Home y Profile). Aun así son
pantallas del navegador de tabs: salir de ellas por la barra flotante o por el
botón atrás de Android **cambia de pantalla pero no desmonta el componente**
(D1 de #63), así que su `useState` y su `useRef` sobreviven y se vuelven a
pintar tal cual al volver.

## Hechos del enunciado, reverificados contra `0e4aa810`

El enunciado de #97 se escribió el 2026-09-15 sobre `main` @ `1b9efe86`. Todo lo
que sigue se volvió a comprobar contra el árbol; **la spec usa esta columna, no
el enunciado**.

| Hecho del enunciado | Verificado |
|---|---|
| `reminders`: tres `useState` en `:61-63` (`deletingId`, `deleteCandidate`, `actionError`) | **Exacto**, mismas líneas |
| `reminders`: `useFocusEffect` en `:65` que solo llama a `refetchReminders()`, sin cleanup | **Exacto** (`:65-69`) |
| `reminders`: `deleteCandidate` alimenta el sheet en `:348` (`index={deleteCandidate === null ? -1 : 0}`) | **Exacto** |
| `alerts`: **no** tiene `useFocusEffect` | **Exacto**: el fichero no importa nada de `expo-router` |
| `alerts`: `acked` `:63`, `ackingId` `:64`, `ackingIdRef` `:65`, `actionError` `:66` | **Exacto** |
| `alerts`: `rows = ordered.map((alert) => acked[alert.id] ?? alert)` en `:85` | **Exacto** |
| "no descarto `useReducer`, contexto local ni estado en hooks propios" | **Auditado y cerrado**: no hay ninguno. Inventario exhaustivo en [[design]] §D2 |
| `alerts/index.test.tsx` es el tercer avistamiento de #72 | **Exacto**: `waitFor` sobre `queryClient.getQueryData(alertKeys.list())` seguido de un `getByTestId('alerts-error')` **síncrono**, dentro de `#78 R4 → "pinta y reintenta cada error de la primera página"` |
| Criterio de aceptación 2: *"`actionError` y `deletingId` no sobreviven"* | **Divergencia declarada**, ver §Divergencia del enunciado: `deletingId` **no se resetea** |

Dos hechos que el enunciado no podía traer y que cambian el diseño:

1. **Una alerta `acked` puede pasar a `closed` en el servidor.** El worker cierra
   por `status IN ('open','acked')`
   (`backend-pet-tracker/src/workers/alerts-engine/alerts-engine.drizzle.store.ts:99-102`,
   decisión #13 R23/D1). Como `acked[alert.id] ?? alert` gana siempre, una alerta
   atendida en la app y cerrada después por el motor se seguiría pintando
   "Atendida" mientras viva el proceso. La desincronización **indefinida** del
   criterio 4 no es hipotética: existe hoy.
2. **Hoy nada refresca esa lista dentro de la sesión.** `refetchOnWindowFocus` y
   `refetchOnReconnect` están en `false` (`src/providers/query-provider.tsx:28-36`),
   la pantalla nunca se desmonta (así que `refetchOnMount` nunca dispara) y el
   único `refetch` es el botón `alerts-retry`, que solo existe en la rama de
   error. Sin R7 no hay ningún camino por el que el candado de R8 pase.

## Requisitos funcionales

El disparador **"pierde el foco de navegación"** significa, de forma observable
en test y exactamente como en #63: se ejecuta la función de limpieza que
devuelve el callback registrado en `useFocusEffect`. **"gana el foco"**: se
ejecuta ese callback.

### `reminders` (`mobile-pet-tracker/src/screens/reminders/index.tsx`)

- **R1**: WHEN la pantalla `RemindersScreen` pierde el foco de navegación
  THE SYSTEM SHALL poner `deleteCandidate` a `null`, de modo que el
  `BottomSheet` de `reminders-delete-host` vuelva a `index = -1` y no haya
  `community-bottom-sheet`, ni `reminders-delete-sheet`, ni
  `reminders-delete-confirm` en el árbol al volver.

- **R2**: WHEN la pantalla `RemindersScreen` pierde el foco de navegación
  THE SYSTEM SHALL poner `actionError` a `null`, de modo que
  `reminders-action-error` deje de renderizarse.

- **R3**: WHILE una llamada a `deleteReminder` de la pantalla sigue en vuelo,
  WHEN `RemindersScreen` pierde el foco de navegación THE SYSTEM SHALL
  **conservar** `deletingId`: su único camino a `null` sigue siendo el bloque
  `finally` de `handleDelete` (`index.tsx:105-107`), de modo que al volver no
  sea posible disparar un segundo DELETE sobre una petición aún viva.
  Observable: con `deleteReminder` pendiente sobre `reminder-1`, tras la pérdida
  de foco `reminder-delete-reminder-1` sigue con
  `accessibilityState.disabled === true` y `reminder-delete-reminder-2` sigue
  habilitado.

### `alerts` (`mobile-pet-tracker/src/screens/alerts/index.tsx`)

- **R4**: WHEN la pantalla `AlertsScreen` pierde el foco de navegación
  THE SYSTEM SHALL poner `actionError` a `null`, de modo que un
  `alerts-action-error` originado por un ack fallido deje de presentarse.
  AND este requisito **no** cubre el error derivado de una página posterior
  fallida (`laterPageFailed`, `index.tsx:90-96`): ese no es estado local sino
  una lectura de la caché, y se recalcula solo.

- **R5**: WHILE una llamada a `ackAlert` sigue en vuelo, WHEN `AlertsScreen`
  pierde el foco de navegación THE SYSTEM SHALL **conservar a la vez**
  `ackingId` y `ackingIdRef.current`: el único camino a `null` de los dos sigue
  siendo el bloque `finally` de `handleAck` (`index.tsx:136-139`).
  Observable, en dos piezas porque el ref no tiene observable propio
  ([[design]] §D7): (a) tras la pérdida de foco `alert-row-alert-1-ack` sigue
  deshabilitado y `ackAlert` sigue con **una** llamada; (b) el bloque
  `useFocusEffect` de `AlertsScreen` no menciona `setAckingId` ni `ackingIdRef`.

- **R6**: WHEN `AlertsScreen` pierde el foco de navegación THE SYSTEM SHALL
  **conservar** el overlay `acked` sin modificarlo, de modo que al recuperar el
  foco una alerta ya atendida siga presentando `alert-row-alert-1-status` con
  `t('alerts.statusAcked')` y sin `alert-row-alert-1-ack`, **sin depender de
  ninguna respuesta de red** (observable con la segunda llamada a `listAlerts`
  todavía pendiente).

- **R7**: WHEN `AlertsScreen` gana el foco de navegación THE SYSTEM SHALL
  invocar el `refetch` de la query `alertKeys.list()`, de modo que la lista se
  revalide al volver a la pantalla. Observable: con una sola página cargada,
  ejecutar el callback de foco deja `listAlerts` en dos llamadas (una por página
  cargada; el bucle de refetch está en
  `node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js:51-58`).

- **R8**: WHILE la alerta **tal como la devolvió `listAlerts`** tenga un `status`
  distinto de `'open'`, THE SYSTEM SHALL presentar esa fila con los datos
  descargados e **ignorar** su entrada de `acked`. Observable: alerta `open` →
  ack `ok` → refetch cuya página la trae `closed` → `alert-row-alert-1-status`
  presenta `t('alerts.statusClosed')`, no `t('alerts.statusAcked')`.

## Decisión pieza por pieza (criterios de aceptación 3 y 6)

Siete piezas, siete decisiones, siete motivos. **Ninguna decisión en bloque.**

| Pantalla | Pieza | Decisión | Motivo | R |
|---|---|---|---|---|
| reminders | `deleteCandidate` | **resetear** en el blur | Es el defecto peor de los dos ficheros: reabre un diálogo destructivo, con el confirmar a un toque, sobre un recordatorio que el usuario ya dejó atrás. No hay ningún caso legítimo en que una confirmación pendiente deba sobrevivir a irse de la pantalla | R1 |
| reminders | `actionError` | **resetear** en el blur | `setActionError(null)` solo ocurre al **empezar** otro borrado (`:75`), así que un error ya resuelto se repinta al volver sin que el usuario haya hecho nada. Mismo caso que `generateError` en #63 R4 | R2 |
| reminders | `deletingId` | **sobrevive** | Es un guarda de petición en vuelo, la misma clase que #63 R7 protege por nombre (`submitting`/`claiming`/`releasing`). No puede quedar rancio: su vida entera va de `setDeletingId(id)` (`:74`) al `finally` (`:105-107`), y **no hay rama que salga sin pasar por el `finally`**. Resetearlo no arregla nada y abre un segundo DELETE sobre una petición viva | R3 |
| alerts | `actionError` | **resetear** en el blur | Idéntico al de reminders: `setActionError(null)` solo ocurre al empezar otro ack (`:103`) | R4 |
| alerts | `ackingId` | **sobrevive** | Guarda de petición en vuelo; deshabilita **todos** los botones de ack mientras vuela uno (`isDisabled={ackingId !== null}`, `:248`). Misma clase que #63 R7 | R5 |
| alerts | `ackingIdRef` | **sobrevive**, y obligatoriamente **junto a** `ackingId` | Es la otra mitad del mismo guarda: corta la reentrada **síncrona** de `handleAck` (`:100`) en la ventana anterior al re-render, que es la que el `isDisabled` todavía no cubre. Resetear el ref y no el estado deja un botón deshabilitado con el guarda abierto; resetear el estado y no el ref deja un botón habilitado que no hace nada. Los dos se apagan en el mismo `finally` (`:137-138`) y los dos sobreviven | R5 |
| alerts | `acked` | **sobrevive**, y además **caduca** cuando la lista ya no trae la alerta como `open` | **No es basura de formulario: es una capa optimista sobre datos del servidor** (`:85`). Resetearla al perder el foco haría que una alerta ya atendida se volviera a ver sin atender hasta que refrescara la query — una regresión, no un arreglo, y además una regresión **visible en cada vuelta a la pantalla**. Es el "caso legítimo de estado que debe sobrevivir" que el criterio 5 de #63 obligaba a nombrar. Lo que **sí** hay que acotar es su vigencia: ver R8 y §Coherencia | R6, R8 |

## Coherencia de `acked` con el servidor (criterio de aceptación 4)

`acked` sobrevive, así que hay que decir por escrito por qué no se queda
desincronizado indefinidamente. Tres frases y un par de requisitos:

1. **Qué guarda.** No una suposición: guarda el `Alert` que devolvió el propio
   servidor en el ack (`result.alert`, `:110-113`) o, en `already-closed`, el
   estado terminal que el servidor acaba de declarar (`:116-119`).
2. **Cuándo deja de valer.** En cuanto la lista se vuelve a descargar. A partir
   de R8 el overlay solo se consulta para filas que **la API sigue devolviendo
   como `open`**; para cualquier otra gana el dato descargado. Como el ciclo del
   backend solo va `open → acked → closed` y nunca vuelve a `open`
   (`ack-alert.use-case.ts:24-25`, `alerts-engine.drizzle.store.ts:99-102`), una
   entrada del overlay nunca puede resucitar y contradecir al servidor: o
   coincide con él, o ya no se mira.
3. **Cuándo se vuelve a descargar.** Con R7, cada vez que la pantalla gana el
   foco. Sin R7 no se descargaba nunca dentro de la sesión (ver §Hechos, punto
   2) y el candado de R8 sería inalcanzable.

Consecuencia declarada y aceptada: al volver a la pantalla, una alerta atendida
antes deja de estar en el grupo de las abiertas, porque #78 R7 particiona por el
`status` **descargado** y el refetch trae uno nuevo. Eso **no** contradice #78
R7 —que congela la posición frente al ack, no frente a una descarga nueva— y es
el mismo comportamiento que ya tiene `reminders` con la fila borrada.

## Estado que SÍ debe sobrevivir, auditado uno por uno

Además de las cuatro piezas de la tabla (`deletingId`, `ackingId`,
`ackingIdRef`, `acked`), estas otras **no** las toca esta spec y el reviewer debe
comprobar que siguen intactas:

1. **Caché de TanStack Query** — `petKeys.list()`, `reminderKeys.list(petId)` y
   `alertKeys.list()`. Ninguna `queryKey` cambia. R7 **añade** un `refetch`; no
   vacía, no invalida y no escribe en la caché.
2. **`selectedPetId` del `SelectedPetProvider`** — compartido entre pantallas a
   propósito; un reset devolvería al usuario a la primera mascota.
3. **Posición de scroll de `alerts-list` y páginas ya cargadas** — sobreviven al
   blur y deben seguir sobreviviendo: volver a la pantalla y encontrarse en lo
   alto de la lista con una sola página sería una regresión.
4. **Idioma y tema** — fuera del alcance de cualquier reset de pantalla.

## Divergencia del enunciado (criterio de aceptación 2)

El criterio 2 de #97 pide que **`deletingId` no sobreviva** a la salida por la
barra de tabs. **Esta spec entrega el observable de ese criterio y rechaza su
mecanismo**, por escrito y para que el humano lo ratifique en el gate:

- El observable ("el usuario nunca vuelve y encuentra una fila bloqueada por un
  borrado que ya terminó") **ya se cumple hoy y sigue cumpliéndose**: el
  `finally` de `handleDelete` es incondicional, así que `deletingId` no puede
  sobrevivir a su propia petición.
- Resetearlo además en el blur solo tiene efecto **mientras la petición sigue
  viva**, y ahí el efecto es dañino: rehabilita `reminder-delete-<id>` sobre un
  DELETE en vuelo. Es exactamente lo que #63 R7 —aprobado el 2026-09-14—
  prohíbe para `submitting`, `claiming` y `releasing`.
- Por eso el criterio 2 se cierra con **R2 (`actionError`) + R3 (`deletingId`
  sobrevive, con candado y prueba de mutación)** en vez de con un reset en
  bloque.

## Enmienda E9 a la spec de #78 (`specs/mobile-alerts-center/`)

R8 modifica una decisión ya aprobada de otra feature; se declara aquí y se
registra también en `specs/mobile-alerts-center/requirements.md` §E9.

- **Spec enmendada**: `specs/mobile-alerts-center/` (#78), §D3 de su
  [[../mobile-alerts-center/design|design]] — el bloque de composición marcado
  *"en este orden y no otro"*, cuya tercera línea es
  `const rows = ordered.map(a => acked[a.id] ?? a);`.
- **Qué cambia**: esa tercera línea gana una condición — el overlay solo se
  aplica mientras la alerta descargada siga siendo `open` (R8 de esta spec).
- **Qué NO cambia**: las dos primeras líneas (`fetched` y `ordered`) y su orden;
  **todas** las filas de la tabla de #78 R8, que siguen siendo literalmente
  ciertas porque en el momento del ack la alerta descargada **es** `open`; el
  `isDisabled` mientras vuela la petición; `alerts-action-error` y su limpieza
  al iniciar el siguiente ack; y las dos prohibiciones de E5 —ni `useMutation`
  ni `setQueryData`—, que esta feature respeta.
- **Qué añade a #78**: el `refetch` por foco (R7), que #78 no tenía y que su E6
  dejó explícitamente fuera **para la campana de Home**, no para esta pantalla.

- [X] Enmienda E9 aprobada por humano ← se firma junto con §Aprobación

## Fuera de alcance

- **El flake de #72 no se arregla aquí.** `src/screens/alerts/index.test.tsx` es
  su tercer avistamiento, pero tiene su spec y sus criterios. Esta feature **no
  toca** el `it` afectado (`#78 R4 → "pinta y reintenta cada error de la primera
  página"`) ni ninguna de las aserciones existentes. Lo que sí hace es **no
  repetir el patrón**: ver §Reglas para los tests nuevos de `alerts`.
- **No se mueve ninguna ruta a un Stack.** Sigue vigente D1 de #63 y la deuda
  `mobile-detail-screens-to-stack` que aquella spec dejó enunciada.
- **`acked` no se migra a la caché.** Ni `setQueryData`, ni `useMutation`, ni
  `invalidateQueries`: #78 E5 y E6 lo prohíben con motivo, y revertirlos sería
  cambio de spec ajena con su propio gate.
- **No se extrae ningún hook compartido de reset** (mismo argumento de #63 D1:
  una línea por pantalla).
- **Copy nueva: cero.** Esta feature **no añade, renombra ni borra ninguna clave
  de `src/i18n/catalog.ts`**, así que
  `src/providers/__tests__/language-provider.test.tsx:55`
  (`expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2)`) debe quedar
  **byte a byte idéntica**. Si un diff la toca, la implementación se salió del
  alcance.
- **C8 / carta de UI**: no se añade ni una `className`, ni un hex, ni un token,
  ni una dimensión, ni una animación, ni un componente. `src/theme/`,
  `src/components/` y los candados de `src/__tests__/` quedan intactos —
  incluidos `design-drift.test.ts:386-397` (el mapa de `signOut` por pantalla, que
  no cambia: esta feature no añade ni quita ninguno) y
  `ui-language.test.ts:180-215` (las catorce claves de `alerts`).
- **`map.tsx`, `home`, `profile`**: no entran. `map` es tab de pleno derecho y
  las otras dos ya tienen su `useFocusEffect`; ninguna está en el enunciado.
- **Nada de esto crea, renombra ni borra ficheros de ruta**, así que
  `mobile-pet-tracker/.expo/types/router.d.ts` no se invalida. Ver la
  precondición de [[tasks]] §0.

## Reglas para los tests nuevos de `alerts` (colisión con #72)

Obligatorias, y escritas aquí para que Codex no las deduzca:

1. **Nunca esperar a la caché.** Ningún test nuevo puede hacer
   `await waitFor(() => expect(queryClient.getQueryData(alertKeys.list())).…)`
   y después asertar en síncrono sobre la pantalla: cuando la caché ya tiene el
   dato, React puede no haber re-renderizado todavía. Eso es exactamente la
   carrera de #72, que tumbó el CI del PR #132 sin tocar código. **Se espera
   siempre a la condición de la pantalla** (`await waitFor(() =>
   expect(screen.getByTestId(...))…)`) y se asierta después.
2. **Nada de números de línea** de `src/screens/alerts/index.test.tsx` en
   [[tasks]] ni en [[traceability]]: se referencia por título de `describe`. Si
   #72 entra antes, ese fichero se mueve entero.

## Verificación

- **Comando dirigido** (el gate completo `./init.sh` lo corre el reviewer; esta
  spec **no** pide correrlo durante la implementación porque el Postgres de
  Docker está compartido entre worktrees):

  ```
  cd mobile-pet-tracker && npx jest src/screens/reminders src/screens/alerts \
    'src/app/\(tabs\)/__tests__/alerts' src/providers/__tests__/language-provider
  ```

  Los paréntesis van **escapados**: los argumentos posicionales de jest son
  regex, y `src/app/(tabs)/…` sin escapar salta el fichero **en silencio, con
  exit 0** (`docs/conventions.md` §Filtros de jest con rutas que llevan
  paréntesis; en #63 dio verde sin ejecutar dos requisitos). **Comprobado al
  redactar esta spec sobre `0e4aa810`: el comando ejecuta las cuatro suites que
  nombra y salen las cuatro en verde.** Si jest imprime menos de cuatro suites,
  el filtro está mal y el verde no vale.

  **No se congela aquí ningún recuento de tests.** La medición de cierre es el
  **delta contra `0e4aa810`**: ninguna suite pasa de verde a roja, ningún `it(`
  existente desaparece ni cambia de nombre, y cada R-id nuevo aporta su
  `describe` con su id **prefijado por la feature** (`#97 R1: …`), porque los dos
  ficheros ya acumulan R-ids de otras specs (`docs/conventions.md` §Prefijo de
  feature; hoy conviven `R5`/`R6`/`R7` de `mobile-reminders`, `#64 R7`, `#65 R15`
  y `#87 R14` en reminders, y `#78 R4`-`R9` en alerts).
- `npx tsc --noEmit` y `npx expo lint` verdes en `mobile-pet-tracker/`.

## Gate humano no delegable (criterio de aceptación 8)

Prueba de humo en **dev build de Android** (nunca Expo Go: el runtime de smoke
es dev build desde 2026-08-27). La corre el humano, no una IA:

1. Entrar a Recordatorios desde Home, pulsar **Eliminar** en un recordatorio
   para abrir la hoja de confirmación, **salir por la barra de tabs** (por
   ejemplo a Inicio) y volver a Recordatorios: la hoja de confirmación **no**
   está abierta y el recordatorio sigue existiendo.
2. Provocar un error de borrado (modo avión y confirmar el borrado), salir por
   la barra de tabs y volver: el mensaje rojo **ya no está**.
3. En Alertas, pulsar **Atender** en una alerta abierta, salir por la barra de
   tabs y volver: la alerta **sigue** marcada como atendida — nada parpadea a
   "sin atender" al volver.
4. Con red, volver a entrar en Alertas: la lista se ha refrescado (una alerta
   nueva generada mientras tanto aparece sin reiniciar la app).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-15) ← gate obligatorio antes de implementar

Al aprobar, el humano ratifica además **tres decisiones que corrigen o amplían
el enunciado de #97**, y que Codex no podrá reabrir porque no verá la
conversación que las produjo:

1. **`deletingId` no se resetea** (§Divergencia del enunciado), en contra de la
   letra del criterio 2 y a favor de #63 R7.
2. **`acked` sobrevive** y su vigencia se acota con R8 en vez de resetearlo.
3. **`alerts` gana un `refetch` por foco** (R7), que es comportamiento nuevo y
   no solo un reset, y que es lo que hace alcanzable el candado de R8.
