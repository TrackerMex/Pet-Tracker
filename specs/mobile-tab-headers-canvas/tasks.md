---
feature: "mobile-tab-headers-canvas"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Tareas — [[mobile-tab-headers-canvas]] (#168)

> Disciplina TDD: por cada bloque, (1) commit de test rojo que nombra los
> R-ids, (2) commit de implementación mínima en verde, (3) refactor con tests
> verdes (opcional, commit propio si cambia algo). **Nunca** test e
> implementación en el mismo commit (C4 de `CHECKPOINTS.md`).
> Rutas relativas a `mobile-pet-tracker/` salvo `specs/` y `docs/`.

## T0 — Arranque (sin commit)

- [ ] `git branch --show-current` da `feature/168-mobile-tab-headers-canvas`.
- [ ] #166 está en la base: `git merge-base --is-ancestor <commit de merge de #166> HEAD`
  (el leader da el hash en el handoff). Si no, **parar**.
- [ ] `test ! -e .expo/types/router.d.ts` (si existe, avisar; no borrarlo con
  `rm -f` desde el sandbox).
- [ ] Re-medir con los greps de requirements §1 y anotar en
  `progress/impl_mobile-tab-headers-canvas.md` la cifra medida de cada fila.
  Si alguna difiere de la de la tabla, los deltas de R12 se aplican sobre la
  medida (no sobre la tabla) y se anota.
- [ ] Anotar `H0` (hash de arranque) en el mismo fichero.
- [ ] Gestor de paquetes: `bun`/`bunx` (nunca `npm`/`npx`). Ninguna
  instalación: R12.4.

Convenciones para todos los tests nuevos o reescritos:

- `fireEvent` de RNTL 14 es asíncrono: siempre `await fireEvent.press(...)`.
- En jest, la ruta de Nutrición se escapa:
  `bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx'`. Sin escapar, el
  patrón es una regex y el fichero se salta con exit 0.
- Elementos repetidos (filas de vacuna, chips, filas de navegación): cada
  aserción va dentro de `within(<raíz del elemento>)` y se cuenta con
  `children.length`, no por `testID`.
- Dobles de prueba por intención (abajo se dice qué debe hacer cada uno);
  Codex verifica la forma contra el fichero destino y el `.d.ts` instalado.
- Ningún `it` aserta `className` ni props de `Button` (son de #166).
- Literales esperados escritos en el test, nunca importados de producción.

## Bloque A — Salud: R1 (Salud) + R2

R1 y R2 van juntos en Salud: el título sale de `health-states` y se vuelve
hijo del scroll en el mismo cambio que quita el hero, y los `it` de R2
asertan el nodo `health-title` que crea R1. Separarlos dejaría un verde
intermedio con el título encima del hero.

- [ ] (1) Rojo `test(mobile): Salud con título grande y sin hero (#168 R1, R2)`
  en `src/screens/health/index.test.tsx`:
  - `describe('#168 R1: Salud pinta el título grande en todas sus ramas')`:
    `it.each` con las seis ramas de requirements R1 (pendiente con promesa
    sin resolver, `error`, `unreachable`, `missing-config`, `ok` con `[]`,
    `ok` con mascotas). Cada fila: `getByTestId('health-title')` con
    `className` exacto `text-3xl font-black tracking-tight text-foreground` y
    texto `Salud`.
  - `describe('#168 R2: Salud sin hero y con métricas estándar')`:
    - con mascotas: hijos del contenedor del scroll exactamente
      `['health-title', 'health-content']`; `queryByTestId('pet-hero')` nulo;
    - `contentContainerStyle` igual a
      `{ padding: 24, gap: 16, paddingTop: <top> + 12, paddingBottom: <bottom> + 96 }`
      con los insets del doble existente; `health-content` con
      `style` igual a `{ gap: 16 }`;
    - el primer hijo de `health-content` contiene `pet-chip-<id>` de cada
      mascota de la fixture (`within(primerHijo)`);
    - `it.each` sin contenido (las cinco ramas sin contenido): hijos del scroll
      `['health-title', 'health-states']`; `health-states` con `style` igual a
      `{ gap: 16 }`; `within(health-states).queryByTestId('health-title')` nulo;
    - al `await fireEvent.press(getByTestId('pet-chip-<id2>'))` la lista de
      vacunas pasa a la de la segunda mascota (aserción sobre un nombre de
      vacuna que solo tiene ella).
  - Reescrituras en el mismo commit (ver §Reescrituras, filas H1–H8).
- [ ] (2) Verde `feat(mobile): Salud abre con el título grande (#168 R1, R2)`
  en `src/screens/health/index.tsx`.
- [ ] (3) Refactor.

## Bloque B — Salud: R3 (tiles de vacuna)

- [ ] (1) Rojo `test(mobile): tile pastel por estado en cada vacuna (#168 R3)`:
  - doble de `reicon-react-native` del fichero: añadir
    `Check: icon('health-icon-check')` y `Clock: icon('health-icon-clock')`
    (intención: cada icono es un `View` con `testID` propio y su `color` en
    `style`, como los tres que ya hay);
  - fixture de cuatro vacunas y reloj fijo de requirements R3 (fechas que
    cruzan mes);
  - `describe('#168 R3: cada vacuna lleva su tile pastel')`, un `it` por fila
    con `within(vaccine-row-<id>)`: `children.length` 2; primer hijo
    `vaccine-tile-<id>` con `className` exacto, `style` igual a
    `CONTINUOUS_CORNER` **escrito como literal** del valor que exporta
    `src/theme/native-styles.ts` (Codex lo lee y lo copia), un solo hijo con
    el `testID` del icono esperado y `style.color` igual a
    `'category-<slot>-strong'`; segundo hijo `vaccine-text-<id>` con
    `className` `flex-1 gap-1` y 3, 3, 3, 2 hijos; tile con
    `accessibilityElementsHidden` verdadero e
    `importantForAccessibility` `no-hide-descendants`.
- [ ] (2) Verde `feat(mobile): tiles pastel en las vacunas (#168 R3)`.
- [ ] (3) Refactor.

## Bloque C — Perfil: R1 (Perfil)

- [ ] (1) Rojo `test(mobile): Perfil con título grande (#168 R1)` en
  `src/screens/profile/index.test.tsx`: `it.each` con las seis ramas de
  requirements R1; `getByTestId('profile-title')` con `className` exacto y
  texto `Perfil`; es el primer hijo de su fila.
- [ ] (2) Verde `feat(mobile): título grande en Perfil (#168 R1)`.
- [ ] (3) Refactor.

## Bloque D — Perfil: R4 (tarjeta de mascota)

- [ ] (1) Rojo `test(mobile): Perfil pinta la tarjeta de mascota con avatar (#168 R4)`:
  - `describe('#168 R4: Perfil sustituye el hero por profile-pet-card')`:
    - hijos de `profile-pet-card` exactamente
      `['profile-pet-avatar', 'profile-pet-name', 'profile-pet-chips']`;
      `className` de la tarjeta `items-center gap-3`;
    - con foto: `profile-pet-avatar` con `source` igual a
      `{ uri: <photoUrl de la fixture>, cacheKey: <id> }` y `style` con
      `width`/`height` 96 y `borderRadius` 48;
    - sin foto (`photoUrl: null`): `profile-pet-avatar` sin `source`, con
      `width` y `height` 96 (R4.6);
    - el hermano siguiente a `profile-pet-card` es `change-photo`, y
      `within(profile-pet-card).queryByTestId('change-photo')` es nulo;
    - `queryByTestId('pet-hero')` nulo;
    - mientras el detalle carga, `profile-hero-skeleton` con `className`
      `h-52 w-full rounded-card`.
  - Reescrituras en el mismo commit (§Reescrituras, filas P1–P4).
  - **Ojo, orden**: la `it` de estructura aserta `profile-pet-chips` como
    tercer hijo; R4 lo crea (aunque R5 decide su contenido). La
    implementación de R4 renderiza `<PetPills>` con `testID="profile-pet-chips"`
    en su contenedor; R5 reescribe los chips.
- [ ] (2) Verde `feat(mobile): tarjeta de mascota en Perfil (#168 R4)`.
- [ ] (3) Refactor.

## Bloque E — Perfil: R5 (chips)

- [ ] (1) Rojo `test(mobile): chips pastel por dato (#168 R5)`:
  - fixture completa: `within(profile-pet-chips)`, `children.length` 4, orden
    de `testID` `sex, sterilized, age, weight`; `className` de cada chip y de
    su `Text`; textos literales de la fixture (sexo crudo, `Esterilizado`,
    `<n> meses`, `<kg> kg`);
  - fixture con `sex: null` y `sterilized: null`: `children.length` 2, orden
    `age, weight`, huecos `amber` y `violet` (el hueco viaja con el dato);
  - `className` del contenedor `flex-row flex-wrap justify-center gap-2`.
- [ ] (2) Verde `feat(mobile): chips pastel en Perfil (#168 R5)`.
- [ ] (3) Refactor.

## Bloque F — Perfil: R6 (tiles de navegación)

- [ ] (1) Rojo `test(mobile): tile pastel en las filas de navegación (#168 R6)`:
  - doble de `reicon-react-native` **nuevo** en este fichero (hoy usa el
    real). Intención: módulo real con `__esModule: true` explícito (el spread
    de `requireActual` lo pierde) y `FileText`, `Wifi`, `Map`, `Bell`
    sustituidos por `View` con `testID` `profile-icon-file-text`,
    `profile-icon-wifi`, `profile-icon-map`, `profile-icon-bell` y su `color`
    en `style`. El resto de iconos, reales. Verificar que los `it` de Perfil
    que ya existían siguen verdes con el doble antes de commitear el rojo.
  - un `it` por fila (`documents-link`, `pairing-link`, `geofences-link`,
    `reminders-link`) con `within(<fila>)`: `children.length` 3; primer hijo
    `<fila>-tile` con `className` exacto, `style` literal de
    `CONTINUOUS_CORNER`, icono y color `category-<slot>-strong`; segundo, la
    etiqueta con `flex-1`; tercero, el chevron; `className` de la fila
    `flex-row items-center gap-3 rounded-xl bg-default px-3 py-2`; y al
    `await fireEvent.press(<fila>)` el `router.push` del doble recibe el
    destino actual.
- [ ] (2) Verde `feat(mobile): tiles en las filas de Perfil (#168 R6)`.
- [ ] (3) Refactor.

## Bloque G — Perfil: R7 (iniciales)

- [ ] (1) Rojo `test(mobile): avatar de iniciales en la cuenta (#168 R7)`:
  `it.each` con las cinco filas de requirements R7; cada fila monta Perfil con
  `me` de esa fila y aserta `me-identity` (`children.length` 2 o 1), el texto
  de `me-avatar-initials` y que `me-identity-text` sigue conteniendo nombre y
  email.
- [ ] (2) Verde `feat(mobile): iniciales del usuario en Perfil (#168 R7)`.
- [ ] (3) Refactor.

## Bloque H — Nutrición: R1 (Nutrición)

- [ ] (1) Rojo `test(mobile): Nutrición con título grande (#168 R1)` en
  `src/app/(tabs)/__tests__/food.test.tsx`: `it.each` con las seis ramas de
  requirements R1, `getByTestId('food-title')` con `className` exacto y texto
  `Nutrición`. Reescritura F1 en el mismo commit.
- [ ] (2) Verde `feat(mobile): título grande en Nutrición (#168 R1)`.
- [ ] (3) Refactor.

## Bloque I — Nutrición: R8 (estructura del anillo)

- [ ] (1) Rojo `test(mobile): el anillo sustituye a la barra (#168 R8)`:
  - doble de `react-native-svg` según design D6 (Svg y Circle como `View`
    con todas sus props; `__esModule: true` si esparce `requireActual`);
  - `describe('#168 R8: food-plan-card pinta el anillo')`:
    - hijos de `food-plan-card` exactamente `['food-plan-summary']`; de
      `food-plan-summary`, `['food-plan-progress', <columna>]`; la columna
      contiene `food-plan-kcal` y `food-plan-grams`;
    - `queryByTestId` nulo para `food-plan-track`, `food-plan-fill` y
      `food-icon-fork-knife`;
    - `food-plan-progress`: `className` exacto e hijos
      `['food-plan-ring', 'food-plan-percent', 'food-plan-consumed']`;
    - **props exhaustivas** de los nodos no-texto: el host de
      `food-plan-ring-track` tiene exactamente las props
      `{ testID, cx: 52, cy: 52, r: 44, fill: 'none', stroke: 'accent-foreground', strokeOpacity: 0.2, strokeWidth: 12 }`
      (más `children` si el doble lo añade, y nada más); el de
      `food-plan-ring-fill`, las de requirements R8.4 con
      `strokeDasharray` `toBeCloseTo(276.46, 2)` y `transform`
      `'rotate(-90 52 52)'`; `food-plan-ring` con `className`
      `absolute inset-0` y sin `style`;
    - `food-plan-percent` y `food-plan-consumed` con `className` exacto y
      `style` igual a `TABULAR_NUMS` escrito literal.
  - Reescrituras F2–F4 en el mismo commit.
- [ ] (2) Verde `feat(mobile): anillo de kcal en Nutrición (#168 R8)`.
  Fuera `ForkKnife` del import; `'accent-strong'` sustituido por
  `'accent-foreground'` en `useThemeColors`.
- [ ] (3) Refactor.

## Bloque J — Nutrición: R9 (progreso del anillo)

- [ ] (1) Rojo `test(mobile): el anillo dice el porcentaje acotado (#168 R9)`:
  `it.each` con las ocho filas de requirements R9; cada fila aserta el texto
  de `food-plan-percent` y, sobre `food-plan-ring-fill`,
  `Object.keys(host.props.jestAnimatedProps.value)` igual a
  `['strokeDashoffset']` y el valor con `toBeCloseTo(<literal>, 2)`. Si
  `jestAnimatedProps` no llega al host, **parar** y reportar (design D6).
  Antes de commitear el rojo, cruzar la tabla con los `it` de R8: la fila
  `656/0` (desfase 276.46) puede nacer verde si R8 ya inicializa el anillo
  vacío; anotar en el commit qué filas nacen verdes y por qué.
- [ ] (2) Verde `feat(mobile): progreso del anillo (#168 R9)`.
- [ ] (3) Refactor.

## Bloque K — Nutrición: R10 (transición y reduce motion)

- [ ] (1) Rojo `test(mobile): el anillo transiciona con reduce motion (#168 R10)`:
  - `it` de transición (reemplaza al de #113 R4, F3): con `merKcal` 1420
    monta a 710 (`expectKcalBarTiming(50)` y desfase 138.23), servir sube a
    1420 (`expectKcalBarTiming(100)` y desfase 0), deshacer baja a 710
    (`expectKcalBarTiming(50)` y desfase 138.23). Esperas: las de
    `docs/conventions.md` §Esperas (nada de esperar al contador del mock);
  - `it` de reduce motion, separado: la configuración de la llamada a
    `withTiming` con valor 50 lleva `reduceMotion: ReduceMotion.System`;
  - `it` de acotado: con 656/984 la llamada a `withTiming` recibe 100, no 150.
- [ ] (2) Verde `feat(mobile): transición del anillo (#168 R10)`.
- [ ] (3) Refactor.

## Bloque L — R11 (enmienda #168)

- [ ] (1) Rojo `test(harness): las specs enmendadas por #168 llevan su bloque (#168 R11)`
  en `src/__tests__/hero-header-amendments.test.ts`:
  - constantes propias: `AMENDED_DOCS_168` (las cuatro filas de requirements
    R11.2, con `file`, `feature`, `change`, `marker` copiados literales),
    `SIGNATURE_LINE_168 = '- [ ] Enmienda #168 aprobada por humano'`,
    y `canonicalAmendment168` que lee el fence de
    `specs/mobile-tab-headers-canvas/design.md` §2 con la misma técnica que
    `canonicalAmendment`;
  - `describe('#168 R11: las specs enmendadas por #168 llevan su bloque')`
    con tres `it`: bloque literal en los cuatro documentos
    (`toHaveLength(4)`), línea de firma `[ ]` o `[X]`, marcador con espacios
    colapsados.
  - **Los tres `it` de `R10: las specs enmendadas por #67 llevan su bloque`
    no cambian**: ni `AMENDED_DOCS`, ni `SIGNATURE_LINE`, ni
    `canonicalAmendment`. #168 no retira ni cambia ningún bloque, línea de
    firma ni marcador de #67 (requirements R11.4). Comprobarlo con
    `git diff <H0> -- src/__tests__/hero-header-amendments.test.ts`: solo
    líneas añadidas.
- [ ] (2) Verde `docs(specs): enmienda #168 en specs y carta (#168 R11)`:
  insertar bloque y marcador en los cuatro documentos (design §2). En
  `docs/ui-guidelines.md`, **solo añadir al final**, tras la última sección
  `## Enmienda` que exista (la de #152 en la base, o la que #166 haya dejado
  después). Ancla por contenido, nunca por línea ni por número de punto.
  Comprobar después:
  - `grep -cF '## Enmienda #168 — título grande en Salud, Nutrición y Perfil' docs/ui-guidelines.md` da 1;
  - `git diff <H0> -- docs/ui-guidelines.md` solo tiene líneas añadidas;
  - el `it` `#153 E1` de `src/screens/welcome/index.test.tsx` sigue verde
    (corta la sección #152 hasta el siguiente `\n## `; el bloque nuevo no
    nombra `WELCOME_ENTRANCE_MS`).
- [ ] (3) Refactor.

## Bloque M — R12 (candados globales) y R1.3

- [ ] (1) `test(mobile): candados globales de #168 (#168 R1, R12)` (nace verde, ver sondas):
  - fichero nuevo `src/__tests__/tab-headers-canvas.test.ts` con
    `describe('#168 R1: el título grande vive en las tres pestañas')`
    (ocurrencias del literal por fichero 1, 1, 1; lista de ficheros de
    producción de `src/` que lo contienen, exactamente los tres) y
    `describe('#168 R12: alcance cerrado')` (R12.2: ficheros de producción con
    `<PetHeroHeader`, exactamente `screens/home/index.tsx`; R12.3: en los tres
    ficheros de pantalla y sus tres tests, cero `[` dentro de un `className`
    literal, cero `#` hex de 3/6/8 dígitos, cero `StyleSheet`, cero
    `text-accent` sin sufijo). Mismo andamiaje de lectura que
    `consistency-classnames.test.ts` (`sourceFiles`, `readSource`).
  - Este bloque va **al final** y sus `it` nacen verdes (A–K ya dejaron el
    árbol como piden). Para que el candado no sea tautológico, antes del
    commit se corren estas sondas, una a una, y cada una debe dar rojo en el
    `it` indicado; se revierte con `git checkout HEAD -- <fichero>` y se
    comprueba `git diff --cached --quiet` y `git diff --quiet` antes de la
    siguiente. El commit anota la tabla con el resultado de cada sonda:

    | Sonda (mutación temporal) | `it` que debe ponerse rojo |
    |---|---|
    | Duplicar el `Text` de `health-title` en `src/screens/health/index.tsx` | R1: ocurrencias por fichero |
    | Quitar `food-title` de `src/app/(tabs)/food.tsx` | R1: ocurrencias por fichero |
    | Copiar el literal del título a `src/screens/home/index.tsx` | R1: lista de ficheros |
    | Montar `<PetHeroHeader` en `src/screens/profile/index.tsx` | R12.2 |
    | Añadir `className="w-[10px]"` a un nodo de Perfil | R12.3 corchetes |
    | Añadir `color: '#fff'` a un `style` de Salud | R12.3 hex |
    | Añadir `text-accent` suelto a un `Text` de Nutrición | R12.3 `text-accent` |
    | Importar `StyleSheet` en `src/screens/profile/index.test.tsx` | R12.3 `StyleSheet` |

- [ ] (1b) En `src/__tests__/consistency-classnames.test.ts`, en el commit
  rojo de cada bloque que mueve la cifra (B, F, I, E), el delta de R12.1 y
  R12.1b correspondiente, con su sumando comentado:
  - B: Salud `+ 1` en la fila de Salud y la suma de `#62 R14`, y en el total
    `count(/style=\{CONTINUOUS_CORNER\}/g)` de `#98 R10`;
  - E: `bg-accent-soft` `- 1` en los dos recuentos globales (R12.1b);
  - F: Perfil `+ 4` en su fila y la suma de `#62 R14`, y en el total de
    `#98 R10`;
  - I: Nutrición `- 1` en su fila y la suma de `#62 R14`, `food.match(...)`
    de `toHaveLength(2)` a `toHaveLength(1)` y `- 1` en el total de `#98 R10`;
  - al final del bloque I, la suma de `#62 R14` lleva `+ 1 - 1 + 4 // #168 R3, R8, R6`
    y el total de `#98 R10`, `+ 4 // #168` (forma final de requirements R12.1;
    los sumandos intermedios se reescriben a esa forma en I);
  - cualquier otro recuento que muestre el
    `grep -rn 'CONTINUOUS_CORNER' src/__tests__` de T0 se mueve en el bloque
    del fichero que cambia.
  El candado movido va en el mismo commit rojo que el `it` de su bloque.
- [ ] (2) Verde: cada delta se pone verde con el verde de su bloque.
- [ ] (3) Refactor.

## Bloque N — R13 (gate humano)

- [ ] El leader pide al humano el smoke S1–S10 en **dev build de Android**.
  Codex no lo corre ni lo marca.

## Reescrituras de tests existentes (dónde y cómo)

Cada fila se aplica en el commit rojo del bloque indicado. «Borrar» significa
que la conducta deja de existir por decisión N1 y la cubre un `it` nuevo de
#168; nunca se borra un `it` cuya conducta siga viva.

| Id | Fichero | `describe` › `it` | Acción | Bloque |
|---|---|---|---|---|
| H1 | `H` | `#115 R2: Salud abre con el hero a sangre (A9)` › `con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden` | Borrar; la cubre `#168 R2` (hijos `health-title`, `health-content`) | A |
| H2 | `H` | ídem › `saca el padding horizontal a health-content y deja gap y paddingBottom en el scroll` | Borrar; la cubre `#168 R2` (métricas estándar) | A |
| H3 | `H` | ídem › `con contenido no pinta el título Salud` | Borrar; la contradice R1.1 | A |
| H4 | `H` | ídem › `sin contenido ($name), agrupa título y rama en health-states sin hero` (`it.each`) | Borrar; la cubren `#168 R1` y `#168 R2` (sin contenido) | A |
| H5 | `H` | `#115 R3: el hero muestra la mascota seleccionada de la lista` › `pinta nombre, raza y media de la mascota sin estado ni dato destacado` | Borrar; Salud ya no pinta la mascota en grande (N1) | A |
| H6 | `H` | ídem › `pone el PetSwitcher en el slot del hero` | Borrar; la cubre `#168 R2` (primer hijo de `health-content`) | A |
| H7 | `H` | ídem › `cambia el hero al pulsar otra mascota` | Borrar; la cubre `#168 R2` (cambio de vacunas al pulsar otro chip) | A |
| H8 | `H` | `#155 R4: Salud sin mascotas presenta a Pingo` › `queda en el sitio del vacío que sustituye` | Reescribir: `slot.parent` sigue siendo `health-states`; sus hijos pasan de `['Text', 'health-empty']` a `['health-empty']` | A |
| P1 | `P` | `R6: Profile usa el hero compartido` (los cuatro `it`) | Borrar el `describe`; lo cubre `#168 R4` (tarjeta, foto, `change-photo` debajo, sin `pet-hero`) | D |
| P2 | `P` | `renders the active pet hero, switcher, pills and information rows` | Reescribir solo la línea que aserta `pet-hero-media` visible: pasa a `profile-pet-avatar` | D |
| P3 | `P` | `keeps the old photo and shows an error when upload fails` | Reescribir la aserción de `pet-hero-media` a `profile-pet-avatar` con `source` **objeto** `{ uri: 'http://example.test/old.jpg', cacheKey: 'pet-1' }` | D |
| P4 | `P` | `#87 R16: ProfileScreen lee por TanStack Query` › `deja cuenta, mascotas y detalle en sus claves canónicas` | Reescribir `findByTestId('pet-hero')` a `findByTestId('profile-pet-card')` | D |
| F1 | `F` | `#155 R4: Comida sin mascotas presenta a Pingo` › `queda en el sitio del vacío que sustituye` | Reescribir: hijos de `['Text', 'food-empty']` a `['food-title', 'food-empty']` | H |
| F2 | `F` | `#113 R2: …` › `compone la tarjeta: fila intacta y bloque de progreso debajo` | Borrar; lo cubre `#168 R8` | I |
| F3 | `F` | `#113 R2: …` › `con merKcal $merKcal y kcalConsumedToday $kcal pinta $consumed y $percent` (`it.each`) | Reescribir: conserva filas y aserciones de `food-plan-consumed` y `food-plan-percent`; quita la de ancho de `food-plan-fill` (el desfase lo candea `#168 R9`) | I |
| F4 | `F` | `#113 R7: los nodos no-texto de la barra no llevan más estilo que el ancho …` (`it.each`) | Borrar el `describe`; lo cubre el `it` de props exhaustivas de `#168 R8` | I |
| F5 | `F` | `#113 R4: el relleno transiciona su ancho …` › `anima a 50, sube a 100 al servir y baja a 50 al deshacer con 250 ms y ease-in-out` | Borrar; lo cubre `#168 R10` (mismo recorrido sobre el anillo) | K |
| F6 | `F` | `#113 R2: …` › `no pinta el bloque sin plan` | Conservar; si consulta `food-plan-track` o `food-plan-fill`, cambiar a `food-plan-ring` | I |

No se tocan: `#113 R1`, `#113 R3` (semántica accesible), `#113 R5`
(`usa h-40 con el radio de card`), ni `expone los tres títulos de Food sin
perder sus dos aserciones de copy`.

Un `describe` que se queda sin `it` (H1–H4 dejan vacío `#115 R2`; H5–H7,
`#115 R3`; F4, `#113 R7`; F5, `#113 R4` si no le queda otro) se borra entero.
El histórico queda en el `traceability.md` de cada spec de origen, que no se
edita; el marcador B1/B2/B3 de R11 dice que esos requisitos los enmienda #168.
