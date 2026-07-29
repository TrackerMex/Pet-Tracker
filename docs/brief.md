# **BRIEF MAESTRO DE PRODUCTO Y DESARROLLO**

## Aplicación móvil Pet Tracker

### 1\. Descripción general del proyecto

Diseñar y desarrollar una aplicación móvil para propietarios de perros y gatos que integre en una sola plataforma la localización GPS de la mascota, el seguimiento de su actividad, la administración de su información de salud y la generación de planes orientativos de alimentación.

La aplicación estará conectada a un localizador GPS colocado en el collar de la mascota. El dispositivo transmitirá sus posiciones, estado de batería, conectividad y demás parámetros disponibles hacia la plataforma Wialon.

La aplicación no se conectará directamente con el collar. La información seguirá esta arquitectura:

Collar GPS  
→ red celular  
→ plataforma Wialon  
→ APIs y endpoints propios  
→ backend de Pet Tracker  
→ aplicación móvil.

Wialon será responsable de recibir y almacenar la telemetría del dispositivo. El backend propio transformará esta información en funciones específicas para mascotas, como ubicación actual, recorridos, geocercas, alertas, actividad física y patrones de comportamiento.

---

## 2\. Objetivo principal

Crear un ecosistema digital que permita a los propietarios:

* Saber dónde se encuentra su mascota.

* Recibir alertas cuando salga o entre en zonas configuradas.

* Consultar recorridos y actividad física.

* Administrar vacunas, medicamentos, consultas y documentos médicos.

* Recibir recordatorios relacionados con la salud.

* Obtener orientación alimentaria basada en las características de la mascota.

* Compartir temporalmente información con familiares, cuidadores o veterinarios.

* Detectar cambios importantes en las rutinas de actividad, descanso, alimentación o ubicación.

La aplicación debe transmitir una sensación de seguridad, cuidado, prevención y acompañamiento cotidiano. Debe tener un diseño moderno, amigable, lúdico con muchas imágenes de perros y gatos. Colores pastel.

---

## 3\. Público objetivo

La aplicación estará dirigida principalmente a:

* Propietarios de perros y gatos.

* Familias con varias mascotas.

* Personas que dejan a sus mascotas solas durante algunas horas.

* Propietarios preocupados por extravíos o escapes.

* Personas que desean mantener organizados los registros médicos de sus mascotas.

* Cuidadores y paseadores.

* Médicos veterinarios autorizados.

* Clínicas y hospitales veterinarios.

* Refugios y asociaciones de protección animal.

---

## 4\. Tipos de usuario

La plataforma deberá considerar los siguientes perfiles:

### Propietario principal

Puede registrar mascotas, asociar collares, consultar ubicación, administrar información de salud, alimentación, usuarios invitados y configuraciones.

### Familiar o cuidador

Puede consultar información de determinadas mascotas según los permisos otorgados.

### Paseador

Puede acceder temporalmente a la ubicación, recorrido y datos básicos necesarios durante un paseo.

### Veterinario

Puede consultar o actualizar información clínica cuando cuente con autorización del propietario.

### Administrador de la plataforma

Puede administrar usuarios, mascotas, dispositivos, planes, incidencias, catálogos, configuraciones y soporte.

Los permisos deben asignarse por mascota. Un usuario no debe poder consultar información de una mascota únicamente conociendo su identificador.

---

## 5\. Módulos principales

La aplicación estará compuesta por un núcleo común y tres pilares funcionales.

### Núcleo común

* Registro de usuarios.

* Inicio de sesión.

* Recuperación de contraseña.

* Gestión de perfiles.

* Alta de mascotas.

* Listado “Mis mascotas”.

* Perfil completo de cada mascota.

* Gestión de permisos.

* Configuración de notificaciones.

* Asociación de dispositivos GPS.

* Centro de alertas y recordatorios.

### Pilar 1: localización, seguridad y actividad

* Ubicación actual.

* Nivel de batería.

* Estado de conectividad.

* Fecha y hora de la última comunicación.

* Dirección literal de la ubicación.

* Historial de recorridos.

* Geocercas múltiples.

* Alertas de entrada y salida.

* Modo mascota perdida.

* Lugares frecuentes.

* Tiempo fuera de casa.

* Compartir ubicación temporal.

* Alertas de movimiento en horarios inusuales.

* Distancia recorrida.

* Tiempo activo.

* Tiempo en reposo.

* Número y duración de paseos.

* Indicadores diarios y semanales.

### Pilar 2: salud y expediente clínico

* Expediente médico cronológico.

* Vacunas aplicadas.

* Catálogo de vacunas.

* Próxima dosis calculada.

* Desparasitación interna y externa.

* Medicamentos y horarios.

