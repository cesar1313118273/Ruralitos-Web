const events = ["Accidente de tránsito","Caída","Quemadura","Mordedura","Ahogamiento","Cuerpo extraño","Aplastamiento","Otro accidente","Violencia por arma de fuego","Violencia por arma cortopunzante","Violencia por riña","Violencia familiar","Presunta violencia física","Presunta violencia psicológica","Presunta violencia sexual","Intoxicación alcohólica","Intoxicación alimentaria","Intoxicación por drogas","Inhalación de gases","Otra intoxicación","Picadura","Envenenamiento","Anafilaxia"];
const histories = ["No aplica","Alérgicos","Ginecológicos","Pediátricos","Farmacológicos","Familiares","Clínicos","Traumatológicos","Quirúrgicos","Hábitos","Otros"];
const physical = ["Piel y faneras","Oídos","Orofaringe","Tórax","Ingle-periné","Cabeza","Nariz","Cuello","Abdomen","Miembros superiores","Ojos","Boca","Axilas-mamas","Columna vertebral","Miembros inferiores"];
const exams = ["Biometría","Uroanálisis","Química sanguínea","Electrolitos","Gasometría","Electrocardiograma","Endoscopia","Radiografía de tórax","Radiografía de abdomen","Radiografía ósea","Ecografía de abdomen","Ecografía pélvica","Tomografía","Resonancia","Interconsulta","Otros"];

const epiLists: Record<string, string[]> = {
  epiSymptoms: ["ADENOPATÍAS","CIANOSIS","ESCALOFRÍOS","PRURITO","ALTERACIÓN NEUROLÓGICA A NIVEL PERIFÉRICO","CONVULSIONES","ESPASMO MUSCULAR","RIGIDEZ MUSCULAR","ALTERACIÓN NEUROLÓGICA A NIVEL CENTRAL","DESHIDRATACIÓN","ESTRIDOR RESPIRATORIO","SANGRADOS","ANOREXIA","DIARREA","FIEBRE","TOS","APNEA","DIFICULTAD RESPIRATORIA","ICTERICIA","TRISMUS","ARTRALGIA","DOLOR ABDOMINAL","MIALGIAS","VISIÓN BORROSA","ASCITIS","DOLOR DE GARGANTA","NÁUSEAS/VÓMITOS","ONCOCERCOMAS","CEFÁLEA","ERUPCIÓN","PARÁLISIS","SUDORACIÓN NOCTURNA"],
  epiVaccines: ["BCG","HB","ROTA","OPV","PENTA","INFLUENZA","NEUMOCOCO CONJUGADO","SR","FA","DT","DPT","D-T","SRP","VARICELA","NEUMOCOCO POLISACÁRIDO","OTRAS"],
  epiSources: ["TARJETA DE VACUNACIÓN","REGISTRO EN EL SERVICIO DE SALUD","VERBAL"],
  epiContactBackground: ["ANIMAL VIVO","ANIMALES MUERTOS","AGUA/SUELOS","BASURALES","NINGUNO","METANOL","PERSONA SINTOMÁTICA","ALIMENTOS","PLAGUICIDAS","OTRO ORIGEN DEL CONTACTO","METALES PESADOS","SOLVENTES"],
  epiFoodOrigin: ["CASA","RESTAURANTE","CALLE","REUNIÓN SOCIAL"],
  epiOtherSickPlace: ["CASA","BARRIO","LUGAR DE TRABAJO","ESTABLECIMIENTO DE SALUD","DESCONOCIDO","OTRO"],
  epiRiskFactors: ["HIJOS DE MADRES INFECTADA POR EL VHB","TRANSFUSIONES","HEMODIÁLISIS","TRASPLANTE DE ÓRGANOS","DROGAS INYECTABLES","TATUAJES Y PERFORACIONES","SEXO SOLO CON HOMBRES","SEXO SOLO CON MUJERES","SEXO CON HOMBRES Y MUJERES","PINCHAZOS CON AGUJA CORTOPUNZANTE","COMPARTIR CEPILLOS DE DIENTES Y AFEITADORAS","HIJO DE MADRE INFECTADA POR EL VHC","CIRUGÍAS","TRATAMIENTOS DENTALES","MATERNO INFANTIL","HORIZONTAL","SEXUAL","TRANSFUSIONES SANGUÍNEAS","PERCUTÁNEA","NOSOCOMIAL"],
  epiTreatmentEvolution: ["MEJORÓ","IGUALES CONDICIONES","EMPEORÓ"],
  epiTreatmentPlace: ["DOMICILIO","UNIDADES DE SALUD DEL MSP","FARMACIA","OTRAS UNIDADES DEL SECTOR PÚBLICO","UNIDADES DE SALUD PRIVADAS"],
  epiFinalClassification: ["DESCARTADO","NO CONCLUYENTE","CONFIRMADO","CON RIESGO","SIN RIESGO","RELACIONADO CON LA VACUNA","COINCIDENTE","RELACIONADO CON EL PROGRAMA DE VACUNA"],
  epiConfirmedBy: ["LABORATORIO","CLÍNICA","NEXO EPIDEMIOLÓGICO"],
};
const epiActivities: Record<string, string[]> = {
  epiGeneralActivities: ["VISITA DOMICILIARIA","BÚSQUEDA ACTIVA DE CASOS","SEGUIMIENTO DE CONTACTO"],
  epiSpecificActivities: ["VACUNACIÓN DE BLOQUEO","PROFILAXIS A LOS CONTACTOS","MONITOREO RÁPIDO DE COBERTURAS","TRATAMIENTO DE CRIADEROS DE VECTORES"],
};

