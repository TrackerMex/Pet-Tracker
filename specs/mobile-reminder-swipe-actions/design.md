---
feature: "mobile-reminder-swipe-actions"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-reminder-swipe-actions]] (#228)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. La UI se
> rige por `docs/ui-guidelines.md`. Rutas relativas a `mobile-pet-tracker/src/`.

## Decisiones técnicas

- **D1. `ReanimatedSwipeable`, importado por defecto desde
  `react-native-gesture-handler/ReanimatedSwipeable`.** Sirve a R2, R9 y R11.
  - HeroUI Native 1.0.8 no trae `SwipeableRow` (ningún componente de
    `node_modules/heroui-native` lo nombra). RNGH `~2.32.0` ya está instalada y
    `src/app/_layout.tsx` ya monta `GestureHandlerRootView`.
  - El deslizamiento corre en el hilo de UI (Reanimated). No hay `setState`
    por fotograma: React solo se entera al pulsar el panel.
  - Props: `testID` (RNGH lo pone en un `View` que envuelve el componente),
    `overshootRight={false}` (sin rebote al pasar del ancho del panel) y
    `renderRightActions`. Sin `renderLeftActions`, sin `friction` ni umbrales
    propios: valen los de RNGH.
  - El import es por ruta de subpaquete. `from 'react-native-gesture-handler'`
    sigue en 0 en la pantalla (R11), para que el doble de jest cubra todo lo
    que la pantalla usa de RNGH.

- **D2. `renderRow` construye la fila en una constante y decide al final si la
  envuelve.** Sirve a R2 a R8.
  - Variables nuevas al principio de `renderRow`, tras `time`:
    - `deleting = deletingId === reminder.id`;
    - `actionName = isSeries ? 'cancelSeries' : 'delete'`;
    - `actionText = isSeries ? t('reminders.cancelSeries') : t('reminders.delete')`;
    - `openAction()`, con las dos ramas que hoy tiene el `onPress` del botón,
      sin cambiarlas: en una serie, `setActionError(null)`,
      `setDeleteCandidate(null)` y `setCancelCandidate(reminder)`; si no,
      `setCancelCandidate(null)` y `confirmDelete(reminder)`.
  - El `return (` de la fila pasa a `const row = (`. El `View`
    `reminder-row-<id>` conserva su `className` y su `style={CONTINUOUS_CORNER}`
    y gana:
    - `accessible`;
    - `accessibilityActions={isOwner && !deleting ? [{ name: actionName, label: isSeries ? t('reminders.cancelSeriesA11y', { title: reminder.title }) : actionText }] : undefined}`;
    - `onAccessibilityAction={(event) => { if (isOwner && !deleting && event.nativeEvent.actionName === actionName) openAction(); }}`.
  - Se borra entero el bloque `{isOwner ? (<Button …>…</Button>) : null}`.
    El import `import { Button, Skeleton } from 'heroui-native';` no cambia
    (quedan 8 `<Button`).
  - Tras la fila, `if (!isOwner) return row;` y, para el dueño, este
    esqueleto (los literales cuentan para R10 y R11):

    ```tsx
    <View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>
      <ReanimatedSwipeable
        testID={`reminder-swipe-${reminder.id}`}
        overshootRight={false}
        renderRightActions={(_progress, _translation, swipeable) => (
          <Pressable
            testID={isSeries ? `reminder-cancel-series-${reminder.id}` : `reminder-delete-${reminder.id}`}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className={`w-24 items-center justify-center gap-1 ${CATEGORY_SLOTS.rose.surface}`}
            disabled={deleting}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            onPress={() => { swipeable.close(); openAction(); }}
          >
            <View className={`absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}`} />
            {isSeries ? <Repeat size={20} color={danger} /> : <Trash size={20} color={danger} />}
            <Text className="text-center text-13 font-extrabold text-danger">{actionText}</Text>
          </Pressable>
        )}
      >
        {row}
      </ReanimatedSwipeable>
    </View>
    ```

  - Los dos sitios que llaman a `renderRow` (Próximos y Pasados, cada uno
    dentro de su `RiseIn` `reminders-entry-<id>`) no cambian. El contenedor
    queda entre `RiseIn` y el deslizable.

- **D3. El contenedor recorta y redondea; la fila conserva su forma.** Sirve a
  R2 y R6.
  - `overflow-hidden rounded-22` con `CONTINUOUS_CORNER` recorta el panel a la
    misma esquina que la fila (22, continua), como el `.sw` del canvas.
  - El contenedor **no** lleva fondo. El `.sw` del canvas pinta
    `background: var(--rose)`, pero la fila pasada va al 50 % (`#227 R7`) y
    dejaría ver el rosa a través de toda la fila. En su lugar, la franja de D4.

