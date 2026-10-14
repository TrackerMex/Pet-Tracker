---
feature: "mobile-tab-screens-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — [[mobile-tab-screens-canvas-fidelity]] (#173)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/theme/__tests__/font-registration.test.ts::#173 R1: registra Inter-ExtraBold como sexto peso` | `c91efe84` test(mobile): registra Inter-ExtraBold como sexto peso (#173 R1)<br>`2d462afa` feat(mobile): registra Inter-ExtraBold como sexto peso (#173 R1) |
| R2 | `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts::#173 R2: tokens de radio hero y tile`<br>`mobile-pet-tracker/src/theme/__tests__/global-css.test.ts::#173 R2.3: tamaños de letra 13 y 26`<br>`mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts::#173 R2: inventario de radios nuevos`<br>`mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts::#173 R2.4: inventario de tamaños nuevos` | `9591e3f1` test(mobile): tokens de radio hero y tile y tamaños 13 y 26 (#173 R2)<br>`ca83aaf9` feat(mobile): tokens de radio hero y tile y tamaños 13 y 26 (#173 R2) |
| R3 | `mobile-pet-tracker/src/components/__tests__/card.test.tsx::#173 R3: variantes hero y flat sin sombra`<br>`mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts::#173 R3: Card hero y flat solo en Perfil` | `7056ca0e` test(mobile): variantes hero y flat de Card sin sombra (#173 R3)<br>`a18abc0d` feat(mobile): variantes hero y flat de Card sin sombra (#173 R3) |
| R4 | `mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx::#173 R4: variante avatars`<br>`mobile-pet-tracker/src/screens/profile/index.test.tsx::#173 R4: Perfil pide la variante avatars`<br>`mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts::#173 R4: avatars solo en Perfil` | `fc6715cf` test(mobile): PetSwitcher con variante avatars en Perfil (#173 R4)<br>`36356ae8` feat(mobile): PetSwitcher con variante avatars en Perfil (#173 R4) |
| R5 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#173 R5: cápsula de añadir mascota` | `aaeb9bab` test(mobile): cápsula de añadir mascota en Perfil (#173 R5)<br>`166c8af4` feat(mobile): cápsula de añadir mascota en Perfil (#173 R5) |
| R6 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara` | `f785d96c` test(mobile): hero de la mascota con anillo y cámara (#173 R6)<br>`fe0dc8a5` feat(mobile): hero de la mascota con anillo y cámara (#173 R6) |
| R7 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#168 R5 (enmendado por #173 R7): chips pastel con sexo localizado`<br>`mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R18: los sitios resuelven por clave y no queda copy suelta` | `89795331` test(mobile): chips de Perfil con sexo localizado (#173 R7)<br>`bf21fbbd` feat(mobile): chips de Perfil con sexo localizado (#173 R7) |
| R8 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#173 R8: información en Card flat`<br>`mobile-pet-tracker/src/screens/profile/index.test.tsx::#61 R9 (enmendado por #173 R8): pet-info-card no lleva etiqueta de sección` | `427079ac` test(mobile): información en Card flat con estado del collar (#173 R8)<br>`92308138` feat(mobile): información en Card flat con estado del collar (#173 R8) |
| R9 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#173 R9: última señal relativa` | `b73f4963` test(mobile): última señal relativa en Perfil (#173 R9)<br>`9b01360f` feat(mobile): última señal relativa en Perfil (#173 R9) |
| R10 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#168 R6 (enmendado por #173 R10): los accesos son tiles pastel en rejilla 2×2` | `44e0b9c6` test(mobile): rejilla 2x2 de accesos en Perfil (#173 R10)<br>`94614567` feat(mobile): rejilla 2x2 de accesos en Perfil (#173 R10) |
| R11 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#173 R11: cuenta en Card flat con Switch e idioma`<br>`mobile-pet-tracker/src/screens/profile/index.test.tsx::#65 R14 (enmendado por #173 R11): Profile cambia el idioma y repinta sin reiniciar`<br>`mobile-pet-tracker/src/screens/profile/index.test.tsx::#168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard` | `506ad153` test(mobile): cuenta en Card flat con Switch e idioma (#173 R11)<br>`74641446` feat(mobile): cuenta en Card flat con Switch e idioma (#173 R11) |
| R12 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#173 R12: entrada escalonada` | `b10028b7` test(mobile): entrada escalonada de Perfil (#173 R12)<br>`83112c89` feat(mobile): entrada escalonada de Perfil (#173 R12) |
| R13 | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx::#173 R13: Perfil retira cuatro claves y añade tres`<br>`mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R7: Profile resuelve su copy por clave` | `bf21fbbd` feat(mobile): chips de Perfil con sexo localizado (#173 R7)<br>`92308138` feat(mobile): información en Card flat con estado del collar (#173 R8)<br>`9b01360f` feat(mobile): última señal relativa en Perfil (#173 R9)<br>`94614567` feat(mobile): rejilla 2x2 de accesos en Perfil (#173 R10)<br>`74641446` feat(mobile): cuenta en Card flat con Switch e idioma (#173 R11)<br>`5e48dc40` refactor(mobile): términos finales de catálogo y tabla de copy de Perfil (#173 R13) |
| R14 | `mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts::#173 R14: enmiendas`<br>`mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts::#173 R14: la carta declara los cambios` | `1bb49c33` test(mobile): enmiendas de #173 a carta y specs (#173 R14)<br>`4369cafc` docs(ui): enmiendas de #173 a carta y specs (#173 R14) |
| R15 | `mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts::#173 R15: grep-limpio`<br>`mobile-pet-tracker/src/__tests__/design-drift.test.ts::R9: mobile-pets-profile sin drift`<br>`mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts::#62 R14: toda esquina no-cápsula que dibuja el repo es continua`<br>`mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts::#61 R4: el acento como tinta usa accent-strong` | `2ed3a7fc` test(mobile): candados de grep-limpio de Perfil (#173 R15)<br>Rojo: sonda S15 sin commit; un solo ● de R15 y limpio=0 (informe §5). |
| R16 | pendiente (gate humano: casilla de requirements §Aprobación) | n/a |
| R17 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::R2: estructura Figma` | `0b6d8329` test(mobile): contenedor de Perfil con las métricas del artboard (#173 R17)<br>`9222e981` feat(mobile): contenedor de Perfil con las métricas del artboard (#173 R17) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente", salvo R16, que cierra el humano.
Convención de commit: `feat(mobile): <desc> (#173 R1)`. Los rojos van en `test(mobile): … (#173 Rn)`.

En R13 la columna de commits lista los verdes de T7, T8, T9, T10 y T11 más el refactor de T13 (ver
`tasks.md`).

El implementer actualiza esta tabla tras cada commit; el reviewer la valida al aprobar (ver
[[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
