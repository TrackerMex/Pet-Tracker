---
feature: "mobile-geofence-editor"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-geofence-editor]]

> Base: `95b2aaa4` (HEAD de #41). Anclas por contenido (§Anclas). Las
> decisiones de producto P1–P10 están en [[requirements]] §Qué firma.

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
tarjetas y guardado). Así cada clave aparece una sola vez como `t('…')` y el
candado de R10 cuenta 14 usos en el editor sin duplicados.

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
| E13 | #41 D2: "#146 lo revalidará al editar". | No se revalida `centerLat`/`centerLng`: Delimitación ([[requirements]] §Fuera de alcance). |

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
| M15 | Una de las doce claves falta en `es` | `#146 R1` |
| M16 | `onMapClick`/`onPOIClick`/`onCircleClick` registrados aunque no llegue `onPress` | `#146 R3` it 4 |
| M17 | El nombre del dueño vuelve a `selectable` | `#41 R5` 'pinta cada nombre y radio…' (aserción cambiada, D8 fila 8) |

### §2 — Sondas que no son mutación

- **Base.** El leader mide la base en el árbol del handoff; el delta de
  §Delta de tests se suma a ella.
- **Recorridos del router real.** Los ocho ficheros de [[tasks]]
  §Conjuntos comunes se corren en el verde de R5.
- **Pestaña Mapa.** `src/screens/map/index.test.tsx` se corre en el verde de
  R3 sin tocarlo.

## Archivos afectados

Rutas bajo `mobile-pet-tracker/` salvo que se diga otra cosa.

**Lógica pura**

- `src/utils/zoom-for-radius.ts` (nuevo) — R2.
- `src/utils/zoom-for-radius.test.ts` (nuevo) — R2.

**Acceso a API**

- `src/api/geofences.ts` — R4: `GeofenceDraft`, `GeofenceSaveState`,
  `saveState`, `createGeofence`, `updateGeofence`; `postJson` al import.
- `src/api/__tests__/geofences.test.ts` — R4.

**Componentes y pantallas**

- `src/components/pet-map.tsx` — R3.
- `src/components/__tests__/pet-map.test.tsx` — R3 (y el mock de tema).
- `src/screens/geofence-editor/index.tsx` (nuevo) — stub en R5; R6–R8, M13
  en R10.
- `src/screens/geofence-editor/index.test.tsx` (nuevo) — R6–R8.
- `src/screens/geofences/index.tsx` — R9.
- `src/screens/geofences/index.test.tsx` — R9 y las aserciones de #41 de D8.

**Navegación**

- `src/app/pets/[petId]/geofence-editor.tsx` (nuevo) — R5.
- `src/app/_layout.tsx` — R5.
- `src/app/__tests__/layout.test.tsx` — R5 y tres recuentos heredados.
- `src/app/__tests__/detail-stack.test.tsx` — R5.

**Copy**

- `src/i18n/catalog.ts` — R1.
- `src/providers/__tests__/language-provider.test.tsx` — R1 y `#65 R12`.
- `src/__tests__/ui-copy-table.ts` — R10.
- `src/__tests__/ui-language.test.ts` — R10 y `#65 R18`.

**Candados que solo cambian un recuento**

- `src/__tests__/design-drift.test.ts` — `#87 R19` (R8).
- `src/__tests__/consistency-classnames.test.ts` — `#62 R1` y `#98 R10`
  (R8 y R9).

**Docs y specs (raíz del repo)**

- `docs/conventions.md` y `docs/ui-guidelines.md` — A19.
- `specs/mobile-ui-language/design.md` — §2.16 (R1).
- `specs/mobile-geofence-editor/` — esta spec y su trazabilidad.

**No se tocan:** `backend-pet-tracker/`, `infra/`, `package.json`,
`app.json`, `bun.lock`, `src/screens/map/` y `src/__tests__/legibility-classnames.test.ts`
(sus regex no casan con los tokens del editor; se corre como candado).

## Anclas

Verificadas con `grep -cF` sobre `95b2aaa4`. Son contenido, no números de
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

