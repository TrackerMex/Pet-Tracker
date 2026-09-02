# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #59 — auth-reset-deep-link (2026-09-02)

- **Estado**: `pending` → escribiendo spec
- **Branch**: `feature/59-auth-reset-deep-link` (desde `origin/main` @ `37d0c8b`, incluye #58 mergeado)
- **Fase**: `spec_author` lanzado; a la espera del gate humano sobre `specs/auth-reset-deep-link/requirements.md`
- Contexto clave para la spec:
  - #58 (D8) dejó el correo de reset en texto plano con token pelado, sin URL: #59 fija la forma de la URL y cambia solo el cuerpo del correo (2 ficheros: `resend-password-reset-sender.ts` y su console twin).
  - Backend ya expone `POST /v1/auth/forgot-password` y `POST /v1/auth/reset-password` (públicos). Propiedad de seguridad: ningún GET consume el token.
  - Móvil: `app.json` solo tiene `scheme: mobilepettracker`; existe stub `src/app/(auth)/forgot.tsx`; falta ruta que reciba el token.
  - Hosting web Hostinger disponible (confirmado 2026-08-29) para `/.well-known/assetlinks.json` + página fallback.
- Gate humano final de la feature: smoke en dev build de Android abriendo el enlace real desde el correo (no delegable a IA).
