---
feature: "mobile-orbit-cachorro-art"
status: approved        # draft | approved
tags: [mobile, ui, mascota, orbit, assets, spec]
---

# Tareas — [[mobile-orbit-cachorro-art]] (#243)

> Requisitos en [[requirements]]; diseño en [[design]] (el script, el test y el
> literal de la enmienda están ahí).
> La rama es `feature/243-orbit-cachorro-art`, creada desde `origin/dev`.
> Commits test-primero: cada rojo es su propio commit, con solo tests, y cae por una
> aserción, nunca por `ReferenceError` ni «Cannot find module» (CHECKPOINTS C4).
> En un commit rojo solo se exige jest rojo por aserción; `typecheck` y `lint` se
> exigen en verde en cada commit verde.
> Los comandos de jest se ejecutan desde `mobile-pet-tracker/` con `bunx jest <ruta>`.
> La ruta posicional es una regex y ninguna de estas rutas lleva paréntesis.
> El script de conversión se ejecuta desde la raíz del repo.
> `./init.sh` lo corre el leader, no tú (comparte LocalStack y Postgres).

## Antes de C1

- [ ] Confirma `pwd`, `git branch --show-current` y `git log --oneline -2`
  (el handoff da el H0).
- [ ] Confirma que `specs/mobile-orbit-cachorro-art/design-src/` tiene los once PNG:
  `sha256sum specs/mobile-orbit-cachorro-art/design-src/*.png` contra
  [[requirements]] §Constantes (columna «fuente»). Si algo difiere, PARA.
- [ ] Confirma que `uvx --with pillow==13.0.0 python -I -c "import PIL; print(PIL.__version__)"`
  imprime `13.0.0`. Si `uvx` no existe, PARA y repórtalo (no instales nada).

## R1, R2 y R3: arte y candados (C1, C2)

- [ ] **(1) C1 test rojo.** Crear `src/__tests__/orbit-cachorro-art.test.ts` con los
  cinco `it` de [[design]] §3 (R1, R2 ×2, R3 ×2); el de R6 **no** entra todavía.
  - Con las constantes literales `NEW_SHA`, `OLD_SHA` y `SOURCE_SHA` copiadas de
    [[requirements]] §Constantes.
  - En el `it` del script, afirma `existsSync(...)` a `true` **antes** de leerlo, para
    que el rojo sea de aserción y no un `ENOENT`.
  - Rojo esperado en `bunx jest src/__tests__/orbit-cachorro-art.test.ts`:
    - R2: las diez filas (el sha256 es el del arte viejo) y «ningún fichero conserva
      el arte viejo»;
    - R3 «script»: `existsSync` es `false`.
  - **Nacen verdes y es esperado:** R1 (el formato ya era válido) y R3 «fuentes»
    (el leader ya las puso). Su mutación está en [[design]] §5: M4 para R1, M6 para
    R3.
  - Commit: `test(mobile): R1 R2 R3 red, puppy art locked by content (#243)`.
- [ ] **(2) C2 implementación mínima.** Dos cambios en el mismo commit:
  - guardar [[design]] §2 como `specs/mobile-orbit-cachorro-art/convert-orbit.py`;
  - ejecutar el script como manda [[design]] §2 (primero a un temporal, comparar los
    diez hashes y las diez filas `ok`, y solo entonces sin argumento).
  - Verde esperado: `bunx jest src/__tests__/orbit-cachorro-art.test.ts` con todos los `it`
    en verde; `sha256sum mobile-pet-tracker/assets/images/orbit-*.webp` igual a la
    tabla; `git status --short` lista solo el script y los diez WebP.
  - Commit: `feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)`.
- [ ] **(3) Refactor.** Nada que refactorizar: sin tocar nada, corre las suites de
  §Verde de la cadena. Si alguna falla, PARA (requirements.md §Tests existentes).

## R4: conversión verificada

R4 no tiene `it` propio: lo prueba el script (código de salida 0 y diez filas `ok`)
y su huella es R2 (D2, D9). Ya se cubre en C2; el `reviewer` lo re-ejecuta.

## R5 y R7: sin cambios de consumo ni de superficie

