---
feature: "mobile-home-cell-icons-source-lock-unbounded"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Diseño — [[mobile-home-cell-icons-source-lock-unbounded]] (#126)

> Ver [[requirements]] para los R-ids y [[tasks]] para los literales. Todo lo
> medido aquí es sobre `d7cb0d60` (`origin/main`, merge de #124, más
> `progress/current.md`), con `index.tsx` en `dbb5b034` e `index.test.tsx` en
> `abbdb5b8`. Las sondas se corrieron en un worktree desechable con
> `bunx jest --runTestsByPath` y se revirtieron. `git diff --exit-code` dio 0
> al terminar.

## Decisión: cada icono en su celda del árbol, la cuenta de fuente se queda

La entrada deja tres caminos, los mismos que en #124:

- **(a)** Acotar la cuenta de fuente a cada celda: recortar `index.tsx` entre
  el inicio de la celda y su etiqueta, y exigir el icono ahí.
- **(b)** Aseverar en el árbol, celda por celda, los hijos de la celda y las
  props exactas de su icono, con el espía de identidad sobre
  `getCSSVariable`.
- **(c)** No defenderlo y dejarlo escrito como límite.

Se elige **(b)**, conservando la cuenta de fuente. Motivos, todos medidos
(§La medición completa):

1. **(b) cierra el agujero en las cuatro celdas.** Todo señuelo que hoy le da
   el verde a la cuenta cae en el árbol: en la misma línea (`*2`), en otra
   celda (`*2o`), fuera de la tira (`*2f`), en comentario JSX (`*2j`) o `//`
   (`*2c`), y la sombra de `muted` (`*3`).
2. **La celda se cierra por sus hijos, no por `testID`**
   (`docs/ui-guidelines.md` §Enmienda #70). La celda no lleva `testID`. Es el
   `parent` del `Text` de su valor, como ya hace
   `asigna cada valor, icono y etiqueta a su celda y a ninguna otra`.
   `toHaveLength(3)` sobre los hijos que no son cadena y
   `toEqual` sobre las props de `children[0]` cierran a la vez el componente
   (por el `testID` del doble), la tinta, el tamaño, la cardinalidad y el
   orden. Un segundo icono en la celda (`*9`) o el icono detrás de la etiqueta
   (`*8`) caen, y hoy pasan.
3. **La cuenta de fuente ve lo que el árbol no ve.** El árbol corre con
   `Platform.OS` `'ios'` y con el espía de identidad. Una rama por plataforma
   (`*5`) o el nombre de la variable escrito a mano,
   `color="--color-muted"` (`*6`), engañan al árbol. La cuenta los para,
   porque deja de encontrar cuatro. Quitarla abriría `*5` y `*6`.
4. **Dos estados.** Cada icono podría depender del dato de su celda. Con un
   solo estado, `*4r` (la tinta de acento cuando falta el dato) seguiría en
   verde.

**(a) no se midió.** Se descarta por el mismo motivo que en #124, donde sí se
midió: acotar por texto sigue leyendo texto. Un comentario JSX delante
(`*2j`) o la sombra (`*3`) quedan dentro del recorte de la celda y le darían
el verde. Además
necesitaría cuatro anclas nuevas en el test, una por celda, que se desplazan
con cada cambio de la tira. **(c)** queda descartada: (b) cuesta dos `it` y
cierra el agujero.

### Por qué el valor esperado es un literal

`useThemeColors` devuelve `Uniwind.getCSSVariable('--color-<token>')`. Con el
espía de identidad, eso es el propio nombre. El test compara con
`'--color-muted'` escrito a mano, y los `testID` y el `20` también son
literales. Si comparase con el resultado de `useThemeColors(['muted'])`, o con
cualquier cosa importada de producción, un cambio del token en la lista de
producción (T1) movería los dos lados a la vez y el candado sería tautológico.
Con el literal, T1 cae por los dos `it` de R1.

### Por qué `toEqual` y no `toStrictEqual`

El doble del icono es `React.createElement(View, { testID, ...props })`, y el
nodo anfitrión lleva además `children: undefined`. Se ve en el diff de cada
fallo. `toEqual` ignora las claves con valor `undefined`; `toStrictEqual` no,
y daría rojo en el árbol sano. Con `toEqual`, cualquier prop **con valor** que
se añada al icono cae, que es lo que se quiere (punto 4 de la firma).

### Por qué el segundo estado espera `collar-card`

`docs/conventions.md` §«Esperas sobre el árbol renderizado» pide que la
condición que acaba la espera sea la observación que hacen las aserciones.
En el segundo estado, `summary-weight` pinta `'—'` también **antes** de que
llegue el detalle de la mascota, así que esperar el guion no prueba nada.
`collar-card` solo aparece con el detalle cargado. Por eso se espera a ella,
luego a `summary-weight`, y se aseveran los guiones de peso y de actividad
antes de mirar los iconos. En el primer estado se espera `'12.4 kg'`, que
también necesita el detalle.

### Por qué el segundo estado y no uno sin días

La tira solo se pinta con la actividad en `kind: 'ok'`, y el backend siempre
devuelve la entrada de hoy
(`backend-pet-tracker/src/modules/activity/application/use-cases/get-daily-activity.use-case.ts`:
`computeToday` para hoy y `missingEntry` para los días pasados sin fila). Un
estado con `days: []` no existe en producción. El estado que sí cambia los
datos de las cuatro celdas a la vez es el de las métricas y el peso a `null`,
que pinta los cuatro guiones.

### Por qué no basta el `beforeEach` de `#69 R1`

`#69 R1` no espía `getCSSVariable`, y sus demás `it` no lo necesitan. El espía
va en el `beforeEach` de un `describe` anidado, que lo restaura en su
`afterEach` con `jest.restoreAllMocks()`, igual que los otros `describe` del
fichero que lo ponen. `restoreAllMocks` solo restaura espías: no toca los
`jest.fn()` de módulo como `mockGetDailyActivity`, que el `beforeEach` de
`#69 R1` rearma antes de cada test. Por eso el segundo `it`
puede sobrescribir sus mocks sin limpiar después.

## Las decisiones del icono de cada celda

`docs/ui-guidelines.md` §Enmienda #70 pide enumerar todas las decisiones del
elemento repetido y un `expect` por cada una. Estas son las del **icono** de
cada celda, que es lo que esta feature cierra, con la sonda que lo demuestra
(§La medición completa):

| Decisión (Enmienda #70) | La cierra en R1 | Sonda que lo demuestra |
|---|---|---|
| componente de icono (2) | el `testID` del doble dentro de `toEqual` | X1, X2: iconos intercambiados entre celdas |
| tinta del icono (6) | `color: '--color-muted'` dentro de `toEqual` | `*2`, `*2o`, `*2f`, `*2j`, `*2c`, `*3` |
| tamaño de icono (invariante compartido) | `size: 20` dentro de `toEqual` | `*7d` |
| sitio de render: la celda y no otra | el ancla `getByTestId(<valor>).parent` | `*2o` (copia en otra celda), `*2f` (copia fuera de la tira) |
| cardinalidad (estructural) | `toHaveLength(3)` sobre los hijos que no son cadena | `*9` |
| orden de los hijos (12) | `children[0]` es el icono | `*8` |
| condición de render (9) | los dos estados | `*4`, `*4r` |

Las demás decisiones de la celda (el dato, la etiqueta, el nombre accesible,
la receta tipográfica de cada texto, el divisor y el `flex-1`) no son del
icono. Esta feature no las toca ni las mide ([[requirements]] §Fuera de
alcance).

## El residuo

Con (b) y la cuenta de fuente quedan en verde **`*5d`** y **`*6d`** en las
cuatro celdas. Son `*5` y `*6` con, además, una copia señuelo del icono en la
misma línea. La copia le devuelve a la cuenta su cuarta coincidencia, y la
rama por plataforma, o el nombre escrito a mano, engaña al árbol. Hacen falta
dos mutaciones a la vez, y las dos son raras en este código: `index.tsx` no
importa `Platform`, y ningún color de la pantalla se escribe como cadena. Es el
mismo residuo que #124 aceptó para la campana (B5d y B6d). Queda documentado
([[requirements]] punto 3 de la firma).

## La medición completa

Columnas: **hoy**, el fichero en `abbdb5b8`; **(b)**, R1 con la cuenta de
fuente intacta, que es lo que se implementa. `V` es verde y `R` rojo.
«Fuente» es la cuenta de `#69 R9`; «árbol», que caen los dos `it` de R1; «con»
o «sin», que cae solo uno de ellos; «otro», otro test del fichero. `×4` quiere
decir que las cuatro celdas (W, A, S y D) dan el mismo veredicto, con las mismas
cifras y los mismos matchers. (a) no se midió (§Decisión). Las mutaciones
exactas, los blobs y las cifras por sonda están en [[tasks]] §R2.

| Clase | Qué hace | Hoy | (b) |
|---|---|---|---|
| `*1` | icono en `accent` | R fuente ×4 | R fuente + árbol ×4 |
| `*2` | `*1` + copia en la misma línea | V ×4 | **R árbol ×4** |
| `*2o` | `*1` + copia en la celda siguiente | V ×4 | **R árbol ×4** |
| `*2f` | `*1` + copia fuera de la tira | V ×4 | **R árbol ×4** |
| `*2j` | copia en comentario JSX delante + icono en `accent` | V ×4 | **R árbol ×4** |
| `*2c` | `*1` + copia en `//` al final del fichero | V ×4 | **R árbol ×4** |
| `*3` | sombra: `((muted: string) => <X … color={muted} />)(accent)` | V ×4 | **R árbol ×4** |
| `*4` | `accent` cuando hay dato en la celda | V ×4 | **R con ×4** |
| `*4r` | `accent` cuando falta el dato | V ×4 | **R sin ×4** |
| `*5` | `Platform.OS === 'ios' ? muted : accent` | R fuente ×4 | R fuente ×4 |
| `*5d` | `*5` + copia | V ×4 | V ×4 |
| `*6` | `color="--color-muted"` | R fuente ×4 | R fuente ×4 |
| `*6d` | `*6` + copia | V ×4 | V ×4 |
| `*7` | `size={24}` | R fuente ×4 | R fuente + árbol ×4 |
| `*7d` | `*7` + copia | V ×4 | **R árbol ×4** |
| `*8` | icono detrás de la etiqueta (celda sana salvo el orden) | V ×4 | **R árbol ×4** |
| `*9` | un `Bell` de más en la celda | V ×4 | **R árbol ×4** |
| `*F1` | props reordenadas, `color` antes de `size` | R fuente ×4 | R fuente ×4 |
| `*F3` | `const cellInk = muted;` y `color={cellInk}` | R fuente ×4 | R fuente ×4 |
| X1 | iconos de peso y actividad intercambiados | R otro | R árbol + otro |
| X2 | iconos de descanso y distancia intercambiados | R otro | R árbol + otro |
| T1 | token `'muted'` → `'accent-strong'` en la lista | R otro | R árbol + otro |

### Lectura

- `*2` es la sonda de la entrada, y W2 la versionada en el rojo. Pasa de V a R
  en las cuatro celdas, y R1 es lo único que la para. **Solo** caen los dos
  `it` nuevos, por `toEqual`: la cuenta sigue verde, porque la copia la
  alimenta, y ningún otro test del fichero cae. Por eso falla solo por su
  propia aserción.
- Todos los señuelos caen, estén donde estén: en la misma línea, en otra celda,
  fuera de la tira, en un comentario JSX o `//`, o tras una sombra de `muted`.
- `*7d`, `*8` y `*9` pasan de V a R: el tamaño, el orden y la cardinalidad
  ([[requirements]] punto 4 de la firma).
- **Ninguna sonda que hoy es roja pasa a verde.** `*1`, `*7`, X1, X2 y T1 ya
  caían y ahora caen también por R1 (punto 7 de la firma). Los «otros» de X1 y
  X2 son `asigna cada valor, icono y etiqueta a su celda y a ninguna otra`; los
  de T1, los dos `it` de `#124 R1` y el estado vacío de vacuna de `#70 R8`.
- `*F1` y `*F3` son **rojos falsos de hoy**: la celda queda sana y cae la
  cuenta. Se heredan, porque la cuenta no se toca. R1 sigue verde en los dos,
  así que no añade rojos falsos: `toEqual` no mira el orden de las claves, y la
  constante local resuelve al mismo color.
- `*5d` y `*6d` son el residuo (§El residuo).

## Los guards

`src/__tests__/design-drift.test.ts` lee `src/screens/home/index.test.tsx` en
cinco guards con `FEATURE_STYLE_ESCAPES`:

```ts
const HEX_LITERAL = String.raw`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`;
new RegExp(String.raw`text-\[10px\]|${HEX_LITERAL}|StyleSheet`, 'i');
```

`#126 R1` no casa, porque el lookahead excluye `#` + tres dígitos + ` R` +
dígito. `#126` suelto o `(#126)` sí casan: `126` son tres dígitos hex. Todo lo
que esta feature escribe en el fichero usa la forma `#126 R1`, y ningún
literal contiene `StyleSheet` ni `text-[10px]`. Se comprobó aplicando esa
regex, con la bandera `i`, a los ficheros resultantes del rojo y del
documental: limpia. El guard da 55 en la base y 55 con el fichero final.

`#108 R3` lee el mismo fichero buscando dos títulos de #106 y la ausencia de
`'#' + '106`. Esta feature no toca nada de eso.

`docs/conventions.md` lo leen tres guards, y ninguno sobre la sección que se
toca: `design-drift.test.ts` (`#108 R4`, la sección «Prefijo de feature cuando
un fichero acumula R-ids de dos specs»), `hero-header-amendments.test.ts` (el
marcador de la enmienda A9 de #67) y `hosting-artifacts.test.ts` (la fila de
`RESET_LINK_HOST`). El párrafo nuevo no quita ni mueve nada de eso.

`src/__tests__/ui-language.test.ts` lee `src/screens/home/index.tsx`: cuenta
sus llamadas `t('…')` y busca en él literales de copy del catálogo. La
mutación W2 no añade ni una llamada ni una cadena.

## Recuentos

| | Base `d7cb0d60` | Tras la feature |
|---|---|---|
| `src/screens/home/index.test.tsx` | 144 | **146** |
| `src/__tests__/design-drift.test.ts` | 55 | 55 |
| Suite móvil | 83 suites / 1510 tests / 1 snapshot | 83 / **1512** / 1 |
| `tsc --noEmit` | exit 0 | exit 0 |
| `expo lint` | exit 0 | exit 0 |

La columna final se midió con el `index.test.tsx` y el `docs/conventions.md`
finales (blobs `22adaad0` y `bb2ca08e`) sobre `index.tsx` intacto.

Recuentos por `grep -c` en `index.test.tsx`, base y final:
`'#126 R'` 0 y 6, `mockImplementation((token) => token)` 6 y 7,
`"'--color-muted'"` 4 y 6, `"pinta su propio icono"` 0 y 1, y la línea de la
regex de la cuenta, `/<(?:Weight|Walk|Moon|Map) size=\{20\} color=\{muted\} \/>/g,`
(con `grep -cF`), 1 y 1. En `docs/conventions.md`, `"pinta su propio icono"`
0 y 1.

## Coordinación

**Lista cerrada de ficheros que toca esta feature.** Ninguno más:

1. `mobile-pet-tracker/src/screens/home/index.test.tsx`: el `describe`
   anidado de R1 y el comentario de R3 (1).
2. `mobile-pet-tracker/src/screens/home/index.tsx`: **solo** en el par
   rojo→verde de R1. El diff acumulado es vacío (R4).
3. `docs/conventions.md`: el párrafo de R3 (2).
4. `specs/mobile-home-cell-icons-source-lock-unbounded/traceability.md`: los
   hashes.
5. `progress/impl_mobile-home-cell-icons-source-lock-unbounded.md`: el
   reporte de Codex.
6. Harness, que toca el `leader` y no Codex: `feature_list.json` y
   `progress/current.md`.

- La sesión Backend trabaja #99 en `wt-backend`
  (`feature/99-mobile-notifications-permission-recovery`, en `d6130d7b`).
  `git diff --name-only origin/main...d6130d7b` no incluye ninguno de los
  ficheros 1 a 5. Coinciden solo los del harness (6). Si #99 mergea antes, el
  conflicto posible es solo de harness, y los greps de esta spec siguen
  resolviendo. #99 sí toca `src/i18n/catalog.ts` y
  `src/providers/__tests__/language-provider.test.tsx`, que esta feature no
  toca.
- Si otra feature mueve el `describe` `#69 R1` o los `it` `#69 R9` y
  `#69 R12`, los números de línea cambian. Por eso todo se localiza por
  contenido.
- #80 no toca ningún fichero en esta feature: su cierre, sea (a) o (c), lo
  registra el `leader` en `feature_list.json` con la firma.

## Archivos afectados

Por capa. No hay domain, application ni infrastructure: es un cambio de test
y de documentación. Son los ficheros 1 a 5 de §Coordinación.

## Alternativas descartadas

- **(a) sola**, acotar la cuenta a cada celda: sigue leyendo texto, así que
  los señuelos dentro del recorte (`*2j`, `*3`) le dan el verde, y no cierra ni
  el orden ni la cardinalidad de la celda. No se midió (§Decisión).
- **(a) además de (b)**: cerraría `*5d` y `*6d` a cambio de cuatro anclas de
  texto por celda. Es decisión del humano (punto 3 de la firma). Si la pide, la
  spec se enmienda con su literal y se mide antes del handoff.
- **Quitar la cuenta de fuente**: abriría `*5` y `*6`, que hoy caen.
- **Un solo estado**: deja `*4r` en verde.
- **Solo la tinta, `props.color`, como en #124**: dejaría en verde `*7d` (el
  tamaño con señuelo), `*8` (el orden) y `*9` (un icono de más). La tira
  repite el elemento cuatro veces y la Enmienda #70 pide cerrar todas sus
  decisiones.
- **Un `it` por celda**: ocho `it` en vez de dos, con el mismo montaje. El
  bucle sobre la tabla `cells` da el mismo cierre, y el mensaje de `toEqual`
  nombra la celda por su `testID`.
- **Espiar `getCSSVariable` en el `beforeEach` de `#69 R1`**: cambiaría el
  entorno de los `it` que ya tiene, que no lo necesitan.
- **Un helper de hijos de celda**: dos usos en un fichero, y el patrón del
  espía ya se repite seis veces sin helper.
- **Añadir un `testID` a la celda en producción**: rompería R4, y el `parent`
  del valor ya la ancla sin ambigüedad.
