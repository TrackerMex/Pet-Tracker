---
feature: "mobile-pet-members"
status: draft        # draft | approved
tags: [mobile, spec, pet-members, invites, expo-router, heroui-native]
---

# Tareas — [[mobile-pet-members]] (#214)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero obligatorios (C4 de `CHECKPOINTS.md`).** Por cada R-id:
> (1) un commit `test(mobile): … (R<n>)` que solo añade o enmienda tests y que
> falla al correrlo (`bunx jest <fichero>` en rojo, por aserción y no por
> import roto: el fichero de producción existe con un esqueleto que exporta los
> símbolos); (2) un commit `feat(mobile): … (R<n>)` con la implementación mínima
> que lo pone verde; (3) refactor opcional `refactor(mobile): … (R<n>)` con todo
> verde. Nunca implementación y test en el mismo commit. Hay dos excepciones,
> descritas en su bloque: R23 (2) (design.md §6) y R22 (tabla), que es un solo
> commit de datos de test sin producción.
> Comandos desde `mobile-pet-tracker/`: `bunx jest <ruta>` (rutas con `[` o `(`
> entre comillas y escapadas: el posicional es regex), `bunx tsc --noEmit`,
> `bunx expo lint --no-cache > /tmp/lint.log 2>&1 && test ! -s /tmp/lint.log`.
> No correr `./init.sh` ni e2e.
>
> **Candados de design.md §7.1.** Cada fila entra en el commit rojo (1) del
> primer R-id que cita, según el orden de este fichero, y se pone verde con el
> commit (2) del último. Entre los dos, la fila sigue roja: es lo esperado. La
> corrida de cada paso (2) es el fichero de test del R-id más los ficheros de las
> filas que ese paso pone verdes. La tabla completa está en R24.
>
> **`it` que nacen verdes.** Los marcados «nace verde» en cada bloque pasan ya en
> el commit (1) porque aseveran una ausencia que el esqueleto o un R-id anterior
> ya cumple. Van en el commit (1) igualmente, y `progress/impl_mobile-pet-members.md`
> los lista uno a uno como «nacido verde». Ningún otro `it` puede nacer verde: si
> pasa en su commit (1), se para y se avisa.

## Paso 0 — #218 mergeada y re-medida

- [ ] (1) Comprobar que #218 (`mobile-sheet-surface`) está mergeada en `dev`.
  Si no, parar: #214 no empieza.
- [ ] (2) `git fetch origin && git merge origin/dev` en la rama de #214. Nunca
  rebase. Después, `cd mobile-pet-tracker && bun install --frozen-lockfile`.
