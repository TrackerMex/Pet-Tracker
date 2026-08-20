# review: mobile-ui-foundation (#32)
Fecha: 2026-08-20
Veredicto: APROBADO (implementación R1-R9 de Codex; el cierre a `done` sigue
gateado por R10, smoke humano en Expo Go — nada en esta implementación lo bloquea)

Alcance revisado: commits `36abe8c..b309c3c` en `feature/32-mobile-ui-foundation`.
Referencias canónicas usadas: skills `expo:expo-tailwind-setup`,
`expo:expo-design-system`, `expo:expo-router` + design.md §Verificación de APIs.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`#32 mobile-ui-foundation`)
- [x] progress/current.md actualizado (describe la sesión activa y el handoff a Codex)
- [x] progress/history.md existe con sesiones cerradas

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — N/A directo: la feature es 100%
      isla móvil; `git diff --stat main...HEAD -- backend-pet-tracker/ infra/` vacío
- [x] repositories/contratos en domain son interfaces puras — sin cambios en backend
- [x] application depende de interfaces, no implementaciones — sin cambios en backend
- [x] infrastructure sin lógica de negocio — sin cambios en backend
- [x] Convenciones de la isla móvil (spec + skills Expo): kebab-case, rutas solo
      en `src/app/`, sin `StyleSheet.create` ni hex en componentes, tokens en
      `src/theme/global.css`, `_layout.tsx` define el Stack — todo cumplido

## Checklist C4 — TDD
- [x] Cada R<n> con test que lo nombra o verificación estructural amparada por
      la excepción C4 de requirements.md §Excepción:
      - R1: `heroui-smoke.test.tsx` → `describe('R1: ...')` — rojo `b03fb4c`
        (solo el test, sin deps/config) → verde `a727f7a`. Entre rojo y verde
        solo cambió `render` → `await render`; asserts intactos.
      - R6: `index.test.tsx` → `describe('R6: theme toggle')` — rojo `1cd1bae`
        (solo el test; `theme-toggle` no existía) → verde `a76a572`.
      - R5: la suite heredada `describe('R7: health screen states and retry')`
        actúa de regresión; asserts sin modificar (diff verificado).
      - R2, R3, R7: pura configuración — excepción C4 aplicada tal como está
        escrita; verificación estructural abajo.
      - R8: documentación; R9: verificación de integración.
- [x] Historial test-primero: 20 commits granulares, patrón
      test(rojo) → feat(verde) → docs(trace) por requisito

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" en el alcance de Codex (R1-R9);
      la fila R10 dice "pendiente" por diseño: es el gate humano documentado en
      requirements §R10 y fuera del alcance de esta revisión — queda como
      condición explícita para marcar la feature `done`
- [x] Cada R1-R9 tiene test/verificación y commit registrados; hashes cotejados
      contra `git log` (todos existen y coinciden con su mensaje)
- [x] Commits siguen `tipo(mobile-ui-foundation): <desc> (R<n>)`

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved`
- [x] Casilla "Aprobado por humano" marcada (2026-08-20)
- [x] Ningún requisito modificado tras la aprobación: el único diff en
      requirements.md dentro del rango es el flip de frontmatter draft→approved
      (la aprobación misma, commit previo al inicio de implementación)

## Checklist C7 — Sin código huérfano
- [x] El código reemplazado (objeto `stateColors` con hexes + `StyleSheet.create`
      de #31) fue eliminado en la misma migración de `src/app/index.tsx`
- [x] Sus tests no se eliminaron porque son la suite de regresión exigida por R5
      (asserts intactos); no queda ningún `.spec/.test` de archivo inexistente
- [x] grep de `StyleSheet.create` y `#[0-9a-f]` en `src/app/index.tsx`: 0 resultados

## Verificación estructural por requisito
- R2: `metro.config.js` == design §D2 literal (`withUniwindConfig`,
  `cssEntryFile: './src/theme/global.css'`, `dtsFile: './src/uniwind-types.d.ts'`);
  `src/theme/global.css` == design §D4 literal (imports tailwindcss/uniwind/
  heroui-native/styles, `@source`, `--accent: #208AEF` + `--accent-foreground:
  #ffffff` en variantes light y dark). `node` carga el config sin error
  (implícito en `expo lint`/arranque de jest con metro preset).
