# Consulta externa: atenciones diarias

## Fuente y alcance

La referencia es el sistema Apps Script entregado en diez archivos: `index.html`,
`Auth.js`, `Citas.js`, `Config.js`, `Consultorios.js`, `Especialidades.js`,
`Certificados.js`, `Neurodesarrollo.js`, `Perfil.js` y `Utilidades.js`.

El `index.html` se conserva sin alteraciones en `docs/original-consulta-externa/index.html`.
`frontend/generate-consulta-externa.mjs` produce la versión visible en Next.js. Solo
resuelve las dos variables de plantilla (`unidad` y `resetToken`) e introduce un
adaptador para `google.script.run`; comprueba que no cambie la cantidad de controles
HTML. Las plantillas y los identificadores privados de Google Sheets/Drive de los
archivos `.js` no se publican en el repositorio.

## Flujo original de la agenda

1. `Auth.js` registra e inicia sesión con tres roles internos: `admisionista`,
   `licenciada` (Enfermería) y `medico`. En el registro, las especialidades médicas
   aparecen como opciones de rol; el médico queda vinculado a su especialidad.
2. `Especialidades.js` permite al admisionista administrar el catálogo. El médico
   solo recibe su especialidad. `Consultorios.js` vincula cada consultorio a un
   médico y configura horario, duración de turno y almuerzo.
3. `Consultorios.js::generarHorario` crea bloques de consulta. El almuerzo ocupa
   exactamente su horario, incluso si no coincide con la duración de un turno.
4. `Citas.js::guardarCita` permite a Admisión asignar o editar pacientes en una
   jornada actual o futura. Las jornadas pasadas y las citas `atendido` son de
   solo lectura para Admisión. El formulario usa nombre, identificación,
   pertenencia y cobertura; no existe un formulario de cita diferente.
5. Enfermería ve el panel de nueve signos vitales/antropometría. Los cambios son
   un borrador local; se guardan al marcar `Listo`. Editar de nuevo invalida la
   preparación. Solo se permiten acciones clínicas en el día actual.
6. El médico ve únicamente su consultorio. Si Enfermería dejó la cita en
   `listo_consulta` con `preparado=true`, aparece `Marcar atendido`; no se exige
   un paso adicional de iniciar y finalizar. La cita atendida queda bloqueada
   para Admisión.
7. `index.html` sincroniza la agenda cada 2,4 segundos y usa `BroadcastChannel`
   más una señal de `localStorage` entre pestañas. Una actualización remota no
   reemplaza campos locales marcados como pendientes de guardar. El catálogo se
   revisa aparte cada 6,5 segundos.

## Otras secciones del mismo sistema, no incluidas en esta primera subdivisión

| Archivo | Función comprobada |
| --- | --- |
| `Citas.js` | Historial mensual: todos los atendidos para Admisión, pacientes preparados por la enfermera, y pacientes atendidos por el médico. |
| `Neurodesarrollo.js` | Formulario médico para citas atendidas de control/tamizaje; estadística para médico y admisionista. Excluye Odontología y Obstetricia. |
| `Certificados.js` | Certificado general para médicos; PCD y Cuidador PCD no disponibles para Odontología ni Obstetricia. Usa pacientes atendidos autorizados. |
| `Perfil.js` | Todos editan nombre/cédula; solo médicos administran firma y sello. |
| `Utilidades.js` | Estructura y migraciones de las hojas, fechas/horas, validaciones y acceso a Sheets. |

## Estado de la adaptación

- La interfaz de Apps Script se muestra sin formularios ni roles inventados en
  `/consulta-externa/atenciones-diarias`.
- `backend/app/modules/consultation/daily.py` traslada las reglas puras de horario,
  permisos y estado; las pruebas comparan los casos importantes del original.
- El adaptador `bridge.js` falla de forma explícita y **no transmite ni guarda**
  credenciales o datos clínicos. No se simulan cuentas, pacientes ni citas.
- Para que registro, inicio de sesión, colaboración entre roles y persistencia
  funcionen, hay que conectar las llamadas del Apps Script a servicios seguros
  en el backend y al almacén acordado. Hasta entonces la vista es una réplica
  verificable de interfaz, no un sistema clínico operativo.