- **D4. La franja rosa tapa la esquina de la fila.** Sirve a R3 y R10.
  - Cuando la fila se desplaza, su esquina derecha redonda deja un hueco entre
    la fila y el panel. El canvas lo tapa con el fondo rosa del contenedor.
  - Aquí lo tapa un `View` hijo del panel, `absolute inset-y-0 -left-6 w-6`
    sobre `CATEGORY_SLOTS.rose.surface`: 24 de ancho, pegado por fuera al
    borde izquierdo del panel. Queda detrás de la fila (RNGH pinta las acciones
    antes que la fila) y en reposo no se ve: RNGH pone a opacidad 0 el
    contenedor de las acciones mientras está cerrado.
  - El panel no lleva `overflow-hidden`, para que la franja salga de él.

- **D5. Accesibilidad.** Sirve a R5 y R7.
  - El panel solo se ve tras deslizar, así que se oculta a los lectores
    (`accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`).
  - La fila pasa a `accessible` y expone una acción con nombre propio:
    `delete` o `cancelSeries`. Las etiquetas son las de hoy: «Eliminar» y el
    `accessibilityLabel` del botón de serie («Cancelar la serie <título>»).
  - La acción se retira mientras `deleting` (el botón de hoy ya se deshabilitaba)
    y el manejador la ignora si llega igual. Quien no es dueño no recibe
    acciones y el manejador también lo comprueba.
  - `activate` y cualquier otro nombre no hacen nada: la fila no es un botón.

- **D6. Desvíos del canvas.** Sirve a R10.
  - Sin la animación `peek` (`.sw .card{transform: translateX(-96px); animation: peek …}`):
    es un recurso del artboard para mostrar el estado abierto, no un
    comportamiento pedido. Con frecuencia de uso alta, la regla de
    `expo-animation` es no animar.
  - Sin `line-height: 1.15`: no hay token de interlineado y una clase
    arbitraria la vetan los guards. «Cancelar\nserie» ya parte en dos líneas
    con la clave de hoy.
  - `Repeat` sin la raya diagonal del artboard: `reicon-react-native` no trae
    ese icono y dibujarlo sería un SVG nuevo. Es el mismo icono de la hoja de
    Cancelar serie (`#213 R17`).
  - Color de pulsado: opacidad 0,8 con el patrón `({ pressed }) => …` que la
    pantalla ya usa una vez (`opacity: pressed` pasa de 1 a 2).

- **D7. Estrategia de jest.** Sirve a R2 a R9.
  - El doble va en `screens/reminders/index.test.tsx` con `jest.mock` no
    virtual: el módulo existe, y un `jest.mock` virtual de un módulo real
    envenena la caché de IDs (memoria `flake-tinte-0d1117-bajo-carga`).
  - Pinta siempre el panel, delante de la fila, para que los tests lean el
    panel sin simular gestos. Registra las props en `mockSwipeable` y pasa un
    `close` espía (`mockSwipeableClose`) como tercer argumento.
  - Una bandera, `mockRealSwipeable`, hace que delegue en
    `jest.requireActual(…).default`. Solo R9 la activa; un `afterEach` la
    devuelve a `false`.
  - El factory devuelve `{ __esModule: true, default: … }` (memoria
    `doble-reanimated-sin-esmodule`: sin `__esModule` la importación por
    defecto cae en el objeto entero).

## Archivos afectados

Capa de presentación móvil. Ni dominio, ni aplicación, ni infraestructura, ni
backend.

| Archivo | Cambio | Requisitos |
|---|---|---|
| `screens/reminders/index.tsx` | D1 a D5 | R2 a R11 |
| `screens/reminders/index.test.tsx` | T0 (doble y `HIDDEN`), `describe` nuevo, enmiendas | R2 a R9, R13 |
| `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts` (nuevo) | R1, R10, R11, R12 (tras G4), R13 | R1, R10 a R13 |
| `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts` | inventario `#227 R11` | R13 |
| `__tests__/consistency-classnames.test.ts` | tres recuentos de esquinas | R13 |
| `__tests__/design-drift.test.ts` | radios 14 y 22 | R13 |
| `__tests__/routine-canvas-fidelity.test.ts` | se retira la fila «Eliminar» de fila | R10, R13 |
| `../docs/ui-guidelines.md` | bloque «Enmienda #228» al final (**G4**) | R12 |
| `../specs/{mobile-reminders-recurrence,mobile-reminders-upcoming-past,mobile-canvas-routine,mobile-reminders,mobile-role-aware-actions,mobile-routine-canvas-fidelity}/requirements.md` | sección «Enmienda #228» (ya en el commit de la spec) | R13 |

