# Adaptación del módulo de Emergencia

Fuente funcional: proyecto Google Apps Script `FORM008_AppScript` proporcionado por el usuario.

## Disponible en la adaptación integral de interfaz

- Flujo guiado: establecimiento, paciente, triaje, atención y finalización.
- Admisión con paciente identificado o sin documento.
- Evaluación ABC, cinco prioridades y destino inicial.
- Signos vitales y validación de límites de captura en FastAPI.
- Motivo, antecedentes, enfermedad actual, examen físico y XABCDE.
- Modo crítico para registrar estabilización antes de completar el formulario.
- Evolución y observación dentro del episodio.
- Diagnóstico, plan, egreso y selección de documentos finales.
- SCORE MAMÁ conforme a la lógica existente del proyecto, recalculado en FastAPI.
- Interfaz adaptable a escritorio, tableta y teléfono.
- Menú principal con accesos a atención, pendientes, historias, EPI, matriz y certificados.
- Catálogo de historias con filtros y panel de auditoría.
- EPI grupal e individual con secciones clínicas, epidemiológicas, laboratorio, contactos y actividades.
- Matriz de entrega de guardia con ámbito y formatos de salida.
- Certificado médico con diagnósticos, reposo, firma y formatos.
- Panel estadístico del profesional.
- Perfil, ingreso, registro, recuperación de clave, firma, sello y eliminación de cuenta.
- Paneles de admisión y gestión completa de pacientes.
- Campos repetibles para diagnósticos, medicamentos, muestras y contactos.

## Preparado, pendiente de persistencia

Las pantallas y controles ya están adaptados. Estas operaciones necesitan la conexión con
Supabase para conservar y consultar datos reales:

- Inicio de sesión, roles y establecimientos autorizados.
- Búsqueda, creación y vinculación definitiva de pacientes.
- Episodios, controles seriados, triajes, evoluciones y auditoría.
- Bandeja de pendientes e historias clínicas.
- Catálogo CIE-10 e inventario de medicamentos.
- Generación y descarga de FORM.008, Excel y certificado médico.
- Firmas, sellos, EPI, matriz de guardia y estadísticas.

Hasta completar esa integración, el navegador no guarda información clínica de pacientes en
almacenamiento local. Esto evita crear una persistencia temporal insegura.
