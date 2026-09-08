---
feature: "mobile-home-stats-strip"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-home-stats-strip]]

Rutas relativas a `mobile-pet-tracker/`. La columna **Test** la **prescribe la
spec** (no la improvisa el implementer): es el contrato de qué prueba cada R-id.
La columna **Commit** la rellena el implementer en cuanto ese requisito queda
verde, nunca al final.

Dos abreviaturas para no repetir rutas largas:
`HOME` = `src/screens/home/index.test.tsx`;
`STRIP` = `HOME`::`describe('#69 R1: la tira de hoy tiene cuatro celdas con tres divisores')`.

| Requisito | Test (archivo::nombre) — prescrito por la spec | Commit (hash + mensaje) |
|---|---|---|
| R1 | `STRIP` (3 `it`: los cuatro `testID` en el orden del árbol; **3** `border-r border-border` en la fila; la fila sin `gap-3` ni `justify-between`) | pendiente |
| R2 | `src/screens/home/format.test.ts`::`describe('#69 R2: fmtKg')` (3 `it`: `null → '—'`, `12 → '12 kg'`, `12.4 → '12.4 kg'`) + `STRIP`::`it('degrada el peso a un guion cuando el perfil no resuelve')`, con `mockGetPet` en `{ kind: 'unreachable' }` y la fila de cuatro intacta | pendiente |
| R3 | `STRIP`::`it('asigna cada valor a su celda y a ninguna otra')`, con la fixture de cuatro valores **distintos entre sí** (`'12.4 kg'`, `'1h 35m'`, `'45m'`, `'2.4 km'`). **Es el único candado que mata las mutaciones 1-4 de R15b**; si alguna de las cuatro deja la suite verde, este `it` está mal escrito y se arregla antes de seguir | pendiente |
| R4 | `STRIP`::`it('conserva el descanso como celda siempre visible')`, que exige `summary-sleep` visible y etiquetado `Descanso` **sin tocar ninguna barra de la gráfica** — la diferencia con `weekly-activity-detail-rest`, que solo existe tras un toque | pendiente |
| R5 | `STRIP`::`it('no repite los paseos dentro de la tira')` (`queryByTestId('summary-walks')` a `null`; `summary-card` sin el texto de `t('home.walks')`; `pet-hero-highlight-value` con el recuento del día) + `HOME`::`describe('R7: el hero pinta los paseos de hoy')` (`:944-1002`, de #67) **en verde y sin tocar** | pendiente |
| R6 | `STRIP`::`it('coloca la tira sobre la tarjeta del collar')`, que espera `['summary-card','collar-card','weekly-activity-card','last-position-card']` tras filtrar los hijos de `home-content` + `HOME`::`it('queda entre el resumen y la última posición en el árbol')` (`:1121-1150`, de #68) **en verde y sin tocar** | pendiente |
| R7 | `HOME`::`describe('R9: summary degrada con gracia')` (`:441-560`) con los cinco `it` existentes **verdes y sin debilitar**, `it('shows dashes instead of zero for missing metrics')` ampliado a `summary-weight`, y el `it` nuevo de `mockGetPet` en `unreachable` | pendiente |
| R8 | `STRIP`::`it('no añade ninguna llamada a la API')`, que compara el recuento de `mockGetPet` y `mockGetDailyActivity` con el escenario equivalente. Verificación adicional del reviewer: `git diff --stat` sin ficheros fuera de `mobile-pet-tracker/` y `specs/` | pendiente |
| R9 | `STRIP`::`it('usa iconos de reicon y ningún emoji')`, leyendo el fuente con `readFileSync`: import de `Weight`, cuatro usos `size={20} color={muted}`, ausencia de `⚖️ ⚡ 🦮 📍` + `src/__tests__/consistency-classnames.test.ts:186-217` (#62 R7) y `legibility-classnames.test.ts:145-149` (#61 R4, sin `useThemeColors(['accent'])`) en verde | pendiente |
| R10 | `src/__tests__/consistency-classnames.test.ts:334-358` (#62 R15): fila `screens/home/index.tsx` a **5** y total cerrado `14 + 4 + 1`. Y `:269-332` (#62 R14) **sin cambio**: la Home sigue con 1 `CONTINUOUS_CORNER` | pendiente |
| R11 | `src/__tests__/ui-language.test.ts` (candados de #65: una clave presente en un idioma y ausente en el otro no compila, `:348`; `checkUses(R3_HOME)` exige una fila por llamada) + la fila nueva en `ui-copy-table.ts:45-82` + el registro en `specs/mobile-ui-language/design.md` §2 | pendiente |
| R12 | `STRIP`::`it('deja que cada celda se anuncie por separado')`: la fila contenedora sin `accessible` ni `accessibilityLabel`, los cuatro `Text` de valor alcanzables, y ninguna celda `Pressable` | pendiente |
| R13 | `src/__tests__/design-drift.test.ts`::`describe('#69 R13: la tira de estadísticas no mete drift de estilo')`, sobre la lista nominal de los cinco ficheros de esta feature. **Candado de cadena literal, no de conducta**, y así está declarado en [[requirements]] R13 | pendiente |
| R14 | Los deltas de la tabla de [[requirements]] R14, verificados por el reviewer **rehaciendo cada `grep`**, no leyendo el informe del implementer. Esta feature **no reubica nada**: si aparece una reubicación, alguien está moviendo un fichero que no toca | pendiente |
| R15 | Requisito de **verificación** (C4 vía (b)): `bun run test` y `bun run typecheck` verdes desde `mobile-pet-tracker/`, grep-clean de la carta §Decisiones fijas 3 intacto y escala de radios de #62 R4 sin clase fuera de escala | pendiente |
| R15b | Las **seis** mutaciones de [[tasks]] §R15 (2), plantadas de una en una, con la evidencia en `progress/impl_mobile-home-stats-strip.md` §prueba de mutación. Las **cuatro primeras** son un mismo discriminante en cuatro sitios: el criterio de aceptación es que las cuatro pongan la suite roja **por separado** | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" en la columna
Commit.
Convención de commit: `feat(mobile-home-stats-strip): <desc> (R1,R3)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**Fuera de esta tabla y no delegable a IA**: el gate humano de smoke en dev
build de Android (nunca Expo Go), en tema claro y oscuro, comprobando que la
tira va pegada bajo el hero y sobre la tarjeta del collar; que las cuatro celdas
caben en una línea sin truncar en la pantalla más estrecha, con `12.4 kg` y
`1h 35m`; que los tres divisores se ven en los dos temas; que una mascota sin
peso registrado pinta `—` sin romper la fila; que los paseos salen **solo** en
el hero; que el descanso sigue visible sin tocar nada; y que TalkBack anuncia
las cuatro celdas por separado. Guion completo en [[requirements]] §Aprobación.
Sin él la feature no pasa a `done`, tenga la tabla las filas que tenga.
