---
feature: "mobile-tab-indicator-out-of-range"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-tab-indicator-out-of-range]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> **Corrección de defecto, solo de cliente móvil.** Cero cambios en
> `backend-pet-tracker/`, cero migraciones, **cero dependencias nuevas**, cero
> claves de traducción nuevas. Rige `docs/ui-guidelines.md` (carta de UI, gate C8
> de `CHECKPOINTS.md`).
>
> **Skills obligatorias antes de tocar nada** (carta §Skills): `expo-overview`
> primero y, derivadas de ella, `expo-router` (el componente es el `tabBar`
> personalizado de un `<Tabs>` de Expo Router) y `expo-animation` (la burbuja
> anima con `withSpring` de Reanimated). En Codex CLI las sirve el plugin `expo`.
> No se carga `appllama-app-design-skill`: no hay pantalla nueva ni rediseño,
> es un arreglo de posicionamiento dentro de un componente existente.

---

## §0. Verificación de premisas contra el árbol (obligatoria antes de leer los requisitos)

Todo lo que sigue se comprobó leyendo el código en la branch
`feature/91-mobile-tab-indicator-out-of-range`, salida de `origin/main` en el
commit **`072cff40`** (merge del PR #123 de #78). No se dio por buena ninguna
línea de la descripción de la feature: las referencias de línea que esa
descripción trae (`:91-93`, `:105`, `:76`) **están corridas** y aquí se reapuntan.

### §0.1 Premisas confirmadas

| Premisa | Veredicto | Evidencia leída |
|---|---|---|
| `TABS` tiene cinco entradas (home, map, health, food, profile) | **cierta** | `src/components/floating-tab-bar.tsx:49-55` |
| `TAB_INDICATOR_SPRING` = `{ duration: 250, dampingRatio: 1, reduceMotion: ReduceMotion.System }` | **cierta** | `:57-61` |
| `tabWidth` se calcula sobre **cinco** ranuras | **cierta** | `:77` `const tabWidth = (containerWidth - 16) / TABS.length;` |
| La burbuja se posiciona con `state.index` | **cierta**, en **dos** sitios | `:92` (dentro del `useEffect`) y `:105` (dentro de `handleLayout`) |
| `activeRouteName` ya existe en el componente | **cierta** | `:75` `const activeRouteName = state.routes[state.index]?.name;` |
| `lastPositionedIndex` guarda `state.index` | **cierta** | `:74` (inicialización) y `:90`, `:106` (escrituras) |
| El grupo `(tabs)/` tiene siete destinos que **no** son pestaña | **cierta** | `ls src/app/(tabs)/`: `add-reminder.tsx`, `alerts.tsx`, `meal-schedule.tsx`, `pairing.tsx`, `reminders.tsx`, `weight-log.tsx` y el subárbol `pets/`, frente a los cinco `<Tabs.Screen>` de `_layout.tsx:26-30` |
| La suite nunca montó una ruta ajena a `TABS` | **cierta** | `src/components/__tests__/floating-tab-bar.test.tsx:51-57`: el fixture `routes` tiene **exactamente** las cinco rutas de `TABS`; `tabBarProps` (`:61`) y `renderTabBar` (`:71`) lo consumen y no admiten otro |
| Las aserciones vivas del indicador son `137.6` (índice 2) y `68.8` (índice 1), con ancho 360 | **cierta** | `:175` y `:216`; el ancho entra por el evento `layout` de `:158` y `:205` |
| Los candados de #78 R5 comprueban `TABS` en cinco entradas y cinco `<Tabs.Screen>` | **cierta** | `src/app/(tabs)/__tests__/alerts.test.tsx:36-59` — y siguen siendo ciertos: **no hay una sexta pestaña, el defecto es del indicador** |

### §0.2 Corrección C1 — las líneas del enunciado están corridas

El enunciado de #91 sitúa el defecto en `:91-93` y `:105` y `activeRouteName` en
`:76`. En el árbol de `072cff40` los anclajes reales son:

| Símbolo | Línea real | Qué es |
|---|---|---|
| `TABS` | `:49-55` | las cinco entradas |
| `TAB_INDICATOR_SPRING` | `:57-61` | el spring exportado |
| `FloatingTabBar` | `:63` | el componente |
| `lastPositionedIndex` | `:74` | `useRef(state.index)` |
| `activeRouteName` | `:75` | `state.routes[state.index]?.name` |
| `tabWidth` | `:77` | `(containerWidth - 16) / TABS.length` |
| **Sitio A** — `useEffect` | `:82-94`, escritura en `:91-93` | `translateX.set(withSpring(state.index * tabWidth, …))`, con guarda `containerWidth <= 0 \|\| lastPositionedIndex.current === state.index` |
| **Sitio B** — `handleLayout` | `:96-108`, escritura en `:105` | `translateX.set(state.index * nextTabWidth)` |
| Condición de render de la burbuja | `:137` | `containerWidth > 0 ? <Animated.View testID="tab-indicator" …/> : null` |
| `isActive` de cada celda | `:164` | `activeRouteName === name` |

**Son dos sitios, no uno.** El Sitio B es el que corre cuando la app **arranca o
se redimensiona ya dentro de una ruta ajena** (deep link a `alerts`, rotación,
cambio de tamaño de ventana); el Sitio A, cuando se navega después del primer
layout. Una spec que solo cerrase el `useEffect` dejaría el defecto vivo en el
primer layout. Los dos se arreglan y **cada uno tiene su propio requisito y su
propia prueba de mutación** (R2 y R3; M1 y M2 en R7).

### §0.3 Corrección C2 — el arreglo no depende del orden de `state.routes`

El enunciado dice "cualquier ruta fuera de `TABS` cae en índice >= 5". Eso es una
observación sobre el orden que **hoy** produce el router (las cinco declaradas
en `_layout.tsx` primero, las demás después) y **no se toma como contrato**: ese
orden lo decide Expo Router y puede cambiar en una subida de SDK. El arreglo
—derivar de `TABS`— es correcto sea cual sea el orden, y esta spec lo verifica
con un fixture donde la ruta ajena va **primera** (R2, R3): ahí el índice de
`state.routes` y el de `TABS` difieren **para una ruta que sí es pestaña**, que
es el caso que ningún test del repo distingue hoy.

### §0.4 Por qué las celdas ya están bien y la burbuja no

`isActive` (`:164`) compara **nombres**, no índices: con una ruta ajena activa,
`activeRouteName` es `'alerts'`, ninguna de las cinco celdas coincide y las cinco
se pintan inactivas — que es lo correcto. El defecto es exclusivamente de la
burbuja, que es la única que traduce el estado a **aritmética de índices**. De ahí
que R5 sea un requisito de *verificación* (candado sobre código ya correcto) y no
un arreglo.

---

## §1. Decisiones cerradas (Codex no verá la conversación que las originó)

### D1 — Índice −1: **la burbuja no se renderiza** ("ninguna pestaña activa")

Cuando `TABS.findIndex(tab => tab.name === activeRouteName)` devuelve `-1`, la
burbuja **no se monta**. Se descarta congelarla donde estaba (alternativa A1 de
[[design]]): dejarla visible bajo una pestaña dice "esta pestaña es la ruta
actual" cuando las cinco celdas ya se están pintando inactivas — es una
contradicción visible dentro de la misma barra.

Consecuencias, todas normativas:

1. **`translateX` no se escribe mientras el índice es −1.** Ni el Sitio A ni el
   Sitio B tocan el valor compartido. Conserva la ranura de la última pestaña
   visitada; nadie lo lee mientras la burbuja está desmontada.
2. **La burbuja reaparece instantánea, no animada.** Al volver a una ruta de
   `TABS`, se coloca en su ranura en el mismo commit, sin `withSpring`. Regla
   que queda fijada: **la burbuja nunca se anima "desde ninguna parte"; solo
   anima entre dos posiciones que el usuario ha visto.** No es una regla nueva:
   es la que ya cumple `handleLayout` al colocarla por primera vez tras el
   layout (`:105`, escritura directa sin spring). Sin esta decisión, volver de
   `alerts` a una pestaña distinta de la de partida haría aparecer la burbuja en
   la ranura vieja y deslizarse desde ahí — movimiento fantasma de hasta cuatro
   ranuras.
3. **El estado activo de las cinco celdas no cambia** (ver D3).

### D2 — `lastPositionedIndex` pasa a guardar el índice **derivado de `TABS`**

`lastPositionedIndex` (`:74`) deja de guardar `state.index` y guarda el índice
dentro de `TABS`, con `-1` como valor legítimo para "ninguna pestaña activa".
Motivo: si siguiera guardando `state.index`, dos rutas ajenas distintas (p. ej.
índices 5 y 6) se leerían como "el índice cambió" y dispararían trabajo con la
burbuja desmontada; y al volver de una ruta ajena no habría forma de saber que la
burbuja no estaba visible, que es justo lo que D1.2 necesita. Con el índice
derivado, `-1 → n` es exactamente la condición de "reaparece": colocación
instantánea.

Esto obliga a **mover** el cálculo de `activeRouteName` y del índice derivado
**por encima** del `useRef`, porque el ref se inicializa con él. El orden de
declaraciones exacto está en [[design]] §D5.

### D3 — Las cinco celdas no se tocan

`isActive` sigue siendo `activeRouteName === name` (`:164`). Con una ruta ajena
activa, las **cuatro decisiones por celda** —estado de accesibilidad, peso del
icono, color del icono y clase de la etiqueta— siguen dando el valor inactivo, y
las cinco celdas siguen navegando al pulsarlas. R5 lo convierte en candado; el
inventario completo por celda está en [[design]] §D6.

### D4 — Ruta ajena elegida para los tests: `alerts`

Es una ruta **real** del árbol (`src/app/(tabs)/alerts.tsx`, #78) y la que el
defecto exhibe a diario, porque la campana del hero de Home la abre desde
cualquier pestaña. El fixture `routes` de `floating-tab-bar.test.tsx:51-57` **no
admite hoy otra ruta**: hay que parametrizarlo. La forma exacta —qué constantes
se añaden, qué firma cambia y por qué los tests existentes no se tocan— está en
[[design]] §D7, y su tarea va **antes** que la de cualquier requisito que lo use
(ver [[tasks]] §T0).

### D5 — Cero copy, cero dependencias

El arreglo no añade, quita ni renombra ninguna clave de traducción: la burbuja no
tiene texto ni etiqueta de accesibilidad propia, y la decisión de D1 es un
`null` de render, no un estado con copy. **Delta 0 sobre el candado de longitud
del catálogo** de `src/providers/__tests__/language-provider.test.tsx:41`: no se
le suma ningún término. Se dice explícitamente porque este candado ya paró el
trabajo dos veces. Tampoco entra ninguna dependencia: `TABS`, `findIndex` y el
`withSpring` que ya se usa bastan (R6).

---

## Requisitos funcionales

### R1 — Una ruta fuera de `TABS` no monta la burbuja

**WHILE** la ruta activa (`state.routes[state.index]?.name`) no sea ninguno de
los cinco `name` de `TABS`, **THE SYSTEM SHALL** no montar el nodo
`testID="tab-indicator"`, tanto si esa ruta ya era la activa en el primer evento
`layout` como si se llega a ella navegando después del layout.

Corolario observable: la burbuja no puede pintarse en ninguna posición fuera del
rango de las cinco ranuras, porque en ese estado no existe.

- **Test**: `src/components/__tests__/floating-tab-bar.test.tsx` ::
  `#91 R1: una ruta fuera de TABS no monta la burbuja`, dos casos:
  (a) montaje directo en `alerts` + primer `layout` de 360 ⇒ `tab-indicator`
  ausente; (b) montaje en `health`, `layout` de 360, burbuja presente en
  `translateX: 137.6`, y **después** cambio a `alerts` ⇒ `tab-indicator` ausente.
- **Rojo real contra `072cff40`**: hoy la burbuja se monta en cuanto
  `containerWidth > 0`, con `translateX` de `5 × 68.8 = 344` — fuera del rango de
  la barra (ancho útil 344, ranura 68.8: la burbuja queda pegada al borde
  derecho, recortada por el `overflow-hidden`). Es el "ranura fantasma detrás de
  Perfil" del reporte.

### R2 — El **primer layout** coloca la burbuja por el índice dentro de `TABS`

**WHEN** llegue el primer evento `layout` con ancho mayor que cero y la ruta
activa sea una de `TABS`, **THE SYSTEM SHALL** colocar la burbuja en
`índiceEnTABS × tabWidth`, **no** en `state.index × tabWidth`.

- **Test**: `#91 R2: el primer layout coloca la burbuja por el índice de TABS`.
  Fixture con la ruta ajena **primera** (`routesAlertsFirst`, [[design]] §D7):
  activa `map`, que ahí es `state.index` **2** y `TABS` índice **1**. Tras el
  `layout` de 360 ⇒ `translateX: 68.8`.
- **Rojo real contra `072cff40`**: hoy da `2 × 68.8 = 137.6` — la ranura de
  `health`, con `map` activo.
- **Sitio cubierto**: B (`handleLayout`, `:105`). Mutación **M2** (R7).

### R3 — El **cambio de ruta** desliza la burbuja al índice dentro de `TABS`

**WHEN** la ruta activa cambie, después del primer layout, de una ruta de `TABS`
a otra ruta de `TABS`, **THE SYSTEM SHALL** animar `translateX` con
`TAB_INDICATOR_SPRING` hasta `índiceEnTABS × tabWidth`, **no** hasta
`state.index × tabWidth`.

- **Test**: `#91 R3: el cambio de ruta desliza la burbuja al índice de TABS`.
  Mismo fixture `routesAlertsFirst`: `layout` de 360 con `map` activo
  (`state.index` 2), luego re-render con `health` activo (`state.index` **3**,
  `TABS` índice **2**), avanzar 300 ms ⇒ `translateX: 137.6`.
- **Rojo real contra `072cff40`**: hoy da `3 × 68.8 = 206.4` — la ranura de
  `food`, con `health` activo.
- **Sitio cubierto**: A (`useEffect`, `:91-93`). Mutación **M1** (R7).

### R4 — Al volver de una ruta ajena, la burbuja aparece **ya colocada**

**WHEN** la ruta activa pase de una ruta ajena a `TABS` a una ruta de `TABS`,
**THE SYSTEM SHALL** montar la burbuja directamente en la ranura de esa pestaña,
en el mismo commit y sin animación de aproximación; y **WHILE** la ruta activa
sea ajena a `TABS`, **THE SYSTEM SHALL** no escribir `translateX`.

- **Test**: `#91 R4: al volver de una ruta ajena la burbuja aparece ya colocada`.
  Fixture `routesWithAlerts`: `map` activo, `layout` de 360, avanzar 300 ms
  (burbuja en `68.8`); cambio a `alerts`, avanzar 300 ms (burbuja ausente);
  cambio a `health` y, **sin avanzar los temporizadores**, `translateX: 137.6`;
  después avanzar 300 ms y comprobar que **sigue** en `137.6` (no hay spring
  tardío que la mueva).
- **Rojo real contra `072cff40`**: hoy, al pasar por `alerts`, `translateX` se
  queda en `344`; al volver a `health` el valor inmediato es `344`, no `137.6`.
  El test también es rojo contra un arreglo incompleto que solo desmontara la
  burbuja sin recordar que estuvo desmontada (el valor inmediato sería `68.8`,
  la ranura vieja) — por eso esta rama es *load-bearing* y no adorno.
- La aserción **sin avanzar temporizadores** es válida porque
  `test/jest-setup.js` instala el runtime real de Reanimated
  (`require('react-native-reanimated').setUpTests()`) y sus animaciones progresan
  con los temporizadores: un `withSpring` recién lanzado todavía no ha movido el
  valor. Ese es justamente el supuesto sobre el que ya se apoya el test vivo
  "retarget-ea … en vuelo" (`floating-tab-bar.test.tsx:200-218`).

### R5 — Con una ruta ajena, las cinco celdas quedan inactivas y siguen navegando

**WHILE** la ruta activa sea ajena a `TABS`, **THE SYSTEM SHALL** pintar las cinco
celdas en su estado inactivo —las cuatro decisiones de cada una: peso de icono
`Outline`, color de icono el inactivo, clase de etiqueta
`text-2xs font-semibold text-muted` y `accessibilityState: { selected: false }`—
conservando sus **dos** hijos en orden (icono, etiqueta); y **WHEN** se pulse
cualquiera de las cinco, **THE SYSTEM SHALL** emitir `tabPress` con la `key` de
esa ruta y navegar a su `name`.

- **Test**: `#91 R5: con una ruta ajena las cinco celdas quedan inactivas y
  siguen navegando`. Sin cifras absolutas de color: el test captura el color
  activo y el inactivo del mismo árbol (render con `health` activo), comprueba
  que **difieren**, y luego re-renderiza con `alerts` activo y exige el inactivo
  en las cinco (consistencia interna, no constante congelada).
- **Requisito de verificación** (C4 de `CHECKPOINTS.md`, tercer punto): asevera
  una propiedad de código **ya correcto** (§0.4), así que **no existe un rojo
  natural**. Se declara por escrito **antes del handoff** y se elige la vía
  **(b)**: su cierre se prueba por **mutación de producción**, versionada en el
  commit rojo y revertida en el verde — mutación **M3** de R7. Mutar el doble de
  `reicon` **no vale** (cuarto y quinto punto de C4).

### R6 — Nada más se mueve: cifras de candado, dependencias y carta

**THE SYSTEM SHALL** dejar sin tocar toda cifra de candado vigente y no añadir
dependencias, y **THE SYSTEM SHALL** seguir cumpliendo la carta de UI. En
concreto, y con delta declarado:

| Candado | Dónde | Delta de #91 |
|---|---|---|
| Geometría del indicador: `137.6` (índice 2) y `68.8` (índice 1) con ancho 360, y `width: 68.8` de la burbuja | `floating-tab-bar.test.tsx:167,175,216` | **0** — se conservan tal cual, sin relajar ninguna aserción |
| `TAB_INDICATOR_SPRING` = duración 250, `dampingRatio` 1, `ReduceMotion.System` | `floating-tab-bar.tsx:57-61`; tests `:193-198`, `:221-225` | **0** — el spring no cambia |
| `TABS` en cinco entradas y sin `alerts`; `_layout.tsx` con cinco `<Tabs.Screen>` | `src/app/(tabs)/__tests__/alerts.test.tsx:36-59` | **0** — no se añade ninguna pestaña |
| Longitud del catálogo de idiomas (suma aditiva) | `src/providers/__tests__/language-provider.test.tsx:41` | **0 claves** — no se le suma ningún término (D5) |
| Copia de pestañas `R2_TABS` (cinco filas) | `src/__tests__/ui-copy-table.ts:37-42`, `ui-language.test.ts:75` | **0** |
| Ocurrencias de `text-accent-strong` en `floating-tab-bar.tsx` (1) y suma total | `src/__tests__/legibility-classnames.test.ts:117-140` | **0** — no se añade ni se quita ninguna |
| Escala de radios (`rounded-2xl/lg/md/sm` prohibidos) | `src/__tests__/consistency-classnames.test.ts` | **0** — el arreglo no añade ni edita ninguna `className` |
| Dependencias de `mobile-pet-tracker/package.json` | — | **0** — ni una nueva |

Además: grep-clean (cero hex fuera de `src/theme/`, cero clases arbitrarias
`[...]`, cero `StyleSheet.create`, cero shadow/elevation legacy) y suite móvil
completa verde (`bun test`, `typecheck`, `lint` — vía `./init.sh` desde la raíz).

- **Verificación**: no introduce test nuevo. Se cierra con (a) la suite existente
  verde sin que ninguna de sus aserciones haya sido editada y (b) un
  `git diff --stat 072cff40..HEAD` que solo liste los **dos** ficheros de
  [[design]] §Archivos afectados. El inventario de candados se obtuvo por `grep`
  de `floating-tab-bar`/`TABS` sobre `mobile-pet-tracker/src/`, no de memoria.

### R7 — Prueba de mutación documentada, una por sitio

**THE SYSTEM SHALL** dejar documentada en
`progress/impl_mobile-tab-indicator-out-of-range.md` §R7 la evidencia de que cada
sitio arreglado está vigilado: para cada mutación, el diff de una línea, el test
que se pone rojo y el mensaje de fallo.

| Mutación | Línea mutada (sobre el código ya arreglado) | Test que debe ponerse **rojo** |
|---|---|---|
| **M1** — Sitio A | en el `useEffect`, el destino del `withSpring` vuelve a `state.index * tabWidth` | `#91 R3` (espera `137.6`, obtiene `206.4`) |
| **M2** — Sitio B | en `handleLayout`, la escritura vuelve a `state.index * nextTabWidth` | `#91 R2` (espera `68.8`, obtiene `137.6`) |
| **M3** — celdas (zona ciega) | `const isActive = activeRouteName === name;` pasa a `const isActive = activeTabIndex < 0 \|\| activeRouteName === name;` | `#91 R5` (las cinco celdas se pintarían activas y dejarían de navegar) |

Una mutación que solo revierta el Sitio A **no cierra este requisito**: el
enunciado exige una por cada uno de los dos sitios de posicionamiento, y M1 y M2
se comprueban por separado, cada una con la otra revertida. M3 es la del candado
de verificación de R5 y es la que se versiona en su commit rojo (C4, quinto
punto); M1 y M2 son evidencia sobre el árbol final y **no** se dejan en el
código: se aplican, se observa el rojo, se revierten.

### R8 — Gate humano: prueba de humo en dev build de Android

**WHEN** el humano ejecute la prueba de humo en el **dev build de Android**
(runtime de smoke del repo desde 2026-08-27; no Expo Go), **THE SYSTEM SHALL**
mostrar: (a) en cualquiera de las cinco pestañas, la burbuja bajo la pestaña
activa como hasta ahora; (b) al abrir `alerts` desde la campana del hero de Home,
**ninguna** burbuja y las cinco etiquetas en gris; (c) al volver a una pestaña
—la misma u otra—, la burbuja ya colocada bajo ella, sin deslizamiento fantasma;
(d) lo mismo entrando en `reminders`, `weight-log` y una ruta de `pets/`.

No lo cierra ninguna IA. El guion y el resultado se anotan en
`progress/impl_mobile-tab-indicator-out-of-range.md` §R8.

---

## Cobertura de los criterios de aceptación de `feature_list.json`

| Criterio de aceptación (#91) | Requisito(s) |
|---|---|
| Entrar en una ruta de `(tabs)/` que no esté en `TABS` no mueve la burbuja fuera del rango; la decisión queda escrita | **R1** + §1 **D1** (no renderizarla) |
| Test nuevo con una ruta ajena a `TABS` (índice ≥ 5) que falla con el código actual | **R1** (caso (a) monta `alerts` en índice 5 y es rojo hoy); **R2**, **R3**, **R4** son rojos hoy también |
| Los tests existentes del indicador siguen verdes sin relajar ninguna aserción (`137.6`, `68.8`, ancho 360) | **R6** |
| Prueba de mutación documentada: revertir el arreglo pone rojo el test nuevo | **R7** (M1, M2, M3) |
| Las cinco pestañas siguen navegando y pintando su estado activo igual que hoy | **R5** (+ **R8** en dispositivo) |
| Cero dependencias nuevas; suite móvil completa verde; ninguna cifra de candado se mueve sin declararla como delta | **R6** |

---

## Fuera de alcance

- **Sacar las siete rutas ajenas del grupo `(tabs)/`** (moverlas a un `Stack`
  propio o declararlas con `href: null`). Es el arreglo estructural de fondo,
  toca siete rutas y su navegación, y no hace falta para que la barra sea
  correcta: el componente debe aguantar rutas ajenas en cualquier caso
  (alternativa A4 de [[design]]).
- **Añadir una sexta pestaña** (`alerts` o cualquier otra) a `TABS`. Rompería el
  candado de #78 R5 y no es lo que el producto pide.
- **Re-litigar la animación del indicador**: `TAB_INDICATOR_SPRING`, su duración
  y su `ReduceMotion` los fijaron #62/#63 y la carta de UI. Aquí solo se decide
  qué ocurre en la aparición y desaparición de la burbuja (D1.2).
- **Migrar a `NativeTabs`** de Expo Router. Es una feature aparte.
- **Tocar `backend-pet-tracker/`**, migraciones, o cualquier fichero fuera de los
  dos de [[design]] §Archivos afectados.
- **Cambiar el estado activo de las celdas** o su copy: D3.

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-12) ← gate obligatorio antes de implementar

Al aprobar, el humano ratifica además **cuatro decisiones cerradas** que Codex no
podrá reabrir porque no verá la conversación que las originó:

1. **D1** — con índice `-1` la burbuja **no se renderiza** (en vez de congelarse),
   `translateX` no se escribe mientras tanto, y al volver reaparece **instantánea**.
2. **D2** — `lastPositionedIndex` pasa a guardar el índice derivado de `TABS`,
   con `-1` como valor legítimo.
3. **D4** — la ruta ajena de los tests es `alerts`, y el fixture de
   `floating-tab-bar.test.tsx` se parametriza (tarea propia, **antes** de los
   requisitos que lo usan).
4. **R5 es un requisito de verificación** y se cierra por **mutación de
   producción** (M3), no por un rojo natural que no existe.
