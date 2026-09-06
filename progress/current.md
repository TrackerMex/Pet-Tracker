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
- **Estado**: `spec_author` escribiendo `specs/mobile-pet-hero-header/`. Al terminar, la spec **para** en el gate humano: nadie implementa sin aprobacion firmada en branch.
- **Baseline**: `./init.sh` corriendo sobre la branch recien creada para confirmar que main sale verde del merge de #66.
- **Dos decisiones del humano del 2026-09-06**, ya volcadas a `feature_list.json` #67:
  1. Sin foto el hero pinta el **blobatar a sangre**, no la inicial. El enunciado original de la decision B decia "degradado con la inicial, que es el patron que ya usa pet-avatar" y esa premisa era falsa: `pet-avatar.tsx` pinta `blobatar(name)` con `SvgXml`, y la R5 aprobada de #40 ya habia matado el fallback de inicial el 2026-08-21. Se conserva blobatar y la R5 de #40 queda **sin enmendar**.
  2. El selector de mascota **no vive dentro del hero**: el hero expone un slot, Home monta dentro el `pet-switcher.tsx` existente y Profile lo usa sin slot.
- **Enmienda pendiente de firma humana**: `specs/mobile-figma-polish/design.md` §5 (L95-103) declara "Headers hero (foto 280-340px con overlay): fuera de #46" y su `requirements.md` §Fuera de alcance lo repite. #67 lo revoca a proposito; la spec enumera el cambio y el humano lo firma, igual que #65 hizo con las specs que ratificaban el ingles.
- **Sin dependencia nueva para el degradado**: `expo-linear-gradient` sigue prohibido por #46. Con `react-native@0.86.2` hay `backgroundImage: linear-gradient(...)` nativo, y queda el `<LinearGradient>` de `react-native-svg` como alternativa; la spec elige y justifica.
- **Fuera de #67**: la pildora "En linea" (depende del pestillo roto de `ingestion.drizzle.store.ts:97` y de un umbral sin definir, decision G).
- **Implementador**: Codex CLI sigue sin cuota hasta el martes, asi que cae en el subagente `implementer` (`CLAUDE.md` §Excepciones), con la revision cruzada mas debil asumida por escrito.