## Aserciones heredadas que cambian (D8)

Toda aserción ya aprobada que esta feature mueve está aquí, con su
requisito. Codex cambia **solo** estas: si un rojo heredado no está en la
tabla, para y lo anota en `progress/impl_mobile-geofence-editor.md` en vez
de ajustar la aserción.

| Fila | Candado (fichero › describe) | Cambio exacto | Requisito |
|---|---|---|---|
| 1 | `language-provider.test.tsx` › `#65 R12` | la expresión pasa de `… - 6 + 1 + 2 + 3 + 11,` a `… - 6 + 1 + 2 + 3 + 11 + 12,` (320 → 332); el comentario que acaba en `+ 11 de #41 R1 (geofences.*).` gana ` + 12 de #146 R1 (geofenceEditor.*).` | R1 |
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

**Verificado que no cambia** (si Codex lo ve rojo, es una regresión suya,
no una fila que falte):

- `#41 R6` en `geofences/index.test.tsx`: sigue leyendo `childTestIds(card)[1]`.
- `#41 R8` en el mismo fichero: sigue esperando `[undefined, \`geofence-${id}-status\`]`
  para el no-dueño.
- El error de acción (`{actionError ? (`) sigue siendo el último hijo de la
  lista; el botón *Añadir zona* va antes.
- `#41 R4` de `detail-stack.test.tsx`: la ruta de la lista no se toca; R5
  añade su propio `describe` al lado.
- `#41 R10`: `R14_GEOFENCES` sigue con 18 filas y sin tocar. Las dos claves
  nuevas de la lista (`geofenceEditor.editLabel`, `geofenceEditor.add`) van
  en `R15_GEOFENCE_EDITOR` con las del editor ([[requirements]] R10).

## Delta de tests

Tests nuevos (`it` o fila de `it.each`), sin contar los heredados que solo
cambian de valor:

| Fichero | Δ tests | Requisitos |
|---|---|---|
| `src/providers/__tests__/language-provider.test.tsx` | +1 | R1 |
| `src/utils/zoom-for-radius.test.ts` (nuevo) | +8 | R2 |
| `src/components/__tests__/pet-map.test.tsx` | +8 | R3 |
| `src/api/__tests__/geofences.test.ts` | +25 | R4 |
| `src/app/__tests__/layout.test.tsx` | +2 | R5 |
| `src/app/__tests__/detail-stack.test.tsx` | +1 | R5 |
| `src/screens/geofence-editor/index.test.tsx` (nuevo) | +43 | R6 (19), R7 (8), R8 (16) |
| `src/screens/geofences/index.test.tsx` | +12 | R9 |
| `src/__tests__/ui-language.test.ts` | +1 | R10 |
| `src/__tests__/design-drift.test.ts` | 0 | R8 (fila D8 5) |
| `src/__tests__/consistency-classnames.test.ts` | 0 | R8, R9 (filas D8 6, 7, 10, 11) |
| **Total** | **+101 tests, +2 suites** | |

Por requisito: R1 1 · R2 8 · R3 8 · R4 25 · R5 3 · R6 19 · R7 8 · R8 16 ·
R9 12 · R10 1 = 101.

La base no está medida ([[requirements]] §Contexto): el leader la mide sobre
el HEAD del handoff, sin pipe, y el cierre de Codex debe dar exactamente
base + 101 tests y base + 2 suites, con los mismos skipped. Cualquier otra
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
- **Contar el límite de 5 zonas en el cliente.** El backend ya lo valida y
  responde 400 con su código; duplicarlo en el cliente crea dos fuentes de
  verdad. El editor solo traduce el código (R4, R8).
- **Pintar las zonas en el mapa de la lista.** Es la desviación de P4: la
  lista sigue siendo texto y el mapa vive solo en el editor.
- **PATCH parcial (solo campos tocados).** El borrador es completo y pequeño;
  enviar el borrador entero evita calcular diferencias y coincide con lo que
  el backend acepta (R4).
