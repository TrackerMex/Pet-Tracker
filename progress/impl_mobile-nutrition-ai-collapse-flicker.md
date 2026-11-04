# Implementación #234 — mobile-nutrition-ai-collapse-flicker

**Estado: implementación completa; comprobaciones móviles verdes. Smoke G2 y gate global a cargo del humano/leader.**

Fecha: 2026-11-03. Worktree: `/home/claude/sites/Pet-Tracker-wt-234`.
Branch: `feature/234-mobile-nutrition-ai-collapse-flicker`. Destino: `dev`.
H0 de producción: `e1231ece`. Base del handoff / diff acotado: `244fad9b`.

## Primer comando tras leer el handoff completo

```text
$ cd /home/claude/sites/Pet-Tracker-wt-234 && pwd && git branch --show-current && git log --oneline -4
/home/claude/sites/Pet-Tracker-wt-234
feature/234-mobile-nutrition-ai-collapse-flicker
244fad9b docs(progress): #234 codex handoff
e1231ece chore(spec): firma delegada #234 (mandato del humano 2026-10-23, ampliado 2026-11-03)
26b86621 Merge pull request #296 from TrackerMex/feature/232-mobile-add-reminder-chip-lip-clip
12ea75b4 Merge origin/dev into feature/232-mobile-add-reminder-chip-lip-clip
```

Árbol inicialmente limpio. Spec leída completa (requirements/design/tasks/traceability),
D1–D9 cerradas. Sin `init.sh`, fetch, merge, rebase ni instalación de dependencias.
Sin PR. Bookkeeping y gates humanos reservados al leader/humano según handoff.

## Skills y referencias cargadas

- `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md` (encontrada en caché local; no aparecía en el catálogo inicial).
- `ponytail:ponytail`: `/home/claude/.codex/plugins/cache/ponytail/ponytail/5.3.3/skills/ponytail/SKILL.md`.
- `appllama-app-design-skill`: `.agents/skills/appllama-app-design-skill/SKILL.md`.

Prevalecen arquitectura, convenciones, carta y spec del repo. Smoke Android lo hace el
humano según la carta; no hay rediseño, navegación, motion ni assets nuevos.
Leído `mobile-pet-tracker/AGENTS.md` y consultada la documentación versionada exigida:
[Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).

## T0, antes de editar

```text
$ cd /home/claude/sites/Pet-Tracker-wt-234/mobile-pet-tracker && bunx jest src/screens/food src/__tests__ > /tmp/t0-234.log 2>&1; echo "exit=$?"
exit=0
Test Suites: 45 passed, 45 total
Tests:       1262 passed, 1262 total
Snapshots:   0 total
Time:        48.263 s

$ bunx jest src/screens/food/ai-explanation.test.tsx
exit=0
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Time:        4.227 s
```

Logs íntegros: `/tmp/t0-234.log`, `/tmp/t0-unit-234.log`.
Anclas medidas por invocaciones reales de `grep -cF --` (log `/tmp/anchors-t0-234.log`):

```text
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: onLayout => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: testID="food-ai-content" => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: testID="food-ai-measure" => 0 (expected 0)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: setContentHeight( => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: const AI_CLAMP_HEIGHT = 122; => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: const AI_FADE_HEIGHT = 36; => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: blocks.map( => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: renderBlocks( => 0 (expected 0)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: mt-1.75 size-1.25 shrink-0 rounded-full => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: flex-1 text-13 font-medium leading-body text-foreground => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: absolute inset-x-0 top-0 opacity-0 => 0 (expected 0)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: absolute inset-x-0 bottom-0 => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: pointerEvents="none" => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: accessibilityElementsHidden => 0 (expected 0)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: importantForAccessibility="no-hide-descendants" => 0 (expected 0)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: overflow-hidden => 1 (expected 1)
mobile-pet-tracker/src/screens/food/ai-explanation.tsx: #224 R6 => 2 (expected 2)
mobile-pet-tracker/src/screens/food/ai-explanation.test.tsx: await layout( => 10 (expected 10)
mobile-pet-tracker/src/screens/food/ai-explanation.test.tsx: #234 => 0 (expected 0)
mobile-pet-tracker/src/screens/food/ai-explanation.test.tsx: (enmendado por #234 R4) => 0 (expected 0)
```

