---
feature: "mobile-welcome-pingo"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui-delight]
---

# Tareas — [[mobile-welcome-pingo]] (#153)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

## Reglas de todas las tareas

- **Rutas.** Los comandos se lanzan desde la raíz del repo. Los de jest
  entran antes en `mobile-pet-tracker/`. «El test de la bienvenida» es
  `mobile-pet-tracker/src/screens/welcome/index.test.tsx`.
- **Cómo medir.** Cada paso se mide con el fichero concreto y **sin pipe**,
  para que el código de salida sea el de jest:

  ```bash
  cd mobile-pet-tracker && bunx jest src/screens/welcome/index.test.tsx; echo "exit=$?"
  ```

  Ninguna ruta de esta feature lleva paréntesis, así que no hay que escapar
  nada.
- **Commits test-primero.** Cada tarea deja **dos commits** como mínimo:
  1. `test(mobile-welcome): #153 R<n> red <qué>`, solo con tests, y medido
     en rojo antes de commitear;
  2. `feat(mobile-welcome): #153 R<n> <qué>`, con la implementación, y
     medido en verde.

  Un commit que mezcle tests e implementación incumple C4 de
  `CHECKPOINTS.md`. El refactor, si lo hay, va en un tercer commit
  `refactor(mobile-welcome): …`.
- **Esperas.** Rige `docs/conventions.md` §Esperas sobre el árbol
  renderizado. Las ventanas de tiempo salen de requirements.md §Cómo se
  prueba el movimiento: se amplía la ventana, nunca la aserción.
- **Literales.** Los literales de copy, de clases y de valores se copian de
  requirements.md byte a byte. Ningún test importa el valor que comprueba.
- **Texto entero.** En RNTL 14, `toHaveTextContent` compara el texto
  entero. Toda espera de texto lleva el literal completo del catálogo, nunca
  un fragmento.
- **Estilos en los tests.** Ningún test nuevo usa `StyleSheet.flatten`. Los
  estilos animados se leen con `getAnimatedStyle` y `toEqual`, y los
  estáticos con `props.style` y `toEqual`, o con `toHaveStyle` de RNTL. El
  `StyleSheet.flatten` que ya existe (C6 de design.md) se queda como está.
- **Guards.** design-drift también recorre el test de la bienvenida. Toda
  cadena nueva, en la pantalla o en su test, cumple design.md §Guards que
  vigilan los ficheros tocados. Esos bloques se miden en T0 y en T13.
- **Trazabilidad.** Tras el commit verde de cada tarea, rellena su fila en
  `specs/mobile-welcome-pingo/traceability.md`.
- **Si algo no cuadra con la spec, para.** Escríbelo en
  `progress/impl_mobile-welcome-pingo.md` y no improvises.

## T0 — Arranque

Antes de escribir nada, comprueba estas anclas. Cada comando lleva al lado
su salida esperada. **Si alguna no da lo esperado, para y repórtalo**: la base
no es la que la spec supone.

