# Handoff a Codex CLI — D7 de #70 `mobile-home-reminders-section`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-section/requirements.md` §Decisiones de
> implementación, entrada **D7**.

Branch: `feature/70-mobile-home-reminders-section`, publicada en `origin`.
Trabaja encima. No rebases ni reescribas historial.

**El segundo pase quedó APROBADO.** El bloqueante está cerrado: M1 y M2 ponen la
suite completa roja con `bun run test` sin exportar `TZ`, reproducido por el
reviewer en un worktree aislado. Esto **no** es otro rechazo.

Lo que queda son dos agujeros que el reviewer destapó buscando activamente, no
fallos de lo que entregaste. Los dos arreglos son **solo de test**: no se toca
una línea de producción. Veredicto completo, con las sondas ejecutadas, en
`progress/review_mobile-home-reminders-section.md` (§O4 y §O5).

---

## O4 — el candado vigila el objetivo, pero no `now`

`format.ts:6` normaliza el día local del dispositivo con getters locales:

```ts
const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
```

Sustituirlos por sus equivalentes UTC —la mutación **M9**— hace en una caja UTC
**exactamente las mismas llamadas** a `Date.UTC`, con los mismos componentes, y
por eso pasa las tres aserciones de espía que añadiste:

```ts
const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
```

Medido por el reviewer:

- M9 plantada, `bun run test` sin `TZ` → **68/68 suites, 1078/1078 verdes**;
- la misma M9 con `TZ=America/Mexico_City` → **rojo**, `Expected: 5, Received: 4`.

Es el desplazamiento de un día de #68, exacto, y viola la primera cláusula
normativa de R5. El candado no lo ve en la invocación del gate.

### Qué hacer

Añade dentro del `it` de R5 de `format.test.ts` un `now` cuyo día **local** y
día **UTC** difieran a propósito. El reviewer ya lo escribió y lo verificó:

```ts
const skewed = {
  getFullYear: () => 2026, getMonth: () => 8, getDate: () => 10,
  getUTCFullYear: () => 2026, getUTCMonth: () => 8, getUTCDate: () => 11,
} as unknown as Date;
expect(calendarDaysUntil('2026-09-15', skewed)).toBe(5);
```

Con M9 plantada da **1 fallo / 5 verdes**; con producción limpia, **6/6 verdes**.
Mata M9 en cualquier zona horaria y no necesita exportar nada.

**Criterio de aceptación, no negociable**: M9 se planta como **noveno par de
mutación** —commit rojo con la mutación de producción versionada, commit verde
que la revierte— y su rojo sale con `bun run test` **sin `TZ`**. Si no sale rojo
así, el candado no vale: **para y repórtalo**.

---

## O5 — dimensiones 12 y 13 de la fila: la forma no está vigilada

Dos sondas del reviewer, cada una sobre la suite móvil completa:

**O5-a — el estado vacío puede perder su forma de fila.** `index.tsx:571` lleva
`className="flex-row items-center gap-3"`. Cambiarlo a `className="gap-3"` —el
icono se apilaría **encima** del texto— deja **68/68 suites, 1078/1078 verdes**.
R12 asserta esa receta sobre la fila cargada (`index.test.tsx:2227`) pero **no**
sobre `reminders-none-upcoming`.

Duele porque R8 lo prescribe literalmente —*"la misma anatomía de fila que R6 …
para que la sección **no cambie de forma** al vaciarse"*— y el test se llama
`it('dibuja un estado vacío con forma de fila…')`. El título promete lo que la
aserción no comprueba.

**O5-b — el envoltorio `flex-1` de nombre + fecha.** `index.tsx:543`, el
`<View className="flex-1">` que agrupa nombre y fecha y empuja el contador a la
derecha. Cambiarlo a `className="w-24"` deja también **1078/1078 verdes**.

### Qué hacer

Una aserción por cada uno, con el patrón que R12 ya usa dos líneas más arriba:

```ts
expect(emptyRow.props.className).toContain('flex-row items-center gap-3');
```

**Cada una se demuestra con una sonda**: cruza el valor, ve el rojo, restaura, y
di en el informe qué viste. No hace falta versionarlas como mutaciones (solo M9
lo es), pero sí dejar la evidencia escrita.

---

## Lo que NO se toca

- **Nada de producción.** Si te ves editando `index.tsx` o `format.ts` fuera de
  plantar y revertir M9, para: algo se entendió mal.
- Ningún requisito de conducta, ningún otro candado. R5, R8 y R12 siguen
  exigiendo lo mismo; se añade lo que lo demuestra.
- **#81 sigue abierto** — es el mismo defecto en el tile de acciones rápidas, y
  no se cierra aquí.

## Reglas del repo que siguen aplicando

- TDD con historial rojo→verde visible, un commit por paso (`CHECKPOINTS.md` C4).
- C4 quinto punto: el rojo legítimo de M9 es la **mutación de producción**,
  versionada en el rojo y revertida en el verde. Nunca en un doble de test.
- Gate con `env -u FORCE_COLOR ./init.sh` desde la raíz (bug #75). Comprueba
  antes con `pgrep -f "bash ./init.sh"` que no hay otro corriendo.
- Línea base roja conocida y ajena: `health-vaccines.e2e-spec.ts:497` (#76).
- Carga las skills del plugin `expo` que `docs/ui-guidelines.md` indique.
- Añade al informe `progress/impl_mobile-home-reminders-section.md` una sección
  "Tercer pase" con el par de M9 y las dos sondas de O5. Actualiza
  `traceability.md`. Corre `graphify update .` al terminar.
- Si algo se contradice, **para y repórtalo**.
