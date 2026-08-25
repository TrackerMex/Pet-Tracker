# Handoff fix 3 — smoke R10: pet nuevo no aparece hasta refrescar la app (#40)

Hallazgo del smoke humano (2026-08-25, Expo Go): tras el alta en AddPet
(`router.replace('/profile')`), Profile NO muestra la mascota nueva; solo
aparece tras recargar la app completa.

## Causa raíz (ya diagnosticada — no re-explores)

Las pantallas de tabs quedan montadas y `useApi` solo dispara el fetch al
montar o con `refetch()`. `src/screens/profile/index.tsx` no refetchea al
recibir foco: la lista de pets (`useApi(petsFn)`, línea ~104) queda stale
al volver desde AddPet. Este MISMO síntoma se corrigió en #39 con
`useFocusEffect` de expo-router + `refetch` —patrón vivo en
`src/screens/reminders/index.tsx:50-58`. R6 de la spec exige "navegar de
vuelta a Profile con la mascota nueva visible (refetch de listPets)".

## Qué hacer

1. En `src/screens/profile/index.tsx`: aplicar el patrón exacto de
   Reminders — `useFocusEffect(useCallback(() => { pets.refetch();
   detail.refetch(); }, [...]))` (me no hace falta). El
   stale-while-revalidate de `use-api.ts` evita el flash: al refetch del
   mismo fn se conserva el valor previo mientras revalida.
2. Verificar `src/app/(tabs)/home.tsx` (y su lista de pets): si tampoco
   refetchea al foco, aplicar el mismo patrón ahí — el smoke R10 exige la
   mascota/foto nueva visible también en Home. Health/Food quedan fuera
   salvo que compartan el mismo hook en el mismo síntoma trivialmente
   (mismo patrón, un hook por pantalla); si los tocas, dilo en el reporte.
3. TDD (C4): commit del test rojo primero —
   `src/screens/profile/index.test.tsx` `describe('R10: refetch al foco')`
   simulando el focus (mock de `useFocusEffect` que ejecuta el callback,
   como en `src/screens/reminders/index.test.tsx`) y asertando que
   `listPets` se pide de nuevo. Ídem Home si aplica.
4. Trazabilidad: fila R6/R10 en
   `specs/mobile-pets-profile/traceability.md` (hallazgo smoke
   2026-08-25) y append en `progress/impl_mobile-pets-profile.md` §R10
   (smoke pendiente de repetirse).

## Reglas

- Cero dependencias nuevas. NO tocar `src/hooks/use-api.ts` (el hook ya
  hace lo correcto), `_layout.tsx`, `floating-tab-bar.tsx`,
  `backend-pet-tracker/`, `infra/`, `src/api/`.
- Al terminar: `bun run test`, `typecheck`, `lint` verdes en
  `mobile-pet-tracker/`; `./init.sh` exit 0. Commit en la branch
  `feature/40-mobile-pets-profile`, no pushees.
