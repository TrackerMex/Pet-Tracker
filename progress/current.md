# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Rediseno contra el diseno del Make (desde 2026-09-04)

- **Origen y mapa**: `progress/explore_design-gap-vs-make.md`. Alcance cerrado por el humano: Bloque 0 + Bloque 1, features #64-#71.
- **Bloque 0 cerrado y mergeado**: #64 paleta pastel (PR #106), #65 idioma de UI (PR #110).
- **Bloque 1, cinco de seis cerradas**: #66 listado con foto (PR #111), #67 cabecera fotografica (PR #112) y #68 actividad semanal (PR #113). #69 tira de estadisticas (PR #114). **#71 accesos rapidos cerrada el 2026-09-09**, PR pendiente de merge. Detalle completo de cada una en `progress/history.md`.
- **Bloque 1 en implementacion**: **#70 recordatorios** tiene spec aprobada y esta en curso. Entra la proxima vacuna; la barra de comidas queda fuera porque no existe registro de comida servida y `mealsPerDay` vive en el plan de nutricion. `nextReminder` y `activitySummary` no alimentan esa barra y permanecen `unknown`.
- **Deuda abierta**: **#73** `pet-online-pill` -la pildora "En linea" necesita arreglar el pestillo de conectividad del backend (`src/workers/ingestion.drizzle.store.ts:97`) y definir un umbral de silencio, decision G-; **#74** `mobile-metric-selector-a11y` -el contenedor del selector no declara `accessibilityRole="radiogroup"`, asi que TalkBack lee tres controles sueltos, y **nada lo vigila**; handoff ya escrito en `progress/handoff_mobile-home-weekly-activity_a11y.md`-; **#75** `harness-init-force-color` -`init.sh:127-148` compara por cadena un numero que Node colorea y aborta en falso con "Mas de 1 feature en in_progress (1)" si el entorno trae `FORCE_COLOR`; se sortea con `env -u FORCE_COLOR`-. Y sigue **#72**, el flaky de seleccion de foto de add-pet.
- **Implementador: Codex CLI**, con cuota desde el 2026-09-07. Vuelve a valer el reparto entero: quien implementa no revisa.
- **Dependencias nuevas autorizadas** por el humano el 2026-09-07, siempre que la spec las declare (`docs/ui-guidelines.md:171-172`). Sigue en pie el veto **nominal** a `expo-linear-gradient`. La libreria de graficas designada es `react-native-chart-kit`, **siempre** por su subpath `/v2`.
- **Deuda anadida al cerrar #69 y #71**: **#76** `e2e-audit-log-order-assert` -`health-vaccines.e2e-spec.ts:497` asserta un array ordenado sobre un `SELECT` sin `ORDER BY`, asi que cae de forma intermitente bajo carga y ensucia baselines-; **#77** `mobile-home-weight-without-collar` -hoy la tira desaparece entera con el estado de la actividad y el peso se va con ella aunque venga del perfil-; **#80** `mobile-test-double-icon-scope` -los `testID` del doble de `reicon` se atan al componente y no al uso, asi que `Moon` y `Map` emiten los mismos ids fuera de la tira-; **#81** `mobile-quick-actions-typography-lock` -la receta tipografica `text-2xs font-semibold` del tile no esta vigilada: una sonda a `text-xs font-medium` deja la suite **completa** verde-.
- **#78 `mobile-alerts-center` y #79 `mobile-push-registration`** entraron desde otra sesion, no desde esta.
- **C4 gano un punto el 2026-09-08** (`CHECKPOINTS.md`): cuando un candado se anade sobre codigo **ya correcto**, el rojo legitimo es la **mutacion de produccion** versionada en el rojo y revertida en el verde. Mutar un doble de test demuestra que la asercion puede fallar, no que vigile la app.
- **Plantilla de decisiones por elemento repetido, escrita al cerrar #71** y guardada en memoria: **diez** decisiones de conducta por elemento -empezando por **el dato que muestra**, que es el que mas se olvida y el que #69 dejo suelto-, tres estructurales del contenedor -identidad, orden y cardinalidad, esta ultima cerrada con `children.length` y **nunca** contando coincidencias de `testID`- y seis invariantes compartidos. El reviewer audito la primera version del leader y le encontro tres ejes de menos.
- **Deuda transversal detectada en #71, sin id**: los `Pressable` de la app no tienen feedback de pulsado -C8 lo pide y hay **un solo sitio** resuelto en todo el repo-.

## Implementacion activa — #70 mobile-home-reminders-section

- **Inicio**: 2026-09-09 04:20 UTC.
- **Branch/worktree**: `feature/70-mobile-home-reminders-section` en `/home/claude/sites/Pet-Tracker` (el worktree recibido en el contexto estaba asociado a #43; no se desmonta ni se altera).
- **Baseline**: `env -u FORCE_COLOR ./init.sh` en verde antes de tocar codigo.
- **Plan**: TDD y commits rojo/verde en el orden aprobado R2 → R4 → R5 → R1 → R6 → R7 → R8 → R9 → R10 → R11 → R12 → R13 → R14 → R15 → R3 → R16 → R17 → R18 → R19; despues, ocho mutaciones de produccion M1-M8, una a una, informe y corrida final unica de `init.sh`.
- **Bloqueo previo al codigo**: `specs/mobile-home-reminders-section/tasks.md` hace incompatible el verde de R1 con su propio paso de implementacion. El test obligatorio exige `reminders-section-body.children` con longitudes `1` (perfil cargado), `1` (detalle pendiente) y `0` (error), pero el paso verde de R1 ordena dejar el cuerpo vacio; los hijos reales se implementan despues en R6, R8 y R9. Respetar ambas instrucciones exigiria adelantar esos requisitos, diferir el assert o introducir un hijo provisional no prescrito. La regla del handoff obliga a parar antes de enmendar una spec aprobada.
- **Premisas desactualizadas detectadas**: la spec dice que el id maximo es 81 y que E2/E3 carecen de feature, pero el arbol ya contiene #83 y #84; la cita `food.tsx:185` tambien se desplazo (el calculo vive ahora en `:65-67` y `:194`). Ademas, M1 no queda verde en UTC con todo R4: el caso de hoy al mediodia produce `-0`, y Jest `toBe(0)` lo distingue. Ninguna de estas premisas autoriza a cambiar la spec sin un nuevo gate humano.
- **Reanudacion**: el humano aprobo D1-D3 en `requirements.md` y la rama incorporo `40413db`. D1 mueve la cardinalidad de R1 a R9; D2 reconoce #83/#84 y las citas desplazadas; D3 autoriza cero normalizado y exige demostrar M1 verde en UTC/roja en `America/Mexico_City`. Segundo baseline completo en verde antes del primer rojo.
