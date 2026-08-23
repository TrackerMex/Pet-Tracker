---
feature: "mobile-figma-polish"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-figma-polish]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente del diseño (versionada en este repo, no de memoria):
> `specs/mobile-figma-polish/design-src/App.tsx` (pantallas y clases exactas),
> `design-src/theme.css` (tokens), `design-src/fonts.css` (Inter).
> Figma Make original: https://www.figma.com/make/K3GsL0HHUCW3AaFj3osx0B
>
> **Invariante de toda la feature (aplica a R1–R12)**: cero cambios de conducta,
> lógica, navegación o API. Ningún `testID` se renombra/elimina y ningún texto
> visible cambia — los tests de #33–#37 se anclan a ambos. Los diffs en
> pantallas son solo de `className`/estilo/estructura visual de contenedores.

## Requisitos funcionales

### Tokens y tema

- **R1**: WHEN se compila la app THE SYSTEM SHALL definir en
  `mobile-pet-tracker/src/theme/global.css` (variant `light`) los tokens
  heroui-native con los valores exactos del diseño según la tabla de mapeo de
  [[design]] §Mapeo de tokens — en particular `--accent: #2AB87C` y
  `--accent-foreground: #FFFFFF` (el acento pasa del azul `#208AEF` actual al
  verde del diseño), `--foreground: #0D1117`, `--muted: #6B7280`,
  `--default: #F5F6F8`, `--surface-secondary: #F0FBF6`,
  `--border: rgba(13,17,23,0.07)`, `--danger: #EF4444`,
  `--warning: #F59E0B`, `--success: #0F9B5A` y `--field-radius: 0.75rem`;
  THE SYSTEM SHALL NOT sobreescribir `--radius` (corrección del smoke
  2026-08-23: en heroui-native `--radius` es la BASE de toda la escala
  `rounded-*` — `xl=×1.5`, `2xl=×2`, `3xl=×3` sobre default 0.5rem —, no el
  radio de card como en el shadcn del Make; con base 1.25rem todos los
  componentes se inflaban. Los 20px de las cards salen de `rounded-[20px]`
  literal en las pantallas).
  *Verificación: test jest que lee `src/theme/global.css` y asserta los valores
  (nombra R1).*

- **R2**: WHEN el tema activo es dark THE SYSTEM SHALL aplicar la paleta dark
  **derivada de la paleta light del diseño** definida en [[design]] §Dark mode
  (acento `#2AB87C` sin cambio, fondos oscuros neutros con tinte del
  foreground del diseño), manteniendo el patrón actual de overrides por
  variant en `global.css`; THE SYSTEM SHALL NOT copiar los valores `oklch`
  del bloque `.dark` de `design-src/theme.css` (dark genérico autogenerado,
  no diseñado).
  *Verificación: mismo test de R1, asserts sobre el bloque `dark` (nombra R2).*

- **R3**: WHEN monta el layout raíz (`src/app/_layout.tsx`) THE SYSTEM SHALL
  cargar la familia **Inter** (pesos 400, 500, 600, 700 y 900) vía
  `expo-font` desde archivos `.ttf` versionados en
  `mobile-pet-tracker/assets/fonts/`, y los `Text` de la app SHALL renderizar
  con Inter como familia por defecto. IF las fuentes aún no cargaron THEN THE
  SYSTEM SHALL seguir mostrando la UI con la fuente del sistema (sin bloquear
  el arranque más allá del splash existente).
  *Verificación: test jest que asserta la existencia de los 5 `.ttf` en
  `assets/fonts/` y que `_layout.tsx` los registra (nombra R3). Fidelidad
  visual la cubre R12.*

### Componentes compartidos

- **R4**: WHEN se renderiza la barra de tabs
  (`src/components/floating-tab-bar.tsx`) THE SYSTEM SHALL conservar la
  **pill flotante actual** (forma, posición, sombras y márgenes sin cambios
  — decisión del humano en el gate, 2026-08-23: NO se adopta la barra
  anclada del `BottomNav` del Make) y SHALL re-tokenizarla al diseño: ítem
  activo en el nuevo `accent` verde, ítems inactivos en `muted`, iconos con
  tamaño/peso actuales (Filled activo / Outline inactivo), label 10px
  `font-semibold` como el diseño — conservando los `testID` `tab-*` y los
  labels actuales.
  *Verificación: tests existentes de tab bar verdes + smoke R12.*

