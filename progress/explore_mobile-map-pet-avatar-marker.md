# explore: mobile-map-pet-avatar-marker (#230)
Fecha: 2026-11-03
Base: `origin/dev` f05016d3 (worktree `Pet-Tracker-wt-230`, branch `feature/230-mobile-map-pet-avatar-marker`)
Decisión del humano (2026-11-03, literal): «Pin genérico: quiero avatar».

Solo lectura. No se lanzó `./init.sh`, no se instaló nada y no se ejecutó nada en
dispositivo. Todo lo que dice «sin verificar» o «spike» necesita un dev build de Android.

---

## Contexto encontrado

### Estado actual del marcador
- `mobile-pet-tracker/src/components/pet-map.tsx:36-38`: el único marcador es
  `{ id: 'last-position', coordinates: props.marker }`. No lleva `icon`, `anchor`, `zIndex`
  ni `showCallout`, así que Google pinta su pin rojo por defecto. Solo usa `GoogleMaps.View`
  y no tiene rama iOS (iOS es #60, pending).
- `PetMap` se usa en tres sitios:
  - `src/screens/map/index.tsx:402` (`marker={marker}`, `key={selectedPetId}`).
  - `src/screens/alert-detail/index.tsx:53` (`marker={position}`; tiene `alert.petId`, pero
    no hay foto ni nombre de mascota en el ámbito).
  - `src/screens/geofence-editor/index.tsx:156` (`marker={null}`).

### P1. Qué acepta el marcador de `expo-maps` instalado (57.0.2)
- **Android (Google Maps).** Lo dicen los tipos y el código nativo:
  - Tipo `GoogleMapsMarker` en `node_modules/expo-maps/build/google/GoogleMaps.types.d.ts`:
    `{ id?, coordinates?, title?, snippet?, draggable?, showCallout?, icon?: SharedRefType<'image'>, anchor?: {x,y} (0..1, por defecto bottom-center), zIndex? }`.
    No acepta `children` ni vistas propias. La prop es `markers?` (`:336`).
  - Hay `onMarkerClick` (`:401`) y `onCameraMove` (`:418`). Los métodos de ref son
    `setCameraPosition` (`:437`) y `selectMarker` (`:447`). **No existe API de proyección**
    coordenada→pixel.
  - `android/.../Records.kt:62-89`: `icon: Either<SharedRef<Drawable>, SharedRef<Bitmap>>?`.
    `showCallout` vale **true por defecto**. El ancla por defecto es `(0.5, 1.0)`.
  - `GoogleMapsView.kt:197`: `remember(marker.icon) { getIconDescriptor(marker) }`.
    `GoogleMapsView.kt:417-425`: convierte el Drawable con `.toBitmap()` (tamaño intrínseco)
    y llama a `BitmapDescriptorFactory.fromBitmap`. **No escala, no recorta y no pone borde.**
    El tamaño en pantalla es el tamaño en píxeles del bitmap.
  - Docs fijadas (https://docs.expo.dev/versions/v57.0.0/sdk/maps/):
    - El icono «expects an image reference, such as the value returned by the `useImage`
      hook» y «does not accept an image source directly».
    - «The loaded image dimensions determine the marker size, not a marker style prop.»
    - Ejemplo de la doc: `useImage('https://example.com/marker.svg', { maxWidth: 48, maxHeight: 48 })`
      y `anchor: { x: 0.5, y: 0.5 }`.
    - La librería «is not available in the Expo Go app».
- **iOS (Apple Maps).** Según `node_modules/expo-maps/build/apple/AppleMaps.types.d.ts`:
  - `AppleMapsMarker` no tiene `icon`; solo `systemImage` (SF Symbol), `monogram`
    (iOS 17+, 1-2 caracteres) y `tintColor`.
  - El icono de imagen va en `annotations?` (`:413`). El tipo
    `AppleMapsAnnotation = { backgroundColor?, text?, textColor?, icon?: SharedRefType<'image'> } & AppleMapsMarker`
    está en `:277`.
  - Una misma `ImageRef` serviría en las dos plataformas, pero con otra prop. Fuera de
    alcance hasta #60.
- **De dónde sale la ref.** Las APIs están en `expo-image` 57.0.3, que ya está instalado:
  - `useImage(source, { maxWidth, maxHeight, onError(error, retry) })` devuelve
    `ImageRef | null` (`build/useImage.d.ts:39`).
  - En Android, `ExpoImageModule.kt:189` usa Glide con
    `.asDrawable().load(model).centerInside().submit(maxWidth,maxHeight)` y devuelve un
    `SharedRef<Drawable>`, que es justo el lado `Drawable` del `Either` del marcador.
  - `centerInside` **conserva la proporción**. Glide no expone `circleCrop`.
  - `ImageRef` solo expone `width`, `height`, `scale` y `mediaType`
    (`build/Image.types.d.ts:622-643`). No se puede exportar a fichero ni a bytes.

### P2. De dónde sale la foto y qué le hace el polling de 15 s
- El backend firma cada vez:
  - `get-pet.use-case.ts:26` define `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600`.
  - `list-pets.use-case.ts:42` usa ese mismo TTL y vuelve a firmar en cada respuesta.
  - Conclusión: **la URL cambia en cada fetch** aunque la foto sea la misma.
  - La clave S3 es `pets/${petId}/photo-${now.getTime()}` (`media/domain/photo-key.ts`), así
    que solo cambia cuando se reemplaza la foto.
- En la pantalla Mapa:
  - La lista `petKeys.list()` (`map/index.tsx:124`) **no se sondea**.
  - El `useFocusEffect` de `:192-212` repite `refetchDetail`, `refetchLast` y
    `refetchPositions` cada `POLL_MS = 15000` (`:99`). El detalle vuelve a firmar su
    `photoUrl` cada 15 s.
  - `selectedPet` sale de la lista (`:160-163`). La píldora usa
    `PetAvatar photoUrl={selectedPet.photoUrl} cacheKey={selectedPet.id}` (`:455-461`).
  - El test `map/index.test.tsx:1716-1731` («pinta la foto de la lista con su cacheKey
    (enmendado por #201 R2)») ya fija que la fuente es la lista: la lista trae foto y el
    detalle trae `null`.
- Defaults de React Query (`src/providers/query-provider.tsx:22-34`): `staleTime 0`,
  `retry false`, `refetchOnWindowFocus false`, `refetchOnReconnect false`.
- Consecuencias:
  - Si el marcador usa la foto de la lista, como la píldora, el sondeo de 15 s **no** lo toca.
  - Si usa la del detalle, recibe una URL nueva cada 15 s y `useImage` recarga: sus deps
    son `[resolvedSource.uri, ...]` en `src/useImage.ts`, y `cacheKey` no entra.
  - Con `cacheKey`, Glide comparte la caché de disco entre firmas
    (`records/SourceMap.kt:137-141`, `GlideUrlWithCustomCacheKey`). Aun así la ref de JS se
    rehace, `remember(marker.icon)` crea un descriptor nuevo y el marcador puede parpadear.
- Deuda existente, fuera de alcance: la app usa `cacheKey = pet.id` en todas partes. Si se
  reemplaza la foto, la caché de disco puede servir la foto vieja. Una clave estable mejor
  sería la URL sin query (contiene la clave S3).
- El plan, §7, ya lo deja escrito: #230 cambia el marcador, no la frecuencia de 15 s.

### P3. Cómo componer un avatar circular con borde, e inicial o blobatar sin foto
- Las fotos se suben **sin recortar y a resolución completa**: `launchImageLibraryAsync`
  con `quality: 0.8`, sin `allowsEditing` ni redimensionado (`add-pet/index.tsx:134-137`,
  `profile/index.tsx:247-250`). La foto puede no ser cuadrada y pesar varios MB.
- Con `useImage` + `maxWidth` sale un rectángulo reducido (centerInside), no un círculo.
  **Nada nativo de lo instalado recorta en círculo ni añade borde a un raster que vaya
  a un marcador.**
- Pieza instalada que sí lo permite: **`react-native-svg` 15.15.4, con `toDataURL`**.
  - Firma: `Svg.d.ts:27`, `toDataURL(callback(base64), { width, height })`.
  - Android, `SvgView.java:351-377`: dibuja los hijos del `SvgView` en un `Bitmap` nuevo y
    devuelve un PNG en base64. No depende de que la vista sea visible, pero sí de que esté
    montada.
  - `SvgViewModule.java:33-77` espera a que la vista exista y se haya pintado una vez
    (`notRendered`).
  - El PNG resultante, como `data:image/png;base64,…`, entra en `useImage`. Glide decodifica
    los data URL en base64 con su cargador estándar de raster.
- La composición se dibuja en un `<Svg>` montado y oculto:
  - un `ClipPath` circular;
  - con foto, `<Image href={photoUrl} preserveAspectRatio="xMidYMid slice" onLoad>`;
  - sin foto, el blobatar o la inicial;
  - y el anillo de borde.
- Riesgos de esta pieza, ninguno verificado en dispositivo:
  1. El `<Image>` de RNSVG carga con **Fresco** sin `ResizeOptions` (`ImageView.java:113-170`).
     Decodifica la foto a resolución completa: memoria, y una segunda caché además de la de
     Glide de `PetAvatar`.
  2. La caché de Fresco va **por URL completa, firma incluida**: cada URL nueva es una
     descarga nueva.
  3. `toDataURL` solo espera el primer render, no la carga de Fresco. Hay que llamarlo tras
     `onLoad` y un repintado.
  4. En el fallo de Fresco (`onFailureImpl`) solo hay log, **sin evento de error a JS**.
     Hace falta un timeout de respaldo.
  5. Para el blobatar, `SvgXml` (`src/xml.tsx:67-76`) no hace `forwardRef`. Con React 19, la
     `ref` como prop podría llegar al `Svg` interno vía `override || props`, pero no está
     verificado. Alternativas: `parse()` + `SvgAst`, o incrustar el XML del blobatar en la
     composición.
  6. El tamaño en px del bitmap depende de la densidad. La composición debe medir
     `S dp × PixelRatio`, y `toDataURL` debe pedir ese mismo `width` y `height`.
- Patrones de avatar ya existentes:
  - `src/components/pet-avatar.tsx`: foto de `expo-image` con `contentFit="cover"` y
    `borderRadius: size/2`. Sin foto, `SvgXml(blobatar(name))`.
  - `src/components/pet-switcher.tsx:57-67`, variante `avatars`: inicial
    `charAt(0).toUpperCase()` en `font-extrabold`, sobre un círculo
    `CATEGORY_SLOTS[slot].surface` (`src/utils/category-palette.ts:17-27`).
- **Conflicto de premisa, decisión G1:**
  - `docs/ui-guidelines.md:317-327` (§2, enmienda #67 A8) dice que el respaldo sin foto es el
    **blobatar**, no la inicial. La #40 R5 lo fijó con el humano el 2026-08-21.
  - El artboard aprobado `specs/mobile-canvas-map/canvas/Mapa.dc.html:37-40` dibuja el
    marcador así:
    - círculo de 44 px sobre `--amber` (slot);
    - borde blanco de 3 px;
    - sombra `0 4px 12px rgba(13,17,23,0.25)`, que es `shadows.marker` (`src/theme/shadows.ts:21`, hoy sin uso);
    - una inicial «R» de 800 / 16 px en `--amber-s`;
    - centrado, sin punta;
    - más el halo `ping` de #192 (`inset: -18px`, acento al 25 %, animado).
  - Ese mismo artboard pinta la píldora con inicial, pero el código pinta blobatar en la
    píldora porque manda la carta.
- Sombra: §5 (`docs/ui-guidelines.md:902`) exige sombras de `useShadows()`. Un `boxShadow`
  no se aplica a un bitmap de marcador. Opciones: pintar la sombra dentro del PNG (con
  `filter` de RNSVG o un anillo translúcido sin desenfoque, sin verificar) como excepción con
  nombre, o prescindir de ella. Es una decisión.

### P4. ¿Hace falta dev build nuevo?
- **No**, si solo se usa lo instalado: `expo-maps`, `expo-image` (`useImage`) y
  `react-native-svg` (`toDataURL`). Todos tienen ya su parte nativa en el dev build actual;
  el cambio es solo JS.
- **Sí**, con cualquier dependencia nativa nueva: `react-native-view-shot`,
  `@shopify/react-native-skia` o `expo-image-manipulator`. Ninguna está instalada. Necesita
  autorización (gate humano) y un rebuild.
- `expo-file-system` y `expo-asset` solo están como dependencias transitivas de `expo`. No
  está verificado si van autolinkeadas en el build actual. La opción recomendada no las
  necesita.
- iOS necesita #60 en cualquier caso.

### P5. Cómo se doblan hoy los mapas en los tests y qué candado no sería tautológico
- `src/components/__tests__/pet-map.test.tsx:6-29`: `jest.mock('expo-maps')` con
  `GoogleMaps.View` → `View` que reenvía todas las props. `useThemeColors` está doblado como
  `color:<token>`. La aserción del marcador está en `:93-107`:
  `markers toEqual [{ id: 'last-position', coordinates }]`.
- `src/screens/map/index.test.tsx:96-115`: el mismo patrón de stub. Hay **4** aserciones
  exactas de `id: 'last-position'` (`:469`, `:623`, `:817`, `:839`). Anclarlas por contenido
  con `grep -cF "id: 'last-position'"`, que hoy da 4 en ese fichero y 1 en `pet-map.test.tsx`.
- **Las 5 se rompen** en cuanto el objeto gane `icon`, `anchor` o `showCallout`. El array
  se compara por igualdad incluso dentro de `objectContaining`. La spec debe declararlas
  como enmienda.
- `geofence-editor/index.test.tsx:31` dobla `expo-maps`, pero el marcador es `null`.
  `alert-detail` (`index.test.tsx:60`, `app/__tests__/alert-detail.navigation.test.tsx:57`)
  sustituye `PetMap` por `pet-map-double`.
- Hoy ningún fichero de `src/` usa `useImage` ni `jest.mock('expo-image')`. jest-expo
  auto-dobla el módulo nativo `ExpoImage` (`node_modules/jest-expo/src/preset/moduleMocks/expoModules.js:332`,
  `:1126`), pero no está verificado qué devuelve su `loadAsync`. La spec debe **doblar
  `useImage` explícitamente** en `map/index.test.tsx`. Si no, el árbol de Mapa entero corre
  sobre un doble implícito.
- Candados no tautológicos posibles (memoria «Candados tautológicos»: no comparar contra
  constantes importadas de producción):
  1. `PetMap` recibe la ref (prop nueva, nombre a fijar en la spec). Se pasa un centinela
     `{}` y se aserta `markers[0].icon` **`toBe`** ese centinela (identidad, no igualdad).
     Ojo con `toBe` entre nodos en paralelo (memoria «toBe entre nodos tumba el worker»): el
     centinela debe ser un objeto plano, no una instancia del árbol.
  2. `anchor` y `showCallout: false` se asertan con **literales** (`{ x: 0.5, y: 0.5 }` o lo
     que diga G1), no con la constante exportada.
  3. Pantalla Mapa, la cadena completa:
     - `toDataURL` doblado (spy sobre el prototipo de `Svg` que llama al callback con
       `'AAA'`);
     - `useImage` doblado y llamado con `'data:image/png;base64,AAA'`;
     - `markers[0].icon` es el centinela que devuelve el doble de `useImage`.
     El centinela atraviesa tres fronteras, así que no puede pasar por accidente.
  4. Fuente de la foto: la lista con foto y el detalle con `null` (o al revés), reusando el
     patrón de `:1716-1731`. Se aserta que la composición oculta contiene el `Image` con el
     `href` de la **lista**.
  5. **Un candado por rama** (memoria «Cláusulas universales»):
     - con foto;
     - sin foto (blobatar o inicial según G1: comparar contra `blobatar('Luna')` de la
       librería o contra el literal `'L'`);
     - fallo o timeout de carga (el marcador vuelve a la forma que decida G1);
     - mientras carga.
  6. Colores del anillo y del fondo vía `useThemeColors`. El doble `color:<token>` permite
     asertar el **token** literal y deja ciega la sustitución por un hex.

### P6. Límite con #192 (`mobile-map-marker-ping`, pending P3, sin spec)
- #192 pide el halo animado (`withRepeat`) y es dueño de `theme/motion.ts`. Comparte
  `pet-map.tsx` y `map/index.tsx` con #230.
- Su opción 3 («icono estático con halo») pintaría el halo **dentro del mismo bitmap** que
  compone #230.
- Propuesta de límite para la spec:
  - #230 entrega el bitmap del avatar **sin halo y sin animación**, y deja el `id`
    `'last-position'` y el ancla como contrato.
  - #192 decide después si el halo va en el bitmap (y entonces amplía la composición de
    #230), en círculos de `expo-maps` o en un overlay.
  - #230 no toca `theme/motion.ts`.
- Orden: #230 antes de #192.

---

## Opciones (de menor a mayor coste y riesgo)

| | Opción | Dependencia nueva / dev build | Cumple «quiero avatar» | Riesgo principal |
|---|---|---|---|---|
| A | `useImage({ uri: selectedPet.photoUrl, cacheKey: selectedPet.id }, { maxWidth, maxHeight })` directo al `icon` | No / No | A medias: foto rectangular, sin círculo ni borde. Sin foto no hay respaldo (pin rojo) | Estética: un rectángulo de proporción arbitraria |
| B1 | Snapshot SVG solo del respaldo (blobatar o inicial en círculo con borde) vía `toDataURL`, y para la foto la opción A | No / No | Parcial | Dos looks distintos según haya foto |
| **B2** | **Snapshot SVG completo**: `<Svg>` oculto con clip circular + foto (`<Image>` RNSVG) o respaldo + anillo; `toDataURL` → `data:image/png` → `useImage` → `icon`, con ancla centrada | No / No | **Sí** | Spike: Fresco a resolución completa (memoria), timing `onLoad`→`toDataURL`, sin evento de error (timeout) |
| C | Overlay RN encima del mapa, reutilizando `PetAvatar` tal cual | No / No | Sí en reposo | Sin API de proyección: desfase al hacer pan, rotar o inclinar. Solo vale bloqueando gestos (cambio de producto) |
| D | Miniatura circular o cuadrada generada en backend (en la subida o bajo demanda) | No / No en móvil; sí en backend (sharp o Lambda) | Sí | Feature de backend aparte; coste AWS (gate) |
| E | Dependencia nativa nueva (`react-native-view-shot` para capturar `PetAvatar`, Skia o `expo-image-manipulator`) | **Sí / Sí** (gate humano) | Sí | Autorización + rebuild; B2 lo cubre sin eso |
| F | Pin de marca estático (asset) | No / No | **No**: contradice la decisión literal | — |

## Riesgos / ambigüedades
- **Respaldo sin foto**: la carta (§2) dice blobatar; el artboard de Mapa y la premisa del
  leader dicen inicial sobre slot. Decide G1. Si gana la inicial, la carta necesita enmienda
  (G4, no delegado).
- **Primer frame**: `useImage` devuelve `null` mientras carga, y el marcador saldría con el
  pin rojo de Google. Hay que fijar qué se ve mientras carga y tras un fallo: pin por
  defecto, el respaldo ya compuesto, o nada. No se recomienda «nada»: se perdería la
  posición si la composición falla.
- **Memoria y red de Fresco** con fotos de varios MB sin redimensionar. Hay que medirlo en el
  spike. Mitigación a futuro (fuera de alcance): `allowsEditing` / `aspect` al elegir la foto,
  o la opción D.
- **Ref liberada**: el cleanup de `useImage` hace `release()` de la ref anterior mientras
  se carga la nueva. El marcador ya convirtió la ref en bitmap en `remember`, así que el
  riesgo es bajo, pero no está verificado.
- **Fuente de la foto**: debe ser la de la lista, como la píldora (#201 R2). Con la del
  detalle, la URL cambia cada 15 s y el icono se recompone cada 15 s.
- **Sombra** (`shadows.marker`): no se puede aplicar a un bitmap. Hace falta excepción con
  nombre o renunciar a ella (guarda de §5).
- **`showCallout`** vale `true` por defecto en Kotlin. Al tocar el marcador sin `title` no se
  ve nada, pero conviene fijar `false` por escrito.
- **Pantallas afectadas**: ¿lleva también avatar el marcador de `alert-detail`? Allí no hay
  foto en el ámbito. Podría leerse de la caché `petKeys.list()` por `alert.petId`.
- **Modo perdido** (`setLostMode`, `map/index.tsx:16`, `:164-170`): ¿cambia el marcador
  (anillo de color de peligro)?
- **Colisión con #192** en `pet-map.tsx` y `map/index.tsx` (memoria «Choque de API entre
  specs paralelas»). Un solo dueño a la vez.
- **iOS**: `annotations` y no `markers`; diferido a #60.

## Recomendación
- **B2**, con un **spike JS en el dev build actual antes de firmar la spec**. Lo corre el
  humano en su PC, sin rebuild.
- El spike debe confirmar cinco cosas:
  1. que `toDataURL` tras `onLoad` del `<Image>` de RNSVG captura la foto recortada en
     círculo;
  2. el tamaño en px correcto (S dp × `PixelRatio`);
  3. que `data:image/png;base64` vía `useImage` llega como `icon`;
  4. el consumo de memoria con una foto real de la app;
  5. qué pasa con una URL caducada o un 403 (timeout de respaldo).
- Si el spike falla:
  - B1 + A como mínimo viable (sin dependencia nueva);
  - E (`react-native-view-shot`) como siguiente escalón, con autorización y rebuild;
  - D si el humano prefiere resolverlo en origen.
- Forma sugerida, sin implementar:
  - `PetMap` sigue siendo tonto y recibe la ref del icono y nada más (ancla y `showCallout`
    fijos dentro).
  - La pantalla Mapa compone el icono a partir de `selectedPet` (lista), con un componente
    nuevo y oculto de composición junto a `pet-avatar.tsx`.
  - Sin animación ni halo (límite con #192).
- El artboard de G1 debe dibujar:
  1. el marcador con foto;
  2. el marcador sin foto (blobatar o inicial sobre slot: elegir uno);
  3. el estado mientras carga y tras un fallo;
  4. el diámetro en dp (el canvas usa 44);
  5. el grosor y color del borde en claro y en oscuro (el canvas usa blanco 3 px);
  6. si hay sombra;
  7. el ancla: centro, o punta si se elige forma de pin;
  8. si el modo perdido cambia el marcador;
  9. si `alert-detail` comparte el marcador.
  El halo `ping` puede seguir dibujado, pero etiquetado como #192.

## Decisiones abiertas
- **Humano (G1, no delegado)**: los nueve puntos del artboard de arriba, más el copy (no se
  prevé copy nuevo; confirmar).
- **Humano**: si el spike de B2 no basta, ¿autoriza una dependencia nativa nueva y un dev
  build (E), o prefiere el backend (D)?
- **Humano (G4)**: enmienda de `docs/ui-guidelines.md` §2 si el respaldo pasa a ser la
  inicial, y la excepción de §5 si el PNG lleva sombra pintada.
- **Leader**: el orden #230 → #192 y el reparto de ficheros; si el spike va antes de la firma
  o la spec lleva ramas alternativas; y nombres de símbolos exactos para la spec (prop de
  `PetMap`, componente de composición, constantes de tamaño y ancla).
