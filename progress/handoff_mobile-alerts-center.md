# Handoff a Codex CLI — #78 `mobile-alerts-center`

> Escrito por el leader el 2026-09-11, tras la aprobación humana de la spec
> (`09f1f309`, 2026-09-10) y de sus **enmiendas E1-E8** (`4f9298e0`, 2026-09-11).
> El humano corre Codex CLI en su terminal con el prompt de abajo.
> Mientras Codex trabaja, la sesión de Claude Code no toca `mobile-pet-tracker/`.

---

## Prompt

```
Feature: mobile-alerts-center (#78), branch: feature/78-mobile-alerts-center
Spec aprobada: specs/mobile-alerts-center/requirements.md (status: approved)
Lee también: specs/mobile-alerts-center/design.md y tasks.md

Trabajas en /home/claude/sites/Pet-Tracker, en la branch de arriba, que ya
está creada, pusheada y con main mergeada (merge d07427e9, main @ cea72945).
NO cambies de branch, NO vuelvas a mergear main, NO rebases y NO abras el PR:
el PR lo abre el leader tras el veredicto del reviewer. Un rebase invalidaría
los hashes de traceability.md, que es justo lo que costó una ronda en #87.

Qué es: el centro de alertas de la app móvil y la campana del hero de Home.
El backend ya está completo desde #12/#13 y no se toca: GET /v1/alerts
(paginado por cursor) y POST /v1/alerts/:id/ack existen y están verificados
en la §0 de la spec. Falta TODO el lado cliente: no hay src/api/alerts.ts ni
ninguna ruta que lo consuma. Catorce requisitos, R1 a R14, más ocho
enmiendas E1-E8. R14 es un gate humano, no lo implementas tú.

Antes de la primera línea de código:
  - Lee la §Enmiendas tras el cierre de #87 de requirements.md ANTES que los
    requisitos. Esta spec se escribió sobre un árbol sin TanStack Query y #87
    lo cambió a mitad. Donde el cuerpo de un requisito y una enmienda
    parezcan discrepar, GANA LA ENMIENDA.
  - Lee la §0 entera (premisas verificadas contra el árbol). Dos premisas del
    enunciado original son FALSAS y están corregidas ahí: /v1/alerts NO
    devuelve 402 (D1) y el número de alertas abiertas SÍ es derivable hasta
    50 (D2). Si algo que leas por ahí contradice la §0, gana la §0.
  - Lee los tres ficheros que #87 dejó y que esta feature consume tal cual:
    mobile-pet-tracker/src/api/query-keys.ts,
    mobile-pet-tracker/src/providers/query-provider.tsx y
    mobile-pet-tracker/test/render-with-providers.tsx.
    El ejemplo vivo de pantalla ya migrada es
    mobile-pet-tracker/src/screens/reminders/index.tsx:49-68 (queries) y
    :71-107 (mutación: llamada plana + refetch, sin useMutation).
  - Carga las skills del plugin expo: expo-overview primero y, derivadas de
    ella, expo-router (ruta nueva bajo (tabs)/), expo-data-fetching (cliente
    y paginación), expo-native-ui (estados, safe areas) y
    appllama-app-design-skill (pantalla nueva), con los límites que les pone
    docs/ui-guidelines.md. El plugin ya está instalado.
  - Lee docs/ui-guidelines.md entero —incluida §Enmienda #70 sobre elementos
    repetidos, porque la fila de alerta es uno—, docs/conventions.md y
    docs/architecture.md.
  - Borra mobile-pet-tracker/.expo/types/router.d.ts si existe: está
    gitignorado, se queda obsoleto y rompe el typecheck con rutas fantasma.
    Se regenera solo.

Reglas críticas:
  - Arquitectura de docs/architecture.md y convenciones de docs/conventions.md.
  - UI móvil regida por docs/ui-guidelines.md (gate C8 de CHECKPOINTS.md).
  - TDD por requisito: test rojo -> verde -> refactor, en el ORDEN de tasks.md.
    Ese orden no es decorativo: R5 (la ruta) importa la pantalla que R4 crea, y
    R11 (el punto) cuelga de la campana que R10 crea. Al revés, el rojo sería
    un módulo inexistente, que NO es rojo legítimo (C4).
  - UN COMMIT POR REQUISITO COMO MÍNIMO, y el commit del test rojo va ANTES
    que el de su implementación. Un único commit con test + implementación +
    docs incumple C4 de CHECKPOINTS.md; pasó en #19 y se rechazó.
  - Actualiza specs/mobile-alerts-center/traceability.md tras cada commit: hay
    filas para R1-R14 y para E1-E8, y el reviewer no aprueba con ninguna en
    "pendiente".
  - CERO dependencias nuevas. @tanstack/react-query ya está instalada y fijada
    por #87 (5.102.8, sin rango); FlatList es de React Native; los iconos
    Bell, BatteryLow y LocationSlash ya vienen en reicon-react-native.
  - CERO cambios en backend-pet-tracker/ y cero migraciones. Esta feature es
    100% mobile-pet-tracker/ (más la tabla de copy de specs/mobile-ui-language/
    design.md §2, que R3 manda actualizar).
  - NO toques feature_list.json: lo lleva el leader y os pisaríais.
  - Toda cifra de candado que muevas se declara como DELTA, sumando al final
    de la suma existente ("260 + 16 + 1 + 4 + 7 + 14"), nunca como recuento
    absoluto reescrito. Un total absoluto ha parado el trabajo tres veces.
  - Al terminar, COMMITEA Y PUSHEA la branch. El humano trabaja desde otra
    máquina y sin push no ve nada.

Entorno, dos trampas de este VPS:
  - init.sh aborta con un falso "Más de 1 feature en in_progress" por el bug
    #75: este entorno tiene FORCE_COLOR=3 y la comparación por cadena de
    init.sh:138 recibe el número con códigos ANSI. Lánzalo SIEMPRE como:
        env -u FORCE_COLOR bash ./init.sh
  - Hay otra sesión trabajando en /home/claude/sites/Pet-Tracker-wt-backend
    (#89) y los dos comparten el Postgres de docker: dos init.sh a la vez dan
    e2e rojos falsos. Antes de lanzarlo comprueba:
        pgrep -af 'init\.sh' | grep -v grep || echo "ninguno"
    Si hay uno vivo, espera a que termine.
  - Aviso de flake conocido, NO tuyo: src/screens/add-pet/index.test.tsx
    ("uploads a chosen preview only after createPet succeeds") falla ~2 de
    cada 13 pasadas completas de la suite móvil. Es la deuda #72. Si te cae,
    repite la corrida y DILO en el reporte; no lo arregles ni lo silencies.

Criterios de aceptación: R1 a R14 de requirements.md, con las enmiendas E1-E8.
Los puntos donde este repo se rompe una y otra vez, por orden de reincidencia:

  - R6, la fila de alerta es un ELEMENTO REPETIDO: las doce decisiones de la
    carta §Enmienda #70 llevan cada una su expect, dentro de within(row), y la
    cardinalidad se cuenta SIEMPRE con children.length, nunca con
    getAllByTestId por prefijo. El orden de los hijos también se assertaa
    (decisión 12): getByTestId es agnóstico al orden y por sí solo no cierra
    nada. Cuatro features seguidas (#69, #71, #70, #85) destaparon una
    dimensión no candada cada una.
  - R7: la partición "abiertas primero" se calcula sobre el status TAL COMO SE
    DESCARGÓ, y el overlay del ack se aplica DESPUÉS. Si inviertes ese orden,
    la fila salta de grupo bajo el dedo al pulsarla; es la alternativa A9, ya
    descartada por escrito.
  - R9 con la enmienda E3: useInfiniteQuery, initialPageParam undefined,
    getNextPageParam que corta en nextCursor === null o en página no-ok, y el
    guard !hasNextPage || isFetchingNextPage en onEndReached. CERO useState de
    páginas o de cursor. El bloque exacto está escrito en R9; cópialo.
  - R8 con la enmienda E5: el ack NO se migra a useMutation y NO usa
    setQueryData. Es llamada plana a ackAlert más el overlay local. La caché
    guarda lo que dijo el servidor; el overlay, lo que acaba de hacer el
    usuario. Si "mejoras" esto, rompes R7.
  - E2: la campana usa alertKeys.open() de src/api/query-keys.ts, nunca un
    queryKey literal. El candado #87 R19 (design-drift.test.ts:438-446) falla
    si aparece un "queryKey: [" en src/screens/home/index.tsx.
  - E8 y R13: el único delta permitido en un candado de #87 es la fila nueva
    'screens/alerts/index.tsx': 1 en el mapa screenSignOutCalls
    (design-drift.test.ts:386-397). La fila 'screens/home/index.tsx': 0 NO se
    mueve: si la campana necesitara llamar a signOut, es que está mal hecha
    —lo hace el QueryCache del provider (query-provider.tsx:23-27)—.
  - R3 y R12: las 14 claves nuevas van en los dos idiomas, se registran en
    specs/mobile-ui-language/design.md §2 con el sufijo exacto
    "← añadida por #78 (R3)", y mueven tres candados, los tres como suma:
    language-provider.test.tsx:41 (+ 14), ui-language.test.ts:391 (19+2+1) y
    ui-language.test.ts:83 (…+ 2). Cero literales en inglés en pantalla y en
    los tests: se compara contra t() o contra la clave, nunca contra una
    cadena escrita a mano.
  - R5: no se toca src/components/floating-tab-bar.tsx ni
    src/app/(tabs)/_layout.tsx. La ruta vive bajo (tabs)/ y NO es pestaña
    porque no está en el array TABS; hay siete precedentes vivos.
  - R13 se cierra con PRUEBA DE MUTACIÓN documentada, no con una afirmación:
    cambia bg-danger-soft por bg-accent-soft en la fila, ve el rojo de
    consistency-classnames.test.ts por su aserción de 16, restaura y comprueba
    git diff vacío. Sin sonda vista en rojo no hay candado. Plántala donde el
    candado podría no mirar, no en el sitio cómodo.
  - Está PROHIBIDO relajar o borrar una aserción existente para que pase algo.
    Si crees que una aserción ya no aplica, no la toques: escríbelo en el
    reporte y para.

Al terminar: escribe el resultado en progress/impl_mobile-alerts-center.md
con, por requisito y por enmienda, el hash del commit rojo y el del verde, la
evidencia de mutación de R13, y la prueba de que la suite móvil completa, el
typecheck y `env -u FORCE_COLOR bash ./init.sh` quedan verdes. R14 (smoke en
dev build de Android con una alerta open real) lo firma el humano: déjalo
anotado como pendiente, no lo inventes.
```

---

## Qué hace el leader mientras tanto

Nada sobre `mobile-pet-tracker/`. Solo `docs/`, `specs/`, `progress/` y
`feature_list.json`. Cuando el humano confirme que Codex terminó, el leader lee
`progress/impl_mobile-alerts-center.md` y lanza el `reviewer`.

## Lo que el reviewer tendrá que verificar aparte de C2-C7

- Que las ocho enmiendas E1-E8 están implementadas como dicen, no como decía el
  cuerpo original de R4, R8, R9 y R11.
- Que `git diff origin/main...HEAD` no trae código que no salga de esta spec
  (lección de #59: un fingerprint aprobado no garantiza que el árbol sea el
  revisado).
- Que ninguna cifra de candado se movió sin declararse como delta.
