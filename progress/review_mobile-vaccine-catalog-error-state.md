# review: mobile-vaccine-catalog-error-state (#236)
Fecha: 2026-11-03
Rama: `feature/236-mobile-vaccine-catalog-error-state`, HEAD revisado `3a53b8f3`
Veredicto: APROBADO

Sin bloqueantes. Los hallazgos 1–5 son observaciones no bloqueantes.

El reviewer no corrió `./init.sh` ni jest: el leader lo prohíbe en el encargo y
los corre él después de este veredicto. La aprobación queda condicionada a que
ese `./init.sh` salga verde. Las reglas del reviewer no se relajan: si falla,
este veredicto no vale.

## Alcance verificado

- Commits de Codex contra el handoff (`6ea703f9`, enmendado por el leader en
  `a0b14bc1`). Ficheros por commit, sin contar los `progress/` del leader:
  - C1 `1aba44d2`: solo `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx`.
  - C2 `89598787`: solo `src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts`.
  - C3 `ab2262e4`: solo `src/screens/vaccine-create/index.tsx`.
  - C4 `354f46c7`: solo `src/screens/vaccine-create/index.test.tsx`.
  - C5 `3a53b8f3`: solo `progress/smoke_mejoras-smoke.md`,
    `specs/mobile-vaccine-catalog-error-state/traceability.md` y
    `progress/impl_mobile-vaccine-catalog-error-state.md`.
- El código de producción coincide literalmente con design.md §Decisiones
  técnicas:
  - `const catalogFailed = !catalog.isPending && catalog.data?.kind !== 'ok';`
  - el bloque `vaccine-create-catalog-error` va entre la leyenda y
    `{catalog.isPending ? (`;
  - `Text` lleva `text-15 leading-body text-danger`, `accessibilityRole="alert"`
    y `selectable`;
  - el `Button` de heroui-native es el por defecto, con
    `onPress={() => void catalog.refetch()}`;
  - no hay imports nuevos.
- Las anclas de tasks.md §Anclas tras C3 dan todas la cifra esperada. Aplicado
  a `index.tsx`, `grep -cP '#236(?! R\d)'` da 0.
- `git diff b06e688f -- src/i18n/catalog.ts src/screens/health/index.tsx` sale
  vacío. Las claves `health.couldNotLoadVaccines` y `common.retry` ya existían
  en es y en en.
- La spec (requirements, design y tasks) no cambió desde la firma delegada
  `a96e7c8e`.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress. Hay 0 en `feature_list.json` (#236 está en
  `spec_ready`), y `init.sh` admite como mucho 1.
- [x] `progress/current.md` actualizado: describe la sesión activa, el plan del
  smoke del 2026-11-03 con #226–#236, y recoge #236 en su §6.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure. N/A: el cambio es solo de
  presentación móvil (`src/screens/vaccine-create/`).
- [x] repositories/contratos en domain son interfaces puras. No se tocan.
- [x] application depende de interfaces, no de implementaciones. La pantalla
  usa la consulta existente (`fetchVaccineCatalog` vía TanStack Query) y no
  cambia la capa de API.
- [x] infrastructure sin lógica de negocio. No se toca.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra:
  - `#236 R1` es un it.each de 4 filas más un caso de rechazo;
  - `#236 R2`;
  - `#236 R3` es un it.each de 2 filas;
  - `#236 R4`;
  - `#236 R5`;
  - `#236 R6` tiene dos it;
  - R7 es el título `#208 R20 … (enmendado por #236 R7)` con `29 + 2; // #236 R7`;
  - `#236 R8`;
  - R9 son los dos `grep -cF` sobre `progress/smoke_mejoras-smoke.md`.
- [x] El historial muestra test primero: C1 y C2 son rojos sin el bloque ni los
  usos en producción, C3 es el verde y C4 trae los tests que nacen verdes,
  acompañados de mutaciones. El reporte recoge 10 rojos en C1 y 2 en C2
  (`checkUses` da 0 frente a 1). Ningún commit mezcla test e implementación.
- [x] Las mutaciones M1–M4 de design.md §Pruebas de mutación cumplen la regla
  enmendada en `a0b14bc1` (cae como mínimo cada `it` de su fila). Lo verifiqué
  razonando sobre el código, sin plantarlas:
  Cada mutación sustituye la expresión entera de `catalogFailed`:
  - M1 (`entries.length === 0`) tira R3 vacío y R4, porque en carga `entries`
    es `[]`.
  - M2 (`!catalog.isPending`) tira los dos R3, porque un `ok` resuelto también
    pinta el aviso. También tira R5, porque el aviso no se retira tras el `ok`.
  - M3 (`catalog.data?.kind !== 'ok'`, sin `!catalog.isPending`) tira R4,
    porque `data` es `undefined` en la carga. También tira R1×4 y R2, porque
    el aviso sale durante la carga inicial, como dice el reporte.
  - M4 (`!catalog.isFetching && catalog.data?.kind !== 'ok'`) tira
    `#236 R6: mientras el reintento está en vuelo…`.

  Los rojos adicionales del reporte (M1 7, M2 3, M3 6, M4 7) cuadran con que
  el aviso sale durante la carga inicial o con que se pierde durante el
  refetch. Los tests no son tautológicos: R8 lee el fuente con `readFileSync`
  y cuenta cada literal exactamente una vez, y R5 y R6 cuentan llamadas reales
  al doble del catálogo con argumentos `(apiUrl, 'jwt-token', 'dog')`.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». Las 9 filas tienen hash y
  mensaje correctos. R3 y R4 están marcados como «nace verde» con M1/M2 y
  M1/M3, y M4 está anotada en R6.
