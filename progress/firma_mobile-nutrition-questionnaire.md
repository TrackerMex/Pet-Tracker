# Auditoría de firma delegada — #209 mobile-nutrition-questionnaire

- Spec: `specs/mobile-nutrition-questionnaire/` @ 7864ea9e (branch feature/209-mobile-nutrition-questionnaire)
- Base: origin/dev 2041e2b3 (congelada: sin fetch ni checkout)
- Auditor: subagente de solo lectura (no firma; decide el leader)
- Estado: TERMINADO. 8 fallos bloqueantes (F1–F8) y 18 avisos (A1–A18). Punto
  abierto para el leader: canvas congelado desde la versión viva y no desde la v140
  (A17). Veredicto del auditor: no firmable tal cual; firmable tras aplicar las
  erratas de F1–F8.
- Sin cambios en ficheros tracked salvo este informe. Las mutaciones van en
  `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/audit209/`.

## Resultados por punto

### 5b. Contrato del backend y de la capa API móvil — FALLO (F1, F2)

- `git show origin/dev:backend-pet-tracker/src/modules/nutrition/application/dto/nutrition-profile.dto.ts`:
  `KCAL_PER_100G_MIN = 80`, `KCAL_PER_100G_MAX = 600`, `foodType: z.enum(['dry','wet','mixed','homemade'])`,
  `bodyCondition` int 1–9 opcional, `targetWeightKg` `gt(0).max(999.99)` opcional, `allergies`/`diseases`
  `z.array(z.string()).default([])`, `z.strictObject`. Coincide con requirements.md §Contrato. OK.
- `BODY_CONDITION_OVERWEIGHT_MIN = 7` en `domain/nutrition.constants.ts` de origin/dev. OK.
- `nutrition.controller.ts`: `@Put('nutrition-profile')` + `@RequirePetRole('owner')`. OK con decisión 10.
- Las cotas de #212 R1 (20 elementos, 100 caracteres) no están aún en origin/dev (el DTO no tiene `.max`).
  La spec las respeta «desde ya»: correcto, sin dependencia dura. OK.
- **F1 (bloqueante).** R1 prescribe `putJson(url, token, body, fetchFn)` y `fetchFn(url, …)` «igual que
  `patchJson`». Pero `patchJson` en `src/api/http.ts` es
  `patchJson(baseUrl: string, path: string, token: string, body: unknown, fetchFn: typeof fetch)` y llama a
  `fetchFn(apiUrl(baseUrl, path), …)`. La firma de R1 contradice «igual que patchJson» y design.md
  («copia de `patchJson` con `method: 'PUT'`»). Codex tiene dos lecturas incompatibles y el test R1 se
  escribe contra una de ellas.
- **F2 (bloqueante).** R2 dice que el PUT va a `${baseUrl}/v1/pets/${petId}/nutrition-profile`. En el
  árbol `baseUrl` ya termina en `/v1` (`.env.example`: `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/v1`;
  `src/api/__tests__/nutrition.test.ts`: `const baseUrl = 'http://example.test/v1/'` y la URL esperada
  `'http://example.test/v1/pets/pet-1/nutrition-profile'`), y `getNutritionProfile` usa la ruta
  `` `/pets/${petId}/nutrition-profile` ``. Leída al pie de la letra, R2 produce `/v1/v1/…`.

### 2. Reglas móviles (carta, guardas, testIDs, copy, skills, dependencias, mocks) — FALLO (F3, F4, F5, F7)

- **F3 (bloqueante).** R24 manda un `describe('#209 R24: Cuestionario sin deriva')` «copiado del de
  `#175 R10: Documentos sin deriva`». Ese describe (design-drift.test.ts) contiene, además de hex/arbitrarias/
  StyleSheet, dos candados que la propia spec incumple:
  - `it('usa solo los radios card, xl, full, 24 y 16')` con `/\brounded-(?!(?:card|xl|full|24|16)\b)[\w-]+/`:
    R25 prescribe `rounded-tile` (tarjeta de actividad, nota, lista de Generando), `rounded-14` (fila BCS,
    tile del icono, campo numérico) y `rounded-10` (badge BCS). Copiado tal cual, nace rojo y no se
    puede poner verde sin violar R25.
  - `it('importa exactamente los tres iconos desde un único import de reicon')` con
    `['ChevronRight', 'FileText', 'Upload']`: contradice la decisión 12 («No se candadan los iconos»).
  - R25 dice «el `describe` de R24 […] cubre hex, clases arbitrarias y StyleSheet», que es un subconjunto:
    las dos lecturas («copiado» frente a «cubre tres cosas») son incompatibles. Ver mutación M1.
  - `\buseThemeColor\b` lleva `\b`: `useThemeColors` (patrón D-I de la carta para colorear iconos) no
    choca. OK.
- **F4 (bloqueante).** «Diccionario de `rounded-16`: la entrada nueva cuenta 1». Con R25 el fichero nuevo
  tiene dos `rounded-16`: la CTA `h-14 rounded-16 bg-accent` y el resumen
  `rounded-16 bg-default px-3 py-2.5` de Peso objetivo. El mismo error se arrastra al `radii` de
  chunky-cta («`radii` del fichero nuevo y de `food`», sin cifra). Ver mutación M2.
- **F5 (bloqueante).** Inventarios de `chunky-cta-canvas-fidelity.test.ts` que la feature mueve y R24 no
  lista:
  - #177 R6.2: `count(/text-17/g)` y `count(/<Text className="text-17 font-extrabold text-accent-foreground">/g)`
    suben +2 (hijo de la CTA del wizard y de `food-create-profile`, receta de R25).
  - #177 R7.1: `count(/border-lip-gray/g)`, si su alcance incluye los ficheros tocados (radio, filas de
    Generando, enlaces de Horario).
  - #177 R7.3: el agregado de `rounded-16`.
  - #177 R7.5: `inventory(/style=\{chunkyLip\.primaryCompact\}/g)` es `toEqual({ food: 1, reminders: 1 })`;
    los chips de Salud marcados (R25) añaden el fichero nuevo.
  - #177 R7.4: `consumers = [...ctaFiles, …, 'screens/food/index.tsx', …].sort()`. Si `food` entra en
    `CTA_ROWS` (fila `food-create-profile` de R24) y `ctaFiles` sale de `CTA_ROWS`, `food` sale dos veces.
  - `CTA_ROWS` tiene forma `[path, literalId(id), classes, keeps[]]` y R24 no da los `keeps` ni dice si la
    CTA del wizard entra en `disabledCtas`/`KEEP_OPACITY` (tiene `isDisabled`, R7). Ver mutación M3.
