# Handoff a Codex CLI — #61 mobile-ui-legibility-polish

Fecha: 2026-09-03. Escrito por el leader; lo corre el humano en su terminal
de Windows, contra su clon. Codex no corre en el VPS.

El prompt de abajo es autosuficiente: Codex no ve la conversacion que origino
la spec. Todo lo que necesita decidir ya esta decidido por escrito en
`specs/mobile-ui-legibility-polish/`.

---

```
Feature: mobile-ui-legibility-polish, branch: feature/61-mobile-ui-legibility-polish
Spec aprobada: specs/mobile-ui-legibility-polish/requirements.md (status: approved)
Lee tambien, antes de escribir una linea:
  - specs/mobile-ui-legibility-polish/design.md  (los calculos de contraste y
    las excepciones declaradas; §2 fija los hex, §6 lista los asserts a tocar)
  - specs/mobile-ui-legibility-polish/tasks.md   (el plan de commits, R1..R12)
  - docs/ui-guidelines.md                        (la carta de UI del repo)
  - progress/audit_ui_polish.md                  (la auditoria de la que salen
    los requisitos; cada R-id cita su hallazgo)

Skills a cargar antes de tocar mobile-pet-tracker/ (plugin expo, ya instalado):
  expo-overview primero, y desde ahi expo-native-ui y expo-design-system.
  La carta docs/ui-guidelines.md GANA sobre cualquier skill: de una skill se
  toma el patron, nunca su sistema de estilos.

Archivos a crear/modificar:
  mobile-pet-tracker/src/theme/global.css
  mobile-pet-tracker/src/theme/touch-target.ts            (nuevo)
  mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
  mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts  (nuevo)
  mobile-pet-tracker/src/app/(auth)/login.tsx
  mobile-pet-tracker/src/app/(auth)/register.tsx
  mobile-pet-tracker/src/app/(auth)/forgot.tsx
  mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx
  mobile-pet-tracker/src/app/(tabs)/map.tsx
  mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx
  mobile-pet-tracker/src/app/(tabs)/health.tsx
  mobile-pet-tracker/src/screens/profile/index.tsx
  mobile-pet-tracker/src/screens/profile/index.test.tsx
  mobile-pet-tracker/src/screens/reminders/index.tsx
  mobile-pet-tracker/src/screens/reset-password/index.tsx
  mobile-pet-tracker/src/screens/reset-password/index.test.tsx
  (mas los archivos que tasks.md R10 enumera para los 13 controles tactiles)

Reglas criticas:
  - Arquitectura de docs/architecture.md y convenciones de docs/conventions.md
  - docs/ui-guidelines.md manda en todo lo de mobile-pet-tracker/: los tokens
    viven SOLO en src/theme/global.css. Cero hex fuera de src/theme/, cero
    clases arbitrarias [..], cero StyleSheet.create, cero shadow*/elevation
    legacy. Ese grep-clean lo establecieron #46 y #72 y sigue verde: no lo
    rompas
  - INVARIANTE DE LA FEATURE: cero cambios de conducta, logica, navegacion o
    contratos de API. Ningun testID se renombra o elimina y ningun texto
    visible cambia. Los tests de #33-#37 se anclan a testIDs y a textos
  - UNICA excepcion al invariante, ya declarada en design.md §6: los 10
    literales de color en 9 lineas de
    src/theme/__tests__/global-css.test.ts, que asertan valores de token de
    #46 R1/R2. Esos si se tocan. Cualquier OTRO test que se ponga rojo es una
    senal de que rompiste conducta: para y reportalo, no lo reescribas
  - TDD por requisito: test rojo que NOMBRA su R-id -> verde -> refactor
  - UN COMMIT POR REQUISITO COMO MINIMO, con el commit del test rojo ANTES
    que el de su implementacion. Un unico commit con todo incumple C4 de
    CHECKPOINTS.md; paso en #19 y no se repite
  - Respeta el orden de tasks.md: R1 va PRIMERO. Arregla la etiqueta del
    boton destructivo de reminders, que hoy usa el token del acento sobre
    bg-danger. Si cambias --accent antes que eso, ese boton rojo se queda con
    la etiqueta verde
  - Actualiza specs/mobile-ui-legibility-polish/traceability.md tras cada
    commit (la columna de estado)
  - No crear recursos AWS ni correr cdk deploy

Criterios de aceptacion: R1 a R12 de requirements.md. Los valores exactos no
se negocian: --accent #178255, --accent-foreground #FFFFFF sin tocar,
--accent-strong #107148 en light y #2AB87C en dark, --warning-strong #92610A
en light y #FBBF24 en dark, --muted #667085 en light sin tocar dark.

Al terminar: escribe el resultado en
progress/impl_mobile-ui-legibility-polish.md e informa al humano. No abras el
PR tu: lo hace el leader tras la review.
```

---

## Lo que NO entra en este handoff

- Los hallazgos 8-12, 14-18, 20 y 22-26 del audit: son de #62
  `mobile-ui-consistency-polish`, que aun no tiene spec.
- El hallazgo 18 (si `--radius-card` debe ser 16px en vez de 20px): el humano
  decidio el 2026-09-03 no reabrirlo; se compara en el smoke, al mismo tamano
  fisico.
- Todo lo que exija cambio de conducta, listado al final de
  `progress/audit_ui_polish.md`.

## Gate humano posterior a Codex

Smoke en dev build de Android comparando lado a lado con el Figma, en tema
claro Y oscuro, confirmando que el acento se ve mas oscuro que el Make **a
proposito**, que las etiquetas blancas se leen encima, y que el verde de tinta
sigue vivo en dark. No delegable a IA.
