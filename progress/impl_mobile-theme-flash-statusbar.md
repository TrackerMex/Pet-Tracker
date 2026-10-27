# Implementación #217 — mobile-theme-flash-statusbar

Cierre técnico: 2026-10-27. Rama `feature/217-mobile-theme-flash-statusbar`. H0 `92ef1c62`; código de base `origin/dev` `81ca7529`.

## Resultado

R1–R12 implementados y verificados. Navegación raíz por tokens, barra global automática y barra clara solo en héroes enfocados; toggle inmediato y persistido; paquetes, código y mocks nitro retirados. El layout de tabs y su fade permanecen intactos.

```text
Test Suites: 158 passed, 158 total
Tests:       5560 passed, 5560 total
```

Suite completa sin pipe, exit 0. Logs `full-217-c12.log` y `final-test-217.log` contienen la misma ejecución final, sin repetirla. Typecheck exit 0 y lint --no-cache exit 0 con log vacío. C12 contiene este reporte y traceability.md; su hash se comunica en el cierre. `.done` se escribe después de ese commit, como última acción.

Los gates G2 y G3 siguen reservados al humano; sus casillas no se modificaron.

## Identidad y alcance

Comando de identidad ejecutado antes de modificar archivos:

```text
cd /home/claude/sites/Pet-Tracker-wt-217 && pwd && git branch --show-current
/home/claude/sites/Pet-Tracker-wt-217
feature/217-mobile-theme-flash-statusbar
```

Desviación de arranque: para descubrir las instrucciones, el primer comando fue
`pwd; cat progress/handoff_mobile-theme-flash-statusbar.md`; después se ejecutó el
comando de identidad exacto. No hubo cambios entre ambos comandos.

No se ejecuta `init.sh`, no push, PR, merge, rebase ni reconstrucción del dev build.
Solo el alcance cerrado del handoff. G2 y G3 corresponden al humano.

## Skills

- Cargadas: `ponytail:ponytail`, `building-native-ui`, `expo-tailwind-setup`,
  `.agents/skills/appllama-app-design-skill/SKILL.md`.
- No disponibles, según el catálogo/handoff: `expo-overview` (incluido
  `expo:expo-overview`), `expo-animation`, `expo-router`, `expo-design-system`.
- No hay diseño nuevo ni artboard. Se aplica la carta del repositorio sobre las
  recomendaciones genéricas; se mantiene uniwind y `useThemeColors`. Appllama MCP
  no disponible en Codex; smoke en Android a cargo del humano.

## T0 — anclas

Ejecutadas literalmente desde `mobile-pet-tracker/src`, en el orden del handoff:

```text
3
4
2
1
4
2
1
1
1
1
1
1
1
0
0
1
1
0
0
6
1
3
```

Desde `mobile-pet-tracker`: `test ! -e .expo/types/router.d.ts && echo sin-router-d-ts`
produjo `sin-router-d-ts`. Todas las anclas coinciden.

## Ejecución

Se esperó a que quedaran vacíos los dos `pgrep` antes de medir T0; había Jest activo
en el worktree 219. Se lanzó el comando exacto de T0 con salida a `t0-217.log`.
Otro worktree (209) inició Jest después del arranque de T0; no se alteró su proceso.
El typecheck de base pasó (exit 0; `typecheck-217-t0.log`).

T0 detectó el flake conocido de Salud `#168 R2: Salud sin hero y con métricas
estándar / pone el PetSwitcher como primer hijo de health-content`.
No se tocó esa suite. Se midió aislada tras T0 y con los `pgrep` vacíos, según la
excepción de carga del handoff (resultado debajo).

Resumen T0 (exit 1, un único flake conocido; `progress/t0-217.log`):

```text
Test Suites: 1 failed, 156 passed, 157 total
Tests:       1 failed, 5547 passed, 5548 total
```

Base de recuento: 5548 tests. Fallo de Salud: `Expected: "vaccines-section"`,
`Received: undefined`, `src/screens/health/index.test.tsx:1039`.

Repetición aislada de Salud con ambas guardas de procesos vacías: exit 0,
`Test Suites: 1 passed, 1 total`; `Tests: 112 passed, 112 total`
(`t0-health-217.log`). Se continúa por la excepción explícita de flake bajo carga.

C1: typecheck rojo esperado exclusivamente por TS2307 del módulo aún
inexistente `../navigation-theme` (`typecheck-217-c1.log`).

## Cadena de commits y recuentos

