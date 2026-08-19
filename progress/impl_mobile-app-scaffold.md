# impl: mobile-app-scaffold (#31)

> Reporte de implementación. La sección "Estado inicial" la escribió el leader
> registrando trabajo manual del humano; lo que sigue lo escribe Codex CLI.

## Estado inicial — trabajo manual del humano (2026-08-19, pre-Codex)

El humano ejecutó a mano, antes de lanzar Codex:

1. `bun create expo-app mobile-pet-tracker` — **OK** al segundo intento (el
   primero falló con EPERM transitorio en el rename de app.json, ver
   progress/handoff_mobile-app-scaffold.md). `app.json` correcto esta vez
   (name/slug `mobile-pet-tracker`), `bun.lock` y `node_modules/` presentes.
2. `bun run reset-project` — **INCOMPLETO** (verificado por el leader):
   `example/` se creó pero quedó VACÍO, `src/` conserva todo el código de
   ejemplo (`src/app/explore.tsx`, components) y `scripts/reset-project.js`
   sigue presente. El reset hay que rehacerlo.
3. `expo start` + conexión desde **Expo Go en Android físico** — OK (pantalla
   de la plantilla; la pantalla de health de R7 aún no existe, esto NO es el
   smoke R13). `.expo/` generado (gitignored por la plantilla).

Verificaciones del leader sobre ese estado:

- Raíz del repo limpia: sin `package.json`, `bun.lock` ni `node_modules` (R1 OK).
- `mobile-pet-tracker/` está **sin commitear** (untracked); el commit de
  scaffold puro (R1) queda para Codex.
- **Gap contra R8**: el `.gitignore` de la plantilla solo ignora
  `.env*.local`, NO `.env`. Hay que añadir `.env` antes de que exista un
  `.env` con la IP LAN del humano. No existe `.env` todavía.
- La plantilla 57.0.16 trae `AGENTS.md`, `CLAUDE.md` y `.claude/settings.json`
  propios (guía de Expo para agentes) — van tal cual en el commit de scaffold.

## Reporte de Codex

(pendiente — Codex escribe aquí)
