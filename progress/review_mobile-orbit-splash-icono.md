# review: mobile-orbit-splash-icono (#244), tanda sin R10
Fecha: 2026-11-06
Veredicto: APROBADO (R1-R9 y R11; R10 fuera de esta tanda, espera G4)

Rama `feature/244-orbit-splash-icono`, H0 `a1e8acb1b1001d8bbfacb0a48096f8e8d09a7c89` (ancestro de HEAD `ba9ab780`). Árbol limpio.

## Alcance y límites de esta revisión
- Sin R10: no hay C4/C5. La enmienda de `docs/ui-guidelines.md` no existe y NO es un defecto (G4 humano). `docs/` no aparece en el diff.
- `./init.sh` NO lo corrí (restricción del leader: hay una corrida viva). El verde de init.sh es del leader; este veredicto no lo sustituye. Un fallo de init.sh ajeno a #244 (flake de profile #173 R5) no cambia esto.
- Jest: una sola corrida de `src/__tests__/orbit-brand-assets.test.ts app.assets.test.ts`, 2 suites, 41/41 verdes, exit 0. No corrí typecheck ni lint ni el resto de la cadena (me fío del reporte para esas, ver Observaciones).

## Verificación por punto
1. **sha256 de los ocho PNG**: los ocho del árbol coinciden con requirements.md R1 (columna «nuevo») y `orbit.png` = `android-icon-foreground.png`. Re-ejecuté `uvx --with pillow==13.0.0 python -I specs/.../convert-orbit-icons.py <tmp>`: exit 0, ocho filas `ok`, cajas/radios/alfa mín./bytes iguales a design.md §2, y `cmp` byte a byte contra el repo: los ocho idénticos. `logo-glow.png` conserva `bbd98a3f...`. Las tres fuentes de `design-src/` y el script coinciden con §Constantes (`4e01caec`, `d02da10d`, `4b211876`, `ad655780`) y no cambiaron desde H0 (el único fichero de `specs/` modificado es `traceability.md`).
2. **Historial test-primero (C4)**: `91b91fd7` (C1a) toca solo `src/__tests__/orbit-brand-assets.test.ts`; `1abb6782` (C1b) solo `app.assets.test.ts`; `3c4832a9` (C2) solo assets + `make-icons.mjs` borrado, sin tests. Los conteos de rojo del reporte son consistentes con la estructura de los tests: C1a 16 fallos = R1 8 + R2 (1+5) + R8 2; C1b 2 fallos (R5 splash 25 px, R5 foreground 98060 px). Cada R1-R3, R5-R8 tiene `it` que nombra su R-id; R4, R9 y R11 son guardas/script por diseño de la spec (sin it propio). **No tautológicos**: ningún test importa módulos de producción; todos los hashes, el círculo (1024, 676) y el `icon.json` esperado son literales del test; los hashes de R1 no se leen de lo que produce el script. R5-R7 los repliqué con Pillow aparte (script propio, no el de la feature): 0 píxeles fuera del círculo en splash, foreground y monocromo; 0 alfa < 255 en icon y favicon; 0 no-blancos en monocromo y notificación 96; cajas (4,10,92,85) en ambas notificaciones; 4552 px no blancos en la de color (≥ 1000); cara del splash opaca en (512,560); esquinas transparentes.
3. **`#225 R4`**: `grep -niE pingo` sobre `orbit-brand-assets.test.ts` y `app.assets.test.ts` = sin coincidencias (rc 1). El reporte además da `orbit-rename.test.ts` verde.
4. **Superficie**: `git diff --name-only H0..HEAD` fuera de `mobile-pet-tracker/specs/progress/docs/ui-guidelines.md` = vacío. `app.json`, `app.config.test.ts`, `package.json`, `bun.lock`, `feature_list.json`, `progress/current.md` no aparecen. `src/` solo gana el test nuevo.
5. **Guardas «tras C2»** corridas por mí con H0: R11 devuelve exactamente las trece rutas de §Constantes («Superficie»); R9 devuelve exactamente las tres rutas (`app.assets.test.ts`, `scripts/make-icons.mjs`, `orbit-brand-assets.test.ts`); fuera de alcance vacío; `git ls-files assets/expo.icon` = `Assets/orbit.png` e `icon.json`; `test ! -e scripts/make-icons.mjs` exit=0. `icon.json` idéntico al literal de design.md §4 (0.58039,0.37647,0.98824 = `#9460FC`).
6. **traceability.md**: R1-R9 y R11 con hash de commit y evidencia, ninguna fila «pendiente» salvo R10 (excepción autorizada). Los hashes citados (`91b91fd7`, `1abb6782`, `3c4832a9`) existen en la rama y se corresponden con los commits del historial. Los títulos de tests citados coinciden con los del código (los `it.each` añaden un sufijo `(%s)`, no afecta).
7. **Mutaciones M4-M8, M12, M13, M15**: plausibles. Cada una altera el insumo que el test mira (reescalado a 1100 px, píxel con alfa < 255, píxel gris, notificación sin margen, notificación blanca por la de color, un byte en fuentes/script/logo), el conteo de fallos coincide con filas esperadas (M4: foreground+mono de R5 y sus filas de R1; M12: 3 fuentes; M13: 1; M15: 1) y la restauración se verificó con `git checkout HEAD --`. No planté ninguna a mano: no hizo falta, y mi réplica independiente de R5-R7 con Pillow confirma que los candados miran lo correcto. M2/M3 no se plantaron por instrucción de fix1 (zonas ciegas cubiertas solo por el sha256 de R1; aceptado por diseño en D9).

