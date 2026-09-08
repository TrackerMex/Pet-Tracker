# Handoff a Codex CLI — #68, tres apuntes del tercer veredicto

> Escrito por el leader el 2026-09-08. El reviewer **aprobo** la sustitucion del
> selector y las tabs animadas. Estos tres apuntes son NO BLOQUEANTES, pero dos
> son deuda real y el tercero es basura que sobra. Ninguno toca la logica de la
> grafica.

---

```
Feature: mobile-home-weekly-activity (#68)
Branch: feature/68-mobile-home-weekly-activity (la misma; sigue tu historial)
Origen: progress/review_mobile-home-weekly-activity.md, tercera seccion,
        observaciones 1, 2 y 4.

--------------------------------------------------------------------
1 — El grupo del selector no se anuncia como grupo, y nada lo vigila
--------------------------------------------------------------------
Fichero: src/screens/home/weekly-activity-chart.tsx:325-328

El contenedor de las tres opciones no declara `accessibilityRole="radiogroup"`.
Cada `Pressable` si tiene su rol `radio` y su `accessibilityState.selected`,
pero sin el rol de grupo TalkBack no anuncia "1 de 3" ni que las tres opciones
forman un conjunto: las lee como tres controles sueltos.

Y ademas no hay candado: el reviewer planto `accessible` +
`accessibilityLabel` en ese mismo contenedor -que en dispositivo COLAPSA los
tres radios en un solo nodo, exactamente lo que R9 prohibe para el contenedor
de las columnas- y la suite se quedo 36/36 en verde.

Que hacer:
  - anadir `accessibilityRole="radiogroup"` al contenedor;
  - candado test-primero que (a) exija ese rol y (b) FALLE si el contenedor
    recibe `accessible` o `accessibilityLabel`, que es lo que colapsaria el
    subarbol. El segundo es el importante: es el mismo tipo de candado que R9
    ya tiene para el contenedor de las siete columnas, asi que copia ese
    patron en vez de inventar otro.

--------------------------------------------------------------------
2 — `minimumFontScale={0.85}` es inerte en Android
--------------------------------------------------------------------
Fichero: el mismo, en las etiquetas del selector.

`adjustsFontSizeToFit` SI funciona en Android en RN 0.86.2 -esta implementado
en `TextLayoutManager.adjustSpannableFontToFit()`; el tipado iOS-only de
TypeScript esta desactualizado-. Lo inerte es el SUELO: Android lee
`minimumFontSize` (`TextLayoutManager.kt:841-844` via `conversions.h:1155`), y
`<Text>` no expone ese prop. `minimumFontScale` no llega, asi que el suelo real
en Android es **4 dp**: el texto puede encogerse hasta ser ilegible en vez de
pararse en el 85% que la linea aparenta prometer.

Quitar la linea deja la suite 36/36, o sea que tampoco hay candado.

Que hacer: NO te limites a borrarla. Decide y justifica en el informe una de
las dos, y deja candado de lo que elijas:
  (a) borrarla y poner un suelo real por otra via -por ejemplo un tamano de
      fuente minimo explicito, o un ancho reservado por opcion-, o
  (b) conservarla SOLO si documentas en un comentario que en Android no aplica
      y por que se acepta.
Lo que no vale es dejar una linea que aparenta un suelo que no existe.

--------------------------------------------------------------------
4 — Andamiaje muerto
--------------------------------------------------------------------
Fichero: src/screens/home/weekly-activity-chart.test.tsx:53-56

El `jest.mock('uniwind')` sobra desde que el SegmentedControl se fue. Quitarlo
deja la suite 36/36. Borralo.

--------------------------------------------------------------------
REGLAS
--------------------------------------------------------------------
  - Commits test-primero: rojo antes que verde, en commits separados.
    Formato: fix(mobile-home-weekly-activity): <desc> (R6) / (R9)
  - Cero ficheros de backend-pet-tracker/ e infra/.
  - Ninguna cifra de ningun candado puede moverse. Si alguna se mueve, PARA y
    reportalo.
  - Grep-clean intacto.
  - Actualiza specs/mobile-home-weekly-activity/traceability.md.
  - Al terminar: ./init.sh en verde (exit 0), graphify update ., y anade al
    informe una seccion "Apuntes del tercer veredicto" con lo que cambiaste y
    la decision razonada del punto 2.
  - NO marques done, NO abras PR, NO mergees.

OJO CON init.sh: el reviewer encontro que `init.sh:127-148` se rompe si hay
`FORCE_COLOR` en el entorno -compara por cadena un numero que Node colorea, y
falla con "Mas de 1 feature en in_progress (1)" habiendo una sola-. Si te pasa,
NO es tuyo y NO lo arregles dentro de #68: reportalo y corre sin esa variable.
```

---

## Notas para el humano (no van a Codex)

- Los tres son no bloqueantes: el reviewer **aprobó**. Puedes correr esto antes
  o después del re-smoke; si lo corres antes, el re-smoke ya cubre el selector
  con el `radiogroup` puesto y te ahorras una pasada de TalkBack.
- El punto 2 puede cambiar lo que ves: si el suelo real es 4 dp, "Minutos
  activos" podría estar encogiéndose más de lo que crees en pantallas estrechas
  en vez de pararse en el 85%.
