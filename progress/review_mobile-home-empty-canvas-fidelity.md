# review: mobile-home-empty-canvas-fidelity (#176)
Fecha: 2026-10-19
Revisado: HEAD b473bb74, rama feature/176-mobile-home-empty-canvas-fidelity, base 1c490233
Veredicto: APROBADO (con observaciones no bloqueantes; ninguna Crítica ni Alta)

## Hallazgos por severidad

### Críticos / Altos
Ninguno.

### Medios (no bloquean; el leader decide si pide test adicional)
- M1. R5, geometría de las huellas sin candado. `empty-state-hero.test.tsx::#176 R5` fija clase del escenario, orden de hijos, disco, sombra (clase y `rgba(13,17,23,0.10)`) y opacidad 0.18 del `home-empty-stage-paw`, pero NO la geometría de design D3 (los tres grupos `translate/rotate`, radios, elipses) ni el relleno con el token `accent`. Un cambio en cualquiera de esos valores pasaría en verde. Origen: tasks.md R5 (1) no prescribe ese test, así que Codex siguió la spec al pie. Verifiqué a mano `src/components/empty-state.tsx` contra D3 y coincide valor por valor: `translate(30 40) rotate(-20)` y `translate(232 70) rotate(18)` con círculos r=5 en (0,0), (10,-6), (20,0) y elipse (10,12) 9x7; `translate(220 210) rotate(-8)` con r=4 en (0,0), (8,-5), (16,0) y elipse (8,10) 7x6; `G fill={accent}`; `Svg` 280x260 con viewBox `0 0 280 260`. Queda cubierto solo por el smoke del humano.
- M2. R13, retrasos no fijados a 0/60/120/180 exactos. El test (que sigue tal cual tasks.md R13 (1)) comprueba estado inicial (opacidad 0, translateY 12), que a 100 ms el CTA sigue en 0, que a 200 ms `stage > title > body >= action` y que a 1000 ms todo está en estado final. Un `MOTION_STAGGER_MS` distinto (p. ej. 40 o 70) pasaría. El valor sí sale del token y `motion.test.ts` (25/25) lo fija a 60, y la fórmula `index * MOTION_STAGGER_MS` es la de la spec; el riesgo real es bajo. No se muestrea el resorte a mitad de vuelo.

### Bajos
- B1. C4, orden test-primero invertido en dos enmiendas de inventario. `0fbf26f7` (profile-canvas-fidelity, R2) llegó 4 commits después de `05b1271a` (feat R2) y `f432334f` (legibility-classnames, R5) llegó ~25 commits después de `2841b5bd` (feat R5). Entre medias la suite completa tenía un candado rojo (el reporte lo reconoce: los detectó la suite completa al final). Están dentro de la autorización de tasks.md §Tests enmendados ("si aparece rojo otro candado de inventario...") y son commits de test puros, pero el historial entre esos puntos no es bisectable en verde. Resto de la cadena limpia (ver C4).
- B2. `0fbf26f7`: la regex `/<Card\b[^>]*\bvariant="hero"/s` usa `[^>]*`; un `<Card onPress={() => x} variant="hero">` (el `>` de `=>` corta el patrón) no se contaría. Hoy los dos consumidores (`alert-detail`, `profile`) llevan `variant` justo tras `testID`/`<Card`, y la segunda aserción (`profile.match(/variant="hero"/g)` = 1) se conserva. Hueco teórico, no actual.
- B3. El candado de alcance de R2 de tasks.md (`variant="hero"` en `src/screens` fuera de `Card`: una sola línea, la de Inicio) no quedó como test permanente, solo como comprobación puntual. Lo corrí yo: `src/screens/home/index.tsx:301` es la única coincidencia fuera de `Card variant="hero"` (alert-detail:135 y profile:351). Nada impide en el futuro que otra pantalla adopte `hero` sin enmienda.
- B4. `progress/current.md` es la plantilla vacía (C2 "actualizado"); es responsabilidad del leader en el cierre. `traceability.md` conserva `status: draft` en su frontmatter (igual que design/tasks); irrelevante para el gate.

## Checklist C2 - Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: solo #176)
- [ ] progress/current.md actualizado: plantilla vacía, ver B4 (lo cierra el leader; no bloquea)

