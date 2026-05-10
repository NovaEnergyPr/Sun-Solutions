export const fmt = {
  currency: (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n ?? 0),

  currencyFull: (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0),

  pct: (n) => `${(n ?? 0).toFixed(0)}%`,

  kw: (n) => `${(n ?? 0).toFixed(2)} kW`,

  ppw: (n) => `$${parseFloat(n || 0).toFixed(3)}/W`,
};
