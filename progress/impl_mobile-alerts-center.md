# Implementación #78 — mobile-alerts-center

Fecha: 2026-09-11  
Branch: `feature/78-mobile-alerts-center`

## Trazabilidad de requisitos

| ID | Rojo | Verde | Evidencia |
|---|---|---|---|
| R1 | `ee17732b` | `f6062ed0` | `listAlerts` y mapeo de resultados por `kind` |
| R2 | `d6803629` | `02593774` | `ackAlert` con `POST` y cuerpo vacío |
| R3 | `0467146a` | `d2f10c67` | 14 claves en ambos idiomas y tabla normativa |
| R4 | `2dc14118` | `a8fa22d2` | estados de carga, error, vacío, filas y `unauthorized` de query; refuerzo de test `a08b37a9` en ronda 2 |
| R5 | `8d7b5f13` | `e9f3b126` | ruta delgada bajo `(tabs)` sin añadir pestaña |
| R6 | `e2a10a0a` | `ccefd8fe` | doce decisiones de cada fila, incluidas cardinalidad y orden de hijos; refuerzo de test `12d396fd` en ronda 2 |
| R7 | `d72ba1dd` | `3e7bebb9` | partición por estado descargado y posición estable tras ack |
| R8 | `290abc42` | `63faca32` | ack plano, overlay local, exclusión mutua y errores |
| R9 | `b4cd1f97` | `288c8c72` | `useInfiniteQuery`, cursor y guard de fin/carga |
| R10 | `73307e12` | `3ac78d34` | campana en el hero y navegación a `/alerts` |
| R11 | `bf3e6622` | `418bc7cd` | punto de abiertas y refetch al recuperar foco |
| R12 | `24d0426a` | `e1fb6ad6` | inventario de copy por clave y deltas normativos |
| R13 | `7d1bff33` | `df3b4ea2` | sonda de mutación documentada abajo; `adbfecc6` corrige pureza de render detectada por lint |
| R14 | No aplica | No aplica | Gate humano por ejecutar; no se simula ni se firma desde IA |

## Trazabilidad de enmiendas

| ID | Rojo | Verde | Evidencia |
|---|---|---|---|
| E1 | `2dc14118` | `a8fa22d2` | la pantalla usa TanStack Query; los candados heredados de #87 siguen verdes |
| E2 | `8e05f068` | `749cde81` | `alertKeys.list()` y `alertKeys.open()` canónicas |
| E3 | `b4cd1f97` | `288c8c72` | paginación con `useInfiniteQuery`, sin estado local de páginas/cursor |
| E4 | `2dc14118` | `a8fa22d2` | estados derivados de la query; `unauthorized` no pinta estado propio |
| E5 | `290abc42` | `63faca32` | llamada plana a `ackAlert` y overlay; sin `useMutation` ni `setQueryData` |
| E6 | `bf3e6622` | `418bc7cd` | campana con `useQuery` y refetch al foco |
| E7 | No aplica | No aplica | enmienda documental `ecb449ee`, contrastada con el árbol post-#87 y aprobada por humano en `4f9298e0` |
| E8 | `54b8932d` | `63faca32` | único delta heredado: fila de Alerts con una llamada a `signOut`; Home conserva cero |

E1 y E7 no definían una tarea TDD independiente. E1 queda cubierta por el
ciclo observable de R4; E7 solo reapunta referencias de la spec, por lo que se
registran sus commits documentales sin fabricar un rojo inexistente.

## R13 — conformidad y prueba de mutación

Se ejecutó la sonda exactamente en producción, dentro de
`src/screens/alerts/index.tsx`: `bg-danger-soft` se cambió por
`bg-accent-soft` y se versionó en `7d1bff33`. La suite dirigida mostró este
bloque rojo completo:

```text
● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los dieciséis usos de bg-accent-soft que sí son acento

  expect(received).toBe(expected) // Object.is equality

  Expected: 16
  Received: 17

    444 |     const docs = readSource(join('screens', 'docs', 'index.tsx'));
    445 |
  > 446 |     expect(accentSoftCount).toBe(16);
        |                             ^
    447 |     expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);
    448 |     expect(docs.match(/bg-accent-soft/g)).toBeNull();
    449 |   });

    at Object.toBe (src/__tests__/consistency-classnames.test.ts:446:29)
```

La clase se restauró a `bg-danger-soft` en `df3b4ea2`; la misma suite pasó y
`git diff` quedó vacío. La sonda demuestra que el candado de
`bg-accent-soft` observa la fila real, no un mock.

Los candados de consistencia, legibilidad y drift de #87 pasan sin relajar ni
borrar aserciones. Los deltas de copy son únicamente los exigidos por R3/R12,
expresados como sumas. El único delta del mapa de `signOut` es la fila nueva de
Alerts; la fila de Home no se movió. El grep de los ficheros de #78 queda limpio
de hex fuera del tema, clases arbitrarias, `StyleSheet.create`, sombras/elevation
legacy y radios prohibidos.

## Ronda 2 — refuerzo de R6 y R4

Esta ronda no modifica producción ni mueve cifras de candados:

| Corrección | Commit de test | Evidencia |
|---|---|---|
| R6, orden interno de los tres textos | `12d396fd` | fija `type`, `pet` y `time` por posición dentro de `row.children[1]` |
| R4.1, receta tipográfica del título | `a08b37a9` | fija la `className` normativa del título |

### Sonda R6 — intercambio de tipo y mascota

Tras `12d396fd` se intercambiaron temporalmente en producción los `<Text>` de
tipo y `petName`. La suite dirigida falló por las nuevas aserciones posicionales:

