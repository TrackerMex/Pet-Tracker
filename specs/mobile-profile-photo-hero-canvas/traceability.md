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
| R1 | `T` › `#196 R1: en la rama $name monta el hero = $hero`; `#196 R1: pinta nombre y chips dentro del pie del hero` (R1.4); `src/__tests__/profile-canvas-fidelity.test.ts` › `#173 R15: grep-limpio` › `screens/profile/index.tsx no tiene escapes de estilo` (R1.5, sin `it` nuevo) | 47a0325a; 53d557f4; 8296caef | b646864e | implementado y verificado; sondas revertidas |
| R2 | `T` › `#196 R2: con hero pinta título blanco, píldora de vidrio y selector glass en el slot`; `#196 R2: con la lista pendiente el slot no monta el selector`; `#196 R2: sin hero ($name) pinta la fila clara al principio del contenido`; `#196 R2: el icono de añadir usa trazo 2.6 en las dos ramas` | 225a291e; dbe46081; 3e80e56c | 9845117e | implementado y verificado; sondas revertidas |
| R3 | `src/components/__tests__/pet-hero-header.test.tsx` › `#196 R3: con caption y mascota el pie solo pinta el caption`; `#196 R3: sin caption el pie no cambia`; `#196 R3: con caption y sin mascota el pie sigue en skeleton` | 1a82f15c | 9fac05f1 | implementado y verificado; sondas revertidas |
| R4 | `T` › `#196 R4: con el detalle cargado monta la cámara con labio sobre la foto`; `#196 R4: sin detalle cargado ($name) no monta la cámara` (nació verde); `#196 R4: con la subida fallida pinta el error justo antes de la info` | 47a0325a; 53d557f4; 8296caef | b646864e | implementado y verificado; sondas revertidas |
| R5 | `T` › `#196 R5: con el permiso bloqueado y hero el aviso ámbar abre el contenido`; `#196 R5: con el permiso bloqueado y sin hero el aviso va tras el título`; `#196 R5: el CTA del aviso lleva labio primario y abre la configuración`; `#196 R5: con el permiso concedido no pinta el aviso` (nació verde) | 225a291e; dbe46081; 3e80e56c | 9845117e | implementado y verificado; sondas revertidas |
| R6 | `T` › `#196 R6: Cerrar sesión pinta la píldora rosa de 52 con texto de 15`; `#196 R6: Cerrar sesión llama a signOut una vez` | 4910a849; f82c511a | 38bf092e | implementado y verificado; sondas revertidas |
| R7 | `T` › `#196 R7: el tema usa ToggleSwitch con pulgar`; `#196 R7: con tema $0 el interruptor pide $1` | 8bafd7fe | d97438ca | implementado y verificado; sondas revertidas |
| R8 | `T` › `#196 R8: el icono de $0 usa trazo 2.2` | 70a22d91 | 91ebce03 | implementado y verificado; sondas revertidas |
| R9 | `T` › `#196 R9: en la rama $name los índices de entrada son fijos`; `#196 R9: con el permiso bloqueado el aviso entra con índice 0` (nacen verdes, D14) | 2dcb5957 (test nacido verde) | no aplica | implementado y verificado; sondas revertidas |
| R10 | `src/__tests__/profile-photo-hero-canvas.test.ts` › `#196 R10: fila $n — $artboard lleva el literal del canvas y producción lo cumple`; `#196 R10: la tabla cubre los tres artboards` | b4141f3e (25 tests nacidos verdes) | no aplica | implementado y verificado; sondas revertidas |
| R11 | `src/__tests__/tab-headers-canvas.test.ts` › `#196 R11: PetHeroHeader solo en Inicio y Perfil` (verde en el bloque R1+R4); `#196 R11: la carta recoge la enmienda N1 de #196`; `src/__tests__/hero-header-amendments.test.ts` › `aplica además el marcador en prosa que la tabla R11.2 prescribe (enmendado por #196 R11)` (K41, en el verde) | bebe426d | a5df30ac (carta/K41); b646864e (consumidor) | implementado y verificado; sondas revertidas |

Smoke en dev build Android (R1–R7 y R9): requirements.md §Cierre del humano.

## Cierre de implementación (2026-10-24)

Las dos paradas de visibilidad se resolvieron con las erratas firmadas
E6–E10 (b05ba78a) y E11–E12 (714038d6). Los commits de test adicionales
preceden al verde de cada bloque; R1/R4 y R2/R5 comparten sus verdes.
R9 y R10 nacen verdes y no tienen commit de producción propio.

T termina con 192 tests; el test de fidelidad añade 24 filas que comprueban
canvas y producción y una comprobación de cobertura. R3 tiene tres sondas;
R1/R4 y R2/R5 tienen sondas por rama y candado; R6, R7, R8 y R9 tienen
sondas de sus comportamientos e inventarios. R10 prueba las ausencias de
los 24 literales en copias de producción y la pérdida de un artboard en
la tabla; los ficheros reales de i18n/theme/canvas no se modifican.
Detalles y logs: progress/impl_mobile-profile-photo-hero-canvas.md.

La verificación final móvil se registra en el reporte. El init.sh del
leader y el smoke Android del humano siguen siendo gates externos a esta
implementación; el checkbox de smoke no se autoaprueba. No se cambia el
status de feature_list.json ni se hace push, PR o rebase.

Verificación final del implementador: 144 suites, 143 passed / 1 failed;
4 823 passed / 1 failed de 4 824, snapshot 1/1. El único rojo fue el tinte
#0D1117 de BackButton #172 R2, un flake ajeno a #196 que corrigió después
#207; repetido una vez aislado dio 8/8. Typecheck exit 0,
lint vacío con --no-cache, graphify exit 0, 49 cuentas finales correctas y
las 14 guardas requeridas en PASS. Logs y diff sin cambios de BackButton
contra origin/dev constan en el reporte. Las sondas están revertidas.

Cierre del leader (2026-10-24): el `./init.sh` del leader sobre `4e8c3134` salió con exit 0 (móvil 148/148 suites, 5084/5084 tests, 1 snapshot) y el reviewer aprobó ahí (`progress/review_mobile-profile-photo-hero-canvas.md`, 0 bloqueantes, 8 no bloqueantes). Por su N6 se mergeó `origin/dev` con #202 y #206 (`bb36b026`, tres conflictos de candados agregados resueltos por unión, y `e26b34a7`) y se repitió el gate: exit 0, móvil 151/151 suites, 5184/5184 tests, 1 snapshot. El smoke de R1–R7 y R9 lo cierra el humano en el lote `progress/smoke_canvas-parity.md` (plan §6).
