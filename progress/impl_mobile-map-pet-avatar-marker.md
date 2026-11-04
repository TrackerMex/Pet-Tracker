# Implementación #230 — mobile-map-pet-avatar-marker

## Parada 1
El test de desmontaje de R4 nacía verde aunque tasks.md exigía rojo.
La primera sesión paró antes de implementar y dejó el diagnóstico.
Resuelto por el leader en `94863d5a`; esta sesión reanuda desde cero.

## Resultado

R1–R11 implementados y verificados: 83 suites, 2003 tests y 1 snapshot en verde; TypeScript exit 0 y lint LINT_OK con logs vacíos. Las 13 mutaciones fueron detectadas y revertidas. G2 Android/iOS queda para el humano y ./init.sh para el leader.

## Base y alcance
Fecha: 2026-11-03 UTC. H0: `94863d5a`.
Primer comando: `cd /home/claude/sites/Pet-Tracker-wt-230 && pwd && git branch --show-current && git log --oneline -5`.

```text
/home/claude/sites/Pet-Tracker-wt-230
feature/230-mobile-map-pet-avatar-marker
94863d5a docs(spec): #230 R4 unmount test is born green
764acfe8 docs(progress): #230 codex handoff
ce5f89af chore(spec): firma delegada #230 (mandato del humano 2026-10-23, ampliado 2026-11-03)
c3004d51 Merge remote-tracking branch 'origin/dev' into feature/230-mobile-map-pet-avatar-marker
020983dd docs(spec): #230 leader audit fixes before signing
```

Anclas de partida re-medidas con los comandos del handoff: B1=1 (esperado 1), B2=0 (0), B3=no (no), B5=0 (0), B9=0 en index.tsx y pet-map.tsx (0 y 0).
Skills cargadas: ponytail:ponytail, building-native-ui (plugin Expo en caché local) y .agents/skills/appllama-app-design-skill. Carta, arquitectura y convenciones del proyecto tienen prioridad. Spec completa leída, firma delegada presente; G2 no se modifica.
Sin ./init.sh, fetch, merge, rebase, push, bun install ni operaciones de PR. Sin delegación.

## Historial rojo / verde y mutaciones

Las pilas se recortan al primer marco del proyecto; se conservan las aserciones y los recibidos.

Base Jest: map-canvas-fidelity.test.ts = 81/81, exit 0. R2 rojo inicial: 1 rojo, 20 verdes, exit 1; el it con icono recibió solo id y coordinates (faltan icon, anchor y showCallout), toStrictEqual en pet-map.test.tsx:114. Los otros dos it nacen verdes.

Mutación R2a: añadir siempre icon: props.markerIcon al marcador.

### Mutación R2a

Comando: bunx jest src/components/__tests__/pet-map.test.tsx --runInBand --json.

Mutación R2a: 1; 19 verdes, 2 rojos; suites con error 0

#230 R2: con icono el marcador lleva icon, anchor centrado y sin callout
Error: expect(received).toStrictEqual(expected) // deep equality

- Expected  - 5
+ Received  + 0

  Array [
    Object {
-     "anchor": Object {
-       "x": 0.5,
-       "y": 0.5,
-     },
      "coordinates": Object {
        "latitude": 19.45,
        "longitude": -99.12,
      },
      "icon": Object {
        "sentinel": "marker-icon",
      },
      "id": "last-position",
-     "showCallout": false,
    },
  ]
    at Object.toStrictEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx:114:58)

#230 R2: sin icono el marcador conserva su forma exacta
Error: expect(received).toStrictEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

@@ -2,8 +2,9 @@
    Object {
      "coordinates": Object {
        "latitude": 19.4326,
        "longitude": -99.1332,
      },
+     "icon": null,
      "id": "last-position",
    },
  ]
    at Object.toStrictEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx:121:58)

R2a revertida con git checkout HEAD -- mobile-pet-tracker/src/components/pet-map.tsx; git diff --quiet -- esa ruta = 0. Mutación R2b: cambiar condición a props.marker || props.markerIcon.

### Mutación R2b

Comando: bunx jest src/components/__tests__/pet-map.test.tsx --runInBand --json.

Mutación R2b: 1; 19 verdes, 2 rojos; suites con error 0

#230 R2: con icono el marcador lleva icon, anchor centrado y sin callout
Error: expect(received).toStrictEqual(expected) // deep equality

- Expected  - 8
+ Received  + 0

  Array [
    Object {
-     "anchor": Object {
-       "x": 0.5,
-       "y": 0.5,
-     },
      "coordinates": Object {
        "latitude": 19.45,
        "longitude": -99.12,
-     },
-     "icon": Object {
-       "sentinel": "marker-icon",
      },
      "id": "last-position",
-     "showCallout": false,
    },
  ]
    at Object.toStrictEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx:114:58)

#230 R2: sin posición no hay marcador aunque haya icono
Error: expect(received).toStrictEqual(expected) // deep equality

- Expected  - 1
+ Received  + 6

- Array []
+ Array [
+   Object {
+     "coordinates": null,
+     "id": "last-position",
+   },
+ ]
    at Object.toStrictEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx:129:58)

R2b revertida con git checkout HEAD -- mobile-pet-tracker/src/components/pet-map.tsx; git diff --quiet -- esa ruta = 0. Commit rojo: 8b8fd3f2 — test(mobile): pet map marker takes an optional icon (R2). Ambas mutaciones fallaron además en el primer it porque la implementación del icono aún no existía.

### Verde R2

Comando: bunx jest src/components/__tests__/pet-map.test.tsx --runInBand --json.

Verde R2: 0; 21 verdes, 0 rojos; suites con error 0

Commit verde R2: 79d569c3 — feat(mobile): pet map marker takes an optional icon (R2). B1=1 y B2=3.

### Rojo R1

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx src/__tests__/map-canvas-fidelity.test.ts --runInBand --json.

Rojo R1: 1; 81 verdes, 1 rojos; suites con error 1

