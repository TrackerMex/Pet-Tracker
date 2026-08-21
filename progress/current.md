# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Sesion 2026-08-21 (4) — feature #36 mobile-map-live

- PR #65 (#35 mobile-home-dashboard) mergeado por el humano; main actualizado.
- Branch `feature/36-mobile-map-live` creada desde main.
- #36 esta `pending` → lanzar spec_author y PARAR hasta aprobación humana de la spec.
- Tensión conocida a resolver en la spec: expo-maps y react-native-maps requieren dev build, pero la restricción del humano es smoke SOLO con Expo Go.
- spec_author: spec de #36 escrita en `specs/mobile-map-live/` (draft, R1–R13) y #36 → `spec_ready`. La tensión se resolvió: react-native-maps 1.27.2 SÍ corre en Expo Go (evidencia doc SDK 57 en design.md §D1); expo-maps descartado (alpha, no Go). Sin react-query (polling = setInterval+refetch en useFocusEffect, design §D2). Lost Mode sin endpoint backend → stub deshabilitado + feature #45 `pet-lost-mode` añadida al backlog. Esperando aprobación humana del gate.
