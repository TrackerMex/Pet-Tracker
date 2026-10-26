# review: mobile-canvas-account-flow (#205)
Fecha: 2026-10-25
Veredicto: RECHAZADO
Bloqueantes: 1 · No bloqueantes: 11

Reviewer: subagente `reviewer` (Claude Opus 5.5). Implementación: fallback Sonnet (no Codex).
Worktree `/home/claude/sites/Pet-Tracker-wt-205`, branch `feature/205-mobile-canvas-account-flow`, HEAD `6401fed7`.
Rango revisado: `cba925c7..21325c33` (código), `e89cfaac` (trazabilidad e informe) y el merge `6401fed7`.

## Gate (init-205.log)

No corrí `./init.sh` (regla del encargo). Leí el log del leader:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-205.log`.

- El log nace a las 23:27:47, después del commit HEAD `6401fed7` (23:19:43). Termina en `exit=0`.
- Backend: 187 suites, 1474 tests. Infra: 2 suites, 14 tests.
- Móvil: 152 suites, 5228 tests, 1 snapshot (140,782 s).
- E2E: 30 pasan y 3 se saltan de 33; 468 pasan y 8 se saltan de 476.
- Lint y typecheck limpios.
- 47 líneas «●», todas «● Console». Ninguna línea `FAIL`.

Este gate sustituye a la suite en diez lotes del implementador (ver D4).

## Checklists C2–C8

### C2 — Estado coherente
- [x] Máximo una feature `in_progress`: hay 0 en el branch. #205 figura `spec_ready` en el branch y `pending` en `origin/dev`. Ver O10.
- [x] `progress/current.md` describe la sesión activa. Anota el fallback Sonnet y el H0 `cba925c7`. Está sin commitear a propósito, por el leader.
- [x] N/A: «Toda feature done tiene test». #205 no está `done`.

### C3 — Arquitectura
- [x] N/A en capas backend: la feature solo toca `mobile-pet-tracker/` y `docs/`.
- [x] La estructura route delgado + `src/screens/` se respeta.
- [x] Reutiliza `RiseIn`, `PopIn`, `PingoFloat`, `ScreenHeader`, `useShadows`, `CONTINUOUS_CORNER` y `FormError`. No hay forks locales.

### C4 — TDD
- [x] Cada R1–R20 tiene al menos un `it` que nombra `#205 R<n>`. Cuenta de `it('#205 R<n>…`:
  - R1=1, R2=3, R3=3, R4=2, R5=1;
  - R6=2, R7=1, R8=4, R9=3, R10=4;
  - R11=2, R12=3, R13=3, R14=1, R15=1;
  - R16=4, R17=1, R18=4, R19=4, R20=1.
- [x] El historial va rojo y luego verde. Los commits `test(#205 …)` tocan solo tests y los `feat(#205)` solo producción.
- [x] Reproduje los rojos de R2, R8, R9, R10/R11, R12, R13, R16, R17, R18, R19 y R20.
  - Todos fallan por aserción o por «Unable to find».
  - Hay 0 `TypeError`, `ReferenceError` o `SyntaxError`.
  - Los logs son `rev205-red-R*.log` en el scratchpad.
- [x] El rojo de R15 no es reproducible sobre el árbol mixto: el `_layout.tsx` de la época importa `../theme/header-layout`, que dev borró. Es un artefacto de la reproducción, no un defecto. R15 queda cubierto por mutación (5-addpet-1).
- [x] R14 nace verde por diseño (candado de conservación). Tres mutaciones en la rama sin token lo ponen rojo por aserción: 4-reset-5, 4-reset-6 y 4-reset-7.
- [x] No hay mocks `virtual` nuevos en `cba925c7..21325c33`.
- [x] Ningún rojo muta un doble de test. Los `mockHomeEntrance` de login, registro y reset son espías de un `not.toHaveBeenCalled()` vivo, no candados tautológicos.
- [ ] **Candado ciego en R10.3.** Ver B1.
- [x] `tsc` en rojo entre `c0e67615` y `c058e5b0` no incumple C4. Es deuda; ver D5.

### C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente» (0 coincidencias). R1–R20 están «cubierto».
- [x] Los 38 hashes citados existen y caen en `cba925c7..e89cfaac`.
- [x] Los commits siguen `feat(#205): <desc> (R-ids)`. Ver O9 sobre el idioma.

### C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla de aprobación `[x]`, con firma delegada en el leader por mandato del humano del 2026-10-23.
- [x] La casilla de la enmienda de carta está `[x]`.
- [x] Las erratas E1–E5 van en commits `docs(#205)` del leader, anteriores a H0.
- [ ] La casilla del humo humano sigue `[ ]`. Es del cierre, no de este veredicto.
- [ ] B1 exige una errata nueva de R10.3.

