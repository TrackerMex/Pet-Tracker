# impl: merge-dev-222 (resolución mecánica, fallback leader)

## Cambio
`mobile-pet-tracker/src/screens/profile/index.tsx` (~l.305): quitados los marcadores. Orden final de los primeros hijos de `screen-profile`:
1. `<View testID="profile-heading" ... />` (#222 R7, primer hijo)
2. `{showHero ? <HeroStatusBar /> : null}` (#217 R6)
3. `{showHero ? (<View testID="profile-hero" ...` (sin tocar)

No se tocó ningún test. Sin commit, sin rebase, sin init.sh.

## Verificación (sin pipe, desde `mobile-pet-tracker/`)
- `bunx tsc --noEmit` -> exit 0.
- El repo no tiene `jest.config.js` (config en `package.json`, preset jest-expo): se usó `bunx jest <paths>`.
- `bunx jest src/screens/profile src/providers/__tests__/language-provider.test.tsx src/__tests__/alerts-canvas-fidelity.test.ts` -> 337/338 pasan; 1 rojo:
  `#173 R5: cápsula de añadir mascota › pinta Add pet en inglés con la misma receta` (`findByTestId('pet-info-card')` agotó el timeout, index.test.tsx:307). Es timeout bajo carga (3 suites en paralelo, 127 s), no relacionado con el orden de hijos.
- Rerun de `bunx jest src/screens/profile` aislado -> 202/202 verde (incluye `#222 R7` primer hijo y `#217 R6` orden de fuente). language-provider y alerts-canvas-fidelity pasaron en la corrida conjunta.

Veredicto: VERDE (con un flake de timeout bajo carga en #173 R5, verde en rerun).
