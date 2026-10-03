---
feature: "mobile-home-bell-icon-source-lock-unbounded"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Requisitos — [[mobile-home-bell-icon-source-lock-unbounded]] (#124)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para la decisión y la medición que la sostiene, [[tasks]] para
> el orden TDD, los literales y las sondas, y [[traceability]] para el cierre.
>
> Origen: el hallazgo **(F)** de #121
> (`specs/mobile-home-bell-source-lock-unbounded/requirements.md` §Fuera de
> alcance, «El icono tiene la misma forma de candado, latente»). Los moldes son
> #121 y #122, mergeadas y aprobadas.
>
> **Esta feature no toca producción.** El trabajo vive en
> `mobile-pet-tracker/src/screens/home/index.test.tsx` y en
> `docs/conventions.md`.
>
> **Base medida: `b1469b84`**, que es `origin/main` = `2da66b86` (merge de
> #122) más `progress/current.md`. El código de la app es el mismo. **Los
> números de línea no son anclas**: todo se localiza con los `grep` que se
> citan.

## Contexto mínimo para implementar sin más contexto

La campana de la Home es un `Pressable` con `testID="home-alerts-bell"` en
`mobile-pet-tracker/src/screens/home/index.tsx`
(`grep -n 'testID="home-alerts-bell"'`). Su **primer hijo** es el icono
`<Bell size={24} color={muted} />`, donde `muted` sale de
`useThemeColors([... 'muted' ...])` (`src/theme/use-theme-colors.ts`).

En `mobile-pet-tracker/src/screens/home/index.test.tsx`, dentro de
`describe('#78 R10: la campana vive en el hero y lleva al centro de alertas')`,
el `it` que devuelve `grep -n "usa la ruta real sin cast Href"` (el candado de
fuente de la campana, título completo
`'#121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura, con ancla única (#122 R1)'`)
termina con:

```ts
expect(source).toContain('<Bell size={24} color={muted} />');
```

Esa línea asevera contra **todo** `index.tsx`. Hoy funciona porque la cadena
aparece una sola vez, pero cualquier otra copia en el fichero le da el verde:
con el icono de la campana en `color={accent}` y un
`{false && <Bell size={24} color={muted} />}` detrás de la campana, el fichero
de test da **142/142 en verde** (sonda **B2**). El árbol tampoco lo ve:
`compone el selector y la campana como dos hijos en ese orden` solo comprueba
`expect(icon.props.color).toBeDefined()`.

Esto pasa porque, sin espía, `useThemeColors` resuelve todos los tokens al
mismo color de respaldo. El propio fichero ya usa cinco veces el remedio:
`jest.spyOn(Uniwind, 'getCSSVariable').mockImplementation((token) => token)`.
Con él, cada token se pinta con el nombre de su variable: `muted` sale como
`'--color-muted'` y `accent-strong` como `'--color-accent-strong'`.

Esta feature añade un **candado de árbol** con ese espía, que asevera el color
del icono **dentro de la campana** contra un literal del test y en los dos
estados de la campana (R1). La línea de fuente **se queda tal cual**, porque ve
dos mutaciones que el árbol no ve ([[design]] §Decisión).

## Premisas de la entrada, verificadas contra el árbol

| Premisa (`feature_list.json`, #124, y el encargo del `leader`) | Veredicto | Evidencia |
|---|---|---|
| El `it` se titula ahora `#121 R1: … con ancla única (#122 R1)` y lleva la línea de unicidad de #122 | **cierta** | `grep -n "usa la ruta real sin cast Href"` da 1; la línea `expect(source.lastIndexOf('testID="home-alerts-bell"')).toBe(anchor);` va antes de la receta |
| #122 R2 añadió un `it` aparte que pulsa la campana | **cierta** | `'#122 R2: la campana baja a opacidad 0.8 mientras se pulsa'`, justo después del candado |
| `<Bell size={24} color={muted} />` aparece una sola vez en `index.tsx` | **cierta** | `grep -c` da 1; `grep -c 'color={muted} />'` da 6 (los otros cinco son iconos de otras celdas) |
| B1 (el icono de la campana en `color={accent}`) cae en rojo | **cierta** | 141/142: cae solo el candado, por `toContain` |
| B2 (B1 más la copia detrás de la campana) da verde | **cierta** | **142/142** en `b1469b84`. La entrada decía 140/140 sobre `f44cf3d5`; #122 añadió dos tests al fichero |
| El árbol no lo tapa: `compone el selector y la campana…` solo mira `toBeDefined` | **cierta** | y ningún otro test del fichero lee el color del icono de la campana |
| El recorte de `<` a `<` no vale tal cual, porque el icono es hijo y no tag de apertura | **cierta** | su versión más cercana, acotar al primer hijo por posición (opción **a**), sigue verde ante seis sondas ([[design]] §La medición completa) |
| Blobs de base: `index.tsx` `dbb5b034`, `index.test.tsx` `60c0c013` | **ciertas** | `git hash-object` en `b1469b84` |
| Suite de base 83 suites / 1494 tests | **cierta** | medida en `b1469b84` sin pipe: 83 / 1494 / 1 snapshot, `exit=0`; `tsc` 0 y `lint` 0 |

## Requisitos funcionales

- **R1**: WHEN la Home se renderiza con los mocks de
  `describe('#78 R10: la campana vive en el hero y lleva al centro de alertas')`
  y `Uniwind.getCSSVariable` espiado para que devuelva su argumento, THE
  SYSTEM SHALL pintar el icono `icon-bell` que vive **dentro** de
  `home-alerts-bell` con color `'--color-muted'`, aseverado con
  `expect(within(bell).getByTestId('icon-bell').props.color).toBe('--color-muted')`.
  Lo SHALL comprobar en los **dos** estados de la campana:

  | `it` | Estado | Cómo se monta |
  |---|---|---|
  | `'sin alertas abiertas'` | `hasOpenAlerts` falso | el `mockListAlerts` por defecto del `beforeEach` de nivel superior (`items: []`) |
  | `'con alertas abiertas'` | `hasOpenAlerts` verdadero | `mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null })`, y se espera `home-alerts-dot` dentro de la campana antes de aseverar |

  Los dos `it` SHALL vivir en un `describe` anidado nuevo,
  `'#124 R1: el icono de la campana se pinta con la tinta muted'`, colocado
  dentro de `#78 R10` **justo después** del `it` `#122 R2` y **justo antes** de
  `it('no pinta campana cuando no hay mascotas')`. El espía SHALL ir en su
  `beforeEach` y restaurarse en su `afterEach` con `jest.restoreAllMocks()`. El
  valor esperado SHALL ser el literal `'--color-muted'` escrito en el test,
  nunca un valor calculado con `useThemeColors` ni con otro símbolo de
  producción.

  El resto del fichero SHALL quedar **idéntico byte a byte**. En particular, el
  `it` `#121 R1` conserva su título, su ancla, su recorte y sus cinco
  aserciones (ruta `/alerts`, cast `Href`, unicidad del ancla, receta acotada e
  icono contra el fichero entero), en su orden. La única excepción es el
  comentario de R3.

- **R2**: WHEN la producción se muta a cualquiera de las sondas de [[tasks]]
  §R2, THE SYSTEM SHALL dar el veredicto de su columna «Exigido». En resumen:

  1. **Se cierran** (hoy en verde, ahora en rojo): **B2, B2p, B2f, B2i, B2j,
     B2c, B2t, B2s y B3** caen por los dos `it` de R1. **B4 y B4r** caen solo
     por `'con alertas abiertas'`.
  2. **Siguen en rojo, con un cambio declarado**: **B1** cae por `toContain`,
     como hoy, y además por los dos `it` de R1. **T1** cae por
     `dibuja un estado vacío con forma de fila cuando no hay vacuna`, como hoy,
     y además por los dos `it` de R1.
  3. **Siguen en rojo, sin cambios**: **B5, B6, F1 y F3** caen solo por
     `toContain`, con los dos `it` de R1 en verde.
  4. **Siguen en verde**: **F2**, que mueve el icono detrás del punto, sigue
     en verde. Es correcto, porque el icono sigue en muted. **W2** también
     sigue en verde: es el mismo agujero en otro candado, y queda fuera de
     alcance.
  5. **Límite que queda, documentado**: **B5d** y **B6d** siguen en verde en
     todo el fichero ([[design]] §El residuo).

- **R3**: WHEN un lector abra el candado de fuente de la campana o
  `docs/conventions.md` §«Recortes del tag de apertura en candados de fuente»,
  THE SYSTEM SHALL explicarle, **anclado por contenido**, por qué el icono se
  asevera en el árbol:
  1. el comentario literal de [[tasks]] §R3 (1), de cuatro líneas, justo
     encima de `expect(source).toContain('<Bell size={24} color={muted} />');`
     y sin tocar esa línea;
  2. el párrafo literal de [[tasks]] §R3 (2), insertado en esa sección de
     `docs/conventions.md` entre el párrafo que termina en «como arriba.» y el
     encabezado `### Esperas sobre el árbol renderizado`. No se toca nada más
     de la sección.

- **R4**: WHEN la feature llegue al PR, THE SYSTEM SHALL dejar el diff de
  producción **vacío**:
  `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
  SHALL salir con 0. Mientras la base siga siendo `2da66b86`, el blob en
  `HEAD` SHALL ser `dbb5b0346895cfc26705bee2257d1f8a8815df6c`, y el del commit
  rojo el de [[tasks]] §R4. IF algún requisito pareciera necesitar tocar
  producción de forma permanente, THEN el implementador SHALL parar y devolver
  el trabajo.

  Esto **no** contradice R1: su par versiona la mutación B2 en el commit rojo
  y la revierte en el verde (C4, quinto punto). El diff **acumulado** es vacío.

## Qué firma el humano al aprobar esta spec

1. **La opción (b)**: el color del icono se asevera en el **árbol** (R1), y la
   línea de fuente `toContain` **se queda byte a byte**. Se descartan
   **(a)**, acotar la línea de fuente al primer hijo por posición, porque
   sigue verde ante B2f, B2j, B2t, B2s, B3 y B4r, y **(c)**, aceptar el
   agujero por escrito sin defensa, porque (b) lo cierra sin ningún rojo falso
   nuevo ([[design]] §Decisión).
2. **Dos estados y no uno.** Con solo `'sin alertas abiertas'`, B4 (el icono
   cambia de tinta cuando hay alertas) seguiría en verde. Cuesta un `it` más.
3. **El residuo se acepta como límite documentado.** B5d y B6d siguen en
   verde. Cada una necesita una copia señuelo del icono **y además** una
   segunda mutación rara: una rama por plataforma, o el nombre de la variable
   CSS escrito a mano. **Decisión del humano**: si prefiere cerrarlo, puede
   pedir **(a) además de (b)**. Eso cierra B5d y B6d, pero añade un rojo falso
   (F2: mover el icono detrás del punto, con la campana sana) y un mensaje de
   fallo numérico (`Expected: 10512 / Received: 10819`). En ese caso la spec se
   enmienda antes del handoff con el literal de [[design]] §Alternativas.
4. **La mutación versionada es B2.** El commit rojo toca un solo fichero de
   producción, `src/screens/home/index.tsx`, y el verde lo revierte con
   `git checkout HEAD~1 --`.
5. **El delta de tests es +0 suites y +2 tests.** `index.test.tsx` pasa de 142
   a 144 y la suite móvil, de 83 / 1494 a 83 / 1496, sobre esta base.
6. **El cambio declarado de T1 se acepta**: ya era rojo y sigue rojo, con dos
   tests más en rojo.
7. **El párrafo de `docs/conventions.md` es el literal de [[tasks]] §R3 (2).**
8. **La feature no lleva prueba de humo en dev build de Android**, porque el
   diff de producción es vacío.
9. **R3 y R4 no tienen test propio**: R3 es documentación y R4 es una
   propiedad del diff. Los cierra el `reviewer` por inspección. Queda
   declarado aquí antes del handoff, como pide C4.

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo que se registra para otra feature y **(N)** premisa
verificada y descartada.

- **(D)** No se tocan el título, el ancla, el recorte ni las aserciones del
  `it` `#121 R1`: ruta `/alerts`, cast `Href`, unicidad del ancla, receta
  acotada y la propia línea del icono. Solo gana el comentario de R3.
- **(D)** No se toca `compone el selector y la campana como dos hijos en ese
  orden`. Su `toBeDefined` sigue valiendo para lo que mira, la composición del
  hero sin espía. El color lo mira ahora R1.
- **(D)** No se toca el `it` `#122 R2` ni `no pinta campana cuando no hay
  mascotas`. R1 va entre los dos.
- **(D)** No se extrae ningún helper: son dos `it` de cuatro líneas en un solo
  fichero, y el espía se escribe igual que en los cinco sitios donde el
  fichero ya lo usa.
- **(D)** No se añade ninguna clave de copy: no se tocan
  `src/i18n/catalog.ts` ni `src/providers/__tests__/language-provider.test.tsx`,
  ni su candado de longitud del catálogo.
- **(D)** No se instala ninguna dependencia. `jest.spyOn`, `within` y
  `Uniwind` ya están importados o son globales en el fichero.
- **(D)** El residuo B5d/B6d queda documentado y sin defensa (punto 3 de la
  firma).
- **(F)** **`#69 R9: usa iconos de reicon y ningún emoji` tiene el mismo
  agujero, latente.** Cuenta
  `/<(?:Weight|Walk|Moon|Map) size=\{20\} color=\{muted\} \/>/g` sobre **todo**
  `index.tsx` con `toHaveLength(4)`. Sonda **W2**: el icono de peso en
  `color={accent}` más `{false && <Weight size={20} color={muted} />}` al lado
  deja el fichero en **142/142 en verde**, hoy y con R1. Tampoco lo ve el
  árbol: `asigna cada valor, icono y etiqueta a su celda y a ninguna otra` solo
  comprueba `toBeVisible`. El `leader` decide si lo registra con id contra
  `origin/main`. Aquí no se toca.
- **(N)** *«#122 ya cerró B1 y B2.»* **Falso**: #122 cerró la receta de
  pulsado, no el icono. B2 da 142/142 en verde en `b1469b84`.
- **(N)** *«El árbol no puede distinguir el color, por eso `compone…` usa
  `toBeDefined`.»* **Falso con espía**: con `getCSSVariable` devolviendo su
  argumento, `muted` y `accent-strong` salen distintos. El fichero ya lo
  asevera así dos veces (`grep -n "toBe('--color-muted')"`).
- **(N)** *«La sesión Backend (#125) toca estos ficheros.»* **Falso**: trabaja
  en `wt-backend` sobre `add-reminder` y el backend. Su
  `git diff --name-only origin/main...HEAD` (en `8f54d540`) no incluye
  `src/screens/home/*`, `docs/conventions.md`, el catálogo ni
  `language-provider.test.tsx`. Solo comparte los ficheros del harness
  ([[design]] §Coordinación).

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-25) ← gate obligatorio antes de
      implementar. Al marcar esta casilla el humano firma también los nueve
      puntos de §Qué firma el humano al aprobar esta spec.

> **Esta es la única casilla de la feature.** No hay gate humano en teléfono:
> sin diff de producción no hay prueba de humo que firmar (punto 8). El cierre
> lo dan el veredicto del `reviewer` y esta casilla.
