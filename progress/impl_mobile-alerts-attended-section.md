# Implementación #223 — mobile-alerts-attended-section

Fecha: 2026-10-27. **Detenida en T0, antes de C0**, por dos anclas que no coinciden.
No se implementó ningún requisito. El leader debe corregir el handoff antes de continuar.

## Continuidad y ubicación

La interrupción por Escape ocurrió durante las lecturas iniciales. Al reanudar se
comprobó `git log -8 --oneline` y `git status --short`: no había commits ni cambios
míos. HEAD de partida y de la comprobación de T0:
`88799cc7f2d2ff152f1bcfdd6a0b188d897d6003`.

La primera llamada ejecutó `pwd`, `git status --short` y
`git branch --show-current`, en ese orden, desde el cwd suministrado. Dio:

```text
/home/claude/sites/Pet-Tracker-wt-223
?? progress/draft_handoff-223.md
feature/223-mobile-alerts-attended-section
```

Desviación de invocación: la primera línea no fue exactamente la pedida por el
handoff (incluyó `git status --short` entre `pwd` y la branch), aunque confirmó la
ruta y la branch correctas. No se modificó `progress/draft_handoff-223.md`, que ya
existía sin seguimiento.

H0 confirmado: `418e15986f14a98d38cb411d888d1b99879bacae`.
Los únicos cambios de H0 a HEAD antes de mi trabajo eran los del leader:
`progress/handoff_mobile-alerts-attended-section.md` y
`specs/mobile-alerts-attended-section/requirements.md`.

## Bloqueo medido

El handoff dispone: «Si una cifra o ancla no coincide, PARA y reporta. La spec se
reescribe; el código no se adapta.» En T0 también exige detenerse «ante una diferencia».

| Comando desde `mobile-pet-tracker/src` | Esperado | Medido |
|---|---:|---:|
| `grep -cF "[join('screens', 'alerts', 'index.tsx')" __tests__/consistency-classnames.test.ts` | 0 | **1** |
| `grep -c 'it\(\.each\)\?(' screens/alerts/index.test.tsx` | 83 | **78** |

La primera coincidencia está en la línea 373 y ya existía en H0:

```text
373:    [join('screens', 'alerts', 'index.tsx'), 1], // #170 R16
```

La segunda cifra también da **78** al aplicar el mismo grep al fichero de H0
mediante `git show`. Se cuentan líneas que coinciden con el patrón, no casos
expandidos de `it.each`. El otro recuento de la pantalla, `grep -c '^\s*it('`,
da **55**, tal como se esperaba.

Por tanto, las diferencias no proceden de cambios míos ni de la interrupción.
No se ajustaron cifras, tests ni código para hacerlas coincidir. La comprobación
completa se ejecutó en una sola lectura de las anclas; al inspeccionar su salida
se detuvo la cadena. El ancla E2 da **5** (cumple >= 1); no es el motivo de parada.

## Salida íntegra de las anclas T0

Los comandos del bloque se ejecutaron desde `mobile-pet-tracker/src`; la guarda
de router se ejecutó desde `mobile-pet-tracker`. Copia de
`progress/t0-223-anchors.log` (ignorado por git):

