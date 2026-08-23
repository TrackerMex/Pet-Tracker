# Handoff a Codex CLI — corrección dark mode #46 (hallazgo smoke R12)

> El humano copia el bloque como prompt de Codex CLI. Segundo hallazgo del
> smoke (el primero, radius, ya está corregido en `e370daa`).

```
Feature: mobile-figma-polish (#46), branch: feature/46-mobile-figma-polish
Corrección de bug hallado en el smoke humano (Expo Go, Android físico, tema dark):

SÍNTOMA (reportado por el humano):
1. Selector de mascotas: con la mascota SELECCIONADA, el texto del chip se ve
   NEGRO en tema dark (debería ser blanco --accent-foreground sobre bg-accent
   verde). Aplica en home/health (patrón pet-chip-<id>).
2. TODOS los iconos que reciben color por prop se ven NEGROS en tema dark
   (tab bar, home, health, etc.).

DATOS YA VERIFICADOS (no re-verificar, ir directo a reproducir):
- specs/mobile-figma-polish/ + src/theme/global.css: tokens dark correctos
  (--accent-foreground: #FFFFFF en light y dark; dark define paleta completa
  bajo @variant dark dentro de @layer theme, misma estructura que en main).
- Los iconos reciben color de useThemeColor de heroui-native, que internamente
  usa useCSSVariable de uniwind sobre --color-<token> y devuelve el string
  'invalid' si la variable no resuelve — y color="invalid" en RN pinta NEGRO.
  Hipótesis principal: en tema dark useCSSVariable no resuelve los tokens
  (¿solo resuelve los del variant activo al montar?, ¿no re-resuelve tras
  Uniwind.setTheme?, ¿los custom del @layer theme no llegan al resolver JS?).
  Archivo: node_modules/heroui-native/lib/module/helpers/external/hooks/use-theme-color.js
- El texto del chip usa className text-accent-foreground (home.tsx ~L140,
  health.tsx análogo) — si también falla, la causa puede ser la misma
  resolución de variables en dark, no el className.
- El toggle de tema vive en profile.tsx (Uniwind.setTheme).

TAREA:
1. Reproduce en dark (emulador/dispositivo o test RTL con tema dark forzado).
2. Encuentra la causa raíz y corrígela. Posibles salidas (elige por evidencia,
   no a ciegas): re-suscribir/re-montar al cambiar tema; resolver los colores
   de icono vía className en vez de prop color donde sea posible; o ajustar
   cómo global.css declara los variants para que uniwind los resuelva en JS.
3. Si el fix es de app, deja un test que falle con el bug si es testeable
   (p. ej. render en dark assertando el color resuelto); si solo es
   verificable en device, dilo explícito en el reporte.

INVARIANTES (siguen vigentes): ni testIDs ni copy cambian; cero deps nuevas;
solo estilo/lógica de tema — nada de API/navegación; suite completa
(bun run test), typecheck y lint verdes; ./init.sh exit 0.

Al terminar: append en progress/impl_mobile-figma-polish.md
(sección "Corrección post-smoke: dark mode") con causa raíz, fix, comandos y
exit codes. Commits conventional (fix(mobile-figma-polish): ...). NO pushees.
```
