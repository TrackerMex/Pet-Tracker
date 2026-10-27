---
feature: "mobile-pet-members"
status: approved     # draft | approved
tags: [mobile, spec, pet-members, invites, expo-router, heroui-native]
---

# Trazabilidad — [[mobile-pet-members]] (#214)

Rutas relativas a `mobile-pet-tracker/`. Una fila por `it` nuevo, renombrado o
enmendado. «Nace verde» marca los `it` que tasks.md declara verdes en su commit
rojo; `progress/impl_mobile-pet-members.md` los lista uno a uno.

## Tests nuevos

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetMembers 200 array da ok` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetMembers 401 da unauthorized` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetMembers 500 da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetMembers 200 no-array da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetInvites 200 array da ok` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetInvites 401 da unauthorized` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetInvites 500 da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetInvites 200 no-array da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: createPetInvite 201 da ok` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: createPetInvite 409 PET_INVITES_LIMIT da invites-limit` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: createPetInvite 409 PET_MEMBERS_LIMIT da members-limit` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: createPetInvite 409 otro code da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: createPetInvite 409 sin cuerpo da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: createPetInvite 401 da unauthorized` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: createPetInvite 500 da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: revokePetInvite 204 da ok` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: revokePetInvite 404 da not-found` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: revokePetInvite 401 da unauthorized` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: revokePetInvite 500 da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: removePetMember 204 da ok` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: removePetMember 401 da unauthorized` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: removePetMember 403 da rejected` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: removePetMember 404 da rejected` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: removePetMember 409 da rejected` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: removePetMember 500 da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite 201 petId string da ok` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite 201 sin petId da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite 201 petId no-string da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite 404 da not-acceptable` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite 400 da not-acceptable` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite 409 da already-member` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite 429 da rate-limited` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite 401 da unauthorized` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite 500 da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetMembers fallo de red da unreachable` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetInvites fallo de red da unreachable` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: createPetInvite fallo de red da unreachable` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: revokePetInvite fallo de red da unreachable` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: removePetMember fallo de red da unreachable` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite fallo de red da unreachable` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetMembers JSON inválido da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: listPetInvites JSON inválido da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: acceptInvite JSON inválido da error` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: ninguna función toca fetch sin baseUrl` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R1 | `src/api/__tests__/pet-members.test.ts::R1: cada función llama al método y la ruta del contrato` | `3a8a1f41 test(mobile): #214 pet members api client (R1)` |
| R2 | `src/api/__tests__/pet-members.test.ts::R2: memberKeys e inviteKeys no comparten prefijo con petKeys` | `37a8d14a test(mobile): #214 member and invite query keys (R2)` |
| R3 | `src/app/__tests__/layout.test.tsx::#214 R3: rutas de Familia > R3: registra members, invite y join-pet justo antes de edit-profile sin cabecera nativa` | `ca1dbd8c test(mobile): #214 pet members routes and stack (R3)` |
| R4 | `src/screens/profile/index.test.tsx::#214 R4: tarjeta de Familia > R4: con mascota añade la fila de Familia a ancho completo y navega a members` | `c5a62f18 test(mobile): #214 family card in profile (R4)` |
| R4 | `src/screens/profile/index.test.tsx::#214 R4: tarjeta de Familia > R4: sin mascota no hay tarjeta de Familia` (nace verde) | `c5a62f18 test(mobile): #214 family card in profile (R4)` |
| R5 | `src/screens/profile/index.test.tsx::#214 R5: subtítulo de Familia > R5: con un solo miembro dice Solo tú cuidas a Rocky` | `a9638a77 test(mobile): #214 family card subtitle (R5)` |
| R5 | `src/screens/profile/index.test.tsx::#214 R5: subtítulo de Familia > R5: con dos miembros usa el singular` | `a9638a77 test(mobile): #214 family card subtitle (R5)` |
| R5 | `src/screens/profile/index.test.tsx::#214 R5: subtítulo de Familia > R5: con tres miembros dice Tú y 2 personas más cuidan a Rocky` | `a9638a77 test(mobile): #214 family card subtitle (R5)` |
| R5 | `src/screens/profile/index.test.tsx::#214 R5: subtítulo de Familia > R5: oculta el subtítulo mientras carga` (nace verde) | `a9638a77 test(mobile): #214 family card subtitle (R5)` |
| R5 | `src/screens/profile/index.test.tsx::#214 R5: subtítulo de Familia > R5: oculta el subtítulo si la lista falla` (nace verde) | `a9638a77 test(mobile): #214 family card subtitle (R5)` |
| R5 | `src/screens/profile/index.test.tsx::#214 R5: subtítulo de Familia > R5: en inglés dice You and 2 more people care for Rocky` | `a9638a77 test(mobile): #214 family card subtitle (R5)` |
| R6 | `src/screens/profile/index.test.tsx::#214 R6: Unirme con código en Perfil > R6: con mascota la cuarta fila es Unirme con código y navega a join-pet` | `457a91f0 test(mobile): #214 join with code in profile (R6)` |
| R6 | `src/screens/profile/index.test.tsx::#214 R6: Unirme con código en Perfil > R6: sin mascota la segunda fila es Unirme con código` | `457a91f0 test(mobile): #214 join with code in profile (R6)` |
| R7 | `src/screens/home/index.test.tsx::#214 R7: Unirme con código en Inicio vacío > R7: el vacío ofrece Unirme con código bajo Añadir mascota` | `a50176d6 test(mobile): #214 join with code on empty home (R7)`; ajustes autorizados: `435d633a test(mobile): #214 read the add pet label from home-empty-action (R7)`; `1db5b19e test(mobile): #214 match the join button recipe as a className suffix (R7)` |
| R7 | `src/screens/home/index.test.tsx::#214 R7: Unirme con código en Inicio vacío > R7: Unirme con código navega a join-pet` | `a50176d6 test(mobile): #214 join with code on empty home (R7)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: muestra el skeleton mientras carga` | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: pet unreachable dice No se pudo conectar con el servidor y Reintentar repite solo esa carga` (fila de it.each) | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: members unreachable dice No se pudo conectar con el servidor y Reintentar repite solo esa carga` (fila de it.each) | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: me unreachable dice No se pudo conectar con el servidor y Reintentar repite solo esa carga` (fila de it.each) | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: pet error dice Algo salió mal` (fila de it.each) | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: members error dice Algo salió mal` (fila de it.each) | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: me error dice Algo salió mal` (fila de it.each) | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: pet unauthorized cierra sesión` (fila de it.each) | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: members unauthorized cierra sesión` (fila de it.each) | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: me unauthorized cierra sesión` (fila de it.each) | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R8 | `src/screens/pet-members/index.test.tsx::R8: el título es Familia de Rocky` | `5b3601ba test(mobile): #214 pet members loading and error (R8)` |
| R9 | `src/screens/pet-members/index.test.tsx::R9: pinta iniciales, nombre, Tú y la píldora de rol en el orden de la API` | `453eebdb test(mobile): #214 member rows (R9)` |
| R9 | `src/screens/pet-members/index.test.tsx::R9: walker y vet se muestran como Familia` | `453eebdb test(mobile): #214 member rows (R9)` |
| R9 | `src/screens/pet-members/index.test.tsx::R9: ningún texto de la pantalla contiene el correo de getMe` (nace verde) | `453eebdb test(mobile): #214 member rows (R9)`; candado reforzado: `f0894424 test(mobile): #214 match the at sign as a substring in the privacy lock (R9)` |
| R9 | `src/utils/__tests__/pet-members.test.ts::R9: memberInitials toma nombre y apellido en mayúsculas` | `5b75dc6f test(mobile): #214 pet members utils (R9, R12, R14)` |
| R9 | `src/utils/__tests__/pet-members.test.ts::R9: memberInitials con apellido vacío deja una sola inicial` | `5b75dc6f test(mobile): #214 pet members utils (R9, R12, R14)` |
| R10 | `src/screens/pet-members/index.test.tsx::R10: el dueño ve Quitar en los demás y no en sí mismo` | `6c2a502c test(mobile): #214 owner view (R10)` |
| R10 | `src/screens/pet-members/index.test.tsx::R10: family no ve Quitar, invitaciones ni CTA` (nace verde) | `6c2a502c test(mobile): #214 owner view (R10)` |
| R10 | `src/screens/pet-members/index.test.tsx::R10: walker tampoco ve acciones de dueño` (nace verde) | `6c2a502c test(mobile): #214 owner view (R10)` |
| R11 | `src/screens/pet-members/index.test.tsx::R11: el sheet nombra a la persona y a su mascota` | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R11 | `src/screens/pet-members/index.test.tsx::R11: Cancelar cierra sin llamar a la API` | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R11 | `src/screens/pet-members/index.test.tsx::R11: confirmar quita e invalida la lista` | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R11 | `src/screens/pet-members/index.test.tsx::R11: rejected invalida y avisa` | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R11 | `src/screens/pet-members/index.test.tsx::R11: unreachable deja el sheet abierto` | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R11 | `src/screens/pet-members/index.test.tsx::R11: error deja el sheet abierto` | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R11 | `src/screens/pet-members/index.test.tsx::R11: unauthorized cierra sesión` | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R11 | `src/screens/pet-members/index.test.tsx::R11: doble toque llama una sola vez` | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R12 | `src/screens/pet-members/index.test.tsx::R12: lista las invitaciones con fecha de creación y vencimiento` | `6ade5a86 test(mobile): #214 pending invites and revoke (R12)` |
| R12 | `src/screens/pet-members/index.test.tsx::R12: sin invitaciones no hay sección` (nace verde) | `6ade5a86 test(mobile): #214 pending invites and revoke (R12)` |
| R12 | `src/screens/pet-members/index.test.tsx::R12: si la lista falla no hay sección` (nace verde) | `6ade5a86 test(mobile): #214 pending invites and revoke (R12)` |
| R12 | `src/screens/pet-members/index.test.tsx::R12: revocar llama a la API e invalida la lista` | `6ade5a86 test(mobile): #214 pending invites and revoke (R12)` |
| R12 | `src/screens/pet-members/index.test.tsx::R12: revocar not-found también invalida` | `6ade5a86 test(mobile): #214 pending invites and revoke (R12)` |
| R12 | `src/screens/pet-members/index.test.tsx::R12: revocar unreachable avisa` | `6ade5a86 test(mobile): #214 pending invites and revoke (R12)` |
| R12 | `src/screens/pet-members/index.test.tsx::R12: family no pide invitaciones` (nace verde) | `6ade5a86 test(mobile): #214 pending invites and revoke (R12)` |
| R12 | `src/utils/__tests__/pet-members.test.ts::R12: inviteDateParts cruza mes y año` | `5b75dc6f test(mobile): #214 pet members utils (R9, R12, R14)` |
| R12 | `src/utils/__tests__/pet-members.test.ts::R12: inviteDateParts en en-US da Oct 9 y 14:00` | `5b75dc6f test(mobile): #214 pet members utils (R9, R12, R14)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: ok invalida invitaciones y abre invite con sus parámetros` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: invites-limit avisa del máximo de invitaciones` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: members-limit avisa del máximo de personas` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: unreachable avisa` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: error avisa` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: unauthorized cierra sesión` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: doble toque crea una sola invitación` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: pulsar member-row-user-2-remove borra el aviso anterior` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: pulsar member-remove-sheet-confirm borra el aviso anterior` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: pulsar invite-row-inv-1-revoke borra el aviso anterior` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: pulsar pet-members-invite-cta borra el aviso anterior` | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: pulsar pet-members-leave borra el aviso anterior` (nace verde: R16 ya borra el aviso) | `3446fa48 test(mobile): #214 create invite (R13)` |
| R13 | `src/screens/pet-members/index.test.tsx::R13: el dueño ve la nota del código` (enmienda 1; verde en `52f7449b`) | `d06f4f69 test(mobile): #214 owner sees the code note (R13, amendment 1)` |
| R14 | `src/screens/pet-invite/index.test.tsx::R14: muestra el código partido, el vencimiento y el mensaje literal` | `bd3be0cc test(mobile): #214 invite screen content (R14)` |
| R14 | `src/screens/pet-invite/index.test.tsx::R14: en inglés el mensaje usa Join with a code` | `bd3be0cc test(mobile): #214 invite screen content (R14)` |
| R14 | `src/screens/pet-invite/index.test.tsx::R14: sin código no ofrece compartir` (nace verde) | `bd3be0cc test(mobile): #214 invite screen content (R14)` |
| R14 | `src/utils/__tests__/pet-members.test.ts::R14: formatInviteCode parte diez caracteres en 5 y 5` | `5b75dc6f test(mobile): #214 pet members utils (R9, R12, R14)` |
| R14 | `src/utils/__tests__/pet-members.test.ts::R14: formatInviteCode deja igual cualquier otra longitud` | `5b75dc6f test(mobile): #214 pet members utils (R9, R12, R14)` |
| R15 | `src/screens/pet-invite/index.test.tsx::R15: Compartir abre la hoja nativa con el mensaje` | `cc775588 test(mobile): #214 share and copy invite (R15)` |
| R15 | `src/screens/pet-invite/index.test.tsx::R15: un Share rechazado no rompe la pantalla` (nace verde) | `cc775588 test(mobile): #214 share and copy invite (R15)` |
| R15 | `src/screens/pet-invite/index.test.tsx::R15: Copiar código copia el código con guion y confirma` | `cc775588 test(mobile): #214 share and copy invite (R15)` |
| R15 | `src/screens/pet-invite/index.test.tsx::R15: si copiar falla la etiqueta no cambia` (nace verde) | `cc775588 test(mobile): #214 share and copy invite (R15)` |
| R16 | `src/screens/pet-members/index.test.tsx::R16: family ve la nota del dueño y Salir de esta mascota` | `73b35351 test(mobile): #214 family view (R16)` |
| R16 | `src/screens/pet-members/index.test.tsx::R16: sin dueño en la lista no hay nota` (nace verde) | `73b35351 test(mobile): #214 family view (R16)` |
| R16 | `src/screens/pet-members/index.test.tsx::R16: el dueño no ve Salir` (nace verde) | `73b35351 test(mobile): #214 family view (R16)` |
| R17 | `src/screens/pet-members/index.test.tsx::R17: el sheet de salir nombra a la mascota y al dueño` | `b650b50a test(mobile): #214 leave pet sheet (R17)` |
| R17 | `src/screens/pet-members/index.test.tsx::R17: sin dueño en la lista el cuerpo usa la variante sin nombre` | `b650b50a test(mobile): #214 leave pet sheet (R17)` |
| R17 | `src/screens/pet-members/index.test.tsx::R17: Cancelar no llama a la API` | `b650b50a test(mobile): #214 leave pet sheet (R17)` |
| R17 | `src/screens/pet-members/index.test.tsx::R17: salir limpia la mascota, invalida la lista y vuelve a Inicio en orden` | `b650b50a test(mobile): #214 leave pet sheet (R17)` |
| R17 | `src/screens/pet-members/index.test.tsx::R17: unreachable deja el sheet abierto` | `b650b50a test(mobile): #214 leave pet sheet (R17)` |
| R17 | `src/screens/pet-members/index.test.tsx::R17: rejected deja el sheet abierto` | `b650b50a test(mobile): #214 leave pet sheet (R17)` |
| R17 | `src/screens/pet-members/index.test.tsx::R17: unauthorized cierra sesión` | `b650b50a test(mobile): #214 leave pet sheet (R17)` |
| R18 | `src/screens/join-pet/index.test.tsx::R18: el formulario admite 11 caracteres con el placeholder del artboard` | `677dea1c test(mobile): #214 join pet form (R18)`; aserción KAV autorizada: `94460e21 test(mobile): #214 read the join pet KAV behavior from the source (R18)` |
| R18 | `src/screens/join-pet/index.test.tsx::R18: Unirme está deshabilitado sin texto` | `677dea1c test(mobile): #214 join pet form (R18)` |
| R18 | `src/screens/join-pet/index.test.tsx::R18: envía el código recortado una sola vez` | `677dea1c test(mobile): #214 join pet form (R18)` |
| R19 | `src/screens/join-pet/index.test.tsx::R19: not-acceptable dice Este código no funciona y marca el borde` | `a9a2a7a0 test(mobile): #214 join pet errors (R19)` |
| R19 | `src/screens/join-pet/index.test.tsx::R19: rate-limited dice Demasiados intentos` | `a9a2a7a0 test(mobile): #214 join pet errors (R19)` |
| R19 | `src/screens/join-pet/index.test.tsx::R19: unreachable dice No se pudo conectar con el servidor` | `a9a2a7a0 test(mobile): #214 join pet errors (R19)` |
| R19 | `src/screens/join-pet/index.test.tsx::R19: error dice Algo salió mal` | `a9a2a7a0 test(mobile): #214 join pet errors (R19)` |
| R19 | `src/screens/join-pet/index.test.tsx::R19: missing-config dice Algo salió mal` | `a9a2a7a0 test(mobile): #214 join pet errors (R19)` |
| R19 | `src/screens/join-pet/index.test.tsx::R19: unauthorized cierra sesión sin aviso` | `a9a2a7a0 test(mobile): #214 join pet errors (R19)` |
| R19 | `src/screens/join-pet/index.test.tsx::R19: editar borra el error` | `a9a2a7a0 test(mobile): #214 join pet errors (R19)` |
| R19 | `src/api/__tests__/pet-members.test.ts::R19: acceptInvite da el mismo kind con 404 y con 400` (nace verde) | `a9a2a7a0 test(mobile): #214 join pet errors (R19)` |
| R20 | `src/screens/join-pet/index.test.tsx::R20: ya miembro sustituye la nota y el botón por Ir a Inicio` | `d202a1b0 test(mobile): #214 already member state (R20)` |
| R20 | `src/screens/join-pet/index.test.tsx::R20: Ir a Inicio vuelve a Inicio` | `d202a1b0 test(mobile): #214 already member state (R20)` |
| R20 | `src/screens/join-pet/index.test.tsx::R20: editar vuelve al formulario` (nace verde) | `d202a1b0 test(mobile): #214 already member state (R20)` |
| R21 | `src/screens/join-pet/index.test.tsx::R21: aceptar invalida las mascotas, selecciona la nueva y vuelve a Inicio en orden` | `3bba4f09 test(mobile): #214 accept invite (R21)` |
| R21 | `src/screens/join-pet/index.test.tsx::R21: no selecciona hasta que la invalidación termina` (nace verde) | `3bba4f09 test(mobile): #214 accept invite (R21)` |
| R22 | `src/__tests__/ui-language.test.ts::#214 R22: copy de Familia > R22: resuelve cada fila de R21_PET_MEMBERS` (nace verde, R22 tabla) | `6d815503 test(mobile): #214 register pet members copy (R22)` |
| R22 | `src/__tests__/ui-language.test.ts::#214 R22: copy de Familia > R22: cada t( de las tres pantallas nuevas tiene su fila` (nace verde, R22 tabla) | `6d815503 test(mobile): #214 register pet members copy (R22)` |
| R22 | `src/__tests__/ui-language.test.ts::#214 R22: copy de Familia > R22: cada clave nueva existe en los dos idiomas y se usa` (nace verde, R22 tabla) | `6d815503 test(mobile): #214 register pet members copy (R22)` |
| R23 | `src/utils/__tests__/pet-members.test.ts::R23: expo-clipboard es dependencia declarada` | `f53af92c test(mobile): #214 expo-clipboard dependency (R23)` |

