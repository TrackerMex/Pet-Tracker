# Handoff a Codex CLI — #98 `mobile-meals-served-ui`

> Escrito por el `leader` el 2026-09-21, tras la firma humana de la spec
> (commit `8658be20`). El humano copia el bloque de abajo en su terminal de
> Codex CLI. El handoff es **por disco**: nada de contenido entre las dos IAs
> por chat.

---

```
Feature: mobile-meals-served-ui (#98), branch: feature/98-mobile-meals-served-ui
Spec aprobada: specs/mobile-meals-served-ui/requirements.md (status: approved,
firmada por el humano en 8658be20 el 2026-09-21)
Lee también, completos y antes de escribir nada:
  - specs/mobile-meals-served-ui/design.md  (contrato del backend, tipos,
    flujo de refresco, tokens, y en §7 los dos lotes de jest)
  - specs/mobile-meals-served-ui/tasks.md   (orden TDD requisito por requisito)
  - specs/mobile-meals-served-ui/traceability.md (la rellenas tú, fila a fila)
  - docs/ui-guidelines.md (rige TODO el trabajo sobre mobile-pet-tracker/)
  - docs/conventions.md y docs/architecture.md

Criterios de aceptación: R1 a R11 de requirements.md. Cada R-id nombra ya el
test que lo prueba, con ruta y título literal: no inventes otros ni renombres
los existentes.

Archivos a crear/modificar (la tabla completa está en design.md §Ficheros):
  mobile-pet-tracker/src/api/types.ts
  mobile-pet-tracker/src/api/nutrition.ts
  mobile-pet-tracker/src/api/__tests__/nutrition.test.ts
  mobile-pet-tracker/src/app/(tabs)/food.tsx
  mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx
  mobile-pet-tracker/src/screens/home/index.tsx
  mobile-pet-tracker/src/screens/home/index.test.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  las 10 fixtures tipadas PetProfile que lista requirements.md (R1)
  docs/ui-guidelines.md          (§Enmienda #98)
  specs/mobile-food/requirements.md (§Enmienda #98, retira la D7 de #38)

REGLAS CRÍTICAS

1. UN COMMIT POR REQUISITO COMO MÍNIMO, con el commit del test ROJO antes que
   el de su implementación. Un único commit con implementación + tests + docs
   incumple C4 de CHECKPOINTS.md y ya pasó en #19: el historial rojo→verde es
   parte del entregable, no un adorno. Formato: feat(mobile): <desc> (R1,R2).
2. Actualiza specs/mobile-meals-served-ui/traceability.md tras cada commit.
   Ninguna fila puede quedar en «pendiente». NO rebasees después de rellenarla:
   los hashes dejarían de ser ancestros de la rama.
3. TODAS las cifras de la spec están ancladas al commit 914905b8. Verificado:
   ningún commit posterior de esta rama toca mobile-pet-tracker/ ni
   backend-pet-tracker/ — solo specs/, progress/ y feature_list.json. El ancla
   sigue viva. Si algo no cuadra, PARA y avisa; no ajustes una cifra a ojo.
4. jest y los paréntesis: `(tabs)` sin escapar es una regex y los ficheros se
   saltan EN SILENCIO con exit 0. Usa --runTestsByPath tal como tasks.md ya lo
   escribe en cada paso, o escapa los paréntesis.
5. Borra mobile-pet-tracker/.expo/types/router.d.ts antes de empezar. Está
   gitignorado y sus rutas fantasma rompen el typecheck.
6. NO lances ./init.sh. Postgres y LocalStack son compartidos con otras
   sesiones en worktrees vecinos y ya provocaron e2e rojos falsos. Para medir,
   usa bunx jest y bunx tsc --noEmit desde mobile-pet-tracker/.
7. En móvil se usa bun: bunx, bun add. Nunca npx ni npm i -g.
8. CERO dependencias nuevas.
9. Carga las skills del plugin expo antes de tocar UI o red: expo-overview
   primero, luego expo-data-fetching y expo-native-ui. El proyecto va en Expo
   SDK 57: los docs son https://docs.expo.dev/versions/v57.0.0/, nunca latest.
10. Sin estado optimista para las comidas servidas. Es decisión firmada del
    humano (2026-09-15): el servidor puede INVALIDAR la acción si el plan se
    regenera sin esa franja. Tras cada POST/DELETE se refresca y se pinta lo
    que devuelve el servidor. NO copies el patrón `acked` de alerts.
11. Sin useMutation ni invalidateQueries. El patrón del repo es el de
    src/app/(tabs)/weight-log.tsx:98-111 (createWeight + refetch).
12. Toca SOLO mobile-pet-tracker/ y los dos ficheros de enmienda. Nada de
    backend-pet-tracker/, infra/, init.config.sh ni CI.

AL TERMINAR
  - Escribe progress/impl_mobile-meals-served-ui.md con: los resultados de los
    dos lotes de jest de design.md §7, el typecheck, qué commit cubre cada
    R-id, y cualquier decisión que hayas tenido que tomar sobre la marcha.
  - NO marques #98 como done, NO mergees, NO abras el PR y NO firmes las dos
    §Enmienda #98: las escribes, las firma el humano.
  - Avisa al humano y para. Revisa un reviewer que no eres tú.
```

---

## Notas para el humano (no van en el prompt)

- Mientras Codex trabaja, el `leader` solo toca `docs/`, `specs/`, `progress/`
  y `feature_list.json`. Un solo escritor sobre el working tree.
- Las dos decisiones que el `leader` recomendaba cambiar (título «Alimentación»
  en vez de «Comidas hoy», y quitar el `useQueryClient`) quedaron **como la
  spec las tenía**: están escritas en `requirements.md:623` y `:602`/`:642`
  como decisiones cerradas, y la firma las cubre.
- Cuando Codex termine y tú lo confirmes, el `leader` lanza el `reviewer`.
