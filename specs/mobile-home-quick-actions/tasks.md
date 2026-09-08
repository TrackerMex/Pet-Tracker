---
feature: "mobile-home-quick-actions"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec]
---

# Tareas — [[mobile-home-quick-actions]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Orden obligatorio**:
> `R1 → R2 → R3 → R4 → R5 → R6 → R7 → R8 → R9 → R10 → R12 → R11 → R13 → R14 → R15`.
>
> Tres cosas de ese orden no son negociables:
> - **R1 va primero** porque la tabla `QUICK_ACTIONS` es lo que hace posibles
>   todos los demás rojos: sin ella, cruzar un icono o un destino no es una
>   edición de una línea de producción y la prueba de mutación de R15b no se
>   puede plantar donde debe.
> - **R11 (copy) va casi al final** a propósito, igual que en #69: el delta de
>   las filas de `R3_HOME` solo se puede medir cuando ya existen los usos.
>   Ojo: R1 necesita las **claves** desde el principio, así que el commit de R1
>   añade las cuatro entradas al catálogo (si no, el `t()` no compila); lo que
>   se difiere a R11 es el **registro** —filas de `ui-copy-table.ts`, tabla de
>   `specs/mobile-ui-language/design.md`— y sus dos deltas de candado.
> - **R7 exige tocar el doble de `reicon` antes de escribir el test de R4**,
>   porque `Weight` está hoy nombrado por su sitio de uso y el tile 1 lo
>   reutiliza. Ese cambio es de fichero de test y **no cuenta como rojo**: el
>   rojo lo pone la producción.
>
> **Commits test-primero, obligatorio** (`CHECKPOINTS.md` C4). Cada requisito
> deja **al menos dos commits**: uno con el test rojo y otro con la
> implementación que lo pone verde. Un único commit con test + implementación +
> docs incumple C4 y el reviewer lo rechaza; ya pasó en #19. El mensaje sigue
> `docs/conventions.md` §Commits:
> `feat(mobile-home-quick-actions): <desc> (R1)`.
>
> **Ningún rojo puede fallar por `ReferenceError`** de un helper de test que
> todavía no existe (C4). El fichero de tests ya existe con sus mocks y sus
> factorías; lo que falta es la rejilla, no el andamio.
>
> **Ningún rojo puede plantarse en un mock** (C4, quinto punto, añadido el
> 2026-09-08 tras #69). Cuando un candado se añade sobre código **ya correcto**
> —R5 forma, R6, R8, R9, R13—, el rojo legítimo es la **mutación de
> producción**: se versiona en el commit rojo y se revierte en el verde.
> Intercambiar dos entradas del doble de `reicon` **no cuenta**.
>
> **Antes de tocar nada**:
> - Carga las skills: `expo:expo-overview` → `expo:expo-native-ui` y
>   `expo:expo-design-system`, más `appllama-app-design-skill`. Obligatorio en
>   trabajo móvil (carta §Skills). La carta gana sobre la skill en todo
>   conflicto. SDK del proyecto: **Expo 57** (`~57.0.14`); documentación fijada
>   a esa versión, nunca `latest`.
> - Borra `mobile-pet-tracker/.expo/types/router.d.ts` si existe: está
>   gitignorado y rompe el typecheck con rutas fantasma. **Esta feature toca
>   rutas, dos de ellas con `as Href`: es donde más muerde.**
> - Comprueba que no hay otro `init.sh` corriendo en un worktree hermano
>   (`pgrep -f init.sh`): comparten el Postgres de docker y se pisan.
> - Trabaja en `feature/71-mobile-home-quick-actions`. Nunca en `main`.
> - **No migres nada y no crees ficheros de producción.** La rejilla vive
>   dentro de `src/screens/home/index.tsx` ([[design]] §3 D7). Si te ves creando
>   `quick-actions.tsx` o un fichero en `src/app/`, has entendido mal la tarea.
> - **No toques la barra de pestañas** ni `src/app/(tabs)/_layout.tsx`. Que tres
>   destinos del Make ya sean pestaña es el hecho que R3 usa, no un bug.

---

## Forma exacta de lo que hay que escribir

Esto no es una sugerencia de implementación: es el contrato que hace verificables
R1, R4, R5 y R15b. Los nombres de campo son **obligatorios** ([[design]] §3 D7).

```ts
// src/screens/home/index.tsx, nivel de módulo
const QUICK_ACTIONS = [
  { testID: 'quick-action-weight',    Icon: Weight,       labelKey: 'home.quickActionWeight',    slot: 'violet', href: () => '/weight-log' },
  { testID: 'quick-action-reminder',  Icon: CalendarPlus, labelKey: 'home.quickActionReminder',  slot: 'amber',  href: () => '/add-reminder' },
  { testID: 'quick-action-documents', Icon: FileText,     labelKey: 'home.quickActionDocuments', slot: 'blue',   href: (petId: string) => `/pets/${petId}/docs` },
] as const;
```

Dentro de `HomeScreen`, junto al `useThemeColors` que ya existe:

```ts
const quickActionInks = useThemeColors(
  QUICK_ACTIONS.map(({ slot }) => `category-${slot}-strong`),
);
```

Y en el JSX, **entre el fragmento de `collar-card` (cierra en `:372`) y el
skeleton de la gráfica (`:374`)**:

```tsx
{selectedPetId ? (
  <View testID="quick-actions" className="gap-3">
    <Text
      testID="quick-actions-title"
      className="text-xs font-semibold uppercase tracking-widest text-muted"
    >
      {t('home.quickActions')}
    </Text>
    <View className="flex-row gap-3">
      {QUICK_ACTIONS.map(({ testID, Icon, labelKey, slot, href }, index) => (
        <Pressable
          key={testID}
          testID={testID}
          accessibilityRole="button"
          className={`min-h-11 flex-1 items-center gap-1.5 rounded-xl py-3 ${CATEGORY_SLOTS[slot].surface}`}
          style={CONTINUOUS_CORNER}
          onPress={() => router.push(href(selectedPetId) as Href)}
        >
          <Icon size={24} color={quickActionInks[index]} />
          <Text className="text-2xs font-semibold text-foreground">
            {t(labelKey)}
          </Text>
        </Pressable>
      ))}
    </View>
  </View>
) : null}
```

Seis cosas que **no** se pueden cambiar sin romper un candado o un requisito:

1. El campo se llama **`labelKey`**, no `label` ni `key`: es el único nombre que
   `checkUses` reconoce (`ui-language.test.ts:48-55`).
2. `href` es una **función** en las tres filas, aunque dos ignoren el argumento:
   una fila con forma distinta rompe el `.map()` y con él el candado de R4.
3. El fondo sale de `CATEGORY_SLOTS[slot].surface`. Escribir `bg-category-violet`
   en este fichero pone rojo **#64 R9**.
4. `style={CONTINUOUS_CORNER}` aparece **una vez** (dentro del `.map()`), no
   tres: por eso el delta de #62 R14 es +1.
5. `min-h-11` va en el `className` del tile, no en el de la fila.
6. El `as Href` de la línea del `onPress` es el **único** cast que esta feature
   autoriza, y está ahí porque dos de los tres destinos lo necesitan en sus call
   sites actuales ([[design]] §3 D4). Si `/weight-log` empieza a necesitar cast
   por su cuenta, **para y repórtalo**: algo ha cambiado en el tipado de rutas.

---

## R1 — La rejilla y su tabla

- [ ] (1) **Test rojo**: `src/screens/home/index.test.tsx` ::
      `describe('#71 R1: la Home dibuja la rejilla de accesos rápidos')`, con
      `it('dibuja el rótulo y los tres tiles en orden')` (los tres `testID`
      presentes, en el orden del árbol, y `quick-actions-title` con
      `Accesos rápidos`). Falla porque la sección no existe.
      Commit: `feat(mobile-home-quick-actions): test quick actions grid (R1)`
- [ ] (2) **Implementación mínima**: la tabla `QUICK_ACTIONS`, los tres imports
      de icono, las **cuatro claves** en `en` y `es` de `src/i18n/catalog.ts`
      (el registro va en R11) y la sección en el sitio de R10.
      Commit: `feat(mobile-home-quick-actions): add quick actions grid (R1)`
- [ ] (3) **Refactor**: ninguno esperado.

## R2 — Cada tile a su ruta

- [ ] (1) **Test rojo**: en el mismo `describe`,
      `it('lleva cada tile a su ruta existente')` —pulsa los tres y espera
      `mockRouter.push` con `'/weight-log'`, `'/add-reminder'` y
      `'/pets/pet-1/docs'`, una vez cada uno, con `toHaveBeenNthCalledWith`— y
      `it('no apunta a ninguna ruta inexistente')`, que cruza los destinos con
      los ficheros reales de `src/app/(tabs)/` leídos con `readdirSync`. Para
      que el rojo sea real, el commit versiona el tile 1 apuntando a `/trips`.
      Commit: `feat(mobile-home-quick-actions): test tile destinations (R2)`
- [ ] (2) **Implementación mínima**: revertir la mutación; los `onPress` con
      `href(selectedPetId)`.
      Commit: `feat(mobile-home-quick-actions): route each tile to its screen (R2)`
- [ ] (3) **Refactor**: comprobar que `'/pets/pet-1/docs'` sale del `id` de
      `makePet` (`index.test.tsx:94`) y no de un literal escrito a mano en dos
      sitios.

## R3 — Los destinos se ganan el sitio

- [ ] (1) **Test rojo**:
      `it('no dibuja ningún tile a una pestaña ni a un destino inexistente')` —
      exactamente tres hijos en la fila de tiles, y el bloque `QUICK_ACTIONS`
      del fuente sin `'/map'`, `'/health'`, `'/food'`, `'/trips'`,
      `'/reminders'`, `'/pairing'`, `'/pets/add'` ni `'/meal-schedule'`. **La
      comprobación se acota al bloque de la constante**: la Home sigue navegando
      a `/map` (`:397`, `:411`) y a `/pairing` (`:362`) por su cuenta, y esos
      usos son legítimos. Rojo con un cuarto tile a `/map` plantado en
      `QUICK_ACTIONS`.
      Commit: `feat(mobile-home-quick-actions): test destinations earn their slot (R3)`
- [ ] (2) **Implementación mínima**: retirar el cuarto tile.
      Commit: `feat(mobile-home-quick-actions): keep tabs out of the grid (R3)`
- [ ] (3) **Refactor**: ninguno.

## R4 — Las cuatro decisiones ligadas por tile

- [ ] (0) **Preparación, no es rojo**: renombrar el doble de `reicon`
      (`index.test.tsx:62-82`) a `icon-weight`, `icon-walk`, `icon-moon`,
      `icon-map`, y añadir `CalendarPlus`→`icon-calendar-plus` y
      `FileText`→`icon-file-text`; actualizar las cuatro referencias del `it`
      de #69 (`:1341-1344`) **sin debilitar su aserción** —ya usa
      `within(value.parent!)`, así que sigue siendo correcta con un segundo
      `Weight` en el árbol—. Suite verde tras este commit.
      Commit: `test(mobile-home-quick-actions): name reicon doubles by icon (R7)`
- [ ] (1) **Test rojo**:
      `it('liga icono, etiqueta, color y destino de cada tile y de ninguno más')`,
      que para cada tile y con **`within(tile)`** exige su icono, su etiqueta, su
      clase `bg-category-*` y su ruta al pulsar. **Nunca `getByTestId` global
      para el icono**: `icon-weight` sale dos veces en el árbol. Rojo con los
      `Icon` de los tiles 2 y 3 **intercambiados en `QUICK_ACTIONS`**
      (producción, no el mock).
      Commit: `feat(mobile-home-quick-actions): test per-tile bindings (R4)`
- [ ] (2) **Implementación mínima**: deshacer el intercambio.
      Commit: `feat(mobile-home-quick-actions): bind icon, label, colour and route per tile (R4)`
- [ ] (3) **Refactor**: si el test necesita repetir el `within(tile)` tres
      veces, extraerlo a un `it.each` sobre una tabla de expectativas **distinta
      de `QUICK_ACTIONS`** — si el test leyera la misma tabla que produce el
      render, no probaría nada.

## R5 — Fondos de #64, tinta derivada

- [ ] (1) **Test rojo**: `it('resuelve el fondo y la tinta desde el mismo hueco')`,
      que lee el fuente y exige `CATEGORY_SLOTS[` y la plantilla
      `` `category-${ ``…`` -strong` ``, y la ausencia de `bg-category-` escrito
      a mano. Rojo con `bg-category-violet` escrito literalmente en el
      `className` del tile 1 —lo que además pone rojo **#64 R9**, que es la
      demostración de que ese candado cubre esta feature.
      Commit: `feat(mobile-home-quick-actions): test palette token wiring (R5)`
- [ ] (2) **Implementación mínima**: `CATEGORY_SLOTS[slot].surface` y el
      `useThemeColors` derivado.
      Commit: `feat(mobile-home-quick-actions): take tile colours from the category palette (R5)`
- [ ] (3) **Refactor**: ninguno. **No** añadir campos a
      `src/utils/category-palette.ts`.

## R6 — 44 pt por tile

- [ ] (1) **Test rojo**: `it('da a cada tile 44 pt de objetivo táctil')` —
      `min-h-11` y `flex-1` en los tres, ningún `hitSlop`. Rojo retirando
      `min-h-11` del `className` en producción.
      Commit: `feat(mobile-home-quick-actions): test tile touch targets (R6)`
- [ ] (2) **Implementación mínima**: devolver `min-h-11`.
      Commit: `feat(mobile-home-quick-actions): give each tile a 44pt target (R6)`
- [ ] (3) **Refactor**: ninguno.

## R7 — Iconos de `reicon`, ninguno del tab bar

- [ ] (1) **Test rojo**: `it('usa iconos de reicon y ningún emoji')`, leyendo el
      fuente: import de `Weight`, `CalendarPlus` y `FileText`, tres usos con
      `size={24}`, ausencia de `🗺️ 🏃 💉 🍽️`, y ausencia de `HeartPulse` y
      `ForkKnife` dentro del bloque `QUICK_ACTIONS`. Rojo poniendo `ForkKnife`
      como icono del tile 3 en producción.
      Commit: `feat(mobile-home-quick-actions): test tile iconography (R7)`
- [ ] (2) **Implementación mínima**: devolver `FileText`.
      Commit: `feat(mobile-home-quick-actions): use reicon glyphs outside the tab bar set (R7)`
- [ ] (3) **Refactor**: ninguno. El renombrado del doble ya se hizo en R4 (0).

## R8 — `rounded-xl` y esquina continua

- [ ] (1) **Test rojo**: los candados existentes
      `consistency-classnames.test.ts` #62 R14 (fila `screens/home/index.tsx`
      **1 → 2** y total cerrado `33 + 1` → `33 + 1 + 1`) y #62 R4 (lista vacía).
      Rojo poniendo `rounded-2xl` en el tile, en producción.
      Commit: `feat(mobile-home-quick-actions): test tile radius and corner (R8)`
