---
feature: "mobile-classnames-element-slice-children"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Requisitos — [[mobile-classnames-element-slice-children]] (#120)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para la clasificación y la medición que sostiene la decisión,
> [[tasks]] para el orden TDD, los literales y las sondas, y [[traceability]]
> para el cierre.
>
> Origen: el hallazgo **(F)** de #112
> (`specs/mobile-reminders-see-all-source-lock-nesting/requirements.md`
> §Fuera de alcance, con el detalle en su `design.md` §Barrido de gemelos). Es
> un primo del patrón que cerraron #109 y #112, no un gemelo. Aquellos
> recortaban de `<Tag` a `</Tag>`. Este recorta del ancla `testID="…"` al tag de
> cierre, así que el grep de la convención
> (`grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src`) no lo ve.
>
> **Esta feature no toca producción.** El trabajo vive en
> `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`,
> `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` y
> `docs/conventions.md`.
>
> **Base medida: `42db1ccf`**, que es `origin/main` (`e9413a6e`, merge de #126)
> más `progress/current.md`. **Los números de línea no son anclas**: todo se
> localiza con los `grep` que se citan, y las cuentas de la suite se vuelven a
> medir al arrancar ([[tasks]] §Antes de tocar nada).

## Contexto mínimo para implementar sin más contexto

Los dos ficheros son **candados de fuente**: leen el `.tsx` de producción con
`readFileSync` y aseveran sobre trozos de texto. Los dos llevan una copia, byte
a byte, del helper `elementWithTestId(source, testId, closingTag)`. Para
localizarlo: `grep -n "function elementWithTestId"`. El helper devuelve el
texto que va del ancla `testID="…"` al primer `closingTag` que aparece después,
así que **los hijos del elemento quedan dentro del bloque**.

`docs/conventions.md` §Recortes del tag de apertura en candados de fuente fija
la receta para aislar un tag de apertura:

```ts
source.slice(source.lastIndexOf('<', anchor), source.indexOf('<', anchor))
```

Va acompañada de la unicidad del ancla,
`expect(source.lastIndexOf('testID="…"')).toBe(anchor)`, y de tres límites
documentados:

1. Un `<` dentro del tag falla hacia rojo.
2. Lo que hay entre el `>` que cierra el tag y el primer hijo elemento da un
   verde falso.
3. Una receta comentada dentro del tag también da un verde falso.

Los elementos que vigilan los dos ficheros, todos con su `testID` **una sola
vez** en su fichero (`grep -c` da 1 en cada caso):

| `testID` | Fichero de producción (bajo `mobile-pet-tracker/src/`) | Tag | Receta vigilada | ¿Se cierra solo? |
|---|---|---|---|---|
| `login-submit` | `app/(auth)/login.tsx` | `Button` | `rounded-xl bg-accent` | no: `Button.Label` hijo |
| `forgot-submit` | `app/(auth)/forgot.tsx` | `Button` | `rounded-xl bg-accent` | no |
| `register-submit` | `app/(auth)/register.tsx` | `Button` | `rounded-xl bg-accent` | no |
| `reset-submit` | `screens/reset-password/index.tsx` | `Button` | `rounded-xl bg-accent` | no |
| `vaccines-skeleton` | `screens/health/index.tsx` | `Skeleton` | `className="h-24 w-full rounded-card"` | **sí** |
| `pet-hero-skeleton` | `components/pet-hero-header.tsx` | `Skeleton` | `className="w-full"`, `style={{ height: PET_HERO_MEDIA_HEIGHT }}` y ningún `rounded-` | **sí**. Detrás lleva un comentario JSX de varias líneas (`grep -n "La parada transparente se escribe"`) |
| `pill-active`, `pill-week`, `pill-inactive` | `screens/reminders/index.tsx` | `View` | `rounded-xl` | no: `Text` hijos |
| `reminders-delete-confirm` | `screens/reminders/index.tsx` | `Button` | `variant="danger"` y `bg-danger` en el tag; `<Button.Label className="font-bold text-danger-foreground">` y `t('reminders.delete')` en los hijos | no |

## Premisas de la entrada, verificadas contra el árbol

| Premisa (`feature_list.json` #120 y el encargo del `leader`) | Veredicto | Evidencia |
|---|---|---|
| `elementWithTestId` está duplicado en `consistency-classnames.test.ts` y en `legibility-classnames.test.ts` | **cierta** | `grep -n "function elementWithTestId"` da 1 en cada fichero, con cuerpo idéntico |
| Recorta del ancla a `indexOf(closingTag, start)`, así que los hijos quedan dentro | **cierta** | el `return source.slice(start, end)` del helper |
| Con `rounded-xl` quitado del tag de `pill-active` y un hijo `<View className="rounded-xl" />`, `#62 R4` sigue en verde | **cierta, re-medida** | la entrada lo midió sobre `993b62fa`. Sobre `42db1ccf`: blob `2b43ab8f` de `index.tsx`; `consistency`, `legibility` y `src/screens/reminders/index.test.tsx` dan 108/108, `exit=0`. Es la sonda `P-active-h` de [[tasks]] §R3 |
| En `legibility-classnames` hay candados que aseveran sobre el hijo, así que no se puede migrar a ciegas | **cierta** | el único call-site del fichero alimenta cinco aserciones, y tres miran hijos o el subárbol ([[design]] §Clasificación) |
| `files_affected` son los dos ficheros de test | **incompleta** | R4 añade un párrafo a `docs/conventions.md`. Esta spec lo añade a `files_affected` |
| Suite de base 83 suites / 1532 tests / 1 snapshot (cifra del `leader` sobre `e9413a6e`) | **cierta** | medida en `42db1ccf` sin pipe: 83 / 1532 / 1, `exit=0`. Los dos ficheros suman 79 tests: `consistency` 53 y `legibility` 26 |
| Blobs de base | **medidos** | `consistency-classnames.test.ts` `5df906f8`, `legibility-classnames.test.ts` `890432e7`, `src/screens/reminders/index.tsx` `8fbcd07c` y `docs/conventions.md` `bb2ca08e`. Iguales en `HEAD` y en `origin/main` |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0`; sin hooks de git (ni `husky` ni `core.hooksPath`); no hay prettier en `mobile-pet-tracker/` |

## Requisitos funcionales

- **R1**: WHEN se ejecuta
  `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`, THE SYSTEM
  SHALL leer la receta de cada uno de los nueve elementos de las filas
  `login-submit` a `pill-inactive` de §Contexto mínimo **solo en su tag de
  apertura**. Para ello:

  1. Un helper nuevo, `openingTagWithTestId(source: string, testId: string): string`,
     SHALL localizar el ancla `testID="<testId>"`. Dentro del propio helper
     SHALL aseverar que existe (`toBeGreaterThan(-1)`) y que es **única**
     (`expect(source.lastIndexOf(…)).toBe(anchor)`).
  2. SHALL devolver el recorte de `<` a `<` de la convención, **cortado en el
     primer `/>`** que contenga (`.split('/>')[0]`). El literal va en [[tasks]]
     §R1.
  3. `elementWithTestId` SHALL desaparecer del fichero:
     `grep -c "elementWithTestId" src/__tests__/consistency-classnames.test.ts`
     da 0.
  4. Los cuatro call-sites SHALL llamar a `openingTagWithTestId`, y sus
     títulos SHALL acabar en `en su tag de apertura (#120 R1)`. Sus
     aserciones SHALL quedar **idénticas byte a byte**: mismos matchers y
     mismos literales esperados, todos literales del test y ninguno importado
     de producción.

  Con la sonda `P-active-h` versionada (quitar `rounded-xl` del `className`
  propio de `pill-active` y añadir `<View className="rounded-xl" />` como primer
  hijo), el `it`
  `#62 R4: … › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)`
  SHALL fallar por `expect(received).toContain`. SHALL ser el **único** test
  rojo de la suite móvil.

- **R2**: WHEN se ejecuta
  `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts`, THE SYSTEM
  SHALL partir el candado de `reminders-delete-confirm` por aserción:

  1. `variant="danger"` y `bg-danger` SHALL leerse en el **tag de apertura** del
     Button, con una copia del mismo `openingTagWithTestId` de R1 declarada en
     este fichero. La lectura SHALL ir dentro del `it` que hoy se titula
     `conserva variant, testID y texto del botón`, que pasa a titularse
     `conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)`.
  2. La etiqueta (`<Button.Label className="font-bold text-danger-foreground">`),
     el texto (`t('reminders.delete')`) y el veto de `text-accent-foreground`
     SHALL seguir leyéndose en el bloque que va del ancla al `</Button>`, con
     `elementWithTestId`. Ese helper se queda en el fichero, con un comentario
     `#120 R2` que dice por qué.
  3. Los otros dos `it` del `describe` `#61 R1` y los `describe` `#61 R3`,
     `#61 R4` y `#61 R5` SHALL quedar idénticos byte a byte.

  Con la sonda `D-v` versionada (quitar la línea `variant="danger"` del Button y
  añadir `{/* variant="danger" */}` después de `</Button.Label>`), el `it` de R2
  SHALL fallar por `expect(received).toContain`. SHALL ser el **único** test
  rojo de la suite móvil.

- **R3**: IF se planta en producción cualquiera de las sondas de la tabla
  «Exigido» de [[tasks]] §R3, THEN los dos ficheros de candado, con R1 y R2
  hechos, SHALL dar el veredicto de su columna «tras #120»: si pasan o
  fallan, qué `it` falla y con qué matcher. SHALL darlo con el blob de la
  mutación que dice la tabla. Cada sonda SHALL revertirse con
  `git checkout -- <ruta>`, y `git diff --exit-code -- mobile-pet-tracker/src`
  SHALL dar 0 al acabar. La tabla medida SHALL quedar en
  `progress/impl_mobile-classnames-element-slice-children.md`.

- **R4**: THE SYSTEM SHALL documentar en `docs/conventions.md` §Recortes del
  tag de apertura en candados de fuente el helper, el corte en `/>`, la
  excepción del bloque de subárbol de `legibility` y los límites que quedan.
  Lo hace con los tres cambios literales de [[tasks]] §R4:

  - una viñeta en la lista de candados;
  - la frase «Los tres…», reescrita para que siga siendo cierta con dos
    `lastIndexOf('<', anchor)` más en el árbol;
  - un párrafo nuevo.

  Todo SHALL quedar anclado por contenido grepeable, sin números de línea.

- **R5**: THE SYSTEM SHALL cerrar con:

  1. el diff de producción vacío:
     `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx`
     da 0, y `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista
     solo los dos ficheros de test;
  2. +0 suites y +0 tests: la suite móvil queda en 83 / 1532 / 1 sobre esta
     base, medida sin pipe;
  3. ninguna dependencia nueva: `package.json` y `bun.lock` sin tocar;
  4. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los dos ficheros con `exit=0`.

## Tabla «Exigido», resumen

Las 26 sondas, con sus blobs y el `it` exacto que falla, están en [[tasks]] §R3.
Por clase:

| Clase | Sondas | Hoy | Tras #120 |
|---|---|---|---|
| Hueco del hijo, el de la entrada | `B-login-h`, `B-forgot-h`, `B-register-h`, `B-reset-h`, `P-active-h`, `P-week-h`, `P-inactive-h`, `V-h`, `S-h`, `D-h` | verde en los candados | **rojo**, un `it` por `toContain` |
| Señuelo y ternario con el ancla repetida | `P-week-d`, `P-week-t` | verde | **rojo** por la unicidad (`toBe`) |
| Hijo comentado con una prop del tag | `D-v` | verde en toda la suite | **rojo** por `toContain` |
| Hueco tras un `/>` que el corte cierra | `V-f`, `S-j` | rojo | **rojo**. Sin el corte en `/>`, **verde falso** (medido) |
| Rojo falso que se cura | `B-login-p`, `P-week-p`, `S-p` | rojo | verde |
| Cambio declarado | `S-n` (rojo → verde) y `B-login-n` (3 rojos → 2) | | ver [[design]] §Cambios de veredicto declarados |
| Falla hacia rojo, a propósito | `P-week-a` (comentario con el ancla), `P-week-l1` (`<` en el tag) | verde | rojo |
| Límite documentado, sin defensa | `P-week-j`, `P-week-f`, `P-week-l3`, `D-d` | verde | verde |

## Qué firma el humano al aprobar esta spec

1. **La clasificación**: 5 call-sites en el fuente y 10 llamadas en ejecución.
   CS1 a CS4 vigilan el tag propio. CS5 es mixto: 3 aserciones de subárbol y 2
   de tag ([[design]] §Clasificación).
2. **El corte en `/>`**, que no es la receta pura de la convención. Sin él, el
   hueco que queda tras un elemento que se cierra solo da un verde falso que
   hoy es rojo (`S-j`, `V-f`, medidos). Se descartan **(i)**, la receta sola,
   y **(ii)**, dejar los skeletons con el bloque de hoy.
3. **La unicidad dentro del helper**, y no repetida en cada `it`.
4. **CS5 partido por aserción**, y no migrado entero ni dejado entero.
   `elementWithTestId` sigue en `legibility` con su motivo escrito.
5. **Los cambios de veredicto declarados**: los rojos falsos que se curan
   (`B-login-p`, `P-week-p`, `S-p`), `S-n` de rojo a verde, `B-login-n` con un
   test rojo menos, y `P-week-a` y `P-week-l1` que fallan hacia rojo
   ([[design]] §Cambios de veredicto declarados).
6. **El residuo se acepta como límite documentado**: `P-week-j`, `P-week-f` y
   `P-week-l3` (límites 2 y 3 de la convención) y el señuelo `D-d` sobre el
   bloque de subárbol siguen en verde. Se registran como candidatos (§Fuera de
   alcance, (F)).
7. **Las mutaciones versionadas** son `P-active-h`, en el rojo de R1, y `D-v`,
   en el de R2. Cada una toca un solo fichero de producción,
   `src/screens/reminders/index.tsx`, y el verde la revierte con
   `git checkout HEAD~1 --`. **`D-h` no sirve de rojo**: hoy ya la paran nueve
   tests de `src/screens/reminders/index.test.tsx`, así que el commit rojo
   fallaría por más cosas que la aserción nueva.
8. **El delta es +0 suites y +0 tests**: 83 / 1532 / 1 antes y después, sobre
   esta base.
9. **Cambian cinco títulos en el fuente, que son ocho tests en ejecución**: los
   cuatro `it`/`it.each` de `consistency` (4 + 1 + 1 + 1 tests) y uno de
   `legibility`. Ninguna spec, doc ni test cita los viejos.
10. **El helper va duplicado** en los dos ficheros, como ya lo están
    `elementWithTestId`, `sourceFiles` y `readSource`. No hay módulo
    compartido.
11. **Sin prueba de humo en dev build de Android**, porque el diff de
    producción es vacío.
12. **R3, R4 y R5 no tienen test propio.** R3 son los veredictos de los tests
    de R1 y R2 ante cada sonda. R4 es documentación. R5 es una propiedad del
    diff. Los cierra el `reviewer` por inspección, y queda declarado aquí
    antes del handoff, como pide C4.
13. **Los comentarios y el texto de `docs/conventions.md`** son los literales
    de [[tasks]] §R1, §R2 y §R4.

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo candidato a registrarse como otra feature (sin id: lo asigna
el `leader` contra `origin/main`) y **(N)** premisa verificada y descartada.

- **(D)** No se tocan los candados de fichero entero sobre
  `src/screens/home/index.tsx`: el `text-accent-strong` ×2 de `#61 R4`, `#61 R5`
  y las listas de cuentas por fichero de `consistency-classnames`
  (`#62 R14`, `#62 R15`, `#98 R10`, `#64 R9`). La sesión Backend trabaja #77
  en `home/index.tsx` y puede moverlos. Ningún call-site de
  `elementWithTestId` lee ese fichero.
- **(D)** No se tocan los `describe` de los dos ficheros que no usan
  `elementWithTestId`, ni `sourceFiles`, `filesMatching` ni `readSource`.
- **(D)** No se añaden elementos a `primaryButtons` ni filas a la tabla de
  skeletons de `#62 R2`. La feature cambia cómo se recorta, no qué se vigila.
- **(D)** No se añade ninguna pata de árbol. Los dos ficheros siguen leyendo
  solo fuente.
- **(D)** No se crea un módulo compartido de helpers de candado.
- **(D)** No se añade ninguna clave de copy: no se tocan `src/i18n/catalog.ts`
  ni `src/providers/__tests__/language-provider.test.tsx`, ni su candado de
  longitud del catálogo.
- **(D)** No se instala ninguna dependencia ni se añade ningún import.
  `readFileSync`, `join` y `expect` ya están en los dos ficheros.
- **(F)** *Los límites 2 y 3 sobre los nueve elementos de R1.* Un comentario
  JSX o un `{false && '…'}` como primer hijo (`P-week-j`, `P-week-f`), o una
  receta comentada dentro del tag (`P-week-l3`), siguen en verde. El árbol los
  cerraría: una aserción sobre `props.className` de cada elemento, como la que
  `src/screens/reminders/index.test.tsx` ya hace para `bg-danger`
  (`grep -n "props.className" src/screens/reminders/index.test.tsx`).
  Necesita montar cuatro pantallas y un componente.
- **(F)** *El señuelo sobre el bloque de subárbol de CS5 (`D-d`).* Un
  `{false && (<Button.Label className="font-bold text-danger-foreground">…</Button.Label>)}`
  delante de una etiqueta real con otra tinta pasa en verde hoy y tras #120, y
  el árbol de `reminders/index.test.tsx` tampoco lo para. Lo cerraría una
  aserción en el árbol sobre la clase de la etiqueta del botón.
- **(N)** *«`D-h` (`bg-danger` movido a un hijo) es un agujero de toda la
  suite.»* **Falso**: hoy lo paran nueve tests de
  `src/screens/reminders/index.test.tsx`, porque su helper de borrado asevera
  `props.className` del botón con `toContain('bg-danger')`. El agujero es solo
  de `legibility`, y por eso el rojo versionado de R2 es `D-v`.
- **(N)** *«Esta feature desmiente la frase de la convención "No queda ningún
  recorte de `<Tag` a `</Tag>` por migrar".»* **Falso**: `elementWithTestId`
  empieza en el ancla, no en `<Tag`, y
  `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` sigue sin devolver
  nada antes y después.
- **(N)** *«#77 toca los ficheros de esta feature.»* **Falso**:
  `git diff --name-only origin/main...origin/feature/77-mobile-home-weight-without-collar`
  no incluye ni los dos tests, ni `src/screens/reminders/index.tsx`, ni
  `docs/conventions.md` ([[design]] §Coordinación).

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-27) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los trece
      puntos de §Qué firma el humano al aprobar esta spec.

> **Esta es la única casilla de la feature.** No hay gate humano en el
> teléfono: sin diff de producción no hay prueba de humo que firmar (punto 11).
> El cierre lo dan el veredicto del `reviewer` y esta casilla.