Los totales encadenados cuentan tests declarados desde la base 5548; en C1 y C3
Jest no puede recoger los tests del fichero mientras no existe el módulo. Se
transcribe además la línea `Tests:` de la ejecución de alcance, sin confundirla
con el total global declarado.

| Paso | Commit y mensaje | Aritmética global | Resultado de alcance / typecheck |
|---|---|---|---|
| C1 | `bcfd8c0c` — `test(#217): R1 navigation theme from tokens` | 5548 + 2 - 0 = 5550 | `Tests: 0 total`; rojo por import inexistente, excepción autorizada. Typecheck: TS2307 del mismo import. |
| C2 | `605bee5a` — `feat(#217): R1 add useNavigationTheme` | 5550 + 0 - 0 = 5550 | `Tests: 2 passed, 2 total`; typecheck exit 0. |
| C3 | `a3fe0e60` — `test(#217): R5 hero status bar focus gate` | 5550 + 2 - 0 = 5552 | `Tests: 0 total`; rojo por import inexistente, excepción autorizada. Typecheck: TS2307 del mismo import. |
| C4 | `c696ba1a` — `feat(#217): R5 add HeroStatusBar` | 5552 + 0 - 0 = 5552 | `Tests: 2 passed, 2 total`; typecheck exit 0. |
| C5 | `9f4a96ac` — `test(#217): R2-R4 root theme provider and status bar` | 5552 + 5 - 0 = 5557 | `Tests: 5 failed, 33 passed, 38 total`; los cinco rojos por aserción; typecheck reanudado exit 0. |
| C5b | `b8dc3c03` — `test(#217): R3 restore real timers before awaiting the router` | 5557 + 0 - 0 = 5557 | `Tests: 5 failed, 33 passed, 38 total`; los mismos cinco rojos de aserción con RootLayout aún sin C6; typecheck exit 0. |
| C6 | `930ab8c4` — `feat(#217): R2-R4 wire ThemeProvider and StatusBar in RootLayout` | 5557 + 0 - 0 = 5557 | `Tests: 38 passed, 38 total`; typecheck exit 0. |
| C6b | `29c28fc2` — `test(#217): global double for expo-status-bar` | 5557 + 0 - 0 = 5557 | `Tests: 69 passed, 69 total`; typecheck exit 0. |
| C7 | `3fc59121` — `test(#217): R6 hero status bar in home and profile` | 5557 + 4 - 0 = 5561 | `Tests: 4 failed, 511 passed, 515 total`; todos los nuevos por aserción; typecheck exit 0. |
| C8 | `1cba79d9` — `feat(#217): R6 request the light status bar on hero screens` | 5561 + 0 - 0 = 5561 | `Tests: 515 passed, 515 total`; typecheck exit 0. |
| C9 | `1c246d47` — `test(#217): R8-R12 lock the removal of nitro` | 5561 + 7 - 0 = 5568 | `Tests: 6 failed, 309 passed, 315 total`; R8 x2, R9 x2, R11, R10 por aserción; R12 verde; typecheck exit 0. |
| C9b | `f41f93f3` — `test(#217): allow navigation-theme accent request in legibility guard` | 5568 + 0 - 0 = 5568 | `Tests: 26 passed, 26 total`; typecheck exit 0. |
| C10 | `d0f09b8f` — `feat(#217): R9-R11 instant theme switch and drop the transition files` | 5568 + 0 - 8 = 5560 | `Tests: 2 skipped, 314 passed, 316 total`; solo R8 reservado a C11; typecheck exit 0. |
| C11 | `f0b81e59` — `feat(#217): R8 remove the nitro dependencies` | 5560 + 0 - 0 = 5560 | `Tests: 120 passed, 120 total`; typecheck exit 0. |
| R3 pureza | `916c279b` — `test(#217): R3 capture the scene theme after render` | 5560 + 0 - 0 = 5560 | `Tests: 2 passed, 2 total`; typecheck y lint verdes. |
| C11b | `27950bb3` — `test(#217): R8 align dependency count guards after nitro removal` | 5560 + 0 - 0 = 5560 | `Tests: 85 passed, 85 total`; typecheck exit 0. |
| C12 | Este commit — `docs(#217): traceability and implementation report` | 5560 + 0 - 0 = 5560 | Suite final, typecheck y lint verdes; trazabilidad sin filas pendientes. |

## Suites completas y disciplina TDD

