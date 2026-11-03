---
feature: "mobile-reminders-upcoming-past"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-reminders-upcoming-past]] (#227)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. La UI se
> rige por `docs/ui-guidelines.md`. Rutas relativas a `mobile-pet-tracker/src/`.

## Decisiones técnicas

- **D1. La partición es una función pura nueva, `splitReminders`, en
  `utils/reminder-dates.ts`.** Sirve a R2 y R3.
  - Vive junto a `daysUntil`, que ya define «día civil local» para la píldora,
    el badge y la etiqueta (`#84 R1`/`R2`). Así Próximos usa la misma regla de
    día que el resto de la pantalla.
  - **No** se reutiliza `upcomingReminders` de `screens/home/format.ts`, aunque
    el plan la cita como reutilizable:
    - excluye `sent`;
    - recorta a tres (`.slice(0, 3)`);
    - es de la capa de Inicio.

    Enmendarla movería los candados de Inicio sin necesidad.
  - La firma recibe `now: Date` para que la pantalla pase su estado `now`, que
    ya se refresca al enfocar (`useState(Date.now)`), y los tests fijen el día.

- **D2. La opacidad la decide la sección, no el `status`.** Sirve a R6 y R7.
  - El canvas expandido atenúa **todas** las filas de Pasados (`.past{opacity:
    .5}`), incluidas las `scheduled` de días pasados, y ninguna de Próximos.
  - Por eso `inactive ? ' opacity-50'` pasa a `past ? ' opacity-50'`.
  - Todo lo demás de la fila sigue decidido por `status` y por el día, sin
    cambio:
    - el borde ámbar y el badge «Hoy» (`#204 R7`, `#213 R16`);
    - «Enviado» / «Cancelado» o `· en N días`;
    - la línea de repetición (`#213 R14`);
    - el botón de la fila (`#213 R15`, `#216 R5`).

- **D3. Una sola función de fila, `renderRow(reminder, past)`.** Sirve a R7 y
  R12. El cuerpo del `map` actual se mueve tal cual a una función local de
  `RemindersScreen`, declarada tras `const isOwner = …`. Las dos secciones la
  llaman, y el único cambio interno es el de D2. Así Eliminar y Cancelar serie
  se mueven con su fila sin duplicarse.

- **D4. Estructura de la lista.** Sirve a R4, R5, R6, R8 y R9.
  - El envoltorio actual `<View className="gap-3">` de las filas desaparece.
  - Bajo las píldoras van:
    1. la cabecera «Próximos»;
    2. `reminders-upcoming-list` o la caja de R8;
    3. `reminders-past`, solo con pasados.
  - El resultado de la partición se llama `sections` (no `upcoming`), porque la
    fila ya tiene una variable local `upcoming` (día de hoy) que no debe
    quedar sombreada.
  - El estado de colapso es un único `useState(false)` (`pastExpanded`) junto
    a `actionError`.
  - El vacío total (`reminders-empty`) no cambia y se evalúa antes, así que R9
    no pinta secciones.

- **D5. Caja «Nada pendiente por ahora» sin animación.** Sirve a R8. El canvas
  la anima con `rise`, pero `RiseIn` en esta pantalla es de filas y sus
  candados (`#178 R7`, `#204 R6`) cuentan entradas `reminders-entry-*`. La
  caja va estática y queda fuera de alcance.

- **D6. El `gap` del marco se queda en 14.** El canvas separa los bloques con
  12. Producción usa 14 desde `#204 R4`, con candado propio, y esta feature no
  lo mueve. Las listas internas usan `gap-3` (12), el hueco de filas de hoy.

- **D7. Badge «Hoy» en lugar de «¡Próximo!».** Sirve a R7. El canvas dibuja
  «¡Próximo!» en la fila de hoy. Voz B no admite `¡` ni `!`, así que se
  conserva el badge existente `reminders.upcoming` («Hoy» / `Today`).

- **D8. Las píldoras no cambian.** «Activos», «Esta semana» e «Inactivos»
  conservan sus reglas (`#178 R5`, `#84 R3`, `#204 R5`). La diferencia entre
  «Inactivos» y el contador de Pasados es la Pregunta abierta 1.

- **D9. Nada compartido con #223.** La premisa del handoff decía que #223 no
  estaba implementado; en `230f1c9f` **sí** está en `dev`
  (`screens/alerts/index.tsx`). Aun así:
  - no se extrae un componente común ni se importa nada de Alertas;
  - se **copia** la receta (encabezado pulsable con contador y chevron,
    `accessibilityState.expanded`, colapsada por defecto).

  Extraer ahora obligaría a enmendar los candados de #223 y abriría un choque
  de API entre specs paralelas. Divergencias deliberadas respecto a Alertas:
  - `mt-1` en vez de `mt-1.5`: el canvas de esta pantalla dice `margin: 4px 0
    0`;
  - el contador lleva `TABULAR_NUMS`;
  - las listas van en `gap-3` propio;
  - el chevron va sin `testID`, por el doble de iconos (ver Convenciones);
  - el paso de entrada de las pasadas es de 30 ms
    (`MOTION_REMINDERS_PAST_STAGGER_MS`), el del canvas.

- **D10. Fixtures que no caducan.** Sirve a R13.
  - El `dueAt` por defecto de `makeReminder` pasa a ser relativo al reloj
    (`Date.now() + 3 días`). Así un recordatorio sin fecha explícita es
    próximo bajo cualquier reloj, falso o real. Bajo el reloj de
    `R6: lista…` (`2026-08-24T09:00Z`) vale exactamente lo que valía.
  - Los `describe` que usaban `canvasReminders` con reloj real (`#178 R8`,
    `#218 R1`, `#204 R6`, `#204 R8` y `#204 R9`) fijan el reloj del resto de
    pruebas del canvas (`2026-12-30T15:00Z`). Si no, `a` (`2027-01-02`) pasaría
    a Pasados el 3 de enero de 2027.
  - Las tablas nuevas usan `new Date(y, m, d, h, min)` local y cruzan mes y
    año.

- **D11. Casilla de enmienda solo donde cambia el texto de un requisito.** Las
  tres specs cuyo texto queda contradicho (`#39 R6`, `#178 R6`/`R7`,
  `#204 R6`) reciben su sección «Enmienda #227» con casilla. Los demás
  candados cambian por reloj, colapso o recuento sin contradecir su requisito,
  y llevan solo el sufijo del título (regla de `#223 R18`).

## Archivos afectados

Todo es capa de presentación móvil; no hay domain, application ni
infrastructure.

| Fichero | Qué cambia |
|---|---|
| `utils/reminder-dates.ts` | `splitReminders` e `import type { Reminder } from '../api/types';` |
| `utils/reminder-dates.test.ts` | `#227 R2`, `#227 R3` |
| `theme/motion.ts` | `MOTION_REMINDERS_PAST_STAGGER_MS = 30` |
| `theme/__tests__/motion.test.ts` | `#227 R10` y la lista de `no exporta nada más` |
| `i18n/catalog.ts` | cuatro claves en `en` y `es` |
| `__tests__/ui-copy-table.ts` | cuatro filas en `R8_REMINDERS` |
| `screens/reminders/index.tsx` | partición, cabecera, caja, sección «Pasados», `renderRow` e imports (`Pressable`, `ChevronDown`, `ChevronUp`, `TOUCH_SLOP`, la constante de movimiento y `splitReminders`) |
| `screens/reminders/index.test.tsx` | doble de iconos, `makeReminder`, `expandPast`, `describe('#227: próximos y pasados')` y las enmiendas de la tabla |
| `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts` (nuevo) | `#227 R1`, `R11`, `R13` |
| guards (`providers/__tests__/language-provider.test.tsx`, `__tests__/ui-language.test.ts`, `__tests__/design-drift.test.ts`, `__tests__/consistency-classnames.test.ts`, `__tests__/alerts-canvas-fidelity.test.ts`) | deltas de la tabla de enmiendas |
| `../specs/mobile-ui-language/design.md` | §2.40 |

Las tres specs enmendadas (`specs/mobile-reminders/`,
`specs/mobile-routine-canvas-fidelity/` y `specs/mobile-canvas-routine/`) ya
llevan su sección «Enmienda #227» y su casilla desde el commit de esta spec;
Codex no las toca.

Sin dependencias nuevas ni costo: todo usa `react-native`
(`Pressable`, `Text`, `View`), `reicon-react-native` (ya instalado) y los
tokens existentes.

## Skills para la implementación

Antes de tocar la pantalla, Codex carga las skills que la carta exige para UI
móvil. Estos son los nombres de nuestro catálogo; el leader los traduce en el
handoff a los de Codex:

- `appllama-app-design-skill`
- `expo-design-system`: tokens, sin hex ni corchetes;
- `expo-native-ui`: `Pressable`, dianas y `accessibilityState`;
- `expo-animation`: `RiseIn` y escalonado.

## Alternativas descartadas

- **Reutilizar `upcomingReminders` de Inicio.** Excluye `sent`, recorta a tres
  y es de otra pantalla (D1).
- **Dos `map` con la fila duplicada.** Duplicaría el botón y la lógica de serie;
  la fila de una sección divergiría de la otra en la siguiente feature (#228)
  (D3).
- **Componente de sección compartido con #223.** Enmienda candados de Alertas
  y crea un dueño compartido entre dos specs paralelas (D9).
- **Ordenar o partir en el backend.** La partición depende del día civil del
  dispositivo y la API ya devuelve ascendente. Cambiar el contrato no aporta
  nada a esta pantalla.
- **Un `expandPast` tolerante (que no falle si no hay toggle).** Ocultaría la
  causa de un rojo; el ayudante pulsa el toggle real y falla si no existe.
- **Opacidad por `status` en las dos secciones.** Contradice el canvas
  expandido, que atenúa también las `scheduled` de días pasados (D2).
