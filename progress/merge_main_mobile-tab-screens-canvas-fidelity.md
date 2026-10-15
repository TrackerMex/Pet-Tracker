# merge origin/main (9547115e = #171 + #172) en #173 — resolución de 6 ficheros móviles

Fecha: 2026-10-15
Rol: fallback implementer (merge mecánico). Merge `--no-commit --no-ff` SIGUE EN CURSO; no he commiteado, abortado ni hecho `git add`.
No toqué STATUS.md, docs/, specs/, feature_list.json ni ningún otro fichero fuera de los seis.

## Veredicto: ROJO (1 test) en la primera pasada; VERDE tras E8 (ver §E8 al final) — los 6 ficheros resueltos y verdes; queda 1 candado de #173 que el merge deja rojo por choque semántico con #172

- Resueltos y en verde: los 6 ficheros pedidos. Sin marcadores en `src/`, `app/`, `assets/`.
- Rojo residual (fuera de los 6 ficheros, sin conflicto textual): `src/__tests__/profile-canvas-fidelity.test.ts`, `#173 R2.4: inventario de tamaños nuevos › reserva text-13 a las iniciales de la cuenta en Perfil`. Ver §Rojo residual.

## Qué resolví por fichero (todo bajo mobile-pet-tracker/)

1. `src/theme/global.css` — `@theme`: `--text-13` ya estaba una sola vez (coincide en ambos lados, 13px). Resultado en orden: `--text-2xs`, `--text-13`, `--text-15` (#171/#172), `--text-17` (#172), `--text-26` (#173), 5 `--color-confetti-*` (#171). Cada token una vez (`grep -c -- '--text-13'` = 1).
2. `src/theme/__tests__/global-css.test.ts` — conservados los tres bloques: `#173 R2` (radios hero/tile), `#173 R2.3` (text-13/26 sin line-height) y `#171 E4` (confeti + text-15). Los dos lados terminaban en un cierre común `});});`; lo reconstruí sin perder ni duplicar llaves. #172 no añadió aserción de `text-17` en este fichero (main no la tiene).
3. `src/__tests__/consistency-classnames.test.ts` — 6 conflictos, todos candados numéricos. Regla: expresión de main + deltas de #173 (valores medidos abajo, las 6 expresiones pasan con igualdad exacta).
4. `src/__tests__/legibility-classnames.test.ts` — suma de `inkSites`: filas de #172 (`+ 1 // #172 R19`) y de #173 (`+1 R5, -1 R6, +1 R8, +1 R11`) apiladas; main primero.
5. `src/theme/__tests__/font-registration.test.ts` — ambos features añaden Inter-ExtraBold con el MISMO registro. Código: UNA sola entrada `'Inter-ExtraBold'` en `src/app/_layout.tsx:35` y UNA sola `--font-extrabold` en `global.css:13` (el TTF y el layout se fusionaron limpios, idénticos). Test: conservé los dos `describe` íntegros (`#173 R1`, 4 its estrictos, y `#172 R6`, 1 it que es subconjunto). Cero aserciones perdidas; sin registro duplicado en código.
6. `src/providers/__tests__/language-provider.test.tsx` — (a) suma de claves: `+ 3 // #172 R16` y `- 4 + 3, // #173 R13` apilados; (b) heading pin de #173 pasa de `§2.27` a `### §2.29 — Añadidos por #173 — Perfil fiel al canvas` (línea 190). #171 y #172 no pinan literal en este fichero (#172 usa regex `§2\.\d+`), así que no pisé nada; `specs/mobile-ui-language/design.md` ya tiene §2.27 #171, §2.28 #172, §2.29 #173.

## Valores finales de cada candado numérico (todos con medición: el test pasa con igualdad exacta)

| Candado | Expresión final | Valor | Origen de los deltas |
|---|---|---|---|
| `primaryRadius` (rounded-xl bg-accent, toHaveLength) | `13 + 1+1+1+1+1+1+1 - 1 - 1` | 18 | main: `+1 -1` (comentarios #171 R3 y R14, atribución exacta no verificada); #173 R5 `-1` |
| directUses (suma de usos directos, `toBe`) | `33+1+1-1-1+1+1-1+4+1 - 1 - 7` | 31 | #171 R3 `-1`; #173 R10 `-7` |
| `CONTINUOUS_CORNER` global | `31 + 1 + 4 + 1 - 1 - 7` | 29 | #171 R3 `-1`; #173 R10 `-7` |
| `rounded-xl bg-accent` global | `13 + 1*7 - 1 - 1` | 18 | igual que primaryRadius |
| `bg-accent-soft` global | `16 + 2 + 1 - 1 - 1 - 1 - 1` | 15 | #172 R14 `-1`; #171 R3 `-1`; #173 R6 `-1` |
| `accentSoftCount` | `16 + 2 + 1 - 1 - 1 - 1 - 1` | 15 | igual |
| inventario `pairing` | `1` (`// #171 R3: ready-map`) | 1 | de main; y la entrada `profile` desaparece (la quita #173 R5, main no la tocaba) |
| `\bborder-b-4\b` | `19 + 1 + 1 - 1 - 1` | 19 | main: `+1 +1 -1` (comentarios #172 R14, #171 R3, #171 R14, atribución no verificada); #173 R5 `-1` |
| `border-black/25` | `19 + 1 + 1 - 1 - 1` | 19 | igual |
| `legibility` suma de `inkSites` | `13+1+1+2+1 +1 (#172 R19) +1 -1 +1 +1 (#173)` | 21 | |
| `language-provider` claves EN | `260+16+...+7 + 3 (#172) - 4 + 3 (#173)` | 402 | |

Contraste con la resolución parcial contra solo #171 (pista): las únicas diferencias son los deltas de #172 (`-1` en bg-accent-soft/accentSoftCount, `+1` en border-b-4/border-black/25), como era de esperar. Nada aflojado.

## Verificación (cwd mobile-pet-tracker/, bun, sin pipes sobre el exit)

- `.expo/types/router.d.ts`: borrado si existía (antes de tsc/jest).
- `bunx jest` (los 6 ficheros + `src/theme/__tests__` + consistency/legibility/language-provider): exit 0 — 9 suites, 230 tests, todos verdes.
- `bunx tsc --noEmit`: exit 0, sin salida.
- `bunx expo lint > log 2>&1`: exit 0, log vacío, `grep -c 'Failed to run'` = 0.
- `bunx jest --testTimeout=30000` SUITE COMPLETA móvil: exit 1 — 110 suites (109 pass, 1 fail), 3389 tests (3388 pass, 1 fail), 1 snapshot ok. Incluye celebration, design-drift, ui-language, ui-copy-table, pantallas de #172 (login/register/forgot/reset), #173 (profile/tabs headers): todo verde salvo el rojo de abajo.
- Logs: `/tmp/claude-1002/jestfull.log`, `/tmp/claude-1002/jest1.log`, `/tmp/claude-1002/tsc.log`, `/tmp/claude-1002/lint.log`.

## Rojo residual (choque semántico #172 x #173, SIN marcadores de conflicto)

Test: `src/__tests__/profile-canvas-fidelity.test.ts:56-58`
```
it('reserva text-13 a las iniciales de la cuenta en Perfil', () => {
  expect(filesMatching(/\btext-13\b/)).toEqual(['screens/profile/index.tsx']);
```
Medido tras el merge: `text-13` aparece también en `components/form-error.tsx` (1), `screens/forgot/index.tsx` (1), `screens/login/index.tsx` (2), `screens/register/index.tsx` (7), `screens/reset-password/index.tsx` (2) — todo código de #172 (que declara también `--text-13` en main). #173 R2.4 (`specs/mobile-tab-screens-canvas-fidelity/requirements.md`, línea ~182) dice «usar las clases nuevas solo en `screens/profile/index.tsx`»: la premisa «text-13 es nuevo y solo de Perfil» caducó al mergear #172, que ya lo usa en cuenta.

No lo toqué: el fichero no es de los 6, el candado es de #173 y arreglarlo exige enmendar R2.4 en la spec (specs/ fuera de mi alcance) y no aflojar a ciegas. Propuesta para el leader (a decidir con el gate): en R2.4 limitar la reserva a `text-26` (y `rounded-hero`/`rounded-tile`) y para `text-13` pasar a inventario cerrado, es decir `toEqual(['components/form-error.tsx','screens/forgot/index.tsx','screens/login/index.tsx','screens/profile/index.tsx','screens/register/index.tsx','screens/reset-password/index.tsx'])`, de modo que Perfil conserve su candado y cualquier sexta pantalla nueva siga fallando. Con eso la suite quedaría 110/110.

## Notas

- No ejecuté `./init.sh`. Un solo jest a la vez (comprobado sin otros jest en marcha).
- El `git status` sigue mostrando los 6 como `UU` (no hice `git add`); `STATUS.md`, `docs/ui-guidelines.md` y `specs/mobile-ui-language/design.md` siguen `UU` y son del leader.

## E8 — decisión del leader aplicada (rojo residual cerrado)

Enmienda E8 escrita por el leader en `specs/mobile-tab-screens-canvas-fidelity/requirements.md` (R2.4 + tabla). Apliqué SOLO esto en `mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts`; el it de `text-26` no se tocó.

```diff
@@ -53,8 +53,15 @@ describe('#173 R2.4: inventario de tamaños nuevos', () => {
   it('reserva text-26 al nombre de la mascota en Perfil', () => {
     expect(filesMatching(/\btext-26\b/)).toEqual(['screens/profile/index.tsx']);
   });
-  it('reserva text-13 a las iniciales de la cuenta en Perfil', () => {
-    expect(filesMatching(/\btext-13\b/)).toEqual(['screens/profile/index.tsx']);
+  it('limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)', () => {
+    expect(filesMatching(/\btext-13\b/)).toEqual([
+      'components/form-error.tsx',
+      'screens/forgot/index.tsx',
+      'screens/login/index.tsx',
+      'screens/profile/index.tsx',
+      'screens/register/index.tsx',
+      'screens/reset-password/index.tsx',
+    ]);
   });
 });
 
```
(Cabecera `diff --git`/`index` omitida; el `toEqual` lista los seis ficheros en el orden exacto que devuelve `filesMatching`, que ordena con `.sort()`.)

Mediciones tras E8 (cwd mobile-pet-tracker/, sin pipes sobre el exit):
- `bunx jest src/__tests__/profile-canvas-fidelity.test.ts --testTimeout=30000`: exit 0 — 1 suite, 26 tests, todos verdes (log `/tmp/claude-1002/jest-e8.log`).
- `bunx tsc --noEmit`: exit 0, salida vacía (log `/tmp/claude-1002/tsc-e8.log`).
- `bunx expo lint > log 2>&1`: exit 0, log vacío, `grep -c 'Failed to run'` = 0 (log `/tmp/claude-1002/lint-e8.log`).

Con E8 la suite móvil completa pasa de 3388/3389 a 3389/3389 esperados (el único rojo era este it; no volví a correr la suite entera, solo el fichero tocado, como pidió el leader).
