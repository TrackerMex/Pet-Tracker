---
feature: "mobile-ios-support"
status: approved           # draft | spec_ready | approved
tags: [spec, mobile, ios, eas, universal-links]
---

# Tareas — [[mobile-ios-support]] (#60)

> Orden TDD con **rojo natural** (C4, vía a): la base no cumple R1 a R9, así
> que cada `it` nuevo da rojo contra la base, sin mutaciones versionadas. Van
> **nueve commits rojos** de solo tests y **ocho verdes**: R1 y R2 comparten
> verde, porque el mismo cambio de `PetMap` pone los dos en verde
> ([[design]] §D1). **Un commit por paso, test primero.** Nunca mezcles test e
> implementación, ni docs y código, en el mismo commit: en #19 se perdió el
> historial rojo→verde por hacerlo.
>
> Cada requisito crea su sujeto antes de aseverarlo. Los mocks de `expo-maps`
> ganan `AppleMaps` en el mismo commit rojo que lo usa; el mock de
> `expo-image-picker` gana el enum de representación en el rojo de R3; el
> `import` de `existsSync` entra en el rojo de R8, que es quien lo usa.
>
> **Todos los comandos se corren desde `mobile-pet-tracker/`, también los de
> git.** Las rutas sin prefijo son relativas a `mobile-pet-tracker/`; las que
> empiezan por `../` salen de ella (`../docs/`, `../hosting/`, `../AGENTS.md`,
> `../specs/`, `../progress/`). Ninguna ruta de esta feature lleva paréntesis.
> Los números de línea **no son anclas**: todo se localiza por contenido, con
> el `grep` que se cita. Nombres cortos:
>
> - «`PetMap`» es `src/components/pet-map.tsx` y «el test de `PetMap`»,
>   `src/components/__tests__/pet-map.test.tsx`;
> - «el test del mapa» es `src/screens/map/index.test.tsx`;
> - «el alta» es `src/screens/add-pet/index.tsx` y «el test del alta»,
>   `src/screens/add-pet/index.test.tsx`;
> - «el perfil» es `src/screens/profile/index.tsx` y «el test del perfil»,
>   `src/screens/profile/index.test.tsx`;
> - «el test de config» es `app.config.test.ts`;
> - «el test de hosting» es `src/__tests__/hosting-artifacts.test.ts`;
> - «la guía» es `../docs/verification.md`;
> - «el AASA» es `../hosting/.well-known/apple-app-site-association`.
>
> **Los bloques de código van a columna 0 en este fichero**: cópialos tal
> cual, sin quitar ni añadir sangría. Cada uno lleva ya la sangría que tiene en
> su fichero destino. El bloque de R9 para la guía va entre vallas de **cuatro**
> acentos graves porque contiene bloques de código: copia lo de dentro, no la
> valla. Tras cada paso, `git hash-object` del fichero tocado debe dar el blob
> que se cita: es la prueba de que el pegado es exacto.

## Antes de tocar nada

1. `git branch --show-current` da `feature/60-mobile-ios-support`. Si no,
   **para**.
2. Lee la casilla de [[requirements]] §Aprobación. Si no está marcada,
   **para**. Las casillas de R11, R12 y R13 son del humano: no las marques.
3. Anota `git rev-parse HEAD` en el reporte como **HEAD del handoff**. §R10
   mide contra él la lista cerrada de ficheros.
