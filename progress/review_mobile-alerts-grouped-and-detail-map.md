# review: mobile-alerts-grouped-and-detail-map (#170)
Fecha: 2026-10-12T21:50Z
Veredicto: RECHAZADO

- Worktree revisado: `/home/claude/sites/Pet-Tracker-wt-170`, branch `feature/170-mobile-alerts-grouped-and-detail-map`.
- HEAD revisado: `3719eb75e202543e1e0c1cc7e7de0f73fe4eb582`. H0 = `584ef2d9`. Último commit de código de Codex: `4e74bab9`.
- Sondas de mutación en un worktree propio y desacoplado (`scratchpad/probe170`), nunca en wt-170. Ya está borrado.
- **R17 (smoke manual en dev build de Android) queda pendiente del humano.** La casilla `## Smoke R17` de requirements.md sigue sin firmar. Este veredicto juzga solo el código y el estado del repo.

## Lista cerrada
- [x] `git diff --name-only 584ef2d9 HEAD`, con las exclusiones del handoff, da exactamente 20 ficheros: 17 bajo `mobile-pet-tracker/`, más `specs/mobile-ui-language/design.md`, `traceability.md` e `impl_*.md`.
- [x] No hay deriva de código: `git diff --stat 4e74bab9 HEAD` solo toca `progress/impl_mobile-alerts-grouped-and-detail-map.md` (+20).
- [x] No se tocan backend, infra, dependencias ni componentes compartidos. Codex lo midió en §CIERRE con `git diff --quiet 584ef2d9 -- package.json bun.lock app.json src/components/pet-map.tsx src/components/card.tsx src/api`, que sale 0, y lo he contrastado con el diff.

## Checklist C2 — Estado coherente
- [x] Solo una feature está in_progress: `[(170, 'mobile-alerts-grouped-and-detail-map', 'in_progress')]`.
- [x] `progress/current.md` tiene la sección #170 al día: gate, handoff, E1, E2 y Reanudación 5.

## Checklist C3 — Arquitectura
- [x] `src/utils/alert-sections.ts` y `src/utils/alert-location.ts` son funciones puras, sin React ni red.
- [x] `alert-meta.ts` sigue siendo un dato del tipo: las pantallas no deciden los colores (D4).
- [x] Las pantallas consumen `src/api` y `geofenceKeys` existentes. No se crea cliente nuevo ni se toca `src/api`.
- [x] No hay lógica de negocio fuera de su capa. `PetMap` y `Card` no se modifican.

## Checklist C4 — TDD
- [x] R1–R15 tienen cada uno un `describe` que nombra `#170 R<n>`: language-provider.test.tsx (R1), alert-sections.test.ts (R2), alert-location.test.ts (R7), alerts/index.test.tsx (R3, R4, R5), alert-detail/index.test.tsx (R6, R8–R15) y layout.test.tsx (R9 contentStyle).
- [~] R16 solo se nombra en 15 comentarios `// #170 R16` dentro de los candados agregados existentes, como prescribe tasks.md. Ningún `it` o `describe` lleva R16 en el nombre. Ver la observación no bloqueante 1.
- [x] Historial rojo→verde, en orden cronológico dentro de `584ef2d9..HEAD`: R1 8caef1f0→9e686a3e, R2 f17eb585→488db1ad, R7 58848da1→0a1d3d6d, R3 fe0ca64a→16e05f8e, R4 6ff10527→cea0b4ba, R5 b86a93c8→9736d80b, R6 cc383882→e661b37d, R8 fd7a129f→5ecccaee, R9 1affc889→80f3f603, R10 e1ac4901→7c48b404, R15 0d90d684→e63bbba4.
- [x] R11–R14 nacen verdes (6ae611e6, 7a03853a, 7fbf5b31, dfa09ead) y van probados por mutación, vía (b): S11.1, S11.2, S12.1, S12.2, S13.1, S14.1 y S14.2 están en rojo en el impl.
- [x] Todos los commits citados son ancestros de HEAD (`git merge-base --is-ancestor` sale ok en los 27).

