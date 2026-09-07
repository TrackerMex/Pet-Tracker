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
- **ALCANCE AMPLIADO POR EL HUMANO EL 2026-09-07.** La primera spec se firmo en `a1fa09e` (un fichero, una linea, casilla con fecha, sin codigo colado) para un alcance estrecho. El humano pidio meter dentro **todo lo que esa spec habia dejado fuera**, asi que la spec **se reescribe y la firma anterior deja de cubrirla**: la casilla vuelve sin marcar y hace falta **una firma nueva**. Dejarla marcada seria fraudulento.
- **Que entra ahora**: selector de metrica (minutos activos / distancia / paseos, sin refetch), detalle por dia al tocar con tooltip, navegacion a `/trips` por la ruta existente, eje Y, rejilla, linea de media, animacion de entrada respetando `prefers-reduced-motion`, migracion de la Home a `src/screens/home/` (convencion de #39) y traduccion de los enum crudos de la API -`src/screens/pairing/index.tsx:421-422` pinta hoy `device.connectivity` en bruto, un `'LTE'` a pelo, y su test lo fija en `index.test.tsx:511`-. Esto ultimo mete #68 en una pantalla que no tiene que ver con actividad; queda declarado y acotado en la spec.
- **Dos cosas de la lista de fuera-de-alcance NO se absorben, por decision del humano**: la tira de 4 celdas es **#69** y los accesos rapidos son **#71**. Se especifican despues, con su id, su gate y su PR. Absorberlas habria sido borrar dos features del mapa, no ampliar una.
- **La pildora "En linea" sale con id propio: #73 `pet-online-pill`** (creada el 2026-09-07). Es la unica de esa lista que no se resuelve solo en movil: el pestillo de conectividad del backend esta roto (`ingestion.drizzle.store.ts:97`) y el umbral de silencio nunca se definio (decision G, abierta desde #67). Pintarla con el dato de hoy seria pintar un estado incorrecto.
- **Libreria de graficas: `react-native-chart-kit`, designada por el humano.** Con el alcance ampliado -tooltip, seleccion, eje Y, rejilla- ya se paga; con siete barras estaticas no se pagaba, que es por lo que la primera spec la habia descartado. Tres restricciones que la spec tiene que resolver por escrito: **import obligatorio por el subpath `react-native-chart-kit/v2`** porque la v1 tipa `data` como `number[]` sin null y perderia en silencio la distincion sin-dato/cero; los colores de chart-kit entran por `chartConfig` como cadenas, asi que hay que definir como fluyen los tokens hasta ahi sin romper el grep-clean; y su accesibilidad es **un resumen**, no siete anuncios (`getBarChartAccessibilitySummary` devuelve una cadena), asi que la tabla por columna se pinta a mano. Ademas `width`/`height` son pixeles obligatorios, no `100%`: hace falta `onLayout`.
- **Se conserva de la primera spec, ya verificado contra el arbol**: el discriminante de "sin dato" es **`source` y nunca `null`** -`missingEntry()` pone todo a `null` pero `emptyActivity()` devuelve **ceros**, asi que hoy `null` equivale a `missing` por coincidencia y ramificar por `null` pasaria todos los tests siendo falso-; el array es cronologico terminando hoy y la letra del eje sale de la fecha; y `weekComparison` es delta porcentual de la media diaria a un decimal, sin `restMinutes`.
- **Implementador: Codex CLI.** El humano recupero cuota el 2026-09-07, asi que se vuelve al handoff por disco de `CLAUDE.md` §Implementacion y **se deja de usar el subagente `implementer`**. Vuelve a valer el punto entero del reparto: quien implementa no revisa. El handoff se escribe cuando el humano firme la spec nueva.
- **Baseline verde**: `./init.sh` exit 0 sobre `4a5f6dd` al abrir la branch. Es el commit contra el que el reviewer mide el **delta**, no una constante que copiar dentro de la spec.
- **Dependencias nuevas: autorizadas por el humano (2026-09-07)**, siempre que la spec las declare como pide la carta (`docs/ui-guidelines.md:171-172`). Cae el "no se instala nada" implicito desde #46; sigue en pie el veto **nominal** a `expo-linear-gradient` (#46, ratificado en la enmienda A4 de #67).
- **PanelUI (`panelui-native`) evaluada y descartada como libreria de componentes** el 2026-09-07: encaja con el stack (uniwind, Tailwind v4, Reanimated 4) y su `BarChart` es bueno -cero hex, colores por `useCSSVariable`, modela `null` y lo salta, `accessibilityLabelForDatum` por barra-, pero **no sustituye a `heroui-native`, lo duplica**: trae su propio `theme.css` con seis temas y escala de radios por tema, `@hugeicons` en duro frente a `reicon-react-native`, y dos peers requeridos que no tenemos (`expo-linear-gradient`, vetado por nombre, y `@react-native-masked-view/masked-view`, nativo). Migrar seria reescribir #46, #61, #62, #65 y #67. Si algun dia hace falta su chart, la via es su CLI de copiar codigo, no adoptar el paquete.
- **Gate humano de smoke**: dev build de Android en los dos temas, con una mascota que tenga dias sin dato y dias de cero minutos. No delegable a IA.
