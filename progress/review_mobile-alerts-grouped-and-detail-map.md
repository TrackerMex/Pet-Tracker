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

---

## Ronda 2 (sobre ae6dddf5)

Fecha: 2026-10-13
Rama: `feature/170-mobile-alerts-grouped-and-detail-map`, HEAD `ae6dddf5`
(c36), H0 del handoff `584ef2d9`, ronda 1 rechazada sobre `3719eb75`, firma
de E3 en `9de61d9d`.
Veredicto: **APROBADO** (Fase B cerrada abajo).

### Fase A (solo lectura: git, grep, sed)

#### A1. Cada hallazgo de la ronda 1 cerrado por E3 (o por `003fa449`)

Literales comprobados con `grep -cF` contra el árbol en HEAD. Todos coinciden
con el texto de §Enmienda E3 de `requirements.md`.

| Hallazgo ronda 1 | Cierre | Evidencia en el árbol |
|---|---|---|
| 1. traceability con 16 celdas «(pendiente)» | `003fa449` + c35 `edf6ce12` | Ninguna celda «pendiente» salvo R17 «pendiente (humano)» (gate humano, esperado) |
| 2. R8 sonda F tautológica (`geofenceId: null`) | E3.1, c29 `b91c815c` | D, `#170 R8` › `'$fila: sin mapa'`: `makeAlert({ geofenceId: 'zone-1', payload })` + `mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [ZONE] })` |
| 3. R10 sonda C: mascota de la alerta sin fijar | E3.2, c30 `4f4cfbdb` | D, `#170 R10`: `it('consulta las zonas de la mascota de la alerta, no de la seleccionada')` con `toHaveBeenCalledWith(…, 'pet-7')` y `not.toHaveBeenCalledWith(…, 'pet-1')`; el test de caché pasa a `pet-7` y `geofenceKeys.list('pet-7')` |
| 4. R3.2 sonda A: orden cabecera-antes-de-fila | E3.3, c31 `1fba836c` | A, `#170 R3` › 'envuelve cada cabecera…': `elementChild(parent, 0).props.testID` = cabecera y `elementChild(parent, 1)` es o contiene la fila |
| Obs. 2 (borde tras ack local, Bl/Bd) | E3.4, c32 `d1ff55b6` | D, final de `#170 R6`: `it.each(['ok', 'already-closed'] as const)('marcada leída en local (%s): pierde el borde de severidad', …)` hasta `className` exacto `rounded-card border border-border bg-surface p-4 shadow-sm min-h-44 gap-3`; A, final de `#170 R5`: `it.each` ok/already-closed con `border` y `border-border` presentes y sin `border-2` ni `border-danger` |
| Obs. 3 (umbral de redondeo, sonda D) | E3.5, c33 `dc074638` | D, `#170 R10`: `it('redondea al metro: a 0,71 m del borde dice «A 1 m de Casa»')` con lat `19.4335057`, antes de 'usa la zona aunque esté inactiva' |
| Obs. 5 (`min-h-11`) | E3.6, c34 `3361aea0` | D, `#170 R15` › 'lo pinta en %s': `expect(button.props.className.split(' ')).toContain('min-h-11')` tras la línea de `accessibilityRole` |

Las its de E3 nacen verdes porque protegen código correcto. Su rojo legítimo
es la sonda de mutación de producción no versionada (C4 punto 5), declarada en
la tabla SE3.1-SE3.7 y firmada por el humano. Esa sonda la repite el reviewer
en la Fase B.

#### A2. Alcance del cambio en `mobile-pet-tracker/`

- `git diff --stat 3719eb75 HEAD -- mobile-pet-tracker/`: solo
  `src/screens/alert-detail/index.test.tsx` (D) y
  `src/screens/alerts/index.test.tsx` (A).
- El comando de sombras entero (con tests) desde `3719eb75` da 1: es el
  literal `shadow-sm` del `className` exacto que asevera E3.4 en D (base de
  `Card`, como los 5 de la corrección 14). No es producción: ningún fichero de
  producción cambia.
- Sombras de producción desde `584ef2d9` = 0; recuento completo = 6. Coincide
  con el impl.
