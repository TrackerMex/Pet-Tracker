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

### Resultado

Implementación terminada en `feature/31-mobile-app-scaffold`. R1–R12 están
implementados; R13 queda sin ejecutar para el humano. No se modificó
`backend-pet-tracker/`, no se creó ningún manifest/lockfile/node_modules en la
raíz y no se abrió PR ni se cerró la feature.

### Commits

| R-id | Commits |
|---|---|
| R1 | `ee29ed1` scaffold; `7313277` trace; `f22721c` test tooling; `daf6369` trace |
| R2 | `1893f1c` red; `db52ee1` green; `fbb4fb2` trace |
| R3 | `2f036c5` red; `aa261c8` green; `adeaf0a` trace |
| R4 | `8daae39` red; `1032fac` green; `8cf84cf` trace |
| R5 | `b57763b` red; `04219b5` green; `c1800a0` trace |
| R6 | `be93a38` red; `72f75bc` green; `95ffb22` trace |
| R7 | `9a82d64` red; `33f13ce` green; `bd2a6b8` trace |
| R8 | `159c2e0` config; `dcb9723` trace |
| R9 | `fa18ae7` harness; `f1eec4a` trace |
| R10 | `d986d71` CI; `500bd98` trace |
| R11 | `fbfceeb` map; `3c01739` trace |
| R12 | `35b8d68` isolation verification |

Los commits R2–R7 conservan el test rojo antes de la implementación verde.

### Comandos y verificaciones

- Arranque: `bash ./init.sh` resolvió al WSL sin Node y falló antes de tocar
  archivos; se repitió con `C:\Program Files\Git\bin\bash.exe ./init.sh` y
  quedó verde.
- R1: `echo n | bun run reset-project`; eliminó `src/` de ejemplo y `scripts/`
  y dejó solo `src/app/_layout.tsx` + `src/app/index.tsx`.
- Tooling: `bun add --dev jest-expo@^57.0.4 jest@~29.7.0
  @testing-library/react-native @types/jest`; `expo lint` añadió su configuración
  y dependencias oficiales.
- TDD: `bun run test --runInBand src/api/__tests__/health.test.ts` y
  `bun run test --runInBand src/app/__tests__/index.test.tsx` se ejecutaron en
  rojo antes de cada commit verde correspondiente.
- App: `bun run test --runInBand` → 2 suites, 13 tests verdes;
  `bun run lint` y `bun run typecheck` → exit 0.
- Harness: `./init.sh` se ejecutó después de R9 y al final → exit 0. Install,
  build/synth, tests, lint y typecheck pasaron; los e2e se omitieron porque
  Docker/Postgres estaba apagado, condición permitida.
- Seguridad de instalación: `bun pm untrusted` inicialmente reportó 0; tras
  añadir ESLint reportó `unrs-resolver@1.12.2` bloqueado. No se añadió
  `trustedDependencies` porque install, lint, tests y typecheck funcionan sin
  su postinstall.
- Contención: `rg -n "3000" mobile-pet-tracker/src` sin resultados;
  `git ls-files` contiene `.env.example` y no `.env`; `git check-ignore`
  confirma `.env`; `git diff --stat main...HEAD -- backend-pet-tracker/` vacío.
- Raíz: `package.json`, `bun.lock` y `node_modules` inexistentes.

### Estado por requisito

| R-id | Estado | Evidencia |
|---|---|---|
| R1 | OK | Isla Expo SDK 57 con `bun.lock`; reset mínimo; raíz intacta |
| R2 | OK | `describe('R2: healthUrl')`, 2 casos verdes |
| R3 | OK | `describe('R3: fetchHealth ok state')` verde |
| R4 | OK | 503 y JSON inválido devuelven `error` |
| R5 | OK | rechazo de fetch devuelve `unreachable` sin propagar |
| R6 | OK | undefined/vacío devuelven `missing-config` sin fetch; grep limpio |
| R7 | OK | 4 estados + retry, 5 casos verdes; testIDs exactos |
| R8 | OK | placeholder exacto tracked; `.env` ignorado |
| R9 | OK | Bun obligatorio y cuatro comandos `--cwd`; `init.sh` verde |
| R10 | Implementado | setup-bun 1.3.14 + cache por `bun.lock`; CI remoto queda para el PR del reviewer |
| R11 | OK | Fila añadida en `AGENTS.md` §2; `docs-readme-sync` no estaba disponible y se aplicó el cambio directo mínimo |
| R12 | OK | Diff contra `backend-pet-tracker/` vacío |
| R13 | Pendiente humano | Casilla de smoke intacta |
