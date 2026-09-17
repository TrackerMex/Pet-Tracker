# Implementación — #90 `mobile-owner-timezone-dates`

Fecha: 2026-09-17  
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend`  
Branch: `feature/90-mobile-owner-timezone-dates`

## Preflight

- `git pull --ff-only`: `Already up to date.`
- `git branch --show-current`: `feature/90-mobile-owner-timezone-dates`.
- Skills cargadas antes de editar código: Expo `building-native-ui` (equivalente instalado de `expo-overview`), Expo `native-data-fetching` (equivalente instalado de `expo-data-fetching`) y Ponytail full.
- `mobile-pet-tracker/.expo/types/router.d.ts`: no existía.
- `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep`: sin salida, exit 1.
- `./init.sh`: exit 0; backend 170/170 suites, infra 2/2 suites, móvil 73/73 suites (1286 tests), E2E 27/30 ejecutadas (3 `aws-real-*` omitidas), lint y typecheck verdes.
- Spec aprobada y P1 aceptada verificadas en `specs/mobile-owner-timezone-dates/requirements.md`.

## R1 — `civilTodayIso`

### Rojo

Se añadió el test de los casos (a)–(e) y un esqueleto que ignora `timeZone` y devuelve el día local del dispositivo. Comando, desde `mobile-pet-tracker/`:

```text
$ bunx jest --runTestsByPath src/utils/civil-today-iso.test.ts
FAIL src/utils/civil-today-iso.test.ts
  #90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo
    ✕ resuelve el mismo instante en Pacific/Kiritimati como 2026-09-18 (5 ms)
    ✓ resuelve el mismo instante en Pacific/Pago_Pago como 2026-09-17 (1 ms)
    ✓ rellena mes y día con cero (1 ms)
    ✓ usa el día del dispositivo sin zona
    ✓ usa el día del dispositivo sin lanzar para una zona inválida (1 ms)
    ✕ usa new Date() cuando now no se proporciona (1 ms)

  ● #90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo › resuelve el mismo instante en Pacific/Kiritimati como 2026-09-18

    Expected: "2026-09-18"
    Received: "2026-09-17"

  ● #90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo › usa new Date() cuando now no se proporciona

    Expected: "2026-09-18"
    Received: "2026-09-17"

Test Suites: 1 failed, 1 total
Tests:       2 failed, 4 passed, 6 total
Snapshots:   0 total
Time:        1.682 s
Ran all test suites within paths "src/utils/civil-today-iso.test.ts".
exit=1
```

Rojo válido: las dos fallas son por el día civil esperado; no hay `Cannot find module` ni `ReferenceError`.

### Verde

Pendiente.

## R2 — catálogo y registro de copy

Pendiente.

## R3 — fecha por defecto en la zona del perfil

Pendiente.

## R4 — fallback al dispositivo (mutación M4)

Pendiente.

## R5 — 400 futuro traducido y formato crudo

Pendiente.

## R6 — regresión de `birthDate` (mutación M6)

Pendiente.

## R7 — verificación final

Pendiente.

## Gate humano — smoke Android/Hermes

Pendiente de ejecución por el humano después de esta implementación. Seguir los pasos 1–7 de `specs/mobile-owner-timezone-dates/requirements.md` §Gate humano y registrar fecha/hora, zonas y resultados sin secretos.
