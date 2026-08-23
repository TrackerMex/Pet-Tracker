# Handoff a Codex CLI — corrección dark mode 2ª ronda #46 (smoke R12)

> Tercer hallazgo del smoke. Radius (`e370daa`) y stylesheet (`e2d3d50`) ya
> corregidos; el humano confirma que Home y tab bar ya se ven bien en dark.

```
Feature: mobile-figma-polish (#46), branch: feature/46-mobile-figma-polish
Corrección de 3 bugs de dark mode hallados en el smoke (Expo Go, Android físico):

BUG 1 — Profile: iconos del toggle sin color.
  src/app/(tabs)/profile.tsx L60: <Sun size={20} /> / <Moon size={20} /> van
  SIN prop color → reicon pinta negro en dark. Fix: color por token del tema
  (foreground o muted, coherente con el diseño), mismo mecanismo que el resto
  de iconos ya corregidos.

BUG 2 — Health: la jeringa (Syringe, health.tsx L164, color={warning}) sigue
  sin verse en dark aunque --color-warning ya se materializa por variant
  (fix e2d3d50). Hipótesis: resolución STALE — las tabs de Expo Router quedan
  montadas; al cambiar tema desde Profile, useThemeColor/useCSSVariable de la
  pantalla Health no re-resuelve (Home sí porque re-renderiza por sus
  fetches). Verifica si useCSSVariable de uniwind se suscribe al cambio de
  tema; si no, resuelve los colores de icono vía className (text-warning
  sobre el glifo si reicon lo soporta / wrapper) o fuerza re-render por tema
  (p. ej. leyendo el tema del provider existente en esas pantallas). Aplica
  el mismo patrón a TODOS los iconos por prop de pantallas montadas en tabs
  (health, weight-log, home, floating-tab-bar) para que el cambio de tema en
  caliente sea consistente.

BUG 3 — Map: MapView (src/app/(tabs)/map.tsx L174) no aplica dark: Google
  Maps en Android no se oscurece solo. Fix sin deps nuevas: customMapStyle
  con un JSON de estilo dark estándar de Google Maps versionado en el repo
  (p. ej. src/theme/map-style-dark.json, estilo "night" oficial de Google),
  aplicado solo cuando el tema activo es dark; en light, sin customMapStyle.
  El JSON es config, no copy: no rompe ningún test.

INVARIANTES: ni testIDs ni copy cambian; cero deps nuevas; suite completa
(bun run test), typecheck, lint verdes; ./init.sh exit 0. Tests: BUG 1 es
assertable (color en el árbol renderizado); BUG 2 déjalo con test si es
reproducible en Jest (cambio de tema en caliente), si no, documenta que solo
se verifica en device; BUG 3 asserta que MapView recibe customMapStyle en
dark y no en light (mock de react-native-maps ya existe en la suite de #36).

Al terminar: append en progress/impl_mobile-figma-polish.md (sección
"Corrección post-smoke: dark mode 2") con causa raíz por bug, comandos y
exit codes. Commits conventional por bug o por grupo coherente. NO pushees.
```
