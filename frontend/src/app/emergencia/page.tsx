import type { Metadata } from "next";

import { EmergencyWorkspace } from "@/components/emergency/emergency-workspace";

export const metadata: Metadata = {
  title: "Emergencia | Ruralitos",
  description: "Admisión, triaje, atención, evolución y egreso de emergencia.",
};

export default function EmergencyPage() {
  return <EmergencyWorkspace />;
}