- `git diff --quiet 584ef2d9 HEAD -- package.json bun.lock app.json src/components/pet-map.tsx src/components/card.tsx src/api` → exit 0.
- Sin cambios en backend, infra ni `docs/`.
- `git diff --check 9de61d9d HEAD` → limpio.
- Nada en `requirements.md`, `design.md` ni `tasks.md` cambia después de
  `9de61d9d`. Entre el espejo `906d06e4` y la firma `9de61d9d`, la spec solo
  cambia la casilla de E3 (`[ ]` → `[x]`, fecha 2026-10-12).

#### A3. Evidencia del impl contra la corrección 16

El impl tiene 19 446 líneas y se leyó por rangos desde §Enmienda E3 (línea
18483). Los comandos que registra coinciden literalmente con la corrección 16
del handoff (líneas 136-447).

- **c29-c34.** Jest, typecheck y lint dan exit 0 en las seis cadenas; el log
  de lint queda en 0 bytes. Tests por cadena: 78, 79, 68, 151 (A70 + D81), 82
  y 82. Coinciden con los recuentos de E3: D 78→82, A 68→70.
- **SE3.1-SE3.7.** Las siete sondas dan `plantada=0`, `exit=1`, `sonda=0` y
  `limpio=0`, con estas líneas `Tests:` exactas:
  - SE3.1: 10 fallidos, 68 aprobados, 78 en total;
  - SE3.2: 2 fallidos, 77 aprobados, 79 en total;
  - SE3.3: 1 fallido, 67 aprobados, 68 en total;
  - SE3.4: 2 fallidos, 68 aprobados, 70 en total;
  - SE3.5: 2 fallidos, 79 aprobados, 81 en total;
  - SE3.6: 1 fallido, 81 aprobados, 82 en total;
  - SE3.7: 3 fallidos, 79 aprobados, 82 en total.

  Los marcadores ● listados cuadran con la tabla de la spec.
- **CIERRE.**
  - FINAL: exit 0, 10 suites, 433 tests (70+82+27+26+30+67+65+27+15+24).
  - ALL: exit 0, 100 suites, 2899 tests, al primer intento, con loadavg 4.51
    y `pgrep` vacío antes de lanzarlo.
  - Sombras de producción 0 y recuento completo 6.
  - Los diffs de dependencias y ficheros compartidos contra `584ef2d9` salen
    vacíos.
  - `git diff --quiet 9de61d9d -- src (sin tests)` → exit 0.
  - H1-H44 y P1-P16 en sus valores de cierre: H4=9, H5=4, H6=0, H8=0, H11=25,
    H12=10, H13=0, H14=0, H17=0, H18=0, H21=0, H24=0, H29=3, H34=1, H36=4, y
    P1-P16 como se esperaba.
- **c35** (`edf6ce12`): `grep -c '; E3: '` = 6, numstat 6/6.
- **c36** (`ae6dddf5`): lista cerrada de 20 ficheros.
- **Incidencias de Codex con sus scripts auxiliares.** Las dos son inocuas.
  - *Editor de E3.6.* El selector auxiliar casaba dos aserciones
    `accessibilityRole` y paró por AssertionError antes de escribir. Se
    restringió a R15. El diff confirma una sola línea, dentro de R15 'lo pinta
    en %s'. Sin efecto.
  - *Registrador del FINAL.* Intentó contar líneas ✓ en un log no verbose y
    falló antes de escribir. Jest había salido con exit 0 y 10/433. El reparto
    es coherente: los otros ocho ficheros no cambian desde la ronda 1, y
    433 − 152 = 281 = 427 − 146. Sin efecto.

#### A4. Trazabilidad

- Los 34 hashes citados son ancestros de HEAD, y cada mensaje de commit casa
  con su celda. `3719eb75` solo se cita en prosa.
- Llevan su commit de E3:
  - R3 y R5/R6 (`d1ff55b6`; R3 también `1fba836c`);
  - R8 (tras el `0359fe6c` de E2, `b91c815c`);
  - R10 (`4f4cfbdb` y `dc074638`);
  - R15 (`3361aea0`).
- Los 17 nombres de `describe` tienen `grep -cF` = 1 en el árbol, igual que el
  it de R9 en el layout y el it de R1.
- La única fila «pendiente» es R17 «pendiente (humano)», el smoke del dev build
  de Android, que es un gate humano aparte. No cuenta como fila pendiente del
  implementer.

#### A5. Carta de UI (C8) y C2-C7, solo sobre lo que cambia E3

