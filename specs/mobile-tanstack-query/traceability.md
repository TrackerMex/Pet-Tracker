---
feature: "mobile-tanstack-query"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-tanstack-query]]

> Una fila por requisito de [[requirements]]. Ninguna fila puede quedar en
> `pendiente` al cerrar (C5 de `CHECKPOINTS.md`).
> Rutas relativas a `mobile-pet-tracker/` salvo indicación expresa.

| R | Resumen | Test que lo nombra | Commit | Estado |
|---|---|---|---|---|
| R1 | dependencia `@tanstack/react-query@5.102.8` exacta | `src/__tests__/design-drift.test.ts::#87 R1` | rojo `0f9b0293`; verde `f9655ada` | cumplido |
| R2 | los cinco mandos del `QueryClient` | `src/providers/__tests__/query-provider.test.tsx::#87 R2` | rojo `1775ebe5`; verde `f37f5f27` | cumplido |
| R3 | helper `renderWithProviders` con su `queryClient` | `test/__tests__/render-with-providers.test.tsx::#87 R3` | rojo `82997296`; verde `2f6c8f8e`; corrección ronda 2 `2daf16ba` | cumplido |
| R4 | `QueryProvider` dentro de `AuthProvider`, fuera de `Stack` | `src/app/__tests__/layout.test.tsx::#87 R4` | rojo `e9cd3778`; verde `c56df5ea` | cumplido |
| R5 | `unauthorized` de lectura ⇒ `signOut` desde un único sitio | `src/providers/__tests__/query-provider.test.tsx::#87 R5` | rojo `7e09aa6e`; verde `b1726090` | cumplido |
| R6 | `queryClient.clear()` al pasar a `unauthenticated` | `src/providers/__tests__/query-provider.test.tsx::#87 R6` | rojo `df05877d`; verde `dd5f180b` | cumplido |
| R7 | convención y las catorce query keys | `src/api/__tests__/query-keys.test.ts::#87 R7` | rojo `67c40976`; verde `f6ef34d9` | cumplido |
| R8 | `usePetSelection` sin `ApiResult` | `src/hooks/use-pet-selection.test.tsx::#87 R8` | rojo `e5c23b5e`; verde `1d1fdbb0` | cumplido |
| R9 | `screens/docs/index.tsx` por TanStack Query | `src/screens/docs/index.test.tsx::#87 R9` | rojo `cad725dc`; verde `12c84b76` | cumplido |
| R10 | `app/(tabs)/weight-log.tsx` | `src/app/(tabs)/__tests__/weight-log.test.tsx::#87 R10` | rojo `9645cbcf`; verde `0d64e42b` | cumplido |
| R11 | `app/(tabs)/meal-schedule.tsx` | `src/app/(tabs)/__tests__/meal-schedule.test.tsx::#87 R11` | rojo `284eeb2b`; verde `73fc423e` | cumplido |
| R12 | `app/(tabs)/food.tsx` | `src/app/(tabs)/__tests__/food.test.tsx::#87 R12` | rojo `3f47ebc0`; verde `05222fa9` | cumplido |
| R13 | `app/(tabs)/health.tsx` (clave con `limit`) | `src/app/(tabs)/__tests__/health.test.tsx::#87 R13` | rojo `7e135990`; verde `84d30862` | cumplido |
| R14 | `screens/reminders/index.tsx` | `src/screens/reminders/index.test.tsx::#87 R14` | rojo `7fe2c50c`; verde `e20111de` | cumplido |
| R15 | `screens/pairing/index.tsx` (dos `useFocusEffect`) | `src/screens/pairing/index.test.tsx::#87 R15` | rojo `ab66c3b7`; verde `f79ddf58` | cumplido |
| R16 | `screens/profile/index.tsx` | `src/screens/profile/index.test.tsx::#87 R16` | rojo `cb0b6f98`; verde `2d75b433` | cumplido |
| R17 | `screens/home/index.tsx` | `src/screens/home/index.test.tsx::#87 R17` | rojo `70199d55`; verde `ee94846d`; corrección ronda 2 `33f31f42` | cumplido |
| R18 | `app/(tabs)/map.tsx` (sondeo de 15 s intacto) | `src/app/(tabs)/__tests__/map.test.tsx::#87 R18` | rojo `b30a0c83`; verde `aaa5c60a` | cumplido |
| R19 | `use-api` borrado y sin huella | `src/__tests__/design-drift.test.ts::#87 R19` | rojo `fbdd3cdd`; verde `588c691d` | cumplido |
| R20 | los tres candados de `usePetSelection` vivos (**mutación**) | `food.test.tsx` / `health.test.tsx` / `home/index.test.tsx` — `it('does not replace a new selection while the stale pet list refreshes')` | rojo `523ef5b5`; verde `f13d945b` | cumplido |

