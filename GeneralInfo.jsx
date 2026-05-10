import React from 'react';
import { SectionCard, Select } from '../ui';
import { PRODUCTS, PROJECT_TYPES, SELLER_POSITIONS, PRICING_VERSIONS, LOCATIONS, getPosition } from '../../config';

const productOptions  = Object.values(PRODUCTS).map(p => ({ value: p.id, label: p.label }));
const locationOptions = Object.entries(LOCATIONS).map(([k, v]) => ({ value: k, label: v.label }));
const positionOptions = SELLER_POSITIONS.map(p => ({ value: p.value, label: p.label }));

export function GeneralInfo({ state, update, position }) {
  return (
    <SectionCard title="Información General" icon="🏢">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Producto / Programa"
          value={state.product}
          onChange={v => update('product', v)}
          options={productOptions}
        />
        <Select
          label="Tipo de Proyecto"
          value={state.projectType}
          onChange={v => update('projectType', v)}
          options={PROJECT_TYPES}
        />

        {/* Position selector with live commission preview */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider mb-1.5">
            Posición del Vendedor
          </label>
          <select
            value={state.sellerPosition}
            onChange={e => update('sellerPosition', e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm font-body text-[#f8fafc] bg-[#374151] border border-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#0b2e83] focus:border-transparent transition-all duration-150 hover:border-[#0b2e83]/60 cursor-pointer"
          >
            {SELLER_POSITIONS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Position badge with commission + override */}
          {position && (
            <div className="mt-2 flex items-center gap-3 rounded-xl px-4 py-2.5 border transition-all"
              style={{ backgroundColor: position.color + '15', borderColor: position.color + '40' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: position.color }} />
              <div className="flex-1">
                <span className="text-xs font-medium" style={{ color: position.color }}>{position.label}</span>
                <span className="text-[10px] text-[#64748b] ml-2">{position.description}</span>
              </div>
              <div className="flex gap-3 text-right flex-shrink-0">
                <div>
                  <p className="text-[9px] text-[#64748b] uppercase tracking-wider">Comisión</p>
                  <p className="text-sm font-mono font-bold" style={{ color: position.color }}>{position.commissionPct}%</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#64748b] uppercase tracking-wider">Override</p>
                  <p className="text-sm font-mono font-bold text-[#f8fafc]">{position.overridePct}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Select
          label="Versión de Precios"
          value={state.pricingVersion}
          onChange={v => update('pricingVersion', v)}
          options={PRICING_VERSIONS}
        />
        <Select
          label="Ubicación"
          hint="Adders aplican automáticamente"
          value={state.location}
          onChange={v => update('location', v)}
          options={locationOptions}
        />
      </div>
    </SectionCard>
  );
}
