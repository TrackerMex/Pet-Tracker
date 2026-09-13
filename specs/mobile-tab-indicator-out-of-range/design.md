---
feature: "mobile-tab-indicator-out-of-range"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-tab-indicator-out-of-range]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Todas las rutas son relativas a `mobile-pet-tracker/` salvo indicación expresa,
> y todas las líneas son las del commit base **`072cff40`**.
>
> `mobile-pet-tracker/` es cliente: no tiene las capas domain/application/
> infrastructure de `docs/architecture.md` (esas rigen `backend-pet-tracker/`).
> Lo que rige aquí es `docs/ui-guidelines.md` (carta de UI) y
> `docs/conventions.md` §Convenciones de la app móvil. Este cambio vive entero
> en un componente de presentación compartido.

---

## Decisiones técnicas

### D1 — La posición se deriva de `TABS`, no de `state.routes`

`state.routes` es el array del **navegador**: contiene **todas** las rutas del
grupo `(tabs)/` —las cinco pestañas más los siete destinos que no lo son—, no las
cinco pestañas. `TABS` es el array de la **barra**: cinco
entradas, y es el mismo del que sale `tabWidth` (`:77`). Mezclar los dos
sistemas de índices es la causa raíz. La posición pasa a salir de:

```ts
const activeTabIndex = TABS.findIndex((tab) => tab.name === activeRouteName);
```

Sirve a R1, R2, R3, R4. Cero dependencias: `TABS` y `activeRouteName` ya existen
en el componente (`:49`, `:75`).

**Es el arreglo de causa raíz, no de síntoma.** Los dos sitios que escriben
`translateX` pasan por la misma derivación, así que el defecto se cierra a la
vez para los siete destinos ajenos (`alerts`, `reminders`, `pairing`,
`weight-log`, `meal-schedule`, `add-reminder` y `pets/`), y también para la
variante silenciosa que nadie ha reportado todavía: si el router reordenase
`state.routes` y una ruta ajena quedase **antes** de las pestañas, hoy la burbuja
se pintaría bajo la pestaña equivocada *dentro* del rango — un defecto que la
lectura "índice ≥ 5" no vería. R2 y R3 lo candan.

### D2 — Índice `-1`: no se monta la burbuja, y `translateX` no se toca

Condición de render (`:137`), que hoy es solo `containerWidth > 0`:

```tsx
{containerWidth > 0 && activeTabIndex >= 0 ? ( … <Animated.View testID="tab-indicator" …/> ) : null}
```

La burbuja ya tenía un estado "no existe" (antes del primer layout), con su
aserción viva en `floating-tab-bar.test.tsx:154`. Esta decisión **reutiliza ese
estado** en vez de inventar uno nuevo: es una condición más en el mismo ternario,
no una rama de UI nueva. Sirve a R1.

Mientras el índice es `-1`, ningún sitio escribe `translateX`: el valor
compartido conserva la ranura de la última pestaña visitada y nadie lo lee.

### D3 — `lastPositionedIndex` guarda el índice derivado; `-1 → n` significa "reaparece"

El ref (`:74`) existe para no relanzar el spring cuando el efecto corre por un
cambio de `containerWidth`/`tabWidth` en vez de por un cambio de ruta. Al pasar a
guardar el índice derivado gana un segundo uso: **`-1` en el ref significa "la
burbuja no estaba visible"**, y esa es exactamente la condición de colocación
instantánea de R4. Sin él haría falta un segundo ref; con él, el arreglo no añade
estado nuevo al componente.

### D4 — La burbuja nunca se anima "desde ninguna parte"

