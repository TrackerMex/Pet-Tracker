# Implementación — mobile-app-and-notification-icons (#101)

Fecha: 2026-10-03. Alcance: R1–R9; R10 queda pendiente del humano.

## Identidad y precondiciones

Antes de tocar archivos:

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-icon
$ git branch --show-current
feature/101-mobile-app-and-notification-icons
```

- HEAD inicial: `bcd3000baf5819017a4b79ccd6aaf37e121eccf1`; árbol limpio.
- Skills cargadas: ninguna. No hay pantalla, ruta, animación ni build nativo.
- Leídas completas las cuatro specs aprobadas antes de editar.
- Leído `mobile-pet-tracker/AGENTS.md` y consultada la referencia SDK 57 que exige: https://docs.expo.dev/versions/v57.0.0/.
- `bun install --frozen-lockfile`: `Checked 1324 installs across 1145 packages (no changes)`, `exit=0`.
- `ls node_modules/jimp-compact/dist/jimp.js`: existe.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"`: `exit=0`.
- Corrección del recuento confirmada expresamente por el humano en esta sesión: **+15 tests y 8 describe de configuración**, además de 7 describe de assets (+1 suite). Los literales de R2–R9 enumeran ocho tests de configuración; la cifra +16/9 de la spec no se usa.
- No aplica §Esperas sobre el árbol renderizado: estos tests no renderizan componentes.

## Base medida

`bun run test; echo "exit=$?"` desde `mobile-pet-tracker/`, sin pipe:

```text
Test Suites: 90 passed, 90 total
Tests:       1913 passed, 1913 total
Snapshots:   1 passed, 1 total
Time:        44.73 s, estimated 148 s
Ran all test suites.
exit=0
```

El log base ya contiene warnings de React/Uniwind y el aviso de un worker con timers que no termina limpiamente; Jest termina con exit 0.

## Evidencia por requisito

Orden de commits: R2, R8, R3, R4, R5, R6, R7, R9. Reporte y trazabilidad se versionan juntos en el único commit docs final; no entran en los commits TDD.

Todas las corridas focalizadas usan `bun run test --runInBand --runTestsByPath app.assets.test.ts app.config.test.ts; echo "exit=$?"`, sin pipe.

### R2 — Icono

- Test primero: `a1c7feef`. Nace verde: `Test Suites: 2 passed, 2 total`; `Tests: 15 passed, 15 total`; `exit=0`.
- Mutación temporal del esperado `height: 1024` → `height: 1023`:

```text
FAIL ./app.assets.test.ts
● #101 R2: icono de la app › icon.png (expo.icon) mide 1024x1024 RGBA
-   "height": 1023,
+   "height": 1024,
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 14 passed, 15 total
exit=1
```

- Restaurado a 1024 antes de implementar: `git diff --exit-code -- mobile-pet-tracker/app.assets.test.ts mobile-pet-tracker/app.config.test.ts` sin salida, exit 0 (reporte sin versionar excluido del diff).
- `sha256sum` antes de `bun scripts/make-icons.mjs`: `7a667804bb80a6a424a5daf18a2599c4f32237cf06fe78fc0de45dbb09e0eccf`.
- Script: `exit=0`; SHA-256 después: `397688b0222b690ba0677febfe9d7ba94f00f1cd35a434b94301e1046efa657b` (bytes distintos).
- Verde: `Test Suites: 2 passed, 2 total`; `Tests: 15 passed, 15 total`; `exit=0`.

### R8 — Favicon

- Test primero: `7f26654d`. Nace verde: `Test Suites: 2 passed, 2 total`; `Tests: 17 passed, 17 total`; `exit=0`.
- Mutación temporal `height: 48` → `height: 1023`:

```text
FAIL ./app.assets.test.ts
● #101 R8: favicon › favicon.png (web.favicon) mide 48x48 RGBA
-   "height": 1023,
+   "height": 48,
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 16 passed, 17 total
exit=1
```

- Restauración a 48: `git diff --exit-code -- mobile-pet-tracker/app.assets.test.ts mobile-pet-tracker/app.config.test.ts` vacío, exit 0.
- `sha256sum` antes del script: `a4e030697a7571b3e95d31860e4da55d2f98e5e861e2b55e414f45a8556828ba`.
- `bun scripts/make-icons.mjs`: `exit=0`; SHA-256 después: `f85e1808a74971adc6cc2deffedf2845b73724ef614e3cb742dc38cbb3e266fa` (bytes distintos).
- Verde: `Test Suites: 2 passed, 2 total`; `Tests: 17 passed, 17 total`; `exit=0`.

### R3 — Foreground

