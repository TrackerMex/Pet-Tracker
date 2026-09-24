---
feature: "mobile-home-bell-source-lock-unbounded"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Requisitos — [[mobile-home-bell-source-lock-unbounded]] (#121)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y la medición que las sostiene, [[tasks]]
> para el orden TDD y las sondas, y [[traceability]] para el cierre.
>
> Origen: hallazgo (F) de #112
> (`specs/mobile-reminders-see-all-source-lock-nesting/design.md` §Barrido de
> gemelos). El molde es #112, mergeada y aprobada por el `reviewer`.
>
> **Esta feature no toca producción.** El trabajo vive en
> `mobile-pet-tracker/src/screens/home/index.test.tsx` y en
> `docs/conventions.md`.
>
> **Base medida: `f44cf3d5`** (`origin/main`, merge de #112). Todo se midió
> en `e5b73395`, que solo añade `progress/current.md` encima, así que el
> código de la app es el mismo. **Los números de línea no son anclas**: todo se
> localiza con los `grep` que se citan. #84 (sesión Backend) va a mergear
> encima y moverá líneas.

## Contexto mínimo para implementar sin más contexto

El candado es el `it` que devuelve
`grep -n "usa la ruta real sin cast Href" mobile-pet-tracker/src/screens/home/index.test.tsx`
(una sola coincidencia). Vive dentro de
`describe('#78 R10: la campana vive en el hero y lleva al centro de alertas')`
y **no renderiza nada**: sus cuatro aserciones leen el sistema de ficheros o el
fuente. Hoy es así:

```ts
it('usa la ruta real sin cast Href y conserva el feedback de pulsado', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/screens/home/index.tsx'),
    'utf8',
  );

  expect(appRoutes(join(process.cwd(), 'src/app'))).toContain('/alerts');
  expect(source).not.toContain("'/alerts' as Href");
  expect(source).toMatch(
    /style=\{\(\{ pressed \}\) => \(\{ opacity: pressed \? 0\.8 : 1 \}\)\}/,
  );
  expect(source).toContain('<Bell size={24} color={muted} />');
});
```

La tercera aserción es la de la receta de pulsado, y la asevera contra **todo
el fichero**. El elemento que debería vigilar es el `<Pressable>` de la
campana, en
`mobile-pet-tracker/src/screens/home/index.tsx`
(`grep -n 'testID="home-alerts-bell"'`, una sola coincidencia). La receta
`style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}` aparece **dos
veces** en ese fichero (`grep -c "opacity: pressed ? 0.8 : 1"` da 2): en la
campana y en `reminders-see-all`. Por eso el candado no vigila la campana: le
basta con cualquiera de las dos copias.

Precondiciones del patrón, medidas en ese tag:

- el ancla `testID="home-alerts-bell"` es la **primera prop** del tag de
  apertura;
- entre `<Pressable` y el `>` que cierra el tag **no hay ningún `<`**;
- entre ese `>` y el primer hijo, `<Bell`, **solo hay espacio en blanco**.

Por tanto no aplica ninguno de los dos límites de `docs/conventions.md`
§«Recortes del tag de apertura en candados de fuente». El recorte de `<` a `<`
sobre la base mide 489 caracteres, contiene un único `<` (el del propio tag) y
termina justo antes de `<Bell`.

## Requisitos funcionales

- **R1**: WHEN el candado de la receta de pulsado de la campana lee
  `src/screens/home/index.tsx`, THE SYSTEM SHALL aseverar la regex **solo
  contra el tag de apertura propio** de `home-alerts-bell`, desde el `<` que lo
  abre hasta el `<` del primer hijo. El recorte SHALL ser exactamente este:

  ```ts
  const anchor = source.indexOf('testID="home-alerts-bell"');
  const block = source.slice(
    source.lastIndexOf('<', anchor),
    source.indexOf('<', anchor),
  );
  ```

  y la aserción de la receta SHALL pasar de `expect(source).toMatch(` a
  `expect(block).toMatch(`, con la **misma regex**. La aserción sigue en el
  mismo `it`, que SHALL titularse
  `'#121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura'`
  y seguir dentro del mismo `describe`. Las otras tres aserciones (la ruta
  `/alerts` en `appRoutes`, `not.toContain("'/alerts' as Href")` y
  `toContain('<Bell size={24} color={muted} />')`) SHALL quedar **idénticas
  byte a byte**, seguir aseverando contra `source` y mantener su orden: ruta,
  cast, receta, icono.

- **R2**: WHEN `src/screens/home/index.tsx` se muta a cualquiera de los
  agujeros medidos, THEN el `it` de R1 SHALL fallar **por su aserción
  `toMatch`**, no por otra aserción del `it`, ni por un `ReferenceError`, ni
  por otro test del fichero. «Otros» cuenta los tests del fichero que caen
  además del candado, y **no cambia** con esta feature:

  | | Mutación ([[tasks]] tiene el texto exacto) | Hoy | Otros | Exigido |
  |---|---|---|---|---|
  | **N1** | la línea de estilo de la campana pasa a `style={{ opacity: 1 }}` | **VERDE**: el fichero 140/140 y **la suite móvil entera 82/1452** | 0 | **ROJO** por `toMatch` |
  | **S1p** | la línea de estilo de la campana, borrada | VERDE | 0 | ROJO por `toMatch` |
  | **V7** | `0.8` → `0.5` en la línea de estilo de la campana | VERDE | 0 | ROJO por `toMatch` |
  | **N1n** | N1 + un `<Pressable>` **anidado** con la receta envuelve al `<Bell>` | VERDE | 0 | ROJO por `toMatch` |
  | **W1** | N1 + el tag se **autocierra**; un `<Pressable>` **hermano posterior** con la receta se queda los hijos | VERDE | 3 | ROJO por `toMatch` |
  | **S2** | N1 + un `<Pressable …receta… />` hermano **anterior** | VERDE | 2 | ROJO por `toMatch` |
  | **S3** | N1 + ese mismo `<Pressable …receta… />` como hermano **posterior** | VERDE | 2 | ROJO por `toMatch` |

  **N1 es la mutación que se versiona** en el commit rojo (C4, vía **b**). Es
  literalmente la del criterio de aceptación de la feature. Las otras seis se
  sondean sobre el árbol verde y se revierten.

- **R3**: WHEN `src/screens/home/index.tsx` se muta a cualquiera de las sondas
  siguientes, THE SYSTEM SHALL dar el veredicto de la columna «Exigido» en el
  `it` de R1. Ese veredicto es **idéntico al de hoy** salvo en las tres filas
  marcadas como **cambio declarado**:

  | | Mutación | Hoy | Otros | Exigido |
  |---|---|---|---|---|
  | **N2** | un `<Pressable>` anidado **sin** receta envuelve al `<Bell>`; la línea de estilo, intacta | VERDE | 0 | VERDE |
  | **E2** | `hitSlop={0 < 1 ? 8 : 0}` como primera prop, **antes** del ancla | VERDE | 0 | VERDE |
  | **E3** | la línea de estilo movida a primera prop, **antes** del ancla | VERDE | 0 | VERDE |
  | **L2** | N1 + la receta como **cadena hija** antes del `<Bell` | VERDE (el render se rompe) | 119 | VERDE (el render se rompe): límite 2 |
  | **P1** | N1 + la receta en un **comentario JSX** antes del `<Bell` | VERDE | 0 | VERDE: punto ciego conocido, es de #122 |
  | **P2** | la línea de estilo comentada con `//` dentro del tag, más `style={{ opacity: 1 }}` | VERDE | 0 | VERDE: punto ciego conocido, es de #122 |
  | **P4** | N1 + un señuelo `{false && <Pressable testID="home-alerts-bell" …receta… />}` **antes** de la campana | VERDE | 0 | VERDE: punto ciego conocido, es de #122 |
  | **E1** | `hitSlop={0 < 1 ? 8 : 0}` **entre** el ancla y la receta | VERDE | 0 | **ROJO** por `toMatch`: **cambio declarado** (límite 1) |
  | **V6** | la receta de la campana partida en tres líneas | VERDE | 0 | **ROJO** por `toMatch`: **cambio declarado** (rigidez de la regex) |
  | **A0** | el ancla renombrada a `testID="home-bell"` | VERDE | 9 | **ROJO** por `toMatch`: **cambio declarado** (sin ancla, bloque vacío) |

  Los tres cambios declarados van **hacia rojo**. Ninguno se da en la base:

  - **E1** es el límite 1 del patrón, ya documentado en `docs/conventions.md`.
  - **V6**: la regex no tolera espacios. #112 ya lo aceptó y dejó la regex
    fuera de alcance. Hasta ahora la campana se libraba solo porque le
    prestaba el verde la copia de `reminders-see-all`.
  - **A0**: sin ancla, el recorte da la cadena vacía y el candado cae en rojo.
    El fallo no puede ser silencioso, porque caen otros 9 tests.

  **P1, P2 y P4 son verdes falsos que esta feature ni abre ni cierra.** Ya
  estaban en verde con la aserción contra el fichero entero, y son los tres
  puntos ciegos del recorte de `<` a `<` que tiene registrados #122. Tras esta
  feature la campana pasa a ser **un call-site más** de ese recorte y hereda
  esos mismos puntos ciegos. Lo mismo vale para L2, que es el límite 2: no pasa
  en silencio porque rompe el render.

- **R4**: WHEN un lector abra el candado de R1 o `docs/conventions.md`
  §«Recortes del tag de apertura en candados de fuente», THE SYSTEM SHALL
  ofrecerle el estado real del patrón **anclado por contenido**:
  1. un comentario en el call-site, justo encima del `const block`, con el
     texto literal que fija [[tasks]] §R4, y
  2. en esa sección de `docs/conventions.md`, el bloque que empieza por
     «El patrón vive en tres candados.» y termina en «no devuelve nada.»,
     **sustituido** por el texto literal que fija [[tasks]] §R4. Ese texto
     SHALL añadir la campana a la lista, dejar de contar los candados y no
     citar números de línea.

  Tras R4:
  - `grep -c "lastIndexOf('<', anchor)" mobile-pet-tracker/src/screens/home/index.test.tsx`
    SHALL dar `2`;
  - `grep -n "expect(source).toMatch(" mobile-pet-tracker/src/screens/home/index.test.tsx`
    SHALL no devolver nada (exit 1);
  - `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` SHALL seguir sin
    devolver nada (exit 1).

- **R5**: WHEN la feature llegue al PR, THE SYSTEM SHALL dejar el diff de
  producción **vacío**:
  `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
  SHALL salir con 0. Mientras la base siga siendo `f44cf3d5`, el blob de
  `HEAD:mobile-pet-tracker/src/screens/home/index.tsx` SHALL ser
  `dbb5b0346895cfc26705bee2257d1f8a8815df6c`, y el del commit rojo SHALL ser
  `675ae7a1c18b400c234a9dbef2950c1175aaf026` (la base con N1). IF algún
  requisito pareciera necesitar tocar `index.tsx` de forma permanente, THEN el
  implementador SHALL parar y devolver el trabajo.

  Esto **no** contradice R2: N1 se versiona en el commit rojo y se revierte en
  el verde (C4, quinto punto). El diff **acumulado** es vacío aunque un commit
  intermedio toque el fichero.

## Qué firma el humano al aprobar esta spec

1. Que el acotado es la ventana de `<` a `<` que `docs/conventions.md` ya fija.
   Esta feature no decide ningún patrón nuevo.
2. Que la aserción de la receta **se queda en el `it` que comparte** con la
   ruta y el icono, y que ese `it` se **renombra** con prefijo `#121 R1`
   (C4 pide que el test nombre su R-id) **conservando entero** su título viejo
   como subcadena. Así siguen resolviendo por `grep` y por `-t` las menciones
   del título viejo en `specs/mobile-reminders-alerts-to-stack/design.md` y en
   los specs de #112, y ninguna se enmienda. La trazabilidad de #78
   (`specs/mobile-alerts-center/traceability.md`, fila R10) cita el
   `describe`, que no cambia. Motivo en [[design]] §La aserción se queda en su
   `it`.
3. Que la mutación versionada es **N1**, la más simple (`style={{ opacity: 1 }}`
   en la campana), y no la anidada de #112. Aquí no hay pata de árbol que la
   tape, y N1 ya deja **la suite móvil entera en verde** (82/1452).
4. Que **E1, V6 y A0 pasan de verde a rojo** y se aceptan. Las tres fallan por
   el lado seguro y ninguna se da en la base.
5. Que **P1, P2 y P4 siguen en verde**. Son puntos ciegos conocidos del patrón
   y los tiene #122. Esta feature no los defiende.
6. Que el bloque de `docs/conventions.md` que R4 sustituye es el literal de
   [[tasks]] §R4, **incluida la frase nueva**: aseverar una receta contra el
   fichero entero no vigila el elemento si otro la repite.
7. Que la feature **no lleva prueba de humo en dev build de Android**. El diff
   de producción es vacío y en el dispositivo no hay nada que observar.
8. Que **R4 y R5 no tienen test propio**: R4 es un entregable de
   documentación y R5 es una propiedad del diff. Los cierra el `reviewer` por
   inspección, y queda declarado aquí antes del handoff, como pide C4.

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo que se registra para otra feature y **(N)** premisa
verificada y descartada.

- **(D)** No se tocan las otras tres aserciones del `it` (la ruta, el cast y el
  icono), ni su orden.
- **(D)** No se toca la regex de la receta. Es rígida (V6), pero cambiar lo que
  se busca no es acotar dónde se busca.
- **(D)** No se saca la aserción de la receta a un `it` propio
  ([[design]] §Alternativas).
- **(D)** No se defienden P1, P2 ni P4. Son de #122 (`mobile-source-lock-slice-blind-spots`).
- **(D)** No se toca `elementWithTestId`. Es de #120.
- **(D)** No se añade **ninguna clave de copy**: no se tocan ni
  `src/i18n/catalog.ts` ni `src/providers/__tests__/language-provider.test.tsx`,
  y su candado de longitud del catálogo tampoco.
- **(D)** No se instala **ninguna dependencia**: no se tocan `package.json` ni
  `bun.lock`.
- **(D)** No se enmiendan specs ajenas (punto 2 de la firma).
- **(F)** **El icono tiene la misma forma de candado, latente.**
  `expect(source).toContain('<Bell size={24} color={muted} />')` asevera contra
  el fichero entero. Hoy está vivo, porque esa cadena aparece **una vez**
  (`grep -c` da 1): con la campana en `color={accent}` el `it` cae en rojo por
  `toContain` (sonda B1). Pero una segunda copia en cualquier sitio de
  `index.tsx` le presta el verde. Medido: B1 más
  `{false && <Bell size={24} color={muted} />}` detrás de la campana deja el
  fichero en **140/140 verde** (sonda B2). El árbol tampoco lo tapa, porque
  `compone el selector y la campana…` solo comprueba que el color está
  definido (`toBeDefined`). El `leader` decide si lo registra con id contra
  `origin/main`. Aquí no se toca (límite de alcance heredado de #112).
- **(N)** *«`not.toContain("'/alerts' as Href")` tiene el mismo defecto.»*
  **Falso**: una aserción **negativa** contra el fichero entero es más estricta
  que contra el tag, no menos. Si no aparece en el fichero, no aparece en la
  campana.
- **(N)** *«La aserción de la ruta mira el fuente.»* **Falso**: `appRoutes`
  lee el árbol de `src/app`, no `index.tsx`.
- **(N)** *«Hay otro candado que asevera la receta de pulsado contra el fichero
  entero.»* **Falso**: `grep -rn "opacity: pressed" mobile-pet-tracker/src --include=*.test.*`
  da tres regex. La de la campana es esta; las otras dos (`meal-toggle` en
  `food.test.tsx` y `reminders-see-all`) ya recortan de `<` a `<`. Las demás
  aserciones positivas contra un fichero entero no son recetas de un elemento y
  **no se auditan aquí**.
- **(N)** *«#84 (sesión Backend) toca este fichero o `docs/`.»* **Falso**:
  `git diff --stat origin/main...origin/feature/84-reminder-dates-days-until-drift`
  no incluye `src/screens/home/*` ni `docs/`. Si mergea antes, mueve el
  recuento absoluto de la suite y los números de línea, pero no el delta de
  esta feature ni sus anclas.

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-24) ← gate obligatorio antes de
      implementar. Al marcar esta casilla el humano firma también los ocho
      puntos de §Qué firma el humano al aprobar esta spec.

> **Esta es la única casilla de la feature.** No hay gate humano en teléfono:
> sin diff de producción no hay prueba de humo que firmar (punto 7). El cierre
> lo dan el veredicto del `reviewer` y esta casilla.
