# Handoff a Codex CLI — #94 `mobile-map-staleness-single-source`

> Escrito por el `leader` el 2026-09-21, tras el gate humano de la spec
> (commits `cf55f1ed`, `0142417b`) y el de la enmienda E1 (`ce652eae`).
> El humano copia el bloque de abajo en su terminal de Codex.

```
Feature: mobile-map-staleness-single-source (#94)
Branch: feature/94-mobile-map-staleness-single-source (ya creada y pusheada)
Worktree: /home/claude/sites/Pet-Tracker-wt-ui

IMPORTANTE — trabaja SOLO en ese worktree. En /home/claude/sites/Pet-Tracker
hay otra sesion con la feature #98 y su working tree es suyo.

Spec aprobada: specs/mobile-map-staleness-single-source/requirements.md
(status: approved; gate firmado el 2026-09-21, y la enmienda E1 tambien).
Lee tambien design.md y tasks.md del mismo directorio. La enmienda E1 vive
dentro de requirements.md (§Enmienda E1) y modifica la forma de R1 y R2:
leela antes de escribir la primera linea.

Antes de empezar (una vez, en este orden):
  1. Borra mobile-pet-tracker/.expo/types/router.d.ts si existe. Esta
     gitignorado y rompe el typecheck con rutas fantasma.
  2. Carga las skills de Expo de tu plugin: expo-overview primero, luego
     expo-data-fetching (la query nueva de TanStack Query) y expo-native-ui
     (el tile). Obligatorio por docs/ui-guidelines.md §Skills.
  3. Lee design.md §D7 antes de tocar map.test.tsx: su jest.mock de
     '../../../api/pets' es una factory exhaustiva. Si anades el consumo de
     getPet sin anadirlo a esa factory, revientan las 49 pruebas del fichero,
     no solo las del badge.
  4. Baseline verde, SIN pipe (el exit code de un pipe es el de tail, no el de
     jest), comprobando que jest imprime 5 suites:

     cd mobile-pet-tracker
     bunx jest --runTestsByPath \
       'src/app/(tabs)/__tests__/map.test.tsx' \
       'src/utils/device-connectivity.test.ts' \
       'src/__tests__/design-drift.test.ts' \
       'src/__tests__/ui-language.test.ts' \
       'src/__tests__/ui-copy-table.ts'

     Esperado sobre 914905b8: 5 suites, 120 tests, verde, exit 0.
     Las rutas van SIEMPRE entre comillas: (tabs) sin escapar se interpreta
     como regex y jest salta ficheros en silencio con exit 0.

Archivos que tocas:
  - mobile-pet-tracker/src/app/(tabs)/map.tsx
  - mobile-pet-tracker/src/utils/device-connectivity.ts
  - mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx
  - mobile-pet-tracker/src/utils/device-connectivity.test.ts
  - mobile-pet-tracker/src/__tests__/design-drift.test.ts
  - mobile-pet-tracker/src/__tests__/ui-copy-table.ts        (E1)
  - mobile-pet-tracker/src/__tests__/ui-language.test.ts     (E1)
  - specs/mobile-map-staleness-single-source/traceability.md

Archivos PROHIBIDOS — los lleva la feature #98 en paralelo y tocarlos
provoca conflicto. Si crees que el diseno los necesita, PARA y reporta:
  - mobile-pet-tracker/src/screens/home/index.tsx y su index.test.tsx
  - mobile-pet-tracker/src/app/(tabs)/food.tsx
  - mobile-pet-tracker/src/api/types.ts
  - mobile-pet-tracker/src/api/nutrition.ts
  - mobile-pet-tracker/src/i18n/catalog.ts
  - mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  - docs/ui-guidelines.md

Reglas criticas:
  - Arquitectura de docs/architecture.md y convenciones de docs/conventions.md.
  - Es UI movil: se valida contra docs/ui-guidelines.md (C8 de CHECKPOINTS.md).
  - TDD por requisito: test rojo que NOMBRA el R-id -> verde -> refactor.
  - UN COMMIT POR REQUISITO COMO MINIMO, y el test rojo en commit ANTERIOR a su
    implementacion. Un unico commit con todo incumple C4 de CHECKPOINTS.md.
    En #19 eso costo una ronda entera: no repitas el historial sin rojo.
  - EXCEPCION de R9: sus deltas sobre ui-copy-table.ts y ui-language.test.ts
    viajan DENTRO de los commits verdes de R2 y R6. R9 no tiene commit rojo
    propio: su rojo lo produce el codigo de produccion de R2 y R6, y un commit
    que lo dejara rojo seria un commit rojo en la historia.
  - Actualiza specs/mobile-map-staleness-single-source/traceability.md tras cada
    commit, con el hash real. NO rebasees despues de rellenarla: los hashes
    dejan de ser ancestros de la rama y la trazabilidad queda invalida.
  - bun / bunx para todo en movil. Nunca npx, nunca npm i -g.
  - CERO dependencias nuevas. CERO claves i18n nuevas: 'pairing.connection' ya
    existe en los dos idiomas y 'map.gps' se queda en el catalogo sin uso.
  - No toques backend-pet-tracker/. No crees recursos AWS ni corras cdk deploy.
  - NO ejecutes ./init.sh: LocalStack y Postgres son compartidos con la sesion
    que lleva #98 y dos init.sh a la vez dan e2e rojos falsos. Para esta feature
    basta jest movil, que no usa esos puertos.

Criterios de aceptacion (los R-id de requirements.md):
  R1 — la etiqueta del tile sale de la tabla compartida de
       src/utils/device-connectivity.ts, con la forma { labelKey } que fija E1
  R2 — el badge lee device.connectivity del detalle, no staleSeconds
  R3 — sin detalle resuelto, el tile dice '—'
  R4 — la antiguedad (stat-updated) sigue saliendo de staleSeconds
  R5 — no sobrevive ninguna constante de umbral en mobile-pet-tracker/
       (requisito de verificacion)
  R6 — el tile se rotula t('pairing.connection'), no t('map.gps')
  R7 — el detalle se refresca con el poll de 15 s que ya existe
  R8 — gate humano: smoke en dev build de Android. NO es tuyo: dejalo listo y
       documenta en el reporte que queda pendiente del humano
  R9 — el candado de copy de #65 sigue verde con el inventario fila a fila de
       E1 (requisito de verificacion; sin test nuevo)

Al terminar: escribe el resultado en
progress/impl_mobile-map-staleness-single-source.md — que requisito cerro cada
commit, el estado de la suite medido sin pipe, y cualquier supuesto de la spec
que resultara falso. No hagas merge ni abras PR: eso lo cierra el humano.
```
