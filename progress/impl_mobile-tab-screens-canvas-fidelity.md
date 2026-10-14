# Informe de implementación — #173 mobile-tab-screens-canvas-fidelity

Estado: **c1–c30, S15 y K1–K3 completos; cierre documental K4→K5; R16 pendiente (humano)**. Fecha: 2026-10-14.
Worktree: `/home/claude/sites/Pet-Tracker-wt-173`.
Rama: `feature/173-mobile-tab-screens-canvas-fidelity`.
H0 = `adad3359295766758851761dce337f028671bc4b`.

Leí completo `progress/handoff_mobile-tab-screens-canvas-fidelity.md` y los tres documentos
`requirements.md`, `design.md` y `tasks.md` de #173 antes de escribir tests.
La aprobación humana de requirements está marcada. #173 figura `in_progress`.

## 1. H0 y B0–B2

### B0: estado inicial

Salida literal de `pwd && git branch --show-current && git rev-parse HEAD && git status --short`,
precedido del CD del handoff:

```text
/home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker
feature/173-mobile-tab-screens-canvas-fidelity
adad3359295766758851761dce337f028671bc4b
?? assets/fonts/Inter-ExtraBold.ttf
```

Cadena de ancestros de `57a61544` y `788d1f89`:

```text
exit=0
```

Comprobación de ausencia de `.expo/types/router.d.ts`:

```text
exit=0
```

### B1: BASE20 y tipos/lint

Cadena BASE20 completa con las macros expandidas:

```text
exit=0
Tests:       878 passed, 878 total
```

El guard VERDE comprobó 20 suites y todos los tests verdes.
TSLINT (typecheck seguido de expo lint sin caché y log vacío):

```text
$ tsc --noEmit
exit=0
```

### B2: medidas de base

Salida literal de la cadena:

```text
exit=1
51
M35	6	DIFF base=5
```

Contenido completo de `/tmp/173-m-h0.txt`:

```text
M1	8	ok
M2	5	ok
M3	1	ok
M4	1	ok
M5	1	ok
M6	2	ok
M7	3	ok
M8	4	ok
M9	1	ok
M10	1	ok
M11	1	ok
M12	1	ok
M13	1	ok
M14	1	ok
M15	0	ok
M16	1	ok
M17	1	ok
M18	1	ok
M19	1	ok
M20	1	ok
M21	1	ok
M22	1	ok
M23	1	ok
M24	1	ok
M25	1	ok
M26	31	ok
M27	1	ok
M28	1	ok
M29	1	ok
M30	1	ok
M31	0	ok
M32	1	ok
M33	0	ok
M34	0	ok
M35	6	DIFF base=5
M36	1	ok
M37	1	ok
M38	0	ok
M39	0	ok
M40	1	ok
M41	1	ok
M42	1	ok
M43	0	ok
M44	0	ok
M45	1	ok
M46	2	ok
M47	1	ok
M48	1	ok
M49	1	ok
M50	0	ok
M51	0	ok
```

M35 es la única diferencia y está prevista expresamente por el handoff: el sexto TTF ya está
sin trackear. Este exit=1 es el resultado esperado de B2, no el bloqueo de la sesión.
No ejecuté ALL en la base.

## 2. Anclas H0

Se ejecutaron todas; los valores medidos coinciden con los previstos.
Los grep con cero coincidencias devuelven exit=1 y salida 0, como corresponde a esas anclas.

| Comando desde mobile-pet-tracker/ | Esperado | Medido | Resultado |
|---|---|---|---|
| `sha256sum assets/fonts/Inter-ExtraBold.ttf \| cut -d' ' -f1` | `e6756ad5690b77606aa62249a7b420d9902d45cae4b0048a24911fd4324b0a22` | `e6756ad5690b77606aa62249a7b420d9902d45cae4b0048a24911fd4324b0a22` | coincide |
| `stat -c %s assets/fonts/Inter-ExtraBold.ttf` | `421796` | `421796` | coincide |
| `test -e node_modules/.bin/prettier; echo $?` | `1` | `1` | coincide |
| `test -e ../.agents/skills/appllama-app-design-skill/SKILL.md; echo $?` | `0` | `0` | coincide |
| `test -e ../.agents/skills/animate-expo/SKILL.md; echo $?` | `0` | `0` | coincide |
| `test -e src/__tests__/profile-canvas-fidelity.test.ts; echo $?` | `1` | `1` | coincide |
| `grep -cE '^## Enmienda #168 — título grande en Salud, Nutrición y Perfil$' ../docs/ui-guidelines.md` | `1` | `1` | coincide |
| `grep -cE '^## Enmienda #17[0-9]' ../docs/ui-guidelines.md` | `0` | `0` | coincide |
| `grep -c 'Tamaños de letra fuera de la escala de Tailwind' ../docs/ui-guidelines.md` | `0` | `0` | coincide |
| `grep -cF '**Control, tile, input, botón y píldora de dato** → `rounded-xl`' ../docs/ui-guidelines.md` | `1` | `1` | coincide |
| `grep -cE '^### §2\.26 ' ../specs/mobile-ui-language/design.md` | `1` | `1` | coincide |
| `grep -cE '^### §2\.27 ' ../specs/mobile-ui-language/design.md` | `0` | `0` | coincide |
| `grep -cF '+ 7, // #170 R1' src/providers/__tests__/language-provider.test.tsx` | `1` | `1` | coincide |
| `grep -cF "'rounded-card border border-border bg-surface p-4 shadow-sm'" src/components/card.tsx` | `1` | `1` | coincide |
| `grep -cF "describe('R2: estructura Figma'" src/screens/profile/index.test.tsx` | `1` | `1` | coincide |
| `grep -cF "describe('R10 (mobile-device-pairing): el perfil enlaza a /pairing'" src/screens/profile/index.test.tsx` | `1` | `1` | coincide |

La cadena de IT estáticos terminó con la salida literal:

```text
its-ok
```

| Fichero | IT esperados | IT medidos |
|---|---|---|
| `src/theme/__tests__/font-registration.test.ts` | 3 | 3 |
| `src/theme/__tests__/global-css.test.ts` | 30 | 30 |
| `src/components/__tests__/card.test.tsx` | 7 | 7 |
| `src/components/__tests__/pet-switcher.test.tsx` | 1 | 1 |
| `src/screens/profile/index.test.tsx` | 51 | 51 |
| `src/__tests__/consistency-classnames.test.ts` | 33 | 33 |
| `src/__tests__/legibility-classnames.test.ts` | 12 | 12 |
| `src/__tests__/design-drift.test.ts` | 51 | 51 |
| `src/providers/__tests__/language-provider.test.tsx` | 19 | 19 |
| `src/__tests__/ui-language.test.ts` | 28 | 28 |
| `src/app/(tabs)/__tests__/screens.test.tsx` | 2 | 2 |
| `src/app/(tabs)/__tests__/profile.test.tsx` | 1 | 1 |

## 3. Skills cargadas de verdad

| Skill | Uso en esta sesión |
|---|---|
| `ponytail:ponytail` | Lectura del alcance y de los consumidores para mantener los cambios dentro de la spec. |
| `building-native-ui` | Guía Expo consultada para fuentes, componentes y estructura nativa. Leída desde el plugin Expo instalado. |
| `appllama-app-design-skill` | Guía de UI móvil consultada junto con los límites de docs/ui-guidelines.md; el smoke queda en manos del humano. |
| `animate-expo` | Guía de movimiento consultada para reutilizar HomeEntrance con índices fijos en R12, sin cambiar el componente compartido. |

También consulté la [documentación versionada de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/),
como exige `mobile-pet-tracker/AGENTS.md`. No se ejecutaron pruebas de dispositivo.

## 4. Tabla por commit

En la primera sesión no se creó ningún commit. La tabla siguiente recoge la
reanudación; la evidencia del bloqueo original se conserva en §8.