function find(root: HTMLElement, selector: string): HTMLElement | null { return root.querySelector<HTMLElement>(selector); }
export function toggle(root: HTMLElement, selector: string, show: boolean) { find(root, selector)?.classList.toggle("hidden", !show); }
function input(root: HTMLElement, selector: string): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null { return root.querySelector(selector); }
function node(tag: string, className?: string): HTMLElement { const item = document.createElement(tag); if (className) item.className = className; return item; }

export function initializeOriginalDynamics(root: HTMLElement) {
  const patientBirth=input(root,'#patientForm [name="fechaNacimiento"]');
  if(patientBirth && !find(root,"#birthTimeBox")){
    const box=node("div","hidden"); box.id="birthTimeBox";
    const label=node("label"); label.textContent="Hora de nacimiento";
    const hour=document.createElement("input"); hour.name="horaNacimiento"; hour.type="time";
    box.append(label,hour); patientBirth.parentElement?.insertAdjacentElement("afterend",box);
  }
  const admissions=find(root,"#statPatientForm");
  if(admissions){
    for(const name of ["tipoDocumento","estadoCivil","sexo","condicionEdad","grupoPrioritario","nivelEducacion","seguroSalud"]){
      const original=root.querySelector<HTMLSelectElement>(`#patientForm [name="${name}"]`);
      const current=admissions.querySelector<HTMLInputElement|HTMLSelectElement>(`[name="${name}"]`);
      if(original&&current)current.replaceWith(original.cloneNode(true));
    }
    const birthHour=admissions.querySelector<HTMLInputElement>('[name="horaNacimiento"]');
    if(birthHour?.parentElement){birthHour.parentElement.id="admissionBirthTimeBox";birthHour.parentElement.classList.add("hidden");}
    const age=admissions.querySelector<HTMLInputElement>('[name="edad"]');if(age)age.readOnly=true;
  }
  const checklists: Array<[string, string[], string]> = [["eventChecklist", events, "eventSummary"],["historyChecklist", histories, "historySummary"],["physicalChecklist", physical, "physicalSummary"],["examChecklist", exams, "observacionesExamenes"]];
  for (const [id, names] of checklists) {
    const box = find(root, `#${id}`); if (!box || box.children.length) continue;
    for (const name of names) {
      const row = node("div", "check-item"); row.dataset.name = name;
      const label = node("label"); const check = document.createElement("input"); check.type = "checkbox"; label.append(check, ` ${name}`);
      const detail = document.createElement("input"); detail.className = "check-detail hidden"; detail.placeholder = `Describa ${name.toLowerCase()}`;
      row.append(label, detail); box.append(row);
    }
  }
  for (const [id, names] of Object.entries(epiLists)) {
    const box = find(root, `#${id}`); if (!box || box.children.length) continue;
    for (const name of names) { const label=node("label","epi-check-option"); const check=document.createElement("input"); check.type="checkbox"; check.value=name; const span=node("span"); span.textContent=name; label.append(check,span); box.append(label); }
  }
  for (const [id, names] of Object.entries(epiActivities)) {
    const box=find(root,`#${id}`); if (!box || box.children.length) continue;
    for (const name of names) { const row=node("article","epi-activity-row"); row.dataset.activity=name; const title=node("b"); title.textContent=name; const select=document.createElement("select"); select.dataset.field="realizada"; select.innerHTML="<option>NO</option><option>SI</option>"; const date=document.createElement("input"); date.type="date"; date.dataset.field="fecha"; const notes=document.createElement("input"); notes.dataset.field="observaciones"; notes.placeholder="Observaciones"; row.append(title,select,date,notes); box.append(row); }
  }
  const pupilHelp=find(root,"#pupilHelp"); if(pupilHelp) pupilHelp.textContent="Seleccione una respuesta para ver su interpretación.";
  for(const select of root.querySelectorAll<HTMLSelectElement>(".pupil-select")) select.innerHTML='<option value="">Seleccione</option><option value="4+">4+ — Respuesta rápida y amplia</option><option value="3+">3+ — Respuesta moderada</option><option value="2+">2+ — Respuesta pequeña y lenta</option><option value="1+">1+ — Respuesta mínima</option><option value="0">0 — Sin respuesta pupilar</option>';
  populateGlasgow(root);
  addDiagnosis(root,"presuntivos"); addDiagnosis(root,"definitivos"); addMedicine(root); addDiagnosis(root,"certificateDiagnoses");
  const establishment=input(root,"#appEstablishmentSelect"); if(establishment instanceof HTMLSelectElement && !establishment.options.length) establishment.add(new Option("Seleccione un establecimiento autorizado", ""));
  const statsGrid=find(root,"#statsContent .stats-grid");
  if(statsGrid && !find(root,"#statPatients")){
    const card=node("article","stat-box stat-purple");card.innerHTML='<span>♟</span><div><small>Pacientes actualizados por mí</small><strong id="statPatients">0</strong></div>';statsGrid.prepend(card);
  }
  const today=new Date().toISOString().slice(0,10);
  for(const field of root.querySelectorAll<HTMLInputElement>('input[type="date"]')) if(!field.value && ["triageDate","criticalDate","vitalControlDate","matrixFrom","matrixTo"].includes(field.id)) field.value=today;
}