- **R5**: WHEN se renderiza `src/components/weight-chart.tsx` THE SYSTEM SHALL
  dibujar la curva como en el diseño (L1549–1564): stroke `#2AB87C` (token
  accent) de 2.5, puntos circulares r≈3 rellenos en accent sobre cada dato, y
  área bajo la curva con gradiente vertical accent 20% → transparente
  (via `<LinearGradient>` de `react-native-svg`, ya instalado).
  *Verificación: tests existentes del chart verdes + smoke R12.*

### Pantallas (solo estilo; estructura y clases objetivo derivadas de design-src/App.tsx)

- **R6**: WHEN se renderiza Home (`src/app/(tabs)/home.tsx`) THE SYSTEM SHALL
  aplicar el lenguaje visual del `HomeScreen` del diseño (L332–451):
  chips de mascota como pills `rounded-full` con activo `bg-accent`
  `text-accent-foreground` `font-semibold` e inactivo `bg-default`
  `text-foreground`; cards con `bg-surface`, borde `border`, radio 20px y
  `shadow-sm`; el summary en columnas separadas por borde vertical `border`
  con valor `text-sm font-bold text-foreground` y label
  `text-[10px] text-muted`; fila de ubicación/collar como banda
  `bg-default rounded-2xl` con icono en tile circular `bg-accent-soft` y
  batería coloreada `success`/`warning` según nivel (>60% verde); el acceso
  "View on map" estilizado como acción en `accent font-semibold`.
  *Verificación: suite de home verde sin tocar asserts + smoke R12.*

- **R7**: WHEN se renderiza Map (`src/app/(tabs)/map.tsx`) THE SYSTEM SHALL
  estilizar el overlay de stats como en `MapScreen` del diseño (L489–514):
  tiles de métrica `bg-default rounded-xl p-3` centrados con valor
  `font-black` (accent para velocidad/distancia, `muted` para las neutras) y
  label `text-[10px] text-muted`; y el botón "Activate Lost Mode" en estilo
  danger-soft del diseño (fondo `#FEF2F2`→`danger-soft`, texto `danger`
  `font-bold`, borde `danger` suave, radio 12px), conservando su estado
  deshabilitado y su texto actual.
  *Verificación: suite de map verde + smoke R12.*

- **R8**: WHEN se renderiza Health (`src/app/(tabs)/health.tsx`) THE SYSTEM
  SHALL aplicar el estilo del `HealthScreen` del diseño (L519–584): headers de
  sección `text-xs font-semibold text-muted uppercase tracking-widest`; card
  de próxima vacuna con tile 44px `rounded-xl` fondo `#FEF3C7`
  (warning-soft) con los días restantes en `warning` `font-black` +
  label "días/days" pequeño en `muted`; cards de lista con `bg-surface`,
  borde `border`, radio 20px, `shadow-sm`; card de peso con el valor actual
  en `accent font-black` junto al título.
  *Verificación: suite de health verde + smoke R12.*

- **R9**: WHEN se renderiza Weight log (`src/app/(tabs)/weight-log.tsx`) THE
  SYSTEM SHALL aplicar el estilo del `WeightLogScreen` del diseño
  (L1515–1629): formulario en card `bg-surface` radio 20px con labels
  `text-[10px] font-semibold`, inputs con fondo `default` y radio 12px;
  botón de guardar sólido `bg-accent text-accent-foreground font-bold` radio
  12px; historial como filas card con tile 32px `rounded-lg` cuyo fondo
  refleja el delta (`success-soft` si baja, `danger-soft` si sube, `default`
  si igual) y el delta coloreado `success`/`danger` junto al peso en
  `font-bold`.
  *Verificación: suite de weight-log verde + smoke R12.*

- **R10**: WHEN se renderiza Profile (`src/app/(tabs)/profile.tsx`) THE SYSTEM
  SHALL aplicar el estilo del `ProfileScreen` del diseño (L657–750): cards
  `bg-surface` borde `border` radio 20px `shadow-sm` con label de sección
  `uppercase tracking-widest text-muted text-xs font-semibold`; filas de
  información `justify-between` con separador `border-b` color `separator`
  (label en `muted text-sm`, valor `font-semibold text-foreground`); el chip
  de salud del backend usando `success`/`danger` del tema; botón "Sign out"
  en estilo danger-soft (fondo `danger-soft`, texto `danger font-bold`).
  *Verificación: suite de profile verde + smoke R12.*

