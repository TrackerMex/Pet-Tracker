# Handoff a Codex CLI — #55 `mobile-map-zoom-controls`

```
Feature: mobile-map-zoom-controls (id 55), branch: feature/mobile-map-zoom-controls
Spec aprobada por humano el 2026-09-01: specs/mobile-map-zoom-controls/requirements.md (status: approved)
Lee también: specs/mobile-map-zoom-controls/design.md y tasks.md

OJO CON LA BRANCH: tasks.md dice "feature/55-mobile-map-zoom-controls, sacada de
feature/54-android-map-never-ready". Eso quedó obsoleto: #54 ya está mergeada en
main (PR #94) y el humano ya creó la branch **feature/mobile-map-zoom-controls**,
sacada de main, con la aprobación dentro. Trabaja en esa, sin renombrarla y sin
crear otra. El resto de la spec sigue vigente palabra por palabra.
main está protegida: no intentes commitear ni pushear ahí.

Archivos a crear/modificar:
  - mobile-pet-tracker/src/components/pet-map.tsx
  - mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx
  - docs/verification.md
  - specs/mobile-map-zoom-controls/traceability.md
  - progress/impl_mobile-map-zoom-controls.md   (créalo)

Reglas críticas:
  - Seguir convenciones de docs/conventions.md y la carta docs/ui-guidelines.md
  - Cargar las skills del plugin expo de Codex que la carta indica (expo-overview
    primero; el plugin ya está instalado). NO existe skill de expo-maps: para la
    API, lee los tipos instalados en
    mobile-pet-tracker/node_modules/expo-maps/build/google/GoogleMaps.types.d.ts,
    nunca los docs `latest`
  - TDD por requisito: test rojo → verde → refactor (ver tasks.md)
  - UN COMMIT POR REQUISITO como mínimo, con el test rojo ANTES que su
    implementación. Un único commit con todo incumple C4 de CHECKPOINTS.md.
    En #19 y en el fix 1 de #54 esto ya se señaló; que el historial muestre
    rojo→verde no es cosmético, es el gate
  - Actualizar specs/mobile-map-zoom-controls/traceability.md tras cada commit
  - Commitea en la branch. NO pushees y NO abras PR

Criterios de aceptación: R1 y R2 de requirements.md.
R3 es el smoke humano y no lo cierras tú.

Al terminar: escribir resultado en progress/impl_mobile-map-zoom-controls.md
```

## El cambio, entero

En `mobile-pet-tracker/src/components/pet-map.tsx`, añadir una clave al objeto
`mapViewProps` que ya existe:

```ts
uiSettings: { zoomControlsEnabled: false },
```

Nada más. Ni export nuevo, ni constante nueva, ni prop nueva en `PetMapProps`.

Verificado contra los tipos instalados de `expo-maps@57.0.2`:
`zoomControlsEnabled?: boolean` vive en `GoogleMapsUISettings`
(`GoogleMaps.types.d.ts:218`) y `uiSettings?: GoogleMapsUISettings` en
`GoogleMapsViewProps` (:352).

## Por qué, para que no lo "mejores"

Los controles nativos `+` / `−` que Google Maps dibuja en la esquina inferior
derecha quedan debajo del `FloatingTabBar` y de la tarjeta `map-stats`. Se
decidió **quitarlos**, no reubicarlos: el pinch-to-zoom es un gesto
independiente y sigue activo, que es lo que hacen Uber, DiDi y la propia app de
Google Maps.

`contentPadding` (la alternativa) está **descartada con motivo** en la entrada
#55 de `feature_list.json` y en `design.md` §D1: obliga a mantener a mano un
número sincronizado con el alto de dos overlays. No la reabras.

Solo se vio ahora porque hasta el 2026-09-01 la pantalla del mapa salía en
blanco (#54). El defecto estaba tapado por otro defecto.

## Prohibiciones

- **No toques `src/app/(tabs)/map.tsx` ni su test.** Cero líneas de diff. La
  pantalla no conoce `expo-maps` y no debe empezar a conocerlo. R2 lo assertea.
- **No pases `zoomGesturesEnabled`**, ni siquiera con `true`. El test usa
  `toEqual` exacto justo para impedirlo: convertir un default de la plataforma
  en estado que este repo mantiene es coste sin beneficio.
- **No pases `contentPadding`.**
- **No renombres ni edites** los `describe` `R1`–`R4` que ya existen en
  `pet-map.test.tsx`: los referencia `specs/android-map-never-ready/traceability.md`.
  Tu `describe` nuevo lleva sufijo de feature —
  `R1 (mobile-map-zoom-controls): …` — porque ese archivo ya tiene un `R1`.
- **No toques `progress/current.md`**: es territorio del leader
  (`CLAUDE.md` §Un solo escritor). En el fix 1 de #54 se escribió ahí; no se
  repite. Tu reporte va en `progress/impl_mobile-map-zoom-controls.md`.
- **No marques #55 como `done`** en `feature_list.json` ni cambies su estado.
  Lo hace el leader tras veredicto del reviewer, y R3 además necesita smoke
  humano.
- **No edites** `requirements.md`, `design.md` ni `tasks.md`. Solo
  `traceability.md`.
- **No toques** `specs/android-map-never-ready/**`, `app.config.ts`,
  `app.json`, `package.json`, `bun.lock` ni las dependencias.

## Lo que el test NO prueba

`pet-map.test.tsx` mockea `expo-maps` con un `View` stub, y tiene que hacerlo:
jest-expo corre en Node, sin Play services y sin superficie nativa. Tu test
verde prueba **que la prop viaja**, no que los botones desaparezcan ni que el
pinch siga funcionando. Eso lo cierra el humano en R3. No escribas en el
reporte que el defecto queda verificado por la suite.

## Al terminar

`bun run test`, `bun run typecheck` y `bun run lint` verdes en
`mobile-pet-tracker/`; `./init.sh` exit 0 desde la raíz. Si falla solo por el
flake de `add-pet`, es el conocido #53: reprodúcelo dirigido, déjalo anotado y
no lo arregles aquí.

En `progress/impl_mobile-map-zoom-controls.md` registra la allowlist de R2 con
el `git diff --stat` real, el grep-clean C8, y la confirmación explícita de que
`src/app/(tabs)/map.tsx` y su test tienen cero líneas de diff.
