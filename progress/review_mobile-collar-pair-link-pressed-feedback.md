# review: mobile-collar-pair-link-pressed-feedback (#138)
Fecha: 2026-09-30T01:49:19Z
Veredicto: APROBADO

- Revisado: `feature/138-mobile-collar-pair-link-pressed-feedback`, HEAD
  `cb60bba832789ca633e334d078fcf2486225e7b9`. Al empezar y al acabar la
  revisión, `git rev-parse HEAD` y `git branch --show-current` daban lo mismo,
  y `git status --porcelain` salía vacío en el worktree principal.
- Base: `76849396`, merge-base con `origin/main`. `origin/main` está ahora en
  `343e3fbe` (#137).
- Handoff: `508e350d`. Firma de la spec: `22b71872`.
- `init.sh` lo corrió el leader. Aquí se lee su log; el reviewer no lo
  relanzó, por instrucción expresa.
- Skills del reviewer: `expo:expo-overview`. C8 se evalúa contra
  `docs/ui-guidelines.md`.

## Bloqueantes

Ninguno.

## Checklist C1 — Arnés
- [x] N/A. No es la primera feature del proyecto.

## Checklist C2 — Estado coherente
- [x] Solo una feature in_progress. `feature_list.json` → `[(138, 'in_progress')]`.
- [x] `progress/current.md` actualizado: cita #138, la branch, la base
      76849396, el gate de Notion aprobado y el handoff a Codex.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure. N/A: el cambio es solo de
      presentación, en `src/screens/home/index.tsx`, y no toca ninguna capa de
      backend.
- [x] Contratos de domain como interfaces puras. N/A, por lo mismo.
- [x] application depende de interfaces. N/A, por lo mismo.
- [x] infrastructure sin lógica de negocio. N/A. No hay imports nuevos: el
      diff de producción es de +4/−1 líneas y solo cambia la prop `style`.

## Checklist C4 — TDD
- [x] Cada R-id con test tiene al menos un test que lo nombra.
  - R1: `#138 R1: el botón baja a opacidad 0.8…`.
  - R2: `#138 R2: en reposo, el botón lleva rounded-xl…`.
  - R3: los tres `it` enmendados de `consistency-classnames.test.ts`, con
    comentarios `#138 R3`.
  - R4 y R5 no tienen test, por diseño (traceability §Requisitos sin test
    propio).
- [x] Historial test-primero por la vía a: tres rojos de solo test, un verde
      de solo la Home y el commit de docs. Cada rojo lo midió el reviewer en
      un worktree aparte (ver Evidencia §2).
- [x] Ningún rojo falla por `ReferenceError` ni por un doble mutado. Todos
      caen por aserción (`toEqual` o `toHaveLength`).

## Checklist C5 — Trazabilidad
- [x] En `traceability.md` no queda ninguna fila «pendiente» entre R1 y R4.
      R5 queda «pendiente (firma del humano…)» a propósito: lo cierra el
      humano después del veredicto.
- [x] Los commits siguen el formato de tasks.md: `test(mobile): … (R<n>)`,
      `feat(mobile): … (R1,R2,R3)` y `docs(mobile): … (R4)`.
- [x] Los cuatro hashes citados son ancestros de HEAD (`is-ancestor=0`), y
      R4 cita el verde común 828aade3.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla humana marcada
      (2026-09-29). La firma es `22b71872` («firma via Notion»).
- [x] Desde la firma solo cambió `traceability.md` dentro de `specs/`, y solo
      pasó de pendiente a hash en R1–R4.

## Checklist C7 — Sin código huérfano
- [x] N/A. Esta feature no reemplaza nada: añade feedback de pulsado a un
      `Pressable` existente.

## Checklist C8 — UI móvil (docs/ui-guidelines.md)
- [x] Grep-clean. En las líneas añadidas a la Home no hay hex, clases
      arbitrarias (`-[`), `StyleSheet`, shadow ni elevation (`hex=0 arb=0
      shadow=0`).
- [x] Dimensiones de pantalla. N/A: no se tocan el layout ni las safe areas.
- [x] Skeleton. N/A: no hay estados de carga nuevos.
- [x] Reutiliza `CONTINUOUS_CORNER` de `src/theme/native-styles.ts` sin
      forks. La receta es la misma que la de los tiles de #136.
- [x] Tappable con feedback pressed (opacidad 0.8) y touch target ≥ 44pt
      (`min-h-11`, className sin cambios; `grep -cxF` = 1). Así se cierra la
      micro-regla §198–199 para `collar-pair-link`.
- [x] Animaciones. N/A: el cambio es de opacidad instantánea, sin Reanimated,
      `useState`, escala ni háptica. El grep de esos términos en las líneas
      añadidas da 0.

## Observaciones (no bloqueantes)

1. **Skill fuera del handoff.** Codex cargó `ponytail` (full), que el handoff
   no pedía (handoff §REGLAS CRITICAS pide solo `building-native-ui` y
   `appllama-app-design-skill`). No dejó huella: los blobs finales de la Home,
   el test y la consistencia coinciden byte a byte con los que fija tasks.md
   (0d439ebc, d9190558 y b6c352b5), y no hay decisiones fuera de los
   literales. `animate-expo` no se cargó, como exigía el handoff.
2. **Versión del plugin de Codex (B5).** El reporte dice que el SKILL.md de
   `building-native-ui` instalado declara la versión 1.0.1, pero el handoff
   asume el catálogo v1.0.2. Es informativo y encaja con la deuda B5. Conviene
   que el leader revise la tabla de equivalencias de `leader.md` §Catálogo
   real de skills de Codex.
3. **Legibilidad del reporte.** En `impl_…md` (líneas 235–249), los datos
   medidos de las sondas van concatenados dentro de la columna «Spec y
   exigido» con `<br>`, en vez de en una columna «medido» aparte como pide
   tasks.md §Sondas punto 4. Además, en `rounded_2xl` y `constant` la línea
   `>` lleva una etiqueta genérica. Los datos son correctos: el reviewer los
   re-midió y coinciden en las 15 filas.
4. **Ancla de R4.3 desplazada.** R4.3 mide el diff contra `origin/main...HEAD`.
   `origin/main` avanzó a 343e3fbe (#137) y el merge-base sigue siendo
   76849396, así que el diff de producción medido contra la base es el de la
   spec. #137 solo toca `src/hooks/use-push-registration.test.tsx` en
   `mobile-pet-tracker/`, y `git merge-tree --write-tree origin/main HEAD` da
   exit=0, sin conflictos.
5. **Sangría previa.** El bloque `<Pressable>` de `collar-pair-link` tiene una
   sangría irregular: `<Pressable` a 20 espacios, las props a 22 y `>` a 16.
   Viene de 97136ad9 y no la introduce #138. Las mutaciones de la spec se
   anclan en esa sangría a propósito. Si alguien la normaliza más adelante,
   caducarán los blobs y literales de tasks.md.
6. **Ruido en el log de init.** El aviso `A worker process has failed to exit
   gracefully…` (línea 20337 del log) y los `ERROR` de Nest de los tests del
   backend son ruido que ya existía. Las suites terminan en verde.
7. **Pendiente para el humano y el leader.** Queda la casilla de R5 (prueba de
   humo en dev build de Android) y, al cerrar, el tablero de Notion
   (Implementado / Completado). #138 no pasa a `done` sin R5.

## Evidencia

### 1. Diff acotado

```
$ git diff --stat 508e350d cb60bba8
 5 files changed, 771 insertions(+), 11 deletions(-)
   (consistency-classnames.test.ts 16, index.test.tsx 69, index.tsx 5,
    impl_…md 684, traceability.md 8)

$ git diff --numstat 76849396 cb60bba8 -- mobile-pet-tracker/
10  6  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
69  0  mobile-pet-tracker/src/screens/home/index.test.tsx
4   1  mobile-pet-tracker/src/screens/home/index.tsx
```

Blobs por commit (`git rev-parse <c>:<ruta>`):

| Commit | Home | test | consistencia | native-styles |
|---|---|---|---|---|
| 76849396 (base) | cb61d0c6 | 04135c8e | e62f88ad | 4e5939f9 |
| 6dc6570b (rojo R1) | cb61d0c6 | cd94d1d5 | e62f88ad | 4e5939f9 |
| 22309656 (rojo R2) | cb61d0c6 | d9190558 | e62f88ad | 4e5939f9 |
| d9878554 (rojo R3) | cb61d0c6 | d9190558 | b6c352b5 | 4e5939f9 |
| 828aade3 (verde) | 0d439ebc | d9190558 | b6c352b5 | 4e5939f9 |
| cb60bba8 (docs) | 0d439ebc | d9190558 | b6c352b5 | 4e5939f9 |

Todos coinciden con tasks.md. Por commit, `git show --stat` da:

- 6dc6570b: solo el test, +46.
- 22309656: solo el test, +23.
- d9878554: solo la consistencia, +10/−6.
- 828aade3: solo la Home, +4/−1.
- cb60bba8: solo `progress/impl_…md` y `traceability.md`.

Diff de producción de la Home:

```
+                      style={({ pressed }) => ({
+                        ...CONTINUOUS_CORNER,
+                        opacity: pressed ? 0.8 : 1,
+                      })}
```

`git diff --exit-code 76849396 cb60bba8` da exit=0 sobre:

- `package.json` y `bun.lock`;
- `catalog.ts`, `language-provider.test.tsx` y `ui-copy-table.ts`;
- `native-styles.ts` y `design-drift.test.ts`;
- `docs/ui-guidelines.md`.

No hay dependencias nuevas.

### 2. C4: rojos medidos por el reviewer

Se hizo en un worktree desacoplado del scratchpad, con `node_modules`
enlazado. Ya está borrado (`git worktree remove`), y en `git worktree list`
no queda.

Comando: `bunx jest --runTestsByPath <fichero> > log 2>&1; echo exit=$?`.

```
6dc6570b  src/screens/home/index.test.tsx
  exit=1  Tests: 1 failed, 167 passed, 168 total
  ● … › #138 R1: …   expect(received).toEqual(expected)   > 951 (reposo)
  Received {borderCurve:'continuous'}, sin opacity

22309656  src/screens/home/index.test.tsx
  exit=1  Tests: 2 failed, 167 passed, 169 total
  ● #138 R1  toEqual  > 951 (reposo)
  ● #138 R2  toEqual  > 1002 (style; la aserción del radio, en 1001, ya pasa)

d9878554  src/__tests__/consistency-classnames.test.ts
  exit=1  Tests: 2 failed, 51 passed, 53 total
  ● #62 R14 › screens/home/index.tsx importa y aplica sus 0 esquinas
      expect(received).toHaveLength(expected)  > 288   (Expected 0, Received 1)
  ● #98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
      expect(received).toHaveLength(expected)  > 394
  ✓ fusiona la esquina una vez y la entrega a las dos ramas de Card

828aade3  los dos ficheros
  exit=0  Test Suites: 2 passed, 2 total  Tests: 222 passed, 222 total
```

### 3. Literales

- Los dos `it` nuevos van al final del describe `R10 (mobile-device-pairing)`,
  y los tres `it` de R3 están enmendados. No se tocó ningún `it` que ya
  existiera en el test de la Home, y no hay imports nuevos. Los blobs
  coinciden con tasks.md.
- Greps en el árbol final:
  - `#138` suelto: 0 en el test y 0 en la consistencia.
  - `#138 R[1-3]`: 6 en el test y 3 en la consistencia.
- `directUses` solo se usa en el `it.each` (l. 281) y en la suma (l. 313),
  que es `33 + 1 + 1 - 1 - 1`.

### 4. Sondas: las 15, re-medidas por el reviewer

Se midieron sobre 828aade3, una cada vez. Los dos ficheros van juntos (222
tests) y se restaura con `git checkout HEAD -- <ruta>`. Después de cada
restauración, `git status --porcelain -- mobile-pet-tracker/src` y
`git diff --cached --name-only` salen vacíos. Los logs están en el scratchpad,
en `r138_probe_<sonda>.log`.

| Sonda | Blob | exit | Tests | Rojos (matcher, línea `>`) | Spec | Codex |
|---|---|---|---|---|---|---|
| norecipe | cb61d0c6 | 1 | 4 failed / 218 | #62 R14 0 esquinas (toHaveLength, 288); #98 R10 (toHaveLength, 394); #138 R1 (toEqual, 951 reposo); #138 R2 (toEqual, 1002) | = | = |
| pressed07 | 3b0d41bd | 1 | 1 failed / 221 | #138 R1 (toEqual, 963 pulsado) | = | = |
| rest09 | 2e696c30 | 1 | 2 failed / 220 | #138 R1 (951), #138 R2 (1002), toEqual | = | = |
| nocorner | 0fe120e5 | 1 | 2 failed / 220 | #138 R1 (951), #138 R2 (1002), toEqual | = | = |
| pressnocorner | 3e128e46 | 1 | 1 failed / 221 | #138 R1 (toEqual, 963 pulsado) | = | = |
| restnocorner | 95c251ad | 1 | 2 failed / 220 | #138 R1 (951), #138 R2 (1002), toEqual | = | = |
| stray | b254ce12 | 1 | 2 failed / 220 | #138 R1 (951), #138 R2 (1002), toEqual | = | = |
| nostyle | f9751976 | 1 | 2 failed / 220 | #138 R1 (951), #138 R2 (1002), toEqual | = | = |
| array | 5c49aa16 | 1 | 2 failed / 220 | #138 R1 (951), #138 R2 (1002), toEqual | = | = |
| sticky | 4c681b1a | 1 | 1 failed / 221 | #138 R1 (toEqual, 977 `waitFor` tras responderTerminate) | = | = |
| hidden | e2527453 | 1 | 4 failed / 218 | shows the pair action… (consulta: `Unable to find an element with testID: collar-pair-link`, 911); does not show… (toBeNull, 936); #138 R1 (consulta, 947); #138 R2 (consulta, 993) | = | = |
| rounded_full | 07d4f8a1 | 1 | 1 failed / 221 | solo #138 R2 (toEqual, 1001 radio) | = | = |
| rounded_2xl | 8c5593f8 | 1 | 3 failed / 219 | #62 R4 rounded-2xl (toEqual, 148); #98 R10 (toEqual, 401); #138 R2 (toEqual, 1001 radio) | = | = |
| constant | e2930ec1 | 1 | 5 failed / 217 | #62 R14 declara las dos constantes (toContain, 273); #138 R1 (951); #138 R2 (1002); #81 R3 (2762); #136 R1 (2783), toEqual | = | = |
| ios_only | 8518c92e | 0 | 222 passed | ninguno. Punto ciego declarado: jest corre como iOS; lo cubre R5 | = | = |

Correspondencia de líneas en el test final:

- 951: primera aserción en reposo.
- 963: aserción en pulsado, tras `responderGrant`.
- 977: `waitFor`, tras `responderTerminate`.
- 1001: radio (`toEqual(['rounded-xl'])`).
- 1002: `style` de R2.

Las 15 filas coinciden con la tabla «Spec y exigido» de tasks.md y con lo que
reporta Codex: mismo blob, `exit`, cuentas y líneas `>`.

### 5. Greps de R4 (árbol final)

Todos coinciden con la columna final de tasks.md §R4.

En la Home:

| Grep | Resultado |
|---|---|
| `style={CONTINUOUS_CORNER}` | 0 |
| `...CONTINUOUS_CORNER,` | 2 |
| `opacity: pressed ? 0.8 : 1` | 4 |
| `CONTINUOUS_CORNER` | 3 |
| testID `collar-pair-link` | 1 |
| onPress `/pairing` | 1 |
| className exacto (`-x`) | 1 |
| stylesheet | 0 y 0 |

En el repo: `style={CONTINUOUS_CORNER}` da 31.

En el test y la consistencia:

| Grep | Resultado |
|---|---|
| `#138` en el test | 6 |
| `#138 R[1-3]` en el test | 6 |
| `#138` en la consistencia | 3 |
| `#138 R[1-3]` en la consistencia | 3 |
| `#136 R3` en la consistencia | 3 |
| `#136` en el test | 8 |
| `^describe(` | 41 |
| `responderGrant` | 4 |
| `responderTerminate` | 2 |
| `collar-pair-link` | 4 |
| `toEqual(['rounded-xl'])` | 2 |
| `-[` | 0 |

Enmiendas de la consistencia:

| Grep | Resultado |
|---|---|
| fila Home a 0 | 0 → 1 |
| fila Home a 1 | 1 → 0 |
| suma | 1 |
| `?? []` | 1 |
| `toBe(31)` | 1 |

Clases: `bg-accent-soft` 16 y `rounded-xl bg-accent` 13.

### 6. tsc y eslint (desde `mobile-pet-tracker/`, sobre HEAD cb60bba8)

```
$ test ! -e .expo/types/router.d.ts; echo $?
0
$ bunx tsc --noEmit > r138_tsc.log 2>&1; echo exit=$?
exit=0          (log de 0 bytes)
$ bunx eslint src/screens/home/index.tsx src/screens/home/index.test.tsx \
    src/__tests__/consistency-classnames.test.ts > r138_lint.log 2>&1; echo exit=$?
exit=0          (log de 0 bytes)
```

### 7. Trazabilidad

```
$ for h in 6dc6570b… 22309656… d9878554… 828aade3…; do git merge-base --is-ancestor $h HEAD; echo $?; done
6dc6570b767c95ee6479eee606bf700628029c79 is-ancestor=0
22309656208fd73e00be3bb7659899826209751b is-ancestor=0
d9878554aec1651babda4094df836a803c16b8b2 is-ancestor=0
828aade35f5b921e6efa825f5792fc71d9a9c765 is-ancestor=0
```

R4 cita el verde común 828aade3, no HEAD, como pide traceability §Requisitos
sin test propio. R5 sigue «pendiente», a propósito.

### 8. Skills de Codex

El reporte (línea 8) dice: «Skills cargadas: `building-native-ui` (…
declara 1.0.1), `appllama-app-design-skill` y `ponytail` (full). […] No se
cargó animate-expo.»

`ponytail` no dejó huella en el código: los blobs coinciden con la spec (ver
§1). Ver las observaciones 1 y 2.

## Output de ./init.sh

Lo corrió el leader. Log:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/3228069c-49ae-4eb3-b328-25ddb806bf99/scratchpad/init-138-review.log`
(20669 líneas). HEAD es cb60bba8 al empezar y al terminar, igual que el HEAD
revisado.

```
1:     head-start cb60bba832789ca633e334d078fcf2486225e7b9 2026-09-30T01:31:58Z
219:   Test Suites: 171 passed, 171 total          (backend)
220:   Tests:       1307 passed, 1307 total
232:   Test Suites: 2 passed, 2 total               (infra)
233:   Tests:       14 passed, 14 total
20337: A worker process has failed to exit gracefully and has been force exited. … (ruido preexistente)
20339: Test Suites: 86 passed, 86 total            (mobile)
20340: Tests:       1612 passed, 1612 total
20341: Snapshots:   1 passed, 1 total
       ✅ Tests pasados
20637: Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
20638: Tests:       8 skipped, 389 passed, 397 total
       ✅ Tests e2e pasados
       $ expo lint
       ✅ Lint sin errores
       $ tsc --noEmit
       ✅ Typecheck sin errores
       ✅ Todo verde. Listo para trabajar.
20668: head-end cb60bba832789ca633e334d078fcf2486225e7b9 2026-09-30T01:36:16Z
20669: exit=0
```

Mobile da 86 suites y 1612 tests: la base de 86/1610 más los 2 `it` nuevos,
como exige R4.1.
