"""Reglas puras de atenciones diarias, sin acceso a datos clínicos.

Correspondencia: Consultorios.js::generarHorario y Citas.js::{guardarCita,
guardarPreparacionPaciente, invalidarPreparacionPorEdicion, marcarPacienteAtendido}.
"""

from dataclasses import dataclass
from datetime import date
from typing import Literal

Role = Literal["admisionista", "licenciada", "medico"]
AppointmentState = Literal[
    "agendado", "pendiente_signos", "listo_consulta", "en_consulta", "atendido", "cancelado"
]

VITAL_FIELDS = (
    "frecuenciaCardiaca",
    "presionSistolica",
    "presionDiastolica",
    "temperatura",
    "frecuenciaRespiratoria",
    "altura",
    "peso",
    "perimetroCefalico",
    "perimetroAbdominal",
)


def _minutes(value: str) -> int:
    hour, separator, minute = value.partition(":")
    if not separator or not hour.isdigit() or len(minute) != 2 or not minute.isdigit():
        raise ValueError(f"Hora inválida: {value}")
    total = int(hour) * 60 + int(minute)
    if int(hour) > 23 or int(minute) > 59:
        raise ValueError(f"Hora inválida: {value}")
    return total


def _hhmm(minutes: int) -> str:
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


@dataclass(frozen=True)
class OfficeHours:
    hora_inicio: str
    hora_fin: str
    minutos_por_paciente: int
    almuerzo_inicio: str = ""
    almuerzo_fin: str = ""


def generate_schedule(office: OfficeHours) -> list[dict[str, str | bool]]:
    """Reproduce los bloques y el almuerzo exacto de Consultorios.js."""
    start, end = _minutes(office.hora_inicio), _minutes(office.hora_fin)
    duration = office.minutos_por_paciente
    if not isinstance(duration, int) or not 5 <= duration <= 240:
        raise ValueError("La duración por paciente debe estar entre 5 y 240 minutos.")
    if end <= start:
        raise ValueError("La hora final debe ser posterior a la hora inicial.")
    if bool(office.almuerzo_inicio) != bool(office.almuerzo_fin):
        raise ValueError("Completa ambas horas del almuerzo.")
    lunch_start = _minutes(office.almuerzo_inicio) if office.almuerzo_inicio else None
    lunch_end = _minutes(office.almuerzo_fin) if office.almuerzo_fin else None
    if lunch_start is not None and lunch_end is not None:
        if lunch_end <= lunch_start:
            raise ValueError("El fin del almuerzo debe ser posterior al inicio.")
        if lunch_start < start or lunch_end > end:
            raise ValueError("El almuerzo debe estar dentro de la jornada.")

    blocks: list[dict[str, str | bool]] = []
    current = start
    while current < end:
        if lunch_start is not None and current == lunch_start:
            blocks.append(
                {
                    "hora": _hhmm(lunch_start),
                    "horaFin": _hhmm(lunch_end),
                    "tipo": "almuerzo",
                    "bloqueado": True,
                }
            )
            current = lunch_end
            continue
        next_time = min(current + duration, end)
        if lunch_start is not None and current < lunch_start < next_time:
            current = lunch_start
            continue
        if lunch_start is not None and lunch_start < current < lunch_end:
            current = lunch_end
            continue
        blocks.append(
            {
                "hora": _hhmm(current),
                "horaFin": _hhmm(next_time),
                "tipo": "consulta",
                "bloqueado": False,
            }
        )
        current = next_time
    return blocks


def can_edit_admission(role: Role, appointment_day: date, today: date, state: AppointmentState) -> bool:
    return role == "admisionista" and appointment_day >= today and state != "atendido"


def can_prepare(role: Role, appointment_day: date, today: date, state: AppointmentState) -> bool:
    return role == "licenciada" and appointment_day == today and state != "atendido"


def can_mark_attended(
    role: Role,
    appointment_day: date,
    today: date,
    state: AppointmentState,
    prepared: bool,
    assigned_doctor_id: str,
    user_id: str,
) -> bool:
    return (
        role == "medico"
        and appointment_day == today
        and state == "listo_consulta"
        and prepared
        and bool(assigned_doctor_id)
        and assigned_doctor_id == user_id
    )


def state_after_preparation(state: AppointmentState, prepared: bool) -> AppointmentState:
    if state == "atendido":
        raise ValueError("La atención ya fue finalizada y no puede modificarse.")
    return "listo_consulta" if prepared else "pendiente_signos"
