# review: mobile-pairing-pingo-canvas-fidelity (#188)
Fecha: 2026-10-19T23:19:19+00:00
Veredicto: RECHAZADO
HEAD revisado: 1ec2046d (base H0 6dc51ca1)
Rama: feature/188-mobile-pairing-pingo-canvas-fidelity
Worktree: /home/claude/sites/Pet-Tracker-wt-188

Revisión de solo lectura. Único fichero escrito: este reporte. No se editó código ni se hizo commit ni push. `./init.sh` no lo ejecutó el reviewer (denegado por el clasificador); el extracto de init viene de `progress/init-188.log` y `progress/init-188.exit`.

Casillas abiertas: C2 (1), C4 (puntos 2 a 5) y C5 (1). CHECKPOINTS.md:124 obliga a rechazar con cualquier casilla vacía. H1, H2 y H3 quedan sin marcar: son verificación humana en dispositivo.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json:3400` es la única entrada `in_progress` (188).
- [ ] progress/current.md actualizado: `progress/current.md:11` dice «Pendiente: re-init sobre el nuevo HEAD y `reviewer` después». No refleja el init final (exit=0) ni este veredicto. Lo actualiza el leader, pero la casilla sigue vacía.
- Árbol: `git status --short` muestra `M progress/current.md`, `M progress/handoff_mobile-pairing-pingo-canvas-fidelity.md` y `?? progress/init-188.exit`. Ningún fichero de código sin commitear.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: el diff móvil (8 ficheros) no toca capas de dominio. Los imports nuevos, `@/components/ping-ring` en `mobile-pet-tracker/src/screens/pairing/index.tsx:26` y en `mobile-pet-tracker/src/screens/welcome/index.tsx:21`, son de presentación.
- [x] repositories/contratos en domain son interfaces puras: sin cambios en contratos ni en `api/`.
- [x] application depende de interfaces, no implementaciones: sin cambios en esa capa.
- [x] infrastructure sin lógica de negocio: sin cambios en infraestructura. El diff de `pairing/index.tsx` es maquetación, animación y copy.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra: 14 de 14 (tabla más abajo).
- [ ] El historial muestra test-primero (test rojo, implementación, verde): R9, R11, R12 y R14 no tienen commit rojo válido (C4-1, C4-2). R6 tiene un rojo inválido (C4-3).
- [ ] Punto 3, requisitos de verificación con vía (a) o (b) declarada antes del handoff: R9, R11 y R14 (C4-1). R12 tampoco declara vía (C4-2).
- [ ] Punto 4, ningún commit rojo falla por un helper inexistente: R6, commit `76bc928b` (C4-3).
- [ ] Punto 5, candado sobre código correcto con mutación de producción versionada en el commit rojo: R9, R11, R12 y R14 (C4-1, C4-2).

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas «pendiente»: 14 filas, ninguna con «pendiente». Los 30 hashes de la tabla existen como commit (`git cat-file -t`).
- [ ] Commits siguen el formato `feat(<scope>): <desc> (R-ids)`: 8 commits sin `(R<n>)` y tipos `test` y `docs` fuera de `docs/conventions.md` §Commits (M-2).

## Checklist C6 — Spec aprobada
- [x] requirements.md con status approved y casilla humana marcada: L3 `status: approved`; L119 `[x] Aprobado por humano (fecha: 2026-10-19)`; L127 `[x] E1 aprobada por humano`.
- H1, H2 y H3 (L128-130) están `[ ]`. Solo los marca el humano.

## Checklist C7 — Sin código huérfano
- [x] Componentes reemplazados eliminados: la función local `PingRing({ index })` de `welcome/index.tsx` ya no existe. El fichero solo tiene el import (L21) y el uso (L90) del componente compartido.
- [x] Sus tests eliminados: la función local no se exportaba y no tenía test propio. `welcome/index.test.tsx` no cambia.

## Checklist C8 — Móvil (UI)
- [x] Sin hex fuera de src/theme ni clases con corchetes: `mobile-pet-tracker/src/__tests__/pairing-canvas-fidelity.test.ts:69` (R12) está verde sobre `pairing/index.tsx` y `ping-ring.tsx`. En las líneas añadidas solo aparecen corchetes de arrays JS (`[0, 1, 2]`, `[{ scale: ... }]`); ninguna clase `className` lleva corchetes.
- [x] Sin StyleSheet.create, shadow ni elevation en las líneas añadidas.
- [x] Skeleton y no Spinner; useSafeAreaInsets: `pairing/index.tsx:6` (Skeleton) y `:16` (useSafeAreaInsets).

## Excepciones del handoff (1-5)

| # | Qué | Commit | Comprobado |
|---|---|---|---|
| 1 | Aserción previa #95 R6 de `index.test.tsx`: padding de `pairing-form` pasa de `padding: 24` a `paddingHorizontal: 20` y `paddingVertical: 24` (handoff:69) | `e2194c67` | Sin otra modificación de aserciones previas (traceability.md:33) |
| 2 | design-drift: `padding: 24` pasa a `paddingHorizontal: 20` y `paddingVertical: 24` | `e2194c67` | Diff de 3 líneas en `design-drift.test.ts`; excepción nombrada en `docs/conventions.md:630` |
| 3 | Selector R2 sin sintaxis de corchetes | `53e9af61` | `index.test.tsx:1096` |
| 4 | Cabecera `#188 R1-R14: pairing canvas fidelity` | `0c717e29` | `index.test.tsx:1060` |
| 5 | `getAnimatedStyle` desde el entry público de react-native-reanimated | `c0e2c93a` | `index.test.tsx:14` |