Regla que queda fijada (R4): `withSpring` solo se usa cuando la burbuja **ya era
visible** en otra ranura. En su primera aparición —tras el layout, o al volver de
una ruta ajena— se coloca con una escritura directa. No es una regla nueva: es la
que `handleLayout` ya cumplía (`:105`). Encaja con `expo-animation` §5 ("bounce
only when the gesture carried momentum") y con la carta §Animación: animar un
elemento hacia una posición desde otra que el usuario no ha visto es movimiento
sin propósito.

### D5 — Los tres *hunks*, exactos

**(a) Orden de declaraciones** — el ref se inicializa con el índice derivado, así
que `activeRouteName` y `activeTabIndex` suben por encima de él. `:72-77` queda:

```tsx
const [containerWidth, setContainerWidth] = useState(0);
const activeRouteName = state.routes[state.index]?.name;
const activeTabIndex = TABS.findIndex((tab) => tab.name === activeRouteName);
const translateX = useSharedValue(0);
const lastPositionedIndex = useRef(activeTabIndex);
const hasLiquidGlass = isLiquidGlassAvailable();
const tabWidth = (containerWidth - 16) / TABS.length;
```

**(b) Sitio A — `useEffect`** (`:82-94`) queda:

```tsx
useEffect(() => {
  if (containerWidth <= 0 || lastPositionedIndex.current === activeTabIndex) {
    return;
  }

  const previousIndex = lastPositionedIndex.current;
  lastPositionedIndex.current = activeTabIndex;

  if (activeTabIndex < 0) {
    return;
  }

  const nextX = activeTabIndex * tabWidth;
  translateX.set(
    previousIndex < 0 ? nextX : withSpring(nextX, TAB_INDICATOR_SPRING),
  );
}, [activeTabIndex, containerWidth, tabWidth, translateX]);
```

Notas normativas: `state.index` **desaparece** de las dependencias (lo sustituye
`activeTabIndex`, que es su derivada) — `exhaustive-deps` queda satisfecho sin
excepciones. La guarda de `containerWidth <= 0` sigue **primero** y sigue
volviendo **sin** tocar el ref: si la ruta cambia antes del primer layout, es
`handleLayout` quien coloca, como hoy.

**(c) Sitio B — `handleLayout`** (`:96-108`) queda:

```tsx
function handleLayout(event: LayoutChangeEvent) {
  const { width } = event.nativeEvent.layout;

  if (width <= 0) {
    setContainerWidth(0);
    return;
  }

  const nextTabWidth = (width - 16) / TABS.length;

  if (activeTabIndex >= 0) {
    translateX.set(activeTabIndex * nextTabWidth);
  }

  lastPositionedIndex.current = activeTabIndex;
  setContainerWidth(width);
}
```

La escritura del ref queda **fuera** del `if`: con una ruta ajena registra `-1`,
que es lo que hace que el regreso a una pestaña entre por la rama instantánea.

Total: una constante derivada nueva, tres líneas movidas, un `&&` en el render y
dos guardas. Sin dependencias, sin helpers, sin `useMemo` (una `findIndex` sobre
cinco entradas por render no se memoriza).

### D6 — Inventario de decisiones por celda (elemento repetido)

Son cinco celdas y **cuatro decisiones** en cada una, más la acción de pulsado,
y todas cuelgan de un único booleano por celda, `isActive` (`:164`). Ninguna
cambia con este arreglo (R5 las canda con una ruta ajena activa):

| # | Decisión | Dónde | Activa | Inactiva |
|---|---|---|---|---|
| 1 | `accessibilityState.selected` | `:171` | `true` | `false` |
| 2 | Peso del icono | `:187` | `'Filled'` | `'Outline'` |
| 3 | Color del icono | `:188` | `accent-strong` | `muted` |
| 4 | Clase de la etiqueta | `:191-195` | `text-2xs font-semibold text-accent-strong` | `text-2xs font-semibold text-muted` |
| 5 | Pulsado | `:173-183` | emite `tabPress` y **no** navega | emite `tabPress` y navega a `name` |

Estructura, que R5 cuenta **por hijos y no por `testID`**: cada celda es un
`Pressable` con exactamente **dos** hijos, en orden — icono (hijo 0) y etiqueta
`Text` (hijo 1). Con una ruta ajena activa, las cinco celdas quedan en la columna
"Inactiva" de las cuatro primeras filas y en "navega" de la quinta.
`accessibilityRole="tab"` y el `testID` `tab-<name>` son invariantes de las cinco.

### D7 — Parametrización del fixture de test (sujeto de R1..R5)

`floating-tab-bar.test.tsx:51-75` no admite hoy otra lista de rutas. El cambio es
**aditivo**: el fixture `routes` se queda como está y como valor por defecto, así
que **ninguna llamada existente se toca** y ningún test vivo cambia de
comportamiento.

```ts
const routes = [ … las cinco de hoy, sin tocar …];           // :51-57

const alertsRoute = { key: 'alerts-1', name: 'alerts' };
// el orden que el router produce hoy: las cinco pestañas y después la ajena
const routesWithAlerts = [...routes, alertsRoute];
// la ajena primera: desacopla el índice de state.routes del índice en TABS
const routesAlertsFirst = [alertsRoute, ...routes];

function tabBarProps(
  index = 0,
  stateRoutes: FloatingTabBarProps['state']['routes'] = routes,
): FloatingTabBarProps {
  return {
    state: { index, routes: stateRoutes },
    navigation: { emit: mockEmit, navigate: mockNavigate },
  };
}

async function renderTabBar(
  index = 0,
  stateRoutes: FloatingTabBarProps['state']['routes'] = routes,
) {
  return render(<FloatingTabBar {...tabBarProps(index, stateRoutes)} />, {
    wrapper: TabBarWrapper,
  });
}
```

Índices que produce cada fixture, con ancho 360 (`tabWidth = (360 − 16) / 5 = 68.8`):

| Fixture | Ruta activa | `state.index` | Índice en `TABS` | `translateX` correcto | Lo que da `072cff40` |
|---|---|---|---|---|---|
| `routes` (hoy) | `health` | 2 | 2 | `137.6` | `137.6` (coinciden: por eso la suite no ve nada) |
| `routesWithAlerts` | `alerts` | 5 | −1 | *sin burbuja* | `344` — fuera de rango |
| `routesAlertsFirst` | `map` | 2 | 1 | `68.8` | `137.6` — ranura de `health` |
| `routesAlertsFirst` | `health` | 3 | 2 | `137.6` | `206.4` — ranura de `food` |

Para R5 hacen falta además los iconos observables. Se dobla `reicon-react-native`
con **el patrón que ya usan cinco ficheros del repo** (copiar de
`src/screens/home/index.test.tsx:100-122`), con un `testID` por icono de pestaña:
`icon-tab-home`, `icon-tab-map`, `icon-tab-health`, `icon-tab-food`,
`icon-tab-profile`. El doble reenvía `weight` y `color` como props al `View`, que
es lo que permite candar las decisiones 2 y 3 de D6. **El doble nunca se muta**
para producir un rojo (C4, quinto punto): el rojo de R5 es la mutación M3, que es
de producción.

R5 necesita también el helper `elementChild`, que ya existe en
`src/screens/alerts/index.test.tsx:94-101`: se **copia** a este fichero (nueve
líneas) en vez de extraerlo a `test/`, porque extraer un helper compartido es un
cambio de harness que este arreglo no necesita.

### D8 — Orden incremental: cada rojo es real, sin excepciones que firmar

Los cuatro requisitos de comportamiento (R1..R4) arreglan el mismo componente. Si
la implementación entrase entera en el primer verde, los tests de R2, R3 y R4
nacerían verdes y habría que degradarlos a requisitos de verificación. El orden
de [[tasks]] evita eso: **cada paso deja el componente coherente** y el siguiente
test es rojo de verdad.

| Paso | Qué entra en el verde | Estado intermedio, coherente porque… |
|---|---|---|
| R1 | `activeTabIndex` + el `&&` de la condición de render | los dos sitios siguen escribiendo con `state.index` y el ref sigue guardando `state.index`: la burbuja se posiciona como hoy en las pestañas y **no se monta** en las ajenas |
| R2 | Sitio B pasa a `activeTabIndex` (la escritura del ref **todavía no**) | `handleLayout` escribe el ref con `state.index` y el efecto lo compara con `state.index`: siguen siendo la misma magnitud, la guarda corta y nada mueve la burbuja tras el layout |
| R3 | Sitio A pasa a `activeTabIndex` (la guarda y el ref **todavía no**) | ídem: ref y guarda siguen ambos en `state.index` |
| R4 | El ref y la guarda pasan a `activeTabIndex`, entra el `previousIndex < 0` y el `return` de `activeTabIndex < 0` | queda el código final de D5 |

El único requisito sin rojo natural posible es **R5**, y por eso [[requirements]]
lo declara por escrito como requisito de verificación con la vía (b) de C4 antes
del handoff.

---

## Archivos afectados

- `mobile-pet-tracker/src/components/floating-tab-bar.tsx` — **producción**.
  Los tres *hunks* de D5: orden de declaraciones (`:72-77`), `useEffect`
  (`:82-94`), `handleLayout` (`:96-108`) y el `&&` de la condición de render
  (`:137`). Nada más: ni `TABS`, ni `TAB_INDICATOR_SPRING`, ni el JSX de las
  celdas, ni una `className`.
- `mobile-pet-tracker/src/components/__tests__/floating-tab-bar.test.tsx` —
  **tests**. El fixture parametrizado y el doble de `reicon` de D7, el helper
  `elementChild`, y cinco `describe` nuevos (`#91 R1` … `#91 R5`). Los siete
  `describe` que ya existen no se editan ni se renumeran: sus R-ids son de la
  feature que los creó, no de esta.

Ningún otro fichero. `git diff --stat 072cff40..HEAD` sobre
`mobile-pet-tracker/` debe listar exactamente estos dos (R6).

---

## Alternativas descartadas

- **A1 — Congelar la burbuja donde estaba (no desmontarla).** Descartada: con una
  ruta ajena las cinco celdas se pintan inactivas (§0.4 de [[requirements]]), así
  que una burbuja visible bajo una de ellas contradice a la propia barra. Además
  obligaría a decidir qué pasa si la ruta ajena es la primera pantalla (no hay
  "donde estaba"). Si algún día el producto quiere que la barra señale de qué
  pestaña "cuelga" la ruta ajena, eso es una feature con mapa
  ruta→pestaña explícito, no un `else` aquí.
- **A2 — Acotar el índice (`Math.min(state.index, TABS.length - 1)`).** Descartada:
  pinta `profile` como activa con `alerts` abierto —miente igual— y deja viva la
  causa raíz, que es derivar de `state.routes`. Es el arreglo del síntoma.
- **A3 — Meter `alerts` (y las otras seis rutas) en `TABS`.** Descartada: rompe el
  candado de #78 R5 y cambia el producto (seis pestañas sin decisión de diseño).
- **A4 — Sacar las rutas ajenas del grupo `(tabs)/` o declararlas `href: null`.**
  Es el arreglo estructural de fondo y probablemente llegue algún día, pero toca
  siete rutas y su navegación, y **no sustituye a este**: el componente tiene que
  aguantar una ruta ajena aunque solo sea durante la transición. Queda fuera de
  alcance.
- **A5 — Filtrar `state.routes` a las que están en `TABS` y usar ese índice.**
  Equivalente en resultado, más caro (un `filter` y un `findIndex` por render) y
  sigue leyendo el array del navegador. `TABS.findIndex` es la lectura directa.
- **A6 — No animar el indicador (`expo-animation`: "tab switches never slide").**
  Fuera de alcance: el deslizamiento del indicador lo decidieron #62/#63 y la
  carta de UI, tiene tests vivos y no es el defecto reportado.
- **A7 — Extraer `elementChild` a `test/` y compartirlo.** Descartada por ahora:
  dos ficheros no justifican un módulo de harness. Cuando lo pida un tercero.

---

## Riesgos y notas

- **El orden de `state.routes` lo decide Expo Router**, no el repo, y puede
  cambiar en una subida de SDK (`expo` `~57.0.14`, `expo-router` `~57.0.14`). El
  arreglo deja de depender de él: esa es la ganancia estructural, y R2/R3 la
  candan con el fixture de orden invertido.
- **Reanimated 4.5.1 con `setUpTests()`** (`test/jest-setup.js`): las animaciones
  progresan con los temporizadores falsos. R4 se apoya en ello para distinguir
  "colocada ya" de "animándose hacia allí". Si algún día se sustituye por el mock
  estático de Reanimated, R4 deja de discriminar y habría que reescribirlo — se
  anota aquí para que quede dicho.
- **`useSharedValue` no se lee en render** en ningún punto del arreglo
  (`expo-animation` §6): las escrituras siguen viviendo en el efecto y en el
  manejador de layout, como hoy.
- **Un solo escritor sobre el working tree** (`CLAUDE.md` §Implementación):
  mientras Codex implementa, nadie más toca `mobile-pet-tracker/`.
