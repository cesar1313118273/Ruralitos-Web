"use client";

import {
  Activity, BarChart3, ClipboardClock, FileHeart, HeartPulse, Home, LogOut,
  Menu, Plus, Settings2, Stethoscope, UserRound, UsersRound, X,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";

import { CareWorkflow } from "./care-workflow";
import styles from "./emergency.module.css";
import {
  AdmissionPage, CertificatePage, Dashboard, EpiPage, HistoriesPage, MatrixPage,
  PatientsPage, PendingPage, ProfilePage, StatisticsPage,
} from "./module-pages";
import { EmergencyView } from "./types";

const titles: Record<EmergencyView, string> = {
  dashboard: "Panel de emergencia", care: "Nueva atención", pending: "FORM.008 pendientes",
  histories: "Historias clínicas", epi: "EPI epidemiológica", matrix: "Matriz de guardia",
  certificate: "Certificado médico", statistics: "Estadísticas", profile: "Mi perfil",
  admission: "Panel de admisión", patients: "Gestión de pacientes",
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
  function navigate(next: EmergencyView) {
    setView(next); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <div className={styles.shell}>
    <aside className={`${styles.sidebar} ${menu ? styles.sidebarOpen : ""}`}>
      <div className={styles.brand}><span><HeartPulse size={23} /></span><div><strong>Ruralitos</strong><small>Área de emergencia</small></div><button className={styles.closeMenu} onClick={() => setMenu(false)} aria-label="Cerrar menú"><X /></button></div>
      <nav aria-label="Navegación principal">{mainNavigation.map(([id, label, icon]) => <button key={id} className={view === id ? styles.navActive : ""} onClick={() => navigate(id)}>{icon}{label}{id === "pending" && <em>0</em>}</button>)}</nav>
      <div className={styles.navSecondary}><span>Administración clínica</span><button className={view === "admission" ? styles.navActive : ""} onClick={() => navigate("admission")}><UsersRound size={18} /> Admisión</button><button className={view === "patients" ? styles.navActive : ""} onClick={() => navigate("patients")}><UserRound size={18} /> Pacientes</button></div>
      <div className={styles.sidebarFooter}><span>Adaptación integral</span><strong>FORM.008 · EPI · Gestión clínica</strong></div>
    </aside>
    {menu && <button className={styles.backdrop} onClick={() => setMenu(false)} aria-label="Cerrar menú" />}
    <main className={styles.main}>
      <header className={styles.topbar}>
        <button className={styles.menuButton} onClick={() => setMenu(true)} aria-label="Abrir menú"><Menu /></button>
        <div><span>Módulo clínico</span><strong>{titles[view]}</strong></div>
        <div className={styles.topActions}><button onClick={() => navigate("statistics")} className={view === "statistics" ? styles.topActive : ""}><BarChart3 size={17} /><span>Estadísticas</span></button><button onClick={() => navigate("profile")} className={view === "profile" ? styles.topActive : ""}><Settings2 size={17} /><span>Mi perfil</span></button><Link href="/"><LogOut size={17} /><span>Salir</span></Link></div>
      </header>
      <div className={styles.content}>
        {view === "dashboard" && <Dashboard navigate={navigate} />}
        {view === "care" && <CareWorkflow onExit={() => navigate("dashboard")} />}
        {view === "pending" && <PendingPage />}
        {view === "histories" && <HistoriesPage />}
        {view === "epi" && <EpiPage />}
        {view === "matrix" && <MatrixPage />}
        {view === "certificate" && <CertificatePage />}
        {view === "statistics" && <StatisticsPage />}
        {view === "profile" && <ProfilePage />}
        {view === "admission" && <AdmissionPage />}
        {view === "patients" && <PatientsPage />}
      </div>
    </main>
  </div>;
}
