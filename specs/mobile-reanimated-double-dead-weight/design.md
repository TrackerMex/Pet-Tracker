---
feature: "mobile-reanimated-double-dead-weight"
status: spec_ready        # draft | spec_ready | approved
tags: [harness, spec, mobile, tests]
---

# Diseño — [[mobile-reanimated-double-dead-weight]]

> Ver [[requirements]] para los requisitos y [[tasks]] para el orden TDD.
> `docs/architecture.md` (capas domain/application/infrastructure) **no aplica**:
> la app móvil no tiene esas capas y esta feature no añade lógica ninguna.

---

## Decisiones técnicas

### D1 — El borrado son **tres** piezas, no dos

La deuda B3 y la entrada de `feature_list.json` nombran dos. Son tres, porque la
segunda arrastra una declaración que queda huérfana:

| # | Qué se borra | Líneas | Por qué |
|---|---|---|---|
| 1 | `jest.mock('heroui-native', …)` entero, más la línea en blanco que lo sigue | `:124-142` | R1 |
| 2 | `const { View } = jest.requireActual<…>('react-native');` **dentro del mock de Reanimated** | `:147-149` | queda sin uso al borrar la pieza 3 |
| 3 | `default: { ...actual.default, View },` | `:154` | R2 |

Medido: dentro del cuerpo del `jest.mock('react-native-reanimated')`
(`:143-162`), el símbolo `View` aparece **solo** en `:147` (su declaración) y en
`:154` (su único uso). Dejar `:147-149` tras borrar `:154` produce un
`@typescript-eslint/no-unused-vars` — **warning, no error**: `bunx eslint` sale
exit 0 y `bunx tsc --noEmit` también. No rompe el gate, pero es basura y se va.

**Sirve a:** R1 (pieza 1), R2 (piezas 2 y 3).

### D2 — Los candados son **de comportamiento**, no de texto fuente

El reflejo en este repo es candar con `readFileSync` + regex sobre la fuente
(hay tres precedentes). Aquí sería **peor**, por dos razones:

1. **Autorreferencia.** El candado viviría en `index.test.tsx` y tendría que
   aseverar que `index.test.tsx` no contiene `jest.mock('heroui-native'`. La
   aguja literal aparecería entonces en el propio fichero y el candado fallaría
   siempre, salvo partiendo la cadena — exactamente el truco que #108 está
   retirando de este mismo fichero.
2. **Es más débil.** Un candado de texto prueba que *el mock no está escrito*.
   Lo que R1 y R2 quieren es que *el componente real se monte*, que es lo que
   importa y lo que un futuro doble equivalente con otra redacción rompería.

Se miden dos observables del árbol renderizado, los dos discriminantes exactos
y ninguno tautológico (ninguno se compara contra un símbolo importado de
producción):

| Requisito | Aserción | Hoy | Tras el borrado |
|---|---|---|---|
| **R1** | el `className` del nodo `home-loading` contiene `skeleton__root` | `h-12 w-full rounded-card` → **ROJO** | `skeleton__root h-12 w-full rounded-card` → verde |
| **R2** | `Animated.View` **no** es el `View` de `react-native` | son el mismo objeto → **ROJO** | son distintos → verde |

Los dos rojos están **medidos**, no supuestos, sobre copias del fichero en la
base `e4c9ea99`.

`skeleton__root` es la clase base real del componente
(`node_modules/heroui-native/src/components/skeleton/skeleton.styles.ts:38`,
`heroui-native@1.0.8`). Si una subida de `heroui-native` la cambiara, R1 se
pondría rojo — y eso es **información correcta**, no fragilidad: significa que
el componente de terceros cambió su superficie.

**Por qué R2 se canda por identidad y no por `jestAnimatedStyle`:** se midió que
el nodo también gana las props `jestAnimatedStyle` / `jestAnimatedProps` /
`collapsable` cuando `default.View` desaparece, y eso serviría igual de
discriminante. Se descarta porque son hooks internos del preset de jest de
Reanimated; la comparación de identidad dice lo mismo sin depender de internals.

### D3 — Cómo se nombran los describes: `R<n> (mobile-reanimated-double-dead-weight)`

**No se usa la forma canónica `#110 R1`.** Medido: la regex de drift
`/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i` **casa con la cadena `#110`**
(`1`, `1`, `0` son dígitos hex y el espacio siguiente es un `\b`). Los cinco
guards de `design-drift.test.ts` que enumeran `screens/home/index.test.tsx`
(`:207, :253, :272, :294, :315`) leen el fichero como texto y exigen
`violations).toEqual([])`, así que un `#110` literal los pone **los cinco rojos**
por una razón que no tiene nada que ver con #110.

Las tres salidas posibles y por qué se elige la tercera:

| Salida | Veredicto |
|---|---|
| Partir el literal (`'#' + '110 R1: …'`) | **Descartada.** Es el truco que **#108** está retirando de este mismo fichero; añadir un tercero mientras otra sesión quita los dos existentes es trabajar en contra, y puede romper el candado que #108 añada. |
| Esperar a que #108 mergee y arregle el guard | **Descartada.** Acopla #110 a una feature que aún no ha tocado código (su branch solo tiene spec). Ver §Dependencia con #108. |
| Forma `R<n> (<nombre-de-feature>)` | **Elegida.** Sin `#`, no roza el guard. Tiene precedente exacto en el repo para higiene de mocks: `src/screens/add-pet/index.test.tsx:392`, `describe('R1 (mobile-jest-mock-hygiene): …')`. Sigue siendo greppable por nombre de feature. |

**Esto se desvía de `docs/conventions.md` §Tests**, que declara canónica la forma
`#<id> R<n>` y cita precisamente `R1 (mobile-jest-mock-hygiene)` como una de las
formas "sueltas" que esa convención venía a sustituir. La desviación es
deliberada, está medida y es local a este fichero mientras el guard siga
mordiendo R-ids de tres cifras. **Es un punto explícito para el gate humano.**

### D4 — Dónde se insertan los describes nuevos

**Al final de `src/screens/home/index.test.tsx`**, después de la última línea
(`:3984` en la base). Motivo: minimizar el conflicto con las dos features en
vuelo, que trabajan en `:3350-3363` y `:3790` / `:3835`. Un append al final y un
borrado en la cabecera son zonas que git resuelve sin intervención.

### D5 — El arreglo de R3 es **no tocar nada**

R3 pide que el bloque de #62 R8 (`:1302-1323`) quede carácter por carácter
igual. No hay nada que escribir: se verifica con un `git diff` acotado y con la
sonda de mutación. Está aquí como requisito porque es el **valor declarado de la
feature** (criterio de aceptación 2) y porque sin él nadie comprueba que el
implementador no "ayudó" al test.

---

## Zonas prohibidas y su atribución

| Rango | Qué es | Atribución |
|---|---|---|
| `:3790`, `:3835` | literales partidos `'#' + '106 R2…'` / `'#' + '106 R3…'` | **#108**, confirmado: su `requirements.md:227-228` los nombra uno a uno y los restaura a su forma entera |
| `:3350-3363` | candado de `reminders-see-all` que recorta la fuente de `index.tsx` | **#112**, resuelto |

**La disputa, y cómo se resolvió.** Al escribirse esta spec, `design.md`
registró un conflicto: `docs/conventions.md` §Tests atribuía el gemelo a
**#108** y el encargo a **#112**, y desde esta base **#112 no aparecía** —id
máximo 110, sin branch en `origin`—.

**Era una base caducada, no un conflicto real.** Esta branch se cortó de
`e4c9ea99`, y **#112 se registró después**, en `000c85b8` (PR #149). El
`leader` fusionó `main` en esta branch y ahora #112 está aquí, `pending`. La
línea de `conventions.md` también quedó corregida: la escribió #109 cuando
#112 todavía no existía, y la sesión que lleva #108 confirmó después que su
spec firmada acota el fichero y **no lo absorbe**.

Vale la pena dejar registrado **cómo se manifestó**, porque volverá a pasar
mientras haya dos sesiones en paralelo: un `feature_list.json` que no tiene una
entrada no prueba que la entrada no exista, solo que no existía **cuando se
cortó la branch**. Lo que sí es concluyente es `git show origin/main:<ruta>`,
con `git fetch` delante.

Para #110 la consecuencia no cambia: esa zona **no se toca**.

---

## Dependencia con #108 (no bloqueante, pero hay que verla)

`origin/feature/108-design-drift-hex-guard-rid` (`9055466d`) a día de hoy **solo
contiene su spec**: su diff contra `e4c9ea99` toca `feature_list.json`,
`progress/` y `specs/`, y **ni una línea de `index.test.tsx`**. Cuando
implemente, hará dos cosas que rozan a #110:

1. Arreglará el guard de hex para que no muerda R-ids de tres cifras.
2. Restaurará `:3790` y `:3835` a su forma entera.

**#110 no espera a #108.** Con la decisión D3 (nombres sin `#`), #110 es correcto
tanto antes como después de que #108 mergee, y no añade ni quita literales
partidos. La dirección inversa también es segura: #110 borra líneas de la
cabecera (`:124-154`) y añade al final, así que no mueve el contenido que #108
enumera por número de línea más allá de un desplazamiento uniforme que git
reconcilia.

> Riesgo residual conocido (memoria del repo: «spec aprobada caduca al mergear su
> dependencia»): si #108 mergea **antes** de que #110 se implemente y su
> implementación resulta ser distinta de lo que su spec describe, D3 conviene
> re-leerlo. No invalida nada: la forma `R<n> (<feature>)` es válida con guard
> arreglado o sin arreglar.