* Alergias.

* Enfermedades crónicas.

* Consultas veterinarias.

* Registro de peso.

* Condición corporal.

* Documentos médicos.

* Cartillas.

* Veterinario habitual.

* Recordatorios.

* Resumen médico descargable.

* Carnet digital en PDF.

* Lectura asistida de cartillas mediante inteligencia artificial.

### Pilar 3: alimentación y nutrición

* Perfil nutricional.

* Orientación por especie.

* Orientación por raza.

* Orientación por edad.

* Orientación por peso y talla.

* Requerimiento calórico estimado.

* Porción diaria.

* Número de comidas.

* Horarios.

* Recomendaciones explicadas mediante inteligencia artificial.

Las recomendaciones de alimentación deberán generarse mediante reglas y fuentes nutricionales verificadas. La inteligencia artificial servirá para explicar, personalizar y resumir la información, pero no deberá sustituir la validación veterinaria.

---

## 6\. Alta de usuario

La aplicación debe permitir registrar un usuario mediante:

* Nombres.

* Apellidos.

* Correo electrónico.

* Número telefónico.

* Contraseña.

* Confirmación de contraseña.

* País.

* Zona horaria.

* Aceptación de términos y aviso de privacidad.

El correo electrónico deberá validarse mediante enlace o código de confirmación.

La autenticación debe utilizar correo electrónico o número telefónico. No es recomendable crear un nombre de usuario adicional, salvo que exista una razón comercial específica.

---

## 7\. Alta de mascota

El proceso de alta deberá solicitar inicialmente:

* Nombre.

* Fotografía.

* Especie: perro o gato.

* Raza.

* Fecha de nacimiento o edad aproximada.

* Sexo.

* Peso.

* Talla.

* Color.

* Estado de esterilización.

* Número de microchip, opcional.

Después del registro básico, el usuario podrá asociar un collar GPS mediante:

* ESN.

* IMEI.

* Número de serie.

* Código QR.

* Código de activación.

La plataforma deberá validar que el dispositivo exista, esté disponible y no esté asociado activamente a otra mascota.

---

## 8\. Perfil de mascota

El perfil será la ficha central de la mascota y deberá mostrar:

* Fotografía.

* Nombre.

* Especie.

* Raza.

* Edad calculada.

* Peso actual.

* Variación de peso.

* Estado general.

* Batería.

* Última ubicación.

* Última comunicación.

* Próxima vacuna.

* Próximo medicamento o recordatorio.

* Resumen de actividad.

* Plan de alimentación.

* Alertas recientes.

Desde el perfil se podrá acceder a:

* Ubicación.

* Actividad.

* Salud.

* Alimentación.

* Documentos.

* Recordatorios.

* Configuración.

* Usuarios autorizados.

---

## 9\. Arquitectura tecnológica

La arquitectura recomendada será:

### Aplicación móvil

Expo para Android e iOS.

### Backend

NestJS/Typescrip, organizado como un monolito modular durante la primera etapa.

### Base de datos

PostgreSQL

### Plataforma telemática

Wialon para recepción de mensajes GPS, almacenamiento de posiciones, sensores, geocercas, comandos y notificaciones.

### Notificaciones móviles

Por definir

### Mapas

Google Maps Platform o Mapbox.

### Archivos

Por definir

### Inteligencia artificial

API de OpenAI utilizada desde el backend, nunca directamente desde la aplicación móvil.

### Tiempo real

WebSockets o un servicio equivalente para actualizar ubicación, estado y alertas sin recargar manualmente la aplicación.

---

## 10\. Integración con Wialon

El backend deberá incluir una capa de integración y normalización que permita convertir los datos de Wialon en información de negocio para mascotas.

Flujo:

1. El collar transmite información.

2. Wialon recibe el mensaje.

3. La unidad registrada en Wialon se identifica mediante ID, ESN o IMEI.

4. El backend consulta o recibe los datos.

5. Los datos se validan y normalizan.

6. Se asocian con la mascota correspondiente.

7. Se actualiza la última posición.

8. Se procesan geocercas, recorridos y actividad.

9. Se generan eventos y alertas.

10. La aplicación recibe la actualización.

El sistema deberá obtener de Wialon, cuando el dispositivo lo permita:

* Latitud.

* Longitud.

* Fecha y hora del dispositivo.

* Fecha y hora de recepción.

* Velocidad.

* Dirección.

* Altitud.

* Satélites.

* Precisión.

* Nivel de batería.

* Estado de conexión.

* Calidad de señal.

* Parámetros de acelerómetro.

* Botón SOS.

* Estado de retiro del collar.

* Otros sensores disponibles.

---

## 11\. Procesamiento de posiciones

