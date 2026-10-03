---
feature: "mobile-detail-screens-to-stack"
status: approved       # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-detail-screens-to-stack]] (#95)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D10), las sondas que las
> sostienen (§1) y el inventario de aserciones heredadas que cambian (D10), y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil.
>
> **Commit base de toda medición**: `2be1b023` (`origin/main`, merge de PR #153).
> En esa base: **77 suites, 1412 tests, verde** (`bunx jest --silent` desde
> `mobile-pet-tracker/`, medido por el spec_author el 2026-09-23), y
> `mobile-pet-tracker/.expo/types/router.d.ts` **no existe** en este worktree.
> Ningún requisito congela recuentos absolutos: se declara el **delta** contra la
> base (§Verificación). Si la base se mueve, manda el delta.
>
> **Todo `describe` nuevo lleva el prefijo `#95 R<n>:`** (`docs/conventions.md`
> §Prefijo de feature, `cd1e3205`): los ficheros que se tocan ya contienen R-ids
> de otras specs. La cita es siempre `#95 R<n>`, nunca `#95` suelto (contrato con
> `src/__tests__/design-drift.test.ts`, #108).

## Contexto en una línea

Las seis pantallas de detalle viven hoy bajo `src/app/(tabs)/`, así que son
pestañas ocultas: `router.push` las muestra con el **fundido de pestaña**
(`animation: 'fade'`, #mobile-tab-glass R6, `3da2d36a`), no con push/pop de
plataforma; se salen con seis botones de volver dibujados a mano; y su estado
sobrevive a la salida, que #63 parcheó con un reset en el blur. Esta feature las
saca al **Stack raíz** que ya monta `src/app/_layout.tsx`.

## Qué firma el humano al aprobar esta spec

Hay **cuatro** casillas y no se comparten (§Aprobación). La firma de la spec
ratifica además estas decisiones, que se apartan de la letra de la entrada de
`feature_list.json` o cambian conducta visible:

1. **Alcance: las seis pantallas y ninguna más.** `reminders` y `alerts` también
   son rutas no-pestaña bajo `(tabs)` que solo se alcanzan por `router.push`,
   pero se quedan donde están (§Fuera de alcance; [[design]] §0 E6).
2. **La guarda de las seis es `Stack.Protected` en el layout raíz; el `Redirect`
   de `(tabs)/_layout.tsx` se queda donde está** ([[design]] D2). La entrada
   decía "subir el Redirect"; subirlo tal cual lo pondría sobre `(auth)` y
   `reset-password`, que es justo lo que su criterio 2 prohíbe.
3. **`SelectedPetProvider` sube al layout raíz y su selección pasa a pertenecer
   a la sesión** (R1): al cerrar sesión la mascota elegida se olvida, como hoy
   (hoy se olvida porque el provider se desmonta con `(tabs)`).
4. **Cero claves de copy nuevas.** Cuatro títulos de cabecera reutilizan la
   clave que ya titulaba su pantalla; `docs` y `pairing` llevan cabecera **sin
   título** y conservan su encabezado en el cuerpo ([[design]] D3). Se
   **retiran** seis claves, las de los botones de volver: el catálogo queda en
   su suma actual **− 6** por idioma.
5. **La flecha de volver es la nativa.** Su nombre accesible lo pone Android en
   el **idioma del sistema**, no en el de la app, y su objetivo táctil (48 dp)
   lo garantiza la plataforma; eso jubila las aserciones de `TOUCH_SLOP` de
   #61 R10 sobre los botones de volver.
6. **Excepción de métricas A11** para pantallas bajo cabecera nativa (R6).
7. **Se retira el reset en blur de #63** de las cinco pantallas que lo llevaban
   (R7). El propósito de #63 R7 (no poder disparar un segundo POST al volver)
   queda debilitado en un caso límite aceptado: pulsar volver **durante** un
   envío en vuelo, reentrar y reenviar ([[design]] D6).
8. **Tocar una notificación estando en una pantalla de detalle** apila el centro
   de alertas encima, en una segunda instancia de `(tabs)`, hasta que #100
   cambie el destino del toque ([[design]] D7, sonda S1).

## Requisitos funcionales

### R1 — La mascota seleccionada pertenece a la sesión

- **R1**: WHILE `SelectedPetProvider` está montado, WHEN el `token` que expone
  `useAuth()` cambia de valor (cierre de sesión → `null`, o un inicio de sesión
  nuevo) THE SYSTEM SHALL exponer `selectedPetId = null` hasta la siguiente
  llamada a `selectPet`, sin resucitar la selección de un token anterior aunque
  ese token vuelva.

  *Por qué*: R2 sube el provider al layout raíz, por encima de `(auth)`. Sin R1
  la selección del usuario A sobreviviría al login del usuario B, y la Home
  pediría el detalle de una mascota ajena antes de que `usePetSelection` la
  corrigiera.
  *Test*: `src/providers/__tests__/selected-pet-provider.test.tsx`,
  `describe('#95 R1: la selección pertenece a la sesión')`.

### R2 — Las seis pantallas se apilan sobre `(tabs)` en el Stack raíz

- **R2**: WHEN el usuario autenticado hace `router.push` a `/add-reminder`,
  `/pets/add`, `/pets/<petId>/docs`, `/weight-log`, `/meal-schedule` o
  `/pairing` desde una pantalla de `(tabs)` THE SYSTEM SHALL apilar la ruta como
  **segunda entrada del Stack raíz**, encima de una única entrada `(tabs)`; y
  WHEN el usuario vuelve atrás THE SYSTEM SHALL desapilarla y **desmontarla**, de
  modo que la siguiente entrada monte una instancia nueva.

  Se cumple con cuatro cambios, cerrados en [[design]] D1–D2:
  1. Los seis ficheros de ruta se mueven con `git mv` sin cambiar de contenido
     salvo la ruta relativa de su import: `src/app/add-reminder.tsx`,
     `src/app/pets/add.tsx`, `src/app/pets/[petId]/docs.tsx`,
     `src/app/weight-log.tsx`, `src/app/meal-schedule.tsx` y
     `src/app/pairing.tsx`. Las URL no cambian, y **ningún** `router.push`,
     `Redirect` ni `href` del código cambia por el movimiento (inventario en
     [[design]] D1).
  2. `src/app/(tabs)/` queda con **exactamente** `_layout.tsx`, `alerts.tsx`,
     `food.tsx`, `health.tsx`, `home.tsx`, `map.tsx`, `profile.tsx`,
     `reminders.tsx` y la carpeta `__tests__/`.
  3. `SelectedPetProvider` sale de `src/app/(tabs)/_layout.tsx` y se monta en
     `src/app/_layout.tsx` dentro de `QueryProvider`, envolviendo a
     `PushRegistration` y a un componente nuevo, `RootStack`.
  4. `RootStack` declara, en este orden, `Stack.Screen` `index`, `(tabs)`,
     `(auth)` y `reset-password` sin opciones, y después un
     `Stack.Protected guard={status === 'authenticated'}` con los seis
     `Stack.Screen` de detalle en el orden del punto 1.

  *Tests*: `src/app/__tests__/detail-stack.test.tsx`
  (`describe('#95 R2: las seis rutas de detalle viven en la raíz de src/app')`),
  `src/app/__tests__/detail-stack.navigation.test.tsx`
  (`describe('#95 R2: push y back apilan y desapilan sobre (tabs)')`) y
  `src/app/__tests__/layout.test.tsx`
  (`describe('#95 R2: el layout raíz monta el provider y el Stack de detalle')`).
  Rojo real en `2be1b023`, medido con la sonda S3 de [[design]] §1: hoy la pila
  raíz se queda en `["(tabs)"]` tras el push y `add-reminder` monta una sola vez.

### R3 — Las seis siguen protegidas, y `(auth)` y `reset-password` no

- **R3**: IF la sesión deja de estar autenticada mientras una de las seis está
  en pantalla THEN THE SYSTEM SHALL terminar en `/login` con la pila raíz
  reducida a `["(auth)"]`; WHILE la sesión no está autenticada, WHEN se hace
  `router.push` a cualquiera de las seis THE SYSTEM SHALL permanecer en `/login`
  **sin añadir ninguna entrada** a la pila raíz; y THE SYSTEM SHALL seguir
  mostrando `/reset-password` (deep link de #59) y las rutas de `(auth)` sin
  sesión.

  *Test*: `src/app/__tests__/detail-stack.guard.test.tsx`,
  `describe('#95 R3: la guarda protege las seis y deja libres (auth) y reset-password')`.
  Rojo real en `2be1b023`: con la guarda heredada de `(tabs)`, cada push sin
  sesión **añade** una entrada `(auth)` a la pila raíz (sonda S4). R2 y R3
  comparten el commit verde.

### R4 — Cabecera nativa en las seis, con el look de la app

- **R4**: WHEN se presenta cualquiera de las seis pantallas THE SYSTEM SHALL
  mostrar la cabecera nativa del Stack con exactamente estas opciones:
  `headerShown: true`, `title` según la tabla, `headerStyle: { backgroundColor:
  <token background> }` y `headerTintColor: <token foreground>` (los dos vía
  `useThemeColors`), `headerTitleStyle: { fontFamily: 'Inter-Bold' }`,
  `headerShadowVisible: false`, y **sin** clave `animation` (la transición es la
  de plataforma que da `react-native-screens` por defecto).

  | `Stack.Screen name` | `title` |
  |---|---|
  | `add-reminder` | `t('addReminder.addReminder')` |
  | `pets/add` | `t('addPet.addPet')` |
  | `pets/[petId]/docs` | `''` |
  | `weight-log` | `t('weightLog.weightLog')` |
  | `meal-schedule` | `t('mealSchedule.mealSchedule')` |
  | `pairing` | `''` |

  *Test*: `src/app/__tests__/layout.test.tsx`,
  `describe('#95 R4: cada pantalla de detalle declara su cabecera nativa')`, un
  caso por pantalla con `toEqual` exacto sobre `options`: cruzar dos títulos o
  añadir cualquier clave (una `animation`, por ejemplo) pone la suite roja.

### R5 — Desaparece la cabecera dibujada a mano

- **R5**: WHEN se renderiza cualquiera de las seis pantallas THE SYSTEM SHALL
  **no** renderizar su botón de volver propio (ningún nodo con `testID`
  `add-reminder-back`, `add-pet-back`, `docs-back`, `weight-log-back`,
  `meal-schedule-back` ni `pairing-back`) y, en `add-reminder`, `add-pet`,
  `weight-log` y `meal-schedule`, **no** renderizar en el cuerpo el texto de su
  título, que ahora pinta la cabecera (R4). Y THE SYSTEM SHALL no contener en
  `src/i18n/catalog.ts`, en ningún idioma, las claves
  `addReminder.backToReminders`, `addPet.backToProfile`, `docs.backToProfile`,
  `weightLog.backToHealth`, `mealSchedule.backToFood` ni `pairing.back`.

  `docs` conserva su bloque "Documentos de / <mascota>" con su
  `docs-header-skeleton`, y `pairing` sus encabezados de estado ([[design]] D3).
  *Tests*: un `describe('#95 R5: la pantalla no dibuja cabecera propia')` en cada
  uno de los seis `src/screens/<x>/index.test.tsx`, más un caso `#95 R5` en
  `src/providers/__tests__/language-provider.test.tsx` para la ausencia de las
  seis claves.

### R6 — Métricas de pantalla bajo cabecera nativa (enmienda A11)

- **R6**: WHEN se renderiza cualquiera de las seis pantallas THE SYSTEM SHALL
  usar en el `contentContainerStyle` de su `ScrollView` exactamente
  `{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }`: sin
  `paddingTop: insets.top + 12`, porque el inset superior lo consume la cabecera
  nativa, y sin `paddingBottom: insets.bottom + 96`, porque ya no flota encima
  el `FloatingTabBar`; de modo que no quede banda muerta ni arriba ni abajo.

  `+ 24` es la holgura inferior que ya usan `(auth)/login.tsx`,
  `(auth)/forgot.tsx` y `reset-password`. La regla general de
  `docs/conventions.md` §Dimensiones (`0728fcc3`) y de `docs/ui-guidelines.md`
  §Decisiones fijas 6 **no cambia**; se añade la excepción nombrada A11, cuyo
  texto normativo es este. Codex lo inserta **literal**, como párrafo propio,
  justo después de la frase que cierra la excepción A9 de #67 en cada documento
  (la que termina en «llevan su propio envoltorio con ese paddingTop.»), con
  `<fecha>` = fecha del commit que firma la casilla A11:

  ```
  **Excepción nombrada (enmienda A11 de #95, <fecha>)**: una pantalla empujada
  sobre el Stack raíz con cabecera nativa (`headerShown: true`) —hoy
  `add-reminder`, `pets/add`, `pets/[petId]/docs`, `weight-log`,
  `meal-schedule` y `pairing`— no lleva `paddingTop: insets.top + 12`, porque
  el inset superior lo consume la cabecera, ni `paddingBottom: insets.bottom +
  96`, porque sobre ella no flota el `FloatingTabBar`. Su
  `contentContainerStyle` es `padding: 24`, `gap: 16` y `paddingBottom:
  insets.bottom + 24`, la misma holgura inferior que `(auth)` y
  `reset-password`.
  ```

  *Tests*: `describe('#95 R6: métricas bajo cabecera nativa')` nuevo en
  `src/screens/docs/index.test.tsx` y en `src/screens/add-pet/index.test.tsx`,
  que hoy no asertan métricas; las aserciones de métricas que ya existen en
  `add-reminder`, `weight-log`, `meal-schedule` y `pairing` pasan a `toEqual`
  exacto con el valor nuevo y sufijo ` (#95 R6)` en el título de su `it`; y en
  `src/__tests__/design-drift.test.ts` el
  `describe('R11 (mobile-device-pairing): …')` cambia sus métricas y gana un
  `it('#95 R6: …')` ([[design]] D10).
  *Comprobación de A11* (sin test automático, como #102 R1):
  `grep -c 'enmienda A11 de #95' docs/conventions.md docs/ui-guidelines.md` → `1`
  en cada uno; y los marcadores de A9 (#67) y A10 (#102) siguen presentes byte a
  byte, cosa que ya vigila `src/__tests__/hero-header-amendments.test.ts`.

### R7 — Se retira el reset en blur de #63 (C7)

- **R7**: THE SYSTEM SHALL no registrar ningún `useFocusEffect` en
  `src/screens/add-reminder/index.tsx`, `src/screens/add-pet/index.tsx`,
  `src/screens/weight-log/index.tsx` ni `src/screens/meal-schedule/index.tsx`, y
  SHALL registrar exactamente **dos** en `src/screens/pairing/index.tsx` (los
  de refetch de mascotas y de tracking), conservando en `pairing` el reset al
  cambiar de mascota de #63 R6 (el `useEffect` con deps
  `[resetPairingState, selectedPetId]`).

  *Por qué*: con R2, perder el foco en estas pantallas **es** desmontarlas. El
  reset de #63 R1–R5 queda redundante y su invariante —reentrar muestra el
  formulario en blanco— lo pasa a garantizar la estructura, candada en R2 por el
  montaje nuevo al reentrar. #63 R6 no es de navegación y se queda. Ninguna
  pantalla cubierta por #63 R1–R7 sigue bajo `(tabs)`, así que el criterio 5 de
  la entrada ("sin que R1–R7 de #63 dejen de cumplirse en las que sigan bajo
  (tabs)") es vacuo: no queda ninguna.
  *Test*: `src/app/__tests__/detail-stack.test.tsx`,
  `describe('#95 R7: el reset de #63 queda solo donde no lo cubre el Stack')`,
  un caso por fichero. Los tests de #63 R1–R5 y R7 se borran (lista en
  [[design]] D10).

### R8 — "Ver en el mapa" desapila `pairing` en vez de duplicar `(tabs)`

- **R8**: WHEN el usuario pulsa `ready-map` en la vista `ready` de `pairing`
  THE SYSTEM SHALL llamar a `router.dismissTo('/map')` una sola vez y **no**
  llamar a `router.push`, de modo que la pila raíz quede con una única entrada
  `(tabs)` enfocada en `map`.

  *Por qué*: desde una pantalla del Stack, `router.push('/map')` apila una
  **segunda** instancia de `(tabs)` (sonda S1); `dismissTo` desapila hasta la que
  ya existe y le cambia la pestaña (sonda S2). Enmienda el `router.push('/map')`
  de #42 R7 (enmienda A12).
  *Test*: `src/screens/pairing/index.test.tsx`,
  `describe('#95 R8: ver en el mapa desapila pairing')`. La premisa de
  plataforma (una sola `(tabs)` tras `dismissTo`) la canda además el `it` de R2.

## Enmiendas a specs ajenas y a docs (gates propios)

- **A11** — excepción de métricas en `docs/conventions.md` y
  `docs/ui-guidelines.md`. Texto literal en R6. Codex la aplica **después** de
  que el humano firme su casilla y **antes** del commit rojo de R6.
- **A12** — revierte D4 de `specs/mobile-device-pairing/design.md` y enmienda la
  parte de sus R4, R7 y R11 que fijaba la ruta bajo `(tabs)`, el botón
  `pairing-back`, las métricas y `router.push('/map')`. **Ya está escrita** en
  `specs/mobile-device-pairing/design.md` §Enmienda #95, con su propia casilla
  sin marcar. Mientras no se firme, ningún requisito puede tocar `pairing`.

## Fuera de alcance

Clasificado viñeta a viñeta, con su premisa verificada contra `2be1b023`.

**Delimitaciones — no son features, no se registran:**

- **Migrar `map.tsx` a `src/screens/`.** #94 lo dejó apuntado a #95, pero **ya lo
  hizo #102**: `b5562651` (`refactor(mobile): mueve map a src/screens/map (R2,
  rojo)`), mergeado en `fadd0de7` (PR #145). `src/app/(tabs)/map.tsx` es hoy un
  route delgado de cinco líneas. Cerrado; no se reabre.
- **`food.tsx` sigue con el cuerpo en el route.** Es pestaña, no pantalla de
  detalle, y #102 lo dejó fuera a propósito. Esta feature solo depende de su
  `router.push('/meal-schedule' as Href)`, que no cambia.
- **Animación propia de entrada o salida.** La carta (§Animación) no prescribe
  ninguna para navegación: se usa la de plataforma. M3 de
  `progress/audit_animations_mobile.md` (el `FadeIn` de 180 ms) **se descarta**;
  el propio audit decía que la solución de fondo era el Stack.
- **Los `Redirect` de "sin mascota seleccionada"** de `add-reminder`
  (`/reminders`), `weight-log` (`/health`) y `meal-schedule` (`/food`) no se
  tocan. Desde el Stack producirían una segunda `(tabs)` (sonda S5), pero dentro
  de la app no se alcanzan: las seis se abren solo desde pantallas que ya tienen
  mascota seleccionada, y R1 solo vacía la selección al cerrar sesión, que a su
  vez retira las seis de la pila (R3).
- **`unstable_settings.anchor`** en el layout raíz, para que un deep link en frío
  a una pantalla de detalle cargue `(tabs)` debajo. No hay deep links de producto
  a estas rutas (el único es `reset-password`, #59), y un ancla cargaría `(tabs)`
  también bajo `reset-password`.
- **`contentInsetAdjustmentBehavior="automatic"`** se queda en los seis
  `ScrollView`. Es no-op en Android; en iOS, con cabecera opaca, podría sumar el
  inset inferior dos veces. Es terreno de **#60 `mobile-ios-support`**.
- **Estilo de la barra de estado** frente al tema elegido dentro de la app: es
  preexistente y común a todas las pantallas; no lo introduce la cabecera.
- **#100 `mobile-alert-detail-screen`** no entra. Cuando se implemente, su
  pantalla debe nacer como un `Stack.Screen` más dentro del `Stack.Protected` de
  `RootStack`, no bajo `(tabs)`.
- **Cambios en `backend-pet-tracker/`, `infra/`, `init.sh` o CI.** Ninguno.

**Deuda candidata para el leader (sin id reservado; el siguiente libre es 114):**

- **`reminders` y `alerts` al Stack.** Son rutas no-pestaña bajo `(tabs)` que
  solo se alcanzan por `router.push` (desde `home`, `profile` y
  `use-push-registration`). No tienen botón de volver: hoy se salen por la barra
  de pestañas. Moverlas cambia su UX (pierden la barra, ganan cabecera) y **no**
  está en el enunciado firmado. La auditoría de #63 ya anotó que `reminders`
  arrastra `deleteCandidate` al volver.
- **Ejemplo caducado en `docs/conventions.md` §Filtros de jest** (`cd1e3205`):
  usa `src/app/(tabs)/__tests__/weight-log`, un fichero que no existe desde #102.
  La regla sigue siendo cierta; el ejemplo no. Es un cambio de doc de una línea,
  no una feature.
- **`feature_list.json` #103 `meal-schedule-editing`** da
  `src/app/(tabs)/meal-schedule.tsx (324 lineas)` como cuerpo de la pantalla. Es
  falso desde #102 (el cuerpo vive en `src/screens/meal-schedule/index.tsx`) y
  tras esta feature el route pasa a `src/app/meal-schedule.tsx`.

## Verificación

- Comandos dirigidos **desde `mobile-pet-tracker/` y con los paréntesis
  escapados** (`docs/conventions.md` §Filtros de jest): la lista exacta vive en
  [[tasks]] §Cierre. Comprobar siempre que el número de suites que imprime jest
  coincide con el de ficheros pedidos.
- **Delta de cierre contra `2be1b023`**: `+3` suites (los tres ficheros nuevos
  `src/app/__tests__/detail-stack*.test.tsx`) y `+14` tests, con el reparto por
  fichero de [[design]] D9. Ninguna suite pasa de verde a roja.
- `bunx tsc --noEmit` y `bunx expo lint` con **exit 0 y salida vacía**, tras
  `rm -f .expo/types/router.d.ts`. Las dos salen vacías en `2be1b023` (medido).
  La salida vacía importa: `@typescript-eslint/no-unused-vars` es `warn` en
  `eslint-config-expo`, así que un import huérfano de R5/R7 no rompe el exit
  code pero sí imprime una línea.
- C8 de `CHECKPOINTS.md`: cero hex nuevos fuera de `src/theme/`, cero clases
  arbitrarias, cero `StyleSheet.create`, cero sombras legacy.
  `headerShadowVisible: false` **quita** la elevación de la cabecera; no añade
  ninguna. Las métricas cumplen C8 vía la excepción A11.
- C7: `grep -rn "useFocusEffect" src/screens/{add-reminder,add-pet,weight-log,meal-schedule}`
  vacío; `grep -rn "ArrowLeft" src/screens/{add-reminder,add-pet,docs,weight-log,meal-schedule,pairing}`
  vacío; ninguna de las seis claves retiradas aparece en `src/`.

## Prueba de humo del humano (no delegable a IA)

Runtime: **dev build de Android**, nunca Expo Go. **No hace falta regenerar el
dev build**: no entra ningún módulo nativo (`react-native-screens` `4.26.2` ya
está instalado y enlazado; [[design]] §Entorno). App en español.

- [X] 1. Profile → "Añadir mascota": la pantalla **entra con la transición de
      plataforma**, no con el fundido de pestaña, bajo una cabecera nativa
      titulada "Nueva mascota", con flecha de volver y **sin** la barra de
      pestañas flotante. Bajar hasta el final: "Guardar mascota" queda a unos
      24 px de la barra de navegación del sistema, **sin banda vacía**. La
      flecha vuelve a Profile con la transición de salida.
- [X] 2. Repetir el paso 1 con las otras cinco: Recordatorios → "Nuevo";
      Profile → "Documentos" de una mascota (cabecera sin título, "Documentos
      de / <nombre>" al principio del cuerpo); Salud → "Registro de peso";
      Nutrición → "Horario de comidas"; Profile → "Configuración del
      Dispositivo GPS" (cabecera sin título). En ninguna queda hueco entre la
      cabecera y el primer elemento.
- [X] 3. En cualquiera de las seis, el **gesto o botón atrás del sistema** hace
      lo mismo que la flecha.
- [X] 4. Con tema oscuro (Profile), la cabecera de las seis toma el fondo y el
      color de texto del tema, sin franja blanca. Volver a claro: idem.
- [X] 5. Cambiar a inglés: los cuatro títulos pasan a "Add reminder", "Add pet",
      "Weight log" y "Meal schedule".
- [X] 6. Reentrada en blanco (los pasos 1–3 de #63, ahora por estructura):
      escribir medio recordatorio, salir con la flecha y volver a entrar → vacío,
      con `vaccine` seleccionado, 09:00 y antelación de 7 días.
- [X] 7. En `pairing`, con un collar recién vinculado, "Ver en el mapa" abre Map,
      y el botón atrás **no** vuelve a `pairing`.
- [X] 8. Con la sesión cerrada, `adb shell am start -a android.intent.action.VIEW
      -d "mobilepettracker://reset-password?token=abc"`: aparece la pantalla de
      restablecer contraseña, **no** el login.
- [X] 9. (Solo si hay dos cuentas.) Cerrar sesión con la cuenta A y entrar con B:
      la Home muestra la mascota de B sin pasar por un error.

- [X] Prueba de humo superada (fecha: 2026-09-23)

## Aprobación

> Cuatro casillas, cuatro gates (lección `gate-humano-sin-casilla-donde-firmar`).
> A11 y A12 autorizan cambiar texto normativo ajeno; la spec autoriza
> implementar; la casilla de §Prueba de humo cierra la feature.

### Enmienda A11 — métricas bajo cabecera nativa (`docs/conventions.md`, `docs/ui-guidelines.md`)

- [x] Enmienda A11 aprobada por humano (fecha: 2026-09-23)

### Enmienda A12 — reversión de D4 de `mobile-device-pairing`

La casilla normativa vive en `specs/mobile-device-pairing/design.md`
§Enmienda #95; esta es su espejo, para que se vea desde aquí que existe.

- [x] Enmienda A12 aprobada por humano (fecha: 2026-09-23)

### Aprobación de la spec

- [x] Aprobado por humano (fecha: 2026-09-23) ← gate obligatorio antes de implementar
