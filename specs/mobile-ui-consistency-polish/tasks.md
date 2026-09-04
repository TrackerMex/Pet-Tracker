---
feature: "mobile-ui-consistency-polish"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-ui-consistency-polish]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Los sitios exactos,
> clases exactas y líneas están en [[design]] §4 — esta lista **no los repite**.

## Reglas de commit (C4 de [[../../CHECKPOINTS|CHECKPOINTS]]) — NO negociables

Codex CLI **debe** dejar historial rojo→verde **por requisito**. En la feature
#19 se entregó implementación + tests + docs en un solo commit, sin historial,
y se incumplió C4. Aquí no se repite:

1. **Commit rojo**: solo el test nuevo, fallando. El mensaje nombra su R-id.
   `test(mobile-ui-consistency): R<n> <qué afirma> (rojo)`
2. **Commit verde**: la implementación mínima que lo pasa.
   `feat(mobile-ui-consistency): R<n> <qué cambia>`
3. **Commit de refactor** (solo si hace falta): con la suite verde.
   `refactor(mobile-ui-consistency): R<n> <qué se limpia>`

Un commit que mezcle test rojo e implementación es un incumplimiento de C4 y el
`reviewer` lo rechaza aunque la suite esté verde. **16 requisitos ⇒ al menos 32
commits.** Cada commit corre `bun test` en `mobile-pet-tracker/` antes de
existir.

Orden obligatorio: **R1 → R2 → R3 → R4 → R5…R13 → R14 → R15 → R16**
([[design]] §10). R1 fija la regla contra la que se miden R2-R4; R3 va antes que
R14 para que las cuatro superficies migradas hereden su esquina del `Card` y no
haya que tocarlas dos veces.

## Antes de escribir la primera línea

- Skills a cargar (carta §Skills, obligatorio también para Codex CLI vía su
  plugin `expo`): `expo:expo-overview` → `expo:expo-design-system` y
  `expo:expo-native-ui`, más `appllama-app-design-skill`. De appllama se toma
  el **patrón**, **nunca** su sistema de estilos: prohibidos `Color.ios.*`,
  `StyleSheet.create`, hex sueltos y clases arbitrarias `[...]`.
- Branch: `feature/62-mobile-ui-consistency-polish` (ya creada, worktree
  `Pet-Tracker-wt-ui`). No se commitea a `main`.
- **Nada bajo `backend-pet-tracker/` ni `infra/` se toca.**
- **`mobile-pet-tracker/src/theme/global.css` NO se toca en ningún requisito.**
  Esta feature no añade ni cambia ningún token.
- **Ningún `.test.tsx` / `.test.ts` preexistente se edita**, salvo para
  *añadir* bloques `describe('#62 R…')`. No hay ninguna excepción declarada:
  [[design]] §6 comprobó archivo por archivo que ninguno se rompe.
- **Los 8 emoji de iconografía no se tocan** ([[design]] §2 D6). Si en algún
  momento el diff toca `src/utils/reminder-meta.ts` o el `📄` de
  `src/screens/docs/index.tsx:18`, el requisito está mal implementado.

## Reglas mecánicas que resuelven la mayoría de las dudas

1. **Radios**: card ⇒ `rounded-card`; control, tile, input, botón y píldora de
   dato ⇒ `rounded-xl`; cápsula ⇒ `rounded-full`. Nada más.
2. **Esquinas continuas**: si la esquina la dibuja un componente de
   heroui-native, **no se toca** (ya la trae); si la dibuja un `View`,
   `Pressable`, `TextInput` o el `Card` del repo, lleva `CONTINUOUS_CORNER`.
   Las cápsulas nunca.
3. **Color imperativo**: siempre `useThemeColors` de
   `src/theme/use-theme-colors.ts`. Fondo ⇒ `'accent'`; encima de otra cosa ⇒
   `'accent-strong'`.

---

## R1 — La escala de radios está declarada y el botón primario tiene un solo radio

- [ ] (1) Escribir test que falla para R1
      (`src/__tests__/consistency-classnames.test.ts`, **archivo nuevo**,
      `describe('#62 R1: …')`: `docs/ui-guidelines.md` contiene el punto 12 con
      la escala; los 4 botones de [[design]] §4 R1 llevan `rounded-xl` y
      ninguno lleva `rounded-2xl`)