Las posiciones obtenidas desde Wialon deberán pasar por un proceso de validación antes de mostrarse o utilizarse.

Proceso:

Posiciones Wialon  
→ eliminación de puntos inválidos  
→ ordenamiento cronológico  
→ detección de saltos GPS  
→ cálculo de distancia  
→ cálculo de velocidad  
→ clasificación de movimiento o reposo  
→ agrupación por recorridos o paseos  
→ generación de KPI diarios.

Se deberán descartar o marcar:

* Coordenadas inválidas.

* Posiciones sin fecha confiable.

* Puntos duplicados.

* Saltos geográficos imposibles.

* Velocidades incompatibles con una mascota.

* Posiciones con precisión insuficiente.

* Datos recibidos fuera de secuencia.

La plataforma deberá diferenciar entre:

* Hora generada por el dispositivo.

* Hora recibida por Wialon.

* Hora procesada por el backend.

* Zona horaria del usuario.

---

## 12\. Geocercas y alertas

El usuario podrá crear varias geocercas por mascota.

Tipos iniciales:

* Zona segura circular.

* Zona segura poligonal.

* Zona restringida.

* Hogar.

* Parque.

* Veterinaria.

* Guardería.

Eventos:

* Entrada.

* Salida.

* Permanencia fuera.

* Permanencia dentro.

* Movimiento en horario inusual.

* Dispositivo desconectado.

* Batería baja.

* Posición desactualizada.

La plataforma deberá evitar notificaciones repetitivas. Una salida de geocerca deberá generar un evento abierto y no volver a alertar hasta que exista un cambio relevante, una escalación configurada o el regreso de la mascota.

---

## 13\. Modo mascota perdida

El modo mascota perdida deberá:

* Destacarse visualmente.

* Solicitar confirmación antes de activarse.

* Aumentar la frecuencia de actualización cuando el collar lo permita.

* Mostrar ubicación y recorrido reciente.

* Permitir compartir un enlace temporal.

* Notificar a usuarios autorizados.

* Mostrar batería y conectividad.

* Registrar la hora de activación.

* Mantener un historial del incidente.

* Permitir cerrar el modo al recuperar la mascota.

---

## 14\. Actividad y reposo

La primera versión calculará actividad utilizando posiciones GPS, velocidad y, cuando esté disponible, acelerómetro.

Indicadores iniciales:

* Distancia diaria.

* Tiempo en movimiento.

* Tiempo en reposo.

* Número de paseos.

* Duración promedio de los paseos.

* Hora del primer y último paseo.

* Tiempo fuera de la geocerca del hogar.

* Comparación contra los siete días anteriores.

* Cumplimiento del objetivo diario.

El sistema deberá construir una línea base individual. Las alertas deberán basarse preferentemente en cambios sostenidos respecto al comportamiento habitual de la misma mascota, no únicamente en valores genéricos por raza.

---

## 15\. Salud

El expediente clínico deberá ser cronológico y estructurado.

Cada registro podrá incluir:

* Tipo de evento.

* Fecha.

* Veterinario.

* Clínica.

* Diagnóstico.

* Observaciones.

* Medicamentos.

* Documentos.

* Próximo control.

* Responsable del registro.

La inteligencia artificial podrá:

* Extraer datos de una cartilla fotografiada.

* Identificar nombres de vacunas.

* Detectar fechas.

* Proponer próximas dosis.

* Resumir antecedentes.

* Organizar documentos.

Los datos extraídos mediante IA deberán presentarse al usuario para revisión y confirmación antes de almacenarse definitivamente.

La plataforma no deberá emitir diagnósticos médicos ni sustituir la consulta con un veterinario.

---

## 16\. Alimentación

El motor de alimentación deberá combinar reglas determinísticas e inteligencia artificial.

### Datos utilizados

* Especie.

* Raza.

* Edad.

* Peso.

* Talla.

* Sexo.

* Esterilización.

* Nivel de actividad.

* Condición corporal.

* Peso objetivo.

* Alergias.

* Enfermedades registradas.

* Tipo de alimento.

* Densidad calórica.

### Resultado esperado

* Requerimiento calórico estimado.

* Porción diaria.

* Número de comidas.

* Horarios sugeridos.

* Objetivo nutricional.

* Recomendaciones de seguimiento.

* Advertencias.

* Fecha de próxima revisión.

La IA deberá explicar el plan en lenguaje sencillo, pero no modificar automáticamente una dieta veterinaria ni recomendar tratamientos clínicos.

---

## 17\. Notificaciones y recordatorios

La aplicación deberá contar con un motor central de recordatorios para:

* Vacunas.

* Desparasitación.

* Medicamentos.

* Consultas.

* Registro de peso.

