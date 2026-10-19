---
feature: "mobile-chunky-cta-canvas-fidelity"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Tareas: receta global de botones del canvas (#177)

> Disciplina TDD con commits test-primero. Cada requisito de [[requirements]]
> tiene su par rojo/verde en la cadena de abajo. Quien implementa no revisa.
> Ver [[design]] para el porqué. Rama `feature/177-mobile-chunky-cta-canvas-fidelity`.

## Reglas de la cadena (las fija esta spec; el handoff las repite)

- **Un commit de test va antes que su implementación, siempre**, y deja el rojo
  de la tabla. Nunca se mezclan tests e implementación en un commit (en #19 se
  hizo y se incumplió C4 de `CHECKPOINTS.md`).
- Todo comando de móvil empieza por `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker"`
  en la misma cadena `&&`. Un error de invocación (ENOENT del fichero que se iba
  a crear, `ERR_PNPM_RECURSIVE_EXEC_NO_PACKAGE`) no es un rojo: se para y se
  avisa. Móvil es `bun`: `bunx jest …`, `bun run typecheck`; nunca `npx` ni
  `npm i -g`. Si se necesita `node_modules` en el worktree, `bun install
  --frozen-lockfile` (no añade dependencias).
- **Un fichero de jest a la vez**, `bunx jest <ruta>` (ninguna ruta de esta
  spec lleva paréntesis; si una futura los lleva se escapan, `\(tabs\)`, porque
  jest las toma por regex y se salta ficheros con exit 0). Ni `./init.sh` (lo
  corre el leader o el humano) ni más de un jest a la vez. Si un `it` agota el
  tiempo con la máquina cargada, se repite el fichero solo sin flags antes de
  juzgarlo.
- **Esperas sobre el árbol renderizado**: se rigen por `docs/conventions.md`
  §«Esperas sobre el árbol renderizado» (esperar a un nodo o a un estado, nunca
  al contador de un mock). `fireEvent` y `act` de RNTL 14 son asíncronos: con
  `await`, o el siguiente `it` hereda un `setState` pendiente. Las sondas del
  tile y de los botones leen el estilo con `StyleSheet.flatten`.
- **Rojo bien formado**: solo vale el rojo de la tabla, con el `Expected` y el
  `Received` de la consulta indicada. Un `Unable to find`, un `Found multiple
  elements`, un `Test suite failed to run` (salvo el `Cannot find module
  '../chunky-lip'` de c1, declarado) o un fallo en un `it` que no figura en la
  tabla = **parar y avisar**; no se arregla ajustando la aserción.
- **Nacidos en verde, declarados**: una fila que ya pasa antes de su
  implementación (ancla positiva, inventario sin cambio) se marca «NV» en la
  tabla y se dice en `progress/impl_…`. El aflojamiento de c3 también.
- Comentarios de código: solo `#177 R<n>` (`// #177 R5`); nunca `#177` a secas
  ni una nota copiada de la spec (el guard de hex de `design-drift` las lee como
  color).
- Antes de cada commit: `bun run typecheck` con salida 0 (sin `| tail`: el código
  que se mide es el de `bun`), y el lint así, porque `expo lint` traga un SIGKILL
  y sale 0 y usa una caché que puede quedar obsoleta: `bunx expo lint --no-cache
  > <log> 2>&1 && test ! -s <log>` con `<log>` fuera del árbol; si contiene
  `Failed to run`, se repite. No hay prettier en móvil. El ESLint de backend no
  aplica.
- **Ficheros nuevos antes de contar**: `git add <ruta>` antes de correr las
  anclas, o `git grep` no los ve.
- Las sondas de cadena (grep, `git diff`, `git status`) acotan a las rutas que
  se espera cambiar; `git status --short` tras `git add` sale vacío y falla.
- Dependencia nueva: prohibida (R13.2).
- Los nombres de las skills de Codex no son los nuestros (deuda B5): el
  handoff del leader los traduce; esta spec no nombra ninguna.
- Codex **no** lanza `init.sh` ni edita `docs/` fuera de lo de R11, ni
  `backend-pet-tracker/`.

## Arranque (antes del primer commit)

1. `H0=$(git rev-parse HEAD)`; el handoff lo cita.
2. Correr las anclas A1 a A14 de [[requirements]] § Base medida y comparar. Si
   una difiere, parar y avisar.
3. Medir **T0**: total de `it` de la suite móvil en H0 con `bun run test > <log>
   2>&1; grep -E '^Tests:' <log>` (sin pipe). Toda cifra «total» de abajo es `T0
   + delta`. El aviso final `A worker process has failed to exit gracefully` es
   preexistente en ALL móvil desde `main`: no se para por él.
4. Localizar las pruebas colocadas a reescribir con el `git grep -lE` de R10 y
   anotar la lista en `progress/impl_…`.
5. Medir las cifras por fichero de los ficheros de test que se tocan (corriendo
   cada uno solo) para que la columna «Total» de la segunda tabla sea suma, no
   suposición.

## Cadena de commits

«Rojo» = `it` que fallan tras el commit, medidos y anotados por Codex; las filas
que ya se conocen de antemano se nombran aquí. Los mensajes llevan el sufijo
`(R<n>)`.

| Commit | Mensaje | Contenido | `it` añadidos | Rojo esperado |
|---|---|---|---|---|
| c1 | `test(#177 R2): token del labio y hook useChunkyLip (R1,R2)` | `describe` de R1 en `theme/__tests__/global-css.test.ts` (2 `it`) y `theme/__tests__/chunky-lip.test.tsx` nuevo (7 `it`) | 9 | R1: los 2 `it` (`color-lip` ausente). R2: el fichero entero cae con `Cannot find module` (declarado: es un módulo nuevo; sin él la suite no corre) |
| c2 | `feat(#177 R2): token --color-lip y hook useChunkyLip (R1,R2)` | `--color-lip` en `global.css` (claro `#0E5E3C`, oscuro `#0B4D31`, junto a `--color-lip-gray`) y `src/theme/chunky-lip.ts` | 0 | 0 en esos dos ficheros |
| c3 | `test(#177 R9): pisos de #187 a 211 y 167 (R9)` | en `heroui-text-size-merge.test.ts` el piso 226 a 211 y 182 a 167; título del `it` con `(enmendado por #177 R9)` | 0 | **NV, aflojamiento declarado** (hoy 226 y 182 superan 211 y 167); necesita D3 aprobada |
| c4 | `test(#177 R3): candados de la receta, inventarios y carta (R3-R8,R10-R12)` | `chunky-cta-canvas-fidelity.test.ts` nuevo (72 `it`) y los `it` globales reescritos de R10 puntos 1 a 12 | 72 | ver «Rojo de c4» |
| c5 | `test(#177 R3): pruebas de G1 con la receta nueva (R3,R4,R5,R6)` | pruebas colocadas de `celebration`, `empty-state`, `welcome`, `login`, `register`, `forgot` (incluye el tile `#167 R9`), `reset-password` | 0 | las aserciones de `className`, etiqueta o estilo reescritas |
| c5b | `test(#177 R10): candados de imports de #155 R11 admiten useChunkyLip (R10)` | Enmienda E1: los dos `it` de imports de `components/__tests__/empty-state.test.tsx` (ver [[requirements]] R10 punto 13) | 0 | (b) rojo con `Received` sin el import del hook; (a) **NV, aflojamiento declarado** |
| c6 | `feat(#177 R3): botones de G1 con labio y Text 17/800 (R3,R4,R5,R6)` | los 7 ficheros de producción de G1 | 0 | 0 en G1 |
| c7 | `test(#177 R3): pruebas de G2 con la receta nueva (R3,R4,R6)` | `pairing`, `home`, `alert-detail` | 0 | idem |
| c8 | `feat(#177 R3): botones de G2 con labio y Text 17/800 (R3,R4,R6)` | los 3 ficheros de G2 | 0 | 0 en G2 |
| c9 | `test(#177 R3): pruebas de G3 con la receta nueva (R3,R4,R5,R6)` | `add-pet`, `add-reminder`, `docs-upload-form`, `geofence-editor`, `geofences`, `weight-log`, `reminders` | 0 | idem |
| c10 | `feat(#177 R3): botones de G3 con labio y Text 17/800 (R3,R4,R5,R6)` | los 7 ficheros de G3 | 0 | 0 en G3; **toda la suite verde** salvo R11 |
| c11 | `docs(#177 R11): carta §12 y §13, enmienda #177 y bloque en #166 (R11)` | `docs/ui-guidelines.md` y `specs/mobile-chunky-cta/requirements.md` | 0 | 0: los R11 y `#166 R4` pasan a verde |
| c12 | `docs(#177): trazabilidad y reporte de implementación (R1-R14)` | `traceability.md` con los hashes reales y `progress/impl_mobile-chunky-cta-canvas-fidelity.md` | 0 | 0 |

Total de la suite: `T0 + 81` tras c4 (c1 suma 9, c4 suma 72, el resto no suma:
reescriben `it` en su sitio). Si una prueba colocada gana un `it` (por ejemplo
el de R5.2 en `forgot`), se anota y el total cambia en esa cifra.

### Rojo de c4

1. En `chunky-cta-canvas-fidelity.test.ts`, **12 NV** (declarados) y **60 en
   rojo**:
   - NV: `R3.3` (el inventario de 17 `Button` con `bg-accent` ya es 17 hoy),
     `R4.3` (los nueve ids), los 6 de `R8.3` (anclas positivas), `R8.2`, `R8.4`,
     `R12.1/R12.2` y `R12.3`.
   - Rojo: `R3.1` (16) y `R3.2` (16) con la clase o la etiqueta vieja en
     `Received`; `R4.1` (6) y `R4.2` (6); `R5.1` y `R5.2`; `R6.2`; `R7.1` a
     `R7.5` (5); `R8.1` (3: el conjunto con `chunkyLip` está vacío); `R11.1` a
     `R11.5` (5).
2. En los globales reescritos, los `it` de R10 puntos 1 a 10 y 12 caen con la
   cifra o literal vieja en `Received`. R10 punto 11 (líneas de la carta que
   no cambian) es NV.
3. Las pruebas colocadas aún no se han tocado: siguen verdes (afirman lo viejo,
   que sigue siendo cierto hasta c6/c8/c10). Eso es deliberado: cada grupo las
   reescribe en su par test/feat.

### Pruebas colocadas por grupo (c5 a c10)

Cada grupo repite este protocolo, un fichero de test a la vez:

1. En el commit de test: reescribir las aserciones de `className`, etiqueta y
   estilo del grupo a la receta nueva (R3 a R6). Correr cada fichero colocado
   del grupo: rojo con `Expected`/`Received` de `className` (la cadena completa
   incluye el prefijo de HeroUI `pressable-feedback__root button__root …`; se
   aserta con `toContain`/`toMatch` de la subcadena de las tablas, no con la
   cadena completa nueva), de etiqueta o de `boxShadow`. Las aserciones nuevas
   de estilo leen `StyleSheet.flatten(node.props.style)` y comprueban
   `boxShadow[0]` con `offsetY` y `color`; el `color` se afirma contra lo que
   devuelve el hook en esa prueba (el valor real de `useThemeColors`, o el doble
   `--color-lip` / `--color-lip-gray` en `alert-detail`), nunca contra un hex
   escrito a mano.
2. En el commit de feat: aplicar la receta a los ficheros del grupo según las
   tablas de R3, R4 y R5 (clase exacta, `style`, etiqueta, `keeps`). Cada
   conversión de `Button.Label` a `Text` importa `Text` de `react-native` si
   no estaba, quita el `Button.Label` huérfano del `import` de `heroui-native`
   solo si ya no se usa en el fichero, y no cambia el `t('…')` ni el texto.
3. Tras el feat: correr los ficheros colocados del grupo (verde) y los cuatro
   guards enteros, uno a uno: `src/__tests__/design-drift.test.ts`,
   `legibility-classnames.test.ts`, `ui-language.test.ts`,
   `no-pets-states.test.ts`, `profile-canvas-fidelity.test.ts`; y
   `heroui-text-size-merge.test.ts` (verde). (Fe de erratas: la «ui-copy-table»
   de las demás specs es `src/__tests__/ui-copy-table.ts`, una tabla de datos
   sin `it`; sus dos consumidores son `ui-language.test.ts` y
   `no-pets-states.test.ts`, y esos son los guards que se corren.)
4. `bun run typecheck` y el lint de las reglas. Un mock de
   `use-theme-colors` o de `uniwind` que deje al hook sin su color da `undefined`
   y no lanza (R2.4); pero si alguna prueba colocada falla con el hook, se
   arregla el doble de **esa prueba**, nunca el hook.

Grupos:
- **G1** (c5, c6): `components/celebration`, `components/empty-state`,
  `screens/welcome`, `login`, `register`, `forgot` (cta, resend y tile),
  `reset-password`. Conversiones: 5 (welcome ×2, celebration ×2, empty-state ×1).
- **G2** (c7, c8): `screens/pairing`, `home`, `alert-detail` (ack: solo clase,
  y `view-map`: solo labio, sin conversión). Conversiones: 2.
- **G3** (c9, c10): `screens/add-pet`, `add-reminder`, `docs-upload-form`,
  `geofence-editor`, `geofences`, `weight-log`, `reminders` (compacto con su
  estilo y cancelar con la receta neutra). Conversiones: 8.

Los `it` colocados que ya dijeran lo correcto (por ejemplo, los de `login` que
solo afirman `testID`) no se tocan. Un `it` colocado que pase en el commit de
test porque no depende de nada de lo que cambia es NV y se anota.

## Cierre del bloque de pisos (tras c10)

Prueba de piso exacto, sin commit: poner los pisos a 212 y 168 en
`heroui-text-size-merge.test.ts`, correr el fichero (rojo: el universo mide 211
y 167), volver a 211 y 167 (verde), y revertir con `git checkout HEAD -- <ruta>`
más `git diff --cached --quiet` y un `git status --short -- <ruta>` limpio. El
resultado va a `progress/impl_…`.

## Tabla de sondas (mutaciones plantadas)

Cada sonda se planta tras c10 (c11 si toca la carta), se corre el fichero que
se nombra, se ve el rojo indicado y se revierte con `git checkout HEAD --
<ruta>` + `git diff --cached --quiet` + `git status --short -- <ruta>` vacío.
El resultado de cada una se anota en `progress/impl_…`. Una sonda que **no**
da rojo bloquea: el candado es ciego.

| # | Mutación plantada | Fichero | Rojo esperado |
|---|---|---|---|
| S1 | volver a poner `border-b-4` en `screens/home/index.tsx` (en el tag de `weekly-activity-day-map`) | `chunky-cta-canvas-fidelity.test.ts` | `R3.1` de esa fila y `R7.1` (`border-b-4` 1) |
| S2 | añadir un `Button` nuevo con `bg-accent` en `screens/health/index.tsx` | idem | `R3.3` (18 ids) |
| S3 | quitar `style={chunkyLip.neutral}` de `docs-upload-cancel` | idem | `R4.1` de esa fila, `R7.5` (neutral 5) y `R8.1` rama neutral |
| S4 | añadir `useChunkyLip` en `screens/alerts/index.tsx` | idem | `R8.2` y `R7.4` |
| S5 | volver a poner `Button.Label` en `welcome-have-account` | idem | `R4.2` de N1 y `R6.2` |
| S6 | un consumidor extra de `useChunkyLip` en `screens/health/index.tsx` | idem | `R7.4` (19 ficheros) |
| S7 | invertir el orden del tile (`rounded-16 bg-accent`) en `forgot` | idem | `R5.2` y `R7.2` (17 ficheros) |
| S8 | `offsetY: 5` en `primary` del hook | `theme/__tests__/chunky-lip.test.tsx` | el `it` de forma de `primary` |
| S9 | cambiar el valor de `--color-lip` en claro | `theme/__tests__/global-css.test.ts` | `R1` claro |
| S10 | pisos 212 y 168 | `heroui-text-size-merge.test.ts` | el `it` de R1 (la prueba de piso exacto) |
| S11 | meter `shadowColor` en `src/theme/chunky-lip.ts` | `chunky-cta-canvas-fidelity.test.ts` | `R12.1/R12.2` |
| S12 | quitar `border-b-6` de `add-meal-time-button` | idem | `R7.1` (`border-b-6` 0) y `R8.3` de esa fila |
| S13 | `style={chunkyLip.primary}` en el `reminders-add-link` (en lugar de `primaryCompact`) | idem | `R5.1`, `R7.5` y `R8.1` rama compacto |
| S14 | quitar el `isDisabled={submitting}` de `login-submit` | `screens/login/index.test.tsx` o `R3.1` | la fila `keeps` de login cae |

## Verificación final (la corre Codex salvo lo marcado)

1. `bun run typecheck` y el lint (forma de las reglas) con 0.
2. Cada fichero de test tocado, uno a uno, en verde, y el escáner AST de #187.
3. `bun run test` completo (`> <log> 2>&1; grep -E '^Tests:' <log>`) con
   `T0 + 81`; si difiere, se explica.
4. `git diff H0..HEAD -- src/i18n package.json bun.lock app.json` vacío (R13.2) y
   `git diff H0..HEAD --stat -- ../backend-pet-tracker` vacío (R13.3).
5. Las anclas de «Base medida» recalculadas con los valores esperados de
   R6.2, R7.1 a R7.5.
6. **No** lo hace Codex: `init.sh`, el veredicto del reviewer, el smoke de R14
   en dev build de Android ni la casilla «Enmienda #177 aprobada por humano».

## Gate humano

Fuera de la cadena: tras el reviewer, el humano marca «Enmienda #177 aprobada
por humano» y hace el smoke de R14 en su Android (casilla propia). El leader
espera ambas antes de dar la feature por `done`.
