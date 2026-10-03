---
feature: "mobile-reanimated-double-dead-weight"
status: spec_ready        # draft | spec_ready | approved
tags: [harness, spec, mobile, tests]
---

# Tareas — [[mobile-reanimated-double-dead-weight]]

> Disciplina TDD: **(1) test rojo → (2) cambio mínimo que lo pone verde → (3)
> refactor**. Un commit por paso, nunca todo junto. Ver [[requirements]] y
> [[design]].

---

## Antes de empezar

### Skills de Expo: **no se carga ninguna**

El catálogo del plugin `expo` de Codex CLI es **v1.0.2 con 13 skills**:
`building-native-ui`, `codex-expo-run-actions`, `expo-api-routes`,
`expo-cicd-workflows`, `expo-deployment`, `expo-dev-client`, `expo-module`,
`expo-tailwind-setup`, `expo-ui-jetpack-compose`, `expo-ui-swift-ui`,
`native-data-fetching`, `upgrading-expo`, `use-dom`.

`expo-overview`, `expo-router` y `expo-animation` **no existen** en ese catálogo.
Y **ninguna de las 13 cubre dobles de jest**: esta feature no escribe UI, no
navega, no anima y no toca nativo.

> **Instrucción explícita: no cargues ninguna skill de expo para esta feature, y
> no sustituyas por "la más cercana".** Lo que necesitas saber del entorno está
> transcrito en esta spec. Si algo falta, **pregunta**, no lo deduzcas de una
> skill que trata de otra cosa.
>
> (En #106 el handoff asumió skills que no existían y Codex cargó
> `building-native-ui` por aproximación — deuda B5 de
> `progress/review_mobile-meals-bar-motion.md`. Esta nota existe para que no se
> repita.)

### Entorno — reglas que los tests no ven pero el gate sí

- **`bun`, nunca `npx` ni `npm`.** `bunx jest`, `bunx tsc`, `bunx eslint`.
- **`rm -f mobile-pet-tracker/.expo/types/router.d.ts` antes de cada `tsc`.**
- **Exit codes sin pipe.** `bunx jest | tail` devuelve el código de `tail`.
  Medir así:
  ```bash
  bunx jest > /tmp/run.log 2>&1; echo "EXIT=$?"
  ```
- **`(tabs)` es regex para jest.** En esta feature se trabaja en
  `src/screens/`, pero la corrida completa los toca. Para un fichero suelto usa
  siempre `--runTestsByPath`:
  ```bash
  bunx jest --runTestsByPath src/screens/home/index.test.tsx
  ```
  Y comprueba que el número de suites que imprime jest es el que esperabas.
- **Working directory**: `mobile-pet-tracker/`.

### Línea base a re-medir antes de tocar nada

Medido por el `spec_author` el 2026-09-22 sobre `e4c9ea99`, **sin pipe**:

| Medida | Valor |
|---|---|
| `bunx jest --runTestsByPath src/screens/home/index.test.tsx` | exit 0 — **1 suite / 138 tests** |
| `bunx jest` (suite móvil completa) | exit 0 — **77 suites / 1396 tests** |

**Re-mídelo tú en tu primer commit y usa deltas, no absolutos.** Si tu base no
da estos números, el árbol se movió: **para y avisa** antes de escribir código.

---

## R1 — El `Skeleton` real de `heroui-native` se monta en `home-loading`

- [ ] **(1) Test rojo.** Añadir **al final** de
      `mobile-pet-tracker/src/screens/home/index.test.tsx` un describe nuevo:

      `describe('R1 (mobile-reanimated-double-dead-weight): home monta el Skeleton real de heroui-native', …)`

      > El título **no lleva `#110`**: escribirlo dispara los cinco guards de
      > `design-drift.test.ts`. Ver [[design]] §D3. No lo "arregles" partiendo
      > el literal.

      Dentro, un `it` que renderice home en estado de carga y asevere que el
      `className` del nodo `home-loading` **contiene `skeleton__root`**.

      **Sobre el arreglo (`beforeEach`)**: necesita el mismo escenario de carga
      que ya usa el describe de #62 R8 en `:1303-1314` — sesión autenticada y
      `listPets` / `getPet` / `getDailyActivity` en estado pendiente.
      **Lee ese bloque en el fichero destino y reprodúcelo desde ahí**; no
      copies un arreglo de otra suite (en #73 un mock calcado de otra suite
      rompió el Skeleton del hero).

      Rojo esperado, **ya medido**: el `className` es hoy
      `h-12 w-full rounded-card`, sin `skeleton__root`. Debe fallar **por esa
      aserción**, no por un `ReferenceError` ni por el arreglo.

      Commit: `test(mobile): …  (R1)`

