---
feature: "mobile-food-links-without-profile"
status: approved      # draft | approved
tags: [mobile, nutrition, food, spec]
---

# Requisitos — [[mobile-food-links-without-profile]] (#233)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones, las alternativas descartadas y la batería
> de mutaciones. Todas las rutas de código son relativas a `mobile-pet-tracker/`
> salvo que se diga otra cosa.

**Hallazgo.** Lo dijo el humano en el smoke G2 del 2026-11-03
(`progress/plan_mejoras-smoke-2026-11-03.md` §1), con estas palabras:
«En Nutricion sin Perfil, no deben de aparecer Horario de comidas y Historial
de comidas ya que aun no se ha registrado un perfil nutricional». En
`src/screens/food/index.tsx`, `FoodScreen` pinta `links` (testID `food-links`,
con `meal-schedule-link` y `meals-history-link`) como última pieza del bloque
`selectedPetId ? (…)`, sin mirar si existe perfil nutricional:
`{loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links}`.
Quien aún no ha creado su perfil ve dos filas que llevan a pantallas vacías.

**Vocabulario.**

- «Con perfil» es una mascota cuyo perfil nutricional existe. La pantalla lo
  sabe por dos caminos, y solo por ellos: el plan cargado (`plan.data.kind ===
  'ok'`, es decir `loadedPlan !== null`), porque el backend solo genera un plan
  con perfil existente
  (`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`
  lanza `NutritionProfileRequiredError` sin perfil), o la consulta del perfil
  resuelta en `kind: 'ok'` (`profile.data?.kind === 'ok'`, consulta que
  `FoodScreen` solo habilita con `planNotFound`).
- «Sin perfil» es la consulta del perfil resuelta en `kind: 'not-found'`.
- «Sin confirmar» es todo lo demás: el plan pendiente, el plan en `error`,
  `unreachable` o `missing-config`, el plan en `not-found` con el perfil
  pendiente o con el perfil en `error`, `unreachable` o `missing-config`.
- Los enlaces son `food-links`, `meal-schedule-link` («Horario de comidas») y
  `meals-history-link` («Historial de comidas»). «No se pintan» significa que
  los nodos no existen en el árbol, ni siquiera ocultos a accesibilidad.

**Decisión D1 (la fija esta spec).** Los enlaces se pintan solo con perfil
confirmado y se quitan en sin perfil y en sin confirmar, para cualquier rol.
Es más estricto que la letra del plan, que habla de `showProfileEmpty`
(solo dueño y perfil `not-found`): la frase del humano es «sin Perfil», sin
rol, y pintar los enlaces mientras la consulta está pendiente deja un parpadeo
de dos filas que luego desaparecen. Coste aceptado: con el plan en error, el
usuario no ve los enlaces hasta reintentar (`food-plan-retry`). No hay copy
nuevo ni estilo nuevo. Está en la lista de decisiones abiertas del informe de
la spec.

**De dónde sale el perfil.** De dos consultas que `FoodScreen` ya hace y no
cambian: `plan` (`useQuery` con `nutritionKeys.plan(selectedPetId ?? '')`) y
`profile` (`useQuery` con `nutritionKeys.profile(selectedPetId ?? '')`,
`enabled: planNotFound`). El cuestionario
(`src/screens/nutrition-questionnaire/index.tsx`) invalida las dos claves al
crear el perfil, así que los enlaces aparecen solos al volver a Nutrición. En
los tests, el estado sale de `mockGetNutritionPlan` y `mockGetNutritionProfile`
del propio fichero de test.

## Requisitos funcionales

