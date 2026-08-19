---
feature: "mobile-app-scaffold"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-app-scaffold]]

> Ver [[requirements]] para los requisitos. Las capas de
> [[../../docs/architecture|architecture]] son de backend y NO aplican aquí:
> expo-router impone estructura file-based. Contexto completo en
> `progress/explore_mobile-app-scaffold.md`.

## Decisiones técnicas (D1–D9, todas cerradas)

- **D1 — Carpeta isla `mobile-pet-tracker/`**: hermana de
  `backend-pet-tracker/`, sin workspace raíz, `bun.lock` propio. pnpm y bun
  no se pisan si no comparten `package.json`; esquiva el bug de detección de
  EAS en monorepos (expo/eas-cli #2658). NO llamarla `app/` (colisiona con la
  carpeta de rutas de expo-router). (R1)
- **D2 — bun >= 1.2** (formato `bun.lock` textual; máquina del humano:
  1.3.14). **Node LTS sigue en REQUIRED_TOOLS**: `bun create expo-app` usa
  `npm pack` para bajar la plantilla y jest corre sobre node. No "limpiar"
  node de los requisitos. (R1, R9)
- **D3 — `.env` propio de la app** con `EXPO_PUBLIC_API_URL` +
  `.env.example` tracked. `env-drift.mjs` NO se extiende (deuda condicional
  abajo). (R8)
- **D4 — Smoke en Android físico con Expo Go** (decisión humana 2026-08-19):
  misma WiFi, URL `http://<IP-LAN>:3000/v1`. Expo Web fuera; CORS no se toca
  — un dispositivo nativo no aplica CORS, así que el backend queda intacto.
  (R12, R13)
- **D5 — Sin BUILD_CMD para la app**: la verificación de compilación es
  `tsc --noEmit` (script `typecheck`). `expo export` queda para cuando haya
  algo que exportar. (R9)
- **D6 — jest-expo día 1** (cerrada por el spec_author, 2026-08-19):
  expo/expo **#47435 está CERRADO**. El conflicto (`jest-expo@57.0.0` pedía
  peer `@react-native/jest-preset@^0.85` contra RN 0.86) está arreglado en
  **`jest-expo@57.0.4`**, cuyo peer es `@react-native/jest-preset@^0.86.2`
  (verificado en el registry de npm el 2026-08-19). Por tanto el scaffold
  exige `jest-expo` **>= 57.0.4**. Fallback documentado SOLO si la
  resolución volviera a fallar: `"overrides": { "@react-native/jest-preset":
  "0.86.x" }` en el `package.json` de la app — no aplicarlo preventivamente.
  (R2–R7)
- **D7 — Tipos duplicados a mano** en `api/types.ts`; solo el shape de
  `GET /v1/health`. Deuda de codegen OpenAPI anotada abajo. (R3, R4)
- **D8 — Sin campo `area`** en `feature_list.json`: convención de nombre
  `mobile-*` + `files_affected`.