### C7 — Sin código huérfano
- [x] `HomeEntrance` sale de login, registro y reset, pero sigue vivo en home, alertas, docs, geocercas, perfil y recordatorios. No queda huérfano.
- [x] Los testIDs retirados (`forgot-pingo-float`, `reset-pingo-float`) solo aparecen en aserciones `queryByTestId(...)).toBeNull()`.
- [x] `entranceStyle` solo aparece en aserciones `not.toContain`.
- [x] `PingoFloat` queda solo en bienvenida y registro, como pide R3 y R9.
- [x] Los tres `it` de `#153 R8`, los dos de `#153 R10` y el de `#153 R8 › usa el fundido…` se borraron junto con su producción.

### C8 — Carta de UI
- [x] Grep limpio en las líneas `+` de producción: cero hex, cero clases arbitrarias `[...]`, cero `StyleSheet.create`, cero `elevation` o `shadowColor`.
- [x] Las dimensiones usan `useSafeAreaInsets` arriba y abajo en las seis pantallas.
- [x] Los tappables nuevos (términos, chips) miden `min-h-11` o `h-11`, es decir, 44.
- [x] Las animaciones usan `RiseIn`, `PopIn` y `PingoFloat`, que son Reanimated en el hilo de UI y respetan reduce motion.
- [x] La carta lleva la Enmienda #205 una sola vez (`grep -c "^## Enmienda #205"` = 1), con su casilla `[X]`, seguida de la #206.
  - La #206 trata solo la barra de pestañas. No contradice la #205.
- [ ] **Fidelidad en runtime de R10.3.** Ver B1.

## Tabla de R-ids

| R | Qué fija | Rojo reproducido | Mutación roja | Estado |
|---|---|---|---|---|
| R1 | tokens `--text-34`, `--radius-32`, `--radius-40` | no (por mutación) | 6-tokens-carta-1, -2 | ok |
| R2 | scroll y retardos de bienvenida | sí | 1-welcome-1, -2, -3 | ok |
| R3 | escena 380, Pingo 220, `PingoFloat` | no (por mutación) | 1-welcome-4, 1b-welcome-1 | ok |
| R4 | bocadillo: posición, radios, `shadows.card` | no (por mutación) | 1-welcome-6, -7 | ok |
| R5 | saludo del catálogo | no (por mutación) | 1-welcome-8 | ok |
| R6 | marca, tagline y legal | no (por mutación) | 1-welcome-9, -10 | ok |
| R7 | sin fundido ni muelle de contenido | no (por mutación) | 1-welcome-11 | ok |
| R8 | Login | sí | 2-login-register-1 a -4 | ok |
| R9 | Registro | sí | 2-login-register-5 a -7 | ok |
| R10 | Recuperar | sí | 3-forgot-1 a -4 | **B1**; O1 |
| R11 | RecuperarEnviado | sí | 3-forgot-6 | ok (hereda B1 por la escena compartida) |
| R12 | NuevaContrasena, formulario | sí | 4-reset-1, -2 | ok |
| R13 | NuevaContrasena, éxito | sí | 4-reset-3, -4 | ok |
| R14 | rama sin token conservada | nace verde | 4-reset-5, -6, -7 | ok |
| R15 | `pets/add` con `headerShown: false` | artefacto | 5-addpet-1 | ok |
| R16 | cabecera `ScreenHeader` | sí | 5-addpet-2 a -5 | ok |
| R17 | sombra `segment` | sí | 5-addpet-6 | ok |
| R18 | paso 2, `RiseIn` y chips de 44 | sí | 5-addpet-7, -8, -9 | ok; D1 |
| R19 | pie fijo | sí | 5-addpet-10, -11, -12 | ok; D6 |
| R20 | Enmienda #205 en la carta | sí | 7-carta-1, -2 | ok |

«no (por mutación)»: no reproduje su commit rojo. Su candado queda probado por las mutaciones de la columna siguiente. F = `src/__tests__/account-flow-canvas-fidelity.test.ts`.

## Mutaciones

Cada mutación se planta con un literal de una sola ocurrencia, corre jest dirigido (`bunx jest --runTestsByPath … --runInBand --testTimeout=30000`) y se restaura con `git checkout HEAD -- <ruta>`. El script es `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev205-batch.py`.

Resumen de cada lote, todos en el scratchpad `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/`:
- `rev205-mut-1-welcome.log`
- `rev205-mut-1b-welcome.log`
- `rev205-mut-2-login-register.log`
- `rev205-mut-3-forgot.log`
- `rev205-mut-4-reset.log`
- `rev205-mut-5-addpet.log`
- `rev205-mut-6-tokens-carta.log`
- `rev205-mut-7-carta.log`

El log de jest de cada mutación es `rev205-mut-<lote>-<n>.log`. En todas las rojas hubo 0 `TypeError` o `ReferenceError`.

