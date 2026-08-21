# Implementación — mobile-tabs-shell (#34)

- Fecha: 2026-08-21
- Branch: `feature/34-mobile-tabs-shell`
- Alcance de Codex: R1-R10
- Estado: R1-R10 implementados y verificados; R11 queda pendiente del smoke
  humano con Expo Go en Android físico.

## Resultado

- Los layouts `(tabs)` y `(auth)` aplican guards complementarios durante la
  restauración, con `/login` y `/home` como destinos respectivos.
- El destino post-sesión cambió de `/health` a `/home` en los tres puntos
  aprobados. Health y su suite se movieron al grupo `(tabs)` conservando los
  asserts heredados.
- Home, Map, Food y Profile ofrecen placeholders centrados; Profile permite
  cerrar sesión mediante el `AuthProvider` existente.
- `FloatingTabBar` renderiza Home, Map, Health, Food y Profile en ese orden,
  usa iconos de `reicon-react-native`, tokens del tema y estados Filled /
  Outline, respeta eventos preventivos y navega solo a tabs inactivas.
- La barra usa la geometría D3 y calcula su posición inferior como
  `useSafeAreaInsets().bottom + 12`.
- No se añadieron dependencias ni imports directos de React Navigation.

## Evidencia TDD y commits de implementación

| R-id | Rojo | Verde / implementación |
|---|---|---|
| R1 | `929d6b2` | `0822ba7` |
| R2 | `c1dc47d` | `b3028d1` |
| R3 | `d3992fb` | `2995514` (excepción C4 de hrefs/renames) |
| R4 | excepción C4 de mudanza aprobada | `0a55b28` |
| R5 | `f49519b` | `b45c1a4` |
| R6 | `95ecd19` | `9100e17` |
| R7 | `9f7d634` | `e306135` |
| R8 | `f30952c` | `cf99e35` |

Cada commit rojo precede al verde correspondiente. R3 y R4 siguen las
excepciones C4 documentadas en `tasks.md`: el diff de R3 quedó limitado a los
tres hrefs y sus tres asserts; R4 fue detectado como rename 96% de la pantalla
y 95% de la suite, con solo imports/paths modificados.

## Verificación R9

- `typedRoutes` continúa activo en `app.json`.
- Se regeneró `.expo/types/router.d.ts` arrancando Metro una vez con
  `CI=1 bunx expo start --go`; el tipo generado incluye `/home`, `/map`,
  `/health`, `/food`, `/profile` y `/login`. No se conectó un dispositivo ni
  se ejecutó el smoke R11.
- `bun run --cwd mobile-pet-tracker typecheck`: exit 0 después de regenerar
  los tipos.
- `bun run --cwd mobile-pet-tracker lint`: exit 0.

## Verificación R10

- Suite móvil completa: 13 suites, 75 tests, todos verdes, tanto dentro de
  `./init.sh` como mediante `bun run --cwd mobile-pet-tracker test -- --silent`.
- `./init.sh`: exit 0.
  - backend: 143 suites, 1111 tests;
  - infra: 2 suites, 14 tests;
  - harness env drift: 11 suites, 28 tests;
  - móvil: 13 suites, 75 tests;
  - build, lint y typecheck: verdes.
- E2E: omitidos por el harness porque LocalStack no respondía en el puerto
  4566; mobile-tabs-shell no requiere AWS y no se levantaron recursos reales.
- Contención:
  `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  devolvió salida vacía.
- `package.json` y `bun.lock` móviles no tienen diff contra `main`; no se
  añadieron dependencias.
- `git diff --check main...HEAD` no reportó errores.
- Greps de reviewer: sin `StyleSheet.create`, colores hex ni imports
  `@react-navigation` en el código de producción nuevo.

## Pendiente humano

- R11: ejecutar exactamente el smoke de `requirements.md` con Expo Go en un
  Android físico.
- Después del smoke corresponde lanzar `reviewer`; la feature permanece
  `in_progress` y no se marca `done` antes de esos gates.

## Estado del worktree

Los cambios locales preexistentes en `.gitignore`, modos de `init.sh` y
`init.config.sh`, `.agents/`, skills y `skills-lock.json` se preservaron y no
se incluyeron en los commits de mobile-tabs-shell.
