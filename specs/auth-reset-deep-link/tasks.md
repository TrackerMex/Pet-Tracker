---
feature: "auth-reset-deep-link"
status: approved   # draft | spec_ready | approved
tags: [harness, spec, backend, mobile, security]
---

# Tareas — [[auth-reset-deep-link]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden: **el commit del test
> rojo precede al commit que lo pone verde** (C4 de `CHECKPOINTS.md`).
> Backend con `pnpm -C backend-pet-tracker`; móvil con `bun run` dentro de
> `mobile-pet-tracker/`. Los nombres exactos de cada `describe` están en
> [[requirements]]; se copian literalmente.
>
> Orden sugerido: R1→R3 (backend correo), R9→R10 (hosting estático),
> R4 (app config), R7 (api client), R5→R6→R8 (pantalla), R11 (e2e),
> R12 (contención). R9/R10 antes que R4 deja los ficheros de `hosting/`
> listos para el test de consistencia con `app.json`.

## R1 — La URL del enlace y su presencia en el correo Resend

- [ ] (1) Test rojo: `password-reset-link.spec.ts` (composición/encoding) y describe `R1 (auth-reset-deep-link)` en `resend-password-reset-sender.spec.ts`
- [ ] (2) Implementación mínima: `password-reset-link.ts` + párrafo de URL en `resend-password-reset-sender.ts` (copy exacto en [[design]] §D4; eliminar en el mismo commit el assert `not.stringContaining('http')` del describe R1 de #58)
- [ ] (3) Refactor con tests verdes

## R2 — `resetUrl` en el log del adaptador de consola

- [ ] (1) Test rojo: dos describes `R2 (auth-reset-deep-link)` en `console-password-reset-sender.spec.ts` (con y sin host)
- [ ] (2) Implementación mínima: param opcional `resetLinkHost` + campo condicional
- [ ] (3) Refactor con tests verdes

## R3 — Fail-fast si `EMAIL_ENABLED=true` sin `RESET_LINK_HOST`

- [ ] (1) Test rojo: describe `R3 (auth-reset-deep-link)` en `auth.module.spec.ts`
- [ ] (2) Implementación mínima: validación en el ctor de `ResendPasswordResetSender` + `useFactory` pasa la variable (añadir `RESET_LINK_HOST` al config del describe R3 de #58 en el mismo commit)
- [ ] (3) Refactor con tests verdes

## R4 — Intent filters de App Links desde `app.config.ts`

- [ ] (1) Test rojo: dos describes `R4 (auth-reset-deep-link)` en `app.config.test.ts` (con host / sin host)
- [ ] (2) Implementación mínima: rama `RESET_LINK_HOST` en `app.config.ts` ([[design]] §D9)
- [ ] (3) Refactor con tests verdes

## R5 — Ruta `/reset-password` que recibe el token

- [ ] (1) Test rojo: describe R5 en `src/screens/reset-password/index.test.tsx` (render con token → formulario; sin token → `reset-missing-token`)
- [ ] (2) Implementación mínima: route delgado `src/app/reset-password.tsx` + pantalla con `useLocalSearchParams`
- [ ] (3) Refactor con tests verdes

## R6 — Abrir la pantalla no consume nada

- [ ] (1) Test rojo: describe R6 en `index.test.tsx` (mock de `resetPassword` no llamado al montar; una sola llamada tras submit)
- [ ] (2) Implementación mínima (normalmente ya verde con R5: sin efectos de red en mount — dejarlo pinneado)
- [ ] (3) Refactor con tests verdes

## R7 — `resetPassword` en el cliente API

- [ ] (1) Test rojo: describe `R7 (auth-reset-deep-link)` en `src/api/__tests__/auth.test.ts` (ok/expired/validation/invalid-token/unreachable/missing-config/error)
- [ ] (2) Implementación mínima: `resetPassword` en `auth.ts` + `ResetPasswordRequest` en `types.ts`
- [ ] (3) Refactor con tests verdes

## R8 — Submit: éxito y mapeo de errores en pantalla

- [ ] (1) Test rojo: describe R8 en `index.test.tsx` (éxito → `reset-success` + `link-login`; cada `kind` de error → su mensaje en `reset-error`; botón deshabilitado en vuelo)
- [ ] (2) Implementación mínima: handler de submit por `kind` ([[requirements]] R8 fija los textos)
- [ ] (3) Refactor con tests verdes

## R9 — `assetlinks.json` consistente con la app

- [ ] (1) Test rojo: describe R9 en `src/__tests__/hosting-artifacts.test.ts`
- [ ] (2) Implementación mínima: `hosting/.well-known/assetlinks.json` (+ `hosting/README.md`) con placeholder `REPLACE_WITH_DEV_BUILD_SHA256`
- [ ] (3) Refactor con tests verdes

## R10 — Página fallback estática sin consumo del token

- [ ] (1) Test rojo: describe R10 en `hosting-artifacts.test.ts` (scheme presente, `URLSearchParams`, cero `fetch`/XHR/beacon/URLs externas)
- [ ] (2) Implementación mínima: `hosting/reset-password/index.html` ([[design]] §D5)
- [ ] (3) Refactor con tests verdes

## R11 — Ningún GET consume el token (e2e)

- [ ] (1) Test rojo: `test/auth-reset-deep-link.e2e-spec.ts` (GETs → 404; primer POST → 200; segundo POST → 400)
- [ ] (2) Implementación mínima (debería estar verde ya: el requisito pinnea que nadie añada un GET — si está rojo, algo del diseño se violó)
- [ ] (3) Refactor con tests verdes

## R12 — Regresión y contención

- [ ] (1) Correr las siete suites/commandos de [[requirements]] R12 + `./init.sh` y anotar resultados en `progress/impl_auth-reset-deep-link.md`
- [ ] (2) Verificar la allowlist con el grep de contención de R12 (debe salir vacío) y el grep-clean de UI
- [ ] (3) Docs: `.env.example` ×2, `docs/conventions.md`, `docs/verification.md` §Feature 59 (gates G1–G4 paso a paso, comando `keytool` incluido), fila `hosting/` en `AGENTS.md`