## Checklist C5 — Trazabilidad
- [ ] **`traceability.md` tiene 16 celdas «(pendiente)»**, en la columna de tests de R1 a R16. La de R17, «pendiente (humano)», es la esperada. Bloqueante 1.
- [x] Los commits siguen el formato del repo: `test|feat(mobile-alerts-grouped-and-detail-map): #170 R<n> ...`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla de §Aprobación marcada (2026-10-12). Las enmiendas E1 y E2 tienen sus casillas en [x].

## Checklist C7 — Sin código huérfano
- [x] N/A: esta feature no reemplaza nada existente. Solo añade secciones, contador, borde, mini-mapa y CTA.

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Las líneas añadidas en producción no traen hex, valores arbitrarios `[...]`, `StyleSheet`, sombras nuevas, `elevation` ni `Platform.OS`.
- [x] Regla 10: con mapa, la raíz `screen-alert-detail` es `flex-1` y ningún ancestro declara `bg-`. Lo prueba `#170 R9` subiendo por los ancestros, y la sonda S9.1 de Codex lo pone en rojo.
- [x] Regla 13: el CTA lleva la receta del secundario neutro y queda inventariado en `#166 R3`.
- [x] El contador y la distancia usan `TABULAR_NUMS` y el mapa usa `CONTINUOUS_CORNER`. El CTA mide `min-h-11` (≥ 44 pt).
- [x] La severidad se expresa con borde + icono + etiqueta, nunca solo con color: `#170 R5` comprueba las tres ramas de tipo.
- [x] Skills cargadas: `expo:expo-overview` y `expo:expo-native-ui`.

## Sondas de mutación del reviewer
Cada sonda corre en `probe170` con `FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath <fichero>`, sin init.sh en marcha y con loadavg < 6. Tras cada una se revierte con `git checkout HEAD -- src` y `git diff --quiet`.

| Sonda | Mutación plantada | Fichero de test | Resultado |
|---|---|---|---|
| F | Detalle: si `position` es null, monta un componente que llama a `useQuery(geofenceKeys.list(alert.petId), listGeofences, enabled: geofenceId !== null)` | alert-detail/index.test.tsx | **verde, 78/78 (ciega)** |
| A | Lista: dentro del `View gap-4`, `{card}` va antes de la cabecera | alerts/index.test.tsx | **verde, 68/68 (ciega)** |
| C | Detalle: la consulta de zonas usa `useSelectedPet().selectedPetId ?? alert.petId` en la clave y en `listGeofences` | alert-detail/index.test.tsx | **verde, 78/78 (ciega)** |
| E | Lista: invierte el orden del servidor en el grupo de abiertas de cada sección | alerts/index.test.tsx | rojo, 4 fallos (`#78 R7` ×2, `#78 R9` ×2) |
| Bl | Lista: el borde de la `Card` sale del `status` del servidor (`ordered[index].status`) y no del de la fila tras el ack local | alerts/index.test.tsx | verde, 68/68 (ciega) |
| Bd | Detalle: el borde de la tarjeta sale de `found?.status` y no del `alert` tras el ack local | alert-detail/index.test.tsx | verde, 78/78 (ciega) |
| D | Detalle: el umbral pasa de `Math.round(d - radiusM) >= 1` a `d - radiusM >= 1` | alert-detail/index.test.tsx | verde, 78/78 (ciega) |

