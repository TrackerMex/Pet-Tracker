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
| R1 (R1.1–R1.5) | movimiento verde: `src/screens/login/index.test.tsx` y `src/screens/register/index.test.tsx` (los `it` de la base, sin cambios) | pendiente |
| R1.6 | `src/__tests__/design-drift.test.ts::#167 R1: cada ruta solo renderiza su pantalla` | pendiente |
| R2 | `src/theme/__tests__/motion.test.ts::#167 R2: …` (4) y `no exporta nada más` | pendiente |
| R3 | `src/components/__tests__/pop-in.test.tsx::#167 R3: …` (4) | pendiente |
| R4 | `src/screens/home/home-entrance.test.tsx::#167 R4: pasa className tal cual sin añadir style` | pendiente |
| R5 | `src/providers/__tests__/language-provider.test.tsx::#167 R5: declara login.pingoGreeting en los dos idiomas y su registro` | pendiente |
| R6 | `src/screens/login/index.test.tsx::#167 R6: …` (9); `src/__tests__/ui-language.test.ts` (`checkUses(R1_AUTH)`, `checkUses(ALL_USES)`) | pendiente |
| R7 | `src/screens/register/index.test.tsx::#167 R7: …` (4) | pendiente |
| R8 | `src/screens/register/index.test.tsx::#167 R8: …` (4) | pendiente |
| R9 | `src/screens/forgot/index.test.tsx::#167 R9: …` (4) | pendiente |
| R10 | `src/screens/reset-password/index.test.tsx::#167 R10: …` (10); `src/__tests__/legibility-classnames.test.ts::screens/reset-password/index.tsx pinta con text-accent-strong (3)` | pendiente |
| R11 | `src/screens/welcome/index.test.tsx::#167 R11: …` (4) | pendiente |
| R12 | `src/screens/welcome/index.test.tsx::#167 R12: …` (10) y la aserción de hijos de `welcome-scene` | pendiente |
| R13 | `src/screens/welcome/index.test.tsx::#167 R13: …` (2) y los dos `it` de la base con `expect(mockWithRepeat).not.toHaveBeenCalled()` | pendiente |
| R14 | `src/__tests__/design-drift.test.ts::#167 R14: …` (4) | pendiente |
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

- [ ] Prueba de humo en dev build de Android superada (tasks.md T16, pasos 1–7)
- Dispositivo: ____
- Fecha: ____
- Observaciones: ____
