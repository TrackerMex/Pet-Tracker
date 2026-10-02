---
feature: "mobile-geofence-editor"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-geofence-editor]]

> Bases: `95b2aaa4` (R1–R10) y `d637757e` (R11–R18), mismo código móvil.
> Anclas por contenido (§Anclas). Las decisiones de producto P1–P18 están en
> [[requirements]] §Qué firma.

## Decisiones técnicas

### D1 — Ruta propia con route delgado

Mismo patrón que #41 R4 (`docs/conventions.md`, estructura Expo desde #39):
el route solo lee los params y monta la pantalla de `src/screens/`. Un único
route para crear y editar: `geofenceId` ausente = crear. Se navega con
`router.push({ pathname: '/pets/[petId]/geofence-editor', params })`
(typedRoutes acepta el pathname con corchetes). Sin `dangerouslySingular`:
dos editores apilados de zonas distintas son legítimos y el route no se
reutiliza entre mascotas.

### D2 — `PetMap` crece por `mapViewProps` (guía de expo-maps)

Codex no tiene skill de mapas; lo que necesita de `expo-maps` ~57.0.1 está
aquí:

- `GoogleMaps.View` acepta `circles: { id?, center: { latitude, longitude }, radius /* metros */, color?, lineColor?, lineWidth? }[]`.
- Manejadores: `onMapClick({ coordinates })`, `onPOIClick({ name, coordinates })`
  y `onCircleClick(circle)` con el punto en `circle.clickCoordinates`. **Un
  toque sobre un POI o un círculo no dispara `onMapClick`** (errata E7): por
  eso se registran los tres.
- `Coordinates` tiene `latitude` y `longitude` **opcionales** (E11): el
  `forward` local solo llama a `onPress` si las dos son `number`.
- No hay eventos de arrastre de marker; `onMapLongClick` es solo de Google;
  `onCameraMove` dispara con frecuencias distintas en Android e iOS: no se usa
  ninguno.
- La vista reaplica `cameraPosition` cada vez que cambia su valor (D3).

Las props son opcionales y la pestaña Mapa no pasa ninguna: su contrato no
cambia salvo `circles: []`, que pinta nada. Los manejadores solo existen si
llega `onPress`, para no registrar toques en la pestaña Mapa. El relleno usa
`tab-pill` (verde translúcido, `rgba(23,130,85,0.14)` claro y `0.22` oscuro)
y el borde `accent-strong`, el color de la polilínea: el mismo verde en dos
intensidades, sin hex nuevos (C8).

### D3 — La cámara no persigue el borrador

El formulario guarda `camera` (`{ center, zoom }`) **aparte** de `center` y
`radius`. Un toque solo cambia `center`; mover el slider solo `radius`. La
cámara se recalcula solo al soltar el slider o con una acción de TalkBack,
como `{ center, zoom: zoomForRadius(radius) }`, para encuadrar el círculo.

`zoomForRadius(r) = min(18, 16 − log2(r / 300))`: a zoom 16 (el `MAP_ZOOM`
de la pestaña Mapa) un círculo de 300 m cabe con margen en un móvil; cada
nivel de zoom duplica la escala, así que cada vez que el radio se duplica
se resta 1. El tope 18 evita acercarse a nivel de calle con radios pequeños.
Es una función pura en `src/utils/` con tabla de casos (R2).

### D4 — `saveState` distingue los errores del guardado

`writeState` de #41 no lee el cuerpo. `saveState` lo lee con `readJson`
**solo** en 409 y 400 y delega el resto en `writeState`, así que la tabla de
#41 no se duplica. El 400 de validación de NestJS no trae `code` (E10): todo
400 que no sea `MAX_GEOFENCES_REACHED` es `invalid`, también con cuerpo
ilegible. Un 409 sin código es `error`, no `name-taken`: no se adivina.

### D5 — Dobles de test por intención

En `src/screens/geofence-editor/index.test.tsx` (verificados contra los
precedentes del árbol, no calcados a ciegas):

- `../../api/geofences`: `listGeofences`, `createGeofence`, `updateGeofence`
  como `jest.fn()`.
- `../../api/positions`: `getLastPosition` como `jest.fn()`.
- `../../providers/auth-provider` (como el test de #41): `useAuth` →
  `{ status: 'authenticated', token: 'token-1', signOut }`.
- `expo-router`: `jest.mock('expo-router', () => ({ router: { back: jest.fn() } }))`,
  leído con `jest.mocked(router.back)` (precedente: add-pet). Ningún otro
  módulo del árbol montado importa `expo-router`.
- `expo-maps`: el stub de `src/screens/map/index.test.tsx` (una `View` que
  recibe todas las props, con `MapColorScheme`); `PetMap` y
  `useThemeColors` son **reales**.
- `react-native-safe-area-context`: insets `{ top: 40, right: 0, bottom: 24, left: 0 }`.
- `uniwind`: `useUniwind` → `{ theme: 'light', hasAdaptiveThemes: false }`.
- `heroui-native`: `...jest.requireActual` más un doble del `Slider`, porque
  el real no expone `onChange` a RNTL y su `Thumb` no trae acciones de
  accesibilidad (E8):

  ```ts
  const host = (props) => React.createElement(View, props, props.children as ReactNode);
  return { ...actual, Slider: Object.assign(host, { Track: host, Fill: host, Thumb: host }) };
  ```

  Con él, `fireEvent(slider, 'change', 300)` llama a `props.onChange`; sin
  manejador es un no-op y el test falla por aserción.
- Montaje con `renderWithProviders` (de `'../../../test/render-with-providers'`)
  envolviendo `HeroUINativeProvider` y `LanguageProvider`; devuelve
  `queryClient`, sobre el que se espía `invalidateQueries`.
- Fixtures: Casa (`geofence-1`, 19.4 / -99.1, 150, activa), Parque
  (`geofence-2`, 19.42 / -99.15, 600, inactiva) y la posición
  `{ lat: 19.5, lng: -99.2, ts: 0, accuracy: null, battery: null, staleSeconds: 0 }`.
- Se usan los mismos helpers que el test de #41 (`childTestIds`, `mount`
  por idioma) copiados al fichero nuevo.

