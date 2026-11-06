---
feature: "mobile-orbit-splash-icono"
status: draft        # draft | approved
tags: [mobile, ui, mascota, orbit, assets, icono, splash, spec]
---

# Tareas — [[mobile-orbit-splash-icono]] (#244)

> Requisitos en [[requirements]]; diseño en [[design]] (el script, los tests, el
> `icon.json` y el literal de la enmienda están ahí).
> La rama es `feature/244-orbit-splash-icono`, creada desde `origin/dev`.
> Commits test-primero: cada rojo es su propio commit, con solo tests, y cae por una
> aserción, nunca por `ReferenceError`, «Cannot find module» ni `ENOENT`
> (CHECKPOINTS C4). En un commit rojo solo se exige jest rojo por aserción;
> `typecheck` y `lint` se exigen en verde en cada commit verde.
> Los comandos de jest se ejecutan desde `mobile-pet-tracker/` con `bunx jest <ruta>`.
> La ruta posicional es una regex y ninguna de estas rutas lleva paréntesis.
> El script de conversión se ejecuta desde la raíz del repo.
> `./init.sh` lo corre el leader, no tú (comparte LocalStack y Postgres).
> **Skills de Codex a usar: ninguna** (no se toca ninguna pantalla ni componente).
> **No escribas la palabra «Pingo» en ninguna línea de código de los tests nuevos**
> (requirements.md D11): `orbit-rename.test.ts` `#225 R4` lo vigila en todos los tests.

## Antes de C1

- [ ] Confirma `pwd` (`/home/claude/sites/Pet-Tracker-wt-244`),
  `git branch --show-current` (`feature/244-orbit-splash-icono`) y
  `git log --oneline -2` (el handoff da el H0).
- [ ] Confirma las fuentes y el script:
  `sha256sum specs/mobile-orbit-splash-icono/design-src/*.png specs/mobile-orbit-splash-icono/convert-orbit-icons.py`
  contra [[requirements]] §Constantes (tres fuentes y script). Si algo difiere, PARA.
- [ ] Confirma que `uvx --with pillow==13.0.0 python -I -c "import PIL; print(PIL.__version__)"`
  imprime `13.0.0`. Si `uvx` no existe o no hay red, PARA y repórtalo (no instales nada).
- [ ] Confirma que existe `mobile-pet-tracker/node_modules`. Si falta, PARA: lo prepara el
  leader (no ejecutes `bun install` ni `init.sh`).
- [ ] Ancla del estado de partida (desde la raíz del repo): este comando debe imprimir
  `397688b0222b690ba0677febfe9d7ba94f00f1cd35a434b94301e1046efa657b  mobile-pet-tracker/assets/images/icon.png`
  (el arte viejo todavía está): `sha256sum mobile-pet-tracker/assets/images/icon.png`.

## R1, R2, R3 y R8: arte y candados (C1a, C1b, C2)

- [ ] **(1) C1a test rojo: el test nuevo.** Crear
  `mobile-pet-tracker/src/__tests__/orbit-brand-assets.test.ts` con los nueve `it` de
  [[design]] §3.1 **menos el de R10** (R1 ×2, R2 ×2, R3 ×2, R8 ×2), con las constantes
  literales `NEW_SHA`, `OLD_SHA`, `LOGO_GLOW_SHA`, `SOURCE_SHA`, `SCRIPT_SHA` y `RETIRED`
  copiadas de [[requirements]] §Constantes.
  - En los `it` de R1 y R8 que leen un fichero, afirma `existsSync(...)` a `true`
    **antes** de leerlo, para que el rojo sea de aserción y no un `ENOENT`.
  - Rojo esperado en `bunx jest src/__tests__/orbit-brand-assets.test.ts`:
    - R1 «cada PNG de marca»: las ocho filas (siete por sha256 viejo; la de `orbit.png`
      por `existsSync`);
    - R2: «ningún fichero conserva el arte del robot» y las cinco filas «ya no existe»;
    - R8: los dos `it`.
  - **Nacen verdes y es esperado:** R1 «logo-glow no cambia», R3 «fuentes» y R3
    «script» (el leader ya puso las fuentes y el script). Su mutación está en
    [[design]] §6: M15, M12 y M13.
  - Commit: `test(mobile): R1 R2 R3 R8 red, Orbit brand art locked by content (#244)`.