Las cinco aparecen en el handoff y en `progress/impl_mobile-pairing-pingo-canvas-fidelity.md:158`. Las autoriza el leader, no el humano (M-4).

## Test-primero por requisito

| R | Test (archivo:línea) | Rojo | Verde | Estado |
|---|---|---|---|---|
| R1 | index.test.tsx:1071 | 9dc36944 | af257a8b | OK |
| R2 | index.test.tsx:1086 | ef7cd9e3 | 5f24b361 (selector: 53e9af61) | OK |
| R3 | index.test.tsx:1102 | ebf21c95 | 9f831ea3 (tras E1 firmada en 1cc2a08f) | OK. bb598dbf deja la suite en 150/151 |
| R4 | index.test.tsx:1137 | 6e5bb3f9 | 3d39f276 | OK |
| R5 | index.test.tsx:1154 | 47363b97 | aa4687b9 | OK |
| R6 | index.test.tsx:1177 | 76bc928b (inválido: `findAllByType`); 150dcf8d (corregido) | 598af73d | INCUMPLE punto 4 (C4-3) |
| R7 | index.test.tsx:1189 | 3e0e36cd | 0c717e29 (bcebe008 deja 252/254) | OK con M-3 |
| R8 | index.test.tsx:1200 | 252e7e29 | ee3fbc93 | OK |
| R9 | index.test.tsx:1231 | ninguno; e5716f2f es NV y nace verde (81/81) | ninguno | INCUMPLE puntos 3 y 5 (C4-1) |
| R10 | index.test.tsx:1252 | 97f2b146 | e2194c67 | OK |
| R11 | pairing-canvas-fidelity.test.ts:24 | ninguno; 68fb1458 es NV | c0387881 (refactor) | INCUMPLE puntos 3 y 5 (C4-1) |
| R12 | pairing-canvas-fidelity.test.ts:69 | ninguno; 94cea37c es único y nace verde (243/243) | 94cea37c | INCUMPLE puntos 3 y 5 (C4-2) |
| R13 | ping-ring.test.tsx:18 | a479c7f7 | d9d98844 | OK |
| R14 | index.test.tsx:1273 | ninguno; f820d669 es NV y nace verde (88/88) | ninguno | INCUMPLE puntos 3 y 5 (C4-1) |

## Hallazgos por severidad

### CRITICO

