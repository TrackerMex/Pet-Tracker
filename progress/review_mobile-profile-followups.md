# review: mobile-profile-followups (#184)
Fecha: 2026-10-20
HEAD revisado: d9fc677d9bdbadefe1500f03f759d401b5c272ba (H0 del handoff 6a581de8, 7 commits)
Veredicto: APROBADO

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`mobile-profile-followups`, feature_list.json:3372; el resto no cambia en el diff de la feature)
- [x] progress/current.md describe la sesion activa de #184

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (N/A backend; cambio solo en `mobile-pet-tracker/src/screens/profile/` y tests)
- [x] contratos en domain: N/A, sin cambios
- [x] application depende de interfaces: N/A
- [x] infrastructure sin logica de negocio: N/A
- [x] Produccion: una ref y un `try/finally` en `handleChangePhoto`; ningun cambio de capas ni de dependencias

## Checklist C4 — TDD
- [x] Cada R<n> tiene test que lo nombra: R1 `#184 R1: ...`, R2 `#184 R2: ...` (1 + it.each de 7), R3 `#184 R3: ...`, R4 `#184 R4: ...`; R5 conserva el `it` existente del describe `R1: me card` (la spec lo prescribe asi) y R6 es transversal (medido abajo)
- [x] Historial test-primero donde hay produccion: `5221b327` (rojo R2, solo `index.test.tsx`, 1 failed / 151 passed segun Codex) precede a `1dbda4bd` (verde, solo `index.tsx`). Los cinco commits de test no tocan produccion (`git show --stat` por commit: solo `*.test.tsx`)
- [x] R1, R3, R4, R5 son requisitos de verificacion declarados por escrito en la spec (via b, mutacion); evidencia de mutacion mas abajo
- [x] Ningun rojo por ReferenceError ni por mutar un doble: el unico commit rojo falla por `Expected number of calls: 1 / Received: 2` sobre produccion sin guardia

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" (R1 a R6 con test y commit)
- [x] Hashes verificados: `54770013` R5, `178486b5` R1, `b9daabb7` R3, `fe2e5f81` R4, `5221b327` y `1dbda4bd` R2 existen en el historial con exactamente los mensajes de la tabla; R6 referencia por mensaje al commit docs `d9fc677d` (`docs(profile): trazabilidad de #184`), consistente con el HEAD
- [x] Formato `test(<scope>): <desc> (R<n>)` / `fix(profile): <desc> (R2)` respetado
- Observacion menor, no bloqueante: el frontmatter de `traceability.md` conserva `status: draft` (lo copio de la plantilla; en el repo hay trazabilidades con `draft` y con `approved`, y la regla de C5 es sobre las filas)

## Checklist C6 — Spec aprobada
- [x] requirements.md `status: approved` y casilla `- [x] Aprobado por humano (fecha: 2026-10-20)`
- [x] Ningun requisito se modifico despues del gate (el diff de la feature no toca requirements.md/design.md/tasks.md)

## Checklist C7 — Sin codigo huerfano
- [x] N/A: la feature no reemplaza ni deprecia nada. Solo cambia el cuerpo de un handler y anade candados de test