- [ ] **(2) C1b test rojo: los tests de píxeles.** Editar solo
  `mobile-pet-tracker/app.assets.test.ts` como manda [[design]] §3.2: helper
  `readPixels`, `readAlpha` delegando en él, helper del círculo, **sustitución** del `it`
  `la punta del pin es transparente`, y los `it` nuevos de R5, R6 y R7.
  - Rojo esperado en `bunx jest app.assets.test.ts`: solo `#244 R5: toda la mascota del
    splash cabe en el círculo de radio 338` y la fila foreground de `#244 R5: la mascota de
    android-icon-foreground.png…`. Los `it` existentes y los de R6 y R7, la fila monocromo
    de R5 y los `it` de `#101` y `#115 R10` restantes quedan **verdes** (nacen verdes: el arte
    viejo ya los cumplía; dilo en el reporte).
  - Commit: `test(mobile): R5 R6 R7 red, safe circle and brand pixels (#244)`.
- [ ] **(3) C2 implementación mínima.** Un solo commit con:
  - ejecutar el script como manda [[design]] §2 (primero a un temporal, comparar los
    ocho hashes y las ocho filas `ok`, y solo entonces sin argumento);
  - `git rm` de los cuatro ficheros de `assets/` retirados y de
    `mobile-pet-tracker/scripts/make-icons.mjs` ([[requirements]] §Constantes, «cinco
    ficheros retirados»);
  - reescribir `mobile-pet-tracker/assets/expo.icon/icon.json` con el literal de
    [[design]] §4.
  - Verde esperado: `bunx jest src/__tests__/orbit-brand-assets.test.ts app.assets.test.ts`
    con todos los `it` en verde.
  - Añade las rutas **una a una** (`git add <ruta>`), nunca `git add -A` ni `git add .`;
    comprueba con `git status --short -- mobile-pet-tracker` que lista exactamente las
    trece rutas de [[requirements]] §Constantes («Superficie») más
    `mobile-pet-tracker/scripts/make-icons.mjs` borrado.
  - Commit: `feat(mobile): R1 R2 R5 R8 green, Orbit replaces the robot in the brand assets (#244)`.
- [ ] **(4) Refactor.** Nada que refactorizar: sin tocar nada, corre las suites de
  §Verde de la cadena. Si alguna falla, PARA (requirements.md §Tests existentes).

## R4: conversión verificada

R4 no tiene `it` propio: lo prueba el script (código de salida 0 y ocho filas `ok`) y su
huella es R1 (D2, D9). Ya se cubre en C2; el `reviewer` lo re-ejecuta.

## R9 y R11: sin cambios de consumo ni de superficie

- [ ] **(1)** No hay test rojo propio: son guardas (§Guardas finales).
- [ ] **(2)** No hay implementación: no se toca `app.json`, `app.config.test.ts` ni nada
  de `src/` fuera del test nuevo.
- [ ] **(3)** Corre las guardas tras C2 y, si se llega, tras C5.

## R10: enmienda de la carta (C4, C5)

**G4 es del humano y está sin firmar** ([[requirements]] §Aprobación). **No empieces C4
hasta que el leader te confirme que la casilla G4 está marcada.** C1 a C3 se pueden
mergear antes sin R10.

- [ ] **(1) C4 test rojo.** Añadir a `src/__tests__/orbit-brand-assets.test.ts` el `it`
  de R10 ([[design]] §3.1). Rojo esperado: la cuenta de `## Enmienda #244 — ` es 0, no 1.
  - Commit: `test(mobile): R10 red, charter amendment for the brand assets (#244)`.
- [ ] **(2) C5 implementación mínima.** Añadir al final de `docs/ui-guidelines.md`, tras
  una línea en blanco, **el literal de [[design]] §5** con la fecha del commit en
  `Fecha:` y la casilla desmarcada (`- [ ]`: la marca es del humano). No añadas la
  palabra «Pingo».
  - Verde esperado: `src/__tests__/orbit-brand-assets.test.ts` entero,
    `src/__tests__/orbit-cachorro-art.test.ts`, `src/__tests__/orbit-charter-voice.test.ts`,
    `src/__tests__/home-photo-hero-canvas.test.ts` y `src/__tests__/orbit-rename.test.ts`.
  - Commit: `docs(ui): R10 charter amendment, the icon and splash are Orbit (#244)`.
- [ ] **(3) Refactor.** Nada.

