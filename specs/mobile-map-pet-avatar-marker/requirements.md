---
feature: "mobile-map-pet-avatar-marker"
status: spec_ready   # draft | spec_ready | approved
tags: [harness, spec, mobile, ui]
---

# Requisitos — [[mobile-map-pet-avatar-marker]] (#230)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden
> test-primero y [[../../docs/ui-guidelines|ui-guidelines]], que manda sobre
> cualquier skill.

## Contexto

- Petición literal del humano (plan `progress/plan_mejoras-smoke-2026-11-03.md`,
  fila «Mapa: ubicación de la mascota»): «Pin genérico: quiero avatar».
- Diseño: G1 aprobado el 2026-11-03 sobre el canvas v167
  (`https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j`), artboards
  `project/MapaAvatarFoto.dc.html` (círculo de 44 px, borde blanco de 3 px,
  foto con `object-fit: cover`, sin sombra ni halo, centrado en la posición) y
  `project/MapaAvatarSinFoto.dc.html` (mismo círculo y borde, fondo blanco y el
  blobatar de 38×38 centrado). Sustituyen el dibujo antiguo de
  `specs/mobile-canvas-map/canvas/Mapa.dc.html` (inicial con sombra y ping de
  #192).
- Técnica: opción B2 de `progress/explore_mobile-map-pet-avatar-marker.md`,
  validada por el spike del humano en el dev build actual, sin rebuild (commit
  `7ae4c00e` de la rama `spike/230-avatar-marker`, que no se mergea): un `<Svg>`
  de react-native-svg oculto compone el avatar, `toDataURL` lo rasteriza a PNG
  base64, `useImage` de expo-image lo convierte en `ImageRef` y ese `ImageRef`
  es el `icon` del marcador de `GoogleMaps.View`.
- Estados (decisión del leader, plan §230): pin por defecto de Google hasta la
  primera composición; blobatar sobre disco blanco mientras carga la foto, si
  falla o si vence el plazo; la foto en cuanto su composición está lista.

Todas las rutas de los requisitos son relativas a `mobile-pet-tracker/src/`.
Fichero nuevo de producción: `screens/map/pet-marker-icon.tsx` (regla de la
carta «Promoción: inline → `src/screens/<x>/` → `src/components/`»: solo lo usa
el Mapa). Tipo de mascota: `Pick<PetProfile, 'id' | 'name' | 'photoUrl'>` de
`api/types.ts`. Tipo del icono: `ImageRef` de `expo-image`.

## Requisitos funcionales

- **R1** (sin copy nuevo, compositor fuera de accesibilidad): THE SYSTEM SHALL
  añadir **cero** cadenas de copy (ninguna clave nueva en `i18n/`, ningún
  `useTranslate`, `t(` ni `<Text` en `screens/map/pet-marker-icon.tsx`), y
  WHEN `PetMarkerIcon` se monta THE SYSTEM SHALL envolver la composición en un
  único `View` con `testID="map-marker-icon"`, `pointerEvents="none"`,
  `accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`
  y `style={{ position: 'absolute', top: 0, right: 0, opacity: 0.01 }}`.
  Tests: `screens/map/pet-marker-icon.test.tsx` ::
  «#230 R1: el compositor es invisible, no recibe toques y está oculto a la
  accesibilidad» y `__tests__/map-canvas-fidelity.test.ts` ::
  «#230 R1: el compositor no trae copy».

- **R2** (icono en `PetMap`): `PetMapProps` SHALL ganar
  `markerIcon?: ImageRef | null`. WHEN `marker` no es null y `markerIcon` es
  un `ImageRef` THE SYSTEM SHALL pasar a `GoogleMaps.View`
  `markers: [{ id: 'last-position', coordinates: marker, icon: markerIcon, anchor: { x: 0.5, y: 0.5 }, showCallout: false }]`.
  WHEN `markerIcon` es null o no se pasa THE SYSTEM SHALL pasar exactamente
  `[{ id: 'last-position', coordinates: marker }]` (sin claves `icon`, `anchor`
  ni `showCallout`). WHEN `marker` es null THE SYSTEM SHALL pasar `[]` aunque
  haya `markerIcon`.
  Tests: `components/__tests__/pet-map.test.tsx` ::
  «#230 R2: con icono el marcador lleva icon, anchor centrado y sin callout»,
  «#230 R2: sin icono el marcador conserva su forma exacta» y
  «#230 R2: sin posición no hay marcador aunque haya icono».

- **R3** (dibujo sin foto): WHEN `PetMarkerIcon` se monta THE SYSTEM SHALL
  renderizar dentro de `map-marker-icon` un `Svg` con
  `testID="map-marker-fallback-svg"`, `width={44}`, `height={44}` y
  `viewBox="0 0 44 44"` que contiene, en este orden:
  `Defs > ClipPath` con `testID` e `id` `"map-marker-fallback-clip"` y un
  `Circle` `cx={22} cy={22} r={22}`; un `Circle` `testID="map-marker-fallback-disc"`
  `cx={22} cy={22} r={22}` con `fill` = color del token `accent-foreground`;
  un `G` `testID="map-marker-blob-clip"` con
  `clipPath="url(#map-marker-fallback-clip)"` que envuelve un `G`
  `testID="map-marker-blob"` con `transform="translate(3 3) scale(0.38)"` cuyos
  hijos son `parse(blobatar(pet.name))?.children`; y un `Circle`
  `testID="map-marker-fallback-ring"` `cx={22} cy={22} r={20.5}` con `stroke` =
  color de `accent-foreground`, `strokeWidth={3}` y `fill="none"`. El color sale
  de `useThemeColors(['accent-foreground'])`; ningún literal de color.
  Test: `screens/map/pet-marker-icon.test.tsx` ::
  «#230 R3: sin foto dibuja el blobatar de 38 sobre disco blanco con borde de 3».

- **R4** (captura sin foto): WHEN `PetMarkerIcon` se monta THE SYSTEM SHALL
  esperar **dos** `requestAnimationFrame` encadenados y entonces llamar a
  `toDataURL` del `Svg` `map-marker-fallback-svg` con
  `{ width: Math.round(44 * PixelRatio.get()), height: Math.round(44 * PixelRatio.get()) }`
  (154 × 154 con `PixelRatio.get()` = 3.5); WHEN el callback devuelve
  `<b64>` THE SYSTEM SHALL llamar a `useImage({ uri: 'data:image/png;base64,<b64>' })`
  y, cuando ese hook devuelve un `ImageRef`, llamar una vez a
  `onIcon({ key: markerCompositionKey(pet), icon })`. IF el compositor se
  desmonta antes del segundo frame THEN THE SYSTEM SHALL no llamar a `toDataURL`.
  Tests: `screens/map/pet-marker-icon.test.tsx` ::
  «#230 R4: captura el blobatar a 154 px tras dos frames y publica su icono» y
  «#230 R4: desmontado antes del segundo frame no captura».

- **R5** (dibujo con foto): WHEN `pet.photoUrl` es una cadena no vacía THE
  SYSTEM SHALL renderizar, además de R3, un `Svg` `testID="map-marker-photo-svg"`
  de 44 × 44 y `viewBox="0 0 44 44"` con: `Defs > ClipPath` con `testID` e `id`
  `"map-marker-photo-clip"` y un `Circle` `cx={22} cy={22} r={22}`; un `Image`
  de react-native-svg con `testID="map-marker-photo"`,
  `href={{ uri: pet.photoUrl }}` (la URL completa, con su firma), `x={0} y={0}
  width={44} height={44}`, `preserveAspectRatio="xMidYMid slice"` y
  `clipPath="url(#map-marker-photo-clip)"`; y un `Circle`
  `testID="map-marker-photo-ring"` con la misma geometría y color que
  `map-marker-fallback-ring`. WHEN `pet.photoUrl` es `null` o `''` THE SYSTEM
  SHALL no renderizar `map-marker-photo-svg`.
  Tests: `screens/map/pet-marker-icon.test.tsx` ::
  «#230 R5: con foto dibuja la foto recortada en círculo con borde de 3» y
  «#230 R5: con photoUrl null o vacía no hay Svg de foto».

- **R6** (captura con foto, la foto gana): WHEN `map-marker-photo` emite
  `onLoad` THE SYSTEM SHALL esperar dos `requestAnimationFrame`, llamar a
  `toDataURL` de `map-marker-photo-svg` con las mismas dimensiones que R4 y,
  con el `<b64>` devuelto, pasar a `useImage` `{ uri: 'data:image/png;base64,<b64>' }`
  y publicar `onIcon({ key, icon })` con el `ImageRef` de la foto. WHILE haya
  una captura de foto lista THE SYSTEM SHALL ignorar la captura del blobatar
  aunque llegue después: el último `useImage` y el último `onIcon` son los de
  la foto.
  Tests: `screens/map/pet-marker-icon.test.tsx` ::
  «#230 R6: al cargar la foto la captura y sustituye al blobatar» y
  «#230 R6: una captura del blobatar que llega tarde no pisa la foto».

- **R7** (plazo de la foto): IF `map-marker-photo` no emite `onLoad` en los
  **4000 ms** siguientes al montaje THEN THE SYSTEM SHALL desmontar
  `map-marker-photo-svg` y no capturar la foto; `map-marker-fallback-svg` y su
  icono siguen. WHEN `onLoad` llega antes del plazo THE SYSTEM SHALL cancelar el
  plazo (el `Svg` de foto sigue montado después de 4000 ms). WHEN el compositor
  se desmonta THE SYSTEM SHALL cancelar el plazo y los frames pendientes.
  Tests: `screens/map/pet-marker-icon.test.tsx` ::
  «#230 R7: sin onLoad en 4000 ms la foto se desmonta y queda el blobatar» y
  «#230 R7: un onLoad antes del plazo lo cancela».

- **R8** (clave de composición): `markerCompositionKey(pet)` SHALL devolver
  `JSON.stringify([pet.id, pet.name, pet.photoUrl ? pet.photoUrl.split('?')[0] : ''])`.
  Dos URLs firmadas del mismo objeto (misma ruta, distinta query) dan la misma
  clave; otra ruta, otro nombre u otro id dan otra. WHILE `PetMarkerIcon` siga
  montado THE SYSTEM SHALL usar la mascota de su montaje: un rerender con una
  URL re-firmada o con otra posición no cambia `href` ni provoca otra llamada a
  `toDataURL`.
  Tests: `screens/map/pet-marker-icon.test.tsx` ::
  «#230 R8: la clave ignora la firma y distingue id, nombre y ruta» y
  «#230 R8: un rerender con la URL re-firmada no recompone».

- **R9** (icono vigente): `currentMarkerIcon(state, pet)` SHALL devolver
  `state.icon` solo cuando `state` no es null, `pet` no es `undefined` y
  `state.key === markerCompositionKey(pet)`; en otro caso `null`. Así el mapa
  nunca muestra el icono de otra mascota ni uno liberado por una composición
  desmontada.
  Test: `screens/map/pet-marker-icon.test.tsx` ::
  «#230 R9: solo devuelve el icono de la composición vigente».

- **R10** (integración en el Mapa): `screens/map/index.tsx` SHALL guardar
  `const [markerIcon, setMarkerIcon] = useState<MarkerIconState>(null);`, pasar
  `markerIcon={currentMarkerIcon(markerIcon, selectedPet)}` al `<PetMap>` y,
  dentro de la rama `petsReady && last.data?.kind === 'ok'`, montar
  `<PetMarkerIcon key={markerCompositionKey(selectedPet)} pet={selectedPet} onIcon={setMarkerIcon} />`
  solo WHEN `selectedPet` existe y `marker` no es null. WHEN la posición es
  `null` THE SYSTEM SHALL no montar `map-marker-icon`.
  Tests: `screens/map/index.test.tsx` ::
  «#230 R10: con posición monta el compositor oculto»,
  «#230 R10: sin posición no monta el compositor» y
  «#230 R10: el marcador recibe el icono compuesto»;
  `__tests__/map-canvas-fidelity.test.ts` ::
  «#230 R10: el mapa monta el compositor con la clave de composición».

- **R11** (guardas de deriva del fichero nuevo):
  `screens/map/pet-marker-icon.tsx` SHALL pasar las seis guardas del objeto
  `guards` de `__tests__/map-canvas-fidelity.test.ts` (hex y clase arbitraria,
  `StyleSheet.create`, emoji, imports de degradado y desenfoque, radios fuera de
  la escala, `text-accent` sin sufijo) y SHALL importar solo de `react`,
  `react-native`, `react-native-svg`, `expo-image`, `blobatar`,
  `../../api/types` y `../../theme/use-theme-colors`. Todo comentario que cite
  la feature escribe `#230 R<n>`, nunca `#230` suelto (la guarda de hex lo
  tomaría por color).
  Tests: `__tests__/map-canvas-fidelity.test.ts` ::
  «#230 R11: screens/map/pet-marker-icon.tsx respeta la guarda %s» (seis filas
  de un `it.each`) y «#230 R11: el compositor importa solo lo suyo».

