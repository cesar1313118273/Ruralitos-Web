import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = join(project, "docs", "original-consulta-externa", "index.html");
const targetPath = join(project, "frontend", "public", "consulta-externa", "atenciones-diarias.html");
const source = readFileSync(sourcePath, "utf8");

const unitTemplate = "<?= unidad ?>";
const resetTemplate = "<?= resetToken ?>";
const scriptStart = /<script>\s*const TOKEN_KEY=/;
if (!source.includes(unitTemplate) || !source.includes(resetTemplate) || !scriptStart.test(source)) {
  throw new Error("El HTML original cambió; revisar la conversión antes de publicar.");
}

const output = source
  .replaceAll(unitTemplate, "Centro de Salud · Unidad demo")
  .replaceAll(resetTemplate, "")
  .replace(scriptStart, (match) => '<script src="/consulta-externa/bridge.js"></script>\n' + match);

for (const tag of ["input", "select", "textarea", "button", "option"]) {
  const count = (html) => [...html.matchAll(new RegExp(`<${tag}\\b`, "gi"))].length;
  if (count(source) !== count(output)) throw new Error(`Se alteraron los controles ${tag} del HTML original.`);
}
if (output.includes("<?=")) throw new Error("Quedó una variable de plantilla sin resolver.");

writeFileSync(targetPath, output, "utf8");
console.log("Interfaz original de consulta externa generada sin cambiar sus controles.");
