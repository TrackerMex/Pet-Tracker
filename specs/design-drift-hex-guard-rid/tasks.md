---
feature: "design-drift-hex-guard-rid"
status: approved       # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Tareas — [[design-drift-hex-guard-rid]] (#108)

> Disciplina TDD: **(1) test rojo → (2) implementación mínima → (3) refactor**,
> requisito por requisito. Cada tarea corresponde a un R de [[requirements]].
> Commits **test-primero**: el rojo se versiona en su propio commit
> (CHECKPOINTS C4). Ningún commit rojo puede fallar por `ReferenceError` de un
> símbolo que aún no existe, ni por mutar un doble de test.
> Rutas relativas a `mobile-pet-tracker/` salvo donde se indique.

## Antes de empezar

- [ ] `git log -1` → confirmar branch `feature/108-design-drift-hex-guard-rid`
      con base `7ce87d70`. Si hubo rebase, **no** se reapuntan hashes después de
      rellenar [[traceability]]
- [ ] `rm -f mobile-pet-tracker/.expo/types/router.d.ts` (gitignorado; sus rutas
      fantasma rompen `bunx tsc --noEmit`)
- [ ] **No lanzar `./init.sh`**: #108 no toca `backend-pet-tracker/`. Se mide con
      `bunx jest` y `bunx tsc --noEmit` desde `mobile-pet-tracker/`, **sin pipe**
      (`cmd > fichero; echo $?`)
- [ ] Cargar la skill `expo:expo-overview` (obligatorio por C8). Su mapa no
      enruta a ninguna leaf para este trabajo: no hay UI, navegación, motion ni
      dependencias. Queda registrado en [[requirements]] §Premisas verificadas
- [ ] Leer [[design]] §2 y §4 **antes** de tocar el regex: las dos decisiones
      que parecen abiertas (unificar las formas largas; dónde va la exclusión)
      están cerradas y medidas
- [ ] Medir el baseline propio antes del primer commit: `bunx jest` completo,
      sin pipe. Debe dar `Test Suites: 77 passed` y `Tests: 1396 passed`. Si no
      da, para y avisa

## Orden y por qué es ese (candado del sujeto ausente)

Ningún test asevera un símbolo o un contenido que su propio orden no haya
dejado ya en el árbol:

| # | R | Sujeto que asevera | ¿Existe cuando se asevera? |
|---|---|---|---|
| 1 | **R1** | el **fuente** de `design-drift.test.ts`, leído con `readFileSync` | Sí: el fichero existe desde siempre. Lo que no existe es la forma extraída, y ese es el rojo (conteos 8 y 2 contra el 1 esperado) |
| 2 | **R2** | las tres constantes compuestas `FEATURE_STYLE_ESCAPES`, `PAIRING_STYLE_ESCAPES`, `MEALS_BAR_STYLE_ESCAPES` | Sí, **porque R1 ya las declaró**. Al revés sería un `ReferenceError`, y C4 lo rechaza como rojo |
| 3 | **R3** | el **fuente** de `screens/home/index.test.tsx` | Sí: el fichero existe y hoy tiene los literales partidos. Ese es el rojo |
| 4 | **R4** | el **fuente** de `docs/conventions.md`, sección §Prefijo | Sí: la sección existe desde antes de #108; lo que falta es el párrafo, y ese es el rojo |

**La restricción dura del orden es R2 antes que R3.** Medido: revertir los dos
literales con el regex viejo pone en rojo los cinco guards que listan
`screens/home/index.test.tsx` (`:220, :260, :279, :301, :322`). Ese rojo sería
del guard, no del candado de R3, y falsearía el historial. Con R2 ya verde, la
reversión entra limpia.

R1 va antes que R2 porque R2 necesita los símbolos que R1 crea. R4 va al final
porque no lo necesita nadie.

## C4: vía (b), verificación

#108 **no añade comportamiento de producción**: ni una línea que llegue al
dispositivo. Aplica la **vía (b)** de CHECKPOINTS C4. Aun así, los cuatro
requisitos tienen **rojo natural por aserción** —ninguno necesita mutación para
producirlo— porque los cuatro aseveran sobre contenido de ficheros que ya
existen. El mínimo exigido (un rojo por cada mitad: el regex y la reversión)
queda cubierto con holgura: son **cuatro** pares rojo → verde.