## Base medida

Desde `mobile-pet-tracker/src/` sobre la base de la rama (`46f41a8f`, que
incluye `origin/dev`). «Después» es lo que debe medir el reviewer.

| Id | Comando | Antes | Después |
|---|---|---|---|
| B1 | `grep -cF "id: 'last-position'" components/pet-map.tsx` | 1 | 1 |
| B2 | `grep -cF 'markerIcon' components/pet-map.tsx` | 0 | 3 |
| B3 | `test -e screens/map/pet-marker-icon.tsx && echo sí \|\| echo no` | no | sí |
| B4 | `test -e screens/map/pet-marker-icon.test.tsx && echo sí \|\| echo no` | no | sí |
| B5 | `grep -cF '<PetMarkerIcon' screens/map/index.tsx` | 0 | 1 |
| B6 | `grep -cF 'markerIcon={currentMarkerIcon(markerIcon, selectedPet)}' screens/map/index.tsx` | 0 | 1 |
| B7 | `grep -cE '"(react-native-view-shot\|expo-linear-gradient)"' ../package.json` | 0 | 0 |
| B8 | `git diff --quiet 46f41a8f -- i18n ../package.json ../bun.lock; echo $?` | 0 | 0 |
| B9 | `grep -cP '#230(?! R\d)' screens/map/pet-marker-icon.tsx screens/map/index.tsx components/pet-map.tsx` | 0 por fichero | 0 por fichero |

