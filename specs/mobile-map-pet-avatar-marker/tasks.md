---
feature: "mobile-map-pet-avatar-marker"
status: spec_ready   # draft | spec_ready | approved
tags: [harness, spec, mobile, ui]
---

# Tareas — [[mobile-map-pet-avatar-marker]] (#230)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/src/` salvo que se diga otra cosa.
>
> **Commits test-primero (C4 de `CHECKPOINTS.md`)**: por cada R, un commit rojo
> (solo tests) y luego un commit verde (producción). Los mensajes literales van
> en cada R. Nada de un commit único con todo.
>
> **Orden** (cada verde deja la suite verde): R2, R1, R3, R4, R5, R6, R7, R8,
> R9, R10, R11.
>
> **Filas que nacen verdes**: algunos `it` son candados de algo que ya se
> cumple cuando se escriben. Se commitean en su commit rojo junto a los que sí
> caen, y en `progress/impl_mobile-map-pet-avatar-marker.md` se anota la
> **mutación plantada** que los pone rojos (plantar, correr, ver rojo,
> revertir, sin commitear). Están marcados «nace verde» abajo, con su mutación.
>
> **Sin reindentar**: el móvil no tiene prettier. Al tocar `index.tsx` y
> `pet-map.tsx` se añade lo nuevo sin cambiar la sangría de lo que ya está.
>
> **Skills**: cargar `expo:expo-overview` al empezar. Para Codex, los nombres de
> skill son los de su catálogo (`.claude/agents/leader.md` §Catálogo real de
> skills de Codex), no los nuestros.
>
> **Esperas**: seguir `docs/conventions.md` §Esperas sobre el árbol
> renderizado; esperar a la misma observación que se aserta, nunca a un
> contador de mock. En `pet-marker-icon.test.tsx` no hace falta `waitFor`:
> los frames y los callbacks se disparan a mano dentro de `act`.
>
> **RNTL 14**: `render`, `fireEvent` y `act` son asíncronos: siempre `await`.
> Todo lo que cuelga de `map-marker-icon` está oculto a la accesibilidad: cada
> `getByTestId` / `queryByTestId` de esos nodos lleva
> `{ includeHiddenElements: true }`.
>
> **Comentarios**: `#230 R<n>`, nunca `#230` suelto (guarda de hex, R11).
>
> **Títulos**: cada `it` se llama exactamente como en [[requirements]] y
> [[traceability]], con el prefijo `#230 R<n>: `. Abajo se citan sin prefijo
> para abreviar.

## Dobles

### `screens/map/pet-marker-icon.test.tsx` (nuevo)

En jest no hay `RNSVGSvgViewModule` real y `toDataURL` es un campo de clase de
`Svg`, no un método del prototipo: un `jest.spyOn(Svg.prototype, 'toDataURL')`
no sirve. Este fichero sustituye react-native-svg entero por stubs de `View`
que reenvían todas sus props (como `components/__tests__/celebration.test.tsx`),
con un `Svg` que expone `toDataURL` por ref:

```tsx
const mockToDataURL = jest.fn();
const mockUseImage = jest.fn();

jest.mock('react-native-svg', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const actual = jest.requireActual<typeof import('react-native-svg')>('react-native-svg');
  const stub = (props: Record<string, unknown>) => React.createElement(View, props);
  const Svg = React.forwardRef((props: Record<string, unknown>, ref) => {
    React.useImperativeHandle(ref, () => ({
      toDataURL: (callback: (base64: string) => void, options: object) =>
        mockToDataURL(props.testID, callback, options),
    }));
    return React.createElement(View, props);
  });
  return { __esModule: true, default: Svg, Svg, Circle: stub, ClipPath: stub, Defs: stub, G: stub, Image: stub, parse: actual.parse };
});
jest.mock('expo-image', () => ({
  __esModule: true,
  useImage: (source: { uri: string }) => mockUseImage(source),
}));
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) => tokens.map((token) => `sentinel-${token}`),
}));
```

- `parse` es el real: sus hijos son elementos de react-native-svg de verdad que
  se comparan con `toEqual` contra `parse(blobatar('Luna'))?.children` calculado
  en el test (importar `blobatar` de `'blobatar'` y `parse` de
  `jest.requireActual('react-native-svg')`).
- Sentinelas: `const FALLBACK_ICON = { sentinel: 'fallback-icon' } as unknown as ImageRef;`
  y `const PHOTO_ICON = { sentinel: 'photo-icon' } as unknown as ImageRef;`
  (objetos planos; nunca `toBe` entre nodos del árbol).