- [ ] **(1)** No hay test rojo propio: son guardas (§Guardas finales).
- [ ] **(2)** No hay implementación: no se toca nada de `src/` ni de `assets/` fuera
  de las diez poses.
- [ ] **(3)** Corre las guardas tras C2 y tras C5.

## R6: enmienda de la carta (C4, C5) — solo tras la firma G4

El leader avisa en el handoff cuando la casilla G4 de [[requirements]] §Aprobación
esté marcada por el humano. Antes de eso, **no** empieces C4 ni C5 ni toques
`docs/ui-guidelines.md`.

- [ ] **(1) C4 test rojo.** Añadir a `src/__tests__/orbit-cachorro-art.test.ts` el
  `it` de R6 ([[design]] §3). Rojo esperado: la cuenta de `## Enmienda #243 — ` es 0,
  no 1.
  - Commit: `test(mobile): R6 red, charter amendment for the puppy art (#243)`.
- [ ] **(2) C5 implementación mínima.** Añadir al final de `docs/ui-guidelines.md`,
  tras una línea en blanco, **el literal de [[design]] §4** con la fecha del
  commit en `Fecha:` y la casilla desmarcada (`- [ ]`: la marca es del humano).
  - Verde esperado: el test nuevo entero, `orbit-charter-voice.test.ts` y
    `home-photo-hero-canvas.test.ts`.
  - Commit: `docs(ui): R6 charter amendment, Orbit is a puppy (#243)`.
- [ ] **(3) Refactor.** Nada.

## Verde de la cadena (tras C2 y tras C5)

Desde `mobile-pet-tracker/`, cada comando con su salida esperada:

```
bunx jest src/__tests__/orbit-cachorro-art.test.ts          # todos verdes
bunx jest src/__tests__/orbit-activity-pose.test.ts src/__tests__/orbit-rename.test.ts src/__tests__/orbit-rename-copy.test.ts src/__tests__/orbit-charter-voice.test.ts src/__tests__/design-drift.test.ts   # verdes
bunx jest src/screens/welcome/index.test.tsx src/components/__tests__/empty-state.test.tsx src/components/__tests__/celebration.test.tsx src/components/__tests__/empty-state-hero.test.tsx   # verdes
bunx jest app.assets.test.ts app.config.test.ts            # verdes
bun run typecheck > /tmp/typecheck.log 2>&1; echo "exit=$?"   # exit=0
```

Tras C5 añade `bunx jest src/__tests__/home-photo-hero-canvas.test.ts` (verde). Sin
`| tail` en ningún comando de código de salida. La suite entera la corre el leader con
`./init.sh`.

## Guardas finales (R5, R7)

Con `H0` el hash que da el handoff. Cada una con su salida esperada:

```
cd /home/claude/sites/Pet-Tracker-wt-243
git diff --name-only H0..HEAD -- mobile-pet-tracker/assets | sort
```
→ exactamente las diez rutas `mobile-pet-tracker/assets/images/orbit-<pose>.webp` y
nada más (R7).

```
git diff --name-only H0..HEAD -- mobile-pet-tracker/src
```
→ exactamente `mobile-pet-tracker/src/__tests__/orbit-cachorro-art.test.ts` (R5).

```
git diff --name-only H0..HEAD -- . ':!mobile-pet-tracker' ':!specs' ':!progress' ':!docs/ui-guidelines.md'
```
→ vacío. Antes de C5, `docs/ui-guidelines.md` tampoco aparece.

```
git diff --name-only H0..HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
```
→ vacío.

`H0..HEAD` incluye los commits de `progress/` y `specs/` (traceability y reporte): por
eso la tercera guarda excluye esos directorios en lugar de pedir «solo estos ficheros».

## Cierre

- [ ] `traceability.md` actualizada tras C2, y de nuevo tras C5, en un commit
  `docs(spec)` aparte (sin rebasear después: los hashes que cita caducarían).
- [ ] `progress/impl_mobile-orbit-cachorro-art.md` con: hashes obtenidos (diez
  filas), versión de `uv` y de Pillow, las salidas de §Verde de la cadena y de
  §Guardas finales, y todo lo que se haya desviado.
- [ ] No tocar las casillas de [[requirements]] §Aprobación: G1, G4 y G2 son del
  humano.
