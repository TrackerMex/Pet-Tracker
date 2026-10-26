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
> verde. Nunca implementación y test en el mismo commit.
> Comandos desde `mobile-pet-tracker/`: `bunx jest <ruta>` (rutas con `[` o `(`
> entre comillas y escapadas: el posicional es regex), `bunx tsc --noEmit`,
> `bunx expo lint --no-cache > /tmp/lint.log 2>&1 && test ! -s /tmp/lint.log`.
> No correr `./init.sh` ni e2e.

## R23 — expo-clipboard (primero, porque R15 lo importa)

- [ ] (1) Test rojo: `src/screens/pet-invite/index.test.tsx` con `it('R23: expo-clipboard es dependencia declarada', …)`
- [ ] (2) `bunx expo install expo-clipboard`; doble en `test/jest-setup.js`; commit `chore(mobile): add expo-clipboard (R23)` con `package.json`, `bun.lock` y el setup
- [ ] (3) Refactor con tests verdes

## R1 — cliente HTTP de miembros e invitaciones

- [ ] (1) Test rojo: `src/api/__tests__/pet-members.test.ts`, un `it` `R1:` por rama de las seis funciones (esqueleto de `src/api/pet-members.ts` que devuelve `{ kind: 'error' }`)
- [ ] (2) Implementación mínima en `src/api/pet-members.ts`
- [ ] (3) Refactor con tests verdes

## R2 — claves de query

- [ ] (1) Test rojo: `it('R2: memberKeys e inviteKeys no comparten prefijo con petKeys', …)`
- [ ] (2) `memberKeys` e `inviteKeys` en `src/api/query-keys.ts`
- [ ] (3) Refactor con tests verdes

## R9, R12, R14 (utils) — `memberInitials`, `inviteDateParts`, `formatInviteCode`

- [ ] (1) Test rojo: `src/utils/__tests__/pet-members.test.ts` (tablas de R9, R12 y R14)
- [ ] (2) `src/utils/pet-members.ts`
- [ ] (3) Refactor con tests verdes

## R22 (catálogo) — 50 claves es/en

- [ ] (1) Test rojo: `describe('#214 R22: copy de Familia')` en `src/__tests__/ui-language.test.ts`, solo el `it('R22: cada clave nueva existe en los dos idiomas y se usa', …)` sin la parte «se usa» (se completa al cerrar R22)
- [ ] (2) Las 50 claves de design.md §5 en `src/i18n/catalog.ts`
- [ ] (3) Refactor con tests verdes

## R3 — rutas y stack

- [ ] (1) Test rojo: `it('R3: …')` en `src/app/__tests__/layout.test.tsx`, las cuatro sumas `+ 3 // #214 R3` y las hrefs de `detail-stack.guard.test.tsx`
- [ ] (2) Tres rutas delgadas, tres pantallas esqueleto y los `Stack.Screen` en `src/app/_layout.tsx`
- [ ] (3) Refactor con tests verdes

## R8 — Familia: carga y error

- [ ] (1) Test rojo en `src/screens/pet-members/index.test.tsx`
- [ ] (2) Queries, skeleton, error y cabecera
- [ ] (3) Refactor con tests verdes

## R9 — filas de miembros

- [ ] (1) Test rojo (incluido el `it` sin `@`)
- [ ] (2) Filas, avatares, `MEMBER_AVATAR_SLOTS`, píldoras
- [ ] (3) Refactor con tests verdes

## R10 — vista de dueño

- [ ] (1) Test rojo
- [ ] (2) Intro de dueño y «Quitar» condicionado
- [ ] (3) Refactor con tests verdes

## R11 — quitar miembro

- [ ] (1) Test rojo (doble de BottomSheet como en `src/screens/pairing/index.test.tsx`)
- [ ] (2) Sheet y llamada
- [ ] (3) Refactor con tests verdes

## R12 — invitaciones pendientes y revocar

- [ ] (1) Test rojo
- [ ] (2) Query de invitaciones `enabled` para el dueño, filas y revocar
- [ ] (3) Refactor con tests verdes

## R13 — crear invitación

