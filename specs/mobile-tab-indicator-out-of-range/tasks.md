---
feature: "mobile-tab-indicator-out-of-range"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-tab-indicator-out-of-range]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio** (C4 de `CHECKPOINTS.md`): el (1) de cada
> tarea es su propio commit `test(tab-indicator): … (Rn)` y se empuja en **rojo**;
> el (2) es el commit `fix(tab-indicator): …` que lo pone verde. Un solo commit
> con test + implementación + docs incumple C4 — pasó en #19 y no se repite.
> **Ningún rojo vale por `ReferenceError`** de un helper o fixture que todavía no
> existe (C4, cuarto punto): por eso §T0 va antes que R1 y es un commit **verde**.
>
> **El orden de abajo no es negociable.** [[design]] §D8 explica por qué cada paso
> deja el componente coherente y hace que el rojo del siguiente sea real. Si se
> implementa el arreglo entero en el verde de R1, los tests de R2, R3 y R4 nacen
> verdes y la feature queda sin historial rojo→verde para sus dos sitios.
>
> Todas las rutas son relativas a `mobile-pet-tracker/` salvo indicación expresa.
> `<scope>` de los commits: **`tab-indicator`**.

---

## §0 — Antes de la primera tarea

- [ ] Cargar las skills de Expo que la carta exige (`docs/ui-guidelines.md`
      §Skills): `expo-overview` primero y, derivadas de ella, **`expo-router`**
      (el componente es el `tabBar` de un `<Tabs>` de Expo Router) y
      **`expo-animation`** (la burbuja anima con `withSpring` de Reanimated). En
      Codex CLI las sirve el plugin `expo`. No se carga
      `appllama-app-design-skill`: no hay pantalla nueva ni rediseño.
- [ ] Leer `docs/ui-guidelines.md` entero — en particular §Decisiones fijas 3
      (grep-clean), §Decisiones fijas 12 (escala de radios) y §Animación.
- [ ] Leer [[requirements]] §0 (verificación de premisas: **las líneas que da la
      entrada de `feature_list.json` están corridas**, las buenas están ahí) y §1
      (decisiones cerradas D1-D5).
- [ ] Leer [[design]] §D5 (los tres *hunks* exactos), §D7 (fixture) y §D8 (orden).
- [ ] Si existe `mobile-pet-tracker/.expo/types/router.d.ts`, **borrarlo** antes
      de tocar código: está gitignorado, se queda obsoleto y rompe el `typecheck`
      con rutas fantasma. Se regenera solo.
- [ ] `./init.sh` verde desde la raíz **antes** de empezar, para tener la línea
      base. Comprobar antes con `pgrep -af init.sh` que no hay otro `init.sh`
      corriendo en otro worktree: comparten el Postgres de docker y se pisan.
- [ ] Confirmar la base: `git merge-base --is-ancestor 072cff40 HEAD`. Todas las
      referencias de línea de esta spec son de ese commit.

---

## §T0 — Fixture y dobles de test (**verde**, sin tocar producción)

> Es el **sujeto** de R1..R5: los fixtures y helpers que sus tests asertan tienen
> que existir antes que ellos. Este commit no cambia producción y deja la suite
> **verde** — no es un rojo y no debe intentar serlo.

- [ ] (1) En `src/components/__tests__/floating-tab-bar.test.tsx`, añadir de
      forma **aditiva** lo de [[design]] §D7: `alertsRoute`, `routesWithAlerts`,
      `routesAlertsFirst`, el segundo parámetro `stateRoutes` (con `routes` por
      defecto) en `tabBarProps` y `renderTabBar`. **No** renombrar `routes` ni
      tocar ninguna llamada existente.
- [ ] (2) Añadir el doble de `reicon-react-native` copiando el patrón de
      `src/screens/home/index.test.tsx:100-122`, con `testID` `icon-tab-home`,
      `icon-tab-map`, `icon-tab-health`, `icon-tab-food`, `icon-tab-profile`.
- [ ] (3) Copiar el helper `elementChild` de
      `src/screens/alerts/index.test.tsx:94-101`.
- [ ] (4) `bun test src/components/__tests__/floating-tab-bar.test.tsx` verde con
      los **siete** `describe` existentes **sin editar ninguno**. Commit
      `test(tab-indicator): parametriza el fixture de rutas y dobla los iconos`.
- [ ] (5) Aviso de nombres: los `describe` que ya viven en ese fichero se llaman
      `R1`…`R5`, `R7`, `R8` (siete, sin `R6`) y sus R-ids son de la feature que
      los creó, **no** de #91. Por eso los cinco nuevos van prefijados `#91 R…`.
      No renumerar ni renombrar los viejos: el prefijo es lo que los separa.

---

## R1 — Una ruta fuera de `TABS` no monta la burbuja