## Checklist C3 - Arquitectura
- [x] domain sin imports de infrastructure (no se tocó domain)
- [x] contratos en domain sin cambios
- [x] application sin cambios
- [x] infrastructure sin lógica de negocio (cambio solo de presentación: `empty-state.tsx`, `home/index.tsx`, `theme/pingo-stage.ts`)

## Checklist C4 - TDD
- [x] Cada R<n> tiene al menos un test que lo nombra en `it`/`describe` (R1, R4-R9, R12-R14 en `empty-state-hero.test.tsx`; R2, R10 en `home/index.test.tsx`; R3 en "R3.2 ... (enmendado por #176 R3)"; R11 por sonda documentada, sin test permanente, tal como prescribe tasks.md).
- [x] Cadena test-primero desde 1c490233 hasta HEAD verificada con `git show --name-only` commit a commit: cada `test(...)` toca solo ficheros de test y cada `feat(...)` solo producción (`empty-state.tsx`, `pingo-stage.ts`, `home/index.tsx`). Pares R1, R4, R5, R6, R8, R9, R12, R13, R7, R14, R2, R3 test-antes-de-feat. R10 y R1 son caracterización (NV declarado). Excepción acotada: B1.

Valores esperados en los tests son literales de la spec (190, 10/-10 por animación a 750/1500 ms, 26/900, 290, `#FFFFFF` de un mock de `useThemeColors`, `rgba(13,17,23,0.10)`, 0.18, 12 px, `w-full mt-2.5`, `w-full items-center gap-3.5`); ninguno importado de `src/theme/`. No son tautológicos.