| # | Comando | Salida esperada |
|---|---|---|
| A1 | `test -f mobile-pet-tracker/src/theme/motion.ts && echo ok` | `ok` (#152 mergeado) |
| A2 | bloque A2, debajo de la tabla | `8` |
| A3 | `grep -cF "it('no exporta nada más'" mobile-pet-tracker/src/theme/__tests__/motion.test.ts` | `1` |
| A4 | `test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok` | `ok`. Si falla, no lo borres tú: pídeselo al humano |
| A5 | `grep -cF "+ 8, // #118 R1" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | `1` |
| A6 | `grep -cF "{ file: 'src/screens/welcome/index.tsx', key: 'welcome.legalNotice' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | `1` |
| A7 | `grep -cF "it('resuelve las 8 ocurrencias de welcome'" mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `1` |
| A8 | `grep -cF "'welcome.legalNotice':" mobile-pet-tracker/src/i18n/catalog.ts` | `2` |
| A9 | `grep -cF "**6. Idioma:" docs/ui-guidelines.md` | `1` |
| A10 | `grep -cF "## Checklist de autocrítica (cierra toda pantalla nueva o modificada)" docs/ui-guidelines.md` | `1` |
| A11 | `grep -cF "**7. " docs/ui-guidelines.md` | `0` |
| A12 | `grep -cF "### §2.19" specs/mobile-ui-language/design.md` | `1` |
| A13 | `grep -cF "## 3. La infraestructura" specs/mobile-ui-language/design.md` | `1` |
| A14 | `grep -cF "describe('R10', () => {" mobile-pet-tracker/src/screens/welcome/index.test.tsx` | `1` |
| A15 | `grep -cF "it('apila los siete bloques en orden'" mobile-pet-tracker/src/screens/welcome/index.test.tsx` | `1` |
| A16 | `grep -cF "it('pinta hero, marca, tagline y legal con sus clases'" mobile-pet-tracker/src/screens/welcome/index.test.tsx` | `1` |
| A17 | `grep -cF "'w-full rounded-xl bg-accent'" mobile-pet-tracker/src/screens/welcome/index.test.tsx` | `1` |
| A18 | `ls /home/claude/pet-tracker-mascot/webp/` | `pingo-wave-blink.webp  pingo-wave.webp` |
| A19 | bloque A19, debajo de la tabla | `0` |
| A20 | bloque A20, debajo de la tabla | `0` |

Los comandos con `|` van aquí, fuera de la tabla, para copiarlos tal cual:

```bash
# A2. Esperado: 8
grep -cE '^export const MOTION_(FEEDBACK_MS|TRANSITION_MS|SURFACE_MS|STAGGER_MS|ENTRANCE_OFFSET_Y|SETTLE_SPRING|FADE_TIMING|FILL_TIMING)\b' mobile-pet-tracker/src/theme/motion.ts
# A19. Esperado: 0
ls mobile-pet-tracker/assets/images | grep -cE '^(pingo|mascot)-'
# A20: #152 R9 sobre motion.ts. Esperado: 0
grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/theme/motion.ts
```

Mide también los dos primeros bloques de design.md §Guards que vigilan los
ficheros tocados (pantalla y test). Cada salida debe dar su «Esperado».

Después:

1. Apunta en `progress/impl_mobile-welcome-pingo.md` el resultado de
   `git rev-parse HEAD`. Es el **HEAD del handoff**, la base del diff de R13.
2. Mide en verde, sin pipe, los cuatro ficheros de test que vas a tocar:
   - `src/screens/welcome/index.test.tsx`
   - `src/theme/__tests__/motion.test.ts`
   - `src/providers/__tests__/language-provider.test.tsx`
   - `src/__tests__/ui-language.test.ts`

   Si alguno nace rojo, para y repórtalo.

## Orden

El orden es R2, R4, R3, R1, R5, R6, R7, R8, R9, R10, R11, R12, R13 y R14.
Se aparta del orden numérico para que ningún test asevere un nodo que todavía
no existe:

- los dos `it` de R1 que leen el bocadillo (`pinta el saludo en el bocadillo
  …`) se escriben en T5, que es donde nace `welcome-bubble-text`;
- las filas C2 y C3 también van en T5, porque `checkUses` solo pasa cuando la
  pantalla ya llama a `t('welcome.pingoGreeting')`.

## T1 — R2: la voz de Pingo en la carta

- [ ] (1) **Test rojo.** Añade al test de la bienvenida el describe
  `#153 R2: la carta escribe la voz de Pingo` con sus tres `it` literales de
  requirements.md R2.
  - Rojo esperado: los tres `it`, por aserción. El punto 7 no existe (A11).
  - Commit: `test(mobile-welcome): #153 R2 red pingo voice in the charter`.
- [ ] (2) **Implementación mínima.** Inserta en `docs/ui-guidelines.md` el
  bloque literal de R2 justo antes de la línea del ancla A10, separado por
  una línea en blanco arriba y abajo. No toques §Animación ni el final del
  fichero, que son de #152.
  - Commit: `feat(mobile-welcome): #153 R2 pingo voice in the charter`.
- [ ] (3) **Refactor.** No aplica.

## T2 — R4: las constantes de Pingo en `motion.ts`

- [ ] (1) **Test rojo.** En `mobile-pet-tracker/src/theme/__tests__/motion.test.ts`:
  - añade el describe `#153 R4: las constantes de Pingo viven en motion.ts`
    con sus tres `it` de requirements.md R4;
  - en el `it` `no exporta nada más` de #152 R1, cambia la lista literal a
    los trece nombres ordenados (fila C4).

  Rojo esperado: los tres `it` nuevos (valor `undefined`) y
  `no exporta nada más` (8 frente a 13).

  Medición: `bunx jest src/theme/__tests__/motion.test.ts; echo "exit=$?"`.

  Commit: `test(mobile-welcome): #153 R4 red pingo motion constants`.
- [ ] (2) **Implementación mínima.** Añade a
  `mobile-pet-tracker/src/theme/motion.ts` las cinco constantes de la tabla
  de R4, con sus nombres y valores exactos y tras las de #152. Cada una lleva
  un comentario `// #153 R4`.

  Commit: `feat(mobile-welcome): #153 R4 pingo motion constants`.
- [ ] (3) **Refactor.** No aplica.

## T3 — R3: las dos poses en WebP

- [ ] (1) **Test rojo.** Añade al test de la bienvenida el describe
  `#153 R3: las poses entran como WebP`, con el `it.each` y el `it`
  `no mete otras poses de Pingo` de requirements.md R3.
  - Rojo esperado:
    - los dos casos del `it.each` fallan con `ENOENT`, porque el fichero no
      existe;
    - `no mete otras poses de Pingo` falla por aserción: `[]` frente a la
      lista de dos.
  - Commit: `test(mobile-welcome): #153 R3 red pingo webp poses`.
- [ ] (2) **Implementación mínima.** Copia los dos ficheros, sin
  reconvertirlos:

  ```bash
  cp /home/claude/pet-tracker-mascot/webp/pingo-wave.webp /home/claude/pet-tracker-mascot/webp/pingo-wave-blink.webp mobile-pet-tracker/assets/images/
  ```

  Si el sandbox no te deja leer esa carpeta, para y pídele la copia al
  humano (pregunta G2 de requirements.md).

  Commit: `feat(mobile-welcome): #153 R3 pingo webp poses`.
- [ ] (3) **Refactor.** No aplica.

## T4 — R1: el saludo en el catálogo y en la tabla de idioma

- [ ] (1) **Test rojo.**
  - Añade al test de la bienvenida el describe
    `#153 R1: el saludo de Pingo existe en los dos idiomas`, con sus `it`:
    - `declara el saludo en inglés y en español`;
    - `no exclama ni lleva emoji en ningún idioma`;
    - `registra la clave en la tabla de mobile-ui-language`.

    Los dos `it` del bocadillo esperan a T5.
  - Aplica la fila C1 en
    `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`.

  Rojo esperado:
  - los tres `it` de R1;
  - el `it` de recuento de `language-provider.test.tsx`, que pide una clave
    más.

  Commit: `test(mobile-welcome): #153 R1 red pingo greeting copy`.
- [ ] (2) **Implementación mínima.**
  - Añade `'welcome.pingoGreeting'` a `en` y a `es` de
    `mobile-pet-tracker/src/i18n/catalog.ts`, justo tras
    `'welcome.legalNotice'` en cada idioma, con los literales de
    requirements.md §Copy final.
  - Inserta en `specs/mobile-ui-language/design.md` la sección §2.20 de R1,
    entre la tabla de §2.19 y `## 3. La infraestructura`.

  Commit: `feat(mobile-welcome): #153 R1 pingo greeting copy`.
- [ ] (3) **Refactor.** No aplica.

## T5 — R5: la escena sustituye al logo

- [ ] (1) **Test rojo.** En el test de la bienvenida:
  - añade el describe `#153 R5: la escena de Pingo sustituye al logo` con
    sus cuatro `it`;
  - añade al describe `#153 R1` los dos `it`
    `pinta el saludo en el bocadillo en español` y
    `pinta el saludo en el bocadillo en inglés`;
  - aplica C5 y C6.

  Aplica también:
  - C2 en `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`;
  - C3 en `mobile-pet-tracker/src/__tests__/ui-language.test.ts`.

  Rojo esperado:
  - **Por consulta** (`getByTestId` no encuentra el nodo): los `it` de R5 que
    leen `welcome-scene` o `welcome-bubble`, los dos de R1 y C5.
  - **Por aserción:**
    - `ya no pinta el logo`, porque `welcome-hero` sigue ahí;
    - en `ui-language.test.ts`, el `it` de C3 y
      `resuelve cada ocurrencia de la tabla contra la clave exacta`, porque
      la pantalla aún no usa la clave.

  Medición:

  ```bash
  cd mobile-pet-tracker && bunx jest src/screens/welcome/index.test.tsx src/__tests__/ui-language.test.ts; echo "exit=$?"
  ```

  Commit: `test(mobile-welcome): #153 R5 red pingo scene replaces the logo`.
- [ ] (2) **Implementación mínima.** En
  `mobile-pet-tracker/src/screens/welcome/index.tsx`:
  - borra `welcome-hero` y su `require` de `splash-icon.png`;
  - pinta `welcome-scene`, `welcome-bubble` y `welcome-bubble-text` con la
    tabla de nodos de R5, importando `Card` de `'../../components/card'`.

  Para que la escena tenga sus dos hijos, crea ya `welcome-pingo` como
  `Animated.View` con `style={{ width: 200, height: 200 }}` y sin hijos. T6
  lo rellena y T9 le pone su estilo animado.

  Commit: `feat(mobile-welcome): #153 R5 pingo scene replaces the logo`.
- [ ] (3) **Refactor.** No aplica.

## T6 — R6: la pose y la capa de parpadeo

- [ ] (1) **Test rojo.** Añade el describe
  `#153 R6: Pingo se pinta con su pose y su capa de parpadeo` con sus tres
  `it` (el segundo es un `it.each` de dos filas).
  - Rojo esperado: todos por consulta, porque `welcome-pingo-wave` y
    `welcome-pingo-blink` no existen.
  - Commit: `test(mobile-welcome): #153 R6 red pingo pose and blink layer`.
- [ ] (2) **Implementación mínima.** Dentro de `welcome-pingo`, pinta:
  - `welcome-pingo-wave`;
  - `welcome-pingo-blink`, con su hijo `welcome-pingo-blink-image`.

  Sigue R6 al pie de la letra. Para que la capa nazca cerrada, crea ya
  `pingoBlink = useSharedValue(0)` y `blinkStyle` como dice R11, sin
  animarlo todavía.

  Commit: `feat(mobile-welcome): #153 R6 pingo pose and blink layer`.
- [ ] (3) **Refactor.** No aplica.

## T7 — R7: el labio del CTA primario

- [ ] (1) **Test rojo.**
  - Aplica C7.
  - Añade el describe `#153 R7: el CTA primario tiene cuerpo` con sus dos
    `it`.

  Rojo esperado: el `it` de C7 y `declara el labio en el CTA primario`, los
  dos por aserción. `deja el CTA secundario sin labio` **nace verde**: es un
  candado.

  Commit: `test(mobile-welcome): #153 R7 red primary cta lip`.
- [ ] (2) **Implementación mínima.** Pon en `welcome-get-started` la
  `className` exacta de R7.

  Commit: `feat(mobile-welcome): #153 R7 primary cta lip`.
- [ ] (3) **Refactor.** No aplica.

## T8 — R8: la entrada con las constantes de `motion.ts`

- [ ] (1) **Test rojo.** En el test de la bienvenida, aplica C8:
  - borra el describe `R10` de #118 entero;
  - quita `WELCOME_ENTRANCE_MS` y `WELCOME_ENTRANCE_EASING` del import de
    `'./index'`;
  - añade el describe `#153 R8: el contenido entra con las constantes de motion.ts`
    con sus cinco `it`.

  Añade también el doble de `withRepeat` y el alias `mockWithRepeat` de
  requirements.md §Cómo se prueba el movimiento. Ningún otro export de
  Reanimated se dobla.

  Rojo esperado, todo por aserción:
  - `exporta solo la pantalla`;
  - `usa el fundido y el muelle de motion.ts`;
  - `arranca invisible y desplazado 12 puntos sin reduce motion`, porque hoy
    son 16.

  Los otros dos `it` pueden nacer verdes: son candados del final del
  movimiento.

  Commit: `test(mobile-welcome): #153 R8 red entrance from motion.ts`.
- [ ] (2) **Implementación mínima.** Sigue R8:
  - importa `MOTION_FADE_TIMING`, `MOTION_SETTLE_SPRING` y
    `MOTION_ENTRANCE_OFFSET_Y` de `'../../theme/motion'`;
  - borra `WELCOME_ENTRANCE_MS` y `WELCOME_ENTRANCE_EASING`;
  - deja el `translateY` en manos del muelle, y solo sin reduce motion.

  Commit: `feat(mobile-welcome): #153 R8 entrance from motion.ts`.
- [ ] (3) **Refactor.** Comprueba que `Easing` ya no se importa si no se
  usa, y que `bunx tsc --noEmit; echo "exit=$?"` da `exit=0`.

## T9 — R9: el muelle de escala de Pingo

- [ ] (1) **Test rojo.** Añade el describe
  `#153 R9: Pingo entra con un muelle de escala` con sus cuatro `it`.
  - Rojo esperado: los cuatro `it`, por aserción. Antes de T9,
    `welcome-pingo` solo tiene `{ width: 200, height: 200 }` (T5), así que
    `getAnimatedStyle` no devuelve `transform`, y la fuente no tiene
    `pingoScale`.
  - Commit: `test(mobile-welcome): #153 R9 red pingo entrance scale`.
- [ ] (2) **Implementación mínima.**
  - Crea `pingoScale` y `pingoStyle` como dice R9.
  - Crea ya `pingoFloatY = useSharedValue(0)` sin animarlo, porque
    `pingoStyle` lo lee. Lo anima T10.
  - Cambia el estilo de `welcome-pingo` a
    `style={[pingoStyle, { width: 200, height: 200 }]}`.

  Commit: `feat(mobile-welcome): #153 R9 pingo entrance scale`.
- [ ] (3) **Refactor.** No aplica.

## T10 — R10: la flotación

- [ ] (1) **Test rojo.** Añade el describe `#153 R10: Pingo flota en bucle`
  con sus cuatro `it`.
  - Rojo esperado, por aserción:
    - `sube 4 puntos en medio ciclo sin reduce motion`;
    - `repite la flotación sin fin y en vaivén`;
    - `usa la flotación de motion.ts`.

    `con reduce motion no flota` nace verde y es un candado.
  - Commit: `test(mobile-welcome): #153 R10 red pingo idle float`.
- [ ] (2) **Implementación mínima.** Arranca la flotación de R10 en el
  efecto de montaje, solo sin reduce motion. Importa `MOTION_FLOAT_OFFSET_Y`
  y `MOTION_FLOAT_TIMING`.

  Commit: `feat(mobile-welcome): #153 R10 pingo idle float`.
- [ ] (3) **Refactor.** No aplica.

## T11 — R11: el parpadeo

- [ ] (1) **Test rojo.** Añade el describe
  `#153 R11: Pingo parpadea cada cuatro segundos` con sus cuatro `it`.
  - Rojo esperado, por aserción:
    - `cierra los ojos a los 4 s y los abre 150 ms después`, en el control
      de 4100 ms;
    - `repite el parpadeo sin fin`;
    - `usa el intervalo y el cambio de motion.ts`.

    `con reduce motion no parpadea` nace verde y es un candado.
  - Commit: `test(mobile-welcome): #153 R11 red pingo blink`.
- [ ] (2) **Implementación mínima.** Arranca el parpadeo de R11 en el mismo
  efecto que la flotación, solo sin reduce motion. Importa
  `MOTION_BLINK_INTERVAL_MS`, `MOTION_BLINK_TIMING` y `MOTION_FEEDBACK_MS`.

  Commit: `feat(mobile-welcome): #153 R11 pingo blink`.
- [ ] (3) **Refactor.** No aplica.

## T12 — R12: la parada de los bucles la hace Reanimated

- [ ] (1) **Test.** Añade el describe
  `#153 R12: la parada de los bucles la hace Reanimated` con su `it`
  `no cancela a mano ni devuelve limpieza`. **Nace verde**: es el candado de
  una decisión (R12) y no tiene rojo honesto.
  - Si nace rojo, una tarea anterior metió `cancelAnimation` o un
    `return () =>` en la pantalla. Para y repórtalo.
  - No añadas una limpieza para provocar el rojo. La sonda la hace el
    reviewer (abajo).
  - Commit: `test(mobile-welcome): #153 R12 lock no manual loop cleanup`.
- [ ] (2) **Implementación.** No aplica: Reanimated para los bucles al
  desmontar.
- [ ] (3) **Refactor.** No aplica.

**Sonda del reviewer para R12.** Dos mutaciones, cada una por separado:

1. añade `cancelAnimation` a la lista del import de
   `'react-native-reanimated'` en `src/screens/welcome/index.tsx`;
2. añade `return () => {};` al final del efecto de montaje.

Con cada una, el `it` sale rojo por aserción (1 frente a 0). Después de cada
una, restaura con
`git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`, y
comprueba que `git diff --cached --stat` y `git diff --stat` quedan vacíos.

## T13 — R13: sin dependencias nuevas

- [ ] (1) **Test.** Añade el describe
  `#153 R13: Pingo no trae dependencias nuevas` con su `it`. **Nace verde**:
  es un candado negativo y no tiene rojo honesto.
  - No edites `package.json` para provocar el rojo. La sonda la hace el
    reviewer (abajo).
  - Commit: `test(mobile-welcome): #153 R13 lock no new animation deps`.
- [ ] (2) **Implementación.** No aplica. Comprueba
  `git diff --stat <HEAD del handoff> -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`:
  la salida esperada es vacía.
- [ ] (3) **Cierre técnico.** Mide en verde, sin pipe:

  ```bash
  cd mobile-pet-tracker && bunx jest src/screens/welcome/index.test.tsx src/theme/__tests__/motion.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts; echo "exit=$?"
  ```

  Después, `bunx tsc --noEmit; echo "exit=$?"` y
  `bun run lint; echo "exit=$?"`. Los tres dan `exit=0`. El `./init.sh`
  completo lo corre el leader, no tú.

  Por último, repite los tres bloques de design.md §Guards que vigilan los
  ficheros tocados (pantalla, test y `motion.ts`). Apunta cada salida en
  `progress/impl_mobile-welcome-pingo.md` junto a su «Esperado».

**Sonda del reviewer para R13.** Añade
`"lottie-react-native": "0.0.0"` a `dependencies`, corre el describe y
comprueba que sale rojo. Después restaura con
`git checkout HEAD -- mobile-pet-tracker/package.json`, y comprueba que
`git diff --cached --stat` y `git diff --stat` quedan vacíos.

## T14 — R14: smoke del humano

- [ ] Lo corre el humano en un **dev build de Android**, con los pasos de
  requirements.md R14, y lo firma en su casilla de §Aprobación. Ninguna IA lo
  marca. Codex no tiene nada que hacer aquí, salvo dejar en
  `progress/impl_mobile-welcome-pingo.md` la línea
  `R14: pendiente del smoke humano`.