```text
FAIL ./app.assets.test.ts
● #101 R3: foreground del adaptive icon › android-icon-foreground.png (adaptiveIcon.foregroundImage) mide 1024x1024 RGBA
-   "height": 1024,
-   "width": 1024,
+   "height": 512,
+   "width": 512,
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 18 passed, 19 total
exit=1
```

- Test rojo: `1681f62f`, antes de implementar.
- Script ampliado con resize a 676 y composite en (174, 174) sobre lienzo transparente de 1024; `bun scripts/make-icons.mjs`: `exit=0`.
- Verde: `Test Suites: 2 passed, 2 total`; `Tests: 19 passed, 19 total`; `exit=0`.
- Comando bbox literal de `design.md`, ejecutado sobre foreground:

```text
{
  x0: 174,
  y0: 174,
  x1: 849,
  y1: 849,
}
```

### R4 — Monochrome

```text
FAIL ./app.assets.test.ts
● #101 R4: monochrome del adaptive icon › android-icon-monochrome.png (adaptiveIcon.monochromeImage) mide 1024x1024 RGBA
-   "height": 1024,
-   "width": 1024,
+   "height": 432,
+   "width": 432,
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 20 passed, 21 total
exit=1
```

- Test rojo: `f37d0a73`, antes de implementar.
- Script: scan con umbral alfa 128 y RGB 255 a 1254, después resize a 676 y composite sobre lienzo transparente; `bun scripts/make-icons.mjs`: `exit=0`.
- Verde: `Test Suites: 2 passed, 2 total`; `Tests: 21 passed, 21 total`; `exit=0`.
- Comando bbox de `design.md` sobre monochrome (todos los valores dentro de [174, 850]):

```text
{
  x0: 206,
  y0: 251,
  x1: 818,
  y1: 773,
}
```

- Contador de blancura, píxeles con alfa > 0 y RGB distinto de (255, 255, 255): `0`, exit 0.

### R5 — Fondo plano

```text
FAIL ./app.assets.test.ts
● #101 R5: fondo plano del adaptive icon › android-icon-background.png ya no existe en assets/images
Expected: false
Received: true
FAIL ./app.config.test.ts
● #101 R5: fondo plano del adaptive icon › android.adaptiveIcon.backgroundColor es #9460FC y no declara backgroundImage
Expected: "#9460FC"
Received: "#E6F4FE"
Test Suites: 2 failed, 2 total
Tests:       2 failed, 21 passed, 23 total
exit=1
```

- Test rojo: `64ce999f`, antes de implementar. `grep -n 'backgroundColor\|backgroundImage' mobile-pet-tracker/app.json` confirma antes del verde ambas claves: `"backgroundColor": "#E6F4FE"`, `"backgroundImage": "./assets/images/android-icon-background.png"`.
- Verde: cambiado color, eliminada clave y `git rm mobile-pet-tracker/assets/images/android-icon-background.png`.
- `Test Suites: 2 passed, 2 total`; `Tests: 23 passed, 23 total`; `exit=0`.

### R6 — Splash

```text
FAIL ./app.assets.test.ts
● #101 R6: splash con el perrito sobre violeta › splash-icon.png (plugin expo-splash-screen) mide 1024x1024 RGBA
-   "height": 1024,
-   "width": 1024,
+   "height": 213,
+   "width": 228,
FAIL ./app.config.test.ts
● #101 R6: splash con el perrito sobre violeta › el plugin expo-splash-screen declara splash-icon.png sobre #9460FC con imageWidth 200
Expected value: ["expo-splash-screen", {"backgroundColor": "#9460FC", "image": "./assets/images/splash-icon.png", "imageWidth": 200}]
Received array: ["expo-router", ["expo-splash-screen", {"backgroundColor": "#208AEF", "image": "./assets/images/splash-icon.png", "imageWidth": 76}], "expo-secure-store", ["expo-notifications", {"defaultChannel": "default"}]]
Test Suites: 2 failed, 2 total
Tests:       2 failed, 23 passed, 25 total
exit=1
```

- Test rojo: `e0cdd4b8`, antes de implementar.
- `grep -n` localizó el tuple y la aserción exacta antigua. En el mismo verde se configura el tuple nuevo, se relaja solo el splash de #79 R2 a `expect.any(Object)` y se añade `fs.copyFileSync` al script.
- `bun scripts/make-icons.mjs`: `exit=0`.
- `cmp assets/images/android-icon-foreground.png assets/images/splash-icon.png`: sin salida, `exit=0`.
- Verde: `Test Suites: 2 passed, 2 total`; `Tests: 25 passed, 25 total`; `exit=0`.

