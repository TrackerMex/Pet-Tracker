---
feature: "mobile-alerts-center"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-alerts-center]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio** (C4 de `CHECKPOINTS.md`): el (1) de cada
> tarea es su propio commit `test(mobile-alerts-center): … (Rn)` y se empuja en
> **rojo**; el (2) es el commit `feat(...)`/`fix(...)` que lo pone verde. Un solo
> commit con test + implementación + docs incumple C4 — pasó en #19.
>
> Todas las rutas son relativas a `mobile-pet-tracker/` salvo indicación expresa.

---

## §0 — Antes de la primera tarea

- [ ] Cargar las skills de Expo que la carta exige para trabajo móvil
      (`docs/ui-guidelines.md` §Skills): `expo-overview` primero y, derivadas de
      ella, `expo-router` (ruta nueva bajo `(tabs)/`), `expo-data-fetching`
      (cliente y paginación), `expo-native-ui` (pantalla, estados, safe areas) y
      `appllama-app-design-skill` (pantalla nueva; con los tres límites que la
      carta le pone — el sistema de estilos es el de este repo, no el suyo).
- [ ] Leer `docs/ui-guidelines.md` entero, incluida la **Enmienda #70** sobre
      elementos repetidos: la fila de alerta es uno.
- [ ] Si existe `mobile-pet-tracker/.expo/types/router.d.ts`, **borrarlo** antes
      de tocar código: está gitignorado, se queda obsoleto y rompe el `typecheck`
      con rutas fantasma. Se regenera solo.
- [ ] `./init.sh` verde desde la raíz **antes** de empezar, para tener la línea
      base. Comprobar antes con `pgrep` que no hay otro `init.sh` corriendo en
      otro worktree: comparten el Postgres de docker y se pisan.

---

## R1 — cliente `listAlerts`

- [ ] (1) Escribir test que falla para R1 — `src/api/__tests__/alerts.test.ts`,
      `describe('#78 R1: listAlerts mapea la respuesta por kind', …)`, copiando
      los helpers de `src/api/__tests__/activity.test.ts:1-18`. Rojo por módulo
      inexistente **no vale como rojo** (C4): crear primero `src/api/alerts.ts`
      con la firma y un `throw new Error('not implemented')`, y que el rojo sea
      de las aserciones.
- [ ] (2) Implementación mínima que lo pasa — `listAlerts` sobre `getJson`, más
      `AlertType`/`AlertStatus`/`Alert` al final de `src/api/types.ts`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: el test asserta sobre `src/api/alerts.ts`, que esta misma tarea
> crea. No depende de nada posterior.

## R2 — cliente `ackAlert`

- [ ] (1) Escribir test que falla para R2 — mismo fichero,
      `describe('#78 R2: ackAlert mapea la respuesta por kind', …)`.
- [ ] (2) Implementación mínima que lo pasa — `ackAlert` sobre `postJson` con
      cuerpo `{}`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: `src/api/alerts.ts`, ya existente desde R1.

## R3 — catálogo: 14 claves en los dos idiomas

- [ ] (1) Escribir test que falla para R3 — `describe` nuevo **al final** de
      `src/providers/__tests__/language-provider.test.tsx`, recorriendo el array
      de las 14 claves y afirmando valor `en` y valor `es` de cada una. Rojo
      porque `en[key]` es `undefined`.
- [ ] (2) Implementación mínima que lo pasa — las 14 claves en `en` y en `es` de
      `src/i18n/catalog.ts`; en el **mismo** commit, el sumando `+ 14` en la
      línea 41 (`toHaveLength(260 + 16 + 1 + 4 + 7 + 14)`) y el comentario de la
      línea 36; y las 14 filas en `specs/mobile-ui-language/design.md` §2 con el
      sufijo `← añadida por #78 (R3)`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: el catálogo, que ya existe. **Va antes que cualquier pantalla a
> propósito**: `TranslationKey` es `keyof typeof en`, así que una pantalla que
> use `t('alerts.title')` **no compila** hasta que la clave exista. Invertir R3
> y R4 dejaría el árbol sin typecheck.

## R4 — pantalla: cuerpo, dimensiones y estados

- [ ] (1) Escribir test que falla para R4 — `src/screens/alerts/index.test.tsx`,
      `describe('#78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus
      filas', …)`, con `src/api/alerts` mockeado. Crear antes
      `src/screens/alerts/index.tsx` exportando un `AlertsScreen` que devuelva
      `null`, para que el rojo sea de las aserciones y no un `ReferenceError`
      (C4, cuarto punto).
- [ ] (2) Implementación mínima que lo pasa — `FlatList` con
      `contentContainerStyle` exacto, `ListHeaderComponent` con el título,
      `ListEmptyComponent` con los tres `Skeleton` / error+retry / vacío, y una
      fila mínima por item con `testID={"alert-row-" + id}`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: la pantalla, que esta tarea crea, y el catálogo de R3, ya en el
> árbol. La fila mínima que se crea aquí es el sujeto de R6 y R7 — no se dejan
> para "más adelante".

