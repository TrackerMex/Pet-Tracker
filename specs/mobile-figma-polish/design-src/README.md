# design-src — fuente del Figma Make (#46)

Volcado literal del código fuente del diseño, extraído vía MCP de Figma el
2026-08-23 desde el Make `K3GsL0HHUCW3AaFj3osx0B`
(https://www.figma.com/make/K3GsL0HHUCW3AaFj3osx0B/Aplicaci%C3%B3n-m%C3%B3vil--copia-?t=DC2jVyHpL6J7TLte-1).

| Archivo | Origen en el Make | Nota |
|---|---|---|
| `App.tsx` | `src/app/App.tsx` | TODO el diseño: pantallas, layout, clases Tailwind (1849 líneas) |
| `theme.css` | `src/styles/theme.css` | Tokens: paleta, radios, tipografía base |
| `fonts.css` | `src/styles/fonts.css` | Única fuente: Inter (Google Fonts, pesos 300–900) |

No volcados: `src/styles/index.css` (solo 3 @imports), `tailwind.css`
(genérico), `guidelines/Guidelines.md` (plantilla vacía de Figma Make, sin
reglas propias), `src/app/components/ui/*` (shadcn genérico),
`src/imports/pasted_text/pet-tracker-brief.md` (es `docs/brief.md` de este
repo). `src/styles/globals.css` apareció en el listado del MCP pero el
servidor devuelve "not found".

Imágenes del Make: `file://figma/make/image/K3GsL0HHUCW3AaFj3osx0B/<hash>.png`
(139; los hashes referenciados desde App.tsx son los que importan).

Este directorio es REFERENCIA de solo lectura para la spec: el diseño es React
web + Tailwind + shadcn; la app real usa heroui-native + uniwind. Nada de aquí
se importa tal cual al código de la app.
