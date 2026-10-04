---
feature: "mobile-keyboard-avoiding-forms"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-keyboard-avoiding-forms]]

> Disciplina TDD (CHECKPOINTS C4): por pantalla, commit de test en rojo →
> commit de producción en verde. Nunca test + producción en un solo commit.
> Rutas relativas a `mobile-pet-tracker/`; comandos desde esa carpeta. Los
> títulos de `describe`/`it` son los literales de [[requirements]].

## Antes de nada

- [ ] `test ! -e .expo/types/router.d.ts` (desde `mobile-pet-tracker/`). Si
      existe, el typecheck ve rutas fantasma; Codex **no puede borrarlo**
      (su sandbox lo deniega): avisa en el impl y sigue, el leader lo borra.
- [ ] Medir y anotar en `progress/impl_mobile-keyboard-avoiding-forms.md` el
      recuento base (tests y exit code) de las 7 suites con el comando de cada
      pantalla de abajo, y el verde de las 5 suites globales de R9.4:
      `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/layout.test.tsx`
- [ ] Grep base: `grep -c "Platform" <los 7 ficheros de producción>` = 0 cada uno.

## Orden de pantallas

1. login (confirmada rota en el teléfono)
2. weight-log (ídem)
3. register
4. reset-password
5. add-pet
6. add-reminder
7. pairing

Un bloque por pantalla, siempre los mismos tres pasos. El paso (1) incluye
los reapuntes de los `it` existentes (quedan rojos **por consulta**
`getByTestId('<x>-form')`) para que el commit (2) deje la suite entera en
verde; (3) solo si hace falta.

## R1 — login se aparta del teclado (200, sin Provider)

Comando: `bunx jest --runTestsByPath "src/app/(auth)/__tests__/login.test.tsx"`
(comprobar que imprime **1 suite**: los argumentos posicionales son regex y
`(auth)` sin `--runTestsByPath` salta el fichero con exit 0).

- [ ] (1) Test rojo — `test(mobile): lock the keyboard padding of login (#148 R1)`:
      imports `Platform`, `DeviceEventEmitter` de `'react-native'`, `act` de
      RNTL, `const originalOS = Platform.OS;`; `describe('#148 R1: login se
      aparta del teclado en Android')` → `it('el host screen-login añade
      paddingBottom 200 al abrir el teclado')`; reapuntar a `login-form` las
      lecturas de `centra el contenido dentro de un ScrollView con los insets
      aplicados` (3) y `no centra horizontalmente, que no lo hacía el View de
      hoy` (1). Rojo esperado: el nuevo por aserción `toHaveStyle({ paddingBottom: 0 })`,
      los dos reapuntados por consulta.
- [ ] (2) Producción mínima — `feat(mobile): keep the login form above the keyboard (#148 R1)`:
      en `Login`, `useContext(HeaderHeightContext)` + KAV raíz
      `testID="screen-login"` + ScrollView `testID="login-form"`. Verde: base + 1.
- [ ] (3) Sondas M-a, M-b, M-c (`keyboardVerticalOffset={91}`) plantadas y
      revertidas; resultado por sonda en el impl. Refactor solo si hace falta.

## R7 — weight-log se aparta del teclado (291, Provider) + R8

Comando: `bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx`

- [ ] (1) Test rojo — `test(mobile): lock the keyboard padding of weight-log (#148 R7, R8)`:
      imports; `HeaderHeightContext.Provider value={91}` alrededor de
      `<WeightLogScreen />` en `renderWeightLog`; `describe('#148 R7: weight-log
      se aparta del teclado en Android')` → `it('el host screen-weight-log añade
      paddingBottom 291 al abrir el teclado')` (con el `waitFor(... toBeVisible())`
      previo y la preparación de `shows loading and the metrics under the native
      header (#95 R6)`); `describe('#148 R8: weight-log entrega el primer toque
      con el teclado abierto')` → `it('el scroll weight-log-form declara
      keyboardShouldPersistTaps handled')`; reapuntar a `weight-log-form` la
      lectura de `contentContainerStyle` en `shows loading and the metrics under
      the native header (#95 R6)` y en `R5 (mobile-design-drift, enmendado por
      #95 R6): el inset superior lo consume la cabecera nativa`.
- [ ] (2) Producción — `feat(mobile): keep the weight-log form above the keyboard (#148 R7, R8)`:
      en `WeightLogContent`, KAV + `weight-log-form` +
      `keyboardShouldPersistTaps="handled"`. Verde: base + 2.
- [ ] (3) Sondas M-a, M-b, M-c (quitar `keyboardVerticalOffset`), M-d.

## R2 — register (200, sin Provider)

Comando: `bunx jest --runTestsByPath "src/app/(auth)/__tests__/register.test.tsx"` (1 suite).

- [ ] (1) Test rojo — `test(mobile): lock the keyboard padding of register (#148 R2)`:
      `describe('#148 R2: register se aparta del teclado en Android')` →
      `it('el host screen-register añade paddingBottom 200 al abrir el teclado')`;
      reapuntar `aplica el padding del contentContainerStyle con los safe-area
      insets` y `declara el ajuste automático de inset del contenedor de scroll`
      a `register-form`.
- [ ] (2) Producción — `feat(mobile): keep the register form above the keyboard (#148 R2)`.
- [ ] (3) Sondas M-a, M-b, M-c (`={91}`).

## R3 — reset-password (200, sin Provider, solo rama formulario)

Comando: `bunx jest --runTestsByPath src/screens/reset-password/index.test.tsx`

