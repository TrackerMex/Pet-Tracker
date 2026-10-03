# Handoff a Codex CLI — A13 de #85 `mobile-home-reminders-real-data`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-real-data/requirements.md` §Decisiones de
> implementación, entrada **A13**.

Branch: `feature/85-mobile-home-reminders-real-data`. Sigue desde `a857aee`.

**Paraste bien, y tienes razón.** La sonda P9 vale; lo que estaba mal era mi
frase describiendo su rojo. `reminders-section-skeleton` depende **solo** de
`detail.data === undefined` (`index.tsx:566-571`), y P9 condiciona únicamente
`reminders-next-vaccine`. La sonda no toca el esqueleto.

## Qué hacer

**Nada de código nuevo.** Sigue con R9 usando la evidencia real:

- **P9 pone rojos los dos `it` de R9 por la misma causa**: desaparece la tarjeta
  de la vacuna y el cuerpo pasa de **1 hijo a 0**.
- Anótalo así en el informe, no como "desaparece el esqueleto".

`tasks.md` §R9 ya lleva la corrección.

## Qué NO cambia

- **La sonda P9, su sitio y su commit son los mismos.** Sigue atacando la frase
  normativa de R9 —*"el fallo de `listReminders` no puede apagar el dato del
  perfil, ni al revés"*—, que es exactamente lo que rompe.
- R9 conserva sus dos `it` y todas sus aserciones.
- **P10 no se toca.** R15 sigue sin renumerar.

## Después de R9, sigue hasta el final

**No pares al cerrar R9.** Continúa por `tasks.md` hasta **R15**: R10 con su
sonda P10, R11 (copy y M13), R12 (drift con su sonda), R13 (deltas como
sumandos), R14 (suite, typecheck, grep-clean) y R15 (las trece mutaciones).

- **M13** en R11: muta `en['home.reminders']` y debe caer
  `it('rotula en inglés')`.
- **M6** depende del orden invertido del par empatado en la fixture. **No la
  reordenes.**

## Reglas del repo, sin cambios

- TDD por requisito, un commit por paso.
- `CHECKPOINTS.md` C4 quinto punto: sondas y mutaciones de **código de
  producción**, nunca de un doble de test.
- Gate `env -u FORCE_COLOR ./init.sh` desde la raíz (bug #75); `pgrep` antes.
- Base roja conocida y ajena: `health-vaccines.e2e-spec.ts:497` (#76).
- Cero backend.
- Al terminar R15: informe completo, `traceability.md` al día, `graphify update .`.
- **Si encuentras otra contradicción, para y repórtala.** Van ocho y las ocho
  veces parar fue lo correcto.
