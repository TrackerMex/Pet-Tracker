---
feature: "mobile-profile-family-join-row"
status: spec_ready      # draft | spec_ready | approved
tags: [mobile, profile, ui, spec]
---

# Diseño — [[mobile-profile-family-join-row]] (#229)

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/architecture|architecture]] para las reglas de capas y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil. Rutas
> relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Deriva verificada

Contrastado contra el árbol `26b86621`, no contra el plan:

| Premisa del plan | Resultado |
|---|---|
| `ProfileWideTile` no lleva `flex-1` | Cierta. `grep -cF "flex-1 flex-row items-center gap-2.5 rounded-tile p-3" src/screens/profile/index.tsx` = 0; la clase sin prefijo = 1. `ProfileTile` sí: `flex-1 gap-1.5 rounded-tile p-3` = 1. |
| Va dentro de `profile-links-row-2` y `-row-3` | Cierta, y además `-row-1` sin mascota. Cada fila es `<View … className="flex-row gap-2">` con un solo hijo. |
| El bloque de texto (`flex-1`) se queda en 0 | Cierta por estructura de Yoga: un hijo de `flex-row` sin `flex-1` mide su contenido y el `flex-1` interno no tiene base de la que crecer. Jest no mide layout; lo confirma el smoke G2. |
| #235 ya está en el fichero | Cierta: el `BubblePop` de la cámara cuelga de `isOwner`; no se toca. |
| Choque con otros candados | Ninguno: ni `ChevronRight` (2), ni `CONTINUOUS_CORNER`, ni `rounded-tile`, ni `signOut`, ni copy se mueven. Solo hay que enmendar tres `it` de `src/screens/profile/index.test.tsx` (R6). |

No hay deriva: la feature procede.

## Decisiones técnicas

- **`flex-1` en el componente, no en las llamadas** (R1, R4). `ProfileWideTile`
  es el único sitio donde se pinta la tarjeta ancha; ponerlo ahí arregla a la
  vez las dos tarjetas y la rama sin mascota. Es una sola cadena de clase, sin
  prop nueva ni variante.
- **Reutilizar la fila 2, borrar la 3** (R2). Mover `{joinPetLink}` dentro de
  `profile-links-row-2`, tras la tarjeta de Familia, es el diff mínimo: el
  `joinPetLink` ya es una constante compartida por las dos ramas
  (con y sin mascota), así que no se duplica.
- **Alto igual por `stretch`** (R5). La fila es `flex-row gap-2` sin `items-*`,
  igual que las filas de `ProfileTile`. No se introduce `h-*`/`min-h-*`: un alto
  fijo cortaría el texto en móviles con fuente grande.
- **Tarjeta horizontal conservada** (D1). Media tarjeta deja un texto estrecho;
  es el riesgo conocido que el smoke decide. La alternativa vertical
  (icono arriba, texto debajo, sin chevron) cambia el diseño aprobado de #214 y
  exigiría artboard (G1): descartada para esta feature.
- **Candados que no son tautológicos.** Los literales de clase y de copy se
  escriben a mano en los tests nuevos; no se importa `CATEGORY_SLOTS` ni
  ninguna constante de producción como valor esperado. El rojo de R1/R2/R4/R5
  nace de la ausencia real de `flex-1` y de la fila 3; R3 nace verde y está
  declarado (fija lo que el cambio no debe tocar, con su mutación en la zona
  ciega de R1: el `flex-1` del bloque de texto).

## Archivos afectados por capa

Solo capa de presentación móvil:

| Capa | Archivo | Cambio |
|---|---|---|
| Pantalla | `src/screens/profile/index.tsx` | Prefijo `flex-1 ` en el `Pressable` de `ProfileWideTile`; `{joinPetLink}` se mueve dentro de `profile-links-row-2`; se borra el `View` de `profile-links-row-3`. Diff `+1 −3`. |
| Tests | `src/screens/profile/index.test.tsx` | Siete `it` nuevos en cinco `describe('#229 R<n>: …')` al final; tres `it` enmendados en su sitio (R6). |
| Specs | `specs/mobile-profile-family-join-row/` | Esta carpeta. No se edita `specs/mobile-pet-members/`. |

Nada en `src/i18n/`, `src/theme/`, `src/__tests__/`, `docs/`, backend, ni
dependencias.

## Alternativas descartadas

- **Tarjetas verticales o mosaico 2x1 con otro diseño**: exige artboard (G1) y
  no la pidió el humano; D1.
- **`numberOfLines` / `adjustsFontSizeToFit`** para el texto estrecho: recorta
  copy aprobado; se decide tras el smoke.
- **`flex-1` por llamada** (prop `className` en `ProfileWideTile`): añade una
  superficie de API para un solo valor; no arregla la rama sin mascota salvo que
  se repita.
- **Una fila nueva (`-row-3`) con dos hijos** en vez de reutilizar la 2: deja
  una fila vacía o renombra testIDs sin ganancia.
- **Editar el artboard de #214**: lo escribe solo el leader y la decisión del
  humano ya lo supera; se anota en la spec.

## Riesgos

- **Texto estrecho** (D1): en pantallas de unos 360 dp, el texto de cada
  tarjeta tiene ~72 a 100 px; Familia con subtítulo y «Unirme con código» con
  «¿Te invitaron a cuidar una mascota?» pueden ocupar 3 o 4 líneas. El
  `stretch` iguala los altos, así que se ve ordenado. Decide el smoke G2.
- **Fricción con #235**: ambas tocan `profile/index.tsx`, #235 ya está mergeada
  en `dev`; esta rama parte de ahí. Si otra rama toca estas líneas antes del
  handoff, se mergea `dev` antes (memoria `handoff-tras-merge-de-dependencia`).
