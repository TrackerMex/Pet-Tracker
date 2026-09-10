# Implementacion — mobile-tanstack-query (#87)

- Branch: `feature/87-mobile-tanstack-query`
- Base: `main` @ `7f298f2` (la spec declara deltas de candados contra `5666b85`)
- Inicio: 2026-09-10
- Spec: aprobada por humano el 2026-09-10
- Skills: overview del plugin Expo + `native-data-fetching`; la skill literal
  `expo-overview` no existe en la version instalada y su `README.md` es el indice
  oficial del plugin. `tasks.md` descarta las skills de UI porque no se dibuja UI.
- Documentacion Expo leida: referencia versionada SDK 57.0.0.

## Linea base

- `env -u FORCE_COLOR bash ./init.sh`: verde.
- Suite movil: 68 suites, 1111 tests, 1 snapshot; todo verde.
- Typecheck movil: verde.
- Avisos preexistentes: `.env` sin `RESEND_API_KEY`, `RESEND_FROM` y
  `RESET_LINK_HOST`; no bloquean `init.sh` y #87 no usa esas variables.

## Trazabilidad de commits

| Requisito | Commit rojo | Commit verde | Evidencia |
|---|---|---|---|
| R1 | `2837dc3` | `a6e5cdf` | 2 aserciones rojas por dependencia ausente; test focal verde |
| R2 | `a231cdd` | `492cdab` | 5 aserciones rojas por opciones ausentes; test focal y typecheck verdes |
| R3 | `af1ac31` | `3cd184f` | 3 rojos por proveedor ausente; helper aislado y typecheck verdes |
| R4 | `cbceb6b` | `50cb93a` | orden y sonda verdes; el test desmonta y limpia su cliente para no dejar el timer de `gcTime` abierto |
| R5 | `49dc149` | `171ed65` | `unauthorized` rojo 0/1; callback global verde y no actúa sobre `ok`/`unreachable` |
| R6 | `2a5c404` | `fe9f282` | cache vaciada solo en `unauthenticated`; transicion loading→authenticated conserva datos |
| R7 | `1c947c4` | `b5e7f31` | 14 claves exactas, `limit` y prefijos verdes; typecheck verde |
| R8 | `cfe1b34` | `15b9eea` | forma minima verde; 10 pantallas antiguas siguen compilando |
| R9 | `07c4ba5` | `5e00853` | 2 entradas de cache, suite de Docs y typecheck verdes |
| R10 | `8a46cc7` | `97049e7` | clave con `limit: undefined`; 23 pruebas y typecheck verdes |
| R11 | `be536d1` | `6966af6` | 2 claves; `retryAll` y refresco tras generar preservados; 22 pruebas y typecheck verdes |
| R12 | `b4b279e` | `e1df8ef` | `enabled` del plan y candado de revalidacion real verdes; 23 pruebas y typecheck verdes |
| R13 | `b77c366` | `157a7a8` | 3 claves, peso con `limit: 1`, candado real; 28 pruebas y typecheck verdes |
| R14 | `6991074` | `0baba1d` | 2 claves; foco y mutacion preservados; 22 pruebas y typecheck verdes |
| R15 | `c204287` | `79363d9` | condicion triple, 2 focos y 2 mutaciones verdes; 48 pruebas y typecheck verdes |
| R16 | pendiente | pendiente | pendiente |
| R17 | pendiente | pendiente | pendiente |
| R18 | pendiente | pendiente | pendiente |
| R19 | pendiente | pendiente | pendiente |
| R20 | pendiente | pendiente | pendiente |

## Evidencia R20

Pendiente.

## Ajustes asincronos sin relajar aserciones

- R9, `src/screens/docs/index.tsx`: `Button.onPress` no puede recibir
  `query.refetch` directamente porque React Native le pasa un evento que no es
  `RefetchOptions`; se usa `() => void docs.refetch()`. Conducta visible y
  recuento esperado de llamadas intactos.
- R10, `src/app/(tabs)/weight-log.tsx`: mismo ajuste de tipo en el botón de
  reintento, con el mismo comportamiento observable.
- R12, `src/app/(tabs)/food.tsx`: los dos botones de reintento usan el mismo
  adaptador de evento `() => void query.refetch()`.
- R12, `src/app/(tabs)/__tests__/food.test.tsx`: se envolvieron en `waitFor`,
  sin cambiar valores esperados, las cuatro aserciones del esqueleto de plan y
  las cinco aserciones de títulos de card; la actualización de caché notifica en
  un turno asíncrono adicional.
- R13, `src/app/(tabs)/health.tsx`: los dos botones de reintento adaptan el evento
  de React Native y `vaccines.isRefreshing` pasa al equivalente v5
  `vaccines.isRefetching`; no cambia ningún valor esperado.
- R14, `src/screens/reminders/index.tsx`: el botón de reintento adapta el evento;
  el bloque `useFocusEffect` y el `signOut` de la mutación quedan intactos.
- R15, `src/screens/pairing/index.tsx`: el botón de reintento adapta el evento;
  permanecen dos `useFocusEffect` y las dos expulsiones de mutación.

## Cierre

Pendiente: suite movil, typecheck, lint, `init.sh`, deltas contra la linea base y
push final.
