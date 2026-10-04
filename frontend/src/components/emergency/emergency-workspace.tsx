"use client";

import {
  Activity, BarChart3, ClipboardClock, FileHeart, HeartPulse, Home, LogOut,
  Menu, Plus, Settings2, Stethoscope, UserRound, UsersRound, X,
} from "lucide-react";
import { ReactNode, useState } from "react";

import { EmergencyView, OriginalEmergency } from "./original-emergency";
import styles from "./emergency.module.css";

const titles: Record<EmergencyView, string> = {
  dashboard: "Panel de emergencia", care: "Nueva atención", pending: "FORM.008 pendientes",
  histories: "Historias clínicas", epi: "EPI epidemiológica", matrix: "Matriz de guardia",
  certificate: "Certificado médico", statistics: "Estadísticas", profile: "Mi perfil",
  admission: "Panel de admisión", patients: "Gestión de pacientes", access: "Acceso",
};

const mainNavigation: Array<[EmergencyView, string, ReactNode]> = [
  ["dashboard", "Panel principal", <Home key="i" size={19} />],
  ["care", "Nueva atención", <Plus key="i" size={19} />],
  ["pending", "Pendientes", <ClipboardClock key="i" size={19} />],
  ["histories", "Historias clínicas", <FileHeart key="i" size={19} />],
  ["epi", "EPI epidemiológica", <Activity key="i" size={19} />],
  ["matrix", "Matriz de guardia", <BarChart3 key="i" size={19} />],
  ["certificate", "Certificado médico", <Stethoscope key="i" size={19} />],
];

export function EmergencyWorkspace() {
  const [view, setView] = useState<EmergencyView>("dashboard");
  const [menu, setMenu] = useState(false);
  const [careRevision, setCareRevision] = useState(0);
  function navigate(next: EmergencyView) {
    if (next === "care") setCareRevision((current) => current + 1);
    setView(next); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <div className={styles.shell}>
    <aside className={`${styles.sidebar} ${menu ? styles.sidebarOpen : ""}`}>
      <div className={styles.brand}><span><HeartPulse size={23} /></span><div><strong>Ruralitos</strong><small>Área de emergencia</small></div><button className={styles.closeMenu} onClick={() => setMenu(false)} aria-label="Cerrar menú"><X /></button></div>
      <nav aria-label="Navegación principal">{mainNavigation.map(([id, label, icon]) => <button key={id} className={view === id ? styles.navActive : ""} onClick={() => navigate(id)}>{icon}{label}</button>)}</nav>
      <div className={styles.navSecondary}><span>Administración clínica</span><button className={view === "admission" ? styles.navActive : ""} onClick={() => navigate("admission")}><UsersRound size={18} /> Admisión</button><button className={view === "patients" ? styles.navActive : ""} onClick={() => navigate("patients")}><UserRound size={18} /> Pacientes</button></div>
      <div className={styles.sidebarFooter}><span>Adaptación integral</span><strong>FORM.008 · EPI · Gestión clínica</strong></div>
    </aside>
    {menu && <button className={styles.backdrop} onClick={() => setMenu(false)} aria-label="Cerrar menú" />}
    <main className={styles.main}>
      <header className={styles.topbar}>
        <button className={styles.menuButton} onClick={() => setMenu(true)} aria-label="Abrir menú"><Menu /></button>
        <div><span>Módulo clínico</span><strong>{titles[view]}</strong></div>
        <div className={styles.topActions}><button onClick={() => navigate("statistics")} className={view === "statistics" ? styles.topActive : ""}><BarChart3 size={17} /><span>Estadísticas</span></button><button onClick={() => navigate("profile")} className={view === "profile" ? styles.topActive : ""}><Settings2 size={17} /><span>Mi perfil</span></button><button onClick={() => navigate("access")}><LogOut size={17} /><span>Salir</span></button></div>
      </header>
      <div className={styles.content}>
        <OriginalEmergency key={careRevision} view={view} navigate={navigate} />
      </div>
    </main>
  </div>;
}
