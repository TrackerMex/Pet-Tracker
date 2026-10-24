# Implementación mobile-canvas-health-weight (#199)

**Estado actual — IMPLEMENTACIÓN R1–R27 VERIFICADA Y CIERRE ACEPTADO (2026-10-24):** Tipos y lint verdes; suite final 4897/4898 tests y 144/145 suites, con el único rojo de Food aceptado expresamente por el leader tras 122/122 aislado. Sonda R24 probada y spec restaurada byte a byte. Graphify exit 0; trazabilidad con 27 filas completas. El gate definitivo init.sh y los smokes Android corresponden al leader/humano.

## Precondiciones

`./init.sh` no ejecutado: reservado al leader por instrucción del usuario y línea 2 del handoff.

Comprobación solicitada:
```text
/home/claude/sites/Pet-Tracker-wt-199
feature/199-mobile-canvas-health-weight
f6f28512 chore(spec): enmienda E1 #199 al inventario de candados
```

Desviación: el comando de identidad se ejecutó inmediatamente después de leer el handoff; antes se hicieron lecturas de ese handoff, la skill ponytail y git status, sin cambios.

## Anclas T0

```text
grep -cF 'HeaderHeightContext' src/screens/weight-log/index.tsx
2
Esperado: 2; coincide: True

grep -cF 'keyboardVerticalOffset' src/screens/weight-log/index.tsx
1
Esperado: 1; coincide: True

grep -cF 'ScreenHeader' src/screens/weight-log/index.tsx
0
Esperado: 0; coincide: True

grep -cF 'useShadows' src/screens/weight-log/index.tsx
0
Esperado: 0; coincide: True

grep -cF 'HeroUICard' src/screens/weight-log/index.tsx
3
Esperado: 3; coincide: True

grep -cF '<Card' src/screens/weight-log/index.tsx
2
Esperado: 2; coincide: True

grep -cF 'h-40 w-full rounded-card' src/screens/weight-log/index.tsx
1
Esperado: 1; coincide: True

grep -cF 'absolute top-4' src/screens/weight-log/index.tsx
1
Esperado: 1; coincide: True

grep -cF 'size-8 shrink-0' src/screens/weight-log/index.tsx
1
Esperado: 1; coincide: True

grep -cF 'h-14 rounded-16 bg-accent' src/screens/weight-log/index.tsx
1
Esperado: 1; coincide: True

grep -cF 'text-17' src/screens/weight-log/index.tsx
1
Esperado: 1; coincide: True

grep -cF 'text-accent-strong' src/screens/weight-log/index.tsx
0
Esperado: 0; coincide: True

grep -cF 'weight-month-delta' src/screens/weight-log/index.tsx
2
Esperado: 2; coincide: True

grep -cF -- '-date`' src/screens/weight-log/index.tsx
0
Esperado: 0; coincide: True

grep -cF "t('weightLog.history')" src/screens/weight-log/index.tsx
0
Esperado: 0; coincide: True

grep -cF 'tracking-tight' src/screens/health/index.tsx
0
Esperado: 0; coincide: True

grep -cF 'HeartPulse' src/screens/health/index.tsx
2
Esperado: 2; coincide: True

grep -cF 'variant="avatars"' src/screens/health/index.tsx
0
Esperado: 0; coincide: True

grep -cF 'rounded-14' src/screens/health/index.tsx
0
Esperado: 0; coincide: True

grep -cF 'text-accent-strong' src/screens/health/index.tsx
1
Esperado: 1; coincide: True

grep -cF 'text-warning-strong' src/screens/health/index.tsx
2
Esperado: 2; coincide: True

grep -cF 'h-24 w-full rounded-card' src/screens/health/index.tsx
1
Esperado: 1; coincide: True

grep -cF 'h-12 w-full rounded-card' src/screens/health/index.tsx
1
Esperado: 1; coincide: True

grep -cF 'rounded-xl bg-default px-3 py-2' src/screens/health/index.tsx
1
Esperado: 1; coincide: True

grep -cF 'vaccines-title' src/screens/health/index.tsx
0
Esperado: 0; coincide: True

grep -cF 'CATEGORY_SLOTS' src/screens/health/index.tsx
2
Esperado: 2; coincide: True

grep -cF 'viewBox="0 0 100 40"' src/components/weight-chart.tsx
1
Esperado: 1; coincide: True

grep -cF 'LinearGradient' src/components/weight-chart.tsx
3
Esperado: 3; coincide: True

grep -cF 'variant' src/components/weight-chart.tsx
0
Esperado: 0; coincide: True

grep -cF 'headerShown' src/app/_layout.tsx
2
Esperado: 2; coincide: True

grep -cF "t('weightLog.weightLog')" src/app/_layout.tsx
1
Esperado: 1; coincide: True

grep -cF -- '--text-34' src/theme/global.css
0
Esperado: 0; coincide: True

grep -cF 'MOTION_DRAW' src/theme/motion.ts
0
Esperado: 0; coincide: True

grep -cF 'MOTION_RISE' src/theme/motion.ts
2
Esperado: 2; coincide: True

grep -cF "'weightLog.history'" src/i18n/catalog.ts
0
Esperado: 0; coincide: True

grep -cF "'health.appliedOn'" src/i18n/catalog.ts
0
Esperado: 0; coincide: True

grep -cF "file: 'src/app/_layout.tsx'" src/__tests__/ui-copy-table.ts
1
Esperado: 1; coincide: True

grep -cF "'src/screens/health/index.tsx'" src/__tests__/ui-copy-table.ts
18
Esperado: 18; coincide: True

grep -cF "'src/screens/weight-log/index.tsx'" src/__tests__/ui-copy-table.ts
19
Esperado: 19; coincide: True

grep -cF "'src/components/weight-chart.tsx'" src/__tests__/ui-copy-table.ts
1
Esperado: 1; coincide: True

grep -cF 'HeaderHeightContext.Provider value={91}' src/screens/weight-log/index.test.tsx
1
Esperado: 1; coincide: True

grep -cF 'export function fmtDay' src/screens/home/format.ts
0
Esperado: 0; coincide: True

test -e src/components/rise-in.tsx && echo presente
presente
Esperado: presente; coincide: True

test -e src/components/screen-header.tsx && echo presente
presente
Esperado: presente; coincide: True

test -e src/__tests__/canvas-foundations.test.ts && echo presente
presente
Esperado: presente; coincide: True

test ! -e src/__tests__/health-weight-canvas-fidelity.test.ts && echo ausente
ausente
Esperado: ausente; coincide: True

test ! -e src/screens/home/__tests__ && echo ausente
ausente
Esperado: ausente; coincide: True

ls ../specs/mobile-canvas-health-weight/canvas | wc -l
6
Esperado: 6; coincide: True

