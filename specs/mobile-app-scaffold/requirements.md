---
feature: "mobile-app-scaffold"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-app-scaffold]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D9, todas cerradas) y
> [[../../progress/explore_mobile-app-scaffold|explore]] para el contexto.
> Las convenciones de capas de `docs/architecture.md` son de backend y NO
> aplican a esta app (expo-router impone estructura file-based); sí aplican
> kebab-case, tests que nombran su R-id y conventional commits.

## Contexto fijo (no reabrir)

- Carpeta isla `mobile-pet-tracker/` hermana de `backend-pet-tracker/`, con
  `package.json` y `bun.lock` propios. **Sin** workspace raíz: no se crea
  `package.json` ni lockfile en la raíz del repo (D1).
- Package manager de la app: **bun >= 1.2** (máquina del humano: 1.3.14,
  Windows 11). **Node LTS sigue siendo requisito**: `bun create expo-app` lo
  usa para bajar la plantilla y jest corre sobre node (D2).
- Stack: **Expo SDK 57**, plantilla default de `bun create expo-app`
  (TypeScript + expo-router), ESLint de la plantilla (`eslint-config-expo`).
- Smoke del humano: **Android físico con Expo Go**, teléfono y PC en la misma
  WiFi, backend en `http://<IP-LAN>:3000/v1`. Expo Web queda fuera; CORS no
  se toca (D4).
- Tests: **jest-expo día 1** (D6, cerrada — ver [[design]] §D6: expo/expo
  #47435 está CERRADO; el fix está publicado en `jest-expo@57.0.4`, peer
  `@react-native/jest-preset@^0.86.2` verificado en npm el 2026-08-19).

## Excepción a C4 (scaffold generado)

El código que emite la plantilla de `bun create expo-app` es **scaffold
generado**: no nace por TDD y se commitea tal cual en un commit propio (R1),
misma doctrina que las guardas nacidas verdes. Todo lo escrito a mano
(R2–R7) sí sigue TDD estricto, y **cada verificación nueva debe verse fallar
al menos una vez** antes de creerla: el test de la pantalla (R7) debe verse
rojo (mock de estado incorrecto / pantalla sin cablear) antes de verde, y el
smoke de R13 incluye los dos caminos negativos, no solo el feliz.

## Requisitos funcionales

### Scaffold e isla

- **R1**: WHEN el implementador genera el scaffold con
  `bun create expo-app mobile-pet-tracker` (Expo SDK 57, plantilla default)
  THE SYSTEM SHALL producir la carpeta isla `mobile-pet-tracker/` con su
  propio `package.json` y `bun.lock`, dejar las rutas reducidas a
  `src/app/_layout.tsx` + `src/app/index.tsx` (vía `echo n | bun run
  reset-project`: el script de la plantilla es interactivo y con `n` borra el
  código de ejemplo `src/` y `scripts/` y crea `src/app/` mínimo; verificado
  en `expo-template-default@57.0.16`, cuyas rutas viven en `src/app/`, no en
  `app/` top-level), y NO SHALL crear `package.json`, lockfile ni carpeta
  `node_modules` en la raíz del repo.
  *Verificación: estructural (reviewer) — excepción C4, commit de scaffold
  aislado sin código a mano.*

### Cliente de health (`mobile-pet-tracker/src/api/`)

- **R2**: WHEN se construye la URL del health check a partir de una base URL
  THE SYSTEM SHALL exponer `healthUrl(baseUrl: string): string` en
  `mobile-pet-tracker/src/api/health.ts` que devuelve `<base>/health` manejando
  la barra final (`http://x:3000/v1` y `http://x:3000/v1/` producen ambas
  `http://x:3000/v1/health`).
  *Test: `mobile-pet-tracker/src/api/__tests__/health.test.ts` →
  `describe('R2: healthUrl', ...)`.*

