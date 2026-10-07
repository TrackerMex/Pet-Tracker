# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #153 mobile-welcome-pingo — spec aprobada

- Spec en `specs/mobile-welcome-pingo/`. Espejo en Notion:
  https://app.notion.com/p/3f26115a9b27814194c0e3a051d61551
- Aprobada el 2026-10-07 en Notion (`page_last_edited_at` 2026-10-07T16:03:29.036Z).
  G1-G11 quedan con la opción de la spec. El humano confirmó en el chat que la
  aprobación cubre también G10 (copy y voz). Al aprobar marcó en Notion la casilla
  del smoke R14, pero no cuenta: aún no hay nada implementado, así que en el repo
  sigue sin marcar.
- Bloqueada: no hay handoff a Codex hasta que Backend avise del merge de #152.

### Pendiente tras el merge de #152 (antes del handoff)

1. **G11.** Revalidar la spec contra `main` con las anclas de T0. Si algo cambió,
   enmendar y reabrir el gate solo para las enmiendas.
2. **P-d, decidido por Backend el 2026-10-07:** lo corrige #153 tras el merge, no
   #152 (que no se toca a mitad de Codex). Hay que enmendar R2 con la frase de
   `docs/ui-guidelines.md` que lista las constantes que «migran a motion.ts en una
   feature posterior»: se quita `WELCOME_ENTRANCE_MS` de esa lista y se dice que
   #153 la retiró. El resto (`MEALS_BAR_*`, `KCAL_BAR_TIMING`, `BAR_ENTRY_*`,
   `METRIC_TAB_SPRING`, `TAB_INDICATOR_SPRING`) sigue pendiente. Ningún test de #152
   bloquea esa frase: el describe `#152 R2` de `motion.test.ts` solo comprueba
   `` `src/theme/motion.ts` (enmienda A21 de #152) ``, el
   `not.toContain('promueven a tokens')` y los encabezados. Esta enmienda va al gate.
3. **G2.** Convertir los dos WebP a `/home/claude/pet-tracker-mascot/webp/` con el
   comando de design.md §Assets.
