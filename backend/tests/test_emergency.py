from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_normal_mama_score_is_zero() -> None:
    response = client.post(
        "/api/v1/emergency/mama-score",
        json={
            "condicion": "GESTANTE",
            "temperatura": 36.5,
            "pas": 110,
            "pad": 70,
            "fc": 80,
            "fr": 18,
            "saturacion": 98,
            "conciencia": "ALERTA",
            "proteinuria": "NEGATIVA",
            "altitud_2500": False,
        },
    )
    assert response.status_code == 200
    assert response.json()["total"] == 0


def test_mama_score_keeps_altitude_exception() -> None:
    base = {
        "condicion": "GESTANTE",
        "temperatura": 36.5,
        "pas": 110,
        "pad": 70,
        "fc": 80,
        "fr": 18,
        "saturacion": 90,
        "conciencia": "ALERTA",
        "proteinuria": "NEGATIVA",
    }
    sea_level = client.post("/api/v1/emergency/mama-score", json=base).json()
    altitude = client.post(
        "/api/v1/emergency/mama-score", json={**base, "altitud_2500": True}
    ).json()
    assert sea_level["total"] == 1
    assert altitude["total"] == 0


def test_vital_signs_distinguish_invalid_and_extreme() -> None:
    response = client.post(
        "/api/v1/emergency/validate-vital-signs",
        json={"temperatura": 44, "pas": 40, "pad": 50, "pulsioximetria": 101},
    )
    result = response.json()
    assert response.status_code == 200
    assert result["ok"] is False
    assert any("SpO₂" in item for item in result["invalidos"])
    assert any("Temperatura" in item for item in result["alertas"])
    assert any("relación PAS/PAD" in item for item in result["alertas"])