4. `test ! -e .expo/types/router.d.ts; echo "exit=$?"` da `exit=0`. Si da 1,
   **para** y avisa al humano: el fichero está gitignorado y rompe `tsc` con
   rutas fantasma. No lo borres tú, porque tu sandbox lo deniega (#121).
5. **Skills.**
   - Carga `building-native-ui` de tu plugin `expo`: `PetMap` y los dos
     selectores de fotos son UI nativa.
   - Carga `expo-dev-client` y `expo-deployment` de tu plugin `expo` **solo
     como lectura**: explican el dev build de EAS y los Universal Links que
     documenta R9. **No ejecutes** ninguno de sus comandos (punto 6).
   - Carga `appllama-app-design-skill` de `.agents/skills/`, que
     `docs/ui-guidelines.md` hace obligatoria en toda tarea de UI móvil. Toma
     de ella solo el **patrón**: la carta gana siempre, y su *simulator loop*
     no aplica, porque no hay Mac y la verificación es la prueba de humo del
     humano en iPhone (R12).
   - Tu plugin **no tiene** skill de `expo-router` ni de animación. No hacen
     falta: esta feature no navega ni anima distinto, y todo lo que decide
     está escrito aquí.
   - Anota en el reporte qué skills cargaste.
6. **Lo que no ejecutas nunca.** Ni `eas build`, ni `eas credentials`, ni
   `eas device:create`, ni `eas env:set`, ni `eas login`, ni ningún otro
   comando `eas`; tampoco `bunx expo prebuild` ni `bunx expo run:ios` o
   `run:android`. No tocas la clave `.p8`, certificados ni perfiles, y no
   abres `.env` ni `google-services.json`. Ningún fichero gana el dominio
   real, el Team ID real, UDIDs, correos ni tokens. Todo eso es del humano
   (R11, R12, R13 y la guía de R9). Todo se corre con `bun` y `bunx`, nunca con
   `npm` ni `npx`. No instales nada. **No corras `./init.sh` ni los e2e**, y
   la suite entera solo con permiso del humano: otra sesión (Backend)
   comparte la máquina.
7. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/components/pet-map.tsx` | `08c6e385cc84eb80cd5482dfc978e2140c148b2d` |
   | `src/components/__tests__/pet-map.test.tsx` | `1e94de457f4a7e5c066c6213cde14ad4e9eb5328` |
   | `src/screens/map/index.test.tsx` | `2fd0daec7b40f2f2cbe9e3fa0975cbabc64957cc` |
   | `src/screens/add-pet/index.tsx` | `6ee79a8fa8bbdd4a123ada5c67d108f1d4e902c7` |
   | `src/screens/add-pet/index.test.tsx` | `9b52b5d69159deedbc2aa8c699d3916923cfad75` |
   | `src/screens/profile/index.tsx` | `4cc1c08b3519578b322a839464262b1896897fd1` |
   | `src/screens/profile/index.test.tsx` | `08203f122680405794868b20419a1c22d6ca601d` |
   | `app.json` | `9beaa54eca04d46320fd256adb6e0cf2b4909319` |
   | `app.config.ts` | `9256c22e40c5a010688ecd56a5d034a47dd946dd` |
   | `app.config.test.ts` | `fdb6789e68a1e3747de47f6f5c31e336afec3b35` |
   | `src/__tests__/hosting-artifacts.test.ts` | `03b8322632dde2313819833500740c4ccefbef6e` |
   | `.env.example` | `2f1086a1e4d554a6e15d999020ce1a3c000684a9` |
   | `eas.json` | `b52225c6e3dedb0ca522441f401e0ffdce71201c` |
   | `package.json` | `7ee4a80719e09041e6c3fa63f55d1b03632c0768` |
   | `bun.lock` | `3bd3a09cd94ec108fbea458427b41209a425636b` |
   | `../docs/verification.md` | `69b08b469ad018bf811cf5e3dec70e8034819532` |
   | `../hosting/README.md` | `9e35e86f45e050b1e8d8aac6bab5302bb372175d` |
   | `../AGENTS.md` | `a15920b3bc61cc5d3b48efdb99cec066ec36ab9f` |
   | `../docs/conventions.md` | `78ed538c70c544989e296ee71a890b49c2bd7e0d` |

   Además, `test ! -e ../hosting/.well-known/apple-app-site-association && test ! -e ../hosting/.well-known/.htaccess; echo "exit=$?"`
   da `exit=0`: los dos ficheros se crean en R8. Si algo no coincide, **para**: la
   base se movió, y los blobs y las sondas de esta spec ya no valen.

   Anota también las dos cuentas de §R10 punto 7 que barren `src/` entero
   (`Platform.OS` y `launchImageLibraryAsync(` fuera de tests): en la base dan
   3 y 2. Otra feature puede moverlas sin tocar ningún fichero de esta tabla;
   si dan otra cosa, no pares: §R10 exige el delta (+1 y +0) sobre lo medido.
8. Mide la base, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/components/__tests__/pet-map.test.tsx src/screens/map/index.test.tsx src/screens/add-pet/index.test.tsx src/screens/profile/index.test.tsx app.config.test.ts src/__tests__/hosting-artifacts.test.ts > /tmp/60_base.log 2>&1; echo "exit=$?"
   bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/hero-header-amendments.test.ts > /tmp/60_guards.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_base.log /tmp/60_guards.log
   ```

   Esperado:
   - los seis ficheros de test, 6 suites y 148 passed de 148, `exit=0`. Por
     fichero: `app.config.test.ts` 13, `src/__tests__/hosting-artifacts.test.ts` 7, `src/components/__tests__/pet-map.test.tsx` 8, `src/screens/add-pet/index.test.tsx` 24, `src/screens/map/index.test.tsx` 58, `src/screens/profile/index.test.tsx` 38;
   - los tres guardas, 3 suites y 111 passed de 111, `exit=0`.

   Si da otra cifra con `exit=0` (porque otra feature mergeó antes), **anota
   la medida** y úsala como base: el delta exigido sigue siendo +21 tests y
   +0 suites sobre lo medido. Nunca pongas `| tail` ni `| grep` detrás de
   `jest`, porque el `exit` sería el del último comando. Los bloques
   `● Console` del log son ruido y no cuentan como fallo: los rojos se
   cuentan por la línea `Tests:`. Si en algún momento sale rojo un `it` del
   test del alta que no es de `#60 R3` (el flake conocido de `#72 R2` bajo
   carga), repite ese fichero solo, tras `bunx jest --clearCache`, y anótalo:
   no es de esta feature.
9. Mide lo que generan los plugins en la base:

   ```bash
   RESET_LINK_HOST=reset.example.test bunx expo config --type introspect --json > /tmp/60_introspect.json 2> /tmp/60_introspect.err; echo "exit=$?"
   bun -e 'const c=JSON.parse(require("fs").readFileSync("/tmp/60_introspect.json","utf8"));const p=c.ios.infoPlist;console.log(JSON.stringify({usage:Object.keys(p).filter((k)=>k.endsWith("UsageDescription")).sort(),photos:p.NSPhotoLibraryUsageDescription,encryption:p.ITSAppUsesNonExemptEncryption,domains:c.ios.entitlements["com.apple.developer.associated-domains"],aps:c.ios.entitlements["aps-environment"],android:c.android.permissions.filter((x)=>/RECORD_AUDIO|CAMERA/.test(x))}))'
   rm /tmp/60_introspect.json /tmp/60_introspect.err
   test ! -e .expo/types/router.d.ts; echo "exit=$?"
   ```

   Esperado: `exit=0` y exactamente esta línea (en la base no hay dominio
   asociado ni `encryption`, y el texto de fotos es el inglés por defecto):

   ```text
   {"usage":["NSCameraUsageDescription","NSFaceIDUsageDescription","NSLocalNetworkUsageDescription","NSMicrophoneUsageDescription","NSPhotoLibraryUsageDescription"],"photos":"Allow $(PRODUCT_NAME) to access your photos","aps":"development","android":["android.permission.RECORD_AUDIO"]}
   ```

   **Seguridad.** El JSON de `introspect` lleva la configuración resuelta con
   lo que haya en `.env`, incluida la clave de Google Maps. **No lo abras, no
   lo cites y no lo copies** al reporte ni a ningún fichero: copia solo la
   línea de `bun -e`, y bórralo en el acto. Si tu sandbox deniega el `rm`,
   avisa al humano. Si `domains` saliera con otro valor que
   `["applinks:reset.example.test"]` en §R10, **para** y no copies nada:
   podría ser el dominio real. El último `test` da `exit=0`; si da 1, el
   comando generó los tipos de `expo-router`: **para** y avisa al humano.
10. **Reglas de literales en los tests**, comentarios incluidos:
    - la cita de la feature va siempre como `#60 R<n>`, **nunca `#60`
      suelto**: los candados de cuenta de §R10 cuentan `#60 R`;
    - ni `StyleSheet` ni ningún `-[` (clase arbitraria), en ningún caso,
      tampoco en un comentario;
    - ningún color hexadecimal.
11. **Los esperados son literales.** El zoom (`16`), el bundle, el texto del
    permiso, el `appID` y las rutas van escritos a mano, como en los bloques
    de abajo. Ningún test nuevo importa valores de producción para
    compararlos consigo mismos. Lo que usan los `it` nuevos está declarado en
    el propio bloque o ya existe en el fichero; cuando no, el bloque del
    mismo paso lo añade.

## R1 — En iOS, `PetMap` pinta el mapa de Apple con el contrato del tab Map

### (1) Rojo

En el test de `PetMap`, cuatro cambios:

1. En los imports del principio del fichero, sustituye esta línea (el bloque aparece una sola vez; `grep -cxF "import type { ReactNode } from 'react';" src/components/__tests__/pet-map.test.tsx` da 1):

```tsx
import type { ReactNode } from 'react';
```

por estas 2:

```tsx
import type { ReactNode } from 'react';
import { Platform } from 'react-native';
```

2. En la apertura de `jest.mock('expo-maps'`, sustituye estas 3 líneas (el bloque aparece una sola vez; `grep -cxF "jest.mock('expo-maps', () => ({" src/components/__tests__/pet-map.test.tsx` da 1):

```tsx
jest.mock('expo-maps', () => ({
  __esModule: true,
  GoogleMaps: {
```

por estas 23:

```tsx
const mockAppleMapsView = jest.fn(
  (props: Record<string, unknown> & { children?: ReactNode }) => {
    const React = jest.requireActual<typeof import('react')>('react');
    const { View } = jest.requireActual<typeof import('react-native')>(
      'react-native',
    );

    return React.createElement(View, props, props.children);
  },
);

jest.mock('expo-maps', () => ({
  __esModule: true,
  AppleMaps: {
    View: (props: Record<string, unknown> & { children?: ReactNode }) =>
      mockAppleMapsView(props),
    MapColorScheme: {
      AUTOMATIC: 'AUTOMATIC',
      LIGHT: 'LIGHT',
      DARK: 'DARK',
    },
  },
  GoogleMaps: {
```

   El resto del mock (`View` de `GoogleMaps` y su `MapColorScheme`) no cambia.
   `mockAppleMapsView` queda declarado justo encima del `jest.mock`, igual que
   `mockGoogleMapsView`.

3. En el `beforeEach` de nivel superior, sustituye estas 3 líneas (el bloque aparece una sola vez; `grep -cxF 'beforeEach(() => {' src/components/__tests__/pet-map.test.tsx` da 1):

```tsx
beforeEach(() => {
  mockGoogleMapsView.mockClear();
});
```

por estas 15:

```tsx
const originalPlatform = Platform.OS;

function setPlatform(os: string): void {
  Object.defineProperty(Platform, 'OS', { configurable: true, value: os });
}

beforeEach(() => {
  mockGoogleMapsView.mockClear();
  mockAppleMapsView.mockClear();
  setPlatform('android');
});

afterEach(() => {
  setPlatform(originalPlatform);
});
```

   El preset `jest-expo` corre como iOS: los `it` existentes aseveran
   `GoogleMaps.View` y necesitan `'android'` ([[design]] §D13). `afterEach`
   devuelve la plataforma original.

4. Al final del fichero, que termina en `});`, añade una línea en blanco y este bloque:

```tsx
describe('#60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map', () => {
  const center = { latitude: 19.4326, longitude: -99.1332 };

  it('#60 R1: en Android pinta GoogleMaps.View y nunca AppleMaps.View', async () => {
    await render(
      <PetMap center={center} marker={null} polylines={[]} colorScheme="light" />,
    );

    expect(mockGoogleMapsView).toHaveBeenCalledTimes(1);
    expect(mockAppleMapsView).not.toHaveBeenCalled();
    expect(screen.getByTestId('map-view').props.uiSettings).toEqual({
      zoomControlsEnabled: false,
    });
  });

  describe('en iOS', () => {
    beforeEach(() => {
      setPlatform('ios');
    });

    it('#60 R1: pinta AppleMaps.View y nunca GoogleMaps.View, con cámara, marker, polylines y estilo del contrato', async () => {
      const marker = { latitude: 19.45, longitude: -99.12 };
      const polylines = [
        {
          id: 'trip-0',
          coordinates: [
            { latitude: 19.4326, longitude: -99.1332 },
            { latitude: 19.433, longitude: -99.1328 },
          ],
        },
      ];

      await render(
        <PetMap
          center={center}
          marker={marker}
          polylines={polylines}
          colorScheme="light"
        />,
      );

      expect(mockAppleMapsView).toHaveBeenCalledTimes(1);
      expect(mockGoogleMapsView).not.toHaveBeenCalled();
      const mapProps = screen.getByTestId('map-view').props;
      expect(mapProps.style).toEqual({ flex: 1 });
      expect(mapProps.cameraPosition).toEqual({ coordinates: center, zoom: 16 });
      expect(mapProps.markers).toEqual([
        { id: 'last-position', coordinates: marker },
      ]);
      expect(mapProps.polylines).toEqual([
        { ...polylines[0], color: 'accent-color' },
      ]);
    });

    it.each([
      ['dark', 'DARK'],
      ['light', 'LIGHT'],
    ] as const)('#60 R1: mapea el tema %s al esquema nativo %s', async (colorScheme, expected) => {
      await render(
        <PetMap center={center} marker={null} polylines={[]} colorScheme={colorScheme} />,
      );

      expect(mockAppleMapsView).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('map-view').props.colorScheme).toBe(expected);
    });

    it('#60 R1: oculta el botón de mi ubicación y el cambio de inclinación, sin contentPadding', async () => {
      await render(
        <PetMap center={center} marker={null} polylines={[]} colorScheme="light" />,
      );

      const mapProps = screen.getByTestId('map-view').props;
      expect(mapProps.uiSettings).toEqual({
        myLocationButtonEnabled: false,
        togglePitchEnabled: false,
      });
      expect(mapProps).not.toHaveProperty('contentPadding');
    });
  });
});
```


Después:

1. `git hash-object src/components/__tests__/pet-map.test.tsx` da `d8328887c3de2038b6f577b7215115d8c0331e35` (294 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/components/__tests__/pet-map.test.tsx > /tmp/60_r1.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_r1.log
   ```

   Esperado: `Tests:` 4 failed, 9 passed, 13 total; `Test Suites:` 1 failed, 1 total; `exit=1`. Los rojos, todos **por aserción**:

   - `#60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: pinta AppleMaps.View y nunca GoogleMaps.View, con cámara, marker, polylines y estilo del contrato`, por `expect(jest.fn()).toHaveBeenCalledTimes(expected)`;
   - `#60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: mapea el tema dark al esquema nativo DARK`, por `expect(jest.fn()).toHaveBeenCalledTimes(expected)`;
   - `#60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: mapea el tema light al esquema nativo LIGHT`, por `expect(jest.fn()).toHaveBeenCalledTimes(expected)`;
   - `#60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: oculta el botón de mi ubicación y el cambio de inclinación, sin contentPadding`, por `expect(received).toEqual(expected)`.

   El centinela `#60 R1: … › #60 R1: en Android pinta GoogleMaps.View y nunca AppleMaps.View` queda **verde**: es lo esperado, y la sonda `always_apple` prueba que no es decorativo. Los `it` existentes siguen verdes con `setPlatform('android')`.
3. Commit rojo:

   ```bash
   git add src/components/__tests__/pet-map.test.tsx
   git commit -m "test(mobile): expect Apple Maps on iOS in PetMap (R1)"
   ```

### (2) Verde

En §R1 y R2 — Verde común, tras el rojo de R2.

### (3) Refactor

Ninguno. Los literales de la cámara, los marcadores y `uiSettings` se repiten
a propósito: cada `it` se lee solo. No los extraigas a una constante.

## R2 — En iOS, el tab Map monta el mapa de Apple en la última posición

### (1) Rojo

En el test del mapa, cuatro cambios:

1. En los imports del principio del fichero, sustituye esta línea (el bloque aparece una sola vez; `grep -cxF "import { useEffect, type ReactNode } from 'react';" src/screens/map/index.test.tsx` da 1):

```tsx
import { useEffect, type ReactNode } from 'react';
```

por estas 2:

```tsx
import { useEffect, type ReactNode } from 'react';
import { Platform } from 'react-native';
```

2. Dentro de `jest.mock('expo-maps', () => {`, en su `return {`, sustituye estas 2 líneas (el bloque aparece una sola vez; `grep -cxF '    __esModule: true,' src/screens/map/index.test.tsx` da 1):

```tsx
    __esModule: true,
    GoogleMaps: {
```

por estas 10:

```tsx
    __esModule: true,
    AppleMaps: {
      View: stub,
      MapColorScheme: {
        AUTOMATIC: 'AUTOMATIC',
        LIGHT: 'LIGHT',
        DARK: 'DARK',
      },
    },
    GoogleMaps: {
```

   `stub` es el que ya declara ese mock; `GoogleMaps` y su `MapColorScheme` no
   cambian.

3. En el `beforeEach` de nivel superior (sus dos primeras líneas), sustituye estas 2 líneas (el bloque aparece una sola vez; `grep -cxF 'beforeEach(() => {' src/screens/map/index.test.tsx` da 1):

```tsx
beforeEach(() => {
  jest.clearAllMocks();
```

por estas 13:

```tsx
const originalPlatform = Platform.OS;

function setPlatform(os: string): void {
  Object.defineProperty(Platform, 'OS', { configurable: true, value: os });
}

afterEach(() => {
  setPlatform(originalPlatform);
});

beforeEach(() => {
  setPlatform('android');
  jest.clearAllMocks();
```

   El resto de ese `beforeEach` no cambia.

4. Al final del fichero, que termina en `});`, añade una línea en blanco y este bloque:

```tsx
describe('#60 R2: en iOS el tab Map monta el mapa de Apple con la última posición', () => {
  beforeEach(() => {
    setPlatform('ios');
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition({ lat: 19.45, lng: -99.12 }),
    });
  });

  it('#60 R2: centra el mapa de Apple en la última posición y oculta sus controles de ubicación e inclinación', async () => {
    await renderMap();

    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());
    expect(screen.getByTestId('map-view').props).toEqual(
      expect.objectContaining({
        cameraPosition: {
          coordinates: { latitude: 19.45, longitude: -99.12 },
          zoom: 16,
        },
        markers: [
          {
            id: 'last-position',
            coordinates: { latitude: 19.45, longitude: -99.12 },
          },
        ],
        polylines: [],
        style: { flex: 1 },
        colorScheme: 'LIGHT',
        uiSettings: {
          myLocationButtonEnabled: false,
          togglePitchEnabled: false,
        },
      }),
    );
  });
});
```


Después:

1. `git hash-object src/screens/map/index.test.tsx` da `906220e8b390b419ad3e8a3d9e864edc8d5d284e` (1580 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/screens/map/index.test.tsx > /tmp/60_r2.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_r2.log
   ```

   Esperado: `Tests:` 1 failed, 58 passed, 59 total; `Test Suites:` 1 failed, 1 total; `exit=1`. Los rojos, todos **por aserción**:

   - `#60 R2: en iOS el tab Map monta el mapa de Apple con la última posición › #60 R2: centra el mapa de Apple en la última posición y oculta sus controles de ubicación e inclinación`, por `expect(received).toEqual(expected)`.
3. Commit rojo:

   ```bash
   git add src/screens/map/index.test.tsx
   git commit -m "test(mobile): expect the map tab to mount Apple Maps on iOS (R2)"
   ```

### (2) Verde

En §R1 y R2 — Verde común.

### (3) Refactor

Ninguno.

## R1 y R2 — Verde común

1. Sustituye el contenido **entero** de `PetMap` por este bloque. Conserva
   `MAP_ZOOM`, la firma y la rama de Google tal cual; añade la rama de iOS, leída
   en render ([[design]] §D1–§D3):

```tsx
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform } from 'react-native';

import { useThemeColors } from '../theme/use-theme-colors';

export type MapCoordinates = { latitude: number; longitude: number };
export type MapPolyline = { id: string; coordinates: MapCoordinates[] };
export type PetMapProps = {
  center: MapCoordinates;
  marker: MapCoordinates | null;
  polylines: MapPolyline[];
  colorScheme: 'light' | 'dark';
};

export const MAP_ZOOM = 16;

export function PetMap(props: PetMapProps) {
  const [polylineColor] = useThemeColors(['accent-strong']);
  const mapViewProps = {
    testID: 'map-view',
    style: { flex: 1 },
    cameraPosition: {
      coordinates: props.center,
      zoom: MAP_ZOOM,
    },
    markers: props.marker
      ? [{ id: 'last-position', coordinates: props.marker }]
      : [],
    polylines: props.polylines.map((polyline) => ({
      ...polyline,
      color: polylineColor,
    })),
  };

  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        {...mapViewProps}
        colorScheme={
          props.colorScheme === 'dark'
            ? AppleMaps.MapColorScheme.DARK
            : AppleMaps.MapColorScheme.LIGHT
        }
        uiSettings={{ myLocationButtonEnabled: false, togglePitchEnabled: false }}
      />
    );
  }

  return (
    <GoogleMaps.View
      {...mapViewProps}
      colorScheme={
        props.colorScheme === 'dark'
          ? GoogleMaps.MapColorScheme.DARK
          : GoogleMaps.MapColorScheme.LIGHT
      }
      uiSettings={{ zoomControlsEnabled: false }}
    />
  );
}
```

   No toques `src/screens/map/index.tsx`: ya pasa a `PetMap` todo lo que
   necesita ([[requirements]] R10.6).

Después:

1. `git hash-object src/components/pet-map.tsx` da `5801249b877e4cdb6fdc885b90da1c1ce5a735bb` (60 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/components/__tests__/pet-map.test.tsx src/screens/map/index.test.tsx > /tmp/60_g12.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_g12.log
   ```

   Esperado: `Tests:` 72 passed, 72 total; `Test Suites:` 2 passed, 2 total; `exit=0`. Por fichero: `src/components/__tests__/pet-map.test.tsx` 13 verdes, `src/screens/map/index.test.tsx` 59 verdes.
3. Commit verde:

   ```bash
   git add src/components/pet-map.tsx
   git commit -m "feat(mobile): render Apple Maps on iOS in PetMap (R1,R2)"
   ```

### (3) Refactor

Ninguno. No extraigas la rama de Apple a otro componente ni a otro fichero
([[design]] §D1).

## R3 — El selector de fotos pide la representación compatible (JPEG, no HEIC)

### (1) Rojo

Cuatro cambios, dos por test:

1. En el test del alta, en el mock de `expo-image-picker`, sustituye estas 3 líneas (el bloque aparece una sola vez; `grep -cxF "jest.mock('expo-image-picker', () => ({" src/screens/add-pet/index.test.tsx` da 1):

```tsx
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));
```

por estas 8:

```tsx
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  UIImagePickerPreferredAssetRepresentationMode: {
    Automatic: 'automatic',
    Compatible: 'compatible',
    Current: 'current',
  },
}));
```

2. En el test del alta, `grep -c "^describe('R7: foto opcional tras alta'" src/screens/add-pet/index.test.tsx`
   da 1. Ese `describe` termina con el `  });` de su último `it` y el `});` que
   lo cierra; debajo vienen una línea en blanco y
   `describe('R1 (mobile-jest-mock-hygiene)…`. **Entre ese `  });` y ese
   `});`** inserta una línea en blanco y este bloque (`renderAddPet`,
   `pressPickPhoto` y `mockLaunchImageLibrary` ya existen en el fichero):

```tsx
  it('#60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC', async () => {
    await renderAddPet();

    await pressPickPhoto();

    expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1);
    expect(mockLaunchImageLibrary).toHaveBeenCalledWith({
      mediaTypes: ['images'],
      quality: 0.8,
      preferredAssetRepresentationMode: 'compatible',
    });
  });
```

3. En el test del perfil, en el mock de `expo-image-picker` (este lleva `{ virtual: true }` y lo conserva), sustituye estas 3 líneas (el bloque aparece una sola vez; `grep -cxF "jest.mock('expo-image-picker', () => ({" src/screens/profile/index.test.tsx` da 1):

```tsx
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}), { virtual: true });
```

por estas 8:

```tsx
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  UIImagePickerPreferredAssetRepresentationMode: {
    Automatic: 'automatic',
    Compatible: 'compatible',
    Current: 'current',
  },
}), { virtual: true });
```

4. En el test del perfil, `grep -c "^describe('R7: cambiar foto'" src/screens/profile/index.test.tsx`
   da 1. Igual que en el alta: al final de ese `describe`, **entre** el `  });`
   de su último `it` y el `});` que lo cierra (debajo vienen una línea en
   blanco y `describe('R8: navegación a docs'…`), inserta una línea en blanco
   y este bloque (`renderProfile`, `screen`, `waitFor`, `fireEvent` y
   `mockLaunchImageLibrary` ya existen en el fichero):

```tsx
  it('#60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC', async () => {
    await renderProfile();
    await waitFor(() => expect(screen.getByTestId('change-photo')).toBeVisible());

    await fireEvent.press(screen.getByTestId('change-photo'));

    expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1);
    expect(mockLaunchImageLibrary).toHaveBeenCalledWith({
      mediaTypes: ['images'],
      quality: 0.8,
      preferredAssetRepresentationMode: 'compatible',
    });
  });
```


Después:

1. `git hash-object src/screens/add-pet/index.test.tsx` da `62971928b8891ae1971e23dd080638a7d57863a2` (572 líneas) y `git hash-object src/screens/profile/index.test.tsx` da `b52c4b440f37c42c5c9d55a7a4c1cd75ceaa1764` (1065 líneas). Si alguno no coincide, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx src/screens/profile/index.test.tsx > /tmp/60_r3.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_r3.log
   ```

   Esperado: `Tests:` 2 failed, 62 passed, 64 total; `Test Suites:` 2 failed, 2 total; `exit=1`. Por fichero: `src/screens/add-pet/index.test.tsx` 25 (1 rojo), `src/screens/profile/index.test.tsx` 39 (1 rojo). Los rojos, todos **por aserción**:

   - `R7: foto opcional tras alta › #60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC`, por `expect(jest.fn()).toHaveBeenCalledWith(...expected)`;
   - `R7: cambiar foto › #60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC`, por `expect(jest.fn()).toHaveBeenCalledWith(...expected)`.
3. Commit rojo:

   ```bash
   git add src/screens/add-pet/index.test.tsx src/screens/profile/index.test.tsx
   git commit -m "test(mobile): expect the compatible asset representation from the photo picker (R3)"
   ```

### (2) Verde

1. En el alta, dentro de `async function handlePickPhoto()`, sustituye estas 3 líneas (el bloque aparece una sola vez; `grep -cxF '    const picked = await ImagePicker.launchImageLibraryAsync({' src/screens/add-pet/index.tsx` da 1):

```tsx
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
```

por estas 5:

```tsx
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
```

2. En el perfil, dentro de `async function handleChangePhoto()`, el mismo cambio, sustituye estas 3 líneas (el bloque aparece una sola vez; `grep -cxF '    const picked = await ImagePicker.launchImageLibraryAsync({' src/screens/profile/index.tsx` da 1):

```tsx
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
```

por estas 5:

```tsx
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
```

   Nada más: `ImagePicker` ya está importado como espacio de nombres en los
   dos ficheros, `src/api/media.ts` no cambia y no hay copy nueva
   ([[design]] §D14).

Después:

1. `git hash-object src/screens/add-pet/index.tsx` da `e02a048d9e22700d4b93797356b32671c7408aab` (450 líneas) y `git hash-object src/screens/profile/index.tsx` da `ef3e7362a0d451f9965332666a7faeca79de92c3` (412 líneas). Si alguno no coincide, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx src/screens/profile/index.test.tsx > /tmp/60_g3.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_g3.log
   ```

   Esperado: `Tests:` 64 passed, 64 total; `Test Suites:` 2 passed, 2 total; `exit=0`. Por fichero: `src/screens/add-pet/index.test.tsx` 25 verdes, `src/screens/profile/index.test.tsx` 39 verdes.
3. Commit verde:

   ```bash
   git add src/screens/add-pet/index.tsx src/screens/profile/index.tsx
   git commit -m "feat(mobile): ask the photo picker for JPEG instead of HEIC on iOS (R3)"
   ```

### (3) Refactor

Ninguno. No extraigas las opciones del selector a una constante compartida:
son dos llamadas en dos pantallas, y las sondas `current_addpet` y
`current_profile` miden cada una por separado.

## R4 — `app.json` declara la identidad de iOS

### (1) Rojo

1. En el test de config. Al final del fichero, que termina en `});`, añade una línea en blanco y este bloque:

```ts
describe('#60 R4: app.json declara la identidad de iOS', () => {
  it('#60 R4: fija bundleIdentifier, deploymentTarget 17.0 y cifrado exento sin tocar el icono', () => {
    expect(appJson.expo.ios).toEqual({
      icon: './assets/expo.icon',
      bundleIdentifier: 'com.trackermex.pettracker',
      deploymentTarget: '17.0',
      config: { usesNonExemptEncryption: false },
    });
  });
});
```


Después:

1. `git hash-object app.config.test.ts` da `6249908e3762e644f296d5777b28f139cd794254` (302 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath app.config.test.ts > /tmp/60_r4.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_r4.log
   ```

   Esperado: `Tests:` 1 failed, 13 passed, 14 total; `Test Suites:` 1 failed, 1 total; `exit=1`. Los rojos, todos **por aserción**:

   - `#60 R4: app.json declara la identidad de iOS › #60 R4: fija bundleIdentifier, deploymentTarget 17.0 y cifrado exento sin tocar el icono`, por `expect(received).toEqual(expected)`.
