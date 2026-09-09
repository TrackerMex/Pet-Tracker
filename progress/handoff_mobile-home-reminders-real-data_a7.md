# Handoff a Codex CLI — A7 de #85 `mobile-home-reminders-real-data`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-real-data/requirements.md` §Decisiones de
> implementación, entrada **A7**.

Branch: `feature/85-mobile-home-reminders-real-data`, publicada en `origin`.
Trabaja encima. No rebases ni reescribas historial.

**Paraste bien.** La contradicción es real y es de la spec, no tuya: R1 exigía
asertar el `accessibilityLabel` del contador de una fila de recordatorio que el
propio orden de tareas no crea hasta **R5**, con la petición llegando en **R4**.
Ese `it` habría fallado por **sujeto ausente**, no por la copy que R1 arregla.

Es el mismo fallo que la enmienda D1 de #70 tuvo que corregir. Tu diagnóstico y
tu corrección mínima —aplazar la aserción inglesa— son los correctos.

## Qué cambia

**A7**, firmada por el humano. Lee la entrada completa en `requirements.md`
§Decisiones de implementación. En resumen:

- **R1** conserva `it('rotula en inglés')` con los tres literales cuyo sujeto sí
  existe en R1: `Reminders`, `See all` y el estado vacío
  `No upcoming vaccine` —que #70 ya renderiza—. **Pierde** la aserción del
  `accessibilityLabel` del contador.
- Esa aserción **se traslada a R8**, al `it` que ya asserta el contador en
  español (`'Faltan 1 días'`, `'Faltan 3 días'`, `'Faltan 6 días'`). Allí las
  tres filas existen. Se renderiza el mismo escenario con `HomeWrapperEn` y se
  asserta el contador de la primera fila.

## Qué NO cambia

- **R1 sigue candando los dos idiomas.** Es lo que decidió D-H y lo que cierra
  el hallazgo O7 de #70. No se relaja.
- El candado sigue observando **el texto pintado por la app**, nunca
  `catalog.ts` desde el test.
- **M13 no se toca**: sigue mutando `en['home.reminders']` a `Recordatorios` y
  sigue muriendo en `it('rotula en inglés')`.
- El alcance del candado inglés sigue limitado a esta sección.
- Todo lo demás de la spec queda como está: R2-R15, A0-A6, y las trece
  mutaciones con sus trampas declaradas (M6 y su fixture normativa, M10 y el
  orden de los hijos, M1 y el `TZ`, M11 y el recuento por `children.length`).

## Reglas del repo, sin cambios

- TDD por requisito, un commit por paso, test rojo antes que implementación.
- `CHECKPOINTS.md` C4 quinto punto: las mutaciones son de **código de
  producción**, nunca de un doble de test.
- Gate: `env -u FORCE_COLOR ./init.sh` desde la raíz (bug #75); `pgrep` antes.
- Base roja conocida y ajena: `health-vaccines.e2e-spec.ts:497` (#76).
- Cero backend. Si te ves editando `backend-pet-tracker/`, para.
- **Si encuentras otra contradicción, para y repórtala.** Van dos veces y las
  dos veces parar fue lo correcto.
