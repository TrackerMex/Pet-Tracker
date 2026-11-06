# Notas de la spec #244 mobile-orbit-splash-icono

Para el leader. La spec está en `specs/mobile-orbit-splash-icono/` (requirements,
design, tasks, traceability, más `convert-orbit-icons.py` y `design-src/`) y la feature
queda `spec_ready` en `feature_list.json`. No firmé nada: las casillas de la firma
delegada, G4, G3 y G2 de requirements.md §Aprobación están sin marcar. G6 está
marcada `[x]` con fecha 2026-11-06 **porque tu encargo la da por aprobada**: al
firmar, cita el mensaje del humano que la aprobó (yo no lo vi).

## Lo que decidí (y por qué)

- **Herramienta y script:** `uvx --with pillow==13.0.0 python -I`, como #243. El script
  vive como fichero con su sha256 pinneado (R3), no embebido en design.md: 115 líneas con
  nueve constantes son mucho para copiar a mano. Tres corridas con hashes idénticos.
- **Ocho PNG nuevos:** siete de `images/` y `expo.icon/Assets/orbit.png` (mismos bytes
  que el primer plano). Pin sha256 de los ocho (R1) más «ningún fichero de `assets/`,
  recursivo, conserva los once hashes viejos» (R2).
- **Zona segura, radio 338 (66 % de 1024 / 2):** vale para el icono adaptativo y para
  el círculo de 2/3 del splash de Android 12. La fuente del splash tiene radio máximo
  708.5 px, así que el script la reduce a 799 px y la pega en (116, 109): radio 335.2,
  caja (216, 190, 815, 826), dentro de las pruebas ya existentes de [174, 850).
- **Monocromo con recorte oscuro:** luminancia < 60 pasa a hueco (ojos, nariz, boca).
  La silueta llena sería una mancha sin cara. Es la decisión de aspecto que más conviene
  que el humano mire en G2.
- **Candado de píxeles sí es posible aquí** (PNG se decodifica con `zlib`): R5 círculo
  (splash, primer plano, monocromo), R6 opacidad de icono y favicon, R7 blancos, márgenes
  y color de notificaciones. Jest no ve el recorte ni la limpieza de alfa: solo el sha256
  (M2, M3 en design.md §6, zona ciega).
- **Una sola edición a un test existente (D10):** el `it` `la punta del pin es
  transparente` de `app.assets.test.ts` (`#115 R10`) fijaba la forma del robot y el cachorro
  ocupa esa caja. Se sustituye por el candado circular de R5. Los otros tres `it` pasan
  sin tocar (medido: caja 216-815 x 190-826, esquinas vacías, `alpha(512, 560) = 255`).