| Momento | Suites | Tests | Resultado |
|---|---|---|---|
| T0 | 1 failed, 156 passed, 157 total | 1 failed, 5547 passed, 5548 total | Flake conocido de Salud #168 R2; aislado 112/112 verde, excepción del handoff. |
| Antes C10, previo a C9b | 3 failed, 157 passed, 160 total | 7 failed, 5561 passed, 5568 total | Seis rojos de C9 y guard de accent; enmendado por el leader en C9b. |
| Antes C10, tras C9b | 2 failed, 158 passed, 160 total | 6 failed, 5562 passed, 5568 total | Solo R8 x2, R9 x2, R10 y R11: rojos previstos de C9. |
| Antes C11 | 1 failed, 157 passed, 158 total | 2 failed, 5558 passed, 5560 total | Solo R8 antes de desinstalar los paquetes. |
| Primer C12 | 2 failed, 156 passed, 158 total | 2 failed, 5558 passed, 5560 total | Dos contadores antiguos 44; aislados 2 failed, 83 passed, 85 total. Enmendados con autorización humana en C11b. |
| C12 final | 158 passed, 158 total | 5560 passed, 5560 total | Exit 0, sin FAIL ni tests omitidos. |

C1/C3 tuvieron el rojo por import inexistente expresamente autorizado. C5 tuvo cinco rojos por aserción antes de C6. C7 tuvo cuatro rojos por aserción antes de C8. C9 tuvo seis rojos por aserción, mientras R12 nació verde y se probó con mutación. Se mantuvieron separados los commits de tests y de implementación; C10 elimina los tests antiguos según el paso aprobado (-8). Ninguna cifra global cambia en los commits auxiliares.

En C10 se seleccionaron todos los tests de sus tres ficheros salvo los dos R8, que correspondían a C11. La suite completa posterior comprobó que solo ellos seguían rojos. El resultado final ejecuta los 5560, sin exclusiones.

## Enmiendas autorizadas y correcciones del borrador

- C6b, leader `48085402`: StatusBar real corrompía el contador de inmediatos con timers falsos de renderRouter. Se añadió exactamente el doble global indicado, 8 líneas en test/jest-setup.js. Tras `29c28fc2`, los seis guards sin editar y los cuatro ficheros de #217 pasaron 69/69.
- C9b, leader `3051367d`: `accent` es obligatorio para R1, pero el guard de legibilidad no incluía el fichero nuevo. `f41f93f3` cambia solo la entrada de navigation-theme y el sufijo del título, dos líneas; 26/26 verdes.
- C11b, autorización expresa del humano en la conversación: retirar dos dependencias deja 42, pero dos guardas antiguas exigían 44. `27950bb3` cambia solo cada contador y el sufijo `(enmendado por #217 R8)` de sus títulos; 85/85 verdes. El conteo de 8 devDependencies y las demás aserciones se conservan.
- Borrador C5: TS2769 corregido con String(ColorValue), según instrucción humana; separador sobrante eliminado. C5b restaura temporizadores reales antes de await app, conservando el await y las aserciones.
- Lint detectó react-hooks/globals en la captura del tema durante render. `916c279b` mueve solo esa captura a useEffect; el test pasa, lint queda vacío y la sonda R3 se repitió con el rojo esperado.
- Lecturas de rutas inexistentes en node_modules o de un log aún no iniciado devolvieron ENOENT; se corrigieron las invocaciones sin alterar código para resolverlas. Un patch del reporte falló su verificación y no modificó el fichero; se corrigió su construcción. Una comprobación documental confundió los delimitadores @@ del diff con placeholders; se acotó a las dos etiquetas de resumen, sin cambios de código.
- Se cerraron los diagnósticos propios colgados 536979/558396 y el worker huérfano 745895 del mismo worktree (PPID 1, más de 17 minutos, 95 % CPU). No se cerraron procesos de otros worktrees. Las esperas de carga se reintentaron hasta medir las comprobaciones; no queda ninguna ejecución propia pendiente.

## Sondas de mutación y anclas negativas

Todas se plantaron temporalmente, dieron el rojo concreto y se revirtieron. No se commiteó ninguna mutación.