#230 R1: el compositor no trae copy
Error: ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx'
    at readProduction (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/__tests__/map-canvas-fidelity.test.ts:28:15)

  ● Test suite failed to run

    Cannot find module './pet-marker-icon' from 'src/screens/map/pet-marker-icon.test.tsx'

    However, Jest was able to find:
      './pet-marker-icon.test.tsx'

    You might want to include a file extension in your import, or update your 'moduleFileExtensions', which is currently ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'].

    See https://jestjs.io/docs/configuration#modulefileextensions-arraystring

      3 | import { PixelRatio } from 'react-native';
      4 |
    > 5 | import { PetMarkerIcon } from './pet-marker-icon';
        | ^
      6 |
      7 | const mockToDataURL = jest.fn();
      8 | const mockUseImage = jest.fn();

      at Object.require (src/screens/map/pet-marker-icon.test.tsx:5:1)


### Verde R1

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx src/__tests__/map-canvas-fidelity.test.ts --runInBand --json.

Verde R1: 0; 83 verdes, 0 rojos; suites con error 0

Commit: 5c9f66a6 — feat(mobile): hidden marker composer without copy (R1)

### Rojo R3

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Rojo R3: exit 1; 1 verdes, 1 rojos; 0 errores de suite.

#230 R3: sin foto dibuja el blobatar de 38 sobre disco blanco con borde de 3

Error: Unable to find an element with testID: map-marker-fallback-svg

<View
  accessibilityElementsHidden={true}
  importantForAccessibility="no-hide-descendants"
  pointerEvents="none"
  testID="map-marker-icon"
/>
    at Object.getByTestId (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:67:22)

Commit: 31218cfb — test(mobile): marker composer draws the blobatar fallback (R3)

Verde R3, primer intento: no produjo JSON válido; la salida recorría metadatos internos de React. No se contabiliza como verde ni se creó un commit de producción.

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

Ajuste del test R3: la igualdad bruta de elementos React recorría _owner (el diagnóstico dio _owner === null: false). Se compara tipo, key y todas las props mediante un equality tester recursivo, manteniendo el toEqual contra parse(blobatar("Luna"))?.children y los dobles exactos. La primera ejecución verde no produjo JSON; el reintento aislado se detuvo con SIGTERM tras crecimiento de memoria, sin contarlo como tests ejecutados. Se retira la aserción diagnóstica y se repite el rojo con producción de R1. El rojo R3 se enmienda antes de seguir; no hay rebase ni commit verde con tests.

### Rojo R3 con igualdad de elementos SVG

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Rojo R3 con igualdad de elementos SVG: exit 1; 1 verdes, 1 rojos; 0 errores de suite.

#230 R3: sin foto dibuja el blobatar de 38 sobre disco blanco con borde de 3

Error: Unable to find an element with testID: map-marker-fallback-svg

<View
  accessibilityElementsHidden={true}
  importantForAccessibility="no-hide-descendants"
  pointerEvents="none"
  testID="map-marker-icon"
/>
    at Object.getByTestId (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:80:22)

Commit rojo R3 corregido: 03726951 — test(mobile): marker composer draws the blobatar fallback (R3). Sustituye el hash local 31218cfb.

### Verde R3

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Verde R3: exit 0; 2 verdes, 0 rojos; 0 errores de suite.

Commit: efac945d — feat(mobile): marker composer draws the blobatar fallback (R3)

### Rojo R4

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Rojo R4: exit 1; 3 verdes, 1 rojos; 0 errores de suite.

#230 R4: captura el blobatar a 154 px tras dos frames y publica su icono

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 9
+ Received  + 1

- Array [
-   Array [
-     "map-marker-fallback-svg",
-     Object {
-       "height": 154,
-       "width": 154,
-     },
-   ],
- ]
+ Array []
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:108:76)

Commit: 187027ee — test(mobile): marker composer captures the fallback after two frames (R4)

### Verde R4

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Verde R4: exit 0; 4 verdes, 0 rojos; 0 errores de suite.

Commit: 1103fc6b — feat(mobile): marker composer captures the fallback after two frames (R4)

Mutación R4, después del commit verde: capturar const svg = svgRef.current antes del primer frame; usar svg?.toDataURL y retirar la comprobación cleaned del segundo frame.

### Mutación R4

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Mutación R4: exit 1; 3 verdes, 1 rojos; 0 errores de suite.

#230 R4: desmontado antes del segundo frame no captura

Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 0
Received number of calls: 1
    at Object.toHaveBeenCalledTimes (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:121:25)

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

### Rojo R5

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Rojo R5: exit 1; 5 verdes, 1 rojos; 0 errores de suite.

#230 R5: con foto dibuja la foto recortada en círculo con borde de 3

Error: Unable to find an element with testID: map-marker-photo-svg

<View
  accessibilityElementsHidden={true}
  importantForAccessibility="no-hide-descendants"
  pointerEvents="none"
  testID="map-marker-icon"
>
  <View
    testID="map-marker-fallback-svg"
  >
    <View>
      <View
        testID="map-marker-fallback-clip"
      >
        <View />
      </View>
    </View>
    <View
      testID="map-marker-fallback-disc"
    />
    <View
      testID="map-marker-blob-clip"
    >
      <View
        testID="map-marker-blob"
      >
        <RNSVGGroup>
          <RNSVGPath />
        </RNSVGGroup>
        <RNSVGGroup>
          <RNSVGPath />
          <RNSVGPath />
        </RNSVGGroup>
      </View>
    </View>
    <View
      testID="map-marker-fallback-ring"
    />
  </View>
</View>
    at Object.getByTestId (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:126:22)

Mutación R5: montar la foto con props.pet.photoUrl !== null. Se añade temporalmente la rama de foto necesaria para plantar esta condición, antes del commit rojo; se revierte entera después.

### Mutación R5

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Mutación R5: exit 1; 5 verdes, 1 rojos; 0 errores de suite.

#230 R5: con photoUrl null o vacía no hay Svg de foto

Error: expect(received).toBeNull()