## Commits test primero

- `d1917e94` — `test(mobile): #234 measure the AI card outside its clip (R1, R4, R5, R6)`.
  Rojo medido: **32 failed, 7 passed, 39 total**, exit 1 (`/tmp/p1-red-234.log`).
  Fallos por aserciones: existencia del medidor (`Unable to find an element with testID: food-ai-measure`),
  estructura/carriers de R1 y estado de R5 sin medida. Sin imports rotos ni errores de carga.
- `f46549e1` — `feat(mobile): #234 move the AI card measurement outside the clip (R1, R4, R5, R6)`.
  Verde medido: **39 passed**, exit 0 (`/tmp/p1-green-234.log`).
  Solo mueve el manejador a un medidor vacío como primer hijo de la raíz (estado intermedio prescrito).

## Mutaciones

Guards tras `f46549e1`: **45 suites, 1273 tests verdes**, exit 0 (`/tmp/p1-guards-234.log`, 22.327 s). Mutaciones del par 1 en el orden de tasks.md. Cada una usa la suite completa de ai-explanation; restauración explícita con `git checkout HEAD -- mobile-pet-tracker/src/screens/food/ai-explanation.tsx`, seguida de `git diff --cached --quiet` y diff de producción vacío, ambos exit 0.

### R1a

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R1a-234.log`.

```text
Tests:       8 failed, 31 passed, 39 total
#234 R1: el medidor vive fuera del recorte › #234 R1: solo el medidor lleva onLayout
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 122 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 0 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 con medida 100
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 sin medida
#234 R6: el recorte no oscila › #234 R6: la secuencia que producía el parpadeo se queda quieta
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

### R1b

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R1b-234.log`.

```text
Tests:       2 failed, 37 passed, 39 total
#234 R1: el medidor vive fuera del recorte › #234 R1: food-ai-measure es hermano anterior de food-ai-body bajo la raíz gap-2
#234 R1: el medidor vive fuera del recorte › #234 R1: ningún ancestro del medidor es el recorte ni su contenido
```

R1(b): solo fallan los dos tests estructurales de R1; R4, R5 y R6 quedan verdes. Confirma la zona ciega del layout simulado.

### R1c

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R1c-234.log`.

```text
Tests:       3 failed, 36 passed, 39 total
#224 R5: SAMPLE pinta cada bloque, punto y tramo con su receta exacta
#234 R1: el medidor vive fuera del recorte › #234 R1: food-ai-measure es hermano anterior de food-ai-body bajo la raíz gap-2
#234 R1: el medidor vive fuera del recorte › #234 R1: ningún ancestro del medidor es el recorte ni su contenido
```

### R1d

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R1d-234.log`.

```text
Tests:       23 failed, 16 passed, 39 total
#224 R4: copy es de more
#224 R4: copy es de less
#224 R4: copy en de more
#224 R4: copy en de less
#224 R6: alto 123 limita según la frontera de 122 (enmendado por #234 R4)
#224 R6: alto 400 limita según la frontera de 122 (enmendado por #234 R4)
#224 R6: el degradado ocupa 36 y usa el fondo violeta del tema
#224 R7: el botón alterna Ver más / Ver menos y el chevron
#224 R7: la zona táctil es de 44
#224 R7: un texto nuevo colapsa
#224 R8: aviso siempre visible en es expandido
#224 R8: aviso siempre visible en en expandido
#224 R9: el botón no está dentro de la unidad de lectura
#224 R9: el recorte no cambia la etiqueta
#234 R1: el medidor vive fuera del recorte › #234 R1: food-ai-measure es hermano anterior de food-ai-body bajo la raíz gap-2
#234 R1: el medidor vive fuera del recorte › #234 R1: solo el medidor lleva onLayout
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 122 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 0 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 con medida 100
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 sin medida
#234 R6: el recorte no oscila › #234 R6: la secuencia que producía el parpadeo se queda quieta
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