```text
● #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › canda las doce decisiones para geofence_exit

  expect(received).toBe(expected) // Object.is equality

  Expected: "alert-row-geofence_exit-type"
  Received: "alert-row-geofence_exit-pet"

    341 |       const column = elementChild(row, 1);
    342 |       expect(column.children).toHaveLength(3);
  > 343 |       expect(elementChild(column, 0).props.testID).toBe(`${rowId}-type`);
        |                                                    ^
    344 |       expect(elementChild(column, 1).props.testID).toBe(`${rowId}-pet`);
    345 |       expect(elementChild(column, 2).props.testID).toBe(`${rowId}-time`);
    346 |       expect(elementChild(row, 2).props.testID).toBe(`${rowId}-ack`);

    at toBe (src/screens/alerts/index.test.tsx:343:52)
    at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › canda las doce decisiones para battery_low

  expect(received).toBe(expected) // Object.is equality

  Expected: "alert-row-battery_low-type"
  Received: "alert-row-battery_low-pet"

    341 |       const column = elementChild(row, 1);
    342 |       expect(column.children).toHaveLength(3);
  > 343 |       expect(elementChild(column, 0).props.testID).toBe(`${rowId}-type`);
        |                                                    ^
    344 |       expect(elementChild(column, 1).props.testID).toBe(`${rowId}-pet`);
    345 |       expect(elementChild(column, 2).props.testID).toBe(`${rowId}-time`);
    346 |       expect(elementChild(row, 2).props.testID).toBe(`${rowId}-ack`);

    at toBe (src/screens/alerts/index.test.tsx:343:52)
    at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › canda las doce decisiones para future_alert_type

  expect(received).toBe(expected) // Object.is equality

  Expected: "alert-row-future_alert_type-type"
  Received: "alert-row-future_alert_type-pet"

    341 |       const column = elementChild(row, 1);
    342 |       expect(column.children).toHaveLength(3);
  > 343 |       expect(elementChild(column, 0).props.testID).toBe(`${rowId}-type`);
        |                                                    ^
    344 |       expect(elementChild(column, 1).props.testID).toBe(`${rowId}-pet`);
    345 |       expect(elementChild(column, 2).props.testID).toBe(`${rowId}-time`);
    346 |       expect(elementChild(row, 2).props.testID).toBe(`${rowId}-ack`);

    at toBe (src/screens/alerts/index.test.tsx:343:52)
    at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Se restauró `src/screens/alerts/index.tsx` con `git checkout --`; `git diff`
quedó vacío y `#78 R6` volvió a verde.

### Sonda R4 — degradación de la receta del título

Tras `a08b37a9` se cambió temporalmente la `className` del título a
`text-xs font-normal text-muted`. La suite dirigida falló solo por la nueva
aserción:

```text
● #78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas › pinta tres esqueletos mientras espera la primera página

  expect(received).toBe(expected) // Object.is equality

  Expected: "text-2xl font-black text-foreground"
  Received: "text-xs font-normal text-muted"

    135 |     expect(screen.getByTestId('screen-alerts')).toBeVisible();
    136 |     expect(screen.getByText(es['alerts.title'])).toBeVisible();
  > 137 |     expect(screen.getByText(es['alerts.title']).props.className).toBe(
        |                                                                  ^
    138 |       'text-2xl font-black text-foreground',
    139 |     );
    140 |     const loading = screen.getByTestId('alerts-loading');

    at Object.toBe (src/screens/alerts/index.test.tsx:137:66)
    at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Se restauró el mismo fichero con `git checkout --`; `git diff` quedó vacío y
las secciones dirigidas `#78 R4|#78 R6` volvieron a verde.

## Verificación automatizada

- Suite móvil completa: exit 0 en la repetición.
- Typecheck móvil: exit 0.
- Tests dirigidos de consistencia, legibilidad y design drift: exit 0.
- Test completo de Health aislado tras un rojo transitorio de la corrida
  integral: exit 0 (28/28); no se modificó ninguna aserción ni código de Health.
- `env -u FORCE_COLOR bash ./init.sh`: exit 0 el 2026-09-11; build, suites,
  e2e, lint y typecheck verdes. Antes de lanzarlo se comprobó que no había otro
  `init.sh` usando el Postgres compartido.
- Ronda 2: `env -u FORCE_COLOR bash ./init.sh` volvió a terminar con exit 0 el
  2026-09-11 después de los dos refuerzos; la suite móvil completa, e2e, lint y
  typecheck quedaron verdes. El flake #72 no apareció en esta corrida.
- El aviso de `STATUS.md` (71/88 declarado frente a 71/89 real) es el drift del
  leader ya recogido por el reviewer; esta ronda no modificó `STATUS.md`.

La primera corrida completa de la suite móvil encontró el flake conocido #72:
`src/screens/add-pet/index.test.tsx`, “uploads a chosen preview only after
createPet succeeds”, con `picked.canceled` sobre `undefined`. No se corrigió ni
se silenció; la repetición completa terminó con exit 0.

## R14 — gate humano

Estado: **por ejecutar y firmar por un humano** en un dev build de Android. La
feature no debe pasar a `done` hasta completar, en orden:

- [ ] Home muestra el punto rojo con una alerta `open` real.
- [ ] La campana abre Alertas sin crear una sexta pestaña.
- [ ] La alerta aparece arriba con mascota, tipo en español y tiempo relativo.
- [ ] Marcar leída actualiza sin parpadeo, recarga ni cambio de posición.
- [ ] Al volver a Home desaparece el punto rojo.
- [ ] Todo el texto visible está en español.

La alerta real debe pertenecer a una mascota con dispositivo y suscripción
vigente; de lo contrario, el `INNER JOIN` del backend la oculta y el smoke daría
un falso negativo.
