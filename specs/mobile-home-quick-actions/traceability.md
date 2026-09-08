---
feature: "mobile-home-quick-actions"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-home-quick-actions]]

Rutas relativas a `mobile-pet-tracker/`. La columna **Test** la **prescribe la
spec** (no la improvisa el implementer): es el contrato de qué prueba cada R-id.
La columna **Commit** la rellena el implementer en cuanto ese requisito queda
verde, nunca al final.

Dos abreviaturas para no repetir rutas largas:
`HOME` = `src/screens/home/index.test.tsx`;
`GRID` = `HOME`::`describe('#71 R1: la Home dibuja la rejilla de accesos rápidos')`.

| Requisito | Test (archivo::nombre) — prescrito por la spec | Commit (hash + mensaje) |
|---|---|---|
| R1 | `GRID`::`it('dibuja el rótulo y los tres tiles en orden')`: los tres `testID` presentes y en el orden del árbol, `quick-actions-title` con `Accesos rápidos` y la receta canónica de rótulo de sección, y ningún cuarto tile | `4552103` `feat(mobile-home-quick-actions): test quick actions grid (R1)` (rojo) → `5eb6c2c` `feat(mobile-home-quick-actions): add quick actions grid (R1)` (verde) |
| R2 | `GRID`::`it('lleva cada tile a su ruta existente')` (`toHaveBeenNthCalledWith` con `'/weight-log'`, `'/add-reminder'` y `'/pets/pet-1/docs'` —el `id` de `makePet`, `HOME:94`—, una vez cada uno) + `GRID`::`it('no apunta a ninguna ruta inexistente')`, que cruza los destinos con los ficheros reales de `src/app/(tabs)/` leídos con `readdirSync` | `20355a6` `feat(mobile-home-quick-actions): test tile destinations (R2)` (rojo) → `48a0fe0` `feat(mobile-home-quick-actions): route each tile to its screen (R2)` (verde) |
| R3 | `GRID`::`it('no dibuja ningún tile a una pestaña ni a un destino inexistente')`: exactamente tres hijos en la fila de tiles, y el **bloque `QUICK_ACTIONS`** del fuente sin `'/map'`, `'/health'`, `'/food'`, `'/trips'`, `'/reminders'`, `'/pairing'`, `'/pets/add'` ni `'/meal-schedule'`. La comprobación se acota al bloque de la constante porque la Home sigue navegando a `/map` (`:397`, `:411`) y a `/pairing` (`:362`) por su cuenta, y esos usos son legítimos | `d4c506e` `feat(mobile-home-quick-actions): test destinations earn their slot (R3)` (rojo) → `feb786f` `feat(mobile-home-quick-actions): keep tabs out of the grid (R3)` (verde) |
| R4 | `GRID`::`it('liga icono, etiqueta, color y destino de cada tile y de ninguno más')`, que para cada tile y con **`within(tile)`** exige **las cuatro** dimensiones: icono por el doble de `reicon` (`icon-weight` / `icon-calendar-plus` / `icon-file-text`), etiqueta por `getByText`, clase `bg-category-violet` / `bg-category-amber` / `bg-category-blue` en el `className`, y ruta al pulsar. **Nunca `getByTestId` global para el icono**: `icon-weight` sale dos veces en el árbol (celda de #69 y tile 1). Es el candado que mata **por separado** las cuatro mutaciones de cruce de R15b | `b9b6926` `feat(mobile-home-quick-actions): test per-tile bindings (R4)` (rojo) → `50527a6` `feat(mobile-home-quick-actions): bind icon, label, colour and route per tile (R4)` (verde) |
| R5 | `GRID`::`it('resuelve el fondo y la tinta desde el mismo hueco')` (lectura de fuente: `CATEGORY_SLOTS[`, plantilla `` `category-${…}-strong` ``, ningún `bg-category-` a mano) + `src/__tests__/consistency-classnames.test.ts` **#64 R9** (`:372-433`) en verde y **sin tocar**, que es lo que prueba que la Home no escribió ninguna clase categórica. **La aserción de fuente es candado de cadena literal**, declarado como tal en [[requirements]] R13; la parte de conducta la lleva R4 | `5c73799` `feat(mobile-home-quick-actions): test palette token wiring (R5)` (rojo) → `9f6b76c` `feat(mobile-home-quick-actions): take tile colours from the category palette (R5)` (verde) |
| R6 | `GRID`::`it('da a cada tile 44 pt de objetivo táctil')`: `min-h-11` y `flex-1` en los tres `className`, y ningún `hitSlop`. La Home **no** está entre las siete pantallas con `describe('#61 R10: …')`, así que este `it` es la única cobertura de 44 pt de esta pantalla | `e98030e` `feat(mobile-home-quick-actions): test tile touch targets (R6)` (rojo) → `494bae2` `feat(mobile-home-quick-actions): give each tile a 44pt target (R6)` (verde) |
| R7 | `GRID`::`it('usa iconos de reicon y ningún emoji')`, leyendo el fuente: import de `Weight`, `CalendarPlus` y `FileText`, tres usos `size={24}`, ausencia de `🗺️ 🏃 💉 🍽️`, y ausencia de `HeartPulse` y `ForkKnife` en el bloque `QUICK_ACTIONS` + `consistency-classnames.test.ts` **#62 R7** (`:186-217`) en verde. Incluye el renombrado del doble de `reicon` de `HOME` (`:62-82`) a nombres por icono y la actualización de las cuatro referencias del `it` de #69 (`:1341-1344`) sin debilitarlas —ya usan `within(value.parent!)`— | `a1796c9` `test(mobile-home-quick-actions): name reicon doubles by icon (R7)` (preparación) + `8e21f05` `feat(mobile-home-quick-actions): test tile iconography (R7)` (rojo) → `bb3ae19` `feat(mobile-home-quick-actions): use reicon glyphs outside the tab bar set (R7)` (verde) |
| R8 | `consistency-classnames.test.ts` **#62 R14** (`:269-332`): fila `screens/home/index.tsx` **1 → 2** y total cerrado `33 + 1` → `33 + 1 + 1`; y **#62 R4** (`:149-155`) en verde con lista vacía | `f8040c3` `feat(mobile-home-quick-actions): test tile radius and corner (R8)` (rojo) → `063d6c9` `feat(mobile-home-quick-actions): keep tiles on the radius scale (R8)` (verde) |
| R9 | `GRID`::`it('anuncia los tres tiles como botones independientes')`: `accessibilityRole` `'button'` en los tres, y ni `quick-actions` ni la fila de tiles con `accessible` o `accessibilityLabel` | `d89b5fd` `feat(mobile-home-quick-actions): test per-tile announcement (R9)` (rojo) → `412d32c` `feat(mobile-home-quick-actions): announce each tile separately (R9)` (verde) |
| R10 | `GRID`::`it('coloca la rejilla entre el collar y la actividad semanal')`, que espera `['summary-card','collar-card','quick-actions','weekly-activity-card','last-position-card']` tras filtrar los hijos de `home-content` + `GRID`::`it('no dibuja la rejilla sin mascota seleccionada')` + los dos candados de orden heredados, `HOME:1181-1209` (#68) y `HOME:1364-1414` (#69), **en verde y sin tocar** | `2f9ec85` `feat(mobile-home-quick-actions): test grid placement (R10)` (rojo) → `af5c099` `feat(mobile-home-quick-actions): place the grid above weekly activity (R10)` (verde) |
| R11 | `src/__tests__/ui-language.test.ts` (candados de #65: una clave presente en un idioma y ausente en el otro no compila, `:348`; `checkUses(R3_HOME)` exige una fila por uso y cuenta tanto `t('k')` como **`labelKey: 'k'`**, `:48-55`) + las cuatro filas nuevas en `ui-copy-table.ts:45-83` + el registro en `specs/mobile-ui-language/design.md` §2 | `cf6ec2e` `feat(mobile-home-quick-actions): test quick actions copy (R11)` (rojo) → `84198eb` `feat(mobile-home-quick-actions): register quick actions copy (R11)` (verde) |
| R12 | `GRID`::`it('no añade ninguna llamada a la API')`, que compara el recuento de `mockGetPet`, `mockGetDailyActivity` y `mockListPets` con el escenario equivalente. Verificación adicional del reviewer: `git diff --stat` sin ficheros fuera de `mobile-pet-tracker/` y `specs/`, y en particular sin `src/components/floating-tab-bar.tsx` ni `src/app/(tabs)/_layout.tsx` | `c1a4b30` `feat(mobile-home-quick-actions): test the grid needs no data (R12)` (rojo) → `7fb35af` `feat(mobile-home-quick-actions): keep the grid data-free (R12)` (verde) |
| R13 | `src/__tests__/design-drift.test.ts`::`describe('#71 R13: la rejilla de accesos rápidos no mete drift de estilo')`, sobre la lista nominal de los tres ficheros de esta feature. **Candado de cadena literal, no de conducta**, y así está declarado en [[requirements]] R13 | `9ea0a17` `feat(mobile-home-quick-actions): test feature sources stay token-only (R13)` (rojo; verde pendiente) |
| R14 | Los deltas de la tabla de [[requirements]] R14, verificados por el reviewer **rehaciendo cada `grep`**, no leyendo el informe del implementer. Fila 1: `src/providers/__tests__/language-provider.test.tsx:41`, `260 + 16 + 1` → `260 + 16 + 1 + 4` — el candado que **paró la implementación en #68 y en #69** por estar omitido. Esta feature **no reubica nada**: si aparece una reubicación, alguien está moviendo un fichero que no toca | pendiente |
| R15 | Requisito de **verificación** (C4 vía (b)): `bun run test` y `bun run typecheck` verdes desde `mobile-pet-tracker/`, grep-clean de la carta §Decisiones fijas 3 intacto y escala de radios de #62 R4 sin clase fuera de escala | pendiente |
| R15b | Las **siete** mutaciones de [[tasks]] §R15 (2), plantadas de una en una y **todas en código de producción** (`CHECKPOINTS.md` C4, quinto punto: mutar el doble de `reicon` **no** cuenta), con la evidencia en `progress/impl_mobile-home-quick-actions.md` §prueba de mutación. Las cuatro primeras prueban las **cuatro** posiciones del discriminante tile↔contenido —destino, icono, etiqueta y color—; la quinta vigila el criterio nuevo de R3 plantando un tile a `/map`, que debe poner rojo por dos sitios; y las dos últimas, el sitio en el árbol y el objetivo táctil | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" en la columna
Commit.
Convención de commit: `feat(mobile-home-quick-actions): <desc> (R1,R4)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**Fuera de esta tabla y no delegable a IA**: el gate humano de smoke en dev
build de Android (nunca Expo Go), en tema claro y oscuro, comprobando que la
rejilla va entre la tarjeta del collar y la gráfica semanal; que **los tres**
tiles abren la pantalla que prometen; que al guardar un recordatorio se vuelve a
la **Home** y no a la lista —`router.back()` de `add-reminder/index.tsx:89`—;
que el tile de Documentos abre los de la mascota **seleccionada** y no los de
otra, probándolo con dos mascotas; que ninguno de los tres iconos se confunde
con uno de la barra de pestañas, que sigue flotando debajo; que los tres
pasteles se distinguen entre sí **y del fondo** en los dos temas —el contraste
superficie/fondo es 1,06-1,10 en claro y 1,16 en oscuro, correcto pero apretado
([[design]] §4)— y que el icono se lee encima; que las tres etiquetas no se
truncan en la pantalla más estrecha disponible; y que TalkBack anuncia **tres
botones** con sus etiquetas y no un bloque único. Guion completo en
[[requirements]] §Aprobación. Sin él la feature no pasa a `done`, tenga la tabla
las filas que tenga.

**Decisiones abiertas: ninguna.** E1 —tres tiles o un cuarto destino— la resolvió
el humano el 2026-09-08 con un criterio nuevo, que es ahora R3: un tile solo
entra si su destino no es alcanzable desde la barra de pestañas, no es pantalla
hija de una pestaña y no es configuración de una sola vez. El número de tiles
sale del filtro, no del diseño. Lo que queda para el gate es **ratificar** la
desviación total respecto al Make (§Aprobación punto 3), no decidirla.