### R4a

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R4a-234.log`.

```text
Tests:       1 failed, 38 passed, 39 total
#224 R6: alto 122 limita según la frontera de 122 (enmendado por #234 R4)
```

### R4b

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R4b-234.log`.

```text
Tests:       10 failed, 29 passed, 39 total
#224 R6: alto 123 limita según la frontera de 122 (enmendado por #234 R4)
#224 R6: alto 400 limita según la frontera de 122 (enmendado por #234 R4)
#224 R7: el botón alterna Ver más / Ver menos y el chevron
#224 R7: un texto nuevo colapsa
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 122 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 0 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 tras medir 400
#234 R6: el recorte no oscila › #234 R6: la secuencia que producía el parpadeo se queda quieta
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

### R4c

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R4c-234.log`.

```text
Tests:       4 failed, 35 passed, 39 total
#224 R6: alto 0 limita según la frontera de 122 (enmendado por #234 R4)
#224 R6: alto 122 limita según la frontera de 122 (enmendado por #234 R4)
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 con medida 100
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

### R4d

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R4d-234.log`.

```text
Tests:       23 failed, 16 passed, 39 total
#224 R4: copy es de more
#224 R4: copy es de less
#224 R4: copy en de more
#224 R4: copy en de less
#224 R6: alto 123 limita según la frontera de 122 (enmendado por #234 R4)
#224 R6: alto 400 limita según la frontera de 122 (enmendado por #234 R4)
#224 R6: el degradado ocupa 36 y usa el fondo violeta del tema
#224 R7: el botón alterna Ver más / Ver menos y el chevron
#224 R7: la zona táctil es de 44
#224 R7: un texto nuevo colapsa
#224 R8: aviso siempre visible en es expandido
#224 R8: aviso siempre visible en en expandido
#224 R9: el botón no está dentro de la unidad de lectura
#224 R9: el recorte no cambia la etiqueta
#234 R1: el medidor vive fuera del recorte › #234 R1: food-ai-measure es hermano anterior de food-ai-body bajo la raíz gap-2
#234 R1: el medidor vive fuera del recorte › #234 R1: solo el medidor lleva onLayout
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 122 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 0 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 con medida 100
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 sin medida
#234 R6: el recorte no oscila › #234 R6: la secuencia que producía el parpadeo se queda quieta
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

### R5a

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R5a-234.log`.

```text
Tests:       8 failed, 31 passed, 39 total
#234 R1: el medidor vive fuera del recorte › #234 R1: solo el medidor lleva onLayout
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 122 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 0 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 con medida 100
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 sin medida
#234 R6: el recorte no oscila › #234 R6: la secuencia que producía el parpadeo se queda quieta
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

### R5b

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R5b-234.log`.

```text
Tests:       8 failed, 31 passed, 39 total
#234 R1: el medidor vive fuera del recorte › #234 R1: solo el medidor lleva onLayout
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 122 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 0 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 con medida 100
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 sin medida
#234 R6: el recorte no oscila › #234 R6: la secuencia que producía el parpadeo se queda quieta
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

### R5c

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R5c-234.log`.

```text
Tests:       7 failed, 32 passed, 39 total
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 122 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 0 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 con medida 100
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 sin medida
#234 R6: el recorte no oscila › #234 R6: la secuencia que producía el parpadeo se queda quieta
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

### R6a

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R6a-234.log`.

```text
Tests:       8 failed, 31 passed, 39 total
#234 R1: el medidor vive fuera del recorte › #234 R1: solo el medidor lleva onLayout
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 122 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 0 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 con medida 100
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 sin medida
#234 R6: el recorte no oscila › #234 R6: la secuencia que producía el parpadeo se queda quieta
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

### R6b

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R6b-234.log`.

```text
Tests:       1 failed, 38 passed, 39 total
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
```

### R6c

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R6c-234.log`.

```text
Tests:       1 failed, 38 passed, 39 total
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

## Reanudación autorizada por el humano

