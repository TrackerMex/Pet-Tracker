---
feature: "mobile-source-lock-slice-blind-spots"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Requisitos — [[mobile-source-lock-slice-blind-spots]] (#122)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y la medición que las sostiene, [[tasks]]
> para el orden TDD, los literales y las sondas, y [[traceability]] para el
> cierre.
>
> Origen: Obs. 1-3 del veredicto de #112
> (`progress/review_mobile-reminders-see-all-source-lock-nesting.md`, sondas
> P1, P2 y P4) y Obs. 1-3 del veredicto de #121
> (`progress/review_mobile-home-bell-source-lock-unbounded.md`, sondas O2, O5 y
> O4). Los moldes son #112 y #121, mergeadas y aprobadas.
>
> **Esta feature no toca producción.** El trabajo vive en
> `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx`,
> `mobile-pet-tracker/src/screens/home/index.test.tsx` y `docs/conventions.md`.
>
> **Base medida: `fc1461e6`**, que es `origin/main` = `f72c1fc0` (merge de
> #121) más `progress/current.md`; el código de la app es el mismo. **Los
> números de línea no son anclas**: todo se localiza con los `grep` que se
> citan.

## Contexto mínimo para implementar sin más contexto

Hay **tres** candados de fuente que recortan el tag de apertura de `<` a `<`
alrededor de un ancla `testID`.
`grep -rn "lastIndexOf('<', anchor)" mobile-pet-tracker/src` da tres
coincidencias:

| Call-site | Test | `it` (localizar con) | Producción |
|---|---|---|---|
| **M** `meal-toggle` (#109) | `src/app/(tabs)/__tests__/food.test.tsx` | `grep -n "#109 R1: acota el bloque de fuente"` | `src/app/(tabs)/food.tsx`, ``testID={`meal-toggle-${index}`}`` |
| **B** `home-alerts-bell` (#121) | `src/screens/home/index.test.tsx` | `grep -n "usa la ruta real sin cast Href"` | `src/screens/home/index.tsx`, `testID="home-alerts-bell"` |
| **S** `reminders-see-all` (#112) | `src/screens/home/index.test.tsx` | `grep -n "muestra feedback visual al pulsar el enlace"` | `src/screens/home/index.tsx`, `testID="reminders-see-all"` |

Los tres vigilan la misma receta de feedback de pulsado,
`style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}` (en M partida en
tres líneas), que exige C8 (`CHECKPOINTS.md`, «Elementos tappables con
feedback pressed»). Hoy los tres dan **verde con la suite entera** ante
mutaciones que dejan el elemento sin feedback de pulsado. Son de tres familias:

1. **El ancla no es única** (P4, O5): el candado recorta la primera copia del
   `testID`, que puede ser un señuelo o la otra rama de un ternario.
2. **El recorte lee texto, no código** (P1, P2, y sus variantes O1 y O3): una
   receta dentro de un comentario JSX, de un `{false && '…'}`, de un comentario
   `//` o de una cadena casa con la regex.
3. **El candado lee texto, no lo que corre** (O2): un `{...override}` detrás de
   la receta la pisa en ejecución, y ni `tsc` ni `lint` lo paran.

Esta feature cierra la familia 1 con una **aserción de unicidad del ancla** en
los tres candados (R1) y las familias 2 y 3 con una **pata de árbol que pulsa**
cada elemento y lee su opacidad (R2). [[design]] §La premisa que cae mide por
qué la pata que pulsa es posible en este stack, cosa que #109 daba por
imposible.

## Premisas de la entrada, verificadas contra el árbol

| Premisa (`feature_list.json`, #122) | Veredicto | Evidencia |
|---|---|---|
| Hay tres call-sites del recorte de `<` a `<` | **cierta** | el `grep` de arriba da 3 |
| P1 deja el fichero verde con el tag en `opacity: 1` | **cierta en los tres** | M 55/55, B y S 140/140 ([[design]] §La medición completa) |
| «Rompe media suite» es cierto para una cadena hija y falso para un comentario | **cierta** | L2 tumba 119 tests en B, 118 en S y 38 en M; P1 y O3 no tumban ninguno |
| P2 (receta comentada con `//` en el tag) da verde | **cierta en los tres** | también con `/* … */` (P2b) |
| P4 (señuelo `{false && …}` delante) da verde; lo cerraría `indexOf === lastIndexOf` | **cierta en los tres** | R1 lo cierra |
| P3 (prop duplicada) la para `tsc` con TS17001 | **cierta** | [[design]] §Recuentos, control P3 |
| O2 deja verdes el fichero, la suite (82/1471), `tsc` y `lint`, también en S | **cierta** | y también en M |
| «Solo lo cierra una pata de árbol que pulse (**pressIn** y opacidad 0.8)» | **cierta la idea, falso el mecanismo** | `fireEvent(el, 'pressIn')` no hace nada: la opacidad se queda en 1. Lo que funciona es `fireEvent(el, 'responderGrant', …)` ([[design]] §La premisa que cae) |
| O5 (ternario con dos elementos) deja todo verde | **cierta en B y M; falsa en S** | en S ya cae hoy `no añade un segundo camino a la lista desde la Home`, que cuenta los `'/reminders'` del fuente |
| O4 tumba el candado de B por `toMatch` sin estar declarado | **cierta, y en los tres** | pasa a rojo declarado por la unicidad (R3) |
| `food.test.tsx` tiene restricciones de guard como `index.test.tsx` | **falsa** | ningún guard de `design-drift.test.ts` lo lee, y ya contiene `(B2, #106/#107)` ([[design]] §Los guards) |

## Requisitos funcionales

- **R1**: WHEN cada uno de los tres candados de fuente recorta su tag de
  apertura, THE SYSTEM SHALL aseverar que su ancla aparece **una sola vez** en
  el fichero de producción, con una línea
  `expect(source.lastIndexOf('<ancla>')).toBe(anchor);` en la que `<ancla>`
  es el **mismo literal** que ya usa su `const anchor = source.indexOf(…)`.
  La línea SHALL ir en el mismo `it`, **justo antes** de su
  `expect(block).toMatch(` de la receta. Cada uno de los tres `it` SHALL
  renombrarse añadiendo al final de su título `, con ancla única (#122 R1)`,
  conservando entero el título viejo:

  | | Título nuevo |
  |---|---|
  | M | `'#109 R1: acota el bloque de fuente al tag de apertura propio del meal-toggle, con ancla única (#122 R1)'` |
  | B | `'#121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura, con ancla única (#122 R1)'` |
  | S | `'#112 R1: muestra feedback visual al pulsar el enlace, acotado a su tag de apertura, con ancla única (#122 R1)'` |

  El resto de cada `it` (ancla, recorte, regex, pata de reposo de S, ruta,
  cast e icono de B) SHALL quedar **idéntico byte a byte** y en su orden.

- **R2**: WHEN cada uno de los tres elementos se renderiza con los mocks del
  `describe` de su candado y recibe
  `fireEvent(<elemento>, 'responderGrant', { nativeEvent: {}, persist: () => undefined })`,
  THE SYSTEM SHALL mostrar el elemento con opacidad **0.8**, aseverado con
  `expect(<elemento>).toHaveStyle({ opacity: 0.8 })`. Son tres `it` nuevos,
  cada uno **justo después** del `it` de R1 de su call-site y en su mismo
  `describe`:

  | | Título | `describe` |
  |---|---|---|
  | M | `'#122 R2: el botón baja a opacidad 0.8 mientras se pulsa'` | `#107 R5: el botón por franja conserva su feedback de pulsado` |
  | B | `'#122 R2: la campana baja a opacidad 0.8 mientras se pulsa'` | `#78 R10: la campana vive en el hero y lleva al centro de alertas` |
  | S | `'#122 R2: el enlace baja a opacidad 0.8 mientras se pulsa'` | `#70 R10: enlace a la lista de recordatorios` |

- **R3**: WHEN la producción se muta a cualquiera de las sondas de [[tasks]]
  §R3, THE SYSTEM SHALL dar el veredicto de su columna «Exigido». En resumen:

  1. **Se cierran** (hoy verde con la suite entera, ahora rojo), en los tres
     call-sites: **P1, P2, P2b, O1, O3 y O2** caen por la pata que pulsa (R2);
     **P4 y O5** caen por la unicidad (R1) y por la pata que pulsa; **O5h**
     (el ternario cuya rama renderizada por los tests lleva la receta) cae
     **solo** por la unicidad. En S, O5 y O5h ya caían hoy por otro test
     (`no añade un segundo camino a la lista desde la Home`).
  2. **Cambios declarados, todos hacia rojo o dentro del rojo:**
     - **O4** (un comentario JSX con el `testID` delante del elemento sano)
       pasa de caer por la regex, sin declarar, a caer por la **unicidad**, en
       los tres.
     - En las sondas que ya eran rojas y además quitan el feedback en
       ejecución (N1, S1p, V7, N1n, N1p, W1, S2, S3 y V1-V4 de #109), cae
       **también** el `it` de R2. El `it` de R1 falla por el mismo matcher que
       hoy.
     - En L2 y A0, el `it` de R2 cae por el render o por `findByTestId`, igual
       que los demás tests del fichero que ya caían.
  3. **Sin cambio**: N2, E2, E3, V5 y V6 de M siguen verdes; E1 y V6 de B y S
     siguen rojos solo por la regex, con la pata que pulsa en verde.
  4. **Límite que queda, documentado**: O2c (un `{...override}` que solo se
     aplica en un estado que los tests no renderizan) sigue verde en los tres.

- **R4**: WHEN un lector abra cualquiera de los tres candados o
  `docs/conventions.md` §«Recortes del tag de apertura en candados de fuente»,
  THE SYSTEM SHALL ofrecerle el estado real del patrón **anclado por
  contenido**:
  1. los comentarios literales de [[tasks]] §R4 en los dos ficheros de test:
     uno encima de cada línea de unicidad, uno encima de cada `fireEvent` de
     R2, y las dos frases enmendadas de los comentarios de B y S;
  2. en esa sección de `docs/conventions.md`, el bloque que empieza por
     «Para aislar el tag de apertura de un elemento» y termina en «el mismo
     grep.» **sustituido** por el literal de [[tasks]] §R4. Ese texto SHALL
     dejar de justificar el límite 2 con «rompe media suite», nombrar la
     unicidad del ancla y la pata que pulsa, y no citar números de línea.

- **R5**: WHEN la feature llegue al PR, THE SYSTEM SHALL dejar el diff de
  producción **vacío**:
  `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx 'mobile-pet-tracker/src/app/(tabs)/food.tsx'`
  SHALL salir con 0. Mientras la base siga siendo `f72c1fc0`, los blobs en
  `HEAD` SHALL ser `dbb5b0346895cfc26705bee2257d1f8a8815df6c`
  (`index.tsx`) y `e310ff45ac9a6abc5475e983a2c03e1d7b5f909b` (`food.tsx`), y
  los de los commits rojos los de [[tasks]] §R5. IF algún requisito pareciera
  necesitar tocar producción de forma permanente, THEN el implementador SHALL
  parar y devolver el trabajo.

  Esto **no** contradice R1 ni R2: cada par versiona su mutación en el commit
  rojo y la revierte en el verde (C4, quinto punto). El diff **acumulado** es
  vacío.

## Qué firma el humano al aprobar esta spec

1. **Que se amplía el patrón con dos defensas**, y no se cambia ninguna de las
   que hay: la unicidad del ancla en los tres candados de fuente (R1) y una
   pata de árbol que pulsa en cada call-site (R2). Los candados de fuente, sus
   recortes y sus regex **no se tocan**.
2. **Que cae una premisa de #109**: «la pata de árbol no ve el valor de
   pulsado». Con `fireEvent(el, 'responderGrant', …)` sí lo ve, medido en los
   tres ([[design]] §La premisa que cae).
3. Las decisiones, una por punto ciego ([[design]] §Decisión por punto ciego):

   | | Decisión | Qué lo cierra |
   |---|---|---|
   | **P1** | **defendido** | R2. El límite 2 del recorte sigue existiendo y se re-justifica en `docs/conventions.md` |
   | **P2** | **defendido** | R2. La regex sigue leyendo texto: queda como límite 3 del recorte, documentado |
   | **P4** | **defendido** | R1, y además R2 |
   | **O2** | **defendido** | R2, que es lo único que lo ve |
   | **O5** | **defendido** | R1 en cualquier estado; R2 solo si el test renderiza la rama mala |
   | **O4** | **defendido** | R1: pasa a rojo declarado por la unicidad |

4. Que las mutaciones versionadas son **P4** en los tres call-sites (rojo de
   R1) y **P1** en los tres (rojo de R2). **Cada commit rojo toca dos ficheros
   de producción**, `src/screens/home/index.tsx` y `src/app/(tabs)/food.tsx`,
   y **el par de R1 va antes que el de R2**: con R2 ya puesta, P4 caería
   también por la pata que pulsa y el rojo de R1 no sería solo suyo.
5. Que los tres `it` de R1 se **renombran** añadiendo `, con ancla única
   (#122 R1)`. El título viejo sobrevive entero como subcadena, así que siguen
   resolviendo por `grep` y por `-t` las citas de #109, #112, #121 y la
   entrada de #124 (`grep -n "usa la ruta real sin cast Href"`), y no se
   enmienda ninguna.
6. Que la suite crece en **+3 tests** (los tres `it` de R2) y **+0 suites**:
   M pasa de 55 a 56, `index.test.tsx` de 140 a 142 y la suite móvil de 1471 a
   1474 sobre esta base.
7. Que los cambios declarados de R3 se aceptan: todos van hacia rojo o se
   quedan dentro del rojo, y ninguno se da en la base.
8. Que se descartan el **recorte cerrado** (`expect(block).toMatch(/>\s*$/)`)
   y la **prohibición de comentarios** en el bloque
   (`not.toMatch(/\/[/*]/)`): son defensas de fuente más baratas, pero dejan
   abiertos O2 y O1, y la segunda además P1 ([[design]] §Alternativas).
9. Que el bloque de `docs/conventions.md` que R4 sustituye es el literal de
   [[tasks]] §R4.
10. Que la feature **no lleva prueba de humo en dev build de Android**: el
    diff de producción es vacío.
11. Que **R4 y R5 no tienen test propio**: R4 es documentación y R5 es una
    propiedad del diff. Los cierra el `reviewer` por inspección, y queda
    declarado aquí antes del handoff, como pide C4.

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo que se registra para otra feature y **(N)** premisa
verificada y descartada.

- **(D)** No se tocan los recortes, las regex ni las demás aserciones de los
  tres candados de fuente. V6 (receta partida en líneas en B y S) y E1 (un `<`
  dentro del tag) siguen dando rojo por la regex aunque el elemento funcione:
  es la rigidez que #112 y #121 ya aceptaron.
- **(D)** No se extrae ningún helper compartido: son dos líneas por call-site,
  en dos ficheros ([[design]] §Alternativas).
- **(D)** No se toca `elementWithTestId` (#120), ni la aserción del icono
  `<Bell size={24} color={muted} />` (#124). #124 toca el mismo `it` de B y va
  después, en serie; su `grep` de localización sigue resolviendo.
- **(D)** No se toca la implementación de referencia de
  `src/__tests__/consistency-classnames.test.ts`
  (`lastIndexOf('<', use.index)`): recorre todos los usos de un símbolo y no
  tiene ancla de `testID`, así que la unicidad no aplica.
- **(D)** No se cubre el estado que los tests no renderizan (O2c): la pata que
  pulsa solo ve la rama que el `describe` monta. Queda documentado.
- **(D)** No se añade **ninguna clave de copy**: no se tocan
  `src/i18n/catalog.ts` ni `src/providers/__tests__/language-provider.test.tsx`,
  ni su candado de longitud del catálogo.
- **(D)** No se instala **ninguna dependencia**: `fireEvent` y `toHaveStyle`
  ya son de `@testing-library/react-native` 14.0.1, y los dos ficheros ya
  importan `fireEvent`.
- **(F)** **Con R2, la pata de fuente de S y M queda redundante.** En S y M ya
  hay pata de reposo (`toBe(1)`) y ahora de pulsado, y la de fuente solo añade
  rojos donde el elemento funciona (V6 en S, E1 en los dos). En B no hay pata de
  reposo, así que la de fuente sigue siendo la única que mira el `1` en reposo.
  Retirarla es cambiar el patrón que fija `docs/conventions.md`, así que no se
  hace aquí. El `leader` decide si lo registra con id contra `origin/main`.
- **(N)** *«La pata que pulsa usa `pressIn`.»* **Falso**: ver §Premisas.
- **(N)** *«O5 deja todo verde en los tres.»* **Falso en S**: ver §Premisas.
- **(N)** *«`food.test.tsx` tiene las mismas restricciones de guard que
  `index.test.tsx`.»* **Falso**: ver §Premisas. Aun así, todo lo que se escribe
  en él usa la forma `#122 R<n>`, por coherencia.
- **(N)** *«#123 (sesión Backend) toca estos ficheros.»* **Falso**: trabaja
  `add-reminder` y `add-pet` en `wt-backend`, sin `src/screens/home/*`,
  `src/app/(tabs)/food.tsx` ni `docs/conventions.md`.

## Aprobación

- [ ] **Aprobado por humano** (fecha: ) ← gate obligatorio antes de
      implementar. Al marcar esta casilla el humano firma también los once
      puntos de §Qué firma el humano al aprobar esta spec.

> **Esta es la única casilla de la feature.** No hay gate humano en teléfono:
> sin diff de producción no hay prueba de humo que firmar (punto 10). El cierre
> lo dan el veredicto del `reviewer` y esta casilla.
