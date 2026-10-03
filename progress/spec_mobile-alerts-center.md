# Spec de #78 `mobile-alerts-center` — resumen del `spec_author`

- **Fecha**: 2026-09-10
- **Branch**: `feature/78-mobile-alerts-center` (base `main` @ `5666b85`)
- **Entregable**: `specs/mobile-alerts-center/` (`requirements.md` en `draft`,
  `design.md`, `tasks.md`, `traceability.md`)
- **Estado**: `pending` → `spec_ready`. **No autoaprobada**: el gate humano sigue
  abierto en `requirements.md` §Aprobación.
- **Código de aplicación escrito**: ninguno. Solo markdown y el cambio de
  `status` en `feature_list.json`.

---

## 1. Discrepancias detectadas contra la descripción de la feature

Las tres se verificaron leyendo el árbol, no la descripción, y las tres están
corregidas y anotadas en `requirements.md` §0.

### D1 — `/v1/alerts` **no** devuelve 402 (premisa falsa del enunciado)

El enunciado pedía copiar el `kind: 'no-tracking'` de `src/api/activity.ts`
"porque las lecturas de alerts están tras el gate de suscripción del
dispositivo". Comprobado:

- `alerts.controller.ts` no tiene **ningún** `@UseGuards`; su comentario de
  cabecera (`:27-33`) explica que `PetAccessGuard` no aplica.
- `alerts.module.ts` no importa `SubscriptionsModule` (quien exporta
  `PetTrackingGuard`).
- `PetTrackingGuard` está en exactamente cuatro controllers —`positions`,
  `geofences`, `activity`, `trips`— y en ninguno de alertas.
- `mapAlertError` solo emite 404, 409 y 400.

**Lo que sí hace el gate**: `alert.drizzle.repository.ts:76-89` mete un
`INNER JOIN pet_devices` + `INNER JOIN device_subscriptions` con
`entitledDeviceSubscription()`. Una mascota sin suscripción vigente **no
aparece** en la lista: 200 con lista más corta o vacía, nunca 402.

**Resolución**: el criterio de aceptación 6 se cumple por su resultado
observable (estado vacío con copy vía `t()`, sin crash, campana intacta) y no
por su mecanismo inventado. **No se añade** un `kind: 'no-tracking'` — sería una
rama muerta. La condición exacta que revive la decisión queda escrita
(`design.md` D1/A3): que alguien anote `PetTrackingGuard` en el controller.

### D2 — el número de alertas abiertas **sí** es derivable, hasta 50

El enunciado afirmaba que "el NÚMERO exacto no" es derivable. Impreciso:
`ALERTS_PAGE_SIZE = 50`, así que con ≤50 abiertas `items.length` de la primera
página **es** el número exacto; a partir de 51 solo se sabe "50 y hay más".
La conclusión (**punto, no contador**) se confirma, pero con el motivo corregido:
un contador que se congela en 50 miente sin avisar y obliga a decidir un formato
`50+` que nadie ha pedido.

### D3 — no hay TanStack Query en este repo

El encargo pedía "nombrar las query keys exactas" para invalidar tras el ack.
`mobile-pet-tracker/package.json` no tiene `@tanstack/react-query` ni ninguna
otra librería de fetching. El repo usa `src/hooks/use-api.ts` + `useFocusEffect`.
**No hay ninguna query key que nombrar**; el mecanismo real, escrito en R8 y R11,
es `useApi(alertsFn).refetch` invocado desde el `useFocusEffect` que Home ya
tiene en `src/screens/home/index.tsx:221-226`. Instalar TanStack Query se
descarta explícitamente (`design.md` A10): sería la primera librería de fetching
del repo y un cambio transversal a 19 pantallas.

### Premisas del enunciado que **sí** se confirmaron

`src/api/alerts.ts` no existe; no hay ruta de alertas bajo `src/app/`; las rutas,
la forma de la respuesta (las diez claves) y los códigos de error son los que
dice; `ListAlertsQuerySchema` es `strictObject` sin `limit` y `?limit=` es 400;
`alert_events_type_check` solo admite `geofence_exit` y `battery_low`; el ack es
el "leído". Detalle nuevo verificado: el ack responde **200**, no 201
(`@HttpCode(HttpStatus.OK)`).

---

## 2. Decisiones cerradas por escrito (Codex no verá la conversación)

