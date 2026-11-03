# Plan: arreglos y mejoras tras el smoke G2 (2026-11-03)

Plan vivo de las features #226–#236. Nace del smoke en dispositivo que el humano
hizo sobre el dev build de `dev` (lotes de `progress/smoke_mejoras-producto.md` y
`progress/smoke_ui.md`) y de la lista de dudas y mejoras que envió el 2026-11-03.

Rige el mandato de CLAUDE.md §Mandato del 2026-10-23, en su ampliación del
2026-11-03 (arreglos del smoke): el leader firma las specs con firma delegada,
lanza Codex y mergea en `dev`. Lo que no se delega está en §5.

## 0. Estado de partida

- Base: `origin/dev` en `6531669f`, que trae los resultados del smoke del humano
  (commits `e2b86422`, `2ad45fd5` y `6531669f`).
- Smoke pasado y sin gates abiertos, ahora `done`: #208, #212, #213, #214, #215,
  #216, #217, #218, #219, #220, #221, #225.
- Siguen en `spec_ready`:
  - #209, #222 y #223: el smoke pasó, pero falta la casilla G4 del humano
    (enmienda de `docs/ui-guidelines.md`). Ver §6.
  - #224: el humano no marcó su smoke porque la tarjeta de IA colapsada parpadea.
    El arreglo es #234; #224 cierra cuando #234 pase su smoke.
- Las casillas de smoke de cada spec se espejaron en la PR de este plan, con la
  fecha del commit del humano. La casilla G3 de `progress/plan_ui-2026-10-26.md`
  se marcó con fecha 2026-10-30: los smokes de #214 y #217 corrieron sobre ese
  build reconstruido.

## 1. Decisiones del humano (2026-11-03)

Mensaje del humano, literal en lo que decide:

- «En agregar vacuna no aparecen las opciones de vacunas solo aparece el boton
  "Otra vacuna"» → #226.
- «En Nutricion sin Perfil, no deben de aparecer Horario de comidas y Historial
  de comidas ya que aun no se ha registrado un perfil nutricional» → #233.
- «En el welcome el boton de "Ya tengo una cuenta", quita el hover aplica para
  dark mode mejoralo» → #231.
- «No marque mobile-nutrition-ai-format porque en eñ colapso de IA queda
  parpadiando» → #234.
- «Utiliza el componente SwipeableRow de HeroUI para cuando se aplica la accion
  de eliminar ya que siento que quita mucho espacio los textos Eliminar y
  Cancelar serie» → #228.
- «En Agregar Recordatorios el boton verde cuando se selecciona el Tipo de
  Recordatorio aparece cortado» → #232.

Cuestionario de opción cerrada (AskUserQuestion), respuestas literales:

| Pregunta | Respuesta | Feature |
|---|---|---|
| Recordatorios pasados y orden | «Próximos + Pasados colapsado (Recommended)» | #227 |
| Cards Familia y Unirme con código | «Lado a lado» | #229 |
| Mapa: ubicación de la mascota | «Pin genérico: quiero avatar» | #230 |
| ¿Firma delegada para estas features? | «Sí, firma delegada (Recommended)» | todas |

Hallazgo del leader, no pedido por el humano pero visto en su misma pantalla de
Perfil: el botón de cámara de la foto aparece al rol family y el backend responde
403 → #235.

## 2. Features

Rutas relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa. Las líneas
son de `6531669f` y caducan al mergear: la spec ancla por contenido.

### 226 `backend-vaccine-catalog-migration` (P1, @Backend)

- Síntoma: Agregar vacuna solo ofrece «Otra vacuna».
- Causa: `vaccine-create/index.tsx` pinta `[...entries, other]` y `entries` llega
  vacío. La tabla del catálogo la crea `backend-pet-tracker` en la migración
  `0009_shallow_dust.sql` sin filas; solo `pnpm seed:vaccines`
  (`backend-pet-tracker/scripts/seed-vaccines.ts`) la llena, y en la base del
  humano nunca se corrió.
- Arreglo: migración de datos que inserta el catálogo del seed, idempotente
  (`ON CONFLICT DO NOTHING` sobre la clave única que use el seed), para que una
  base donde ya se corrió el seed no falle. El seed se conserva o se retira según
  decida la spec, con su motivo.
