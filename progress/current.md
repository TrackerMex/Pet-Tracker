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
- #152 mergeada en `main` (36c8050d, PR #198). La branch la incorporó por merge
  (61c03a8a), no por rebase, para que el commit de firma 10f7e808 siga valiendo.

### Tras el merge de #152

1. **G11, hecho 2026-10-08.** Anclas A1-A20 de T0 y bloques de design.md §Guards
   con su «Esperado» contra 36c8050d. #152 no tocó ningún fichero de #153.
2. **G2, hecho 2026-10-08.** Los dos WebP están en
   `/home/claude/pet-tracker-mascot/webp/` (56 062 y 55 608 bytes, VP8X con alfa,
   1024×1024).
3. **P-d, Enmienda E1 en el gate.** Decidido por Backend el 2026-10-07: la frase de
   la carta que lista lo que «migra a motion.ts en una feature posterior» pierde
   `WELCOME_ENTRANCE_MS` y dice que #153 la retiró. Tarea T8b, después de R8.
   Ningún test de #152 lee ese párrafo. El handoff a Codex espera a la firma de E1.
