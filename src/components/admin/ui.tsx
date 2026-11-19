import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-navy/10 pb-6 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow text-gold-deep">{eyebrow}</p>
        <h1 className="mt-2 font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight text-navy">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[0.8rem] leading-relaxed text-navy/45">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
  title,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`border border-navy/10 bg-white ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-navy/8 px-5 py-3.5">
          <h2 className="font-display text-[1.1rem] text-navy">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  note,
  icon,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  note: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={`border p-5 ${accent ? "border-gold/40 bg-[#fbf7ec]" : "border-navy/10 bg-white"}`}>
      <div className="flex items-start justify-between">
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-navy/40">{label}</p>
        <span className={accent ? "text-gold-deep" : "text-navy/30"}>{icon}</span>
      </div>
      <p className="mt-3 font-display text-[1.9rem] leading-none text-navy">{value}</p>
      <p className="mt-1.5 text-[0.65rem] text-navy/35">{note}</p>
    </div>
  );
}

const TONES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-sky-100 text-sky-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
  unpaid: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  refunded: "bg-navy/10 text-navy/60",
  new: "bg-gold/20 text-navy",
  contacted: "bg-blue-100 text-blue-800",
  quoted: "bg-indigo-100 text-indigo-800",
  closed: "bg-navy/10 text-navy/60",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`inline-flex px-2 py-1 text-[0.52rem] font-bold uppercase tracking-[0.08em] ${TONES[value] ?? "bg-navy/8 text-navy/60"}`}>
      {value}
    </span>
  );
}

export function Flash({ saved, error }: { saved?: string; error?: string }) {
  if (!saved && !error) return null;
  return (
    <div
      className={`mb-6 flex items-start gap-2.5 border px-4 py-3 text-[0.75rem] ${
        error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {error ? <AlertTriangle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
      <span>{error ? decodeURIComponent(error).replace(/-/g, " ") : "Changes saved."}</span>
    </div>
  );
}

export function AdminField({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  required,
  hint,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        step={step}
        className="field h-10 text-[0.8rem]"
      />
      {hint && <span className="mt-1 block text-[0.6rem] text-navy/35">{hint}</span>}
    </label>
  );
}

export function AdminTextarea({
  label,
  name,
  defaultValue,
  rows = 3,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="field h-auto py-2.5 text-[0.8rem]"
      />
      {hint && <span className="mt-1 block text-[0.6rem] text-navy/35">{hint}</span>}
    </label>
  );
}