- [x] La receta de C5 (`git log -1 --format=%H --fixed-strings --grep='docs(progress): paso de smoke y trazabilidad de #236 (R9)'`)
  devuelve `3a53b8f3…`, el HEAD.
- [x] Los commits siguen `test|feat|docs(<scope>): <desc> (R-ids)`, la
  convención del proyecto.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla marcada el
  2026-11-03 con la firma delegada del leader (commit `a96e7c8e`, mandato del
  2026-10-23 ampliado el 2026-11-03). La enmienda de #208 aparece en
  `specs/mobile-vaccine-create/requirements.md` §Enmienda por #236.

## Checklist C7 — Sin código huérfano
- [ ] Componentes/módulos reemplazados por esta feature fueron eliminados
- [ ] Sus tests también fueron eliminados
- [x] N/A. Esta feature no reemplaza nada: amplía #208 R8 (el error del
  catálogo) y R20 (la tabla de usos) de forma aditiva. El test
  `#208 R8: con el catálogo en error solo queda «Otra vacuna» seleccionado`
  se conserva sin tocar.

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Skills cargadas: `expo:expo-overview`, `expo:expo-native-ui` y
  `expo:expo-data-fetching`.
- [x] El diff de producción no tiene hex, valores arbitrarios `[...]`,
  `StyleSheet` ni sombras o elevación. Las clases son tokens existentes.
- [x] La regla 13 «Sin labio» se cumple: el reintento es el `Button` por
  defecto de heroui-native, igual que Salud (`src/screens/health/index.tsx`,
  bloque del error del catálogo), sin variante con labio.
- [x] El texto del error lleva `selectable` (la skill expo-native-ui lo pide
  para mensajes de error) y `accessibilityRole="alert"`.
- [x] Los estados de datos están separados. Durante la carga se mantienen los
  esqueletos (`vaccine-create-chips-skeleton`) sin aviso. El aviso solo sale
  cuando la carga se resuelve sin `ok`, y sigue visible durante el refetch.
  Un `ok` vacío no se confunde con un error.
- [x] Safe areas y layout sin cambios. No añade animaciones. No existe un
  componente compartido de error con reintento, y la spec justifica no
  crearlo.
- [x] La copy sale del catálogo i18n, y la tabla de usos queda cuadrada
  (`29 + 2`).

## Observaciones

1. **(No bloqueante, debilidad de la spec, no del implementer) Zona ciega en
   R4.**
   - En `#236 R4: mientras carga no pinta el aviso de error`,
     `findByTestId('vaccine-create-chips-skeleton')` se resuelve en la primera
     comprobación. Con timers falsos, el notify de query-core
     (`setTimeout(0)`) todavía no ha disparado. Las mascotas siguen sin
     cargar y la consulta del catálogo está deshabilitada (`isPending` con
     `enabled: false`).
   - Por eso R4, igual que el `#208 R8: mientras carga` del que parte, no
     llega a observar el fetch del catálogo en vuelo.
   - Es probable que una mutación como
     `catalog.isFetching || (!catalog.isPending && catalog.data?.kind !== 'ok')`
     sobreviva a la suite. No pude confirmarlo, porque jest está prohibido en
     este encargo.
   - El código entregado es correcto y cumple la spec, y M1 y M3 sí ponen R4
     en rojo.
   - Endurecimiento sugerido para una feature futura, no para esta: en R4,
     esperar a que `mockCatalog` tenga 1 llamada antes de asertar que no hay
     aviso.
2. **(No bloqueante) Orden temporal de la suite completa.**
   - El reporte da una suite completa de 427,81 s tras C4. Las marcas de los
     commits (C4 a las 22:22:54, autor de C5 a las 22:28:34) dejan menos
     tiempo del que esa suite necesita.
   - Lo más probable es que la suite se solapara con la ventana de mutaciones
     o corriera antes del commit C4. Eso explicaría los dos timeouts del
     punto 5 por carga.
   - No afecta a la corrección: las mutaciones no tocan las guardas, y
     vaccine-create dio 55/55 en esa corrida. Lo decide el `./init.sh` del
     leader.
