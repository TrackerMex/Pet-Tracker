# Auditoria del inventario de candados — #200 mobile-canvas-nutrition

Estado: COMPLETO (borrador 3). Solo lectura sobre la spec; este es el unico fichero escrito.
Base: worktree `feature/200-mobile-canvas-nutrition` (HEAD `1ac1efc2`, base medida `71ff81a1`). Sin jest, sin fetch.
FO = `src/app/(tabs)/__tests__/food.test.tsx` (hoy), CC = `src/__tests__/chunky-cta-canvas-fidelity.test.ts`,
CN = `consistency-classnames.test.ts`, DD = `design-drift.test.ts`, AC = `alerts-canvas-fidelity.test.ts`,
PC = `profile-canvas-fidelity.test.ts`. Todo bajo `mobile-pet-tracker/`.

Patron comun de los huecos: el inventario de la spec sigue los literales que food **quita**, pero no los
candados **agregados** (`readFileSync` sobre todo `src/` no-test con `filesMatching` / `inventory` / `count`)
que un fichero nuevo (`screens/food/index.tsx`) o una clase nueva desplaza. Ningun `it` de FO delata esos rojos.
Todos caen en la regla de parada («un rojo fuera de este inventario detiene la implementacion»): la «enmienda
mecanica permitida» solo cubre `it` que comparan contra el literal exacto que el R quita, y aqui lo que cambia es
una lista o una cuenta por una clase que se ANADE.

## Faltan (it que se pondran rojos y no estan inventariados)

