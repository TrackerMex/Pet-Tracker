# Smoke del plan de mejoras de UI

Lote del gate G2 del plan `progress/plan_ui-2026-10-26.md` (§5). Cada feature apunta aquí lo que
solo se ve en el teléfono. Lo recorre el humano en el dev build de Android, en su PC, **una sola
vez al terminar todas las features** (instrucción del humano, 2026-10-27): ninguna feature espera su
smoke para mergear en `dev`. El rebuild del dev build sin `react-native-nitro-*` (G3) va antes del
recorrido. Lo que falle abre una feature de arreglo.

## #220 mobile-date-field (en dev, PR #264)

1. Un toque en cualquier campo de fecha abre el diálogo nativo (el campo es `pointerEvents="none"`).
2. Con tema oscuro, el diálogo y el campo se leen bien.
3. Probar en Peso, Documentos, Alta de mascota y Recordatorio (fecha y hora).
4. El botón de limpiar no abre el picker.

- [ ] Smoke de #220 recorrido por el humano (fecha: ____)

## #219 mobile-weekly-average-format (en dev, PR #266)

1. En Inicio, la etiqueta «Media …» de la tarjeta de actividad semanal cabe sin cortarse.
2. La tendencia muestra punto decimal.

- [ ] Smoke de #219 recorrido por el humano (fecha: ____)

## #218 mobile-sheet-surface-background (en dev, PR #267)

1. Las hojas inferiores de Recordatorios y de Emparejar no muestran la franja rosa en el borde.
2. Comprobar en tema claro, oscuro y con Material You.

- [ ] Smoke de #218 recorrido por el humano (fecha: ____)

## #217 mobile-theme-flash-statusbar (en implementación)

Requiere el rebuild G3 (dev build sin nitro).

1. Cambiar de pestaña no deja un destello de fondo, en tema claro y oscuro.
2. El interruptor de tema en Perfil cambia al instante.
3. Los iconos de la barra de estado se leen sobre el hero (Inicio, Perfil) y en las pantallas sin hero.
4. Al salir de Perfil, el estilo automático de la barra vuelve.

- [ ] Smoke de #217 recorrido por el humano (fecha: ____)

## #221 mobile-orbit-rename-copy (pendiente)

1. Con idioma español la burbuja de la bienvenida dice «Hola, soy Orbit.»; con inglés, «Hi, I'm Orbit.».
2. La burbuja no corta el texto.

- [ ] Smoke de #221 recorrido por el humano (fecha: ____)
