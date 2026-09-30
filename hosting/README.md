# Hosting estático de Pet Tracker

Sube el contenido de este directorio tal cual a `public_html/` de Hostinger, incluida la carpeta oculta `.well-known`:

- `.well-known/assetlinks.json` queda en `https://<RESET_LINK_HOST>/.well-known/assetlinks.json` (App Links de Android).
- `.well-known/apple-app-site-association` queda en `https://<RESET_LINK_HOST>/.well-known/apple-app-site-association` (Universal Links de iOS). No lleva extensión: `.well-known/.htaccess` fuerza `Content-Type: application/json` solo para ese fichero.
- `reset-password/index.html` queda en `https://<RESET_LINK_HOST>/reset-password` (página fallback sin app).

Antes de subir el AASA, sustituye `REPLACE_WITH_APPLE_TEAM_ID` por el Team ID de la cuenta de Apple Developer. El fingerprint de `assetlinks.json` y el Team ID se publican y no son secretos; el dominio real no se versiona. Los gates humanos están en `docs/verification.md`: G1–G4 en §Feature 59 (Android) e I1–I6 en §Feature 60 (iOS).
