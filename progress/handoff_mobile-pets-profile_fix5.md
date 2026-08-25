# Handoff fix 5 — smoke R10: card de Home regresa al pet #1 tras el alta (#40)

Hallazgo del smoke humano (2026-08-25): tras el alta, el avatar nuevo SÍ
aparece en el switcher de Home (el refetch al foco funciona), pero la card
grande regresa al primer pet de la lista — la selección del pet recién
creado se pierde al entrar a Home.

## Causa raíz (ya diagnosticada — no re-explores)

La MISMA carrera que fix4 corrigió en Profile existe duplicada y SIN guard
en tres pantallas: al recibir foco con `selectedPetId` = pet nuevo y
`pets.data` stale (sin ese id), el efecto de auto-select resetea la
selección global a `pets[0]`:

- `src/app/(tabs)/home.tsx:92-96`
- `src/app/(tabs)/health.tsx:~72-76`
- `src/app/(tabs)/food.tsx:~65-69`

Profile ya tiene el fix de referencia (`src/screens/profile/index.tsx:116-123`):
`if (pets.isRefreshing) return;` al inicio del efecto +
`pets.isRefreshing` en deps.

## Qué hacer

1. Aplicar EXACTAMENTE el mismo guard de Profile en las tres pantallas.
2. TDD (C4): commit rojo primero — en el test de cada pantalla (los tres
   ya tienen suite en `src/app/(tabs)/__tests__/`), caso análogo al que
   fix4 añadió para Profile: con selección puesta a un id ausente de la
   lista stale y `isRefreshing` true, NO se llama `selectPet`; al resolver
   la lista con el id presente, la selección se conserva.
3. Trazabilidad: fila R10 en `specs/mobile-pets-profile/traceability.md`
   (hallazgo smoke fix5) y append en
   `progress/impl_mobile-pets-profile.md` §R10 (smoke pendiente de
   repetirse). Nota para el futuro (solo anótala, NO la implementes): el
   efecto está cuadruplicado — candidato a hook compartido
   `use-pet-selection` cuando alguna feature vuelva a tocarlo.

## Reglas

- Cero dependencias nuevas. NO tocar `src/hooks/use-api.ts`,
  `src/providers/`, `_layout.tsx`, `floating-tab-bar.tsx`,
  `backend-pet-tracker/`, `infra/`, `src/api/`, `src/screens/` (Profile ya
  está bien).
- Al terminar: `bun run test`, `typecheck`, `lint` verdes en
  `mobile-pet-tracker/`; `./init.sh` exit 0. Commit en la branch
  `feature/40-mobile-pets-profile`, no pushees.
