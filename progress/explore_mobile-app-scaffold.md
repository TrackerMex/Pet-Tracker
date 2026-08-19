# explore: mobile-app-scaffold

Fecha: 2026-08-19
Feature: #31 `mobile-app-scaffold` (futura — aún NO existe en `feature_list.json`)
Decisiones ya tomadas por el humano (no se cuestionan aquí): monorepo (carpeta
hermana de `backend-pet-tracker/`), stack Expo (React Native), package manager
**bun** para la app (backend sigue con pnpm).
Alcance: **solo lectura** + investigación web. No se creó código ni scaffold.

---

## §1 · Coexistencia bun + pnpm en el monorepo

### §1.1 — Hecho clave: este repo NO tiene workspace raíz

Verificado: no existe `package.json` en la raíz. Los tres "paquetes" actuales
son islas: `backend-pet-tracker/` (pnpm, su propio `pnpm-lock.yaml`),
`infra/` (pnpm), y la raíz solo tiene scripts sueltos (`env-drift.mjs` corre
con `node --test` sin dependencias). El `.gitignore` raíz ya cubre
`node_modules/` globalmente.

**Recomendación: mantener el patrón de islas.** La app móvil es una carpeta
hermana con su propio `package.json` + `bun.lock`, **sin** workspace raíz
compartido. Razones:

1. **pnpm y bun no se pisan si no comparten `package.json`.** El único punto
   de contacto posible sería un workspace raíz (hoisting cruzado, dos gestores
   resolviendo el mismo árbol). Al no existir, el riesgo es cero estructural.
2. **EAS Build detecta el package manager por lockfile** (`bun.lock` para bun
   1.2+, `bun.lockb` para anteriores). Con la app como carpeta independiente y
   sin lockfile en la raíz, la detección es inequívoca.
3. **Bug abierto que un workspace raíz activaría**: `expo/eas-cli` issue #2658
   — EAS Build no detecta bun en monorepos con workspace raíz (parsea
   `"packageManager": "bun@x"` como `yarn@bun@x` y falla). Sin resolver a la
   fecha. La carpeta independiente esquiva el problema entero.

### §1.2 — Estado real del soporte bun en Expo (verificado 2026-08-19)

- **Soporte oficial**: Expo documenta bun como package manager de primera
  clase (`docs.expo.dev/guides/using-bun`). `bun create expo-app <name>`
  funciona; scripts con `bun run ...`; librerías con `bun expo install ...`.
- **Trampa documentada**: `bun create expo` y `bun expo prebuild` **siguen
  requiriendo Node.js LTS instalado** (usan `npm pack` para bajar la
  plantilla). En esta máquina ya está: node v24.16.0.
- **EAS Build**: bun viene instalado por defecto en las imágenes de EAS; se
  elige por lockfile; la versión exacta se pinea en `eas.json`
  (`"bun": "x.y.z"` en el build profile).
- **Seguridad de bun que muerde**: bun NO ejecuta `postinstall` scripts por
  defecto — paquetes que los necesiten requieren `trustedDependencies` en
  `package.json`. Trampa conocida con algunos paquetes de RN.

### §1.3 — bun en Windows 11

- Soportado desde bun 1.1 (abril 2024); ARM64 desde febrero 2026; fixes
  Windows continuos en 2026 (ConPTY, fs flags).
- **Ya instalado en la máquina del humano: bun 1.3.14** (junto a node 24.16.0
  y pnpm 10.33.4). No hay que instalar nada para el flujo local.
- Matiz honesto: bun corre mayoritariamente en Linux en producción; Windows es
  el tier con más issues reportados. Para el uso aquí (install + run scripts,
  no runtime de servidor) el riesgo es bajo; jest/metro corren sobre node de
  todas formas.

---

## §2 · Expo actual (verificado en web, 2026-08-19)

- **SDK vigente: Expo SDK 57** (`expo@57.0.14`, publicado ~2026-08-17).
  React Native 0.86, reanimated 4.5, gesture-handler 2.32.
- **Plantilla**: la default de `create-expo-app` trae **TypeScript +
  expo-router ya configurados** (file-based routing sobre react-navigation).
  No hay decisión que tomar entre expo-router y react-navigation a pelo: el
  default oficial es expo-router y no hay razón en este repo para desviarse.