Received: <View height={44} testID="map-marker-photo-svg" viewBox="0 0 44 44" width={44}><View><View id="map-marker-photo-clip" testID="map-marker-photo-clip"><View cx={22} cy={22} r={22} /></View></View><View clipPath="url(#map-marker-photo-clip)" height={44} href={{"uri": ""}} preserveAspectRatio="xMidYMid slice" testID="map-marker-photo" width={44} x={0} y={0} /><View cx={22} cy={22} fill="none" r={20.5} stroke="sentinel-accent-foreground" strokeWidth={3} testID="map-marker-photo-ring" /></View>
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:147:89)

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

Commit: 9a29d06c — test(mobile): marker composer draws the circular photo (R5)

### Verde R5

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Verde R5: exit 0; 6 verdes, 0 rojos; 0 errores de suite.

Commit: 5f90ad49 — feat(mobile): marker composer draws the circular photo (R5)

### Rojo R6

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Rojo R6: exit 1; 6 verdes, 2 rojos; 0 errores de suite.

#230 R6: al cargar la foto la captura y sustituye al blobatar

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 7
+ Received  + 0

@@ -4,13 +4,6 @@
      Object {
        "height": 154,
        "width": 154,
      },
    ],
-   Array [
-     "map-marker-photo-svg",
-     Object {
-       "height": 154,
-       "width": 154,
-     },
-   ],
  ]
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:162:76)

#230 R6: una captura del blobatar que llega tarde no pisa la foto

TypeError: Cannot read properties of undefined (reading '1')
    at /home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:179:54

Commit: 303be02f — test(mobile): marker composer captures the photo and keeps it (R6)

### Verde R6

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Verde R6: exit 0; 8 verdes, 0 rojos; 0 errores de suite.

Commit: 5d3dba06 — feat(mobile): marker composer captures the photo and keeps it (R6)

### Rojo R7

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Rojo R7: exit 1; 9 verdes, 1 rojos; 0 errores de suite.

#230 R7: sin onLoad en 4000 ms la foto se desmonta y queda el blobatar

Error: expect(received).toBeNull()

Received: <View height={44} testID="map-marker-photo-svg" viewBox="0 0 44 44" width={44}><View><View id="map-marker-photo-clip" testID="map-marker-photo-clip"><View cx={22} cy={22} r={22} /></View></View><View clipPath="url(#map-marker-photo-clip)" height={44} href={{"uri": "https://cdn.example/pets/luna.jpg?X-Amz-Signature=aaa"}} onLoad={[Function onLoad]} preserveAspectRatio="xMidYMid slice" testID="map-marker-photo" width={44} x={0} y={0} /><View cx={22} cy={22} fill="none" r={20.5} stroke="sentinel-accent-foreground" strokeWidth={3} testID="map-marker-photo-ring" /></View>
    at Object.toBeNull (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:195:91)

Mutación R7: no cancelar el plazo en onLoad. Se planta el plazo temporalmente sin cancelación para demostrar el it que nace verde, antes del commit rojo, y se revierte.

### Mutación R7

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Mutación R7: exit 1; 9 verdes, 1 rojos; 0 errores de suite.

#230 R7: un onLoad antes del plazo lo cancela

Error: Unable to find an element with testID: map-marker-photo-svg

<View
  accessibilityElementsHidden={true}
  importantForAccessibility="no-hide-descendants"
  pointerEvents="none"
  testID="map-marker-icon"
>
  <View
    testID="map-marker-fallback-svg"
  >
    <View>
      <View
        testID="map-marker-fallback-clip"
      >
        <View />
      </View>
    </View>
    <View
      testID="map-marker-fallback-disc"
    />
    <View
      testID="map-marker-blob-clip"
    >
      <View
        testID="map-marker-blob"
      >
        <RNSVGGroup>
          <RNSVGPath />
        </RNSVGGroup>
        <RNSVGGroup>
          <RNSVGPath />
          <RNSVGPath />
        </RNSVGGroup>
      </View>
    </View>
    <View
      testID="map-marker-fallback-ring"
    />
  </View>
</View>
    at Object.getByTestId (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:206:19)

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

Commit: 6685ed19 — test(mobile): marker photo falls back after 4000 ms (R7)

### Verde R7

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Verde R7: exit 0; 10 verdes, 0 rojos; 0 errores de suite.

Commit: 913def8e — feat(mobile): marker photo falls back after 4000 ms (R7)

### Rojo R8

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Rojo R8: exit 1; 9 verdes, 3 rojos; 0 errores de suite.

#230 R6: al cargar la foto la captura y sustituye al blobatar (enmendado por #230 R8)

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

@@ -2,9 +2,9 @@
    Array [
      Object {
        "icon": Object {
          "sentinel": "fallback-icon",
        },
-       "key": "[\"pet-1\",\"Luna\",\"https://cdn.example/pets/luna.jpg\"]",
+       "key": "[\"pet-1\",\"Luna\",\"https://cdn.example/pets/luna.jpg?X-Amz-Signature=aaa\"]",
      },
    ],
  ]
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:155:29)

#230 R8: la clave ignora la firma y distingue id, nombre y ruta

Error: expect(received).toBe(expected) // Object.is equality

Expected: "[\"pet-1\",\"Luna\",\"https://cdn.example/pets/luna.jpg\"]"
Received: "[\"pet-1\",\"Luna\",\"https://cdn.example/pets/luna.jpg?X-Amz-Signature=aaa\"]"
    at Object.toBe (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:220:78)

#230 R8: un rerender con la URL re-firmada no recompone

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
-   "uri": "https://cdn.example/pets/luna.jpg?X-Amz-Signature=aaa",
+   "uri": "https://cdn.example/pets/luna.jpg?X-Amz-Signature=bbb",
  }
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:234:94)

Commit: 64951596 — test(mobile): marker composition key ignores the url signature (R8)

### Verde R8

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Verde R8: exit 0; 12 verdes, 0 rojos; 0 errores de suite.

Commit: 28a99c74 — feat(mobile): marker composition key ignores the url signature (R8)

### Rojo R9

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Rojo R9: exit 1; 12 verdes, 1 rojos; 0 errores de suite.

