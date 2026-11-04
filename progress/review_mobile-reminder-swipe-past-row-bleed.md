# review: mobile-reminder-swipe-past-row-bleed (#239)
Fecha: 2026-11-04
Veredicto: APROBADO

Worktree: `/home/claude/sites/Pet-Tracker-wt-239`, branch `feature/239-mobile-reminder-swipe-past-row-bleed`.
Base del diff B = `2d10c7f7` (commit del handoff). HEAD = `c9a60dc6`.
Commits revisados (B..HEAD): `022fc871`, `85299804`, `10d67da1`, `aae1b86d`, `c9a60dc6`.

Por restricción del leader, esta revisión se apoya en git, grep y lectura. No se ejecutaron
`./init.sh`, jest, tsc ni lint (ver la sección final).

Skills cargadas: `expo:expo-overview`, `expo:expo-animation` y `expo:expo-design-system`
(design §Skills). Ninguna cambia el veredicto. La carta (`docs/ui-guidelines.md`) prevalece.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene 0 in_progress y #239 está en `spec_ready`. No viola C2, y el leader actualiza el estado al cerrar.
- [x] `progress/current.md` actualizado: describe la sesión activa (plan #239-#241).

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica. Solo se toca la capa de presentación (`src/screens/reminders/index.tsx`).
- [x] Contratos en domain siguen siendo interfaces puras: no se tocan.
- [x] application depende de interfaces: no se toca.
- [x] infrastructure sin lógica de negocio: no se toca.
- [x] Sin imports nuevos en `index.tsx`. El diff de producción es -1/+5 y coincide literalmente con design §Código objetivo (hunk `@@ -347,7 +347,11`):
  ```tsx
  -          {row}
  +          {past ? (
  +            <View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>
  +              {row}
  +            </View>
  +          ) : row}
  ```

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un `it` que lo nombra:
  - R1 a R5 están en `mobile-pet-tracker/src/screens/reminders/index.test.tsx`, dentro del describe `Base opaca de la fila pasada (#239 R1 a R5)` (desde la línea 2753 aprox.):
    - R1, línea 2770 aprox.;
    - R2, línea 2793 aprox.;
    - R3, línea 2816;
    - R4, línea 2826;
    - R5, línea 2838.
  - R6 y R7 están al final de `mobile-pet-tracker/src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`.
  - Los títulos son literalmente los de la spec.
- [x] El historial muestra test primero:
  - `022fc871` (test, rojo R1, R2, R5 y R6) toca solo los 2 ficheros de test.
  - `85299804` (feat, verde) toca `index.tsx` y los 3 guards. Es el único commit que toca `index.tsx`.
  - `10d67da1` (rojo R7) toca solo canvas-fidelity.
  - `aae1b86d` (verde R7) toca solo los 3 guards (sufijos).
  - `c9a60dc6` toca solo `traceability.md`.
- [x] Los tests no son tautológicos:
  - testID, clases y textos están escritos a mano, sin valores importados de producción.
  - Las consultas del panel llevan `HIDDEN` y se asertan con `toBeOnTheScreen()`. No hay `toBeVisible()`.
  - No se compara con `toBe` ni `toEqual` entre nodos.
  - R5 fija `mockRealSwipeable = true`. El doble (línea 136) delega en `jest.requireActual(...).default` y R5 aserta `expect(mockSwipeable).not.toHaveBeenCalled()`, así que monta el `ReanimatedSwipeable` real.
  - El beforeEach/afterEach del describe nuevo (líneas 2754-2768) es idéntico, por diff, al de #228 (líneas 2579-2593).
  - No hay líneas eliminadas en el fichero de test, y no cambian imports, `jest.mock` ni helpers.
- [x] Las sondas S1 a S5 del reporte son coherentes con `tasks.md`:
  - S1: solo R3 en rojo (1 failed / 152 passed).
  - S2: R4 en rojo por su aserción. R1, R2 y R5 también salen rojos porque en ese momento los tests estaban sin commitear y la implementación no existía aún; es coherente con el orden.
  - S3: rojos exactamente R1, R5 y R6.
  - S4: rojos R1, R5, R6, #228 R6 y 5 candados de opacidad previos. `tasks.md` dice «al menos».
  - S5: solo R2.
  - Las cifras cuadran: P = 162; rojo = 164 passed + 4 failed; verde = 168; rojo R7 = 168 + 1; verde = 169. El alcance completo va de 2024 a 2031.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas «pendiente». La única aparición es la línea de la regla (línea 21), no una fila de la tabla.
- [x] Los hashes citados (`022fc871`, `85299804`, `10d67da1`, `aae1b86d`) existen, son ancestros de HEAD y sus asuntos coinciden con la tabla.
- [x] Los commits siguen el formato `<tipo>(<scope>): <desc> (R-ids)`, con los mensajes literales de `tasks.md`.

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-reminder-swipe-past-row-bleed/requirements.md` tiene `status: approved` y la casilla marcada (`[X]`), con la firma delegada (`e4e1cb15` + `7655c8a3`).
- [x] design, tasks y traceability están en `status: approved`.
- [x] La casilla G2 (smoke) sigue sin marcar, como corresponde: es un gate humano.
- [x] La Enmienda en la spec ajena es correcta. `specs/mobile-reminders-upcoming-past/requirements.md` contiene una sola vez `## Enmienda #239 — Base opaca de la fila pasada`, y en la línea 783 `- [x] Enmienda #239 aprobada (fecha: 2026-11-04)`.

## Checklist C7 — Sin código huérfano
- [ ] Componentes/módulos reemplazados por esta feature fueron eliminados
- [ ] Sus tests también fueron eliminados
- [x] N/A — esta feature no reemplaza nada existente: solo envuelve `{row}` en una base opaca en la rama `past`.

## Checklist C8 — Carta de UI (feature móvil)
- [x] No hay `StyleSheet`, hex, clases `[...]`, copy nuevo, `toBeVisible` ni dependencias nuevas.
  - No cambian `package.json`, `bun.lock`, `app.json`, catálogo, `ui-copy-table.ts` ni `global.css`.
  - El grep de hex, filtrando `#NNN R<n>` y `\x23239`, da 0.
- [x] La base usa `rounded-22` con `style={CONTINUOUS_CORNER}`, como pide el corolario de la carta para esquinas no cápsula. `bg-background` es un token.
- [x] No hay tappables ni animaciones nuevas. El gesto sigue siendo el del `ReanimatedSwipeable`.
- [x] `#239` va siempre seguido de ` R<n>`. Donde un literal lo necesita solo, se escribe `\x23239` (2 apariciones en el `it` de R7). Ningún identificador contiene 239.

## Evidencia por punto del encargo
1. **C4.** Visto arriba. `85299804` es el único commit que toca `src/screens/reminders/index.tsx`.
2. **Diff acotado.** `git diff --name-only 2d10c7f7..HEAD` lista 7 ficheros, todos de la lista cerrada del handoff:
   - `index.tsx`;
   - `index.test.tsx`;
   - `reminder-swipe-actions-canvas-fidelity.test.ts`;
   - `reminders-upcoming-past-canvas-fidelity.test.ts`;
   - `consistency-classnames.test.ts`;
   - `design-drift.test.ts`;
   - `traceability.md`.

   En producción, `grep -c '^-[^-]'` da 1 y `grep -c '^+[^+]'` da 5. No hubo `it` ajenos bajo la Regla de cierre.
3. **R-ids no tautológicos.** Visto en C4. R5 monta el deslizable real.
4. **Guards enmendados según la Tabla de enmiendas:**
   - En `reminders-upcoming-past-canvas-fidelity.test.ts`: `['style={CONTINUOUS_CORNER}', 6 + 1 + 1], // #228 R2; #239 R1`.
   - En `consistency-classnames.test.ts`:
     - la fila directUses queda en `4 + 1 + 1 + 1 + 1`, con `#239 R1 base de la fila pasada`;
     - hay `+ 1 // #239 R1` en la línea 354, dentro del `it` «fusiona la esquina…» (línea 317);
     - y en la línea 464, dentro del `it` «deja CONTINUOUS_CORNER…» (línea 426).
   - En `design-drift.test.ts`: `[/\brounded-22\b/g, 1 + 1 + 1 + 1], // #239 R1`.
   - El sufijo `(enmendado por #239 R7)` da `grep -cF` = 1 / 3 / 1. Cada uno de los 5 localizadores aparece en una sola línea, y esa línea lleva el sufijo detrás de los sufijos previos.
   - `AMENDED_PAST_ROW_BASE` (`reminder-swipe-actions-canvas-fidelity.test.ts:174`) contiene los 5 pares literales de `tasks.md`.
   - El `it` de R7 aserta `count(spec, '## Enmienda \x23239 — Base opaca de la fila pasada')` = 1 y la regex `/- \[[ xX]\] Enmienda \x23239 aprobada/`, tolerante a la casilla firmada.
5. **Anclas finales en `src/screens/reminders/index.tsx`:**
   - `rounded-22` = 4 y `style={CONTINUOUS_CORNER}` = 8.
   - Tabla R6:

     | Literal | Cuenta |
     |---|---|
     | base | 1 |
     | `{past ? (` | 1 |
     | `) : row}` | 1 |
     | ternario de opacidad | 1 |
     | ` opacity-50` | 1 |
     | `bg-background` | 4 |
     | franja | 1 |
     | contenedor | 1 |
     | `testID=` | 48 |
     | las 3 props prohibidas | 0 |

   - Otras cuentas complementarias: `<View` = 30, `{row}` = 1, `bg-surface` = 6, `CATEGORY_SLOTS.rose.surface` = 4, `overflow-hidden` = 1 y `if (!isOwner) return row;` = 1.
6. **Trazabilidad.** Visto en C5.
7. **Sondas S1 a S5.** Vistas en C4.
8. **`#239` y la carta.** Vistos en C8.
9. **Árbol limpio.** `git status --short -- mobile-pet-tracker specs` está vacío y `git diff --cached --quiet` sale 0, así que no hay nada staged.

## Observaciones
Nada bloquea el veredicto. Quedan estas notas para el leader:
- **Suite completa pendiente.** El reviewer no corrió `./init.sh` (restricción del leader). R7 reserva la suite completa al leader, que debe correr `./init.sh` y registrar su salida antes de marcar `done`. Este veredicto no sustituye ese gate.
- **Reporte sin commitear.** `progress/impl_mobile-reminder-swipe-past-row-bleed.md` sigue sin commitear y `traceability.md` lo cita como evidencia. Lo commitea el leader al cerrar.
- **Logs en `/tmp`.** El implementador dejó los logs de jest, tsc y lint en `/tmp`, no en `progress/`, para no salirse de la lista cerrada. Es correcto según el handoff.
- **Estado en `feature_list.json`.** #239 sigue en `spec_ready`. El cambio a `done` es del leader tras `./init.sh` verde, y G2 (smoke en dispositivo) queda para el humano.

## Output de ./init.sh
No lo ejecutó el reviewer: el leader lo prohibió de forma explícita («el leader corre init.sh después de tu veredicto»). El leader debe ejecutarlo y adjuntar la salida antes de cerrar la feature.