RNTL 14: `render` y `fireEvent` son `async`; el árbol es solo de hosts; el
`testID` de un `Button` de heroui está en el host más externo; deshabilitado
se lee en `accessibilityState.disabled`; el hijo de un `ScrollView` tiene como
`.parent` el contenedor de contenido.

### D6 — Recargar la lista al volver

En `src/` no hay `useMutation`, `invalidateQueries` ni `useFocusEffect` en la
lista de #41 (E9). El editor invalida `geofenceKeys.list(petId)` **antes** de
`router.back()`: la lista sigue montada debajo y, con `staleTime: 0`, la
invalidación la recarga. Es el primer `invalidateQueries` de `src/`. No se
introduce `useMutation`: el patrón `busy`/`error` local es el de la lista de
#41.

### D7 — El nombre del dueño deja de ser `selectable`

Un `Text` seleccionable dentro de un `Pressable` se traga el toque en
Android, y el precedente del enlace de fila de alertas (#100) no tiene
ningún `Text` seleccionable dentro. Por eso el nombre pasa a
`selectable={!isOwner}`: el dueño lo toca para editar; quien no es dueño
sigue pudiendo copiarlo. Cambia una aserción aprobada de #41 R5 (D8 fila 8).

### D9 — Un único camino para los mensajes

`messageFor(t, kind)` es la única fuente de mensajes del editor (carga,
tarjetas, guardado, interruptor y Eliminar). Así cada clave de error
aparece una sola vez como `t('…')`. El candado de R10 cuenta 23 usos en el
editor: los 14 de R6–R8 y 9 de la ampliación, de los que solo dos claves se
repiten a propósito, cada una en una fila propia: `geofences.delete` (botón
y diálogo, R14) y `geofenceEditor.ownerOnly` (tarjeta al crear y nota de
solo lectura, R16).

### D10 — Pestaña Mapa: una consulta más, fuera del poll

La pestaña Mapa lee las zonas con la misma clave que la lista y el editor
(`geofenceKeys.list(petId)`): las tres pantallas comparten caché, así que
crear, editar, activar o borrar una zona (todas invalidan esa clave)
repinta los círculos al volver a la pestaña sin código propio. No entra en
el poll de 15 s (P11): las zonas no se mueven solas; las cambia el dueño
desde la app, que ya invalida. Solo las activas: una zona inactiva no
vigila ni dispara alertas, y dibujarla haría creer lo contrario.

La consulta de zonas **no** condiciona el montaje de `PetMap` ni el
esqueleto de la pestaña: si tarda o falla, el mapa es el de hoy (M18 lo
sostiene). Sin aviso de error: los círculos son un añadido, no el contenido
de la pestaña. El doble del test (D8 fila 19) la deja pendiente por defecto
para que los `it` de #87 y #94 no vean nada distinto.

### D11 — Límite de 5: espejo de la constante, no una lectura del backend

`GEOFENCE_MAX_PER_PET` del backend no viaja en ninguna respuesta; el móvil
no comparte código con el backend. Se copia el valor con el **mismo
nombre** y un comentario que cita el fichero del backend, en
`src/api/geofences.ts`, junto a las funciones que hablan con esa API (P12).
Si el backend sube el límite y el móvil no, el botón se deshabilita antes
de tiempo: un fallo visible y barato, frente al actual (el usuario rellena
el editor y el servidor lo rechaza). El 400 `MAX_GEOFENCES_REACHED` y
`limitReached` se quedan para la carrera entre dos dispositivos.

El botón se deshabilita en vez de esconderse: así el aviso tiene a qué
referirse, y TalkBack anuncia "deshabilitado". El aviso usa `{{max}}` en
vez de un "5" literal para que el texto no caduque con la constante. El
doble del test de la lista conserva la constante real (D8 fila 18).

### D12 — Interruptor y Eliminar en el editor: un solo `run`

Guardar, el interruptor y Eliminar comparten el manejo de resultado (`ok`,
`unauthorized` → `signOut`, resto → `messageFor`) y el mismo `busy`. Un
`run(request, onOk)` local evita tres copias del bloque `try/catch` y deja
un único `signOut(` en el fichero (el candado `#87 R19` no se mueve). Lo
único que cambia por llamada es qué hacer con `ok`: `leave` (invalidar y
volver) para Guardar y Eliminar, `refresh` (invalidar y quedarse) para el
interruptor.

El interruptor lee `zone.active` de la lista, no un estado local: tras
escribir, la recarga repinta el valor del servidor (un fallo deja el
interruptor donde estaba, sin rollback que mantener). No toca el borrador:
`active` sigue fuera del PATCH de Guardar (P7, R13 it 4).

Eliminar reutiliza el diálogo de la lista de #41 tal cual (mismas claves,
mismo orden de botones) en vez de un componente compartido: son dos
llamadas a `Alert.alert` de cuatro líneas, y extraerlas tocaría código
aprobado de #41 sin necesidad. Va después de Guardar, separado por el
`gap` del formulario, con la receta `danger-soft` de la lista en tamaño
`md` (es un botón de formulario a ancho completo, no una acción de fila).

