from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["system"])


@router.get("")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