**C4-1. R9, R11 y R14 sin vía de C4 (puntos 3 y 5).**
- Archivo:línea: `specs/mobile-pairing-pingo-canvas-fidelity/tasks.md:83` (R9), `:97` (R11) y `:107` (R14); commits `e5716f2f`, `68fb1458` más `c0387881`, `f820d669`; tests `index.test.tsx:1231` y `:1273`, `pairing-canvas-fidelity.test.ts:24`.
- Qué falla: los tres prevén solo «puede nacer verde: anotarlo como NV». CHECKPOINTS.md:46-47 define como requisito de verificación el que «asevera una propiedad de artefactos que otro requisito anterior ya dejó en el árbol», y estos lo son: R9 sobre R6/R8 y D5(a), R11 sobre R6/R8 y R14 sobre R1/R2/R4 (`traceability.md:19`, `:21`, `:24`). Ninguno declara la vía (a) ni la (b) antes del handoff. Son candados sobre código correcto, así que el punto 5 exige una mutación de producción versionada en un commit rojo. `progress/impl_mobile-pairing-pingo-canvas-fidelity.md:97-101` no describe ninguna mutación ni rojo. NV no es ruta de C4.
- Qué cambiar, decisión humana: (1) excepción firmada por el humano para R9, R11 y R14, con precedente en CHECKPOINTS.md:64-66, con mutación de producción ejecutada y su rojo por aserción en el reporte de una nueva revisión; o (2) enmienda de la spec aprobada por el humano que declare la vía (b) con esa misma evidencia. No reescribir historia.

### ALTO

**C4-2. R12 (`94cea37c`): mutación revertida antes del commit y nunca versionada (punto 5; punto 3 sin vía declarada).**
- Archivo:línea: `mobile-pet-tracker/src/__tests__/pairing-canvas-fidelity.test.ts:69`; `specs/mobile-pairing-pingo-canvas-fidelity/tasks.md:101`; `progress/impl_mobile-pairing-pingo-canvas-fidelity.md:105-119`.
- Qué falla: `impl:114` revierte `className="w-[3px]"` «antes de cualquier commit». `git log -S 'w-[3px]' 6dc51ca1..HEAD -- mobile-pet-tracker/` no devuelve ningún commit. La cadena solo aparece en commits de documentación (`22aff2e9`, `847cff9d`, `bf7af15e`, `db4b8841`, `863da0dc`). `94cea37c` es el único commit de R12 y nace verde. `tasks.md:101` prescribe ese mismo flujo, en conflicto con el punto 5, que exige la mutación en el commit rojo. Este reviewer no reproduce el rojo a nivel jest. En memoria solo verificó que el regex detecta `className="w-[3px]"`, exime `#188 R1` y detecta `#fff`.
- Qué cambiar, decisión humana: excepción firmada que resuelva el conflicto entre `tasks.md:101` y CHECKPOINTS C4 punto 5, con la mutación repetida y su rojo por aserción en el reporte de una nueva revisión. No reescribir historia.

**C4-3. R6 (`76bc928b`): rojo por API inexistente (punto 4).**
- Archivo:línea: commit `76bc928b`, diff línea 35 (`+ const texts = form.findAllByType(Text);`); `150dcf8d`, diff línea 24 (`-`); `progress/impl_mobile-pairing-pingo-canvas-fidelity.md:160` (`findAllByType` no disponible en RNTL 14).
- Qué falla: según `impl:160` el rojo de `76bc928b` fue un error de invocación de la API, no una aserción. El punto 4 prohíbe ese tipo de rojo. Atenúa el riesgo que `150dcf8d` (rojo corregido, `traceability.md:16`) sí aporta un rojo posterior.
- Qué cambiar, decisión humana: excepción firmada que documente la desviación. No reescribir historia.

### MEDIO

