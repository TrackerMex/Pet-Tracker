---
feature: "design-drift-hex-guard-rid"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[design-drift-hex-guard-rid]] (#108)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones cerradas, [[tasks]] para el orden TDD y
> [[traceability]] para la matriz R → test → commit.
> Rutas relativas a `mobile-pet-tracker/` salvo donde se indique.
> Base de la branch: `feature/108-design-drift-hex-guard-rid`, cortada de
> `origin/main` en `7ce87d70` (merge del PR #146, que cerró #106 + #107).

## El defecto, en una frase

`src/__tests__/design-drift.test.ts` prohíbe colores hex literales con
`/#[\da-f]{3,8}\b/i`. Los dígitos `0-9` son un subconjunto de los hex, así que
un R-id de tres cifras es a la vez una cita de requisito y un hex de tres
dígitos válido: `#106` casa. La frontera es exacta: `#98` son dos caracteres y
no casa; `#100` en adelante sí. Afecta a toda feature de id ≥ 100.

El arreglo es el **regex**. Devolver los dos literales partidos de
`screens/home/index.test.tsx` a su forma entera es **limpieza**, no arreglo: sin
tocar el regex la trampa vuelve con #109 o #110. Son dos requisitos distintos
(R2 y R3) y esta spec no los confunde.

---

## Premisas verificadas contra el árbol (no heredadas)

Todo lo de esta sección se midió en el worktree `Pet-Tracker-wt-ui` sobre
`73b008da` (tip de la branch, con `7ce87d70` como base). Quien implemente **no
tiene que volver a medirlo**, pero si algo no cuadra, para y avisa.

| Hecho | Cómo se verificó | Valor |
|---|---|---|
| El regex hex está duplicado en 8 guards | conteo del literal `[\da-f]{3,8}` en el fichero | **8** ocurrencias |
| Seis con forma corta `text-[10px]\|#hex\|StyleSheet` | lectura línea a línea | líneas **117, 220, 260, 279, 301, 322** |
| Dos con forma larga (añade `shadow*`/`elevation`) | lectura línea a línea | líneas **197, 343** |
| Las dos largas **no** son iguales | comparación literal | `:197` lleva `StyleSheet\.create`; `:343` lleva `StyleSheet(?:\.create)?` |
| La lista `shadowColor\|shadowOffset\|shadowOpacity\|shadowRadius\|\belevation\s*:` está duplicada | conteo del literal | **2** ocurrencias (`:197` y `:343`) |
| El guard muerde ficheros de test porque las listas los enumeran | lectura de las listas `featureFiles` | 11 entradas `.test.ts(x)`; `screens/home/index.test.tsx` aparece en **cinco** (`:207, :253, :272, :294, :315`) |
| `app/(tabs)/food.tsx` no está en ninguna lista | lectura de las listas | por eso nunca mordió ahí |
| Los literales partidos siguen existiendo, **dos y solo dos** | `grep -n "'#' + '"` | `screens/home/index.test.tsx`: eran `:3790` y `:3835` el 2026-09-22; tras el merge de #110 (`2a9219b3`) son `:3767` y `:3812`. **El número no es el ancla: el ancla es el grep** |
| Toda cita de R-id de `index.test.tsx` usa la forma `#<id> R<n>` | `grep -noE "#[0-9]{2,3}.{0,18}"` | 41 citas; 40 con ` R<n>`, una suelta (`#40)` en `:635`, de dos cifras) |
| Ninguna cita existente de `index.test.tsx` es de tres cifras | mismo grep | todas son de dos cifras; por eso el árbol está verde hoy |
| Unificar las dos formas largas **no** rompería nada hoy | sonda: `pairing/index.tsx` no contiene `StyleSheet` en ninguna forma | la unificación sería un cambio de cobertura **futura**, sin pago hoy (ver [[design]] §2) |
| Revertir los literales **antes** de arreglar el regex pone en rojo 5 guards | sonda: reversión en memoria + regex actual | `:220, :260, :279, :301, :322` → rojo. Con el regex nuevo: verde |
| `docs/conventions.md` no menciona `design-drift.test.ts` | `grep -c` | **0** ocurrencias (es el rojo de R4) |
| Añadir un párrafo a `docs/conventions.md` no rompe ningún test que lea ese fichero | lectura de los cuatro tests que lo leen | `hosting-artifacts.test.ts:90` y `hero-header-amendments.test.ts:52` aseveran marcadores concretos; `nutrition-scope.spec.ts:14` y `notifier-env.spec.ts:48` aseveran la tabla de variables y la ausencia de `OPENAI_`. Ninguno cuenta secciones ni líneas |
| El átomo propuesto resuelve los ocho casos frontera | sonda con `node` sobre las tres formas compuestas | tabla de R2, columna «Espera», 8/8 |

**Skill móvil**: se cargó `expo:expo-overview` (obligatorio por C8 y por
`CLAUDE.md` §UI móvil). Su mapa de skills **no enruta a ninguna leaf** para este
trabajo: no hay UI, ni navegación, ni motion, ni dependencias. La única regla
compartida que aplicaría —instalar con `npx expo install`— queda anulada porque
#108 **no instala nada**, y en este repo se usa `bun`/`bunx` (ver §Reglas de
entorno). Queda escrito para que el reviewer no lo tome por un salto de C8.

---

## Qué firma el humano al aprobar esta spec

Una sola cosa, y no es técnica:

1. **La forma de cita `#<id> R<n>` pasa a ser contrato con una máquina.** Desde
   R2, el guard ignora un `#` seguido de 2-3 dígitos **solo si le sigue
   ` R<dígito>`**. Una cita suelta (`#109`, `#109)`, `#109:`) dentro de un
   fichero vigilado se seguirá leyendo como color y pondrá el guard en rojo. Es
   deliberado: la alternativa —ignorar todo `#` + 3 dígitos decimales— apagaría
   el guard para `#000`, `#111`, `#222` y `#999`, que son colores de verdad.
   R4 escribe esa regla en `docs/conventions.md`, donde ya vive la convención.

**No hay gate de humo**: #108 no cambia una sola línea que llegue al
dispositivo. No se pide dev build, no se pide prueba en Android. El único gate
humano de esta feature es la firma de §Aprobación.

---

## Requisitos funcionales

### R1 — el átomo roto vive en un solo sitio

**WHEN** `src/__tests__/design-drift.test.ts` declara los ocho guards de deriva
de estilo, **THE SYSTEM SHALL** definir el patrón de color hex y la lista de
escapes de sombra **una sola vez cada uno**, como constantes de módulo, y
componer con ellas los ocho guards, de modo que el fichero contenga
**exactamente una** ocurrencia del literal `[\da-f]{3,8}` y **exactamente una**
del literal `shadowColor|shadowOffset|shadowOpacity|shadowRadius`.

**Constantes exactas** (nombres y valores cerrados, ver [[design]] §1):

```ts
const HEX_LITERAL = String.raw`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`;
const ARBITRARY_CLASS = String.raw`[A-Za-z0-9_-]+-\[[^\]]+\]`;
const SHADOW_ESCAPES = String.raw`shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:`;
```

