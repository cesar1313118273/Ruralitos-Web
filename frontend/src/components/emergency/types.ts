export type EmergencyView =
  | "dashboard"
  | "care"
  | "pending"
  | "histories"
  | "epi"
  | "matrix"
  | "certificate"
  | "statistics"
  | "profile"
  | "admission"
  | "patients";

export type VitalKey =
  | "temperatura"
  | "pas"
  | "pad"
  | "pulso"
  | "fr"
  | "saturacion"
  | "glicemia"
  | "llenado"
  | "peso"
  | "talla"
  | "perimetro";

export type Vitals = Record<VitalKey, string>;

export const emptyVitals: Vitals = {
  temperatura: "", pas: "", pad: "", pulso: "", fr: "", saturacion: "",
  glicemia: "", llenado: "", peso: "", talla: "", perimetro: "",
};
