---
feature: "design-drift-hex-guard-rid"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Diseño — [[design-drift-hex-guard-rid]] (#108)

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[tasks]] para el orden TDD y [[../../docs/ui-guidelines|ui-guidelines]]
> (gate **C8**) para la carta que rige todo trabajo sobre
> `mobile-pet-tracker/`. Rutas relativas a `mobile-pet-tracker/` salvo donde se
> indique.

**Capa**: ninguna. #108 no toca `domain`, `application` ni `infrastructure`: el
cambio vive entero en la suite de verificación del móvil y en `docs/`. Las
reglas de `docs/architecture.md` no se ven afectadas, y eso es precisamente por
qué esta feature no necesita prueba de humo.

Todas las decisiones de abajo están **cerradas**. Quien implemente no tiene que
elegir nada: si algo no encaja con el árbol, para y avisa en vez de improvisar.

---

## 1. Qué se extrae, qué no, y por qué justo eso

Se extraen a constantes de módulo **tres** trozos de patrón, y se componen con
ellos las **tres** formas de guard que hoy existen:

| Constante | Ocurrencias hoy | Se extrae porque |
|---|---|---|
| `HEX_LITERAL` | **8** | Es el defecto. Está duplicado ocho veces y está mal ocho veces. |
| `SHADOW_ESCAPES` | **2** | Sin extraerlo, las dos formas largas son dos líneas de 180 caracteres que difieren en un solo token, y esa diferencia es **deliberada**. Extraído, la diferencia se ve a simple vista. |
| `ARBITRARY_CLASS` | 2 (en las dos largas) | Mismo motivo que `SHADOW_ESCAPES`: es el ruido que esconde la diferencia. |

El resultado es que las dos formas largas quedan a una sola diferencia visible:

```
PAIRING   ... |StyleSheet\.create|      ...
MEALS_BAR ... |StyleSheet(?:\.create)?| ...
```

Eso convierte la pregunta «¿estas dos son distintas por descuido?» en un «sí,
a propósito» legible, que es justo lo que esta feature tenía que resolver.

**No se extrae nada más.** En particular no se toca `sourceFiles()` (`:25-35`)
ni `allTypeScriptFiles()` (`:37-47`): modificar el primero apagó 14 describes en
silencio y fue el bloqueante H1 que hizo rechazar la ronda 1 de #94.

---

## 2. Decisión: las dos formas largas **no** se unifican (sirve a R1)

El encargo pedía resolver esto explícitamente. Se midió antes de decidir.

**Qué se midió**: `screens/pairing/index.tsx` —el único fichero que vigila el
guard `:197`— **no contiene `StyleSheet` en ninguna forma**, ni con `.create` ni
a secas. Y ninguno de los ficheros de las seis listas cortas contiene
`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation:` ni
una clase arbitraria. Es decir: **unificar los ocho guards en un solo regex hoy
no pondría rojo nada**. La objeción fácil («unificar rompería la suite») es
falsa, y la spec no se apoya en ella.

**Se descarta igual, por tres razones que sí se sostienen**:

1. **Pago cero hoy, factura mañana.** Unificar no arregla nada que esté roto; lo
   único que hace es cambiar qué atrapará cada guard **en el futuro**. Un cambio
   de cobertura sin requisito detrás es alcance que #108 no pidió, y que además
   se cobraría en una feature ajena: el día que alguien añada un `boxShadow` mal
   escrito a `i18n/catalog.ts`, el rojo saldría bajo el describe de #68 R18, que
   no tiene nada que ver.
2. **Duplicaría el trabajo del guard C8 de `:63`.** Las seis formas cortas
   ganarían la alternativa `[A-Za-z0-9_-]+-\[[^\]]+\]`, que `:63` ya vigila
   sobre **todos** los ficheros fuente. Un mismo pecado reportado por dos guards
   distintos hace más difícil, no más fácil, saber quién manda.
3. **`:197` es deliberadamente más laxo que `:343`.** `:343` prohíbe
   `StyleSheet` a secas, lo que también atrapa `import { StyleSheet } from
   'react-native'`; `:197` solo prohíbe `StyleSheet.create`. Apretar `:197` es
   una decisión de producto sobre la pantalla de pairing, no un efecto colateral
   aceptable de un arreglo de regex.

