# Handoff fix 4 — smoke R10: fix3 no surtió efecto, causa en la navegación (#40)

El smoke humano (2026-08-25) repite el síntoma tras fix3: el alta se
registra en backend pero Profile no la muestra hasta recargar la app. El
`useFocusEffect` de fix3 está bien puesto pero NO se dispara.

## Causa raíz (ya diagnosticada — no re-explores)

- Flujo PROBADO en producción (#39): `src/screens/add-reminder/index.tsx:78`
  vuelve con **`router.back()`** → la pantalla anterior recibe focus → su
  `useFocusEffect` refetchea. El humano validó ese smoke.
- AddPet (`src/screens/add-pet/index.tsx:186`) usa
  **`router.replace('/profile')`**. Sobre un **Tabs** navigator
  (`(tabs)/_layout.tsx` usa `<Tabs>`) la acción REPLACE no produce el ciclo
  blur/focus de un cambio de tab normal — el `useFocusEffect` de Profile no
  corre y la lista queda stale. Único punto de entrada a `/pets/add` es
  Profile (`src/screens/profile/index.tsx:199`), así que `back()` siempre
  regresa a Profile.
- Carrera secundaria en `src/screens/profile/index.tsx` (~línea 116):
  AddPet hace `selectPet(result.pet.id)` antes de navegar; al volver, el
  efecto de auto-select corre con `pets.data` stale (aún sin el pet nuevo),
  `selectionExists` da false y RESETEA la selección a `pets[0]` — pisa la
  selección del pet recién creado aunque el refetch luego traiga la lista
  buena.

## Qué hacer

1. `src/screens/add-pet/index.tsx`: en el caso `ok`, sustituir
   `router.replace('/profile' as Href)` por `router.back()` (mismo patrón
   que add-reminder). Ídem en el flujo de éxito con foto si navega aparte.
2. `src/screens/profile/index.tsx`: guardar la carrera del auto-select —
   no resetear la selección mientras la lista revalida:
   `if (pets.isRefreshing) return;` al inicio del efecto (además de los
   guards actuales). Con eso el pet recién creado queda seleccionado
   cuando el refetch resuelve.
3. TDD (C4): commits rojos primero —
   - `src/screens/add-pet/index.test.tsx`: en éxito se llama
     `router.back()` y NO `router.replace` (mock de expo-router).
   - `src/screens/profile/index.test.tsx`: con selección puesta a un id
     que aún no está en la lista y `isRefreshing` true, la selección NO se
     resetea; cuando la lista revalidada ya lo contiene, se conserva.
4. Trazabilidad: fila R6/R10 en
   `specs/mobile-pets-profile/traceability.md` (hallazgo smoke fix4) y
   append en `progress/impl_mobile-pets-profile.md` §R10 (smoke pendiente
   de repetirse).

## Reglas

- Cero dependencias nuevas. NO tocar `src/hooks/use-api.ts`, `_layout.tsx`
  raíz, `(tabs)/_layout.tsx`, `floating-tab-bar.tsx`,
  `backend-pet-tracker/`, `infra/`, `src/api/`.
- Al terminar: `bun run test`, `typecheck`, `lint` verdes en
  `mobile-pet-tracker/`; `./init.sh` exit 0. Commit en la branch
  `feature/40-mobile-pets-profile`, no pushees.
