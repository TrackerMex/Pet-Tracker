---
feature: "mobile-push-registration"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-push-registration]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/__tests__/design-drift.test.ts::#79 R1: expo-notifications queda declarada y fijada` | `a4f0bc8c test(mobile-push-registration): lock expo-notifications dependency (R1)` rojo → `b1204355 spec(mobile-push-registration): propaga E1 y pasa los comandos a bun` dependencia/candado → `a6690b38 feat(mobile-push-registration): lock expo-notifications dependency (R1)` verde |
| R2 | `mobile-pet-tracker/app.config.test.ts::#79 R2: app.json declara el plugin de notificaciones y POST_NOTIFICATIONS` | `fc64f48b test(mobile-push-registration): lock notification app config (R2)` rojo → `97c6e789 feat(mobile-push-registration): configure notifications plugin (R2)` verde |
| R3 | `mobile-pet-tracker/src/api/__tests__/push-tokens.test.ts::R3: registerPushToken mapea POST me/push-tokens por kind` | `b9bf0010 test(mobile-push-registration): specify push token registration (R3)` rojo → `0ba16d6b feat(mobile-push-registration): register push tokens (R3)` verde |
| R4 | `mobile-pet-tracker/src/api/__tests__/push-tokens.test.ts::R4: deletePushToken manda el expoToken en el body del DELETE` | `fed46e38 test(mobile-push-registration): specify push token deletion (R4)` rojo → `ebf79356 feat(mobile-push-registration): delete push tokens with body (R4)` verde |
| R5 | `mobile-pet-tracker/src/providers/__tests__/auth-provider.test.tsx::#79 R5: signOut borra el push token antes que la sesión` | `4f18dd80 test(mobile-push-registration): specify push cleanup on sign-out (R5)` rojo → `faa03cfa feat(mobile-push-registration): delete push token before sign-out (R5)` verde → `0ba7eb7e test(mobile-push-registration): keep auth probe render pure (R5)` |
| R6 | `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx::R6: el hook no toca expo-notifications ni la API sin las precondiciones` | `0b809f8b test(mobile-push-registration): guard unsupported push registration (R6)` rojo → `ea62e3fd feat(mobile-push-registration): guard push registration prerequisites (R6)` verde |
| R7 | `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx::R7: el permiso se pide solo con granted false y canAskAgain true` | `68a514d4 test(mobile-push-registration): specify notification permission flow (R7)` rojo → `9e48f2c3 feat(mobile-push-registration): request notification permission safely (R7)` verde |
| R8 | `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx::R8: obtiene el token con el projectId, lo publica y hace POST` | `9fe60971 test(mobile-push-registration): specify push token publication (R8)` rojo → `b7fbd56e test(mobile-push-registration): await hook remount cleanup (R8)` → `8e85b485 feat(mobile-push-registration): publish and register Expo push token (R8)` verde |
| R9 | `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx::R9: un fallo de token o de red no rompe ni reintenta en la sesión` | `ac5a63a8 test(mobile-push-registration): specify push failure isolation (R9)` rojo → `c6e6a29a feat(mobile-push-registration): isolate push registration failures (R9)` verde |
| R10 | `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx::R10: banner en primer plano y tap que navega a /alerts`; `mobile-pet-tracker/src/hooks/use-push-registration.navigation.test.tsx::R10: cold start conserva alertas frente al redirect autenticado` | `1d404ebc test(mobile-push-registration): specify notification response routing (R10)` rojo → `be3f8bb5 feat(mobile-push-registration): route notification taps to alerts (R10)` verde; regresión del gate: `c231651a test(mobile-push-registration): reproduce cold-start redirect race (R10)` rojo → `0a68e99e fix(mobile-push-registration): defer cold-start routing (R10)` verde |
| R11 | `mobile-pet-tracker/src/app/__tests__/layout.test.tsx::#79 R11: el registro de push se monta dentro de AuthProvider` | `bdc95eff test(mobile-push-registration): specify root push registration mount (R11)` rojo → `0a3ee506 feat(mobile-push-registration): mount push registration in root layout (R11)` verde |
| R13 | `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx::R13: cada salida silenciosa se nombra en desarrollo` | `2cc99957 test(mobile-push-registration): name the skipped push path in dev (R13)` rojo → `387d71be feat(mobile-push-registration): warn in dev when push registration is skipped (R13)` verde → `bda615ee test(mobile-push-registration): type the dev flag override (R13)` |
| R14 | `mobile-pet-tracker/app.config.test.ts::#79 R14: google-services.json se declara solo cuando existe` | `63e981d4 test(mobile-push-registration): require google services file wiring (R14)` rojo → `d8703096 feat(mobile-push-registration): wire google-services.json when present (R14)` verde |
| R12 | pendiente: gate humano sin test automático; ver `progress/impl_mobile-push-registration.md` §R12 | pendiente: no ejecutado |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-push-registration): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Notas de esta feature

- **R12 no tiene test automático**: es el gate humano de
  [[requirements]] §Prueba de humo. Su fila se cierra con la referencia a
  `progress/impl_mobile-push-registration.md` §R12 y la fecha de la firma del
  humano, no con un hash de commit de test.
- **Los hashes se anotan cuando el commit ya es definitivo.** Si la branch se
  rebasea después de rellenar esta tabla, los hashes dejan de existir: hay que
  reapuntarlos y verificar con `git merge-base --is-ancestor <hash> HEAD` que
  cada uno sigue en el historial (lección de #87).
- **Ficheros de test que esta feature toca** (para que el reviewer sepa dónde
  mirar): `src/__tests__/design-drift.test.ts` (R1), `app.config.test.ts` (R2),
  `src/api/__tests__/push-tokens.test.ts` (R3, R4),
  `src/providers/__tests__/auth-provider.test.tsx` (R5),
  `src/hooks/use-push-registration.test.tsx` (R6-R10),
  `src/hooks/use-push-registration.navigation.test.tsx` (regresión de R10),
  `src/app/__tests__/layout.test.tsx` (R11). Todos bajo `mobile-pet-tracker/`.