3. Commit rojo:

   ```bash
   git add app.config.test.ts
   git commit -m "test(mobile): expect the iOS identity in app.json (R4)"
   ```

### (2) Verde

1. En `app.json`, en el objeto `ios`, sustituye estas 3 líneas (el bloque aparece una sola vez; `grep -cxF '    "ios": {' app.json` da 1):

```json
    "ios": {
      "icon": "./assets/expo.icon"
    },
```

por estas 8:

```json
    "ios": {
      "icon": "./assets/expo.icon",
      "bundleIdentifier": "com.trackermex.pettracker",
      "deploymentTarget": "17.0",
      "config": {
        "usesNonExemptEncryption": false
      }
    },
```


Después:

1. `git hash-object app.json` da `aaea2439a1419ac7235b69976236f3a8c7056bab` (65 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath app.config.test.ts > /tmp/60_g4.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_g4.log
   ```

   Esperado: `Tests:` 14 passed, 14 total; `Test Suites:` 1 passed, 1 total; `exit=0`.
3. Commit verde:

   ```bash
   git add app.json
   git commit -m "feat(mobile): declare the iOS bundle identifier, deployment target and exempt encryption (R4)"
   ```

### (3) Refactor

Ninguno.

## R5 — Solo el permiso de galería, en español

### (1) Rojo

1. En el test de config, dentro de
   `describe('#79 R2: app.json declara el plugin de notificaciones y POST_NOTIFICATIONS'`,
   en `it('conserva los plugins existentes y añade expo-notifications'`, sustituye esta línea (el bloque aparece una sola vez; `grep -cxF "    expect(expo.plugins).toContain('expo-secure-store');" app.config.test.ts` da 1):

```ts
    expect(expo.plugins).toContain('expo-secure-store');
```

por esta:

```ts
    // #60 R5: expo-secure-store pasa a tupla con faceIDPermission: false; la candan los it de #60 R5.
```

   Es la **única** línea de un `it` existente que cambia en toda la feature
   (R10.2): con la tupla, el `toContain` de la cadena fallaría. El resto de
   ese `it` no cambia.

2. Al final del fichero, que termina en `});`, añade una línea en blanco y este bloque:

```ts
describe('#60 R5: app.json deja solo el permiso de galería, en español', () => {
  const plugins = appJson.expo.plugins as unknown[];

  it('#60 R5: declara expo-image-picker con el texto de galería y sin cámara ni micrófono', () => {
    expect(plugins).toContainEqual([
      'expo-image-picker',
      {
        photosPermission:
          'Se usa para elegir de tu galería la foto de perfil de tu mascota.',
        cameraPermission: false,
        microphonePermission: false,
      },
    ]);
  });

  it('#60 R5: declara expo-secure-store sin Face ID y una sola vez por plugin', () => {
    expect(plugins).toContainEqual([
      'expo-secure-store',
      { faceIDPermission: false },
    ]);
    expect(plugins).not.toContain('expo-secure-store');
    expect(
      plugins.map((plugin) => (Array.isArray(plugin) ? plugin[0] : plugin)),
    ).toEqual([
      'expo-router',
      'expo-splash-screen',
      'expo-secure-store',
      'expo-notifications',
      'expo-image-picker',
    ]);
  });
});
```


Después:

1. `git hash-object app.config.test.ts` da `3fcac57b8bac3149171539a5dc3d59a4a25493d2` (335 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath app.config.test.ts > /tmp/60_r5.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_r5.log
   ```

   Esperado: `Tests:` 2 failed, 14 passed, 16 total; `Test Suites:` 1 failed, 1 total; `exit=1`. Los rojos, todos **por aserción**:

   - `#60 R5: app.json deja solo el permiso de galería, en español › #60 R5: declara expo-image-picker con el texto de galería y sin cámara ni micrófono`, por `expect(received).toContainEqual(expected)`;
   - `#60 R5: app.json deja solo el permiso de galería, en español › #60 R5: declara expo-secure-store sin Face ID y una sola vez por plugin`, por `expect(received).toContainEqual(expected)`.

   El `it` enmendado de `#79 R2` queda **verde**: solo perdió una aserción.
3. Commit rojo:

   ```bash
   git add app.config.test.ts
   git commit -m "test(mobile): expect only the Spanish gallery permission and amend #79 R2 (R5)"
   ```

### (2) Verde

En `app.json`, dentro de `"plugins"`, dos cambios:

1. La entrada de `expo-secure-store`, sustituye esta línea (el bloque aparece una sola vez; `grep -cxF '      "expo-secure-store",' app.json` da 1):

```json
      "expo-secure-store",
```

por estas 6:

```json
      [
        "expo-secure-store",
        {
          "faceIDPermission": false
        }
      ],
```

2. El final del array, tras la tupla de `expo-notifications`, sustituye estas 4 líneas (el bloque aparece una sola vez; `grep -cxF '          "defaultChannel": "default"' app.json` da 1):

```json
          "defaultChannel": "default"
        }
      ]
    ],
```

por estas 12:

```json
          "defaultChannel": "default"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Se usa para elegir de tu galería la foto de perfil de tu mascota.",
          "cameraPermission": false,
          "microphonePermission": false
        }
      ]
    ],
```

   Los permisos se quitan por la configuración de los plugins, no por
   `infoPlist` ni por `android.blockedPermissions` ([[design]] §D5).


Después:

1. `git hash-object app.json` da `0d35cce92271599325aa97ad8e6c5d105c6e0962` (78 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath app.config.test.ts > /tmp/60_g5.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_g5.log
   ```

   Esperado: `Tests:` 16 passed, 16 total; `Test Suites:` 1 passed, 1 total; `exit=0`.
3. Commit verde:

   ```bash
   git add app.json
   git commit -m "feat(mobile): keep only the gallery permission and drop camera, microphone and Face ID (R5)"
   ```

### (3) Refactor

Ninguno.

## R6 — `RESET_LINK_HOST` declara el dominio asociado de iOS

### (1) Rojo

1. En el test de config. Al final del fichero, que termina en `});`, añade una línea en blanco y este bloque:

```ts
describe('#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS', () => {
  const originalApiKey = process.env.GOOGLE_MAPS_API_KEY_ANDROID;
  const originalResetLinkHost = process.env.RESET_LINK_HOST;
  let warnSpy: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();

    if (originalApiKey === undefined) {
      delete process.env.GOOGLE_MAPS_API_KEY_ANDROID;
    } else {
      process.env.GOOGLE_MAPS_API_KEY_ANDROID = originalApiKey;
    }

    if (originalResetLinkHost === undefined) {
      delete process.env.RESET_LINK_HOST;
    } else {
      process.env.RESET_LINK_HOST = originalResetLinkHost;
    }
  });

  it.each([
    ['con clave de mapas y google-services.json', 'maps-test-key', true],
    ['sin clave de mapas ni google-services.json (builder de EAS)', undefined, false],
  ])('#60 R6: %s, añade applinks del host recortado a ios', (_case, apiKey, hasGoogleServices) => {
    if (apiKey === undefined) {
      delete process.env.GOOGLE_MAPS_API_KEY_ANDROID;
    } else {
      process.env.GOOGLE_MAPS_API_KEY_ANDROID = apiKey;
    }
    process.env.RESET_LINK_HOST = '  reset.example.test  ';
    mockExistsSync.mockReturnValue(hasGoogleServices);

    const resolved = resolveConfig({
      config: appJson.expo,
    } as unknown as ConfigContext);

    expect(resolved.ios).toEqual({
      icon: './assets/expo.icon',
      bundleIdentifier: 'com.trackermex.pettracker',
      deploymentTarget: '17.0',
      config: { usesNonExemptEncryption: false },
      associatedDomains: ['applinks:reset.example.test'],
    });
  });
});
```


Después:

1. `git hash-object app.config.test.ts` da `ad4abdf12cc2bb7fe2dd18d4443ddf41c53a780c` (386 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath app.config.test.ts > /tmp/60_r6.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_r6.log
   ```

   Esperado: `Tests:` 2 failed, 16 passed, 18 total; `Test Suites:` 1 failed, 1 total; `exit=1`. Los rojos, todos **por aserción**:

   - `#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: con clave de mapas y google-services.json, añade applinks del host recortado a ios`, por `expect(received).toEqual(expected)`;
   - `#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios`, por `expect(received).toEqual(expected)`.
