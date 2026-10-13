---
feature: "mobile-account-screens-pingo"
status: draft   # draft | spec_ready | approved — pendiente de firma humana
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-account-screens-pingo]] (#167)

> Rutas relativas a `mobile-pet-tracker/`. Base congelada `d2b8b0ae`. Codex
> rellena cada fila con el hash y el mensaje de sus commits al terminar
> (tasks.md T15).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 (R1.1–R1.5) | movimiento verde: `src/screens/login/index.test.tsx` y `src/screens/register/index.test.tsx` (los `it` de la base, sin cambios) | `e5ee5a5f` refactor(mobile): mueve login y registro a src/screens (R1) |
| R1.6 | `src/__tests__/design-drift.test.ts::#167 R1: cada ruta solo renderiza su pantalla` | `7297bde0` test(mobile): rutas delgadas de login y registro (R1) |
| R2 | `src/theme/__tests__/motion.test.ts::#167 R2: …` (4) y `no exporta nada más` | `e009c792` test(mobile): tokens de pop y ping (R2)<br>`43a45f50` feat(mobile): tokens de pop y ping (R2) |
| R3 | `src/components/__tests__/pop-in.test.tsx::#167 R3: …` (4) | `697b3199` test(mobile): PopIn entra con escala y fundido (R3)<br>`a6fa7a86` feat(mobile): PopIn (R3) |
| R4 | `src/screens/home/home-entrance.test.tsx::#167 R4: pasa className tal cual sin añadir style` | `da81e1d7` test(mobile): HomeEntrance pasa className (R4)<br>`7ff33151` feat(mobile): HomeEntrance pasa className (R4) |
| R5 | `src/providers/__tests__/language-provider.test.tsx::#167 R5: declara login.pingoGreeting en los dos idiomas y su registro` | `c4e3b3a0` test(mobile): clave del saludo de Pingo en login (R5)<br>`1f3e0cc0` feat(mobile): clave del saludo de Pingo en login (R5) |
| R6 | `src/screens/login/index.test.tsx::#167 R6: …` (13); `src/__tests__/ui-language.test.ts` (`checkUses(R1_AUTH)`, `checkUses(ALL_USES)`) | `6e169e1b` test(mobile): Pingo saluda en login y la pantalla entra en dos tiempos (R6)<br>`5b31f8a2` feat(mobile): Pingo saluda en login y la pantalla entra en dos tiempos (R6)<br>E1: `b8577bfc` test(mobile): #167 E1 rojo, candados de login con la mutación versionada (R6)<br>`743e2591` fix(mobile): #167 E1 verde, login restaurado desde 108bd291 (R6) |
| R7 | `src/screens/register/index.test.tsx::#167 R7: …` (6) | `9c02f7a0` test(mobile): Pingo en la cabecera del registro (R7)<br>`b5433595` feat(mobile): Pingo en la cabecera del registro (R7)<br>E1: `3636fcb1` test(mobile): #167 E1 rojo, candados del registro con la mutación versionada (R7)<br>`7c33bc15` fix(mobile): #167 E1 verde, registro restaurado desde 108bd291 (R7) |
| R8 | `src/screens/register/index.test.tsx::#167 R8: …` (4) | `dbdfb49b` test(mobile): el error del registro lleva icono (R8)<br>`ed49c8ca` feat(mobile): el error del registro lleva icono (R8) |
| R9 | `src/screens/forgot/index.test.tsx::#167 R9: …` (4) | `0c66e6c5` test(mobile): Pingo y pop del candado en recuperar (R9)<br>`0a63d4e9` feat(mobile): Pingo y pop del candado en recuperar (R9) |
| R10 | `src/screens/reset-password/index.test.tsx::#167 R10: …` (14); `src/__tests__/legibility-classnames.test.ts::screens/reset-password/index.tsx pinta con text-accent-strong (3)` | `50972818` test(mobile): Pingo y tarjeta de estado en nueva contraseña (R10)<br>`3e168e10` feat(mobile): Pingo y tarjeta de estado en nueva contraseña (R10)<br>E1: `1bb945c1` test(mobile): #167 E1 rojo, cabeceras y error de nueva contraseña con la mutación versionada (R10)<br>`edecd414` fix(mobile): #167 E1 verde, nueva contraseña restaurada desde 108bd291 (R10) |
| R11 | `src/screens/welcome/index.test.tsx::#167 R11: …` (4) | `f5b7bd17` test(mobile): la carta declara los anillos de ping (R11)<br>`5834b4e5` docs(ui): enmienda de la carta para los anillos de ping (R11) |
| R12 | `src/screens/welcome/index.test.tsx::#167 R12: …` (10) y la aserción de hijos de `welcome-scene` | `fc49e87f` test(mobile): anillos de ping alrededor de Pingo (R12)<br>`13835918` feat(mobile): anillos de ping alrededor de Pingo (R12) |
| R13 | `src/screens/welcome/index.test.tsx::#167 R13: …` (2) y los dos `it` de la base con `expect(mockWithRepeat).not.toHaveBeenCalled()` | `7c4f727d` test(mobile): sin anillos con reduce motion (R13) |
| R14 | `src/__tests__/design-drift.test.ts::#167 R14: …` (4) | `108bd291` test(mobile): las pantallas de cuenta no traen deriva (R14) |
| R15 | prueba de humo en dev build de Android (humano) | pendiente (humano) |

---

## Firma de la enmienda de la carta (R11)

La casilla vive en `docs/ui-guidelines.md` § `## Enmienda #167 — anillos de
ping de la bienvenida`: `- [ ] Enmienda aprobada por humano`.

Texto aprobado en Notion (P8): el humano marcó `[X]` en la página de la spec,
edición 2026-10-12T15:24:14Z. Codex la escribe sin marcar (c22); el leader la
marca en el cierre citando esa edición. El candado de R11.3 acepta las dos.

---

## Firma de la prueba de humo (R15)

- [X] Prueba de humo en dev build de Android superada (tasks.md T16, pasos 1–7)
- Dispositivo: OnePlus Nord 5
- Fecha: 2026-10-13
- Observaciones: Mejorar la pantalla de Inicio de sesión debe de ser como el diseño del artifact, tambien aplica para crear cuenta aplica grid o flex para las columnas, recuperar contraseña, al igual el tamaño de textos, aplicar bold a los textos destacados, lo botonos también deben de ser consistentes con el diseño ocupa todo el ancho disponible de la pantalla para el contenido, falta agrear el row de regresar a la pantalla anterior en Iniciar sesión, Crear cuenta y recuperar contraseña, tambien los mensaje de validación deben de ser consistentes con el diseño del artifact.