| Id | R | Mutación | Rojo en | Zona ciega |
|---|---|---|---|---|
| 1-welcome-1 | R2 | `delayMs` de chips 120→150 | `#205 R2: Main sube sus bloques a 0, 120, 200 y 280 ms` | |
| 1-welcome-2 | R2 | quitar `welcome-spacer` | 3 (`#205 R2` apilado, `R5` y `#153 R5` enmendados) | |
| 1-welcome-3 | R2 | `paddingTop: insets.top + 12`→`+ 16` | `#205 R2: el scroll usa márgenes 16…` y `R5` dimensiones | sí |
| 1-welcome-4 | R3 | `h-95`→`h-90` | 3 (W `#205 R3`, `#153 R5`, F) | |
| 1b-welcome-1 | R3 | `PingoFloat`→`View` (apertura y cierre) | `#205 R3: Pingo mide 220, flota…`, `#153 R10`, F | |
| 1-welcome-6 | R4 | `shadows.card`→`shadows.segment` | W `#205 R4` y F | sí (prueba que el import de `useShadows` no es tautológico) |
| 1-welcome-7 | R4 | `right-5.5`→`right-6` | W y F | |
| 1-welcome-8 | R5 | saludo es con dos frases | 4 (`#205 R5`, `#153 R1` ×3) | |
| 1-welcome-9 | R6 | `max-w-75`→`max-w-72` | 3 (W `#205 R6`, `R5`, F) | |
| 1-welcome-10 | R6 | legal `mt-4`→`mt-5` | 3 (W `#205 R6`, `R5`, F) | sí |
| 1-welcome-11 | R7 | `translateY` repuesto en `pingoStyle` | 6 (`#205 R7`, `#205 R3`, `#153 R9` ×3, `#153 R10`) | |
| 2-login-register-1 | R8 | Pingo `-8deg`→`-6deg` | `#205 R8: Pingo mide 88…` y `#167 R6` | |
| 2-login-register-2 | R8 | cuerpo `delayMs` 100→120 | F `#205 R8` | |
| 2-login-register-3 | R8 | pico de la burbuja a la derecha | W `#205 R8: la burbuja… pico abajo a la izquierda` y F | |
| 2-login-register-4 | R8 | `login-top` `-ml-2.5`→`-ml-2` | `#205 R8: el scroll apila…` y F | sí |
| 2-login-register-5 | R9 | `paddingBottom` `+ 96`→`+ 24` | `#205 R9: …colchón inferior de 96` y `#61 R7` | |
| 2-login-register-6 | R9 | términos `min-h-11`→`min-h-10` | `#205 R9: la cabecera no entra animada…` y F | |
| 2-login-register-7 | R9 | `PingoFloat`→`View` en registro | solo F (O7) | sí |
| 3-forgot-1 | R10 | Pingo `6deg`→`4deg` | `#205 R10: Pingo no flota…` y `#167 R9` ×2 | |
| 3-forgot-2 | R10 | quitar `className` de `forgot-pingo` | `#205 R10: Pingo no flota…` | sí (ver B1: el test ve la prop, el runtime no) |
| 3-forgot-3 | R10 | campo `mt-7`→`mt-6` | `#205 R10: título, cuerpo, campo…` | |
| 3-forgot-4 | R10 | fondo `rounded-40`→`rounded-32` | `#205 R10: la escena apila…` y F | |
| 3-forgot-5 | R10 | `forgot-error` movido tras `forgot-spacer` | **sobrevive** (O1) | sí |
| 3-forgot-6 | R11 | `forgot-resend` nunca se pinta | 13 (`#205 R11`, `#117 R5`, `#117 R6` ×8, `#117 R7` ×2, `#172 R19`) | |
| 4-reset-1 | R12 | cuerpo `delayMs` 100→150 | F `#205 R12` | |
| 4-reset-2 | R12 | formulario `paddingTop` `+ 56`→`+ 48` | `#205 R12: el scroll arranca 56…` y `#61 R8` | |
| 4-reset-3 | R13 | tarjeta `rounded-16`→`rounded-card` | 3 (`#205 R13` ×2, `#167 R10`) | |
| 4-reset-4 | R13 | pop `mt-6`→`mt-4` | 3 (`#205 R13` ×2, `#167 R10`) | |
| 4-reset-5 | R14 | sin `justifyContent: 'center'` | `#205 R14` y `#61 R8` | |
| 4-reset-6 | R14 | título sin token `text-2xl`→`text-3xl` | `#205 R14` | |
| 4-reset-7 | R14 | sin token `gap: 16`→`12` | `#205 R14` y `#61 R8` | sí |
| 5-addpet-1 | R15 | `pets/add` `headerShown: true` | `#205 R15: pets/add declara solo headerShown false` | |
| 5-addpet-2 | R16 | `backFallback="/"`→`"/home"` | solo F (O6) | sí |
| 5-addpet-3 | R16 | `size={24}`→`{28}` | 3 (`#205 R16` ×2, `#191 R2`) | |
| 5-addpet-4 | R16 | Datos básicos `text-base font-black`→`text-lg font-bold` | `#205 R16: la fila de foto…` y F | |
| 5-addpet-5 | R16 | cabecera `paddingTop` `+ 12`→`+ 16` | `#205 R16: la cabecera es ScreenHeader…` | sí |
| 5-addpet-6 | R17 | `shadows.segment`→`shadows.card` | `#205 R17` y `#191 R5` | |
| 5-addpet-7 | R18 | edad `delayMs` 60→80 | F `#205 R18` | |
| 5-addpet-8 | R18 | chip elegido `bg-tab-pill`→`bg-accent-soft` | `#205 R18: el chip elegido…` y F | |
| 5-addpet-9 | R18 | `gap` del paso 2 16→12 | `#191 R6` y F | |
| 5-addpet-10 | R19 | `Math.max(insets.bottom, 16)`→`12` | solo F (D6) | sí |
| 5-addpet-11 | R19 | pie también en la celebración | `#205 R19: la celebración no pinta el pie` | |
| 5-addpet-12 | R19 | `keyboardVerticalOffset` 0→24 | `#148 R4` enmendado y F | sí |
| 6-tokens-carta-1 | R1 | `--radius-40: 36px` | F `#205 R1` | |
| 6-tokens-carta-2 | R1 | `--radius-32` declarado dos veces | F `#205 R1` | |
| 7-carta-1 | R20 | `--radius-40` sacado de la sección #205 y puesto en la #206 | F `#205 R20` | sí (el corte en `\n## ` funciona: el literal fuera de la sección no salva el test) |
| 7-carta-2 | R20 | título de la sección renombrado | F `#205 R20` | |

