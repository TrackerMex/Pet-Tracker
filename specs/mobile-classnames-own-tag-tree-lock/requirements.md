---
feature: "mobile-classnames-own-tag-tree-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Requisitos — [[mobile-classnames-own-tag-tree-lock]] (#127 y #128)

> Notación EARS. Cada requisito lleva su id `R<n>`, que no cambia una vez
> aprobado. Ver [[design]] para las decisiones y las alternativas descartadas,
> [[tasks]] para el orden TDD, el código exacto, los blobs y las sondas, y
> [[traceability]] para el cierre.
>
> **Dos entradas, un ciclo.** El humano decidió el 2026-10-01 especificar #127
> y #128 juntas. Las dos son solo test, nacen del mismo §Fuera de alcance de
> la spec de #120 (`specs/mobile-classnames-element-slice-children/requirements.md`)
> y se cierran igual: con una aserción en el árbol sobre la clase de cada
> elemento. Además comparten `src/screens/reminders/index.test.tsx`. Esta es la
> spec de verdad de las dos. #128 tiene un puntero en
> `specs/mobile-delete-confirm-label-tree-lock/requirements.md`, como #142 en
> el ciclo de #141.
>
> | Entrada | Origen | Requisitos que le pertenecen |
> |---|---|---|
> | **#127** `mobile-classnames-own-tag-tree-lock` | primer hallazgo (F) de la spec de #120: «Los límites 2 y 3 sobre los nueve elementos de R1» | **R1**, **R2** y **R3** |
> | **#128** `mobile-delete-confirm-label-tree-lock` | segundo hallazgo (F) de la spec de #120: «El señuelo sobre el bloque de subárbol de CS5 (D-d)» | **R4** |
> | las dos | — | **R5** (la convención) y **R6** (cierre medido) |
>
> **Base medida: `09d8047d`**, en la branch
> `feature/127-mobile-classnames-own-tag-tree-lock`. Es `origin/main`
> (`886558db`, el merge de la PR #181 de #141) más el commit que registra #144
> y arranca este ciclo, que no toca `mobile-pet-tracker/`. Medido el
> 2026-10-01. **Los números de línea no son anclas**, ni los de esta spec ni
> los de las entradas de `feature_list.json`. Todo se localiza con los `grep`
> o los títulos literales que se citan, y las cuentas se vuelven a medir al
> arrancar ([[tasks]] §Antes de tocar nada).
>
> Los títulos nuevos llevan el prefijo `#127 R1`, `#127 R2`, `#127 R3` o
> `#128 R4`, como pide `docs/conventions.md` §Prefijo de feature cuando un
> fichero acumula R-ids de dos specs. Nunca un id suelto.

## Contexto mínimo para implementar sin más contexto

### Qué hay hoy y qué hueco queda

Tras #120, dos candados de fuente leen la receta de diez elementos con un
recorte de `<` a `<` alrededor del `testID` (`openingTagWithTestId`).
`docs/conventions.md` §Recortes del tag de apertura en candados de fuente
lista los tres límites del recorte:

1. un `<` dentro del tag adelanta el corte: **falla hacia rojo**;
2. un comentario JSX `{/* … */}` o un `{false && '…'}` como primer hijo entra
   en el recorte: **verde falso**;
3. una línea `// …` dentro del propio tag entra en el recorte: **verde falso**.

Los candados son estos:

- `src/__tests__/consistency-classnames.test.ts` (53 tests) lee nueve
  elementos: los cuatro botones de envío, los dos skeletons y las tres
  píldoras.
- `src/__tests__/legibility-classnames.test.ts` (26 tests) lee el tag de
  `reminders-delete-confirm`. Para la etiqueta, en cambio, lee el bloque
  entero del botón con `elementWithTestId`, que va del ancla al
  `</Button>`. Ese bloque ve un señuelo `{false && (…)}` con la etiqueta
  correcta delante de la real: **verde falso** (sonda `D-d`).

Esta spec no toca ninguno de los dos ficheros. Cierra los huecos **en el
árbol**: en el test de la pantalla o del componente de cada elemento, una
aserción sobre lo que de verdad se renderiza. Un comentario o un
`{false && …}` no se renderizan, así que no existen para el árbol.

### Los diez elementos, en el árbol

`heroui-native` está fijado a `1.0.8` en `mobile-pet-tracker/package.json`. Ese
paquete compone el `className` del host así (medido en los logs de las
sondas):

- `Button`: `pressable-feedback__root button__root button__root--variant-<variant> button__root--size-md`,
  después `disabled:element-disabled` si `isDisabled`, y por último la clase
  propia;
- `Button.Label`: `button__label button__label--variant-<variant> button__label--size-md`
  y la clase propia;
- `Skeleton`: `skeleton__root` y la clase propia. El test del hero sustituye
  `Skeleton` por un `View` (`grep -n "Skeleton: (props" src/components/__tests__/pet-hero-header.test.tsx`),
  así que allí la clase es solo la propia.

Rutas relativas a `mobile-pet-tracker/`:

| # | `testID` | Producción | Test | Montaje | `className` en el árbol | `style` |
|---|---|---|---|---|---|---|
| 1 | `login-submit` | `src/app/(auth)/login.tsx` | `src/app/(auth)/__tests__/login.test.tsx` | `renderLogin()`, sin sesión | `'pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent'` | no se asevera |
| 2 | `forgot-submit` | `src/app/(auth)/forgot.tsx` | `src/app/(auth)/__tests__/forgot.test.tsx` | `render(<Forgot />, { wrapper: AuthScreenWrapper })`. El botón lleva `isDisabled` fijo | `'pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full rounded-xl bg-accent'` | no se asevera |
| 3 | `register-submit` | `src/app/(auth)/register.tsx` | `src/app/(auth)/__tests__/register.test.tsx` | `renderRegister()`, sin sesión. `isDisabled={!terms \|\| submitting}`, y al montar los términos están sin marcar | la misma que forgot | no se asevera |
| 4 | `reset-submit` | `src/screens/reset-password/index.tsx` | `src/screens/reset-password/index.test.tsx` | `renderRoute('reset-token-127')` | la misma que login | no se asevera |
| 5 | `vaccines-skeleton` | `src/screens/health/index.tsx` | `src/screens/health/index.test.tsx` | `renderHealth()` con una mascota, pesos y vacunas pendientes | `'skeleton__root h-24 w-full rounded-card'` | no se asevera, (D) |
| 6 | `pet-hero-skeleton` | `src/components/pet-hero-header.tsx` | `src/components/__tests__/pet-hero-header.test.tsx` | `renderHero(<PetHeroHeader pet={null} variant="bleed" />)` | `'w-full'` | `{ height: 260 }` |
| 7 | `pill-active` | `src/screens/reminders/index.tsx` | `src/screens/reminders/index.test.tsx` | `renderReminders()` con una mascota y un recordatorio | `'flex-1 items-center gap-1 rounded-xl bg-accent-soft p-3'` | `{ borderCurve: 'continuous' }` |
| 8 | `pill-week` | la misma | el mismo | el mismo | `'flex-1 items-center gap-1 rounded-xl bg-default p-3'` | `{ borderCurve: 'continuous' }` |
| 9 | `pill-inactive` | la misma | el mismo | el mismo | `'flex-1 items-center gap-1 rounded-xl bg-default p-3'` | `{ borderCurve: 'continuous' }` |
| 10 | `reminders-delete-confirm` | la misma | el mismo | el mismo, y abre el sheet pulsando `reminder-delete-reminder-1` | `'pressable-feedback__root button__root button__root--variant-danger button__root--size-md w-full rounded-xl bg-danger'` | no se asevera |
| 10b | su `Button.Label` («Eliminar») | la misma | el mismo | dentro del botón, con `within` | `'button__label button__label--variant-danger button__label--size-md font-bold text-danger-foreground'` | no se asevera |

En la fuente, los cuatro botones llevan
`        className="w-full rounded-xl bg-accent"` (8 espacios; `grep -c` da 1 en
cada fichero). El alto del hero es `PET_HERO_MEDIA_HEIGHT = 260`
(`grep -n "PET_HERO_MEDIA_HEIGHT = " src/components/pet-hero-header.tsx`), y
`CONTINUOUS_CORNER` es `{ borderCurve: 'continuous' }`
(`src/theme/native-styles.ts`). El test escribe `260` y `'continuous'` como
literales: no importa ninguno de los dos.

Los siete tests ya montan su pantalla o su componente con un helper propio, y
los bloques nuevos los usan sin tocarlos. No hay ningún helper ni import
nuevo.

### Qué cambia en el árbol de ficheros

- **Siete tests**, con un bloque añadido al final de cada uno (+189 / −0). En
  `src/screens/reminders/index.test.tsx` van dos bloques: el de R3 y el de R4.
- **`docs/conventions.md`**, una sección editada (+12 / −3, R5).
- **Producción**: los siete ficheros entran y salen en los commits rojos. Cada
  uno lleva una mutación versionada que el commit verde siguiente revierte, y
  el diff acumulado contra `origin/main` es **vacío**.

## Premisas de las entradas, verificadas contra el árbol

Todas las medidas están hechas en un worktree de sondas desacoplado sobre
`09d8047d`, con estos dos conjuntos de suites:

- **«las nueve»**: los dos candados de fuente y los siete tests. Son 212 tests
  en la base y 220 con los bloques.
- **«las 33»**: las nueve más las 24 suites que importan o leen esos siete
  ficheros de producción. Son 780 tests en la base y 788 con los bloques. La
  lista exacta está en [[tasks]] §Sondas.

| Premisa (`feature_list.json` #127 y #128, y el encargo del `leader`) | Veredicto | Evidencia |
|---|---|---|
| #127: `P-week-j`, `P-week-f` y `P-week-l3` (blobs `efa2646a`, `214a8eb9` y `baa5baba`) dan verde hoy | **cierta, re-medida** | con los bloques, cada una da un solo rojo en las nueve, el `it` nuevo de R3, y las otras 24 suites siguen verdes (568/568). Ninguna suite de la base la ve |
| #127: «el árbol lo cerraría: una aserción sobre `props.className` de cada elemento, como la que `src/screens/reminders/index.test.tsx` ya hace para `bg-danger`» | **cierta, con un matiz** | esa aserción está dentro del helper `confirmDelete` (`grep -n "toContain('bg-danger')" src/screens/reminders/index.test.tsx` da 1) y es un `toContain`. Un `toContain` de una clase también casa con otra clase que la contenga: `bg-accent` está dentro de `bg-accent-soft`, y `bg-danger` dentro de `bg-danger-soft`. Por eso R1 a R4 usan `toBe` sobre la clase entera ([[design]] D3) |
| #127: «Coste: montar cuatro pantallas y un componente» | **falsa, (N)** | los nueve elementos viven en **seis** pantallas (login, forgot, register, reset-password, salud y recordatorios) y **un** componente (el hero), y los siete tests ya los montan con su helper. El coste real es un bloque por test, sin ningún montaje nuevo |
| #127: `files_affected` es `consistency-classnames.test.ts` | **falsa, (N)** | ese fichero no cambia: su recorte no puede ver el árbol. Los candados van en los siete tests de cada elemento, y en `docs/conventions.md` (R5). Ver §Qué firma el humano, punto 2 |
| #127: «las sondas que hoy dan rojo en `consistency-classnames` siguen en rojo» | **cierta, medida** | `B-login-h`, `P-week-h`, `V-h` y `S-h` siguen en rojo en su `it` `(#120 R1)` con los bloques y suman el `it` nuevo: rojo 2 cada una en las nueve |
| #128: `D-d` (blob `50cc3d89`) da verde en `legibility-classnames` y en el árbol de `src/screens/reminders/index.test.tsx` | **cierta en esos dos ficheros; falsa en la suite, (N)** | en las nueve, con los bloques, su único rojo es R4. Pero en las 33 da **2 rojos más, hoy y con los bloques**: `#65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas` y `#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta`, los dos en `src/__tests__/ui-language.test.ts` y por `toEqual`. El señuelo añade una aparición de `t('reminders.delete')` y esos `it` cuentan las apariciones. Es un rojo de recuento, no de color. Por eso el rojo de R4 es `D-c` y no `D-d` ([[design]] D5) |
| #128: «lo cerraría una aserción en el árbol sobre la clase de la etiqueta del botón destructivo» | **cierta, y R4 la amplía al botón** | con la etiqueta sola, `variant="danger-soft"` más la línea `// variant="danger"` dentro del tag (`Z-d-variant`, blob `a94461d0`) da verde en las 33 hoy: es el límite 3 sobre el `toContain('variant="danger"')` de `(#120 R2)`. R4 asevera también la clase del botón, y con ella esa sonda da rojo 1 |
| #128: «el `it` de `#120 R2` sigue igual y en verde» | **cierta** | `legibility-classnames.test.ts` no se toca. `D-v` (blob `f136e971`) sigue en rojo en él con los bloques, y suma R4: rojo 2 |
| Las mutaciones de los cuatro rojos solo ponen en rojo sus `it` nuevos | **cierta, medida** | cada una sobre el árbol con los ocho bloques, en las 33: `P1red` 4 rojos (los cuatro de R1), `P2red` 2 rojos (los dos de R2), `P3red` 1 (R3) y `D-c` 1 (R4). Las otras 24 suites, 568/568 en cada caso |
| Ninguna otra suite ve esas mutaciones | **medido** | otros cinco tests nombran esas rutas como cadena (`src/api/__tests__/auth.test.ts`, `src/api/__tests__/reminders.test.ts`, `src/app/(auth)/__tests__/layout.test.tsx`, `src/screens/add-reminder/index.test.tsx` y `src/screens/weight-log/index.test.tsx`). Con las cuatro mutaciones a la vez, dan 129/129 |
| Base de las nueve | **medida sin pipe** | 212/212, `exit=0`: 53 + 26 + 29 (recordatorios) + 9 (login) + 3 (forgot) + 11 (register) + 17 (reset) + 28 (salud) + 36 (hero) |
| Suite de base | **relatada, no medida** | 86 suites / 1626 tests y 1 snapshot, `exit=0`, del `./init.sh` del `leader` sobre `09d8047d`. El spec_author no corrió la suite entera, por encargo. Codex la mide al arrancar ([[tasks]] §Antes de tocar nada, paso 6) |
| Blobs de base | **medidos** | los catorce ficheros y `docs/conventions.md`, en [[tasks]] §Antes de tocar nada, paso 5. Son iguales en `09d8047d` y en `origin/main` |
| El árbol final compila y pasa el lint | **medido** | `bunx tsc --noEmit` da `exit=0` con los bloques y también con las cuatro mutaciones rojas aplicadas. `bunx eslint` de los catorce ficheros da `exit=0` |
| La edición de `docs/conventions.md` no rompe nada | **medido** | las cuatro suites que leen o citan ese fichero (`design-drift`, `hero-header-amendments`, `hosting-artifacts` y `src/screens/home/index.test.tsx`) dan 234/234 con la sección editada |
| Nadie más toca estos ficheros | **verificado** | la branch de #60 (`feature/60-mobile-ios-support`, en el worktree principal) no toca ninguno de los catorce. En `docs/conventions.md` solo toca una línea de otra sección (la de `DATABASE_URL`). La única otra branch remota que toca `docs/conventions.md` es `feature/18-nutrition-ai-explainer` (+3 líneas), que lleva parada desde el 2026-08-18 |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0` en el worktree de la branch. No hay configuración de prettier en `mobile-pet-tracker/` |

## Requisitos funcionales

- **R1** (#127): WHILE cada pantalla de autenticación esté montada en su estado
  inicial (login, forgot, register y reset-password), THE SYSTEM SHALL pintar
  su botón de envío (`login-submit`, `forgot-submit`, `register-submit` y
  `reset-submit`) con un `className` en el árbol **exactamente igual** al
  literal de las filas 1 a 4 de §Contexto mínimo. Ese literal incluye
  `rounded-xl` y `bg-accent` y, en forgot y register, `disabled:element-disabled`.

  Hay un `it` por test, cada uno en su propio `describe`:

  - `login.test.tsx`: `#127 R1: el botón de envío de login lleva su receta en el árbol › pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente`
  - `forgot.test.tsx`: `#127 R1: el botón de envío de forgot lleva su receta en el árbol › pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente`
  - `register.test.tsx`: `#127 R1: el botón de envío de register lleva su receta en el árbol › pinta register-submit, deshabilitado al montar, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente`
  - `reset-password/index.test.tsx`: `#127 R1: el botón de envío de reset-password lleva su receta en el árbol › pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente`

  Cada uno asevera
  `expect(screen.getByTestId('<testID>').props.className).toBe('<literal>')`.

  IF una clase sale del `className` del botón o entra otra, aunque la receta
  siga en la fuente dentro del tag (una línea `// …`, límite 3) o como primer
  hijo (`{/* … */}`, límite 2), THEN el `it` de esa pantalla SHALL fallar
  **por aserción** (`expect(received).toBe(expected)`). El rojo es una mutación
  de producción versionada (C4, vía **b**): `P1red`, que en los cuatro ficheros
  saca `rounded-xl` del `className` y lo deja en una línea `// rounded-xl bg-accent`
  dentro del tag. Con ella, los **cuatro** `it` de R1 SHALL ser los **únicos**
  rojos de la suite (4 failed de 1630 sobre la base relatada, en 4 suites).

- **R2** (#127):
  - WHILE la pantalla de salud espere las vacunas (`listVaccines` pendiente),
    THE SYSTEM SHALL pintar `vaccines-skeleton` con un `className`
    exactamente igual a `'skeleton__root h-24 w-full rounded-card'`.
  - WHILE `PetHeroHeader` se monte sin mascota (`pet={null}`,
    `variant="bleed"`), THE SYSTEM SHALL pintar `pet-hero-skeleton` con un
    `className` exactamente igual a `'w-full'` y un `style` estrictamente
    igual a `{ height: 260 }`.

  Hay dos `it`:

  - `health/index.test.tsx`: `#127 R2: el skeleton de vacunas lleva su receta en el árbol › pinta vaccines-skeleton con la clase exacta, rounded-card incluido, la vea o no el recorte de fuente`
    asevera el `className` con `toBe`, después de la guarda
    `await waitFor(() => expect(screen.getByTestId('vaccines-skeleton')).toBeVisible())`.
  - `pet-hero-header.test.tsx`: `#127 R2: el skeleton del hero lleva su receta en el árbol › pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 260 como único estilo, los vea o no el recorte de fuente`
    asevera el `className` con `toBe('w-full')` y el `style` con
    `toStrictEqual({ height: 260 })`. Un radio en la clase (`rounded-*`) o en el
    estilo (`borderRadius`) lo rompe.

  IF la clase o el estilo de uno de los dos skeletons cambian, aunque la
  receta de antes siga en la fuente dentro del tag, THEN su `it` SHALL fallar
  **por aserción** (`toBe` para la clase, `toStrictEqual` para el estilo). El
  rojo es `P2red` (vía **b**). En salud, `rounded-card` sale de la clase y la
  receta entera queda en un comentario `// className="h-24 w-full rounded-card"`.
  En el hero, la clase pasa a `w-full bg-default` y la de antes queda en
  `// className="w-full"`. Con ella, los **dos** `it` de R2 SHALL ser los
  **únicos** rojos de la suite (2 failed de 1632, en 2 suites).

- **R3** (#127): WHILE la pantalla de recordatorios muestre la lista (una
  mascota y un recordatorio cargados), THE SYSTEM SHALL pintar las tres
  píldoras de resumen, en este orden, con el `className` y el `style` de las
  filas 7 a 9 de §Contexto mínimo.

  `reminders/index.test.tsx`: `#127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente`

  espera a que se vea `reminder-row-reminder-1` (guarda) y asevera con
  `toStrictEqual` la lista `{ testID, className, style }` de
  `pill-active`, `pill-week` y `pill-inactive` contra una lista literal.

  IF una píldora pierde o gana una clase, o su `style` deja de ser
  `{ borderCurve: 'continuous' }`, aunque la receta siga en la fuente (como
  primer hijo o en una línea `//` dentro del tag), THEN ese `it` SHALL fallar
  **por aserción** (`expect(received).toStrictEqual(expected)`). El rojo es
  `P3red`, que es la sonda `P-week-l3` de la entrada (blob `baa5baba`): saca
  `rounded-xl` de la clase de `pill-week` y lo deja en una línea `// rounded-xl`
  dentro del tag. Con ella, el `it` de R3 SHALL ser el **único** rojo de la
  suite (1 failed de 1633).

- **R4** (#128): WHILE el sheet de borrado esté abierto (tras pulsar
  `reminder-delete-reminder-1`), THE SYSTEM SHALL pintar
  `reminders-delete-confirm` con el `className` de la fila 10 de §Contexto
  mínimo, que lleva la variante `danger` y `bg-danger`. Dentro de ese botón
  SHALL pintar **una sola** etiqueta con el texto «Eliminar», con el
  `className` de la fila 10b, que lleva `text-danger-foreground`.

  `reminders/index.test.tsx`: `#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol › pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente`

  asevera con `toBe` el `className` del botón y el de
  `within(confirm).getByText('Eliminar')`. «Eliminar» es el texto de
  `reminders.delete` en español, una copy que ya existe en el catálogo.

  Este `it` SHALL fallar en tres casos:

  - IF la etiqueta que se renderiza pierde `text-danger-foreground`, aunque
    delante quede un señuelo comentado (`D-c`) o un `{false && (…)}` (`D-d`)
    con la etiqueta correcta, THEN SHALL fallar **por aserción**, en la
    aseveración de la etiqueta.
  - IF el botón cambia de variante, aunque `variant="danger"` quede en una
    línea `//` dentro del tag (`Z-d-variant`), THEN SHALL fallar **por
    aserción**, en la aseveración del botón.
  - IF se renderizan dos etiquetas «Eliminar» dentro del botón (`Z-d-dup`),
    THEN SHALL fallar **por consulta** (`Found multiple elements with text: Eliminar`).

  El rojo es `P4red`, que es `D-c` (blob `74fe6d45`, vía **b**): antes de la
  etiqueta real pone la línea
  `{/* <Button.Label className="font-bold text-danger-foreground"> */}`, y la
  etiqueta real pasa a `className="font-bold text-foreground"`. Con ella, el
  `it` de R4 SHALL ser el **único** rojo de la suite (1 failed de 1634).

- **R5** (las dos): WHEN el ciclo se cierre, `docs/conventions.md` §Recortes
  del tag de apertura en candados de fuente SHALL decir tres cosas:

  1. Los límites 2 y 3 sobre los nueve elementos los cierra el árbol, con
     `toBe` y `style`, y se encuentran con `grep -rn "#127 R" mobile-pet-tracker/src`.
  2. Los `className` de los `Button` llevan las clases de heroui-native, y hay
     que volver a medirlos al subir su versión.
  3. El hueco del señuelo sobre el bloque del botón destructivo lo cierra
     `#128 R4`, y explica por qué un señuelo no renderizado no está en el
     árbol.

  La frase «quedan como límites documentados» SHALL desaparecer. El texto
  exacto está en [[tasks]] §R5. Se verifica con las cuentas de `grep` de esa
  sección, y con las cuatro suites que leen o citan el fichero en verde.

- **R6** (las dos): THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +8 tests (R1 cuatro, R2 dos, R3 uno y
     R4 uno). Las nueve pasan de 212 a 220. La suite pasa de 86 / 1626 a
     86 / 1634, medida sin pipe. Si la base medida al arrancar es otra, el
     delta exigido sigue siendo +8 tests y +0 suites sobre lo medido.
  2. **Diff de producción vacío**:
     `git diff --exit-code origin/main...HEAD` sobre los siete ficheros de
     producción da 0. Los siete acaban en su blob de base.
  3. **Ningún test previo editado**: cada uno de los siete tests de la base es
     un prefijo exacto del final (`cmp -n`). Sus diffs suman 189 líneas
     añadidas y 0 borradas. `consistency-classnames.test.ts`,
     `legibility-classnames.test.ts` y `ui-language.test.ts` no cambian.
  4. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los catorce ficheros con `exit=0`.
  5. **Ninguna dependencia nueva ni copy nueva**: `package.json`, `bun.lock`,
     `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx`
     y `src/__tests__/ui-copy-table.ts` sin cambios.
  6. Las cuentas de `grep` de [[tasks]] §R6.
  7. La tabla de [[tasks]] §Sondas, re-medida sobre el árbol final, en
     `progress/impl_mobile-classnames-own-tag-tree-lock.md`.

  No tiene test propio: es una propiedad del diff y de la suite. Lo cierra el
  `reviewer` por inspección.

## Decisiones por elemento

Siguen `docs/ui-guidelines.md` §Enmienda #70 y cuentan por hijos host, no por
`testID`. «Hoy» es quién lo cierra en la base y «tras este ciclo», quién lo
cierra al acabar. «Fuente» quiere decir que la cierra un candado de fuente con
los límites 2 y 3 abiertos.

**Las tres píldoras** (el elemento repetido, tres veces):

| Decisión | Hoy | Tras este ciclo |
|---|---|---|
| 5. hueco de fondo (`bg-accent-soft` en la activa, `bg-default` en las otras dos) | fuente, más un recuento en `#98 R10` | **R3**, en el árbol, por posición |
| 10. forma (`items-center gap-1 p-3` y `rounded-xl`) | fuente: `P-week-j`, `P-week-f` y `P-week-l3` verdes | **R3**, que pone las tres en rojo 1 |
| 10. esquina continua (`style`) | nadie en el árbol: `Z-week-style` da rojo solo con R3 | **R3** |
| 11. envoltorio (`flex-1`) | fuente | **R3** |
| 7. receta tipográfica de sus dos `Text` hijos (el recuento y el rótulo) | **nadie** (`Z-child`, verde en las 33) | **nadie: (F)** |
| 1, 3 y 9. dato, rótulo y condición de render | no se midieron en este ciclo | fuera de alcance, (D) |

**Los cuatro botones de envío** (la misma receta en cuatro pantallas):

| Decisión | Hoy | Tras este ciclo |
|---|---|---|
| receta del botón en reposo (`w-full rounded-xl bg-accent`) | fuente: `B-login-j` y `P1red` verdes | **R1**, que pone las dos en rojo |
| variante y tamaño de heroui | nadie | **R1**, dentro del literal |
| deshabilitado al montar (forgot y register) | nadie en el árbol | **R1**, dentro del literal |
| receta en otro estado (enviando) | nadie (`Z-state2`, verde en las 33) | **nadie: (D)** |
| 7. tinta de su `Button.Label` (`text-accent-foreground`) | **nadie** (`Z-label`, verde en las 33) | **nadie: (F)** |

**Los dos skeletons**:

| Decisión | Hoy | Tras este ciclo |
|---|---|---|
| clase de `vaccines-skeleton` | fuente (`V-h` en rojo; el límite 3 sigue abierto) | **R2** |
| `style` de `vaccines-skeleton` | no se midió | (D) |
| clase de `pet-hero-skeleton` | fuente (`S-h` en rojo; el límite 3 sigue abierto) | **R2** |
| `style` de `pet-hero-skeleton` (alto y ningún radio) | fuente, sin ver el límite 3 (`Z-hero-style`) | **R2**, con `toStrictEqual` |

**El botón destructivo** (un elemento con un hijo):

| Decisión | Hoy | Tras este ciclo |
|---|---|---|
| variante y fondo del botón | fuente (`(#120 R2)`), más el `toContain('bg-danger')` de `confirmDelete`. `Z-d-variant` sale verde | `(#120 R2)`, `confirmDelete` y **R4**, con `toBe` |
| 7. tinta de la etiqueta | bloque de `#61 R1`, con el hueco del señuelo (`D-d` y `D-c` verdes en las dos) | **R4** |
| cardinalidad: una sola etiqueta «Eliminar» | nadie | **R4**, por consulta (`Z-d-dup`) |

## Zona ciega: qué estado ve cada requisito

| Entrada de estado | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| montaje inicial | sí | sí | sí, con un recordatorio | no aplica: hace falta el sheet |
| sheet de borrado abierto | no aplica | no aplica | no | **sí** |
| enviando (`submitting`) o con los términos marcados | **no**, (D): `Z-state2` sale verde | no aplica | no aplica | no aplica |
| vacunas ya cargadas, o refrescando | no aplica | **no**, (D) | no aplica | no aplica |
| hero con mascota | no aplica | no aplica: el skeleton no se pinta | no aplica | no aplica |
| lista vacía o en error | no aplica | no aplica | **no**, (D) | no aplica |
| idioma, tema y plataforma | no, (D) | no, (D) | no, (D) | no, (D) |

Las sondas propias de esta spec prueban que cada estado recorrido cuenta, y
están en [[tasks]] §Sondas:

- **R1**: `B-login-j` (límite 2 en login) da rojo 1.
- **R2**: `Z-hero-style` (un `borderRadius` en el estilo del hero, con el de
  antes comentado) da rojo 1, por `toStrictEqual`.
- **R3**: `P-active-l3`, `P-inactive-l3` y `Z-week-style` dan rojo 1 cada una.
- **R4**: `Z-d-variant` da rojo 1 por aserción, y `Z-d-dup` rojo 1 por
  consulta.

## Tabla de sondas, resumen

Las sondas, con el blob exacto de cada mutación y el `it` que falla, están en
[[tasks]] §Sondas. «Hoy» es la mutación sobre la base. «Tras este ciclo» es la
misma mutación sobre el árbol final. Para las sondas que se midieron solo en
las nueve, «hoy» se deduce de la corrida con bloques: son los rojos que no son
`it` nuevos. Todas las rojas son **por aserción**, salvo `Z-d-dup`.

| Clase | Sondas | Hoy | Tras este ciclo |
|---|---|---|---|
| Límite 3 en los cuatro botones | `P1red` | verde (33) | **rojo 4**: los cuatro de R1, `toBe` |
| Límite 2 en un botón | `B-login-j` | verde (33) | **rojo 1**: R1 login, `toBe` |
| Límite 3 en los dos skeletons | `P2red` | verde (33) | **rojo 2**: los dos de R2, `toBe` |
| Radio en el estilo del hero | `Z-hero-style` | verde (nueve) | **rojo 1**: R2 hero, `toStrictEqual` |
| Límites 2 y 3 en `pill-week` (la entrada) | `P-week-j`, `P-week-f`, `P-week-l3` (= `P3red`) | verde (33) | **rojo 1**: R3, `toStrictEqual` |
| Límite 3 en las otras píldoras | `P-active-l3`, `P-inactive-l3` | verde (nueve) | **rojo 1**: R3 |
| Esquina de una píldora | `Z-week-style` | verde (nueve) | **rojo 1**: R3 |
| Receta de un hijo, en otro sitio | `B-login-h`, `P-week-h`, `V-h`, `S-h` | rojo 1: su `it` `(#120 R1)`, `toContain` | **rojo 2**: ese y el `it` nuevo de su elemento |
| Señuelo comentado en la etiqueta | `D-c` (= `P4red`) | verde (33) | **rojo 1**: R4, `toBe` de la etiqueta |
| Señuelo `{false && …}` en la etiqueta (la entrada) | `D-d` | rojo 2 en las 33, **solo** de `ui-language` (`#65 R8` y `#65 R18`, `toEqual`) | **rojo 3**: esos dos y R4, `toBe` de la etiqueta |
| Variante con la buena comentada | `Z-d-variant` | verde (33) | **rojo 1**: R4, `toBe` del botón |
| Dos etiquetas renderizadas | `Z-d-dup` | verde (nueve) | **rojo 1**: R4, **por consulta** |
| `bg-danger` fuera del tag | `D-h` | rojo 10: `(#120 R2)` y nueve de `confirmDelete` | **rojo 11**: esos y R4, `toBe` del botón |
| Sin `variant="danger"` | `D-v` | rojo 1: `(#120 R2)`, `toContain` | **rojo 2**: ese y R4, `toBe` del botón |
| Radio fuera de escala solo al enviar | `Z-state` | rojo 2: `#62 R4` y `#98 R10`, `toEqual` | **rojo 2**, igual: R1 no ve ese estado |
| Fondo distinto solo al enviar | `Z-state2` | verde (33) | **verde** (33): (D) |
| Tinta de la etiqueta del envío | `Z-label` | verde (33) | **verde** (33): (F) |
| Tipografía de un hijo de píldora | `Z-child` | verde (33) | **verde** (33): (F) |

## Qué firma el humano al aprobar esta spec

1. **Un ciclo y dos entradas.** R1, R2 y R3 son de #127, R4 es de #128, y R5 y
   R6 son de las dos. Solo #127 pasa a `in_progress`, porque `init.sh` aborta
   con más de una (`grep -n 'fail "Más de 1 feature en in_progress' init.sh`).
   #128 se queda en `spec_ready` con un puntero y pasa a `done` con el mismo
   veredicto. Una sola branch, un solo handoff y una sola revisión.
2. **Todo se cierra en el árbol, en el test de cada elemento.**
   `consistency-classnames.test.ts` y `legibility-classnames.test.ts` no se
   tocan, y sus límites siguen ahí para quien lea solo fuente. El
   `files_affected` de #127 pasa de `consistency-classnames.test.ts` a los
   siete tests más `docs/conventions.md`, y el de #128 suma `docs/conventions.md`.
3. **`toBe` con la clase entera, incluidas las clases que añade
   heroui-native 1.0.8** (`pressable-feedback__root button__root …`,
   `button__label …`, `skeleton__root`). Es más estricto que `toContain`, que
   dejaría pasar `bg-accent` dentro de `bg-accent-soft`. El coste: siete
   literales (los cinco botones, la etiqueta y el skeleton de vacunas) cambian
   al subir de versión heroui-native, y quien la suba tendrá que volver a
   medirlos. R5 lo deja escrito en la convención.
4. **Los literales dependen del estado del montaje.** Forgot y register
   llevan `disabled:element-disabled` porque al montar están deshabilitados;
   login y reset no lo llevan. El literal del hero (`'w-full'`) es el del
   `View` con el que su test sustituye a `Skeleton`; el componente real
   añadiría `skeleton__root`. Los otros estados quedan como (D): `Z-state2`
   sale verde.
5. **R4 cubre el botón, no solo la etiqueta.** La entrada pide la etiqueta.
   R4 asevera también la clase del botón, porque con ella cierra `Z-d-variant`
   (el límite 3 sobre `variant`, verde hoy en las 33) sin coste extra: el
   sheet ya está abierto.
6. **El rojo de R4 es `D-c`, no `D-d`.** `D-d` también pasa a rojo con R4, que
   es lo que pide la entrada. Pero hoy ya da rojo 2 en `ui-language.test.ts`
   por un recuento de copy, y como mutación versionada metería en el commit
   rojo dos rojos ajenos a R4. `D-c` (el señuelo comentado) solo pone en rojo
   R4.
7. **La convención cambia** (R5). Los límites 2 y 3 dejan de ser «límites
   documentados» para estos diez elementos. El límite 1 y los límites del
   recorte para cualquier elemento futuro siguen igual.
8. **Huecos declarados.** (D): los otros estados de los botones, el `style`
   del skeleton de vacunas, la lista vacía o en error, y el idioma, el tema y
   la plataforma. (F): la tinta de la etiqueta de los cuatro botones de envío
   (`Z-label`) y la tipografía de los hijos de las píldoras (`Z-child`). Las
   dos son verdes en las 33 y quedan como candidatas a otra entrada, sin id:
   lo asigna el `leader`.
9. **El delta es +0 suites y +8 tests**: 86 / 1626 antes y 86 / 1634
   después, sobre la base **relatada** por el `leader` y no medida por el
   spec_author. Codex la mide al arrancar, y el delta se exige sobre lo medido.
10. **Sin gate de dispositivo.** El árbol de producción acaba idéntico al de
    `origin/main`: en un dispositivo no hay nada nuevo que ver. No hay
    dimensiones de pantalla ni componentes compartidos que fijar, porque no
    cambia la UI. El único gate humano es la casilla de §Aprobación.
11. **Requisitos sin test de jest**: R5, que se verifica por las cuentas de
    `grep` y las cuatro suites que leen la convención, y R6, que es una
    propiedad del diff y de la suite. Los cierra el `reviewer` por
    inspección, y quedan declarados aquí antes del handoff, como pide C4.

## Cobertura de los criterios de aceptación

| Criterio (`feature_list.json`) | Cubierto por |
|---|---|
| #127.1 `P-week-j`, `P-week-f` y `P-week-l3` pasan de verde a rojo, o la spec las acepta como límite documentado | R3: las tres pasan a rojo 1. `P-week-l3` es su rojo (`P3red`) |
| #127.2 Las sondas que hoy dan rojo en `consistency-classnames` siguen en rojo | R6.3 (el fichero no cambia) y las sondas `B-login-h`, `P-week-h`, `V-h` y `S-h`, que pasan de rojo 1 a rojo 2 |
| #127.3 Los esperados son literales del test, nunca importados de producción | R1, R2 y R3: las clases, `{ height: 260 }` y `{ borderCurve: 'continuous' }` están escritos en los bloques ([[design]] D6) |
| #127.4 Cero cambio en producción; suite verde medida sin pipe; delta declarado | R6.1 y R6.2 |
| #128.1 `D-d` pasa de verde a rojo, o la spec la acepta como límite documentado | R4: `D-d` da rojo en R4, por aserción en la etiqueta. Era verde en los dos ficheros de la entrada, y sus dos rojos de `ui-language` siguen igual (§Premisas) |
| #128.2 El `it` de `#120 R2` sigue igual y en verde | R6.3: `legibility-classnames.test.ts` no cambia |
| #128.3 Los esperados son literales del test | R4: las dos clases y el texto «Eliminar» están escritos en el bloque |
| #128.4 Cero cambio en producción; suite verde medida sin pipe; delta declarado | R6.1 y R6.2 |

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de este ciclo, **(F)**
hallazgo candidato a registrarse como otra feature (sin id: lo asigna el
`leader` contra `origin/main`) y **(N)** premisa verificada y descartada.

- **(D)** *Los botones de envío en otro estado que el inicial* (enviando, o
  register con los términos marcados). Una clase que solo cambie en ese
  estado pasa (`Z-state2`, verde en las 33). Cerrarlo pide pulsar y esperar
  en cada pantalla, y la entrada pide la receta del tag, no sus estados.
- **(D)** *El `style` de `vaccines-skeleton`.* No se midió qué pone ahí el
  `Skeleton` real, así que no hay literal fiable. El de `pet-hero-skeleton`
  sí entra, porque su test sustituye `Skeleton` por un `View`.
- **(D)** *El idioma, el tema y la plataforma*, en los cuatro requisitos.
  `«Eliminar»` es el texto en español. En inglés la etiqueta sería otra, y el
  `className` no depende del idioma.
- **(D)** *Las píldoras con la lista vacía o en error*, y el dato, el rótulo y
  la condición de render de cada píldora: no son el hueco de la entrada, y no
  se midieron.
- **(D)** No se toca `consistency-classnames.test.ts`,
  `legibility-classnames.test.ts` ni `ui-language.test.ts`, ni ningún
  `describe` previo de los siete tests, ni sus helpers. No se añade copy: no
  se tocan `src/i18n/catalog.ts`,
  `src/providers/__tests__/language-provider.test.tsx` ni
  `src/__tests__/ui-copy-table.ts`. No se instala nada.
- **(F)** *La tinta de la etiqueta de los cuatro botones de envío.* Con la
  etiqueta de login en `font-bold text-foreground` en vez de
  `font-bold text-accent-foreground` (`Z-label`, blob `5c8e9b14`), las 33
  siguen verdes. Es el mismo hueco que R4 cierra en el botón destructivo, en
  otros cuatro botones.
- **(F)** *La receta tipográfica de los hijos de las píldoras.* Con el
  recuento de `pill-week` en `font-bold` en vez de `font-black` (`Z-child`,
  blob `6a341626`), las 33 siguen verdes.
- **(N)** *«Coste: montar cuatro pantallas y un componente».* Son seis
  pantallas y un componente, y los siete tests ya los montan. Ver §Premisas.
- **(N)** *Que el sitio del candado de #127 sea `consistency-classnames.test.ts`.*
  Un candado de fuente no puede ver el árbol, y ese fichero no cambia.
- **(N)** *Que `D-d` dé verde en toda la suite.* Da verde en los dos ficheros
  que nombra la entrada, pero `ui-language.test.ts` ya la pone en rojo 2 hoy
  por un recuento de copy. No es un candado de color, y por eso no sirve como
  rojo de R4.

---

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-30) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los once
      puntos de §Qué firma el humano al aprobar esta spec. En particular firma
      el tercero (los literales acoplados a heroui-native 1.0.8) y el octavo
      (`Z-label` y `Z-child` quedan como (F)).

> **Este ciclo tiene una sola casilla**: esta, que firma a la vez #127 y
> #128. No hay gate de dispositivo (§Qué firma el humano, punto 10).