En el commit de R1, `HEX_LITERAL` se extrae **todavía con el valor viejo**
(`String.raw` con `#[\da-f]{3,8}\b`): R1 es una extracción sin cambio de
conducta. La lookahead la añade R2.

**Las tres formas compuestas** (una por cada shape que hoy existe):

```ts
const FEATURE_STYLE_ESCAPES = new RegExp(
  String.raw`text-\[10px\]|${HEX_LITERAL}|StyleSheet`, 'i');
const PAIRING_STYLE_ESCAPES = new RegExp(
  String.raw`${HEX_LITERAL}|${ARBITRARY_CLASS}|StyleSheet\.create|${SHADOW_ESCAPES}`, 'i');
const MEALS_BAR_STYLE_ESCAPES = new RegExp(
  String.raw`${HEX_LITERAL}|${ARBITRARY_CLASS}|StyleSheet(?:\.create)?|${SHADOW_ESCAPES}`, 'i');
```

Consumidores: `FEATURE_STYLE_ESCAPES` en las seis guards cortas (`:117, :220,
:260, :279, :301, :322`), `PAIRING_STYLE_ESCAPES` en `:197`,
`MEALS_BAR_STYLE_ESCAPES` en `:343`.

- **Ninguna de las tres lleva flag `g`.** Con `g`, `.test()` guarda `lastIndex`
  entre llamadas y tanto los guards como la tabla de R2 pasan a depender del
  orden de ejecución.
