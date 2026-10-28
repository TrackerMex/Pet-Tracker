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

## #217 mobile-theme-flash-statusbar (mergeada en dev)

Requiere el rebuild G3 (dev build sin nitro).

1. Cambiar de pestaña no deja un destello de fondo, en tema claro y oscuro.
2. El interruptor de tema en Perfil cambia al instante.
3. Los iconos de la barra de estado se leen sobre el hero (Inicio, Perfil) y en las pantallas sin hero.
4. Al salir de Perfil, el estilo automático de la barra vuelve.

- [ ] Smoke de #217 recorrido por el humano (fecha: ____)

## #222 mobile-tab-avatar-header (PR a `dev`; R12/G4 abierto)

1. Salud y Nutrición no muestran título: arriba queda la fila de avatares de mascotas, fija mientras el contenido se desplaza.
2. El vidrio de la cabecera se lee bien en tema claro y oscuro, con la barra de estado y con el contenido pasando por debajo.
3. Pulsar un avatar cambia de mascota en la pestaña (Salud y Nutrición) y mantiene la selección al cambiar de pestaña.
4. Con 7 o más mascotas la fila se desplaza en horizontal.
5. Perfil no muestra título visible; TalkBack anuncia «Perfil» como encabezado.
6. Sin mascotas no aparece la fila.

- [ ] Smoke de #222 recorrido por el humano (fecha: ____)

## #221 mobile-orbit-rename-copy (en dev, PR #282)

1. Con idioma español la burbuja de la bienvenida dice «Hola, soy Orbit.»; con inglés, «Hi, I'm Orbit.».
2. La burbuja no corta el texto.

- [ ] Smoke de #221 recorrido por el humano (fecha: ____)

## #223 mobile-alerts-attended-section (en dev, PR #279; R19/G4 abierto)

1. Con alertas atendidas, la lista muestra primero las abiertas y debajo la sección «Atendidas» colapsada, con su contador.
2. «Ver más» expande las atendidas y vuelve a colapsarlas.
3. Sin alertas abiertas, la sección de atendidas se ve sola y la pantalla no queda vacía.
4. Tema claro y oscuro: la sección y su cabecera se leen bien.

- [ ] Smoke de #223 recorrido por el humano (fecha: ____)

## #224 mobile-nutrition-ai-format (PR a `dev`)

1. Con un plan real y una explicación larga, el texto se recorta en unas seis líneas con el degradado sobre el borde.
2. «Ver más» expande y «Ver menos» vuelve; la zona táctil del botón es de 44 de alto.
3. TalkBack lee el texto como un párrafo continuo y el botón por separado.
4. Tema oscuro: el degradado no deja banda visible.
5. Si el recorte de 122 o el degradado de 36 no calzan, se ajustan `AI_CLAMP_HEIGHT` / `AI_FADE_HEIGHT` en una enmienda.

- [ ] Smoke de #224 recorrido por el humano (fecha: ____)

## #225 mobile-orbit-activity-pose (PR a `dev`)

No necesita rebuild: la imagen nueva es un asset de Metro. Sale de `specs/mobile-orbit-activity-pose/requirements.md`
§Smoke G2.

1. En Inicio, con una mascota que hoy lleva al menos 100 m y en tema claro, la burbuja muestra a Orbit andando
   (`orbit-walk`). Mide 56 dp, flota como antes y no se recorta. El texto empieza por «<mascota> ya caminó …».
2. Lo mismo en tema oscuro.
3. Con una mascota que hoy lleva menos de 100 m, o sin tracking, la burbuja vuelve a la pose base (`orbit-talk`), del
   mismo tamaño, en claro y en oscuro. **La pose de este paso tiene que ser distinta de la del paso 1.** Los tests de
   R5 no comprueban qué dibujo hay en `orbit-walk.webp`, así que una copia de la pose base pasaría en verde (H1 del
   review).
4. Con TalkBack, en el paso 1 la imagen se anuncia como «Orbit caminando». En el paso 3 no se anuncia.
5. Bienvenida, iniciar sesión, nueva mascota, estados vacíos y emparejamiento muestran las mismas poses que antes del
   renombrado, y no falta ninguna imagen.

- [ ] Smoke de #225 recorrido por el humano (fecha: ____)
