# Smoke G2: arreglos y mejoras del 2026-11-03

Lote único al final de `progress/plan_mejoras-smoke-2026-11-03.md`, en el dev build
de Android del PC del humano. Cada spec añade aquí sus pasos al mergear; la casilla
de cada feature la marca solo el humano.

## #224 mobile-nutrition-ai-format (pendiente del lote anterior)

- [X] Smoke de #224 pasado tras #234 (fecha: 2026-11-04)

## #231 mobile-welcome-secondary-pressed

En el dev build de Android, sin sesión, en la pantalla de Bienvenida:

- [X] Tema claro: al mantener pulsado «Ya tengo una cuenta» la capa se tiñe de gris neutro tenue y el botón se encoge ligeramente; ya no se tiñe de verde.
- [X] Tema oscuro: el borde de 2 px del botón se ve claramente (gris `#9CA3AF`) y al mantener pulsado tampoco aparece verde.
- [X] «Comenzar ahora» sigue resaltando verde al pulsarlo.
## #235 mobile-profile-photo-owner-only

- [X] En Perfil, con una mascota propia (rol dueño), el botón de la cámara sobre la foto aparece y abre el cambio de foto.
- [X] Con una mascota compartida donde el rol no es dueño (familia, paseador o veterinario), el botón de la cámara no aparece.
- [X] Al cambiar entre una mascota propia y una compartida en el selector, la cámara se va y vuelve según el rol de la mascota elegida.
- [X] Fecha del smoke: 2026-11-04

## #226 backend-vaccine-catalog-migration

Hallazgo: «En agregar vacuna no aparecen las opciones de vacunas solo aparece el boton "Otra vacuna"».
Solo cambia el backend: no hace falta dev build nuevo ni reinstalar la app.

1. Antes de actualizar, con el backend de tu PC tal como está, abre un perro y entra en Salud → «Agregar vacuna». Debe salir solo «Otra vacuna»: es el fallo. Si ya corriste el paliativo `seed:vaccines`, en esa base el fallo no se reproduce; anótalo y sigue.
2. Actualiza el repo a `dev`, corre `pnpm -C backend-pet-tracker run db:migrate` (debe terminar sin error) y reinicia el backend.
3. «Agregar vacuna» en el perro: salen Leptospirosis, Polivalente (DHPPi), Rabia y Tos de las perreras, y después «Otra vacuna».
4. «Agregar vacuna» en un gato: salen Leucemia felina (FeLV), Rabia y Triple felina (FVRCP), y después «Otra vacuna».
5. Registra Rabia en el perro: aparece en Salud con su próxima dosis.

- [X] Smoke de #226 pasado (fecha: 2026-11-04; paso 1, fallo reproducido: sí)

## #227 mobile-reminders-upcoming-past

Hallazgo: en Recordatorios los pasados y cancelados salían mezclados con los próximos.
Necesita el dev build con `dev` actualizado (cambia la app, no el backend).

1. En el dev build de Android, con una mascota que tenga un recordatorio enviado de días pasados, uno cancelado, uno programado de ayer y dos futuros (uno de hoy), abre Recordatorios. Arriba sale «PRÓXIMOS» con los futuros en orden ascendente; el de hoy lleva borde ámbar y «Hoy». Ninguna fila atenuada sale arriba.
2. Al final sale «PASADOS» con el contador `3` y el chevron abajo, sin filas.
3. Toca «PASADOS»: se abren las tres filas atenuadas, de la más reciente a la más antigua, y el chevron mira arriba. Vuelve a tocar: se cierran.
4. Elimina los recordatorios futuros: en su lugar sale la caja «Nada pendiente por ahora / Los recordatorios nuevos aparecerán aquí.», encima de «PASADOS».
5. Repite 1 a 4 en tema claro y oscuro.

- [X] Smoke de #227 pasado (fecha: 2026-11-04; tema claro: sí; tema oscuro: sí)

## #232 mobile-add-reminder-chip-lip-clip

Hallazgo: en Agregar recordatorio el chip seleccionado de Tipo y Aviso salía con el labio inferior cortado. Necesita el dev build con `dev` actualizado. Reproduce el fallo original, en tema claro y en oscuro.

1. En el dev build de Android abre Recordatorios y pulsa «Agregar». «Vacuna» viene seleccionado: antes el verde se veía cortado por abajo; ahora se ve el labio inferior completo (una franja verde oscura de unos 3 px bajo la cápsula).
2. Pulsa «Desparasitación», «Otro» y los demás chips de Tipo (desliza la fila para llegar al último): el labio se ve entero en cada uno.
3. En «Aviso», con «7 días» seleccionado y luego «Mismo día», «1 día» y «3 días»: el labio se ve entero.
4. Compara con antes: la separación entre «Tipo», «Título», «Aviso» y la vista previa no cambia (la pantalla no se mueve 3 px).