| Sonda | Evidencia del rojo |
|---|---|
| (1) R3: quitar ThemeProvider | Recibido `rgb(242, 242, 242)` frente a `token:background`, y dark false frente a true; 2 failed. Repetida tras la corrección de pureza: `mutation-217-r3-effect.log`, 2 failed; proveedor restaurado y R3 verde en la suite final. |
| (2) R5: quitar puerta de foco | Sin foco se esperaba cero llamadas y StatusBar recibió una light; `mutation-217-r5.log`: 1 failed, 1 passed, 2 total. |
| (3) R9: reintroducir import de useThemeTransition en Perfil después de C10 | `mutation-217-r9.log`: 1 failed, 119 skipped, 120 total; única coincidencia `screens/profile/index.tsx`. Revertido; `test-217-r9-restored.log`: 2 passed, 118 skipped, 120 total. |
| (4) R4: StatusBar global tras HeroUI | Orden de fuente incorrecto, índice 2349 frente a 2316; `mutation-217-r4.log`: 1 failed, 35 skipped, 36 total. |
| (5) R1: background recibe surface | Esperado `token:background`, recibido `token:surface`; `mutation-217-r1.log`: 1 failed, 1 passed, 2 total. Verde restaurado 2/2. |
| R12: StyleSheet en fichero nuevo | El it nació verde porque los dos ficheros existen desde C2/C4. Se plantó `// StyleSheet` en hero-status-bar.tsx; `mutation-217-r12.log`: 1 failed, 119 skipped. Revertido; `test-217-c9-r12-restored.log`: 1 passed, 119 skipped. |

Patrones negativos probados contra cadenas plantadas ANTES de leer los ficheros reales: R8 usa la dependencia modules 0.37.0 con el nombre armado mediante join; R9 importa cada término prohibido en una cadena plantada; R11 usa un jest.mock plantado; R12 usa hex construido con join, StyleSheet.create y bg-[red]. R8 x2, R9 x2 y R11 dieron sus rojos reales en C9. La sonda R9 posterior a la retirada prueba además la detección del import concreto. R12 tiene su verde inicial y mutación real documentados arriba.

## R1–R12 a test y commit

La trazabilidad completa, con mensajes de commit y sin filas pendientes, está en specs/mobile-theme-flash-statusbar/traceability.md. Referencias primarias:

| R | Test | Implementación |
|---|---|---|
| R1 | bcfd8c0c, navigation-theme.test.tsx | 605bee5a |
| R2 | 9f4a96ac, layout.test.tsx | 930ab8c4 |
| R3 | 9f4a96ac, theme-scene.test.tsx; auxiliares b8dc3c03/916c279b | 930ab8c4 |
| R4 | 9f4a96ac, layout.test.tsx | 930ab8c4 |
| R5 | a3fe0e60, hero-status-bar.test.tsx | c696ba1a |
| R6 | 3fc59121, Inicio y Perfil | 1cba79d9 |
| R7 | 4abb8bc5, los dos candados existentes de screenOptions | 930ab8c4; solo raíz, tabs sin diff |
| R8 | 1c246d47, design-drift | f0b81e59; contadores enmendados en 27950bb3 |
| R9 | 1c246d47, design-drift | d0f09b8f |
| R10 | 1c246d47, Perfil; R4 de persistencia y #196 R7 conservados | d0f09b8f |
| R11 | 1c246d47, design-drift | d0f09b8f |
| R12 | 1c246d47, design-drift; enmiendas f41f93f3 y 27950bb3 | c696ba1a; desde C4 existen los dos ficheros nuevos sin escapes |

C6b no modifica los seis tests de navegación; el mock global está en el setup. R7 conserva los tests y la ruta. R12 nació verde según el plan; la mutación prueba su sensibilidad.

## R8: manifiesto y diff de bun.lock

Se ejecutó exactamente `bun remove react-native-nitro-theme-transition react-native-nitro-modules`, y se quitó manualmente solo la cola `|react-native-nitro-theme-transition|react-native-nitro-modules` de transformIgnorePatterns.

El comando prescrito `git diff 92ef1c62 -- mobile-pet-tracker/bun.lock | grep -E '^[-+][^-+]'` devuelve cuatro líneas eliminadas, todas nitro, y ninguna añadida. El diff completo siguiente incluye los separadores vacíos retirados con esas entradas. package.json solo cambia las dos dependencias y la cola de Jest (3 líneas eliminadas, 1 añadida). Se comparó el objeto completo contra H0 tras esas tres transformaciones: ningún otro valor ni versión cambió. Quedan 42 dependencies y 8 devDependencies.