### D13 — Rol en el editor: la consulta de la lista, sin helper

El editor repite las dos líneas de la lista (`useQuery` de
`petKeys.detail(petId)` e `isOwner`). Comparten caché: al venir de la lista
el rol ya está y el esqueleto no parpadea. Un hook compartido sería una
abstracción para dos usos de dos líneas.

Al editar sin ser dueño se enseña la zona (nombre, radio y su círculo) en
vez de un error: la información no es secreta (la pestaña Mapa la dibuja a
todos, R11) y una pantalla en blanco no explica nada. Al crear no hay zona
que enseñar, así que va la tarjeta. La lista no abre el editor a quien no
es dueño (P16): la solo lectura es defensa para la URL abierta a mano y
para el rol que cambia con la pantalla abierta. Un error al leer el rol se
trata como no dueño, como en #41: ante la duda, sin controles que el
backend rechazaría con 403.

### D14 — `DEFAULT_CENTER`: exportado por el componente del mapa

El centro por defecto es una propiedad del mapa, no de una pantalla, y
`src/components/pet-map.tsx` ya exporta `MAP_ZOOM`, su pareja. Ir a
`src/constants/` o a un `src/utils/` nuevo añadiría un fichero para una
línea (P17). El candado de R17 mira dos cosas a propósito: la declaración
(`const DEFAULT_CENTER`) y las coordenadas, para que nadie esquive el
primero con otro nombre.

### D15 — Títulos de test sin número

Un recuento en el título de un `it` caduca con la siguiente feature que
toca el recuento, y la aserción, que sí se actualiza, se queda con un
título falso: `#62 R1` dice "trece" y #146 lo lleva a 15; el `it` de
`ALL_USES` dice "doce" y había catorce bloques ya en `d637757e`; `#87 R18`
dice "cinco recursos" y R11 añade el sexto. La cifra vive en la aserción
(`toHaveLength`, `toBe`), que es la que falla. Los renombres van en el
commit rojo del requisito que mueve la cifra (filas 13, 15 y 16 de D8) y el
`it` de R1 de esta spec nace sin número. No se barre el repo: otros títulos
con cifras (p. ej. `'suma las trece ocurrencias que enumera la spec'` de
`legibility-classnames.test.ts`) no los toca #146 y quedan fuera.

## Erratas sobre la entrada de feature_list (E1–E13)

