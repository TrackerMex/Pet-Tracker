---
feature: "mobile-profile-family-join-row"
status: spec_ready      # draft | spec_ready | approved
tags: [mobile, profile, ui, spec]
---

# Requisitos — [[mobile-profile-family-join-row]] (#229)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`). Sin backend, sin copy
> nuevo, sin dependencias nuevas, sin módulo nativo (no hace falta rebuild del
> dev build), sin enmienda de la carta (no hay gate G4) y sin artboard nuevo
> (no hay gate G1). Diseño en [[design]]; plan TDD en [[tasks]]; trazabilidad
> en [[traceability]]. Rutas relativas a `mobile-pet-tracker/` salvo que se
> diga otra cosa.

## Contexto

Palabras literales del humano en el smoke G2 del 2026-11-03 (recogidas en
`progress/plan_mejoras-smoke-2026-11-03.md` §1): hallazgo «Cards Familia y
Unirme con código», decisión **«Lado a lado»**. Su captura: las dos tarjetas
salen a media anchura, en filas separadas y **sin texto**, solo el icono y el
chevron.

Diagnóstico, medido en el árbol `26b86621` (`feature/229-…` sobre `dev`, con
#235 ya mergeado; `origin/dev` `5c7c9547` solo añade documentos):

1. `src/screens/profile/index.tsx` define `ProfileWideTile` con un `Pressable`
   `className={`flex-row items-center gap-2.5 rounded-tile p-3 ${CATEGORY_SLOTS[slot].surface}`}`:
   **sin `flex-1`**. `ProfileTile` (la tarjeta de las filas de arriba) sí lo
   lleva: `flex-1 gap-1.5 rounded-tile p-3 …`.
2. Con mascota, Familia (`members-link`) vive sola en `profile-links-row-2` y
   Unirme con código (`join-pet-link`) sola en `profile-links-row-3`; ambas filas
   son `<View className="flex-row gap-2">`. En un `flex-row`, un hijo sin
   `flex-1` mide lo que mide su contenido: icono + hueco + el bloque de texto
   (`flex-1 gap-0.5`, que dentro de un padre sin anchura definida crece desde 0)
   + chevron. El texto se queda en ancho 0: la tarjeta sale pequeña y sin texto.
3. Sin mascota, `join-pet-link` está solo en `profile-links-row-1` con el mismo
   defecto.
4. El artboard de #214 (`specs/mobile-pet-members/canvas/PerfilFamilia.dc.html`)
   dibuja Familia **a todo lo ancho**; la decisión «Lado a lado» del humano lo
   supera. No se edita el canvas (único escritor: el leader) ni hay G1: la
   disposición la fija el humano y el patrón de fila de dos columnas ya está
   aprobado (las filas de `ProfileTile`).

## Decisiones cerradas (Codex no las reabre)

- **D1. Se conserva la tarjeta horizontal.** Icono, bloque de texto y chevron
  siguen en `flex-row`; no se pasa a una tarjeta vertical. La decisión es
  «lado a lado», no «rediseñar la tarjeta». Riesgo conocido y aceptado: en
  móviles estrechos el texto de media tarjeta puede partirse en 3 o 4 líneas
  (unos 72 a 100 px de ancho de texto). No se añade `numberOfLines` ni se
  recorta copy: lo decide el smoke G2; si el humano lo rechaza, es otra feature
  (con artboard).
- **D2. El `flex-1` va en el componente.** Se antepone `flex-1 ` a la clase del
  `Pressable` de `ProfileWideTile`, no en cada llamada. Así lo reciben los dos
  consumidores y también la rama sin mascota (Unirme con código sola en su
  fila ocupa el ancho entero, como `remindersLink`).
- **D3. Orden: Familia primero, Unirme con código después** (izquierda a
  derecha, como lee la fila). Mismo orden que hoy de arriba abajo.
- **D4. Se reutiliza `profile-links-row-2` y se elimina
  `profile-links-row-3`.** `{joinPetLink}` pasa a ser el segundo hijo de la fila
  2, justo después del `ProfileWideTile` de Familia. Con mascota, `profile-links`
  pasa de 4 a 3 filas. El testID `profile-links-row-3` deja de existir.
- **D5. Los títulos de los tests enmendados conservan su raíz** (aunque diga
  «a ancho completo» o «la cuarta fila») y ganan el sufijo
  ` (enmendado por #229 R<n>)`. `specs/mobile-pet-members/traceability.md`
  referencia esos títulos; renombrarlos rompe la trazabilidad (precedente: el
  resto de los `(enmendado por #… )` del fichero).
- **D6. El mismo alto lo da Yoga, no un número.** Las dos tarjetas son hijos
  `flex-1` de un `flex-row` sin `items-*` (por defecto `stretch`): ambas toman
  el alto de la más alta. No se fija ningún `h-*`, `min-h-*` ni `self-*`. Jest
  no mide layout: los candados de R5 fijan la receta (sin `items-*` en la fila,
  sin alto ni `self-*` en la tarjeta) y la confirmación real es el smoke G2.
- **D7. Chevron y el resto de la tarjeta, intactos.** `ChevronRight` 18 / 2.4,
  `TOUCH_SLOP`, `CONTINUOUS_CORNER`, los `testID` `-icon`/`-text`/`-label`/
  `-subtitle`/`-chevron` y las clases del texto no cambian.

## Convenciones de esta spec

- Cada test nuevo o enmendado nombra `#229 R<n>` (siempre seguido de ` R<n>`;
  `design-drift` exige ` R<n>` tras cada `#NNN` en código y tests).
- Los `fireEvent`, `act` y `render` van con `await` (RNTL 14).
- Corre jest con rutas por prefijo sin paréntesis (`src/screens/profile`,
  `src/__tests__`).
- Los tests nuevos van en `describe('#229 R<n>: …')` **nuevos al final de**
  `src/screens/profile/index.test.tsx` (después de `#235 R3`), con
  `beforeEach(setupProfile168)` y `await renderProfile();`. Para fijar los
  tests de la rama sin mascota, usan el arranque del `it` existente
  `R6: sin mascota la segunda fila es Unirme con código`
  (`mockListPets.mockResolvedValue({ kind: 'ok', pets: [] })`,
  `mockGetPet.mockReturnValue(pending<PetState>())`,
  `await screen.findByTestId('profile-links-row-1')`).
- Los literales de clase se escriben **a mano** en el test
  (`bg-category-rose`, `bg-category-amber`, `text-category-rose-strong`,
  `text-category-amber-strong`), sin `CATEGORY_SLOTS` como valor esperado en
  los tests nuevos. Entre nodos se comparan `testID`, no con `toBe(nodo)`.
- Los hijos de una tarjeta se leen con `link.children` y
  `typeof child === 'string' ? child : child.props.testID` (el patrón del `it`
  `con mascota ordena dos filas de dos tiles`); no se usa `getByTestId` para
  `-icon` y `-chevron`, que están ocultos a accesibilidad.
- `StyleSheet` no aparece en el fichero de test (lo veta la guarda
  `featureFiles` de `design-drift`).
- **Sin color nuevo, sin clase de guarda nueva.** El único literal de clase
  nuevo es `flex-1` en el `Pressable` de `ProfileWideTile` (ya existe como
  utilidad en el mismo fichero, `ProfileTile`). No se mueve ningún recuento:
  `ChevronRight` sigue en 2 (import + un uso), `ProfileWideTile` en 3
  (definición + 2 usos), `CONTINUOUS_CORNER`, `rounded-tile` y `signOut` no
  cambian, y no hay `t()` nuevo (`ui-copy-table`/`SCREEN_FILES` intactos).

## Evidencia (medida en `26b86621`)

Cuentas con `grep -cF -- "<literal>" src/screens/profile/index.tsx` desde
`mobile-pet-tracker/`. «Tras» está medido sobre una copia con el cambio
propuesto aplicado (no en el árbol):

| Literal | Hoy | Tras #229 |
|---|---|---|
| `flex-row items-center gap-2.5 rounded-tile p-3` | 1 | 1 |
| `flex-1 flex-row items-center gap-2.5 rounded-tile p-3` | 0 | 1 |
| `flex-1 gap-1.5 rounded-tile p-3` (ProfileTile) | 1 | 1 |
| `testID="profile-links-row-` | 6 | 5 |
| `testID="profile-links-row-2"` | 1 | 1 |
| `testID="profile-links-row-3"` | 1 | 0 |
| `{joinPetLink}` | 2 | 2 |
| `ChevronRight` | 2 | 2 |
| `ProfileWideTile` | 3 | 3 |

`git diff --numstat` del fichero de producción desde la base: `1<TAB>3`
(la línea de la clase de `ProfileWideTile` se sustituye, `+1 −1`; y se
eliminan la apertura y el cierre de `profile-links-row-3`, `−2`, porque la
línea `{joinPetLink}` se conserva con la misma sangría y pasa a la fila 2; en
total `+1 −3`).

Guards de la carta que **no se mueven** (el cambio no añade color, radio,
copy, `ChevronRight` ni `signOut`): `consistency-classnames.test.ts`,
`profile-canvas-fidelity.test.ts`, `legibility-classnames.test.ts`,
`design-drift.test.ts`, `ui-copy-table.ts`, `SCREEN_FILES`. El handoff pone
`T0` (suite de `src/screens/profile` y `src/__tests__` en verde **antes** de
editar) y la misma tras cada commit de producción.

## Requisitos funcionales

- **R1**: WHEN Perfil pinta `ProfileWideTile` (Familia y Unirme con código), THE
  SYSTEM SHALL darle a su `Pressable` exactamente la clase
  `flex-1 flex-row items-center gap-2.5 rounded-tile p-3 <superficie del slot>`,
  con `bg-category-rose` para `members-link` y `bg-category-amber` para
  `join-pet-link`, de modo que cada tarjeta reparte el ancho de su fila a partes
  iguales y el bloque de texto deja de colapsar a ancho 0.
  - Test: `describe('#229 R1: las tarjetas anchas reparten la fila')` con un
    `it.each` de dos tarjetas (una rama por tarjeta):
    `it.each([['members-link', 'bg-category-rose'], ['join-pet-link', 'bg-category-amber']])('#229 R1: %s lleva flex-1')`.
    Cada `it` aserta `screen.getByTestId(id).props.className` `toBe(`flex-1 flex-row items-center gap-2.5 rounded-tile p-3 ${surface}`)`
    con `surface` escrito a mano en la tabla del `it.each`. Nace rojo (falta el
    prefijo `flex-1 `).
  - Mutaciones plantadas (cada una se revierte): (a) quitar `flex-1 ` del
    componente → rojo ambos `it`; (b) `flex-row flex-1 items-center …` (orden
    cambiado) → rojo ambos (la clase está fijada exacta); (c) prefijo
    condicional `${slot === 'rose' ? 'flex-1 ' : ''}` → rojo solo el `it` de
    `join-pet-link` (zona ciega: el candado mira cada tarjeta por separado);
    (d) `flex-1` solo en el `style` en vez de la clase → rojo ambos.

- **R2**: WHEN Perfil pinta los enlaces con una mascota seleccionada, THE SYSTEM
  SHALL poner `members-link` y `join-pet-link`, en ese orden, como los dos únicos
  hijos de `profile-links-row-2`, dejar `profile-links` con exactamente tres
  filas (`-row-0`, `-row-1`, `-row-2`) y no renderizar `profile-links-row-3`.
  - Test: `describe('#229 R2: Familia y Unirme con código comparten fila')`,
    `it('#229 R2: con mascota ambas tarjetas van lado a lado en la fila 2')`:
    `profile-links` tiene `children.length` 3; `profile-links-row-2` tiene
    `className` `toBe('flex-row gap-2')` y `children` mapeados a `testID`
    `toEqual(['members-link', 'join-pet-link'])`;
    `screen.queryByTestId('profile-links-row-3', { includeHiddenElements: true })`
    `toBeNull()`; pulsar `join-pet-link` llama a `mockRouter.push` con
    `'/join-pet'` y pulsar `members-link` con `'/pets/pet-1/members'`. Nace rojo.
  - Mutaciones plantadas: (a) dejar `{joinPetLink}` en su fila 3 → rojo (3 filas
    pasan a 4, fila 3 existe); (b) `{joinPetLink}` **antes** de la tarjeta de
    Familia → rojo (orden); (c) `{joinPetLink}` movido a `profile-links-row-1`
    (zona ciega: la fila de zonas seguras) → rojo por la fila 2 con un solo hijo
    y por el `it` amendado de dos filas de dos tiles (fila 1 con 3 hijos);
    (d) `{joinPetLink}` duplicado en filas 2 y 3 → rojo (`children.length` 4 y
    fila 3 presente).

- **R3**: WHEN Perfil pinta Familia o Unirme con código, THE SYSTEM SHALL
  conservar sin cambio el contenido de la tarjeta: tres hijos en el orden
  icono, texto, chevron (`<testID>-icon`, `<testID>-text`, `<testID>-chevron`),
  el bloque de texto con clase `flex-1 gap-0.5`, la etiqueta con
  `text-sm font-extrabold <tinta>` y los literales de copy ya existentes
  (`Familia`; `Unirme con código` con subtítulo
  `¿Te invitaron a cuidar una mascota?`), sin ninguna cadena nueva.
  - Test: `describe('#229 R3: el contenido de las tarjetas no cambia')` con
    `it.each([['members-link', 'Familia', 'text-category-rose-strong'], ['join-pet-link', 'Unirme con código', 'text-category-amber-strong']])('#229 R3: %s conserva icono, texto y chevron')`.
    Cada `it`: los `children` del `Pressable` mapeados a `testID` `toEqual([`${id}-icon`, `${id}-text`, `${id}-chevron`])`;
    `screen.getByTestId(`${id}-text`).props.className` `toBe('flex-1 gap-0.5')`;
    `screen.getByTestId(`${id}-label`)` con `className`
    `text-sm font-extrabold ${tinta}` (escrita a mano) y `toHaveTextContent(label)`;
    y, para `join-pet-link`, el subtítulo `toHaveTextContent('¿Te invitaron a cuidar una mascota?')`
    (el subtítulo de Familia es dinámico y lo cubre `#214 R5`, sin tocar).
    **Nace verde** (fija lo que R1/R2 no deben tocar; es el único test que
    nace verde en esta spec). La ausencia de copy nuevo se comprueba por
    diff en R6.
  - Mutaciones plantadas: (a) quitar `flex-1` del bloque `-text` (la causa
    interna del texto en 0) → rojo ambos (zona ciega de R1, que solo mira el
    `Pressable`); (b) intercambiar icono y chevron en el JSX → rojo ambos;
    (c) añadir un cuarto hijo (`<View />`) → rojo ambos; (d) cambiar la
    etiqueta a `Mi familia` → rojo el `it` de `members-link`.

- **R4**: WHEN Perfil pinta los enlaces sin mascota, THE SYSTEM SHALL dejar
  `join-pet-link` como único hijo de `profile-links-row-1`, tras
  `profile-links-row-0` (`reminders-link`), con la misma clase de R1 (con
  `flex-1`), sin `members-link` y sin fila 2.
  - Test: `describe('#229 R4: sin mascota Unirme con código ocupa la fila')`,
    `it('#229 R4: sin mascota Unirme con código lleva flex-1 en la fila 1')`:
    `profile-links` con `children.length` 2; fila 1 con `className`
    `toBe('flex-row gap-2')` y `children` mapeados a `testID` `toEqual(['join-pet-link'])`;
    `join-pet-link` con `className` `toBe('flex-1 flex-row items-center gap-2.5 rounded-tile p-3 bg-category-amber')`;
    `queryByTestId('members-link', { includeHiddenElements: true })` y
    `queryByTestId('profile-links-row-2', { includeHiddenElements: true })`
    `toBeNull()`. Nace rojo (falta `flex-1`).
  - Mutaciones plantadas: (a) quitar `flex-1 ` del componente → rojo;
    (b) definir `joinPetLink` dos veces (una por rama) con `flex-1` solo en la
    copia de la rama con mascota → rojo solo este `it` (zona ciega: R1 mira
    la rama con mascota); (c) renderizar la tarjeta de Familia también sin
    mascota → rojo.

- **R5**: WHEN Perfil pinta las filas de enlaces con mascota, THE SYSTEM SHALL
  dar a `profile-links-row-0`, `-row-1` y `-row-2` exactamente la clase
  `flex-row gap-2` (sin `items-*`, `justify-*` ni alto) y a `members-link` y
  `join-pet-link` una clase con `flex-1` exactamente una vez y sin ninguna
  utilidad de alto, ancho o auto-alineado (`h-*`, `min-h-*`, `max-h-*`, `w-*`,
  `min-w-*`, `max-w-*`, `self-*`, `basis-*`, `grow`, `shrink`, `flex-none`,
  `flex-auto`), de modo que las dos tarjetas de la fila 2 se estiran al alto
  de la más alta igual que las parejas de `ProfileTile`.
  - Test: `describe('#229 R5: las tarjetas de la fila 2 se estiran por igual')`,
    `it('#229 R5: las tres filas son flex-row gap-2 y las tarjetas no fijan alto')`:
    para `['profile-links-row-0', 'profile-links-row-1', 'profile-links-row-2']`,
    `className` `toBe('flex-row gap-2')`; para `['members-link', 'join-pet-link']`,
    `className.split(' ').filter((token) => token === 'flex-1')` con longitud 1 y
    ningún token que case `/^(h|min-h|max-h|w|min-w|max-w|self|basis)-|^(grow|shrink|flex-none|flex-auto)$/`.
    Nace rojo (hoy hay 0 `flex-1`). Jest no mide layout (D6): el alto igual lo
    confirma el smoke G2.
  - Mutaciones plantadas: (a) `items-start` en la fila 2 → rojo; (b) `items-center`
    en la fila 2 → rojo; (c) `self-start` en `ProfileWideTile` → rojo;
    (d) `h-20` en `ProfileWideTile` → rojo; (e) `flex-1 flex-1` repetido →
    rojo (longitud 2); (f) la fila 2 con `gap-3` → rojo.

- **R6**: WHEN se implementa #229, THE SYSTEM SHALL limitar el cambio a
  `src/screens/profile/index.tsx` (`+1 −3`) y a
  `src/screens/profile/index.test.tsx`, enmendar en su sitio los tres `it`
  existentes que fijaban la disposición antigua y no tocar nada más.
  - Los tres `it` enmendados (la raíz del título se conserva, D5):
    1. `con mascota ordena dos filas de dos tiles (enmendado por #214 R4, R6)`
       (título final con ` (enmendado por #229 R2)` añadido): `grid.children`
       pasa de `2 + 2` a `2 + 1`.
    2. `R4: con mascota añade la fila de Familia a ancho completo y navega a members`
       (en `describe('#214 R4: tarjeta de Familia')`; sufijo
       ` (enmendado por #229 R1, R2)`): `row.children` pasa de 1 a 2 y
       `profileChild(row, 1)` es `join-pet-link`; la clase del enlace pasa a
       `flex-1 flex-row items-center gap-2.5 rounded-tile p-3 bg-category-rose`
       escrita a mano.
    3. `R6: con mascota la cuarta fila es Unirme con código y navega a join-pet`
       (en `describe('#214 R6: Unirme con código en Perfil')`; sufijo
       ` (enmendado por #229 R1, R2)`): usa `profile-links-row-2`, `row.children`
       2, `profileChild(row, 1)` es el enlace, `profileChild(profile-links, 2)`
       es la fila, y la clase pasa a `flex-1 flex-row items-center gap-2.5 rounded-tile p-3 bg-category-amber`
       escrita a mano.
    No se tocan: `pinta la fila de zonas seguras tras la de GPS…`,
    `R6: sin mascota la segunda fila es Unirme con código`, el test de
    recordatorios sin mascota, `R4: sin mascota no hay tarjeta de Familia` ni
    `#214 R5`.
  - Test A (anclas, handoff): las cifras de «Tras #229» de la tabla de
    Evidencia, medidas con `grep -cF -- "<literal>"`;
    `grep -cF "(enmendado por #229 R" src/screens/profile/index.test.tsx`
    imprime `3`.
  - Test B (alcance, por diff): `git diff --name-only <H0>..HEAD` solo lista bajo
    `mobile-pet-tracker/` `src/screens/profile/index.tsx` y
    `src/screens/profile/index.test.tsx`, más ficheros bajo `progress/`; ni
    `src/i18n/`, ni `src/__tests__/` (incluido `ui-copy-table.ts`), ni
    `docs/`, ni `src/theme/`. `git diff --numstat <H0>..HEAD -- src/screens/profile/index.tsx`
    imprime `1<TAB>3<TAB>…`.
  - Test C (guards): `bunx jest src/screens/profile src/__tests__` en verde con
    las mismas cifras que T0 salvo los `it` nuevos (R1: 2, R2: 1, R3: 2, R4: 1,
    R5: 1, total 7).
  - Mutación plantada: (a) añadir una `t('…')` o un literal de copy nuevo en
    `ProfileWideTile` → rojo `ui-language`/`ui-copy-table` (el cambio no puede
    introducir copy); (b) dejar uno de los tres `it` sin enmendar → rojo.

## Enmiendas a otras features

| Enmendado | Ruta | Qué cambia | Dónde se anota |
|---|---|---|---|
| #214 R4 | `specs/mobile-pet-members/requirements.md` (R4, «tarjeta de Familia») y su `it` `R4: con mascota añade la fila de Familia a ancho completo y navega a members` | Familia deja de ir sola «a ancho completo» en la fila 2: comparte la fila 2 con Unirme con código, la clase del enlace gana el prefijo `flex-1 ` y la fila tiene 2 hijos | Sufijo `(enmendado por #229 R1, R2)` en el título del `it` (R6). El texto de la spec #214 no se edita: la enmienda y su casilla viven aquí (§Aprobación) |
| #214 R6 | `specs/mobile-pet-members/requirements.md` (R6, «Unirme con código en Perfil») y sus `it` `R6: con mascota la cuarta fila es Unirme con código y navega a join-pet` y `con mascota ordena dos filas de dos tiles (enmendado por #214 R4, R6)` | Con mascota, Unirme con código deja de ser una cuarta fila propia (`profile-links-row-3`): es el segundo hijo de la fila 2; `profile-links` tiene 3 filas; la clase del enlace gana `flex-1 ` | Sufijos `(enmendado por #229 R1, R2)` y `(enmendado por #229 R2)` en los títulos (R6). Sin mascota no cambia la fila 1 |

El artboard `specs/mobile-pet-members/canvas/PerfilFamilia.dc.html` (Familia a
todo lo ancho) queda superado por la decisión «Lado a lado» del humano; no se
edita (único escritor: el leader).

## Paso de smoke nuevo (G2, humano, en lote al final)

Anotar en `progress/smoke_mejoras-smoke.md` (lo registra el leader). Reproduce
el fallo original, en el dev build de Android, en tema **claro** y en **oscuro**.
Hallazgo literal del humano (2026-11-03): «Cards Familia y Unirme con código»,
decisión «Lado a lado»; antes las dos salían a media anchura, en filas separadas
y sin texto.
1. Perfil, con una mascota seleccionada: bajo las filas de Documentos/Emparejar
   y Zonas seguras/Recordatorios hay **una sola fila** con dos tarjetas lado a
   lado, Familia a la izquierda y Unirme con código a la derecha, con el mismo
   alto y el mismo ancho.
2. Cada tarjeta muestra su texto (Familia con su resumen; Unirme con código con
   «¿Te invitaron a cuidar una mascota?»), icono y chevron; ninguna sale vacía.
   Apuntar si el texto se parte en 3 o 4 líneas en este teléfono (D1): si el
   humano lo rechaza, es otra feature.
3. Pulsar Familia abre los miembros de la mascota; pulsar Unirme con código abre
   «Unirme con código».
4. Perfil sin mascotas: Unirme con código ocupa el ancho entero de su fila.
5. Repetir los pasos 1 a 4 en tema claro y en oscuro.

## Fuera de alcance

- Una tarjeta vertical, `numberOfLines`, recortar o acortar copy, o cambiar el
  alto de las tarjetas (D1, D6).
- `ProfileTile`, las filas 0 y 1, la cámara de la foto (#235) y el resto de
  Perfil.
- Copy, i18n, colores, iconos, chevron, `hitSlop`, animaciones.
- El artboard de #214 y `docs/ui-guidelines.md`.
- Backend, dependencias, módulos nativos.
- El smoke en dispositivo (G2) y cualquier rebuild del dev build.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
  (R1 a R6; la firma delegada la pone el leader con la checklist de
  `progress/plan_canvas-parity-2026-10-23.md` §4, los tres puntos de
  `progress/plan_ui-2026-10-26.md` §4 y los dos de
  `progress/plan_mejoras-smoke-2026-11-03.md` §4)
- [ ] Enmienda de #214 R4 y R6 aprobada (la firma de esta spec la cubre; casilla
  propia porque el plan §4 pide dejar la casilla de la enmienda) (fecha: ____)
- [ ] **G2**: smoke en el dev build de Android (claro y oscuro, cinco pasos de
  «Paso de smoke nuevo») (fecha: ____) ← gate humano, por lote al final
  (`progress/smoke_mejoras-smoke.md`)
- Base congelada: `26b86621` (`feature/229-mobile-profile-family-join-row` sobre
  `dev`; `origin/dev` `5c7c9547` solo añade documentos).