- **R11**: WHEN se renderizan Login, Register o Forgot
  (`src/app/(auth)/login.tsx`, `register.tsx`, `forgot.tsx`) THE SYSTEM SHALL
  aplicar el estilo de los formularios del diseño (`LoginScreen` L207–245,
  `RegisterScreen` L276–330, `ForgotScreen` L247–274): título
  `text-2xl font-black text-foreground` centrado; labels
  `text-xs font-semibold`; inputs con fondo `default`, radio 12px y
  placeholder en `muted`; botón primario `w-full` sólido
  `bg-accent text-accent-foreground font-bold` radio 16px; acciones
  secundarias/links (olvidé mi contraseña, crear cuenta, volver) en
  `accent font-semibold` o botón outline con borde y texto `accent`; en
  Forgot, icono de candado en tile 64px `rounded-2xl` fondo `accent-soft`
  con glifo en `accent` — conservando copy y `testID` actuales.
  *Verificación: suite de auth verde + smoke R12.*

### Cierre

- **R12**: WHEN la implementación está completa THE SYSTEM SHALL pasar la
  suite móvil completa (`bun test` en `mobile-pet-tracker/`) **sin ninguna
  modificación en los asserts de conducta existentes** (diff vacío en
  `__tests__/` salvo los tests nuevos de R1–R3), y un humano SHALL ejecutar
  el smoke en Expo Go comparando cada pantalla en alcance lado a lado contra
  el Make abierto en el navegador (light y dark), registrando el resultado
  por pantalla en `progress/impl_mobile-figma-polish.md`. Este requisito solo
  lo cierra el humano.

## Fuera de alcance

Pantallas/elementos del Make **sin equivalente en la app actual** — no se
crean en #46:

- Splash/onboarding (`SplashScreen`), pantalla Food completa (`FoodScreen`
  — `food.tsx` sigue siendo placeholder), Documentos médicos (`DocsScreen`),
  Recordatorios (`RemindersScreen`, `AddReminderScreen`), Alta de mascota
  (`AddPetScreen`), Geocercas (`GeofencesScreen`), Horario de comidas
  (`MealScheduleScreen`), Configuración GPS (`GpsConfigScreen`),
  notificaciones (campana con badge), registro en 2 pasos con selector de
  país, grid de "Accesos rápidos" y secciones de contenido nuevo
  (Recordatorios en home, Expediente médico, semanal en barras).

Elementos del diseño **excluidos por decisión** (detalle en [[design]]):

- **Headers hero con foto de mascota a 280–340px + overlay de gradiente**
  (Home/Health/Profile/WeightLog del Make). Es una reestructuración de layout
  mayor y el overlay pide gradientes; las pantallas conservan su estructura
  de header actual re-tokenizada. Si el humano quiere fidelidad total de los
  heros, es una feature aparte — decisión visible para el gate.
- **Gradientes** (botones `linear-gradient(135deg,#1DA868,#2AB87C)` y
  overlays): requerirían `expo-linear-gradient` (dep nueva, prohibido) o SVG
  ad-hoc. Se sustituyen por sólido `accent`. Excepción: el gradiente del área
  del weight-chart (R5) sí va, porque `react-native-svg` ya lo soporta.
- **Copy**: ningún texto visible cambia. Todo el copy del Make (es-ES:
  "Iniciar sesión", "pasos hoy", "Zona Segura"…) queda fuera; la app conserva
  su copy actual porque los tests de #33–#37 se anclan a él.
- Emojis decorativos del Make como iconografía: los iconos siguen saliendo de
  `reicon-react-native` (docs/conventions.md §app móvil).
- Fotos de stock/Unsplash del Make y assets `design-src/` — son referencia,
  no se importan a la app.
- Cambios en backend, API, navegación, deps de `package.json` o config de
  Expo.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-23) ← gate obligatorio antes de implementar

Decisiones que el humano ratifica al aprobar (detalle y alternativas en [[design]]):

1. Acento global azul `#208AEF` → verde `#2AB87C` (R1).
2. Dark derivado de la paleta light del diseño, no los oklch del Make (R2).
3. Inter vía `.ttf` estáticos en `assets/fonts/` + `expo-font` ya instalado
   — cero deps nuevas (R3).
4. Tab bar: se CONSERVA la pill flotante actual, solo re-tokenizada
   (decisión del humano, 2026-08-23; la barra anclada del Make se rechaza) (R4).
5. Headers hero y gradientes de botón fuera de alcance (arriba).
