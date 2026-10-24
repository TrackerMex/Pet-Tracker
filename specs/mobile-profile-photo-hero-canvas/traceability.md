---
feature: "mobile-profile-photo-hero-canvas"
status: approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-profile-photo-hero-canvas]]

`T` = `mobile-pet-tracker/src/screens/profile/index.test.tsx`. Las columnas de
commits las rellena el implementador; el reviewer las verifica. R1 y R4
comparten el par de hashes del bloque R1+R4, y R2 y R5 el del bloque R2+R5
(D14). R9 no tiene commit verde: sus `it` nacen verdes.

| R-id | Test (fichero › `it`) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | `T` › `#196 R1: en la rama $name monta el hero = $hero`; `#196 R1: pinta nombre y chips dentro del pie del hero` (R1.4); `src/__tests__/profile-canvas-fidelity.test.ts` › `#173 R15: grep-limpio` › `screens/profile/index.tsx no tiene escapes de estilo` (R1.5, sin `it` nuevo) | 47a0325a; 53d557f4; 8296caef (bloque R1+R4) | b646864e | verificado: T 166/166, 21 relacionados y sondas |
| R2 | `T` › `#196 R2: con hero pinta título blanco, píldora de vidrio y selector glass en el slot`; `#196 R2: con la lista pendiente el slot no monta el selector`; `#196 R2: sin hero ($name) pinta la fila clara al principio del contenido`; `#196 R2: el icono de añadir usa trazo 2.6 en las dos ramas` | 225a291e (bloque R2+R5) | — | bloqueado: dos chips bajo el slot, fuera de E6–E10 |
| R3 | `src/components/__tests__/pet-hero-header.test.tsx` › `#196 R3: con caption y mascota el pie solo pinta el caption`; `#196 R3: sin caption el pie no cambia`; `#196 R3: con caption y sin mascota el pie sigue en skeleton` | 1a82f15c | 9fac05f1 | verificado (95 tests / 3 suites; tres sondas) |
| R4 | `T` › `#196 R4: con el detalle cargado monta la cámara con labio sobre la foto`; `#196 R4: sin detalle cargado ($name) no monta la cámara` (se espera que nazca verde); `#196 R4: con la subida fallida pinta el error justo antes de la info` | 47a0325a; 53d557f4; 8296caef (bloque R1+R4) | b646864e | verificado: T 166/166, 21 relacionados y sondas |
| R5 | `T` › `#196 R5: con el permiso bloqueado y hero el aviso ámbar abre el contenido`; `#196 R5: con el permiso bloqueado y sin hero el aviso va tras el título`; `#196 R5: el CTA del aviso lleva labio primario y abre la configuración`; `#196 R5: con el permiso concedido no pinta el aviso` (se espera que nazca verde) | 225a291e (bloque R2+R5) | — | bloqueado: dos chips bajo el slot, fuera de E6–E10 |
| R6 | `T` › `#196 R6: Cerrar sesión pinta la píldora rosa de 52 con texto de 15`; `#196 R6: Cerrar sesión llama a signOut una vez` | — | — | no iniciado: parada previa de R2+R5 |
| R7 | `T` › `#196 R7: el tema usa ToggleSwitch con pulgar`; `#196 R7: con tema $0 el interruptor pide $1` | — | — | no iniciado: parada previa de R2+R5 |
| R8 | `T` › `#196 R8: el icono de $0 usa trazo 2.2` | — | — | no iniciado: parada previa de R2+R5 |
| R9 | `T` › `#196 R9: en la rama $name los índices de entrada son fijos`; `#196 R9: con el permiso bloqueado el aviso entra con índice 0` (nacen verdes, D14) | — | no aplica | no iniciado: parada previa de R2+R5 |
| R10 | `src/__tests__/profile-photo-hero-canvas.test.ts` › `#196 R10: fila $n — $artboard lleva el literal del canvas y producción lo cumple`; `#196 R10: la tabla cubre los tres artboards` | — | — | no iniciado: parada previa de R2+R5 |
| R11 | `src/__tests__/tab-headers-canvas.test.ts` › `#196 R11: PetHeroHeader solo en Inicio y Perfil` (verde en el bloque R1+R4); `#196 R11: la carta recoge la enmienda N1 de #196`; `src/__tests__/hero-header-amendments.test.ts` › `aplica además el marcador en prosa que la tabla R11.2 prescribe (enmendado por #196 R11)` (K41, en el verde) | bebe426d | a5df30ac (carta/K41); b646864e (consumidor) | verificado, incluida sonda de consumidor |

Smoke en dev build Android (R1–R7 y R9): requirements.md §Cierre del humano.

## Reanudación y segunda parada (2026-10-24)

La primera parada K38 queda resuelta con E6–E10 (b05ba78a). Los tests de
R1+R4 están corregidos en 53d557f4 y 8296caef; el verde es b646864e:
166/166 en T y los 21 ficheros relacionados verdes. Todas sus sondas se
vieron en rojo y se revirtieron. R11 queda también verificada.

El intento de verde de R2+R5 activa una nueva parada expresamente requerida
por el handoff: K6 falla en `pet-chip-pet-1.toBeVisible()` (E6 manda conservar
ese matcher) y el test previo sin modificar `changes the active pet through
the shared PetSwitcher` falla en la visibilidad de `pet-chip-pet-2`. Ambos
están ahora bajo el slot animado; esas aserciones no están autorizadas por
E6–E10. También falla el test nuevo de R5 al comparar el array de estilos
de HeroUI con el objeto aislado del labio. Resultado con runInBand:
3 failed, 466 passed, 469 total; seis ficheros pasan y falla T.
Log: `progress/test-196-r2r5-green.log`.

No hay commit verde de R2+R5. Su parche está conservado íntegro en
`progress/impl_mobile-profile-photo-hero-canvas.md` (contexto cero,
`git apply --unidiff-zero`). La producción tentativa se restaura a b646864e;
el commit rojo 225a291e se conserva. R6–R10 no se iniciaron. No se declara
completa la feature ni se ejecutó la verificación final.
