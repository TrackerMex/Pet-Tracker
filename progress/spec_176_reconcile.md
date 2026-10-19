# Reconciliación de la spec de #176 con origin/main cbd964da (2026-10-19)

Base medida con `git show origin/main:<ruta>` (#177 y #181 mergeadas). Estado: `spec_ready`, casilla de aprobación humana sin marcar.

## Premisas que cambiaron

- **#177 cerrada (Q2, P2).** R12 hereda `h-14 rounded-16 bg-accent` + `style={chunkyLip.primary}` (`useChunkyLip()`, `src/theme/chunky-lip.ts`) + `Text` `text-17 font-extrabold text-accent-foreground`. #177 no fija ancho ni margen, así que `w-full` y `mt-2.5` no chocan por valor. Sí chocan con los candados (un solo `<Button` con su `className` literal en `empty-state.test.tsx` y el inventario de `chunky-cta-canvas-fidelity.test.ts`): van en un `View` envoltorio `home-empty-action-wrap`; el `Button` no se toca. Sin precondición sobre #177 en tasks.md.
- **`Label.Text` obsoleto (#187).** La etiqueta es `Text` de react-native, ya implementado. D5 reescrito.
- **R3.** La rama sin mascotas se decide por `pets.data?.kind === 'ok' && pets.data.pets.length === 0`, no por `selectedPetId` null. Cambiar `p-6` por `px-5 py-6` rompe la aserción de clase exacta de «#181 R3.2» en `src/screens/home/index.test.tsx`; antes la spec decía que no lo redefinía. Ahora se enmienda explícitamente.
- **Candados de otras features que el cambio toca** (listados con el cambio exacto en tasks.md §Tests enmendados): listas de imports de `empty-state.test.tsx` (#155 R11), inventarios `text-26` de `profile-canvas-fidelity`, `text-15` y `tracking-title` de `alerts-canvas-fidelity`. Candados a respetar sin tocar: `motion.test.ts` (no se añade ningún export a `motion.ts`), `chunky-cta-canvas-fidelity`, regex sin `entering=` de #155 R11.
- **R13 sin `HomeEntrance`.** Existe `homeEntering`/`HomeEntrance` en `src/screens/home/home-entrance.tsx`, pero usa `entering=` (prohibido en `empty-state.tsx`) y `components/` no importa de `screens/`. R13 replica la receta con valores compartidos: opacidad `withTiming(MOTION_FADE_TIMING)`, desplazamiento `withSpring(MOTION_SETTLE_SPRING)`.
- **Flotación.** `PingoFloat({ testID, children })` verificado (`translateY` a -10, 1500 ms, apagado con reduce motion; mock `mockUseReducedMotion`). La rama `hero` debe apagar el bucle `MOTION_FLOAT_*` propio de `EmptyState` (si no, la pose subiría 4 + 10 px). Documentado en D2.
- **Premisas verificadas y retiradas de «Supuestos»:** API de `PingoFloat`, signo de `translateY`, mock de reduce motion, nombre `selectedPetId`, rutas de tests, `MOTION_*` existentes, testIDs actuales, ruta `/pets/add`.

## Hallazgo mayor: sí hay copia legible del artboard

`specs/mobile-empty-states-pingo/design-src/inicio-vacio.dc.html` (versión de canvas `1791473009-3376`, de #155). La spec anterior decía que el artboard no era legible y había supuesto valores. Contrastada con esa copia (design.md §Contraste con la copia del artboard):

- R5 estaba incompleto: faltaban el escenario de 280×260 y el disco de 240 px `--surface2` (= `bg-surface-secondary`); las huellas son tres, no una (se dibujan con `react-native-svg`, no con el glifo `Paw`); la sombra es 120×14 a 18 px del borde (`bottom-4.5 h-3.5 w-30`) y va después de la pose.
- D9 suponía gap de 16 px; el artboard tiene 14 px. Pasa a requisito nuevo **R14** (raíz `w-full items-center gap-3.5`; el `w-full` de la raíz es necesario para que el CTA ocupe el ancho útil).
- Coinciden: pose 190, flotación 10 px / 3 s de ciclo, título 26/900/-0.02em, cuerpo 15/290, CTA 56/16/labio 4/margen 10/icono 20/gap 8.
- Traceability: fila R14 añadida.

## Abierto para el humano (no cerrado por mí)

- **Q1** alcance: variante `hero` solo en Inicio (propuesta) o extender a las siete pantallas restantes.
- **Q3** el canvas vigente no se pudo leer: confirmar que no cambió desde la copia de #155; aprobar la **Enmienda #176** de la carta (P1, texto propuesto en design.md; precondición de R6 y R7); confirmar el padding lateral de R3.
- **Q4 (nueva)** divergencias con el artboard que la spec mantiene por defecto: entrada en cuatro bloques 0/60/120/180 ms, 12 px y curvas de `homeEntering` (el artboard anima tres bloques con 100/160/220 ms, 14 px, 400 ms y deja el escenario fijo); `Plus` de reicon (trazo de librería, no 2.8); mascota `pingo-talk.webp`.
- Casilla «Aprobado por humano» sin marcar.

## No verificado

- Si el doble de `react-native-svg` en jest propaga `testID` y `style` del `Svg` (R5): tasks.md prevé el plan B (envolver en `View`).
- `docs/architecture.md`: la afirmación de que es solo presentación sale de las rutas; la valida el reviewer.
- Si ESLint exige otro orden de imports que el prescrito en el test enmendado: se ajusta el orden, no las líneas.
