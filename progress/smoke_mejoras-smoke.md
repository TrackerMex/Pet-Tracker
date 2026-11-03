# Smoke G2: arreglos y mejoras del 2026-11-03

Lote único al final de `progress/plan_mejoras-smoke-2026-11-03.md`, en el dev build
de Android del PC del humano. Cada spec añade aquí sus pasos al mergear; la casilla
de cada feature la marca solo el humano.

## #224 mobile-nutrition-ai-format (pendiente del lote anterior)

- [ ] Smoke de #224 pasado tras #234 (fecha: ____)

## #231 mobile-welcome-secondary-pressed

En el dev build de Android, sin sesión, en la pantalla de Bienvenida:

- [ ] Tema claro: al mantener pulsado «Ya tengo una cuenta» la capa se tiñe de gris neutro tenue y el botón se encoge ligeramente; ya no se tiñe de verde.
- [ ] Tema oscuro: el borde de 2 px del botón se ve claramente (gris `#9CA3AF`) y al mantener pulsado tampoco aparece verde.
- [ ] «Comenzar ahora» sigue resaltando verde al pulsarlo.
## #235 mobile-profile-photo-owner-only

- [ ] En Perfil, con una mascota propia (rol dueño), el botón de la cámara sobre la foto aparece y abre el cambio de foto.
- [ ] Con una mascota compartida donde el rol no es dueño (familia, paseador o veterinario), el botón de la cámara no aparece.
- [ ] Al cambiar entre una mascota propia y una compartida en el selector, la cámara se va y vuelve según el rol de la mascota elegida.
- [ ] Fecha del smoke: ____

## #226 backend-vaccine-catalog-migration

Hallazgo: «En agregar vacuna no aparecen las opciones de vacunas solo aparece el boton "Otra vacuna"».
Solo cambia el backend: no hace falta dev build nuevo ni reinstalar la app.

1. Antes de actualizar, con el backend de tu PC tal como está, abre un perro y entra en Salud → «Agregar vacuna». Debe salir solo «Otra vacuna»: es el fallo. Si ya corriste el paliativo `seed:vaccines`, en esa base el fallo no se reproduce; anótalo y sigue.
2. Actualiza el repo a `dev`, corre `pnpm -C backend-pet-tracker run db:migrate` (debe terminar sin error) y reinicia el backend.
3. «Agregar vacuna» en el perro: salen Leptospirosis, Polivalente (DHPPi), Rabia y Tos de las perreras, y después «Otra vacuna».
4. «Agregar vacuna» en un gato: salen Leucemia felina (FeLV), Rabia y Triple felina (FVRCP), y después «Otra vacuna».
5. Registra Rabia en el perro: aparece en Salud con su próxima dosis.

- [ ] Smoke de #226 pasado (fecha: ____; paso 1, fallo reproducido: sí / no)

## #227 mobile-reminders-upcoming-past

Hallazgo: en Recordatorios los pasados y cancelados salían mezclados con los próximos.
Necesita el dev build con `dev` actualizado (cambia la app, no el backend).

1. En el dev build de Android, con una mascota que tenga un recordatorio enviado de días pasados, uno cancelado, uno programado de ayer y dos futuros (uno de hoy), abre Recordatorios. Arriba sale «PRÓXIMOS» con los futuros en orden ascendente; el de hoy lleva borde ámbar y «Hoy». Ninguna fila atenuada sale arriba.
2. Al final sale «PASADOS» con el contador `3` y el chevron abajo, sin filas.
3. Toca «PASADOS»: se abren las tres filas atenuadas, de la más reciente a la más antigua, y el chevron mira arriba. Vuelve a tocar: se cierran.
4. Elimina los recordatorios futuros: en su lugar sale la caja «Nada pendiente por ahora / Los recordatorios nuevos aparecerán aquí.», encima de «PASADOS».
5. Repite 1 a 4 en tema claro y oscuro.

- [ ] Smoke de #227 pasado (fecha: ____; tema claro: sí / no; tema oscuro: sí / no)
