---
feature: "mobile-pets-profile"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-pets-profile]] (#40)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/api/__tests__/users.test.ts::R1: getMe mapea users/me por kind`; `src/screens/profile/index.test.tsx::R1: me card` | `cf360d0` rojo → `8d2dd19` verde |
| R2 | `src/screens/profile/index.test.tsx::R2: estructura Figma`; `src/app/(tabs)/__tests__/profile.test.tsx::R2: route Profile delgada` | `42f2bbb` rojo → `0c0f5b0` verde |
| R3 | `src/screens/profile/index.test.tsx::R3: reminders-link y sign out` | `ea75755` rojo → `55dd4c9` verde (excepción C4/Q2: tests de backend-health retirados) |
| R4 | `src/utils/theme-preference.test.ts::R4: preferencia de tema persistente`; `src/screens/profile/index.test.tsx::R4: toggle persiste`; `src/app/__tests__/layout.test.tsx::R4: RootLayout restaura el tema` | `236ddde` rojo → `a2fb2e8` verde |
| R5 | `src/components/__tests__/pet-avatar.test.tsx::R5: PetAvatar blobatar determinista`; `src/app/(tabs)/__tests__/home.test.tsx::R5: Home usa el fallback blobatar compartido` | `90ad564` rojo → `a410eba` verde |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente (bloqueado por Q1) | pendiente |
| R9 | pendiente (comandos, no suite) | pendiente |
| R10 | pendiente (smoke humano, no automatizable) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-pets-profile): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
R10 se traza con la fecha del smoke en [[requirements]] §Aprobación.
