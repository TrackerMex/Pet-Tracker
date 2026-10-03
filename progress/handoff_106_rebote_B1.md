# Rebote a Codex CLI — #106, hallazgo B1

> Escrito por el `leader` el 2026-09-22 tras el veredicto de
> `progress/review_mobile-meals-bar-motion.md`. Pégale a Codex todo lo que va
> debajo de la línea.

---

Branch: **`feature/106-mobile-meals-bar-motion`**, ya activa. Base de la
revisión: `a3411673`. **No rebasees**: la trazabilidad ya está rellena con
hashes y un rebase los dejaría de ser ancestros de HEAD.

El trabajo quedó aprobado salvo **un hallazgo**, B1. No es un requisito nuevo
inventado después de la firma: es que **la spec firmada se contradice a sí
misma** y tomaste su lectura débil.

## Qué pasa

`R2` fija dos valores que salen de `docs/ui-guidelines.md` §Animación («250 ms
transición»), es decir de **C8**:

```js
// src/screens/home/index.tsx:85-90
export const MEALS_BAR_DURATION_MS = 250;
export const MEALS_BAR_EASING = Easing.bezier(0.77, 0, 0.175, 1);
export const MEALS_BAR_TIMING = { duration: …, easing: …, reduceMotion: ReduceMotion.System };
```

Ninguno está candado. Medido por el `reviewer`:

| Mutación en `src/screens/home/index.tsx` | Resultado |
|---|---|
| `MEALS_BAR_DURATION_MS` 250 → **2500** | **138/138 VERDE** |
| `Easing.bezier(0.77, 0, 0.175, 1)` → otra curva | **138/138 VERDE** |
| borrar `reduceMotion: ReduceMotion.System` | **138/138 VERDE** |

La causa está en `src/screens/home/index.test.tsx:3806-3808` y **`:3856`**:
aseveran contra `MEALS_BAR_TIMING` **importado del propio módulo de
producción** (`:33`). Mutar la constante muta los dos lados de la igualdad. Es
una tautología.

**Tu sonda no fue deshonesta**: mutaste el call-site y eso sí se pone rojo. Era
demasiado débil para tocar lo que fija la carta, nada más.

Dónde está la contradicción: R2 pidió comparar «por identidad», pero
`design.md:108` cita como precedente
`src/screens/home/weekly-activity-chart.test.tsx:927-944`, que **sí** canda los
literales con `expect.objectContaining({ duration: 250, … })`. Ábrelo: es el
patrón a seguir.

## Qué quiero

Los **dos** call-sites, `:3806-3808` y `:3856`, dejan de comparar contra el
objeto importado y pasan a aseverar los valores.

- `duration: 250` va **literal en el test**. Es el que importa y el que la
  carta fija.
- `reduceMotion: ReduceMotion.System` se importa de
  `react-native-reanimated`, **no** de producción, así que aseverarlo ya es un
  candado de verdad.
- **`easing` es el que tiene trampa, y quiero que lo midas antes de decidir.**
  Si lo aseveras contra `MEALS_BAR_EASING` importado de producción sigues en la
  misma tautología, solo que más larga. Comprueba **cuál de estas dos
  funciona** y usa la que funcione:
  1. construir una curva fresca en el test —`Easing.bezier(0.77, 0, 0.175, 1)`
     con los literales— y ver si compara igual. Puede no comparar: dos beziers
     con los mismos parámetros pueden ser objetos distintos con closures
     distintas.
  2. si (1) no compara, candar la curva **por su comportamiento**: muestrearla
     en uno o dos puntos y aseverar el valor. Una línea más y es un candado
     real.

  **Mídelo, no lo supongas.** Si ninguna de las dos es viable, déjalo escrito
  en el reporte con la evidencia del intento en vez de fingir un candado.

## Cómo demuestras que funciona

Commit rojo→verde como siempre, y en el reporte la **sonda de mutación sobre
producción** —no sobre el call-site— con esta tabla rellena:

| Mutación en `src/screens/home/index.tsx` | Suites rojas | Tests rojos |
|---|---|---|
| `MEALS_BAR_DURATION_MS` 250 → 251 | | |
| `MEALS_BAR_EASING` → `Easing.bezier(0.23, 1, 0.32, 1)` | | |
| borrar `reduceMotion: ReduceMotion.System` | | |

Las tres tienen que ponerse **rojas**. Si la de `easing` no se pone roja con el
camino que elegiste, ese camino no sirve — prueba el otro.

## Reglas que siguen en pie

- **Solo tocas `src/screens/home/index.test.tsx`.** El diff neto de
  `src/screens/home/index.tsx` por este rebote es **cero**: las constantes de
  producción están bien, lo que falla es el test que las vigila. Si crees que
  hay que tocar producción, para y dilo.
- `(tabs)` sin escapar es una regex para jest: salta ficheros en silencio con
  exit 0. Usa `--runTestsByPath` o escapa los paréntesis.
- Exit codes **sin pipe**: `bunx jest | tail` devuelve el código de `tail`.
- `rm -f mobile-pet-tracker/.expo/types/router.d.ts` antes de cualquier `tsc`.
- **No lances `./init.sh`** — lo corro yo al cerrar.
- No marques nada `done`, no mergees, no abras PR.
- Carga las skills de tu plugin `expo` (`expo-overview`, luego
  `expo-animation`). El `reviewer` detectó que no las tenías cargadas en la
  primera pasada (hallazgo B5).

## Al terminar

Añade al final de `progress/impl_mobile-meals-bar-motion.md` una sección
`## Rebote B1` con la tabla de arriba rellena, qué camino de `easing` elegiste
y por qué, y el exit code de `bunx jest` sin filtro medido sin pipe.

Actualiza la fila de **R2** en `specs/mobile-meals-bar-motion/traceability.md`
con los hashes nuevos, sin borrar los viejos: es un candado reforzado, no un
requisito distinto.