export function updateChecklist(root: HTMLElement, field: Element) {
  const row=field.closest<HTMLElement>(".check-item"); if(!row) return;
  const check=row.querySelector<HTMLInputElement>('input[type="checkbox"]'); const detail=row.querySelector<HTMLInputElement>(".check-detail");
  if(check&&detail) detail.classList.toggle("hidden",!check.checked);
  const box=row.parentElement; const summary=box && ({eventChecklist:"eventSummary",historyChecklist:"historySummary",physicalChecklist:"physicalSummary",examChecklist:"observacionesExamenes"} as Record<string,string>)[box.id];
  const output=summary&&input(root,`#${summary}`); if(box&&output) output.value=Array.from(box.children).filter((item)=>item.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked).map((item)=>`${(item as HTMLElement).dataset.name?.toUpperCase()}: ${item.querySelector<HTMLInputElement>(".check-detail")?.value || "SELECCIONADO"}`).join(", ");
}

export function populateGlasgow(root: HTMLElement) {
  const birth=input(root,'#patientForm [name="fechaNacimiento"]')?.value;
  const age=birth?Math.max(0,(Date.now()-new Date(birth).getTime())/31557600000):18;
  const group=age<2?"Menor de 2 años":age<=5?"De 2 a 5 años":"Mayor de 5 años";
  const ageLabel=find(root,"#glasgowAge"); if(ageLabel) ageLabel.textContent=`— ${group}`;
  const options: Record<string,string[]>={
    gOcular:["Sin respuesta","Abre al dolor",age<=5?"Abre al sonido":"Abre a la orden","Espontánea"],
    gVerbal:age<2?["Sin respuesta","Gemidos al dolor","Llanto al dolor","Irritable/llora","Arrullos y balbuceos"]:age<=5?["Sin respuesta","Sonidos incomprensibles","Palabras incomprensibles","Confundido","Orientado/apropiado"]:["Sin respuesta","Sonidos incomprensibles","Palabras inapropiadas","Confundido","Orientado"],
    gMotora:age<2?["Sin respuesta","Extensión anormal","Flexión anormal","Retirada al dolor","Se retira al tacto","Movimiento espontáneo intencionado"]:["Sin respuesta","Extensión anormal","Flexión anormal","Retirada al dolor","Localiza dolor","Obedece órdenes"],
  };
  for(const [id,names] of Object.entries(options)){const select=input(root,`#${id}`); if(!(select instanceof HTMLSelectElement))continue; select.innerHTML='<option value="">Seleccione</option>'; names.forEach((name,index)=>select.add(new Option(`${index+1}. ${name}`,String(index+1))));}
  updateGlasgow(root);
}

