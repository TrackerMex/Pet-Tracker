---
feature: "mobile-app-and-notification-icons"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-app-and-notification-icons]] (#101)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Un commit rojo (test)
> y un commit verde (implementación) por requisito, con el R-id en el mensaje
> (C4). El sujeto de cada aserción existe antes de aseverarlo: el orden de
> abajo es el orden de ejecución.

## Precondiciones

- [ ] Spec aprobada ([[requirements]] §Aprobación, casilla principal).
- [ ] `cd mobile-pet-tracker && bun install --frozen-lockfile` exit 0 (el
      worktree no trae `node_modules`); `test ! -e .expo/types/router.d.ts`.
- [ ] `ls node_modules/jimp-compact/dist/jimp.js` existe.

## R1 — Fuentes del humano intactas

- [ ] (1) Sin test jest. Candado: `git diff --stat d29d49d5 --` sobre las
      tres rutas `pet-tracker-*` de [[design]] §Verificaciones del reviewer,
      vacío al cerrar.
- [ ] (2) Nada que implementar: ningún commit toca esas tres rutas ni añade
      un asset nuevo bajo `assets/images/` fuera de
      `pet-tracker-notification-96.png` (R7).
- [ ] (3) Refactor: ninguno.

## R2 — Icono de la app (`icon.png`)

- [ ] (1) Tests: `#101 R2` en `app.assets.test.ts` (**nuevo**, con el helper
      `readIhdr`) y en `app.config.test.ts`.
      Los dos **nacen verdes**: el `icon.png` de la plantilla ya mide
      1024×1024 RGBA y la ruta no cambia; son candados de no-regresión sobre
      bytes nuevos. Comprobar el rojo con la mutación (`height: 1023`) y
      anotar en `progress/impl_<feature>.md` el `sha256` de `icon.png` antes
      y después del script (deben diferir).
- [ ] (2) Crear `scripts/make-icons.mjs` con la transformación de `icon.png`
      ([[design]] tabla) y correrlo: `bun scripts/make-icons.mjs`.
- [ ] (3) Refactor con tests verdes.

## R8 — Favicon (`favicon.png`)

- [ ] (1) Tests rojos: `#101 R8` en `app.assets.test.ts` y en
      `app.config.test.ts` (mismo matiz de «nace verde» que R2: el 48×48 de
      la plantilla ya cumple IHDR; documentar la mutación).
- [ ] (2) Añadir la fila de `favicon.png` al script y correrlo.
- [ ] (3) Refactor con tests verdes.

## R3 — Foreground del adaptive icon

- [ ] (1) Tests rojos: `#101 R3` en `app.assets.test.ts` (rojo real: el
      foreground de la plantilla mide 512×512) y en `app.config.test.ts`.
- [ ] (2) Añadir al script la fila del foreground ([[design]] tabla: resize
      1254→676 y `composite` en (174, 174) sobre lienzo transparente de
      1024, D7) y correrlo. Anotar en `progress/impl_<feature>.md` la salida
      del comando de bbox de [[design]] §Verificaciones del reviewer
      (`{x0:174,y0:174,x1:849,y1:849}`).
- [ ] (3) Refactor con tests verdes.

## R4 — Monochrome del adaptive icon

- [ ] (1) Tests rojos: `#101 R4` en `app.assets.test.ts` (rojo real: la
      plantilla mide 432×432) y en `app.config.test.ts`.
- [ ] (2) Añadir al script la fila del monochrome (umbral D5 sobre
      `monochrome-original` a 1254, R=G=B=255, resize 1254→676, `composite`
      en (174, 174)) y correrlo. Anotar la bbox (dentro de `[174, 850]`).
- [ ] (3) Refactor con tests verdes.

## R5 — Fondo plano del adaptive icon

- [ ] (1) Tests rojos: `#101 R5` en `app.config.test.ts` (`#E6F4FE` y
      `backgroundImage` presente hoy) y en `app.assets.test.ts` (el fichero
      existe hoy).
- [ ] (2) `app.json`: `backgroundColor` → `#9460FC`, quitar `backgroundImage`;
      `git rm mobile-pet-tracker/assets/images/android-icon-background.png`.
- [ ] (3) Refactor con tests verdes.

## R6 — Splash con el icono sobre violeta

- [ ] (1) Tests rojos: `#101 R6` en `app.config.test.ts` y en
      `app.assets.test.ts` (rojo real: 228×213 hoy).
- [ ] (2) `app.json`: tuple del plugin `expo-splash-screen` con
      `#9460FC` / `splash-icon.png` / `imageWidth: 200`; en el **mismo
      commit**, relajar la aserción del splash en `#79 R2` a
      `expect.any(Object)` ([[design]] §Cambios en app.config.test.ts), si no
      el verde no llega. Añadir la copia `splash-icon.png` al script y
      correrlo.
- [ ] (3) Refactor con tests verdes.

## R7 — Icono de notificación blanco tintado

- [ ] (1) Tests rojos: `#101 R7` en `app.config.test.ts` y en
      `app.assets.test.ts` (rojo real: el fichero no existe).
- [ ] (2) `app.json`: tuple del plugin `expo-notifications` con `icon`,
      `color`, `defaultChannel`; en el **mismo commit**, relajar la aserción
      de `expo-notifications` en `#79 R2` a `expect.objectContaining`. Añadir
      al script umbral 128 → RGB 255 → resize 96 y correrlo.
- [ ] (3) Refactor con tests verdes.

## R9 — iOS intacto

- [ ] (1) Test: `#101 R9` en `app.config.test.ts` (nace verde por diseño: es
      un candado de no-regresión; comprobar el rojo con la mutación y
      documentarlo).
- [ ] (2) Nada que implementar.
- [ ] (3) `git diff --stat d29d49d5 -- mobile-pet-tracker/assets/expo.icon` vacío.

## Cierre de Codex

- [ ] Suite móvil completa verde y `tsc --noEmit` exit 0; anotar recuento de
      suites/tests en `progress/impl_<feature>.md`.
- [ ] `git diff --stat d29d49d5 -- mobile-pet-tracker/package.json bun.lock
      mobile-pet-tracker/src` vacío; ídem sobre las tres fuentes
      `pet-tracker-*` (R1).
- [ ] [[traceability]] con hash por fila.

## R10 — Prueba en dispositivo (humano)

- [ ] (1) Sin test jest. El candado son las tres casillas «Smoke R10» de
      [[requirements]] §Aprobación.
- [ ] (2) El humano sigue [[design]] §Prueba de humo tras el veredicto del
      reviewer sobre R1–R9.
- [ ] (3) El leader no marca `done` hasta que las tres casillas estén firmadas.
