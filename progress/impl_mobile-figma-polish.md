# Implementación — mobile-figma-polish (#46)

- Fecha: 2026-08-23
- Branch: `feature/46-mobile-figma-polish`
- Alcance de Codex: R1–R11 y gate automatizado de R12
- Estado: R1–R11 implementados y verificados; el smoke visual lado a lado de
  R12 queda reservado al humano.

## Resultado

- `global.css` contiene el mapeo light exacto de la spec y una paleta dark
  derivada del diseño, sin copiar los valores `oklch` del Make.
- Se añadieron los cinco `.ttf` estáticos oficiales de Inter y el layout raíz
  los registra mediante `expo-font` sin bloquear el primer render.
- La pill flotante conserva su contenedor, posición, márgenes, radio y sombras;
  R4 solo ajusta tipografía y tokens de los labels.
- WeightChart conserva sus datos, escalado y degradación para menos de dos
  puntos; su área usa el único `LinearGradient` permitido, desde
  `react-native-svg`.
- Home, Map, Health, Weight log, Profile y las tres pantallas auth recibieron
  únicamente jerarquía visual, superficies, bordes, radios, tipografía e iconos
  basados en tokens.
- No se añadieron dependencias, recursos AWS, navegación, llamadas API ni
  cambios de estado. Tampoco se añadió motion ornamental.

## Evidencia TDD y commits

R1–R3 siguieron TDD por lectura: cada test rojo se ejecutó contra el estado
anterior y terminó con exit 1; después de la implementación, el test focalizado
terminó con exit 0. R4–R11 usaron las suites existentes sin modificar asserts.

| R-id | Commit rojo | Commit de implementación |
|---|---|---|
| R1 | `9e27a80` | `04aef32 feat(mobile-figma-polish): map light design tokens (R1)` |
| R2 | `bef097f` | `80ba96b feat(mobile-figma-polish): derive dark design palette (R2)` |
| R3 | `bed689e` | `e7a8890 feat(mobile-figma-polish): load static Inter fonts (R3)` |
| R4 | No aplica | `b9283f4 feat(mobile-figma-polish): retokenize floating tab labels (R4)` |
| R5 | No aplica | `0326dd6 feat(mobile-figma-polish): polish weight chart area (R5)` |
| R6 | No aplica | `2fd27a3 feat(mobile-figma-polish): polish home dashboard (R6)` |
| R7 | No aplica | `7b491d3 feat(mobile-figma-polish): polish map status overlay (R7)` |
| R8 | No aplica | `e912b5e feat(mobile-figma-polish): polish health hub (R8)` |
| R9 | No aplica | `13bcfa0 feat(mobile-figma-polish): polish weight log (R9)` |
| R10 | No aplica | `41f25df feat(mobile-figma-polish): polish profile settings (R10)` |
| R11 | No aplica | `ab5f2e7 feat(mobile-figma-polish): polish authentication forms (R11)` |

Cada fila R1–R11 se actualizó además en
`specs/mobile-figma-polish/traceability.md` mediante un commit docs separado.

## Comandos ejecutados y exit codes

- `./init.sh` antes de implementar: exit 0 (baseline móvil: 25 suites, 270
  tests).
- Tests focalizados de R1–R3: rojo exit 1 y verde exit 0 en cada ciclo.
- Suites focalizadas de R4–R11: exit 0, sin cambios en tests existentes.
- `bun run typecheck` desde `mobile-pet-tracker/`: exit 0.
- `bun run lint` desde `mobile-pet-tracker/`: exit 0.
- `bun run test -- --runInBand` desde `mobile-pet-tracker/`: exit 0; 27 suites,
  275 tests.
- Auditoría automática de `testID` y copy JSX estático contra `7c77f41`:
  exit 0; multisets idénticos en todos los archivos de R4–R11.
- Diff de `__tests__/` contra `7c77f41`: exit 0; solo aparecen los dos archivos
  nuevos de R1–R3.
- Diff de backend, infra, workflows, API, hooks, providers, manifests y locks
  contra `7c77f41`: exit 0; salida vacía.
- Búsqueda de colores literales (`hex`, `rgba`, `oklch`) en componentes y
  pantallas tocados: exit 1 esperado de `rg`; sin coincidencias.
- `git diff --check`: exit 0.
- `./init.sh` final: exit 0 y mensaje `Todo verde`.
  - backend: 143 suites, 1111 tests;
  - infra: 2 suites, 14 tests;
  - harness env drift: 11 suites, 28 tests;
  - móvil: 27 suites, 275 tests;
  - build, lint y typecheck: verdes.

Los e2e se omitieron automáticamente porque LocalStack no respondía en el
puerto 4566. La feature no crea ni requiere recursos AWS. Jest conserva los
avisos conocidos del test renderer de Uniwind/HeroUI y SVG; no son errores de
lint ni causan fallos.

## Desviaciones y decisiones

