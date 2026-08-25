# Handoff fix 2 — smoke R10: crash en AddPet fuera del provider (#40)

Hallazgo del smoke humano (2026-08-25, Expo Go): al abrir AddPet:

```
Error: useSelectedPet must be used within a SelectedPetProvider
  useSelectedPet (src/providers/selected-pet-provider.tsx:38)
  AddPetScreen (src/screens/add-pet/index.tsx:76)
```

## Causa raíz (ya diagnosticada — no re-explores)

`SelectedPetProvider` se monta SOLO en `src/app/(tabs)/_layout.tsx`. Las
rutas nuevas de #40 quedaron FUERA del grupo:

- `src/app/pets/add.tsx`
- `src/app/pets/[petId]/docs.tsx`

Al navegar ahí se sale del layout de tabs → sin provider → throw. Los
tests no lo cazaron porque renderizan los screens con wrapper propio, no
el árbol de rutas real.

## Qué hacer

1. MOVER los route files dentro del grupo (patrón #39 `add-reminder.tsx`):
   - `src/app/pets/add.tsx` → `src/app/(tabs)/pets/add.tsx`
   - `src/app/pets/[petId]/docs.tsx` → `src/app/(tabs)/pets/[petId]/docs.tsx`
   Las URLs no cambian (`(tabs)` es route group): `/pets/add` y
   `/pets/[petId]/docs` siguen iguales — cero cambios en los `router.push`
   existentes. Borra las carpetas viejas vacías.
2. Ajustar los tests de route file delgado a las rutas nuevas (mismo
   assert, ruta nueva). Si hay guardia de estructura que liste rutas
   (design-drift/R9), actualízala.
3. TDD (C4): commit del test rojo primero — un test que falle con la ruta
   fuera del grupo. Mínimo aceptable: extender el test del layout de tabs
   (`src/app/(tabs)/__tests__/layout.test.tsx` o el route test) para
   asertar que los route files de pets viven bajo `(tabs)` (p. ej.
   `require.resolve` de `../pets/add` relativo al grupo, o render del
   route real bajo el árbol de tabs sin wrapper manual). Si de verdad no
   es asertable con el harness actual, documenta excepción C4 en el
   commit citando este handoff.
4. Verificar que `docs.tsx` no tenga el mismo síntoma por otra vía (usa
   `useSelectedPet`? si sí, queda cubierto por el mismo move).
5. Trazabilidad: registrar en `specs/mobile-pets-profile/traceability.md`
   (cuelga de R2/R6/R8, hallazgo smoke R10) y append en
   `progress/impl_mobile-pets-profile.md` §R10 (fecha 2026-08-25,
   hallazgo, corrección, smoke pendiente de repetirse).

## Reglas

- Cero dependencias nuevas. NO tocar `_layout.tsx` raíz,
  `floating-tab-bar.tsx`, `backend-pet-tracker/`, `infra/`, `src/api/`.
- Al terminar: `bun run test`, `typecheck`, `lint` verdes en
  `mobile-pet-tracker/`; `./init.sh` exit 0. Commit en la branch
  `feature/40-mobile-pets-profile`, no pushees.
