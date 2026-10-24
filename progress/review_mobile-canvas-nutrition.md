# review: mobile-canvas-nutrition (#200)
Fecha: 2026-10-24
Veredicto: APROBADO

Hash revisado: `2baf7cdb` (branch `feature/200-mobile-canvas-nutrition`, worktree
`Pet-Tracker-wt-200`). H0 del handoff: `c285eae4`. Diff medido con
`git diff c285eae4 HEAD`: 31 ficheros y 39 commits en `c285eae4..HEAD`. De esos
commits, 3 son `chore(spec)` del leader (0e6e3988, 562051d2 y 31837443) y los
36 restantes son de Codex.

## Checklist C2 — Estado coherente
- [x] Ninguna feature está `in_progress` en `feature_list.json` de la rama, así que la guarda de init.sh no salta. #200 figura `spec_ready`, como #198 y #199 en la ola 2 paralela. Pasarla a `done` es cierre del leader.
- [x] `progress/current.md` está en plantilla. La sesión vive en el worktree, en el handoff sin commitear y en `progress/plan_canvas-parity-2026-10-23.md`, igual que en la review de #197.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: N/A, solo se toca `mobile-pet-tracker/` y `docs/`.
- [x] repositories/contratos en domain son interfaces puras: N/A.
- [x] application depende de interfaces: N/A.
- [x] infrastructure sin lógica de negocio: N/A.
- [x] Capas móviles respetadas. La ruta `src/app/(tabs)/food.tsx` queda delgada, con 3 líneas. La pantalla vive en `src/screens/food/index.tsx` y exporta `FoodScreen` en la línea 39. El timing nuevo va en `src/theme/motion.ts` (`MOTION_RING_TIMING`, `MOTION_RING_DELAY_MS`). La pantalla solo consume piezas de #197 (`RiseIn`, `ScreenHeader`, `useChunkyLip`), sin componentes ni dependencias nuevas. El diff de `package.json` y `bun.lock` está vacío.

## Checklist C4 — TDD
- [x] Cada R tiene al menos un `it` que lo nombra:
  - R1–R11 en FO (`src/screens/food/index.test.tsx`).
  - R1 también en DS.
  - R4 también en MT.
  - R12–R15 en MS, MH y LY.
  - R16 y R17 en NC (`src/__tests__/nutrition-canvas-fidelity.test.ts`).
  - Ningún título añadido carece de `#200 R<n>`. El grep de los `it`/`describe` añadidos sin R-id da 0.
- [x] El historial muestra el test primero. Cada R con producción tiene `test(#200): R<n> …` y después `feat(#200): R<n> …`: R1–R10 y R12–R16. R11 va en el rojo de R9, como manda el handoff.
  - R17 nace verde, con un solo commit `test(#200)` (`c52df92b`) y 10 mutaciones rojas documentadas en el reporte.
  - La única excepción autorizada es `4c1eab22` (feat R1). Lleva el `git mv` de FO y las enmiendas de ruta, que son solo rutas: verificado con `git diff -M 4c1eab22^ 4c1eab22`, donde FO solo cambia `../`, el import de `FoodScreen` y dos `readFileSync`.