#230 R9: solo devuelve el icono de la composición vigente

TypeError: (0 , _petMarkerIcon.currentMarkerIcon) is not a function
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/pet-marker-icon.test.tsx:248:76)

Commit: 56911cf3 — test(mobile): only the current composition icon reaches the map (R9)

### Verde R9

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Verde R9: exit 0; 13 verdes, 0 rojos; 0 errores de suite.

Commit: f9871bc8 — feat(mobile): only the current composition icon reaches the map (R9)

### Rojo R10

Comando: bunx jest src/screens/map/index.test.tsx src/__tests__/map-canvas-fidelity.test.ts --runInBand --json

Rojo R10: exit 1; 383 verdes, 6 rojos; 0 errores de suite.

selects the first pet and loads its first position (#72 R2)

Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "http://example.test/v1", "jwt-token", "pet-1"

Number of calls: 0
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/index.test.tsx:381:18)

no pinta el botón con el detalle walker con collar sin conectividad aunque el listado diga walker con collar

Error: Unable to find an element with testID: map-no-tracking-title

<RNCSafeAreaProvider>
  <View
    testID="screen-map"
  >
    <View
      accessibilityState={
        {
          "busy": true,
        }
      }
      testID="map-loading"
    >
      <View
        testID="map-loading-stats"
      >
        <View
          testID="map-loading-pill"
        >
          <View>
            <View />
          </View>
          <View>
            <View />
          </View>
        </View>
        <View
          testID="map-loading-card"
        >
          <View>
            <View>
              <View>
                <View>
                  <View />
                </View>
                <View>
                  <View />
                </View>
              </View>
              <View>
                <View>
                  <View />
                </View>
                <View>
                  <View />
                </View>
              </View>
            </View>
            <View>
              <View>
                <View>
                  <View />
                </View>
                <View>
                  <View />
                </View>
              </View>
              <View>
                <View>
                  <View />
                </View>
                <View>
                  <View />
                </View>
              </View>
            </View>
          </View>
          <View>
            <View />
          </View>
        </View>
      </View>
    </View>
  </View>
</RNCSafeAreaProvider>
    at findByTestId (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/index.test.tsx:2221:20)

no pinta el botón con el detalle vet con collar sin conectividad aunque el listado diga owner sin collar

Error: thrown: "Exceeded timeout of 5000 ms for a test.
Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."
    at /home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/index.test.tsx:2215:98

#230 R10: con posición monta el compositor oculto

Error: Unable to find an element with testID: map-marker-icon

<RNCSafeAreaProvider>
  <View
    testID="screen-map"
  >
    <View
      testID="map-view"
    />
    <View
      testID="map-stats"
    >
      <View
        accessibilityLabel="Luna, GPS activo"
        accessible={true}
        testID="map-pet-pill"
      >
        <RNSVGSvgView
          testID="map-pet-pill-avatar"
        >
          <RNSVGGroup>
            <RNSVGGroup>
              <RNSVGPath />
            </RNSVGGroup>
            <RNSVGGroup>
              <RNSVGPath />
              <RNSVGPath />
            </RNSVGGroup>
          </RNSVGGroup>
        </RNSVGSvgView>
        <Text
          testID="map-pet-pill-name"
        >
          Luna
        </Text>
        <View
          testID="map-pet-pill-gps"
        >
          <View
            testID="map-pet-pill-dot"
          />
          <Text
            testID="map-pet-pill-status"
          >
            GPS activo
          </Text>
        </View>
      </View>
      <View
        testID="map-stats-card"
      >
        <View>
          <View>
            <View>
              <Text>
                Velocidad
              </Text>
              <Text
                testID="stat-speed"
              >
                —
              </Text>
            </View>
            <View>
              <Text>
                Distancia
              </Text>
              <Text
                testID="stat-distance"
              >
                —
              </Text>
            </View>
          </View>
          <View>
            <View>
              <Text>
                Actualizado
              </Text>
              <Text
                testID="stat-updated"
              >
                Justo ahora
              </Text>
            </View>
            <View>
              <Text>
                Batería
              </Text>
              <Text
                testID="stat-battery"
              >
                —
              </Text>
            </View>
          </View>
        </View>
        <View
          accessibilityRole="button"
          accessibilityState={
            {
              "disabled": false,


#230 R10: el marcador recibe el icono compuesto

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 8
+ Received  + 0

  Array [
    Object {
-     "anchor": Object {
-       "x": 0.5,
-       "y": 0.5,
-     },
      "coordinates": Object {
        "latitude": 19.45,
        "longitude": -99.12,
-     },
-     "icon": Object {
-       "sentinel": "fallback-icon",
      },
      "id": "last-position",
-     "showCallout": false,
    },
  ]
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/screens/map/index.test.tsx:2817:18)

#230 R10: el mapa monta el compositor con la clave de composición

Error: expect(received).toContain(expected) // indexOf

Expected substring: "key={markerCompositionKey(selectedPet)}"
Received string:    "import { useQuery } from '@tanstack/react-query';
import { Button, Skeleton } from 'heroui-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { AlertCircle, AlertTriangle, Link, Location, Plus, Refresh } from 'reicon-react-native';
import { useUniwind } from 'uniwind';·
import { listGeofences } from '../../api/geofences';
import {
  getPet,
  listPets,
  setLostMode,
  type PetsState,
} from '../../api/pets';
import {
  getLastPosition,
  listPositions,
  type LastPositionState,
} from '../../api/positions';
import { geofenceKeys, petKeys, positionKeys, tripKeys } from '../../api/query-keys';
import { getDayRoute } from '../../api/trips';
import { Card } from '../../components/card';
import { EmptyState } from '../../components/empty-state';
import { PetAvatar } from '../../components/pet-avatar';
import {
  STATUS_TONE_CLASSES,
  type PetHeroStatusTone,
} from '../../components/pet-hero-header';
import { DEFAULT_CENTER, PetMap } from '../../components/pet-map';
import { PopIn } from '../../components/pop-in';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useChunkyLip } from '../../theme/chunky-lip';
import { MOTION_RISE_OFFSET_Y } from '../../theme/motion';
import {
  CONTINUOUS_CORNER,
  TABULAR_NUMS,
} from '../../theme/native-styles';
import { useShadows } from '../../theme/shadows';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import {
  deviceConnectionState,
  MAP_CONNECTION_LABEL_KEY,
  type DeviceConnectionState,
}

