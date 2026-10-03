# Handoff a Codex CLI — mobile-home-quick-actions (#71)

> Escrito por el leader el 2026-09-08. Copia el bloque de abajo tal cual en la
> terminal de Codex CLI. El handoff es **por disco**: Codex no ve la
> conversacion.

---

```
Feature: mobile-home-quick-actions (#71)
Branch: feature/71-mobile-home-quick-actions  (NUNCA main; el humano mergea)
Spec aprobada por humano: specs/mobile-home-quick-actions/requirements.md (status: approved)
Lee ademas, completos y antes de escribir nada:
  - specs/mobile-home-quick-actions/design.md   (decisiones cerradas; no las re-litigues)
  - specs/mobile-home-quick-actions/tasks.md    (ORDEN OBLIGATORIO y andamio de tests)
  - specs/mobile-home-quick-actions/traceability.md (que test prueba cada R-id; la rellenas tu)
  - docs/ui-guidelines.md  (la carta de UI: gana sobre cualquier skill en todo conflicto)
  - docs/conventions.md, docs/architecture.md, CHECKPOINTS.md

Que se construye: la rejilla de accesos rapidos de la Home, TRES tiles con
fondo pastel. Navegacion pura: cero datos, cero llamadas a la API, cero
backend, cero dependencias nuevas. Quince requisitos, R1 a R15.

Archivos a crear/modificar: la lista exacta esta en design.md §7. No toques nada
fuera de esa lista sin decirlo en el informe.

REGLAS CRITICAS

1. ORDEN DE TRABAJO no negociable (tasks.md lo justifica):
   R1 -> R2 -> R3 -> R4 -> R5 -> R6 -> R7 -> R8 -> R9 -> R10 -> R12 -> R11
   -> R13 -> R14 -> R15

2. COMMITS TEST-PRIMERO, OBLIGATORIO (CHECKPOINTS.md C4). Cada requisito deja
   AL MENOS DOS commits: rojo nombrando el R-id, y verde. Un unico commit con
   test + implementacion + docs incumple C4 y el reviewer lo rechaza.
   Formato: feat(mobile-home-quick-actions): <desc> (R4)
   ATENCION AL PUNTO NUEVO DE C4 (anadido el 2026-09-08 a raiz de #69): cuando
   un candado se anade sobre codigo YA CORRECTO, el rojo legitimo es la
   MUTACION DE PRODUCCION, versionada en el commit rojo y revertida en el
   verde. Mutar un doble de test NO cuenta: demuestra que la asercion puede
   fallar, no que vigile la app.

3. LOS TRES DESTINOS SALEN DE UN FILTRO, NO DEL MAKE. El humano decidio el
   2026-09-08 que los tiles apunten SOLO a destinos que NO son alcanzables
   desde el tab bar. Son: /weight-log, /add-reminder y /pets/[petId]/docs.
   NO anadas Mapa, Vacunas ni Comidas: son pestanas -_layout.tsx:26-30- y el
   tab bar flotante usa LOS MISMOS iconos Map y ForkKnife, asi que un tile a
   esas rutas duplica navegacion visible en la misma pantalla. Tampoco anadas
   /reminders: colisiona con #70. El tile 2 va a la pantalla de ALTA de
   recordatorio, que es otra cosa.

4. `within(tile)` ES OBLIGATORIO en los tests, no una preferencia. El glifo
   `Weight` se repite dentro de la Home a proposito -la celda de la tira de
   #69 y el tile 1-, asi que un `getByTestId` global encontraria DOS nodos y el
   test fallaria por una razon que no tiene nada que ver con lo que prueba.

5. LOS FONDOS SALEN DE `CATEGORY_SLOTS`, y ojo con esto: **#64 R9**
   (`consistency-classnames.test.ts:372-433`) no solo prohibe clases
   arbitrarias, prohibe la clase COMPLETA `bg-category-*` fuera de
   `src/utils/category-palette.ts`, y prohibe interpolarla. Escribir
   `bg-category-blue` en la Home pone la suite roja. Cero tokens nuevos en
   `global.css`.

6. UI: carga las skills del plugin expo que indica la carta
   (expo:expo-overview primero). SDK del proyecto: Expo 57, documentacion
   fijada a esa version, nunca latest. Escala de tres radios de #62:
   `rounded-xl` para tile, con un unico `CONTINUOUS_CORNER` dentro del
   `.map()`. Area tactil `min-h-11` + `flex-1`, sin `hitSlop`.
   Iconos: `Weight`, `CalendarPlus`, `FileText` de reicon-react-native, ninguno
   del set del tab bar. `MapPin` NO existe en ese paquete, solo `Map`.

7. ANTES DE TOCAR NADA:
   - borra mobile-pet-tracker/.expo/types/router.d.ts si existe (gitignorado,
     rompe el typecheck con rutas fantasma)
   - pgrep -f init.sh : si hay otro corriendo en un worktree hermano, espera
   - corre SIEMPRE `env -u FORCE_COLOR ./init.sh`: con esa variable el script
     aborta en falso con "Mas de 1 feature en in_progress (1)" habiendo una
     sola. Es el bug #75, ajeno a esta feature; NO lo arregles aqui

8. NADA DE CIFRAS ABSOLUTAS. Los candados de R14 se mueven por DELTA contra
   f9163bf, y son 14 filas. La PRIMERA es
   src/providers/__tests__/language-provider.test.tsx:41, el candado de
   longitud de catalogo: esta vez SI esta enumerado en la spec -se omitio en
   #68 y en #69 y paro la implementacion las dos veces-. Conserva su base
   VISIBLE COMO SUMA, nunca colapsada a un total plano. Si alguna cifra que la
   spec no enumera se mueve, PARA y reportalo en vez de ajustarla: eso es
   exactamente lo que hiciste bien en #69.

9. Actualiza specs/mobile-home-quick-actions/traceability.md tras CADA commit.

10. Esta feature NO necesita ninguna enmienda a spec aprobada. Si crees que si,
    PARA y reportalo: no edites ninguna spec `approved` por tu cuenta.

CRITERIOS DE ACEPTACION: R1-R15 (con R15b). La prueba de mutacion son SIETE
mutaciones, TODAS DE PRODUCCION, plantadas de una en una. Cuatro cruzan las
cuatro decisiones de cada tile por separado -icono, etiqueta, color y destino-,
y la quinta planta un tile apuntando a /map para vigilar el criterio nuevo. En
#69 el reviewer descubrio que solo una de las tres decisiones por celda estaba
vigilada; aqui son cuatro y las cuatro tienen que morir.

AL TERMINAR:
  - `env -u FORCE_COLOR ./init.sh` en verde (exit 0), una sola corrida final
  - graphify update .
  - escribe el resultado en progress/impl_mobile-home-quick-actions.md: que
    hiciste por R-id, los hashes, la evidencia de las siete mutaciones, y
    cualquier premisa de la spec que resultara falsa contra el arbol
  - NO marques la feature done, NO abras el PR, NO mergees
```

---

## Notas para el humano (no van a Codex)

- Baseline: `env -u FORCE_COLOR ./init.sh` exit 0 sobre `f9163bf`.
- Mientras Codex trabaja, el leader no toca `mobile-pet-tracker/`.
- Cuando termine, avisa y lanzo el `reviewer`.
