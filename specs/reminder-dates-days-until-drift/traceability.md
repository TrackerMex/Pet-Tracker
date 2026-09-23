---
feature: "reminder-dates-days-until-drift"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[reminder-dates-days-until-drift]] (#84)

Rutas relativas a `mobile-pet-tracker/`. R1 y R2 viven en
`src/utils/reminder-dates.test.ts`; R3 en `src/screens/reminders/index.test.tsx`.
Convención de commit: `test(<scope>): <desc> (Rn)` el rojo,
`feat(reminder-dates): <desc> (Rn)` el verde.
Codex rellena las columnas de commit tras cada commit; el `reviewer` no
aprueba si queda una fila de R1-R3 en «pendiente» (CHECKPOINTS C5). R4 la
cierra el humano en su casilla de [[requirements]].

**No rebasear después de rellenar esta tabla**: los hashes dejarían de ser
ancestros y habría que reapuntarlos verificando `git merge-base --is-ancestor`.

| Requisito | Test (título literal del `describe`) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 — días de calendario locales | `#84 R1: daysUntil cuenta días de calendario locales, no bloques de 24 h` | pendiente | pendiente |
| R2 — la zona horaria no desplaza la cuenta (verificación; mutación `getUTC*`) | `#84 R2: la zona horaria no desplaza la cuenta de días` | pendiente | pendiente |
| R3 — la pantalla cuenta días de calendario (verificación; mutación `Math.ceil`) | `#84 R3: recordatorios cuenta días de calendario en la píldora, el badge y la etiqueta` | pendiente | pendiente |
| R4 — smoke en dev build de Android | humano | — | pendiente |

## Candados ajenos movidos

| Candado | Delta | Commit |
|---|---|---|
| `src/utils/reminder-dates.test.ts` · fila `['positive', new Date('2026-08-25T09:00:01.000Z'), 2],` | esperado `2` → `1` | pendiente (rojo de R1) |
