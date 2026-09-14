# Implementación: mobile-detail-screens-state-reset

Fecha: 2026-09-14
Branch: `feature/63-mobile-detail-screens-state-reset`
Spec: `specs/mobile-detail-screens-state-reset/` (aprobada por humano)

## Requisitos y commits de cierre

| Requisito | Commit de cierre | Ciclo TDD |
|---|---|---|
| R1 | `00e82481 feat(detail-state-reset): reset reminder state on blur (R1)` | rojo `a710b05b` → verde `00e82481` |
| R2 | `86b01d75 feat(detail-state-reset): reset pet form state on blur (R2)` | rojo `eb931f7e` → verde `86b01d75` |
| R3 | `5343f374 feat(detail-state-reset): reset weight form state on blur (R3)` | rojo `d922f8ba` → verde `5343f374` |
| R4 | `947a9d07 feat(detail-state-reset): clear meal error on blur (R4)` | rojo `9537666b` → verde `947a9d07` |
| R5 | `7b809932 feat(detail-state-reset): reset pairing state on blur (R5)` | rojo `e46cfd2e` → verde `7b809932` |
| R6 | `6fd8de2e feat(detail-state-reset): reset pairing state on pet change (R6)` | rojo `4c8ec120` → verde `6fd8de2e` |
| R7 | `5cdf2024 test(detail-state-reset): preserve request guards on blur (R7)` | requisito de verificación, vía (b) de C4 |

## Mutaciones de R7

### `AddReminderContent`: `setSubmitting(false)` en el reset

Comando:

```text
npx jest src/screens/add-reminder/index.test.tsx --runInBand --silent -t "R7: el guarda de envío sobrevive al blur"
```

Salida relevante:

```text
FAIL src/screens/add-reminder/index.test.tsx
● R7: el guarda de envío sobrevive al blur › mantiene deshabilitado el envío pendiente tras el blur
  expect(instance).toBeDisabled()
  Received instance is not disabled: accessibilityState { "disabled": false }
Test Suites: 1 failed, 1 total
Tests:       1 failed, 22 skipped, 23 total
```

Reversión:

```text
R7 add-reminder revert: git diff empty; worktree clean
```

### `PairingScreen`: `setClaiming(false)` en `resetPairingState`

Comando:

```text
npx jest src/screens/pairing/index.test.tsx --runInBand --silent -t "R7: el guarda de envío sobrevive al blur"
```

Salida relevante:

```text
FAIL src/screens/pairing/index.test.tsx
● R7: el guarda de envío sobrevive al blur › mantiene deshabilitado el claim pendiente tras el blur
  expect(instance).toBeDisabled()
  Received instance is not disabled: accessibilityState { "disabled": false }
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 skipped, 54 total
```

Reversión:

```text
R7 pairing revert: git diff empty; worktree clean
```

## Verificación final

- Comando Jest dirigido: pendiente.
- `npx tsc --noEmit`: pendiente.
- `npx expo lint`: pendiente.
- `./init.sh`: no ejecutado por instrucción expresa; el gate completo lo coordina el reviewer.
- Smoke test en Android dev build: reservado al humano.

## Decisiones no cerradas literalmente por la spec

- En el test R7 de pairing se vuelve a escribir un código válido después del
  blur antes de comprobar el botón. R5 limpia `code`, y sin este paso el botón
  seguiría deshabilitado por código vacío aunque la mutación borrara
  `claiming`; así la prueba distingue de verdad el guarda de petición en vuelo.
- No hubo otras decisiones fuera de lo firmado en D1-D5.
