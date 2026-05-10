import { fmt } from './format';
import { PRODUCTS, LOCATIONS, ROOF_TYPES } from '../config';

/**
 * Generates a professional PDF quote by opening a styled print window.
 * No external library needed — uses browser print API.
 */
export function generatePDF(state, results, clientName = '', positionData = null) {
  const product = PRODUCTS[state.product]?.label ?? state.product;
  const location = LOCATIONS[state.location]?.label ?? state.location;
  const roofType = ROOF_TYPES[state.roofType]?.label ?? state.roofType;
  const date = new Date().toLocaleDateString('es-PR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const quoteId = `SS-${Date.now().toString().slice(-6)}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Cotización ${quoteId} — Sun Solutions</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: #fff; color: #0f172a; font-size: 13px; }

    .page { max-width: 800px; margin: 0 auto; padding: 40px 48px; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; padding-bottom: 20px; border-bottom: 3px solid #0b2e83; }
    .logo-block h1 { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #0b2e83; letter-spacing: 1px; }
    .logo-block p { font-size: 11px; color: #f4b63f; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-top: 2px; }
    .quote-meta { text-align: right; }
    .quote-meta .quote-id { font-family: 'Syne', monospace; font-size: 18px; font-weight: 700; color: #0b2e83; }
    .quote-meta .date { font-size: 11px; color: #64748b; margin-top: 4px; }

    /* Client */
    .client-bar { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .client-bar .client-name { font-size: 16px; font-weight: 600; color: #0f172a; }
    .client-bar .client-meta { font-size: 11px; color: #64748b; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-blue { background: #dbeafe; color: #1d4ed8; }
    .badge-yellow { background: #fef9c3; color: #92400e; }

    /* Sections */
    .section { margin-bottom: 24px; }
    .section-title { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }

    /* Grid */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

    /* Stat cards */
    .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; }
    .stat-card.accent { background: #eff6ff; border-color: #bfdbfe; }
    .stat-card .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px; }
    .stat-card .value { font-size: 16px; font-weight: 600; color: #0f172a; font-variant-numeric: tabular-nums; }
    .stat-card .sub { font-size: 10px; color: #94a3b8; margin-top: 2px; }

    /* Table */
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; text-align: left; padding: 8px 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    td { padding: 9px 10px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
    td.right { text-align: right; font-variant-numeric: tabular-nums; }
    tr.total td { font-weight: 700; background: #f8fafc; }
    tr.highlight td { background: #fef9c3; font-weight: 700; font-size: 14px; }

    /* Final commission */
    .final-commission { background: linear-gradient(135deg, #0b2e83 0%, #1e3a8a 100%); color: white; border-radius: 14px; padding: 24px 28px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }
    .final-commission .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.8; }
    .final-commission .amount { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: #f4b63f; }
    .final-commission .sub { font-size: 11px; opacity: 0.6; margin-top: 4px; }

    /* Footer */
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .footer p { font-size: 10px; color: #94a3b8; }
    .footer .disclaimer { font-size: 9px; color: #cbd5e1; max-width: 400px; line-height: 1.5; }

    .divider { height: 1px; background: #e2e8f0; margin: 20px 0; }
    .not-comm { font-size: 10px; color: #94a3b8; font-style: italic; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { padding: 20px 32px; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="logo-block">
      <h1>☀ SUN SOLUTIONS</h1>
      <p>Quotes & Commissions</p>
    </div>
    <div class="quote-meta">
      <div class="quote-id">${quoteId}</div>
      <div class="date">${date}</div>
      <div style="margin-top:8px">
        <span class="badge badge-blue">${product}</span>
        &nbsp;
        <span class="badge badge-yellow">${state.pricingVersion}</span>
      </div>
    </div>
  </div>

  <!-- Client -->
  <div class="client-bar">
    <div>
      <div class="label" style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:2px">Cliente</div>
      <div class="client-name">${clientName || 'Sin nombre'}</div>
    </div>
    <div style="text-align:right">
      <div class="client-meta">${location} · ${roofType}</div>
      <div class="client-meta" style="margin-top:2px">${state.sellerPosition.charAt(0).toUpperCase() + state.sellerPosition.slice(1)} · ${state.panels} paneles</div>
    </div>
  </div>

  <!-- System Overview -->
  <div class="section">
    <div class="section-title">Sistema</div>
    <div class="grid-3">
      <div class="stat-card accent">
        <div class="label">Tamaño del Sistema</div>
        <div class="value">${fmt.kw(results.systemSizeKW)}</div>
        <div class="sub">${(state.panels * 410).toLocaleString()} W total</div>
      </div>
      <div class="stat-card">
        <div class="label">Paneles</div>
        <div class="value">${state.panels}</div>
        <div class="sub">QCells 410W</div>
      </div>
      <div class="stat-card">
        <div class="label">Batería</div>
        <div class="value">${state.batteryType === 'none' ? 'Ninguna' : `${state.batteryCount}× PW3`}</div>
        <div class="sub">${state.expansionCount > 0 ? `+${state.expansionCount} expansión` : 'Sin expansión'}</div>
      </div>
    </div>
  </div>

  <!-- Cost Breakdown -->
  <div class="section">
    <div class="section-title">Desglose de Costos</div>
    <table>
      <thead>
        <tr>
          <th>Concepto</th>
          <th style="text-align:right">Monto</th>
          <th style="text-align:right">Tipo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Panel EPC (${state.panels} × 410W × $2.50/W)</td>
          <td class="right">${fmt.currency(results.panelEPC)}</td>
          <td class="right"><span class="badge badge-blue">Comisionable</span></td>
        </tr>
        ${results.batteryTotal > 0 ? `<tr><td>${state.batteryCount}× PW3 Hybrid</td><td class="right">${fmt.currency(results.batteryTotal)}</td><td class="right"><span class="not-comm">No comisionable</span></td></tr>` : ''}
        ${results.expansionTotal > 0 ? `<tr><td>${state.expansionCount}× Batería Expansión</td><td class="right">${fmt.currency(results.expansionTotal)}</td><td class="right"><span class="not-comm">No comisionable</span></td></tr>` : ''}
        ${results.electricalAdder > 0 ? `<tr><td>Problemas Eléctricos</td><td class="right">${fmt.currency(results.electricalAdder)}</td><td class="right"><span class="not-comm">No comisionable</span></td></tr>` : ''}
        ${results.lowFICOAdder > 0 ? `<tr><td>Low FICO</td><td class="right">${fmt.currency(results.lowFICOAdder)}</td><td class="right"><span class="not-comm">No comisionable</span></td></tr>` : ''}
        ${results.roofAdder > 0 ? `<tr><td>Techo (${roofType})</td><td class="right">${fmt.currency(results.roofAdder)}</td><td class="right"><span class="not-comm">No comisionable</span></td></tr>` : ''}
        ${results.locationAdder > 0 ? `<tr><td>Ubicación (${location})</td><td class="right">${fmt.currency(results.locationAdder)}</td><td class="right"><span class="not-comm">No comisionable</span></td></tr>` : ''}
        <tr class="total">
          <td>Total del Sistema</td>
          <td class="right">${fmt.currency(results.systemTotal)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Commission -->
  <div class="section">
    <div class="section-title">Comisión</div>
    <table>
      <tbody>
        <tr><td>Panel EPC (base comisionable)</td><td class="right">${fmt.currency(results.panelEPC)}</td></tr>
        <tr><td>Comisión Base (${state.commissionPct}%)</td><td class="right">${fmt.currency(results.baseCommission)}</td></tr>
        <tr><td>PPW Vendido</td><td class="right">${state.soldPPW ? fmt.ppw(state.soldPPW) : '—'}</td></tr>
        <tr><td>Total Vendido</td><td class="right">${fmt.currency(results.soldTotal)}</td></tr>
        <tr><td>Excedente (Vendido − Sistema)</td><td class="right">${fmt.currency(results.excedente)}</td></tr>
        <tr><td>Override %</td><td class="right">${fmt.pct(results.overridePct)}</td></tr>
        <tr><td>Bono de Override</td><td class="right">${fmt.currency(results.overrideBonus)}</td></tr>
      </tbody>
    </table>
  </div>

  ${positionData ? `
  <div class="section">
    <div class="section-title">Desglose por Posición — ${positionData.label}</div>
    <table>
      <tbody>
        ${positionData.position === 'setter' ? `
        <tr><td>Comisión del Closer</td><td class="right">${fmt.currency(positionData.finalCommission)}</td></tr>
        <tr><td>% del Setter (${POSITION_COMMISSION_RULES?.setter?.splitPct ?? 30}%)</td><td class="right">${fmt.currency(positionData.setterShare)}</td></tr>
        ` : ''}
        ${positionData.positionBonus > 0 ? `<tr><td>Bono de Posición (${positionData.label})</td><td class="right">${fmt.currency(positionData.positionBonus)}</td></tr>` : ''}
      </tbody>
    </table>
  </div>
  ` : ''}

  <!-- Final Commission Banner -->
  <div class="final-commission">
    <div>
      <div class="label">Comisión Final</div>
      <div class="sub">Base + Override Bonus${positionData?.positionBonus > 0 ? ' + Bono Posición' : ''}</div>
    </div>
    <div>
      <div class="amount">${fmt.currency(positionData ? positionData.totalEarned : results.finalCommission)}</div>
    </div>
  </div>

  ${results.lightreachPayment ? `
  <div class="section">
    <div class="section-title">Estimado Mensual LightReach</div>
    <div class="stat-card accent" style="display:inline-block;padding:16px 24px">
      <div class="label">Pago Mensual Estimado</div>
      <div class="value" style="font-size:24px">${fmt.currency(results.lightreachPayment)}/mes</div>
      <div class="sub">Basado en ${fmt.kw(results.systemSizeKW)} — tabla interpolada</div>
    </div>
  </div>
  ` : ''}

  <!-- Footer -->
  <div class="footer">
    <p>Sun Solutions © 2026 — ${quoteId}</p>
    <p class="disclaimer">Esta cotización es un estimado generado por el sistema. Los precios finales están sujetos a verificación. No constituye un contrato formal.</p>
  </div>

</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