## Verde de la cadena (tras C2 y tras C5)

Desde `mobile-pet-tracker/`, cada comando con su salida esperada:

```
cd /home/claude/sites/Pet-Tracker-wt-244/mobile-pet-tracker
bunx jest src/__tests__/orbit-brand-assets.test.ts          # todos verdes
bunx jest app.assets.test.ts app.config.test.ts            # verdes
bunx jest src/__tests__/orbit-cachorro-art.test.ts src/__tests__/orbit-rename.test.ts src/__tests__/orbit-rename-copy.test.ts src/__tests__/orbit-activity-pose.test.ts src/__tests__/orbit-charter-voice.test.ts src/__tests__/design-drift.test.ts   # verdes
bunx jest src/app/__tests__/index.test.tsx src/screens/welcome/index.test.tsx   # verdes
bun run typecheck > /tmp/typecheck-244.log 2>&1; echo "exit=$?"   # exit=0
bun run lint > /tmp/lint-244.log 2>&1 && test ! -s /tmp/lint-244.log; echo "exit=$?"   # exit=0
```

Tras C5 añade `bunx jest src/__tests__/home-photo-hero-canvas.test.ts` (verde). Sin
`| tail` en ningún comando de código de salida. Si `bun run lint` no existe como script,
usa el que declare `package.json` (`grep -n '"lint"' package.json`). La suite entera la
corre el leader con `./init.sh`.

Si un test existente se pone rojo al sustituir los binarios, es un hallazgo: PARA y
anótalo en el reporte; no lo edites (la única edición autorizada es D10).

## Guardas finales (R9, R11, R10)

Con `H0` el hash que da el handoff. Cada una con su salida esperada:

```
cd /home/claude/sites/Pet-Tracker-wt-244
git diff --name-only H0..HEAD -- mobile-pet-tracker/assets | LC_ALL=C sort
```
→ exactamente las trece rutas de [[requirements]] §Constantes («Superficie») y nada más
(R11). En particular, ninguna `orbit-*.webp` ni `logo-glow.png`.

```
git diff --name-only H0..HEAD -- mobile-pet-tracker ':!mobile-pet-tracker/assets' | LC_ALL=C sort
```
→ exactamente tres líneas (R9):
`mobile-pet-tracker/app.assets.test.ts`, `mobile-pet-tracker/scripts/make-icons.mjs` y
`mobile-pet-tracker/src/__tests__/orbit-brand-assets.test.ts`. `app.json`,
`app.config.test.ts`, `package.json` y `bun.lock` no aparecen.

```
git diff --name-only H0..HEAD -- . ':!mobile-pet-tracker' ':!specs' ':!progress' ':!docs/ui-guidelines.md'
```
→ vacío. Antes de C5, `docs/ui-guidelines.md` tampoco aparece.

```
git ls-files -- mobile-pet-tracker/assets/expo.icon | LC_ALL=C sort
```
→ exactamente `mobile-pet-tracker/assets/expo.icon/Assets/orbit.png` y
`mobile-pet-tracker/assets/expo.icon/icon.json`.

```
test ! -e mobile-pet-tracker/scripts/make-icons.mjs; echo "exit=$?"
```
→ `exit=0`.

Tras C5:

```
grep -c '^## Enmienda #244 — ' docs/ui-guidelines.md
```
→ `1`.

```
awk '/^## Enmienda #244 — /{f=1} f' docs/ui-guidelines.md | grep -c 'Pingo'
```
→ `0` (la sección es la última del fichero; el `grep -c` imprime 0 y sale con código 1,
es normal).

`H0..HEAD` incluye los commits de `progress/` y `specs/` (trazabilidad y reporte): por eso
la tercera guarda excluye esos directorios en lugar de pedir «solo estos ficheros».

## Cierre

- [ ] `traceability.md` actualizada tras C2, y de nuevo tras C5 si se llega, en un
  commit `docs(spec)` aparte (sin rebasear después: los hashes que cita caducarían).
- [ ] `progress/impl_mobile-orbit-splash-icono.md` con: los ocho hashes obtenidos, la
  versión de `uv` y de Pillow, las salidas de §Verde de la cadena y de §Guardas finales,
  y todo lo que se haya desviado.
- [ ] No tocar las casillas de [[requirements]] §Aprobación: la firma, G6, G4, G3 y G2 son
  del leader o del humano.
