---
feature: "mobile-map-last-position-error-state"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-map-last-position-error-state]]

> Ver [[requirements]] para los requisitos. Feature de UI móvil: rige
> `docs/ui-guidelines.md` (cargar `expo:expo-overview` y
> `appllama-app-design-skill` antes de implementar — solo el patrón, nunca
> su sistema de estilos). Todo el cambio de producción vive en
> `mobile-pet-tracker/src/app/(tabs)/map.tsx`; ninguna otra capa se toca.
>
> Toda afirmación sobre el código se verificó el 2026-09-01 leyendo el
> fuente: `use-api.ts:29` hace `signOut()` en cualquier `unauthorized`,
> `(tabs)/_layout.tsx` redirige a `/login` en `unauthenticated`, y
> `tsconfig.json` móvil tiene `strict: true` (habilita el TS2366 de D3).

## Decisiones técnicas

### D1 — `unauthorized` de last comparte la rama de error; el enrutado ya existe (R2)

El "flujo de sesión expirada que ya usa el resto de la app" **es**
`useApi` → `signOut()` → `Redirect /login`, y Map ya lo tiene porque todos
sus fetches pasan por `useApi`. No se escribe ni una línea de navegación.
La rama compartida decide solo qué píxeles hay durante los frames en que
`signOut` (async, `SecureStore.deleteItemAsync`) aún no volteó el status —
y qué queda si ese `deleteItemAsync` lanza (en `auth-provider.tsx:64-67` el
`setState` no llegaría a ejecutarse y no habría redirect): mensaje + Retry
en vez de pantalla en blanco.

El precedente de `profile/index.tsx:313` (excluir `unauthorized` de su card
de error) no aplica aquí: profile tiene el resto de la pantalla pintada
detrás; en Map la rama ES la pantalla completa y excluir `unauthorized`
reproduce exactamente el defecto que esta feature cierra.

### D2 — La rama de error de last cubre los cuatro kinds no renderizables (R1, R3b)

`error`, `unauthorized`, `unreachable` y `missing-config` → B5. El "rebote"
por la rama de pets que asume `feature_list.json` solo es estanco para
`missing-config` (mismo `baseUrl` constante en el mismo render);
`unreachable` puede golpear solo a `last` cuando la red cae después de que
pets resolviera `ok` (el poll de 15s refetchea `last`, no pets). Asignar
los cuatro al mismo `true` del switch cuesta cero código y hace la pantalla
total: ningún kind presente o futuro de `LastPositionState` queda sin
píxeles.

### D3 — Exhaustividad por compilador, no por prosa ni por test (R3a, R4)

```ts
function isLastError(state: LastPositionState): boolean {
  switch (state.kind) {
    case 'ok':
    case 'no-tracking':
      return false;
    case 'error':
    case 'unauthorized':
    case 'unreachable':
    case 'missing-config':
      return true;
  }
}
```