Sin dependencias nuevas, sin `app.json`, sin dev build nuevo.

## Skills para la implementación

`expo-animation` (receta de deslizar para borrar: acciones reveladas, sin
háptica por fotograma) y `expo-native-ui` / `expo-design-system` (tokens, sin
literales). En el handoff, el leader nombra las equivalentes del catálogo de
Codex (`.claude/agents/leader.md` §Catálogo real de skills de Codex).

## Alternativas descartadas

- **`SwipeableRow` de HeroUI.** No existe en HeroUI Native 1.0.8. Esperar a
  una versión que lo traiga deja la queja sin arreglar y cambia de dependencia.
- **`Swipeable` heredado de RNGH** (`react-native-gesture-handler/Swipeable`).
  Usa `Animated` del núcleo y RNGH lo marca como obsoleto frente a
  `ReanimatedSwipeable`.
- **`Gesture.Pan` propio con `useSharedValue`.** Más código para lo mismo:
  umbrales, cierre, velocidad y accesibilidad que `ReanimatedSwipeable` ya
  resuelve.
- **Fondo rosa en el contenedor, como el `.sw` del canvas.** Se ve a través de
  la fila pasada al 50 % (D3).
- **La franja como hermana del panel o fuera de `renderRightActions`.** Fuera
  del contenedor de acciones de RNGH no hereda su opacidad 0 en reposo y
  asomaría por las esquinas de la fila cerrada.
- **Mantener un botón de icono sin texto en la fila.** Sigue quitando ancho y
  el humano pidió deslizar.
- **Etiqueta de la acción de borrar con título («Eliminar <título>»).** Pide
  una clave nueva y G1; la fila ya anuncia su título.

## Riesgos

- **La franja se ve a través de una fila pasada mientras se desliza.** La fila
  pasada va al 50 % y la franja (24 de ancho, detrás de su borde derecho) se
  transparenta durante el gesto. Es breve y solo con la fila abierta; el paso 3
  del smoke lo mira. Si molesta, la salida es acortar la franja a la esquina
  (otra feature).
- **Gesto horizontal dentro de un `ScrollView` vertical.** RNGH arbitra los dos
  gestos; el paso 6 del smoke lo comprueba en el dispositivo. Jest no lo ve.
- **El componente real en jest.** R9 depende de que Reanimated y RNGH corran
  en el entorno de jest del proyecto (ya lo hacen en otras pantallas). Si R9
  no puede montar el real, Codex lo reporta y no lo sustituye por el doble.

### Bloque «Enmienda #228»

Bloque canónico de la enmienda a `docs/ui-guidelines.md`. Con G4, el leader lo
copia **tal cual** al final de la carta, detrás de la última sección, sin
editar líneas existentes. R12 extrae el contenido del fence `markdown` de
abajo y exige que salga una vez en la carta, tolerante a la casilla firmada.

```markdown
## Enmienda #228 — Acciones de deslizar en Recordatorios

Fecha: 2026-11-03. Feature #228 `mobile-reminder-swipe-actions`. Sustituye el punto 3 («Eliminar» de fila de recordatorio) de la Enmienda #204.

1. **Acción de fila por deslizamiento.** La fila de recordatorio del dueño ya no lleva botón «Eliminar» ni «Cancelar serie». Va dentro de `ReanimatedSwipeable` (`react-native-gesture-handler/ReanimatedSwipeable`, sin rebote: `overshootRight={false}`), envuelta en `overflow-hidden rounded-22` con `CONTINUOUS_CORNER`. Al deslizar a la izquierda aparece un panel de 96 (`w-24 items-center justify-center gap-1`) sobre `CATEGORY_SLOTS.rose.surface`, con una franja rosa `absolute inset-y-0 -left-6 w-6` bajo la esquina de la fila, el icono `Trash` (o `Repeat` en una serie programada) de 20 en `danger` y la etiqueta `text-center text-13 font-extrabold text-danger`. Al pulsar baja la opacidad a 0,8. Sin labio, sin háptica.
2. **Accesibilidad.** El panel se oculta a los lectores de pantalla y la fila expone la misma acción como acción de accesibilidad (`delete`, con la etiqueta «Eliminar», o `cancelSeries`, con «Cancelar la serie {{title}}»). Quien no es dueño no ve panel ni acción.

Detalle y tests en `specs/mobile-reminder-swipe-actions/requirements.md` (R1 a R13).

- [ ] Enmienda #228 aprobada por humano
```
