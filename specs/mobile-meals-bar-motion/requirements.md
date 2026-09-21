---
feature: "mobile-meals-bar-motion"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-meals-bar-motion]] (#106 + #107)

> Notación EARS. Cada requisito lleva su id `R<n>` y **la entrada del
> `feature_list.json` a la que pertenece**, para que el cierre pueda marcar
> #106 y #107 por separado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden TDD y
> [[../../docs/ui-guidelines|ui-guidelines]] (gate **C8**) para la carta de UI
> que rige esta feature.

## Por qué una sola spec para dos features

Decisión del humano (2026-09-21): #106 y #107 tocan la misma pantalla de
comidas y el mismo `Pressable`, y #107 sola son dos aserciones que no
justifican su propio gate. Se especifican juntas, se implementan en el mismo
ciclo y **se cierran como dos entradas** del `feature_list.json`:

| Entrada | R-ids | Fichero de producción |
|---|---|---|
| **#106** `mobile-meals-bar-motion` | R1, R2, R3, R4 | `src/screens/home/index.tsx`, `src/app/(tabs)/food.tsx` |
| **#107** `mobile-meal-toggle-press-lock` | R5 | `src/app/(tabs)/food.tsx` (sin diff neto) |

Rutas relativas a `mobile-pet-tracker/` salvo donde se indique.
Base de la branch: `feature/106-mobile-meals-bar-motion`, cortada de `main` en
`9df7b5bc` (merge del PR #144, que cerró #98).

---

## Qué firma el humano al aprobar esta spec

Tres cosas que **no** son requisitos técnicos y que nadie más puede autorizar:

1. **Se instala `expo-haptics`, dependencia nueva** (R1). El veto vivo sobre
   dependencias es nominal a `expo-linear-gradient`, no genérico; el humano lo
   autorizó el 2026-09-21. Se instala con `bunx expo install expo-haptics`
   (nunca `npx`, nunca `npm i -g`, nunca una versión escrita a mano).
2. **Se enmienda `docs/ui-guidelines.md:171`** (R1). Hoy dice literalmente
   «expo-haptics NO está instalado; toda propuesta que lo requiera lo declara
   como dependencia nueva en su spec». En cuanto Codex instale el paquete esa
   línea miente, y la carta es el gate C8. La redacción exacta de la enmienda
   está en R1; firmarla es parte de firmar esta spec.
3. **El dev build de Android que el humano tiene instalado hoy queda
   obsoleto.** `expo-haptics` es un módulo nativo: no entra por OTA ni por
   recarga de Metro. Antes de la prueba de humo hay que **regenerar el dev
   build de Android** (`bunx expo run:android`, o el build de EAS que se use
   normalmente). Sin ese paso, R4 no se puede probar en el dispositivo y el
   `Haptics.notificationAsync` fallará o será un no-op silencioso.

---

## Las siete preguntas de la Home (carta §Dirección de arte 3)

Obligatorio declararlo en toda spec que toque la Home. Esta feature **no
responde ninguna pregunta nueva** y no cambia ninguna respuesta: solo cambia
**cómo llega a la pantalla** un dato que #98 ya pinta.

| Pregunta | ¿La cambia esta feature? |
|---|---|
| ¿Está segura? | No — hero (#67) y modo perdido |
| ¿Dónde está? | No — `last-position-card` |
| ¿El collar está conectado? | No — `collar-card` (#68, #73) |
| ¿Tiene batería? | No — `collar-card` |
| ¿Tiene algún recordatorio pendiente? | No — la sección de recordatorios sigue igual |
| ¿Cómo fue su actividad hoy? | No — `weekly-activity-card` (#68, #69) |
| ¿Hay alguna alerta? | No — la campana (#78) |
| ¿Ha comido hoy? (la añadió #98) | **Mismo dato, misma copy, mismo `served/total`.** Lo único que cambia es que el relleno **transiciona** en vez de saltar |

---

## Premisas verificadas contra el árbol (y las que resultaron falsas)

Todo lo de abajo se abrió y se leyó en el commit base `9df7b5bc`. Se declara
porque en #98 tres afirmaciones de una sección §Fuera de alcance eran falsas y
una llegó hasta la carta de UI.

**Ciertas:**

- `src/screens/home/index.tsx:709` es `testID="reminders-meals-track"`, `:713`
  es `testID="reminders-meals-fill"` y `:715` es
  `` style={{ width: `${mealsPct}%` }} ``.
- `src/app/(tabs)/food.tsx:253-255` es el `style` de `pressed`, en **tres
  líneas**.
- Los ocho usos de `meal-toggle-0` en
  `src/app/(tabs)/__tests__/food.test.tsx` (`:479`, `:511`, `:544`, `:552`,
  `:573`, `:586`, `:602`, `:612`) son `findByTestId`, `toBeDisabled` y
  `fireEvent.press`. **Ninguno mira el `style`.**
- `grep -rn 'props\.style(' src/` devuelve **cero**: aseverar `props.style`
  como función no tiene precedente en este repo.
- `react-native-reanimated` 4.5.1 y `react-native-worklets` 0.10.1 ya están
  instalados (`package.json`). Animar la barra **no** necesita dependencia
  nueva; solo el haptic la necesita.
- No existe `babel.config.js` ni ningún `.babelrc*` en `mobile-pet-tracker/`, y
  **es correcto así** (ver R1 y [[design]] §2).

**Falsas, corregidas aquí:**

- **«el mismo `Pressable` lleva `className` que procesa NativeWind».**
  NativeWind **no está en este proyecto**: no aparece en `package.json` ni en
  `bun.lock`. El procesador de `className` es **uniwind `^1.11.0`**. El riesgo
  que la frase describía sí existía y se midió (ver el punto siguiente); la
  librería estaba mal nombrada.
- **«`toggle.props.style({ pressed: true })` es el camino preferido».** Medido
  contra el árbol renderizado: para un `Pressable` con `style` de función,
  `element.props.style` llega **ya resuelto** como objeto (`{ opacity: 1 }`),
  no como función, y `fireEvent(el, 'pressIn')` **no** lo cambia. El camino A
  del handoff `progress/handoff_98_rebote_meal-toggle.md` es **inviable**; R5
  usa el de respaldo, adaptado. Evidencia y método en [[design]] §5.
- **`progress/audit_animations_mobile.md` no lista esta barra.** El backlog es
  del 2026-08-24 y la barra la creó #98 el 2026-09-21; sus rutas aún dicen
  `app/(tabs)/home.tsx`, que ya no existe. Sus valores no se pueden reusar
  porque no hay ninguno para este elemento. Lo que sí se reusa —y se declara—
  es su rechazo **R5** y por qué deja de aplicar: ver [[design]] §1.
- **`mealsPct` no ocupa `:225-227` sino `:225-228`** (la rama `: 0;` está en
  `:228`). Irrelevante para el trabajo, se anota para que nadie ancle ahí.

---

## Requisitos funcionales

### R1 (#106) — `expo-haptics` entra como dependencia declarada, y la carta deja de decir que no está

WHEN se instale `expo-haptics` con `bunx expo install expo-haptics`
THE SYSTEM SHALL dejar en `mobile-pet-tracker/package.json` una entrada
`expo-haptics` cuyo rango comparta versión mayor con la entrada `expo` del
mismo fichero, SHALL **no** crear ningún `babel.config.js` ni `.babelrc*` en
`mobile-pet-tracker/`, SHALL **no** añadir ninguna entrada a `plugins` de
`app.json`, y SHALL dejar `docs/ui-guidelines.md` sin ninguna afirmación de
que `expo-haptics` no está instalado.

Observable con:

- `src/app/(tabs)/__tests__/food.test.tsx`, describe
  `#106 R1: expo-haptics entra declarada y sin configuración de babel`:
  - lee `package.json` con el `readFileSync` que el fichero ya importa en
    `:28` y asevera que `dependencies['expo-haptics']` existe y que su mayor
    coincide con el mayor de `dependencies.expo` — **consistencia interna, no
    una constante congelada**: el rango exacto lo decide `expo install` y no
    se escribe en esta spec;
  - asevera que **no** existe ninguno de los ficheros de configuración de
    babel que `jest-expo` busca (`babel.config.js`, `babel.config.cjs`,
    `babel.config.ts`, `.babelrc`, `.babelrc.js`), porque su sola presencia
    cambiaría cómo se resuelve el preset;
  - lee `docs/ui-guidelines.md` (ruta relativa a `process.cwd()`, que en jest
    es `mobile-pet-tracker/`: `../docs/ui-guidelines.md`) y asevera que **no**
    contiene la cadena `expo-haptics NO está instalado`, y que **sí** contiene
    la frase nueva que fija la enmienda.

**Texto exacto de la enmienda a `docs/ui-guidelines.md`.** La línea `:171-172`
dice hoy:

```
- expo-haptics NO está instalado; toda propuesta que lo requiera lo declara
  como dependencia nueva en su spec.
```

y pasa a decir, literalmente:

```
- expo-haptics está instalado desde #106 (2026-09-21), autorizado por el
  humano en el gate de specs/mobile-meals-bar-motion/. Se usa con la tabla de
  la skill expo-animation §8: selectionAsync para un detent, impactAsync para
  un commit de gesto, notificationAsync(Success|Error) para una operación que
  termina bien o mal. Tres reglas absolutas: mismo frame que el visual, uno
  por acción del usuario, y nunca el único feedback.
```

**Las cinco specs viejas que afirman que no está instalado NO se tocan**
(`specs/mobile-device-pairing/requirements.md:322` y `design.md:250`,
`specs/mobile-home-weekly-activity/requirements.md:770`,
`specs/mobile-home-reminders-section/design.md:568`,
`specs/mobile-tab-glass/requirements.md:85`,
`specs/mobile-meals-served-ui/requirements.md:705` y `design.md:336`). Eran
**ciertas cuando se firmaron** y una spec aprobada es un documento fechado, no
un estado vivo; reescribirlas rompería C6 (un requisito modificado después de
su aprobación). Los dos documentos **vivos** —`docs/ui-guidelines.md` y
`progress/audit_animations_mobile.md`— sí se actualizan: la carta por esta R1,
el audit por R4. Codex **no decide nada aquí**: no toca ninguna spec ajena.

### R2 (#106) — El relleno de la barra de comidas transiciona su ancho en vez de saltar

WHEN cambie el valor de `mealsToday.served` o `mealsToday.total` del detalle
cargado
THE SYSTEM SHALL animar el ancho del relleno `reminders-meals-fill` desde su
ancho anterior hasta `Math.round((served / total) * 100)` por ciento con
`withTiming` sobre un shared value de Reanimated, durante
`MEALS_BAR_DURATION_MS` milisegundos y con la curva `MEALS_BAR_EASING`,
en el UI thread, y SHALL dejar el relleno en reposo exactamente en el mismo
porcentaje que pinta hoy.

Valores, exportados desde `src/screens/home/index.tsx` para que el test los
compare por identidad (precedente: `weekly-activity-chart.tsx:49-51`):

| Constante | Valor | De dónde sale |
|---|---|---|
| `MEALS_BAR_DURATION_MS` | `250` | carta §Animación: «250ms transición». Coincide con `BAR_ENTRY_DURATION_MS` y con la duración del spring del selector de métrica, los dos precedentes vivos del repo |
| `MEALS_BAR_EASING` | `Easing.bezier(0.77, 0, 0.175, 1)` | skill `expo-animation` §5, fila «Moving / morphing on screen → ease-in-out»: el relleno crece **y** mengua en sitio, en las dos direcciones |
| `MEALS_BAR_TIMING` | `{ duration: MEALS_BAR_DURATION_MS, easing: MEALS_BAR_EASING, reduceMotion: ReduceMotion.System }` | precedente `METRIC_TAB_SPRING` (`weekly-activity-chart.tsx:52-56`) |

Observable con `src/screens/home/index.test.tsx`, describe
`#106 R2: la barra de comidas transiciona su ancho`:

- con `mealsToday = { served: 1, total: 2 }`, el relleno cumple
  `toHaveAnimatedStyle({ width: '50%' })` y `withTiming` ha sido llamado con
  `(50, MEALS_BAR_TIMING)`;
- con `{ served: 2, total: 2 }`, con `(100, MEALS_BAR_TIMING)` y
  `toHaveAnimatedStyle({ width: '100%' })`;
- con `{ served: 0, total: 2 }`, con `(0, MEALS_BAR_TIMING)` y
  `toHaveAnimatedStyle({ width: '0%' })` — la bajada (deshacer) se asevera
  igual que la subida;
- `reminders-meals-fill` **conserva** `props.className` exactamente igual a
  `'h-full rounded-full bg-accent'`.

**Cómo se recorren los tres casos.** Con el mismo bucle montar → aseverar →
`unmount()` que ya usa `#98 R7` en `index.test.tsx:3700-3721`, remockeando
`getPet` en cada vuelta y limpiando el doble de `withTiming` entre vueltas.
**No** hay que orquestar un refetch en vivo: lo que el requisito fija es que
el ancho llegue al relleno **a través de `withTiming` y con los argumentos
correctos**, y eso un montaje lo observa igual que un repintado. El
`useEffect` también dispara en el montaje —con el mismo valor en el que el
shared value ya está inicializado, así que no se ve ninguna animación
espuria—, y eso es justo lo que hace la aserción posible sin temporizadores.

**Candados de #98 que esta R2 mueve, con su valor nuevo.** Son los dos únicos,
y no se mueve ni uno más:

| Fichero:línea | Hoy | Pasa a ser | Por qué |
|---|---|---|---|
| `src/screens/home/index.test.tsx:3697` | `expect(fill.props.style).toEqual({ width: '50%' });` | `expect(fill).toHaveAnimatedStyle({ width: '50%' });` | en un componente animado `props.style` deja de ser el objeto plano y pasa a ser `[{ width: '50%' }]`; el matcher de Reanimated lee el estilo animado y es el precedente del repo (`weekly-activity-chart.test.tsx:917-922`). `fill` se sigue obteniendo como `track.children[0]`, que es el mismo elemento host que devolvería `getByTestId` |
| `src/screens/home/index.test.tsx:3716-3718` | `expect((await screen.findByTestId('reminders-meals-fill')).props.style).toEqual({ width });` | `expect(await screen.findByTestId('reminders-meals-fill')).toHaveAnimatedStyle({ width });` | mismo motivo; los tres casos `0% / 50% / 100%` y el bucle **se conservan tal cual** |

Todo lo demás de `#98 R7` y `#98 R8` (cardinalidades, orden de hijos,
`className` del track y del relleno, disco, icono, copy, nombre accesible,
tipografía, condición de render) **queda intacto y debe seguir verde sin
tocarse**. Si alguna de esas aserciones se pone roja, es un defecto de la
implementación, no un candado que haya que recontar.

### R3 (#106) — Con reduce motion activado la barra no anima

WHILE el sistema operativo tenga activado «reducir movimiento»
THE SYSTEM SHALL fijar el ancho del relleno directamente en su valor final,
sin llamar a `withTiming`, y SHALL seguir pintando el mismo porcentaje.

Observable con `src/screens/home/index.test.tsx`, describe
`#106 R3: reduce motion deja la barra sin animación`: con el doble de
`useReducedMotion` devolviendo `true`, `withTiming` **no** se llama y el
relleno cumple `toHaveAnimatedStyle({ width: '50%' })`; con el doble
devolviendo `false`, `withTiming` **sí** se llama.

La guarda explícita **no es redundante** con `ReduceMotion.System`: el flag del
sistema no es observable desde jsdom, así que sin la rama el requisito no
tendría ningún rojo propio. Las dos capas se conservan: la rama la prueba jest,
`ReduceMotion.System` la aplica Reanimated en el dispositivo.

### R4 (#106) — Servir y deshacer una comida dan respuesta háptica

WHEN el usuario pulse el botón de una franja y la operación termine —bien o
mal— y el plan y el perfil ya se hayan refrescado
THE SYSTEM SHALL disparar exactamente **una** vibración,
`Haptics.notificationAsync(NotificationFeedbackType.Success)` si la respuesta
fue `ok`, `already-served` o `not-served`, y
`Haptics.notificationAsync(NotificationFeedbackType.Error)` en cualquier otro
caso.

IF la pantalla se monta, se repinta o refresca sin que el usuario haya pulsado
THEN THE SYSTEM SHALL no disparar ninguna vibración.

Punto de integración: `src/app/(tabs)/food.tsx`, dentro de `toggleMeal`
(`:63-87`), **después** de `await plan.refetch()` y de
`await queryClient.refetchQueries({ queryKey: petKeys.detail(selectedPetId) })`
y **antes** del `finally`. Ahí es donde el visual que acompaña al háptico ya
está en pantalla: el badge `meal-served-<i>` / `meal-pending-<i>` ya cambió, o
`food-meal-error` ya apareció. La llamada es fire-and-forget (`void`): el
háptico nunca bloquea la UI.

La clasificación sale de la tabla §8 de la skill `expo-animation`: «Operation
succeeded or failed → `notificationAsync(Success / Error)`». Las tres reglas
absolutas de esa sección se cumplen: **mismo frame que el visual** (va tras los
refetch, que son los que repintan), **uno por acción del usuario** (el guard
`pendingMealTime` de `:64` ya impide la segunda pulsación en vuelo), y **nunca
el único feedback** (el badge y el mensaje de error existen desde #98 y no
cambian).

Observable con `src/app/(tabs)/__tests__/food.test.tsx`, describe
`#106 R4: servir y deshacer vibran una vez y distinguen éxito de fallo`:

- antes de la pulsación, el doble de `notificationAsync` **no** se ha llamado;
- servir con `{ kind: 'ok' }` lo llama **una** vez con
  `NotificationFeedbackType.Success`;
- deshacer con `{ kind: 'ok' }` lo llama **una** vez con
  `NotificationFeedbackType.Success`;
- servir con `{ kind: 'error' }` lo llama **una** vez con
  `NotificationFeedbackType.Error`, y en ese mismo escenario
  `food-meal-error` está en pantalla (el háptico no sustituye al visual);
- `{ kind: 'already-served' }` cuenta como éxito (`Success`), coherente con
  `#98 R6`, que no muestra error en ese caso.

Las aserciones comparan contra **los miembros del enum del doble**
(`NotificationFeedbackType.Success`), nunca contra un literal de cadena: el
valor real lo fija `expo-haptics` y no se congela en esta spec.

**`progress/audit_animations_mobile.md` se actualiza** con **una sola** nota
fechada al final del fichero, titulada `## Nota de #106 (2026-09-21)`, que
corrige sus tres hechos caducados. Es un backlog vivo que se consulta al
especificar animaciones —esta misma feature lo consultó— así que dejarlo
mintiendo tiene coste; las specs firmadas, en cambio, no se tocan (R1):

1. su cabecera `:6` dice «**expo-haptics NO instalado**» y «Runtime de smoke:
   Expo Go»: lo primero deja de ser cierto con R1, lo segundo lo dejó de ser
   el 2026-08-27, cuando el smoke pasó a dev build de Android;
2. su rechazo **R5** («Haptics en press feedback: `expo-haptics` NO está
   instalado; añadir una dependencia solo para esto no se justifica hoy»)
   queda superado **solo para el caso de R4**; el press feedback general sigue
   siendo visual y sigue sin haptic;
3. su rechazo **R7** («Flip Served→Pending de las filas de comida: el estado
   cambia con el reloj, casi siempre con la app cerrada; la transición nunca
   se vería») descansaba en una premisa que #98 invalidó: desde #98 el estado
   lo cambia el usuario pulsando, y sí lo presencia.

La nota **no** convierte R7 en trabajo de esta feature ni registra nada nuevo:
solo deja escrito por qué esas razones caducaron. La barra de comidas **no**
está en ese backlog —es del 2026-08-24 y la barra la creó #98— así que no hay
valores previos que reutilizar; los de R2 se derivan de la carta y de la
skill.

### R5 (#107) — El feedback de pulsado del botón por franja queda candado

WHEN se pulse el botón `meal-toggle-<i>` de una franja
THE SYSTEM SHALL aplicarle opacidad `0.8` mientras el dedo esté encima y `1`
en reposo, y esa receta SHALL estar vigilada por al menos un test que se ponga
rojo si desaparece.

**Este es un requisito de verificación, y se cierra por la vía (b) de C4.**
El `style` **ya está en producción** desde #98, así que un test nuevo nacería
verde y no habría historial rojo→verde. Por eso:

- el **commit rojo** quita el `style={({ pressed }) => ...}` de
  `src/app/(tabs)/food.tsx:253-255` —mutación de **producción**, versionada en
  el commit, nunca de un doble de test— y versiona el test viéndolo fallar de
  verdad;
- el **commit verde** restaura el `style` **exactamente como estaba**, en sus
  tres líneas.

El **diff neto de `src/app/(tabs)/food.tsx` por R5 es cero**: R5 no normaliza
el `style` a una línea. El camino B del handoff lo pedía para poder calcar la
regex de la Home, y aquí no hace falta porque la regex se escribe tolerante al
formato (ver abajo). Menos producción tocada, menos riesgo.

Observable con `src/app/(tabs)/__tests__/food.test.tsx`, describe
`#107 R5: el botón por franja conserva su feedback de pulsado`, que adapta el
patrón ya probado de `src/screens/home/index.test.tsx:3272-3299` (no lo copia:
se abre, se mira qué acota y se reescribe contra `food.tsx`). Dos aserciones:

1. **Árbol renderizado.** Con el helper `opacityOf` —que aplana el `style`,
   se queda con las entradas que son objeto y devuelve la que tiene
   `opacity`—, `opacityOf(toggle.props.style)` vale `1` en reposo. Si el
   `style` desaparece de producción, `props.style` queda `undefined` y la
   aserción se pone roja.
2. **Fuente acotado al bloque del botón.** Se lee
   `readFileSync('src/app/(tabs)/food.tsx', 'utf8')` —misma forma que
   `food.test.tsx:459`—, se ancla en `` testID={`meal-toggle-${index}`} ``, se
   recorta desde el `<Pressable` anterior hasta el `</Pressable>` siguiente, y
   se exige que **ese bloque** case con:

   ```
   /style=\{\(\{ pressed \}\) => \(\{\s*opacity: pressed \? 0\.8 : 1,?\s*\}\)\}/
   ```

   La regex es tolerante a que prettier lo escriba en una o en tres líneas.
   **Verificado**: casa con las tres líneas de `food.tsx` y también con la
   única línea de `src/screens/home/index.tsx:314` y `:626`. La regex literal
   de la Home (`index.test.tsx:190`, `:3297`) **no** casa con `food.tsx`, así
   que copiarla habría dado un rojo permanente.

El acotado importa: una regex sobre el fichero entero pasaría aunque el
`Pressable` del `meal-toggle` perdiera su `style`, porque bastaría con que
otro `Pressable` del fichero lo tuviera.

---

## Prueba de humo del humano (no delegable a IA)

Runtime: **dev build de Android**, nunca Expo Go — regla del repo desde
2026-08-27, y aquí además es obligatorio porque `expo-haptics` es módulo
nativo.

- [ ] **Paso 0 — regenerar el dev build.** El dev build instalado hoy no lleva
      `expo-haptics`. Sin este paso, los pasos 3 y 4 no prueban nada.
- [ ] 1. Abrir la Home con una mascota que tenga plan de nutrición. La barra de
      comidas se ve con su `served/total`.
- [ ] 2. Ir a Food y **servir** una franja pendiente. Volver a la Home: el
      relleno **crece deslizándose**, no salta.
- [ ] 3. Repetir el paso 2 sintiendo el teléfono en la mano: al completarse la
      acción hay **una** vibración corta de éxito.
- [ ] 4. **Deshacer** esa misma franja: el relleno **mengua deslizándose** y
      hay **una** vibración.
- [ ] 5. Con el teléfono en modo avión (para forzar el fallo de red), pulsar
      una franja: aparece el mensaje de error **y** la vibración se siente
      distinta a la de éxito.
- [ ] 6. Activar «Reducir movimiento» en los ajustes de accesibilidad de
      Android, repetir el paso 2: la barra **cambia de ancho sin transición** y
      el número `served/total` sigue siendo correcto.
- [ ] 7. Con el volumen y la vibración del sistema apagados, repetir el paso 2:
      la app **no falla** y el badge sigue cambiando (el háptico nunca es el
      único feedback).

---

## Decisiones cerradas por escrito (Codex no tiene que elegir nada)

| # | Decisión | Cerrada así |
|---|---|---|
| D1 | Qué se anima | El `width` del relleno. Es el caso que la skill `expo-animation` §4 exime de la regla «nunca animes width»: elemento sin hijos y sin hermanos, y `scaleX` embarraría el `rounded-full` |
| D2 | Con qué API | Shared value + `useAnimatedStyle` + `withTiming`. **No** transición CSS de Reanimated: medida contra el árbol, en jest sus props no llegan al host y el requisito se quedaría sin candado posible |
| D3 | Qué componente | `const AnimatedView = Animated.createAnimatedComponent(View);`, como `weekly-activity-chart.tsx:91` y `pet-hero-header.tsx:43`. Medido: conserva `props.className` **idéntico** |
| D4 | Duración y curva | `250 ms`, `Easing.bezier(0.77, 0, 0.175, 1)`. Tabla de R2 |
| D5 | Temporizadores en el test | **Ninguno.** `withTiming` se dobla con la identidad, el shared value asienta en el acto y `toHaveAnimatedStyle` lee el valor final. Cero `advanceTimersByTime`, cero ventana de timer que calibrar |
| D6 | Haptic: cuál y cuándo | `notificationAsync(Success)` o `notificationAsync(Error)` tras los refetch. R4 |
| D7 | Claves de copy nuevas | **Cero.** La suma de `src/providers/__tests__/language-provider.test.tsx:55-57` (`260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4`) **no se toca**, y `specs/mobile-ui-language/design.md` **no gana ninguna fila**. Si Codex se ve añadiendo una clave, es que se ha salido del alcance |
| D8 | `babel.config.js` | **No se crea.** `jest-expo` cae a `expo/internal/babel-preset` cuando no hay fichero de babel, y `babel-preset-expo` inyecta solo `react-native-worklets/plugin` porque el paquete está instalado. Crear el fichero cambiaría esa resolución. R1 lo canda |
| D9 | Camino de #107 | El de respaldo del handoff, adaptado y **sin normalizar producción**. El preferido está refutado contra el árbol |
| D10 | Dónde vive el candado de la dependencia | En `food.test.tsx`, no en `src/__tests__/design-drift.test.ts`: ese fichero lo está tocando #94 en otro worktree y sería conflicto de merge seguro |

---

## Fuera de alcance

Clasificado viñeta a viñeta, con su premisa verificada (memoria del repo: no
todo lo que está fuera de alcance es una feature).

**Delimitaciones — no son features, no se registran:**

- **Animar cualquier otro elemento de la Home o de Food.** El backlog
  `progress/audit_animations_mobile.md` sigue vivo con sus tres ALTA sin hacer
  (A1 press feedback, A2 entrada del plan, A3 marker del mapa). Esta feature
  **no** ejecuta ninguna y **no** crea `PressableScale`.
- **Promover `250 ms` a un token `--motion-*` de `global.css`.** La carta lo
  pide «si se repiten», y con esta feature son dos apariciones. No se hace
  porque las dos son números de JS que consume Reanimated, y leer un token CSS
  exigiría `getCSSVariable` + parseo dentro de un estilo animado, justo lo que
  la carta desaconseja para Reanimated. Si aparece una tercera, se reabre.
- **Haptics en cualquier otro sitio de la app.** Se instala la dependencia y se
  usa en un punto. El press feedback global sigue siendo visual.
- **Reestructurar `food.tsx` a route delgado + `src/screens/`.** Ya registrado
  como **#102 `mobile-routes-to-screens`** por #98.
- **Tocar las cinco specs firmadas que dicen que `expo-haptics` no está
  instalado.** Razonado en R1.
- **Añadir un `R12` a `specs/mobile-meals-served-ui/`.** El candado de #107
  vive en **esta** spec, con su propio R-id, y la spec de #98 no se reabre.
- **Estado optimista al servir una comida.** Decisión cerrada de #98
  (2026-09-15) y no se relitiga: el servidor puede **invalidar** la acción.
  La animación de R2 arranca cuando llega el dato del servidor, no antes.
- **Cambios en `backend-pet-tracker/`, `infra/`, `init.config.sh` o CI.**

**Premisas que habría que verificar antes de registrar nada más:** ninguna
pendiente. Las cuatro afirmaciones del encargo que no resistieron la
verificación están corregidas arriba, en §Premisas verificadas.

---

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

Al marcar esta casilla el humano firma también, explícitamente, los tres
puntos de §Qué firma el humano al aprobar esta spec: la instalación de
`expo-haptics`, la enmienda a `docs/ui-guidelines.md:171` y la necesidad de
regenerar el dev build de Android antes de la prueba de humo.
