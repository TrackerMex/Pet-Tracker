# Handoff a Codex CLI — #109 `mobile-meal-toggle-source-lock-nesting`

> Escrito por el `leader` el 2026-09-22. Pégale a Codex CLI todo lo que va
> debajo de la línea.

---

Feature: **#109 `mobile-meal-toggle-source-lock-nesting`**. Branch
`feature/109-mobile-meal-toggle-source-lock-nesting`, ya creada y activa,
cortada de `main` en `73f14d5e`.

Spec **aprobada por el humano**: `specs/mobile-meal-toggle-source-lock-nesting/requirements.md`
(`status: approved`). Lee también `design.md` y **sobre todo `tasks.md`**, que
trae el orden exacto, los comandos y las **diez sondas** con su veredicto
esperado. `tasks.md` es el guion; este handoff solo añade lo que no está ahí.

## Antes de escribir una sola línea

1. Carga las skills de tu plugin `expo`: **`expo-overview`** primero.
   **Comprueba que existen en tu catálogo antes de darlas por cargadas**: en
   #106 el handoff pidió dos skills que no existían y no hubo ningún aviso —
   cargaste otra distinta y el reviewer lo descubrió al final.
2. `rm -f mobile-pet-tracker/.expo/types/router.d.ts` antes de cualquier
   `tsc`. Está gitignorado y rompe el typecheck con rutas fantasma.
3. Lee `docs/conventions.md` §Tests: vas a añadirle una subsección (R4).

## Qué es esta feature en una frase

El candado que vigila el feedback de pulsado del botón de comida recorta el
fuente de `food.tsx` entre `lastIndexOf('<Pressable', anchor)` y
`indexOf('</Pressable>', anchor)`. Si alguien **anida un Pressable dentro**
del botón, el corte cae en el `</Pressable>` **del hijo**, el bloque se queda
con el tag de apertura del hijo **y su `style`**, y el test **pasa en verde
vigilando el botón equivocado**. No falla hacia rojo.

El arreglo son **dos líneas**: el recorte pasa a ser el **tag de apertura
propio**, de `<` a `<`. El anidamiento deja de existir como concepto.

## Reglas críticas

1. **Cero diff de producción.** `src/app/(tabs)/food.tsx` tiene que quedar
   **byte a byte** como está. Los commits intermedios sí lo tocan —la mutación
   V4 se versiona en el commit rojo y se revierte en el verde, que es la vía
   (b) de C4— pero el diff **acumulado** contra `73f14d5e` es **vacío**. Si
   crees que hay que tocarlo de forma permanente, **para y devuelve el
   trabajo** en vez de tocarlo.
2. **TDD por requisito, el test rojo ANTES que su implementación**, un commit
   por requisito como mínimo. Un único commit con todo incumple C4.
3. **El commit rojo de R1+R2 lleva la mutación V4 dentro.** Es requisito de
   verificación: sin la mutación el test nace verde y no prueba nada.
4. **Las diez sondas de `tasks.md` son obligatorias** y su tabla va en el
   reporte: V1-V4 (acotado, todas rojas), V5-V7 (no-regresión: verde, verde,
   rojo). El reviewer las va a repetir, así que no las reportes de memoria.
5. Rellena `traceability.md` tras cada commit. **No rebasees** después: los
   hashes dejarían de ser ancestros de HEAD.
6. **`(tabs)` sin escapar es una regex para jest**: un comando con
   `src/app/(tabs)/__tests__/food.test.tsx` **se salta el fichero en silencio
   y sale con código 0**. Usa `--runTestsByPath` o escapa los paréntesis.
7. **Exit codes sin pipe**: `bunx jest | tail` devuelve el código de `tail`.
8. **`bun` / `bunx`, nunca `npx` ni `npm`.**
9. **No lances `./init.sh`** — lo corro yo al cerrar.
10. **No marques nada `done`, no mergees, no abras PR.**

## Tres avisos concretos de esta feature

**Los títulos de los `describe` van con `#109` entero.** Ya está medido: el
guard de colores hex de `design-drift.test.ts` salta los directorios
`__tests__` enteros y nunca llega a `food.test.tsx`. **No partas el literal**
como se hizo en #106 — allí hacía falta porque el fichero vive junto a su
fuente, aquí no.

**No toques `src/screens/home/index.test.tsx`.** Tiene el mismo patrón roto en
`:3355-3359` y da la tentación de arreglarlo de paso. Está **fuera de alcance
a propósito**: ese fichero lo tiene tomado #108 en otra sesión y lo romperías
en conflicto. Queda registrado como deuda aparte.

**No extraigas un helper.** El cambio son dos líneas y `tasks.md` lo dice
expresamente. Un helper compartido sería él mismo otro símbolo que vigilar,
que es justo la deuda B8 que esta feature hereda como lección.

## Lo que no se toca

- Ninguna de las dos patas de `#107 R5` se borra. El `it` de fuente se
  **edita**; el `it` de árbol **no se toca**.
- La regex de la receta no cambia. Cambia el recorte, no lo que se busca.
- **Ninguna clave de copy**, así que `src/i18n/catalog.ts` y
  `src/providers/__tests__/language-provider.test.tsx` **no se tocan**. El
  candado de longitud del catálogo ya paró el trabajo dos veces.
- **Ninguna dependencia nueva.**

## Al terminar

Escribe `progress/impl_mobile-meal-toggle-source-lock-nesting.md` con:

- La **tabla de las diez sondas** con su veredicto medido, no recordado.
- `bunx jest` sin filtro y `bunx tsc --noEmit`, con su **exit code medido sin
  pipe**.
- La salida literal de `git diff 73f14d5e -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'`,
  que tiene que estar **vacía**.
- El delta de suites y tests contra `73f14d5e` — no un recuento absoluto, que
  caduca entre que se escribe y se lee.
- Cualquier decisión que la spec no cerrara, marcada como tal.
