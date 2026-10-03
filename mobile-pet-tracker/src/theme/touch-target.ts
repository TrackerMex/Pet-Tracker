/**
 * Holgura táctil compartida. `hitSlop` extiende el rectángulo que responde al
 * toque sin cambiar el layout ni el tamaño visible del control, que es lo que
 * el criterio de aceptación 6 de #61 exige y lo que descarta subir el padding.
 *
 * 6 pt por lado son 12 pt en cada eje: la caja más pequeña de las tres recetas
 * (fila de enlace `px-3 py-2` con texto de 14 px, 33 pt) llega a 45 pt. Con 4
 * se quedaría en 41 y fallaría. Cálculo por receta en
 * specs/mobile-ui-legibility-polish/design.md §D5.
 *
 * Es una constante de TypeScript y no un token de global.css porque `hitSlop`
 * no es expresable en CSS; el precedente en el repo es `TAB_INDICATOR_SPRING`
 * de `src/components/floating-tab-bar.tsx`.
 */
export const TOUCH_SLOP = { top: 6, bottom: 6, left: 6, right: 6 } as const;
