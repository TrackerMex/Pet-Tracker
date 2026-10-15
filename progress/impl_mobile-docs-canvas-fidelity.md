# Implementación de #175 — mobile-docs-canvas-fidelity

Estado actual: R1–R10 implementados y verificados; S1–S5 conformes según la Nota 13. BASE25 = 1307; ALL = 3444 en 110 suites; typecheck y lint limpios. R11 pendiente (humano). Los commits documentales y K5 se ejecutan después de guardar este informe; su resultado final se comunica al cerrar la sesión.

## H0 y B0–B1

H0: `d38e27877ecfb2bde97c8e3fa73e81dde6c7fa75`.

B0 estado (salida literal; sin salida de status):

```text
/home/claude/sites/Pet-Tracker-wt-175/mobile-pet-tracker
feature/175-mobile-docs-canvas-fidelity
d38e27877ecfb2bde97c8e3fa73e81dde6c7fa75
```

Ancestros `dea11875` y `01718048`: `exit=0`.
Ausencia de `.expo/types/router.d.ts`: `exit=0`.

B1 BASE25:

```text
exit=0
Tests:       1252 passed, 1252 total
```

B1 typecheck y lint:

```text
$ tsc --noEmit
exit=0
```

## Anclas H0

Las 50 anclas coinciden. Comandos ejecutados desde `mobile-pet-tracker/`.

| Nº | Comando | Esperado | Medido |
|---|---|---|---|
| 1 | test -e node_modules/.bin/prettier; echo $? | 1 | 1 |
| 2 | test -e ../.agents/skills/appllama-app-design-skill/SKILL.md; echo $? | 0 | 0 |
| 3 | test -e ../.agents/skills/animate-expo/SKILL.md; echo $? | 0 | 0 |
| 4 | test -e node_modules/reicon-react-native/package.json; echo $? | 0 | 0 |
| 5 | test ! -e .expo/types/router.d.ts; echo $? | 0 | 0 |
| 6 | git merge-base --is-ancestor dea11875 HEAD; echo $? | 0 | 0 |
| 7 | git merge-base --is-ancestor 01718048 HEAD; echo $? | 0 | 0 |
| 8 | grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css | 1 | 1 |
| 9 | grep -cF -- '--text-13: 13px;' src/theme/global.css | 1 | 1 |
| 10 | grep -cF -- '--text-26: 26px;' src/theme/global.css | 1 | 1 |
| 11 | grep -cF -- '--radius-tile: 18px;' src/theme/global.css | 1 | 1 |
| 12 | grep -cF -- '--text-2xs: 10px;' src/theme/global.css | 1 | 1 |
| 13 | grep -cF -- '--text-15: 15px;' src/theme/global.css | 1 | 1 |
| 14 | grep -cE -- '^  --(text-11: 11px\|radius-24: 24px\|tracking-title: -0.02em\|tracking-eyebrow: 0.08em);$' src/theme/global.css | 0 | 0 |
| 15 | grep -cF "surface: 'rounded-card border border-border bg-surface p-4 shadow-sm'," src/components/card.tsx | 1 | 1 |
| 16 | grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' ../docs/conventions.md | 1 | 1 |
| 17 | grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' ../docs/ui-guidelines.md | 1 | 1 |
| 18 | grep -cF '## Enmienda de fidelidad al canvas' ../docs/ui-guidelines.md | 0 | 0 |
| 19 | grep -E '^## ' ../docs/ui-guidelines.md \| tail -1 | ## Enmienda #173 — Perfil fiel al canvas | ## Enmienda #173 — Perfil fiel al canvas |
| 20 | grep -cF 'la superficie siempre acompaña a un emoji y a un texto.' ../docs/ui-guidelines.md | 1 | 1 |
| 21 | grep -cF -- '- Títulos de pantalla: header del stack cuando exista, no Text suelto.' ../docs/ui-guidelines.md | 1 | 1 |
| 22 | grep -cF '&#96;--text-13: 13px&#96;, &#96;--text-26: 26px&#96;; cada uno es token' ../docs/ui-guidelines.md | 1 | 1 |
| 23 | grep -c 'tracking-title' ../docs/ui-guidelines.md | 0 | 0 |
| 24 | grep -cE '^12\. \*\*Escala de radios\*\*' ../docs/ui-guidelines.md | 1 | 1 |
| 25 | grep -cE '^13\. \*\*Botón con cuerpo\*\*' ../docs/ui-guidelines.md | 1 | 1 |
| 26 | grep -cF '📄' src/screens/docs/index.tsx | 1 | 1 |
| 27 | grep -cF "from 'reicon-react-native'" src/screens/docs/index.tsx | 0 | 0 |
| 28 | echo "$(grep -cF -- 'padding: 24,' src/screens/docs/index.tsx)/$(grep -cF -- 'gap: 16,' src/screens/docs/index.tsx)/$(grep -cF -- 'paddingBottom: insets.bottom + 24,' src/screens/docs/index.tsx)/$(grep -cF -- 'paddingHorizontal: 20,' src/screens/docs/index.tsx)/$(grep -cF -- 'gap: 14,' src/screens/docs/index.tsx)" | 1/1/1/0/0 | 1/1/1/0/0 |
| 29 | grep -cF 'rounded-xl bg-accent border-b-4 border-black/25' src/screens/docs/index.tsx | 2 | 2 |
| 30 | grep -cE 'testID=.{1,3}doc-[^s]' src/screens/docs/index.tsx | 1 | 1 |
| 31 | grep -cF 'name="pets/[petId]/docs" options={{ ...headerOptions, title: '"'"''"'"' }}' src/app/_layout.tsx | 1 | 1 |
| 32 | grep -cF 'style={CONTINUOUS_CORNER}' src/screens/docs/index.tsx | 1 | 1 |
| 33 | echo "$(grep -cF 'tracking-widest' src/screens/docs/index.tsx)/$(grep -cF 'text-2xs' src/screens/docs/index.tsx)" | 1/9 | 1/9 |
| 34 | grep -cF "[join('screens', 'docs', 'index.tsx')]: 2," src/__tests__/consistency-classnames.test.ts | 1 | 1 |
| 35 | grep -cF 'toBe(19 + 1 + 1 - 1 - 1); // #172 R14' src/__tests__/consistency-classnames.test.ts | 2 | 2 |
| 36 | grep -cF 'border-lip-gray/g)).toBe(4 + 1 + 1); // #170 R16; #171 R14' src/__tests__/consistency-classnames.test.ts | 1 | 1 |
| 37 | echo "$(grep -cF 'toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1 + 1 - 1 - 1)' src/__tests__/consistency-classnames.test.ts)/$(grep -cF 'toBe(13 + 1 + 1 + 1 + 1 + 1 + 1 + 1 - 1 - 1)' src/__tests__/consistency-classnames.test.ts)" | 1/1 | 1/1 |
| 38 | grep -cF 'dieciocho primarios con labio' src/__tests__/consistency-classnames.test.ts | 1 | 1 |
| 39 | grep -cF "file: 'src/screens/docs/index.tsx'" src/__tests__/ui-copy-table.ts | 22 | 22 |
| 40 | grep -cF "it('resuelve las 57 ocurrencias normativas'" src/__tests__/ui-language.test.ts | 1 | 1 |
| 41 | grep -cF 'toHaveLength(35 - 1 + 2 + 1 + 16 - 4 + 8);' src/__tests__/ui-language.test.ts | 1 | 1 |
| 42 | grep -cF -- '- 4 + 3, // #173 R13' src/providers/__tests__/language-provider.test.tsx | 1 | 1 |
| 43 | grep -c '#175' src/providers/__tests__/language-provider.test.tsx | 0 | 0 |
| 44 | grep -cF "'docs." src/i18n/catalog.ts | 34 | 34 |
| 45 | grep -cE '^### §2\.29 ' ../specs/mobile-ui-language/design.md | 1 | 1 |
| 46 | grep -cE '^### §2\.30 ' ../specs/mobile-ui-language/design.md | 0 | 0 |
| 47 | grep -cE "ByText\('(Vacunación\|Consulta\|Desparasitación\|Análisis\|Otros\|Todos)'" src/screens/docs/index.test.tsx | 3 | 3 |
| 48 | grep -cE "ByText\('20[0-9]{2}-" src/screens/docs/index.test.tsx | 1 | 1 |
| 49 | grep -cF '📄' src/screens/docs/index.test.tsx | 4 | 4 |
| 50 | test "$(grep -cE '^\s*it(\.each\(\|\()' src/theme/__tests__/global-css.test.ts)" = 35 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/__tests__/design-drift.test.ts)" = 53 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/providers/__tests__/language-provider.test.tsx)" = 22 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/__tests__/consistency-classnames.test.ts)" = 35 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/__tests__/ui-language.test.ts)" = 28 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/screens/docs/index.test.tsx)" = 40 && echo its-ok | its-ok | its-ok |

