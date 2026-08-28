# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Sesión 2026-08-27/28 (leader = sesión Backend)

### Feature #45 `pet-lost-mode` — in_progress, bloqueada por #52

- Implementación Codex CLI (b9a4ac7..1bc6f07), review APROBADO con la única
  condición documental ya resuelta (5793f64). PR #84 abierto.
- Gate R9 (smoke en dev build de Android) **bloqueado**: el tab Map crashea
  por falta de clave de Google Maps → feature #52.

### Feature #52 `android-maps-api-key` — spec_ready

- Spec EARS R1–R6 (4bf031a) en branch `feature/52-android-maps-api-key`.
- Hallazgo clave del spec_author: `android.config.googleMaps.apiKey` está
  **muerto** en este proyecto — el `app.plugin.js` de react-native-maps
  1.27.2 gana al fallback de @expo/prebuild-config y borra la meta-data si
  corre sin props. El mecanismo correcto es la entrada de plugin
  `["react-native-maps", { androidGoogleMapsApiKey }]`.
- Decisiones cerradas por el spec_author, sujetas al gate humano:
  `app.config.ts` dinámico conservando `app.json` como base; variable
  `GOOGLE_MAPS_API_KEY_ANDROID` **sin** prefijo EXPO_PUBLIC_ (evitar que se
  inline en el bundle); clave ausente ⇒ aviso, no throw (un throw haría
  deadlock con prebuild y rompería lint/CI); único test real
  `app.config.test.ts` + contrato de `.env.example`; plumbing de EAS Build
  documentado pero no implementado.
- Pendiente: gate humano (casilla + frontmatter approved + commit en la
  branch). El humano ya está creando la clave en Google Cloud con la SHA-1
  de `android/app/debug.keystore`.