- [ ] (2) **Implementación mínima**: `rounded-xl` y el único
      `style={CONTINUOUS_CORNER}` del `.map()`; aplicar el delta del inventario.
      Commit: `feat(mobile-home-quick-actions): keep tiles on the radius scale (R8)`
- [ ] (3) **Refactor**: ninguno.

## R9 — Tres botones independientes

- [ ] (1) **Test rojo**:
      `it('anuncia los tres tiles como botones independientes')` —
      `accessibilityRole` `'button'` en los tres; ni `quick-actions` ni la fila
      declaran `accessible` ni `accessibilityLabel`. Rojo agrupando la fila con
      `accessible` en producción.
      Commit: `feat(mobile-home-quick-actions): test per-tile announcement (R9)`
- [ ] (2) **Implementación mínima**: quitar el `accessible` de la fila.
      Commit: `feat(mobile-home-quick-actions): announce each tile separately (R9)`
- [ ] (3) **Refactor**: ninguno.

## R10 — Sitio en el árbol y condición de render

- [ ] (1) **Test rojo**:
      `it('coloca la rejilla entre el collar y la actividad semanal')` —
      hijos de `home-content` filtrados a los cinco, esperando
      `['summary-card','collar-card','quick-actions','weekly-activity-card','last-position-card']`—
      y `it('no dibuja la rejilla sin mascota seleccionada')`. Rojo montando la
      sección detrás de `weekly-activity-card` en producción.
      Commit: `feat(mobile-home-quick-actions): test grid placement (R10)`
