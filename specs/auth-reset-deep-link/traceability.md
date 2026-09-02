---
feature: "auth-reset-deep-link"
status: approved   # draft | spec_ready | approved
tags: [harness, spec, backend, mobile, security]
---

# Trazabilidad — [[auth-reset-deep-link]]

Rutas de test relativas a la raíz del repo salvo indicación: backend en
`backend-pet-tracker/` (`src/…` unitarios, `test/…` e2e), móvil en
`mobile-pet-tracker/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/auth/infrastructure/email/password-reset-link.spec.ts::R1: buildPasswordResetUrl compone https://<host>/reset-password?token=<token>`; `src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts::R1 (auth-reset-deep-link): el correo de reset incluye la URL del enlace ademas del token` | rojo `030076c` (`test(auth-reset-deep-link): add reset link tests (R1)`); verde `e0dfff8` (`feat(auth-reset-deep-link): add reset URL to email (R1)`) |
| R2 | `src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts::R2 (auth-reset-deep-link): con RESET_LINK_HOST el log incluye resetUrl`; `src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts::R2 (auth-reset-deep-link): sin RESET_LINK_HOST el log queda como en #44` | rojo `4b816e7` (`test(auth-reset-deep-link): add console reset URL tests (R2)`); verde `ada573c` (`feat(auth-reset-deep-link): log console reset URL (R2)`) |
| R3 | `src/modules/auth/auth.module.spec.ts::R3 (auth-reset-deep-link): EMAIL_ENABLED=true sin RESET_LINK_HOST aborta el arranque` | rojo `d433535` (`test(auth-reset-deep-link): add reset host config tests (R3)`); verde `0a96192` (`feat(auth-reset-deep-link): enforce reset host config (R3)`) |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | `src/__tests__/hosting-artifacts.test.ts::R9: assetlinks.json delega el dominio en el paquete Android de la app` | rojo `837ad2f` (`test(auth-reset-deep-link): add asset links test (R9)`); verde `9ba7e93` (`feat(auth-reset-deep-link): add Android asset links (R9)`) |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Los nombres exactos de cada `describe` están fijados en [[requirements]]:
al rellenar una fila se copian literalmente, no se reescriben. El sufijo
`(auth-reset-deep-link)` es **obligatorio** en los R-ids que aterrizan en
ficheros de test compartidos con otras features
(`resend-password-reset-sender.spec.ts`, `console-password-reset-sender.spec.ts`,
`auth.module.spec.ts`, `app.config.test.ts`, `src/api/__tests__/auth.test.ts`) —
hallazgo H5 de `progress/review_auth-forgot-password.md`.

## Gates humanos (no son filas de esta tabla, pero bloquean el cierre)

| Gate | Qué confirma el humano | Estado |
|---|---|---|
| G1 | Fingerprint SHA-256 del certificado de firma del **dev build de Android** obtenido (`keytool`, pasos en `docs/verification.md` §Feature 59) y sustituido en `hosting/.well-known/assetlinks.json` en lugar de `REPLACE_WITH_DEV_BUILD_SHA256` | pendiente |
| G2 | Contenido de `hosting/` subido tal cual al hosting web de Hostinger: `https://<RESET_LINK_HOST>/.well-known/assetlinks.json` responde 200 con `Content-Type: application/json` y `https://<RESET_LINK_HOST>/reset-password` sirve la página fallback | pendiente |
| G3 | `RESET_LINK_HOST` puesta con el host real en el `.env` de la raíz y en `mobile-pet-tracker/.env` (solo ahí; el dominio no entra al repo) | pendiente |
| G4 | Smoke en **dev build de Android** (nunca Expo Go): `curl POST /v1/auth/forgot-password` con el correo real → el correo llega con el enlace → **abrir el enlace dos veces** → la app abre en `/reset-password` con el token → completar el reset una vez (200) → reintentar con el mismo enlace falla (400) → login con la contraseña vieja 401 y con la nueva 200 → en un dispositivo/perfil sin la app, el mismo enlace muestra la página fallback de Hostinger. No delegable a IA | pendiente |
