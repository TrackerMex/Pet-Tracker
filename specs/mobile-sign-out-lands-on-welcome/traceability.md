---
feature: mobile-sign-out-lands-on-welcome
id: 149
status: approved
tags: [harness, spec, mobile, navigation]
---

# Trazabilidad — #149 mobile-sign-out-lands-on-welcome

> Una fila por requisito. La rellena quien implementa: test exacto
> (`archivo::nombre`) y commits rojo y verde (hash + mensaje). Ver
> [[requirements]] y [[tasks]].

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx::#149 R1: redirects an unauthenticated session to welcome` | Rojo: `4abb8bc5d833a76b7a2cfb9b670ef3b932c2dec4` — `test(mobile-auth): #149 R1 red, tabs layout redirects to welcome`.<br>Verde: `00d43733e6f20c84ba7d9898a8beaab6c3a0e1c8` — `fix(mobile-auth): #149 R1-R4 green, sign-out lands on welcome`. |
| R2 | `mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx::#149 R2: cierra sesión en %s y aterriza en welcome` (5 filas) | Rojo aislado: `6314f88f44d7ccb93ce93b2219f2697c09bf5d3b` — `test(mobile-auth): #149 R2 red, sign-out from every tab lands on welcome`.<br>Rojo E1 (fichero entero, por aserción): `f9f83b9d3cfaa7759f0e018eb9ef9215c5ba2c20` — `test(mobile-auth): #149 R2-R3 red, await the #95 R3 render`.<br>Verde: `00d43733e6f20c84ba7d9898a8beaab6c3a0e1c8` — `fix(mobile-auth): #149 R1-R4 green, sign-out lands on welcome`. |
| R3 | `mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx::#149 R3: cierra sesión en %s, aterriza en welcome y no reabre el detalle` (12 filas); `mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx::#95 R3::expulsa el detalle al cerrar sesión y no agrega rutas protegidas al historial`; `mobile-pet-tracker/src/app/__tests__/reminders-alerts-stack.navigation.test.tsx::#114 R2::mantiene una sola tabs, remonta listas al reentrar y protege ambas sin sesión` | Rojo original (fuga en la espera inicial; ver E1): `e414fa6f152fc2d4bbcebde2838a345a266bbcb3` — `test(mobile-auth): #149 R3 red, sign-out from every detail lands on welcome`.<br>Rojo E1 (por aserción tras cerrar sesión): `f9f83b9d3cfaa7759f0e018eb9ef9215c5ba2c20` — `test(mobile-auth): #149 R2-R3 red, await the #95 R3 render`.<br>Verde: `00d43733e6f20c84ba7d9898a8beaab6c3a0e1c8` — `fix(mobile-auth): #149 R1-R4 green, sign-out lands on welcome`. |
| R4 | `mobile-pet-tracker/src/__tests__/design-drift.test.ts::#149 R4: inventaría cada ruta a login en producción` | Rojo: `7881d6426c62c3c4f200fde17dee58fde59859c5` — `test(mobile-auth): #149 R4 red, only four production files route to login`.<br>Verde: `00d43733e6f20c84ba7d9898a8beaab6c3a0e1c8` — `fix(mobile-auth): #149 R1-R4 green, sign-out lands on welcome`. |
| Smoke P1–P4, S1–S5 | Humano, dev build de Android: P1–P4 y S1–S5 superados (2026-10-06) | `afa6a8ff` — `prueba de humo superada` (casillas en `requirements.md` §Prueba de humo) |
