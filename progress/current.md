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
- A9: firmada y leída; M7/M8 pasan de R3 al refactor de R5, donde existirán también sus dos candados de Home.
- Avance: R1, R2 y R3 completos. M1 y M3..M6 probadas, documentadas y restauradas; `format.test.ts` quedó 13/13 verde. R4 rojo versionado en `c2d5dfd`.
- Bloqueo de arnés en R4: la cuarta llamada obligatoria a `useApi` rompe el test heredado `R10: preserva la mascota durante el refetch`, cuyo doble cicla con `hookCall++ % 3`. La implementación exacta deja 1 fallo/89 verdes (`detail.data.pet` queda indefinido), pero `tasks.md:115-118` exige que los `describe` heredados queden verdes sin tocarlos y `design.md:267` no autoriza adaptar ese doble a `% 4`. Implementación retirada sin commit; no se tocó backend.
