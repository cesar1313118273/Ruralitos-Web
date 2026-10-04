import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "docs", "original-emergency");
const target = join(root, "frontend", "src", "components", "emergency", "original-markup.json");

function read(name) {
  return readFileSync(join(source, `${name}.html`), "utf8").trim();
}

function clean(html) {
  // Event handlers belong to Apps Script. The React adapter provides the local UI actions.
  const cleaned = html
    .replace(/\s+on[a-z]+=(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/^<(main|article|section)([^>]*\bclass=")([^"]*)(")/i, (_, tag, before, classes, after) =>
      `<${tag}${before}${classes.split(/\s+/).filter((name) => name !== "hidden").join(" ")}${after}`);
  const controls = (value) => [...value.matchAll(/<(?:input|select|textarea|option)\b/gi)].length;
  if (controls(html) !== controls(cleaned)) throw new Error("Se perdió un campo u opción durante la conversión del HTML.");
  return cleaned;
}

const index = read("Index");
const establishment = index.match(/<article class="section-card">[\s\S]*?<\/article>/);
const auth = index.match(/<section id="auth"[\s\S]*?<\/section>/);
const toolbar = index.match(/<div class="draft-toolbar">[\s\S]*?<\/div>/);
const steps = index.match(/<nav class="steps">[\s\S]*?<\/nav>/);
if (!establishment || !auth || !toolbar || !steps) throw new Error("No se encontraron las secciones originales de Index.html");

const files = {
  dashboard: "PanelPrincipal",
  pending: "ListaPendientes",
  histories: "CatalogoHistorias",
  epi: "EpiInterfaz",
  matrix: "MatrizGuardiaInterfaz",
  certificate: "CertificadoMedicoInterfaz",
  statistics: "EstadisticasInterfaz",
  profile: "PerfilInterfaz",
  admission: "RolesInterfaz",
  patients: "EstadisticoInterfaz",
  patient: "Paciente",
  triage: "Triage",
  clinical: "Atencion",
  final: "Finalizacion",
  critical: "ModoCritico",
  evolution: "EvolucionObservacion",
};

const markup = { establishment: clean(establishment[0]), auth: clean(auth[0]), toolbar: clean(toolbar[0]), steps: clean(steps[0]) };
for (const [view, name] of Object.entries(files)) markup[view] = clean(read(name));
writeFileSync(target, `${JSON.stringify(markup, null, 2)}\n`, "utf8");
console.log(`Generated ${Object.keys(markup).length} exact source fragments from 19 archived HTML files.`);