## Inventario de candados en `src/__tests__`

Verificado contra las expresiones de los tests que recorren `src/` o listan
`screens/map/index.tsx` y `components/pet-map.tsx`:
`consistency-classnames.test.ts` (#62 R14 y R15, #166 R2, `CONTINUOUS_CORNER`,
`TABULAR_NUMS`), `design-drift.test.ts` (`DEFAULT_CENTER`, `19.4326`,
radios, `text-17`, `text-22`), `chunky-cta-canvas-fidelity.test.ts`
(`chunkyLip`), `alerts-canvas-fidelity.test.ts`, `alert-detail-canvas-fidelity.test.ts`,
`canvas-foundations.test.ts`, `orbit-rename-copy.test.ts` y
`jest-virtual-mock-lock.test.ts` (ningún `virtual:` nuevo). Ninguno cuenta lo
que añaden R2, R10 ni el fichero nuevo, porque el fichero nuevo no usa
`className` y solo usa `style` en línea.

| Fichero | Tests existentes que cambian | Tests nuevos |
|---|---|---|
| `__tests__/map-canvas-fidelity.test.ts` | 0 | R1: 1 + R10: 1 + R11: 6 filas + 1 = **+9** |
| resto de `src/__tests__/*.test.ts` | 0 | 0 |

