---
feature: "mobile-no-collar-states-pingo"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-no-collar-states-pingo]] (#159)

## Reglas de todas las tareas

- **Rutas.** Los comandos se lanzan desde la raíz del repo; los de jest
  entran antes en `mobile-pet-tracker/`. «El test del componente» es
  `mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx`. Ninguna
  ruta de esta feature lleva paréntesis.
- **Cómo medir.** Mide cada paso con el fichero concreto y **sin pipe**, así
  el código de salida es el de jest. Comprueba también que `Tests:` cuenta
  más de 0.

  ```bash
  cd mobile-pet-tracker && bunx jest src/components/__tests__/empty-state.test.tsx; echo "exit=$?"
  ```

- **Antes de cada commit verde** corre, sin pipe,
  `cd mobile-pet-tracker && bunx tsc --noEmit; echo "exit=$?"` y
  `cd mobile-pet-tracker && bunx expo lint --no-cache; echo "exit=$?"`.
  Los dos tienen que dar `exit=0`.
- **Gestor de paquetes.** Usa `bun` y `bunx`, nunca `npm` ni `npx`. Esta
  feature no instala nada (R9).
- **Commits test-primero.** De R1 a R8, cada tarea deja como mínimo **dos
  commits**, con la descripción en inglés (`docs/conventions.md` §Commits):
  1. `test(mobile-no-collar-states): #159 R<n> red <what>`: solo tests,
     medido en rojo antes de commitear. El rojo es el que dice la tarea: por
     **consulta** (el nodo no existe y falla `findBy*`/`getBy*`) o por
     **aserción** (el nodo o el valor existe pero no cuadra). Los literales
     viejos que se reescriben (design.md K2 y K9) van en este commit: son
     parte del rojo.
  2. `feat(mobile-no-collar-states): #159 R<n> <what>`: la implementación y
     los candados de design.md §Candados que mueve esa R (K1, K3 a K7),
     medido en verde.

  Un commit que mezcle tests e implementación incumple C4 de
  `CHECKPOINTS.md`. El refactor, si lo hay, va en un tercer commit
  `refactor(mobile-no-collar-states): …`. R6 y R9 son candados que nacen en
  verde: su rojo se demuestra con sondas. Algunos `it` de R7 y R8 también
  nacen en verde, y cada tarea dice cuáles y con qué sonda. R10 es del humano.
- **Esperas.** Rige `docs/conventions.md` §Esperas sobre el árbol
  renderizado: se espera con `findByTestId` o `waitFor` sobre el nodo, nunca
  sobre el contador de un mock. Toda aserción de ausencia se ancla antes a la
  aparición de un nodo positivo del mismo escenario. En el Mapa (T4), además,
  el orden de las promesas garantiza que ese nodo implica que el detalle ya
  llegó.
- **Literales.** Los literales de copy, de clases, de rutas y de nombres de
  fichero se copian byte a byte de requirements.md §Tabla de literales y de
  esta página. Ningún test importa el valor que comprueba.
- **Texto entero.** En RNTL 14, `toHaveTextContent` compara el texto entero.
  Las esperas de texto van sobre `-title` o `-body`, nunca sobre la raíz de un
  `EmptyState`, que suma título, cuerpo y botón.
- **Estilos en los tests.** Ningún test nuevo usa `StyleSheet`, hex ni
  clases arbitrarias: design-drift también recorre los tests.
- **Comentarios.** En código de producción, toda cita a la feature se escribe
  `#159 R<n>`, nunca `#159` suelto.
- **Sondas.** Se hacen con el árbol limpio, justo después del commit que
  nombra la tarea, y solo se mide el fichero de test que nombra la sonda.
  - Revierte con `git checkout HEAD -- <fichero>`.
  - Comprueba con `git diff --cached --quiet && git diff --quiet; echo "limpio=$?"`,
    que tiene que dar `limpio=0`.
  - Nunca uses `git checkout <commit> -- <fichero>`: deja el cambio en el
    índice.
  - Apunta cada sonda y su resultado en `progress/impl_mobile-no-collar-states-pingo.md`.
- **Trazabilidad.** Tras el commit verde de cada tarea, rellena su fila en
  `specs/mobile-no-collar-states-pingo/traceability.md`.
- **Lista cerrada.** Solo se tocan los ficheros de design.md §Archivos
  afectados, más `traceability.md` y el progress de arriba.
- **Si algo no cuadra con la spec, para.** Escríbelo en el progress y no
  improvises.

## T0 — Arranque

Antes de escribir nada, comprueba estas anclas. Cada comando lleva al lado
su salida esperada, medida en 65f37841. **Si alguna no da lo esperado, para
y repórtalo**: la base no es la que la spec supone. Si #158 mergeó antes que
esta feature, A3 y A23 cambian, y el leader las vuelve a medir antes del
handoff (design.md §Coordinación con #158).

| # | Comando | Salida esperada |
|---|---|---|
| A1 | `test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok` | `ok`. Si falla, no lo borres tú: pídeselo al humano |
| A2 | `git merge-base --is-ancestor 65f37841 HEAD && echo ok` | `ok` |
| A3 | `grep -cF '+ 5, // #155 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | `1` |
| A4 | `grep -cF "['geofences.needsCollar', 'Safe zones require a collar', 'Las zonas seguras requieren un collar']," mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | `1` |
| A5 | `grep -cF 'expect(R4_MAP).toHaveLength(17 + 2); // +2 #155 R4' mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `1` |
| A6 | `grep -cF 'expect(R14_GEOFENCES).toHaveLength(18 + 1); // +1 #155 R8' mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `1` |
| A7 | `grep -cF "{ file: 'src/screens/map/index.tsx', key: 'map.trackingNeedsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | `1` |
| A8 | `grep -cF "{ file: 'src/screens/geofences/index.tsx', key: 'geofences.needsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | `1` |
| A9 | `grep -cF "{ file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.needsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | `1` |
| A10 | `grep -cF "['src/screens/map/index.tsx', 1]," mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx` | `1` |
| A11 | `grep -cF "['src/screens/geofences/index.tsx', 1]," mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx` | `1` |
| A12 | `grep -cF "t('map.trackingNeedsCollar')" mobile-pet-tracker/src/screens/map/index.tsx` | `1` |
| A13 | `grep -cF '<Text testID="map-no-tracking" className="text-center text-muted">' mobile-pet-tracker/src/screens/map/index.tsx` | `1` |
| A14 | `grep -cF '<Card testID="geofences-no-tracking" className="items-center py-8">' mobile-pet-tracker/src/screens/geofences/index.tsx` | `1` |
| A15 | `grep -cF "const canSetLostMode = selectedPet?.myRole === 'owner';" mobile-pet-tracker/src/screens/map/index.tsx` | `1` |
| A16 | `grep -cF "'El rastreo en vivo requiere un collar'," mobile-pet-tracker/src/screens/map/index.test.tsx` | `1` |
| A17 | `grep -cF "it('pinta el 402 sin Reintentar'" mobile-pet-tracker/src/screens/geofences/index.test.tsx` | `1` |
| A18 | `grep -cF "it('pinta el 402 sin Reintentar'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx` | `1` |
| A19 | `grep -cF 'Las zonas seguras requieren un collar' mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx` | `2` |
| A20 | `grep -cF "'La actividad requiere un collar'" mobile-pet-tracker/src/screens/home/index.test.tsx` | `3` |
| A21 | `grep -cF 'const mockRouter = jest.mocked(router);' mobile-pet-tracker/src/screens/map/index.test.tsx` | `1` |
| A22 | `grep -cF '### §2.21 — Añadidos por #155 — Pingo en los estados vacíos' specs/mobile-ui-language/design.md` | `1` |
| A23 | `grep -cF '### §2.23' specs/mobile-ui-language/design.md` | `0` |
| A24 | `grep -cF '## 3. La infraestructura' specs/mobile-ui-language/design.md` | `1` |
| A25 | ``grep -cF 'el tab Map muestra `Live tracking requires a collar`' docs/verification.md`` | `1` |
| A26 | `grep -cF 'map.trackingNeedsCollar' mobile-pet-tracker/src/i18n/catalog.ts` | `2` |
| A27 | bloque A27, debajo de la tabla | `0` |
| A28 | bloque A28, debajo de la tabla | `mobile-pet-tracker/src/screens/map/index.tsx:0` y `mobile-pet-tracker/src/screens/geofences/index.tsx:0` |

Los comandos con `|` van fuera de la tabla, para copiarlos tal cual:

```bash
# A27. Las cuatro claves nuevas aún no existen. Esperado: 0
grep -cE "^\s+'(map\.noTrackingTitle|map\.noTrackingBody|geofences\.noTrackingTitle|geofences\.noTrackingBody)':" mobile-pet-tracker/src/i18n/catalog.ts
# A28. Las dos pantallas no animan hoy. Esperado: las dos con :0
grep -cE "react-native-reanimated|\bAnimated\b|LayoutAnimation|entering=|MOTION_" mobile-pet-tracker/src/screens/map/index.tsx mobile-pet-tracker/src/screens/geofences/index.tsx
```

Después:

1. Apunta en `progress/impl_mobile-no-collar-states-pingo.md` el resultado
   de `git rev-parse HEAD`. Es el **HEAD del handoff**, la base de los diffs
   de T9.
2. Mide en verde, sin pipe, cada fichero de test que vas a tocar (design.md
   §Archivos afectados, tabla «Tests»). Si alguno nace rojo, para y repórtalo.

## Orden

El orden es el numérico, de R1 a R10. Ninguna tarea asevera un nodo que cree
una tarea posterior:

- R1 crea las claves que pintan R2 y R5, y la sección §2.23 donde R2, R7 y R8
  escriben sus filas.
- R2 crea el `EmptyState` del Mapa al que R3 da la acción.
- R3 crea la acción que R4 condiciona.
- R5 crea el `EmptyState` de Zonas seguras que R6 inspecciona.
- R7 y R8 solo dependen de R1.
- R9 cierra el resultado de R2 y R5.

## T1 — R1: el copy sin collar existe en los dos idiomas

- [ ] (1) **Rojo.** Al final del test del componente añade:
  - Una constante `noCollarRows` (`as const`) con cuatro tuplas
    `[clave, en, es]`, las de L1 a L4 de requirements.md.
  - Una función `section159()` que devuelve el trozo de `languageDesign()` que
    va desde `### §2.23 — Añadidos por #159 — Pingo sin collar` hasta
    `\n## 3. La infraestructura`, o `''` si el encabezado no existe.
  - `describe('#159 R1: el copy sin collar existe en los dos idiomas')`, con:
    - `it.each(noCollarRows)('declara %s en inglés y en español')`:
      `enCatalog[key]` y `esCatalog[key]` con `toBe`. Rojo **por aserción**.
    - `it.each(['map.noTrackingBody', 'geofences.noTrackingBody'])('%s no exclama, no lleva emoji y termina en punto en los dos idiomas')`:
      para cada idioma, primero `expect(typeof v).toBe('string')`, y luego
      `not.toMatch(/[!¡]/)`, `not.toMatch(/\p{Extended_Pictographic}/u)` y
      `toMatch(/\.$/)`. Rojo **por aserción**.
    - `it.each(['map.noTrackingTitle', 'geofences.noTrackingTitle'])('%s no exclama, no lleva emoji y no termina en punto en los dos idiomas')`:
      las mismas comprobaciones, pero con `not.toMatch(/\.$/)` al final. Rojo
      **por aserción** (falla en el `typeof`).
    - `it('abre la sección §2.23 en mobile-ui-language tras §2.21 y antes de la infraestructura')`:
      el documento contiene el encabezado exacto, y
      `indexOf('### §2.21 — Añadidos por #155')` < `indexOf` del encabezado <
      `indexOf('## 3. La infraestructura')`. Rojo **por aserción**.
    - `it.each(noCollarRows)('%s tiene fila de #159 en mobile-ui-language')`:
      `section159()` contiene
      `` `| — | \`${key}\` | \`${en}\` | \`${es}\` | ← añadida por #159 (R1) |` ``.
      Rojo **por aserción**.

  Rojo esperado: 13 tests en rojo y el resto del fichero en verde. Commit
  `test(mobile-no-collar-states): #159 R1 red no-collar copy`.
- [ ] (2) **Verde.**
  - `src/i18n/catalog.ts`: las cuatro claves en `en` y en `es`, las `map.*`
    junto a las claves `map.*` y las `geofences.*` junto a las
    `geofences.*`. Los valores con apóstrofo van entre comillas dobles, como
    `common.noPetsBody`.
  - `specs/mobile-ui-language/design.md`: tras la última fila de §2.21 (o de
    §2.22, si #158 mergeó antes) y antes de `## 3. La infraestructura`, con
    una línea en blanco por medio, añade el encabezado de §2.23, la cabecera
    de tabla `` | # | Clave | `en` | `es` | Origen | ``, la línea
    `|---|---|---|---|---|` y las cuatro filas.
  - K1: la cola de la suma pasa de `+ 5, // #155 R1` a `+ 5 // #155 R1` y
    `+ 4, // #159 R1`.

  Mide en verde el test del componente,
  `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-language.test.ts`. Commit
  `feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table`.
- [ ] (3) Refactor: ninguno previsto.

## T2 — R2: el Mapa sin seguimiento lo presenta Pingo

- [ ] (1) **Rojo.**
  - En `src/screens/map/index.test.tsx`, dentro de
    `describe('R5: mascota free degrada sin mapa')`, en el
    `it('shows the collar requirement without map, stats, lost mode, or polling')`,
    cambia la espera sobre `map-no-tracking` con
    `'El rastreo en vivo requiere un collar'` por
    `screen.getByTestId('map-no-tracking-body')` con
    `toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.')`.
    El resto del `it` no cambia, y sigue cubriendo R2.3 (`map-view`,
    `stat-speed`, `lost-mode-button` y el sondeo). Rojo **por consulta**.
  - Al final del mismo fichero, añade
    `describe('#159 R2: Mapa sin seguimiento presenta a Pingo')`. Cada `it`
    arranca con `mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] })`
    y `mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' })`, y
    deja el detalle del `beforeEach` del fichero.
    - `it('pinta la pose del collar, el título y la frase de Pingo')`:
      `await screen.findByTestId('map-no-tracking-pose')`, y su
      `props.source` es
      `toEqual([expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-collar\.webp$/) })])`
      (el patrón de `#155 R4`); `map-no-tracking-title` tiene
      `Sin ubicación en vivo`, y `map-no-tracking-body` tiene la frase L2 en
      español. Rojo **por consulta**.
    - `it('queda en el sitio del texto que sustituye y sin mapa debajo')`:
      tras `findByTestId('map-no-tracking-pose')`, sea
      `slot = getByTestId('map-no-tracking')`. Entonces
      `slot.props.className` es `items-center gap-3 py-8`;
      `slot.parent?.props.className` es
      `flex-1 items-center justify-center p-6 bg-background`;
      `slot.parent?.parent?.props.testID` es `screen-map`; los hijos de
      `slot.parent`, mapeados por `testID ?? type` como en `#155 R4`, son
      `['map-no-tracking']`; y `queryByTestId('map-view')` es `null`. Rojo
      **por consulta**.
  - Al final del test del componente, añade
    `describe('#159 R2: el texto de rastreo en vivo se retira')`, con:
    - `it('map.trackingNeedsCollar ya no existe en ningún idioma y queda retirada en mobile-ui-language')`:
      `Object.keys(enCatalog)` y `Object.keys(esCatalog)` no contienen
      `map.trackingNeedsCollar`, y `section159()` contiene la fila exacta de
      R2.4. Rojo **por aserción**.
    - `it('docs/verification.md describe a Pingo en el paso 5 del plan Free')`:
      lee `join(process.cwd(), '..', 'docs', 'verification.md')`. Contiene
      la frase nueva de R2.5 y no contiene `Live tracking requires a collar`.
      Rojo **por aserción**.

  Rojo esperado: 3 tests en el test del Mapa y 2 en el del componente.
  Commit `test(mobile-no-collar-states): #159 R2 red map no-tracking empty state`.
- [ ] (2) **Verde.**
  - `src/screens/map/index.tsx`: dentro del mismo `View`, cambia el `Text`
    `map-no-tracking` por
    `<EmptyState testID="map-no-tracking" pose="collar" title={t('map.noTrackingTitle')} body={t('map.noTrackingBody')} />`,
    **sin** `action` (llega en R3). Nada más cambia en el fichero.
  - `src/i18n/catalog.ts`: borra `map.trackingNeedsCollar` en `en` y en `es`.
  - `specs/mobile-ui-language/design.md`: añade a §2.23 la fila de retirada
    de R2.4.
  - `docs/verification.md`: cambia la frase de R2.5.
  - K1: la cola pasa a `+ 4 // #159 R1` y `- 1, // #159 R2`.
  - K3: `expect(R4_MAP).toHaveLength(17 + 2 + 1); // +2 #155 R4, +1 #159 R2`.
  - K5: en `R4_MAP`, la fila `map.trackingNeedsCollar` se sustituye, en su
    misma posición, por
    `{ file: 'src/screens/map/index.tsx', key: 'map.noTrackingTitle' }, // #159 R2`
    y `{ file: 'src/screens/map/index.tsx', key: 'map.noTrackingBody' }, // #159 R2`.
  - K7: `['src/screens/map/index.tsx', 2],`.

  Mide en verde el test del Mapa, el del componente, `language-provider` y
  `ui-language`. Comprueba las anclas:

  ```bash
  grep -cF "t('map.trackingNeedsCollar')" mobile-pet-tracker/src/screens/map/index.tsx   # 0
  grep -cF 'map.trackingNeedsCollar' mobile-pet-tracker/src/i18n/catalog.ts            # 0
  grep -cF 'Live tracking requires a collar' docs/verification.md                      # 0
  grep -cF 'el tab Map muestra a Pingo con `No live location`' docs/verification.md    # 1
  ```

  Commit `feat(mobile-no-collar-states): #159 R2 map no-tracking empty state`.
- [ ] (3) Refactor: ninguno previsto.

## T3 — R3: el dueño sin collar puede ir a emparejar

- [ ] (1) **Rojo.** Al final de `src/screens/map/index.test.tsx`, añade
  `describe('#159 R3: el dueño sin collar puede ir a emparejar')`. Cada `it`
  arranca con
  `mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] })`,
  `mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() })` (dueño, sin
  collar) y `mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' })`.
  - `it('pinta Vincular collar al dueño de una mascota sin collar')`:
    `const action = await screen.findByTestId('map-no-tracking-action')`, y
    `within(action).getByText('Vincular collar')` es visible. Rojo **por
    consulta**.
  - `it('lleva a emparejar una sola vez')`: tras el `findByTestId` de la
    acción, `await fireEvent.press(action)`; `mockRouter.push` se llama una
    vez y con `'/pairing'`. Rojo **por consulta**.

  Commit `test(mobile-no-collar-states): #159 R3 red pair collar action`.
- [ ] (2) **Verde.**
  - `src/screens/map/index.tsx`: añade al `EmptyState` `map-no-tracking`
    `action={{ label: t('home.pairCollar'), onPress: () => router.push('/pairing') }}`,
    **sin condición**: R4 la condiciona.
  - K3: `expect(R4_MAP).toHaveLength(17 + 2 + 1 + 1); // +2 #155 R4, +1 #159 R2, +1 #159 R3`.
  - K5: tras la fila `map.noTrackingBody`, añade
    `{ file: 'src/screens/map/index.tsx', key: 'home.pairCollar' }, // #159 R3`.

  Mide en verde el test del Mapa y `ui-language`. Commit
  `feat(mobile-no-collar-states): #159 R3 pair collar action on map`.
- [ ] (3) Refactor: ninguno previsto.

## T4 — R4: nadie más ve el botón

- [ ] (1) **Rojo.** Al final de `src/screens/map/index.test.tsx`, añade
  `describe('#159 R4: nadie más ve el botón de emparejar')` con una función
  local `noTrackingAfterDetail(detailState: PetState)` que:
  - crea `const detailPromise = Promise.resolve(detailState)`;
  - hace `mockGetPet.mockReturnValue(detailPromise)`;
  - hace `mockGetLastPosition.mockReturnValue(detailPromise.then((): LastPositionState => ({ kind: 'no-tracking' })))`.

  La última posición resuelve **después** del detalle. Así, cuando el título
  está en el árbol, el detalle ya llegó, y la ausencia del botón se ancla a
  un nodo positivo (§Esperas).

  Cada `it` termina igual:
  1. `await screen.findByTestId('map-no-tracking-title')`;
  2. `map-no-tracking-body` tiene la frase L2 en español;
  3. `expect(screen.queryByTestId('map-no-tracking-action')).toBeNull()`.

  Los `it`:
  - `it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s')`:
    lista `[makePet({ myRole: role })]` y
    `noTrackingAfterDetail({ kind: 'ok', pet: makePet({ myRole: role }) })`.
    Cubre R4.1, R4.2 y R4.3.
  - `it('no pinta el botón al dueño de una mascota con collar')`: lista
    `[makePet()]` y
    `noTrackingAfterDetail({ kind: 'ok', pet: makePet({ device: makeDevice('online') }) })`.
    Cubre R4.4.
  - `it.each([['error', { kind: 'error' }], ['unreachable', { kind: 'unreachable', message: 'offline' }], ['missing-config', { kind: 'missing-config' }]] as const)('no pinta el botón si el detalle resuelve %s')`:
    lista `[makePet()]` y `noTrackingAfterDetail(state)`. Cubre R4.5, R4.6 y
    R4.7.
  - `it('no pinta el botón mientras el detalle carga')`: lista `[makePet()]`,
    `mockGetPet.mockReturnValue(pending<PetState>())` y
    `mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' })`. Cubre R4.8.

  Rojo esperado: los 8 tests, **por aserción**, porque desde el verde de R3
  la acción sale sin condición. Commit
  `test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar`.
- [ ] (2) **Verde.** En `src/screens/map/index.tsx`, declara `canPairCollar`
  junto a `canSetLostMode` con el código exacto de design.md D2, y pon
  `action={canPairCollar ? { label: t('home.pairCollar'), onPress: () => router.push('/pairing') } : undefined}`.
  Mide en verde el test del Mapa (R3 sigue verde) y `ui-language` (K3 no
  cambia: sigue habiendo un solo `t('home.pairCollar')`). Commit
  `feat(mobile-no-collar-states): #159 R4 gate pair action on detail`.
- [ ] (3) **Sondas.** Cada una sobre `src/screens/map/index.tsx`, midiendo
  solo el test del Mapa:

  | Sonda | Mutación | Rojo esperado (por aserción) | El resto |
  |---|---|---|---|
  | S4a | quita de `canPairCollar` la cláusula `detail.data.pet.device === null` y su `&&` | solo `no pinta el botón al dueño de una mascota con collar` | verde |
  | S4b | quita de `canPairCollar` la cláusula `detail.data.pet.myRole === 'owner'` y su `&&` | solo las 3 filas de `no pinta el botón a %s` | verde |
  | S4c | cambia `detail.data?.kind === 'ok' &&` por `detail.data?.kind !== 'ok' \|\|` | solo las 3 filas de `no pinta el botón si el detalle resuelve %s` y `no pinta el botón mientras el detalle carga` | verde |

## T5 — R5: Zonas seguras sin seguimiento las presenta Pingo

- [ ] (1) **Rojo.** En `src/screens/geofences/index.test.tsx`:
  - Borra `it('pinta el 402 sin Reintentar')`, el de
    `describe('#41 R5: la pantalla pinta la lista de zonas y sus estados')`.
    Asevera la clase y el literal de la `Card` que R5 sustituye. Su «sin
    Reintentar» pasa al `it` de sitio de abajo.
  - Al final del fichero, añade
    `describe('#159 R5: Zonas seguras sin seguimiento presentan a Pingo')`.
    Cada `it` arranca con `mockList.mockResolvedValue({ kind: 'no-tracking' })`
    y deja el detalle del `beforeEach` (dueño).
    - `it('pinta la pose del collar, el título y la frase de Pingo, sin tarjeta')`:
      `await mount()`; `const empty = await screen.findByTestId('geofences-no-tracking')`,
      y `empty.props.className` es `items-center gap-3 py-8`; la pose casa
      con `/assets\/images\/pingo-collar\.webp$/`;
      `geofences-no-tracking-title` tiene `Zonas seguras no disponibles`; y
      `geofences-no-tracking-body` tiene la frase L4 en español. Rojo **por
      aserción**: hoy el `testID` existe, pero la clase es la de la `Card`.
    - `it('pinta el título y la frase en inglés')`: `await mount('en')`;
      `findByTestId('geofences-no-tracking-title')` tiene
      `Safe zones unavailable`, y `-body` tiene
      `Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.`
      Rojo **por consulta**.
    - `it('queda en el sitio de la tarjeta que sustituye')`: `await mount()`;
      tras `findByTestId('geofences-no-tracking-pose')`, sea
      `slot = getByTestId('geofences-no-tracking')`. Entonces
      `slot.parent?.parent?.props.testID` es `screen-geofences`; los hijos de
      `slot.parent`, mapeados por `testID ?? type` como en `#155 R8`, son
      `['geofences-no-tracking']`; y son `null` `geofences-retry`,
      `geofences-add` y `geofences-empty`. Rojo **por consulta**.

  Rojo esperado: 3 tests. El `it.each('no pinta Añadir zona con %s')`
  sigue en verde, porque espera a `geofences-no-tracking`, que conserva su
  `testID`. Commit
  `test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state`.
- [ ] (2) **Verde.**
  - `src/screens/geofences/index.tsx`: la rama `no-tracking` pasa a ser el
    `EmptyState` de design.md D3, sin `action`. `Card` sigue importada
    porque la usan las filas.
  - K4: `expect(R14_GEOFENCES).toHaveLength(18 + 1 + 1); // +1 #155 R8, +1 #159 R5`.
  - K6: la fila `geofences.needsCollar` de `src/screens/geofences/index.tsx`
    se sustituye, en su misma posición, por
    `{ file: 'src/screens/geofences/index.tsx', key: 'geofences.noTrackingTitle' }, // #159 R5`
    y `{ file: 'src/screens/geofences/index.tsx', key: 'geofences.noTrackingBody' }, // #159 R5`.
    La fila del editor no cambia.
  - K7: `['src/screens/geofences/index.tsx', 2],`.

  Mide en verde el test de Zonas seguras, el del componente y `ui-language`.
  Anclas:

  ```bash
  grep -cF "t('geofences.needsCollar')" mobile-pet-tracker/src/screens/geofences/index.tsx        # 0
  grep -cF "t('geofences.needsCollar')" mobile-pet-tracker/src/screens/geofence-editor/index.tsx  # 1
  ```

  Commit `feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state`.
- [ ] (3) Refactor: ninguno previsto.

## T6 — R6: en Zonas seguras nadie ve el botón

- [ ] (1) **Candado que nace en verde.** Al final de
  `src/screens/geofences/index.test.tsx`, añade
  `describe('#159 R6: en Zonas seguras nadie ve el botón de emparejar')`.
  Cada `it` arranca con `mockList.mockResolvedValue({ kind: 'no-tracking' })`.
  - `it.each(['owner', 'family', 'walker', 'vet'] as const)('no ofrece acción a %s')`:
    `mockGetPet.mockResolvedValue(petState(role))`; `await mount()`;
    `await screen.findByTestId('geofences-no-tracking-title')`; y
    `queryByTestId('geofences-no-tracking-action')` es `null`. Cubre R6.1 a
    R6.4.
  - `it('no ofrece acción si el detalle falla')`:
    `mockGetPet.mockResolvedValue({ kind: 'error' })`, y el resto igual. Cubre
    R6.5.

  La pantalla sigue en esqueleto hasta que el detalle resuelve
  (requirements.md M4), así que el título implica que el detalle llegó. Mide
  en verde. Commit
  `test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones`.
- [ ] (2) **Sondas.** Sobre `src/screens/geofences/index.tsx`, midiendo solo
  el test de Zonas seguras:

  | Sonda | Mutación en el `EmptyState` `geofences-no-tracking` | Rojo esperado (por aserción) |
  |---|---|---|
  | S6a | añade `action={isOwner ? { label: t('home.pairCollar'), onPress: () => router.push('/pairing') } : undefined}` | solo `no ofrece acción a owner` |
  | S6b | lo mismo con `!isOwner` | solo `no ofrece acción a family`, `… a walker`, `… a vet` y `no ofrece acción si el detalle falla` |

- [ ] (3) Implementación: ninguna.

## T7 — R7: la guarda del editor sigue en texto y dice la verdad

- [ ] (1) **Rojo.**
  - En `src/screens/geofence-editor/index.test.tsx`, el literal
    `Las zonas seguras requieren un collar` pasa a
    `Las zonas seguras necesitan un collar con plan activo.` en sus dos
    sitios. Rojo **por aserción** en los dos:
    - en `it('pinta el 402 sin Reintentar')`, de
      `describe('#146 R6: el editor pinta el formulario sobre el mapa y sus estados')`;
    - en la fila `no-tracking` del
      `it.each('pinta %s bajo Guardar y conserva el borrador')`, de
      `describe('#146 R8: Guardar crea o actualiza la zona y vuelve a la lista')`.
  - En `src/providers/__tests__/language-provider.test.tsx`, la tupla del
    `it('registra las once claves en los dos idiomas y en la tabla de la spec de idioma')`
    (`describe('#41 R1: el catálogo trae las once claves de zonas seguras')`)
    pasa a
    `['geofences.needsCollar', 'Safe zones need a collar with an active plan.', 'Las zonas seguras necesitan un collar con plan activo.'],`
    (K2). Rojo **por aserción**.
  - Al final del test del componente, añade
    `describe('#159 R7: la guarda del editor sigue en texto y dice la verdad')`, con:
    - `it('geofences.needsCollar tiene fila de #159 en mobile-ui-language')`:
      `section159()` contiene la fila exacta
      `` | — | `geofences.needsCollar` | `Safe zones need a collar with an active plan.` | `Las zonas seguras necesitan un collar con plan activo.` | ← cambiada por #159 (R7) | ``.
      Rojo **por aserción**.
    - `it('el editor abre <Card testID="geofence-editor-no-tracking"> una sola vez y no usa EmptyState')`:
      en el fuente de `src/screens/geofence-editor/index.tsx`,
      `/<Card\s+testID="geofence-editor-no-tracking"/g` casa una vez y
      `/<EmptyState\b/g` ninguna. **Nace en verde.**

  Rojo esperado: 2 tests en el editor, 1 en `language-provider` y 1 en el
  componente. Commit
  `test(mobile-no-collar-states): #159 R7 red truthful editor guard`.
- [ ] (2) **Verde.**
  - `src/i18n/catalog.ts`: `geofences.needsCollar` toma el valor L6 en `en` y
    en `es`.
  - `specs/mobile-ui-language/design.md`: añade a §2.23 la fila de R7.1. La
    fila de #41 no se toca.

  Mide en verde el test del editor, `language-provider`, el del componente y
  `ui-language`. Commit
  `feat(mobile-no-collar-states): #159 R7 truthful editor guard copy`.
- [ ] (3) **Sonda S7.** En `src/screens/geofence-editor/index.tsx`, cambia
  `<Card testID="geofence-editor-no-tracking"` por
  `<View testID="geofence-editor-no-tracking"`. Midiendo solo el test del
  componente, el rojo esperado es solo el `it` de la `Card` de R7, por
  aserción.

## T8 — R8: la nota de Inicio sigue en texto y dice la verdad

- [ ] (1) **Rojo.**
  - En `src/screens/home/index.test.tsx`, los tres
    `'La actividad requiere un collar'` pasan a
    `'La actividad necesita un collar con plan activo'`. Rojo **por
    aserción** en los tres. Los nombres de los `it` no cambian:
    - `it('explains that activity tracking requires a collar')`;
    - `it('pinta un guion y la nota cuando el perfil tampoco resuelve')`;
    - la fila `sin collar` del
      `it.each('%s: compone la celda y la nota en una sola fila')`.
  - Al final del test del componente, añade
    `describe('#159 R8: la nota de Inicio sigue en texto y dice la verdad')`, con:
    - `it('home.activityNeedsCollar declara el literal nuevo en inglés y en español')`:
      `Activity needs a collar with an active plan` y
      `La actividad necesita un collar con plan activo`. Rojo **por aserción**.
    - `it('home.activityNeedsCollar no exclama, no lleva emoji y no termina en punto en los dos idiomas')`:
      las comprobaciones de T1 para títulos. **Nace en verde**, porque el
      valor viejo tampoco lleva punto.
    - `it('home.activityNeedsCollar tiene fila de #159 en mobile-ui-language')`:
      `section159()` contiene
      `` | — | `home.activityNeedsCollar` | `Activity needs a collar with an active plan` | `La actividad necesita un collar con plan activo` | ← cambiada por #159 (R8) | ``.
      Rojo **por aserción**.
    - `it('Inicio abre <Text testID="summary-note"> una sola vez')`: en el
      fuente de `src/screens/home/index.tsx`,
      `/<Text\s+testID="summary-note"/g` casa una vez. **Nace en verde.** El
      número de `EmptyState` de Inicio (1) ya lo fija la fila
      `['src/screens/home/index.tsx', 1]` de `#155 R10`, que no cambia.

  Rojo esperado: 3 tests en Inicio y 2 en el componente. Commit
  `test(mobile-no-collar-states): #159 R8 red truthful activity note`.
- [ ] (2) **Verde.**
  - `src/i18n/catalog.ts`: `home.activityNeedsCollar` toma el valor L7 en
    `en` y en `es`.
  - `specs/mobile-ui-language/design.md`: añade a §2.23 la fila de R8.1.

  Mide en verde el test de Inicio, el del componente, `language-provider` y
  `ui-language`. Commit
  `feat(mobile-no-collar-states): #159 R8 truthful activity note copy`.
- [ ] (3) **Sondas.** Midiendo solo el test del componente:

  | Sonda | Mutación | Rojo esperado (por aserción) |
  |---|---|---|
  | S8a | en `src/i18n/catalog.ts`, añade `.` al final del valor `es` de `home.activityNeedsCollar` | solo el `it` de voz de R8 y el de declaración de R8 |
  | S8b | en `src/screens/home/index.tsx`, cambia `testID="summary-note"` por `testID="summary-note-sonda"` | solo el `it` de `summary-note` |

## T9 — R9: sin movimiento ni dependencias

- [ ] (1) **Candado que nace en verde.** Al final del test del componente,
  añade
  `describe('#159 R9: los estados sin collar no traen movimiento ni dependencias')`
  con un `it.each` de **10 filas**, una por fichero × patrón, con el nombre
  `'%s no contiene %s'`:
  - ficheros: `src/screens/map/index.tsx` y `src/screens/geofences/index.tsx`;
  - patrones: `react-native-reanimated`, `\bAnimated\b`, `LayoutAnimation`,
    `entering=` y `MOTION_`.

  Cada fila hace `expect(source).not.toMatch(new RegExp(pattern))`. Mide en
  verde. Commit
  `test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens`.
- [ ] (2) **Sondas.** Midiendo solo el test del componente:

  | Sonda | Mutación | Rojo esperado (por aserción) |
  |---|---|---|
  | S9a | añade al final de `src/screens/map/index.tsx` la línea `// react-native-reanimated Animated LayoutAnimation entering= MOTION_` | exactamente las 5 filas del Mapa |
  | S9b | lo mismo en `src/screens/geofences/index.tsx` | exactamente las 5 filas de Zonas seguras |

  Que la pose no se mueve ya lo fijan dos candados de #155 que no cambian:
  `#155 R2` (`pingo-collar.webp` sin el bit de animación de VP8X) y
  `#155 R11` (`empty-state.tsx` sin animación).
- [ ] (3) **Sin dependencias ni cambios en el componente.** Ejecuta

  ```bash
  git diff --quiet <HEAD del handoff> -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/components/empty-state.tsx mobile-pet-tracker/assets/; echo "sin-diff=$?"
  ```

  que debe dar `sin-diff=0`.
- [ ] (4) **Lista cerrada.** Comprueba que
  `git diff --name-only <HEAD del handoff>..HEAD` solo lista ficheros de
  design.md §Archivos afectados,
  `specs/mobile-no-collar-states-pingo/traceability.md` y
  `progress/impl_mobile-no-collar-states-pingo.md`.
- [ ] (5) **Cierre de la suite.** Ejecuta `./init.sh` desde la raíz, **sin
  pipe**, seguido de `echo "exit=$?"`, que tiene que dar `exit=0`. Si el
  clasificador te lo deniega, dilo en el progress y no lo sustituyas por otra
  cosa: lo corre el leader.

## T10 — R10: prueba de humo del humano en dev build de Android

- [ ] (1) No hay test automático. El implementador deja en
  `progress/impl_mobile-no-collar-states-pingo.md` los pasos de
  requirements.md R10, listos para el humano.
- [ ] (2) El humano corre la prueba en el **dev build de Android**, nunca en
  Expo Go, con `bunx expo start --dev-client` desde `mobile-pet-tracker/`.
- [ ] (3) El humano marca con su fecha la casilla «Prueba de humo R10 superada en dev build de Android» de
  requirements.md §Aprobación. Sin ella, el leader no marca `done`.

## Enmienda E1 — ronda 2 (R3 y R4, solo tests)

> Solo tras la firma humana de la Enmienda E1 (requirements.md §Enmienda E1).
> La producción de `src/screens/map/index.tsx` queda **idéntica** a `664b95a7`
> al final de la ronda: el commit verde la restaura desde ese hash. Rutas
> relativas a `mobile-pet-tracker/`. Nada de números de línea: todo se
> localiza por contenido.

- [ ] **Antes.**
  - `git merge-base --is-ancestor 664b95a7 HEAD; echo "exit=$?"` → `exit=0`.
  - `git diff --quiet 664b95a7 HEAD -- mobile-pet-tracker; echo "exit=$?"` → `exit=0`.
  - `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`.
  - Base: `bunx jest --runTestsByPath src/screens/map/index.test.tsx` → `Tests: 109 passed, 109 total`.
  - Si la base no da 109, manda la medida: los recuentos de abajo pasan a
    base + 5 (rojo: 6 failed, base − 1 passed), y la diferencia va al impl.

- [ ] **(1) Commit rojo** `test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list`.
  - En `src/screens/map/index.test.tsx`:
    - Al final de `describe('#159 R3: el dueño sin collar puede ir a emparejar'`, tras
      `it('lleva a emparejar una sola vez'`, añade los dos `it` de
      requirements.md §Enmienda E1. Cada uno sigue el patrón del primer `it` de
      ese `describe`: `mockListPets.mockResolvedValue`,
      `mockGetPet.mockResolvedValue`, `mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' })`,
      `await renderMap()`,
      `const action = await screen.findByTestId('map-no-tracking-action')` y
      `expect(within(action).getByText('Vincular collar')).toBeVisible()`.
      - `it('pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle')`:
        listado `[makePet({ myRole: 'family' })]`, detalle `{ kind: 'ok', pet: makePet() }`.
      - `it('pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle')`:
        listado `[makePet({ device: makeDevice('online') })]`, detalle `{ kind: 'ok', pet: makePet() }`.
    - Al final de `describe('#159 R4: nadie más ve el botón de emparejar'`, tras
      `it('no pinta el botón mientras el detalle carga'`, añade
      `it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s aunque el listado diga owner', async (role) => {…})`:
      `mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] })`,
      `noTrackingAfterDetail({ kind: 'ok', pet: makePet({ myRole: role }) })`,
      `await renderMap()`, y las tres líneas finales de
      `it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s'`
      copiadas tal cual: `findByTestId('map-no-tracking-title')`, el cuerpo con
      `toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.')`
      y `expect(screen.queryByTestId('map-no-tracking-action')).toBeNull()`.
    - Ningún `it` existente cambia, ni de nombre ni de cuerpo.
  - **Mutación versionada** en `src/screens/map/index.tsx`. En `const canPairCollar =`, las líneas
    `detail.data.pet.myRole === 'owner' &&` y `detail.data.pet.device === null;` pasan a
    `selectedPet?.myRole === 'owner' &&` y `selectedPet?.device === null;`.
    La primera línea, `detail.data?.kind === 'ok' &&`, no cambia.
  - Rojo esperado, midiendo solo `src/screens/map/index.test.tsx`:
    `Tests: 6 failed, 108 passed, 114 total`. Los seis son estos:

    | `it` | Por qué falla |
    |---|---|
    | `pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle` | consulta: `Unable to find an element with testID: map-no-tracking-action` |
    | `pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle` | consulta: `Unable to find an element with testID: map-no-tracking-action` |
    | `no pinta el botón a family aunque el listado diga owner` | aserción: `expect(received).toBeNull()` |
    | `no pinta el botón a walker aunque el listado diga owner` | aserción: `expect(received).toBeNull()` |
    | `no pinta el botón a vet aunque el listado diga owner` | aserción: `expect(received).toBeNull()` |
    | `no pinta el botón al dueño de una mascota con collar` (ya existía; cae en cascada) | aserción: `expect(received).toBeNull()` |

    Los dos rojos de R3 son por consulta: su aserción **es** que el botón
    existe, y `findByTestId` es esa aserción. Cualquier otro `it` rojo, o un
    `ReferenceError`, es un error de medida: **para**.

- [ ] **(2) Commit verde** `fix(mobile-no-collar-states): #159 E1 revert list probe, pair action locked to detail`.
  - `git checkout 664b95a7 -- src/screens/map/index.tsx`, y después
    `git diff --quiet 664b95a7 -- src/screens/map/index.tsx; echo "exit=$?"` → `exit=0`.
  - Gate: `Tests: 114 passed, 114 total` en `src/screens/map/index.test.tsx`;
    `bun run typecheck` y `bunx expo lint --no-cache` con `exit=0`.

- [ ] **Sondas E1a-E1e**, sin commit, sobre el árbol verde, en `const canPairCollar =` de
  `src/screens/map/index.tsx`. Mide solo `src/screens/map/index.test.tsx`.
  Restaura cada sonda con `git checkout HEAD -- src/screens/map/index.tsx` y
  `git diff --quiet HEAD -- src/screens/map/index.tsx` (`limpio=0`) antes de
  la siguiente.

  | Sonda | Mutación | Esperado | Qué falla |
  |---|---|---|---|
  | E1a | `detail.data.pet.myRole === 'owner' &&` pasa a `selectedPet?.myRole === 'owner' &&` (la Z1 del reviewer) | `4 failed, 110 passed, 114 total` | las 3 filas `no pinta el botón a %s aunque el listado diga owner` (aserción) y `pinta Vincular collar aunque el listado diga otro rol: …` (consulta) |
  | E1b | pasa a `(selectedPet?.myRole === 'owner' \|\| detail.data.pet.myRole === 'owner') &&` | `3 failed, 111 passed, 114 total` | las 3 filas `… aunque el listado diga owner` (aserción) |
  | E1c | pasa a `selectedPet?.myRole === 'owner' && detail.data.pet.myRole === 'owner' &&` | `1 failed, 113 passed, 114 total` | `pinta Vincular collar aunque el listado diga otro rol: …` (consulta) |
  | E1d | `detail.data.pet.device === null;` pasa a `selectedPet?.device === null;` | `2 failed, 112 passed, 114 total` | `no pinta el botón al dueño de una mascota con collar` (aserción) y `pinta Vincular collar aunque el listado traiga collar: …` (consulta) |
  | E1e | pasa a `selectedPet?.device === null && detail.data.pet.device === null;` | `1 failed, 113 passed, 114 total` | `pinta Vincular collar aunque el listado traiga collar: …` (consulta) |

- [ ] **Cierre.**
  - El comando BASE de la ronda 1 (los 10 ficheros) → `Tests: 754 passed, 754 total`,
    con map en 114.
  - `bun run test` → `97 suites` y `2420 tests` (2415 + 5).
  - `bun run typecheck` y `bunx expo lint --no-cache` con `exit=0`.
  - Si la base de **Antes** no dio 109, estos recuentos se mueven con ella.

- [ ] **(3) Commit final** `docs(mobile-no-collar-states-pingo): #159 E1 traceability`.
  - En traceability.md, la fila R3 añade a su columna de tests los dos `it` nuevos.
  - La fila R4 añade `no pinta el botón a %s aunque el listado diga owner` y
    `(sondas E1a-E1e)`.
  - Las dos filas añaden a su columna de commit `E1: <hash rojo> → <hash verde>`
    con sus mensajes.
  - La lista cerrada de ficheros de la ronda 1 no cambia: E1 solo toca
    `src/screens/map/index.test.tsx` (ya en la lista) y deja
    `src/screens/map/index.tsx` idéntico a `664b95a7`.

## Enmienda E2 — ronda 3 (R3, solo tests)

> Solo tras la firma humana de la Enmienda E2 (requirements.md §Enmienda E2).
> La producción de `src/screens/map/index.tsx` queda **idéntica** a `664b95a7`
> al final de la ronda. Rutas relativas a `mobile-pet-tracker/`. Todo se
> localiza por contenido, sin números de línea.

- [ ] **Antes.**
  - `git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"` → `exit=0`.
  - `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`.
  - Base: `bunx jest --runTestsByPath src/screens/map/index.test.tsx` → `Tests: 114 passed, 114 total`.
  - Si la base no da 114, manda la medida: los recuentos de abajo pasan a
    base + 5, y la diferencia va al impl.

- [ ] **(1) Commit rojo** `test(mobile-no-collar-states): #159 E2 red pair action obeys list role except family`.
  - En `src/screens/map/index.test.tsx`, dentro de
    `describe('#159 R3: el dueño sin collar puede ir a emparejar'`, el `it`
    `'pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle'`
    se reemplaza, en el mismo sitio, por:

    ```tsx
      it.each([
        { role: 'family', collar: 'sin collar', device: null },
        { role: 'family', collar: 'con collar', device: makeDevice('online') },
        { role: 'walker', collar: 'sin collar', device: null },
        { role: 'walker', collar: 'con collar', device: makeDevice('online') },
        { role: 'vet', collar: 'sin collar', device: null },
        { role: 'vet', collar: 'con collar', device: makeDevice('online') },
      ] as const)('pinta Vincular collar aunque el listado diga $role $collar: manda el rol y el collar del detalle', async ({ role, device }) => {
        mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: role, device })] });
        mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
        mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' });
        await renderMap();
        const action = await screen.findByTestId('map-no-tracking-action');
        expect(within(action).getByText('Vincular collar')).toBeVisible();
      });
    ```

    Ningún otro `it` cambia.
  - **Mutación versionada** en `src/screens/map/index.tsx`. En `const canPairCollar =`, la línea
    `detail.data.pet.myRole === 'owner' &&` pasa a las tres de requirements.md §Enmienda E2:
    `selectedPet?.myRole !== 'walker' &&`, `selectedPet?.myRole !== 'vet' &&`
    y `detail.data.pet.myRole === 'owner' &&`. Las demás líneas no cambian.
  - Rojo esperado, midiendo solo `src/screens/map/index.test.tsx`:
    `Tests: 4 failed, 115 passed, 119 total`. Los cuatro, todos por consulta
    (`Unable to find an element with testID: map-no-tracking-action`):
    - `pinta Vincular collar aunque el listado diga walker sin collar: manda el rol y el collar del detalle`
    - `pinta Vincular collar aunque el listado diga walker con collar: manda el rol y el collar del detalle`
    - `pinta Vincular collar aunque el listado diga vet sin collar: manda el rol y el collar del detalle`
    - `pinta Vincular collar aunque el listado diga vet con collar: manda el rol y el collar del detalle`

    Las dos filas `family` quedan verdes. Cualquier otro `it` rojo, o un
    `ReferenceError`/`TypeError`, es un error de medida: **para**.

- [ ] **(2) Commit verde** `fix(mobile-no-collar-states): #159 E2 revert list role probe, pair action locked to detail role`.
  - `git checkout 664b95a7 -- src/screens/map/index.tsx`, y después
    `git diff --quiet 664b95a7 -- src/screens/map/index.tsx; echo "exit=$?"` → `exit=0`.
  - Gate: `Tests: 119 passed, 119 total` en `src/screens/map/index.test.tsx`;
    `bun run typecheck` y `bunx expo lint --no-cache` con `exit=0`.

- [ ] **Sondas E2a-E2d**, sin commit, sobre el árbol verde, en `const canPairCollar =` de
  `src/screens/map/index.tsx`. Mide solo `src/screens/map/index.test.tsx`.
  Restaura cada sonda con `git checkout HEAD -- src/screens/map/index.tsx` y
  `git diff --quiet HEAD -- src/screens/map/index.tsx` (`limpio=0`) antes de
  la siguiente. Todas sustituyen la línea `detail.data.pet.myRole === 'owner' &&`.

  | Sonda | La línea pasa a | Esperado | Qué falla (todo por consulta) |
  |---|---|---|---|
  | E2a | `selectedPet?.myRole !== 'walker' && detail.data.pet.myRole === 'owner' &&` (P6) | `2 failed, 117 passed, 119 total` | `… diga walker sin collar: …`, `… diga walker con collar: …` |
  | E2b | igual con `'vet'` (P6b) | `2 failed, 117 passed, 119 total` | `… diga vet sin collar: …`, `… diga vet con collar: …` |
  | E2c | igual con `'family'` | `2 failed, 117 passed, 119 total` | `… diga family sin collar: …`, `… diga family con collar: …` |
  | E2d | `(selectedPet?.myRole === 'owner' \|\| selectedPet?.device === null) && detail.data.pet.myRole === 'owner' &&` (X1) | `3 failed, 116 passed, 119 total` | `… diga family con collar: …`, `… diga walker con collar: …`, `… diga vet con collar: …` |

- [ ] **Cierre.**
  - El comando BASE de la ronda 1 (los 10 ficheros) → `Tests: 759 passed, 759 total`,
    con map en 119.
  - `bun run test` → `97 suites` y `2425 tests` (2420 + 5).
  - `bun run typecheck` y `bunx expo lint --no-cache` con `exit=0`.
  - Si la base de **Antes** no dio 114, estos recuentos se mueven con ella.

- [ ] **(3) Commit final** `docs(mobile-no-collar-states-pingo): #159 E2 traceability`.
  - En traceability.md, en la fila R3, el `it` de E1
    `pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle`
    pasa a
    `pinta Vincular collar aunque el listado diga $role $collar: manda el rol y el collar del detalle (family, walker y vet, con y sin collar; sondas E2a-E2d)`.
    Su columna de commit añade `E2: <hash rojo> → <hash verde>` con sus mensajes.
  - La lista cerrada de ficheros no cambia: E2 solo toca
    `src/screens/map/index.test.tsx` y deja `src/screens/map/index.tsx`
    idéntico a `664b95a7`.

## Enmienda E3 — ronda 4 (R4, solo tests)

> Solo tras la firma humana de la Enmienda E3 (requirements.md §Enmienda E3).
> La producción de `src/screens/map/index.tsx` queda **idéntica** a `664b95a7`
> al final de la ronda. Rutas relativas a `mobile-pet-tracker/`. Todo se
> localiza por contenido, sin números de línea.

- [ ] **Antes.**
  - `git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"` → `exit=0`.
  - `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`.
  - Base: `bunx jest --runTestsByPath src/screens/map/index.test.tsx` → `Tests: 119 passed, 119 total`.
  - Si la base no da 119, manda la medida: los recuentos de abajo pasan a
    base + 152, y la diferencia va al impl.

- [ ] **(1) Commit rojo** `test(mobile-no-collar-states): #159 E3 red pair action follows list role and collar`.
  - En `src/screens/map/index.test.tsx`, dentro de
    `describe('#159 R4: nadie más ve el botón de emparejar'`, justo después
    del `it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s aunque el listado diga owner', …)`
    y antes del `});` que cierra ese `describe`, se añade:

    ```tsx
      const LIST_STATES = (['owner', 'family', 'walker', 'vet'] as const).flatMap((listRole) => [
        { listRole, listCollar: 'sin collar', listDevice: null },
        { listRole, listCollar: 'con collar', listDevice: makeDevice('online') },
      ]);

      const DETAIL_STATES: { detalle: string; state: PetState }[] = [
        { detalle: 'owner con collar', state: { kind: 'ok', pet: makePet({ device: makeDevice('online') }) } },
        { detalle: 'family sin collar', state: { kind: 'ok', pet: makePet({ myRole: 'family' }) } },
        { detalle: 'family con collar', state: { kind: 'ok', pet: makePet({ myRole: 'family', device: makeDevice('online') }) } },
        { detalle: 'walker sin collar', state: { kind: 'ok', pet: makePet({ myRole: 'walker' }) } },
        { detalle: 'walker con collar', state: { kind: 'ok', pet: makePet({ myRole: 'walker', device: makeDevice('online') }) } },
        { detalle: 'vet sin collar', state: { kind: 'ok', pet: makePet({ myRole: 'vet' }) } },
        { detalle: 'vet con collar', state: { kind: 'ok', pet: makePet({ myRole: 'vet', device: makeDevice('online') }) } },
        { detalle: 'owner con collar offline', state: { kind: 'ok', pet: makePet({ device: makeDevice('offline') }) } },
        { detalle: 'owner con collar sin conectividad', state: { kind: 'ok', pet: makePet({ device: makeDevice(null) }) } },
        { detalle: 'family con collar offline', state: { kind: 'ok', pet: makePet({ myRole: 'family', device: makeDevice('offline') }) } },
        { detalle: 'family con collar sin conectividad', state: { kind: 'ok', pet: makePet({ myRole: 'family', device: makeDevice(null) }) } },
        { detalle: 'walker con collar offline', state: { kind: 'ok', pet: makePet({ myRole: 'walker', device: makeDevice('offline') }) } },
        { detalle: 'walker con collar sin conectividad', state: { kind: 'ok', pet: makePet({ myRole: 'walker', device: makeDevice(null) }) } },
        { detalle: 'vet con collar offline', state: { kind: 'ok', pet: makePet({ myRole: 'vet', device: makeDevice('offline') }) } },
        { detalle: 'vet con collar sin conectividad', state: { kind: 'ok', pet: makePet({ myRole: 'vet', device: makeDevice(null) }) } },
        { detalle: 'error', state: { kind: 'error' } },
        { detalle: 'unreachable', state: { kind: 'unreachable', message: 'offline' } },
        { detalle: 'missing-config', state: { kind: 'missing-config' } },
      ];

      it.each(DETAIL_STATES.flatMap((detail) => LIST_STATES.map((list) => ({ ...detail, ...list }))))(
        'no pinta el botón con el detalle $detalle aunque el listado diga $listRole $listCollar',
        async ({ state, listRole, listDevice }) => {
          mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: listRole, device: listDevice })] });
          noTrackingAfterDetail(state);
          await renderMap();
          await screen.findByTestId('map-no-tracking-title');
          expect(screen.getByTestId('map-no-tracking-body')).toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.');
          expect(screen.queryByTestId('map-no-tracking-action')).toBeNull();
        },
      );

      it.each(LIST_STATES)(
        'no pinta el botón mientras el detalle carga aunque el listado diga $listRole $listCollar',
        async ({ listRole, listDevice }) => {
          mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: listRole, device: listDevice })] });
          mockGetPet.mockReturnValue(pending<PetState>());
          mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' });
          await renderMap();
          await screen.findByTestId('map-no-tracking-title');
          expect(screen.getByTestId('map-no-tracking-body')).toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.');
          expect(screen.queryByTestId('map-no-tracking-action')).toBeNull();
        },
      );
    ```

    `makePet`, `makeDevice`, `pending`, `PetState`, `renderMap` y
    `noTrackingAfterDetail` ya existen en el fichero; no se importa ni se
    declara nada más. Ningún `it` existente cambia. Son 144 + 8 = 152 `it`
    nuevos.
  - **Mutación versionada** en `src/screens/map/index.tsx`. En `const canPairCollar =`,
    la línea `detail.data?.kind === 'ok' &&` no cambia, y las otras dos pasan a
    (M7 + M8 de requirements.md §Enmienda E3):

    ```tsx
        (detail.data.pet.myRole === 'owner' || Boolean(selectedPet?.device)) &&
        (detail.data.pet.device === null || selectedPet?.myRole !== 'owner');
    ```

  - Rojo esperado, midiendo solo `src/screens/map/index.test.tsx`:
    `Tests: 57 failed, 214 passed, 271 total`. Las 57, todas por aserción
    (`toBeNull`), todas del primer `it.each` (`no pinta el botón con el detalle …`):
    - detalle `owner con collar`, `owner con collar offline` y `owner con collar sin conectividad`
      × listado {family, walker, vet} × {sin collar, con collar}: 18;
    - detalle {family, walker, vet} `sin collar` × listado {owner, family, walker, vet} `con collar`: 12;
    - detalle {family, walker, vet} `con collar`, `con collar offline` y `con collar sin conectividad`
      × listado {family, walker, vet} `con collar`: 27.

    Las 8 filas de `mientras el detalle carga` quedan verdes. Cualquier otro
    `it` rojo, un rojo por consulta, o un `ReferenceError`/`TypeError`, es un
    error de medida: **para**.

- [ ] **(2) Commit verde** `fix(mobile-no-collar-states): #159 E3 revert list probe, no pair action whatever the list says`.
  - `git checkout 664b95a7 -- src/screens/map/index.tsx`, y después
    `git diff --quiet 664b95a7 -- src/screens/map/index.tsx; echo "exit=$?"` → `exit=0`.
  - Gate: `Tests: 271 passed, 271 total` en `src/screens/map/index.test.tsx`;
    `bun run typecheck` y `bunx expo lint --no-cache` con `exit=0`.

- [ ] **Sondas E3a-E3f**, sin commit, sobre el árbol verde, en `const canPairCollar =` de
  `src/screens/map/index.tsx`. Mide solo `src/screens/map/index.test.tsx`.
  Restaura cada sonda con `git checkout HEAD -- src/screens/map/index.tsx` y
  `git diff --quiet HEAD -- src/screens/map/index.tsx` más
  `git diff --cached --quiet` (`limpio=0`) antes de la siguiente. Todas las
  filas que caen lo hacen por aserción (`toBeNull`).

  | Sonda | Cambio | Esperado | Qué falla |
  |---|---|---|---|
  | E3a | M7: `detail.data.pet.myRole === 'owner' &&` pasa a `(detail.data.pet.myRole === 'owner' \|\| Boolean(selectedPet?.device)) &&` | `12 failed, 259 passed, 271 total` | detalle {family, walker, vet} `sin collar` × listado {owner, family, walker, vet} `con collar` |
  | E3b | M8: `detail.data.pet.device === null;` pasa a `(detail.data.pet.device === null \|\| selectedPet?.myRole !== 'owner');` | `18 failed, 253 passed, 271 total` | detalle `owner con collar` (las tres conectividades) × listado {family, walker, vet} × {sin, con collar} |
  | E3c | M9: `detail.data.pet.myRole === 'owner' &&` pasa a `(detail.data.pet.myRole === 'owner' \|\| (selectedPet?.myRole !== 'owner' && selectedPet?.myRole !== detail.data.pet.myRole)) &&` | `12 failed, 259 passed, 271 total` | detalle R `sin collar` (R ∈ {family, walker, vet}) × listado con los dos roles no-owner distintos de R × {sin, con collar} |
  | E3d | M12: el predicado entero (sus tres líneas) pasa a `detail.data?.kind === 'ok' ? detail.data.pet.myRole === 'owner' && detail.data.pet.device === null : Boolean(selectedPet?.device);` | `16 failed, 255 passed, 271 total` | detalle {`error`, `unreachable`, `missing-config`} × listado `con collar` (12) y `mientras el detalle carga` × listado `con collar` (4) |
  | E3e | N3: `detail.data.pet.device === null;` pasa a `deviceConnectionState(detail.data.pet.device) !== 'online';` | `16 failed, 255 passed, 271 total` | detalle `owner con collar offline` y `owner con collar sin conectividad` × los 8 listados |
  | E3f | N1: `detail.data.pet.device === null;` pasa a `(detail.data.pet.device === null \|\| (detail.data.pet.device.connectivity !== 'online' && selectedPet?.device === null));` | `8 failed, 263 passed, 271 total` | detalle `owner con collar offline` y `owner con collar sin conectividad` × listado {owner, family, walker, vet} `sin collar` |

  `deviceConnectionState` ya está importado en `src/screens/map/index.tsx`;
  E3e no añade import.

- [ ] **Cierre.**
  - El comando BASE de la ronda 1 (los 10 ficheros) → `Tests: 911 passed, 911 total`,
    con map en 271.
  - `bun run test` → `97 suites` y `2577 tests` (2425 + 152).
  - `bun run typecheck` y `bunx expo lint --no-cache` con `exit=0`.
  - Si la base de **Antes** no dio 119, estos recuentos se mueven con ella.

- [ ] **(3) Commit final** `docs(mobile-no-collar-states-pingo): #159 E3 traceability`.
  - En traceability.md, fila R4. Ancla (desde la raíz del repo):

    ```sh
    grep -cF 'E1: `no pinta el botón a %s aunque el listado diga owner`, sondas E1a-E1e' specs/mobile-no-collar-states-pingo/traceability.md
    ```

    → `1`. Justo después de ese texto, antes del `)` que lo cierra, se inserta:

    ```text
    ; E3: `no pinta el botón con el detalle $detalle aunque el listado diga $listRole $listCollar` (18 detalles × 8 listados), `no pinta el botón mientras el detalle carga aunque el listado diga $listRole $listCollar` (8 listados), sondas E3a-E3f
    ```

    Comprobación:

    ```sh
    grep -cF 'sondas E1a-E1e; E3: ' specs/mobile-no-collar-states-pingo/traceability.md
    ```

    → `1`.
  - Al final de la columna de commits de esa fila se añade
    `; E3: <hash rojo> <mensaje rojo> → <hash verde> <mensaje verde>`.
  - La lista cerrada de ficheros no cambia: E3 solo toca
    `src/screens/map/index.test.tsx` y deja `src/screens/map/index.tsx`
    idéntico a `664b95a7`.