Sin `default` y con el retorno **anotado** `: boolean` — ambas cosas son
carga estructural, no estilo: con `strict: true`, un kind nuevo en
`LastPositionState` hace que el switch pueda "caer al final" y `tsc` falla
con TS2366 ("Function lacks ending return statement and return type does
not include 'undefined'"). Quien añada un kind está obligado a asignarle
rama para que el repo vuelva a compilar. Un comentario no obliga; un test
por-kind hay que acordarse de ampliarlo; TS2366 no se puede ignorar.

`isPetsError` (hoy `['error','unreachable','missing-config'].includes(...)`,
`map.tsx:18-20`) migra al mismo patrón sobre `PetsState`, sumando
`unauthorized` → `true` (R4: mismo defecto de pantalla en blanco, misma
pantalla, +1 case):

```ts
function isPetsError(state: PetsState): boolean {
  switch (state.kind) {
    case 'ok':
      return false;
    case 'unauthorized':
    case 'error':
    case 'unreachable':
    case 'missing-config':
      return true;
  }
}
```

### D4 — Exclusión mutua con un solo derivado `petsReady` (R3c)

```ts
const petsReady = pets.data?.kind === 'ok' && pets.data.pets.length > 0;
const isLoading =
  pets.data === undefined || (petsReady && last.data === undefined);
```

`petsReady` gatea B4 (`no-tracking`), B5 (nueva) y B6 (mapa). Hoy B4 y B6
solo miran `last.data`, y `useApi` retiene `last.data` mientras `lastFn` no
cambie: si pets cae a error (p. ej. el `refetchPets` tras un toggle de Lost
Mode devuelve `unreachable`), la rama de error de pets y la del mapa
renderizan **apiladas**. Con el gate, B2 queda sola. `isLoading` reutiliza
el derivado sin cambiar semántica (es la misma expresión de hoy,
factorizada).

### D5 — La rama B5: patrón calcado de la de pets, testIDs propios (R1)

```tsx
{petsReady && last.data && isLastError(last.data) ? (
  <View
    testID="map-last-error-state"
    className="flex-1 items-center justify-center gap-3 p-6 bg-background"
  >
    <Text selectable testID="map-last-error" className="text-danger">
      Something went wrong
    </Text>
    <Button testID="map-last-retry" onPress={refetchLast}>
      Retry
    </Button>
  </View>
) : null}
```

- Se inserta entre la rama `no-tracking` y la rama `ok` del JSX actual
  (tras `map.tsx:205`).
- testIDs nuevos (`map-error`/`map-retry` ya son de la rama de pets):
  contenedor + texto + botón, mismo reparto que el precedente
  `map-empty-overlay`/`map-empty`. El contenedor con testID existe para que
  el test de §10 pueda assertear su `className` (`bg-background` presente)
  igual que el pin de #54 assertea que `screen-map` no tiene `bg-`.
- `selectable` en el `Text`: micro-regla de la carta para mensajes de error
  (la rama de pets es anterior a la regla y NO se retoca — allowlist).
- Texto y label idénticos a la rama de pets (`Something went wrong` /
  `Retry`): un solo vocabulario de error en la pantalla.
- `onPress={refetchLast}` — el alias ya existe (`map.tsx:81`).
- Imports: añadir `type LastPositionState` al import de
  `../../api/positions` (línea 9). `PetsState` ya se importa como type.
- El poll de 15s sigue corriendo en estado de error (el guard de
  `useFocusEffect` solo excluye `no-tracking`): auto-recuperación gratis
  cada 15s además del Retry manual. No se toca.

### D6 — Tests: solo adiciones al archivo compartido, sufijo H5 (R1–R4)

`src/app/(tabs)/__tests__/map.test.tsx` ya trae todo el arnés necesario
(mocks de `expo-maps`, `expo-router`, `uniwind`, `useAuth`; helpers
`makePet`/`makeLastPosition`/`pending`; `renderMap`). Cero infraestructura
nueva. Por ser archivo COMPARTIDO entre features, cada describe nuevo lleva
el sufijo `(mobile-map-last-position-error-state)` — regla H5 del review de
#44, mismo patrón que los `R8 (android-map-never-ready)` que ya conviven en
el archivo. Ningún test existente se modifica: los gates de D4 solo cambian
render en escenarios que ninguno de los 32 tests actuales construye (pets
no-ok con `last.data` retenido).

Para R2/R4 el test captura su propio `signOut`:

```ts
const signOut = jest.fn();
mockUseAuth.mockReturnValue({
  status: 'authenticated',
  token: 'jwt-token',
  signIn: jest.fn(),
  signOut,
} satisfies AuthContextValue);
```

(el `signOut` mockeado no cambia el status, así que la pantalla queda
montada y la rama es asserteable — en producción el redirect desmonta).

## Archivos afectados

| Archivo | Capa | Qué cambia |
|---|---|---|
| `mobile-pet-tracker/src/app/(tabs)/map.tsx` | pantalla (UI) | helper `isLastError` nuevo (D3); `isPetsError` a switch exhaustivo con `unauthorized` (D3); derivado `petsReady` + `isLoading` factorizado (D4); gates en B4/B6 y rama B5 nueva (D5); import de `type LastPositionState` |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` | test | ~7 its nuevos en 4 describes con sufijo de feature (D6); solo adiciones |
| `specs/mobile-map-last-position-error-state/traceability.md` | spec | el implementer rellena filas tras cada commit |
| `progress/impl_mobile-map-last-position-error-state.md` | progress (nuevo) | reporte del implementer: rojo, verde, comandos R5 |
| `feature_list.json` | harness | status de #56 (`in_progress` al arrancar; `done` lo pone solo el leader con veredicto) |

**Sin cambios** (lista negativa, R5): `src/components/pet-map.tsx`,
`src/hooks/use-api.ts`, `src/providers/auth-provider.tsx`,
`src/app/(tabs)/_layout.tsx`, `src/api/positions.ts`, `src/api/pets.ts`,
`progress/current.md`, `package.json`, `bun.lock`, y cualquier otra
pantalla.

Rama y PR: `feature/56-mobile-map-last-position-error-state`, sacada de
`main`.

## Alternativas descartadas

- **Rama/pantalla dedicada "Session expired" para `unauthorized`**: el
  enrutado ya lo hace `useApi` + `Redirect`; una UI dedicada es código y un
  segundo mensaje para unos frames de transición. Si el redirect falla, el
  mensaje genérico + Retry es tan útil como uno específico (el Retry
  re-dispara el fetch → `unauthorized` de nuevo → nuevo intento de
  `signOut`).
- **Excluir `unauthorized` de la rama (patrón de profile)**: en profile hay
  contenido pintado detrás; en Map excluirlo ES el defecto (pantalla en
  blanco hasta el redirect, blanca incluso en dark).
- **Confiar en el rebote de pets para `unreachable`/`missing-config`** (lo
  que asume la entrada del feature_list): no es estanco para `unreachable`
  con el poll de 15s (D2). Cubrirlos en B5 cuesta cero.
- **Exhaustividad por test de runtime** (iterar los kinds y assertear que
  alguna rama renderiza): no obliga a nada al añadir un kind — el test
  seguiría verde iterando los kinds viejos. TS2366 sí obliga (D3).
- **Rama catch-all `else` al final del JSX**: pintaría algo para kinds
  nuevos sin que nadie decida su rama — exactamente lo contrario del
  criterio 3 de la feature.
- **`ThemeProvider` / `sceneStyle` tematizado** para que el fondo del
  contenedor de escena siga el tema: arregla el color del vacío, no el
  vacío; contradice el patrón §10 (cada estado pinta su fondo) y toca
  layout global desde una feature de una pantalla.
- **Tocar `use-api.ts` para exponer un estado `sessionExpired`**: más
  superficie compartida para una decisión que es de píxeles de una
  pantalla.
