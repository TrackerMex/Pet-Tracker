---
feature: "mobile-home-bell-source-lock-unbounded"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Diseño — [[mobile-home-bell-source-lock-unbounded]] (#121)

> Ver [[requirements]] para los requisitos y [[tasks]] para el orden TDD.
> **Todas las tablas están medidas, no estimadas**, sobre `e5b73395`, que
> tiene el mismo código de app que `origin/main` = `f44cf3d5`. La columna «hoy»
> es jest real (`bunx jest --runTestsByPath src/screens/home/index.test.tsx`)
> con cada mutación escrita en `src/screens/home/index.tsx` y revertida
> después (`git diff --exit-code` limpio al terminar). La columna «nuevo»
> compone dos mediciones:
>
> - los **otros** tests del fichero, que no dependen del candado y salen del
>   mismo jest;
> - el `it` del candado, simulado en Node con el recorte nuevo exacto y sus
>   cuatro aserciones en orden sobre el mismo fichero mutado.
>
> El test no se editó para medir. El commit rojo de Codex lo confirma con jest.

## Decisión: aplicar el patrón que ya está decidido

`docs/conventions.md` §«Recortes del tag de apertura en candados de fuente» ya
fija el acotado, sus dos límites y cuál de los dos avisa. #109 y #112 lo
aplicaron, y el `reviewer` los aprobó a la primera. La diferencia con ellos es
que aquí **no había recorte mal acotado: no había recorte**. La aserción de la
receta lee `source` entero. Se le añade el recorte y la aserción pasa a leer
`block`:

```ts
const anchor = source.indexOf('testID="home-alerts-bell"');
const block = source.slice(
  source.lastIndexOf('<', anchor),
  source.indexOf('<', anchor),
);
// …
expect(block).toMatch(/…0\.8…/);
```

**Precondiciones del patrón, verificadas en este call-site:**

- El ancla `testID="home-alerts-bell"` aparece **una vez** en `index.tsx`.
- Vive **dentro** del tag de apertura del `<Pressable>` y es su **primera
  prop**.
- En ese tag **no hay ningún `<`**. La prop `accessibilityLabel` ocupa cinco
  líneas con un ternario, pero no lleva `<`. Las flechas `=>` de `style` y
  `onPress` solo llevan `>`, y `indexOf('<', …)` no las ve.
- Entre el `>` del tag y `<Bell` solo hay un salto de línea y sangrado, así
  que el límite 2 (una cadena hija) no mete nada en el bloque.
- Medido en Node sobre la base: el bloque mide **489** caracteres, contiene
  **un único** `<` y termina justo antes de `<Bell size={`.

## Dónde está el agujero

El `it` no renderiza. Tampoco hay ningún otro test que mire el `style` de la
campana: los de `#78 R10` y `#78 R11` comprueban el rol, las clases, el icono,
el punto rojo, la etiqueta y la navegación, pero nunca la opacidad. Así que
**la receta de la campana solo la vigila este candado**, y lo hace contra un
fichero en el que la receta aparece dos veces:

| Copia | Elemento | Localizar |
|---|---|---|
| 1 | `home-alerts-bell` (la campana, en el hero) | `grep -n 'testID="home-alerts-bell"'` |
| 2 | `reminders-see-all` (el enlace de la sección de recordatorios) | `grep -n 'testID="reminders-see-all"'` |

Mientras exista la copia 2, **cualquier** cambio en la receta de la campana
pasa en verde: quitarla, cambiar el `0.8`, llevarla a un hijo o a un hermano.
La forma más simple es **N1** (`style={{ opacity: 1 }}` en la campana), que es
literalmente la del criterio de aceptación. Medido con N1:

| | Resultado |
|---|---|
| `src/screens/home/index.test.tsx` | **140/140 verde**, `exit=0` |
| suite móvil entera (`bunx jest`) | **82 suites / 1452 tests verdes**, 1 snapshot, `exit=0` |
| `bunx tsc --noEmit` | `exit=0` |
| `bunx expo lint` | `exit=0` |
| blob de `index.tsx` con N1 | `675ae7a1c18b400c234a9dbef2950c1175aaf026` |

La campana se queda sin feedback de pulsado, que exige C8 (`CHECKPOINTS.md`,
«Elementos tappables con feedback pressed»), y nada se pone rojo. **N1 es la
mutación que se versiona** en el commit rojo.

**Por qué N1 y no la anidada de #112 (N1n):** en #112 las dos patas compartían
`it` y la de árbol tapaba la forma simple, así que hubo que conservar
`opacity: 1` en reposo y anidar. Aquí no hay pata de árbol. N1 ya atraviesa la
suite entera, y es la mutación más pequeña que demuestra el agujero. N1n se
sondea igualmente (R2), porque es la que cierra el anidamiento.

**El candado no es tautológico.** La regex es un literal del test, no un
símbolo importado de producción, y asevera un valor exacto en vez de
muestrear un continuo. V7 (`0.8` → `0.5`) pasa de verde a rojo con el recorte,
lo que demuestra que el candado mide el valor de **la campana**.

## La aserción se queda en su `it`

Es la opción por defecto (la de #112): el cambio mínimo que acota la receta.

- **Se queda dentro** del `it` que comparte con la ruta y el icono. Separarla
  daría +1 test y no cerraría ninguna fila más de las tablas. Además obligaría
  a retitular el `it` viejo, porque dejaría de «conservar el feedback de
  pulsado», y habría dos `it` leyendo el mismo fichero.
- **El rojo sale solo de `toMatch`.** El orden es ruta, cast, receta e icono.
  Con N1, la ruta y el cast pasan (N1 no toca ni `src/app` ni ninguna ruta), y
  la receta falla. El icono no llega a evaluarse, y pasaría igual, porque N1 no
  toca `<Bell`. Medido en Node.
- **No puede salir un `ReferenceError`.** `anchor` y `block` se declaran en el
  mismo `it`, antes de las aserciones, en el mismo commit que las usa.
- **El recorte va justo después de `const source`**, antes de las aserciones,
  como en #112.

### Título del `it`

C4 exige que el test nombre su R-id, y este fichero acumula R-ids de muchas
specs, así que lleva prefijo (`docs/conventions.md` §Prefijo de feature). El
título nuevo **conserva el viejo entero** como subcadena:

```
'#121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura'
```

Quién cita el título viejo (`grep -rn "usa la ruta real sin cast Href"` fuera de
`mobile-pet-tracker/`):

| Dónde | Qué es | ¿Se toca? |
|---|---|---|
| `specs/mobile-reminders-alerts-to-stack/design.md`, tabla de tests de otras specs, fila 4 | registro histórico de #114 | no: resuelve por subcadena |
| `specs/mobile-reminders-see-all-source-lock-nesting/{requirements,design}.md` | el hallazgo (F) de #112 | no: resuelve por subcadena |
| `feature_list.json`, entrada #121 | la descripción de esta feature | no |

`specs/mobile-alerts-center/traceability.md` (fila R10) cita el `describe`,
que no cambia. `-t 'usa la ruta real sin cast Href'` selecciona el candado
antes y después del renombrado: en el fichero hay una sola coincidencia.

## La medición completa

El texto exacto de cada mutación está en [[tasks]]. «Otros» cuenta los tests
del fichero que caen además del candado. El bloque, antes → después, es el
tamaño del recorte nuevo sobre el fichero mutado.

| | Mutación | Hoy (fichero entero) | Otros | Nuevo (`<` a `<`) | Bloque | ¿Cambia? |
|---|---|---|---|---|---|---|
| B0 | base | VERDE | 0 | VERDE | 489 | no |
| **N1** | estilo → `{ opacity: 1 }` | **VERDE** | 0 (y 0 en la suite) | **ROJO** `toMatch` | 454 | **se cierra** |
| **S1p** | estilo borrado | **VERDE** | 0 | **ROJO** `toMatch` | 417 | **se cierra** |
| **V7** | `0.8` → `0.5` | **VERDE** | 0 | **ROJO** `toMatch` | 489 | **se cierra** |
| **N1n** | N1 + anidado con receta envolviendo `<Bell>` | **VERDE** | 0 | **ROJO** `toMatch` | 454 | **se cierra** |
| **W1** | N1 + autocierre + hermano posterior con receta y los hijos | **VERDE** | 3 | **ROJO** `toMatch` | 453 | **se cierra** |
| **S2** | N1 + `<Pressable …receta… />` hermano anterior | **VERDE** | 2 | **ROJO** `toMatch` | 454 | **se cierra** |
| **S3** | N1 + `<Pressable …receta… />` hermano posterior | **VERDE** | 2 | **ROJO** `toMatch` | 454 | **se cierra** |
| N2 | anidado sin receta, estilo intacto | VERDE | 0 | VERDE | 489 | no |
| E2 | `hitSlop={0 < 1 ? 8 : 0}` antes del ancla | VERDE | 0 | VERDE | 491 | no |
| E3 | la receta delante del ancla | VERDE | 0 | VERDE | 489 | no |
| L2 | N1 + la receta como cadena hija | VERDE (render roto) | 119 | VERDE (render roto) | 530 | no: límite 2 |
| P1 | N1 + la receta en comentario JSX | VERDE | 0 | VERDE | 534 | no: punto ciego de #122 |
| P2 | receta comentada con `//` + `{ opacity: 1 }` | VERDE | 0 | VERDE | 529 | no: punto ciego de #122 |
| P4 | N1 + señuelo `{false && <Pressable testID="home-alerts-bell" …receta… />}` delante | VERDE | 0 | VERDE | 111 | no: punto ciego de #122 |
| **E1** | `hitSlop={0 < 1 ? 8 : 0}` entre ancla y receta | VERDE | 0 | **ROJO** `toMatch` | 76 | **límite 1** |
| **V6** | receta en tres líneas | VERDE | 0 | **ROJO** `toMatch` | 520 | **rigidez de la regex** |
| **A0** | ancla → `testID="home-bell"` | VERDE | 9 | **ROJO** `toMatch` | 0 | **sin ancla** |

Los «otros» que caen:

- con **W1**: `#78 R10 › compone el selector y la campana como dos hijos en ese orden`,
  `#73 R9 › la pildora no entra en el slot: home-hero-actions sigue con dos hijos`
  y `#78 R11 › pinta el punto y anuncia alertas sin leer cuando hay abiertas`;
- con **S2** y **S3**: los dos primeros de W1, por el tercer hijo de
  `home-hero-actions`;
- con **L2**: 119 tests, porque una cadena suelta dentro de un `Pressable`
  rompe el render (`Text strings must be rendered within a <Text> component`);
- con **A0**: 9 tests, todos de `#78 R10` y `#78 R11`, por `findByTestId`.

Lectura:

- **Se cierran siete verdes falsos**, desde la forma más simple (N1) hasta la
  de anidar (N1n) y la de ensanchar la ventana (W1, S2 y S3). Tienen una sola
  causa: la copia de `reminders-see-all`. Con el recorte, esa copia ya no
  alcanza el bloque, porque vive **después** del `<Bell` (el
  `indexOf('<', anchor)` corta antes) y `lastIndexOf('<', anchor)` no puede
  saltar hacia delante.
- **Las filas sin cambio no fabrican ningún rojo falso** con código realista.
- **Los tres cambios van hacia rojo**, y ninguno se da en la base. E1 es el
  límite 1. V6 es la rigidez de la regex, que #112 dejó fuera de alcance: la
  regex de #112 ya daba rojo en V6, y la de la campana se libraba solo por la
  copia ajena. A0 prueba que sin ancla el candado no se queda mirando otra
  cosa: `lastIndexOf('<', -1)` da `-1` y `slice(-1, n)` da la cadena vacía.
- **P1, P2 y P4 son los puntos ciegos que registró el veredicto de #112**
  (`progress/review_mobile-reminders-see-all-source-lock-nesting.md`,
  §Sondas propias en zona ciega), y los tiene #122. Ya estaban en verde con la
  aserción contra el fichero entero. La campana solo pasa a ser un call-site
  más que los hereda. **Se declaran como límite conocido y no se defienden.**
  P3 (una prop duplicada) no entra, porque la para `tsc` con TS17001.

## El guard de hex **sí** alcanza a este fichero

`src/screens/home/index.test.tsx` está en **cinco** listas `featureFiles` de
`src/__tests__/design-drift.test.ts`
(`grep -n "'screens/home/index.test.tsx'" src/__tests__/design-drift.test.ts`),
y las cinco usan `FEATURE_STYLE_ESCAPES`: `text-[10px]`, `StyleSheet` y
`HEX_LITERAL = #(?!\d{2,3} R\d)[\da-f]{3,8}\b`, sin distinguir mayúsculas.

Consecuencias para lo que escribe Codex en ese fichero:

- `#121 R1`, en el título o en el comentario, **pasa**. Es la forma de cita
  que #108 dejó exenta.
- Una cita suelta **pone rojos los cinco guards**: `#121`, `(#121)`,
  `#112/#121` o `ver #121`.
- Tampoco puede aparecer la palabra `StyleSheet`, en ninguna capitalización.

El título y el comentario literales de [[tasks]] se pasaron en Node por las
tres regex del guard (`FEATURE_STYLE_ESCAPES`, `PAIRING_STYLE_ESCAPES` y
`MEALS_BAR_STYLE_ESCAPES`), y el fichero completo con el cambio de R1 y R4
aplicado sale limpio en las tres. Los controles `(#121)`, `#112/#121` y
`ver #121` salen sucios. En la base, `design-drift.test.ts` da **55/55**.

## Recuentos

Medidos sin pipe sobre `e5b73395`:

| | Base | Delta esperado |
|---|---|---|
| `src/screens/home/index.test.tsx` | **140** tests, exit 0 | **+0** |
| `src/__tests__/design-drift.test.ts` | **55** tests, exit 0 | **+0** |
| suite móvil (`bunx jest`) | **82** suites, **1452** tests, 1 snapshot, exit 0 | **+0 / +0** |
| `bunx tsc --noEmit` (con `.expo/types/router.d.ts` borrado) | exit 0, salida vacía | — |
| `bunx expo lint` | exit 0 | — |

R1 **edita** un `it` que ya existe. **El candado es la derivación, no el
número.** Si #84 u otra feature mergea antes, la cifra absoluta cambia y el
delta sigue siendo +0. Quien implemente mide su base al arrancar.

**Candados de recuento que podrían moverse: ninguno.** Ningún test cuenta los
`it` de este fichero ni lee sus números de línea. Los tests que leen su fuente
son `#108 R3`, en `design-drift.test.ts`, que busca dos títulos de #106 que no
se tocan, y los cinco guards de arriba. `docs/conventions.md` lo leen tres
tests, y ninguno mira la sección que enmienda R4:

- `hosting-artifacts.test.ts` lee la tabla de `RESET_LINK_HOST`;
- `hero-header-amendments.test.ts` lee el marcador de la enmienda A9;
- `#108 R4` lee §Prefijo de feature.

## Barrido de gemelos

El barrido de recortes de #112 (su `design.md` §Barrido de gemelos) está hecho
y no se repite. Aquí el barrido es el de **recetas aseveradas contra el
fichero entero**:

| Sitio | Forma | Veredicto |
|---|---|---|
| `src/screens/home/index.test.tsx`, campana (`#78 R10`) | receta de pulsado contra `source` | **esta feature** |
| `src/app/(tabs)/__tests__/food.test.tsx`, `meal-toggle` | receta de pulsado contra el recorte de `<` a `<` | sano (#109) |
| `src/screens/home/index.test.tsx`, `reminders-see-all` | receta de pulsado contra el recorte de `<` a `<` | sano (#112) |
| el mismo `it` de la campana, icono | `toContain('<Bell size={24} color={muted} />')` contra `source` | **latente**: se registra (abajo) |
| el mismo `it` de la campana, cast | `not.toContain("'/alerts' as Href")` contra `source` | sano: una negativa contra el fichero es más estricta |

`grep -rn "opacity: pressed" mobile-pet-tracker/src --include=*.test.*` da
exactamente esas tres regex de receta. **No hay otro gemelo.**

Delimitación: hay más aserciones positivas contra un fichero entero
(`grep -rnE "expect\([A-Za-z]*[sS]ource\)\.(toMatch|toContain)\(" mobile-pet-tracker/src --include=*.test.*`
da 39 líneas, y ninguna menciona `pressed` ni `opacity`). En este fichero son
estructura de código, como `{QUICK_ACTIONS.map(` o
`CATEGORY_SLOTS[slot].surface`. El barrido de esta feature es el de la receta
de pulsado, así que **esas 39 no se auditan aquí**.

**El hallazgo del icono.** La cadena `<Bell size={24} color={muted} />`
aparece **una vez** en `index.tsx`, así que la aserción está viva hoy:

| | Mutación | Resultado |
|---|---|---|
| B1 | el icono de la campana pasa a `color={accent}` | ROJO por `toContain`, sin otros (139/140) |
| B2 | B1 + `{false && <Bell size={24} color={muted} />}` justo después del `</Pressable>` de la campana | **VERDE 140/140** |

Es la misma forma que el agujero de esta feature, pero **latente**: necesita
una segunda copia, que hoy no existe. El árbol no lo cubre, porque
`compone el selector y la campana…` solo asevera
`expect(icon.props.color).toBeDefined()`. El límite de alcance que heredó esta
feature de #112 dice que esas aserciones no se tocan, así que se registra y
**no se arregla**. El `leader` decide si abre feature con id contra
`origin/main`.

## Coordinación

- **#84** (sesión Backend, `feature/84-reminder-dates-days-until-drift`):
  `git diff --stat origin/main...origin/feature/84-reminder-dates-days-until-drift`
  toca `src/utils/reminder-dates{,.test}.ts`,
  `src/screens/reminders/index.test.tsx`, sus `specs/` y `progress/`,
  `feature_list.json` y `progress/current.md`. **No toca
  `src/screens/home/*` ni `docs/`.** Si mergea antes, sube el recuento
  absoluto de la suite y el delta de #121 no cambia. `feature_list.json` y
  `progress/current.md` los resuelve el `leader`.
- **#122** (pendiente, sin spec): su entrada en `feature_list.json` habla de
  los puntos ciegos «en los dos call-sites» y los localiza con
  `grep -rn "lastIndexOf('<', anchor)" mobile-pet-tracker/src`. Tras #121 ese
  grep da **tres** call-sites: `meal-toggle`, `reminders-see-all` y la campana.
  El grep ya encuentra el tercero, pero el recuento «dos» de la entrada
  caduca. **No es alcance de #121.** Se avisa al `leader`, que decide si
  enmienda la entrada antes de escribir la spec de #122.
- **#120** (pendiente) toca `consistency-classnames.test.ts` y
  `legibility-classnames.test.ts`. No hay solape.
- `docs/conventions.md` es superficie compartida, y #122 también la tocará.
  R4 solo sustituye un bloque, localizado por su contenido, y no toca el
  párrafo del límite 2, que es el de #122.

## Archivos afectados

No hay capas de `docs/architecture.md`: esta feature no toca `domain`,
`application` ni `infrastructure`. Todo es andamiaje de verificación.

| Archivo | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | R1: el título del `it`, las 5 líneas de `anchor` y `block`, y `expect(source).toMatch(` → `expect(block).toMatch(`. R4: un comentario de 4 líneas encima del `const block` |
| `docs/conventions.md` §Recortes del tag de apertura | R4: se sustituye el bloque final de la sección |
| `mobile-pet-tracker/src/screens/home/index.tsx` | **solo dentro del par rojo→verde**: N1 versionada en el rojo y revertida en el verde. El diff acumulado es **vacío** (R5) |
| `specs/mobile-home-bell-source-lock-unbounded/traceability.md` | los hashes, que rellena Codex |
| `progress/impl_mobile-home-bell-source-lock-unbounded.md` | el reporte de Codex |

**C8** (`docs/ui-guidelines.md`) se cumple de forma trivial, porque no hay
superficie de UI. El grep-clean aplica al comentario, y lo vigilan los guards
de `design-drift.test.ts` (ver arriba). La mutación N1 usa
`style={{ opacity: 1 }}`, sin hex ni clases arbitrarias, así que el commit rojo
tampoco ensucia el grep (medido: `tsc` y `lint` en `exit=0` con N1).

## Alternativas descartadas

- **Sacar la aserción de la receta a un `it` propio**: da +1 test, obliga a
  retitular el `it` viejo y no cierra ninguna fila más de la tabla.
- **Versionar N1n (la anidada de #112)**: aquí no hace falta, porque N1 ya
  demuestra el agujero en toda la suite, y es la mutación del criterio de
  aceptación. N1n se sondea igualmente en R2.
- **Contar las copias de la receta** (`toHaveLength(2)`): no dice de quién es
  cada copia. Además se rompe en cuanto otro elemento adopte la receta, que es
  justo lo que pide C8.
- **Sustituir el candado de fuente por uno de árbol** (`pressIn` y opacidad
  0.8): cambia lo que se asevera y el patrón que ya decidió
  `docs/conventions.md`. #112 conservó la pata de fuente por el mismo motivo.
- **Anclar en `router.push('/alerts')`** en vez de en el `testID`: vive en el
  mismo tag, pero **después** de la receta, así que `lastIndexOf('<', anchor)`
  seguiría funcionando. Aun así, el patrón ancla en el `testID`, que es la
  primera prop, la identidad del elemento y lo que usan los otros dos
  call-sites.
- **Aseverar la unicidad del ancla** (`indexOf === lastIndexOf`) para cerrar
  P4: es una decisión de patrón que tiene #122.
- **Arreglar de paso la aserción del icono**: el límite de alcance heredado de
  #112 dice que las otras aserciones del `it` no cambian. Se registra
  ([[#Barrido de gemelos]]).
- **Enmendar las citas del título viejo**: no hace falta, porque sobrevive
  como subcadena.
