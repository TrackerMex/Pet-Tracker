# Diseño ola 0 de UI (gate G1): artboards nuevos para #222–#225

Fecha: 2026-10-27. Plan: `progress/plan_ui-2026-10-26.md` (§2 y §3 Ola 0).
Canvas: «Pet Tracker: propuesta de UI» (versión base leída: `1793074875-f993`).

**Estado: preparado en disco, NO publicado.** No se subió ningún asset ni se
escribió en el canvas. Los 13 artboards y el parche del índice están en:

`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/52ea95c8-2b34-4e51-b3cb-00ec15e7e1c0/scratchpad/canvas-ola0-ui/project/`

- `<Nombre>.dc.html` (13 ficheros)
- `canvas.json.patch.json` (solo entradas nuevas de `boards`, `order` y `notes`)

Método: cada artboard es un clon de uno existente (`Salud`, `Nutricion`,
`Perfil`, `Alertas`, `NutricionAvisos`, `Inicio`) con solo lo pedido cambiado;
los originales no se tocaron. 390×844, tokens del canvas (sin hex sueltos
nuevos), Inter, Voz B, datos de ejemplo de Rocky (segunda mascota: Luna).
No se verificó en navegador (instrucción del encargo).

## 1. Artboards

| Artboard | Feature | Qué muestra | Copy literal principal |
|---|---|---|---|
| `SaludSinTitulo` | #222 | Salud sin «Salud» grande. Una sola fila arriba: selector variante avatars, chips de 40 px alineados a la izquierda (Rocky con foto y anillo verde, Luna con inicial). Cabecera **fija** (vidrio + línea inferior); el contenido está desplazado ~56 px y la tarjeta «Próxima dosis» pasa por debajo. | (sin título) · aria: «Rocky, seleccionada», «Luna» |
| `NutricionSinTitulo` | #222 | Igual con Nutrición: fila fija de avatars, el anillo de objetivo diario se corta bajo la cabecera. | (sin título) |
| `PerfilSinTitulo` | #222 | Perfil sin «Perfil» grande. Sobre el hero: selector glass a la izquierda (chips de 40 px, Rocky con anillo) y cápsula con texto a la derecha. Sin cabecera fija (el hero hace de cabecera). | «Añadir mascota» |
| `SaludSelectorMuchas` | #222 | 8 mascotas: la fila desliza en horizontal y sangra hasta el borde derecho; el último chip queda cortado a la mitad (20 de 40 px) como pista de scroll. Cabecera fija. | aria: «Mascotas, desliza para ver más» |
| `SaludUnaMascota` | #222 | Un solo chip (Rocky, seleccionado), a la izquierda. La fila se pinta igual (no desaparece). | (sin copy visible) |
| `AlertasAtendidasColapsada` | #223 | Abiertas arriba (2, bajo «Hoy») y debajo la sección «Atendidas» **colapsada** con contador y chevron. | «Alertas» · «2 nuevas» · «Hoy» · «Salió de la zona» · «Batería baja» · «Marcar leída» · «Atendidas» · «23» |
| `AlertasAtendidasExpandida` | #223 | Sección abierta (vista desplazada hacia abajo para caber): 10 filas compactas, más reciente primero, píldora «Resuelta» o «Leída» por fila, y al final «Ver más» con pie de conteo. | «Atendidas» · «23» · «Resuelta» · «Leída» · «Ver más» · «Mostrando 10 de 23» |
| `AlertasSinAbiertas` | #223 | Sin abiertas: tarjeta calmada en lugar de la lista, «Atendidas» expandida debajo (6 filas, sin «Ver más» porque no pasan de 10). Sin píldora «2 nuevas». | «Abiertas» · «Todo en calma» · «No tienes alertas abiertas. Rocky está tranquilo.» · «Atendidas» · «6» |
| `NutricionIAColapsada` | #224 | Tarjeta violeta «Recomendación IA» con el texto recortado a ~6 líneas (párrafo, **negrita**, viñetas, degradado de salida), «Ver más» (diana de 44) y aviso fijo debajo en 11 px muted. Vista desplazada para centrar la tarjeta. | «Recomendación IA» · «Ver más» · «Orientativo: no sustituye la opinión de tu veterinario.» |
| `NutricionIAExpandida` | #224 | Mismo texto completo (3 párrafos, 3 viñetas, 4 negritas), «Ver menos», mismo aviso. | «Ver menos» · mismo aviso |
| `InicioBurbujaOrbitWalk` | #225 | Clon de Inicio; la burbuja de Orbit usa la pose nueva a 56 dp con la frase de actividad. | «Rocky ya caminó 2.3 km hoy. Le falta la comida de las 18:00.» (alt «Orbit caminando») |
| `OrbitHojaComparativa` | #225 | Pose completa (224 px) sobre fondo de cuadros; burbuja a 56 dp en claro y en oscuro con la frase real; abajo la burbuja con la pose base para comparar. | «Hola, soy Orbit.» · «Pose nueva: caminando. Se usa cuando la frase habla de actividad.» |

