# Plan: paridad total con el canvas (2026-10-23)

> Objetivo del humano: «terminar la app tal como está en el artifact Pet Tracker:
> propuesta de UI», más rápido que hasta ahora. Escrito por el leader el
> 2026-10-23 sobre `origin/main` = `922a4036`.

## 0. Mandato y lo que cambia

El 2026-10-23 el humano delegó en el leader «todo mi permiso» para trabajar
frontend y backend, **aprobar las specs** por él, lanzar subagentes y Codex
eligiendo modelos caros o baratos, y abrir paneles de herdr para Codex.

| Cambia | No cambia |
|---|---|
| El gate de la spec lo firma el leader (§4, checklist de firma) | El gate del `reviewer`: sin «aprobado» no hay `done` |
| El leader lanza Codex él mismo en un panel de herdr | Una feature = un branch = un worktree = una PR |
| Las specs firmadas por el leader no se espejan a Notion | Nada que cree recursos AWS reales; eso lo corre el humano |
| El smoke en dispositivo va por lotes (§6) | Copy en Voz B; los extras X01-X17 y los estados no dibujados se quedan |
| Las PRs del plan van a `dev` y el leader las mergea (ver abajo) | Codex carga las skills por **sus** nombres (`leader.md` §Catálogo) |
| | `dev` → `main` lo mergea el humano |

**Rama de integración `dev`** (decisión del humano, 2026-10-23): todo el plan
aterriza en `dev`, creada desde `origin/main` = `922a4036`. Cada feature abre su
PR con `--base dev` y el leader la mergea con `gh pr merge --merge` cuando CI
está verde y el `reviewer` dio «aprobado». Cuando el humano revise que la app
está lista, él abre y mergea `dev` → `main`.

## 1. Fuente de verdad

- **Canvas** `https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j`, versión
  `1792777983-cd94` (2026-10-23). Tiene 55 artboards: los 24 originales (con la
  Bienvenida) y 31 de estados.
- **Cada spec congela sus artboards** en `specs/<feature>/canvas/`, como ya hizo
  `mobile-account-screens-polish`. Codex y el `reviewer` leen esa copia, nunca el
  canvas vivo.
- **Auditoría base**: `progress/explore_canvas-parity-2026-10-21.md`. Sus ids de
  fila (Z/E/W/S/M/N/I/Q) y de candidata (C01-C18) se citan en las specs. Los
  recuentos y las líneas caducan: se re-miden al escribir cada spec.
- **Precedencia**: el canvas manda en lo visual y el movimiento. El copy sigue
  la Voz B de Pingo. Lo que el canvas no dibuja se conserva.

## 2. Features

Las rutas son relativas a `mobile-pet-tracker/src/`.

