# Handoff a Codex CLI — mobile-home-reminders-section (#70)

> Escrito por el leader el 2026-09-09. Copia el bloque de abajo tal cual en la
> terminal de Codex CLI. Es la **ultima feature del Bloque 1**.

---

```
Feature: mobile-home-reminders-section (#70)
Branch: feature/70-mobile-home-reminders-section  (NUNCA main; el humano mergea)
Spec aprobada por humano: specs/mobile-home-reminders-section/requirements.md (status: approved)
Lee ademas, completos y antes de escribir nada:
  - specs/mobile-home-reminders-section/design.md   (decisiones cerradas; no las re-litigues)
  - specs/mobile-home-reminders-section/tasks.md    (ORDEN OBLIGATORIO y andamio de tests)
  - specs/mobile-home-reminders-section/traceability.md
  - docs/ui-guidelines.md  (la carta de UI: gana sobre cualquier skill)
  - docs/conventions.md, docs/architecture.md, CHECKPOINTS.md

Que se construye: la seccion de recordatorios de la Home. Proxima vacuna con
los dias que faltan, estado vacio disenado, y enlace a la lista completa.
Diecinueve requisitos, R1 a R19. Cero llamadas nuevas a la API, cero ficheros
de backend-pet-tracker/ e infra/, cero dependencias nuevas.

Archivos a crear/modificar: la lista exacta esta en design.md §7.

REGLAS CRITICAS

1. ORDEN DE TRABAJO no negociable (tasks.md lo justifica):
   R2 -> R4 -> R5 -> R1 -> R6 -> R7 -> R8 -> R9 -> R10 -> R11 -> R12 -> R13
   -> R14 -> R15 -> R3 -> R16 -> R17 -> R18 -> R19

2. COMMITS TEST-PRIMERO (C4). Cada requisito deja AL MENOS DOS commits: rojo
   nombrando el R-id, y verde. Formato:
   feat(mobile-home-reminders-section): <desc> (R7)
   QUINTO PUNTO DE C4, anadido el 2026-09-08: cuando un candado se anade sobre
   codigo YA CORRECTO, el rojo legitimo es la MUTACION DE PRODUCCION versionada
   en el commit rojo y revertida en el verde. Mutar un doble de test NO cuenta.

3. LA ARITMETICA DE FECHAS ES LA ZONA DE PELIGRO DE ESTA FEATURE.
   `calendarDaysUntil` normaliza medianoches a UTC y se escribe NUEVO en
   format.ts. NO reutilices `src/utils/reminder-dates.ts:15`: ese `daysUntil`
   usa `Math.ceil` sobre una resta de milisegundos, que es EXACTAMENTE el
   patron que costo el veredicto rechazado de #68 -depende de la hora del dia y
   se desplaza en offsets negativos-. Arreglarlo es la feature #84, no esta.
   R5 exige que el resultado no se desplace bajo `TZ='America/Mexico_City'` ni
   dependa de la hora del dia, y M1/M2 son mutaciones de ZONA CIEGA sobre eso:
   si la suite sigue verde con cualquiera plantada, el candado esta mal escrito
   y se arregla ANTES de seguir.

4. LA MITAD DEL DISENO NO ENTRA, Y R3 LO FIJA. La barra de progreso de comidas
   queda FUERA. Y ojo, la causa NO es la que decia el enunciado viejo: la barra
   no lee nextReminder ni activitySummary, lee pet.meals y pet.totalMeals, y lo
   que falta es que no existe registro de comida servida en el backend
   -food.tsx:185 lo finge con el reloj local- y que mealsPerDay vive en el plan
   de nutricion. Eso es la feature #83. NO la construyas ni inventes el dato.

5. `nextReminder` y `activitySummary` SE QUEDAN EN `unknown` en
   src/api/types.ts, a proposito: es la prueba de que esta feature no los usa.
   Solo se tipa `nextVaccine`, con la forma exacta que devuelve el backend.

6. `nextVaccine` SOLO SE PUEBLA EN EL DETALLE. `GET /v1/pets` pasa null fijo
   (pets.controller.ts:77). La Home llama a los dos endpoints: leelo del
   DETALLE. Si lo lees del listado, la seccion mostrara estado vacio siempre y
   NINGUNA fixture lo detectara.

7. UN SOLO CAMINO A LA LISTA. R10: "Ver todos" hace router.push('/reminders'),
   sin cast y sin ruta nueva. #71 ya puso un tile a `/add-reminder`, que es la
   pantalla de ALTA y es otra cosa. No anadas un segundo camino a `/reminders`
   desde la Home: ese fue justo el defecto que #71 corrigio con el tab bar.

8. UI: skills del plugin expo que indica la carta (expo:expo-overview primero).
   Expo 57, documentacion fijada a esa version. `Card` compartido, radios de
   #62, huecos de #64, `TABULAR_NUMS` SOLO en el contador. Icono `Syringe` de
   reicon, cero emoji, ningun glifo de la barra de pestanas.

9. ANTES DE TOCAR NADA:
   - borra mobile-pet-tracker/.expo/types/router.d.ts si existe
   - pgrep -f init.sh : si hay otro corriendo, espera
   - corre SIEMPRE `env -u FORCE_COLOR ./init.sh`: con esa variable el script
     aborta en falso. Bug #75, ajeno; NO lo arregles aqui

10. NADA DE CIFRAS ABSOLUTAS. R18 son 18 filas de delta contra b0ec5a8, y la
    PRIMERA es src/providers/__tests__/language-provider.test.tsx:41 -el
    candado que paro #68 y #69 por no estar enumerado-. Base VISIBLE COMO SUMA,
    nunca colapsada. Si una cifra que la spec no enumera se mueve, PARA y
    reportalo: lo hiciste bien en #69 y en #71.

11. Si algo te obliga a enmendar una spec aprobada, PARA y reportalo.

CRITERIOS DE ACEPTACION: R1-R19 (con R19b). La prueba de mutacion son OCHO
mutaciones, TODAS DE PRODUCCION, plantadas de una en una. M1 y M2 son de zona
ciega (la aritmetica de fechas) y M5 planta un elemento SIN testID: la
cardinalidad se cuenta sobre `children` del contenedor y NUNCA sobre
coincidencias de testID. En #71 pasar de lista blanca a prefijo seguia dejando
entrar un elemento sin testID.

AL TERMINAR:
  - `env -u FORCE_COLOR ./init.sh` en verde (exit 0), una sola corrida final
  - graphify update .
  - progress/impl_mobile-home-reminders-section.md: que hiciste por R-id, los
    hashes, la evidencia de las ocho mutaciones, y cualquier premisa de la spec
    que resultara falsa contra el arbol
  - NO marques done, NO abras PR, NO mergees
```

---

## Notas para el humano (no van a Codex)

- Baseline: `env -u FORCE_COLOR ./init.sh` exit 0 sobre `b0ec5a8`.
- Con esta cierra el Bloque 1 entero: #64-#69 y #71 ya estan mergeadas.
- Las tres features que la spec destapo quedan abiertas y sin bloquear a #70:
  **#82** la contradiccion del dia de la dosis, **#83** lo que desbloquea la
  barra de comidas, y **#84** el `daysUntil` con el defecto de #68.
