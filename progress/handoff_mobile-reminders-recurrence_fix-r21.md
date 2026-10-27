# Handoff: arreglo de B1 en #213 (R21, la ruta fija la mascota)

> **NO ejecutes `./init.sh`** aunque `AGENTS.md` lo pida. Lo corre el leader después.
> No hagas `git fetch`, `rebase`, `merge` ni `push`. No mates procesos que no hayas lanzado tú en esta tarea.

Leader: Claude Code (@Backend), 2026-10-27. Worktree: `/home/claude/sites/Pet-Tracker-wt-213`,
rama `feature/213-mobile-reminders-recurrence`. HEAD de partida (H0) = el commit que añade este
fichero; su padre es `44644e48`.

## Por qué

El reviewer rechazó `44644e48` por **B1**. Está en `progress/review_mobile-reminders-recurrence.md`.
Ese fichero está sin seguimiento: no lo edites, no lo añadas y no lo commitees.

El efecto de R21 en `mobile-pet-tracker/src/screens/reminders/index.tsx` (el `useEffect` que llama a
`selectPet(petId)`) depende de `selectedPetId` y lo compara con el parámetro. Si la pantalla se abre
con `petId` en la ruta (el toque de un push de R20), cada vez que el usuario pulsa otro chip el efecto
vuelve a correr y selecciona otra vez la mascota del parámetro. El usuario no puede cambiar de mascota.

La spec ya está enmendada: `specs/mobile-reminders-recurrence/requirements.md` §Errata del leader tras
el rechazo del reviewer, **E3**. Léela antes de empezar.

## Reglas

- Esperas: `docs/conventions.md` §Esperas sobre el árbol renderizado. El test ya está escrito y espera
  sobre el árbol; no lo cambies.
- RNTL 14: `await fireEvent`, `await render`, `await act`.
- Títulos y comentarios: la referencia a la feature va como `#213 R21`, nunca `#213` desnudo.
- Fuera de `screens/reminders/index.tsx` no tocas producción. Fuera del test del parche no tocas tests.
- No arregles las observaciones N1–N5 del review: quedan como deuda.

## Cadena

Todos los comandos, sin pipes. Los logs van al scratch que ya usas.

### c1 — test rojo (parche del leader)

```bash
cd /home/claude/sites/Pet-Tracker-wt-213
test "$(git hash-object progress/fix-r21_mobile-reminders-recurrence/c1.patch)" = dcd9540eb3981d08ed4de2855e60ad6e0de1fa1e
git apply --check progress/fix-r21_mobile-reminders-recurrence/c1.patch && git apply progress/fix-r21_mobile-reminders-recurrence/c1.patch
cd mobile-pet-tracker
bunx jest src/screens/reminders/index.test.tsx -t "#213 R21" > r21-c1.log 2>&1; echo "exit=$?"
```

Resultado esperado: `exit=1` y `Tests:       1 failed, 111 skipped, 2 passed, 114 total`. El único `✕`
es `#213 R21: tras abrir con petId se puede elegir otra mascota`. Falla en el `waitFor` de
`pet-chip-pet-1` (`index.test.tsx:2219`) con `"selected": false`. El leader lo midió así sobre
`44644e48`. Si sale otra cosa, **para** y repórtalo con el bloque `●` entero.

```bash
cd /home/claude/sites/Pet-Tracker-wt-213
git commit --only mobile-pet-tracker/src/screens/reminders/index.test.tsx -m "test(mobile): #213 keep pet chips selectable after a route petId (R21)"
git diff --cached --quiet
```

### c2 — arreglo (lo escribes tú)

En `mobile-pet-tracker/src/screens/reminders/index.tsx`, el efecto de R21 tiene que aplicar el parámetro
**una sola vez por cada valor de `petId`**:

- Sigue esperando a que `pets.data` llegue con `kind === 'ok'` y a que la mascota esté en la lista.
- Si `petId` no está en la lista, no selecciona nada y no crea un bucle de render.
- Ni la condición ni las deps del efecto usan `selectedPetId`.

`useRef` ya está importado en ese fichero. No toques `usePetSelection` ni ningún otro fichero.

Sonda de mutación (no se commitea). Con tu arreglo puesto, vuelve a añadir `selectedPetId` a las deps y
`petId !== selectedPetId` a la condición. El `it` nuevo tiene que volver a rojo. Después revierte la
sonda.

```bash
cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker
bunx jest src/screens/reminders/index.test.tsx > r21-c2.log 2>&1; echo "exit=$?"
```

Resultado esperado: `exit=0`, `Tests:       114 passed, 114 total`.

```bash
cd /home/claude/sites/Pet-Tracker-wt-213
git commit --only mobile-pet-tracker/src/screens/reminders/index.tsx -m "fix(mobile): #213 apply the route petId once per value (R21)"
git diff --cached --quiet
```

### c3 — trazabilidad

En `specs/mobile-reminders-recurrence/traceability.md`, fila R21:

- Añade a la columna de tests `src/screens/reminders/index.test.tsx::#213 R21: tras abrir con petId se puede elegir otra mascota`.
- Añade a la columna de commits los dos commits nuevos con su hash corto y su asunto, en el mismo formato
  que los que ya tiene. Los de `26d54072` y `2dd6966c` se quedan.

```bash
cd /home/claude/sites/Pet-Tracker-wt-213
git commit --only specs/mobile-reminders-recurrence/traceability.md -m "docs(specs): #213 trace the R21 route petId fix"
```

### Verificación completa

```bash
cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker
test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > typecheck-213-fix.log 2>&1 && test ! -s typecheck-213-fix.log
bunx expo lint --no-cache > lint-213-fix.log 2>&1 && test ! -s lint-213-fix.log
bun run test > test-213-fix.log 2>&1; echo "exit=$?"
```

Resultado esperado del completo: 160 suites y **5864** tests verdes (los 5863 del merge, más 1). Si la
suite cae por SIGKILL o por timeouts bajo carga, repítela una vez antes de concluir nada: hay otros
Codex corriendo jest en esta máquina. Si aparece un rojo que no se va al repetir, **para** y repórtalo
con el bloque `●` entero.

## Cierre

1. Añade al final de `progress/impl_mobile-reminders-recurrence.md` una sección `## Arreglo de B1 (R21)`.
   Pon en ella:
   - los tres commits con su hash;
   - qué cambiaste en el efecto, en una o dos frases;
   - la sonda de mutación y su resultado;
   - la tabla de typecheck, lint y completo con sus cifras.
2. Haz commit del reporte: `git commit --only progress/impl_mobile-reminders-recurrence.md -m "docs(mobile): #213 R21 fix in the implementation report"`.
3. Ejecuta `graphify update .` desde la raíz del worktree.
4. Escribe el marcador: `printf '%s\n' "$(git rev-parse --short HEAD)" > progress/impl_mobile-reminders-recurrence.fix.done`.

El diff de esta tarea, medido con `git diff --name-only <H0>..HEAD`, son exactamente estos cuatro ficheros:

- `mobile-pet-tracker/src/screens/reminders/index.test.tsx`
- `mobile-pet-tracker/src/screens/reminders/index.tsx`
- `specs/mobile-reminders-recurrence/traceability.md`
- `progress/impl_mobile-reminders-recurrence.md`

Si `graphify update .` toca `graphify-out/`, no lo commitees.