- **F7 (bloqueante).** Guardas por lista de ficheros que el fichero nuevo y `food`/`meal-schedule`
  mueven y que R24 no nombra (R24 dice «las cinco suites citadas» y cita cuatro):
  - `profile-canvas-fidelity.test.ts` › `it('reserva rounded-tile a sus consumidores aprobados …')`:
    `filesMatching(/\brounded-tile\b/)` es `toEqual([add-pet, add-reminder, geofences, home, pairing, profile])`.
  - `profile-canvas-fidelity.test.ts` › `it('limita text-13 a Perfil …')`: `filesMatching(/\btext-13\b/)`,
    lista cerrada sin el fichero nuevo.
  - `alerts-canvas-fidelity.test.ts` › `describe('#174 R12: inventarios')`: `rounded-10` es
    `[segmented-control, alerts, meal-schedule]` y `text-15` es una lista cerrada; el fichero nuevo usa los
    dos (badge BCS, lista de Generando, unidad kcal).
  - El resultado de la corrida real va en el punto 4 (mutación M4).
- testIDs nuevos contra selectores por prefijo o regex: en `food/index.test.tsx` y
  `meal-schedule/index.test.tsx` los selectores son `^pet-chip-`, `^meal-row-`, `^plan-warning-`,
  `^meal-pending-`, `^meal-served-`, `^meal-time-row-` y dos listas ancladas
  (`^(food-plan-card|…|food-links)$`). Ningún testID nuevo (`food-profile-empty`, `food-create-profile`,
  `nutrition-profile-edit`, `nutrition-profile-create`) cae en ellos. `(?:-error|-retry)$` solo vive en
  `home/index.test.tsx`. OK.
- Copy: literales de R7–R16, R19 y R22 contrastados con el canvas (punto 6). R17 da **claves** y no
  literales para `mealSchedule.errorForbidden`, `common.cannotReachServer` y
  `mealSchedule.registerWeightFirst`, aunque pide «el texto español literal escrito en el test». Aviso A1.
- Skills de Codex: la spec no nombra ninguna skill (`grep -niE "skill|expo-"` = 0 en los cuatro ficheros).
  Correcto para la spec; el handoff deberá nombrar las del catálogo de Codex. OK.
- Dependencias: `TrendDown`, `Location`, `TrendUp`, `Check` e `InfoCircle` ya se importan de
  `reicon-react-native` en `src/`. Sin `expo-linear-gradient` ni paquetes nuevos. OK.
- Símbolos citados existen: `PingRing` (`components/ping-ring.tsx`), `PingoFloat`, `MOTION_PING_TIMING`,
  `CATEGORY_SLOTS` (`utils/category-palette.ts`, `.surface` = `bg-category-*`, `.ink` =
  `text-category-*-strong`), `TOUCH_SLOP`, `CONTINUOUS_CORNER`, `OptionalChip`, `add-pet-bubble`,
  `useChunkyLip`, `ScreenHeader` (`size?: 24 | 26`, `accessory?`), `assets/images/pingo-food.webp`. OK.
- Mocks por intención: la spec prescribe «el arnés de `src/screens/add-pet/index.test.tsx`» (modo de
  mockear router, auth y `fetch`), no un mock literal. OK.

### 3. Anclas grep (ejecutadas, sin números de línea) — OK con avisos

Ejecutadas desde `mobile-pet-tracker/` salvo indicación; todas devuelven la cifra previa declarada:

- `grep -cF 'export async function putJson' src/api/http.ts` = 0. OK.
- `grep -cF 'name="nutrition-profile"' src/app/_layout.tsx` = 0 (la de `meal-schedule` = 1). OK.
- `src/app/nutrition-profile.tsx` y `src/screens/nutrition-questionnaire/` no existen. OK.
- `grep -cF 'R20_NUTRITION_QUESTIONNAIRE' src/__tests__/ui-copy-table.ts` = 0. OK.
- `grep -cF "'nutritionQuestionnaire." src/i18n/catalog.ts` = 0. OK.
- `grep -cF '#209 R24' src/__tests__/*.ts` = 0 en todos. OK.
- `grep -cF '...R17_EDIT_PROFILE,' src/__tests__/ui-copy-table.ts` = 1, y es el último bloque de `ALL_USES`. OK.
- Desde la raíz: `grep -cF '## Enmienda #209' docs/ui-guidelines.md` = 0. OK.
- Las claves reutilizadas de la decisión 15 existen con su valor `es` exacto (`addPet.stepProgress`,
  `addPet.optional`, `mealSchedule.nutritionProfile`, `mealSchedule.noNutritionProfileYet`,
  `common.somethingWentWrong`, `common.cannotReachServer`, `mealSchedule.errorForbidden`,
  `mealSchedule.registerWeightFirst`). `profile.editProfile` ('Editar perfil') también existe y la spec no
  la cita (aviso A2). 'Siguiente' no está en el catálogo: clave nueva, correcto.
- Aviso A3: el cwd de las anclas no es uniforme. Requisitos dice «Rutas relativas a
  `mobile-pet-tracker/`», pero el ancla de R24 lleva el prefijo `mobile-pet-tracker/src/__tests__/*.ts`, la
  de R26 y la de la decisión 15 se corren desde la raíz, y el comando base de tasks.md hace `cd` explícito.
  Codex puede obtener 0 por cwd equivocado (memoria «cd explícito en handoffs»).

### 4. R-id ↔ test ↔ trazabilidad, candados y mutaciones — FALLO (F6) y evidencia de F3, F4, F5, F7

