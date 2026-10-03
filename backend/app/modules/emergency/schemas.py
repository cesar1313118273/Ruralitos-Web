from typing import Literal

from pydantic import BaseModel, Field


class VitalSignsInput(BaseModel):
    temperatura: float | None = None
    pas: float | None = None
    pad: float | None = None
    pulso: float | None = None
    frecuencia_respiratoria: float | None = None
    pulsioximetria: float | None = None
    glicemia: float | None = None
    peso: float | None = None
    talla: float | None = None
    perimetro_cefalico: float | None = None
    llenado_capilar: float | None = None
    glasgow_ocular: int | None = None
    glasgow_verbal: int | None = None
    glasgow_motora: int | None = None


class VitalSignsResult(BaseModel):
    ok: bool
    invalidos: list[str]
    alertas: list[str]
    version: str


class MamaScoreInput(BaseModel):
    condicion: Literal["GESTANTE", "PUERPERA"]
    temperatura: float = Field(ge=25, le=45)
    pas: float = Field(ge=20, le=300)
    pad: float = Field(ge=10, le=200)
    fc: float = Field(ge=10, le=300)
    fr: float = Field(ge=1, le=100)
    saturacion: float = Field(ge=0, le=100)
    conciencia: Literal[
        "CONFUSA / AGITADA",
        "ALERTA",
        "RESPONDE A LA VOZ / SOMNOLIENTA",
        "RESPONDE AL DOLOR / ESTUPOROSA",
        "NO RESPONDE",
    ]
    proteinuria: Literal["NEGATIVA", "POSITIVA (+)"]
    altitud_2500: bool = False


class MamaScoreResult(BaseModel):
    completo: bool = True
    total: int
    detalle: dict[str, int]
    categoria: str
    recomendacion: str
    altitud_2500: bool
    version: str