## Observaciones bloqueantes
1. **C5: hay filas «pendiente» en la trazabilidad.** `specs/mobile-alerts-grouped-and-detail-map/traceability.md`, filas R1 a R16. La columna de tests acaba en `(pendiente)` en las 16, `grep -c '(pendiente)'` da 16, y el frontmatter sigue en `status: draft`. Por qué ocurrió: el handoff c27 prohibía tocar esa columna y Codex obedeció. Arreglo, solo de documentación: quitar el sufijo «(pendiente)» de cada celda tras comprobar que el `describe › it` citado existe con ese nombre exacto, y pasar el frontmatter a lo que pida la plantilla de cierre. R17 queda «pendiente (humano)».
2. **R8: el «no llama a `listGeofences`» de la rama sin posición es un candado tautológico** (sonda F en verde). Ancla: `mobile-pet-tracker/src/screens/alert-detail/index.test.tsx` › `#170 R8` › `it.each([...])('$fila: sin mapa')`. Las diez filas usan `makeAlert({ payload })` con el `geofenceId: null` por defecto, así que `expect(mockListGeofences).not.toHaveBeenCalled()` se cumpliría aunque el código consultase zonas sin posición. Escenario de fallo: una alerta `geofence_exit` con `geofenceId: 'zone-1'` y payload sin posición válida dispara `listGeofences`, contra el texto de R8 («IF `alertPosition(payload)` es `null` THEN … no llama a `listGeofences`»), y la suite sigue verde. Arreglo: en esas filas, `makeAlert({ geofenceId: 'zone-1', payload })` con `mockListGeofences` resuelto en `{ kind: 'ok', geofences: [ZONE] }`, y comprobar que el test nuevo pone F en rojo.
3. **R10: la mascota de la consulta de zonas no está fijada** (sonda C en verde). Ancla: `alert-detail/index.test.tsx` › `#170 R10` › `'pinta el círculo, el encuadre y «A 85 m de Casa»'` (`toHaveBeenCalledWith(..., 'pet-1')`) y `'lee la zona de la caché compartida de geofenceKeys.list'` (`geofenceKeys.list('pet-1')`). La alerta por defecto tiene `petId: 'pet-1'` y el doble de `useSelectedPet` devuelve `selectedPetId: 'pet-1'`, así que `alert.petId` y la mascota seleccionada coinciden. `listAlerts` no filtra por mascota, de modo que el detalle puede abrir una alerta de otra mascota. Escenario de fallo: con una implementación que consulte `geofenceKeys.list(selectedPetId)`, la alerta de `pet-7` vista con `pet-1` seleccionada busca la zona entre las de `pet-1`, no la encuentra y cae en la rama R12 sin círculo ni distancia, todo en verde. Arreglo: un caso de R10 con `makeAlert({ petId: 'pet-7', geofenceId: 'zone-1', payload: REAL_PAYLOAD })` y la mascota seleccionada en `pet-1`, que compruebe `listGeofences` con `'pet-7'`. Para la caché, sembrar `geofenceKeys.list('pet-7')` y verificar la distancia. Debe poner C en rojo.
4. **R3.2: no se comprueba el orden cabecera antes que fila** (sonda A en verde). Ancla: `mobile-pet-tracker/src/screens/alerts/index.test.tsx` › `#170 R3` › `'envuelve cada cabecera con la primera fila de su sección en un View gap-4'`. Solo comprueba el `className` del padre y que la fila está dentro (`within(parent)`), no que la cabecera sea su primer hijo. R3.2 dice «pintar **antes** de la primera fila de cada sección … una cabecera», y la Enmienda #70 punto 12 de la carta exige un expect propio para el orden de los hijos. Escenario de fallo: cabecera debajo de su primera fila, con la suite en verde. Arreglo: en ese `it`, por sección, `elementChild(parent, 0)` debe ser la cabecera y `elementChild(parent, 1)` debe ser o contener `alert-row-<id>` (ojo: `within` excluye la raíz). Debe poner A en rojo.

