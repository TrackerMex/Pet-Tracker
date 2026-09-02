# Hosting estático de Pet Tracker

Sube el contenido de este directorio tal cual a `public_html/` de Hostinger: `.well-known/assetlinks.json` debe quedar disponible en `https://<RESET_LINK_HOST>/.well-known/assetlinks.json` y `reset-password/index.html` en `https://<RESET_LINK_HOST>/reset-password`.

Antes del despliegue, sustituye `REPLACE_WITH_DEV_BUILD_SHA256` por el fingerprint SHA-256 real del certificado que firma el dev build de Android. La obtención del fingerprint, la subida y el smoke pertenecen a los gates humanos G1–G4 documentados en `docs/verification.md`.
