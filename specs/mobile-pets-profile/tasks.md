---
feature: "mobile-pets-profile"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-pets-profile]] (#40)

> Disciplina TDD (CHECKPOINTS C4): cada requisito cierra con historial
> rojo→verde en commits separados o claramente trazables — el test que
> nombra el R-id se escribe y falla ANTES de la implementación mínima.
> Orden sugerido: R4 y R5 (unidades aisladas) → R1 → R2/R3 (Profile) →
> R6/R7 (AddPet + foto) → R8 (Docs, tras Q1) → R9 → R10 (humano).

## R1 — getMe + card de cuenta en Profile

- [ ] (1) Escribir test que falla para R1 (`src/api/__tests__/users.test.ts` + `src/screens/profile/index.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`src/api/users.ts`, card `me-card`)
- [ ] (3) Refactor con tests verdes

## R2 — Profile según Figma (route delgada + screen body + Skeleton)

- [ ] (1) Escribir test que falla para R2 (`src/screens/profile/index.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`src/screens/profile/index.tsx`, `src/app/(tabs)/profile.tsx` delgado)
- [ ] (3) Refactor con tests verdes

## R3 — reminders-link y sign out conservados

- [ ] (1) Escribir test que falla para R3 (mock expo-router, assert `push('/reminders')`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — toggle de tema persistente

- [ ] (1) Escribir test que falla para R4 (`src/utils/theme-preference.test.ts` + describe en profile)
- [ ] (2) Implementación mínima que lo pasa (`theme-preference.ts`, restauración en `_layout.tsx`)
- [ ] (3) Refactor con tests verdes

## R5 — PetAvatar blobatar determinista (Profile + AddPet + Home)

- [ ] (1) Escribir test que falla para R5 (`src/components/__tests__/pet-avatar.test.tsx` + extensión `home.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`bun add blobatar`, `src/components/pet-avatar.tsx`, swap en `home.tsx`)
- [ ] (3) Refactor con tests verdes

## R6 — AddPet: ruta, formulario y createPet

- [ ] (1) Escribir test que falla para R6 (`src/api/__tests__/pets.test.ts` extendido + `src/screens/add-pet/index.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`createPet`, `src/screens/add-pet/`, `src/app/pets/add.tsx`)
- [ ] (3) Refactor con tests verdes

## R7 — foto: picker + presigned POST + PUT + refetch

- [ ] (1) Escribir test que falla para R7 (`src/api/__tests__/media.test.ts` + describe en profile con picker mockeado)
- [ ] (2) Implementación mínima que lo pasa (`bunx expo install expo-image-picker`, `src/api/media.ts`, flujo en Profile/AddPet)
- [ ] (3) Refactor con tests verdes

## R8 — pantalla Docs (redacción final depende de Q1)

- [ ] (0) Q1 respondida en el gate; R8 redactado en firme en [[requirements]]
- [ ] (1) Escribir test que falla para R8 (`src/screens/docs/index.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`src/screens/docs/`, `src/app/pets/[petId]/docs.tsx`, api según Q1)
- [ ] (3) Refactor con tests verdes

## R9 — typecheck + lint + test verdes, design-drift, deps contenidas

- [ ] (1) Correr `bun run typecheck && bun run lint && bun run test` (falla si algo quedó fuera)
- [ ] (2) Corregir hasta exit 0 con suites previas intactas
- [ ] (3) Verificar diff de `package.json`: solo `blobatar` + `expo-image-picker`

## R10 — smoke humano Expo Go (gate, no lo ejecuta ninguna IA)

- [ ] Alta de mascota desde `/pets/add` contra backend local
- [ ] Foto real subida desde el dispositivo → visible en Profile y Home (S3 = LocalStack)
- [ ] Mascota sin foto: mismo blobatar tras recargar (determinismo)
- [ ] Toggle de tema persiste tras cerrar y reabrir la app
- [ ] `reminders-link` navega a Reminders
