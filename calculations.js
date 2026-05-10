import {
  PANEL_WATTAGE,
  PRODUCTS,
  BATTERY_CONFIG,
  EXPANSION_CONFIG,
  OVERRIDE_TABLE,
  COMMISSION_MIN,
  COMMISSION_MAX,
  LARGE_SYSTEM_THRESHOLD,
  LARGE_SYSTEM_FORCED_BATTERIES,
  LIGHTREACH_PAYMENT_TABLE,
  LOCATIONS,
  ROOF_TYPES,
  ADDERS,
  PANEL_RULES,
} from '../config';

// ── System Size ──────────────────────────────────────────────
export function calcSystemSize(panels, wattage = PANEL_WATTAGE) {
  return (panels * wattage) / 1000; // kW
}

// ── Panel EPC (commissionable base) ─────────────────────────
export function calcPanelEPC(panels, product = 'sunrun') {
  const rate = PRODUCTS[product]?.epcRate ?? 2.50;
  return panels * PANEL_WATTAGE * rate;
}

// ── Battery Total (NOT commissionable) ──────────────────────
export function calcBatteryTotal(batteryType, batteryCount) {
  if (!batteryType || batteryType === 'none') return 0;
  const cfg = BATTERY_CONFIG.pw3_hybrid;
  return cfg.pricePerUnit[batteryCount] ?? 0;
}

// ── Expansion Total (NOT commissionable) ────────────────────
export function calcExpansionTotal(count) {
  return count * EXPANSION_CONFIG.priceEach;
}

// ── Roof Adder ───────────────────────────────────────────────
export function calcRoofAdder(roofType) {
  return ROOF_TYPES[roofType]?.adder ?? 0;
}

// ── Location Adder ───────────────────────────────────────────
export function calcLocationAdder(location) {
  return LOCATIONS[location]?.adder ?? 0;
}

// ── Electrical Adder ─────────────────────────────────────────
export function calcElectricalAdder(hasIssues) {
  return hasIssues ? ADDERS.electrical_issues.price : 0;
}

// ── Low FICO Adder ───────────────────────────────────────────
export function calcLowFICOAdder(hasLowFICO) {
  return hasLowFICO ? ADDERS.low_fico.price : 0;
}

// ── Override Percentage ──────────────────────────────────────
// Works for all positions: 6%→30%, each point = +5%
export function calcOverridePct(commissionPct) {
  const pct = Number(commissionPct);
  // Universal formula: commission% × 5 works for 6→30, 12→60...
  // But 12×5=60, 13×5=65... matches table exactly up to 17→85
  if (pct <= 12) return pct * 5;
  return 60 + (pct - 12) * 5;
}

// ── Clamp commission to valid range ─────────────────────────
export function clampCommission(val) {
  const n = Number(val);
  if (isNaN(n)) return COMMISSION_MIN;
  return Math.min(COMMISSION_MAX, Math.max(COMMISSION_MIN, n));
}

// ── Panel count validation ───────────────────────────────────
export function resolvePanelCount(raw) {
  const n = Number(raw);
  if (n >= PANEL_RULES.blockedMin && n <= PANEL_RULES.blockedMax) {
    return PANEL_RULES.jumpTo;
  }
  return n;
}

export function isPanelCountBlocked(n) {
  return n >= PANEL_RULES.blockedMin && n <= PANEL_RULES.blockedMax;
}

// ── Battery rules for large systems ─────────────────────────
export function resolveBatteryForPanels(panels, currentBatteryType, currentBatteryCount) {
  if (panels >= LARGE_SYSTEM_THRESHOLD) {
    return {
      batteryType: 'pw3_hybrid',
      batteryCount: LARGE_SYSTEM_FORCED_BATTERIES,
      locked: true,
    };
  }
  return {
    batteryType: currentBatteryType,
    batteryCount: currentBatteryCount,
    locked: false,
  };
}

// ── Max expansions ───────────────────────────────────────────
export function maxExpansions(panels) {
  if (panels >= LARGE_SYSTEM_THRESHOLD) return EXPANSION_CONFIG.maxForLargeSystem;
  return EXPANSION_CONFIG.maxForSmallSystem;
}

