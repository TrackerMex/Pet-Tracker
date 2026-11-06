# review: mobile-orbit-cachorro-art (#243)
Fecha: 2026-11-06
Revisado: HEAD `3a88db15`, H0 `647a3056500ef67cd00eeb2a31b810d4e214b01b`, rama `feature/243-orbit-cachorro-art`
Veredicto: APROBADO (sobre R1 a R7; `./init.sh` pendiente del leader por encargo, no corrido por el reviewer; casilla G2 sigue abierta, es del humano)

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene #243 en `spec_ready` y ninguna otra `in_progress` en esta rama.
- [x] progress/current.md: la sesion la gobierna el leader (no es un entregable de Codex); el reporte `impl_mobile-orbit-cachorro-art.md` y el marcador `.done` existen. Nada que objetar.

## Checklist C3 — Arquitectura
- [x] N/A en sustancia: la feature no toca codigo de aplicacion. `git diff --name-only H0..HEAD -- mobile-pet-tracker/src` lista solo `orbit-cachorro-art.test.ts` y `orbit-rename.test.ts`.
- [x] El test nuevo solo usa `jest.requireActual` de `fs`, `path`, `crypto`; no importa modulos de produccion (no tautologico).
- [x] Sin dependencias nuevas: `package.json` y `bun.lock` sin cambios.

## Checklist C4 — TDD
- [x] Cada R<n> con candado de jest tiene `it` que lo nombra: R1 (lista exacta + `it.each` por pose), R2 (10 filas + arte viejo), R3 (11 fuentes + script), R6 (carta). R4 es la salida del script (D9), R5 son suites existentes y guarda de `src/`, R7 es guarda de git, como prescribe la spec.
- [x] Historial test-primero:
  - `42e9c47c` test rojo (log: 12 failed, 22 passed: 10 R2 + 1 R2 arte viejo + 1 R3 script, por aserciones; sin ENOENT/ReferenceError) -> `f7973231` verde (script + 10 WebP).
  - `3b178619` test rojo R6 (log `c4-red-243.log`: 1 failed por aserción) -> `7d181887` carta.
  - `5fa2e0b7` (Enmienda 1) nace de un rojo previo (`#225 R4` desde C5), declarado en la spec y en el reporte; comprobado por mi mutacion E1a (quitar la entrada pone rojo ese `it`).
  - Los commits rojos tocan solo el test.

## Checklist C5 — Trazabilidad
- [x] `traceability.md`: 0 filas «pendiente»; los hashes citados (`42e9c47c`, `f7973231`, `3b178619`, `7d181887`, `5fa2e0b7`) existen en el historial.
- [x] Commits con formato `tipo(scope): desc (#243)` y R-ids en el asunto.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` `status: approved`; casillas de firma delegada, G1 y G4 marcadas con fecha y fuente; G2 (humano) sin marcar, como corresponde. No toque §Aprobación. Enmienda 1 (`31b7c10a`) firmada en el commit del leader.

## Checklist C7 — Sin codigo huerfano
- [x] El arte se sustituye bajo los mismos nombres (28 ficheros en `assets/images` antes y despues; ningun `orbit-*` extra, ningun sha256 viejo presente). No queda componente ni test del arte reemplazado. El maestro viejo de #225 permanece como historia por decision de la spec.

## Checklist C8 — Carta de UI
- [x] `docs/ui-guidelines.md`: el diff H0..HEAD son 26 lineas anadidas, 0 borradas. La seccion `## Enmienda #243 — Orbit es un cachorro` es **identica byte a byte** al literal de design.md §4 con `Fecha: 2026-11-06` (comprobado por script). Aparece una sola vez, es el ultimo `##` del fichero.
- [x] Casilla G4 de la enmienda: `- [ ] Enmienda #243 aprobada por humano` (sin marcar); el test usa `[ xX]`.

