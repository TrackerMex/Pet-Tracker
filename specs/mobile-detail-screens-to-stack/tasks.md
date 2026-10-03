---
feature: "mobile-detail-screens-to-stack"
status: approved       # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-detail-screens-to-stack]] (#95)

> Disciplina TDD: **(1) test rojo → (2) implementación mínima → (3) refactor**,
> requisito por requisito. Commits **test-primero**: el rojo va en su propio
> commit y falla **por su aserción**, nunca por un `ReferenceError`, un módulo
> inexistente ni una mutación de un doble (CHECKPOINTS C4). Añadir a un doble un
> campo que la producción aún no usa (p. ej. `dismissTo: jest.fn()`) no es
> mutarlo: el rojo lo sigue produciendo la producción.
> Rutas relativas a `mobile-pet-tracker/` salvo donde se indique. Todos los
> comandos se lanzan **desde `mobile-pet-tracker/`**, con `bunx`, nunca `npx`.

## Antes de empezar

- [ ] `git branch --show-current` → `feature/95-mobile-detail-screens-to-stack`,
      y `git log -1` → la base declarada en [[requirements]] (`2be1b023`) o una
      posterior. Si la base se movió, **medir de nuevo** (siguiente punto) y
      aplicar los deltas de [[design]] D9 sobre la base nueva; no reapuntar
      hashes de [[traceability]] tras un rebase.
- [ ] Las tres casillas previas firmadas: **A11** y **spec** en
      [[requirements]] §Aprobación, **A12** en
      `specs/mobile-device-pairing/design.md` §Enmienda #95. Sin A12 no se toca
      `pairing`; sin A11 no se empieza R6.
- [ ] `rm -f .expo/types/router.d.ts` (gitignorado; tras mover rutas se llena de
      rutas fantasma y rompe `bunx tsc --noEmit`). Repetirlo antes de cada
      `tsc` después de R2.
- [ ] **No lanzar `./init.sh`** ni tocar Postgres/LocalStack: son compartidos
      con el worktree de Backend. Se mide con `bunx jest`, `bunx tsc --noEmit` y
      `bunx expo lint`.
- [ ] Medir la base **sin pipe** y con el exit code:
      `bunx jest --silent; echo "exit=$?"` → en `2be1b023`, 77 suites, 1412
      tests, `exit=0`. `bunx tsc --noEmit; echo "exit=$?"` y
      `bunx expo lint; echo "exit=$?"` → `exit=0` y **salida vacía**.
- [ ] Skills de Expo: overview → router (Stack, `Stack.Protected`, cabeceras) y
      native-ui, con los nombres del catálogo de Codex que dé el handoff.
- [ ] Leer [[design]] §1 (sondas) y D9 antes de escribir el primer test de
      navegación: **un solo `it` por fichero que use `renderRouter`** (S11).
- [ ] Filtros de jest con paréntesis **escapados**: `'src/app/\(tabs\)/…'`. Tras
      cada comando, comprobar que el número de suites que imprime jest coincide
      con el de ficheros pedidos.

## Orden y por qué es ese (candado del sujeto ausente)

| # | Commit | Asevera sobre | ¿Existe cuando se asevera? |
|---|---|---|---|
| 1 | R1 rojo → verde | `SelectedPetProvider` y el `token` de `useAuth` | Sí |
| 2 | R2 rojo | ubicación de seis ficheros, hijos de `Stack`, pila raíz | Sí: los ficheros existen (bajo `(tabs)`) y el `Stack` también; lo que falta es dónde están y qué declara, y ese es el rojo (sonda S3) |
| 3 | R3 rojo | pila raíz sin sesión | Sí: la guarda heredada de `(tabs)` existe; el rojo es que la pila crece (S4) |
| 4 | R2 + R3 verde | — | movimiento + provider + `RootStack`, **en un solo commit** ([[design]] D1) |
| 5 | R4 rojo → verde | `options` de los seis `Stack.Screen` | Sí: los crea el paso 4; lo que falta son sus opciones |
| 6 | R5 rojo → verde | ausencia de botones, títulos en cuerpo y claves | Sí: existen hoy; su presencia es el rojo |
| 7 | A11 (docs) | — | commit de docs, antes del rojo de R6 |
| 8 | R6 rojo → verde | `contentContainerStyle` | Sí |
| 9 | R7 rojo → verde | `useFocusEffect` en el fuente | Sí: existe hoy |
| 10 | R8 rojo → verde | `router.dismissTo` / `router.push` | Sí: el doble de `router` existe |

