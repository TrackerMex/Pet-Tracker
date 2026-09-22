# Handoff a Codex CLI — #106 + #107 `mobile-meals-bar-motion`

> Escrito por el `leader` el 2026-09-21. Pégale a Codex CLI todo lo que va
> debajo de la línea. El handoff es por disco: Codex no ve la conversación que
> originó la spec y el `leader` no ve el output de Codex.

---

Feature: **mobile-meals-bar-motion**, que cubre **dos entradas** del
`feature_list.json`: **#106** (barra animada y haptics) y **#107** (candado del
feedback de pulsado). Branch: `feature/106-mobile-meals-bar-motion`, ya creada
y con la spec dentro, cortada de `main` en `9df7b5bc`.

Spec **aprobada y firmada por el humano** en `ca13a804`:
`specs/mobile-meals-bar-motion/requirements.md` (`status: approved`).
Lee también `design.md`, `tasks.md` y `traceability.md` del mismo directorio.
**`tasks.md` es el guion**: trae el orden exacto de los cinco requisitos, con
el test rojo, la implementación mínima y el refactor de cada uno.

## Antes de escribir una sola línea

1. Carga las skills de tu plugin `expo`: **`expo-overview` primero**, después
   **`expo-animation`**. `docs/ui-guidelines.md` lo exige para todo trabajo de
   movimiento y es el gate C8.
2. Docs de Expo **pinneadas a la versión**: `https://docs.expo.dev/versions/v57.0.0/`.
   Nunca `latest`: documenta APIs que este proyecto no tiene.
3. `rm -f mobile-pet-tracker/.expo/types/router.d.ts` antes de cualquier
   typecheck. Está gitignorado y rompe `tsc` con rutas fantasma.
4. Lee `docs/conventions.md` y `docs/ui-guidelines.md` enteras.

## Reglas críticas

1. **TDD por requisito, un commit por requisito como mínimo, el test rojo
   ANTES que su implementación.** Un único commit con todo incumple C4 de
   `CHECKPOINTS.md`. En #19 pasó exactamente eso y hubo que rehacerlo.
2. **Rellena `specs/mobile-meals-bar-motion/traceability.md` tras cada
   commit**, las dos últimas columnas. El `reviewer` no aprueba con una fila
   en «pendiente» (C5).
3. **No rebasees después de rellenar la trazabilidad.** Los hashes dejarían de
   ser ancestros de HEAD y el `reviewer` lo detecta con
   `git merge-base --is-ancestor`.