**Entonces, ¿cómo se evita que el arreglo se copie ocho veces?** Con la
extracción de §1: lo que estaba duplicado ocho veces y roto ocho veces
—`HEX_LITERAL`— pasa a estar escrito **una** vez, y las tres formas se componen
a partir de él. La cobertura de cada guard no cambia; el punto por el que las
ocho pasan, sí. Y R1 lo canda con un conteo de ocurrencias que solo acepta 1, de
modo que un futuro copia-y-pega vuelve a poner el fichero en rojo.

---

## 3. Decisión: la línea `:63` se queda como está (sirve a R1)

`:63` es `filesMatching(/[A-Za-z0-9_-]+-\[[^\]]+\]/)`, el guard C8 que barre
**todos** los ficheros fuente. Sustituirlo por `new RegExp(ARBITRARY_CLASS)`
sería equivalente carácter a carácter (ese patrón no depende del flag `i`), pero:

- ese literal **no es el defecto** de #108;
- `:63` es el guard de mayor radio del fichero, y tocarlo por estética es
  exactamente el movimiento que en #94 apagó catorce describes;
- dejarlo fuera mantiene el diff de #108 en lo que la feature pidió.

Consecuencia asumida y escrita para que el reviewer no la lea como un olvido:
tras #108 el literal `[A-Za-z0-9_-]+-\[[^\]]+\]` aparece **dos** veces en el
fichero (la constante y `:63`). Por eso R1 asevera el conteo de `HEX_LITERAL` y
el de `SHADOW_ESCAPES`, y **no** el de `ARBITRARY_CLASS`.

---

## 4. Decisión: lookahead negativa dentro del átomo (sirve a R2)

El valor final es:

```
#(?!\d{2,3} R\d)[\da-f]{3,8}\b
```

Léase: «un `#` que **no** abre una cita de requisito, seguido de 3 a 8
caracteres hex». La exclusión vive **dentro** del átomo hex, no como hermana en
la alternancia.

**Por qué no como alternativa hermana** (`#\d{2,3} R\d|#[\da-f]{3,8}\b`): el
`\b` del patrón viejo casa contra el espacio que sigue a `#106`, así que la
alternativa de exclusión **tiene que ir antes** en el patrón para ganar. Eso
funciona, pero deja el arreglo colgando de un detalle invisible —el orden de dos
alternativas— en un patrón que se compone por interpolación y que ocho guards
consumen. El siguiente que añada una alternativa al principio lo rompe sin
enterarse. La lookahead no tiene orden que respetar: no hay hermana que pueda
adelantarla.

**Por qué no un pre-filtrado del texto** (`contents.replace(/#\d{2,3}(?= R\d)/g,
'')` antes de evaluar): funciona, pero obliga a recordar aplicarlo en los ocho
sitios —el mismo problema que #108 viene a cerrar— y, peor, hace que el guard
evalúe un texto que **no es el del fichero**. El día que un guard reporte una
violación, quien la persiga no podrá buscar en el fichero lo que el test vio.

**Por qué ` R\d` y no `\s+R\d`**: la forma canónica está documentada en
`docs/conventions.md` §«Prefijo de feature cuando un fichero acumula R-ids de
dos specs» como `describe('#63 R5: ...')`, con un espacio. De las 41 citas de
`screens/home/index.test.tsx`, **40 la respetan**; la única suelta es `#40)` en
`:635`, de dos cifras, que nunca disparó. Un espacio literal es la exclusión
más estrecha que cubre la convención documentada, y cuanto más estrecha, menos
agujero: `\s+` empezaría a ignorar también un `#123` al final de una línea
seguida de una línea que empiece por `R4`.

**Por qué 2-3 dígitos y no 1-3**: un `#5` no llega a `{3,8}` y nunca disparó; la
lookahead no tiene que cubrirlo. Se deja en `{2,3}` para que la exclusión
describa exactamente los ids que existen.

**Límite aceptado y escrito**: un R-id **suelto** de tres cifras (`#109`,
`#109)`, `#109:`) dentro de un fichero vigilado seguirá disparando. Es la fila
F7 de R2, es deliberado, y la alternativa —ignorar todo `#` de tres dígitos
decimales— apagaría el guard para `#000`, `#111`, `#222` y `#999`. Por eso R4
escribe la regla en `docs/conventions.md`: si el guard exige una forma de cita,
la forma de cita tiene que estar donde la gente la lee.

