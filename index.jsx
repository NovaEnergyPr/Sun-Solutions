import React from 'react';

// ── Card ─────────────────────────────────────────────────────
export function Card({ children, className = '', accent = false, highlight = false }) {
  return (
    <div
      className={`
        rounded-2xl border p-5 transition-all duration-200
        ${highlight
          ? 'bg-gradient-to-br from-[#0b2e83]/40 to-[#f4b63f]/10 border-[#f4b63f]/40 shadow-lg shadow-[#f4b63f]/10'
          : 'bg-[#1e293b] border-[#2d3f55]'
        }
        ${accent ? 'border-[#0b2e83]/60' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ── SectionCard ──────────────────────────────────────────────
export function SectionCard({ title, icon, children, className = '' }) {
  return (
    <Card className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2.5 pb-1 border-b border-[#2d3f55]">
        {icon && <span className="text-[#f4b63f]">{icon}</span>}
        <h2 className="font-display font-700 text-sm uppercase tracking-widest text-[#94a3b8]">
          {title}
        </h2>
      </div>
      {children}
    </Card>
  );
}

// ── FieldLabel ───────────────────────────────────────────────
export function FieldLabel({ label, hint }) {
  return (
    <div className="mb-1.5">
      <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
        {label}
      </label>
      {hint && <p className="text-[10px] text-[#64748b] mt-0.5">{hint}</p>}
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────
export function Select({ label, hint, value, onChange, options, disabled = false }) {
  return (
    <div className="animate-fade-in">
      {label && <FieldLabel label={label} hint={hint} />}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full rounded-xl px-4 py-3 text-sm font-body text-[#f8fafc]
          bg-[#374151] border border-[#4b5563]
          focus:outline-none focus:ring-2 focus:ring-[#0b2e83] focus:border-transparent
          transition-all duration-150
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#0b2e83]/60 cursor-pointer'}
        `}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── NumberInput ──────────────────────────────────────────────
export function NumberInput({ label, hint, value, onChange, min, max, step = 1, prefix, suffix, disabled = false }) {
  return (
    <div className="animate-fade-in">
      {label && <FieldLabel label={label} hint={hint} />}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 text-sm text-[#94a3b8] font-mono pointer-events-none">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`
            w-full rounded-xl px-4 py-3 text-sm font-mono text-[#f8fafc]
            bg-[#374151] border border-[#4b5563]
            focus:outline-none focus:ring-2 focus:ring-[#0b2e83] focus:border-transparent
            transition-all duration-150
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-12' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#0b2e83]/60'}
          `}
        />
        {suffix && (
          <span className="absolute right-4 text-sm text-[#94a3b8] font-mono pointer-events-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}

// ── Toggle (Yes/No) ──────────────────────────────────────────
export function YesNoToggle({ label, hint, value, onChange }) {
  return (
    <div className="animate-fade-in">
      {label && <FieldLabel label={label} hint={hint} />}
      <div className="flex rounded-xl overflow-hidden border border-[#4b5563]">
        {[false, true].map(opt => (
          <button
            key={String(opt)}
            onClick={() => onChange(opt)}
            className={`
              flex-1 py-3 text-sm font-medium transition-all duration-150
              ${value === opt
                ? opt
                  ? 'bg-[#f4b63f] text-[#0f172a] font-semibold'
                  : 'bg-[#1e3a5f] text-[#f8fafc]'
                : 'bg-[#374151] text-[#94a3b8] hover:bg-[#3f4f61]'
              }
            `}
          >
            {opt ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── StatCard ─────────────────────────────────────────────────
export function StatCard({ label, value, sub, highlight = false, accent = false, warn = false }) {
  return (
    <div
      className={`
        rounded-2xl border p-4 flex flex-col gap-1 transition-all duration-200
        ${highlight
          ? 'bg-gradient-to-br from-[#0b2e83]/60 to-[#f4b63f]/20 border-[#f4b63f]/50 shadow-lg shadow-[#f4b63f]/10'
          : accent
            ? 'bg-[#1e293b]/80 border-[#0b2e83]/50'
            : warn
              ? 'bg-[#1e293b] border-[#ef4444]/30'
              : 'bg-[#1e293b] border-[#2d3f55]'
        }
      `}
    >
      <p className="text-[10px] font-body uppercase tracking-widest text-[#64748b]">{label}</p>
      <p className={`font-mono font-medium text-lg leading-none ${highlight ? 'text-[#f4b63f]' : 'text-[#f8fafc]'}`}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-[#64748b] font-body">{sub}</p>}
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────
export function Badge({ children, color = 'blue' }) {
  const colors = {
    blue:   'bg-[#0b2e83]/30 text-[#60a5fa] border-[#0b2e83]/50',
    yellow: 'bg-[#f4b63f]/20 text-[#f4b63f] border-[#f4b63f]/40',
    green:  'bg-emerald-900/30 text-emerald-400 border-emerald-700/40',
    red:    'bg-red-900/30 text-red-400 border-red-700/40',
    gray:   'bg-[#374151] text-[#94a3b8] border-[#4b5563]',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
}

// ── Divider ──────────────────────────────────────────────────
export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-1">
      {label && <span className="text-[10px] uppercase tracking-widest text-[#4b5563] whitespace-nowrap">{label}</span>}
      <div className="flex-1 h-px bg-[#2d3f55]" />
    </div>
  );
}

// ── InfoRow ──────────────────────────────────────────────────
export function InfoRow({ label, value, muted = false }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[#2d3f55]/50 last:border-0">
      <span className="text-xs text-[#64748b] font-body">{label}</span>
      <span className={`text-xs font-mono ${muted ? 'text-[#64748b]' : 'text-[#f8fafc]'}`}>{value}</span>
    </div>
  );
}
