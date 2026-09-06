# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Rediseno contra el diseno del Make (desde 2026-09-04)

- **Origen y mapa**: `progress/explore_design-gap-vs-make.md`. Alcance cerrado por el humano: Bloque 0 + Bloque 1, features #64-#71.
- **feature en curso: #65 mobile-ui-language** (`in_progress`), branch `feature/65-mobile-ui-language` desde `origin/main` (aa8b395, con #64 y la firma de #65 ya dentro).
- **Implementa Codex CLI**; handoff en `progress/handoff_mobile-ui-language.md`. Orden obligatorio de `tasks.md`, que **no** es el orden de los ids: infraestructura R12-R13-R16-R14-R15 primero, luego las 11 pantallas R1-R11, y al final R17-R20.
- **Bloqueo C4 resuelto (2026-09-06)**: el humano aprobó y firmó la vía C4(b) para R18; se cerrará mediante mutación temporal documentada. Codex reanuda desde R12.
- **Mientras Codex implementa, esta sesion no toca `mobile-pet-tracker/` NI cambia de rama en este worktree.** En #64 el leader cambio de rama a mitad y Codex tuvo que recuperarse por reflog.
- **#64 paleta pastel: `done`**, mergeada en main (PR #106).
- **#66 listado con foto**: de la sesion Backend, `spec_ready`, esperando firma humana. Desbloquea #67 el hero fotografico.
- **Deuda registrada**: #72 el test flaky de seleccion de foto de add-pet. Y en la lane del Backend, el `.env` que `drizzle.config.ts` no carga.

## 2026-09-06 — #65: Codex agota limites; implementador pasa al subagente

**Hecho**: Codex CLI se quedo sin cuota a mitad de #65 y no vuelve hasta el
martes. El humano decide seguir en Claude Code.

**Excepcion de rol usada**: `CLAUDE.md` §Excepciones, primer supuesto —
"Codex CLI no esta disponible". A partir de R17(3) la implementacion de #65 la
escribe el subagente `implementer`, no Codex. Queda declarado aqui como manda
la regla.

**Coste, dicho sin adornos**: se pierde la propiedad "quien implementa no
revisa" en su version fuerte, porque `implementer` y `reviewer` salen del mismo
modelo. Lo que queda en pie: el `reviewer` corre `init.sh` el mismo, reconstruye
los rojo→verde con `git archive` y no se fia del reporte. Es una garantia mas
debil que la de dos modelos distintos, no una garantia nula. Lo que Codex ya
dejo escrito (R1-R16 y el rojo de R17) conserva la revision cruzada.

**Estado de #65 al pasar el testigo**:

- R1-R16 cerrados con rojo→verde real, 16 pares de commits en la branch.
- R17: rojo en `b682f20`; el verde esta **en el arbol de trabajo sin commitear**.
- R18-R20: sin empezar. R18 es requisito de verificacion por C4(b), firmado.
- Recuento de R17: la spec pedia 244 y el arbol da 265. La cifra estaba caduca,
  no equivocada — enmienda (2) al final de `specs/mobile-ui-language/requirements.md`
  con la traza commit a commit. **Pendiente de firma humana.**

**Leccion que se repite**: es la segunda vez (tras el R4 de #64) que un numero
absoluto calculado contra un commit concreto envejece antes de que se
implemente y para el trabajo. En la proxima spec que necesite un recuento
mecanico, expresarlo como **delta contra un commit nombrado**, no como
constante.