Se mantiene íntegro el par 1 (`d1917e94`, `f46549e1`). El leader resolvió el
PARA anterior mediante `d800bee5`: R1 it 3 exige también `toHaveLength(1)`.
Leída completa la sección «Enmienda del leader» de tasks.md. El usuario autoriza
un commit extra, que nace verde y se prueba por R5(c) y R1(d), antes de los pares 2 y 3.
El diff acotado incluye requirements.md y tasks.md por ese commit del leader.
No se ejecuta `init.sh` y no se reescribe la historia.

```text
/home/claude/sites/Pet-Tracker-wt-234
feature/234-mobile-nutrition-ai-collapse-flicker
d800bee5 docs(spec): #234 pin onLayout carrier count in R1 it 3
f46549e1 feat(mobile): #234 move the AI card measurement outside the clip (R1, R4, R5, R6)
d1917e94 test(mobile): #234 measure the AI card outside its clip (R1, R4, R5, R6)
244fad9b docs(progress): #234 codex handoff
e1231ece chore(spec): firma delegada #234 (mandato del humano 2026-10-23, ampliado 2026-11-03)
```

La R5(c) de la primera sesión (7 fallos y R1 it 3 verde) queda como evidencia
histórica del hueco ya enmendado; el resultado válido se repite a continuación.

### R5c

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R5c-234.log`.

```text
Tests:       8 failed, 31 passed, 39 total
#234 R1: el medidor vive fuera del recorte › #234 R1: solo el medidor lleva onLayout
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 122 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 0 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 con medida 100
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 sin medida
#234 R6: el recorte no oscila › #234 R6: la secuencia que producía el parpadeo se queda quieta
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

### R1d

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R1d-234.log`.

```text
Tests:       23 failed, 16 passed, 39 total
#224 R4: copy es de more
#224 R4: copy es de less
#224 R4: copy en de more
#224 R4: copy en de less
#224 R6: alto 123 limita según la frontera de 122 (enmendado por #234 R4)
#224 R6: alto 400 limita según la frontera de 122 (enmendado por #234 R4)
#224 R6: el degradado ocupa 36 y usa el fondo violeta del tema
#224 R7: el botón alterna Ver más / Ver menos y el chevron
#224 R7: la zona táctil es de 44
#224 R7: un texto nuevo colapsa
#224 R8: aviso siempre visible en es expandido
#224 R8: aviso siempre visible en en expandido
#224 R9: el botón no está dentro de la unidad de lectura
#224 R9: el recorte no cambia la etiqueta
#234 R1: el medidor vive fuera del recorte › #234 R1: food-ai-measure es hermano anterior de food-ai-body bajo la raíz gap-2
#234 R1: el medidor vive fuera del recorte › #234 R1: solo el medidor lleva onLayout
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 122 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 0 tras medir 400
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 con medida 100
#234 R5: el nodo recortado no decide › #234 R5: recortado reporta 400 sin medida
#234 R6: el recorte no oscila › #234 R6: la secuencia que producía el parpadeo se queda quieta
#234 R6: el recorte no oscila › #234 R6: expandir y contraer no dependen del nodo recortado
#234 R6: el recorte no oscila › #234 R6: un texto nuevo se mide otra vez en el medidor
```

## Commit extra autorizado

`020c8ca2` — `test(mobile): #234 pin the onLayout carrier count (R1)`.
**Nace verde**: 39 passed / 39 total, exit 0 (`/tmp/r1-count-green-234.log`).
Solo añade `expect(carriers).toHaveLength(1)` junto a `toEqual`.
Las sondas R5(c) y R1(d) se repiten tras el commit; sus logs se renuevan y la
salida histórica anterior permanece transcrita en este reporte.

## Par 2 — R2

- `fdc350c0` — `test(mobile): #234 measurer must repeat the visible blocks (R2)`.
  Rojo exacto: **3 failed, 39 passed, 42 total**, exit 1 (`/tmp/p2-red-234.log`).
  Las tres filas fallan por `toHaveLength`: medidor vacío (0 bloques frente a 6/2/1).
  Sin errores de importación ni de ejecución de la suite.
