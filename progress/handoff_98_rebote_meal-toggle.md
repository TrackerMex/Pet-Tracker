# Rebote a Codex CLI — #98, hueco de candado en `meal-toggle`

> Escrito por el `leader` el 2026-09-21, tras el veredicto del `reviewer`
> (`progress/review_mobile-meals-served-ui.md`, primera ronda). El humano copia
> el bloque de abajo en su terminal de Codex CLI.
>
> **Esperar a que el `reviewer` de la segunda ronda termine antes de lanzarlo**:
> un solo escritor sobre el working tree.

---

```
Feature: mobile-meals-served-ui (#98), branch: feature/98-mobile-meals-served-ui
Esto es un REBOTE, no una feature nueva. Tu implementación de #98 está medida y
sin objeciones de código (77/77 suites, 1369/1369 tests, tsc limpio). Falta UNA
cosa, que encontró el reviewer con una sonda de mutación propia.

EL HUECO

Quitar el feedback táctil del botón por franja deja 4 suites y 150 tests VERDES:

    src/app/(tabs)/food.tsx:253-255
    style={({ pressed }) => ({
      opacity: pressed ? 0.8 : 1,
    })}

Nadie lo canda. Verificado: los ocho usos de `meal-toggle-0` en
src/app/(tabs)/__tests__/food.test.tsx (:479, :511, :544, :552, :573, :586,
:602, :612) son findByTestId, toBeDisabled y fireEvent.press. Ninguno mira el
style.

POR QUÉ ES OBLIGATORIO, NO OPCIONAL

  - La spec aprobada lo exige literalmente en R5:
    specs/mobile-meals-served-ui/requirements.md:299 prescribe
    `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`
    y lo llama «la misma receta de» la Home.
  - docs/ui-guidelines.md:184 lo exige para todo elemento tappable:
    «Feedback pressed en TODO elemento tappable (Pressable style function o …)».
    Eso es C8 de CHECKPOINTS.md.
  - La Home SÍ lo canda, con regex sobre el fuente:
    src/screens/home/index.test.tsx:190 y :3297 usan
    /style=\{\(\{ pressed \}\) => \(\{ opacity: pressed \? 0\.8 : 1 \}\)\}/

QUÉ HACER

Dos piezas, en este orden:

1. NORMALIZA food.tsx:253-255 a UNA SOLA LÍNEA, exactamente como la escribe la
   spec en :299 y como ya está en la Home (src/screens/home/index.tsx:314 y
   :626). Hoy está en tres líneas, y por eso la regex ya probada de la Home no
   sirve calcada. Normalizar es más barato que escribir una regex multilínea
   nueva, y deja las tres apariciones del repo idénticas.

2. AÑADE EL CANDADO en src/app/(tabs)/__tests__/food.test.tsx, dentro del
   describe de #98 R5 que ya existe, reutilizando el patrón de la Home: leer el
   fuente de food.tsx con readFileSync y asertar la regex de arriba sobre el
   bloque del meal-toggle.

   NO copies la aserción de index.test.tsx:190 a ciegas: ábrela, mira qué
   ámbito acota (allí el bloque es de la Home) y adáptala a food.tsx. Un mock o
   una aserción calcada de otra suite ya rompió trabajo en #73.

REQUISITO DE VERIFICACIÓN (C4, vía (b)) — LÉELO ANTES DE COMMITEAR

El style YA está en producción, así que un test nuevo nacería VERDE y no
habría historial rojo→verde. Usa la misma vía (b) que ya usaste en R8 y que el
humano firmó como enmienda E2:

  - Commit ROJO: quita temporalmente el style del meal-toggle en food.tsx y
    commitea el test nuevo viéndolo fallar de verdad.
  - Commit VERDE: restaura el style, ya normalizado a una línea.

Ese rojo tiene que ser real y por la razón correcta: que el candado detecta la
ausencia del feedback, no otra cosa.

ALCANCE Y LÍMITES

  - Toca SOLO src/app/(tabs)/food.tsx y src/app/(tabs)/__tests__/food.test.tsx.
  - NO añadas un R12: el candado va dentro de R5, que ya lo exige. No hay que
    enmendar la spec otra vez.
  - Actualiza la fila de R5 en specs/mobile-meals-served-ui/traceability.md con
    los dos commits nuevos. NO rebasees después: los hashes dejarían de ser
    ancestros.
  - `(tabs)` sin escapar es una regex y los ficheros se saltan EN SILENCIO con
    exit 0. Usa:
      bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'
  - Borra mobile-pet-tracker/.expo/types/router.d.ts antes del typecheck.
  - NO lances ./init.sh: Postgres y LocalStack son compartidos con worktrees
    vecinos. Mide con bunx jest y bunx tsc --noEmit desde mobile-pet-tracker/.
  - bun, nunca npx. Cero dependencias nuevas.

AL TERMINAR

  - Añade una sección al final de progress/impl_mobile-meals-served-ui.md
    titulada «Rebote: candado del feedback táctil del meal-toggle», con los dos
    commits, el resultado del lote de jest y del typecheck, y la confirmación
    de que el rojo falló por la ausencia del style.
  - NO marques #98 como done, NO mergees y NO abras el PR.
  - Avisa al humano y para. Vuelve a revisar el reviewer.
```

---

## Nota para el humano

Con esto cerrado quedan dos cosas para #98: el veredicto de la segunda ronda del
`reviewer` y tu prueba de humo en dev build de Android (los seis pasos de
`specs/mobile-meals-served-ui/requirements.md:579-589`).