R4 va antes que R5 para que entre el commit que quita la flecha a mano y el que
la sustituye no quede ninguna pantalla sin forma de volver.

---

## R1 — La mascota seleccionada pertenece a la sesión

- [ ] **(1) Test rojo.** En `src/providers/__tests__/selected-pet-provider.test.tsx`:
      `jest.mock('../auth-provider', () => ({ useAuth: jest.fn() }))`, y en un
      `beforeEach` de fichero `mockUseAuth.mockReturnValue({ status:
      'authenticated', token: 'token-a', signIn: jest.fn(), signOut: jest.fn() })`
      (los dos `it` de `R5` existentes lo necesitan desde ahora). Nuevo
      `describe('#95 R1: la selección pertenece a la sesión')` con **un** `it`
      que, con el `SelectedPetProbe` del fichero y `rerender` de
      `@testing-library/react-native`:
      token `token-a` → pulsar "Select Luna" → `pet-1`; token `null` → `none`;
      token `token-b` → `none`; seleccionar otra vez → `pet-1`; token `token-a`
      de nuevo → `none` (no resucita la selección antigua).
      Rojo por aserción: hoy el provider ignora el token.
      Commit: `test(detail-stack): scope pet selection to the session (R1)`.
- [ ] **(2) Verde.** `src/providers/selected-pet-provider.tsx` según
      [[design]] D2 §R1 (par `{ token, petId }`, selección **derivada**, sin
      `useEffect`). `bunx jest src/providers/__tests__/selected-pet-provider
      src/hooks/use-pet-selection` verde.
      Commit: `feat(detail-stack): scope pet selection to the session (R1)`.
- [ ] **(3) Refactor.** Suite completa verde (el provider real lo renderizan
      once suites; si alguna se pone roja porque su doble de `useAuth` cambia de
      `token` a mitad de un `it`, se ajusta el test, no la producción).

## R2 y R3 — Las seis en el Stack raíz, protegidas

- [ ] **(1a) Test rojo de R2.**
      - Nuevo `src/app/__tests__/detail-stack.test.tsx` con
        `describe('#95 R2: las seis rutas de detalle viven en la raíz de src/app')`
        tal cual [[design]] D9 punto 1 (seis casos + el listado de `(tabs)`).
      - Nuevo `src/app/__tests__/detail-stack.navigation.test.tsx` con el montaje
        común y el único `it` de R2 de [[design]] D9.
      - En `src/app/__tests__/layout.test.tsx`: los dobles nuevos de D9 (`Stack`
        como `jest.fn` con estáticos `Screen` y `Protected`, `useTranslate`,
        `use-theme-colors`) y
        `describe('#95 R2: el layout raíz monta el provider y el Stack de detalle')`
        con sus dos `it`. Los siete tests existentes del fichero siguen verdes con
        los dobles nuevos: comprobarlo antes de commitear.
      Rojo por aserción en los tres ficheros: rutas bajo `(tabs)`, pila
      `["(tabs)"]` tras el push, `add-reminder` monta una sola vez, y `Stack` sin
      hijos.
      Commit: `test(detail-stack): detail routes stack over tabs (R2)`.