- [ ] (3) Re-medir desde `mobile-pet-tracker/` la cifra base de cada ancla de
  design.md §7.1 (filas 1–49) y de P1–P20. P7–P10 deben dar 1 (llegan con
  #218). Si una base no coincide, parar y avisar al leader con la tabla de
  diferencias; no se ajustan cifras por cuenta propia. Este paso no hace commit.

## R23 — expo-clipboard (primero, porque R15 lo importa)

- [ ] (1) Test rojo: `src/utils/__tests__/pet-members.test.ts` con solo
  `it('R23: expo-clipboard es dependencia declarada', …)`. El fichero aún no
  importa `../pet-members` ni `expo-clipboard`: el rojo es la aserción.
- [ ] (2) Un solo commit verde, `chore(mobile): add expo-clipboard (R23)`:
  `bunx expo install expo-clipboard` (`package.json`, `bun.lock`), el doble de
  `test/jest-setup.js` de design.md §6 y las filas 26 y 27 de §7.1 (`44 + 1`).
  Después, `bunx tsc --noEmit` y lint.
- [ ] (3) Refactor con tests verdes.

## R1 — cliente HTTP de miembros e invitaciones

- [ ] (1) Test rojo: `src/api/__tests__/pet-members.test.ts`, un `it` `R1:` por
  rama de las seis funciones. El esqueleto de `src/api/pet-members.ts` devuelve
  `{ kind: 'error' }`. `it('R1: ninguna función toca fetch sin baseUrl', …)`
  aserta, por función, que `fetchFn` no se llama **y** que el resultado es
  `{ kind: 'missing-config' }`.
- [ ] (2) Implementación mínima en `src/api/pet-members.ts`.
- [ ] (3) Refactor con tests verdes.

## R2 — claves de query

- [ ] (1) Test rojo: `it('R2: memberKeys e inviteKeys no comparten prefijo con petKeys', …)`.
- [ ] (2) `memberKeys` e `inviteKeys` en `src/api/query-keys.ts`.
- [ ] (3) Refactor con tests verdes.

## R9, R12, R14 (utils) — `memberInitials`, `inviteDateParts`, `formatInviteCode`

- [ ] (1) Test rojo: `src/utils/__tests__/pet-members.test.ts`, con las tablas de
  R9, R12 y R14. El esqueleto de `src/utils/pet-members.ts` devuelve `''` en
  `memberInitials` y `formatInviteCode`, y `{ date: '', time: '' }` en
  `inviteDateParts`, para que ninguna fila nazca verde.
- [ ] (2) `src/utils/pet-members.ts`.
- [ ] (3) Refactor con tests verdes.

## R22 (catálogo) — 51 claves es/en

- [ ] (1) Test rojo: solo la fila 48 de §7.1 (`+ 51` en el `#194 R1` de
  `src/providers/__tests__/language-provider.test.tsx`). El rojo es la cuenta de
  claves del catálogo. El `describe('#214 R22: copy de Familia')` no entra aquí:
  va en R22 (tabla).
- [ ] (2) Las 51 claves de design.md §5 en `src/i18n/catalog.ts`, al final de
  cada bloque y en el orden de esa tabla. Pone verde la fila 48. Desde aquí las
  pantallas ya pueden llamar a `t('…')` con las claves nuevas.
- [ ] (3) Refactor con tests verdes.

## R3 — rutas y stack

- [ ] (1) Test rojo: `it('R3: …')` en `src/app/__tests__/layout.test.tsx`. Filas
  1–5 de §7.1.
- [ ] (2) Tres rutas delgadas, tres pantallas esqueleto y los `Stack.Screen` en
  `src/app/_layout.tsx`. Pone verdes las filas 1–5.
- [ ] (3) Refactor con tests verdes.

## R8 — Familia: carga y error

- [ ] (1) Test rojo en `src/screens/pet-members/index.test.tsx`. Los tres
  `it.each(['pet', 'members', 'me'])` hacen fallar solo la query de su fila.
- [ ] (2) Queries, skeleton, error con `pet-members-retry` (sin labio, design.md §7.2)
  y cabecera.
- [ ] (3) Refactor con tests verdes.

## R9 — filas de miembros

- [ ] (1) Test rojo, incluido el `it` sin `@`. Fila 30 de §7.1.
  Nace verde: `'R9: ningún texto de la pantalla contiene el correo de getMe'`.
- [ ] (2) Filas, avatares, `MEMBER_AVATAR_SLOTS` y píldoras (llamadas `t('…')`
  directas, una por rol).
- [ ] (3) Refactor con tests verdes.

## R10 — vista de dueño

- [ ] (1) Test rojo. Fila 15 de §7.1.
  Nacen verdes: `'R10: family no ve Quitar, invitaciones ni CTA'` y
  `'R10: walker tampoco ve acciones de dueño'`.
- [ ] (2) Intro de dueño y «Quitar» condicionado.
- [ ] (3) Refactor con tests verdes.

## R11 — quitar miembro

- [ ] (1) Test rojo, con el doble de BottomSheet como en
  `src/screens/pairing/index.test.tsx`. Filas 13, 14, 25, 32, 33, 37, 40, 42, 43
  y 44 de §7.1.
- [ ] (2) Sheet (receta de #218, design.md §3) y llamada.
- [ ] (3) Refactor con tests verdes.

## R12 — invitaciones pendientes y revocar

- [ ] (1) Test rojo. Fila 28 de §7.1.
  Nacen verdes: `'R12: sin invitaciones no hay sección'`,
  `'R12: si la lista falla no hay sección'` y `'R12: family no pide invitaciones'`.
- [ ] (2) Query de invitaciones `enabled` para el dueño, filas y revocar.
- [ ] (3) Refactor con tests verdes.

## R16 — vista de familia

- [ ] (1) Test rojo.
  Nacen verdes: `'R16: sin dueño en la lista no hay nota'` y
  `'R16: el dueño no ve Salir'`.
- [ ] (2) Avatar de mascota, intro, nota del dueño, hint y botón Salir.
- [ ] (3) Refactor con tests verdes.

## R17 — salir

- [ ] (1) Test rojo (array de orden de las cinco llamadas). Fila 49 de §7.1
  (`clearPet` en Familia).
- [ ] (2) Sheet de salir y secuencia de limpieza. Pone verdes las filas 13, 14
  y 49.
- [ ] (3) Refactor con tests verdes.

## R13 — crear invitación

Va detrás de R16 y R17: su `it.each` pulsa `pet-members-leave` con el aviso
previo de un confirmar de salir `unreachable`.

- [ ] (1) Test rojo. Cada fila del
  `it.each([...])('R13: pulsar %s borra el aviso anterior', …)` aserta primero
  `screen.getByTestId('pet-members-action-error')` y solo después pulsa el botón y
  aserta `queryByTestId(...)` `null`. Filas 16, 17, 24, 29, 31, 34, 35, 36, 38, 39,
  41 y 45 de §7.1.
  Puede nacer verde: la fila `pet-members-leave`, si R16 o R17 ya borran el aviso
  al abrir el sheet. Si pasa, se anota como nacida verde.
- [ ] (2) Nota, CTA, `actionError` y `router.push` con parámetros.
- [ ] (3) Refactor con tests verdes.

## R14 — pantalla Invitar: contenido

- [ ] (1) Test rojo en `src/screens/pet-invite/index.test.tsx`.
  Nace verde: `'R14: sin código no ofrece compartir'`.
- [ ] (2) Cabecera, tarjeta de código, mensaje, nota de rol y estado inválido.
- [ ] (3) Refactor con tests verdes.

## R15 — Compartir y Copiar

- [ ] (1) Test rojo. El valor por defecto del doble va en el `beforeEach` de
  design.md §6.
  Nacen verdes: `'R15: un Share rechazado no rompe la pantalla'` y
  `'R15: si copiar falla la etiqueta no cambia'`, porque sin manejador la
  pantalla tampoco cambia.
- [ ] (2) `Share.share` y `Clipboard.setStringAsync`.
- [ ] (3) Refactor con tests verdes.

## R18 — Unirme: formulario

- [ ] (1) Test rojo en `src/screens/join-pet/index.test.tsx`. Filas 19, 20, 21,
  22 y 23 de §7.1.
- [ ] (2) KAV, héroe, título, nota, input, hint y botón. Pone verdes las filas
  16, 19, 20, 28 y 38.
- [ ] (3) Refactor con tests verdes.

## R19 — Unirme: errores

- [ ] (1) Test rojo: un `it` por rama, más el `it` de API con 404 y 400.
  Nace verde: `'R19: acceptInvite da el mismo kind con 404 y con 400'`, que ya
  cumple R1.
- [ ] (2) Errores con llamadas `t('…')` directas, una por rama, y borde. Pone
  verde la fila 30.
- [ ] (3) Refactor con tests verdes.

## R20 — ya miembro

- [ ] (1) Test rojo.
  Nace verde: `'R20: editar vuelve al formulario'`, porque sin R20 el formulario
  nunca se sustituye.
- [ ] (2) Caja de ya miembro e «Ir a Inicio». Pone verdes las filas 17, 24, 29,
  31, 34, 35, 36, 39, 41 y 45.
- [ ] (3) Refactor con tests verdes.

## R21 — aceptar

- [ ] (1) Test rojo (orden y espera de la invalidación).
  Nace verde: `'R21: no selecciona hasta que la invalidación termina'`, porque
  sin R21 nada llama a `selectPet`.
- [ ] (2) Secuencia invalidar → seleccionar → `dismissTo`.
- [ ] (3) Refactor con tests verdes.

## R4 — tarjeta Familia en Perfil

- [ ] (1) Test rojo en `src/screens/profile/index.test.tsx`. Filas 8, 9 y 18 de
  §7.1.
  Nace verde: `'R4: sin mascota no hay tarjeta de Familia'`.
- [ ] (2) `ProfileWideTile` y `members-link`. Producción sin comentarios `#214`
  (P5). Pone verdes las filas 21, 22 y 23.
- [ ] (3) Refactor con tests verdes.

## R5 — subtítulo de Familia

- [ ] (1) Test rojo, un `it` por rama. Filas 11 y 12 de §7.1 (dobles de
  `pet-members` en Perfil y en las pestañas).
  Nacen verdes: `'R5: oculta el subtítulo mientras carga'` y
  `'R5: oculta el subtítulo si la lista falla'`.
- [ ] (2) Query `memberKeys.list(pet.id)` y subtítulo. Pone verdes las filas 11
  y 12.
- [ ] (3) Refactor con tests verdes.

## R6 — Unirme en Perfil

- [ ] (1) Test rojo, con y sin mascota. Fila 10 de §7.1.
- [ ] (2) `join-pet-link`. Pone verdes las filas 8, 9, 10 y 18.
- [ ] (3) Refactor con tests verdes.

## R7 — Unirme en Inicio vacío

- [ ] (1) Test rojo en `src/screens/home/index.test.tsx`. Filas 6 y 7 de §7.1.
- [ ] (2) `home-join-pet`. Producción sin comentarios `#214` (P6). Pone verdes
  las filas 6, 7, 15, 25, 32, 33, 37, 40, 42, 43 y 44.
- [ ] (3) Refactor con tests verdes.

## R22 (tabla) — `R21_PET_MEMBERS`, `SCREEN_FILES`

El rojo y el verde de R22 son los de R22 (catálogo). Este bloque solo registra
datos de test, y va al final porque lee las llamadas `t('…')` de las cinco
pantallas.

- [ ] (1) Un solo commit `test(mobile): register pet members copy (R22)` con:
  - el bloque `R21_PET_MEMBERS` y sus dos enmiendas (fila 46);
  - el import y el `+ 3` de `SCREEN_FILES` (fila 47);
  - el `describe('#214 R22: copy de Familia')` al final de
    `src/__tests__/ui-language.test.ts`, con sus tres `it` de R22.

  Las filas 46 y 47 van juntas: `SCREEN_FILES` se deriva de `ALL_USES`, así que
  el bloque sin el `+ 3` pone rojo el `#194 R5` de la fila 47.
  Nacen verdes los tres `it` nuevos y las filas 46 y 47, porque el catálogo y las
  llamadas `t('…')` ya están. Si alguno da rojo, falta una fila o una llamada:
  se corrige el dato de test cuando la pantalla sigue la spec; si no la sigue, se
  para y se avisa.
- [ ] (2) Sin producción nueva.
- [ ] (3) `bunx jest src/__tests__/ui-language.test.ts src/__tests__/ui-copy-table.ts`
  en verde.

## R24 — candados existentes

Lista cerrada de design.md §7.1. Ninguna fila queda sin commit y ningún candado
fuera de ella cambia.

| Fila | Fichero | Rojo en | Verde con |
|---|---|---|---|
| 1–4 | `src/app/__tests__/layout.test.tsx` | R3 | R3 |
| 5 | `src/app/__tests__/detail-stack.guard.test.tsx` | R3 | R3 |
| 6–7 | `src/screens/home/index.test.tsx` | R7 | R7 |
| 8–9 | `src/screens/profile/index.test.tsx` | R4 | R6 |
| 10 | `src/screens/profile/index.test.tsx` | R6 | R6 |
| 11 | `src/screens/profile/index.test.tsx` (doble) | R5 | R5 |
| 12 | `src/app/(tabs)/__tests__/screens.test.tsx` (doble) | R5 | R5 |
| 13–14 | `src/__tests__/sheet-surface-background.test.ts` | R11 | R17 |
| 15 | `src/__tests__/design-drift.test.ts` (`#178 R13`) | R10 | R7 |
| 16 | `src/__tests__/design-drift.test.ts` (`#179 R13`) | R13 | R18 |
| 17 | `src/__tests__/consistency-classnames.test.ts` (único radio) | R13 | R20 |
| 18 | `src/__tests__/consistency-classnames.test.ts` (glifos) | R4 | R6 |
| 19–20 | `src/__tests__/consistency-classnames.test.ts` (placeholders, borde) | R18 | R18 |
| 21–23 | `src/__tests__/consistency-classnames.test.ts` (esquinas) | R18 | R4 |
| 24 | `src/__tests__/consistency-classnames.test.ts` (diecisiete primarios) | R13 | R20 |
| 25 | `src/__tests__/consistency-classnames.test.ts` (neutros) | R11 | R7 |
| 26 | `src/__tests__/canvas-foundations.test.ts` | R23 (2) | R23 (2) |
| 27 | `src/__tests__/zones-canvas-fidelity.test.ts` | R23 (2) | R23 (2) |
| 28 | `src/__tests__/alerts-canvas-fidelity.test.ts` | R12 | R18 |
| 29 | `src/__tests__/profile-canvas-fidelity.test.ts` (`rounded-tile`) | R13 | R20 |
| 30 | `src/__tests__/profile-canvas-fidelity.test.ts` (`text-13`) | R9 | R19 |
| 31, 34–36, 39, 41, 45 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | R13 | R20 |
| 32, 33, 37, 40, 42–44 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | R11 | R7 |
| 38 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` (`R7.4`) | R13 | R18 |
| 46 | `src/__tests__/ui-copy-table.ts` | R22 (tabla), nace verde | R22 (tabla) |
| 47 | `src/__tests__/ui-language.test.ts` | R22 (tabla), nace verde | R22 (tabla) |
| 48 | `src/providers/__tests__/language-provider.test.tsx` | R22 (catálogo) | R22 (catálogo) |
| 49 | `src/hooks/use-pet-selection.test.tsx` | R17 | R17 |

- [ ] (1) Sin commit propio: cada fila entra en el commit rojo que dice la tabla.
  Antes de (3), `grep -cF` de cada ancla de §7.1 y de P1–P20 da su cifra
  «después».
- [ ] (2) Ninguna producción nueva: el verde llega con los R-id de la columna
  «Verde con».
- [ ] (3) Corrida completa `bunx jest`, `bunx tsc --noEmit` y lint en verde.