- **Estructura idiomática** (plantilla default): `app/` (rutas file-based),
  `components/`, `constants/`, `assets/`, `app.json`, `tsconfig.json`.
  OJO: expo-router usa `app/` DENTRO del proyecto — por eso la carpeta
  top-level del repo no debe llamarse `app/`. Sugerencia:
  `mobile-pet-tracker/` (simetría con `backend-pet-tracker/`).
- **Tests**: `jest-expo` es el preset oficial (bun test runner NO sirve para
  RN: jest-expo requiere jest; se corre `bun run test` → jest). **Riesgo
  activo**: expo/expo issue #47435 — jest-expo en SDK 57 tiene conflicto de
  peer dependency (`@react-native/jest-preset@^0.85` vs RN 0.86); puede
  requerir override. La spec debe decidir si el scaffold incluye jest-expo
  día 1 o arranca con lint + typecheck + un test de lógica pura sin preset RN.
- **Scaffold mínimo razonable como primera feature**:
  1. Proyecto que arranca (`bun run start` / `bunx expo start`).
  2. TypeScript estricto + ESLint (`eslint-config-expo`, viene con la plantilla).
  3. Una pantalla que pega a `GET /v1/health` (público, `@Public()`) y pinta
     el resultado. Shape verificado en
     `backend-pet-tracker/src/modules/health/application/use-cases/check-health.use-case.ts`:
     `{ postgres: 'ok' | 'error' }` — 200 si ok, 503 si error.
  4. Algún test que nombre su R-id (convención del repo).

---

## §3 · Contrato API backend ↔ móvil

### §3.1 — Lo que hay hoy

- **No hay OpenAPI/Swagger**: grep de `swagger|openapi` en
  `backend-pet-tracker/src` y `package.json` → cero.
- **DTOs de entrada**: zod, en `application/dto/`, y por convención
  (`docs/conventions.md` §DTOs) **no salen de la capa application** — no están
  pensados para exportarse.
- **Tipos de respuesta**: interfaces TS planas dispersas en
  `infrastructure/mappers/` (ej. `PetProfileResponse` en
  `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts`,
  `DeviceStatusResponse` en devices). No hay paquete de tipos.
- **Endpoints existentes** (prefijo global `v1` en `main.ts`), por controller:
  `health` (público) · `auth` (register/login/verify-email) · `me` +
  push-tokens · `pets` · `pets/:petId/photo-upload-url` · `devices` (claim) ·
  `pets/:petId/device` · `pets/:petId/positions` (+`/last`) ·
  `pets/:petId/trips` · `pets/:petId/activity` · `pets/:petId/geofences` ·
  `alerts` · `vaccine-catalog` · `pets/:petId/vaccines` ·
  `pets/:petId/weights` · `pets/:petId/reminders` · `reminders/:id` ·
  `pets/:petId/nutrition-profile` / `nutrition-plan`.

### §3.2 — Estrategias de tipos compartidos, evaluadas

| Opción | Veredicto |
|---|---|
| Paquete compartido (`packages/shared-types`) | **No** para #31: exige workspace o publicación, cruza dos package managers, y reactiva el bug de EAS §1.1 |
| Import por ruta relativa desde la app a `backend-pet-tracker/src` | **No**: Metro tendría que compilar código Nest (decorators, deps de Nest en el type-graph), `watchFolders` fuera de la raíz del proyecto, y rompe el aislamiento de islas |
| Codegen desde OpenAPI | **No hoy**: no hay OpenAPI, y añadirlo no es gratis — los DTOs son zod, no clases class-validator, así que `@nestjs/swagger` no los ve; haría falta zod-to-openapi = cambio de backend con su propio gate |
| **Duplicar tipos en la app** | **Recomendada para #31**: la app consume UN endpoint (`{ postgres: 'ok' \| 'error' }`); coste de duplicación ≈ cero. Un `api/types.ts` manual por endpoint consumido, y se anota la deuda: cuando la superficie consumida crezca (auth + pets), reevaluar codegen OpenAPI como feature propia |

### §3.3 — CORS: el backend NO lo tiene habilitado

`main.ts` no llama `enableCors()`. Consecuencia práctica:
- Expo Go / emulador / dispositivo nativo: **sin problema** (no hay navegador,
  no aplica CORS).
