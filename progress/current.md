# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #59 — auth-reset-deep-link (2026-09-02)

- **Estado**: `in_progress` (spec aprobada por humano en `5d1a62f`, frontmatter `approved`)
- **Branch**: `feature/59-auth-reset-deep-link` (desde `origin/main` @ `37d0c8b`, incluye #58 mergeado)
- **Fase**: implementación R1-R12 terminada por Codex (`bb8660a`, con Adenda 1 + 2 autorizaciones humanas registradas en el impl); reviewer **APROBADO** (`progress/review_auth-reset-deep-link.md`, commit `fb9db23`). Esperando gates humanos G1-G4 (traceability.md) — bloquean el `done`: fingerprint SHA-256 del dev build, subida de `hosting/` a Hostinger, `RESET_LINK_HOST` en ambos `.env`, smoke en dev build de Android con doble apertura del enlace (guía: `docs/verification.md` §Feature 59)
- **2026-09-03 — desvío en gates (bloquea el cierre)**: el humano commiteó `1b0aed1` fuera del flujo: (a) fingerprint real en `hosting/.well-known/assetlinks.json` (G1 ✅, correcto); (b) cambio de código en `password-reset-link.ts` que antepone `/pet` a la URL porque `hosting/` se subió a `public_html/pet/` (el docroot ya aloja otro sitio); (c) `impl_*.md` marca G1-G4 ✅. Verificado desde el VPS: R1 (`password-reset-link.spec.ts`) **en rojo** (2/2 fallan), `pathPrefix: '/reset-password'` del intent filter ya no matchea la URL, y `assetlinks.json` vive en `/pet/.well-known/` — Android solo lee `/.well-known/` en la raíz, así que el App Link no verifica y el "smoke" pasó por el botón `mobilepettracker://` de la página fallback (R5 scheme), no por App Link. Veredicto del reviewer (`fb9db23`) queda desactualizado. Resolución acordada: revertir (b), mover `.well-known/` y `reset-password/` a la raíz de `public_html/` (no colisionan con el `index.html` del otro sitio), repetir G2-G4 con `adb shell pm get-app-links` = verified. Docs G1 corregidos en `f902bca`/`6c11fa5` (keystore es `android/app/debug.keystore`).
- Contexto clave para la spec:
  - #58 (D8) dejó el correo de reset en texto plano con token pelado, sin URL: #59 fija la forma de la URL y cambia solo el cuerpo del correo (2 ficheros: `resend-password-reset-sender.ts` y su console twin).
  - Backend ya expone `POST /v1/auth/forgot-password` y `POST /v1/auth/reset-password` (públicos). Propiedad de seguridad: ningún GET consume el token.
  - Móvil: `app.json` solo tiene `scheme: mobilepettracker`; existe stub `src/app/(auth)/forgot.tsx`; falta ruta que reciba el token.
  - Hosting web Hostinger disponible (confirmado 2026-08-29) para `/.well-known/assetlinks.json` + página fallback.
- Gate humano final de la feature: smoke en dev build de Android abriendo el enlace real desde el correo (no delegable a IA).