---

## Gemelos del doble — inventario medido (criterio de aceptación 4)

`grep -rn "jest.mock('heroui-native'\|jest.mock('react-native-reanimated'\|actual.default\|Skeleton:" src/`
sobre la base `e4c9ea99`. Cada hit corrido y clasificado:

| Hit | Qué es | Medido | Clasificación |
|---|---|---|---|
| `src/screens/home/index.test.tsx:124` | doble de `Skeleton` | quitarlo → **138/138 verde** | **El problema.** Lo arregla R1 |
| `src/screens/home/index.test.tsx:154` | `default: { …actual.default, View }` | quitarlo → **138/138 verde** | **El problema.** Lo arregla R2 |
| `src/components/__tests__/pet-hero-header.test.tsx:44-58` | doble de `Skeleton`, sin normalizar `style` | quitarlo → **4 tests ROJOS** de 36 | **Legítimo hoy / ajeno.** Es load-bearing: no es peso muerto. Que sus 4 tests dependan del falso es el mismo problema *de fondo*, pero con coste real. **Fuera de alcance**, candidata a feature propia |
| `src/components/__tests__/pet-hero-header.test.tsx:71` | `default: { …actual.default, View }`, con comentario `:70` que lo justifica | quitarlo → **36/36 verde** | **Gemelo exacto y también peso muerto.** Ajeno: el fichero es de otra feature y su comentario `:70` («HeroUI Skeleton usa Animated.View; el requireActual de Jest no lo trae») queda desmentido. **Fuera de alcance**, se registra por R4 |
| `src/app/__tests__/layout.test.tsx:96` | `jest.mock('heroui-native', () => ({…}))` | — | **Legítimo, no es el mismo patrón**: objeto literal sin `requireActual`, no sustituye `Skeleton` |
| `src/theme/__tests__/theme-transition.test.tsx:18` | doble de Reanimated, objeto literal | — | **Legítimo**: no toca `default.View` |
| `src/screens/home/weekly-activity-chart.test.tsx:58` | doble de Reanimated, objeto literal | — | **Legítimo**: no toca `default.View` |

**Un gemelo exacto del peso muerto** (`pet-hero-header.test.tsx:71`) y **un
pariente load-bearing** (`:44-58`). El alcance de #110 **no** se amplía a
ninguno de los dos: se registran (R4).

---

## Riesgo de `design-drift.test.ts`: medido y descartado

Los cinco guards que enumeran `screens/home/index.test.tsx` leen el fichero con
`readFileSync` y **no lo ejecutan**, así que un cambio de texto podría
dispararlos sin que la suite del fichero se entere. Se comprobó en dos niveles:

1. **Por forma de la aserción**: los cinco son `expect(violations).toEqual([])`
   sobre una regex de prohibición. Un **borrado** solo puede quitar coincidencias,
   nunca añadirlas. Ninguno de los cinco asevera *presencia* de nada en
   `index.test.tsx`.
2. **Empíricamente**: con el borrado de las tres piezas aplicado al fichero real,
   `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts` → **exit 0,
   41/41 verde**.

El riesgo real no era el borrado sino lo que se **añade**: de ahí D3.

---

## Archivos afectados

| Ruta | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | −3 piezas en la cabecera (`:124-142`, `:147-149`, `:154`); +2 describes al final (R1, R2) |
| `docs/conventions.md` | +1 subsección corta en §Tests con el inventario de gemelos (R4) |
| `specs/mobile-reanimated-double-dead-weight/traceability.md` | lo rellena el implementador |
| `feature_list.json` | `pending` → `spec_ready` (lo hace el `spec_author`); a `in_progress` y `done` lo llevan `leader`/`reviewer` |

**Ningún fichero de producción.** Si el trabajo parece necesitar uno: parar.

---

## Alternativas descartadas

- **Borrar solo las dos piezas que nombra B3 y dejar `:147-149`.** Deja un
  `View` huérfano y un warning de lint. Coste de arreglarlo: 3 líneas.
- **Candar por texto fuente con `readFileSync`.** Ver D2: autorreferencia y más
  débil que el candado de comportamiento.
- **Ampliar el alcance a `pet-hero-header.test.tsx`.** Su doble de `Skeleton` es
  load-bearing (4 rojos): sacarlo es arreglar 4 tests de otra feature, que es
  una feature en sí, no un efecto colateral de esta.
- **Cambiar la aserción de #62 R8 a `toBe` para que exija `skeleton__root`.**
  Sería más fuerte, pero reescribe el requisito de una feature firmada sin su
  gate (C6). R1 consigue lo mismo desde un describe propio sin tocar el ajeno.
- **Esperar a #108.** Ver §Dependencia con #108.
- **Usar `jestAnimatedStyle` como discriminante de R2.** Ver D2.
