# Handoff a Codex CLI — fix de #70 `mobile-home-reminders-section`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-section/requirements.md` §Decisiones de
> implementación, entrada **D6** (línea ~1106). D4, D5 y D6 se firman juntas.

Branch: `feature/70-mobile-home-reminders-section`, ya publicada en `origin`
(`82a1cbd`). Trabaja encima, no rebases ni reescribas historial.

El reviewer **rechazó** la implementación. Veredicto completo en
`progress/review_mobile-home-reminders-section.md`. Léelo entero antes de tocar
nada: incluye la reproducción par por par de las ocho mutaciones y la auditoría
de los once ejes de la fila.

Todo lo demás pasó: C2, C3, C5, C6 (salvo lo de D4), C7, C8, la suite verde,
el grep-clean, el delta del catálogo y seis de las ocho mutaciones. El rechazo
es por **un** hallazgo bloqueante.

---

## B1 (bloqueante) — el candado de zona horaria de R5 no vigila nada

`mobile-pet-tracker/src/screens/home/format.test.ts:26-70` fija la zona con
`process.env.TZ = 'America/Mexico_City'` dentro del `it`. **Bajo Jest esa
asignación no llega a V8.** Verificado dos veces, por el reviewer en un worktree
aislado y por el leader con una sonda en el runner del proyecto:

```
PROBE before= 2026-09-10T12:00:00.000Z offset= 0
PROBE after = 2026-09-10T12:00:00.000Z offset= 0
PROBE changed= false
```

Epoch y offset idénticos después de asignar. En Node pelado sí funciona, y por
eso el defecto es invisible leyéndolo.

**Consecuencia medida**: con M1 plantada (`1ab9a89`) o con M2 plantada
(`cdfb868`), `bun run test` deja la suite **6/6 verde** en la invocación por
defecto. La caja está en UTC y `init.sh` no exporta `TZ`, así que **con el
defecto de #68 reintroducido en producción el gate entero pasa en verde**.

Tu informe registra ese "6/6 verdes en UTC" como si fuera la asimetría buscada.
No lo es: la asimetría que D3 pedía es entre **zonas horarias del código bajo
prueba**, no entre **formas de invocar el runner**. Un candado que solo muerde
cuando alguien recuerda exportar `TZ` a mano no vigila nada en el gate ni en CI.

R5 y R19b pre-declaraban exactamente esta parada:

> **M1 y M2 se plantan en la zona ciega a propósito**: las dos dejan la suite
> verde bajo un runner en UTC. **Si no se ponen rojas, el `it` de R5 no está
> fijando la zona horaria y no vigila nada.**

### La premisa de #68 se leyó a medias

R5 dice que el mecanismo "está probado en este repo, #68 R4". Pero en #68 el
`process.env.TZ` **tampoco muerde**. Lo que muerde es el espía del constructor
(`weekly-activity-chart.test.tsx:553-573`):

```js
const RealDate = Date;
const dateConstructor = jest.spyOn(global, 'Date').mockImplementation(
  (value, ...dateParts) => Reflect.construct(RealDate, [value, ...dateParts]),
);
try {
  expect(weekdayLabel('2026-09-06', 'es-MX', 'short')).toBe('dom');
  expect(dateConstructor.mock.calls).toEqual([[2026, 8, 6]]);
} finally {
  dateConstructor.mockRestore();
}
```

Esa aserción —que `Date` se construye **por componentes** y **nunca** con la
cadena cruda— es independiente de la zona y está viva siempre. #70 copió el
andamiaje inerte y dejó fuera los dientes.

### Qué hacer (D5 lo autoriza)

1. Reescribe los dos `it` de R5 en `format.test.ts` con el espía del
   constructor: asserta que `calendarDaysUntil` y `fmtDate` construyen la fecha
   por componentes y **nunca** reciben `'YYYY-MM-DD'` crudo.
2. **Borra el `try/finally` sobre `process.env.TZ`.** Documenta un mecanismo que
   no existe y engaña al siguiente que lo lea.
3. **Replanta M1 y replanta M2, por separado**, y comprueba que
   `bun run test` **sin exportar `TZ`** se pone **rojo** en cada caso.
   Si hace falta `TZ=...` a mano para que muerda, el candado sigue muerto:
   **para y repórtalo**, no lo des por bueno.