- [ ] **(2) Verde mínimo.** Borrar `src/screens/home/index.test.tsx:124-142` —
      el `jest.mock('heroui-native', …)` entero más la línea en blanco que lo
      sigue. **Nada más en este commit.**

      Commit: `test(mobile): …  (R1)` — sigue siendo scope de test, no hay
      producción que tocar.

- [ ] **(3) Refactor / verificación.** Correr el fichero entero sin pipe y
      comprobar que el delta de tests es **+1** y que no hay rojos nuevos.

---

## R2 — `Animated.View` es el de Reanimated, no el `View` de `react-native`

- [ ] **(1) Test rojo.** Añadir un segundo describe al final del mismo fichero:

      `describe('R2 (mobile-reanimated-double-dead-weight): Animated.View no es el View de react-native', …)`

      Un `it` que obtenga el export por defecto de `react-native-reanimated` y
      el `View` real de `react-native`, y asevere que **no son el mismo
      objeto**.

      Detalles que importan, medidos:
      - Obtén el default **dentro del cuerpo del test** (no añadas un import de
        primer nivel): el fichero tiene fábricas de `jest.mock` hoisteadas y un
        import nuevo arriba es ruido innecesario.
      - Compara contra el `View` **real** de `react-native`
        (`jest.requireActual`), no contra el que exponga el doble.
      - **No** compares `displayName` ni `name`: medido, **los dos valen
        `'View'`** en los dos estados. Solo la identidad discrimina.

      Rojo esperado, **ya medido**: hoy son el mismo objeto.

      Commit: `test(mobile): …  (R2)`

- [ ] **(2) Verde mínimo.** Borrar del `jest.mock('react-native-reanimated')`:
      - `:154` — `default: { ...actual.default, View },`
      - `:147-149` — el `const { View } = jest.requireActual<…>('react-native');`
        que queda **sin usar** (medido: es su único uso). Dejarlo produce un
        warning de `@typescript-eslint/no-unused-vars`.

      Ojo: **no** toques `withDelay`, `withRepeat`, `withSequence`, `withSpring`,
      `withTiming`, `useReducedMotion` ni `__esModule`. Los `with*` **no** son
      peso muerto (quitarlos pone 16 tests rojos).

      Commit: `test(mobile): …  (R2)`

- [ ] **(3) Refactor / verificación.** Fichero entero verde, delta **+2** sobre
      la base. `bunx eslint src/screens/home/index.test.tsx` sin warnings nuevos.

---

## R3 — #62 R8 intacto y todavía eficaz *(requisito de verificación, vía (b))*

No se escribe test nuevo. Se **prueba por mutación**, como declara
[[requirements]] §Vías de C4.

- [ ] **(1) Intacto.** Comprobar que el bloque de #62 R8 no cambió:
      ```bash
      git diff e4c9ea99..HEAD -- mobile-pet-tracker/src/screens/home/index.test.tsx \
        | grep -E '^[+-]' | grep -i 'skeleton dimensionado\|home-loading\|rounded-card'
      ```
      Lo único que puede aparecer son las líneas **nuevas** de R1. Ninguna línea
      `-` del rango `:1302-1323` original.

- [ ] **(2) Eficaz.** Sonda de mutación **sobre producción**, aplicada,
      medida y **revertida**:
      - mutar `mobile-pet-tracker/src/screens/home/index.tsx:372`, cambiando
        `h-12 w-full rounded-card` por otra forma (p.ej. `h-4 w-1/2 rounded-full`);
      - correr el fichero sin pipe → esperado **rojo, y que entre los rojos esté
        el `it` de #62 R8** (`reserva el espacio de carga con la forma de una Card`);
      - `git checkout -- mobile-pet-tracker/src/screens/home/index.tsx` y
        confirmar `git status --porcelain` limpio en producción.

      **La mutación NO se versiona.** No debe aparecer en ningún commit.