Si una guarda de las que recorren `src/` sale roja por el fichero nuevo, es un
defecto de esta spec: se para y se enmienda, no se toca la guarda.

## Supuestos de entorno

- **Dev build actual, sin rebuild.** react-native-svg, expo-image y expo-maps ya
  están en el binario; el spike corrió en él. Ninguna dependencia nueva
  (`react-native-view-shot` y `expo-linear-gradient` vetadas).
- **Android probado, iOS no.** El spike se midió en Android (pixelRatio 3.5,
  icono de 154 px, +35 MB de PSS en la pantalla Mapa). iOS lo cubre G2.
- **El `Image` de react-native-svg no avisa de errores a JS.** Emite `onLoad`
  pero no un evento de error; una foto rota (404 de LocalStack, firma caducada)
  solo deja «fetchDecodedImage failed!» en logcat. Por eso el plazo de R7 es
  el único camino al blobatar en caso de fallo.
- **`opacity: 0.01` sí se rasteriza** (el spike lo midió como «Visible: no»);
  `opacity: 0` o fuera de pantalla no está probado y no se usa.
- **La foto de la pastilla puede no coincidir con la del marcador.**
  `PetAvatar` usa `cacheKey` y puede seguir pintando una foto ya borrada del
  bucket; el marcador la vuelve a descargar. No es de esta feature.
