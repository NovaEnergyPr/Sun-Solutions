import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export function AdminPanel({ onClose, position }) {
  const { config, updateConfig, resetConfig } = useAdmin();
  const [tab, setTab] = useState('epc');
  const [saved, setSaved] = useState(false);

  const isDirector = position === 'director';
  const isManager  = position === 'manager' || isDirector;

  if (!isManager) {
    return (
      <Modal onClose={onClose}>
        <div className="px-6 py-12 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-[#f8fafc] font-medium">Acceso Restringido</p>
          <p className="text-[#64748b] text-sm mt-2">Solo Managers y Directores pueden acceder al panel de administración.</p>
        </div>
      </Modal>
    );
  }

  function handleChange(path, val) {
    const num = parseFloat(val);
    if (!isNaN(num)) updateConfig(path, num);
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabs = [
    { id: 'epc',       label: 'Tarifas EPC' },
    { id: 'battery',   label: 'Baterías' },
    { id: 'adders',    label: 'Adders' },
    { id: 'location',  label: 'Ubicaciones' },
  ];

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3f55]">
        <div>
          <h2 className="font-display font-bold text-lg text-[#f8fafc]">Panel de Administrador</h2>
          <p className="text-xs text-[#64748b] mt-0.5">Editar precios sin tocar el código</p>
        </div>
        <div className="flex items-center gap-2">
          {isDirector && (
            <button
              onClick={() => { resetConfig(); setSaved(false); }}
              className="text-xs text-[#ef4444] hover:text-red-300 border border-red-900/40 hover:border-red-700/60 rounded-full px-3 py-1 transition-colors"
            >
              Reset
            </button>
          )}
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#374151] hover:bg-[#4b5563] flex items-center justify-center text-[#94a3b8] transition-colors">✕</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-xs px-3 py-1.5 rounded-full transition-all ${
              tab === t.id
                ? 'bg-[#0b2e83] text-white'
                : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-4 space-y-3 overflow-y-auto max-h-[50vh]">
        {tab === 'epc' && (
          <>
            <SectionTitle>Tarifas EPC por Producto ($/W)</SectionTitle>
            <AdminField label="Sunrun EPC Rate" value={config.epcRates.sunrun} onChange={v => handleChange('epcRates.sunrun', v)} prefix="$" suffix="/W" />
            <AdminField label="LightReach EPC Rate" value={config.epcRates.lightreach} onChange={v => handleChange('epcRates.lightreach', v)} prefix="$" suffix="/W" />
            <AdminField label="Cash / Financing EPC Rate" value={config.epcRates.cash} onChange={v => handleChange('epcRates.cash', v)} prefix="$" suffix="/W" />
          </>
        )}

        {tab === 'battery' && (
          <>
            <SectionTitle>Precios de Baterías</SectionTitle>
            <AdminField label="1× PW3 Hybrid" value={config.batteryPrices.pw3_1} onChange={v => handleChange('batteryPrices.pw3_1', v)} prefix="$" />
            <AdminField label="2× PW3 Hybrid" value={config.batteryPrices.pw3_2} onChange={v => handleChange('batteryPrices.pw3_2', v)} prefix="$" />
            <AdminField label="Batería de Expansión (c/u)" value={config.expansionPrice} onChange={v => handleChange('expansionPrice', v)} prefix="$" />
          </>
        )}

        {tab === 'adders' && (
          <>
            <SectionTitle>Adders</SectionTitle>
            <AdminField label="Problemas Eléctricos" value={config.electricalAdder} onChange={v => handleChange('electricalAdder', v)} prefix="$" />
            <AdminField label="Low FICO" value={config.lowFICOAdder} onChange={v => handleChange('lowFICOAdder', v)} prefix="$" />
            <SectionTitle>Techo</SectionTitle>
            <AdminField label="Cemento" value={config.roofAdders.cemento} onChange={v => handleChange('roofAdders.cemento', v)} prefix="$" />
            <AdminField label="Galvalum" value={config.roofAdders.galvalum} onChange={v => handleChange('roofAdders.galvalum', v)} prefix="$" />
          </>
        )}

        {tab === 'location' && (
          <>
            <SectionTitle>Adders por Ubicación</SectionTitle>
            <AdminField label="Puerto Rico" value={config.locationAdders.puerto_rico} onChange={v => handleChange('locationAdders.puerto_rico', v)} prefix="$" />
            <AdminField label="Vieques" value={config.locationAdders.vieques} onChange={v => handleChange('locationAdders.vieques', v)} prefix="$" />
            <AdminField label="Culebra" value={config.locationAdders.culebra} onChange={v => handleChange('locationAdders.culebra', v)} prefix="$" />
          </>
        )}
      </div>

      <div className="px-6 py-4 border-t border-[#2d3f55]">
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
            saved
              ? 'bg-emerald-900/40 border border-emerald-700/40 text-emerald-400'
              : 'bg-[#f4b63f] hover:bg-[#f59e0b] text-[#0f172a]'
          }`}
        >
          {saved ? '✓ Cambios Guardados' : 'Guardar Cambios'}
        </button>
        <p className="text-[9px] text-[#4b5563] text-center mt-2">Los cambios se guardan en el navegador y se aplican inmediatamente</p>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-[#1e293b] border border-[#2d3f55] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="h-1 w-full bg-gradient-to-r from-[#0b2e83] via-[#f4b63f] to-[#0b2e83]" />
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="text-[9px] uppercase tracking-widest text-[#4b5563] pt-2">{children}</p>
  );
}

function AdminField({ label, value, onChange, prefix, suffix }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-[#111827] border border-[#2d3f55] rounded-xl px-4 py-3">
      <label className="text-xs text-[#94a3b8] flex-1">{label}</label>
      <div className="flex items-center gap-1.5">
        {prefix && <span className="text-xs text-[#64748b] font-mono">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          step="0.01"
          className="w-24 bg-[#374151] border border-[#4b5563] rounded-lg px-3 py-1.5 text-sm font-mono text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0b2e83] text-right"
        />
        {suffix && <span className="text-xs text-[#64748b] font-mono">{suffix}</span>}
      </div>
    </div>
  );
}