### Texto de ejemplo de la explicación de IA (#224)

Sin cifras clínicas inventadas: solo 1200 kcal, 300 g y los horarios que ya
muestra la pantalla de Nutrición.

> Rocky necesita **1200 kcal al día**: son **300 g** de su alimento repartidos en tres comidas (08:00, 13:00 y 18:00).
>
> Para acompañarlo bien:
> - Mide la porción con una taza dosificadora, no a ojo.
> - Cuenta los premios dentro de los **300 g** del día.
> - Suma un paseo corto por la tarde si hoy se movió poco.
>
> Como registraste **alergias alimentarias**, revisa la etiqueta de cualquier alimento nuevo antes de dárselo. Si algo te genera dudas, tu veterinario puede orientarte.

Es ejemplo de forma, no salida real (en el repo no hay ninguna guardada).

## 2. Copy propuesto del aviso fijo (#224)

| | Texto |
|---|---|
| ES (propuesta) | «Orientativo: no sustituye la opinión de tu veterinario.» |
| EN (par) | "For guidance only: it doesn't replace your vet's advice." |

Razones: empieza por «Orientativo», como pide el plan; es una frase afirmativa
y corta (una línea en 11 px); no nombra riesgos ni dice «consulta urgente»,
así que no alarma. Va en español aunque la app esté en inglés si la IA
responde en español (§Idioma del plan): el par EN solo aplica al aviso.
Alternativa más cálida si el humano la prefiere: «Es una orientación: tu
veterinario sabe más de Rocky que yo.» (menos neutra, nombra a la mascota).

Términos de sección: «Atendidas», «Ver más», «Ver menos», «Marcar leída»
(existente), «Resuelta» y «Leída» (existentes), «Todo en calma» (nuevo).

## 3. Decisiones que el humano debe aprobar en G1

