# spec_189-E4 — Enmienda E4 de #189 (spec_author)

Base de medida: `18f86849`. Casilla E4 **sin firmar** al final de «Aprobación» de `requirements.md`.
No se tocó código de la app, `feature_list.json` ni nada fuera de `specs/mobile-geofences-canvas-fidelity/` y `progress/`.

## Qué se escribió

- `requirements.md`: §4.4 nueva (decisiones del humano, tabla «Decisión humana pendiente», origen, premisas
  verificadas, medidas M10-M19, R19-R24, tabla «Texto que E4 sustituye», candados agregados antes → después,
  sondas P-E4-1..13, lista cerrada de ficheros, orden rojo → verde). Corregida la frase falsa de R7.2.
  Nota de enmienda al inicio de §3. §5 y §6 ampliados (pasos 6-10 de smoke).
- `design.md`, `tasks.md`, `traceability.md`: bloques E4, filas R19-R24 y E4 «pendiente».

## Decisiones humanas pendientes (con defecto propuesto)

1. **DE4-1** Alcance de H1 en el Editor: se incluyen Switch Activa, Eliminar y Guardar, también Guardar con
   nombre vacío (inferencia más allá de lo que decidió el humano).
2. **DE4-2** Tolerancia N = 8 dp sobre `ZONES_TITLE_OFFSET` (42) y `EDITOR_PILL_LEFT` (70); fuera, enmienda E5.
3. **DE4-3** iOS no se verifica en E4.
4. **DE4-4** El contenido de Zonas pasa bajo la flecha al desplazar: se acepta.
5. **DE4-5** El mismo atenuado en el resto de la app queda fuera (candidato a otra feature).

## Hallazgos que el leader debe saber

- **R7.2 era falso**: `busy` sí atenuaba (heroui `disabled:element-disabled`). Corregido en R7.2 y R20.2.
- **M9 caducó**: a `18f86849` mide 0 (E1 ya aplicó `title: ''`), no «2 líneas». Reflejado como M18.
- **Hay dos pantallas de cabecera distinta en el Editor**: formulario transparente, ramas de estado opacas.
  Cada rama declara su `Stack.Screen` porque expo-router no restaura opciones al desmontar; opciones con
  identidad estable (constante / `useMemo`), probado con `Object.is`.
- `headerStyle.backgroundColor` gana a `headerTransparent`: las opciones transparentes llevan las dos.
- El candado de teclado 291 pasa a **200** (`700 - (500 - 0)`); `HeaderHeightContext` sale del Editor
  (ancla negativa M12, probada con P-E4-9). Se enmienda el texto de R9 «se conserva idéntico».
- El `Switch` de heroui puede no exponer el estilo de su raíz en jest: R19 deja el candado de fuente como
  respaldo y no es motivo de PARA.
- jest no ve el 0.5 ni la posición real de la flecha nativa: lo cubre el smoke del humano (§6, pasos 6-10).
- Riesgo abierto: destello de cabecera opaca → transparente al abrir el Editor (efecto de `Stack.Screen`).
  Fallback documentado en `design.md`; se comprueba en el paso 9 del smoke.
- Cartas: líneas «título en contenido y cabecera nativa con `title: ''`» y botón atrás nativo siguen ciertas
  (no se tocan). Cambian: métrica de Zonas (`paddingTop: 24` → `insets.top + 6`, en dos apariciones),
  excepción de cabecera opaca (Zonas sale) y frase nueva de `KEEP_OPACITY`; sin casilla nueva en la carta.
- Candados agregados: `consistency-classnames`, `design-drift`, `heroui-text-size-merge` con delta esperado 0
  (no están en la lista de edición; si se ponen rojos, PARA). Se mueven `#177 R3.1/R4.1/R7.5/R8.1`
  (formas de `style`, recuentos igual), `layout.test`, los tests de pantalla y `#189 R16.1`.
- Los candados de `geofences-canvas-fidelity` R16.3 y R18 no se ven afectados (verificado por contenido).

## Para el handoff a Codex

Cita `leader.md` §Esperas; commits test-primero por R en el orden R23, R19, R20, R21, R22, R24; H0-E4 mide
M10-M19 antes de tocar. El mock de `expo-router` del test del Editor hay que verificarlo contra el fichero
(hoy sin `Stack`). Codex no escribe `[X]` en ninguna casilla.
