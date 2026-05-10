import { useState, useMemo, useCallback } from 'react';
import {
  resolvePanelCount,
  resolveBatteryForPanels,
  maxExpansions,
  calculateAll,
} from '../utils/calculations';
import { getPosition } from '../config';
import { PANEL_RULES } from '../config';

const DEFAULTS = {
  product:          'sunrun',
  projectType:      'residential_sunrun',
  sellerPosition:   'solar_consultant',  // default = Solar Consultant = 12%
  pricingVersion:   '2026-Q1',
  location:         'puerto_rico',
  panels:           10,
  panelType:        'qcells_410',
  batteryType:      'none',
  batteryCount:     1,
  expansionCount:   0,
  roofType:         'cemento',
  electricalIssues: false,
  lowFICO:          false,
  soldPPW:          '',
};

export function useQuoteState(adminConfig = null) {
  const [state, setState] = useState(() => {
    const pos = getPosition(DEFAULTS.sellerPosition);
    return { ...DEFAULTS, commissionPct: pos.commissionPct };
  });

  const update = useCallback((key, value) => {
    setState(prev => {
      let next = { ...prev, [key]: value };

      // Panel count rules
      if (key === 'panels') {
        const resolved = resolvePanelCount(value);
        next.panels = resolved;
        const { batteryType, batteryCount } = resolveBatteryForPanels(
          resolved, next.batteryType, next.batteryCount
        );
        next.batteryType  = batteryType;
        next.batteryCount = batteryCount;
        const maxExp = maxExpansions(resolved);
        if (next.expansionCount > maxExp) next.expansionCount = maxExp;
      }

      if (key === 'batteryType' && value === 'none') next.batteryCount = 1;

      // Product → project type sync
      if (key === 'product') {
        const map = {
          sunrun:     'residential_sunrun',
          lightreach: 'residential_lightreach',
          cash:       'cash_financiamiento',
        };
        next.projectType = map[value] ?? next.projectType;
      }

      // Position change → auto-set commission % from position config
      if (key === 'sellerPosition') {
        const pos = getPosition(value);
        next.commissionPct = pos.commissionPct;
      }

      return next;
    });
  }, []);

  const loadQuote = useCallback((savedState) => {
    setState(prev => ({ ...prev, ...savedState }));
  }, []);

  const reset = useCallback(() => {
    const pos = getPosition(DEFAULTS.sellerPosition);
    setState({ ...DEFAULTS, commissionPct: pos.commissionPct });
  }, []);

  const results = useMemo(() => calculateAll(state, adminConfig), [state, adminConfig]);

  const batteryLocked = state.panels >= 44;
  const maxExp = maxExpansions(state.panels);

  // Current position object with all rules
  const position = getPosition(state.sellerPosition);

  return { state, update, reset, loadQuote, results, batteryLocked, maxExp, position };
}