- [X] Smoke de #232 pasado (fecha: 2026-11-04; tema claro: sí; tema oscuro: sí)

## #233 mobile-food-links-without-profile

Hallazgo: «En Nutricion sin Perfil, no deben de aparecer Horario de comidas y Historial de comidas ya que aun no se ha registrado un perfil nutricional».

1. Con una mascota sin perfil nutricional, abre Nutrición: sale «Aún no hay perfil nutricional» con el botón «Crear perfil nutricional» y no salen «Horario de comidas» ni «Historial de comidas» (antes de #233 las dos filas aparecían bajo el vacío).
2. Crea el perfil con el cuestionario y vuelve a Nutrición: ahora sí salen las dos filas.

- [x] Smoke de #233 pasado (fecha: 2026-11-04)

## #234 mobile-nutrition-ai-collapse-flicker

Hallazgo: «No marque mobile-nutrition-ai-format porque en eñ colapso de IA queda parpadiando». Necesita el dev build con `dev` actualizado. Reproduce el fallo original, en tema claro y en oscuro, con una mascota que tenga plan de nutrición con «Recomendación IA» (explicación larga).

1. Abre Nutrición. La tarjeta «Recomendación IA» aparece colapsada, con el degradado sobre el borde inferior y «Ver más». Mírala 10 segundos sin tocar nada: antes parpadeaba (cambiaba de alto una y otra vez); ahora queda quieta. Se admite un único salto al primer pintado.
2. Sal de Nutrición y vuelve a entrar tres veces: cada vez termina colapsada y quieta.
3. Pulsa «Ver más»: el texto se muestra completo y queda quieto; pulsa «Ver menos»: vuelve a unas seis líneas con degradado y queda quieto. Repite tres veces.
4. Cambia entre dos mascotas con planes distintos: el texto nuevo aparece colapsado y quieto (si la nueva explicación es corta, sin botón ni degradado).
5. En tema oscuro y en claro: el degradado se funde con el fondo violeta sin banda visible, igual que en el artboard aprobado; no hay espacio vacío extra bajo la tarjeta.
6. TalkBack: la explicación se lee una sola vez (un párrafo continuo) y «Ver más» por separado.

- [X] Smoke de #234 pasado (fecha: 2026-11-04; tema claro: sí; tema oscuro: sí). Cierra también el smoke de #224 («Smoke de #224 pasado tras #234»).

## #229 mobile-profile-family-join-row

Hallazgo: «Cards Familia y Unirme con código» (decisión «Lado a lado»); antes las dos salían a media anchura, en filas separadas y sin texto. Necesita el dev build con `dev` actualizado. Reproduce el fallo original, en tema claro y en oscuro.

1. En el dev build de Android abre Perfil con una mascota seleccionada: bajo las filas de Documentos/Emparejar y Zonas seguras/Recordatorios hay una sola fila con dos tarjetas lado a lado, Familia a la izquierda y Unirme con código a la derecha, con el mismo alto y el mismo ancho.
2. Cada tarjeta muestra su texto (Familia con su resumen; Unirme con código con «¿Te invitaron a cuidar una mascota?»), icono y chevron; ninguna sale vacía. Apunta si el texto se parte en 3 o 4 líneas en este teléfono: si lo rechazas, es otra feature.
3. Pulsa Familia: abre los miembros de la mascota. Pulsa Unirme con código: abre «Unirme con código».
4. Perfil sin mascotas: Unirme con código ocupa el ancho entero de su fila.
5. Repite 1 a 4 en tema claro y en oscuro.

- [X] Smoke de #229 pasado (fecha: 2026-11-04; tema claro: sí; tema oscuro: sí)

## #236 mobile-vaccine-catalog-error-state

Hallazgo: si el catálogo de vacunas no carga, «Agregar vacuna» no avisa y solo deja «Otra vacuna».
Necesita el dev build con `dev` actualizado (cambia la app, no el backend).

1. En el build de antes, con el backend en marcha, abre un perro y entra en Salud. Detén el backend de tu PC y pulsa «Agregar vacuna». Debe salir solo «Otra vacuna», sin ningún aviso: es el fallo.
2. Con el build nuevo, repite el paso 1. Debajo de «Vacuna» sale «No se pudieron cargar las vacunas» en rojo y el botón «Reintentar». «Otra vacuna» sigue seleccionada, con su campo de nombre.
3. Pulsa «Reintentar» con el backend todavía detenido: el aviso sigue.
4. Arranca el backend y pulsa «Reintentar». Salen Leptospirosis, Polivalente (DHPPi), Rabia y Tos de las perreras, después «Otra vacuna», y el aviso desaparece.

- [X] Smoke de #236 pasado (fecha: 2026-11-04; paso 1, fallo reproducido: sí)

## #228 mobile-reminder-swipe-actions

Hallazgo: los botones «Eliminar» y «Cancelar serie» ocupaban sitio en cada fila de Recordatorios; ahora se llega a ellos deslizando la fila. Necesita el dev build con `dev` actualizado (cambia la app, no el backend). Reproduce la queja original, en tema claro y en oscuro. Pasos copiados de `specs/mobile-reminder-swipe-actions/requirements.md` §Paso de smoke nuevo (G2):

1. En el dev build de Android, como dueño, abre Recordatorios con un recordatorio puntual, una serie programada y uno pasado. Ninguna fila lleva botón «Eliminar» ni «Cancelar serie»; el título de cada fila ocupa el ancho que antes ocupaba el botón.
2. Desliza a la izquierda una fila de Próximos: aparece el panel rosa con la papelera y «Eliminar», con esquinas redondas y sin hueco blanco entre la fila y el panel. Pulsa el panel: el deslizable se cierra y se abre la hoja «¿Eliminar recordatorio?». Cancela.
3. Expande «Pasados» y desliza una fila: el panel sale igual, sin atenuar, aunque la fila sí lo esté. Pulsa: se abre la misma hoja.
4. Desliza la serie: el panel dice «Cancelar serie» en dos líneas y abre la hoja de Cancelar serie de #213.
5. Con TalkBack activo, en una fila puntual y en la serie, abre las acciones del lector: salen «Eliminar» y «Cancelar la serie <título>», y cada una abre su hoja. El panel no se anuncia aparte.
6. Desplaza la lista en vertical con un gesto algo diagonal: la lista se desplaza y ninguna fila se abre sin querer. Suelta un deslizamiento corto: la fila vuelve a su sitio sin rebote.
7. Como familiar (rol `family`), la fila no se desliza.
8. Repite 2 a 4 en tema claro y oscuro.

- [X] Smoke de #228 pasado (fecha: 2026-11-04; tema claro: sí; tema oscuro: sí)

## #230 mobile-map-pet-avatar-marker

Hallazgo: «Pin genérico: quiero avatar». Necesita el dev build con `dev` actualizado (cambia la app, no el backend). Diseño de referencia: artboards `MapaAvatarFoto` y `MapaAvatarSinFoto` del canvas v167.

1. En el dev build de Android abre Mapa con una mascota que tenga foto y ubicación. Puede asomar un instante el pin genérico de Google; enseguida el marcador pasa a ser un círculo con borde blanco y la foto de la mascota, sin sombra ni halo, centrado en su posición.
2. Con una mascota sin foto: el mismo círculo con borde blanco, fondo blanco y el blobatar de la mascota en el centro.
3. Con una mascota cuya foto no carga (por ejemplo, borrando el objeto de la foto en el bucket de LocalStack): en 4 segundos como mucho el marcador muestra el blobatar sobre fondo blanco, y no se queda en el pin genérico ni en blanco.
4. Mueve, gira e inclina el mapa: el avatar sigue pegado a la posición, sin desfase.

- [X] Smoke de #230 pasado en Android (fecha: 2026-11-04; con foto: sí; sin foto: sí; foto rota: sí). La casilla G2 iOS sigue en `specs/mobile-map-pet-avatar-marker/requirements.md`.

## #242 mobile-home-scroll-edge-blur

Prueba (spike) de la librería nativa `expo-backdrop` 0.1.3 en Inicio: difuminado progresivo en el borde superior (bajo la barra de estado) y en el inferior (tras la tab bar flotante) al hacer scroll. Solo Inicio; la tab bar sigue con `expo-blur`. **Necesita reconstruir el dev build de Android** (`expo prebuild` + build): la librería es un módulo nativo y no corre en Expo Go ni en el dev build actual. Sin ese rebuild no hay smoke. Si no te convence, se revierte quitando el import, los overlays y la dependencia (D10 de la spec).

1. Con el dev build reconstruido, abre Inicio con una mascota: el contenido se ve completo; con el scroll arriba del todo no hay franja ni lavado de color visible (si lo hay, anota cómo se ve).
2. Desplázate hacia abajo: cuando el contenido pasa por debajo de la barra de estado aparece el difuminado del borde superior y se ve progresivo.
3. Con contenido por debajo de la tab bar flotante, el difuminado del borde inferior aparece detrás de ella y no tapa sus pestañas ni el indicador.
4. Los toques atraviesan ambos bordes: puedes pulsar un tile o un enlace justo bajo el difuminado y el scroll no se atasca al arrastrar sobre él.
5. Sin tirones al desplazarte rápido, sin cuelgues ni cierres de la app, y con Inicio sin mascotas no se ve el efecto.
6. Repite 1 a 5 en tema claro y oscuro; apunta si el tinte desentona con el fondo en alguno.

- [X] Spike revertido (fecha: 2026-11-04): el humano decidió quitar el efecto porque le restaba mucho rendimiento a la app. Ya no hay que reconstruir el dev build ni pasar este smoke; los pasos de arriba quedan solo como registro.
