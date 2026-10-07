import {
  Activity,
  ArrowRight,
  BarChart3,
  ClipboardPlus,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

const modules = [
  {
    name: "Consulta externa",
    description: "Atenciones, antecedentes, diagnosticos, recetas y seguimiento.",
    icon: Stethoscope,
    color: "blue",
    href: "/consulta-externa/atenciones-diarias",
  },
  {
    name: "Emergencia",
    description: "Triaje, evoluciones, procedimientos, observacion y egreso.",
    icon: HeartPulse,
    color: "red",
    href: "/emergencia",
  },
  {
    name: "Estadisticas",
    description: "Importacion de Excel, validacion, indicadores y reportes.",
    icon: BarChart3,
    color: "violet",
    href: null,
  },
  {
    name: "Administracion",
    description: "Centros, usuarios, roles, permisos y auditoria del sistema.",
    icon: ShieldCheck,
    color: "emerald",
    href: null,
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--surface-subtle)]">
      <header className="border-b border-[var(--border)] bg-white/95">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a className="flex items-center gap-3" href="#inicio" aria-label="Ruralitos, inicio">
            <span className="grid size-11 place-items-center rounded-2xl bg-[var(--primary)] text-white shadow-sm">
              <ClipboardPlus aria-hidden="true" size={23} strokeWidth={2.2} />
            </span>
            <span>
              <strong className="block text-lg leading-none tracking-[-0.02em] text-[var(--ink)]">
                Ruralitos
              </strong>
              <span className="mt-1 block text-xs font-medium text-[var(--muted)]">
                Gestion integral de salud
              </span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-sm font-medium text-[var(--muted)] md:flex">
              <LockKeyhole aria-hidden="true" size={16} />
              Acceso seguro
            </span>
            <button className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]">
              Iniciar sesion
            </button>
          </div>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden border-b border-[var(--border)] bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.12),transparent_42%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-800">
              <Activity aria-hidden="true" size={16} />
              Plataforma para centros de salud rurales
            </div>
            <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl lg:text-6xl">
              Informacion clinica clara para atender mejor.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-[var(--muted)]">
              Consulta externa, emergencia, estadisticas y administracion en un sistema rapido,
              modular y preparado para trabajar en equipo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]">
                Entrar al sistema
                <ArrowRight aria-hidden="true" size={17} />
              </button>
              <a
                href="#modulos"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-white px-6 text-sm font-semibold text-[var(--ink)] transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                Conocer los modulos
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-[var(--border)] bg-[var(--ink)] p-6 text-white shadow-2xl shadow-slate-900/10 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-300">Estado general</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <span className="size-2 rounded-full bg-emerald-400" /> Operativo
              </span>
            </div>
            <p className="mt-8 text-3xl font-bold tracking-[-0.03em]">Un centro conectado</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              La informacion permanece organizada por establecimiento, profesional y rol.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/6 p-4">
                <UsersRound aria-hidden="true" className="text-teal-300" size={20} />
                <strong className="mt-4 block text-2xl">4</strong>
                <span className="text-xs text-slate-400">modulos principales</span>
              </div>
              <div className="rounded-2xl bg-white/6 p-4">
                <ShieldCheck aria-hidden="true" className="text-teal-300" size={20} />
                <strong className="mt-4 block text-2xl">RLS</strong>
                <span className="text-xs text-slate-400">seguridad por registro</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="modulos" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
            Modulos principales
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">
            Una plataforma, cuatro areas de trabajo.
          </h2>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            Cada area conserva su propio flujo y comparte solo la informacion autorizada.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <article
                key={module.name}
                className="group rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 sm:p-7"
              >
                <div className={`module-icon module-icon--${module.color}`}>
                  <Icon aria-hidden="true" size={23} strokeWidth={2.1} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-[var(--ink)]">{module.name}</h3>
                <p className="mt-2 leading-7 text-[var(--muted)]">{module.description}</p>
                {module.href ? (
                  <Link
                    href={module.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red-700"
                  >
                    Abrir módulo
                    <ArrowRight aria-hidden="true" size={16} className="transition group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
                    Próximamente
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Ruralitos Web · Gestion integral de salud</span>
          <span>Arquitectura inicial en desarrollo</span>
        </div>
      </footer>
    </main>
  );
}
