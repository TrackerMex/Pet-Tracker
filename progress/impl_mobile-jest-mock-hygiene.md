# Implementación — #53 `mobile-jest-mock-hygiene`

- Fecha: 2026-09-03
- Branch: `feature/53-mobile-jest-mock-hygiene`
- HEAD inicial: `041d5b8259901e6134ec63bb33d1fc393f5fb644`
- Alcance: un único archivo de código,
  `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`

## Preparación

- `expo-overview` no estaba en el caché local del plugin Expo 1.0.2; se cargó
  completa desde el repositorio oficial actual de Expo. Su routing no asigna
  una skill específica adicional a esta tarea de higiene Jest sin cambios de
  UI.
- Se confirmó Expo SDK `~57.0.14`, Jest `~29.7.0`, `jest-expo ^57.0.4` y
  `expo-image-picker ~57.0.13`, y se consultó la documentación versionada de
  Expo SDK 57 antes de modificar código.
- `./init.sh` inicial: exit 0 después de sincronizar el `.env` local ignorado
  con las credenciales del entorno compartido. Etapa móvil de línea base:
  `Test Suites: 53 passed, 53 total` y `Tests: 612 passed, 612 total`.

## R1 — reinicialización del mock del picker

- Rojo: `bun run test -- src/screens/add-pet/index.test.tsx` terminó con exit
  1 antes del `beforeEach`. Evidencia:

  ```text
  Tests:       1 failed, 7 passed, 8 total
  Received: canceled: false, uri: "file:///new-pet.jpg"
  ```

  El test nuevo heredó el asset configurado por el test anterior, como exige
  el caso rojo de D5.
- Commit rojo: `79caf8c` —
  `test(mobile-jest-mock-hygiene): red picker mock leaks across tests (R1)`.
- Verde: tras añadir el único `beforeEach` de archivo con `mockReset()` y el
  resultado cancelado por defecto, el mismo comando terminó con exit 0:

  ```text
  Tests:       8 passed, 8 total
  ```

- Commit verde: `43183c4` —
  `fix(mobile-jest-mock-hygiene): reset picker mock before each test (R1)`.
- Refactor: sin refactor; la implementación definida en D1/D4 ya es mínima.

## R2 — estabilidad en 10 corridas

Línea base previa a R1:

```text
Tests:       7 passed, 7 total
```

Comando literal de D6 ejecutado desde `mobile-pet-tracker/`:

```bash
for i in $(seq 1 10); do
  bun run test -- src/screens/add-pet/index.test.tsx 2>&1 | grep -E '^Tests:' \
    || { echo "FLAKE en corrida $i"; break; }
done
```

Resultado: exit 0, 10/10 corridas verdes.

```text
Tests:       8 passed, 8 total
Tests:       8 passed, 8 total
Tests:       8 passed, 8 total
Tests:       8 passed, 8 total
Tests:       8 passed, 8 total
Tests:       8 passed, 8 total
Tests:       8 passed, 8 total
Tests:       8 passed, 8 total
Tests:       8 passed, 8 total
Tests:       8 passed, 8 total
```

Commit de evidencia: `e72612f` —
`test(mobile-jest-mock-hygiene): record 10 green runs (R2)`.

## R3 — suite completa y configuración Jest intacta

- `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/test/`:
  vacío antes y después de implementar (exit 0, sin stdout).
- `mobile-pet-tracker/jest.config.js`: no existe.
- `./init.sh` final desde la raíz: exit 0; build, tests, e2e, lint y
  typecheck verdes. Líneas de la etapa móvil:

  ```text
  Test Suites: 53 passed, 53 total
  Tests:       613 passed, 613 total
  ```

- Commit de evidencia: `c5a9ee2` —
  `test(mobile-jest-mock-hygiene): record full-suite verification (R2,R3)`.

## Resultado

- R1: test rojo genuino y corrección mínima en commits separados; 8/8 verde.
- R2: 10/10 corridas dirigidas verdes.
- R3: `./init.sh` exit 0 y configuración Jest intacta.
- No se creó ningún recurso AWS ni se ejecutó `cdk deploy`.
