import { getPosition, SELLER_POSITIONS } from '../config';

/**
 * Get commission % for a position
 */
export function getCommissionPct(positionValue) {
  return getPosition(positionValue).commissionPct;
}

/**
 * Get override % for a position
 */
export function getOverridePct(positionValue) {
  return getPosition(positionValue).overridePct;
}

/**
 * Get differential % between two positions
 * (how much the higher position earns on top of the lower on team deals)
 */
export function getDifferential(higherPosition, lowerPosition) {
  const higher = getPosition(higherPosition);
  const lower  = getPosition(lowerPosition);
  return Math.max(0, higher.commissionPct - lower.commissionPct);
}

/**
 * Calculate differential commission earned by a manager on a rep's deal
 * Future feature — architecture ready
 */
export function calcDifferentialCommission(managerPosition, repPosition, panelEPC) {
  const diff = getDifferential(managerPosition, repPosition);
  return panelEPC * (diff / 100);
}

/**
 * Full commission breakdown for a position on a deal
 */
export function calcCommissionByPosition(positionValue, baseCommission, overrideBonus) {
  const pos = getPosition(positionValue);
  return {
    position:       positionValue,
    label:          pos.label,
    color:          pos.color,
    commissionPct:  pos.commissionPct,
    overridePct:    pos.overridePct,
    baseCommission,
    overrideBonus,
    finalCommission: baseCommission + overrideBonus,
    totalEarned:    baseCommission + overrideBonus,
    differential:   pos.differential,
    description:    pos.description,
  };
}

/**
 * Clamp commission to position's fixed value
 * (positions now have a single locked commission %)
 */
export function clampCommissionForPosition(commission, positionValue) {
  const pos = getPosition(positionValue);
  return pos.commissionPct;
}
