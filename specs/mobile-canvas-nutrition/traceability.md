---
feature: "mobile-canvas-nutrition"
status: approved
tags: [harness, spec, mobile, canvas-parity]
---

# Trazabilidad — [[mobile-canvas-nutrition]] (#200)

| R | Test | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | DS `#200 R1`; FO y candados de ruta | f4363121 | 4c1eab22 | verificado por requisito |
| R2 | FO `#200 R2` ×4 | a770860b | 42d516d0 | verificado por requisito |
| R3 | FO `#200 R3` (héroe y cinco textos); HT fila 52 | 97e8fc3e | 556e103c; HT 14dee099 | verificado por requisito |
| R4 | MT `#200 R4`; FO timing y track | ce1bb032 | f773b353 | verificado por requisito |
| R5 | FO `#200 R5`; inventarios de Card, tinta y esquina | 4d7ddc5b | a7a23d9a | verificado por requisito |
| R6 | FO `#200 R6` ×4; copy Marcar servido | 1a4c70c1 | dccce7d3 | verificado por requisito |
| R7 | FO `#200 R7` ×2 (negativo nacido verde, mutado) | 96295d13 | 5df35c8a | verificado por requisito |
| R8 | FO `#200 R8`; inventario de IA | fde92720 | fc640890 | verificado por requisito |
| R9 | FO `#200 R9` ×2; DD fila 53 | 2194ccca | 76b5bea8; DD 309a1c8e | verificado por requisito |
| R10 | FO `#200 R10` (6 piezas y negativo sin plan mutado); retirada CF #197 R20 | ef53a51d | b4c2e91b | verificado por requisito |
| R11 | FO `#200 R11` (orden; rojo junto a R9) | 2194ccca | 76b5bea8 | verificado por requisito |
| R12 | MS cabecera en loading/loaded; LY opción nativa | e7dabe58 | b5a0e887 | verificado por requisito |
| R13 | MH cabecera en loading/loaded; LY opción nativa y posición 12 | 009e815c | efdbd055 | verificado por requisito |
| R14 | MS `#200 R14`: labio violeta | 3a096545 | c2b79aca | verificado por requisito |
| R15 | MS retardos 0/80/140; MH 0/100; DD imports | 554d4935 | 0a5396d6 | verificado por requisito |
| R16 | NC 17 literales, 2 cabeceras, 2 casos de carta; CC/DD/CF | 09aa0139 | c83b8147 | verificado por requisito |
| R17 | NC 6 casos estilo/corchetes, 3 hex, 1 Card | nace verde; 10 mutaciones rojas y 6 sondas de corchetes | c52df92b (test) | verificado por requisito |

Las paradas previas de R3 y R9 están resueltas por las erratas del leader 562051d2 y 31837443. Los tests de R16 que ya tenían producción verde y todos los de R17 se comprobaron con mutaciones plantadas y restauradas. La suma interna de LG no depende de producción: la sonda roja cubre su fila inkSites, limitación documentada en el reporte.

Verificación global bloqueada: la última corrida completa (`bun run test --runInBand --no-cache`) termina con 142/143 suites y 4757/4758 tests verdes, 1 snapshot verde. El único rojo es BackButton `#172 R2: pinta ChevronLeft de 24 en foreground` (mock esperado color:foreground, respaldo recibido #0D1117), fuera del alcance; aislado pasa 8/8. Todas las suites de #200 y los diez candados de cierre pasan. Typecheck y lint sin caché pasan. Evidencia de las tres corridas, sondas y parada obligatoria en `progress/impl_mobile-canvas-nutrition.md`. No se ejecuta init.sh (lo corre el leader). El smoke Android corresponde al humano, en claro y oscuro. La feature no se declara done.
