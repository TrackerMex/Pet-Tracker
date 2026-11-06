# Notas de la spec #243 mobile-orbit-cachorro-art

Para el leader. La spec está en `specs/mobile-orbit-cachorro-art/` (requirements,
design, tasks, traceability) y la feature queda `spec_ready` en `feature_list.json`.
No firmé nada: las cuatro casillas de requirements.md §Aprobación están sin marcar.

## Lo que decidí (y por qué)

- **Herramienta:** `uvx --with pillow==13.0.0 python -I`, de un solo uso, sin tocar
  `package.json` ni `bun.lock`. Reproducida en tres corridas con hashes idénticos.
  `bunx sharp-cli` lo denegó el clasificador del entorno y `cwebp` no está instalado.
  El script está probado y embebido en design.md §2; Codex lo guarda byte a byte.
- **Candado:** los tests existentes ya fijan formato y tamaño de las diez poses y
  pasan con el arte nuevo sin tocarlos. El candado nuevo es un pin sha256 de los diez
  WebP, más «ningún fichero conserva el arte viejo», más las fuentes congeladas
  (`orbit-cachorro-art.test.ts`). R1 y R3 «fuentes» nacen verdes; el rojo es R2 y
  R3 «script».
- **Alfa:** `alfa < 16` pasa a 0 y `alfa >= 252` pasa a 255. Jest no decodifica WebP;
  el alfa y los márgenes los verifica la lectura de vuelta del script, y R2 los
  congela por bytes.
- **G4:** sección nueva `## Enmienda #243 — Orbit es un cachorro` al final de la
  carta (literal en design.md §4), tecleada **después** de la firma (C4 y C5), como
  la E1 de #225. El punto 7 no se toca. «Pingo» queda como historia en la enmienda.
- **Docs que describen el robot:** ninguno. `git grep` de «antena|gorro|robot» en
  `docs`, `src`, README y AGENTS da 0. Lo único que cambia en docs es la enmienda.
- **Ninguna línea de producción cambia** (R5): los diez `require` y los tamaños
  siguen igual; la guarda de tasks.md lo comprueba contra H0.

## Decisiones abiertas para el humano o el leader

1. **Splash e icono quedan con el robot** (R7, D4). Es lo que se ve primero al abrir
   la app. Recomiendo registrar ya una feature de seguimiento (icono, splash,
   favicon, adaptive icon y notificaciones), que depende de G6 (el PNG del icono de
   Orbit). La spec lo declara fuera, no lo resuelve.
2. **Bienvenida: `wave` y `wave-blink` no están registradas.** El guiño tiene otra
   cabeza y otro parche, y `welcome` las superpone con opacidad 0 a 1. Habrá un salto
   visible. Está en el smoke G2 paso 2. Si el humano lo rechaza, hay que regenerar
   `wave-blink` y reabrir G1 solo para esa pose.
3. **`sleep`** se reescaló al 82 % por decisión del leader delegada por el humano (D5): ancho 788 px, márgenes 114, 274, 122 y 275 px.
4. **G1 antes del handoff.** La casilla G1 es sobre los diez PNG de `design-src/` con
   sus hashes. Si el humano cambia una pose después de firmar, hay que enmendar la
   tabla de §Constantes y el test, y reabrir el gate solo para ese cambio.
5. **Merge parcial.** La spec permite mergear C1 a C3 con la firma del leader y G1, y
   dejar R6 (C4 y C5) para cuando firme G4. `done` exige además G2. Si prefieres una
   sola PR cerrada, espera a G4 antes del handoff.

## Riesgos

- **Hash en otra máquina.** Los pins salen de `pillow==13.0.0` en esta VPS. Si Codex
  (otra máquina o glibc) obtiene otros hashes, la regla es PARAR sin editar el pin y
  que tú re-midas (D2). Pillow empaqueta su propio libwebp, así que lo esperable es
  que coincidan.
- **El pin no distingue «mal limpiado» de «bien limpiado»** por sí mismo; lo hace el
  script de vuelta (`FALLA` si queda alfa < 16 o margen < 24). M2 y M8 de design.md §5
  son las mutaciones de zona ciega para el reviewer.
- **`uvx` necesita red** la primera vez, para bajar Pillow. Si el entorno de Codex
  no tiene red, la conversión la corres tú con los mismos comandos.
- **Mocks y tamaños:** no cambian. Los tests con `pose` solo leen `testID` o
  `source`; no deberían depender del contenido del binario.
- **Choque de ids o de ramas:** la rama sale de `origin/dev`; el único fichero común
  con otras features es `feature_list.json` (solo la entrada 243) y, en C5,
  `docs/ui-guidelines.md` (se añade al final; si otra enmienda llega primero, es un
  conflicto de texto trivial, no de contenido).

## Para el handoff a Codex

- Rutas exactas y nombres de `it`: tasks.md y design.md §3.
- Pide commits test-primero (C1 rojo, C2 verde) y que **no** toque las casillas.
- Incluye el H0 para las guardas de tasks.md §Guardas finales.
- No uses nombres de skills de Claude: la tarea no toca UI, no hacen falta.
- Que Codex no lance `./init.sh` (lo pone el prompt, no solo AGENTS.md).
