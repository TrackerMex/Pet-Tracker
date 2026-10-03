---
feature: "mobile-source-lock-slice-blind-spots"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Diseño — [[mobile-source-lock-slice-blind-spots]] (#122)

> Ver [[requirements]] para los requisitos y [[tasks]] para el orden TDD.
> **Todas las tablas están medidas con jest, no simuladas**, sobre `fc1461e6`
> (mismo código de app que `origin/main` = `f72c1fc0`). Método: cada mutación
> se escribió en producción y se revirtió después, comprobando el blob, y
> `git diff --exit-code -- mobile-pet-tracker/src` dio 0 al final. En cada
> corrida, jest ejecutó a la vez:
>
> - el fichero de test **de hoy** (columna «hoy»), y
> - una **copia temporal** del mismo fichero con los literales de [[tasks]] ya
>   aplicados (columna «nuevo»). La copia vivía junto al original para heredar
>   sus imports y sus mocks, y se borró al terminar.
>
> Los ficheros versionados de test no se editaron. Los commits rojos de Codex
> lo confirman con los ficheros reales.

## Decisión: dos defensas, una por familia

Los puntos ciegos de los tres candados son de tres familias
([[requirements]] §Contexto mínimo). Se cierran con dos defensas:

| Defensa | Dónde | Cierra | Coste |
|---|---|---|---|
| **R1: unicidad del ancla** | una línea en cada uno de los tres candados de fuente, justo antes de la regex | familia 1: P4, O5, O5h, y O4 pasa a rojo declarado | 3 líneas y 3 títulos |
| **R2: pata que pulsa** | un `it` nuevo por call-site, al lado de su candado | familias 2 y 3: P1, P2, P2b, O1, O3 y O2. De propina, P4 y O5 | 3 `it` de 11 líneas |

```ts
// R1, en el candado de fuente, justo antes de la regex de la receta
expect(source.lastIndexOf('testID="home-alerts-bell"')).toBe(anchor);

// R2, un it nuevo
await fireEvent(bell, 'responderGrant', {
  nativeEvent: {},
  persist: () => undefined,
});

expect(bell).toHaveStyle({ opacity: 0.8 });
```

**Por qué hacen falta las dos.** La pata que pulsa ve lo que corre, pero solo
en el estado que renderiza el test. O5h lo demuestra: un ternario cuya rama
renderizada por los tests lleva la receta, y cuya otra rama no la lleva, deja
verde la pata que pulsa en los tres call-sites. Solo lo ve la unicidad, porque
lee el fuente entero. Al revés, la unicidad no ve nada de las familias 2 y 3.

**Ninguna de las dos es tautológica.** La unicidad compara dos posiciones del
mismo literal del test en el fuente, y cae en P4. La pata que pulsa asevera un
literal (`0.8`) contra el elemento renderizado, sin importar nada de
producción, y cae en V7 (`0.8` → `0.5`): mide el valor de pulsado, no el de
reposo.

## La premisa que cae

`specs/mobile-meal-toggle-source-lock-nesting/design.md` §La tercera vía
conservó la pata de fuente porque «la pata de árbol no ve el valor de
pulsado», y así lo repiten #112 y #121. **Es falso en este stack**
(`@testing-library/react-native` 14.0.1, `react-native` 0.86.2).

Medido sobre la campana, con una copia temporal del fichero de test:

| Evento sobre el host de `home-alerts-bell` | Opacidad antes | Opacidad después |
|---|---|---|
| `await fireEvent(bell, 'pressIn')` | 1 | **1**: no pasa nada |
| `await fireEvent(bell, 'responderGrant', { nativeEvent: {}, persist: () => undefined })` | 1 | **0.8** |
| el mismo `responderGrant`, con O2 en producción | 1 | **1**: cae en rojo |

En S y M lo prueban las tablas de [[#La medición completa]]: los tres
`#122 R2` pasan en la base, caen con N1 y caen con V7.

Por qué:

- `fireEvent(el, 'pressIn')` busca una prop `onPressIn`, primero en el host y
  luego en el `Pressable`. El `Pressable` de producción no tiene ninguna
  propia, así que el evento no llega a nadie.
- `Pressability` cuelga `onResponderGrant` del host. Ese manejador llama a
  `event.persist()`, lee `event.nativeEvent` y, con `delayPressIn` a 0, llama
  en el acto al `onPressIn` interno del `Pressable`, que hace
  `setPressed(true)`. Es el primer evento que emite `userEvent.press`. Por eso
  basta `{ nativeEvent: {}, persist: () => undefined }`.
- No se suelta. `userEvent.press` suelta a los 130 ms y la opacidad vuelve a 1
  antes de que el test pueda leerla. El temporizador de pulsación larga (500 ms)
  queda pendiente, pero ninguno de los tres elementos tiene `onLongPress`, y al
  desmontar el test `usePressability` llama a `pressability.reset()`, que lo
  cancela. La suite entera con las copias temporales pasa sin ningún
  «did not exit», «open handle» ni «Cannot log after tests are done»
  ([[#Recuentos]]).
- El `it` asevera sobre la **misma referencia** que devuelve `findByTestId`, sin
  volver a consultar. Medido: `toHaveStyle` lee las props del host ya
  re-renderizado.

Si una versión futura de React Native cambia `Pressability`, la pata cae en
**rojo** (la opacidad se queda en 1), que es el lado seguro.

## Decisión por punto ciego

| | Qué es | Peso | Decisión | Qué lo cierra | Sonda que lo prueba (VERDE → ROJO en M, B y S) |
|---|---|---|---|---|---|
| **P1** | comentario JSX con la receta entre el `>` y el primer hijo | media | **defendido** | R2 | P1, versionada en el rojo de R2 |
| **P2** | receta comentada con `//` dentro del tag, más `style={{ opacity: 1 }}` | baja | **defendido** | R2 | P2, y P2b con `/* … */` |
| **P4** | señuelo `{false && <Pressable testID=… …receta… />}` delante | baja | **defendido** | R1 (y R2) | P4, versionada en el rojo de R1 |
| **O2** | `{...override}` detrás de la receta, con `style` opcional | media | **defendido** | R2 | O2 |
| **O5** | ternario con dos copias del elemento | baja | **defendido** | R1 siempre; R2 si el test renderiza la rama mala | O5 (en S ya caía hoy por otro test) y O5h |
| **O4** | comentario JSX con el `testID` delante del elemento sano | baja | **defendido**: rojo declarado | R1 | O4: ya era rojo por la regex; ahora cae por la unicidad |
| O1 | la receta dentro de una cadena (`accessibilityHint`) en el tag | baja | defendido | R2 | O1 |
| O3 | `{false && '…receta…'}` antes del primer hijo | baja | defendido | R2 | O3 |
| O2c | `{...(cond ? override : {})}`, con `cond` falso en los tests | baja | **documentado** | — | O2c: verde con las dos defensas |

**Los límites del recorte siguen existiendo.** El límite 2 (lo que hay entre el
`>` y el primer hijo) y el que ahora se llama límite 3 (la regex lee texto)
siguen dando verde en el candado de fuente. Lo que cambia es que ya no pasan en
silencio: la pata que pulsa cae. `docs/conventions.md` lo dice así (R4), y
corrige la justificación del límite 2: «rompe media suite» vale para una cadena
hija (L2), no para un comentario (P1) ni para un `{false && '…'}` (O3).

## La medición completa

«Fuente» es el `it` de R1 (el candado de fuente, renombrado). «Pulsa» es el
`it` de R2. «Otros» cuenta los demás tests del mismo fichero que caen. Hoy no
existe «pulsa». El matcher es el que falla: **regex** es `toMatch` de la
receta, **unicidad** es `toBe` de R1, **reposo** es `toBe(1)` de S, **pulsa**
es `toHaveStyle` de R2 y **render** es un `findByTestId` que no encuentra el
elemento.

### B, `home-alerts-bell` (`src/screens/home/index.test.tsx`)

| | Mutación | Hoy: fuente | Otros | Nuevo: fuente | Nuevo: pulsa | Otros |
|---|---|---|---|---|---|---|
| B0 | base | verde | 0 | verde | verde | 0 |
| **P1** | N1 + `{/* receta */}` antes del `<Bell` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **P2** | receta comentada con `//` + `{ opacity: 1 }` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **P2b** | ídem con `/* … */` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **O1** | N1 + `accessibilityHint="receta"` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **O3** | N1 + `{false && 'receta'}` antes del `<Bell` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **O2** | receta intacta + `{...pressOverride}` detrás | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **P4** | N1 + señuelo con el ancla delante | **verde** | 0 | **ROJO unicidad** | **ROJO pulsa** | 0 |
| **O5** | `{hasOpenAlerts ? (receta) : (N1)}` | **verde** | 0 | **ROJO unicidad** | **ROJO pulsa** | 0 |
| **O5h** | `{!hasOpenAlerts ? (receta) : (N1)}` | **verde** | 0 | **ROJO unicidad** | verde | 0 |
| O4 | `{/* testID="home-alerts-bell" */}` delante, campana sana | ROJO regex | 0 | **ROJO unicidad** | verde | 0 |
| O2c | `{...(hasOpenAlerts ? pressOverride : {})}` | verde | 0 | verde | verde | 0 |
| N1 | estilo → `{ opacity: 1 }` | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| S1p | estilo borrado | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| V7 | `0.8` → `0.5` | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| N1n | N1 + anidado con receta envolviendo `<Bell>` | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| W1 | N1 + autocierre + hermano con receta y los hijos | ROJO regex | 3 | ROJO regex | ROJO pulsa | 3 |
| S2 | N1 + `<Pressable …receta… />` hermano anterior | ROJO regex | 2 | ROJO regex | ROJO pulsa | 2 |
| S3 | ídem, hermano posterior | ROJO regex | 2 | ROJO regex | ROJO pulsa | 2 |
| N2 | anidado sin receta, estilo intacto | verde | 0 | verde | verde | 0 |
| E2 | `hitSlop={0 < 1 ? 8 : 0}` antes del ancla | verde | 0 | verde | verde | 0 |
| E3 | la receta delante del ancla | verde | 0 | verde | verde | 0 |
| E1 | `hitSlop={0 < 1 ? 8 : 0}` entre ancla y receta | ROJO regex | 0 | ROJO regex | verde | 0 |
| V6 | receta en tres líneas | ROJO regex | 0 | ROJO regex | verde | 0 |
| L2 | N1 + la receta como cadena hija | verde | 119 | verde | ROJO render | 120 |
| A0 | ancla → `testID="home-bell"` | ROJO regex | 9 | ROJO regex | ROJO render | 9 |

En L2, el «otro» de más es el `#122 R2` de S: la cadena suelta rompe el render
de toda la Home.

### S, `reminders-see-all` (`src/screens/home/index.test.tsx`)

| | Mutación | Hoy: fuente | Otros | Nuevo: fuente | Nuevo: pulsa | Otros |
|---|---|---|---|---|---|---|
| B0 | base | verde | 0 | verde | verde | 0 |
| **P1** | N1 + `{/* receta */}` antes del `<Text` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **P2** | receta comentada con `//` + `{ opacity: 1 }` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **P2b** | ídem con `/* … */` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **O1** | N1 + `accessibilityHint="receta"` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **O3** | N1 + `{false && 'receta'}` antes del `<Text` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **O2** | receta intacta + `{...pressOverride}` detrás | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **P4** | N1 + señuelo con el ancla delante | **verde** | 0 | **ROJO unicidad** | **ROJO pulsa** | 0 |
| O5 | `{hasOpenAlerts ? (receta) : (N1)}` | verde | **1** | **ROJO unicidad** | **ROJO pulsa** | 1 |
| O5h | `{!hasOpenAlerts ? (receta) : (N1)}` | verde | **1** | **ROJO unicidad** | verde | 1 |
| O4 | `{/* testID="reminders-see-all" */}` delante, enlace sano | ROJO regex | 0 | **ROJO unicidad** | verde | 0 |
| O2c | `{...(hasOpenAlerts ? pressOverride : {})}` | verde | 0 | verde | verde | 0 |
| N1 | estilo → `{ opacity: 1 }` | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| N1n | N1 + anidado con receta envolviendo `<Text>` (la N1 de #112) | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| N1p | sin estilo + anidado con receta | ROJO reposo | 0 | ROJO reposo | ROJO pulsa | 0 |
| S1p | estilo borrado | ROJO reposo | 0 | ROJO reposo | ROJO pulsa | 0 |
| V7 | `0.8` → `0.5` | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| W1 | N1 + autocierre + hermano con receta y el `<Text>` | ROJO regex | 3 | ROJO regex | ROJO pulsa | 3 |
| S2 | N1 + `<Pressable …receta… />` hermano anterior | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| S3 | ídem, hermano posterior | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| N2 | anidado sin receta, estilo intacto | verde | 0 | verde | verde | 0 |
| E2 | `hitSlop={0 < 1 ? 8 : 0}` antes del ancla | verde | 0 | verde | verde | 0 |
| E3 | la receta delante del ancla | verde | 0 | verde | verde | 0 |
| E1 | `hitSlop={0 < 1 ? 8 : 0}` entre ancla y receta | ROJO regex | 0 | ROJO regex | verde | 0 |
| V6 | receta en tres líneas | ROJO regex | 0 | ROJO regex | verde | 0 |
| L2 | N1 + la receta como cadena hija | ROJO render | 117 | ROJO render | ROJO render | 118 |

En O5 y O5h el «otro» es `no añade un segundo camino a la lista desde la Home`,
que cuenta los `'/reminders'` del fuente y ve el `router.push` duplicado. **O5
no era un hueco en S**. En L2 el de más es el `#122 R2` de B.

### M, `meal-toggle` (`src/app/(tabs)/__tests__/food.test.tsx`)

| | Mutación | Hoy: fuente | Otros | Nuevo: fuente | Nuevo: pulsa | Otros |
|---|---|---|---|---|---|---|
| B0 | base | verde | 0 | verde | verde | 0 |
| **P1** | N1 + `{/* receta */}` antes del `<Text` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **P2** | receta comentada con `//` + `{ opacity: 1 }` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **P2b** | ídem con `/* … */` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **O1** | N1 + `accessibilityHint="receta"` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **O3** | N1 + `{false && 'receta'}` antes del `<Text` | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **O2** | receta intacta + `{...pressOverride}` detrás | **verde** | 0 | verde | **ROJO pulsa** | 0 |
| **P4** | N1 + señuelo con el ancla delante | **verde** | 0 | **ROJO unicidad** | **ROJO pulsa** | 0 |
| **O5** | `{served ? (receta) : (N1)}` | **verde** | 0 | **ROJO unicidad** | **ROJO pulsa** | 0 |
| **O5h** | `{!served ? (receta) : (N1)}` | **verde** | 0 | **ROJO unicidad** | verde | 0 |
| O4 | ``{/* testID={`meal-toggle-${index}`} */}`` delante, botón sano | ROJO regex | 0 | **ROJO unicidad** | verde | 0 |
| O2c | `{...(served ? pressOverride : {})}` | verde | 0 | verde | verde | 0 |
| N1 | receta → `{ opacity: 1 }` | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| V1 | receta borrada | ROJO regex | 1 | ROJO regex | ROJO pulsa | 1 |
| V2 | receta a un `<Pressable />` hermano anterior | ROJO regex | 1 | ROJO regex | ROJO pulsa | 1 |
| V3 | ídem, hermano posterior | ROJO regex | 1 | ROJO regex | ROJO pulsa | 1 |
| V4 | receta a un `<Pressable>` anidado | ROJO regex | 1 | ROJO regex | ROJO pulsa | 1 |
| V7 | `0.8` → `0.5` | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| N1n | N1 + anidado con receta | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| W1 | N1 + autocierre + hermano con receta y el `<Text>` | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| S2 | N1 + `<Pressable …receta… />` hermano anterior | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| S3 | ídem, hermano posterior | ROJO regex | 0 | ROJO regex | ROJO pulsa | 0 |
| V5 | anidado sin receta, receta intacta | verde | 0 | verde | verde | 0 |
| V6 | receta en una línea | verde | 0 | verde | verde | 0 |
| E2 | `hitSlop={0 < 1 ? 8 : 0}` antes del ancla | verde | 0 | verde | verde | 0 |
| E3 | la receta delante del ancla | verde | 0 | verde | verde | 0 |
| E1 | `hitSlop={0 < 1 ? 8 : 0}` entre ancla y receta | ROJO regex | 0 | ROJO regex | verde | 0 |
| L2 | N1 + la receta como cadena hija | verde | 38 | verde | ROJO render | 38 |
| A0 | ancla → ``testID={`meal-x-${index}`}`` | ROJO regex | 12 | ROJO regex | ROJO render | 12 |

En V1-V4 el «otro» es la pata de reposo de #107 R5
(`expone opacidad 1 en reposo en el árbol renderizado`), que #109 ya contaba.

### Lectura

- **Se cierran nueve verdes falsos por call-site** (ocho en S, donde O5 ya caía
  por otro test): P1, P2, P2b, O1, O3, O2, P4, O5 y O5h. P1, P4 y O2 dejaban la
  **suite móvil entera** en verde (82/1471), con `tsc` y `lint` en 0
  ([[#Recuentos]]).
- **Ninguna fila que hoy es verde con el elemento sano pasa a rojo.** N2, E2,
  E3, V5 y V6 de M siguen verdes en las dos patas.
- **Los cambios declarados van todos hacia rojo o se quedan en rojo.** O4 cambia
  de matcher: de la regex, que caía por casualidad, a la unicidad, que lo
  explica. En las filas que ya eran rojas y además quitan el feedback en
  ejecución, cae también la pata que pulsa. Ninguno se da en la base.
- **E1 y V6 (en B y S) siguen rojos solo por la regex**, con la pata que pulsa
  en verde: el elemento funciona y el candado de fuente protesta por la forma.
  Es la rigidez que #112 y #121 aceptaron, y el hallazgo (F) de
  [[requirements]] §Fuera de alcance.
- **O2c es el límite que queda.** La pata que pulsa solo ve el estado que monta
  el `describe` (sin alertas abiertas en B y S, comida sin servir en M).

## Los guards

`src/screens/home/index.test.tsx` está en **cinco** listas `featureFiles` de
`src/__tests__/design-drift.test.ts`
(`grep -n "'screens/home/index.test.tsx'" src/__tests__/design-drift.test.ts`),
y las cinco usan `FEATURE_STYLE_ESCAPES`: `text-[10px]`, `StyleSheet` y
`HEX_LITERAL = #(?!\d{2,3} R\d)[\da-f]{3,8}\b`, sin distinguir mayúsculas.
Además, `sourceFiles()` solo salta los directorios `__tests__`, así que este
fichero también lo barren el guard de clases arbitrarias (`C8: la UI no usa
clases arbitrarias`) y los de `rounded-[20px]` y `text-[10px]`.

`src/app/(tabs)/__tests__/food.test.tsx` **no lo lee ningún guard**: no está en
ninguna lista `featureFiles` y vive en un `__tests__`. Ya contiene la cita
suelta `(B2, #106/#107)`, que en `index.test.tsx` pondría rojos los cinco
guards.

Consecuencias para lo que escribe Codex en `index.test.tsx`:

- `#122 R1`, `#122 R2` y `(#122 R1)` **pasan**: es la forma de cita que #108
  dejó exenta.
- Una cita suelta, como `#122`, `(#122)`, `ver #122` o `#121/#122`, **pone
  rojos los cinco guards**.
- Tampoco pueden aparecer la palabra `StyleSheet` ni una clase con corchetes.
  `toHaveStyle` no casa con `StyleSheet`.

Medido: el fichero `index.test.tsx` completo, con todos los literales de
[[tasks]] aplicados, sale limpio en `FEATURE_STYLE_ESCAPES`,
`PAIRING_STYLE_ESCAPES`, `MEALS_BAR_STYLE_ESCAPES` y la regex de clases
arbitrarias. Los controles `(#122)`, `#122`, `ver #122` y `#121/#122` salen
sucios en las tres primeras. `design-drift.test.ts` da **55/55** con las
copias temporales presentes.

## Recuentos

Medidos sin pipe sobre `fc1461e6`:

| | Base | Tras #122 |
|---|---|---|
| `src/app/(tabs)/__tests__/food.test.tsx` | **55** tests, exit 0 | **56** (+1) |
| `src/screens/home/index.test.tsx` | **140** tests, exit 0 | **142** (+2) |
| `src/__tests__/design-drift.test.ts` | **55** tests, exit 0 | **55** (+0) |
| suite móvil (`bunx jest`) | **82** suites, **1471** tests, 1 snapshot, exit 0 | **82 / 1474** (+0 / +3) |
| `bunx tsc --noEmit` (con `.expo/types/router.d.ts` ausente) | exit 0, salida vacía | exit 0 |
| `bunx expo lint` | exit 0, salida vacía | exit 0 |

La columna «tras» se midió con las copias temporales presentes (84 suites y
1669 tests, todos verdes, porque las copias duplican los dos ficheros), y
`tsc` y `lint` en 0 con ellas. **El candado es el delta, no el número.** Si otra
feature mergea antes, la cifra absoluta cambia y el delta sigue siendo +0
suites y +3 tests. Quien implemente mide su base al arrancar.

Los agujeros, en la suite entera y con los tests de hoy:

| Producción | Suite móvil | `tsc` | `lint` |
|---|---|---|---|
| P4 en los tres call-sites (el rojo de R1) | **82/1471 verde** | 0 | 0 |
| P1 en los tres call-sites (el rojo de R2) | **82/1471 verde** | 0 | 0 |
| O2 en B | **82/1471 verde** | 0 | 0 |
| control P3 (prop duplicada) en B | — | **2**, TS17001 | — |

**Candados de recuento que podrían moverse: ninguno.** Ningún test cuenta los
`it` de estos dos ficheros ni lee sus números de línea. `#108 R3`
(`design-drift.test.ts`) lee `index.test.tsx` para buscar dos títulos de #106,
que no se tocan. `docs/conventions.md` lo leen tres tests
(`hosting-artifacts.test.ts`, la tabla de `RESET_LINK_HOST`;
`hero-header-amendments.test.ts`, los marcadores de #67; y `#108 R4`, la
sección §Prefijo de feature), y ninguno mira la sección que enmienda R4.

## Coordinación

- **#124** (pendiente) toca el mismo `it` de B, la aserción del icono. Va
  después, en serie. Su entrada localiza el `it` con
  `grep -n "usa la ruta real sin cast Href"`, que sigue dando una coincidencia
  tras el renombrado de R1, y lo describe como «titulado '#121 R1: …'», que
  sigue siendo cierto (el prefijo no cambia).
- **#120** (pendiente) toca `consistency-classnames.test.ts` y
  `legibility-classnames.test.ts`. No hay solape.
- **#123** (sesión Backend, `wt-backend`) toca `add-reminder` y `add-pet`. No
  hay solape de ficheros. Si mergea antes, mueve el recuento absoluto de la
  suite y no el delta.
- `docs/conventions.md` es superficie compartida. R4 sustituye un bloque
  localizado por su contenido y deja intactos los dos párrafos siguientes de la
  sección («No queda ningún recorte…» y «Tampoco vale aseverar…»).

## Archivos afectados

No hay capas de `docs/architecture.md`: la feature no toca `domain`,
`application` ni `infrastructure`. Todo es andamiaje de verificación.

| Archivo | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` | R1: título y línea de unicidad del `#109 R1`. R2: un `it` nuevo. R4: dos comentarios |
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | R1: títulos y líneas de unicidad del `#121 R1` y del `#112 R1`. R2: dos `it` nuevos. R4: cuatro comentarios nuevos y dos enmendados |
| `docs/conventions.md` §Recortes del tag de apertura | R4: se sustituye el bloque de la regla, los límites y la lista de call-sites |
| `mobile-pet-tracker/src/screens/home/index.tsx` y `mobile-pet-tracker/src/app/(tabs)/food.tsx` | **solo dentro de los dos pares rojo→verde**: P4 y después P1, versionadas en el rojo y revertidas en el verde. Diff acumulado **vacío** (R5) |
| `specs/mobile-source-lock-slice-blind-spots/traceability.md` | los hashes, que rellena Codex |
| `progress/impl_mobile-source-lock-slice-blind-spots.md` | el reporte de Codex |

**C8** (`docs/ui-guidelines.md`) se cumple de forma trivial, porque no hay
superficie de UI. El grep-clean aplica a los literales nuevos y lo vigilan los
guards de arriba. P4 y P1 no llevan hex, clases arbitrarias ni `StyleSheet`, y
`tsc` y `lint` dan 0 con cada una.

## Alternativas descartadas

Las dos primeras filas se midieron en Node sobre las mismas mutaciones, con el
recorte exacto de cada call-site y la aserción candidata. Las de «solo R1» y
«solo R2» salen de las tablas de jest de arriba.

| Alternativa | Cierra | Deja abierto | Por qué no |
|---|---|---|---|
| **Recorte cerrado**: `expect(block).toMatch(/>\s*$/)` (lo que el límite 2 llamaba «otro símbolo que vigilar») | P1, O3 y L2 | P2, P2b, O1, O2 | cierra menos que R2 con el mismo coste, y da rojo con un comentario legítimo antes del primer hijo |
| **Sin comentarios en el bloque**: `expect(block).not.toMatch(/\/[/*]/)` | P1, P2, P2b | O1, O3, O2 | da rojo con cualquier comentario legítimo dentro del tag o con una URL en una prop |
| Las dos anteriores juntas | P1, P2, P2b, O3 | O1, O2 | dos líneas por call-site y O2 sigue abierto |
| **Solo R2, sin unicidad** | todo salvo O5h | O5h, y O4 sigue rojo sin declarar | una línea por call-site cierra la otra rama de un ternario en cualquier estado |
| **Solo R1, sin pata que pulsa** | P4, O5, O5h | P1, P2, P2b, O1, O3, O2 | dejaría P1 (media) y O2 (media) abiertos |
| **Unicidad en un `it` propio** | lo mismo que R1 | — | +3 tests que leen el mismo fichero, y el recorte perdería su precondición al lado |
| **Helper compartido** (`src/test-utils/…`) para la unicidad o para pulsar | lo mismo | — | un fichero nuevo, dos imports y otro símbolo que vigilar, para dos líneas por call-site |
| `userEvent.press` | — | — | suelta a los 130 ms y la opacidad vuelve a 1 antes de poder leerla |
| `userEvent.longPress` con temporizadores falsos y lectura a mitad | lo mismo que R2 | — | más código, y mete temporizadores falsos en dos `describe` que no los usan |
| La prop `testOnly_pressed` del `Pressable` | — | — | exige tocar producción |
| **Retirar la pata de fuente** en S y M | — | — | cambia el patrón de `docs/conventions.md`; se registra como (F) |
