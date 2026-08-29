---
feature: "android-map-never-ready"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[android-map-never-ready]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. **El historial de
> commits tiene que mostrar rojo antes que verde** (C4): un commit `test(...)`
> con el test fallando y otro `feat(...)`/`fix(...)` que lo pone verde. Meter
> test + implementación + docs en un solo commit es motivo de rechazo del
> reviewer.
>
> Antes de empezar: cargar la skill `expo:expo-overview` y leer los docs
> **versionados** https://docs.expo.dev/versions/v57.0.0/sdk/maps/ — nunca
> `latest`. No existe skill de `expo-maps`.

## R0 — Preparación (no es un requisito; sin ella nada compila)

- [ ] `cd mobile-pet-tracker && bunx expo install expo-maps` → debe quedar
      `"expo-maps": "~57.0.1"` en `package.json`
- [ ] `bun remove react-native-maps`
- [ ] Abrir `node_modules/expo-maps` y confirmar contra el código real: el
      export `GoogleMaps.View`, el nombre y los valores del enum de
      `colorScheme`, y las formas de `CameraPosition`, `GoogleMapsMarker` y
      `GoogleMapsPolyline`. Anotar en `progress/impl_android-map-never-ready.md`
      cualquier diferencia con lo que dicen los docs v57 y con
      [[design]] §D7 **antes** de escribir tests contra ellos
- [ ] Commit: `chore(map): swap react-native-maps for expo-maps`

## R1 — Wrapper `PetMap` con el contrato del tab Map

- [ ] (1) Escribir test que falla para R1 en
      `src/components/__tests__/pet-map.test.tsx` →
      `describe('R1: PetMap renderiza la vista de expo-maps con el contrato del tab Map', ...)`
      (mock de `expo-maps` según [[design]] §D7; assertea `testID="map-view"`
      y `style={{ flex: 1 }}`)
- [ ] (2) Implementación mínima: `src/components/pet-map.tsx` con `PetMap` y
      los tipos de [[requirements]] R1; `map.tsx` renderiza
      `<PetMap key={selectedPetId} …/>` y deja de importar `react-native-maps`
- [ ] (3) Refactor con tests verdes

## R2 — Cámara con `MAP_ZOOM`, sin deltas

- [ ] (1) Escribir test que falla para R2 →
      `describe('R2: la cámara se fija con MAP_ZOOM en vez de deltas', ...)`
      (assertea `cameraPosition` completo, `MAP_ZOOM === 16` y ausencia de
      `initialRegion` / `latitudeDelta` en las props de la vista)
- [ ] (2) Implementación mínima: `export const MAP_ZOOM = 16` y
      `cameraPosition={{ coordinates: center, zoom: MAP_ZOOM }}`;
      en `map.tsx`, `DEFAULT_REGION` → `DEFAULT_CENTER` sin deltas
- [ ] (3) Refactor con tests verdes

## R3 — Marker y polylines derivados de los datos

- [ ] (1) Escribir tests que fallan para R3, en dos sitios:
      `src/components/__tests__/pet-map.test.tsx` →
      `describe('R3: marker y polylines llegan a la vista como arrays', ...)`;
      y en `src/app/(tabs)/__tests__/map.test.tsx`, reescribiendo los `it` de
      los describes **existentes** `'R6: mapa y marker con la última posición'`
      y `'R7: ruta del día como polylines'` para assertear las props
      `markers` / `polylines` de `map-view`, renombrados a
      `it('R3 (android-map-never-ready): …')`.
      **No renombrar ningún `describe`**: los referencian
      `specs/mobile-map-live/traceability.md` y
      `specs/mobile-figma-polish/traceability.md`
- [ ] (2) Implementación mínima: derivación en `map.tsx`
      (`markers` de 0 o 1 elemento con `id: 'last-position'`; una polyline por
      trip con `id: 'trip-<index>'` y coordenadas mapeadas) y traducción en
      `PetMap`