- Riesgos: `regeneracion-migracion-borra-snapshot-de-dev` y
  `journal-migraciones-desincronizado-vps` (memoria del leader). Nada que toque
  AWS real.
- Paliativo inmediato, opcional para el humano en su PC:
  `pnpm -C backend-pet-tracker run seed:vaccines`.

### 227 `mobile-reminders-upcoming-past` (P1, @Backend, G1)

- Hoy `reminders/index.tsx` lista en el orden que llega del API, con pasados y
  cancelados mezclados. Estados: `scheduled | sent | cancelled`; `sent` se pone
  en `dueAt − advanceMinutes`.
- Decisión: «Próximos» arriba (no cancelados con `dueAt` de hoy en adelante,
  ascendente) y una sección «Pasados» colapsada al final, con el mismo patrón que
  Alertas atendidas (#223).
- Reutilizable: `upcomingReminders` de `home/format.ts`.
- Captura del humano (2026-11-03): arriba salen los pasados atenuados («Enviado»,
  «Cancelado») y debajo los próximos; el resumen dice «3 Inactivos», que son
  justo los que irían a «Pasados».
- Necesita artboard y copy (título de la sección, contador, vacío) en G1.

### 228 `mobile-reminder-swipe-actions` (P2, @Backend, G1, después de #227)

- Hoy cada fila lleva los botones de texto «Eliminar» y «Cancelar serie»
  (#106 R15, ancla `rounded-14 px-2.5`).
- HeroUI Native (1.0.8 instalada) no trae `SwipeableRow`. Se usa
  `ReanimatedSwipeable` de `react-native-gesture-handler/ReanimatedSwipeable`
  (~2.32.0, ya instalada), con una acción de accesibilidad equivalente para quien
  no puede deslizar.
- Enmienda #106 R15 y sus candados. Mismo fichero que #227: va detrás.
- Necesita artboard en G1.

### 229 `mobile-profile-family-join-row` (P1, @Frontend, después de #235)

- Captura del humano (2026-11-03): las dos tarjetas salen a media anchura, en
  filas separadas y **sin texto**, solo el icono y el chevron.
- Causa: `ProfileWideTile` (`profile/index.tsx`) va dentro de un `flex-row`
  (`profile-links-row-2` y `profile-links-row-3`) y su Pressable no lleva
  `flex-1`; el bloque de texto (`flex-1`) no tiene anchura de la que crecer y se
  queda en 0.
- Decisión: una sola fila de dos columnas con el mismo alto, como las filas de
  `ProfileTile` de encima. Sin copy nuevo: se conservan `profile.membersLink`,
  `joinPet.title` y sus subtítulos.
- Sin G1: reutiliza el patrón de fila ya aprobado y la decisión «Lado a lado» del
  humano fija la disposición. El artboard de #214
  (`specs/mobile-pet-members/canvas/PerfilFamilia.dc.html`) dibuja Familia a lo
  ancho: la spec enmienda #214 R4/R6 y lo dice.
- Mismo fichero que #235: va detrás, en la misma sesión.

### 230 `mobile-map-pet-avatar-marker` (P2, @Backend, explorer + G1)

- Hoy `components/pet-map.tsx` usa el pin por defecto; `map/index.tsx` hace
  polling cada 15 s de la última posición.
- Decisión: marcador con la foto o el avatar de la mascota.
- En expo-maps ~57 el `icon` del marcador es una imagen estática: hace falta un
  explorer que diga cómo componer el avatar (imagen pre-renderizada, recorte
  circular, caché) en Android y iOS antes de la spec.
- Solapa con #192 (ping, sin spec): la spec deja escrito el límite entre ambas.
- Explorer: `progress/explore_mobile-map-pet-avatar-marker.md` (rama
  `feature/230-mobile-map-pet-avatar-marker`). Recomienda la opción B2:
  componer el avatar en un `<Svg>` oculto, sacar un PNG con `toDataURL` y
  pasarlo a `useImage` → `icon`. No necesita dependencia nueva ni dev build.
- Spike antes de la spec: código desechable en la rama
  `spike/230-avatar-marker`, que no se mergea. Lo corre el humano en su dev
  build (ver §6, pregunta 5). La spec se escribe con su resultado.
- Decisión del leader para la spec, que no es G1 porque reutiliza boards ya
  aprobados: mientras carga la foto, o si falla o vence el timeout, el marcador
  es el de «sin foto» (blobatar). Antes de la primera composición se ve el pin
  por defecto, para no perder la posición.

### 231 `mobile-welcome-secondary-pressed` (P2, @Frontend)

- `welcome/index.tsx`: «Ya tengo una cuenta» no lleva `variant` y HeroUI le pinta
  el resaltado verde del primario al pulsar. En oscuro, el labio usa `lip-gray`
  `#0A0D12` (`theme/global.css`) y casi no se ve.
- Arreglo: resaltado neutro (`variant="outline"` o
  `animation={{ highlight: false }}`) y borde visible en oscuro.
- Candados: `__tests__/chunky-cta-canvas-fidelity.test.ts` y
  `welcome/index.test.tsx`.

### 232 `mobile-add-reminder-chip-lip-clip` (P2, @Frontend)

- `add-reminder/index.tsx`: los ScrollView horizontales de Tipo y de Aviso
  (`advance-chips-row`) recortan el labio de 3 px (`chunkyLip.primaryCompact`,
  `theme/chunky-lip.ts`) del chip seleccionado.
- Candado afectado: #106 R5 y su test en `add-reminder/index.test.tsx`.

### 233 `mobile-food-links-without-profile` (P2, @Frontend)

- `food/index.tsx` pinta Horario de comidas e Historial de comidas aunque
  `showProfileEmpty` sea cierto.
- Arreglo: sin perfil nutricional no se pintan los dos enlaces.
- Candado afectado: el test de enlaces de `food/index.test.tsx` (flake conocido
  #200 R10 en la misma zona).

### 234 `mobile-nutrition-ai-collapse-flicker` (P1, @Frontend)

- `food/ai-explanation.tsx` mide `food-ai-content` con `onLayout` dentro de su
  propio recorte (`maxHeight` 122 con `overflow-hidden`); `needsClamp` cambia al
  medir y la tarjeta oscila.
- Arreglo: medir el alto natural fuera del recorte (nodo de medida oculto o
  `onTextLayout`), sin cambiar el aspecto aprobado.
- Enmienda #224 R6 (`specs/mobile-nutrition-ai-format/requirements.md`).
- Duda respondida al humano: la tarjeta «Recomendación IA» es la misma
  explicación que se genera con el plan de nutrición.

### 235 `mobile-profile-photo-owner-only` (P2, @Frontend)

- `profile/index.tsx`: `change-photo` no mira el rol; un usuario family pulsa,
  el backend responde 403 y la app dice «No se pudo subir la foto».
- Arreglo: mostrarlo solo al owner, como el resto de acciones de #216.

### 236 `mobile-vaccine-catalog-error-state` (P2, @Backend)

- Hallazgo del leader al especificar #226; el humano pidió abrirlo como
  feature: «si abre como feature nueva» (2026-11-03).
- `vaccine-create/index.tsx` pinta `[...entries, other]`. Si
  `GET /vaccine-catalog` falla, `entries` queda vacío y el selector muestra
  solo «Otra vacuna». No avisa ni deja reintentar: es el mismo síntoma que vio
  el humano, pero con otra causa.
- Arreglo: un estado de error con reintento en el selector, distinto del
  catálogo vacío. Si el estado de error lleva copy nuevo, pasa por G1.

## 3. Reparto y paralelismo

| Sesión | Features | Orden |
|---|---|---|
| @Backend (leader) | #226, #227, #228, #230, #236 | #226 ya; explorer de #230 ya; #227, #228 y #230 tras G1; #228 tras #227; #230 tras su spike; #236 tras #226 |
| @Frontend | #229, #231, #232, #233, #234, #235 | sin G1; #235 antes que #229 |

- Frontend propuso #229, #231, #232 y #235, y toma además #233 y #234. Los
  artboards de G1 los dibuja el leader, único escritor del canvas
  (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j).
- Codex: como mucho 3 a la vez entre las dos sesiones; reparto por defecto,
  2 de Frontend y 1 de @Backend.
- `./init.sh`: uno a la vez entre sesiones, avisando a la otra antes.
- Ficheros compartidos: `profile/index.tsx` (#229 y #235),
  `reminders/index.tsx` (#227 y #228), `food/index.test.tsx` (#233 y #234). Quien
  va detrás mergea `dev` antes del handoff (memoria
  `handoff-tras-merge-de-dependencia`).

## 4. Ciclo por feature

Idéntico a `plan_ui-2026-10-26.md` §4. En el commit de firma va:
`chore(spec): firma delegada #<id> (mandato del humano 2026-10-23, ampliado 2026-11-03)`.

La checklist de firma es la de `plan_canvas-parity-2026-10-23.md` §4 más los tres
puntos de `plan_ui-2026-10-26.md` §4, y dos de este plan:

- [ ] Si la feature arregla un hallazgo del smoke, la spec cita el texto literal
      del humano y su paso de smoke nuevo reproduce el fallo original.
- [ ] Si la spec enmienda un requisito de otra feature (#106 R5, #106 R15,
      #214 R4/R6, #224 R6), lo nombra con su ruta y su R-id, y deja la casilla de
      la enmienda en la spec enmendada.

## 5. Gates humanos

| Gate | Qué | Cuándo | Casilla |
|---|---|---|---|
| G1 | Aprobar los artboards y el copy nuevos de #227, #228 y #230 | Antes de sus specs | este plan, abajo |
| G2 | Smoke en el dev build de Android de las diez features, más el de #224 | En lote, al final (`progress/smoke_mejoras-smoke.md`) | ese fichero |
| G4 | Enmiendas de `docs/ui-guidelines.md` o `docs/conventions.md` | Con la spec que las pida | `specs/<feature>/requirements.md` |
| G5 | Mergear `dev` → `main` | Cuando el humano dé la app por lista | PR en GitHub |

- [x] G1 aprobado por humano: artboards y copy de #227, #228 y #230 (versión del canvas: v167, fecha: 2026-11-03)
      Respuesta literal: «Si apruebo G1». La marcó el leader con el mensaje del
      humano en la mano.

Si #226 necesitara un dev build nuevo o algo que cueste dinero, la spec lo dice y
el humano lo corre; ninguna IA lanza `eas build` ni toca AWS real.

## 6. Preguntas abiertas al humano

1. ~~«Agregar el componente»~~ Respondida el 2026-11-03: «en agregar componente
   es el mismo que decia SwipeableRow». Es el `SwipeableRow` de #228; no hay
   feature nueva. HeroUI Native no trae uno, así que #228 lo construye sobre
   `ReanimatedSwipeable`.
2. ~~G4 de #209, #222 (R12) y #223 (R19)~~ Aprobado el 2026-11-03: «si apruebo
   los cambios». El leader marcó las casillas en `docs/g4-209-222-223`. #209
   pasa a `done`. #222 R12 y #223 R19 quedan desbloqueados, pero siguen sin
   implementar: las dos features siguen `spec_ready` hasta su implementación y
   veredicto del `reviewer`.
3. Paliativo de #226 en el PC del humano: `pnpm -C backend-pet-tracker run seed:vaccines`.
4. ~~G1 de #227, #228 y #230~~ Aprobado el 2026-11-03 sobre el canvas v167:
   «Si apruebo G1». La casilla está en §5.
5. ~~Spike de #230 (opción B2)~~ Respondida el 2026-11-03: «pruebo 230 en el dev
   build». El humano lo corre en su PC sobre el dev build actual, sin rebuild.
   La spec de #230 espera a su resultado. Si falla, queda abierta la elección
   entre E (`react-native-view-shot` y rebuild) y D (miniatura en el backend).
6. ~~Selector de vacunas mudo cuando el catálogo falla~~ Respondida el
   2026-11-03: «si abre como feature nueva». Es #236.

## 7. Fuera de alcance

- Editar o borrar vacunas aplicadas: quedan en el historial de la mascota; si se
  quiere, es una feature aparte.
- Indicador de mascota compartida en el selector de mascotas (salió de la duda
  sobre el rol family): sin pedir.
- Desvincular el collar GPS: ya existe (Perfil → «Collar GPS» → «Desvincular
  collar», solo owner).
- Seguimiento en tiempo real en el mapa: #230 cambia el marcador, no la frecuencia
  de 15 s.
- Cómo se generan las recomendaciones del plan de nutrición: duda respondida en el
  chat, sin cambio.
