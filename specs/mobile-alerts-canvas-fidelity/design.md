---
feature: mobile-alerts-canvas-fidelity
id: 174
status: approved
---

# Diseño — #174 Alertas fieles al canvas (lista)

## 1. Enfoque

Cambio solo de presentación (`mobile-pet-tracker/`, capa de pantalla y utilidades de UI). Sin dominio,
sin aplicación, sin infraestructura, sin backend. Se construye **sobre #173 mergeado** (requirements §0 y
§5 Q1): reutiliza `font-extrabold`, `--text-13`, `--text-26`, la línea de tamaños numéricos de la carta y
las dos excepciones de padding 20.

## 2. Ficheros afectados

Producción (`mobile-pet-tracker/src/`):

| Fichero | Cambio | R |
|---|---|---|
| `theme/global.css` | `--text-15`, `--tracking-title`, `--tracking-caps`, `--radius-10` | R1 |
| `i18n/catalog.ts` | `alerts.dayAgo` nueva; `alerts.daysAgo` con palabra completa | R2 |
| `app/_layout.tsx` | ruta `alerts` con `title: ''` | R3 |
| `screens/alerts/index.tsx` | formateador, cabecera en contenido, contador, dimensiones, secciones, fila, ack, píldoras, entrada | R2–R10 |
| `utils/alert-meta.ts` | campo `disc` por tipo | R7 |