Mutación R10: integrar temporalmente el compositor con selectedPet, sin comprobar marker; se espera al map-empty-overlay visible antes de comprobar ausencia. Se revierte toda la integración temporal antes del commit rojo.

### Mutación R10

Comando: bunx jest src/screens/map/index.test.tsx --runInBand --json

Mutación R10: exit 1; 305 verdes, 1 rojos; 0 errores de suite.

#230 R10: sin posición no monta el compositor

Error: expect(received).toBeNull()

Received: <View accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants" pointerEvents="none" style={{"opacity": 0.01, "position": "absolute", "right": 0, "top": 0}} testID="map-marker-icon"><RNSVGSvgView align="xMidYMid" bbHeight={44} bbWidth={44} focusable={false} height={44} meetOrSlice={0} minX={0} minY={0} style={[{"backgroundColor": "transparent", "borderWidth": 0}, {"flex": 0, "height": 44, "width": 44}]} testID="map-marker-fallback-svg" vbHeight={44} vbWidth={44} width={44}><RNSVGGroup fill={{"payload": 4278190080, "type": 0}}><RNSVGDefs><RNSVGClipPath fill={{"payload": 4278190080, "type": 0}} name="map-marker-fallback-clip" testID="map-marker-fallback-clip"><RNSVGCircle cx={22} cy={22} fill={{"payload": 4278190080, "type": 0}} r={22} /></RNSVGClipPath></RNSVGDefs><RNSVGCircle cx={22} cy={22} fill={{"payload": 4294967295, "type": 0}} propList={["fill"]} r={22} testID="map-marker-fallback-disc" /><RNSVGGroup clipPath="map-marker-fallback-clip" fill={{"payload": 4278190080, "type": 0}} testID="map-marker-blob-clip"><RNSVGGroup fill={{"payload": 4278190080, "type": 0}} matrix={[0.38, 0, 0, 0.38, 3, 3]} testID="map-marker-blob"><RNSVGGroup fill={{"payload": 4292380622, "type": 0}} propList={["fill"]}><RNSVGPath d="M80.97 50.23C81.06 60.98 74.73 78.08 66.76 82.99C58.79 87.91 41.55 85.19 33.15 79.73C24.75 74.27 16.39 60.17 16.33 50.23C16.28 40.3 24.51 25.42 32.82 20.13C41.13 14.84 58.17 13.49 66.2 18.51C74.22 23.53 80.87 39.49 80.97 50.23Z" fill={{"payload": 4278190080, "type": 0}} /></RNSVGGroup><RNSVGGroup fill={{"payload": 4279569427, "type": 0}} propList={["fill"]}><RNSVGPath d="M44.42 46.4C45.12 53.3 45.12 53.3 42.65 53.55C40.19 53.8 40.19 53.8 39.49 46.9C38.79 40 38.79 40 41.26 39.75C43.72 39.5 43.72 39.5 44.42 46.4Z" fill={{"payload": 4278190080, "type": 0}} /><RNSVGPath d="M62.02 45.54C62.88 52.77 62.88 52.77 60.12 53.1C57.36 53.43 57.36 53.43 56.5 46.19C55.65 38.95 55.65 38.95 58.41 38.63C61.17 38.3 61.17 38.3 62.02 45.54Z" fill={{"payload": 4278190080, "type": 0}} /></RNSVGGroup></RNSVGGroup></RNSVGGroup><RNSVGCircle cx={22} cy={22} fill={null} propList={["fill", "stroke", "strokeWidth"]}

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/index.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/index.tsx = 0.

Commit: fb7056f7 — test(mobile): map shows the pet avatar marker (R10)

### Verde R10

Comando: bunx jest src/screens/map/index.test.tsx src/__tests__/map-canvas-fidelity.test.ts src/screens/map/pet-marker-icon.test.tsx --runInBand --json

Verde R10: exit 0; 402 verdes, 0 rojos; 0 errores de suite.

Commit: 25ae2d28 — feat(mobile): map shows the pet avatar marker (R10)

R10: los tres fallos de tests existentes del primer rojo desaparecieron en el reintento aislado index.test.tsx (mutación R10: 305 verdes y solo el it de ausencia rojo), sin editar sus aserciones. El verde de R10 confirmó los 402 tests de los tres ficheros. Se ejecuta ahora el comando literal de guardas del handoff con progress/jest_230_r10.log.

## Guardas tras R10

Comando literal del handoff, exit 0.
Test Suites: 8 passed, 8 total
Tests:       703 passed, 703 total
Snapshots:   0 total
Time:        39.86 s, estimated 46 s

Cantidad de caracteres ●: 1; cabeceras: ['  ● Console'].

Orden de imports esperado comprobado con node: ["../../api/types","../../theme/use-theme-colors","blobatar","expo-image","react","react-native","react-native-svg"]

### R11 sin mutaciones

Comando: bunx jest src/__tests__/map-canvas-fidelity.test.ts --runInBand --json

R11 sin mutaciones: exit 0; 90 verdes, 0 rojos; 0 errores de suite.

Mutación R11 hex: añadir al compositor "\n// '#FFFFFF'\n"

### Mutación R11 hex

Comando: bunx jest src/__tests__/map-canvas-fidelity.test.ts --runInBand --json

Mutación R11 hex: exit 1; 89 verdes, 1 rojos; 0 errores de suite.

#230 R11: screens/map/pet-marker-icon.tsx respeta la guarda hex y clase arbitraria

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   /#(?!\d{2,3} R\d)[\da-f]{3,8}\b/i,
+ ]
    at toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/__tests__/map-canvas-fidelity.test.ts:624:67)

