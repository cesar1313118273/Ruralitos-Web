"use client";

import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, Check, ClipboardClock,
  FileHeart, HeartPulse, Home, Menu, Plus, Save, Search, ShieldAlert,
  Stethoscope, X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, ReactNode, useMemo, useState } from "react";

import styles from "./emergency.module.css";

const steps = ["Establecimiento", "Paciente", "Triaje", "Atención", "Finalizar"];
type VitalKey = "temperatura" | "pas" | "pad" | "pulso" | "fr" | "saturacion" | "glicemia";
type Vitals = Record<VitalKey, string>;
const emptyVitals: Vitals = { temperatura: "", pas: "", pad: "", pulso: "", fr: "", saturacion: "", glicemia: "" };
const priorities = [
  [1, "Crítico", "Inmediata", "red"], [2, "Emergencia", "Máximo 10 min", "orange"],
  [3, "Urgente", "Máximo 60 min", "yellow"], [4, "Estándar", "Máximo 120 min", "green"],
  [5, "No urgente", "Máximo 240 min", "blue"],
] as const;

function Field({ label, required, children, wide }: { label: string; required?: boolean; children: ReactNode; wide?: boolean }) {
  return <label className={wide ? styles.wide : undefined}><span className={styles.label}>{label}{required && <b> *</b>}</span>{children}</label>;
}

function Title({ number, title, description }: { number: string; title: string; description: string }) {
  return <div className={styles.sectionTitle}><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></div>;
}

function VitalFields({ values, change }: { values: Vitals; change: (key: VitalKey, value: string) => void }) {
  const fields: Array<[VitalKey, string, string, string]> = [
    ["temperatura", "Temperatura", "°C", "0.1"], ["pas", "Presión sistólica", "mmHg", "1"],
    ["pad", "Presión diastólica", "mmHg", "1"], ["pulso", "Frecuencia cardíaca", "lpm", "1"],
    ["fr", "Frecuencia respiratoria", "rpm", "1"], ["saturacion", "Saturación O₂", "%", "1"],
    ["glicemia", "Glicemia", "mg/dL", "1"],
  ];
  return <div className={styles.vitalGrid}>{fields.map(([key, label, unit, step]) => <Field label={label} key={key}><div className={styles.unitInput}><input type="number" step={step} value={values[key]} onChange={(e) => change(key, e.target.value)} /><span>{unit}</span></div></Field>)}</div>;
}

