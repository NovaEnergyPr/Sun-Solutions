// ============================================================
// SUN SOLUTIONS — CENTRAL CONFIGURATION
// All prices, rules, and tables live here.
// Update this file to change pricing without touching components.
// ============================================================

export const PANEL_WATTAGE = 410; // Watts per panel

// ── Products / Programs ─────────────────────────────────────
export const PRODUCTS = {
  sunrun: {
    id: 'sunrun',
    label: 'Sunrun',
    epcRate: 2.50,          // $ per watt — commissionable base
    currency: 'USD',
    supportsMonthlyPayment: false,
    description: 'Sunrun Power Purchase Agreement',
  },
  lightreach: {
    id: 'lightreach',
    label: 'LightReach',
    epcRate: 2.50,
    currency: 'USD',
    supportsMonthlyPayment: true,
    description: 'LightReach Lease Program',
  },
  cash: {
    id: 'cash',
    label: 'Cash / Financing',
    epcRate: 2.50,
    currency: 'USD',
    supportsMonthlyPayment: false,
    description: 'Cash Purchase or Third-Party Financing',
  },
};

// ── Project Types ────────────────────────────────────────────
export const PROJECT_TYPES = [
  { value: 'residential_sunrun',     label: 'Residencial Sunrun' },
  { value: 'residential_lightreach', label: 'Residencial LightReach' },
  { value: 'cash_financiamiento',    label: 'Cash / Financiamiento' },
];

// ── Pricing Versions ─────────────────────────────────────────
export const PRICING_VERSIONS = [
  { value: '2026-Q1', label: '2026-Q1' },
  { value: '2026-Q2', label: '2026-Q2' },
  { value: '2026-Q3', label: '2026-Q3' },
];

// ── Locations & Adders ───────────────────────────────────────
export const LOCATIONS = {
  puerto_rico: { label: 'Puerto Rico', adder: 0 },
  vieques:     { label: 'Vieques',     adder: 0 }, // update when pricing is available
  culebra:     { label: 'Culebra',     adder: 0 }, // update when pricing is available
};

// ── Panel Types ──────────────────────────────────────────────
export const PANEL_TYPES = [
  { value: 'qcells_410', label: 'QCells 410', wattage: 410 },
];

// ── Battery Pricing ──────────────────────────────────────────
// NOT commissionable
export const BATTERY_CONFIG = {
  none: { label: 'None', price: 0, count: 0 },
  pw3_hybrid: {
    label: 'PW3 Hybrid',
    pricePerUnit: {
      1: 10500,
      2: 20000,
    },
  },
};

// Panels >= 44 force 2x PW3 Hybrid (locked)
export const LARGE_SYSTEM_THRESHOLD = 44;
export const LARGE_SYSTEM_FORCED_BATTERIES = 2;

// ── Expansion Battery Pricing ────────────────────────────────
// NOT commissionable
export const EXPANSION_CONFIG = {
  priceEach: 7000,
  maxForSmallSystem: 3,  // panels < 37
  maxForLargeSystem: 2,  // panels >= 44
};

// ── Roof Type Adders ─────────────────────────────────────────
// NOT commissionable — values = 0 until pricing is confirmed
export const ROOF_TYPES = {
  cemento:  { label: 'Cemento',  adder: 0 },
  galvalum: { label: 'Galvalum', adder: 0 },
};

// ── Non-Commissionable Adders ────────────────────────────────
export const ADDERS = {
  electrical_issues: {
    label: 'Electrical Issues',
    price: 2000,
    commissionable: false,
  },
  low_fico: {
    label: 'Low FICO',
    price: 1000,
    commissionable: false,
  },
};

// ── Commission Override Table ────────────────────────────────
// commission% → override% — matches SELLER_POSITIONS exactly
// Formula: commission% × 5  (6%→30, 12%→60, then +5 per point)
export const OVERRIDE_TABLE = {
  6:  30,
  7:  35,
  8:  40,
  9:  45,
  10: 50,
  11: 55,
  12: 60,
  13: 65,
  14: 70,
  15: 75,
  16: 80,
  17: 85,
};

export const COMMISSION_MIN = 6;
export const COMMISSION_MAX = 17;