- [ ] (2) Implementación mínima que lo pasa. Incluye el punto **12** de
      `docs/ui-guidelines.md` con el texto exacto de [[design]] §7
- [ ] (3) Refactor con tests verdes

## R2 — Cada skeleton tiene la forma del contenido que sustituye

- [ ] (1) Escribir test que falla para R2
      (`src/__tests__/consistency-classnames.test.ts`, `describe('#62 R2: …')`:
      los 3 skeletons de [[design]] §4 R2 llevan `rounded-card` y conservan su
      clase de dimensión)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Las 4 superficies con receta a mano usan el `Card` compartido

- [ ] (1) Escribir test que falla para R3 (tres archivos:
      `src/app/(tabs)/__tests__/home.test.tsx`, `.../food.test.tsx`,
      `.../map.test.tsx`, cada uno con su `describe('#62 R3: …')`: el
      `props.className` de `collar-card`, `last-position-card`,
      `warning-card-<code>` y `map-empty-overlay` contiene `rounded-card`,
      `border` y el `bg-*` que le toca; `map-empty-overlay.props.style` sigue
      siendo un objeto con `top: 52`)
- [ ] (2) Implementación mínima que lo pasa. **Incluye dos cosas más**:
      - el `testID` nuevo `warning-card-${warning.code}` (§6 de [[design]])
      - eliminar `Card as HeroUICard` del import de `src/app/(tabs)/food.tsx:2`,
        que queda huérfano (C7). El de `home.tsx` **se queda**: `pet-card-error`
        lo sigue usando
- [ ] (3) Refactor con tests verdes

## R4 — La app solo usa los radios de la escala declarada