export function EmergencyWorkspace() {
  const [menu, setMenu] = useState(false);
  const [step, setStep] = useState(0);
  const [priority, setPriority] = useState<number | null>(null);
  const [vitals, setVitals] = useState<Vitals>(emptyVitals);
  const [critical, setCritical] = useState(false);
  const [saved, setSaved] = useState(false);
  const [finished, setFinished] = useState(false);
  const [observation, setObservation] = useState(false);
  const [pregnancy, setPregnancy] = useState(false);
  const [mama, setMama] = useState({ temperature: "", saturation: "", consciousness: "ALERTA", proteinuria: "NEGATIVA", altitude: false });

  const mamaScore = useMemo(() => {
    const fc = Number(vitals.pulso), pas = Number(vitals.pas), pad = Number(vitals.pad);
    const fr = Number(vitals.fr), temp = Number(mama.temperature), sat = Number(mama.saturation);
    if (![fc, pas, pad, fr, temp, sat].every((value) => Number.isFinite(value) && value > 0)) return null;
    return [
      fc <= 50 ? 3 : fc < 60 ? 1 : fc <= 100 ? 0 : fc <= 110 ? 1 : fc < 120 ? 2 : 3,
      pas <= 70 ? 3 : pas < 90 ? 2 : pas < 140 ? 0 : pas < 160 ? 2 : 3,
      pad <= 50 ? 3 : pad < 60 ? 2 : pad <= 85 ? 0 : pad < 90 ? 1 : pad < 110 ? 2 : 3,
      fr <= 11 ? 3 : fr <= 22 ? 0 : fr < 30 ? 2 : 3,
      temp <= 35.5 ? 2 : temp < 37.3 ? 0 : temp < 38.5 ? 1 : 3,
      sat <= 85 ? 3 : sat < 90 ? 2 : sat <= 93 ? (mama.altitude ? 0 : 1) : 0,
      mama.consciousness === "ALERTA" ? 0 : mama.consciousness.includes("VOZ") ? 1 : mama.consciousness === "NO RESPONDE" ? 3 : 2,
      mama.proteinuria === "NEGATIVA" ? 0 : 1,
    ].reduce((sum, value) => sum + value, 0);
  }, [mama, vitals]);

  function next(event?: FormEvent) {
    event?.preventDefault();
    setStep((current) => Math.min(current + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function saveDraft() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return <div className={styles.shell}>
    <aside className={`${styles.sidebar} ${menu ? styles.sidebarOpen : ""}`}>
      <div className={styles.brand}><span><HeartPulse size={23} /></span><div><strong>Ruralitos</strong><small>Área de emergencia</small></div><button className={styles.closeMenu} onClick={() => setMenu(false)} aria-label="Cerrar menú"><X /></button></div>
      <nav aria-label="Navegación de emergencia">
        <Link href="/"><Home size={19} /> Inicio general</Link>
        <button className={styles.navActive}><Activity size={19} /> Panel de emergencia</button>
        <button onClick={() => setStep(0)}><Plus size={19} /> Nueva atención</button>
        <button><ClipboardClock size={19} /> Pendientes <em>0</em></button>
        <button><FileHeart size={19} /> Historias clínicas</button>
      </nav>
      <div className={styles.sidebarFooter}><span>Adaptación actual</span><strong>FORM.008 · Web</strong></div>
    </aside>
    {menu && <button className={styles.backdrop} onClick={() => setMenu(false)} aria-label="Cerrar menú" />}
    <main className={styles.main}>
      <header className={styles.topbar}>
        <button className={styles.menuButton} onClick={() => setMenu(true)} aria-label="Abrir menú"><Menu /></button>
        <div><span>Módulo clínico</span><strong>Emergencia</strong></div>
        <div className={styles.topActions}><button className={styles.criticalButton} onClick={() => setCritical(true)}><ShieldAlert size={18} /> Modo crítico</button><button className={styles.saveButton} onClick={saveDraft}><Save size={18} /> Guardar pendiente</button></div>
      </header>
      <div className={styles.content}>
        <div className={styles.pageHeading}><div><span className={styles.eyebrow}>Nueva atención de emergencia</span><h1>{steps[step]}</h1><p>Registro clínico estructurado basado en el flujo FORM.008.</p></div><div className={styles.security}><span><Check size={14} /></span><div><strong>Sesión de trabajo</strong><small>Supabase se conectará en la siguiente etapa</small></div></div></div>
        <ol className={styles.stepper}>{steps.map((item, index) => <li key={item} className={index === step ? styles.currentStep : index < step ? styles.doneStep : ""}><button onClick={() => index <= step && setStep(index)} disabled={index > step}><span>{index < step ? <Check size={16} /> : index + 1}</span><b>{item}</b></button>{index < 4 && <i />}</li>)}</ol>
        {saved && <div className={styles.toast}><Check size={18} /> Datos conservados durante esta sesión.</div>}
        {finished ? <Success onRestart={() => { setFinished(false); setStep(0); setPriority(null); setVitals(emptyVitals); }} /> :
          <form onSubmit={next} className={styles.formCard}>
            {step === 0 && <Establishment />}
            {step === 1 && <Patient />}
            {step === 2 && <Triage priority={priority} setPriority={setPriority} vitals={vitals} setVitals={setVitals} openCritical={() => setCritical(true)} />}
            {step === 3 && <Attention vitals={vitals} setVitals={setVitals} observation={observation} setObservation={setObservation} />}
            {step === 4 && <Finish pregnancy={pregnancy} setPregnancy={setPregnancy} mama={mama} setMama={setMama} mamaScore={mamaScore} />}
            <div className={styles.formActions}><button type="button" className={styles.secondary} onClick={() => setStep(Math.max(step - 1, 0))} disabled={step === 0}><ArrowLeft size={18} /> Anterior</button>{step < 4 ? <button className={styles.primary} type="submit">Guardar y continuar <ArrowRight size={18} /></button> : <button className={styles.primary} type="button" onClick={() => setFinished(true)}>Finalizar atención <Check size={18} /></button>}</div>
          </form>}
      </div>
    </main>
    {critical && <CriticalModal close={() => setCritical(false)} />}
  </div>;
}

function Establishment() {
  return <><Title number="01" title="Establecimiento y profesional" description="Identifique el lugar y responsable de la atención." /><div className={styles.notice}><Stethoscope size={20} /><div><b>Configuración temporal</b><p>Los centros autorizados y el perfil se cargarán automáticamente con Supabase.</p></div></div><div className={styles.formGrid}><Field label="Establecimiento de salud" required><select required defaultValue=""><option value="" disabled>Seleccione</option><option>MEDICATURA RURAL</option><option>CENTRO DE SALUD</option></select></Field><Field label="Unidad operativa"><input defaultValue="EMERGENCIA" /></Field><Field label="Profesional responsable" required><input required /></Field><Field label="Cargo / función"><select><option>MÉDICO/A</option><option>ENFERMERO/A</option><option>OBSTETRA</option></select></Field></div></>;
}

function Patient() {
  const [withoutDocument, setWithoutDocument] = useState(false);
  return <><Title number="02" title="Paciente y admisión" description="Busque la identidad o registre un paciente sin documento." /><div className={styles.searchRow}><div><Search size={19} /><input placeholder="Cédula, visa, pasaporte o carné" disabled={withoutDocument} /></div><button type="button">Buscar</button><button type="button" className={styles.secondary} onClick={() => setWithoutDocument(!withoutDocument)}>{withoutDocument ? "Usar documento" : "Sin documento"}</button></div>{withoutDocument && <div className={styles.warning}><AlertTriangle size={19} /><span>Se generará una identidad provisional al conectar la base de datos.</span></div>}<h3 className={styles.subheading}>Identificación</h3><div className={styles.formGrid}><Field label="Tipo de identificación" required><select required defaultValue={withoutDocument ? "SIN DOCUMENTO" : ""}><option value="" disabled>Seleccione</option><option>CÉDULA DE IDENTIDAD</option><option>PASAPORTE</option><option>VISA</option><option>SIN DOCUMENTO</option></select></Field><Field label="Número" required={!withoutDocument}><input required={!withoutDocument} disabled={withoutDocument} /></Field><Field label="Primer apellido" required><input required /></Field><Field label="Segundo apellido"><input /></Field><Field label="Primer nombre" required><input required /></Field><Field label="Segundo nombre"><input /></Field><Field label="Sexo"><select defaultValue=""><option value="">Seleccione</option><option>HOMBRE</option><option>MUJER</option><option>NO ESPECIFICA</option></select></Field><Field label="Fecha de nacimiento"><input type="date" /></Field><Field label="Teléfono"><input type="tel" /></Field><Field label="Grupo prioritario"><select><option>NO APLICA</option><option>Embarazada</option><option>Víctima de violencia</option><option>Discapacidad</option></select></Field></div><h3 className={styles.subheading}>Admisión</h3><div className={styles.formGrid}><Field label="Fecha" required><input required type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></Field><Field label="Hora" required><input required type="time" /></Field><Field label="Forma de llegada"><select><option>AMBULATORIO</option><option>AMBULANCIA</option><option>OTRO TRANSPORTE</option></select></Field><Field label="Condición"><select><option>ESTABLE</option><option>INESTABLE</option><option>FALLECIDO</option></select></Field><Field label="Motivo de atención" wide required><textarea required rows={4} /></Field></div></>;
}

function Triage({ priority, setPriority, vitals, setVitals, openCritical }: { priority: number | null; setPriority: (value: number) => void; vitals: Vitals; setVitals: (value: Vitals) => void; openCritical: () => void }) {
  return <><Title number="03" title="Triaje de emergencia" description="Clasificación inicial y signos vitales del episodio." /><div className={styles.criticalStrip}><div><ShieldAlert size={21} /><span><b>Paciente inestable o trauma grave</b><small>Documente la estabilización antes de completar el triaje.</small></span></div><button type="button" onClick={openCritical}>Abrir modo crítico</button></div><h3 className={styles.subheading}>Evaluación rápida ABC</h3><div className={styles.formGrid}>{["Vía aérea", "Ventilación", "Circulación"].map((label) => <Field label={label} required key={label}><select required defaultValue=""><option value="" disabled>Seleccione</option><option>ADECUADA / PERMEABLE</option><option>COMPROMETIDA</option><option>NO EVALUABLE</option></select></Field>)}</div><Field label="Motivo dirigido" required wide><textarea required rows={4} /></Field><h3 className={styles.subheading}>Signos vitales</h3><VitalFields values={vitals} change={(key, value) => setVitals({ ...vitals, [key]: value })} /><p className={styles.help}>Las alertas detectan errores de captura; no sustituyen el juicio clínico.</p><h3 className={styles.subheading}>Prioridad clínica</h3><div className={styles.priorityGrid}>{priorities.map(([level, name, time, color]) => <label key={level} className={`${styles.priority} ${styles[`priority_${color}`]} ${priority === level ? styles.prioritySelected : ""}`}><input type="radio" name="priority" required checked={priority === level} onChange={() => setPriority(level)} /><span>{level}</span><div><b>{name}</b><small>{time}</small></div></label>)}</div><div className={styles.formGrid}><Field label="Área inicial" required><select required defaultValue=""><option value="" disabled>Seleccione</option><option>REANIMACIÓN / CRÍTICOS</option><option>EMERGENCIA</option><option>URGENCIAS</option><option>OBSERVACIÓN</option><option>REFERENCIA</option></select></Field><Field label="Factores de riesgo"><input placeholder="Embarazo, edad extrema, violencia..." /></Field></div></>;
}

function Attention({ vitals, setVitals, observation, setObservation }: { vitals: Vitals; setVitals: (value: Vitals) => void; observation: boolean; setObservation: (value: boolean) => void }) {
  const [tab, setTab] = useState("motivo");
  const tabs = ["motivo", "antecedentes", "enfermedad", "vitales", "examen", "trauma"];
  return <><Title number="04" title="Atención clínica" description="Documente la valoración y controles del episodio." /><div className={styles.tabs}>{tabs.map((item) => <button type="button" key={item} onClick={() => setTab(item)} className={tab === item ? styles.tabActive : ""}>{item}</button>)}</div>{tab === "motivo" && <Field label="Motivo de atención" wide><textarea rows={10} /></Field>}{tab === "antecedentes" && <Checklist title="Antecedentes relevantes" options={["Alergias", "Clínicos", "Quirúrgicos", "Familiares", "Farmacológicos", "Gineco-obstétricos"]} />}{tab === "enfermedad" && <Field label="Enfermedad o problema actual" wide><textarea rows={14} placeholder="Cronología, características, intensidad y factores asociados..." /></Field>}{tab === "vitales" && <><VitalFields values={vitals} change={(key, value) => setVitals({ ...vitals, [key]: value })} /><div className={styles.glasgow}><h3>Escala de Glasgow</h3>{[["Ocular", 4], ["Verbal", 5], ["Motora", 6]].map(([label, max]) => <Field label={String(label)} key={String(label)}><select defaultValue={String(max)}>{Array.from({ length: Number(max) }, (_, index) => Number(max) - index).map((n) => <option key={n}>{n}</option>)}</select></Field>)}</div></>}{tab === "examen" && <Checklist title="Examen físico por regiones" options={["Cabeza", "Cuello", "Tórax", "Abdomen", "Pelvis", "Extremidades", "Neurológico"]} />}{tab === "trauma" && <><div className={styles.warning}><AlertTriangle size={19} /><span>Valoración estructurada XABCDE.</span></div><Xabcde /></>}<label className={styles.observationToggle}><input type="checkbox" checked={observation} onChange={(e) => setObservation(e.target.checked)} /><span><b>Abrir evolución / observación</b><small>Registre novedades e indicaciones durante la permanencia.</small></span></label>{observation && <div className={styles.observationBox}><div className={styles.formGrid}><Field label="Fecha"><input type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></Field><Field label="Hora"><input type="time" /></Field><Field label="Evolución clínica" wide><textarea rows={6} /></Field><Field label="Indicaciones" wide><textarea rows={4} /></Field></div></div>}</>;
}

function Finish({ pregnancy, setPregnancy, mama, setMama, mamaScore }: { pregnancy: boolean; setPregnancy: (value: boolean) => void; mama: { temperature: string; saturation: string; consciousness: string; proteinuria: string; altitude: boolean }; setMama: (value: { temperature: string; saturation: string; consciousness: string; proteinuria: string; altitude: boolean }) => void; mamaScore: number | null }) {
  return <><Title number="05" title="Diagnóstico, tratamiento y egreso" description="Complete la conducta antes de cerrar la atención." /><h3 className={styles.subheading}>Diagnósticos y plan</h3><div className={styles.formGrid}><Field label="Diagnóstico" required><div className={styles.codeInput}><input required placeholder="Buscar CIE-10 o describir" /><button type="button"><Search size={17} /></button></div></Field><Field label="Tipo"><select><option>PRESUNTIVO</option><option>DEFINITIVO</option></select></Field><Field label="Plan de tratamiento" wide required><textarea required rows={6} /></Field></div><label className={styles.observationToggle}><input type="checkbox" checked={pregnancy} onChange={(e) => setPregnancy(e.target.checked)} /><span><b>Gestante o puérpera: SCORE MAMÁ</b><small>Usa las constantes registradas y variables obstétricas.</small></span></label>{pregnancy && <div className={styles.mamaBox}><div className={styles.formGrid}><Field label="Temperatura axilar"><input type="number" step="0.1" value={mama.temperature} onChange={(e) => setMama({ ...mama, temperature: e.target.value })} /></Field><Field label="SpO₂ sin oxígeno"><input type="number" value={mama.saturation} onChange={(e) => setMama({ ...mama, saturation: e.target.value })} /></Field><Field label="Conciencia"><select value={mama.consciousness} onChange={(e) => setMama({ ...mama, consciousness: e.target.value })}><option>ALERTA</option><option>CONFUSA / AGITADA</option><option>RESPONDE A LA VOZ / SOMNOLIENTA</option><option>RESPONDE AL DOLOR / ESTUPOROSA</option><option>NO RESPONDE</option></select></Field><Field label="Proteinuria"><select value={mama.proteinuria} onChange={(e) => setMama({ ...mama, proteinuria: e.target.value })}><option>NEGATIVA</option><option>POSITIVA (+)</option></select></Field><label className={styles.inlineCheck}><input type="checkbox" checked={mama.altitude} onChange={(e) => setMama({ ...mama, altitude: e.target.checked })} /> Altitud ≥ 2500 m</label></div><div className={styles.scoreResult}><div><small>SCORE MAMÁ</small><strong>{mamaScore ?? "—"}</strong></div><p>{scoreText(mamaScore)}</p></div></div>}<h3 className={styles.subheading}>Egreso</h3><div className={styles.formGrid}><Field label="Condición vital"><select><option>VIVO</option><option>FALLECIDO</option></select></Field><Field label="Estado"><select><option>ESTABLE</option><option>INESTABLE</option></select></Field><Field label="Destino" required><select required><option>ALTA DEFINITIVA</option><option>OBSERVACIÓN</option><option>HOSPITALIZACIÓN</option><option>REFERENCIA</option><option>DERIVACIÓN</option></select></Field><Field label="Establecimiento de destino"><input /></Field><Field label="Observaciones" wide><textarea rows={5} /></Field></div><div className={styles.documents}><h3>Documentos finales</h3><label><input type="checkbox" defaultChecked /> FORM.008 PDF</label><label><input type="checkbox" /> FORM.008 Excel</label><label><input type="checkbox" /> Certificado médico</label><p>La descarga se habilitará con el guardado definitivo.</p></div></>;
}

function Checklist({ title, options }: { title: string; options: string[] }) { return <div className={styles.checkSection}><h3>{title}</h3>{options.map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}<textarea rows={8} placeholder="Hallazgos y observaciones..." /></div>; }
function Xabcde() { return <div className={styles.traumaGrid}>{["X · Hemorragia", "A · Vía aérea", "B · Respiración", "C · Circulación", "D · Neurológico", "E · Exposición"].map((item) => <Field label={item} key={item}><textarea rows={3} /></Field>)}</div>; }
function scoreText(score: number | null) { if (score === null) return "Complete los signos vitales y variables obstétricas."; if (score === 0) return "Evaluar factores de riesgo y signos de alarma."; if (score === 1) return "Reevaluar cada 4 horas."; if (score <= 4) return "Tratar, referir y reevaluar cada hora."; return "Tratar, referir y reevaluar cada 30 minutos."; }
function Success({ onRestart }: { onRestart: () => void }) { return <div className={styles.successCard}><span><Check size={34} /></span><h1>Atención lista para guardar</h1><p>El flujo se completó. Al conectar Supabase, este paso creará el episodio y todos sus registros asociados.</p><button onClick={onRestart}>Crear otra atención</button></div>; }
function CriticalModal({ close }: { close: () => void }) { return <div className={styles.modalBackdrop}><section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="critical-title"><header><div><span><ShieldAlert /></span><div><h2 id="critical-title">Modo crítico</h2><p>Registro rápido de estabilización</p></div></div><button onClick={close} aria-label="Cerrar"><X /></button></header><div className={styles.warning}><AlertTriangle size={19} /><span>Priorice la atención. Complete el resto cuando el paciente esté estabilizado.</span></div><Xabcde /><Field label="Procedimientos y medicamentos" wide><textarea rows={4} /></Field><footer><button className={styles.secondary} onClick={close}>Cancelar</button><button className={styles.criticalButton} onClick={close}><Save size={17} /> Conservar estabilización</button></footer></section></div>; }
