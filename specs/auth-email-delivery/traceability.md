---
feature: "auth-email-delivery"
status: approved     # draft | approved
tags: [harness, spec, backend, security]
---

# Trazabilidad — [[auth-email-delivery]]

Rutas de test relativas a `backend-pet-tracker/` (`src/…` para unitarios,
`test/…` para e2e).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts::R1: el emisor de reset publica el token en POST https://api.resend.com/emails` | rojo `3be8e9c` (`feat(auth-email-delivery): add reset test (R1)`); verde `9b77bb4` (`feat(auth-email-delivery): send reset email (R1)`) |
| R2 | `src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts::R2: el emisor de verificacion publica su token en POST https://api.resend.com/emails` | rojo `26ce596` (`feat(auth-email-delivery): add verify test (R2)`); verde `fc5aa18` (`feat(auth-email-delivery): send verification (R2)`) |
| R3 | `src/modules/auth/auth.module.spec.ts::R3 (auth-email-delivery): EMAIL_ENABLED selecciona los adaptadores Resend para los dos puertos` | pendiente |
| R4 | `src/modules/auth/auth.module.spec.ts::R4 (auth-email-delivery): EMAIL_ENABLED=true sin RESEND_API_KEY aborta el arranque` | pendiente |
| R5 | `src/modules/auth/infrastructure/email/resend-client.spec.ts::R5: deliver resuelve antes que la respuesta del proveedor y contiene cualquier fallo` | rojo `b8ac577` (`feat(auth-email-delivery): add delivery test (R5)`); verde `536040f` (`feat(auth-email-delivery): contain delivery (R5)`) |
| R6 | `src/modules/auth/infrastructure/auth.controller.spec.ts::R6 (auth-email-delivery): forgot-password responde 200 identico aunque el emisor falle`; `test/auth-email-delivery.e2e-spec.ts::R6: con el emisor lanzando, forgot-password sigue devolviendo 200 requested true` | pendiente |
| R7 | `src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts::R7: el emisor de reset no escribe el token ni la API key en ningun log`; `src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts::R7: el emisor de verificacion no escribe el token ni la API key en ningun log` | pendiente |
| R8 | `src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts::R8: el cuarto forgot-password del mismo email en una hora responde 429`; `test/auth-email-delivery.e2e-spec.ts::R8: forgot-password devuelve 429 tras agotar el cupo del email` | pendiente |
| R9 | `src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts::R9: la undecima alta desde la misma IP en una hora responde 429` | pendiente |
| R10 | `src/modules/auth/infrastructure/auth.controller.spec.ts::R10 (auth-email-delivery): el 429 del rate limit no revela si la cuenta existe` | pendiente |
| R11 | `src/modules/auth/infrastructure/email/resend-client.spec.ts::R11: RESEND_API_KEY vive solo en el entorno, nunca en el repo` | pendiente |
| R12 | `test/auth-email-delivery.e2e-spec.ts::R12: con EMAIL_ENABLED por defecto los flujos de #44 siguen intactos` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Los nombres exactos de cada `describe` están fijados en [[requirements]] y
repetidos en [[tasks]]: al rellenar una fila se copian literalmente, no se
reescriben. El sufijo `(auth-email-delivery)` de R3, R4, R6 y R10 es
**obligatorio** — esos R-ids aterrizan en ficheros de test compartidos con
`auth-registration`, `auth-login-me` y `auth-forgot-password`, y sin él un
`grep 'R3:'` devuelve dos features distintas (hallazgo H5 de
`progress/review_auth-forgot-password.md`).

## Gates humanos (no son filas de esta tabla, pero bloquean el cierre)

| Gate | Qué confirma el humano | Estado |
|---|---|---|
| G1 | Subdominio dado de alta en Resend, registros MX/SPF/DKIM copiados al panel de Hostinger, dominio verificado, raíz sin tocar | pendiente |
| G2 | `RESEND_API_KEY` creada y puesta solo en el `.env` de la raíz | pendiente |
| G3 | Envío real: reset completado con el token del correo **y** verificación de email completada con el suyo | pendiente |
| G4 | El buzón humano de Hostinger sigue enviando y recibiendo tras el cambio de DNS | pendiente |
