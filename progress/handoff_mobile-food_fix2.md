# Handoff fix 2 smoke R11 — selector de pets con Avatar

Pedido del humano (2026-08-25, smoke R11 de #38): el cambio de mascota
debe usar el componente Avatar, no chips de solo texto.

## Estado actual

- Chips de texto (`Pressable` redondeado + `Text` con el nombre)
  DUPLICADOS en `src/app/(tabs)/home.tsx`, `health.tsx` y `food.tsx`
  (testID `pet-chip-${pet.id}` en las tres).
- `heroui-native` exporta `Avatar` (node_modules/heroui-native/lib/module/components/avatar).
- `Pet.photoUrl: string | null` en `src/api/types.ts:60`.

## Qué hacer

1. Extraer componente compartido `src/components/pet-switcher.tsx`
   (`PetSwitcher`): fila horizontal scrolleable de pets donde cada uno es
   un `Avatar` de heroui-native — imagen desde `photoUrl`, fallback con
   la inicial del nombre cuando es null — más el nombre; el seleccionado
   se distingue con anillo/fondo `accent` (tokens del tema, nada
   hardcodeado). Mantener EXACTOS los testID `pet-chip-${pet.id}`,
   `accessibilityRole="button"` y `accessibilityState={{ selected }}`.
   Props: `pets`, `selectedPetId`, `onSelect`.
2. Reemplazar el bloque duplicado en `home.tsx`, `health.tsx` y
   `food.tsx` por `<PetSwitcher …>`. Cero cambios de conducta: misma
   selección, mismo auto-select del primer pet.
3. TDD (C4): test rojo primero — `src/components/__tests__/pet-switcher.test.tsx`
   (render con foto, fallback inicial, selección, testIDs) — luego verde.
   Los tests existentes de las 3 pantallas deben seguir pasando SIN
   modificarlos (los testID se conservan); si alguno asserta el markup
   interno del chip, ese assert puede ajustarse y se documenta como
   excepción C4 en el commit.
4. Trazabilidad: registrar en `specs/mobile-food/traceability.md` (cuelga
   del hallazgo smoke R11) y append en `progress/impl_mobile-food.md`
   §R11.

## Reglas

- Cero dependencias nuevas. NO tocar `_layout.tsx`,
  `floating-tab-bar.tsx`, `backend-pet-tracker/`, `infra/`, `src/api/`.
- Al terminar: `bun run test`, `typecheck`, `lint` verdes en
  `mobile-pet-tracker/`.
