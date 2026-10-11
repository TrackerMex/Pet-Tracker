# review: mobile-docs-upload (#158)
Fecha: 2026-10-09T23:05:37Z
Veredicto: APROBADO (0 hallazgos bloqueantes; una salvedad C8 sobre el feedback pressed de `Card`, transversal y fuera de la lista cerrada, ver Observaciones 1)

- Worktree: `/home/claude/sites/Pet-Tracker-wt-158`.
- Branch: `feature/158-mobile-docs-upload`.
- HEAD: `791a6f97`. Lo comprobé al empezar, después de cada sonda y al terminar.
- H0: `421cd836`.
- Diff revisado: `421cd836..791a6f97`, con 27 commits de Codex.
- `./init.sh`: lo corrió el leader en `791a6f97` con permiso del humano. Este reviewer no lo corrió, por instrucción del leader. Leí el log entero (ver §Output).
- Fuera del stage queda solo `progress/handoff_mobile-docs-upload.md` (M), que es del leader. No cuenta como hallazgo.
- Antes de tocar código comprobé `test ! -e mobile-pet-tracker/.expo/types/router.d.ts`: exit 0.
- Las pre-verificaciones de la spec (rondas 1, 1b y 1c, commit `0bbfda48`) se conservan íntegras al final de este fichero.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` del worktree tiene solo la #158 en `in_progress`.
- [x] `progress/current.md` actualizado: describe la sesión de #158, el handoff a Codex, la coordinación con #159 y #134, y el plan init.sh, reviewer y smoke R13.

## Checklist C3 — Arquitectura
- [x] Las capas de dominio no cambian. El diff es solo de la app móvil: `git diff --stat 421cd836 HEAD -- backend-pet-tracker/ infra-pet-tracker/ docs/` sale vacío.
- [x] Contratos: `src/api/media.ts` añade funciones puras con `fetchFn` inyectable:
  - `resolveDocumentContentType`;
  - `createPetDocument`;
  - `confirmPetDocumentUpload`;
  - `uploadPhotoToUrl`, ensanchada a `DocumentContentType`.

  Devuelven uniones discriminadas (`CreatePetDocumentState`, `ConfirmPetDocumentUploadState`) y no conocen la UI.
- [x] La pantalla depende de la capa `api`, no de detalles de transporte. El mapeo estado→copy vive en `handleUploadError`, de la pantalla, como prescribe R9.
- [x] No hay lógica de negocio en infraestructura (sin cambios en infra).

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra. Los `describe` usan `#158 R1` … `#158 R11`. R12 vive en `#65 R7 … 53 ocurrencias` y en las filas de `ui-copy-table.ts`. R4 tiene además el caso A renombrado `no ofrece acción a quien no es owner (#158 R4)`. R13 es el smoke humano, sin test por diseño.
- [x] El historial muestra test primero. Hay 12 pares rojo→verde (R1-R12), más:
  - `f117aaa2`, la dependencia (chore);
  - `ca74f737`, el candado de R4, verde de entrada y declarado (ver sondas);
  - `a9b74613`, el commit intermedio de `await` en R5.

  Los rojos contienen solo tests y los verdes solo producción. Hay dos excepciones, ambas prescritas por el handoff:
  - el verde de R2 actualiza las fixtures `downloadUrl` de `docs/index.test.tsx`;
  - el verde de R12 toca el fichero de datos `ui-copy-table.ts`.
- [x] `a9b74613` cambia exactamente 13 líneas, todas `await` de `fireEvent`, y no toca el cuerpo de ningún `it`. Desde T6, todo `fireEvent` nuevo lleva `await`. Solo quedan sin él las líneas 168 (`docs-retry`, previa) y 450 (R3), ambas autorizadas.
- [x] No hay rojos por ReferenceError ni por mutar un doble. El único rojo por excepción es el TypeError "is not a function" de T2, autorizado en el handoff.
- [x] Los rojos que nacieron verdes muerden. Planté una mutación en producción para cada uno (tabla en §Pruebas de mutación):
  - el `it` PDF de R2;
  - R4 caso A;
  - la fila `canceled` de R5;
  - en T9, `Error de R6` y `crear forbidden`.
