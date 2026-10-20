# impl: 186 E2 (fallback implementer, cambio de una línea)

- Commit: 22d64701 `test(mobile): mínimo de elementos HeroUI tras R8 (#186 E2)`
- Cambio: `heroui-text-size-merge.test.ts`, `toBeGreaterThanOrEqual(211)` -> `(200) // #186 R8: 211 - 12 + 1` (solo heroElements).
- `heroui-text-size-merge.test.ts`: Tests: 25 passed, 25 total
- `bun run typecheck`: exit 0
- `bunx expo lint --no-cache` (log vacío): exit 0
- `test ! -e .expo/types/router.d.ts`: ok
- `src/screens/map/index.test.tsx` (solo, sin flags): Tests: 271 passed, 271 total
- `src/components/__tests__/celebration.test.tsx` (solo, sin flags): Tests: 66 passed, 66 total
- Árbol limpio tras el commit; no se tocó nada más.