- `440f4f3b` — `feat(mobile): #234 render the measurer from the same blocks as the content (R2)`.
  Verde exacto: **42 passed, 42 total**, exit 0 (`/tmp/p2-green-234.log`).
  `renderBlocks` es función de módulo y se usa para las dos variantes;
  solo la visible recibe testIDs. Recetas visuales sin cambios.

Anclas del par 2 (`grep -cF --`): `renderBlocks(` → 3, `blocks.map(` → 1,
receta de punto → 1, receta de texto de viñeta → 1.

Suites amplias tras `440f4f3b`: **1 failed, 44 passed, 45 total**;
**2 failed, 1274 passed, 1276 total**, exit 1 (`/tmp/p2-guards-234.log`).
Causa conocida del estado intermedio prescrito: el medidor ya repite los bloques
(R2), pero aún no está oculto (R3). Las consultas de `food/index.test.tsx` por
`Split the daily amount into two balanced meals.` y `Plan explicado.` encuentran
dos copias. No se modifica el consumidor; el par 3 prescrito oculta la copia.
No es fallo de carga ni flake; la suite de IA tiene los 42 verdes previstos.

### R2a

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R2a-234.log`.

```text
Tests:       1 failed, 41 passed, 42 total
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de SAMPLE
```

### R2b

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R2b-234.log`.

```text
Tests:       2 failed, 40 passed, 42 total
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de SAMPLE
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de una viñeta tras una línea
```

### R2c

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R2c-234.log`.

```text
Tests:       1 failed, 41 passed, 42 total
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de solo una viñeta
```

### R2d

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R2d-234.log`.

```text
Tests:       3 failed, 39 passed, 42 total
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de SAMPLE
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de una viñeta tras una línea
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de solo una viñeta
```

### R2e

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R2e-234.log`.

```text
Tests:       4 failed, 38 passed, 42 total
#224 R5: la viñeta usa un punto visual sin glifos en el texto
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de SAMPLE
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de una viñeta tras una línea
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de solo una viñeta
```

### R2f

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R2f-234.log`.

```text
Tests:       1 failed, 41 passed, 42 total
#234 R2: el medidor repite lo que se ve › #234 R2: el medidor repite los bloques de SAMPLE
```

## Par 3 — R3

- `4f14ef23` — `test(mobile): #234 measurer must be hidden and inert (R3)`.
  Rojo exacto: **2 failed, 42 passed, 44 total**, exit 1 (`/tmp/p3-red-234.log`).
  Fallos por aserción: clase ausente y dos copias del texto por defecto.
- `699d4ec1` — `feat(mobile): #234 hide the measurer from touches and screen readers (R3)`.
  Verde exacto: **44 passed, 44 total**, exit 0 (`/tmp/p3-green-234.log`).
  Única clase nueva `absolute inset-x-0 top-0 opacity-0`, con `pointerEvents="none"`,
  ambas propiedades de ocultación accesible y comentario `#234 R3`.

### R3a

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R3a-234.log`.

```text
Tests:       1 failed, 43 passed, 44 total
#234 R3: el medidor está oculto e inerte › #234 R3: el medidor no se ve, no se toca y no se lee
```

### R3b

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R3b-234.log`.

```text
Tests:       1 failed, 43 passed, 44 total
#234 R3: el medidor está oculto e inerte › #234 R3: el medidor no se ve, no se toca y no se lee
```

### R3c

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R3c-234.log`.

```text
Tests:       2 failed, 42 passed, 44 total
#234 R3: el medidor está oculto e inerte › #234 R3: el medidor no se ve, no se toca y no se lee
#234 R3: el medidor está oculto e inerte › #234 R3: las consultas por defecto ven una sola copia del texto
```

### R3d

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R3d-234.log`.

```text
Tests:       1 failed, 43 passed, 44 total
#234 R3: el medidor está oculto e inerte › #234 R3: el medidor no se ve, no se toca y no se lee
```

