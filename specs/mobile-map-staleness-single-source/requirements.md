---
feature: "mobile-map-staleness-single-source"
status: spec_ready        # draft | spec_ready | approved
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

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

El humano firma a la vez las tres decisiones abiertas de [[design]] §Decisiones
abiertas: **D1** (qué fuente manda), **D2** (rótulo del tile) y **D3**
(consecuencia visible aceptada). Si D2 se rechaza, R6 se retira de esta spec y
el resto no cambia.