Filas adicionales que caen:

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

Mutación R11 StyleSheet: añadir al compositor '\n// StyleSheet.create\n'

### Mutación R11 StyleSheet

Comando: bunx jest src/__tests__/map-canvas-fidelity.test.ts --runInBand --json

Mutación R11 StyleSheet: exit 1; 89 verdes, 1 rojos; 0 errores de suite.

#230 R11: screens/map/pet-marker-icon.tsx respeta la guarda StyleSheet.create

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   /StyleSheet\.create/,
+ ]
    at toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/__tests__/map-canvas-fidelity.test.ts:624:67)

Filas adicionales que caen:

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

Mutación R11 emoji: añadir al compositor '\n// 🐾\n'

### Mutación R11 emoji

Comando: bunx jest src/__tests__/map-canvas-fidelity.test.ts --runInBand --json

Mutación R11 emoji: exit 1; 89 verdes, 1 rojos; 0 errores de suite.

#230 R11: screens/map/pet-marker-icon.tsx respeta la guarda emoji

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   /(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCC0\uDCCF\uDCD0\uDCF6-\uDCFF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAE-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDE5F\uDE66-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFA]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDEE5\uDEE9\uDEEB-\uDEF0\uDEF3-\uDEFF\uDFDA-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE\uDCAF\uDCBC-\uDCBF\uDCC2-\uDCCF\uDCD9-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDDFF\uDE58-\uDE5F\uDE6E-\uDEFF]|\uD83F[\uDC00-\uDFFD])/,
+ ]
    at toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/__tests__/map-canvas-fidelity.test.ts:624:67)

Filas adicionales que caen:

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

Mutación R11 degradado: añadir al compositor "\nimport { LinearGradient } from 'expo-linear-gradient';\n"

### Mutación R11 degradado

Comando: bunx jest src/__tests__/map-canvas-fidelity.test.ts --runInBand --json

Mutación R11 degradado: exit 1; 88 verdes, 2 rojos; 0 errores de suite.

#230 R11: screens/map/pet-marker-icon.tsx respeta la guarda imports de degradado y desenfoque

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   /from 'expo-linear-gradient'/,
+ ]
    at toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/__tests__/map-canvas-fidelity.test.ts:624:67)

#230 R11: el compositor importa solo lo suyo

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

  Array [
    "../../api/types",
    "../../theme/use-theme-colors",
    "blobatar",
    "expo-image",
+   "expo-linear-gradient",
    "react",
    "react-native",
    "react-native-svg",
  ]
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/__tests__/map-canvas-fidelity.test.ts:630:45)

Filas adicionales que caen: #230 R11: el compositor importa solo lo suyo

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

Mutación R11 radio: añadir al compositor '\n// className="rounded-xl"\n'

### Mutación R11 radio

Comando: bunx jest src/__tests__/map-canvas-fidelity.test.ts --runInBand --json

Mutación R11 radio: exit 1; 89 verdes, 1 rojos; 0 errores de suite.

#230 R11: screens/map/pet-marker-icon.tsx respeta la guarda radios fuera de la escala

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   /rounded-(?:2xl|xl|lg|md|sm)\b/,
+ ]
    at toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/__tests__/map-canvas-fidelity.test.ts:624:67)

Filas adicionales que caen:

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

Mutación R11 acento: añadir al compositor '\n// className="text-accent"\n'

### Mutación R11 acento

Comando: bunx jest src/__tests__/map-canvas-fidelity.test.ts --runInBand --json

Mutación R11 acento: exit 1; 89 verdes, 1 rojos; 0 errores de suite.

#230 R11: screens/map/pet-marker-icon.tsx respeta la guarda text-accent sin sufijo

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   /\btext-accent(?![-\w])/,
+ ]
    at toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/__tests__/map-canvas-fidelity.test.ts:624:67)

Filas adicionales que caen:

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

Mutación R11 import ajeno: añadir al compositor "\nimport { PetAvatar } from '../../components/pet-avatar';\n"

### Mutación R11 import ajeno

Comando: bunx jest src/__tests__/map-canvas-fidelity.test.ts --runInBand --json

Mutación R11 import ajeno: exit 1; 89 verdes, 1 rojos; 0 errores de suite.

#230 R11: el compositor importa solo lo suyo

Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