- **Las dos formas largas siguen siendo distintas**: `:197` prohíbe
  `StyleSheet.create`, `:343` prohíbe también `StyleSheet` a secas. No se
  unifican (razón cerrada en [[design]] §2).
- **`sourceFiles()` (`:25-35`) no se toca.** Modificarlo apagó 14 describes en
  silencio y fue el bloqueante H1 que hizo rechazar la ronda 1 de #94.
- **La línea `:63`** (`filesMatching(/[A-Za-z0-9_-]+-\[[^\]]+\]/)`, guard C8) se
  deja como está: razón en [[design]] §3.

**Test que lo cierra** — `src/__tests__/design-drift.test.ts` ::
`#108 R1: los patrones compartidos se declaran una sola vez`, un `it.each` de
**dos** filas: el átomo hex y la lista de sombra. Cada fila cuenta las
ocurrencias de su literal en el propio fuente del fichero
(`readFileSync(join(sourceRoot, '__tests__', 'design-drift.test.ts'), 'utf8')`)
y espera **1**.

La aguja de búsqueda **se construye por concatenación**, que es el idioma que el
propio fichero ya usa en `:69`, `:96` y `:428`, para que el literal buscado no
aparezca entero en la línea que lo busca:

```ts
['[\\d', 'a-f]{3,8}'].join('')
['shadowColor|shadowOffset', '|shadowOpacity|shadowRadius'].join('')
```

**Rojo natural, por aserción**: hoy los conteos son **8** y **2**, y el test
espera 1. No hay símbolo que falte ni módulo que no resuelva.

---

### R2 — el guard distingue una cita de requisito de un color

**WHEN** cualquiera de las tres formas compuestas evalúa un texto, **THE SYSTEM
SHALL** no disparar ante un `#` seguido de 2 o 3 dígitos cuando a esos dígitos
les sigue ` R<dígito>`, **AND SHALL** seguir disparando ante cualquier otro
literal `#` seguido de 3 a 8 caracteres hex.

Implementación cerrada: la exclusión va como **lookahead negativa dentro del
propio átomo**, `#(?!\d{2,3} R\d)[\da-f]{3,8}\b`, no como una alternativa
hermana. Razón y alternativas descartadas en [[design]] §4.

**Test que lo cierra** — `src/__tests__/design-drift.test.ts` ::
`#108 R2: el guard de estilo distingue un R-id de un color hex`, un `it.each`
sobre esta tabla. Cada fila asevera el **mismo** valor esperado contra las
**tres** formas compuestas (`FEATURE_STYLE_ESCAPES`, `PAIRING_STYLE_ESCAPES`,
`MEALS_BAR_STYLE_ESCAPES`): tres `expect` por fila. Una forma que se olvidara de
componer `HEX_LITERAL` falla ahí.

| # | Caso | Muestra (literal, escrita en el test) | Espera |
|---|---|---|---|
| F1 | R-id de **3 cifras** | `describe('#106 R2: la barra de comidas transiciona su ancho', () => {` | `false` |
| F2 | R-id de **2 cifras** | `describe('#98 R10: la barra de comidas no mete drift de estilo', () => {` | `false` |
| F3 | hex de **3** | `#fff` | `true` |
| F4 | hex de **6** | `#1DA868` | `true` |
| F5 | hex de 3 **todo-decimal** | `#000` | `true` |
| F6 | límite de palabra **distinto del espacio** | `backgroundColor: #1DA868;` | `true` |
| F7 | R-id suelto, **sin** ` R<n>` detrás | `ver el hilo #106, gracias` | `true` |
| F8 | cita **y** color en el mismo texto | `#106 R2 usa el token y no #fff` | `true` |

Por qué esta tabla y no la obvia:

- **F1** es el caso que rompió #106, y es interesante porque `#106` es las dos
  cosas a la vez: R-id y hex de tres dígitos válido.
- **F2** hoy ya no dispara (son dos caracteres, no llegan a `{3,8}`) y **debe
  seguir sin disparar**. Es la fila que detecta que el arreglo rompió algo que
  ya funcionaba.
- **F3, F4, F5** candan la dirección contraria: un arreglo que apagase el guard
  entero pasaría la mitad del test. **F5 es la fila crítica**: `#000` es tres
  dígitos decimales *y* un color real, así que cualquier exclusión puramente
  léxica («tres decimales nunca es color») la pone en rojo.