1. **Anatomía sin título (#222).** Solo selector, chips de 40 px, alineados a
   la izquierda con el borde del contenido (20 px); el anillo verde sobresale
   5 px. Perfil mantiene la cápsula «Añadir mascota» con texto.
2. **Cabecera fija solo en Salud y Nutrición** (vidrio con desenfoque y línea
   inferior; el contenido pasa por debajo). Perfil no, porque el hero es la
   cabecera. Los artboards se muestran ya desplazados para que se vea.
3. **Muchas mascotas.** Fila deslizable, separación de 10 px, último chip
   cortado a la mitad. Con 6 o menos caben todas sin corte (a 10 px caben 7).
4. **Una mascota:** se pinta el chip único (no se oculta la fila). Sin
   mascotas: no se pinta la fila y el contenido sube (ya existe
   `SaludSinMascota`, ver §5).
5. **Alertas (#223).** Abiertas siempre arriba; «Atendidas» colapsada por
   defecto con contador (se muestra 23 como total de ejemplo; qué cuenta el
   contador lo decide la spec); filas atendidas **compactas** (36 px de icono)
   para que 10 quepan; «Ver más» solo si hay más de 10 y con pie «Mostrando N
   de M».
6. **Sin abiertas:** tarjeta «Todo en calma» y desaparece la píldora «2
   nuevas». En ese artboard la sección «Atendidas» aparece ya expandida para
   enseñarla; la regla por defecto sigue siendo colapsada.
7. **IA (#224).** Recorte a ~6 líneas con degradado, «Ver más» / «Ver menos»,
   aviso siempre visible (también colapsado). Copy del aviso: ver §2.
8. **Orbit camina (#225).** La pose solo en la burbuja de Inicio y solo si la
   frase es de actividad; se anima igual (flota). Pose base para el resto.
   Texto visible siempre «Orbit», nunca «Pingo».

## 4. Coordenadas y publicación

Y de partida: **21488** (la última fila existente, `note-row17`/`PlanIA`, está
en y=20224 y su borde inferior en 21068). Se siguió la separación real del
canvas (filas cada 1264, nota `title1` en y−300) y no el «+120» literal del
plan, que apilaría las filas nuevas pegadas al borde de la anterior. Si
Backend añade filas antes de publicar, **sumar el mismo desplazamiento a las
cuatro filas y a sus notas**.

| Fila | Nota (`notes`) | y nota | y boards | x de cada board | maxW |
|---|---|---|---|---|---|
| #222 (5) | `note-row18` «UI · Títulos y selector de mascotas (#222)» | 21188 | 21488 | 0, 470, 940, 1410, 1880 | 2270 |
| #223 (3) | `note-row19` «UI · Alertas atendidas (#223)» | 22452 | 22752 | 0, 470, 940 | 1330 |
| #224 (2) | `note-row20` «UI · Explicación de la IA (#224)» | 23716 | 24016 | 0, 470 | 860 |
| #225 (2) | `note-row21` «UI · Orbit camina (#225)» | 24980 | 25280 | 0, 470 | 860 |

Orden de fichero en las filas: #222 `SaludSinTitulo`, `NutricionSinTitulo`,
`PerfilSinTitulo`, `SaludSelectorMuchas`, `SaludUnaMascota`; #223
`AlertasAtendidasColapsada`, `AlertasAtendidasExpandida`, `AlertasSinAbiertas`;
#224 `NutricionIAColapsada`, `NutricionIAExpandida`; #225
`InicioBurbujaOrbitWalk`, `OrbitHojaComparativa`.
Las claves del parche llevan `.dc.html` (formato del esquema). Las claves
`note-rowNN` pueden chocar si Backend ya usó 18–21: renumerar.

### Antes de publicar (lo hace el leader)

1. Subir `/home/claude/pet-tracker-mascot/mascot-11-walk.png` (1024×1024 RGBA)
   a la tienda de assets del canvas.
2. Reemplazar el literal `/_blob/ASSET_ORBIT_WALK` por la URL devuelta en
   **`InicioBurbujaOrbitWalk.dc.html`** (1 vez) y **`OrbitHojaComparativa.dc.html`**
   (3 veces). Sin ese cambio las imágenes de la pose salen rotas.
3. Releer `canvas.json` justo antes, aplicar el parche sobre esa versión y
   recalcular y si Backend movió filas.
4. Los `/_blob/` de Rocky (`1c2f4686…`) y de la pose base de Orbit (`f4ec4ed7…`)
   ya existen en el canvas (reutilizados de `Perfil` e `Inicio`): no hay que subirlos.

## 5. Notas

- **`SaludSinMascota` ya existe** en el canvas (`SaludSinMascota.dc.html`,
  x=470, y=8848): cubre «sin mascotas» de #222; no se repite aquí. Ojo: ese
  artboard todavía lleva el título «Salud» y no es la versión sin título; si
  el humano lo quiere coherente con #222, es un clon nuevo (no pedido).
- Luna no tiene foto en el canvas: se pinta con inicial sobre violeta. Las 6
  mascotas extra de `SaludSelectorMuchas` (Milo, Nala, Coco, Thor, Kira, Max)
  son inventadas y solo ilustran el desborde.
- Aproximaciones de maquetación sin verificar en navegador: el recorte de 122
  px de la IA colapsada (~6 líneas de 18 px con degradado) y el
  desplazamiento de las vistas «scrolleadas» están calculados a mano.
- **Anomalías en `canvas.json` (no se tocaron):** hay 25 claves de `boards`
  sin extensión (`PlanIA`, `FamiliaOwner`, `CuestionarioSalud`…) que tienen
  las coordenadas reales y `order` las lista sin extensión; cada una tiene un
  duplicado `<clave>.dc.html` con `y=0` y sin `title`; además `Main`, `Login`,
  `Registro`, `Recuperar` y `NuevaContrasena` están legítimamente en y=0.
  Conviene que quien publique decida cuál es la fuente de verdad antes de
  mezclar el parche.
