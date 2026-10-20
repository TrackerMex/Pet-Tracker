# Implementación #191 — solo R13

**Resultado: R13 implementado; CC1–CC3 verificados.** Suite móvil completa: **4193/4193 tests** (T0 + 1), 126/126 suites y 1/1 snapshot. Candados intactos y verdes. El gate `init.sh` corresponde al leader y el smoke Android al humano.

- Fecha: 2026-10-20.
- `pwd`: `/home/claude/sites/Pet-Tracker-wt-191`.
- `git branch --show-current`: `feature/191-mobile-add-pet-two-steps`.
- H0 (`git rev-parse --short HEAD`): `707daafd`.
- Alcance: solo R13 de la enmienda E1; R1–R11 y los candados no se modifican.
- No se ejecuta `./init.sh`, por instrucción expresa del handoff; lo corre el leader.
- Estado inicial: `mobile-pet-tracker/src/screens/add-pet/index.tsx` ya tenía un diff local que coincide con la implementación exacta de R13. Se preservó fuera del árbol para medir la base y registrar el rojo antes de restaurarlo para el verde. No había cambios iniciales en los otros ficheros autorizados.

## Reanudación y referencia

- H0 ya contiene el rojo anterior `f3623bd0` y su reporte de parada. Ese test accedía a `date.props.children[0].type.displayName` sin normalizar los hijos anidados del Pressable. El handoff actual pide localizar el hijo por sus props, sin comparar instancias; se corrigió esa inspección, conservando todas las comprobaciones de R13.
- Para repetir T0 en una referencia verde R1–R11, se guardan fuera del árbol los dos ficheros iniciales y el reporte anterior. Solo durante esa medición se usa `index.tsx` de H0 y `index.test.tsx` de `f3623bd0^` (sin el único `it` R13 ni la actualización de clase de R6). Después se recupera el test inicial y se corrige la inspección de props. No se reescribe la historia.
- Skills cargadas: `ponytail:ponytail` (`/home/claude/.codex/plugins/cache/ponytail/ponytail/5.3.2/skills/ponytail/SKILL.md`); `building-native-ui` (`/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`, frontmatter v1.0.1); `appllama-app-design-skill` (`.agents/skills/appllama-app-design-skill/SKILL.md`, v1.3.0).
- Leídos R13 completo, R6, tareas de R13, gate humano firmado, arquitectura, convenciones (dimensiones y esperas), carta UI y disciplina TDD. Consultada la [documentación oficial de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) por `mobile-pet-tracker/AGENTS.md`.
- Sin animación ni dependencias nuevas. El smoke Android sigue correspondiendo al humano.

## T0 re-medido y corrección del test

- T0 repetido: `bun run test > /tmp/pet-tracker-r13-707daafd.8eWkrP/baseline.log 2>&1`; salida **0**; **126/126 suites, 4192/4192 tests, 1/1 snapshot**; 127.707 s. Sin pipes. Al terminar avisa de un worker que no sale limpiamente; no hay tests fallidos.
- Referencia temporal descrita arriba; restauración del test inicial comprobada con `git diff --quiet` salida 0 antes de corregirlo. Checkout de producción a H0 comprobado con `git diff --cached --quiet` y `git diff --quiet`, ambos salida 0. Anclas de producción: **1, 6, 1, 0, 2**, coinciden.
- Copias y logs fuera del árbol: `/tmp/pet-tracker-r13-707daafd.8eWkrP/`.
- Corregida únicamente la inspección del icono del `it` R13 ya existente: `Children.toArray`, selección por `size`, comprobación de `Calendar`, tamaño/color y posición por props. La reescritura de la aserción de R6 ya venía en H0 y se conserva.

## Rojo legítimo reanudado

- Comando: `bunx jest src/screens/add-pet/index.test.tsx -t '#191 R13:'`, sin pipe; salida **1**, `Tests: 1 failed, 67 skipped, 68 total` (7.976 s).
- Aserción exacta que falla: `expect(date.props.className).toBe('h-12 flex-row items-center gap-2 rounded-xl border-2 border-transparent bg-default px-3.5')` (`index.test.tsx:189`). Recibido: `h-12 rounded-xl border-2 border-transparent bg-default px-3.5`.
- No hay fallo de carga, ReferenceError ni TypeError. Log: `/tmp/pet-tracker-r13-707daafd.8eWkrP/red.log`.
- Antes del commit del test: router generado ausente; `bun run typecheck` salida **0**; `bunx expo lint --no-cache > <log> 2>&1 && test ! -s <log>` salida **0**, log **0 bytes**. Logs: `red-typecheck.log`, `red-lint.log` en el directorio temporal indicado.
- `graphify update .` desde la raíz: salida **0**; `graphify-out/` excluido. Avisos no bloqueantes: falta el parser SQL y han cambiado las comunidades etiquetadas; no se instalan dependencias ni se relanzan etiquetas. Log: `red-graphify.log`.
- Este registro queda encadenado mediante `&&` al commit rojo, solo de `index.test.tsx`. El hash se recoge a continuación.

- Commit rojo reanudado: `eb83ca10` — `test(mobile): campo de fecha con la receta de add-reminder (R13)`. El rojo previo `f3623bd0` permanece en la historia.

## Verde enfocado