export function updateGlasgow(root: HTMLElement) {
  for(const [ids,totalId] of [["#gOcular,#gVerbal,#gMotora","glasgowTotal"],["#criticalModeForm [name=glasgowOcular],#criticalModeForm [name=glasgowVerbal],#criticalModeForm [name=glasgowMotora]","criticalGlasgowTotal"]]){
    const values=Array.from(root.querySelectorAll<HTMLSelectElement>(ids)).map((select)=>Number(select.value)||0); const total=find(root,`#${totalId}`); if(total)total.textContent=values.some(Boolean)?String(values.reduce((a,b)=>a+b,0)):totalId==="glasgowTotal"?"0":"—";
  }
}

export function addDiagnosis(root: HTMLElement, id: string) {
  const box=find(root,`#${id}`); if(!box||box.children.length>=(id==="certificateDiagnoses"?4:3))return;
  const row=node("div","repeat-row diagnosis-row"); row.innerHTML='<div class="cie-search"><input class="cie" autocomplete="off" placeholder="Código CIE-10"><div class="cie-results hidden"></div></div><div class="cie-search"><input class="description" autocomplete="off" placeholder="Descripción del diagnóstico"><div class="cie-results hidden"></div></div><button type="button" class="remove-btn">Quitar</button>'; box.append(row);
}

export function addMedicine(root: HTMLElement) {
  const box=find(root,"#medicamentos"); if(!box||box.children.length>=7)return;
  const row=node("div","repeat-row medicine-row"); row.innerHTML='<div class="medicine-search medicine-main"><label>Medicamento</label><input class="med" autocomplete="off" placeholder="Medicamento de la unidad"><div class="medicine-results hidden"></div></div><div class="medicine-field"><label>Vía</label><input class="via" placeholder="Vía"></div><div class="medicine-field"><label>Dosis clínica</label><input class="dosis" placeholder="Ej. 1 g"></div><div class="medicine-field"><label>Cada</label><input class="intervalo" type="number" min="1" step="1" placeholder="8"></div><div class="medicine-field"><label>Intervalo</label><select class="unidad-intervalo"><option>HORAS</option><option>DÍAS</option><option>MINUTOS</option></select></div><div class="medicine-field"><label>Días</label><input class="dias" type="number" min="1" step="1" placeholder="3"></div><div class="medicine-inventory-control"><div class="medicine-field"><label>Unidades físicas por administración</label><input class="unidades-admin" type="number" min="0" step="0.001" value="0" placeholder="Ej. 2 tabletas"></div><div class="medicine-field"><label>Administraciones realizadas en emergencia</label><input class="administraciones" type="number" min="0" step="1" value="0" placeholder="Ej. 1"></div><div class="medicine-field"><label>Unidades entregadas al paciente</label><input class="entregadas" type="number" min="0" step="0.001" value="0" placeholder="Ej. 6"></div><div class="medicine-stock-summary"><small class="medicine-consumption">Prescripción estimada: 0 tomas · Salida inventario: 0</small><small class="medicine-stock">Seleccione el medicamento desde el inventario si registrará una salida física.</small></div></div><button type="button" class="remove-btn">Quitar</button>'; box.append(row);
}

export function addEpiSample(root: HTMLElement){const box=find(root,"#epiGroupSamples");if(!box||box.children.length>=3)return;const row=node("article","epi-repeat-row epi-sample-row");row.innerHTML='<input data-field="tipo" placeholder="Tipo de muestra"><label>Recepción<input data-field="fechaRecepcion" type="date"></label><select data-field="adecuada"><option>SI</option><option>NO</option></select><label>Procesamiento<input data-field="fechaProcesamiento" type="date"></label><label>Resultado<input data-field="fechaResultado" type="date"></label><button class="remove-btn" type="button">Quitar</button>';box.append(row)}
export function addEpiContact(root: HTMLElement){const box=find(root,"#epiContacts");if(!box||box.children.length>=8)return;const row=node("article","epi-repeat-row epi-contact-row");row.innerHTML='<input data-field="nombre" placeholder="Nombre"><input data-field="edad" type="number" min="0" placeholder="Edad"><select data-field="sexo"><option>M</option><option>F</option></select><input data-field="relacion" placeholder="Relación con el caso"><input data-field="direccionTelefono" placeholder="Dirección / teléfono"><input data-field="lugarContacto" placeholder="Lugar de contacto"><select data-field="enfermo"><option>NO</option><option>SI</option></select><input data-field="fechaInicio" type="date"><input data-field="observaciones" placeholder="Observaciones"><button class="remove-btn" type="button">Quitar</button>';box.append(row)}

