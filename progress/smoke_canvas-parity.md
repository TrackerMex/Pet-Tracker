# Smoke del plan de paridad con el canvas

Lote de pruebas de humo de las features del plan `progress/plan_canvas-parity-2026-10-23.md`.
Cada feature apunta aquí lo que solo se ve en el teléfono (labios fuera del cuerpo, sombras,
desenfoque, hápticos, movimiento). Lo recorre el humano en el dev build de Android, en su PC, con
tema claro y oscuro, al final de cada ola. Lo que falle abre una feature de arreglo. El `done` de
cada feature no espera al smoke (plan §6).

## #197 mobile-canvas-foundations

Spec: `specs/mobile-canvas-foundations/requirements.md` (R23 y § Cierre del humano). Reviewer
APROBADO sobre `f408dbf2` (`progress/review_mobile-canvas-foundations.md`).

Pasos de R23, en dev build Android (no Expo Go), con tema claro y oscuro:

1. NuevoRecordatorio: el chip de tipo y el de antelación seleccionados muestran un labio verde de
   3 px bajo la cápsula que no pisa la fila siguiente.
2. Alertas: el botón de reconocer de una fila abierta muestra un labio gris de 3 px; rojos y ámbar
   son los nuevos (`#D92D20`, `#B54708` en claro).
3. Horario de comidas: el resumen verde tiene labio de 5 px; «Editar» mide 36 y «Añadir comida» 50,
   cada uno con su labio gris colgando y sin solaparse.
4. Nutrición, Salud, Perfil y la celebración: el título grande se lee igual que antes (el cambio de
   `tracking-tight` a `tracking-title` es de -0.025em a -0.02em).
5. Inicio: las tarjetas entran subiendo 14 px en 400 ms escalonadas; con «Quitar animaciones» del
   sistema activo aparecen sin moverse ni fundirse.

`ToggleSwitch`, `ScreenHeader` y `useShadows()` no se ven en la app (R20): su smoke va con la ola 2.

- [ ] Smoke de #197 R23 recorrido por el humano

## #200 mobile-canvas-nutrition

Spec: `specs/mobile-canvas-nutrition/requirements.md` (§ Cierre del humano). Reviewer APROBADO sobre
`2baf7cdb` (`progress/review_mobile-canvas-nutrition.md`).

Pasos de R2, R3, R4, R6, R7, R10 y R12 a R15, en dev build Android (no Expo Go), con tema claro y oscuro:

1. Nutrición con plan: el héroe morado tiene labio inferior, el anillo se llena tras una pausa breve
   y las piezas suben en cascada (plan, comidas, IA y enlaces).
2. Una franja pendiente muestra «Marcar servido» con labio. Al pulsarla pasa a la píldora verde
   «Servido» con tile verde y check, y el anillo avanza.
3. Con avisos en el plan, las tarjetas de aviso aparecen entre las comidas y la IA.
4. Los avatares están a la derecha del título, y cambiar de mascota recarga el plan.
5. En Horario, «Generar plan» lleva labio violeta. En Horario y en Historial, la flecha de la
   cabecera vuelve a Nutrición y no hay cabecera nativa duplicada.
6. Con «Eliminar animaciones» activado en Android, todo aparece sin movimiento.

- [ ] Smoke de #200 recorrido por el humano
