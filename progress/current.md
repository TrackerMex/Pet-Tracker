# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

- feature: device-provisioning-admin (#24)
- inicio: 2026-08-14
- spec aprobada por humano: specs/device-provisioning-admin/requirements.md
  (R1-R8, `status: approved`, gate cerrado 2026-08-14)
- decisiones del gate:
  - **Opción A** para el IMEI: lo teclea el humano en `--imei`. La opción B
    (leerlo del `uniqueId` de Wialon) se descartó — habría tocado el puerto
    `WialonUnit`, compartido con el pipeline de #8
  - Riesgo heredado de #7 **escalado a feature nueva #26**
    `claim-activation-code-only` (P1), no se arregla aquí
- plan: Codex CLI escribe `scripts/provision-device.ts` (alta de collar real,
  verificando el `wialon_unit_id` contra `listUnits()` antes de insertar) y
  `src/modules/devices/application/activation-code.ts`
  (`generateActivationCode()`, aridad cero, `randomBytes` + Crockford base32).
  Sin rutas HTTP nuevas, sin migración, sin tocar #7 ni #8.
- implementador: Codex CLI (implementación iniciada en
  `feature/24-device-provisioning-admin`)
- verificación inicial: `init.sh` verde el 2026-08-14
- siguiente paso: ejecutar TDD R4, R5, R1-R3 y R6-R8; al terminar, lanzar
  `reviewer` sobre `progress/impl_device-provisioning-admin.md`
