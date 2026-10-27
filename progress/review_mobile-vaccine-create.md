# review: mobile-vaccine-create (#208)
Fecha: 2026-10-27
Revisor: reviewer (Claude)
Worktree: /home/claude/sites/Pet-Tracker-wt-208, branch feature/208-mobile-vaccine-create, HEAD 1f3637b0
Trabajo de Codex: 2eb28ef5..abb173c9 (el merge 1f3637b0 de origin/dev es del leader)
Veredicto: APROBADO

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene 0 en `in_progress`; #208 sigue en `spec_ready`, que el leader cierra.
- [x] `progress/current.md` es la plantilla vacía, que C2 admite.
- [x] init.sh verde sobre 1f3637b0, con `exit=0` (ver la última sección).

## Checklist C3 — Arquitectura
- [x] Las capas móviles se respetan:
  - La red va por `api/health-records.ts` (`getVaccineCatalog`, `createVaccine`), con tipos en `api/types.ts` y claves en `api/query-keys.ts`.
  - La aritmética civil vive en `utils/vaccine-dates.ts`, y la validación en `utils/form-rules.ts`.
  - El estado del aviso está en `hooks/vaccine-reminder-notice.ts`.
  - La ruta `app/pets/[petId]/vaccines/new.tsx` es delgada: lee `petId` y monta `VaccineCreateScreen`.
- [x] La pantalla no llama a `fetch` directamente. Depende de los clientes de `api/`.
- [x] Fuera de la app no cambia nada: `git diff 2eb28ef5 abb173c9 -- backend-pet-tracker init.sh` sale vacío.

## Checklist C4 — TDD
- [x] Cada R1–R22 tiene al menos un test cuyo título nombra `#208 R<n>`. Los `it` enmendados conservan su nombre y llevan el sufijo `(enmendado por #208 R<n>)`.
- [x] Cada R tiene un commit `test(...) (rojo)` antes de su `feat`. Los pares están en `traceability.md` y en el log.
  - R2 y R4 dieron rojo por import ausente, que es la excepción aprobada.
  - R7 tiene un commit de test extra, el arnés RNTL14 `b3a8f461`.
  - R10 tiene un segundo par, `69325d34` → `7e700588`, para conservar la fecha manual al repetir el chip.
- [x] C4(b): R20 y R21 nacieron verdes y no tienen feat, como permite tasks.md. Los probé con mi propia mutación en un worktree desechable (sección «Sondas»). Ambas dan rojo por aserción en el `it` `#208 R2x`.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». R1–R22 llevan test y hash.
- [x] Los commits siguen la convención declarada en la spec: `test(mobile): #208 R<n> … (rojo)` y luego `feat(mobile): #208 R<n> …`. `git rev-list --count 2eb28ef5..abb173c9` da 51 commits. Tres de ellos (M3: 92aa1d92, 31ccd3bb y 92bd50e6) son del leader, y uno es el commit documental final (abb173c9).

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla humana marcada el 2026-10-26.
- [x] Las enmiendas M1–M2 están firmadas (f9492b2e). La M3 está en la spec (92aa1d92) con firma delegada (31ccd3bb). E1 está aplicada.
- La casilla del smoke en dispositivo sigue `[ ]`. Es del humano: no la exijo ni la marco.

## Checklist C7 — Sin código huérfano
- [x] N/A: la feature no reemplaza ningún componente. Para el dueño, la tarjeta vacía nueva sustituye al `EmptyState` de vacunas. Los demás roles conservan `vaccines-empty`, y sus tests (líneas 446, 462 y 1415 de `screens/health/index.test.tsx`) siguen vigentes con `myRole: 'family'`.

## Checklist C8 — Carta de UI
- [x] Grep-clean sobre los 4 ficheros nuevos: cero hex, cero `-[…]`, cero `StyleSheet.create`, cero shadow/elevation legacy, cero `text-accent` desnudo y cero `text-warning`. Tampoco hay `'accent'` en `useThemeColors` ni `#208` sin R. Lo vigila `#208 R21` en `design-drift.test.ts:1302`, y la sonda R21 lo pone rojo.
- [x] Las clases categóricas van solo vía `CATEGORY_SLOTS`. `grep -cE "(bg|text)-category-"` da `screens/health/index.tsx:0` y `screens/vaccine-create/index.tsx:0`. `#64 R9` no está en el diff y su `files` sigue en `[join('utils', 'category-palette.ts')]`.
- [x] Dimensiones: el KAV lleva padding.
  - ScrollView: `paddingTop: insets.top + 12`, `paddingHorizontal: 20`, `paddingBottom: 24`.
  - Barra inferior: `paddingBottom: Math.max(insets.bottom, 16)`.
  - Los valores salen de `useSafeAreaInsets`.
