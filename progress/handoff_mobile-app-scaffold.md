# Handoff a Codex CLI — mobile-app-scaffold (#31)

Fecha: 2026-08-19. Spec aprobada por humano ese día. Prompt entregado al
humano para correr en la terminal de Codex.

---

Feature: mobile-app-scaffold (#31), branch: feature/31-mobile-app-scaffold (ya existe, trabaja sobre ella)
Spec aprobada: specs/mobile-app-scaffold/requirements.md (status: approved)
Lee también: specs/mobile-app-scaffold/design.md, tasks.md y traceability.md

Archivos a crear/modificar:
  - mobile-pet-tracker/ (carpeta nueva, scaffold Expo SDK 57 + código de R2-R8)
  - init.config.sh (R9: bun en REQUIRED_TOOLS + comandos --cwd mobile-pet-tracker)
  - .github/workflows/ci.yml (R10: oven-sh/setup-bun@v2 pineado a 1.3.14 + cache de bun.lock)
  - AGENTS.md (R11: fila de mobile-pet-tracker/ en la tabla §2 "Mapa del repositorio")
  - specs/mobile-app-scaffold/traceability.md (tras cada commit)
  - NADA más. Prohibido tocar backend-pet-tracker/ (R12, CORS incluido) y
    prohibido crear package.json, lockfile o node_modules en la raíz del repo (R1).

Reglas críticas:
  - R1 primero y en COMMIT PROPIO: `bun create expo-app mobile-pet-tracker`
    (plantilla default, expo-template-default@~57.0.16) y luego
    `echo n | bun run reset-project` dentro de la app (el script es
    interactivo; `n` borra el código de ejemplo src/ y scripts/ y deja
    src/app/ mínimo). Ese commit lleva SOLO scaffold generado, cero código a
    mano — es la excepción a C4 documentada en la spec.
    Nota Windows: hoy un `bun create expo-app` falló con
    "EPERM: operation not permitted, rename ... app.json" (bloqueo transitorio
    de antivirus/watcher). Si te pasa: borra la carpeta entera y reintenta;
    si insiste, pide al humano cerrar VS Code durante el create.
  - Los cuatro estados del cliente son un union: { kind: 'ok' | 'error' |
    'unreachable' | 'missing-config' } — rutas y símbolos EXACTOS de la spec
    (src/api/health.ts: healthUrl, fetchHealth con fetchFn inyectable;
    src/app/index.tsx: testID health-state y health-retry).
  - TDD estricto para TODO lo escrito a mano (R2-R7): commit con el test ROJO
    que nombra su R-id (describe('R<n>: ...')) ANTES del commit verde, por
    requisito. Un único commit con implementación+tests incumple C4 y fue el
    defecto de la feature #19: no lo repitas. El test de R7 debe verse fallar
    antes de cablear la pantalla (doctrina de guardas nacidas verdes).
  - Tests con jest-expo@57.0.4 o superior (el peer conflict con RN 0.86 está
    arreglado ahí; fallback de override en design.md §D6 solo si la
    resolución fallara). Corre todo vía bun: bun install --cwd
    mobile-pet-tracker, bun run --cwd mobile-pet-tracker test / lint, tsc
    --noEmit para typecheck. Node LTS sigue instalado y es requisito.
  - R8: mobile-pet-tracker/.env NO se commitea (gitignore de la app ya lo
    cubre); .env.example SÍ, con el placeholder exacto de la spec. Ninguna
    URL de backend hardcodeada en el código (verifícalo:
    grep -rn "3000" mobile-pet-tracker/src debe salir vacío).
  - R9: prohibida toda guarda silenciosa (command -v bun && ...) en
    init.config.sh — bun es requisito duro.
  - Conventional commits en inglés; kebab-case en archivos.
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO cierres la feature: no marques done en feature_list.json, no abras PR,
    no muevas progress/current.md. El cierre pasa por el reviewer y el leader.
    R13 (smoke) es del humano: deja su casilla vacía.

Criterios de aceptación: R1-R12 de specs/mobile-app-scaffold/requirements.md
(R13 queda para el humano). Antes de reportar, corre ./init.sh y déjalo verde
(los e2e de backend se saltan solos si Docker está abajo — eso es aceptable;
lo tuyo es que install/lint/typecheck/test de la app pasen dentro de init.sh).

Al terminar: escribe el resultado en progress/impl_mobile-app-scaffold.md
(qué commits, qué comandos corriste, estado de cada R-id) y termina. No
reportes por chat.
