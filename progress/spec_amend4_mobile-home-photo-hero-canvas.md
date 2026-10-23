# Enmienda A4 de #195 (mobile-home-photo-hero-canvas): informe del spec_author

Estado: COMPLETO (secciones 1-7 rellenas). Casilla `Enmienda A4 de #195` sin marcar; pendiente de firma humana. Worktree `Pet-Tracker-wt-195`, branch `feature/195-mobile-home-photo-hero-canvas`, HEAD de partida `44ea637f`.

Decision del humano (2026-10-22), variante D, tras ver la comparativa con su foto real de 960x1280: `PET_HERO_MEDIA_HEIGHT` 330 a 430, `PET_HERO_FADE_HEIGHT` 160 a 100, `PET_HERO_SCRIM_HEIGHT` 130 a 90. Se declara como decision humana D6 (D1-D5 ya existen) y como divergencia deliberada del artboard del canvas (330).

## 1. Veredicto sobre R17

- Paradas proporcionales (`35 %` / `65 %` sobre 100 px): NO cumplen R17. El nombre cae por debajo de 4,5:1 en los dos temas, y la raza y la etiqueta en light caen por debajo incluso del suelo aceptado de 4,2:1.
- Paradas nuevas (`24 %` / `44 %` sobre 100 px): cumplen R17 sin relajar ningun suelo. Las dos excepciones aceptadas de light (raza 4,26:1 y etiqueta 4,36:1) NO cambian de cifra.
- Variante D tal cual, sin tocar las paradas: no se puede entregar. Con paradas nuevas si.

## 2. Hechos medidos

Modelo replicado literalmente (script de scratchpad `a4.js`, misma formula que `home-photo-hero-canvas.test.ts` R17: mezcla lineal sobre la peor foto negra o blanca, x0,86 en dark, luminancia WCAG, tokens de `global.css`).

Distancia `d` = px desde el borde inferior del frame hasta el borde superior de la caja de cada texto. Se mantiene porque el pie (`bottom-1.5`) no cambia: pildora d=90, nombre d=64, raza d=26, valor del dato destacado d=54, etiqueta del dato d=22.

Alfa del degradado en esas distancias:

| d | antes (160 px) | proporcional (100 px, 35/65) | nuevo (100 px, 24/44) |
|---|---|---|---|
| 22 | 0,941 | 0,906 | 0,941 |
| 26 | 0,930 | 0,889 | 0,930 |
| 54 | 0,855 | 0,533 | 0,855 |
| 56 | 0,850 | 0,500 | 0,850 |
| 64 | 0,767 | 0,367 | 0,650 |
| 76 | 0,642 | 0,240 | 0,350 |
| 90 | 0,496 | 0,100 | 0,146 |
| 98 | 0,412 | 0,020 | 0,029 |

Alfa minimo que exige cada suelo (para el peor fondo): texto foreground >= 4,5 pide alfa >= 0,485 en light y >= 0,517 en dark; muted en light >= 4,2 pide alfa >= 0,925; muted en dark >= 4,5 pide alfa >= 0,797. El nombre (d=64) con las paradas proporcionales queda en 0,367, por debajo de ambos minimos de foreground: ese es el fallo. La foto de Luna, con la parte inferior blanca, lo ocultaria.

## 3. Modelo de contraste recalculado

Nueve valores del test R17 (orden: raza, nombre, etiqueta, cifra, pildora, punto accent, punto danger, fg/glass, muted/glass).

| | antes (160 px, referencias vigentes) | proporcional 100 px (35/65) | nuevo 100 px (24/44) |
|---|---|---|---|
| light raza | 4,26 | 3,86 (suelo 4,2: FALLA) | 4,26 |
| light nombre | 10,79 | 2,90 (suelo 4,5: FALLA) | 7,75 |
| light etiqueta | 4,36 | 4,02 (suelo 4,2: FALLA) | 4,36 |
| light cifra | 13,55 | 5,34 | 13,55 |
| dark raza | 6,51 | 5,87 | 6,51 |
| dark nombre | 9,77 | 2,97 (suelo 4,5: FALLA) | 6,74 |
| dark etiqueta | 6,67 | 6,13 | 6,67 |
| dark cifra | 12,79 | 4,72 | 12,79 |