- [x] La carga del catálogo usa `Skeleton` de heroui, sin Spinner suelto.
- [x] Reutiliza `ScreenHeader`, `DateField`, `FieldErrorMessage`, `Button`/`Checkbox` de heroui, `useChunkyLip`, `CONTINUOUS_CORNER` y `TABULAR_NUMS`. No hay recetas duplicadas.
- [x] Touch target ≥ 44pt: los chips llevan `hitSlop={TOUCH_SLOP}` (con candado R8), la acción del aviso `min-h-11`, y el CTA `h-14`.
- [~] Feedback pressed: lo dan los `Button` de heroui, pero no tres `Pressable` nuevos. La spec prescribe sus literales sin estado pulsado (ver Observación 1). La implementación cumple la spec al pie de la letra, así que la falta es deuda de la spec y de la carta, no un defecto de Codex. Sigo el precedente de #196 N3.
- [x] Sin animaciones nuevas y sin dependencias nuevas: `package.json` y `bun.lock` no cambian frente a H0.
- [x] Copy desde `i18n/catalog.ts` (+26 claves, R19). El escáner de copy suelta está verde.

## Inventarios R20, R21, M2, M3
Contrasté cada delta con `git diff -U0 2eb28ef5 abb173c9`. Ninguna aserción se borra ni se afloja: las líneas `-` son solo títulos que ganan sufijo y cifras que suman.

**R20 / M2** (`__tests__/ui-copy-table.ts`, `__tests__/ui-language.test.ts`)
- `R19_VACCINE_CREATE` tiene 29 filas: 5 de health, 23 de vaccine-create y 1 de form-rules. Las conté contra requirements.md §R20: las 21 `vaccineCreate.*` salvo `nameRequired`, `optional` dos veces y `validation.checkDetails`.
- `R5_HEALTH` gana la segunda fila `health.noVaccinesYet` con `// #208 R20` (`ui-copy-table.ts:171`).
- Su longitud pasa a `… + 7 - 1 + 1); // #220 R16 // #208 R20` (`ui-language.test.ts:140`). El ancla antigua da 0.
- `ALL_USES` esparce el bloque, y el `blocks` de `#194 R5` lo incluye, lo que suma +30.
- `SCREEN_FILES` gana `+ 1 // #208 R20: screens/vaccine-create/index.tsx` (`ui-language.test.ts:522`).
- Los dos `#194 R5` y `#186 R7` llevan `(enmendado por #208 R20)`.
- Hay un `describe('#208 R20: alta de vacuna')` nuevo con `toHaveLength(29)` y `checkUses`.

**R21** (`__tests__/chunky-cta-canvas-fidelity.test.ts`)
- `CTA_ROWS` gana 2 filas literales (`:50–51`).
- R3.3 añade `'vaccines-add'`.
- R6.2: `+1`, `+2`, `+2 + 1` y `+1 + 1`, como en la spec.
- R7.2 pasa a `{ reminders: 1, health: 1 }`.
- R7.3: los radios quedan `health 1 + 1` y `vaccine-create 1`, y la cuenta de `rounded-16` suma `+ 1 + 1`.
- R7.5 añade `health: 1` a primaryCompact, y R8.1 pasa a `['reminders-add-link', 'vaccines-add']`.
- Todos llevan el sufijo.