### R3e

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R3e-234.log`.

```text
Tests:       1 failed, 43 passed, 44 total
#234 R3: el medidor está oculto e inerte › #234 R3: el medidor no se ve, no se toca y no se lee
```

### R3f

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R3f-234.log`.

```text
Tests:       1 failed, 43 passed, 44 total
#234 R3: el medidor está oculto e inerte › #234 R3: el medidor no se ve, no se toca y no se lee
```

### R7a

`bunx jest src/screens/food/ai-explanation.test.tsx` → exit 1. Log: `/tmp/mutation-R7a-234.log`.

```text
Tests:       1 failed, 43 passed, 44 total
#224 R5: SAMPLE pinta cada bloque, punto y tramo con su receta exacta
```

### R7b

`bunx jest src/__tests__/nutrition-canvas-fidelity.test.ts` → exit 1. Log: `/tmp/mutation-R7b-234.log`.

```text
Tests:       1 failed, 32 passed, 33 total
#224 R13: screens/food/ai-explanation.tsx no usa StyleSheet ni corchetes ni hex salvo #NNN R<n>
```

## Semillas y lectura de las mutaciones

Orden original del par 1: R1(a–d), R4(a–d), R5(a–c), R6(a–c).
Tras la enmienda: R5(c), R1(d), R2(a–f), R3(a–f), R7(a–b).
Cada sonda ejecuta Jest sin errores de importación/carga y se revierte antes de la
siguiente con `git checkout HEAD -- mobile-pet-tracker/src/screens/food/ai-explanation.tsx`.
Después, `git diff --cached --quiet` y diff del fuente vacío terminan en 0.
Ninguna mutación se commitea. El guard R7(b) **se ejecuta, no se edita**.

| Sonda | Siembra temporal |
|---|---|
| R1(a), R5(a), R6(a) | Manejador en contenido además del medidor |
| R1(b) | Medidor dentro del recorte, como hermano anterior del contenido |
| R1(c) | Medidor dentro del contenido |
| R1(d) | Manejador movido del medidor a un View anónimo que envuelve al contenido |
| R4(a) | Frontera `>` → `>=` |
| R4(b) | Constante 122 → 123 |
| R4(c) | Medir `layout.width` |
| R4(d) | Manejador quitado del medidor y repuesto en contenido |
| R5(b) | Manejador adicional en body |
| R5(c) | Manejador adicional en View anónimo alrededor del contenido |
| R6(b) | Reiniciar expansión al llegar cada medida |
| R6(c) | Congelar primera medida distinta de cero |
| R2(a) | Medidor omite margen de párrafos posteriores |
| R2(b) | Medidor omite márgenes de viñetas |
| R2(c) | Medidor añade margen a viñeta de índice cero |
| R2(d) | Medidor omite puntos |
| R2(e) | Medidor reparte testIDs de bloque |
| R2(f) | Medidor omite tramos en negrita |
| R3(a) | Quitar solo accessibilityElementsHidden |
| R3(b) | Quitar solo importantForAccessibility |
| R3(c) | Quitar ambas ocultaciones accesibles |
| R3(d) | Quitar pointerEvents del medidor |
| R3(e) | Quitar opacity-0 |
| R3(f) | Medidor accessible |
| R7(a) | Quitar shrink-0 del punto compartido |
| R7(b) | Añadir comentario con hex `#abcdef` al fuente |

Fallos colaterales explicados: R1(c) rompe también la posición del primer hijo
(R1 it 1); R1(d)/R4(d) rompen los consumidores del botón porque ya no llegan medidas.
R4(b) rompe también estilos que esperan 122 porque la constante determina el estilo.
R4(c) rompe las secuencias que miden 100 al usar ancho 300. Reponer el manejador
recortado rompe los tres R6 además de R5. R2(e) rompe también un #224 R5 por testIDs
duplicados antes de ocultar el medidor. No se cambió ninguna aserción antigua.