- **F6** cubre el `\b` contra un límite que no es el espacio.
- **F7** documenta el límite deliberado: la exclusión es **contextual**, no
  léxica. Un `#106` suelto sigue disparando, y eso es lo que R4 escribe en
  `docs/conventions.md`.
- **F8** comprueba que la exclusión no ciega el resto del texto.

Los **valores esperados van escritos literales** en la tabla del test, nunca
derivados de `HEX_LITERAL` ni de ninguna otra constante del fichero: un candado
que asevera contra el símbolo que vigila mueve los dos lados de la igualdad al
mutarlo y no canda nada (lección de `MEALS_BAR_TIMING` en #106, donde 250 → 2500
pasaba en verde).

**Rojo natural, por aserción**: contra el regex actual **solo F1 falla**
(`expect(true).toBe(false)`, tres veces). F2–F8 ya están verdes. Medido con
`node` sobre las tres formas, no supuesto.

La muestra de F1 es **el título real** del describe de #106. Consecuencia
buscada: `grep '#106 R2' src/` devolverá dos aciertos —el describe y su guard—,
nunca cero. Eso no rompe el método de C5; lo refuerza.

---

### R3 — los títulos de #106 vuelven a ser literales enteros

**WHEN** `src/screens/home/index.test.tsx` declara los describes de `#106 R2` y
`#106 R3`, **THE SYSTEM SHALL** escribir el título como un literal entero, sin
concatenación, de modo que `grep '#106 R2' src/` y `grep '#106 R3' src/` los
encuentren.

Los dos literales a devolver (líneas medidas contra el árbol tras el merge de
#146; el título es **exactamente** el que ya cita
`specs/mobile-meals-bar-motion/traceability.md`):

| Línea | Hoy | Debe quedar |
|---|---|---|
| 1.ª | `describe('#' + '106 R2: la barra de comidas transiciona su ancho', () => {` | `describe('#106 R2: la barra de comidas transiciona su ancho', () => {` |
| 2.ª | `describe('#' + '106 R3: reduce motion deja la barra sin animación', () => {` | `describe('#106 R3: reduce motion deja la barra sin animación', () => {` |

No se toca nada más de ese fichero: ni el cuerpo de los describes, ni los otros
títulos, ni el orden. El diff de R3 son **dos líneas**.

**Test que lo cierra** — `src/__tests__/design-drift.test.ts` ::
`#108 R3: los títulos de #106 vuelven a ser literales enteros`, tres tests:

1. Un `it.each` de dos filas: el fuente de `screens/home/index.test.tsx`
   (`readFileSync(join(sourceRoot, 'screens', 'home', 'index.test.tsx'), 'utf8')`)
   contiene el literal `describe('#106 R2: la barra de comidas transiciona su ancho'`
   y el literal `describe('#106 R3: reduce motion deja la barra sin animación'`.
2. Un tercer `it`: ese mismo fuente **no** contiene la concatenación
   `'#' + '106`. Es el candado contra volver a partir el literal si el regex
   regresa.

**Rojo natural, por aserción**: hoy los dos literales enteros no existen y la
concatenación sí. Tres aserciones rojas, ningún símbolo ausente.

**R3 se implementa después de R2, no antes.** Medido: revertir los literales con
el regex viejo pone en rojo los cinco guards que listan
`screens/home/index.test.tsx` (`:220, :260, :279, :301, :322`). Ese rojo sería
**del guard, no del candado de R3**, y falsearía el historial TDD.

---

### R4 — la convención de cita queda escrita donde vive la convención

**WHEN** alguien lee `docs/conventions.md` §«Prefijo de feature cuando un
fichero acumula R-ids de dos specs», **THE SYSTEM SHALL** encontrar allí que
`src/__tests__/design-drift.test.ts` ignora un `#` de 2-3 dígitos **solo** en la
forma `#<id> R<n>`, y que una cita suelta pone el guard en rojo.

Redacción exacta a añadir al final de esa sección (empieza en la línea 157 de
`docs/conventions.md`; el párrafo va justo antes de `### Filtros de jest con
rutas que llevan paréntesis`):

