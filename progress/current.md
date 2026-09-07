# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Rediseno contra el diseno del Make (desde 2026-09-04)

- **Origen y mapa**: `progress/explore_design-gap-vs-make.md`. Alcance cerrado por el humano: Bloque 0 + Bloque 1, features #64-#71.
- **#65 mobile-ui-language: `done`** (2026-09-06), PR #110 pendiente de merge por el humano.
- **#64 paleta pastel: `done`**, mergeada en main (PR #106).
- **#66 listado con foto: `done`** y **mergeada** en main (PR #111, merge 303fc19, 2026-09-06 21:27 UTC). `GET /v1/pets` ya devuelve `photoUrl` prefirmada por mascota: TTL 3600 s, se firma siempre, sin `?include` ni caché; `device` sigue en `null` en el listado. Desbloquea #67.
- **Deuda registrada**: #72 el test flaky de seleccion de foto de add-pet. Y en la lane del Backend, el `.env` que `drizzle.config.ts` no carga.
- **Siguiente**: #68 actividad semanal, #69 tira de estadisticas, #70
  recordatorios, #71 accesos rapidos. Ninguna especificada todavia.
- **Codex CLI sin cuota hasta el martes**: mientras tanto la implementacion
  cae en el subagente `implementer` (`CLAUDE.md` §Excepciones), declarandolo
  en cada feature y asumiendo que la revision cruzada es mas debil.


## #67 mobile-pet-hero-header — sesion UI (desde 2026-09-06)

- **Branch**: `feature/67-mobile-pet-hero-header`, creada sobre main en 303fc19. Worktree principal `/home/claude/sites/Pet-Tracker`.
- **Estado**: spec **aprobada** el 2026-09-07. El humano firmo la casilla de §Aprobacion en su propio commit `8cf28e5` sobre la branch; el leader recogio ese commit y paso el frontmatter de los cuatro ficheros a `approved`. Implementacion en marcha.
- **Implementador: el subagente `implementer`**, no Codex CLI, por la excepcion de `CLAUDE.md` §Excepciones: Codex sigue sin cuota (la nota del 2026-09-06 decia "hasta el martes" y hoy es lunes). Se asume por escrito que la revision cruzada es mas debil de lo normal, porque quien implementa y quien revisa salen del mismo modelo.
- **Lo que el humano tiene que firmar**: (a) la spec, y (b) las **nueve enmiendas A1-A9** de R10, que tocan `specs/mobile-figma-polish/`, `specs/mobile-pets-profile/`, `docs/ui-guidelines.md` y `docs/conventions.md`. El bloque de enmienda es literal y su linea de firma se entrega sin marcar; el test de R10 lo lee de `design.md` §9, no de una copia.
- **Cuatro hallazgos de la spec que corrigen premisas del encargo**, todos verificados contra el arbol y no de memoria:
  1. `backgroundImage` a secas **no existe** en RN 0.86.2: solo `experimental_backgroundImage` (`StyleSheetTypes.d.ts:520`). Y `bg-linear-to-b` no resuelve — el parser de gradientes de uniwind espera paradas literales y `--tw-gradient` no aparece en el paquete. Va por el prop `style`.
  2. El velo del Make no da AA: `rgba(0,0,0,0.28)` sobre foto casi blanca deja blanco a 1,98:1, y subirlo a alpha 0,54 tapa la foto. El texto va sobre banda opaca de `bg-background` (18,93:1 y 4,98:1 en claro; 17,81:1 y 7,45:1 en oscuro), desviacion declarada al estilo de #61.
  3. "Pasos hoy" no se puede pintar: cero ocurrencias de `steps` en `src/` y `activitySummary` sale siempre `null`. El dato destacado pasa a **paseos** (`walkCount`), que Home ya descarga y hoy no pinta nadie.
  4. Home **no** lee `photoUrl` del listado: `home.tsx:174` lo saca del detalle con `getPet`. Lo que #66 desbloquea en Home es el `pet-switcher`, que si lee del listado y llega gratis al montarse en el slot.
- **Baseline verde** medido en `ffd045a` (2026-09-06): `./init.sh` exit 0. Movil 932/932 en 63 suites, backend 1243/1243 en 163, infra 14/14, e2e 354 pasados con 8 saltados de 28 suites; lint y typecheck limpios. El flaky de #72 no mordio en esta pasada. Este es el numero contra el que el reviewer mide el **delta** de #67, no una constante que copiar dentro de la spec.
- **Dos decisiones del humano del 2026-09-06**, ya volcadas a `feature_list.json` #67:
  1. Sin foto el hero pinta el **blobatar a sangre**, no la inicial. El enunciado original de la decision B decia "degradado con la inicial, que es el patron que ya usa pet-avatar" y esa premisa era falsa: `pet-avatar.tsx:29-36` pinta `blobatar(name)` con `SvgXml`, y la R5 aprobada de #40 ya habia matado el fallback de inicial el 2026-08-21. Se conserva blobatar y la R5 de #40 queda **sin enmendar**. El error nacio en `progress/explore_design-gap-vs-make.md:657-662` y se propago a **tres** sitios: ese informe (ya anotado), el enunciado de `feature_list.json` (ya corregido) y `docs/ui-guidelines.md:215-217`, la carta, que espera la enmienda A8 y la firma del humano.
  2. El selector de mascota **no vive dentro del hero**: el hero expone un slot, Home monta dentro el `pet-switcher.tsx` existente y Profile lo usa sin slot.
- **Enmienda pendiente de firma humana**: `specs/mobile-figma-polish/design.md` §5 (L95-103) declara "Headers hero (foto 280-340px con overlay): fuera de #46" y su `requirements.md` §Fuera de alcance lo repite. #67 lo revoca a proposito; la spec enumera el cambio y el humano lo firma, igual que #65 hizo con las specs que ratificaban el ingles.
- **Sin dependencia nueva para el degradado**: `expo-linear-gradient` sigue prohibido por #46. Con `react-native@0.86.2` hay `backgroundImage: linear-gradient(...)` nativo, y queda el `<LinearGradient>` de `react-native-svg` como alternativa; la spec elige y justifica.
- **Fuera de #67**: la pildora "En linea" (depende del pestillo roto de `ingestion.drizzle.store.ts:97` y de un umbral sin definir, decision G).
- **Implementador**: Codex CLI sigue sin cuota hasta el martes, asi que cae en el subagente `implementer` (`CLAUDE.md` §Excepciones), con la revision cruzada mas debil asumida por escrito.
