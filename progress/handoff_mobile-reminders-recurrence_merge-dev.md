# Handoff: merge de `origin/dev` en #213 (mobile-reminders-recurrence)

> **NO ejecutes `./init.sh`** aunque `AGENTS.md` lo pida. Lo corre el leader después.
> No hagas `git fetch`, `rebase` ni `push`. No mates procesos que no hayas lanzado tú en esta tarea.

Leader: Claude Code (@Backend), 2026-10-27. Worktree: `/home/claude/sites/Pet-Tracker-wt-213`,
rama `feature/213-mobile-reminders-recurrence`, HEAD de partida = el commit que añade este fichero.

## Por qué

Mientras implementabas #213, `dev` recibió #208 (`mobile-vaccine-create`, PR #268). Antes de la
revisión hay que mezclar `dev` en la rama. El merge en seco (`git merge-tree`) da **5 conflictos, todos
en tests de inventario**. Ningún fichero de producción entra en conflicto:

- `mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`
- `mobile-pet-tracker/src/__tests__/design-drift.test.ts`
- `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`

Se mezclan solos, pero pueden mover cuentas agregadas: `ui-copy-table.ts`, `ui-language.test.ts`,
`api/types.ts`, `i18n/catalog.ts`, `app/_layout.tsx`, `app/__tests__/layout.test.tsx` y
`profile-canvas-fidelity.test.ts`.

## Regla de resolución

Cada conflicto es la misma guarda enmendada por las dos features. Resuelve por **unión**:

1. **Título del `it`:** conserva los dos sufijos, primero `(enmendado por #208 R<n>)` (el de `dev`) y
   luego `(enmendado por #213 R22)`.
2. **Cuentas:** el valor resuelto es la base más el delta de #208 más el delta de #213. Escríbelo con los
   dos sumandos visibles y los dos comentarios (`// #208 R21`, `// #213 R6`…). No escribas el total ya
   sumado.
3. **Inventarios** (mapas `{ fichero: n }`, listas de ids o de ficheros): la unión de las entradas
   de los dos lados. Si una entrada cambia en los dos lados, combina los dos cambios. Ejemplo:
   `chunky-cta` R7.5 `neutral`, donde #213 pone Recordatorios a 2 y `dev` lo deja en 1; resuelve 2.
   Lo mismo en `primaryCompact`: `dev` añade `screens/health/index.tsx` y `vaccines-add`, #213 no lo
   toca; los dos se quedan.
4. **No toques código de producción.** Si tras el merge una guarda da rojo por un choque real entre
   #208 y #213 (los dos tocan el mismo nodo o el mismo literal de copy), **para**. Descríbelo en el
   reporte y no lo resuelvas.

## Cadena

```bash
cd /home/claude/sites/Pet-Tracker-wt-213
# -- base congelada: si no da 73922b10, para y repórtalo
test "$(git rev-parse --short origin/dev)" = 73922b10
git merge --no-ff --no-edit origin/dev   # se detiene con los 5 conflictos
# -- resuelve los 5 ficheros con la regla de arriba
git diff --name-only --diff-filter=U    # debe salir vacío tras resolver y hacer git add
git add mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
git commit --no-edit
```

Después, desde `mobile-pet-tracker/`, sin pipes y guardando cada log en el scratch que ya usas:

```bash
cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker
test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > typecheck-213-merge.log 2>&1 && test ! -s typecheck-213-merge.log
bunx expo lint --no-cache > lint-213-merge.log 2>&1 && test ! -s lint-213-merge.log
bun run test > test-213-merge.log 2>&1; echo "exit=$?"
```

- **Si el completo sale verde:** has terminado.
- **Si alguna guarda agregada que no estaba en conflicto da rojo** (una fila de copy de #208 que mueve
  `ALL_USES` o `SCREEN_FILES`, el recuento de rutas del layout, las claves del catálogo): enmiéndala
  con la misma regla de unión. Va en un commit aparte,
  `test(mobile): #213 re-count guard inventories after merging dev (#208)`. Después repite el completo.
- **Un rojo que no sea de guarda agregada:** para y repórtalo con el bloque `●` entero.

Si la suite cae por SIGKILL o por timeouts bajo carga, repite el completo una vez antes de concluir
nada. Hay otros dos Codex corriendo jest en esta máquina.

## Cierre

1. Añade al final de `progress/impl_mobile-reminders-recurrence.md` una sección `## Merge de origin/dev (73922b10)`.
   Incluye el hash del merge, cómo resolviste cada uno de los 5 ficheros (base, delta #208 y delta
   #213), el commit de re-cuenta si lo hubo, y la tabla de typecheck, lint y completo con sus cifras.
2. Haz commit de ese reporte con `git commit --only progress/impl_mobile-reminders-recurrence.md -m "docs(mobile): #213 merge of dev in the implementation report"`.
3. Ejecuta `graphify update .` desde la raíz del worktree.
4. Escribe el marcador: `printf '%s\n' "$(git rev-parse --short HEAD)" > progress/impl_mobile-reminders-recurrence.merge.done`.

## Adenda 1 (leader, tras la parada en typecheck)

Paraste bien. El rojo de `tsc` es mecánico: #213 añadió a `Reminder` (`src/api/types.ts`) los campos
obligatorios `recurrence` y `recurrenceUntil`, y el fixture de #208 en
`mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx` (el `mockCreateReminder.mockResolvedValue`
del `beforeEach`) se escribió antes y no los tiene. Queda autorizado este arreglo y **solo** este:

- En ese literal `reminder: { … status: 'scheduled' }` añade `recurrence: null, recurrenceUntil: null`
  después de `status: 'scheduled'`. Un recordatorio de vacuna creado por #208 no se repite, así que `null`
  es el valor correcto. No toques ningún otro fichero de producción ni de test por esta adenda.
- Commit aparte, antes del de re-cuenta si lo hay:
  `git commit --only mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx -m "test(mobile): #213 complete the #208 reminder fixture with recurrence fields after merging dev"`
- Después retoma la cadena desde typecheck (typecheck, lint y completo, mismos logs). Si sale otro rojo
  de tipos en un fixture de `Reminder`, aplica la misma regla en el mismo commit (enmiéndalo con
  `--amend` solo si aún no hay commits detrás) y nómbralo en el reporte. Cualquier otro rojo: para.
- Cierre igual que arriba; en el reporte, añade el commit del fixture a la sección del merge.