Tests: `screens/alerts/index.test.tsx`, `theme/__tests__/global-css.test.ts`,
`providers/__tests__/language-provider.test.tsx`, `app/__tests__/layout.test.tsx`,
`__tests__/consistency-classnames.test.ts`, `__tests__/ui-copy-table.ts`,
`__tests__/profile-canvas-fidelity.test.ts` (de #173) y el nuevo `__tests__/alerts-canvas-fidelity.test.ts`.

Docs y specs: `docs/ui-guidelines.md`, `specs/mobile-ui-language/design.md` y las cinco specs de R11.1.

No se tocan: `screens/alert-detail/` (#180), `components/card.tsx`, `components/pop-in.tsx`,
`screens/home/home-entrance.tsx`, `theme/motion.ts`, `docs/conventions.md` (la excepción la trae #173).

## 3. Tokens y evidencia del spike

- Nombres: tamaños `--text-<px>` (clase `text-15`), radio `--radius-<px>` (clase `rounded-10`),
  interletrado `--tracking-<rol>` en `em`. Espaciados fraccionarios de la escala (`px-3.5`, `py-3`,
  `px-2.5`, `mt-1.5`, `gap-0.5`, `h-8.5` = 34).
- Spike de #173 (`origin/feature/173-mobile-tab-screens-canvas-fidelity`, `specs/mobile-tab-screens-canvas-fidelity/design.md` §«Spike uniwind: tamaños numéricos», commit `164909de`):
  - `text-15` → `fontSize: 15`, sin `lineHeight`;
  - fila `tracking-title` → `["letterSpacing", vars["--tracking-title"]]`, que resuelve a
    `vars["--uniwind-em"] * -0.02`; su párrafo «Letter-spacing en em» explica que cada `text-*` fija
    `--uniwind-em`. De ahí R12.4 (la misma regla que #175 R2.5 y su §Convenciones): todo `tracking-*` va con su `text-N` en el mismo `className`
    (título: `text-26` → −0,52; cabecera: `text-13` → 0,78);
  - los fraccionarios compilan a `--spacing × N`.
- Interlineado: el artboard no lo fija; no hay token (requirements §4).

## 4. Bloque canónico de enmienda

El test de R11 extrae este cercado, sustituye los marcadores y busca el bloque (sin la línea de firma) en
cada fichero; la firma se comprueba aparte con `/- \[[ xX]\] Enmienda #174 aprobada por humano/`.

```markdown
## Enmienda #174 — Alertas fieles al canvas

> Enmienda de `<FEATURE>` por `mobile-alerts-canvas-fidelity` (#174, 2026-10-13). Directiva del humano:
> «el diseño final debe de quedar como el artifact».

**Qué cambia**: <QUÉ CAMBIA>.

Detalle y tests en `specs/mobile-alerts-canvas-fidelity/requirements.md`. Los `it` citados se reescriben en
su sitio con el sufijo `(enmendado por #174 Rn)`.

- [ ] Enmienda #174 aprobada por humano
```

## 5. Textos de la carta (literales, R11.2)

### 5.1 Compartidos con #175 (`origin/feature/175-mobile-docs-canvas-fidelity` @ `192329aa`, `specs/mobile-docs-canvas-fidelity/requirements.md` §«Texto de la enmienda R2»)

Cada uno: presente en `main` en H0 (ancla S3–S7 de requirements §1) o se añade literal. No se reescriben.

- **Sección de fidelidad** (S3; al final del fichero, antes de `## Enmienda #174`):

  ```markdown
  ## Enmienda de fidelidad al canvas (2026-10-13)

  Directiva del humano del 2026-10-13: «el diseño final debe de quedar como el artifact» (canvas aprobado, https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j). Rige para toda pantalla que una spec lleve al canvas; la spec de cada pantalla nombra sus valores y los candados que revierte.

  - **Título en contenido (D-H).** El título de pantalla va dentro del contenido (eyebrow opcional y título); la cabecera nativa del stack queda con `title: ''` y solo aporta el botón de volver.
  - **Iconos reicon (D-I).** Los iconos de la interfaz son componentes de `reicon-react-native` coloreados con un token vía `useThemeColors`; ningún emoji hace de icono. La superficie de categoría acompaña a un icono y a un texto.
  - **Medidas del artboard.** Donde la escala no llega al valor del artboard se usa un token del `@theme` nombrado por su valor y listado en la regla 2 (tamaños y tracking) o en la regla 12 (radios); las clases con corchetes (regla 3) y los radios `2xl`, `lg`, `md` y `sm` (regla 12) siguen prohibidos, y las esquinas que no son cápsula siguen llevando `CONTINUOUS_CORNER`.

  - [ ] Enmienda de fidelidad al canvas aprobada por humano (fecha: ____)
  ```

- **D5-b, micro-regla** (S4; sustituye a `- Títulos de pantalla: header del stack cuando exista, no Text suelto.`):
  «- Títulos de pantalla: título en contenido y cabecera nativa con `title: ''` (Enmienda de fidelidad al canvas).»
- **D5-c, paleta** (S5; sustituye solo la frase `la superficie siempre acompaña a un emoji y a un texto.`):
  «la superficie siempre acompaña a un icono de reicon-react-native y a un texto.»
- **Regla 2, tamaños** (S7): `` , `--text-15: 15px` `` al final de la lista de la línea de P7, antes del `;`.

### 5.2 Propios de #174

- **D5-a, regla 2, tracking** (S6). Si la línea `Tracking fuera de la escala de Tailwind…` existe, se añade
  `` , `--tracking-caps: 0.06em` `` al final de su lista, antes del `;`. Si no, se crea debajo de la de
  tamaños, con su sangría, con el marco de #175 y la lista de #174 (#175, al mergear segundo, añade
  `--tracking-eyebrow` a la lista, como dice su R2.5):
  «Tracking fuera de la escala de Tailwind (fidelidad al canvas, #174): `--tracking-title: -0.02em`, `--tracking-caps: 0.06em`; la clase `tracking-*` va con una clase `text-*` en el mismo elemento, porque uniwind multiplica el `em` por su tamaño.»
- **D5-d, §12** (última línea de la regla `12. **Escala de radios**`, antes de `13. **Botón con cuerpo**`,
  detrás de la de #175 si está, con su sangría):
  «Fuera de la escala, por fidelidad al canvas (#174): `rounded-10` (10 px), ack compacto de fila de Alertas.»
- **D5-e, §13** (viñeta nueva justo detrás de «Sin labio», con su sangría `    - `):
  «- **Secundario compacto de fila** (#174): el ack de cada fila abierta de Alertas lleva `h-8.5 rounded-10 border-2 border-b-5 border-lip-gray bg-surface px-3`, etiqueta `text-xs font-extrabold text-foreground` y `hitSlop={TOUCH_SLOP}` (34 + 12 = 46 de diana). Es la única excepción a la receta del secundario neutro; el inventario de #166 R3 lo lista por su `testID`.»
- **§13 «Sin labio»**: `confirmar alerta).` → `confirmar alerta en el detalle).`

Las frases que ya aseveran `#62 R4` (`'declara en la carta los tres radios y prohíbe el drift'`) y `#166 R4`
(`'declara las dos recetas y el orden del labio'`) se conservan literalmente: los cambios de §12 y §13 son
aditivos salvo la sustitución nombrada.

## 6. Decisiones de detalle

- **`disc` nuevo en `alert-meta.ts`** en vez de cambiar `surface`: #180 (detalle) lee `surface`, `ink` y
  `border`; cambiarlos movería el detalle fuera de alcance. Los valores salen de `CATEGORY_SLOTS` para no
  romper #64 R9.
- **Ack `variant="secondary"`**: entra en la población de secundarios neutros de #166 R3 y se lista allí
  como excepción nombrada (receta compacta), en vez de esconderlo con otra variante.
- **`hitSlop={TOUCH_SLOP}`**: el ack mide 34; con 6 por lado la diana llega a 46 (≥ 44 de la carta).
- **Entrada limitada a 5 filas**: el canvas anima cada fila; con listas largas el retardo acumulado
  (`index × 60` ms) sería visible. Las cinco primeras cubren la pantalla inicial.
- **Contador con `PopIn`** y filas con `HomeEntrance`: piezas existentes; los tiempos del canvas
  (pop 300 ms, rise 70 ms) quedan como delimitación.
- **Subtítulo anidado**: `Text` padre con estilo y dos `Text` hijos sin `className` (heredan); el literal
  `' · '` es seguro para la guarda AST de `ui-language` (no es copy).

## 7. Alternativas descartadas

- **Cabecera propia** (título y back en el contenido, `headerShown: false`): pierde el back nativo y el
  gesto; el humano decidió D-H.
- **Ajustar `headerTitleStyle`** (Inter-Black 26 en la cabecera nativa): Android no alinea a la izquierda de
  forma fiable y no permite el contador a la derecha del título.
- **Redondear a la escala** (`text-sm`/`text-base`, `rounded-xl`): contradice «Píxel exacto».
- **Copias propias de los tokens de #173**: duplicados que reconciliar al mergear (Q1).
- **Reusar `--tracking-eyebrow` (0.08em, #175)** para las cabeceras: 0,26 px más abierto que el artboard
  (0.06em × 13); contradice «Píxel exacto» (Q2).
- **Textos propios para D-H/D-I**: dos redacciones de la misma enmienda; se usa la de #175 (§5.1).
- **Interletrado en px**: el spike de #173 verifica que `em` se resuelve contra el `text-*` del elemento;
  px fijaría un valor por tamaño.

## 8. Notas

- **#177** no es dependencia ni se solapa en ficheros.
- **Handoff a Codex**: el leader nombra las skills de Codex según `.claude/agents/leader.md` §Catálogo real
  de skills de Codex (no los nombres de este lado).
- Solapes posibles al mergear: §2.N de `specs/mobile-ui-language/design.md`, la última línea de la
  expresión de longitud de LP, la última `## Enmienda #` de la carta y la lista de `#166 R3`. Todos se
  escriben como «base medida en H0 + delta».