* Alimentación.

* Compra de alimento.

* Batería baja.

* Collar desconectado.

* Entrada o salida de geocerca.

* Actividad inusual.

* Falta de consumo de alimento.

* Falta de consumo de agua.

El usuario podrá configurar:

* Activación o desactivación.

* Canal.

* Anticipación.

* Horario silencioso.

* Prioridad.

* Usuarios que reciben la alerta.

---

## 18\. Experiencia de usuario

La experiencia debe ser:

* Amigable.

* Moderna.

* Segura.

* Emocional, sin perder profesionalismo.

* Fácil de entender.

* Adecuada para usuarios sin conocimientos técnicos.

* Consistente en Android e iOS.

La pantalla principal debe responder rápidamente estas preguntas:

* ¿Mi mascota está segura?

* ¿Dónde se encuentra?

* ¿El collar está conectado?

* ¿Tiene batería?

* ¿Tiene algún recordatorio pendiente?

* ¿Cómo fue su actividad hoy?

* ¿Existe alguna alerta de salud o alimentación?

Los términos técnicos de Wialon no deberán mostrarse al usuario final.

---

## 19\. Seguridad y privacidad

El sistema deberá incluir:

* Autenticación segura.

* Contraseñas cifradas.

* Tokens de acceso.

* HTTPS.

* Control de permisos por mascota.

* Validación de propiedad del dispositivo.

* Historial de accesos.

* Registro de cambios.

* Enlaces temporales con vencimiento.

* Protección de documentos médicos.

* Protección de coordenadas.

* Consentimiento para compartir ubicación.

* Exportación y eliminación de información.

* Límites de solicitudes.

* Protección de claves de Wialon, mapas e inteligencia artificial.

Las credenciales de Wialon y las claves de servicios externos deberán permanecer exclusivamente en el backend.

---

## 20\. Alcance del MVP

La primera versión deberá incluir:

1. Registro e inicio de sesión.

2. Recuperación de contraseña.

3. Alta de mascotas.

4. Listado de mascotas.

5. Perfil básico.

6. Asociación del collar GPS.

7. Estado del dispositivo.

8. Última posición.

9. Mapa.

10. Una geocerca segura.

11. Alerta de salida y entrada.

12. Historial básico de recorridos.

13. Distancia y tiempo activo.

14. Registro de vacunas.

15. Próxima dosis.

16. Recordatorios.

17. Registro de peso.

18. Perfil nutricional básico.

19. Plan alimentario orientativo.

20. Notificaciones push.

---

## 21\. Funciones posteriores al MVP

* Modo mascota perdida avanzado.

* Geocercas múltiples.

* Compartir ubicación mediante enlace.

* Acceso veterinario.

* Lectura de cartillas con IA.

* Resúmenes médicos.

* Registro detallado de medicamentos.

* Catálogo de alimentos.

* Seguimiento de consumo de agua.

* Detección de cambios de actividad.

* Sueño probable.

* Comportamientos repetitivos.

* Planes familiares.

* Portal para veterinarias.

* Panel administrativo empresarial.

* Suscripciones y pagos.

---

## 22\. Resultado solicitado al equipo o agente de IA

A partir de este brief, generar:

1. Arquitectura funcional.

2. Arquitectura técnica.

3. Modelo entidad-relación.

4. Catálogo de tablas.

5. Roles y permisos.

6. Flujos de navegación.

7. Historias de usuario.

8. Criterios de aceptación.

9. Contrato OpenAPI.

10. Catálogo de endpoints.

11. Diseño del módulo Wialon.

12. Estrategia de sincronización.

13. Motor de geocercas y alertas.

14. Plan de desarrollo por fases.

15. Backlog priorizado.

16. Pruebas técnicas iniciales.

17. Wireframes.

18. Diseño visual.

19. Código del backend.

20. Aplicación móvil Expo.

21. Pruebas automatizadas.

22. Documentación de instalación y operación.

No comenzar a programar todo el producto inmediatamente. Primero presentar para aprobación:

* Supuestos.

* Alcance del MVP.

* Riesgos técnicos.

* Dependencias del hardware.

* Modelo de datos.

* Arquitectura.

* Endpoints.

* Backlog de implementación.

---

## 23\. Criterio general de éxito

La solución será considerada exitosa cuando un usuario pueda:

* Registrarse.

* Dar de alta una mascota.

* Asociar correctamente un collar.

* Consultar una posición confiable.

* Recibir una alerta de geocerca.

* Consultar un recorrido.

* Revisar la actividad diaria.

* Registrar una vacuna.

* Recibir un recordatorio.

* Consultar un plan básico de alimentación.

* Administrar toda la información desde una experiencia sencilla, segura y comprensible.