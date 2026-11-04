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
