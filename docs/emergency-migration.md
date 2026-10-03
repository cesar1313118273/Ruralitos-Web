# Adaptación del módulo de Emergencia

Fuente funcional: proyecto Google Apps Script `FORM008_AppScript` proporcionado por el usuario.

## Disponible en la primera versión web

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

## Preparado, pendiente de persistencia

Estas funciones necesitan la conexión con Supabase para conservar y consultar datos reales:

- Inicio de sesión, roles y establecimientos autorizados.
- Búsqueda, creación y vinculación definitiva de pacientes.
- Episodios, controles seriados, triajes, evoluciones y auditoría.
- Bandeja de pendientes e historias clínicas.
- Catálogo CIE-10 e inventario de medicamentos.
- Generación y descarga de FORM.008, Excel y certificado médico.
- Firmas, sellos, EPI, matriz de guardia y estadísticas.

Hasta completar esa integración, el navegador no guarda información clínica de pacientes en
almacenamiento local. Esto evita crear una persistencia temporal insegura.