3. Commit rojo:

   ```bash
   git add app.config.test.ts
   git commit -m "test(mobile): expect associatedDomains from RESET_LINK_HOST (R6)"
   ```

### (2) Verde

1. En `app.config.ts`, dentro del objeto que devuelve `resolveConfig`, sustituye estas 2 líneas (el bloque aparece una sola vez; `grep -cxF '    ...resolvedConfig,' app.config.ts` da 1):

```ts
    ...resolvedConfig,
    android: {
```

por estas 10:

```ts
    ...resolvedConfig,
    ...(resetLinkHost
      ? {
          ios: {
            ...resolvedConfig.ios,
            associatedDomains: [`applinks:${resetLinkHost}`],
          },
        }
      : {}),
    android: {
```

   `resetLinkHost` ya es la variable recortada que usa la rama de Android. El
   spread va **después** del cortocircuito sin clave de mapas ni
   `google-services.json` y **no depende** de ellos: el builder de EAS de iOS
   no tiene ninguno de los dos ([[design]] §D6).


Después:

1. `git hash-object app.config.ts` da `8ec55edabe9458ecea0d2eb068359a5c050b04d0` (89 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath app.config.test.ts > /tmp/60_g6.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_g6.log
   ```

   Esperado: `Tests:` 18 passed, 18 total; `Test Suites:` 1 passed, 1 total; `exit=0`.
3. Commit verde:

   ```bash
   git add app.config.ts
   git commit -m "feat(mobile): declare the iOS associated domain from RESET_LINK_HOST (R6)"
   ```

### (3) Refactor

Ninguno. No cambies el orden de las claves del objeto.

## R7 — Sin `RESET_LINK_HOST`, iOS queda sin dominio asociado y el aviso lo dice

### (1) Rojo

1. En el test de config. Al final del fichero, que termina en `});`, añade una línea en blanco y este bloque:

```ts
describe('#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice', () => {
  const originalApiKey = process.env.GOOGLE_MAPS_API_KEY_ANDROID;
  const originalResetLinkHost = process.env.RESET_LINK_HOST;
  let warnSpy: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    process.env.GOOGLE_MAPS_API_KEY_ANDROID = 'maps-test-key';
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();

    if (originalApiKey === undefined) {
      delete process.env.GOOGLE_MAPS_API_KEY_ANDROID;
    } else {
      process.env.GOOGLE_MAPS_API_KEY_ANDROID = originalApiKey;
    }

    if (originalResetLinkHost === undefined) {
      delete process.env.RESET_LINK_HOST;
    } else {
      process.env.RESET_LINK_HOST = originalResetLinkHost;
    }
  });

  it.each([
    ['ausente', undefined],
    ['vacío', ''],
    ['solo espacios', '   '],
  ])('#60 R7: con un host %s no declara associatedDomains y avisa una vez por Android e iOS', (_case, resetLinkHost) => {
    if (resetLinkHost === undefined) {
      delete process.env.RESET_LINK_HOST;
    } else {
      process.env.RESET_LINK_HOST = resetLinkHost;
    }

    const resolved = resolveConfig({
      config: appJson.expo,
    } as unknown as ConfigContext);

    expect(resolved.ios).toEqual({
      icon: './assets/expo.icon',
      bundleIdentifier: 'com.trackermex.pettracker',
      deploymentTarget: '17.0',
      config: { usesNonExemptEncryption: false },
    });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const warning = warnSpy.mock.calls[0]?.[0];
    for (const fragment of [
      'RESET_LINK_HOST',
      'Android',
      'App Links',
      'iOS',
      'associatedDomains',
      'Universal Links',
      'docs/verification.md',
      '§Feature 59 — auth-reset-deep-link',
      '§Feature 60 — mobile-ios-support',
    ]) {
      expect(warning).toEqual(expect.stringContaining(fragment));
    }
  });
});
```


Después:

1. `git hash-object app.config.test.ts` da `1426e188781303134757416605b4e3c07f16932f` (451 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath app.config.test.ts > /tmp/60_r7.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_r7.log
   ```

   Esperado: `Tests:` 3 failed, 18 passed, 21 total; `Test Suites:` 1 failed, 1 total; `exit=1`. Los rojos, todos **por aserción**:

   - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host ausente no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`;
   - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host vacío no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`;
   - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host solo espacios no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`.
3. Commit rojo:

   ```bash
   git add app.config.test.ts
   git commit -m "test(mobile): expect the RESET_LINK_HOST warning to cover iOS (R7)"
   ```

### (2) Verde

1. En `app.config.ts`, dentro del único `console.warn(`, el texto del aviso, sustituye esta línea (el bloque aparece una sola vez; `grep -cxF "      'RESET_LINK_HOST no está definida; el build de Android quedará sin intent filters de App Links. Consulta docs/verification.md §Feature 59 — auth-reset-deep-link.'," app.config.ts` da 1):

```ts
      'RESET_LINK_HOST no está definida; el build de Android quedará sin intent filters de App Links. Consulta docs/verification.md §Feature 59 — auth-reset-deep-link.',
```

por esta:

```ts
      'RESET_LINK_HOST no está definida; el build de Android quedará sin intent filters de App Links y el de iOS sin associatedDomains de Universal Links. Consulta docs/verification.md §Feature 59 — auth-reset-deep-link y §Feature 60 — mobile-ios-support.',
```

   Sigue habiendo **un solo** `console.warn(` ([[design]] §D7).


Después:

1. `git hash-object app.config.ts` da `e417003de04b00c5f4ac108ee9f56ef976abd428` (89 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath app.config.test.ts > /tmp/60_g7.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_g7.log
   ```

   Esperado: `Tests:` 21 passed, 21 total; `Test Suites:` 1 passed, 1 total; `exit=0`.
3. Commit verde:

   ```bash
   git add app.config.ts
   git commit -m "feat(mobile): warn that iOS loses Universal Links without RESET_LINK_HOST (R7)"
   ```

### (3) Refactor

Ninguno.

## R8 — El AASA delega `/reset-password` en la app de iOS

### (1) Rojo

En el test de hosting, dos cambios:

1. En el import de `node:fs`, sustituye esta línea (el bloque aparece una sola vez; `grep -cxF "import { readFileSync } from 'node:fs';" src/__tests__/hosting-artifacts.test.ts` da 1):

```ts
import { readFileSync } from 'node:fs';
```

por esta:

```ts
import { existsSync, readFileSync } from 'node:fs';
```

2. Al final del fichero, que termina en `});`, añade una línea en blanco y este bloque:

```ts
describe('#60 R8: apple-app-site-association delega /reset-password en la app de iOS', () => {
  const aasaPath = join(hostingRoot, '.well-known', 'apple-app-site-association');

  it('#60 R8: publica un único detalle para el App ID de iOS y solo la ruta de reset', () => {
    expect(existsSync(aasaPath)).toBe(true);
    const aasa = JSON.parse(readFileSync(aasaPath, 'utf8')) as {
      applinks: { details: { appIDs: string[]; components: unknown[] }[] };
    };

    expect(Object.keys(aasa)).toEqual(['applinks']);
    expect(Object.keys(aasa.applinks)).toEqual(['details']);
    expect(aasa.applinks.details).toHaveLength(1);
    expect(Object.keys(aasa.applinks.details[0] ?? {})).toEqual(['appIDs', 'components']);
    expect(aasa.applinks.details[0]?.appIDs).toHaveLength(1);
    expect(aasa.applinks.details[0]?.appIDs[0]).toMatch(
      /^(?:REPLACE_WITH_APPLE_TEAM_ID|[A-Z0-9]{10})\.com\.trackermex\.pettracker$/,
    );
    expect(aasa.applinks.details[0]?.components).toEqual([
      { '/': '/reset-password*' },
    ]);
  });

  it('#60 R8: fuerza application/json solo para el fichero sin extensión', () => {
    const htaccessPath = join(hostingRoot, '.well-known', '.htaccess');

    expect(existsSync(htaccessPath)).toBe(true);
    expect(
      readFileSync(htaccessPath, 'utf8')
        .trim()
        .split('\n')
        .map((line) => line.trim()),
    ).toEqual([
      '<Files "apple-app-site-association">',
      'ForceType application/json',
      '</Files>',
    ]);
  });
});
```


Después:

1. `git hash-object src/__tests__/hosting-artifacts.test.ts` da `451ee2c09be998254b887f6dc55eca614f3f5dfb` (156 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/__tests__/hosting-artifacts.test.ts > /tmp/60_r8.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_r8.log
   ```

   Esperado: `Tests:` 2 failed, 7 passed, 9 total; `Test Suites:` 1 failed, 1 total; `exit=1`. Los rojos, todos **por aserción**:

   - `#60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: publica un único detalle para el App ID de iOS y solo la ruta de reset`, por `expect(received).toBe(expected)`;
   - `#60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: fuerza application/json solo para el fichero sin extensión`, por `expect(received).toBe(expected)`.
3. Commit rojo:

   ```bash
   git add src/__tests__/hosting-artifacts.test.ts
   git commit -m "test(mobile): expect the apple-app-site-association and its .htaccess (R8)"
   ```

### (2) Verde

1. Crea el AASA, **sin extensión**, con este contenido:

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["REPLACE_WITH_APPLE_TEAM_ID.com.trackermex.pettracker"],
        "components": [{ "/": "/reset-password*" }]
      }
    ]
  }
}
```

   `REPLACE_WITH_APPLE_TEAM_ID` **se queda**: el Team ID lo pone el humano en
   R11, como se hizo con el fingerprint de #59 ([[design]] §D9). No lo
   sustituyas aunque lo conozcas.

2. Crea `../hosting/.well-known/.htaccess` con este contenido:

```apache
<Files "apple-app-site-association">
  ForceType application/json
</Files>
```

   `<Files>` limita el tipo al AASA: `assetlinks.json` sigue con el suyo
   ([[design]] §D8). Ningún `.gitignore` oculta los dos ficheros:
   `git status --porcelain ../hosting` los lista como `??` antes del `add`.


Después:

1. `git hash-object ../hosting/.well-known/apple-app-site-association` da `862b64580ea871d3d20ea11507c047e327c20ed4` (10 líneas) y `git hash-object ../hosting/.well-known/.htaccess` da `325926fa08861a4fdb377665512cbee4e158084e` (3 líneas). Si alguno no coincide, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/__tests__/hosting-artifacts.test.ts > /tmp/60_g8.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_g8.log
   ```

   Esperado: `Tests:` 9 passed, 9 total; `Test Suites:` 1 passed, 1 total; `exit=0`.
3. Commit verde:

   ```bash
   git add ../hosting/.well-known/apple-app-site-association ../hosting/.well-known/.htaccess
   git commit -m "feat(hosting): publish the apple-app-site-association for /reset-password (R8)"
   ```

### (3) Refactor

Ninguno.

## R9 — La guía de iOS y la variable de EAS quedan documentadas

### (1) Rojo

1. En el test de hosting. Al final del fichero, que termina en `});`, añade una línea en blanco y este bloque:

```ts
describe('#60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas', () => {
  it('#60 R9: documenta los gates de iOS en la sección Feature 60', () => {
    const verification = readRepositoryFile('docs', 'verification.md');
    const feature60 =
      verification
        .split('### Feature 60 — mobile-ios-support')[1]
        ?.split(/^### Feature /m)[0] ?? '';

    for (const fragment of [
      'Dev build de iOS vía EAS',
      'bunx eas-cli@latest device:create',
      'bunx eas-cli@latest env:set',
      '--visibility plaintext',
      'bunx eas-cli@latest build -p ios --profile development',
      'REPLACE_WITH_APPLE_TEAM_ID',
      'curl -fsSI',
      'Content-Type: application/json',
      'bunx expo start --dev-client',
      'progress/impl_mobile-ios-support.md',
    ]) {
      expect(feature60).toContain(fragment);
    }
    expect(feature60).not.toMatch(/--visibility secret/);
  });

  it('#60 R9: el README de hosting explica el AASA, su .htaccess y el Team ID, y AGENTS.md lo nombra', () => {
    const readme = readRepositoryFile('hosting', 'README.md');
    const hostingRow =
      readRepositoryFile('AGENTS.md')
        .split('\n')
        .find((line) => line.startsWith('| `hosting/` |')) ?? '';

    for (const fragment of [
      'apple-app-site-association',
      '.htaccess',
      'REPLACE_WITH_APPLE_TEAM_ID',
      '§Feature 60',
    ]) {
      expect(readme).toContain(fragment);
    }
    expect(hostingRow).toContain('apple-app-site-association');
  });

  it('#60 R9: la fila de RESET_LINK_HOST y el .env.example móvil nombran la variable de EAS', () => {
    const row =
      readRepositoryFile('docs', 'conventions.md')
        .split('\n')
        .find((line) => line.startsWith('| `RESET_LINK_HOST` |')) ?? '';
    const example = readRepositoryFile('mobile-pet-tracker', '.env.example');

    expect(row).toContain('EAS');
    expect(row).toContain('`development`');
    expect(row).toContain('`plaintext`');
    expect(example).toContain('EAS');
    expect(example).toContain('§Feature 60');
  });
});
```


Después:

1. `git hash-object src/__tests__/hosting-artifacts.test.ts` da `8abaacbfc7f218c9f353a67a3dac77d41ea73913` (214 líneas). Si no, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/__tests__/hosting-artifacts.test.ts > /tmp/60_r9.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_r9.log
   ```

   Esperado: `Tests:` 3 failed, 9 passed, 12 total; `Test Suites:` 1 failed, 1 total; `exit=1`. Los rojos, todos **por aserción**:

   - `#60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: documenta los gates de iOS en la sección Feature 60`, por `expect(received).toContain(expected)`;
   - `#60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: el README de hosting explica el AASA, su .htaccess y el Team ID, y AGENTS.md lo nombra`, por `expect(received).toContain(expected)`;
   - `#60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: la fila de RESET_LINK_HOST y el .env.example móvil nombran la variable de EAS`, por `expect(received).toContain(expected)`.
3. Commit rojo:

   ```bash
   git add src/__tests__/hosting-artifacts.test.ts
   git commit -m "test(mobile): expect the iOS guide and the RESET_LINK_HOST EAS variable documented (R9)"
   ```

### (2) Verde

Cinco cambios de documentación, sin código:

1. En la guía, `grep -c '^### Feature 79 — mobile-push-registration' ../docs/verification.md`
   da 1, y la línea de encima está en blanco. **Entre esa línea en blanco y
   el encabezado de #79**, inserta lo de dentro de este bloque seguido de una
   línea en blanco, de modo que la sección de #60 quede separada por una
   línea en blanco de la que la precede y de la de #79 ([[design]] §D11). La
   sección de #59 no cambia:

````md
### Feature 60 — mobile-ios-support

Dev build de iOS vía EAS. No hay Mac ni simulador de iOS: el build de
desarrollo lo compila EAS Build en la nube y se instala en un iPhone físico
con iOS 18 o superior. Estos gates los ejecuta una persona, en orden, desde
PowerShell en `mobile-pet-tracker/`. Ninguna IA ejecuta `eas build`,
`eas credentials`, `eas device:create` ni `eas env:set`, ni toca la clave
`.p8` de APNs, certificados o perfiles de aprovisionamiento: los genera y los
guarda EAS. Nunca copies al reporte el dominio real, el Team ID, UDIDs,
correos, contraseñas ni tokens.

Supuestos de entorno, todos obligatorios:

- PC con Windows; los comandos van con `bunx`, nunca con `npx`. En
  PowerShell escribe `curl.exe` donde este texto dice `curl`: `curl` a secas
  es un alias de `Invoke-WebRequest`.
- El iPhone y el PC están en la misma red Wi-Fi.
- El Firewall de Windows admite conexiones entrantes a los puertos 8081
  (Metro) y 3000 (backend) en la red privada.
- Backend y LocalStack levantados, y `mobile-pet-tracker/.env` con
  `EXPO_PUBLIC_API_URL=http://<IP LAN del PC>:3000/v1`.
- El `.env` gitignoreado de la raíz con `EMAIL_ENABLED=true` y las
  credenciales de Resend de §Feature 58 G2, el mismo `RESET_LINK_HOST` de
  §Feature 59 G3, y `PUSH_ENABLED=true` y `NOTIFIER_ENABLED=true` para que el
  notifier mande el push real por Expo. Reinicia el backend tras cambiarlo.
- Modo de desarrollador activado en el iPhone (Ajustes → Privacidad y
  seguridad → Modo de desarrollador). iOS solo muestra el interruptor tras
  instalar el primer build interno, y al activarlo reinicia.
- Al abrir el dev build, iOS pregunta si la app puede buscar dispositivos en
  la red local: acéptalo. Sin ese permiso el dev client no encuentra Metro.

1. **I1 — registrar el iPhone en EAS.**

   ```bash
   bunx eas-cli@latest login
   bunx eas-cli@latest device:create
   ```

   Abre en el iPhone la URL o el QR que imprime `device:create` e instala el
   perfil que ofrece. Un build interno solo se instala en los dispositivos
   registrados antes de compilarlo.

2. **I2 — declarar `RESET_LINK_HOST` en EAS.**

   El builder de EAS no recibe `mobile-pet-tracker/.env` (está en
   `.gitignore`). La variable vive en el entorno `development` de EAS, el que
   usa el perfil `development` de `eas.json`:

   ```bash
   bunx eas-cli@latest env:set --name RESET_LINK_HOST --value <RESET_LINK_HOST> --environment development --visibility plaintext
   ```

   Vale también la visibilidad `sensitive`. Nunca `secret`: esas variables no
   están disponibles cuando EAS CLI evalúa `app.config.ts` en tu máquina, y
   `associatedDomains` no llegaría a la sincronización de capacidades del App
   ID. Usa el mismo host pelado que en §Feature 59 G3.

3. **I3 — publicar el AASA en Hostinger antes de instalar el build.**

   Sustituye `REPLACE_WITH_APPLE_TEAM_ID` en
   `hosting/.well-known/apple-app-site-association` por el Team ID de la
   cuenta de Apple Developer (developer.apple.com → Account → Membership, 10
   caracteres). El Team ID no es secreto: cualquiera lo lee en el AASA
   publicado, y el test del fichero acepta el placeholder o un Team ID real.
   Sube `hosting/.well-known/apple-app-site-association` y
   `hosting/.well-known/.htaccess` a `public_html/.well-known/`. Con el host
   real sustituido localmente:

   ```bash
   curl -fsSI https://<RESET_LINK_HOST>/.well-known/apple-app-site-association
   ```

   Debe responder 200, con `Content-Type: application/json` y sin redirección:
   ni 301 ni 302 ni cabecera `Location:`. iOS descarga el AASA a través de la
   CDN de Apple al instalar la app; si el build se instala antes que el
   fichero, la CDN puede tardar horas en refrescarse. Comprobación opcional
   de lo que ve la CDN:

   ```bash
   curl -fsS https://app-site-association.cdn-apple.com/a/v1/<RESET_LINK_HOST>
   ```

4. **I4 — compilar e instalar el dev build de iOS.**

   ```bash
   bunx eas-cli@latest build -p ios --profile development
   ```

   Responde a los prompts: inicia sesión con la cuenta de Apple Developer,
   deja que EAS genere el certificado de distribución y el perfil ad hoc con
   el iPhone de I1, y acepta configurar las notificaciones push (EAS genera y
   guarda la clave APNs; la `.p8` no se descarga ni entra al repo). EAS no
   pregunta por el cifrado de exportación porque `app.json` ya declara
   `ios.config.usesNonExemptEncryption: false`. Si EAS CLI propone escribir
   en `app.json` o en `eas.json`, responde que no y para: cualquier cambio en
   esos ficheros es una enmienda de spec. Si el build no ofrece la clave de
   push, créala con
   `bunx eas-cli@latest credentials -p ios` antes de repetir el build. En el
   log del build comprueba que `RESET_LINK_HOST` figura entre las variables
   cargadas del entorno `development`. Instala el build abriendo en el iPhone
   el enlace o el QR que imprime EAS, y activa el modo de desarrollador si
   iOS lo pide.

   Si el build falla al compilar el icono (`./assets/expo.icon`), para y
   regístralo: el arreglo (`"image": "latest"` en `build.development.ios` de
   `eas.json`) es una enmienda de spec, no un cambio en caliente.

5. **I5 — smoke en el iPhone.**

   ```bash
   bunx expo start --dev-client
   ```

   Abre el dev build, acepta la red local y conecta con el Metro del PC.
   Después, en orden:

   - **Login contra la IP LAN**: inicia sesión con una cuenta propia. Si
     falla sin llegar al backend, anota el error y para: es el supuesto de ATS
     de la spec, y su arreglo es una enmienda de spec, no un cambio en caliente.
   - **Mapa**: el tab Map pinta el mapa de Apple centrado en la última
     posición, con el marcador y el recorrido y sin botón de mi ubicación.
     Con la app en tema oscuro (se cambia en el perfil), el mapa pasa a oscuro.
   - **Foto HEIC**: haz una foto con la cámara del iPhone en formato de alta
     eficiencia (Ajustes → Cámara → Formatos). Elígela en el alta de mascota
     y después como foto nueva en el perfil: las dos suben sin el error de
     formato y la foto se ve después.
   - **Reset por Universal Link**: con el dev build conectado a Metro, pide
     el restablecimiento con `POST /v1/auth/forgot-password` y abre el enlace
     del correo desde la app Mail del iPhone: debe abrir el dev build en
     `/reset-password` con el token. Completa el formulario y confirma el
     login con la contraseña nueva. Mantén pulsado el mismo enlace y elige
     abrirlo en Safari: debe mostrarse la página fallback de Hostinger.
   - **Push**: acepta el permiso de notificaciones al iniciar sesión, deja la
     app en segundo plano y dispara una alerta real o el mensaje manual de
     §Feature 79 («Disparar la notificación a mano desde Windows»). La
     notificación debe llegar al iPhone. El requisito de
     `google-services.json` de esa sección es solo de Android.

6. **I6 — regresión de Android.**

   ```bash
   bunx expo prebuild --clean --platform android
   bunx expo run:android
   ```

   En `android/app/src/main/AndroidManifest.xml`, `RECORD_AUDIO` y `CAMERA`
   solo aparecen con `tools:node="remove"`
   (`findstr "RECORD_AUDIO CAMERA" android\app\src\main\AndroidManifest.xml`).
   En el dev build de Android, el tab Map sigue pintando el mapa de Google y
   el alta de mascota sigue eligiendo foto de la galería.

Registra únicamente los resultados y status de I1–I6 en
`progress/impl_mobile-ios-support.md`. Siguen pendientes hasta esa
confirmación humana; las suites automáticas no los sustituyen.
````

2. Sustituye el contenido **entero** de `../hosting/README.md` por:

```md
# Hosting estático de Pet Tracker

Sube el contenido de este directorio tal cual a `public_html/` de Hostinger, incluida la carpeta oculta `.well-known`:

- `.well-known/assetlinks.json` queda en `https://<RESET_LINK_HOST>/.well-known/assetlinks.json` (App Links de Android).
- `.well-known/apple-app-site-association` queda en `https://<RESET_LINK_HOST>/.well-known/apple-app-site-association` (Universal Links de iOS). No lleva extensión: `.well-known/.htaccess` fuerza `Content-Type: application/json` solo para ese fichero.
- `reset-password/index.html` queda en `https://<RESET_LINK_HOST>/reset-password` (página fallback sin app).