| # | La entrada dice / supone | Lo que hay en `95b2aaa4` y cómo lo trata la spec |
|---|---|---|
| E1 | Depende de #60 (rama `AppleMaps`). | #60 aparcada; dejó de ser dependencia el 2026-10-02. Las props van en `mapViewProps`. |
| E2 | `files_affected` lista 4 rutas. | Son bastantes más (§Archivos afectados); se actualiza en `feature_list.json`. |
| E3 | "Dibujar las zonas en el mapa de la pantalla de geocercas". | La lista de #41 no tiene mapa. Se dibujan en el editor (P4). |
| E4 | Editar reinicia la zona. | Solo si cambian `active`, `centerLat`, `centerLng` o `radiusM` (#145 D4): renombrar no reinicia (P7, P8). |
| E5 | "Ampliar PetMap en las dos ramas". | `main` solo tiene `GoogleMaps.View`; la rama `AppleMaps` es de #60. |
| E6 | `onMapClick` existe en las dos plataformas. | Sí, pero en Apple `onCircleClick` no trae coordenadas y no hay toque de POI. Delimitación (§Coordinación). |
| E7 | Tocar el mapa fija el centro (`onMapClick`). | Un toque sobre un POI o un círculo no dispara `onMapClick`: se registran también `onPOIClick` y `onCircleClick` (D2). |
| E8 | Un slider de 20 a 2000 m. | El `Slider` de heroui necesita un doble en jest y su `Thumb` no trae `increment`/`decrement`: los añade el editor (P10, D5). |
| E9 | Al guardar se vuelve a la lista. | La lista no tiene `useFocusEffect` ni hay `invalidateQueries` en `src/`: el editor invalida antes de `router.back()` (D6). |
| E10 | "400 de validación sin code". | Correcto: todo 400 sin `MAX_GEOFENCES_REACHED` → `invalid` (D4). |
| E11 | El toque da coordenadas. | `Coordinates` tiene `latitude`/`longitude` opcionales: guarda en `forward` (R3). |
| E12 | — | El 404 de la **lista** de #41 cae en `error` (no hay `not-found` en `listGeofences`); el editor lo pinta como error con Reintentar. |
| E13 | #41 D2: "#146 lo revalidará al editar". | Cerrada por R15: `isGeofence` valida `centerLat`/`centerLng` con `typeof` en la lectura de la lista, no al editar (P15). |

## Mutaciones y sondas

### §1 — Mutaciones diseñadas (no ejecutadas)

Cada fila es una mutación que el reviewer puede plantar sobre el verde final;
la columna dice qué `it` la mata. Los `it` **Declarado** (verdes ya en su
commit rojo) obtienen aquí su rojo. Ninguna se ha ejecutado: esta spec no
corre jest.

| Id | Mutación | Muere en |
|---|---|---|
| M1 | `zoomForRadius` sin el tope `Math.min(18, …)` | `#146 R2`, filas 75 y 20 |
| M2 | Relleno del círculo con `accent-strong` en vez de `tab-pill` | `#146 R3` it 2 |
| M3 | `forward` sin la guarda de `number` | `#146 R3` it 8 |
| M4 | `circles: []` siempre, ignorando `props.circles` | `#146 R3` it 1 |
| M5 | 400 sin código → `error` en vez de `invalid` | `#146 R4` filas `400 / —` e it 22 |
| M6 | Sin la guarda de `baseUrl` | `#146 R4` its 24–25 (Declarado) |
| M7 | Un toque también hace `setCamera` (la cámara persigue al borrador) | `#146 R7` it 1 |
| M8 | `invalidateQueries` después de `router.back()` | `#146 R8` it 1 (`invocationCallOrder`) |
| M9 | Sin `trim()` en el nombre | `#146 R8` its 1 y 6 |
| M10 | La columna-botón y `Añadir zona` ignoran `isOwner` | `#146 R9` its 6–7 (Declarado) |
| M11 | `Añadir zona` sin la condición de lista `ok` | `#146 R9` its 8–11 (Declarado) |
| M12 | El editor filtra las zonas inactivas al dibujar | `#146 R6` it 10 |
| M13 | `const retryKey = 'common.retry' as const;` y `t(retryKey)` | `#146 R10` (es la mutación que planta su commit rojo, vía (b) de C4) |
| M14 | `dangerouslySingular` en el `Stack.Screen` del editor | `#146 R5`, layout it 1 |
| M15 | Una de las catorce claves falta en `es` | `#146 R1` |
| M16 | `onMapClick`/`onPOIClick`/`onCircleClick` registrados aunque no llegue `onPress` | `#146 R3` it 4 |
| M17 | El nombre del dueño vuelve a `selectable` | `#41 R5` 'pinta cada nombre y radio…' (aserción cambiada, D8 fila 8) |
| M18 | La pestaña Mapa monta `PetMap` solo con `geofences.data?.kind === 'ok'` además de lo de hoy | `#146 R11` its 3–4 (Declarado) |
| M19 | La consulta de zonas de la pestaña Mapa sin `enabled` | `#146 R11` it 5 (Declarado) |
| M20 | El poll de 15 s también hace `geofences.refetch()` | `#146 R11` it 6 (Declarado) |
| M21 | `atLimit` con `>= GEOFENCE_MAX_PER_PET - 1` | `#146 R12` it 2 (Declarado) |
| M22 | El aviso `geofences-limit` fuera de la condición del dueño | `#146 R12` it 3 (Declarado) |
| M23 | El botón Eliminar del editor sin la condición de `zone` (también al crear) | `#146 R14` it 3 (Declarado) |
| M24 | `geofence-editor-radius-value` sin `style={TABULAR_NUMS}` | `#62 R15`, fila del editor (es la mutación que planta el commit rojo de R18, vía (b) de C4) |
| M25 | `isOwner` como `myRole !== 'family'` en el editor | `#146 R16` its 3–4 (`walker`, `vet`) |
| M26 | El interruptor del editor llama a `leave` en vez de `refresh` | `#146 R13` it 2 (`router.back` llamado) |
| M27 | `isGeofence` con `typeof item.centerLat === 'number'` pero sin la de `centerLng` | `#146 R15` fila `'a missing centerLng'` |

### §2 — Sondas que no son mutación

- **Base.** El leader mide la base en el árbol del handoff; el delta de
  §Delta de tests se suma a ella.
- **Recorridos del router real.** Los ocho ficheros de [[tasks]]
  §Conjuntos comunes se corren en el verde de R5.
- **Pestaña Mapa.** `src/screens/map/index.test.tsx` se corre sin tocarlo
  en el verde de R3 y en el de R17 (que solo cambia de dónde sale
  `DEFAULT_CENTER`); R11 lo amplía (D8 filas 13 y 19).
- **Rol y fixtures.** Los `it` de R6–R14 se escriben antes de R16 y no
  conocen el rol: el doble de `getPet` dueño en el `beforeEach` común (R16)
  es lo que los mantiene verdes. Si alguno cae en el rojo de R16, falta ese
  doble, no una fila de D8.

## Archivos afectados

Rutas bajo `mobile-pet-tracker/` salvo que se diga otra cosa.

**Lógica pura**

- `src/utils/zoom-for-radius.ts` (nuevo) — R2.
- `src/utils/zoom-for-radius.test.ts` (nuevo) — R2.

**Acceso a API**

- `src/api/geofences.ts` — R4: `GeofenceDraft`, `GeofenceSaveState`,
  `saveState`, `createGeofence`, `updateGeofence`; `postJson` al import.
  R12: `GEOFENCE_MAX_PER_PET`. R15: centro en `isGeofence`.
- `src/api/__tests__/geofences.test.ts` — R4, R15 y D8 fila 14.

**Componentes y pantallas**

- `src/components/pet-map.tsx` — R3; R17 (`DEFAULT_CENTER`).
- `src/components/__tests__/pet-map.test.tsx` — R3 (y el mock de tema).
- `src/screens/geofence-editor/index.tsx` (nuevo) — stub en R5; R6–R8,
  R13, R14, R16; M13 en R10 y M24 en R18.
- `src/screens/geofence-editor/index.test.tsx` (nuevo) — R6–R8, R13, R14,
  R16.
- `src/screens/geofences/index.tsx` — R9, R12.
- `src/screens/geofences/index.test.tsx` — R9, R12 y las aserciones de #41
  de D8 (filas 8, 9 y 18).
- `src/screens/map/index.tsx` — R11 (consulta de zonas y `circles`), R17
  (importa `DEFAULT_CENTER`).
- `src/screens/map/index.test.tsx` — R11 y D8 filas 13 y 19.

**Navegación**

- `src/app/pets/[petId]/geofence-editor.tsx` (nuevo) — R5.
- `src/app/_layout.tsx` — R5.
- `src/app/__tests__/layout.test.tsx` — R5 y tres recuentos heredados.
- `src/app/__tests__/detail-stack.test.tsx` — R5.

**Copy**

- `src/i18n/catalog.ts` — R1.
- `src/providers/__tests__/language-provider.test.tsx` — R1 y `#65 R12`.
- `src/__tests__/ui-copy-table.ts` — R10 y D8 fila 16 (título).
- `src/__tests__/ui-language.test.ts` — R10 y `#65 R18`.

**Candados de fuente**

- `src/__tests__/design-drift.test.ts` — `#87 R19` (R8); `describe` nuevo
  de R17.
- `src/__tests__/consistency-classnames.test.ts` — `#62 R1` y `#98 R10`
  (R8 y R9), título de `#62 R1` (D8 fila 15), `#62 R15` y `#69 R10` (R18).

**Docs y specs (raíz del repo)**

- `docs/conventions.md` y `docs/ui-guidelines.md` — A19.
- `specs/mobile-ui-language/design.md` — §2.16 (R1).
- `specs/mobile-geofence-editor/` — esta spec y su trazabilidad.

**No se tocan:** `backend-pet-tracker/` (R12 solo cita su
`geofences.constants.ts`), `infra/`, `package.json`, `app.json`,
`bun.lock` y `src/__tests__/legibility-classnames.test.ts` (sus regex no
casan con los tokens del editor; se corre como candado).

## Anclas

Verificadas con `grep -cF` sobre `95b2aaa4`; las de la ampliación
(R11–R18, tras la fila de A19) sobre `d637757e`, que desciende de
`95b2aaa4` sin cambios en `mobile-pet-tracker/`. Son contenido, no números de
línea: el leader las re-verifica en el árbol del handoff y, si una no da el
recuento esperado, para y re-ancla antes de dárselo a Codex.

| Ancla (literal) | Fichero | Esperado |
|---|---|---|
| `'geofences.deleteBody'` | `src/i18n/catalog.ts` | 2 |
| `- 6 + 1 + 2 + 3 + 11,` | `src/providers/__tests__/language-provider.test.tsx` | 1 |
| `describe('#41 R1: el catálogo trae las once claves de zonas seguras'` | ídem | 1 |
| `## 3. La infraestructura` | `specs/mobile-ui-language/design.md` | 1 |
| `uiSettings: { zoomControlsEnabled: false },` | `src/components/pet-map.tsx` | 1 |
| `useThemeColors: () => ['accent-color'],` | `src/components/__tests__/pet-map.test.tsx` | 1 |
| `import { deleteJson, getJson, patchJson, readJson } from './http';` | `src/api/geofences.ts` | 1 |
| `name="pets/[petId]/geofences"` | `src/app/_layout.tsx` | 1 |
| `toHaveLength(8 + 1 + 1); // #100 R2, #41 R4` | `src/app/__tests__/layout.test.tsx` | 1 |
| `toHaveLength(9 + 1); // #41 R4` | ídem | 1 |
| `toHaveLength(10);` | ídem | 1 |
| `describe('#41 R4: las zonas seguras viven en src/app/pets/[petId]/geofences.tsx'` | `src/app/__tests__/detail-stack.test.tsx` | 1 |
| `className="min-w-0 flex-1 gap-1"` | `src/screens/geofences/index.tsx` | 1 |
| `{actionError ? (` | ídem | 1 |
| `expect(column.props.className).toBe('min-w-0 flex-1 gap-1');` | `src/screens/geofences/index.test.tsx` | 1 |
| `expect(nameNode.props.selectable).toBe(true);` | ídem | 1 |
| ``toEqual([undefined, `geofence-${id}-active`, `geofence-${id}-delete`]);`` | ídem | 1 |
| `'screens/geofences/index.tsx': 1,` | `src/__tests__/design-drift.test.ts` | 1 |
| `expect(primaryRadius).toHaveLength(13);` | `src/__tests__/consistency-classnames.test.ts` | 1 |
| ``expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13);`` | ídem | 1 |
| `export const ALL_USES: UseRow[] = [` | `src/__tests__/ui-copy-table.ts` | 1 |
| `...R14_GEOFENCES,` | ídem | 1 |
| `R12_ALERTS, R13_ALERT_DETAIL, R14_GEOFENCES,` | ídem | 1 |
| `#100 R10, #41 R10` | `src/__tests__/ui-language.test.ts` | 1 |
| `describe('#41 R10: las zonas seguras resuelven su copy por clave'` | ídem | 1 |
| fragmento viejo de A19 ([[requirements]] §Enmiendas) | `docs/conventions.md` y `docs/ui-guidelines.md` | 1 en cada uno |
| `export const MAP_ZOOM = 16;` | `src/components/pet-map.tsx` | 1 |
| `const DEFAULT_CENTER = {` | `src/screens/map/index.tsx` | 1 |
| `: DEFAULT_CENTER;` | ídem | 1 |
| `import { PetMap } from '../../components/pet-map';` | ídem | 1 |
| `import { petKeys, positionKeys, tripKeys } from '../../api/query-keys';` | ídem | 1 |
| `const POLL_MS = 15000;` | ídem | 1 |
| `function pending<T>(): Promise<T> {` | `src/screens/map/index.test.tsx` | 1 |
| `it('deja sus cinco recursos en las claves canónicas'` | ídem | 1 |
| `export type GeofenceListState =` | `src/api/geofences.ts` | 1 |
| `typeof item.radiusM === 'number' && typeof item.active === 'boolean'` | ídem | 1 |
| `function makeGeofence(id: string, active = true): Geofence {` | `src/api/__tests__/geofences.test.ts` | 1 |
| `['an item without name', response(200, [{ id: 'zone-1', radiusM: 150, active: true }])],` | ídem | 1 |
| `const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';` | `src/screens/geofences/index.tsx` | 1 |
| `deleteGeofence: jest.fn(), listGeofences: jest.fn(), setGeofenceActive: jest.fn(),` | `src/screens/geofences/index.test.tsx` | 1 |
| `it('deja los trece botones primarios sólidos en un único radio'` | `src/__tests__/consistency-classnames.test.ts` | 1 |
| `[join('screens', 'reminders', 'index.tsx'), 3],` | ídem | 1 |
| `14 + 4 + 1 + 1 + 1 + 1,` | ídem | 1 |
| `it('cuadra ALL_USES con la suma de los doce bloques'` | `src/__tests__/ui-copy-table.ts` | 1 |
| `const productionFilesMatching = (pattern: RegExp) =>` | `src/__tests__/design-drift.test.ts` | 1 |
| `const sourceRoot = join(process.cwd(), 'src');` | ídem | 1 |
| `export const GEOFENCE_MAX_PER_PET = 5;` | `backend-pet-tracker/src/modules/geofences/geofences.constants.ts` (raíz del repo) | 1 |