- **R1**: WHEN el perfil nutricional de la mascota seleccionada resuelve en
  `kind: 'not-found'` (con el plan en `not-found`) THE SYSTEM SHALL no pintar
  `food-links`, `meal-schedule-link` ni `meals-history-link`, ni el texto
  «Horario de comidas» ni «Historial de comidas», sea cual sea el rol
  (`owner`, `family`, `walker`, `vet`).
  - Ancla, en `src/screens/food/index.tsx` (las cifras son las del árbol tras
    el cambio; `origin/dev` 426ffd32 da el valor «antes»):
    - `grep -cF "const hasProfile = loadedPlan !== null || (planNotFound && profile.data?.kind === 'ok');"`:
      antes 0, después 1
    - `grep -cF "{hasProfile ? (loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links) : null}"`:
      antes 0, después 1
    - `grep -cF "{loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links}"`:
      antes 1, después 0 (la línea vieja desaparece entera; con
      `grep -cF hasProfile` = 2 a secas no basta, porque una declaración
      muerta también lo cumple)
    - `grep -cF "profile.data"`: antes 2, después 3
  - Test: `it.each` en
    `describe('#233 R1 a R5: los enlaces de comidas dependen del perfil nutricional')`
    de `src/screens/food/index.test.tsx`. Título
    `'#233 R1 con el rol %s y sin perfil no hay enlaces de comidas'`, cuatro
    filas: `'owner'`, `'family'`, `'walker'`, `'vet'`.
    - Cada fila hace `mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: role })] })`,
      `mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' })` y
      `mockGetNutritionProfile.mockResolvedValue({ kind: 'not-found' })`.
    - Cada fila hace `await renderFood();` y espera un nodo positivo del
      escenario: `await screen.findByTestId('food-create-profile')` con
      `owner` y `await screen.findByTestId('food-plan-empty')` con los otros
      tres roles. Ninguno de los dos existe mientras el perfil está pendiente
      (`profilePending` los oculta), así que con la espera ya hay veredicto
      de perfil. Es la regla de `docs/conventions.md` §Esperas: la ausencia se
      ancla a un nodo positivo.
    - Después, `queryByTestId` con `{ includeHiddenElements: true }` da `null`
      para `food-links`, `meal-schedule-link` y `meals-history-link`, y
      `queryByText('Horario de comidas', { includeHiddenElements: true })` y
      `queryByText('Historial de comidas', { includeHiddenElements: true })`
      dan `null`. La opción es obligatoria: sin ella RNTL no ve un nodo oculto
      a accesibilidad y el `null` sería ciego a una fila pintada con
      `display: 'none'` (M6).
    - Hoy es rojo en las cuatro filas: los enlaces se pintan a todos.

- **R2**: WHILE el estado del perfil no está confirmado porque el plan o el
  perfil aún no han resuelto THE SYSTEM SHALL no pintar los enlaces. Cubre dos
  estados: el plan pendiente con la mascota ya seleccionada, y el plan
  resuelto en `not-found` con la consulta del perfil pendiente.
  - Ancla: la misma de R1. El `hasProfile` falso sale de que
    `plan.data?.kind` es `undefined` en el primer estado (`loadedPlan` es
    `null` y `planNotFound` es `false`) y de que `profile.data?.kind` es
    `undefined` en el segundo.
  - Test A (enmienda de un `it` existente): en
    `describe('R5: plan del día con horarios y warnings')`, el
    `it('shows a skeleton and schedule link while the plan is pending')`
    pasa a llamarse
    `it('shows a skeleton and schedule link while the plan is pending (enmendado por #233 R2)', …)`.
    Se conserva el texto original del título y se le añade el sufijo. En el
    `waitFor` se quita `expect(screen.getByTestId('meal-schedule-link')).toBeVisible();`
    y se ponen en su lugar dos aserciones, en el mismo callback:
    `expect(screen.queryByTestId('meal-schedule-link', { includeHiddenElements: true })).toBeNull();` y
    `expect(screen.queryByTestId('meals-history-link', { includeHiddenElements: true })).toBeNull();`.
    Las otras cuatro aserciones del `waitFor` (`food-plan-skeleton`,
    `food-meals-skeleton` con `h-56`, `food-schedule-skeleton` nulo) se
    conservan tal cual.
    - La intención del `it` (esqueleto del plan mientras carga, sin esqueleto
      del horario) no se debilita. Lo que cambia es la mitad que decía «el
      enlace al horario está visible», que ahora dice lo contrario.
    - El ancla positiva ya está en el callback: la aserción
      `queryByTestId('food-schedule-skeleton')` nula solo se cumple cuando
      `waitingForPetSelection` es `false`, es decir, con la mascota ya
      seleccionada y el plan pendiente. Mientras no se cumpla, el `waitFor`
      reintenta el callback entero, así que los dos `null` nuevos no pueden
      pasar en el primer render (donde los enlaces ni existen).
  - Test B: `it('#233 R2 con el plan resuelto y el perfil pendiente no hay enlaces de comidas', …)`
    en el `describe` de R1.
    - `mockListPets` da `[makePet()]`; `mockGetNutritionPlan` resuelve
      `{ kind: 'not-found' }`; `mockGetNutritionProfile.mockReturnValue(…)` da
      una promesa que el test resuelve a mano, con tipo
      `Promise<Awaited<ReturnType<typeof getNutritionProfile>>>` (no se añade
      ningún `import`).
    - Tras `await renderFood();`, espera
      `await waitFor(() => expect(mockGetNutritionProfile).toHaveBeenCalledTimes(1));`.
      Esa espera es una **excepción nombrada** a §Esperas, y es la única de la
      feature: «plan resuelto y perfil pendiente» no tiene ningún nodo propio
      en el árbol (el esqueleto del plan es el mismo que con el plan
      pendiente), y `FoodScreen` solo habilita la consulta del perfil con
      `planNotFound`. Que `getNutritionProfile` se haya llamado es la
      observación del propio estado, y el `it` termina en una transición
      positiva (siguiente punto) que lo cierra.
    - Con la promesa sin resolver: `food-plan-skeleton` existe,
      `food-plan-empty` y `food-create-profile` no existen
      (`includeHiddenElements: true`), y `food-links`, `meal-schedule-link` y
      `meals-history-link` no existen.
    - Se resuelve la promesa con el perfil `ok` (el mismo literal del
      `beforeEach` raíz del fichero) dentro de `await act(async () => { … })`
      y `await screen.findByTestId('food-plan-empty')`. Después
      `food-links` y los dos enlaces sí existen: la transición prueba que el
      `null` anterior era el estado pendiente y no un `it` ciego.
    - Hoy es rojo: los enlaces se pintan desde el primer render con mascota.