- En jest no existe `RNSVGSvgViewModule` real: los tests nunca llaman al
  `toDataURL` de verdad (ver los dobles en [[tasks]]).

## Fuera de alcance

- El halo y el ping de #192 (`theme/motion.ts`, «Mapa en vivo»): el marcador es
  estático; el límite de #192 sigue vigente.
- La frecuencia de sondeo de la última posición (15 s): «#230 cambia el
  marcador, no la frecuencia» (plan §7).
- Los marcadores de detalle de alerta y del editor de geocercas.
- Cualquier cambio del marcador en modo perdido.
- `annotations` de iOS (deuda de #60): se usa `markers` en ambas plataformas.
- La foto obsoleta por `cacheKey` en la pastilla de la mascota.
- Redimensionar las fotos al subirlas.
- Liberar la memoria del `Svg` de foto tras capturarlo y la del `ImageRef` que
  `useImage` no libera.
- Sombra o elevación del marcador (los artboards de v167 no la dibujan).

## Aprobación

> Firma delegada: el mandato del 2026-10-23 (`CLAUDE.md` §Mandato), extendido al
> plan `progress/plan_mejoras-smoke-2026-11-03.md`, permite al leader firmar
> esta spec con su propio commit tras la checklist de
> `progress/plan_canvas-parity-2026-10-23.md` §4 y la del §4 del plan nuevo.
> G1 (artboards, v167) ya está aprobado en ese plan. G2 no se delega.
> No hace falta enmienda de la carta (G4): el color es el token
> `accent-foreground`, no hay sombra y el blobatar es el fallback de la carta.

- [ ] Aprobado (firma delegada del leader o humano, fecha: ____) ← gate obligatorio antes de implementar
- [ ] G2 Android — prueba de humo en el dev build del PC del humano: marcador con foto, sin foto y con foto rota (blobatar tras ≤ 4 s), en `progress/smoke_mejoras-smoke.md` (fecha: ____)
- [ ] G2 iOS — la misma prueba de humo en iOS (fecha: ____)