## Aserciones heredadas que cambian (D8)

Toda aserción ya aprobada que esta feature mueve está aquí, con su
requisito. Codex cambia **solo** estas: si un rojo heredado no está en la
tabla, para y lo anota en `progress/impl_mobile-geofence-editor.md` en vez
de ajustar la aserción.

| Fila | Candado (fichero › describe) | Cambio exacto | Requisito |
|---|---|---|---|
| 1 | `language-provider.test.tsx` › `#65 R12` | la expresión pasa de `… - 6 + 1 + 2 + 3 + 11,` a `… - 6 + 1 + 2 + 3 + 11 + 12 + 2,` (320 → 334); el comentario que acaba en `+ 11 de #41 R1 (geofences.*).` gana ` + 12 de #146 R1 (geofenceEditor.*) + 2 de #146 R1 (geofenceEditor.limitNotice, geofenceEditor.ownerOnly).` | R1 |
| 2 | `layout.test.tsx` › `#114 R1` | `toHaveLength(8 + 1 + 1); // #100 R2, #41 R4` → `toHaveLength(8 + 1 + 1 + 1); // #100 R2, #41 R4, #146 R5` | R5 |
| 3 | `layout.test.tsx` › `#100 R2` | `toHaveLength(9 + 1); // #41 R4` → `toHaveLength(9 + 1 + 1); // #41 R4, #146 R5` | R5 |
| 4 | `layout.test.tsx` › `#41 R4` | `toHaveLength(10);` → `toHaveLength(10 + 1); // #146 R5`; `children[9]` sigue siendo `pets/[petId]/geofences` | R5 |
| 5 | `design-drift.test.ts` › `#87 R19` | en `screenSignOutCalls`, justo después de `'screens/geofences/index.tsx': 1,`, la línea `'screens/geofence-editor/index.tsx': 1,` | R8 |
| 6 | `consistency-classnames.test.ts` › `#62 R1` | `expect(primaryRadius).toHaveLength(13);` → `expect(primaryRadius).toHaveLength(13 + 1); // #146 R8` | R8 |
| 7 | `consistency-classnames.test.ts` › `#98 R10` | ``…toBe(13);`` del recuento de `rounded-xl bg-accent` → ``…toBe(13 + 1); // #146 R8`` | R8 |
| 8 | `geofences/index.test.tsx` › `#41 R5` 'pinta cada nombre y radio…' | `expect(column.props.className).toBe('min-w-0 flex-1 gap-1');` → `toBe('min-h-11 min-w-0 flex-1 gap-1')`; `expect(nameNode.props.selectable).toBe(true);` → `toBe(false)` (dueño, D7) | R9 |
| 9 | `geofences/index.test.tsx` › `#41 R7` | ``toEqual([undefined, `geofence-${id}-active`, `geofence-${id}-delete`]);`` → ``toEqual([`geofence-${id}-edit`, `geofence-${id}-active`, `geofence-${id}-delete`]);`` | R9 |
| 10 | `consistency-classnames.test.ts` › `#62 R1` | `toHaveLength(13 + 1); // #146 R8` → `toHaveLength(13 + 1 + 1); // #146 R8, #146 R9` | R9 |
| 11 | `consistency-classnames.test.ts` › `#98 R10` | `toBe(13 + 1); // #146 R8` → `toBe(13 + 1 + 1); // #146 R8, #146 R9` | R9 |
| 12 | `ui-language.test.ts` › `#65 R18` | `toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1); // #100 R10, #41 R10` → `toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1); // #100 R10, #41 R10, #146 R10` | R10 |
| 13 | `map/index.test.tsx` › `#87 R18` | `it('deja sus cinco recursos en las claves canónicas')` → `it('deja cada recurso en su clave canónica')` (P18); dentro, `listGeofences` resuelve `{ kind: 'ok', geofences: [] }` y, tras las cinco aserciones de hoy, `await waitFor(() => expect(queryClient.getQueryData(geofenceKeys.list('pet-1'))).toEqual(…))` con ese mismo estado (`waitFor`: la consulta de zonas no espera a `stat-speed`). El fichero importa `geofenceKeys` y el tipo `GeofenceListState` | R11 |
| 14 | `api/__tests__/geofences.test.ts` › `#41 R2` `'maps %s to error'` | la fila `['an item without name', response(200, [{ id: 'zone-1', radiusM: 150, active: true }])]` pasa a construirse desde `makeGeofence('zone-1')` sin la clave `name`: sigue faltando **solo** el nombre, y no cae en rojo por el centro que R15 empieza a exigir | R15 |
| 15 | `consistency-classnames.test.ts` › `#62 R1` | `it('deja los trece botones primarios sólidos en un único radio')` → `it('deja todos los botones primarios sólidos en un único radio')` (P18; el recuento ya lo mueven las filas 6 y 10) | R8 |
| 16 | `ui-copy-table.ts` › `#65` | `it('cuadra ALL_USES con la suma de los doce bloques')` → `it('cuadra ALL_USES con la suma de sus bloques')` (P18; ya eran catorce bloques en `d637757e`, quince con R10) | R10 |
| 17 | `consistency-classnames.test.ts` › `#62 R15` y `#69 R10` | en `counters`, tras `[join('screens', 'reminders', 'index.tsx'), 3],`, la fila `[join('screens', 'geofence-editor', 'index.tsx'), 1],`; en `#69 R10`, `14 + 4 + 1 + 1 + 1 + 1,` → `14 + 4 + 1 + 1 + 1 + 1 + 1, // #146 R18` | R18 |
| 18 | `geofences/index.test.tsx` (doble de `../../api/geofences`) | el `jest.mock` con fábrica de `deleteGeofence: jest.fn(), listGeofences: jest.fn(), setGeofenceActive: jest.fn(),` gana `GEOFENCE_MAX_PER_PET` tomado de `jest.requireActual('../../api/geofences')`; las tres funciones no cambian. Sin esto la pantalla leería `undefined` y el aviso no saldría nunca, en silencio | R12 |
| 19 | `map/index.test.tsx` (dobles) | nuevo `jest.mock('../../api/geofences', …)` con `listGeofences: jest.fn()`, y el `beforeEach` común lo deja pendiente con el `pending<T>()` del fichero, como a `getLastPosition`, `listPositions` y `getDayRoute`; ningún `it` existente cambia de valor | R11 |