- [ ] (1) Escribir test que falla para R1 —
      `src/components/__tests__/floating-tab-bar.test.tsx`,
      `describe('#91 R1: una ruta fuera de TABS no monta la burbuja', …)` con
      temporizadores falsos (copiar el `beforeEach`/`afterEach` del `describe`
      "R3" existente, `:139-149`). Dos `it`:
      (a) `renderTabBar(5, routesWithAlerts)` → `layout` de 360 → avanzar 300 ms →
      `expect(screen.queryByTestId('tab-indicator')).not.toBeOnTheScreen()`;
      (b) `renderTabBar(2, routesWithAlerts)` → `layout` de 360 → avanzar 300 ms →
      burbuja presente con `translateX: 137.6` → `rerender` con
      `tabBarProps(5, routesWithAlerts)` → avanzar 300 ms → burbuja ausente.
      **Rojo esperado**: hoy la burbuja está montada en `translateX: 344`.
- [ ] (2) Implementación mínima que lo pasa — `activeTabIndex` ([[design]] §D5a)
      y el `&& activeTabIndex >= 0` de la condición de render (`:137`). **Nada
      más**: los dos sitios siguen escribiendo con `state.index` en este paso.
- [ ] (3) Refactor con tests verdes.

## R2 — El primer layout coloca la burbuja por el índice de `TABS`

- [ ] (1) Escribir test que falla para R2 —
      `describe('#91 R2: el primer layout coloca la burbuja por el índice de TABS', …)`:
      `renderTabBar(2, routesAlertsFirst)` (activa `map`) → `layout` de 360 →
      avanzar 300 ms → `toHaveAnimatedStyle({ transform: [{ translateX: 68.8 }] })`.
      **Rojo esperado**: `137.6`.
- [ ] (2) Implementación mínima que lo pasa — **solo** la escritura de
      `handleLayout` ([[design]] §D5c): `if (activeTabIndex >= 0) translateX.set(activeTabIndex * nextTabWidth);`.
      La escritura del ref sigue con `state.index` en este paso.
- [ ] (3) Refactor con tests verdes.

## R3 — El cambio de ruta desliza la burbuja al índice de `TABS`

- [ ] (1) Escribir test que falla para R3 —
      `describe('#91 R3: el cambio de ruta desliza la burbuja al índice de TABS', …)`:
      `renderTabBar(2, routesAlertsFirst)` → `layout` de 360 → avanzar 300 ms →
      `rerender` con `tabBarProps(3, routesAlertsFirst)` (activa `health`) →
      avanzar 300 ms → `translateX: 137.6`. **Rojo esperado**: `206.4`.
- [ ] (2) Implementación mínima que lo pasa — **solo** el destino del `withSpring`
      del `useEffect` pasa a `activeTabIndex * tabWidth`, y `activeTabIndex`
      sustituye a `state.index` en el array de dependencias.
- [ ] (3) Refactor con tests verdes.

## R4 — Al volver de una ruta ajena, la burbuja aparece ya colocada

- [ ] (1) Escribir test que falla para R4 —
      `describe('#91 R4: al volver de una ruta ajena la burbuja aparece ya colocada', …)`:
      `renderTabBar(1, routesWithAlerts)` (activa `map`) → `layout` de 360 →
      avanzar 300 ms (burbuja en `68.8`) → `rerender` con
      `tabBarProps(5, routesWithAlerts)` → avanzar 300 ms → burbuja ausente →
      `rerender` con `tabBarProps(2, routesWithAlerts)` → **sin avanzar
      temporizadores** → `translateX: 137.6` → avanzar 300 ms → sigue en `137.6`.
      **Rojo esperado**: el valor inmediato es el de la ranura vieja, no `137.6`.
- [ ] (2) Implementación mínima que lo pasa — el resto de [[design]] §D5: el ref
      y la guarda pasan a `activeTabIndex` (con el orden de declaraciones de
      §D5a), el `return` cuando `activeTabIndex < 0` tras registrar el ref, el
      `previousIndex < 0 ? nextX : withSpring(nextX, TAB_INDICATOR_SPRING)`, y la
      escritura del ref en `handleLayout` fuera del `if`.
- [ ] (3) Refactor con tests verdes. El componente queda en su forma final: releer
      [[design]] §D5 y comprobar que coincide línea a línea.

## R5 — Con una ruta ajena, las cinco celdas quedan inactivas y siguen navegando

> **Requisito de verificación** (C4, tercer punto, vía **(b)**), declarado antes
> del handoff en [[requirements]] §R5: canda código **ya correcto**, así que no
> hay rojo natural. El rojo es la **mutación de producción M3**, versionada en el
> commit (1) y revertida en el (2). Mutar el doble de `reicon` **no vale**.

