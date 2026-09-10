# Handoff a Codex CLI — A8 de #85 `mobile-home-reminders-real-data`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-real-data/requirements.md` §Decisiones de
> implementación, entrada **A8**.

Branch: `feature/85-mobile-home-reminders-real-data`. Sigue donde lo dejaste,
tras `b1aca71`. No rebases ni reescribas historial.

**Paraste bien otra vez.** El defecto es de la spec y es **solo de la evidencia
escrita**: el candado está sano y la fixture no se toca.

## Qué estaba mal

La tabla de R15 decía que con **M3** plantada *"Entran `rem-sent` y
`rem-cancelled`"*. Falso: con el tope de tres, la salida ordenada es
`rem-today(+0d)`, `rem-next(+1d)`, `rem-sent(+2d)`, `rem-cancelled(+3d)`, y el
cuarto lo recorta el tope. Solo aflora `rem-sent`. Tu medición —1 fallo/12
verdes por `rem-sent`— es la correcta.

## Qué hacer

**Nada de código.** Continúa la verificación por mutación donde la dejaste:

- **M3 queda validada** con la evidencia real: aflora `rem-sent`,
  `rem-cancelled` lo recorta el tope, y el `it` falla igual porque espera
  **exactamente dos** ids. Anótalo así en el informe.
- **Sigue con M4** y el resto de la tabla.

## Qué NO cambia

- **La fixture normativa se queda como está.** Tocarla arrastraría a M4, M5 y
  M6, y **M6 depende del orden invertido del par empatado** (`rem-z` antes que
  `rem-a`), que es normativo.
- M3 sigue siendo la misma mutación y sigue cayendo por el mismo `it`.
- M4 y M5 no se tocan.

## Por qué el candado no se debilita

Comprobado caso por caso por el leader. La salida esperada del `it` son
**exactamente dos ids**, así que cualquier intruso lo pone rojo:

| mutación | salida con el tope aplicado | resultado |
|---|---|---|
| quitar solo la exclusión de `sent` | `[rem-today, rem-next, rem-sent]` | rojo |
| quitar solo la exclusión de `cancelled` | `[rem-today, rem-next, rem-cancelled]` | rojo |
| quitar las dos (M3 tal cual) | `[rem-today, rem-next, rem-sent]` | rojo |

No hay zona ciega: en el caso "solo `cancelled`", el hueco que deja `sent` lo
deja entrar.

## Reglas del repo, sin cambios

- TDD por requisito, un commit por paso.
- `CHECKPOINTS.md` C4 quinto punto: mutaciones de **código de producción**,
  nunca de un doble de test.
- Gate `env -u FORCE_COLOR ./init.sh` desde la raíz (bug #75); `pgrep` antes.
- Base roja conocida y ajena: `health-vaccines.e2e-spec.ts:497` (#76).
- Cero backend.
- **Si encuentras otra contradicción, para y repórtala.** Van tres y las tres
  veces parar fue lo correcto.