**Verificado que no cambia** (si Codex lo ve rojo, es una regresión suya,
no una fila que falte):

- `#41 R6` en `geofences/index.test.tsx`: sigue leyendo `childTestIds(card)[1]`.
- `#41 R8` en el mismo fichero: sigue esperando `[undefined, \`geofence-${id}-status\`]`
  para el no-dueño.
- El error de acción (`{actionError ? (`) sigue siendo el último hijo de la
  lista; el botón *Añadir zona* va antes.
- `#41 R4` de `detail-stack.test.tsx`: la ruta de la lista no se toca; R5
  añade su propio `describe` al lado.
- `#41 R10`: `R14_GEOFENCES` sigue con 18 filas y sin tocar. Las tres claves
  nuevas de la lista (`geofenceEditor.editLabel`, `geofenceEditor.add`,
  `geofenceEditor.limitNotice`) van en `R15_GEOFENCE_EDITOR` con las del
  editor ([[requirements]] R10).
- `#87 R19` (`screenSignOutCalls`): `'screens/map/index.tsx': 0` no cambia
  (R11 no cierra sesión); el editor sigue en 1 tras R13 y R14, porque los
  tres sitios que escriben pasan por el mismo `run`.
- `#62 R1` y `#98 R10`: la ampliación no añade primarios sólidos ni
  `rounded-xl bg-accent` (Eliminar es `bg-danger-soft`, el interruptor no es
  botón); se quedan en `13 + 1 + 1`.
