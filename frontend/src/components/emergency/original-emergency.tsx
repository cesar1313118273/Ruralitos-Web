"use client";

import { useEffect, useRef, useState } from "react";

import source from "./original-markup.json";
import { addDiagnosis, addEpiContact, addEpiSample, addMedicine, initializeOriginalDynamics, toggle, updateAge, updateChecklist, updateGlasgow, updateMama, updateMedicine } from "./original-dynamics";
import styles from "./original-emergency.module.css";

export type EmergencyView = "dashboard" | "care" | "pending" | "histories" | "epi" | "matrix" | "certificate" | "statistics" | "profile" | "admission" | "patients" | "access";
type Mode = "normal" | "critical" | "evolution";

const pages: Array<Exclude<EmergencyView, "care">> = ["dashboard", "pending", "histories", "epi", "matrix", "certificate", "statistics", "profile", "admission", "patients", "access"];
const pageMarkup: Record<Exclude<EmergencyView, "care">, string> = {
  dashboard: source.dashboard, pending: source.pending, histories: source.histories,
  epi: source.epi, matrix: source.matrix, certificate: source.certificate,
  statistics: source.statistics, profile: source.profile, admission: source.admission,
  patients: source.patients, access: source.auth,
};
const careMarkup = [source.establishment, source.patient, source.triage, source.clinical, source.final];

function status(root: HTMLElement, selector: string, message: string) {
  const field = root.querySelector<HTMLElement>(selector);
  if (!field) return;
  field.textContent = message;
  field.classList.remove("hidden");
}

function clearFields(container: Element, except?: Element) {
  container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input,select,textarea").forEach((field) => {
    if (field === except) return;
    if (field instanceof HTMLInputElement && (field.type === "checkbox" || field.type === "radio")) field.checked = false;
    else field.value = "";
  });
}

function showTabbed(root: HTMLElement, kind: "clinical" | "final", index: number) {
  const panelSelector = kind === "clinical" ? ".clinical-panel" : ".final-panel";
  const buttonSelector = kind === "clinical" ? "[data-clinical]" : "[data-final]";
  root.querySelectorAll<HTMLElement>(panelSelector).forEach((panel, current) => panel.classList.toggle("hidden", current !== index));
  root.querySelectorAll<HTMLElement>(buttonSelector).forEach((button, current) => button.classList.toggle("active", current === index));
  if (kind === "final") {
    toggle(root, "#finalNextButton", index !== 4);
    toggle(root, "#documentFinishSection", index === 4);
  }
}

