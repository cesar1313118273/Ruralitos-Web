import { ReactNode } from "react";

import styles from "./emergency.module.css";

export function Field({ label, required, children, wide, hint }: { label: string; required?: boolean; children: ReactNode; wide?: boolean; hint?: string }) {
  return <label className={wide ? styles.wide : undefined}><span className={styles.label}>{label}{required && <b> *</b>}</span>{children}{hint && <small className={styles.fieldHint}>{hint}</small>}</label>;
}

export function Grid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 | 4 }) {
  return <div className={`${styles.formGrid} ${styles[`columns${columns}`]}`}>{children}</div>;
}

export function PageTitle({ eyebrow, title, description, aside }: { eyebrow?: string; title: string; description: string; aside?: ReactNode }) {
  return <div className={styles.pageHeading}><div>{eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}<h1>{title}</h1><p>{description}</p></div>{aside}</div>;
}

export function SectionTitle({ number, title, description, action }: { number?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className={styles.sectionTitle}>{number && <span>{number}</span>}<div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action && <div className={styles.sectionAction}>{action}</div>}</div>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`${styles.formCard} ${className}`}>{children}</section>;
}

export function Subheading({ children }: { children: ReactNode }) { return <h3 className={styles.subheading}>{children}</h3>; }

export function Notice({ tone = "info", children }: { tone?: "info" | "warning" | "success" | "danger"; children: ReactNode }) {
  return <div className={`${styles.notice} ${styles[`notice_${tone}`]}`}>{children}</div>;
}

export function Toggle({ checked, onChange, title, description }: { checked: boolean; onChange: (checked: boolean) => void; title: string; description?: string }) {
  return <label className={styles.observationToggle}><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span><b>{title}</b>{description && <small>{description}</small>}</span></label>;
}

export function EmptyState({ children }: { children: ReactNode }) { return <div className={styles.emptyState}>{children}</div>; }

export const yesNo = <><option>NO</option><option>SI</option></>;
