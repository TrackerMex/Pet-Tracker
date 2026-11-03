Worktree: /home/claude/sites/Pet-Tracker-wt-230-spike
NO ejecutes ./init.sh aunque AGENTS.md lo pida. NO ejecutes jest. NO instales dependencias.

# Handoff a Codex: spike de #230 (marcador con avatar, opción B2)

Rama `spike/230-avatar-marker`, sobre `36f97953`. **Es un spike: código
desechable que nunca se mergea.** El humano lo corre en su dev build de Android
para decidir si la opción B2 de `progress/explore_mobile-map-pet-avatar-marker.md`
funciona. No hay spec ni R-ids, no hay TDD y no se escriben tests. Los tests de
Mapa que se rompan con el cambio se quedan rotos: la rama no se mergea.

Skills de tu plugin `expo` que aplican: `building-native-ui`.

## Objetivo

En la pantalla Mapa, el marcador de la última posición deja de ser el pin rojo de
Google y pasa a mostrar un PNG compuesto en JS:

1. Un `<Svg>` de react-native-svg montado en la pantalla dibuja el avatar: foto
   recortada en círculo o blobatar, más el anillo.
2. `toDataURL` saca un PNG en base64.
3. `useImage` de expo-image lo carga como `ImageRef`.
4. Ese `ImageRef` va al `icon` del marcador de expo-maps.

Un panel de depuración sobre el mapa enseña qué pasó en cada paso.

## Ficheros (lista cerrada)

1. `mobile-pet-tracker/src/components/spike-avatar-marker.tsx` (nuevo)
2. `mobile-pet-tracker/src/components/pet-map.tsx`
3. `mobile-pet-tracker/src/screens/map/index.tsx`
4. `progress/impl_spike-230.md` (tu informe)
5. `progress/impl_spike-230.done` (marcador final, vacío)

No toques nada más. `progress/spike_mobile-map-pet-avatar-marker.md` y este
handoff ya los escribió el leader.

## 1. `src/components/spike-avatar-marker.tsx`

Todos los imports son de paquetes ya instalados:
- `blobatar` de `blobatar`;
- `useImage` y `type ImageRef` de `expo-image`;
- `Svg`, `Circle`, `ClipPath`, `Defs`, `G`, `Image as SvgImage` y `parse` de
  `react-native-svg`;
- `PixelRatio`, `Image as RNImage`, `Pressable`, `Text` y `View` de
  `react-native`.

Constantes exportadas, con estos valores exactos (del artboard aprobado en G1):

```ts
export const SPIKE_MARKER_DP = 44;   // diámetro del marcador
export const SPIKE_RING_DP = 3;      // anillo blanco
export const SPIKE_BLOB_DP = 38;     // blobatar dentro del círculo, centrado
export const SPIKE_TIMEOUT_MS = 4000;
export type SpikeVariant = 'photo' | 'broken-url' | 'no-photo';
```

### Tipo del informe

```ts
export type SpikeReport = {
  variant: SpikeVariant;
  visible: boolean;            // composición visible (opacity 1) u oculta (opacity 0.01)
  usedUrl: string | null;      // URL que se pasó al <SvgImage>, recortada a 80 caracteres
  brokenKind: 'signature-zeroed' | 'invalid-host' | null;
  pixelRatio: number;          // PixelRatio.get()
  requestedPx: number;         // Math.round(SPIKE_MARKER_DP * PixelRatio.get())
  stage: 'composing' | 'photo-loaded' | 'timeout-fallback' | 'captured' | 'icon-ready'
       | 'capture-timeout' | 'icon-error';
  msToPhotoLoad: number | null;  // desde el montaje hasta onLoad del <SvgImage>
  msToCapture: number | null;    // desde el montaje hasta el callback de toDataURL
  msToIcon: number | null;       // desde el montaje hasta el ImageRef no nulo
  base64Length: number | null;
  decodedWidth: number | null;   // RNImage.getSize del data URL
  decodedHeight: number | null;
  iconWidth: number | null;      // ImageRef.width
  iconHeight: number | null;     // ImageRef.height
  error: string | null;
};
```

