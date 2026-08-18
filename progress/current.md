# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

- **Feature**: #17 `nutrition-profile-engine` (P3)
- **Inicio**: 2026-08-17
- **Branch**: `feature/17-nutrition-profile-engine`
- **Estado de la feature al arrancar**: `pending` (sin spec)

## Arranque

- `./init.sh` verde: 296 tests pasados, 6 skipped, lint y typecheck sin errores.
  El `FK pet_users` en el log es la carrera de arranque conocida de la infra, no
  una regresión (los e2e pasan).
- `progress/current.md` estaba vacío: no había sesión sin cerrar.

## Plan

1. `explorer` — la feature tiene decisiones de diseño abiertas: la "tabla de
   factores MER del plan 009" no vive en el repo, y los criterios de aceptación
   (perro 20 kg → ~1059 kcal / 305 g; gato 4 kg low → ~218 kcal / 60 g) fijan
   los factores y la regla de redondeo solo de forma implícita. Documenta
   patrones reutilizables y decisiones abiertas en
   `progress/explore_nutrition-profile-engine.md`.
2. `spec_author` — spec EARS en `specs/nutrition-profile-engine/`, status a
   `spec_ready`.
3. **PARA** hasta el gate humano de la spec. Sin esa aprobación no hay handoff
   a Codex.

## Bitácora

- (en curso)

- **Corrección de la premisa**: `plans/009-alimentacion-ia.md` **sí** existe en el
  repo y es la fuente normativa de las cifras clínicas (tabla MER completa,
  horarios, comidas por edad, warnings, 4 casos de test). Mi encargo al
  `explorer` decía lo contrario; él lo detectó y lo corrigió en la §0 de su
  informe. Las decisiones abiertas quedaron en segundo orden.
- **`explorer` terminado** → `progress/explore_nutrition-profile-engine.md`
  (19 decisiones D1..D19: 5 las fija el plan 009, 14 genuinamente abiertas).
  Hallazgo aritmético clave: los dos anclajes del criterio de aceptación son un
  par mínimo indivisible — el del perro elimina `floor`, el del gato elimina
  `ceil`, y solo juntos prueban que el redondeo de gramos es `round`.
- **Gate humano de las decisiones de producto/clínica** (2026-08-17), las tres
  que `plans/009` declara condición de STOP:
  - **D3 + D17 → gana la edad**: cachorro/joven con BCS ≥ 7 conserva el factor
    de crecimiento y `objective = 'growth'`, pero emite igualmente el warning
    `weight_loss_plan`. No se restringen calorías a un animal en crecimiento.
  - **D15 → `kcalPer100g` obligatorio siempre**, para los cuatro `foodType`.
    El backend no aplica ningún default: dry 350 / wet 100 quedan como precarga
    de la UI. Esto **anula** la frase "defaults sugeridos si null" del plan 009
    §Paso 1 y de la descripción de #17 en `feature_list.json`.
  - **D12 → sin `PetTrackingGuard`**: nutrición es app de salud gratuita,
    coherente con el modelo de membresías de #25.
- **`spec_author` lanzado** con esas tres cerradas y el resto delegadas a las
  recomendaciones del informe.
- **`spec_author` terminado** → `specs/nutrition-profile-engine/`
  (requirements.md 660 líneas + design.md + tasks.md + traceability.md).
  Status de #17 en `feature_list.json`: `pending` → `spec_ready`.
- **Segundo gate humano (2026-08-17)** — las tres preguntas P1..P3 que la spec
  dejó marcadas se cerraron **confirmando la propuesta de la spec**, así que su
  cuerpo no cambió; solo se registró la resolución en la sección "Preguntas
  abiertas":
  - **P1** textos de los cuatro warnings nuevos: aprobados tal cual.
  - **P2** `pets.sterilized` null ⇒ factor de adulto entero (1.8 / 1.4). Se
    prefiere sobrealimentar ~12 % antes que subalimentar a la entera; el dato
    ausente no bloquea el generate.
  - **P3** `targetWeightKg` mayor que el peso actual: se acepta tal cual, el
    motor no juzga el objetivo.
- La descripción de #17 en `feature_list.json` se corrigió para que el override
  de `kcalPer100g` no siga contradiciendo a la spec.

- **Revisión de la spec a petición del humano (2026-08-18)**, antes de aprobarla.
  Aritmética de los 5 casos numéricos verificada en `node`: los cuatro anclas de
  R14 y el caso discriminante de R4 dan exactamente los valores escritos,
  incluido el ruido IEEE-754 (`1.2 - 0.1 = 1.0999999999999999` sigue dando 218).
  Dos defectos encontrados y corregidos:
  - **Contradicción bloqueante**: R1 asevera por `readFileSync` que
    `nutrition-engine.ts` no contiene las cifras de C-1..C-10, y el paso (3) de
    su propia tarea pedía un JSDoc con esas mismas cifras en ese archivo. El
    refactor habría puesto rojo el test del paso (1) del mismo requisito. Las
    cifras van ahora a `nutrition.constants.ts`; corregido en `requirements.md`
    R1, `design.md` D1 y `tasks.md` (commit `b506a22`).
  - **Conteo ambiguo**: R3 pedía "un caso por fila de C-2 (10 filas)" sobre una
    tabla de 8 filas. Son 10 casos = 5 filas clínicas × 2 especies; corregido en
    `requirements.md` y `tasks.md` (`b506a22`, `b1e0e5d`).
  Verificado además que `pets.sterilized` es editable por `PATCH /v1/pets/:id`
  (P2 es corregible por el dueño) y que `pets.species` tiene CHECK
  `in ('dog','cat')` (el motor no necesita rama para otras especies). Cota de P3
  calculada: perro 30 kg con BCS 8 y target 35 → 1007 kcal, todavía por debajo
  de las 1436 de mantenimiento, así que aceptar el target absurdo no
  sobrealimenta.
- **Gate humano de la spec superado (2026-08-18)**:
  `specs/nutrition-profile-engine/requirements.md` → `[X] Aprobado por humano`.
  Los cuatro archivos de la spec pasan a `status: approved` y #17 pasa a
  `in_progress` en `feature_list.json`.
- **Handoff a Codex CLI escrito** →
  `progress/handoff_nutrition-profile-engine.md`. Incluye los tres overrides
  (OV1/OV2/OV3) contra las frases obsoletas de `plans/009` y de la descripción
  de #17, seis trampas concretas (escaneo de texto de R1, migración 0013 nueva,
  `numeric` como string, par ancla indivisible, caso sintético de R4, ruido
  IEEE-754), la exigencia de commits test-primero por R-id con doble hash en
  `traceability.md`, la de rojo + aserción anti-vacío en las ocho guardas, y la
  prohibición explícita de cerrar la feature él mismo (lo hizo en #29).

## Siguiente

**PARADA: le toca al humano correr Codex CLI** con el bloque de
`progress/handoff_nutrition-profile-engine.md`. Mientras implementa, Claude no
toca `backend-pet-tracker/` — un solo escritor sobre el working tree.

Cuando el humano confirme que Codex terminó: leer
`progress/impl_nutrition-profile-engine.md`, lanzar el `reviewer` y esperar su
veredicto en `progress/review_nutrition-profile-engine.md`. Solo con veredicto
aprobado se marca #17 `done` y se abre el PR (`env -u GITHUB_TOKEN gh pr
create`); el merge lo hace el humano.
