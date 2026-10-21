Worktree: /home/claude/sites/Pet-Tracker-wt-191

NO lances `./init.sh` aunque AGENTS.md lo pida: lo corre el leader (comparte Postgres y LocalStack con otros worktrees).

# Handoff a Codex CLI — feature #191, solo R13 (Enmienda E1)

Antes de tocar nada, confirma en el reporte `pwd` y `git branch --show-current` (debe ser `feature/191-mobile-add-pet-two-steps`). Trabaja SOLO en ese worktree.

Feature: mobile-add-pet-two-steps (#191), branch `feature/191-mobile-add-pet-two-steps`. R1 a R11 ya están implementados y aprobados por el reviewer (HEAD de código `ed4462fd`): **no los toques**. Este handoff es SOLO para **R13**.
Spec: `specs/mobile-add-pet-two-steps/requirements.md`, bloque **R13** (Enmienda E1, firmada por el humano el 2026-10-20 en `## Aprobación`). Lee R13 entero, `tasks.md` §«R13 — Campo de fecha» y, por contexto, R6 (R13 sustituye solo la parte de R6 sobre `birth-date-field`).

Resumen: en el smoke Android, el campo de fecha de nacimiento quedó con otro diseño (texto arriba, sin icono). R13 lo pasa a la receta del campo de fecha de `add-reminder` (`src/screens/add-reminder/index.tsx`, `testID="date-field"`, líneas ~210-223): `Pressable` en fila, centrado, con icono `Calendar` de `reicon-react-native`, a la altura `h-12` del `TextInput` de meses.

Entorno: `.env` y `node_modules` ya están en `mobile-pet-tracker/`. Bun para todo en móvil (`bunx`; nunca `npx`). Sin dependencias nuevas.

## Estado de partida (anclas)

Desde `mobile-pet-tracker/` (`cd /home/claude/sites/Pet-Tracker-wt-191/mobile-pet-tracker` primero). Cada ancla va sola (`grep -c` sale con 1 si la cuenta es 0: no las encadenes con `&&`). Salida esperada tras el `#`, medida sobre el HEAD que tiene este handoff:

```
grep -cF 'className="h-12 rounded-xl border-2 border-transparent bg-default px-3.5"' src/screens/add-pet/index.tsx   # 1
grep -cF 'style={CONTINUOUS_CORNER}' src/screens/add-pet/index.tsx   # 6
grep -cF "import { Camera } from 'reicon-react-native';" src/screens/add-pet/index.tsx   # 1
grep -cF 'Calendar' src/screens/add-pet/index.tsx   # 0
grep -cF 'testID="birth-date-field"' src/screens/add-pet/index.tsx   # 2
```

La primera ancla cuenta el `Pressable` de `birth-date-field` (el `TextInput` de meses lleva además `text-15 font-semibold text-foreground` en el mismo `className`, por eso no coincide). La quinta cuenta el `Pressable` y el `FieldErrorMessage`.

Antes del primer commit anota: `git rev-parse --short HEAD` (= **H0**) y T0 = `Tests:` de `bun run test` medido sin pipe (`bun run test > <log> 2>&1; echo $?`, con `<log>` fuera del árbol).

## Qué hacer (dos commits, test primero)

Desde `mobile-pet-tracker/`. Un solo fichero de jest a la vez: `bunx jest src/screens/add-pet/index.test.tsx -t '#191 R13:'` (los dos puntos evitan coincidencias con otros R).

1. **Rojo** `test(mobile): campo de fecha con la receta de add-reminder (R13)`. Solo `src/screens/add-pet/index.test.tsx`:
   - `it` nuevo `#191 R13: el campo de fecha usa la receta de fecha de add-reminder`: `className` de `birth-date-field` `toBe('h-12 flex-row items-center gap-2 rounded-xl border-2 border-transparent bg-default px-3.5')`; `toHaveStyle({ borderCurve: 'continuous' })`; su primer hijo es el icono `Calendar` con `size` 18 y `color` igual al token `muted` (localiza el hijo por sus props; el fichero NO mockea `reicon-react-native` y `Camera` lo usa real: no lo mockees entero); el `Text` hijo lleva `text-15 font-semibold text-foreground` con fecha y `text-15 font-semibold text-muted` sin fecha; `birth-date-field` y `approx-age-input` (alternando a «Meses») empiezan ambos por `h-12`. No compares nodos con `toBe`/`toEqual` entre instancias (tumba el worker de jest): compara `props`.
   - **Reescribe** la aserción de `#191 R6: métricas y receta de campos` que hoy afirma `expect(date.props.className).toBe('h-12 rounded-xl border-2 border-transparent bg-default px-3.5')` (busca `const date = screen.getByTestId('birth-date-field')`): pasa a la receta de R13 o se elimina de R6 y queda cubierta por el `it` nuevo; que no queden dos aserciones contradictorias. Conserva el resto de R6 y todas las que leen el texto con `within(...).getByText` (`9/4/2024`, etiquetas es/en).
   - Rojo legítimo: fallo por aserción del `className`/hijo. Un `ReferenceError`, un import inexistente o `Test suite failed to run` NO es rojo legítimo (C4): corrige el test. Anota en el reporte la aserción exacta que falla.
   - Encadena el registro del rojo con el commit por `&&`; escribe las cabeceras de la cadena como comentario `# --`, nunca como línea ejecutable.

2. **Verde** `feat(mobile): campo de fecha de Nueva mascota con icono, como add-reminder (R13)`. Solo `src/screens/add-pet/index.tsx`:
   - `import { Calendar, Camera } from 'reicon-react-native';` (hoy solo `Camera`).
   - `Pressable` de `birth-date-field`: `className="h-12 flex-row items-center gap-2 rounded-xl border-2 border-transparent bg-default px-3.5"`, `style={CONTINUOUS_CORNER}`, hijos `<Calendar size={18} color={muted} />` y `<Text className={\`text-15 font-semibold ${birthDate ? 'text-foreground' : 'text-muted'}\`}>`. `muted` ya existe (`useThemeColors`). Conserva `testID`, `accessibilityRole="button"`, `onPress`, el texto (`birthDate.toLocaleDateString(locale)` / `t('addPet.selectBirthDate')`) y el `FieldErrorMessage` de debajo. Nada más cambia.
   - Sin hex, sin `StyleSheet`, sin clases arbitrarias `[…]`. Comentario, si lo pones: `// #191 R13` (nunca `#191` a secas).

Antes de cada commit de código: `test ! -e .expo/types/router.d.ts` (si existe, PARA; no lo borres), `bun run typecheck` con salida 0, `bunx expo lint --no-cache > <log> 2>&1 && test ! -s <log>` con `<log>` fuera del árbol (el OOM mata eslint y la CLI sale 0). Ninguna medición de veredicto usa pipes.

## Candados: PARADA obligatoria

Tras el verde corre, uno a uno y desde `mobile-pet-tracker/`: `src/screens/add-pet/index.test.tsx`, `src/__tests__/consistency-classnames.test.ts`, `src/__tests__/alerts-canvas-fidelity.test.ts`, `src/__tests__/design-drift.test.ts`, `src/__tests__/profile-canvas-fidelity.test.ts`, `src/__tests__/chunky-cta-canvas-fidelity.test.ts`, `src/__tests__/heroui-text-size-merge.test.ts`, `src/__tests__/add-pet-two-steps.test.ts`, `src/__tests__/ui-language.test.ts`, y `forms-validation-global.test.ts` (donde esté, con `find src -name forms-validation-global.test.ts`). Todos estaban verdes en `ed4462fd`. **Si alguno se pone rojo, o cambia una cifra de un inventario, PARA**: no toques ningún candado, no relajes ni borres nada. Anota el delta medido (nombre del `it`, cifra esperada vs medida, y qué clase/fichero lo mueve) en el reporte y deja el verde sin commitear o commiteado según tu criterio, pero **declara cuál**; el leader decide con el humano. Candidatos probables: contadores de `rounded-xl`, `text-15`, `flex-row`, `gap-2` o `items-center` por fichero. No los toques aunque sepas la cifra nueva.

Si todo sigue verde: `bun run test` completo sin pipe, `Tests:` final = T0 + 1 (un `it` nuevo; la reescritura de R6 no suma). Explica cualquier otro delta.

## Reglas críticas

- **Skills (nombres del catálogo de Codex)**: el plugin `expo` de Codex es la v1.0.2 con 13 skills y NO tiene `expo-overview`, `expo-animation` ni `expo-router`. Carga `building-native-ui` y la skill del repo `appllama-app-design-skill` (`.agents/skills/`, `docs/ui-guidelines.md` §Skills). Sin animación en esta enmienda. Di en el reporte exactamente qué skills cargaste.
- Sigue `docs/architecture.md`, `docs/conventions.md` (§Dimensiones, §Esperas sobre el árbol renderizado) y `docs/ui-guidelines.md`. Las clases de la spec son literales: no las reinterpretes.
- Esperas sobre el árbol renderizado (`docs/conventions.md` §«Esperas sobre el árbol renderizado»): espera a un nodo o a un estado, no al contador de un mock. `render`, `fireEvent`, `act` y `rerender` de RNTL 14 son asíncronos: `await` en todos (la suite de add-pet es sensible a esto, deuda #72). Para elegir foto en tests usa solo `pressPickPhoto()`.
- Un rojo distinto del descrito (`Test suite failed to run`, `ReferenceError`, un `it` no listado) = PARA y avisa; no ajustes la aserción para que pase.
- Acota `git status` y `git diff` a las rutas esperadas (`git status --short -- <rutas>`). Si usas `git checkout HEAD -- <ruta>`, comprueba después `git diff --cached --quiet -- <ruta>` y `git diff --quiet -- <ruta>`.
- Tras modificar código: `graphify update .` desde la raíz del worktree. No commitees `graphify-out/`.
- **Ficheros que puedes tocar (lista cerrada)**: `mobile-pet-tracker/src/screens/add-pet/index.tsx`, `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`, `specs/mobile-add-pet-two-steps/traceability.md` (solo la fila R13) y `progress/impl_mobile-add-pet-two-steps_r13.md`. Compruébalo al final con `git diff --name-only <H0>..HEAD`; todo lo que salga fuera es un error tuyo. Tampoco `docs/`, `design.md`, `tasks.md`, `requirements.md`: son del leader.
- NO son tuyos: `progress/history.md`, `progress/current.md`, `STATUS.md`, el campo `status` de `feature_list.json`. NO abras ni edites la PR. NO marques ninguna casilla de «Cierre del humano» ni de «Aprobación». NO rebases ni mergees `origin/main`. Si el sandbox te deniega un comando, PARA y repórtalo.

## Criterios de aceptación

- CC1: `#191 R13` verde y el resto de `index.test.tsx` verde; los candados de arriba verdes sin tocarlos; `bun run typecheck` salida 0; lint salida 0 con log vacío; `bun run test` completo verde (sin pipe).
- CC2 (desde `mobile-pet-tracker/`): `grep -cF 'Calendar' src/screens/add-pet/index.tsx` ≥ 2 (import + uso); `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/add-pet/index.tsx` = 6 (no cambia); `grep -cF 'FieldErrorMessage' src/screens/add-pet/index.tsx` = 4.
- CC3: fila R13 de `specs/mobile-add-pet-two-steps/traceability.md` con `index.test.tsx::#191 R13: el campo de fecha usa la receta de fecha de add-reminder` y el hash del commit verde (`git cat-file -e <hash>`). No hagas rebase tras ese commit.

## Al terminar

1. Un commit final `docs(#191): trazabilidad y reporte de implementación (R13)` con solo `specs/mobile-add-pet-two-steps/traceability.md` y `progress/impl_mobile-add-pet-two-steps_r13.md`, con `git add` de esas rutas y `git commit -o -- <rutas>`.
2. `progress/impl_mobile-add-pet-two-steps_r13.md` (NO sobrescribas `impl_mobile-add-pet-two-steps.md`, que es el reporte de R1-R11) incluye: `pwd` y rama, H0, T0, hashes del rojo y del verde, aserción exacta que falla en el rojo, skills cargadas, resultado de los candados (cifras si alguno se movió), CC1 a CC3, `git diff --name-only <H0>..HEAD`, y cada parada o desviación.
3. Última acción: crea `progress/impl_mobile-add-pet-two-steps_r13.done` con una sola línea: la ruta de `progress/impl_mobile-add-pet-two-steps_r13.md`. Es el marcador que vigila `scripts/harness/watch-impl.sh`; no lo commitees (está en `.gitignore`).