```text
grep -cF 'queryKey: alertKeys.list()' hooks/use-alerts-list.ts                      
  salida: 1 | esperado: 1
grep -cF 'useAlertsList()' screens/alert-detail/index.tsx                            
  salida: 1 | esperado: 1
grep -cF 'useAlertsList()' screens/alerts/index.tsx                                  
  salida: 1 | esperado: 1
grep -cF 'onEndReached' screens/alerts/index.tsx                                     
  salida: 1 | esperado: 1
grep -cF 'onEndReached' screens/alerts/index.test.tsx                                
  salida: 11 | esperado: 11
grep -cF "nextCursor: 'c1'" screens/alerts/index.test.tsx                            
  salida: 5 | esperado: 5
grep -cF "t('alerts.statusAcked')" screens/alerts/index.tsx                          
  salida: 1 | esperado: 1
grep -cF "t('alerts.statusClosed')" screens/alerts/index.tsx                         
  salida: 1 | esperado: 1
grep -cF 'style={chunkyLip.neutralCompact}' screens/alerts/index.tsx                 
  salida: 1 | esperado: 1
grep -cF 'text-13' screens/alerts/index.tsx                                          
  salida: 2 | esperado: 2
grep -cF 'tracking-caps' screens/alerts/index.tsx                                    
  salida: 1 | esperado: 1
grep -cF 'CONTINUOUS_CORNER' screens/alerts/index.tsx                                
  salida: 0 | esperado: 0
grep -cF 'rounded-16' screens/alerts/index.tsx                                       
  salida: 0 | esperado: 0
grep -cF 'rounded-14' screens/alerts/index.tsx                                       
  salida: 0 | esperado: 0
grep -cF 'border-lip-gray' screens/alerts/index.tsx                                  
  salida: 1 | esperado: 1
grep -cF 'const chunkyLip = useChunkyLip();' screens/alerts/index.tsx                
  salida: 1 | esperado: 1
grep -cF 'settleAlertAck(' screens/alerts/index.tsx                                  
  salida: 1 | esperado: 1
grep -cF 'ackAlert(baseUrl' screens/alerts/index.tsx                                 
  salida: 1 | esperado: 1
grep -cF "t('common.somethingWentWrong'" screens/alerts/index.tsx                    
  salida: 3 | esperado: 3
grep -cF "t('common.retry'" screens/alerts/index.tsx                                 
  salida: 1 | esperado: 1
ls hooks/use-alerts-list.test.tsx __tests__/alerts-attended-canvas-fidelity.test.ts 2>&1 | grep -c 'No such file'
  salida: 2 | esperado: 2
grep -cF 'alerts.attended' i18n/catalog.ts                                           
  salida: 0 | esperado: 0
grep -cF 'alerts.calmTitle' i18n/catalog.ts                                          
  salida: 0 | esperado: 0
grep -cF 'alerts.sectionOpen' __tests__/ui-copy-table.ts                             
  salida: 0 | esperado: 0
grep -cF "file: 'src/screens/alerts/index.tsx'" __tests__/ui-copy-table.ts           
  salida: 20 | esperado: 20
grep -cF '+ 51, // #214 R22' providers/__tests__/language-provider.test.tsx          
  salida: 1 | esperado: 1
grep -cF '+ 1 // #222 R8' providers/__tests__/language-provider.test.tsx             
  salida: 1 | esperado: 1
grep -cF 'Check' screens/alerts/index.test.tsx                                       
  salida: 0 | esperado: 0
grep -cF "'alert-detail-view-map'" __tests__/chunky-cta-canvas-fidelity.test.ts      
  salida: 2 | esperado: 2
grep -cF 'alerts-attended-more' __tests__/chunky-cta-canvas-fidelity.test.ts         
  salida: 0 | esperado: 0
grep -cF 'cada tracking-* va con su text-*' __tests__/alerts-canvas-fidelity.test.ts 
  salida: 1 | esperado: 1
grep -cF 'reserva los radios 14, 16 y 22 a Recordatorios' __tests__/design-drift.test.ts
  salida: 1 | esperado: 1
grep -cF '+ 2 // #214 R4, R18' __tests__/consistency-classnames.test.ts              
  salida: 2 | esperado: 2
grep -cF "[join('screens', 'alerts', 'index.tsx')" __tests__/consistency-classnames.test.ts
  salida: 1 | esperado: 0
grep -cF "'alert-detail-view-map'" __tests__/consistency-classnames.test.ts          
  salida: 2 | esperado: 2
grep -cF 'por fidelidad al canvas (#199): `rounded-24`' ../../docs/ui-guidelines.md  
  salida: 1 | esperado: 1
grep -cE '^- \[[xX]\] \*\*G4\*\*' ../../specs/mobile-alerts-attended-section/requirements.md
  salida: 0 | esperado: 0   (G4 sin marcar: R19 queda bloqueado)
grep -cF 'E2' ../../specs/mobile-alerts-attended-section/requirements.md             
  salida: 5 | esperado: >= 1   (la fe de erratas E2 del leader; si da 0, PARA)
grep -c '^\s*it(' screens/alerts/index.test.tsx                                      
  salida: 55 | esperado: 55
grep -c 'it\(\.each\)\?(' screens/alerts/index.test.tsx                              
  salida: 78 | esperado: 83
router.d.ts: sin-router-d-ts (exit 0)
```