- Base64 de prueba: blobatar `'RkFMTEJBQ0s='`, foto `'UEhPVE8='`.
- Mascotas: `const pet = { id: 'pet-1', name: 'Luna', photoUrl: null };` y
  `const withPhoto = { ...pet, photoUrl: 'https://cdn.example/pets/luna.jpg?X-Amz-Signature=aaa' };`.
- Frames: un array `frames` y dos helpers. `runFrame` ejecuta **un** frame
  (`await act(async () => { frames.shift()?.(0); })`); `runFrames` los ejecuta
  hasta vaciar la cola.
- `beforeEach` (`jest.clearAllMocks()` no restablece implementaciones, así que
  se fijan aquí todas):
  - `frames.length = 0;`
  - `jest.spyOn(PixelRatio, 'get').mockReturnValue(3.5);`
  - `jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => frames.push(callback));`
  - `jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => undefined);`
    Es un no-op **a propósito**: `runFrames` ejecuta también los frames
    cancelados, así que la producción necesita su propio indicador de
    «efecto limpiado» y no puede fiarse solo de `cancelAnimationFrame`.
  - `mockToDataURL.mockImplementation(() => undefined);`
  - `mockUseImage.mockImplementation(({ uri }: { uri: string }) => uri === 'data:image/png;base64,RkFMTEJBQ0s=' ? FALLBACK_ICON : uri === 'data:image/png;base64,UEhPVE8=' ? PHOTO_ICON : null);`
- `afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });`
- Para leer llamadas sin `expect.any`, comparar
  `mockToDataURL.mock.calls.map(([id, , options]) => [id, options])` y llamar
  al callback con `mockToDataURL.mock.calls[i][1]('RkFMTEJBQ0s=')` dentro de
  `await act(async () => { … })`.

### `screens/map/index.test.tsx`