- R8 describe un contador calculado de días dentro del tile de próxima vacuna.
  No se añadió porque habría introducido cálculo y copy visibles nuevos, en
  conflicto con la invariante explícita de cero conducta y cero textos nuevos.
  El tile usa un glifo de jeringa y conserva exactamente `Next due`, el nombre y
  la fecha actuales.
- No se copiaron heros, fotos, gradientes ni strings del Make. Se respetó la
  decisión humana de conservar la pill flotante.
- No se ejecutó el smoke humano lado a lado; por ello R12 y la feature se
  mantienen en `in_progress` hasta el review visual.

## Estado del worktree

Se preservaron y excluyeron de todos los commits los cambios locales
preexistentes en `.gitignore`, `init.sh`, `init.config.sh`, `.agents/`, skills,
`skills-lock.json` y los informes de review de otras features.

## Corrección post-smoke: radius
Fecha: 2026-08-23

Detectado en smoke humano: `--radius: 1.25rem` copiaba la semántica shadcn del
Make, pero en heroui-native `--radius` es la BASE de la escala `rounded-*`
(xl=×1.5, 2xl=×2, 3xl=×3 sobre default 0.5rem) — con base 20px todo se inflaba.

Cambios:
- `mobile-pet-tracker/src/theme/global.css`: eliminada la línea
  `--radius: 1.25rem;` de ambos variants (light y dark).
  `--field-radius: 0.75rem` se mantiene.
- `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts`: el assert de
  `radius: '1.25rem'` reemplazado por un assert de ausencia (R1):
  `expect(globalCss).not.toMatch(/--radius:/)` — no matchea `--field-radius:`.
  Resto de asserts intactos.

Commit: e370daa `fix(mobile-figma-polish): drop --radius override, heroui scale base (R1)` (sin push)

Verificación (en mobile-pet-tracker/):
- `bun run test`: 27 suites / 276 tests passed — exit 0
- `bun run typecheck`: exit 0
- `bun run lint`: exit 0

## Corrección post-smoke: dark mode

Fecha: 2026-08-23

### Causa raíz y reproducción

- `global.css` solo declaraba como `@source` el código de heroui-native. Al
  compilar desde `src/theme/`, Uniwind/Tailwind no escaneaba el resto de
  `src/`; el artefacto Android anterior no contenía `bg-accent`,
  `text-accent-foreground`, `font-black`, `text-[10px]` ni
  `rounded-[20px]`. Esto reproduce de forma determinista el texto negro del
  pet chip: la clase `text-accent-foreground` no llegaba al stylesheet nativo.
- El mismo artefacto anterior sí contenía los aliases heredados
  `--color-* -> --<token>` y un evaluador del objeto generado pudo resolverlos
  en ambos temas. Por tanto, no había evidencia para remontar componentes ni
  para cambiar `Uniwind.setTheme`. El negro de los SVG reportado en el Android
  físico queda en el límite del resolver JS observado por el smoke, que Jest no
  reproduce porque mapea los CSS a un stub vacío. Se eliminó esa indirección en
  los colores consumidos por props: cada variant materializa sus
  `--color-accent`, `--color-accent-foreground`, `--color-muted`,
  `--color-success`, `--color-warning` y `--color-danger` con el mismo valor
  aprobado del token base.

### Fix

- Se añadió `@source '../';` a `src/theme/global.css`, sin importar ni copiar
  archivos de `design-src/`.
- Se materializaron los seis aliases semánticos anteriores dentro de light y
  dark. No cambió ningún valor de diseño, componente, `testID`, texto visible,
  navegación, API o dependencia.
- El bundle Android posterior incluye las seis utilidades muestreadas y el
  evaluador del artefacto devuelve en dark `#2ab87c`, `#ffffff`, `#9ca3af`,
  `#34d399`, `#fbbf24` y `#f87171`; ya no puede llegar `invalid` por esos
  tokens a `reicon-react-native` ni al gradiente SVG.
- El test R1/R2 de `global.css` cubre tanto el source de la app como la
  materialización light/dark. La validación visual final de los SVG sigue
  requiriendo repetir el smoke en dispositivo, porque no había emulador ni
  dispositivo ADB disponible en esta sesión.

### TDD y commits locales

- `879a0d6 test(mobile-figma-polish): reproduce dark theme color regression`:
  test focalizado rojo, exit 1 (3 fallos esperados).
- `e2d3d50 fix(mobile-figma-polish): resolve dark theme colors`: fix CSS; test
  focalizado verde, 6 tests, exit 0.
- No se hizo push.

### Comandos y exit codes

- `./init.sh` al inicio: exit 0.
- `bun run test -- --runInBand src/theme/__tests__/global-css.test.ts` antes
  del fix: exit 1; después del fix: exit 0 (6/6).
- `bunx expo export --platform android --no-bytecode --no-minify` antes y
  después del fix: exit 0. Evaluación del config nativo generado: antes faltan
  las utilidades de la app; después están presentes y los seis colores JS
  dark resuelven a hex válidos.
