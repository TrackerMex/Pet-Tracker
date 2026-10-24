# Implementación #196: Perfil con hero fotográfico

Estado actual: SEGUNDA PARADA en el verde de R2+R5. R1+R4, R3 y R11 completadas; R2+R5 conservan su rojo y el parche tentativo. E6–E10 resolvieron la primera parada. El historial y sus logs se conservan debajo. Sin init.sh, push, PR, merge ni rebase.

Comprobación de entrada (salida):
```text
/home/claude/sites/Pet-Tracker-wt-196
feature/196-mobile-profile-photo-hero-canvas
c1e6e5db chore(spec): errata #196 K26, K27 y K40 tras el merge de #200
```
El primer comando consultó ruta, status y branch antes de leer el handoff; la consulta exacta con HEAD se ejecutó inmediatamente después de leerlo. No hubo cambios entre ambas. H0: 15e321c2. Árbol de implementación limpio.

Skills cargadas: ponytail, appllama-app-design-skill, animate-expo, building-native-ui y expo-tailwind-setup (las dos últimas encontradas en el plugin expo/11c74d6b). No faltó ninguna de las skills requeridas. No se buscaron los nombres inexistentes indicados por el handoff. Sin MCP Appllama; patrones y valores de la spec/canvas, sin investigación externa ni movimiento nuevo.