**R21** (`__tests__/consistency-classnames.test.ts`)
- `rounded-16 bg-accent` suma `+ 1 + 1` y `primaryRadius` pasa a `toHaveLength(1 + 1)`.
- `#62 R14`: Salud `+ 2` y entrada nueva para vaccine-create con 7 (`:255`). La suma de `#62 R14` y la de `#98 R10` ganan `+ 2 + 7` (`:342`, `:444`).
- `#62 R15`: entrada vaccine-create 1 (`:354`). `#69 R10` gana `+ 1` (`:385`).
- `#62 R12`: `textInputs` pasa a `6 + 1 + 3` y `withPlaceholder` a `5 + 3` (`:215–216`).
- `rounded-xl bg-accent` pasa a `toBe(1 + 1)` (`:446`).
- «inventaría los diecisiete primarios» suma health y vaccine-create (`:586–587`).
- `#64 R9` no se toca.

**M3**
- `profile-canvas-fidelity.test.ts`, rounded-tile: la lista pasa de 6 a 8, con health entre geofences y home y vaccine-create al final (`:52`, `:56`).
- `profile-canvas-fidelity.test.ts`, text-13: entra vaccine-create en su orden (`:90`).
- `alerts-canvas-fidelity.test.ts`, text-15: vaccine-create entra entre reset-password y weight-log (`:226`).
- `design-drift.test.ts`, rounded16: `'screens/health/index.tsx': 1 + 1, // #199 R14; #208 R21` y `'screens/vaccine-create/index.tsx': 1, // #208 R21` (`:1147`, `:1155`).
- `design-drift.test.ts`, text-17: la lista pasa de 20 a 22 con health y vaccine-create en su sitio (`:1252`, `:1260`).

**Menor, cosmético.** La entrada Salud de `#62 R14` (`consistency-classnames.test.ts`, fila `join('screens', 'health', 'index.tsx'), 2 + 1 + 1 + 1 + 2`) no lleva comentario `// #208 R21` en la fila. Lo lleva el título del `it`, y la spec no exige comentario en esa fila. No bloquea.