Mutación descartada: la primera versión de 1-welcome-5 (`PingoFloat`→`View` solo en la etiqueta de apertura) dio `SyntaxError` por JSX desbalanceado. Era un error mío; se repitió bien como 1b-welcome-1.

El árbol quedó limpio tras cada lote: `git status` muestra solo `progress/current.md` y `git diff --cached` está vacío.

## Desviaciones dictaminadas

- **D1. R18, literal del chip con `box-sizing: border-box` en F.**
  - La subcadena de la spec (`height: 44px; padding: 0 16px; border-radius: 999px`) no existe en `NuevaMascota2.dc.html`.
  - F afirma el literal real del artboard. Producción no cambia: `h-11` y `px-4` son 44 y 16.
  - Dictamen: errata de transcripción aceptable, no bloqueante. El leader debe registrarla como errata en `requirements.md` para que la spec y F digan lo mismo (O3).
- **D2. R10, `className` sobre `expo-image` en `forgot-pingo`.** Dictamen: **bloqueante**. Ver B1.
- **D3. R10, `forgot-error` sin margen superior.**
  - Lo causa la spec: retira `gap: 16` del scroll y no da margen al error, y `FormError` no acepta `className`.
  - El artboard no dibuja el estado de error.
  - Dictamen: no bloqueante. Debe mirarse en el humo (O2).
- **D4. Suite del cierre en diez lotes (147 suites, 5059 tests).**
  - La causa fue un SIGKILL por memoria con jest de otros worktrees en paralelo.
  - Dictamen: no bloqueante. Queda sustituida por el gate del leader sobre `6401fed7`: móvil 152 suites, 5228 tests, `exit=0` (O8).
- **D5. `tsc` en rojo entre `c0e67615` y `c058e5b0`.**
  - Son cinco errores TS2339 (`node.props.testID` sobre `children`, que en RNTL 14 puede ser una cadena), solo en `add-pet/index.test.tsx`.
  - Abarca tres commits verdes: `be76458c` (R16), `348d6def` (R17) y `ce6da7ac` (R18).
  - Los rojos de jest de R16–R19 fallan por aserción, porque babel elimina tipos; lo reproduje.
  - `c058e5b0` solo estrecha el tipo y no cambia ninguna aserción.
  - Dictamen: no incumple C4 (rojo por aserción, test primero). Es deuda de historial: esos tres verdes no pasan el typecheck del gate y no son bisectables con `init.sh` (O4).
- **D6. `Math.max(insets.bottom, 16)` solo lo ve F.**
  - El doble de insets de add-pet es fijo en 24, así que el suelo de 16 no tiene `it` de comportamiento.
  - La mutación 16→12 (5-addpet-10) solo pone rojo F.
  - Dictamen: no bloqueante. F fija el literal de producción y la spec lo pone en la fila de F (O5).
- **D7. `it` propios de R16 y R18 enmendados en el rojo de R19.**
  - Comprobé `#205 R16: la cabecera es ScreenHeader con título, paso y volver`. Sigue asertando:
    - la clase de la cabecera;
    - el botón volver con su `accessibilityLabel`;
    - el título con `header`, clase y texto;
    - la etiqueta de paso «1 de 2»;
    - la clase y el `paddingTop` del bloque.

    Solo cambió la lista de hermanos (`[undefined, 'add-pet-form', 'add-pet-footer']`).
  - Comprobé `#205 R18: Datos médicos, Edad, Esterilizado y Microchip suben en ese orden`. Sigue asertando el orden de los cuatro `add-pet-rise-*`, sus `entering`, el `mt-3` y el contenido de cada bloque. Solo cambió el contenedor de `add-pet-submit`, que pasa a `add-pet-footer`.
  - Dictamen: correcto. Los títulos siguen diciendo la verdad.
