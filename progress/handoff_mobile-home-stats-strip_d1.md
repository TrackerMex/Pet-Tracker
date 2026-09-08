# Handoff correctivo a Codex CLI — #69, desbloqueo de D1

> Escrito por el leader el 2026-09-08. Codex paro en R15 por un delta no
> declarado y **hizo lo correcto**: no toco el candado ni ninguna spec aprobada.
> El humano firma la casilla D1 y con eso se reanuda.
> **No corras esto hasta que D1 este firmada** en
> `specs/mobile-home-stats-strip/requirements.md` §Decisiones de implementacion.

---

```
Feature: mobile-home-stats-strip (#69)
Branch: feature/69-mobile-home-stats-strip (la misma; sigue tu historial desde a7d94e2)
Decision firmada: specs/mobile-home-stats-strip/requirements.md §D1

CONTEXTO: paraste bien. R14 y design.md §5 no enumeraban
src/providers/__tests__/language-provider.test.tsx, cuyo candado de longitud de
catalogo cierra en `toHaveLength(260 + 16)` y que `home.weight` -aprobada por
R11- sube a 277. Reportarlo en vez de ajustar la cifra era exactamente lo
pedido. El humano lo ha autorizado y ya puedes continuar.

QUE HACER, y SOLO esto:

1. En src/providers/__tests__/language-provider.test.tsx:41, cambiar
   `expect(englishKeys).toHaveLength(260 + 16)` por
   `expect(englishKeys).toHaveLength(260 + 16 + 1)`.
   - La base historica se conserva VISIBLE COMO SUMA. NO la colapses a un 277
     plano: se perderia la trazabilidad de que feature aporto que.
   - NO toques ninguna otra linea de ese fichero. En particular el
     `expect(spanishKeys).toEqual(englishKeys)` y el bucle de marcadores se
     quedan exactamente como estan.
   - Ese fichero queda anadido a los candados de la feature: menciónalo en el
     informe y en la trazabilidad.

2. Termina lo que quedaba pendiente: R15 y R15b -las SEIS mutaciones, plantadas
   de una en una, con CUATRO de ellas el mismo discriminante en sus cuatro
   sitios-, el init.sh final y el informe.

REGLAS
  - Commit test-primero para el punto 1: el rojo es el candado ya actualizado
    con la clave todavia sin registrar, o el orden inverso si te sale mas
    natural, pero en commits separados y con el rojo visible.
    Formato: fix(mobile-home-stats-strip): <desc> (R11,R14)
  - Ninguna OTRA cifra de ningun candado puede moverse. Si alguna se mueve,
    PARA otra vez y reportalo: hiciste bien la primera vez.
  - Cero ficheros de backend-pet-tracker/ e infra/.
  - Actualiza specs/mobile-home-stats-strip/traceability.md.
  - Al terminar: `env -u FORCE_COLOR ./init.sh` en verde (exit 0) -SIN esa
    variable init.sh aborta en falso, es el bug #75 y no es tuyo-,
    graphify update ., y el informe en
    progress/impl_mobile-home-stats-strip.md con la evidencia de las seis
    mutaciones.
  - NO marques done, NO abras PR, NO mergees.
```

---

## Notas para el humano (no van a Codex)

- **Codex se comporto exactamente como el handoff pedia.** Paro, reporto, y no
  ajusto una cifra de candado por su cuenta. Eso es lo que separa un candado
  vivo de uno decorativo.
- **Es la segunda vez que este candado concreto se omite en una spec**: en #68
  paso igual, con un delta de +16. Queda anotado para el `spec_author`, porque
  el fallo es de la spec, no de la implementacion.