- R3: `bun run typecheck` exit 0 (ejecutado por mí); `src/uniwind-env.d.ts`
  tracked con contenido exacto `/// <reference types="uniwind/types" />`;
  `.gitignore` ignora `src/uniwind-types.d.ts`; `git ls-files` confirma
  (env sí, types no; el generado ni siquiera existe en disco y el typecheck pasa).
- R4: `_layout.tsx` importa `../theme/global.css` y monta
  `GestureHandlerRootView(flex:1) > HeroUINativeProvider > Stack` en ese orden.
- R5: Chip `testID="health-state"` con el `kind` exacto como texto y el mapeo
  de classNames de §D7 (ok→success, error→danger, unreachable→warning,
  missing-config→muted); Button `testID="health-retry"` reejecuta `fetchHealth`;
  suite de #31 verde sin modificar asserts.
- R6: `Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')` — dark→light,
  cualquier otro caso→dark; iconos Moon (light) / Sun (dark) de
  `reicon-react-native`; cambio en seco, sin animación (nitro queda en #43).
- R7: `eas.json` == design §D8 literal (developmentClient true, distribution
  internal, bun 1.3.14, cli >= 16.0.0, solo perfil development);
  `expo-dev-client ~57.0.14` en package.json (alineado SDK 57).
- R8: `docs/conventions.md` línea 240: `## Convenciones de la app móvil`
  después de `## Variables de entorno` (línea 205), con los 6 puntos mínimos
  (className/tokens, prohibición StyleSheet+hex, HeroUI base, reicon,
  Reanimated 4 / Motion descartado, jest-expo + R-ids, bun).
- R9: `git diff --stat main...HEAD -- backend-pet-tracker/ infra/
  init.config.sh .github/` → vacío (verificado por mí). `init.sh` no tocado.
- Expo Go (restricción del humano): las deps nuevas son JS puro
  (heroui-native, uniwind, reicon-react-native, @gorhom/bottom-sheet,
  tailwind*) o nativos bundleados en SDK 57 con versiones alineadas
  (svg 15.15.4, gesture-handler ~2.32.0, reanimated 4.5.1, worklets 0.10.1,
  expo-blur ~57.0.2). Nada exige dev build; `expo-dev-client` queda instalado
  pero R10 documenta el flag `--go` obligatorio. R10 no está bloqueado.

## Observaciones
Ninguna bloqueante. Menores, para el registro:
1. R5 decía "solo se permite tocar ese archivo para añadir el describe de R6",
   pero `index.test.tsx` también ganó `wrapper: HeroUINativeProvider` en los
   `render` y un mock de `useUniwind`. Los asserts están intactos (diff
   verificado commit a commit) y el cambio es plomería de montaje inevitable
   (HeroUI 1.0.8 exige su provider), documentado en el impl report. El SHALL
   central del requisito ("pasar sin modificar sus asserts") se cumple.
2. Config extra no listada en design pero amparada por la excepción C4 y
   documentada en impl report §Ajustes: `src/css-env.d.ts`,
   `test/jest-setup.js` (mock oficial de Worklets + `setUpTests()`),
   moduleNameMapper para `reicon-react-native` (solo jest, no Metro).
3. e2e de backend saltados (LocalStack 4566 abajo) — mismo estado que el gate
   inicial de la sesión, no es regresión de esta feature; `init.sh` exit 0.
4. Preexistente (no de esta feature): `src/api/__tests__/health.test.ts` usa
   R-ids de #31 que colisionan en numeración con los de #32 (dos `R6:` en la
   isla); traceability desambigua por archivo.

## Output de ./init.sh (ejecutado por el reviewer, cola)
```
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
✅ Tests pasados
→ Tests e2e...
⚠️  Puerto 4566 sin respuesta — se saltan los e2e (levanta la infra con: docker compose up -d)
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
INIT_EXIT=0
```
(Backend y harness verdes en la sección previa del run; suites móviles
reejecutadas además en directo: `bun run test -- --runInBand --verbose` →
3 suites / 15 tests verdes, con R1, R6 y R7 nombrados en los describes.)