- **Auditoría de candados** (lección de la Enmienda 1 de #243), con `grep` real sobre
  `mobile-pet-tracker/` y `hosting/`: requirements.md §Tests existentes, grupos A (leen
  los PNG), B (escanean directorios y la carta) y C (fuera del árbol móvil). Único
  riesgo real: `orbit-rename.test.ts` `#225 R4` falla con cualquier línea de código de un
  test que nombre a Pingo. La spec lo evita: el test nuevo y la Enmienda #244 no usan esa
  palabra, así que **no hay entrada nueva en `exceptions`**.
- **`app.json` y `app.config.test.ts` no cambian:** todas las rutas, `imageWidth` 200 y
  `#9460FC` ya están fijadas y los nombres se conservan.
- **`icon.json` (iOS):** conserva el andamiaje de Expo (clave `automatic-gradient`,
  sombra, translucidez, plataformas); cambian el color del relleno a `#9460FC` y la capa
  única `orbit.png`. Literal en design.md §4; test R8 por `toEqual` del JSON.
- **G4:** sección nueva `## Enmienda #244 — El icono y el splash son de Orbit`, literal en
  design.md §5, que cierra el punto 4 «Pendiente» de la #243 por referencia. Se teclea
  después de la firma (C4, C5). No toqué `docs/ui-guidelines.md`.
- **Dos tramos:** C1 a C3 (R1 a R9, R11) no necesitan G4 y se mergean con tu firma,
  G6 y el reviewer; C4 y C5 (R10) esperan a G4.

## Desviaciones de la descripción de la feature (puedes vetarlas antes del handoff)

1. **`logo-glow.png` no se sustituye** (D12): es un destello azul sin mascota y no lo
   importa nada de `src/`. Se fija su sha256 para que nadie lo toque. Si quieres
   rehacerlo, es otra fuente de G6 y otra spec.
2. **`pet-tracker-app-icon.png` se borra, no se sustituye** (D13), junto con el monocromo
   original, el SVG y `grid.png` del andamiaje de Expo y `scripts/make-icons.mjs` (el
   pipeline `jimp` del robot, sin referencias vivas). El maestro nuevo es
   `design-src/orbit-icon.png`. Un duplicado de `icon.png` (586 KB) sería peso muerto. Si
   vetas esto, R2 y R11 pierden esas filas.

## Decisiones abiertas para el humano o el leader

1. **Casilla de G6:** está marcada `[x]` con tu encargo como fuente. Confirma o
   desmárcala al firmar.
2. **G3 y G2:** icono, splash, favicon y notificaciones son nativos; el smoke exige el
   rebuild del dev build. Hay 6 pasos en requirements.md §Smoke G2 para el lote final.
3. **Monocromo ruidoso a 96 px** (D7): si el humano lo ve así en la notificación, el
   remedio es `DARK_CUTOFF = 0` (silueta llena), que cambia los hashes de R1 y exige
   enmendar la tabla. Es una feature de seguimiento, no un parche.
4. **Splash grande o pequeño:** el perro mide unos 117 dp de ancho con `imageWidth` 200.
   Cambiar `imageWidth` toca `app.json` y su test: feature aparte (fuera de alcance).
5. **Merge parcial** (C1 a C3 sin R10) o una sola PR esperando a G4: tu decisión.

## Riesgos

- **iOS no se puede verificar** (#60 aparcada, sin cuenta de pago): el test fija la
  estructura del `icon.json`, no cómo lo pinta Xcode. Sin casilla de gate; queda declarado.
- **Hash en otra máquina:** los pins salen de `pillow==13.0.0` y `uv 0.12.9` en esta
  VPS. Si Codex obtiene otros, la regla es PARAR sin editar la tabla y que tú re-midas
  (D2). Pillow empaqueta su propio libpng/zlib; lo esperable es que coincidan, pero zlib
  puede variar entre versiones del sistema.
- **`uvx` necesita red** la primera vez. Sin red en el panel de Codex, corre tú el
  script con los comandos de design.md §2.
- **El worktree `Pet-Tracker-wt-244` no tiene `node_modules`** (lo comprobé): antes de
  lanzar Codex, `bun install --frozen-lockfile` en `mobile-pet-tracker/` y copia el
  `.env`, según tu memoria del worktree nuevo. tasks.md manda a Codex que pare si falta.
- **Splash en Android 12:** la razón de 2/3 es la documentada por Google; no la he
  visto en un dispositivo. G2 paso 3 la verifica.
- **`bunx jest` con paths:** ningún comando lleva paréntesis.

## Handoff a Codex (para el prompt)

- Skills de Codex: **ninguna**. Prohibir `init.sh`. Commits test-primero: C1a, C1b, C2.
  No empezar C4 sin que confirmes G4 marcada.
- Citar §Esperas del leader.md. Citar el literal de D11: no escribir la palabra de Pingo en
  código de tests.
- C1b nace casi todo verde: solo R5 splash y R5 foreground son rojos. Es esperado y
  está escrito en tasks.md.
- Las guardas de tasks.md llevan la salida esperada literal; `H0` lo pones tú.