4. **Borra del informe la evidencia vieja de M1 y M2 y rehazla** bajo ese
   criterio, con los hashes nuevos de los pares rojo/verde.

Alternativa admitida si el espía no cubriera algún caso: fijar `TZ` en
`globalSetup` de Jest o en el script `test` de `package.json` —antes de que
arranquen los workers—, nunca dentro del `it`. Si eliges ésta, el `try/finally`
se borra igual.

**D3 sigue en pie**: `calendarDaysUntil` normaliza el cero (`0`, nunca `-0`).
Eso ya está y no se toca.

---

## O1 (entra en alcance por D6) — dos ejes de la fila sin vigilar

De las once decisiones que toma la fila de recordatorio, nueve están vigiladas.
Dos no, y las dos dejan la suite **entera** verde al cruzarse:

**1. Tinta del icono.** Producción usa `color={vaccineInk}`
(`category-blue-strong`) en la fila (`index.tsx:541`) y `color={muted}` en el
estado vacío (`:576`). Nadie asserta `icon.props.color`. Cruzarlos pinta la
vacuna gris apagado y el estado vacío azul de vacunación, sin un test rojo.
El doble de `reicon` ya propaga las props (`index.test.tsx:96-99`).

**2. Recetas tipográficas de nombre, fecha y texto vacío.** R6 prescribe
`text-sm font-semibold text-foreground` (nombre) y `text-xs font-normal
text-muted` (fecha); R8 prescribe `flex-1 text-sm font-normal text-muted`.
Los tests obtienen esos nodos (`index.test.tsx:1915-1916`, `:2199-2200`) pero
solo assertan `children` y `style`, **nunca `className`**. Intercambiar las
recetas de nombre y fecha no mueve ningún inventario global —las mismas clases
siguen presentes, solo cambian de nodo— y deja la suite verde.

El patrón exacto ya está escrito en este mismo fichero, de #71:

```js
expect(icon.props.color).toBe(ink);                        // index.test.tsx:1669
expect(labelNode.props.className).toContain(labelColor);   // :1670
```

**Qué añadir**, todo observado con `within(fila)`:

- `icon.props.color` en la fila y en el estado vacío;
- `props.className` en nombre, fecha y texto vacío;
- `within(row).getByTestId('icon-syringe')` en R6 y en R8 — ancla el icono al
  árbol y no solo a una cuenta de cadenas en el fuente (eso cierra O2 de paso).

Cada aserción nueva se demuestra con una sonda: cruza el valor, ve el rojo,
restaura. No hace falta versionar esas sondas como mutaciones, pero **sí decir
en el informe qué viste**.

---

## O3 — ya resuelto por D4, no toques código

El feedback `pressed` del enlace `reminders-see-all` está bien implementado y
con candado. El hueco era de proceso: una autorización de palabra en
`progress/impl_*.md` no es el artefacto del gate. **D4 lo ratifica por escrito.**
No cambies nada de R10.

---

## Reglas del repo que siguen aplicando

- **TDD con historial rojo→verde visible** (`CHECKPOINTS.md` C4). Un commit por
  paso, nunca implementación y test en el mismo.
- **C4, quinto punto**: el rojo legítimo es la **mutación de producción**,
  versionada en el rojo y revertida en el verde. Ninguna mutación puede
  plantarse en un doble de test.
- Corre el gate con `env -u FORCE_COLOR ./init.sh` desde la raíz del repo
  (bug #75). Comprueba con `pgrep -f "bash ./init.sh"` que no hay otro corriendo.
- Línea base roja conocida y ajena a esta feature: `health-vaccines.e2e-spec.ts:497`
  (registrado como #76). No la cuentes contra #70.
- Carga las skills del plugin `expo` que `docs/ui-guidelines.md` indique.
- Actualiza `progress/impl_mobile-home-reminders-section.md`: sección nueva
  "Segundo pase", con la evidencia rehecha de M1 y M2 y las sondas de O1.
- `graphify update .` al terminar.
- Si algo de esto se contradice con la spec, **para y repórtalo**. Parar en la
  contradicción de R1 fue lo correcto; parar aquí también lo sería.