- [ ] (1) Escribir el test y **versionar la mutación M3** en el mismo commit —
      `describe('#91 R5: con una ruta ajena las cinco celdas quedan inactivas y siguen navegando', …)`
      (sin temporizadores falsos; `beforeEach` como el `describe` "R7" existente,
      `:228-233`), y en `floating-tab-bar.tsx:164`
      `const isActive = activeTabIndex < 0 || activeRouteName === name;`.
      El test: `renderTabBar(2, routesWithAlerts)` (activa `health`) → capturar
      `activeColor` de `icon-tab-health` y `mutedColor` de `icon-tab-map`,
      `expect(activeColor).not.toBe(mutedColor)` → `rerender` con
      `tabBarProps(5, routesWithAlerts)` (activa `alerts`) → para **cada una** de
      las cinco celdas: `accessibilityState: { selected: false }`, dos hijos vía
      `elementChild`, el hijo 0 con `weight: 'Outline'` y `color: mutedColor`, el
      hijo 1 con `className` `'text-2xs font-semibold text-muted'` y el texto de
      la etiqueta en español → pulsar `tab-home` y comprobar `mockEmit` con
      `{ type: 'tabPress', target: 'home-1', canPreventDefault: true }` y
      `mockNavigate` con `'home'`. Commit
      `test(tab-indicator): canda las celdas con una ruta ajena, con mutación M3 (R5)`.
      **Sin cifras absolutas de color**: solo la comparación interna.
- [ ] (2) **Revertir M3** (volver a `const isActive = activeRouteName === name;`)
      y comprobar verde. Commit `fix(tab-indicator): revierte la mutación M3 (R5)`.
- [ ] (3) Refactor con tests verdes.
- [ ] (4) Si el árbol renderizado no diera exactamente dos hijos por celda,
      **parar y reportarlo** en `progress/impl_mobile-tab-indicator-out-of-range.md`
      en vez de ajustar la aserción al número que salga: es un candado, no una
      medición.

## R6 — Nada más se mueve

- [ ] (1) No hay test nuevo. Ejecutar `./init.sh` desde la raíz del repo y dejar
      la suite móvil completa verde (`bun test`, `typecheck`, `lint`).
- [ ] (2) Comprobar **una por una** las filas de la tabla de candados de
      [[requirements]] §R6 y anotar el resultado (delta 0 en todas) en
      `progress/impl_mobile-tab-indicator-out-of-range.md` §R6. Incluye
      explícitamente la longitud del catálogo de
      `src/providers/__tests__/language-provider.test.tsx:41`: **no se le suma
      ningún término**.
- [ ] (3) `git diff --stat 072cff40..HEAD -- mobile-pet-tracker/` debe listar
      exactamente los **dos** ficheros de [[design]] §Archivos afectados. Si
      aparece un tercero, explicar por qué antes de seguir.

## R7 — Prueba de mutación documentada, una por sitio

- [ ] (1) Sobre el árbol ya arreglado, aplicar **M1** ([[requirements]] §R7:
      el destino del `withSpring` vuelve a `state.index * tabWidth`), correr
      `bun test src/components/__tests__/floating-tab-bar.test.tsx`, copiar el
      fallo de `#91 R3` y **revertir**.
- [ ] (2) Aplicar **M2** (la escritura de `handleLayout` vuelve a
      `state.index * nextTabWidth`), correr, copiar el fallo de `#91 R2` y
      **revertir**. Cada mutación se comprueba **sola**, con la otra revertida.
- [ ] (3) Escribir la evidencia de las tres mutaciones (M1, M2 y la M3 ya
      versionada en el rojo de R5) en
      `progress/impl_mobile-tab-indicator-out-of-range.md` §R7: diff de una línea,
      test que se pone rojo y mensaje de fallo. Commit
      `docs(tab-indicator): evidencia de mutación M1-M3 (R7)`.
- [ ] (4) Confirmar con `git status` que **ninguna mutación quedó en el árbol**.

## R8 — Gate humano: prueba de humo en dev build de Android

> No lo cierra ninguna IA.

- [ ] (1) Dejar escrito el guion en
      `progress/impl_mobile-tab-indicator-out-of-range.md` §R8 con los cuatro
      puntos (a)-(d) de [[requirements]] §R8.
- [ ] (2) El humano lo ejecuta en el **dev build de Android** (no Expo Go) y
      anota el resultado.
- [ ] (3) Rellenar la fila de R8 en [[traceability]] con el veredicto humano.

---

## Cierre

- [ ] [[traceability]] sin ninguna fila "pendiente" (C5).
- [ ] `progress/impl_mobile-tab-indicator-out-of-range.md` con §R6, §R7 y §R8.
- [ ] `./init.sh` verde desde la raíz.
- [ ] Rama `feature/91-mobile-tab-indicator-out-of-range` empujada. **Ningún
      agente mergea**: el PR lo abre quien coordina y lo mergea el humano.
- [ ] **No rebasar** después de escribir los hashes en [[traceability]]: un
      rebase los invalida (lección de #87). Si hubiera que rebasar, reapuntar
      cada hash y verificar con `git merge-base --is-ancestor`.
