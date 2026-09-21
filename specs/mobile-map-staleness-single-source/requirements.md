---
feature: "mobile-map-staleness-single-source"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, mobile, ui]
---

# Requisitos — [[mobile-map-staleness-single-source]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[tasks]] para el orden TDD.
> Trabajo de UI móvil: se valida además contra `docs/ui-guidelines.md` (C8 de
> `CHECKPOINTS.md`).
>
> **Los R-id de este fichero se escriben prefijados `#94 R<n>` en los títulos de
> test**, porque los tres ficheros de test que toca ya acumulan R-ids de otras
> specs (`docs/conventions.md` §Prefijo de feature cuando un fichero acumula
> R-ids de dos specs).

## Contexto verificado (commit `914905b8`)

Hechos comprobados contra el árbol antes de redactar. Si alguno deja de ser
cierto, esta spec caduca y vuelve al gate.

1. `GET /v1/pets` **no** devuelve `device`:
   `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts:86`
   pasa `null` en la posición de `device` a `toPetProfileResponse`. Solo el
   detalle lo rellena, en `:108`, con `toDeviceStatusResponse(device, now)`.
2. `mobile-pet-tracker/src/app/(tabs)/map.tsx` consume hoy `listPets`
   (`petKeys.list()`), no el detalle: su `selectedPet` sale de la lista, así que
   **hoy el Mapa no tiene `device.connectivity` a mano**. Son 4 `useQuery` más
   un poll de 15 s (`POLL_MS`, `map.tsx:77`).
3. El backend deriva `connectivity` de `device.lastMessageAt` contra
   `DEVICE_ONLINE_THRESHOLD_MS = 2 * 60_000`
   (`backend-pet-tracker/src/pipeline/constants.ts:28`,
   `src/modules/devices/domain/connectivity.ts:15`). El comentario de
   `constants.ts:22` ya declara por escrito que ese número "coincide con
   `STALE_SECONDS = 120` del mapa móvil".
4. **`staleSeconds` y `connectivity` no miden lo mismo.** `staleSeconds` es la
   antigüedad de la última POSICIÓN
   (`backend-pet-tracker/src/modules/positions/domain/stale-seconds.ts:9`);
   `connectivity` es la antigüedad del último MENSAJE del collar. Un collar
   puede mandar heartbeat sin fix GPS: **online con posición vieja**. Este hecho
   es el eje de la decisión D1 de [[design]], no un detalle.
5. Ya existen y se reutilizan `deviceConnectionState()` (`:29`) y
   `connectivityLabelKey()` (`:18`) en
   `mobile-pet-tracker/src/utils/device-connectivity.ts`, con su test en
   `src/utils/device-connectivity.test.ts` (8 tests verdes). La Home consume el
   primero en `src/screens/home/index.tsx:244`.
6. Las claves i18n que esta feature necesita **ya existen en los dos idiomas**:
   `map.live` / `map.stale` / `map.noSignal` (`src/i18n/catalog.ts:95-97` y
   `:405-407`) y `pairing.connection` (`:288` = "Connection", `:598` =
   "Conexión"). **Delta de catálogo cero**: esta feature no añade ninguna clave
   ni toca `src/i18n/catalog.ts` ni
   `src/providers/__tests__/language-provider.test.tsx`.
7. `STALE_SECONDS` en `map.tsx:76` es la **única** constante de umbral de
   frescura en todo `mobile-pet-tracker/src/` (grep verificado; los demás `120`
   del árbol son `maxLength`, anchos y alturas).
8. Baseline medido en este worktree, **sin pipe**:
   `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/map.test.tsx'` →
   **49 tests, 1 suite, verde**;
   `src/utils/device-connectivity.test.ts` → **8 tests, verde**;
   los tres ficheros juntos con `src/__tests__/design-drift.test.ts` → **94
   tests, 3 suites, verde**.

## Requisitos funcionales

- **R1**: WHEN un consumidor resuelve la etiqueta del tile de estado del Mapa,
  THE SYSTEM SHALL ofrecerla desde
  `mobile-pet-tracker/src/utils/device-connectivity.ts` como
  `MAP_CONNECTION_LABEL_KEY: Record<DeviceConnectionState, TranslationKey>`,
  cuyo **único** argumento es el `DeviceConnectionState` que devuelve
  `deviceConnectionState(device)`, con este reparto exhaustivo y ningún otro:
  `online → 'map.live'`, `offline → 'map.stale'`, `none → 'map.noSignal'`,
  `unknown → 'map.noSignal'`.
  *Test*: `mobile-pet-tracker/src/utils/device-connectivity.test.ts`,
  `describe('#94 R1: ...')`.