### R7 — Notificación

Antes del rojo: `test ! -e assets/images/pet-tracker-notification-96.png; echo "exit=$?"` imprime `exit=0`: el fichero todavía no existe. Tampoco existe la clave `icon` en el tuple. La prueba de assets asevera que la ruta está declarada antes de abrirla; falla por aserción sobre la configuración real, sin ruta literal de respaldo ni TypeError de `join(undefined)`.

```text
FAIL ./app.assets.test.ts
● #101 R7: icono de notificación blanco tintado › pet-tracker-notification-96.png (plugin expo-notifications) mide 96x96 RGBA
expect(received).toBeDefined()
Received: undefined
FAIL ./app.config.test.ts
● #101 R7: icono de notificación blanco tintado › el plugin expo-notifications declara icon pet-tracker-notification-96.png, color #9460FC y defaultChannel default
Expected value: ["expo-notifications", {"color": "#9460FC", "defaultChannel": "default", "icon": "./assets/images/pet-tracker-notification-96.png"}]
Received array: ["expo-router", ["expo-splash-screen", {"backgroundColor": "#9460FC", "image": "./assets/images/splash-icon.png", "imageWidth": 200}], "expo-secure-store", ["expo-notifications", {"defaultChannel": "default"}]]
Test Suites: 2 failed, 2 total
Tests:       2 failed, 25 passed, 27 total
exit=1
```

- Test rojo: `7edffcb9`, antes de implementar.
- `grep -n` localizó el tuple y la aserción antigua. En el mismo verde se añaden icon/color al plugin, se relaja solo su aserción de #79 R2 a `expect.objectContaining({ defaultChannel: 'default' })` y se amplía el script con resize directo a 96 de la silueta ya umbralizada a 1254.
- `bun scripts/make-icons.mjs`: `exit=0`.
- Verde: `Test Suites: 2 passed, 2 total`; `Tests: 27 passed, 27 total`; `exit=0`.
- Contador de blancura sobre `pet-tracker-notification-96.png`: `0`, exit 0.

### R9 — iOS

- Único commit de test: `32f4c403`; nada que implementar. Nace verde: `Test Suites: 2 passed, 2 total`; `Tests: 28 passed, 28 total`; `exit=0`.
- Mutación temporal del esperado `./assets/expo.icon` → `./assets/expo.icon-mutado`:

```text
FAIL ./app.config.test.ts
● #101 R9: iOS intacto › ios.icon sigue siendo ./assets/expo.icon
Expected: "./assets/expo.icon-mutado"
Received: "./assets/expo.icon"
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 27 passed, 28 total
exit=1
```

- Restauración del literal: `git diff --exit-code -- mobile-pet-tracker/app.assets.test.ts mobile-pet-tracker/app.config.test.ts` vacío, exit 0.
- `git diff --stat d29d49d5 -- mobile-pet-tracker/assets/expo.icon` vacío, exit 0.

## Verificación final

- Idempotencia: nueva ejecución de `bun scripts/make-icons.mjs`, `exit=0`, seguida de `git diff --exit-code -- assets/images` sin salida, exit 0. Los PNG versionados quedan idénticos.
- Inmediatamente antes del typecheck: `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`; no se borró ningún fichero de Expo.
- `bunx tsc --noEmit; echo "exit=$?"`: sin errores, `exit=0`.
- Suite completa de cierre: `bun run test; echo "exit=$?"`, sin pipe:

```text
Test Suites: 91 passed, 91 total
Tests:       1928 passed, 1928 total
Snapshots:   1 passed, 1 total
Time:        44.928 s
Ran all test suites.
exit=0
```

Delta real contra la base: **+1 suite, +15 tests**, según la corrección humana; 7 tests nuevos en assets y 8 en config. La corrida completa vuelve a verde después de restaurar la mutación de R9. El aviso de worker con timers ya estaba en la base y no cambia el exit 0.

Comprobaciones contra `d29d49d5` en el último commit TDD `32f4c4032272878d75942c4bc0da6344bfedd046`:

```bash
git diff --stat d29d49d5 -- mobile-pet-tracker/assets/expo.icon mobile-pet-tracker/assets/images/pet-tracker-app-icon.png mobile-pet-tracker/assets/images/pet-tracker-notification-monochrome-original.png mobile-pet-tracker/assets/images/pet-tracker-notification-color-96.png
git diff --stat d29d49d5 -- mobile-pet-tracker/package.json bun.lock mobile-pet-tracker/bun.lock mobile-pet-tracker/src
```

Ambos comandos: **salida vacía, exit 0** (R1, R9, fuentes y dependencias intactas).

