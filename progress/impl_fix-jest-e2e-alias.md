# impl: fix-jest-e2e-alias
Fecha: 2026-08-01

## Archivos modificados
- `backend-pet-tracker/test/jest-e2e.json` — el `moduleNameMapper` resolvía
  `@/` a `<rootDir>/src/$1`, pero con `rootDir: "."` eso apunta a `test/src/*`
  (inexistente). Cualquier e2e que cargara `app.module.ts` fallaba con
  `createNoMappedModuleFoundError`. Cambio mínimo de una línea:

  ```diff
  -    "^@/(.*)$": "<rootDir>/src/$1"
  +    "^@/(.*)$": "<rootDir>/../src/$1"
  ```

No se tocó ningún otro config, código fuente ni package.json.

## Verificación

### `pnpm run test:e2e` (antes: 1 passed, 2 failed)
```
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Time:        7.137 s
```

### `pnpm test` (unit, mapper propio no afectado)
```
Test Suites: 30 passed, 30 total
Tests:       99 passed, 99 total
Time:        10.667 s
```

## Commit
- `1edcd38b10be49220ad8abb7935249c1cf84e249` — `fix(test): resolve @/ alias to real src dir in jest e2e config` (branch `fix/jest-e2e-alias`)

## Notas para el reviewer
- Fix de una sola línea en config de tests; no hay requisitos R<n> ni spec
  asociada (bugfix de harness de pruebas, no feature).
- Verificado contra Docker real (postgres + localstack ya provisionados).
