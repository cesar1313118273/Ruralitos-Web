from fastapi import APIRouter

from app.modules.emergency.schemas import (
    MamaScoreInput,
    MamaScoreResult,
    VitalSignsInput,
    VitalSignsResult,
)
from app.modules.emergency.service import calculate_mama_score, validate_vital_signs

router = APIRouter(prefix="/emergency", tags=["emergency"])


@router.post("/validate-vital-signs", response_model=VitalSignsResult)
def validate_vitals(payload: VitalSignsInput) -> VitalSignsResult:
    """Validate capture limits and flag plausible but extreme measurements."""
    return validate_vital_signs(payload)


@router.post("/mama-score", response_model=MamaScoreResult)
def mama_score(payload: MamaScoreInput) -> MamaScoreResult:
    """Recalculate the Ecuador MSP MAMA score on the trusted server."""
    return calculate_mama_score(payload)