- **R3**: WHEN `fetchHealth(baseUrl)` recibe una respuesta HTTP 200 cuyo body
  es `{ "postgres": "ok" }` THE SYSTEM SHALL devolver `{ kind: 'ok' }`.
  *Test: mismo archivo → `describe('R3: ...')`, con `fetchFn` inyectado
  (mock), sin red real.*

- **R4**: IF el backend responde pero la respuesta no es un 200 con
  `postgres: 'ok'` (503 con `postgres: 'error'`, cualquier otro status, o
  body no parseable) THEN THE SYSTEM SHALL devolver `{ kind: 'error' }`
  (backend vivo pero degradado).
  *Test: mismo archivo → `describe('R4: ...')` — casos 503 y 200 con body
  inválido.*

- **R5**: IF el fetch lanza (host inalcanzable, red caída, DNS) THEN THE
  SYSTEM SHALL devolver `{ kind: 'unreachable', message: <string del error> }`
  sin lanzar excepción hacia el llamador.
  *Test: mismo archivo → `describe('R5: ...')` con `fetchFn` que rechaza.*

- **R6**: IF `baseUrl` es `undefined` o cadena vacía (es decir,
  `EXPO_PUBLIC_API_URL` no está configurada) THEN THE SYSTEM SHALL devolver
  `{ kind: 'missing-config' }` sin intentar ningún fetch, y THE SYSTEM SHALL
  NOT tener ninguna URL de backend hardcodeada como fallback en ningún
  archivo de la app.
  *Test: mismo archivo → `describe('R6: ...')` — asserts que `fetchFn` no fue
  llamado. La ausencia de hardcode la verifica el reviewer con
  `grep -rn "3000" mobile-pet-tracker/src` (solo debe
  aparecer en `.env.example` y docs).*

### Pantalla inicial

- **R7**: WHEN la app abre su ruta inicial `/`
  (`mobile-pet-tracker/src/app/index.tsx`) THE SYSTEM SHALL ejecutar
  `fetchHealth(process.env.EXPO_PUBLIC_API_URL)` y renderizar el estado en un
  elemento con `testID="health-state"` cuyo texto es exactamente el `kind`
  (`ok` | `error` | `unreachable` | `missing-config`), distinguiendo
  visualmente los cuatro casos, y SHALL ofrecer un control con
  `testID="health-retry"` que reejecuta el chequeo al pulsarlo.
  *Test: `mobile-pet-tracker/src/app/__tests__/index.test.tsx` →
  `describe('R7: ...')` con `jest.mock` de `../../api/health` +
  `@testing-library/react-native`: un caso por estado + un caso de retry.
  Este test debe verse ROJO primero (doctrina de guardas).*

### Configuración

- **R8**: WHEN la app necesita la URL del backend THE SYSTEM SHALL leerla
  exclusivamente de `EXPO_PUBLIC_API_URL` definida en
  `mobile-pet-tracker/.env` (NO tracked, ignorado por el `.gitignore` de la
  app), y SHALL existir `mobile-pet-tracker/.env.example` (tracked) con
  `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/v1` como placeholder
  documentado. `env-drift.mjs` NO se extiende en esta feature (deuda
  condicional, ver [[design]] §Deuda).
  *Verificación: reviewer — `git ls-files` muestra `.env.example` y no `.env`;
  `.gitignore` de la app cubre `.env`.*

### Integración del harness (mismo PR)

- **R9**: WHEN se ejecuta `./init.sh` en una máquina con bun >= 1.2 THE
  SYSTEM SHALL correr install/lint/typecheck/test de la app vía bun con los
  comandos exactos de [[design]] §Harness (sufijos `--cwd mobile-pet-tracker`
  añadidos a `INSTALL_CMD`/`LINT_CMD`/`TYPECHECK_CMD`/`TEST_CMD` de
  `init.config.sh`, `bun` añadido a `REQUIRED_TOOLS` junto a node y pnpm,
  `BUILD_CMD` sin cambios — D5: la verificación de compilación de la app es
  `tsc --noEmit`), y IF `bun` no está en PATH THEN `./init.sh` SHALL fallar
  en el paso REQUIRED_TOOLS — prohibido `command -v bun && ...` o cualquier
  otra guarda silenciosa.
  *Verificación: el reviewer ejecuta `./init.sh` (exit 0) y revisa el diff de
  `init.config.sh`; la rama de fallo la implementa el loop REQUIRED_TOOLS ya
  existente de `init.sh` (no se escribe código nuevo para ella).*