| Ola | id | name | Artboards | Cubre | Depende de |
|---|---|---|---|---|---|
| 1 | 197 | `mobile-canvas-foundations` | ninguno propio | C01 tokens claros, C02 tipografía + barrido `tracking-tight`, C03 variantes de labio + los 5 `border-b-N`, C04 componente `Switch` (sin cablear), C05 `rise` común, C06 componente de cabecera en contenido (sin cablear) + enmienda de la carta, C07 sombras | — |
| 2 | 198 | `mobile-canvas-home` | Inicio, InicioCarga, InicioError, InicioSinCollar, InicioActividad, InicioRecordatorios, InicioVacio | C13, C14 | 197 |
| 2 | 199 | `mobile-canvas-health-weight` | Salud, SaludEstados, SaludSinMascota, Peso, PesoEstados, PesoRegistrado | C08, C09 | 197 |
| 2 | 200 | `mobile-canvas-nutrition` | Nutricion, NutricionAvisos, HorarioComidas, HistorialComidas | C10, C11 | 197 |
| 2 | 201 | `mobile-canvas-map` | Mapa, MapaCarga, MapaError, MapaSinMascotas, MapaSinRastreo, MapaSinUbicacion, MapaModoPerdidoError | C15 (sin el ping, que es #192) | 197 |
| 2 | 202 | `mobile-canvas-zones` | Zonas, ZonasEliminar, ZonasVacio, ZonasSinCollar, ZonasSoloLectura, ZonasEstados, EditorZona, EditorZonaEstados, EditorZonaSoloLectura, EditorZonaNueva, EditorZonaError | A-189 | 197 |
| 2 | 196 | `mobile-profile-photo-hero-canvas` (ampliada) | Perfil, PerfilCuenta, PerfilNotificaciones | hero de Perfil + C18 (parte Perfil) | 197 |
| 2 | 203 | `mobile-canvas-collar-alerts` | Vincular, VincularVinculado, VincularDesvincular, Celebracion, Alertas, DetalleAlerta | C18 (Celebración) | 197 |
| 2 | 204 | `mobile-canvas-routine` | Recordatorios, NuevoRecordatorio, Documentos | C18 (Recordatorios) | 197 |
| 2 | 205 | `mobile-canvas-account-flow` | Main, Login, Registro, Recuperar, RecuperarEnviado, NuevaContrasena, NuevaMascota, NuevaMascota2 | C17 | 197 |
| 2 | 206 | `mobile-canvas-tab-bar` | barra en los artboards de pestaña | C16 | 197 |
| 3 | 192 | `mobile-map-marker-ping` | Mapa (ping), EditorZona (breathe) | A-192 | spike en dispositivo del humano |

Las 55 artboards quedan asignadas. C12 lo cerró #195.

**Cablear es de cada pantalla.** #197 crea el `Switch` y la cabecera sin
tocarlas. Cada feature de la ola 2 pone `headerShown: false` en **sus** rutas de
`app/_layout.tsx` y usa los componentes. Así #197 no pisa ninguna pantalla y la
ola 2 no se pisa entre sí más que en los catálogos compartidos (§3).

**Deuda que roza.** #144 y #154 rozan Inicio, #151 el Mapa y #165 las Alertas.
El `spec_author` de la pantalla decide: si su reescritura de tests las cubre,
las absorbe en la spec y se cierran con ella; si no, siguen `pending`. Las
demás pendientes (#60, #129, #150, #160, #163, #164) van a un carril de deuda
**después** de la paridad.

## 3. Olas y paralelismo

- **Ola 1**: #197 sola. Mientras Codex la implementa, el `spec_author` escribe
  las specs de las tres primeras de la ola 2 contra la spec firmada de #197.
- **Ola 2**: como mucho **3 Codex a la vez**. Con más, jest da timeouts falsos
  (memoria `jest-timeout-por-carga-entre-codex`). Orden:
  1. #198, #199, #200 (las tres dependen solo de #197)
  2. #201 (tras #198: consume su API de ranuras de `EmptyState`), #202, #196
  3. #203, #204, #205, #206

  Ajuste del 2026-10-23: `RiseIn` pasó de #199 a #197 R24, así que #199, #200 y
  #202 ya no se esperan entre sí. #201 va detrás de #198 porque comparte
  `EmptyState`.

**Candado temporal `#197 R20`** (`describe('#197 R20: cimientos sin cablear')`
en `canvas-foundations.test.ts`): toda feature de la ola 2 lo **borra entero**
en su primer commit rojo que monte un cimiento o toque `_layout.tsx`. El
borrado es idéntico en todas, así que git lo mezcla sin conflicto; nadie lo
enmienda a su manera.

**Inventario de `motion.ts`** (MT `no exporta nada más`): #199 suma 7
exportaciones y #200 suma 2. La segunda en mergear conserva las de la primera.
- **Ola 3**: el spike de #192, en el dev build del humano, y el lote final de
  smoke.

**Choques previstos entre features paralelas**: solo en ficheros compartidos
por diseño: `i18n/catalog.ts`, la tabla de copy, `SCREEN_FILES`, las líneas de
`app/_layout.tsx` y la lista de exportaciones de `motion.ts`.
- La segunda PR en llegar mergea `origin/dev` en su branch. **Nunca rebase**
  después de la trazabilidad (memoria `rebase-invalida-hashes-traceability`).
- El conflicto lo resuelve el mismo Codex de la feature, con un prompt corto
  del leader.

**Spec escrita antes de que su dependencia esté en `dev`**: al mergear #197,
el leader re-mide las anclas de cada spec de la ola 2 antes del handoff
(memoria `spec-aprobada-caduca-al-mergear-su-dependencia`). Si alguna caducó,
se enmienda y se vuelve a firmar.

## 4. Ciclo por feature

1. **Worktree**:
   - `git worktree add /home/claude/sites/Pet-Tracker-wt-<id> -b feature/<id>-<name> origin/dev`
   - Copiar `.env`.
   - `bun install --frozen-lockfile` en `mobile-pet-tracker/`.
2. **Spec**: `spec_author` en ese worktree. Escribe la spec EARS, congela los
   artboards en `specs/<feature>/canvas/` y devuelve solo la ruta.
3. **Firma delegada**: el leader pasa la checklist de abajo. Luego pone el
   frontmatter en `approved` y hace un commit propio:
   `chore(spec): firma delegada #<id> (mandato del humano 2026-10-23)`.
   Si algo falla, devuelve la spec al `spec_author` con la lista de fallos.
4. **Handoff**: `progress/handoff_<feature>.md` con la plantilla de
   `leader.md` §Handoff a Codex CLI.
5. **Codex en herdr**:
   - Crear un panel con `cwd` = worktree.
   - `herdr agent start codex-<id> --kind codex --pane <pane>`.
   - Prompt: «Lee y ejecuta progress/handoff_<feature>.md».
   - En segundo plano: `scripts/harness/watch-impl.sh <worktree>/progress/impl_<feature>.done leader`.
6. **Review**: al aviso, el `reviewer` escribe `progress/review_<feature>.md`.
   El leader corre `./init.sh` (al reviewer se lo deniega el clasificador),
   uno a la vez y guardando el log entero.
7. **Cierre**:
   - Con «aprobado»: `done`, `STATUS.md`, `history.md`, push y
     `gh pr create --base dev`. Con CI verde, el leader la mergea:
     `gh pr merge <n> --merge`.
   - Con «rechazado»: handoff de corrección al mismo agente de Codex.
8. **Tras el merge en `dev`**: `git worktree remove` sin `--force` y
   `git branch -d`.

### Checklist de firma delegada

La firma del humano atrapaba los fallos que el `reviewer` descubre tarde. La
checklist cubre los que más mordieron, según la memoria del proyecto:

- [ ] Cada ancla de fichero o símbolo existe en el árbol: `grep -cF` con la
      cifra esperada. Ninguna depende de un número de línea.
- [ ] Cada R-id tiene un test nombrado que lo prueba y una fila en
      `traceability.md`.
- [ ] Los candados no son tautológicos: comparan contra un literal o un valor
      del canvas, no contra el símbolo importado de producción.
- [ ] Toda clase o fila nueva está contada contra los guards de la carta
      (`design-drift`, `legibility-classnames`, `ui-copy-table`, `SCREEN_FILES`).
- [ ] El copy se da literal desde el R-id y en Voz B.
- [ ] Los artboards están congelados en `specs/<feature>/canvas/`.
- [ ] Ninguna decisión queda abierta. Las que eran del humano llevan la decisión
      del leader y su porqué en §Decisiones.
- [ ] No hay costo nuevo ni dependencia nueva que la spec no declare.

## 5. Modelos

| Papel | Modelo | Por qué |
|---|---|---|
| `spec_author` | Opus (hereda) | Codex no ve la conversación: la spec tiene que ser autosuficiente |
| `reviewer` | Opus (hereda) | Es el único gate que queda sin humano |
| `explorer` y localizaciones | Sonnet o `cavecrew-investigator` | Lectura pura; barato |
| Codex, pantallas (#198-#205, #196) | `gpt-6.1-sol`, `xhigh` (config por defecto) | Pantallas con muchos estados y candados |
| Codex, #197 y #206 | `gpt-6.1-sol`, `-c model_reasoning_effort=high` | Tokens y un componente; menos razonamiento |
| `implementer` (fallback) | Sonnet | Solo cambios de una línea o con Codex caído |

## 6. Smoke en dispositivo

El smoke se corre en el dev build de Android del humano, no en la VPS. Para no
bloquear cada PR, va **por lotes**. Cada feature apunta lo que solo se ve en el
teléfono (sombras, desenfoque, hápticos, marcador) en
`progress/smoke_canvas-parity.md`. El humano lo recorre al final de cada ola.
Lo que falle abre una feature de arreglo. El `done` de cada feature no espera al
smoke.

## 7. Riesgos

- **Choques en los catálogos compartidos**: ver §3.
- **Specs caducadas al mergear #197**: re-medir antes del handoff (§3).
- **Skills de Codex con otros nombres**: el handoff nombra las del catálogo de
  Codex y le pide decir cuáles cargó.
- **jest bajo carga**: máximo 3 Codex y un solo `init.sh` a la vez
  (memorias `init-sh-concurrente-worktrees` y `pgrep-se-encuentra-a-si-mismo`).
- **Lo que el `reviewer` no puede ver**: va al lote de smoke (§6).

## 8. Prompt mejorado y `/goal`

El prompt original, reescrito para que se pueda verificar:

> Termina la app móvil para que quede igual al canvas «Pet Tracker: propuesta de
> UI» (versión 1792777983-cd94), siguiendo
> `progress/plan_canvas-parity-2026-10-23.md`. Puedes firmar tú las specs con la
> checklist de firma delegada. Implementa con Codex en paneles de herdr, como
> mucho 3 a la vez. Cada feature cierra con veredicto aprobado del `reviewer`,
> `./init.sh` verde y su PR mergeada en `dev`. No crees recursos AWS reales. El
> copy sigue la Voz B. El merge de `dev` a `main` lo hago yo.

`/goal` para pegar:

```
/goal Las features #196 a #206 de feature_list.json están en done y sus PRs mergeadas en dev, cada una con veredicto aprobado del reviewer y CI verde, siguiendo progress/plan_canvas-parity-2026-10-23.md. Firma tú las specs y mergea tú cada PR a dev. El merge de dev a main lo hago yo.
```
