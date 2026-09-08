# Handoff a Codex CLI — #68, dos defectos del smoke humano

> Escrito por el leader el 2026-09-08. El humano corrio el smoke en dev build de
> Android y encontro dos defectos visuales en el selector de metrica. Los dos
> tienen causa diagnosticada y precedente en el repo.

---

```
Feature: mobile-home-weekly-activity (#68)
Branch: feature/68-mobile-home-weekly-activity (la misma; sigue tu historial)
Origen: smoke humano en dev build de Android, 2026-09-08

DOS DEFECTOS. Los dos en el selector de metrica de
src/screens/home/weekly-activity-chart.tsx:376-382, que usa el
SegmentedControl de @expo/ui/community/segmented-control.

--------------------------------------------------------------------
DEFECTO 1 — El tema oscuro no llega a las etiquetas del selector
--------------------------------------------------------------------
Causa: al SegmentedControl se le pasa `tintColor` pero NUNCA `appearance`. Ese
prop existe en SegmentedControlProps y su doc dice literalmente "Overrides the
control's appearance irrespective of the system theme". Sin el, el control
nativo sigue el tema DEL SISTEMA, no el de la app -que tiene su propio
interruptor en src/utils/theme-preference.ts-. Cuando el usuario pone la app en
oscuro y el sistema esta en claro, o al reves, las etiquetas se quedan mal.

Arreglo, con precedente exacto en el repo: src/app/(tabs)/map.tsx:84 y :262
hacen ya esto mismo para el mapa.

  const { theme } = useUniwind();   // import { useUniwind } from 'uniwind'
  ...
  <SegmentedControl
    ...
    appearance={theme === 'dark' ? 'dark' : 'light'}
  />

Sigue el precedente de map.tsx al pie de la letra, incluida la comparacion
explicita contra 'dark' en vez de un cast.

--------------------------------------------------------------------
DEFECTO 2 — Las etiquetas largas saltan de linea y ese boton crece
--------------------------------------------------------------------
Sintoma del humano: "Minutos Activos, Distancia recorrida, Paseos no encajan
bien en los tamanos, hay textos mas grandes y dan el salto de linea, el boton
queda mas grande".

Causa: SegmentedControlProps NO tiene tamano de fuente, ni numberOfLines, ni
estilo por etiqueta -lo verifique en los tipos vendorizados-. Asi que el
control no se puede ajustar desde fuera: lo que sobra es el texto. Y el texto
espanol es gratuitamente mas largo que su par ingles:

  src/i18n/catalog.ts:49   en  'weeklyActivity.metricDistance': 'Distance'
  src/i18n/catalog.ts:330  es  'weeklyActivity.metricDistance': 'Distancia recorrida'

Arreglo: el valor espanol pasa a 'Distancia'. Es el par exacto del ingles, dice
lo mismo en este contexto -el eje ya deja claro que es de la semana- y quita la
etiqueta mas larga de las tres.

IMPORTANTE, y esto decide el resto del arreglo: mide DESPUES de ese cambio, en
el dev build, si 'Minutos activos' -la mas larga que queda- sigue saltando de
linea en la pantalla mas estrecha que soporte el proyecto.
  - Si YA NO salta: has terminado, no toques nada mas.
  - Si SIGUE saltando: PARA Y REPORTALO. No acortes 'Minutos activos' por tu
    cuenta -perderia significado, y su par ingles 'Active minutes' tambien son
    dos palabras, asi que la asimetria que justifica el cambio de 'Distancia'
    aqui no existe-. Y NO sustituyas el SegmentedControl por un control propio
    sin que el humano lo decida: es cambio de componente, no arreglo de copy, y
    se lleva por delante la accesibilidad nativa que R9 apoya. Escribe en el
    informe que hace falta esa decision y para.

--------------------------------------------------------------------
TESTS
--------------------------------------------------------------------
Los dos arreglos llevan candado, test primero:
  - Defecto 1: un it que compruebe que el SegmentedControl recibe
    appearance='dark' cuando el tema es oscuro y 'light' cuando es claro. Mockea
    useUniwind como ya se hace en los tests que cubren map.tsx o
    floating-tab-bar.tsx -copia ese patron, no inventes otro-. Sin este candado
    el prop se cae en el proximo refactor sin que nada se entere: es
    exactamente el tipo de regresion invisible que se te escapo antes.
  - Defecto 2: el candado de copy de #65 ya cubre que la clave exista en los
    dos idiomas. Comprueba que cambiar un VALOR -no anadir clave- no mueve
    ninguna cifra de ui-language.test.ts ni de ui-copy-table.ts. Si alguna se
    mueve, PARA y reportalo en vez de ajustarla.

REGLAS
  - Commits test-primero, en dos commits por defecto: rojo y verde.
    Formato: fix(mobile-home-weekly-activity): <desc> (R6) / (R9)
  - Cero ficheros de backend-pet-tracker/ e infra/.
  - Ningun otro candado puede moverse. Si alguno se mueve, para y reporta.
  - Grep-clean intacto.
  - Actualiza specs/mobile-home-weekly-activity/traceability.md.
  - Al terminar: ./init.sh en verde (exit 0), graphify update ., y anade al
    informe progress/impl_mobile-home-weekly-activity.md una seccion
    "Defectos del smoke" con lo que cambiaste y lo que MEDISTE en el punto 2.
  - NO marques done, NO abras PR, NO mergees.
```

---

## Notas para el humano (no van a Codex)

- El `appearance` es la causa raiz, no un parche: mientras no se pase, el
  selector seguira el tema del sistema aunque la app este en el contrario. Si
  al probarlo el sistema y la app coincidian, el defecto estaba igual pero
  invisible.
- Si tras acortar "Distancia recorrida" sigue saltando "Minutos activos", la
  decision es tuya: o se acepta el salto, o se cambia el `SegmentedControl` por
  un control propio con tokens. Lo segundo es mas trabajo y toca la
  accesibilidad que R9 apoya, asi que no lo doy por hecho.
- Pendiente de revision: D1(b) -el boton acentuado- ya lo implemento Codex en
  `1e8a2f0`, `705daea` y `f4543dd`, y todavia no lo ha visto el reviewer. Lo
  revisara junto con estos dos arreglos en una sola pasada.
