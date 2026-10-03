# Handoff a Codex CLI — A12 de #85 `mobile-home-reminders-real-data`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-real-data/requirements.md` §Decisiones de
> implementación, entrada **A12**.

Branch: `feature/85-mobile-home-reminders-real-data`. Sigue desde `0bf5b05`.
No rebases ni reescribas historial.

**Paraste bien, y el análisis es tuyo.** R9 y R10 asertan propiedades que R5 y
R6 **ya dejaron puestas** —la guarda `reminders.data?.kind === 'ok'` y las
recetas exactas, `TABULAR_NUMS` incluida—, así que sus tests nacerían verdes por
construcción mientras `tasks.md` les ordenaba "escribir test que falla".

Es el **quinto punto de C4**: candado sobre código ya correcto. El rojo legítimo
es una **mutación de producción** versionada en el rojo y revertida en el verde.
R7 y R12 ya lo hacían; R9 y R10 se quedaron sin ello. Descuido de la spec.

## Qué hacer

`tasks.md` ya lleva las dos sondas anotadas en R9 y R10. En resumen:

**Sonda P9 — el fallo de una petición no puede apagar la otra.** En la ranura de
la vacuna:

```diff
-{nextVaccine && nextVaccineCountdown ? (
+{reminders.data?.kind === 'ok' && nextVaccine && nextVaccineCountdown ? (
```

**Rojo esperado**: cae `it('no pinta filas mientras carga')` —desaparece el
`reminders-section-skeleton`— y cae el `it.each` de los cinco kinds de fallo
—`body.children.length` pasa de `1` a `0`—.

**Sonda P10 — el ámbar significa urgencia, no tipo.** En la píldora del contador,
sustituir el hueco ámbar fijo por el del tipo del recordatorio.

**Rojo esperado**: cae `it('aplica la receta de cada nodo y ninguna otra')` por
el `toBe` del `className` del contador.

Las dos se **versionan en el commit rojo de su requisito y se revierten en el
verde**, con `git diff` vacío comprobado, igual que hiciste con M9 y M10.

## Qué NO cambia

- **P9 y P10 quedan fuera de las trece M1-M13.** R15 **no se renumera**: su
  tabla, sus trampas declaradas y su recuento siguen exactamente igual. La
  evidencia de las sondas va bajo R9 y R10 en el informe, no bajo R15.
- Ningún requisito pierde una aserción. R9 y R10 asertan lo mismo que asertaban.
- **Si una sonda pone rojo algún `it` de más, no es problema**: lo que se exige
  es que caiga el del requisito. **Lo que la invalida es que su requisito quede
  verde** — entonces el test está mal escrito y se para.

## Después de R10, sigue hasta el final

**No pares al cerrar R10.** Continúa por `tasks.md` hasta **R15**: R11 (copy y
M13), R12 (bloque de drift con su sonda), R13 (deltas como sumandos), R14
(suite, typecheck, grep-clean) y R15 (las trece mutaciones).

Recordatorios de lo que queda:
- **M13** en R11: muta `en['home.reminders']` y debe caer
  `it('rotula en inglés')`. Es la prueba de que el candado inglés no es
  decorativo.
- **M6** depende del orden invertido del par empatado en la fixture. **No la
  reordenes.**

## Reglas del repo, sin cambios

- TDD por requisito, un commit por paso.
- `CHECKPOINTS.md` C4 quinto punto: las sondas y mutaciones son de **código de
  producción**, nunca de un doble de test.
- Gate `env -u FORCE_COLOR ./init.sh` desde la raíz (bug #75); `pgrep` antes.
- Base roja conocida y ajena: `health-vaccines.e2e-spec.ts:497` (#76).
- Cero backend.
- Al terminar R15: informe completo, `traceability.md` al día, `graphify update .`.
- **Si encuentras otra contradicción, para y repórtala.** Van siete y las siete
  veces parar fue lo correcto.