// ── LightReach Mock Payment Table ────────────────────────────
// Key = system size kW (string), value = estimated monthly payment $
// Replace with real table or PDF-parsed data when available
export const LIGHTREACH_PAYMENT_TABLE = {
  '3.28': 118,
  '4.10': 148,
  '4.92': 177,
  '5.33': 194,
  '5.74': 208,
  '6.15': 221,
  '6.56': 237,
  '6.97': 251,
  '7.38': 266,
  '7.79': 281,
  '8.20': 296,
  '8.61': 311,
  '9.02': 325,
  '9.43': 340,
  '9.84': 355,
  '10.25': 370,
  '10.66': 384,
  '11.07': 399,
  '11.48': 413,
  '11.89': 428,
  '12.30': 443,
  '13.12': 472,
  '14.76': 531,
  '16.40': 590,
  '18.04': 649,
};

// ── Panel Count Rules ────────────────────────────────────────
export const PANEL_RULES = {
  min: 1,
  blockedMin: 37,
  blockedMax: 43,
  jumpTo: 44,
};

// ── Seller Positions — Commission Ladder ─────────────────────
//
// Each position has a fixed commission % and override %.
// Positions are a ladder: each level earns its own % on their deals,
// PLUS the DIFFERENTIAL (difference) between their % and the rep below
// on that rep's deals (future team feature — architecture ready).
//
// To add/remove positions or change %: edit this object only.
// Order matters — lower index = lower in hierarchy.
//
export const SELLER_POSITIONS = [
  {
    value:          'trainee',
    label:          'Trainee',
    commissionPct:  6,
    overridePct:    30,
    // Differential vs position below: N/A (bottom of ladder)
    differential:   0,
    canViewAdmin:   false,
    color:          '#94a3b8',
    description:    'Comisión 6% — Override 30%',
  },
  {
    value:          'solar_consultant',
    label:          'Solar Consultant',
    commissionPct:  12,
    overridePct:    60,
    differential:   6,   // 12% - 6% = 6% diferencial sobre Trainees
    canViewAdmin:   false,
    color:          '#60a5fa',
    description:    'Comisión 12% — Override 60%',
  },
  {
    value:          'sales_manager',
    label:          'Sales Manager',
    commissionPct:  13,
    overridePct:    65,
    differential:   1,   // 13% - 12% = 1% diferencial sobre Solar Consultants
    canViewAdmin:   false,
    color:          '#34d399',
    description:    'Comisión 13% — Override 65%',
  },
  {
    value:          'senior_sales_manager',
    label:          'Senior Sales Manager',
    commissionPct:  14,
    overridePct:    70,
    differential:   1,   // 14% - 13% = 1%
    canViewAdmin:   false,
    color:          '#a78bfa',
    description:    'Comisión 14% — Override 70%',
  },
  {
    value:          'elite_sales_manager',
    label:          'Elite Sales Manager',
    commissionPct:  15,
    overridePct:    75,
    differential:   1,   // 15% - 14% = 1%
    canViewAdmin:   true,
    color:          '#f4b63f',
    description:    'Comisión 15% — Override 75%',
  },
  {
    value:          'business_sales_manager',
    label:          'Business Sales Manager',
    commissionPct:  16,
    overridePct:    80,
    differential:   1,   // 16% - 15% = 1%
    canViewAdmin:   true,
    color:          '#fb923c',
    description:    'Comisión 16% — Override 80%',
  },
  {
    value:          'direct_sales_business',
    label:          'Direct Sales Business',
    commissionPct:  17,
    overridePct:    85,
    differential:   1,   // 17% - 16% = 1%
    canViewAdmin:   true,
    color:          '#f87171',
    description:    'Comisión 17% — Override 85%',
  },
];

// Helper — get position object by value
export function getPosition(value) {
  return SELLER_POSITIONS.find(p => p.value === value) ?? SELLER_POSITIONS[0];
}

// Keep legacy name for any imports that reference POSITION_COMMISSION_RULES
export const POSITION_COMMISSION_RULES = Object.fromEntries(
  SELLER_POSITIONS.map(p => [p.value, {
    ...p,
    minCommission: p.commissionPct,
    maxCommission: p.commissionPct,
    label: p.label,
  }])
);

// ── Admin default config (editable via Admin Panel) ──────────
// These values can be overridden by the admin at runtime
export const ADMIN_DEFAULTS = {
  epcRates: {
    sunrun:     2.50,
    lightreach: 2.50,
    cash:       2.50,
  },
  batteryPrices: {
    pw3_1: 10500,
    pw3_2: 20000,
  },
  expansionPrice: 7000,
  electricalAdder: 2000,
  lowFICOAdder: 1000,
  roofAdders: {
    cemento:  0,
    galvalum: 0,
  },
  locationAdders: {
    puerto_rico: 0,
    vieques:     0,
    culebra:     0,
  },
};
