# review: mobile-canvas-home (#198)
Fecha: 2026-10-24
Veredicto: APROBADO (sin hallazgos bloqueantes; 11 observaciones no bloqueantes)

Branch: feature/198-mobile-canvas-home @ 158f4e91 (worktree /home/claude/sites/Pet-Tracker-wt-198), verificada antes de empezar.
Diff de la feature: `git diff 6bbd0485..HEAD`. H0 de la implementación: 09095e26.
Skills cargadas: `expo:expo-overview` y `expo:expo-design-system` (la carta, `docs/ui-guidelines.md:15-23`, deriva el audit de tokens/drift a esta última).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `grep -c '"in_progress"' feature_list.json` = 1 (#198, línea 3470). Único cambio de feature_list.json contra 6bbd0485: `pending` → `in_progress` de #198.
- [x] progress/current.md: plantilla vacía (C2 admite «vacío (plantilla) o describe la sesión activa»).

## Checklist C3 — Arquitectura
- [x] Feature solo de UI móvil: ningún cambio en `backend-pet-tracker/` (diff vacío), ni en dominio, puertos o infraestructura.
- [x] Capas de la app móvil respetadas: la pantalla (`src/screens/home/`) importa componentes (`components/card`, `components/empty-state`) y tema (`theme/shadows`, `theme/chunky-lip`); el componente compartido `components/empty-state.tsx` solo gana `utils/category-palette`, importación autorizada por K25 y candada en EI (`empty-state-illustrated.test.tsx`).
- [x] Sin contratos nuevos ni dobles de puertos: no aplica `MockOf<T>`.
- [x] Sin lógica de negocio nueva: los cambios son clases, tokens, composición y dos claves de copy.

## Checklist C4 — TDD
- [x] Cada R1–R18 tiene al menos un `it` que nombra `#198 R<n>` (los 18 títulos de traceability.md existen literalmente en HI, WC, ES y HCF).
- [x] Historial test-primero, por R (first-parent 09095e26..HEAD): cada R con implementación tiene `test(#198): R<n> …` antes de su `feat(#198): R<n> …`. R1 0586df7a→b28c3b7c; R2 a2797ab6 + b9b1792a (K48–K51)→5512133c; R3 106c6b1e→05ef6a2c; R4 3fbf93ae→97e88f32; R5 67360d82→3f632c3b; R6 6826078c→3d899f91; R7 ff821e50→da6fe70a; R8 c868f616 + 494e8221 (E1)→22996eef; R9 a014c551→40fdc7be; R10 dc01784c→ad3078ed; R11 1273031c + 1578c646→53f7629d; R13 c42bff63→55689d42; R14 24da03c7→0fbebebd; R18 2dd53cc5→81166c33; R15 fb8ebaca→1d1a90b8.
- [x] Higiene: cada commit `test` toca solo ficheros de test; cada `feat`, solo producción. Los logs rojos (`progress/r*-red-198.log`) fallan por aserción con títulos que nombran `#198 R`, sin ReferenceError ni fallo de import.
- [x] Nacen verdes declarados (tasks.md:32-35, requirements.md:514) en commits `test` sin `feat`: R16 c8ea9185, R12 4b512015, R17 cd75ab9b; R15-default y los dos «sin badge / sin actionIcon» de R18 dentro de los rojos de R15/R18. **Mutación del reviewer repetida de forma independiente** sobre una copia de HEAD (`git archive HEAD` en el scratchpad, sin tocar el worktree), una sonda cada vez y revertida:
  - R16 `tone="danger"` en el vacío de Inicio: `Tests: 1 failed, 318 skipped, 319 total`; cae `#198 R16 conserva el vacío hero…` (título 22 frente a 26).
  - R12, import de `useShadows` alterado en la gráfica: `Tests: 1 failed, 46 passed, 47 total`; cae `#198 R12 solo Inicio y su gráfica…`.
  - R17 `h-23`→`h-24` en el tile real (index.tsx:710): `Tests: 1 failed, 46 passed, 47 total`; cae la fila «height: 92px; border-radius: 20px».
  - R15-default, sin el defecto `tone = 'default'` (empty-state.tsx:54): `Tests: 3 failed, 16 passed, 19 total`; caen `#198 R15 sin tone conserva el escenario de hoy` y dos candados de #176.
  - Coinciden con los logs de Codex (`progress/r16-`, `r12-`, `r17-`, `r15-default-count-`, `r18-mutation-198.log`).
  - Línea base de la copia: HCF `47 passed, 47 total`.
  - Logs del reviewer en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/mut198/` (`m-r16-tone.log`, `m-r12.log`, `m-r17.log`, `m-r15d.log`).

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" (18 filas R1–R18, todas con hash).
- [x] Los 19 hashes citados son ancestros de HEAD (`git merge-base --is-ancestor`), y el asunto de cada uno coincide con el citado.
- [x] Formato: los 36 commits `test`/`feat` de la feature siguen `type(#198): R<n> <desc en inglés>`, el formato que fija el handoff (`progress/handoff_mobile-canvas-home.md:67`, que dice explícitamente que manda sobre el `test(#198 R<n>)` de tasks.md:18). Los commits restantes son `docs(#198)`, `chore(spec)` del leader y el merge.

## Checklist C6 — Spec aprobada
- [x] requirements.md `status: approved` y `- [x] Aprobado por humano (fecha: 2026-10-23)` (requirements.md:511), con firma delegada y re-firma documentadas (requirements.md:512-518).
- [x] Cambios posteriores a la firma por errata firmada: §Erratas del leader (requirements.md:441-463) con firma delegada (línea 443) y commit dc0c565d con la línea de firma. Para la errata 69539aaa ver la observación N11.
- [x] La casilla de smoke (requirements.md:519) es de cierre, no del gate de implementación (ver N6).

## Checklist C7 — Sin código huérfano
- [x] El botón `home-retry` sustituido por la acción del hero desaparece de producción. Solo queda como candado negativo en HI (`expect(source).not.toContain('home-retry')`, index.test.tsx:6462).
- [x] Se retiran las tintas que R4 sustituye: `bg-success` en `collar-battery-bar.tsx` y `text-success` en index.tsx. También sale el icono `<Battery` (cuentas de tasks.md:51, :54 y :59 a 0).
- [x] Lo que sigue en uso no se trata como huérfano: `Button` (index.tsx:515) y `HOME_CONNECTION.tone` (index.tsx:378).
- [x] Tests: no se borra ningún fichero de producción, así que no quedan tests de ficheros inexistentes. El `describe` CF `#197 R20` se borró en el rojo de R1 (0586df7a, −11 líneas en `canvas-foundations.test.ts`), como pide K28. Hoy `grep -c '#197 R20'` = 0.

## Checklist C8 — Carta de UI
- [x] Grep-clean sobre las 201 líneas de producción añadidas: 0 hex, 0 clases arbitrarias `[...]`, 0 `StyleSheet`/`rgba`, 0 `elevation`/`shadowColor`/`shadowOffset`/`shadowOpacity`/`shadow-sm…xl`. Las sombras salen de `useShadows().card` y los labios de `useChunkyLip()`. Todos los tokens usados existen en `src/theme/global.css`: `--text-11/13/15/22/26`, `--tracking-section`, `--tracking-title`, `--color-tab-pill`, `--color-lip-tile-*` y `--radius-card`. `danger-foreground` viene del tema de heroui-native, ya usado en alert-detail.
- [x] Dimensiones: `useSafeAreaInsets` y `insets.top + 12` / `insets.bottom + 96` intactos (index.tsx:209, :362, :429); el diff no toca safe areas.
- [x] Carga con `Skeleton` dimensionado (R14, `home-loading-summary` index.tsx:442), sin Spinner ni ActivityIndicator en el diff.
- [x] Componentes compartidos reutilizados: `Card` de `components/card` y `Skeleton` de heroui-native (imports previos, el diff solo añade `useShadows`). `EmptyState` crece por props (`tone`, `badge`, `actionIcon`, `body?`) en vez de con un fork local.
- [x] Tappables: `collar-pair-link` `h-11` (44), tiles `h-23` (92), `reminders-see-all` `min-h-11`; feedback pressed conservado.
- [x] Animaciones: ninguna nueva. Solo cambian los índices de `HomeEntrance` (2..7, R6). El `Animated.View` del cuerpo del hero solo queda condicionado a `body` (empty-state.tsx), sin estilos animados nuevos ni `Color`/var CSS en ellos.

## Verificaciones adicionales
- [x] Enmiendas de candados agregados. Todas llevan sufijo `(enmendado por #198 R<n>)` y término `// #198 R<n>`, y conservan las entradas de dev:
  - CN: K27 `- 1 - 1 - 1` (7→4); K48–K50 (Inicio 1→5, suma +4); Home `text-accent-strong` 3; `#64 R9`.
  - HP: K41/K51 (`CONTINUOUS_CORNER` 5, `text-accent-strong` 3, `bg-accent-soft` 0).
  - LG: K26 (Inicio 3, suma `+ 1 // #198 R4`). Ver N3.
  - AC: K46 (`text-15` gana la gráfica, `tracking-title` gana Inicio).
  - CK: K35 (+1 radio, gráfica).
  - DD: K42 (inventario de radios) y K43 (`text-22` gana `components/empty-state.tsx`).
  - PF: K44 y K45 (`text-26` y `text-13` ganan Inicio).
  - UL: K47 `+ 1`.
  - EI: K25 (línea de `react`, `category-palette`), K39 (Inicio 1→2), K40.
  - ui-copy-table: fila `loadPetsErrorTitle` en lugar de un `somethingWentWrong`, y fila Body.
  - language-provider: E3 `+ 2, // #198 R15`, por la regla de recuentos agregados (requirements.md:456); ver N1.

  Cada delta coincide con los usos que la R prescrita añade o retira. Recuentos re-medidos contra tasks.md §Cuentas: coinciden.
- [x] Merge de dev 249e3994 (padres 6304d507 y 6bbd0485), con 13 bloques resueltos como «dev + delta de #198»:
  - Producción: `git diff 6304d507..HEAD` sin cambios salvo `catalog.ts`, cuyas 2 líneas son el cambio de dev.
  - Candados en conflicto: conservan los términos de dev (#200 incluido, como pedía requirements.md:454 para K49) y los de #198.
  - Ficheros sin conflicto: toman la versión de dev.
- [x] Diff limitado a la lista cerrada:
  - 20 ficheros móviles (5 de producción y 15 de test/candados), todos en la lista del handoff o entrados por la regla de recuentos (requirements.md:463).
  - Fuera de móvil: `feature_list.json`, `progress/impl_*` y `progress/inventory-audit_*`, y `specs/` (solo commits del leader).
  - Protegidos sin diff: `package.json`, `bun.lock`, `app/`, `src/theme/`, `card.tsx`, `home-entrance.tsx`, `backend-pet-tracker/`, `docs/`.
- [x] Sin dependencias nuevas: `git diff --stat 6bbd0485..HEAD` vacío para `package.json` y `bun.lock`.
- [x] Fidelidad al canvas:
  - R17 contrasta 46 literales de los artboards congelados con la producción, y todos están verdes (`init.sh`).
  - El reviewer cotejó a mano index.tsx, collar-battery-bar.tsx, weekly-activity-chart.tsx, empty-state.tsx y catalog.ts contra R1–R18 y D9: clases, `rx={Math.min(6, height / 2)}`, `fillOpacity` 1/0.35, check 13, `CATEGORY_SLOTS.rose.surface`, huellas danger, título 22, badge y actionIcon del error, y copy es/en literal. Coincide, salvo la desviación anotada en N4.

## Observaciones

Bloqueantes: ninguna.

No bloqueantes:

- **N1 — Enmienda de inventario de R15 fuera de su sitio.** `6d0264a5 test(#198): R15 amend the catalog key inventory` (language-provider.test.tsx:55, `#194 R1`, 443→445) llega después de R16, R12 y R17. La regla pide «en un commit propio … antes del siguiente R» (requirements.md:460). Entre 1d1a90b8 y 6d0264a5, el verde de R15 no fue «verde entero». El delta es exactamente +2 por las claves de R15. Lo autorizó el leader en la Reanudación 2 (impl_mobile-canvas-home.md:381, :441, :640), y en HEAD el candado está verde.
- **N2 — E1 de R8 en commit propio.** `494e8221` (WC `R9: el selector sigue el tema…`) va en un commit `test` aparte tras el rojo c868f616, no dentro de él (requirements.md:380). Test-primero se conserva y el rojo contra la producción previa está probado (impl_mobile-canvas-home.md:292).
- **N3 — Aserción extra en LG.** `legibility-classnames.test.ts:175` añade un `expect` que suma las ocurrencias reales de `text-accent-strong` y las compara con el inventario. K26 (requirements.md:414) solo prescribe Inicio 3 y total 14. Es redundante con el `it.each` y endurece el candado; no relaja nada.
- **N4 — R14, esquina más sombra.** `home-loading-summary` aplica `style={{ ...CONTINUOUS_CORNER, ...shadows.card }}` (index.tsx:444), donde R14 dice `style={shadows.card}` (requirements.md:303). La esquina continua la exige la carta (§Decisiones fijas 12) y la desviación está documentada (impl_mobile-canvas-home.md:330). La sombra es la prescrita.
- **N5 — Atribución de K26 inconsistente en la spec.** La fila K26 dice R «R3, R12» (requirements.md:414), pero tasks.md:25 y :87 la colocan en R4, que es donde la cifra gana `text-accent-strong`. Codex siguió tasks.md. Es un defecto de la spec, no de la implementación.
- **N6 — Smoke humano pendiente.** La casilla de requirements.md:519 (R1, R3, R4, R5, R6, R7, R10, R11, R13, R14, R15, R16 en dev build Android) está sin marcar. Es un gate de cierre: la feature no debe pasar a `done` hasta que el humano la firme.
- **N7 — Título de CK caducado.** `chunky-cta-canvas-fidelity.test.ts:181` sigue diciendo «veintisiete radios» con un total que ya es 34. Viene de antes (enmiendas #191, #189, #200), y #198 solo añade su sufijo.
- **N8 — Flake de tinte en la suite post-merge de Codex.** Los 10 rojos `#0D1117` (Recordatorios #178 R4 y Editor de zonas #189 R13; impl_mobile-canvas-home.md:3) no aparecen en el `init.sh` del leader sobre 158f4e91 (0 `^FAIL`). Es coherente con el flake de carga conocido.
- **N9 — R16, candado ciego a un badge con otro testID.** `index.test.tsx:6484` solo comprueba que no exista `home-empty-badge`, y el badge lo identifica quien llama (index.tsx:479). Mutación del reviewer: pegar en el vacío un `badge={<View testID="home-error-badge" …/>}`. Resultado: `318 skipped, 1 passed` en `-t '#198 R16'`, y las 55 suites de `src/screens/home`, `src/__tests__` y `src/components/__tests__` no lo detectan. Sus 4 únicos rojos son `hosting-artifacts.test.ts`, que es ruido de la copia (sin `hosting/` ni `.env.example`). Logs: `m-r16-badge.log` y `m-r16-badge-all.log` en el scratchpad citado. El test es el que prescribe la spec (requirements.md:343) y la producción actual es correcta: index.tsx:339-350 no pasa badge. Endurecerlo es una enmienda de spec para el futuro, por ejemplo afirmar que el último hijo del escenario es la pose.
- **N10 — R12, cláusula «únicos» sin candado.** R12 exige que index.tsx y la gráfica sean «los dos únicos ficheros de producción de esta feature» que importan `theme/shadows` (requirements.md:277-279). El test prescrito solo comprueba su presencia en esos dos (home-canvas-fidelity.test.ts:5-9). Mutación del reviewer: añadir el import en `collar-battery-bar.tsx`. Ningún candado de `src/__tests__` ni de `src/screens/home` cae (`m-r12-only.log`: 4 fallos, todos de `hosting-artifacts`, el mismo ruido). Verificado a mano: entre los ficheros de producción del diff solo index.tsx y weekly-activity-chart.tsx importan `theme/shadows`. Mismo patrón que «cláusulas universales candadas en un caso»: defecto del candado prescrito, no de la producción.
- **N11 — Errata 69539aaa sin línea de firma.** El commit (icono `WifiOff` en `unknown` para R3 y patrón de cuenta de tasks.md:72) no lleva la línea «Firma delegada…» que sí lleva dc0c565d. El cambio alinea R3 con su propio texto («el icono de hoy por estado», requirements.md:201) y corrige un comando de medida; no cambia comportamiento. Conviene que futuras erratas citen la firma en el commit.

## Output de ./init.sh
Lo corrió el leader sobre 158f4e91, sin pipe; al reviewer el clasificador se lo deniega. Log: /tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-198.log (6,7 MB). El reviewer cotejó las cifras con grep sobre el log:

```
backend   Test Suites: 187 passed, 187 total / Tests: 1474 passed, 1474 total      (líneas 220-221)
infra     Test Suites: 2 passed, 2 total / Tests: 14 passed, 14 total               (233-234)
mobile    Test Suites: 144 passed, 144 total / Tests: 4875 passed, 4875 total / Snapshots: 1 passed, 1 total (77930-77932)
e2e       Test Suites: 3 skipped, 30 passed, 30 of 33 total / Tests: 8 skipped, 468 passed, 476 total (78252-78253)
$ expo lint      -> ✅ Lint sin errores (sin "SIGKILL" ni "signal" en todo el log)
$ tsc --noEmit   -> ✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
Ningún `FAIL` en el log (`grep -c '^FAIL'` = 0). Los 46 `●` son todos `● Console`.

Estado del worktree tras la revisión: `git status --short` = solo `?? progress/handoff_mobile-canvas-home.md` y `?? progress/review_mobile-canvas-home.md`. El reviewer no editó código ni commiteó: las mutaciones se hicieron sobre una copia en el scratchpad.
