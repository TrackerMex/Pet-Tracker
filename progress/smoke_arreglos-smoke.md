# Smoke G2: arreglos del smoke del 2026-11-04

Lote único al final de `progress/plan_arreglos-smoke-2026-11-04.md`, en el dev build
de Android del PC del humano. Cada spec añade aquí sus pasos al mergear; la casilla
de cada feature la marca solo el humano.

## #239 mobile-reminder-swipe-past-row-bleed

Hallazgo: al deslizar una fila de Pasados en Recordatorios se veía el rosa del panel
a través de la fila atenuada. Reproduce el paso 3 del smoke de #228.

1. En el dev build de Android, como dueño, abre Recordatorios con al menos un
   recordatorio en Próximos, uno puntual en Pasados y una serie en Pasados.
   Expande «Pasados».
2. Desliza a la izquierda la fila puntual de Pasados: aparece el panel rosa con
   la papelera y «Eliminar», y **a través de la fila no se ve rosa**. El rosa
   solo asoma en el hueco de las esquinas redondas de la derecha, igual que al
   deslizar una fila de Próximos.
3. Suelta la fila sin pulsar: vuelve a su sitio y en reposo se ve atenuada,
   igual que antes de esta feature.
4. Vuelve a deslizarla y pulsa el panel: el deslizable se cierra y se abre la
   hoja «¿Eliminar recordatorio?» con su título. Cancela.
5. Desliza la serie de Pasados: el panel dice «Cancelar serie», no se ve rosa a
   través de la fila y al pulsar se abre la hoja de Cancelar serie.
6. Desliza una fila de Próximos: se ve igual que antes de esta feature.
7. Como familiar (rol `family`), las filas de Pasados se ven atenuadas y no se
   deslizan.
8. Repite 2 a 6 en tema claro y en tema oscuro.

- [ ] Smoke de #239 pasado (fecha: )

## #241 mobile-health-vaccines-upcoming-past

Hallazgo: en Salud, la lista de vacunas mezclaba las próximas con las pasadas.
Ahora se parte en «Próximas» y «Pasadas» (colapsada), con la receta de
Recordatorios (#227).

Prepara una mascota con cuatro vacunas: una con próxima dosis **hoy**, una con
próxima dosis **futura**, una con próxima dosis **vencida** y una **sin** próxima
dosis.

1. En el dev build de Android, abre Salud. La tarjeta «PRÓXIMA DOSIS» muestra la
   vacuna de hoy con «hoy» y «Hoy».
2. Debajo de «Vacunas», «PRÓXIMAS» lista solo la futura.
3. «PASADAS» sale colapsada, con contador 3 y el chevron hacia abajo.
4. Pulsa «PASADAS»: se abre con la de hoy (ámbar) primero, y el resto va de la
   más reciente a la más antigua por su fecha (próxima dosis o, si no tiene,
   fecha de aplicación): la vencida en rosa y la que no tiene próxima dosis en
   verde. El chevron apunta hacia arriba.
5. Pulsa otra vez: se colapsa.
6. Repite 1 a 5 en el otro tema (claro u oscuro).

- [ ] Smoke de #241 pasado (fecha: )

## #240 mobile-reminder-date-year

Hallazgo: la fecha de la fila de Recordatorios no llevaba año, así que un
recordatorio de dentro de un año se leía como si fuera de este. Ahora lleva año
solo cuando la fecha cae fuera del año en curso.

1. En el dev build de Android, en español y con el reloj del teléfono en la
   fecha real, crea con Nuevo recordatorio, para una mascota de la que eres
   dueño:
   - uno para **dentro de un año exacto** a las 09:00 (p. ej. hoy 4 nov 2026 →
     4 nov 2027);
   - uno para **este año**, dentro de unos días;
   - uno **en serie** («cada mes») con fin («hasta») en este año, y otro con
     fin en el año siguiente.
2. Abre Recordatorios. En «PRÓXIMOS»:
   - el del año que viene dice «4 nov 2027, 09:00 · en 365 días» (con su fecha
     real), con año;
   - el de este año, sin año (p. ej. «20 nov, 09:00 · en 16 días»);
   - las series dicen «· hasta el <día> <mes>» (este año) y
     «· hasta <mes> <año>» (otro año), como antes.
3. Un recordatorio **pasado del año anterior**: si la cuenta no tiene ninguno,
   se acepta comprobarlo en el paso 5. Si lo tiene, toca «PASADOS»: su fila
   lleva año (p. ej. «3 dic 2025, 11:30 Enviado»). Los pasados de este año,
   sin año.
4. Cambia el idioma a inglés en Perfil y vuelve: el del año que viene dice
   «Nov 4, 2027, 09:00 · in 365 days»; el de este año, «Nov 20, 09:00 · in 16
   days».
5. Si no hubo pasado del año anterior en el paso 3: pon el reloj del teléfono
   en el 1 ene del año siguiente (sin hora automática), vuelve a Recordatorios
   y abre «PASADOS»: los recordatorios ya vencidos del año anterior llevan año.
   Vuelve a poner la hora automática.
6. El formato en el teléfono es el de Hermes, no el de Node. Si sale distinto
   de los literales de arriba (p. ej. «4 nov. 2027»), anótalo tal cual aquí:
   es aceptable si lleva el año solo donde toca.
7. Repite 2 y 4 en tema claro y oscuro.

- [ ] Smoke de #240 pasado (fecha: )
