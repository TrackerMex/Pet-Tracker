---
feature: "mobile-geofence-editor"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-geofence-editor]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

## Contexto y dependencias

El dueño de una mascota crea y edita sus zonas seguras circulares desde una
pantalla propia, `pets/[petId]/geofence-editor`: toca el mapa para fijar el
centro, mueve un slider de 20 a 2000 m para fijar el radio, ve el círculo en
borrador y guarda con `POST` (crear) o `PATCH` (editar). Entra desde la lista
de #41 (`Añadir zona` o tocando una zona).

> **Base de escritura: `95b2aaa4`.** Es el HEAD de #41
> (`feature/41-mobile-geofences`, código implementado y aprobado por el
> reviewer, pendiente solo de su prueba de humo). **#41 aún no está en
> `main`.** Todas las anclas de esta spec se verificaron por contenido
> (`grep -F`) contra ese árbol.
>
> **Dependencias:**
>
> - **#41** (lista y punto de entrada): dependencia dura. Codex no arranca
>   hasta que #41 esté en `origin/main` y esta branch se haya actualizado
>   desde allí ([[tasks]] §Precondiciones).
> - **#145** (backend endurecido): ya en `main` (`4e8d6cc3`). Fija los
>   códigos `GEOFENCE_NAME_TAKEN`, `MAX_GEOFENCES_REACHED` y
>   `GEOFENCE_NOT_FOUND`, y que el reinicio de una zona solo ocurre al cambiar
>   `active`, `centerLat`, `centerLng` o `radiusM` (#145 D4).
> - **#60** (rama `AppleMaps` de `PetMap`): **dejó de ser dependencia el
>   2026-10-02** por decisión del humano (#60 está aparcada, `286c94bd`). Esta
>   spec se escribe contra el `PetMap` de `main` (blob `08c6e385`, idéntico en
>   `95b2aaa4`); las props nuevas viajan en `mapViewProps` (§Coordinación).
>
> **Base de tests sin medir.** Esta spec no corre jest: el leader re-mide la
> base al preparar el handoff. Referencia: #41 cerró en 88 suites / 1716
> tests / 1 skipped sobre `03f57706` (1731 al mezclarse con `main`). El delta
> de esta spec es **+101 tests y +2 suites** ([[design]] §Delta de tests).
>
> **Regla de prefijo:** todo `describe` nuevo nombra `#146 R<n>`; nunca un
> `#146` suelto en código ni en tests.
>
> Skills de Codex que el handoff nombra: `building-native-ui` y
> `native-data-fetching`. Codex no tiene skill de router ni de mapas: toda la
> guía de `expo-maps` y de la navegación está escrita en [[design]].

## Qué firma además el humano al aprobar esta spec

Decisiones de producto. Cada una trae su *Recomendación*; las marcadas con
**(mirar)** se apartan de la descripción de la feature o cambian algo ya
aprobado en #41.

1. **P1 — Ruta propia, no sheet.** El editor es la ruta
   `src/app/pets/[petId]/geofence-editor.tsx`, undécimo hijo del
   `Stack.Protected` de `RootStack`, con la cabecera nativa de #95 R4. Un
   sheet con un mapa dentro pelea con los gestos de paneo.
   *Recomendación*: ruta propia.
2. **P2 — Slider de heroui.** `Slider` de `heroui-native` con `minValue 20`,
   `maxValue 2000`, `step 10`; radio por defecto al crear: **150 m**. Al
   editar se conserva el radio guardado aunque no caiga en la rejilla de 10.
   *Recomendación*: heroui (carta de UI punto 5: heroui primero).
3. **P3 — Catorce claves de copy** `geofenceEditor.*` (tabla en R1): las doce
   del editor más `limitNotice` (R12) y `ownerOnly` (R16).
   *Recomendación*: aprobar los textos tal cual.
4. **P4 — El mapa del editor dibuja todas las zonas de la mascota, activas o
   no (mirar).** La zona editada se dibuja con los valores del borrador; al
   crear, el borrador se añade el último con id `'draft'`. La descripción
   pedía "dibujar las zonas en el mapa de la pantalla de geocercas", pero la
   lista de #41 no tiene mapa (errata E3): el dibujo vive en el editor.
   *Recomendación*: aceptar; un mapa en la lista sería otra feature.
5. **P5 — Centro inicial.** Al crear: la última posición conocida
   (`getLastPosition`) si es `ok` con posición; si no, el centro por defecto
   de la pestaña Mapa (19.4326, -99.1332). Al editar: el centro guardado. No
   se mira la antigüedad de la posición (`staleSeconds`).
   *Recomendación*: aceptar.
6. **P6 — Entrada desde la lista (mirar).** Para el dueño, la columna de
   nombre y radio de cada zona pasa a ser un botón (`geofence-<id>-edit`) que
   abre el editor, y aparece `Añadir zona` (`geofences-add`) siempre que la
   lista cargó `ok`, también vacía; con 5 zonas sigue visible pero
   deshabilitada y con el aviso del máximo debajo (R12, P12). **Cambia
   aserciones aprobadas de #41 R5 y R7** ([[design]] D8), y el nombre del
   dueño deja de ser `selectable` (D7).
   *Recomendación*: aceptar.
7. **P7 — PATCH completo.** Al editar se envía siempre el borrador completo
   `{ name, centerLat, centerLng, radiusM }`, con el nombre recortado. El
   backend solo reinicia la zona si cambian centro, radio o `active` (#145
   D4), así que reenviar lo mismo no reinicia nada.
   *Recomendación*: aceptar.
8. **P8 — Nota de reinicio solo al editar.** `geofenceEditor.resetNote`
   avisa de que un centro o radio nuevos cierran las alertas abiertas; al
   crear no hay nada que reiniciar.
   *Recomendación*: aceptar.
9. **P9 — Enmienda A19 con casilla propia** (§Enmiendas).
   *Recomendación*: firmarla junto con la spec.
10. **P10 — TalkBack ajusta el radio de 10 en 10 (mirar).** Las acciones de
    accesibilidad `increment`/`decrement` del thumb suben o bajan 10 m,
    acotadas a [20, 2000], y encuadran la cámara. El thumb de heroui no trae
    esas acciones (errata E8): las añade el editor.
    *Recomendación*: aceptar; sin ellas el radio no es accesible.

11. **P11 — La pestaña Mapa dibuja las zonas activas (mirar).** Solo las
    activas, como círculos con el color de R3; sin recarga en el poll de
    15 s; si la lista falla o tarda, la pestaña queda como hoy, sin aviso
    (R11). *Recomendación*: aceptar; las inactivas no vigilan nada y
    pintarlas confunde.
12. **P12 — Límite de 5 en el cliente (mirar, sustituye parte de P6).**
    Constante `GEOFENCE_MAX_PER_PET = 5` exportada de `src/api/geofences.ts`,
    espejo de la del backend; con 5 zonas `Añadir zona` se deshabilita y
    aparece `geofenceEditor.limitNotice` (R12). El 400 del servidor y
    `limitReached` siguen para la carrera entre dispositivos.
    *Recomendación*: aceptar el texto del aviso tal cual (R1).
13. **P13 — El interruptor del editor escribe en el acto.** Como el de la
    lista: `PATCH { active }` inmediato, recarga la lista y no sale del
    editor; Guardar sigue sin enviar `active` (P7 intacto, R13).
    *Recomendación*: aceptar.
14. **P14 — Eliminar en el editor.** Mismo diálogo nativo que la lista
    (título con el nombre, Cancelar / Eliminar); al confirmar borra, recarga
    la lista y vuelve. Interruptor y Eliminar solo al editar (R14).
    *Recomendación*: aceptar.
15. **P15 — El centro se valida con `typeof`.** Sin `Number.isFinite`: un
    JSON no transporta `NaN` ni `Infinity`, y `radiusM` ya se valida así
    (R15). *Recomendación*: aceptar.
16. **P16 — Solo lectura para quien no es dueño (mirar).** La lista sigue
    sin abrir el editor a quien no es dueño (R9 intacto); el editor, si llega
    por URL, muestra la zona sin controles o, al crear, la tarjeta
    `geofenceEditor.ownerOnly`. Un fallo al leer el rol cuenta como no dueño,
    igual que en #41 (R16). *Recomendación*: aceptar; abrir el editor desde
    la lista para todos los roles sería una pantalla para leer lo que la
    pestaña Mapa (R11) ya enseña.
17. **P17 — `DEFAULT_CENTER` vive en `src/components/pet-map.tsx`.** Junto a
    `MAP_ZOOM`, exportado; la pestaña Mapa y el editor lo importan (R17).
    *Recomendación*: aceptar.
18. **P18 — Títulos de test sin números (mirar).** Renombra títulos
    aprobados que llevan recuentos caducos o que caducarían:
    `#62 R1` "trece botones", "doce bloques" de `ALL_USES`, `#87 R18` "cinco
    recursos" y el `it` de R1 de esta spec ([[design]] D15).
    *Recomendación*: aceptar; un número en un título caduca con la próxima
    feature y nadie lo reescribe.

**Delimitación de rol:** el editor comprueba el rol con la misma consulta
que la lista de #41 (R16). Solo el dueño ve las entradas (R9); si otro rol
llega por URL, al editar ve la zona en solo lectura y al crear una tarjeta
de "solo el dueño" (P16). El 403 del backend sigue pintando el error
genérico si el rol cambia entre la carga y el guardado.

## Requisitos funcionales

### R1 — Catálogo de copy

- **R1**: THE SYSTEM SHALL registrar en `src/i18n/catalog.ts`, en los dos
  idiomas e inmediatamente después de la línea `'geofences.deleteBody'` de
  cada idioma, estas catorce claves (P3):

  | Clave | es | en |
  |---|---|---|
  | `geofenceEditor.title` | Zona segura | Safe zone |
  | `geofenceEditor.nameLabel` | Nombre | Name |
  | `geofenceEditor.mapHint` | Toca el mapa para mover el centro de la zona. | Tap the map to move the zone's center. |
  | `geofenceEditor.radiusLabel` | Radio de la zona | Zone radius |
  | `geofenceEditor.resetNote` | Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas. | Saving a new center or radius re-evaluates the zone and closes its open alerts. |
  | `geofenceEditor.save` | Guardar | Save |
  | `geofenceEditor.nameTaken` | Ya tienes una zona con ese nombre. | You already have a zone with that name. |
  | `geofenceEditor.limitReached` | Esta mascota ya tiene el máximo de zonas. | This pet already has the maximum number of zones. |
  | `geofenceEditor.invalid` | Revisa el nombre y el radio de la zona. | Check the zone name and radius. |
  | `geofenceEditor.notFound` | La mascota o la zona ya no están disponibles. | This pet or zone is no longer available. |
  | `geofenceEditor.add` | Añadir zona | Add zone |
  | `geofenceEditor.editLabel` | Editar zona {{name}} | Edit {{name}} zone |
  | `geofenceEditor.limitNotice` | Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra. | This pet already has {{max}} zones, the maximum. Delete one to add another. |
  | `geofenceEditor.ownerOnly` | Solo el dueño de la mascota puede crear o editar zonas. | Only the pet's owner can create or edit zones. |

  `editLabel` (`{{name}}`) y `limitNotice` (`{{max}}`, R12) son las únicas
  con parámetro. El `mapHint` y el `ownerOnly` en inglés llevan apóstrofo:
  en el catálogo van entre comillas dobles, como `'geofences.deleteBody'` en
  inglés.

  THE SYSTEM SHALL además añadir en `specs/mobile-ui-language/design.md`,
  justo antes de la línea `## 3. La infraestructura`, la sección
  `### §2.16 — Añadidos por #146 — Editor de zonas seguras` con una fila por
  clave con la forma
  `` | — | `<clave>` | `<en>` | `<es>` | ← añadida por #146 (R1) ``.

  *Test*: `src/providers/__tests__/language-provider.test.tsx`,
  `describe('#146 R1: el catálogo trae las claves del editor de zonas')`
  › `it('registra las claves del editor en los dos idiomas y en la tabla de la spec de idioma')`
  (títulos sin recuento, P18).
  Se calca del `describe('#41 R1: …')` (mismo array de traducciones y mismo
  `readFileSync` de `../specs/mobile-ui-language/design.md`), con el sufijo de
  regex `← añadida por #146 \(R1\)`, y va justo después de él.

  *Candado heredado*: `#65 R12` (longitud del catálogo). Su expresión pasa de
  `… - 6 + 1 + 2 + 3 + 11,` a `… - 6 + 1 + 2 + 3 + 11 + 12 + 2,` (320 → 334)
  y su comentario gana
  ` + 12 de #146 R1 (geofenceEditor.*) + 2 de #146 R1 (geofenceEditor.limitNotice, geofenceEditor.ownerOnly)`.
  El `+ 12` y el `+ 2` quedan visibles: no se colapsa la suma (el `+ 2`
  separa las dos claves que trajo la ampliación de la spec).

  Rojo real en `d637757e`: ninguna de las catorce claves existe (1 nuevo
  por aserción + `#65 R12` heredado).

### R2 — `zoomForRadius`

- **R2**: THE SYSTEM SHALL exportar desde el fichero nuevo
  `src/utils/zoom-for-radius.ts` la función pura
  `zoomForRadius(radiusM: number): number`, que devuelve
  `Math.min(18, 16 - Math.log2(radiusM / 300))`: zoom 16 para 300 m (el
  `MAP_ZOOM` de `PetMap`), un nivel menos cada vez que el radio se duplica y
  nunca más de 18.

  *Test*: `src/utils/zoom-for-radius.test.ts` (nuevo),
  `describe('#146 R2: zoomForRadius encuadra el círculo con su radio')` ›
  `it.each(...)('para %p m da zoom %p')` con `toBeCloseTo(zoom, 3)` y estas
  ocho filas:

  | Radio (m) | Zoom |
  |---|---|
  | 300 | 16 |
  | 150 | 17 |
  | 600 | 15 |
  | 1200 | 14 |
  | 75 | 18 |
  | 20 | 18 |
  | 2000 | 13.263 |
  | 500 | 15.263 |

  Rojo real: el commit rojo trae el esqueleto `return 0;` (C4: falla por
  aserción, no por import), así que las ocho filas fallan.

### R3 — `PetMap` acepta toques y círculos

- **R3**: THE SYSTEM SHALL ampliar `src/components/pet-map.tsx` sin romper la
  pestaña Mapa:

  - exporta `export type MapCircle = { id: string; center: MapCoordinates; radius: number };`
  - `PetMapProps` gana tres props **opcionales**: `circles?: MapCircle[]`,
    `zoom?: number` y `onPress?: (coordinates: MapCoordinates) => void`;
  - `useThemeColors(['accent-strong', 'tab-pill'])` da
    `[polylineColor, circleFill]`;
  - la cámara usa `zoom: props.zoom ?? MAP_ZOOM`;
  - `mapViewProps` gana
    `circles: (props.circles ?? []).map((c) => ({ id: c.id, center: c.center, radius: c.radius, color: circleFill, lineColor: polylineColor, lineWidth: 2 }))`;
  - **solo si** llega `onPress`, `mapViewProps` gana `onMapClick`,
    `onPOIClick` y `onCircleClick`. Los dos primeros reenvían
    `event.coordinates`; el de círculo reenvía `event.clickCoordinates`. Los
    tres pasan por un `forward(coordinates)` local que llama a `onPress`
    con `{ latitude, longitude }` **solo si las dos son `number`** (en
    expo-maps son opcionales, errata E11).

  Todo va dentro del objeto `mapViewProps` (decisión del humano 2026-10-02,
  §Coordinación). La línea `uiSettings: { zoomControlsEnabled: false },` no
  cambia.

  *Test*: `src/components/__tests__/pet-map.test.tsx`,
  `describe('#146 R3: PetMap pinta círculos, acepta zoom y emite el toque')`,
  ocho `it`:

  1. `'pasa los círculos a la vista con su id, centro y radio'`
  2. `'pinta los círculos con relleno tab-pill y borde accent-strong de 2'`
  3. `'usa el zoom recibido en la cámara'`
  4. `'sin zoom ni onPress conserva MAP_ZOOM, pasa una lista de círculos vacía y no registra toques'`
  5. `'un toque en el mapa emite sus coordenadas'`
  6. `'un toque en un POI emite sus coordenadas'`
  7. `'un toque en un círculo emite el punto tocado'`
  8. `'ignora un toque sin latitud o sin longitud'`

  El mock de `useThemeColors` del fichero pasa de `() => ['accent-color']` a
  `(tokens: string[]) => tokens.map((token) => \`color:${token}\`)`; ningún
  `it` existente lee `'accent-color'`. Los `it` 5–8 aseveran primero
  `expect(typeof props.onMapClick).toBe('function')` (o el manejador que
  toque) para que el rojo sea por aserción y no un `TypeError`.

  Rojo real en `95b2aaa4`: la vista no recibe `circles`, ni `zoom` distinto
  de 16, ni manejadores. El `it` 4 asevera, en este orden,
  `cameraPosition.zoom` 16, `circles` igual a `[]` y `onMapClick`,
  `onPOIClick` y `onCircleClick` `undefined`; en rojo cae por `circles`
  `undefined`, y en verde lo sostiene además la mutación M16 ([[design]]
  §Mutaciones). No se parte en dos. Recuento: **8 `it`, 8 rojos por
  aserción, ninguno Declarado.**

  El commit verde corre también `src/screens/map/index.test.tsx` (la
  pestaña Mapa, sin cambios).

### R4 — API de escritura de zonas

- **R4**: THE SYSTEM SHALL añadir a `src/api/geofences.ts` (y `postJson` al
  `import` de `./http`):

  ```ts
  export type GeofenceDraft = { name: string; centerLat: number; centerLng: number; radiusM: number };
  export type GeofenceSaveState =
    | GeofenceWriteState
    | { kind: 'name-taken' }
    | { kind: 'limit-reached' }
    | { kind: 'invalid' };
  ```

  - `saveState(response, okStatus)` (local, `async`): con 409 y cuerpo
    `code === 'GEOFENCE_NAME_TAKEN'` → `name-taken`; con 400 y
    `code === 'MAX_GEOFENCES_REACHED'` → `limit-reached`; con **cualquier
    otro 400**, también sin cuerpo legible (`readJson` devuelve `undefined`)
    → `invalid` (el 400 de validación no trae `code`, errata E10); en el resto,
    `writeState(response, okStatus)` de #41 (así 404 → `not-found`, 402 →
    `no-tracking`, 401 → `unauthorized`, 409 sin código, 403 y 5xx → `error`).
  - `createGeofence(baseUrl: string | undefined, token: string, petId: string, draft: GeofenceDraft, fetchFn: typeof fetch = fetch): Promise<GeofenceSaveState>`
    hace `postJson` a `/pets/${petId}/geofences` con
    `{ ...draft, type: 'safe_circle' }`; éxito = **201**.
  - `updateGeofence(baseUrl: string | undefined, token: string, petId: string, geofenceId: string, draft: GeofenceDraft, fetchFn: typeof fetch = fetch): Promise<GeofenceSaveState>`
    hace `patchJson` a `/pets/${petId}/geofences/${geofenceId}` con el
    `draft` tal cual; éxito = **200**.
  - Las dos devuelven `missing-config` sin llamar a `fetchFn` si `baseUrl`
    falta o es vacío, y devuelven tal cual el `unreachable` de `postJson` /
    `patchJson`.

  *Test*: `src/api/__tests__/geofences.test.ts`,
  `describe('#146 R4: createGeofence y updateGeofence mapean el guardado por kind')`,
  25 `it` (con los helpers `response`, `invalidJsonResponse` y `baseUrl` ya
  presentes en el fichero):

  1. `'createGeofence hace POST del borrador con type safe_circle y 201 es ok'`
     — URL `'http://example.test/v1/pets/pet-1/geofences'`, `method: 'POST'`,
     cabeceras como en `#41 R3`, y `JSON.parse(body)` igual a
     `{ name, centerLat, centerLng, radiusM, type: 'safe_circle' }`.
  2. `'updateGeofence hace PATCH del borrador completo y 200 es ok'` — URL
     `'http://example.test/v1/pets/pet-1/geofences/zone-1'`, `method: 'PATCH'`,
     `JSON.parse(body)` igual al borrador sin `type`.
  3–11. `it.each(SAVE_ROWS)('createGeofence: HTTP %i con código %p da %s')`
  12–20. `it.each(SAVE_ROWS)('updateGeofence: HTTP %i con código %p da %s')`

     | Status | `code` del cuerpo | `kind` |
     |---|---|---|
     | 409 | `GEOFENCE_NAME_TAKEN` | `name-taken` |
     | 400 | `MAX_GEOFENCES_REACHED` | `limit-reached` |
     | 400 | — | `invalid` |
     | 409 | — | `error` |
     | 404 | `GEOFENCE_NOT_FOUND` | `not-found` |
     | 402 | — | `no-tracking` |
     | 401 | — | `unauthorized` |
     | 403 | — | `error` |
     | 500 | — | `error` |

  21. `'un éxito con otro status es error'` — create con 200 y update con 201.
  22. `'un 400 con cuerpo ilegible es invalid'` — `invalidJsonResponse(400)`
      en las dos.
  23. `'un fetch rechazado es unreachable'` — en las dos.
  24–25. `it.each([undefined, ''])('sin base URL (%p) es missing-config sin llamar a fetch')`
      — **Declarado** (las dos funciones en cada fila).

  Rojo real: el commit rojo trae los tipos y los esqueletos
  `return { kind: 'missing-config' };`. Recuento: **25 `it`, 23 rojos por
  aserción y 2 Declarado** (sostenidos por M6).

### R5 — Ruta y stack del editor

- **R5**: THE SYSTEM SHALL tener el route delgado
  `src/app/pets/[petId]/geofence-editor.tsx`, sin más lógica que esta (P1):

  ```tsx
  import { useLocalSearchParams } from 'expo-router';
  import { GeofenceEditorScreen } from '../../../screens/geofence-editor';

  export default function GeofenceEditorRoute() {
    const { petId, geofenceId } = useLocalSearchParams<{ petId: string; geofenceId?: string }>();
    return <GeofenceEditorScreen petId={petId} geofenceId={geofenceId} />;
  }
  ```

  THE SYSTEM SHALL además declarar en el
  `Stack.Protected guard={status === 'authenticated'}` de `RootStack`
  (`src/app/_layout.tsx`) **once** `Stack.Screen`: los diez de #41 en su
  orden y, justo después de la línea que contiene
  `name="pets/[petId]/geofences"`, esta, **sin** `dangerouslySingular`:

  ```tsx
  <Stack.Screen name="pets/[petId]/geofence-editor" options={{ ...headerOptions, title: t('geofenceEditor.title') }} />
  ```

  Sin `geofenceId` el editor crea; con él, edita.

  *Tests*:

  - `src/app/__tests__/detail-stack.test.tsx`,
    `describe('#146 R5: el editor de zonas vive en src/app/pets/[petId]/geofence-editor.tsx')`
    › `it('es un route delgado que importa la pantalla de src/screens/geofence-editor')`
    — calco del `#41 R4` del mismo fichero: `existsSync`, `useLocalSearchParams`
    y `"from '../../../screens/geofence-editor'"`.
  - `src/app/__tests__/layout.test.tsx`,
    `describe('#146 R5: la guarda de RootStack declara el editor de zonas tras la lista')`,
    con `it('declara pets/[petId]/geofence-editor como undécimo hijo y no singular')`
    (`toHaveLength(11)`, `children[10]`) e
    `it('le da la cabecera nativa de #95 R4 con el título del editor de zonas')`
    (`'t:geofenceEditor.title'`).
  - Tres candados heredados de recuento en `layout.test.tsx` ([[design]] D8
    filas 2–4).

  Rojo real en `95b2aaa4`: el fichero no existe y la guarda tiene diez
  hijos (3 rojos por aserción + 3 heredados). El commit verde crea además
  el stub `export function GeofenceEditorScreen(_props: { petId: string; geofenceId?: string }) { return null; }`
  en `src/screens/geofence-editor/index.tsx`, que R6 sustituye.

### R6 — Editor: carga y estados

- **R6**: THE SYSTEM SHALL exportar desde `src/screens/geofence-editor/index.tsx`
  `GeofenceEditorScreen({ petId, geofenceId }: { petId: string; geofenceId?: string })`,
  que lee `baseUrl = process.env.EXPO_PUBLIC_API_URL` y `token` de `useAuth()`
  como la lista de #41, y lanza:

  - `useQuery({ queryKey: geofenceKeys.list(petId), queryFn: () => listGeofences(baseUrl, token ?? '', petId) })`;
  - `useQuery({ queryKey: positionKeys.last(petId), queryFn: () => getLastPosition(baseUrl, token ?? '', petId), enabled: !geofenceId })`
    (solo al crear, P5).

  **Ramas sin formulario**, en este orden de precedencia, dentro de un
  `ScrollView` raíz `testID="screen-geofence-editor"`,
  `className="flex-1 bg-background"`, con las métricas A11
  (`contentInsetAdjustmentBehavior="automatic"` y
  `contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}`):

  1. mientras `list.data === undefined || (!geofenceId && position.data === undefined)`:
     `<Skeleton testID="geofence-editor-loading" className="h-24 w-full rounded-card" />`;
  2. lista `no-tracking`: `Card testID="geofence-editor-no-tracking"`
     (`items-center py-8`) con un `Text` `text-center font-normal text-muted`
     y `messageFor(t, 'no-tracking')`;
  3. lista `unauthorized`: nada (el `QueryCache` global cierra sesión);
  4. lista `error`, `unreachable` o `missing-config`:
     `Text testID="geofence-editor-load-error" selectable className="text-danger"`
     con `messageFor(t, list.data.kind)` y
     `Button testID="geofence-editor-retry" className="min-h-11"` con
     `t('common.retry')`, que llama **solo** a `list.refetch()`;
  5. lista `ok` con `geofenceId` que no está en ella:
     `Card testID="geofence-editor-not-found"` (`items-center py-8`) con un
     `Text` `text-center font-normal text-muted` y
     `messageFor(t, 'not-found')`.

  **Todo mensaje pasa por `messageFor`** (también los de las dos tarjetas):
  cada clave aparece una sola vez como `t('…')` en el fichero, y eso es lo
  que cuenta el candado de R10.

  `messageFor(t: ReturnType<typeof useTranslate>, kind: GeofenceSaveState['kind']): string`
  es una función local del fichero (el parámetro **se llama `t`**, para que
  el candado de copy por clave lo lea) con un `switch`: `not-found` →
  `geofenceEditor.notFound`; `no-tracking` → `geofences.needsCollar`;
  `name-taken` → `geofenceEditor.nameTaken`; `limit-reached` →
  `geofenceEditor.limitReached`; `invalid` → `geofenceEditor.invalid`;
  `unreachable` → `common.cannotReachServer`; `default` →
  `common.somethingWentWrong`.

  **Formulario.** En otro caso monta un componente local
  `GeofenceEditorForm` con los valores iniciales:

  - al editar: nombre, centro (`centerLat`/`centerLng`) y radio (`radiusM`)
    de la zona;
  - al crear: nombre `''`, radio **150** y centro = la última posición si
    `position.data` es `ok` con `position` no nula
    (`{ latitude: lat, longitude: lng }`); en cualquier otro caso
    (`ok` con `null`, `no-tracking`, `unauthorized`, `error`, `unreachable`,
    `missing-config`) el `DEFAULT_CENTER` que R17 exporta desde
    `src/components/pet-map.tsx` (importado de `'../../components/pet-map'`,
    nunca redeclarado: R17 lo candea).
  - al editar, el formulario recibe además la zona entera como prop `zone`
    (la `Geofence` de `list.data.geofences`, no una copia en estado): R13
    lee de ella `zone.active`, que se repinta tras cada recarga de la lista.
    Al crear, `zone` es `undefined`.

  Su estado: `name`, `center`, `radius`, `camera` (`{ center, zoom }`,
  inicial `{ center: centroInicial, zoom: zoomForRadius(radioInicial) }`),
  `busy` y `error`. Su árbol:

  - raíz `View testID="screen-geofence-editor" className="flex-1"` (sin
    fondo: el mapa va detrás, carta punto 10);
  - primer hijo `View testID="geofence-editor-map" className="flex-1"` con
    `<PetMap center={camera.center} zoom={camera.zoom} marker={null} polylines={[]} circles={circles} colorScheme={theme === 'dark' ? 'dark' : 'light'} />`
    (`theme` de `useUniwind()`, como la pestaña Mapa);
  - segundo hijo `ScrollView testID="geofence-editor-form" className="bg-background"`,
    `style={{ flexGrow: 0, flexShrink: 1 }}`,
    `keyboardShouldPersistTaps="handled"`,
    `contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}`
    y **sin** `contentInsetAdjustmentBehavior`. Sus hijos, en orden:
    1. `TextField` > `Label className="text-xs font-semibold text-foreground"`
       (`t('geofenceEditor.nameLabel')`) + `Input testID="geofence-editor-name" className="rounded-xl bg-default" maxLength={120} value={name}`;
    2. `Text testID="geofence-editor-map-hint" className="text-sm font-normal text-muted"`
       con `t('geofenceEditor.mapHint')`;
    3. `Text testID="geofence-editor-radius-value" selectable style={TABULAR_NUMS} className="font-bold text-foreground"`
       con `t('geofences.radius', { meters: Math.round(radius) })`;
    4. `Slider testID="geofence-editor-radius" value={radius} minValue={20} maxValue={2000} step={10}`
       > `Slider.Track` > `Slider.Fill` + `Slider.Thumb testID="geofence-editor-radius-thumb" accessibilityLabel={t('geofenceEditor.radiusLabel')}`;
    5. solo al editar (P8):
       `Text testID="geofence-editor-reset-note" className="text-sm font-normal text-muted"`
       con `t('geofenceEditor.resetNote')`.

  `circles` (P4): cada zona de la lista como
  `{ id, center: { latitude: centerLat, longitude: centerLng }, radius: radiusM }`,
  salvo la editada, que usa `center` y `radius` del borrador; al crear se
  añade al final `{ id: 'draft', center, radius }`.

  *Test*: `src/screens/geofence-editor/index.test.tsx` (nuevo),
  `describe('#146 R6: el editor pinta el formulario sobre el mapa y sus estados')`,
  19 `it`:

  1. `'pinta el esqueleto mientras carga la lista al editar'` — además la raíz
     con las métricas A11, y `getLastPosition` no se llama.
  2. `'al crear sigue en esqueleto hasta que llega la última posición'`
  3. `'al editar precarga nombre, centro y radio de la zona'` — con Parque:
     cámara zoom 15, `'Radio de 600 m'`, props del slider (600, 20, 2000, 10)
     y la nota de reinicio.
  4. `'al crear centra en la última posición con el radio por defecto'` —
     zoom 17, sin nota de reinicio.
  5–9. `it.each(['ok sin posición', 'no-tracking', 'unauthorized', 'error', 'unreachable'])('al crear sin posición utilizable (%s) centra en el centro por defecto')`
  10. `'dibuja todas las zonas de la mascota, activas o no, con la editada en borrador'`
  11. `'al crear dibuja el borrador después de las zonas existentes'`
  12. `'pinta no encontrada si la zona ya no está en la lista'`
  13. `'pinta el 402 sin Reintentar'`
  14–16. `it.each(['error', 'unreachable', 'missing-config'])('pinta %s con Reintentar, que vuelve a pedir solo la lista')`
  17. `'deja el 401 de la lista al manejador global y no pinta estado'`
  18. `'compone mapa y formulario sin fondo sobre el mapa y con las métricas A11 en el formulario'`
      — raíz `flex-1`; `childTestIds(raíz)` igual a
      `['geofence-editor-map', 'geofence-editor-form']`; el formulario con
      `toHaveStyle({ flexGrow: 0, flexShrink: 1 })` y
      `contentInsetAdjustmentBehavior` `undefined`.
  19. `'pinta el formulario en inglés'`

  Los círculos se comparan solo por `{ id, center, radius }` (el color lo
  cubre R3). Rojo real: R5 dejó un stub que devuelve `null`. Recuento:
  **19 `it`, 18 rojos por consulta y 1 por aserción** (el 17: el
  `onUnauthorized` no se llama).

### R7 — Editor: borrador (toques, radio, nombre)

- **R7**: WHEN el dueño toca el mapa, un POI o un círculo, THE SYSTEM SHALL
  mover `center` del borrador al punto tocado (vía `PetMap onPress={setCenter}`)
  **sin tocar `camera`**: la cámara no persigue el borrador (la descripción
  lo exige; expo-maps reaplica la cámara cada vez que cambia su valor).

  WHEN el slider cambia (`onChange`), THE SYSTEM SHALL poner `radius` al
  valor recibido (`Array.isArray(v) ? v[0] : v`) sin mover la cámara; y
  WHEN se suelta (`onChangeEnd`), THE SYSTEM SHALL poner
  `camera = { center, zoom: zoomForRadius(radio) }` (encuadra el borrador).

  WHEN TalkBack lanza sobre el thumb la acción `increment` o `decrement`
  (P10), THE SYSTEM SHALL poner `radius` a `Math.min(2000, radius + 10)` o
  `Math.max(20, radius - 10)` y `camera = { center, zoom: zoomForRadius(siguiente) }`.
  El thumb declara
  `accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}` y
  `onAccessibilityAction`.

  WHEN el dueño escribe en `geofence-editor-name`, THE SYSTEM SHALL
  actualizar `name` (`onChangeText={setName}`).

  *Test*: mismo fichero,
  `describe('#146 R7: el toque y el slider mueven el borrador sin perseguir la cámara')`,
  8 `it`:

  1. `'un toque en el mapa mueve el centro del borrador y no la cámara'`
  2. `'un toque en un POI mueve el centro del borrador'`
  3. `'un toque dentro de un círculo mueve el centro al punto tocado'`
  4. `'mover el slider cambia el radio del borrador y su valor sin mover la cámara'`
  5. `'al soltar el slider la cámara encuadra el borrador'`
  6. `'TalkBack sube y baja el radio de diez en diez y encuadra'` — 150 → 160
     da zoom ≈ 16.907 (`toBeCloseTo(…, 3)`); de vuelta a 150 da 17.
  7. `'TalkBack no sale de 20 ni de 2000'`
  8. `'escribir el nombre actualiza el campo'`

  Los `it` 1–3 llaman a `onMapClick` / `onPOIClick` / `onCircleClick` de la
  vista stub de expo-maps (el `PetMap` es real) tras aseverar
  `typeof … === 'function'`; los 4–7 usan `fireEvent(slider, 'change', v)`,
  `fireEvent(slider, 'changeEnd', v)` y
  `fireEvent(thumb, 'accessibilityAction', { nativeEvent: { actionName } })`
  sobre el doble del `Slider` ([[design]] D5). Recuento: **8 `it`, 8 rojos
  por aserción** (en R6 no hay manejadores: los `fireEvent` son no-op).

### R8 — Editor: guardar

- **R8**: THE SYSTEM SHALL añadir al formulario, tras la nota de reinicio
  (o tras el slider al crear):

  - `Button testID="geofence-editor-save" className="rounded-xl bg-accent" isDisabled={busy || name.trim() === ''}`
    con `Button.Label className="font-bold text-accent-foreground"` y
    `t('geofenceEditor.save')`;
  - como último hijo, solo si hay error,
    `Text testID="geofence-editor-error" selectable className="text-danger"`.

  WHEN el dueño pulsa Guardar, THE SYSTEM SHALL ejecutar exactamente:

  ```ts
  setBusy(true); setError(null);
  try {
    const draft = { name: name.trim(), centerLat: center.latitude, centerLng: center.longitude, radiusM: radius };
    const result = geofenceId
      ? await updateGeofence(baseUrl, token ?? '', petId, geofenceId, draft)
      : await createGeofence(baseUrl, token ?? '', petId, draft);
    if (result.kind === 'ok') { void queryClient.invalidateQueries({ queryKey: geofenceKeys.list(petId) }); router.back(); }
    else if (result.kind === 'unauthorized') await signOut();
    else setError(messageFor(t, result.kind));
  } catch { setError(messageFor(t, 'error')); } finally { setBusy(false); }
  ```

  `queryClient` sale de `useQueryClient()`, `router` de `expo-router` y
  `signOut` de `useAuth()`. La invalidación va **antes** de `router.back()`
  (errata E9: la lista no se recarga sola al volver). Ante un error el
  borrador se conserva. R13 extrae este cuerpo a un `run` local que
  comparten Guardar, el interruptor y Eliminar, sin cambiar su
  comportamiento (los 16 `it` de R8 siguen verdes en ese refactor).

  *Test*: mismo fichero,
  `describe('#146 R8: Guardar crea o actualiza la zona y vuelve a la lista')`,
  16 `it`:

  1. `'al crear envía el borrador recortado y vuelve a la lista recargada'` —
     escribe `'  Paseo  '`; `createGeofence` recibe
     `{ name: 'Paseo', centerLat: 19.5, centerLng: -99.2, radiusM: 150 }`;
     `invalidateQueries` con `{ queryKey: ['geofences', 'list', 'pet-1'] }`
     **antes** de `router.back` (por `mock.invocationCallOrder`).
  2. `'al editar envía el borrador completo con PATCH'` — toque en el mapa en
     19.41 / -99.11 y nombre `'Casa nueva'`.
  3. `'pinta Guardar con la receta primaria tras la nota de reinicio'` (al
     editar) — clase
     `'pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent'`,
     etiqueta
     `'button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground'`
     y, en `childTestIds(save.parent)`, `'geofence-editor-reset-note'`
     justo antes de `'geofence-editor-save'` (adyacencia, no la lista
     entera: R13 mete la fila del interruptor y R14 el botón Eliminar en ese
     mismo padre; el orden completo lo cierra R14 it 2).
  4. `'deshabilita Guardar mientras guarda y no envía dos veces'`
  5. `'deshabilita Guardar con el nombre vacío'` — deshabilitado al crear y
     habilitado tras escribir.
  6. `'deshabilita Guardar con un nombre de solo espacios'`
  7–14. `it.each(...)('pinta %s bajo Guardar y conserva el borrador')`:

     | `kind` | Mensaje (es) |
     |---|---|
     | `name-taken` | Ya tienes una zona con ese nombre. |
     | `limit-reached` | Esta mascota ya tiene el máximo de zonas. |
     | `invalid` | Revisa el nombre y el radio de la zona. |
     | `not-found` | La mascota o la zona ya no están disponibles. |
     | `no-tracking` | el valor es de `geofences.needsCollar` (`toContain('Las zonas seguras requieren un collar')`) |
     | `unreachable` | el de `common.cannotReachServer` (`toContain('No se pudo conectar con el servidor')`) |
     | `error` | el de `common.somethingWentWrong` (`toContain('Algo salió mal')`) |
     | `missing-config` | ídem `error` |

  15. `'un rechazo pinta el error genérico y el siguiente intento lo borra'`
      — la segunda llamada es `ok`: el error desaparece y se llama a `back`.
  16. `'un 401 cierra sesión una vez y no vuelve a la lista'`

  El estado deshabilitado se asevera por `accessibilityState.disabled`.
  Recuento: **16 `it`, 16 rojos por consulta** (no hay `geofence-editor-save`)
  **+ 3 candados heredados** ([[design]] D8 filas 5–7): `#87 R19` (un
  `signOut(` más), `#62 R1` (un primario sólido más) y `#98 R10` (un
  `rounded-xl bg-accent` más).

### R9 — Lista de zonas: entrada al editor

- **R9**: WHILE quien mira es el dueño (`isOwner`), THE SYSTEM SHALL
  convertir en `src/screens/geofences/index.tsx` la columna de nombre y radio
  de cada zona (hoy `<View className="min-w-0 flex-1 gap-1">`) en este
  `Pressable` (receta del enlace de fila de alertas #100), con los mismos dos
  `Text` dentro:

  ```tsx
  <Pressable testID={`geofence-${geofence.id}-edit`} accessibilityRole="button" accessibilityLabel={t('geofenceEditor.editLabel', { name: geofence.name })} disabled={busy} className="min-h-11 min-w-0 flex-1 gap-1" style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => router.push({ pathname: '/pets/[petId]/geofence-editor', params: { petId, geofenceId: geofence.id } })}>
  ```

  Quien no es dueño conserva el `View` actual. El `Text` del nombre pasa de
  `selectable` a `selectable={!isOwner}` (D7: un `Text` seleccionable dentro
  de un `Pressable` se traga el toque en Android).

  WHILE quien mira es el dueño AND la lista es `ok` (también vacía; con 5
  zonas R12 lo deshabilita y añade el aviso, P6), THE SYSTEM SHALL pintar,
  entre el cierre `)}` de la cadena de estados y `{actionError ? (`:

  ```tsx
  <Button testID="geofences-add" className="rounded-xl bg-accent" isDisabled={busy} onPress={() => router.push({ pathname: '/pets/[petId]/geofence-editor', params: { petId } })}>
    <Button.Label className="font-bold text-accent-foreground">{t('geofenceEditor.add')}</Button.Label>
  </Button>
  ```

  Imports nuevos: `router` de `'expo-router'` y `Pressable` de
  `'react-native'`. El error de acción sigue siendo el último hijo.

  *Test*: `src/screens/geofences/index.test.tsx`, que gana
  `jest.mock('expo-router', () => ({ router: { push: jest.fn() } }))` leído
  con `jest.mocked(router.push)`;
  `describe('#146 R9: el dueño entra al editor desde la lista')`, 12 `it`:

  1. `'convierte la columna de cada zona en un botón al editor para el dueño'`
     — `accessibilityRole`, `accessibilityLabel` (`'Editar zona Casa'`),
     clase, y opacidad 1 y luego 0.8 tras
     `fireEvent(el, 'responderGrant', { nativeEvent: {}, persist: () => undefined })`.
  2. `'abre el editor de la zona tocada'` — `router.push` con
     `{ pathname: '/pets/[petId]/geofence-editor', params: { petId: 'pet-1', geofenceId: … } }`.
  3. `'no abre el editor mientras una escritura está en vuelo'`
  4. `'pinta Añadir zona con la receta primaria antes del error de acción'`
     — receta como `#146 R8` it 3, push sin `geofenceId`.
  5. `'pinta Añadir zona también con la lista vacía'`
  6–7. `it.each(['family', 'un error al leer el rol'])('no ofrece editar ni añadir a %s')`
     — **Declarado**; asevera además que el nombre **sigue** `selectable`.
  8–11. `it.each(['cargando', 'no-tracking', 'error', 'unauthorized'])('no pinta Añadir zona con %s')`
     — **Declarado**.
  12. `'nombra el botón de editar y Añadir zona en inglés'`

  Recuento: **12 `it`: 6 rojos por consulta (1–5 y 12), 6 Declarado (6–11,
  sostenidos por M10 y M11) + 4 heredados por aserción** ([[design]] D8 filas
  8–11): `#41 R5` (clase de la columna y `selectable` del dueño, en un mismo
  `it`), `#41 R7` (hijos de la fila), `#62 R1` y `#98 R10`.

### R10 — Copy por clave

- **R10**: THE SYSTEM SHALL resolver por clave todo el copy nuevo de #146, y
  `src/__tests__/ui-copy-table.ts` SHALL exportar
  `export const R15_GEOFENCE_EDITOR: UseRow[]` con **27 filas**
  `{ file, key }`, una por ocurrencia de `t('…')`:

  - `src/app/_layout.tsx` (1): `geofenceEditor.title`;
  - `src/screens/geofences/index.tsx` (3): `geofenceEditor.editLabel`,
    `geofenceEditor.add`, `geofenceEditor.limitNotice` (R12);
  - `src/screens/geofence-editor/index.tsx` (23): `geofenceEditor.notFound`,
    `geofences.needsCollar`, `geofenceEditor.nameTaken`,
    `geofenceEditor.limitReached`, `geofenceEditor.invalid`,
    `common.cannotReachServer`, `common.somethingWentWrong`, `common.retry`,
    `geofenceEditor.nameLabel`, `geofenceEditor.mapHint`, `geofences.radius`,
    `geofenceEditor.radiusLabel`, `geofenceEditor.resetNote`,
    `geofenceEditor.save`; de R13 `geofences.statusActive` y
    `geofences.activeLabel`; de R14 `geofences.delete` (**dos filas**: el
    botón y el diálogo), `geofences.deleteTitle`, `geofences.deleteBody` y
    `geofences.cancel`; de R16 `geofenceEditor.ownerOnly` (**dos filas**: la
    tarjeta al crear y la nota de solo lectura).

  El bloque se añade al final de `ALL_USES` (tras `...R14_GEOFENCES,`) y a
  la línea de bloques `R12_ALERTS, R13_ALERT_DETAIL, R14_GEOFENCES,` →
  `R12_ALERTS, R13_ALERT_DETAIL, R14_GEOFENCES, R15_GEOFENCE_EDITOR,`.

  *Test*: `src/__tests__/ui-language.test.ts`,
  `describe('#146 R10: el editor de zonas resuelve su copy por clave')` ›
  `it('registra cada ocurrencia del editor y de sus entradas')`:
  `expect(R15_GEOFENCE_EDITOR).toHaveLength(27)`, que todo `file` sea uno de
  los tres de arriba, y `checkUses(R15_GEOFENCE_EDITOR)`. Va justo después
  del `describe('#41 R10: …')`.

  *Candado heredado*: `#65 R18`. `SCREEN_FILES` pasa a
  `toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1); // #100 R10, #41 R10, #146 R10`
  (la ampliación no añade ficheros de pantalla: el aviso va en la lista y la
  solo lectura en el editor).

  En el mismo commit rojo, el `it('cuadra ALL_USES con la suma de los doce bloques')`
  de `src/__tests__/ui-copy-table.ts` (el de la línea de bloques de arriba)
  se renombra a `it('cuadra ALL_USES con la suma de sus bloques')` (ya eran
  catorce antes de #146; P18, [[design]] D8 fila 16).

  Rojo por la vía (b) de C4: cuando R10 llega, el editor ya resuelve por
  clave, así que el commit rojo **planta** la mutación M13
  (`const retryKey = 'common.retry' as const;` y `t(retryKey)` en el
  editor) y el verde la revierte. Recuento: 1 rojo por aserción + `#65 R18`
  heredado.

### R11 — Pestaña Mapa: círculos de las zonas

- **R11**: THE SYSTEM SHALL hacer que `src/screens/map/index.tsx` lea las
  zonas de la mascota seleccionada con

  ```ts
  const geofences = useQuery({
    queryKey: geofenceKeys.list(selectedPetId ?? ''),
    queryFn: () => listGeofences(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  ```

  (misma forma que sus consultas `detail`, `last`, `positions` y `route`) y
  pase a su `PetMap` la prop `circles={circles}` de R3, con solo las zonas
  **activas** (P11):

  ```ts
  const circles = geofences.data?.kind === 'ok'
    ? geofences.data.geofences
        .filter(({ active }) => active)
        .map(({ id, centerLat, centerLng, radiusM }) => ({ id, center: { latitude: centerLat, longitude: centerLng }, radius: radiusM }))
    : [];
  ```

  WHILE la lista de zonas está pendiente o no es `ok` (`no-tracking`,
  `error`, `unreachable`, `missing-config`), THE SYSTEM SHALL pintar la
  pestaña igual que sin esta feature, con `circles` `[]`: la lista no entra
  en `isLoading`, no pinta error ni reintento propios y no condiciona el
  montaje de `PetMap` (sigue siendo `petsReady && last.data?.kind === 'ok'`).
  El `unauthorized` lo atiende el manejador global del `QueryCache`, como en
  cualquier otra consulta.

  THE SYSTEM SHALL NOT meter las zonas en el poll de `POLL_MS` del
  `useFocusEffect`: cambian solo por el editor, que invalida
  `geofenceKeys.list(petId)` al guardar, activar o borrar (R8, R13, R14), y
  esa invalidación recarga también esta consulta porque comparte clave.

  Imports: `listGeofences` de `'../../api/geofences'`, y `geofenceKeys` entra
  en el import que hoy es
  `import { petKeys, positionKeys, tripKeys } from '../../api/query-keys';`.

  *Test*: `src/screens/map/index.test.tsx`. El fichero gana un doble del
  módulo `../../api/geofences` con `listGeofences` como `jest.fn()`, que el
  `beforeEach` común deja **pendiente** con el helper `pending<T>()` del
  propio fichero, igual que ya deja `getLastPosition`, `listPositions` y
  `getDayRoute`: así ningún `it` existente cambia de comportamiento.
  `describe('#146 R11: la pestaña Mapa dibuja las zonas activas de la mascota')`,
  6 `it`:

  1. `'dibuja como círculos solo las zonas activas de la mascota'` — lista
     `ok` con Casa (`geofence-1`, 19.4 / -99.1, 150, activa) y Parque
     (`geofence-2`, 19.42 / -99.15, 600, inactiva); las `circles` que recibe
     la vista stub de expo-maps (leídas como ya lee `polylines` el
     `describe('R7: ruta del día como polylines')`), comparadas solo por
     `{ id, center, radius }`, son
     `[{ id: 'geofence-1', center: { latitude: 19.4, longitude: -99.1 }, radius: 150 }]`.
  2. `'pide las zonas de la mascota seleccionada con su token'` —
     `listGeofences` llamado con `(apiUrl, 'jwt-token', 'pet-1')`.
  3–4. `it.each(['pendiente', 'error'])('con la lista de zonas %s pinta el mapa sin círculos')`
     — **Declarado**: la vista se monta y recibe `circles` `[]`.
  5. `'no pide zonas sin mascota seleccionada'` — **Declarado**: con
     `listPets` en `{ kind: 'ok', pets: [] }`, `listGeofences` no se llama.
  6. `'el poll de 15 s no vuelve a pedir las zonas'` — **Declarado**: con los
     timers falsos del `describe('#94 R7: el poll refresca también el detalle')`,
     tras avanzar 15000 ms `listGeofences` sigue con una sola llamada.

  Recuento: **6 `it`: 2 rojos por aserción** (1: la vista recibe `[]`; 2:
  `listGeofences` no se llama) **y 4 Declarado** (3–4 por M18, 5 por M19, 6
  por M20, [[design]] §Mutaciones) **+ 1 heredado por aserción**: `#87 R18`
  ([[design]] D8 fila 13), que gana la clave de zonas y pierde el "cinco"
  del título (P18).

  El commit verde corre también `src/components/__tests__/pet-map.test.tsx`.

### R12 — Lista: límite de 5 zonas en el cliente

- **R12**: THE SYSTEM SHALL exportar desde `src/api/geofences.ts`, justo
  antes de la línea `export type GeofenceListState =`,

  ```ts
  /** Espejo de GEOFENCE_MAX_PER_PET de backend-pet-tracker/src/modules/geofences/geofences.constants.ts. */
  export const GEOFENCE_MAX_PER_PET = 5;
  ```

  con el mismo nombre que la constante del backend, para que un `git grep`
  las encuentre juntas (P12).

  WHILE quien mira es el dueño AND la lista es `ok` con
  `GEOFENCE_MAX_PER_PET` zonas o más, THE SYSTEM SHALL, en
  `src/screens/geofences/index.tsx`:

  - calcular, justo después de `const isOwner = …`,
    `const atLimit = geofences.data?.kind === 'ok' && geofences.data.geofences.length >= GEOFENCE_MAX_PER_PET;`;
  - pintar `geofences-add` (R9) con `isDisabled={busy || atLimit}`;
  - pintar como **hermano siguiente** de `geofences-add`, dentro de la misma
    condición de R9 (dueño y lista `ok`), solo si `atLimit`,
    `<Text testID="geofences-limit" className="text-sm font-normal text-muted">{t('geofenceEditor.limitNotice', { max: GEOFENCE_MAX_PER_PET })}</Text>`.

  El error de acción sigue siendo el último hijo. El
  `400 MAX_GEOFENCES_REACHED` y `geofenceEditor.limitReached` del editor se
  quedan (R4, R8): cubren la carrera de dos dispositivos creando a la vez.

  *Test*: `src/screens/geofences/index.test.tsx`. El doble del módulo
  `../../api/geofences` del fichero **conserva la constante real** (la toma
  con `jest.requireActual`, no la reescribe): si el doble la omitiera, la
  pantalla leería `undefined`, `length >= undefined` es `false` y el aviso no
  saldría nunca, en silencio. `describe('#146 R12: con el máximo de zonas la lista no ofrece añadir otra')`,
  4 `it`:

  1. `'con cinco zonas deshabilita Añadir zona y pinta el aviso del máximo justo después'`
     — asevera **primero** `accessibilityState.disabled` `true` de
     `geofences-add`; luego el texto
     `'Esta mascota ya tiene 5 zonas, el máximo. Elimina una para añadir otra.'`
     y que en los `childTestIds` del contenido de la lista
     `geofences-limit` va justo detrás de `geofences-add`.
  2. `'con cuatro zonas deja Añadir zona habilitada y sin aviso'` —
     **Declarado**.
  3. `'no pinta el aviso a quien no es dueño aunque haya cinco zonas'` —
     **Declarado** (`family`).
  4. `'pinta el aviso del máximo en inglés'` —
     `'This pet already has 5 zones, the maximum. Delete one to add another.'`

  Las cinco zonas del fixture se construyen con el `makeGeofence` del
  fichero (ids `geofence-1` … `geofence-5`). Recuento: **4 `it`: 1 rojo por
  aserción (1), 1 por consulta (4: no hay `geofences-limit`) y 2 Declarado**
  (2 por M21, 3 por M22).

### R13 — Editor: activar y desactivar

- **R13**: THE SYSTEM SHALL extraer el cuerpo de Guardar (R8) a una función
  local del formulario y llamarla desde los tres sitios que escriben
  (Guardar, este interruptor y Eliminar de R14):

  ```ts
  async function run(
    request: () => Promise<GeofenceSaveState | GeofenceWriteState>,
    onOk: () => unknown,
  ) {
    setBusy(true); setError(null);
    try {
      const result = await request();
      if (result.kind === 'ok') await onOk();
      else if (result.kind === 'unauthorized') await signOut();
      else setError(messageFor(t, result.kind));
    } catch { setError(messageFor(t, 'error')); } finally { setBusy(false); }
  }
  const refresh = () => queryClient.invalidateQueries({ queryKey: geofenceKeys.list(petId) });
  const leave = () => { void refresh(); router.back(); };
  ```

  Guardar pasa a `run(() => (geofenceId ? updateGeofence(…) : createGeofence(…)), leave)`
  con el mismo borrador de R8. Un solo `signOut(` en el fichero (el candado
  `#87 R19` no se mueve más que en R8). `GeofenceWriteState` se importa de
  `../../api/geofences` como tipo.

  WHILE se edita una zona (`zone` definida, R6) AND quien mira es el dueño
  (R16), THE SYSTEM SHALL pintar en el formulario, **entre el slider y la
  nota de reinicio**,

  ```tsx
  <View testID="geofence-editor-active-row" className="flex-row items-center justify-between gap-3">
    <Text className="font-semibold text-foreground">{t('geofences.statusActive')}</Text>
    <Switch testID="geofence-editor-active" isSelected={zone.active} hitSlop={10} isDisabled={busy}
      accessibilityLabel={t('geofences.activeLabel', { name: zone.name })}
      onSelectedChange={(active) => void run(() => setGeofenceActive(baseUrl, token ?? '', petId, zone.id, active), refresh)} />
  </View>
  ```

  (`Switch` de `heroui-native`, mismas props que el de la lista de #41).

  WHEN el dueño cambia el interruptor, THE SYSTEM SHALL escribir **en el
  acto** solo `{ active }` con `setGeofenceActive` (P13), recargar la lista
  con `refresh` y **quedarse en el editor**; el borrador (nombre, centro,
  radio) no se toca y Guardar sigue enviando solo
  `{ name, centerLat, centerLng, radiusM }` (P7). `busy` es el mismo de
  Guardar: mientras cualquiera de las dos escrituras vuela, Guardar y el
  interruptor están deshabilitados. Al crear no hay interruptor.

  *Test*: `src/screens/geofence-editor/index.test.tsx`; el doble de
  `../../api/geofences` del fichero gana `setGeofenceActive` (y
  `deleteGeofence` para R14), y `queryClient.invalidateQueries` se espía
  **sin reemplazar** su implementación (como en R8), para que la recarga
  ocurra de verdad.
  `describe('#146 R13: el interruptor del editor activa o desactiva la zona sin salir')`,
  7 `it`:

  1. `'pinta el interruptor de zona activa entre el slider y la nota de reinicio'`
     — con Casa: la fila con su clase exacta, el texto `'Activa'`, el switch
     con `role` `'switch'`, `accessibilityState` `{ checked: true, disabled: false }`,
     etiqueta `'Zona Casa activa'` y `hitSlop` 10; en los `childTestIds` del
     contenido del formulario, `'geofence-editor-radius'`,
     `'geofence-editor-active-row'` y `'geofence-editor-reset-note'` seguidos.
  2. `'desactivar escribe solo el estado, recarga la lista y se queda en el editor'`
     — `setGeofenceActive` una vez con `(apiUrl, 'token-1', 'pet-1', 'geofence-1', false)`;
     `updateGeofence` y `router.back` sin llamar; `invalidateQueries` con
     `{ queryKey: ['geofences', 'list', 'pet-1'] }`; la segunda respuesta de
     `listGeofences` trae Casa inactiva y el switch pasa a `checked: false`.
  3. `'deshabilita el interruptor y Guardar mientras escribe'` —
     `setGeofenceActive` pendiente.
  4. `'Guardar tras cambiar el interruptor envía el PATCH sin el estado'` —
     las claves del borrador que recibe `updateGeofence` son exactamente
     `['centerLat', 'centerLng', 'name', 'radiusM']` (`Object.keys(…).sort()`).
  5–6. `it.each(['not-found', 'unreachable'])('un fallo %s del interruptor pinta el error bajo el formulario y no vuelve')`
     — el texto de `messageFor` (como en R8 7–14), `router.back` sin llamar.
  7. `'un 401 del interruptor cierra sesión una vez'`

  Recuento: **7 `it`, 7 rojos por consulta** (no hay
  `geofence-editor-active`). Los 16 `it` de R8 siguen verdes tras extraer
  `run` (se corre la suite entera del editor en el verde).

### R14 — Editor: eliminar

- **R14**: WHILE se edita una zona (`zone` definida) AND quien mira es el
  dueño (R16), THE SYSTEM SHALL pintar en el formulario, **justo después de
  Guardar** y antes del error,

  ```tsx
  <Button testID="geofence-editor-delete" variant="danger-soft" className="rounded-xl bg-danger-soft" isDisabled={busy} onPress={confirmDelete}>
    <Button.Label className="font-semibold text-danger">{t('geofences.delete')}</Button.Label>
  </Button>
  ```

  (tamaño por defecto `md`, sin `accessibilityLabel` propio: la etiqueta
  visible es el nombre accesible), con `confirmDelete` idéntico en forma al
  de la lista de #41:

  ```ts
  Alert.alert(t('geofences.deleteTitle', { name: zone.name }), t('geofences.deleteBody'), [
    { text: t('geofences.cancel'), style: 'cancel' },
    { text: t('geofences.delete'), style: 'destructive',
      onPress: () => void run(() => deleteGeofence(baseUrl, token ?? '', petId, zone.id), leave) },
  ]);
  ```

  WHEN el dueño confirma, THE SYSTEM SHALL borrar con `deleteGeofence` y,
  con `ok`, invalidar `geofenceKeys.list(petId)` **antes** de
  `router.back()` (el `leave` de R13, P14). Con cualquier otro `kind`, el
  error de `messageFor` bajo el formulario y sin volver; con
  `unauthorized`, `signOut`. Cancelar no escribe. `busy` es el compartido:
  Guardar, el interruptor y Eliminar se deshabilitan juntos. Al crear no hay
  Eliminar.

  Orden de los hijos del contenido del formulario del dueño al editar:
  nombre, `geofence-editor-map-hint`, `geofence-editor-radius-value`,
  `geofence-editor-radius`, `geofence-editor-active-row`,
  `geofence-editor-reset-note`, `geofence-editor-save`,
  `geofence-editor-delete` (y el error, si lo hay). Al crear: nombre,
  `map-hint`, `radius-value`, `radius`, `save`.

  *Test*: mismo fichero; `Alert.alert` espiado con
  `jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)` en el
  `beforeEach` del `describe` y el botón del diálogo elegido del último
  `mock.calls` por su `text`, como en `#41 R7`.
  `describe('#146 R14: Eliminar en el editor borra la zona y vuelve a la lista')`,
  9 `it`:

  1. `'pinta Eliminar con la receta de peligro justo después de Guardar'` —
     clase
     `'pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-md rounded-xl bg-danger-soft'`,
     etiqueta
     `'button__label button__label--variant-danger-soft button__label--size-md font-semibold text-danger'`
     con texto `'Eliminar'`, `accessibilityState.disabled` `false`.
  2. `'ordena el formulario del dueño al editar'` — `childTestIds` del
     contenido igual a
     `[undefined, 'geofence-editor-map-hint', 'geofence-editor-radius-value', 'geofence-editor-radius', 'geofence-editor-active-row', 'geofence-editor-reset-note', 'geofence-editor-save', 'geofence-editor-delete']`.
  3. `'al crear no pinta ni el interruptor ni Eliminar'` — **Declarado**.
  4. `'pide confirmación con el nombre de la zona y Cancelar no borra'` —
     título `'¿Eliminar Casa?'`, cuerpo el de `geofences.deleteBody`, botones
     `[{ text: 'Cancelar', style: 'cancel' }, { text: 'Eliminar', style: 'destructive' }]`
     (comparados por `text` y `style`); pulsar Cancelar deja
     `deleteGeofence` sin llamar.
  5. `'al confirmar borra una vez y vuelve a la lista recargada'` —
     `deleteGeofence` con `(apiUrl, 'token-1', 'pet-1', 'geofence-1')`;
     `invalidateQueries` antes de `router.back` (`mock.invocationCallOrder`).
  6. `'deshabilita Eliminar, Guardar y el interruptor mientras borra'`
  7. `'un fallo al borrar pinta el error y no vuelve'` — `unreachable`.
  8. `'un 401 al borrar cierra sesión una vez'`
  9. `'pinta Eliminar en inglés'` — `'Delete'` y título `'Delete Casa?'`.

  Recuento: **9 `it`: 7 rojos por consulta** (1, 4–9: no hay
  `geofence-editor-delete`), **1 por aserción** (2: falta el último id) **y
  1 Declarado** (3, por M23). Ningún candado heredado cuenta botones
  `danger-soft` (el de `#61 R1` en `legibility-classnames.test.ts` mira un
  tag concreto de otra pantalla; [[design]] D8 "Verificado que no
  cambia").

### R15 — `isGeofence` valida el centro

- **R15**: WHEN `listGeofences` recibe un 200 con alguna zona cuyo
  `centerLat` o `centerLng` no sea `number`, THE SYSTEM SHALL devolver
  `{ kind: 'error' }`, como ya hace con `name`, `radiusM` o `active` mal
  tipados. `isGeofence` de `src/api/geofences.ts` añade a su conjunción
  `typeof item.centerLat === 'number' && typeof item.centerLng === 'number'`
  (solo `typeof`, igual que `radiusM`: un JSON no transporta `NaN` ni
  `Infinity`, P15). Cierra la errata E13: el editor (R6) y la pestaña Mapa
  (R11) leen el centro de la lista sin otra comprobación.

  *Test*: `src/api/__tests__/geofences.test.ts`,
  `describe('#146 R15: listGeofences rechaza una zona sin centro numérico')`,
  1 `it.each` de 3 filas `('maps %s to error')`, cada una construida desde
  `makeGeofence('zone-1')` del fichero cambiando **solo** el centro:

  | Fila | Zona |
  |---|---|
  | `'a string centerLat'` | `centerLat: '19.4'` |
  | `'a missing centerLng'` | sin la clave `centerLng` |
  | `'a null centerLat'` | `centerLat: null` |

  y la misma aserción que `#41 R2` (`resolves.toEqual({ kind: 'error' })`).
  En el mismo commit rojo se reescribe la fila `'an item without name'` de
  `#41 R2` para que parta de `makeGeofence('zone-1')` sin la clave `name`
  (hoy es `{ id, radiusM, active }`, que tampoco trae centro: tras R15
  seguiría en rojo aunque se quitara la comprobación de `name`;
  [[design]] D8 fila 14). Recuento: **3 `it`, 3 rojos por aserción**
  (devuelve `ok`).

### R16 — Editor: solo lectura para quien no es dueño

- **R16**: THE SYSTEM SHALL leer el rol en el editor con la **misma**
  consulta y el mismo cálculo que la lista de #41
  (`src/screens/geofences/index.tsx`), sin helper compartido:

  ```ts
  const pet = useQuery({ queryKey: petKeys.detail(petId), queryFn: () => getPet(baseUrl, token ?? '', petId) });
  const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';
  ```

  (`getPet` de `../../api/pets`, `petKeys` de `../../api/query-keys`). Un
  rol que falla al leerse (`error`, `unreachable`, `missing-config`) cuenta
  como **no dueño**, igual que en la lista; su `unauthorized` lo cierra el
  `QueryCache` global.

  THE SYSTEM SHALL ampliar las ramas sin formulario de R6:

  - la rama 1 (esqueleto) añade `|| pet.data === undefined` a su condición;
  - tras la rama 5, una **rama 6**: al crear (`!geofenceId`) y sin ser
    dueño, `Card testID="geofence-editor-owner-only"` (`items-center py-8`)
    con un `Text` `text-center font-normal text-muted` y
    `t('geofenceEditor.ownerOnly')`.

  WHILE se edita una zona AND quien mira no es dueño, THE SYSTEM SHALL
  montar `GeofenceEditorForm` con `readOnly` (prop `readOnly={!isOwner}`),
  que:

  - pasa a `PetMap` `onPress={readOnly ? undefined : setCenter}`: el mapa
    no registra toques (R3 no añade `onMapClick` / `onPOIClick` /
    `onCircleClick`) y dibuja los mismos `circles` de R6, con la zona en su
    centro y radio guardados;
  - pinta como contenido del formulario, en este orden y **nada más**:
    1. `Text testID="geofence-editor-name-text" selectable className="font-bold text-foreground"`
       con `zone.name`;
    2. el mismo `geofence-editor-radius-value` de R6 (un solo nodo con
       `TABULAR_NUMS` en el fichero, R18);
    3. `Text testID="geofence-editor-read-only" className="text-sm font-normal text-muted"`
       con `t('geofenceEditor.ownerOnly')`.

  Sin campo de nombre, pista, slider, interruptor, nota de reinicio,
  Guardar ni Eliminar. La lista de #41 sigue sin ofrecer el editor a quien
  no es dueño (R9 sin cambios, P16): esta rama cubre la URL abierta a mano
  y el rol que cambia con la pantalla abierta.

  *Test*: `src/screens/geofence-editor/index.test.tsx`; el fichero gana un
  doble de `../../api/pets` con `getPet` que en el `beforeEach` común
  resuelve un perfil `ok` con `myRole: 'owner'` (así R6–R14 siguen siendo
  el dueño sin tocarlos).
  `describe('#146 R16: quien no es dueño ve la zona sin poder editarla')`,
  9 `it`:

  1. `'pinta el esqueleto mientras carga el rol'` — `getPet` pendiente y la
     lista `ok`.
  2–5. `it.each(['family', 'walker', 'vet', 'un error al leer el rol'])('al editar como %s pinta la zona en solo lectura')`
     — asevera **primero** `childTestIds` del contenido del formulario igual
     a `['geofence-editor-name-text', 'geofence-editor-radius-value', 'geofence-editor-read-only']`;
     luego `'Casa'`, `'Radio de 150 m'`, el texto
     `'Solo el dueño de la mascota puede crear o editar zonas.'` y
     `queryByTestId` nulo para `geofence-editor-name`,
     `geofence-editor-radius`, `geofence-editor-active`,
     `geofence-editor-save` y `geofence-editor-delete`. La fila del error es
     `getPet` resuelto `{ kind: 'error' }`.
  6. `'en solo lectura el mapa no registra toques y dibuja la zona guardada'`
     (`family`) — `onMapClick`, `onPOIClick` y `onCircleClick` de la vista
     stub `undefined`; el círculo de Casa en 19.4 / -99.1 con radio 150.
  7. `'al crear sin ser dueño pinta la tarjeta de solo dueño'` (`walker`).
  8. `'pinta la solo lectura en inglés'` —
     `"Only the pet's owner can create or edit zones."`
  9. `'pide el rol de la mascota con su token'` — `getPet` con
     `(apiUrl, 'token-1', 'pet-1')`.

  Recuento: **9 `it`: 6 rojos por aserción** (2–6, 9) **y 3 por consulta**
  (1, 7, 8).

### R17 — `DEFAULT_CENTER` en un solo sitio

- **R17**: THE SYSTEM SHALL declarar el centro por defecto del mapa una
  sola vez, en `src/components/pet-map.tsx`, justo después de
  `export const MAP_ZOOM = 16;`:

  ```ts
  export const DEFAULT_CENTER: MapCoordinates = { latitude: 19.4326, longitude: -99.1332 };
  ```

  y la pestaña Mapa (`src/screens/map/index.tsx`) SHALL borrar su
  `const DEFAULT_CENTER = {` local e importarlo, ampliando su
  `import { PetMap } from '../../components/pet-map';` a
  `import { DEFAULT_CENTER, PetMap } from '../../components/pet-map';`. El
  uso (`: DEFAULT_CENTER;` en el cálculo de `center`) no cambia. El editor
  (R6) lo importa del mismo módulo (P17).

  *Test*: `src/__tests__/design-drift.test.ts`, al final del fichero,
  `describe('#146 R17: el centro por defecto del mapa vive en un solo sitio')`,
  con su propio filtro de producción, igual al de `#94 R5`
  (`filesMatching(pattern).filter((path) => !/\.test\.tsx?$/.test(path))`,
  local al `describe`), 2 `it`:

  1. `'declara DEFAULT_CENTER solo en el componente del mapa'` —
     ficheros de producción que casan `/\bconst DEFAULT_CENTER\b/` igual a
     `[join('components', 'pet-map.tsx')]`.
  2. `'escribe las coordenadas por defecto solo en el componente del mapa'`
     — ficheros de producción que casan `/19\.4326|-99\.1332/` igual a
     `[join('components', 'pet-map.tsx')]`.

  `filesMatching` devuelve rutas relativas a `src` con el separador del
  sistema: la expectativa se construye con el `join` que el fichero ya
  importa (lo usa `const sourceRoot = join(process.cwd(), 'src');`).
  Recuento: **2 `it`, 2 rojos por aserción** (hoy dan
  `[join('screens', 'map', 'index.tsx')]`). Se ejecuta tras R3 y antes de
  R6, así el editor nace importándolo. El verde corre también la suite de
  la pestaña Mapa (`src/screens/map/index.test.tsx`), que no cambia.

### R18 — El editor entra en los contadores de `TABULAR_NUMS`

- **R18**: THE SYSTEM SHALL contar el editor entre los contadores con
  cifras tabulares: `src/screens/geofence-editor/index.tsx` importa
  `TABULAR_NUMS` con un `import { … } from '../../theme/native-styles';`
  con llaves (la forma que lee el candado; puede ir en varias líneas, como
  en la pestaña Mapa) y lo aplica **exactamente una vez**, en
  `geofence-editor-radius-value` (R6), que el dueño y la solo lectura (R16)
  comparten como un único nodo del JSX.

  *Test*: `src/__tests__/consistency-classnames.test.ts`,
  `describe('#62 R15: todo contador usa cifras tabulares')`:

  - `const counters` gana, tras
    `[join('screens', 'reminders', 'index.tsx'), 3],`, la fila
    `[join('screens', 'geofence-editor', 'index.tsx'), 1],` (+1 caso del
    `it.each(counters)('%s aplica TABULAR_NUMS a sus %i valores')`);
  - `it('#69 R10: mantiene la base cerrada más los deltas medidos')` pasa de
    `14 + 4 + 1 + 1 + 1 + 1,` a `14 + 4 + 1 + 1 + 1 + 1 + 1, // #146 R18`.

  Recuento: **1 `it` nuevo (la fila), Declarado**: el editor ya lo cumple
  desde R6. Va por la vía (b) de C4: el commit rojo añade la fila y el
  sumando **y** planta M24 (quita `style={TABULAR_NUMS}` de
  `geofence-editor-radius-value`), que cae en la fila nueva
  (`source.match(…)` da `null`); el verde revierte M24. `#69 R10` sigue
  verde en los dos commits (cuenta las filas, no el fuente).
  [[design]] D8 fila 17.

## Enmiendas a docs (gate propio)

Codex aplica la enmienda **después** de la firma de su casilla y **antes**
del primer commit rojo, en un commit propio
`docs(specs): apply amendment A19 of #146`. `<fecha>` es la fecha del commit
que firma la casilla.

- **A19 — lista de A11 en los docs.** El editor es una pantalla empujada con
  cabecera nativa y métricas A11 (R6), así que entra en la lista de la
  excepción. En `docs/conventions.md` y en `docs/ui-guidelines.md`, Codex
  sustituye **literal** este fragmento (único en cada fichero en `95b2aaa4`):

  ```
  `meal-schedule`, `pairing`, `reminders`, `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23), `alerts/[alertId]` (por la enmienda A15 de #100, 2026-09-28) y `pets/[petId]/geofences` (por la enmienda A18 de #41, 2026-10-02)—
  ```

  por este otro:

  ```
  `meal-schedule`, `pairing`, `reminders`, `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23), `alerts/[alertId]` (por la enmienda A15 de #100, 2026-09-28), `pets/[petId]/geofences` (por la enmienda A18 de #41, 2026-10-02) y `pets/[petId]/geofence-editor` (por la enmienda A19 de #146, <fecha>)—
  ```

  Comprobaciones:
  - `grep -c 'enmienda A19 de #146' docs/conventions.md docs/ui-guidelines.md`
    → `1` en cada uno;
  - `src/__tests__/hero-header-amendments.test.ts` sigue verde.

  **A19 es el siguiente id libre** en `95b2aaa4`: A18 es la última aplicada
  (#41) y ninguna spec ni doc de ese árbol reserva la A19. Si otra feature
  la toma antes del handoff, el leader renumera aquí y en la casilla.

## Fuera de alcance

### Delimitaciones (no son features: marcan el borde de esta)

- **iOS / `AppleMaps`.** Las props nuevas viajan en `mapViewProps`, que hoy
  solo recibe `GoogleMaps.View`. Que lleguen a `AppleMaps.View` lo verifica
  #60 (aparcada). En Apple, `onCircleClick` no trae coordenadas y no hay
  toque de POI (errata E6).
- **Círculos en la pestaña Mapa** (Make §1.2), **polígonos** y **zonas
  compartidas entre mascotas**: fuera por la propia descripción.
- **Borrar y activar/desactivar** siguen en la lista de #41; el editor no
  los ofrece.
- **Arrastrar el centro.** expo-maps no tiene eventos de arrastre de marker
  y `onMapLongClick` es solo de Google: el centro se fija con un toque.
- **Contar el límite de 5 en el cliente.** `Añadir zona` aparece también con
  5 zonas; el límite lo dice el `400 MAX_GEOFENCES_REACHED` (P6).
- **Rol en el editor.** El editor no consulta `myRole`; un 403 pinta el
  error genérico (§Qué firma, delimitación de rol).
- **Revalidar `centerLat`/`centerLng` de la lista.** `isGeofence` de #41 D2
  solo comprueba `id`, `name`, `radiusM` y `active`, y decía que "#146 lo
  revalidará al editar". Esta spec **no** lo hace (errata E13): el editor
  confía en el tipo, como la lista.
- **Comportamiento del teclado** sobre el formulario: solo lo cubre la prueba
  de humo (paso 9), jest no lo ve.

### Deuda candidata (para registrar en `feature_list.json` al cerrar, si el humano quiere)

- `DEFAULT_CENTER` queda duplicado entre `src/screens/map/index.tsx` (local,
  sin exportar) y el editor.
- El título `'deja los trece botones primarios sólidos en un único radio'`
  de `#62 R1` sigue diciendo "trece" con `13 + 1 + 1`; y
  `'cuadra ALL_USES con la suma de los doce bloques'` dice "doce" con quince
  bloques. No se renombran títulos aprobados.
- La suma de `SCREEN_FILES` sigue creciendo a mano.
- El `TABULAR_NUMS` del editor no entra en los contadores de `#62 R15`, que
  solo miran ficheros listados.

## Coordinación con otras sesiones

- **#60 está aparcada** (`286c94bd`) y dejó de ser dependencia el
  2026-10-02 por decisión del humano. Esta spec se escribe contra el
  `PetMap` de `main` (blob `08c6e385`; test, blob `1e94de45`), idénticos en
  `95b2aaa4`.
- **Quien mergee segundo resuelve** `src/components/pet-map.tsx` y
  `src/components/__tests__/pet-map.test.tsx`. Por eso las props nuevas van
  dentro del objeto `mapViewProps` y no sueltas en el JSX: es el punto por el
  que #60 reparte a `GoogleMaps.View` y `AppleMaps.View`.
- **#60 debe verificar** que `circles`, `zoom` y los manejadores de toque
  llegan a `AppleMaps.View` (y decidir qué hace con `onCircleClick` sin
  coordenadas y sin POI, errata E6).
- **La comprobación en iOS espera a #60** y queda fuera del gate de #146: la
  prueba de humo de esta spec es solo en dev build de Android.
- **#41** no cambia: esta spec modifica su pantalla y su test (R9) y la
  lista de A11 (A19), pero no su spec. Las aserciones de #41 que cambian
  están inventariadas en [[design]] D8.
- **Candados compartidos.** El catálogo (`#65 R12`), la sección §2.x de
  `specs/mobile-ui-language/design.md`, los nombres de bloque de
  `ui-copy-table.ts` (`R15_…`), los recuentos de `#62 R1` y `#98 R10`, la
  lista de `#87 R19` y el id A19 son sitios donde cualquier feature móvil
  paralela escribe. Si otra mergea antes, el leader re-ancla por contenido al
  hacer el handoff y renumera lo que choque (§2.16, `R15`, A19).

## Verificación

- **Comandos dirigidos.** Se lanzan **desde `mobile-pet-tracker/`** con
  `--runTestsByPath`, rutas con corchetes **entre comillas simples** y sin
  pipe: `bunx jest --runTestsByPath '<ruta>' … > /tmp/x.log 2>&1; echo "exit=$?"`
  (`docs/conventions.md` §Filtros de jest). La lista exacta por requisito
  vive en [[tasks]]. El número de suites que imprime jest coincide con el de
  ficheros pedidos.
- **Delta de cierre contra la base medida al arrancar**: **+2 suites**
  (`src/utils/zoom-for-radius.test.ts` y
  `src/screens/geofence-editor/index.test.tsx`) y **+101 tests**, con el
  reparto por fichero de [[design]] §Delta de tests. Ninguna suite pasa de
  verde a roja.
- **Recorridos del router real.** Los ocho ficheros de [[tasks]]
  §Conjuntos comunes siguen verdes con la ruta nueva: se corren en el verde
  de R5. Si alguno sale rojo, Codex para y lo reporta.
- **Typecheck y lint.** `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit`
  y `bunx expo lint`, con **`exit=0` y salida vacía**, también en cada
  verde intermedio (por eso R6 solo introduce estado de lectura, R7 los
  setters y R8 `signOut`, `useQueryClient` y `router`). Si `router.d.ts`
  existe, Codex **no** lo borra: pide al humano que lo borre.
- **C8** (`CHECKPOINTS.md`): cero hex fuera de `src/theme/`, cero clases
  arbitrarias (ningún `-[` en código ni en texto de test nuevos), cero
  `StyleSheet.create`, cero sombras legacy, métricas vía A11, ningún
  `<TextInput` crudo (`#62 R12`), y todo `Text` que no es dato con
  `className` explícita.
- **Búsquedas que deben salir vacías:**
  - `git grep -n "queryKey: \[" -- mobile-pet-tracker/src/screens/geofence-editor`
    (las claves salen de `geofenceKeys` y `positionKeys`);
  - `git grep -n "useMutation\|useFocusEffect\|staleSeconds" -- mobile-pet-tracker/src/screens/geofence-editor`;
  - `git grep -n "#146[^ ]\|#146 [^R]" -- mobile-pet-tracker/src` (todo
    `#146` va seguido de ` R<n>`).
- **Ficheros intocables:**
  `git diff <HEAD del handoff> -- backend-pet-tracker infra mobile-pet-tracker/package.json mobile-pet-tracker/app.json mobile-pet-tracker/bun.lock`
  sale vacío: no hay dependencias nuevas (`heroui-native` trae el `Slider`;
  `expo-maps` ya está).

## Prueba de humo del humano (no delegable a IA)

Runtime: **dev build de Android** (paquete `com.trackermex.pettracker`),
nunca Expo Go. **No se regenera**: no entra ningún módulo nativo
(`expo-maps` y `heroui-native` ya están en el build). La app va en español
salvo en el paso 10. iOS queda fuera (§Coordinación).

**Precondiciones**

- **Metro y backend.** Metro sirve el branch de #146 al dev build y el
  backend de tu LAN está arriba. `EXPO_PUBLIC_API_URL` ya termina en `/v1`;
  `<API>` es ese valor tal cual, **sin añadir otro `/v1`**.
- **Token y mascota.** `<jwt>` y `<petId>` (mascota con collar y suscripción
  activa) como en la prueba de humo de #41 (§Precondiciones de
  `specs/mobile-geofences/requirements.md`), con `curl.exe` en Windows.
- **Zonas de partida.** La mascota tiene **4 zonas** (las Casa y Parque de
  #41 más dos cualesquiera creadas con el mismo `curl.exe -X POST`), para
  llegar al límite en el paso 6.
- **adb.** Usa **siempre** `adb -s <ip:puerto>` (el teléfono sale dos veces
  en `adb devices -l`; en Windows, `adb devices -l | findstr 192.168`).

**Pasos**

- [ ] 1. **Entrada.** Perfil → Zonas seguras. Bajo la lista aparece
      **Añadir zona** con la receta primaria. Tócalo: se abre "Zona segura"
      con la cabecera nativa y el botón atrás.
- [ ] 2. **Crear.** El mapa centra en la última posición de la mascota con un
      círculo de 150 m. Escribe "Paseo", toca otro punto del mapa: el
      círculo se mueve y **la cámara no**. Guarda: vuelves a la lista y
      "Paseo" ya está (5 zonas).
- [ ] 3. **Toques en POI y en círculo.** Abre Añadir zona otra vez. Toca un
      POI (un comercio con icono): el centro salta ahí. Toca dentro de un
      círculo existente: el centro salta al punto tocado. Vuelve atrás sin
      guardar.
- [ ] 4. **TalkBack.** Ajustes → Accesibilidad → TalkBack activado. En el
      editor, enfoca el slider: anuncia "Radio de la zona". Desliza arriba y
      abajo con un dedo: el radio sube y baja de 10 en 10 y el mapa encuadra
      el círculo. Desactiva TalkBack.
- [ ] 5. **Nombre repetido.** Crea una zona llamada "Casa": bajo Guardar sale
      "Ya tienes una zona con ese nombre." y el borrador sigue ahí.
- [ ] 6. **Límite.** Con 5 zonas, crea "Sexta": sale "Esta mascota ya tiene
      el máximo de zonas.".
- [ ] 7. **Editar.** En la lista, toca el **nombre** de "Paseo" y luego,
      tras volver, su **radio**: los dos abren el editor con nombre, centro
      y radio precargados y la nota de reinicio visible. Mueve el slider a
      otro radio y guarda: la lista muestra el radio nuevo.
- [ ] 8. **Sin rebote.** En el editor, arrastra el mapa lejos del círculo y
      toca un punto: el centro se mueve y la cámara **no** vuelve atrás.
- [ ] 9. **Teclado.** Toca el nombre: con el teclado abierto, Guardar sigue
      alcanzable haciendo scroll en el formulario.
- [ ] 10. **Tema e idioma.** En tema oscuro, mapa oscuro y círculos visibles.
      En inglés, "Safe zone", "Add zone" y "Save".
- [ ] 11. **Limpieza.** Borra "Paseo" y las dos zonas extra:
      `curl.exe -X DELETE -H "Authorization: Bearer <jwt>" "<API>/pets/<petId>/geofences/<geofenceId>"`.

- [ ] Prueba de humo superada (fecha: ____)

## Riesgos

- **#41 aún no está en `main`.** La spec se escribió sobre `95b2aaa4`. Si
  #41 cambia antes de mergear (p. ej. por su prueba de humo), las anclas de
  R9 y D8 pueden moverse: el leader las re-verifica con `grep -F` antes del
  handoff.
- **Base sin medir.** El delta (+101 / +2) se suma a la base que el leader
  mida en el árbol del handoff.
- **El `Slider` real y los gestos no los ve jest.** Los tests usan un doble
  del `Slider` (D5) y la vista stub de expo-maps; el arrastre del thumb, el
  paneo del mapa y TalkBack solo los cubre la prueba de humo (pasos 3, 4 y 8).
- **Reaplicación de la cámara.** React Native compara las props objeto por
  valor (`deepDiffer`), así que un `cameraPosition` igual en valor no se
  reenvía y el mapa no rebota tras un paneo. Riesgo bajo; lo cubre el paso 8.
- **P4 se aparta de la descripción** (zonas dibujadas en el editor, no en la
  lista) y **P6 cambia aserciones aprobadas de #41** (D8).
- **D7 (`selectable={!isOwner}`).** Decidido ahora para no depender de la
  prueba de humo: si se mantuviese `selectable` dentro del `Pressable`, el
  toque sobre el nombre podría no abrir el editor en Android y haría falta
  una enmienda. El paso 7 toca el nombre a propósito.
- **Primer `invalidateQueries` de `src/`.** No hay precedente en el árbol; la
  forma está fijada en R8 y su orden frente a `router.back()` lo asevera R8
  it 1 (M8).
- **Teclado** sobre el formulario: solo prueba de humo (paso 9).
- **#60 aparcada:** iOS sin verificar (§Coordinación).
- **Choques en candados compartidos** (catálogo, §2.16, `R15_…`, A19):
  §Coordinación.
- **Un literal del editor que coincida con un valor del catálogo** haría
  saltar el escaneo de literales de `#65 R18`. Todo el copy va por `t(…)`, así
  que no se espera; si salta, Codex para y lo reporta.

## Aprobación

> Tres casillas, tres gates (lección `gate-humano-sin-casilla-donde-firmar`):
>
> - la de A19 autoriza cambiar texto normativo ajeno;
> - la de la spec autoriza implementar y firma P1–P10 y D7;
> - la de §Prueba de humo cierra la feature.

### Enmienda A19 — lista de A11 en `docs/conventions.md` y `docs/ui-guidelines.md`

- [ ] Enmienda A19 aprobada por humano (fecha: ____)

### Aprobación de la spec

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