Ningún rojo puede fallar por sintaxis, por un módulo que no resuelve ni por un
símbolo ausente. Si un rojo falla por otra cosa que por su `expect`, no vale:
arréglalo antes de commitear.

---

## R1 — el átomo roto vive en un solo sitio

- [ ] **(1) Test rojo.** Añadir a `src/__tests__/design-drift.test.ts` el
      describe `#108 R1: los patrones compartidos se declaran una sola vez`: un
      `it.each` de dos filas (aguja del átomo hex, aguja de la lista de sombra)
      que lee el fuente del propio fichero con
      `readFileSync(join(sourceRoot, '__tests__', 'design-drift.test.ts'), 'utf8')`,
      cuenta las ocurrencias de su aguja y espera **1**. Las agujas se
      construyen por concatenación (`['[\\d', 'a-f]{3,8}'].join('')` y
      `['shadowColor|shadowOffset', '|shadowOpacity|shadowRadius'].join('')`),
      idioma que el fichero ya usa en `:69`, `:96` y `:428`, para que el literal
      buscado no aparezca entero en la línea que lo busca.
      **Rojo esperado**: `8` y `2` contra `1`. Dos tests rojos.
      Commit: `test(mobile): contar el atomo hex del guard de deriva (R1)`
- [ ] **(2) Implementación mínima.** Declarar `HEX_LITERAL` (todavía con el
      valor **viejo**, `String.raw` con `#[\da-f]{3,8}\b`), `ARBITRARY_CLASS` y
      `SHADOW_ESCAPES`; componer `FEATURE_STYLE_ESCAPES`,
      `PAIRING_STYLE_ESCAPES` y `MEALS_BAR_STYLE_ESCAPES` tal como los escribe
      [[requirements]] R1; sustituir los ocho regex inline por la forma que le
      toca a cada uno (`:117, :220, :260, :279, :301, :322` → la corta; `:197` →
      pairing; `:343` → meals bar). **Extracción sin cambio de conducta**: la
      suite sigue en 77 suites, y en 1396 + 2 tests.
      Commit: `refactor(mobile): extraer los patrones del guard de deriva (R1)`
- [ ] **(3) Refactor con tests verdes.** Comprobar que ninguna de las tres
      formas lleva flag `g`, que `sourceFiles()` (`:25-35`) no se tocó y que
      `:63` sigue con su literal. `bunx tsc --noEmit` en 0.

## R2 — el guard distingue una cita de requisito de un color

- [ ] **(1) Test rojo.** Añadir el describe
      `#108 R2: el guard de estilo distingue un R-id de un color hex`: un
      `it.each` con las **ocho** filas F1–F8 de [[requirements]] R2, cada una
      aseverando su valor esperado contra las **tres** formas compuestas (tres
      `expect` por fila). Los esperados van **literales** en la tabla, nunca
      derivados de `HEX_LITERAL`.
      **Rojo esperado**: solo **F1** falla (`expect(true).toBe(false)`, tres
      veces); F2–F8 ya están verdes. Ocho tests, uno rojo.
      Commit: `test(mobile): frontera entre R-id y color hex en el guard (R2)`
- [ ] **(2) Implementación mínima.** Añadir la lookahead negativa a
      `HEX_LITERAL`, que queda en
      ``String.raw`#(?!\d{2,3} R\d)[\da-f]{3,8}\b` ``. Un solo cambio, en una
      sola constante. Nada más.
      Commit: `fix(mobile): el guard de hex ignora las citas de R-id (R2)`
- [ ] **(3) Refactor con tests verdes.** Correr la suite móvil completa, sin
      pipe. Ningún describe preexistente puede haber dejado de correr: 77 suites
      y 1396 + 10 tests.

## R3 — los títulos de #106 vuelven a ser literales enteros

> **No empezar hasta que R2 esté verde.** Con el regex viejo, esta reversión
> pone en rojo cinco guards ajenos y el historial deja de contar la verdad.