@@ -1,7 +1,8 @@
  Array [
    "../../api/types",
+   "../../components/pet-avatar",
    "../../theme/use-theme-colors",
    "blobatar",
    "expo-image",
    "react",
    "react-native",
    at Object.toEqual (/home/claude/sites/Pet-Tracker-wt-230/mobile-pet-tracker/src/__tests__/map-canvas-fidelity.test.ts:630:45)

Filas adicionales que caen:

Mutación revertida: git checkout HEAD -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx; git diff --quiet -- mobile-pet-tracker/src/screens/map/pet-marker-icon.tsx = 0.

### R11 tras revertir las siete mutaciones

Comando: bunx jest src/__tests__/map-canvas-fidelity.test.ts --runInBand --json

R11 tras revertir las siete mutaciones: exit 0; 90 verdes, 0 rojos; 0 errores de suite.

Commit: c7b5f9dd — test(mobile): drift guards for the marker composer (R11)

R11: las siete filas nacen verdes. No requiere commit de producción.

## Suite completa, intento 1 — inválido por SIGKILL

Comando: bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ src/screens/map > ../progress/jest_230_final.log 2>&1; echo "jest=$?"

Exit 1. Tests válidos contabilizados: 0, conforme al handoff (los 1697 impresos no cierran la verificación).
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
FAIL src/screens/map/index.test.tsx
  ● Test suite failed to run
    A jest worker process (pid=3745255) was terminated by another process: signal=SIGKILL, exitCode=null. Operating system logs may contain more information on why this occurred.
FAIL src/screens/map/index.test.tsx
  ● Test suite failed to run
    A jest worker process (pid=3745255) was terminated by another process: signal=SIGKILL, exitCode=null. Operating system logs may contain more information on why this occurred.
Test Suites: 1 failed, 82 passed, 83 total
Tests:       1697 passed, 1697 total
Snapshots:   1 passed, 1 total
Time:        268.963 s
Repetición del mismo comando completo, sin cambiar código ni tests.

Nota R11: el import temporal de expo-linear-gradient hizo caer además la fila de imports permitidos porque introduce un módulo ajeno; las otras seis mutaciones solo hicieron caer su fila. Todas restauradas y verificadas con diff --quiet.

## Anclas finales

Medidas con los comandos literales de requirements.md, desde mobile-pet-tracker/src. Todas coinciden.

| Ancla | Medido | Esperado |
|---|---|---|
| B1 | 1 | 1 |
| B2 | 3 | 3 |
| B3 | sí | sí |
| B4 | sí | sí |
| B5 | 1 | 1 |
| B6 | 1 | 1 |
| B7 | 0 | 0 |
| B8 | 0 | 0 |
| B9 | screens/map/pet-marker-icon.tsx:0; screens/map/index.tsx:0; components/pet-map.tsx:0 | screens/map/pet-marker-icon.tsx:0; screens/map/index.tsx:0; components/pet-map.tsx:0 |

Fidelidad del mapa: 81 tests antes, 90 después (+9). El bloque anterior al describe nuevo conserva exactamente la base H0. Diff de producción y tests acotado a los siete archivos autorizados; sin reindentación del código anterior.

## Suite completa, intento 2 — fallos bajo carga

Mismo comando literal, exit 1.
  ●  Cannot log after tests are done. Did you forget to wait for something async in your test?
FAIL src/app/__tests__/alert-detail.notification.test.tsx (77.402 s)
  ● #100 R7: el toque apila el detalle de su alerta una sola vez › abre el detalle en frío y en caliente, sin duplicarlo, y cae al centro sin id
    thrown: "Exceeded timeout of 5000 ms for a test.
FAIL src/components/__tests__/celebration.test.tsx (283.494 s)
  ● #171 R7: pop › R7.4 Orbit baja de 1.08 a 1 entre los 420 y los 540 ms
    thrown: "Exceeded timeout of 60000 ms for a test.
  ● #171 R18: flotación de Pingo › R18.2 la flotación sigue en bucle: 0 a los 3600 ms y -10 a los 5100 ms
    thrown: "Exceeded timeout of 60000 ms for a test.
FAIL src/screens/map/index.test.tsx (297.117 s)
  ● R6: mapa y marker con la última posición › R3 (android-map-never-ready): centra el mapa y pasa la última posición como marker
FAIL src/app/__tests__/alert-detail.notification.test.tsx (77.402 s)
  ● #100 R7: el toque apila el detalle de su alerta una sola vez › abre el detalle en frío y en caliente, sin duplicarlo, y cae al centro sin id
    thrown: "Exceeded timeout of 5000 ms for a test.
FAIL src/components/__tests__/celebration.test.tsx (283.494 s)
  ● #171 R7: pop › R7.4 Orbit baja de 1.08 a 1 entre los 420 y los 540 ms
    thrown: "Exceeded timeout of 60000 ms for a test.
  ● #171 R18: flotación de Pingo › R18.2 la flotación sigue en bucle: 0 a los 3600 ms y -10 a los 5100 ms
    thrown: "Exceeded timeout of 60000 ms for a test.
FAIL src/screens/map/index.test.tsx (297.117 s)
  ● R6: mapa y marker con la última posición › R3 (android-map-never-ready): centra el mapa y pasa la última posición como marker
Test Suites: 3 failed, 80 passed, 83 total
Tests:       4 failed, 1999 passed, 2003 total
Snapshots:   1 passed, 1 total
Time:        553.149 s
Caracteres ● (incluido Console): 30.

Los cuatro fallos del intento 2 pertenecen a tests existentes. Se repite cada fichero solo y de forma secuencial, sin cambiar aserciones ni plazos.

### Final: reintento aislado de notificación de alerta

Comando: bunx jest src/app/__tests__/alert-detail.notification.test.tsx --runInBand --json

Final: reintento aislado de notificación de alerta: exit 0; 1 verdes, 0 rojos; 0 errores de suite.

### Final: reintento aislado de Celebración

Comando: bunx jest src/components/__tests__/celebration.test.tsx --runInBand --json

Final: reintento aislado de Celebración: exit 0; 66 verdes, 0 rojos; 0 errores de suite.

### Final: reintento aislado de pantalla Mapa

Comando: bunx jest src/screens/map/index.test.tsx --runInBand --json

Final: reintento aislado de pantalla Mapa: exit 0; 306 verdes, 0 rojos; 0 errores de suite.

Intento 1: caracteres ● = 22 (Console y dos bloques repetidos del worker eliminado). Intento 2: el fallo antiguo del mapa esperaba map-view y recibió map-loading; ninguno de los tests nuevos falló. Los tres ficheros con fallos pasan aislados: alerta 1/1, Celebración 66/66 y Mapa 306/306.

## Suite completa, intento 3

Se conserva el mismo conjunto de rutas y se añade solo --runInBand para evitar la concurrencia que produjo SIGKILL/timeouts. No se alteran código, tests ni plazos. Comando: bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ src/screens/map --runInBand > ../progress/jest_230_final.log 2>&1; echo "jest=$?".

Resultado final conjunto: exit 0.
Test Suites: 83 passed, 83 total
Tests:       2003 passed, 2003 total
Snapshots:   1 passed, 1 total
Time:        127.485 s, estimated 571 s
Caracteres ●: 21; cabeceras: ['  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console', '  ● Console']. Todos son Console; sin bloques de fallo.

## Tipos, intento inicial

Comando literal del handoff: router.d.ts ausente; tsc exit 2. TS2339/TS7006/TS2683 en el equality tester (el Expect global de RNTL omite addEqualityTesters) y TS2322 en los dos ClipPath (sus tipos no incluyen testID). Se corrige en los mismos dos archivos autorizados: tipo de expect obtenido de @jest/globals mediante import de tipo, sin cambiar el objeto en ejecución; testID de ClipPath pasado con spread, con las mismas props en ejecución. No se añade dependencia ni fichero. Se repiten tipos y tests afectados antes de commitear las correcciones.

Tipos, segundo intento: exit 2, TS2352 al convertir el Expect de RNTL al de Jest (sus tipos de matchers son distintos). Se elimina la conversión: se importa expect como jestExpect desde el @jest/globals ya instalado únicamente para registrar el equality tester; las aserciones de RNTL conservan su expect global.

Tipos, tercer intento: mismo comando literal, exit 0, log vacío. router.d.ts sigue ausente y no se elimina ningún fichero de Expo.

### Tipos corregidos: compositor y fidelidad

Comando: bunx jest src/screens/map/pet-marker-icon.test.tsx src/__tests__/map-canvas-fidelity.test.ts --runInBand --json.

Tipos corregidos: compositor y fidelidad: 0; 103 verdes, 0 rojos; suites con error 0

Lint, intento 1: exit 1; react/display-name en el Svg forwardRef del doble prescrito (pet-marker-icon.test.tsx:30). Se añade solo Svg.displayName = "Svg" después del forwardRef, conservando su cuerpo y las exportaciones/mocks exactos, sin cambiar comportamiento. Se vuelve a ejecutar lint sin caché y tipos sobre el código definitivo.

Commit correctivo: 7526e4ac — test(mobile): type and name the marker SVG double (R3)

Commit correctivo: bdf53623 — fix(mobile): type the marker clip test IDs (R3, R5)

Tipos definitivos: exit 0, 0 bytes de log. Lint definitivo: LINT_OK, exit 0 y 0 bytes de log, sin caché. Los ajustes correctivos se separan en un commit de tests y otro de producción, después de los pares TDD originales; no cambian el comportamiento y no se reescribe el historial. Se repite la suite completa sobre estos commits.

## Suite completa, intento 4 — tras los ajustes de tipos y lint

Mismo conjunto completo, con --runInBand para limitar recursos; sin cambiar plazos ni aserciones existentes.

Resultado definitivo tras bdf53623: exit 0.
Test Suites: 83 passed, 83 total
Tests:       2003 passed, 2003 total
Snapshots:   1 passed, 1 total
Time:        130.888 s
Caracteres ●: 21; todos son Console, sin bloques de fallo.

## Cierre

R1–R11 implementados y verificados. Las 13 mutaciones de filas que nacen verdes fueron detectadas y revertidas; los candados existentes no cambian. Las anclas B1–B9 se re-midieron tras los ajustes finales y conservan todas las cifras medidas/esperadas de la tabla anterior. Fidelidad: 81 → 90 (+9).

TypeScript definitivo: exit 0, log de 0 bytes. Lint definitivo sin caché: exit 0, LINT_OK y log de 0 bytes. router.d.ts ausente, sin eliminar ningún archivo de Expo. Las dos correcciones posteriores a la primera suite verde quedan documentadas y el conjunto completo volvió a pasar después de ellas.

Skills cargadas: ponytail:ponytail (/home/claude/.codex/plugins/cache/ponytail/ponytail/5.3.3/skills/ponytail/SKILL.md), building-native-ui (/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md) y appllama-app-design-skill (.agents/skills/appllama-app-design-skill/SKILL.md). Carta del proyecto y spec aprobada gobiernan el cambio. No se delegó trabajo.

Se borran los cuatro logs temporales prescritos; no se commitean. El cierre docs(progress): trazabilidad de #230 (R1-R11) contiene solo este reporte y traceability.md. No se ejecutó ./init.sh ni se hicieron fetch, merge, rebase, push, bun install u operaciones de PR. La única parada fue la Parada 1 ya resuelta; en esta reanudación se completó la implementación.

Quedan al leader el harness ./init.sh y la apertura de PR hacia dev. G2 Android e iOS siguen pendientes del humano; no se marcaron sus casillas ni se cambió feature_list.json, STATUS.md, progress/current.md ni otros archivos fuera de la lista cerrada. No se hizo prueba en dispositivo. Los riesgos de memoria y comportamiento nativo en iOS siguen siendo los declarados por la spec y cubiertos por G2.

Última acción de entrega: crear el marcador .done no commiteado con la ruta de este reporte; indica fin de la implementación y entrega al leader, sin sustituir el smoke humano.

## Commits de implementación y verificación

```text
8b8fd3f2 test(mobile): pet map marker takes an optional icon (R2)
79d569c3 feat(mobile): pet map marker takes an optional icon (R2)
195c0b75 test(mobile): hidden marker composer without copy (R1)
5c9f66a6 feat(mobile): hidden marker composer without copy (R1)
03726951 test(mobile): marker composer draws the blobatar fallback (R3)
efac945d feat(mobile): marker composer draws the blobatar fallback (R3)
187027ee test(mobile): marker composer captures the fallback after two frames (R4)
1103fc6b feat(mobile): marker composer captures the fallback after two frames (R4)
9a29d06c test(mobile): marker composer draws the circular photo (R5)
5f90ad49 feat(mobile): marker composer draws the circular photo (R5)
303be02f test(mobile): marker composer captures the photo and keeps it (R6)
5d3dba06 feat(mobile): marker composer captures the photo and keeps it (R6)
6685ed19 test(mobile): marker photo falls back after 4000 ms (R7)
913def8e feat(mobile): marker photo falls back after 4000 ms (R7)
64951596 test(mobile): marker composition key ignores the url signature (R8)
28a99c74 feat(mobile): marker composition key ignores the url signature (R8)
56911cf3 test(mobile): only the current composition icon reaches the map (R9)
f9871bc8 feat(mobile): only the current composition icon reaches the map (R9)
fb7056f7 test(mobile): map shows the pet avatar marker (R10)
25ae2d28 feat(mobile): map shows the pet avatar marker (R10)
c7b5f9dd test(mobile): drift guards for the marker composer (R11)
7526e4ac test(mobile): type and name the marker SVG double (R3)
bdf53623 fix(mobile): type the marker clip test IDs (R3, R5)
```