- `bun run typecheck`: exit 0.
- `bun run lint`: exit 0.
- `bun run test -- --runInBand`: exit 0; 27 suites, 279 tests.
- `./init.sh` final: exit 0 (`Todo verde`); backend 143 suites/1111 tests,
  infra 2 suites/14 tests, harness 11 suites/28 tests y móvil 27 suites/279
  tests. Los e2e se omitieron automáticamente al no responder LocalStack en
  `127.0.0.1:4566`.

## Corrección post-smoke: dark mode 2

Fecha: 2026-08-23

### Causa raíz por bug

- **Bug 1 — Profile:** `Sun` y `Moon` no recibían `color`. Reicon conserva
  `currentColor` en el XML cuando falta esa prop y Android lo termina pintando
  negro. Ambos glifos reciben ahora el token `foreground`; el árbol renderizado
  en dark comprueba `#F7F8FA`.
- **Bug 2 — iconos de tabs montadas:** la inspección de Uniwind confirmó que
  `useCSSVariable` sí se suscribe a `Theme` y `Variables`, por lo que la causa
  no era una ausencia literal de suscripción. Sin embargo, `useThemeColor`
  conserva el resultado en estado y depende de que ese listener refresque la
  prop; en el tab Health preservado por Expo Router, el smoke físico observó
  que seguía entregando el valor anterior/no resoluble. El aspecto stale del
  runtime nativo no es reproducible fielmente en Jest porque allí el
  stylesheet de Uniwind está vacío. El fix elimina esa dependencia del valor
  cacheado: `useThemeColors` se suscribe explícitamente a
  `useUniwind().theme` y, en cada render provocado por el tema, lee de forma
  síncrona el `--color-<token>` activo con fallback al token base y finalmente
  a `foreground`, nunca a `invalid`. Se aplicó a Profile, Health, Home,
  Weight log, la floating tab bar y WeightChart; además, todos los glifos que
  aún carecían de `color` en esas pantallas reciben ahora un token semántico.
  Un test de pantalla preservada cambia light → dark y verifica que Syringe
  cambia `#F59E0B` → `#FBBF24`; un test unitario cubre la re-resolución del
  helper. La confirmación visual final sigue siendo el smoke en Android.
- **Bug 3 — Map:** Google Maps para Android no hereda el tema visual de React
  Native. `MapView` necesita una declaración JSON explícita. Se versionó el
  estilo nocturno del tutorial oficial de Google y se pasa como
  `customMapStyle` únicamente cuando `useUniwind().theme === 'dark'`; en light
  la prop queda `undefined`. Fuente:
  https://developers.google.com/maps/documentation/android-sdk/styling

No cambió ningún `testID`, texto visible, flujo, navegación, API o dependencia.

### TDD y commits locales

- `26c8f84 test(mobile-figma-polish): reproduce dark tab and map regressions`:
  tests rojos previos al fix; exit 1 por el helper inexistente y luego tres
  fallos esperados en Profile, Health y Map.
- `d28d406 fix(mobile-figma-polish): refresh tab colors with theme`: resolver
  reactivo y tokens explícitos para los glifos de tabs.
- `b5bff10 fix(mobile-figma-polish): style Google map in dark mode`: estilo
  night oficial y selección light/dark en `MapView`.
- No se hizo push.

### Comandos y exit codes

- `./init.sh` al inicio: exit 0; móvil 27 suites/279 tests.
- Tests focalizados antes de implementar: exit 1 (rojo esperado).
- Tests focalizados de Profile, Health y `use-theme-colors`: exit 0; 3 suites,
  31 tests. `bun run typecheck` del mismo gate: exit 0.
- Test focalizado de Map: exit 0; 1 suite, 25 tests. `bun run typecheck` y
  `bun run lint`: exit 0.
- `bun run test` final desde `mobile-pet-tracker/`: exit 0; 28 suites, 284
  tests.
- `bun run typecheck`: exit 0.
- `bun run lint`: exit 0.
- `./init.sh` final: exit 0 (`Todo verde`); backend 143 suites/1111 tests,
  infra 2 suites/14 tests, harness 11 suites/28 tests y móvil 28 suites/284
  tests. Los e2e se omitieron automáticamente porque LocalStack no respondió
  en `127.0.0.1:4566`.

## R12 — smoke humano: COMPLETO

Fecha: 2026-08-23. El humano ejecutó el smoke lado a lado contra el Make en
Expo Go (Android físico), light y dark, en rondas iterativas con 3
correcciones intermedias (radius `e370daa`, stylesheet dark `e2d3d50`,
dark 2ª ronda `d28d406`+`b5bff10`). Confirmación final del humano en sesión:
"R12 completo" — pantallas en alcance validadas, incluido el caso de cambio
de tema con tabs montadas y el mapa en dark.
