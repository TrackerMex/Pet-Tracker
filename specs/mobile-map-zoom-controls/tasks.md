---
feature: "mobile-map-zoom-controls"
status: draft     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-map-zoom-controls]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. **El historial de
> commits tiene que mostrar rojo antes que verde** (C4): un commit `test(...)`
> con el test fallando y otro `fix(...)` que lo pone verde. Meter test +
> implementación + docs en un solo commit es motivo de rechazo del reviewer.
>
> Antes de empezar: cargar la skill `expo:expo-overview` y leer los tipos
> instalados en `mobile-pet-tracker/node_modules/expo-maps/build/google/GoogleMaps.types.d.ts`
> (no los docs `latest`). No existe skill de `expo-maps`.
>
> Rama: `feature/55-mobile-map-zoom-controls`, sacada de
> `feature/54-android-map-never-ready` mientras #54 no esté en `main`.

## R1 — El wrapper oculta los controles nativos de zoom

- [ ] (1) Escribir test que falla para R1 en
      `src/components/__tests__/pet-map.test.tsx` →
      `describe('R1 (mobile-map-zoom-controls): el wrapper oculta los controles nativos de zoom', ...)`,
      reutilizando el mock de `expo-maps` y el patrón
      `screen.getByTestId('map-view').props.<prop>` que **ya existen** en el
      archivo. Assertea `uiSettings` con `toEqual({ zoomControlsEnabled: false })`
      y `expect(mapProps).not.toHaveProperty('contentPadding')`.
      **No renombrar ni tocar** los describes `R1`–`R4` existentes (los
      referencia `specs/android-map-never-ready/traceability.md`).
      Commit: `test(map): require hidden zoom controls (R1)` — sin una sola
      línea de producción
- [ ] (2) Implementación mínima: en `src/components/pet-map.tsx`, añadir
      `uiSettings: { zoomControlsEnabled: false }` a `mapViewProps`. Nada más:
      ni export nuevo, ni constante nueva, ni `zoomGesturesEnabled`, ni
      `contentPadding`, ni cambios en `src/app/(tabs)/map.tsx`.
      Commit: `fix(map): hide native zoom controls (R1)`
- [ ] (3) Refactor con tests verdes — se espera que **no haya nada que
      refactorizar**; si aparece, es señal de que (2) creció de más

## R2 — Contención, regresión verde y runbook del smoke

- [ ] (1) Enumerar en `progress/impl_mobile-map-zoom-controls.md` la allowlist
      de [[requirements]] R2 y los testIDs que deben sobrevivir
- [ ] (2) Escribir en `docs/verification.md` la sección
      `### Feature 55 — mobile-map-zoom-controls` con el runbook literal de R3
      (`bunx expo start --dev-client` sobre el dev build ya instalado; **sin**
      `prebuild` ni `run:android`, porque el cambio es solo JS), siguiendo el
      patrón de `### Feature 54`.
      Commit: `docs(map): document zoom controls smoke (R2)`
- [ ] (3) Ejecutar y registrar salida: `bun run typecheck`, `bun run lint`,
      `bun run test` en `mobile-pet-tracker/` y `./init.sh` en la raíz;
      `git diff --stat` de la branch contra la allowlist; grep-clean C8;
      confirmar que `src/app/(tabs)/map.tsx` y su test tienen **cero líneas**
      de diff y que `progress/current.md` no se tocó

## R3 — Smoke humano (NO delegable a ninguna IA)

- [ ] (1) Avisar al leader de que la parte automatizable está cerrada y la
      feature queda a la espera del humano
- [ ] (2) El humano corre `bunx expo start --dev-client` sobre el dev build de
      #54 ya instalado, abre el tab Map con una mascota premium con última
      posición y confirma **por separado**: (a) sin botones `+` / `−` en la
      esquina inferior derecha, (b) pinch acerca y pinch inverso aleja, (c)
      siguen visibles tiles, marker, polyline, `map-stats` y Lost Mode
- [ ] (3) El humano registra el resultado en
      `progress/impl_mobile-map-zoom-controls.md` y marca la segunda casilla
      de [[requirements]] §Aprobación. **Un test verde de R1 no cierra R3**:
      `GoogleMaps.View` está mockeado
