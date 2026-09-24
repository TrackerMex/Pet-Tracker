---
feature: "reminder-dates-days-until-drift"
status: approved         # draft | spec_ready | approved
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
| R1 — días de calendario locales | `#84 R1: daysUntil cuenta días de calendario locales, no bloques de 24 h` | `72af7d62` | `fe7fd0de` |
| R2 — la zona horaria no desplaza la cuenta (verificación; mutación `getUTC*`) | `#84 R2: la zona horaria no desplaza la cuenta de días` | `e69c93b6` | `5a2a93d6` |
| R3 — la pantalla cuenta días de calendario (verificación; mutación `Math.ceil`) | `#84 R3: recordatorios cuenta días de calendario en la píldora, el badge y la etiqueta` | `db7e3b0c` | `720817f8` |
| R4 — smoke en dev build de Android | humano | — | superado 2026-09-24 (relatado por el humano; casilla en requirements) |
| R5 — el día civil incluye mes y año (Enmienda E1; verificación; mutación `to.getDate() - from.getDate()`) | `#84 R5: el día civil incluye el mes y el año (Enmienda E1)` | `45908678` | `c759482b` |
| R6 — umbrales de la píldora y del badge (Enmienda E1; verificación; mutación `<= 8` / `<= 11` en la pantalla) | `#84 R6: los umbrales de la píldora y del badge no se aflojan (Enmienda E1)` | `32313d9f` | `3e530242` |

## Candados ajenos movidos

| Candado | Delta | Commit |
|---|---|---|
| `src/utils/reminder-dates.test.ts` · fila `['positive', new Date('2026-08-25T09:00:01.000Z'), 2],` | esperado `2` → `1` | `72af7d62` (rojo de R1) |
| `src/utils/reminder-dates.test.ts` · filas `zero`/`positive`/`negative` de `'returns a %s integer'` y su `const from` (Enmienda E1, H4) | instantes `Z` → componentes locales, mismos esperados | `45908678` (rojo de R5) |