## R5 — ruta delgada que no es pestaña

- [ ] (1) Escribir test que falla para R5 —
      `src/app/(tabs)/__tests__/alerts.test.tsx`, tres `it` (delegación, `TABS`
      con cinco entradas y sin `'alerts'`, `_layout` con cinco `<Tabs.Screen>`).
- [ ] (2) Implementación mínima que lo pasa — `src/app/(tabs)/alerts.tsx` con
      las cinco líneas del patrón. **No** tocar `floating-tab-bar.tsx` ni
      `_layout.tsx`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: la ruta importa `AlertsScreen`, que **R4 ya creó**. Al revés
> (ruta antes que pantalla) el test de R5 fallaría por módulo inexistente, que
> no es rojo legítimo.

## R6 — anatomía de la fila (las doce decisiones + los invariantes)

- [ ] (1) Escribir test que falla para R6 —
      `describe('#78 R6: cada fila de alerta trae su icono, su hueco, su tinta y
      sus tres hijos en orden', …)`. Un `it.each` por tipo (`geofence_exit`,
      `battery_low`, tipo desconocido) que afirme, con `within(row)`:
      `icon.props.size === 20`, `icon.props.color`, `icon.parent.props.className`,
      la `className` de cada uno de los tres textos, `row.children.length === 3`,
      `row.children[1].props.className === 'min-w-0 flex-1 gap-1'`,
      `row.props.onPress === undefined`, y la exclusión ack/píldora en dos
      escenarios distintos.
- [ ] (2) Implementación mínima que lo pasa — `ALERT_TYPE_META`,
      `UNKNOWN_ALERT_META`, `fmtOpenedAt`, y la fila completa sobre
      `src/components/card.tsx`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: las filas que R4 dejó montadas. Ninguna aserción mira a un nodo que
> no exista todavía.

## R7 — orden: abiertas primero, congelado al cargar

- [ ] (1) Escribir test que falla para R7 — dos `it`: orden de `testID` con una
      página `[acked, open, closed, open]`, y estabilidad del orden después del
      ack.
- [ ] (2) Implementación mínima que lo pasa — la partición `open`/resto sobre
      `fetched`, calculada **antes** del overlay de ack.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: las filas de R4 y su anatomía de R6 (el ack que el segundo `it`
> pulsa lo creó R6, decisión 9). El comportamiento del ack lo cierra R8; aquí
> solo se afirma que la **posición** no cambia.

## R8 — ack sin recargar la pantalla

- [ ] (1) Escribir test que falla para R8 — un `it` por fila de la tabla de R8,
      más `listAlerts` llamado una sola vez tras el ack y doble pulsación → una
      llamada.
- [ ] (2) Implementación mínima que lo pasa — `handleAck` con el overlay
      `acked`, el `isDisabled` durante el vuelo y `alerts-action-error`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: el botón `alert-row-{id}-ack` de R6 y `ackAlert` de R2.

## R9 — paginación por `nextCursor`

- [ ] (1) Escribir test que falla para R9 — cuatro `it`, disparando
      `await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached')`.
      Fixturas de 2-3 items por página (jest monta 10 filas como mucho).
- [ ] (2) Implementación mínima que lo pasa — `more`, `cursor`, guard de
      "página en vuelo" y guard de `cursor === null`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: el `FlatList` `alerts-list` de R4 y `listAlerts` de R1.

## R10 — campana en el hero de Home

- [ ] (1) Escribir test que falla para R10 —
      `describe('#78 R10: la campana vive en el hero y lleva al centro de
      alertas', …)` al final de `src/screens/home/index.test.tsx`, con
      `jest.mock('../../api/alerts', …)` añadido junto a los demás mocks de API
      del fichero.
- [ ] (2) Implementación mínima que lo pasa — `home-hero-actions` dentro del
      slot del hero, con el switcher envuelto en `flex-1` y el `Pressable` de la
      campana con `router.push('/alerts')`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: el slot de `PetHeroHeader` (existente) y la ruta `/alerts` que
> **R5 ya creó** — el `it` (c) hace `appRoutes(...)` y exige `'/alerts'` en la
> lista. Si R10 fuese antes que R5, ese `expect` no podría pasar nunca.

## R11 — punto rojo derivado de las alertas abiertas

- [ ] (1) Escribir test que falla para R11 — un `it` por fila de la tabla de
      estados, más el que invoca el callback de `useFocusEffect` y comprueba que
      el punto desaparece con la segunda respuesta vacía.
- [ ] (2) Implementación mínima que lo pasa — `alertsFn` + `useApi` en Home,
      `alerts.refetch` dentro del `useFocusEffect` existente, el `View` del
      punto y el `accessibilityLabel` condicional.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: el `Pressable` de la campana que **R10 creó**, y `listAlerts` de
> R1. El punto cuelga de la campana: sin R10 antes, no hay dónde ponerlo.

## R12 — la copia registrada en la tabla normativa