## Verificacion independiente (re-ejecutada por el reviewer)
- Script de design.md §2 a directorio temporal: `exit=0`, diez filas `ok`; bytes, margenes y alfa minimo iguales a la tabla de design.md. Los diez sha256 coinciden con requirements.md §Constantes («nuevo») y `cmp` byte a byte contra los WebP del repo: identicos. `convert-orbit.py` del repo es identico al bloque Python de design.md §2.
- `sha256sum` de los diez WebP del repo = columna «nuevo»; de los once PNG de `design-src/` = columna «fuente». Cabecera de los diez: `RIFF/WEBP/VP8X`, alfa, no animado, 1024 x 1024, 25882 a 45710 B (< 100000).
- Suites (desde `mobile-pet-tracker/`, `bunx jest --runTestsByPath` de las 13 rutas de tasks.md §Verde de la cadena + `home-photo-hero-canvas`): `Test Suites: 13 passed, 13 total`, `Tests: 512 passed, 512 total`, exit 0. `bun run typecheck`: exit 0 (con `test ! -e .expo/types/router.d.ts`). Lint no re-ejecutado por mí (el reporte de Codex lo da en verde, log vacío); los cambios de código son solo un test y una linea de `exceptions`.
- Guardas con H0:
  - `assets`: exactamente las diez rutas `images/orbit-<pose>.webp` (R7).
  - `src`: exactamente `orbit-cachorro-art.test.ts` y `orbit-rename.test.ts` (R5 + Enmienda 1). El diff de `orbit-rename.test.ts` es +1 linea, la entrada `{ file: '__tests__/orbit-cachorro-art.test.ts', snippet: "'antena', 'Pingo', 'diez poses'", lines: 1 }` literal de la spec.
  - Fuera de `mobile-pet-tracker|specs|progress|docs/ui-guidelines.md`: vacio. `package.json`/`bun.lock`: vacio. Solo cambia `docs/ui-guidelines.md` bajo `docs/`.
- Mutaciones plantadas y revertidas por mí (cada una vista en rojo; al final `git status --short` vacio y `git diff --cached` vacio, sha256 de los diez WebP restaurados):
  - M1 (arte viejo de `talk`): rojo en R2 fila `talk` y R2 «ningun fichero conserva el arte viejo».
  - M2 (zona ciega, reconvertir sin `clean`): el script sale con `exit=1` y `FALLA` en las diez poses (alfa minimo 1, margenes 0); copiado el `talk` sin limpiar al repo: rojo en R2 `talk`.
  - M8 (zona ciega, `sleep` desde la fuente original sin reescalar `pingo-sleep.png`): el script da `ok` (margenes 29/222/35/224 >= 24, tal como prevé la spec), jest rojo solo por el pin de R2 `sleep`. Confirma que el pin ve lo que el resto no.
  - M4 (`orbit-worried.webp`): rojo en R1 «son las unicas».
  - M9 (`orbit-old.webp` con arte viejo): rojo en R1 (lista) y R2 (arte viejo presente).
  - M6 (un byte anadido a `orbit-food.png`): rojo en R3 fuentes (food).
  - M7 (`quality=82` en el script): rojo en R3 script.
  - M10 (duplicar la seccion), M11 (quitar «Pingo» del cuerpo), M12 (`## Notas` posterior): rojo en R6 las tres.
  - Enmienda 1: quitar la entrada de `exceptions` -> rojo `#225 R4: el codigo de test solo nombra a Pingo…`; `lines: 2` -> rojo `#225 R4: cada excepcion casa exactamente las lineas declaradas`.
  - M3, M5 y M13 no las re-planté yo (cubiertas por la misma ruta que M1/M2 y por la guarda R7, que verifique directamente: solo las diez rutas); el reporte de Codex las trae con salidas.

## Observaciones
1. (No bloqueante) Los `it.each` de R1 llevan el titulo de la spec con un sufijo ` (%s)`; la traza cita el titulo base. Coherente con `it.each`, sin accion.
2. (No bloqueante) Tras la mutacion M8, la lectura de vuelta del script no distingue `sleep` sin reescalar (margen >= 24), exactamente como dice design.md §5; el unico candado es el pin sha256 de R2. Es el diseno aceptado (D5, D9).
3. (Pendiente del leader/humano, fuera del veredicto) `./init.sh` completo (suite entera, backend + e2e) lo corre el leader; el smoke G2 pasos 1 a 6 (incluye D7, el salto `wave` -> `wave-blink`, y el recorte de `sleep`) y la marca de la casilla `Enmienda #243 aprobada por humano` de la carta son del humano. G6 (icono/splash) queda fuera por D4.
4. No hay rechazos: no se encontraron regresiones, filas pendientes ni tests sin R-id.
