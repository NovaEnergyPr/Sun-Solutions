# ☀️ Sun Solutions — Quotes & Commissions

A professional solar pricing and commission engine for Sunrun, LightReach, and Cash/Financing products.

## Stack

- **React 18** + **Vite**
- **TailwindCSS** — dark mode, mobile-first
- **Vercel** — zero-config deployment
- **Firebase-ready** architecture (auth, DB hooks built in)

## Quick Start

```bash
cd sun-solutions
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repo to Vercel — it auto-detects Vite.

## Project Structure

```
src/
├── config/
│   └── index.js          # 🔑 ALL pricing, rules, overrides here
├── utils/
│   ├── calculations.js   # Calculation engine
│   └── format.js         # Currency / formatting helpers
├── hooks/
│   └── useQuoteState.js  # Central form state + derived results
├── components/
│   ├── ui/               # Reusable Card, Select, NumberInput, etc.
│   ├── Header.jsx
│   └── sections/
│       ├── GeneralInfo.jsx
│       ├── Panels.jsx
│       ├── Storage.jsx
│       ├── Adders.jsx
│       ├── Sales.jsx
│       └── Results.jsx
├── App.jsx
└── main.jsx
```

## Updating Prices (No Code Change Needed)

All pricing lives in `src/config/index.js`:

| Config Key | What It Controls |
|---|---|
| `PRODUCTS[x].epcRate` | EPC rate per watt per product |
| `BATTERY_CONFIG.pw3_hybrid.pricePerUnit` | Battery prices |
| `EXPANSION_CONFIG.priceEach` | Expansion battery price |
| `LOCATIONS[x].adder` | Location adder (currently $0) |
| `ROOF_TYPES[x].adder` | Roof type adder (currently $0) |
| `LIGHTREACH_PAYMENT_TABLE` | Monthly payment table |
| `OVERRIDE_TABLE` | Commission → override % mapping |

## Commission Logic

```
Panel EPC       = panels × 410W × $2.50/W
Base Commission = Panel EPC × commission%
Override %      = commission% × 5  (if ≤12%)
                  60% + (commission% - 12) × 5  (if >12%)
Excedente       = Sold Total - System Total
Override Bonus  = Excedente × Override%
Final Commission = Base Commission + Override Bonus
```

**Only Panel EPC is commissionable.** Batteries, expansions, adders, roof, location — all excluded.

## Panel Rules

- 1–36: Normal
- 37–43: **Auto-jumps to 44**
- 44+: Forces 2× PW3 Hybrid (locked), max 2 expansion batteries

## Future Features (Architecture Ready)

- [ ] Firebase Auth (user roles: setter/closer/manager/director)
- [ ] Admin dashboard for price management
- [ ] PDF pricing upload + parsing (LightReach tables)
- [ ] Saved quotes + CRM features
- [ ] Quote PDF export
- [ ] Database storage (Firestore)
- [ ] Multi-location office support