```diff
diff --git a/mobile-pet-tracker/bun.lock b/mobile-pet-tracker/bun.lock
index 4287280d..aef126a7 100644
--- a/mobile-pet-tracker/bun.lock
+++ b/mobile-pet-tracker/bun.lock
@@ -39,2 +38,0 @@
-        "react-native-nitro-modules": "0.37.0",
-        "react-native-nitro-theme-transition": "1.0.0",
@@ -1680,4 +1677,0 @@
-    "react-native-nitro-modules": ["react-native-nitro-modules@0.37.0", "", { "peerDependencies": { "react": "*", "react-native": "*" } }, "sha512-ULS2CBZcdwGw5d4Y35EV/tbCOsNsQOnQ9LC9CehMhDNm5c90lwF/LxRamzKuFpjI547G7teTQgD0peqYSGnP9g=="],
-
-    "react-native-nitro-theme-transition": ["react-native-nitro-theme-transition@1.0.0", "", { "peerDependencies": { "react": "*", "react-native": "*", "react-native-nitro-modules": ">=0.36.0" } }, "sha512-wCmcR+Bzsth6yHhQvAS6UGWBD6DzQWb84VgYTKYJE8YsQsrCdSYxOVGNajRFM++/TAtneoZVTeC60N33mG0Afg=="],
-
```

## Alcance y guardas

Salida medida desde la raíz: `git diff --name-only 92ef1c62..HEAD -- mobile-pet-tracker/`:

```text
mobile-pet-tracker/bun.lock
mobile-pet-tracker/package.json
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/zones-canvas-fidelity.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/screens.test.tsx
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/__tests__/theme-scene.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/components/__tests__/hero-status-bar.test.tsx
mobile-pet-tracker/src/components/hero-status-bar.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/screens/profile/index.test.tsx
mobile-pet-tracker/src/screens/profile/index.tsx
mobile-pet-tracker/src/theme/__tests__/navigation-theme.test.tsx
mobile-pet-tracker/src/theme/__tests__/theme-transition.degraded.test.tsx
mobile-pet-tracker/src/theme/__tests__/theme-transition.test.tsx
mobile-pet-tracker/src/theme/navigation-theme.ts
mobile-pet-tracker/src/theme/nitro-availability.ts
mobile-pet-tracker/src/theme/theme-transition.ts
mobile-pet-tracker/test/jest-setup.js
```

Los 23 ficheros coinciden con la lista cerrada ampliada por las enmiendas y la autorización humana para los dos contadores. Se verificó que legibility-classnames solo tiene sus dos ediciones C9b y que canvas-foundations/zones-canvas-fidelity solo tienen su contador y título C11b.

R7: `git diff 92ef1c62 -- 'mobile-pet-tracker/src/app/(tabs)/_layout.tsx'`: salida vacía.

También están vacíos los diffs de los seis ficheros renderRouter, app.json, eas.json, global.css, i18n/, providers/, ui-copy-table, ui-language y consistency-classnames. docs/, STATUS.md, feature_list.json y progress/current.md/history.md permanecen sin cambios. No se introdujeron variables de entorno.

La suite final pasa design-drift, consistency-classnames, legibility-classnames, ui-language, ui-copy-table, language-provider, font-registration, jest-virtual-mock-lock, ambos screenOptions, los seis renderRouter y los tests completos de Inicio y Perfil. Producción no contiene nitro, theme-transition, useThemeTransition, THEME_FADE ni isThemeTransitionAvailable.

Typecheck final: guarda `test ! -e .expo/types/router.d.ts` seguida de bun run typecheck, exit 0 (`typecheck-217-c12.log`); no se borró router.d.ts. Lint: comando exacto con --no-cache y `test ! -s`, exit 0, `lint-217.log` de 0 bytes. Graphify: `graphify update .`, exit 0, AST local sin LLM, 30125 nodos y 38721 aristas; aviso de 21 SQL omitidos por falta de tree_sitter_sql, sin instalar dependencias adicionales.

Solo traceability.md y este reporte entran en C12. Los logs y graphify-out son artefactos ignorados. Después del commit se verifica el árbol y se crea el .done ignorado por Git, con una sola línea: `/home/claude/sites/Pet-Tracker-wt-217/progress/impl_mobile-theme-flash-statusbar.md`.

No se ejecutaron init.sh, Monitor, EAS, reconstrucciones, AWS, push, PR, merge ni rebase.

## Smoke del humano, casillas intactas

G2 debe medirse en tema claro/oscuro y con el SO claro/oscuro:

1. (a) Cambiar entre Inicio, Salud, Mapa y Perfil sin flash blanco ni negro.
2. (b) El toggle de Perfil cambia el tema al instante, sin fundido.
3. (c) Leer reloj e iconos en Inicio/Perfil con hero, Mapa, Inicio/Perfil sin mascotas y una pantalla de detalle.
4. (d) Volver de Perfil a Mapa recupera la barra automática.

G3: el humano reconstruye el dev build sin nitro tras el merge. No se marcó ninguna casilla G2/G3 ni se lanzó ninguna build. Jest verifica la fuente de pintura y las peticiones de barra; la observación del dispositivo corresponde a G2.