## Skills cargadas

- `ponytail`: alcance mínimo y uso de patrones existentes; el handoff fija la lista cerrada y el TDD.
- `building-native-ui`: estructura Expo, scroll y esquinas continuas, con las decisiones de la spec como prioridad.
- `appllama-app-design-skill`: jerarquía, estados completos y accesibilidad; el humano verifica Android conforme a la carta.
- `animate-expo`: reutilizar `HomeEntrance` en R6 para la entrada y la adaptación a movimiento reducido.

## Commits

| c | Hash | Mensaje | R | Tipo | Tests: literal |
|---|---|---|---|---|---|
| c1 | `2dd9e208` | test(docs): dobles de entrada, iconos y colores (#175 R6) | R6 | verde (dobles, sin nuevos it) | `Tests:       1252 passed, 1252 total` |

c1: `cadena=0`; typecheck y lint limpios.

### c2 — R1 rojo

`68e595da` — `test(theme): tokens del artboard de Documentos (#175 R1)`.
`cadena=0`; sin errores TS ni lint en tests ni producción.

```text
Tests:       2 failed, 1252 passed, 1254 total
  ● #175 R1: tokens de Documentos › define los valores exactos del artboard dentro de @theme
  ● #175 R1: tokens de Documentos › declara cada token del artboard una sola vez
```

El resumen de Jest repite esas mismas dos líneas `●` al final del log.

### c3 — R1 verde

`6d6078a3` — `feat(theme): tokens del artboard de Documentos (#175 R1)`.
`cadena=0`; typecheck y lint limpios.

```text
Tests:       1254 passed, 1254 total
```


### c4 — R2 rojo

38660a0b — test(docs-charter): enmienda de fidelidad al canvas (#175 R2).
`cadena=0`; errores TS: ninguno; lint limpio.

```text
  ● #175 R2: enmienda de fidelidad al canvas › incluye una sola sección de fidelidad al canvas
  ● #175 R2: enmienda de fidelidad al canvas › conserva la casilla humana vacía o firmada bajo la sección
  ● #175 R2: enmienda de fidelidad al canvas › incluye las tres directivas literales de fidelidad
  ● #175 R2: enmienda de fidelidad al canvas › sustituye una sola vez las frases de títulos y paleta
  ● #175 R2: enmienda de fidelidad al canvas › enumera text-11 y text-15 en la línea de tamaños
  ● #175 R2: enmienda de fidelidad al canvas › enumera los dos tokens en la línea de tracking
  ● #175 R2: enmienda de fidelidad al canvas › añade rounded-24 dentro de la regla de radios
  ● #175 R2: enmienda de fidelidad al canvas › incluye una sola sección de fidelidad al canvas
  ● #175 R2: enmienda de fidelidad al canvas › conserva la casilla humana vacía o firmada bajo la sección
  ● #175 R2: enmienda de fidelidad al canvas › incluye las tres directivas literales de fidelidad
  ● #175 R2: enmienda de fidelidad al canvas › sustituye una sola vez las frases de títulos y paleta
  ● #175 R2: enmienda de fidelidad al canvas › enumera text-11 y text-15 en la línea de tamaños
  ● #175 R2: enmienda de fidelidad al canvas › enumera los dos tokens en la línea de tracking
  ● #175 R2: enmienda de fidelidad al canvas › añade rounded-24 dentro de la regla de radios
Tests:       7 failed, 1254 passed, 1261 total
```


### c5 — R2 verde

b443e578 — docs(ui-guidelines): enmienda de fidelidad al canvas (#175 R2).
`cadena=0`; typecheck y lint limpios.

```text
Tests:       1261 passed, 1261 total
```


### c6 — R3 rojo

e02c9421 — test(i18n): claves de Documentos del canvas (#175 R3).
`cadena=0`; errores TS: ninguno; lint limpio.

```text
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas
  ● #175 R3: claves de Documentos del canvas › declara los siete pares exactos y registra cada clave
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas
  ● #175 R3: claves de Documentos del canvas › declara los siete pares exactos y registra cada clave
Tests:       2 failed, 1260 passed, 1262 total
```


### c7 — R3 verde

3a1851e7 — feat(i18n): claves de Documentos del canvas (#175 R3).
`cadena=0`; typecheck y lint limpios.

```text
Tests:       1262 passed, 1262 total
```


### c8 — R4 rojo

d49bf51a — test(docs): marco y esqueleto del artboard (#175 R4).
`cadena=0`; errores TS: ninguno; lint limpio.

```text
  ● #95 R6: métricas bajo cabecera nativa › usa solo el inset inferior del dispositivo
  ● #175 R4: esqueleto del tamaño de la fila › pinta tres esqueletos de 80 px con el radio de la fila
  ● #95 R6: métricas bajo cabecera nativa › usa solo el inset inferior del dispositivo
  ● #175 R4: esqueleto del tamaño de la fila › pinta tres esqueletos de 80 px con el radio de la fila
Tests:       2 failed, 1261 passed, 1263 total
```


### c9 — R4 verde

82cb980d — feat(docs): marco y esqueleto del artboard (#175 R4).
`cadena=0`; typecheck y lint limpios.

```text
Tests:       1263 passed, 1263 total
```


### c10 — R5 rojo

0e71b8a4 — test(docs): cabecera del artboard (#175 R5).
`cadena=0`; errores TS: ninguno; lint limpio. Candado de regresión de `_layout.tsx`: verde.

```text
  ● #175 R5: cabecera del artboard › pinta una columna sin gap con eyebrow y título exactos
  ● #175 R5: cabecera del artboard › pinta una columna sin gap con eyebrow y título exactos
Tests:       1 failed, 1264 passed, 1265 total
```

### c11 — R5 verde interrumpido, SIN commit

La cadena literal extraída con el ejecutor del handoff se detuvo en `<VERDE>`:

```bash
grep -qE '^Test Suites: +25 passed, 25 total$' /tmp/175-c11.txt
```

Salida literal del ejecutor:

```text
exit=1
cadena=1
```

Salida de Jest (el resumen repite el mismo `●`):

```text
  ● #173 R2.4: inventario de tamaños nuevos › reserva text-26 al nombre de la mascota en Perfil
Test Suites: 1 failed, 24 passed, 25 total
Tests:       1 failed, 1264 passed, 1265 total
```

Fallo exacto:

```text
    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

      Array [
    +   "screens/docs/index.tsx",
        "screens/profile/index.tsx",
      ]

      52 | describe('#173 R2.4: inventario de tamaños nuevos', () => {
      53 |   it('reserva text-26 al nombre de la mascota en Perfil', () => {
    > 54 |     expect(filesMatching(/\btext-26\b/)).toEqual(['screens/profile/index.tsx']);
         |                                          ^
      55 |   });
```

Se ejecutó el diagnóstico «Flake de un it ajeno» del handoff, con el fichero
`src/__tests__/profile-canvas-fidelity.test.ts` y el título
`reserva text-26 al nombre de la mascota en Perfil`, dos veces aislado.
Salida literal (cada `1` cuenta líneas `●`):

```text
Tests:       1 failed, 25 passed, 26 total
1
Tests:       1 failed, 25 passed, 26 total
1
```

El candado falla también aislado: no es flake. En la primera ejecución no se relanzó la cadena ni se
ajustó ningún test o candado. `profile-canvas-fidelity.test.ts` está fuera de
la lista cerrada y no se tocó. El título `text-26` exigido por R5 entra en
conflicto con ese inventario heredado de #173, sin delta previsto en el handoff.

Estado al parar: HEAD `0e71b8a4` (c10); cambios de producción de c11 en el árbol,
sin staging ni commit, más este informe sin commit. c11 no llegó a typecheck/lint.
c12–c20, sondas, cierre K1–K5 y commit de trazabilidad no se ejecutaron.

## Sondas S1–S5

S1–S4 conformes, sin repetir. S5 repetida conforme a la Nota 13: un único fallo de R10 y limpio=0. La corrida anterior de S5 se conserva como histórico; salidas nuevas en «Reanudación S5».

## Candado de regresión R5

El `it` «conserva una sola cabecera nativa de Documentos con título vacío» de `_layout.tsx` es un candado de regresión: comprueba el `title: ''` que ya existe y nace verde en c10.

## Cierre K1–K5

K1–K3 completados; evidencias literales en «Reanudación S5». K4 registra la trazabilidad y este informe en los dos commits prescritos. K5 se ejecuta después del commit del informe; su resultado se comunica en el cierre de la sesión. Las paradas previas se conservan como histórico.

## Desviaciones

- Paradas previas en c11 por `#173 R2.4`, registradas abajo y resueltas por E2 firmada, sin ajustes fuera del guion.
- c18: ESLint recibió SIGKILL. Se aplicó una sola vez «Reintento», con espera literal; el segundo intento terminó `cadena=0`.
- c19: tres it ajenos de Home fallaron. Home pasó dos veces aislado (`Tests:       221 passed, 221 total`, cuenta 0 ambas). Tras la espera literal, una sola repetición de c19 terminó `cadena=0`.
- S5 inicial: se obtuvieron tres fallos donde el handoff exigía uno. Parada sin ajustes, resuelta por la Nota 13: se repitió solo S5 con el ejecutor corregido y el filtro R10. La salida nueva coincide con lo exigido; S1–S4 no se repitieron.

## Reanudación por nueva petición del usuario

Se releyeron completas las 426 líneas del handoff. El estado inicial seguía en
c10, HEAD `0e71b8a4beeba68d6b896ee13f7d2c8a53fe9406`, con la implementación de
c11 y este informe sin commit. Se retomó c11 usando el ejecutor literal del
handoff, sin modificar código ni tests.

La cadena volvió a detenerse en el mismo `<VERDE>`:

```text
exit=1
cadena=1
  ● #173 R2.4: inventario de tamaños nuevos › reserva text-26 al nombre de la mascota en Perfil
Test Suites: 1 failed, 24 passed, 25 total
Tests:       1 failed, 1264 passed, 1265 total
```

La aserción de `src/__tests__/profile-canvas-fidelity.test.ts:54` sigue esperando
solo `screens/profile/index.tsx`; recibe además `screens/docs/index.tsx`.
El fallo ya se había reproducido dos veces aislado en la ejecución anterior.
Parada obligatoria, sin ajustes de tests, nuevos commits ni pasos posteriores.

## R11

pendiente (humano).

## Reanudación E2

Leídas E2 firmada y la versión regenerada del handoff (465 líneas). No se
repitieron B0–B1 ni las anclas de H0. Se mantienen las skills ya cargadas:
`building-native-ui`, `appllama-app-design-skill` y `animate-expo`.

R1, salidas literales:

```text
e2-firmada
10/1/1/15
```

R2, salida literal:

```text
guardado
```

Parche c11 guardado en `/tmp/175-c11.patch`, con las seis líneas esperadas.
R3: aplicada exclusivamente la edición literal E2.1 al inventario `text-26`;
título del it intacto. Cadena c10b en curso.

R3/c10b: 4963cea63410c157efa538a77c3154eecad584da — test(profile): inventario de text-26 con Documentos (#175 R5).
`cadena=0`; errores TS: ninguno; lint limpio.

```text
  ● #173 R2.4: inventario de tamaños nuevos › reserva text-26 al nombre de la mascota en Perfil
  ● #175 R5: cabecera del artboard › pinta una columna sin gap con eyebrow y título exactos
  ● #173 R2.4: inventario de tamaños nuevos › reserva text-26 al nombre de la mascota en Perfil
  ● #175 R5: cabecera del artboard › pinta una columna sin gap con eyebrow y título exactos
Tests:       2 failed, 1263 passed, 1265 total
```

R4, salida literal:

```text
c11-restaurado
```

El parche original de c11 quedó reaplicado sin cambios adicionales.

### c11 — R5 verde tras E2

`a2f2ee27` — `feat(docs): cabecera del artboard (#175 R5)`.
`cadena=0`; typecheck y lint limpios.

```text
Tests:       1265 passed, 1265 total
```

### c12 — R6 rojo

681ce277 — test(docs): fila del artboard (#175 R6).
`cadena=0`; errores TS: ninguno; lint: limpio.

```text
  ● R8: pantalla Docs › shows the pet name and ordered type, name, and date rows
  ● #62 R10: el tipo de documento se lee como badge › aplica la receta monocroma al tipo sin cambiar su texto
  ● #64 R8: la fila de documento pinta icono y badge con el color de su tipo › aplica el hueco conocido y conserva neutral para texto libre
  ● #158 R3: el owner ve la acción de subir › con documentos pinta el botón, sus clases y el orden exacto
  ● #158 R5: selector y formulario de subida › ordena el error del selector con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R5: selector y formulario de subida › sitúa el formulario y oculta las entradas con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R6: validación antes de leer o crear › ordena y limpia el error con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para owner
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para family
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para walker
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para vet
  ● #175 R6: fila del artboard › compone mosaico, columna y chevron para Vacunación
  ● #175 R6: fila del artboard › compone mosaico, columna y chevron para Consulta
  ● #175 R6: fila del artboard › compone mosaico, columna y chevron para Desparasitación
  ● #175 R6: fila del artboard › compone mosaico, columna y chevron para Análisis
  ● #175 R6: fila del artboard › compone mosaico, columna y chevron para Radiografía
  ● #175 R6: fila del artboard › limita el nombre a una línea con la tipografía exacta
  ● #175 R6: fila del artboard › formatea en español fechas que cruzan mes y año
  ● #175 R6: fila del artboard › formatea en inglés fechas que cruzan mes y año
  ● #175 R6: fila del artboard › envuelve cada fila con su índice y conserva el orden del backend
  ● R8: pantalla Docs › shows the pet name and ordered type, name, and date rows
  ● #62 R10: el tipo de documento se lee como badge › aplica la receta monocroma al tipo sin cambiar su texto
  ● #64 R8: la fila de documento pinta icono y badge con el color de su tipo › aplica el hueco conocido y conserva neutral para texto libre
  ● #158 R3: el owner ve la acción de subir › con documentos pinta el botón, sus clases y el orden exacto
  ● #158 R5: selector y formulario de subida › ordena el error del selector con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R5: selector y formulario de subida › sitúa el formulario y oculta las entradas con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R6: validación antes de leer o crear › ordena y limpia el error con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para owner
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para family
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para walker
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para vet
  ● #175 R6: fila del artboard › compone mosaico, columna y chevron para Vacunación
  ● #175 R6: fila del artboard › compone mosaico, columna y chevron para Consulta
  ● #175 R6: fila del artboard › compone mosaico, columna y chevron para Desparasitación
  ● #175 R6: fila del artboard › compone mosaico, columna y chevron para Análisis
  ● #175 R6: fila del artboard › compone mosaico, columna y chevron para Radiografía
  ● #175 R6: fila del artboard › limita el nombre a una línea con la tipografía exacta
  ● #175 R6: fila del artboard › formatea en español fechas que cruzan mes y año
  ● #175 R6: fila del artboard › formatea en inglés fechas que cruzan mes y año
  ● #175 R6: fila del artboard › envuelve cada fila con su índice y conserva el orden del backend
Tests:       20 failed, 1254 passed, 1274 total
```

### c13 — R6 verde

`15470665` — `feat(docs): fila del artboard (#175 R6)`.
`cadena=0`; typecheck y lint limpios.

```text
Tests:       1274 passed, 1274 total
```

### c14 — R7 rojo

e23e66aa — test(docs): zona de subida y orden del artboard (#175 R7).
`cadena=0`; errores TS: ninguno; lint limpio.

```text
  ● #158 R3: el owner ve la acción de subir › con documentos pinta el botón, sus clases y el orden exacto
  ● #158 R5: selector y formulario de subida › ordena el error del selector con lista {"docs":[]}
  ● #158 R5: selector y formulario de subida › ordena el error del selector con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R5: selector y formulario de subida › sitúa el formulario y oculta las entradas con lista {"docs":[]}
  ● #158 R5: selector y formulario de subida › sitúa el formulario y oculta las entradas con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R6: validación antes de leer o crear › ordena y limpia el error con lista {"docs":[]}
  ● #158 R6: validación antes de leer o crear › ordena y limpia el error con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para owner
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para family
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para walker
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para vet
  ● #175 R7: zona de subida del artboard › compone el círculo, el título y la pista con sus medidas exactas
  ● #175 R7: zona de subida del artboard › conserva esquinas continuas y responde al pulsado con opacidad
  ● #65 R7: Profile resuelve su copy por clave › resuelve las 58 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
  ● #62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › deja todos los botones primarios sólidos en un único radio
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #166 R2: todo primario sólido lleva el labio detrás de bg-accent › inventaría los diecisiete primarios con labio, fichero a fichero
  ● #166 R2: todo primario sólido lleva el labio detrás de bg-accent › no deja la receta del labio fuera de un primario salvo el candado de Recuperar
  ● #166 R3: el secundario neutro lleva el labio gris › inventaría los cinco secundarios neutros de toda la app
  ● #158 R3: el owner ve la acción de subir › con documentos pinta el botón, sus clases y el orden exacto
  ● #158 R5: selector y formulario de subida › ordena el error del selector con lista {"docs":[]}
  ● #158 R5: selector y formulario de subida › ordena el error del selector con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R5: selector y formulario de subida › sitúa el formulario y oculta las entradas con lista {"docs":[]}
  ● #158 R5: selector y formulario de subida › sitúa el formulario y oculta las entradas con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R6: validación antes de leer o crear › ordena y limpia el error con lista {"docs":[]}
  ● #158 R6: validación antes de leer o crear › ordena y limpia el error con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para owner
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para family
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para walker
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para vet
  ● #175 R7: zona de subida del artboard › compone el círculo, el título y la pista con sus medidas exactas
  ● #175 R7: zona de subida del artboard › conserva esquinas continuas y responde al pulsado con opacidad
  ● #65 R7: Profile resuelve su copy por clave › resuelve las 58 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
  ● #62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › deja todos los botones primarios sólidos en un único radio
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #166 R2: todo primario sólido lleva el labio detrás de bg-accent › inventaría los diecisiete primarios con labio, fichero a fichero
  ● #166 R2: todo primario sólido lleva el labio detrás de bg-accent › no deja la receta del labio fuera de un primario salvo el candado de Recuperar
  ● #166 R3: el secundario neutro lleva el labio gris › inventaría los cinco secundarios neutros de toda la app
Tests:       20 failed, 1256 passed, 1276 total
```

### c15 — R7 verde

`8e75f554` — `feat(docs): zona de subida y orden del artboard (#175 R7)`.
`cadena=0`; typecheck y lint limpios.

```text
Tests:       1276 passed, 1276 total
```

### c16 — R8 rojo

c40f0b9b — test(docs): chips de filtro (#175 R8).
Incluye E2.2 (Δ19), sin cambiar títulos ni añadir it en Perfil.
`cadena=0`; errores TS: ninguno; lint limpio.

```text
  ● #158 R3: el owner ve la acción de subir › con documentos pinta el botón, sus clases y el orden exacto
  ● #158 R5: selector y formulario de subida › ordena el error del selector con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R5: selector y formulario de subida › sitúa el formulario y oculta las entradas con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R6: validación antes de leer o crear › ordena y limpia el error con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para owner
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para family
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para walker
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para vet
  ● #175 R8: chips de filtro › ordena las cinco categorías presentes y sus etiquetas antes de la primera entrada
  ● #175 R8: chips de filtro › omite ámbar y neutral en la lista del artboard
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de all
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de blue
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de green
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de amber
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de violet
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de neutral
  ● #65 R7: Profile resuelve su copy por clave › resuelve las 64 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
  ● #173 R2.4: inventario de tamaños nuevos › limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)
  ● #158 R3: el owner ve la acción de subir › con documentos pinta el botón, sus clases y el orden exacto
  ● #158 R5: selector y formulario de subida › ordena el error del selector con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R5: selector y formulario de subida › sitúa el formulario y oculta las entradas con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R6: validación antes de leer o crear › ordena y limpia el error con lista {"docs":[{"id":"doc-1","type":"Vacunación","name":"Antirrábica","date":"2026-07-12","downloadUrl":"http://download.test/doc-1.pdf"}]}
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para owner
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para family
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para walker
  ● #158 R10: cualquier miembro abre un documento › mantiene la lista y sitúa el error del navegador para vet
  ● #175 R8: chips de filtro › ordena las cinco categorías presentes y sus etiquetas antes de la primera entrada
  ● #175 R8: chips de filtro › omite ámbar y neutral en la lista del artboard
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de all
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de blue
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de green
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de amber
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de violet
  ● #175 R8: chips de filtro › cierra clases, objetivo táctil y pulsado de neutral
  ● #65 R7: Profile resuelve su copy por clave › resuelve las 64 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
  ● #173 R2.4: inventario de tamaños nuevos › limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)
Tests:       19 failed, 1268 passed, 1287 total
```

### c17 — R8 verde

`a5a8cfa0` — `feat(docs): chips de filtro (#175 R8)`.
`cadena=0`; typecheck y lint limpios.

```text
Tests:       1287 passed, 1287 total
```

### c18 — primer intento, reintento por carga autorizado

El rojo cumplió las guardas y typecheck no emitió errores TS. La cadena paró
antes de staging/commit en `<TSLINT-ROJO>`, en la guarda
`! grep -qF 'Failed to run' /tmp/175-lint.txt`.

```text
Tests:       15 failed, 1287 passed, 1302 total
$ tsc --noEmit
error: Failed to run "eslint" due to signal SIGKILL
cadena=1
```

Se aplica UNA vez la excepción «Reintento» del handoff: espera literal y
repetición de la cadena completa, sin ajustes de código ni de tests.

Espera de carga, salida literal:

```text
fin-espera
```

Relanzada la cadena c18 completa con el ejecutor, una sola vez, sin cambios
entre intentos.

### c18 — R9 rojo, reintento completado

90295de8 — test(docs): filtrar por categoría (#175 R9).
`cadena=0`; errores TS: ninguno; lint limpio en el segundo intento.

```text
  ● #175 R9: filtrar por categoría › filtra blue, conserva el orden y renumera las entradas
  ● #175 R9: filtrar por categoría › filtra green, conserva el orden y renumera las entradas
  ● #175 R9: filtrar por categoría › filtra amber, conserva el orden y renumera las entradas
  ● #175 R9: filtrar por categoría › filtra violet, conserva el orden y renumera las entradas
  ● #175 R9: filtrar por categoría › filtra neutral, conserva el orden y renumera las entradas
  ● #175 R9: filtrar por categoría › incluye el sinónimo vacuna en blue
  ● #175 R9: filtrar por categoría › incluye el sinónimo Vaccination en blue
  ● #175 R9: filtrar por categoría › incluye el sinónimo   VACUNACIÓN   en blue
  ● #175 R9: filtrar por categoría › incluye el sinónimo vacunacion en blue
  ● #175 R9: filtrar por categoría › incluye el sinónimo checkup en green
  ● #175 R9: filtrar por categoría › incluye el sinónimo Deworming en amber
  ● #175 R9: filtrar por categoría › incluye el sinónimo lab en violet
  ● #175 R9: filtrar por categoría › incluye Radiografía y Receta solo en Otros
  ● #175 R9: filtrar por categoría › restaura con Todos las entradas y el orden del backend
  ● #175 R9: filtrar por categoría › vuelve a Todos después de una subida correcta con Análisis seleccionado
  ● #175 R9: filtrar por categoría › filtra blue, conserva el orden y renumera las entradas
  ● #175 R9: filtrar por categoría › filtra green, conserva el orden y renumera las entradas
  ● #175 R9: filtrar por categoría › filtra amber, conserva el orden y renumera las entradas
  ● #175 R9: filtrar por categoría › filtra violet, conserva el orden y renumera las entradas
  ● #175 R9: filtrar por categoría › filtra neutral, conserva el orden y renumera las entradas
  ● #175 R9: filtrar por categoría › incluye el sinónimo vacuna en blue
  ● #175 R9: filtrar por categoría › incluye el sinónimo Vaccination en blue
  ● #175 R9: filtrar por categoría › incluye el sinónimo   VACUNACIÓN   en blue
  ● #175 R9: filtrar por categoría › incluye el sinónimo vacunacion en blue
  ● #175 R9: filtrar por categoría › incluye el sinónimo checkup en green
  ● #175 R9: filtrar por categoría › incluye el sinónimo Deworming en amber
  ● #175 R9: filtrar por categoría › incluye el sinónimo lab en violet
  ● #175 R9: filtrar por categoría › incluye Radiografía y Receta solo en Otros
  ● #175 R9: filtrar por categoría › restaura con Todos las entradas y el orden del backend
  ● #175 R9: filtrar por categoría › vuelve a Todos después de una subida correcta con Análisis seleccionado
Tests:       15 failed, 1287 passed, 1302 total
```

### c19 — primer intento, diagnóstico de it ajeno

Parada en `<VERDE>` (25 suites verdes). La suite de Documentos pasó; todos los fallos son ajenos a #175, en `src/screens/home/index.test.tsx`. Typecheck/lint de c19 aún no ejecutados.

```text
exit=1
cadena=1
  ● #98 R7: la barra de comidas y todas sus decisiones › pinta dato, icono, copy, nombre accesible, huecos, tintas y tipografía
  ● #98 R7: la barra de comidas y todas sus decisiones › calcula el ancho del relleno con served/total
  ● #106 R2: la barra de comidas transiciona su ancho › anima subida y bajada hasta el porcentaje final sin perder sus clases
  ● #98 R7: la barra de comidas y todas sus decisiones › pinta dato, icono, copy, nombre accesible, huecos, tintas y tipografía
  ● #98 R7: la barra de comidas y todas sus decisiones › calcula el ancho del relleno con served/total
  ● #106 R2: la barra de comidas transiciona su ancho › anima subida y bajada hasta el porcentaje final sin perder sus clases
Test Suites: 1 failed, 24 passed, 25 total
Tests:       3 failed, 1299 passed, 1302 total
```

Errores: `Unable to find an element with testID: reminders-none-upcoming` y `Unable to find an element with testID: reminders-meals-fill`. Se aplica el diagnóstico «Flake de un it ajeno»: fichero de Home aislado dos veces.

Diagnóstico aislado de Home (dos corridas; salida literal):

```text
Tests:       221 passed, 221 total
0
Tests:       221 passed, 221 total
0
```

Los tres it ajenos pasan con el fichero aislado (la suite entera pasó en ambas).
Flake confirmado según el handoff. Se ejecuta la espera literal y se permite
UNA repetición completa de c19, sin cambios entre intentos. El comando de
conteo devuelve exit 1 al contar cero coincidencias, tal como hace `grep -c`;
las dos líneas `Tests:` y ambas cuentas cumplen el diagnóstico.

Espera antes del reintento de c19:

```text
fin-espera
```

Relanzada la cadena c19 completa con el ejecutor literal, una sola vez.

### c19 — R9 verde, reintento completado

`88bdf16f` — `feat(docs): filtrar por categoría (#175 R9)`.
`cadena=0`; typecheck y lint limpios. La repetición se hizo una sola vez tras el flake ajeno demostrado.

```text
Tests:       1302 passed, 1302 total
```

### c20 — R10 nace verde

`12ca9dbe` — `test(design-drift): Documentos sin deriva (#175 R10)`.
`cadena=0`; typecheck y lint limpios. El rojo se verifica con S1–S5.

```text
Tests:       1307 passed, 1307 total
```

### S1

```text
Tests:       1 failed, 85 passed, 86 total
  ● #175 R10: Documentos sin deriva › no trae dependencias vetadas, useThemeColor ni emoji
limpio=0
```

### S2

```text
Tests:       1 failed, 85 passed, 86 total
  ● #175 R10: Documentos sin deriva › importa exactamente los tres iconos desde un único import de reicon
limpio=0
```

### S3

```text
Tests:       1 failed, 85 passed, 86 total
  ● #175 R10: Documentos sin deriva › usa solo los radios card, xl, full y 24
limpio=0
```

### S4

```text
Tests:       1 failed, 85 passed, 86 total
  ● #175 R10: Documentos sin deriva › no deja text-accent suelto
limpio=0
```

### S5 — parada obligatoria

Salida literal del ejecutor:

```text
Tests:       3 failed, 83 passed, 86 total
  ● C8: la UI no usa clases arbitrarias › no deja ninguna clase Tailwind con valores entre corchetes
  ● R9: mobile-pets-profile sin drift › keeps arbitrary text, hex colors, and StyleSheet out of feature sources
  ● #175 R10: Documentos sin deriva › no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas
limpio=0
```

El plantado fue correcto. La mutación del círculo a un fondo con hex y
corchetes activa dos guardas heredadas además de R10. El handoff, sección
«SONDAS», exige `Tests: 1 failed` y una sola línea `● #175 R10`; S5 no cumple
esa expectativa. No es una cadena roja/verde elegible para el diagnóstico de
flake y no hubo crash por carga. Se para sin ajustar ningún test ni candado.

La propia cadena revirtió la sonda: `limpio=0`. HEAD continúa en c20
`12ca9dbe`; los 21 commits de implementación/pruebas (c1–c20 y c10b) están
confirmados. K1–K5 no se ejecutaron; no se hicieron los commits de trazabilidad
ni del informe. R11 y la casilla de la enmienda de la carta siguen pendientes
del humano y sin marcar.

## Reanudación S5

Leídas la Nota 13 y la sección `== REANUDACION (S5) ==` del handoff corregido.
No se repitieron B0–B1, anclas, c1–c20 ni S1–S4. La evidencia de S5 anterior
se conserva como histórico. No se tocó código ni tests.

R1, salida literal:

```text
c20-limpio
```

R2, S5 repetida con el ejecutor actualizado (`-t '#175 R10'`):

```text
Tests:       1 failed, 81 skipped, 4 passed, 86 total
  ● #175 R10: Documentos sin deriva › no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas
limpio=0
```

S5 cumple el contrato corregido de un solo fallo R10 y deja el código restaurado.

R3, cierre K1–K5:

K1, salida literal:

```text
its-ok
```

K2, salida literal (25 suites verdes):

```text
exit=0
Tests:       1307 passed, 1307 total
```

K = 1307 (≥1286). Para K3, T esperado = 3389 + 1307 − 1252 = 3444.

K3, espera previa al ALL según su cadena (primera ejecución de K3):

```text
fin-espera
```

Iniciado ALL sin repetir ninguna cadena de implementación.

K3 ALL, salidas literales:

```text
exit=0
Test Suites: 110 passed, 110 total
Tests:       3444 passed, 3444 total
all-ok T=3444
```

K3 typecheck, lint y recuento de commits, salidas literales:

```text
$ tsc --noEmit
exit=0
exit=0
lint-ok
commits-ok
```

### Tabla final de commits c1–c20 y c10b

| c | Hash | Mensaje | R | Tipo | Tests: literal |
|---|---|---|---|---|---|
| c1 | `2dd9e208` | test(docs): dobles de entrada, iconos y colores (#175 R6) | R6 | verde (dobles; sin nuevos it) | `Tests:       1252 passed, 1252 total` |
| c2 | `68e595da` | test(theme): tokens del artboard de Documentos (#175 R1) | R1 | rojo | `Tests:       2 failed, 1252 passed, 1254 total` |
| c3 | `6d6078a3` | feat(theme): tokens del artboard de Documentos (#175 R1) | R1 | verde | `Tests:       1254 passed, 1254 total` |
| c4 | `38660a0b` | test(docs-charter): enmienda de fidelidad al canvas (#175 R2) | R2 | rojo | `Tests:       7 failed, 1254 passed, 1261 total` |
| c5 | `b443e578` | docs(ui-guidelines): enmienda de fidelidad al canvas (#175 R2) | R2 | verde | `Tests:       1261 passed, 1261 total` |
| c6 | `e02c9421` | test(i18n): claves de Documentos del canvas (#175 R3) | R3 | rojo | `Tests:       2 failed, 1260 passed, 1262 total` |
| c7 | `3a1851e7` | feat(i18n): claves de Documentos del canvas (#175 R3) | R3 | verde | `Tests:       1262 passed, 1262 total` |
| c8 | `d49bf51a` | test(docs): marco y esqueleto del artboard (#175 R4) | R4 | rojo | `Tests:       2 failed, 1261 passed, 1263 total` |
| c9 | `82cb980d` | feat(docs): marco y esqueleto del artboard (#175 R4) | R4 | verde | `Tests:       1263 passed, 1263 total` |
| c10 | `0e71b8a4` | test(docs): cabecera del artboard (#175 R5) | R5 | rojo | `Tests:       1 failed, 1264 passed, 1265 total` |
| c10b | `4963cea6` | test(profile): inventario de text-26 con Documentos (#175 R5) | R5 | rojo | `Tests:       2 failed, 1263 passed, 1265 total` |
| c11 | `a2f2ee27` | feat(docs): cabecera del artboard (#175 R5) | R5 | verde | `Tests:       1265 passed, 1265 total` |
| c12 | `681ce277` | test(docs): fila del artboard (#175 R6) | R6 | rojo | `Tests:       20 failed, 1254 passed, 1274 total` |
| c13 | `15470665` | feat(docs): fila del artboard (#175 R6) | R6 | verde | `Tests:       1274 passed, 1274 total` |
| c14 | `e23e66aa` | test(docs): zona de subida y orden del artboard (#175 R7) | R7 | rojo | `Tests:       20 failed, 1256 passed, 1276 total` |
| c15 | `8e75f554` | feat(docs): zona de subida y orden del artboard (#175 R7) | R7 | verde | `Tests:       1276 passed, 1276 total` |
| c16 | `c40f0b9b` | test(docs): chips de filtro (#175 R8) | R8 | rojo | `Tests:       19 failed, 1268 passed, 1287 total` |
| c17 | `a5a8cfa0` | feat(docs): chips de filtro (#175 R8) | R8 | verde | `Tests:       1287 passed, 1287 total` |
| c18 | `90295de8` | test(docs): filtrar por categoría (#175 R9) | R9 | rojo | `Tests:       15 failed, 1287 passed, 1302 total` |
| c19 | `88bdf16f` | feat(docs): filtrar por categoría (#175 R9) | R9 | verde | `Tests:       1302 passed, 1302 total` |
| c20 | `12ca9dbe` | test(design-drift): Documentos sin deriva (#175 R10) | R10 | verde (rojo por sondas) | `Tests:       1307 passed, 1307 total` |

Los detalles de `●` y errores de TS/lint de cada rojo están en sus secciones.
El it de `_layout.tsx` de c10 se conserva como candado de regresión que nace verde.
R11 y la casilla de la enmienda de la carta permanecen sin marcar.

### K4 — trazabilidad y commits documentales

La tabla de trazabilidad enlaza todos los commits rojos y verdes por requisito,
incluidos c1 en R6, c10b en R5 y el delta de E2.2 en R8. R1–R10: hecho;
R11: pendiente (humano). Se ejecutan los dos commits literales del handoff.

Primer commit de K4, salida literal:

```text
[feature/175-mobile-docs-canvas-fidelity a345426b] docs(mobile-docs-canvas-fidelity): trazabilidad de #175
 1 file changed, 11 insertions(+), 11 deletions(-)
```

El segundo commit de K4 guarda este informe con `git commit --only`, según la
cadena prescrita. Su hash se comunica en el cierre de sesión, porque no puede
incluirse a sí mismo dentro del contenido del commit.

### K5 — comprobación posterior al commit del informe

K5 se ejecuta después de los dos commits de K4, y compara las 15 rutas de la
lista cerrada contra H0, con las exclusiones literales del handoff. Como la
lista incluye este propio informe ya commiteado, el resultado de esa cadena
se comunica en la respuesta final de la sesión; no se registra aquí como
salida medida antes de ejecutarla. Salida exigida por el guion: `lista-ok`.

No se ejecutó `init.sh`, no se usó prettier, no hubo push/PR/merge y no se
modificaron código, tests, handoff, feature_list ni progress/current durante
esta reanudación. Solo se cerraron trazabilidad e informe. R11 permanece
pendiente (humano), y ambas casillas humanas siguen sin marcar.


## Ronda de fusión con main (#174)

2026-10-15. Ejecutado el handoff de fusión en orden hasta M4c. **Parada
obligatoria en M4c** por dos colisiones semánticas con los inventarios de
#174 R12. No se corrigieron los tests ni se repitió la corrida.

- H0m y HEAD actual: `da705f4416f40bb3ab66b307e6f203ee52d72fc8`.
- `origin/main` y `MERGE_HEAD`: `deaf4e6d99f46e8dcd3f8cd386e4312b9ce5f739`.
- Hash del merge: pendiente; no se creó el commit de fusión.

B0, salida literal:

```text
da705f4416f40bb3ab66b307e6f203ee52d72fc8
B0-ok
```

M1: `exit=1`, con exactamente seis conflictos de contenido, sin add/add ni
modify/delete. Lista literal:

```text
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/theme/global.css
specs/mobile-ui-language/design.md
```

M2, anclas ejecutadas tras resolver cada fichero según el handoff:

```text
A-ok
B-ok
C-ok
D-ok
E-ok
F-ok
```

Comprobado a mano: las frases de #174 y #175 están, en ese orden, dentro de
la regla 12, antes de la regla 13. Se conservó la firma procedente de main
según R-f; no se firmó ninguna casilla nueva.

M3, salida literal:

```text
M3-ok
```

M4a, espera literal y comprobación posterior de ausencia de procesos de
init.sh, Jest y ESLint:

```text
fin-espera
M4a-libre
```

M4b, salida literal (log de lint vacío):

```text
$ tsc --noEmit
M4b-ok
```

M4c, primera y única corrida completa:

```text
exit=1
Test Suites: 1 failed, 110 passed, 111 total
Tests:       2 failed, 3481 passed, 3483 total
      2   ● #174 R12: inventarios › limita text-15 a su inventario de producción
      2   ● #174 R12: inventarios › limita tracking-title a su inventario de producción
```

El conteo de `grep` muestra cada fallo dos veces porque Jest repite los
fallos en su resumen final; son **dos tests fallidos**, no cuatro.

Salida completa de los dos fallos, copiada del resumen de Jest:

```text
Summary of all failing tests
FAIL src/__tests__/alerts-canvas-fidelity.test.ts
  ● #174 R12: inventarios › limita text-15 a su inventario de producción

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

      Array [
        "components/celebration.tsx",
        "screens/alerts/index.tsx",
    +   "screens/docs/index.tsx",
        "screens/forgot/index.tsx",
        "screens/login/index.tsx",
        "screens/register/index.tsx",
        "screens/reset-password/index.tsx",
      ]

      210 |     },
      211 |   ])('limita $token a su inventario de producción', ({ pattern, files }) => {
    > 212 |     expect(filesMatching(pattern)).toEqual(files);
          |                                    ^
      213 |   });
      214 |
      215 |   it('declara border-b-5 una sola vez', () => {

      at toEqual (src/__tests__/alerts-canvas-fidelity.test.ts:212:36)

  ● #174 R12: inventarios › limita tracking-title a su inventario de producción

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

      Array [
        "screens/alerts/index.tsx",
    +   "screens/docs/index.tsx",
      ]

      210 |     },
      211 |   ])('limita $token a su inventario de producción', ({ pattern, files }) => {
    > 212 |     expect(filesMatching(pattern)).toEqual(files);
          |                                    ^
      213 |   });
      214 |
      215 |   it('declara border-b-5 una sola vez', () => {

      at toEqual (src/__tests__/alerts-canvas-fidelity.test.ts:212:36)
```

Ambos inventarios reciben `screens/docs/index.tsx` además de sus rutas
esperadas: Documentos utiliza `text-15` y `tracking-title`. El handoff no
permite alterar esos candados; la decisión corresponde al leader.

Aviso preexistente contado aparte: `A worker process has failed to exit
gracefully`, 1 aparición. No se cuenta como fallo.

Desviaciones de ejecución: ninguna. Se aplicó la parada prescrita por M4c.
M5, M6 y el commit de la nota no se ejecutaron. La fusión sigue abierta y sin
commit, con los seis conflictos resueltos y staged; este informe se deja
sin stage para el leader. No se ejecutó `git merge --abort`, `rebase`,
`init.sh` ni E2E. R11 sigue pendiente del humano y no se marcó su casilla.

Log completo: `/tmp/175-merge-all.txt`; lint: `/tmp/175-merge-lint.txt`.

## Ronda de fusión con main (#174), segunda corrida

2026-10-15. Ejecutado el handoff actualizado completo, incluida la edición
literal de M3b autorizada por la Enmienda E3 firmada por humano. La primera
corrida y su parada se conservan arriba como histórico.

- H0m: `894f68441e9dc3d7adf10c2dc0380d1ad5a486a7`.
- Commit de fusión: `5dd16a6036ead0a05cb47102f7544ff9a23fbd62`.
- Primer padre: `894f68441e9dc3d7adf10c2dc0380d1ad5a486a7` (H0m).
- Segundo padre: `deaf4e6d99f46e8dcd3f8cd386e4312b9ce5f739` (`origin/main`, #174).

B0, salida literal:

```text
894f68441e9dc3d7adf10c2dc0380d1ad5a486a7
B0-ok
```

M1, salida de estado y lista literal de los seis conflictos de contenido:

```text
exit=1
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/theme/global.css
specs/mobile-ui-language/design.md
```

M2, anclas ejecutadas después de resolver cada fichero según el handoff:

```text
A-ok
B-ok
C-ok
D-ok
E-ok
F-ok
```

Comprobado a mano: la frase de #174 precede a la de #175 dentro de la regla
12, antes de la regla 13. La casilla firmada de la carta procede de main,
según R-f; no se firmó ninguna casilla nueva. La plantilla de §6.2 del diseño
de idiomas se conserva sin cambios.

M3, salida literal:

```text
M3-ok
```

M3b, script literal del leader y sus anclas:

```text
E3-ok
M3b-ok
```

El script añadió Documentos únicamente a los inventarios de `text-15`
(#175 R6) y `tracking-title` (#175 R5), sin añadir ni quitar ningún `it`.

M4a, espera y comprobación posterior de ausencia de procesos ajenos:

```text
fin-espera
M4a-libre
```

M4b, salida literal (log de lint vacío):

```text
$ tsc --noEmit
M4b-ok
```

M4c, primera y única corrida de esta segunda ronda, sin líneas de fallo `●`:

```text
exit=0
Test Suites: 111 passed, 111 total
Tests:       3483 passed, 3483 total
```

Aviso preexistente contado aparte: `A worker process has failed to exit
gracefully`, una aparición; no es un fallo.

M5, hashes obtenidos tras el commit de fusión:

```text
5dd16a6036ead0a05cb47102f7544ff9a23fbd62
894f68441e9dc3d7adf10c2dc0380d1ad5a486a7
deaf4e6d99f46e8dcd3f8cd386e4312b9ce5f739
```

M6, lista cerrada contra main: 24 ficheros y diff vacío.

```text
24
M6-ok
```

Desviaciones respecto al handoff: ninguna. No se ejecutaron `init.sh` ni
E2E. R11 sigue pendiente del humano y no se marcó su casilla.

La nota se guarda con el commit `--only` prescrito en N. Su hash se comunica
en el cierre, porque el contenido no puede incluir el hash de su propio
commit.