- [ ] (1) Escribir test que falla para R12 —
      `describe('#78 R12: el centro de alertas resuelve su copy por clave', …)`
      en `src/__tests__/ui-language.test.ts`, con `checkUses(R12_ALERTS)` y la
      comprobación de las 14 filas en `specs/mobile-ui-language/design.md`.
- [ ] (2) Implementación mínima que lo pasa — `R12_ALERTS` en
      `src/__tests__/ui-copy-table.ts` (una fila por ocurrencia real), añadido a
      `ALL_USES` **y** al array `blocks` de su test interno; las dos filas nuevas
      de la campana en `R3_HOME`; y en el mismo commit los sumandos
      `19 + 2 + 1` (línea 391) y `21 + 15 + 1 + 4 + 7 + 2` (línea 83).
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: `src/screens/alerts/index.tsx` (R4/R6/R8/R9) y
> `src/screens/home/index.tsx` (R10/R11), ambos con su copy ya escrita.
> `checkUses` cuenta ocurrencias en el fuente: **no puede** ir antes que las
> pantallas. Ésta es la razón de que R12 sea la penúltima tarea de código y no
> la primera, pese a hablar de copy.

## R13 — conformidad con la carta y candados que no se mueven

> **Requisito de verificación** (C4, tercer punto): solo asevera propiedades de
> artefactos que R1-R12 dejaron en el árbol. Se declara aquí **por escrito y
> antes del handoff**, y se cierra por la **vía (b): prueba de mutación**.

- [ ] (1) Correr la suite móvil completa y la de la raíz; anotar en
      `progress/impl_mobile-alerts-center.md` §R13 qué candados de la tabla de
      R13 siguen en su cifra original.
- [ ] (2) **Sonda de mutación, versionada en un commit rojo y revertida en el
      verde**: cambiar en producción el `bg-danger-soft` de la fila por
      `bg-accent-soft`, correr `src/__tests__/consistency-classnames.test.ts` y
      copiar el bloque `●` completo del rojo (falla la aserción de 16) en el
      reporte; revertir y comprobar `git diff` vacío. Mutar un mock **no** vale
      (C4, quinto punto).
- [ ] (3) Grep-clean de C8 sobre los ficheros nuevos y modificados: cero hex
      fuera de `src/theme/`, cero clases arbitrarias `[...]`, cero
      `StyleSheet.create`, cero shadow/elevation legacy, cero
      `rounded-2xl|lg|md|sm`. `./init.sh` desde la raíz con exit 0.

## R14 — gate humano: smoke en dev build de Android

- [ ] (1) Dejar preparada la alerta `open` real: salida de geocerca con collar, o
      `INSERT` a mano en `alert_events` con `type` ∈ {`geofence_exit`,
      `battery_low`} y `status = 'open'`, para una mascota **con dispositivo y
      suscripción vigente** (si no, el `INNER JOIN` la esconde y el smoke daría
      un falso negativo).
- [ ] (2) **PARADA — lo corre el humano**, en un **dev build de Android** (nunca
      Expo Go), con los seis pasos del guion de R14.
- [ ] (3) Anotar el resultado en `progress/impl_mobile-alerts-center.md` §R14.
      Sin esta firma la feature no pasa a `done`, aunque el `reviewer` haya
      aprobado todo lo demás.

---

## Revisión final del orden (obligatoria, se hizo)

Repaso explícito de la trampa que paró #70 y #85 — *un requisito que asserta
sobre nodos que su propio orden no crea hasta tres o cuatro requisitos después*:

| Tarea | Sujeto sobre el que asserta | ¿Existe ya? |
|---|---|---|
| R1 | `src/api/alerts.ts` | lo crea ella |
| R2 | `src/api/alerts.ts` | R1 |
| R3 | `src/i18n/catalog.ts` | existía |
| R4 | `AlertsScreen` + claves `alerts.*` | lo crea ella + **R3** |
| R5 | `AlertsScreen`, `TABS`, `_layout` | **R4** + existían |
| R6 | filas `alert-row-*` | **R4** |
| R7 | filas + botón de ack | **R4**, **R6** |
| R8 | botón de ack + `ackAlert` | **R6**, **R2** |
| R9 | `alerts-list` + `listAlerts` | **R4**, **R1** |
| R10 | slot del hero + ruta `/alerts` | existía + **R5** |
| R11 | `home-alerts-bell` + `listAlerts` | **R10**, **R1** |
| R12 | fuentes de la pantalla y de Home | **R4-R11** |
| R13 | todo lo anterior | **R1-R12** |
| R14 | la app construida | **R1-R13** |

Tres inversiones se decidieron **a propósito** por esta revisión y no deben
reordenarse al implementar:

1. **R3 antes que R4**: sin las claves en el catálogo, `t('alerts.title')` no
   typechequea y la pantalla no compila.
2. **R4 antes que R5**: la ruta importa la pantalla; al revés el rojo de R5 sería
   un módulo inexistente, que C4 no acepta como rojo.
3. **R5 antes que R10**: el `it` de la campana exige `appRoutes(...)` con
   `'/alerts'` dentro; sin la ruta creada, ese `expect` es imposible.