## Observaciones no bloqueantes
1. R16 se nombra solo con comentarios `// #170 R16`, 15 en total, en ui-copy-table, ui-language y consistency-classnames. Ningún `it` lo cita. Lo prescribe tasks.md y sigue el precedente de los candados agregados, pero conviene que el leader decida si C4 lo acepta o si R16 necesita un `it` propio.
2. El borde de severidad tras el ack local no tiene candado (sondas Bl y Bd en verde). El código es correcto: usa la fila tras el solapamiento de `acked`. Pero si alguien lo calcula desde el `status` del servidor, una fila marcada leída seguiría con borde rojo y la suite no lo vería. Se arregla con un `it` por pantalla que marque leída y compruebe el `className` sin `border-2`.
3. El umbral `Math.round(d - radiusM) >= 1` (R10/R14) no tiene fila entre 0,5 y 1 m (sonda D en verde). La spec solo prescribe 0 y 0,41 m. Una fila a 0,7 m del borde, que debe mostrar «A 1 m de Casa», lo cerraría.
4. R1: el candado del registro (`language-provider.test.tsx`) solo busca la regex de fila `← añadida por #170 (R1)`. No mira la cabecera `§2.24` ni los valores en/es de la tabla. Es lo que la spec prescribió.
5. R15: `min-h-11` y `Button.Label` sin `className` no tienen candado. `#166 R3` usa `toContain(recipe)`. La sonda S15.3 de Codex sí cubre `border-lip-gray`.
6. R3.1 y D2: `now = new Date(alerts.dataUpdatedAt)` no se distingue de `new Date()` en los tests, porque `Date.now` está mockeado y la consulta se resuelve en el mismo instante.
7. `src/__tests__/ui-language.test.ts`: la línea `toHaveLength(11 - 3 + 2); // #170 R16` perdió el comentario anterior `// #134 R6`. Es trazabilidad cosmética.
8. Ya cubierto: la sonda E (orden del servidor dentro de cada grupo) sale en rojo por los candados previos de `#78 R7` y `#78 R9`.

## Output de ./init.sh
Lo corrió el leader (log `scratchpad/170-init-review.txt`); el reviewer no lo lanzó. `head=` coincide con `git rev-parse HEAD` de wt-170 (`3719eb75e202543e1e0c1cc7e7de0f73fe4eb582`).
Nota: la sonda F terminó a las 21:27:04Z, mientras arrancaba ese init.sh (fase backend). El init salió verde, así que no hay rojo que atribuir.
```
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 100 passed, 100 total
Tests:       2893 passed, 2893 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
$ expo lint
✅ Lint sin errores
→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 154/170 completadas | 15 pendientes
  Próxima feature:
  [#60] mobile-ios-support (P3)
head=3719eb75e202543e1e0c1cc7e7de0f73fe4eb582
exit=0
```
Líneas por bloque: backend unit (187 suites, 1474 tests), infra (2 suites, 14 tests), móvil (100 suites, 2893 tests, 0 fallos), backend e2e (30 suites pasadas, 3 saltadas; 468 tests pasados, 8 saltados), lint y typecheck en verde, `exit=0`. Los `ERROR` de Nest del log son logs esperados de tests de consumidores y del e2e, no fallos. No aparece `Failed to run` de expo lint.

Veredicto: RECHAZADO
1. traceability.md: 16 celdas «(pendiente)» en R1–R16.
2. R8: «no llama a listGeofences» sin posición, tautológico por `geofenceId: null` (sonda F).
3. R10: la consulta de zonas por `alert.petId` no está fijada; la mascota de la alerta coincide con la seleccionada (sonda C).
4. R3.2: no se comprueba que la cabecera vaya antes de su primera fila (sonda A).

## Barrido de la Enmienda E3

Fecha: 2026-10-12. Revisado sobre `906d06e4`: requirements.md §Enmienda E3,
corrección 16 del handoff (leída entera), la nota E3 de tasks.md y la lista de
tests de design.md. Barrido de solo lectura: no he corrido jest, init.sh ni
expo lint. Las siete mutaciones se ensayaron con `sed` sobre copias fuera del
árbol, en el scratchpad.

Resultado: **sin problemas bloqueantes.** Hay cinco notas no bloqueantes; la
5 la tiene que cumplir el leader antes de relanzar a Codex.

### (a) Cada candado cubre su cláusula entera