Por requisito:
- R4: `pose.props.style` igual a `{width:190,height:190}`, `contentFit`, `source` de pingo-talk y `getAnimatedStyle(float)` sin width/height. OK.
- R6: muestreo -5/-10/0 a 750/750/1500 ms con fake timers (flotación de PingoFloat de 10 px, 1500 ms por tramo); pose dentro de `home-empty-float`; el bucle propio solo en `variant === 'default'` (regex sobre la fuente) y el estilo animado solo lleva `translateY` (no se suma el 4 px). OK.
- R7: reduce motion mockeado a true: los cuatro bloques en `{opacity:1, translateY:0}` desde el primer render y sin cambio a 1500 y 10000 ms; float quieto. OK.
- R12: envoltorio `w-full mt-2.5` con único hijo `home-empty-action`; icono 20 px, `#FFFFFF`, `marginRight: 8`, penúltimo hijo antes de la etiqueta; etiqueta con `text-17 font-extrabold text-accent-foreground`; `not.toMatch(/<Button[^>]*(w-full|mt-2\.5)/)`; `onPress` una vez. Los candados de #177/#155 sobre el `<Button` (empty-state.test 101/101, chunky-cta 72/72) siguen verdes sin tocar. OK.
- R13: ver M2. Sin `entering=`/`exiting=` (candado #155 R11 en empty-state.test, verde); `motion.ts` sin cambios, `motion.test.ts` 25/25.
- R14: clase exacta de raíz y orden de hijos con y sin acción; `-title`/`-body` dentro de sus `-enter`. OK.
- R5: ver M1.

## Checklist C5 - Trazabilidad
- [x] traceability.md sin filas "pendiente" (la única coincidencia de `grep pendiente` es la línea de la regla). 14 filas R1-R14.
- [x] Los 29 hashes citados existen (`git log -1`) y su mensaje corresponde al R-id de su fila.
- [x] Commits `feat|test(mobile-home-empty): <desc> (R<n>)`; los de docs/harness usan `docs(#176)`.

## Checklist C6 - Spec aprobada
- [x] requirements.md `status: approved`, casilla humana marcada (2026-10-19).
- [x] Enmienda #176 en `docs/ui-guidelines.md` presente con casilla `[X]` y aprobada por humano (`a5d30ff1`), anterior a H0; la implementación no tocó la carta.

## Checklist C7 - Sin código huérfano
- [x] N/A: la feature no reemplaza ni depreca ningún componente; añade una variante. La rama `default` de `EmptyState` y `MOTION_FLOAT_*` se conservan a propósito (R1, D2). La enmienda con `waitFor` (`314d1407`) quedó sustituida: el diff final de `home/index.test.tsx` no contiene `waitFor` en ese `it`, solo `mockUseReducedMotion.mockReturnValue(true); // (enmendado por #176 R13)` (el `beforeEach` de la línea 326 lo restaura a false).

## Verificación de los puntos pedidos

3. Candados enmendados fuera de la lista de tasks.md.
   - `0fbf26f7`: pasa de `/variant="hero"/` a `/<Card\b[^>]*\bvariant="hero"/s` con `toEqual` de los mismos dos ficheros. Acotada a `<Card`, necesaria (el candado cuenta ahora `EmptyState variant="hero"` de Inicio, que la spec obliga a añadir) y no abre hueco mayor; la aserción de que `profile` tiene exactamente un `variant="hero"` se mantiene. Solo B2/B3 como hueco teórico.
   - `f432334f`: `legibility-classnames` #61 R4 pasa de `[]` a `['components/empty-state.tsx']` (igualdad exacta, un único fichero). Necesaria: R5 exige `useThemeColors` con `accent` para el relleno de las huellas. Sigue prohibido `text-accent` (la aserción hermana no se tocó), y cualquier otro fichero que pida `accent` rompería el test. Relajación acotada por fichero, no por uso; aceptable.
   - Enmienda #155 R4 (`84067097`): reduce motion en un único `it`, aserción final vuelta a su forma original (`toBeVisible()` sobre la etiqueta); justificada (R7 estado final desde el primer fotograma) y sin otras aserciones tocadas. `314d1407` (`waitFor`) sustituido.
   - Enmiendas listadas en tasks.md (imports de `empty-state.test.tsx`, `text-26`, `text-15`, `tracking-title`, "#181 R3.2") conformes con el texto de tasks.md.
4. R11: el comando grep-clean de tasks.md sobre `empty-state.tsx` y `home/index.tsx` da salida vacía (exit 1); sin clases arbitrarias `[..]`; sin `StyleSheet.create`, `shadow*` ni `elevation`; los únicos literales de color están en `src/theme/pingo-stage.ts`. R10: `index.test.tsx` fija los literales es/en (título, cuerpo, etiqueta) y `common.noPetsYet`, `common.noPetsBody`, `profile.addPet` no cambian (diff sin `i18n`).
5. Alcance: el diff 1c490233..HEAD en producción es exactamente `empty-state.tsx`, `home/index.tsx` (+3/-1: `variant="hero"` y `px-5 py-6`) y `theme/pingo-stage.ts` (nuevo). Sin cambios en `package.json`, `bun.lock`, i18n, `motion.ts`, `pingo-float.tsx`, backend ni `docs/ui-guidelines.md`.
6. Deriva: `git diff f432334f HEAD` solo toca `progress/impl_...md` y `traceability.md`; ninguna línea de código tras f432334f.
7. Carta móvil y Enmienda #176: Reanimated en UI thread con valores compartidos, sin `entering=`/`exiting=` ni `LayoutAnimation`; ningún color en estilos animados; reduce motion respetado en flotación y entrada; sin hex fuera de `src/theme`; sin gradientes; botón `Text` de RN con `text-17` (Enmienda #187) y receta #177 intacta; icono `Plus` de reicon coloreado con token vía `useThemeColors` (D-I); `PingoFloat` limitado al `hero` de Inicio, sin ampliarlo a otras pantallas, como exige la enmienda. Esquinas: solo `rounded-full` (cápsula/disco) añadidas. Sin dependencia nueva.

## Verificación independiente
No corrí `./init.sh` por instrucción del leader (sandbox lo deniega). El leader lo corrió: exit 0, `/tmp/pet-176-leader-init.log` (móvil 121 suites / 4007 tests verdes, lint y typecheck verdes). Por mi cuenta, en la worktree:
- `bunx jest` por fichero: `empty-state-hero.test.tsx` 10/10, `empty-state.test.tsx` 101/101, `home/index.test.tsx` 230/230, `profile-canvas-fidelity` 26/26, `legibility-classnames` 27/27, `alerts-canvas-fidelity` 27/27, `chunky-cta-canvas-fidelity` 72/72, `motion.test.ts` 25/25.
- `bunx tsc --noEmit`: exit 0.
- Sin cambios sin commitear en la worktree (`git status --short` vacío).

## Observaciones para el cierre del leader
- Antes de marcar done: smoke Android del humano (huellas, flotación, entrada, CTA a ancho completo), que es lo único que cubre M1.
- Opcional, a criterio del leader/humano: pedir un test adicional que fije la geometría D3 y el relleno `accent` (M1) y los retrasos exactos (M2). No se exige para aprobar porque tasks.md no los prescribía y verifiqué M1 a mano.
