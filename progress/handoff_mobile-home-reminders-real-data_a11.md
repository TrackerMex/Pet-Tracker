# Handoff a Codex CLI — A11 de #85 `mobile-home-reminders-real-data`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-real-data/requirements.md` §Decisiones de
> implementación, entrada **A11**.

Branch: `feature/85-mobile-home-reminders-real-data`. Sigue desde el rojo
versionado de R5 (`10c9636`). No rebases ni reescribas historial.

**Paraste bien, y el diagnóstico es exacto.** La premisa falsa era mía: `A6` y
`tasks.md:115-118` daban por hecho que la factoría del mock conserva sola el
`[]` para los `describe` heredados. No lo hace.

## La causa

`mockResolvedValue` **sustituye la implementación de forma permanente**, y
`jest.clearAllMocks()` —lo único que corren los `beforeEach` heredados— **limpia
llamadas pero no implementaciones**. El `[]` de la factoría (`:73`) no vuelve
nunca, así que la fixture de R5 contamina todo lo que va después.

## Qué hacer

Añadir un `beforeEach` de **nivel de fichero**, justo tras
`const mockListReminders = jest.mocked(listReminders);` (`index.test.tsx:120`):

```ts
beforeEach(() => {
  mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });
});
```

Jest ejecuta los `beforeEach` de fuera adentro, así que éste corre **antes** que
el `jest.clearAllMocks()` de cada `describe`, y sobrevive a él precisamente
porque `clearAllMocks` no toca implementaciones. R5 sigue fijando su fixture
después, como ya la fija.

Luego termina el verde de R5 con la implementación mínima que ya tenías.
`tasks.md` §R5 ya lleva la adaptación anotada como primer paso.

## Por qué así y no un `afterEach` en R5

Un `afterEach` local arregla solo los `describe` que van **después** de R5, deja
el resultado dependiente del **orden de declaración**, y obliga a repetir la
limpieza en cada futuro `describe` que sobrescriba el mock. El `beforeEach` de
fichero es **independiente del orden** y no hay que acordarse de él nunca más.

## Qué NO cambia

- **Ningún `describe` heredado se toca**: ni sus `beforeEach`, ni sus
  aserciones.
- La factoría de `:73` se queda como está.
- **A6 no se modifica**: este `beforeEach` es el mecanismo que hace cierta su
  promesa.
- **Si al añadirlo cae algo más, para y repórtalo.**

## Después de R5, sigue hasta el final

**No pares al cerrar R5.** Continúa por `tasks.md` en orden hasta **R15**, que
es donde acaba la feature. Recordatorios de lo que viene:

- **M7 y M8** se plantan en el refactor de R5 (enmienda **A9**), y deben caer
  por **los cuatro** `it` que R15 les nombra.
- **M11** en R5: si queda verde, el recuento se está haciendo por `testID` y se
  arregla **antes** de seguir.
- **M10** en R7: si no pone rojo, el `it` está escrito solo con `getByTestId` y
  R7 está mal escrito. Se para.
- **M6** depende del orden invertido del par empatado en la fixture. **No la
  reordenes.**

## Reglas del repo, sin cambios

- TDD por requisito, un commit por paso.
- `CHECKPOINTS.md` C4 quinto punto: mutaciones de **código de producción**,
  nunca de un doble de test.
- Gate `env -u FORCE_COLOR ./init.sh` desde la raíz (bug #75); `pgrep` antes.
- Base roja conocida y ajena: `health-vaccines.e2e-spec.ts:497` (#76).
- Cero backend.
- Al terminar R15: informe completo con la §prueba de mutación de las trece,
  `traceability.md` al día, y `graphify update .`.
- **Si encuentras otra contradicción, para y repórtala.** Van seis y las seis
  veces parar fue lo correcto.