| # | fichero › describe › it | literal / estructura que lo rompe | hoy afirma | pasa a afirmar | R |
|---|---|---|---|---|---|
| F1 | FO › `#155 R4: Comida sin mascotas presenta a Pingo` › `queda en el sitio del vacio que sustituye` (L1173-1180) | R2 envuelve `food-title` en `View food-title-row`: el hermano de `food-empty` deja de ser `food-title` | `slot.parent.children.map(testID)` `toEqual(['food-title','food-empty'])` | `['food-title-row','food-empty']` | R2 |
| F2 | FO › `#155 R9: sin plan de comidas, Pingo ensena el cuenco` › `queda en el sitio del vacio que sustituye` (L1206-1213) | R9 mete los dos enlaces en `View food-links` (y R10 puede envolverlos en `RiseIn`). Este `it` ademas afirma profundidad: `parent.parent.parent === 'screen-food'`; si R2 deja los `gap-4` (L179, L198) o los quita, o si `RiseIn` anade un nivel, la profundidad cambia | `slot.parent.children.map(testID)` `toEqual(['food-plan-empty','meal-schedule-link','meals-history-link'])` y la cadena de padres hasta `screen-food` | `['food-plan-empty','food-links']` (o el nodo `RiseIn`, si se envuelve en la rama sin plan: la spec no lo decide) y profundidad re-medida con el arbol final | R9 (R10, y R2 si cambia los wrappers) |
| F3 | CC › `#177 R7.4: solo la definicion y los diecisiete consumidores usan el hook` | R3 anade `import`/llamada `useChunkyLip` en `screens/food/index.tsx`; la clave nueva sale en `Object.keys(inventory(/useChunkyLip/g))` | claves == `[...consumers, 'theme/chunky-lip.ts']` (`consumers` = `ctaFiles` + `screens/reminders/index.tsx`; #197 R10 le anade alerts y meal-schedule) | `consumers` + `'screens/food/index.tsx'`; el bucle siguiente (`const chunkyLip = useChunkyLip();` exactamente 1) pasa a cubrir tambien food. Misma constante `consumers` que enmienda #197: conflicto de merge probable | R3 |
| F4 | CC › `#177 R7.5: inventario de los tres estilos y el tile` (3.a expectativa, L190) | R6 pone `style={chunkyLip.primaryCompact}` en `View meal-pending-${index}` | `inventory(/style=\{chunkyLip\.primaryCompact\}/g)` `toEqual({ 'screens/reminders/index.tsx': 1 })` | `{ 'screens/food/index.tsx': 1, 'screens/reminders/index.tsx': 1 }`. Nota: `#177 R8.1` (`idsWhere` sobre `<Button`), `#177 R3.3` y L196 (`['primaryCompact', ['reminders-add-link']]`) NO se rompen: el control es `View` dentro de `Pressable`, no `Button` | R6 |
| F5 | CC › `#177 R7.3: inventario de los veintisiete radios de dieciseis` (L180-181, 2 expectativas) | R9: `rounded-16` en la className de los enlaces (spec L322); hoy food no tiene ninguno | `inventory(/\brounded-16\b/g)` `toEqual(radii)` y `count(...)` `toBe(26 + 1 + 1 + 1 + 2)` | `radii['screens/food/index.tsx'] = n` y `+ n` en la cuenta, con n = 1 si los dos enlaces comparten constante, 2 si cada `Pressable` lleva su literal (la spec dice «cada uno como Pressable con className exacta», no fija cuantos literales) | R9 |
| F6 | CC › `#177 R6.2: recuentos de etiquetas` (L164 y L166, 2 expectativas) | R5: `food-meals-title` con `text-17 font-extrabold text-foreground`; hoy food no tiene `text-17` | `count(/text-17/g)` `toBe(8 + 15 + 1 + 1 + 1 + 1)` y `count(/text-17 font-extrabold text-foreground/g)` `toBe(3 + 3)` | `... + 1` en las dos (re-medir con el fuente final; L165 y L167 no cambian porque food no usa `<Text className="text-17 font-extrabold text-accent-foreground">` ni `text-17 font-bold text-accent-strong`) | R5 |
| F7 | DD › `#179 R13: Horario e Historial fieles al canvas` › `sitúa el título antes del resumen y los errores antes de las acciones` (L1219-1225) | R12 elimina `testID="meal-schedule-heading"` (B24 pasa a 0) | `schedule` contiene el anchor `testID="meal-schedule-heading"` y `indexOf(heading) < indexOf(summary)` | el anchor pasa a `testID="meal-schedule-header"` (el `<ScreenHeader testID=...>` literal de la spec L369) con el mismo orden respecto a `meal-schedule-summary`; hoy el item 30 solo cita el `it` vecino `reutiliza entrada…` | R12 |
| F8 | DD › `#179 R13: …` › `limita text-22 a Horario y text-17 al inventario de E1.2 (enmendado por #177 R10)` (L1227-1254) | R5: `food-meals-title` lleva `text-17`; `screens/food/index.tsx` entra en el inventario | `productionFilesMatching(/\btext-17\b/)` `toEqual([… 'screens/edit-profile/index.tsx', 'screens/forgot/index.tsx', …])` | la lista gana `'screens/food/index.tsx'` entre `edit-profile` y `forgot` (orden de `.sort()`). El `text-22` de MS (3 ocurrencias) y el `text-17` de MS (2) NO se pierden con R12 (el heading usa `text-2xl`), asi que MS no sale de la lista | R5 |
| F9 | AC › `#174 R12: inventarios` › `limita $token a su inventario de producción…` (`it.each`, 3 filas afectadas de 5; L196-238) | (a) `tracking-caps`: R3 (caps del heroe, spec L193). (b) `text-15`: R5 (`food-meals-progress`, spec L234). (c) `tracking-title`: R12 y R13 quitan los headings de MS (L200) y MH (L226), que son su unico uso de `tracking-title` en esos ficheros (`text-2xl font-black tracking-title text-foreground`) | (a) `['screens/alerts/index.tsx','screens/meal-schedule/index.tsx']`; (b) lista de 14 con `docs` seguido de `forgot`; (c) lista de 13 con `screens/meal-schedule/index.tsx // #179 R4` y `screens/meals-history/index.tsx // #179 R9` | (a) + `'screens/food/index.tsx'` entre alerts y meal-schedule; (b) + `'screens/food/index.tsx'` entre `docs` y `forgot`; (c) SIN `meal-schedule` ni `meals-history` (salvo que `ScreenHeader` de #197 vuelva a introducir la clase en MS/MH, lo que no ocurre: vive en `components/screen-header.tsx`; el leader re-mide tras #197, que ya enmienda esta lista para sus consumidores) | (a) R3, (b) R5, (c) R12/R13 |
| F10 | PC › `#173 R4: avatars solo en Perfil` › `limita la variante nueva al consumidor Perfil` (L38-40) | R2: segundo `<PetSwitcher variant="avatars" …/>` en food (spec L169; B11 pasa de 0 a >=1) | `filesMatching(/variant="avatars"/)` `toEqual(['screens/profile/index.tsx'])` | `['screens/food/index.tsx','screens/profile/index.tsx']`. #196/#199 tambien tocan `PetSwitcher`: re-medir tras sus merges | R2 |
| F11 | PC › `#173 R2: inventario de radios nuevos` › `reserva rounded-hero al Card compartido y el skeleton de Perfil` (L44-46) | R3: `rounded-hero bg-accent p-4.5` en food | `toEqual(['components/card.tsx','screens/alert-detail/index.tsx','screens/profile/index.tsx'])` | + `'screens/food/index.tsx'` entre `alert-detail` y `profile` | R3 |
| F12 | PC › `#173 R2.4: inventario de tamaños nuevos` › `limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)` (L72-91) | R8: `food-ai-body` con `text-13 leading-body text-foreground` (primera aparicion de `text-13` en food) | lista de 16 sin food | + `'screens/food/index.tsx'` entre `edit-profile` y `forgot`. `text-26` y `rounded-tile` NO se ven afectados (food no los usa) | R8 |
| F13 | CN › `#98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` (L411 `food.match(/text-accent-strong\b/g)).toHaveLength(1)`) y LG › `#61 R4: el acento como tinta usa accent-strong` › `%s pinta con text-accent-strong (%i)`, fila de food (1) (L170-172) | **Estado intermedio R5 → R6**. R5 anade `food-meals-progress` con `text-accent-strong` (spec L234) mientras la insignia «servida» vieja (`food.tsx` L339, `text-accent-strong`) vive hasta R6 (orden R5 antes que R6 en tasks.md) | food = 1 ocurrencia | tras el commit de R5, food tiene 2 → CN L411 y la fila de food de `inkSites` ROJAS hasta que R6 retire la insignia. El item 18 dice «la cuenta de `text-accent-strong` (1) no cambia», cierto solo al final. Hay que inventariar: R5 sube a 2 (CN L411 + fila `inkSites` de food, y con ella el `it` `suma las trece ocurrencias` L174 si se enmienda la fila) y R6 vuelve a 1; o prescribir que la fila se mantenga y el implementador espere al commit de R6 (rompe «un commit verde por R») | R5 (R6) |

Fuera de F1–F13 se descartaron, tras `git grep`, por no romperse con #200: DD L1185 (`forbidden`, no hay `StyleSheet`/`shadow` en el codigo nuevo), DD L1203-1204 (`hitSlop` MS 1 / MH 2: son Editar y las flechas del calendario, no la cabecera), DD L1257-1260 (`rounded-24` cuentas de MS/MH), DD L1031 (lista de Docs, no food), `edit-profile.test.ts` L10, `geofences-canvas-fidelity` L79 (solo geofences), `food-plan-skeleton` (`h-40 rounded-card`, FO L1130: la spec no lo toca), `bg-accent-soft` (food no lo usa), CC `#177 R3.3`/`R8.1` (`View`, no `Button`).

## Sobran o mal descritos

| # | fila del inventario | problema |
|---|---|---|
| S1 | item 14 (FO `#168 R10 › la llamada de 50 respeta ReduceMotion.System` y `› acota la llamada a 100…`) | Ninguno de los dos usa indice de llamada: buscan por valor (`calls.find(([value]) => value === 50)`, `toHaveBeenCalledWith(100, expect.any(Object))`). `withDelay(200, withTiming(50, MOTION_RING_TIMING))` sigue llamando `withTiming(50, cfg)` con `reduceMotion: System`: siguen en verde. No se ponen rojos; la descripcion «indice de llamada» es falsa. |
| S2 | item 22 (FO `R6 › shows the AI recommendation only when the explanation is present`, «solo si aserta tamaño o color de `food-icon-sparkles`») | No aserta nada del icono (solo `getByText('Recomendación IA')` y el cuerpo): no se pone rojo. Fila condicional que no aplica. |
| S3 | item 18, vineta «R6 +1» (y B8 «6 en `$FS` (R5 1, R6 1, R7 1, R8 1, R9 2)») | Suma 1 (hoy, `meal-row`) + 6 = 7, no 6. El 6 final solo cuadra si el `style={CONTINUOUS_CORNER}` de la fila (hoy L298) desaparece en R6 y reaparece en el tile: R6 es neto 0, no +1. La descripcion confunde «el tile suma 1» con «el total de food suma 1». Reescribir como «R6: 0 neto (la fila pierde el suyo, el tile lo gana)» y dar la escalera de food 1 → R5: 2 → R6: 2 → R7: 3 → R8: 4 → R9: 6 (tambien en la cuenta global de CN L407, que sube igual). |

## Observaciones (no son rojos; decisiones que la spec deja abiertas)

- O1. CC `#177 R12.1/R12.2/R12.3` (guards de carta: sin corchetes, sin hex, sin `StyleSheet`, comentarios con `#177 R<n>`) solo recorren `consumers`. Si F3 se resuelve anadiendo food a `consumers`, esos guards pasan a cubrir `screens/food/index.tsx` y el fichero debe cumplirlos: `style={[CONTINUOUS_CORNER, chunkyLip.hero]}` lleva corchetes (el guard de corchetes de CC busca clases `-[...]`, ARBITRARY_CLASS de DD busca `[A-Za-z0-9_-]+-\[[^\]]+\]`: un array de estilo no coincide, pero hay que medirlo con el regex exacto de CC R12.1) y cualquier comentario `#177` suelto rompe R12.3.
- O2. CC `#177 R11.1` fija (via `preservedLines`, que #197 R21 sustituye por las lineas de «Punto 13») la frase «Generar plan es tonal ... y sin labio». R14 de #200 pone `style={chunkyLip.violet}` en `generate-plan-button` de **Horario** (MS, no Nutricion), y R16 (a)-(d) no reescribe esa frase: la carta quedaria contradiciendo la pantalla sin que ningun test lo vea. No se pone rojo; decidir si la Enmienda #200 la corrige.
- O3. `src/screens/welcome/index.test.tsx` (~L531-545) bloquea el texto de la «Enmienda #152» de la carta, que nombra `KCAL_BAR_TIMING`. R4 elimina esa constante de la pantalla: sigue verde, pero la carta seguira nombrando una constante que ya no existe (R16 no la toca).
- O4. R10 dice «plan cargado» para los `delayMs` de los enlaces, pero `food-links` tambien se pinta sin plan (F2); la spec no dice si en la rama sin plan los enlaces van dentro de `RiseIn`, y de eso depende el valor que F2 pasa a afirmar.
- O5. `leading-body` / `leading-note` / `text-11` / `text-24` / `size-9` / `p-4.5`: sin inventario de ficheros hoy (git grep), asi que food no rompe nada. Si #197 anade un `filesMatching(/leading-(body|note)/)` (probable al crear los tokens), food entra en esa lista y el leader debe re-medirla tras el merge.
- O6. `food-plan-skeleton` conserva `h-40 w-full rounded-card` (FO L1130 `#113 R5`) mientras el heroe pasa a `rounded-hero`: el esqueleto ya no reserva la forma del heroe. No es un candado; decision de diseno (la spec no lo toca).
- O7. Item 27 (LY): la fila `['meal-schedule','']` sale de `#194 R4`, pero la spec no dice donde se afirma el nuevo `{ headerShown: false }` de `meal-schedule`; el unico it de LY para `meals-history` (L569-581) cambia su titulo («con cabecera nativa») ademas de la aserción. Deberia haber un `it` LY para `meal-schedule` en la lista de R12.

## Anclas (§Base medida, medidas en este worktree con `grep -cF` / `test ! -e`)

Todas dan el valor «Hoy» declarado; ninguna falla. Las marcadas dependen de #197/#199 y el leader las re-mide tras su merge.
B8 coincide en «hoy» (1, en `meal-row` L298) pero el objetivo «6» sale de una escalera mal descrita (S3).

| Ancla | Medido | Declarado hoy | OK |
|---|---|---|---|
| B1 `test ! -e src/screens/food` | ausente | ausente | si |
| B2 `grep -c '' $F` | 468 | 468 | si |
| B3 FO en `(tabs)/__tests__` | presente | presente | si |
| B4 `food.tsx'` en ui-copy-table | 25 | 25 | si |
| B5 `screens/food/index.tsx'` en ui-copy-table | 0 | 0 | si |
| B6 `<Card` | 6 | 6 | si |
| B7 import de card | 1 | 1 | si |
| B8 `style={CONTINUOUS_CORNER}` | 1 | 1 | si (objetivo 6: ver S3) |
| B9 `text-accent-strong` | 1 | 1 | si |
| B10 `padding: 24,` | 1 | 1 | si |
| B11 `variant="avatars"` | 0 | 0 | si |
| B12 `KCAL_BAR_TIMING` | 2 | 2 | si |
| B13 `strokeOpacity={0.2}` | 1 | 1 | si |
| B14 `export const MOTION_RING_` | 0 | 0 | si |
| B15 `t('food.pending')` | 1 | 1 | si |
| B16 `food.pending` en catalog | 2 | 2 | si |
| B17 `<Sparkles size={18}` | 1 | 1 | si |
| B18 `<ChevronRight size={20}` | 2 | 2 | si |
| B19 `tracking-tight` (#197) | 1 | 1 | si (re-medir tras #197) |
| B20 `headerShown` en `_layout.tsx` (#199) | 2 | 2 | si (re-medir tras #199) |
| B21 `meal-schedule` con `title: ''` | 1 | 1 | si |
| B22 `meals-history` con `title: ''` | 1 | 1 | si |
| B23 `HomeEntrance` MS / MH | 5 / 5 | 5 / 5 | si |
| B24 headings MS / MH | 1 / 1 | 1 / 1 | si |
| B25 `insets.bottom + 24` MS / MH | 1 / 1 | 1 / 1 | si |
| B26 `<ScreenHeader` MS / MH | 0 / 0 | 0 / 0 | si |
| B27 `chunkyLip.violet` MS | 0 | 0 | si |
| B28 `rise-in.tsx` (#199) | ausente | ausente | si (re-medir tras #199) |
| B29 `screen-header.tsx` (#197) | ausente | ausente | si (re-medir tras #197) |
| B30 `--leading-note` en global.css (#197) | 0 | 0 | si (re-medir tras #197) |
| B31 `Enmienda #200` en la carta | 0 | 0 | si |
| B32 NC ausente | ausente | ausente | si |

## Alcance auditado y limites

Auditado con `git grep`: FO, CC, CN, DD, AC, PC, LG (`legibility-classnames`), `ui-language` (L145-160, L412-539), `ui-copy-table.ts`
(L200-216), LY (`layout.test.tsx` L345-372, L569-581), MT (L76), MS/MH (headings y clases), `tab-headers-canvas` y `empty-state`
(cubiertos por los items 4 y 5; no se encontro nada adicional en ellos).
No verificado (depende de specs ajenas no presentes en este worktree): como enmiendan #197/#199/#196 las listas de F3, F9(c), F10 y
`consumers`; el leader debe re-medir F3, F5, F9, F10 y las anclas B19/B20/B28-B30 tras esos merges.
