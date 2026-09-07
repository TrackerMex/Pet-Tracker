# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Rediseno contra el diseno del Make (desde 2026-09-04)

- **Origen y mapa**: `progress/explore_design-gap-vs-make.md`. Alcance cerrado por el humano: Bloque 0 + Bloque 1, features #64-#71.
- **Bloque 0 cerrado**: #64 paleta pastel (PR #106), #65 idioma de UI (PR #110), ambas mergeadas.
- **#66 listado con foto: `done` y mergeada** (PR #111, merge 303fc19). `GET /v1/pets` devuelve `photoUrl` prefirmada por mascota, TTL 3600 s.
- **#67 cabecera fotografica: `done` y mergeada** (PR #112, merge 4a5f6dd, 2026-09-07). Detalle completo en `progress/history.md`.
- **Queda del Bloque 1**: #68 actividad semanal (en curso), #69 tira de estadisticas, #70 recordatorios, #71 accesos rapidos.
- **Deuda registrada**: #72 el test flaky de seleccion de foto de add-pet. Y en la lane del Backend, el `.env` que `drizzle.config.ts` no carga.
- **Codex CLI sin cuota hasta el martes** (nota del 2026-09-06): mientras tanto la implementacion cae en el subagente `implementer` (`CLAUDE.md` §Excepciones), declarandolo en cada feature y asumiendo por escrito que la revision cruzada es mas debil porque quien implementa y quien revisa salen del mismo modelo.


## #68 mobile-home-weekly-activity — sesion UI (desde 2026-09-07)

- **Branch**: `feature/68-mobile-home-weekly-activity`, creada sobre main en `4a5f6dd`. Worktree principal `/home/claude/sites/Pet-Tracker`.
- **Estado**: `pending`, spec en redaccion por el subagente `spec_author`. Para en el gate humano: nadie implementa hasta que el humano firme §Aprobacion en su propio commit sobre la branch.
- **Por que esta primero**: unica P2 del Bloque 1 (69, 70 y 71 son P3) y la de mejor relacion valor/coste del informe: los siete dias **ya se descargan** y la Home tira seis.
- **Encargo al `spec_author`**: verificar contra el arbol las **siete** premisas del enunciado antes de construir sobre ellas, y volver a derivar todos los numeros de linea — #67 reescribio `home.tsx` y el enunciado se escribio cuatro features atras. En #67 cuatro premisas del mismo informe salieron falsas y se habian propagado a tres sitios cada una (memoria `premisas-de-explore-sin-verificar`).
- **Riesgos que la spec tiene que cerrar por escrito**:
  1. Un dia pasado sin datos vuelve con `source: 'missing'` y las metricas en `null`, **no en cero** — un cero significa descanso confirmado. Necesita render de "sin dato" distinto de una barra de altura 0, o la grafica miente.
  2. El array es cronologico terminando hoy, **no** lunes a domingo: la letra del eje se deriva de la fecha y nunca del indice.
  3. `weekComparison` ya trae la variacion contra los 7 dias previos, asi que las flechas de tendencia salen gratis aunque el Make no las dibuje. Entra o no, pero por escrito.
- **Invariantes**: sin llamada nueva a la API (si hace falta una, es hallazgo que para la feature), sin libreria de graficas nueva — se reutiliza el patron de `src/components/weight-chart.tsx` —, grep-clean intacto, `tabular-nums` y `borderCurve: continuous` de #62.
- **Hueco de #69 reservado**: la tira de estadisticas se montara sobre el hero; #68 no la implementa pero tampoco cierra su sitio.
- **Baseline verde**: `./init.sh` sobre `4a5f6dd` al abrir la branch. Es el commit contra el que el reviewer mide el **delta**, no una constante que copiar dentro de la spec.
- **Gate humano de smoke**: dev build de Android en los dos temas, con una mascota que tenga dias sin dato. No delegable a IA.