// ── LightReach estimated payment ────────────────────────────
export function getLightReachPayment(systemSizeKW) {
  const keys = Object.keys(LIGHTREACH_PAYMENT_TABLE).map(Number).sort((a, b) => a - b);
  const rounded = parseFloat(systemSizeKW.toFixed(2));

  // Exact match
  if (LIGHTREACH_PAYMENT_TABLE[String(rounded)] !== undefined) {
    return LIGHTREACH_PAYMENT_TABLE[String(rounded)];
  }

  // Interpolate between nearest brackets
  let lower = null, upper = null;
  for (const k of keys) {
    if (k <= rounded) lower = k;
    if (k >= rounded && upper === null) upper = k;
  }
  if (lower === null) return LIGHTREACH_PAYMENT_TABLE[String(keys[0])];
  if (upper === null) return LIGHTREACH_PAYMENT_TABLE[String(keys[keys.length - 1])];
  if (lower === upper) return LIGHTREACH_PAYMENT_TABLE[String(lower)];

  const t = (rounded - lower) / (upper - lower);
  const lv = LIGHTREACH_PAYMENT_TABLE[String(lower)];
  const uv = LIGHTREACH_PAYMENT_TABLE[String(upper)];
  return Math.round(lv + t * (uv - lv));
}

// ── Full Calculation Engine ──────────────────────────────────
// adminConfig: optional runtime overrides from AdminContext
export function calculateAll(state, adminConfig = null) {
  const {
    product,
    panels,
    batteryType,
    batteryCount,
    expansionCount,
    roofType,
    location,
    electricalIssues,
    lowFICO,
    commissionPct,
    soldPPW,
  } = state;

  const systemSizeKW = calcSystemSize(panels);
  const systemSizeW  = panels * PANEL_WATTAGE;

  // Apply admin overrides to EPC rate if available
  const epcRate = adminConfig?.epcRates?.[product]
    ?? PRODUCTS[product]?.epcRate
    ?? 2.50;
  const panelEPC = panels * PANEL_WATTAGE * epcRate;

  // Battery with admin overrides
  let batteryTotal = 0;
  if (batteryType && batteryType !== 'none') {
    if (adminConfig?.batteryPrices) {
      batteryTotal = batteryCount === 1
        ? adminConfig.batteryPrices.pw3_1
        : adminConfig.batteryPrices.pw3_2;
    } else {
      batteryTotal = calcBatteryTotal(batteryType, batteryCount);
    }
  }

  // Expansion with admin override
  const expansionPrice = adminConfig?.expansionPrice ?? EXPANSION_CONFIG.priceEach;
  const expansionTotal = expansionCount * expansionPrice;

  // Roof adder with admin override
  const roofAdder = adminConfig?.roofAdders?.[roofType]
    ?? ROOF_TYPES[roofType]?.adder
    ?? 0;

  // Location adder with admin override
  const locationAdder = adminConfig?.locationAdders?.[location]
    ?? LOCATIONS[location]?.adder
    ?? 0;

  // Electrical / FICO with admin override
  const electricalAdder = electricalIssues
    ? (adminConfig?.electricalAdder ?? ADDERS.electrical_issues.price)
    : 0;
  const lowFICOAdder = lowFICO
    ? (adminConfig?.lowFICOAdder ?? ADDERS.low_fico.price)
    : 0;

  const systemTotal =
    panelEPC + batteryTotal + expansionTotal +
    roofAdder + locationAdder + electricalAdder + lowFICOAdder;

  const baseCommission = panelEPC * (commissionPct / 100);
  const overridePct    = calcOverridePct(commissionPct);

  const soldTotal     = systemSizeW * (parseFloat(soldPPW) || 0);
  const excedente     = soldTotal - systemTotal;
  const overrideBonus = excedente > 0 ? excedente * (overridePct / 100) : 0;
  const finalCommission = baseCommission + overrideBonus;

  const lightreachPayment =
    product === 'lightreach' ? getLightReachPayment(systemSizeKW) : null;

  return {
    systemSizeKW,
    systemSizeW,
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
    epcRate,
  };
}
