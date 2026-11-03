# review: mobile-reminders-upcoming-past (#227)
Fecha: 2026-11-03T19:23Z
Veredicto: APROBADO (sujeto al ./init.sh verde del leader)

Worktree: `/home/claude/sites/Pet-Tracker-wt-227`, branch `feature/227-mobile-reminders-upcoming-past`, HEAD `1576e68a`.
Base del diff: H0 = `70987986`. Lista cerrada: los 20 commits de Codex entre `73fe9ec6` (handoff) y `a86ff399` (traceability), más `1576e68a` (reporte).
Alcance: solo lectura y git. No se corrieron `./init.sh`, jest ni la suite, por orden del leader. Las cifras de jest, tsc y lint son las del reporte de Codex y no se verificaron aquí.

## Checklist C2: estado coherente
- [x] Ninguna feature `in_progress` en `feature_list.json`; #227 está `spec_ready`. Codex no tocó `feature_list.json`, `progress/current.md` ni `progress/history.md` (lista cerrada).
- [x] `progress/current.md` describe la sesión activa (plan de arreglos del smoke 2026-11-03, #226–#235).
- [x] Árbol limpio: `git status --short` vacío. Solo queda el marcador ignorado `progress/impl_mobile-reminders-upcoming-past.done`. Los logs temporales de jest, tsc y lint se borraron.

## Checklist C3: arquitectura (móvil)
- [x] `splitReminders` es una función pura en `utils/reminder-dates.ts`. Reusa `daysUntil`, ordena copias y no muta la entrada (lo prueba R3).
- [x] La pantalla solo consume `splitReminders` y el catálogo. Sin acceso nuevo a la API ni a la capa de datos.
- [x] Sin dependencias nuevas. Ni `package.json` ni `bun.lock` cambian.
- [x] La constante de movimiento vive en `theme/motion.ts` (`MOTION_REMINDERS_PAST_STAGGER_MS = 30`), con el comentario `// #227 R10: …` literal de tasks.md.

## Checklist C4: TDD
- [x] Cada R1–R13 tiene al menos un test que nombra su R-id (`#227 R<n>: …`):
  - R2 y R3 están en `utils/reminder-dates.test.ts`;
  - R4–R10 y R12 están en `screens/reminders/index.test.tsx`, dentro de `describe('#227: próximos y pasados')`;
  - R10 está también en `theme/__tests__/motion.test.ts`;
  - R1, R11 y R13 están en `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts`.
- [x] Historial test-primero en el orden de tasks.md (comprobado con `git show --stat` en cada commit):
  - Los commits T0 y los 12 rojos (`c5736b68`, `94bb456d`, `abf97b14`, `98b02bb3`, `cbd7a1f2`, `db2b9c12`, `08541523`, `83637841`, `8ab788c5`, `96e183c5`, `97bf13c6` y `e16a4e31`) tocan **solo ficheros de test**.
  - Los verdes `c54e6d8f` y `4065cc5f` tocan solo producción.
- [x] Los rojos fallan por la aserción, no por un import roto:
  - R2 aserta primero `expect(splitReminders).toEqual(expect.any(Function))`.
  - Los rojos de pantalla usan `expect(queryByTestId(…)).not.toBeNull()`.
  - En R10, la constante `undefined` se compara con `toBe(30)`.
  - En R13, falta el sufijo.
  - Lo confirma el reporte, en sus líneas 183–226.
- [x] R1 y R11 pasan a verde por tandas, como manda la tabla §Notas de tasks.md:
  - en `3ffb6b75` quedan 6 rojos previstos (R1, filas 7–10 de R11 e inventario);
  - en `e4db6d58` quedan 2 (fila 7 e inventario);
  - en `c4c60215`, 0.
- [x] R9 nace verde por D4 y tiene sonda de mutación documentada: la mutación da rojo, se revierte con `git checkout HEAD --` y queda `git diff --exit-code` 0. Está en el reporte, líneas 209–220.
- [x] Cada guard entra en el commit que lo provoca:
  - Las claves suman `+ 2` en `3ffb6b75` y pasan a `+ 4` en `e4db6d58`.
  - TABULAR_NUMS, `tracking-caps` y los iconos van en `3ffb6b75`.
  - Las esquinas, `rounded-22` y `text-15` van en `e4db6d58`.
  - La lista de motion va en `c4c60215`.
  - El sufijo R13 va solo en `6d4ad407`.
- [x] `6d4ad407` (verde de R13) solo añade sufijos. Lo comprobé con un script: 30 líneas `-` y 30 `+`, y cada `+` es su `-` más ` (enmendado por #227 R13)`, una sola vez.

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». Las dos coincidencias son el copy «Nada pendiente por ahora» de la fila R8 y la regla de la línea 27.
- [x] Los 19 hashes citados existen y son ancestros de `a86ff399`, y sus mensajes coinciden con la tabla «Cadena de commits (1–19)».
- [x] Los commits siguen `feat(mobile)` o `test(mobile)`, con su descripción y `(R-ids)`; los mensajes de tasks.md y del handoff son literales.
- [x] Lista cerrada de ficheros: `git diff --stat 70987986..a86ff399` da 17 ficheros, que son el handoff del leader más los 16 de la lista del handoff. `1576e68a` toca solo `progress/impl_mobile-reminders-upcoming-past.md`.

## Checklist C6: spec aprobada
- [x] `requirements.md` tiene `status: approved` y `- [x] Aprobado por humano (fecha: 2026-11-03)` (firma delegada `dc58b2de`, mandato del 2026-10-23 ampliado el 2026-11-03).
- [x] La casilla `- [ ] **G2**` (smoke) sigue sin tocar.
- [x] `requirements.md`, `design.md` y `tasks.md` de #227 no cambian en `70987986..HEAD`.
- [x] Las tres specs enmendadas están intactas: `git diff --stat 70987986..HEAD` sobre `specs/mobile-reminders`, `specs/mobile-routine-canvas-fidelity` y `specs/mobile-canvas-routine` sale vacío. Cada una lleva una vez `## Enmienda #227 — Recordatorios próximos y pasados` y su casilla, ya `[x]` desde la firma, antes de H0.

## Checklist C7: sin código huérfano
- [ ] N/A. Esta feature no reemplaza ningún módulo: reorganiza la lista dentro de la misma pantalla.
  - El literal `${inactive ? ' opacity-50' : ''}` desaparece (inventario de R11 = 0).
  - `inactive` sigue vivo y en uso para la recurrencia, el badge «Hoy» y la meta de estado (`index.tsx:235`, `:236`, `:244`, `:285`). No es código muerto.

## Checklist C8: carta de UI móvil
- [x] Producción grep-limpia en `screens/reminders/index.tsx`: sin hex, sin `StyleSheet`, sin clases `[...]`, sin emoji y sin sombras.
- [x] En producción, `#227` solo aparece en `theme/motion.ts`, como `#227 R10`.
- [x] El radio no-cápsula de la caja de R8 (`rounded-22`) lleva `style={CONTINUOUS_CORNER}`. El inventario da 6 esquinas y 4 tabulares.
- [x] Diana del toggle: `h-10` más `hitSlop={TOUCH_SLOP}`, 52 pt.
- [x] Accesibilidad del toggle: `accessibilityRole="button"` y `accessibilityState={{ expanded: pastExpanded }}`; la cabecera lleva `accessibilityRole="header"`.
- [x] Al pulsar, la opacidad baja a 0.8.
- [x] El chevron toma el color `muted` de `useThemeColors`.
- [x] Los literales de copy de R1 son exactos en `es` y `en`:
  - Próximos / Upcoming;
  - Pasados / Past;
  - «Nada pendiente por ahora» / «Nothing pending for now»;
  - «Los recordatorios nuevos aparecerán aquí.» / «New reminders will show up here.».
- [x] El copy tiene una invocación `t('…')` por clave, 4 filas `// #227 R1` en `R8_REMINDERS` y la §2.40 de `specs/mobile-ui-language/design.md` con las 4 filas literales de R1.
- [x] Las 10 filas de R11 coinciden con la tabla de requirements, y los literales de canvas y de producción son exactos. Los artboards existen en `specs/mobile-reminders-upcoming-past/canvas/`.
- [x] El cuerpo de `renderRow(reminder, past)` es idéntico, token a token, al map anterior, salvo `${past ? ' opacity-50' : ''}` (D3).

## Enmiendas de guards y R13
- [x] La «Tabla de enmiendas» se aplicó fila a fila, sin deltas fuera de ella:
  - `providers/__tests__/language-provider.test.tsx`: `+ 1 // #225 R1` y debajo `+ 4, // #227 R1`.
  - `__tests__/ui-language.test.ts`: `+ 57 // #213 R22` y debajo `+ 4, // #227 R1`; el «113» del título no cambia.
  - `__tests__/design-drift.test.ts`: los iconos pasan a `['ChevronDown', 'ChevronUp', 'Plus', 'Repeat', 'Trash']`, y `rounded-22` pasa a `1 + 1`.
  - `__tests__/consistency-classnames.test.ts`:
    - las esquinas pasan a `4 + 1 + 1`, con el comentario `#227 R8 caja sin próximos`;
    - se añade `+ 1 // #227 R8` tras cada `+ 3 // #215 R20`, uno en `fusiona…` y otro en `#98 R10 › deja…`;
    - TABULAR_NUMS pasa a `3 + 1], // #227 R5`;
    - `#69 R10` lleva `+ 1` más y `; #227 R5`.
  - `__tests__/alerts-canvas-fidelity.test.ts`: `tracking-caps` suma reminders con `; #227 R4`, y `text-15` suma `'screens/reminders/index.tsx', // #227 R8` entre register y reset-password.
  - `theme/__tests__/motion.test.ts`: `'MOTION_REMINDERS_PAST_STAGGER_MS',` justo antes de `'MOTION_REMINDERS_STAGGER_MS',`.
- [x] Las 19 filas de `screens/reminders/index.test.tsx` cumplen la tabla:
  - los renombres;
  - `expandPast()` donde la tabla lo pide;
  - los relojes `2026-12-30T15:00:00.000Z` con su `afterEach` en `#178 R8`, `#218 R1`, `#204 R6`, `#204 R8` y `#204 R9`;
  - el `dueAt` fijo de `#213 R15 (%s)`;
  - la partición `tomorrow`/`yesterday` de `#213 R16`;
  - la aserción de montaje previa en `#213 R14`.
- [x] Los dobles de T0 son literales: `ChevronDown` y `ChevronUp` con `mockIcon`, y el `dueAt` relativo de D10. No hay `jest.mock(…, { virtual: true })`.
- [x] Regla de cierre: no hubo enmiendas adicionales. Lo dice el reporte y lo confirma el diff, que solo tiene filas de la tabla.
- [x] `AMENDED` de R13 está completo: los 30 pares de tasks.md §R13, en el mismo orden (19 de pantalla, 1 de language-provider, 1 de ui-language, 2 de design-drift, 5 de consistency-classnames, 1 de alerts-canvas-fidelity y 1 de motion).
- [x] R13 comprueba las tres specs con `/- \[[ xX]\] Enmienda #227 aprobada por humano/` y una sola sección cada una.

## Observaciones
Ninguna bloquea. Las dejo para que el leader decida:

1. **`#227` sin ` R<n>` en tests, prescrito por la spec.** Las líneas son:
   - `mobile-pet-tracker/src/__tests__/reminders-upcoming-past-canvas-fidelity.test.ts:18-21`, `← añadida por #227 (R1)` (requirements.md:213-216);
   - `mobile-pet-tracker/src/__tests__/reminders-upcoming-past-canvas-fidelity.test.ts:27`, recorte de §2.40 (tasks.md:111);
   - `mobile-pet-tracker/src/__tests__/reminders-upcoming-past-canvas-fidelity.test.ts:107-108`, sección y regex de R13 (requirements.md:531-533);
   - `mobile-pet-tracker/src/screens/reminders/index.test.tsx:2376`, `describe('#227: próximos y pasados'` (tasks.md:120 y el handoff).

   Todas son literales que la spec dicta. Ningún guard `HEX_LITERAL` lee estos ficheros: `design-drift` `#193 R11`, `#204 R17` y `#181 R8.3` miran solo producción. No es un incumplimiento del implementador. Si el leader quiere que la regla «`#227` siempre seguido de ` R<n>`» cubra también los tests, la fuente es la spec, no el código.
2. **Doble línea en blanco, solo cosmético.** Está antes de `### §2.40` en `specs/mobile-ui-language/design.md:1619` y antes de `function reminder(` en `mobile-pet-tracker/src/utils/reminder-dates.test.ts:100`.
3. **Frontmatter de `specs/mobile-reminders-upcoming-past/traceability.md:3`.** Sigue en `status: draft`, como en 35 specs más del repo. Pasarlo a `approved` le toca al leader al cerrar.
4. **Gates pendientes.** G2, el smoke del humano en dispositivo, queda abierto. La PR no está abierta: según el reporte la abre el leader, con `--base dev`.

## Output de ./init.sh
```
No ejecutado por el reviewer: lo corre el leader por instrucción expresa (el clasificador lo
deniega al reviewer y comparte LocalStack y Postgres entre worktrees).
Este veredicto queda SUJETO al ./init.sh verde del leader sobre HEAD 1576e68a (o sobre a86ff399,
que no cambia código: 1576e68a solo añade el reporte).

Cifras del reporte de Codex (no verificadas aquí):
- T0 (3): 73 suites, 1842 tests.
- Final R13 (3): 74 suites, 1877 tests.
- Guardas: 80 suites, 1658 tests.
- tsc exit 0 con log vacío; lint LINT_OK con log vacío.
```

## ./init.sh del leader

Corrido por el leader sobre HEAD `1576e68a`, 2026-11-03 ~19:40Z, sin pipe: `init=0`.
Backend 198 suites / 1650 tests; mobile 179 suites / 6589 tests; lint y typecheck sin errores;
«Todo verde». La condición del veredicto queda cumplida: APROBADO.