- **R3**: IF el plan resuelve en `error`, `unreachable` o `missing-config`, o
  el plan en `not-found` y el perfil en `error`, `unreachable` o
  `missing-config`, THEN THE SYSTEM SHALL no pintar los enlaces y SHALL
  conservar el aviso de error y su botón de reintento donde están.
  - Ancla: la misma de R1. Con perfil en error, `profile.data?.kind === 'ok'`
    es `false`; con el plan en error, `loadedPlan` es `null` y `planNotFound`
    es `false`.
  - Test: `it.each` en el `describe` de R1, título
    `'#233 R3 con $name no hay enlaces de comidas'`, tres filas
    `{ name, plan, profile, anchor }`:
    - `'plan con error'`: plan `{ kind: 'error' }`, perfil por defecto, ancla
      `food-plan-error`.
    - `'plan sin red'`: plan `{ kind: 'unreachable', message: 'network down' }`,
      perfil por defecto, ancla `food-plan-error`.
    - `'perfil con error'`: plan `{ kind: 'not-found' }`, perfil
      `{ kind: 'error' }`, ancla `food-plan-empty` (con el perfil en error
      `FoodScreen` pinta el vacío del plan: `profilePending` y
      `showProfileEmpty` son `false`).
    - Cada fila espera `await screen.findByTestId(anchor)` y comprueba los
      mismos cinco `null` de R1 (tres testID y dos textos, con
      `includeHiddenElements: true`). Las dos filas de plan comprueban además
      que `food-plan-retry` existe (el aviso no se toca).
    - `missing-config` del plan o del perfil comparte rama con `error` en
      `FoodScreen` y en `hasProfile`: no tiene fila propia.
    - Hoy es rojo en las tres filas.