| Paso | Hash | Mensaje previsto | R | Tipo | Tests: literal | Resultado |
|---|---|---|---|---|---|---|
| c1 | c91efe84 | test(mobile): registra Inter-ExtraBold como sexto peso (#173 R1) | R1 | rojo, solo tests | `Tests:       2 failed, 880 passed, 882 total` | `cadena=0` |
| c2 | 2d462afa | feat(mobile): registra Inter-ExtraBold como sexto peso (#173 R1) | R1 | verde, implementación | `Tests:       882 passed, 882 total` | `cadena=0`; M31=1; tipos/lint limpios |
| c3 | 9591e3f1 | test(mobile): tokens de radio hero y tile y tamaños 13 y 26 (#173 R2) | R2 | rojo, solo tests | `Tests:       2 failed, 882 passed, 884 total` | `cadena=0`; tipos/lint sin errores |
| c4 | ca83aaf9 | feat(mobile): tokens de radio hero y tile y tamaños 13 y 26 (#173 R2) | R2 | verde, implementación | `Tests:       884 passed, 884 total` | `cadena=0`; M33/M34/M38/M39=1; tipos/lint limpios |
| c5 | 7056ca0e | test(mobile): variantes hero y flat de Card sin sombra (#173 R3) | R3 | rojo, solo tests | `Tests:       4 failed, 884 passed, 888 total` | `cadena=0`; TS2322 solo en tests; lint limpio |
| c6 | a18abc0d | feat(mobile): variantes hero y flat de Card sin sombra (#173 R3) | R3 | verde, implementación | `Tests:       888 passed, 888 total` | `cadena=0`; tipos/lint limpios |
| c7 | fc6715cf | test(mobile): PetSwitcher con variante avatars en Perfil (#173 R4) | R4 | rojo, solo tests | `Tests:       6 failed, 890 passed, 896 total` | `cadena=0`; TS2322 solo en tests; lint limpio |
| c8 | 36356ae8 | feat(mobile): PetSwitcher con variante avatars en Perfil (#173 R4) | R4 | verde, implementación | `Tests:       896 passed, 896 total` | `cadena=0`; reintento en Reanudación 2; M36=1; tipos/lint limpios |
| c9 | aaeb9bab | test(mobile): cápsula de añadir mascota en Perfil (#173 R5) | R5 | rojo, solo tests | `Tests:       7 failed, 892 passed, 899 total` | `cadena=0`; tipos/lint sin errores |
| c10 | 166c8af4 | feat(mobile): cápsula de añadir mascota en Perfil (#173 R5) | R5 | verde, implementación + E1 autorizado | `Tests:       899 passed, 899 total` | `cadena=0`; reintento por SIGKILL; M5=0; tipos/lint limpios |
| c11 | f785d96c | test(mobile): hero de la mascota con anillo y cámara (#173 R6) | R6 | rojo, solo tests | `Tests:       12 failed, 892 passed, 904 total` | `cadena=0`; Reanudación 4; tipos/lint limpios |
| c12 | fe0dc8a5 | feat(mobile): hero de la mascota con anillo y cámara (#173 R6) | R6 | verde, implementación | `Tests:       904 passed, 904 total` | `cadena=0`; M3=0/M6=1/M45=0; tipos/lint limpios |
| c13 | 89795331 | test(mobile): chips de Perfil con sexo localizado (#173 R7) | R7 | rojo, solo tests | `Tests:       18 failed, 894 passed, 912 total` | `cadena=0`; tipos/lint limpios |
| c14 | bf21fbbd | feat(mobile): chips de Perfil con sexo localizado (#173 R7) | R7 | verde, implementación y E3 autorizado | `Tests:       912 passed, 912 total` | `cadena=0`; Reanudación 6; M13/M28 ok; tipos/lint limpios |
| c15 | 427079ac | test(mobile): información en Card flat con estado del collar (#173 R8) | R8 | rojo, solo tests | `Tests:       12 failed, 909 passed, 921 total` | `cadena=0`; tipos/lint limpios |
| c16 | 92308138 | feat(mobile): información en Card flat con estado del collar (#173 R8) | R8 | verde, implementación y deltas prescritos | `Tests:       921 passed, 921 total` | `cadena=0`; M10=0; tipos/lint limpios |
| c17 | b73f4963 | test(mobile): última señal relativa en Perfil (#173 R9) | R9 | rojo, solo tests | `Tests:       24 failed, 923 passed, 947 total` | `cadena=0`; tipos/lint limpios |
| c18 | 9b01360f | feat(mobile): última señal relativa en Perfil (#173 R9) | R9 | verde, implementación y E4 autorizado | `Tests:       947 passed, 947 total` | `cadena=0`; Reanudación 7; tipos/lint limpios |
| c19 | 44e0b9c6 | test(mobile): rejilla 2x2 de accesos en Perfil (#173 R10) | R10 | rojo, solo tests | `Tests:       14 failed, 938 passed, 952 total` | `cadena=0`; tipos/lint limpios |
| c20 | 94614567 | feat(mobile): rejilla 2x2 de accesos en Perfil (#173 R10) | R10 | verde, implementación | `Tests:       952 passed, 952 total` | `cadena=0`; M1/M2/M12/M14/M15 ok; tipos/lint limpios |
| c21 | 506ad153 | test(mobile): cuenta en Card flat con Switch e idioma (#173 R11) | R11 | rojo, solo tests | `Tests:       23 failed, 946 passed, 969 total` | `cadena=0`; tipos/lint limpios |
| c22 | 74641446 | feat(mobile): cuenta en Card flat con Switch e idioma (#173 R11) | R11 | verde, implementación y deltas prescritos | `Tests:       969 passed, 969 total` | `cadena=0`; M8/M9/M11/M46–M49 ok; tipos/lint limpios |
| c23 | b10028b7 | test(mobile): entrada escalonada de Perfil (#173 R12) | R12 | rojo, solo tests | `Tests:       3 failed, 968 passed, 971 total` | `cadena=0`; tipos/lint limpios |
| c24 | 83112c89 | feat(mobile): entrada escalonada de Perfil (#173 R12) | R12 | verde, implementación | `Tests:       971 passed, 971 total` | `cadena=0`; tipos/lint limpios |
| c25 | 5e48dc40 | refactor(mobile): términos finales de catálogo y tabla de copy de Perfil (#173 R13) | R13 | refactor nacido verde | `Tests:       971 passed, 971 total` | `cadena=0`; M25–M27 ok; tipos/lint limpios |
| c26 | 1bb49c33 | test(mobile): enmiendas de #173 a carta y specs (#173 R14) | R14 | rojo, solo tests | `Tests:       16 failed, 971 passed, 987 total` | `cadena=0`; Reanudación 9; tipos/lint limpios |
| c27 | 4369cafc | docs(ui): enmiendas de #173 a carta y specs (#173 R14) | R14 | verde documental | `Tests:       987 passed, 987 total` | `cadena=0`; M50/M51=1; diez firmas nuevas sin marcar |
| c28 | 0b6d8329 | test(mobile): contenedor de Perfil con las métricas del artboard (#173 R17) | R17 | rojo, solo tests | `Tests:       1 failed, 986 passed, 987 total` | `cadena=0`; un reintento por flake ajeno, documentado; tipos/lint limpios |
| c29 | 9222e981 | feat(mobile): contenedor de Perfil con las métricas del artboard (#173 R17) | R17 | verde, implementación | `Tests:       987 passed, 987 total` | `cadena=0`; M41–M44 ok; tipos/lint limpios |
| c30 | 2ed3a7fc | test(mobile): candados de grep-limpio de Perfil (#173 R15) | R15 | test nacido verde tras E7; rojo en S15 | `Tests:       990 passed, 990 total` | `cadena=0`; M1–M51 ok; tipos/lint limpios; parada anterior en Reanudación 9 documentada |

En el paso manual c1 se añadió el describe `#173 R1: registra Inter-ExtraBold como sexto peso`
a `mobile-pet-tracker/src/theme/__tests__/font-registration.test.ts`, con la sobrecarga de
readFileSync y cuatro tests. En la primera sesión quedó sin validar y sin commit;
c1 se completó en Reanudación 1. Lista literal de ● de c1, sin Console:

```text
  ● #173 R1: registra Inter-ExtraBold como sexto peso › registra ExtraBold entre Bold y Black en useFonts
  ● #173 R1: registra Inter-ExtraBold como sexto peso › expone la familia ExtraBold después de Bold en Uniwind
```

Typecheck rojo: `$ tsc --noEmit`, sin errores TS. Lint rojo: log vacío, sin errores.

Lista literal de ● de c3, sin Console:

```text
  ● #173 R2: tokens de radio hero y tile › declara los radios del artboard dentro de @theme
  ● #173 R2.3: tamaños de letra 13 y 26 › declara los tamaños fuera de escala sin imponer interlineado
```

Typecheck rojo c3: `$ tsc --noEmit`, sin errores TS. Lint rojo c3: log vacío.

Lista literal de ● de c5, sin Console:

```text
  ● #173 R3: variantes hero y flat sin sombra › hero usa su receta sin className del llamador
  ● #173 R3: variantes hero y flat sin sombra › hero fusiona las clases del llamador después de su receta
  ● #173 R3: variantes hero y flat sin sombra › flat usa su receta sin className del llamador
  ● #173 R3: variantes hero y flat sin sombra › flat fusiona las clases del llamador después de su receta
```

Typecheck rojo c5, errores permitidos únicamente en tests:

```text
$ tsc --noEmit
src/components/__tests__/card.test.tsx(76,38): error TS2322: Type '"hero"' is not assignable to type '"secondary" | "surface" | "accent" | undefined'.
src/components/__tests__/card.test.tsx(85,38): error TS2322: Type '"hero"' is not assignable to type '"secondary" | "surface" | "accent" | undefined'.
src/components/__tests__/card.test.tsx(94,38): error TS2322: Type '"flat"' is not assignable to type '"secondary" | "surface" | "accent" | undefined'.
src/components/__tests__/card.test.tsx(103,38): error TS2322: Type '"flat"' is not assignable to type '"secondary" | "surface" | "accent" | undefined'.
```

Lint rojo c5: log vacío, sin errores.

Lista literal de ● de c7, sin Console (Jest repite los seis en el resumen):

```text
  ● #173 R4: Perfil pide la variante avatars › pasa avatars al selector compartido cuando carga la mascota
  ● #173 R4: variante avatars › reparte los cinco colores y vuelve a ámbar en la sexta mascota
  ● #173 R4: variante avatars › con una mascota deja un único chip y el avatar ámbar
  ● #173 R4: variante avatars › elige foto o inicial, y la inicial usa ExtraBold y tinta de su hueco
  ● #173 R4: variante avatars › cada chip tiene un avatar y cada avatar un único hijo
  ● #173 R4: avatars solo en Perfil › limita la variante nueva al consumidor Perfil
  ● #173 R4: Perfil pide la variante avatars › pasa avatars al selector compartido cuando carga la mascota
  ● #173 R4: variante avatars › reparte los cinco colores y vuelve a ámbar en la sexta mascota
  ● #173 R4: variante avatars › con una mascota deja un único chip y el avatar ámbar
  ● #173 R4: variante avatars › elige foto o inicial, y la inicial usa ExtraBold y tinta de su hueco
  ● #173 R4: variante avatars › cada chip tiene un avatar y cada avatar un único hijo
  ● #173 R4: avatars solo en Perfil › limita la variante nueva al consumidor Perfil
```

Typecheck rojo c7:

```text
$ tsc --noEmit
src/components/__tests__/pet-switcher.test.tsx(106,76): error TS2322: Type '{ pets: PetProfile[]; selectedPetId: string; onSelect: Mock<any, any, any>; variant: string; }' is not assignable to type 'IntrinsicAttributes & PetSwitcherProps'.
  Property 'variant' does not exist on type 'IntrinsicAttributes & PetSwitcherProps'.
```

Lint rojo c7: log vacío, sin errores.

Lista literal de ● de c9, sin Console (repetidos en el resumen de Jest):

```text
  ● #173 R5: cápsula de añadir mascota › pinta la cápsula tras el título con icono oculto y texto en español
  ● #173 R5: cápsula de añadir mascota › pinta Add pet en inglés con la misma receta
  ● #62 R7: ningún glifo tipográfico hace de icono › profile usa cuatro ChevronRight de reicon
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #166 R2: todo primario sólido lleva el labio detrás de bg-accent › inventaría los dieciocho primarios con labio, fichero a fichero
  ● #166 R2: todo primario sólido lleva el labio detrás de bg-accent › no deja la receta del labio fuera de un primario
  ● #61 R4: el acento como tinta usa accent-strong › screens/profile/index.tsx pinta con text-accent-strong (2)
  ● #173 R5: cápsula de añadir mascota › pinta la cápsula tras el título con icono oculto y texto en español
  ● #173 R5: cápsula de añadir mascota › pinta Add pet en inglés con la misma receta
  ● #62 R7: ningún glifo tipográfico hace de icono › profile usa cuatro ChevronRight de reicon
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #166 R2: todo primario sólido lleva el labio detrás de bg-accent › inventaría los dieciocho primarios con labio, fichero a fichero
  ● #166 R2: todo primario sólido lleva el labio detrás de bg-accent › no deja la receta del labio fuera de un primario
  ● #61 R4: el acento como tinta usa accent-strong › screens/profile/index.tsx pinta con text-accent-strong (2)
```

Typecheck rojo c9: `$ tsc --noEmit`, sin errores TS. Lint rojo c9: log vacío.

Lista literal de ● de c11, sin Console (Jest repite la lista en el resumen):

```text
  ● #168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › ordena la tarjeta en avatar, nombre y chips
  ● #168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › superpone la cámara en el anillo con su tamaño, tinta y objetivo táctil
  ● #168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › con la subida fallida deja photo-upload-error inmediatamente tras la tarjeta
  ● #168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › expone la cámara habilitada en reposo
  ● #168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › reserva h-52 mientras carga el detalle
  ● #62 R7: ningún glifo tipográfico hace de icono › profile usa cuatro ChevronRight de reicon
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento
  ● #61 R4: el acento como tinta usa accent-strong › screens/profile/index.tsx pinta con text-accent-strong (1)
  ● #173 R2: inventario de radios nuevos › reserva rounded-hero al Card compartido y el skeleton de Perfil
  ● #173 R2.4: inventario de tamaños nuevos › reserva text-26 al nombre de la mascota en Perfil
  ● #173 R3: Card hero y flat solo en Perfil › Perfil es el único consumidor de Card hero y lo usa una vez
```

Typecheck rojo c11: `$ tsc --noEmit`, sin errores TS. Lint rojo c11: log vacío.

Lista literal de ● de c13, sin Console (Jest repite la lista en el resumen):

```text
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › ordena los cuatro chips con el hueco y texto de su dato
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › sin sexo ni esterilización conserva edad ámbar y peso violeta
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › sin peso omite su chip y conserva sexo, esterilización y edad en sus huecos
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › con la edad NaN omite su chip y deja el peso en violeta
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › con la edad Infinity omite su chip y deja el peso en violeta
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › con la edad -Infinity omite su chip y deja el peso en violeta
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › sin esterilizar pinta el chip verde con «Sin esterilizar»
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › con 0 meses y 0 kg pinta los cuatro chips
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › sin sexo conserva esterilización, edad y peso en sus huecos
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › sin esterilización conserva sexo, edad y peso en sus huecos
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › centra y agrupa los chips con gap-1.5
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › localiza u omite el sexo male en es
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › localiza u omite el sexo female en es
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › localiza u omite el sexo other en es
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › localiza u omite el sexo male en en
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › localiza u omite el sexo female en en
  ● #168 R5 (enmendado por #173 R7): chips pastel con sexo localizado › localiza u omite el sexo other en en
  ● #68 E1: la carta retira connectivity de los enum crudos › conserva crudos solo los tres ámbitos aún pendientes
```

Typecheck rojo c13: `$ tsc --noEmit`, sin errores TS. Lint rojo c13: log vacío.

Lista literal de ● de c15, sin Console (Jest repite la lista en el resumen):

```text
  ● R2: estructura Figma › renders the active pet hero, switcher, pills and information rows
  ● R2: estructura Figma › uses No registrado for nullable information
  ● #61 R9 (enmendado por #173 R8): pet-info-card no lleva etiqueta de sección › pinta cuatro filas en Card flat sin etiqueta de sección
  ● #173 R8: información en Card flat › contiene solo las cuatro filas de datos, sin texto de sección
  ● #173 R8: información en Card flat › pinta el estado del collar (true) en es
  ● #173 R8: información en Card flat › pinta el estado del collar (true) en en
  ● #173 R8: información en Card flat › pinta el estado del collar (false) en es
  ● #173 R8: información en Card flat › pinta el estado del collar (false) en en
  ● #173 R8: información en Card flat › usa padding de 11 pt en raza y última señal con separador solo en raza
  ● #173 R13: Perfil retira cuatro claves y añade tres › declara profile.gpsLinked en ambos idiomas y registra su añadido
  ● #173 R13: Perfil retira cuatro claves y añade tres › declara profile.gpsNoCollar en ambos idiomas y registra su añadido
  ● #173 R13: Perfil retira cuatro claves y añade tres › retira profile.information de ambos idiomas y documenta la retirada
```

Typecheck rojo c15: `$ tsc --noEmit`, sin errores TS. Lint rojo c15: log vacío.

Lista literal de ● de c17, sin Console (Jest repite la lista en el resumen):

```text
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:59:30.000Z en español como Justo ahora
  ● #173 R9: última señal relativa › formatea 2026-10-13T12:05:00.000Z en español como Justo ahora
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:59:01.000Z en español como Justo ahora
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:59:00.000Z en español como hace 1 min
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:15:00.000Z en español como hace 45 min
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:00:01.000Z en español como hace 59 min
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:00:00.000Z en español como hace 1 h
  ● #173 R9: última señal relativa › formatea 2026-10-13T06:30:00.000Z en español como hace 5 h
  ● #173 R9: última señal relativa › formatea 2026-10-12T12:00:01.000Z en español como hace 23 h
  ● #173 R9: última señal relativa › formatea 2026-10-12T12:00:00.000Z en español como 12 oct
  ● #173 R9: última señal relativa › formatea 2026-08-21T12:00:00.000Z en español como 21 ago
  ● #173 R9: última señal relativa › formatea 2025-12-30T12:00:00.000Z en español como 30 dic 2025
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:59:30.000Z en inglés como Just now
  ● #173 R9: última señal relativa › formatea 2026-10-13T12:05:00.000Z en inglés como Just now
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:59:01.000Z en inglés como Just now
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:59:00.000Z en inglés como 1m ago
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:15:00.000Z en inglés como 45m ago
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:00:01.000Z en inglés como 59m ago
  ● #173 R9: última señal relativa › formatea 2026-10-13T11:00:00.000Z en inglés como 1h ago
  ● #173 R9: última señal relativa › formatea 2026-10-13T06:30:00.000Z en inglés como 5h ago
  ● #173 R9: última señal relativa › formatea 2026-10-12T12:00:01.000Z en inglés como 23h ago
  ● #173 R9: última señal relativa › formatea 2026-10-12T12:00:00.000Z en inglés como Oct 12
  ● #173 R9: última señal relativa › formatea 2026-08-21T12:00:00.000Z en inglés como Aug 21
  ● #173 R9: última señal relativa › formatea 2025-12-30T12:00:00.000Z en inglés como Dec 30, 2025
```

Typecheck rojo c17: `$ tsc --noEmit`, sin errores TS. Lint rojo c17: log vacío.

Lista literal de ● de c19, sin Console (Jest repite la lista en el resumen):

```text
  ● R10 (mobile-device-pairing): el perfil enlaza a /pairing › shows the GPS collar tile and opens pairing
  ● #41 R9: Perfil enlaza a las zonas seguras de la mascota activa › pinta la fila de zonas seguras tras la de GPS y abre la ruta de la mascota activa
  ● #168 R6 (enmendado por #173 R10): los accesos son tiles pastel en rejilla 2×2 › pinta el tile y conserva el destino de documents-link
  ● #168 R6 (enmendado por #173 R10): los accesos son tiles pastel en rejilla 2×2 › pinta el tile y conserva el destino de pairing-link
  ● #168 R6 (enmendado por #173 R10): los accesos son tiles pastel en rejilla 2×2 › pinta el tile y conserva el destino de geofences-link
  ● #168 R6 (enmendado por #173 R10): los accesos son tiles pastel en rejilla 2×2 › pinta el tile y conserva el destino de reminders-link
  ● #168 R6 (enmendado por #173 R10): los accesos son tiles pastel en rejilla 2×2 › con mascota ordena dos filas de dos tiles
  ● #168 R6 (enmendado por #173 R10): los accesos son tiles pastel en rejilla 2×2 › sin mascota deja recordatorios solo y a ancho completo
  ● #173 R13: Perfil retira cuatro claves y añade tres › declara profile.gpsCollar en ambos idiomas y registra su añadido
  ● #173 R13: Perfil retira cuatro claves y añade tres › retira profile.gpsSettings de ambos idiomas y documenta la retirada
  ● #62 R7: ningún glifo tipográfico hace de icono › profile usa los glifos de reicon sin ChevronRight (#173 R10)
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/profile/index.tsx importa y aplica sus 1 esquinas
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #173 R2: inventario de radios nuevos › reserva rounded-tile a los accesos de Perfil
```

Typecheck rojo c19: `$ tsc --noEmit`, sin errores TS. Lint rojo c19: log vacío.

Lista literal de ● de c21, sin Console (Jest repite la lista en el resumen):

```text
  ● #173 R11: cuenta en Card flat con Switch e idioma › ordena los hijos de la cuenta pendiente sin etiqueta de sección
  ● #173 R11: cuenta en Card flat con Switch e idioma › ordena los hijos de la cuenta ok sin etiqueta de sección
  ● #173 R11: cuenta en Card flat con Switch e idioma › ordena los hijos de la cuenta error sin etiqueta de sección
  ● #173 R11: cuenta en Card flat con Switch e idioma › ordena los hijos de la cuenta unauthorized sin etiqueta de sección
  ● #173 R11: cuenta en Card flat con Switch e idioma › expone el Switch light en es con etiqueta fija
  ● #173 R11: cuenta en Card flat con Switch e idioma › expone el Switch dark en es con etiqueta fija
  ● #173 R11: cuenta en Card flat con Switch e idioma › expone el Switch light en en con etiqueta fija
  ● #173 R11: cuenta en Card flat con Switch e idioma › expone el Switch dark en en con etiqueta fija
  ● #173 R11: cuenta en Card flat con Switch e idioma › usa las recetas y el orden de las dos filas de ajustes
  ● #173 R11: cuenta en Card flat con Switch e idioma › muestra Español como valor y cambia a en
  ● #173 R11: cuenta en Card flat con Switch e idioma › muestra English como valor y cambia a es
  ● #65 R14 (enmendado por #173 R11): Profile cambia el idioma y repinta sin reiniciar › shows the current endonym and changes the live Profile copy
  ● #168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard › pinta las iniciales de «Ana» / «García»
  ● #168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard › pinta las iniciales de « ana » / «»
  ● #168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard › pinta las iniciales de «» / «núñez»
  ● #168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard › pinta las iniciales de «élodie» / «ñúñez»
  ● #168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard › pinta las iniciales de «» / « »
  ● #168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard › reserva el alto de la identidad mientras carga la cuenta
  ● #168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard › da padding vertical al estado de cuenta no disponible
  ● #173 R13: Perfil retira cuatro claves y añade tres › retira profile.account de ambos idiomas y documenta la retirada
  ● #173 R13: Perfil retira cuatro claves y añade tres › retira profile.useLightTheme de ambos idiomas y documenta la retirada
  ● #173 R2.4: inventario de tamaños nuevos › reserva text-13 a las iniciales de la cuenta en Perfil
  ● #173 R3: Card hero y flat solo en Perfil › Perfil es el único consumidor de Card flat y lo usa dos veces
```

Typecheck rojo c21: `$ tsc --noEmit`, sin errores TS. Lint rojo c21: log vacío.

Lista literal de ● de c23, sin Console (Jest repite la lista en el resumen):

```text
  ● #168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › con la subida fallida deja photo-upload-error inmediatamente tras la entrada del hero
  ● #173 R12: entrada escalonada › con mascota envuelve cuatro bloques con índices fijos
  ● #173 R12: entrada escalonada › sin mascota conserva los índices 2 y 3 para links y cuenta
```

Typecheck rojo c23: `$ tsc --noEmit`, sin errores TS. Lint rojo c23: log vacío.

Lista literal de ● de c26, sin Console (Jest repite la lista en el resumen):

```text
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en docs/ui-guidelines.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-pets-profile/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-ui-legibility-polish/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-ui-consistency-polish/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-ui-language/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-tab-headers-canvas/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-device-pairing/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-geofences/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-chunky-cta/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-home-weekly-activity/requirements.md
  ● #173 R14: la carta declara los cambios › declara los radios hero y tile en la regla 12
  ● #173 R14: la carta declara los cambios › declara la cápsula tonal sin labio en la regla 13
  ● #173 R14: la carta declara los cambios › declara las variantes nuevas de Card
  ● #173 R14: la carta declara los cambios › declara los tokens de letra fuera de escala
  ● #173 R14: la carta declara los cambios › declara la excepción de dimensiones en conventions
  ● #173 R14: la carta declara los cambios › declara la excepción de dimensiones en la regla 6 de la carta
```

Typecheck y lint de c26 no se ejecutaron: la cadena se detuvo antes en SINCRASH.
Ese texto corresponde a la primera corrida de Reanudación 7; el
relanzamiento correcto de Reanudación 9 sí pasó tipos y dejó lint vacío.

Lista literal de ● de c28, sin Console (tras el reintento por flake):

```text
  ● R2: estructura Figma › uses the canvas artboard metrics (#173 R17) and content-sized skeletons while loading
```

Typecheck rojo c28: `$ tsc --noEmit`, sin errores TS. Lint rojo c28: log vacío.

## 5. Sonda S15

Ejecutada con el ejecutor `sed + bash -c` sobre HEAD de c30. Salida literal:

```text
1
Tests:       1 failed, 25 passed, 26 total
  ● #173 R15: grep-limpio › components/card.tsx no tiene escapes de estilo
limpio=0
```

La sombra se plantó en `hero`, produjo únicamente el rojo de R15 y se
revirtió con la restauración de Card prevista en la sonda. No se commiteó.

## 6. Mcheck de cierre de c30

Ejecutado dentro de la cadena c30, antes de BASE21: las 51 medidas dieron
`ok`, exit=0. Salida completa capturada del ejecutor:

```text
M1	1	ok
M2	0	ok
M3	0	ok
M4	3	ok
M5	0	ok
M6	1	ok
M7	4	ok
M8	0	ok
M9	0	ok
M10	0	ok
M11	0	ok
M12	0	ok
M13	2	ok
M14	0	ok
M15	1	ok
M16	0	ok
M17	0	ok
M18	0	ok
M19	0	ok
M20	0	ok
M21	0	ok
M22	0	ok
M23	0	ok
M24	0	ok
M25	0	ok
M26	35	ok
M27	0	ok
M28	0	ok
M29	1	ok
M30	1	ok
M31	1	ok
M32	1	ok
M33	1	ok
M34	1	ok
M35	6	ok
M36	1	ok
M37	0	ok
M38	1	ok
M39	1	ok
M40	1	ok
M41	0	ok
M42	0	ok
M43	1	ok
M44	1	ok
M45	0	ok
M46	0	ok
M47	0	ok
M48	0	ok
M49	0	ok
M50	1	ok
M51	1	ok
```

La primera corrida se paró después en BASE21 (Reanudación 9). En
Reanudación 10, el mcheck volvió a producir exactamente estas 51 líneas;
BASE21, tipos y lint pasaron y c30 quedó commiteado como `2ed3a7fc`.

## 7. Cierre K1–K5

| Paso | Estado | Salida literal |
|---|---|---|
| K1, IT finales | completo | números literales debajo |
| K2, BASE21 final | completo | `exit=0`; `Tests:       990 passed, 990 total` |
| K3, ALL, tipos/lint finales, 30 commits | completo | ALL: `exit=0`; `all-ok T=3213`; tipos: `exit=0`; lint: `exit=0`, `lint-ok`; commits: `30` |
| K4, trazabilidad e informe con --only | trazabilidad commiteada; este informe se incorpora con --only | commit `9f822605`; literal debajo |
| K5, lista cerrada | comprobación inmediatamente después del commit de este informe | literal de aceptación: `lista-ok` |

K1: se ejecutó `grep -cE '^\s*it(\.each)?[(<]'` en cada fichero de test
modificado desde H0. Son cuentas estáticas, sin valor esperado; todos los
comandos terminaron con exit=0. `ui-copy-table.ts` es la tabla de datos,
no un fichero de tests.

| Fichero desde mobile-pet-tracker/ | IT final, salida literal |
|---|---|
| src/__tests__/consistency-classnames.test.ts | 33 |
| src/__tests__/design-drift.test.ts | 51 |
| src/__tests__/legibility-classnames.test.ts | 12 |
| src/__tests__/profile-canvas-fidelity.test.ts | 15 |
| src/__tests__/ui-language.test.ts | 28 |
| src/components/__tests__/card.test.tsx | 11 |
| src/components/__tests__/pet-switcher.test.tsx | 7 |
| src/providers/__tests__/language-provider.test.tsx | 21 |
| src/screens/profile/index.test.tsx | 73 |
| src/theme/__tests__/font-registration.test.ts | 7 |
| src/theme/__tests__/global-css.test.ts | 32 |

La trazabilidad se completó en el único commit de K4; este informe se
incorpora a continuación mediante el comando literal `git commit --only`.

K2, salida literal (K=990):

```text
exit=0
Tests:       990 passed, 990 total
```

K3: el bucle terminó con `fin-espera` (exit=0). El total requerido por la
fórmula del handoff es T=3101+990−878=3213, con 104 suites.

ALL final, tras un reintento por el flake ajeno de R1 (detalle en §8):

```text
exit=0
Test Suites: 104 passed, 104 total
Tests:       3213 passed, 3213 total
all-ok T=3213
```

Tipos, lint y número de commits (cada bloque corresponde al comando
literal de K3, antes de K4):

```text
$ tsc --noEmit
exit=0
```

```text
exit=0
lint-ok
```

```text
30
```

K4, salida literal del commit de trazabilidad:

```text
[feature/173-mobile-tab-screens-canvas-fidelity 9f822605] docs(mobile-tab-screens-canvas-fidelity): trazabilidad de #173
 1 file changed, 16 insertions(+), 16 deletions(-)
```

R1–R15 y R17 tienen fichero::describe y los hashes con sus mensajes. R13
enumera c14, c16, c18, c20, c22 y c25. R15 registra c30 y el rojo de S15 sin
commit. R16 conserva literalmente su gate humano y `n/a`. Las diez
casillas `Enmienda #173 aprobada por humano` se comprobaron sin marcar.

K4 incorpora este fichero con el mensaje literal
`docs(mobile-tab-screens-canvas-fidelity): informe de implementación de #173`,
mediante `--only`. Su hash se obtiene de HEAD después de commitearlo.

K5 compara las 33 rutas contra H0 sobre ese HEAD, después del commit del
informe, siguiendo el orden K4→K5. El literal que debe producir el comando
para aceptar este cierre es:

```text
lista-ok
```

Se ejecuta inmediatamente después de `--only`; un resultado diferente
requiere parar y documentarlo. Se deja explícito este orden para no
presentar una comprobación del HEAD del propio informe antes de crearlo.

## 8. Desviaciones

### Reanudación 10

Leí primero «Reanudación 10» el 2026-10-14. No ejecuté de nuevo las
Reanudaciones 1–9. Comprobación inicial desde mobile-pet-tracker/:

```text
9222e9819f7a604c82414a8e03e56b0662f23173
 M src/__tests__/profile-canvas-fidelity.test.ts
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

`git diff --cached --no-renames --name-only` no produjo salida: índice
vacío. HEAD y las cuatro líneas coinciden. Se aplicó E7 a mano únicamente
en el describe de R15: tipo `string[]` de classSections y conteo de sombras
que admite las dos antiguas de Card. No se cambió producción. Las tres
cuentas prescritas dieron literalmente:

```text
1
1
0
```

El exit=1 del último grep significa cero coincidencias de la aserción vieja,
tal como pide la nota. Se ejecuta el bucle de espera y se relanza c30 con
el ejecutor `sed + bash -c`. Antes de parar se aplican las reglas
«Reintento» y «Flake de un it ajeno». H0 se conserva; las mediciones del
leader mencionadas en la nota no se presentan como corridas propias.

El bucle terminó con `fin-espera` (exit=0). El relanzamiento de c30 pasó
sin requerir reintento adicional:

```text
exit=0
$ tsc --noEmit
[feature/173-mobile-tab-screens-canvas-fidelity 2ed3a7fc] test(mobile): candados de grep-limpio de Perfil (#173 R15)
 1 file changed, 20 insertions(+)
cadena=0
Test Suites: 21 passed, 21 total
Tests:       990 passed, 990 total
```

M1–M51 `ok` se conservan enteros en §6. Typecheck sin errores y lint vacío.
E7 resuelve el bloqueo anterior sin cambiar los literales de producción.
Se continúa con S15 y K1–K5.

S15 cumplió las cuatro salidas requeridas (1, un rojo propio de R15,
25 tests verdes y `limpio=0`), copiadas en §5. K1 registró las once
cuentas estáticas de ficheros de tests en §7. K2 pasó con K=990.
El bucle previo de K3 terminó con `fin-espera`; se ejecuta el ALL.

#### Flake de un it ajeno en K3

La primera corrida del ALL dio `exit=1`. El primer guard VERDE de K3
(`grep` de las 104 suites verdes) devolvió 1, sin salida. Líneas literales:

```text
  ● R1: me card › shows the real account name and email

    Unable to find an element with text: Ada Lovelace

Test Suites: 1 failed, 103 passed, 104 total
Tests:       1 failed, 3212 passed, 3213 total
Time:        93.554 s
```

El total sigue siendo T=3213. No hay otro ● ni `reading 'canceled'`.
Conforme a «Reanudación 10» y a la petición de aplicar las reglas antes
de parar, se aplica «Flake de un it ajeno»: el único it fallido no tiene
#173 en su título. Se corre profile/index.test.tsx solo dos veces y se
cuentan exclusivamente los ● del título de R1 con E6. No se cambia código.
No se presenta este fallo como el flake `canceled` de #72/#168.

Las dos corridas sueltas dieron literalmente:

```text
Tests:       131 passed, 131 total
0
Tests:       131 passed, 131 total
0
```

El exit=1 del bucle procede del grep con cero coincidencias del último ●,
no de Jest. Las dos suites están verdes y el it ajeno no falla. Se corre
el bucle de espera y se repite el ALL entero UNA vez, sin cambios al árbol.

El bucle terminó con `fin-espera`. El único reintento pasó, y el guard de
K3 confirmó el total requerido:

```text
exit=0
Test Suites: 104 passed, 104 total
Tests:       3213 passed, 3213 total
all-ok T=3213
```

No hizo falta la excepción de `canceled` de #72/#168. Se continúa con los
checks finales de K3 y el cierre documental K4–K5.

Los checks finales de tipos y lint pasaron con `exit=0`, `lint-ok` y log
de lint vacío. El conteo anterior a K4 dio `30`. La trazabilidad se
commiteó como `9f822605`, con R16 intacto. El informe se incorpora con
`--only` y después se ejecuta K5 sobre ese HEAD, como explica §7. No se
ejecutó init.sh; no se tocaron, restauraron ni commitearon el handoff o
progress/current.md. No se repitieron las Reanudaciones 1–9.

### Reanudación 9

Leí primero «Reanudación 9» el 2026-10-14. No ejecuté las Reanudaciones
1–8 de nuevo. Comprobación inicial desde mobile-pet-tracker/:

```text
5e48dc406d7b29b96af8351873c237ff1a58ec37
 M src/__tests__/profile-canvas-fidelity.test.ts
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

`git diff --cached --name-only` no produjo salida: índice vacío. Coinciden
HEAD y las cuatro rutas. Se conservan intactos los tests de c26. Según la
nota, el leader hizo tres corridas sueltas sobre una copia de src idéntica:
`Tests: 131 passed, 131 total` las tres y 0 líneas ● del it ajeno de R1.
No las presento como mediciones propias. E6 ya está aplicada por el leader:
la regla cuenta solo líneas ●, excluyendo los ✓ de tests verdes.

Se ejecuta el bucle de espera y se relanza c26 UNA vez con el ejecutor
`sed + bash -c`, sin copiar ni sustituir la cadena. Resultado pendiente.
Si c26 vuelve a parar, se para. Desde c27 se aplicarán «Reintento» y «Flake
de un it ajeno» antes de parar. H0 se conserva; no se ejecuta init.sh ni se
editan handoff o progress/current.md.

El bucle terminó con `fin-espera` (exit=0). El único relanzamiento de c26
pasó: `exit=1` (Jest rojo), `cadena=0`, commit `1bb49c33`.
Jest: `Test Suites: 1 failed, 20 passed, 21 total` y
`Tests:       16 failed, 971 passed, 987 total`. Solo los ● esperados de R14,
sin crash. Typecheck: `$ tsc --noEmit`, sin errores; lint vacío. E5 evitó
la falsa detección de ReferenceError en prosa; no se modificó ningún test.

c27 pasó con `cadena=0`, commit `4369cafc`, BASE21 de 21 suites y
`Tests:       987 passed, 987 total`. M50 y M51 dieron `1\tok`. Se añadieron
los diez bloques canónicos y sus firmas sin marcar, los tokens de letra,
las variantes/radios/tonal y las excepciones de dimensiones. Las frases
antiguas candadas de §12 y §13 se conservaron literalmente. No se ejecutó
TSLINT en esa cadena documental, tal como fija el handoff.

#### Flake de un it ajeno en c28

La primera cadena c28 paró en SOLO. Salida del ejecutor:

```text
exit=1
cadena=1
```

Salida literal de Jest:

```text
  ● R1: me card › shows the real account name and email
  ● R2: estructura Figma › uses the canvas artboard metrics (#173 R17) and content-sized skeletons while loading
Test Suites: 1 failed, 20 passed, 21 total
Tests:       2 failed, 985 passed, 987 total
```

Solo sobra el it de R1, sin #173 en su título. Se aplica «Flake de un it
ajeno» con E6: dos corridas sueltas de profile/index.test.tsx y cuenta
exclusiva de líneas ● de `shows the real account name and email`.
No se cambian tests ni implementación. Resultado de las corridas pendiente.

Las dos corridas sueltas dieron, literalmente:

```text
Tests:       1 failed, 130 passed, 131 total
0
Tests:       1 failed, 130 passed, 131 total
0
```

El único rojo de ambas es el propio R17. El it ajeno no falla ninguna vez:
se clasifica como flake conforme a la regla. Se corre el bucle de espera y
se relanza la cadena entera c28 UNA vez con el ejecutor, sin editar código.

El bucle terminó con `fin-espera`. El reintento de c28 pasó con
`cadena=0`, commit `0b6d8329`, `Test Suites: 1 failed, 20 passed, 21 total`
y `Tests:       1 failed, 986 passed, 987 total`. El único ● es R17;
typecheck sin errores y lint vacío. Se continúa con c29.


c29 pasó con `cadena=0`, commit `9222e981`, BASE21 de 21 suites y
`Tests:       987 passed, 987 total`. M41–M44 dieron sus valores de cierre:
0, 0, 1, 1. Typecheck sin errores y lint vacío.

#### PARADA en c30: guard VERDE de BASE21

Se escribió únicamente el describe `#173 R15: grep-limpio` de paso 1,
con un `it.each` para los tres ficheros exigidos. No se cambió producción.
Se lanzó una vez c30 mediante el ejecutor literal:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c30 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
```

El mcheck previo pasó con M1–M51 `ok` (salida completa en §6). Después,
la salida exacta del ejecutor fue:

```text
exit=1
cadena=1
```

**Primer eslabón que falla:**
`grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c30.txt`.
No imprime salida; devuelve 1 porque Jest da una suite fallida. El guard
siguiente de Tests:, TSLINT, staging, LIMPIO y commit no se alcanzaron.
Los logs anteriores de tipos y lint corresponden a c29, no a c30.

Salida literal del resumen de fallos de `/tmp/173-c30.txt`:

```text
Summary of all failing tests
FAIL src/__tests__/profile-canvas-fidelity.test.ts
  ● #173 R15: grep-limpio › components/card.tsx no tiene escapes de estilo

    expect(received).not.toMatch(expected)

    Expected pattern: not /\bshadow-/
    Received string:      "import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
    import { twMerge } from 'tailwind-merge';

    import { CONTINUOUS_CORNER } from '../theme/native-styles';

    const variantClassNames = {
      surface: 'rounded-card border border-border bg-surface p-4 shadow-sm',
      accent: 'rounded-card bg-accent p-5 shadow-sm',
      secondary:
        'rounded-card border border-border bg-surface-secondary p-4',
      hero: 'rounded-hero bg-surface-secondary p-4.5',
      flat: 'rounded-card border border-border bg-surface px-3.5 py-1',
    } as const;

    export type CardVariant = keyof typeof variantClassNames;

    export type CardProps = ViewProps & {
      variant?: CardVariant;
      onPress?: () => void;
      className?: string;
    };

    export function Card({
      variant = 'surface',
      onPress,
      className,
      style,
      ...rest
    }: CardProps) {
      const mergedClassName = twMerge(variantClassNames[variant], className);
      const mergedStyle = StyleSheet.flatten([CONTINUOUS_CORNER, style]);

      if (onPress) {
        return (
          <Pressable
            {...rest}
            accessibilityRole=\"button\"
            className={mergedClassName}
            style={mergedStyle}
            onPress={onPress}
          />
        );
      }

      return <View {...rest} className={mergedClassName} style={mergedStyle} />;
    }
    "

      148 |     expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      149 |     expect(source).not.toMatch(/StyleSheet\.create/);
    > 150 |     expect(source).not.toMatch(/\bshadow-/);
          |                        ^
      151 |   });
      152 | });
      153 |

      at toMatch (src/__tests__/profile-canvas-fidelity.test.ts:150:24)


Test Suites: 1 failed, 20 passed, 21 total
Tests:       1 failed, 989 passed, 990 total
Snapshots:   0 total
Time:        24.26 s, estimated 26 s
Ran all test suites within paths "src/app/(tabs)/__tests__/food.test.tsx", "src/screens/welcome/index.test.tsx", "src/__tests__/design-drift.test.ts", "src/__tests__/consistency-classnames.test.ts", "src/theme/__tests__/global-css.test.ts", "src/providers/__tests__/language-provider.test.tsx", "src/__tests__/ui-language.test.ts", "src/screens/profile/index.test.tsx", "src/components/__tests__/empty-state.test.tsx", "src/__tests__/legibility-classnames.test.ts", "src/__tests__/hero-header-amendments.test.ts", "src/theme/__tests__/motion.test.ts", "src/__tests__/hosting-artifacts.test.ts", "src/__tests__/tab-headers-canvas.test.ts", "src/components/__tests__/card.test.tsx", "src/components/__tests__/pet-switcher.test.tsx", "src/theme/__tests__/font-registration.test.ts", "src/app/(tabs)/__tests__/profile.test.tsx", "src/screens/home/index.test.tsx", "src/app/(tabs)/__tests__/screens.test.tsx", "src/__tests__/profile-canvas-fidelity.test.ts".
```

**Reglas aplicadas antes de parar.** «Reintento» no habilita otro intento:
no hay `reading 'canceled'` ni `Exceeded timeout`, y TSLINT no se alcanzó.
No hay `ReferenceError:`, `SyntaxError:` ni `Failed to run` en el log.
«Flake de un it ajeno» tampoco aplica: el único ● pertenece a `#173 R15`.
No se corrió otro Jest, bucle ni ejecutor después de este fallo.

**Contradicción de la spec que explica el fallo:** R3.2 exige conservar
sin cambios los literales de las tres variantes antiguas de Card; `surface`
y `accent` contienen `shadow-sm`. R15.2 exige que `components/card.tsx`
entero no case `/\bshadow-/`. Las variantes nuevas `hero` y `flat` sí
carecen de sombra y los literales antiguos se conservaron conforme a R3.2.
Se documenta la incompatibilidad; no se cambia el guard ni las variantes
antiguas para eludirla.

S15 y K1–K5 quedan sin ejecutar. R16 continúa pendiente del humano.
El describe nuevo de c30 queda sin commit, índice vacío. Estado final
comprobado desde mobile-pet-tracker/:

```text
9222e9819f7a604c82414a8e03e56b0662f23173
 M src/__tests__/profile-canvas-fidelity.test.ts
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

No se ejecutó init.sh ni se editaron, restauraron o commitearon el handoff
y progress/current.md. Este informe permanece sin commit por la parada.

### Reanudación 8

Leí primero «Reanudación 8» el 2026-10-14. No ejecuté las Reanudaciones
1–7 de nuevo. HEAD y status iniciales desde mobile-pet-tracker/:

```text
5e48dc406d7b29b96af8351873c237ff1a58ec37
 M src/__tests__/profile-canvas-fidelity.test.ts
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

`git diff --cached --name-only` no produjo salida: índice vacío. Coinciden
HEAD y las cuatro líneas. No se modifica ningún test ni código a mano.
E5 ya está hecha por el leader en el handoff: SINCRASH busca
`ReferenceError:` y `SyntaxError:` con dos puntos, para distinguir un error
ejecutado de la prosa del Received. Se conservan los 16 tests de R14.
Se corre el bucle de Reintento y se relanza c26 con el ejecutor
`sed + bash -c`, sin copiar ni sustituir la cadena. Resultado pendiente.
Si c26 vuelve a parar, se para. H0 se conserva; no se ejecuta init.sh ni se
editan handoff o progress/current.md.

El bucle terminó con la salida literal `fin-espera` (exit=0). Se relanzó
c26 únicamente con el ejecutor del handoff:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c26 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
```

**Bloqueo de Reanudación 8: c26, guard SOLO.** Salida exacta del ejecutor:

```text
exit=1
cadena=1
```

Jest dio estas líneas literales:

```text
Test Suites: 2 failed, 19 passed, 21 total
Tests:       17 failed, 970 passed, 987 total
```

ROJO pasa. SOLO falla: además de los 16 rojos previstos de #173 R14, sale
un it fuera de su lista. Encabezado y mensaje literales:

```text
  ● R1: me card › shows the real account name and email

    Unable to find an element with text: Ada Lovelace
```

Es el mismo it ajeno descrito en Reanudación 2; no se presenta esta corrida
como una nueva comprobación de flake. «Reanudación 8» dice «Si c26 vuelve
a parar, PARA»: se detiene sin corridas sueltas, otra espera ni otro
relanzamiento. No se alteran los tests ni se toca la cadena. SINCRASH,
tipos, lint, staging y commit no se alcanzaron; E5 se conserva en el
handoff del leader. Los logs antiguos de tipos/lint no cuentan como
checks de esta corrida.

c27–c30, S15 y K1–K5 no se ejecutaron. R16 sigue pendiente del humano.
El test pcf queda sin commit, intacto; índice vacío. HEAD y status
literales desde mobile-pet-tracker/:

```text
5e48dc406d7b29b96af8351873c237ff1a58ec37
 M src/__tests__/profile-canvas-fidelity.test.ts
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

`git diff --cached --name-only` no produjo salida. Solo se actualizó este
informe; no hubo cambios manuales en código/tests ni commits nuevos. No
se ejecutaron init.sh, Prettier, push, PR, merge, amend ni rebase. Handoff
y progress/current.md no se editaron, añadieron, restauraron ni commitearon.

Lista literal de ● del relanzamiento de c26, sin Console (duplicados de resumen omitidos):

```text
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en docs/ui-guidelines.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-pets-profile/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-ui-legibility-polish/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-ui-consistency-polish/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-ui-language/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-tab-headers-canvas/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-device-pairing/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-geofences/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-chunky-cta/requirements.md
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-home-weekly-activity/requirements.md
  ● #173 R14: la carta declara los cambios › declara los radios hero y tile en la regla 12
  ● #173 R14: la carta declara los cambios › declara la cápsula tonal sin labio en la regla 13
  ● #173 R14: la carta declara los cambios › declara las variantes nuevas de Card
  ● #173 R14: la carta declara los cambios › declara los tokens de letra fuera de escala
  ● #173 R14: la carta declara los cambios › declara la excepción de dimensiones en conventions
  ● #173 R14: la carta declara los cambios › declara la excepción de dimensiones en la regla 6 de la carta
  ● R1: me card › shows the real account name and email
```

Salida exacta del fallo ajeno, incluido el árbol que imprime Jest:

```text
  ● R1: me card › shows the real account name and email

    Unable to find an element with text: Ada Lovelace

    [36m<RNCSafeAreaProvider>[39m
      [36m<Text[39m
        [33mtestID[39m=[32m"selected-pet-id"[39m
      [36m>[39m
        [0mnone[0m
      [36m</Text>[39m
      [36m<TextInput[39m
        [33mtestID[39m=[32m"language-state-probe"[39m
        [33mvalue[39m=[32m""[39m
      [36m/>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-profile"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"profile-title"[39m
            [36m>[39m
              [0mPerfil[0m
            [36m</Text>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"profile-add-pet"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityElementsHidden[39m=[32m{true}[39m
                [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                [33mtestID[39m=[32m"profile-add-pet-icon"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"profile-icon-plus"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAñadir mascota[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"profile-hero-skeleton"[39m
          [36m/>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"pet-info-skeleton"[39m
          [36m/>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"profile-entrance-links"[39m
          [36m>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"profile-links"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"profile-links-row-0"[39m
              [36m>[39m
                [36m<View[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33mtestID[39m=[32m"reminders-link"[39m
                [36m>[39m
                  [36m<View[39m
                    [33maccessibilityElementsHidden[39m=[32m{true}[39m
                    [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                    [33mtestID[39m=[32m"reminders-link-icon"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"profile-icon-bell"[39m
                    [36m/>[39m
                  [36m</View>[39m
                  [36m<Text>[39m
                    [0mRecordatorios[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"profile-entrance-account"[39m
          [36m>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"me-card"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"me-card-skeleton"[39m
              [36m/>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"theme-row"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mUsar tema oscuro[0m
                [36m</Text>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"Usar tema oscuro"[39m
                  [33maccessibilityState[39m=[32m{
                    {
                      "checked": false,
                    }
                  }[39m
                  [33maccessibilityValue[39m=[32m{
                    {
                      "text": "off",
                    }
                  }[39m
                  [33maccessible[39m=[32m{true}[39m
                  [33maria-valuetext[39m=[32m"off"[39m
                  [33mrole[39m=[32m"switch"[39m
                  [33mtestID[39m=[32m"theme-toggle"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mrole[39m=[32m"presentation"[39m
                  [36m/>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Cambiar idioma"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityValue[39m=[32m{
                  {
                    "text": "Español",
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"language-toggle"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mCambiar idioma[0m
                [36m</Text>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"language-value"[39m
                [36m>[39m
                  [0mEspañol[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<View[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessibilityState[39m=[32m{
              {
                "disabled": false,
              }
            }[39m
            [33maccessible[39m=[32m{true}[39m
            [33mtestID[39m=[32m"profile-sign-out"[39m
          [36m>[39m
            [36m<View[39m
              [33mpointerEvents[39m=[32m"none"[39m
              [33mstyle[39m=[32m{
                {
                  "opacity": 0,
                }
              }[39m
            [36m/>[39m
            [36m<Text>[39m
              [0mCerrar sesión[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m

      380 |
      381 |     await waitFor(() => expect(screen.getByTestId('me-card')).toBeVisible());
    > 382 |     expect(screen.getByText('Ada Lovelace')).toBeVisible();
          |                   ^
      383 |     expect(screen.getByText('ada@example.test')).toBeVisible();
      384 |     expect(mockGetMe).toHaveBeenCalledWith(apiUrl, 'jwt-token');
      385 |   });

      at Object.getByText (src/screens/profile/index.test.tsx:382:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

### Reanudación 7

Leí primero «Reanudación 7» el 2026-10-14. No ejecuté las Reanudaciones
1–6 de nuevo. HEAD y status iniciales desde mobile-pet-tracker/:

```text
b73f49636f2417d0c271c423c611ca930558334e
 M src/__tests__/ui-copy-table.ts
 M src/__tests__/ui-language.test.ts
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

`git diff --cached --name-only` no produjo salida: índice vacío. Coinciden
HEAD y las seis líneas. Apliqué E4 a mano únicamente en la línea value de
última señal: `Date.now()` pasa a `detail.dataUpdatedAt`. El «ahora» será
el instante de la última carga del detalle, que se recarga en cada foco.
No cambié formatLastSignal, los tests ni los otros dos ficheros de c18.
Se corre el bucle de Reintento y se relanza c18 con el ejecutor
`sed + bash -c`, sin copiar ni sustituir la cadena. Resultado pendiente.
Si c18 vuelve a parar, se para. H0 se conserva; no se ejecuta init.sh ni se
editan handoff o progress/current.md.

Tras E4, status conservó las mismas seis líneas. El bucle esperó a Jest
de otra sesión y terminó con `fin-espera` (exit=0), sin alterar procesos.
Se relanzó c18 con el ejecutor. Salida literal antes del commit:

```text
exit=0
$ tsc --noEmit
```

Terminó en `cadena=0`, commit `9b01360f`. BASE21:
`Test Suites: 21 passed, 21 total`, `Tests:       947 passed, 947 total`.
Typecheck verde y lint vacío. Se continúa con c19, solo tests de R10 (1).

c19–c25 se completaron con el ejecutor y `cadena=0`, en orden y con los
mensajes previstos. La tabla de §4 conserva sus hashes y Tests: literales.
Todos pasaron tipos y lint; los rojos c19, c21 y c23 tuvieron únicamente
los ● permitidos y ningún crash. c25 nació verde por la excepción de R13.

**Bloqueo de Reanudación 7: c26, guard SINCRASH.** Se escribieron solo los
tests de R14 en profile-canvas-fidelity.test.ts: diez casos de enmiendas y
seis de declaraciones de la carta. Los dos casos de márgenes nacieron
rojos, conforme a M50=0 y M51=0 en H0. No se tocaron docs ni specs para c27.
La cadena se lanzó solo con el ejecutor:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c26 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
```

Salida exacta del ejecutor:

```text
exit=1
cadena=1
```

Jest dio `Test Suites: 1 failed, 20 passed, 21 total` y
`Tests:       16 failed, 971 passed, 987 total`. ROJO, SOLO y ALGUNO pasan:
los 16 fallos son de #173 R14. SINCRASH falla por las dos coincidencias
de `ReferenceError` en /tmp/173-c26.txt (líneas 16739 y 22957). Ambas
pertenecen al Received que imprime la aserción toContain del bloque
canónico ausente en specs/mobile-ui-language/requirements.md; Jest repite
la misma salida en el resumen. No es un ReferenceError ejecutado: es prosa
del documento. Encabezado y fragmento literales:

```text
  ● #173 R14: enmiendas › lleva el bloque canónico y firma tolerante en specs/mobile-ui-language/requirements.md
    1. Reintroducir **un literal de copy conocido** en una pantalla ya migrada,
       nombrando cuál y dónde.
    2. Observar que `describe('#65 R18…')` se pone rojo **por su aserción** —no por
       un `ReferenceError`— y que el mensaje **nombra el archivo** contaminado.
    3. Revertir la mutación y dejar la suite verde.·
    El commit rojo de R18 deja de ser obligatorio; el resto de su ciclo (verde y
```

Se para conforme al handoff. ReferenceError no es un caso autorizado de
Reintento; no se cambia la aserción para reducir su salida ni el guard para
seguir. No se alcanzaron tipos, lint, staging ni commit de c26. Los logs
de tsc/lint existentes son de cadenas anteriores y no cuentan como checks
de c26. La guarda de ausencia de router.d.ts dio `router-ausente=0` en la
inspección posterior; el fichero no se tocó.

c27–c30, S15 y K1–K5 no se ejecutaron. R16 queda pendiente del humano.
El único fichero de c26 modificado es el test pcf, sin commit; índice vacío.
HEAD y status literales desde mobile-pet-tracker/:

```text
5e48dc406d7b29b96af8351873c237ff1a58ec37
 M src/__tests__/profile-canvas-fidelity.test.ts
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

`git diff --cached --name-only` no produjo salida. H0 se conserva; no se
ejecutaron init.sh, Prettier, push, PR, merge, amend ni rebase. Handoff y
progress/current.md no se editaron, añadieron, restauraron ni commitearon.

### Reanudación 6

Leí primero «Reanudación 6» el 2026-10-14. No ejecuté las Reanudaciones
1–5 de nuevo. Comprobaciones iniciales desde mobile-pet-tracker/:

```text
897953312ce74baa3c1c12ead42646dc6b55bef3
 M ../docs/ui-guidelines.md
 M src/__tests__/ui-copy-table.ts
 M src/__tests__/ui-language.test.ts
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

`git diff --cached --name-only` no produjo salida: índice vacío. HEAD y las
siete líneas coinciden. Apliqué a mano E3a: las seis líneas de la viñeta de
enums de specs/mobile-ui-language/design.md §6.3 quedan idénticas a las de
la carta. E3b cambia únicamente `female` por `Hembra` en la expectativa de
R2 de profile/index.test.tsx. No se cambió nada más en esos dos ficheros
ni en los cuatro de c14; E2 se conserva sin repetirla. La cadena de c14
actualizada por el leader admite ambas rutas nuevas en staged.

Se ejecuta el bucle de Reintento y luego el ejecutor de c14 (`sed + bash -c`),
sin copiar ni sustituir la cadena. Resultado pendiente. Si c14 vuelve a
parar, se para. H0 se conserva; no se ejecuta init.sh ni se editan handoff
o progress/current.md.

Tras E3, git status añadió exactamente las dos rutas prescritas:
` M src/screens/profile/index.test.tsx` y
` M ../specs/mobile-ui-language/design.md`. Sus numstat fueron, respectivamente,
`1\t1` y `3\t2`. El bucle esperó a Jest de otra sesión y terminó con
`fin-espera` (exit=0), sin alterar ni terminar procesos.

El relanzamiento de c14 pasó. Salida literal del ejecutor antes del commit:

```text
M13	2	ok
M28	0	ok
exit=0
$ tsc --noEmit
```

Terminó en commit `bf21fbbd`, `cadena=0`; BASE21:
`Test Suites: 21 passed, 21 total` y `Tests:       912 passed, 912 total`.
Typecheck verde y lint vacío. E3b entra en el verde por excepción expresa
de la nota del leader; no se añadió ningún test nuevo en c14. Se continúa
con c15, solo tests de R8 (1) y las filas correspondientes de R13.

c15 pasó con `cadena=0`, commit `427079ac`, `Tests:       12 failed, 909 passed, 921 total`,
todos los ● autorizados, sin crash y con tipos/lint limpios. c16 pasó con
`cadena=0`, commit `92308138`, `Tests:       921 passed, 921 total`, M10=0,
tipos verdes y lint vacío. c17 pasó con `cadena=0`, commit `b73f4963`,
`Tests:       24 failed, 923 passed, 947 total`, todos los ● de R9, sin crash,
tipos verdes y lint vacío. La tabla y las listas literales de rojos se
conservan en §4.

**Bloqueo de Reanudación 6: c18, TSLINT (bunx expo lint --no-cache).**
Se implementó formatLastSignal local con el `Date.now()` en render
prescrito por requirements R9.1, junto con las tres filas de copy y su
delta de longitud. La cadena se lanzó únicamente con el ejecutor:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c18 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
```

Salida literal del ejecutor:

```text
exit=0
$ tsc --noEmit
cadena=1
```

BASE21 pasó: `Test Suites: 21 passed, 21 total` y
`Tests:       947 passed, 947 total`. Typecheck pasó sin errores.
El siguiente eslabón, expo lint sin caché, falla con `react-hooks/purity`
en src/screens/profile/index.tsx:341:64 por la llamada a Date.now(). No es
`Failed to run`, canceled, timeout ni un it ajeno: no se aplica Reintento.

Se para conforme al handoff. No se suprime ni cambia la regla, no se altera
el reloj ni los tests y no se relanza c18. No se alcanzaron staging ni
commit de c18. c19–c30, S15 y K1–K5 no se ejecutaron; R16 sigue pendiente
del humano. Los tres ficheros de c18 quedan sin commit y el índice está
vacío. No se ejecutaron init.sh, Prettier, push, PR, merge, amend ni rebase.
Handoff y progress/current.md no se editaron, añadieron, restauraron ni
commitearon. H0 se conserva.

Salida exacta completa de /tmp/173-lint.txt:

```text

/home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker/src/screens/profile/index.tsx
  341:64  error  Error: Cannot call impure function during render

`Date.now` is an impure function. Calling an impure function can produce unstable results that update unpredictably when the component happens to re-render. (https://react.dev/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent).

/home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker/src/screens/profile/index.tsx:341:64
  339 |               isLast
  340 |               label={t('profile.lastSignal')}
> 341 |               value={formatLastSignal(pet.lastCommunicationAt, Date.now(), t, locale)}
      |                                                                ^^^^^^^^^^ Cannot call impure function
  342 |             />
  343 |           </Card>
  344 |  react-hooks/purity

✖ 1 problem (1 error, 0 warnings)

error: "eslint" exited with code 1

```

HEAD y status literales al detenerse, desde mobile-pet-tracker/:

```text
b73f49636f2417d0c271c423c611ca930558334e
 M src/__tests__/ui-copy-table.ts
 M src/__tests__/ui-language.test.ts
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

`git diff --cached --name-only` no produjo salida.

### Reanudación 5

Leí primero «Reanudación 5» el 2026-10-14. No ejecuté las Reanudaciones
1–4 de nuevo. HEAD y status iniciales, literales desde mobile-pet-tracker/:

```text
897953312ce74baa3c1c12ead42646dc6b55bef3
 M ../docs/ui-guidelines.md
 M src/__tests__/ui-copy-table.ts
 M src/__tests__/ui-language.test.ts
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

Coinciden HEAD y las siete rutas. Apliqué E2 a mano: solo la línea del chip
de sexo se convierte en el bloque de siete líneas y sangría exacta de la
nota. No cambié nada más en profile/index.tsx ni los otros tres ficheros
de c14. M13 sigue contando líneas; no se modifica la medida firmada.
Se ejecuta el bucle de Reintento y, cuando termine, se relanza c14 con el
ejecutor `sed + bash -c`, sin copiar ni sustituir la cadena. Resultado
pendiente. Si c14 vuelve a parar, se para. H0 se conserva; no se ejecuta
init.sh ni se editan handoff o progress/current.md.

El bucle terminó con la salida literal `fin-espera` (exit=0). Se relanzó
c14 con el ejecutor del handoff:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c14 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
```

**Bloqueo de Reanudación 5: c14, guard VERDE.** Salida exacta del ejecutor:

```text
M13	2	ok
M28	0	ok
exit=1
cadena=1
```

M13 y M28 pasaron. La BASE21 no cumple el primer guard VERDE, que exige
21 suites verdes. Salidas literales del log `/tmp/173-c14.txt`:

```text
  ● #65 R20: la carta de UI fija el catálogo y el español por defecto › inserta el punto 6 literal de §6.3 en §Dirección de arte
  ● R2: estructura Figma › renders the active pet hero, switcher, pills and information rows
Test Suites: 2 failed, 19 passed, 21 total
Tests:       2 failed, 910 passed, 912 total
```

El primer fallo está en src/__tests__/ui-language.test.ts:389: compara
la carta con `canonicalArtDirectionRule()` de la spec #65, que aún incluye
`pet.sex` entre los enums crudos. R7 retira ese enum de la carta. El segundo
está en src/screens/profile/index.test.tsx:474: sigue buscando `female`,
pero R7 pinta `Hembra`. Mensaje literal: `Unable to find an element with
text: female`. No se modifican esos candados.

«Reanudación 5» dice «Si c14 vuelve a parar, PARA». Se aplica esa instrucción:
no se hacen corridas sueltas de flake, no se vuelve a esperar ni relanzar,
no se corrige código ni tests. No se alcanzaron tipos, lint, staging ni
commit de c14. c15–c30 y K1–K5 no se ejecutaron. El índice está vacío.
HEAD y status literales tras detenerse, desde mobile-pet-tracker/:

```text
897953312ce74baa3c1c12ead42646dc6b55bef3
 M ../docs/ui-guidelines.md
 M src/__tests__/ui-copy-table.ts
 M src/__tests__/ui-language.test.ts
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

Solo se hizo E2 en el código y se actualizó este informe. Los otros tres
ficheros de c14 se conservaron intactos. No se ejecutaron init.sh, Prettier,
push, PR, merge, amend ni rebase. Handoff y progress/current.md no se
editaron, añadieron, restauraron ni commitearon.

Salida exacta del resumen de los dos fallos de Jest (incluye el árbol que
imprime getByText; sin modificar el log):

```text
Summary of all failing tests
FAIL src/__tests__/ui-language.test.ts
  ● #65 R20: la carta de UI fija el catálogo y el español por defecto › inserta el punto 6 literal de §6.3 en §Dirección de arte

    expect(received).toContain(expected) // indexOf

    Expected substring: "**6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`."
    Received string:    "# Carta de UI — mobile-pet-tracker·
    > Fuente de verdad de UI/UX móvil para TODOS los agentes (Claude, subagentes,
    > Codex CLI). Toda spec, implementación y review de trabajo móvil se valida
    > contra este documento. Complementa `docs/conventions.md` §Convenciones de
    > la app móvil; ante conflicto, gana el más específico.·
    ## Skills: quién carga qué·
    Las guías genéricas viven en las skills oficiales de Expo — instaladas en
    Claude Code (plugin `expo`) y en Codex CLI (`codex plugin add
    expo@openai-curated`, mismo contenido v1.12+). Este doc NO las duplica:
    fija las decisiones ya tomadas en ESTE repo.·
    | Tarea móvil | Skill a cargar antes de trabajar |
    |---|---|
    | Cualquiera (routing/entrada) | `expo-overview` → deriva a la específica |
    | Tokens, tema, componentes reusables | `expo-design-system` |
    | Estilo nativo, safe areas, HIG | `expo-native-ui` |
    | Sheets, pickers, menus, toggles | `expo-ui` |
    | Animaciones, gestos, haptics | `expo-animation` (en Claude: `animate-expo`) |
    | Tailwind/uniwind | `expo-tailwind-setup` |
    | Diseñar/mejorar una pantalla o flujo completo | `appllama-app-design-skill` (obligatoria, ver abajo) |·
    Subagentes y handoffs a Codex deben instruir explícitamente la carga de la
    skill pertinente (regla ya en memoria de sesión; aquí queda oficial).·
    ### `appllama-app-design-skill`: cuándo y con qué límites·
    Instalada en `.agents/skills/` (universal: Claude Code y Codex CLI la ven).
    Se carga en **toda** tarea de UI móvil — pantalla nueva, rediseño, flujo,
    onboarding, estados vacíos, jerarquía visual, semántica de navegación
    (push vs replace, sheet vs modal, puertas de un solo sentido). Aporta el
    listón de \"se siente nativa\" y la disciplina anti-slop.·
    Tres límites, no negociables:·
    1. **La carta gana siempre sobre la skill.** La skill asume colores
       semánticos nativos (`Color.ios.label`) y su propio sistema de estilos;
       este repo usa Tailwind v4 + uniwind + heroui-native con tokens en
       `global.css` (§Decisiones fijas 1-3). De la skill se toma el **patrón**
       (esqueleto, jerarquía, motion, navegación), nunca el sistema de estilos.
       Cualquier sugerencia suya que meta hex, `StyleSheet.create` o clases
       arbitrarias se descarta: rompe el grep-clean.
    2. **Su \"simulator loop\" no aplica tal cual.** Pide iOS Simulator en macOS
       (`xcrun simctl io recordVideo`); aquí la verificación es la prueba de
       humo que corre el humano en Android (dev build o Expo Go según la
       feature). El checklist de la skill sirve como guion de esa prueba, no
       como comando a ejecutar.
    3. **`appllama-usage` sí está disponible, pero solo en Claude Code.** El
       MCP `mcp.appllama.io` se contrató el 2026-10-04 (plan Pro: 1500 créditos
       al mes, cada llamada gasta uno, `get_credits` es gratis) y la skill
       `appllama-usage` está instalada en Claude. La fase «estudiar 20-30
       pantallas reales antes de diseñar» la corre el **leader** antes de
       lanzar al `spec_author` y deja el resultado en
       `progress/explore_<tema>.md` con ids durables de app y pantalla (las URL
       de imagen caducan en una hora, así que nunca se enlazan). Del material se
       toma el patrón, no los píxeles; se ignora la marca de agua y no se barre
       el catálogo. **Codex no tiene el MCP** (mismo hueco que B5): el handoff
       le pasa el fichero de explore y la spec, nunca le pide que investigue.
       El primer explore de este tipo es `progress/explore_ui-appllama.md`
       (#115-#119).·
    ## Decisiones fijas de este repo (no re-litigar)·
    1. **Sistema de estilos**: Tailwind v4 + uniwind + heroui-native. Tokens en
       `mobile-pet-tracker/src/theme/global.css` — ÚNICA entrada. Prohibido
       crear un segundo sistema (theme.ts paralelo, StyleSheet.create,
       styled-components).
    2. **Tokens obligatorios**: todo valor visual repetido es un token en
       `@theme` de global.css. Existentes: colores semánticos light/dark,
       fuentes Inter, `--radius-card: 20px`, `--text-2xs: 10px`. Si un valor
       nuevo se repite 2+, se añade token — no clase arbitraria.
    3. **Grep-clean permanente** (criterio de aceptación de toda feature móvil):
       - cero hex fuera de `src/theme/`
       - cero clases arbitrarias `[...]` (`rounded-[20px]`, `text-[10px]`,
         `p-[13px]`...) — usar el token; si no existe, crearlo primero
       - cero `StyleSheet.create`, cero shadow/elevation legacy (solo `boxShadow`)
    4. **Componentes compartidos** (`src/components/`): `card.tsx`
       (surface|accent|secondary — usa `--radius-card`, NUNCA heredar `--radius`
       de heroui/shadcn, bug #46), `pet-switcher.tsx` (selector de mascota,
       siempre este), `floating-tab-bar.tsx`, `weight-chart.tsx`, `pet-map.tsx`
       (adapta el contrato del tab Map a la API nativa de `expo-maps`). Regla de
       extracción: ≥2 pantallas + rol nombrable + API menor que implementación.
       Promoción: inline → `src/screens/<x>/` → `src/components/`.
    5. **Base de componentes**: heroui-native (Button, Skeleton, TextField,
       Avatar, Chip...). `@expo/ui` para lo que heroui no cubre, PERO con esta
       distinción (aprendida por crash real en el smoke de #39, Android + Expo
       Go): **la capa root/universal de `@expo/ui` (SwiftUI/Jetpack) crashea en
       Expo Go Android**. El default se mantiene en la capa
       **`@expo/ui/community/*`** porque sus wrappers funcionan tanto en Expo Go
       como en dev builds:
       `community/bottom-sheet` (montado sobre @gorhom/bottom-sheet — esa dep es
       peer del wrapper, NO removerla), `community/datetime-picker`,
       `community/menu`, `community/picker`, `community/slider`,
       `community/segmented-control`. Adoptar la capa root de `@expo/ui`, aunque
       el smoke use dev build desde #54, requiere una feature separada; esta
       decisión no se cambia de paso. `List`+`ListItem` solo para filas agrupadas
       cortas estilo Settings — NO es virtualizada; listas de datos de longitud
       desconocida: FlatList/FlashList. Prohibido: importar @gorhom directamente
       (siempre vía el wrapper community), Reanimated para sheets,
       Picker/SafeAreaView/WebView de RN (removidos).
    6. **Dimensiones de pantalla**: conventions.md §Dimensiones — `paddingTop:
       insets.top + 12`, `padding: 24`, `gap: 16`, `paddingBottom: insets.bottom
       + 96` vía `useSafeAreaInsets` en `contentContainerStyle` (nunca en el
       ScrollView mismo). Overlays absolutos usan `insets.top + 12`, jamás
       top fijo. `contentInsetAdjustmentBehavior=\"automatic\"` NO sustituye el
       paddingTop (no-op en Android).
       **Excepción nombrada, enmienda A9 de #67**: si el primer hijo del scroll es
       una **cabecera a sangre**, el `contentContainerStyle` conserva `gap` y
       `paddingBottom`, el padding horizontal de 24 baja a un envoltorio interior,
       y el `paddingTop: insets.top + 12` lo asume la cabecera vía su slot. Las
       ramas de estado sin cabecera llevan su propio envoltorio con ese
       `paddingTop`.·
       **Excepción nombrada (enmienda A11 de #95, 2026-09-23)**: una pantalla empujada
       sobre el Stack raíz con cabecera nativa (`headerShown: true`) —hoy
       `add-reminder`, `pets/add`, `pets/[petId]/docs`, `weight-log`,
       `meal-schedule`, `pairing`, `reminders`, `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23), `alerts/[alertId]` (por la enmienda A15 de #100, 2026-09-28), `pets/[petId]/geofences` (por la enmienda A18 de #41, 2026-10-02) y `pets/[petId]/geofence-editor` (por la enmienda A19 de #146, 2026-10-02) y `meals-history` (por la enmienda A20 de #105, 2026-10-04)— no lleva `paddingTop: insets.top + 12`, porque
       el inset superior lo consume la cabecera, ni `paddingBottom: insets.bottom +
       96`, porque sobre ella no flota el `FloatingTabBar`. Su
       `contentContainerStyle` es `padding: 24`, `gap: 16` y `paddingBottom:
       insets.bottom + 24`, la misma holgura inferior que `(auth)` y
       `reset-password`.
    7. **Estados de carga**: Skeleton de heroui dimensionado como el contenido
       final. Prohibido Spinner suelto que salte el layout.
    8. **Estructura**: route delgado en `src/app/` + pantalla en `src/screens/`
       (conventions.md §estructura Expo oficial, desde #39). Archivos kebab-case.
       Rutas con extensión de plataforma jamás dentro de `src/app/`.
    9. **Tema**: light/dark vía uniwind; colores para código imperativo (mapas,
       iconos) SIEMPRE vía `useThemeColors` de `src/theme/use-theme-colors.ts`
       (reactivo; bug de resolución stale ya visto en #46). El mapa traduce la
       preferencia guardada a `colorScheme` de `expo-maps` mediante
       `src/components/pet-map.tsx`.
    10. **Composición de mapas nativos**: ningún ancestro de una vista nativa de
        mapa puede declarar fondo opaco (`bg-*`). El mapa se compone por detrás de
        la ventana y un fondo encima lo tapa sin producir ningún error. Los estados
        sin mapa declaran su fondo cada uno.
    11. **Desviación declarada del Figma en el acento** (feature #61,
        2026-09-03). `--accent` vale **`#178255`**, no el `#2AB87C` que #46 R1
        tomó del Make. El verde del diseño da 2,55:1 con etiqueta blanca encima y
        no hay forma de pasar AA conservándolo: o se oscurece el relleno o se
        oscurece la letra, y el humano eligió lo primero para que el CTA siga
        siendo verde con letra blanca. Se conserva el hue (154,7°, el mismo del
        Make) y se baja la luminancia hasta **4,82:1** con blanco. Consecuencia
        asumida: los rellenos ya **no** coinciden 1:1 con el Make y el smoke lado
        a lado lo verá; es esperado, no un defecto. El acento como **tinta**
        (texto, enlaces, iconos, trazos) es `--accent-strong`, que en dark
        recupera el `#2AB87C` original porque sobre fondo oscuro un verde oscuro
        es ilegible. Regla mecánica: **fondo ⇒ `--accent`; encima de otra cosa ⇒
        `--accent-strong`.**
    12. **Escala de radios** (feature #62, 2026-09-04). Tres radios, uno por rol,
        y ninguno más:
        - **Superficie de card** → `rounded-card` (token `--radius-card`, 20 px).
          Se obtiene usando `src/components/card.tsx`, no repitiendo la clase.
        - **Control, tile, input, botón y píldora de dato** → `rounded-xl`
          (12 px), que es el mismo valor que `--field-radius: 0.75rem`, de modo
          que botón e input comparten esquina dentro de un formulario.
        - **Cápsula** (chip, avatar, píldora de pestaña, botón circular de
          volver) → `rounded-full`.·
        `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm` quedan
        **prohibidos en `mobile-pet-tracker/src/`**: no son un cuarto rol, son
        drift. El grep que lo verifica vive en
        `src/__tests__/consistency-classnames.test.ts`.·
        Dos corolarios mecánicos: todo `Skeleton` lleva el radio del contenido
        que sustituye (card ⇒ `rounded-card`, control ⇒ `rounded-xl`), y toda
        esquina no-cápsula **que el repo dibuja por su cuenta** (`View`,
        `Pressable`, `TextInput`, el `Card` compartido) declara
        `style={CONTINUOUS_CORNER}` de `src/theme/native-styles.ts` — los
        componentes de heroui-native ya lo traen de fábrica y no se envuelven
        para añadírselo.·
    13. **Botón con cuerpo** (feature #166, 2026-10-11). Los botones de acción
        llevan un labio inferior: un borde inferior más grueso que los
        laterales, nunca una sombra.
        - **Primario sólido** (todo `Button` con `rounded-xl bg-accent`):
          `rounded-xl bg-accent border-b-4 border-black/25`
          El labio va detrás de `bg-accent`, nunca delante: el recuento de
          primarios de `consistency-classnames` busca `rounded-xl bg-accent`
          seguido de espacio o comilla.
        - **Secundario neutro** (`variant=\"outline\"` o `variant=\"secondary\"`
          sin relleno tonal, y el secundario de Bienvenida):
          `rounded-xl border-2 border-b-6 border-lip-gray bg-surface`
          El gris sale del token `--color-lip-gray` de `src/theme/global.css`,
          nunca de un hex ni de una clase entre corchetes.
        - **Sin labio**: los tonales (`bg-accent-soft`, `bg-default`), los
          destructivos (`bg-danger`, `variant=\"danger-soft\"`) y las primarias
          de heroui sin color en `className` (reintentos, confirmar alerta).
        Los inventarios que lo verifican viven en
        `src/__tests__/consistency-classnames.test.ts`.·
    ## Animación (decisiones por defecto)·
    - Reanimated 4 en UI thread; nada que dependa de JS thread para gestos.
    - Springs sobre timings para elementos que entran/salen o responden a
      gesto; timings solo para opacidad/color. Duraciones: 150ms feedback,
      250ms transición, 400ms superficies grandes — viven en
      `src/theme/motion.ts` (enmienda A21 de #152).
    - Entering/exiting de Reanimated para cambios de estado visibles
      (aparición de cards, resultados de fetch).
    - Nunca pasar valores `Color`/`PlatformColor`/var CSS a estilos de
      Reanimated — color estático resuelto con `useThemeColors`.
    - Interrumpible siempre: un gesto puede cortar cualquier animación en curso.
    - `prefers-reduced-motion` respetado (Reanimated `ReducedMotionConfig` o
      guard equivalente).
    - expo-haptics está instalado desde #106 (2026-09-21), autorizado por el
      humano en el gate de specs/mobile-meals-bar-motion/. Se usa con la tabla de
      la skill expo-animation §8: selectionAsync para un detent, impactAsync para
      un commit de gesto, notificationAsync(Success|Error) para una operación que
      termina bien o mal. Tres reglas absolutas: mismo frame que el visual, uno
      por acción del usuario, y nunca el único feedback.
    - El runtime de smoke del humano es el dev build de Android desde 2026-08-27;
      `expo-maps` no está disponible en Expo Go.
    - Backlog priorizado con valores exactos: `progress/audit_animations_mobile.md`.·
    ## Micro-reglas de pulido (de expo-native-ui, adoptadas)·
    - `borderCurve: 'continuous'` en toda esquina redondeada no-cápsula.
    - `gap` sobre margin; padding sobre margin.
    - `<Text selectable />` en datos copiables y mensajes de error.
    - Contadores/números alineados: `fontVariant: ['tabular-nums']`.
    - Números grandes formateados (1.4M, 38k).
    - Feedback pressed en TODO elemento tappable (Pressable style function o
      componente heroui que ya lo trae); touch target ≥ 44pt.
    - Títulos de pantalla: header del stack cuando exista, no Text suelto.·
    ## Dirección de arte·
    > Añadida el 2026-09-04 tras `progress/explore_design-gap-vs-make.md`. Hasta
    > aquí esta carta era un sistema de estilos —tokens, radios, componentes— y no
    > decía nada sobre qué debe *parecer* ni qué debe *responder* una pantalla. El
    > brief del producto sí lo dice, y las specs no lo estaban leyendo.·
    **1. Paleta pastel categórica.** El brief pide un producto \"amigable, lúdico,
    con colores pastel\". Cuando una pantalla distingue **categorías** —tipos de
    recordatorio, tipos de documento, destinos de acceso rápido— cada categoría
    lleva su propio fondo pastel, no el mismo `accent-soft` para todas. Esos
    fondos son **tokens de `global.css`**, nunca hex sueltos ni clases arbitrarias:
    la regla de §Decisiones fijas 3 no tiene excepción por ser \"un color de
    adorno\". Los valores del Make son de tema claro y no traen equivalente
    oscuro: el dark se diseña, no se copia, y cada par texto/superficie se
    verifica AA con contraste **calculado**, como fijó #61.·
    Los seis huecos, cerrados (feature #64, 2026-09-04). Toda sección categórica
    consume estos tokens; ninguna inventa un hex ni una clase arbitraria:·
    | Hueco | Superficie | Tinta | Tipos que lo ocupan |
    |---|---|---|---|
    | azul | `bg-category-blue` | `text-category-blue-strong` | recordatorio `vaccine`; documento de vacunación |
    | ámbar | `bg-category-amber` | `text-category-amber-strong` | recordatorio `medication`; documento de desparasitación |
    | verde | `bg-category-green` | `text-category-green-strong` | recordatorio `appointment`; documento de consulta |
    | violeta | `bg-category-violet` | `text-category-violet-strong` | recordatorio `deworming`; documento de análisis |
    | rosa | `bg-category-rose` | `text-category-rose-strong` | recordatorio `food` |
    | neutral | `bg-default` | `text-muted` | recordatorio `weight` y `custom`; cualquier tipo de documento desconocido |·
    El reparto vive en `src/utils/category-palette.ts` y es el **único** sitio donde
    se escriben esos nombres de clase. El color nunca es el único portador de la
    categoría: la superficie siempre acompaña a un emoji y a un texto.·
    **2. Fotografía y su respaldo.** Las cabeceras fotográficas asumen que la
    mascota tiene foto. Cuando no la tiene, el respaldo es el **blobatar**
    determinista de la mascota, que es lo que `pet-avatar` pinta de verdad. Ni
    ilustración por especie ni foto obligatoria en el alta. Y sea cual sea la
    imagen, **el texto que va encima pasa AA**.·
    > **Enmendado por #67 (A8) — corrección de un hecho falso.** Hasta el
    > 2026-09-06 este punto decía *\"el respaldo es degradado con la inicial —el
    > patrón que ya usa `pet-avatar`—, decidido por el humano el 2026-09-04\"*.
    > Era falso de origen: `src/components/pet-avatar.tsx` pinta `blobatar(name)`
    > con `SvgXml` y nunca una inicial, y la R5 aprobada de #40 (2026-08-21)
    > sustituyó explícitamente el fallback de inicial por el blobatar. El error
    > venía de `progress/explore_design-gap-vs-make.md` y se propagó también al
    > enunciado de #67 en `feature_list.json`. Y la garantía de AA no la da el
    > degradado: la da la **banda opaca** bajo el texto (#67 R3), porque ningún
    > velo sobre una foto arbitraria llega a 4,5:1.·
    **3. Las siete preguntas de la Home.** El brief fija qué debe responder la
    pantalla principal: ¿está segura?, ¿dónde está?, ¿el collar está conectado?,
    ¿tiene batería?, ¿tiene algún recordatorio pendiente?, ¿cómo fue su actividad
    hoy?, ¿hay alguna alerta? Toda spec que toque la Home **declara cuáles de las
    siete responde y cuáles no**, y por qué. No es decoración: es el criterio de
    aceptación de la pantalla.·
    **4. Nada de jerga del proveedor.** El brief lo prohíbe explícitamente: los
    términos técnicos de Wialon no se muestran al usuario final. Si un dato solo
    se puede explicar con vocabulario de la integración, se traduce o no se
    enseña.·
    **5. Fidelidad no es pérdida de información.** El diseño oculta datos que la
    app ya sirve (la rejilla del mapa, el perfil nutricional, los avisos de plan)
    y no dibuja estados que existen de verdad, como el 402 de \"sin suscripción\".
    Parecerse al diseño **no** autoriza a borrar un dato útil: la spec que se
    encuentre con uno o lo conserva, o escribe por qué se va.·
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `document.type`,
      `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.
      `pet.sex` se localiza desde #173 con `addPet.male` / `addPet.female`.·
    **7. Voz de Pingo: guardián sereno.** Decidido por el humano el 2026-10-07
    (D1 de la feature #153): la mascota se llama **Pingo** y habla con la voz B,
    «guardián sereno». Rige todo texto que la app pone en boca de Pingo
    (bocadillos, estados vacíos, celebraciones, avisos); el resto del copy sigue el
    punto 6 sin más. Cada frase nueva de Pingo entra con su clave en los dos
    idiomas, como cualquier otra copy.·
    - **Tono:** tranquilo y cálido; da seguridad. En español, tutea.
    - **Persona:** Pingo habla en primera persona («te ayudo», «te recomiendo») y
      llama a la mascota del usuario por su nombre, con el marcador `{{petName}}`.
    - **Sin emoji**, en ningún idioma.
    - **Exclamaciones solo para celebrar.** Un saludo, un aviso o un estado vacío
      terminan en punto.
    - **Sin bromas en las alertas.** Una alerta de Pingo dice qué pasa y qué hacer.
    - **En inglés, registro neutro.**
    - **Bucles de reposo.** Flotar, parpadear y los tres anillos de ping que
      rodean a Pingo en la bienvenida son las únicas animaciones continuas de
      Pingo, y una excepción declarada a §Animación: animan `translateY`,
      `scale` y `opacity` con timing y duraciones fuera de 150/250/400,
      porque no entran, ni salen, ni responden a un gesto. Sus constantes viven en
      `src/theme/motion.ts` y no arrancan con reduce motion.·
    ## Checklist de autocrítica (cierra toda pantalla nueva o modificada)·
    Screenshot mental (o real en smoke) contra: jerarquía (lo importante
    primero), proximidad (relacionado más cerca), repetición (esquinas/sombras/
    acentos iguales = tokens), alineación (bordes comparten ejes). Si una
    pantalla falla el mismo check dos veces, el fix va al theme o a un
    componente — no a la pantalla.·
    ## Enmienda #67 — cabecera fotográfica compartida·
    `mobile-pet-hero-header` (#67) modifica una decisión que esta spec dejó
    aprobada. La spec de origen es `specs/mobile-pet-hero-header/`; el detalle de
    la enmienda está en su `requirements.md` §R10.·
    - Spec enmendada: `docs/ui-guidelines.md`
    - Qué cambia: `enmiendas A8 y A9 de la tabla de #67 §R10`
    - Qué NO cambia: ningún otro requisito de esta spec, ni su estado de
      aprobación, ni los tests que ya la cubren.·
    - [X] Enmienda aprobada por humano·
    ## Enmienda #70 — elementos repetidos: qué hay que candar·
    > Añadida el 2026-09-09. Tres features seguidas —#69, #71, #70— cerraron con el
    > mismo patrón: la revisión destapa una dimensión sin vigilar, se cierra, y la
    > siguiente revisión destapa otra por el mismo mecanismo. Cuatro rondas, cuatro
    > dimensiones. Esta lista existe para que la quinta no haga falta.·
    Cuando una pantalla pinta un **elemento repetido** —una celda de una tira, un
    tile de una rejilla, una fila de una lista— la spec enumera **todas** las
    decisiones que ese elemento toma, y el criterio de aceptación es siempre el
    mismo: **cruzar cualquiera de ellas entre dos elementos pone la suite roja**,
    observado con `within(elemento)`.·
    **Decisiones de conducta, una por elemento:**·
    1. el **dato que muestra** — el más olvidado;
    2. componente de icono;
    3. etiqueta visible / clave de copy;
    4. **nombre accesible** — se cruza igual en un elemento solo-icono, donde
       ninguna aserción de texto lo ve;
    5. color o hueco de fondo;
    6. **tinta del icono**;
    7. **color y receta tipográfica de cada texto** — no solo del principal;
    8. destino de navegación;
    9. **condición de render** — mueve la cardinalidad, así que el recuento se
       verifica en más de un escenario;
    10. **forma del contenedor** (`flex-row items-center gap-*`) — y en **todas** sus
        ramas, no solo la cargada: si el estado vacío promete \"la misma anatomía de
        fila\", eso es una aserción, no una frase del título del test;
    11. **envoltorios de agrupación** (`flex-1` y equivalentes) que reparten el
        espacio;
    12. **orden de los hijos**. `within(row).getByTestId(...)` es **agnóstico al
        orden**: intercambiar dos textos deja la suite entera verde. Se cierra
        fijando la posición, p. ej.
        `expect(row.children[1]).toHaveProperty('props.className', 'flex-1')`.·
    **Estructurales, del contenedor:** identidad, orden y cardinalidad. El recuento
    se cierra con `children.length`, **nunca contando coincidencias de `testID`** —
    un recuento por prefijo deja pasar cualquier hijo sin `testID`.·
    **Invariantes compartidos, a inventariar aparte:** tamaño de icono, objetivo
    táctil y reparto, radio, rol y agrupación accesible, sitio de render, y feedback
    de pulsado.·
    > **Inventariar no es candar.** Añadido el 2026-09-09 tras #85: la spec copió
    > esta lista en prosa —incluido \"tamaño de icono\"— y aun así el `size={20}` del
    > icono de fila quedó sin una sola aserción: ponerlo a `28` dejó la suite móvil
    > completa verde. Cada invariante de esta lista necesita **un `expect`**, no una
    > mención. Y ojo con el caso que lo produjo: un `size` renderizado **por
    > variable** no lo ve ningún recuento de literales en el fuente.·
    **Método**: cada candado se demuestra con una sonda —cruzar el valor en
    producción, ver el rojo, restaurar con `git diff` vacío— y la evidencia se
    escribe. Un candado que nadie vio fallar no es un candado.·
    ## Enmienda #98 — la barra de comidas de la Home·
    `mobile-meals-served-ui` (#98) añade a la sección de recordatorios una barra
    informativa de las comidas servidas hoy. Se pinta solo con detalle cargado y
    `mealsToday !== null`, inmediatamente después de la próxima vacuna y antes del
    estado vacío o de las filas de recordatorio.·
    **Decisiones de conducta de la barra:**·
    1. el dato es `mealsToday.served` de `mealsToday.total`;
    2. el icono es `ForkKnife`, con `size={20}`;
    3. el título usa la clave `food.mealsToday`;
    4. el contador usa como nombre accesible la clave
       `food.mealsServedOfTotal`, con `served` y `total`;
    5. el disco del icono ocupa el hueco **rosa** de la paleta categórica:
       `bg-category-rose`, asignado al tipo `food`;
    6. la tinta del icono es `category-rose-strong` resuelta por
       `useThemeColors`;
    7. el título usa `text-sm font-semibold text-foreground` y el contador
       `text-xs font-normal text-muted` con cifras tabulares;
    8. no navega ni lleva `onPress`;
    9. solo se renderiza cuando el detalle es `ok` y `mealsToday !== null`;
    10. el `Card` compone una fila `flex-row items-center gap-3`;
    11. el contenido se agrupa en una columna `flex-1 gap-1.5`, con cabecera y
        carril;
    12. el orden es disco del icono y columna; dentro de la columna, cabecera y
        carril; dentro de la cabecera, título y contador.·
    **Estructura e invariantes:** la fila tiene dos hijos, igual que la columna y
    la cabecera; el carril tiene un único relleno. El disco es una cápsula de
    36 px, el carril usa `h-1.5 overflow-hidden rounded-full bg-default` y el
    relleno usa `h-full rounded-full bg-accent`. Esto último aplica la regla fija
    **fondo ⇒ `bg-accent`**; `bg-accent-strong` sería tinta, no fondo. El ancho se
    calcula como el porcentaje redondeado de `served / total`, o `0%` si el total
    es cero.·
    - [X] Enmienda aprobada por humano··
    ## Enmienda #152 — el movimiento vive en src/theme/motion.ts·
    Enmienda A21: Reanimated consume números y §Animación prohíbe pasarle
    variables CSS. Las duraciones y configuraciones compartidas de movimiento
    viven en `src/theme/motion.ts`.·
    `motion.ts` no es un segundo sistema de estilos en el sentido de
    §Decisiones fijas 1: no contiene colores, espaciados, radios ni clases,
    solo duraciones y configuraciones de Reanimated. Tiene los precedentes
    `native-styles.ts` y `touch-target.ts` en la misma carpeta.·
    Las constantes anteriores a #152 (`MEALS_BAR_TIMING`, `KCAL_BAR_TIMING`,
    `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y `TAB_INDICATOR_SPRING`) migran a
    `motion.ts` en una feature posterior, fuera del alcance de esta.
    `WELCOME_ENTRANCE_MS` no está en la lista: la retiró #153, cuya bienvenida
    usa `MOTION_FADE_TIMING` y `MOTION_SETTLE_SPRING` (enmienda E1 de #153).·
    - [X] Enmienda aprobada por humano·
    ## Enmienda #167 — anillos de ping de la bienvenida·
    Los tres anillos de ping de la bienvenida amplían los bucles de reposo de
    §Animación punto 7. Cada anillo es un círculo de borde `border-accent` que
    crece de `MOTION_PING_FROM` a `MOTION_PING_TO_SCALE` mientras su opacidad cae
    de `MOTION_PING_FROM` a 0, con `MOTION_PING_TIMING`, en bucle infinito y sin
    invertir. Los anillos arrancan escalonados un tercio de la duración. Con
    reduce motion no se pintan.·
    Ninguna otra pantalla usa anillos de ping sin una enmienda propia.·
    - [X] Enmienda aprobada por humano·
    ## Enmienda #168 — título grande en Salud, Nutrición y Perfil·
    `mobile-tab-headers-canvas` (#168) modifica una decisión que esta spec dejó
    aprobada. La spec de origen es `specs/mobile-tab-headers-canvas/`; el detalle
    de la enmienda está en su `requirements.md` §R11.·
    - Spec enmendada: `docs/ui-guidelines.md`
    - Qué cambia: `regla N1: título grande en Salud, Nutrición y Perfil; hero solo en Inicio`
    - Qué NO cambia: ningún otro requisito de esta spec ni su estado de
      aprobación. Los tests que cubren lo enmendado se reescriben en #168 (lista
      en su `tasks.md`).·
    - [X] Enmienda #168 aprobada por humano·
    **Regla N1 (enmienda B4 de #168)**: Salud, Nutrición y Perfil abren con el título grande; Inicio es la única pestaña con PetHeroHeader. Devolver el hero a una de las tres es una enmienda a #168.
    "

      387 |     );
      388 |
    > 389 |     expect(charter).toContain(canonicalArtDirectionRule());
          |                     ^
      390 |   });
      391 |
      392 |   it('lo coloca tras el punto 5 y antes del checklist de autocrítica', () => {

      at Object.toContain (src/__tests__/ui-language.test.ts:389:21)

FAIL src/screens/profile/index.test.tsx (115.315 s)
  ● R2: estructura Figma › renders the active pet hero, switcher, pills and information rows

    Unable to find an element with text: female

    [36m<RNCSafeAreaProvider>[39m
      [36m<Text[39m
        [33mtestID[39m=[32m"selected-pet-id"[39m
      [36m>[39m
        [0mpet-1[0m
      [36m</Text>[39m
      [36m<TextInput[39m
        [33mtestID[39m=[32m"language-state-probe"[39m
        [33mvalue[39m=[32m""[39m
      [36m/>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-profile"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"profile-title"[39m
            [36m>[39m
              [0mPerfil[0m
            [36m</Text>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"profile-add-pet"[39m
            [36m>[39m
              [36m<View[39m
                [33maccessibilityElementsHidden[39m=[32m{true}[39m
                [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                [33mtestID[39m=[32m"profile-add-pet-icon"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"profile-icon-plus"[39m
                [36m/>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mAñadir mascota[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<View>[39m
            [36m<View[39m
              [33maccessibilityState[39m=[32m{
                {
                  "selected": true,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"pet-chip-pet-1"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mLuna[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"profile-pet-card"[39m
          [36m>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"profile-pet-avatar-ring"[39m
            [36m>[39m
              [36m<ViewManagerAdapter_ExpoImage[39m
                [33mplaceholder[39m=[32m{[]}[39m
                [33mtestID[39m=[32m"profile-pet-avatar"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Cambiar foto"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "disabled": false,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mtestID[39m=[32m"change-photo"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"profile-icon-camera"[39m
                [36m/>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"profile-pet-name"[39m
            [36m>[39m
              [0mLuna[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"profile-pet-chips"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"profile-pet-chip-sex"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mHembra[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"profile-pet-chip-sterilized"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mEsterilizado[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"profile-pet-chip-age"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0m30 meses[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"profile-pet-chip-weight"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0m12 kg[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"pet-info-card"[39m
          [36m>[39m
            [36m<Text>[39m
              [0mInformación[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<Text>[39m
                [0mRaza[0m
              [36m</Text>[39m
              [36m<Text>[39m
                [0mMixed[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<Text>[39m
                [0mMicrochip[0m
              [36m</Text>[39m
              [36m<Text>[39m
                [0m985141004123456[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<Text>[39m
                [0mDispositivo GPS[0m
              [36m</Text>[39m
              [36m<Text>[39m
                [0mPetTrack One[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<Text>[39m
                [0mÚltima señal[0m
              [36m</Text>[39m
              [36m<Text>[39m
                [0m21/8/2026, 12:00:00 p.m.[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<View[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
            [33mtestID[39m=[32m"documents-link"[39m
          [36m>[39m
            [36m<View[39m
              [33maccessibilityElementsHidden[39m=[32m{true}[39m
              [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
              [33mtestID[39m=[32m"documents-link-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"profile-icon-file-text"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text>[39m
              [0mDocumentos[0m
            [36m</Text>[39m
            [36m<RNSVGSvgView>[39m
              [36m<RNSVGGroup>[39m
                [36m<RNSVGGroup>[39m
                  [36m<RNSVGPath />[39m
                [36m</RNSVGGroup>[39m
              [36m</RNSVGGroup>[39m
            [36m</RNSVGSvgView>[39m
          [36m</View>[39m
          [36m<View[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
            [33mtestID[39m=[32m"pairing-link"[39m
          [36m>[39m
            [36m<View[39m
              [33maccessibilityElementsHidden[39m=[32m{true}[39m
              [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
              [33mtestID[39m=[32m"pairing-link-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"profile-icon-wifi"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text>[39m
              [0mConfiguración del Dispositivo GPS[0m
            [36m</Text>[39m
            [36m<RNSVGSvgView>[39m
              [36m<RNSVGGroup>[39m
                [36m<RNSVGGroup>[39m
                  [36m<RNSVGPath />[39m
                [36m</RNSVGGroup>[39m
              [36m</RNSVGGroup>[39m
            [36m</RNSVGSvgView>[39m
          [36m</View>[39m
          [36m<View[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
            [33mtestID[39m=[32m"geofences-link"[39m
          [36m>[39m
            [36m<View[39m
              [33maccessibilityElementsHidden[39m=[32m{true}[39m
              [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
              [33mtestID[39m=[32m"geofences-link-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"profile-icon-map"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text>[39m
              [0mZonas seguras[0m
            [36m</Text>[39m
            [36m<RNSVGSvgView>[39m
              [36m<RNSVGGroup>[39m
                [36m<RNSVGGroup>[39m
                  [36m<RNSVGPath />[39m
                [36m</RNSVGGroup>[39m
              [36m</RNSVGGroup>[39m
            [36m</RNSVGSvgView>[39m
          [36m</View>[39m
          [36m<View[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
            [33mtestID[39m=[32m"reminders-link"[39m
          [36m>[39m
            [36m<View[39m
              [33maccessibilityElementsHidden[39m=[32m{true}[39m
              [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
              [33mtestID[39m=[32m"reminders-link-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"profile-icon-bell"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text>[39m
              [0mRecordatorios[0m
            [36m</Text>[39m
            [36m<RNSVGSvgView>[39m
              [36m<RNSVGGroup>[39m
                [36m<RNSVGGroup>[39m
                  [36m<RNSVGPath />[39m
                [36m</RNSVGGroup>[39m
              [36m</RNSVGGroup>[39m
            [36m</RNSVGSvgView>[39m
          [36m</View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"me-card"[39m
          [36m>[39m
            [36m<Text>[39m
              [0mCuenta[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"me-card-skeleton"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"theme-toggle"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mUsar tema oscuro[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityLabel[39m=[32m"Cambiar idioma"[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"language-toggle"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnglish[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<View[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessibilityState[39m=[32m{
              {
                "disabled": false,
              }
            }[39m
            [33maccessible[39m=[32m{true}[39m
            [33mtestID[39m=[32m"profile-sign-out"[39m
          [36m>[39m
            [36m<View[39m
              [33mpointerEvents[39m=[32m"none"[39m
              [33mstyle[39m=[32m{
                {
                  "opacity": 0,
                }
              }[39m
            [36m/>[39m
            [36m<Text>[39m
              [0mCerrar sesión[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m

      472 |     expect(screen.getAllByText('Mixed').length).toBeGreaterThanOrEqual(1);
      473 |     expect(screen.getByTestId('pet-chip-pet-1')).toBeVisible();
    > 474 |     expect(screen.getByText('female')).toBeVisible();
          |                   ^
      475 |     expect(screen.getByText('Esterilizado')).toBeVisible();
      476 |     expect(screen.getByText('30 meses')).toBeVisible();
      477 |     expect(screen.getByText('12 kg')).toBeVisible();

      at Object.getByText (src/screens/profile/index.test.tsx:474:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

### Reanudación 4

El usuario autorizó retomar c11 el 2026-10-14. Leí primero «Reanudación 4» y
no ejecuté las Reanudaciones 1, 2 y 3 otra vez. HEAD y estado inicial,
literales desde mobile-pet-tracker/:

```text
166c8af4f7241fcdbe73cdb129d5bd0091a61622
 M src/__tests__/consistency-classnames.test.ts
 M src/__tests__/legibility-classnames.test.ts
 M src/__tests__/profile-canvas-fidelity.test.ts
 M src/screens/profile/index.test.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

Coinciden HEAD y las siete rutas de la nota. Conservé los tests de c11 sin
editar. Según el leader, la lista SOLO omitía #64 R9 y el worker serializaba
nodos circulares al fallar toBe; cambió la cadena para admitir #64 R9 y correr
Jest en serie con `-i`. Todas las cadenas rojas restantes usan ahora `-i`;
las verdes no cambian. La medición del leader fue 12 fallidos, 892 pasados,
904 total, sin crash; no la presento como una medición propia.

Se corre el bucle de espera de Reintento y se relanza c11 con el ejecutor,
sin copiar ni sustituir la cadena. Resultado: pendiente. Si vuelve a parar,
se detiene la sesión. No se ejecuta init.sh.

Durante la espera, el patrón detectó únicamente el proceso bash PID 2417675
de otra sesión, cuyo comando contiene una ruta de Jest dentro de otra espera.
Se informó al usuario; eligió «Cerrar la espera desde el leader». No se
modificó el bucle ni se terminó ese proceso desde esta sesión. Se espera la
salida real `fin-espera` antes de relanzar c11.

El proceso desapareció tras el cierre desde el leader y el bucle terminó
con la salida literal `fin-espera` (exit=0). Se relanza c11 con el ejecutor
`sed + bash -c` del handoff, sin editar los cuatro ficheros de tests.

El relanzamiento pasó: `exit=1` (Jest rojo), `cadena=0`, commit `f785d96c`.
Jest dio `Test Suites: 4 failed, 17 passed, 21 total` y
`Tests:       12 failed, 892 passed, 904 total`. Todos los ● están en la
lista autorizada; sin crash. Typecheck: `$ tsc --noEmit`, sin errores;
lint vacío. Se continúa con c12; no se repiten reanudaciones anteriores.

c12 pasó con `cadena=0`, commit `fe0dc8a5`, `Tests:       904 passed, 904 total`,
M3=0, M6=1 y M45=0, tipos verdes y lint vacío. c13 pasó con `cadena=0`,
commit `89795331`, `Tests:       18 failed, 894 passed, 912 total`, todos los
● dentro de la lista, sin crash, typecheck sin errores y lint vacío.

**Bloqueo de Reanudación 4: c14, primer eslabón (mcheck M13).** Se escribió
la implementación de R7 (2), sus dos filas de copy, el delta de longitud y
la viñeta de enums de la carta. Se ejecutó la cadena únicamente mediante
el ejecutor del handoff:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c14 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
```

Salida exacta del ejecutor:

```text
M13	1	DIFF cierre=2
M28	0	ok
cadena=1
```

M13 ejecuta `grep -cF 'pet.sex' src/screens/profile/index.tsx`: cuenta
líneas, no ocurrencias. Escribí las dos condiciones de sexo en la misma
línea de la fila del chip; por eso mide 1 en vez de las 2 líneas prescritas.
Salida literal de la inspección de esa línea:

```text
68:    { testID: 'profile-pet-chip-sex', slot: 'blue', text: pet.sex === 'male' ? t('addPet.male') : pet.sex === 'female' ? t('addPet.female') : null },
```

Se para conforme al handoff: no se corrige el formato, no se modifica
mcheck ni requirements y no se relanza c14. No se alcanzaron Jest, tipos,
lint, staging ni commit de c14; `/tmp/173-c14.txt` no existe. c15–c30 y K1–K5
no se ejecutaron. Los cuatro ficheros de c14 quedan sin commit; el índice
está vacío. HEAD y status literales desde mobile-pet-tracker/:

```text
897953312ce74baa3c1c12ead42646dc6b55bef3
 M ../docs/ui-guidelines.md
 M src/__tests__/ui-copy-table.ts
 M src/__tests__/ui-language.test.ts
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

No se ejecutó init.sh, Prettier, push, PR, merge, amend ni rebase. El
handoff y progress/current.md no se editaron, añadieron, restauraron ni
commitearon desde esta reanudación.

Lecturas/documentación auxiliares posteriores al bloqueo: una búsqueda
inicial usó rutas de specs desde mobile-pet-tracker/ y produjo:

```text
rg: specs/mobile-tab-screens-canvas-fidelity/mcheck.py: No such file or directory (os error 2)
rg: specs/mobile-tab-screens-canvas-fidelity/requirements.md: No such file or directory (os error 2)
```

La lectura correcta desde la raíz permitió explicar M13; no se repitió la
cadena. Un primer patch del impl no se aplicó por un contexto inexistente:

```text
apply_patch verification failed: Failed to find expected lines in /home/claude/sites/Pet-Tracker-wt-173/progress/impl_mobile-tab-screens-canvas-fidelity.md:
Se continúa con c12; no se repiten reanudaciones anteriores.
```

Se corrigió únicamente el patch del informe.

#### Repetición de la petición de Reanudación 4 (2026-10-14)

El usuario volvió a pedir retomar c11 con la misma nota. Leí primero
«Reanudación 4» y ejecuté únicamente la comprobación inicial de HEAD y
status desde mobile-pet-tracker/. Salida exacta:

```text
897953312ce74baa3c1c12ead42646dc6b55bef3
 M ../docs/ui-guidelines.md
 M src/__tests__/ui-copy-table.ts
 M src/__tests__/ui-language.test.ts
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

El primer chequeo falla: HEAD es c13 (`89795331`), no c10 (`166c8af4`).
Aunque hay siete líneas, cuatro rutas tampoco coinciden con las de la nota:
son los cambios sin commit de c14, en vez de los cuatro ficheros de tests
de c11. c11, c12 y c13 ya quedaron commiteados durante la Reanudación 4
anterior; su evidencia y el bloqueo de c14 se conservan arriba.

Se para conforme a la nota. No se ejecuta el bucle de espera ni ninguna
cadena, no se repite c11 ni las Reanudaciones 1–3 y no se corrige c14.
Solo se actualiza este informe: no se editan tests, implementación,
handoff ni progress/current.md; no se restaura nada, no se crean commits
y no se ejecuta init.sh. H0 sigue siendo el original.

### Reanudación 3

El usuario autorizó retomar c10 el 2026-10-14 con la enmienda E1 del leader.
Leí «Reanudación 3». No ejecuté las Reanudaciones 1 y 2 de nuevo. Comprobación
inicial, literal:

```text
aaeb9bab25df063bcbde8fa98e52a0727ae2eb63
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

HEAD y las cuatro rutas coinciden con la nota. Conservé sin cambios la
implementación de c10. Edité a mano únicamente la línea E1 en
src/__tests__/consistency-classnames.test.ts: la cuenta de primaryRadius pasa
de `13 + 1 + 1 + 1 + 1 + 1 + 1` a esa fórmula `- 1`, con `// #173 R5`, tal
como fija la nota. Es una excepción expresa del leader: entra en el verde
c10, cuyo staged admite ahora los dos ficheros. La nota remite al rojo del
gemelo de #98 R10 en c9; el fallo propio de #62 R1 también está registrado
en Reanudación 2.

El bucle de espera terminó con `fin-espera`, y relancé c10 con el ejecutor,
sin cambiar su implementación. La primera corrida de la cadena enmendada
pasó M5 y los guards de E1, BASE21 (21 suites, 899/899) y typecheck, pero paró
en TSLINT por carga. Salida literal del ejecutor, antes y al detenerse:

```text
M5	0	ok
exit=0
$ tsc --noEmit
cadena=1
```

Salida exacta de /tmp/173-lint.txt:

```text
error: Failed to run "eslint" due to signal SIGKILL
```

Jest: `Tests:       899 passed, 899 total`. Se aplica el reintento autorizado
UNA vez por la sección Reintento para `Failed to run`: espera y relanzamiento
de la cadena entera con el mismo ejecutor. El índice sigue vacío y no se ha
creado c10. La segunda espera terminó con `fin-espera`, y se relanzó la
cadena entera con el ejecutor, sin editar ningún fichero de código.
El reintento por carga pasó con `cadena=0`, commit `166c8af4`, BASE21 de 21
suites y `Tests:       899 passed, 899 total`, typecheck verde y lint vacío.
Se continúa en el rojo c11, con tests/candados de R6 (1). No se ejecuta init.sh.

**Bloqueo de Reanudación 3: c11, guard SOLO.** La cadena se lanzó con el
ejecutor, sin copiarla ni sustituir sus comandos:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c11 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
```

Salida exacta del ejecutor:

```text
exit=1
cadena=1
```

Eslabón que falló, después del guard ROJO:

```bash
test "$(grep -E '^  ● ' /tmp/173-c11.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#168 R4|#173 R6|R7: cambiar foto|#173 R2|#173 R3|#98 R10|#62 R7|#61 R4)\b')" = 0
```

Sobran cuatro líneas: dos repeticiones de #64 R9 y dos de «Test suite failed
to run». #64 R9 contiene la segunda cuenta de bg-accent-soft que R6 (1)
ordena mover de `16 + 2 + 1 - 1` a esa fórmula `- 1`: el rojo esperado es
17 frente a 18, pero su describe no figura en la lista SOLO de c11.
Además, la suite de Perfil crashea: el log muestra «TypeError: Converting
circular structure to JSON», al serializar objetos con children y parent,
y luego «Jest worker encountered 4 child process exceptions, exceeding
retry limit». No comprobé qué aserción origina ese objeto circular.

Resumen literal:

```text
Test Suites: 4 failed, 17 passed, 21 total
Tests:       7 failed, 823 passed, 830 total
```

No se alcanzaron ALGUNO, SINCRASH, TSLINT-ROJO, git add ni git commit.
La suite de Perfil no terminó, así que el número de tests no representa la
ejecución completa de los nuevos casos de R6. No hay verificación de tipos
ni lint de c11; los logs anteriores no cuentan como tal.

La regla «Flake de un it ajeno» no aplica: las salidas sobrantes incluyen un
fallo de suite, no únicamente its ajenos. Tampoco aparecen los textos
`reading 'canceled'` o `Exceeded timeout` que autorizan un reintento de Jest.
No reintenté c11, no ajusté tests ni candados para continuar y no edité el
handoff. No se inició la implementación verde de R6.

HEAD y estado literal al detenerse, desde mobile-pet-tracker/:

```text
166c8af4f7241fcdbe73cdb129d5bd0091a61622
 M src/__tests__/consistency-classnames.test.ts
 M src/__tests__/legibility-classnames.test.ts
 M src/__tests__/profile-canvas-fidelity.test.ts
 M src/screens/profile/index.test.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

El índice está vacío. Los cuatro ficheros de tests de c11 y el informe
quedan sin commit. La implementación de c10 quedó en su commit; no se
modificó producción desde entonces. No se ejecutaron c12–c30, S15, K1–K5
ni init.sh. El handoff y progress/current.md se conservaron sin editar,
añadir, commitear ni restaurar.

Lista literal de ● de c11, sin Console (Jest repite los fallos en su resumen):

```text
  ● #62 R7: ningún glifo tipográfico hace de icono › profile usa cuatro ChevronRight de reicon
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento
  ● #61 R4: el acento como tinta usa accent-strong › screens/profile/index.tsx pinta con text-accent-strong (1)
  ● #173 R2: inventario de radios nuevos › reserva rounded-hero al Card compartido y el skeleton de Perfil
  ● #173 R2.4: inventario de tamaños nuevos › reserva text-26 al nombre de la mascota en Perfil
  ● #173 R3: Card hero y flat solo en Perfil › Perfil es el único consumidor de Card hero y lo usa una vez
  ● Test suite failed to run
  ● #62 R7: ningún glifo tipográfico hace de icono › profile usa cuatro ChevronRight de reicon
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento
  ● #61 R4: el acento como tinta usa accent-strong › screens/profile/index.tsx pinta con text-accent-strong (1)
  ● #173 R2: inventario de radios nuevos › reserva rounded-hero al Card compartido y el skeleton de Perfil
  ● #173 R2.4: inventario de tamaños nuevos › reserva text-26 al nombre de la mascota en Perfil
  ● #173 R3: Card hero y flat solo en Perfil › Perfil es el único consumidor de Card hero y lo usa una vez
  ● Test suite failed to run
```

Bloque literal de #64 R9:

```text
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento

    expect(received).toBe(expected) // Object.is equality

    Expected: 17
    Received: 18

      465 |     const docs = readSource(join('screens', 'docs', 'index.tsx'));
      466 |
    > 467 |     expect(accentSoftCount).toBe(16 + 2 + 1 - 1 - 1); // #147 R4, #105 R11; #168 R5: PetPills pasa a huecos pastel; // #173 R6
          |                             ^
      468 |     expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);
      469 |     expect(docs.match(/bg-accent-soft/g)).toBeNull();
      470 |   });

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:467:29)
```

Último bloque literal de excepción del worker y fallo de suite de Perfil:

```text
node:internal/child_process/serialization:164
    const string = JSONStringify(message) + '\n';
                   ^

TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    |     property 'children' -> object with constructor 'Array'
    |     index 0 -> object with constructor 'Object'
    --- property 'parent' closes the circle
    at stringify (<anonymous>)
    at writeChannelMessage (node:internal/child_process/serialization:164:20)
    at process.target._send (node:internal/child_process:851:17)
    at process.target.send (node:internal/child_process:751:19)
    at reportSuccess (/home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker/node_modules/jest-worker/build/workers/processChild.js:82:11)

Node.js v20.20.2
FAIL src/screens/profile/index.test.tsx
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/workers/ChildProcessWorker.js:181:21)
```


### Reanudación 2

#### Repetición de la instrucción: parada en la comprobación inicial

El usuario volvió a solicitar la misma Reanudación 2. Leí de nuevo
«Reanudación 2» y después «Reanudación 1». La comprobación inicial no coincide
con lo exigido por la nota: HEAD es c9 (`aaeb9bab`), no c7 (`fc6715cf`), y el
estado tiene cuatro rutas, no cinco. La implementación de c8 ya quedó en el
commit `36356ae8`, y el rojo c9 en `aaeb9bab`, durante la ejecución anterior.
No hay un cambio pendiente en src/components/pet-switcher.tsx.

Salida exacta de HEAD y git status --short desde mobile-pet-tracker/:

```text
aaeb9bab25df063bcbde8fa98e52a0727ae2eb63
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

Por «Si sale otra cosa, PARA», me detuve antes del bucle de espera y del
ejecutor. No relancé c8 ni ninguna otra cadena. Se mantiene el bloqueo de
c10 documentado abajo; no se modificó código, HEAD, el handoff ni
progress/current.md. No se ejecutó init.sh.

#### Ejecución anterior de Reanudación 2

El usuario autorizó relanzar c8 el 2026-10-14. Leí primero «Reanudación 2» y
después «Reanudación 1», y la regla nueva «Flake de un it ajeno» de Reintento.
Según la nota del leader, el fallo de c8 era preexistente: el it espera a
`me-card`, visible también con skeleton, y lee el nombre antes de que la query
resuelva bajo carga. El leader verificó el fichero solo tres veces (69/69
cada vez) y BASE21 (21 suites, 896/896), sobre la implementación sin commit.
Estas medidas son del leader; no las repetí ni toqué la implementación de c8.

HEAD y estado inicial de esta reanudación, literales:

```text
fc6715cfa22b5e1ebde5358bd7c03ce1d20ae4fe
 M src/components/pet-switcher.tsx
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

HEAD y las cinco rutas coinciden con la nota. Ejecuté el bucle de espera de
Reintento antes de relanzar c8: salida literal `fin-espera`. Relancé c8 una vez
con el ejecutor `sed + bash -c`, sin editar su implementación. El reintento
terminó con commit `36356ae8` y `cadena=0`. Salida literal de las verificaciones:

```text
M36	1	ok
exit=0
$ tsc --noEmit
cadena=0
```

Jest: `Test Suites: 21 passed, 21 total` y
`Tests:       896 passed, 896 total`. Typecheck verde y lint vacío. Se continúa
en c9; rige la regla nueva «Flake de un it ajeno». No se ejecuta init.sh.

c9 completó la cadena roja con `cadena=0`, commit
`aaeb9bab25df063bcbde8fa98e52a0727ae2eb63`. Su resultado está en §4, con
todos los ● permitidos y sin errores TS ni lint. Se implementó únicamente
R5 (2) en src/screens/profile/index.tsx y se lanzó c10 con el ejecutor:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c10 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
```

**Bloqueo de Reanudación 2: c10, guard VERDE de 21 suites.** Salida exacta:

```text
M5	0	ok
exit=1
cadena=1
```

Eslabón que falló:

```bash
grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c10.txt
```

Resumen literal de BASE21:

```text
Test Suites: 1 failed, 20 passed, 21 total
Tests:       1 failed, 898 passed, 899 total
```

Lista literal de ● sin Console, incluido el repetido del resumen:

```text
  ● #62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › deja todos los botones primarios sólidos en un único radio
  ● #62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › deja todos los botones primarios sólidos en un único radio
```

El título no contiene #173, por lo que apliqué «Flake de un it ajeno».
Ejecuté el fichero solo dos veces, con el comando prescrito y los dos
marcadores escritos a mano:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && for i in 1 2; do FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/__tests__/consistency-classnames.test.ts' > /tmp/173-flake-$i.txt 2>&1; grep -E '^Tests:' /tmp/173-flake-$i.txt; grep -cF 'deja todos los botones primarios sólidos en un único radio' /tmp/173-flake-$i.txt; done
```

Salida exacta de las dos corridas:

```text
Tests:       1 failed, 66 passed, 67 total
2
Tests:       1 failed, 66 passed, 67 total
2
```

Las cuentas son 2 porque Jest repite el fallo en el resumen. El it ajeno falla
solo en ambas corridas; no cumple la condición de cuenta 0. Por tanto, **no
es un flake autorizado para reintentar**: me detuve sin ejecutar la espera ni
relanzar c10 y sin modificar el candado.

La causa observable es la cuenta de #62 R1: su fórmula conserva 19, y tras
sustituir el primario de Perfil por la cápsula de R5 hay 18. Ese candado no
figura entre los deltas de R5 (1) en tasks.md; se movieron únicamente los
candados allí indicados. No añadí un ajuste fuera de ese guion.

Typecheck/lint de c10, git add y git commit no se alcanzaron. HEAD quedó en
c9, con estos dos últimos commits completos:

```text
36356ae85b25b4d02b828b252057003ca429734e feat(mobile): PetSwitcher con variante avatars en Perfil (#173 R4)
aaeb9bab25df063bcbde8fa98e52a0727ae2eb63 test(mobile): cápsula de añadir mascota en Perfil (#173 R5)
```

Estado literal al detenerse desde mobile-pet-tracker/:

```text
aaeb9bab25df063bcbde8fa98e52a0727ae2eb63
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

El índice está vacío. La implementación de c10 y este informe quedan sin
commit. El handoff y progress/current.md se conservaron sin añadir, editar,
commitear ni restaurar. No se lanzaron c11–c30, S15, K1–K5 ni init.sh.

Bloque literal completo del fallo de c10 (también se reproduce en las dos corridas aisladas):

```text
  ● #62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › deja todos los botones primarios sólidos en un único radio

    expect(received).toHaveLength(expected)

    Expected length: 19
    Received length: 18
    Received array:  ["rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", …]

      100 |     );
      101 |
    > 102 |     expect(primaryRadius).toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3 // #158 R3: docs-upload; // #158 R5: docs-upload-submit
          |                           ^
      103 |     expect(filesMatching(/rounded-2xl bg-accent(?=[\s'"`])/)).toEqual([]);
      104 |   });
      105 | });

      at Object.toHaveLength (src/__tests__/consistency-classnames.test.ts:102:27)
```


### Reanudación 1

El usuario autorizó retomar en c1 paso 2 el 2026-10-14. Leí primero la sección
«Reanudación 1» y después el handoff completo. Conservé H0 y las medidas de la
sesión anterior; no repetí B0–B2 ni ANCLAS. Revisé el paso manual de R1 contra
tasks.md sin cambiar sus tests. El estado inicial de la reanudación coincidió
exactamente con las cinco rutas previstas:

```text
 M src/theme/__tests__/font-registration.test.ts
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? assets/fonts/Inter-ExtraBold.ttf
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

Ejecutor usado para c1 paso 2, sin copiar ni sustituir la cadena:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c1 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
```

Resultado de c1: `cadena=0`, commit `c91efe84`; rojo solo de R1, sin errores TS ni lint.
El handoff y progress/current.md se conservan
modificados por el leader, sin añadir, commitear ni restaurar.

c1–c7 terminaron con `cadena=0`, usando exclusivamente el ejecutor `sed + bash -c`
del handoff. No hubo reintentos. H0 se conserva; el último commit es
`fc6715cfa22b5e1ebde5358bd7c03ce1d20ae4fe` (c7).

**Bloqueo de esta reanudación: c8, guard VERDE de 21 suites.** La invocación fue:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c8 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
```

Salida exacta del ejecutor:

```text
M36	1	ok
exit=1
cadena=1
```

Eslabón que falló, inmediatamente después de BASE21:

```bash
grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c8.txt
```

El guard de la línea Tests:, tipos/lint, git add y git commit no se alcanzaron.
Las salidas de `/tmp/173-tsc.txt` y `/tmp/173-lint.txt` siguen siendo las de c7;
no son una verificación verde de c8. Resumen literal de Jest en c8:

```text
Test Suites: 1 failed, 20 passed, 21 total
Tests:       1 failed, 895 passed, 896 total
```

Lista literal de ●, sin Console (el mismo fallo se repite en el resumen):

```text
  ● R1: me card › shows the real account name and email
  ● R1: me card › shows the real account name and email
```

No aparecen `reading 'canceled'`, `Exceeded timeout`, `Test suite failed to run`,
`ReferenceError`, `SyntaxError` ni `Cannot find module` en el log. Este fallo no
encaja en los casos de reintento del handoff: no reintenté ni cambié el test.
La captura del fallo muestra `me-card-skeleton`; la aserción que falla es
`screen.getByText('Ada Lovelace')`, después de esperar a que `me-card` esté visible.
No se realizó una investigación adicional de causa ni una modificación para continuar.

Estado literal conservado al detenerse, desde mobile-pet-tracker/:

```text
 M src/components/pet-switcher.tsx
 M src/screens/profile/index.tsx
 M ../progress/current.md
 M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md
?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md
```

`git diff --cached --name-only` no produjo salida. La implementación de c8 se
conserva sin commit; el informe también queda sin commit. No se modificaron
el handoff ni progress/current.md, y no se ejecutó ninguna otra cadena después
del fallo.

Hashes completos de los siete commits, en orden:

```text
c91efe8488c4731c9ef9b85c1e83b9f0d4298801 test(mobile): registra Inter-ExtraBold como sexto peso (#173 R1)
2d462afa42f7cc263a9b31b76a41fd06603ab7d8 feat(mobile): registra Inter-ExtraBold como sexto peso (#173 R1)
9591e3f14136e9995dee3735a0a5c9dccd0659a1 test(mobile): tokens de radio hero y tile y tamaños 13 y 26 (#173 R2)
ca83aaf964c86f4a71c76682b4f47364052857d0 feat(mobile): tokens de radio hero y tile y tamaños 13 y 26 (#173 R2)
7056ca0ebd1b8d1d62442dc49109d1fb46430838 test(mobile): variantes hero y flat de Card sin sombra (#173 R3)
a18abc0df497ca50ca2474bd5f4e2ddfd659c2c0 feat(mobile): variantes hero y flat de Card sin sombra (#173 R3)
fc6715cfa22b5e1ebde5358bd7c03ce1d20ae4fe test(mobile): PetSwitcher con variante avatars en Perfil (#173 R4)
```

Primer bloque completo de fallo de `/tmp/173-c8.txt`, literal (con los códigos ANSI
emitidos por Jest; vuelve a aparecer en el resumen):

```text
  ● R1: me card › shows the real account name and email

    Unable to find an element with text: Ada Lovelace

    [36m<RNCSafeAreaProvider>[39m
      [36m<Text[39m
        [33mtestID[39m=[32m"selected-pet-id"[39m
      [36m>[39m
        [0mnone[0m
      [36m</Text>[39m
      [36m<TextInput[39m
        [33mtestID[39m=[32m"language-state-probe"[39m
        [33mvalue[39m=[32m""[39m
      [36m/>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-profile"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"profile-title"[39m
            [36m>[39m
              [0mPerfil[0m
            [36m</Text>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"profile-add-pet"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mAñadir mascota[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"profile-hero-skeleton"[39m
          [36m/>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"pet-info-skeleton"[39m
          [36m/>[39m
          [36m<View[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
            [33mtestID[39m=[32m"reminders-link"[39m
          [36m>[39m
            [36m<View[39m
              [33maccessibilityElementsHidden[39m=[32m{true}[39m
              [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
              [33mtestID[39m=[32m"reminders-link-tile"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"profile-icon-bell"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<Text>[39m
              [0mRecordatorios[0m
            [36m</Text>[39m
            [36m<RNSVGSvgView>[39m
              [36m<RNSVGGroup>[39m
                [36m<RNSVGGroup>[39m
                  [36m<RNSVGPath />[39m
                [36m</RNSVGGroup>[39m
              [36m</RNSVGGroup>[39m
            [36m</RNSVGSvgView>[39m
          [36m</View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"me-card"[39m
          [36m>[39m
            [36m<Text>[39m
              [0mCuenta[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"me-card-skeleton"[39m
            [36m/>[39m
            [36m<View[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"theme-toggle"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mUsar tema oscuro[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33maccessibilityLabel[39m=[32m"Cambiar idioma"[39m
              [33maccessibilityRole[39m=[32m"button"[39m
              [33maccessibilityState[39m=[32m{
                {
                  "disabled": false,
                }
              }[39m
              [33maccessible[39m=[32m{true}[39m
              [33mtestID[39m=[32m"language-toggle"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mstyle[39m=[32m{
                  {
                    "opacity": 0,
                  }
                }[39m
              [36m/>[39m
              [36m<Text>[39m
                [0mEnglish[0m
              [36m</Text>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<View[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessibilityState[39m=[32m{
              {
                "disabled": false,
              }
            }[39m
            [33maccessible[39m=[32m{true}[39m
            [33mtestID[39m=[32m"profile-sign-out"[39m
          [36m>[39m
            [36m<View[39m
              [33mpointerEvents[39m=[32m"none"[39m
              [33mstyle[39m=[32m{
                {
                  "opacity": 0,
                }
              }[39m
            [36m/>[39m
            [36m<Text>[39m
              [0mCerrar sesión[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m

      316 |
      317 |     await waitFor(() => expect(screen.getByTestId('me-card')).toBeVisible());
    > 318 |     expect(screen.getByText('Ada Lovelace')).toBeVisible();
          |                   ^
      319 |     expect(screen.getByText('ada@example.test')).toBeVisible();
      320 |     expect(mockGetMe).toHaveBeenCalledWith(apiUrl, 'jwt-token');
      321 |   });

      at Object.getByText (src/screens/profile/index.test.tsx:318:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```


### Bloqueo obligatorio: c1, análisis sintáctico de la línea expandida

Eslabón: **invocación Bash de la cadena c1**, antes de BASE20.
Exit code de exec_command: **127**.

El error fue mío: usé una sustitución de macros en JavaScript que interpretó una secuencia de
dólar y comilla del contenido de TSLINT-ROJO como sustitución especial. La expansión dejó de ser
literal, alteró el patrón de lint e insertó la cola de la cadena dentro de ese patrón.
No se ejecutó Jest, no se creó su log, no hubo git add ni git commit.

Comando enviado, completo:

```bash
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' > /tmp/173-c1.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c1.txt && test "$(grep -E '^  ● ' /tmp/173-c1.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R1)\b')" = 0 && grep -E '^  ● ' /tmp/173-c1.txt | grep -qE '#173 R1\b' && ! grep -qE "Test suite failed to run|ReferenceError|SyntaxError|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c1.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx? && git add src/theme/__tests__/font-registration.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/font-registration.test.ts ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): registra Inter-ExtraBold como sexto peso (#173 R1)')" = 0 && git add src/theme/__tests__/font-registration.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/font-registration.test.ts ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): registra Inter-ExtraBold como sexto peso (#173 R1)'
```

Salida exacta de exec_command, completa:

```text
/bin/bash: -c: line 1: syntax error near unexpected token `('
/bin/bash: -c: line 1: `cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' > /tmp/173-c1.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c1.txt && test "$(grep -E '^  ● ' /tmp/173-c1.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R1)\b')" = 0 && grep -E '^  ● ' /tmp/173-c1.txt | grep -qE '#173 R1\b' && ! grep -qE "Test suite failed to run|ReferenceError|SyntaxError|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c1.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx? && git add src/theme/__tests__/font-registration.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/font-registration.test.ts ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): registra Inter-ExtraBold como sexto peso (#173 R1)')" = 0 && git add src/theme/__tests__/font-registration.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/font-registration.test.ts ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): registra Inter-ExtraBold como sexto peso (#173 R1)''
```

No es uno de los casos autorizados de reintento: no fue un fallo de directorio, canceled,
timeout ni Failed to run de lint. Por la instrucción «Si un eslabón falla, PARA y reporta»,
no corregí la expansión, no reintenté y no cambié tests/candados para continuar.

### Lectura auxiliar de una ruta inexistente

Durante la inspección intenté leer `mobile-pet-tracker/jest.config.js`; la configuración Jest
real vive en package.json. Salida literal:

```text
cat: mobile-pet-tracker/jest.config.js: No such file or directory
```

Fue una lectura auxiliar, no una cadena del handoff. Se localizó la configuración mediante
rg --files y se leyó package.json. No se modificó ningún fichero para resolver esa lectura.

### Estado conservado al detenerse

Salida literal de HEAD y git status --short desde la raíz, antes de escribir este informe:

```text
adad3359295766758851761dce337f028671bc4b
 M mobile-pet-tracker/src/theme/__tests__/font-registration.test.ts
?? mobile-pet-tracker/assets/fonts/Inter-ExtraBold.ttf
```

`git diff --cached --name-only` no produjo salida. Este informe añade únicamente su propia
ruta sin trackear. La fuente no se descargó ni se modificó. No hubo cambios de producción,
reintentos, init.sh, Prettier, amend, rebase, push, PR ni merge.

## 9. R16

**pendiente (humano)**.