- **E3.1 (R8, «no llama a `listGeofences`» sin posición): OK.** Las diez filas
  `'$fila: sin mapa'` pasan a llevar `geofenceId: 'zone-1'` y una zona que
  resuelve. Así la única razón para no consultar es que falta la posición, que
  es justo la cláusula. Las filas «con mapa» no cambian.
- **E3.2 (R10, consulta por `alert.petId`): OK.** La alerta es de `pet-7` y la
  mascota seleccionada es `pet-1`. El `it` comprueba la llamada con `pet-7` y
  la ausencia de la llamada con `pet-1`. El cambio de la clave de caché a
  `list('pet-7')` cubre la otra mitad: la clave, no solo la función.
- **E3.3 (R3.2, cabecera antes de su primera fila): OK.** Comprueba el orden
  dentro del envoltorio y no solo que estén los dos.
- **E3.4 (borde de la fila según el estado de la propia fila): OK, con un
  matiz no bloqueante.** Solo cubre el tipo por defecto (`geofence_exit`). Basta,
  porque el eje de la mutación es de dónde sale el estado, no el tipo.
- **E3.5 (borde del detalle con el estado leído tras el ack): OK.**
- **E3.6 (umbral de redondeo y `min-h-11` del CTA): OK.**

### (b) Mutaciones de la ronda 1 y sus hermanas con E3 aplicada

**OK, no sobrevive ninguna.**

- **Las siete sondas.** Los siete comandos literales de mutación (SE3.1 a
  SE3.7) casan y producen exactamente la mutación descrita:
  - SE3.1: una `useQuery` incondicional tras `const position = …`;
  - SE3.2: la línea de `petId` más la clave y la función reescritas;
  - SE3.3: `{card}` antes de la cabecera;
  - SE3.4: `ordered[index].status`;
  - SE3.5: `found?.status`;
  - SE3.6: sin `Math.round`;
  - SE3.7: sin `min-h-11`.
- **Hermanas de C (E3.2).** Mutarlo todo a la vez lo detectan las dos aserciones
  de E3.2. Mutar solo la clave lo detecta el test de caché, que pasa a
  `list('pet-7')`: la caché queda vacía y el fetch, que nunca resuelve, agota
  el `findBy`. Mutar solo la función lo detecta `toHaveBeenCalledWith(…, 'pet-7')`.
- **Hermanas del umbral (E3.6).** `Math.ceil` cae en la fila de 0,41 m de R14 y
  `Math.floor` cae en E3.5.
- **A y F de la ronda 1.** Quedan cerradas por SE3.3 y SE3.1.
- **E.** Ya la cubría #78.

### (c) Recuentos por commit y líneas rojas de las sondas

**OK.**

- **Tests por commit.** Las cifras 78, 79, 68, 70/81, 82 y 82 cuadran con los
  `it` que añade cada E3.x sobre la base de cada fichero. E3.1, E3.3 y E3.6
  editan cuerpos y no añaden `it`.
- **FINAL.** Da 433 (A 70, D 82).
- **ALL.** Da 2899 tests en 100 suites.
- **Sombras.** El recuento completo de sombras pasa de 5 a 6 por el literal
  `border-border` nuevo en un test que ve design-drift. El de producción se
  queda en 0.
- **Trazabilidad.** `grep -c '; E3: '` = 6, con numstat `6 6`.
- **Lista cerrada.** 20 ficheros (excluye `progress/review_…`).
- **Líneas rojas de las sondas.** Los `●` esperados casan con los `it` que toca
  cada mutación; en SE3.1 son las diez filas `'$fila: sin mapa'`.

### (d) Anclas y guardas de la corrección 16

**OK.**

- **Valores de partida medidos en `906d06e4`.** Cuadran con la tabla de abajo.
  El `it` nuevo de E3.2 y los demás títulos nuevos no existen en la base.

