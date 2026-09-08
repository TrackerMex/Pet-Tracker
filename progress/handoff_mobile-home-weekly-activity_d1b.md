# Handoff a Codex CLI — #68, D1 opcion (b): boton de mapa a accion acentuada

> Escrito por el leader el 2026-09-08. El humano firmo la opcion **(b)** de la
> casilla D1: el boton de mapa vuelve a accion acentuada, y el inventario de
> botones primarios de #62 R1 sube de 12 a 13 **con enmienda firmada**.
> **No corras esto hasta que el humano haya firmado la casilla de E2** en
> `specs/mobile-home-weekly-activity/requirements.md:770`.

---

```
Feature: mobile-home-weekly-activity (#68)
Branch: feature/68-mobile-home-weekly-activity (la misma; sigue tu historial)
Decision firmada: specs/mobile-home-weekly-activity/requirements.md §D1 opcion (b)
Enmienda que la habilita: la misma spec, §E2

QUE HAY QUE HACER, y es pequeno:

1. El boton que abre el mapa desde el detalle del dia vuelve a accion
   acentuada. Hoy esta en src/screens/home/index.tsx:377-379 como
   variant="secondary" con className="min-h-11 w-full rounded-xl bg-default" y
   text-foreground. Pasa a ser el boton primario solido del repo:
   `rounded-xl bg-accent` con `text-accent-foreground`, siguiendo exactamente
   la misma grafia que los doce que ya existen -el candado busca la cadena
   literal `rounded-xl bg-accent` seguida de espacio o comilla-.
   Conserva `min-h-11` (area tactil de #61 R10), el testID, el copy y el
   router.push('/map'). El boton sigue apareciendo SOLO para el dia de hoy.

2. El candado de #62 R1 sube de 12 a 13:
   src/__tests__/consistency-classnames.test.ts:97-103,
   it('deja los doce botones primarios solidos en un unico radio').
   - `expect(primaryRadius).toHaveLength(12)` pasa a 13.
   - Renombra el `it` a "los trece botones primarios solidos en un unico radio".
   - La SEGUNDA asercion NO se toca y tiene que seguir en cero:
     `expect(filesMatching(/rounded-2xl bg-accent(?=[\s'"`])/)).toEqual([])`.
     El boton nuevo nace con rounded-xl, asi que eso se cumple solo.

3. Aplica el texto de la enmienda E2 a la spec de #62:
   specs/mobile-ui-consistency-polish/requirements.md R1 (:81-88): donde dice
   "cualquiera de los **12** botones primarios solidos de acento" pasa a decir
   **13**. NO toques nada mas de esa spec: ni su estado de aprobacion, ni el
   resto de sus requisitos, ni las 4 ocurrencias de rounded-2xl que R1 enumera
   como ya corregidas.

4. Actualiza tambien la enumeracion de design.md §4 R1 de #62 si esa lista
   nombra los doce botones uno a uno: anade el de #68. Si no los enumera,
   dilo en el informe y no inventes una lista.

REGLAS
  - Commits test-primero: el rojo del candado a 13 ANTES del verde del boton,
    o al reves si te sale mas natural, pero en dos commits separados y con el
    rojo visible. Formato: fix(mobile-home-weekly-activity): <desc> (D1,E2)
  - Cero ficheros de backend-pet-tracker/ e infra/.
  - Ningun otro candado puede moverse. Si al subir el boton a bg-accent se
    mueve algun OTRO inventario -acento como tinta, legibilidad, contraste-,
    PARA y reportalo en vez de ajustar su cifra.
  - Grep-clean intacto: cero hex, cero clases arbitrarias.
  - Actualiza specs/mobile-home-weekly-activity/traceability.md.
  - Al terminar: ./init.sh en verde (exit 0), graphify update ., y anade al
    informe progress/impl_mobile-home-weekly-activity.md una seccion
    "D1 opcion (b)" con lo que cambiaste y la salida de la suite.
  - NO marques done, NO abras PR, NO mergees.
```

---

## Notas para el humano (no van a Codex)

- **Firma E2 antes de correr esto.** La casilla esta en
  `specs/mobile-home-weekly-activity/requirements.md:770`. Sin ella, Codex
  estaria cambiando el candado de una spec aprobada sin autorizacion, que es
  justo lo que R19 prohibe.
- El contraste ya esta calculado y pasa: el boton primario solido de acento es
  el patron que el repo usa en otros doce sitios y el reviewer valido sus
  parejas en la revision anterior.
- Cuando Codex termine, el leader relanza el `reviewer` para verificar que solo
  se movio ese inventario y que ningun otro candado bajo.