R1(b) confirma la zona ciega exigida: solo dos tests estructurales rojos, R4/R5/R6 verdes.
Tras `020c8ca2`, R5(c) falla específicamente por longitud 2 frente a 1 en R1 it 3;
el `undefined` anónimo ya no pasa. R3(a/b) dejan rojo solo it 1 y verde it 2;
R3(c) deja rojos ambos. R7(a) deja verdes las tres filas R2 al compartir el render,
pero #224 R5 detecta la receta rota. R7(b) deja rojo #224 R13 (1 failed / 32 passed / 33 total).

## Anclas finales

Log `/tmp/anchors-t1-234.log`, mediciones reales con `grep -cF --`:

```text
onLayout => 1 (expected 1)
testID="food-ai-content" => 1 (expected 1)
testID="food-ai-measure" => 1 (expected 1)
setContentHeight( => 1 (expected 1)
const AI_CLAMP_HEIGHT = 122; => 1 (expected 1)
const AI_FADE_HEIGHT = 36; => 1 (expected 1)
blocks.map( => 1 (expected 1)
renderBlocks( => 3 (expected 3)
mt-1.75 size-1.25 shrink-0 rounded-full => 1 (expected 1)
flex-1 text-13 font-medium leading-body text-foreground => 1 (expected 1)
absolute inset-x-0 top-0 opacity-0 => 1 (expected 1)
absolute inset-x-0 bottom-0 => 1 (expected 1)
pointerEvents="none" => 2 (expected 2)
accessibilityElementsHidden => 1 (expected 1)
importantForAccessibility="no-hide-descendants" => 1 (expected 1)
overflow-hidden => 1 (expected 1)
#224 R6 => 2 (expected 2)
(enmendado por #234 R4) => 1
```

## Verificación final — primera pasada bajo carga

T1 inicial (`/tmp/t1-first-234.log`): **1 failed, 44 passed, 45 total**;
**1 failed, 1277 passed, 1278 total**, exit 1, 297.172 s.
Único fallo: timeout de 5000 ms de `#200 R6: servida es píldora verde y pendiente
es botón con labio (meal-pending-1)` en `food/index.test.tsx`. Suite de IA 44 verdes;
los dos duplicados intermedios de R2 ya no fallan. Se repite food/index sola,
sin cambiar timeout, mocks ni aserciones, según handoff (§Timeout bajo carga).

TSC: `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit` → 0, log vacío.
`router.d.ts` no existe y no se elimina ningún fichero.

Carga observada al acabar: load average 163.93 / 126.33 / 67.23; 15992 MB RAM,
3951 MB disponibles, sin swap. Lint inicial no emitió LINT_OK y dejó 52 bytes;
log íntegro conservado en `/tmp/lint-first-234.log`. Se repetirá sin caché.

Repetición aislada de `bunx jest src/screens/food/index.test.tsx`:
**1 suite, 151 tests verdes**, exit 0 (`/tmp/food-retry-234.log`, suite 50.994 s).
Confirma el timeout bajo carga; no se cambió el test ni su límite de 5000 ms.

Lint inicial: `error: Failed to run "eslint" due to signal SIGKILL`.
La comprobación de log no vacío impidió darlo por verde; se repite sola y sin caché.

## Alcance y disciplina de commits

`git diff d800bee5 -- requirements.md tasks.md` sobre las dos rutas exactas de
esta spec: vacío. Ambos ficheros son exclusivamente la enmienda del leader.
Ningún cambio en `food/index.tsx`, su test, backend, i18n, theme, dependencias,
bookkeeping ni handoff. El diff de producción se limita a `ai-explanation.tsx`.
`git diff --cached --quiet` y `git diff --check`: exit 0 antes del cierre.

Ancla R7 de líneas eliminadas del test desde `244fad9b`:

```diff
-] as const)('#224 R6: alto %s limita según la frontera de 122', async (height, clamped) => {
```
Las aserciones antiguas y sus helpers, salvo layout y el nuevo clippedLayout, se conservan.

Repetición aislada de lint:

```text
$ cd /home/claude/sites/Pet-Tracker-wt-234/mobile-pet-tracker && bunx expo lint --no-cache > /tmp/lint-234.log 2>&1 && test ! -s /tmp/lint-234.log && echo LINT_OK
LINT_OK
exit=0
```

