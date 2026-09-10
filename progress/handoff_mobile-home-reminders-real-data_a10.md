# Handoff a Codex CLI — A10 de #85 `mobile-home-reminders-real-data`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-real-data/requirements.md` §Decisiones de
> implementación, entrada **A10**.

Branch: `feature/85-mobile-home-reminders-real-data`. Sigue desde el rojo
versionado de R4 (`c2d5dfd`). No rebases ni reescribas historial.

**Paraste bien.** El diagnóstico es exacto y la contradicción no tenía salida
sin enmienda: `tasks.md` mandaba dejar verdes los `describe` heredados **sin
tocarlos**, y la cuarta petición de R4 rompe uno por construcción.

## Qué hacer

**Un carácter.** En `index.test.tsx:797`, dentro del
`describe('R10: preserva la mascota durante el refetch')`:

```diff
-const result = hookCall++ % 3 === 0 ? petsResult : emptyResult;
+const result = hookCall++ % 4 === 0 ? petsResult : emptyResult;
```

Luego termina el verde de R4 con la implementación mínima que ya tenías
—`listReminders`, `remindersFn` y el cuarto `useApi(remindersFn)`—.

`tasks.md` §R4 ya lleva la adaptación anotada.

## Por qué es legítimo

El `% 3` **codificaba el número de llamadas a `useApi` por render**: la primera
devolvía la lista de mascotas, las otras dos vacío. Con cuatro llamadas el ciclo
se desalinea en el segundo render, el hook de la lista recibe `emptyResult` y
sale tu `TypeError ... reading 'nextVaccine'`.

**Esto no es mutar un doble para fabricar un rojo**, que es lo que prohíbe el
quinto punto de C4. Es al revés: el doble codificaba una aridad que la feature
cambia legítimamente, y se actualiza para que **siga midiendo lo mismo**. La
primera llamada de cada render sigue siendo la de la lista, el resto sigue
vacío, y los dos `expect(selectPet).not.toHaveBeenCalled()` no se tocan.

## Qué NO cambia

- **Ningún otro `describe` heredado, ninguna aserción, ningún otro doble.**
- El mock por defecto de `listReminders` que prescribe **A6** sigue como está:
  no interviene en este test, porque sustituye el hook entero y nunca llega a la
  capa de API.
- **Si al cambiar el `% 4` cae algo más, para y repórtalo.**

## Deuda registrada, no la arregles aquí

**#86**: el doble es frágil por diseño —acopla el test al **número** de
llamadas a `useApi`, así que cualquier feature futura que añada una petición a
la Home lo romperá igual, con un `TypeError` opaco a tres capas de la causa—.
Lo honesto es indexar por la **función pasada** al hook, no por el orden de
llamada. Es refactorización de un test heredado y **no entra en #85**.

## Reglas del repo, sin cambios

- TDD por requisito, un commit por paso.
- `CHECKPOINTS.md` C4 quinto punto: las mutaciones son de **código de
  producción**, nunca de un doble de test.
- Gate `env -u FORCE_COLOR ./init.sh` desde la raíz (bug #75); `pgrep` antes.
- Base roja conocida y ajena: `health-vaccines.e2e-spec.ts:497` (#76).
- Cero backend.
- **Si encuentras otra contradicción, para y repórtala.** Van cinco y las cinco
  veces parar fue lo correcto.