- [ ] (1) Test rojo
- [ ] (2) Nota, CTA, `actionError` y `router.push` con parámetros
- [ ] (3) Refactor con tests verdes

## R16 — vista de familia

- [ ] (1) Test rojo
- [ ] (2) Avatar de mascota, intro, nota del dueño, hint y botón Salir
- [ ] (3) Refactor con tests verdes

## R17 — salir

- [ ] (1) Test rojo (array de orden de las cinco llamadas)
- [ ] (2) Sheet de salir y secuencia de limpieza
- [ ] (3) Refactor con tests verdes

## R14 — pantalla Invitar: contenido

- [ ] (1) Test rojo en `src/screens/pet-invite/index.test.tsx`
- [ ] (2) Cabecera, tarjeta de código, mensaje, nota de rol y estado inválido
- [ ] (3) Refactor con tests verdes

## R15 — Compartir y Copiar

- [ ] (1) Test rojo
- [ ] (2) `Share.share` y `Clipboard.setStringAsync`
- [ ] (3) Refactor con tests verdes

## R18 — Unirme: formulario

- [ ] (1) Test rojo en `src/screens/join-pet/index.test.tsx`
- [ ] (2) KAV, héroe, título, nota, input, hint y botón
- [ ] (3) Refactor con tests verdes

## R19 — Unirme: errores

- [ ] (1) Test rojo (un `it` por rama, más el `it` de API con 404 y 400)
- [ ] (2) Mapa de `kind` a texto y borde
- [ ] (3) Refactor con tests verdes

## R20 — ya miembro

- [ ] (1) Test rojo
- [ ] (2) Caja de ya miembro e «Ir a Inicio»
- [ ] (3) Refactor con tests verdes

## R21 — aceptar

- [ ] (1) Test rojo (orden y espera de la invalidación)
- [ ] (2) Secuencia invalidar → seleccionar → `dismissTo`
- [ ] (3) Refactor con tests verdes

## R4 — tarjeta Familia en Perfil

- [ ] (1) Test rojo en `src/screens/profile/index.test.tsx`, con la enmienda del `it` de dos filas y el doble de `../../api/pet-members`; doble en `src/app/(tabs)/__tests__/screens.test.tsx`
- [ ] (2) `ProfileWideTile` y `members-link`
- [ ] (3) Refactor con tests verdes

## R5 — subtítulo de Familia

- [ ] (1) Test rojo (un `it` por rama)
- [ ] (2) Query `memberKeys.list(pet.id)` y subtítulo
- [ ] (3) Refactor con tests verdes

## R6 — Unirme en Perfil

- [ ] (1) Test rojo (con y sin mascota; enmienda del `it` sin mascota)
- [ ] (2) `join-pet-link`
- [ ] (3) Refactor con tests verdes

## R7 — Unirme en Inicio vacío

- [ ] (1) Test rojo en `src/screens/home/index.test.tsx` y enmienda de los dos `toEqual(['home-empty'])`
- [ ] (2) `home-join-pet`
- [ ] (3) Refactor con tests verdes

## R22 (tabla) — `R21_PET_MEMBERS`, `SCREEN_FILES`

- [ ] (1) Test rojo: `checkUses(R21_PET_MEMBERS)`, cuenta de `t(` por fichero, «se usa», `+ 3 // #214 R22` en `SCREEN_FILES` y bloque en `ALL_USES`/`blocks`
- [ ] (2) Filas de `src/__tests__/ui-copy-table.ts` (es datos de test: va en el mismo commit rojo si el rojo lo da otra aserción; si no, en commit propio `test(mobile): … (R22)` antes del verde)
- [ ] (3) Refactor con tests verdes

## R24 — candados existentes

- [ ] (1) Enmiendas de design.md §7.1 que no hayan entrado ya con su R-id (`profile-canvas-fidelity`, `consistency-classnames` esquinas y glifos), en commit `test(mobile): … (R24)` rojo
- [ ] (2) Ninguna producción nueva: el verde llega con R4, R18 y las listas de clases
- [ ] (3) Corrida completa `bunx jest`, `bunx tsc --noEmit` y lint en verde
