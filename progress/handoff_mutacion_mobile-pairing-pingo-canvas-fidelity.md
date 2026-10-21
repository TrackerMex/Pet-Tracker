Worktree: /home/claude/sites/Pet-Tracker-wt-188-probe
Antes de tocar nada, confirma en el reporte: `pwd`, `git rev-parse --short HEAD` y que `progress/handoff_mutacion_mobile-pairing-pingo-canvas-fidelity.md` existe en ese HEAD. Si el worktree no es ese o el fichero no existe, PARA.

NO lances ./init.sh. Lo corre el leader.

Feature: mobile-pairing-pingo-canvas-fidelity (#188).
Tarea: prueba de mutación (CHECKPOINTS.md C4, punto 5) para R9, R11, R12 y R14. Es solo de tests: no implementa nada, no hace commits y no cambia la UI, así que no cargues skills de diseño.

Objetivo: demostrar que cada candado de la lista se pone rojo por su propia aserción cuando se rompe la producción. Las mutaciones son temporales: se aplican, se corre el test y se revierten.

Reglas:
  - No hagas `git commit`, `git add`, `git push` ni `git stash`. No escribas en el worktree principal `/home/claude/sites/Pet-Tracker-wt-188` salvo el reporte y los logs indicados abajo.
  - Un fichero mutado por vez. Antes de cada mutación, `git status --short` debe salir vacío. Tras cada corrida: `git checkout -- <fichero>` y comprueba que `git status --short` sale vacío. Si no sale vacío, PARA y reporta.
  - Usa `bun`, nunca npm ni npx. `node_modules` ya está instalado (lo dejó el leader con `bun install --frozen-lockfile`). No instales nada.
  - Cambia solo las líneas indicadas. Si una línea no tiene el contenido esperado, la mutación no aplica: PARA y reporta. No busques una línea parecida.
  - Si el sandbox deniega un comando, PARA y repórtalo. No lo sustituyas por otro comando que haga lo mismo.

Comando de test, desde `mobile-pet-tracker/` del worktree probe:
  `FORCE_COLOR=0 bun run test --runInBand --runTestsByPath <fichero> -t "<patrón>" > <log> 2>&1; echo exit=$?`
  Guarda el código de salida con `echo`, sin pipes: un pipe da el código de la última orden.
  Un `exit=0` no basta. En B1–B4 la línea `Tests:` debe mostrar al menos un test `passed` y ningún `failed`. Si no aparece o muestra 0 tests, el patrón no seleccionó nada: PARA y reporta.

Paso 0, línea base sin mutar (HEAD limpio). Las cuatro deben salir en verde (exit=0):
  B1: src/screens/pairing/index.test.tsx -t "#188 R9"
  B2: src/__tests__/pairing-canvas-fidelity.test.ts -t "#188 R11"
  B3: src/__tests__/pairing-canvas-fidelity.test.ts -t "#188 R12"
  B4: src/screens/pairing/index.test.tsx -t "#188 R14"
  Si alguna no sale en verde, PARA: el candado ya está roto y la mutación no demuestra nada.

Mutaciones. Cada una: aplicar, correr, revertir.

  M1 (R9). Fichero: mobile-pet-tracker/src/screens/pairing/index.tsx.
    La línea 283 es exactamente `        ) : null}` (cierre del bloque `pairing-title`). Inserta justo después una línea nueva: `        <Text testID="pairing-subtitle">mutacion R9</Text>`
    Test: src/screens/pairing/index.test.tsx -t "#188 R9"
    Rojo válido: fallo en `index.test.tsx:1249` (`expect(...toBeNull())` sobre `pairing-subtitle`) en las filas del it.each.

  M2 (R11). Fichero: mobile-pet-tracker/src/screens/pairing/index.tsx.
    La línea 388 es exactamente `                {t('pairing.pairCollar')}` (texto del botón de vincular). Sustituye solo esa expresión por el texto literal, manteniendo la indentación: `                Vincular collar`. La línea 281 (título) no se toca.
    Test: src/__tests__/pairing-canvas-fidelity.test.ts -t "#188 R11"
    Rojo válido: fallo en `pairing-canvas-fidelity.test.ts:53` (`expect(looseCopy).toEqual([])`) con `Vincular collar` en el diff.

  M3 (R12, fuente 1). Fichero: mobile-pet-tracker/src/screens/pairing/index.tsx.
    La línea 270 contiene `<View className="items-center justify-center" accessible={false}`. Cambia solo `className="items-center justify-center"` por `className="items-center justify-center w-[3px]"`.
    Test: src/__tests__/pairing-canvas-fidelity.test.ts -t "#188 R12"
    Rojo válido: fallo en `pairing-canvas-fidelity.test.ts:73` (`/className="[^"]*\[/`) en la fila `src/screens/pairing/index.tsx`.

  M4 (R12, fuente 2). Fichero: mobile-pet-tracker/src/components/ping-ring.tsx.
    Añade una línea de código nueva dentro del cuerpo de la función exportada, con la indentación del bloque: `const probeColor = '#ff0000';`. No la pongas en un comentario.
    Test: src/__tests__/pairing-canvas-fidelity.test.ts -t "#188 R12"
    Rojo válido: fallo en `pairing-canvas-fidelity.test.ts:72` (`expect(source).not.toMatch(hexLiteral)`) en la fila `src/components/ping-ring.tsx`.

  M5 (R14). Fichero: mobile-pet-tracker/src/screens/pairing/index.tsx.
    La línea 269 es exactamente `        {phase === 'idle' && selectedPet?.device === null ? (`. Cambia solo esa línea por `        {phase === 'idle' ? (`. Las líneas 279 y 350 tienen la misma condición: NO las toques.
    Test: src/screens/pairing/index.test.tsx -t "#188 R14"
    Rojo válido: fallo en `index.test.tsx:1292` (`expect(...toBeNull())` del bucle de testIDs) en las filas tracked, free, unknown y no-pets. La fila ready puede quedar en verde: en ready ese bloque no se muestra.

Clasificación de cada corrida mutada:
  - ROJO POR ASERCIÓN: el fallo sale en la línea de aserción indicada, con el valor o el diff de esa aserción.
  - ROJO INVÁLIDO: el fallo ocurre antes de la aserción (TypeError, ReferenceError, error de render, timeout de un findBy). No cuenta. Repórtalo tal cual.
  - NO ROJO: la corrida sale en verde con la mutación aplicada. No cuenta. No lo absuelvas repitiendo la corrida; repórtalo tal cual.

Reporte: escribe `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_mobile-pairing-pingo-canvas-fidelity.md` (ruta absoluta del worktree principal). Para B1–B4 y M1–M5 incluye:
  - comando exacto, código de salida y línea `Tests:`;
  - para M1–M5: diff aplicado (fichero y línea), filas rojas (nombre del it), línea de fallo `fichero:línea`, extracto de hasta 10 líneas del bloque de la aserción, veredicto (ROJO POR ASERCIÓN / ROJO INVÁLIDO / NO ROJO) y confirmación de que `git status --short` quedó vacío tras revertir;
  - HEAD probado (`git rev-parse --short HEAD`);
  - skills cargadas: ninguna.
Los logs completos van a `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_<B1..M5>.log`. Están ignorados por git: no los commitees; sirven de respaldo.

Al terminar: no crees ningún marcador `.done`, no commitees y no toques `progress/current.md`, `progress/handoff_*.md`, `feature_list.json`, `specs/` ni `docs/`.
