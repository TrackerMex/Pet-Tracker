# Handoff fix 6 — smoke R10: la selección del pet nuevo se pisa desde pantallas desenfocadas (#40)

Smoke humano (2026-08-25, tras fix5): el pet nuevo aparece en el switcher,
pero al SELECCIONARLO la card vuelve al primer pet. fix4/fix5 no bastaron.

## Causa raíz (ya diagnosticada — no re-explores; esta es la definitiva)

Las pantallas de tabs quedan MONTADAS aunque estén desenfocadas, y el
efecto de auto-select (duplicado en 4 sitios) corre en TODAS cuando cambia
`selectedPetId` — `useEffect` no está gateado por foco:

1. Usuario toca el pet nuevo → `selectPet(newId)`.
2. Health y Food (montadas de visitas anteriores, desenfocadas) re-renderizan
   por el cambio de contexto; su `pets.data` es STALE (solo refetchean con
   `useFocusEffect`, que no corre desenfocado) y NO contiene `newId`.
3. Su efecto corre: `selectionExists` false → `selectPet(pets[0].id)` →
   pisa la selección global de vuelta al pet #1.
4. El guard `pets.isRefreshing` (fix5) no aplica: desenfocadas no están
   revalidando — solo stale. Por eso el bug sobrevivió.

Duplicados del efecto: `src/app/(tabs)/home.tsx`, `health.tsx`, `food.tsx`
y `src/screens/profile/index.tsx` (todos con el guard parcial de fix5).

## Qué hacer — extraer el hook compartido (fix raíz, no otro parche)

1. Crear `src/hooks/use-pet-selection.ts`: hook `usePetSelection(pets)`
   (recibe el `ApiResult` de la lista) que encapsula el auto-select con
   TRES guards, en este orden:
   - `const isFocused = useIsFocused()` — exportado por **expo-router**
     (`import { useIsFocused } from 'expo-router'`; verificado en
     `node_modules/expo-router/build/exports.d.ts:20`). Si `!isFocused`,
     NO tocar la selección: una pantalla desenfocada con lista stale no
     tiene autoridad sobre la selección global.
   - Si `pets.isRefreshing`, esperar (guard de fix5).
   - Si `pets.data?.kind !== 'ok'` o lista vacía, no hacer nada.
   Después: si `selectedPetId` no existe en la lista, `selectPet(pets[0])`
   (conducta original para pet borrado/primer arranque).
2. Reemplazar el efecto duplicado en las 4 pantallas por el hook (misma
   conducta observable en pantalla enfocada; cero cambios de UI).
3. TDD (C4): commit rojo primero —
   `src/hooks/use-pet-selection.test.tsx` (nuevo, colocado):
   - desenfocada (`useIsFocused` → false) + lista stale sin el id
     seleccionado → NO llama `selectPet` (la regresión de este bug);
   - enfocada + `isRefreshing` → no llama;
   - enfocada + lista ok sin el id → selecciona el primero;
   - enfocada + lista ok con el id → no llama.
   Los tests existentes de las 4 pantallas deben seguir verdes; si alguno
   mockea el efecto interno, ajustar solo el mock y documentarlo.
4. Trazabilidad: fila R10 (`hallazgo smoke fix6, hook compartido`) y
   append en `progress/impl_mobile-pets-profile.md` §R10.

## Reglas

- Cero dependencias nuevas (`useIsFocused` viene de expo-router, ya
  presente). NO tocar `src/hooks/use-api.ts`, `src/providers/`,
  `_layout.tsx`, `floating-tab-bar.tsx`, `backend-pet-tracker/`, `infra/`,
  `src/api/`.
- Al terminar: `bun run test`, `typecheck`, `lint` verdes en
  `mobile-pet-tracker/`; `./init.sh` exit 0. Commit en la branch
  `feature/40-mobile-pets-profile`, no pushees.