Antes de subir el AASA, sustituye `REPLACE_WITH_APPLE_TEAM_ID` por el Team ID de la cuenta de Apple Developer. El fingerprint de `assetlinks.json` y el Team ID se publican y no son secretos; el dominio real no se versiona. Los gates humanos están en `docs/verification.md`: G1–G4 en §Feature 59 (Android) e I1–I6 en §Feature 60 (iOS).
```

   El `REPLACE_WITH_DEV_BUILD_SHA256` que citaba estaba desfasado:
   `assetlinks.json` ya lleva el fingerprint real, que no cambia.

3. En `../AGENTS.md`, en la tabla de directorios, la fila de `hosting/`, sustituye esta línea:

```md
| `hosting/` | Artefactos estáticos de App Links y fallback web de reset | Para revisar o desplegar `assetlinks.json` y la página de `/reset-password` |
```

por esta:

```md
| `hosting/` | Artefactos estáticos de App Links (Android), Universal Links (iOS) y fallback web de reset | Para revisar o desplegar `assetlinks.json`, `apple-app-site-association` y la página de `/reset-password` |
```

4. En `../docs/conventions.md`, la fila de `RESET_LINK_HOST`, sustituye esta línea:

```md
| `RESET_LINK_HOST` | Host pelado del App Link de restablecimiento (`app.midominio.tld`), sin esquema, path ni slash final. El valor real nunca se versiona; debe coincidir en los dos entornos | nombre vacío en `.env.example` raíz y móvil — consumida desde `auth-reset-deep-link` (#59) por `AuthModule` vía `ConfigService` y en build time por `mobile-pet-tracker/app.config.ts` |
```

por esta:

```md
| `RESET_LINK_HOST` | Host pelado del App Link de restablecimiento (`app.midominio.tld`), sin esquema, path ni slash final. El valor real nunca se versiona; debe coincidir en los dos entornos | nombre vacío en `.env.example` raíz y móvil — consumida desde `auth-reset-deep-link` (#59) por `AuthModule` vía `ConfigService` y en build time por `mobile-pet-tracker/app.config.ts`; para el dev build de iOS (#60) vive además como variable de EAS del entorno `development` con visibilidad `plaintext` o `sensitive`, nunca `secret` |
```

   Solo cambia el final de la fila, tras `app.config.ts`.

5. En `.env.example` (el de `mobile-pet-tracker/`, no el de la raíz), el comentario de `RESET_LINK_HOST`, sustituye esta línea (el bloque aparece una sola vez; `grep -cxF '# vive solo en este .env ignorado; ver docs/verification.md §Feature 59.' .env.example` da 1):

```text
# vive solo en este .env ignorado; ver docs/verification.md §Feature 59.
```

por estas 3:

```text
# vive solo en este .env ignorado; ver docs/verification.md §Feature 59.
# El build de iOS en EAS no lee este fichero: usa la variable de EAS del
# entorno development; ver docs/verification.md §Feature 60.
```


Después:

1. `git hash-object ../docs/verification.md` da `f329a871c8e72255031a28cccb32f2c8c66966f1` (1172 líneas); `git hash-object ../hosting/README.md` da `d867e0af61c8045f310f0a7200e8ffb895188937` (9 líneas); `git hash-object ../AGENTS.md` da `200ec9af6888fc2b96fa7795ba7174072b50bad3` (157 líneas); `git hash-object ../docs/conventions.md` da `001aad65409bde2dc5baa0ac8526a58ec3bea3d3` (629 líneas) y `git hash-object .env.example` da `8c6003b99719f5523ed09f02a2799f33c69b6a28` (10 líneas). Si alguno no coincide, el pegado no es el de la spec: corrígelo antes de seguir.
2. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/__tests__/hosting-artifacts.test.ts > /tmp/60_g9.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_g9.log
   ```

   Esperado: `Tests:` 12 passed, 12 total; `Test Suites:` 1 passed, 1 total; `exit=0`.
3. Commit verde:

   ```bash
   git add ../docs/verification.md ../hosting/README.md ../AGENTS.md ../docs/conventions.md .env.example
   git commit -m "docs: document the iOS dev build gates and the EAS variable (R9)"
   ```

### (3) Refactor

Ninguno.

## Sondas

Sobre el árbol final, con los diecisiete commits hechos, **una sonda cada
vez**:

1. Aplica la mutación de la sonda: sustituye las líneas del primer bloque por
   las del segundo, en el fichero que se cita.
2. Comprueba con `git hash-object` que el fichero mutado da el blob citado.
   Si no coincide, la mutación no es la de la spec: corrígela antes de medir.
3. Corre los tests citados, sin pipe:
   `bunx jest --runTestsByPath <tests> > /tmp/60_probe.log 2>&1; echo "exit=$?"`.
4. Anota `exit`, las cuentas, cada `it` rojo y **la primera línea de su
   error**. `expect(…).<matcher>(…)` es un rojo **por aserción**; `Unable to
   find an element with testID: …` o un error al cargar el fichero es un rojo
   **por consulta**. Todas las de esta tabla esperan rojo por aserción.
5. Restaura con `git checkout HEAD -- <ruta>` (la misma ruta relativa de la
   sonda). **Nunca** con `git checkout <commit> --`, que deja la mutación en
   el índice.
6. `git status --porcelain` y `git diff --cached --name-only` salen vacíos.
   Si no, **para**.

**Nada de esto se commitea.** No uses `git stash` ni `rm -f`. La tabla del
final va al reporte, con la columna «medido» rellena por ti. Si una sonda da
otro veredicto, **para** y repórtalo con el log. No ajustes la aserción para
que case.

### 1. `always_apple`: la rama de Apple se toma también en Android

En `src/components/pet-map.tsx`, sustituye esta línea (`grep -cxF "  if (Platform.OS === 'ios') {" src/components/pet-map.tsx` da 1):

```tsx
  if (Platform.OS === 'ios') {
```

por esta:

```tsx
  if (Platform.OS !== 'web') {
```

- Blob mutado: `a8aff9aad4eb41c87db18637ccbdd72fa0087cd2`.
- Tests: `src/components/__tests__/pet-map.test.tsx`.
- Esperado: `Tests:` 3 failed, 10 passed, 13 total; `exit=1`. Rojos, por aserción:
  - `R1: PetMap renderiza la vista de expo-maps con el contrato del tab Map › usa GoogleMaps.View a pantalla completa con el testID estable`, por `expect(jest.fn()).toHaveBeenCalledTimes(expected)`;
  - `R1 (mobile-map-zoom-controls): el wrapper oculta los controles nativos de zoom › pasa solo zoomControlsEnabled y no contentPadding`, por `expect(received).toEqual(expected)`;
  - `#60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › #60 R1: en Android pinta GoogleMaps.View y nunca AppleMaps.View`, por `expect(jest.fn()).toHaveBeenCalledTimes(expected)`.

### 2. `no_pitch`: iOS vuelve a mostrar el cambio de inclinación

En `src/components/pet-map.tsx`, sustituye esta línea (`grep -cxF '        uiSettings={{ myLocationButtonEnabled: false, togglePitchEnabled: false }}' src/components/pet-map.tsx` da 1):

```tsx
        uiSettings={{ myLocationButtonEnabled: false, togglePitchEnabled: false }}
```

por esta:

```tsx
        uiSettings={{ myLocationButtonEnabled: false }}
```

- Blob mutado: `527bba9d4631f04c9856eadd8e91359d5abf5969`.
- Tests: `src/components/__tests__/pet-map.test.tsx src/screens/map/index.test.tsx`.
- Esperado: `Tests:` 2 failed, 70 passed, 72 total; `exit=1`. Rojos, por aserción:
  - `#60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: oculta el botón de mi ubicación y el cambio de inclinación, sin contentPadding`, por `expect(received).toEqual(expected)`;
  - `#60 R2: en iOS el tab Map monta el mapa de Apple con la última posición › #60 R2: centra el mapa de Apple en la última posición y oculta sus controles de ubicación e inclinación`, por `expect(received).toEqual(expected)`.

### 3. `apple_dark`: el tema oscuro pinta el mapa claro

En `src/components/pet-map.tsx`, sustituye esta línea (`grep -cxF '            ? AppleMaps.MapColorScheme.DARK' src/components/pet-map.tsx` da 1):

```tsx
            ? AppleMaps.MapColorScheme.DARK
```

por esta:

```tsx
            ? AppleMaps.MapColorScheme.LIGHT
```

- Blob mutado: `671b65126e18b8c7da0e23225da718e76eecbbac`.
- Tests: `src/components/__tests__/pet-map.test.tsx src/screens/map/index.test.tsx`.
- Esperado: `Tests:` 1 failed, 71 passed, 72 total; `exit=1`. Rojos, por aserción:
  - `#60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: mapea el tema dark al esquema nativo DARK`, por `expect(received).toBe(expected)`.

### 4. `current_addpet`: el alta vuelve a pedir la representación original (HEIC)

En `src/screens/add-pet/index.tsx`, sustituye esta línea (`grep -cxF '        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,' src/screens/add-pet/index.tsx` da 1):

```tsx
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
```

por esta:

```tsx
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
```

- Blob mutado: `970d957f66839b8126688ce0f1e7627800401aec`.
- Tests: `src/screens/add-pet/index.test.tsx`.
- Esperado: `Tests:` 1 failed, 24 passed, 25 total; `exit=1`. Rojos, por aserción:
  - `R7: foto opcional tras alta › #60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC`, por `expect(jest.fn()).toHaveBeenCalledWith(...expected)`.

### 5. `current_profile`: el perfil vuelve a pedir la representación original (HEIC)

En `src/screens/profile/index.tsx`, sustituye esta línea (`grep -cxF '        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,' src/screens/profile/index.tsx` da 1):

```tsx
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
```

por esta:

```tsx
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
```

- Blob mutado: `b5dad4baf4a49c0d8948829395d963e18a9f8c01`.
- Tests: `src/screens/profile/index.test.tsx`.
- Esperado: `Tests:` 1 failed, 38 passed, 39 total; `exit=1`. Rojos, por aserción:
  - `R7: cambiar foto › #60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC`, por `expect(jest.fn()).toHaveBeenCalledWith(...expected)`.

### 6. `target16`: el `deploymentTarget` baja de iOS 17, donde `AppleMaps.View` no existe

En `app.json`, sustituye esta línea (`grep -cxF '      "deploymentTarget": "17.0",' app.json` da 1):

```json
      "deploymentTarget": "17.0",
```

por esta:

```json
      "deploymentTarget": "16.4",
```

- Blob mutado: `2cf6ef07ee4541bb0f416404ac1a38aec2c9a452`.
- Tests: `app.config.test.ts`.
- Esperado: `Tests:` 6 failed, 15 passed, 21 total; `exit=1`. Rojos, por aserción:
  - `#60 R4: app.json declara la identidad de iOS › #60 R4: fija bundleIdentifier, deploymentTarget 17.0 y cifrado exento sin tocar el icono`, por `expect(received).toEqual(expected)`;
  - `#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: con clave de mapas y google-services.json, añade applinks del host recortado a ios`, por `expect(received).toEqual(expected)`;
  - `#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios`, por `expect(received).toEqual(expected)`;
  - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host ausente no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`;
  - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host vacío no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`;
  - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host solo espacios no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`.

### 7. `encryption_true`: la app declara cifrado no exento

En `app.json`, sustituye esta línea (`grep -cxF '        "usesNonExemptEncryption": false' app.json` da 1):

```json
        "usesNonExemptEncryption": false
```

por esta:

```json
        "usesNonExemptEncryption": true
```

- Blob mutado: `bd0a6db47ddb1433b177175b17fcd0c54428223d`.
- Tests: `app.config.test.ts`.
- Esperado: `Tests:` 6 failed, 15 passed, 21 total; `exit=1`. Rojos, por aserción:
  - `#60 R4: app.json declara la identidad de iOS › #60 R4: fija bundleIdentifier, deploymentTarget 17.0 y cifrado exento sin tocar el icono`, por `expect(received).toEqual(expected)`;
  - `#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: con clave de mapas y google-services.json, añade applinks del host recortado a ios`, por `expect(received).toEqual(expected)`;
  - `#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios`, por `expect(received).toEqual(expected)`;
  - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host ausente no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`;
  - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host vacío no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`;
  - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host solo espacios no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`.

### 8. `secure_string`: `expo-secure-store` vuelve a cadena y recupera el texto de Face ID

En `app.json`, sustituye estas 6 líneas (`grep -cxF '        "expo-secure-store",' app.json` da 1):

```json
      [
        "expo-secure-store",
        {
          "faceIDPermission": false
        }
      ],
```

por esta:

```json
      "expo-secure-store",
```

- Blob mutado: `8d4ecc4f27460367b5a37d489f61a6034e52ee84`.
- Tests: `app.config.test.ts`.
- Esperado: `Tests:` 1 failed, 20 passed, 21 total; `exit=1`. Rojos, por aserción:
  - `#60 R5: app.json deja solo el permiso de galería, en español › #60 R5: declara expo-secure-store sin Face ID y una sola vez por plugin`, por `expect(received).toContainEqual(expected)`.

### 9. `camera_on`: vuelve el permiso de cámara

En `app.json`, sustituye esta línea (`grep -cxF '          "cameraPermission": false,' app.json` da 1):

```json
          "cameraPermission": false,
```

por esta:

```json
          "cameraPermission": "Se usa la cámara.",
```

- Blob mutado: `2731b4f819b9ed1882e8dafa745b9934512ea74e`.
- Tests: `app.config.test.ts`.
- Esperado: `Tests:` 1 failed, 20 passed, 21 total; `exit=1`. Rojos, por aserción:
  - `#60 R5: app.json deja solo el permiso de galería, en español › #60 R5: declara expo-image-picker con el texto de galería y sin cámara ni micrófono`, por `expect(received).toContainEqual(expected)`.

### 10. `no_trim`: el dominio asociado usa la variable sin recortar

En `app.config.ts`, sustituye esta línea:

```ts
            associatedDomains: [`applinks:${resetLinkHost}`],
```

por esta:

```ts
            associatedDomains: [`applinks:${process.env.RESET_LINK_HOST}`],
```

- Blob mutado: `6edffe4890fa4ab04589734b1c1219aa4c0761ef`.
- Tests: `app.config.test.ts`.
- Esperado: `Tests:` 2 failed, 19 passed, 21 total; `exit=1`. Rojos, por aserción:
  - `#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: con clave de mapas y google-services.json, añade applinks del host recortado a ios`, por `expect(received).toEqual(expected)`;
  - `#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios`, por `expect(received).toEqual(expected)`.

### 11. `ios_needs_maps`: iOS exige la clave de mapas para declarar el dominio

En `app.config.ts`, sustituye estas 3 líneas (`grep -cxF '    ...(resetLinkHost' app.config.ts` da 1):

```ts
    ...(resetLinkHost
      ? {
          ios: {
```

por estas 3:

```ts
    ...(resetLinkHost && googleMapsApiKey
      ? {
          ios: {
```

- Blob mutado: `2dbc63cd90ad2824123e45257a684ab97d4faf32`.
- Tests: `app.config.test.ts`.
- Esperado: `Tests:` 1 failed, 20 passed, 21 total; `exit=1`. Rojos, por aserción:
  - `#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios`, por `expect(received).toEqual(expected)`.

### 12. `old_warning`: el aviso pierde la parte de iOS

En `app.config.ts`, sustituye esta línea (`grep -cxF "      'RESET_LINK_HOST no está definida; el build de Android quedará sin intent filters de App Links y el de iOS sin associatedDomains de Universal Links. Consulta docs/verification.md §Feature 59 — auth-reset-deep-link y §Feature 60 — mobile-ios-support.'," app.config.ts` da 1):

```ts
      'RESET_LINK_HOST no está definida; el build de Android quedará sin intent filters de App Links y el de iOS sin associatedDomains de Universal Links. Consulta docs/verification.md §Feature 59 — auth-reset-deep-link y §Feature 60 — mobile-ios-support.',
```

por esta:

```ts
      'RESET_LINK_HOST no está definida; el build de Android quedará sin intent filters de App Links. Consulta docs/verification.md §Feature 59 — auth-reset-deep-link y §Feature 60 — mobile-ios-support.',
```

- Blob mutado: `a49ccd9ea71ba77ae52dae583ed16a779da51c99`.
- Tests: `app.config.test.ts`.
- Esperado: `Tests:` 3 failed, 18 passed, 21 total; `exit=1`. Rojos, por aserción:
  - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host ausente no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`;
  - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host vacío no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`;
  - `#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host solo espacios no declara associatedDomains y avisa una vez por Android e iOS`, por `expect(received).toEqual(expected)`.

### 13. `wrong_bundle`: el `appID` apunta a otro bundle

En `../hosting/.well-known/apple-app-site-association`, sustituye esta línea (`grep -cxF '        "appIDs": ["REPLACE_WITH_APPLE_TEAM_ID.com.trackermex.pettracker"],' ../hosting/.well-known/apple-app-site-association` da 1):

```json
        "appIDs": ["REPLACE_WITH_APPLE_TEAM_ID.com.trackermex.pettracker"],
```

por esta:

```json
        "appIDs": ["REPLACE_WITH_APPLE_TEAM_ID.com.trackermex.pettracker.dev"],
```

- Blob mutado: `d5b021a92f4d89533c2a5459fcf1febb5b9019ab`.
- Tests: `src/__tests__/hosting-artifacts.test.ts`.
- Esperado: `Tests:` 1 failed, 11 passed, 12 total; `exit=1`. Rojos, por aserción:
  - `#60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: publica un único detalle para el App ID de iOS y solo la ruta de reset`, por `expect(received).toMatch(expected)`.

### 14. `wide_path`: el AASA delega todas las rutas

En `../hosting/.well-known/apple-app-site-association`, sustituye esta línea (`grep -cxF '        "components": [{ "/": "/reset-password*" }]' ../hosting/.well-known/apple-app-site-association` da 1):

```json
        "components": [{ "/": "/reset-password*" }]
```

por esta:

```json
        "components": [{ "/": "*" }]
```

- Blob mutado: `4d2af87ec8fa941fe6a9e4011b1cbe3b1280b32f`.
- Tests: `src/__tests__/hosting-artifacts.test.ts`.
- Esperado: `Tests:` 1 failed, 11 passed, 12 total; `exit=1`. Rojos, por aserción:
  - `#60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: publica un único detalle para el App ID de iOS y solo la ruta de reset`, por `expect(received).toEqual(expected)`.

### 15. `htaccess_all`: el `.htaccess` fuerza JSON para todo `.well-known/`

En `../hosting/.well-known/.htaccess`, sustituye esta línea (`grep -cxF '<Files "apple-app-site-association">' ../hosting/.well-known/.htaccess` da 1):

```apache
<Files "apple-app-site-association">
```

por esta:

```apache
<Files "*">
```

- Blob mutado: `ad331d96de65b6714f87bd0caa5b0daf57510fa5`.
- Tests: `src/__tests__/hosting-artifacts.test.ts`.
- Esperado: `Tests:` 1 failed, 11 passed, 12 total; `exit=1`. Rojos, por aserción:
  - `#60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: fuerza application/json solo para el fichero sin extensión`, por `expect(received).toEqual(expected)`.

### 16. `secret_doc`: la guía admite `--visibility secret`

En `../docs/verification.md`, sustituye esta línea:

```md
   Vale también la visibilidad `sensitive`. Nunca `secret`: esas variables no
```

por esta:

```md
   Vale también `--visibility secret`: esas variables no
```

- Blob mutado: `50687b1a35324fe0a8d1cfdfe690b33ebb030f2c`.
- Tests: `src/__tests__/hosting-artifacts.test.ts`.
- Esperado: `Tests:` 1 failed, 11 passed, 12 total; `exit=1`. Rojos, por aserción:
  - `#60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: documenta los gates de iOS en la sección Feature 60`, por `expect(received).not.toMatch(expected)`.

### 17. `agents_row`: la fila de `hosting/` de `AGENTS.md` vuelve a la base

En `../AGENTS.md`, sustituye esta línea:

```md
| `hosting/` | Artefactos estáticos de App Links (Android), Universal Links (iOS) y fallback web de reset | Para revisar o desplegar `assetlinks.json`, `apple-app-site-association` y la página de `/reset-password` |
```

por esta:

```md
| `hosting/` | Artefactos estáticos de App Links y fallback web de reset | Para revisar o desplegar `assetlinks.json` y la página de `/reset-password` |
```

- Blob mutado: `a15920b3bc61cc5d3b48efdb99cec066ec36ab9f`.
- Tests: `src/__tests__/hosting-artifacts.test.ts`.
- Esperado: `Tests:` 1 failed, 11 passed, 12 total; `exit=1`. Rojos, por aserción:
  - `#60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: el README de hosting explica el AASA, su .htaccess y el Team ID, y AGENTS.md lo nombra`, por `expect(received).toContain(expected)`.

### 18. `conv_row`: la fila de `RESET_LINK_HOST` vuelve a la base

En `../docs/conventions.md`, sustituye esta línea:

```md
| `RESET_LINK_HOST` | Host pelado del App Link de restablecimiento (`app.midominio.tld`), sin esquema, path ni slash final. El valor real nunca se versiona; debe coincidir en los dos entornos | nombre vacío en `.env.example` raíz y móvil — consumida desde `auth-reset-deep-link` (#59) por `AuthModule` vía `ConfigService` y en build time por `mobile-pet-tracker/app.config.ts`; para el dev build de iOS (#60) vive además como variable de EAS del entorno `development` con visibilidad `plaintext` o `sensitive`, nunca `secret` |
```

por esta:

```md
| `RESET_LINK_HOST` | Host pelado del App Link de restablecimiento (`app.midominio.tld`), sin esquema, path ni slash final. El valor real nunca se versiona; debe coincidir en los dos entornos | nombre vacío en `.env.example` raíz y móvil — consumida desde `auth-reset-deep-link` (#59) por `AuthModule` vía `ConfigService` y en build time por `mobile-pet-tracker/app.config.ts` |
```

- Blob mutado: `78ed538c70c544989e296ee71a890b49c2bd7e0d`.
- Tests: `src/__tests__/hosting-artifacts.test.ts`.
- Esperado: `Tests:` 1 failed, 11 passed, 12 total; `exit=1`. Rojos, por aserción:
  - `#60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: la fila de RESET_LINK_HOST y el .env.example móvil nombran la variable de EAS`, por `expect(received).toContain(expected)`.

Tabla para el reporte (copia y rellena «medido»):

| Sonda | Fichero | Blob | Exigido | Medido |
|---|---|---|---|---|
| `always_apple` | `src/components/pet-map.tsx` | `a8aff9aa` | 3 rojos de 13 | |
| `no_pitch` | `src/components/pet-map.tsx` | `527bba9d` | 2 rojos de 72 | |
| `apple_dark` | `src/components/pet-map.tsx` | `671b6512` | 1 rojo de 72 | |
| `current_addpet` | `src/screens/add-pet/index.tsx` | `970d957f` | 1 rojo de 25 | |
| `current_profile` | `src/screens/profile/index.tsx` | `b5dad4ba` | 1 rojo de 39 | |
| `target16` | `app.json` | `2cf6ef07` | 6 rojos de 21 | |
| `encryption_true` | `app.json` | `bd0a6db4` | 6 rojos de 21 | |
| `secure_string` | `app.json` | `8d4ecc4f` | 1 rojo de 21 | |
| `camera_on` | `app.json` | `2731b4f8` | 1 rojo de 21 | |
| `no_trim` | `app.config.ts` | `6edffe48` | 2 rojos de 21 | |
| `ios_needs_maps` | `app.config.ts` | `2dbc63cd` | 1 rojo de 21 | |
| `old_warning` | `app.config.ts` | `a49ccd9e` | 3 rojos de 21 | |
| `wrong_bundle` | `../hosting/.well-known/apple-app-site-association` | `d5b021a9` | 1 rojo de 12 | |
| `wide_path` | `../hosting/.well-known/apple-app-site-association` | `4d2af87e` | 1 rojo de 12 | |
| `htaccess_all` | `../hosting/.well-known/.htaccess` | `ad331d96` | 1 rojo de 12 | |
| `secret_doc` | `../docs/verification.md` | `50687b1a` | 1 rojo de 12 | |
| `agents_row` | `../AGENTS.md` | `a15920b3` | 1 rojo de 12 | |
| `conv_row` | `../docs/conventions.md` | `78ed538c` | 1 rojo de 12 | |

## R10 — Cierre

1. **Los seis ficheros de test**, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/components/__tests__/pet-map.test.tsx src/screens/map/index.test.tsx src/screens/add-pet/index.test.tsx src/screens/profile/index.test.tsx app.config.test.ts src/__tests__/hosting-artifacts.test.ts > /tmp/60_final.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" /tmp/60_final.log
   ```

   Esperado: 6 suites y 169 passed de 169, `exit=0` (la base medida más 21).
   Por fichero: `pet-map.test.tsx` 13, `map/index.test.tsx` 59,
   `add-pet/index.test.tsx` 25, `profile/index.test.tsx` 39,
   `app.config.test.ts` 21 y `hosting-artifacts.test.ts` 12.
2. **Guardas**, sin pipe:
   `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/hero-header-amendments.test.ts > /tmp/60_guards_final.log 2>&1; echo "exit=$?"`.
   Esperado: la misma cifra que en la base (111 de 111), `exit=0`.
3. **Suite entera, solo con permiso del humano.** Pídeselo antes: otra sesión
   puede tener `./init.sh` en vuelo, y la suite entera a la vez da rojos
   falsos por carga. Con su permiso, sin pipe:
   `bunx jest > /tmp/60_full.log 2>&1; echo "exit=$?"`. Esperado: 86 suites y
   1634 tests, `exit=0`, o la base que conste más 21 tests y 0 suites. Si el
   humano no da permiso, anótalo en el reporte y sigue: el `leader` corre
   `./init.sh` antes del `reviewer`.
4. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/60_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
5. `bunx eslint src/components/pet-map.tsx src/components/__tests__/pet-map.test.tsx src/screens/map/index.test.tsx src/screens/add-pet/index.tsx src/screens/add-pet/index.test.tsx src/screens/profile/index.tsx src/screens/profile/index.test.tsx app.config.ts app.config.test.ts src/__tests__/hosting-artifacts.test.ts > /tmp/60_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
6. **Lo que generan los plugins.** Repite el punto 9 de §Antes de tocar nada
   (los cuatro comandos, con la misma regla de seguridad). Esperado: `exit=0`,
   el último `test` con `exit=0` y exactamente esta línea:

   ```text
   {"usage":["NSLocalNetworkUsageDescription","NSPhotoLibraryUsageDescription"],"photos":"Se usa para elegir de tu galería la foto de perfil de tu mascota.","encryption":false,"domains":["applinks:reset.example.test"],"aps":"development","android":[]}
   ```

7. **Cifras de candado.** Se mueven solo las que dice la tabla, y ninguna
   otra:

   | Comando | Base | Final |
   |---|---|---|
   | `grep -cF 'AppleMaps' src/components/pet-map.tsx` | 0 | 4 |
   | `grep -cF 'GoogleMaps' src/components/pet-map.tsx` | 4 | 4 |
   | `grep -cF "Platform.OS === 'ios'" src/components/pet-map.tsx` | 0 | 1 |
   | `grep -cF 'uiSettings={{ zoomControlsEnabled: false }}' src/components/pet-map.tsx` | 0 | 1 |
   | `grep -cF 'uiSettings={{ myLocationButtonEnabled: false, togglePitchEnabled: false }}' src/components/pet-map.tsx` | 0 | 1 |
   | `grep -cF 'contentPadding' src/components/pet-map.tsx` | 0 | 0 |
   | `grep -rF 'Platform.OS' src --include='*.ts' --include='*.tsx' \| grep -v '\.test\.tsx\?:' \| grep -v '/__tests__/' \| wc -l` | 3 | 4 |
   | `grep -cF 'UIImagePickerPreferredAssetRepresentationMode.Compatible' src/screens/add-pet/index.tsx` | 0 | 1 |
   | `grep -cF 'UIImagePickerPreferredAssetRepresentationMode.Compatible' src/screens/profile/index.tsx` | 0 | 1 |
   | `grep -rF 'launchImageLibraryAsync(' src --include='*.ts' --include='*.tsx' \| grep -v '\.test\.tsx\?:' \| grep -v '/__tests__/' \| wc -l` | 2 | 2 |
   | `grep -cF 'console.warn(' app.config.ts` | 1 | 1 |
   | `grep -cF 'associatedDomains' app.config.ts` | 0 | 2 |
   | `grep -cF "expect(expo.plugins).toContain('expo-secure-store');" app.config.test.ts` | 1 | 0 |
   | `grep -c '^describe(' src/components/__tests__/pet-map.test.tsx` | 5 | 6 |
   | `grep -c '^describe(' src/screens/map/index.test.tsx` | 22 | 23 |
   | `grep -c '^describe(' src/screens/add-pet/index.test.tsx` | 11 | 11 |
   | `grep -c '^describe(' src/screens/profile/index.test.tsx` | 16 | 16 |
   | `grep -c '^describe(' app.config.test.ts` | 7 | 11 |
   | `grep -c '^describe(' src/__tests__/hosting-artifacts.test.ts` | 3 | 5 |
   | `grep -c '#60' src/components/__tests__/pet-map.test.tsx` | 0 | 5 |
   | `grep -c '#60 R[1-9]' src/components/__tests__/pet-map.test.tsx` | 0 | 5 |
   | `grep -c '#60' src/screens/map/index.test.tsx` | 0 | 2 |
   | `grep -c '#60 R[1-9]' src/screens/map/index.test.tsx` | 0 | 2 |
   | `grep -c '#60' src/screens/add-pet/index.test.tsx` | 0 | 1 |
   | `grep -c '#60 R[1-9]' src/screens/add-pet/index.test.tsx` | 0 | 1 |
   | `grep -c '#60' src/screens/profile/index.test.tsx` | 0 | 1 |
   | `grep -c '#60 R[1-9]' src/screens/profile/index.test.tsx` | 0 | 1 |
   | `grep -c '#60' app.config.test.ts` | 0 | 10 |
   | `grep -c '#60 R[1-9]' app.config.test.ts` | 0 | 10 |
   | `grep -c '#60' src/__tests__/hosting-artifacts.test.ts` | 0 | 7 |
   | `grep -c '#60 R[1-9]' src/__tests__/hosting-artifacts.test.ts` | 0 | 7 |
   | `cat src/components/__tests__/pet-map.test.tsx src/screens/map/index.test.tsx src/screens/add-pet/index.test.tsx src/screens/profile/index.test.tsx app.config.test.ts src/__tests__/hosting-artifacts.test.ts \| grep -c -- '-\['` | 0 | 0 |
   | `cat src/components/__tests__/pet-map.test.tsx src/screens/map/index.test.tsx src/screens/add-pet/index.test.tsx src/screens/profile/index.test.tsx app.config.test.ts src/__tests__/hosting-artifacts.test.ts \| grep -ci stylesheet` | 0 | 0 |
   | `grep -c '^### Feature ' ../docs/verification.md` | 17 | 18 |
   | `grep -cF '### Feature 60 — mobile-ios-support' ../docs/verification.md` | 0 | 1 |
   | `grep -c 'REPLACE_WITH_DEV_BUILD_SHA256' ../docs/verification.md` | 1 | 1 |
   | `grep -c 'REPLACE_WITH_DEV_BUILD_SHA256' ../hosting/README.md` | 1 | 0 |
   | `grep -c 'REPLACE_WITH_APPLE_TEAM_ID' ../hosting/README.md` | 0 | 1 |
   | `grep -c 'REPLACE_WITH_APPLE_TEAM_ID' ../hosting/.well-known/apple-app-site-association` | no existe | 1 |
   | `grep -c 'RESET_LINK_HOST' .env.example` | 1 | 1 |

   En la tabla, `\|` es un `|` del comando: escápalo solo aquí. En cada test,
   `grep -c '#60'` y `grep -c '#60 R[1-9]'` dan lo mismo: ningún `#60`
   suelto. El `Platform.OS` que se suma en producción es el de `PetMap`. Las
   dos filas que barren `src/` entero se exigen como delta (+1 y +0) sobre lo
   que anotaste al arrancar (punto 7 de §Antes de tocar nada).
8. **Lista cerrada de ficheros.** Con `<h>` el HEAD del handoff (punto 3 de
   §Antes de tocar nada), `git diff --name-only <h> HEAD` lista exactamente
   estos 18 ficheros y ninguno más:

   - `AGENTS.md`
   - `docs/conventions.md`
   - `docs/verification.md`
   - `hosting/.well-known/.htaccess`
   - `hosting/.well-known/apple-app-site-association`
   - `hosting/README.md`
   - `mobile-pet-tracker/.env.example`
   - `mobile-pet-tracker/app.config.test.ts`
   - `mobile-pet-tracker/app.config.ts`
   - `mobile-pet-tracker/app.json`
   - `mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts`
   - `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx`
   - `mobile-pet-tracker/src/components/pet-map.tsx`
   - `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`
   - `mobile-pet-tracker/src/screens/add-pet/index.tsx`
   - `mobile-pet-tracker/src/screens/map/index.test.tsx`
   - `mobile-pet-tracker/src/screens/profile/index.test.tsx`
   - `mobile-pet-tracker/src/screens/profile/index.tsx`

   y `git diff --numstat <h> HEAD` da 706 inserciones y 16 borrados
   en total, así:

   | Fichero | + | − |
   |---|---|---|
   | `AGENTS.md` | 1 | 1 |
   | `docs/conventions.md` | 1 | 1 |
   | `docs/verification.md` | 155 | 0 |
   | `hosting/.well-known/.htaccess` | 3 | 0 |
   | `hosting/.well-known/apple-app-site-association` | 10 | 0 |
   | `hosting/README.md` | 6 | 2 |
   | `mobile-pet-tracker/.env.example` | 2 | 0 |
   | `mobile-pet-tracker/app.config.test.ts` | 161 | 1 |
   | `mobile-pet-tracker/app.config.ts` | 9 | 1 |
   | `mobile-pet-tracker/app.json` | 20 | 2 |
   | `mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts` | 98 | 1 |
   | `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx` | 114 | 0 |
   | `mobile-pet-tracker/src/components/pet-map.tsx` | 27 | 7 |
   | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` | 18 | 0 |
   | `mobile-pet-tracker/src/screens/add-pet/index.tsx` | 2 | 0 |
   | `mobile-pet-tracker/src/screens/map/index.test.tsx` | 58 | 0 |
   | `mobile-pet-tracker/src/screens/profile/index.test.tsx` | 19 | 0 |
   | `mobile-pet-tracker/src/screens/profile/index.tsx` | 2 | 0 |

   En los seis tests, los únicos borrados son **dos**: la aserción de `#79 R2`
   (R5) y el import de `node:fs` (R8). Ningún otro `it` existente cambia.
9. **Ficheros que no cambian**:
   `git diff --exit-code <h> HEAD -- eas.json package.json bun.lock src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx src/api/media.ts src/screens/map/index.tsx ../.env.example ../docs/ui-guidelines.md ../hosting/.well-known/assetlinks.json ../hosting/reset-password/index.html; echo "exit=$?"`
   da `exit=0`.
10. **Historia.** `git log --oneline <h>..HEAD` da diecisiete commits, en este
    orden: rojo R1, rojo R2, verde común R1 y R2, y luego rojo y verde de R3
    a R9. Cada rojo toca solo tests; cada verde, solo lo que su paso cita.
11. Blobs finales, con `git rev-parse HEAD:<ruta>` (la ruta desde la raíz del
    repo, tal como sale en la tabla):

    | Ruta | Blob |
    |---|---|
    | `AGENTS.md` | `200ec9af6888fc2b96fa7795ba7174072b50bad3` |
    | `docs/conventions.md` | `001aad65409bde2dc5baa0ac8526a58ec3bea3d3` |
    | `docs/verification.md` | `f329a871c8e72255031a28cccb32f2c8c66966f1` |
    | `hosting/.well-known/.htaccess` | `325926fa08861a4fdb377665512cbee4e158084e` |
    | `hosting/.well-known/apple-app-site-association` | `862b64580ea871d3d20ea11507c047e327c20ed4` |
    | `hosting/README.md` | `d867e0af61c8045f310f0a7200e8ffb895188937` |
    | `mobile-pet-tracker/.env.example` | `8c6003b99719f5523ed09f02a2799f33c69b6a28` |
    | `mobile-pet-tracker/app.config.test.ts` | `1426e188781303134757416605b4e3c07f16932f` |
    | `mobile-pet-tracker/app.config.ts` | `e417003de04b00c5f4ac108ee9f56ef976abd428` |
    | `mobile-pet-tracker/app.json` | `0d35cce92271599325aa97ad8e6c5d105c6e0962` |
    | `mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts` | `8abaacbfc7f218c9f353a67a3dac77d41ea73913` |
    | `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx` | `d8328887c3de2038b6f577b7215115d8c0331e35` |
    | `mobile-pet-tracker/src/components/pet-map.tsx` | `5801249b877e4cdb6fdc885b90da1c1ce5a735bb` |
    | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` | `62971928b8891ae1971e23dd080638a7d57863a2` |
    | `mobile-pet-tracker/src/screens/add-pet/index.tsx` | `e02a048d9e22700d4b93797356b32671c7408aab` |
    | `mobile-pet-tracker/src/screens/map/index.test.tsx` | `906220e8b390b419ad3e8a3d9e864edc8d5d284e` |
    | `mobile-pet-tracker/src/screens/profile/index.test.tsx` | `b52c4b440f37c42c5c9d55a7a4c1cd75ceaa1764` |
    | `mobile-pet-tracker/src/screens/profile/index.tsx` | `ef3e7362a0d451f9965332666a7faeca79de92c3` |

12. Escribe `../progress/impl_mobile-ios-support.md` con:
    - el HEAD del handoff y las skills que cargaste;
    - la base medida (tests, guardas e introspección);
    - las salidas de cada rojo y de cada verde (cuentas, `exit` y los `it`
      rojos con su matcher);
    - la tabla de §Sondas, con la columna «medido»;
    - las salidas de los puntos 1 a 11 de este cierre, incluida la línea de
      introspección y si el humano dio permiso para la suite entera.

    Nada de secretos en el reporte: ni el JSON de `introspect`, ni `.env`, ni
    el dominio real. Rellena los hashes en [[traceability]]. Las filas de R10
    a R13 no llevan commit rojo; la de R10 cita el hash del **verde de R9**,
    que es el último commit con cambios de la feature. Commitea:

    ```bash
    git add ../progress/impl_mobile-ios-support.md ../specs/mobile-ios-support/traceability.md
    git commit -m "docs(mobile): record the iOS support evidence (R10)"
    ```

    No rebasees después: los hashes de la tabla dejarían de valer.

## R11 — AASA publicado en Hostinger (humano)

No es tuyo. El humano sustituye `REPLACE_WITH_APPLE_TEAM_ID` por el Team ID,
sube el AASA y el `.htaccess` a Hostinger y comprueba la respuesta con
`curl`, con los pasos de [[requirements]] §Gate humano — R11, y marca su
casilla allí. No lo marques ni lo simules, y no escribas el Team ID en ningún
fichero aunque lo veas en la conversación del humano.

## R12 — Prueba de humo en iPhone (humano)

No es tuya. La corre el humano tras el veredicto del `reviewer`, en un dev
build de iOS de EAS instalado en su iPhone (no hay Mac ni simulador), con los
pasos de [[requirements]] §Prueba de humo del humano — R12 y la guía
§Feature 60, y marca su casilla allí. No la marques ni la simules.

## R13 — Regresión de Android (humano)

No es tuya. La corre el humano en el dev build de Android, con los pasos de
[[requirements]] §Regresión de Android del humano — R13, y marca su casilla
allí. No corras `bunx expo prebuild` ni `bunx expo run:android` para
adelantarla.

## Lo que NO hay que tocar

- `eas.json`: el perfil `development` ya sirve para iOS ([[design]] §D12).
  Si una herramienta propone escribir en él o en `app.json` fuera de lo que
  dice esta spec, responde que no y para.
- `package.json` y `bun.lock`: no hay dependencia nueva.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx`
  y `src/__tests__/ui-copy-table.ts`: no hay copy nueva en la app (el texto del
  permiso vive en `app.json`).
- `src/screens/map/index.tsx` y `src/api/media.ts`.
- En los tests, todo `it` existente salvo la línea de `#79 R2` de R5, y los
  helpers y mocks salvo lo que citan R1, R2, R3 y R8.
- En la guía, todo salvo la sección nueva de §Feature 60; en particular, la
  sección de #59 y su `REPLACE_WITH_DEV_BUILD_SHA256`.
- `../hosting/.well-known/assetlinks.json` y
  `../hosting/reset-password/index.html`.
- El `.env.example` de la raíz, `.env`, `google-services.json` y cualquier
  credencial.
- `src/__tests__/design-drift.test.ts`, `consistency-classnames.test.ts`,
  `hero-header-amendments.test.ts` y el resto de `src/__tests__/` salvo el test
  de hosting.
- `../docs/ui-guidelines.md`, `../feature_list.json`, `../STATUS.md` y
  `../progress/current.md`: los lleva el `leader`.
