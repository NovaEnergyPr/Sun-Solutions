import React from 'react';
import { SectionCard, NumberInput, InfoRow } from '../ui';
import { fmt } from '../../utils/format';
import { SELLER_POSITIONS } from '../../config';

export function Sales({ state, update, results, position }) {
  return (
    <SectionCard title="Ventas" icon="💼">

      {/* Commission locked to position — visual display */}
      <div className="rounded-xl border px-4 py-3 mb-2"
        style={{ backgroundColor: position.color + '10', borderColor: position.color + '30' }}>
        <p className="text-[9px] uppercase tracking-widest text-[#64748b] mb-2">Tabla de Comisiones por Posición</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          {SELLER_POSITIONS.map(p => {
            const isActive = p.value === state.sellerPosition;
            return (
              <div key={p.value}
                className={`flex justify-between items-center py-1 px-2 rounded-lg text-[11px] transition-all ${
                  isActive ? 'font-semibold' : 'text-[#64748b]'
                }`}
                style={isActive ? { backgroundColor: p.color + '20', color: p.color } : {}}
              >
                <span className="truncate pr-2">{p.label}</span>
                <span className="font-mono flex-shrink-0">{p.commissionPct}% → {p.overridePct}%</span>
              </div>
            );
          })}
        </div>
        <p className="text-[9px] text-[#4b5563] mt-2">Comisión → Override. Tu posición activa: <span style={{ color: position.color }}>{position.label}</span></p>
      </div>

      {/* Sold PPW */}
      <NumberInput
        label="Sold PPW (Precio por Watt Vendido)"
        hint="Ingreso manual — calcula excedente y override bonus"
        value={state.soldPPW}
        onChange={v => update('soldPPW', v)}
        step={0.001}
        prefix="$"
      />

      {/* Live preview */}
      {state.soldPPW > 0 && (
        <div className="mt-3 rounded-xl bg-[#1a2740] border border-[#2d3f55] px-4 py-3 space-y-1">
          <p className="text-[9px] uppercase tracking-widest text-[#4b5563] mb-2">Vista Previa</p>
          <InfoRow label="Sold PPW" value={fmt.ppw(state.soldPPW)} />
          <InfoRow label="Total Vendido" value={fmt.currency(results.soldTotal)} />
          <InfoRow label="Excedente (Vendido − Sistema)" value={fmt.currency(results.excedente)} />
          <InfoRow label={`Override (${results.overridePct}%)`} value={fmt.currency(results.overrideBonus)} />
        </div>
      )}
    </SectionCard>
  );
}