## Verificacion especifica pedida
1. Orden test-primero R2: confirmado (ver C4). `5221b327` solo toca `mobile-pet-tracker/src/screens/profile/index.test.tsx`; `1dbda4bd` solo `index.tsx`.
2. Diff de produccion: `git diff -w 6a581de8..HEAD -- .../profile/index.tsx` muestra exactamente 3 hunks: `const photoBusyRef = useRef<boolean>(false);`, la guardia (`if (photoBusyRef.current) return; photoBusyRef.current = true; try {`) tras `if (!pet) return;`, y el `} finally { photoBusyRef.current = false; }` externo. El resto del diff sin `-w` es solo reindentacion. Cero JSX cambiado (`disabled={photoUploading}` en :373, `accessibilityState` en :372 y `className="rounded-xl bg-danger-soft"` en :503 intactos). `photoBusyRef` aparece 4 veces, como prescribe tasks.md.
3. Desvio X3 (`disabled={false}`): reproducido. Falla en `waitFor(... accessibilityState ... toEqual({ disabled: true }))` (recibido `disabled: false`), antes de llegar a la sonda. No hay zona ciega: RN `Pressable` fusiona `disabled` sobre `accessibilityState`, asi que (a) borrar `disabled=` deja `accessibilityState` en true y lo caza la sonda `onStartShouldSetResponder` (X1, X2), y (b) forzar `disabled={false}` pisa `accessibilityState` y lo caza la espera. Cualquier mutacion que deje correctas ambas lecturas requiere `disabled` correcto. El candado R1 sigue siendo valido; la tabla de diseno de X3 solo se equivoca en que asercion salta (el informe de Codex lo declara sin ajustar el requisito). Sugerencia para el leader: corregir esa celda de design.md en el cierre, no es bloqueante.
4. Mutaciones replantadas por mi, cada una revertida con `git checkout HEAD --` y arbol limpio tras cada una:
   - X1 (borrar `disabled={photoUploading}`): `#184 R1` rojo, `Expected: false / Received: true` en la sonda. 1 failed.
   - X3 (`disabled={false}`): `#184 R1` rojo en la espera de accessibilityState (diff `disabled: true` vs `false`). 1 failed.
   - X5 (borrar la liberacion `photoBusyRef.current = false` del finally externo): 7 failed / 1 passed; las siete filas `libera la guardia` rojas (`Expected number of calls: 2 / Received: 1`), el doble toque verde. Coincide con el diseno.
   - X9 (`cacheKey={pet.name}` en PetSwitcher): `#184 R3` rojo en `props.source`. 1 failed.
   Ningun candado es tautologico: los literales esperados estan escritos a mano (`'pet-1'`, `http://example.test/luna.jpg`, `{ width: 40, height: 40, borderRadius: 20 }`, la cadena de clases de R4), sin importar simbolos de produccion. Las demas (X2, X4, X6 a X8, X10 a X15) las documenta Codex con reparto identico al diseno; no las repeti.
5. R4: `toBe('pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-md rounded-xl bg-danger-soft')`, cadena identica a la de la spec, sin desvio.
6. R6: sobre las 221 lineas anadidas de los tres ficheros de codigo, 0 hex (`-P` con el patron de `HEX_LITERAL`), 0 clases arbitrarias, 0 `StyleSheet.create`, 0 shadow/elevation legacy, 0 emoji; todo nombre nuevo de `describe`/`it` cita `#184 R<n>` completo (grep de `#184` sin `R<n>`: sin resultados). `git diff --name-only 6a581de8..HEAD` = los tres ficheros de codigo mas `progress/impl_...md` y `specs/.../traceability.md` (dentro del alcance permitido: `specs/` y `progress/`; el informe y la trazabilidad son evidencia, no codigo).
7. Hashes de traceability.md: reales (ver C5).
8. Skills de Expo: el handoff (:123) ordena explicitamente no cargar ninguna (Codex no tiene equivalentes y el cambio es una `useRef` en un handler mas tests RN, sin UI, animacion ni estilos nuevos). Ninguna aplicaba; Codex solo cargo `ponytail`. Conforme.

## Observaciones
- Ninguna bloqueante.
- No bloqueante 1: celda de X3 en `specs/mobile-profile-followups/design.md` (rojo "solo en la sonda") no coincide con lo medido (rojo en la espera de accessibilityState). Conviene anotarlo en el cierre.
- No bloqueante 2: `traceability.md` con `status: draft` en el frontmatter.
- Fuera de lo que verifique: `./init.sh` no lo corri por instruccion del leader.

## Output de ./init.sh
Corrido por el leader, no por el reviewer: exit 0, backend 1474/1474, movil 4225 passed en 126 suites (log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/5220af5e-c4d5-4aa1-ac92-6fa69d99edf9/scratchpad/init184-final.log`).
Verificacion propia acotada: `FORCE_COLOR=0 bunx jest src/screens/profile/index.test.tsx src/components/__tests__/pet-switcher.test.tsx` (sin pipe) en HEAD d9fc677d: exit 0, 2 suites, 160 passed (152 Perfil + 8 PetSwitcher).
