# Handoff a Codex CLI — A14 de #85 `mobile-home-reminders-real-data`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-real-data/requirements.md` §Decisiones de
> implementación, entrada **A14**.

Branch: `feature/85-mobile-home-reminders-real-data`, publicada en `origin`.
Trabaja encima. No rebases ni reescribas historial.

**El reviewer APROBÓ la feature.** Esto no es un rechazo. Son dos cosas: una que
destapó la prueba de humo en dev build y otra que encontró el reviewer, y las
dos entran por A14, firmada por el humano.

## 1. El estado vacío de la vacuna mira ahora también los recordatorios

`index.tsx:608` pinta *"Sin vacuna próxima"* solo con
`detail.data?.kind === 'ok' && !detail.data.pet.nextVaccine`. No mira si hay
recordatorios debajo, así que con la lista llena el usuario ve tres
recordatorios y, encima, un cartel diciendo que no hay nada.

**Cambio de producción — una cláusula:**

```diff
-{detail.data?.kind === 'ok' && !detail.data.pet.nextVaccine ? (
+{detail.data?.kind === 'ok' &&
+ !detail.data.pet.nextVaccine &&
+ upcoming.length === 0 ? (
```

**Candado nuevo** (en `#85 R9`, o dentro de R5 si encaja mejor):

- sin vacuna **y con** recordatorios → **no** existe `reminders-none-upcoming`,
  y el cuerpo tiene exactamente `n` hijos;
- sin vacuna **y sin** recordatorios → **sí** existe, y el cuerpo tiene 1.

**Mutación P14, versionada en el rojo y revertida en el verde**: quitar la
cláusula `upcoming.length === 0`. **Rojo esperado**: reaparece la tarjeta en el
escenario con recordatorios. **Si queda verde, el candado no vale y se para.**

**Qué NO cambia**: cuando **sí** hay vacuna, su fila se pinta igual, esté la
lista llena o vacía — esto solo afecta al caso *sin vacuna*. Ni el texto, ni el
`testID`, ni la anatomía de la tarjeta se tocan.

**Los candados de #70 sobre `reminders-none-upcoming` deben seguir verdes sin
tocarlos**: sus escenarios no tienen recordatorios porque el `beforeEach` de
A11 repone `listReminders` a `[]`, así que para ellos la cláusula nueva es
verdadera. Si alguno cae, **para y repórtalo**.

## 2. El `size={20}` del icono de fila se canda (hallazgo O1)

Medido por el reviewer: puesto a `28`, la suite móvil **completa** queda
68/1110 verde. Nadie mira. Rompe la cláusula SHALL de R6 —cuya mitad del
`color` sí está candada— y el inventario de invariantes de R7.

No lo tapa el recuento de #70 R13: aquél cuenta literales
`<Syringe size={20}` en el fuente y la fila nueva renderiza **por variable**
(`<Icon …`), que es lo que R6 exige.

**Qué añadir**: una línea en el bucle de
`#85 R6 › liga icono, superficie y tinta a su tipo`, que ya tiene el nodo:

```ts
expect(icon.props.size).toBe(20);
```

**Sin mutación versionada**: basta una sonda —poner `28`, ver el rojo,
restaurar con `git diff` vacío— y dejar la evidencia escrita.

## Nota de procedimiento, para que no se haga costumbre

El reviewer detectó que **M9 y M10 se plantaron en el mismo commit rojo**
(`4078fdc`), contra el *"de una en una"* de R15. No tuvo consecuencia —las
reprodujo por separado y cada una mata solo su `it`—, pero le costó rehacer el
trabajo para poder atribuir el rojo. **P14 se planta sola.**

## Reglas del repo, sin cambios

- TDD: un commit por paso, test rojo antes que implementación.
- `CHECKPOINTS.md` C4 quinto punto: las mutaciones son de **código de
  producción**, nunca de un doble de test.
- Gate `env -u FORCE_COLOR ./init.sh` desde la raíz (bug #75); `pgrep` antes.
  **Ojo**: si la primera corrida cae por un flake del entorno, `set -e` aborta
  **antes** de lint y typecheck — solo una corrida que llegue al final verifica
  el gate entero.
- Flakes conocidos y ajenos: `health-vaccines.e2e-spec.ts:497` (#76) y el de
  selección de foto de add-pet (#72).
- **Cero backend.**
- Al terminar: sección nueva en `progress/impl_mobile-home-reminders-real-data.md`,
  `traceability.md` al día, y `graphify update .`.
- **Si encuentras una contradicción, para y repórtala.** Van ocho y las ocho
  veces parar fue lo correcto.