export function updateMedicine(row: HTMLElement){const number=(selector:string)=>Number(row.querySelector<HTMLInputElement>(selector)?.value)||0;const interval=number(".intervalo"),days=number(".dias"),unit=row.querySelector<HTMLSelectElement>(".unidad-intervalo")?.value;const doses=interval>0&&days>0?Math.ceil(unit==="MINUTOS"?days*1440/interval:unit==="HORAS"?days*24/interval:days/interval):0;const administered=number(".unidades-admin")*number(".administraciones"),delivered=number(".entregadas"),total=administered+delivered;const summary=row.querySelector<HTMLElement>(".medicine-consumption");if(summary)summary.textContent=`Prescripción estimada: ${doses} ${doses===1?"toma":"tomas"} · Administrado: ${administered} · Entregado: ${delivered} · Salida inventario: ${total}`;}

export function updateAge(root: HTMLElement, inferUnit=false){
  for(const [formId,hourBox] of [["patientForm","birthTimeBox"],["statPatientForm","admissionBirthTimeBox"]]){
    const form=find(root,`#${formId}`);const birth=form?.querySelector<HTMLInputElement>('[name="fechaNacimiento"]');const age=form?.querySelector<HTMLInputElement>('[name="edad"]');const unit=form?.querySelector<HTMLSelectElement>('[name="condicionEdad"]');const box=find(root,`#${hourBox}`);
    if(!birth||!age||!unit)continue;
    if(!birth.value){age.value="";box?.classList.add("hidden");continue;}
    const hour=form?.querySelector<HTMLInputElement>('[name="horaNacimiento"]')?.value||"00:00";
    const date=new Date(`${birth.value}T${hour}:00`);const elapsed=Math.max(0,Date.now()-date.getTime());
    const hours=Math.floor(elapsed/3600000),days=Math.floor(elapsed/86400000),months=Math.floor(days/30.4375),years=Math.floor(days/365.25);
    if(inferUnit)unit.value=days<1?"HORAS":days<30?"DÍAS":months<12?"MESES":"AÑOS";
    box?.classList.toggle("hidden",unit.value!=="HORAS");
    age.value=String(unit.value==="HORAS"?hours:unit.value==="DÍAS"?days:unit.value==="MESES"?months:years);
  }
  populateGlasgow(root);
}

