import React, { useState } from 'react';
import { fmt } from '../../utils/format';
import { generatePDF } from '../../utils/pdfExport';
import { PRODUCTS, LOCATIONS, POSITION_COMMISSION_RULES } from '../../config';
import { calcCommissionByPosition } from '../../utils/commissions';

export function QuoteSummaryModal({ state, results, onClose, onSave }) {
  const [clientName, setClientName] = useState('');
  const [saved, setSaved] = useState(false);

  const product  = PRODUCTS[state.product]?.label ?? state.product;
  const location = LOCATIONS[state.location]?.label ?? state.location;
  const posRules = POSITION_COMMISSION_RULES[state.sellerPosition];
  const posData  = calcCommissionByPosition(
    state.sellerPosition, results.baseCommission, results.overrideBonus
  );

  function handleSave() {
    onSave(clientName);
    setSaved(true);
  }

  function handlePDF() {
    generatePDF(state, results, clientName, posData);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-2xl bg-[#1e293b] border border-[#2d3f55] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[92vh] flex flex-col">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#0b2e83] via-[#f4b63f] to-[#0b2e83]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3f55]">
          <div>
            <h2 className="font-display font-bold text-lg text-[#f8fafc]">Resumen de Cotización</h2>
            <p className="text-xs text-[#64748b] font-body mt-0.5">{product} · {location} · {state.panels} paneles</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#374151] hover:bg-[#4b5563] flex items-center justify-center text-[#94a3b8] transition-colors">
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

          {/* Client name */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#64748b] mb-1.5">
              Nombre del Cliente
            </label>
            <input
              type="text"
              placeholder="Ej: Juan García"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm bg-[#374151] border border-[#4b5563] text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0b2e83]"
            />
          </div>

          {/* Position badge */}
          <div className="flex items-center gap-2 rounded-xl bg-[#111827] border border-[#2d3f55] px-4 py-3">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: posRules?.color }} />
            <div>
              <p className="text-sm font-medium text-[#f8fafc]">{posRules?.label}</p>
              <p className="text-[10px] text-[#64748b]">{posRules?.description}</p>
            </div>
          </div>

          {/* System summary grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Sistema', value: fmt.kw(results.systemSizeKW) },
              { label: 'Paneles', value: state.panels },
              { label: 'Batería', value: state.batteryType === 'none' ? 'N/A' : `${state.batteryCount}× PW3` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-[#111827] border border-[#2d3f55] p-3 text-center">
                <p className="text-[9px] uppercase tracking-widest text-[#64748b]">{label}</p>
                <p className="text-sm font-mono font-medium text-[#f8fafc] mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Cost breakdown */}
          <div className="rounded-xl bg-[#111827] border border-[#2d3f55] overflow-hidden">
            <div className="px-4 py-2 border-b border-[#2d3f55]">
              <p className="text-[9px] uppercase tracking-widest text-[#64748b]">Desglose de Costos</p>
            </div>
            <div className="px-4 py-2 divide-y divide-[#1e293b]">
              <Row label="Panel EPC" value={fmt.currency(results.panelEPC)} accent />
              {results.batteryTotal > 0 && <Row label="Baterías" value={fmt.currency(results.batteryTotal)} />}
              {results.expansionTotal > 0 && <Row label="Expansiones" value={fmt.currency(results.expansionTotal)} />}
              {results.electricalAdder > 0 && <Row label="Eléctrico" value={fmt.currency(results.electricalAdder)} />}
              {results.lowFICOAdder > 0 && <Row label="Low FICO" value={fmt.currency(results.lowFICOAdder)} />}
              <Row label="Total Sistema" value={fmt.currency(results.systemTotal)} bold />
            </div>
          </div>

          {/* Commission breakdown */}
          <div className="rounded-xl bg-[#111827] border border-[#2d3f55] overflow-hidden">
            <div className="px-4 py-2 border-b border-[#2d3f55]">
              <p className="text-[9px] uppercase tracking-widest text-[#64748b]">Comisión</p>
            </div>
            <div className="px-4 py-2 divide-y divide-[#1e293b]">
              <Row label="Comisión Base" value={fmt.currency(results.baseCommission)} />
              <Row label={`Bono Override (${fmt.pct(results.overridePct)})`} value={fmt.currency(results.overrideBonus)} />
              {state.sellerPosition === 'setter' && (
                <Row label="Tu parte (Setter 30%)" value={fmt.currency(posData.setterShare)} accent />
              )}
              {posData.positionBonus > 0 && (
                <Row label={`Bono ${posData.label}`} value={fmt.currency(posData.positionBonus)} accent />
              )}
              <Row label="Comisión Final" value={fmt.currency(posData.totalEarned)} bold highlight />
            </div>
          </div>

          {/* LightReach */}
          {results.lightreachPayment && (
            <div className="rounded-xl bg-[#0b2e83]/20 border border-[#0b2e83]/40 px-4 py-3 flex justify-between items-center">
              <p className="text-xs text-[#94a3b8]">Pago Mensual LightReach</p>
              <p className="text-lg font-mono font-bold text-[#f4b63f]">{fmt.currency(results.lightreachPayment)}<span className="text-xs text-[#64748b]">/mes</span></p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#2d3f55] flex gap-3">
          {!saved ? (
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-[#0b2e83] hover:bg-[#1d4ed8] text-white text-sm font-medium transition-colors"
            >
              💾 Guardar Cotización
            </button>
          ) : (
            <div className="flex-1 py-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40 text-emerald-400 text-sm font-medium text-center">
              ✓ Guardada
            </div>
          )}
          <button
            onClick={handlePDF}
            className="flex-1 py-3 rounded-xl bg-[#f4b63f] hover:bg-[#f59e0b] text-[#0f172a] text-sm font-bold transition-colors"
          >
            📄 Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold = false, accent = false, highlight = false }) {
  return (
    <div className={`flex justify-between items-center py-2 ${highlight ? 'mt-1 pt-3 border-t border-[#2d3f55]' : ''}`}>
      <span className={`text-xs font-body ${bold ? 'font-semibold text-[#f8fafc]' : 'text-[#64748b]'}`}>{label}</span>
      <span className={`text-sm font-mono ${highlight ? 'text-[#f4b63f] font-bold text-base' : accent ? 'text-[#60a5fa]' : bold ? 'text-[#f8fafc] font-semibold' : 'text-[#f8fafc]'}`}>
        {value}
      </span>
    </div>
  );
}
