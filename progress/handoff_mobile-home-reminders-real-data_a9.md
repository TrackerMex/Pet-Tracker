# Handoff a Codex CLI — A9 de #85 `mobile-home-reminders-real-data`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-real-data/requirements.md` §Decisiones de
> implementación, entrada **A9**.

Branch: `feature/85-mobile-home-reminders-real-data`. Sigue donde lo dejaste,
tras `35af7e0`. No rebases ni reescribas historial.

**Paraste bien, y es la cuarta vez.** `tasks.md` mandaba plantar M3-M8 en R3,
pero **M7 y M8** nombran además dos `it` de la Home que el propio orden
normativo no crea hasta **R5**. En R3 solo existen los candados del helper.

## Qué cambia

**A9**, firmada por el humano. **`tasks.md` ya está actualizado**, así que basta
con seguirlo:

- **R3 paso (3)** planta ahora solo **M3, M4, M5 y M6**.
- **R5 paso (3)** planta **M7 y M8** antes que M2 y M11, y exige comprobar que
  cada una cae por **los cuatro** `it` que R15 les nombra: los dos de
  `format.test.ts` —que siguen vivos— y los dos de la Home.

## Qué NO cambia

- **Ninguna mutación se retira y ninguna pierde un `it`.** R15 sigue exigiendo
  las trece.
- **La fixture normativa sigue intacta**, y M6 conserva su orden invertido del
  par empatado (`rem-z` antes que `rem-a`), que es normativo.
- Todo lo demás de la spec queda igual.

## Ya está comprobado que no hay una quinta parada de esta clase

El leader recorrió las trece mutaciones contra el orden de `tasks.md`. Solo M7 y
M8 estaban mal colocadas. Las demás nombran `it` que ya existen donde se
plantan: M1 en R2, M3-M6 en R3, M2 y M11 en R5, M12 en R6, M9 y M10 en R7, y
M13 en R11 contra el `it` de R1. La tabla completa está en la entrada A9.

## Reglas del repo, sin cambios

- TDD por requisito, un commit por paso.
- `CHECKPOINTS.md` C4 quinto punto: mutaciones de **código de producción**,
  nunca de un doble de test.
- Gate `env -u FORCE_COLOR ./init.sh` desde la raíz (bug #75); `pgrep` antes.
- Base roja conocida y ajena: `health-vaccines.e2e-spec.ts:497` (#76).
- Cero backend.
- **Si encuentras otra contradicción, para y repórtala.** Van cuatro y las
  cuatro veces parar fue lo correcto.