- **D9 — Harness en el MISMO PR**: bun en `REQUIRED_TOOLS`, comandos `--cwd`
  en `init.config.sh`, `oven-sh/setup-bun` + cache en `ci.yml`. Sin guardas
  silenciosas (`command -v bun && ...` prohibido — doctrina del repo tras
  #21/#23). (R9, R10)

## Estructura de la app (tras R1)

```
mobile-pet-tracker/
├── app/
│   ├── _layout.tsx          # de la plantilla (reset-project)
│   ├── index.tsx            # pantalla health (R7)
│   └── __tests__/
│       └── index.test.tsx   # R7
├── api/
│   ├── types.ts             # HealthResponse (D7)
│   ├── health.ts            # healthUrl, fetchHealth, HealthState
│   └── __tests__/
│       └── health.test.ts   # R2–R6
├── assets/                  # plantilla
├── .env                     # NO tracked (R8)
├── .env.example             # tracked (R8)
├── .gitignore               # debe cubrir .env
├── app.json
├── bun.lock
├── package.json
└── tsconfig.json
```

## Contrato de módulos (nombres exactos)

`mobile-pet-tracker/src/api/types.ts`:

```ts
export interface HealthResponse {
  postgres: 'ok' | 'error';
}
```

(Duplicado a mano del shape de
`backend-pet-tracker/src/modules/health/application/use-cases/check-health.use-case.ts`:
200 si ok, 503 si error. No importar nada del backend.)

`mobile-pet-tracker/src/api/health.ts`:

```ts
export type HealthState =
  | { kind: 'ok' }
  | { kind: 'error' }        // backend respondió pero degradado (R4)
  | { kind: 'unreachable'; message: string }  // fetch lanzó (R5)
  | { kind: 'missing-config' };               // sin EXPO_PUBLIC_API_URL (R6)

export function healthUrl(baseUrl: string): string;  // R2

export async function fetchHealth(
  baseUrl: string | undefined,
  fetchFn: typeof fetch = fetch,   // inyectable para tests
): Promise<HealthState>;
```

Reglas de `fetchHealth`: `baseUrl` vacío/undefined → `missing-config` sin
llamar `fetchFn`; respuesta 200 con `postgres: 'ok'` → `ok`; cualquier otra
respuesta HTTP (503, body inválido) → `error`; `fetchFn` rechaza →
`unreachable`. Nunca lanza.

`mobile-pet-tracker/src/app/index.tsx`: componente default-export; lee
`process.env.EXPO_PUBLIC_API_URL` (único punto de lectura), llama
`fetchHealth` al montar; renderiza `testID="health-state"` con texto = `kind`
+ una línea legible con la URL consultada; `testID="health-retry"` reejecuta
el chequeo. Sin estado global, sin librerías nuevas de UI.

## package.json de la app (scripts y devDependencies que fija esta spec)

Scripts (los de la plantilla se conservan; se añaden/ajustan):

```json
"test": "jest",
"typecheck": "tsc --noEmit"
```

(`lint` ya viene como `expo lint`; `test` sin `--watch` para que init.sh/CI
no cuelguen.)

devDependencies añadidas con `bun expo install`/`bun add -d`:
`jest-expo` (>= 57.0.4), `jest@~29.7.0`, `@testing-library/react-native`,
`@types/jest`. Si bun no resuelve solo el peer, añadir explícitamente
`@react-native/jest-preset@^0.86.2` como devDependency. Config jest en
`package.json`: `"jest": { "preset": "jest-expo" }`.

## Harness (cambios exactos, R9–R10)

`init.config.sh`:

```bash
REQUIRED_TOOLS=("node" "pnpm" "bun")
INSTALL_CMD="pnpm -C backend-pet-tracker install && pnpm -C infra install && bun install --cwd mobile-pet-tracker"
TEST_CMD="<actual> && bun run --cwd mobile-pet-tracker test"
LINT_CMD="<actual> && bun run --cwd mobile-pet-tracker lint"
TYPECHECK_CMD="<actual> && bun run --cwd mobile-pet-tracker typecheck"
# BUILD_CMD y E2E_CMD/E2E_REQUIRED_PORTS: sin cambios (D5; la app no añade puertos)
```

`.github/workflows/ci.yml` — pasos nuevos después de `setup-node`:

```yaml
- uses: oven-sh/setup-bun@v2
  with:
    bun-version: "1.3.14"

- uses: actions/cache@v4
  with:
    path: ~/.bun/install/cache
    key: ${{ runner.os }}-bun-${{ hashFiles('mobile-pet-tracker/bun.lock') }}
```

## Archivos afectados

- `mobile-pet-tracker/` — nueva (scaffold R1 + código R2–R8)
- `init.config.sh` — R9
- `.github/workflows/ci.yml` — R10
- `AGENTS.md` — fila en §2 Mapa del repositorio (R11, skill docs-readme-sync)
- `backend-pet-tracker/` — **ni una línea** (R12)

## Convenciones móviles mínimas (para esta feature)

- Archivos kebab-case; componentes de ruta según convención expo-router.
- Tests nombran su R-id: `describe('R3: ...', ...)`.
- Conventional commits con scope `mobile` (o `harness` para R9–R11).
- Las capas domain/application/infrastructure de Nest NO se replican aquí.
- Promover estas convenciones a `docs/conventions.md` cuando llegue la
  segunda feature móvil (deuda abajo).

## Riesgos y mitigaciones

- **`trustedDependencies` de bun**: bun no ejecuta `postinstall` por defecto;
  un paquete RN con postinstall silenciado falla en runtime de forma no
  obvia. Mitigación: tras `bun install`, correr `bun pm untrusted` y anotar
  el output en `progress/impl_mobile-app-scaffold.md`; si algún paquete lo
  necesita, añadirlo explícitamente a `trustedDependencies` en el
  `package.json` de la app (nunca deshabilitar la protección globalmente).
- **URL por target**: emulador Android sería `10.0.2.2`, web `localhost` —
  por eso la URL NUNCA se hardcodea: siempre `EXPO_PUBLIC_API_URL`, y el
  default documentado (en `.env.example` y R13) es la IP LAN del humano (D4).
- **Firewall de Windows**: primer arranque de Nest puede requerir permitir
  node en red privada para que el teléfono alcance el puerto 3000 (nota en
  R13).
- **CI sin bun rompería todos los PRs**: por eso R10 va en el mismo PR (D9).

## Alternativas descartadas

- **Workspace raíz / paquete `shared-types`**: cruza dos package managers,
  reactiva expo/eas-cli #2658, y hoy se comparte UN endpoint (coste de
  duplicar ≈ 0).
- **Import relativo desde la app a `backend-pet-tracker/src`**: Metro tendría
  que compilar código Nest; rompe el aislamiento de islas.
- **Codegen OpenAPI hoy**: el backend no tiene OpenAPI y sus DTOs son zod —
  añadirlo es un cambio de backend con su propio gate (fuera de #31).
- **`expo export` como BUILD_CMD**: lento para CI y sin consumidor;
  typecheck cubre la verificación de compilación (D5).
- **Guarda `command -v bun && ...` en init.config.sh**: crearía el cuarto
  modo de fallo silencioso del entorno local; bun requerido explícito.
- **Lógica pura con `node --test`/bun test en vez de jest-expo**: era el plan
  B de D6; innecesario porque el fix de #47435 ya está publicado
  (jest-expo 57.0.4).

## Deuda anotada (no se hace en #31)

- Extender `env-drift.mjs` a la pareja `.env`/`.env.example` de la app —
  SOLO si la deriva muerde una vez.
- Codegen OpenAPI / tipos compartidos — reevaluar cuando la app consuma
  auth + pets (superficie > 1 endpoint).
- Sección "Convenciones de la app móvil" en `docs/conventions.md` — en la
  segunda feature móvil.
- Pinear bun en `eas.json` — cuando exista EAS Build.