- **R2**: WHEN la pantalla del Mapa tiene una mascota seleccionada y la query
  `petKeys.detail(selectedPetId)` ha resuelto con `kind: 'ok'`, THE SYSTEM SHALL
  pintar en el nodo `testID="stat-gps"` el texto
  `t(MAP_CONNECTION_LABEL_KEY[deviceConnectionState(pet.device)])`, sin leer
  `position.staleSeconds` para esa decisión.
  *Test*: `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`,
  `describe('#94 R2: ...')` — cuatro casos, uno por estado del collar, todos con
  el **mismo** `staleSeconds` fijo, para demostrar que la antigüedad ya no mueve
  el badge.

- **R3**: IF la query del detalle no ha resuelto todavía, o resolvió con un
  `kind` distinto de `'ok'`, THEN THE SYSTEM SHALL pintar `'—'` en
  `testID="stat-gps"`: el mismo guion que la pantalla ya usa para una métrica
  ausente (`fmtKm`/`fmtSpeed`, `map.tsx:53-59`) y que
  `src/screens/pairing/index.tsx:442` usa para una conectividad desconocida.
  *Test*: `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`,
  `describe('#94 R3: ...')` — dos casos: detalle pendiente y detalle `'error'`.

- **R4**: WHILE haya una posición disponible, THE SYSTEM SHALL seguir pintando
  en `testID="stat-updated"` el resultado de `fmtAgo(position.staleSeconds, t)`
  con independencia del valor de `stat-gps`; y WHEN el collar está `online` con
  una posición de 121 s, THE SYSTEM SHALL mostrar a la vez `'En vivo'` en
  `stat-gps` y `'hace 2 min'` en `stat-updated`.
  *Test*: `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`,
  `describe('#94 R4: ...')`; el caso de 121 s es el delta declarado de `:581`.

- **R5** *(requisito de verificación — ver §Requisito de verificación)*: WHEN
  corre la suite móvil, THE SYSTEM SHALL fallar si algún fuente de producción
  bajo `mobile-pet-tracker/src/` (excluyendo `__tests__/` y los `*.test.*`
  colocados) declara un identificador `STALE_SECONDS`, o compara `staleSeconds`
  con cualquier operando mediante `<`, `<=`, `>` o `>=` en cualquiera de los dos
  órdenes.
  *Test*: `mobile-pet-tracker/src/__tests__/design-drift.test.ts`,
  `describe('#94 R5: ...')`, reutilizando el helper `filesMatching` que ese
  fichero ya tiene en `:55-59`.

- **R6**: WHEN el tile de estado de conexión del Mapa se rotula, THE SYSTEM
  SHALL usar `t('pairing.connection')` en lugar de `t('map.gps')`, de modo que
  el Mapa y la fila `device-connectivity` de Pairing
  (`src/screens/pairing/index.tsx:440`) nombren el mismo dato con la misma
  palabra sin añadir ninguna clave al catálogo.
  *Test*: `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`,
  `describe('#94 R6: ...')`, más el delta declarado de `:1172`.
  **Sujeto a la firma de D2 en [[design]]**: si el humano rechaza D2, R6 se
  retira, `:1172` se conserva sin cambio y ningún otro requisito se mueve.

- **R7**: WHILE la pantalla del Mapa tiene foco, hay mascota seleccionada y
  `last.data.kind !== 'no-tracking'`, THE SYSTEM SHALL refrescar
  `petKeys.detail(selectedPetId)` en el mismo intervalo `POLL_MS` (15 s) del
  `useFocusEffect` de `map.tsx:140-158` que ya refresca la última posición y las
  posiciones, de modo que el badge no se congele mientras el usuario mira el
  mapa.
  *Test*: `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`,
  `describe('#94 R7: ...')`, con temporizadores falsos, siguiendo el patrón que
  el propio fichero ya usa en `describe('R9: polling con foco')` (`:682`).