**M-1. Lint sin evidencia que separe verde de SIGKILL.**
- Archivo:línea: `progress/lint-188.log` y `progress/lint-188-exc5.log` (0 bytes ambos); `progress/init-188.log:60595-60596` (`$ expo lint` sin salida y luego «Lint sin errores»); `init.sh:270-286` (el marcador se imprime tras `eval` sin mirar el contenido; `set -e` en la línea 4).
- Qué falla: un `expo lint` matado por OOM sale 0 y no escribe nada, igual que uno limpio. `impl:141` y `impl:205` lo reconocen. `impl:203` anota que, según el encargo, un log sin la línea «sin errores» es fallo, y deja la decisión abierta; `traceability.md:37` registra el paso con log vacío. Sin salida distinguible, el verde no queda demostrado.
- Qué cambiar: relanzar lint sobre HEAD guardando una salida que demuestre que eslint terminó, o que el humano acepte el riesgo por escrito.

**M-2. C5: commits sin R-ids y tipos fuera de la convención.**
- Archivo:línea: `docs/conventions.md:353-364` (solo lista `feat`, `fix` y `refactor`); `progress/handoff_mobile-pairing-pingo-canvas-fidelity.md:51` (prescribe un commit `docs` sin R-id).
- Commits sin `(R<n>)`: `22aff2e9`, `847cff9d`, `bf7af15e`, `db4b8841`, `3082ff68`, `863da0dc`, `4fb7fd9a`, `1cc2a08f`. Historial: 39 commits en `6dc51ca1..HEAD`.
- Qué cambiar: alinear `docs/conventions.md` con los tipos realmente usados, o corregir los commits nuevos. No reescribir historia.

**M-3. Implementaciones que dejan la suite en rojo.**
- Commits: `bb598dbf` (150/151), `bcebe008` (252/254), `53e9af61` (253/254 tras la excepción 3). Documentado en `impl:158`.
- Qué falla: el verde llega en un commit posterior. No es rechazo por sí solo. Se cuenta en C4 punto 2.

**M-4. Excepciones 1-5 autorizadas por el leader, sin firma humana.**
- Archivo:línea: handoff §Excepciones; `impl:158`; `docs/conventions.md:630`; `mobile-pet-tracker/src/__tests__/design-drift.test.ts` (3 líneas, excepción 2).
- Ninguna toca un punto de C4 ni cambia una aserción de un requisito ya cerrado, salvo las listadas. La excepción 2 cambia un guard compartido. Recomiendo que el humano confirme las cinco junto con la decisión de C4-1 a C4-3.

### BAJO

- **B-1.** `progress/current.md:11` desactualizado (ya en C2). La cabecera (`progress/impl_…md:1-3`) y el Cierre (`:123-144`) describen typecheck FALLA (exit 2), superado por `c0e2c93a` y por `progress/init-188.exit` (`exit=0`). `impl:181` afirma un marcador `.done` que no existe: `progress/.done` está ausente.
- **B-2.** Árbol sin commitear: `progress/current.md` y `progress/handoff_…md` modificados, `progress/init-188.exit` no rastreado. No afecta al código.
- **B-3.** `mobile-pet-tracker/src/screens/pairing/index.test.tsx:1118`: `expect(ring0).toHaveAnimatedStyle({ opacity: style.opacity, transform: [{ scale }] } …)` compara el valor con el que acaba de leer. Es circular y no debilita R3: las cotas de 1114-1117 y las aserciones de 1121-1131 (claves exactas, E1 a 2401 ms) sostienen el requisito.
- **B-4.** `mobile-pet-tracker/src/components/ping-ring.tsx:16-28`: un cambio de reduce motion a mitad de vida no se da en producción, porque `useReducedMotion` es constante por proceso (`node_modules/react-native-reanimated/src/hook/useReducedMotion.ts:4, 17-18`). Solo afecta a tests.
- **B-5.** `specs/mobile-pairing-pingo-canvas-fidelity/requirements.md:101` (Supuestos) se reformuló en `4fb7fd9a`, la propuesta de E1, fuera de la sección E1. La firma `1cc2a08f` es posterior. Confirmar con el humano que la firma lo cubre.

