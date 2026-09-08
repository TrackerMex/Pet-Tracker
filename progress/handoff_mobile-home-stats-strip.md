# Handoff a Codex CLI — mobile-home-stats-strip (#69)

> Escrito por el leader el 2026-09-08. Copia el bloque de abajo tal cual en la
> terminal de Codex CLI. El handoff es **por disco**: Codex no ve la
> conversacion, asi que todo lo que necesita esta en la spec y aqui.

---

```
Feature: mobile-home-stats-strip (#69)
Branch: feature/69-mobile-home-stats-strip  (NUNCA main; el humano mergea)
Spec aprobada por humano: specs/mobile-home-stats-strip/requirements.md (status: approved)
Lee ademas, completos y antes de escribir nada:
  - specs/mobile-home-stats-strip/design.md   (decisiones cerradas; no las re-litigues)
  - specs/mobile-home-stats-strip/tasks.md    (ORDEN OBLIGATORIO y andamio de tests)
  - specs/mobile-home-stats-strip/traceability.md (que test prueba cada R-id; la rellenas tu)
  - docs/ui-guidelines.md  (la carta de UI: gana sobre cualquier skill en todo conflicto)
  - docs/conventions.md, docs/architecture.md, CHECKPOINTS.md

Que se construye: la tira de cuatro celdas de la Home -Peso, Actividad,
Descanso, Distancia- separadas por tres divisores, montada sobre el hero. Quince
requisitos, R1 a R15. Los datos YA se descargan: cero llamadas nuevas a la API,
cero ficheros de backend-pet-tracker/ e infra/, cero dependencias nuevas.

Archivos a crear/modificar: la lista exacta esta en design.md §5. No toques nada
fuera de esa lista sin decirlo en el informe.

REGLAS CRITICAS

1. ORDEN DE TRABAJO no negociable (tasks.md lo justifica):
   R2 -> R1 -> R3 -> R4 -> R5 -> R6 -> R7 -> R9 -> R10 -> R12 -> R8 -> R11
   -> R13 -> R14 -> R15
   R2 va primero porque `fmtKg` es lo unico que se puede probar sin montar la
   pantalla: su rojo es limpio y de una linea. Escribir la celda antes obligaria
   a un rojo que falla por dos causas a la vez.

2. COMMITS TEST-PRIMERO, OBLIGATORIO (CHECKPOINTS.md C4). Cada requisito deja
   AL MENOS DOS commits: uno con el test rojo nombrando el R-id, y otro con la
   implementacion que lo pone verde. Un unico commit con test + implementacion
   + docs incumple C4 y el reviewer lo rechaza. Ya paso en #19.
   Formato: feat(mobile-home-stats-strip): <desc> (R3)
   Ningun rojo puede fallar por ReferenceError de un helper que aun no existe.

3. LA CELDA 3 ES **DESCANSO**, NO PASEOS, y esto es la correccion central de la
   spec: `walkCount` YA se pinta desde #67 R7 en src/screens/home/index.tsx:142,
   en text-3xl, como dato destacado del hero. Anadir una celda "Paseos"
   duplicaria el mismo numero en la misma pantalla. El enunciado viejo de
   feature_list.json pedia lo contrario y estaba equivocado; ya esta corregido.
   NO toques el dato destacado del hero: sigue siendo walkCount.

4. LA FILA APARECE Y DESAPARECE ENTERA, como hoy (R7). NO desacoples la celda de
   peso del estado de la actividad aunque el peso no dependa del collar: eso es
   la feature #77, abierta a proposito, y hacerlo aqui rompe R7. Los cinco `it`
   de describe('R9: summary degrada con gracia') (index.test.tsx:441-560) tienen
   que quedar VERDES SIN DEBILITAR NINGUN ASSERT.

5. UI: carga las skills del plugin expo que indica la carta (expo:expo-overview
   primero). SDK del proyecto: Expo 57, documentacion fijada a esa version,
   nunca latest. Tokens de src/theme/global.css -los que la tira necesita ya
   existen, NO anadas ninguno-. Iconos de reicon-react-native (`Weight` es
   nuevo pero el paquete ya es dependencia): NINGUN emoji del Make. Escala de
   tres radios de #62. `tabular-nums` en los cuatro valores.

6. ANTES DE TOCAR NADA:
   - borra mobile-pet-tracker/.expo/types/router.d.ts si existe (gitignorado,
     rompe el typecheck con rutas fantasma)
   - pgrep -f init.sh : si hay otro corriendo en un worktree hermano, espera.
   - corre init.sh SIN FORCE_COLOR en el entorno: `env -u FORCE_COLOR ./init.sh`.
     Con esa variable init.sh aborta en falso con "Mas de 1 feature en
     in_progress (1)" habiendo una sola. Es el bug #75, ajeno a esta feature: NO
     lo arregles aqui.

7. NADA DE CIFRAS ABSOLUTAS nuevas. Los candados de R14 se mueven por DELTA
   contra 9358cc7. Esta feature **no tiene reubicaciones** -la Home ya vive en
   src/screens/home/ desde #68 R15 y no se vuelve a migrar-, asi que todo delta
   que midas es delta real. Si alguna cifra que la spec no enumera se mueve,
   PARA y reportalo en vez de ajustarla.

8. Actualiza specs/mobile-home-stats-strip/traceability.md tras CADA commit,
   nunca al final. El reviewer no aprueba con filas en "pendiente".

9. Esta feature NO necesita ninguna enmienda a spec aprobada. Si crees que si,
   PARA y reportalo: no edites ninguna spec `approved` por tu cuenta.

CRITERIOS DE ACEPTACION: R1-R15 (con R15b) tal como requirements.md los enuncia.
La prueba de mutacion de R15b son SEIS mutaciones, plantadas de una en una, y
CUATRO de ellas son el mismo discriminante en sus cuatro sitios: si la suite
sigue verde con cualquiera plantada, el candado esta mal escrito y se arregla
ANTES de seguir. En #68 esto fue el motivo del unico veredicto rechazado.

AL TERMINAR:
  - `env -u FORCE_COLOR ./init.sh` en verde (exit 0), una sola corrida final
  - graphify update .
  - escribe el resultado en progress/impl_mobile-home-stats-strip.md: que
    hiciste por R-id, los hashes, la evidencia de la prueba de mutacion, y
    cualquier premisa de la spec que resultara falsa contra el arbol
  - NO marques la feature done, NO abras el PR, NO mergees
```

---

## Notas para el humano (no van a Codex)

- El baseline es `./init.sh` exit 0 sobre `9358cc7`. Ojo: la primera pasada salio
  roja por **#76**, el e2e que asserta orden sobre un `SELECT` sin `ORDER BY`;
  es intermitente y ajeno a esta feature.
- Mientras Codex trabaja, el leader no toca `mobile-pet-tracker/`.
- Cuando termine, avisa y lanzo el `reviewer`. Quien implementa no revisa.