- **R8** *(gate humano, no delegable a ninguna IA)*: WHEN el humano corre la
  prueba de humo en un **dev build de Android** —nunca Expo Go: `expo-maps` no
  existe en Expo Go (`docs/ui-guidelines.md` §Animación)— con el poller de
  posiciones parado, THE SYSTEM SHALL mostrar para la misma mascota el mismo
  estado de conexión en la píldora del hero de la Home y en el tile de estado
  del Mapa, y cambiarlo en las dos pantallas a la vez.
  *Cierre*: casilla firmada por el humano en §Aprobación. No lo cierra ningún
  test. Guion detallado en [[tasks]] §R8.

## Requisito de verificación (C4, tercer punto)

**R5 es un requisito de verificación**: solo asevera una propiedad de un
artefacto que R2 ya dejó en el árbol (la desaparición de `STALE_SECONDS`). Se
declara aquí **antes del handoff** y se elige la **vía (b)**: su cierre se
prueba por **mutación de producción**, versionada en el commit rojo y revertida
en el verde (C4, quinto punto — mutar un doble de test no vale).

La mutación se planta en **dos sitios**, no en uno, porque un candado de grep
puede estar mirando solo donde nació:

1. `mobile-pet-tracker/src/app/(tabs)/map.tsx` — reintroducir
   `const STALE_SECONDS = 120;` y una comparación
   `position.staleSeconds <= STALE_SECONDS`.
2. `mobile-pet-tracker/src/utils/device-connectivity.ts` — reintroducir **solo**
   `const STALE_SECONDS = 120;`, en un fichero que el candado no tiene por qué
   estar mirando.

En ambos casos el rojo debe salir **por la aserción de `#94 R5`**, no por un
`ReferenceError` ni por el rojo de otro test. La evidencia (las dos salidas
rojas y el `git diff` vacío tras revertir) se escribe en
`progress/impl_mobile-map-staleness-single-source.md`.

## Criterios de aceptación (C8 — carta de UI)

- **Grep-clean sin regresión**: cero hex fuera de `src/theme/`, cero clases
  arbitrarias `[...]`, cero `StyleSheet.create`, cero shadow/elevation legacy.
  Ya lo vigilan `src/__tests__/design-drift.test.ts` y
  `src/__tests__/consistency-classnames.test.ts`: los dos deben seguir verdes.
- **Dimensiones de pantalla**: esta feature **no** toca la geometría del
  overlay. Los `insets.top + 12` (`map.tsx:266`) e `insets.bottom + 96`
  (`map.tsx:283`) de `docs/conventions.md` §Dimensiones se conservan, y las dos
  aserciones `bottom: 120` que los fijan (`map.test.tsx:576` y `:1178`)
  **no se tocan**. Cuidado con la segunda: vive dentro del caso
  `'conserva los cuatro tiles…'` (`:1156`), cuya **etiqueta** sí cambia por R6
  en `:1172` — se edita esa línea y ninguna otra del caso.
- **Componentes compartidos**: se conservan el `Card` de
  `src/components/card.tsx` y el `PetMap` de `src/components/pet-map.tsx`. No se
  crea ningún componente nuevo ni se forkea ninguno.
- **Radios y tipografía del tile**: `rounded-xl` + `CONTINUOUS_CORNER` del tile,
  y la ausencia de `tabular-nums` en `stat-gps` que fija `#62 R15`
  (`map.test.tsx:1211-1232`), se conservan **sin editar ese test**.
- **Estados de carga**: el `Skeleton` de pantalla completa (`map.tsx:202`) no
  cambia; R3 resuelve la ausencia del detalle con el guion, no con un Spinner.
- **Cero dependencias nuevas**: `mobile-pet-tracker/package.json` no se toca.
- **Delta de i18n cero**: no se añade ninguna clave, y no se tocan
  `src/i18n/catalog.ts` ni `src/providers/__tests__/language-provider.test.tsx`
  (los lleva #98 en paralelo y su candado de longitud de catálogo es suyo).

## Ficheros que esta feature NO toca

Están en manos de #98 y cualquier edición sobre ellos invalida esta spec:
`mobile-pet-tracker/src/screens/home/index.tsx`,
`.../src/screens/home/index.test.tsx`, `.../src/app/(tabs)/food.tsx`,
`.../src/api/types.ts`, `.../src/api/nutrition.ts`, `.../src/i18n/catalog.ts`,
`.../src/providers/__tests__/language-provider.test.tsx`, y
`docs/ui-guidelines.md`.

El criterio "el badge del Mapa y la píldora del hero nunca discrepan" se cierra
con R1 sobre la **función compartida**, no editando el test de la Home: ver
[[design]] §D4.

## Fuera de alcance

- **Migrar `map.tsx` a `src/screens/`.** Decisión ya cerrada por el leader: la
  convención #39 (route delgado + pantalla en `src/screens/`,
  `docs/ui-guidelines.md` §Decisiones fijas 8) **sigue pendiente para esta
  pantalla** y no se salda aquí; #95 ya mueve pantallas y es la feature que le
  corresponde. Queda constancia en [[design]] §D5.