## Output de ./init.sh
El reviewer no ejecutó `./init.sh`. Extracto de `progress/init-188.exit` y `progress/init-188.log`, generado por la ejecución del implementer o del leader sobre HEAD `1ec2046d`:

```
exit=0                                                                      (progress/init-188.exit)
backend:  Test Suites: 187 passed, 187 total / Tests: 1474 passed, 1474 total   (líneas 220-221)
infra:    Test Suites: 2 passed, 2 total / Tests: 14 passed, 14 total           (líneas 233-234)
aviso:    "A worker process has failed to exit gracefully" (preexistente, no es fallo)  (línea 60255)
mobile:   Test Suites: 122 passed, 122 total / Tests: 4027 passed, 4027 total   (líneas 60257-60258)
e2e:      Test Suites: 3 skipped, 30 passed, 30 of 33 total / Tests: 8 skipped, 468 passed, 476 total (líneas 60579-60580)
lint:     "Lint sin errores" (línea 60596; ver M-1)
typecheck: "Typecheck sin errores" (línea 60600)
Coincidencias de "Failed to run", "SIGKILL" o "ELIFECYCLE": 0
```

Cifras consistentes: 4027 = 3994 + 32 + 1, según `traceability.md:37` y `impl:140`.

## Verificado sin hallazgo
- Alcance: `git diff --name-only 6dc51ca1..HEAD -- mobile-pet-tracker/` son 8 ficheros: `src/screens/pairing/index.tsx`, `src/screens/pairing/index.test.tsx`, `src/components/ping-ring.tsx` (nuevo), `src/components/__tests__/ping-ring.test.tsx` (nuevo), `src/screens/welcome/index.tsx`, `src/__tests__/pairing-canvas-fidelity.test.ts` (nuevo), `src/__tests__/design-drift.test.ts` y `src/theme/global.css`. Sin cambios en backend, infra ni e2e.
- `git diff --check 6dc51ca1..HEAD`: exit 0.
- 14 requisitos con test que nombra su R-id (tabla de arriba). R13 con retardos 800 y 1600 (`ping-ring.test.tsx:18`).
- R3 usa los valores de E1 (2401 ms) en `index.test.tsx:1121-1131`. La firma `1cc2a08f` (21:15:56) precede al commit que aplica la enmienda, `9f831ea3` (21:18:36).
- R10 cubierto por la excepción nombrada de `docs/conventions.md:630`.
- `PingRing` compartido en `pairing` y `welcome`; la copia local de welcome se eliminó (C7).
- H1, H2 y H3 sin marcar en ningún documento.

## Límites de la revisión
- No se ejecutó `./init.sh` ni la suite completa de jest, por restricción del clasificador y del encargo.
- R12: la comprobación en memoria solo verificó el regex. El rojo a nivel jest está documentado en `impl:105-119` y no se repitió.
- Lint y typecheck se leen de `progress/init-188.log`; no se puede separar verde de SIGKILL (M-1).
- E2E: los 8 skips no se comparan con H0. No hay log H0 de e2e y el diff no toca e2e.
- Fidelidad visual y 60 fps no se acreditan por tests (H1-H3).
- Durante la revisión se creó y borró `.git-subjects-tmp` dentro del worktree para listar asuntos de commits. Incumple la única escritura permitida durante unos segundos. Se comprobó que ya no existe y no altera el repo.

## Pendientes (no los marca el reviewer)
- H1, H2 y H3 en dispositivo (`requirements.md:128-130`): los marca solo el humano.
- Decisión sobre C4-1, C4-2 y C4-3: excepción firmada o vía declarada, y nueva revisión con la evidencia de mutación.
- Confirmar excepciones 1-5 (M-4) y la reformulación de Supuestos (B-5).
- Lint con evidencia (M-1), formato de commits (M-2) y `progress/current.md` (B-1).
- Merge del PR #232 por el humano. Push no autorizado.
- Hasta un nuevo veredicto APROBADO, `feature_list.json` no se marca `done`.
