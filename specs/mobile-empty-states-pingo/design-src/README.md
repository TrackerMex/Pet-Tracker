# Referencia visual de #155

Copia literal de un artboard del canvas que el humano aprobó el 2026-10-06
(https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j, versión `1791473009-3376`,
leída el 2026-10-08). Es el único artboard del canvas con un estado vacío.

| Fichero | Artboard | Para qué sirve aquí |
|---|---|---|
| `inicio-vacio.dc.html` | `InicioVacio.dc.html` («Inicio sin mascotas») | Composición del estado vacío: óvalo `--surface2` detrás de la mascota, huellas decorativas, sombra elíptica, título, frase y CTA |

Es referencia, no fuente. Los hex y las `@keyframes` se traducen a tokens del
tema y a las constantes `MOTION_*` (`docs/ui-guidelines.md`). Además:

- El copy del canvas («Aún no tienes mascotas», la frase y «Añadir mascota»)
  **no está aprobado**.
- La imagen `/_blob/…` es la mascota provisional del canvas, no una de las poses
  de D2.
- El CTA del artboard lleva labio (`box-shadow: 0 4px 0 var(--lip)`), pero D4
  limita el CTA «con cuerpo» a la bienvenida y las celebraciones. Un estado
  vacío usa el `Button` normal.