## Trabajo y verificaciones

- No se ejecutó `./init.sh` en ningún momento.
- No se llegó a C0 ni a ningún commit `test` o `feat`. No hubo pruebas rojas,
  verdes ni mutaciones: no se fabricó historial TDD con un T0 bloqueado.
- N no se midió: no se lanzó Jest, ni la base completa ni la suite por prefijos,
  porque las anclas obligaron a parar antes del primer test. No hay líneas
  `Tests:` ni cifras recomputadas de guards de ejecución que reportar.
- `test ! -e .expo/types/router.d.ts` pasó. No se ejecutaron typecheck, lint,
  graphify ni las verificaciones finales: la implementación no llegó a empezar.
- La comprobación de árbol limpio de código/docs/specs pasó antes de escribir
  este reporte. No se tocaron dependencias, backend, specs, progreso compartido,
  ni las casillas de tasks o traceability. No se hizo merge, rebase, push ni PR.
- El único cambio versionable mío es este reporte, en un commit documental
  `docs(mobile): report blocked attended-section baseline anchors`.
- Se deja `progress/impl_mobile-alerts-attended-section.done` con la ruta del
  reporte, como exige el cierre del handoff. El marcador comunica que terminó
  esta ejecución; **no significa que la feature esté implementada**.

## Skills y convenciones

Se cargaron `ponytail`, `appllama-app-design-skill`, `building-native-ui` y
`expo-tailwind-setup`. Las dos últimas se encontraron en
`/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/`.
No se buscaron `expo-overview`, `expo-animation`, `expo-router` ni
`expo-design-system`: el handoff los declara inexistentes en Codex.
No se invocaron herramientas de Appllama; el handoff indica que no están
disponibles y que el diseño ya está resuelto por los artboards.

Se leyó `docs/conventions.md` §Esperas: esperar al mismo nodo que se aserta,
con una observación positiva antes de afirmar ausencia. No se escribieron tests.
Las desviaciones autorizadas (R6 después de R7, claves incrementales, rojo de R16
hasta C19, excepción de tipos de C1, E1/E2/E3) no llegaron a aplicarse.

## Requisitos y siguiente paso

| Requisito | Test / commit de implementación | Estado |
|---|---|---|
| R1 | — | No iniciado: T0 bloqueado |
| R2 | — | No iniciado: T0 bloqueado |
| R3 | — | No iniciado: T0 bloqueado |
| R4 | — | No iniciado: T0 bloqueado |
| R5 | — | No iniciado: T0 bloqueado |
| R6 | — | No iniciado: T0 bloqueado |
| R7 | — | No iniciado: T0 bloqueado |
| R8 | — | No iniciado: T0 bloqueado |
| R9 | — | No iniciado: T0 bloqueado |
| R10 | — | No iniciado: T0 bloqueado |
| R11 | — | No iniciado: T0 bloqueado |
| R12 | — | No iniciado: T0 bloqueado |
| R13 | — | No iniciado: T0 bloqueado |
| R14 | — | No iniciado: T0 bloqueado |
| R15 | — | No iniciado: T0 bloqueado |
| R16 | — | No iniciado: T0 bloqueado |
| R17 | — | No iniciado: T0 bloqueado |
| R18 | — | No iniciado: T0 bloqueado |
| R19 | — | Pendiente de G4 (0); carta sin cambios |

El leader debe revisar ambas anclas contra H0 y emitir el handoff corregido.
Después se retomará en T0 (base de tests y guards), antes de C0, sin reiniciar
ninguna implementación: no existe todavía.

G2 sigue reservado al humano: smoke colapsada, expandida con «Ver más», sin
abiertas y temas claro/oscuro. G4 también es humano; no se marcó. No se lanzó
`eas build`. La ejecución completa de `./init.sh` sigue a cargo del leader.
