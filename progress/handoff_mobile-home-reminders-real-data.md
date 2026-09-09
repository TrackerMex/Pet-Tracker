# Handoff a Codex CLI — #85 `mobile-home-reminders-real-data`

Branch: `feature/85-mobile-home-reminders-real-data`, sobre `main` con #70 ya
mergeado. Publicada en `origin`. Trabaja encima; no rebases ni reescribas
historial, no cambies de branch, no toques `main`.

Spec **aprobada por el humano**: §Aprobación firmada en `00c4ac6` y las
enmiendas A1-A6 en `58e764a`.

## Lee esto, en este orden

1. `specs/mobile-home-reminders-real-data/requirements.md` — R1-R15 más las
   enmiendas **A0-A6** a #70. **A0 es la primera que hay que leer**: dice qué
   candados de #70 se borran, cuáles se adaptan y cuáles siguen intactos.
2. `specs/mobile-home-reminders-real-data/design.md` y `tasks.md`. `tasks.md`
   está en orden ejecutable y cada paso dice su rojo esperado.
3. `progress/decisions_mobile-home-reminders-real-data.md` — las once decisiones
   ya cerradas, cuatro del humano y siete del leader. **No las reabras.**
4. `progress/explore_mobile-home-reminders-real-data.md` — la investigación, con
   rutas y líneas verificadas.
5. `CHECKPOINTS.md`, `docs/architecture.md`, `docs/conventions.md` y
   `docs/ui-guidelines.md`. **La carta de UI gana sobre cualquier skill.**

Carga las skills del plugin `expo` que `docs/ui-guidelines.md` §Skills indique.

## Qué se construye

La Home muestra hoy **una fila** con la próxima vacuna. Pasa a mostrar:

- **Primera fila fija**: la próxima vacuna del contrato del perfil, separada y
  **sin fusionar en el orden** con lo de abajo.
- **Debajo**: hasta **3** recordatorios reales, solo `scheduled` y futuros,
  ordenados por fecha ascendente, leídos de `listReminders` —que **ya existe**,
  `src/api/reminders.ts:37`— y filtrados **en cliente**.
- **Copy de vuelta** a `Recordatorios` / `Reminders` y `Ver todos` / `See all`.

**Cero backend.** El endpoint `GET /pets/:petId/reminders` ya existe
(`reminders.controller.ts:38,63`). No se añade endpoint, ni caso de uso, ni
columna, ni migración. Si te ves editando `backend-pet-tracker/`, **para**.

## Lo que ya costó una parada o un rechazo — no lo repitas

Cada punto es un fallo real de las cuatro features anteriores:

1. **El candado de longitud del catálogo**
   (`src/providers/__tests__/language-provider.test.tsx:41`) **se olvidó en #68 y
   en #69 y paró el trabajo las dos veces**. Aquí su delta es **`+ 0`** —R1
   cambia **valores**, no claves— y está declarado el primero de la tabla de R13
   precisamente por eso. Si te ves tocándolo, para y repórtalo.
2. **Todos los deltas de candado global son sumandos contra `20c7b3c`, nunca
   cifras absolutas.** Un recuento absoluto caduca; ya paró el trabajo tres
   veces.
3. **`process.env.TZ` asignado dentro de un `it` NO llega a V8 bajo Jest.**
   Costó el rechazo del primer pase de #70. Los candados de fecha se escriben
   con **espías de `Date`**, asertando construcción **por componentes** y nunca
   desde la cadena cruda.
4. **`calendarDaysUntil` NO vale para `dueAt`**: solo acepta `YYYY-MM-DD` y con
   un ISO con hora devuelve **`NaN` en silencio**. Por eso R2 pide `localDayOf`.
5. **La cardinalidad se cuenta con `children.length`**, jamás con coincidencias
   de `testID`. Un recuento por prefijo deja pasar un hijo sin `testID` — es la
   lección de #71 O7, y **M11 existe para probarlo**.
6. **El orden de los hijos importa.** `within(fila).getByTestId(...)` es
   **agnóstico al orden**: intercambiar dos textos deja la suite entera verde.
   Es la dimensión O6 que #70 dejó abierta, y **M10 existe para cerrarla**.

## Mutaciones — trece, y dos tienen trampa

`CHECKPOINTS.md` C4 quinto punto: **las trece son mutaciones de código de
producción**. Ninguna puede plantarse en el doble de `reicon`, en `makePet`, en
`makeReminder` ni en ningún otro mock. Mutar un doble demuestra que la aserción
puede fallar, no que vigile la app.

**Una mutación que muere siempre, o que muere por la razón equivocada, no
demuestra nada.** Dos lo tienen escrito en la tabla de R15 y hay que respetarlo:

- **M6** muere **solo** porque la fixture entrega el par empatado en orden
  invertido (`rem-z` antes que `rem-a`). Si alguien "ordena" la fixture, la misma
  mutación deja la suite **verde**. **El orden de esa fixture es normativo: no lo
  toques.**
- **M10** debe poner rojo el `it` de posición. **Si queda verde, R7 está mal
  escrito y se para antes de seguir**, porque significa que las aserciones son
  agnósticas al orden.
- **M1** no puede depender del `TZ` del runner: su rojo tiene que salir con
  `bun run test` **sin exportar `TZ`**. Es literalmente el fallo que costó el
  rechazo de #70.
- **M11**: si queda verde, la cardinalidad se está contando por `testID` y se
  arregla **antes** de seguir.

**M9, M10 y las de R7 se versionan** en el commit rojo y se revierten en el
verde. Las demás se plantan como verificación de cierre, con evidencia escrita:
qué se mutó, qué `it` cayó, con qué mensaje, y `git diff` vacío tras restaurar.

## Reglas del repo

- **TDD por requisito, un commit por paso**, con el test rojo antes que su
  implementación. Un único commit con todo incumple C4.
- Actualiza `specs/mobile-home-reminders-real-data/traceability.md` tras cada
  commit.
- Gate: `env -u FORCE_COLOR ./init.sh` desde la raíz del repo. El flag es
  obligatorio (bug conocido #75). Comprueba antes con
  `pgrep -f "bash ./init.sh"` que no hay otro corriendo.
- Base roja conocida y **ajena** a esta feature:
  `health-vaccines.e2e-spec.ts:497` (#76). No la cuentes en contra y no la
  arregles aquí.
- Nada de AWS real, nada de `cdk deploy`, nada que cueste dinero.
- Al terminar: `progress/impl_mobile-home-reminders-real-data.md` con el
  detalle, incluida la §prueba de mutación con las trece; y `graphify update .`.
- **Si encuentras una contradicción en la spec, PARA y repórtala.** Ha pasado
  dos veces y las dos veces parar fue lo correcto.
