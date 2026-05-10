import React from 'react';
import { SectionCard, StatCard, Divider, InfoRow } from '../ui';
import { fmt } from '../../utils/format';

export function Results({ results, state }) {
  const {
    systemSizeKW,
    panelEPC,
    batteryTotal,
    expansionTotal,
    roofAdder,
    locationAdder,
    electricalAdder,
    lowFICOAdder,
    systemTotal,
    baseCommission,
    overridePct,
    overrideBonus,
    soldTotal,
    excedente,
    finalCommission,
    lightreachPayment,
  } = results;

  return (
    <SectionCard title="Results" icon="📊">

      {/* System breakdown */}
      <Divider label="System Costs" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="System Size" value={fmt.kw(systemSizeKW)} />
        <StatCard label="Panel EPC" value={fmt.currency(panelEPC)} sub="Commissionable" accent />
        <StatCard label="Battery Total" value={fmt.currency(batteryTotal)} sub="Not commissionable" />
        <StatCard label="Expansion Total" value={fmt.currency(expansionTotal)} sub="Not commissionable" />
        <StatCard label="Roof Adder" value={fmt.currency(roofAdder)} muted />
        <StatCard label="Location Adder" value={fmt.currency(locationAdder)} muted />
        <StatCard label="Electrical Adder" value={fmt.currency(electricalAdder)} />
        <StatCard label="Low FICO Adder" value={fmt.currency(lowFICOAdder)} />
        <StatCard label="System Total" value={fmt.currency(systemTotal)} accent />
      </div>

      {/* LightReach monthly payment */}
      {state.product === 'lightreach' && lightreachPayment !== null && (
        <>
          <Divider label="LightReach Estimate" />
          <div className="rounded-xl bg-[#1a2740] border border-[#2d3f55] px-4 py-3">
            <p className="text-[9px] uppercase tracking-widest text-[#64748b] mb-1">Est. Monthly Payment</p>
            <p className="text-2xl font-mono font-bold text-[#f4b63f]">{fmt.currency(lightreachPayment)}<span className="text-sm text-[#94a3b8] font-normal">/mo</span></p>
            <p className="text-[10px] text-[#64748b] mt-1">Based on {fmt.kw(systemSizeKW)} — interpolated from pricing table</p>
          </div>
        </>
      )}

      {/* Commission breakdown */}
      <Divider label="Commission" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          label="Base Commission"
          value={fmt.currency(baseCommission)}
          sub={`${state.commissionPct}% × Panel EPC`}
          accent
        />
        <StatCard label="Override %" value={fmt.pct(overridePct)} />
        <StatCard label="Override Bonus" value={fmt.currency(overrideBonus)} sub="Excedente × Override%" />
        <StatCard label="Sold Total" value={fmt.currency(soldTotal)} />
        <StatCard label="Excedente" value={fmt.currency(excedente)} warn={excedente < 0} />
      </div>

      {/* Final Commission — highlighted */}
      <div className="mt-2">
        <div className="rounded-2xl border-2 border-[#f4b63f]/50 bg-gradient-to-br from-[#0b2e83]/50 via-[#1e293b] to-[#f4b63f]/10 p-5 flex items-center justify-between shadow-xl shadow-[#f4b63f]/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#94a3b8]">Final Commission</p>
            <p className="text-[9px] text-[#64748b] mt-0.5">Base + Override Bonus</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-mono font-bold text-[#f4b63f]">{fmt.currency(finalCommission)}</p>
            {finalCommission > 0 && (
              <p className="text-[10px] text-[#94a3b8] mt-0.5 font-body">
                {fmt.pct((finalCommission / systemTotal) * 100)} of system
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Full breakdown table */}
      <div className="mt-3 rounded-xl bg-[#111827] border border-[#2d3f55] px-4 py-3">
        <p className="text-[9px] uppercase tracking-widest text-[#4b5563] mb-2">Full Breakdown</p>
        <InfoRow label="Panels" value={`${state.panels} × QCells 410W`} />
        <InfoRow label="System Size" value={fmt.kw(systemSizeKW)} />
        <InfoRow label="Panel EPC Rate" value="$2.50/W" />
        <InfoRow label="Panel EPC (commissionable)" value={fmt.currency(panelEPC)} />
        <InfoRow label="Commission %" value={fmt.pct(state.commissionPct)} />
        <InfoRow label="Base Commission" value={fmt.currency(baseCommission)} />
        <InfoRow label="Sold PPW" value={state.soldPPW ? fmt.ppw(state.soldPPW) : '—'} />
        <InfoRow label="Sold Total" value={fmt.currency(soldTotal)} />
        <InfoRow label="System Total" value={fmt.currency(systemTotal)} />
        <InfoRow label="Excedente" value={fmt.currency(excedente)} />
        <InfoRow label="Override %" value={fmt.pct(overridePct)} />
        <InfoRow label="Override Bonus" value={fmt.currency(overrideBonus)} />
        <InfoRow label="Final Commission" value={fmt.currency(finalCommission)} />
      </div>
    </SectionCard>
  );
}