- Se cargó `expo:expo-overview` antes de esta comprobación.
- **C8.** E3 no toca UI: producción es idéntica a `3719eb75`/`9de61d9d`. El
  grep de las líneas añadidas por E3 (hex, clases arbitrarias, `StyleSheet`,
  `elevation`, `Platform.OS`, `boxShadow`) no da coincidencias. Las clases que
  asevera E3.4 (`border border-border`) y E3.6 (`min-h-11`) ya estaban en
  producción y ya pasaron la carta en la ronda 1.
- **C2.** `feature_list.json` solo tiene la 170 en `in_progress`.
- **C3.** Sin cambios de capas: E3 solo toca tests.
- **C4.** Cada it nuevo vive bajo el `describe` de su R-id (`#170 R3`, `R5`,
  `R6`, `R8`, `R10`, `R15`). El cierre por mutación (C4 3(b)) exige evidencia
  propia del reviewer, que falta hasta la Fase B.
- **C5.** Trazabilidad cubierta en A4. Los commits c29-c36 siguen el formato
  `test(...)`/`docs(...)` con R-id y E3, como en la ronda 1.
- **C6.** `requirements.md` tiene `status: approved`. §Aprobación tiene cuatro
  casillas marcadas (base, E1, E2 y E3), todas del 2026-10-12.
- **C7.** N/A: no se reemplaza nada.

#### A6. Lista cerrada

Recalculada con el comando del cuerpo del handoff (línea 1324):
`git diff --name-only 584ef2d9 HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-alerts-grouped-and-detail-map.md' ':!specs/mobile-alerts-grouped-and-detail-map/requirements.md' ':!specs/mobile-alerts-grouped-and-detail-map/design.md' ':!specs/mobile-alerts-grouped-and-detail-map/tasks.md' ':!progress/review_mobile-alerts-grouped-and-detail-map.md'`.
Da 20 ficheros, idénticos a los que lista el impl (líneas 19403-19440). Las
rutas de mobile son 17.

#### A7. init.sh (lo corrió el leader, el reviewer lee el log)

- Log `scratchpad/init170-r2.log`, de 33 895 líneas; `init170-r2.head` =
  `ae6dddf5`.
- Backend: 187 suites, 1474 tests. Infra: 2 suites, 14 tests. Mobile: 100
  suites, 2899 tests. e2e: 30 aprobadas + 3 saltadas, 468 tests + 8 saltados.
- Lint y Typecheck OK, «Todo verde».
- 0 ✕, ningún ● salvo `● Console`, ningún `FAIL` y ningún «Failed to run».
- El aviso «A worker process has failed to exit gracefully» es preexistente
  desde main.
- El log no registra una línea `exit=`. El exit 0 lo reporta el leader.
- 2899 = 2893 + 6, que son las seis its que añade E3. Sin regresiones.

#### A8. Smoke R17 y E3

E3 no afecta al smoke R17 (dev build de Android). Solo cambia tests, y el
código de producción es idéntico al de `3719eb75`/`9de61d9d`. La casilla de
§Smoke R17 sigue `[ ]`. Es un gate humano y no forma parte de este veredicto.

#### Observaciones no bloqueantes

1. **Bloque de anclas pegado en el FINAL del impl.** El code fence «CIERRE —
   FINAL» (líneas 18927-18991 del impl) incluye, después del comando de jest,
   el bloque «== ANCLAS ==» del handoff (líneas 579-639): los valores base de
   H y «Valores al cerrar». Un lector podría tomar esos valores base por
   medidas. Las medidas reales están desde la línea 19117 y son correctas.
2. **`progress/current.md` sin actualizar.** Su última línea de #170 sigue
   diciendo «Siguiente: Reanudación 7 de Codex…» y no registra que Codex
   terminó. Lo actualiza el leader.
3. **Frontmatter de `traceability.md` en `status: draft`.** Hay otras 26 specs
   del repo en draft, así que la convención es mixta. Si se quiere uniformar
   con las features done que usan `approved`, el leader puede cambiarlo al
   cerrar.

#### Hallazgos bloqueantes de la Fase A

Ninguno.

### Fase B (réplica de sondas, tras «jest permitido»)

Se replantaron sobre HEAD `ae6dddf5` las tres sondas que cierran los tres
hallazgos bloqueantes de tests de la ronda 1: SE3.1, SE3.2 y SE3.3.

Método:

- Mutación literal de la corrección 16 (sed/perl), aplicada desde
  `mobile-pet-tracker/`.
- Jest de un solo fichero:
  `FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath <test>`.