## Cuentas T0 y encadenadas
- T0 normativo: 5548 tests en 157 suites.
- La cadena de Codex suma +90 tests y +2 suites, y llega a **5638/159** (`final-test-208.log`, informe §Resultado final). Cada paso cuadra: anterior + añadidos (informe §Cierre consolidado).
- Tras el merge 1f3637b0, el log de init da **5704 tests en 160 suites**.
  - Se descompone como 5548 + 90 (#208) + 5 (#218, `impl_mobile-sheet-surface-background.md`: T0 5548 → 5553, +1 suite) + 61 (#219, `impl_mobile-weekly-average-format.md`: 5548 → 5609, +0 suites) = **5704**.
  - En suites: 157 + 2 + 1 + 0 = **160**. Cuadra exacto.

## Sondas de mutación del reviewer
Las corrí en un worktree desechable, `git worktree add --detach <scratchpad>/wt-208-probe HEAD` con `node_modules` enlazado. Nunca en wt-208.

| # | Requisito | Mutación | Fichero de test | Resultado | Motivo del rojo |
|---|---|---|---|---|---|
| 1 | R20 | `accessibilityLabel={t('health.addVaccine')}` extra en el `Button.Label` de `vaccines-add` (`screens/health/index.tsx`) | `__tests__/ui-language.test.ts` | `Tests: 2 failed, 31 passed, 33 total` | `#208 R20: R19_VACCINE_CREATE tiene 29 usos…`: `uses` esperado 2, recibido 3. También falla el global `#65 R18` |
| 2 | R21 | título de notas `text-foreground` → `text-accent` desnudo (`screens/vaccine-create/index.tsx`) | `__tests__/design-drift.test.ts` | `Tests: 1 failed, 114 passed, 115 total` | `#208 R21: los cuatro ficheros nuevos…`: `{ rule: 'tinta accent', count: 1 }` frente a 0 |
| 3 | R16 | el aviso se pinta para cualquier `petId` (`noticePetId !== null && (`) | `screens/health/index.test.tsx -t R16` | `Tests: 2 failed, 112 skipped, 10 passed, 124 total` | `#208 R16: un aviso de otra mascota no se pinta`: `toBeNull()` recibe el aviso, `index.test.tsx:1619` |
| 4 | R14 | `notes: notes.trim(),` sin condicional, lo que envía `notes: ''` | `screens/vaccine-create/index.test.tsx -t R14` | `Tests: 1 failed, 38 skipped, 3 passed, 42 total` | `#208 R14: guardar «Otra vacuna» sin próxima dosis… omite… opcionales vacíos`: el body recibido trae `"notes": ""` |
| 5 | R21/M3 | `rounded-tile` → `rounded-16` en vaccine-create | `__tests__/profile-canvas-fidelity.test.ts` | `Tests: 1 failed, 25 passed, 26 total` | `reserva rounded-tile… (enmendado por #208 R21)`: falta `"screens/vaccine-create/index.tsx"` |

- Los cinco rojos son por aserción. Ninguno es por timeout ni por excepción de arnés.
- Revertí cada sonda con `git checkout --` en el worktree desechable y luego lo retiré: `unlink` del enlace y `git worktree remove`, sin `--force`.
- wt-208 queda limpio. `git status --short -- mobile-pet-tracker/` y `git diff --stat -- mobile-pet-tracker/` salen vacíos. El único fichero sin seguimiento es este informe.

## Observaciones
Ninguna bloquea.

1. **Feedback pressed (C8, deuda de la spec y la carta).** `docs/ui-guidelines.md:277` exige feedback pressed en todo elemento tappable. Estos tres `Pressable` nuevos no lo tienen: ni style function ni `active:`.
   - `mobile-pet-tracker/src/screens/vaccine-create/index.tsx:144`: los chips `vaccine-chip-*`.
   - `mobile-pet-tracker/src/screens/vaccine-create/index.tsx:177`: la tarjeta `vaccine-create-reminder`.
   - `mobile-pet-tracker/src/screens/health/index.tsx:363`: la acción «Crear ahora», `vaccine-reminder-notice-action`.

   La spec prescribe sus props, clases y `style` literales (requirements.md:340–343, 472–475 y 644), copiando `type-chip` de add-reminder. Además, el inventario R7.5 depende de `style={selected ? chunkyLip.primaryCompact : undefined}` y `#62 R14` cuenta `style={CONTINUOUS_CORNER}` literal. Una style function rompería ambos candados. Por eso no es corregible sin enmendar la spec. Propongo registrarlo como deuda de carta, para una feature de pulsado que cubra también `type-chip`, como hizo #136 con las acciones rápidas.
2. **Sufijo de más.** `providers/__tests__/language-provider.test.tsx:614`: el título `#158 R1` gana `(enmendado por #208 R19)` en `f4b65cf3`, sin ningún cambio de aserción. Ese `it` verifica los 12 pares `docs.*` de #158, que #208 no toca. No afloja nada, pero el sufijo no corresponde a una enmienda real.
3. **Borde fuera de la spec.** Si `listPets` falla, la consulta del catálogo queda deshabilitada y la pantalla se queda en `Skeleton`, sin campo de nombre ni error visible. La spec no define ese estado, así que lo dejo como candidato a deuda.

## Output de ./init.sh (corrido por el leader sobre 1f3637b0)
Log en `progress/init-208.log`, 133333 líneas. Sus dos últimas líneas son el hash, que coincide con `git rev-parse HEAD`, y el exit. Pego las líneas decisivas:

```
# backend unitarios (líneas 301–305)
Test Suites: 195 passed, 195 total
Tests:       1595 passed, 1595 total
# infra (líneas 314–318)
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
# node:test del arnés, init-e2e-gate (líneas 596–597, 740–743)
ok 1 - \#208 R22: E2E_SETUP_CMD siembra el catálogo de vacunas entre migrar y aprovisionar
# tests 16
# pass 16
# fail 0
# móvil (líneas 132911–132915)
Test Suites: 160 passed, 160 total
Tests:       5704 passed, 5704 total
Snapshots:   1 passed, 1 total
Time:        236.034 s
# e2e (líneas 133301–133306)
Test Suites: 3 skipped, 31 passed, 31 of 34 total
Tests:       8 skipped, 580 passed, 588 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
1f3637b03584edfcc369de1b031b12da03381a11
exit=0
```

- `grep -cE '^FAIL |✕' progress/init-208.log` da 0. No hay rojos, ni flakes conocidos (#168 R2, #152 R8, #200 R10, tinte #0D1117), ni rojos reales.
- La e2e aplicó `db:migrate`, luego `seed:vaccines` y luego `provision:local` (R22), y pasó.

Veredicto: aprobado
