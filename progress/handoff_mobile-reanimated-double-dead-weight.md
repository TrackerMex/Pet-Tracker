# Handoff a Codex CLI — #110 `mobile-reanimated-double-dead-weight`

> Escrito por el `leader` el 2026-09-22. Pégale a Codex CLI todo lo que va
> debajo de la línea.

---

Feature: **#110 `mobile-reanimated-double-dead-weight`**. Branch
`feature/110-mobile-reanimated-double-dead-weight`, ya creada y activa.

Spec **aprobada por el humano** (Gate 1):
`specs/mobile-reanimated-double-dead-weight/requirements.md` (`status: approved`).
Lee también `design.md` y **sobre todo `tasks.md`**, que trae el orden, los
comandos y las sondas. `tasks.md` es el guion; esto solo añade lo que no está
ahí.

## No cargues ninguna skill de expo

`tasks.md` §19-34 ya te lo dice y lo repito porque es contraintuitivo: **para
esta feature no hay ninguna skill que cargar**. Tu catálogo tiene 13 y ninguna
cubre fidelidad de dobles de jest.

No busques «la más cercana». En #106 el handoff pidió skills que **no existen
en tu catálogo** y cargaste otra cosa sin que nadie se enterara hasta el
veredicto; en #102 pasó lo mismo. Si no hay, no hay.

**Di en el reporte qué skills cargaste, aunque sean cero.**

## Qué es esta feature en una frase

El fichero de tests de la Home monta dobles que **no candan nada** —quitarlos
deja la suite verde— pero degradan la fidelidad: el `Skeleton` real de
`heroui-native` se sustituye por un `View` pelado en todos los tests del
fichero, borrando su clase base, su `borderCurve` y su superficie de animación.

## Reglas críticas

1. **Cero cambio en producción.** Esta feature vive en ficheros de test y en
   `docs/conventions.md`. Si crees que hay que tocar `src/screens/`,
   `src/components/` o cualquier fuente, **para y devuelve el trabajo**.
2. **TDD por requisito**, el test rojo ANTES que su implementación, un commit
   por requisito como mínimo. R3 y R4 son **requisitos de verificación por la
   vía (b) de C4** y la spec lo declara: su rojo se consigue mutando, no
   escribiendo un test que nace verde.
3. Rellena `traceability.md` tras cada commit. **No rebasees** después.
4. **Exit codes sin pipe.** `bunx jest | tail` devuelve el código de `tail`.
5. **`(tabs)` sin escapar es una regex para jest** — salta ficheros en silencio
   con exit 0. Usa `--runTestsByPath` o escapa.
6. `rm -f mobile-pet-tracker/.expo/types/router.d.ts` antes de cualquier `tsc`.
7. **`bun` / `bunx`, nunca `npx` ni `npm`.**
8. **No lances `./init.sh`** — lo corro yo al cerrar.
9. **No marques nada `done`, no mergees, no abras PR.**

## Tres cosas que esta feature invita a hacer mal

**Los títulos NO llevan `#110`.** Van en la forma
`R1 (mobile-reanimated-double-dead-weight): …`, sin almohadilla. **Es
deliberado y el humano lo firmó**: el literal `#110` casa con el guard de
colores hex de `design-drift.test.ts` (`1`, `1` y `0` son dígitos hex) y
pondría **rojos los cinco guards** que vigilan este fichero. No lo
«arregles» poniéndolo en la forma canónica, y **no partas el literal**
(`'#' + '110…'`): eso es justo lo que #108 está retirando. Precedente de la
forma elegida: `src/screens/add-pet/index.test.tsx:392`.

**Si el test de `#62 R8` se pone rojo, PARA.** Hoy está medido que no se pone.
Si se pusiera, significaría que producción no cumple lo que #62 exigía —un
posible defecto funcional— y esta feature tiene **prohibido tocar producción**.
No reescribas esa aserción: pertenece a una spec ya firmada y tocarla necesita
el **Gate 2**, que solo puede dar el humano. Devuelve el trabajo diciendo qué
falló.

**Hay dos zonas del fichero que no son tuyas.** En
`src/screens/home/index.test.tsx`:
- **líneas 3790 y 3835** — los literales partidos `'#' + '106 R2…'` y
  `'#' + '106 R3…'`, que retira **#108** en otra sesión;
- **líneas 3350-3363** — el candado de `reminders-see-all`, que es **#112**.

**No las toques.** Si tu trabajo acabara rozando cualquiera de las dos, para y
dilo.

## Alcance cerrado

- **Siete gemelos** del patrón ya están clasificados en la spec. Solo se actúa
  sobre lo que la spec nombra: uno de ellos **parece** el mismo caso y es
  load-bearing —quitarlo deja 4 rojos—, así que no lo toques aunque te lo
  parezca.
- **Ninguna dependencia nueva**, **ninguna clave de copy**. No toques
  `src/i18n/catalog.ts` ni `language-provider.test.tsx`.

## Al terminar

`progress/impl_mobile-reanimated-double-dead-weight.md` con:

- **Los dos números exactos que pide `tasks.md` §Cierre**, que otra sesión
  necesita para re-medir un gate suyo: el **recuento de tests de
  `src/screens/home/index.test.tsx`** y el **total de la suite móvil**. Son
  entregable obligatorio, no un extra.
- `bunx jest` sin filtro y `bunx tsc --noEmit`, con su **exit code medido sin
  pipe**.
- La tabla de sondas con su veredicto **medido**, no recordado.
- **Qué skills cargaste** (se espera: ninguna).
- Cualquier decisión que la spec no cerrara, marcada como tal.
