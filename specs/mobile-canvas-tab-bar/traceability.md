---
feature: "mobile-canvas-tab-bar"
status: approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-canvas-tab-bar]]

Una fila por requisito. El implementador rellena los hashes del commit rojo y
del verde; no se rebasea después de rellenarlos. BAR =
`mobile-pet-tracker/src/components/__tests__/floating-tab-bar.test.tsx`, CF =
`mobile-pet-tracker/src/__tests__/tab-bar-canvas-fidelity.test.ts`.

## Matriz

| R | Tests | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | BAR `#206 R1: la cápsula mide 64 y la fila lleva el relleno de 6 y el hueco de 4 del canvas`; CF `#206 R1: la cápsula y la fila copian alto, relleno y hueco del canvas` | — | — | pendiente |
| R2 | BAR `#206 R2: el velo del fallback es el glass .86 del canvas`; CF `#206 R2: el velo copia var(--glass) a .86 en claro y en oscuro` | — | — | pendiente |
| R3 | BAR `#206 R3: la sombra es la tabBar del canvas y no la clase shadow-lg`; CF `#206 R3: la sombra copia 0 10px 30px rgba(13,17,23,0.12)`; borrado de `#197 R20` | — | — | pendiente |
| R4 | BAR `#206 R4: cada celda mide 52 y centra icono y etiqueta con hueco de 2`; CF `#206 R4: la celda copia flex 1, alto 52, columna centrada y hueco 2` | — | — | pendiente |
| R5 | BAR `#206 R5: la píldora ocupa la celda activa de 52 con el paso de 70`; CF `#206 R5: la píldora copia alto 52, radio 999 y var(--pill)`; enmiendas 1 a 6 | — | — | pendiente |
| R6 | BAR `#206 R6: el icono de %s es el trazado del canvas` (5 filas); CF `#206 R6: los cinco iconos copian los trazados del canvas`; enmienda 7 | — | — | pendiente |
| R7 | BAR `#206 R7: en %s la pestaña activa traza 2.4 en accent-strong y las demás 2 en muted` (5 filas); CF `#206 R7: el artboard %s marca su pestaña con aria-current y trazo 2.4` (5 filas) | — | — | pendiente |
| R8 | BAR `#206 R8: la fila es una lista de pestañas llamada Pestañas` y `#206 R8: en inglés la lista de pestañas se llama Tabs`; CF `#206 R8: el nombre de la fila es el aria-label del canvas`; enmiendas 8 y 9 | — | — | pendiente |
| R9 | CF `#206 R9: la carta nombra la excepción de iconos de la barra una sola vez y con su casilla` | — | — | pendiente |
| R10 | CF `#206 R10: la barra no lleva hex, clases arbitrarias, StyleSheet ni sombras de React Native` (nace verde; mutación plantada en el informe) | n/a | — | pendiente |
| R11 | Smoke del humano en dev build Android (requirements § Cierre del humano) | n/a | n/a | pendiente |
