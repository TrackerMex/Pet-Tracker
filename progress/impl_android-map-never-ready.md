# Implementación — android-map-never-ready

## Estado

- Feature #54 en implementación sobre `feature/54-android-map-never-ready`.
- R1–R7: pendientes de implementación/verificación.
- R8: pendiente de smoke humano en dev build de Android; no lo cierra esta sesión.

## R0 — instalación y contraste de la API real

Fuentes contrastadas antes de escribir tests:

- documentación versionada de Expo SDK 57:
  `https://docs.expo.dev/versions/v57.0.0/sdk/maps/`;
- código instalado en `mobile-pet-tracker/node_modules/expo-maps`.

Comandos:

| Comando | Exit code | Resultado |
|---|---:|---|
| `./init.sh` | 0 | Baseline verde antes de tocar la feature. |
| `bunx expo install expo-maps` | 1 | Instaló `expo-maps@57.0.2`; después falló al no poder añadir automáticamente `expo-maps` a la config dinámica. La sugerencia de plugin se rechaza deliberadamente por D2/R5: la app no usa ubicación. |
| `bun remove react-native-maps` | 0 | Eliminó `react-native-maps@1.27.2` y actualizó `bun.lock`. |
| `bun add expo-maps@~57.0.1` | 0 | Restauró en el manifiesto el rango firmado por R7/D9; Bun resolvió `57.0.2`, compatible con ese rango. |

### Diferencias encontradas antes de los tests

1. La documentación v57 consultada el 2026-08-29 y `expo install` recomiendan
   `~57.0.2`, mientras requirements R7 y design D9 fijan la declaración
   `~57.0.1`. Se conserva el rango contractual `~57.0.1`; el paquete resuelto
   por ese rango es `57.0.2`, cuyo changelog indica como único
   cambio frente a 57.0.1 la adición del tipo `Circle` al namespace
   `GoogleMaps`, sin cambio en la superficie usada por esta feature.
2. Design D7 representa el enum como export top-level
   `GoogleMapsColorScheme`. En `expo-maps@57.0.2`, `src/index.ts` no exporta
   ese símbolo directamente: la API pública real es
   `GoogleMaps.MapColorScheme`, que referencia internamente
   `GoogleMapsColorScheme`. Sus valores sí coinciden con docs/D7:
   `LIGHT = 'LIGHT'`, `DARK = 'DARK'` y
   `FOLLOW_SYSTEM = 'FOLLOW_SYSTEM'`. Los tests y la implementación usarán
   la forma pública real del namespace.
3. Las demás formas coinciden con los docs y el diseño:
   `GoogleMaps.View`; `CameraPosition` con `coordinates?` y `zoom?`;
   `GoogleMapsMarker` con `id?` y `coordinates?`; y
   `GoogleMapsPolyline` con `id?`, `coordinates` y `color?`.

## TDD por requisito

| R-id | Commit rojo | Resultado rojo | Commit verde | Resultado verde |
|---|---|---|---|---|
| R1 | `a574f44` | exit 1: `Cannot find module '../pet-map'` | `e99ec43` | test dirigido: 1 suite / 1 test verde; `bun run typecheck`: exit 0 |
| R2 | `1036737` | exit 1: `MAP_ZOOM` esperado 16, recibido `undefined`; R1 seguía verde | `b2080a8` | test dirigido: 1 suite / 2 tests verdes; `bun run typecheck`: exit 0 |
| R3 | `07e8beb` | wrapper exit 1: `markers`/`polylines` recibidos como `undefined`; tab mostró los fallos equivalentes en props (la corrida completa se interrumpió con 130 tras el fallo heredado de `map-marker` en polling, adaptado en el propio commit rojo) | `52518da` | wrapper: 1 suite / 5 tests verdes; tab filtrado: 7 tests verdes (6 R3 + polling); `bun run typecheck`: exit 0 |
| R4 | `1af4623` | wrapper y tab: exit 1; `colorScheme` esperado `DARK`/`LIGHT`, recibido `undefined`; R1–R3 seguían verdes | `dbdfa27` | wrapper: 7/7 tests; tab: 31/31 tests; `bun run typecheck`: exit 0 |
| R5 | pendiente | pendiente | pendiente | pendiente |
| R6 | N/A (documentación) | checklist contractual sin aplicar | pendiente | pendiente |
| R7 | N/A (verificación) | allowlist/checks sin ejecutar | pendiente | pendiente |

## Resultado del smoke R8

Pendiente de ejecución por el humano en un dispositivo Android real. Un
watermark sin tiles no satisface R8.
