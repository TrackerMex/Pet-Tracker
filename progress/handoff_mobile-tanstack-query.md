# Handoff a Codex CLI — #87 `mobile-tanstack-query`

> Escrito por el leader el 2026-09-10, tras la aprobación humana de la spec.
> El humano corre Codex CLI en su terminal con el prompt de abajo.
> Mientras Codex trabaja, la sesión de Claude Code no toca `mobile-pet-tracker/`.

---

## Prompt

```
Feature: mobile-tanstack-query (#87), branch: feature/87-mobile-tanstack-query
Spec aprobada: specs/mobile-tanstack-query/requirements.md (status: approved)
Lee también: specs/mobile-tanstack-query/design.md y tasks.md

Trabajas en /home/claude/sites/Pet-Tracker, en la branch de arriba, que ya
está creada, pusheada y rebasada sobre main @ 7f298f2. NO cambies de branch,
NO mergees main, NO abras el PR: el PR lo abre el leader tras el veredicto
del reviewer.

Qué es: migrar el fetching de datos de la app móvil de src/hooks/use-api.ts a
TanStack Query v5. Veinte requisitos, R1 a R20. R9-R18 son una pantalla cada
uno. La spec trae, por pantalla, el fichero de test que la protege y la
aserción concreta que se rompería si la migración cambiara su conducta.

Antes de la primera línea de código:
  - Carga las skills del plugin expo: expo-overview primero y, derivadas de
    ella, expo-data-fetching (es el tema exacto de esta feature) y las que
    docs/ui-guidelines.md indique. El plugin ya está instalado.
  - Lee docs/ui-guidelines.md, docs/conventions.md y docs/architecture.md.
  - Borra mobile-pet-tracker/.expo/types/router.d.ts si existe: está
    gitignorado, se queda obsoleto y rompe el typecheck con rutas fantasma.
    Se regenera solo.
  - Lee la §0 de requirements.md entera. Son cuatro premisas del enunciado
    original que resultaron FALSAS al verificarlas contra el árbol. Si algo
    de lo que leas por ahí contradice la §0, gana la §0.

Reglas críticas:
  - Arquitectura de docs/architecture.md y convenciones de docs/conventions.md.
  - UI móvil regida por docs/ui-guidelines.md.
  - TDD por requisito: test rojo -> verde -> refactor, según tasks.md.
  - UN COMMIT POR REQUISITO COMO MÍNIMO, y el commit del test rojo va ANTES
    que el de su implementación. Un único commit con test + implementación +
    docs incumple C4 de CHECKPOINTS.md; pasó en #19 y se rechazó.
  - Actualiza specs/mobile-tanstack-query/traceability.md tras cada commit:
    el reviewer no aprueba con filas en "pendiente".
  - Instalar @tanstack/react-query SÍ está autorizado: lo declara R1 de la
    spec aprobada, con pin exacto 5.102.8 (no ^5). Ninguna otra dependencia
    nueva sin decirlo en progress/impl_mobile-tanstack-query.md.
  - NO toques feature_list.json: lo lleva el leader y os pisaríais.
  - NO toques backend-pet-tracker/. Esta feature es 100% mobile-pet-tracker/.
  - Al terminar, COMMITEA Y PUSHEA la branch. El humano trabaja desde otra
    máquina y sin push no ve nada.

Entorno, dos trampas de este VPS:
  - init.sh aborta con un falso "Más de 1 feature en in_progress" por el bug
    #75: este entorno tiene FORCE_COLOR=3 y la comparación por cadena de
    init.sh:138 recibe el número con códigos ANSI. Lánzalo SIEMPRE como:
        env -u FORCE_COLOR bash ./init.sh
  - Hay otra sesión trabajando en el worktree /home/claude/sites/Pet-Tracker-wt-backend
    y los dos comparten el Postgres de docker: dos init.sh a la vez dan e2e
    rojos falsos. Antes de lanzarlo comprueba:
        pgrep -af 'init\.sh' | grep -v grep || echo "ninguno"
    Si hay uno vivo, espera a que termine.

Criterios de aceptación: R1 a R20 de specs/mobile-tanstack-query/requirements.md.
Los que más se suelen incumplir en este repo:
  - R19: use-api.ts y su test desaparecen, y NADIE los importa. Ojo con
    use-pet-selection.ts, que importa el tipo ApiResult (R8) y es el motivo
    de que los consumidores sean once y no diez.
  - R20 y el criterio 5: el comportamiento visible no cambia y está PROHIBIDO
    relajar una aserción existente para que pase. Si crees que una aserción ya
    no aplica, no la toques: escríbelo en el reporte y para.
  - Los tres deltas de conducta de §Deltas de conducta aceptados son los
    ÚNICOS cambios de conducta permitidos. Cualquier otro es un fallo.
  - Toda cifra de candado que muevas se declara como delta contra 5666b85
    ("+N respecto a…"), nunca como recuento absoluto.

Al terminar: escribe el resultado en progress/impl_mobile-tanstack-query.md
con, por requisito, el hash del commit rojo y el del verde, y la evidencia de
que la suite móvil completa, el typecheck y `env -u FORCE_COLOR bash ./init.sh`
quedan verdes.
```

---

## Qué hace el leader mientras tanto

Nada sobre `mobile-pet-tracker/`. Solo `docs/`, `specs/`, `progress/` y
`feature_list.json`. Cuando el humano confirme que Codex terminó, el leader lee
`progress/impl_mobile-tanstack-query.md` y lanza el `reviewer`.

## Después de #87

`specs/mobile-alerts-center/` (#78, `spec_ready`, branch propia pusheada) hay que
enmendarla: **R1, R8, R9 y R11** pasan de acumulación manual de páginas y
`refetch` por foco a `useInfiniteQuery` e `invalidateQueries`, con la convención
de query keys que fija R7 de esta feature. Las cinco decisiones del gate de #78
se firman con la spec ya enmendada.
