import React from 'react';
import { SectionCard, Select, NumberInput, Badge, InfoRow } from '../ui';
import { BATTERY_CONFIG, EXPANSION_CONFIG } from '../../config';
import { calcBatteryTotal, calcExpansionTotal } from '../../utils/calculations';
import { fmt } from '../../utils/format';

const batteryOptions = [
  { value: 'none', label: 'None' },
  { value: 'pw3_hybrid', label: 'PW3 Hybrid' },
];

const batteryCountOptions = [
  { value: '1', label: '1 Unit' },
  { value: '2', label: '2 Units' },
];

export function Storage({ state, update, batteryLocked, maxExp }) {
  const batteryTotal   = calcBatteryTotal(state.batteryType, state.batteryCount);
  const expansionTotal = calcExpansionTotal(state.expansionCount);

  const expansionOptions = Array.from({ length: maxExp + 1 }, (_, i) => ({
    value: String(i),
    label: i === 0 ? 'None' : `${i} Unit${i > 1 ? 's' : ''}`,
  }));

  return (
    <SectionCard title="Storage" icon="🔋">
      {batteryLocked && (
        <div className="rounded-xl bg-[#f4b63f]/10 border border-[#f4b63f]/30 px-4 py-2.5 flex items-center gap-2 mb-2">
          <span className="text-[#f4b63f]">⚠️</span>
          <p className="text-xs text-[#f4b63f]">
            System ≥ 44 panels — 2× PW3 Hybrid required (locked)
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Battery Type"
          value={state.batteryType}
          onChange={v => update('batteryType', v)}
          options={batteryOptions}
          disabled={batteryLocked}
        />

        {state.batteryType !== 'none' && (
          <Select
            label="Battery Count"
            value={String(state.batteryCount)}
            onChange={v => update('batteryCount', Number(v))}
            options={batteryCountOptions}
            disabled={batteryLocked}
          />
        )}

        <Select
          label="Expansion Batteries"
          hint={`Max ${maxExp} for this system size`}
          value={String(state.expansionCount)}
          onChange={v => update('expansionCount', Number(v))}
          options={expansionOptions}
        />
      </div>

      {/* Pricing summary */}
      {(batteryTotal > 0 || expansionTotal > 0) && (
        <div className="mt-3 rounded-xl bg-[#1a2740] border border-[#2d3f55] px-4 py-3 space-y-1">
          <p className="text-[9px] uppercase tracking-widest text-[#4b5563] mb-2">Storage Costs (not commissionable)</p>
          {batteryTotal > 0 && (
            <InfoRow label={`Battery — ${state.batteryCount}× PW3 Hybrid`} value={fmt.currency(batteryTotal)} />
          )}
          {expansionTotal > 0 && (
            <InfoRow label={`Expansions — ${state.expansionCount}× @ $7,000`} value={fmt.currency(expansionTotal)} />
          )}
        </div>
      )}
    </SectionCard>
  );
}
