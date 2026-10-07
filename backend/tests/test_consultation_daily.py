from datetime import date
from unittest import TestCase

from app.modules.consultation.daily import (
    OfficeHours,
    VITAL_FIELDS,
    can_edit_admission,
    can_mark_attended,
    can_prepare,
    generate_schedule,
    state_after_preparation,
)


class DailyCareParityTests(TestCase):
    def test_lunch_keeps_exact_times_instead_of_rounding_to_appointment_length(self) -> None:
        blocks = generate_schedule(OfficeHours("12:40", "14:10", 20, "13:00", "13:30"))
        self.assertEqual(
            [(b["hora"], b["horaFin"], b["tipo"]) for b in blocks],
            [
                ("12:40", "13:00", "consulta"),
                ("13:00", "13:30", "almuerzo"),
                ("13:30", "13:50", "consulta"),
                ("13:50", "14:10", "consulta"),
            ],
        )

    def test_slot_crossing_lunch_is_skipped_like_original(self) -> None:
        blocks = generate_schedule(OfficeHours("12:50", "14:00", 20, "13:00", "13:30"))
        self.assertEqual(blocks[0]["tipo"], "almuerzo")
        self.assertEqual(blocks[0]["hora"], "13:00")

    def test_past_day_is_read_only_and_attended_is_locked_for_admission(self) -> None:
        today = date(2026, 10, 7)
        self.assertFalse(can_edit_admission("admisionista", date(2026, 10, 6), today, "pendiente_signos"))
        self.assertFalse(can_edit_admission("admisionista", today, today, "atendido"))
        self.assertTrue(can_edit_admission("admisionista", date(2026, 10, 8), today, "pendiente_signos"))
        self.assertFalse(can_edit_admission("licenciada", today, today, "pendiente_signos"))

    def test_nurse_prepares_only_current_day_and_doctor_requires_ready_patient(self) -> None:
        today = date(2026, 10, 7)
        self.assertTrue(can_prepare("licenciada", today, today, "pendiente_signos"))
        self.assertFalse(can_prepare("licenciada", date(2026, 10, 8), today, "pendiente_signos"))
        self.assertFalse(can_mark_attended("medico", today, today, "pendiente_signos", False, "m1", "m1"))
        self.assertFalse(can_mark_attended("medico", today, today, "listo_consulta", True, "m1", "m2"))
        self.assertTrue(can_mark_attended("medico", today, today, "listo_consulta", True, "m1", "m1"))

    def test_nine_original_vital_fields_and_preparation_transitions(self) -> None:
        self.assertEqual(len(VITAL_FIELDS), 9)
        self.assertEqual(state_after_preparation("pendiente_signos", True), "listo_consulta")
        self.assertEqual(state_after_preparation("listo_consulta", False), "pendiente_signos")
        with self.assertRaisesRegex(ValueError, "finalizada"):
            state_after_preparation("atendido", False)