- [x] Las enmiendas de candados agregados de las erratas 52 y 53 van en commits `test(#200)` propios, antes del R siguiente: `14dee099` (HT, suelo de Card) y `309a1c8e` (DD `rounded-16`).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». Las 17 filas dicen «verificado por requisito».
- [x] Todos los hashes citados (rojos, verdes, `14dee099` y `309a1c8e`) existen en `c285eae4..HEAD`.
- [x] Los commits siguen `test(#200): R<n> …` y `feat(#200): R<n> …`, con el mensaje en inglés.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved`, y las casillas 1 y 2 de § Aprobación están marcadas con firma delegada (plan §4). La casilla del smoke sigue en `[ ]`: es cierre humano, no gate.
- [x] Las tres erratas posteriores van firmadas por delegación en la propia spec: `0e6e3988` (R17 e inventario), `562051d2` (fila 52) y `31837443` (fila 53 y regla de recuentos agregados).

## Checklist C7 — Sin código huérfano
- [x] Lo que esta feature reemplaza se eliminó:
  - `KCAL_BAR_TIMING` y `Card` desaparecen de Nutrición.
  - `meal-schedule-heading` y `meals-history-heading` solo sobreviven en las aserciones `queryByTestId(...)).toBeNull()`.
  - La clave `food.pending` se renombra a `food.markServedAction` en `en` y `es`, sin restos de `food.pending` en `src/`.
  - El `HomeEntrance` que dejan Horario e Historial sigue teniendo otros consumidores, así que no es huérfano.
- [x] El candado obsoleto se borró. El `describe('#197 R20: cimientos sin cablear')` de CF ([49]) se elimina entero en el rojo de R10, por la regla uniforme de la ola 2.

## Verificaciones adicionales del encargo
- **Lista cerrada.** Los 31 ficheros tocados están en la lista del handoff o son de harness:
  - `specs/mobile-canvas-nutrition/{requirements,tasks}.md` solo los tocan los commits `chore(spec)` del leader.
  - `back-button.tsx`, `back-button.test.tsx`, `use-theme-colors.ts`, `chunky-lip.ts`, `test/` y el config de jest tienen diff vacío desde H0.
- **Inventario de candados y sufijos.**
  - Cada `it` de candado tocado lleva `(enmendado por #200 R<n>)`, o añade `y #200 R<n>` (o `, R<n>` en HT) cuando el sufijo ya existía. Hay sufijos de #200 en 16 ficheros de `src/`.
  - Las cifras finales coinciden con el handoff:
    - `style={CONTINUOUS_CORNER}` en `$FS` = 6. Son `1+1+1+1+2` en `consistency-classnames.test.ts:411` y `2-1+1+1+1+2` en `:264`.
    - `text-accent-strong` en `$FS` = 1.
    - `headerShown` en `_layout.tsx` = 4.
    - El suelo de Card de HT queda en 41−6 = 35.
- **Regla de recuentos agregados.** La tabla «Enmiendas mecánicas» está en `progress/impl_mobile-canvas-nutrition.md:131-136`. Recoge CF `#197 R21` › Punto 13 (R16) y DD `#178 R13` `rounded-16` (R9), con antes, después, R y evidencia.
- **Guardas de carta.** `$FS`, `$MS` y `$MH` tienen 0 `StyleSheet`, 0 `-[` y 0 hex. `$FS` no importa `components/card`. El `import { Card }` de `$MS` ya existía y R17 no lo prohíbe.
- **Producción de Horario e Historial.** Coincide literalmente con R12–R15:
  - Las líneas de `ScreenHeader`.
  - `paddingTop: insets.top + 8` y `paddingBottom: insets.bottom + 32`.
  - `style={chunkyLip.violet}` sobre la constante única.
  - `RiseIn` con 0, `80 + 60 * index`, 0 y 100.
  - `_layout.tsx` solo cambia sus 2 líneas, y `motion.ts` solo añade las 2 exportaciones.
- **Carta.** `docs/ui-guidelines.md` cambia la cola del punto 13 por el literal de R16(e) y añade «## Enmienda #200 (mobile-canvas-nutrition)» al final, con (a)–(d) y la casilla reflejada.

## Decisión sobre el rojo de BackButton
El fallo de `src/components/__tests__/back-button.test.tsx` › `#172 R2: pinta ChevronLeft de 24 en foreground` es un **flake preexistente, ajeno a #200**. No bloquea. Evidencia:
1. El gate del leader sobre exactamente `2baf7cdb` está verde. `progress/init-leader-200.log` tiene mtime 03:11, posterior al commit de las 02:57, y dice: móvil 143/143 suites y 4758/4758 tests, 1 snapshot, «Todo verde». En esa corrida BackButton pasa.
2. Ni la suite ni sus dependencias (`back-button.tsx`, `use-theme-colors.ts`, la config de jest y `test/`) cambian desde H0.
3. El síntoma siempre es el mismo y el sitio cambia: el mock por factoría de `use-theme-colors` no se aplica y el hook real devuelve el respaldo `#0D1117`. En las corridas de Codex cayó en suites distintas y sin relación:
   - en R3: geofence-editor y chunky-lip;
   - en la corrida 1: reminders, alert-detail, alerts y forgot;
   - en las corridas 2 y 3: back-button.

   Todas pasan aisladas. Handoffs anteriores ya documentan el patrón bajo carga (`handoff_mobile-no-collar-states-pingo_e3.md:106`).
4. El diff de #200 no tiene nada capaz de filtrar estado entre ficheros: ni escrituras a disco, ni globals, ni `process.env`, ni `jest.doMock` ni `isolateModules`. Su única mención de `use-theme-colors` es la reescritura de ruta del mock en FO.

No pude correr el experimento de fuga en serie (los 18 tests de #200 seguidos de las 7 suites que fallan de forma intermitente, con un secuenciador ordenado). Las dos veces que lo comprobé, `pgrep` mostraba jest activo desde wt-199 y wt-198. Por mandato, no esperé en bucle. La conclusión se apoya en los puntos 1–4.

## Observaciones
No hay ningún hallazgo bloqueante. Lo que sigue son deudas no bloqueantes.

1. **Deuda: flake del mock de `use-theme-colors` bajo carga.** Afecta a varias suites que mockean el hook por factoría: BackButton, chunky-lip, geofence-editor, reminders, alert-detail, alerts y forgot. Merece su propia investigación fuera de esta feature. Conviene reproducirlo con `--runInBand` y un orden fijo cuando jest esté libre.
2. **Deuda: la casilla de NC no tolera minúscula.** `src/__tests__/nutrition-canvas-fidelity.test.ts:53` exige el literal `- [X] Enmienda #200 aprobada por humano`. Si alguien reescribe la casilla como `[x]`, el test se pone rojo. La convención del repo es `- \[[ xX]\]`, como en `canvas-foundations.test.ts:285`.
3. **Cosmético: líneas en blanco sobrantes.** Hay una en `src/screens/food/index.tsx:440`, antes de `) : null}`, y una doble en `src/__tests__/nutrition-canvas-fidelity.test.ts:62-63`.
4. **Cosmético: orden de imports.** En `src/screens/meal-schedule/index.tsx`, `ScreenHeader` va antes de `Card` (línea 23) y `RiseIn` va al final (línea 33). En `src/screens/meals-history/index.tsx:21-22`, ambos van tras `utils/month-grid`. El lint pasa.
5. **Cosmético: comentarios desordenados.** En `src/__tests__/consistency-classnames.test.ts:264`, los comentarios `// #200 R5 // #168 R8 // …` no siguen el orden de los términos de `2 - 1 + 1 + 1 + 1 + 2`. La cifra (6) es correcta.
6. **Pendiente humano: smoke Android.** Hay que pasarlo en claro y oscuro (§ «Cierre del humano» de la spec), por lotes, según el plan §6.

## Output de ./init.sh
Por mandato del leader, el reviewer no ejecuta `./init.sh`: el clasificador se lo deniega y comparte LocalStack y Postgres con otros worktrees. Este es el resumen de la corrida del leader sobre `2baf7cdb` (`progress/init-leader-200.log`, exit 0):
```
Backend:  Test Suites: 187 passed, 187 total   Tests: 1474 passed, 1474 total
          Test Suites: 2 passed, 2 total       Tests: 14 passed, 14 total
Móvil:    Test Suites: 143 passed, 143 total   Tests: 4758 passed, 4758 total   Snapshots: 1 passed, 1 total
E2E:      Test Suites: 3 skipped, 30 passed, 30 of 33 total   Tests: 8 skipped, 468 passed, 476 total
→ Lint...       $ expo lint   ✅ Lint sin errores
→ Typecheck...  $ tsc --noEmit   ✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
