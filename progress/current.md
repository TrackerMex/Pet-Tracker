# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

- Feature: #85 `mobile-home-reminders-real-data`
- Branch: `feature/85-mobile-home-reminders-real-data`
- Inicio: 2026-09-09 17:33 UTC
- Base: `df9b398`; `env -u FORCE_COLOR ./init.sh` verde tras A7 (móvil: 68 suites / 1078 tests)
- Plan: ejecutar R1-R15 en el orden normativo de `tasks.md`, TDD por requisito, sin tocar backend; actualizar trazabilidad tras cada par rojo/verde.
- A7: firmada y leída; traslada el candado inglés del contador a R8. Bloqueo resuelto, implementación reanudada en R1.
- Avance: R1 y R2 completos; R3 implementado y verde. M1 probada y restaurada. Commits y evidencia en `traceability.md` / `impl_mobile-home-reminders-real-data.md`.
- Bloqueo nuevo en R15/M3: la fixture normativa de R3 ordena `today`, `next`, `sent +2d`, `cancelled +3d` y la función termina con `slice(0, 3)`. Al quitar el filtro de estado, el resultado observado es `['rem-today', 'rem-next', 'rem-sent']`; `rem-cancelled` queda recortado. Esto contradice `requirements.md:840`, que afirma que con M3 entran `rem-sent` **y** `rem-cancelled`. La mutación fue restaurada y `format.test.ts` quedó 13/13 verde; no se inició M4.