- [ ] **(1b) Test rojo de R3.** Nuevo `src/app/__tests__/detail-stack.guard.test.tsx`
      con el montaje común y el único `it` de R3 de [[design]] D9. Rojo por
      aserción: la pila sin sesión crece con entradas `(auth)` (sonda S4).
      Commit: `test(detail-stack): guard keeps detail routes behind the session (R3)`.
- [ ] **(2) Verde, en un solo commit** ([[design]] D1, orden obligatorio):
      - `git mv` de los seis routes según la tabla de D1, y corregir **solo** la
        ruta de su import.
      - `src/app/_layout.tsx`: `SelectedPetProvider` dentro de `QueryProvider`,
        envolviendo `<PushRegistration />` y `<RootStack />`; `RootStack`
        declarado **después** de `RootLayout`, sin `return null`, con los cuatro
        `Stack.Screen` abiertos y el `Stack.Protected` con los seis, **aún sin
        `options`** (las pone R4).
      - `src/app/(tabs)/_layout.tsx`: fuera `SelectedPetProvider` y su import; la
        guarda (`loading` → `null`, `Redirect` a `/login`) no cambia.
      - Mantenimiento de tests de [[design]] D10 filas 1–6: `(tabs)` layout test
        (invertir el `it` del provider; imports y título del `it` de R10),
        `tabs-layout.test.tsx` (doble muerto fuera), `pairing/index.test.tsx`
        (import de `PairingRoute`; `describe` de #42 R4 renombrado) y la fila R4 de
        `specs/mobile-device-pairing/traceability.md`, y `home/index.test.tsx`
        (`appRoutes` sin grupos en el prefijo; la llamada de
        `no apunta a ninguna ruta inexistente` sobre `src/app`).
      - `rm -f .expo/types/router.d.ts && bunx tsc --noEmit`.
      - `bunx jest src/app/__tests__ 'src/app/\(tabs\)/__tests__' src/screens/pairing src/screens/home src/providers`
        verde.
      Commit: `feat(detail-stack): move detail routes onto the root stack (R2,R3)`.
- [ ] **(3) Refactor.** Suite completa verde. Evidencia de mutación de R3 para el
      reviewer: `guard={true}` en `RootStack` → el `it` de R3 rojo por aserción;
      revertir con `git diff` vacío.

## R4 — Cabecera nativa en las seis

- [ ] **(1) Test rojo.** En `src/app/__tests__/layout.test.tsx`,
      `describe('#95 R4: cada pantalla de detalle declara su cabecera nativa')`
      con el `it.each` de seis filas de [[design]] D9. Rojo por aserción: los
      seis `Stack.Screen` no tienen `options`.
      Commit: `test(detail-stack): native header options per detail screen (R4)`.
- [ ] **(2) Verde.** `RootStack` con las opciones de [[design]] D3 y los títulos
      de [[requirements]] R4 (`title: ''` explícito en `pets/[petId]/docs` y
      `pairing`; ninguna clave `animation`). En `src/__tests__/ui-copy-table.ts`,
      las cuatro filas nuevas con `file: 'src/app/_layout.tsx'`, y en
      `src/__tests__/ui-language.test.ts` los `+ 1 // #95 R4` de [[design]] D8
      (cuatro bloques y `SCREEN_FILES`). En `specs/mobile-ui-language/design.md`
      §2, el sufijo de las cuatro filas de títulos.
      `bunx jest src/app/__tests__/layout src/__tests__/ui-language src/__tests__/ui-copy-table`
      verde.
      Commit: `feat(detail-stack): native headers for detail screens (R4)`.
- [ ] **(3) Refactor.** Una sola constante local para las opciones comunes; nada
      más.

## R5 — Fuera la cabecera dibujada a mano

- [ ] **(1) Test rojo.** En cada uno de los seis
      `src/screens/<x>/index.test.tsx`, un
      `describe('#95 R5: la pantalla no dibuja cabecera propia')` con **un** `it`
      que renderiza la pantalla en su estado cargado habitual del fichero y
      asevera `queryByTestId('<x>-back')` → `null` y, en `add-reminder`,
      `add-pet`, `weight-log` y `meal-schedule`,
      `queryByText(es['<clave de título>'])` → `null` (con `es` importado de
      `../../i18n/catalog`). En `docs`, además, `getByText(es['docs.documentsOf'])`
      visible (el bloque se queda). En
      `src/providers/__tests__/language-provider.test.tsx`, dentro de
      `describe('#65 R12 …')`, un `it('#95 R5: el catálogo ya no trae las seis claves de volver')`
      que asevera que ninguna de las seis está en `Object.keys(en)` ni en
      `Object.keys(es)`. Rojo por aserción: todo existe hoy.
      Commit: `test(detail-stack): screens drop their hand-made header (R5)`.
- [ ] **(2) Verde.**
      - Los seis `src/screens/<x>/index.tsx` según [[design]] D5, fila por fila,
        incluidos los imports y variables huérfanos.
      - `src/i18n/catalog.ts`: fuera las seis claves en `en` y en `es`.
      - Tests de [[design]] D10 filas 7–10, 12, 13 y 15–17 (en 9, 10 y 12, solo
        la parte de R5), y en
        `language-provider.test.tsx` la suma con ` - 6` y su comentario.
      - `ui-copy-table.ts`: fuera las seis filas de claves retiradas y las cuatro
        de títulos con fichero de pantalla; `ui-language.test.ts`: los `- 2` /
        `- 1 // #95 R5` y los números de los títulos de sus `it` ([[design]] D8).
      - `specs/mobile-ui-language/design.md` §2: sufijo de las seis filas
        retiradas.
      - `bunx jest src/screens/add-reminder src/screens/add-pet src/screens/docs src/screens/weight-log src/screens/meal-schedule src/screens/pairing src/providers src/__tests__`
        verde; `bunx expo lint` con **salida vacía**.
      Commit: `feat(detail-stack): drop hand-made back buttons and body titles (R5)`.
- [ ] **(3) Refactor.** Notas de trazabilidad de #61 R10 y #62 R7 ([[design]] D10,
      párrafo final).