- [x] `git merge-base --is-ancestor` da exit 0 para todos los hashes de `traceability.md` respecto de HEAD.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas "pendiente" salvo R13, el smoke humano. Está permitido: la casilla se firma en `requirements.md` §Prueba de humo.
- [x] Los commits siguen el formato `test|feat|chore|docs(mobile-docs-upload): <desc> (R-id)`, y los de cierre `(#158)`.
- [x] El frontmatter `status: draft` de `traceability.md` se conserva byte a byte, como ordenó el handoff; el leader lo cambia al cerrar.

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-docs-upload/requirements.md` tiene `status: approved`, con la casilla humana marcada el 2026-10-09 (firma `81d14978`, gate en Notion). La casilla R13 del final sigue sin marcar, como corresponde.

## Checklist C7 — Sin código huérfano
- [ ] N/A: esta feature no reemplaza nada existente. El antiguo `it('no ofrece acción'` se renombró y se redirigió a R4; grep da 0 para el título viejo y 1 para el nuevo. No se borran ficheros.

## Checklist C8 — Carta UI (`docs/ui-guidelines.md`, skill `expo:expo-overview` cargada)
- [x] Grep-clean en `src/screens/docs/index.tsx` y en su test:
  - 0 hex;
  - 0 clases arbitrarias `[...]`;
  - 0 `StyleSheet` (0/0);
  - 0 shadow/elevation;
  - 0 `bg-accent-soft`;
  - 0 `text-accent` suelto.
- [x] Las dimensiones siguen la excepción A11 de pantalla empujada:
  - `p-6 gap-4`;
  - `paddingBottom: insets.bottom + 24`, candado en R11 con 291;
  - `KeyboardAvoidingView` `behavior="padding"` con `keyboardVerticalOffset` de `HeaderHeightContext`;
  - `keyboardShouldPersistTaps="handled"`.
- [x] El Skeleton de carga queda intacto: el diff no lo toca.
- [x] Componentes compartidos reutilizados:
  - `Card` para las filas, como prescribe R10;
  - `EmptyState` con `action` para la entrada vacía;
  - `Button`, `TextField`, `Label.Text` e `Input` de heroui-native.

  No hay forks locales.
- [x] Tappables con feedback pressed y touch target ≥ 44pt, **con salvedad**:
  - Los botones heroui (`docs-upload`, submit, cancel, `docs-empty-action`) traen su feedback y su altura.
  - Las filas de documento usan `Card` con `onPress` (72pt), pero la rama `onPress` de `src/components/card.tsx` pinta un `Pressable` sin función de estilo pressed.
  - Es deuda del componente compartido, fuera de la lista cerrada y prescrita por R10. Sigo el precedente de #71 (`review_mobile-home-quick-actions.md`, «deuda del repo y no de #71»). Ver Observaciones 1.
- [x] No hay animaciones nuevas.
- [x] Errores en `<Text selectable className="text-danger">` (`docs-action-error`). Los controles van en `rounded-xl` y el fondo de acción en `bg-accent`: `rounded-xl bg-accent` aparece 2 veces, con el candado de `consistency-classnames` en `13 + 1 + 1 + 1 + 1 + 1 + 1`.

## Lista cerrada de ficheros
`git diff --stat 421cd836..HEAD` lista exactamente los 16 ficheros autorizados:
- `mobile-pet-tracker/`:
  - `bun.lock`, `package.json`;
  - `src/__tests__/{consistency-classnames.test.ts, design-drift.test.ts, ui-copy-table.ts, ui-language.test.ts}`;
  - `src/api/media.ts`, `src/api/__tests__/media.test.ts`;
  - `src/components/__tests__/empty-state.test.tsx`;
  - `src/i18n/catalog.ts`;
  - `src/providers/__tests__/language-provider.test.tsx`;
  - `src/screens/docs/index.tsx` y su test.
- Fuera de `mobile-pet-tracker/`:
  - `progress/impl_mobile-docs-upload.md`;
  - `specs/mobile-docs-upload/traceability.md`;
  - `specs/mobile-ui-language/design.md`.

`app.json` no cambia.

## Decisiones del leader que prevalecen sobre tasks.md (verificadas)
1. `"expo-document-picker": "~57.0.3"` en `package.json` (grep = 1).
2. Todo literal `DocumentPickerAsset` lleva `lastModified: 0`.
3. `a9b74613` cambia 13/13 líneas, solo `await`. Desde T6, los `fireEvent` nuevos llevan `await`.
4. Las etiquetas usan `<Label.Text className="text-2xs font-semibold text-foreground">` dentro de un `Label` que conserva su className inerte. No es hallazgo.
5. `crear forbidden` nació verde en el rojo de T9, autorizado por la Reanudación 4. La sonda M5 lo hace morder.

## Valores de cierre del handoff (todos coinciden)
| Valor | Resultado |
|---|---|
| picker en `package.json` | 1 |
| `rounded-xl bg-accent` | 2 |
| `signOut(` | 1 |
| `bg-accent-soft` | 0 |
| `text-accent` suelto | 0 |
| `StyleSheet` | 0/0 |
| `refetchInterval` | 0 |
| `useFocusEffect` | 0 |
| `{{petName}}` en el catálogo | 2 |
| `it('no ofrece acción'` | 0 |
| título `#158 R4` | 1 |
| `+ 12 // #158 R1` | 1 |
| `13 + 1 + 1 + 1 + 1 + 1 + 1` | 2 |
| entrada de `design-drift` | 1 |
| filas docs en `ui-copy-table` | 22 |
| `35 - 1 + 2 + 1 + 16` | 1 |
| título de 53 ocurrencias | 1 |
| título de 36 ocurrencias | 1 |
| cabecera §2.22 | 1 |
| `HeaderHeightContext.Provider value={91}` | 1 |

Las ocurrencias por clave cuadran con design.md §Ocurrencias: `docs.upload` ×3, las otras 13 claves ×1, 16 en total, y R7_PROFILE pasa de 37 a 53. Los literales del catálogo, la §2.22, `copyRows` de empty-state y el `it` `#158 R1` de language-provider coinciden byte a byte con §Copy nueva.

## Pruebas de mutación
Método:
- Cada sonda se plantó en producción, in situ.
- Corrí jest solo sobre el fichero de test afectado, en primer plano y sin pipe: `FORCE_COLOR=0 bunx jest <fichero> > scratchpad 2>&1; echo "exit=$?"`.
- Después restauré con `git checkout HEAD -- <ruta>` y comprobé `git diff --cached --quiet` (0) y `git diff --quiet -- .` (0).
- Con wt-134 corriendo init.sh en paralelo, revisé el motivo de cada rojo. Todos son por aserción o por elemento ausente que la mutación explica: en los `findBy*` agotados, el árbol muestra el copy o el nodo que produce la mutación. Ninguno es por timeout ajeno a la lógica.
- En cada corrida, los tests que no muerde la sonda quedaron verdes, lo que sirve de control bajo carga.

### Rojos nacidos verdes (pedidos por el leader)
| Sonda | Mutación plantada | Resultado |
|---|---|---|
| M1 (R2, `it` PDF) | `media.ts:126`, `'Content-Type': contentType.startsWith('image/') ? contentType : 'image/jpeg'` (zona ciega: las fotos siguen igual) | media 1 rojo / 69: `uploadPhotoToUrl manda application/pdf sin Authorization` |
| M2b (R4 caso A) | `index.tsx:350`, `action={!selectedDocument ? …}` (sin `isOwner` solo en la rama vacía) | docs 9 rojos / 108: `no ofrece acción a quien no es owner (#158 R4)`, las 5 filas `sin entradas con mascota <estado>` de #155 y `solo Pingo para family/walker/vet` |
| M2a (R4 por rol) | `index.tsx:94`, `myRole !== 'vet'` (family y walker pasan por owner) | docs 7 rojos: caso A, `sin botón para family/walker`, `solo Pingo para family/walker` y `mantiene la lista … para family/walker` (vet queda verde, como se espera) |
| M3a (R5 `canceled`) | `index.tsx:112`, `if (result.canceled) { setActionError('unknown'); return; }` | docs 1 rojo: `selector: canceled` (`docs-action-error` presente con «Algo salió mal») |
| M3c (R5 `canceled`) | `canceled` abre el formulario con un asset ficticio | docs 1 rojo: `selector: canceled` (`docs-upload` desaparece) |
| M4 (R9 `Error de R6` / `Error de R9`) | borrar el `setActionError(null)` de `submitDocument` (`index.tsx:170`) | docs 2 rojos: `quita al pulsar el error anterior: Error de R9` y `… Error de R6` |
| M4b (zona ciega) | `if (actionError !== 'invalid-form') setActionError(null);` | docs 1 rojo: solo `… Error de R6`. Hay un candado por rama |
| M5 (R9 `crear forbidden`) | `index.tsx:188`, `handleUploadError(created.kind === 'forbidden' ? 'error' : created.kind)` (confirmar forbidden queda intacto) | docs 2 rojos: `crear forbidden` y `rehabilita ambos botones cuando crear responde forbidden` (el árbol muestra «Algo salió mal») |

### Barrido adicional en zonas ciegas
| Sonda | Mutación plantada | Resultado |
|---|---|---|
| M6 | catch `readingAsset ? 'upload-failed' : 'unknown'` → `'unknown'` | 2 rojos: `lectura fetch rechaza`, `lectura blob rechaza` |
| M7 | `vet` siempre enviado (`vet: vet.trim()`) | 1 rojo: `sube el PNG sin mimeType y omite el veterinario vacío` |
| M8 | `isDisabled={false}` en cancelar (`:322`) | 6 rojos: `bloquea ambos botones durante fetch/blob/crear/PUT/confirmar/refetch` |
| M9 | `isDisabled={false}` en enviar (`:311`) | los mismos 6 rojos |
| M10 | sin `await docs.refetch()` | 4 rojos: los dos `sube …`, `cierra el formulario aunque el refetch responda error` y `bloquea … durante refetch` |
| M11 | `.toLowerCase()` fuera de la extensión | media 1 rojo: `undefined y A.PNG` |
| M12 | `normalized = mimeType` sin minúsculas | media 2 rojos: `IMAGE/PNG y a.bin`, `APPLICATION/OCTET-STREAM y a.png` |
| M13 | `lastIndexOf('.')` → `indexOf('.')` | media 1 rojo: `undefined y informe.v2.pdf` |
| M14 | `if (normalized) return null;` (sin excepción octet-stream) | media 2 rojos: las dos filas `octet-stream` |

Ninguna sonda sobrevivió.

## Corridas propias (HEAD 791a6f97, sin pipe)
- `bunx tsc --noEmit`: exit=0, sin salida.
- `bunx expo lint --no-cache`: exit=0, sin salida de errores.
- No corrí la suite móvil entera, por instrucción del leader: wt-134 y wt-159 tenían jest en vuelo.
- Control sin mutar tras terminar el init.sh de wt-134 (exit=0, avisado por el leader): `FORCE_COLOR=0 bunx jest src/screens/docs/index.test.tsx src/api/__tests__/media.test.ts`, con exit=0, 2 suites y 177 tests verdes (108 + 69). No quedó ningún rojo de sonda pendiente de repetir.

## Observaciones
Ninguna es bloqueante.

1. **Salvedad C8: feedback pressed en `Card`.**
   - Las filas de documento son el primer consumidor real de `Card` con `onPress` en la app; en origin/main solo lo usa `card.test.tsx`.
   - La rama `onPress` de `src/components/card.tsx` pinta `<Pressable … style={mergedStyle}>`, sin función de estilo pressed.
   - La carta (`docs/ui-guidelines.md`: «Feedback pressed en TODO elemento tappable») y C8 lo piden.
   - No lo cuento contra #158:
     - R10 prescribe la `Card` compartida;
     - `card.tsx` queda fuera de la lista cerrada;
     - mis pre-verificaciones de la spec tampoco lo cazaron;
     - el precedente de #71 lo trató como deuda del repo.
   - Propuesta de seguimiento con id propio: en `card.tsx`, rama `onPress`, `style={({ pressed }) => [mergedStyle, { opacity: pressed ? 0.8 : 1 }]}` (la receta del repo, #138), con su candado en `card.test.tsx`.
   - Mientras tanto, el humano puede comprobarlo de paso en el smoke R13 (paso 8, abrir un documento).
2. **El formulario va sin clases.**
   - `docs-upload-form` (`View`) no lleva className: no tiene `gap` entre el nombre del fichero y los cuatro `TextField`.
   - `docs-upload-file` es el único `<Text>` de `src/screens` y `src/components` sin clase de color.
   - En modo oscuro, el color por defecto de RN puede quedar ilegible sobre `bg-background`.
   - La spec (requirements.md:228-231) los describe sin clases y Codex la siguió al pie de la letra, así que es un hueco de spec.
   - Recomiendo mirarlo en el smoke R13, con el teléfono también en modo oscuro, y abrir un seguimiento (`gap-4` y `text-sm text-foreground`, por ejemplo) si se confirma.
3. **Faltan notas de «nació verde» en `traceability.md`.**
   - La fila R2 no dice que el `it` `uploadPhotoToUrl manda application/pdf sin Authorization` nació verde.
   - La fila R5 no lo dice de `selector: canceled`.
   - El impl sí lo documenta (§Cierre: «la única fila nueva verde fue selector: canceled»), y el handoff solo lo exigía allí.
   - Las sondas M1 y M3a/M3c prueban que muerden. El leader puede añadir la nota al cerrar si quiere la trazabilidad completa.
4. **Párrafo suelto en `traceability.md`.** Dice «Los recuentos entre paréntesis…», pero la tabla no tiene paréntesis. Es cosmético.
5. **Los candados de className de R3 y R5 son laxos.** Usan `expect.stringContaining`. Los respaldan los recuentos exactos de `consistency-classnames` (`rounded-xl bg-accent` ×2), así que no hay hueco efectivo.
6. **Cosméticos en tests globales.**
   - En `design-drift.test.ts`, la entrada `'screens/docs/index.tsx': 1, // #158 R9` va con 6 espacios de sangría frente a los 4 de sus hermanas.
   - En `consistency-classnames.test.ts` hay un comentario con `//` duplicado.
   - Prettier/eslint no los marcan.
7. **Aviso de worker en el log de init.sh.** El jest móvil emite «A worker process has failed to exit gracefully». Es un aviso, no un fallo: 97/97 suites verdes. No lo atribuyo a #158 sin más evidencia.
8. **R13 queda pendiente del humano y el impl deja los pasos completos y ejecutables.** `impl_mobile-docs-upload.md` §Smoke R13 es idéntica a requirements.md §Prueba de humo:
   - precondiciones 1-7: dev build de Android, `google-services.json` por máquina, backend parado en vez de modo avión;
   - pasos 1-8.

   Solo cambia la casilla final, sustituida por «R13: pendiente del smoke humano». La feature no debe marcarse `done` hasta que el humano firme esa casilla.

## Output de ./init.sh
Lo corrió el leader en HEAD `791a6f97` con permiso del humano. Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/74892c00-321f-434a-abca-de5bbd0439dc/scratchpad/158-init.log`. El leader reportó exit 0, y el log termina en «✅ Todo verde. Listo para trabajar.». Extracto, sin códigos ANSI:
```
✅ Build exitoso
# backend
Test Suites: 187 passed, 187 total
Tests:       1471 passed, 1471 total
# infra
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
# móvil
A worker process has failed to exit gracefully and has been force exited. ...
Test Suites: 97 passed, 97 total
Tests:       2512 passed, 2512 total
Snapshots:   1 passed, 1 total
# e2e
[✓] migrations applied successfully!
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 467 passed, 475 total
✅ Tests e2e pasados
→ Lint...
✅ Lint sin errores
→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 149/162 completadas | 12 pendientes
```

---

## Pre-verificación de la spec (antes del gate)

Worktree: `/home/claude/sites/Pet-Tracker-wt-158`, branch `feature/158-mobile-docs-upload`, base `65f37841`.
Spec revisada: `specs/mobile-docs-upload/{requirements,design,tasks,traceability}.md` sin commitear (status: draft).
No se ha corrido `./init.sh` ni e2e (Postgres/LocalStack compartidos), por instrucción del leader.

### Resumen

- Bloqueantes: 12 (B-A … B-L)
- No bloqueantes: 7 (N-1 … N-7)

"Bloqueante" sigue la regla de `progress/review_mobile-meal-schedule-editing.md` §Pre-verificación del
borrador E4 §2: un miembro enumerado (por "o", lista, tabla o herencia por referencia) o un tramo
de una ventana WHILE sin `it` que lo cubra, más una mutación en un único sitio que deja verde el jest
acotado de la feature. También bloquea una premisa falsa que impide que un `it` prescrito llegue a
verde, y un orden de commits que deja un rojo en un commit verde.

### 1. Anclas de base (§Base medida B1-B33 de design.md)

Medidas una a una con el `grep -cF` prescrito contra el árbol en `65f37841`. Las 33 coinciden con el
valor declarado, incluidas las anclas negativas (= 0): B1, B4, B6, B8, B10, B11, B23, B30, B31. No hay
drift de base.

Deltas comprobados contra el código que la spec prescribe:

- `consistency-classnames.test.ts`: los dos contadores de `/rounded-xl bg-accent(?=[\s'"`])/g`
  (`primaryRadius` y `#98 R10`) pasan de `13 + 1 + 1 + 1 + 1` (17) a 19: `docs-upload` y
  `docs-upload-submit`. `docs-empty-action` sale de `EmptyState`, que ya se cuenta una vez en
  `empty-state.tsx`, y no suma. Correcto.
- `style={CONTINUOUS_CORNER}` global `31 + 1`: no lo mueve la spec (la fila `DocumentRow` ya existe). Correcto.
- `design-drift.test.ts` `screenSignOutCalls['screens/docs/index.tsx']` 0 → 1, y R9 exige un único
  `signOut(`. Coherente.
- `R7_PROFILE` `35 - 1 + 2 + 1 + 16` y B19 6 → 22: ver §7.

### 2. Candados de import y de clases (guards globales)

- Ningún guard prohíbe `expo-document-picker`, `expo-web-browser`, `KeyboardAvoidingView`,
  `HeaderHeightContext` ni `signOut` en `screens/docs/index.tsx`. `signOut` solo lo rige
  `screenSignOutCalls`.
- `design-drift` `FEATURE_STYLE_ESCAPES` (text-[10px], hex, `StyleSheet`) cubre `api/media.ts`,
  `screens/docs/index.tsx` y también los tests colocados (`sourceFiles` solo excluye `__tests__`).
  Nada de lo prescrito usa esos escapes. `queryKey: [` literal prohibido: la spec usa
  `mediaKeys.petDocs`. C8 (clases arbitrarias `-[...]`): nada prescrito las usa.
- `legibility-classnames.test.ts` prohíbe `text-accent` suelto (`/text-accent(?![-\w])/`). La spec
  prescribe `text-accent-foreground` (vía `EmptyState`) y ningún `text-accent` suelto. No hay guard
  sobre `text-danger`, `bg-default`, `variant="outline"` ni `text-2xs font-semibold`.

Sin hallazgos en esta sección.

### 3. Barrido cláusula × rama × candado y sondas de mutación

Para cada requisito: la cláusula, la mutación plantada en zona ciega y si el rojo esperado es por
aserción o por consulta. Las filas marcadas "VERDE" son las que dan pie a un hallazgo.

| Req | Cláusula / miembro | Mutación (un solo sitio) | Resultado con los `it` de tasks.md |
|---|---|---|---|
| R1 | 12 claves nuevas + `docs.emptyBody` cambiada en catálogo es/en | quitar una clave de `en` | rojo por aserción (language-provider, longitud y paridad de catálogo) |
| R2 | create 201 válido | devolver `error` siempre | rojo por aserción |
| R2 | create "201 con otro body" | validar solo `uploadUrl`, no `document.id` (copia de `requestPhotoUploadUrl`) | VERDE si la fila usa body sin `uploadUrl` (B-J) |
| R2 | confirm "cualquier otro, también 200" | `response.ok` en vez de `=== 204` | VERDE si la muestra es 500 (B-J) |
| R2 | confirm "409 con otro code o sin body" | `body.code` sin guard de null | VERDE si solo se prueba "otro code" (B-J) |
| R2 | `resolveDocumentContentType`: mayúsculas, `?`, `#`, precedencia del mimeType | quitar `toLowerCase` de la extensión / partir solo por `?` / mirar la extensión primero | VERDE en las ramas sin fila (B-J) |
| R3 | `docs-upload` 2.º hijo para owner con documentos | pintarlo tras las filas | rojo por aserción (orden de hijos) |
| R3 | `docs-empty-action` para owner con lista vacía | no pasar `action` a `EmptyState` | rojo por consulta (`getByTestId`) |
| R3 | `docs-upload` solo "con la lista en `{ kind: 'ok' }` y al menos un documento" | condición `isOwner && !listaVaciaOk` (pinta `docs-upload` con skeleton y con `docs-error`) | VERDE: solo se prueban lista ok con documento y lista ok vacía (B-L) |
| R3 | WHILE pet no resuelto ok: ninguno de los dos | condición solo en `docs-empty-action` (pending + documentos pinta `docs-upload`) | VERDE: tasks solo cubre pending × lista vacía (B-G) |
| R4 | 3 roles no-owner × 2 listas: sin `docs-upload` ni acción | `role !== 'family'` | rojo por aserción (it.each de roles) |
| R5 | 6 filas del picker | ignorar `canceled` | rojo por aserción en la fila de cancelación solo si la fila dice qué asevera (B-F) |
| R5 | `docs-action-error` tras el slot del formulario, antes de vacío/filas/error | pintarlo antes del slot, o dentro del formulario | VERDE: solo se asevera `['View','docs-action-error','docs-empty']` (B-F) |
| R5 | cancelar: cierra, vacía campos, quita error, vuelve la entrada | no vaciar campos / no limpiar error | VERDE (B-E) |
| R5 | "vuelve `docs-upload` o `docs-empty-action`" (dos entradas) | volver siempre a `docs-empty-action` | VERDE: solo se prueba la entrada con lista vacía (B-E) |
| R6 | validación sobre `type.trim()`, `name.trim()`, `date.trim()` | validar `date` sin trim | rojo por aserción (fila de fecha con espacios) |
| R7 | 6 pasos en orden | invertir PUT y confirm | rojo por aserción (`invocationCallOrder`) |
| R7 | trim de type, name, date; vet solo si no vacío | no recortar `name` / `date` | VERDE: solo type y vet llevan espacios en el test (B-I) |
| R7 | vet "vacío" | `vet ? { vet: vet.trim() } : {}` | VERDE con `''`; rojo solo con `'   '` (B-I) |
| R7 | `contentType` del asset | constante `'application/pdf'` | VERDE con una sola muestra PDF (B-I) |
| R8 | WHILE desde que pasa R6 hasta refetch/error: tramo de lectura del blob | `setUploading(true)` después de leer el blob | VERDE: el it.each tiene 4 etapas (create, PUT, confirm, refetch), no la lectura (B-B) |
| R8 | rehabilitar tras error de R9 en cada paso | olvidar `setUploading(false)` en el catch de lectura, PUT o confirm | VERDE: solo se prueba create-forbidden (B-C) |
| R9 | 18 filas × 3 consecuencias (literal, formulario abierto con valores, sin refetch) | resetear type/date/vet en la ruta de error | VERDE: solo se asevera `docs-name-input` (B-D) |
| R9 | fila "`fetch(asset.uri)` o `.blob()` rechaza" | `try` solo alrededor de `fetch` | VERDE si la fila rechaza en `fetch` (B-D) |
| R9 | fila de lectura: "no se llama a `createPetDocument`" | sin `return` tras el catch de lectura | VERDE (B-D) |
| R9 | unauthorized: `signOut` sin error | pintar el error además | rojo por aserción |
| R10 | 4 roles abren `openBrowserAsync(downloadUrl)` | `isOwner &&` en el onPress | rojo por aserción (it.each de roles) |
| R10 | rechazo de `openBrowserAsync` muestra `Algo salió mal` para los 4 roles | `isOwner &&` alrededor de `docs-action-error` | VERDE: tasks no fija rol y el defecto es owner (B-H) |
| R11 | `paddingBottom: 291` con `keyboardVerticalOffset={headerHeight}` | `keyboardVerticalOffset={0}` | el `it` no puede llegar a verde (B-A) |
| R12 | inventario de ocurrencias | quitar un uso de `docs.upload` | rojo por aserción (`R7_PROFILE`) |

### 4. Hallazgos bloqueantes

**B-A. R11, premisa falsa: `renderDocs()` no provee `HeaderHeightContext`.**
- Cláusula: tasks R11 dice copiar #148 R7 de `weight-log/index.test.tsx` y esperar `paddingBottom: 291`
  usando `renderDocs()`.
- Por qué falla: el 291 de #148 sale de `700 - (500 - 91)`, y el 91 lo pone `renderWeightLog`, que
  envuelve la pantalla en `<HeaderHeightContext.Provider value={91}>`. `renderDocs()` en
  `screens/docs/index.test.tsx` no tiene ese provider: `headerHeight` llega `undefined`, el offset
  es 0 y el `paddingBottom` real es 200. El `it` no llega a verde. Y si Codex "arregla" el número a
  200, `keyboardVerticalOffset={headerHeight}` queda ciego: la mutación `keyboardVerticalOffset={0}`
  sigue verde.
- Arreglo mínimo: prescribir en tasks R11 que `renderDocs()` (o el `it` de R11) envuelva en
  `<HeaderHeightContext.Provider value={91}>` igual que `renderWeightLog`. Mantener 291. No mueve
  recuentos.

**B-B. R8, tramo de la ventana WHILE sin candado: la lectura del blob.**
- Cláusula: R8, "desde que pasa la validación de R6 hasta …". El paso 1 de R7 es leer el archivo
  (`fetch(asset.uri)` y `.blob()`), y el it.each de R8 cubre cuatro etapas (create, PUT, confirm,
  refetch).
- Por qué es ciego: la mutación `setUploading(true)` colocada tras leer el blob deja verdes las
  cuatro filas, y durante la lectura los dos botones siguen activos: una segunda pulsación lanza
  dos flujos.
- Arreglo mínimo: añadir una 5.ª fila al it.each con `globalThis.fetch` pendiente. Aseverar ambos
  botones deshabilitados y que `globalThis.fetch` se llama una sola vez tras la segunda pulsación.
  En requirements R8, "cuatro etapas" pasa a cinco y se añade "no vuelve a leer el archivo". Mueve
  el it.each de R8 de 4 a 5 filas.

**B-C. R8, rehabilitar tras error de R9 solo se prueba en un paso.**
- Cláusula: R8, "los botones vuelven a estar habilitados tras un error de R9". El candado solo usa
  create-forbidden.
- Por qué es ciego: olvidar `setUploading(false)` en el catch de lectura, de PUT o de confirm queda
  verde.
- Arreglo mínimo: añadir al it.each de 18 filas de R9 la aserción
  `accessibilityState.disabled` falsa en `docs-upload-submit` y `docs-upload-cancel`. Sin cambio de
  recuentos.

**B-D. R9, consecuencias heredadas sin aseverar.**
- Cláusula 1: "el formulario sigue abierto con los valores que el owner escribió" hereda los cuatro
  campos, pero el it.each solo asevera `docs-name-input`. Mutación: resetear type, date o vet en la
  ruta de error, verde. Arreglo: aseverar los cuatro inputs en el it.each.
- Cláusula 2: la fila "`fetch(asset.uri)` o `.blob()` rechaza" junta dos miembros. Mutación: `try`
  solo alrededor de `fetch` (un rechazo de `.blob()` escapa sin manejar), verde si la fila rechaza
  en `fetch`. Arreglo: partir en dos filas. El it.each pasa de 18 a 19 filas.
- Cláusula 3: "(no se llama a `createPetDocument`)" en las filas de lectura no se asevera.
  Mutación: sin `return` tras el catch de lectura, verde. Arreglo: aseverar
  `createPetDocument` no llamado en las filas de lectura. Sin cambio de recuentos más allá del
  anterior.

**B-E. R5, cancelar: dos consecuencias y una entrada sin candado.**
- Cláusula: "cancelar cierra el formulario, vacía sus campos, quita `docs-action-error` y vuelve a
  pintar `docs-upload` o `docs-empty-action` sin llamar a la API".
- Por qué es ciego: el `it` de cancelar no comprueba "vaciar sus campos" ni "quitar
  `docs-action-error`". Y solo se prueba la entrada `docs-empty-action` (lista vacía): "vuelve
  `docs-upload`" con documentos no tiene candado, y tampoco "pulsar de nuevo quita el error" desde
  `docs-upload`.
- Sujeto: el error y el formulario abierto solo coexisten a partir de R6 (error de validación), así
  que "quitar el error al cancelar" no se puede aseverar en R5 sin crear un sujeto que su paso aún
  no pinta.
- Ambigüedad a cerrar: "vaciar" choca con la fecha, cuyo valor inicial es `civilTodayIso(undefined)`.
  La spec debería decir "volver al valor inicial de la tabla de R5".
- Arreglo mínimo:
  - en el `it` de cancelar de R5, escribir en los campos, cancelar, reabrir y esperar los valores
    iniciales;
  - en un `it` de R6, tras el error de validación, pulsar cancelar y aseverar `docs-action-error`
    ausente;
  - convertir el `it` de cancelar (y el de "pulsar de nuevo quita el error") en `it.each` sobre las
    dos entradas (`[]` con `docs-empty-action`, `[doc-1]` con `docs-upload`). Suma 1 `it` por cada
    uno que pase a dos filas.

**B-F. R5, posición de `docs-action-error` y fila de cancelación del picker.**
- Cláusula: "`docs-action-error` va tras el slot del formulario y antes de `docs-empty`, las filas y
  `docs-error`".
- Por qué es ciego: solo se asevera `['View','docs-action-error','docs-empty']`. Con lista vacía no
  hay hermano `docs-upload`, así que pintar el error antes del slot, o dentro del formulario, sigue
  verde.
- Arreglo mínimo: aseverar también `['View','docs-upload','docs-action-error','doc-doc-1']` (error
  del picker con documentos) y `['View','docs-upload-form','docs-action-error','docs-empty']` (error
  de R6 con el formulario abierto). Lo segundo va en R6 por sujeto.
- La fila `canceled: true` de la tabla del picker no dice qué asevera. Debe decir: formulario
  ausente y `docs-action-error` ausente. Sin cambio de recuentos.

**B-G. R3, ventana WHILE "pet no resuelto ok" probada en un solo caso.**
- Cláusula: R3, mientras el pet no resuelva ok no se pintan ni `docs-upload` ni `docs-empty-action`.
- Por qué es ciego: tasks solo cubre pending × lista vacía. Una condición que solo mire
  `docs-empty-action` (o un deny-list `role !== …` sobre `docs-upload`) con pending y documentos
  queda verde.
- Arreglo mínimo: `it.each` sobre lista `[]` y `[doc-1]`, y opcionalmente pet `{ kind: 'error' }`.
  R3 pasa de +1 a +2 `it` (o +3 con la fila de error).

**B-H. R10, el rechazo de `openBrowserAsync` sin rol fijado.**
- Cláusula: R10, los 4 roles abren el documento, y si `openBrowserAsync` rechaza se muestra
  `Algo salió mal`. La cláusula del rechazo hereda los 4 roles.
- Por qué es ciego: tasks no fija rol para el rechazo y `makePet()` da owner. La mutación que pinta
  `docs-action-error` solo cuando `isOwner` (el error vive junto al slot del formulario, que es
  owner-only) queda verde.
- Arreglo mínimo: correr el `it` del rechazo como it.each sobre los 4 roles, o al menos con
  `family`. +3 filas si va con los 4.

**B-I. R7, trims y `contentType` con una sola muestra.**
- Cláusula: create recibe type, name y date recortados, vet solo si no está vacío, y el
  `contentType` resuelto del asset.
- Por qué es ciego:
  - solo type y vet llevan espacios en el test, así que no recortar `name` o `date` queda verde;
  - vet "vacío" se prueba con `''`, y `vet ? { vet: vet.trim() } : {}` queda verde; solo `'   '`
    lo distingue;
  - `contentType` depende del asset y hay una sola muestra (PDF): la constante
    `'application/pdf'` queda verde.
- Arreglo mínimo: name `' Antirrábica '`, fecha tecleada con espacios, vet `'   '`, y un segundo
  `it` (o fila) con un PNG con `mimeType` undefined que espere `image/png`. +1 `it` en R7.

**B-J. R2, filas de tabla con "o", "también" e "y".**
- create "201 con otro body": dos muestras, una sin `document.id` y otra sin `uploadUrl`. La copia
  literal de `requestPhotoUploadUrl` (que solo comprueba `uploadUrl`) queda verde con la muestra
  que falte.
- confirm "cualquier otro, también 200": nombrar 200 explícitamente más otra muestra. Con solo 500,
  `response.ok` queda verde.
- confirm "409 con otro code o sin body": las dos. `body.code` sin guard de null queda verde si solo
  se prueba "otro code".
- `resolveDocumentContentType`: una fila por rama: mayúsculas en el mimeType y en la extensión, `?`
  y `#` por separado, y precedencia del mimeType sobre la extensión (`image/png` + `x.pdf` da png).
  Opcional: `downloadUrl: null` además de ausente en `isPetDocument`.
- Arreglo mínimo: añadir esas filas al it.each de R2. Mueve el recuento de filas de R2 (una por
  muestra añadida).

**B-K. Orden de commits: R3 verde deja rojo un test de #155.**
- Cláusula: tasks mueve `#155 R7 › no ofrece acción` a `family` en R4 (rojo).
- Por qué falla: ese test usa `makePet()`, que da owner. R3 verde añade `docs-empty-action` para
  owner, así que `no ofrece acción` se pone rojo en el commit verde de R3, y su arreglo llega en el
  rojo de R4, después.
- Arreglo mínimo: mover la redirección a `family` al paso de R3 (rojo), antes del verde. Sin cambio
  de recuentos.

**B-L. R3, `docs-upload` con la lista sin resolver o en error: miembro de la condición sin candado y sin decisión escrita.**
- Cláusula: R3, "con la lista en `{ kind: 'ok' }` y al menos un documento, pintar … `docs-upload`".
  La condición tiene dos miembros (lista ok, al menos un documento) y la spec no dice qué pasa con
  los hermanos condicionales que coexisten: `docs-list-skeleton` (`docs.data === undefined`) y
  `docs-error` (lista en error).
- Por qué es ciego: los `it` de R3 solo usan lista ok con un documento y lista ok vacía. La
  mutación `isOwner && !(lista ok && vacía)` pinta `docs-upload` encima del skeleton y encima de
  `docs-error`, y todo queda verde. Tampoco hay `SHALL NOT` que lo prohíba: es una decisión abierta
  que Codex cerrará por su cuenta.
- Arreglo mínimo: añadir a R3 la frase "con la lista sin resolver o en error, no pintar
  `docs-upload`" (o, si se quiere permitir subir con la lista en error, decirlo y fijar su posición
  respecto a `docs-error`), y un `it.each` de owner sobre lista `pending()` y lista
  `{ kind: 'error' }` que asevere `docs-upload` y `docs-empty-action` ausentes. +1 `it` (2 filas) en R3.
- Cambio de mascota: la pantalla vive en la ruta empujada `src/app/pets/[petId]/docs.tsx` y recibe
  `petId` por prop. Otra mascota es otra instancia de pantalla, así que el estado del formulario y
  de `docs-action-error` no puede filtrarse entre mascotas. No hace falta candado.

### 5. Hallazgos no bloqueantes

**N-1. R8, pulsar cancelar con los botones deshabilitados.** La spec solo exige
`accessibilityState.disabled`. Añadir "pulsar `docs-upload-cancel` no cierra el formulario" y
aseverarlo en el it.each de R8 (sin cambio de recuentos).

**N-2. R5, `getDocumentAsync` rechaza.** No especificado. Es realista con un dev build antiguo sin
el módulo nativo. Sugerencia: `docs-action-error` con `Algo salió mal`, como fila más de la tabla
del picker (+1 fila).

**N-3. R10, el error de no-owner no se limpia nunca.** Para un no-owner no hay formulario ni
`docs-upload` que vuelva a pulsar. Sugerencia: limpiar `docs-action-error` al pulsar otra fila.

**N-4. R7 paso 6 frente a un refetch que devuelve no-ok.** Caso borde. El resultado (se cierra el
formulario y R3 oculta la entrada) es coherente con R3. Basta con nombrarlo.

**N-5. R5, classNames sin candado.** Label `text-2xs font-semibold text-foreground`, Input
`rounded-xl bg-default`, cancelar `rounded-xl` outline, y `docs-action-error` `selectable` y
`text-danger`: ningún `it` los asevera y no hay guard global. Sugerencia: aseverar className y
`selectable` en el `it` de R5 que abre el formulario.

**N-6. R13 (smoke), supuestos de entorno no escritos.**
- LocalStack 4.14 community no persiste (no hay `PERSISTENCE`). Tras `docker compose up -d localstack`
  hace falta `pnpm -C backend-pet-tracker run provision:local`, o el bucket `pet-tracker-media-local`
  no existe (ver `docs/demo-runbook.md:83`).
- `.env` raíz con `AWS_MODE=local` y credenciales test/test.
- `AWS_PRESIGN_ENDPOINT_URL` está comentada en `.env.example`. Hay que descomentarla con la IP LAN.
- `createS3Client` en modo local usa `presignEndpoint` como endpoint del cliente. El `HeadObject`
  del confirm del backend también va a `<IP LAN>:4566`, así que el host tiene que alcanzar su
  propia IP LAN en ese puerto.
- La `downloadUrl` del GET se firma con el mismo endpoint que el PUT: confirmado.
- El humano está en Windows. La spec ya usa `findstr`.

**N-7. Voz B y `{{petName}}`.** `docs/ui-guidelines.md` punto 7 dice que Pingo "llama a la mascota
del usuario por su nombre, con el marcador `{{petName}}`". El nuevo `docs.emptyBody` dice "de tu
mascota", igual que la versión de #155 que se aprobó y que `geofences.emptyBody`. Cumple el resto de
la voz B (primera persona, tuteo, sin emoji, sin exclamación, termina en punto, lo que también exige
`#155 R1` en `empty-state.test.tsx`). Decidir en el gate si se mantiene el precedente o se pasa a
`{{petName}}`. La pantalla ya tiene `petName`. No mueve recuentos: `checkUses` sigue contando
un `t('docs.emptyBody'`.

### 6. Premisas confirmadas contra `65f37841`

- `#155 R7 › no ofrece acción` usa owner (`makePet()` da `myRole: 'owner'`).
- `PhotoUploadState` tiene tres kinds (`ok | error | unreachable`) y `uploadPhotoToUrl` nunca rechaza.
- `Card` con `onPress` pinta `Pressable` con `accessibilityRole="button"`.
- `civilTodayIso` existe (B26).
- `mediaKeys.petDocs` existe.
- `myRole` llega por la query de `getPet` (`pet.data.pet.myRole`).
- Backend: create 201 (sin `@HttpCode`), confirm 204, 404 `PET_DOCUMENT_NOT_FOUND`, 409
  `PET_DOCUMENT_NOT_UPLOADED` / `PET_DOCUMENT_TOO_LARGE`, body `{ statusCode, code, message }`.
- El `Button` de HeroUI lleva el `testID` en el host más externo (precedente:
  `empty-state.test.tsx`, que lista `'probe-action'` entre los hijos).
- Falsa: ver B-A (`renderDocs()` sin `HeaderHeightContext.Provider`). `weight-log/index.tsx` lee
  `useContext(HeaderHeightContext)` sin valor por defecto. Sin provider, `keyboardVerticalOffset`
  llega `undefined` y el `KeyboardAvoidingView` calcula `700 - 500 = 200`, no `700 - (500 - 91) = 291`.

### 7. Catálogo, inventario y literales

- Catálogo: ninguna de las 12 claves nuevas existe hoy en `src/i18n/catalog.ts` (`grep` de cada
  `docs.<clave>` da 0). `docs.emptyBody` existe en `en` (línea 234) y `es` (línea 610) y cambia.
- Los dos literales viejos de `docs.emptyBody` que hay en tests (`copyRows` de
  `empty-state.test.tsx:19` y `screens/docs/index.test.tsx:337`) están los dos en tasks R1. No hay
  más apariciones del literal viejo fuera de specs históricas.
- Ledger `specs/mobile-ui-language/design.md`: ningún test compara el texto de la tabla con el
  catálogo. La fila de #155 para `docs.emptyBody` puede quedarse con el texto viejo sin romper
  nada: `#155 R1` solo busca `← (?:añadida|cambiada) por #155 (R1)`. La nueva sección `§2.22` y el
  patrón de fila de tasks R1 casan con el formato de las filas existentes (`| — | <clave entre comillas invertidas> | …`).
- `R7_PROFILE` (`ui-copy-table.ts`) es una fila por ocurrencia (`{ file, key }`) y `checkUses`
  cuenta por fichero las apariciones de `t('<clave>'` más `labelKey: '<clave>'`. Las 16 filas de
  design §Ocurrencias (`docs.upload` × 3, el resto × 1) dan 37 → 53, y B19 (filas de
  `screens/docs/index.tsx`) 6 → 22. Cuadra con tasks R12.
  - Riesgo que la spec ya cubre: si Codex traduce los errores con un mapa (`t(ERROR_KEY[e])`),
    `checkUses` da 0 para cada clave de error y R12 se pone rojo. design §Ocurrencias dice que
    cuenta `t('<clave>'` literal, así que la forma está escrita. No es hallazgo.
- `SCREEN_FILES` sigue en 29: no hay ruta nueva (D1). Correcto.
- `primaryButtons` (`consistency-classnames.test.ts:66`, #120 R1) no es un inventario exhaustivo
  (4 entradas frente a 17 usos). `docs-upload` y `docs-upload-submit` no tienen que entrar.
  Los dos recuentos globales suben 17 → 18 en R3 y 18 → 19 en R5, como dice tasks.
- Literales de copy: cada `it` que espera texto tiene su literal `es` en requirements §Copy nueva.
  Las claves de error no terminan en punto y la de `docs.emptyBody` sí, como el resto del copy de
  error y de Pingo respectivamente. Voz B: ver N-7.

## Pre-verificación ronda 1b (enmiendas)

Fecha: 2026-10-09. Worktree `Pet-Tracker-wt-158`, HEAD `65f37841`, spec en borrador (sin commitear).
Solo lectura: no se corrió jest ni `./init.sh` (orden del leader: la sesión Frontend usa los recursos compartidos).
Lo que solo se decide ejecutando queda como «pendiente de spike», con su comando.

### Resumen

- Bloqueantes nuevos: **3** (B2-1, B2-2, B2-3).
- No bloqueantes nuevos: **6** (N2-1 … N2-6).
- Ronda 1: 11 de 12 bloqueantes cerrados (B-L no), 5 de 6 no bloqueantes cerrados (N-5 no). N-7 sigue abierto como DA8, sin tocar.

### Cierre de la ronda 1

| Id | ¿Cerrado? | Dónde |
|---|---|---|
| B-A | sí | Tareas R11: `renderDocs()` envuelve en `HeaderHeightContext.Provider value={91}`. B34 = 1 y B35 = 0, medidos. |
| B-B | sí | R8 tiene 6 etapas con la lectura `.blob()` aparte. La sincronización de todas las etapas va en B2-2. |
| B-C | sí | R8 «Rehabilitar» (create `forbidden`, con create prohibido) y las 19 filas de R9 aseveran `disabled` falso en los dos botones. |
| B-D | sí | R9: 19 filas (fetch y blob separados), los cuatro inputs por `props.value`, el paso siguiente sin llamar. |
| B-E | sí | R5 cancelar (`it.each` de 2 entradas: campos vacíos, fecha inicial, sin create ni fetch) y R6 cancelar con el error pintado. |
| B-F | sí | R5: los órdenes `['View','docs-action-error','docs-empty']` y `['View','docs-upload','docs-action-error','doc-doc-1']`; la fila «cancelado» está en la tabla del selector. |
| B-G | sí | R3: `it.each` de 10 filas (5 estados de la mascota × 2 listas), esperando la lista pintada. |
| B-H | sí | R10: el rechazo cubre los 4 roles, cada uno con el orden de sus hijos. |
| B-I | sí | R7: dos candados de secuencia (PDF con los cuatro campos rellenos de espacios; PNG sin mime y veterinario solo con espacios). |
| B-J | sí | R2: las filas unidas por «o», «también» e «y» van separadas (3 + 17 + 11 + 12). |
| B-K | sí | La redirección del test de #155 va en el rojo de R3. El `queda en el sitio` de #155 R7 sigue válido: la acción vive dentro de `docs-empty`. |
| B-L | **no** | Las 7 filas existen, pero la fila «lista `pending()`» no deja establecido que el usuario es owner (B2-3). |
| N-1 | sí | R8: pulsar cancelar con los botones desactivados deja `docs-upload-form` en pantalla. |
| N-2 | sí | Tabla del selector de R5: el rechazo da `Algo salió mal`. |
| N-3 | sí | R10: tocar una fila borra el error, también con family. R5: pulsar otra vez la entrada lo borra (2 candados). |
| N-4 | sí | R7: un refetch que no da `ok` cierra el formulario y pinta `docs-error`. |
| N-5 | **no** (parcial) | Inputs y etiquetas, candados. `docs-upload-cancel`: solo `rounded-xl`. Detalle en N2-3. |
| N-6 | sí | R13: precondiciones de entorno. Anclas B42-B44 medidas = 1. |

### Bloqueantes

**B2-1 — R2.2, cláusula «si no lo reconoce, por la extensión de fileName».**
La cláusula vale para cualquier mime que no se reconozca, pero solo una fila lleva un mime no reconocido con una extensión válida: `'application/octet-stream'` + `'a.pdf'`.
En las filas `'image/webp'` + `'a.webp'` y `'text/plain'` + `'a.txt'` el resultado es `null` con las dos lecturas, así que no distinguen nada.

Mutación que sigue en verde: limitar el respaldo a `!mimeType || mimeType === 'application/octet-stream'` y devolver `null` para cualquier otro mime no reconocido.

Arreglo mínimo, que lleva el candado a la cláusula entera: añadir dos filas.
- `'image/heic'` + `'a.jpg'` → `'image/jpeg'`
- `'text/plain'` + `'a.png'` → `'image/png'`

Si la regla que se quiere es la estrecha (solo octet-stream o sin mime), hay que reescribir la cláusula y fijar esas dos filas en `null`.
En cualquiera de los dos casos hay que recontar: tabla 17 → 19, R2 47 → 49, `media.test.ts` 62 → 64, y las mismas cifras en `tasks.md` §Recuentos y en `traceability.md`.

**B2-2 — R8, WHILE la subida está en curso, etapa por etapa (las 6 filas del `it.each`).**
Las tareas de R8 no dicen cómo sincronizar el test con la etapa que queda en `pending()`.
Además, `tasks.md` §Esperas (línea 58) prohíbe esperar al contador de llamadas de un mock. Ninguna etapa pendiente pinta texto, así que esa es la única espera que llega a la etapa.

El problema: tras `await fireEvent.press(submit)`, la cadena fetch → `.blob()` → create → PUT → confirm → refetch no tiene por qué haber llegado a la etapa de la fila. El `disabled === true` que se observa puede ser el del `setUploading(true)` del momento de pulsar.

Mutación que sigue en verde: rehabilitar los botones en cuanto resuelve `createPetDocument`, antes de `uploadPhotoToUrl`.
- La fila «`uploadPhotoToUrl` pendiente» la pasa si asevera antes de que la cadena llegue al PUT.
- La aserción «`createPetDocument` en 1» solo demuestra que se llegó a la etapa 3, y solo si se mide después.

Arreglo mínimo: en cada fila, antes de las tres aserciones, una espera explícita, escrita como excepción a §Esperas para R8 («la etapa pendiente no pinta texto»).
- `await waitFor(() => expect(<mock de la etapa>).toHaveBeenCalledTimes(1))`
- Mocks por etapa, en orden: `globalThis.fetch`; el `jest.fn` de `blob`; `createPetDocument`; `uploadPhotoToUrl`; `confirmPetDocumentUpload`; y `listPetDocs` con `toHaveBeenCalledTimes(2)`.
- La segunda pulsación y la de cancelar van después de esa espera.

Pendiente de spike (solo cuando exista la implementación): plantar la mutación en `src/screens/docs/index.tsx` y correr `cd mobile-pet-tracker && bunx jest src/screens/docs/index.test.tsx -t '#158 R8'`. Con la espera tiene que salir rojo; sin ella, se comprueba si sale verde.

**B2-3 — R3, decisión B-L: WHILE la lista no está en `ok`, el owner no ve `docs-upload` ni `docs-empty-action`. Fila «lista `pending()`» del `it.each` de 7 filas.**
`docs-list-skeleton` está desde el primer render, antes de que resuelva la consulta de la mascota.
TanStack Query v5 notifica con `setTimeout(0)`, y `await render(...)` no vacía macrotareas. En el momento de aseverar, `pet.data` puede seguir `undefined` y, con él, «es owner» puede ser falso.

Mutación que sigue en verde: pintar `docs-upload` cuando `isOwner && docs.data === undefined`, o cuando es owner sin mirar la lista en la etapa de esqueleto. La aserción `null` pasa porque todavía no se sabe que el usuario es owner.

Las otras 6 filas (`docs-error`) y las 10 de la mascota sí esperan algo pintado, aunque ver N2-4.

Arreglo mínimo: en las 7 filas, antes de aseverar la ausencia, `await screen.findByText('Luna')`.
- La pantalla pinta `{petName ?? t('docs.pet')}` (línea 77; ancla B40), así que `Luna` solo aparece con la mascota en `ok`.
- Es «texto final ya pintado», compatible con §Esperas.

### No bloqueantes

**N2-1 — R2.2, recorte en `?`/`#` sobre `fileName`.**
El recorte viene de `resolvePhotoContentType`, que recibe una URI. Aquí se aplica al nombre visible del asset.
Un `'Factura #12.pdf'` sin mime queda en `'Factura '` y da `null`: un PDF válido acabaría en `Elige un archivo PDF, JPEG o PNG`.
Es raro, porque el selector casi siempre trae `mimeType`.
Propuesta: no recortar el nombre (o recortar solo la URI) y añadir la fila `undefined` + `'Factura #12.pdf'` → `'application/pdf'`. Si se mantiene el recorte, dejarlo escrito como decisión.

**N2-2 — R2.2, fila `'a'` → `null`.**
No fija el punto de la extensión. Mutación en verde: `name.endsWith('pdf')` sin el punto.
Añadir `undefined` + `'apdf'` → `null` (y recontar como en B2-1).

**N2-3 — R5, clases y variantes (lo que queda de N-5).**
Sin candado:
- `variant="outline"` de `docs-upload-cancel`;
- `Button.Label className="font-semibold"` de cancelar;
- `Button.Label className="font-bold text-accent-foreground"` de `docs-upload-submit` y de `docs-upload` (R3);
- `className="rounded-xl bg-accent"` de submit y de `docs-upload`.

Lo único que los cubre es el recuento agregado de `consistency-classnames`, que puede cuadrar con la clase en otro nodo, y el grep de cierre de R12 (`= 2`), que no es un test.
Añadir al `it` de props: `props.variant === 'outline'` (o lo que exponga HeroUI) y `expect.stringContaining` para cada clase prescrita.

**N2-4 — R3, las 10 filas de la mascota que no está en `ok`.**
Esperan la lista pintada, pero la consulta de la mascota resuelve en otro lote de notificación.
Mutación con poco margen para seguir en verde: pintar la acción cuando `pet.data !== undefined && (pet.data.kind !== 'ok' || role === 'owner')`, si la aserción cae entre el lote de la lista y el de la mascota.
Para `error`, `unreachable` y `missing-config` se puede esperar a que `getByText('Mascota')` (el literal `es` de `docs.pet`) siga ahí después de que `queryClient.getQueryState(<clave de la mascota>)?.status` sea `'success'`.
O, más simple, aseverar la ausencia dentro de un `waitFor` que también exija ese estado.

**N2-5 — R9, «WHEN empieza un nuevo intento (pulsar `docs-upload-submit`)», quitar el error.**
El candado deja `createPetDocument` en `pending()`, así que fetch y `.blob()` ya resolvieron.
Mutación en verde: borrar el error después de leer el fichero, no al pulsar.
Arreglo de una palabra: el nuevo intento con `globalThis.fetch` en `pending()`, no el create.

**N2-6 — Coexistencia de `docs-action-error` y `docs-error`, sin la cláusula de posición «antes de `docs-error`».**
Respuesta: hoy no pueden coexistir.
La lista solo pasa de `ok` a no-`ok` por un refetch, y ningún camino deja vivo un error de acción cuando ese refetch llega:
- `src/providers/query-provider.tsx` tiene `refetchOnWindowFocus: false,` = 1 y `refetchOnReconnect: false,` = 1 (medidos);
- `screens/docs/index.tsx` no tiene `refetchInterval` ni `useFocusEffect` (0);
- `petDocs` solo aparece en `src/api/query-keys.ts` y `src/screens/docs/index.tsx`, así que nadie más invalida la lista;
- el único refetch propio es el paso 6 de R7, y ese intento empezó borrando el error (R9 «nuevo intento»); si el refetch no da `ok`, R7 pinta `docs-error` y no un error de acción;
- `docs-retry` solo existe con la lista ya en no-`ok`, y entonces no hay entradas ni filas que generen errores de acción (R3 y R10).

La justificación de la spec (solo B-L) es incompleta, porque B-L no habla de refetch.
Propuesta: escribirla en design.md con dos anclas, `grep -cF 'refetchOnWindowFocus: false,' src/providers/query-provider.tsx` = 1 y `grep -rlF 'petDocs' src --include=*.ts --include=*.tsx | grep -v test` = 2 ficheros. Así, si alguien activa el refetch por foco, la premisa se cae a la vista.

Hueco relacionado, sin especificar: si la consulta de la **mascota** se refresca desde otra pantalla mientras docs está montada (invalidaciones de `petKeys` con el observador activo) y pasa a no-`ok`, R3 quita las entradas pero el `docs-action-error` local sigue.
El orden quedaría `['View','docs-action-error','doc-doc-1']`, que nadie fija. Lo mismo con el formulario abierto.
Si el leader quiere candado: `renderWithProviders` devuelve `queryClient`; con un error pintado, `queryClient.refetchQueries` con la mascota en `{ kind: 'error' }` y aseverar el orden o `docs-action-error` = `null`.
Si no, dejar escrito que queda fuera.

### Recuentos (verificados a mano)

- Bases: `docs/index.test.tsx` 16; `media.test.ts` 15 (6 `it` + 5 + 4 filas de `it.each`); `language-provider.test.tsx` 24 (13 `it` + 2 + 9 filas de `it.each`). Las tres cuadran con el diseño.
- R2: 3 + 17 + 1 + 11 + 1 + 12 + 1 + 1 = 47 (15 → 62).
- Pantalla: R3 21, R4 6, R5 16, R6 5, R7 3, R8 7, R9 22, R10 9, R11 2, en total 91.
  - Acumulados: 16 → 37 → 43 → 59 → 64 → 67 → 74 → 96 → 105 → 107.
  - Total con R1 y R2: 139 `it` nuevos.
- Recuentos de tablas:
  - R3: 1 + 1 + 2 + 7 + 10 = 21;
  - R5: 2 + 2 + 2 + 1 + 2 + 7 = 16;
  - R8: 6 + 1;
  - R9: 19 + 2 + 1.
- `traceability.md` coincide con `tasks.md` §Recuentos.
- R1: 12 claves nuevas + 1 cambiada; `+ 12 // #158 R1`, 371 → 383; 1 `it` (24 → 25).
- R12: `35 - 1 + 2 + 1 + 16` = 53 (base 37). §Ocurrencias = 16. B19 6 → 22. `SCREEN_FILES` 29 sin cambio.
  - `consistency-classnames`, en los dos sitios: 17 → 18 en R3 (`docs-upload`) → 19 en R5 (`docs-upload-submit`). Cuadra con el grep de cierre `rounded-xl bg-accent` = 2 en `docs/index.tsx`.
  - `screenSignOutCalls` 0 → 1 en el rojo de R9.
- Si se acepta B2-1 (y N2-2), hay que recontar `media.test.ts`, R2 y la trazabilidad.

### Ampliaciones del spec_author contra el contrato del backend

- `downloadUrl`: el backend siempre manda un `string` (`list-pet-documents.use-case.ts`, `downloadUrl: await this.storage.createDownloadUrl(...)`; el mapper lo tipa `string`). Rechazar ausente, `null` o `42` es más estricto, no contradice.
- `application/octet-stream` → extensión, `IMAGE/PNG`, `A.PNG`, sin extensión → `null`: coherentes con que el backend solo acepta pdf, jpeg y png. Falta el candado universal (B2-1).
- Seis `kind` no `ok` de `listPetDocs`: coinciden con `src/api/media.ts`, y R3 los cubre más `pending`.

### Anclas B34-B44 (medidas en `65f37841`)

Todas dan el valor declarado:
- B34 = 1, B35 = 0, B36 = 1, B37 = 1, B38 = 1, B39 = 2, B40 = 1, B41 = 1 (las ocho desde `mobile-pet-tracker/`);
- B42 = 1, B43 = 1, B44 = 1 (las tres desde la raíz).

### Guards de la carta

- `legibility-classnames`: no se añade `text-accent` ni `text-warning` sueltos. `text-accent-foreground` y `text-danger` ya se usan en otros ficheros.
- `consistency-classnames`: cuadra (arriba). `rounded-xl bg-default` y `text-2xs font-semibold text-foreground` ya existen en producción (`weight-log`, `login`, `register`, `food`, `home`).
- `design-drift`:
  - `FEATURE_STYLE_ESCAPES` (hex con flag `i`, `StyleSheet`, `text-[10px]`) se aplica a `api/media.ts` y `screens/docs/index.tsx` (requirements, línea 399).
  - Ojo para el handoff: un comentario `(#158)` o `#158:` en esos dos ficheros casa con `HEX_LITERAL` (la excepción solo cubre `#158 R<n>`).
  - Clases arbitrarias en los tests colocados: nada de lo prescrito tiene `-[`.
- `ui-language`: los valores nuevos `Type`/`Tipo`, `Name`/`Nombre`, `Date`/`Fecha`, `YYYY-MM-DD`/`AAAA-MM-DD` y `Cancel`/`Cancelar` ya existen en el catálogo con otras claves, así que el escaneo de literales fijos ya los vigila. No hay literales sueltos con esos valores en los ficheros de pantalla.
- Imports: `HeaderHeightContext` desde `expo-router/react-navigation` en el test sigue el precedente de `weight-log/index.test.tsx` (B34). Ningún candado de imports por fichero menciona `screens/docs`.

### Cada `it` asevera solo nodos de su commit

Sin hallazgos:
- R3 crea `docs-upload` y `docs-empty-action`;
- R5 crea el formulario y `docs-action-error`, y sus órdenes usan `docs-upload` (R3);
- R6, R7 y R8 usan el formulario y el envío (R5, R7);
- R10 usa `docs-action-error` (R5) y añade el `onPress` de la fila en su propio verde;
- R11 añade el Provider en su rojo.

### Pendientes de spike (para el leader)

1. B2-2: el comando de arriba, cuando exista la implementación (o un spike fuera del árbol, con el test de R8 y la mutación plantada).
2. B2-3: confirmar la ventana con un test que ya existe. En `mobile-pet-tracker/src/screens/docs/index.test.tsx`, en el `it` que hace `getByText('Luna')` (lista `[doc-1, doc-2]`), insertar temporalmente `expect(screen.queryByText('Luna')).toBeNull();` justo después de `await renderDocs();`, sin tocar los mocks. Correr `cd mobile-pet-tracker && bunx jest src/screens/docs/index.test.tsx -t '<título de ese it>'` y revertir con `git checkout HEAD -- src/screens/docs/index.test.tsx` (después, `git diff --cached` vacío). Si el `it` entero sigue en verde, la ventana existe y B2-3 queda confirmado también por ejecución.

## Pre-verificación ronda 1c

Fecha: 2026-10-09. HEAD `65f37841`, spec en borrador. Ronda acotada: solo los cierres de la 1b y las ramas hermanas que se añadieron.
Se corrió una sonda de jest, temporal y acotada a un fichero (resultado abajo), y luego se revirtió con `git checkout HEAD -- mobile-pet-tracker/src/screens/docs/index.test.tsx`. `git diff --cached` queda vacío.
No se tocó `init.sh` ni el e2e.

### Resumen

- Bloqueantes nuevos: **0**.
- No bloqueantes nuevos: **2** (N3-1, N3-2).
- Ronda 1b: los 9 ids quedan cerrados.

### Cierre de la ronda 1b

| Id | ¿Cerrado? | Evidencia |
|---|---|---|
| B2-1 | sí | Regla estrecha en R2.2 y design D2, con los dos lados candados (ver abajo). |
| B2-2 | sí | Tareas R8: en cada etapa, espera al mock de esa etapa antes de aseverar. Va como excepción explícita a §Esperas, que ahora la nombra. |
| B2-3 | sí | Tareas R3: las 7 filas esperan primero a `findByText('Luna')`. La sonda S2 confirma la ventana. |
| N2-1 | sí | Filas `'a.pdf?v=1'` → `null`, `'a.pdf#p'` → `null` y `'Factura #12.pdf'` → PDF. Design D2. El refactor de R2 prohíbe compartir helper con `resolvePhotoContentType`. |
| N2-2 | sí | Fila `'apdf'` → `null`. |
| N2-3 | sí | R3 y R5: clases de los dos botones y sus etiquetas; el variant se comprueba como clase (ver abajo). |
| N2-4 | sí | Tareas R3: cuatro pasos, cada uno con su `await`. La sonda S1 confirma que la sincronización funciona. |
| N2-5 | sí | R9, «nuevo intento»: dos filas con `globalThis.fetch` en `pending()`. |
| N2-6 | sí | Design §Coexistencia, anclas B45, B46, B49 y B50, y Fuera de alcance (D) para la mascota. B50 tiene un defecto de forma: N3-1. |

### Regla estrecha y «sin recorte» (puntos 1 y 3)

Ramas de la cláusula y la fila que candado cada una:

- **Mime reconocido.** Las filas `'application/pdf'`, `'image/jpeg'` y `'image/png'` van con `'a.bin'`, así que demuestran que decide el mime. `'IMAGE/PNG'` cubre las mayúsculas. `'image/png'` + `'x.pdf'` demuestra que el mime manda sobre la extensión.
- **Respaldo por extensión.** Hay una fila por cada disparador: `undefined` (varias filas), `''` + `'a.pdf'`, `'application/octet-stream'` + `'a.pdf'` y `'APPLICATION/OCTET-STREAM'` + `'a.png'`. Cada uno tiene su fila, así que olvidar `''` o las mayúsculas sale en rojo.
- **Otro mime no reconocido.** `'image/heic'` + `'a.jpg'` y `'text/plain'` + `'a.png'` dan `null` con extensión válida. Una mutación que caiga a la extensión para cualquier mime sale en rojo.
- **Extensión.** Se toma lo que va tras el último `.`, en minúsculas:
  - `'informe.v2.pdf'` → PDF: una mutación que tome el primer `.` da `'v2'` y sale en rojo;
  - `'A.PNG'` cubre las mayúsculas;
  - `'apdf'` → `null` y `'a'` → `null` cubren la falta de punto;
  - `'a.pdf?v=1'` y `'a.pdf#p'` dan `null` porque no se recorta.

Contradicciones buscadas: ninguna.
- La tabla del selector de R5 («`null` → `Elige un archivo PDF, JPEG o PNG`») no depende de la regla.
- Las fixtures de R7 (PDF con `mimeType`, PNG sin `mimeType`) dan el tipo esperado con la regla estrecha.
- §0 dice que el backend no fija `ContentType` y que los tipos los decide el móvil, lo que es coherente.
- No queda redacción antigua: `grep` de «no lo reconoce», «recort» y `[?#]` solo encuentra el texto nuevo y el aviso del refactor.

### Ramas hermanas (punto 2)

- `'APPLICATION/OCTET-STREAM'` + `'a.png'` y `'informe.v2.pdf'`: correctas y necesarias (arriba).
- Segunda fila de «nuevo intento» de R9 (error de R6): bien planteada. Escribir en Tipo no se asevera, y queda dicho que la spec no lo fija. Afecta al rojo esperado: N3-2.
- «Rehabilitar» de R8: ahora espera `Solo el dueño puede subir documentos` con `findByText` antes de aseverar `disabled` falso. Correcto.
- B49 y B50: miden el valor declarado. B50 está escrita de forma que, copiada tal cual, nunca detecta nada: N3-1.

### N2-4 y sonda (punto 4)

- `petKeys.detail('pet-1')` es la clave real: la pantalla usa `queryKey: petKeys.detail(petId)`, `query-keys.ts` define `detail: (petId) => ['pets', 'detail', petId]`, y el test ya importa `petKeys` (línea 11).
- `renderDocs()` hace `return renderWithProviders(...)`, que devuelve `{ ...result, queryClient }`. R11 solo envuelve el árbol en el Provider, así que el `return` se mantiene.
- `act` todavía no está en el import de `@testing-library/react-native` (líneas 1-6), y la tarea lo añade.
- B47 = 0. TanStack notifica con `systemSetTimeoutZero` (`setTimeout(callback, 0)`, en `node_modules/@tanstack/query-core/build/modern/timeoutManager.js`), así que con timers reales el `setTimeout(0)` del paso 3 llega después del de TanStack.
- El orden de los pasos es correcto: lista pintada, estado `success`, vaciar el lote, aseverar. La prohibición de juntar estado y ausencia en un mismo `waitFor` está bien.

Sonda temporal: un `describe('SPIKE1C')` añadido al final de `src/screens/docs/index.test.tsx` y luego revertido. Comando:
`cd mobile-pet-tracker && bunx jest src/screens/docs/index.test.tsx -t 'SPIKE1C'`. Resultado: 5 en verde, 16 omitidos, código de salida 0.

- **S1 (N2-4).** Mascota en `error`, `unauthorized`, `unreachable` y `missing-config`, con la lista `[]`. Tras los pasos 1-3 de la tarea, `docs-header-skeleton` ya no está y `getByText('Mascota')` es visible en las 4. La sincronización deja el árbol con el estado de la mascota antes de aseverar.
- **S2 (B2-3).** Owner con la lista en `pending()`. Justo después de `await renderDocs()`, `docs-list-skeleton` está y `queryByText('Luna')` es `null`. Después, `findByText('Luna')` lo encuentra. La ventana de la 1b existía de verdad, y la espera prescrita la cierra.

Nota opcional, no es hallazgo: en las 8 filas de la mascota resuelta, `await screen.findByText('Mascota')` (literal `es` de `docs.pet`, que sustituye a `docs-header-skeleton`) haría lo mismo que los pasos 2-3, y sin excepción a §Esperas. La prescripción actual también es correcta.

### N2-3 y las clases de HeroUI (punto 5)

- `node_modules/heroui-native/lib/module/components/button/button.styles.js` emite `button__root--variant-outline` y `button__label--variant-outline`, igual que las variantes `danger`, `danger-soft` y `primary`, que ya se aseveran en `src`.
- B48 (`button__root--variant-danger-soft` en `geofences/index.test.tsx`) = 1. En `src` hay precedentes de `button__label--variant-*` sobre la etiqueta, así que el mecanismo (clase en el host, etiqueta con `within(...).getByText`) ya está probado.

### Aritmética (punto 6)

Todo cuadra:

- R2: `downloadUrl` 3 + resolver 24 + constante 1 + crear 12 + confirmar 13 + `PUT` 1 = 54. `media.test.ts` pasa de 15 a 69.
- Pantalla: 21 + 6 + 16 + 5 + 3 + 7 + 23 + 9 + 2 = 92. Acumulados: 16 → 37 → 43 → 59 → 64 → 67 → 74 → 97 → 106 → 108.
- Total: 1 + 54 + 92 = 147.
- Los encabezados `con N tests` de tasks (54, 21, 16, 5, 3, 7, 23, 9, 2) coinciden con §Recuentos.
- `traceability.md` coincide fila a fila (15 → 69, 74 → 97, 106 → 108, 147 = 1 + 54 + 92).
- §Coordinación con #159: 371 + 4 − 1 = 374, y 374 + 12 = 386.

### Anclas B45-B50 (punto 7)

Medidas en `mobile-pet-tracker/`: B45 = 1, B46 = 2, B47 = 0, B48 = 1, B49 = 1, B50 = 0. Todas dan el valor declarado.

### No bloqueantes nuevos

**N3-1 — B50 no detecta nada si se copia tal cual (design.md, fila B50).**
En el markdown crudo la orden es `grep -cE 'refetchInterval\|useFocusEffect'`. En ERE, `\|` es un `|` literal, así que la orden da `0` aunque la pantalla use `useFocusEffect`.
Comprobado:
- `printf 'x useFocusEffect\n' | grep -cE 'refetchInterval\|useFocusEffect'` da `0`;
- con `|` sin escapar da `1`.

Quien lee el fichero crudo (Codex, el leader con `cat`) copia `\|`. El escape es solo para que la tabla GFM se pinte bien.
B6 y B46 tienen el mismo escape, pero ahí el fallo se nota: el `\|` deja de ser una tubería, `grep` recibe argumentos sobrantes y la salida no da el valor declarado.
Arreglo: partir B50 en dos anclas sin tubería, `grep -cF 'refetchInterval' src/screens/docs/index.tsx` = `0` y `grep -cF 'useFocusEffect' src/screens/docs/index.tsx` = `0` (memoria «Anclas negativas»: un `= 0` es un ancla que hay que poder romper).

**N3-2 — `tasks.md` §Recuentos, fila «R9 rojo»: dice 23, pero pueden ser 22.**
La fila «Error de R6» del nuevo intento puede salir verde antes del verde de R9. Un verde de R6 natural fija el error con el resultado de validar (`setActionError(validate(...))`), y con el formulario ya válido eso lo borra al pulsar.
R6 no lo exige ni lo prohíbe, así que las dos implementaciones son correctas.
Arreglo: «22 o 23: la fila "Error de R6" del nuevo intento puede salir verde si el verde de R6 ya fija el error con el resultado de validar», como ya se hace en R4, en R5 (`canceled`) y en R8 (`rehabilitar`). Así Codex no para por un recuento de rojos que no cuadra.

## Pre-verificación de la Enmienda E1 (antes del gate)

Fecha: 2026-10-11. Reviewer. Árbol: wt-158, branch `feature/158-mobile-docs-upload`, HEAD `791a6f97`, E1 sin commitear en `specs/mobile-docs-upload/{requirements,design,tasks,traceability}.md`. Las anclas se midieron en `mobile-pet-tracker/` y todo lo demás en una copia fuera del árbol (scratchpad, con `node_modules`, `docs/`, `specs/` y `backend-pet-tracker/` enlazados). No se corrió `init.sh`, ni e2e, ni la suite móvil entera. El árbol de la app sigue intacto: `git diff --quiet HEAD -- mobile-pet-tracker` da 0.

**Veredicto: bloqueada.** 1 bloqueante y 3 no bloqueantes.

### Medido (todo cuadra con la spec salvo B1)

- **Anclas A1-A6 de R14, en la base**: A1 `1`, A2 `0`, A3 `1`, A4 `0`, A5 `1`, A6 `0`, que es la columna «Base `791a6f97`». En la copia, tras el rojo: A4 `1`, A5 `0`, A6 `1`. Tras el verde: A1 `0`, A2 `1`, A3 `1`. Son los valores de «Tras el verde de R14».
- **Base**: `FORCE_COLOR=0 bunx jest src/api/__tests__/media.test.ts` da `Tests: 69 passed, 69 total`, `exit=0`.
- **Rojo**: solo el cambio de test de tasks.md E1 (1), es decir, el `describe` de R14 con sus siete pasos y `body: expect.any(Blob),` en el `it` de R2. Da `Tests: 4 failed, 69 passed, 73 total`, `exit=1`. Los cuatro rojos son las filas de R14, todos en el paso 5 (`expect(init.body.type).toBe(contentType)`) con `Received: ""`. El `it` de R2 que se mueve sigue verde. `bunx eslint --no-cache` sobre el test da `exit=0`.
- **Verde** (`body: new Blob([body], { type: contentType }),`): `Tests: 73 passed, 73 total`, `exit=0`. `bunx eslint --no-cache` sobre los dos ficheros da `exit=0`, `bunx tsc --noEmit` da `exit=0` y `bunx expo lint --no-cache` (proyecto entero) da `exit=0`.
- **Las tres mutaciones de la tabla de R14** se reproducen tal cual:
  - `body,` da 4 rojos, en el paso 5;
  - `new Blob([body])` da 5: las 4 de R14 en el paso 5 y R7 en su `toHaveBeenCalledWith`;
  - `new Blob([], { type: contentType })` da 5: las 4 de R14 en el paso 6 (`Expected: "x"`, `Received: ""`) y R7.
- **Otras mutaciones, en rojo como deben**:
  - `type` fijo `'application/pdf'`: 4 rojos (jpeg, png y webp en el paso 5, y R7);
  - quitar la cabecera con el blob ya tipado: 6 rojos (las 4 de R14 en el paso 7, más R2 y R7);
  - cabecera `body.type`: 5 rojos (las 4 de R14 en el paso 7, más R2).
  - Cambiar el orden de las claves `headers`/`body` es equivalente y no es una mutación: 73/73.
- **Cobertura de `contentType`**: `PhotoContentType` (`media.ts:21`) es `image/jpeg | image/png | image/webp` y `DocumentContentType` (`media.ts:168`) es `application/pdf | image/jpeg | image/png`. La unión tiene 4 valores distintos y las 4 filas los cubren. Cualquier tipo constante o mapeo que no sea la identidad pone roja al menos una fila.
- **`expect.any(Blob)` en el `it` de R2**: no deja ciego nada de R2.5. Ese `it` sigue fijando URL, `method: 'PUT'`, cabeceras exactas y la ausencia de `Authorization`. El tipo y los bytes del cuerpo los fija R14, y la longitud del blob `image/png` la sigue viendo R7.
- **Candados globales**, en la base y con E1 aplicada en la copia:
  - `design-drift`, `consistency-classnames`, `ui-language`, `legibility-classnames` y `language-provider`: 199/199 en los dos casos;
  - pantallas docs, add-pet y profile: 173/173 en los dos casos;
  - `app.config.test.ts`: 21/21 en los dos casos.
  - `design-drift`, `consistency-classnames` y `legibility-classnames` recorren `join(process.cwd(), 'src')`, así que en la copia escanearon los ficheros de E1. Los guards de `src/app/__tests__` solo recorren `src/app`.
  - Ningún test fuera de `media.test.ts` prohíbe `new Blob` ni `expect.any`. El único otro `new Blob` está en `src/screens/docs/index.test.tsx:383`. Ningún test referencia `media.test`.
- **Anclas del diagnóstico** en `node_modules/expo/src/winter/`, todas `1`: `overriddenHeaders: [['Content-Type', body.type]]` (`fetch/RequestUtils.ts`), `install('fetch', () => require('./fetch').fetch)` (`runtime.native.ts`) y `this.headers.get('content-type') ?? ''` (`fetch/FetchResponse.ts`).
- **Smoke R13 enmendado**:
  - **Bucket**: `BUCKET_MEDIA = resourceName('pet-tracker-media', 'local')` (`backend-pet-tracker/src/aws/constants.ts:36,42`). `resolveResourceSuffix` solo añade sufijo con `NODE_ENV=test`, así que `start:dev` usa `pet-tracker-media-local`.
  - **Clave**: `buildDocumentKey` da `` `pets/${petId}/docs/${documentId}` `` (`domain/document-key.ts`) y `PhotoStorageS3Adapter` la usa tal cual (`Key: key`, `photo-storage.s3.adapter.ts:29,37`). Las fotos son `pets/<petId>/photo-<ts>` (`photo-key.ts:7`), así que el filtro «contienen `/docs/`» las separa.
  - **Región**: `us-east-1` en `.env.example`.
  - **Comandos**: los dos `aws` valen tal cual en bash y en PowerShell. La `--query` va entre comillas dobles, sin `$` y sin espacios. Las variables tienen su equivalente PowerShell en el texto. Precondición 3 asegura que la máquina alcanza `http://<IP LAN>:4566`. `aws --endpoint-url` ya se usa en otros smokes (`localstack-provisioning`, `mobile-alert-detail-screen`, `mobile-push-registration`, `docs/verification.md`).
  - **Casillas**: §Aprobación tiene tres, cada una con su gate (spec `[x]`, E1 `[ ]` y smoke `[ ]`, este último en §Prueba de humo, `grep -c` = 1). La precondición 8 encaja con el paso 6 y con la nota de R13.
- **Coherencia** entre requirements, design D8, tasks y traceability. R14 es el mismo en los cuatro. Las cuentas 69 + 4 = 73 cuadran en las consecuencias de E1, en tasks §Recuentos, en tasks E1 (1)/(2) y en traceability. Los mensajes `test(mobile-docs-upload): red typed upload body (R14)` y `fix(mobile-docs-upload): upload body carries the declared content type (R14)` son idénticos en tasks y traceability. La lista cerrada no crece: `media.ts` y `media.test.ts` ya estaban en design §Ficheros afectados.

### Bloqueantes

**B1. R14 cláusula 2 («`type` exactamente igual a `contentType`, *también* cuando el `body` recibido trae `type === ''`») y el «`Blob` **nuevo**» de R14 solo están candados en la rama `type === ''`.**

Las cuatro filas usan `new Blob(['x'])`, sin tipo. R7 usa un blob ya tipado con el mismo `contentType`. Ninguna fila usa un blob de entrada con un tipo distinto de `contentType`, y ninguna mira la identidad. Con E1 tal cual, estas tres mutaciones dan **73/73 en verde**:

| Mutación en `uploadPhotoToUrl` | Qué rompe |
|---|---|
| `body: body.type === '' ? new Blob([body], { type: contentType }) : body,` | cláusula 2 y «nuevo»: con un blob tipado distinto, `expo/fetch` manda `body.type` como `Content-Type` |
| `body: new Blob([body], { type: body.type \|\| contentType }),` | cláusula 2, el mismo efecto en el cable. Es la más plausible: «respetar el tipo si viene» |
| `body: body.type === contentType ? body : new Blob([body], { type: contentType }),` | solo «nuevo». En el cable es equivalente |

El cierre está medido en la copia con una sonda temporal, ya retirada:

- un `it.each` de las 4 filas con blob de entrada `new Blob(['x'], { type: 'text/plain' })`, que asevera `type === contentType`. Pone rojas la primera mutación (4 filas) y la segunda (4 filas);
- un `it` con blob de entrada `{ type: 'image/png' }` y `contentType` `'image/png'`, que asevera `expect(init.body).not.toBe(input)`. Pone roja la tercera (y también la primera).

Resultados con la sonda: arreglo 78/78, base 9 rojos / 69 verdes / 78 total, `tsc --noEmit` `exit=0`.

Si el leader decide que la identidad no es requisito, puede quitar «nuevo» de R14 y prescindir de ese `it`. Las 4 filas tipadas hacen falta en cualquier caso.

Cualquier cierre arrastra las cifras escritas, que hay que medir de nuevo:

- la tabla de mutaciones de R14 y los nombres de §Candado;
- tasks §Recuentos (73 → 77/78) y tasks E1 (1)/(2): el rojo pasa de 4 a 8/9, y el `it` de identidad no cae en el paso 5;
- las consecuencias y la tabla de E1 en requirements («69 a 73», «4 rojos, 73/73»);
- design §Ficheros afectados («`describe` nuevo de 4 `it`»);
- traceability («suma 4»);
- el ancla A4, si las filas nuevas van en un segundo `describe` con `#158 R14`.

### No bloqueantes

**N1. R14 cláusula 3 («mismos bytes») tiene una sola muestra, de 1 byte, y su valor esperado es el mismo literal que la entrada.**

`body: new Blob(['x'], { type: contentType }),` pasa las 4 filas de R14. Solo la caza R7 (1 rojo), y únicamente porque la igualdad de jest compara el `Symbol(kLength)` interno del `Blob` de Node (`'image bytes'` mide 11, no 1). Eso es un detalle de Node, no un contrato.

La mutación es poco plausible. Si se reabre R14 por B1, un contenido distinto por fila (por ejemplo, el propio `contentType`) lo cerraría dentro de R14.

**N2. Paso 6 del smoke: la salida esperada no es un literal.**

La forma de la salida de `head-object` depende del `output` que el humano tenga en `~/.aws/config` (json por defecto, pero puede ser `text` o `table`). `--query ContentType --output text` haría que imprimiese exactamente `application/pdf`.

Además, `list-objects-v2 --output text` ordena por `Key` y no por `LastModified`, así que «las dos más recientes» se eligen a ojo. Un documento de antes de E1 elegido por error da un falso rojo, que es el lado seguro.

**N3. `CHECKPOINTS.md` C5 dice literalmente `feat(<scope>): <desc> (R1,R2)`.**

`docs/conventions.md` §Commits admite `fix(<scope>): <descripción> (R3)`, y cinco traceability ya tienen `fix(...) (R<n>)`, por ejemplo `specs/android-map-never-ready/traceability.md`. El `fix(...)` de E1 es conforme a las convenciones. Se anota para que el reviewer de la ronda de R14 no lo marque contra la letra de C5.

### Ronda 2

Fecha: 2026-10-11. Base `791a6f97`, con la E1 de la ronda 2 aplicada solo en
una copia fuera del árbol (node_modules enlazado). No se ha tocado el árbol, no
se ha hecho ningún commit y no se ha corrido `init.sh`, e2e ni la suite móvil
entera. Al terminar, `git diff --quiet HEAD -- mobile-pet-tracker` da 0 en el
worktree.

**Veredicto: bloqueada.** 2 bloqueantes (B2 y B3) y 6 no bloqueantes (N4-N9).
B1 de la ronda 1 queda cerrado para `''` y `'text/plain'`, pero la rama de la
cláusula 2 que abre B2 sigue sin candado.

#### Medido: cuadra con la spec

- Anclas: con el test de la ronda 2, A4 da 1, A5 da 0 y A6 da 1. Con el arreglo, A1 da 0, A2 da 1 y A3 da 1.
- Base: `media.test.ts` da 69/69.
- Rojo (test de la ronda 2 sobre el `media.ts` de la base): `Tests: 8 failed, 69 passed, 77 total` con `exit=1`. Los ocho fallan en `media.test.ts:314`, el paso 5: cuatro con `Received: ""` y cuatro con `Received: "text/plain"`. Los nombres de los `it` son los de la spec.
- Verde: `Tests: 77 passed, 77 total` con `exit=0`. `bunx tsc --noEmit` da 0, `bunx eslint --no-cache` sobre los dos ficheros da 0 y `bunx expo lint --no-cache` da 0.
- La tabla de mutaciones de R14 se reproduce fila a fila:
  - T1 (base): 8 rojos en el paso 5.
  - T2 (sin `type`): 9 rojos, los 8 del paso 5 más R7.
  - T3 (sin bytes): 9 rojos, en el paso 6 con `Received: ""`, más R7.
  - T4 (bytes fijos): 9 rojos, en el paso 6, más R7.
  - T5 y T6: 4 rojos cada una, las filas de `«text/plain»` en el paso 5.
  - T7: 77/77 en verde, la mutación equivalente aceptada.
- Punto 5, candados con la E1 de la ronda 2:
  - globales (`design-drift`, `consistency-classnames`, `ui-language`, `legibility-classnames`, `language-provider`): 199/199 con `exit=0`;
  - `src/screens/docs`, `add-pet` y `profile`: 173/173 con `exit=0`;
  - `app.config.test.ts` más `media.test.ts`: 98/98 (21 + 77) con `exit=0`.

#### Barrido por cláusula de R14 (punto 2)

Todas las sondas se aplican sobre el `media.ts` arreglado, con el test de la ronda 2.

| Cláusula | Mutación | Resultado |
|---|---|---|
| 1, instanceof Blob | S9: `Uint8Array` en vez de `Blob` | 10 rojos |
| 1 | S8: `new File([body], 'upload', { type: contentType })` | 1 rojo, solo R7 (ver N8) |
| 2, `type` exacto, «sea cual sea el type del body recibido» | S1: `[tipos admitidos].includes(body.type) ? body : new Blob([body], { type: contentType })` | **77/77 en verde** |
| 2 | S2: `new Blob([body], { type: admitidos.includes(body.type) ? body.type : contentType })` | **77/77 en verde** |
| 2 | S3: `body.type.startsWith('image/') ? body : new Blob(...)` | **77/77 en verde** |
| 2 | S11: `body.type.startsWith('text/') \|\| body.type === '' ? new Blob(...) : body` | **77/77 en verde** |
| 2 | S5: envolver solo si `body.size === 0` | 8 rojos |
| 2 | S4: envolver solo si `body.size > 0` | 77/77 en verde (ver N6) |
| 2 | S6: `type: contentType.toUpperCase()` | 77/77 en verde (ver N7) |
| 2 | S10: `type: contentType + ';charset=utf-8'` | 9 rojos |
| 3, mismos bytes | S7: `new Blob([contentType], { type: contentType })` | 1 rojo, solo R7 (ver N4) |
| cabecera | H1: clave en minúsculas; H2: valor en mayúsculas; H6: objeto `Headers` | 10 rojos cada una |
| sin Authorization | H3: con `Authorization: 'Bearer x'`; H4: `Authorization: ''` | 10 rojos cada una |
| sin Authorization | H5: `Authorization: undefined` | 1 rojo, solo R2 en `media.test.ts:293` (ver N5) |

#### Bloqueantes

**B2. La cláusula 2 solo tiene candado con `'text/plain'` como «otro tipo distinto de `contentType`».**

R14.2 exige el `type` exacto «sea cual sea el type del body recibido: '' u otro tipo distinto de contentType». Las 8 filas solo prueban `''` y `'text/plain'`, y nunca un tipo admitido distinto del declarado (por ejemplo, un blob `image/png` subido como `image/jpeg`). Por eso S1, S2, S3 y S11 quedan 77/77 en verde.

S2 es la evolución natural de T6, que la propia spec da por plausible: fiarse del `type` del blob cuando es válido y declarar el propio si no lo es. Hoy los anclas A1 y A2, junto con «el resto de `media.ts` no cambia», cazarían estas variantes en esta ronda, pero el test no las detecta como regresión futura. Es la regla de un candado por rama (`clausulas-universales-candadas-en-un-caso`).

Cómo se cierra (medido en la copia): añadir 4 filas con un tipo de entrada admitido y distinto, `['image/jpeg', 'image/png']`, `['image/png', 'image/jpeg']`, `['image/webp', 'image/png']` y `['application/pdf', 'image/png']`. Resultados:

| Sonda | Resultado |
|---|---|
| verde | 81/81 |
| base | 12 rojos en el paso 5 |
| S1, S2, S3, S11 | 4 rojos cada una, justo en las filas nuevas |
| T5 y T6 | 8 rojos cada una |
| T7 | sigue en verde |

`tsc` y `eslint` dan 0 en los dos casos. Hay que recalcular las cifras de los cuatro ficheros de la spec y del handoff de E1: el `it.each` pasa de 8 a 12 filas, `media.test.ts` de 77 a 81 (69 + 12), el rojo de 8 a 12, y las filas T5 y T6 de la tabla de mutaciones de 4 a 8 rojos.

**B3. Cifras de la ronda 1 sin marcar en `progress/explore_mobile-docs-upload-e1.md`.**

En `## Verificación del spec_author`, las líneas 89-92 siguen diciendo:

- «base 4 rojos / 69 verdes / 73; con el arreglo 73/73»;
- «`body,` → 4 rojos»;
- «→ 5 (4 de R14 + R7)», dos veces.

Ninguna marca indica que la `### Ronda 2` de la línea 106 las sustituye, y el criterio de esta ronda es que no quede `73` ni «4 rojos» referido a E1 (`premisas-de-explore-sin-verificar`).

Cómo se cierra: marcar ese bloque como ronda 1 superada o reescribirlo. Si se cierra B2, la `### Ronda 2` del explore (8 rojos / 77) también queda desfasada y tiene que pasar a 12 / 81.

#### Cifras arrastradas en el resto (punto 3)

Grep de `73`, «4 rojos», «4 filas», «cuatro filas», «69 a 73», «suma 4» y «nuevo» en los cuatro ficheros de la spec y en el explore.

- Las únicas cifras viejas de E1 son las de B3.
- `requirements.md:550-551` («4 rojos: las cuatro filas de `«text/plain»`») está bien para la ronda 2 medida, pero cambia si se cierra B2.
- `design.md:238` («#159 suma 4») no tiene que ver con E1.
- «nuevo» ya no califica al `Blob` en R14: `requirements.md:434` dice «Que sea el mismo objeto o uno nuevo no es requisito». Las apariciones que quedan son «un `describe` nuevo» (`requirements.md:576`, `design.md:261`) y «R14 (requisito nuevo)» (`requirements.md:581`), y describen el test y el requisito, no el cuerpo.
- `tasks.md:54-55,310,325`, `requirements.md:542,585` y `traceability.md:29` dan 8 / 77, de forma coherente entre sí.
- `progress/handoff_mobile-docs-upload.md` está modificado en el árbol, pero su diff no menciona E1, R14, 73 ni 77.

#### JMESPath y salida del paso 6 (punto 4)

Comprobado con `aws-cli/2.36.27` (el de `~/.local/bin`) contra un servidor S3 falso local en `127.0.0.1` que devuelve un `ListObjectsV2` de 4 objetos: tres en `/docs/` con fechas desordenadas y una `photo-`. No se ha usado LocalStack.

- `list-objects-v2`, con el `--query` copiado de `requirements.md:722`, da `exit=0` e imprime exactamente dos líneas, `pets/p1/docs/d-pdf<TAB>2026-10-11T10:04:00+00:00` y `pets/p1/docs/d-img<TAB>2026-10-11T10:05:00+00:00`. Excluye la foto y ordena por fecha ascendente, así que la penúltima línea es la más antigua de las dos últimas. Lo verifiqué con `cat -A`.
- `head-object --query ContentType --output text` da una sola línea, `application/pdf`, sin comillas, con `exit=0`.
- `jmespath` 1.0.1 compila la expresión y la evalúa igual.
- PowerShell no está instalado aquí (`which pwsh` vacío), así que es razonado y no ejecutado: la expresión no lleva `$`, ni comillas dobles internas, ni backtick, y `&` dentro de comillas dobles es literal. La afirmación de `requirements.md` es verosímil, pero no la he medido.

#### No bloqueantes

- **N4.** El contenido de cada fila es igual a su `contentType`, y eso hace tautológica la cláusula 3. S7 (`new Blob([contentType], ...)`) pasa las 8 filas de R14 y solo lo caza R7 (`media.test.ts:93`), porque `toHaveBeenCalledWith` compara `Symbol(kLength)` y `'image bytes'` mide 11 frente a los 9 de `'image/png'`. Es decir, lo caza por casualidad. Lo introdujo mi propia sugerencia de N1 en la ronda 1. Cómo se cierra (medido): una tercera columna con un literal propio por fila (`'bytes 01'` … `'bytes 12'`) y `text()` comparado contra ella. Con eso, S7 da 12 rojos en el paso 6. Conviene hacerlo en el mismo cambio que B2.
- **N5.** El paso 7 usa `toEqual`, que ignora las claves con valor `undefined`. H5 (`Authorization: undefined`) solo cae por R2 (pdf). Para `image/jpeg`, `png` y `webp` no lo caza ningún test, y no he verificado cómo serializaría `expo/fetch` ese valor. Cómo se cierra (medido): con `toStrictEqual` en el paso 7, H5 da 12 rojos en R14 y el verde sigue en 81/81. No es bloqueante porque la variante incondicional ya cae por R2 y la condicional por tipo es rebuscada.
- **N6.** S4 (envolver solo si `size > 0`) sigue en verde: un cuerpo de 0 bytes saldría con `type ''`. La cláusula 2 no habla de tamaño y la mutación es rebuscada. Una fila con contenido `''` probablemente la cerraría, pero no lo he medido.
- **N7.** S6 (`toUpperCase()`) sigue en verde porque el `Blob` de Node pasa `type` a minúsculas. En el dispositivo, `node_modules/react-native/Libraries/Blob/BlobManager.js:105` copia `options.type` tal cual. Es una zona ciega del entorno de jest que no se puede cerrar con el `Blob` de Node, y el candado real es el paso 6 del smoke (`image/jpeg` exacto).
- **N8.** S8 (`File` en vez de `Blob`) cumple la cláusula 1, pero R7 lo rechaza por igualdad en `toHaveBeenCalledWith`. Es un candado de más, no un hueco. Solo lo anoto.
- **N9.** Si `pets/` no tiene objetos, el paso 6 no da «menos de dos líneas»: falla con `exit=255` y `aws: [ERROR]: In function sort_by(), invalid type for value: None, expected one of: ['array'], received: "null"`. Con la precondición 8 no debería ocurrir, pero el texto podría añadir «o un error de `sort_by`» entre los casos que hacen fallar el paso.

### Ronda 3

Fecha: 2026-10-11. Es una comprobación de cierre, no un barrido nuevo. Base
`791a6f97`. La ronda 3 se aplicó solo en la copia fuera del árbol: el test se
generó desde el bloque de código y los siete pasos de `requirements.md` R14, y
cada mutación salió de la celda literal de su fila de la tabla. No se ha tocado
el árbol ni se ha hecho ningún commit, y no se han corrido `init.sh`, los e2e
ni la suite móvil entera.

**Veredicto: lista para firma.** 0 bloqueantes. B2 y B3 están cerrados, y N4,
N5 y N9 también. N6, N7 y N8 quedan como límites aceptados y dicen lo medido en
la ronda 2. No veo ninguna rama nueva: `toStrictEqual` y la columna de
contenido solo estrechan los pasos 6 y 7.

#### Medido (punto 1)

- Anclas en la base: A1 `1`, A2 `0`, A3 `1`. En el test de `HEAD`: A4 `0`, A5 `1`, A6 `0`.
- Anclas con el test de la ronda 3: A4 `1`, A5 `0`, A6 `1`. Tras el verde: A1 `0`, A2 `1`, A3 `1`. Todas cuadran con la tabla.
- Rojo: `Tests: 12 failed, 69 passed, 81 total`, `exit=1`. Los doce fallan en `media.test.ts:318`, que es el paso 5. Los `Received` son:
  - `""` en 4 filas;
  - `"text/plain"` en 4;
  - `"image/png"` en 3;
  - `"image/jpeg"` en 1.

  No cae ningún otro `it`, como pide `tasks.md` (1).
- Verde: `Tests: 81 passed, 81 total`, `exit=0`.
- `bunx tsc --noEmit`, `bunx eslint --no-cache` sobre los dos ficheros y `bunx expo lint --no-cache`: los tres dan `exit=0`.
- Las 13 filas de la tabla de mutaciones, aplicadas tal como están escritas, salen como dice la spec:

| Id | Medido | Dónde |
|---|---|---|
| T1 | 12 rojos (R14) | paso 5 (`:318`); `""` 4, `text/plain` 4, `image/png` 3, `image/jpeg` 1 |
| T2 | 13 (12 de R14 + R7) | R14 en el paso 5 con `""`; R7 en `:93` |
| T3 | 13 (12 + R7) | R14 en el paso 6 (`:319`) con `""`; R7 en `:93` |
| T4 | 13 (12 + R7) | R14 en el paso 6 con `"x"`; R7 en `:93` |
| T5 | 8 (R14) | paso 5; `text/plain` 4, `image/png` 3, `image/jpeg` 1 |
| T6 | 8 (R14) | igual que T5 |
| T7 | 81/81 verdes | equivalente aceptada |
| S1, S2, S3, S11 | 4 rojos cada una (R14) | paso 5; `image/png` 3, `image/jpeg` 1 |
| S7 | 13 (12 + R7) | R14 en el paso 6 con el `contentType` como `Received` (3 por tipo); R7 en `:93` |
| H5 | 13 (12 + R2) | R14 en el paso 7 (`:320`, `toStrictEqual`); R2 en `:293` |

#### Filas y títulos (punto 2)

- El orden `[contentType, tipo de entrada, contenido]` de las 12 filas cuadra con la viñeta del tipo admitido: `image/png` para `image/jpeg`, `image/webp` y `application/pdf`, e `image/jpeg` para `image/png`.
- Corrí jest con `--verbose` y extraje los 12 títulos generados. Son idénticos, y en el mismo orden, a la lista literal de «Nombres completos de los doce `it`»: el `diff` sale vacío.
- Los dos `%s` toman las dos primeras columnas. La tercera no aparece en el título, y `''` se imprime como `«»`.
- `tasks.md` (1) remite al bloque de R14 sin copiarlo, así que no hay una segunda versión que pueda divergir.

#### Cifras arrastradas (punto 3)

Busqué `77`, `73`, «8 rojos», `69 + 8`, «4 filas», «ocho filas» y «8 filas» en los cuatro ficheros de la spec y en el explore. No queda ninguna cifra de las rondas 1 o 2 como dato vigente.

- «8 rojos» solo aparece en T5 y T6 (`requirements.md:570-571`), y eso es lo medido para esas mutaciones, no el rojo de la base.
- El explore (`:89-90`) cita «4 filas» y «8 filas» dentro de un «Historial del candado» marcado como tal: «Las cifras de abajo son solo las de la ronda 3».
- `tasks.md:54-55,310,327`, `traceability.md:29`, `requirements.md:471,559,617`, `design.md:261` y el explore `:95-96` dicen todos 12 / 81 (69 + 12). Son coherentes entre sí y con lo medido.

#### N6, N7 y N8 (punto 4)

Comparé las tres líneas de «Alcance del candado» con lo medido en la ronda 2:

- **N6:** que `size > 0` dé verde, y que no haya fila de 0 bytes, cuadra. La spec no afirma nada que yo no haya medido.
- **N7:** cuadra. El `Blob` de Node pasa `type` a minúsculas y `BlobManager.js:105` copia `options.type` tal cual.
- **N8:** cuadra. `File` cumple la cláusula 1 y lo rechaza el `toHaveBeenCalledWith` de R7. En la ronda 2 di 1 rojo, solo R7.

#### Candados (punto 5)

Con la ronda 3 aplicada en la copia:

- globales: 199/199, `exit=0`;
- `src/screens/docs`, `add-pet` y `profile`: 173/173, `exit=0`;
- `app.config.test.ts` más `media.test.ts`: 102/102 (21 + 81), `exit=0`.
