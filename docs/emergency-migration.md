# Adaptación fiel del módulo de Emergencia

La referencia entregada es `FORM008_AppScript`. Los 19 HTML originales se conservan sin cambios en
`docs/original-emergency/`. La pantalla web utiliza los campos, textos, opciones y orden de esos
archivos; solo la barra lateral y la presentación visual corresponden a Next.js.

## Correspondencia de pantallas

| Pantalla web | HTML original |
| --- | --- |
| Panel principal | `PanelPrincipal.html` |
| Nueva atención: establecimiento y acceso | `Index.html` |
| Nueva atención: paciente, triaje y atención clínica | `Paciente.html`, `Triage.html`, `Atencion.html` |
| Nueva atención: embarazo, exámenes, diagnóstico, tratamiento, egreso y documentos | `Finalizacion.html` |
| Modo Crítico y Evolución/Observación | `ModoCritico.html`, `EvolucionObservacion.html` |
| Pendientes e historias clínicas | `ListaPendientes.html`, `CatalogoHistorias.html` |
| EPI, matriz y certificado | `EpiInterfaz.html`, `MatrizGuardiaInterfaz.html`, `CertificadoMedicoInterfaz.html` |
| Estadísticas y perfil | `EstadisticasInterfaz.html`, `PerfilInterfaz.html` |
| Admisión y gestión de pacientes | `RolesInterfaz.html`, `EstadisticoInterfaz.html` |

`Estilos.html` y `Scripts.html` también se conservan como referencia. Las listas que `Scripts.html`
creaba en tiempo de ejecución (eventos, antecedentes, examen físico, exámenes, síntomas, vacunas,
riesgos, actividades y filas repetibles) están trasladadas a `original-dynamics.ts`.

`frontend/generate-emergency-markup.mjs` vuelve a generar `original-markup.json` desde los HTML
archivados. El generador solo retira los manejadores de eventos de Apps Script y la clase `hidden`
de la sección raíz para poder mostrarla en Next.js; conserva los controles y las opciones originales.

## Estado de la integración

La navegación, las pestañas, los campos condicionales y las filas repetibles pueden inspeccionarse
y utilizarse en la interfaz. Todavía no hay base de datos conectada a estas pantallas. Buscar,
guardar, finalizar, autenticar, consultar catálogos y generar documentos requiere adaptar los
servicios `.gs` al backend y conectar Supabase. La web no afirma que esas operaciones se hayan
completado: muestra un aviso cuando se intentan. No se guarda información clínica en el navegador.
