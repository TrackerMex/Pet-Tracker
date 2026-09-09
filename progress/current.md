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
- A10: firmada y leída; autoriza el cambio puntual del doble posicional de `hookCall++ % 3` a `% 4`. Deuda estructural registrada fuera de alcance en #86.
- Avance: R1-R4 completos. R5 rojo versionado en `10c9636`: sus cinco `it` fallan por ausencia de filas y los 90 heredados quedan verdes.
- Bloqueo de aislamiento en R5: la implementación mínima pone verdes los cinco `it` nuevos, pero deja 3 fallos/92 verdes en #70 porque la última `mockResolvedValue` de R5 sobrevive a `jest.clearAllMocks()`; la respuesta vacía de la factoría no se restaura. Esto contradice la premisa de R4/A6 de conservar los `describe` heredados sin tocarlos. Producción retirada sin commit; M7 no iniciado; cero backend.