- **R4**: WHEN el perfil nutricional resuelve en `kind: 'ok'` y la mascota no
  tiene plan (plan en `not-found`) THE SYSTEM SHALL pintar `food-links` con
  `meal-schedule-link` y `meals-history-link` en ese orden, sin envolver en
  `RiseIn`, después del vacío del plan.
  - Ancla: la de R1. La rama `planNotFound && profile.data?.kind === 'ok'` del
    `hasProfile` y el `: links` de la línea nueva.
  - Test: este requisito **nace verde**, y se prueba con un `it` nuevo más los
    existentes que siguen verdes sin edición.
    - Nuevo: `it('#233 R4 con perfil y sin plan los enlaces se pintan sin RiseIn', …)`
      en el `describe` de R1. Plan `{ kind: 'not-found' }` y
      `mockGetNutritionProfile.mockResolvedValue` con el literal `ok` del
      `beforeEach` raíz, puesto de forma explícita en el `it` para que no
      dependa del valor por defecto. Espera
      `await screen.findByTestId('food-plan-empty')`. Después:
      `food-links` existe y `food-links.children` mapeados a su `testID` son
      `['meal-schedule-link', 'meals-history-link']`;
      `riseDelayOf(screen.getByTestId('food-links'))` es `undefined`;
      `meal-schedule-link-title` dice «Horario de comidas» y
      `meals-history-link-title` dice «Historial de comidas».
    - Existentes, sin edición, que también lo prueban:
      `describe('R5: plan del día con horarios y warnings')` ›
      `it('shows a graceful empty plan and keeps the schedule link')`;
      `describe('#155 R9: sin plan de comidas, Pingo enseña el cuenco')` ›
      `it('queda en el sitio del vacío que sustituye (enmendado por #200 R9) (enmendado por #222 R9)')`;
      `describe('#200 R10: entrada escalonada de Nutrición')` ›
      `it('#200 R10: sin plan los enlaces no entran con RiseIn')`;
      `it('#209 R19: owner con perfil y sin plan ve el vacío actual')`.
      Esos cuatro esperan `food-plan-empty*`, que solo aparece con el perfil
      resuelto, y en esa misma pasada de render `hasProfile` ya es
      verdadero: siguen verdes porque los enlaces nacen con el vacío.
    - Se ponen rojos con M2 (`hasProfile` sin la rama del perfil): el `it`
      nuevo y los tres primeros existentes.

