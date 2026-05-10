import React, { useState } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { fmt } from '../../utils/format';
import { generatePDF } from '../../utils/pdfExport';
import { PRODUCTS, LOCATIONS } from '../../config';

export function HistoryPanel({ onClose, onLoad }) {
  const { history, deleteQuote, clearHistory } = useHistory();
  const [confirmClear, setConfirmClear] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = history.filter(q =>
    q.clientName.toLowerCase().includes(search.toLowerCase()) ||
    PRODUCTS[q.state.product]?.label.toLowerCase().includes(search.toLowerCase())
  );

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('es-PR', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-2xl bg-[#1e293b] border border-[#2d3f55] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        <div className="h-1 w-full bg-gradient-to-r from-[#0b2e83] via-[#f4b63f] to-[#0b2e83]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3f55]">
          <div>
            <h2 className="font-display font-bold text-lg text-[#f8fafc]">Historial de Cotizaciones</h2>
            <p className="text-xs text-[#64748b] mt-0.5">{history.length} cotizaciones guardadas</p>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs text-[#ef4444] hover:text-red-300 border border-red-900/40 rounded-full px-3 py-1 transition-colors"
              >
                Limpiar
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#374151] hover:bg-[#4b5563] flex items-center justify-center text-[#94a3b8] transition-colors">✕</button>
          </div>
        </div>

        {/* Confirm clear */}
        {confirmClear && (
          <div className="mx-6 mt-4 rounded-xl bg-red-900/20 border border-red-700/40 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-red-400">¿Borrar todo el historial?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmClear(false)} className="text-xs text-[#94a3b8] hover:text-white px-3 py-1 rounded-lg border border-[#4b5563]">Cancelar</button>
              <button onClick={() => { clearHistory(); setConfirmClear(false); }} className="text-xs text-white bg-red-700 hover:bg-red-600 px-3 py-1 rounded-lg">Borrar</button>
            </div>
          </div>
        )}

        {/* Search */}
        {history.length > 0 && (
          <div className="px-6 pt-4">
            <input
              type="text"
              placeholder="Buscar por nombre o producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm bg-[#374151] border border-[#4b5563] text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0b2e83]"
            />
          </div>
        )}

        {/* List */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-[#64748b] text-sm">
                {history.length === 0 ? 'No hay cotizaciones guardadas' : 'Sin resultados'}
              </p>
              {history.length === 0 && (
                <p className="text-[#4b5563] text-xs mt-1">Guarda una cotización desde el modal de resumen</p>
              )}
            </div>
          ) : (
            filtered.map(quote => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onLoad={() => { onLoad(quote); onClose(); }}
                onDelete={() => deleteQuote(quote.id)}
                onPDF={() => generatePDF(quote.state, quote.results, quote.clientName)}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function QuoteCard({ quote, onLoad, onDelete, onPDF, formatDate }) {
  const [expanded, setExpanded] = useState(false);
  const product  = PRODUCTS[quote.state.product]?.label ?? quote.state.product;
  const location = LOCATIONS[quote.state.location]?.label ?? quote.state.location;

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#2d3f55] overflow-hidden">
      {/* Top row */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#1a2740] transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0b2e83]/30 flex items-center justify-center text-sm">☀️</div>
          <div>
            <p className="text-sm font-medium text-[#f8fafc]">{quote.clientName}</p>
            <p className="text-[10px] text-[#64748b]">{product} · {quote.state.panels} paneles · {location}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono font-bold text-[#f4b63f]">{fmt.currency(quote.results.finalCommission)}</p>
          <p className="text-[9px] text-[#4b5563]">{formatDate(quote.savedAt)}</p>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[#2d3f55] px-4 py-3 space-y-2 animate-fade-in">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Sistema', value: fmt.kw(quote.results.systemSizeKW) },
              { label: 'Total Sistema', value: fmt.currency(quote.results.systemTotal) },
              { label: 'Comisión Base', value: fmt.currency(quote.results.baseCommission) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#1e293b] rounded-xl p-2">
                <p className="text-[9px] text-[#64748b] uppercase tracking-wider">{label}</p>
                <p className="text-xs font-mono text-[#f8fafc] mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onLoad}
              className="flex-1 text-xs py-2 rounded-xl bg-[#0b2e83]/40 hover:bg-[#0b2e83]/70 text-[#60a5fa] border border-[#0b2e83]/40 transition-colors"
            >
              📂 Cargar
            </button>
            <button
              onClick={onPDF}
              className="flex-1 text-xs py-2 rounded-xl bg-[#f4b63f]/20 hover:bg-[#f4b63f]/30 text-[#f4b63f] border border-[#f4b63f]/30 transition-colors"
            >
              📄 PDF
            </button>
            <button
              onClick={onDelete}
              className="flex-1 text-xs py-2 rounded-xl bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 transition-colors"
            >
              🗑 Borrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