- [ ] (1) Test rojo — `test(mobile): lock the keyboard padding of reset-password (#148 R3)`:
      `describe('#148 R3: reset-password se aparta del teclado en Android')` →
      `it('el host screen-reset-password añade paddingBottom 200 al abrir el
      teclado')` con `renderRoute('token-148')`; reapuntar `la rama del
      formulario no centra en horizontal` (2 lecturas) a `reset-password-form`.
      `la rama sin token…` y `la rama de éxito…` **no se tocan**.
- [ ] (2) Producción — `feat(mobile): keep the reset-password form above the keyboard (#148 R3)`:
      KAV solo en el `return` que contiene `testID="reset-submit"`; las otras
      dos ramas conservan su `ScrollView testID="screen-reset-password"`.
- [ ] (3) Sondas M-a, M-b, M-c (`={91}`).

## R4 — add-pet (291, Provider) + R8

Comando: `bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx`

- [ ] (1) Test rojo — `test(mobile): lock the keyboard padding of add-pet (#148 R4, R8)`:
      Provider 91 en `renderAddPet`; reutilizar `setPlatform`/`originalPlatform`
      existentes; `describe('#148 R4: add-pet se aparta del teclado en Android')`
      → `it('el host screen-add-pet añade paddingBottom 291 al abrir el teclado')`
      (preparación de `usa solo el inset inferior del dispositivo`);
      `describe('#148 R8: add-pet entrega el primer toque con el teclado abierto')`
      → `it('el scroll add-pet-form declara keyboardShouldPersistTaps handled')`;
      reapuntar `usa solo el inset inferior del dispositivo` a `add-pet-form`.
      Verificar que `#90 R6: birthDate manda el día civil local del picker`
      sigue verde (el volteo está acotado).
- [ ] (2) Producción — `feat(mobile): keep the add-pet form above the keyboard (#148 R4, R8)`:
      en `AddPetScreen`, **no** en `src/app/pets/add.tsx`.
- [ ] (3) Sondas M-a, M-b, M-c (quitar offset), M-d.

## R5 — add-reminder (291, Provider) + R8

Comando: `bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx`

- [ ] (1) Test rojo — `test(mobile): lock the keyboard padding of add-reminder (#148 R5, R8)`:
      Provider 91 en `renderAddReminder`; reutilizar `setPlatform`;
      `describe('#148 R5: add-reminder se aparta del teclado en Android')` →
      `it('el host screen-add-reminder añade paddingBottom 291 al abrir el
      teclado')` (con `waitFor(... toBeVisible())` previo);
      `describe('#148 R8: add-reminder entrega el primer toque con el teclado
      abierto')` → `it('el scroll add-reminder-form declara
      keyboardShouldPersistTaps handled')`; reapuntar `uses the metrics under
      the native header (#95 R6)` a `add-reminder-form`.
- [ ] (2) Producción — `feat(mobile): keep the add-reminder form above the keyboard (#148 R5, R8)`:
      en `AddReminderContent`.
- [ ] (3) Sondas M-a, M-b, M-c, M-d.

## R6 — pairing (291, Provider) + R8

Comando: `bunx jest --runTestsByPath src/screens/pairing/index.test.tsx`

- [ ] (1) Test rojo — `test(mobile): lock the keyboard padding of pairing (#148 R6, R8)`:
      `import { Alert, DeviceEventEmitter, Platform } from 'react-native';`,
      `const originalOS = Platform.OS;`; Provider 91 dentro de
      `SelectedPetProvider` en `PairingWrapper`;
      `describe('#148 R6: pairing se aparta del teclado en Android')` →
      `it('el host screen-pairing añade paddingBottom 291 al abrir el teclado')`
      (preparación de `renders the real route with uniform metrics and a
      dimensioned skeleton (#95 R6)`); `describe('#148 R8: pairing entrega el
      primer toque con el teclado abierto')` → `it('el scroll pairing-form
      declara keyboardShouldPersistTaps handled')`; reapuntar ese `it` de
      métricas a `pairing-form`. Candado `#95 R6` de design-drift sobre
      pairing (`not.toContain('insets.top + 12')`) no se mueve: no se añaden
      insets.
- [ ] (2) Producción — `feat(mobile): keep the pairing form above the keyboard (#148 R6, R8)`:
      en `PairingScreen`.
- [ ] (3) Sondas M-a, M-b, M-c, M-d.

## R9 — alcance cerrado (sin test nuevo)

- [ ] Al terminar las siete: `git diff --name-only <HEAD del handoff>` ⊆ los
      16 ficheros de [[design]]; `grep -c Platform` = 0 en los 7 de producción;
      `grep -c "useHeaderHeight(\|?? 0\|enabled=" ` = 0 en los 7; recuento de
      `<TextInput` en `src/` = base; las 5 suites globales verdes con el
      comando de §Antes de nada. Anotar en el impl. Si algo se mueve: parar y
      reportar, no tocar los candados.

## R10 — gate humano

- [ ] Nada que implementar: el humano marca las 7 casillas de
      [[requirements]] §Prueba de humo tras el veredicto del reviewer.

## Cierre de Codex

- [ ] `docs(mobile): trace #148 R1-R9 to their tests and commits` →
      [[traceability]] con hash + mensaje por fila (R10 queda "gate humano").
- [ ] `progress/impl_mobile-keyboard-avoiding-forms.md`: recuentos antes/
      después por suite, tabla de sondas por pantalla (sonda → `it` caído →
      aserción o consulta), typecheck y lint en verde, y cualquier aviso
      (`router.d.ts`, candado global movido).