- **Cambiar el umbral de 120 s** (`DEVICE_ONLINE_THRESHOLD_MS`). El número lo
  firmó el humano en #73 (enmienda E1, commit `0a76562b`) y esta feature no lo
  re-litiga: cambia **quién lo aplica**, no cuánto vale.
- **Tocar el backend.** Ni la API ni sus contratos cambian. Ningún fichero bajo
  `backend-pet-tracker/` se edita.
- **Traducir los valores crudos de enum** (`pet.sex`, `document.type`, …): sigue
  siendo feature propia (`docs/ui-guidelines.md` §Dirección de arte 6).
- **Unificar la copy de la píldora de la Home con la del badge del Mapa.** La
  Home usa `home.free|unknown|offline|online` y el Mapa
  `map.noSignal|stale|live`: son palabras distintas para el mismo estado, y
  fusionarlas pide claves nuevas o editar `src/screens/home/index.tsx`, ambas
  prohibidas aquí. Lo que esta feature garantiza es que **el estado** es uno
  solo, no que el texto sea idéntico (ver [[design]] §D4).
- **Añadir un cuarto estado visible** del tipo "collar online sin fix GPS",
  distinto de los tres actuales. Si el humano lo quiere, es copy nueva y va a
  feature propia.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-21) ← gate obligatorio antes de implementar

El humano firma a la vez las tres decisiones abiertas de [[design]] §Decisiones
abiertas: **D1** (qué fuente manda), **D2** (rótulo del tile) y **D3**
(consecuencia visible aceptada). Si D2 se rechaza, R6 se retira de esta spec y
el resto no cambia.

---

## Enmienda E1 — el candado de copy de #65 (`ui-language.test.ts`)

> Escrita el 2026-09-21 **sobre la spec ya aprobada**. No modifica ningún
> requisito aprobado ni ninguna decisión firmada (D1, D2 y D3 siguen tal cual):
> añade **R9** y precisa la *forma* en que R1, R2 y R6 se escriben, porque tal
> como estaban redactados dejan **rojo** un candado que la spec no mencionaba.
> Su casilla de firma va **sin marcar**: el humano reabre el gate solo para esta
> enmienda.

- Spec enmendada: `specs/mobile-map-staleness-single-source/`
- Qué cambia: se añade **R9**; R1 y R2 pasan a usar la forma `{ labelKey }`; se
  amplían §Ficheros que esta feature NO toca (no cambia) y el baseline del
  §Contexto verificado 8, que medía 3 suites y debía medir 5.
- Qué NO cambia: R3, R4, R5, R6, R7, R8, las decisiones D1-D7, el delta de i18n
  (sigue en **cero**) ni el estado de aprobación del resto de la spec.

### El hecho que la spec no vio

`mobile-pet-tracker/src/__tests__/ui-language.test.ts` es un candado de #65.
Su `checkUses()` (`:38-63`) lee el fichero fuente de cada fila de
`src/__tests__/ui-copy-table.ts` y **cuenta las ocurrencias exactas** de dos
formas, y **solo** de esas dos:

