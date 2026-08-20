---
feature: "mobile-ui-foundation"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-ui-foundation]]

> Disciplina TDD por requisito de [[requirements]]. Commits test-primero
> explícitos: el commit del test rojo (o el diff que lo muestra) precede al
> commit que lo pone verde — no un solo commit con todo (lección de #19,
> CHECKPOINTS C4). Los archivos de pura configuración van bajo la excepción
> C4 documentada en [[requirements]] y se commitean junto al spike que los
> exige.

## R1 — Spike: deps + config jest + HeroUI Button renderiza en jest

- [ ] (1) Escribir `src/__tests__/heroui-smoke.test.tsx` (describe `R1: ...`)
      y verlo FALLAR sin las deps/config (rojo)
- [ ] (2) Instalar deps (D1), añadir bloque jest (D6), `test/css-stub.js`,
      `metro.config.js` (D2), `src/theme/global.css` (D4),
      `src/uniwind-env.d.ts` + `.gitignore` (D5) → test verde
- [ ] (3) Refactor con tests verdes (y `typecheck` verde — cubre R3)

## R2/R3 — Config metro + css + tipos (verificación estructural)

- [ ] (1) Cubiertos por el spike R1: sin `metro.config.js`/`global.css` la
      dev build no compila; sin tipos el typecheck falla
- [ ] (2) Verificar `bun run --cwd mobile-pet-tracker typecheck` exit 0
- [ ] (3) Verificar `git ls-files`: `uniwind-env.d.ts` tracked,
      `uniwind-types.d.ts` ignorado

## R4 — Provider en _layout.tsx

- [ ] (1) Red de seguridad: suite existente verde antes de tocar
- [ ] (2) `_layout.tsx`: import de `../theme/global.css` +
      `GestureHandlerRootView` > `HeroUINativeProvider` > `Stack`
- [ ] (3) Toda la suite jest verde (smoke R1 + index.test.tsx)

## R5 — Migrar pantalla health a HeroUI + className

- [ ] (1) La suite existente `src/app/__tests__/index.test.tsx` (R7 de #31)
      es el test: verla verde antes, y usarla como red durante la migración
- [ ] (2) Migrar `src/app/index.tsx` según D7 (Chip estado, Button retry,
      tokens semánticos, cero StyleSheet/hex) conservando testIDs
- [ ] (3) Refactor con suite verde; grep sin `StyleSheet.create` ni `#hex`

## R6 — Toggle de tema

- [ ] (1) Añadir `describe('R6: theme toggle', ...)` a `index.test.tsx`
      (spy sobre `Uniwind.setTheme`) y verlo ROJO
- [ ] (2) Implementar el Button `theme-toggle` con iconos Sun/Moon (D9) →
      verde
- [ ] (3) Refactor con tests verdes

## R7 — eas.json + expo-dev-client

- [ ] (1) N/A (config pura, excepción C4)
- [ ] (2) Crear `eas.json` exacto de D8; `expo-dev-client` ya instalado en R1
- [ ] (3) Validar JSON (`node -e "JSON.parse(require('fs').readFileSync('mobile-pet-tracker/eas.json'))"`)

## R8 — Sección móvil en docs/conventions.md

- [ ] (1) N/A (docs)
- [ ] (2) Añadir `## Convenciones de la app móvil` tras `## Variables de entorno`
      con el contenido mínimo de R8
- [ ] (3) Releer contra la implementación real (que no documente lo que no es)

## R9 — Contención + init.sh verde

- [ ] (1) N/A
- [ ] (2) `./init.sh` exit 0
- [ ] (3) `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` vacío

## R10 — Gate humano: Expo Go en Android físico

- [ ] Humano: backend arriba + `bunx expo start --go` desde
      `mobile-pet-tracker/` (el `--go` es obligatorio con expo-dev-client
      instalado), escanear QR con Expo Go y verificar pantalla health +
      toggle según los pasos de R10. Sin builds (ni EAS ni Android Studio).
      **No lo corre ninguna IA** (el dispositivo es del humano).