- Las 26 R-id tienen fila en traceability.md y un test (o ancla, R26) con fichero exacto. OK.
- **F6 (bloqueante).** Ningún nombre de test lleva el prefijo `#209 R<n>:`; todos son `R<n>:`:
  - En los ficheros compartidos la convención es `#NNN R<n>:` sin excepción (ui-language.test.ts,
    ui-copy-table.ts, design-drift.test.ts…), y R23 mete `it('R23: …')` en `src/__tests__/ui-language.test.ts`.
  - En `src/api/__tests__/nutrition.test.ts` ya existen `describe('R1: getNutritionProfile mapea la respuesta
    por kind')` y `describe('R2: getNutritionPlan mapea la respuesta por kind')`: el comando de tasks.md
    `-t 'R1'` / `-t 'R2'` arrastra esos describes verdes junto al rojo nuevo.
  - En `food/index.test.tsx` hay 30 nombres `#2NN R<n>:` y un `describe('R10: preserva la mascota durante
    el refetch')`; un `-t 'R1'` en ese fichero también casaría R10.
  - El propio describe de R25 sí usa `#209 R24:`, y además con el R-id cruzado (es el candado de R25 y se
    nombra R24). Aviso A4.
- Candados no tautológicos: literales a mano y no importados de `catalog.ts`; `NINE_ROWS` (9) y
  `FOUR_TYPES` (4) escritos a mano con longitud fijada; precargas escritas a mano (design.md); R14 aserta
  ausencia de claves con `not.toHaveProperty`; R3 lee las fuentes. OK. Avisos: R23 deja `N` «medido» por
  quien implementa, y R24 deja «+ N» y «el número medido» sin cifra esperada en #62 R14, #166 R3 y
  `neutralCompact` (A5).
- Mutaciones, en una copia del árbol (`mobile-pet-tracker` sin `node_modules`, `docs`, `specs`) en
  `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/audit209/wt/`.
  Línea base: `bunx jest src/__tests__` 34 suites verdes; la única roja es `hosting-artifacts.test.ts`, que lee
  `hosting/` y `.env.example`, no copiados (artefacto de la copia, se ignora).
  - **M4. Producción sembrada según R25, sin enmiendas de R24.** Fichero nuevo con las recetas de R25,
    `FoodProfileEmpty` en `food/index.tsx` (R19/R25), los dos enlaces de Horario (R20/R25) y la ruta (R3).
    Log `.../audit209/m4.log`. Rojos: 6 suites, 25 tests. Los que R24 **sí** nombra: #62 R1, #166 R2,
    #166 R3 (consistency), #178 R13 radios 14/16 (design-drift), #177 R3.3, R7.2, R7.4, R8.1 (chunky).
    Los que R24 **no** nombra (F5, F7):
    - chunky: `#177 R6.2` (text-17), `#177 R7.1` (border-lip-gray), `#177 R7.3` (radios de dieciséis),
      `#177 R7.5` (primaryCompact).
    - consistency: `#62 R12: los TextInput crudos comparten una sola receta` (`toHaveLength(6)` pasa a 8 con
      dos campos; con los cuatro reales de la spec serían 10) y `#98 R10: los candados que esta feature no
      mueve` (`count(/style=\{CONTINUOUS_CORNER\}/g)` 55 → 60). R24 manda enmendar `#62 R14 directUses`,
      que **no** se puso rojo: apunta al test equivocado.
    - design-drift: `#179 R13 › limita text-22 a Horario y text-17 al inventario de E1.2`
      (`productionFilesMatching(/\btext-17\b/)` gana el fichero nuevo) y `#179 R13 › ancla las tres etiquetas
      Text con los literales de E2.3`: exige `schedule.split('<Text className="text-13 font-extrabold
      text-foreground">')` de longitud 2, y el texto de los dos enlaces de Horario de R25 es exactamente esa
      etiqueta (sale 4).
    - profile-canvas-fidelity: `#173 R2 › reserva rounded-tile …` y `#173 R2.4 › limita text-13 …`.
    - alerts-canvas-fidelity: `#174 R12 › limita rounded-10 …` y `#174 R12 › limita text-15 …`.
    - Atribuible a la siembra y no a la spec: `#64 R9` (escribí `bg-category-blue` literal en el tile; R25
      prescribe `CATEGORY_SLOTS`). Descartado.
  - **M1. Describe de R24 copiado de #175 R10** (`featureFiles = ['screens/nutrition-questionnaire/index.tsx']`).
    Log `.../audit209/m1m3.log`. Rojo en `usa solo los radios card, xl, full, 24 y 16` (recibe el fichero
    nuevo) y en `importa exactamente los tres iconos …` (espera `ChevronRight, FileText, Upload`, recibe
    `Check, InfoCircle, Location, TrendDown, TrendUp`). Confirma F3.
  - **M2. Recuento de `rounded-16` en el fichero sembrado:** `grep -c rounded-16` = 2 (CTA y resumen).
    Confirma F4.
  - **M3. Las dos filas de R24 en `CTA_ROWS`.** `#177 R7.4` sigue rojo con
    `- "screens/food/index.tsx"` duplicado en el esperado: `ctaFiles` sale de `CTA_ROWS` y `consumers` ya
    lista `food` a mano. Arreglarlo exige **quitar** `'screens/food/index.tsx'` de `consumers`, que la regla
    mecánica («nunca se reescribe la base») no permite sin decirlo. Confirma F5.
  - **M5. Sección literal de R26 añadida al final de la carta copiada.** Corrida completa
    (`.../audit209/m5.log`): ningún rojo nuevo respecto de M4 salvo los de M1. La sección no rompe guardas. OK.


### 5a. Respuestas de design_ola0 §Preguntas abiertas — OK

- Q1 (kcal por tipo): la spec precarga Seco 350, Húmedo 90, Mixto 220 y Casero 130
  (design.md, constante local), con cotas enteras 80–600 (R12) y una nota de ayuda
  por tipo (R11). Coincide con la respuesta.