```
t('<clave>')          →  new RegExp(`\\bt\\(\\s*['"]<clave>['"]`, 'g')
labelKey: '<clave>'   →  new RegExp(`\\blabelKey:\\s*['"]<clave>['"]`, 'g')
```

Una clave que deja de aparecer en su fichero deja la fila esperando 1 y
encontrando 0: **rojo**. `R4_MAP` (`ui-copy-table.ts:99-120`) tiene **20 filas**
para `src/app/(tabs)/map.tsx`, y `ui-language.test.ts:126` fija
`expect(R4_MAP).toHaveLength(20)`. Cuatro de esas filas son las que esta feature
mueve: `map.noSignal` (`:103`), `map.live` (`:104`), `map.stale` (`:105`) y
`map.gps` (`:119`).

**Un segundo candado, que el aviso no nombraba y aquí queda cerrado**:
`ui-language.test.ts:437-448` (`#65 R18`) deriva `SCREEN_FILES` de `ALL_USES` y
fija `expect(SCREEN_FILES).toHaveLength(19 + 2 + 1)` — **22 ficheros distintos**.
Registrar un fichero nuevo en la tabla lo pondría rojo. **No pasa**:
`src/utils/device-connectivity.ts` ya está registrado (`ui-copy-table.ts:375-377`,
dentro de `R10_PAIRING`), así que el recuento de ficheros **no se mueve** y esa
línea **no se toca**. Queda escrito para que nadie la ajuste por reflejo.

### Consecuencia sobre R1 y R2: la tabla se escribe con `{ labelKey }`

`MAP_CONNECTION_LABEL_KEY` tal como la redactó R1 —
`Record<DeviceConnectionState, TranslationKey>`, con valores sueltos del tipo
`online: 'map.live'` — **no la ve ninguna de las dos formas** que `checkUses`
reconoce. Las tres claves quedarían sin sitio donde contarse: fuera de
`map.tsx` porque ya no se usan ahí, y fuera de `device-connectivity.ts` porque
esa forma es invisible al candado.

**R1 y R2 se precisan así** (la conducta no cambia; cambia la forma):

| | Redacción aprobada | Redacción de E1 |
|---|---|---|
| Tipo de la tabla (R1) | `Record<DeviceConnectionState, TranslationKey>` | `Record<DeviceConnectionState, { labelKey: TranslationKey }>` |
| Reparto (R1) | `online → 'map.live'`, … | `online → { labelKey: 'map.live' }`, `offline → { labelKey: 'map.stale' }`, `none → { labelKey: 'map.noSignal' }`, `unknown → { labelKey: 'map.noSignal' }` |
| Expresión del badge (R2) | `t(MAP_CONNECTION_LABEL_KEY[deviceConnectionState(pet.device)])` | `t(MAP_CONNECTION_LABEL_KEY[deviceConnectionState(pet.device)].labelKey)` |
| Aserciones de R1 | `MAP_CONNECTION_LABEL_KEY[deviceConnectionState(makeDevice('online'))]` → `'map.live'` | `…[deviceConnectionState(makeDevice('online'))].labelKey` → `'map.live'`, y así las cinco |
| Exhaustividad de R1 | `Object.keys(...).sort()` → `['none','offline','online','unknown']` | **sin cambio** |

No es una forma inventada: es **exactamente** la que
`DEVICE_CONNECTIVITY_META` ya usa tres líneas más arriba, en ese mismo fichero
(`src/utils/device-connectivity.ts:6-12`). La tabla nueva queda al lado de la
vieja y con la misma anatomía.

### R9 — nuevo requisito

- **R9** *(requisito de verificación; su rojo es real y automático, no por
  mutación)*: WHEN corre `mobile-pet-tracker/src/__tests__/ui-language.test.ts`,
  THE SYSTEM SHALL encontrar cada fila de `ALL_USES` con su recuento exacto tras
  aplicar este inventario, fila a fila, sobre
  `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`:

  | Clave | Dónde está hoy | Qué pasa con su fila | Por qué |
  |---|---|---|---|
  | `map.live` | `R4_MAP:104`, fichero `map.tsx` | **se muda** a `src/utils/device-connectivity.ts` (1 fila) | el `t('map.live')` literal desaparece de `map.tsx`; pasa a `labelKey: 'map.live'` en la tabla compartida |
  | `map.stale` | `R4_MAP:105`, fichero `map.tsx` | **se muda** a `src/utils/device-connectivity.ts` (1 fila) | idem |
  | `map.noSignal` | `R4_MAP:103`, fichero `map.tsx` | **se muda** a `src/utils/device-connectivity.ts` con **2 filas** | `none` y `unknown` apuntan los dos a esa clave, así que `checkUses` cuenta **2** ocurrencias de `labelKey: 'map.noSignal'` |
  | `map.gps` | `R4_MAP:119`, fichero `map.tsx` | **se sustituye 1:1** por `{ file: 'src/app/(tabs)/map.tsx', key: 'pairing.connection' }` | R6 cambia `t('map.gps')` por `t('pairing.connection')` en `map.tsx:352` |
  | `pairing.connection` | `R10_PAIRING:366`, fichero `pairing/index.tsx` | **no se toca** | `checkUses` indexa por par (fichero, clave): la fila de Pairing y la nueva del Mapa son filas distintas y no se estorban |
  | `map.justNow`, `map.agoMinutes`, `map.agoHours` | `R4_MAP:100-102` | **no se tocan** | `fmtAgo` sigue en `map.tsx` y sigue resolviéndolas con `t('…')` (R4) |

  Y en consecuencia, con **ruta:línea y valor nuevo**:

  | Fichero:línea | Valor aprobado | Valor nuevo |
  |---|---|---|
  | `src/__tests__/ui-copy-table.ts:99-120` (`R4_MAP`) | 20 filas | **17 filas**: fuera `:103`, `:104` y `:105`; `:119` sustituida por `pairing.connection` |
  | `src/__tests__/ui-copy-table.ts:377` (final de `R10_PAIRING`) | 3 filas de `device-connectivity.ts` | **7**: se añaden `map.live` ×1, `map.stale` ×1, `map.noSignal` ×2 |
  | `src/__tests__/ui-language.test.ts:125` (título) | `'resuelve las 20 ocurrencias normativas'` | `'resuelve las 17 ocurrencias normativas'` |
  | `src/__tests__/ui-language.test.ts:126` | `expect(R4_MAP).toHaveLength(20)` | `expect(R4_MAP).toHaveLength(17)` |
  | `src/__tests__/ui-language.test.ts:168` | `expect(R10_PAIRING).toHaveLength(42 + 2 + 1)` | `expect(R10_PAIRING).toHaveLength(42 + 2 + 1 + 4)` con el comentario `// +4 #94 E1: la tabla del Mapa comparte el util` — término nombrado, no una cifra recalculada a mano, como ya hacen `:133` y `:168` |
  | `src/__tests__/ui-language.test.ts:438` | `expect(SCREEN_FILES).toHaveLength(19 + 2 + 1)` | **sin cambio** — ver arriba |
  | `src/__tests__/ui-copy-table.ts:449-451` | suma de los doce bloques | **sin cambio** — es consistencia interna, se recalcula sola |

  *Test*: `mobile-pet-tracker/src/__tests__/ui-language.test.ts`, los describes
  `#65 R4` (`:124-129`), `#65 R10` (`:166-171`) y `#65 R18` (`:410-448`) ya
  existentes. **R9 no añade ningún test nuevo**: lo que hace es mantener viva
  una cerradura de #65 que R2 y R6 romperían en silencio.

### Ficheros que E1 suma a los que la feature toca

- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
- `mobile-pet-tracker/src/__tests__/ui-language.test.ts`

Ninguno de los dos pertenece a #98, así que tocarlos **no invade** a la sesión
Frontend, y el **delta de i18n sigue en cero**: `pairing.connection` ya existe en
los dos idiomas (`src/i18n/catalog.ts:288` / `:598`) y `map.gps` se queda en el
catálogo aunque nadie la use, como ya decía R6 paso (3).

### Baseline corregido (sustituye al punto 8 de §Contexto verificado)

El punto 8 medía **3 suites** y se quedaba corto: con los dos ficheros de E1 son
**5**. Medido en este worktree sobre `914905b8`, sin pipe (exit code de jest, no
de `tail`):

```bash
cd mobile-pet-tracker
bunx jest --runTestsByPath \
  'src/app/(tabs)/__tests__/map.test.tsx' \
  'src/utils/device-connectivity.test.ts' \
  'src/__tests__/design-drift.test.ts' \
  'src/__tests__/ui-language.test.ts' \
  'src/__tests__/ui-copy-table.ts'
```

→ **5 suites, 120 tests, verde, exit 0.** Comprueba que jest imprime **5**
suites: `(tabs)` sin escapar salta ficheros en silencio con exit 0.

> `src/__tests__/ui-copy-table.ts` no lleva `.test.` en el nombre pero **es una
> suite**: jest-expo recoge todo `__tests__/**/*.ts` y el fichero trae su propio
> `describe` en `:435-453`. Por eso cuenta como quinta suite y no como simple
> módulo de datos.

### Aprobación de E1

- [X] Enmienda E1 aprobada por humano (fecha: 2026-09-21)

---

## Enmienda E2 — el candado de R5 se evade con un alias (H2)

> Escrita el 2026-09-21 sobre la spec aprobada, tras el **RECHAZO** de la
> primera revisión (`progress/review_mobile-map-staleness-single-source.md`,
> punta `c558fca0`). No toca E1, ni D1-D3, ni el gate original, ni R1-R9: todo
> eso sigue firmado. Añade **R10**. Su casilla va **sin marcar**: el humano
> reabre gate solo para esta enmienda.
>
> El bloqueante **H1** (el helper compartido `sourceFiles()`) lo corrige Codex
> en la ronda 2 y **no es asunto de esta enmienda**. E2 es solo H2, que el
> reviewer dejó no bloqueante y que el humano decidió cerrar ahora, con su
> frase: *"prefiero arrancar R5 ahora en esta feature"*.

- Spec enmendada: `specs/mobile-map-staleness-single-source/`
- Qué cambia: se añade **R10**; se actualiza el baseline de las 5 suites.
- Qué NO cambia: **R5 conserva su letra y sus dos aserciones intactas**, y
  ningún otro requisito, decisión o delta se mueve.

### El hecho medido (H2 del reviewer)

`mobile-pet-tracker/src/__tests__/design-drift.test.ts:493-499` casa

```
/\bstaleSeconds\s*(?:<=|>=|<|>)|(?:<=|>=|<|>)\s*\bstaleSeconds\b/
```

Un umbral local que pase por un **alias** no la dispara. La mutación exacta que
el reviewer plantó en `src/app/(tabs)/map.tsx`, junto a `const updated = …`
(`:207`):

```ts
const positionAge = position?.staleSeconds ?? 0;
const isFresh = positionAge <= 120;
```

→ `design-drift.test.ts` en **exit 0, 39 passed**. El umbral vuelve al móvil y
el candado no lo ve. Reproducido aquí contra el árbol: el regex de R5 devuelve
`[]` con la mutación puesta.

### Decisión: E2 añade **R10**, no amplía R5

R5 está firmado con una letra concreta —"declare un identificador
`STALE_SECONDS`, o compare `staleSeconds` con cualquier operando mediante `<`,
`<=`, `>` o `>=`"— y la implementación **la cumple al pie**; por eso el
reviewer no lo marcó bloqueante. Reescribir esa frase sería modificar un
requisito ya aprobado, que es justo lo que C6 prohíbe sin volver a pasar por el
gate, y dejaría sin sentido los commits que R5 ya tiene en [[traceability]].

Y hay una razón de fondo, no solo de procedimiento: lo que R10 asevera **no es
un R5 más ancho, es otra propiedad**. R5 dice "no compares"; R10 dice "no leas
la antigüedad más que en el sitio declarado". La primera persigue sintaxis —y
ese es el juego que H2 gana siempre, porque hay infinitas formas de escribir una
comparación—; la segunda cierra la **única puerta** por la que un umbral puede
entrar en el móvil, sin que le importe cómo esté escrito lo que venga después.

Las dos conviven: R5 sigue cazando el caso obvio y directo, R10 caza el resto.
Ninguna de las dos aserciones de R5 se toca.

### R10 — nuevo requisito

- **R10** *(requisito de verificación; su rojo se prueba por mutación de
  producción, vía (b) de C4, igual que R5)*: WHEN corre la suite móvil, THE
  SYSTEM SHALL comparar el **inventario de lecturas** del identificador
  `staleSeconds` en los fuentes de producción de `mobile-pet-tracker/src/`
  —cada fichero con su **recuento exacto** de ocurrencias, contando solo los
  ficheros con al menos una— contra esta tabla declarada, y fallar ante
  cualquier diferencia, sea un recuento distinto, un fichero de más o un
  fichero de menos:

  | Fichero (relativo a `mobile-pet-tracker/src/`) | Lecturas | Por qué es legítima |
  |---|---|---|
  | `api/types.ts` | **1** | la declaración del campo en `LastPosition` (`:110`). Fichero de #98: se **declara**, no se edita |
  | `app/(tabs)/map.tsx` | **1** | `fmtAgo(position.staleSeconds, t)` (`:207`), la única lectura que R4 conserva |

  **Criterio de aceptación verificable, literal.** Plantada la mutación de H2 en
  `src/app/(tabs)/map.tsx` junto a `const updated = …` (`:207`):

  ```ts
  const positionAge = position?.staleSeconds ?? 0;
  const isFresh = positionAge <= 120;
  ```

  este comando, **sin pipe** (el exit code de un pipe es el de `tail`, no el de
  jest):

  ```bash
  cd mobile-pet-tracker
  bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'
  ```

  debe terminar **rojo, por la aserción de `#94 R10`**, con
  `'app/(tabs)/map.tsx'` en **2** frente al **1** declarado. Simulado contra el
  árbol antes de escribir esta enmienda: hoy el inventario da
  `{ 'api/types.ts': 1, 'app/(tabs)/map.tsx': 1 }` y con la mutación da
  `{ 'api/types.ts': 1, 'app/(tabs)/map.tsx': 2 }`.

  *Test*: `mobile-pet-tracker/src/__tests__/design-drift.test.ts`,
  `describe('#94 R10: la antigüedad de la posición se lee en un solo sitio')`,
  **un `it` nuevo**, después del `describe` de `#94 R5` y sin tocarlo.

### Delta declarado

| Fichero:línea | Valor aprobado | Valor nuevo |
|---|---|---|
| `src/__tests__/design-drift.test.ts:488-500` (`#94 R5`) | 2 `it` | **sin cambio** — R5 conserva su letra y sus dos aserciones |
| `src/__tests__/design-drift.test.ts`, tras `:500` | — | **nuevo** `describe('#94 R10: …')` con **1** `it` y su tabla declarada |
| `src/__tests__/design-drift.test.ts:25-37` (`sourceFiles`) | — | **prohibido tocarlo** — ver §Compatibilidad con H1 |
| `src/__tests__/design-drift.test.ts:39-49` (`allTypeScriptFiles`) | — | **sin cambio**: R10 lo **reutiliza** tal cual y filtra en local |
| Baseline de `design-drift.test.ts` | 39 tests | **40** |
| Baseline de las 5 suites | 136 tests | **137** |

### Compatibilidad con la corrección de H1

La ronda 2 revierte `design-drift.test.ts:33-35` a su forma de `7eb66357`
(`return /\.tsx?$/.test(entry.name) ? [path] : [];`) y, si hace falta, le da a
`#94 R5` su propia lista filtrada local. **R10 no puede volver a apoyarse en el
helper compartido**: eso es exactamente lo que provocó el rechazo.

R10 es **ortogonal** a esa corrección por construcción: no usa `sourceFiles()`
en absoluto. Y además da el mismo resultado con cualquiera de las dos formas del
helper, porque **ningún test colocado bajo `src/` contiene `staleSeconds`**
—verificado: las únicas apariciones en tests están en `src/app/(tabs)/__tests__/`,
`src/api/__tests__/` y el propio `design-drift.test.ts`, los tres dentro de
carpetas `__tests__/` que ambas formas excluyen—. Así que revertir H1 no mueve
el inventario de R10 ni un dígito.

### Baseline corregido (sustituye al de E1)

Medido en este worktree sobre la punta de la ronda 1 (`5a5f7fd3`), sin pipe:

```bash
cd mobile-pet-tracker
bunx jest --runTestsByPath \
  'src/app/(tabs)/__tests__/map.test.tsx' \
  'src/utils/device-connectivity.test.ts' \
  'src/__tests__/design-drift.test.ts' \
  'src/__tests__/ui-language.test.ts' \
  'src/__tests__/ui-copy-table.ts'
```

→ **5 suites, 136 tests, verde, exit 0**; `design-drift.test.ts` sola, **39**.
Tras R10: **137** y **40**. (El 120 de E1 era la medida en `914905b8`, antes de
los 16 commits de la ronda 1; no es comparable y queda sustituido.)

### Lo que E2 NO cambia

Cero dependencias nuevas, cero claves i18n, y los ficheros de #98 siguen
prohibidos: `api/types.ts` **se nombra en la tabla de R10 pero no se edita** —
declararlo es leerlo, no tocarlo.

### Aprobación de E2

- [X] Enmienda E2 aprobada por humano (fecha: 2026-09-21)