- `#62 R15`: la fila de la pestaña Mapa sigue en 3 (R11 no añade
  contadores).
- `#94 R10` (`staleSecondsReads`): la pestaña Mapa sigue en 1.
- `consistency-classnames.test.ts`, la tabla de radios con
  `[join('screens', 'map', 'index.tsx'), 4],`, y `legibility-classnames.test.ts`,
  `inkSites` con `[join('screens', 'map', 'index.tsx'), 2],`: sin cambio
  (R11 y R17 no tocan clases).
- `#61 R1` (`legibility-classnames.test.ts`): mira un tag `danger` concreto
  de otra pantalla; ningún candado cuenta botones `danger-soft`.
- `#65 R18` (`SCREEN_FILES`): la ampliación no añade ficheros de pantalla;
  sigue en la expresión de la fila 12.
- `src/api/__tests__/query-keys.test.ts`: `geofenceKeys` no cambia.
- `#41 R2`, resto de filas de `'maps %s to error'`: parten de
  `makeGeofence`, que ya trae `centerLat: 19.4, centerLng: -99.1`.

## Delta de tests

Tests nuevos (`it` o fila de `it.each`), sin contar los heredados que solo
cambian de valor:

| Fichero | Δ tests | Requisitos |
|---|---|---|
| `src/providers/__tests__/language-provider.test.tsx` | +1 | R1 |
| `src/utils/zoom-for-radius.test.ts` (nuevo) | +8 | R2 |
| `src/components/__tests__/pet-map.test.tsx` | +8 | R3 |
| `src/api/__tests__/geofences.test.ts` | +28 | R4 (25), R15 (3) |
| `src/app/__tests__/layout.test.tsx` | +2 | R5 |
| `src/app/__tests__/detail-stack.test.tsx` | +1 | R5 |
| `src/screens/geofence-editor/index.test.tsx` (nuevo) | +68 | R6 (19), R7 (8), R8 (16), R13 (7), R14 (9), R16 (9) |
| `src/screens/geofences/index.test.tsx` | +16 | R9 (12), R12 (4) |
| `src/screens/map/index.test.tsx` | +6 | R11 |
| `src/__tests__/ui-language.test.ts` | +1 | R10 |
| `src/__tests__/design-drift.test.ts` | +2 | R17 (y R8, fila D8 5, sin `it` nuevo) |
| `src/__tests__/consistency-classnames.test.ts` | +1 | R18 (fila nueva del `it.each`); R8, R9 (filas D8 6, 7, 10, 11, 15) sin `it` nuevo |
| **Total** | **+142 tests, +2 suites** | |

