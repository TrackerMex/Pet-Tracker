---
feature: "mobile-home-cell-icons-source-lock-unbounded"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Requisitos — [[mobile-home-cell-icons-source-lock-unbounded]] (#126)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para la decisión y la medición que la sostiene, [[tasks]] para
> el orden TDD, los literales y las sondas, y [[traceability]] para el cierre.
>
> Origen: el hallazgo **(F)** de #124
> (`specs/mobile-home-bell-icon-source-lock-unbounded/requirements.md` §Fuera de
> alcance, «`#69 R9: usa iconos de reicon y ningún emoji` tiene el mismo
> agujero, latente»). El molde es #124, mergeada y aprobada.
>
> Esta spec verifica además la entrada **#80 `mobile-test-double-icon-scope`**,
> que vive en el mismo fichero y el mismo doble de `reicon`, y propone cómo
> cerrarla (§#80, verificada junto a esta feature). Esa propuesta la decide el
> humano en el gate.
>
> **Esta feature no toca producción.** El trabajo vive en
> `mobile-pet-tracker/src/screens/home/index.test.tsx` y en
> `docs/conventions.md`.
>
> **Base medida: `d7cb0d60`**, que es `origin/main` (merge de #124) más
> `progress/current.md`. **Los números de línea no son anclas**: todo se
> localiza con los `grep` que se citan.

## Contexto mínimo para implementar sin más contexto

La tira de hoy de la Home vive en
`mobile-pet-tracker/src/screens/home/index.tsx`, dentro de
`<Card testID="summary-card" className="gap-4">`, y solo se renderiza cuando la
actividad resuelve con `kind: 'ok'`. Es un `<View className="flex-row">` con
**cuatro celdas**. Cada celda es un `View` **sin `testID`** con tres hijos, en
este orden: su icono de `reicon-react-native`, el `Text` del valor (que sí lleva
`testID`) y el `Text` de la etiqueta.

| Celda | `testID` del valor | Icono en producción | `testID` del doble |
|---|---|---|---|
| peso | `summary-weight` | `<Weight size={20} color={muted} />` | `icon-weight` |
| actividad | `summary-activity` | `<Walk size={20} color={muted} />` | `icon-walk` |
| descanso | `summary-sleep` | `<Moon size={20} color={muted} />` | `icon-moon` |
| distancia | `summary-distance` | `<Map size={20} color={muted} />` | `icon-map` |

`muted` y `accent` salen de la misma llamada,
`grep -n "const \[accent, success, warning, muted" src/screens/home/index.tsx`:
`useThemeColors(['accent-strong', 'success', 'warning', 'muted', …])`.

En `mobile-pet-tracker/src/screens/home/index.test.tsx`, el `it` que devuelve
`grep -n "#69 R9: usa iconos de reicon" src/screens/home/index.test.tsx` cuenta
los iconos de celda con esta aserción:

```ts
    expect(
      source.match(
        /<(?:Weight|Walk|Moon|Map) size=\{20\} color=\{muted\} \/>/g,
      ) ?? [],
    ).toHaveLength(4);
```

La cuenta mira **todo** `index.tsx`. Hoy vale porque las cuatro cadenas son las
cuatro celdas, pero cualquier otra copia le da el verde. La sonda **W2** lo
demuestra: el icono de peso en `color={accent}` y un
`{false && <Weight size={20} color={muted} />}` al lado dejan el fichero en
**144/144 en verde**. El árbol tampoco lo ve: el `it`
`asigna cada valor, icono y etiqueta a su celda y a ninguna otra` solo
comprueba `toBeVisible` del icono.

El remedio es el de #124. Sin espía, `useThemeColors` resuelve todos los tokens
al mismo color de respaldo. El fichero ya usa seis veces
`jest.spyOn(Uniwind, 'getCSSVariable').mockImplementation((token) => token)`.
Con él, `muted` sale como `'--color-muted'` y `accent-strong` como
`'--color-accent-strong'`.

Esta feature añade un **candado de árbol por celda**, con ese espía (R1). Para
cada celda asevera los hijos contados por posición y las props exactas del
icono, contra un literal del test y en dos estados. La cuenta de fuente **se
queda tal cual**, porque ve dos mutaciones que el árbol no ve ([[design]]
§Decisión).

## Premisas de la entrada, verificadas contra el árbol

| Premisa (`feature_list.json`, #126, y el encargo del `leader`) | Veredicto | Evidencia |
|---|---|---|
| El `it` `#69 R9` cuenta `/<(?:Weight\|Walk\|Moon\|Map) size=\{20\} color=\{muted\} \/>/g` sobre todo `index.tsx` con `toHaveLength(4)` | **cierta** | `grep -n "#69 R9: usa iconos de reicon"` da 1; la aserción es la citada arriba |
| W2 deja el fichero en 144/144 en verde | **cierta** | re-medida en `d7cb0d60`: 144/144, `exit=0`. Blob de W2 `58a3c32b`, el mismo que en #124, porque `index.tsx` no ha cambiado |
| El árbol no lo tapa: `asigna cada valor…` solo mira `toBeVisible` | **cierta** | y ningún otro test del fichero lee el color ni el tamaño de un icono de celda |
| Solo se sondeó Weight | **cierta, y ya no** | esta spec sondea las **cuatro** celdas con la misma batería ([[tasks]] §R2) |
| `index.tsx` tiene `<Moon size={20} color={accent} />` y `<Map size={20} color={accent} />` fuera de las celdas | **cierta** | `grep -c` da 1 cada una: el `Moon` de `collar-card` cuando no hay collar y el `Map` de `last-position-card`. La regex no los cuenta, porque van en `accent` |
| Cada celda tiene tres hijos, con el icono el primero, y el doble del icono lleva solo `testID`, `size` y `color` | **cierta** | medido en el árbol con el espía: tres hijos no-cadena por celda, y `toEqual({ testID, size: 20, color: '--color-muted' })` pasa en las cuatro |
| Blobs de base: `index.tsx` `dbb5b034`, `index.test.tsx` `abbdb5b8`, `docs/conventions.md` `cb3c5253` | **ciertas** | `git hash-object` en `d7cb0d60`, iguales en `HEAD` y en `origin/main` |
| Suite de base 83 suites / 1510 tests | **cierta** | medida en `d7cb0d60` sin pipe: 83 / 1510 / 1 snapshot, `exit=0`; `tsc` 0 y `lint` 0 |

## Requisitos funcionales

- **R1**: WHEN la Home se renderiza con los mocks de
  `describe('#69 R1: la tira de hoy tiene cuatro celdas con tres divisores')` y
  `Uniwind.getCSSVariable` espiado para que devuelva su argumento, THE SYSTEM
  SHALL pintar cada una de las cuatro celdas de la tira así. La celda es el
  `parent` del `Text` de su valor, `screen.getByTestId('<valor>').parent`:

  1. la celda tiene exactamente **tres** hijos que no son cadena, aseverado
     con `expect(children).toHaveLength(3)` sobre
     `.children.filter((child) => typeof child !== 'string')`;
  2. el **primero** de ellos es el icono de la celda, con props exactamente
     `{ testID: '<icono>', size: 20, color: '--color-muted' }`, aseverado con
     `expect(children[0].props).toEqual(...)`. Los pares celda→icono son los
     de la tabla de §Contexto mínimo.

  Lo SHALL comprobar en **dos** estados:

  | `it` | Estado | Cómo se monta |
  |---|---|---|
  | `'con las métricas de hoy'` | peso 12.4 kg y un día con 95 min de actividad, 45 min de descanso y 2350 m | el `beforeEach` de `#69 R1`; se espera `summary-weight` con `'12.4 kg'` antes de aseverar |
  | `'sin métricas ni peso'` | `currentWeightKg: null` y un día con `distanceM`, `activeMinutes` y `restMinutes` a `null` | los mocks se sobrescriben dentro del `it`; se espera `collar-card` (que necesita el detalle de la mascota) y `summary-weight`, y se asevera `'—'` en `summary-weight` y `summary-activity` antes de los iconos |

  Los dos `it` SHALL vivir en un `describe` anidado nuevo,
  `'#126 R1: cada celda de la tira pinta su propio icono en muted'`, colocado
  dentro de `#69 R1` **justo después** del `it` `#69 R9` y **justo antes** del
  `it` `#69 R12`. El espía SHALL ir en su `beforeEach` y restaurarse en su
  `afterEach` con `jest.restoreAllMocks()`. El valor esperado SHALL ser el
  literal `'--color-muted'`, y los `testID` y el tamaño SHALL ser también
  literales del test, nunca valores calculados con `useThemeColors` ni con otro
  símbolo de producción.

  El resto del fichero SHALL quedar **idéntico byte a byte**. En particular, el
  `it` `#69 R9` conserva su título y sus tres aserciones (el import de `reicon`,
  la cuenta de cuatro y los cuatro emojis ausentes), en su orden. La única
  excepción es el comentario de R3.

- **R2**: WHEN se aplique a `src/screens/home/index.tsx` cada una de las 79
  sondas de [[tasks]] §R2 sobre el verde de R1, THE SYSTEM SHALL dar el
  veredicto de su tabla «Exigido», con sus cifras de pasados y fallidos y sus
  matchers. En particular, en las cuatro celdas:

  1. los señuelos `*2`, `*2o`, `*2f`, `*2j`, `*2c` y `*3`, hoy en verde,
     SHALL caer por los dos `it` de R1, y solo por ellos, con `toEqual`;
  2. `*4` SHALL caer solo por `'con las métricas de hoy'`, y `*4r` solo por
     `'sin métricas ni peso'`;
  3. `*7d`, `*8` y `*9`, hoy en verde, SHALL caer por los dos `it` de R1
     (punto 4 de la firma);
  4. `*5`, `*6`, `*F1` y `*F3` SHALL seguir cayendo solo por la cuenta de
     `#69 R9`, y `*5d` y `*6d` SHALL seguir en verde (residuo, punto 3 de la
     firma);
  5. ninguna sonda que hoy cae SHALL pasar a verde: `*1`, `*7`, X1, X2 y T1
     siguen en rojo y caen además los dos `it` de R1 (punto 7 de la firma).

  IF una sonda da otro veredicto, THEN el implementador SHALL parar y
  reportarlo con el log. Las sondas son temporales: no se commitean, y al
  acabar `git diff --exit-code -- src/screens/home/index.tsx` SHALL salir
  con 0.

- **R3**: WHEN un lector abra la cuenta de fuente de `#69 R9` o
  `docs/conventions.md` §«Recortes del tag de apertura en candados de fuente»,
  THE SYSTEM SHALL explicarle, **anclado por contenido**, por qué los iconos de
  celda se aseveran en el árbol:
  1. el comentario literal de [[tasks]] §R3 (1), de cuatro líneas, justo
     debajo de `expect(reiconImport).toMatch(/\bWeight\b/);` y justo encima de
     la cuenta, sin tocar ninguna de las dos;
  2. el párrafo literal de [[tasks]] §R3 (2), insertado en esa sección de
     `docs/conventions.md` justo después del párrafo de la campana (#124), el
     que termina en
     `` `grep -n "se pinta con la tinta muted" mobile-pet-tracker/src/screens/home/index.test.tsx`. ``,
     y antes del encabezado `### Esperas sobre el árbol renderizado`. No se
     toca nada más de la sección.

- **R4**: WHEN la feature llegue al PR, THE SYSTEM SHALL dejar el diff de
  producción **vacío**:
  `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
  SHALL salir con 0. Mientras la base siga siendo `d7cb0d60`, el blob en
  `HEAD` SHALL ser `dbb5b0346895cfc26705bee2257d1f8a8815df6c`, y el del commit
  rojo `58a3c32b0765f7406e6462550b6fa691eaf6d031` (W2). IF algún requisito
  pareciera necesitar tocar producción de forma permanente, THEN el
  implementador SHALL parar y devolver el trabajo.

  Esto **no** contradice R1: su par versiona la mutación W2 en el commit rojo y
  la revierte en el verde (C4, quinto punto). El diff **acumulado** es vacío.

## #80, verificada junto a esta feature

**Propuesta: (a), resuelta. Cerrarla como `done` por verificación, sin
cambio de código.** La decide el humano (punto 12 de la firma).

La entrada #80 nació de la observación 9 del `reviewer` de #69
(`progress/review_mobile-home-stats-strip.md`). Se registró en `8a1a0e6a`
(2026-09-08 19:17:58). Decía que el doble de `reicon` nombraba los iconos por
su **uso**, con nombres como `summary-icon-sleep` y `summary-icon-distance`,
aunque `Moon` y `Map` también se pintan fuera de la tira.

| Hecho | Evidencia |
|---|---|
| Dos horas después, `a1796c91` (2026-09-08 21:23:05, `test(mobile-home-quick-actions): name reicon doubles by icon (R7)`) renombró el doble **por componente**: `Weight` → `icon-weight`, `Walk` → `icon-walk`, `Moon` → `icon-moon`, `Map` → `icon-map`. También actualizó las cuatro referencias del `it` `asigna…` | `git show a1796c91`. Lo prescribía #71 R7 (`specs/mobile-home-quick-actions/requirements.md`, «Un ajuste obligatorio en el doble de `reicon` de la Home»), que además **exige** `within(tile)` y **prohíbe** el `getByTestId` global para el icono, porque `Weight` se repite a propósito |
| Ningún `summary-icon-*` queda en el código | `git log -S "summary-icon-sleep" origin/main -- mobile-pet-tracker/src` da solo `18454a44` (lo añadió) y `a1796c91` (lo quitó); sin la ruta salen también `8a1a0e6a` y `4738568b`, que son docs y progress. `git grep "summary-icon" origin/main -- mobile-pet-tracker/src` no devuelve nada |
| Los nombres de hoy dicen el componente, no la celda | el mock, `grep -n "mockIcon('icon-" src/screens/home/index.test.tsx` |
| Ningún test busca un icono de celda con `getByTestId` global | los usos de `icon-weight`, `icon-walk`, `icon-moon` e `icon-map` son las cuatro filas de `asigna…` (acotadas con `within(value.parent!)`) y las dos del tile de peso de #71 (acotadas con `within(tile)`). R1 de esta feature tampoco: los compara como props del primer hijo de la celda |

Contra sus tres criterios:

1. *«Ningún `testID` de icono se resuelve a más de un nodo en la Home, **o** el
   nombre dice explícitamente que es del componente y no de la celda»*: se
   cumple por la **segunda** rama. `icon-moon` sigue dando dos nodos en la Home
   (la celda y `collar-card` sin collar), pero el nombre ya no promete una
   celda.
2. *«El `it` de R3 sigue verde sin necesitar `within()` para desambiguar»*:
   pertenece a la **primera** rama, la de los nombres únicos. Con nombres por
   componente, `within(celda)` no es un rodeo sino el ámbito, y #71 R7 lo hizo
   obligatorio. R1 de esta feature ancla igual, por la celda.
3. *«Suite móvil completa verde; ninguna cifra de candado se mueve»*: se
   cumple sin tocar nada.

**Alternativa para el humano: (c), viva y aparte.** Si lee el criterio 2 como
independiente del 1, #80 sigue `pending` con la premisa corregida: los nombres
ya son por componente desde `a1796c91`, y lo que queda es que `icon-moon` e
`icon-weight` dan dos nodos cada uno. Cumplirlo exigiría exponer el `testID`
desde el punto de uso, que es un cambio de producción. Por eso **(b)**,
absorberla aquí con su propio R-id, no cabe en una feature de diff de
producción vacío.

## Qué firma el humano al aprobar esta spec

1. **La opción (b)**: los iconos de celda se aseveran en el **árbol**, celda a
   celda (R1), y la cuenta de fuente de `#69 R9` **se queda byte a byte**. Se
   descartan **(a)**, acotar la cuenta de fuente a cada celda, porque sigue
   leyendo texto, y **(c)**, aceptar el agujero por escrito, porque (b) lo
   cierra ([[design]] §Decisión).
2. **Dos estados y no uno.** Con solo `'con las métricas de hoy'`, un icono que
   cambia de tinta cuando falta el dato de su celda (las sondas `*4r`) seguiría
   en verde. El segundo estado es el de «sin métricas ni peso», que es real, y
   no uno sin días: el backend siempre devuelve la entrada de hoy
   (§Fuera de alcance, (N)).
3. **El residuo se acepta como límite documentado**: `W5d`, `A5d`, `S5d`,
   `D5d`, `W6d`, `A6d`, `S6d` y `D6d` siguen en verde. Cada una necesita una
   copia señuelo del icono **y además** una rama por plataforma o el nombre de
   la variable CSS escrito a mano. Es el mismo residuo que #124 aceptó para la
   campana (B5d y B6d).
4. **R1 cierra más que la tinta, y lo declara.** `toEqual` sobre las props del
   icono y `toHaveLength(3)` sobre los hijos convierten en rojo, a propósito:
   cambiar el tamaño (`*7`, `*7d`), añadir cualquier prop con valor al icono,
   meter un segundo icono en la celda (`*9`) y mover el icono detrás de la
   etiqueta (`*8`). Son decisiones de la celda (`docs/ui-guidelines.md`
   §Enmienda #70: tamaño de icono, cardinalidad y orden de los hijos), no rojos
   falsos.
5. **La mutación versionada es W2.** El commit rojo toca un solo fichero de
   producción, `src/screens/home/index.tsx`, y el verde lo revierte con
   `git checkout HEAD~1 --`.
6. **El delta de tests es +0 suites y +2 tests.** `index.test.tsx` pasa de 144
   a 146 y la suite móvil, de 83 / 1510 a 83 / 1512, sobre esta base.
7. **Los cambios declarados de `*1`, `*7`, X1, X2 y T1 se aceptan**: ya eran
   rojos y siguen rojos, con los dos `it` de R1 en rojo además.
8. **El comentario del test y el párrafo de `docs/conventions.md` son los
   literales de [[tasks]] §R3.**
9. **La feature no lleva prueba de humo en dev build de Android**, porque el
   diff de producción es vacío.
10. **R3 y R4 no tienen test propio**: R3 es documentación y R4 es una
    propiedad del diff. Los cierra el `reviewer` por inspección. Queda
    declarado aquí antes del handoff, como pide C4.
11. **Sin helper.** El bucle de aserción se repite en los dos `it`; el espía se
    escribe igual que las seis veces que el fichero ya lo usa.
12. **#80 se cierra como `done` por verificación**, propuesta (a) de
    §#80. Si el humano prefiere (c), #80 sigue `pending` con la premisa
    corregida. En ninguno de los dos casos esta feature toca #80 en
    `feature_list.json`: lo registra el `leader` con la firma.

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo que se registra para otra feature y **(N)** premisa
verificada y descartada.

- **(D)** No se tocan el título ni las aserciones del `it` `#69 R9`: el import
  de `reicon`, la cuenta de cuatro y los emojis. Solo gana el comentario de R3.
- **(D)** No se toca `asigna cada valor, icono y etiqueta a su celda y a
  ninguna otra`. Su `toBeVisible` sigue valiendo para lo que mira, que el icono
  esté dentro de su celda. Las props del icono las mira ahora R1.
- **(D)** No se tocan los demás `it` de `#69 R1`, ni su `beforeEach`, ni el
  `beforeEach` de nivel superior del fichero.
- **(D)** Solo se cierran las decisiones del **icono** de cada celda:
  componente, tinta, tamaño, sitio, cardinalidad y orden. Las demás
  decisiones de la celda de `docs/ui-guidelines.md` §Enmienda #70 (el dato,
  la etiqueta, el divisor, la receta tipográfica de cada texto, el `flex-1`,
  el nombre accesible) no se tocan ni se miden aquí.
- **(D)** No se tocan el `Moon` de `collar-card` ni el `Map` y el
  `ChevronRight` de `last-position-card`. Son otros elementos, fuera de la
  tira, y esta feature no mide sus candados.
- **(D)** No entran la campana (#121, #122 y #124) ni su `it` `#124 R1`.
- **(D)** No se añade ninguna clave de copy: no se tocan
  `src/i18n/catalog.ts` ni `src/providers/__tests__/language-provider.test.tsx`,
  ni su candado de longitud del catálogo.
- **(D)** No se instala ninguna dependencia ni se añade ningún import:
  `Uniwind`, `screen`, `waitFor`, `renderHome`, `makePet` y `makeDay` ya
  existen en el fichero, y `jest` es global.
- **(D)** El residuo `*5d` y `*6d` queda documentado y sin defensa (punto 3 de
  la firma).
- **(N)** *«Hace falta un estado sin días para cubrir un ternario sobre
  `today`.»* **Falso**: la tira solo se pinta con la actividad en `kind: 'ok'`,
  y el caso de uso del backend
  (`backend-pet-tracker/src/modules/activity/application/use-cases/get-daily-activity.use-case.ts`)
  empuja una entrada por cada día del rango, con `computeToday` para hoy y
  `missingEntry` para los días pasados sin fila. `today` siempre existe dentro
  de la tira. Un ternario sobre `today` a secas nunca cambia de rama en
  producción, y el que sí puede cambiar, sobre la **métrica** de la celda,
  lo cubre el segundo estado.
- **(N)** *«El doble nombra los iconos por su uso (`summary-icon-sleep`,
  `summary-icon-distance`).»* **Falso desde `a1796c91`** (§#80).
- **(N)** *«La sesión Backend (#99) toca estos ficheros.»* **Falso**: su rama
  (`feature/99-mobile-notifications-permission-recovery`, en `d6130d7b`) no
  incluye en `git diff --name-only origin/main...d6130d7b` ni
  `src/screens/home/*` ni `docs/conventions.md`. Solo comparte los ficheros del
  harness ([[design]] §Coordinación).

## Aprobación

- [ ] **Aprobado por humano** (fecha: ...) ← gate obligatorio antes de
      implementar. Al marcar esta casilla el humano firma también los doce
      puntos de §Qué firma el humano al aprobar esta spec, incluida la decisión
      sobre #80 del punto 12.

> **Esta es la única casilla de la feature.** No hay gate humano en teléfono:
> sin diff de producción no hay prueba de humo que firmar (punto 9). El cierre
> lo dan el veredicto del `reviewer` y esta casilla.
