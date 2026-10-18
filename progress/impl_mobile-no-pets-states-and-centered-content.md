# Informe de implementación — #181

Estado: detenido en preflight, sin cambios de código ni commits de implementación.
El humano indicó el 2026-10-18: «Que el leader corrija la spec y el handoff».
La implementación queda pendiente de esa corrección; no se declara ningún requisito cerrado.

## Entorno y alcance comprobados

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-181` (coincide).
- `git branch --show-current`: `feature/181-mobile-no-pets-states-and-centered-content` (coincide).
- H0: `44acd74b`.
- HANDOFF: `b1c3c58effac0f19f0da66ed74c158c808be1c23`.
- `git diff --stat 44acd74b HEAD -- docs mobile-pet-tracker`: vacío.
- Árbol e índice limpios antes de este informe.
- Feature #181: `in_progress`; requirements aprobados por humano el 2026-10-17.
- Leídos requirements, design, tasks, traceability, instrucciones de raíz y móvil,
  arquitectura y las secciones aplicables de convenciones, carta UI y verificación.
- Consultada la documentación versionada que exige `mobile-pet-tracker/AGENTS.md`:
  [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).

## Bloqueos de la spec aprobada

### 1. R9.1 y R9.2 exigen recuentos incompatibles

R9.1 prescribe el literal `enmienda A20 de #181` en dos sitios:

1. `**Excepción nombrada (enmienda A20 de #181, 2026-10-16)**`.
2. `- Qué cambia: enmienda A20 de #181 R9`.

R9.2 exige que ese mismo literal aparezca exactamente una vez en
`docs/conventions.md`. El recuento de las cadenas prescritas en R9.1 da 2.
No se puede implementar ambos requisitos literalmente.

Corrección propuesta al leader: conservar la redacción de R9.1 y exigir dos
apariciones, o reformular el bloque «Qué cambia» para que no repita ese literal.
Actualizar también M18, tasks y handoff según la decisión humana.

### 2. X5 es inobservable en el árbol que exige R4.2

R4.2 exige un retorno anticipado cuando `petsEmpty` es verdadero, sustituyendo
todo el ScrollView por `reminders-no-pets-screen`. La tarjeta `reminders-error`
vive dentro del ScrollView. Por tanto, quitar únicamente `!petsEmpty` de su
condición (X5) no puede cambiar el árbol: cuando ese término importaría, la
función ya retornó. R1 S3 no puede ponerse rojo con esa mutación aislada.

Corrección propuesta al leader: sustituir X5 por una mutación observable de la
rama sin mascotas. Si se quiere exigir además el término redundante en la
fuente, especificar explícitamente un candado de fuente para ese contrato;
no atribuir su detección a la sonda de árbol S3.

### 3. X4 y X6 no pueden tumbar los S2 exigidos

R1 S2 usa una cuenta nueva con lista `ok` y vacía. Los retornos anticipados
exigidos en R3.2 y R4.2 impiden alcanzar las tarjetas incluso al quitar
`selectedPetId !== null`. Por eso X4 no puede tumbar S2 de Inicio y X6 no
puede tumbar S2 de Recordatorios. El test adicional de Inicio con lista
`unreachable` sí puede detectar X4.

Corrección propuesta al leader: mantener S2 como prueba del comportamiento de
cuenta nueva y exigir para X4/X6 sondas adicionales con selección nula y
lista no vacía o no `ok`, donde las tarjetas sí sean alcanzables.

### 4. X7 no puede tumbar el S3 estabilizado de Perfil

R1 fija `getPet` resuelto como `{kind:'error'}` y R1.2 obliga a esperar
`queryClient.isFetching() === 0` antes de comprobar las ausencias. En ese
punto, con lista `ok` y vacía, la expresión original de `petLoading`
(`pets.data === undefined || (selectedPetId !== null && detail.data === undefined)`)
ya es falsa. Quitar solo `!petsEmpty` no muestra esqueletos en ese árbol
estabilizado.

Corrección propuesta al leader: añadir una sonda específica con el detalle
pendiente y lista vacía que compruebe los esqueletos mientras la petición está
en vuelo, definiendo expresamente su sincronización, y atribuir X7 a esa sonda.

No se ajustó la spec: el handoff lo prohíbe y el humano eligió que lo corrija
el leader. No se han plantado mutaciones ni ejecutado tests para presentar
estas incompatibilidades lógicas como resultados empíricos.

## M1–M19 medidos antes del primer commit

Medición por contenido sobre el árbol de trabajo, idéntico a H0 en docs y móvil.