3. **(No bloqueante) C5 enmendado.**
   - En C5, la fecha de commit (22:29:22) es posterior a la de autor
     (22:28:34). El reporte explica que la causa fue arreglar la receta del
     hash por título.
   - No hubo rebase, y los hashes C1–C4 citados en `traceability.md` siguen
     siendo los del historial.
4. **(No bloqueante) Alcance del test de rechazo de R1.**
   - `#236 R1: si la consulta del catálogo rechaza pinta el mismo aviso`
     comprueba el texto, el reintento y que no se filtra el mensaje privado
     (`SERVER_THROWN_PRIVATE`). No comprueba la posición ni las clases.
   - La tabla de design.md solo pide «el mismo bloque y el mismo texto», y el
     bloque es único en el fuente (R8 lo cuenta una vez). Se acepta.
5. **(No bloqueante, anotado a petición del leader) Timeouts de celebración.**
   - La suite completa de Codex dio 1712/1714. Hubo 2 timeouts en
     `src/components/__tests__/celebration.test.tsx` (`#171 R7.4` y
     `#171 R18.1`), un fichero que esta feature no toca. El rerun aislado dio
     66/66 en verde.
   - El reviewer no reejecutó nada. El `./init.sh` del leader decide si es
     carga o regresión. Si se repite en verde aislado y en rojo en la suite,
     el patrón es el de los timeouts por jest concurrente (memoria
     «Jest timeout: carga y lentitud propia»).

## Output de ./init.sh

El reviewer no lo ejecutó: el encargo del leader lo prohíbe expresamente
(«Prohibido: ./init.sh, jest en cualquier forma (el leader corre la suite)»).
Lo corrió el leader sobre `3a53b8f3`, el HEAD revisado. Hubo cuatro corridas.

1. **Corrida 1**, terminó a las 23:11:53 UTC con `init=1`. El backend salió
   verde. En móvil:

   ```
   Test Suites: 8 failed, 171 passed, 179 total
   Tests:       22 failed, 6591 passed, 6613 total
   ```

   - Suites caídas: reminders, profile, food, home, map, meal-schedule,
     alert-detail.notification y celebration.
   - 19 de los fallos son «Exceeded timeout». Los demás son `waitFor` que no
     llegan y el flake de tinte `#0D1117`.
   - Load average 119/105, con jest de otros worktrees en paralelo.
   - Ninguna de esas suites es de #236.
2. **Corrida 2**, de 23:12:59 a 23:23:34 UTC, con `init=1`. El backend salió
   verde. En móvil:

   ```
   Test Suites: 3 failed, 176 passed, 179 total
   Tests:       5 failed, 6608 passed, 6613 total
   ```

   - Los cinco fallos son «Exceeded timeout»: add-pet `#171 R4.3` y
     `#171 R4.5`, celebration `#171 R20.4` (60000 ms), y pairing `#188 R19` y
     `#188 R4`.
   - Load average entre 64 y 78.
3. **Corrida 3**, empezó hacia las 23:49 UTC. La mató el reaper de memoria de
   Claude Code durante el jest móvil («script "test" was terminated by signal
   SIGTERM»). No dio resultado.
4. **Corrida 4**, de 00:40:43 a 00:50:44 UTC del 2026-11-04, con `init=0`.
   Corrió con la máquina en reposo: load average 0.5 y ningún otro jest ni
   `init.sh` vivo.

   ```
   backend   Test Suites: 198 passed, 198 total
             Tests:       1650 passed, 1650 total
   e2e       Test Suites: 2 passed, 2 total
             Tests:       14 passed, 14 total
   móvil     Test Suites: 179 passed, 179 total
             Tests:       6613 passed, 6613 total
             Snapshots:   1 passed, 1 total
             Test Suites: 3 skipped, 33 passed, 33 of 36 total
             Tests:       8 skipped, 599 passed, 607 total
   ✅ Lint sin errores
   ✅ Typecheck sin errores
   ✅ Todo verde
   ```

   Errata del leader (2026-11-04, desde la rama de #237): los rótulos de este bloque están cambiados. Las líneas
   bajo «e2e» (2 suites, 14 tests) son de `infra`. Las dos últimas (33 de 36 suites; 599 passed y 8 skipped)
   son el e2e del backend, no el móvil. Las cifras son correctas.

   Las 54 apariciones de `●` en el log son todas `● Console`; ningún test cae.

El rojo de las corridas 1 y 2 fue de carga, no de #236: cae en suites que esta
feature no toca y desaparece con la máquina en reposo. La condición del
veredicto queda cumplida con la corrida 4.

Una salvedad: la perf-cache de jest en `/tmp/jest_ru` es compartida y no se
borró entre corridas. El orden de la corrida 4 pudo salir favorecido (memoria
«Jest repite el rojo primero»).