- **R5**: WHEN el plan de la mascota seleccionada está cargado (`kind: 'ok'`)
  THE SYSTEM SHALL pintar los enlaces envueltos en `RiseIn` con `delayMs={200}`
  sin consultar el perfil nutricional.
  - Ancla, en `src/screens/food/index.tsx`, sin cambio antes/después:
    - `grep -cF "RiseIn delayMs={200}"` = 1
    - `grep -cF "enabled: planNotFound,"` = 1 (la consulta del perfil sigue
      deshabilitada con el plan cargado)
    - `grep -cF 'testID="food-links"'` = 1 (lo exige `src/__tests__/tab-headers-canvas.test.ts`
      #222 R14 con el literal `testID="food-links"`)
    - `grep -cF "const links = ("` = 1 y `grep -cF "{links}"` = 1 (los enlaces
      se declaran una vez y se montan en una sola línea)
  - Test: `it('#233 R5 con plan cargado los enlaces entran con RiseIn aunque el perfil no responda', …)`
    en el `describe` de R1. Nace verde.
    - `mockGetNutritionPlan` resuelve `{ kind: 'ok', plan: makePlan() }` y
      `mockGetNutritionProfile.mockResolvedValue({ kind: 'not-found' })`.
    - Espera `await screen.findByTestId('food-plan-card')`. Después:
      `food-links` existe, `riseDelayOf(screen.getByTestId('food-links'))` es
      `200`, `meal-schedule-link` y `meals-history-link` existen, y
      `expect(mockGetNutritionProfile).not.toHaveBeenCalled()` (esa
      aserción va después del nodo positivo y mide el efecto de
      `enabled: planNotFound`, no es una espera).
    - Atrapa la mutación que quita la rama `loadedPlan !== null ||` del
      `hasProfile` (M9) y la que quita el `RiseIn` (M7), y fija que el perfil
      no se consulta con el plan cargado.
  - Existentes que también lo prueban, sin edición:
    `describe('#200 R10: entrada escalonada de Nutrición')` › la fila
    `food-links` del `it.each` `'#200 R10: cada pieza entra con el retardo del canvas (%s)'`;
    `describe('#200 R9: enlaces del canvas')` (los dos `it.each`);
    `it('#200 R11: las piezas siguen el orden del canvas')`;
    `describe('#105 R14: Food opens served meals history')`;
    `describe('#65 R17: …')`; `describe('R6: aiExplanation nullable con gracia')` ›
    `it('omits the AI card without leaving a gap when the explanation is null')`.

- **R6**: THE SYSTEM SHALL limitar el cambio de producción a dos líneas
  añadidas y una quitada en `src/screens/food/index.tsx`, sin copy, clase,
  `testID` ni estilo nuevos, y sin tocar `src/screens/food/ai-explanation.tsx`.
  - Ancla (desde la raíz del repo, tras `git fetch origin`):
    - `git diff --numstat $(git merge-base HEAD origin/dev) -- mobile-pet-tracker/src/screens/food/index.tsx`
      da exactamente `2<TAB>1<TAB>mobile-pet-tracker/src/screens/food/index.tsx`.
      Con la línea de render sin cambiar da `1<TAB>0` (M1) y con la
      declaración sin añadir da `1<TAB>1` (M5).
    - `git diff --stat $(git merge-base HEAD origin/dev) -- mobile-pet-tracker/src/screens/food/ai-explanation.tsx`
      no da ninguna línea (el parpadeo de la tarjeta de IA es de #234).
    - `grep -cF "rounded-16" src/screens/food/index.tsx` = 3 (guarda
      `design-drift`: 2 de los enlaces y 1 del botón del perfil), antes y
      después.
    - `grep -cF "#233" src/screens/food/index.tsx` = 0 (la producción no cita
      el id; la regla `HEX_LITERAL` de `design-drift` exige ` R<n>` detrás).
    - `grep -cF "signOut(" src/screens/food/index.tsx` = 0 (`screenSignOutCalls`
      de `design-drift`).
  - Test: ninguno nuevo. Lo cubren las guardas existentes
    (`src/__tests__/design-drift.test.ts`,
    `src/__tests__/consistency-classnames.test.ts`,
    `src/__tests__/tab-headers-canvas.test.ts`,
    `src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts`),
    que deben seguir verdes con delta 0 (ver «Guardas que no se mueven» en
    [[design]]), y los anclas de grep de este requisito.

- **R7**: THE SYSTEM SHALL acotar los cambios en `src/screens/food/index.test.tsx`
  a un único `describe` nuevo, colocado entre el
  `describe('#200 R10: entrada escalonada de Nutrición')` y el
  `describe('#222 R7: Encabezado solo para lectores de pantalla')`, y a la
  enmienda de R2, para que #234 (que edita el mismo fichero detrás) no choque
  ni arrastre sus `it`.
  - Ancla, en `src/screens/food/index.test.tsx`:
    - `grep -cF "describe('#233 R1 a R5: los enlaces de comidas dependen del perfil nutricional'"` = 1
    - `grep -cF "'#233 R"` = 6 (el título del `describe` y los cinco `it` y
      `it.each` de R1 a R5 que empiezan por `'#233 R`)
    - `grep -cF "(enmendado por #233 R2)"` = 1
    - `grep -noE '#233.{0,3}' src/screens/food/index.test.tsx | grep -vE '#233 R[1-5]'`
      no da ninguna línea (cada `#233` va seguido de ` R<n>`; un `#233` suelto
      en un título o comentario tumba `HEX_LITERAL`)
    - `git diff --numstat $(git merge-base HEAD origin/dev) -- mobile-pet-tracker/src/screens/food/index.test.tsx`
      da `<N><TAB>2<TAB>…`: dos líneas quitadas en total (el título del `it`
      enmendado y su aserción `toBeVisible` del enlace) y el resto son
      añadidos. Cualquier otra cifra en la segunda columna significa que se
      editó un `it` ajeno.
    - Los `import` y los `jest.mock` de la cabecera no cambian: el primer
      hunk de `git diff -U0` del fichero empieza después de la línea
      `const apiUrl = 'http://example.test/v1';`.
    - El `beforeEach` del `describe` nuevo hace `mockListPets.mockReset()` y
      `mockGetNutritionPlan.mockReset()` y vuelve a dar `[makePet()]` a
      `mockListPets`; no toca `mockGetNutritionProfile` (el `beforeEach` raíz
      del fichero ya le da el perfil `ok`). Cada `it` define sus propios
      mocks completos y no depende de otro `it`.
  - Test: ninguno. Es un candado de anclas y de no-edición. Si un `it` ajeno
    se pone rojo, se para y se anota en el informe de implementación, sin
    editarlo.

## Fuera de alcance

Cada viñeta trae su evidencia en el árbol de `origin/dev` (426ffd32).

- **El parpadeo de la tarjeta «Recomendación IA».** Es #234
  (`mobile-nutrition-ai-collapse-flicker`, enmienda #224 R6) y toca
  `src/screens/food/ai-explanation.tsx` y `src/screens/food/index.test.tsx`
  detrás de esta feature. #233 no la especifica ni la lee.
- **El vacío del plan y el CTA «Crear perfil nutricional».** `food-plan-empty`,
  `food-profile-empty` y `food-create-profile` (decisión #209 R19) no cambian.
  Tampoco quién ve cada uno.
- **Backend.** No se toca. El plan ya exige perfil en el servidor.
- **Las pantallas `meal-schedule` y `meals-history`.** Siguen accesibles por
  su ruta (`/meal-schedule`, `/meals-history`); #233 solo quita los puntos de
  entrada de Nutrición sin perfil. Otras entradas (por ejemplo Inicio) no se
  miran aquí.
- **Copy.** Ninguno nuevo y ninguno retirado. `food.mealSchedule`,
  `food.mealsHistory`, `food.mealScheduleLinkSubtitle` y
  `food.mealsHistoryLinkSubtitle` siguen en `src/i18n/catalog.ts` con su uso
  real (el usuario con perfil los ve). `ui-copy-table.ts` y `SCREEN_FILES`
  no cambian. No hay gate G1.
- **Artboard.** Ninguno: el canvas dibuja los enlaces con plan cargado, y esa
  vista no cambia. Los estados sin perfil y sin confirmar no están dibujados
  como tales, igual que antes.
- **Los flakes conocidos de Nutrición (#200 R9 con 0 llamadas a `push` y
  #200 R10 con `food-links` antes del plan).** No son un requisito: R6 y R7
  no los miden. Por lectura del código, la causa común es que los enlaces
  existían antes de que el plan resolviera y luego se remontaban dentro de
  `RiseIn`; con #233 los enlaces nacen con el plan o con el perfil
  confirmado, así que el escenario desaparece. Es una inferencia, no una
  medición: la reducción del flake no es criterio de aceptación.
- **La enmienda de `docs/ui-guidelines.md`.** La Enmienda #200 de la carta
  dice (línea «sin plan los enlaces conservan su aparición sin RiseIn») algo
  que sigue siendo verdad para «con perfil y sin plan», pero deja de serlo
  para «sin plan y sin perfil». Esta spec no edita la carta; propone el texto
  al humano en la casilla opcional de Aprobación (G4). No bloquea la
  implementación.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-11-03; firma delegada del leader, mandato del humano 2026-10-23 ampliado 2026-11-03) ← gate obligatorio antes de implementar
      (firma delegada del leader, mandato 2026-10-23 ampliado 2026-11-03; la
      pone el leader en su commit de firma tras la checklist de
      `progress/plan_canvas-parity-2026-10-23.md` §4)
- [ ] Enmienda #233 de `specs/mobile-canvas-nutrition/requirements.md`
      aprobada por humano (la casilla vive en esa spec, al final, en
      «Enmienda #233»; marcarla aquí es solo un recordatorio del gate)
- [ ] (Opcional, no bloquea) Enmienda G4 de `docs/ui-guidelines.md`, Enmienda
      #200, línea «sin plan los enlaces conservan su aparición sin RiseIn»:
      añadir «y con perfil nutricional confirmado; sin perfil no se pintan»
      (#233 R1). El humano decide si la carta lo recoge; la spec es
      implementable sin ella.
- [x] Smoke de #233 en dev build por el humano (fecha: 2026-11-04): con una mascota
      sin perfil nutricional, abre Nutrición y ve «Aún no hay perfil
      nutricional» con el botón «Crear perfil nutricional» y no ve «Horario de
      comidas» ni «Historial de comidas»; crea el perfil con el cuestionario,
      vuelve a Nutrición y ahora sí ve las dos filas. El paso reproduce el
      fallo original: antes de #233 las dos filas aparecían bajo el vacío. Va
      en `progress/smoke_mejoras-smoke.md` (lo añade el leader al mergear). No
      bloquea tareas; bloquea `done`.