- Q2 (alergias y enfermedades): listas cerradas más «Otra» a 40 caracteres, que se
  envía recortada; se manda la etiqueta en español tal como se ve (R13, R14;
  design.md §Alternativas «Valores canónicos en inglés»). Coincide.
- Q3 (BCS neutro para ambas especies): las nueve filas de R8 (requirements.md,
  tabla de condición) hablan de costillas, cintura, cadera, cuello, lomo y vientre,
  sin «perro» ni «gato». No aparece «abdomen» (dice «vientre»); es sinónimo y no
  cambia la neutralidad. OK.
- Q6 («Carne de res» y «Soya» se quedan): presentes en la lista de alergias de R13. OK.
- Q14–Q16 (estado y propuesta de IA) son de #212/#215. La spec excluye
  `aiStatus`/`aiProposal` del cuerpo y de la UI. No los toca. OK.
- Nota: `progress/plan_mejoras-producto-2026-10-26.md` todavía dice «100 para
  húmedo». La spec sigue a design_ola0 (90), que es la respuesta posterior. Aviso A15.

### 6. Canvas ↔ requisitos (en ambos sentidos) — OK con avisos (A8, A17)

- El sha256 de los artboards congelados coincide con el que cita la spec.
- El copy extraído del canvas coincide literal con R7–R16, R19 y R22 (burbuja,
  leyendas, tres opciones de actividad, nueve filas de BCS, notas de Peso objetivo,
  cuatro chips de alimento, listas de Salud, Generando).
- Píldoras de Horario: «Actividad | Media» y «Alimento | Seco 380 kcal/100 g»
  están en R22. «Edad | Adulto» queda fuera, declarado. «Ver el plan de Rocky»
  queda fuera, declarado (decisión del prototipo, requirements.md línea «el plan de
  Rocky» del artboard).
- Estructura: tarjeta de Actividad con radio 18, tile de icono 44 con radio 14,
  Pingo 52 con cola a 22; Condición con tile 44 y cola a 18; barra de pasos de
  6 px con hueco de 6 px. R25 recoge radios y tamaños. El hueco de 6 px
  (`gap-1.5`) no está en R25 (aviso A11).
- Sentido inverso: el enlace «Crear perfil nutricional» de Horario (R20) no tiene
  artboard (aviso A8). El resto de R-ids de UI tiene su artboard.
- Versión: la nota G1 de requirements.md congela desde la versión viva
  `1793039639-fe0d`, no desde la v140 `1793036268-d302` que aprobó G1, y dice
  «hay que re-congelarlos antes de firmar» si difieren. Nadie lo ha hecho en el
  árbol: no hay evidencia escrita de que las dos versiones den el mismo copy y la
  misma estructura (grep de los dos ids en `progress/` y `docs/`: 0 resultados
  fuera de la spec). Punto abierto para el leader (aviso A17).

### 7. Componentes y agregados compartidos con #208 y #220 — OK con aviso (A16)

- Numeración de bloques de `ui-copy-table.ts`: #220 añade `R18_DATE_FIELD`
  (wt-220, diff contra su base), #208 `R19_VACCINE_CREATE`
  (wt-208 `specs/mobile-vaccine-create/requirements.md` §R20) y #209
  `R20_NUTRITION_QUESTIONNAIRE`. Sin choque de nombre. Los tres editan la misma
  línea de `ALL_USES`/`blocks` del `it('#194 R5: …')`: conflicto textual previsto,
  y design.md §Riesgos lo resuelve con merge de `origin/dev` y regla mecánica.
- `consistency-classnames.test.ts` #98 R10 (agregado de `CONTINUOUS_CORNER`) y
  `directUses` de #62 R14: #220 ya los enmienda (`+ 1 - 1 - 2 // #220 R4; …`),
  #208 también (§R21, «#62 R14 directUses»). #209 los necesita (F7). Misma línea
  en los tres.
- `chunky-cta-canvas-fidelity.test.ts`: #208 añade 2 filas a `CTA_ROWS` y
  enmienda R3.3, R6.2, R7.2, R7.3, R7.5 y R8.1 de forma explícita. Es el patrón
  que le falta a #209 (F5).
- `app/_layout.tsx` y `app/__tests__/layout.test.tsx`: #208 añade un hijo al
  grupo protegido en el índice 13 («El grupo pasa de 14 a 15 hijos»). #209 añade
  otro y no enmienda `layout.test.tsx` (F8). Los dos tocan las mismas cuentas
  `toHaveLength(…)`.
