---
feature: "mobile-home-bell-icon-source-lock-unbounded"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Diseño — [[mobile-home-bell-icon-source-lock-unbounded]] (#124)

> Ver [[requirements]] para los R-ids y [[tasks]] para los literales. Todo lo
> medido aquí es sobre `b1469b84` (`origin/main` `2da66b86` más
> `progress/current.md`), con `index.tsx` en `dbb5b034` e `index.test.tsx` en
> `60c0c013`. Las sondas se corrieron con `bunx jest --runTestsByPath` y se
> revirtieron. `git diff --exit-code` dio 0 al terminar.

## Decisión: el color en el árbol, la línea de fuente se queda

La entrada deja tres caminos:

- **(a)** Acotar la línea de fuente al primer hijo de la campana. El recorte
  de `<` a `<` no vale, porque el icono no está en el tag de apertura. Su
  análogo es aseverar que la primera copia del icono **después del ancla**
  empieza en el primer `<` después del ancla:
  `expect(source.indexOf('<Bell size={24} color={muted} />', anchor)).toBe(source.indexOf('<', anchor))`.
- **(b)** Aseverar en el árbol el color exacto del icono que vive dentro de
  `home-alerts-bell`, con el espía de identidad sobre `getCSSVariable`.
- **(c)** No defenderlo y dejarlo escrito como límite.

Se elige **(b)**, conservando la línea de fuente. Motivos, todos medidos
(§La medición completa):

1. **(b) cierra todo lo que cierra (a), y más.** (a) sigue leyendo texto:
   cualquier copia del icono entre el ancla y el primer hijo real le da el
   verde. Eso pasa en seis sondas: un señuelo como primer hijo (B2f), un
   comentario JSX delante (B2j), un comentario o una cadena dentro del tag
   (B2t, B2s), una sombra de `muted` (B3) y un ternario cuya primera rama es
   la sana (B4r). (b) mira lo que se renderiza, y las seis caen.
2. **(b) no añade rojos falsos.** Mover el icono detrás del punto (F2) deja la
   campana sana. (b) sigue en verde, y (a) da rojo.
3. **La línea de fuente ve lo que el árbol no ve.** El árbol corre con
   `Platform.OS` `'ios'` y con el espía de identidad. Una rama por plataforma
   (B5) o el nombre de la variable escrito a mano,
   `color="--color-muted"` (B6), engañan al árbol. La línea de fuente las
   para, porque el literal deja de aparecer. Quitarla abriría B5 y B6.
4. **Dos estados.** El icono puede depender de `hasOpenAlerts`. Con un solo
   estado, B4 (tinta de acento cuando hay alertas) sigue en verde.

(c) queda descartada: (b) cuesta dos `it` de cuatro líneas y cierra el
agujero sin coste en rojos falsos.

### Por qué el valor esperado es un literal

`useThemeColors` devuelve `Uniwind.getCSSVariable('--color-<token>')`. Con el
espía de identidad, eso es el propio nombre. El test compara con
`'--color-muted'` escrito a mano. Si comparase con el resultado de llamar a
`useThemeColors(['muted'])`, o con cualquier cosa importada de producción, un
cambio del token en la lista de producción (T1) movería los dos lados a la vez
y el candado sería tautológico. Con el literal, T1 cae por los dos `it` de R1.

### Por qué no basta el `beforeEach` de `#78 R10`

`#78 R10` no espía `getCSSVariable`, y sus demás `it` no lo necesitan. El
espía va en el `beforeEach` de un `describe` anidado, que lo restaura en su
`afterEach` con `jest.restoreAllMocks()`, igual que los otros dos `describe`
del fichero que lo ponen en su `beforeEach`. `restoreAllMocks` solo restaura espías
(`jest-mock` 29.7): no toca los `jest.fn()` de módulo como `mockListAlerts`,
que el `beforeEach` de nivel superior rearma antes de cada test.

## El residuo

Con (b) y la línea de fuente quedan en verde **B5d** y **B6d**. Son B5 y B6
con, además, una copia señuelo del icono en cualquier sitio del fichero. La
copia le da el verde a la línea de fuente, y la rama por plataforma, o el
nombre escrito a mano, engaña al árbol. Hacen falta dos mutaciones a la vez, y
las dos son raras en este código (`index.tsx` no importa `Platform`, y ningún
color de la pantalla se escribe como cadena). Queda documentado
([[requirements]] punto 3 de la firma). Lo cerraría añadir (a), con el coste
que da §Alternativas.

## La medición completa

Columnas: **hoy**, el fichero en `60c0c013`; **(a)**, la línea de fuente
sustituida por la de (a); **(b)**, R1 con la línea de fuente intacta, que es lo
que se implementa; **(a)+(b)**, las dos. `V` es verde y `R` rojo. En la
columna (b), «árbol» es que caen los dos `it` de R1, y «con» que cae solo
`'con alertas abiertas'`. Las mutaciones exactas y sus blobs están en
[[tasks]] §R2.

| Sonda | Qué hace | hoy | (a) | (b) | (a)+(b) |
|---|---|---|---|---|---|
| B1 | icono en `accent` | R `toContain` | R | R `toContain` + árbol | R |
| **B2** | B1 + copia detrás de la campana | **V** | R | **R árbol** | R |
| B2p | B1 + copia delante de la campana | V | R | R árbol | R |
| B2f | B1 + copia como primer hijo | V | **V** | R árbol | R |
| B2i | B1 + copia detrás del icono, dentro | V | R | R árbol | R |
| B2j | B1 + copia en comentario JSX como primer hijo | V | **V** | R árbol | R |
| B2c | B1 + copia en comentario `//` al final del fichero | V | R | R árbol | R |
| B2t | B1 + copia en `/* */` dentro del tag | V | **V** | R árbol | R |
| B2s | B1 + copia en una cadena dentro del tag | V | **V** | R árbol | R |
| B3 | sombra: `((muted: string) => <Bell … color={muted} />)(accent)` | V | **V** | R árbol | R |
| B4 | `hasOpenAlerts ? accent : muted` | V | R | R con | R |
| B4r | `!hasOpenAlerts ? muted : accent` | V | **V** | R con | R |
| B5 | `Platform.OS === 'ios' ? muted : accent` | R `toContain` | R | R `toContain` | R |
| **B5d** | B5 + copia detrás de la campana | V | R | **V** | R |
| B6 | `color="--color-muted"` | R `toContain` | R | R `toContain` | R |
| **B6d** | B6 + copia detrás de la campana | V | R | **V** | R |
| T1 | token `'muted'` → `'accent-strong'` en la lista | R otro | R otro | R árbol + otro | R |
| F1 | props reordenadas, `color` antes de `size` | R `toContain` | R | R `toContain` | R |
| F2 | icono movido detrás del punto (campana sana) | V | **R falso** | V | **R falso** |
| F3 | `const bellInk = muted;` y `color={bellInk}` | R `toContain` | R | R `toContain` | R |
| W2 | lo mismo sobre el icono de peso (`#69 R9`) | V | V | V | V |

«Otro» en T1 es `dibuja un estado vacío con forma de fila cuando no hay
vacuna` (`#70 R8`), que ya caía. F1 y F3 son **rojos falsos de hoy**: la
campana queda sana y cae la línea de fuente. Se heredan, porque la línea no
se toca. Las cifras exactas por sonda (pasados y fallidos) están en [[tasks]]
§R2.

### Lectura

- B2 es la sonda de la entrada: pasa de V a R, y R1 es lo único que la para.
- En B2, **solo** caen los dos `it` nuevos. La línea de fuente sigue verde
  (la copia la alimenta) y ningún otro test del fichero cae. Por eso es la
  mutación versionada del rojo: falla solo por su propia aserción,
  `toBe('--color-muted')`, con `Received: "--color-accent-strong"`.
- Ninguna sonda que hoy es roja pasa a verde.

## Los guards

`src/__tests__/design-drift.test.ts` lee `src/screens/home/index.test.tsx` en
cinco guards con `FEATURE_STYLE_ESCAPES`:

```ts
const HEX_LITERAL = String.raw`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`;
new RegExp(String.raw`text-\[10px\]|${HEX_LITERAL}|StyleSheet`, 'i');
```

`#124 R1` no casa, porque el lookahead excluye `#` + tres dígitos + ` R` +
dígito. `#124` suelto o `(#124)` sí casan: `124` son tres dígitos hex. Todo lo
que esta feature escribe en el fichero usa la forma `#124 R1`, y ningún
literal contiene `StyleSheet` ni `text-[10px]`. Se comprobó aplicando esa
regex, con la bandera `i`, a los ficheros resultantes del rojo y del
documental: limpia.

`#108 R3` lee el mismo fichero buscando dos títulos de #106 y la ausencia de
`'#' + '106`. Esta feature no toca nada de eso.

`docs/conventions.md` no lo lee ningún guard sobre la sección que se toca.
`hero-header-amendments.test.ts` y `hosting-artifacts.test.ts` leen otras
secciones.

## Recuentos

| | Base `b1469b84` | Tras la feature |
|---|---|---|
| `src/screens/home/index.test.tsx` | 142 | **144** |
| `src/__tests__/design-drift.test.ts` | 55 | 55 |
| Suite móvil | 83 suites / 1494 tests / 1 snapshot | 83 / **1496** / 1 |
| `tsc --noEmit` | exit 0 | exit 0 |
| `expo lint` | exit 0 | exit 0 |

Recuentos por `grep -c` en `index.test.tsx`, base y final:
`'#124 R'` 0 y 4, `mockImplementation((token) => token)` 5 y 6,
`"'--color-muted'"` 2 y 4, `"se pinta con la tinta muted"` 0 y 1,
`"expect(source).toContain('<Bell size={24} color={muted} />');"` 1 y 1.

## Coordinación

- La sesión Backend trabaja #125 en `wt-backend`
  (`feature/125-reminder-advance-already-past`). No toca ningún fichero de
  esta feature salvo los del harness (`feature_list.json`,
  `progress/current.md`). Si mergea antes, el conflicto posible es solo de
  harness, y los greps de esta spec siguen resolviendo.
- Si otra feature mueve el `describe` `#78 R10`, el `it` `#122 R2` o
  `no pinta campana cuando no hay mascotas`, los números de línea cambian.
  Por eso todo se localiza por contenido.

## Archivos afectados

Por capa. No hay domain, application ni infrastructure: es un cambio de test
y de documentación.

- `mobile-pet-tracker/src/screens/home/index.test.tsx`: el `describe` anidado
  de R1 y el comentario de R3 (1).
- `docs/conventions.md`: el párrafo de R3 (2).
- `mobile-pet-tracker/src/screens/home/index.tsx`: **solo** en el par
  rojo→verde de R1. El diff acumulado es vacío (R4).
- Harness: `specs/mobile-home-bell-icon-source-lock-unbounded/traceability.md`
  y `progress/impl_mobile-home-bell-icon-source-lock-unbounded.md`.

## Alternativas descartadas

- **(a) sola**: deja abiertas B2f, B2j, B2t, B2s, B3 y B4r, y añade el rojo
  falso F2.
- **(a) además de (b)**: cierra B5d y B6d a cambio de F2 y de un mensaje de
  fallo que da dos posiciones del fichero en vez de dos colores. Es decisión
  del humano (punto 3 de la firma). Si la pide, el literal sustituye la línea
  de fuente, con su comentario, por:

  ```ts
      // #124 R1: the icon is the bell's first child, so it starts at the first `<`
      // after the anchor. Matching the whole file let any other copy stand in.
      expect(source.indexOf('<Bell size={24} color={muted} />', anchor)).toBe(
        source.indexOf('<', anchor),
      );
  ```

  Con eso, R1, R2 y la tabla de [[tasks]] §R2 se enmiendan a la columna
  (a)+(b), y el delta de tests no cambia.
- **Quitar la línea de fuente**: abriría B5 y B6, que hoy caen.
- **Un solo estado**: deja B4 en verde.
- **Espiar `getCSSVariable` en el `beforeEach` de `#78 R10`**: cambiaría el
  entorno de los cinco `it` que ya tiene, que no lo necesitan, entre ellos
  `compone…`, que hoy pasa sin espía.
- **Un helper de color de icono**: dos usos en un fichero; el patrón del espía
  ya se repite cinco veces sin helper.
