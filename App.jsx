import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { HistoryProvider, useHistory } from './context/HistoryContext';
import { Header } from './components/Header';
import { GeneralInfo } from './components/sections/GeneralInfo';
import { Panels } from './components/sections/Panels';
import { Storage } from './components/sections/Storage';
import { Adders } from './components/sections/Adders';
import { Sales } from './components/sections/Sales';
import { Results } from './components/sections/Results';
import { PositionCommission } from './components/sections/PositionCommission';
import { QuoteSummaryModal } from './components/modals/QuoteSummaryModal';
import { HistoryPanel } from './components/modals/HistoryPanel';
import { AdminPanel } from './components/admin/AdminPanel';
import { useQuoteState } from './hooks/useQuoteState';

function AppInner() {
  const { config } = useAdmin();
  const { saveQuote, historyOpen, setHistoryOpen } = useHistory();
  const { state, update, reset, loadQuote, results, batteryLocked, maxExp, position } = useQuoteState(config);

  const [showSummary, setShowSummary] = useState(false);
  const [showAdmin, setShowAdmin]     = useState(false);

  function handleSaveQuote(clientName) {
    saveQuote(state, results, clientName);
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-body">
      <Header
        onSummary={() => setShowSummary(true)}
        onHistory={() => setHistoryOpen(true)}
        onAdmin={() => setShowAdmin(true)}
        sellerPosition={state.sellerPosition}
        position={position}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="flex justify-end">
          <button
            onClick={reset}
            className="text-xs font-body text-[#64748b] hover:text-[#94a3b8] border border-[#2d3f55] hover:border-[#4b5563] rounded-full px-4 py-1.5 transition-all duration-150"
          >
            Nueva Cotización
          </button>
        </div>

        <GeneralInfo state={state} update={update} position={position} />
        <Panels state={state} update={update} />
        <Storage state={state} update={update} batteryLocked={batteryLocked} maxExp={maxExp} />
        <Adders state={state} update={update} results={results} />
        <Sales state={state} update={update} results={results} position={position} />
        <PositionCommission state={state} results={results} position={position} />
        <Results results={results} state={state} />

        <div className="flex gap-3 pb-4">
          <button
            onClick={() => setShowSummary(true)}
            className="flex-1 py-4 rounded-2xl bg-[#f4b63f] hover:bg-[#fbbf24] text-[#0f172a] font-bold text-sm transition-all duration-150 shadow-lg shadow-[#f4b63f]/20"
          >
            📄 Ver Resumen y Exportar PDF
          </button>
        </div>

        <div className="text-center py-4 text-[10px] text-[#334155] font-body tracking-widest uppercase">
          Sun Solutions © 2026 — Quotes & Commissions Engine
        </div>
      </main>

      {showSummary && (
        <QuoteSummaryModal
          state={state}
          results={results}
          position={position}
          onClose={() => setShowSummary(false)}
          onSave={handleSaveQuote}
        />
      )}
      {historyOpen && (
        <HistoryPanel
          onClose={() => setHistoryOpen(false)}
          onLoad={(quote) => { loadQuote(quote.state); setHistoryOpen(false); }}
        />
      )}
      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          position={state.sellerPosition}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <HistoryProvider>
        <AppInner />
      </HistoryProvider>
    </AdminProvider>
  );
}