Log final vacío (0 bytes). El primer SIGKILL quedó resuelto al repetir sola.
Se repite T1 completo sin otras comprobaciones pesadas en paralelo.

## Resultado final

```text
$ cd /home/claude/sites/Pet-Tracker-wt-234/mobile-pet-tracker && bunx jest src/screens/food src/__tests__ > /tmp/t1-234.log 2>&1; echo "exit=$?"
exit=0
Test Suites: 45 passed, 45 total
Tests:       1278 passed, 1278 total
Snapshots:   0 total
Time:        60.314 s
```

Mismas 45 suites que T0; 1262 → 1278 (+16). La suite de IA pasa de 28 a 44;
el verde específico de 44 está en `/tmp/p3-green-234.log` y T1 la incluye.
Los dos duplicados del estado intermedio R2 quedan resueltos por R3.
T1 no tiene suites sin ejecutar por fallo de carga ni SIGKILL. Jest avisa de
un worker que no cerró con normalidad al desmontar; los 1278 tests se ejecutan,
las 45 suites pasan y el proceso sale en 0. No se alteró teardown ajeno al alcance.

```text
$ test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc-234.log 2>&1; echo $?
0
$ bunx expo lint --no-cache > /tmp/lint-234.log 2>&1 && test ! -s /tmp/lint-234.log && echo LINT_OK
LINT_OK
```

Logs finales de tipos y lint: 0 bytes. El rojo de timeout y el SIGKILL inicial
quedan conservados en los logs `*-first-234.log`, con las repeticiones descritas arriba.

R1–R7 implementados y con trazabilidad. Se conservan íntegros `d1917e94` y
`f46549e1`; se añade el commit extra autorizado y se mantienen los pares 2/3
test primero. Todas las mutaciones están revertidas. No se ejecutó `init.sh`,
no se instalaron dependencias, no hubo fetch/merge/rebase y no se abrió ni editó PR.
No se marcaron G2, la enmienda humana de #224 ni el status de la feature.
El mecanismo real en Yoga/Fabric, ancho/alto y lectura con TalkBack los confirma
el smoke G2 del humano, con claro/oscuro; no se simula ese gate como hecho.

## Commit de trazabilidad y árbol final

`4befdba5` — `docs(spec): #234 traceability`.
Trazabilidad sin filas pendientes; no se reescribe historia después.

Cadena completa desde el handoff (incluye la enmienda del leader):

```text
d1917e94 test(mobile): #234 measure the AI card outside its clip (R1, R4, R5, R6)
f46549e1 feat(mobile): #234 move the AI card measurement outside the clip (R1, R4, R5, R6)
d800bee5 docs(spec): #234 pin onLayout carrier count in R1 it 3
020c8ca2 test(mobile): #234 pin the onLayout carrier count (R1)
fdc350c0 test(mobile): #234 measurer must repeat the visible blocks (R2)
440f4f3b feat(mobile): #234 render the measurer from the same blocks as the content (R2)
4f14ef23 test(mobile): #234 measurer must be hidden and inert (R3)
699d4ec1 feat(mobile): #234 hide the measurer from touches and screen readers (R3)
4befdba5 docs(spec): #234 traceability
```

`git status --short -- mobile-pet-tracker specs` → vacío.
`git diff --quiet`, `git diff --cached --quiet`, `git diff --check` → exit 0.
Diff desde la base del handoff calculada con git log (`244fad9b`):

```text
mobile-pet-tracker/src/screens/food/ai-explanation.test.tsx
mobile-pet-tracker/src/screens/food/ai-explanation.tsx
specs/mobile-nutrition-ai-collapse-flicker/requirements.md
specs/mobile-nutrition-ai-collapse-flicker/tasks.md
specs/mobile-nutrition-ai-collapse-flicker/traceability.md
```

`requirements.md` y `tasks.md` corresponden exclusivamente a `d800bee5` del leader
(diff contra ese commit para ambas rutas: vacío). El reporte queda sin commitear;
el marcador `.done` se vuelve a crear al final con la ruta absoluta de este reporte.
