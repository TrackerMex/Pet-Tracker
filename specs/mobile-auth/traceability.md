---
feature: "mobile-auth"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-auth]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/api/__tests__/auth.test.ts::R1: login mapea la respuesta por kind` | `93c5257` test rojo → `a4b3841` feat verde |
| R2 | `mobile-pet-tracker/src/api/__tests__/auth.test.ts::R2: register mapea la respuesta por kind` | `93c5257` test rojo → `a4b3841` feat verde |
| R3 | `mobile-pet-tracker/src/providers/__tests__/auth-provider.test.tsx::R3: restaura la sesión desde secure store` | pendiente |
| R4 | `mobile-pet-tracker/src/providers/__tests__/auth-provider.test.tsx::R4: signIn y signOut` + reviewer: grep `expo-secure-store` en `src/api/` vacío | pendiente |
| R5 | `mobile-pet-tracker/src/app/__tests__/index.test.tsx::R5: splash navega según sesión` | pendiente |
| R6 | `mobile-pet-tracker/src/app/__tests__/health.test.tsx` (suites de #31/#32 movidas, verde con solo imports cambiados) + reviewer: diff solo de paths | pendiente |
| R7 | `mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx::R7: login llama a la api y navega` | pendiente |
| R8 | `mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx::R8: register llama a la api y navega` | pendiente |
| R9 | `mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx::R9: forgot es un stub deshabilitado` | pendiente |
| R10 | reviewer ejecuta `./init.sh` (exit 0) y `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` (vacío) | pendiente |
| R11 | gate humano — smoke en **Expo Go** sobre Android físico (checkbox en requirements §R11; sin builds) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-auth): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
