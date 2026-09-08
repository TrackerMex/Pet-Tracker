# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Rediseno contra el diseno del Make (desde 2026-09-04)

- **Origen y mapa**: `progress/explore_design-gap-vs-make.md`. Alcance cerrado por el humano: Bloque 0 + Bloque 1, features #64-#71.
- **Bloque 0 cerrado y mergeado**: #64 paleta pastel (PR #106), #65 idioma de UI (PR #110).
- **Bloque 1, tres de cuatro cerradas**: #66 listado con foto (PR #111), #67 cabecera fotografica (PR #112) y **#68 actividad semanal** (2026-09-08, PR pendiente de merge). Detalle completo de cada una en `progress/history.md`.
- **Queda del Bloque 1**: #69 tira de estadisticas, #70 recordatorios, #71 accesos rapidos. Ninguna especificada.
- **Deuda abierta al cerrar #68**: **#73** `pet-online-pill` -la pildora "En linea" necesita arreglar el pestillo de conectividad del backend (`src/workers/ingestion.drizzle.store.ts:97`) y definir un umbral de silencio, decision G-; **#74** `mobile-metric-selector-a11y` -el contenedor del selector no declara `accessibilityRole="radiogroup"`, asi que TalkBack lee tres controles sueltos, y **nada lo vigila**; handoff ya escrito en `progress/handoff_mobile-home-weekly-activity_a11y.md`-; **#75** `harness-init-force-color` -`init.sh:127-148` compara por cadena un numero que Node colorea y aborta en falso con "Mas de 1 feature en in_progress (1)" si el entorno trae `FORCE_COLOR`; se sortea con `env -u FORCE_COLOR`-. Y sigue **#72**, el flaky de seleccion de foto de add-pet.
- **Implementador: Codex CLI**, con cuota desde el 2026-09-07. Vuelve a valer el reparto entero: quien implementa no revisa.
- **Dependencias nuevas autorizadas** por el humano el 2026-09-07, siempre que la spec las declare (`docs/ui-guidelines.md:171-172`). Sigue en pie el veto **nominal** a `expo-linear-gradient`. La libreria de graficas designada es `react-native-chart-kit`, **siempre** por su subpath `/v2`.

## #69 mobile-home-stats-strip — sesion UI (desde 2026-09-08)

- **Branch**: `feature/69-mobile-home-stats-strip`, creada sobre main en `9358cc7`, que ya incluye #68. Worktree principal `/home/claude/sites/Pet-Tracker`.
- **Estado**: `pending`, spec en redaccion por `spec_author`. Para en el gate humano: nadie implementa hasta que el humano firme §Aprobacion en su propio commit sobre la branch.
- **Por que esta primero de las tres que quedan**: el hueco **ya esta abierto a proposito** -la spec de #68 anclo la grafica *despues* del `summary-card` justamente para que #69 pueda sustituirlo o subirlo bajo el hero sin reescribir nada-; los datos ya estan servidos y medio cableados -`walkCount` ya se descarga y **ya se pinta** como dato destacado del hero (`index.tsx:142`, clave `home.walks` que anadio #68), y `currentWeightKg` viene en el perfil-; y cierra la parte de la Home que se ve sin scroll: hero, tira, grafica.
- **La decision que la spec tiene que cerrar**: que pasa con el **sueno** (`restMinutes`), que la app muestra hoy en el `summary-card` y el diseno del Make no dibuja. Es el caso de la decision E y el humano ya fijo el criterio general de no perder informacion util solo por fidelidad. Dato ya verificado en #68: `restMinutes` **no tiene `weekComparison`**.
- **Encargo al `spec_author`**: verificar contra el arbol las cuatro premisas del enunciado y volver a derivar todos los numeros de linea. #68 reescribio la Home entera -la migro a `src/screens/home/` y le anadio la grafica-, y entre #67 y #68 el mismo informe de exploracion acumulo **diez** premisas falsas.
- **Dos lecciones de #68 exigidas en los candados**: que un candado que prohibe una cadena literal no es un candado de conducta, y que la mutacion se planta en **todos** los sitios de una decision, no en uno.
- **Baseline verde en la segunda pasada**: `./init.sh` exit 0 sobre `9358cc7`, corrido con `env -u FORCE_COLOR` por el bug de #75. Backend 1243/1243, infra 14/14, movil 67 suites y 1025/1025, e2e 354 pasados con 8 saltados. Es el commit contra el que el reviewer mide el **delta**.
- **La primera pasada salio ROJA, y no era flakiness misteriosa: es un test mal escrito.** `backend-pet-tracker/test/health-vaccines.e2e-spec.ts:497` fallo en la suite completa y paso **15/15** corrida aislada. La consulta `db.select().from(auditLog).where(and(eq(entity,'vaccine'), eq(entityId,id)))` **no lleva `orderBy`**, pero el test asserta `toEqual(['vaccine.create','vaccine.update','vaccine.delete'])` -un array ordenado- y ademas indexa `rows[1].meta` dando por hecho que el update es el segundo. Sin `ORDER BY` el orden de un `SELECT` no esta definido: con la suite entera y el Postgres bajo carga el orden fisico cambia. Ese test llevaba pasando por suerte. Registrado como **#76 `e2e-audit-log-order-assert`**, con el criterio extra de barrer el resto de los e2e buscando el mismo patron, porque seguramente esta copiado. No bloquea #69 -es backend y #69 es puro movil- pero contaminaba el baseline.
- **Implementador: Codex CLI**, por handoff de disco.
- **Las otras dos del bloque, y por que van despues**: **#71** accesos rapidos es la mas barata en absoluto -navegacion pura, sin datos- pero su spec tiene que enumerar destino por destino y comprobar que cada ruta existe, que es el error exacto que nos comimos en #68 con `/trips`; **#70** recordatorios tiene **la mitad del diseno bloqueada**, porque `nextReminder` y `activitySummary` siguen hardcodeados a `null` en el mapper del perfil y la barra de progreso de comidas no se puede construir.