| Ancla | Valor real | Comparación con la spec |
|---|---|---|
| M1 | 1 `pet-hero-error` en Inicio | coincide |
| M2 | 1 `profile-pet-error` en Perfil | coincide |
| M3 | 1 `reminders-error` en Recordatorios | coincide |
| M4 | 1 condición `pets.data.pets.length === 0` en Inicio | coincide |
| M5 | EmptyState: Inicio 1, Perfil 0, Recordatorios 1 | coincide |
| M6 | 1 `testID="profile-pets-empty"`, en un Text | coincide |
| M7 | 2 contenedores con la receta exacta en Mapa | coincide |
| M8 | 7 llamadores: food, health, home, map, pairing, profile, reminders | coincide |
| M9 | dobles de selección: add-pet 14, alert-detail 1 | coincide |
| M10 | 2 `satisfies SelectedPetContextValue` en el test del hook | coincide |
| M11 | 0 ficheros con `clearPet` en src | coincide |
| M12 | expresión `35 - 1 + 2 + 1 + 16 - 4 + 8 + 1 + 6` = 64 | coincide |
| M13 | expresión `50 + 1 - 2 + 1 - 1 + 1 + 1 + 1 + 1` = 53 | coincide |
| M14 | 12 filas de vacíos en texto, incluida profile-pets-empty | coincide |
| M15 | 8 ficheros; reminders 1, profile ausente | coincide |
| M16 | 5 apariciones: fuente 1, tests Perfil 3, empty-state.test 1 | coincide |
| M17 | 4 apariciones de `Excepción nombrada` en conventions | n medido = 4; futuro previsto n + 1 = 5 |
| M18 | 0 apariciones de `enmienda A20` en conventions | coincide; incremento futuro requiere resolver bloqueo 1 |
| M19 | 1 `selectPet:` en el proveedor | coincide |

## Commits y recuentos

No se ejecutó c1 ni ningún commit posterior. No hay hashes ni mensajes de
commits de implementación que registrar. `n2`, `n3`, `n4`, `n5`: no medidos,
porque esos commits no existen. Tests añadidos: 0.

## R10 — Registro de mutaciones

| Mutación | Sonda prevista por la spec | Ejecución / commit |
|---|---|---|
| X1 | R2.2, R1 S1 en tres pantallas y R6; S3 debe seguir verde | no ejecutada; sin commit |
| X2 | R2.3 con revalidación | no ejecutada; sin commit |
| X3 | R2.3 para cada kind no ok | no ejecutada; sin commit |
| X4 | R1 S2 de Inicio y test de lista unreachable | no ejecutada; S2 inobservable, véase bloqueo 3 |
| X5 | R1 S3 de Recordatorios | no ejecutada; mutación inobservable, véase bloqueo 2 |
| X6 | R1 S2 de Recordatorios | no ejecutada; S2 inobservable, véase bloqueo 3 |
| X7 | R1 S3 de Perfil, esqueletos | no ejecutada; sonda estabilizada inobservable, véase bloqueo 4 |
| X8 | R1 S2 de Perfil | no ejecutada; sin commit |
| X9 | R3.2 / R4.2, contenedor y único hijo | no ejecutada; sin commit |
| X10 | R3.2 / R4.2, clase del contenedor | no ejecutada; sin commit |
| X11 | R5.1, EmptyState de Perfil | no ejecutada; sin commit |
| X12 | R2.4, escaneo de escritor único | no ejecutada; sin commit |

Los nombres concretos de los `it` y sus commits quedan pendientes de implementar.

## Skills

Cargadas y leídas:

- `ponytail:ponytail` (full).
- `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- `expo-tailwind-setup`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/expo-tailwind-setup/SKILL.md`.
- `.agents/skills/appllama-app-design-skill/SKILL.md`.

No cargadas, conforme al handoff: `expo-design-system`, `expo-animation`,
`expo-router`, `expo-overview`; sin sustitutos cercanos. No se llamó al MCP de
Appllama. La carta del repo y la spec prevalecen sobre recomendaciones genéricas
de estilos y simulator loop.

## Verificación y entrega

- `./init.sh` y suite completa: no ejecutados, prohibidos por el handoff.
- Jest acotado: no ejecutado; detenido antes de escribir tests.
- Typecheck: no ejecutado; comprobada la ausencia de `.expo/types/router.d.ts`.
- Lint y guardas: no ejecutados; sin cambios de código que verificar.
- Recursos AWS, infraestructura compartida y dependencias: sin cambios.
- Sin PR creada ni editada; sin push.
- Único archivo añadido: este informe, sin commit, excepción permitida por el handoff.
- Smoke Android: pendiente del humano; implementación pendiente del leader y de Codex.

Siguiente paso: el leader corrige requirements/tasks/handoff y obtiene la
aprobación que corresponda. Después se retoma desde c1, sin cambios de código
previos que reaplicar o revertir.