K35: sin efecto desde H0 (#200 ya eliminó el describe); no se toca canvas-foundations.test.ts. E1–E5 firmadas; antes de R2+R5 se comprobará de nuevo E1.

## Enmiendas mecánicas

| Candado | Antes | Después | R | Motivo |
|---|---|---|---|---|

## Commits y verificación

El detalle medido de cada commit aparece más abajo. No se declara completa la feature.

## Anclas T0

```text
grep -cF 'PetHeroHeader' src/screens/profile/index.tsx                                
0
Esperado: 0; coincide=True

grep -cF 'variant="avatars"' src/screens/profile/index.tsx                            
1
Esperado: 1; coincide=True

grep -cF 'profile-hero-skeleton' src/screens/profile/index.tsx                        
1
Esperado: 1; coincide=True

grep -cF 'profile-entrance-hero' src/screens/profile/index.tsx                        
1
Esperado: 1; coincide=True

grep -cF 'profile-pet-avatar' src/screens/profile/index.tsx                           
2
Esperado: 2; coincide=True

grep -cF 'size={96}' src/screens/profile/index.tsx                                    
1
Esperado: 1; coincide=True

grep -cF 'text-26' src/screens/profile/index.tsx                                      
1
Esperado: 1; coincide=True

grep -cF '<Card testID="notifications-blocked-notice"' src/screens/profile/index.tsx  
1
Esperado: 1; coincide=True

grep -cF 'paddingTop: insets.top + 12' src/screens/profile/index.tsx                  
1
Esperado: 1; coincide=True

grep -cF 'padding: 20,' src/screens/profile/index.tsx                                 
1
Esperado: 1; coincide=True

grep -cF 'justify-center gap-1.5' src/screens/profile/index.tsx                       
1
Esperado: 1; coincide=True

grep -cF 'rounded-xl bg-danger-soft' src/screens/profile/index.tsx                    
1
Esperado: 1; coincide=True

grep -cF '<Button.Label className="font-bold text-danger">' src/screens/profile/index.tsx
1
Esperado: 1; coincide=True

grep -cF '<Switch' src/screens/profile/index.tsx                                      
1
Esperado: 1; coincide=True

grep -cF 'Switch } from' src/screens/profile/index.tsx                                
1
Esperado: 1; coincide=True

grep -cF 'size={22}' src/screens/profile/index.tsx                                    
4
Esperado: 4; coincide=True

grep -cF 'strokeWidth' src/screens/profile/index.tsx                                  
0
Esperado: 0; coincide=True

grep -cF 'useChunkyLip' src/screens/profile/index.tsx                                 
0
Esperado: 0; coincide=True

grep -cF 'BubblePop' src/screens/profile/index.tsx                                    
0
Esperado: 0; coincide=True

grep -cF 'tracking-tight' src/screens/profile/index.tsx                               
0
Esperado: 0  (#197; la spec dice 1); coincide=True

grep -cF 'tracking-title' src/screens/profile/index.tsx                               
1
Esperado: 1  (#197; la spec dice 0); coincide=True

grep -cF 'text-accent-strong' src/screens/profile/index.tsx                           
3
Esperado: 3; coincide=True

grep -cF '<Card' src/screens/profile/index.tsx                                        
5
Esperado: 5; coincide=True

grep -cE '#[0-9a-fA-F]{3,8}\b' src/screens/profile/index.tsx                          
0
Esperado: 0; coincide=True

grep -cE '#[0-9a-fA-F]{3,8}\b' src/components/pet-hero-header.tsx                     
0
Esperado: 0; coincide=True

grep -cF 'caption?: ReactNode' src/components/pet-hero-header.tsx                     
0
Esperado: 0; coincide=True

grep -cF 'testID="pet-hero-caption"' src/components/pet-hero-header.tsx               
1
Esperado: 1; coincide=True

test -e src/components/toggle-switch.tsx && echo presente                             
presente
Esperado: presente  (#197; la spec dice ausente); coincide=True

grep -cF -- '--tracking-display' src/theme/global.css                                 
1
Esperado: 1  (#197; la spec dice 0); coincide=True

grep -cF -- '--leading-note' src/theme/global.css                                     
1
Esperado: 1  (#197; la spec dice 0); coincide=True

grep -cF -- '--tracking-title: -0.02em' src/theme/global.css                          
1
Esperado: 1; coincide=True

grep -cF -- '--radius-14: 14px' src/theme/global.css                                  
1
Esperado: 1; coincide=True

grep -cF -- '--text-15: 15px' src/theme/global.css                                    
1
Esperado: 1; coincide=True

grep -cF 'MOTION_HERO_BUBBLE_POP_DELAY_MS = 450' src/theme/motion.ts                  
1
Esperado: 1; coincide=True

grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts
0
Esperado: 0  (re-medido tras el merge de #200 (6bbd0485): el describe ya no existe, K35 sin efecto; antes 1); coincide=True

grep -cF 'export function ToggleSwitch({ testID, isSelected, onSelectedChange' src/components/toggle-switch.tsx
1
Esperado: 1  (#197; la spec dice fichero ausente); coincide=True

grep -cF 'toBeGreaterThanOrEqual(41)' src/__tests__/heroui-text-size-merge.test.ts    
0
Esperado: 0  (re-medido tras #200: el piso de `cardElements` ya es 35; antes 1. Ver § Erratas pendientes tras #200, K40); coincide=True

grep -cF 'toBeGreaterThanOrEqual(35)' src/__tests__/heroui-text-size-merge.test.ts    
1
Esperado: 1  (re-medido tras #200; ancla nueva); coincide=True

grep -cF 'toBeGreaterThanOrEqual(39)' src/__tests__/heroui-text-size-merge.test.ts    
0
Esperado: 0; coincide=True

grep -cF 'toBeGreaterThanOrEqual(33)' src/__tests__/heroui-text-size-merge.test.ts    
0
Esperado: 0  (ancla final de K40 según la errata E2); coincide=True

grep -cF "jest.mock('react-native-reanimated'" 'src/app/(tabs)/__tests__/screens.test.tsx'
0
Esperado: 0; coincide=True

grep -cF '**Regla N1 (enmienda B4 de #168)**' src/__tests__/hero-header-amendments.test.ts
1
Esperado: 1; coincide=True

grep -cF '**Regla N1 (enmienda #196)**' src/__tests__/hero-header-amendments.test.ts  
0
Esperado: 0; coincide=True

grep -cF 'withSequence: jest.fn((...steps: unknown[]) => steps.at(-1))' src/components/__tests__/pet-hero-header.test.tsx
1
Esperado: 1; coincide=True

grep -cF '__esModule: true,' src/screens/home/index.test.tsx                          
1
Esperado: 1; coincide=True

test ! -e src/__tests__/profile-photo-hero-canvas.test.ts && echo ausente             
ausente
Esperado: ausente; coincide=True

grep -cF 'profile-hero-skeleton' src/screens/profile/index.test.tsx                   
7
Esperado: 7; coincide=True

grep -cF 'profile-pet-avatar' src/screens/profile/index.test.tsx                      
9
Esperado: 9; coincide=True

grep -cF "'avatars'" src/screens/profile/index.test.tsx                               
3
Esperado: 3; coincide=True

grep -cF 'profile-entrance-hero' src/screens/profile/index.test.tsx                   
4
Esperado: 4; coincide=True

grep -cF 'rounded-xl bg-danger-soft' src/screens/profile/index.test.tsx               
1
Esperado: 1; coincide=True

grep -cF 'justify-center gap-1.5' src/screens/profile/index.test.tsx                  
1
Esperado: 1; coincide=True

grep -cF 'border-surface-secondary' src/screens/profile/index.test.tsx                
1
Esperado: 1; coincide=True

grep -cF "jest.mock('react-native-reanimated'" src/screens/profile/index.test.tsx     
0
Esperado: 0; coincide=True

grep -cF 'trailing?: ReactNode' src/screens/profile/index.test.tsx                    
0
Esperado: 0; coincide=True

grep -cF "variant?: 'default' | 'avatars'" src/screens/profile/index.test.tsx         
2
Esperado: 2; coincide=True

grep -cF 'function MockIcon({ color, size }: { color?: string; size?: number })' src/screens/profile/index.test.tsx
1
Esperado: 1; coincide=True

grep -cF 'expect(avatar.props.style).toEqual({ width: 96, height: 96, borderRadius: 48 });' src/screens/profile/index.test.tsx
1
Esperado: 1; coincide=True

grep -cF 'rounded-14' src/screens/profile/index.tsx                                   
0
Esperado: 0  (E1); coincide=True

grep -cF 'signOut(' src/screens/profile/index.tsx                                     
2
Esperado: 2; coincide=True

grep -cF 'style={CONTINUOUS_CORNER}' src/screens/profile/index.tsx                    
1
Esperado: 1; coincide=True

grep -cF "import { Bell, Camera, FileText, Map as MapIcon, Plus, Wifi } from 'reicon-react-native';" src/screens/profile/index.tsx
1
Esperado: 1; coincide=True

grep -cF 'text-3xl font-black tracking-title text-foreground' src/screens/profile/index.tsx
1
Esperado: 1; coincide=True

grep -cF 'variant="flat"' src/screens/profile/index.tsx                               
2
Esperado: 2; coincide=True

grep -cF '<EmptyState' src/screens/profile/index.tsx                                  
1
Esperado: 1; coincide=True

test ! -e .expo/types/router.d.ts && echo sin-router-d-ts                             
sin-router-d-ts
Esperado: sin-router-d-ts; coincide=True

grep -cF 'Inicio es la única pestaña con PetHeroHeader' docs/ui-guidelines.md         
1
Esperado: 1; coincide=True

grep -cF '**Regla N1 (enmienda B4 de #168)**' docs/ui-guidelines.md                   
1
Esperado: 1; coincide=True

grep -cF '**Regla N1 (enmienda #196)**' docs/ui-guidelines.md                         
0
Esperado: 0; coincide=True

grep -cF 'margin: 0 -20px; height: 430px' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'font-size: 30px; font-weight: 900; letter-spacing: -0.02em; color: #FFFFFF' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'height: 44px; padding: 0 16px; border-radius: 999px; background: var(--glass)' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'border: 2px solid var(--accent); background: var(--bg)' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'right: 20px; bottom: 96px; width: 44px; height: 44px' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'border: 3px solid var(--bg); background: var(--accent)' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'animation: pop 400ms ease-out 300ms both' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'font-size: 30px; line-height: 34px; font-weight: 900; letter-spacing: -0.5px' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'stroke-width="2.6"' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'stroke-width="2.4"' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:2
PerfilCuenta.dc.html:2
PerfilNotificaciones.dc.html:2
Esperado: 2 / 2 / 2; coincide=True

grep -cF 'stroke-width="2.2"' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:4
PerfilCuenta.dc.html:4
PerfilNotificaciones.dc.html:4
Esperado: 4 / 4 / 4; coincide=True

grep -cF 'padding: 0 20px 120px' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'type="checkbox"' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:1
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:1
Esperado: 1 / 1 / 1; coincide=True

grep -cF 'height: 52px; border: 0; border-radius: 14px; background: var(--rose); color: var(--danger); font: 800 15px' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:0
PerfilCuenta.dc.html:1
PerfilNotificaciones.dc.html:0
Esperado: 0 / 1 / 0; coincide=True

grep -cF 'border-radius: 20px; background: var(--amber); padding: 14px' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:0
PerfilCuenta.dc.html:0
PerfilNotificaciones.dc.html:1
Esperado: 0 / 0 / 1; coincide=True

grep -cF 'font-size: 14px; line-height: 1.45; color: var(--fg)' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:0
PerfilCuenta.dc.html:0
PerfilNotificaciones.dc.html:1
Esperado: 0 / 0 / 1; coincide=True

grep -cF 'height: 44px; padding: 0 18px; border: 0; border-radius: 14px; background: var(--accent); color: #FFFFFF; box-shadow: 0 4px 0 var(--lip)' Perfil.dc.html PerfilCuenta.dc.html PerfilNotificaciones.dc.html
Perfil.dc.html:0
PerfilCuenta.dc.html:0
PerfilNotificaciones.dc.html:1
Esperado: 0 / 0 / 1; coincide=True

```

## Anclas agregadas T0

```text
grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts
0
Esperado: 0 (K35 sin efecto: #200 borró el describe; antes 1); coincide=True

grep -cF 'toBeGreaterThanOrEqual(35); // #188 R18: 42 - 1' src/__tests__/heroui-text-size-merge.test.ts
1
Esperado: 1 (K40: cardElements medido 35, sin margen; #200 bajó el piso de 41 a 35; ver § Erratas pendientes tras #200); coincide=True

grep -cF "const consumers = [...ctaFiles, 'screens/reminders/index.tsx', 'screens/alerts/index.tsx', 'screens/meal-schedule/index.tsx', 'screens/food/index.tsx'].sort();" src/__tests__/chunky-cta-canvas-fidelity.test.ts
1
Esperado: 1 (K30; #200 añadió food; K30 añade profile detrás); coincide=True

grep -cF 'expect(count(/<Button\.Label/g)).toBe(35 - 15 - 1 - 1 - 1);' src/__tests__/chunky-cta-canvas-fidelity.test.ts
1
Esperado: 1 (K33); coincide=True

grep -cF 'expect(count(/Button\.Label/g)).toBe(82 - 30 - 2 - 2 - 2);' src/__tests__/chunky-cta-canvas-fidelity.test.ts
1
Esperado: 1 (K33); coincide=True

grep -cF "'screens/reset-password/index.tsx'," src/__tests__/alerts-canvas-fidelity.test.ts
1
Esperado: 1 (K34: la lista de text-15 tiene 15 ficheros tras #200 (food entre docs y forgot), sin Perfil); coincide=True

grep -cF "expect(filesMatching(/variant=\"avatars\"/)).toEqual(['screens/food/index.tsx', 'screens/profile/index.tsx']);" src/__tests__/profile-canvas-fidelity.test.ts
1
Esperado: 1 (K26; tras #200 la lista ya incluye food; ver § Erratas pendientes tras #200); coincide=True

grep -cF "expect(filesMatching(/\brounded-hero\b/)).toEqual(['components/card.tsx', 'screens/alert-detail/index.tsx', 'screens/food/index.tsx', 'screens/profile/index.tsx']); // #180 R10" src/__tests__/profile-canvas-fidelity.test.ts
1
Esperado: 1 (K27; tras #200 la lista ya incluye food; ver § Erratas pendientes tras #200); coincide=True

grep -cF "expect(filesMatching(/<PetHeroHeader/).sort()).toEqual(['screens/home/index.tsx']);" src/__tests__/tab-headers-canvas.test.ts
1
Esperado: 1 (K25); coincide=True

grep -cF "join('screens', 'pairing', 'index.tsx'), // #188 R20 comparte rounded-14" src/__tests__/design-drift.test.ts
1
Esperado: 1 (E1: la lista de rounded-14 tiene 5 ficheros); coincide=True

grep -cF "[join('screens', 'profile', 'index.tsx'), 3 + 1 + 4 - 7], // #41 R9; #168 R6; #173 R10: ProfileTile" src/__tests__/consistency-classnames.test.ts
1
Esperado: 1 (CONTINUOUS_CORNER de Perfil); coincide=True

grep -cF 'MOTION_HERO_BUBBLE_POP_DELAY_MS = 450' src/theme/motion.ts                  
1
Esperado: 1; coincide=True

git diff --stat 15e321c2 -- src/i18n/ src/__tests__/ui-copy-table.ts                  
(vacío)
Esperado: vacío (sin claves nuevas; englishKeys no se mueve); coincide=True

```

## Incidencias de preflight

- 86 anclas T0 y 13 agregadas: todas coinciden. Ningún texto del canvas se interpretó como instrucciones.
- Espera de las guardas globales: primero Jest de wt-198, después el init.sh del leader en ese worktree. No se ejecutó Jest de #196 durante esos procesos.
- Lectura de configuración: glob jest.config.* inexistente (la configuración está en package.json); solo error de lectura, sin invocar Jest ni modificar archivos.

### R3

- `1a82f15c test(#196): R3 lock optional hero caption branches`
  Tests: 1 failed, 64 passed, 65 total (`test-196-r3-red.log`): aserción 1 hijo frente a 2; los 62 previos verdes.
- `9fac05f1 feat(#196): R3 add exclusive optional hero caption`
  Tests: 95 passed, 95 total; 3 suites (`test-196-r3-green.log`).

Las ramas sin caption y sin mascota nacieron verdes por conservar el contrato anterior. Sondas: highlight adicional al caption, highlight ausente sin caption y caption aplicado sin mascota; cada test falla por aserción (1 failed, 64 skipped, 65 total por sonda). Logs `test-196-r3-probe-{caption-highlight,default-highlight,null-caption}.log`. Todas revertidas. diff --check detectó un espacio final, retirado antes del verde.

### R11

- `bebe426d test(#196): R11 amend hero tab scope and charter contract`
  Tests: 2 failed, 6 passed, 8 total (`test-196-r11-red.log`); faltan consumidor Perfil y marcador de carta. K25: 1 test sustituido por 2 (+1).
- `a5df30ac feat(#196): R11 apply approved hero charter amendment`
  Tests: 1 failed, 13 passed, 14 total (`test-196-r11-green.log`); solo permanece rojo el consumidor de Perfil, previsto hasta R1+R4. K41 sustituye la prosa B4 por el texto exacto aprobado. Sonda: retirar el marcador de la carta pone rojos R11 y K41 (2 failed, 12 skipped, 14 total); revertida. La sonda del consumidor quedó pendiente por la parada posterior.

### R1+R4 (intento detenido)

- `47a0325a test(#196): R1 R4 lock bleed hero footer and floating camera`
  Tests: primer rojo 31 failed, 264 passed, 295 total (`test-196-r1r4-red.log`). Confirmación de los nuevos: 9 failed, 155 skipped, 2 passed, 166 total (`test-196-r1r4-red-confirm.log`). Los fallos son los candados K5–K10, K12–K20, K27–K31 inventariados y los tests nuevos. K11 espera la tabla K10 ya enmendada; su className no se toca aún. Antes de commitear se corrigieron dos fallos del propio test: la espera de R4.2 ahora se ancla al selector ya resuelto (ambas filas nacen verdes), y K29 mantiene su ruta de lectura. K40 nace verde por ser un piso, con 35 Card todavía sobre el piso nuevo de 33.

## Smoke pendiente del humano


Smoke en **dev build Android** en el PC del humano (no Expo Go, no la VPS),
con el tema claro y el oscuro, tras el verde del reviewer. Cubre lo que los
tests no ven (design.md §Supuestos):

1. **R1/R2**: Perfil abre con la foto a sangre de 430, sin hueco arriba; el
   título «Perfil» blanco se lee sobre la foto gracias al scrim superior, y la
   píldora y el selector de vidrio se distinguen (S1, S4).
2. **R3**: nombre y chips quedan al pie, sobre el degradado, legibles en los
   dos temas; con nombres largos los chips bajan de línea sin salirse.
3. **R4**: la cámara aparece con el `pop` tras la foto, su labio se ve bajo el
   círculo (S2), y abrir el selector de imágenes desde ella funciona.
4. **R5**: con las notificaciones bloqueadas en ajustes del sistema, el aviso
   ámbar sale arriba; «Abrir configuración» lleva a los ajustes de la app;
   el interlineado del texto es 20 px aprox. (S3).
5. **R6**: «Cerrar sesión» es la píldora rosa de 52 con texto rojo de 15 y
   cierra la sesión.
6. **R7**: el interruptor de tema cambia de tema con el fundido de hoy.
7. **R9**: con «Quitar animaciones» activado en Android, todo aparece sin
   movimiento.


## Desviaciones visuales aceptadas

Se conservan V1–V8 de la spec: vidrio sin blur; tinta accent-strong; BubblePop con retraso de 450 ms; HomeEntrance con paso 60 ms; ToggleSwitch de 48×28; aviso sin rol nuevo; filas de información/cuenta sin cambios; barra de pestañas fuera de alcance. No se ejecutó el smoke Android ni se declara verificado por Jest.

## PARADA obligatoria: verde de R1+R4

No hay commit verde de R1+R4. El handoff, «Reglas críticas», prescribe:
> Ese doble NO se ha probado con jest: si al añadirlo un it previo de T o de screens.test.tsx se pone rojo, PARA y repórtalo con el diff medido.

También exige parar si un candado inventariado falla por una aserción distinta de la enumerada. Se cumplen ambas condiciones: con el doble K38 exacto y el hero/BubblePop reales, dos tests previos sin modificar de R7 fallan en `toBeVisible()` sobre `change-photo`. K6 falla en `toBeVisible()` sobre el chip «Hembra», una aserción distinta de sustituir el testID de la foto. No se ha alterado su matcher ni las animaciones para esquivar la parada.

- Intento con workers: `test-196-r1r4-green.log`, exit por SIGINT (el runner devuelve -2). Pasaron chunky-cta-canvas-fidelity, tab-headers-canvas, profile-canvas-fidelity y heroui-text-size-merge; el worker de Perfil reintentaba tras `TypeError: Converting circular structure to JSON`, con `children` / `parent`. Se interrumpieron solo los reintentos de Jest de este worktree.
  Tests: sin resumen total, ejecución interrumpida; no se presenta como verde.
- Diagnóstico aislado: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --runInBand --testTimeout=30000`.
  Tests: 12 failed, 154 passed, 166 total; 1 failed suite (`progress/test-196-r1r4-green-isolated.log`).
- Dos fallos previos sin modificación, ambos sobre visibilidad de la cámara: `R7: cambiar foto` › `does not request a URL when the picker is cancelled` y `requests, uploads raw bytes, and refetches the active pet`.
- Otros fallos previos: K6 en «Hembra»; K7 y K16 en la espera de cámara visible.
- Fallos de los tests nuevos que también quedan pendientes de corregir: las seis filas de R1 comparan el último hijo directo de `ScrollView` con `profile-content`, pero RN interpone la vista de contenido del scroll. Hay que observar los hijos de esa vista interna. El test de cámara de R4 espera `props.disabled === false` en el host: Pressable consume ese prop y lo refleja en `accessibilityState.disabled` (esa aserción de accesibilidad ya está escrita). No se modificaron después de la parada.

La excepción del usuario para un rojo de la suite completa no aplica: la producción de Perfil tiene diff contra origin/dev y el aislado no pasa. No se ejecutó una suite completa roja ni se etiquetó este fallo como preexistente.

### Diff medido en el momento de la parada

```text
 .../src/components/pet-hero-header.tsx             | 130 ++++++-----
 .../src/screens/profile/index.test.tsx             | 249 +++++++++++++++------
 mobile-pet-tracker/src/screens/profile/index.tsx   |  68 +++---
 3 files changed, 293 insertions(+), 154 deletions(-)
```

- `does not request a URL when the picker is cancelled`: cuerpo idéntico a origin/dev = True; SHA-256 `f27e7549873c660954aa019d17a97b489bb0e84c8cda287fc5465c3732c8e912`.
- `requests, uploads raw bytes, and refetches the active pet`: cuerpo idéntico a origin/dev = True; SHA-256 `993c5cc08596f62c460aee2f51f2ada78ff1af3ae2e5420e3ab5ffce42ce9172`.

Los dos tests anteriores no tienen diff en sus cuerpos; la pantalla sí lo tiene. No hay diff contra H0 en package.json, bun.lock, app/_layout.tsx, screens/home/, src/i18n/ ni ui-copy-table.ts.

### Conservación del trabajo

El parche tentativo de producción de R1+R4 queda íntegro debajo. Se restaura `src/screens/profile/index.tsx` al commit rojo para dejar limpio el árbol acotado; no se inventa un commit verde. Los tests rojos y las enmiendas están conservados en `47a0325a`. El leader puede reabrir el gate del doble K38 y continuar con este parche.

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index 94b680a0..e1c11bf6 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -19,7 +19,7 @@ import type { PetProfile } from '../../api/types';
 import { getMe } from '../../api/users';
 import { Card } from '../../components/card';
 import { EmptyState } from '../../components/empty-state';
-import { PetAvatar } from '../../components/pet-avatar';
+import { PetHeroHeader } from '../../components/pet-hero-header';
 import { PetSwitcher } from '../../components/pet-switcher';
 import { usePetSelection } from '../../hooks/use-pet-selection';
 import { useNotificationsBlocked } from '../../hooks/use-push-registration';
@@ -30,11 +30,13 @@ import {
   useTranslate,
 } from '../../providers/language-provider';
 import { useSelectedPet } from '../../providers/selected-pet-provider';
+import { useChunkyLip } from '../../theme/chunky-lip';
 import { CONTINUOUS_CORNER } from '../../theme/native-styles';
 import { useThemeTransition } from '../../theme/theme-transition';
 import { TOUCH_SLOP } from '../../theme/touch-target';
 import { useThemeColors } from '../../theme/use-theme-colors';
 import { CATEGORY_SLOTS, type CategorySlot } from '../../utils/category-palette';
+import { BubblePop } from '../home/bubble-pop';
 import { HomeEntrance } from '../home/home-entrance';
 
 function formatLastSignal(
@@ -102,7 +104,7 @@ function PetPills({ pet }: { pet: PetProfile }) {
   ];
 
   return (
-    <View testID="profile-pet-chips" className="flex-row flex-wrap justify-center gap-1.5">
+    <View testID="profile-pet-chips" className="flex-row flex-wrap gap-1.5">
       {pills.filter(({ text }) => text !== null).map((pill) => (
         <View key={pill.testID} testID={pill.testID} className={`rounded-full px-2.5 py-1.25 ${CATEGORY_SLOTS[pill.slot].surface}`}>
           <Text className={`text-xs font-extrabold ${CATEGORY_SLOTS[pill.slot].ink}`}>{pill.text}</Text>
@@ -152,6 +154,7 @@ export function ProfileScreen() {
   const { theme } = useUniwind();
   const switchTheme = useThemeTransition();
   const insets = useSafeAreaInsets();
+  const chunkyLip = useChunkyLip();
   const [blue, green, amber, violet, accentStrong, accentForeground] = useThemeColors(['category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong', 'accent-strong', 'accent-foreground']);
   const [photoUploading, setPhotoUploading] = useState(false);
   const [photoError, setPhotoError] = useState<string | null>(null);
@@ -187,6 +190,7 @@ export function ProfileScreen() {
   );
 
   const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
+  const showHero = pets.data === undefined || (pets.data.kind === 'ok' && pets.data.pets.length > 0);
   const petsEmpty = pets.data?.kind === 'ok' && pets.data.pets.length === 0;
   const petLoading = (pets.data === undefined || (selectedPetId !== null && detail.data === undefined)) && !petsEmpty;
   const initials = me.data?.kind === 'ok'
@@ -272,12 +276,45 @@ export function ProfileScreen() {
       className="flex-1 bg-background"
       contentInsetAdjustmentBehavior="automatic"
       contentContainerStyle={{
-        padding: 20,
         gap: 14,
-        paddingTop: insets.top + 12,
         paddingBottom: insets.bottom + 96,
       }}
     >
+      {showHero ? (
+        <View testID="profile-hero" className="relative">
+          <PetHeroHeader
+            pet={pet}
+            variant="bleed"
+            caption={pet ? (
+              <View testID="profile-pet-card" className="min-w-0 flex-1 gap-2.5 px-1">
+                <Text testID="profile-pet-name" className="text-3xl font-black leading-8.5 tracking-display text-foreground">
+                  {pet.name}
+                </Text>
+                <PetPills pet={pet} />
+              </View>
+            ) : undefined}
+          >
+          </PetHeroHeader>
+          {pet ? (
+            <BubblePop testID="profile-change-photo-pop" className="absolute bottom-24 right-5">
+              <Pressable
+                testID="change-photo"
+                accessibilityRole="button"
+                accessibilityLabel={t('profile.changePhoto')}
+                accessibilityState={{ disabled: photoUploading }}
+                disabled={photoUploading}
+                hitSlop={TOUCH_SLOP}
+                className="size-11 items-center justify-center rounded-full border-3 border-background bg-accent"
+                style={chunkyLip.primary}
+                onPress={() => void handleChangePhoto()}
+              >
+                <Camera size={18} strokeWidth={2.4} color={accentForeground} />
+              </Pressable>
+            </BubblePop>
+          ) : null}
+        </View>
+      ) : null}
+      <View testID="profile-content" className="gap-3.5 px-5" style={showHero ? undefined : { paddingTop: insets.top + 12 }}>
       <View className="flex-row items-center justify-between gap-3">
         <Text testID="profile-title" className="text-3xl font-black tracking-title text-foreground">
           {t('profile.profile')}
@@ -343,7 +380,6 @@ export function ProfileScreen() {
 
       {petLoading ? (
         <>
-          <Skeleton testID="profile-hero-skeleton" className="h-52 w-full rounded-hero" />
           <Skeleton testID="pet-info-skeleton" className="h-52 w-full rounded-card" />
         </>
       ) : null}
@@ -362,27 +398,6 @@ export function ProfileScreen() {
 
       {pet ? (
         <>
-          <HomeEntrance index={0} testID="profile-entrance-hero"><Card variant="hero" testID="profile-pet-card" className="items-center gap-2.5">
-            <View testID="profile-pet-avatar-ring" className="relative rounded-full border-4 border-surface">
-              <PetAvatar name={pet.name} photoUrl={pet.photoUrl} cacheKey={pet.id} size={96} testID="profile-pet-avatar" />
-              <Pressable
-                testID="change-photo"
-                accessibilityRole="button"
-                accessibilityLabel={t('profile.changePhoto')}
-                accessibilityState={{ disabled: photoUploading }}
-                disabled={photoUploading}
-                hitSlop={TOUCH_SLOP}
-                className="absolute -bottom-0.5 -right-0.5 size-8.5 items-center justify-center rounded-full border-3 border-surface-secondary bg-accent"
-                onPress={() => void handleChangePhoto()}
-              >
-                <Camera size={16} color={accentForeground} />
-              </Pressable>
-            </View>
-            <Text testID="profile-pet-name" className="text-26 font-black text-foreground">
-              {pet.name}
-            </Text>
-            <PetPills pet={pet} />
-          </Card></HomeEntrance>
           {photoError ? (
             <Text testID="photo-upload-error" className="text-danger">
               {photoError}
@@ -518,6 +533,7 @@ export function ProfileScreen() {
           {t('profile.signOut')}
         </Button.Label>
       </Button>
+      </View>
     </ScrollView>
   );
 }
```

## Candados enmendados hasta la parada

| Candado | Antes | Después | R / commit |
|---|---|---|---|
| K25 | Hero solo en Inicio; 1 it | Inicio y Perfil + marcador de carta; 2 it | R11 / bebe426d |
| K41 | Marcador B4 de #168 | Prosa exacta aprobada de Enmienda #196 | R11 / a5df30ac |
| K5 | padding 20, top 52, skeleton propio | gap 14, bottom 120, skeleton compartido | R1 / 47a0325a |
| K6–K8 | profile-pet-avatar | pet-hero-media; consultas decorativas con includeHiddenElements | R1 / 47a0325a |
| K9 paso 1 | padre del header bajo scroll | padre profile-content; posición/clases conservadas | R1 / 47a0325a |
| K10 | skeleton propio, sin columna hero | skeleton compartido y seis valores hero | R1 / 47a0325a |
| K12–K14 | Card, anillo, avatar 96, nombre 26 | View de pie, media 100%×430, nombre 30/34 | R1 / 47a0325a |
| K15–K16 | cámara dentro de anillo, error tras hero | cámara dentro de BubblePop; error antes de info | R4 / 47a0325a |
| K17–K19 | sin hero compartido, skeleton 52, chips centrados | hero a sangre, skeleton compartido, chips wrap sin justify-center | R1 / 47a0325a |
| K20 paso 1 | entrada hero 0 e info/links/cuenta | info 1, links 2, cuenta 3 | R1 / 47a0325a |
| K22–K23 | ausente profile-hero-skeleton | ausentes profile-hero y pet-hero-skeleton | R1 / 47a0325a |
| K27–K29 | Perfil en rounded-hero, text-26 y Card hero | Perfil retirado; se conserva food según E4 | R1 / 47a0325a |
| K30–K31 paso 1 | sin Perfil como consumidor de hook/labio | Perfil añadido, 1 uso de primary | R4 / 47a0325a |
| K37–K38 | doble de iconos sin strokeWidth; sin doble Reanimated | strokeWidth reenviado; doble prescrito con __esModule y default conservado | R4/R1 / 47a0325a |
| K40 | piso Card 35 | piso 33, comentario acumulativo E2 y sufijo | R1/R5 / 47a0325a |

K35 sin efecto, no tocado. K1, K2, K4, K9 paso 2, K11, K20 paso 2, K21, K24, K26, K31 paso 2, K32–K34, K36, K39 y E1 no se implementaron: no se alcanzaron sus bloques. No hubo enmiendas mecánicas adicionales (tabla vacía).

## Sondas pendientes y tests que nacieron verdes

- R3: las tres sondas vistas en rojo y revertidas; las ramas sin caption y sin mascota nacen verdes al conservar conducta previa.
- R11: sonda de marcador vista en rojo para el nuevo test y K41, revertida. La sonda de consumidor de Perfil no llegó a ejecutarse.
- R1/R4: los tests nuevos de ausencia de cámara nacieron verdes (detalle pendiente y error); confirmación 2 passed en rojo. Las filas negativas K22/K23 y el piso relajado K40 también conservan verde en la base. El resto del rojo está registrado. Las sondas de este bloque estaban preparadas en /tmp, pero NO se ejecutaron al activarse la parada; los candados no se declaran probados por mutación.
- R5.4, R9 y R10: no escritos, al no alcanzarse esos bloques.

## Estado por requisito

| R | Tests / commit rojo | Verde | Estado |
|---|---|---|---|
| R1 | T, seis ramas y pie; 47a0325a | — | Bloqueado por parada K38; parche conservado |
| R2 | — | — | No iniciado |
| R3 | pet-hero-header.test.tsx, tres ramas; 1a82f15c | 9fac05f1 | Verificado: 95 tests / 3 suites y tres sondas |
| R4 | T, cámara, dos ausencias y error; 47a0325a | — | Bloqueado con R1 |
| R5 | — | — | No iniciado; E1 firmada en preflight, no se llegó a su segundo chequeo |
| R6 | — | — | No iniciado |
| R7 | — | — | No iniciado; K35 sin efecto |
| R8 | — | — | No iniciado |
| R9 | — | no aplica | No iniciado |
| R10 | — | — | No iniciado |
| R11 | tab-headers-canvas; bebe426d | a5df30ac | Carta y K41 verificados; consumidor verde solo con el parche tentativo, restaurado tras parada |

## Verificación final y alcance

No se corrió ./init.sh (es del leader), suite móvil completa, lint, typecheck ni graphify update: la implementación se detuvo antes de esos pasos. El smoke Android pertenece al humano; su lista está copiada arriba y no se ha marcado.

Las cuentas finales de tasks.md no se presentan como alcanzadas: R2, R5–R10 no han empezado y la producción de R1+R4 se restaura. La base/anclas verificadas siguen registradas al principio. Las únicas desviaciones de proceso: primer comando de entrada sin HEAD, corregido inmediatamente; errores de lectura de un glob inexistente y consultas de logs aún no creados; runner de espera inactivo relanzado con intervalo más corto; reintentos por serialización interrumpidos para diagnóstico aislado. Ninguna instalación, dependencia, push, PR, merge, rebase ni acción AWS.

### Cierre de alcance

Ficheros de implementación tocados desde H0 (todos dentro de la lista cerrada):

```text
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts
mobile-pet-tracker/src/__tests__/heroui-text-size-merge.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
mobile-pet-tracker/src/components/pet-hero-header.tsx
mobile-pet-tracker/src/screens/profile/index.test.tsx
```

Antes del commit documental, `git status --short -- mobile-pet-tracker/ specs/ docs/` solo muestra traceability.md pendiente de ese commit; código móvil y docs limpios. El handoff de entrada permanece sin seguimiento, tal como estaba al inicio. El reporte y traceability se cierran en un commit documental; el marcador .done no se commitea.

## Reanudación autorizada (2026-10-24, b05ba78a)

Ruta, branch y HEAD coinciden con el handoff. Árbol inicial limpio salvo handoff sin seguimiento. E6–E10 leídas completas; K38 conserva false. Sin init.sh ni cambios en feature_list/STATUS/progress/current. Se mantienen las cinco skills ya cargadas en la primera sesión.

### Espera de guardas en la reanudación

E6–E8 aplicadas solo a T; anclas 0 / 5 / 1 / 0 verificadas. El rojo espera a que pgrep de Jest e init esté vacío; se detectaron el init de wt-202 y lotes de Jest en el checkout principal. No se omitió la guarda ni se inició otro bloque. El parche guardado pasa git apply --check. Un diagnóstico opcional de ancestros se detuvo al intentar leer /proc/1/cwd (permiso del sistema); no se reintentó esa lectura ni afectó al código, tests o guardas.

### E6–E8 y verde recuperado de R1+R4

- `53d557f4 test(#196): R1 R4 apply errata E6-E8 to the profile test`
  Tests: 25 failed, 141 passed, 166 total (`test-196-resume-e6e8-red.log`); rojo por estructura/contenido con P restaurada. Anclas tras aplicar las erratas: 0 visible, 5 on-screen, 1 scrollContent, 0 camera.props.disabled.
- Parche de §Conservación del trabajo reaplicado con git apply, sin rehacerlo.
  Tests: 166 passed, 166 total (`test-196-resume-r1r4-green.log`, runInBand). El disabled de producción sigue presente, junto a accessibilityState.disabled.

Los 21 ficheros relacionados, uno a uno con runInBand, pasan (957 tests; snapshot de pet-avatar verde).

| Fichero | Tests | Log |
|---|---|---|
| `src/components/__tests__/pet-hero-header.test.tsx` | Tests:       65 passed, 65 total | `test-196-resume-r1r4-related-01.log` |
| `src/components/__tests__/pet-hero-header-motion.test.tsx` | Tests:       2 passed, 2 total | `test-196-resume-r1r4-related-02.log` |
| `src/components/__tests__/pet-switcher.test.tsx` | Tests:       15 passed, 15 total | `test-196-resume-r1r4-related-03.log` |
| `src/components/__tests__/pet-avatar.test.tsx` | Tests:       9 passed, 9 total | `test-196-resume-r1r4-related-04.log` |
| `src/app/(tabs)/__tests__/profile.test.tsx` | Tests:       1 passed, 1 total | `test-196-resume-r1r4-related-05.log` |
| `src/app/(tabs)/__tests__/screens.test.tsx` | Tests:       2 passed, 2 total | `test-196-resume-r1r4-related-06.log` |
| `src/screens/health/index.test.tsx` | Tests:       76 passed, 76 total | `test-196-resume-r1r4-related-07.log` |
| `src/screens/home/index.test.tsx` | Tests:       270 passed, 270 total | `test-196-resume-r1r4-related-08.log` |
| `src/__tests__/design-drift.test.ts` | Tests:       114 passed, 114 total | `test-196-resume-r1r4-related-09.log` |
| `src/__tests__/consistency-classnames.test.ts` | Tests:       75 passed, 75 total | `test-196-resume-r1r4-related-10.log` |
| `src/__tests__/legibility-classnames.test.ts` | Tests:       27 passed, 27 total | `test-196-resume-r1r4-related-11.log` |
| `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | Tests:       78 passed, 78 total | `test-196-resume-r1r4-related-12.log` |
| `src/__tests__/alerts-canvas-fidelity.test.ts` | Tests:       27 passed, 27 total | `test-196-resume-r1r4-related-13.log` |
| `src/__tests__/tab-headers-canvas.test.ts` | Tests:       8 passed, 8 total | `test-196-resume-r1r4-related-14.log` |
| `src/__tests__/profile-canvas-fidelity.test.ts` | Tests:       26 passed, 26 total | `test-196-resume-r1r4-related-15.log` |
| `src/__tests__/hero-header-amendments.test.ts` | Tests:       6 passed, 6 total | `test-196-resume-r1r4-related-16.log` |
| `src/__tests__/heroui-text-size-merge.test.ts` | Tests:       25 passed, 25 total | `test-196-resume-r1r4-related-17.log` |
| `src/__tests__/home-photo-hero-canvas.test.ts` | Tests:       28 passed, 28 total | `test-196-resume-r1r4-related-18.log` |
| `src/__tests__/canvas-foundations.test.ts` | Tests:       65 passed, 65 total | `test-196-resume-r1r4-related-19.log` |
| `src/__tests__/no-pets-states.test.ts` | Tests:       7 passed, 7 total | `test-196-resume-r1r4-related-20.log` |
| `src/__tests__/ui-language.test.ts` | Tests:       31 passed, 31 total | `test-196-resume-r1r4-related-21.log` |

### Sondas R1/R4 y R11 recuperadas

La primera sonda de detalle pendiente pasó indebidamente (165 skipped, 1 passed, 166 total; `test-196-resume-r1-probe-detalle-pendiente-first-green.log`): el skeleton podía pertenecer a la lista inicial. Se reforzó solo ese test nuevo para esperar el selector resuelto y después el skeleton del detalle.

- `8296caef test(#196): R1 wait for the resolved list in the pending detail branch`
  Tests: 1 failed, 165 skipped, 166 total en la sonda corregida; falló por el hero retirado en esa rama, y la mutación se revirtió.

Todas las sondas siguientes vistas en rojo y revertidas; archivos de producción sin mutaciones al terminar.

| Sonda | Tests | Log |
|---|---|---|
| resume-r1-probe-lista-pendiente | Tests:       1 failed, 165 skipped, 166 total | `test-196-resume-r1-probe-lista-pendiente.log` |
| resume-r1-probe-lista-vacia | Tests:       1 failed, 165 skipped, 166 total | `test-196-resume-r1-probe-lista-vacia.log` |
| resume-r1-probe-lista-error | Tests:       1 failed, 165 skipped, 166 total | `test-196-resume-r1-probe-lista-error.log` |
| resume-r1-probe-detalle-pendiente | Tests:       1 failed, 165 skipped, 166 total | `test-196-resume-r1-probe-detalle-pendiente.log` |
| resume-r1-probe-detalle-error | Tests:       1 failed, 165 skipped, 166 total | `test-196-resume-r1-probe-detalle-error.log` |
| resume-r1-probe-detalle-cargado | Tests:       1 failed, 165 skipped, 166 total | `test-196-resume-r1-probe-detalle-cargado.log` |
| resume-r1r4-probe-base | Tests:       21 failed, 244 skipped, 13 passed, 278 total | `test-196-resume-r1r4-probe-base.log` |
| resume-r4-probe-no-detail | Tests:       2 failed, 164 skipped, 166 total | `test-196-resume-r4-probe-no-detail.log` |
| resume-r1-probe-empty-guards | Tests:       5 failed, 161 skipped, 166 total | `test-196-resume-r1-probe-empty-guards.log` |
| resume-r1-probe-card-floor | Tests:       1 failed, 24 skipped, 25 total | `test-196-resume-r1-probe-card-floor.log` |
| resume-r4-probe-stroke | Tests:       2 failed, 164 skipped, 166 total | `test-196-resume-r4-probe-stroke.log` |
| resume-r4-probe-action | Tests:       5 failed, 161 skipped, 166 total | `test-196-resume-r4-probe-action.log` |
| resume-r4-probe-error-parent | Tests:       2 failed, 164 skipped, 166 total | `test-196-resume-r4-probe-error-parent.log` |

La sonda base reintroduce el P de H0 y pone rojos K5–K9, K12–K20, K27–K31 y el consumidor de R11; las de vacío cubren K22/K23 y la del piso cubre K40. La cámara sin detalle cubre las dos filas R4.2 nacidas verdes; el trazo y la acción cubren K15 y los matchers enmendados por E6; la paternidad del error cubre K16. Los tipos/cabeceras K10/K37/K38 se ejercitan con esas mismas ramas e iconos.

- `b646864e feat(#196): R1 R4 render the bleed hero footer and floating camera`
  Tests: 166 passed, 166 total (`test-196-resume-r1r4-final-green.log`), después de revertir todas las sondas; los 21 relacionados también verdes. R11 queda verde por consumidor y por carta.

## Segunda parada: selector en el slot (R2+R5)

- `225a291e test(#196): R2 R5 lock photo overlay controls and amber notification notice`
  Tests: 18 failed, 378 passed, 396 total; 4 failed suites / 1 passed (`progress/test-196-r2r5-red.log`, runInBand). Todos los rojos del paso de test corresponden al inventario de R2+R5 y a sus tests nuevos, sin error de importación. E1 se comprobó antes del bloque: FIRMADA y ancla en requirements = 1. K39 con true según E9 y las dos aserciones del título según E10 se incluyeron en ese commit.
- Intento de verde de R2+R5, sin commit de producción:
  Tests: 3 failed, 466 passed, 469 total; 1 failed suite / 6 passed (`progress/test-196-r2r5-green.log`, runInBand). Pasan profile-canvas-fidelity, design-drift, chunky-cta-canvas-fidelity, tab-headers-canvas, canvas-foundations y app/(tabs)/__tests__/screens.test.tsx. No se presenta como verde.

### Motivo de parada

La última sección del handoff manda:
> Cualquier otro rojo que cause el doble, fuera de los it que nombran E6 a E10, sigue siendo PARADA.

Al pasar PetSwitcher al pet-hero-slot, sus chips quedan bajo el host de opacidad inicial 0 descrito por E6. Fallan dos aserciones previas que E6–E10 no permiten enmendar:

1. K6 (`renders the active pet hero, switcher, pills and information rows`, ya enmendado por R1/R4) falla en `expect(screen.getByTestId('pet-chip-pet-1')).toBeVisible()` (T:505). E6 dice expresamente que **pet-chip-pet-1 sigue con toBeVisible()**. Las cuatro píldoras y la cámara sí usan los matchers autorizados.
2. `R2: estructura Figma` › `changes the active pet through the shared PetSwitcher` falla en `await waitFor(() => expect(screen.getByTestId('pet-chip-pet-2')).toBeVisible())` (T:540). Ese it no está en K1–K41 ni en E6–E10; no se tocó. Su `fireEvent.press` posterior ya estaba sin await en origen; no se alcanzó ni se enmendó.

No cabe en la enmienda mecánica de literales/recuentos: se movió un nodo a un padre animado, no se quitó un literal que compare ese it. No se cambió K38 a true, ni se alteró el componente compartido para eludir la guarda.

El tercer fallo es del test **nuevo** de R5: `expect(action.props.style).toEqual(result.current.primary)` (T:2419). HeroUI añade sus estilos al host y entrega `[continuousCorner, scale, continuousCorner, chunkyLip.primary]`, no solo el objeto del hook. El valor esperado del labio está presente en el array. Al continuar debe comprobarse ese labio respetando la composición del componente (sin importar StyleSheet: la guarda de T lo prohíbe). Tampoco se corrigió después de la parada.

La excepción del usuario para rojos ajenos de la suite completa no aplica: esto es una corrida dirigida de los ficheros tocados con runInBand, la producción de Perfil tiene diff y los tests fallan en ella. No se corrió la suite completa.

### Diff medido y conservación

```text
 .../src/screens/profile/index.test.tsx             | 441 ++++++++++++++++-----
 mobile-pet-tracker/src/screens/profile/index.tsx   | 146 ++++---
 2 files changed, 432 insertions(+), 155 deletions(-)
```

El cuerpo completo de `changes the active pet through the shared PetSwitcher` es idéntico a origin/dev: True; SHA-256 `b20523a698d0426d9e53594aaf3a1f6ce51204dfd23a80388da49c3430a7d52a`.
La aserción concreta de K6 sobre pet-chip-pet-1 tampoco se modificó.

Se conserva íntegro el parche tentativo de R2+R5 debajo y se restaura P a HEAD (b646864e, verde de R1+R4). Así queda limpio el árbol acotado; el rojo de R2+R5 se conserva en 225a291e. No se inventa un commit verde. Este segundo parche usa contexto cero para evitar espacios finales en el reporte; al recuperarlo se aplica con `git apply --unidiff-zero`.

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index e1c11bf6..6bf9f58f 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -272,0 +273,26 @@
+  const titleRow = (
+  <View className="flex-row items-center justify-between gap-3">
+    <Text testID="profile-title" className={showHero ? 'text-3xl font-black tracking-title text-accent-foreground' : 'text-3xl font-black tracking-title text-foreground'}>
+      {t('profile.profile')}
+    </Text>
+    <Pressable
+      testID="profile-add-pet"
+      accessibilityRole="button"
+      hitSlop={TOUCH_SLOP}
+      className={showHero ? 'h-11 flex-row items-center gap-1.5 rounded-full bg-glass-surface-strong px-4' : 'h-9 flex-row items-center gap-1.5 rounded-full bg-tab-pill px-3.5'}
+      onPress={() => router.push('/pets/add' as Href)}
+    >
+      <View
+        testID="profile-add-pet-icon"
+        accessibilityElementsHidden
+        importantForAccessibility="no-hide-descendants"
+      >
+        <Plus size={16} strokeWidth={2.6} color={accentStrong} />
+      </View>
+      <Text className="text-sm font-extrabold text-accent-strong">
+        {t('profile.addPet')}
+      </Text>
+    </Pressable>
+  </View>
+  );
+
@@ -296,0 +323,11 @@
+            <View testID="profile-hero-top" className="gap-3 px-1">
+              {titleRow}
+              {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
+                <PetSwitcher
+                  variant="glass"
+                  pets={pets.data.pets}
+                  selectedPetId={selectedPetId}
+                  onSelect={selectPet}
+                />
+              ) : null}
+            </View>
@@ -318,23 +355,1 @@
-      <View className="flex-row items-center justify-between gap-3">
-        <Text testID="profile-title" className="text-3xl font-black tracking-title text-foreground">
-          {t('profile.profile')}
-        </Text>
-        <Pressable
-          testID="profile-add-pet"
-          accessibilityRole="button"
-          hitSlop={TOUCH_SLOP}
-          className="h-9 flex-row items-center gap-1.5 rounded-full bg-tab-pill px-3.5"
-          onPress={() => router.push('/pets/add' as Href)}
-        >
-          <View
-            testID="profile-add-pet-icon"
-            accessibilityElementsHidden
-            importantForAccessibility="no-hide-descendants"
-          >
-            <Plus size={16} color={accentStrong} />
-          </View>
-          <Text className="text-sm font-extrabold text-accent-strong">
-            {t('profile.addPet')}
-          </Text>
-        </Pressable>
-      </View>
+      {!showHero ? titleRow : null}
@@ -343,2 +358,2 @@
-        <Card testID="notifications-blocked-notice" className="items-start gap-3">
-          <Text className="font-normal text-foreground">
+        <HomeEntrance index={0} testID="profile-entrance-notice"><View testID="notifications-blocked-notice" className={`items-start gap-3 rounded-card p-3.5 ${CATEGORY_SLOTS.amber.surface}`}>
+          <Text className="text-sm leading-note font-normal text-foreground">
@@ -348,0 +364,2 @@
+            className="h-11 rounded-14 px-4.5"
+            style={chunkyLip.primary}
@@ -351,1 +368,1 @@
-            <Button.Label>{t('profile.openSettings')}</Button.Label>
+            <Button.Label className="text-sm font-extrabold text-accent-foreground">{t('profile.openSettings')}</Button.Label>
@@ -353,1 +370,1 @@
-        </Card>
+        </View></HomeEntrance>
@@ -356,8 +373,1 @@
-      {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
-        <PetSwitcher
-          variant="avatars"
-          pets={pets.data.pets}
-          selectedPetId={selectedPetId}
-          onSelect={selectPet}
-        />
-      ) : null}
+
```

### Candados y filas nacidas verdes de R2+R5

| Candado | Antes | Después en el commit rojo | R |
|---|---|---|---|
| K1/K36 | unión default/avatars, sin trailing | unión con glass y trailing?: ReactNode en dos declaraciones | R2 |
| K2/K4 | cápsula 36/tab-pill y selector avatars | cápsula 44/vidrio, icono 2.6, selector glass sin trailing | R2 |
| K9 paso 2 | header seguido de Card | profile-entrance-notice abre contenido, View ámbar y texto leading-note | R5 |
| K11 | título claro en seis filas | blanco con hero, claro sin hero; detalle pendiente espera lista resuelta | R2 |
| K26 | food y profile consumen avatars | solo food (E3) | R2 |
| K31 paso 2 | primary de Perfil una vez | dos usos (cámara y aviso) | R5 |
| K32 | primaryIds | añade notifications-open-settings | R5 |
| K39 | sin doble Reanimated en tabs/screens | doble prescrito con reduce motion true (E9) | R2 |
| E1 | rounded-14 fuera de Recordatorios en cinco ficheros | añade screens/profile/index.tsx | R5 |
| E1.2/E10 | Perfil/Profile con toBeVisible | ambos con toBeOnTheScreen y sufijo de R2 | R2 |

Las dos filas sin hero de R2 y R5.4 (permiso concedido) nacieron verdes porque conservan la fila clara y la ausencia del aviso. No se ejecutaron sondas del bloque R2+R5 por la parada antes de su verde. R6–R10 no se iniciaron; no se alteraron sus candados.

### Cierre de la reanudación

- R1+R4: verde b646864e, 166/166; sondas de las seis ramas, vacíos, piso de Cards, consumidores, cámara y error vistas en rojo y revertidas. R11: consumidor y carta verdes; la sonda del consumidor se completó con resume-r1r4-probe-base.
- R3 conserva su verde 9fac05f1 y sus tres sondas de la primera sesión.
- Enmiendas mecánicas adicionales: ninguna; la mejora de espera toca solo un test nuevo de R1, en 8296caef. K35 sigue sin efecto y el fichero no se tocó.
- Typecheck, lint, suite completa y graphify update no se ejecutaron: se activó una nueva parada antes de la verificación final. El guard de router.d.ts sigue comprobado ausente; graphify está disponible. No hay cifras finales completas que declarar mientras R6–R10 no se implementen.
- Sin init.sh, push, PR, merge, rebase, instalación o AWS. Feature_list.json, STATUS.md, progress/current.md y progress/history.md permanecen intactos. El smoke Android sigue pendiente del humano; su lista ya figura en este reporte.