export function OriginalEmergency({ view, navigate }: { view: EmergencyView; navigate: (view: EmergencyView) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode>("normal");
  const [clinicalTab, setClinicalTab] = useState(0);
  const [finalTab, setFinalTab] = useState(0);

  function go(next: number) {
    setStep(Math.max(0, Math.min(4, next)));
    setMode("normal");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const root = rootRef.current;
    const clicked = event.target as Element;
    const button = clicked.closest<HTMLButtonElement>("button");
    if (!root || !button || button.disabled) return;

    if (button.closest("#mainMenu")) {
      const route: Array<[string, EmergencyView]> = [["medical", "care"], ["pending", "pending"], ["histories", "histories"], ["epi", "epi"], ["matrix", "matrix"], ["certificate", "certificate"]];
      const destination = route.find(([className]) => button.classList.contains(className))?.[1];
      if (destination) { navigate(destination); if (destination === "care") go(0); }
      return;
    }
    if (button.dataset.clinical) { const index = Array.from(root.querySelectorAll("[data-clinical]")).indexOf(button); setClinicalTab(index); showTabbed(root, "clinical", index); return; }
    if (button.dataset.final) { const index = Array.from(root.querySelectorAll("[data-final]")).indexOf(button); setFinalTab(index); showTabbed(root, "final", index); return; }

    if (button.closest(".clinical-actions")) {
      if (button.textContent?.includes("Anterior")) { if (clinicalTab) { setClinicalTab(clinicalTab - 1); showTabbed(root, "clinical", clinicalTab - 1); } else go(2); }
      else if (clinicalTab < 6) { setClinicalTab(clinicalTab + 1); showTabbed(root, "clinical", clinicalTab + 1); }
      else go(4);
      return;
    }
    if (button.closest(".final-actions")) {
      if (button.textContent?.includes("Anterior")) { if (finalTab) { setFinalTab(finalTab - 1); showTabbed(root, "final", finalTab - 1); } else go(3); }
      else if (finalTab < 4) { setFinalTab(finalTab + 1); showTabbed(root, "final", finalTab + 1); }
      return;
    }

    if (button.closest(".repeat-row,.epi-repeat-row")) {
      if (button.classList.contains("remove-btn")) button.closest(".repeat-row,.epi-repeat-row")?.remove();
      return;
    }
    const label = button.textContent?.replace(/\s+/g, " ").trim() || "";
    if (label === "Guardar como pendiente") { status(root, "#draftStatus", "El borrador aún no se guarda: falta conectar la base de datos."); return; }
    if (label === "Guardar y continuar") { go(1); return; }
    if (label === "Buscar paciente") {
      if (button.closest("#patientSection")) toggle(root, "#patientForm", true);
      else if (button.closest("#certificatePage")) toggle(root, "#certificateForm", true);
      else if (button.closest("#epiPage")) toggle(root, "#epiForm", true);
      else if (button.closest("#admissionPage")) toggle(root, "#admissionRoleForm", true);
      else if (button.closest("#statisticianPage")) toggle(root, "#statPatientForm", true);
      return;
    }
    if (label === "Paciente sin documento") {
      const form = button.closest("#patientSection") ? "#patientForm" : "#admissionRoleForm";
      toggle(root, form, true);
      const kind = root.querySelector<HTMLSelectElement>(`${form} [name="tipoDocumento"]`);
      if (kind) kind.value = "SIN DOCUMENTO";
      toggle(root, form === "#patientForm" ? "#patientIdentityLink" : "#admissionIdentityLink", true);
      return;
    }
    if (label.includes("Agregar presuntivo")) { addDiagnosis(root, "presuntivos"); return; }
    if (label.includes("Agregar definitivo")) { addDiagnosis(root, "definitivos"); return; }
    if (label.includes("Agregar diagnóstico")) { addDiagnosis(root, "certificateDiagnoses"); return; }
    if (label.includes("Agregar medicamento")) { addMedicine(root); return; }
    if (label.includes("Agregar muestra")) { addEpiSample(root); return; }
    if (label.includes("Agregar contacto")) { addEpiContact(root); return; }
    if (label.includes("Menú") || label === "Cancelar" && button.closest("#profilePage")) { navigate("dashboard"); return; }
    if (button.id === "criticalModeButton" || label.includes("Abrir Modo Crítico")) { setMode("critical"); return; }
    if (button.id === "evolutionButton") { setMode("evolution"); return; }
    if (button.classList.contains("critical-close") || label === "Cerrar" && button.closest("#evolutionSection")) { setMode("normal"); return; }
    if (label.includes("Continuar al FORM.008")) { go(3); return; }
    if (button.dataset.calc) { calculate(root, button.dataset.calc); return; }
    if (label === "Limpiar" && button.closest("#evolutionForm")) { root.querySelector<HTMLFormElement>("#evolutionForm")?.reset(); return; }
    if (label === "Limpiar para reevaluación") { root.querySelector<HTMLFormElement>("#criticalModeForm")?.reset(); return; }
    if (label === "Limpiar" && button.closest("#historyPage")) { root.querySelectorAll<HTMLInputElement>("#historyPage input").forEach((field) => field.value = ""); return; }
    if (label === "¿Olvidó su clave?") { toggle(root, "#login", false); toggle(root, "#recuperar", true); return; }
    if (label === "Volver al ingreso") { toggle(root, "#recuperar", false); toggle(root, "#login", true); return; }
    if (button.dataset.auth) { for (const name of ["login", "registro", "recuperar"]) toggle(root, `#${name}`, name === button.dataset.auth); root.querySelectorAll("[data-auth]").forEach((tab) => tab.classList.toggle("active", tab === button)); return; }
    if (button.id === "finishAttentionButton") { status(root, "#generateStatus", "La atención todavía no se ha guardado: falta conectar la base de datos."); return; }
    if (button.id === "saveVitalControl") { status(root, "#vitalSeriesStatus", "El control aún no se guarda: falta conectar la base de datos."); return; }
    if (button.id === "certificatePdf" || button.id === "certificateExcel") { status(root, "#certificateStatus", "El certificado aún no se genera: falta conectar la base de datos."); return; }
    if (button.id === "profileSave") { status(root, "#profileStatus", "Los cambios aún no se guardan: falta conectar la base de datos."); return; }
    if (button.id === "matrixGenerate") { status(root, "#matrixStatus", "La matriz aún no se genera: falta conectar la base de datos."); return; }
    if (button.id === "epiGenerate") { status(root, "#epiStatus", "La EPI aún no se genera: falta conectar la base de datos."); return; }
    if (button.id === "saveCriticalMode") { status(root, "#criticalModeStatus", "El registro aún no se guarda: falta conectar la base de datos."); return; }
    if (button.id === "saveEvolution") { status(root, "#evolutionStatus", "La evolución aún no se guarda: falta conectar la base de datos."); return; }
  }

  function handleChange(event: React.ChangeEvent<HTMLDivElement>) {
    const root = rootRef.current; const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (!root) return;
    const checked = target instanceof HTMLInputElement && target.checked;
    if (target.closest(".check-item")) updateChecklist(root, target);
    if (target.id === "modoGuardado") { const drive = target.value === "DRIVE"; toggle(root, "#driveFolderBox", drive); toggle(root, "#driveOpenBox", drive); toggle(root, "#laptopHelp", !drive); }
    if (target.id === "enableTrauma") toggle(root, "#traumaFields", checked);
    if (target.id === "enableTrauma" && !checked) { const fields = root.querySelector("#traumaFields"); if (fields) clearFields(fields); const summary = root.querySelector<HTMLTextAreaElement>('[name="traumaTexto"]'); if (summary) summary.value = ""; }
    if (target.id === "enableAccident") { const section = root.querySelector("#accidente"); section?.classList.toggle("section-disabled", !checked); if (section && !checked) clearFields(section, target); }
    if (target.id === "enableHistory") { toggle(root, "#historyFields", checked); const fields = root.querySelector("#historyFields"); if (fields && !checked) clearFields(fields); const first = root.querySelector<HTMLInputElement>('#historyChecklist .check-item:first-child input[type="checkbox"]'); if (first) first.checked = !checked; updateChecklist(root, first || target); }
    if (target.id === "enableDoseCalculator") toggle(root, "#doseCalculator", checked);
    if (target.id === "enableScoreMama") { toggle(root, "#scoreMamaFields", checked); const fields = root.querySelector("#scoreMamaFields"); if (!checked && fields) clearFields(fields); const active = root.querySelector<HTMLInputElement>('[name="scoreMamaActivo"]'); if (active) active.value = checked ? "SI" : "NO"; if (checked) updateMama(root, true); else { const state = root.querySelector<HTMLInputElement>('[name="scoreMamaEstado"]'); if (state) state.value = "NO APLICA"; const total = root.querySelector("#scoreMamaTotal"); if (total) total.textContent = "—"; const scoreStatus = root.querySelector("#scoreMamaStatus"); if (scoreStatus) scoreStatus.textContent = "SCORE MAMÁ desactivado."; const breakdown = root.querySelector("#scoreMamaBreakdown"); if (breakdown) breakdown.textContent = ""; } }
    if (target.name === "embarazoNoAplica") toggle(root, "#pregnancyFields", !checked);
    if (target.name === "examenesNoAplica") toggle(root, "#examFields", !checked);
    if (target.name === "sinConstantes") { toggle(root, "#vitales .vital-current-grid", !checked); const fields = root.querySelector("#vitales .vital-current-grid"); if (fields && checked) clearFields(fields); }
    if (target.id === "triageNoVitals") toggle(root, "#triageVitals", !checked);
    if (target.id === "egresoReposo") toggle(root, "#egresoDiasReposoBox", target.value === "SI");
    if (target.id === "certificateRest") toggle(root, "#certificateRestDays", target.value === "SI");
    if (target.id === "matrixScope") toggle(root, "#matrixEstablishmentBox", target.value === "ESTABLECIMIENTO");
    if (target.name === "tipoEpi") { toggle(root, "#epiGroupFields", target.value === "GRUPAL"); toggle(root, "#epiIndividualFields", target.value === "INDIVIDUAL"); }
    if (target.name === "registerSignatureMethod" || target.name === "profileSignatureMethod") { const prefix = target.name.startsWith("register") ? "register" : "profile"; toggle(root, `#${prefix}SignatureImage`, target.value === "IMAGE"); toggle(root, `#${prefix}SignatureDraw`, target.value === "DRAW"); }
    if (["gOcular", "gVerbal", "gMotora"].includes(target.id) || target.closest("#criticalModeForm") && target.name.startsWith("glasgow")) updateGlasgow(root);
    if (target.name === "fechaNacimiento" || target.name === "condicionEdad" || target.name === "horaNacimiento") updateAge(root, target.name === "fechaNacimiento");
    if (target.closest("#scoreMamaFields")) updateMama(root);
    if (target.classList.contains("pupil-select")) { const help=root.querySelector<HTMLElement>("#pupilHelp"); if(help)help.textContent={"4+":"Respuesta rápida y amplia; reacción normal e inmediata.","3+":"Respuesta moderada, visible pero menos amplia.","2+":"Respuesta pequeña y lenta; requiere valoración clínica.","1+":"Respuesta mínima o apenas visible; hallazgo importante.","0":"Sin respuesta pupilar; hallazgo grave."}[target.value as "4+"|"3+"|"2+"|"1+"|"0"]||"Seleccione una respuesta para ver su interpretación."; }
  }

  function handleInput(event: React.FormEvent<HTMLDivElement>) {
    const root=rootRef.current; const target=event.target as HTMLElement; if(!root)return;
    if(target.closest(".check-item"))updateChecklist(root,target);
    if(target.closest(".medicine-row"))updateMedicine(target.closest<HTMLElement>(".medicine-row")!);
    if(target.matches('[name="fechaNacimiento"]'))updateAge(root,true);
    if(target.closest("#scoreMamaFields")||target.closest("#clinicalForm .vital-current-grid"))updateMama(root);
  }

  function handleSubmit(event: React.FormEvent<HTMLDivElement>) {
    const form=event.target as HTMLFormElement; if(!(form instanceof HTMLFormElement))return;
    event.preventDefault(); const root=rootRef.current; if(!root)return;
    if(form.id==="patientForm"){go(2);return;}
    if(form.id==="triageForm"){go(3);return;}
    const statuses:Record<string,string>={criticalModeForm:"#criticalModeStatus",evolutionForm:"#evolutionStatus",epiForm:"#epiStatus",matrixForm:"#matrixStatus",certificateForm:"#certificateStatus",profileForm:"#profileStatus",admissionRoleForm:"#admissionRoleStatus",statPatientForm:"#statPatientStatus",login:"#msg",registro:"#msg",recuperar:"#msg"};
    const selector=statuses[form.id];if(selector)status(root,selector,"Los datos aún no se guardan: falta conectar la base de datos.");
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    initializeOriginalDynamics(root);
    root.querySelector("#accidente")?.classList.add("section-disabled");
    toggle(root, "#historyFields", false);
    const noHistory = root.querySelector<HTMLInputElement>('#historyChecklist .check-item:first-child input[type="checkbox"]');
    if (noHistory) { noHistory.checked = true; updateChecklist(root, noHistory); }
    showTabbed(root, "clinical", 0);
    showTabbed(root, "final", 0);
    toggle(root, "#epiGroupFields", true);
    toggle(root, "#epiIndividualFields", false);
    toggle(root, "#driveFolderBox", true);
    toggle(root, "#driveOpenBox", true);
    toggle(root, "#laptopHelp", false);
    const empty: Record<string, string> = {
      pendingList: "Los FORM.008 pendientes estarán disponibles al conectar la base de datos.", historyList: "Las historias clínicas estarán disponibles al conectar la base de datos.",
      statsLoading: "Calculando estadísticas...",
    };
    for (const [id, message] of Object.entries(empty)) {
      const box = root.querySelector<HTMLElement>(`#${id}`);
      if (box && !box.textContent?.trim()) box.textContent = message;
    }
    const loading = root.querySelector<HTMLElement>("#statsLoading");
    if (loading) loading.textContent = "Los valores estarán disponibles al conectar la base de datos.";
    toggle(root, "#statsContent", true);
    root.querySelectorAll<HTMLElement>("#statsContent .stat-box strong,#statTotal").forEach((value) => value.textContent = "—");
    const onNativeChange = (event: Event) => handleChange(event as unknown as React.ChangeEvent<HTMLDivElement>);
    const onNativeInput = (event: Event) => handleInput(event as unknown as React.FormEvent<HTMLDivElement>);
    root.addEventListener("change", onNativeChange);
    root.addEventListener("input", onNativeInput);
    return () => { root.removeEventListener("change", onNativeChange); root.removeEventListener("input", onNativeInput); };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    root?.querySelectorAll<HTMLElement>(".steps span").forEach((item, index) => item.classList.toggle("active", index === step));
  }, [step]);

  return <div ref={rootRef} className={styles.legacy} onClick={handleClick} onSubmit={handleSubmit}>
    {pages.map((page)=><div key={page} className={view===page?"":styles.concealed} dangerouslySetInnerHTML={{__html:pageMarkup[page]}} />)}
    <div className={view==="care"?"":styles.concealed}>
      <div dangerouslySetInnerHTML={{__html:source.toolbar}} />
      <div dangerouslySetInnerHTML={{__html:source.steps}} />
      {careMarkup.map((html,index)=><div key={index} className={mode==="normal"&&step===index?"":styles.concealed} dangerouslySetInnerHTML={{__html:html}} />)}
      <div className={mode==="critical"?"":styles.concealed} dangerouslySetInnerHTML={{__html:source.critical}} />
      <div className={mode==="evolution"?"":styles.concealed} dangerouslySetInnerHTML={{__html:source.evolution}} />
    </div>
  </div>;
}

function calculate(root: HTMLElement, key: string) {
  const screen=root.querySelector<HTMLInputElement>("#calculatorDisplay");if(!screen)return;
  if(key==="CLEAR")screen.value="0";
  else if(key==="BACK")screen.value=screen.value.length>1?screen.value.slice(0,-1):"0";
  else if(key==="EQUAL"){
    const match=screen.value.match(/^(-?\d+(?:\.\d+)?)([+\-*/])(-?\d+(?:\.\d+)?)$/);
    if(!match){screen.value="ERROR";return;}
    const a=Number(match[1]),b=Number(match[3]);
    screen.value=String(match[2]==="+"?a+b:match[2]==="-"?a-b:match[2]==="*"?a*b:b?a/b:"ERROR");
  }else screen.value=screen.value==="0"||screen.value==="ERROR"?key:screen.value+key;
}