| Ancla | Base | Tras su commit |
|---|---|---|
| `makeAlert({ payload })` en D | 2 | 1 |
| `makeAlert({ geofenceId: 'zone-1', payload })` en D | 0 | 1 |
| clave `list('pet-1')` en D | 3 | 2 |
| clave `list('pet-7')` en D | 0 | 1 |
| literal `toBe` de `border-border` en D | 1 | 2 |
| línea `toBeVisible` del bucle `envuelve` en A (sangría de 6 espacios) | 1, única | — |

- **cwd, comillas y expansión.**
  - Cada cadena abre con `cd …/mobile-pet-tracker && pwd`.
  - Las comillas simples y dobles anidan bien.
  - `!==` dentro de comillas simples no dispara la expansión del historial.
- **`plantada`.** Falla en seguro: si un `sed` no casa, el nombre de fichero
  esperado no aparece y la sonda para antes de medir.
- **Limpio.** `<LIMPIO>` va acotado por pathspec (`. ../docs ../specs` desde
  mobile-pet-tracker/). Ni el impl trackeado ni el handoff ni este fichero de
  revisión lo tocan. `git diff --cached --quiet` cubre el índice.
- **Guardas de error.** La guarda de error no la activan los mensajes de
  aserción, y la de lint (`> /tmp/170-lint.txt 2>&1 && test ! -s`) es la ya
  asentada.
- **Guardas del FINAL.** Ningún literal de E3 casa con las regex de design-drift
  (clases arbitrarias y C8) que escanean tests.

### Notas no bloqueantes

1. **c29 no fija la segunda línea de E3.1.**
   - Hoy la cadena solo ancla la primera. Si Codex omite
     `mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [ZONE] });`,
     las diez filas siguen en verde y siguen siendo útiles contra SE3.1, porque
     la llamada ya cuenta aunque no resuelva. Pero el literal de la spec no
     queda verificado.
   - Base medida: 3.
   - Arreglo literal, tras la segunda ancla de c29:
     `&& test "$(grep -cF "mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [ZONE] });" src/screens/alert-detail/index.test.tsx)" = 4 \`
2. **Solo SE3.1 lleva la línea de resultado esperado.**
   - Es la línea ``Esperado: `plantada=0`, `exit=1`, `sonda=0` y `limpio=0`.``
     SE3.2 a SE3.7 no la llevan.
   - Es cosmético, porque la regla general de la corrección 16 lo cubre.
   - Arreglo: copiar esa línea bajo cada sonda.
3. **El CIERRE del cuerpo sigue con un valor que ya no rige.**
   - En la línea 1283 dice
     `git diff <H0> -- src | grep -cE '^\+.*(shadow-|elevation|boxShadow)'   -> 0`.
   - Lo sustituyen la corrección 14 (sin tests, 0) y la corrección 16
     (completo, 6), y la corrección manda sobre el cuerpo.
   - Arreglo opcional: anotar en esa línea «ver correcciones 14 y 16».
4. **No verificado por mí.**
   - La salida de jest de los seis commits y de las siete sondas.
   - El FINAL y el ALL.
   - El ensayo literal de las cadenas c29-c36 de punta a punta. Tampoco consta
     ensayado por el leader.
   - Las cifras de arriba son aritmética sobre los ficheros, no medidas.
5. **Prompt de reanudación (lo tiene que cumplir el leader antes de relanzar).**
   - El prompt principal del handoff define H0 como «el commit que añade este
     handoff» y exige `git status --short` vacío. La corrección 16 no dice nada
     de H0.
   - Un Codex que releyera el prompt sin más tomaría el HEAD actual como H0, y
     el CIERRE (`git diff --name-only <H0> HEAD`, lista cerrada de 20) saldría
     solo con los ficheros de E3.
   - El prompt de reanudación (Reanudación 7) tiene que fijar:
     - H0 = `584ef2d9` (la que ya registra el impl);
     - el HEAD esperado = el commit del leader que incluya este barrido y la
       firma humana de E3;
     - status vacío;
     - empezar en la corrección 16, c29, sin repetir c1-c28 ni cE2.
   - Este fichero queda sin commitear: si Codex arranca antes de que el leader
     lo commitee, para en el control de status.