Pildora (5,70 / 6,43), puntos (4,82 / 3,76 en light, 3,93 / 6,84 en dark), fg/glass (13,71 / 11,46) y muted/glass (3,60 / 4,79) no dependen del degradado: no cambian.

Con las paradas nuevas solo cambian las referencias del nombre: 10,79 a 7,75 (light) y 9,77 a 6,74 (dark), ambas siguen muy por encima del suelo de 4,5. Las demas siete referencias de cada tema se conservan. La tolerancia sigue siendo +-0,05.

Formula nueva de `fadeAlpha(d)` (literal de test, nunca importado de produccion): `d <= 56`: `1 - (d/56)*0,15`; `56 < d <= 76`: `0,85 - ((d-56)/20)*0,5`; `76 < d <= 100`: `0,35*(100-d)/24`. La parada `24 %` desde arriba del degradado equivale a d=76 (alfa 0,35 = `59`) y la `44 %` a d=56 (alfa 0,85 = `D9`).

Gradiente de produccion: `linear-gradient(to bottom, ${background}00 0%, ${background}59 24%, ${background}D9 44%, ${background} 100%)`.

Las dos excepciones aceptadas de light (4,26 y 4,36) NO cambian: la frase de excepcion de la carta (`docs/ui-guidelines.md`, seccion de #195) y la casilla `Enmienda #195 aprobada por humano` siguen siendo validas en lo que a cifras de contraste respecta.

Contrapartida declarada: las paradas nuevas son mas densas que la vista previa proporcional que vio el humano en la franja d 35-56 (alfa 0,85 en d=56 frente a 0,50). Cobertura media del degradado: antes 0,565, proporcional 0,565, nuevo 0,680.

## 4. Geometria del pie

Columna izquierda: pildora 22 (text-xs leading 16 + py-0.75 x2) + gap-1 (4) + nombre leading 34 + gap-1 (4) + raza leading 20 = 84 px, mas `bottom-1.5` (6 px) = 90 px desde el borde inferior del frame hasta el borde superior de la pildora.

- Cabe en un degradado de 100 px con 10 px de margen (la pildora, con su propio fondo opaco, arranca en d=90 donde el alfa del degradado es 0,146).
- El nombre (d=64) queda 36 px dentro del degradado.
- Sin pildora (sin `status`) la columna mide 64 px y sobra margen de 36 px.
- Columna derecha (cifra): valor leading 32 + etiqueta leading 16 = 48, mas 6 = 54 px: sobra 46 px.

Dos hechos que el modelo R17 no cubre y que van a Riesgos y a Dudas abiertas:

1. Nombre a dos lineas: el borde superior de la primera linea queda en d~98, donde el degradado ya es casi transparente. El contraste del foreground alli es 1,06 / 1,38 (nuevo) frente a 3,46 / 3,35 (antes). Ambos estan por debajo de 4,5: el problema ya existia con 160 px, pero empeora. R17 solo cubre nombres de una linea. Se propone `numberOfLines={1}` como decision del leader o del humano, sin suelo nuevo.
2. Velo superior de 90 px frente a la fila superior (`pet-hero-slot`, de `insets.top + 12` a `insets.top + 56`): la fila sobrepasa los 90 px del velo a partir de `insets.top` ~35 (6 px mas alla con el mock de jest de 40; 25 px con `insets.top` 59). Alfa del velo en el centro de la fila: 0,089 con 90 px frente a 0,216 con 130 px (`insets.top` 40); 0,000 frente a 0,143 (`insets.top` 59). No afecta a ningun suelo del modelo R17 (que no mide el velo superior), pero es un efecto visual a decidir.

## 5. Barrido (grep por contenido, no por linea)

Medido sobre el worktree a `44ea637f`. Las lineas son solo informativas: la spec ancla por contenido.

| Contenido buscado | Donde aparece | Que hace A4 |
|---|---|---|
| `\b330\b` en `pet-hero-header.test.tsx` | 8 lineas: el `toBe(330)` de la constante, dos del esqueleto (titulo y `{ height: 330 }`), el `describe` y el `style` del frame de R1, el `StyleSheet.flatten` del medio, `{ height: 330 }` del esqueleto en R2 y `media.props.height` | Filas 14a, 14b, 14c (4 casos), 14d, 14g (2) y 14h pasan a 430. Los titulos de 14b y 14c se reescriben sin sufijo nuevo |
| `\b(160\|130)\b` en el mismo fichero | 4 lineas: `toBe(160)` y `toBe(130)` de las constantes y las dos de R3 (`height: 130` y `height: 160`) | Filas 14a y 14e pasan a 100 y 90 |
| `35%` / `65%` | produccion (cadena del degradado inferior) y 2 en HERO (regex de 14f y cadena de 14e) | Pasan a `24%` y `44%`; la regex de 14f se reescribe |
| `PET_HERO_(MEDIA\|FADE\|SCRIM)_HEIGHT =` en `pet-hero-header.tsx` | 3 constantes y 1 cadena de paradas | Commit C, las cuatro y nada mas. `FADE` no lleva `;` hoy: ningun candado lo exige |
| `\b(104\|160)\b` y `10.79\|9.77` en `home-photo-hero-canvas.test.ts` | `fadeAlpha` (tramos de 104 y 160) y las dos referencias del nombre | Commit B: tramos 56/76/100 y referencias 7.75 / 6.74 |
| `HEROMOT` (`pet-hero-header-motion.test.tsx`) | 0 literales de medida | No se toca |
| HOME (`screens/home/index.test.tsx`) | solo `130 ms` de un temporizador de pulsacion, sin relacion con la medida; 0 `StyleSheet` | No se toca. Debe seguir sin `StyleSheet` (guarda `design-drift`) |
| `grep -rlE "pet-hero-fade-bottom\|pet-hero-scrim-top\|pet-hero-frame\|pet-hero-skeleton" src` | 4 ficheros: `pet-hero-header.tsx`, `pet-hero-header.test.tsx`, `consistency-classnames.test.ts`, `screens/home/index.test.tsx` | Los mismos 4 despues de A4. Solo los dos primeros llevan medidas; los otros dos buscan `testID` y clases |
| Seccion de #195 de `docs/ui-guidelines.md` (la ultima `## `) y primer bloque Markdown de `design.md` | 1 + 1 | Commit E, atomico, por el byte a byte de R20 |
| `h-[330px]` | mutacion de R19 | No se toca: es una clase de relleno arbitraria, no una medida del frame |

Sin candado nuevo que mire una constante importada de produccion: los literales 430/100/90 y las paradas son literales de test. El unico `it` que lee produccion lo hace sobre el texto del fichero sin comentarios.

Nacen en rojo (commit y mutacion que los vuelve a poner en rojo):

- Filas 14a a 14h de HERO, ocho `it` y doce casos, en el commit A. Mutaciones m1 a m5.
- `enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)` de GUARD R17, en el commit B. Mutaciones m2 (ii), m4, m5 y m6.
- `la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas` de GUARD R20, en el commit D. Mutaciones r1 a r6, plantadas a la vez en la carta y en el bloque 1 de `design.md`.

Nacen en verde: los dos casos de `mantiene referencias y suelos en %s` (modelo puro; los pone en rojo m7) y los `it` simbolicos de HERO que comparan contra la constante.

## 6. Que cambia en cada fichero

Solo markdown; nada en `mobile-pet-tracker/`, `backend-pet-tracker/` ni `docs/`.

- `specs/mobile-home-photo-hero-canvas/requirements.md`: decision D6 y nota en D4; R1, R3, R17, R18, R20 y R21 con las medidas nuevas; subseccion «Candados de medida y de paradas (Enmienda A4)» con la fila 14 (14a a 14h); tres filas en Desviaciones; viñeta de Fuera de alcance (nombre a dos lineas); casilla `Enmienda A4 de #195` SIN marcar en Aprobacion y su parrafo A4. A1, A2 y A3 siguen `[x]`; la linea «Firma del gate» no se toca.
- `specs/mobile-home-photo-hero-canvas/design.md`: hechos medidos H4, seccion final «Texto de la Enmienda A4 de #195» (sin bloque Markdown, para no romper la cuenta de dos bloques de R20), y los ajustes de alto nivel.
- `specs/mobile-home-photo-hero-canvas/tasks.md`: seccion «Enmienda A4: cadena de commits» (A a E, siete mutaciones m1 a m7), 18 filas «A4» en Cuentas a re-medir, y los bloques R1, R3, R17, R18, R20 y R21 ajustados. R19 sin tocar.
- `specs/mobile-home-photo-hero-canvas/traceability.md`: columnas de test y commit de R1, R2, R3, R17, R18 y R20 con «Enmienda A4 ... pendiente», y un parrafo de cierre. Los hashes historicos no se tocan.
- `progress/spec_amend4_mobile-home-photo-hero-canvas.md`: este informe.

## 7. Dudas abiertas

1. **Paradas mas densas que la vista previa.** Las `24 %` / `44 %` dan alfa 0,85 en d=56 (la vista del humano, proporcional, daba 0,50) y cobertura media 0,680 frente a 0,565. Es el precio de cumplir R17 sin relajar suelos. Decision del humano al firmar A4: si prefiere ver la foto menos tapada, tendria que aceptar un suelo menor para el nombre (R17 se enmienda) o una altura de degradado mayor; con 100 px y suelos intactos, las paradas medidas que cumplen son estas (no se ha buscado el minimo).
2. **Velo superior de 90 px.** La fila superior sobrepasa el velo desde `insets.top` ~35; el alfa en su centro baja de 0,216 a 0,089 con `insets.top` 40 y a 0,000 con 59. R17 no mide el velo superior; el efecto se mira en el humo de R21. No se propone parada nueva.
3. **Nombre a dos lineas.** Con 100 px el contraste de la primera linea cae a 1,06 / 1,38 (con 160 px era 3,46 / 3,35, ya bajo 4,5). Preexistente y A4 lo empeora. Se deja en Fuera de alcance; `numberOfLines={1}` es decision del humano o del leader, no se ha cerrado aqui.
4. **Acoplamiento.** `PET_HERO_FADE_HEIGHT` y las dos paradas no son independientes: cambiar uno obliga a recalcular el modelo. Lo cierra el `it` de enlace de R17, que lee el texto de produccion.
5. **Geometria del pie sin candado Jest.** Los 90 px de la columna y el margen de 10 px no se miden en Jest (no hay layout). Los candados indirectos son R6 (clases del pie) y R21 (humo del humano).
6. **Quien teclea el commit E.** Edita a la vez la carta y el bloque 1 de `design.md`. Lo puede escribir el implementer o el propio leader (que edita `docs/` y `specs/`). Lo decide el handoff. Tiene que ser un solo commit.
7. **Canvas.** El artboard del canvas sigue en 330/160/130; A4 lo declara divergencia deliberada. Lo actualiza el leader por separado.
8. **Detalles menores.** `PET_HERO_FADE_HEIGHT = 160` no lleva `;` en produccion (inocuo); la mutacion de R19 usa `h-[330px]` como clase arbitraria y no se toca.