- [ ] (2) **Implementación mínima**: mover la sección a su sitio.
      Commit: `feat(mobile-home-quick-actions): place the grid above weekly activity (R10)`
- [ ] (3) **Refactor**: comprobar que los dos candados de orden heredados
      (`index.test.tsx:1181-1209` de #68 y `:1364-1414` de #69) siguen verdes
      **sin tocarlos**.

## R12 — Cero datos, cero llamadas

- [ ] (1) **Test rojo**: `it('no añade ninguna llamada a la API')`, comparando
      el recuento de `mockGetPet`, `mockGetDailyActivity` y `mockListPets` con
      el escenario equivalente. Rojo añadiendo un `useApi(detailFn)` extra en
      producción.
      Commit: `feat(mobile-home-quick-actions): test the grid needs no data (R12)`
- [ ] (2) **Implementación mínima**: retirar la llamada de más.
      Commit: `feat(mobile-home-quick-actions): keep the grid data-free (R12)`
- [ ] (3) **Refactor**: comprobar que lo único que la sección consume es
      `selectedPetId`, que ya venía de `useSelectedPet()`.

## R11 — Copy registrada

- [ ] (1) **Test rojo**: las cuatro filas nuevas en `R3_HOME`
      (`ui-copy-table.ts:45-83`) con su delta en `ui-language.test.ts:83`
      (`21 + 15 + 1` → `21 + 15 + 1 + 4`). Rojo antes de registrar; también
      sirve el rojo natural de una clave con cero usos.
      Commit: `feat(mobile-home-quick-actions): test quick actions copy (R11)`
- [ ] (2) **Implementación mínima**: registrar las cuatro filas y añadir las
      cuatro claves a la tabla de `specs/mobile-ui-language/design.md` §2 con el
      formato `← añadida por #71 (R11)`.
      Commit: `feat(mobile-home-quick-actions): register quick actions copy (R11)`
- [ ] (3) **Refactor**: comprobar que `SCREEN_FILES` (`ui-language.test.ts:357`)
      **no** se ha movido. Si se ha movido, alguien creó un fichero nuevo con
      `t()` y eso está fuera de alcance.

## R13 — Bloque propio de drift de estilo

- [ ] (1) **Test rojo**: `src/__tests__/design-drift.test.ts` ::
      `describe('#71 R13: la rejilla de accesos rápidos no mete drift de estilo')`
      sobre `i18n/catalog.ts`, `screens/home/index.test.tsx` y
      `screens/home/index.tsx`. Rojo con un hex plantado en
      `screens/home/index.tsx` (**producción**, no el test).
      Commit: `feat(mobile-home-quick-actions): test feature sources stay token-only (R13)`
- [ ] (2) **Implementación mínima**: retirar el hex.
      Commit: `feat(mobile-home-quick-actions): keep feature sources token-only (R13)`
- [ ] (3) **Refactor**: ninguno.

## R14 — Deltas de candado contra `f9163bf`

- [ ] (1) **Test rojo**: aplicar los deltas de la tabla de [[requirements]] R14,
      **empezando por la fila 1**:
      `src/providers/__tests__/language-provider.test.tsx:41`,
      `260 + 16 + 1` → `260 + 16 + 1 + 4`. Sin ese delta, el catálogo de R1 ya
      tiene la suite roja en 281/277 — que es el rojo legítimo de este
      requisito, y es el mismo sitio donde #68 y #69 se pararon.
      Commit: `feat(mobile-home-quick-actions): test catalog length delta (R14)`
- [ ] (2) **Implementación mínima**: los deltas de las filas 1-4. Las filas 5-14
      se **verifican sin cambio**; si alguna se mueve, **para y repórtalo**.
      Commit: `feat(mobile-home-quick-actions): move locks by declared delta (R14)`
- [ ] (3) **Refactor**: rehacer cada `grep` y anotar en
      `progress/impl_mobile-home-quick-actions.md` el valor antes/después,
      medido contra `f9163bf`, nunca en absoluto.

## R15 — Verificación y prueba de mutación

- [ ] (1) **Suite completa**: `bun run test` y `bun run typecheck` desde
      `mobile-pet-tracker/`, y `./init.sh` desde la raíz **solo si no hay otro
      corriendo** (`pgrep -f init.sh`). Grep-clean de la carta §Decisiones
      fijas 3 rehecho a mano.
- [ ] (2) **Prueba de mutación (R15b)**: las **siete** mutaciones, plantadas
      **de una en una**, todas en **código de producción**, con la salida roja
      pegada en `progress/impl_mobile-home-quick-actions.md` §prueba de
      mutación:
      1. tile 1 → `/add-reminder` en vez de `/weight-log`;
      2. `Icon` de los tiles 2 y 3 intercambiados **en `QUICK_ACTIONS`**;
      3. `labelKey` de los tiles 2 y 3 intercambiados;
      4. tile 1 de `slot: 'violet'` a `slot: 'amber'`;
      5. cuarto tile a `/map` añadido a `QUICK_ACTIONS` — **tiene que poner
         rojo por dos sitios**: el recuento de tres tiles y la lista de rutas
         prohibidas de R3;
      6. `quick-actions` montado detrás de `weekly-activity-card`;
      7. `min-h-11` retirado del tile.
      Si alguna deja la suite **verde**, el candado correspondiente está mal
      escrito: se arregla **antes** de seguir, no se justifica.
      Commit: `feat(mobile-home-quick-actions): verify quick actions locks (R15,R15b)`
- [ ] (3) **Cierre**: rellenar la columna Commit de [[traceability]] fila a
      fila, y dejar el informe en `progress/impl_mobile-home-quick-actions.md`
      con: deltas medidos, evidencia de mutación, y **cualquier premisa de esta
      spec que no se haya cumplido en el árbol**. Lo último es tan importante
      como lo primero.

---

## Lo que NO hay que hacer, por si acaso

- No crear ficheros en `src/app/`. Ninguna ruta nueva (R2).
- No tocar `src/components/floating-tab-bar.tsx` ni `src/app/(tabs)/_layout.tsx`.
- No tocar `src/theme/global.css` ni `src/utils/category-palette.ts` (R5).
- No tocar `src/components/`, `format.ts` ni `weekly-activity-chart.tsx` (R12).
- No hacer pulsable la celda `summary-weight` de #69: la dejó no interactiva a
  propósito y cambiarlo sería enmendar una spec aprobada ([[design]] §6 A10).
- No renombrar ningún `testID` **de producción**. El renombrado de R4 (0) es de
  dobles de test.
- No instalar dependencias. `expo-linear-gradient` sigue vetado por nombre.
- No añadir animación ([[design]] §3 D13).
- No añadir un cuarto tile. R3 da veredicto a las once rutas de la app: tres
  pasan el filtro y ninguna otra lo pasa.