Cada vez que cambie `stage`, haz
`console.log('[spike-230]', JSON.stringify(report))`. El humano copia esas
líneas de la terminal de Metro.

### Componente `SpikeAvatarComposer`

Props: `{ name: string; photoUrl: string | null; variant: SpikeVariant;
visible: boolean; onReport: (r: SpikeReport) => void;
onIcon: (icon: ImageRef | null, dataUrl: string | null) => void }`.

- **URL efectiva**:
  - con `variant === 'no-photo'` o `photoUrl === null`, no hay URL y se compone
    el blobatar;
  - con `'photo'`, se usa `photoUrl`;
  - con `'broken-url'`: si `photoUrl` contiene `X-Amz-Signature=`, sustituye
    los 64 caracteres hexadecimales que siguen por 64 ceros
    (`brokenKind: 'signature-zeroed'`); si no, usa
    `https://invalid.invalid/spike-230.jpg` (`brokenKind: 'invalid-host'`).
- **Contenedor**:
  `<View pointerEvents="none" style={{ position: 'absolute', top: 0, right: 0, opacity: visible ? 1 : 0.01 }}>`.
  Dentro va `<Svg ref={svgRef} width={44} height={44} viewBox="0 0 44 44">`.
- **Con URL**:
  - `<Defs><ClipPath id="spike-230-clip"><Circle cx={22} cy={22} r={22} /></ClipPath></Defs>`;
  - `<SvgImage href={{ uri }} x={0} y={0} width={44} height={44} preserveAspectRatio="xMidYMid slice" clipPath="url(#spike-230-clip)" onLoad={...} />`;
  - el anillo: `<Circle cx={22} cy={22} r={20.5} stroke="#FFFFFF" strokeWidth={3} fill="none" />`.
- **Sin URL** (blobatar):
  - `<Circle cx={22} cy={22} r={22} fill="#FFFFFF" />`;
  - `<G transform="translate(3 3) scale(0.38)">{parse(blobatar(name))?.children}</G>`;
  - el mismo anillo.
  `parse` devuelve un `JsxAST` cuyos `children` ya son elementos de React.
- **Captura**:
  - Se dispara con `onLoad` del `<SvgImage>` si hay URL, o tras el montaje si
    no la hay.
  - Espera dos `requestAnimationFrame` seguidos y llama
    `svgRef.current?.toDataURL(cb, { width: requestedPx, height: requestedPx })`.
  - En `cb(base64)`: guarda `'data:image/png;base64,' + base64`, mide con
    `RNImage.getSize` y pasa a `stage: 'captured'`.
  - Si el callback no llega en `SPIKE_TIMEOUT_MS`, pon `stage: 'capture-timeout'`.
- **Timeout de la foto**: si hay URL y `onLoad` no llega en `SPIKE_TIMEOUT_MS`,
  pon `stage: 'timeout-fallback'` y recompón sin URL (blobatar). El
  `msToPhotoLoad` queda `null`.
- **Icono**:
  - `useImage` no admite fuente nula, así que va en un hijo
    `SpikeIconLoader({ dataUrl, onIcon, onError })` que solo se monta cuando
    hay data URL.
  - Ese hijo llama `useImage({ uri: dataUrl }, { onError: (e) => onError(String(e)) })`.
  - En un `useEffect` sobre la ref, cuando no sea nula, llama `onIcon(ref, dataUrl)`.
  - Con ref no nula, `stage: 'icon-ready'` con `iconWidth` e `iconHeight`. Si
    `onError` salta, `stage: 'icon-error'`.

### Componente `SpikePanel`

Props: `{ report: SpikeReport | null; dataUrl: string | null;
variant: SpikeVariant; visible: boolean; onVariant: (v: SpikeVariant) => void;
onToggleVisible: () => void; top: number }`.

- Contenedor:
  `<View testID="spike-230-panel" style={{ position: 'absolute', top, left: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.78)', padding: 8, borderRadius: 8, gap: 4 }}>`.