---

## Criterios de aceptación de #87 → requisitos

> La tabla **canónica**, con el detalle de las dos correcciones, vive en
> [[requirements]] §Cobertura de los criterios de aceptación. Aquí queda el índice
> corto para la revisión.

| # | Criterio (resumido) | R-ids |
|---|---|---|
| 1 | dependencia + `QueryClientProvider` + configuración justificada | **R1**, **R2**, **R4** |
| 2 | los consumidores leen por TanStack Query; ninguno importa `use-api` — **corregido por D3: son once, no diez** | **R9**–**R18** (los diez llamadores), **R8** (el importador de tipo), **R19** |
| 3 | `use-api.ts` y su test borrados, sin importadores en `src/` | **R19**, apoyado en **R8** |
| 4 | `unauthorized` ⇒ `signOut` desde un único sitio — **inaplicable tal cual por D2**: el requisito real es *un único sitio para el `signOut` de **lectura***; las 9 llamadas de mutación en 7 ficheros quedan fuera de alcance | **R5**, **R19** (e) |
| 5 | el comportamiento visible no cambia; tests existentes pasan sin relajar aserciones | **R9**–**R18**, **R20**, «regla de oro» y §Deltas |
| 6 | candados movidos declarados como delta, nunca como absoluto | **R19** (e), [[design]] §6.1 y §6.4, cierre en [[tasks]] §F |
| 7 | test por R-id, rojo antes que verde (C4) | [[tasks]]; **R20** por vía **(b)** de C4 |
| 8 | suite, typecheck e `init.sh` verdes | [[tasks]] §F |
| 9 | gate humano: smoke en dev build de Android | [[requirements]] §Gate humano — **no delegable** |

---

## Herencia registrada para #78 `mobile-alerts-center`

Cuando #87 esté `done`, hay que enmendar **R1, R8, R9 y R11** de
`specs/mobile-alerts-center/`. El qué y el cómo están en [[design]] §9. Resumen de
la deuda, para que no se pierda entre features:

| Requisito de #78 | Qué hay que enmendar |
|---|---|
| R1 | sin cambio de fondo: `src/api/alerts.ts` sigue devolviendo la unión por `kind`. Solo cambia quién la llama. Se añade `alertKeys` a `src/api/query-keys.ts` |
| R8 | el *ack* pasa a `queryClient.setQueryData` sobre el feed + `invalidateQueries` **solo** sobre `alertKeys.list({status:'open'})`. **No** invalidar `['alerts']` a secas: recargaría el feed y rompería su propia promesa de "sin volver a llamar a `listAlerts`" |
| R9 | la acumulación manual de páginas pasa a `useInfiniteQuery` con `getNextPageParam` que traduce `nextCursor: null` a `undefined` |
| R11 | el punto rojo pasa a `useQuery` sobre `alertKeys.list({status:'open'})` y se apaga por invalidación desde el ack. Hay que **quitar** el `refetchAlerts` del `useFocusEffect` de Home, no dejar dos vías |
