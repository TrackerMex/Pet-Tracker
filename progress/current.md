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
- A8: firmada y leída; confirma que M3 aflora solo `rem-sent` porque el tope recorta `rem-cancelled`, sin cambiar fixture, candado ni código.
- Avance: R1, R2 y R3 implementados. M1, M3 y M4 probadas, documentadas y restauradas; M4 dejó entrar `rem-past` y cayó solo el `it` disponible prescrito. `format.test.ts` quedó 13/13 verde.
- Bloqueo de orden tras M4: `tasks.md:95-96` exige ejecutar M7/M8 dentro de R3 contra todos los `it` de R15, pero dos de esos `it` pertenecen a R5 y aún no existen (`requirements.md:404-421,844-845`). No se puede respetar a la vez el orden normativo y la evidencia prescrita. M5 no se plantó; árbol limpio.
