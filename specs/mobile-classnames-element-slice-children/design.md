---
feature: "mobile-classnames-element-slice-children"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Diseño — [[mobile-classnames-element-slice-children]] (#120)

> Ver [[requirements]] para los R-ids y [[tasks]] para los literales, el orden
> TDD y las sondas. Todo lo medido aquí es sobre `42db1ccf`, que es
> `origin/main` (`e9413a6e`, merge de #126) más `progress/current.md`. Las
> sondas se corrieron en este worktree con `bunx jest --runTestsByPath`, sin
> pipe, y se revirtieron una a una. Al terminar,
> `git diff --exit-code -- mobile-pet-tracker/src` dio 0.

## El helper de hoy

`elementWithTestId(source, testId, closingTag)` está duplicado, byte a byte, en
`mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` y en
`mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts`. Para
localizarlo: `grep -n "function elementWithTestId"`. Devuelve
`source.slice(start, end)`, con `start = indexOf('testID="…"')` y
`end = indexOf(closingTag, start)`. De ahí salen tres huecos:

1. **Los hijos entran en el bloque.** Si el tag de cierre es el del propio
   elemento (`</View>`, `</Button>`), todo lo que hay dentro va en el recorte,
   así que un hijo con la clase buscada da el verde. Es el hueco de la entrada.
2. **En un elemento que se cierra solo (`/>`), el bloque acaba en el primer
   `/>` que encuentra.** Si el elemento pasa a tener hijos, ese `/>` es el de un
   hijo y se reproduce el hueco 1 (sondas `V-h` y `S-h`).
3. **Las props que van antes del ancla quedan fuera del bloque**, porque este
   empieza en `testID`. Así sale un rojo falso cuando la clase está en el
   tag, pero antes del `testID` (sondas `B-login-p`, `P-week-p` y `S-p`).

Además, **no se comprueba que el ancla sea única**. Con dos copias del
`testID` (un señuelo o las dos ramas de un ternario), `indexOf` recorta la
primera, que puede no ser el elemento vigilado (`P-week-d`, `P-week-t`).

## Clasificación, llamada a llamada

Hay **5 call-sites en el fuente y 10 llamadas en ejecución**. Se cuentan por
llamada, no por `testID`: un `it.each` de cuatro filas son cuatro llamadas.
Cada llamada se clasifica **aserción a aserción** según lo que mira: el tag
propio o el subárbol.

| CS | Fichero · `describe` › `it` (grep) | Llamadas | Cierre | Aserciones y qué miran | Clase |
|---|---|---|---|---|---|
| **CS1** | `consistency` · `#62 R1` › `%s aplica rounded-xl a %s` (`grep -n "aplica rounded-xl a"`) | 4: `login-submit`, `forgot-submit`, `register-submit`, `reset-submit` | `</Button>` | `toContain('rounded-xl bg-accent')` mira el **tag**, porque la receta es el `className` del Button. `not.toContain('rounded-2xl')` mira el **tag**: el radio es del botón | **tag propio** |
| **CS2** | `consistency` · `#62 R2` › `%s conserva dimensión y usa el radio de Card` (`grep -n "conserva dimensión"`) | 1: `vaccines-skeleton` | `/>` | `toContain('className="h-24 w-full rounded-card"')` mira el **tag** | **tag propio** |
| **CS3** | `consistency` · `#62 R2` › `el skeleton del hero reserva el alto…` (`grep -n "reserva el alto de la foto"`) | 1: `pet-hero-skeleton` | `/>` | `className="w-full"`, `style={{ height: PET_HERO_MEDIA_HEIGHT }}` y `not.toContain('rounded-')` miran el **tag**: «el skeleton no lleva radio, porque va a sangre» (comentario de la enmienda #67 que hay encima) | **tag propio** |
| **CS4** | `consistency` · `#62 R4` › `lleva las tres píldoras…` (`grep -n "lleva las tres píldoras"`) | 3: `pill-active`, `pill-week`, `pill-inactive` | `</View>` | `toContain('rounded-xl')` mira el **tag**: la píldora de dato es el control con radio (`docs/ui-guidelines.md` §12, Escala de radios) | **tag propio** |
| **CS5** | `legibility` · `#61 R1: la etiqueta destructiva usa el token de danger`, a nivel de `describe` (`grep -n "const deleteConfirm = elementWithTestId"`) | 1: `reminders-delete-confirm`, que alimenta 3 `it` con 5 aserciones | `</Button>` | `toContain('<Button.Label className="font-bold text-danger-foreground">')` mira un **hijo**. `not.toContain('text-accent-foreground')` mira el **subárbol**: el acento no puede aparecer en ninguna parte del botón. `toContain('variant="danger"')` y `toContain('bg-danger')` miran el **tag**. `toContain("t('reminders.delete')")` mira un **hijo**, el texto | **mixto**: 3 aserciones de subárbol, 2 de tag |

## Decisión

### R1: los nueve elementos de `consistency` pasan a su tag de apertura

`elementWithTestId` **desaparece** de `consistency-classnames.test.ts`, porque
los cuatro call-sites miran el tag propio. En su lugar entra un helper,
`openingTagWithTestId(source, testId)`:

- recorta de `<` a `<`, que es la receta de `docs/conventions.md` §Recortes del
  tag de apertura en candados de fuente;
- asevera **dentro** del helper que el ancla es única, con
  `expect(source.lastIndexOf(…)).toBe(anchor)`, que es la línea que pide la
  convención;
- y corta además en el primer `/>` de la ventana, con `.split('/>')[0]`.

El literal exacto está en [[tasks]] §R1.

**Por qué la unicidad va dentro del helper.** Los diez usos la necesitan. Si
fuera en cada `it`, serían nueve aserciones repetidas en cuatro `it`, y cada
call-site nuevo tendría que acordarse de escribirla. El helper es la única
puerta al recorte.

**Por qué el corte en `/>`.** Para un elemento con hijos, el siguiente `<` es
el del primer hijo y la receta acota bien. Para uno que se cierra solo, el
siguiente `<` es el del **siguiente elemento del fichero**, y entre medias
queda un hueco que la receta sola mete en la ventana. En `pet-hero-header.tsx`,
ese hueco contiene hoy un comentario JSX de cinco líneas. La sonda `S-j` lo
mide: el `className` propio del skeleton pasa a `h-full` y se añade una línea
`className="w-full"` dentro de ese comentario.

| Versión del helper | Veredicto de `S-j` |
|---|---|
| hoy, el bloque del ancla al `/>` | **rojo** |
| la receta sola, de `<` a `<` | **verde**, un verde falso |
| la receta cortada en `/>`, que es la decisión | **rojo** |

Con `{false && '…'}` en el hueco de `vaccines-skeleton` (`V-f`) sale lo
mismo. El corte cuesta una llamada y no cambia nada en un elemento con hijos:
un `/>` dentro de la ventana solo puede estar en el propio tag si se cierra
solo.

Este corte no es la receta pura de la convención, así que R4 lo documenta en
`docs/conventions.md` (punto 2 de §Qué firma el humano).

### R2: `legibility` se parte por aserción

CS5 es mixto, así que no se migra entero ni se queda entero:

- **Se quedan en el bloque del ancla al `</Button>`** la etiqueta, el texto y
  el veto del acento. Lo que miran son hijos. Con la ventana de `<` a `<`, la
  primera aserción daría rojo en el árbol sano (la etiqueta no está en el tag)
  y el veto perdería a los hijos. `elementWithTestId` **se queda en este
  fichero**, con un comentario encima de `const deleteConfirm` que dice por qué.
- **Pasan al tag** `variant="danger"` y `bg-danger`, a través de una copia de
  `openingTagWithTestId` en el mismo fichero, dentro del `it`
  `conserva variant, testID y texto del botón`. Así el fallo de unicidad
  también cae dentro de ese `it`, y no en la recogida del `describe`.

Medido:

- **`D-h`**: `bg-danger` sale del tag y se pone en un hijo,
  `<View className="bg-danger" />`. Hoy `legibility` pasa en verde, pero lo
  paran nueve tests de `src/screens/reminders/index.test.tsx`: el helper de
  borrado de ese fichero asevera `props.className` del botón con
  `toContain('bg-danger')`.
- **`D-v`**: `variant="danger"` sale del tag y se mete en un comentario JSX
  hijo. Hoy pasa en verde **en toda la suite**, 83 / 1532.

Con R2, los dos dan rojo en `legibility`. **El rojo versionado de R2 es
`D-v` y no `D-h`**, porque con `D-h` el commit rojo fallaría también por los
nueve tests del árbol, y no solo por la aserción nueva. Medido con la suite
entera en el estado exacto del commit rojo de cada requisito:

| Estado | Resultado |
|---|---|
| R1: `consistency` con R1 y la mutación `P-active-h` | 1 failed / 1532, y el único que falla es el `it` de CS4 `(#120 R1)` |
| R2: los dos ficheros con R1 y R2 y la mutación `D-v` | 1 failed / 1532, y el único que falla es el `it` `(#120 R2)` |

### La copia del helper

El helper va **duplicado** en los dos ficheros, igual que hoy
`elementWithTestId`, `sourceFiles`, `filesMatching` y `readSource`. Un módulo
compartido de helpers de fuente sería una abstracción nueva para dos
consumidores, y tocaría un tercer fichero. No hace falta.

### Nombres de test

Los cinco títulos que cambian de recorte ganan un sufijo, igual que hizo #122
con `(#122 R1)`. Son ocho tests en ejecución. El sufijo es
`en su tag de apertura (#120 R1)` en `consistency` y
`, con variant y bg-danger en su tag de apertura (#120 R2)` en `legibility`.
C4 pide un test que nombre cada R-id.

Se comprobó con `grep -rn` sobre `specs/`, `docs/`, `progress/` y
`mobile-pet-tracker/src` que ningún test ni doc vivo cita los títulos viejos.
El único que cita uno es el `design.md` de #112 (§Barrido de gemelos), que es
el registro histórico de una feature cerrada y no se toca.

## Cambios de veredicto declarados

La tabla completa está en [[tasks]] §R3. Aquí van los que no son «hoy verde,
ahora rojo»:

- **Rojos falsos que se curan (`B-login-p`, `P-week-p`, `S-p`).** Con la clase
  en el tag, pero antes del `testID`, hoy da rojo, porque el bloque empieza en
  el ancla. Con el tag entero en la ventana, pasa a verde, que es lo correcto.
- **`S-n`: de rojo a verde, y se declara.** Si el skeleton del hero pasa a
  tener un hijo `<View className="rounded-card" />`, hoy
  `not.toContain('rounded-')` da rojo, porque el hijo entra en el bloque. Con
  R1 pasa a verde: el radio es del hijo y no del skeleton, y lo que vigila
  esta aserción es que el skeleton va a sangre. Un radio fuera de escala en
  el hijo lo sigue parando `#62 R4 … no deja la clase fuera de escala`, que
  mira el fichero entero.
- **`B-login-n`: el fichero sigue en rojo, con un test menos.** Con
  `rounded-2xl` en la etiqueta de `login-submit`, hoy caen tres tests, el
  `not.toContain` de CS1 entre ellos. Con R1, CS1 ya no ve la etiqueta y caen
  dos: `#62 R4 … rounded-2xl` y `#98 R10`, que vetan `rounded-2xl` en todo
  `src/`. El veredicto del fichero no cambia.
- **Falla hacia rojo (`P-week-a`, `P-week-l1`).** Una segunda copia inocua del
  ancla (un comentario JSX con `testID="pill-week"`) o un `<` dentro del tag
  (`hitSlop={0 < 1 ? 4 : 0}`) dan hoy verde y con R1 rojo, aunque el tag es
  correcto. Son el límite 1 y la unicidad de la convención: el aviso es a
  propósito.
- **Límites documentados (`P-week-j`, `P-week-f`, `P-week-l3`).** Un
  comentario JSX `{/* rounded-xl */}` o un `{false && 'rounded-xl'}` como
  primer hijo quedan entre el `>` y el primer hijo elemento (límite 2). Un
  `// rounded-xl` dentro del propio tag lo lee igual la regex (límite 3).
  Siguen en verde hoy y con R1.
- **El residuo de CS5 (`D-d`).** Un señuelo
  `{false && (<Button.Label className="font-bold text-danger-foreground">…</Button.Label>)}`,
  con su `>` y su texto, delante de una etiqueta real con
  `className="font-bold text-foreground"`, pasa en verde hoy y con R2. El
  árbol de `reminders/index.test.tsx` tampoco lo para. Es el hueco del bloque
  de subárbol que se queda. Se registra como candidato ([[requirements]]
  §Fuera de alcance).

  El señuelo tiene que llevar `>`. Uno que se cierra solo (`… />`) no casa
  con el literal `'<Button.Label className="font-bold text-danger-foreground">'`
  y da rojo hoy: una primera versión de la sonda lo hizo así y no demostraba
  nada. La tabla de [[tasks]] §R3 lleva la versión con `>`.

## Los guards

- `src/__tests__/design-drift.test.ts` **no lee** ninguno de los dos ficheros.
  `grep -c classnames src/__tests__/design-drift.test.ts` da 0, y los
  recorridos de directorio del guard excluyen `__tests__/`. El único que mira
  todo el TS, `__tests__` incluido, es `#87 R19`, que busca `use-api` y
  `useApi`. Ningún literal de esta spec los contiene. Aun así, los literales
  citan siempre `#120 R<n>` y no llevan hex ni la palabra `StyleSheet`.
- Ningún test lee `docs/conventions.md` con el guard de hex. El párrafo de R4
  cita `(#120)`, como ya hacen los de #121, #124 y #126.

## Coordinación

- **La sesión Backend trabaja #77** (`feature/77-mobile-home-weight-without-collar`)
  en `src/screens/home/index.tsx` e `index.test.tsx`.
  `git diff --name-only origin/main...origin/feature/77-mobile-home-weight-without-collar`
  no incluye ningún fichero de esta feature. Su spec declara que
  `style={TABULAR_NUMS}` en `home/index.tsx` sigue en 8. Ningún call-site de
  `elementWithTestId` lee `home/index.tsx`. Esta feature **no toca** los
  candados de fichero entero sobre `home/index.tsx`, como el `text-accent-strong`
  ×2 de `#61 R4`, `#61 R5` y las cuentas por fichero de `#62 R14`, `#62 R15` y
  `#98 R10`, porque #77 puede moverlos.
- Las dos mutaciones versionadas tocan `src/screens/reminders/index.tsx` y se
  revierten en el commit siguiente. Ninguna rama abierta toca ese fichero.

## Archivos afectados, por capa

No hay capa de aplicación: el diff de producción es vacío.

| Fichero | Cambio |
|---|---|
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `elementWithTestId` se sustituye por `openingTagWithTestId`, y los cuatro call-sites cambian de helper y de título (R1) |
| `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` | Se añade `openingTagWithTestId` junto a `elementWithTestId`, un comentario sobre `const deleteConfirm` y el tercer `it` de `#61 R1`, partido (R2) |
| `docs/conventions.md` | Un párrafo en §Recortes del tag de apertura en candados de fuente (R4) |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | Solo en los commits rojos, revertido en los verdes. Diff acumulado vacío (R5) |

## Alternativas descartadas

- **La receta sola, sin el corte en `/>`** (opción (i)). Abre el verde falso de
  `S-j` y `V-f`, que hoy es rojo. Se descarta, porque una migración que abre un
  agujero que hoy está cerrado no es una mejora.
- **Dejar CS2 y CS3 con el bloque de hoy** (opción (ii)). Mantiene `V-h` y
  `S-h` en verde falso y el rojo falso de `S-p`. Además contradice el segundo
  criterio de la entrada: los dos miran el tag propio.
- **Migrar CS5 entero a la ventana de `<` a `<`.** La etiqueta está fuera del
  tag, así que la primera aserción daría rojo en el árbol sano, y el veto del
  acento dejaría de ver a los hijos.
- **Dejar CS5 entero en el bloque.** Deja `D-v` en verde en toda la suite:
  nada más vigila `variant="danger"`.
- **Patas de árbol sobre `props.className`** para cerrar los límites 2 y 3.
  Obligan a montar cuatro pantallas y un componente, con sus mocks, dentro de
  dos ficheros que hoy solo leen fuente. Es otra feature
  ([[requirements]] §Fuera de alcance, (F)).
- **Un módulo compartido de helpers de candado de fuente.** Ver §La copia del
  helper.