- **D8. Contador `Tests:` de R3 a R7 un test por debajo.**
  - Es una deriva solo del informe de implementación: no sumó la fila de welcome de `directUses`.
  - Dictamen: no bloqueante. El gate da el total autoritativo (O8).
- **D9. Otras desviaciones del informe.**
  - El `#117 R5` del tile Lock se enmendó mecánicamente.
  - Se añadieron a F `delayMs={0}` (R10) y `animation: rise 400ms ease-out both` (R18).
  - El flake P21 está anotado.
  - Dictamen: aceptables. Refuerzan candados sin cambiar la spec.

### Merge `6401fed7` (origin/dev: #207, #202, #206, #196)

- **Los cuatro conflictos.** `git diff 6401fed7^2 6401fed7` (dev contra el merge) solo añade los deltas de #205:
  - `alerts-canvas-fidelity`: sufijo `(enmendado por #205 R16)` y la fila de add-pet retirada por R16.
  - `chunky-cta-canvas-fidelity`:
    - `rounded-16` pasa a `26 + … + 1` (37 = dev 36 + 1, `#205 R13`);
    - `#177 R5.2` lleva su sufijo y el literal del tile con `absolute bottom-1.5 right-0`;
    - `reset-password` pasa de 1 a 2.
  - `design-drift`: el `#178 R13` (radios de Recordatorios) lleva el sufijo `#205 R13`, y `reset-password` pasa a `1 + 1`.
  - `heroui-text-size-merge`: el suelo de `cardElements` es 35 − 1 − 1 − 1 + 1 − 2 − 1 − 1 − 1 − 1 = 27, contra 29 medidos. El margen de 2 viene heredado de dev.
  - En sentido inverso, las líneas de #205 que el merge quita del lado feature reaparecen con los sufijos de dev añadidos. Es la unión.
