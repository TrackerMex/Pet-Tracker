---
feature: "mobile-jest-mock-hygiene"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-jest-mock-hygiene]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. **Un commit por
> sub-item con código** (rojo y verde separados, C4 de `CHECKPOINTS.md`);
> R2 y R3 son gates de verificación sin código propio, como el R5 de #52.
> Todos los comandos se ejecutan desde `mobile-pet-tracker/` con `bun`,
> salvo `./init.sh`, que va desde la raíz del repo.

## Notas para el implementador (Codex CLI)

- Único archivo de código que se edita:
  `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`. Además:
  `progress/impl_mobile-jest-mock-hygiene.md` (tu reporte) y
  `specs/mobile-jest-mock-hygiene/traceability.md` (tras cada commit).
- **No** crees `mobile-pet-tracker/jest.config.js` ni edites el bloque
  `"jest"` de `mobile-pet-tracker/package.json` ni `test/jest-setup.js`
  ([[design]] D2, D7). **No** retires los `jest.clearAllMocks()`
  existentes ni toques la línea 217.
- Los 7 tests existentes del archivo no cambian de nombre ni de contenido.
- Carga la skill `expo-overview` antes de empezar (regla de
  `docs/ui-guidelines.md`); no hay skill específica de UI aplicable porque
  no hay UI.

## R1 — `beforeEach` de archivo para el mock del picker

- [ ] (1) **Test rojo**: añadir al final de
      `src/screens/add-pet/index.test.tsx` (después de
      `describe('R7: foto opcional tras alta')`) el
      `describe('R1 (mobile-jest-mock-hygiene): el mock del picker se reinicializa por test')`
      con un único `it` que, sin configurar nada, afirma
      `await expect(mockLaunchImageLibrary()).resolves.toEqual({ canceled: true, assets: null })`
      y `expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1)`. Correr
      `bun run test -- src/screens/add-pet/index.test.tsx` y confirmar
      `Tests: 1 failed, 7 passed, 8 total` con el asset `file:///new-pet.jpg`
      en `Received` (fuga del test de la línea 215).
      Commit: `test(mobile-jest-mock-hygiene): red picker mock leaks across tests (R1)`.
- [ ] (2) **Implementación mínima**: `beforeEach` de nivel de archivo, entre
      `renderAddPet` y `describe('R6: alta de mascota')`, con exactamente
      `mockLaunchImageLibrary.mockReset();` seguido de
      `mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });`.
      Correr la suite: `Tests: 8 passed, 8 total`.
      Commit: `fix(mobile-jest-mock-hygiene): reset picker mock before each test (R1)`.
- [ ] (3) **Refactor con tests verdes**: nada previsto. Si aparece algo
      (orden de imports, comentario), commit
      `refactor(mobile-jest-mock-hygiene): <desc> (R1)`; si no, anotar
      "sin refactor" en `progress/impl_mobile-jest-mock-hygiene.md`.

## R2 — 10 corridas seguidas de la suite `add-pet` en verde

- [ ] (1) Sin test propio: el "rojo" no existe (la suite también es verde
      hoy) — R2 es gate de regresión. Antes de tocar nada, anotar en
      `progress/impl_mobile-jest-mock-hygiene.md` §R2 la línea base de una
      corrida (`Tests: 7 passed, 7 total`).
- [ ] (2) Con R1 verde, ejecutar el bucle de [[design]] D6 (10 corridas) y
      pegar las 10 líneas `Tests: 8 passed, 8 total` en
      `progress/impl_mobile-jest-mock-hygiene.md` §R2. Si una corrida
      falla: pegar el bloque `●` completo, no continuar a R3, reportar.
- [ ] (3) Registrar en [[traceability]] la fila R2 (comando + "10/10").
      Commit (solo `progress/` y `specs/`):
      `test(mobile-jest-mock-hygiene): record 10 green runs (R2)`.

## R3 — Suite completa e `init.sh` sin cambio de config

- [ ] (1) Sin test propio: el "rojo" verificable es
      `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/test/`
      con cualquier salida. Debe estar **vacío**.
- [ ] (2) `./init.sh` desde la raíz: exit 0. Copiar las líneas
      `Test Suites:` y `Tests:` de la etapa móvil (esperado
      `53 passed` / `613 passed`, o el criterio relativo de [[requirements]]
      R3 si `origin/main` movió el conteo) en
      `progress/impl_mobile-jest-mock-hygiene.md` §R3, junto al `git diff`
      vacío.
- [ ] (3) Registrar en [[traceability]] la fila R3. Puede compartir commit
      con R2 (3):
      `test(mobile-jest-mock-hygiene): record full-suite verification (R2,R3)`.
