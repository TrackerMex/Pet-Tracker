# Handoff de corrección a Codex CLI — #87 `mobile-tanstack-query` (ronda 2)

> Escrito por el leader el 2026-09-10, tras el veredicto **RECHAZADO** del
> reviewer en `progress/review_mobile-tanstack-query.md`.
> El humano corre Codex CLI en su terminal con el prompt de abajo.

## Resumen del veredicto

La migración en sí está **limpia**: cero aserciones relajadas (23 removals
auditadas una a una), los seis candados numéricos con delta 0, `signOut` 9/7 con
delta 0, dependencia con pin exacto y solo su transitiva, los tres deltas de
conducta autorizados y ninguno más, TDD alternando rojo→verde en los 40 commits,
y la mutación de R20 reproducida por el reviewer con los cuatro candados
mordiendo.

Lo que bloquea son **dos carreras asíncronas en los tests**, que dejan la suite
móvil no determinista: 6 de 14 pasadas completas en rojo, contra 2 de 13 en la
base. Ningún fallo está en el código de producción.

---

## Prompt

```
Feature: mobile-tanstack-query (#87), branch: feature/87-mobile-tanstack-query
Ronda 2: corrección tras veredicto RECHAZADO del reviewer.
Lee primero: progress/review_mobile-tanstack-query.md

Tu migración pasó la revisión en todo salvo en un punto: dejaste dos carreras
asíncronas que hacen la suite móvil no determinista (6 de 14 pasadas completas
en rojo, contra 2 de 13 en la base). No hay ninguna aserción relajada y el
código de producción no se toca en esta ronda: son fallos de test.

DEFECTO 1 — test/__tests__/render-with-providers.test.tsx:25 (R3, fichero tuyo)

  El Probe de ese fichero pinta el testID SIEMPRE:
      <Text testID="probe">{query.data ?? '…'}</Text>
  así que `await screen.findByTestId('probe')` resuelve en el primer render, con
  '…', y el `.toHaveTextContent('ok')` que va encadenado se evalúa UNA sola vez,
  sin reintento. Cuando la query no ha resuelto todavía, rojo.

  Arréglalo esperando al CONTENIDO, no al nodo. El segundo `it` del mismo
  fichero ya usa el patrón correcto (`await screen.findByText('ok')`): aplica
  ese mismo, o un waitFor que envuelva la aserción entera. No cambies lo que la
  aserción comprueba.

DEFECTO 2 — src/screens/home/index.test.tsx:636, 666 y 683 (R17)

  Los tres esperan al contenedor y luego hacen getByTestId desnudo de un hijo:
      await waitFor(() => expect(screen.getByTestId('summary-card')).toBeVisible());
      expect(screen.getByTestId('summary-activity')).toHaveTextContent('1h 35m');
  El contenedor aparece antes de que resuelvan las queries que llenan a los
  hijos, así que la aserción del hijo corre demasiado pronto. Rojo 2 de 14
  veces; en la base era 0 de 13.

  Arréglalo esperando al primer dato que prueba que la query resolvió, en vez
  de al contenedor: mete la PRIMERA aserción de contenido dentro del waitFor y
  deja las demás fuera con getBy. Tú ya cerraste esta misma clase de carrera en
  otros seis sitios de esta feature; faltan estos tres.

REGLA GENERAL que quiero aplicada en toda la feature, no solo en esos cuatro
puntos: nunca esperes a un nodo contenedor para después asertar sobre hijos que
llegan más tarde, y nunca encadenes una aserción de contenido a un findBy* cuyo
selector ya existe durante la carga. Repasa el resto de tus tests nuevos y
modificados por si queda algún caso más de la misma forma.

Restricciones de esta ronda:
  - NO toques código de producción. Si crees que un fallo exige tocarlo, para y
    escríbelo en el reporte en vez de hacerlo.
  - NO relajes ninguna aserción. Envolver en waitFor una aserción intacta es lo
    correcto; debilitar lo que comprueba, no.
  - NO intentes arreglar el flake de add-pet: es la deuda #72, preexistente, con
    tasa idéntica antes y después de tu trabajo, y está fuera de alcance.
  - NO toques feature_list.json ni backend-pet-tracker/.
  - Un commit por defecto arreglado, mensaje fix(mobile-tanstack-query): …
  - Al terminar, COMMITEA Y PUSHEA la branch.

Prueba de que quedó determinista (esto es lo que se te va a exigir):
  - Corre la suite móvil completa DIEZ veces seguidas y que las diez salgan
    verdes. Una sola pasada verde no prueba nada aquí: el defecto es
    exactamente que a veces pasa.
  - Después, con pgrep comprobado, `env -u FORCE_COLOR bash ./init.sh` verde.
  - pgrep antes de init.sh: hay otra sesión con Codex en
    /home/claude/sites/Pet-Tracker-wt-backend y comparten el Postgres de docker.
    Si ves uno vivo, espera; no lo mates.

Al terminar: añade una sección "Ronda 2" a progress/impl_mobile-tanstack-query.md
con el hash de cada fix, el número de pasadas verdes consecutivas de la suite, y
la confirmación de que no tocaste producción.
```

---

## Después de esto

El leader relanza el `reviewer`. El gate humano de smoke en dev build de Android
sigue pendiente y no es delegable.
