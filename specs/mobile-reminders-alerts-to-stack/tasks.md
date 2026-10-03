---
feature: "mobile-reminders-alerts-to-stack"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-reminders-alerts-to-stack]] (#114)

> Disciplina TDD: **(1) test rojo → (2) implementación mínima → (3) refactor**,
> requisito por requisito. Commits **test-primero**: el rojo va en su propio
> commit y falla **por su aserción**, nunca por un `ReferenceError`, un módulo
> inexistente ni una mutación de un doble (CHECKPOINTS C4). Añadir a un doble un
> campo que la producción aún no usa (`dismissTo: jest.fn()`) no es mutarlo.
> **Ningún requisito es de verificación** (vía (a) de C4 en todos): cada rojo es
> real sobre `a833f153` (sondas de [[design]] §1).
> Rutas relativas a `mobile-pet-tracker/` salvo donde se indique. Todos los
> comandos se lanzan **desde `mobile-pet-tracker/`**, con `bunx`, nunca `npx`.

## Antes de empezar

- [ ] `git branch --show-current` → `feature/114-mobile-reminders-alerts-to-stack`,
      y `git log -1` → `a833f153` o posterior. Si la base se movió, **medir de
      nuevo** y aplicar los deltas de [[design]] D8 sobre la base nueva; no
      reapuntar hashes de [[traceability]] tras un rebase.
- [ ] Casillas firmadas en [[requirements]] §Aprobación: **P1 = A**, **A14** y
      **spec**. Sin A14 no se empieza (R1 y R7 contradicen specs ajenas); sin
      **A13** no se empieza R6.
- [ ] A14 aplicada: los dos bloques literales de [[requirements]] §Enmiendas,
      justo antes de `## Aprobación` en `../specs/mobile-alerts-center/requirements.md`
      y en `../specs/mobile-reminders/requirements.md`, con la fecha de la firma.
      Commit: `docs(specs): enmienda A14 de #114 en mobile-alerts-center y mobile-reminders`.
- [ ] `rm -f .expo/types/router.d.ts` (gitignorado; tras mover rutas se llena de
      rutas fantasma y rompe `tsc`). Repetirlo antes de cada `tsc`.
- [ ] **No lanzar `./init.sh`** ni tocar Postgres/LocalStack (compartidos con el
      worktree de Backend). Se mide con `bunx jest`, `bunx tsc --noEmit` y
      `bunx expo lint`.
- [ ] Medir la base **sin pipe**: `bunx jest --silent > /tmp/base114.txt 2>&1; echo "exit=$?"`
      → en `a833f153`, 80 suites, 1426 tests, `exit=0`. `bunx tsc --noEmit; echo "exit=$?"`
      y `bunx expo lint; echo "exit=$?"` → `exit=0` y **salida vacía**.
- [ ] Skill: `building-native-ui` (la única de Codex para esto). **La guía de
      routing está en [[design]] D1, D2, D6 y D8**; no hay otra que cargar.
- [ ] Leer [[design]] §1 y D8 antes del primer test de navegación: **un solo `it`
      por fichero que use `renderRouter`** (S11 de #95).
- [ ] Filtros de jest: `--runTestsByPath` con la ruta exacta (acepta paréntesis) o
      paréntesis **escapados** en modo regex (`'src/app/\(tabs\)/…'`). Tras cada
      comando, el número de suites que imprime jest = el de ficheros pedidos.

## Orden y por qué es ese (candado del sujeto ausente)

| # | Commit | Asevera sobre | ¿Existe cuando se asevera? |
|---|---|---|---|
| 1 | R1 rojo | ubicación de dos ficheros; hijos del `Stack.Protected` | Sí: ficheros bajo `(tabs)` y guarda con seis hijos; ese es el rojo |
| 2 | R2 rojo | pila raíz y montajes | Sí: `renderRouter` sobre el árbol real; el rojo es la pila `["(tabs)"]` (S1) |
| 3 | R3 rojo | pila raíz tras la notificación | Sí: hook real y layouts reales; el rojo es `["(tabs)"]` en frío (S3) |
| 4 | R1 + R2 + R3 verde | — | movimiento + dos `Stack.Screen` (sin `options`) + `dangerouslySingular`, **en un solo commit** |
| 5 | R4 rojo → verde | `options` de los dos `Stack.Screen` | Sí: los crea el paso 4 |
| 6 | R5 rojo → verde | título en el cuerpo, fila de acciones, `ListHeaderComponent` | Sí: existen hoy |
| 7 | A13 (docs) | — | commit de docs, antes del rojo de R6 |
| 8 | R6 rojo → verde | `contentContainerStyle` | Sí |
| 9 | R7 rojo → verde | `router.dismissTo` en `add-reminder` | Sí: el doble de `router` existe |

R4 va antes que R5 para que entre el commit que quita el título del cuerpo y el
que lo pone en la cabecera no quede ninguna pantalla sin título.

---

## R1, R2 y R3 — Al Stack raíz; push/pop; notificación

- [ ] **(1a) Rojo de R1.**
      - `src/app/__tests__/detail-stack.test.tsx`: `describe('#114 R1: reminders y alerts viven en la raíz de src/app')`
        tal cual [[design]] D8 (dos casos + el listado de `(tabs)`).
      - `src/app/__tests__/layout.test.tsx`: `describe('#114 R1: la guarda de RootStack declara reminders y alerts tras las seis')`
        con su `it` de D8.
      Rojo por aserción: rutas bajo `(tabs)` y seis hijos en la guarda.
      `bunx jest --runTestsByPath src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx`
      → 2 suites, fallan **solo** los `it` de `#114 R1`.
      Commit: `test(reminders-alerts-stack): reminders and alerts live on the root stack (R1)`.
- [ ] **(1b) Rojo de R2.** Nuevo `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`
      con el montaje y el único `it` de [[design]] D8 punto 1. Rojo por aserción:
      pila `["(tabs)"]` tras `push('/reminders')`.
      Commit: `test(reminders-alerts-stack): reminders and alerts stack over tabs (R2)`.
- [ ] **(1c) Rojo de R3.** Nuevo `src/app/__tests__/reminders-alerts-stack.notification.test.tsx`
      con el montaje y el único `it` de [[design]] D8 punto 2. Rojo por aserción:
      tras el `waitFor` de `/alerts`, la pila es `["(tabs)"]`, no
      `["(tabs)", "alerts"]`. Si el rojo sale por timeout del `waitFor`, el
      montaje está mal: corregirlo antes de commitear.
      Commit: `test(reminders-alerts-stack): notification tap stacks alerts once (R3)`.
- [ ] **(2) Verde, en un solo commit.**
      - `git mv 'src/app/(tabs)/reminders.tsx' src/app/reminders.tsx` y
        `git mv 'src/app/(tabs)/alerts.tsx' src/app/alerts.tsx`; corregir **solo**
        el import ([[design]] D1).
      - `src/app/_layout.tsx`: los dos `Stack.Screen` de D1 tras `pairing`,
        **sin `options`**, con `dangerouslySingular` en `alerts`.
      - Mantenimiento de [[design]] D9 filas 1–5 (con sus notas de trazabilidad).
      - `rm -f .expo/types/router.d.ts && bunx tsc --noEmit`.
      - `bunx jest --runTestsByPath src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/reminders-alerts-stack.notification.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.guard.test.tsx 'src/app/(tabs)/__tests__/alerts.test.tsx' src/screens/home/index.test.tsx src/hooks/use-push-registration.test.tsx src/hooks/use-push-registration.navigation.test.tsx`
        → **10 suites**, verde.
      Commit: `feat(reminders-alerts-stack): move reminders and alerts onto the root stack (R1,R2,R3)`.
- [ ] **(3) Refactor.** Suite completa verde. Evidencia de mutación para el
      reviewer, cada una revertida con `git diff` vacío: (a) quitar
      `dangerouslySingular` → el `it` de R3 rojo en el segundo toque; (b) sacar
      `<Stack.Screen name="reminders" />` del `Stack.Protected` → rojo el `it` de
      `#114 R1` de `layout.test.tsx`; anotar además qué hace el `it` de R2.

## R4 — Cabecera nativa

- [ ] **(1) Rojo.** `src/app/__tests__/layout.test.tsx`,
      `describe('#114 R4: reminders y alerts declaran su cabecera nativa')` con el
      `it.each` de D8. Rojo por aserción: `options` `undefined`.
      Commit: `test(reminders-alerts-stack): native header options for reminders and alerts (R4)`.
- [ ] **(2) Verde.** `options` de [[design]] D1 en los dos `Stack.Screen`. En
      `src/__tests__/ui-copy-table.ts` las dos filas que **entran** en D7; en
      `src/__tests__/ui-language.test.ts` el `+ 1` de `#65 R8` y el `every` de
      `#78 R12`; en `../specs/mobile-ui-language/design.md` §2 los dos sufijos.
      `bunx jest --runTestsByPath src/app/__tests__/layout.test.tsx src/__tests__/ui-language.test.ts`
      → 2 suites, verde.
      Commit: `feat(reminders-alerts-stack): native headers for reminders and alerts (R4)`.
- [ ] **(3) Refactor.** Ninguno previsto.

## R5 — El título sale del cuerpo

- [ ] **(1) Rojo.** `describe('#114 R5: el título vive en la cabecera nativa')` en
      `src/screens/reminders/index.test.tsx` y en `src/screens/alerts/index.test.tsx`,
      con los `it` de [[design]] D8. Rojo por aserción: el título existe en carga
      (y `reminders-actions` no existe).
      Commit: `test(reminders-alerts-stack): screens drop their body title (R5)`.
- [ ] **(2) Verde.** Los dos cuerpos según [[design]] D3; las dos filas que
      **salen** en D7 y el `- 1` de `#65 R8`; [[design]] D9 fila 7 y la parte R5 de
      la fila 9.
      `bunx jest --runTestsByPath src/screens/reminders/index.test.tsx src/screens/alerts/index.test.tsx src/__tests__/ui-language.test.ts`
      → 3 suites, verde; `bunx expo lint` con **salida vacía**.
      Commit: `feat(reminders-alerts-stack): drop body titles under the native header (R5)`.
- [ ] **(3) Refactor.** Ninguno previsto.

## R6 — Métricas bajo cabecera nativa

- [ ] **(0) Docs, A13 ya firmada.** Sustitución literal de [[requirements]]
      §Enmiendas en `../docs/conventions.md` y `../docs/ui-guidelines.md`.
      `grep -c 'enmienda A13 de #114' ../docs/conventions.md ../docs/ui-guidelines.md`
      → `1` y `1`; `bunx jest --runTestsByPath src/__tests__/hero-header-amendments.test.ts` verde.
      Commit: `docs(conventions): enmienda A13 de #114, reminders y alerts en la excepcion A11`.
- [ ] **(1) Rojo.** [[design]] D9 filas 8 y la parte R6 de la 9: `toEqual` con
      `paddingBottom: 48` y sufijo ` (#114 R6)`. Rojo por aserción en las dos.
      Commit: `test(reminders-alerts-stack): metrics under the native header (R6)`.
- [ ] **(2) Verde.** Los dos `contentContainerStyle` de [[design]] D4.
      `bunx jest --runTestsByPath src/screens/reminders/index.test.tsx src/screens/alerts/index.test.tsx`
      → 2 suites, verde.
      Commit: `feat(reminders-alerts-stack): drop tab-bar and status-bar padding (R6)`.
- [ ] **(3) Refactor.** Ninguno previsto.

## R7 — `add-reminder` sin mascota desapila hasta `reminders`

- [ ] **(1) Rojo.** `src/screens/add-reminder/index.test.tsx`: `dismissTo: jest.fn()`
      en el `router` del doble de `expo-router` (el `Redirect` del doble **se
      queda** en este commit) y `describe('#114 R7: sin mascota, add-reminder desapila hasta reminders')`
      de [[design]] D8. Rojo por aserción: `dismissTo` sin llamadas y
      `add-reminder-redirect` pintado.
      Commit: `test(reminders-alerts-stack): add-reminder without a pet dismisses to reminders (R7)`.
- [ ] **(2) Verde.** `AddReminderScreen` según [[design]] D6; [[design]] D9 fila 10
      (borrar el `it` del `Redirect` y el `Redirect` del doble; nota de
      trazabilidad).
      `bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx src/app/__tests__/detail-stack.test.tsx`
      → 2 suites, verde (el segundo vigila que `add-reminder` siga sin
      `useFocusEffect`); `bunx expo lint` con **salida vacía** y
      `git grep -n "Redirect" -- src/screens/add-reminder` vacío.
      Commit: `feat(reminders-alerts-stack): dismiss to reminders when no pet is selected (R7)`.
- [ ] **(3) Refactor.** Ninguno previsto.

---

## Cierre

- [ ] `rm -f .expo/types/router.d.ts; bunx tsc --noEmit; echo "exit=$?"` →
      `exit=0`, salida vacía.
- [ ] `bunx expo lint; echo "exit=$?"` → `exit=0`, salida vacía.
- [ ] `bunx jest --silent > /tmp/close114.txt 2>&1; echo "exit=$?"` → `exit=0` y
      **base + 2 suites, base + 9 tests** (en `a833f153`: 82 y 1435), con el
      reparto de [[design]] D8. Si un fichero no cuadra, la diferencia se explica
      en `progress/impl_mobile-reminders-alerts-to-stack.md` antes de cerrar.
- [ ] Greps y `git diff` vacíos de [[requirements]] §Verificación.
- [ ] [[traceability]] completa: cada R con su `describe` y sus hashes rojo →
      verde; A13 y A14 con su commit.
- [ ] `progress/impl_mobile-reminders-alerts-to-stack.md` con: comandos y salidas
      exactas (sin pipe), las dos mutaciones de R1–R3 y cualquier decisión que la
      spec no cerrara literalmente.
