from dataclasses import dataclass

from app.modules.emergency.schemas import (
    MamaScoreInput,
    MamaScoreResult,
    VitalSignsInput,
    VitalSignsResult,
)

VITAL_SIGNS_VERSION = "P13-V1-2026-09-27"
MAMA_SCORE_VERSION = "MSP-EC-GPC-CONTROL-PRENATAL-ANEXO8"


@dataclass(frozen=True)
class VitalRule:
    label: str
    unit: str
    minimum: float
    maximum: float
    alert_minimum: float | None = None
    alert_maximum: float | None = None


VITAL_RULES = {
    "temperatura": VitalRule("Temperatura", "°C", 10, 50, 30, 43),
    "pas": VitalRule("PAS", "mmHg", 0, 400, 50, 260),
    "pad": VitalRule("PAD", "mmHg", 0, 300, 20, 180),
    "pulso": VitalRule("Frecuencia cardíaca", "lpm", 0, 400, 20, 250),
    "frecuencia_respiratoria": VitalRule("Frecuencia respiratoria", "rpm", 0, 150, 5, 80),
    "pulsioximetria": VitalRule("SpO₂", "%", 0, 100, 70),
    "glicemia": VitalRule("Glicemia", "mg/dL", 0, 3000, 20, 1000),
    "peso": VitalRule("Peso", "kg", 0.1, 700, alert_maximum=350),
    "talla": VitalRule("Talla", "cm", 10, 300, alert_maximum=230),
    "perimetro_cefalico": VitalRule("Perímetro cefálico", "cm", 5, 100, 20, 70),
    "llenado_capilar": VitalRule("Llenado capilar", "s", 0, 120, alert_maximum=10),
}


def validate_vital_signs(payload: VitalSignsInput) -> VitalSignsResult:
    values = payload.model_dump()
    invalid: list[str] = []
    alerts: list[str] = []

    for field, rule in VITAL_RULES.items():
        value = values[field]
        if value is None:
            continue
        measurement = f"{rule.label} {value:g} {rule.unit}".strip()
        if value < rule.minimum or value > rule.maximum:
            invalid.append(
                f"{measurement} fuera del límite de captura "
                f"{rule.minimum:g}–{rule.maximum:g} {rule.unit}".strip()
            )
        elif (
            rule.alert_minimum is not None
            and value < rule.alert_minimum
            or rule.alert_maximum is not None
            and value > rule.alert_maximum
        ):
            alerts.append(measurement)

    if payload.pas is not None and payload.pad is not None and payload.pad >= payload.pas:
        alerts.append(f"PA {payload.pas:g}/{payload.pad:g} mmHg: revise la relación PAS/PAD")

    glasgow_rules = (
        (payload.glasgow_ocular, "Glasgow ocular", 1, 4),
        (payload.glasgow_verbal, "Glasgow verbal", 1, 5),
        (payload.glasgow_motora, "Glasgow motora", 1, 6),
    )
    for value, label, minimum, maximum in glasgow_rules:
        if value is not None and not minimum <= value <= maximum:
            invalid.append(f"{label} debe estar entre {minimum} y {maximum}.")

    return VitalSignsResult(
        ok=not invalid,
        invalidos=invalid,
        alertas=alerts,
        version=VITAL_SIGNS_VERSION,
    )


def _category(total: int) -> str:
    if total == 0:
        return "PUNTAJE 0"
    if total == 1:
        return "PUNTAJE 1"
    if total <= 4:
        return "PUNTAJE 2-4"
    return "PUNTAJE >=5"


def _recommendation(total: int) -> str:
    if total == 0:
        return "Evaluar factores de riesgo, bienestar materno-fetal y signos de alarma."
    if total == 1:
        return (
            "Reevaluar signos vitales y factores de riesgo. "
            "Repetir SCORE MAMÁ cada 4 horas y registrar."
        )
    if total <= 4:
        return "Tratar y referir según el caso. Reevaluar y repetir SCORE MAMÁ cada hora."
    return "Tratar y referir según el caso. Reevaluar y repetir SCORE MAMÁ cada 30 minutos."


def calculate_mama_score(payload: MamaScoreInput) -> MamaScoreResult:
    if payload.fc <= 50:
        fc = 3
    elif payload.fc < 60:
        fc = 1
    elif payload.fc <= 100:
        fc = 0
    elif payload.fc <= 110:
        fc = 1
    elif payload.fc < 120:
        fc = 2
    else:
        fc = 3

    if payload.pas <= 70:
        pas = 3
    elif payload.pas < 90:
        pas = 2
    elif payload.pas < 140:
        pas = 0
    elif payload.pas < 160:
        pas = 2
    else:
        pas = 3

    if payload.pad <= 50:
        pad = 3
    elif payload.pad < 60:
        pad = 2
    elif payload.pad <= 85:
        pad = 0
    elif payload.pad < 90:
        pad = 1
    elif payload.pad < 110:
        pad = 2
    else:
        pad = 3

    fr = 3 if payload.fr <= 11 else 0 if payload.fr <= 22 else 2 if payload.fr < 30 else 3
    if payload.temperatura <= 35.5:
        temperature = 2
    elif payload.temperatura < 37.3:
        temperature = 0
    elif payload.temperatura < 38.5:
        temperature = 1
    else:
        temperature = 3

    if payload.saturacion <= 85:
        saturation = 3
    elif payload.saturacion < 90:
        saturation = 2
    elif payload.saturacion <= 93:
        saturation = 0 if payload.altitud_2500 else 1
    else:
        saturation = 0
    consciousness = {
        "CONFUSA / AGITADA": 2,
        "ALERTA": 0,
        "RESPONDE A LA VOZ / SOMNOLIENTA": 1,
        "RESPONDE AL DOLOR / ESTUPOROSA": 2,
        "NO RESPONDE": 3,
    }[payload.conciencia]
    proteinuria = 0 if payload.proteinuria == "NEGATIVA" else 1
    detail = {
        "frecuencia_cardiaca": fc,
        "sistolica": pas,
        "diastolica": pad,
        "frecuencia_respiratoria": fr,
        "temperatura": temperature,
        "saturacion": saturation,
        "conciencia": consciousness,
        "proteinuria": proteinuria,
    }
    total = sum(detail.values())
    return MamaScoreResult(
        total=total,
        detalle=detail,
        categoria=_category(total),
        recomendacion=_recommendation(total),
        altitud_2500=payload.altitud_2500,
        version=MAMA_SCORE_VERSION,
    )