- Una línea `<Text style={{ color: '#FFFFFF', fontSize: 11 }}>` por campo del
  informe, con el formato `campo: valor`.
- Una fila con tres `Pressable` («Foto», «URL rota», «Sin foto») que llaman a
  `onVariant`, más uno «Visible: sí/no» que llama a `onToggleVisible`. El activo
  va con fondo `#178255`; el resto, con `#333333`. Texto blanco de 12.
- Si hay `dataUrl`, a la derecha va
  `<RNImage source={{ uri: dataUrl }} style={{ width: 44, height: 44 }} />` con
  la etiqueta «PNG».

## 2. `src/components/pet-map.tsx`

- Añade a `PetMapProps` la prop opcional `markerIcon?: SharedRefType<'image'> | null`,
  con `import type { SharedRefType } from 'expo';`.
- Si `props.marker` existe y `props.markerIcon` no es nulo, el marcador pasa a ser
  `{ id: 'last-position', coordinates: props.marker, icon: props.markerIcon, anchor: { x: 0.5, y: 0.5 }, showCallout: false }`.
- Sin `markerIcon`, el marcador queda como hoy.

## 3. `src/screens/map/index.tsx`

- Estado local:
  - `const [spikeVariant, setSpikeVariant] = useState<SpikeVariant>('photo')`;
  - `const [spikeVisible, setSpikeVisible] = useState(false)`;
  - `spikeReport`, `spikeIcon` (`ImageRef | null`) y `spikeDataUrl`.
- Al cambiar la variante o `spikeVisible`, vacía `spikeIcon`, `spikeDataUrl` y
  `spikeReport`.
- Dentro del bloque `petsReady && last.data?.kind === 'ok'` que pinta `<PetMap`,
  si hay `selectedPet`, monta
  `<SpikeAvatarComposer key={`${spikeVariant}-${spikeVisible}-${selectedPet.id}`} name={selectedPet.name} photoUrl={selectedPet.photoUrl} ... />`.
  La foto sale de `selectedPet`, es decir, de la lista y no del detalle, como la
  píldora de `map-pet-pill-avatar`.
- Pasa `markerIcon={spikeIcon}` a `<PetMap`.
- Monta `<SpikePanel top={insets.top + 8} ... />` como último hijo de ese bloque,
  encima de todo.
- No cambies nada más de la pantalla.

## Comprobaciones antes de terminar

Ejecuta desde `cd /home/claude/sites/Pet-Tracker-wt-230-spike/mobile-pet-tracker`:

```bash
bun run typecheck > /tmp/spike230-tsc.log 2>&1; echo "tsc=$?"
```

Debe imprimir `tsc=0`. Si los errores son de tus ficheros, corrígelos; si no son
tuyos, anótalos en el informe sin tocarlos. No ejecutes jest, `expo lint`,
`./init.sh` ni `bun install`.

```bash
cd /home/claude/sites/Pet-Tracker-wt-230-spike
git diff --name-only 36f97953 -- mobile-pet-tracker | sort
```

Debe listar exactamente estas tres rutas: `src/components/pet-map.tsx`,
`src/components/spike-avatar-marker.tsx` y `src/screens/map/index.tsx`, todas
bajo `mobile-pet-tracker/`.

## Commit

Un solo commit con los tres ficheros de código. Es un spike y nunca se mergea,
así que no aplica test-primero:

```bash
cd /home/claude/sites/Pet-Tracker-wt-230-spike
git add mobile-pet-tracker/src/components/spike-avatar-marker.tsx mobile-pet-tracker/src/components/pet-map.tsx mobile-pet-tracker/src/screens/map/index.tsx
git commit -m "spike(#230): compose the pet avatar into the map marker icon (B2, throwaway)"
```

No hagas push: lo hace el leader.

## Informe y marcador

- Escribe `progress/impl_spike-230.md` con:
  - el hash del commit;
  - la salida de `tsc`;
  - cualquier desviación de este handoff con su motivo;
  - lo que no pudiste verificar sin dispositivo.
- No lo commitees.
- Al final, `touch progress/impl_spike-230.done`.
