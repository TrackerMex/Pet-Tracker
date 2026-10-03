# Handoff a Codex CLI — mobile-home-weekly-activity (#68)

> Escrito por el leader el 2026-09-07. Copia el bloque de abajo tal cual en la
> terminal de Codex CLI. El handoff es **por disco**: Codex no ve esta
> conversacion, asi que todo lo que necesita esta en la spec y en este fichero.

---

```
Feature: mobile-home-weekly-activity (#68)
Branch: feature/68-mobile-home-weekly-activity  (NUNCA main; el humano mergea)
Spec aprobada por humano: specs/mobile-home-weekly-activity/requirements.md (status: approved)
Lee ademas, completos y antes de escribir nada:
  - specs/mobile-home-weekly-activity/design.md   (decisiones ya cerradas; no las re-litigues)
  - specs/mobile-home-weekly-activity/tasks.md    (ORDEN OBLIGATORIO de requisitos y andamio de tests)
  - specs/mobile-home-weekly-activity/traceability.md (que test prueba cada R-id; la rellenas tu)
  - docs/ui-guidelines.md  (la carta de UI: gana sobre cualquier skill en todo conflicto)
  - docs/conventions.md, docs/architecture.md, CHECKPOINTS.md

Que se construye: la grafica de actividad semanal de la Home, con selector de
metrica, detalle por dia, eje Y, rejilla, linea de media y animacion de entrada;
la migracion de la Home a src/screens/home/; y la traduccion por catalogo de
device.connectivity en la pantalla de emparejado. Veinte requisitos, R1 a R20,
mas la enmienda E1 a la carta. Los datos YA se descargan: cero llamadas nuevas
a la API y cero ficheros de backend-pet-tracker/.

Archivos a crear/modificar: la lista exacta esta en design.md §4 "Archivos
afectados por capa". No toques nada fuera de esa lista sin decirlo en el informe.

REGLAS CRITICAS

1. ORDEN DE TRABAJO no negociable (tasks.md lo justifica):
   R1 -> R15 -> R2 -> R3 -> R4 -> R5 -> R7 -> R11 -> R6 -> R9 -> R10 -> R12
   -> R13 -> R8 -> R14 -> R16 -> R17 -> R18 -> R19 -> R20
   R1 va primero porque el paquete es ESM y sin tocar transformIgnorePatterns
   ninguna suite que monte la grafica arranca: el rojo seria un SyntaxError del
   runner y no probaria nada. R15 (la migracion) va segunda, antes de escribir
   una linea de la grafica, o el ultimo commit mueve todos los ficheros y cuatro
   candados por ruta y el diff deja de ser legible.

2. COMMITS TEST-PRIMERO, OBLIGATORIO (CHECKPOINTS.md C4). Cada requisito deja
   AL MENOS DOS commits: uno con el test rojo nombrando el R-id, y otro con la
   implementacion que lo pone verde. Un unico commit con test + implementacion
   + docs incumple C4 y el reviewer lo rechaza. Ya paso en #19; no se repite.
   Formato: feat(mobile-home-weekly-activity): <desc> (R5)
   Ningun rojo puede fallar por ReferenceError de un helper que aun no existe:
   cada fichero de tests nace con sus mocks y factorias completos.

3. LA LIBRERIA SE IMPORTA SOLO POR SU SUBPATH v2:
   import ... from 'react-native-chart-kit/v2'
   El import de la raiz esta PROHIBIDO y R1 pone un candado que lo detecta. La
   API v1 tipa data como number[] sin null y perderia en silencio la distincion
   entre un dia sin dato y un dia de cero. Version pinneada EXACTA a 7.0.4, sin
   rango: la geometria del eje depende de constantes internas de esa version y
   R1b se pone rojo si alguien la sube.

4. EL DISCRIMINANTE DE "SIN DATO" ES source, NUNCA null. missingEntry() pone
   todas las metricas a null, pero emptyActivity() devuelve CEROS
   (backend-pet-tracker/src/pipeline/activity.ts:83-93), asi que hoy null
   equivale a missing SOLO POR COINCIDENCIA: ramificar por metrica === null
   pasaria todos los tests siendo falso. R5 planta esa mutacion a proposito con
   un caso source:'stored' + metrica null. Un cero medido es descanso
   confirmado y se dibuja; un missing no se dibuja y se marca con guion.

5. LA LETRA DEL EJE SALE DE LA FECHA, NUNCA DEL INDICE. El array es cronologico
   terminando hoy, NO lunes a domingo. Parsea por componentes, no con
   new Date(cadena): R4 tiene el unico candado que mata esa mutacion, forzando
   una zona horaria negativa.

6. UI: carga las skills del plugin expo de Codex que indica la carta
   (expo:expo-overview primero, luego expo-native-ui, expo-design-system,
   expo-animation, expo-ui). SDK del proyecto: Expo 57, documentacion fijada a
   esa version y nunca latest. Tokens de src/theme/global.css: cero hex fuera de
   ahi en los ficheros de esta feature (R18 lo cierra), cero clases arbitrarias,
   cero StyleSheet.create, tabular-nums en los digitos y borderCurve continuous
   en las esquinas no-capsula (#62).

7. ANTES DE TOCAR NADA:
   - borra mobile-pet-tracker/.expo/types/router.d.ts si existe (gitignorado,
     rompe el typecheck con rutas fantasma)
   - pgrep -f init.sh : si hay otro corriendo en un worktree hermano, espera.
     Comparten el Postgres de docker y se pisan, y los e2e salen rojos en falso.

8. NO CREES RECURSOS AWS REALES ni corras cdk deploy/bootstrap: eso lo hace el
   humano. Cero ficheros de backend-pet-tracker/ e infra/.

9. NADA DE CIFRAS ABSOLUTAS nuevas en tests ni en docs. Los candados de R19 se
   mueven por DELTA, y distingue los dos casos: (a) ruta que cambia con la cifra
   intacta -reubicacion por la migracion de R15-, y (b) delta real por filas
   nuevas. Confundirlos es el fallo tipico aqui.

10. Actualiza specs/mobile-home-weekly-activity/traceability.md tras CADA commit,
    nunca al final. El reviewer no aprueba con filas en "pendiente".

11. E1 es una enmienda a docs/ui-guidelines.md §Direccion de arte 6 y el humano
    YA la firmo. Aplicala tal como la spec la enuncia; no cambies otra cosa de
    la carta.

CRITERIOS DE ACEPTACION: los R-ids R1-R20 (con R1b, R14b, R20b) y E1, tal como
requirements.md los enuncia. La prueba de mutacion de R20b son CINCO mutaciones,
plantadas de una en una; las mutaciones 2 y 3 son de zona ciega: si la suite
sigue verde con cualquiera de las dos plantada, el candado esta mal escrito y se
arregla ANTES de seguir.

AL TERMINAR:
  - ./init.sh en verde (exit 0), una sola corrida final limpia
  - graphify update .
  - escribe el resultado en progress/impl_mobile-home-weekly-activity.md:
    que hiciste por R-id, los hashes, la evidencia de la prueba de mutacion, y
    cualquier premisa de la spec que resultara falsa contra el arbol
  - NO marques la feature done, NO abras el PR, NO mergees: eso es del leader
    y del humano
```

---

## Notas para el humano (no van a Codex)

- El baseline verde es `./init.sh` exit 0 sobre `4a5f6dd`. El reviewer mide el
  **delta** contra ese commit, no cifras absolutas.
- Mientras Codex trabaja, el leader no toca `mobile-pet-tracker/`: solo `docs/`,
  `specs/`, `progress/` y `feature_list.json`. Un solo escritor sobre el
  working tree.
- Cuando Codex termine, avisa y el leader lanza el `reviewer`. Quien implementa
  no revisa: ese es el punto entero de que Codex vuelva a llevar esto.