- [ ] (1) Escribir test que falla para R4
      (`src/__tests__/consistency-classnames.test.ts`, `describe('#62 R4: …')`:
      `filesMatching(/rounded-2xl/)` y `filesMatching(/rounded-lg/)` devuelven
      `[]`; los 6 sitios de [[design]] §4 R4 llevan `rounded-xl`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — El título de card usa un único tratamiento

- [ ] (1) Escribir test que falla para R5 (cuatro archivos:
      `src/app/(tabs)/__tests__/home.test.tsx`, `.../health.test.tsx`,
      `.../food.test.tsx`, `.../meal-schedule.test.tsx`, cada uno con
      `describe('#62 R5: …')`: `screen.getByText('<título>').props.className`
      es `'text-base font-bold text-foreground'`, patrón de
      `profile/index.test.tsx:681`)
- [ ] (2) Implementación mínima que lo pasa, en los **6** sitios de
      [[design]] §4 R5 y en ninguno más
- [ ] (3) Refactor con tests verdes

## R6 — La última fila de `pet-info-card` no cuelga su separador

- [ ] (1) Escribir test que falla para R6
      (`src/screens/profile/index.test.tsx`, `describe('#62 R6: …')`: la fila
      de "Última señal" no lleva `border-b` y la de "Raza" sí) y el conteo
      global en `consistency-classnames.test.ts` (cero `last:`/`first:`/`odd:`/
      `even:` en `src/`)
- [ ] (2) Implementación mínima que lo pasa (prop `isLast` en `InfoRow`, código
      exacto en [[design]] §4 R6)
- [ ] (3) Refactor con tests verdes

## R7 — Ningún glifo tipográfico hace de icono

- [ ] (1) Escribir test que falla para R7
      (`src/__tests__/consistency-classnames.test.ts`, `describe('#62 R7: …')`:
      cero `←` y cero `›` en las fuentes de `src/`; los 4 archivos con botón de
      volver importan `ArrowLeft` y `profile` importa `ChevronRight`)
- [ ] (2) Implementación mínima que lo pasa, en los **7** sitios de
      [[design]] §2 D6 tabla (A). **Los 8 emoji de la tabla (B) no se tocan.**
      Los `testID`, `accessibilityLabel`, `accessibilityRole`, `hitSlop` y
      `className` de los `Pressable` se conservan intactos
- [ ] (3) Refactor con tests verdes

## R8 — Home carga con Skeleton dimensionado, no con Spinner suelto

- [ ] (1) Escribir test que falla para R8
      (`src/app/(tabs)/__tests__/home.test.tsx`, `describe('#62 R8: …')`:
      `home-loading` lleva `h-12 w-full rounded-card`)
- [ ] (2) Implementación mínima que lo pasa. **Incluye** quitar `Spinner` del
      import de `home.tsx:2`, que queda huérfano (C7)
- [ ] (3) Refactor con tests verdes

## R9 — La gráfica de peso vive dentro de una card

- [ ] (1) Escribir test que falla para R9
      (`src/app/(tabs)/__tests__/weight-log.test.tsx`, `describe('#62 R9: …')`:
      existe `weight-chart-card`, su `className` contiene `rounded-card`, y
      `weight-chart` está dentro de él)
- [ ] (2) Implementación mínima que lo pasa. **Sin** cabecera nueva: sería
      texto nuevo
- [ ] (3) Refactor con tests verdes

## R10 — El tipo de documento se lee como badge

- [ ] (1) Escribir test que falla para R10
      (`src/screens/docs/index.test.tsx`, `describe('#62 R10: …')`: el `Text`
      con `document.type` lleva el `className` de badge de [[design]] §4 R10 y
      el texto no cambia)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — Los chips de especie usan la receta única de chip

- [ ] (1) Escribir test que falla para R11
      (`src/screens/add-pet/index.test.tsx`, `describe('#62 R11: …')`:
      `species-dog` y `species-cat` llevan `px-3` y no `px-4`; su etiqueta
      lleva `text-sm`; siguen llevando `hitSlop`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — El placeholder del formulario sale del tema

- [ ] (1) Escribir test que falla para R12 (tres archivos:
      `src/screens/add-reminder/index.test.tsx` y
      `src/screens/add-pet/index.test.tsx` con
      `describe('#62 R12: el placeholder del formulario sale del tema')` —cada
      `TextInput` con `placeholder` tiene `placeholderTextColor` igual al color
      que el mock de `useThemeColors` devuelve para `muted`— y
      `src/__tests__/consistency-classnames.test.ts` con
      `describe('#62 R12: los TextInput crudos comparten una sola receta')`
      —cero `TextInput` con `placeholder` y sin `placeholderTextColor`, cero
      `TextInput` con `border border-border`)
- [ ] (2) Implementación mínima que lo pasa, en los **6** `TextInput` de
      [[design]] §4 R12. **No** se migra a `TextField` + `Input`
      ([[design]] §2 D5); **no** se toca ningún `Pressable` pseudo-campo
- [ ] (3) Refactor con tests verdes

## R13 — El color imperativo sale siempre de `useThemeColors` del repo

- [ ] (1) Escribir test que falla para R13
      (`src/__tests__/consistency-classnames.test.ts`, `describe('#62 R13: …')`:
      cero `useThemeColor` de heroui en `src/`; `forgot.tsx` importa
      `useThemeColors` del repo y pide `'accent-strong'`)
- [ ] (2) Implementación mínima que lo pasa (código exacto en [[design]] §2 D7).
      **`'accent-strong'`, no `'accent'`**: `'accent'` rompería el invariante ya
      verde de #61 R4
- [ ] (3) Refactor con tests verdes

## R14 — Toda esquina no-cápsula que dibuja el repo es continua

- [ ] (1) Escribir test que falla para R14 (dos archivos:
      `src/__tests__/consistency-classnames.test.ts` con
      `describe('#62 R14: …')` —cada archivo de la tabla de [[design]] §4 R14
      importa `CONTINUOUS_CORNER` y lo usa el número exacto de veces que dice la
      tabla; ninguna cápsula lo lleva— y
      `src/components/__tests__/card.test.tsx` con
      `describe('#62 R14: el Card compartido fusiona borderCurve con el style del llamador')`
      —`props.style` es un objeto plano con `borderCurve: 'continuous'`, y con
      un `style` de llamador conserva las dos cosas)
- [ ] (2) Implementación mínima que lo pasa. **Incluye** el archivo nuevo
      `src/theme/native-styles.ts` con `CONTINUOUS_CORNER` **y** `TABULAR_NUMS`
      (código exacto en [[design]] §2 D8), y la fusión con
      `StyleSheet.flatten` en `src/components/card.tsx` — **no** un array, que
      rompería `map.test.tsx:410`
- [ ] (3) Refactor con tests verdes

## R15 — Todo contador usa cifras tabulares

- [ ] (1) Escribir test que falla para R15 (dos archivos:
      `src/__tests__/consistency-classnames.test.ts` con
      `describe('#62 R15: …')` —los conteos por archivo de la tabla de
      [[design]] §4 R15— y `src/app/(tabs)/__tests__/map.test.tsx` con
      `describe('#62 R15: el overlay del mapa usa cifras tabulares')`
      —`stat-speed.props.style` contiene `fontVariant: ['tabular-nums']` y
      `stat-gps.props.style` **no**)
- [ ] (2) Implementación mínima que lo pasa, en los **14** `Text` de
      [[design]] §4 R15
- [ ] (3) Refactor con tests verdes

## R16 — Gate mecánico del reviewer

- [ ] (1) No hay test de jest. El `reviewer` ejecuta él mismo:
      - `bun test` en `mobile-pet-tracker/` — todo verde
      - `git diff origin/main...HEAD --stat` — sin `backend-pet-tracker/`, sin
        `infra/`, sin `mobile-pet-tracker/src/theme/global.css`, y sin líneas
        **eliminadas** en ningún `*.test.tsx` / `*.test.ts` preexistente
      - los greps de [[design]] §5, con los números esperados exactos
- [ ] (2) Deja los conteos escritos en
      `progress/review_mobile-ui-consistency-polish.md`
- [ ] (3) Actualiza [[traceability]]: ninguna fila queda "pendiente" (C5)

---

## Cierre — guion del smoke humano (criterio de aceptación 8)

**No delegable a IA.** Dev build de **Android**, comparando lado a lado con el
Figma, en tema **claro Y oscuro**:

1. **Add reminder**, tema oscuro: el placeholder "Reminder title" **se lee**.
   Es el defecto que el humano reportó el 2026-09-04 y el motivo de R12.
2. **Add pet**, tema oscuro: los placeholders "Pet name", "Optional",
   "Months" se leen igual de bien.
3. **Add pet / Add reminder / Pairing**: los seis campos de texto crudos ya
   **no tienen borde**, igual que los campos de heroui de Login, Register,
   Forgot, Reset password y Weight log. Es la segunda mitad de R12 y es un
   cambio visible: `--field-border` vale `transparent` en los dos temas, así
   que el borde que tenían era drift, no diseño. Si el humano lo quiere de
   vuelta, se corrige el token en la carta, no el campo.
4. **Home**: al cargar, el bloque de carga ya no salta cuando aparece la
   mascota (R8), y el skeleton de la card tiene la misma esquina que la card
   que lo sustituye (R2).
5. **Health** y **Reminders**: mismo check de skeleton (R2).
6. **Home / Health / Food / Meal schedule**: el título de card se ve del mismo
   tamaño y peso en las cuatro (R5).
7. **Home**, **Food**, **Map**: `collar-card`, "View on map", los avisos de
   plan y el overlay "No location data yet" se ven como cards del resto de la
   app — con borde y sombra, que es el cambio esperado (R3).
8. **Profile**: la última fila de "Información" ("Última señal") ya **no**
   tiene una línea colgando contra el borde de la card (R6).
9. **Docs / Add pet / Add reminder / Pairing**: la flecha de volver se ve
   idéntica a la de Weight log y Meal schedule. **Profile**: los tres chevrons
   se ven idénticos a los de Home / Health / Food (R7).
10. **Docs**: el tipo de documento se lee como badge con fondo, no como
   micro-label gris (R10).
11. **Add pet**: los chips "Dog"/"Cat" se ven del mismo tamaño que "Female",
    "Male", "Small", "Birth date" (R11).
12. **Weight log**: la gráfica está dentro de una card, no flotando (R9).
13. **Map**: mirar el overlay durante dos o tres refrescos (15 s cada uno) y
    confirmar que los dígitos de velocidad, distancia y "actualizado" ya no
    saltan horizontalmente (R15).
14. **Reminders**: las tres píldoras de resumen, la fila y el tile del icono
    ya no muestran tres radios distintos en el mismo bloque (R4).

`borderCurve` (R14) **no es verificable en este smoke**: es no-op en Android.
Se verá cuando exista un build de iOS (feature #60). Está declarado así en el
punto 5 del gate de [[requirements]].