```markdown
El prefijo, además, es **contrato con una máquina**. Desde #108,
`src/__tests__/design-drift.test.ts` ignora un `#` seguido de dos o tres
dígitos **solo cuando le sigue ` R<dígito>`**: esa es la única forma de cita
que sus guards de color hex distinguen de un color. Una cita suelta —`#108`,
`#108)`, `#108:`— dentro de un fichero que alguna lista `featureFiles`
enumere se sigue leyendo como hex y pone el guard en rojo. Cítalo siempre
como `#108 R1`. La exclusión es deliberadamente contextual y no léxica:
ignorar todo `#` de tres dígitos decimales dejaría pasar `#000`, `#111` y
`#999`, que son colores de verdad.
```

**Test que lo cierra** — `src/__tests__/design-drift.test.ts` ::
`#108 R4: la convención de cita del guard está documentada`, un solo `it`. Lee
`docs/conventions.md` (`join(projectRoot, '..', 'docs', 'conventions.md')`,
mismo idioma que el describe `#68 E1` usa con la carta en `:354-358`), recorta
la sección entre `### Prefijo de feature cuando un fichero acumula R-ids de dos
specs` y el siguiente `### `, y asevera que ese recorte contiene
`design-drift.test.ts` y contiene `` `#108 R1` ``.

Se asevera la **sustancia** —la sección nombra el guard y enseña la forma
canónica—, no el párrafo entero: así una reescritura de estilo no lo rompe y un
borrado sí.

**Rojo natural, por aserción**: hoy `docs/conventions.md` contiene
`design-drift.test.ts` **cero** veces (`grep -c`, medido).

---

## Gate numérico

> **Corrección del 2026-09-22, antes de la firma.** Las cifras absolutas de la
> columna «Esperado al cerrar» **ya caducaron**: #110 **mergeó** (`2a9219b3`) y
> subió la suite móvil de **1396 a 1398** (`+2` tests en
> `screens/home/index.test.tsx`, 138 → 140). Con esa base la derivación da
> **1412**, no 1410. Y volverá a caducar: **#112 está registrada y vive en ese
> mismo fichero**. Por eso **el candado es la derivación, no el número**:
> quien implemente **mide la base él mismo al arrancar** y comprueba el delta. Las
> cifras de la tabla se conservan como **descripción de lo que valía el 2026-09-22**,
> y no son el gate.

Baseline medido en este árbol, **sin pipe** (`cmd > fichero; echo $?`, porque
`| tail` devuelve el código de `tail`), con `JEST_EXIT=0`:

| Medida | Baseline el 2026-09-22 (`7ce87d70`) | Tests que suma #108 | Esperado = base + delta |
|---|---|---|---|
| `Test Suites` (móvil) | 77 passed | +0 (no hay fichero nuevo) | **77 passed** |
| `Tests` (móvil) | 1396 passed | **+14** | **1410 passed** |
| `design-drift.test.ts`, tests | 41 | **+14** | **55** |
| `design-drift.test.ts`, describes | 17 | **+4** | **21** |

Los 14 tests nuevos, desglosados: **R1** aporta 2 (un `it.each` de dos agujas),
**R2** aporta 8 (un `it.each` de las ocho filas frontera), **R3** aporta 3 (un
`it.each` de dos títulos más un `it`), **R4** aporta 1. Los 4 describes nuevos
son uno por requisito.