## Candados enmendados (R24, design.md §7.1)

Una fila por fila de §7.1. Cada título enmendado termina como dice la columna
de test, con su ancla `grep -cF` en §7.1. «Datos» son filas sin título propio:
su commit es el que las toca. «Rojo → verde» copia la tabla de R24 de tasks.md.

| Requisito | Test (archivo · título) | Rojo → verde | Commit (hash + mensaje) |
|---|---|---|---|
| R24, R3 | fila 1: `src/app/__tests__/layout.test.tsx` · título que termina en «declara ocho rutas protegidas y alerts singular (enmendado por #214 R3)» | R3 → R3 | `ca1dbd8c test(mobile): #214 pet members routes and stack (R3)` |
| R24, R3 | fila 2: `src/app/__tests__/layout.test.tsx` · título que termina en «declara alerts/[alertId] como décimo hijo y singular (enmendado por #214 R3)» | R3 → R3 | `ca1dbd8c test(mobile): #214 pet members routes and stack (R3)` |
| R24, R3 | fila 3: `src/app/__tests__/layout.test.tsx` · título que termina en «declara pets/[petId]/geofences como undécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #214 R3)» | R3 → R3 | `ca1dbd8c test(mobile): #214 pet members routes and stack (R3)` |
| R24, R3 | fila 4: `src/app/__tests__/layout.test.tsx` · título que termina en «declara pets/[petId]/geofence-editor como duodécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #214 R3)» | R3 → R3 | `ca1dbd8c test(mobile): #214 pet members routes and stack (R3)` |
| R24, R3 | fila 5: `src/app/__tests__/detail-stack.guard.test.tsx` · título que termina en «aterriza en welcome y no reabre el detalle (enmendado por #214 R3)» | R3 → R3 | `ca1dbd8c test(mobile): #214 pet members routes and stack (R3)` |
| R24, R7 | fila 6: `src/screens/home/index.test.tsx` · título que termina en «queda en el sitio del vacío que sustituye (enmendado por #181 R3) (enmendado por #214 R7)» | R7 → R7 | `a50176d6 test(mobile): #214 join with code on empty home (R7)` |
| R24, R7 | fila 7: `src/screens/home/index.test.tsx` · título que termina en «y sustituye la escena (enmendado por #176 R3) (enmendado por #214 R7)» | R7 → R7 | `a50176d6 test(mobile): #214 join with code on empty home (R7)` |
| R24, R4, R6 | fila 8: `src/screens/profile/index.test.tsx` · título que termina en «abre la ruta de la mascota activa (enmendado por #214 R4, R6)» | R4 → R6 | `c5a62f18 test(mobile): #214 family card in profile (R4)` |
| R24, R4, R6 | fila 9: `src/screens/profile/index.test.tsx` · título que termina en «con mascota ordena dos filas de dos tiles (enmendado por #214 R4, R6)» | R4 → R6 | `c5a62f18 test(mobile): #214 family card in profile (R4)` |
| R24, R6 | fila 10: `src/screens/profile/index.test.tsx` · título que termina en «sin mascota deja recordatorios solo y a ancho completo (enmendado por #214 R6)» | R6 → R6 | `457a91f0 test(mobile): #214 join with code in profile (R6)` |
| R24, R5 | fila 11: `src/screens/profile/index.test.tsx` · doble de `../../api/pet-members` (datos, no es candado) | R5 → R5 | `a9638a77 test(mobile): #214 family card subtitle (R5)` |
| R24, R5 | fila 12: `src/app/(tabs)/__tests__/screens.test.tsx` · doble de `../../../api/pet-members` (datos, no es candado) | R5 → R5 | `a9638a77 test(mobile): #214 family card subtitle (R5)` |
| R24, R11, R17 | fila 13: `src/__tests__/sheet-surface-background.test.ts` · título que termina en «Vinculación y Familia montan un BottomSheet (enmendado por #214 R11, R17)» | R11 → R17 | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R24, R11, R17 | fila 14: `src/__tests__/sheet-surface-background.test.ts` · título que termina en «con backgroundStyle surface (enmendado por #214 R11, R17)» | R11 → R17 | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R24, R7, R10, R11, R12, R13, R15, R16, R17, R18 | fila 15: `src/__tests__/design-drift.test.ts` · título que termina en «(enmendado por #205 R13) (enmendado por #214 R7, R10, R11, R12, R13, R15, R16, R17, R18)» | R10 → R7 | `6c2a502c test(mobile): #214 owner view (R10)` |
| R24, R13, R15, R18 | fila 16: `src/__tests__/design-drift.test.ts` · título que termina en «(enmendado por #198 R15) (enmendado por #214 R13, R15, R18)» | R13 → R18 | `3446fa48 test(mobile): #214 create invite (R13)` |
| R24, R13, R15, R18, R20 | fila 17: `src/__tests__/consistency-classnames.test.ts` · título que termina en «en un único radio (enmendado por #177 R10) (enmendado por #201 R13) (enmendado por #214 R13, R15, R18, R20)» | R13 → R20 | `3446fa48 test(mobile): #214 create invite (R13)` |
| R24, R4, R6 | fila 18: `src/__tests__/consistency-classnames.test.ts` · título que termina en «ChevronRight solo en la tarjeta ancha (#173 R10) (enmendado por #214 R4, R6)» | R4 → R6 | `c5a62f18 test(mobile): #214 family card in profile (R4)` |
| R24, R18 | fila 19: `src/__tests__/consistency-classnames.test.ts` · título que termina en «da color temático a los seis placeholders (enmendado por #214 R18)» | R18 → R18 | `677dea1c test(mobile): #214 join pet form (R18)` |
| R24, R18 | fila 20: `src/__tests__/consistency-classnames.test.ts` · título que termina en «elimina el borde duplicado de los siete campos (enmendado por #214 R18)» | R18 → R18 | `677dea1c test(mobile): #214 join pet form (R18)` |
| R24, R4, R18 | fila 21: `src/__tests__/consistency-classnames.test.ts` · título que termina en «(enmendado por #220 R15) (enmendado por #214 R4, R18)» | R18 → R4 | `677dea1c test(mobile): #214 join pet form (R18)` |
| R24, R4, R18 | fila 22: `src/__tests__/consistency-classnames.test.ts` · it('fusiona la esquina una vez y la entrega a las dos ramas de Card …') (#62 R14, suma) · título que termina en «(enmendado por #220 R15) (enmendado por #214 R4, R18)» | R18 → R4 | `677dea1c test(mobile): #214 join pet form (R18)` |
| R24, R4, R18 | fila 23: `src/__tests__/consistency-classnames.test.ts` · it('deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban …') (#98 R10) · título que termina en «(enmendado por #220 R15) (enmendado por #214 R4, R18)» | R18 → R4 | `677dea1c test(mobile): #214 join pet form (R18)` |
| R24, R13, R15, R18, R20 | fila 24: `src/__tests__/consistency-classnames.test.ts` · título que termina en «fichero a fichero (enmendado por #177 R10) (enmendado por #201 R13) (enmendado por #214 R13, R15, R18, R20)» | R13 → R20 | `3446fa48 test(mobile): #214 create invite (R13)` |
| R24, R7, R11, R15, R16, R17 | fila 25: `src/__tests__/consistency-classnames.test.ts` · título que termina en «(enmendado por #203 R7) (enmendado por #214 R7, R11, R15, R16, R17)» | R11 → R7 | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R24, R23 | fila 26: `src/__tests__/canvas-foundations.test.ts` · título que termina en «#197 R22: no añade dependencias (enmendado por #214 R23)» | R23 (2), sin rojo propio | `8f4e5fe9 chore(mobile): #214 add expo-clipboard (R23)` |
| R24, R23 | fila 27: `src/__tests__/zones-canvas-fidelity.test.ts` · título que termina en «#202 R25: package.json no añade dependencias (enmendado por #214 R23)» | R23 (2), sin rojo propio | `8f4e5fe9 chore(mobile): #214 add expo-clipboard (R23)` |
| R24, R12, R18 | fila 28: `src/__tests__/alerts-canvas-fidelity.test.ts` · título que termina en «(enmendado por #205 R16) (enmendado por #214 R12, R18)» | R12 → R18 | `6ade5a86 test(mobile): #214 pending invites and revoke (R12)` |
| R24, R13, R14, R18, R20 | fila 29: `src/__tests__/profile-canvas-fidelity.test.ts` · título que termina en «(enmendado por #190 R13) (enmendado por #214 R13, R14, R18, R20)» | R13 → R20 | `3446fa48 test(mobile): #214 create invite (R13)`; adelanto acumulado: `75ac271c feat(mobile): #214 family view (R16)` |
| R24, R9, R12, R13, R14, R16, R18, R19 | fila 30: `src/__tests__/profile-canvas-fidelity.test.ts` · título que termina en «(enmendado por #198 R5) (enmendado por #214 R9, R12, R13, R14, R16, R18, R19)» | R9 → R19 | `453eebdb test(mobile): #214 member rows (R9)` |
| R24, R13, R15, R18, R20 | fila 31: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · datos `CTA_ROWS` (los leen R3.1, R3.2, R3.3, R7.2, R7.4, R7.5 y R8.1) | R13 → R20 | `3446fa48 test(mobile): #214 create invite (R13)` |
| R24, R7, R11, R15, R16, R17 | fila 32: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · datos `neutralInventory` (lo lee R4.3) | R11 → R7 | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R24, R7, R11, R13, R15, R16, R17, R18, R20 | fila 33: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · datos `radii` (lo lee R7.3) | R11 → R7 | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R24, R13, R15, R18, R20 | fila 34: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «(enmendado por #202 R15) (enmendado por #214 R13, R15, R18, R20)» | R13 → R20 | `3446fa48 test(mobile): #214 create invite (R13)` |
| R24, R13, R15, R18, R20 | fila 35: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «(enmendado por #189 R13) (enmendado por #214 R13, R15, R18, R20)» | R13 → R20 | `3446fa48 test(mobile): #214 create invite (R13)` |
| R24, R13, R15, R18, R20 | fila 36: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «el inventario de Button con bg-accent está cerrado (enmendado por #214 R13, R15, R18, R20)» | R13 → R20 | `3446fa48 test(mobile): #214 create invite (R13)` |
| R24, R7, R11, R15, R16, R17 | fila 37: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «(enmendado por #203 R7) (enmendado por #214 R7, R11, R15, R16, R17)» | R11 → R7 | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R24, R13, R15, R18 | fila 38: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «(enmendado por #201 R13) (enmendado por #214 R13, R15, R18)» | R13 → R18 | `3446fa48 test(mobile): #214 create invite (R13)`; adelanto acumulado: `fa4b55f6 feat(mobile): #214 remove member sheet (R11)` |
| R24, R13, R15, R18, R20 | fila 39: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «(enmendado por #196 R6) (enmendado por #214 R13, R15, R18, R20)» | R13 → R20 | `3446fa48 test(mobile): #214 create invite (R13)` |
| R24, R7, R11, R15, R17 | fila 40: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «(enmendado por #203 R7) (enmendado por #214 R7, R11, R15, R17)» | R11 → R7 | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R24, R13, R15, R18, R20 | fila 41: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «(enmendado por #201 R13) (enmendado por #214 R13, R15, R18, R20)» | R13 → R20 | `3446fa48 test(mobile): #214 create invite (R13)` |
| R24, R7, R11, R13, R15, R16, R17, R18, R20 | fila 42: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «(enmendado por #205 R13) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)» | R11 → R7 | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R24, R7, R11, R13, R15, R16, R17, R18, R20 | fila 43: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «(enmendado por #201 R13) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)» | R11 → R7 | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R24, R7, R11, R13, R15, R16, R17, R18, R20 | fila 44: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · título que termina en «(enmendado por #196 R5) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)» | R11 → R7 | `64099180 test(mobile): #214 remove member sheet (R11)` |
| R24, R13, R15, R18, R20 | fila 45: `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · agregado de títulos `R3.1`, `R3.2`, `R3.3`, `R6.2` y `R7.2` | R13 → R20 | `3446fa48 test(mobile): #214 create invite (R13)` |
| R24, R22 | fila 46: `src/__tests__/ui-copy-table.ts` · título que termina en «cuadra ALL_USES con la suma de sus bloques (enmendado por #220 R16) (enmendado por #214 R22)» | R22 (tabla), nace verde | `6d815503 test(mobile): #214 register pet members copy (R22)` |
| R24, R22 | fila 47: `src/__tests__/ui-language.test.ts` · título que termina en «(enmendado por #199 R1) (enmendado por #220 R16) (enmendado por #214 R22)» | R22 (tabla), nace verde | `6d815503 test(mobile): #214 register pet members copy (R22)` |
| R24, R22 | fila 48: `src/providers/__tests__/language-provider.test.tsx` · título que termina en «(enmendado por #202 R18) (enmendado por #220 R16) (enmendado por #214 R22)» | R22 (catálogo) → R22 (catálogo) | `bb9f8ab6 test(mobile): #214 pet members catalog keys (R22)` |
| R24, R17 | fila 49: `src/hooks/use-pet-selection.test.tsx` · título que termina en «solo proveedor, hook y Familia mencionan clearPet en producción (enmendado por #214 R17)» | R17 → R17 | `b650b50a test(mobile): #214 leave pet sheet (R17)` |
| R24 | corrida completa `bunx jest`, `bunx tsc --noEmit` y lint en verde | — | Sin commit propio (R24); ver registros finales en `progress/impl_mobile-pet-members.md` |

Merge de `origin/dev` (ca2d0abb) en la branch: `91a70ed3 Merge remote-tracking branch 'origin/dev' into feature/214-mobile-pet-members`
(17 conflictos resueltos sumando los dos lados; los hashes de las filas anteriores no cambian porque no hubo rebase).

Segundo merge de `origin/dev` (2c103bb4, trae #222) en la branch: `d97d498b Merge remote-tracking branch 'origin/dev' into feature/214-mobile-pet-members`
(3 conflictos resueltos sumando los dos lados; los hashes de las filas anteriores no cambian porque no hubo rebase).

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
