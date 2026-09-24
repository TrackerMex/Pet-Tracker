---
feature: "mobile-date-picker-utc-day-shift"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-date-picker-utc-day-shift]] (#123)

Rutas relativas a `mobile-pet-tracker/`. R1-R3 viven en
`src/utils/date-picker-value.test.ts`; R4 y R5 en
`src/screens/add-reminder/index.test.tsx`; R6 y R7 en
`src/screens/add-pet/index.test.tsx`.
Convención de commit: `test(<scope>): <desc> (Rn)` el rojo,
`fix(<scope>): <desc> (Rn)` el verde, con `<scope>` = `date-picker`,
`add-reminder` o `add-pet` según [[tasks]].
Codex rellena las columnas de commit **tras cada commit**; el `reviewer` no
aprueba si queda una fila de R1-R7 en «pendiente» (CHECKPOINTS C5). R8 la
cierra el humano en su casilla de [[requirements]].

Todos los rojos son **naturales** ([[design]] D8): ninguna fila lleva mutación
versionada.

Recuentos al cierre (base `70f841f3`): `src/utils/date-picker-value.test.ts`
**12** (R1 5 + R2 5 + R3 2); add-reminder **21 → 25**; add-pet **20 → 24**;
suite móvil **82 / 1471 → 83 / 1491**.

**No rebasear después de rellenar esta tabla**: los hashes dejarían de ser
ancestros y habría que reapuntarlos verificando `git merge-base --is-ancestor`.

| Requisito | Test (título literal del `describe`) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 — `fromPickerValue`: día UTC del diálogo → día local (5 filas: 3 de CDMX + Honolulu + Kiritimati) | `#123 R1: en Android, fromPickerValue convierte el día UTC del diálogo en día local` | pendiente | pendiente |
| R2 — `toPickerValue`: día local → medianoche UTC | `#123 R2: en Android, toPickerValue abre el diálogo en el día local` | pendiente | pendiente |
| R3 — fuera de Android, mismo objeto | `#123 R3: fuera de Android las dos conversiones devuelven el mismo objeto` | pendiente | pendiente |
| R4 — Nuevo recordatorio muestra y guarda el día elegido | `#123 R4: Nuevo recordatorio muestra y guarda el día elegido` | pendiente | pendiente |
| R5 — Nuevo recordatorio abre en el día local; mínimo y hora sin convertir | `#123 R5: el calendario de Nuevo recordatorio abre en el día local; el mínimo y la hora no se convierten` | pendiente | pendiente |
| R6 — Añadir mascota muestra y manda el día de nacimiento | `#123 R6: Añadir mascota muestra y manda el día de nacimiento elegido` | pendiente | pendiente |
| R7 — Añadir mascota abre en el día local; máximo sin convertir | `#123 R7: el calendario de nacimiento abre en el día local y el máximo no se convierte` | pendiente | pendiente |
| R8 — smoke en dev build de Android en México | humano | — | pendiente (casilla de [[requirements]] §Prueba de humo) |

## Candados ajenos movidos

Ninguno. Solo cambian recuentos ([[requirements]] §Candados «Se mueven»).
