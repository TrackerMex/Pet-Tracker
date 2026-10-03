---
feature: "mobile-meal-toggle-source-lock-nesting"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Diseño — [[mobile-meal-toggle-source-lock-nesting]] (#109)

> Ver [[requirements]] para los requisitos y [[tasks]] para el orden TDD.
> Todas las tablas de este documento son **medidas**, no estimaciones: se
> obtuvieron simulando el recorte del candado en Node sobre el fuente real de
> `mobile-pet-tracker/src/app/(tabs)/food.tsx` en `73f14d5e`, sin mutar el
> árbol de trabajo.

## Los dos límites, medidos

El encargo pedía determinar **cuál de los dos límites es explotable**. La
respuesta es el **de delante**, y la intuición de partida estaba invertida.

### El de atrás — `lastIndexOf('<Pressable', anchor)` — **se auto-ancla**

El ancla es la cadena ``testID={`meal-toggle-${index}`}``, y vive **dentro
del tag de apertura del propio `meal-toggle`**, dos líneas después de su
`<Pressable`. Por construcción, el `<Pressable` más cercano hacia atrás desde
el ancla es siempre el del `meal-toggle`: ningún `<Pressable>` anterior puede
colarse, porque el del `meal-toggle` está en medio. La medición lo confirma —
**V2 (receta en un hermano anterior) da ROJO**, no verde.

Además, en `73f14d5e` hay **exactamente un** `<Pressable` en todo `food.tsx`
(`grep -c '<Pressable' → 1`, en `:252`), así que hoy no hay ni siquiera un
candidato al que saltar.

Solo hay **una** forma compuesta en la que ese límite falla hacia verde, y hace
falta que ocurran **las dos cosas a la vez**:

```jsx
{/* (i) otro Pressable ANTES en el fichero, con la receta idéntica */}
<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>…</Pressable>
…
{/* (ii) y el meal-toggle deja de deletrearse literalmente `<Pressable` */}
<Animated.Pressable
  testID={`meal-toggle-${index}`}
  …sin receta…
>
```

Medido: `VERDE` — el bloque arranca en el señuelo y la regex casa con el
`style` ajeno. Es el fallo peligroso que el encargo describía, pero **requiere
un renombrado del elemento**, no solo un hermano. No se arregla por separado:
el acotado de R1 lo cierra de paso y sin línea extra (tabla de abajo, V8).

### El de delante — `indexOf('</Pressable>', anchor)` — **es el explotable**

Aquí la intuición de «se corta antes de tiempo, luego falla hacia rojo» no se
sostiene, y esta es la parte que importa: cortar antes **no quita** el tag de
apertura del hijo anidado. Con

```jsx
<Pressable
  testID={`meal-toggle-${index}`}
  …sin receta…
>
  <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
    <Text>…</Text>
  </Pressable>   {/* ← aquí para `indexOf('</Pressable>', anchor)` */}
  …
</Pressable>
```

el bloque va desde el `<Pressable` del `meal-toggle` hasta el `</Pressable>`
**del hijo**, y por tanto **contiene el tag de apertura del hijo con la
receta**. Medido: `VERDE`. El `meal-toggle` se ha quedado sin feedback de
pulsado y el candado no se entera.

La forma general del agujero, y la que hay que recordar: el recorte no
devuelve «el tag del `meal-toggle`», devuelve «desde su `<Pressable` hasta
*algún* `</Pressable>`», y **todo lo que quede en medio cuenta** para la
regex. La cuarta variante que el reviewer midió —«el par aguanta 3 de 4»— es
exactamente esta: **V4, la receta movida a un `<Pressable>` anidado dentro**.
Las otras tres (V1 sin `style`, V2 hermano anterior, V3 hermano posterior)
salen rojas.

## Decisión de acotado: ventana al tag de apertura

El criterio 1 ofrecía **(a)** balance de tags o **(b)** documentar el límite.
Se elige **(a)**, pero **no con un balanceador**. El acotado queda:

```js
const block = source.slice(
  source.lastIndexOf('<', anchor),
  source.indexOf('<', anchor),
);
```

Dos `indexOf`, igual que hoy; lo único que cambia es **qué se busca**: el
carácter `<` en vez del literal `<Pressable` / `</Pressable>`. El bloque pasa a
ser **exactamente el tag de apertura del `meal-toggle`**, desde el `<` que lo
abre hasta el `<` del primer hijo. El anidamiento deja de existir como
problema: dentro del bloque no hay hijos que puedan aportar un `style` ajeno.

**Por qué no un balanceador de tags.** Un balanceador sería código nuevo y no
trivial (contar `<Pressable` / `</Pressable>`, ignorar los que aparecen dentro
de cadenas y comentarios) viviendo en un fichero de test, es decir **un candado
nuevo que a su vez habría que vigilar** — justo lo que B8 avisa al reusar este
tipo de localización. La ventana al tag de apertura no añade ningún símbolo
nuevo, y su modo de fallo es demostrablemente seguro: **solo puede encoger el
bloque**, y encoger nunca fabrica un verde, porque un falso verde necesita
texto ajeno **dentro** del bloque.

**Por qué no solo (b).** Documentar deja V4 en verde, y el criterio 2 del
encargo exige que ante un `Pressable` anidado el candado «siga vigilando el
`style` correcto **o** se ponga rojo». Con (b) a secas no hace ni lo uno ni lo
otro. La documentación se hace igualmente, en R4, encima de (a).

**Reutilización, no invención.** Este recorte ya vive en el repo, en
`mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts:309-311`:

```js
const openingTag = source.slice(source.lastIndexOf('<', use.index), use.index);
```

Es el mismo patrón; #109 solo lo lleva al call-site del `meal-toggle`.

### El límite explícito del patrón (lo que R4 documenta)

Un `<` **dentro** del propio tag de apertura —por ejemplo
`disabled={pendingMealTime < limit}`— parte la ventana antes de tiempo. Si la
receta queda fuera del trozo, el candado se pone **ROJO**. Es un falso rojo
molesto, pero es el lado seguro, y es el motivo por el que el patrón se
documenta en vez de presentarse como infalible.

## La medición completa: viejo recorte vs nuevo

Diez variantes sobre el `food.tsx` real de `73f14d5e`:

| | Variante | Recorte actual | Ventana al tag |
|---|---|---|---|
| — | baseline, producción sana | VERDE ✔ | VERDE ✔ |
| V1 | `style` quitado | ROJO ✔ | ROJO ✔ |
| V2 | receta en `<Pressable>` hermano **anterior** | ROJO ✔ | ROJO ✔ |
| V3 | receta en `<Pressable>` hermano **posterior** | ROJO ✔ | ROJO ✔ |
| **V4** | receta en `<Pressable>` **anidado dentro** | **VERDE ✘ (B2)** | **ROJO ✔** |
| V5 | `<Pressable>` anidado **sin** receta, producción sana | VERDE ✔ | VERDE ✔ |
| V6 | receta reformateada a una línea | VERDE ✔ | VERDE ✔ |
| V7 | `0.8` → `0.5` | ROJO ✔ | ROJO ✔ |
| **V8** | renombrado a `<Animated.Pressable>` **+** señuelo anterior | **VERDE ✘** | **ROJO ✔** |
| **V9** | renombrado a `<Animated.Pressable>`, receta intacta | **ROJO ✘** (falso rojo) | VERDE ✔ |
| **V10** | receta colada entre los hijos y `</Pressable>` | **VERDE ✘** | **ROJO ✔** |

El nuevo recorte cierra V4, V8 y V10, y no abre nada: las siete filas restantes
mantienen su veredicto.

**V9 merece una frase honesta**: el nuevo recorte es *más tolerante* ahí. Deja
de aseverar «el elemento se llama `Pressable`» y asevera «el tag propio del
`meal-toggle` lleva la receta». Es lo correcto —un renombrado a
`Animated.Pressable` que conserva el feedback no es una regresión— y la
identidad del elemento sigue cubierta por la pata de árbol: si el botón dejara
de ser pulsable, `style` no se resolvería a un objeto y `opacityOf` devolvería
`undefined ≠ 1`. **No se añade** un `expect(block).toMatch(/^<Pressable\b/)`
para recuperar esa aserción: sería redundante con la pata de árbol y
reintroduciría el falso rojo de V9.

## La tercera vía: borrar el candado de fuente

Se consideró explícitamente **borrar el `it` de fuente** y dejar que la pata de
árbol cargue sola con R5. Borrar es más barato que acotar. **No vale**, y la
razón es medible en una fila: **V7**.

| | pata de árbol | pata de fuente |
|---|---|---|
| `0.8` → `0.5` | **verde** | **ROJO** |

La pata de árbol solo observa el estado **en reposo**, donde la opacidad es 1
tanto con `0.8` como con `0.5`. La pata de fuente es hoy **el único sitio del
repo donde el valor `0.8` está candado**. Borrarla dejaría R5 de #107
cubriendo la mitad de lo que promete («conserva su feedback de pulsado»), sin
que ningún test se pusiera rojo al hacerlo — exactamente la clase de pérdida
silenciosa que esta feature existe para evitar.

*(La alternativa de candar `0.8` desde el árbol —`fireEvent(toggle, 'pressIn')`
más temporizadores falsos para atravesar el retardo de resaltado de
`Pressability`— se descarta: cambia un recorte de dos líneas por maquinaria de
timers, y el repo ya tiene la lección de la ventana de timers apretada.)*

## El guard de hex no alcanza a este fichero

Premisa del encargo: *«`#109` casa con `/#[\da-f]{3,8}\b/i` de
`design-drift.test.ts`, como le pasó a `#106`; si `#108` no ha mergeado habrá
que partir el literal»*. **Medido: no aplica a este fichero.** Dos razones
independientes, cualquiera basta:

1. El caminante de ficheros de `design-drift.test.ts` (`sourceFiles`, `:25-34`)
   **salta los directorios `__tests__` enteros**
   (`entry.name === '__tests__' ? [] : …`). Simulado sobre el árbol real:
   de los 23 ficheros `*.test.*` que alcanza, `food.test.tsx` **no está**.
2. Las listas explícitas (`featureFiles`) que sí nombran ficheros de test solo
   contienen rutas de `screens/home/`, `screens/pairing/` y `utils/`. La
   entrada de `food` es `'app/(tabs)/food.tsx'` (`:336`, `:431`) —**producción,
   no el test**.

Por eso `#106` sí se partió: sus `describe` viven en
`src/screens/home/index.test.tsx:3790`, que está **junto** a `index.tsx` y no
dentro de un `__tests__/`, así que el caminante sí lo lee.

**Instrucción para Codex:** escribe los títulos con `'#109 R<n>: …'`
**enteros**. No inventes el apaño de `'#' + '109 …'`. Si —contra esta
medición— `bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'`
se pusiera rojo por ello, el escape conocido es el de #106
(`describe('#' + '109 R1: …')`) y hay que anotarlo en
`progress/impl_mobile-meal-toggle-source-lock-nesting.md` para revertirlo
cuando `#108` mergee.

## Archivos afectados

Esta feature no tiene capas de `docs/architecture.md`: no toca `domain`,
`application` ni `infrastructure`. Todo es andamiaje de verificación.

| Archivo | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` | R1: el recorte del `it` de fuente (2 líneas) y su título, que pasa a nombrar `#109 R1`. R4: comentario con el límite del patrón |
| `docs/conventions.md` §Tests | R4: entrada nueva con el patrón, su regla y su modo de fallo |
| `mobile-pet-tracker/src/app/(tabs)/food.tsx` | **Solo dentro del par rojo→verde de R2**, con la mutación V4 versionada en el rojo y revertida en el verde. Diff acumulado: **vacío** (R5) |
| `specs/mobile-meal-toggle-source-lock-nesting/traceability.md` | lo rellena Codex |
| `progress/impl_mobile-meal-toggle-source-lock-nesting.md` | reporte de Codex |

## Riesgo de conflicto con #108

`#108` está en vuelo sobre `src/__tests__/design-drift.test.ts` y
`src/screens/home/index.test.tsx` (rama
`feature/108-design-drift-hex-guard-rid`, ya con handoff a Codex). Dos
precisiones medidas, porque afectan al arranque:

- La **entrada `#108` no existe en el `feature_list.json` de `73f14d5e`**: vive
  solo en su rama. El id 108 está reservado de hecho, no en el fichero. No
  reutilizarlo.
- En `73f14d5e` **no hay ninguna feature `in_progress`**. Si `#108` pasa a
  `in_progress` en su worktree y `#109` también en el suyo, `init.sh` aborta
  (`:156`, una sola feature `in_progress`). Es cosa del leader al abrir la
  sesión de implementación, no de Codex.

**Esta feature no toca ninguno de los dos ficheros**,
y gracias a la medición de §El guard de hex tampoco *depende* de que `#108`
mergee. El único punto de contacto es informativo: el gemelo del patrón roto
vive en `src/screens/home/index.test.tsx:3355-3359` y se deja como trabajo de
seguimiento, **no** como parte de #109.

## Alternativas descartadas

- **Balanceador de tags**: código nuevo no trivial en un fichero de test; un
  candado que a su vez hay que vigilar (aviso B8). La ventana al tag de
  apertura consigue lo mismo sin símbolos nuevos.
- **Solo documentar (vía (b) del criterio 1)**: deja V4 en verde e incumple el
  criterio 2. Se hace **además**, no en lugar de.
- **Borrar el candado de fuente**: pierde el único guard sobre `0.8` (V7).
- **Candar `0.8` desde el árbol con `pressIn` + timers falsos**: sustituye dos
  líneas por maquinaria de temporizadores.
- **Añadir `expect(block).toMatch(/^<Pressable\b/)`**: redundante con la pata
  de árbol y reintroduce el falso rojo de V9.
- **Arreglar de paso el gemelo de `home/index.test.tsx:3355`**: es el arreglo
  de raíz correcto, pero el fichero lo tiene tomado `#108`.