Hoy no dobla react-native-svg ni expo-image: la pantalla pinta el
react-native-svg real y `PetAvatar` usa el `Image` real de expo-image (los tests
de la pastilla de #201 R2 leen su `cacheKey`). Los dobles conservan todo lo
real y solo cambian lo que hace falta:

```tsx
const mockToDataURL = jest.fn();
const mockUseImage = jest.fn();

jest.mock('react-native-svg', () => {
  const actual = jest.requireActual<typeof import('react-native-svg')>('react-native-svg');
  class Svg extends actual.default {
    toDataURL = (callback: (base64: string) => void, options?: object) =>
      mockToDataURL(this.props.testID, callback, options);
  }
  return { __esModule: true, ...actual, default: Svg, Svg };
});
jest.mock('expo-image', () => ({
  __esModule: true,
  ...jest.requireActual<typeof import('expo-image')>('expo-image'),
  useImage: (source: { uri: string }) => mockUseImage(source),
}));
```

- El campo de la subclase se inicializa después del de `Svg`, así que lo
  sustituye; los demás `Svg` de la pantalla se pintan igual que hoy.
- En el `beforeEach` existente, tras `jest.clearAllMocks()`:
  `mockToDataURL.mockImplementation(() => undefined);` y
  `mockUseImage.mockImplementation(() => null);`. Con esto ninguna composición
  termina y los 5 asertos existentes sobre `markers` (los de
  `id: 'last-position'` y el de `markers: []`) no cambian.
- El doble de `expo-maps` se reutiliza tal cual (reenvía `markers` como prop
  de `map-view`).

### `components/__tests__/pet-map.test.tsx`

Sin dobles nuevos. Sentinela `const ICON = { sentinel: 'marker-icon' } as unknown as ImageRef;`.

## R2 — `PetMap` acepta `markerIcon`

- [ ] (1) Escribir test que falla para R2: en `components/__tests__/pet-map.test.tsx`,
  junto a «identifica la última posición como un único marker», los tres `it`
  de R2. Cae el primero: hoy `PetMap` ignora `markerIcon` y el marcador no
  lleva `icon`. «sin icono conserva su forma exacta» (`toStrictEqual` con
  `markerIcon={null}` y sin la prop) y «sin posición no hay marcador aunque haya
  icono» **nacen verdes**; mutaciones: añadir siempre
  `icon: props.markerIcon` al marcador, y cambiar la condición a
  `props.marker || props.markerIcon`.
  Commit: `test(mobile): pet map marker takes an optional icon (R2)`
- [ ] (2) Implementación mínima que lo pasa: `components/pet-map.tsx`.
  `import type { ImageRef } from 'expo-image';`, `markerIcon?: ImageRef | null;`
  en `PetMapProps` tras `marker`, y en `markers` el spread condicional del mismo
  estilo que `polylineWidth`:
  `[{ id: 'last-position', coordinates: props.marker, ...(props.markerIcon ? { icon: props.markerIcon, anchor: { x: 0.5, y: 0.5 }, showCallout: false } : {}) }]`.
  Commit: `feat(mobile): pet map marker takes an optional icon (R2)`
- [ ] (3) Refactor con tests verdes (B1 = 1, B2 = 3).

## R1 — Compositor oculto y sin copy

- [ ] (1) Escribir test que falla para R1: crear `screens/map/pet-marker-icon.test.tsx`
  con los dobles de arriba y el `it` de R1: `await render(<PetMarkerIcon pet={pet} onIcon={jest.fn()} />)`
  y, sobre `screen.getByTestId('map-marker-icon', { includeHiddenElements: true })`,
  `props.pointerEvents === 'none'`, `props.accessibilityElementsHidden === true`,
  `props.importantForAccessibility === 'no-hide-descendants'` y
  `toHaveStyle({ position: 'absolute', top: 0, right: 0, opacity: 0.01 })`. En
  `__tests__/map-canvas-fidelity.test.ts`, un `describe('#230: compositor del marcador', …)`
  al final del fichero con «#230 R1: el compositor no trae copy»:
  `readProduction('screens/map/pet-marker-icon.tsx')` no casa con
  `/useTranslate|\bt\(|<Text\b/`. Caen los dos: el módulo no existe.
  Commit: `test(mobile): hidden marker composer without copy (R1)`
- [ ] (2) Implementación mínima que lo pasa: crear `screens/map/pet-marker-icon.tsx`
  con `PetMarkerIcon` devolviendo solo el `View` de R1.
  Commit: `feat(mobile): hidden marker composer without copy (R1)`
- [ ] (3) Refactor con tests verdes (B3 = sí, B4 = sí).

## R3 — Dibujo sin foto

- [ ] (1) Escribir test que falla para R3: con `pet` (sin foto), aserta cada nodo
  de R3 por `testID`: el `Svg` (`width`, `height`, `viewBox`), el `ClipPath`
  (`id`) y su `Circle`, el disco (`cx`, `cy`, `r`,
  `fill === 'sentinel-accent-foreground'`), `map-marker-blob-clip`
  (`clipPath === 'url(#map-marker-fallback-clip)'`), `map-marker-blob`
  (`transform` y `props.children` `toEqual` `parse(blobatar('Luna'))?.children`)
  y el anillo (`r === 20.5`, `stroke === 'sentinel-accent-foreground'`,
  `strokeWidth === 3`, `fill === 'none'`). Cae porque el compositor está vacío.
  Commit: `test(mobile): marker composer draws the blobatar fallback (R3)`
- [ ] (2) Implementación mínima que lo pasa: el `Svg` de R3 dentro del `View`,
  con `useThemeColors(['accent-foreground'])` y `parse(blobatar(pet.name))?.children`
  (en `useMemo` por nombre).
  Commit: `feat(mobile): marker composer draws the blobatar fallback (R3)`
- [ ] (3) Refactor con tests verdes (sin literales de color).

## R4 — Captura del blobatar

- [ ] (1) Escribir test que falla para R4. «captura el blobatar a 154 px tras
  dos frames y publica su icono»:
  - tras el render, 0 llamadas a `mockToDataURL`;
  - tras un `runFrame`, siguen 0;
  - tras el segundo `runFrame`, las llamadas son
    `[['map-marker-fallback-svg', { width: 154, height: 154 }]]`;
  - llamar al callback con `'RkFMTEJBQ0s='` deja como última llamada de
    `mockUseImage` `[{ uri: 'data:image/png;base64,RkFMTEJBQ0s=' }]`;
  - `onIcon` tiene exactamente una llamada:
    `[{ key: '["pet-1","Luna",""]', icon: FALLBACK_ICON }]`.

  «desmontado antes del segundo frame no captura»: render, un `runFrame`,
  `unmount()`, `runFrames()` y 0 llamadas a `mockToDataURL`. Caen los dos
  porque no hay captura.
  Commit: `test(mobile): marker composer captures the fallback after two frames (R4)`
- [ ] (2) Implementación mínima que lo pasa:
  - `useRef<Svg>(null)` en el `Svg` de R3;
  - efecto de montaje con dos `requestAnimationFrame` encadenados, un
    indicador local de limpieza y `cancelAnimationFrame` en la limpieza;
  - `toDataURL` con `Math.round(44 * PixelRatio.get())` de ancho y alto;
  - estado con la captura;
  - un hijo cargador, sin `key`, que se monta cuando hay captura, llama a
    `useImage({ uri })` y, en un efecto sobre el icono, llama a `onIcon`.

  Exportar `markerCompositionKey` con la versión mínima
  `JSON.stringify([pet.id, pet.name, pet.photoUrl ?? ''])` (R8 la completa).
  Commit: `feat(mobile): marker composer captures the fallback after two frames (R4)`
- [ ] (3) Refactor con tests verdes.

## R5 — Dibujo con foto

- [ ] (1) Escribir test que falla para R5:
  - «con foto dibuja la foto recortada en círculo con borde de 3», con
    `withPhoto`: el `Svg` de foto y su `viewBox`, el `ClipPath` (`id`) y su
    `Circle`, y `map-marker-photo` (`href` `toEqual`
    `{ uri: withPhoto.photoUrl }`, `x`, `y`, `width`, `height`,
    `preserveAspectRatio === 'xMidYMid slice'`,
    `clipPath === 'url(#map-marker-photo-clip)'`). Comprueba también el
    anillo `map-marker-photo-ring` y que `map-marker-fallback-svg` sigue
    montado.
  - «con photoUrl null o vacía no hay Svg de foto»: dos renders, con `null` y
    con `''`, y `queryByTestId('map-marker-photo-svg', { includeHiddenElements: true })`
    es null en ambos. **Nace verde**; mutación: montar la foto con
    `pet.photoUrl !== null`.

  Cae el primero: no hay `Svg` de foto.
  Commit: `test(mobile): marker composer draws the circular photo (R5)`
- [ ] (2) Implementación mínima que lo pasa: segundo `Svg` cuando
  `pet.photoUrl` es verdadero (mismo criterio que `PetAvatar`), leyendo
  `pet` de las props.
  Commit: `feat(mobile): marker composer draws the circular photo (R5)`
- [ ] (3) Refactor con tests verdes.

## R6 — Captura de la foto, que gana

- [ ] (1) Escribir test que falla para R6:
  - «al cargar la foto la captura y sustituye al blobatar», con `withPhoto`:
    - `runFrames()` y el callback del blobatar con `'RkFMTEJBQ0s='` (primer
      `onIcon` con `FALLBACK_ICON`);
    - `await fireEvent(screen.getByTestId('map-marker-photo', { includeHiddenElements: true }), 'load')`
      y luego `runFrames()`;
    - la segunda llamada de `mockToDataURL` es
      `['map-marker-photo-svg', { width: 154, height: 154 }]`;
    - su callback con `'UEhPVE8='` hace que la última llamada de
      `mockUseImage` sea `{ uri: 'data:image/png;base64,UEhPVE8=' }` y que el
      último `onIcon` sea `{ key: '["pet-1","Luna","https://cdn.example/pets/luna.jpg?X-Amz-Signature=aaa"]', icon: PHOTO_ICON }`.
      Es la clave mínima de R4, con la query: R8 enmienda este literal a
      `'["pet-1","Luna","https://cdn.example/pets/luna.jpg"]'` con sufijo
      `(enmendado por #230 R8)` en el título.
  - «una captura del blobatar que llega tarde no pisa la foto»: con
    `withPhoto`, `runFrames()`, `load` y `runFrames()`. Se responde primero
    el callback de la foto y después el del blobatar. La última llamada de
    `mockUseImage` sigue siendo la de la foto y el último `onIcon` lleva
    `PHOTO_ICON`.

  Caen porque `onLoad` no hace nada.
  Commit: `test(mobile): marker composer captures the photo and keeps it (R6)`
- [ ] (2) Implementación mínima que lo pasa: `onLoad` del `Image` de foto
  programa dos frames y `toDataURL` del `Svg` de foto. El cargador recibe
  `uri = capturaFoto ?? capturaBlobatar`.
  Commit: `feat(mobile): marker composer captures the photo and keeps it (R6)`
- [ ] (3) Refactor con tests verdes.

## R7 — Plazo de 4000 ms

- [ ] (1) Escribir test que falla para R7, en un `describe` con
  `jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })`
  antes del render. Así los frames siguen en el array y los temporizadores son
  falsos.
  - «sin onLoad en 4000 ms la foto se desmonta y queda el blobatar», con
    `withPhoto`:
    - `await act(async () => { jest.advanceTimersByTime(3999); })` y
      `map-marker-photo-svg` sigue;
    - tras otro `advanceTimersByTime(1)`, `queryByTestId('map-marker-photo-svg', { includeHiddenElements: true })`
      es null y `map-marker-fallback-svg` sigue;
    - `runFrames()`: ninguna llamada a `mockToDataURL` es de
      `'map-marker-photo-svg'`.
  - «un onLoad antes del plazo lo cancela»: `load` a los 1000 ms, avanzar
    hasta 5000 y `map-marker-photo-svg` sigue montado. **Nace verde**;
    mutación: no cancelar el plazo en `onLoad`.

  Cae el primero: no hay plazo.
  Commit: `test(mobile): marker photo falls back after 4000 ms (R7)`
- [ ] (2) Implementación mínima que lo pasa:
  - `setTimeout` de 4000 ms al montar cuando hay foto;
  - al vencer, un estado desmonta el `Svg` de foto;
  - `onLoad` lo cancela con `clearTimeout`, y la limpieza del efecto también.
  Commit: `feat(mobile): marker photo falls back after 4000 ms (R7)`
- [ ] (3) Refactor con tests verdes.

## R8 — Clave de composición y props congeladas

- [ ] (1) Escribir test que falla para R8.
  «la clave ignora la firma y distingue id, nombre y ruta» es una tabla sobre
  `markerCompositionKey`:

  | Mascota | Clave |
  |---|---|
  | `pet` | `'["pet-1","Luna",""]'` |
  | `{ ...pet, photoUrl: '' }` | la de `pet` |
  | `withPhoto` | igual que con `photoUrl` `…/luna.jpg?X-Amz-Signature=bbb`, y `'["pet-1","Luna","https://cdn.example/pets/luna.jpg"]'` |
  | ruta `…/luna-2.jpg`, nombre `'Milo'`, id `'pet-2'` | distinta de la de `withPhoto` |

  «un rerender con la URL re-firmada no recompone»: con `withPhoto`, completar
  la captura de la foto como en R6. Luego
  `screen.rerender(<PetMarkerIcon pet={{ ...withPhoto, photoUrl: 'https://cdn.example/pets/luna.jpg?X-Amz-Signature=bbb' }} onIcon={onIcon} />)`
  y `runFrames()`. El `href` de `map-marker-photo` sigue con `…=aaa` y el
  número de llamadas a `mockToDataURL` no cambia.

  Enmendar el literal de clave del primer `it` de R6, como dice R6.

  Caen la fila de las dos firmas y el `href`.
  Commit: `test(mobile): marker composition key ignores the url signature (R8)`
- [ ] (2) Implementación mínima que lo pasa: `photoUrl.split('?')[0]` en la
  clave (`''` si es falsy) y la mascota congelada al montar
  (`const [frozen] = useState(pet)`); todo el componente lee `frozen`.
  Commit: `feat(mobile): marker composition key ignores the url signature (R8)`
- [ ] (3) Refactor con tests verdes.

## R9 — Icono vigente

- [ ] (1) Escribir test que falla para R9: tabla sobre `currentMarkerIcon`:
  `(null, pet)` → null; `({ key: markerCompositionKey(pet), icon: FALLBACK_ICON }, undefined)`
  → null; misma clave → `FALLBACK_ICON`; clave de `withPhoto` y mascota
  `{ ...withPhoto, photoUrl: '…?X-Amz-Signature=bbb' }` → `FALLBACK_ICON`;
  clave de `pet` y mascota `{ ...pet, id: 'pet-2' }` → null. Cae porque la
  función no existe.
  Commit: `test(mobile): only the current composition icon reaches the map (R9)`
- [ ] (2) Implementación mínima que lo pasa: `export type MarkerIconState` y
  `export function currentMarkerIcon`.
  Commit: `feat(mobile): only the current composition icon reaches the map (R9)`
- [ ] (3) Refactor con tests verdes.

## R10 — Integración en el Mapa

- [ ] (1) Escribir test que falla para R10: dobles de `index.test.tsx` de
  arriba y un `describe('#230 R10: marcador con avatar', …)` con tiempo real.
  - «con posición monta el compositor oculto»: el escenario por defecto
    (posición y `makePet()`). Esperar con
    `await waitFor(() => expect(screen.getByTestId('map-marker-icon', { includeHiddenElements: true })).toBeTruthy())`.
  - «sin posición no monta el compositor»: el mismo escenario que el `it`
    existente que espera `map-empty-overlay`
    (`mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: null })`).
    Esperar a `map-empty-overlay` visible y entonces `queryByTestId('map-marker-icon', { includeHiddenElements: true })`
    es null. **Nace verde**; mutación: montar el compositor sin mirar
    `marker`.
  - «el marcador recibe el icono compuesto»:
    - `mockToDataURL.mockImplementation((_id, callback) => callback('RkFMTEJBQ0s='))`;
    - `mockUseImage.mockImplementation(({ uri }) => uri === 'data:image/png;base64,RkFMTEJBQ0s=' ? FALLBACK_ICON : null)`;
    - `await waitFor(() => expect(screen.getByTestId('map-view').props.markers).toEqual([{ id: 'last-position', coordinates: <las del escenario>, icon: FALLBACK_ICON, anchor: { x: 0.5, y: 0.5 }, showCallout: false }]))`.

  En `__tests__/map-canvas-fidelity.test.ts`, dentro del `describe` de R1:
  «#230 R10: el mapa monta el compositor con la clave de composición»
  (`readProduction('screens/map/index.tsx')` contiene
  `key={markerCompositionKey(selectedPet)}` y
  `markerIcon={currentMarkerIcon(markerIcon, selectedPet)}`). Caen el primero,
  el tercero y el de fidelidad: la pantalla no monta el compositor.
  Commit: `test(mobile): map shows the pet avatar marker (R10)`
- [ ] (2) Implementación mínima que lo pasa: `screens/map/index.tsx`.
  - Import desde `'./pet-marker-icon'` de `PetMarkerIcon`,
    `currentMarkerIcon`, `markerCompositionKey` y `type MarkerIconState`.
  - `const [markerIcon, setMarkerIcon] = useState<MarkerIconState>(null);`
    justo después de `const [lostModeFailed, setLostModeFailed] = useState(false);`.
  - `markerIcon={currentMarkerIcon(markerIcon, selectedPet)}` en `<PetMap>`
    tras `marker={marker}`.
  - Tras el cierre `/>` de `<PetMap>`:
    `{selectedPet && marker ? (<PetMarkerIcon key={markerCompositionKey(selectedPet)} pet={selectedPet} onIcon={setMarkerIcon} />) : null}`.

  Commit: `feat(mobile): map shows the pet avatar marker (R10)`
- [ ] (3) Refactor con tests verdes (B5 = 1, B6 = 1; los asertos existentes de
  `markers` sin tocar).

## R11 — Guardas de deriva del compositor

- [ ] (1) Escribir test para R11 en el `describe` de R1 de
  `__tests__/map-canvas-fidelity.test.ts`:
  - `it.each(Object.keys(guards))('#230 R11: screens/map/pet-marker-icon.tsx respeta la guarda %s', …)`,
    con el mismo cuerpo que el de #201 R16;
  - «#230 R11: el compositor importa solo lo suyo»: los especificadores de
    `import … from '…'` del fichero, ordenados, son
    `['../../api/types', '../../theme/use-theme-colors', 'blobatar', 'expo-image', 'react', 'react-native', 'react-native-svg']`
    (orden de `.sort()`; comprobarlo con node antes de commitear).

  Los siete **nacen verdes**. Mutaciones, una por fila:
  - hex: un `'#FFFFFF'`;
  - `StyleSheet.create`;
  - un emoji en un comentario;
  - `import 'expo-linear-gradient'`;
  - `className="rounded-[7px]"`;
  - `className="text-accent"`;
  - un import de `'../../components/pet-avatar'`.

  Commit: `test(mobile): drift guards for the marker composer (R11)`
- [ ] (2) Implementación mínima que lo pasa: nada que cambiar si R1–R10 ya
  cumplen. Si alguna guarda cae, corregir el fichero de producción en un
  commit `fix(mobile): marker composer passes the map drift guards (R11)`.
- [ ] (3) Refactor con tests verdes (B7 = 0, B8 = 0, B9 = 0; suite de
  `src/__tests__` completa sin cambios en tests existentes; inventario de
  [[requirements]] §Inventario).
