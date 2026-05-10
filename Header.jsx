import React from 'react';

export function Header({ onSummary, onHistory, onAdmin, position }) {
  const canAdmin = position?.canViewAdmin ?? false;

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-[#2d3f55]">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#f4b63f]/20 animate-pulse-slow" />
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 relative">
              <circle cx="18" cy="18" r="7" fill="#f4b63f" />
              {[0,45,90,135,180,225,270,315].map((deg, i) => (
                <line key={i} x1="18" y1="18"
                  x2={18 + 13 * Math.cos((deg * Math.PI) / 180)}
                  y2={18 + 13 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#f4b63f" strokeWidth="2.2" strokeLinecap="round"
                  opacity={i % 2 === 0 ? 1 : 0.5}
                />
              ))}
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display font-bold text-lg leading-none tracking-wide text-[#f8fafc]">SUN SOLUTIONS</h1>
            <p className="text-[10px] font-body tracking-widest text-[#f4b63f] uppercase mt-0.5">Quotes & Commissions</p>
          </div>
        </div>

        {/* Position pill */}
        {position && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 border text-xs font-medium flex-shrink-0"
            style={{ borderColor: position.color + '50', backgroundColor: position.color + '15', color: position.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: position.color }} />
            {position.label}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={onHistory}
            className="text-xs font-body text-[#94a3b8] hover:text-[#f8fafc] border border-[#2d3f55] hover:border-[#4b5563] rounded-full px-3 py-1.5 transition-all flex items-center gap-1.5">
            <span>📋</span>
            <span className="hidden sm:inline">Historial</span>
          </button>

          {canAdmin && (
            <button onClick={onAdmin}
              className="text-xs font-body text-[#f4b63f] hover:text-[#fbbf24] border border-[#f4b63f]/30 hover:border-[#f4b63f]/60 rounded-full px-3 py-1.5 transition-all flex items-center gap-1.5">
              <span>⚙️</span>
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          <button onClick={onSummary}
            className="text-xs font-body text-[#0f172a] bg-[#f4b63f] hover:bg-[#fbbf24] rounded-full px-4 py-1.5 font-semibold transition-all flex items-center gap-1.5">
            <span>📄</span>
            <span>Cotizar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
