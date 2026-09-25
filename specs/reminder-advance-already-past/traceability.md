---
feature: "reminder-advance-already-past"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, backend, mobile]
---

# Trazabilidad — [[reminder-advance-already-past]] (#125)

R1 vive en `backend-pet-tracker/src/modules/reminders/application/reminder-push-body.spec.ts`;
R2 en `backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts`;
R3 y R4 en `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx`.
Convención de commit: `test(<scope>): <desc> (Rn)` el rojo,
`feat(<scope>): <desc> (Rn)` el verde, con `<scope>` = `reminders` (R1, R2) o
`add-reminder` (R3, R4) según [[tasks]].

**Codex rellena las columnas de commit en UN solo commit final**
`docs(reminders): fill #125 traceability`, **después del último verde** (R4).
No se toca este fichero en los commits TDD: ni ficheros de arnés mezclados con
test o producción, ni una actualización por commit. El `reviewer` no aprueba
si queda una fila de R1-R4 en «pendiente» (CHECKPOINTS C5). R5 la cierra el
humano en su casilla de [[requirements]].

Todos los rojos son **naturales** ([[design]] D10): ninguna fila lleva mutación
versionada. Los rojos de R1 y R2 llevan un esqueleto de producción nombrado en
[[tasks]].

Recuentos al cierre (base `40ec1b46`): `reminder-push-body.spec.ts` **7**;
`reminders-dispatch.service.spec.ts` **4 → 6**; backend unit
**170 / 1298 → 171 / 1307**; `add-reminder/index.test.tsx` **25 → 37**; móvil
**83 / 1491 → 83 / 1503**; e2e e infra sin cambios.

**No rebasear después de rellenar esta tabla**: los hashes dejarían de ser
ancestros y habría que reapuntarlos verificando `git merge-base --is-ancestor`.

| Requisito | Test (título literal del `describe`) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 — cuerpo del push con fecha y hora en la zona del owner (7 filas: 3 de Ciudad de México con cruce de mes y de año, UTC, Kiritimati, null, no IANA) | `#125 R1: el cuerpo del push dice cuándo vence, en la zona del owner` | pendiente | pendiente |
| R2 — el dispatcher lee la zona por mascota; lectura fallida no encola (2 `it` + R6 movido) | `#125 R2: el dispatcher escribe en el cuerpo cuándo vence, en la zona del owner de cada mascota` | pendiente | pendiente |
| R3 — chips desactivados, selección derivada y aviso enviado (7 filas + 2 `it` + 3 candados movidos) | `#125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro` | pendiente | pendiente |
| R4 — instante del cambio de fecha u hora y del envío (3 `it`) | `#125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío` | pendiente | pendiente |
| R5 — smoke en dev build de Android | humano | — | pendiente (casilla de [[requirements]] §Prueba de humo) |

## Candados ajenos movidos

Declarados en [[requirements]] §Candados «Se mueven»; viajan en el commit rojo
del requisito cuyo verde los rompería:

| Candado | Spec de origen | Delta | Viaja en |
|---|---|---|---|
| `reminders-dispatch.service.spec.ts` · `describe('R6: dispatcher publica el mensaje reminder exacto'` | `pet-reminders` (#16) | literal del cuerpo con `· 13 de agosto a las 11:00`; cuarto argumento en R5 (3) y R6 (1) | rojo de R2 |
| `add-reminder/index.test.tsx` · `it('renders alert choices and selects seven days by default'` | `mobile-reminders` (#39) | `{ selected: true }` → `{ selected: true, disabled: false }` (2 aserciones) | rojo de R3 |
| `add-reminder/index.test.tsx` · `it('posts the exact trimmed input and navigates back on success'` | `mobile-reminders` (#39) | día 25 → 28 de agosto (2 literales) | rojo de R3 |
| `add-reminder/index.test.tsx` · `describe('#123 R4: Nuevo recordatorio muestra y guarda el día elegido'` | `mobile-date-picker-utc-day-shift` (#123) | columna `aviso` `0 / 10080 / 10080` | rojo de R3 |