## R6 — Métricas bajo cabecera nativa

- [ ] **(0) Docs, A11 ya firmada.** Insertar el texto literal de
      [[requirements]] R6 en `../docs/conventions.md` §Convenciones de la app
      móvil (viñeta de dimensiones) y en `../docs/ui-guidelines.md` §Decisiones
      fijas 6, tras la frase que cierra la excepción A9 en cada uno.
      `grep -c 'enmienda A11 de #95' ../docs/conventions.md ../docs/ui-guidelines.md`
      → `1` y `1`; `bunx jest src/__tests__/hero-header-amendments` verde.
      Commit: `docs(conventions): excepcion A11 de metricas bajo cabecera nativa (R6)`.
- [ ] **(1) Test rojo.** `describe('#95 R6: métricas bajo cabecera nativa')` con
      un `it` en `src/screens/docs/index.test.tsx` y otro en
      `src/screens/add-pet/index.test.tsx`: `contentContainerStyle` `toEqual`
      `{ padding: 24, gap: 16, paddingBottom: 48 }`. En el mismo commit, las
      aserciones de [[design]] D10 filas 9–12, 14 y 18 pasan a su valor nuevo, con
      sus títulos. Rojo por aserción en todas.
      Commit: `test(detail-stack): metrics under the native header (R6)`.
- [ ] **(2) Verde.** Los seis `contentContainerStyle` de [[design]] D4.
      `bunx jest src/screens/add-reminder src/screens/add-pet src/screens/docs src/screens/weight-log src/screens/meal-schedule src/screens/pairing src/__tests__/design-drift`
      verde. Fila R5 (mitad weight-log) de
      `specs/mobile-design-drift/traceability.md` actualizada.
      Commit: `feat(detail-stack): drop tab-bar and status-bar padding from detail screens (R6)`.