---

## 5. Decisión: el candado vive en el mismo fichero que el patrón (sirve a R1-R4)

Los cuatro describes nuevos van en `src/__tests__/design-drift.test.ts`, no en un
módulo nuevo ni en un helper compartido. Tres razones:

1. **`sourceFiles()` salta el directorio `__tests__`**, así que las muestras
   literales de la tabla de R2 (`#fff`, `#1DA868`, `#000`) pueden escribirse tal
   cual sin que ningún guard las muerda. Por eso el fichero ya contiene hoy
   `text-[10px]` literal en `:96` sin problema.
2. **Un módulo nuevo forzaría un `import`**, y un commit rojo que falla por
   «Cannot find module» no es rojo legítimo (CHECKPOINTS C4, cuarto punto).
3. **Cero ficheros nuevos** mantiene `Test Suites` en 77 y hace la aritmética
   del gate numérico trivial de comprobar.

El candado asevera contra los **símbolos reales** que los ocho guards usan
—esas son las tres formas compuestas—, pero con **valores esperados escritos
literales** en la tabla. Es la lección de `MEALS_BAR_TIMING` en #106: un candado
que importa del sitio que vigila el valor que espera mueve los dos lados de la
igualdad al mutar la constante, y pasaba en verde con 250 → 2500.

---

## Archivos afectados

| Fichero | Qué cambia | R-ids |
|---|---|---|
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts` | Añade las constantes `HEX_LITERAL`, `ARBITRARY_CLASS`, `SHADOW_ESCAPES` y las tres formas compuestas; sustituye los ocho regex inline (`:117, :197, :220, :260, :279, :301, :322, :343`) por la forma que le toca a cada uno | R1 |
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts` | Añade la lookahead negativa `(?!\d{2,3} R\d)` a `HEX_LITERAL` | R2 |
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts` | Añade los cuatro describes nuevos: `#108 R1`, `#108 R2`, `#108 R3`, `#108 R4` (14 tests) | R1, R2, R3, R4 |
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | Dos líneas: `:3790` y `:3835` vuelven a ser literales enteros. Nada más | R3 |
| `docs/conventions.md` | Un párrafo al final de §«Prefijo de feature cuando un fichero acumula R-ids de dos specs» (antes de `### Filtros de jest con rutas que llevan paréntesis`) | R4 |

Ni `backend-pet-tracker/`, ni `infra/`, ni `package.json`, ni `init.config.sh`,
ni CI. Cero dependencias nuevas.

---

## Alternativas descartadas

- **Unificar los ocho guards en un solo regex.** §2. Se midió que hoy no
  rompería nada y se descarta igual: cambia cobertura futura sin requisito
  detrás y pisa el guard C8 de `:63`.
- **Exclusión como alternativa hermana, colocada primero.** §4. Funciona, pero
  deja el arreglo dependiendo del orden dentro de una alternancia compuesta por
  interpolación.
- **Pre-filtrar el texto antes de evaluar.** §4. Hay que acordarse en ocho
  sitios y el guard acaba evaluando un texto que no es el del fichero.
- **Excluir léxicamente todo `#` de tres dígitos decimales.** Apagaría el guard
  para `#000`, `#111`, `#222`, `#999`. Es el arreglo que «pasaría la mitad del
  test», y la fila F5 de R2 existe para impedirlo.
- **Solo revertir los dos literales partidos, sin tocar el regex.** Compra un
  respiro hasta #109 o #110. Además, medido: hacerlo **sin** el arreglo pone en
  rojo los cinco guards que listan `screens/home/index.test.tsx`.
- **Sacar las constantes a un módulo `test/style-escapes.ts`.** §5. Obliga a un
  `import` y convierte el primer rojo en un «Cannot find module», que C4
  rechaza explícitamente.
- **Congelar `.source` de las tres formas compuestas en el test.** Sería el
  candado más estricto, pero se rompe con cualquier alternativa legítima que
  alguien añada mañana y no distingue un cambio bueno de uno malo. R1 canda el
  conteo (estructura) y R2 la conducta, que es lo que importa.