- [ ] **(1) Test rojo.** Añadir el describe
      `#108 R3: los títulos de #106 vuelven a ser literales enteros`: un
      `it.each` de dos filas que asevera que el fuente de
      `screens/home/index.test.tsx` contiene
      `describe('#106 R2: la barra de comidas transiciona su ancho'` y
      `describe('#106 R3: reduce motion deja la barra sin animación'`, más un
      tercer `it` que asevera que **no** contiene `'#' + '106`.
      **Rojo esperado**: los tres, por aserción. Tres tests rojos.
      Commit: `test(mobile): exigir los titulos enteros de #106 (R3)`
- [ ] **(2) Implementación mínima.** Deshacer la concatenación en
      `src/screens/home/index.test.tsx`, localizadas con `grep -n "'#' + '"` y **nunca por número de línea**, exactamente las dos
      líneas de la tabla de [[requirements]] R3. **Diff de dos líneas**: no se
      toca el cuerpo de los describes, ni los otros títulos, ni el orden.
      Commit: `refactor(mobile): devolver los titulos de #106 a un literal (R3)`
- [ ] **(3) Refactor con tests verdes.** Verificar a mano que los cinco guards
      que listan `screens/home/index.test.tsx` siguen verdes —son la prueba de
      que R2 hizo su trabajo— y que `grep -rn '#106 R2' mobile-pet-tracker/src/`
      ya no da falso negativo.

## R4 — la convención de cita queda escrita donde vive la convención

- [ ] **(1) Test rojo.** Añadir el describe
      `#108 R4: la convención de cita del guard está documentada`: un `it` que
      lee `docs/conventions.md` con
      `readFileSync(join(projectRoot, '..', 'docs', 'conventions.md'), 'utf8')`
      —mismo idioma que `#68 E1` usa con la carta en `:354-358`—, recorta la
      sección entre `### Prefijo de feature cuando un fichero acumula R-ids de
      dos specs` y el siguiente `### `, y asevera que el recorte contiene
      `design-drift.test.ts` y `` `#108 R1` ``.
      **Rojo esperado**: hoy `design-drift.test.ts` aparece **0** veces en ese
      fichero. Un test rojo.
      Commit: `test(mobile): exigir la convencion de cita documentada (R4)`
- [ ] **(2) Implementación mínima.** Añadir a `docs/conventions.md` el párrafo
      literal de [[requirements]] R4, al final de §Prefijo y antes de
      `### Filtros de jest con rutas que llevan paréntesis`.
      Commit: `docs(conventions): el prefijo #id R<n> es contrato del guard (R4)`
- [ ] **(3) Refactor con tests verdes.** Releer el párrafo en contexto: tiene
      que leerse como continuación de la sección, no como un apéndice.

---

## Al terminar

- [ ] Suite móvil completa, **sin pipe**, desde `mobile-pet-tracker/`:
      `bunx jest > /tmp/jest-108.txt; echo $?` → 0. Debe decir
      `Test Suites: 77 passed` y `Tests: 1410 passed` (1396 + 14)
- [ ] `bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts' > /tmp/drift-108.txt; echo $?`
      → 0, con **55 tests en 21 describes** (41 + 14, 17 + 4)
- [ ] `bunx tsc --noEmit` → 0
- [ ] **Sonda de mutación** (evidencia al reporte, no al repo): quitar la
      lookahead de `HEX_LITERAL` y comprobar que **F1 de R2 se pone roja por su
      aserción**; devolver la lookahead. Después, cambiar el `1` esperado de R1
      por un `2` y comprobar que R1 se pone rojo. Ninguna de las dos mutaciones
      se commitea
- [ ] Rellenar [[traceability]] con los hashes rojo y verde de cada R. **No
      rebasear después**: los hashes dejarían de ser ancestros
- [ ] Escribir `progress/impl_design-drift-hex-guard-rid.md` con: los cuatro
      recuentos del gate numérico medidos, la salida de la sonda de mutación, y
      cualquier premisa de [[requirements]] §Premisas verificadas que no haya
      cuadrado contra el árbol
- [ ] **No marcar la feature `done`**: eso lo hace el `leader` con el veredicto
      del `reviewer` en la mano