- Revertido con `git checkout HEAD -- <fichero>`.
- LIMPIO =
  `git diff --cached --quiet && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`.
- Logs en el scratchpad de la sesión: `r2-se3-1.txt`, `r2-se3-2.txt` y
  `r2-se3-3.txt`.
- Carga (loadavg en 4 CPU): 1.58, 2.58 y 4.05; `pgrep` de jest e init.sh
  vacío al empezar.
- No apareció ningún `Exceeded timeout`.

Los recuentos difieren de los del handoff porque la sonda se corre sobre HEAD,
no sobre el commit cN de su cadena. D tiene 82 its en HEAD frente a 78 tras c29
y 79 tras c30; A tiene 70 frente a 68 tras c31. Los fallidos son exactamente
los mismos.

| Sonda | Mutación | plantada | exit | `Tests:` en HEAD | ● (sin Console) | Errores de suite/tipo | limpio |
|---|---|---|---|---|---|---|---|
| SE3.1 (R8, E3.1) | `useQuery` de zonas sin posición en `alert-detail/index.tsx` | 0 | 1 | `10 failed, 72 passed, 82 total` | 10, los diez `#170 R8 › …: sin mapa` | 0 | 0 |
| SE3.2 (R10, E3.2) | zonas de `useSelectedPet().selectedPetId ?? alert.petId` | 0 | 1 | `2 failed, 80 passed, 82 total` | 2: `consulta las zonas de la mascota de la alerta, no de la seleccionada` y `lee la zona de la caché compartida de geofenceKeys.list` | 0 | 0 |
| SE3.3 (R3.2, E3.3) | `{card}` antes de la cabecera dentro del `View gap-4` en `alerts/index.tsx` | 0 | 1 | `1 failed, 69 passed, 70 total` | 1: `#170 R3 › envuelve cada cabecera con la primera fila de su sección en un View gap-4` | 0 | 0 |

Cada rojo cae en la aserción que E3 añadió, no en una consulta previa:

- SE3.1 falla en `expect(mockListGeofences).not.toHaveBeenCalled()` con
  `Received number of calls: 1` (`"pet-1"`). Ahora que `geofenceId` es
  `'zone-1'`, el candado ya no es tautológico, y queda cerrado el hallazgo 2
  de la ronda 1.
- SE3.2 falla en las dos its que fijan `pet-7`. Queda cerrado el hallazgo 3.
- SE3.3 falla en `expect(elementChild(parent, 0).props.testID)` con
  `Expected: "alerts-section-today"` / `Received: "alert-row-today-open"`.
  Queda cerrado el hallazgo 4.

Estado tras las tres reversiones:

- `git diff --quiet HEAD -- mobile-pet-tracker` → 0.
- `git diff --cached --quiet` → 0.
- `git status --short` muestra solo
  `M progress/review_mobile-alerts-grouped-and-detail-map.md`, que es este
  fichero, sin commitear por instrucción del leader. No queda ninguna
  mutación en el árbol.

### Veredicto ronda 2: APROBADO

- **init.sh en verde sobre `ae6dddf5`** (log del leader): mobile 2899/2899,
  sin regresiones (2893 + 6 its de E3), y backend, infra, e2e, lint y
  typecheck en verde.
- **Hallazgos de la ronda 1.** Los cuatro bloqueantes están cerrados: el 1 por
  `003fa449` + c35, y el 2, el 3 y el 4 por E3, con el cierre por mutación
  replicado por el reviewer (C4 3(b)). Las observaciones 2, 3 y 5 quedan
  candadas por E3.4-E3.6, verificadas en el árbol y en la evidencia de Codex.
- **Trazabilidad.** No queda ninguna fila «pendiente» del implementer. Todos
  los hashes son ancestros de HEAD, y cada test nombra su R-id vía su
  `describe`.
- **Spec.** Aprobada con las casillas base, E1, E2 y E3. Producción es
  idéntica a `3719eb75`; C8 sin cambios de UI.
- **Gate humano pendiente: smoke R17 (dev build de Android).** La casilla de
  §Smoke R17 sigue `[ ]` y la fila R17 de traceability dice «pendiente
  (humano)». E3 no lo afecta. La feature no debe marcarse `done` hasta que el
  humano lo cierre.
- **Observaciones no bloqueantes 1-3 de la Fase A.** Son el bloque de anclas
  pegado en el FINAL del impl, `current.md` y el frontmatter `draft` de
  traceability. Quedan para el cierre del leader.