- **Ficheros que tocaron ambos lados sin conflicto.**
  - `_layout.tsx`: `headerShown` aparece 8 veces (base 5, más 1 de #205 y 2 de dev). Las dos ediciones están.
  - consistency-classnames (29 = 29), layout.test (18 = 18) y catálogo (4 = 4) cuadran con el informe del merge.
  - El gate en verde sobre `6401fed7` los cubre.
- **Carta.**
  - `## Enmienda #205 — el flujo de cuenta como el canvas` aparece una vez (línea 925), con la casilla `[X]` (línea 937), y va seguida de `## Enmienda #206` (línea 940).
  - El corte de R20 en `rest.indexOf('\n## ', 1)` acaba la sección en la #206. Lo prueba la mutación 7-carta-1: con `--radius-40` movido a la #206, R20 se pone rojo.
  - La rama `next === -1` quedó muerta (O11).

### Fidelidad al canvas

- F pasa en el gate y lee a la vez el artboard y la fuente de producción. Cada literal fijado está en ambos.
- Los `.dc.html` se trataron como datos. No contienen instrucciones.
- La única infidelidad que encontré es la de runtime de B1, que F no puede ver porque compara texto.

## Bloqueantes

### B1. R10.3: `forgot-pingo` no es absoluto en runtime

Fichero: `mobile-pet-tracker/src/screens/forgot/index.tsx`. Aplica a los dos estados de `/forgot`, porque R11 conserva la escena.

```tsx
import { Image } from 'expo-image';
...
<Image testID="forgot-pingo" className="absolute left-6 top-0" source={require('../../../assets/images/pingo-talk.webp')} style={{ width: 120, height: 120, transform: [{ rotate: '6deg' }] }} />
```

R10.3 exige un `forgot-pingo` «absoluto», en `left-6 top-0`, que en el artboard es `position: absolute; left: 24px; top: 0`. En el dispositivo, ese `className` se descarta:

1. `expo-image` pinta un host nativo.
   - `src/Image.tsx` renderiza `<ExpoImage {...restProps} style={resolvedStyle} />`.
   - `src/ExpoImage.tsx` renderiza `<NativeExpoImage …/>`, creado con `requireNativeViewManager('ExpoImage')`.
   - No hay `View` envolvente y ninguna rama lee `className`.
2. uniwind 1.11.0 solo convierte `className` en componentes de `react-native` de su `SUPPORTED_COMPONENTS` (`node_modules/uniwind/dist/metro/index.cjs`).
   - La lista incluye el `Image` de RN, pero no `expo-image`.
   - No hay `withUniwind` en `src/`, y no hay `babel.config.*` con otra transformación.
3. Ningún otro `Image` de `expo-image` del proyecto recibe `className`. Los nueve restantes usan `style`, así que no hay precedente que lo valide.

Efecto: Pingo cae en el flujo normal de `forgot-scene` (x = 0, y = 0) en vez de `left: 24`. Queda desplazado 24 pt a la izquierda respecto del artboard. R10.3 («absoluto») no se cumple.

Por qué los tests no lo ven:
- `#205 R10: Pingo no flota y mide 120 girado 6 grados` aserta `props.className` del nodo. En jest la prop llega al host, en runtime no.
- F compara el literal de la fuente.
- La mutación 3-forgot-2 (quitar el `className`) los pone rojos, pero solo prueba que miran la prop, no que la prop tenga efecto. Es un candado sobre un constructo inerte.

Origen: la spec prescribe el literal (R10.3) y el implementador lo copió y avisó de la duda en su informe (§Desviaciones, R10). La corrección empieza por una errata del leader a R10.3, sigue con la producción y con los `it` de R10 y F que fijan el literal, y la verifica de nuevo el reviewer.

## Observaciones

- **O1.** El orden `forgot-error` antes de `forgot-spacer` no tiene candado: la mutación 3-forgot-5 sobrevive. R10.5 dice «conservar» sin fijar orden. Producción hoy está bien. Es un hueco de la spec, no del código.
- **O2.** `forgot-error` sin margen superior (D3). Hay que mirarlo en el humo.
- **O3.** Errata pendiente en `requirements.md` para el literal de chip de R18 (D1).
- **O4.** Deuda de historial: `tsc` en rojo en `be76458c`, `348d6def` y `ce6da7ac` (D5). Para futuros handoffs, conviene exigir `bun run typecheck` también en los commits rojos.
- **O5.** El suelo `Math.max(…, 16)` solo lo ve F (D6). Un `it` con un inset inferior por debajo de 16 lo fijaría por comportamiento.
- **O6.** `backFallback="/"` de R16 solo lo ve F (5-addpet-2): el doble de expo-router de add-pet no tiene `canGoBack`. Es aceptable porque la spec lo pone en F.
- **O7.** `PingoFloat` en registro solo lo ve F (2-login-register-7). El test de registro pasa con un `View` del mismo `testID`. Es aceptable por la misma razón.
- **O8.** El informe de implementación lleva derivas de cifra: los `Tests:` de R3 a R7 y la suite en lotes. Las cifras que valen son las del gate.
- **O9.** Los mensajes de commit van en español y `docs/conventions.md` (línea 355) pide «Conventional commits, en inglés». Sigue la práctica vigente del repo, que también es en español. No bloquea.
- **O10.** C2: #205 sigue `spec_ready` en el `feature_list.json` del branch y `pending` en `origin/dev`. Le toca al leader decidir el estado al cerrar (plan de paridad en `dev`).
- **O11.** Derivas que el merge heredó y no corrigió, todas en prosa o código muerto:
  - el título de `#177 R7.3` dice «veintisiete» con 37 radios;
  - el margen de 2 en el suelo `cardElements`;
  - las anclas de prosa de la spec `headerShown` «5 → 6» (ahora 8) y `^## Enmienda` «26 → 27» (ahora 28);
  - la rama `next === -1` de R20, ahora inalcanzable.

  Ningún test depende de ellas.

## HEAD revisado

`6401fed7a3654b05e886d8743768c109041e3398`

Al terminar, `git diff --stat` muestra solo `progress/current.md` (del leader, sin tocar) y este informe sin seguimiento. `git diff --cached --stat` está vacío.

## Re-revisión tras B1 — 2026-10-25

Veredicto: **APROBADO** sobre `02fa4921528975f964040166755c5890624ce2a4`. **B1 queda cerrado.**

Alcance: re-revisión acotada a E6 y a sus tres commits. El resto de la feature quedó revisado sobre `6401fed7` (secciones de arriba). `git diff --stat 6401fed7 02fa4921` toca 5 ficheros, 59 inserciones y 9 borrados: la spec, dos ficheros de test, `forgot/index.tsx` y el informe de implementación. Skill `expo:expo-overview` cargada al empezar. No ejecuté `./init.sh` ni usé Monitor.

### 1. E6 cierra B1

El literal de E6 llega al estilo nativo. Lo comprobé en `mobile-pet-tracker/node_modules/expo-image` (v57.0.3, `main: src/index.ts`):

- `src/Image.tsx`, `render()`, hace `StyleSheet.flatten(style)` y separa solo `resizeMode`, `fontWeight`, `color` y `fontSize`. El resto (`restStyle`) se pasa como `<ExpoImage {...restProps} style={resolvedStyle} …/>`. Así que `position`, `left`, `top`, `width`, `height` y `transform` pasan sin tocar.
- `src/ExpoImage.tsx`, `render()`, vuelve a aplanar el estilo y borra solo props de sombra/`elevation` según la plataforma, y `backgroundColor` en Android. Luego renderiza `<NativeExpoImage {...props} {...resolvedStyle} style={resolvedStyle} …/>`. `NativeExpoImage` sale de `requireNativeViewManager('ExpoImage')`, así que su `style` es el que maqueta Yoga.
- `className` no tiene ese camino. uniwind 1.11.0 (`node_modules/uniwind/dist/metro/index.cjs`) solo redirige importaciones de `react-native` y los componentes de `SUPPORTED_COMPONENTS` (línea 50). `NativeExpoImage` no sale de `react-native`: es un view manager nativo, así que el `className` acababa como prop sin leer. Esto confirma el diagnóstico de B1 y que el cambio a `style` lo corrige.

Fidelidad al canvas. El `<img>` de `specs/mobile-canvas-account-flow/canvas/Recuperar.dc.html` es `style="position: absolute; left: 24px; top: 0; width: 120px; height: auto; transform: rotate(6deg)"`. Producción (`forgot/index.tsx:107`) es `style={{ position: 'absolute', left: 24, top: 0, width: 120, height: 120, transform: [{ rotate: '6deg' }] }}`:

- `position`, `left`, `top`, `width` y `rotate(6deg)` coinciden 1:1.
- `height: auto` del canvas equivale a `height: 120`, porque `assets/images/pingo-talk.webp` es VP8X de 1024×1024 (cuadrado). Lo medí leyendo la cabecera RIFF.
- Pingo sigue siendo hijo directo de `forgot-scene` (`h-37.5 w-42`, 168×150). Ahora el fondo, Pingo y el candado son los tres absolutos dentro de una caja de tamaño fijo, como en el artboard.

### 2. Historial test-primero

| Commit | Ficheros | Contenido |
|---|---|---|
| `f890d06a` | `specs/…/requirements.md` | Errata E6: R10.3, F de R10, párrafo E6 y firma en «Aprobación» |
| `1045673f` (rojo) | `forgot/index.test.tsx`, `account-flow-canvas-fidelity.test.ts` | Solo tests (5+, 3−) |
| `fee961d6` (verde) | `mobile-pet-tracker/src/screens/forgot/index.tsx` | Solo producción (1+, 2−): borra la línea `className="absolute left-6 top-0"` y cambia el `style` al literal de E6, carácter por carácter |
| `02fa4921` | `progress/impl_…md` | Informe |

Para reproducir el rojo de `1045673f` comprobé que su `forgot/index.tsx` es idéntico byte a byte al de `6401fed7` (`diff` vacío). Luego corrí los tests de HEAD contra esa producción, que es la mutación M1 de abajo. Salen **exactamente los 4 `it` que nombra el informe**, y ninguno más:

- `#205 R10: Pingo no flota y mide 120 girado 6 grados`;
- `#167 R9: Pingo precede al tile del candado en el formulario (enmendado por #205 R10)`;
- `#167 R9: Pingo precede al tile del candado tras enviar (enmendado por #205 R10)`;
- F › `#205 R10: Recuperar copia escena, tile y márgenes`.

### 3. Los candados ven el defecto

Cada mutación se plantó en `forgot/index.tsx`, contra los 8 ficheros del jest dirigido (`--runInBand --testTimeout=30000`), y se restauró con `git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx`. Después de cada una, `git diff --stat -- mobile-pet-tracker` y `git diff --cached --stat` salieron vacíos. Los logs están en el scratchpad de la sesión (`rr205-jest-M*.log`).

| Id | Mutación | Resultado | `it` en rojo |
|---|---|---|---|
| M1 | devolver `className="absolute left-6 top-0"` y quitar `position`, `left` y `top` del `style` (= producción de `1045673f`/`6401fed7`) | 4 fallados / 403 verdes, 2 suites | `#205 R10: Pingo no flota…`; `#167 R9` ×2 (formulario, tras enviar); F `#205 R10: Recuperar copia escena…` |
| M2 | `left: 24` → `left: 0`, con `position: 'absolute'` | 4 / 403, 2 suites | los mismos 4 |
| M3 | quitar solo `top: 0` | 4 / 403, 2 suites | los mismos 4 |
| M4 (extra) | `style` correcto, pero con `className="absolute left-6 top-0"` repuesto | 1 / 406, 1 suite | `#205 R10: Pingo no flota…` (`className` `toBeUndefined`) |
| M5 (extra) | quitar solo `position: 'absolute'` | 4 / 403, 2 suites | los mismos 4 |

Las tres mutaciones mínimas se ponen rojas en tres candados independientes:

- el `toEqual` del `it` de R10;
- el `toEqual` de `expectPingoBeforeLock`, en los dos estados;
- el `toContain` de producción de F.

Ahora el candado mira el estilo que sí tiene efecto en runtime, y no un constructo inerte como en B1.

### 4. Ningún otro sitio arrastra el mismo defecto

Escaneé con `rr205-classname-scan.py` (scratchpad) cada etiqueta JSX con `className` y el módulo del que se importa, en los `.tsx` sin test de `git diff --name-only ee40d93d 6401fed7 -- mobile-pet-tracker/src`:

- **Ficheros propios de #205** (commits no merge del primer padre, `ee40d93d..02fa4921`): `_layout`, `segmented-control`, `add-pet`, `forgot`, `login`, `register`, `reset-password` y `welcome`. Todos los `className` caen en tres grupos:
  - `View`, `Text`, `Pressable`, `ScrollView`, `TextInput` y `KeyboardAvoidingView` de `react-native`, que están en `SUPPORTED_COMPONENTS`;
  - componentes de `heroui-native`;
  - envoltorios locales que reenvían a `Animated.View` de Reanimated (`RiseIn`, `PopIn`, `PingRing`), un patrón ya establecido.

  Ningún `Image` de `expo-image` recibe `className`. Lo confirmé en los 11 ficheros de `src/` que importan `expo-image`: hay 0 casos. **Sin bloqueante.**
- **Ficheros que entraron por el merge** (#202, #206, #196):
  - `BlurView` (`expo-blur`) envuelve un `View` de `react-native` con `{...props}`, así que uniwind sí convierte su `className`;
  - `Animated.View` / `createAnimatedComponent(View)` también lo convierten;
  - `GlassView` (`expo-glass-effect`) en `floating-tab-bar.tsx`, en cambio, no: en iOS es `requireNativeViewManager` sin `View` envolvente. Ver O12. No es de #205: `git blame` lo fecha en `de264387c` (2026-08-25) y ya estaba en `ee40d93d`.

### 5. La errata es coherente

- R10.3 (`requirements.md:410-411`) quita el `className` y prescribe `{ position: 'absolute', left: 24, top: 0, width: 120, height: 120, transform: [{ rotate: '6deg' }] }`.
- F de R10 añade el literal del canvas `position: absolute; left: 24px; top: 0; width: 120px` y, en producción, `position: 'absolute', left: 24, top: 0, width: 120, height: 120`.
- El párrafo E6 (`:856`) repite el mismo literal y nombra los mismos tres candados.

Los tests implementan exactamente eso: `toBeUndefined` y el `toEqual` en el `it` de R10, el `toEqual` en `expectPingoBeforeLock` y los dos `toContain` de F. Los literales de la spec, de los tests y de la producción coinciden carácter por carácter.

En `git show 1045673f fee961d6` no cambia ninguna línea `it(`, `describe(` ni `test(`, así que los títulos no cambiaron. No quedan menciones a `left-6` en la spec fuera de la cita histórica de E6.

### Cifras

- `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit` (en `mobile-pet-tracker/`) sale 0, con log de 0 bytes.
- El jest dirigido de 8 ficheros sobre HEAD sale 0: **8/8 suites, 407/407 tests**, 10.8 s. El único `●` es `● Console` (el `console.warn` de `react-native-svg` «"color:foreground" is not a valid color or brush», previo y ajeno).
- Coincide con lo que declara el informe (8/8, 407/407).

### Observaciones nuevas

- **O12.** Mismo tipo de defecto que B1, fuera de #205 y anterior a ella. `floating-tab-bar.tsx:141-145` pasa `className="absolute inset-0"` a `GlassView` de `expo-glass-effect`. En iOS (`GlassView.ios.tsx`) es `<NativeGlassView {...props} />`, de `requireNativeViewManager`, y uniwind no lo convierte. En la rama `hasLiquidGlass` (solo iOS 26+), el cristal no queda absoluto ni a sangre en la barra. En Android, `GlassView.tsx` envuelve un `View` y funciona. Viene de `de264387c` (2026-08-25). Conviene registrarlo como deuda e ir a `style={StyleSheet.absoluteFill}` en una feature propia. No bloquea #205.
- **O13.** El párrafo E6 dice «Hay precedente en `celebration.tsx`». Ahí el `Image` de `expo-image` solo recibe tamaño por `style`, y la posición la da el `Animated.View` que lo envuelve. Es precedente de `style` en `expo-image`, no de posicionamiento absoluto por `style`. `forgot-pingo` es hoy el único `Image` de `expo-image` posicionado así. La corrección no depende del precedente: la valida el código de `expo-image` (punto 1). Es prosa, no bloquea.
- **O14.** `traceability.md`, fila R10, sigue citando solo `8ea3811d`/`05e29c8f`. Los commits de E6 (`1045673f` rojo y `fee961d6` verde) no constan. No hay filas «pendiente» (0), así que C5 se cumple. Al cerrar, el leader puede añadir los hashes de E6 a la fila. Ojo: un rebase posterior los invalidaría.
- **O15.** La nota 4 de «Prueba de humo del humano» del informe de implementación (`impl_…md:274`) todavía describe el estado anterior a E6 («Pingo caiga en `left-6 top-0` (`className` sobre `expo-image` sin `withUniwind`)»). El propio informe lo avisa en «Para el leader». En el humo hay que mirar que Pingo caiga a 24 pt del borde izquierdo de la escena y en su borde superior, y que el candado no se descoloque.

### HEAD re-revisado

`02fa4921528975f964040166755c5890624ce2a4`. Al terminar:

- `git diff --stat` muestra solo `progress/current.md` (del leader, sin tocar);
- `git diff --cached --stat` está vacío;
- este informe sigue sin seguimiento y sin commit.