## Checklist C2 — Estado coherente
- [x] Ninguna feature `in_progress` en `feature_list.json` en la rama (#244 está `spec_ready`; el leader lo mueve)
- [x] `progress/current.md` sin tocar por la rama (lo cierra el leader)

## Checklist C3 — Arquitectura
- [x] N/A: sin código de aplicación; solo assets, JSON de Icon Composer y tests. Sin imports de producción en los tests.

## Checklist C4 — TDD
- [x] Cada R1-R3, R5-R8 tiene al menos un test que lo nombra (R4/R9/R11: guarda o script, por la spec)
- [x] Historial test-primero: C1a y C1b solo tests y rojos por aserción, C2 solo implementación

## Checklist C5 — Trazabilidad
- [x] Sin filas «pendiente» salvo R10 (fuera de la tanda)
- [x] Commits con formato `test|feat(mobile): R-ids ... (#244)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` `status: approved`, firma del leader y G6 marcadas. G4, G3 y G2 sin marcar: esperado

## Checklist C7 — Sin código huérfano
- [x] Retirados: `pet-tracker-app-icon.png`, `...notification-monochrome-original.png`, `expo-symbol 2.svg`, `grid.png`, `scripts/make-icons.mjs`
- [x] Sus tests: el único que fijaba el robot (`la punta del pin es transparente`) fue sustituido por el de R5 (D10)
- [x] `grep` de `make-icons|pet-tracker-app-icon|notification-monochrome-original|expo-symbol 2|grid.png|jimp` en `mobile-pet-tracker/` (sin node_modules): solo aparece `jimp-compact` transitivo en `bun.lock` (esperado, la spec lo dice) y los literales del test nuevo

## Hallazgos por severidad
- **Crítico / Alto / Medio**: ninguno.
- **Bajo 1**: la cabecera de `progress/impl_mobile-orbit-splash-icono.md` (líneas 3-5) sigue diciendo «Bloqueada por la guarda de lint» y «C2 sin commit». Es historia de la parada; la sección «Reanudación» la supera. No bloquea. Si el leader quiere, una línea que lo marque como superado.
- **Bajo 2**: `traceability.md` conserva `status: draft` en su frontmatter. Viene de la plantilla de la spec; no afecta ninguna regla de la tanda.
- **Observación**: el reporte registra que Codex cargó la skill `ponytail` y consultó la doc de Expo (desviación de arranque, sin efecto en el código) y un aviso de worker force-exit en la suite de bienvenida (preexistente, ver memoria «Aviso worker force-exit»).
- **Pendiente del leader (no mío)**: `./init.sh` verde (corrida 2), con el flake de profile #173 R5 anotado como ajeno; typecheck/lint/suites de arranque solo los tomo del reporte de Codex.

## Output verificación independiente
```
sha256 de los ocho PNG: coinciden con R1; cmp contra salida del script re-ejecutado en temporal: 8/8 idénticos
convert-orbit-icons.py -> exit=0, ocho filas ok
jest src/__tests__/orbit-brand-assets.test.ts app.assets.test.ts: Suites 2 passed, Tests 41 passed, exit=0
guardas R11 (13 rutas) / R9 (3 rutas) / fuera-de-alcance (vacío) / expo.icon (2 ficheros) / make-icons ausente: todas exactas
```