**El recuento final se deriva de esa suma, no de un número suelto.** Si al
cerrar la cuenta no da, la pregunta correcta es qué requisito aportó un test de
más o de menos, no «cuál era el número». Ningún recuento puede **bajar**: un
describe preexistente que deje de correr es un rechazo, pase lo que pase con el
total (así se apagaron 14 describes en silencio en la ronda 1 de #94).

Casillas del reviewer (aquí, no en otro gate):

- [ ] `Test Suites`: **el mismo número que la base**, ni uno menos. #108 no crea
      ningún fichero de test, así que el delta de suites es **+0** siempre
- [ ] `Tests`: **base medida al arrancar `+ 14` exactos**. Con la base del
      2026-09-22 eso eran `1396 → 1410`; si #110 ya mergeó, son `1398 → 1412`.
      **El +14 es el candado; el absoluto es consecuencia**
- [ ] `design-drift.test.ts`: **41 + 14 = 55** tests en **17 + 4 = 21** describes.
      Estas dos sí son estables: ninguna otra feature en vuelo toca ese fichero,
      y si al llegar no valieran 41 y 17, **para** y dilo en el reporte
- [ ] `bunx tsc --noEmit` en `mobile-pet-tracker/` termina en 0
- [ ] `grep -rc "'#' + '106" mobile-pet-tracker/src/` no devuelve ningún acierto
- [ ] `grep -rn '#106 R2' mobile-pet-tracker/src/` devuelve al menos el describe
      de `screens/home/index.test.tsx` (y, por diseño, también su guard)

---

## Reglas de entorno (se repiten aquí porque el handoff no ve esta conversación)

- **`bun` / `bunx` siempre**; nunca `npx`, nunca `npm i -g`.
- **Rutas de jest con `(tabs)` entre comillas simples y con
  `--runTestsByPath`.** Sin comillas, `(tabs)` es un grupo de captura, jest
  salta el fichero **en silencio y con exit 0**. Ningún fichero de #108 vive
  bajo `(tabs)`, pero la suite completa sí los corre.
- **Medir sin pipe**: `cmd > fichero; echo $?`.
- **`rm -f mobile-pet-tracker/.expo/types/router.d.ts` antes de tocar código**:
  está gitignorado y sus rutas fantasma rompen `bunx tsc --noEmit`.
- **Cero dependencias nuevas.** `expo-haptics` ~57.0.3 ya está instalado desde
  #106 y `docs/ui-guidelines.md:171` ya lo refleja: no se vuelve a declarar.
- **No se lanza `./init.sh`.** #108 no toca `backend-pet-tracker/`. Aviso
  heredado, ajeno a esta feature: `init.sh` emite `warn` (no `fail`) por
  `RESEND_API_KEY`, `RESEND_FROM` y `RESET_LINK_HOST` ausentes del `.env`; lleva
  así varias sesiones y no se persigue.
- **Se mide con** `bunx jest` y `bunx tsc --noEmit` desde `mobile-pet-tracker/`.

---

## Fuera de alcance

Clasificada viñeta a viñeta: **(D)** delimitación de esta feature, **(F)** ya
registrado como feature aparte, **(N)** decisión cerrada que no se relitiga.

- **(D) Unificar las dos formas largas** (`:197` y `:343`) en un solo regex. Se
  descarta con razón medida en [[design]] §2. No es una tarea pendiente: es una
  decisión tomada.
- **(D) Extraer `[A-Za-z0-9_-]+-\[[^\]]+\]` del guard C8 de `:63`.** Ese literal
  no es el defecto y `:63` es el guard más ancho del fichero. [[design]] §3.
- **(D) Tocar `sourceFiles()` (`:25-35`) o `allTypeScriptFiles()` (`:37-47`).**
  Prohibido salvo que una enmienda firmada lo justifique.
- **(D) Cambiar qué ficheros vigila cada lista `featureFiles`.** Las 11 entradas
  `.test.ts(x)` se quedan donde están: que el guard muerda ficheros de test es
  intencional y no es el defecto de #108.
- **(D) Retocar los demás títulos de `index.test.tsx`.** Solo los dos partidos
  vuelven a ser literales; los otros 39 ya lo son.
- **(D) Cualquier cambio en `backend-pet-tracker/`, `infra/`, `init.config.sh`
  o CI.**
- **(N) Ignorar todo `#` de tres dígitos decimales.** Apagaría el guard para
  `#000`, `#111`, `#222` y `#999`. Cerrado por la fila F5 de R2.
- **(N) Dependencias nuevas.** El veto vivo es nominal a
  `expo-linear-gradient`, pero #108 no necesita ninguna y no se abre el debate.
- **(F) `mobile-routes-to-screens` (#102)**, ya cerrada, y cualquier movimiento
  de `food.tsx` a `src/screens/`: `app/(tabs)/food.tsx` no está en ninguna lista
  `featureFiles` y esta feature no lo añade.

**Premisas que habría que verificar antes de registrar nada más**: ninguna
pendiente. Todas las afirmaciones del encargo se verificaron una a una contra
el árbol (§Premisas verificadas) y ninguna resultó falsa. La única que cambió el
rumbo al medirla fue la de la unificación: resultó **posible hoy** sin romper
nada, y aun así se descarta por lo que costaría mañana ([[design]] §2).

---

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

Al marcar esta casilla el humano firma también el punto único de §Qué firma el
humano al aprobar esta spec: que `#<id> R<n>` pasa a ser contrato con el guard,
y que una cita suelta de tres cifras en un fichero vigilado seguirá poniéndolo
en rojo a propósito.
