import React from 'react';
import { SectionCard, InfoRow } from '../ui';
import { SELLER_POSITIONS } from '../../config';
import { fmt } from '../../utils/format';

export function PositionCommission({ state, results, position }) {
  const myIndex = SELLER_POSITIONS.findIndex(p => p.value === state.sellerPosition);

  // Differential preview: what this position earns on top of positions below
  // Architecture ready — actual team deal calculation is a future feature
  const positionsBelow = SELLER_POSITIONS.slice(0, myIndex);

  return (
    <SectionCard title="Comisión por Posición" icon="🏅">

      {/* Ladder visual */}
      <div className="space-y-1.5 mb-4">
        {[...SELLER_POSITIONS].reverse().map((p, i) => {
          const isMe = p.value === state.sellerPosition;
          const isBelow = SELLER_POSITIONS.indexOf(p) < myIndex;
          const panelEPC = results.panelEPC;
          const myComm  = panelEPC * (position.commissionPct / 100);
          const thisComm = panelEPC * (p.commissionPct / 100);
          const diff = isBelow ? panelEPC * (p.differential / 100) : null;

          return (
            <div
              key={p.value}
              className={`rounded-xl px-4 py-2.5 flex items-center gap-3 border transition-all ${
                isMe
                  ? 'border-2 shadow-lg'
                  : isBelow
                    ? 'opacity-60'
                    : 'opacity-30'
              }`}
              style={isMe
                ? { borderColor: p.color, backgroundColor: p.color + '15', boxShadow: `0 0 20px ${p.color}20` }
                : { borderColor: '#2d3f55', backgroundColor: '#111827' }
              }
            >
              {/* Position indicator */}
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: isMe ? p.color : '#4b5563' }} />

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${isMe ? '' : 'text-[#64748b]'}`}
                  style={isMe ? { color: p.color } : {}}>
                  {p.label}
                  {isMe && <span className="ml-2 text-[9px] font-normal opacity-70">← Tú</span>}
                </p>
              </div>

              {/* Commission % */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-mono" style={isMe ? { color: p.color, fontWeight: 700 } : { color: '#64748b' }}>
                  {p.commissionPct}% / {p.overridePct}%
                </p>
                {isMe && panelEPC > 0 && (
                  <p className="text-[9px] text-[#94a3b8] font-mono">{fmt.currency(myComm)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[9px] text-[#4b5563] text-center mb-3">Comisión% / Override% · Tu posición resaltada</p>

      {/* My commission breakdown */}
      <div className="rounded-xl bg-[#111827] border border-[#2d3f55] px-4 py-3 space-y-1">
        <p className="text-[9px] uppercase tracking-widest text-[#4b5563] mb-2">Tu Desglose — {position.label}</p>
        <InfoRow label={`Comisión Base (${position.commissionPct}%)`} value={fmt.currency(results.baseCommission)} />
        <InfoRow label={`Override (${position.overridePct}% del excedente)`} value={fmt.currency(results.overrideBonus)} />
        {position.differential > 0 && (
          <div className="pt-1 mt-1 border-t border-[#2d3f55]">
            <p className="text-[9px] text-[#4b5563] mb-1">Diferencial (futuro — sobre deals del equipo)</p>
            <InfoRow
              label={`Diferencial vs posición inferior (${position.differential}%)`}
              value={results.panelEPC > 0 ? fmt.currency(results.panelEPC * (position.differential / 100)) : '—'}
              muted
            />
          </div>
        )}
      </div>

      {/* Final total */}
      <div className="mt-3 rounded-2xl border-2 px-5 py-4 flex justify-between items-center"
        style={{ borderColor: position.color + '60', background: `linear-gradient(135deg, ${position.color}20 0%, transparent 100%)` }}>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#64748b]">Tu Comisión Final</p>
          <p className="text-[9px] text-[#4b5563] mt-0.5">Base + Override Bonus</p>
        </div>
        <p className="text-2xl font-mono font-bold" style={{ color: position.color }}>
          {fmt.currency(results.finalCommission)}
        </p>
      </div>
    </SectionCard>
  );
}
