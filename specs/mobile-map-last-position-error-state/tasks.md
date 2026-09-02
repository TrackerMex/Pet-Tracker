---
feature: "mobile-map-last-position-error-state"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-map-last-position-error-state]]

> Disciplina TDD. **El historial de commits tiene que mostrar rojo antes que
> verde** (C4): el commit de tests se hace ANTES del único commit de
> producción que pone verde R1–R4 (es el mismo diff de `map.tsx` para los
> cuatro). Meter test + implementación + docs en un solo commit es motivo de
> rechazo del reviewer (pasó en #19).
>
> Feature de UI móvil: antes de tocar nada, cargar la skill
> `expo:expo-overview` (en Codex: plugin `expo`) y
> `appllama-app-design-skill`, y leer `docs/ui-guidelines.md` — de la skill
> se toma el patrón, JAMÁS su sistema de estilos (la carta gana). Leer
> [[requirements]] §Contexto fijo y [[design]] D1–D6: no hay decisiones
> abiertas.
>
> Isla bun: todos los comandos de test/typecheck/lint se corren desde
> `mobile-pet-tracker/`. Suite objetivo:
> `bun run test -- 'src/app/(tabs)/__tests__/map.test.tsx' --runInBand`.
>
> Rama: `feature/56-mobile-map-last-position-error-state`, sacada de `main`
> (ya creada por el leader).

## R1–R4 — Tests rojos (un solo commit de test)

- [ ] (1) Añadir a `src/app/(tabs)/__tests__/map.test.tsx` (SOLO adiciones,
      ningún test existente se toca) los 4 describes con sufijo H5
      `(mobile-map-last-position-error-state)` y ~7 its de
      [[requirements]] R1–R4, usando los helpers ya presentes
      (`makePet`, `makeLastPosition`, `pending`, `renderMap`,
      `mockUseAuth`):
      - R1: rama de error de last (3 its: mensaje+Retry con `error`;
        Retry→refetch→mapa; pin `bg-background` en `map-last-error-state` +
        `screen-map` sin `bg-`)
      - R2: `unauthorized` de last comparte rama + `signOut` llamado
        (capturar `signOut` propio, [[design]] §D6)
      - R3: it.each `unreachable`/`missing-config` → rama + Retry; y el it
        de exclusión mutua vía toggle de Lost Mode con `refetchPets`
        cayendo a `unreachable` ([[requirements]] R3c, secuencia exacta ahí)
      - R4: `unauthorized` de pets → `map-error` + `signOut`, sin llamada a
        `getLastPosition`
      **ROJO**: los testIDs `map-last-error*` no existen y `map-error` no
      cubre `unauthorized` — registrar la salida roja (tests nuevos
      fallando, 32 previos verdes) en
      `progress/impl_mobile-map-last-position-error-state.md`.
      Commit: `test(map): red coverage for last position error kinds (R1-R4)`
      — sin una sola línea de producción

## R1–R4 — Implementación mínima (un solo diff de producción)

- [ ] (2) En `src/app/(tabs)/map.tsx`, exactamente los cambios de [[design]]
      D3–D5: helper `isLastError` (switch exhaustivo, sin `default`,
      retorno anotado `: boolean`); `isPetsError` al mismo patrón con
      `unauthorized`; derivado `petsReady` + `isLoading` factorizado; gates
      `petsReady` en las ramas `no-tracking` y `ok`; rama B5 nueva tras la
      de `no-tracking` (JSX literal en D5); import de
      `type LastPositionState`. Nada más.
      Commit: `fix(map): render error branch for last position kinds (R1-R4)`
      — suite del Map verde (~39/39), `bun run typecheck` y `bun run lint`
      verdes
- [ ] (3) Refactor con tests verdes — se espera que **no haya nada que
      refactorizar**; si aparece, es señal de que (2) creció de más

## R5 — Cierre y contención

- [ ] (1) Rellenar `traceability.md` (archivo::describe::it + hashes de los
      dos commits por fila) y marcar las casillas de este archivo
- [ ] (2) Ejecutar y registrar salida completa en
      `progress/impl_mobile-map-last-position-error-state.md`:
      `bun run test -- 'src/app/(tabs)/__tests__/map.test.tsx' --runInBand`,
      `bun run typecheck`, `bun run lint` (desde `mobile-pet-tracker/`),
      `./init.sh` desde la raíz, y
      `git diff --stat main...HEAD` contra la allowlist de
      [[requirements]] R5 — confirmar **cero líneas** de diff en
      `pet-map.tsx`, `use-api.ts`, `auth-provider.tsx`,
      `(tabs)/_layout.tsx`, `src/api/*`, `progress/current.md`,
      `package.json` y `bun.lock`, y que `map.test.tsx` solo tiene
      adiciones
      Commit: `docs(map): traceability y verificación (R5)`
- [ ] (3) Avisar al leader: la feature queda lista para el `reviewer`. NO
      marcar #56 como `done`, NO crear el PR (flujo en
      `docs/conventions.md` §Branches y Pull Requests: eso viene tras el
      veredicto del reviewer)