4. **No lances `./init.sh`.** Postgres y LocalStack son compartidos con el
   worktree `Pet-Tracker-wt-ui`, donde hay otra feature en vuelo (#94); dos
   `init.sh` a la vez se pisan y producen rojos falsos. Corre las suites
   directamente con `bunx jest`.
5. **`bun` para todo lo móvil**: `bunx`, `bun add`, `bunx expo install`.
   Nunca `npx`, nunca `npm i -g`, nunca una versión escrita a mano.
6. **`(tabs)` sin escapar es una regex para jest.** Un comando como
   `bunx jest src/app/(tabs)/__tests__/food.test.tsx` **se salta el fichero en
   silencio y sale con código 0**. Usa `--runTestsByPath` o escapa los
   paréntesis. Esto ya dio un falso verde en este repo.
7. **Mide los exit codes sin pipe.** `bunx jest | tail` devuelve el código de
   `tail`, no el de jest.
8. No crees recursos AWS ni corras `cdk deploy`. Eso es del humano.
9. **No marques ninguna feature como `done`, no mergees y no abras PR.** El
   cierre lo hace el `leader` tras el veredicto del `reviewer` y la prueba de
   humo del humano.

## Lo que el humano autorizó explícitamente al firmar

Las tres cosas están en `requirements.md` §Qué firma el humano al aprobar esta
spec. No son opcionales y no hace falta volver a preguntarlas:

1. **Instalar `expo-haptics`** con `bunx expo install expo-haptics`. Es la
   única dependencia nueva de esta feature y está autorizada.
2. **Enmendar `docs/ui-guidelines.md:171`**, que hoy dice literalmente
   «expo-haptics NO está instalado; toda propuesta que lo requiera lo declara
   como dependencia nueva en su spec». En cuanto instales el paquete esa línea
   miente, y la carta es el gate C8. **La redacción exacta de la enmienda está
   en R1**: úsala tal cual, no la reescribas.
3. Que el dev build de Android del humano queda obsoleto. Eso lo regenera él,
   tú no.

**Lo que NO se toca**: las cinco specs viejas que afirman que `expo-haptics`
no está instalado (`mobile-device-pairing`, `mobile-home-weekly-activity`,
`mobile-home-reminders-section`, `mobile-tab-glass`, `mobile-meals-served-ui`).
Eran ciertas cuando se firmaron; una spec aprobada es un documento fechado, no
un wiki. Tocarlas incumple C6. La spec lo decide así en R1 y lo razona.

## Los cinco requisitos

El orden de `tasks.md` es **R1 → R4 → R5 → R2 → R3**, y no es alfabético por
una razón: evita que un requisito asevere nodos que su propio orden no ha
creado todavía. Respétalo.

| R | Entrada | Qué cierra |
|---|---|---|
| R1 | #106 | `expo-haptics` declarada, sin `babel.config.js`, carta enmendada |
| R4 | #106 | háptico de éxito/error al servir y al deshacer |
| R5 | #107 | candado del feedback de pulsado del `meal-toggle` |
| R2 | #106 | el relleno de la barra transiciona su ancho con `withTiming` |
| R3 | #106 | con reduce motion el ancho se fija sin animar |

## Tres trampas concretas de esta feature

**R5 es requisito de verificación por la vía (b) de C4.** El `style` que hay
que candar **ya está en producción** (`src/app/(tabs)/food.tsx:253-255`), así
que un test escrito de frente nace verde y no prueba nada. Por eso su **commit
rojo contiene la mutación de producción** —quitar ese `style`— y el verde la
revierte exactamente como estaba. **El diff neto de `food.tsx` por R5 es
cero.** Si entregas R5 con un test que nunca estuvo rojo, el `reviewer` lo
rechaza.

**No intentes aseverar `props.style` como función.** Está medido y refutado en
la spec: en un `Pressable` con `style` de función, `props.style` llega
**resuelto** (`{opacity: 1}`), y `fireEvent(el, 'pressIn')` no lo cambia. El
camino que prescribe la spec es la regex sobre el fuente, tolerante al
formato. No la cambies por «una forma más limpia» sin medirla antes.

**Dos candados existentes se mueven, y sus valores nuevos están declarados**:
`src/screens/home/index.test.tsx:3697` y `:3716-3718` pasan de
`toEqual({width})` a `toHaveAnimatedStyle({width})`, porque en un componente
animado `props.style` pasa a ser `[{width:'50%'}]`. La línea `:3696`, que
asevera el `className`, **no se toca**: el `className` sobrevive idéntico.
Cualquier otro candado que se te ponga rojo **no es un candado que haya que
mover, es un fallo tuyo** — páralo y anótalo en el reporte.

Un apunte de vocabulario para que no busques lo que no existe: el procesador
de `className` en este repo es **uniwind**, no NativeWind.

## Al terminar

Escribe `progress/impl_mobile-meals-bar-motion.md` con:

- Los dos comandos de verificación finales y su **exit code medido sin pipe**:
  `bunx jest` sin filtro y `bunx tsc --noEmit`.
- El delta de suites y tests contra `9df7b5bc` (no un recuento absoluto: los
  absolutos caducan entre que se escriben y se leen).
- La **evidencia de las sondas de mutación** de R2, R4 y R5: qué mutaste, qué
  se puso rojo y cuántas suites.
- Los dos candados movidos, con su valor viejo y su valor nuevo.
- Cualquier decisión que tuvieras que tomar y que la spec no cerrara, marcada
  como tal para que el `reviewer` la mire.

El detalle de cierre está en `tasks.md` §Cierre.
