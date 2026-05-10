import React, { useState } from 'react';
import { SectionCard, NumberInput, Select, Badge } from '../ui';
import { PANEL_TYPES, PANEL_RULES } from '../../config';
import { calcSystemSize, isPanelCountBlocked } from '../../utils/calculations';
import { fmt } from '../../utils/format';

const panelTypeOptions = PANEL_TYPES.map(p => ({ value: p.value, label: p.label }));

export function Panels({ state, update }) {
  const [rawPanels, setRawPanels] = useState(String(state.panels));
  const sysSize = calcSystemSize(state.panels);
  const blocked = isPanelCountBlocked(Number(rawPanels));

  function handlePanelChange(val) {
    setRawPanels(val);
    const n = Number(val);
    if (!isNaN(n) && n >= 1) {
      update('panels', n);
    }
  }

  function handleBlur() {
    // After blur, show resolved value
    setRawPanels(String(state.panels));
  }

  return (
    <SectionCard title="Panels" icon="☀️">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <NumberInput
            label="Number of Panels"
            hint="37–43 auto-jumps to 44"
            value={rawPanels}
            onChange={handlePanelChange}
            min={PANEL_RULES.min}
            step={1}
          />
          {blocked && (
            <p className="mt-1.5 text-[11px] text-[#f4b63f] flex items-center gap-1">
              <span>⚡</span> Jumped to 44 panels (37–43 not allowed)
            </p>
          )}
          {state.panels >= 44 && !blocked && (
            <div className="mt-2">
              <Badge color="yellow">Large System — Battery locked to 2× PW3</Badge>
            </div>
          )}
        </div>

        <Select
          label="Panel Type"
          value={state.panelType}
          onChange={v => update('panelType', v)}
          options={panelTypeOptions}
        />
      </div>

      {/* System size callout */}
      <div className="mt-2 rounded-xl bg-[#0b2e83]/20 border border-[#0b2e83]/30 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#64748b]">Calculated System Size</p>
          <p className="text-xl font-mono font-semibold text-[#f8fafc] mt-0.5">{fmt.kw(sysSize)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-[#64748b]">Total Watts</p>
          <p className="text-lg font-mono text-[#94a3b8]">{(state.panels * 410).toLocaleString()} W</p>
        </div>
      </div>
    </SectionCard>
  );
}
