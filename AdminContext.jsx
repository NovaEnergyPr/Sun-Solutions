import React, { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN_DEFAULTS } from '../config';

const AdminContext = createContext(null);

const STORAGE_KEY = 'sun_solutions_admin_config';

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...ADMIN_DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return { ...ADMIN_DEFAULTS };
}

export function AdminProvider({ children }) {
  const [config, setConfig] = useState(loadConfig);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  function updateConfig(path, value) {
    setConfig(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function resetConfig() {
    setConfig({ ...ADMIN_DEFAULTS });
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AdminContext.Provider value={{ config, updateConfig, resetConfig, adminOpen, setAdminOpen }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
}