test ! -e .expo/types/router.d.ts && echo sin-router-d-ts
sin-router-d-ts
Esperado: sin-router-d-ts; coincide: True
```

## Skills y referencias

Cargadas: ponytail; building-native-ui y expo-tailwind-setup (caché openai-curated/expo/11c74d6b); appllama-app-design-skill y animate-expo (.agents/skills). Ninguna de las cuatro requeridas falta. No se buscaron expo-overview, expo-animation, expo-router ni expo-design-system: el handoff dice que no existen en Codex. Sin MCP Appllama: referencia congelada y spec aprobada, como exige la carta.

Leída la referencia versionada SDK 57: https://docs.expo.dev/versions/v57.0.0/. La carta y la spec mandan sobre valores o patrones genéricos de las skills.

Firmas ScreenHeader, RiseIn y useShadows contrastadas: coinciden con el handoff. Feature #199 ya figura in_progress; no se edita feature_list.json.

## Ejecución

R27: tests de token y siete constantes añadidos en CF; inventario MT actualizado a 44 exportaciones. Pendiente medir rojo.

R27 rojo CF: `Tests: 2 failed, 2 total` (exit 1, aserciones: token y siete exports ausentes; sin import roto). Log: progress/r27-red-199.log.
fb0b396c test(#199): R27 lock weight typography and motion constants

MT: listado verificado mediante bun: 44 exportaciones, orden sort() correcto. Jest ajeno vuelve a ocupar la máquina; guardas de espera devuelven 75 sin iniciar Jest.

R27 MT rojo: `Tests: 1 failed, 26 passed, 27 total` (exit 1; faltan exactamente siete exports). Log progress/r27-mt-red-199.log.
Incidencia de invocación: tail sobre el log MT antes de su creación devolvió ENOENT; lectura repetida después de la ejecución, sin tocar código por ello.

R27 verde: `Tests: 214 passed, 214 total` (CF, MT, F197, DD). Sonda: --text-34 34→35 y export MOTION_TOAST_DELAY_MS retirado temporalmente; `Tests: 3 failed, 26 passed, 29 total` (CF token, CF constantes y MT inventario). Ambas mutaciones revertidas. Restaurado: `Tests: 29 passed, 29 total`, exit 0.
f814227d feat(#199): R27 add canvas weight typography and motion timings


DT R11 rojo: `Tests: 4 failed, 4 total`, aserción de helper ausente, sin excepción.

DT R11 verde: `Tests: 4 passed, 4 total`. No completa R11: falta su consumo y test en WL.

DT R14 rojo: `Tests: 3 failed, 4 passed, 7 total` (helper ausente).

DT R14 verde: `Tests: 7 passed, 7 total`. No completa R14: falta el panel y HE.

DT R5 rojo: `Tests: 3 failed, 7 passed, 10 total` (helper ausente).

DT R5 verde: `Tests: 10 passed, 10 total`. Los tres helpers siguen el patrón local de fmtDate; sin tabla de meses ni parseo UTC.

R5 primera medición roja: `Tests: 28 failed, 61 passed, 89 total`. Detectó un error propio del test nuevo: UNSAFE_getByType no existe en RNTL 14. Corregido antes del commit de test a recorrido de hosts con container.queryAll, según documentación local de test-renderer. También rg devolvió ENOENT al buscar typings en el antiguo directorio build; corregido buscando los ficheros reales. No se cambió producción por estos errores.

R5 rojo confirmado antes del commit: `Tests: 14 failed, 21 skipped, 35 total`, todos los nuevos por aserciones, sin TypeError ni imports rotos. E1 language-provider: base 443→444, rojo por longitud. Tests WC antiguos conservados, con sufijos en las filas del inventario; 14 casos nuevos.

R5 primera implementación: 1 fallo propio, 283 verdes; el radio se consultaba antes de la actualización del nodo (r=3 inicial del pop). Test corregido con waitFor sobre el radio del mismo nodo; sin esperar contadores. R5 verde: `Tests: 284 passed, 284 total`, cinco suites. No hubo rojos ajenos al inventario en esas suites.

R5 guardas agregadas: `Tests: 512 passed, 512 total`, 11 suites. Sonda E1: retirada solo la clave es de weightChart.lastSixMonths; language-provider rojo por aserción de claves. La sonda conjunta dio excepciones de traducción en WC: no se cuenta como prueba de WC. Repetición WC sin tocar catálogo: geometría x=309/y plana61, sin arranque draw, opacidad0.5 y punto duplicado: `Tests: 25 failed, 10 passed, 35 total`, incluidos los 16 it WC enmendados; sin TypeError ni ReferenceError. Mutaciones revertidas. Restaurado WC+language-provider: `Tests: 89 passed, 89 total`, exit 0.
Typecheck con guarda router.d.ts ausente: primer intento detectó testID unknown en el doble Path (TS2769); corrección typeof en commit de test separado. Segundo intento exit 0.
Actualización del líder recibida: E1 añade HT para R3 en 48dd0f02; se aplicará al llegar a R3, sin init.sh.

R6: primera medición roja detenida con SIGTERM solo sobre el PID propio 1515076; Jest atascado imprimiendo props animadas en el diff de una aserción nueva. Se reducen las aserciones a campos escalares/booleanos, sin relajar valores. No se modifica ningún test ajeno por ello. Se repetirá el rojo antes del commit.

R6: SIGTERM no detuvo el proceso propio; SIGKILL sobre el mismo PID cerró con exit 137. Repetición roja con aserciones escalares: `Tests: 6 failed, 35 skipped, 41 total`, exit 1 en 3.267 s, sin TypeError ni ReferenceError.

R6 verde: `Tests: 226 passed, 226 total` (WC, DD, F197), exit 0; conserva los 35 casos anteriores y suma seis. Variante mini aún no consumida por Salud hasta R18.

R1 rojo: `Tests: 6 failed, 127 passed, 133 total` (WL, LY, UL). Nuevos WL comprobados aparte antes del commit: `Tests: 2 failed, 70 skipped, 72 total`, por header/back ausentes. F197 R20 borrado entero: 2 it léxicos = 5 casos ejecutados; LY sustituye una fila por un it nuevo, sin cambio neto de casos. UL #194 R5 adelantada de R25 a R1; SCREEN_FILES −1; movida fila de _layout a Peso sin variar R5_HEALTH.

R1 verde inicial: `Tests: 333 passed, 333 total` (WL, LY, detail-stack sin tocar, UL, F197, DD). Sondas: título cambiado solo a health.health y headerShown true solo en weight-log: `Tests: 3 failed, 91 skipped, 8 passed, 102 total` (WL antiguo enmendado, WL nuevo de título, LY nuevo). Copy fija solo en el título de Peso: `Tests: 3 failed, 28 passed, 31 total`, incluye UL #194 R5 enmendado. Ambas revertidas. Restaurado: `Tests: 133 passed, 133 total` (WL, LY, UL), exit 0. Typecheck tras guarda router.d.ts ausente: exit 0.

## Lint y límite de alcance detectado en R1

Comando exacto del handoff: `bunx expo lint --no-cache > ../progress/lint-199.log 2>&1 && test ! -s ../progress/lint-199.log`.

Primera corrida: exit 1 de la guarda del log, dos warnings, cero errores. El warning `import/first` de CF se corrigió en `7b335fdc` moviendo el import antes de las declaraciones; CF restaurado: `Tests: 2 passed, 2 total`.

El otro warning está en `src/app/_layout.tsx:79`: `'t' is assigned a value but never used`. R1 quitó la única llamada a t, pero el handoff líneas 35 y 164 autoriza solo la entrada weight-log. Se solicita al leader ampliar ese límite para esta limpieza concreta:

```diff
-import { LanguageProvider, useTranslate } from '../providers/language-provider';
+import { LanguageProvider } from '../providers/language-provider';
-  const t = useTranslate();
```

No se modifica ese import ni esa declaración mientras no llegue autorización. Sin iniciar R2, sin tocar la enmienda HT de R3 antes de su bloque.

## Candados enmendados hasta ahora

| Candado | Antes → después | R / observación |
|---|---|---|
| MT `no exporta nada más` | 37 → 44 exports, orden sort() contrastado con bun | R27; sonda de export retirado roja |
| WC normalización y pesos iguales | 100×40 → 310×110, y plana 60 | R5; sonda x309/y61 roja |
| WC #169 R1 (7 it) | longitudes 100×40 y timing antiguo → longitudes reales 310×110 y draw con retraso | R5; sonda sin draw y geometría alterada roja |
| WC #169 R2 (4 it) | un punto por entrada al ritmo de la línea → un punto final con pop | R5; opacidad .5 y punto duplicado, rojo |
| WC #169 R4 (3 it) | cuenta total de withTiming → cuenta solo MOTION_DRAW_TIMING | R5; sonda sin draw roja en los tres |
| language-provider, E1 | 443 → 444 claves; +1 primer uso de weightChart.lastSixMonths | R5; clave retirada solo en es, rojo por igualdad de claves |
| WL #95 R5 | sin título propio → título en weight-log-header, sigue sin weight-log-back | R1; título mutado a Salud, rojo |
| LY #194 R4 | sale fila weight-log del it.each nativo; nuevo it exige options exactas {headerShown:false} | R1; mismo número neto de casos LY; mutación headerShown true roja |
| F197 #197 R20 | describe temporal completo → borrado | R1; 2 it léxicos / 5 casos menos, autorizado |
| ui-copy-table | única fila _layout → weight-log, misma clave | R1; no cambia R5_HEALTH.length |
| UL #194 R5, E1 | SCREEN_FILES base − 1 | R1, **fila adelantada** de R25; sonda copy literal roja |

### Enmiendas mecánicas

Hasta R1, ninguna. Desde la reanudación se aplica la errata agregada del leader:

| Candado | Antes → después | R / motivo |
|---|---|---|
| CC #98 R10 (fuera del inventario original, agregado) | total de esquinas +1 en R3, +1 en R14 y +1 en R18 | Views nuevos de gráfico, próxima dosis y peso con CONTINUOUS_CORNER; sondas rojas |
| HT suelo Card (agregado por errata) | 40 → 39 → 38 | R14: próxima dosis y R18: peso dejan Card; otros suelos no cambian |
| HE nearest-dose | 1 may 2099 → 1 de mayo · en N días | R14: literal prescrito de fecha/relativo; sonda roja |
| WL API order | cifra aislada → cifra con delta anidado | R10: solo literal prescrito; sonda roja |
| WL API order | 2026-08-21 → 21 ago | R11: solo fecha prescrita; sonda roja |
| WL #169 R6 | espera de input → espera de weight-current | R7: fila inventariada; mismo valor, nuevo montaje anticipado de formulario |

No se han enmendado tests de comportamiento fuera de las excepciones autorizadas.

### Tests nuevos que nacen verdes

Hasta R1, ninguno entre los añadidos: CF R27, DT, WC R5/R6 y WL/LY R1 se midieron rojos por aserciones antes de implementar. Las correcciones de orden de import, tipo del doble y espera del nodo no añaden casos.

## Commits observados

```text
fb0b396c test(#199): R27 lock weight typography and motion constants
f814227d feat(#199): R27 add canvas weight typography and motion timings
21073645 test(#199): R11 cover short local dates across month and year boundaries
2936b2b7 feat(#199): R11 format local day and short month
fa7835d1 test(#199): R14 cover long local vaccine dates
89cf8a54 feat(#199): R14 format local day and long month
f1e6addc test(#199): R5 cover localized chart month labels
cfa97a6d feat(#199): R5 format chart months using local calendar dates
385b4628 test(#199): R5 specify full chart geometry window and motion
43a3e08b test(#199): R5 wait for the final rendered marker radius
48dd0f02 chore(spec): E1 #199 suma el suelo de Card del escáner HeroUI (R3)
b5c3b8f5 test(#199): R5 narrow the SVG mock test ID type
8a1fe2c9 feat(#199): R5 render the six-month weight chart from canvas
7a8ba08e test(#199): R6 specify the miniature weight chart
0c84df13 feat(#199): R6 add the compact weight chart variant
922b8750 test(#199): R1 require an in-content weight header
6b1d1578 feat(#199): R1 render the weight log header inside its scroll
7b335fdc test(#199): R27 keep motion imports before declarations
```

`48dd0f02` lo incorporó el leader durante esta ejecución: E1 HT para R3. No se hizo merge ni rebase.

## Trazabilidad R1–R27 — resumen de implementación

| R | Test / estado actual | Commit de implementación |
|---|---|---|
| R1 | WL #199 R1 (2), LY #199 R1; 333 verdes, restaurados WL/LY/UL 133 verdes | 6b1d1578 |
| R2 | WL #199 R2 y tres candados enmendados; 188 verdes y sonda 4/4 roja | e79352ef |
| R3 | WL #199 R3, CC y HT; 317 verdes, nueve sondas rojas | 12549c86 |
| R4 | WL #199 R4 y LG; 298 verdes, once sondas rojas | dcccf32e |
| R5 | DT #199 R5 (3), WC #199 R5 (14); verde | cfa97a6d, 8a1fe2c9 |
| R6 | WC #199 R6 (6), verde | 0c84df13 |
| R7 | WL #199 R7 y PCF; 325 verdes, ocho sondas rojas | f4094949 |
| R8 | WL #199 R8 nace verde, sonda roja; sin implementación | 9083ca41 (test) |
| R9 | WL #199 R9, CTA y E1 catálogo; 439 verdes; vacío nace verde con sonda | 9d4742d4 |
| R10 | WL #199 R10 y cuatro tonos antiguos, CC/AC; 365 verdes, nueve sondas rojas | 15406f7a |
| R11 | DT #199 R11 (4), WL #199 R11 (2) y fila API order; 132 verdes, tres sondas rojas | 2936b2b7, 4a4b19a8 |
| R12 | HE #199 R12 (2), seis casos viejos; 200 verdes, sonda 8 rojos | 97bd45ca |
| R13 | HE #199 R13, dos filas de selector, PCF E1; 112 verdes, sonda 4 rojos | 18f4c4e4 |
| R14 | DT #199 R14 (3), HE #199 R14 (7), candados; 452 verdes, 35+2 sondas rojas | 89cf8a54, 79817129 |
| R15 | HE #199 R15 (2), 210 verdes | 0a2afe7c |
| R16 | HE #199 R16 (5), cuatro tonos, PCF/AC; 293 verdes, 11 sondas rojas | 2ba498c2 |
| R17 | HE #199 R17 (4), cinco casos viejos, E1; 273 verdes, 9+1 sondas rojas | 1f1997f5 |
| R18 | HE #199 R18 (8), candados; 354 verdes, 19 sondas rojas, tipos verdes | e9fde020 |
| R19 | HE #199 R19 (3), dos guardas Skeleton; 349 verdes, tres sondas rojas | 8e0122df |
| R20 | HE #199 R20 (2), 232 verdes | 0f337099 |
| R21 | HE #199 R21 (2), Skeleton viejo; 309 verdes, dos sondas rojas | 22aef6ba |
| R22 | WL #199 R22 (7) y antigua Skeleton; 345 verdes, sonda roja | c2ed2597 |
| R23 | WL #199 R23 (3) y dos guardas antiguas; 314 verdes, cuatro sondas rojas, lint/tipos verdes | dcb2ac5e |
| R24 | CF carta/casilla; 157 verdes. Carta y casilla con sondas rojas; requirements restaurado byte a byte y diff specs exit 0 | 8ee4f89d (test), 5d5f2368 (feat) |
| R25 | CF/UL/language-provider94 verdes; errata due today test primero; sondas8+3 rojas. Se conserva escáner UL | c35bb65e, 8ad8a491 (test), b1f972d8 (feat), d412d83d (test literal HE) |
| R26 | CF 17 filas y 17 sondas independientes rojas; restaurado28/28 | 27ea4073 (test, sin producción nueva) |
| R27 | CF 38 casos; diez guardas nuevas con diez sondas independientes; CF+WC79/79 restaurados | f814227d (tokens), bc16a538 (guardas) |

El detalle histórico de cada bloque se conserva debajo. Reanudación2 autorizó el merge de dev; Reanudación3 permite tintes aislados bajo sus tres condiciones. La suite final y los recuentos ya se midieron. El cierre actual, con su bloqueo no exento y la matriz de trazabilidad preparada, está al final de este reporte. No se ejecutó init.sh, push, PR ni rebase.

## Smoke del humano (pendiente, claro y oscuro)

- [ ] R1: flecha a Salud y fallback /health desde deep link frío; título fuera de barra de estado.
- [ ] R2: peso, fecha y condición y envío visibles con teclado, offset 0.
- [ ] R5/R6: draw tras 200/300 ms, pop final de Peso hacia 1.3 s; con siete meses, Peso rotula seis y Salud muestra todo.
- [ ] R13: avatares alineados con Salud.
- [ ] R23: toast bajo cabecera tras ~400 ms y sombra visible en Android.
- [ ] R24: entradas escalonadas; con Quitar animaciones, todo quieto y completo.

Segunda corrida lint tras corregir CF: exit 1 de test ! -s; log solo contiene el warning de t sin uso en _layout.tsx:79 (0 errores, 1 warning). Sigue pendiente la autorización solicitada. Árbol acotado mobile/specs/docs limpio, 17 ficheros móviles tocados desde H0, todos en lista cerrada; package.json/bun.lock y los ocho ficheros protegidos verificados con diff vacío.

## Parada y reanudación (cierre de la sesión del 2026-10-23)

La autorización para limpiar el hook fuera de la entrada weight-log se pidió con pregunta asíncrona; no ha llegado respuesta al cerrar este reporte. No se interpreta el tiempo de espera como aprobación. El siguiente paso es la limpieza de las dos líneas propuestas si el leader amplía el alcance, repetir lint, y después R2 en el orden del handoff. La viñeta HT de 48dd0f02 se aplica al llegar a R3.

No se marca la feature done. No se hace el commit final de trazabilidad/reporte porque falta la mayor parte de requisitos y lint aún no pasa. El reporte queda como artefacto de la parada y el marcador .done solo notifica al watcher que debe leer este estado incompleto.

Último estado de código: HEAD 7b335fdc, árbol acotado mobile/specs/docs limpio. Sin dependencias nuevas ni cambios de archivos protegidos. Sin init.sh ni push ni PR. Suite completa, graphify, cuentas finales y smoke Android pendientes.

## Reanudación 2026-10-24

HEAD verificado: 25979e93; árbol acotado limpio. Leídas Reanudación del handoff y Erratas de requirements. Autorizada retirada de t y del import: tras retirar la declaración, grep -c useTranslate dio 1. La errata amplía las enmiendas de inventario agregadas cuando el delta coincide exactamente con el diff de la R; se documentarán sin detenerse. El leader ya retiró el marcador .done anterior. No se vuelve a medir T0 sobre código implementado; se conservan las anclas de la sesión inicial. No se ejecuta init.sh.

R1 errata cerrada en e79ece38. Lint --no-cache: exit 0 y log de 0 bytes. Empieza R2.

R2 rojo: `Tests: 3 failed, 69 skipped, 1 passed, 73 total`. El caso de teclado enmendado nace verde al retirar el Provider (el contexto por defecto entrega offset 0); se exige su sonda con offset 91. Los tres fallos son aserciones, sin excepción.

Sonda R2: inset +9 y offset 91: r2-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● R7: weight log lista el historial › shows loading and the metrics under the native header (#95 R6) (enmendado por #199 R2)
  ● R7: weight log lista el historial › R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa (enmendado por #199 R2)
  ● #148 R7: weight-log se aparta del teclado en Android › el host screen-weight-log añade paddingBottom 291 al abrir el teclado (enmendado por #199 R2)
  ● #199 R2: métricas del scroll de Peso › #199 R2 el scroll usa margen 24, inset superior + 8, inferior + 32 y gap 14
Test Suites: 1 failed, 1 total
Tests:       4 failed, 69 skipped, 73 total

R2 verde: `Tests: 188 passed, 188 total` (WL+DD). Sonda 4/4 candados roja y restauración byte a byte al mismo código verde.

R3 rojo: `Tests: 7 failed, 169 passed, 176 total` (WL/CC/HT). Dos nuevos it rojos; el de orden nace verde y tendrá sonda desplazando la cabecera. HT E1: suelo Card 41→40; los otros tres suelos no se tocaron. CC: Peso CONTINUOUS_CORNER 1→2, suma directUses +1; por errata agregada #98 R10 suma global +1 (título con sufijo). Todos se explican por el View nuevo de la gráfica con una esquina directa.

Sonda R3: superficie, esquina, demora, orden, vacío y suelo HT: r3-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/weight-log/index.tsx importa y aplica sus 2 esquinas (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #199 R3)
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › fusiona la esquina una vez y la entrega a las dos ramas de Card (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #199 R3)
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #199 R3)
  ● #187 R1: ningún componente que fusiona className lleva text-NN › #187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9) (enmendado por #189 R5, R10, R13) (enmendado por #199 R3)
  ● Console
  ● #62 R9: la gráfica de peso vive dentro de una card › envuelve weight-chart con la superficie compartida (enmendado por #199 R3)
  ● #169 R6: resumen del peso en la card de la gráfica › no pinta el resumen sin entradas (enmendado por #199 R3)
  ● #199 R3: tarjeta de la gráfica de Peso › #199 R3 weight-chart-card es un View rounded-24 bg-surface-secondary p-4 gap-2 con esquina continua
  ● #199 R3: tarjeta de la gráfica de Peso › #199 R3 con registros el scroll ordena cabecera, gráfica, formulario e historial
  ● #199 R3: tarjeta de la gráfica de Peso › #199 R3 la tarjeta entra con RiseIn sin retraso
Test Suites: 3 failed, 3 total
Tests:       9 failed, 149 skipped, 18 passed, 176 total

R3 verde: `Tests: 317 passed, 317 total`; sonda posterior detecta nueve filas, incluyendo todos los candados enmendados, HT y el it de orden que nació verde. Restauración byte a byte al verde. Otros suelos HT intactos. Enmienda mecánica agregada: CC #98 R10, contador CONTINUOUS_CORNER global +1 por el View nuevo, conforme a errata 2026-10-24.

R4 rojo: `Tests: 11 failed, 85 skipped, 12 passed, 108 total`, aserciones. LG añade Peso 1 y suma +1. La suma LG ahora cuenta las ocurrencias reales de producción, conservando el esperado literal, para que la sonda pueda falsarla; antes sumaba sus propios esperados. Los títulos it.each nuevos se alinearon con rama/tono sin cambiar datos u oráculos.

Sonda R4: cifra, tono, peso de letra y envoltorio del delta: r4-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #61 R4: el acento como tinta usa accent-strong › screens/weight-log/index.tsx pinta con text-accent-strong (1) (enmendado por #199 R4)
  ● #61 R4: el acento como tinta usa accent-strong › suma las trece ocurrencias que enumera la spec (enmendado por #199 R4)
  ● Console
  ● #169 R6: resumen del peso en la card de la gráfica › en Pacific/Pago_Pago pinta el peso actual y el delta del día civil (enmendado por #199 R4)
  ● #169 R6: resumen del peso en la card de la gráfica › en Pacific/Kiritimati pinta el peso actual y el delta del día civil (enmendado por #199 R4)
  ● #169 R7: tono del delta del mes › rama > 0: texto, clase e icono (enmendado por #199 R4)
  ● #169 R7: tono del delta del mes › rama < 0: texto, clase e icono (enmendado por #199 R4)
  ● #169 R7: tono del delta del mes › rama = 0: texto, clase e icono (enmendado por #199 R4)
  ● #199 R4: cifra y delta del mes › #199 R4 la cifra usa text-34 font-black text-foreground
  ● #199 R4: cifra y delta del mes › #199 R4 delta sube pinta text-danger sin icono
  ● #199 R4: cifra y delta del mes › #199 R4 delta baja pinta text-accent-strong sin icono
  ● #199 R4: cifra y delta del mes › #199 R4 delta igual pinta text-muted sin icono
Test Suites: 2 failed, 2 total
Tests:       11 failed, 85 skipped, 12 passed, 108 total

R4 verde: `Tests: 298 passed, 298 total`; sonda once filas rojas, restauración byte a byte. El delta del mes y el de filas compartirán DELTA_TONE al llegar a R10.

R7 rojo: `Tests: 6 failed, 104 skipped, 110 total` (cuatro casos nuevos + PCF text-13 y Card flat). Oráculos fallan por aserción de formulario ausente, no por imports ni excepción.

R7 primera verificación: 324 verdes y fallo en fila inventariada WL #169 R6 Kiritimati. El formulario ahora existe durante carga, así que esperar solo la fecha ya no garantiza que llegó el historial. Se espera al mismo nodo weight-current que se aserta, según conventions §Esperas; no cambian valores ni comportamiento. Sufijo R7 en ese it. Los checks nuevos de inputs comparan tokens completos, no subcadenas.

Sonda R7: variante, etiquetas, columnas, inputs, entrada y resumen: r7-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #173 R2.4: inventario de tamaños nuevos › limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8) (enmendado por #189 R6) (enmendado por #199 R7)
  ● #173 R3: Card hero y flat solo en Perfil › Perfil es el único consumidor de Card flat y lo usa dos veces (enmendado por #199 R7)
  ● Console
  ● #169 R6: resumen del peso en la card de la gráfica › en Pacific/Pago_Pago pinta el peso actual y el delta del día civil (enmendado por #199 R4) (enmendado por #199 R7)
  ● #169 R6: resumen del peso en la card de la gráfica › en Pacific/Kiritimati pinta el peso actual y el delta del día civil (enmendado por #199 R4) (enmendado por #199 R7)
  ● #199 R7: formulario de Peso › #199 R7 weight-form es un Card flat con gap-2.5 py-3.5 y entra a los 80 ms
  ● #199 R7: formulario de Peso › #199 R7 peso y fecha comparten la primera fila y la condición va debajo
  ● #199 R7: formulario de Peso › #199 R7 las tres etiquetas pintan text-13 font-extrabold con su literal
  ● #199 R7: formulario de Peso › #199 R7 los tres inputs llevan h-12 rounded-xl bg-default
Test Suites: 2 failed, 2 total
Tests:       8 failed, 102 skipped, 110 total

R7 verde: `Tests: 325 passed, 325 total`. Sonda ocho filas rojas (PCF dos, WL fila de zona horaria dos casos, nuevos cuatro); restaurada byte a byte. Etiquetas text-13 en Text de RN; FieldErrorMessage sigue con tres controles más su import.

Sonda R8: primario h-13 en lugar de h-14: r8-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #199 R8: envío de Peso › #199 R8 el envío es el último hijo de weight-form y conserva h-14 rounded-16 bg-accent
Test Suites: 1 failed, 1 total
Tests:       1 failed, 84 skipped, 85 total

R8 nace verde: `Tests: 84 skipped, 1 passed, 85 total`; solo commit de test. La sonda h14→h13 dio `1 failed, 84 skipped, 85 total`, restaurada. Sin cambio de receta ni implementación.

R9 rojo: `Tests: 8 failed, 215 skipped, 1 passed, 224 total`. Seis nuevos rojos, el vacío sin Historial nace verde. CTA agrega +1 a ambos recuentos text-17; language-provider E1 agrega +1 (445 claves).

Sonda R9: título, filas, escalonado y vacío: r9-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #177 R6.2: recuentos de etiquetas (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por #199 R9)
  ● Console
  ● #199 R9: historial de Peso › #199 R9 pinta Historial con text-17 font-extrabold antes de las filas
  ● #199 R9: historial de Peso › #199 R9 cada fila es un View con borde superior y py-2.5
  ● #199 R9: historial de Peso › #199 R9 la fila 0 entra a los 140 ms
  ● #199 R9: historial de Peso › #199 R9 la fila 1 entra a los 200 ms
  ● #199 R9: historial de Peso › #199 R9 la fila 2 entra a los 260 ms
  ● #199 R9: historial de Peso › #199 R9 la fila 3 entra a los 260 ms
  ● #199 R9: historial de Peso › #199 R9 sin registros no pinta Historial
Test Suites: 2 failed, 2 total
Tests:       8 failed, 162 skipped, 170 total

Sonda R9 E1: clave history retirada solo de es: r9-language-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › #194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15) (enmendado por #199 R5) (enmendado por #199 R9)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 skipped, 54 total

R9 verde: `Tests: 439 passed, 439 total`, incluidos HT/DD/CC. Suelos HT sin cambios (siguen verdes). Sondas: ocho filas en WL/CTA, una en language-provider al retirar es; todas por aserción y restauradas byte a byte. El vacío sin Historial que nació verde está cubierto por condición >=0 mutada.

R10 rojo: `Tests: 8 failed, 183 skipped, 5 passed, 196 total`. La ausencia de CC con null nace verde. Base real de WL #169 R8 tiene cuatro casos (up/down/0/null), conservados todos aunque la spec diga tres. Enmienda mecánica WL API order: el literal aislado 12.4 kg pasa a la cifra con delta anidado 12.4 kg +0.4 kg; sufijo R10. CC size8→size9, AC E1 añade Peso a text-15.

Typecheck en R10 detectó TS2345 en la tabla enmendada R4: quedaban siete columnas al retirar el icono, con callback de cuatro. Se eliminan las tres columnas de icono que ya no se asertan; los tres casos y los cuatro oráculos útiles no cambian. Corrección propia de test, sin cambiar producción.

R10 verde: `Tests: 365 passed, 365 total`; typecheck verde con guardia de router.d.ts ausente. La infraestructura compartida retiene turnos de Jest; se espera sin intervenir en otros worktrees.

Sonda R10: tiles, figura y CC nula: r10-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #62 R4: la app solo usa los radios de la escala declarada › lleva los tres tiles restantes a rounded-xl (enmendado por #177 R10) (enmendado por #199 R10)
  ● #174 R12: inventarios › limita text-15 a su inventario de producción (enmendado por #189 R1) (enmendado por #189 R8) (enmendado por #189 R12) (enmendado por #197 R4) (enmendado por #197 R10) (enmendado por #197 R19) (enmendado por #199 R10)
  ● Console
  ● R7: weight log lista el historial › keeps API order and renders each weight detail (enmendado por #199 R10)
  ● #169 R8: chip de delta por entrada › fila w-up con su tono, icono y texto (enmendado por #199 R10)
  ● #169 R8: chip de delta por entrada › fila w-down con su tono, icono y texto (enmendado por #199 R10)
  ● #169 R8: chip de delta por entrada › fila w-flat con su tono, icono y texto (enmendado por #199 R10)
  ● #169 R8: chip de delta por entrada › fila w-none con su tono, icono y texto (enmendado por #199 R10)
  ● #199 R10: fila del historial › #199 R10 la cifra pinta text-15 font-extrabold y anida el delta en text-13
  ● #199 R10: fila del historial › #199 R10 sin condición corporal no pinta la línea CC
Test Suites: 3 failed, 3 total
Tests:       9 failed, 183 skipped, 4 passed, 196 total

R10 sonda: nueve aserciones fallan, incluido el caso CC null nacido verde; sin excepción. Producción restaurada antes de commit.

R11 rojo: `Tests: 3 failed, 93 skipped, 96 total`; dos fechas nuevas y la fila antigua API order enmendada (21 ago). Helper DT ya verde desde su bloque previo.

Sonda R11: historial sin abreviar: r11-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● R7: weight log lista el historial › keeps API order and renders each weight detail (enmendado por #199 R10) (enmendado por #199 R11)
  ● #199 R11: fechas del historial › #199 R11 la fecha 2025-12-31 se lee 31 dic en text-13 font-semibold
  ● #199 R11: fechas del historial › #199 R11 la fecha 2026-01-01 se lee 1 ene en text-13 font-semibold
Test Suites: 1 failed, 1 total
Tests:       3 failed, 93 skipped, 96 total

R11 verde: `Tests: 132 passed, 132 total`; sonda vuelve ISO crudo: tres fallos esperados, restaurada.

R22 rojo: `Tests: 8 failed, 95 skipped, 103 total` (siete nuevos, una fila antigua). No nacen verdes.

Sonda R22: quitar tercera fila de carga: r22-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● R7: weight log lista el historial › R8 (mobile-design-drift): reserva la altura del loading con Skeleton (enmendado por #199 R22)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 102 skipped, 103 total

R22 verde: `Tests: 345 passed, 345 total`; sonda retira fila 2 y hace fallar la guarda vieja enmendada. Restaurada.

R23 rojo: `Tests: 5 failed, 101 skipped, 106 total`; tres nuevos y dos guardas de toast enmendadas. Doble de iconos expone strokeWidth; doble de colores preserva los conocidos y devuelve token para sombras.

Lint repetido tras R23: exit 0, `progress/lint-199.log` 0 bytes. Sigue pendiente el turno de Jest para el verde de R23.

Sonda R23: borde y entrada de toast: r23-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #169 R10: toast y háptico tras un alta correcta › muestra el toast y el háptico solo tras resolver el alta (enmendado por #199 R23)
  ● #169 R13: movimiento del toast › el fuente declara el fundido sin ReduceMotion.Never (enmendado por #199 R23)
  ● #199 R23: toast de registro › #199 R23 el toast es una píldora con borde, sombra toast y top inset + 42
  ● #199 R23: toast de registro › #199 R23 el fuente declara FadeIn.duration(MOTION_TOAST_FADE_MS).delay(MOTION_TOAST_DELAY_MS)
Test Suites: 1 failed, 1 total
Tests:       4 failed, 101 skipped, 1 passed, 106 total

R23 verde: `Tests: 314 passed, 314 total`; sonda cuatro aserciones rojas, restaurada; typecheck exit 0 y lint log 0 bytes. Empieza Salud R12.

R12 rojo: `Tests: 8 failed, 70 skipped, 78 total`; dos nuevos y las seis ramas inventariadas. El selector queda en contenido hasta R13: su it solo se enmienda al moverlo, sin anticipar expectativas.

Sonda R12: cabecera mal identificada: r12-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #168 R2: Salud sin hero y con métricas estándar › con mascotas, health-title y health-content son los únicos hijos del scroll, en ese orden (enmendado por #199 R12)
  ● #168 R2: Salud sin hero y con métricas estándar › sin contenido (pendiente), health-title precede a health-states (enmendado por #199 R12)
  ● #168 R2: Salud sin hero y con métricas estándar › sin contenido (error), health-title precede a health-states (enmendado por #199 R12)
  ● #168 R2: Salud sin hero y con métricas estándar › sin contenido (unreachable), health-title precede a health-states (enmendado por #199 R12)
  ● #168 R2: Salud sin hero y con métricas estándar › sin contenido (missing-config), health-title precede a health-states (enmendado por #199 R12)
  ● #168 R2: Salud sin hero y con métricas estándar › sin contenido (sin mascotas), health-title precede a health-states (enmendado por #199 R12)
  ● #199 R12: cabecera de Salud › #199 R12 con mascotas, health-header y health-content son los únicos hijos del scroll
  ● #199 R12: cabecera de Salud › #199 R12 health-header es una fila justify-between que empieza por health-title
Test Suites: 1 failed, 1 total
Tests:       8 failed, 70 skipped, 78 total

R12 verde: `Tests: 200 passed, 200 total`; TH protegido sin tocar. Sonda de testID detecta ocho casos enmendados/nuevos y se restaura.

R13 rojo: `Tests: 4 failed, 101 skipped, 105 total`; un nuevo, dos filas de selector y PCF E1. Sin nacidos verdes.

Sonda R13: selector fuera de cabecera y variante default: r13-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #173 R4: avatars solo en Perfil › limita la variante nueva al consumidor Perfil (enmendado por #199 R13)
  ● Console
  ● #168 R2: Salud sin hero y con métricas estándar › pone el PetSwitcher como primer hijo de health-content (enmendado por #199 R13)
  ● #168 R2: Salud sin hero y con métricas estándar › cambia vacunas y peso al pulsar otra mascota (enmendado por #199 R13)
  ● #199 R13: avatares de Salud › #199 R13 el selector va en health-header tras health-title en su variante avatars
Test Suites: 2 failed, 2 total
Tests:       4 failed, 101 skipped, 105 total

R13 verde: `Tests: 112 passed, 112 total`; sonda mueve selector a contenido y vuelve a default: cuatro aserciones rojas, restaurada. PetSwitcher compartido sin tocar.

R14 rojo: `Tests: 35 failed, 353 skipped, 22 passed, 410 total`; siete nuevos rojos por aserción. Se conservan 14 fechas civiles/zonas, solo cambia su literal. LG retira la fila health de warningSites (-1 caso autorizado) y exige su ausencia en las dos filas restantes para poder probar la exclusión con una sonda; tinta nueva cubierta por HE. CC Salud 3→4 esquinas y dos sumas +1; DD rounded16 +Salud1; AC tracking-caps +Salud; PCF text13 +Salud; language-provider 445→448 (+3 primer uso). La fila de orden del selector recibe R14 porque próxima dosis sale al contenido antes de vacunas.

R14 primera integración: `Tests: 6 failed, 446 passed, 452 total`. HT recibido39 contra suelo40: delta -1 exacto del panel que deja Card, enmienda agregada 40→39 conforme a errata, en commit propio. HE nearest-dose sustituye literal 1 may 2099 por fecha larga y relativo (enmienda mecánica permitida); mantiene orden y elección de dosis. Cuatro fallos propios: reemplazo demasiado amplio cambió gap-1 del oráculo de columna de vacuna a gap-0.5; restaurado ese oráculo original, sin tocar producción de vacunas. No se relaja ninguna guarda ajena.

Sonda R14: panel, inventarios, fecha larga y orden: r14-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/health/index.tsx importa y aplica sus 4 esquinas (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #199 R3) (enmendado por #199 R14)
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › fusiona la esquina una vez y la entrega a las dos ramas de Card (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #199 R3) (enmendado por #199 R14)
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #199 R3) (enmendado por #199 R14)
  ● #178 R13: Recordatorios sin deriva › reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10) (enmendado por #199 R14)
  ● #173 R2.4: inventario de tamaños nuevos › limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8) (enmendado por #189 R6) (enmendado por #199 R7) (enmendado por #199 R14)
  ● #174 R12: inventarios › limita tracking-caps a su inventario de producción (enmendado por #189 R1) (enmendado por #189 R8) (enmendado por #189 R12) (enmendado por #197 R4) (enmendado por #197 R10) (enmendado por #197 R19) (enmendado por #199 R10) (enmendado por #199 R14)
  ● #61 R5: text-warning deja de usarse como color de texto › screens/home/index.tsx pinta su texto con text-warning-strong (enmendado por #199 R14)
  ● #61 R5: text-warning deja de usarse como color de texto › screens/reminders/index.tsx pinta su texto con text-warning-strong (enmendado por #199 R14)
  ● Console
  ● R5: vacunas con la próxima destacada › highlights the nearest future dose and keeps row order (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila a: hoy 2026-12-31 12:00, próxima 2026-12-31 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila b: hoy 2026-12-31 12:00, próxima 2027-01-02 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila c: hoy 2027-01-01 12:00, próxima 2027-01-01 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila d: hoy 2027-01-30 12:00, próxima 2027-02-03 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila e: hoy 2026-12-31 12:00, próxima 2027-12-31 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila f: hoy 2026-12-31 12:00, próxima 2027-01-02 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila g: hoy 2027-01-01 12:00, próxima 2027-01-01 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila h: hoy 2026-12-31 20:00, próxima 2027-01-02 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila i: hoy 2026-12-31 06:00, próxima 2026-12-31 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila j: hoy 2026-12-31 06:00, próxima 2027-01-02 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila k: hoy 2027-03-13 23:30, próxima 2027-03-15 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila l: hoy 2027-01-01 10:00, próxima 2027-01-03 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila m: hoy 2027-11-06 12:00, próxima 2027-11-08 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila n: hoy 2026-12-31 12:00, próxima 2027-01-01 (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › ordena la card en icono, columna y días, con la fecha en la columna (días) (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › ordena la card en icono, columna y días, con la fecha en la columna (hoy) (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › pinta los días con la receta exacta (días) (enmendado por #199 R14)
  ● #115 R6: la próxima vacuna dice fecha y días restantes › pinta los días con la receta exacta (hoy) (enmendado por #199 R14)
  ● #168 R2: Salud sin hero y con métricas estándar › pone el PetSwitcher como primer hijo de health-content (enmendado por #199 R13) (enmendado por #199 R14)
  ● #199 R14: panel de la próxima dosis › #199 R14 next-vaccine-card es un View rounded-24 sobre el pastel ámbar con esquina continua
  ● #199 R14: panel de la próxima dosis › #199 R14 el tile es size-13 rounded-16 bg-surface con la jeringa a 26 en warning
  ● #199 R14: panel de la próxima dosis › #199 R14 caps, nombre y fecha llevan sus clases exactas
  ● #199 R14: panel de la próxima dosis › #199 R14 la fecha dice 31 de diciembre · hoy
  ● #199 R14: panel de la próxima dosis › #199 R14 la fecha dice 1 de enero · mañana
  ● #199 R14: panel de la próxima dosis › #199 R14 la fecha dice 12 de octubre · en 6 días
  ● #199 R14: panel de la próxima dosis › #199 R14 entra con RiseIn sin retraso
Test Suites: 6 failed, 6 total
Tests:       35 failed, 299 skipped, 22 passed, 356 total

Sonda R14 E1 y HT: clave solo es y una Card retirada: r14-language-ht-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #187 R1: ningún componente que fusiona className lleva text-NN › #187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9) (enmendado por #189 R5, R10, R13) (enmendado por #199 R3) (enmendado por #199 R14)
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › #194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15) (enmendado por #199 R5) (enmendado por #199 R9) (enmendado por #199 R14)
Test Suites: 2 failed, 2 total
Tests:       2 failed, 77 skipped, 79 total

R14 verde: `Tests: 452 passed, 452 total`; sonda principal 35 fallos, sonda HT/E1 2 fallos; todas por aserción y restauradas byte a byte. Empieza R15.

R15 rojo: `Tests: 2 failed, 86 skipped, 88 total`; ambos nuevos por aserción.

R15 verde: `Tests: 210 passed, 210 total`; sin candados antiguos enmendados ni nacidos verdes.

R16 rojo: `Tests: 11 failed, 131 skipped, 4 passed, 146 total`; cinco nuevos y seis candados viejos. PCF Card flat añade Salud, AC text15 añade Salud. Fechas siguen crudas hasta R17 y los cuatro tiles/iconos permanecen sin cambios.

Sonda R16: receta, cifra y stagger de vacunas: r16-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #173 R3: Card hero y flat solo en Perfil › Perfil es el único consumidor de Card flat y lo usa dos veces (enmendado por #199 R7) (enmendado por #199 R16)
  ● #174 R12: inventarios › limita text-15 a su inventario de producción (enmendado por #189 R1) (enmendado por #189 R8) (enmendado por #189 R12) (enmendado por #197 R4) (enmendado por #197 R10) (enmendado por #197 R19) (enmendado por #199 R10) (enmendado por #199 R14) (enmendado por #199 R16)
  ● Console
  ● #168 R3: cada vacuna lleva su tile pastel › pinta el estado de overdue con su icono y textos (enmendado por #199 R16)
  ● #168 R3: cada vacuna lleva su tile pastel › pinta el estado de next con su icono y textos (enmendado por #199 R16)
  ● #168 R3: cada vacuna lleva su tile pastel › pinta el estado de future con su icono y textos (enmendado por #199 R16)
  ● #168 R3: cada vacuna lleva su tile pastel › pinta el estado de completed con su icono y textos (enmendado por #199 R16)
  ● #199 R16: filas de vacunas › #199 R16 cada vacuna es un Card flat con py-3.5 y nombre text-15 font-extrabold
  ● #199 R16: filas de vacunas › #199 R16 la fila 0 entra a los 80 ms
  ● #199 R16: filas de vacunas › #199 R16 la fila 1 entra a los 140 ms
  ● #199 R16: filas de vacunas › #199 R16 la fila 2 entra a los 200 ms
  ● #199 R16: filas de vacunas › #199 R16 la fila 3 entra a los 200 ms
Test Suites: 3 failed, 3 total
Tests:       11 failed, 131 skipped, 4 passed, 146 total

R16 verde: `Tests: 293 passed, 293 total`; sonda once fallos por receta/tamaño/stagger, cubre seis candados enmendados y cinco nuevos; restaurada.

R17 rojo: `Tests: 10 failed, 141 skipped, 151 total`; cuatro nuevos, cinco casos antiguos y catálogo E1. Dos claves en primer uso: 448→450. Cuatro casos #168 R3 mantienen icono/color/orden; columna pasa a nombre y fechas anidadas.

Sonda R17: prefijo y fecha de próxima dosis: r17-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● R5: vacunas con la próxima destacada › marks an overdue next-dose date with the danger token (enmendado por #199 R17)
  ● #168 R3: cada vacuna lleva su tile pastel › pinta el estado de overdue con su icono y textos (enmendado por #199 R16) (enmendado por #199 R17)
  ● #168 R3: cada vacuna lleva su tile pastel › pinta el estado de next con su icono y textos (enmendado por #199 R16) (enmendado por #199 R17)
  ● #168 R3: cada vacuna lleva su tile pastel › pinta el estado de future con su icono y textos (enmendado por #199 R16) (enmendado por #199 R17)
  ● #168 R3: cada vacuna lleva su tile pastel › pinta el estado de completed con su icono y textos (enmendado por #199 R16) (enmendado por #199 R17)
  ● #199 R17: subtítulo de vacunas › #199 R17 dice Aplicada y Próxima en una línea
  ● #199 R17: subtítulo de vacunas › #199 R17 una dosis vencida pinta Próxima en text-danger
  ● #199 R17: subtítulo de vacunas › #199 R17 una dosis vigente no pinta text-danger
  ● #199 R17: subtítulo de vacunas › #199 R17 sin próxima dosis solo dice Aplicada
Test Suites: 1 failed, 1 total
Tests:       9 failed, 88 skipped, 97 total

Sonda R17 E1: aplicada retirada solo de es: r17-language-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › #194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15) (enmendado por #199 R5) (enmendado por #199 R9) (enmendado por #199 R14) (enmendado por #199 R17)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 skipped, 54 total

R17 verde: `Tests: 273 passed, 273 total`; sonda HE nueve aserciones rojas y E1 una, restauradas.

R18 rojo: `Tests: 18 failed, 274 skipped, 30 passed, 322 total`; ocho nuevos y diez guardas por aserción. Corrección propia antes del commit: hitSlop conserva el objeto de seis puntos por lado, no el supuesto número12 (el fallo nuevo de enlace era antes por clase). LG Salud1→0 y suma−1; CC Salud4→5 y dos sumas+1; DD rounded14 añade Salud. Tres usos TABULAR en Salud se conservan.

R18 integración: `Tests: 1 failed, 353 passed, 354 total`. Único fallo HT suelo39 recibido38, delta−1 exacto al salir Card de weight-card. Enmienda agregada autorizada 39→38; otros suelos intactos. HE y demás guardas pasan.

R18 verde: `Tests: 354 passed, 354 total`. Typecheck detectó exceso de propiedad inline delayMs en el doble RiseIn añadido R14; se corrige igual que WL: objeto props local antes de createElement, sin cambiar render ni oráculos. Corrección propia de test en commit separado.

Tipos repetidos tras corregir el doble RiseIn: `typecheck-r18-2-199.log`, exit 0, router.d.ts ausente.

Sonda R18: envoltorio, inventarios, mini y cabecera: r18-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/health/index.tsx importa y aplica sus 5 esquinas (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #199 R3) (enmendado por #199 R14) (enmendado por #199 R18)
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › fusiona la esquina una vez y la entrega a las dos ramas de Card (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #199 R3) (enmendado por #199 R14) (enmendado por #199 R18)
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #199 R3) (enmendado por #199 R14) (enmendado por #199 R18)
  ● #187 R1: ningún componente que fusiona className lleva text-NN › #187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9) (enmendado por #189 R5, R10, R13) (enmendado por #199 R3) (enmendado por #199 R14) (enmendado por #199 R18)
  ● #178 R13: Recordatorios sin deriva › reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10) (enmendado por #199 R14) (enmendado por #199 R18)
  ● #61 R4: el acento como tinta usa accent-strong › screens/health/index.tsx pinta con text-accent-strong (0) (enmendado por #199 R4) (enmendado por #199 R18)
  ● #61 R4: el acento como tinta usa accent-strong › suma las trece ocurrencias que enumera la spec (enmendado por #199 R4) (enmendado por #199 R18)
  ● Console
  ● #62 R5: el título de card usa un único tratamiento › aplica la receta canónica a Peso (enmendado por #199 R18)
  ● #115 R5: la weight card dibuja la evolución con WeightChart › con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace (enmendado por #199 R18)
  ● #115 R5: la weight card dibuja la evolución con WeightChart › con un registro, muestra el aviso de datos insuficientes de WeightChart (enmendado por #199 R18)
  ● #168 R2: Salud sin hero y con métricas estándar › pone el PetSwitcher como primer hijo de health-content (enmendado por #199 R13) (enmendado por #199 R14) (enmendado por #199 R18)
  ● #199 R18: tarjeta de peso › #199 R18 weight-card es un View rounded-24 bg-surface-secondary sin borde con esquina continua
  ● #199 R18: tarjeta de peso › #199 R18 la cabecera pone Peso y la cifra a la izquierda y la píldora a la derecha
  ● #199 R18: tarjeta de peso › #199 R18 variación 0.4 usa bg-category-rose y text-category-rose-strong
  ● #199 R18: tarjeta de peso › #199 R18 variación -0.2 usa bg-category-green y text-category-green-strong
  ● #199 R18: tarjeta de peso › #199 R18 variación 0 usa bg-default y text-muted
  ● #199 R18: tarjeta de peso › #199 R18 pasa variant mini y el historial entero a WeightChart
  ● #199 R18: tarjeta de peso › #199 R18 el enlace es rounded-14 bg-surface con etiqueta text-15 y chevron de 18
  ● #199 R18: tarjeta de peso › #199 R18 entra con RiseIn a los 260 ms
Test Suites: 5 failed, 5 total
Tests:       19 failed, 298 skipped, 30 passed, 347 total

R18 sonda: 19 fallos por aserción, incluidos HT y todos los candados enmendados. Restaurada byte a byte. Verde previo 354 y tipos exit0; empieza R19.

R19 rojo: `Tests: 5 failed, 178 skipped, 183 total`; tres nuevos y dos guardas Skeleton, todos por aserción.

Sonda R19: padding incorrecto del skeleton: r19-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #62 R2: cada skeleton tiene la forma del contenido que sustituye › screens/health/index.tsx conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1) (enmendado por #199 R19)
  ● Console
  ● #127 R2: el skeleton de vacunas lleva su receta en el árbol › pinta vaccines-skeleton con la clase exacta, rounded-card incluido, la vea o no el recorte de fuente (enmendado por #199 R19)
  ● #199 R19: estados de vacunas › #199 R19 la carga pinta una fila flat con tile y dos barras
Test Suites: 2 failed, 2 total
Tests:       3 failed, 178 skipped, 2 passed, 183 total

R19 verde: `Tests: 349 passed, 349 total`; sonda py3 produce tres fallos (ambas guardas antiguas y nuevo loading), restaurada. HT sigue con suelo38; la nueva Card de skeleton eleva el recuento real a39 sin fallo de suelo, como corresponde al mínimo.

R20 rojo: `Tests: 2 failed, 108 skipped, 110 total`; dos nuevos por clase de mensaje, sin guardas antiguas enmendadas ni nacidos verdes.

R20 verde: `Tests: 232 passed, 232 total`; conserva título, enlace y envoltorio, sin gráfica/cifra/píldora en vacío/error; loading antiguo verde.

R21 rojo: `Tests: 3 failed, 109 skipped, 112 total`; dos nuevos y una guarda antigua de Skeleton. Sin nacidos verdes.

Sonda R21: falta el segundo círculo de carga: r21-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● R4: health resuelve la mascota seleccionada › R8 (mobile-design-drift): reserva la altura del loading con Skeleton (enmendado por #199 R21)
  ● #199 R21: estados de mascotas › #199 R21 la carga pinta dos círculos de 40 en fila
Test Suites: 1 failed, 1 total
Tests:       2 failed, 109 skipped, 1 passed, 112 total

R21 verde: `Tests: 309 passed, 309 total`; sonda quita círculo1 y detecta dos aserciones, restaurada. Los tres it de Pingo no se tocaron. Pantallas cerradas; siguen R25/R24/R26/R27 final.

R25 rojo: `Tests: 1 failed, 32 skipped, 7 passed, 40 total`; UL R5_HEALTH43→50 rojo, siete casos nuevos CF nacen verdes (catálogo añadido en primer uso). weightLog.weight ya estaba en base: no se duplica. Se añaden solo siete filas con el R de primer uso.

Sonda R25: siete copias solo es y fila Historial ausente: r25-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #199 R25: copy nuevo › #199 R25 weightLog.history dice Historial en es y History en en
  ● #199 R25: copy nuevo › #199 R25 health.appliedOn dice Aplicada {{date}} en es y Given {{date}} en en
  ● #199 R25: copy nuevo › #199 R25 health.nextOn dice Próxima {{date}} en es y Next {{date}} en en
  ● #199 R25: copy nuevo › #199 R25 health.nextDoseToday dice hoy en es y today en en
  ● #199 R25: copy nuevo › #199 R25 health.nextDoseTomorrow dice mañana en es y tomorrow en en
  ● #199 R25: copy nuevo › #199 R25 health.nextDoseInDays dice en {{days}} días en es y in {{days}} days en en
  ● #199 R25: copy nuevo › #199 R25 weightChart.lastSixMonths dice Peso de los últimos 6 meses en es y Weight over the last 6 months en en
  ● #65 R5: Health resuelve su copy por clave › #186 R7: resuelve las 43 ocurrencias normativas (enmendado por #199 R25)
Test Suites: 2 failed, 2 total
Tests:       8 failed, 32 skipped, 40 total

## Parada del 2026-10-24 — UL #194 R5 en R25

HEAD: `c35bb65e test(#199): R25 lock the seven bilingual copy entries and usage count`.

`progress/r25-green-199.log`: `Tests: 1 failed, 93 passed, 94 total`; CF y language-provider pasan. UL R5_HEALTH ya pasa con 50 filas. Único rojo:

```text
#65 R18 › #194 R5: no deja ningún valor fijo del catálogo como literal entero en las pantallas (enmendado por #199 R1)
file: src/screens/alerts/index.tsx
esperado looseCopy: []
recibido looseCopy: ["en:health.nextDoseToday = today"]
```

El literal viene de Alertas línea 75, existente en H0: `(['today', 'week', 'earlier'] as const).flatMap((section) => ...)`. Es una clave interna para agrupar alertas. La traducción inglesa nueva `health.nextDoseToday: 'today'` la convierte en coincidencia de FIXED_COPY. `wholeLiterals` recoge literales del AST sin distinguir claves internas de copy pintada; el test compara la lista looseCopy contra vacía, no solo una cifra.

La fila UL del inventario/E1 solo autoriza la baja de `_layout` en SCREEN_FILES (ya aplicada R1) y el +7 de R5_HEALTH (R25). La errata del 2026-10-24 permite recuentos, pero dice: «Sigue siendo PARADA [...] si el it afirma comportamiento o estructura y no un recuento». Enmendar la detección de copy o renombrar la agrupación en Alertas excedería esas enmiendas. No se tocó Alertas ni el extractor/expect de looseCopy. Se necesita que el leader indique en spec cómo excluir esta clave interna sin cegar copy visible.

Antes de cerrar, se completó la sonda ya autorizada de R25: siete valores cambiados solo en es y retirada de la fila Historial en ui-copy-table. `Tests: 8 failed, 32 skipped, 40 total`, todas por aserción; originales restaurados byte a byte. Esto demuestra los siete it CF nacidos verdes y el recuento UL enmendado. El candado que bloquea continúa intacto.

Estado para reanudar:

- Único cambio tracked sin commit: `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`, las siete filas correctas de R25. Se deja sin feat porque R25 no alcanzó verde.
- Reporte y handoff son untracked; el handoff no se editó. No se tocó traceability: solo se permite en el commit final.
- Últimos tipos verdes: `typecheck-r18-2-199.log` (tras guarda router.d.ts ausente). Último lint verde: tras R23, log de cero bytes. No son aún los checks finales tras todos los cambios.
- No se ejecutaron suite completa, graphify ni cierre final porque R25 bloquea el siguiente bloque TDD. No hay push, PR, merge ni rebase.
- Tras resolver UL, repetir los tres ficheros de r25-green, commitear solo ui-copy-table como feat R25 y continuar R24 → R26 y guardas R27 → verificación completa → reporte/traceability final.
- La cuenta prevista al cierre, aún por contrastar, es 144 suites y 4817 tests: base4683 + WL36 + HE36 + WC20 + DT10 + CF38 − F1975 − LG1; LY reemplaza un caso por otro sin delta. R24/R26/guardas R27 no existen todavía, por lo que esa cifra no se afirma como verde.

### Casos que nacieron verdes en la reanudación

| R | Caso | Prueba |
|---|---|---|
| R2 | viejo test de teclado tras retirar Provider | offset91 y métricas cambiadas: cuatro fallos |
| R3 | nuevo orden header/gráfico/formulario/historial | desplazamiento de header: sonda R3 roja |
| R8 | primario de envío existente | h14→h13: un fallo |
| R9 | sin registros no hay Historial | condición >=0: sonda R9 roja |
| R10 | CC null no pinta línea | condición true: sonda R10 roja |
| R25 | siete traducciones del catálogo en primer uso | siete cambios solo en es: siete fallos CF |

### Commits de esta reanudación (sin rebase)

```text
e79ece38 refactor(#199): R1 drop the unused translator from the root stack
ed63b803 test(#199): R2 lock weight scroll metrics and keyboard offset
e79352ef feat(#199): R2 align weight scroll and keyboard metrics
d5821b4f test(#199): R3 specify the flat chart surface and entrance
12549c86 feat(#199): R3 use the canvas chart surface and entrance
a7f4708e test(#199): R4 specify monthly weight typography and delta tones
dcccf32e feat(#199): R4 match the current weight and monthly delta
13bdb40d test(#199): R7 specify the compact two-column weight form
1af3d334 test(#199): R7 wait for the rendered summary and check input tokens
f4094949 feat(#199): R7 arrange the weight form in two columns
9083ca41 test(#199): R8 preserve the final weight submit action
e1cb39a0 test(#199): R9 specify the weight history heading rows and stagger
9d4742d4 feat(#199): R9 render the weight history as staggered rows
cc790d37 test(#199): R10 specify history tiles and inline weight deltas
2c6ae36c test(#199): R4 remove obsolete icon fixture columns
15406f7a feat(#199): R10 render inline history deltas with shared tones
3f5746cb test(#199): R11 specify short civil dates in weight history
4a4b19a8 feat(#199): R11 format short civil dates in weight history
599161d2 test(#199): R22 specify weight loading empty and error layouts
c2ed2597 feat(#199): R22 render shaped weight loading rows and state messages
012495c4 test(#199): R23 specify the weight confirmation toast
dcb2ac5e feat(#199): R23 apply the inset toast shadow and delayed fade
7311523b test(#199): R12 specify the health header row across states
97bd45ca feat(#199): R12 group the health title in its header row
ae6fe96a test(#199): R13 specify avatars in the health header
18f4c4e4 feat(#199): R13 move the pet avatars into the health header
f4c8ab86 test(#199): R14 specify the next dose panel and relative dates
1043ff1f test(#199): R14 amend the HeroUI inventory and dose date guard
79817129 feat(#199): R14 render the amber next dose panel with relative dates
f1025be2 test(#199): R15 specify the vaccines section heading
0a2afe7c feat(#199): R15 render the vaccines section heading
b795c9c9 test(#199): R16 specify flat vaccine rows and their stagger
2ba498c2 feat(#199): R16 apply flat vaccine rows with capped entrance delays
c22edae5 test(#199): R17 specify one-line vaccine date subtitles
1f1997f5 feat(#199): R17 format vaccine dates in one inline subtitle
0dfc39bc test(#199): R18 specify the health weight summary and miniature chart
214805f0 test(#199): R18 amend the HeroUI Card inventory
93c7981d test(#199): R14 type the health entrance double like the weight double
e9fde020 feat(#199): R18 render the compact health weight summary
49115b71 test(#199): R19 specify vaccine loading empty and error states
8e0122df feat(#199): R19 render the vaccine skeleton row and state messages
c572d54a test(#199): R20 specify empty and failed health weight cards
0f337099 feat(#199): R20 style the empty and failed health weight messages
a19a8bdc test(#199): R21 specify pet loading circles and error semantics
22aef6ba feat(#199): R21 render pet loading circles and accessible errors
c35bb65e test(#199): R25 lock the seven bilingual copy entries and usage count
```

## Reanudación 2 (2026-10-24)

Identidad confirmada: `/home/claude/sites/Pet-Tracker-wt-199`, `feature/199-mobile-canvas-health-weight`, `26df9541 chore(spec): errata #199 English copy for the next dose today`. La parada anterior queda resuelta por copy en `en`: due today; no se toca Alertas ni escáner UL. Se preservan las siete filas de ui-copy-table pendientes del cierre de R25. Nueva autorización explícita: merge de origin/dev sin rebase, base final6bbd0485 y base de tests143/4758/1.

Reanudación2 R25 rojo: `Tests: 1 failed, 2 skipped, 6 passed, 9 total`, aserción exacta del inglés today→due today. Test commiteado solo, antes del valor del catálogo.

Reanudación2 R25 verde: `Tests: 94 passed, 94 total`, CF/UL/language-provider. Ninguna coincidencia adicional en UL. Errata del en y siete filas en commit feat; Alertas y escáner intactos.

Merge autorizado: origin/dev=6bbd0485 confirmado. Doce ficheros con conflictos; resueltos como unión de variantes, cabeceras, bloques y entradas. Títulos dev primero y #199 después. CTA etiquetas +1 por #199 R9 sobre dev; CC esquinas +3 (#199 R3/R14/R18); LG +1 R4−1 R18; UL −1 SCREEN_FILES R1; MT39+7=46 exportaciones. HT suelo de dev35 + delta real de #199 −1R3−1R14−1R18+1R19 =33; el +1 de R19 importa al recomponer el suelo sobre dev. No se cambió comportamiento de #200. Revisión de resolución detectó sufijo insertado por error en literal pairing: corregido antes de commitear, manteniendo el sufijo en el título.

Primera suite tras merge: `Test Suites: 8 failed, 137 passed, 145 total`; `Tests: 28 failed, 4841 passed, 4869 total`; snapshot1verde. CTA inventario rounded16 recibe Salud1 (+1 exacto de R14) y necesita map/suma; enmienda agregada autorizada. HE fila g conserva literal inglés anterior y debe pasar January1 · today→January1 · due today por errata R25. Otros rojos: tinte #0D1117 en cinco ficheros sin cambios y timeout aislado de celebración (60000ms). Se medirán aislados sin editar esos archivos.

Conteo tras merge explicado: 4758 + WL36 + HE36 + WC20 + DT10 + CF9 + LGink1 − LGwarning1 =4869. La fila nueva de Peso en inkSites también crea un caso it.each (+1R4), que la estimación anterior omitía; compensa el −1 de warningSites R14. Proyección final con CF38:4898, a contrastar contra la suite final.

Aislados de tinte: `Test Suites: 5 passed, 5 total`; `Tests: 338 passed, 338 total`, exit0. El proceso tardó en cerrar handles tras el resumen; un intento de cierre propio quedó detenido por la comprobación de identidad porque el PID ya había terminado. No se envió señal. Se mide además celebración en serie, sin flag de timeout; la invocación agrupa los cinco archivos anteriores y fuerza salida después de terminar las pruebas para evitar la espera de handles.

Repetición aislada serial: seis suites/404 tests verdes, exit0; celebración pasa en53.806s por fichero sin flag de timeout, incluido el caso que agotó60000ms bajo carga. Cinco archivos de tinte también verdes. Se clasifican estos fallos como intermitencia/carga por reproducción aislada sin cambios de fuente; no se afirma la causa raíz. Sigue la repetición completa de merge en serie.

Sonda R14/R25: inventario CTA y literal inglés de dosis: merge-amendments-mutation-199.log; exit 1; originales restaurados byte a byte.
  ● #177 R7.3: inventario de los veintisiete radios de dieciséis (enmendado por #191 R11) (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por #200 R9) (enmendado por #199 R14)
  ● Console
  ● #115 R6: la próxima vacuna dice fecha y días restantes › fila g: hoy 2027-01-01 12:00, próxima 2027-01-01 (enmendado por #199 R14) (enmendado por #199 R25)
  ● #199 R14: panel de la próxima dosis › #199 R14 el tile es size-13 rounded-16 bg-surface con la jeringa a 26 en warning
Test Suites: 2 failed, 2 total
Tests:       3 failed, 162 skipped, 25 passed, 190 total

Sonda de enmiendas tras merge: CTA rounded16→xl en tile de Salud y solo en nextDoseToday due today→today: tres fallos por aserción, cubre ambas guardas enmendadas; restauración byte a byte. Repetición completa: bun run test --runInBand --no-cache --forceExit, todos los ficheros, sin modificar fuente/configuración. Se usan serie y caché nueva por los síntomas de mocks bajo carga y forceExit por la demora de handles observada.

## Cierre de Reanudación 2 — gate global de tests

HEAD: `d412d83d`.

La instrucción de la sección «Reanudación2» del handoff, paso3, es: «Tras el merge, typecheck y la suite móvil completa deben quedar verdes antes de seguir». Se hizo el merge aditivo autorizado de origin/dev6bbd0485 (sin rebase) y la repetición completa prevista tras pasar aislados los fallos de tinte. El gate global sigue rojo; no se siguió con el paso4.

| Verificación | Log | Resultado |
|---|---|---|
| R25 test primero due today | r25-resume2-red-199.log | 1 failed, 2 skipped, 6 passed, 9 total; aserción CF |
| R25 CF + UL + language-provider | r25-resume2-green-199.log | 94 passed, 94 total; exit0; no otra coincidencia UL |
| Tipos con router.d.ts ausente, árbol fusionado | typecheck-merge-199.log | exit0 |
| Primera suite móvil completa | merge-full-199.log | 8 failed, 137 passed, 145 suites; 28 failed, 4841 passed, 4869 tests; snapshot1verde |
| Aislados de tinte --runInBand | merge-isolated-colors-199.log | 5 suites y338 tests verdes; exit0 |
| Aislados con celebración, --runInBand --forceExit, sin flag de timeout | merge-isolated-serial-199.log | 6 suites y404 tests verdes; exit0; celebración53.806s por fichero |
| Sonda de las enmiendas CTA/HE | merge-amendments-mutation-199.log | 3 fallos por aserción, fuentes restauradas byte a byte |
| Repetición completa --runInBand --no-cache --forceExit | merge-full-retry-199.log | 2 failed, 143 passed, 145 suites; 4 failed, 4865 passed, 4869 tests; snapshot1verde |
| Nuevos tintes aislados --runInBand --forceExit | merge-migrating-tints-isolated-199.log | 2 suites y49 tests verdes; exit0 |

Los cuatro rojos de la repetición completa son:

- WC `#199 R5 pinta viewBox 0 0 310 110 a 110 de alto sin degradado`: fill esperado tab-pill, recibido #0D1117.
- WC `#199 R5 pinta la rejilla de tres líneas en border`: stroke esperado border, recibido #0D1117.
- WC `#199 R5 un solo Circle en el último punto con radio 5`: fill esperado accent-strong, recibido #0D1117.
- BackButton `#172 R2: pinta ChevronLeft de 24 en foreground`: color esperado color:foreground, recibido #0D1117.

Los cuatro pasan en la invocación aislada final, sin cambiar código entre ambas corridas. En el log completo se ve que se ejecuta el hook real de use-theme-colors y advierte variables CSS ausentes. La migración de los fallos de tinte y su desaparición aislados demuestra intermitencia del entorno de tests; no se afirma la causa raíz. BackButton, su test, use-theme-colors y jest-setup no tienen diff contra6bbd0485. No se relajan colores esperados, no se toca el runner, mocks ajenos ni configuración para dar verde.

Se hicieron las dos enmiendas mecánicas necesarias que sí autorizan las erratas:

| Candado | Antes → después | R |
|---|---|---|
| CTA #177 R7.3 inventario rounded16, sobre dev | añade screens/health/index.tsx:1 y suma+1 | R14: tile de próxima dosis; comentario y sufijo tras #200 |
| HE #115 R6 fila g inglesa | January1 · today → January1 · due today | R25: errata del valor en, sufijo encadenado tras R14 |

La sonda revierte solo el radio del tile a rounded-xl y solo el valor en a today: las dos guardas y el test del tile fallan por aserción (tres casos); los archivos se restauran. No hay producción adicional fuera de R25 y del merge autorizado.

### Estado limpio y reanudación siguiente

- No quedan cambios sin commit bajo mobile-pet-tracker/, specs/ ni docs/.
- El reporte y el handoff continúan untracked; el handoff no se editó. El reporte se reserva con traceability para el commit final cuando terminen todos los R.
- La base final sigue6bbd0485. package.json y bun.lock no tienen diff; no hay dependencias nuevas.
- R24 y R26 no se han iniciado. R27 conserva tokens/constantes ya implementados, pero faltan sus guardas CF finales. No se ejecutaron graphify ni verificación final, que van después del gate.
- Para continuar hace falta resolver o ajustar explícitamente el gate de la suite completa en el handoff; no basta el verde aislado. Se conservan todos los logs para reproducirlo.
- No se ejecutó init.sh, push, PR ni rebase. El único merge fue origin/dev→feature/199, autorizado expresamente.

### Commits de Reanudación 2

```text
8ad8a491 test(#199): R25 move the English today copy off the alert section id
b1f972d8 feat(#199): R25 add the health and weight copy to the usage table
9b154da1 Merge remote-tracking branch 'origin/dev' into feature/199-mobile-canvas-health-weight
f9159ace test(#199): R14 amend the CTA radius inventory
d412d83d test(#199): R25 amend the English next-dose date guard
```

## Reanudación3 (2026-10-24)

Identidad confirmada: branch feature/199-mobile-canvas-health-weight, HEADd412d83d. Nuevo gate acepta solo tintes #0D1117 con verde aislado y diff sin cambio del mock de tema. BackButton cumple (sin diff6bbd0485); WC añadió el factory de tema en R5, por lo que no se da por exento: se cambia ese doble propio por spy sobre requireActual en beforeEach, manteniendo los valores esperados. Los tres fallos de color de merge-full-retry son la regresión medida de setup; no cambia producción. Se instala el spy sobre el módulo real porque el log muestra que el gráfico renderizó el hook real aunque estaba declarado el factory.

WC setup corregido: r5-theme-setup y r5-theme-final, ambos41/41 verdes. Spy en requireActual dentro de beforeEach y restoreAllMocks en afterEach, sin factory de tema ni cambio de expectativas. Se exige que WC quede verde en el cierre; no se cuenta como flake exento porque cambia su mock de tema frente a6bbd0485.

R24 rojo definitivo: `Tests: 1 failed, 9 skipped, 1 passed, 11 total`. Test de carta falla por enmienda ausente; el de casilla nace verde. Se corrigió antes del commit un escape propio que exigía dos corchetes en la regex (la medición inicial de dos fallos no cuenta como rojo de la casilla). Pregunta asíncrona pendiente sobre exención de su sonda documental o permiso de mutación temporal del único fichero fuera de lista; el resto continúa. Carta aplicada copiando el bloque literal de design y las dos frases en sus reglas.

R24 verde: `Tests: 157 passed, 157 total`, cinco ficheros; carta literal y casilla presentes. Solo docs/ui-guidelines en feat, test antes. La sonda de casilla sigue pendiente de aclaración; no se alteró su archivo.

Sonda #199 R26 viewBox completo: r26-mutation-1-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 viewBox completo
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 viewBox mini: r26-mutation-2-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 viewBox mini
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 rejilla: r26-mutation-3-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 rejilla
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 draw completo: r26-mutation-4-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 draw completo
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 draw mini: r26-mutation-5-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 draw mini
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 pop: r26-mutation-6-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 pop
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 fade del toast: r26-mutation-7-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 fade del toast
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 top del toast: r26-mutation-8-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 top del toast
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 cifra 34: r26-mutation-9-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 cifra 34
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 rise de Salud: r26-mutation-10-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 rise de Salud
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 rise de Peso: r26-mutation-11-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 rise de Peso
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 etiqueta de la gráfica: r26-mutation-12-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 etiqueta de la gráfica
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 Historial: r26-mutation-13-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 Historial
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 fecha de dosis: r26-mutation-14-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 fecha de dosis
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 subtítulo: r26-mutation-15-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 subtítulo
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 toast: r26-mutation-16-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 toast
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

Sonda #199 R26 meses: r26-mutation-17-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R26: fidelidad de Salud y Peso al canvas › #199 R26 meses
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 28 total

R26: 17 casos nacen verdes, cada uno con sonda independiente: r26-mutation-1…17-199.log, un fallo de aserción por fila y restauración exacta. La mini se mutó sola en viewBox/draw; traducciones solo en es. Restaurado CF completo:28/28 verdes. Solo commit test, sin producción nueva. Se leen los seis artboards congelados.

Sonda #199 R27 producción screens/health/index.tsx: r27-production-1-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R27: guardas › #199 R27 screens/health/index.tsx no usa corchetes, StyleSheet.create ni text-accent suelto
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R27 producción screens/weight-log/index.tsx: r27-production-2-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R27: guardas › #199 R27 screens/weight-log/index.tsx no usa corchetes, StyleSheet.create ni text-accent suelto
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R27 producción components/weight-chart.tsx: r27-production-3-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R27: guardas › #199 R27 components/weight-chart.tsx no usa corchetes, StyleSheet.create ni text-accent suelto
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R27 test screens/health/index.test.tsx: r27-test-1-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R27: guardas › #199 R27 screens/health/index.test.tsx no usa StyleSheet.create
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R27 test screens/weight-log/index.test.tsx: r27-test-2-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R27: guardas › #199 R27 screens/weight-log/index.test.tsx no usa StyleSheet.create
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R27 test components/__tests__/weight-chart.test.tsx: r27-test-3-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R27: guardas › #199 R27 components/__tests__/weight-chart.test.tsx no usa StyleSheet.create
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R27 test screens/home/__tests__/format-dates.test.ts: r27-test-4-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R27: guardas › #199 R27 screens/home/__tests__/format-dates.test.ts no usa StyleSheet.create
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R27 test __tests__/health-weight-canvas-fidelity.test.ts: r27-test-5-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R27: guardas › #199 R27 __tests__/health-weight-canvas-fidelity.test.ts no usa StyleSheet.create
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R27 Label Salud: r27-label-health-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R27: guardas › #199 R27 screens/health/index.tsx no pasa text-13, text-15 ni text-17 a Label
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R27 Label Peso: r27-label-weight-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R27: guardas › #199 R27 screens/weight-log/index.tsx no pasa text-13, text-15 ni text-17 a Label
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R24 frase de token de carta: r24-charter-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R24: Enmienda #199 › #199 R24 la carta lleva la Enmienda #199 una sola vez con sus frases
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total

Sonda #199 R5 color con spy de tema: r5-theme-palette-mutation-199.log; exit 1; rojo de aserción=True; restaurado byte a byte.
  ● #199 R5: gráfica completa › #199 R5 un solo Circle en el último punto con radio 5
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 skipped, 41 total

R27: diez casos nuevos nacen verdes. Sondas independientes en tres fuentes, cinco archivos de test (incluido CF contra sí mismo) y dos Label producen un fallo cada una; restaurados todos los bytes. Para los guards textuales de archivos de test se inyectó el marcador API prohibido en el archivo leído, sin editar el oráculo. También se probó la frase R24 de la carta y el color real solicitado por WC bajo el nuevo spy: un fallo por sonda. Restaurado CF+WC:79/79 verdes. No hay nueva implementación R27: tokens y constantes estaban hechos al inicio.
Lectura auxiliar de contadores: importar ui-copy-table directamente con bun dio ReferenceError describe (el módulo incluye un describe propio). Se corrigió la invocación de solo lectura definiendo describe no-op antes de import dinámico; sin cambios de archivos. No era un fallo de Jest ni de producción.

Verificación final de tipos: guardia router.d.ts ausente y typecheck-final exit0. Lint exacto --no-cache: exit0 y lint-199.log0bytes. Diff de package/bun y de los nueve protegidos vacío contra6bbd0485; 26 archivos en el diff mobile/docs, todos de la lista permitida. Catálogo verificado por AST:443→450 en ambos idiomas, ninguna clave previa cambia de valor y solo las siete previstas se añaden. Comienza la única suite completa final de Reanudación3 en serie, con forceExit por handles preexistentes.

## Resultado final de Reanudación3 — parada por navegación, no por tinte

HEAD: `bc16a538`.

R24, R26 y las guardas finales R27 están implementados y commiteados con sus tests. El mock de tema de WC, que sí cambió en R5 y no podía darse por exento, quedó instalado por spy sobre el módulo real y se restaura al terminar cada test. WC pasa41/41 aislados y en la suite completa; su sonda de color sigue detectando un token incorrecto. No se tocó producción para acomodar un test.

### Verificaciones del cierre medido

| Comprobación | Resultado / evidencia |
|---|---|
| Typecheck | guardia router.d.ts ausente; typecheck-final-199.log exit0 |
| Lint exacto --no-cache | exit0; lint-199.log0bytes |
| Suite completa final | final-full-199.log:145 suites (144 verdes/1 roja),4898 tests (4897 verdes/1 rojo),1 snapshot verde |
| Tests nuevos, cuenta visible | 4758 + WL36 + HE36 + WC20 + DT10 + CF38 + LGink1 − LGwarning1 =4898; LY reemplaza un caso por otro; F197 ya estaba retirado en dev |
| Suites | base143 + CF1 + DT1 =145 |
| Guardas requeridas | DD, CC, LG, CTA, AC, TH, PCF, UL, F197, CF, MT, HT y language-provider verdes en final-full; ninguna excepción aplicada a esos archivos |
| Dependencias | git diff6bbd0485 package.json/bun.lock vacío |
| Protegidos | pet-switcher, card, screen-header, rise-in, toggle-switch, shadows, home/index y tab-headers sin diff6bbd0485 |
| Copy previo | AST de en/es:443→450; changedOld=[] en ambos; solo las siete claves de R25 añadidas |
| Diff final de mobile/docs |26 ficheros, todos permitidos; detail-stack no modificado |
| git diff --check | verde |
| graphify | no ejecutado: la regla «cualquier otro rojo es PARADA» detiene el cierre |
| Commit final reporte/traceability | no ejecutado por la misma parada; matriz preparada abajo |

### Único fallo de la suite final

```text
src/screens/food/index.test.tsx
#200 R9: enlaces del canvas
#200 R9: pulsar cada enlace navega como hoy (meal-schedule-link)
expect(mockRouter.push).toHaveBeenCalledWith('/meal-schedule')
Number of calls: 0
línea1764
```

El test, screens/food/index.tsx, use-theme-colors y jest-setup no tienen diff contra6bbd0485. La aserción no compara un color y no entra en la exención de Reanudación3, aunque en ese fichero también aparezcan avisos de Uniwind. No se afirma que sea un bug visible en la app ni que sea flake: lo observado es que el mock no recibió la llamada durante esta ejecución. No se cambia ese test, el mock de router ni Nutrición. No se repite otra suite completa y no se sigue con graphify/commit final tras el rojo no exento. Hace falta decisión o arreglo del leader para continuar ese cierre.

### Recuentos finales re-medidos en este árbol

| Magnitud | Final / delta de #199 sobre dev |
|---|---|
| ui-copy-table: Salud / Peso / gráfica / layout |23 /21 /2 /0 |
| R5_HEALTH |43+7=50 |
| SCREEN_FILES |37−1=36; término de #200 +1−1 conservado |
| Catálogo en/es |443+7=450 cada uno; valores anteriores intactos |
| Cada clave nueva |dos líneas de catálogo, una en cada idioma |
| --text-34 |una declaración,34px |
| MOTION_DRAW |tres exportaciones; siete constantes nuevas totales |
| Exports motion |dev39+7=46; lista MT ordenada |
| headerShown raíz |dev4+1=5; diff solo weight-log y traductor ya sin uso |
| HeaderHeightContext Peso |0 |
| FieldErrorMessage Peso |4 líneas (import + tres campos) |
| CONTINUOUS_CORNER Salud / Peso |5 /2 |
| CC suma global directa |48; dev45+3 por R3/R14/R18 |
| CC directUses + ramas Card |50; offset2 de Card conservado |
| TABULAR_NUMS Salud / Peso |3 /4 estilos, sin cambios de cifra respecto de sus inventarios |
| LG inkSites |13 archivos,21 usos; +1R4−1R18 sobre dev; Salud0 y Peso1 |
| LG warningSites |Salud retirada; quedan Inicio y Recordatorios, con prueba negativa de Salud |
| PCF text13 |19 archivos; dev17 + PesoR7 + SaludR14 |
| PCF Card flat |meal-schedule/profile + PesoR7 + SaludR16; Perfil conserva dos usos |
| CTA rounded16 |dev33+1R14=34; Salud1 en inventario |
| HT medido por AST |32 archivos hero,217 elementos hero,33 Card,167 className; suelos28/197/33/163 |
| R3_HOME |idéntico a6bbd0485 |

Las enmiendas agregadas conservan términos y sufijos de #200 antes de los de #199. El suelo HT de Card33 es dev35−1R3−1R14−1R18+1R19, igual al recuento real. Las sumas de esquinas aumentan por los tres View nuevos, no por wrapper RiseIn ni cápsulas. Los recuentos de categoría y de tipografía se miden en este árbol; no se copian cifras del worktree paralelo.

### Sondas y límite documental

- R26:17 filas,17 fallos independientes por aserción, cada uno restaurado; logs r26-mutation-1…17-199.log. Se mutó solo mini donde correspondía y solo es en las traducciones.
- R27:3 fuentes +5 archivos de test +2 Label, un fallo independiente por fila. Los archivos de test se probaron inyectando el marcador API que su guard textual prohíbe, sin cambiar la expectativa. CF fue probado contra su propio archivo. Todo restaurado byte a byte.
- R24 carta: token34→35 en la frase del documento, un fallo y restauración.
- R5 spy: token pedido por el gráfico accent-strong→foreground, un fallo en el Circle; demuestra que el spy no relaja el color esperado.
- R24 casilla: comprobación positiva verde, nació verde porque la casilla ya estaba. Se pidió al usuario aclaración asíncrona entre eximir su sonda documental o autorizar la mutación temporal de su etiqueta. No hay respuesta recibida al redactar este cierre. No se ha tocado requirements.md ni se ha supuesto una exención. Esa sonda documental no se declara probada.

El checklist de seis smokes Android, claro y oscuro, permanece en §Smoke del humano; no se simula su aprobación. No se alteró ningún estado de feature, STATUS ni progress/current/history: lo gestiona el leader.

### Commits de Reanudación3

```text
52d11253 test(#199): R5 install chart theme tokens on the rendered module
8ee4f89d test(#199): R24 specify the health and weight charter amendment
5d5f2368 feat(#199): R24 document the health and weight canvas amendment
27ea4073 test(#199): R26 lock the seventeen frozen canvas anchors
bc16a538 test(#199): R27 guard health and weight sources and text labels
```

### Matriz preparada y aplicada en Reanudación 4

La siguiente versión rellena las 27 filas con tests y commits concretos. Se guardó durante la parada anterior y se aplicó a traceability.md en Reanudación 4, tras la aceptación del gate por el leader.

```markdown
---
feature: "mobile-canvas-health-weight"
status: approved
tags: [mobile, ui, spec, canvas-parity]
---

# Trazabilidad — [[mobile-canvas-health-weight]]

Rutas relativas a `mobile-pet-tracker/src/`. Abreviaturas de test en
requirements §Alcance. Cada fila se rellena con el commit verde del
requisito.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | WL::`#199 R1 pinta weight-log-header como primer hijo del scroll con el título de weightLog.weightLog`; WL::`#199 R1 sin historial la vuelta lleva a /health`; LY::`#199 R1 weight-log declara solo headerShown false` | `6b1d1578 feat(#199): R1 render the weight log header inside its scroll`; `e79ece38 refactor(#199): R1 drop the unused translator from the root stack` |
| R2 | WL::`#199 R2 el scroll usa margen 24, inset superior + 8, inferior + 32 y gap 14` | `e79352ef feat(#199): R2 align weight scroll and keyboard metrics` |
| R3 | WL::`#199 R3 weight-chart-card es un View rounded-24 bg-surface-secondary p-4 gap-2 con esquina continua`; WL::`#199 R3 con registros el scroll ordena cabecera, gráfica, formulario e historial`; WL::`#199 R3 la tarjeta entra con RiseIn sin retraso` | `12549c86 feat(#199): R3 use the canvas chart surface and entrance` |
| R4 | WL::`#199 R4 la cifra usa text-34 font-black text-foreground`; WL::`#199 R4 delta %s pinta %s sin icono` | `dcccf32e feat(#199): R4 match the current weight and monthly delta` |
| R5 | WC::`#199 R5 pinta viewBox 0 0 310 110 a 110 de alto sin degradado`; WC::`#199 R5 pinta la rejilla de tres líneas en border`; WC::`#199 R5 normaliza 10, 12 y 11 kg a (0,80), (155,40) y (310,60)`; WC::`#199 R5 con pesos iguales la línea va a y 60`; WC::`#199 R5 strokeDasharray mide la polilínea real`; WC::`#199 R5 la línea sigue entera a los 199 ms y llega a 0 a los 1400 ms`; WC::`#199 R5 un solo Circle en el último punto con radio 5`; WC::`#199 R5 el punto sigue oculto a los 1299 ms, llega a radio 5.4 a los 1540 y a 5 a los 1700`; WC::`#199 R5 rotula los seis meses de la ventana`; WC::`#199 R5 deja fuera el registro del 2025-09-30 y conserva el del 2025-10-01`; WC::`#199 R5 se anuncia como Peso de los últimos 6 meses`; WC::`#199 R5 chartMonths de %s es %j`; WC::`#199 R5 bajo reduce motion la línea y el punto salen completos`; DT::`#199 R5 %s en %s se lee %s` | `cfa97a6d feat(#199): R5 format chart months using local calendar dates`; `8a1fe2c9 feat(#199): R5 render the six-month weight chart from canvas`; `52d11253 test(#199): R5 install chart theme tokens on the rendered module` |
| R6 | WC::`#199 R6 pinta viewBox 0 0 310 56 a 56 de alto sin rejilla, área ni meses`; WC::`#199 R6 normaliza 10 y 12 kg a y 44 y 18, y pesos iguales a 31`; WC::`#199 R6 la línea sigue entera a los 299 ms y llega a 0 a los 1500 ms`; WC::`#199 R6 el punto final sale con radio 5 y opacidad 1 en el primer frame`; WC::`#199 R6 pinta registros de hace más de seis meses`; WC::`#199 R6 queda oculta a la accesibilidad` | `0c84df13 feat(#199): R6 add the compact weight chart variant` |
| R7 | WL::`#199 R7 weight-form es un Card flat con gap-2.5 py-3.5 y entra a los 80 ms`; WL::`#199 R7 peso y fecha comparten la primera fila y la condición va debajo`; WL::`#199 R7 las tres etiquetas pintan text-13 font-extrabold con su literal`; WL::`#199 R7 los tres inputs llevan h-12 rounded-xl bg-default` | `f4094949 feat(#199): R7 arrange the weight form in two columns` |
| R8 | WL::`#199 R8 el envío es el último hijo de weight-form y conserva h-14 rounded-16 bg-accent` | `9083ca41 test(#199): R8 preserve the final weight submit action` |
| R9 | WL::`#199 R9 pinta Historial con text-17 font-extrabold antes de las filas`; WL::`#199 R9 cada fila es un View con borde superior y py-2.5`; WL::`#199 R9 la fila %i entra a los %i ms`; WL::`#199 R9 sin registros no pinta Historial` | `9d4742d4 feat(#199): R9 render the weight history as staggered rows` |
| R10 | WL::`#199 R10 la cifra pinta text-15 font-extrabold y anida el delta en text-13`; WL::`#199 R10 sin condición corporal no pinta la línea CC` | `15406f7a feat(#199): R10 render inline history deltas with shared tones` |
| R11 | WL::`#199 R11 la fecha %s se lee %s en text-13 font-semibold`; DT::`#199 R11 %s en %s se lee %s` | `2936b2b7 feat(#199): R11 format local day and short month`; `4a4b19a8 feat(#199): R11 format short civil dates in weight history` |
| R12 | HE::`#199 R12 con mascotas, health-header y health-content son los únicos hijos del scroll`; HE::`#199 R12 health-header es una fila justify-between que empieza por health-title` | `97bd45ca feat(#199): R12 group the health title in its header row` |
| R13 | HE::`#199 R13 el selector va en health-header tras health-title en su variante avatars` | `18f4c4e4 feat(#199): R13 move the pet avatars into the health header` |
| R14 | HE::`#199 R14 next-vaccine-card es un View rounded-24 sobre el pastel ámbar con esquina continua`; HE::`#199 R14 el tile es size-13 rounded-16 bg-surface con la jeringa a 26 en warning`; HE::`#199 R14 caps, nombre y fecha llevan sus clases exactas`; HE::`#199 R14 la fecha dice %s`; HE::`#199 R14 entra con RiseIn sin retraso`; DT::`#199 R14 %s en %s se lee %s` | `89cf8a54 feat(#199): R14 format local day and long month`; `79817129 feat(#199): R14 render the amber next dose panel with relative dates` |
| R15 | HE::`#199 R15 Vacunas es un h2 de text-lg font-extrabold sin icono`; HE::`#199 R15 vaccines-section separa sus hijos con gap-2.5` | `0a2afe7c feat(#199): R15 render the vaccines section heading` |
| R16 | HE::`#199 R16 cada vacuna es un Card flat con py-3.5 y nombre text-15 font-extrabold`; HE::`#199 R16 la fila %i entra a los %i ms` | `2ba498c2 feat(#199): R16 apply flat vaccine rows with capped entrance delays` |
| R17 | HE::`#199 R17 dice Aplicada y Próxima en una línea`; HE::`#199 R17 una dosis vencida pinta Próxima en text-danger`; HE::`#199 R17 una dosis vigente no pinta text-danger`; HE::`#199 R17 sin próxima dosis solo dice Aplicada` | `1f1997f5 feat(#199): R17 format vaccine dates in one inline subtitle` |
| R18 | HE::`#199 R18 weight-card es un View rounded-24 bg-surface-secondary sin borde con esquina continua`; HE::`#199 R18 la cabecera pone Peso y la cifra a la izquierda y la píldora a la derecha`; HE::`#199 R18 variación %s usa %s y %s`; HE::`#199 R18 pasa variant mini y el historial entero a WeightChart`; HE::`#199 R18 el enlace es rounded-14 bg-surface con etiqueta text-15 y chevron de 18`; HE::`#199 R18 entra con RiseIn a los 260 ms` | `e9fde020 feat(#199): R18 render the compact health weight summary` |
| R19 | HE::`#199 R19 la carga pinta una fila flat con tile y dos barras`; HE::`#199 R19 sin vacunas pinta el aviso en text-15 leading-body text-muted`; HE::`#199 R19 con error pinta el aviso en text-danger con role alert y conserva Reintentar` | `8e0122df feat(#199): R19 render the vaccine skeleton row and state messages` |
| R20 | HE::`#199 R20 sin registros conserva envoltorio, Peso, aviso y enlace`; HE::`#199 R20 con error pinta el aviso en text-danger con role alert dentro de la tarjeta` | `0f337099 feat(#199): R20 style the empty and failed health weight messages` |
| R21 | HE::`#199 R21 la carga pinta dos círculos de 40 en fila`; HE::`#199 R21 el error pinta el aviso en text-15 leading-body text-danger con role alert` | `22aef6ba feat(#199): R21 render pet loading circles and accessible errors` |
| R22 | WL::`#199 R22 en carga pinta cabecera, formulario y tres filas esqueleto`; WL::`#199 R22 cada fila esqueleto lleva tile y tres barras con sus clases`; WL::`#199 R22 la fila esqueleto %i entra a los %i ms`; WL::`#199 R22 sin registros pinta el aviso bajo el formulario sin tarjeta ni Historial`; WL::`#199 R22 con error pinta el aviso con role alert y Reintentar bajo el formulario` | `c2ed2597 feat(#199): R22 render shaped weight loading rows and state messages` |
| R23 | WL::`#199 R23 el toast es una píldora con borde, sombra toast y top inset + 42`; WL::`#199 R23 el check es de 16 en accent-strong y el texto es el de weightLog.weightLogged`; WL::`#199 R23 el fuente declara FadeIn.duration(MOTION_TOAST_FADE_MS).delay(MOTION_TOAST_DELAY_MS)` | `dcb2ac5e feat(#199): R23 apply the inset toast shadow and delayed fade` |
| R24 | CF::`#199 R24 la carta lleva la Enmienda #199 una sola vez con sus frases`; CF::`#199 R24 la spec lleva la casilla de la enmienda` | `5d5f2368 feat(#199): R24 document the health and weight canvas amendment` |
| R25 | CF::`#199 R25 %s dice %s en es y %s en en` | `b1f972d8 feat(#199): R25 add the health and weight copy to the usage table` |
| R26 | CF::`#199 R26 %s` | `27ea4073 test(#199): R26 lock the seventeen frozen canvas anchors` |
| R27 | CF::`#199 R27 global.css declara --text-34: 34px`; CF::`#199 R27 motion.ts exporta las siete constantes con sus valores`; CF::`#199 R27 %s no usa corchetes, StyleSheet.create ni text-accent suelto`; CF::`#199 R27 %s no usa StyleSheet.create`; CF::`#199 R27 %s no pasa text-13, text-15 ni text-17 a Label`; MT::`no exporta nada más` (inventario dev39+7=46) | `f814227d feat(#199): R27 add canvas weight typography and motion timings`; `bc16a538 test(#199): R27 guard health and weight sources and text labels` |

Las filas R8 y R26 no añaden producción: comprueban comportamiento existente y quedan demostradas por sus sondas. Los tokens de R27 preceden a las pantallas; bc16a538 añade las guardas finales. Las enmiendas mecánicas y sus sondas se detallan en progress/impl_mobile-canvas-health-weight.md.
```

## Reanudación4 (2026-10-24)

HEADbc16a538 y branch feature/199-mobile-canvas-health-weight confirmados antes de actuar. El leader acepta expresamente el único rojo de final-full-199.log: Food #200 R9 meal-schedule-link; aislado con --runInBand122/122 y exit0 según progress/handoff_mobile-canvas-health-weight.md §Reanudación4. No hay ruta de ese log aislado en el handoff ni copia en progress/; se atribuye el resultado al leader, no a una ejecución propia. El test y su pantalla tienen diff vacío contra6bbd0485, como se comprobó en Reanudación3.

La nueva regla acepta un rojo si test y producción no tienen diff6bbd0485 y el archivo pasa aislado en serie. No se repite la suite completa. Tipos/lint, métricas y guardas previamente verdes se conservan.

El usuario autoriza expresamente la sonda de la etiqueta de la casilla de R24. Queda resuelta la pregunta asíncrona anterior; no hay exención implícita. Se espera la guarda de procesos compartidos antes de escribir su mutación temporal. Después: graphify, matriz preparada y commit final exacto, solo reporte+traceability.

Reanudación4 sonda R24 autorizada: r24-checkbox-mutation-199.log;   ● #199 R24: Enmienda #199 › #199 R24 la spec lleva la casilla de la enmienda
Test Suites: 1 failed, 1 total
Tests:       1 failed, 37 skipped, 38 total
Rojo por aserción=True; bytes restaurados; git diff --quiet -- specs/ exit0; SHA256=6d4a6031569f3768ab630585a1a20260cab9f0d163331585f3468f0319b18a99.

## Cierre aceptado — Reanudación 4

Se completan los pasos autorizados de cierre. No queda ningún R de implementación sin test ni ninguna fila pendiente en traceability.md. Los estados históricos de parada y la pregunta documental que aparecen arriba quedaron resueltos por las instrucciones de Reanudación 4.

- **Suite completa:** final-full-199.log, 145 suites (144 verdes y un flake aceptado), 4898 tests (4897 verdes y el mismo flake), un snapshot verde. El único rojo es Food #200 R9 meal-schedule-link. El test y su pantalla tienen diff vacío contra 6bbd0485; el leader aporta el aislado `bun run test -- --runInBand src/screens/food/index.test.tsx`, 122/122, exit 0, y lo acepta expresamente. Esta aceptación está en el handoff de Reanudación 4 y en la instrucción del usuario. No se atribuye ese aislado a una ejecución propia ni se inventa una ruta de log que no fue proporcionada. No se repitió la suite completa.
- **Tipos y lint:** typecheck-final-199.log exit 0 tras la guarda de router.d.ts ausente; lint exacto con --no-cache exit 0 y log de cero bytes. No hubo cambios persistentes de código desde esas verificaciones.
- **Sonda R24:** r24-checkbox-mutation-199.log, un fallo de aserción en el caso de casilla (37 casos omitidos, 38 totales). Se cambió solo la etiqueta autorizada, conservando el estado de la casilla, y se restauraron los bytes originales. `git diff --quiet -- specs/` dio exit 0 antes de aplicar la matriz. SHA-256 original y restaurado: `6d4a6031569f3768ab630585a1a20260cab9f0d163331585f3468f0319b18a99`. La aclaración documental queda resuelta: no hay sonda pendiente ni exención asumida.
- **Graphify:** `graphify update .` desde la raíz, exit 0, graphify-final-199.log. Extracción AST de 2438 archivos; grafo actualizado con 28 406 nodos, 36 625 aristas y 1878 comunidades. Advertencia del entorno: 20 SQL no aportaron nodos por faltar el parser opcional tree_sitter_sql. No se instalaron dependencias ni se ejecutó extracción semántica con API.
- **Trazabilidad:** matriz preparada aplicada a specs/mobile-canvas-health-weight/traceability.md, 27 filas con tests concretos y hashes de sus commits. R8 y R26 son pasos solo de test, demostrados con sus sondas. El reporte conserva el registro rojo/verde, las enmiendas E1, las filas adelantadas y los recuentos finales.
- **Límite de cierre:** el leader ejecuta init.sh y gestiona feature_list/STATUS/progress. El humano conserva los seis smokes Android en claro y oscuro listados arriba. No se marca ninguna de esas comprobaciones manuales como realizada.

El commit final pedido es `docs(#199): record health and weight implementation and verification`, únicamente con este reporte y traceability.md. El handoff no entra. No se ejecutó init.sh, push, PR ni rebase. El único merge de la sesión fue el de origin/dev aceptado en Reanudación 2.

## Merge de dev (#198) — 2026-10-24

Merge de `origin/dev` (`329c613c`, recién recibido #198 mobile-canvas-home) sobre la feature (`d49e10da`). Base común: `6bbd0485`. Commit de merge: `d80357d0`. Regla aplicada: «dev + delta de #199». No se borró nada de ninguno de los dos lados y no se tocó código de producción.

**Conflictos.** 15 hunks en 7 ficheros de test, que salen 17 al recrearlos con `git checkout --conflict=diff3` para ver la base. En los títulos `it(...)` se dejan las etiquetas `(enmendado por …)` de los dos lados: primero las de #199, luego las de #198. En las listas literales se unen las filas de los dos lados.

| Fichero | Resolución |
|---|---|
| `alerts-canvas-fidelity.test.ts` | título: + `(enmendado por #198 R9, R15)` |
| `chunky-cta-canvas-fidelity.test.ts` | título: + `(enmendado por #198 R9)`; cuenta de `rounded-16` (abajo) |
| `consistency-classnames.test.ts` | 3 títulos: + `#198 R2` / `#198 R2, R3, R4, R11, R13`; 2 sumas de `style={CONTINUOUS_CORNER}` (abajo) |
| `design-drift.test.ts` | título: + `(enmendado por #198 R9)` |
| `legibility-classnames.test.ts` | `inkSites`: home `3` (#198 R4), health `0` (#199 R18); se mantiene el `?? []` de #199, necesario con 0 apariciones; se mantiene también la aserción extra que añadió dev en «suma las trece» (Σ real = Σ declarada); suma total (abajo) |
| `profile-canvas-fidelity.test.ts` | título: + `(enmendado por #198 R5)`; inventario de `text-13`: entran `screens/health/index.tsx` (#199 R14) y `screens/home/index.tsx` (#198 R5), en orden alfabético (`he` < `ho`), como pide el `toEqual` sobre `filesMatching` |
| `language-provider.test.tsx` | título: + `(enmendado por #198 R15)`; número de claves (abajo) |

**Cifras agregadas** (base → dev → #199 → resultado = dev + (#199 − base)):

- `chunky-cta` `count(/\brounded-16\b/g)`: 33 → 34 → 34 → **35** (34 + 1).
- `consistency-classnames` `directUses.reduce(... , 2)`: 47 → 51 → 50 → **54** (51 + 3).
- `consistency-classnames` `count(/style=\{CONTINUOUS_CORNER\}/g)`: 45 → 49 → 48 → **52** (49 + 3).
- `legibility-classnames` suma de `text-accent-strong`: 21 → 22 → 21 → **22** (22 + 0; #199 suma +1 en R4 y resta −1 en R18).
- `language-provider` `englishKeys`: 443 → 445 → 450 → **452** (445 + 7).

**Ficheros que se fusionaron solos.** Se revisaron por si había duplicados o cifras que se desviaban:
- `ui-copy-table.ts`: dev cambia en R3_HOME 1 fila por 2 (`common.somethingWentWrong` → `home.loadPetsErrorTitle`/`Body`, #198 R15). #199 mueve `weightLog.weightLog` de `src/app/_layout.tsx` a `screens/weight-log` y añade 7 filas en R5_HEALTH. Los dos lados tocan bloques distintos. No hay filas duplicadas.
- `ui-language.test.ts`: `R3_HOME` +1 (dev) y `R5_HEALTH` +7 (#199) ya están, cada cifra en su propio `it`. `SCREEN_FILES` da 37 en la base, 37 en dev y 36 en #199, así que el resultado es **36** (37 + (36 − 37)): dev no añade fichero, porque `screens/home/index.tsx` ya estaba, y #199 saca `_layout.tsx`. El merge automático ya lo deja así. Ningún test comprueba la longitud de `ALL_USES`. De los otros consumidores de `ui-copy-table`, solo `no-pets-states` importa filas (R7/R8), y no las toca ninguno de los dos lados.
- `i18n/catalog.ts`: dev añade 2 claves `home.loadPetsError*` en `en` y en `es`, #199 añade 7. No hay claves duplicadas en ninguno de los dos bloques. La cifra de 452 la confirma el test de `language-provider` en verde.

**Verificación** (desde `mobile-pet-tracker/`, sin `init.sh`):
1. `grep -rn '^<<<<<<<\|^>>>>>>>' src`: no imprime nada.
2. `bun run typecheck`: exit 0.
3. `bunx jest --runInBand` con los 7 ficheros en conflicto más `ui-language.test.ts`: 8/8 suites y 432/432 tests en verde, exit 0. No apareció el flake de tinte `#0D1117`.
4. `bunx expo lint > …/scratchpad/lint199.log 2>&1`: exit 0 y log vacío, que es lo normal en este repo cuando lint sale limpio. Repetido con `/usr/bin/time`: 2.38 s, pico de 199 MB y status 0, así que no hubo OOM. Además, `bunx eslint --max-warnings=0` sobre los 7 ficheros resueltos: exit 0.

`progress/handoff_mobile-canvas-health-weight.md` sigue sin seguimiento en git y fuera de los commits. No se hizo push. Queda para el leader: `init.sh` completo.