- **R10**: WHEN corre el workflow de CI (`.github/workflows/ci.yml`) THE
  SYSTEM SHALL instalar bun con `oven-sh/setup-bun@v2` pineado a
  `bun-version: "1.3.14"` y cachear `~/.bun/install/cache` con una key que
  incluya `hashFiles('mobile-pet-tracker/bun.lock')`, en el MISMO PR que
  añade bun a `REQUIRED_TOOLS` (D9 — si no, todos los PRs posteriores
  fallarían en REQUIRED_TOOLS).
  *Verificación: CI verde en el PR de la feature.*

### Documentación y contención

- **R11**: WHEN la carpeta top-level `mobile-pet-tracker/` existe THE SYSTEM
  SHALL añadir su fila a la tabla "Mapa del repositorio" de `AGENTS.md` §2
  (usar la skill `docs-readme-sync`).
  *Verificación: reviewer.*

- **R12**: WHILE la feature #31 esté en curso THE SYSTEM SHALL NOT modificar
  ningún archivo bajo `backend-pet-tracker/` (CORS incluido).
  *Verificación: `git diff --stat main...HEAD -- backend-pet-tracker/`
  devuelve vacío en la review.*

### Prueba de humo del humano

- **R13**: WHEN el humano ejecuta la prueba de humo THE SYSTEM SHALL mostrar
  los tres estados reales en Expo Go sobre Android físico. Pasos exactos
  (PC y teléfono en la misma WiFi):

  1. Backend arriba: `docker compose up -d` en la raíz y
     `pnpm -C backend-pet-tracker run start:dev`.
  2. Obtener la IP LAN de la PC: `ipconfig` → "Dirección IPv4" del adaptador
     WiFi.
  3. Crear `mobile-pet-tracker/.env` con
     `EXPO_PUBLIC_API_URL=http://<IP-LAN>:3000/v1`.
  4. `bun run --cwd mobile-pet-tracker start` → escanear el QR con Expo Go
     en el Android.
  5. **Camino feliz**: la pantalla muestra `ok`.
  6. **Error del backend (503)**: con Nest corriendo,
     `docker compose stop postgres` → pulsar retry → la pantalla muestra
     `error`. Después `docker compose start postgres`.
  7. **Backend inalcanzable**: parar Nest (Ctrl+C) → pulsar retry → la
     pantalla muestra `unreachable`.

  Nota: si el teléfono no alcanza la PC, revisar que el firewall de Windows
  permita node en red privada (puerto 3000) y que la WiFi no aísle clientes.

  - [X] Smoke ejecutado por el humano (fecha: 2026-08-19) — los tres estados vistos

## Fuera de alcance

- Cualquier cambio a `backend-pet-tracker/` — CORS incluido (R12).
- Expo Web como target (exigiría CORS → feature propia si algún día hace falta).
- EAS Build, `eas.json`, builds nativos (`expo prebuild`).
- Autenticación y cualquier pantalla más allá del health check.
- Extender `env-drift.mjs` a la pareja `.env`/`.env.example` de la app (deuda
  condicional: solo si la deriva muerde).
- Codegen OpenAPI / paquete de tipos compartido — los tipos se duplican a
  mano en `api/types.ts` (D7, deuda anotada en [[design]]).
- Campo `area` en `feature_list.json` — la convención es el prefijo de nombre
  `mobile-*` (D8).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-19) ← gate obligatorio antes de implementar
