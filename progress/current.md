# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #108 — design-drift-hex-guard-rid

- **Branch**: `feature/108-design-drift-hex-guard-rid`, cortada de `origin/main`
  y re-sincronizada con `7ce87d70` (merge de PR #146, que cerro #106 + #107).
- **Worktree**: `/home/claude/sites/Pet-Tracker-wt-ui`.
- **Estado**: spec escrita y en `spec_ready` (`77224889`), R1-R4. Esperando la
  firma del humano en `specs/design-drift-hex-guard-rid/requirements.md:386`,
  que es el **unico** gate humano de #108: no hay prueba de humo porque la
  feature no cambia ni una linea que llegue al dispositivo.
- **Orden duro que el handoff repite**: R2 antes que R3. Revertir los
  literales con el regex viejo pone en rojo los cinco guards que listan
  `screens/home/index.test.tsx` (`:220, :260, :279, :301, :322`), y ese rojo
  no es el del candado de R3.
- **Gate numerico**: 14 tests nuevos (R1=2, R2=8, R3=3, R4=1) en 4 describes.
  1396 + 14 = **1410**; `design-drift.test.ts` 41 + 14 = **55** en 21
  describes; `Test Suites` sigue en **77** (cero ficheros nuevos).
- **Sin sesion paralela**: #106 + #107 cerradas y mergeadas. El worktree
  principal queda libre; aun asi #108 se queda en `-wt-ui`.

### El defecto, medido en `7ce87d70`

El guard de colores hex de `mobile-pet-tracker/src/__tests__/design-drift.test.ts`
usa `/#[\da-f]{3,8}\b/i` y confunde un R-id de tres cifras con un color hex de
tres digitos, porque 0-9 son un subconjunto de los hex. La frontera es exacta:
`#98` son dos caracteres y **no** casa; `#100` en adelante **si**. Afecta a toda
feature de id >= 100, y #106 fue la primera en escribir tests para una.

**El regex esta duplicado en ocho guards**, no en uno:

| Forma | Lineas | Cuenta |
|---|---|---|
| corta `text-[10px]\|#hex\|StyleSheet` | 117, 220, 260, 279, 301, 322 | **6** |
| larga (anade `shadowColor`/`elevation`) | 197, 343 | **2** |

Las dos largas **no son iguales entre si**: `:197` lleva `StyleSheet\.create` y
`:343` lleva `StyleSheet(?:\.create)?`, asi que la de 343 atrapa `StyleSheet` a
secas y la otra no. Unificarlas cambia lo que cada una cubre: es decision de
diseno, no copiar y pegar.

Muerde ficheros de test porque las listas `featureFiles` los enumeran: hay 11
entradas `.test.ts(x)` y `screens/home/index.test.tsx` aparece en **cinco**
(`:207, :253, :272, :294, :315`). Por eso mordio ahi y no en `food.test.tsx`,
que no esta en ninguna lista.

### Workaround a deshacer

`src/screens/home/index.test.tsx:3790` y `:3835` — re-medidas contra el arbol
tras el merge, siguen en esas lineas. `describe('#' + '106 R2: ...')` funciona
pero deja `grep '#106 R2' src/` en **falso negativo**, y ese grep es el metodo
con el que `traceability.md` cita el titulo literal del describe y con el que el
reviewer verifica C5.

Revertir sin tocar el regex compra un respiro, no el arreglo: la trampa vuelve
con #109 o #110.

### Baseline medido aqui (sin pipe, `JEST_EXIT=0`)

`Test Suites: 77 passed` · `Tests: 1396 passed`. `design-drift.test.ts`: **41
tests, 17 describes**. Ninguno de los dos puede bajar.

### `init.sh` no se lanza

#108 no toca `backend-pet-tracker/`. Aviso de la sesion vecina: `init.sh` emite
`warn` (no `fail`) por tres claves ausentes del `.env` — `RESEND_API_KEY`,
`RESEND_FROM`, `RESET_LINK_HOST`. Lleva asi varias sesiones; no perseguirlo.