- Recuperada la producción inicial byte a byte (`cmp`, salida 0): solo import `Calendar`, receta literal del `Pressable`, icono de 18 con token `muted` y clases del texto. Se conservan testID, rol, onPress, formato de fecha y `FieldErrorMessage`.
- `bunx jest src/screens/add-pet/index.test.tsx -t '#191 R13:'`: salida **0**; **1 passed, 67 skipped, 68 total** (7.259 s). Log: `/tmp/pet-tracker-r13-707daafd.8eWkrP/green-focused.log`.
- El test comprueba clase completa, esquina continua, rol, primer icono Calendar con tamaño/color, clases del texto vacío y con `9/4/2024`, y altura `h-12` en ambos modos. Sin mock de reicon y sin comparar instancias.
- Gates antes del commit verde: router generado ausente; `bun run typecheck` salida **0**; `bunx expo lint --no-cache` salida **0**, log **0 bytes** (`green-typecheck.log`, `green-lint.log`).
- Segunda ejecución de `graphify update .` desde la raíz: salida **0** (`green-graphify.log`); artefactos ignorados y fuera de los commits. Mismos avisos no bloqueantes de parser SQL/etiquetas; sin dependencias nuevas.
- Commit verde: `68d3c45a` — `feat(mobile): campo de fecha de Nueva mascota con icono, como add-reminder (R13)`, solo `index.tsx`. `git cat-file -e 68d3c45a` salida **0**. No se hace rebase.

## Candados (uno por invocación de Jest, en orden)

Todos los comandos `bunx jest <fichero>` terminaron con salida **0**, sin pipes. Logs individuales `guard-<basename>.log` en el directorio temporal. Se comprobó además `git diff --exit-code 707daafd -- <los nueve candados>` con salida **0**: ninguno se modifica ni se relaja. No se movió ningún inventario candado.

| Fichero | Tests verdes |
|---|---:|
| `src/screens/add-pet/index.test.tsx` | 68 |
| `src/__tests__/consistency-classnames.test.ts` | 73 |
| `src/__tests__/alerts-canvas-fidelity.test.ts` | 27 |
| `src/__tests__/design-drift.test.ts` | 114 |
| `src/__tests__/profile-canvas-fidelity.test.ts` | 26 |
| `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 74 |
| `src/__tests__/heroui-text-size-merge.test.ts` | 25 |
| `src/__tests__/add-pet-two-steps.test.ts` | 2 |
| `src/__tests__/ui-language.test.ts` | 30 |
| `src/__tests__/forms-validation-global.test.ts` | 8 |

CC2 medido con `grep -cF` desde móvil: `Calendar` **2** (≥2), `style={CONTINUOUS_CORNER}` **6**, `FieldErrorMessage` **4**. Todos coinciden.

## Suite final y criterios de aceptación

- `bun run test > /tmp/pet-tracker-r13-707daafd.8eWkrP/final-test.log 2>&1`, sin pipe: salida **0**; **126/126 suites, 4193/4193 tests, 1/1 snapshot**; 127.007 s.
- Delta: **4193 = T0 (4192) + 1**, un único `it` R13 frente a la referencia R1–R11. El test ya estaba en H0 por el intento anterior: frente a H0 no se añade otro `it`, se corrige el existente. Medido en fuente: 44 → 45 `it(`, una sola aparición de `it('#191 R13:`. La actualización de R6 no añade tests.
- Jest avisa de un worker que no sale limpiamente tanto en T0 como al final; ambas ejecuciones terminan con salida 0 y sin tests fallidos. No se cambia teardown ajeno a R13.
- **CC1: cumple.** R13, resto de pantalla, nueve candados y suite móvil completa verdes; typecheck salida 0; lint salida 0 con log vacío. Ningún candado modificado.
- **CC2: cumple.** Recuentos 2 / 6 / 4, detallados arriba.
- **CC3: cumple.** Solo se actualiza la fila R13 de `traceability.md`, con el nombre exacto del test y `68d3c45a` comprobado con `git cat-file -e`.

## Alcance, desviaciones y cierre

- Reanudación de una sesión anterior bloqueada, sin reescribir `f3623bd0` ni `707daafd`; su reporte original queda preservado en `report.previous.md` fuera del árbol y en el commit H0.
- La referencia temporal de T0 excluye el R13 ya presente en H0 para poder repetir la medición verde R1–R11 y demostrar T0 + 1. Ambos ficheros iniciales se preservan; producción final idéntica byte a byte al cambio recibido.
- No hubo nuevas paradas: el rojo fue la aserción prevista y todos los demás gates pasaron. El `TypeError` era el bloqueo heredado, corregido según el handoff actual.
- No se tocan R1–R11 fuera de la aserción de R6 ya enmendada en H0, ni otras features, aprobaciones, casillas humanas, status, historial, current, STATUS o PR. No se ejecuta `init.sh`, no se hace push, merge ni rebase. El leader conserva el gate compartido y el humano el smoke/cierre.
- Sin hex, StyleSheet, clases arbitrarias, animación, dependencias ni variables de entorno nuevas.
- Commit documental de cierre: `docs(#191): trazabilidad y reporte de implementación (R13)`, solo la fila R13 y este reporte, con `git add` explícito y `git commit -o -- <rutas>`.
- Inventario de cierre, `git diff --name-only 707daafd..HEAD` (se verifica tras el commit documental):

```text
mobile-pet-tracker/src/screens/add-pet/index.test.tsx
mobile-pet-tracker/src/screens/add-pet/index.tsx
progress/impl_mobile-add-pet-two-steps_r13.md
specs/mobile-add-pet-two-steps/traceability.md
```

- Solo esas cuatro rutas están autorizadas. `git diff --check` sin errores; candados intactos; marcador `.done` ignorado y fuera de los commits.
- Tras comprobar el commit documental y el árbol, la última acción crea `progress/impl_mobile-add-pet-two-steps_r13.done` con una sola línea: `progress/impl_mobile-add-pet-two-steps_r13.md`. No se ejecutan más herramientas después de crear el marcador.
