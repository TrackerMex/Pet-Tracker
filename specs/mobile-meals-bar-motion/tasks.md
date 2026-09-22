---
feature: "mobile-meals-bar-motion"
status: spec_ready
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-meals-bar-motion]] (#106 + #107)

> Disciplina TDD: **(1) test rojo → (2) implementación mínima → (3) refactor**,
> requisito por requisito. Cada tarea corresponde a un R de [[requirements]].
> Commits **test-primero**: el rojo se versiona en su propio commit
> (CHECKPOINTS C4). Ningún commit rojo puede fallar por `ReferenceError` de un
> símbolo que aún no existe, ni por mutar un doble de test.
> Rutas relativas a `mobile-pet-tracker/` salvo donde se indique.

## Antes de empezar

- [ ] `git log -1` → confirmar que la base es `9df7b5bc` y la branch
      `feature/106-mobile-meals-bar-motion`. Si hubo rebase, **no** se
      reapuntan hashes después de rellenar [[traceability]]
- [ ] `rm -f mobile-pet-tracker/.expo/types/router.d.ts` (gitignorado; sus
      rutas fantasma rompen `bunx tsc --noEmit`)
- [ ] **No lanzar `./init.sh`**: Postgres y LocalStack son compartidos con el
      worktree `Pet-Tracker-wt-ui`, donde #94 está en vuelo. Se mide con
      `bunx jest` y `bunx tsc --noEmit` desde `mobile-pet-tracker/`
- [ ] Leer [[design]] §3 antes de escribir el primer doble de Reanimated, y
      §4 antes de tocar nada de #107

## Orden y por qué es ese (candado del sujeto ausente)

Ningún test asevera un nodo o un símbolo que su propio orden no haya creado
todavía:

| # | R | Sujeto que asevera | ¿Existe cuando se asevera? |
|---|---|---|---|
| 1 | **R1** | la entrada `expo-haptics` de `package.json`, la ausencia de ficheros de babel y el texto de `docs/ui-guidelines.md` | Sí: los tres ficheros existen; lo que falta es su contenido, y ese es el rojo |
| 2 | **R4** | `Haptics.notificationAsync` | Sí, **porque R1 ya instaló el módulo**. Al revés, `jest.mock('expo-haptics')` reventaría con «Cannot find module» y ese no es un rojo legítimo |
| 3 | **R5** | el `style` de `meal-toggle-<i>` | Sí, está en producción desde #98. Por eso es **requisito de verificación**: su rojo lo produce la mutación |
| 4 | **R2** | `reminders-meals-fill` como componente animado | El nodo existe desde #98; lo que no existe es su naturaleza animada, y ese es el rojo |
| 5 | **R3** | la rama de reduce motion | Sí, **porque R2 ya puso el `useEffect` que llama a `withTiming`**. Antes de R2 no habría nada que suprimir |

R1 y R4 van primero para dejar `src/app/(tabs)/food.tsx` contiguo con R5; R2 y
R3 cierran en `src/screens/home/`.

---

## R1 (#106) — `expo-haptics` declarada y la carta enmendada

- [ ] **(1) Test rojo.** En `src/app/(tabs)/__tests__/food.test.tsx`, nuevo
      `describe('#106 R1: expo-haptics entra declarada y sin configuración de babel')`
      con un `it`:
      - lee `package.json` con el `readFileSync` que el fichero ya trae de
        `:28` y asevera que `dependencies['expo-haptics']` está definido y que
        su versión mayor es la misma que la de `dependencies.expo`
        (**consistencia interna**: el rango exacto no se escribe aquí);
      - asevera que ninguno de `babel.config.js`, `babel.config.cjs`,
        `babel.config.ts`, `.babelrc` y `.babelrc.js` existe en el raíz del
        proyecto móvil;
      - lee `../docs/ui-guidelines.md` relativo a `process.cwd()` y asevera
        `not.toContain('expo-haptics NO está instalado')` y
        `toContain('expo-haptics está instalado desde #106')`.
      Rojo esperado: falla la primera y la tercera. **No** debe fallar la
      segunda — si falla, alguien ha creado un fichero de babel y hay que
      entender por qué antes de seguir.
      ```bash
      bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'
      ```
- [ ] **(2) Implementación mínima.**
      ```bash
      cd mobile-pet-tracker && bunx expo install expo-haptics
      ```
      Nada de `npx`, nada de `npm i -g`, nada de escribir la versión a mano.
      Si `expo install` avisa de que el rango de `bundledNativeModules.json`
      está caducado, se sigue lo que diga el CLI y **se escribe en el
      reporte**; no se fuerza una versión a ojo.
      Después, sustituir `docs/ui-guidelines.md:171-172` por el bloque literal
      de [[requirements]] R1.
      **No** crear `babel.config.js`. **No** tocar `app.json`. **No** tocar
      ninguna spec de `specs/` ajena a esta feature.
- [ ] **(3) Refactor con tests verdes.** Correr la suite móvil completa y
      `bunx tsc --noEmit`: el install mueve `bun.lock` y hay que comprobar que
      no arrastra nada. Confirmar que `src/__tests__/design-drift.test.ts`
      sigue verde **sin tocarlo** (su `it('contains the approved
      dependencies')` no es una lista cerrada).

## R4 (#106) — Háptico al servir y al deshacer

- [ ] **(1) Test rojo.** En `src/app/(tabs)/__tests__/food.test.tsx`:
      - añadir el doble de módulo de `expo-haptics`. **Intención**, no copia:
        necesita exponer `notificationAsync` como `jest.fn()` que resuelva, y
        un `NotificationFeedbackType` con `Success` y `Error`. Antes de
        escribirlo, abrir `node_modules/expo-haptics` y confirmar los nombres
        reales de los exports; las aserciones comparan contra
        `NotificationFeedbackType.Success` del propio doble, **nunca** contra
        un literal de cadena;
      - nuevo `describe('#106 R4: servir y deshacer vibran una vez y distinguen éxito de fallo')`
        con los cinco casos que enumera [[requirements]] R4, construidos sobre
        los escenarios que ya existen en `#98 R5` (`:472`, `:504`) y
        `#98 R6` (`:591`) — mismos dobles de `serveMeal`/`unserveMeal`, mismas
        esperas sobre el árbol.
      Regla de espera (`docs/conventions.md` §Esperas sobre el árbol
      renderizado): la condición que cierra el `waitFor` es la misma
      observación que hacen las aserciones. Para el caso de error, anclarse
      primero a la aparición de `food-meal-error` y aseverar el háptico
      después.
      Rojo esperado: `notificationAsync` nunca se llama.
- [ ] **(2) Implementación mínima.** En `src/app/(tabs)/food.tsx`: importar
      `expo-haptics` y, dentro de `toggleMeal` (`:63-87`), extraer el booleano
      de fallo que hoy está en línea en el `if` de `:77`, y disparar
      `void Haptics.notificationAsync(...)` **después** de
      `await queryClient.refetchQueries({ queryKey: petKeys.detail(selectedPetId) })`
      y **antes** del `finally`. Ni un `await` sobre el háptico.
- [ ] **(3) Refactor con tests verdes.** Sonda de mutación, y se escribe la
      evidencia: intercambiar `Success` por `Error` en producción y comprobar
      que la suite se pone roja **por la aserción del háptico**; restaurar y
      verificar `git diff` vacío. Añadir al final de
      `progress/audit_animations_mobile.md` la sección
      `## Nota de #106 (2026-09-21)` con los tres puntos que enumera
      [[requirements]] R4 (cabecera `:6`, rechazo R5 y rechazo R7).

## R5 (#107) — Candado del feedback de pulsado del `meal-toggle`

> **Requisito de verificación, vía (b) de C4.** El `style` ya está en
> producción: un test nuevo nacería verde. El rojo lo produce **mutar
> producción**, no un doble de test.

- [ ] **(1) Commit rojo.** En el **mismo commit**:
      - quitar `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}` de
        `src/app/(tabs)/food.tsx:253-255`;
      - añadir a `src/app/(tabs)/__tests__/food.test.tsx` el
        `describe('#107 R5: el botón por franja conserva su feedback de pulsado')`
        con las dos aserciones de [[requirements]] R5 (el helper `opacityOf`
        sobre el árbol y la regex acotada al bloque del `<Pressable>`).
      Comprobar que el rojo es **por las dos** aserciones y por la ausencia
      del feedback, no por otra cosa.
      ```bash
      bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'
      ```
- [ ] **(2) Commit verde.** Restaurar el `style` **exactamente como estaba**,
      en sus tres líneas. El diff neto de `food.tsx` por R5 es **cero**:
      comprobarlo con `git diff <commit-antes-del-rojo> -- 'src/app/(tabs)/food.tsx'`
      acotado a esas líneas. **No** normalizar a una línea.
- [ ] **(3) Refactor con tests verdes.** Verificar que la regex acotada sigue
      casando si prettier reescribe el bloque: probarla mentalmente contra la
      forma de una línea de `src/screens/home/index.tsx:314`. **No** añadir un
      `R12` a `specs/mobile-meals-served-ui/` ni enmendar esa spec.

## R2 (#106) — El relleno de la barra transiciona su ancho

- [ ] **(1) Test rojo.** En `src/screens/home/index.test.tsx`:
      - añadir el doble de módulo de `react-native-reanimated`. **Intención**:
        conservar el módulo real y sustituir `withTiming` y `withDelay` por
        identidades, y `useReducedMotion` por un `jest.fn` controlable que
        por defecto devuelva `false`. `withDelay` entra **obligatoriamente**
        porque la Home renderiza `WeeklyActivityChart`, cuyo `ActivityBar`
        compone `withDelay(delay, withTiming(...))` — ver [[design]] §3. Antes
        de escribirlo, abrir `src/screens/home/weekly-activity-chart.test.tsx:58-66`
        y mirar qué dobla y qué deja real; **no copiarlo a ciegas**;
      - nuevo `describe('#106 R2: la barra de comidas transiciona su ancho')`
        con los cuatro puntos de [[requirements]] R2. **En este commit las
        aserciones no importan ningún símbolo nuevo de producción**: se usa
        `expect(mockWithTiming).toHaveBeenCalledTimes(1)`, no todavía
        `toHaveBeenCalledWith(..., MEALS_BAR_TIMING)`;
      - reescribir **las dos** aserciones que la tabla de [[requirements]] R2
        declara (`:3697` y `:3716-3718`) a `toHaveAnimatedStyle`. Ninguna
        otra.
      Rojo esperado: `withTiming` nunca se llama y el relleno no tiene estilo
      animado.
      ```bash
      bunx jest --runTestsByPath 'src/screens/home/index.test.tsx'
      ```
- [ ] **(2) Implementación mínima.** En `src/screens/home/index.tsx`:
      exportar `MEALS_BAR_DURATION_MS`, `MEALS_BAR_EASING` y
      `MEALS_BAR_TIMING` con los valores de la tabla de [[requirements]] R2;
      declarar `const AnimatedView = Animated.createAnimatedComponent(View);`
      a nivel de módulo (precedente `weekly-activity-chart.tsx:91`); junto a
      `mealsPct` (`:225-228`), un shared value inicializado en `mealsPct`, un
      `useAnimatedStyle` que devuelva el ancho en porcentaje y un `useEffect`
      que lo lleve con `withTiming(mealsPct, MEALS_BAR_TIMING)`; y cambiar el
      `View` de `:712-716` por `AnimatedView`, **conservando el `testID` y el
      `className` letra por letra**. Los hooks van al nivel superior del
      componente, nunca dentro del ternario de `mealsToday !== null`.
- [ ] **(3) Refactor con tests verdes.** Apretar la aserción de la
      configuración a `expect(mockWithTiming).toHaveBeenCalledWith(100, MEALS_BAR_TIMING)`
      importando la constante, y **demostrarlo con una sonda**: cambiar la
      duración en producción, ver el rojo por esa aserción, restaurar y
      verificar `git diff` vacío. Escribir la evidencia en el reporte — un
      candado que nadie vio fallar no es un candado (carta §Enmienda #70,
      Método). Después, correr `src/screens/home/index.test.tsx` **entera**:
      el doble es de módulo y afecta a todo el fichero.

## R3 (#106) — Reduce motion deja la barra sin animación

- [ ] **(1) Test rojo.** En `src/screens/home/index.test.tsx`, nuevo
      `describe('#106 R3: reduce motion deja la barra sin animación')`: con el
      doble de `useReducedMotion` devolviendo `true`, `withTiming` **no** se
      llama y el relleno cumple `toHaveAnimatedStyle({ width: '50%' })`; con
      `false`, `withTiming` **sí** se llama. Rojo esperado: tras R2,
      producción llama siempre.
- [ ] **(2) Implementación mínima.** Añadir `useReducedMotion()` y la rama que
      fija el shared value directamente cuando vale `true`. **No** quitar
      `reduceMotion: ReduceMotion.System` de `MEALS_BAR_TIMING`: las dos capas
      se conservan ([[requirements]] R3).
- [ ] **(3) Refactor con tests verdes.** Restaurar el `mockUseReducedMotion` a
      su valor por defecto en el `beforeEach` para no contaminar los demás
      describes del fichero, y correr la suite móvil completa.

---

## Cierre (lo hace el `leader`, no Codex)

- [ ] `bunx jest` sin filtro y `bunx tsc --noEmit`, **sin pipe** — `cmd | tail`
      devuelve el código de `tail`
- [ ] Cero suites rojas nuevas respecto a `9df7b5bc` (delta contra ese commit;
      nunca un recuento absoluto de tests o suites)
- [ ] `grep -rn 'expo-haptics' docs/ui-guidelines.md` → solo la redacción nueva
- [ ] [[traceability]] con sus cinco filas rellenas, y **sin rebase posterior**
- [ ] Reporte en `progress/impl_mobile-meals-bar-motion.md` con: los dos
      commits de cada R, el resultado de cada lote de jest, el del typecheck,
      la versión que `expo install` resolvió para `expo-haptics`, las tres
      sondas de mutación (R4, R5, R2) y la confirmación de que el rojo de R5
      falló por la ausencia del `style`
- [ ] **No** marcar ninguna feature como `done`, **no** mergear y **no** abrir
      el PR: avisar al humano y parar
