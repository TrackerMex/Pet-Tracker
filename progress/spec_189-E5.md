# spec_189-E5 — Enmienda E5 de #189 (spec_author)

Base de medida: `eace0652`. Casilla E5 **sin firmar** (última línea de «Aprobación» de `requirements.md`).
No se tocó código, tests ni `feature_list.json`. Solo `specs/mobile-geofences-canvas-fidelity/{requirements,design,tasks,traceability}.md`.
(Medición: se corrió `bunx jest src/screens/geofence-editor/index.test.tsx -t "Guardar vacío permanece gris"`, solo lectura.)

## Qué cambió, por línea

### requirements.md
- Nota «Enmendado por E5» bajo la de E4 al inicio de §3.
- R19 Test (E): el «Guardar vacío» sin `busy` pasa a la igualdad exacta de §4.5 (antes `opacity === 1` parcial; el `it` de Codex ya usaba `toEqual`).
- R20.1: el flatten es `{ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 }` (las dos primeras claves las pone heroui); `opacity === 1`, sin `boxShadow`.
- R20 Test (F), `count === 5`: `toEqual({ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 })`; `toHaveStyle` de `count < 5` y `busy` sin cambio.
- P-E4-4: sigue poniendo en rojo R20.1, ahora porque aparece la clave `boxShadow` en el flatten.
- **§4.5 nueva** (antes de §5): origen, tabla de las 3 igualdades defectuosas, lista de las aserciones sin defecto, tabla «Texto que E5 sustituye», lección, orden rojo→verde, lista cerrada de ficheros.
- «Aprobación»: `- [ ] Enmienda E5 (§4.5) aprobada por humano (fecha: ____) ← …`.

### design.md
- Sección «Enmienda E5»: causa, solución (solo la aserción), alternativas descartadas, lección.

### tasks.md
- R19 y R20 (paso 1): texto actualizado con la igualdad corregida.
- Bloques nuevos: «Enmienda E5», «R20 rojo-corrección (E5)», «R19 rojo-corrección (E5)», «Cierre E5» (replantar P-E4-4 tras el verde).

### traceability.md
- Fila R20 menciona E5; fila nueva «E5 §4.5 | pendiente» en la tabla de enmiendas.

## Medición pedida (grep + ejecución, no de memoria)

Igualdades exactas `toEqual({ opacity: 1 })` sobre un `Button` de heroui: **tres**, no dos.
1. `src/screens/geofences/index.test.tsx:874` (`it.each` R7, `count === 5`), `geofences-add`.
2. `src/screens/geofences/index.test.tsx:920` (`it` «#189 R20.1»), `geofences-add`.
3. **`src/screens/geofence-editor/index.test.tsx:888`** («Guardar vacío permanece gris… sin busy»), `geofence-editor-save`. **Mismo defecto**: la ejecución real recibe `{ borderCurve: 'continuous', opacity: 1, transform: [{ scale: 1 }] }`. Está en E5 (R19, no solo R20).

Sin defecto (parciales):
- **Switch** (`geofence-<id>-active` en Zonas, l. 908; `geofence-editor-active` en el Editor, l. 878): `StyleSheet.flatten(...)?.opacity` `toBe(1)`.
- **Eliminar** y **Guardar bajo `busy`** (Editor, l. 878): el mismo `?.opacity` `toBe(1)`.
- Añadir `count < 5` y `busy`: `toHaveStyle` (parcial). Editor l. 805: `?.boxShadow` `toBeUndefined()` (parcial).
- `chunky-cta-canvas-fidelity.test.ts` y `geofences-canvas-fidelity.test.ts`: sin igualdad de flatten (l. 93 es un `toContain` de fuente). **No se tocan.**

## Lista cerrada para Codex (desde `mobile-pet-tracker/`)
`src/screens/geofences/index.test.tsx` (l. 874 y 920) y `src/screens/geofence-editor/index.test.tsx` (l. 888). Nada más.

## Orden
Dos commits de test antes del verde conjunto R19 R20, ambos siguen rojos por falta de `KEEP_OPACITY`: `test(mobile): #189 E5 R20 rojo-corrección …` (Zonas, 2 aserciones) y `test(mobile): #189 E5 R19 rojo-corrección …` (Editor, 1). Separados para conservar un par por R; si prefieres uno solo, di cuál.

## Avisos para ti
- **Colisión de nombre**: R23.2 / DE4-2 / design.md decían «fuera de 8 dp se necesita enmienda E5». No los edité (no cambio otros requisitos); §4.5 dice que esa referencia se lee ahora «enmienda posterior (E6)».
- La lección de E5 la dejé como regla para futuras specs: enumerar también las claves que aporta el componente de terceros al estilo aplanado antes de prescribir una igualdad exacta.
