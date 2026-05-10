import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext(null);
const STORAGE_KEY = 'sun_solutions_history';

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(loadHistory);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);

  function saveQuote(state, results, clientName = '') {
    const quote = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      clientName: clientName || 'Sin nombre',
      state: { ...state },
      results: { ...results },
    };
    setHistory(prev => [quote, ...prev].slice(0, 50)); // keep last 50
    return quote;
  }

  function deleteQuote(id) {
    setHistory(prev => prev.filter(q => q.id !== id));
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <HistoryContext.Provider value={{ history, saveQuote, deleteQuote, clearHistory, historyOpen, setHistoryOpen }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be inside HistoryProvider');
  return ctx;
}
