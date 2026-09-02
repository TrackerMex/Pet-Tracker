# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #59 — auth-reset-deep-link (2026-09-02)

- **Estado**: `in_progress` (spec aprobada por humano en `5d1a62f`, frontmatter `approved`)
- **Branch**: `feature/59-auth-reset-deep-link` (desde `origin/main` @ `37d0c8b`, incluye #58 mergeado)
- **Fase**: handoff a Codex CLI entregado (`progress/handoff_auth-reset-deep-link.md`); esperando que el humano corra Codex. Mientras tanto: NO tocar `backend-pet-tracker/`, `mobile-pet-tracker/` ni `hosting/`
- **Plan**: Codex implementa R1-R12 (correo con URL, App Links, ruta/pantalla reset, assetlinks + fallback estática, e2e ningún-GET-consume) con push por tramo; luego reviewer; gates humanos G1-G4 antes del cierre
- Contexto clave para la spec:
  - #58 (D8) dejó el correo de reset en texto plano con token pelado, sin URL: #59 fija la forma de la URL y cambia solo el cuerpo del correo (2 ficheros: `resend-password-reset-sender.ts` y su console twin).
  - Backend ya expone `POST /v1/auth/forgot-password` y `POST /v1/auth/reset-password` (públicos). Propiedad de seguridad: ningún GET consume el token.
  - Móvil: `app.json` solo tiene `scheme: mobilepettracker`; existe stub `src/app/(auth)/forgot.tsx`; falta ruta que reciba el token.
  - Hosting web Hostinger disponible (confirmado 2026-08-29) para `/.well-known/assetlinks.json` + página fallback.
- Gate humano final de la feature: smoke en dev build de Android abriendo el enlace real desde el correo (no delegable a IA).