- [ ] **(3) Evidencia.** Pegar en
      `progress/impl_mobile-reanimated-double-dead-weight.md` el output literal
      de jest de la sonda (nombres de los tests rojos y el `expected`/`received`),
      no un resumen.

> **Si en (2) el rojo aparece sin mutación** —es decir, si #62 R8 se pone rojo
> por el simple hecho de haber quitado el doble— **para y devuelve el trabajo**.
> No restaures el mock y no ajustes la aserción de #62 R8. El protocolo entero
> está en [[requirements]] §Qué pasa si el test de #62 R8 se pone rojo, y
> requiere el **Gate 2** de §Aprobación.

---

## R4 — Registrar el inventario de gemelos *(requisito de verificación)*

- [ ] **(1) Escribir.** Añadir a `docs/conventions.md`, dentro de §Tests, una
      subsección corta (≈8-12 líneas) que registre lo que midió [[design]]
      §Gemelos. Debe nombrar al menos:
      - que `src/components/__tests__/pet-hero-header.test.tsx:71` tiene el
        **mismo** `default: { ...actual.default, View }` y es **también peso
        muerto** (36/36 verde al quitarlo), y que su comentario `:70` queda
        desmentido;
      - que `pet-hero-header.test.tsx:44-58` **sí** es load-bearing (4 rojos al
        quitarlo) y por tanto **no** es el mismo caso;
      - que los dobles de Reanimated de `theme-transition.test.tsx:18` y
        `weekly-activity-chart.test.tsx:58` son legítimos (no tocan
        `default.View`).

      **No** arregles ninguno de esos ficheros. Solo se registra.

- [ ] **(2) Verificar.** `grep -n "pet-hero-header" docs/conventions.md` devuelve
      la nota nueva.

- [ ] **(3)** Commit: `docs(mobile): registra los gemelos del doble de Skeleton (R4)`

---

## Cierre — entregables obligatorios del reporte

En `progress/impl_mobile-reanimated-double-dead-weight.md`, además de lo
habitual:

- [ ] **Los dos números exactos** (otra sesión los necesita para re-medir un gate
      suyo). Medidos **sin pipe**, y expresados también como delta contra
      `e4c9ea99`:

      1. **Recuento final de tests de `src/screens/home/index.test.tsx`**
         ```bash
         bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/f.log 2>&1; echo "EXIT=$?"
         grep -E '^Tests:|^Test Suites:' /tmp/f.log
         ```
         Base medida: **138**. Esperado: **140** (+2, uno por R1 y otro por R2).
         **Si no es 140, ese dato es el más importante del reporte**: dilo
         explícitamente y explica de dónde sale la diferencia.

      2. **Total de la suite móvil**
         ```bash
         rm -f .expo/types/router.d.ts
         bunx jest > /tmp/all.log 2>&1; echo "EXIT=$?"
         grep -E '^Tests:|^Test Suites:' /tmp/all.log
         ```
         Base medida: **77 suites / 1396 tests**, exit 0. Esperado:
         **77 suites / 1398 tests**, exit 0.

- [ ] **Confirmación de cero cambio de producción**:
      ```bash
      git diff --name-only e4c9ea99..HEAD -- 'mobile-pet-tracker/src/'
      ```
      Solo debe listar `mobile-pet-tracker/src/screens/home/index.test.tsx`.

- [ ] **Confirmación de que las zonas prohibidas no se tocaron**: que el diff del
      fichero no contiene líneas `-` en `:3350-3363`, `:3790` ni `:3835`
      (números de la base; tras el borrado de la cabecera bajan 23 líneas).

- [ ] **`design-drift.test.ts` verde**:
      `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts` → exit 0.
      Base medida: 41/41.

- [ ] **Typecheck y lint** tras `rm -f .expo/types/router.d.ts`:
      `bunx tsc --noEmit` y `bunx eslint src/screens/home/index.test.tsx`, los dos
      sin warnings nuevos.

- [ ] **`traceability.md`** con las dos últimas columnas rellenas para R1-R4.

> **No se añade ninguna clave de copy.** No toques `src/i18n/catalog.ts` ni
> `src/providers/language-provider.test.tsx`; el candado de longitud del catálogo
> **no cambia** en esta feature.