- **Expo Web sí falla** contra `http://localhost:3000`. Si la spec quiere que
  el smoke corra en web, habilitar CORS es un cambio de
  `backend-pet-tracker/` con su propio gate — no colarlo dentro de #31.

---

## §4 · Impacto en el harness

### §4.1 — `init.sh` + `init.config.sh`

No hay "detección por carpeta": `init.sh` es genérico y ejecuta los comandos
literales de `init.config.sh` (INSTALL/BUILD/TEST/E2E/LINT/TYPECHECK,
concatenados con `&&`). Integración de la app = editar `init.config.sh`:

- `REQUIRED_TOOLS`: añadir `"bun"` (hoy `node`, `pnpm`).
- `INSTALL_CMD`: añadir `bun install --cwd <app-dir>` (bun soporta `--cwd`,
  análogo a `pnpm -C`).
- `LINT_CMD`/`TYPECHECK_CMD`: análogos con `--cwd`.
- `BUILD_CMD`: no hay build obvio para un scaffold Expo — `npx expo export`
  bundlea pero es lento para CI; el candidato barato es dejar solo typecheck
  como verificación de compilación. Decisión de la spec (D5).
- **Anti-patrón a evitar**: condicionar con `command -v bun && ...` para no
  romper entornos sin bun crearía el cuarto modo de fallo silencioso del
  entorno local (doctrina explícita del repo tras #21, #23 y el skip de e2e).
  Mejor explícito: bun requerido, y CI actualizado.

### §4.2 — CI (`.github/workflows/ci.yml`)

Corre `bash ./init.sh` en ubuntu-latest con `pnpm/action-setup` +
`setup-node` (cache pnpm apuntando a `backend-pet-tracker/pnpm-lock.yaml`).
**bun no está en el runner**: hay que añadir `oven-sh/setup-bun` (con su
propio cache sobre `<app-dir>/bun.lock`) o `init.sh` fallará en el paso 1
(`REQUIRED_TOOLS`) de todos los PRs, incluidos los de backend.

### §4.3 — graphify

Verificado en el paquete instalado
(`site-packages/graphify/detect.py`): `CODE_EXTENSIONS` incluye `.tsx`,
`.jsx`, `.ts` y excluye `node_modules` por defecto. `graphify update .`
cubrirá la app móvil sin configuración extra.

### §4.4 — `feature_list.json` (schema en `docs/specs.md` §Schema)

El schema NO tiene campo `area`. Campos: id, name, status, priority,
description, acceptance_criteria, files_affected — y solo id/name/status los
lee `init.sh`, así que un campo extra no rompe nada pero tampoco está
documentado. **Recomendación barata**: distinguir features móviles por
convención de nombre (`mobile-*`, que #31 ya cumple) + `files_affected`
apuntando a la carpeta de la app. Añadir `area` solo si se quiere filtrado
programático, y entonces actualizar `docs/specs.md` §Schema en el mismo PR.

### §4.5 — `docs/conventions.md`

El encabezado declara el stack NestJS y las convenciones de capas
(domain/application/infrastructure, sufijos `.use-case.ts`, tokens Symbol,
zod en application) son **de backend** y no aplican a una app expo-router
(que impone estructura file-based en `app/`). Sí aplican tal cual: kebab-case
en archivos, tests que nombran su R-id (`describe('R1: ...')`), conventional
commits, flujo de branches/PR (§Branches vale sin cambios). La spec debe
añadir una sección "Convenciones de la app móvil" (o un doc propio) en vez de
forzar Clean Architecture Nest en una pantalla.

### §4.6 — Otros

- `AGENTS.md` §2 "Mapa del repositorio": nueva carpeta top-level → añadir fila
  a la tabla (la skill `docs-readme-sync` cubre exactamente este caso; no hay
  `README.md` en la raíz).
- `E2E_REQUIRED_PORTS`: la app no añade puertos. El smoke manual contra el
  backend necesita el backend arriba (`docker compose up -d` + arrancar Nest),
  no infra nueva.
- Regla "un solo escritor": mientras Codex implemente #31, el leader no toca
  la carpeta nueva. Ya codificada en `CLAUDE.md`; solo recordarla en el handoff.

---

## §5 · Riesgos

1. **jest-expo + SDK 57**: conflicto de peers abierto (expo/expo #47435). Con
   bun el manejo de peers difiere de pnpm; puede necesitar override o esperar
   fix. El riesgo es que el scaffold nazca con tests rotos por tooling, no por
   código.
2. **CI sin bun** (§4.2): si el PR de #31 no toca `ci.yml`, TODOS los PRs
   posteriores fallan en `REQUIRED_TOOLS`.
3. **CORS ausente** (§3.3): el smoke en Expo Web fallaría de forma confusa;
   acotar el smoke a nativo o abrir feature de CORS.
4. **`trustedDependencies` de bun**: un paquete RN con postinstall silenciado
   puede fallar en runtime de forma no obvia.
5. **Doctrina de .env raíz vs .env de Expo**: Expo lee `.env` de la carpeta
   del proyecto (`EXPO_PUBLIC_*` se inyectan al bundle). El repo tiene
   doctrina de `.env` ÚNICO en la raíz vigilado por `env-drift.mjs` (#23).
   Dos `.env` = deriva no vigilada; env-drift hoy solo compara la pareja de
   la raíz. Hay que decidirlo, no improvisarlo (D3).
6. **URL del backend según target**: emulador Android → `http://10.0.2.2:3000/v1`;
   dispositivo físico con Expo Go → `http://<IP-LAN>:3000/v1` (misma red);
   web → `http://localhost:3000/v1` + CORS. Un solo default hardcodeado
   fallará en al menos uno de los tres.
7. **Node sigue siendo obligatorio** aunque el gestor sea bun (§1.2) — no es
   riesgo en esta máquina, pero debe constar en la spec para no "limpiar" node
   de los requisitos.

---

## Decisiones abiertas para la spec

| # | Decisión | Opciones / recomendación del explorer |
|---|---|---|
| D1 | Nombre de la carpeta top-level | `mobile-pet-tracker/` (simetría con backend; NO `app/`, colisiona con la carpeta de rutas de expo-router) |
| D2 | Versión mínima de bun | ≥1.2 (formato `bun.lock` textual); la máquina tiene 1.3.14; pinear en `eas.json` cuando exista EAS |
| D3 | Dónde vive `EXPO_PUBLIC_API_URL` | (a) `.env` propio de la app (estándar Expo, pero fuera del radar de env-drift) vs (b) extender env-drift a la segunda pareja. El explorer recomienda (a) + `.env.example` propio de la app, y extender env-drift solo si vuelve a morder |
| D4 | Target del smoke del humano | Expo Go en Android físico / emulador / web — determina la URL default y si CORS entra en juego. Web exigiría feature de CORS aparte |
| D5 | Qué es BUILD_CMD para la app en `init.sh` | Recomendación: solo `tsc --noEmit` como typecheck (barato y suficiente para scaffold); `expo export` queda para cuando haya algo que exportar |
| D6 | Estrategia de tests del scaffold | jest-expo día 1 (asumiendo workaround del peer conflict) vs lint+typecheck+test de lógica pura sin preset RN. Verificar el estado de expo/expo #47435 al escribir la spec |
| D7 | Tipos compartidos | Duplicar a mano en `api/types.ts` (recomendada, §3.2); anotar deuda de codegen OpenAPI para cuando la superficie consumida crezca |
| D8 | Campo `area` en feature_list.json | Convención de nombre `mobile-*` + `files_affected` basta hoy; `area` solo con actualización de `docs/specs.md` §Schema en el mismo PR |
| D9 | CI | Añadir `oven-sh/setup-bun` + cache de `bun.lock` a `ci.yml` en el MISMO PR que añade `bun` a `REQUIRED_TOOLS` |

## Recomendación

Scaffold = carpeta isla `mobile-pet-tracker/` creada con `bun create expo-app`
(SDK 57, plantilla default: TS + expo-router), su propio `bun.lock`, sin
workspace raíz; una pantalla que pega a `GET /v1/health` con la URL desde
`EXPO_PUBLIC_API_URL`; tipos duplicados a mano; `init.config.sh` y `ci.yml`
actualizados en el mismo PR (bun requerido, sin guardas silenciosas). Todo lo
que toque `backend-pet-tracker/` (CORS) queda explícitamente fuera de #31.