- [ ] **(3) Refactor.** Ninguno previsto.

## R7 — Se retira el reset en blur de #63

- [ ] **(1) Test rojo.** En `src/app/__tests__/detail-stack.test.tsx`,
      `describe('#95 R7: el reset de #63 queda solo donde no lo cubre el Stack')`
      con el `it.each` de cinco ficheros de [[design]] D9. Rojo por aserción: los
      cinco `useFocusEffect` de #63 existen.
      Commit: `test(detail-stack): blur resets are redundant on the stack (R7)`.
- [ ] **(2) Verde.** Borrar lo de [[design]] D6 en los cinco ficheros, con sus
      imports huérfanos, y los ocho `it` de #63 de [[design]] D10 fila 20 con sus
      dobles y helpers muertos (en `pairing` el doble de `useFocusEffect` se
      queda). Notas `← retirado por #95 (R7, C7)` en
      `specs/mobile-detail-screens-state-reset/traceability.md` y
      `specs/mobile-owner-timezone-dates/traceability.md`.
      `bunx jest src/app/__tests__/detail-stack src/screens/add-reminder src/screens/add-pet src/screens/weight-log src/screens/meal-schedule src/screens/pairing`
      verde; `bunx expo lint` con salida vacía.
      Commit: `refactor(detail-stack): retire blur resets covered by the stack (R7)`.
- [ ] **(3) Refactor.** Ninguno previsto.

## R8 — "Ver en el mapa" desapila `pairing`

- [ ] **(1) Test rojo.** En `src/screens/pairing/index.test.tsx`: el doble de
      `expo-router` gana `dismissTo: jest.fn()` en `router`; nuevo
      `describe('#95 R8: ver en el mapa desapila pairing')` con un `it` que, con el
      `renderReady()` del fichero, pulsa `ready-map` y asevera
      `mockRouter.dismissTo` llamado una vez con `'/map'` y `mockRouter.push` **no**
      llamado. Rojo por aserción (hoy se llama `push`).
      Commit: `test(detail-stack): pairing leaves to the map without duplicating tabs (R8)`.
- [ ] **(2) Verde.** `leaveReady('map')` con `router.dismissTo('/map')`
      ([[design]] D7), y la fila 19 de D10 (el `it` de #42 R7 pasa a
      `dismissTo`). `bunx jest src/screens/pairing src/app/__tests__/detail-stack`
      verde.
      Commit: `feat(detail-stack): dismiss to the map from pairing (R8)`.
- [ ] **(3) Refactor.** Ninguno previsto.

---

## Cierre

- [ ] `rm -f .expo/types/router.d.ts; bunx tsc --noEmit; echo "exit=$?"` →
      `exit=0`, salida vacía.
- [ ] `bunx expo lint; echo "exit=$?"` → `exit=0`, salida vacía.
- [ ] `bunx jest --silent; echo "exit=$?"` → `exit=0` y **base + 3 suites, base +
      14 tests** (en `2be1b023`: 80 y 1426), con el reparto por fichero de
      [[design]] D9. Si un fichero no cuadra, la diferencia se explica en
      `progress/impl_mobile-detail-screens-to-stack.md` antes de cerrar.
- [ ] Greps de C7 y C8 de [[requirements]] §Verificación.
- [ ] `git grep -n "backToReminders\|addPet.backToProfile\|docs.backToProfile\|backToHealth\|backToFood\|'pairing.back'" -- mobile-pet-tracker/src`
      vacío.
- [ ] [[traceability]] completa: cada R con su `describe` y sus hashes rojo →
      verde.
- [ ] `progress/impl_mobile-detail-screens-to-stack.md` con: comandos y salidas
      exactas, la evidencia de mutación de R3, y cualquier decisión que la spec
      no cerrara literalmente.
