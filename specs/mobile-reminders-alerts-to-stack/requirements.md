---
feature: "mobile-reminders-alerts-to-stack"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-reminders-alerts-to-stack]] (#114)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D9), las sondas que las
> sostienen (§1) y el inventario de aserciones heredadas que cambian (D9), y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil (gate C8).
>
> **Commit base de toda medición**: `a833f153` (`origin/main`, merge de PR #155,
> que trae #95). En esa base, medido por el spec_author el 2026-09-23 desde
> `mobile-pet-tracker/` y sin pipe (`bunx jest --silent > f 2>&1; echo exit=$?`):
> **80 suites, 1426 tests, `exit=0`**. `bunx tsc --noEmit` y `bunx expo lint`:
> `exit=0` y **salida de 0 bytes**. `.expo/types/router.d.ts` **no existe**.
> Ningún requisito congela recuentos absolutos: se declara el **delta** contra
> la base (§Verificación). Si la base se mueve, manda el delta.
>
> **Todo `describe` nuevo lleva el prefijo `#114 R<n>:`** (`docs/conventions.md`
> §Prefijo de feature). La cita es siempre `#114 R<n>`, nunca `#114` suelto
> (contrato con `src/__tests__/design-drift.test.ts`, #108).

## Contexto en una línea

`reminders` y `alerts` son las dos últimas rutas no-pestaña bajo
`src/app/(tabs)/`. Son hijas implícitas del navegador `Tabs` (expo-router
registra todo fichero del grupo) y no se ven en la barra porque
`FloatingTabBar` solo pinta las cinco entradas de `TABS`. Por eso
`router.push('/reminders')` **no apila nada** (la pila raíz sigue en
`["(tabs)"]`), la pantalla **no se desmonta nunca** al salir, y tocar una
notificación estando en una pantalla de detalle apila una **segunda** `(tabs)`
(sondas S1–S3 de [[design]] §1). Esta feature las sube al `Stack.Protected` de
`RootStack` que dejó #95.

## P1 — Decisión de producto (la toma el humano, no esta spec)

Mover las dos pantallas **cambia su UX**; no es una limpieza. Esta spec está
escrita para la **opción A** y se reescribe si el humano marca otra
(§Aprobación, casilla P1).

- **A — mover las dos** (lo que especifica esta spec).
- **B — mover solo `reminders`**: `alerts` se queda en `(tabs)` y con ella la
  segunda `(tabs)` al tocar una notificación desde una pantalla de detalle.
- **C — no mover ninguna**: la feature se cierra sin código.

Consecuencias de A, todas visibles en la prueba de humo:

1. **Pierden la barra de pestañas flotante.** Desde Recordatorios o Alertas ya
   no se salta directamente a otra pestaña: primero se vuelve.
2. **Ganan cabecera nativa** con título y flecha de volver, y **entran con la
   transición de plataforma** en vez del fundido de pestaña. Volver lleva a la
   pantalla de origen (Home o Profile).
3. **Cada entrada es una visita nueva.** Volver atrás desmonta la pantalla: al
   reentrar se empieza arriba de la lista, y el estado local de la visita
   anterior no sigue. Eso cierra el criterio de `deleteCandidate` del enunciado
   **y además** retira tres piezas que #97 conservaba a propósito
   ([[design]] D5): el overlay `acked` de alertas, y los guardas en vuelo
   `deletingId` y `ackingId`. Hasta que vuelve el refetch de la reentrada, una
   alerta atendida en la visita anterior puede verse con "Atender"; pulsarlo es
   inocuo porque el backend es idempotente (`acked + ack → 200` sin cambios).
4. **Tocar una notificación** apila Alertas encima de la pantalla actual, sea
   cual sea, sin segunda `(tabs)`; y volver regresa a esa pantalla con lo que
   tuviera escrito.
5. **El nombre accesible de la flecha** lo pone Android en el idioma del
   sistema, no en el de la app (igual que en las seis de #95, su decisión 5).

## Qué firma además el humano al aprobar esta spec

1. **Cero claves de copy nuevas y cero retiradas.** Los títulos de cabecera
   reutilizan la clave que ya titulaba cada pantalla (`reminders.reminders`,
   `alerts.title`), que sale del cuerpo. El catálogo **no cambia de longitud**
   (D7).
2. **"Nuevo" se queda en el cuerpo, arriba a la derecha**, donde está hoy; no
   pasa a la cabecera (D3).
3. **`alerts` es `dangerouslySingular`**: un toque de notificación con Alertas ya
   en la pila la reutiliza en vez de apilar otra. Hoy, con Alertas como pestaña,
   un toque estando en ella tampoco hace nada (D2).
4. **Arranque en frío sin ancla**: debajo de Alertas queda `(tabs)` en Home sin
   `unstable_settings`, porque el hook de #79 no navega hasta que la ruta sale de
   `/` (sonda S6).
5. **`add-reminder` sin mascota deja de usar `<Redirect>`** y hace
   `router.dismissTo('/reminders')`, para no apilar dos Recordatorios (R7,
   enmienda A14).
6. **Los resets de foco de #97 se quedan** en las dos pantallas (D5).
7. **Excepción A11 de métricas** también para estas dos, y enmienda A13 de su
   lista en los docs (R6).

## Requisitos funcionales

### R1 — `reminders` y `alerts` son hijas del `Stack.Protected` raíz

- **R1**: THE SYSTEM SHALL tener las rutas en `src/app/reminders.tsx` y
  `src/app/alerts.tsx` (movidas con `git mv` desde `src/app/(tabs)/`, sin más
  cambio que el import: `'../screens/reminders'` y `'../screens/alerts'`);
  SHALL dejar `src/app/(tabs)/` con **exactamente** `__tests__/`, `_layout.tsx`,
  `food.tsx`, `health.tsx`, `home.tsx`, `map.tsx` y `profile.tsx`; y SHALL
  declarar en el `Stack.Protected guard={status === 'authenticated'}` de
  `RootStack` (`src/app/_layout.tsx`) **ocho** `Stack.Screen`: los seis de #95 en
  su orden, después `reminders` y por último `alerts`, este con la prop
  `dangerouslySingular` (valor `true`) y `reminders` sin ella.

  *Tests*: `src/app/__tests__/detail-stack.test.tsx`,
  `describe('#114 R1: reminders y alerts viven en la raíz de src/app')`, y
  `src/app/__tests__/layout.test.tsx`,
  `describe('#114 R1: la guarda de RootStack declara reminders y alerts tras las seis')`.
  Rojo real en `a833f153`: las rutas están bajo `(tabs)` y la guarda tiene seis
  hijos.

### R2 — Push, pop y montaje sobre `(tabs)`, y fuera de la pila sin sesión

- **R2**: WHEN el usuario autenticado hace `router.push('/reminders')` o
  `router.push('/alerts')` desde una pestaña THE SYSTEM SHALL apilar la ruta como
  **segunda entrada** de la pila raíz, sobre una única `(tabs)`; WHEN vuelve atrás
  THE SYSTEM SHALL desapilarla y desmontarla, de modo que la siguiente entrada
  monte una instancia nueva; WHILE `reminders` está en la pila, WHEN se apila
  `add-reminder` encima y se vuelve, THE SYSTEM SHALL conservar montada la misma
  instancia de `reminders`; y IF la sesión termina con cualquiera de las dos en la
  pila THEN THE SYSTEM SHALL acabar en `/login` con la pila `["(auth)"]`, sin que
  un `push` posterior a `/reminders` o `/alerts` añada entradas.

  *Test*: `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`,
  `describe('#114 R2: reminders y alerts se apilan y desapilan sobre (tabs)')`,
  **un solo `it`** ([[design]] D8). Rojo real en `a833f153`: tras el push la pila
  sigue en `["(tabs)"]` (sonda S1).

### R3 — El toque de notificación no apila una segunda `(tabs)` ni una segunda Alertas

- **R3**: WHEN llega una respuesta de notificación con sesión autenticada
  (listener de `use-push-registration`) THE SYSTEM SHALL apilar `alerts` en la
  pila raíz **encima de la entrada actual**, sin crear otra `(tabs)`; WHILE
  `alerts` ya está en la pila, WHEN llega otra respuesta, THE SYSTEM SHALL
  reutilizar esa entrada (la pila no crece y la pantalla no se vuelve a montar);
  y WHEN la app arranca en frío con una respuesta pendiente
  (`getLastNotificationResponseAsync`) THE SYSTEM SHALL terminar con la pila
  `["(tabs)", "alerts"]`, de modo que volver lleve a `/home` y ahí
  `router.canGoBack()` sea `false`.

  `src/hooks/use-push-registration.ts` **no cambia**: sigue llamando a
  `router.push('/alerts')` en los dos caminos (#79 R10).
  *Test*: `src/app/__tests__/reminders-alerts-stack.notification.test.tsx`,
  `describe('#114 R3: el toque de notificación apila alerts una sola vez')`,
  **un solo `it`** con el hook real. Rojo real en `a833f153`: el arranque en frío
  termina en `/alerts` con la pila `["(tabs)"]` (sonda S3).

### R4 — Cabecera nativa con el look de #95

- **R4**: WHEN se presenta `reminders` o `alerts` THE SYSTEM SHALL mostrar la
  cabecera nativa con **exactamente** las opciones de #95 R4 (`headerShown:
  true`, `headerStyle: { backgroundColor: <token background> }`,
  `headerTintColor: <token foreground>`, `headerTitleStyle: { fontFamily:
  'Inter-Bold' }`, `headerShadowVisible: false`, sin clave `animation`) y
  `title` `t('reminders.reminders')` en `reminders` y `t('alerts.title')` en
  `alerts`.

  *Test*: `src/app/__tests__/layout.test.tsx`,
  `describe('#114 R4: reminders y alerts declaran su cabecera nativa')`, un caso
  por pantalla con `toEqual` exacto sobre `options`.

### R5 — El título sale del cuerpo

- **R5**: WHEN se renderiza `RemindersScreen`, tanto cargando como con filas,
  THE SYSTEM SHALL **no** pintar en el cuerpo el texto de `reminders.reminders`
  y SHALL pintar `reminders-add-link` dentro de una fila
  `testID="reminders-actions"` con `className="flex-row justify-end"`; y WHEN se
  renderiza `AlertsScreen`, tanto cargando como con filas, THE SYSTEM SHALL
  **no** pintar en el cuerpo el texto de `alerts.title`, y WHILE no hay error de
  acción SHALL pasar `ListHeaderComponent={null}` a `alerts-list`.

  *Tests*: `describe('#114 R5: el título vive en la cabecera nativa')` en
  `src/screens/reminders/index.test.tsx` y en `src/screens/alerts/index.test.tsx`,
  un `it` en cada uno que asevera la ausencia **en carga y otra vez tras esperar
  una fila cargada** (lección B1 de #95: ninguna ausencia se asevera solo en
  carga).

### R6 — Métricas bajo cabecera nativa (A11)

- **R6**: WHEN se renderiza `reminders` o `alerts` THE SYSTEM SHALL usar en el
  `contentContainerStyle` de su lista (`ScrollView` `screen-reminders`,
  `FlatList` `alerts-list`) exactamente
  `{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }`: sin
  `paddingTop: insets.top + 12` y sin `paddingBottom: insets.bottom + 96`, como
  fija la excepción A11 de #95 (`docs/conventions.md` §Dimensiones,
  `docs/ui-guidelines.md` §Decisiones fijas 6).

  *Tests*: las dos aserciones de métricas que ya existen pasan a `toEqual`
  exacto con el valor nuevo (`paddingBottom: 48` con el doble de insets
  `top: 40, bottom: 24`) y ganan el sufijo ` (#114 R6)` en el título de su `it`:
  `src/screens/reminders/index.test.tsx` ›
  `R5: reminders monta con métricas y estados` y
  `src/screens/alerts/index.test.tsx` ›
  `#78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas`
  ([[design]] D9).

### R7 — `add-reminder` sin mascota desapila hasta `reminders`

- **R7**: IF `AddReminderScreen` se monta con `selectedPetId === null` THEN THE
  SYSTEM SHALL llamar **una vez** a `router.dismissTo('/reminders')`, SHALL no
  llamar a `router.push` ni a `router.back`, SHALL no renderizar
  `screen-add-reminder`, y SHALL no usar `<Redirect>`; de modo que, entrando desde
  `reminders`, la pila vuelva a `["(tabs)", "reminders"]` con la misma instancia,
  y entrando desde otra pestaña, `add-reminder` quede sustituida por `reminders`.

  *Por qué*: `<Redirect>` es `router.replace` al ganar el foco
  (`node_modules/expo-router/build/link/Redirect.js`). Con `reminders` en la pila
  raíz, sustituye `add-reminder` por **otra** `reminders` encima de la primera
  (sonda S5). Es alcanzable: el enlace de Profile y el botón "Nuevo" se pintan
  sin mascota.
  *Test*: `src/screens/add-reminder/index.test.tsx`,
  `describe('#114 R7: sin mascota, add-reminder desapila hasta reminders')`. La
  premisa de plataforma (las dos pilas resultantes) la canda además el `it` de R2.

## Enmiendas a docs y a specs ajenas (gates propios)

- **A13 — lista de A11 en los docs.** En `docs/conventions.md` y en
  `docs/ui-guidelines.md`, dentro del párrafo de la excepción A11 de #95, Codex
  sustituye **literal** el fragmento `` `meal-schedule` y `pairing`— `` por:

  ```
  `meal-schedule`, `pairing`, `reminders` y `alerts` (estas dos por la enmienda A13 de #114, <fecha>)—
  ```

  con `<fecha>` = fecha del commit que firma la casilla A13. Se aplica **después**
  de la firma y **antes** del commit rojo de R6. Comprobación (sin test
  automático, como A11):
  `grep -c 'enmienda A13 de #114' docs/conventions.md docs/ui-guidelines.md` →
  `1` en cada uno.

- **A14 — specs ajenas que fijan las rutas bajo `(tabs)` y el `Redirect`.** Tres
  cláusulas aprobadas dejan de ser ciertas con R1 y R7:
  `specs/mobile-alerts-center/requirements.md` R5 (ruta
  `src/app/(tabs)/alerts.tsx` con import `'../../screens/alerts'`), y
  `specs/mobile-reminders/requirements.md` R8 (`<Redirect href="/reminders" />`
  sin mascota) y R10 (`src/app/(tabs)/reminders.tsx`; su `add-reminder.tsx` ya lo
  movió #95 sin enmendarla). Codex inserta, **después** de la firma de A14 y
  **antes** del primer commit rojo, justo antes de la línea `## Aprobación` de
  cada uno de esos dos ficheros:

  Para `specs/mobile-alerts-center/requirements.md`:

  ```
  ## Enmienda externa A14 — la escribe #114 (<fecha>)

  `mobile-reminders-alerts-to-stack` (#114) sube `alerts` al Stack raíz. **R5
  cambia solo en la ruta**: el fichero es `src/app/alerts.tsx`, hijo del
  `Stack.Protected` de `src/app/_layout.tsx`, con el mismo cuerpo salvo el import
  (`'../screens/alerts'`). Sigue sin ser pestaña: `TABS` y `(tabs)/_layout.tsx`
  no cambian. Su test sigue en `src/app/(tabs)/__tests__/alerts.test.tsx`, con el
  import `'../../alerts'`. Firma: casilla A14 de
  `specs/mobile-reminders-alerts-to-stack/requirements.md` §Aprobación.
  ```

  Para `specs/mobile-reminders/requirements.md`:

  ```
  ## Enmienda externa A14 — la escribe #114 (<fecha>)

  `mobile-reminders-alerts-to-stack` (#114) sube `reminders` al Stack raíz.
  (1) **R8**: sin mascota seleccionada, `AddReminderScreen` ya no renderiza
  `<Redirect href="/reminders" />`: llama una vez a
  `router.dismissTo('/reminders')` y no pinta el formulario (#114 R7). (2)
  **R10**: `reminders.tsx` vive en `src/app/reminders.tsx` (import
  `'../screens/reminders'`) y `add-reminder.tsx` en `src/app/add-reminder.tsx`
  desde #95. Las dos siguen siendo routes delgados. Firma: casilla A14 de
  `specs/mobile-reminders-alerts-to-stack/requirements.md` §Aprobación.
  ```

## Fuera de alcance

Clasificado viñeta a viñeta, con su premisa verificada contra `a833f153`.

**Delimitaciones — no son features, no se registran:**

- **`unstable_settings.anchor` / `initialRouteName`.** El arranque en frío por
  notificación ya deja `(tabs)` debajo (sonda S6), y un ancla también cargaría
  `(tabs)` bajo `reset-password` (#95, mismo motivo).
- **Navegar a la alerta concreta del payload (`data.alertId`)** es **#100**. Al
  implementarse, su pantalla nace dentro del mismo `Stack.Protected`, y el reset
  de `actionError` de #97 R4 en `alerts` vuelve a tener un camino que lo ejercite
  (D5).
- **`use-push-registration.ts`** no cambia (R3).
- **`FloatingTabBar` y `(tabs)/_layout.tsx`** no cambian. Las ramas de #91
  (`activeTabIndex < 0`) pierden su último disparador de producción; ver deuda.
- **El doble fetch al entrar** (`useQuery`/`useInfiniteQuery` con `staleTime: 0`
  al montar, más el `refetch` de `useFocusEffect` de #97 R7 y de
  `mobile-reminders` R6) ya ocurre hoy en la primera visita; con el Stack ocurre
  en cada una. No se optimiza aquí.
- **`contentInsetAdjustmentBehavior="automatic"`** se queda en las dos listas:
  no-op en Android, terreno de **#60 `mobile-ios-support`** (como en #95).
- **Animación propia**: ninguna; la de plataforma (carta §Animación).
- **Cambios en `backend-pet-tracker/`, `infra/`, `init.sh`, CI, `app.json` o
  `package.json`**: ninguno. Cero dependencias nuevas; no se regenera el dev
  build.

**Deuda candidata para el leader (sin id reservado):**

- **Ramas de #91 sin disparador.** Tras R1, `(tabs)` solo contiene las cinco
  rutas de `TABS`, así que la burbuja fuera de rango que arregló #91
  (`src/components/floating-tab-bar.tsx`, las ramas de `activeTabIndex < 0`) ya
  no tiene camino en producción; sus tests (`floating-tab-bar.test.tsx`
  `#91 R1`–`R5`) usan un estado sintético y siguen verdes. Retirarlas o
  conservarlas como defensa ante una ruta futura bajo `(tabs)` es decisión
  aparte (C7).
- **`<Redirect>` de "sin mascota" en `weight-log` (`/health`) y `meal-schedule`
  (`/food`).** Desde el Stack producen una segunda `(tabs)` (sonda S5 de #95).
  #95 los dio por inalcanzables; esta spec **no** lo reverifica. Si se alcanzan,
  el arreglo es el mismo de R7.
- **`routes()` y `rootStack()` copiados en cuatro ficheros de test** de
  `src/app/__tests__/`. Un helper compartido tendría que convivir con los
  `jest.mock` por fichero; no se hace aquí.

## Coordinación con Backend (#113) — candado del catálogo

**#113 `mobile-kcal-consumed-bar` mueve la constante del candado**
(`expect(englishKeys).toHaveLength(…)` en
`src/providers/__tests__/language-provider.test.tsx`, hoy `303`) a `304` con
`food.kcalConsumedOfTarget`, y toca `R6_FOOD` de `src/__tests__/ui-copy-table.ts`
y el `it` de `#65 R6` de `src/__tests__/ui-language.test.ts`. **#114 no toca el
catálogo ni ese fichero de test** (delta `0`) ni `R6_FOOD`; sí toca `R8_REMINDERS`
y `R12_ALERTS` de `ui-copy-table.ts` y los `it` de `#65 R8` y `#78 R12` de
`ui-language.test.ts` (D7). Quien mergee **segundo** recuenta sobre `main`
conservando la suma visible y los sumandos con su comentario de cada feature;
como #114 aporta `0` al catálogo, si #113 mergea antes #114 no recuenta nada.

## Verificación

- Comandos dirigidos **desde `mobile-pet-tracker/`** con `--runTestsByPath` o con
  los paréntesis escapados (`docs/conventions.md` §Filtros de jest); la lista
  exacta vive en [[tasks]]. Comprobar siempre que el número de suites que imprime
  jest coincide con el de ficheros pedidos.
- **Delta de cierre contra `a833f153`**: `+2` suites (los dos ficheros nuevos de
  `src/app/__tests__/`) y `+9` tests, con el reparto por fichero de [[design]] D8.
  Ninguna suite pasa de verde a roja.
- `rm -f .expo/types/router.d.ts; bunx tsc --noEmit` y `bunx expo lint` con
  **`exit=0` y salida vacía** (un import huérfano de `Redirect` solo imprime un
  `warn`).
- C8 (`CHECKPOINTS.md`): cero hex fuera de `src/theme/`, cero clases arbitrarias,
  cero `StyleSheet.create`, cero sombras legacy; métricas vía A11.
- `git grep -n "Redirect" -- mobile-pet-tracker/src/screens/add-reminder` vacío.
- `git diff a833f153 -- mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/hooks/use-push-registration.ts mobile-pet-tracker/src/components/floating-tab-bar.tsx 'mobile-pet-tracker/src/app/(tabs)/_layout.tsx'`
  vacío.

## Prueba de humo del humano (no delegable a IA)

Runtime: **dev build de Android**, nunca Expo Go. **No se regenera**: no entra
ningún módulo nativo; `dismissTo` y `dangerouslySingular` son JS de
`expo-router 57.0.14`, ya en el bundle. App en español.

**Precondiciones**

- Metro sirviendo el branch de #114 al dev build del teléfono.
- Para los pasos 6–8, el backend de tu LAN con `PUSH_ENABLED=true` y
  `NOTIFIER_ENABLED=true`, como en la prueba de humo de #79
  (`specs/mobile-push-registration/requirements.md` §Prueba de humo,
  precondiciones). Cada "disparar una notificación" es su **ruta alternativa
  determinista** (paso 5), en la máquina del backend:

  ```bash
  aws --endpoint-url http://localhost:4566 sqs send-message \
    --queue-url "$(aws --endpoint-url http://localhost:4566 sqs get-queue-url \
                     --queue-name notifications --query QueueUrl --output text)" \
    --message-body '{"version":1,"kind":"alert","alertId":"<uuid>","petId":"<petId>","title":"Smoke 114","body":"Prueba de toque","data":{"petId":"01a025c9-ca2b-7950-8385-f3abed7b1bd8","alertId":"03e68dec-5ef3-4a5b-ab1d-9356b5db1eb8"}}'
  ```

- `adb`: el teléfono sale **dos veces** en `adb devices -l` (IP y mDNS). En
  Windows, `adb devices -l | findstr 192.168` da la línea de la IP; usa
  **siempre** `adb -s <ip:puerto>` con ese valor.

**Pasos**

- [X] 1. Home → "Ver todos" (sección de recordatorios): Recordatorios **entra con
      la transición de plataforma**, bajo una cabecera nativa "Recordatorios" con
      flecha, **sin** la barra flotante. "Nuevo" sigue arriba a la derecha y no
      queda hueco entre la cabecera y el primer elemento. Al final de la lista,
      ~24 px sobre la barra del sistema, sin banda vacía. La flecha vuelve a Home.
- [X] 2. Profile → "Recordatorios": igual que 1; la flecha vuelve a **Profile**.
- [X] 3. Recordatorios → "Nuevo" → escribir un título → flecha: se vuelve a
      Recordatorios sin que parpadee la lista. "Nuevo" otra vez: formulario en
      blanco. Guardar uno: vuelve a Recordatorios y aparece.
- [X] 4. Home → campana: "Alertas" con cabecera nativa y sin barra; la flecha
      vuelve a Home. En 1, 2 y 4, el **gesto o botón atrás del sistema** hace lo
      mismo que la flecha.
- [X] 5. Tema oscuro (Profile): las dos cabeceras toman fondo y texto del tema,
      sin franja blanca. En inglés, los títulos son "Reminders" y "Alerts".
- [X] 6. **Toque en caliente**: Recordatorios → "Nuevo", escribir un título;
      disparar una notificación y tocar el banner → Alertas **encima**. Atrás →
      "Agregar recordatorio" **con el título aún escrito**; atrás →
      Recordatorios; atrás → Home. La barra flotante no aparece en ningún paso
      intermedio.
- [X] 7. **Toque estando en Alertas**: con Alertas abierta, disparar otra y
      tocarla → sigue en Alertas; **un** atrás sale de Alertas (no hay otra debajo).
- [X] 8. **Toque en frío**: `adb -s <ip:puerto> shell am force-stop com.trackermex.pettracker`;
      disparar una notificación y tocarla en la bandeja → la app abre y queda en
      Alertas con flecha. Atrás → Home **con** la barra; un segundo atrás sale de
      la app.
- [X] 9. (Solo si hay una cuenta **sin mascotas**.) Profile → Recordatorios →
      "Nuevo" → vuelve solo a Recordatorios; **un** atrás → Profile.

- [X] Prueba de humo superada (fecha: 2026-09-23)

## Aprobación

> Cinco casillas, cinco gates (lección `gate-humano-sin-casilla-donde-firmar`).
> P1 decide si la spec vale; A13 y A14 autorizan cambiar texto normativo ajeno;
> la de la spec autoriza implementar; la de §Prueba de humo cierra la feature.

### P1 — Decisión de producto (marcar exactamente una)

- [x] A — mover `reminders` y `alerts` (esta spec)
- [ ] B — solo `reminders` (la spec se reescribe antes de aprobarla)
- [ ] C — ninguna (la feature se cierra sin código)

Firmado por humano (fecha: 2026-09-23)

### Enmienda A13 — lista de A11 en `docs/conventions.md` y `docs/ui-guidelines.md`

- [x] Enmienda A13 aprobada por humano (fecha: 2026-09-23)

### Enmienda A14 — `mobile-alerts-center` R5 y `mobile-reminders` R8 y R10

- [x] Enmienda A14 aprobada por humano (fecha: 2026-09-23)

### Aprobación de la spec

- [x] Aprobado por humano (fecha: 2026-09-23) ← gate obligatorio antes de implementar