- `components/date-field.tsx` (#220): #209 no lo usa (sus campos son numéricos).
  Sin dependencia.
- `api/http.ts`, `screens/food`, `screens/meal-schedule`: #208 no los cita
  (0 resultados en su spec) y #220 no los toca (diff de wt-220). Sin choque.

### 8. Casilla R26 / G4 — OK con aviso (A9)

- R26 no tiene candado jest: solo el ancla
  `grep -cF '## Enmienda #209' docs/ui-guidelines.md` = 1 (traceability.md, fila R26).
  Ningún test lee la casilla, así que no hay regex que endurecer hoy. Si se añade un
  candado, usar la forma tolerante de las enmiendas previas:
  `/- \[[ xX]\] Enmienda #209 aprobada por humano/`.
- Mutación M5 (sección R26 plantada en `docs/ui-guidelines.md` del scratch con la
  casilla sin marcar): las guardas siguen verdes. La casilla no rompe nada al
  marcarla.
- Qué bloquea G4: solo el cierre de R26. El commit `docs(ui): #209 R26 enmienda`
  puede entrar con la casilla sin marcar (tasks.md §R26 (2)). R26 «no cierra hasta
  entonces», así que `status: done` de #209 espera al humano. Ningún otro R-id ni
  tarea depende de G4.
- La etiqueta «G4» choca: en `plan_mejoras-producto-2026-10-26.md` §5, G4 es el
  smoke en dispositivo; en `plan_ui-2026-10-26.md`, G4 son las enmiendas de
  `docs/ui-guidelines.md`. #209 pertenece al plan de mejoras (#208–#216). Además,
  la casilla `- [ ] Aprobada por humano (G4, fecha: ____)` no sigue el formato de
  las previas `- [X] Enmienda #NNN aprobada por humano`. Aviso A9.

### 9. Supuestos de entorno que los tests no ven — OK con aviso

- Teclado: raíz `KeyboardAvoidingView` con `behavior="padding"` y
  `keyboardShouldPersistTaps` (R18). Es la receta correcta bajo edge-to-edge
  (SDK 57, `adjustResize` no encoge la raíz). OK.
- Sin módulo nativo nuevo, sin dependencia nueva, sin TZ ni `Date.now()` en render.
- El asset `assets/images/pingo-food.webp` existe en la base. El `require` desde
  `src/screens/nutrition-questionnaire/index.tsx` es
  `../../../assets/images/pingo-food.webp`; la spec no da la ruta relativa, pero
  no hay ambigüedad.
- Movimiento reducido en Generando (R16): el setup global de jest no simula
  `useReducedMotion`; cada test lo hace con su propio `jest.mock` de
  `react-native-reanimated` (`{ ...actual, __esModule: true, useReducedMotion: () =>
  mockUseReducedMotion() }`, p. ej. `src/components/__tests__/pet-hero-header.test.tsx`).
  R16 pide el caso «ningún anillo» y no dice cómo simularlo. Aviso A18.
- `EXPO_PUBLIC_API_URL` ya acaba en `/v1`: es la causa de F2. Los tests con
  `fetchFn` simulado no lo ven, porque comparan contra la URL que la propia spec
  escribe; en dispositivo daría `/v1/v1/…` y 404.

### 1. Checklist de firma (plan_canvas-parity §4 + plan_mejoras §4) — FALLO

- Anclas grep ejecutadas y con salida esperada: OK con avisos A3 y A5 (punto 3).
- Cada R-id con test nombrado, fichero exacto y fila de trazabilidad: FALLO F6
  (sin prefijo `#209`, `-t` que colisiona) (punto 4).
- Candados no tautológicos y mutaciones en rojo: OK. M1–M6 dan rojo donde deben
  (punto 4 y este informe).
- Clases contadas contra las guardas de carta: FALLO F3, F4, F5, F7, F8.
- Copy literal desde R1 y canvas: OK con A1 (R17 da claves, no literales) (punto 2).
- Artboards congelados de la versión aprobada: punto abierto A17.
- Decisiones abiertas cerradas por escrito para Codex: avisos A6, A10, A11, A12,
  A13, A14.
- Sin coste, sin recursos AWS, sin dependencias nuevas, sin `expo-linear-gradient`: OK.
- Extras de plan_mejoras §4 (migración de backend, fuga de existencia entre
  mascotas): no aplican; #209 es solo móvil y el PUT ya exige `owner`.

### F8 (nuevo). `layout.test.tsx` no está en R3 ni en R24 — FALLO

- R3 coloca `<Stack.Screen name="nutrition-profile" …/>` «junto a la de
  `meal-schedule`» y solo pide el `it('R3: …')` que lee fuentes.
- `src/app/__tests__/layout.test.tsx` cuenta los hijos de `Stack.Protected`
  (`toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1)` y otras cuatro cuentas parecidas) y fija
  posiciones (`slice(0, 7)` con `meal-schedule` y `pairing` seguidos, «décimo hijo»,
  «undécimo», «duodécimo», «decimotercer», `slice(10, 12)`).
- M6 (scratch `audit209/m6.log`): con la línea después de `meal-schedule`,
  `layout.test.tsx` da `Tests: 10 failed, 23 passed`; sin ella (`m6base.log`),
  `33 passed`. Primer rojo: `Expected length: 14 / Received length: 15`.
- Si va al final del grupo protegido (tras `edit-profile`), solo cambian las
  cuentas `toHaveLength`; en medio de la lista, cambian también todos los índices.

## Avisos (no bloquean por sí solos)

- A1. R17 da claves de catálogo, no literales, para algunos errores.
- A2. `profile.editProfile` («Editar perfil») ya existe y no se cita.
- A3. El cwd de las anclas no es uniforme (unas desde la raíz, otras desde
  `mobile-pet-tracker/`).
- A4. El candado de R25 se llama `#209 R24: …`: los R-ids van cruzados.
- A5. N y los deltas quedan «medido» sin cifra esperada (R23, R24).
- A6. Las filas nuevas de `CTA_ROWS` no dan su cuarta columna (`keeps`). La CTA del
  wizard usa `isDisabled`, y la spec no dice si entra en `disabledCtas` ni cómo
  queda `KEEP_OPACITY`.
- A7. La lista de sitios de #166 R3 (`border-lip-gray`) olvida la fila «en curso»
  de Generando y cuenta un enlace de Horario cuando en el fuente hay dos
  (`nutrition-profile-edit` y `nutrition-profile-create`).
- A8. El enlace «Crear perfil nutricional» de Horario (R20) no tiene artboard.
- A9. Etiqueta G4 ambigua entre planes; formato de casilla distinto al de las
  enmiendas previas (punto 8).
- A10. La CTA «Guardar y generar plan» (R13) no tiene testID propio. design.md dice
  «pie con la CTA única»; si es `nutrition-questionnaire-next` también en Salud,
  hay que decirlo.
- A11. El hueco de la barra de pasos (`gap-1.5`, 6 px en el canvas) no está en R25.
- A12. Generando: R25 no da las clases del título, del cuerpo ni de los
  `PingRing`. `PingRing` exige `className` y `testID`, y R16 solo da `delay`.
- A13. CTA de Nutrición: R25 dice «se añade `w-full`»; el orden de la casa en
  `CTA_ROWS` es `w-full h-14 rounded-16 bg-accent`. Decirlo literal.
- A14. La receta del `TextInput` numérico de R25 (`flex-1 text-28 font-black
  text-foreground`) se aparta de la receta compartida que fija #62 R12 y no da
  color de placeholder.
- A15. `plan_mejoras` dice «100 para húmedo»; la spec usa 90 (design_ola0 Q1).
  Conviene corregir el plan.
- A16. Conflictos textuales previstos con #208 y #220 en `ALL_USES`/`blocks`, #98 R10,
  #62 R14, `CTA_ROWS` y las cuentas de `layout.test.tsx` (punto 7).
- A17. Canvas congelado desde la versión viva, no desde la v140 aprobada en G1, sin
  la re-comprobación que la propia spec exige (punto 6).
- A18. R16 no dice cómo simular `useReducedMotion` en el test. Prescribir la
  intención: `jest.mock('react-native-reanimated')` con `jest.requireActual`,
  `__esModule: true` y `useReducedMotion` controlable, como en
  `src/components/__tests__/pet-hero-header.test.tsx`.

## Erratas propuestas

Todas en `specs/mobile-nutrition-questionnaire/requirements.md` salvo que se diga
otra cosa.

- F1 (R1 y decisión 7).
  - Antes: «WHEN el código llama a `putJson(url, token, body, fetchFn)`, THE
    SYSTEM SHALL hacer `fetchFn(url, { method: 'PUT', …`»
  - Después: «WHEN el código llama a `putJson(baseUrl, path, token, body, fetchFn)`,
    THE SYSTEM SHALL hacer `fetchFn(apiUrl(baseUrl, path), { method: 'PUT', …`»
  - Decisión 7 sin cambio de texto, pero es la firma de `patchJson` la que manda.
  - design.md, fila de `http.ts`: sin cambio («copia de `patchJson` con
    `method: 'PUT'`» ya es correcto).
- F2 (R2).
  - Antes: «hacer el PUT a `${baseUrl}/v1/pets/${petId}/nutrition-profile`»
  - Después: «hacer el PUT con `putJson(baseUrl, \`/pets/${petId}/nutrition-profile\`, token, input, fetchFn)`»
  - El test R2 aserta contra la constante de endpoint de perfil que ya tiene
    `src/api/__tests__/nutrition.test.ts`
    (`'http://example.test/v1/pets/pet-1/nutrition-profile'`), con su
    `baseUrl = 'http://example.test/v1/'`. Así un `/v1/v1` da rojo.
- F3 (R24, design-drift).
  - Antes: «`describe('#209 R24: Cuestionario sin deriva')` nuevo, copiado del de
    `#175 R10: Documentos sin deriva`.»
  - Después: «`describe('#209 R24: Cuestionario sin deriva')` nuevo, con tres `it`
    copiados de `#175 R10: Documentos sin deriva`: «no deja hex, clases arbitrarias,
    StyleSheet ni sombras sueltas», «no deja text-accent suelto» y «no trae
    dependencias vetadas, useThemeColor ni emoji». No se copian «usa solo los radios
    card, xl, full, 24 y 16» ni «importa exactamente los tres iconos…»: R25 usa
    `rounded-tile`, `rounded-14` y `rounded-10`, y los iconos los fija la decisión 12.»
- F4 (R24, design-drift).
  - Antes: «Diccionario de `rounded-16`: la entrada nueva cuenta 1 y `food` sube +1.»
  - Después: «Diccionario de `rounded-16`: la entrada nueva cuenta 2 y `food` sube +1.»
- F5 (R24, chunky).
  - Antes: «`ctaFiles` y `consumers` incluyen el fichero nuevo.»
  - Después: «`ctaFiles` y `consumers` incluyen el fichero nuevo. En `consumers` se
    quita `'screens/food/index.tsx'` de la lista literal (`// #209 R24`), porque ahora
    entra por `CTA_ROWS` y saldría duplicado en #177 R7.4. Además se enmiendan, con
    la cifra medida: #177 R6.2 (`Button.Label` y `text-17`), R7.1, R7.3 (`radii`) y
    R7.5 (`style={chunkyLip.primary…}`), como hace #208 §R21.»
- F6 (nombres de test, todos los R-ids, y tasks.md).
  - Antes (ejemplo): «`it('R1: putJson envía PUT con cuerpo JSON y Bearer')`»
  - Después: «`it('#209 R1: putJson envía PUT con cuerpo JSON y Bearer')`», y así en
    todos los R-ids y en traceability.md.
  - tasks.md, antes: «`bunx jest <ruta> -t 'R<n>'`»; después:
    «`bunx jest <ruta> -t '#209 R<n>:'`».
- F7 (R24, guardas no citadas).
  - Antes: «Test: las cinco suites citadas, en verde.»
  - Después: «Test: estas suites, en verde: `design-drift`, `consistency-classnames`,
    `chunky-cta-canvas-fidelity`, `legibility-classnames`,
    `profile-canvas-fidelity` (#173, listas de `rounded-tile` y `text-13`),
    `alerts-canvas-fidelity` (#174 R12, inventarios de `rounded-10` y `text-15`) y
    `app/__tests__/layout.test.tsx` (F8).»
  - Añadir a la lista de consistency: «#62 R12: `textInputs` 6 pasa a 6 + 4 y
    `withPlaceholder` según el placeholder de R25 (`// #209 R24`). #98 R10:
    agregado de `style={CONTINUOUS_CORNER}` + N.» y cambiar «#62 R14: `directUses`»
    por «#98 R10 y #62 R14».
  - Añadir a design-drift: «#179 R13: el fichero nuevo entra en la lista de
    `text-17`. E2.3: la etiqueta `<Text className="text-13 font-extrabold
    text-foreground">` del enlace de Horario sube su `split` a `toHaveLength(2 + 2)`
    (`// #209 R24`), o el enlace usa otra clase de texto.»
- F8 (R3).
  - Antes: «en `src/app/_layout.tsx`, junto a la de `meal-schedule`.»
  - Después: «en `src/app/_layout.tsx`, como último hijo del grupo `Stack.Protected`,
    justo después de `edit-profile`. Cada `expect(children).toHaveLength(…)` del grupo
    protegido en `src/app/__tests__/layout.test.tsx` gana `+ 1 // #209 R3`.»

## Erratas aplicadas (spec_author, 2026-10-26)

Ficheros tocados: los cuatro de `specs/mobile-nutrition-questionnaire/`
(`requirements.md`, `design.md`, `tasks.md` y `traceability.md`). No se
toca código, ni `docs/`, ni `feature_list.json`. No hay commit: lo hace el
leader.

Las cifras se midieron en una semilla del scratch, nunca en el repo:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/erratas209/`.
Es una copia de `origin/dev` `2041e2b3` con un wizard que sigue la forma de
R25, más las enmiendas de R3, R23 y R24.

### Mapa errata o aviso → R-id

| Errata o aviso | R-id | Qué queda escrito |
|---|---|---|
| F1 | R1, decisión 7 | `putJson(baseUrl, path, token, body, fetchFn)` hace `fetchFn(apiUrl(baseUrl, path), { method: 'PUT', … })`, como `patchJson` |
| F2 | R2 | PUT vía ``putJson(baseUrl, `/pets/${petId}/nutrition-profile`, …)``, sin `/v1` en la ruta. El test de `ok` aserta `profileEndpoint` (`'http://example.test/v1/pets/pet-1/nutrition-profile'`) |
| F3 | R24, R25 | `describe('#209 R25: Cuestionario sin deriva')` con tres `it`. Los de radios e iconos de `#175 R10` no se copian |
| F4 | R24 | `#178 R13`, `rounded-16`: wizard `2`, food `2 + 1` |
| F5 | R24 | `CTA_ROWS` con dos filas, `consumers` sin `food`, `radii`, `#177 R6.2`, `R7.1`, `R7.3` y `R7.5` con cifra medida |
| F6 | R1–R26, tasks.md, traceability.md | Todos los nombres llevan el prefijo `#209 R<n>:` (56 en requirements.md) y el comando usa `-t '#209 R<n>:'` |
| F7 | R24 | Siete suites: las seis de `src/__tests__/` más `layout.test.tsx`. `#62 R12` y `#98 R10` llevan cifra medida |
| F8 | R3, design.md §Riesgos | `nutrition-profile` va al final de `Stack.Protected`, tras `edit-profile`. Cinco enmiendas en `layout.test.tsx` y un `it` nuevo de orden. La colisión con #208 R4 queda en §Riesgos |
| A1 | R17 | Tabla de tres columnas con los literales `es` verificados contra `catalog.ts`. Error con `className="text-danger"` |
| A2 | R20, R23 | «Editar perfil» pinta `t('profile.editProfile')`, con `accessibilityLabel={t('nutritionQuestionnaire.editProfileLabel')}` |
| A3 | Convenciones, R3, R23, R24, R25, R26 | Todas las anclas se dan desde `mobile-pet-tracker/` (con `../docs/` para la carta) |
| A4 | R24, R25 | El candado se llama `#209 R25` |
| A5 | R23, R24 | N = 96, y cada delta como base + delta con la cifra medida |
| A6 | R24 | `keeps` de las dos filas de `CTA_ROWS`. Ninguna entra en `disabledCtas` ni lleva `KEEP_OPACITY`. Los nombres `canContinue`, `handleNext` y `openNutritionProfile` son obligatorios |
| A7 | R24, R25 | `#166 R3` y `#177 R7.1` con `+ 5`: radio sin elegir, «en curso», «pendiente» y los dos enlaces de Horario |
| A9 | R26, tasks.md, design.md | Casilla `- [ ] Enmienda #209 aprobada por humano`, en el formato de las previas, sin G4. No se marca |
| A10 | R13, R25 | CTA única `nutrition-questionnaire-next` en los cuatro pasos. El test de R13 aserta su texto |
| A11 | R25 | Barra de pasos `flex-row gap-1.5 px-5` y clases de segmento |
| A12 | R16, R25 | Clases y testIDs de Generando: anillos `nutrition-generating-ring-0/1`, `nutrition-generating-pingo`, título, cuerpo y lista. El círculo «en curso» es estático (decisión 13) |
| A13 | R24, R25 | Literal `w-full h-14 rounded-16 bg-accent` |
| A14 | R25 | `NumberField` y `OtherField` sin `placeholder`, así que `withPlaceholder` sigue en 5. La regla de `+ 1` queda escrita por si algún día se añade uno |
| A17 | nota del canvas, design.md §Riesgos | Lo cerró el leader (artboards idénticos a la v140 `1793036268-d302`, sha256 a sha256, 2026-10-26). Se reescribió la nota y no se re-congeló |
| A18 | R16 | Patrón de mock: `jest.mock('react-native-reanimated')` con `jest.requireActual`, `__esModule: true` y `useReducedMotion` controlable, como `pet-hero-header.test.tsx` |

### Valores medidos

Comando de suites, desde la semilla `mobile-pet-tracker/`:
`timeout 580 bunx jest src/__tests__ src/app/__tests__/layout.test.tsx`.

| Árbol | Salida |
|---|---|
| Base `2041e2b3` (`base.log`) | `Tests: 1 failed, 950 passed, 951 total`. El rojo es `hosting-artifacts.test.ts`, que ya falla en la base |
| Semilla sin enmiendas (`seed.log`) | `Test Suites: 8 failed, 28 passed, 36 total`, `Tests: 28 failed, 924 passed, 952 total` |
| Semilla con todas las enmiendas (`seed8.log`, la última) | `Test Suites: 1 failed, 35 passed, 36 total`, `Tests: 1 failed, 961 passed, 962 total`. Solo `hosting-artifacts.test.ts` |

Pares Expected/Received de `seed.log`, que son los deltas escritos en la spec:

| Candado | Expected (base) | Received (semilla) | Delta |
|---|---|---|---|
| `#62 R1` `rounded-16 bg-accent` | 19 | 21 | `+ 2` |
| `#62 R12` `textInputs` | 6 | 8 | `+ 2`. La auditoría proponía `6 + 4`; con dos `<TextInput` son `+ 2` |
| `#98 R10` `CONTINUOUS_CORNER` | 55 | 61 | `+ 6`. La auditoría medía 60 |
| `#166 R3` `border-lip-gray` | 12 | 17 | `+ 5` |
| `#179 R13` E2.3 `split` | 2 | 4 | `2 + 2` |
| `#177 R6.2` `text-17` | 30 | 32 | `+ 2` |
| `#177 R7.1` `border-lip-gray` | 12 | 17 | `+ 5` |
| `layout.test.tsx` hijos protegidos | 14 | 15 | `+ 1` |

Otros rojos de `seed.log` sin cifra en el mensaje, que se ponen verdes con la
enmienda de su lista o diccionario: `#166 R2`, `#178 R13`, `#179 R13`
(`text-17`), `#65 R18`, `#174 R12`, `#177 R3.3`, `R7.2`, `R7.3`, `R7.4`,
`R7.5` y `R8.1`, `#194 R4` (`edit-profile`), `#173 R2` y `#173 R2.4`.

Anclas por contenido (base → semilla), desde `mobile-pet-tracker/`:

| Comando | Base | Semilla |
|---|---|---|
| `grep -cF 'name="nutrition-profile"' src/app/_layout.tsx` | 0 | 1 |
| `grep -cF 'R20_NUTRITION_QUESTIONNAIRE' src/__tests__/ui-copy-table.ts` | 0 | 3 |
| `grep -cF "'nutritionQuestionnaire." src/i18n/catalog.ts` | 0 | 154 |
| `grep -cF "'nutritionQuestionnaire.unitKg'" src/i18n/catalog.ts` | 0 | 0 |
| `grep -cF '#209 R25' src/__tests__/design-drift.test.ts` | 0 | 4 |
| `grep -cF '#209 R24' src/__tests__/consistency-classnames.test.ts` | 0 | 8 |
| `grep -cF '#209 R24' src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 | 10 |
| `grep -cF '#209 R24' src/__tests__/design-drift.test.ts` | 0 | 7 |
| `grep -cF '#209 R24' src/__tests__/legibility-classnames.test.ts` | 0 | 2 |
| `grep -cF '#209 R24' src/__tests__/alerts-canvas-fidelity.test.ts` | 0 | 3 |
| `grep -cF '#209 R24' src/__tests__/profile-canvas-fidelity.test.ts` | 0 | 2 |
| `grep -cF '#209 R3' src/app/__tests__/layout.test.tsx` | 0 | 11 |
| `grep -cF '## Enmienda #209' ../docs/ui-guidelines.md` | 0 | sin semilla (R26 es docs) |

La spec pide `≥ 1` en las seis suites de R24. Las cuentas exactas de la
semilla son orientativas: dependen de cuántas líneas comparta cada enmienda.

Cuentas del wizard en la semilla (`grep -cF`, en
`src/screens/nutrition-questionnaire/index.tsx`): `rounded-16 bg-accent` 1,
`<TextInput` 2, `CONTINUOUS_CORNER` 6, `border-lip-gray` 3, `rounded-16` 2,
`placeholder` 0, `nutritionQuestionnaire.other'` 2. En Horario,
`border-lip-gray` pasa de 2 a 4, `neutralCompact` de 1 a 3 y `hitSlop` de 1 a 3.
En Nutrición, `rounded-16` pasa de 2 a 3 y `text-17` de 1 a 2.

Valores `es` de R17, verificados en `src/i18n/catalog.ts` de la base:
- `common.somethingWentWrong` «Algo salió mal»;
- `common.cannotReachServer` «No se pudo conectar con el servidor»;
- `mealSchedule.errorForbidden` «Solo el dueño puede generar el plan»;
- `mealSchedule.registerWeightFirst` «Primero registra un peso».

### Hallazgos nuevos (ya escritos en la spec)

- **Colisión `'kg'` con `#65 R18`.** Una clave de catálogo con valor `kg`
  choca con el ` kg` de Salud y pone `#65 R18` en rojo. No hay `unitKg`: el
  wizard escribe `unit="kg"` literal. El catálogo queda en 77 claves por
  locale (154 en total) y el bloque en 96 filas.
- **`hitSlop` en los enlaces de Horario.** Miden `h-9` (36 pt), así que llevan
  `hitSlop={TOUCH_SLOP}`. Eso mueve `#179 R13` de `1` a `1 + 2`.
- **Círculo «en curso» estático.** `src/theme/motion.ts` no tiene constante
  `MOTION_*` de giro. Decisión 13, R25 y design.md.
- **Colisión con #208 en `layout.test.tsx`.** #208 R4 inserta tras
  `meals-history` y suma `+ 1 // #208 R4` a las cuatro cuentas. #209 inserta
  al final. Quien mergee segunda conserva los dos `+ 1` y los dos sufijos.

### Observaciones (no cambian ningún R)

- El título de NutricionSinPerfil en el canvas usa `tracking -0.01em`, y R25
  usa `tracking-title`, que es el token de la casa.
- Algunos nombres de `it` enmendados quedan con números viejos, por la regla
  de no reescribir el resto del nombre. Por ejemplo, «diecisiete primarios», o
  «limita los márgenes táctiles a Editar y las dos flechas», que ahora también
  cubre los dos enlaces.
- El inventario de `primaryCompact` de `#177 R7.5` no ve el chip de Salud,
  porque es un ternario (`style={isChecked ? chunkyLip.primaryCompact : undefined}`).
  Es un hueco del candado, no de esta spec.
- `hosting-artifacts.test.ts` falla en la base `2041e2b3`. No es de esta
  feature.

### No cerrado

- **Copy `en`.** El canvas no lo da y la spec no lo fija. Lo escribe Codex,
  con las mismas variables que el `es` (R23). No se inventó.
- **A8.** «Crear perfil nutricional» de Horario no tiene artboard. No cambia
  ningún R, así que no se tocó.
- **A15.** `plan_mejoras` dice «100 para húmedo» y la spec usa 90. Es del plan,
  no de la spec; queda para el leader.
- **A16.** Conflictos textuales con #208 y #220 en los agregados. No se tocó,
  por indicación del leader. design.md §Riesgos solo registra la colisión de
  `layout.test.tsx` que pedía F8.