- [ ] (3) Refactor con tests verdes

## R4 — Tema oscuro vía `colorScheme`

- [ ] (1) Escribir tests que fallan para R4:
      `describe('R4: el tema decide el colorScheme del mapa', ...)` en
      `pet-map.test.tsx`, y reescritura de los dos `it` del describe existente
      `'R7 (mobile-figma-polish): mapa adapta su base al tema'` en
      `map.test.tsx`, renombrados a `it('R4 (android-map-never-ready): …')`
- [ ] (2) Implementación mínima: `colorScheme` derivado de
      `useUniwind().theme` en `map.tsx` y mapeado a `'DARK'` / `'LIGHT'` en
      `PetMap`; **borrar `src/theme/map-style-dark.json`** y comprobar con
      `grep` que no queda ningún importador (C7)
- [ ] (3) Refactor con tests verdes

## R5 — La clave de Maps sobrevive por `android.config.googleMaps.apiKey`

- [ ] (1) Escribir test que falla para R5: en `app.config.test.ts`, reescribir
      el `it` de `describe('R1: la config resuelta inyecta la clave de Android
      desde el entorno')` (nombre del describe **intacto**) a
      `it('R5 (android-map-never-ready): fija android.config.googleMaps.apiKey y no declara plugin de mapas', ...)`
- [ ] (2) Implementación mínima: reescribir `app.config.ts` para fijar
      `android.config.googleMaps.apiKey` conservando el resto de `app.json`;
      el `console.warn` sin clave sigue nombrando
      `GOOGLE_MAPS_API_KEY_ANDROID` y `docs/verification.md`.
      **`.env.example` no se toca.** Comprobar que los describes `R2` y `R3`
      de ese archivo siguen verdes sin modificarlos
- [ ] (3) Refactor con tests verdes; añadir la nota de una línea en la fila R1
      de `specs/android-maps-api-key/traceability.md`

## R6 — Documentación coherente (carta de UI + verification)

- [ ] (1) No hay test: el "rojo" es la lista de seis puntos de
      [[requirements]] R6, sin marcar
- [ ] (2) Editar `docs/ui-guidelines.md` (puntos 1–4) y `docs/verification.md`
      (puntos 5–6, incluida la sección
      `### Feature 54 — android-map-never-ready` con el runbook literal de R8)
- [ ] (3) `grep` de repaso en `docs/`: no debe quedar viva ninguna mención a
      `customMapStyle`, `map-style-dark.json` ni "todo debe correr en Expo Go"

## R7 — Regresión y contención

- [ ] (1) Enumerar en `progress/impl_android-map-never-ready.md` la allowlist
      de [[requirements]] R7 y los testIDs que deben sobrevivir
- [ ] (2) Ejecutar y registrar salida: `bun run typecheck`, `bun run lint`,
      `bun run test` en `mobile-pet-tracker/` y `./init.sh` en la raíz
- [ ] (3) `git diff --stat main...HEAD` contra la allowlist; grep-clean C8;
      `grep -rn "react-native-maps" src/ app.config.ts app.config.test.ts package.json`
      vacío; `src/theme/map-style-dark.json` inexistente; registrar la
      desaparición de `map-marker` y `map-route-<i>`

## R8 — Smoke humano (NO delegable a ninguna IA)

- [ ] (1) Dejar el runbook escrito en `docs/verification.md` §Feature 54 y
      avisar al leader de que la feature queda a la espera del humano
- [ ] (2) El humano corre el prebuild, el dev build y el smoke en **ambos
      temas**, y confirma **por separado** tiles, marker y polyline
- [ ] (3) El humano registra el resultado (sin la clave) en
      `progress/impl_android-map-never-ready.md` y marca la segunda casilla de
      [[requirements]] §Aprobación. **"Monta sin crash y hay watermark" no
      cierra R8.**
