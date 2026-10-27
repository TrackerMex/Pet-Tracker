# review: mobile-theme-flash-statusbar (#217)
Fecha: 2026-10-27
Veredicto: APROBADO

Alcance revisado: diff `92ef1c62..9bf63593` (20 commits, 28 ficheros), branch `feature/217-mobile-theme-flash-statusbar`.
`init.sh` NO lo corrió el reviewer: lo deniega el clasificador y lo corre el leader. El veredicto vale con ese `init.sh` en verde; el reviewer no puede sustituirlo (ver "Output").

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (en esta rama hay 0; #217 sigue `pending` en `feature_list.json`; el paso a `done` es del leader al cerrar, AGENTS.md §7.2)
- [x] progress/current.md sin cambios (plantilla vacía, sin sesión sin cerrar en la rama)

## Checklist C3 — Arquitectura
- [x] Capas domain/application/infrastructure: N/A, solo `mobile-pet-tracker/` (presentación, tema, manifiesto)
- [x] `theme/navigation-theme.ts` reutiliza `useThemeColors` y `useUniwind`; sin lógica de negocio; sin hex, `StyleSheet` ni clases con corchetes (lo candada R12)
- [x] `components/hero-status-bar.tsx`: 10 líneas, sin props, solo foco y barra

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un `it` con su R-id en el título (R1 navigation-theme.test.tsx; R2/R4 app/__tests__/layout.test.tsx; R3 theme-scene.test.tsx; R5 hero-status-bar.test.tsx; R6 home y profile index.test.tsx; R8/R9/R11/R12 design-drift.test.ts; R10 profile/index.test.tsx; R7 los dos candados existentes sin editar)
- [x] Historial test-primero real, verificado con `git show --stat` por commit: cada `test(#217)` toca solo tests y cada `feat(#217)` solo producción (C1→C2, C3→C4, C5→C6, C7→C8, C9→C10/C11). Rojos por import inexistente en C1/C3: autorizados. C5 (cinco rojos por aserción), C7 (cuatro), C9 (seis) según el reporte.
- [x] R12 (verificación, declarada nace-verde en spec y handoff antes de implementar, vía (b)): la mutación es real. El `it` lee del disco `theme/navigation-theme.ts` y `components/hero-status-bar.tsx` con un patrón que antes se prueba contra tres cadenas plantadas (hex armado con `join`, `StyleSheet.create({})`, `bg-[red]`). Plantar `// StyleSheet` en `hero-status-bar.tsx` lo pone rojo por su aserción (`mutation-217-r12.log`: `Expected pattern: not /…StyleSheet…/`, 1 failed). No hay mutación del doble de test.
- [x] Sondas del reporte con rojo concreto y log: R1 (background←surface), R3 (sin `ThemeProvider`: `rgb(242, 242, 242)`), R4 (StatusBar tras HeroUI: 2349 frente a 2316), R5 (sin puerta de foco), R9 (import reintroducido en Perfil), R12.
- [ ] Nota menor, no bloqueante: C10 (`d0f09b8f`) mezcla borrado de producción y de los tests de nitro en un commit `feat`. Es lo que el paso aprobado pedía (-8 tests, aritmética 5568-8=5560) y es borrado puro.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin ninguna fila "pendiente" (R1–R12 con test y hash de test e implementación; hashes comprobados contra `git log`)
- [x] Commits `feat(#217): R… …` / `test(#217): R… …`; los R-ids van en la descripción y no entre paréntesis al final. Es el formato del handoff; no se rechaza por ello.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla de aprobación marcada (firma delegada del leader, 2026-10-26)
- [x] Cambios posteriores a la aprobación: solo el R12 (`3051367d`, una línea de huella más, enmienda del leader) y design.md (`48085402`, doble global de status-bar). Ambos son del leader bajo el mandato delegado, ninguno cambia la forma de R1–R11.
- [x] Casillas G2 y G3 (humanas) intactas: `[ ]` en `requirements.md`

## Checklist C7 — Sin código huérfano
- [x] Borrados `theme/theme-transition.ts`, `theme/nitro-availability.ts` y los dos `theme/__tests__/theme-transition*.test.tsx`
- [x] `grep -rniE "nitro|theme-transition|useThemeTransition|THEME_FADE|isThemeTransitionAvailable"` sobre `mobile-pet-tracker/` (sin node_modules): cero resultados en código, mocks, `package.json`, `bun.lock`, `app.json`, `eas.json`
- [ ] Residuo documental conocido y fuera de alcance: `docs/conventions.md:347` cita `theme-transition.test.tsx:18` (la spec lo deja como seguimiento del leader al cerrar). `progress/`, `specs/` históricos no se tocan por spec.

## Puntos pedidos por el leader
1. TDD: ver C4. Verificado por historial y por contenido de cada commit.
2. Enmiendas, cada una acotada a lo dicho:
   - C6b `29c28fc2`: 1 fichero, `test/jest-setup.js`, +8 líneas (3 de comentario, 5 de `jest.mock('expo-status-bar', …)` que conserva `requireActual` y sustituye solo `StatusBar` por `() => null`). Los seis tests `renderRouter` sin editar y verdes.
   - C9b `f41f93f3`: 2 líneas en `legibility-classnames.test.ts` (entrada `'theme/navigation-theme.ts'` entre toggle-switch y shadows; sufijo `(enmendado por #217 R1)` en el título). Nada más.
   - C11b `27950bb3`: 4 líneas en `canvas-foundations.test.ts` y `zones-canvas-fidelity.test.ts` (contador 44→42 y sufijo `(enmendado por #217 R8)`); `devDependencies` 8 intacto. La autorización humana de esta enmienda consta solo en la conversación (no verificable desde el repo); 42 es correcto (44 menos dos paquetes nitro, comprobado en `package.json`).
   - `3051367d` (docs del leader): requirements R12, design.md y handoff; consistente con C9b.
3. Candados de fuente de R2/R4 no tautológicos. R2 exige `useNavigationTheme()` < `if (!themeReady)` < `<ThemeProvider value={navigationTheme}>` < `<HeroUINativeProvider>`; el `it` de runtime exige además `value` idéntico (`toBe`) al centinela. Mover el proveedor dentro de HeroUI, ponerlo antes del hook, pasarle otro valor o quitarlo rompe al menos una aserción. R4 exige una sola llamada con `{style:'auto'}`, `ThemeProvider < StatusBar < HeroUINativeProvider` y `split('<StatusBar').length === 2`; la mutación opuesta (StatusBar tras HeroUI) dio rojo (`mutation-217-r4.log`).
4. `bun.lock`: `git diff 92ef1c62 -- mobile-pet-tracker/bun.lock | grep -E '^[-+][^-+]'` = exactamente 4 líneas quitadas, 0 añadidas, las cuatro con `nitro` (2 del workspace, 2 de `packages`). `package.json`: 3 líneas quitadas, 1 añadida (las 2 dependencias y la cola de `transformIgnorePatterns`), ninguna versión cambia. `app/(tabs)/_layout.tsx`: `git diff --stat` vacío.
5. `HeroStatusBar`: fiel a R5/R6, no es una desviación. Contrato exacto (sin props, `null` sin foco, `<StatusBar style="light" />` con foco, `useIsFocused` de `expo-router`). Colocación como hermano condicional previo al hero (`{hasPets ? <HeroStatusBar /> : null}` en Inicio, `{showHero ? … : null}` en Perfil), tal como manda R6. La única desviación es la de la propia spec frente al plan (barra por componente y no por ruta en `(tabs)/_layout.tsx`), ya escrita en `requirements.md` §Desviación consciente.
6. Barra clara solo en Inicio y Perfil con hero y enfocados; el resto hereda `style="auto"` global. Sin mascotas (`home-no-pets-screen`, `profile-pets-empty`) no se renderiza y los tests lo comprueban con cero llamadas tras un `rerender`. Tema: `ThemeProvider` raíz con tokens y `useNavigationTheme()` llamado antes del retorno temprano de `themeReady` (R2); conmutación `Uniwind.setTheme(next)` y luego `void setStoredTheme(next)` con orden afirmado por `invocationCallOrder` (R10). Que el parpadeo desaparezca y que `auto` siga al interruptor solo se mide en G2, fuera de este veredicto.
7. G2 y G3 sin tocar.

## Observaciones (no bloqueantes)
- `mobile-pet-tracker/src/screens/home/index.tsx` ~l.363-371: el comentario de la excepción A9 («El hero va a sangre…») quedó sobre `{hasPets ? <HeroStatusBar /> : null}` y separado de `PetHeroHeader`, al que describe. Cosmético; la colocación es la prescrita.
- `mobile-pet-tracker/src/screens/profile/index.test.tsx` (~l.572): línea en blanco sobrante antes del `});` de `describe('R4: toggle persiste')` tras borrar el `it` R2.
- `feature_list.json`: #217 sigue `pending` en la rama; lo cierra el leader (con tablero Notion y `docs/conventions.md:347`).
- `lint` de este reviewer: mismo patrón (`--no-cache`), salida vacía; el rojo SIGKILL-sale-0 no se puede descartar solo con la salida vacía, pero el reporte de Codex y el typecheck coinciden.

## Verificación independiente (sin init.sh)
- `bun run typecheck` (sin pipe): exit 0, sin `.expo/types/router.d.ts`.
- Jest acotado, sin pipe, `--runInBand`: 25 suites, 458 tests, exit 0 (navigation-theme, hero-status-bar, todo `src/app/__tests__` y `(tabs)/__tests__`, design-drift, legibility-classnames, consistency-classnames, canvas-foundations, zones-canvas-fidelity, ui-language, jest-virtual-mock-lock, font-registration).
- Jest de pantallas: `src/screens/home`, `src/screens/profile`, `__tests__/home-*`, `profile-*`, `no-pets-states`: 14 suites, 780 tests, exit 0.
- `expo lint --no-cache` sobre los ficheros de la feature: exit 0, salida vacía.
- Suite completa, `init.sh` y gates de CI: del leader. El reporte de Codex declara 158 suites / 5560 tests verdes, sin cifra de base distinta de la aritmética 5548+12-... = 5560 (5548 +2 +2 +5 +4 +7 -8 = 5560, coincide).

## Output de ./init.sh
No ejecutado por el reviewer (denegado por el clasificador; lo corre el leader). Aprobación condicionada a que ese `init.sh` salga en verde sin regresiones.