`git diff --stat d29d49d5 --name-status -- mobile-pet-tracker/assets/images`:

```text
D mobile-pet-tracker/assets/images/android-icon-background.png
M mobile-pet-tracker/assets/images/android-icon-foreground.png
M mobile-pet-tracker/assets/images/android-icon-monochrome.png
M mobile-pet-tracker/assets/images/favicon.png
M mobile-pet-tracker/assets/images/icon.png
A mobile-pet-tracker/assets/images/pet-tracker-notification-96.png
M mobile-pet-tracker/assets/images/splash-icon.png
```

Exit 0; ninguna `A` fuera de la única permitida. El name-status enumera necesariamente los derivados: la salida vacía requerida es la de adiciones no autorizadas. `git diff --check`: vacío, exit 0.

- `rg -n '[A-Za-z0-9_-]+-\[[^]]+\]' app.assets.test.ts app.config.test.ts`: sin coincidencias, `rg_exit=1` (guard C8 intacto); la suite completa también pasa `design-drift.test.ts`.
- Revisión del diff de configuración: exactamente las cuatro ediciones de diseño; las únicas aserciones existentes relajadas son las dos de #79 R2, en sus verdes R6 y R7 respectivamente. Los ocho títulos y literales de configuración y los siete de assets coinciden con trazabilidad.
- Sin bloqueo ni regresión. R1–R9 listos para reviewer; R10 pendiente del humano. No se ejecutó `init.sh`, build nativo, AWS, CDK, push, rebase, merge ni acciones sobre PR. Los artefactos de cierre del leader permanecen intactos respecto al HEAD inicial.

## Commits (orden cronológico)

| Hash completo | Mensaje |
|---|---|
| `a1c7feef75493461120a6a3ac06bdf0a30dd5ca5` | `test(mobile-app-and-notification-icons): candar icono de la app (R2)` |
| `bd2ac9668785a3fd70caaff4620ff1ddc2ca82b4` | `feat(mobile-app-and-notification-icons): derivar icono de la app (R2)` |
| `7f26654d1acfc34fd8d5e25e6f042e4b68beb8aa` | `test(mobile-app-and-notification-icons): candar favicon (R8)` |
| `6be5ea4597a7ba59f6b8b42a96b416255e8479d4` | `feat(mobile-app-and-notification-icons): derivar favicon desde la fuente (R8)` |
| `1681f62fc06887053221437002752ee59e3bf29b` | `test(mobile-app-and-notification-icons): candar foreground del adaptive icon (R3)` |
| `190eb04ce75fbe03879b83b628b3c9fab0e02e7f` | `feat(mobile-app-and-notification-icons): encajar foreground en zona segura (R3)` |
| `f37d0a73a00a81e2a9055a758f205e28d04af673` | `test(mobile-app-and-notification-icons): candar monochrome del adaptive icon (R4)` |
| `6639f8e77c824965abb45618566d410e2a56a8a7` | `feat(mobile-app-and-notification-icons): derivar silueta blanca en zona segura (R4)` |
| `64ce999f151e8cea655fff016383b10165db8c66` | `test(mobile-app-and-notification-icons): candar fondo plano sin PNG (R5)` |
| `e6d959dd9c62e95a64b31a1e1498b1258a43a1e9` | `feat(mobile-app-and-notification-icons): usar fondo violeta sin PNG (R5)` |
| `e0cdd4b8e7294d9764cdf2196039cc7e330649b9` | `test(mobile-app-and-notification-icons): candar splash violeta con el perrito (R6)` |
| `a62caa531fcc81f16ab531ab4f94c70d15531ceb` | `feat(mobile-app-and-notification-icons): configurar splash y copiar foreground (R6)` |
| `7edffcb9093e228cb4d54be5f422322992a82d2d` | `test(mobile-app-and-notification-icons): candar icono de notificación (R7)` |
| `15028e666f695c401efc6978bd0d19240b5b22e2` | `feat(mobile-app-and-notification-icons): declarar icono blanco y tinte de notificación (R7)` |
| `32f4c4032272878d75942c4bc0da6344bfedd046` | `test(mobile-app-and-notification-icons): conservar icono de iOS (R9)` |

El único commit docs final contiene esta tabla y la trazabilidad: `docs(mobile-app-and-notification-icons): trazabilidad R1-R9`. Su hash se obtiene con `git rev-parse HEAD` al leer este reporte en la entrega; no puede escribirse su propio hash dentro de su contenido. R1 referencia el último commit TDD al verificar el diff vacío; el commit docs solo añade reporte y trazabilidad.
