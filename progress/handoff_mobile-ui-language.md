# Handoff a Codex CLI — #65 mobile-ui-language

> Entregado el 2026-09-06. Se corre en una terminal aparte, worktree
> `Pet-Tracker-wt-ui`, branch `feature/65-mobile-ui-language`.

```
Feature: mobile-ui-language (#65), branch: feature/65-mobile-ui-language

Worktree: /home/claude/sites/Pet-Tracker-wt-ui — trabaja SOLO ahí. NO uses
/home/claude/sites/Pet-Tracker: es otro worktree con otra branch y hay una
sesión paralela activa sobre el backend.

Spec aprobada por humano el 2026-09-05 (los cuatro archivos en status: approved):
  specs/mobile-ui-language/requirements.md   ← R1..R20 y el invariante
  specs/mobile-ui-language/design.md         ← §2 el catálogo normativo, §3 la infraestructura, §4 los tests, §6 las enmiendas
  specs/mobile-ui-language/tasks.md          ← el orden de ejecución y las reglas de commit
  specs/mobile-ui-language/traceability.md   ← la actualizas tú tras cada commit
  specs/mobile-ui-language/copy-review.md    ← vista de revisión humana, NO normativa

Léelos enteros antes de escribir nada.

QUÉ ES ESTA FEATURE: la app pasa a tener interruptor de idioma en Profile,
español e inglés, con español por defecto. No es "traducir la app": es
sustituir 320 literales de copy por claves contra un catálogo de dos columnas.

LA FUENTE ÚNICA DEL LITERAL ES design.md §2. Son 255 claves. Si una cadena no
está en esa tabla, PARA y dilo en el reporte: no inventes copy de producto, la
firmó el humano. copy-review.md es una vista para que él la leyera; si difiere
de §2, manda §2.

Antes de la primera línea, carga las skills del plugin expo (obligatorio, carta
docs/ui-guidelines.md §Skills): expo-overview primero, luego las que indique.
De appllama tomas el PATRÓN, nunca su sistema de estilos.

ORDEN DE EJECUCIÓN — NO es el orden de los ids, y es obligatorio (tasks.md):

  1. R12 → R13 → R16 → R14 → R15   infraestructura: catálogo y `t`,
                                    persistencia, español por defecto,
                                    interruptor, locale de fechas
  2. R1 → R2 → … → R11              los 11 lotes de pantalla, 320 ocurrencias
  3. R17 → R18 → R19 → R20          desacople de tests de estilo, escaneo
                                    global, las 9 enmiendas, la carta

Sin `t` no se puede escribir ninguna pantalla, por eso la infraestructura va
primero. Los ids de pantalla se quedan en R1-R11 para no renumerar copy-review,
que el humano ya revisó.

Reglas críticas:
  - TDD POR REQUISITO, historial rojo→verde. Commit rojo con SOLO el test
    fallando que nombra su R-id, luego commit verde. 20 requisitos ⇒ al menos
    40 commits. Un commit que mezcle test rojo con su implementación incumple
    C4 de CHECKPOINTS.md y el reviewer lo rechaza aunque la suite esté verde.
  - **Lee CHECKPOINTS.md §C4 entero antes de empezar.** Tiene dos condiciones
    nuevas, escritas tras #64: si un requisito solo asevera una propiedad de
    algo que otro requisito anterior ya dejó en el árbol, su rojo no puede ser
    real en esa posición — la spec debe haber elegido vía por escrito, y
    ningún commit rojo vale si falla por un `ReferenceError` de un helper que
    aún no existe. En #64 eso costó un rechazo del reviewer y una excepción
    firmada por el humano. R17 y R18 huelen a ese patrón: míralos con esa
    lente antes de escribir su test, y si el rojo te sale por ReferenceError,
    PARA y dilo en vez de seguir.
  - Corre `bun run test` en mobile-pet-tracker/ antes de cada commit. La orden
    literal `bun test` invoca el runner nativo de Bun y NO la suite del
    proyecto.
  - Al cerrar, corre ./init.sh ENTERO. `cdk synth` compila en local y no crea
    recursos AWS: se ejecuta. Lo prohibido es `bootstrap` y `deploy`.
  - Actualiza traceability.md tras cada commit: ninguna fila en "pendiente".

Invariante:
  - Cero cambios de conducta, lógica, navegación ni contratos de API. Lo único
    que cambia de conducta es lo que R14 añade a propósito: el interruptor.
  - **Ningún `testID` se renombra ni se elimina.** Los 6 nuevos que R14/R17
    autorizan están enumerados en design.md §4; ninguno más.
  - El texto visible cambia —es el objeto de la feature— pero solo al literal
    que fija design.md §2. Ni una cadena de tu cosecha.
  - Nada bajo backend-pet-tracker/ ni infra/. Los mensajes de validación que
    devuelve el backend siguen en inglés en los dos idiomas: están declarados
    fuera de alcance en requirements.md y NO se tocan.
  - No se instala ninguna dependencia: ni librería de i18n ni
    expo-localization. 255 claves × 2 idiomas es un objeto TypeScript y un
    contexto, con el patrón que ya usa src/theme/use-theme-colors.ts.
  - Los emoji no son copy y no se tocan.
  - El grep-clean de #46 y #72 sigue intacto.
  - La paleta categórica de #64 ya está en main: no la re-litigues ni la toques.

Archivos a crear: los tres módulos que design.md §3.2 especifica (catálogo,
proveedor de idioma con su hook, y persistencia con el patrón best-effort de
src/utils/theme-preference.ts).

Archivos a modificar: los 19 de pantalla que design.md §1.3 enumera, los 19 de
test de §1.4, docs/ui-guidelines.md (R20) y las 9 specs aprobadas de §6.1
(R19), donde SOLO se inserta el bloque de enmienda literal de §6.2 — no se
reescribe ningún requisito ajeno.

Criterios de aceptación: R1..R20 de requirements.md.

Al terminar: escribe el resultado en progress/impl_mobile-ui-language.md (qué
R-id cerró cada commit, qué quedó abierto, y el resultado de `bun run test` y
de ./init.sh). No mandes el contenido por chat: el handoff es por disco.
```

## Lo que NO cierra Codex

- **Gate humano**: smoke en dev build de Android, cambiando de idioma en los dos
  sentidos y comprobando que no queda texto sin traducir en ninguno.
- Tras esta feature **seguirá viéndose inglés** en los mensajes de validación del
  backend y en cinco enums que la API pinta crudos. Está declarado, no es un
  fallo del smoke.