Por requisito: R1 1 · R2 8 · R3 8 · R4 25 · R5 3 · R6 19 · R7 8 · R8 16 ·
R9 12 · R10 1 · R11 6 · R12 4 · R13 7 · R14 9 · R15 3 · R16 9 · R17 2 ·
R18 1 = 142. La ampliación (R11–R18) suma 41 y ningún fichero de test
nuevo; los renombres de P18 y las filas 13–19 de D8 no cambian el
recuento.

La base no está medida ([[requirements]] §Contexto): el leader la mide sobre
el HEAD del handoff, sin pipe, y el cierre de Codex debe dar exactamente
base + 142 tests y base + 2 suites, con los mismos skipped. Cualquier otra
cifra se explica en `progress/impl_mobile-geofence-editor.md` antes de
pedir revisión.

## Alternativas descartadas

- **Hoja (bottom sheet) sobre la lista en vez de ruta propia.** El arrastre
  de la hoja compite con los gestos del mapa, y la ruta da cabecera nativa,
  back del sistema e invalidación limpia al volver (D1, D6).
- **`@expo/ui/community/slider` para el radio.** La carta de UI
  (`docs/ui-guidelines.md`, punto 5) manda heroui primero, y heroui-native
  1.0.8 ya trae `Slider`; no se añade dependencia.
- **`useMutation` para guardar.** El precedente de #41 escribe con
  `fetch` + estado local y `invalidateQueries`; una mutación añade caché de
  estado que la pantalla no lee. Se reutiliza el patrón existente (D4, D6).
- **`useFocusEffect` para recargar.** La lista ya se invalida antes del
  `router.back()` (D6); recargar al enfocar duplicaría la petición.
- **Cámara que sigue al borrador.** Mover la cámara en cada cambio de radio
  o centro pelea con el gesto del usuario y re-renderiza el mapa nativo; la
  cámara se encuadra al cargar y al recentrar (D3).
- **Fijar el centro con pulsación larga o arrastrando el marcador.** No es
  descubrible y expo-maps no da arrastre de marcador uniforme entre
  plataformas; un toque en el mapa basta (R3, R7).
- **Leer el límite de 5 zonas de un endpoint del backend.** No existe y el
  valor no cambia; se espeja `GEOFENCE_MAX_PER_PET` como constante citada
  (R12, D11). El 400 `limitReached` sigue traducido por si la lista está
  desfasada (R4, R8).
- **Pintar las zonas en el mapa de la lista.** Es la desviación de P4: la
  lista sigue siendo texto; las zonas se dibujan en el editor y, desde R11,
  en la pestaña Mapa.
- **PATCH parcial (solo campos tocados).** El borrador es completo y pequeño;
  enviar el borrador entero evita calcular diferencias y coincide con lo que
  el backend acepta (R4).
