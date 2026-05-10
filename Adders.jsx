import React from 'react';
import { SectionCard, Select, YesNoToggle, InfoRow } from '../ui';
import { ROOF_TYPES } from '../../config';
import { fmt } from '../../utils/format';

const roofOptions = Object.entries(ROOF_TYPES).map(([k, v]) => ({ value: k, label: v.label }));

export function Adders({ state, update, results }) {
  const totalAdders =
    results.electricalAdder + results.lowFICOAdder +
    results.roofAdder + results.locationAdder;

  return (
    <SectionCard title="Adders" icon="🔧">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Roof Type"
          hint="Pricing TBD — currently $0"
          value={state.roofType}
          onChange={v => update('roofType', v)}
          options={roofOptions}
        />

        <YesNoToggle
          label="Electrical Issues"
          hint="Adds $2,000 — not commissionable"
          value={state.electricalIssues}
          onChange={v => update('electricalIssues', v)}
        />

        <YesNoToggle
          label="Low FICO"
          hint="Adds $1,000 — not commissionable"
          value={state.lowFICO}
          onChange={v => update('lowFICO', v)}
        />
      </div>

      {totalAdders > 0 && (
        <div className="mt-3 rounded-xl bg-[#1a2740] border border-[#2d3f55] px-4 py-3 space-y-1">
          <p className="text-[9px] uppercase tracking-widest text-[#4b5563] mb-2">Adder Breakdown (not commissionable)</p>
          {results.roofAdder > 0 && (
            <InfoRow label="Roof Adder" value={fmt.currency(results.roofAdder)} />
          )}
          {results.locationAdder > 0 && (
            <InfoRow label="Location Adder" value={fmt.currency(results.locationAdder)} />
          )}
          {results.electricalAdder > 0 && (
            <InfoRow label="Electrical Issues" value={fmt.currency(results.electricalAdder)} />
          )}
          {results.lowFICOAdder > 0 && (
            <InfoRow label="Low FICO" value={fmt.currency(results.lowFICOAdder)} />
          )}
        </div>
      )}
    </SectionCard>
  );
}