export function updateMama(root: HTMLElement, initialize = false) {
  if (!find(root, "#finalForm") || !(input(root, "#enableScoreMama") as HTMLInputElement | null)?.checked) return;
  const get = (name: string) => input(root, `#finalForm [name="${name}"]`);
  const value = (name: string) => get(name)?.value || "";
  const copy: Record<string, string> = { mamaPas: "pas", mamaPad: "pad", mamaFrecuenciaCardiaca: "pulso", mamaFrecuenciaRespiratoria: "frecuenciaRespiratoria" };
  for (const [target, source] of Object.entries(copy)) {
    const field = get(target); if (field) field.value = input(root, `#clinicalForm [name="${source}"]`)?.value || "";
  }
  if (initialize) {
    for (const [target, source] of [["mamaTemperatura", "temperatura"], ["mamaSaturacion", "pulsioximetria"]]) {
      const field = get(target); if (field && !field.value) field.value = input(root, `#clinicalForm [name="${source}"]`)?.value || "";
    }
  }
  const numeric = (name: string) => value(name).trim() === "" ? null : Number(value(name));
  const values = {
    temperatura: numeric("mamaTemperatura"), pas: numeric("mamaPas"), pad: numeric("mamaPad"),
    fc: numeric("mamaFrecuenciaCardiaca"), fr: numeric("mamaFrecuenciaRespiratoria"),
    saturacion: numeric("mamaSaturacion"),
  };
  const missing = Object.entries(values).filter(([, n]) => n === null || !Number.isFinite(n)).map(([name]) => name);
  if (!value("mamaCondicionObstetrica")) missing.push("condición obstétrica");
  if (!value("mamaConciencia")) missing.push("conciencia");
  if (!value("mamaProteinuria")) missing.push("proteinuria");
  const invalid = [
    ["temperatura", values.temperatura, 25, 45], ["PAS", values.pas, 20, 300],
    ["PAD", values.pad, 10, 200], ["FC", values.fc, 10, 300],
    ["FR", values.fr, 1, 100], ["SpO₂", values.saturacion, 0, 100],
  ].filter(([, number, min, max]) => number !== null && ((number as number) < (min as number) || (number as number) > (max as number))).map(([name]) => name as string);
  const result = find(root, "#scoreMamaTotal"), status = find(root, "#scoreMamaStatus");
  const breakdown = find(root, "#scoreMamaBreakdown"), guidance = find(root, "#scoreMamaGuidance");
  if (!result || !status) return;
  if (missing.length || invalid.length) {
    result.textContent = "—"; status.textContent = `SCORE MAMÁ INCOMPLETO. ${[missing.length ? `Faltan: ${missing.join(", ")}` : "", invalid.length ? `Revise: ${invalid.join(", ")}` : ""].filter(Boolean).join(". ")}`;
    if (breakdown) breakdown.textContent = "";
    if (guidance) guidance.textContent = "Complete y verifique las variables antes de interpretar el SCORE MAMÁ.";
    for (const [name, content] of [["scoreMama", ""], ["scoreMamaEstado", "INCOMPLETO"], ["scoreMamaCategoria", "INCOMPLETO"]]) { const field = get(name); if (field) field.value = content; }
    return;
  }
  const fc = values.fc!, pas = values.pas!, pad = values.pad!, fr = values.fr!, temp = values.temperatura!, sat = values.saturacion!;
  const altitude = (get("mamaAltitud2500") as HTMLInputElement | null)?.checked;
  const consciousness = value("mamaConciencia");
  const points: Record<string, number> = {
    FC: fc <= 50 ? 3 : fc < 60 ? 1 : fc <= 100 ? 0 : fc <= 110 ? 1 : fc < 120 ? 2 : 3,
    PAS: pas <= 70 ? 3 : pas < 90 ? 2 : pas < 140 ? 0 : pas < 160 ? 2 : 3,
    PAD: pad <= 50 ? 3 : pad < 60 ? 2 : pad <= 85 ? 0 : pad < 90 ? 1 : pad < 110 ? 2 : 3,
    FR: fr <= 11 ? 3 : fr <= 22 ? 0 : fr < 30 ? 2 : 3,
    Temperatura: temp <= 35.5 ? 2 : temp < 37.3 ? 0 : temp < 38.5 ? 1 : 3,
    SpO2: sat <= 85 ? 3 : sat < 90 ? 2 : sat <= 93 ? altitude ? 0 : 1 : 0,
    Conciencia: consciousness === "ALERTA" ? 0 : consciousness.includes("VOZ") || consciousness.includes("SOMNOL") ? 1 : consciousness.includes("NO RESPONDE") ? 3 : 2,
    Proteinuria: value("mamaProteinuria") === "NEGATIVA" ? 0 : 1,
  };
  const total = Object.values(points).reduce((sum, point) => sum + point, 0);
  const category = total === 0 ? "PUNTAJE 0" : total === 1 ? "PUNTAJE 1" : total <= 4 ? "PUNTAJE 2-4" : "PUNTAJE ≥5";
  const recommendation = total === 0 ? "Evaluar factores de riesgo, bienestar materno-fetal y signos de alarma." : total === 1 ? "Reevaluar signos vitales y factores de riesgo. Repetir SCORE MAMÁ cada 4 horas y registrar." : total <= 4 ? "Tratar y referir según el caso. Reevaluar y repetir SCORE MAMÁ cada hora." : "Tratar y referir según el caso. Reevaluar y repetir SCORE MAMÁ cada 30 minutos.";
  result.textContent = String(total); status.textContent = `${category} · cálculo completo`;
  if (breakdown) { breakdown.replaceChildren(...Object.entries(points).map(([name, point]) => { const label = node("span"); const strong = node("b"); strong.textContent = name; label.append(strong, ` ${point} pt`); return label; })); }
  if (guidance) guidance.textContent = `${recommendation} Referencia operativa MSP; la conducta final corresponde al profesional.`;
  for (const [name, content] of [["scoreMama", String(total)], ["scoreMamaEstado", "COMPLETO"], ["scoreMamaCategoria", category], ["scoreMamaRecomendacion", recommendation]]) { const field = get(name); if (field) field.value = content; }
}