| # | Decisión | Dónde |
|---|---|---|
| 1 | Campana con **punto rojo**, sin contador | R11, `design.md` D2 |
| 2 | El centro muestra **solo alertas**; los recordatorios nunca entran en `/alerts` | §Fuera de alcance, A2 |
| 3 | El listado **no filtra** por la mascota seleccionada: todas las mascotas, con `petName` en cada fila | R7, `design.md` D4 |
| 4 | El punto se refresca con `useApi().refetch` dentro del `useFocusEffect` de Home — sin query keys, porque no hay TanStack Query | R11, D3 |
| 5 | La ruta no es pestaña porque `FloatingTabBar` **solo itera su `const TABS`** de cinco entradas (`floating-tab-bar.tsx:49-55,155-162`) y `tabWidth` se calcula con `TABS.length`; igual que `reminders.tsx` y `pairing.tsx`, que tampoco están en `TABS` ni en `_layout.tsx` | R5, §0.4 |
| 6 | Route delgado de 5 líneas + `src/screens/alerts/index.tsx` (convención #39) | R5 |
| 7 | El orden "abiertas primero" se congela con el `status` **descargado**; el ack solo cambia la apariencia, no la posición | R7, D3 |
| 8 | Severidad, no paleta categórica: `bg-danger-soft`/`bg-warning-soft`/`bg-default`, para no tocar `category-palette.ts` ni enmendar la carta | R6, D6 |
| 9 | `FlatList` con `onEndReached` (lo manda la carta para listas de longitud desconocida); sería la primera del repo, con los dos avisos de jest escritos | R9, D7 |
| 10 | La campana se compone desde Home en el slot del hero: `pet-hero-header.tsx` **no se toca** (Profile lo comparte) | R10, D8 |
| 11 | La fila **no navega** a ninguna parte: no hay pantalla de geocercas ni de detalle de alerta | R6 decisión 8, A8 |
| 12 | Tiempo relativo con una función de módulo en `index.tsx`, sin fichero `format.ts` (evita un sumando extra en `SCREEN_FILES`) y sin `Intl.RelativeTimeFormat` | D9 |

---

## 3. Trampas del encargo: cómo quedan cubiertas

- **Candado de catálogo**: R3 declara **+14 claves** como sumando —
  `toHaveLength(260 + 16 + 1 + 4 + 7 + 14)`, nunca un total reescrito. Se
  inventariaron **todos** los demás candados que la feature mueve, también como
  delta: `SCREEN_FILES` `19 + 2` → `19 + 2 + 1`; `R3_HOME`
  `21 + 15 + 1 + 4 + 7` → `… + 2`. Y los que **no** deben moverse quedan en una
  tabla propia (R13) con el motivo de diseño que los protege: `rounded-xl
  bg-accent` (13), `CONTINUOUS_CORNER` (`33 + 1 + 1`), `TABULAR_NUMS`,
  `bg-accent-soft` (16), clases `category-*`, `text-accent-strong` (`13 + 1`) y
  las versiones de `design-drift.test.ts`.
- **Sujeto ausente en `tasks.md`**: `tasks.md` cierra con una **revisión final
  del orden** en tabla, sujeto por sujeto, y nombra las tres inversiones
  deliberadas: R3 antes que R4 (sin claves no typechequea `t()`), R4 antes que
  R5 (la ruta importa la pantalla), R5 antes que R10 (el `expect` de la campana
  hace `appRoutes(...)` y exige `/alerts`).
- **Decisiones por elemento repetido**: R6 enumera las **doce** decisiones de la
  carta §Enmienda #70 una por una para la fila, más seis invariantes compartidos
  **cada uno con su `expect`** —incluido `icon.props.size === 20`, que es
  exactamente el que #85 tuvo que añadir a posteriori—, y el recuento se cierra
  con `row.children.length === 3` y el orden posicional de los hijos, no
  contando `testID`.
- **Copy 100% vía `t()`**: R3 (catálogo), R4/R6 (uso), R12 (tabla normativa,
  `checkUses`, y la comprobación de que ningún valor fijo del catálogo queda como
  literal en las pantallas).
- **Smoke**: R14 dice **"dev build de Android"**, con la nota de que la alerta de
  prueba debe ser de una mascota con dispositivo y suscripción vigente — si no,
  el `INNER JOIN` la esconde y el smoke daría un falso negativo.

---

## 4. Riesgos abiertos

1. **Primera `FlatList` del repo.** Hoy no hay ninguna. Riesgo acotado: el
   disparo de `onEndReached` en RNTL se especifica con la forma que este repo ya
   usa para props compuestas (`fireEvent(el, 'onValueChange', …)` en
   `src/screens/add-pet/index.test.tsx:127`), y se avisa de que jest solo monta
   `initialNumToRender` (10) filas. Si aun así el handler no fuese alcanzable, la
   salida es de implementación, no de spec.
2. **Una petición más en Home.** Home pasa de tres a cuatro llamadas por foco
   (`listPets`, `getPet`, `getDailyActivity`, `listReminders` y ahora
   `listAlerts`). Es el precio del criterio de aceptación 1 y no hay endpoint
   más barato mientras no exista `GET /v1/alerts/count`.
3. **`onEndReached` y páginas de 50 en producción.** Los tests usan 2-3 items;
   el comportamiento con 50 solo lo ve el smoke, y solo si hay 50 alertas
   reales — que no es el caso del entorno de prueba. Riesgo asumido y anotado.
4. **`.expo/types/router.d.ts`.** Está gitignorado y envejece; `tasks.md` §0
   ordena borrarlo antes de tocar código para que `router.push('/alerts')`
   typechequee sin `as Href`.
5. **Decisión que el humano puede querer revisar en el gate**: si prefiere que
   `src/api/alerts.ts` lleve igualmente el `kind: 'no-tracking'` defensivo pese a
   que el endpoint no emite 402 (D1). La spec dice que no; cambiar de opinión
   cuesta tres líneas en R1 y una rama en R4.
