# Simple Calculators - Complete Documentation

> Auto-generated documentation of the calculators suite (HTML + CSS + vanilla JS).
>
> **Last updated:** 2026-08-21 (added Offer Letter calculator, Payslip vs Offer comparator, Privacy FAB/banner/footer; documented previously-undocumented pages: irpart, offer, payslip, privacy)

---

## Table of Contents

 1. [Project Overview](#project-overview)
 2. [Tech Stack & Getting Started](#tech-stack--getting-started)
 3. [Project Structure](#project-structure)
 4. [Calculation Engine](#calculation-engine)
 5. [Validation Rules](#validation-rules)
 6. [UI Components](#ui-components)
 7. [State Management & Data Flow](#state-management--data-flow)
 8. [Utilities](#utilities)
  9. [SEO](#seo)
  10. [Income Tax Calculator](#income-tax-calculator)
  11. [Irregular Part-Payment Calculator](#irregular-part-payment-calculator)
  12. [Offer Letter Salary Split-up Generator & Verifier](#offer-letter-salary-split-up-generator--verifier)
  13. [Payslip vs Offer Letter Comparator](#payslip-vs-offer-letter-comparator)
  14. [Privacy Features](#privacy-features)
  15. [Internationalization (en / ta)](#internationalization-en--ta)

---

## Project Overview

A simple EMI (Equated Monthly Installment) calculator modeled on
[emicalculator.net](https://emicalculator.net/). It computes monthly
installments for home, personal, and car loans, shows total interest and total
payment, renders a principal-vs-interest breakdown chart, and displays an
amortization schedule (year-wise or month-wise).

Supports EMI paid in **arrears** (first payment one month after disbursement)
and **advance** (first payment at disbursement, which reduces total interest).

The app is split across three static files - markup, styles, and logic - with
zero dependencies and no build step. All calculation runs in the browser.
Requirements, design, and plan live in [`docs/`](README.md).

## Tech Stack & Getting Started

| Layer | Technology |
|-------|------------|
| Language | Vanilla JavaScript (ES5-compatible IIFE) |
| Markup | `index.html` / `emi.html` / `ebbill.html` / `tax.html` / `irpart.html` / `offer.html` / `payslip.html` |
| Styling | `style.css` |
| Logic | `common.js` / `emi.js` / `ebbill.js` / `tax.js` / `irpart.js` / `offer.js` / `payslip.js` |
| Charts | Inline SVG |
| Backend | None (fully client-side) |
| Dependencies | None |

**To run:** open `index.html` in any browser, or serve the folder:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

## Project Structure

```
.
├── .opencode/
│   └── skills/              # opencode skills (auto-documenter, etc.)
├── docs/
│   ├── README.md            # documentation index
│   ├── 01-planning/         # PRD, tech design, project plan
│   └── 02-codebase/         # this file
   ├── index.html               # landing / selection page (links to calculators)
   ├── emi.html                 # EMI calculator page
   ├── ebbill.html              # EB bill calculator page
   ├── tax.html                 # Income tax calculator page
   ├── irpart.html              # Irregular part-payment EMI calculator page
   ├── offer.html               # Offer Letter salary split-up generator & verifier
   ├── payslip.html             # Payslip vs Offer Letter comparator
   ├── common.js                # shared helpers: $(), currency(), i18n, privacy injectors
   ├── emi.js                   # EMI engine + UI logic
   ├── ebbill.js                # EB engine + UI logic
   ├── tax.js                   # Income tax engine + UI logic
   ├── irpart.js                # Part-payment EMI engine + UI logic
   ├── offer.js                 # Offer Letter generator/verifier + UI logic
   ├── payslip.js               # Payslip vs Offer comparator + UI logic
   ├── style.css                # all styles (shared by every page)
├── robots.txt               # crawler rules; points to sitemap
├── sitemap.xml              # lists all public pages for search engines
└── .gitignore
```

The site is **multi-page**: opening it shows a selection screen
(`index.html`) linking to all calculators - EMI, EB Bill, Income Tax,
Irregular Part-Payment, Offer Letter, and Payslip vs Offer. Choosing one
navigates to that page; the other calculators are never shown on the same
page. Each calculator has a "← All calculators" back link to the selection
screen. The landing cards and the privacy footer/lock are driven by `common.js`.

Responsibilities by file:

| File | Contents |
|------|----------|
| `index.html` | Selection/landing page with links to all calculators |
| `emi.html` | Markup for the EMI calculator |
| `ebbill.html` | Markup for the EB calculator |
| `tax.html` | Markup for the income tax calculator |
| `irpart.html` | Markup for the irregular part-payment EMI calculator |
| `offer.html` | Markup for the Offer Letter salary split-up generator & verifier |
| `payslip.html` | Markup for the Payslip vs Offer Letter comparator |
| `common.js` | Shared helpers (`$()`, `currency()`, i18n, privacy injectors) |
| `emi.js` | EMI engine + DOM logic (IIFE) |
| `ebbill.js` | EB engine + DOM logic (IIFE) |
| `tax.js` | Income tax engine + DOM logic (IIFE) |
| `irpart.js` | Part-payment EMI engine + DOM logic (IIFE) |
| `offer.js` | Offer Letter generator/verifier + DOM logic (IIFE) |
| `payslip.js` | Payslip vs Offer comparator + DOM logic (IIFE) |
| `style.css` | All styling (layout, inputs, cards, table, chart, landing) |
| `robots.txt` | Allows all crawlers; references `sitemap.xml` |
| `sitemap.xml` | URLs of `index.html`, `emi.html`, `ebbill.html` |

## Calculation Engine

Pure JavaScript functions inside an IIFE: the EMI engine in `emi.js`, the EB
engine in `ebbill.js`. Both reuse the shared `currency()`/`$()` helpers from
`common.js`.

**`calculateEmi(principal, annualRatePct, months): number`**

Standard EMI formula for equal installments:

```
EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)

P = principal
r = periodic rate = annual rate / 12 / 100
n = total number of months
```

Returns `principal / months` when the rate is 0%, and `0` for non-positive
principal or tenure.

**`buildSchedule(): ScheduleRow[]`**

Reducing-balance amortization built from the current `state`. The final
installment is adjusted (`principal = balance`) so the outstanding balance
lands exactly on zero. Dates are formatted `YYYY-MM`.

Behavior differences by scheme:

| Scheme | First installment |
|--------|-------------------|
| Arrears | 1 month after disbursement, interest charged normally |
| Advance | At disbursement, `interest = 0`, principal reduced immediately |

Advance scheme produces lower total interest than arrears.

## Validation Rules

`isInvalid()` returns true when inputs are out of range:

| Field | Rule |
|-------|------|
| Loan amount | > 0 |
| Interest rate | between 0 and 100 inclusive |
| Tenure years | between 0 and 50 |
| Tenure months | between 0 and 11 |
| Total tenure | at least 1 month |

Invalid inputs show a "Enter valid loan details" placeholder instead of results.

## UI Components

All are plain DOM elements in `index.html`, styled by `style.css`, wired in
`app.js`; no framework.

| Element | ID(s) | Behavior |
|---------|-------|----------|
| Loan type tabs | `#loanTabs` | Home / Personal / Car; resets state to presets |
| Amount slider + box | `#amount` / `#amountInput` | Slider ₹1L-₹200L or type any amount |
| Rate slider + box | `#rate` / `#rateInput` | Slider 1%-20% or type a rate (0-100) |
| Tenure slider + boxes | `#tenureYears` / `#tenureYearsInput`, `#tenureMonthsInput` | Slider 0-30 yr or type Yr/Mo |
| Scheme toggle | `#schemeTabs` | EMI in Arrears / Advance |
| Summary | `#sumEmi`, `#sumInterest`, `#sumPayment` | EMI, total interest, total payment |
| Chart | `#chart` (SVG) | Donut: principal (blue) vs interest (amber) |
| Legend | `#legendPrincipal`, `#legendInterest` | Amounts and percentages |
| Schedule table | `#scheduleBody` | Rows; toggled via `#viewTabs` |

## State Management & Data Flow

A single `state` object is mutated by input listeners, then `render()` updates
the DOM:

```
state = { type, amount, rate, years, months, scheme, view }
        │
        ▼
input listeners ──► state changes ──► render()
        │                                │
        │                     isInvalid() ──► placeholder
        │                                │
        └────────────────── buildSchedule() ► Summary + Chart + Table
```

Loan type presets (applied when a tab is clicked):

| Loan type | Amount | Rate | Tenure |
|-----------|--------|------|--------|
| Home | ₹25L | 9.5% | 20 yr |
| Personal | ₹5L | 12% | 3 yr |
| Car | ₹8L | 10% | 5 yr |

## Utilities

| Function | Behavior |
|----------|----------|
| `currency(n)` | INR currency via `Intl.NumberFormat` (en-IN), 2 decimals |
| `arc()` / `polar()` | SVG donut-chart arc path helpers |

## EB Bill Calculator

A second, independent calculator in its own page (`ebbill.html`). It estimates
an electricity bill from **units consumed** using a **slab tariff** plus a
**fixed charge**.

### Inputs

| Field | Element | Notes |
|-------|---------|-------|
| Units consumed | `#ebUnits` | Number of units (kWh) |
| Fixed charge | `#ebFixed` | Flat monthly charge |
| Tariff slabs | `#ebSlabs` | Editable rows: From / To (blank = ∞) / Rate ₹-per-unit |
| Add slab | `#ebAddSlab` | Appends a new slab row |

### Functions (in `ebbill.js`)

**`readSlabs(): {from, to, rate}[]`**

Reads the slab rows from the DOM. `to` is `Infinity` when left blank
(open-ended last slab). Rows with invalid numbers are skipped.

**`calcEb(units, fixed, slabs): {energy, fixed, total}`**

Sums energy charge across slabs using half-open ranges `[from, to)`:

```
for each slab (sorted by from):
  if units > from:
    upTo = min(units, to)         // to = units when open-ended
    energy += (upTo - from) * rate
total = energy + fixed
```

The effective rate per unit (`total / units`) is shown in the summary.

### Outputs

| Element | Value |
|---------|-------|
| `#ebEnergy` | Energy charge (sum across slabs) |
| `#ebFree` | Free units applied under subsidy |
| `#ebFixedOut` | Fixed charge |
| `#ebTotal` | Total bill |
| `#ebRate` | Effective rate per unit |

### Default slabs

The calculator is **tier-aware and telescopic** (each rate applies only to the
units inside that block). The tier is chosen by total bi-monthly consumption,
matching the TNEB domestic (LT-IA) structure:

**Tier 1 - total ≤ 500 units bi-monthly**

| From | To | Rate ₹/unit |
|------|----|-------------|
| 0 | 100 | Free (0) |
| 100 | 200 | 2.35 |
| 200 | 500 | 4.70 |

**Tier 2 - total > 500 units bi-monthly**

| From | To | Rate ₹/unit |
|------|----|-------------|
| 0 | 100 | Free (0) |
| 100 | 400 | 4.70 |
| 400 | 500 | 6.30 |
| 500 | 600 | 8.40 |
| 600 | 800 | 9.45 |
| 800 | 1000 | 10.50 |
| 1000 | ∞ | 11.55 |

> Example: 250 units (default fixed charge ₹0) → Tier 1 with 200 free units:
> 200 units free + 50 × 4.70 = **₹235.00**. 100 units and 200 units → **₹0.00**
> (fully covered by the free allowance).
>
> The TNEB slab tables above already have a free 0-100 block. On top of that, the
> **government 200-free-units scheme is layered**: domestic consumers with
> bi-monthly consumption ≤ 500 units get the first **200 units free**; above 500
> units the first **100 units free** (already in the Tier 2 slabs). Energy is
> computed as `full charge − charge on the free units`, so the free allowance
> always covers the lowest-priced units. The "Free Units (Subsidy)" line shows
> the applied free allowance (200 or 100).
>
> **Fixed charge** is auto-computed from the **Connected Load (W)** input using
> TANGEDCO's bi-monthly schedule: ≤ 500 W → ₹30; 501 W – 1 kW → ₹45; above 1 kW →
> ₹45 + ₹30 per additional kW (charged per kW or part thereof). Default load is
> 1 kW → ₹45. The page also documents the **500-unit cliff** (crossing 500
> bi-monthly drops the free quota from 200 to 100 units and unlocks the ₹8.40–₹11.55
> slabs) and a Ctrl+P / ⌘+P print-to-PDF hint. Fuel-cost adjustment and 5%
> electricity duty are
> not modelled; slabs are treated as bi-monthly.

## Income Tax Calculator

A third calculator in its own page (`tax.html`) for estimating **Indian income
tax (FY 2025-26)** under both the **New** and **Old** regimes and comparing them.

### Inputs

| Field | Element | Notes |
|-------|---------|-------|
| Annual income | `#taxIncome` (range) + `#taxIncomeInput` (number) | Slider + text box, synced |
| Tax regime | `#regimeTabs` | Segmented: New / Old (default New) |
| Age category | `#ageTabs` | Below 60 / 60-80 / 80+ (affects old-regime slab & exemption) |
| Section 80C deduction | `#ded80C` (range) + `#ded80CInput` (number) | Slider + text box; disabled in New regime |
| HRA exemption | `#hra` | Number; disabled in New regime |
| Other deductions | `#other` | Number (80D, etc.); disabled in New regime |

### Functions (in `tax.js`)

**`progressiveTax(income, brackets): number`**

Applies a progressive slab table (array of `[limit, rate]` pairs; the first
bracket is the zero-rate threshold) to `income`.

**`compute(regime): {std, deductions, taxable, tax, rebate, cess, total}`**

- Standard deduction: ₹75,000 (New) / ₹50,000 (Old).
- Old regime adds 80C + HRA + other deductions; New regime uses only the
  standard deduction (the 80C/HRA/other inputs are disabled).
- Slabs - New: `[4L:0, 8L:5%, 12L:10%, 16L:15%, 20L:20%, 24L:25%, ∞:30%]`;
  Old (by age): `below` 2.5L exempt / `senior` 3L / `super` 5L, then 5%/20%/30%.
- Sec 87A rebate - New up to ₹60,000 if income ≤ ₹12L; Old up to ₹12,500 if
  income ≤ ₹5L.
- Health & Education cess: 4% on tax after rebate.

### Outputs

| Element | Value |
|---------|-------|
| `#sumStd` | Standard deduction |
| `#sumDed` | Total deductions |
| `#sumTaxable` | Taxable income |
| `#sumTax` | Income tax (pre-rebate) |
| `#sumRebate` | Sec 87A rebate |
| `#sumCess` | Cess (4%) |
| `#sumTotal` | Total tax payable |
| `#sumEff` | Effective tax rate |
| `#cmpNewVal` / `#cmpOldVal` | Total tax under each regime |
| `#cmpNote` | Which regime gives the lower tax |

> Estimates are for FY 2025-26 and are illustrative only, not financial advice.

## Irregular Part-Payment Calculator

A variant of the EMI calculator in its own page (`irpart.html`) that supports
**irregular part-payments** (lump-sum prepayments) which reduce the outstanding
principal and shorten the tenure / interest. It reuses the same EMI math
(`calculateEmi`) as `emi.js`.

- **Layout:** input card on top, amortization schedule directly below, in a
  single column (`.layout.irpart`), so it is not buried under results on mobile.
- **Repay / part-payment textboxes** were enlarged for mobile (`#ppInline`,
  `.input-box input` font sizes bumped; `.pp-inline` width 84→100px, larger
  font on phones).
- Output is the same schedule/summary family as the EMI calculator.

## Offer Letter Salary Split-up Generator & Verifier

A standalone calculator (`offer.html` / `offer.js`) that does two jobs: it
**generates** a standard Indian salary break-up from a CTC, and **verifies**
the split-up printed in an actual job offer letter.

### Inputs — Generator

| Field | Element | Notes |
|-------|---------|-------|
| CTC | `#ctc` (range) | ₹1L–₹1cr, step ₹50k |
| Basic % of CTC | `#basicPct` / `#basicPctInput` (range + number, synced) | 20%–60%, default 50% |

Reference outputs: `#refBasic`, `#refHra`, `#refSpecial`, `#refEmpPf`,
`#refGrat`, `#refTakeHome` (Est. Monthly In-Hand).

### Inputs — Verifier

| Field | Element | Required |
|-------|---------|----------|
| Basic | `#vBasic` | |
| HRA | `#vHra` | |
| Special Allowance | `#vSpecial` | |
| Employer PF | `#vEmpPf` | |
| Employer Gratuity | `#vGrat` | |
| Variable / Other | `#vVar` | |
| Variable cap % of CTC | `#vVarCap` | auto-populated (read-only) |
| Travel Allowance (LTA) | `#vTravel` | |
| Medical Insurance | `#vMed` | |
| Employee PF (deducted) | `#vEmpPfDed` | |
| Prof. Tax / month | `#vPt` | |
| Stated Monthly In-Hand | `#vInhand` | **Yes (red `*` required)** |

Summary: `#vGross` (Gross Salary), `#vTakeHome` (Est. Monthly In-Hand),
`#vTotal` (Total / CTC). Report: `#verifyReport`.

### Functions (in `offer.js`)

- **`newRegimeTax(income)`** — FY 2025-26 estimate: nil up to ₹12L (Sec 87A
  rebate), slab bands `[4L:5%, 8L:10%, 12L:15%, 16L:20%, 20L:25%, 24L:30%]`,
  then `×1.04` cess.
- **`renderReference()`** / **`renderVerify()`** — build the two result blocks.
- **`addCheck(status, label, detail)`** — `status` is `true` (✓) / `false` (⚠) /
  `'na'` (–, neutral). Blank fields produce `'na'` so they are not falsely
  shown as a pass.
- **`buildCsv()`** / **`downloadCsv()`** — Excel export (CSV with UTF-8 BOM).

### Consistency checks

| Check | Rule |
|-------|------|
| Sum of components | Basic + HRA + Special + Travel + Variable = Gross |
| Employer PF | = 12% of Basic |
| Gratuity | = 4.81% of Basic |
| Employee PF deducted | = 12% of Basic |
| In-hand recompute | Stated vs computed take-home |
| Variable cap | Variable as % of CTC vs `RECOMMENDED_VAR_MAX = 30` (auto-fills `#vVarCap`) |

### Export

- **PDF:** `window.print()` with a `www.simplecalculator.in` watermark and an
  ad block (`.pdf-watermark`, `.export-ad`, `@media print`).
- **Excel:** CSV download (`offer-salary-splitup.csv`).

## Payslip vs Offer Letter Comparator

A comparator (`payslip.html` / `payslip.js`) that lines up an **annual
offer-letter split-up** against a **monthly payslip** and flags mismatches.

### Inputs

| Side | Class | Fields (ids) |
|------|-------|--------------|
| Offer (annual) | `.onum` | `#oBasic #oHra #oSpecial #oEmpPf #oGrat #oVar #oTravel #oMed #oInhand` (required) |
| Payslip (monthly) | `.pnum` | `#pBasic #pHra #pSpecial #pEmpPf #pTravel #pMed #pPt #pTax #pNet` (required) |

On wider screens (≥768px) the two input cards sit **side by side**; on phones
they stack.

### Comparison table

Columns: **Component | Offer (Monthly, ÷12) | Payslip | Reason | Status**.

- **Status** ✓ / ⚠ / – (not provided).
- **Reason** shows `Payslip ₹X lower` / `Payslip ₹X higher` on mismatch,
  `Matches` when equal, `Not provided` when a side is blank.

### Income-tax handling

The offer side's **monthly** income-tax estimate is computed from
`Basic + HRA + Special + Travel + Variable` via `newRegimeTax()`. The tax row
is marked `offerComputed`, so a `0` estimate is treated as a **valid value**
(not "Not provided") when TDS (`#pTax`) is entered — fixing the earlier false
neutral.

### Tolerance

Comparison uses a **2% relative tolerance** (`Math.max(o, p) * 0.02`, no
fixed-rupee floor) so tiny values (e.g. HRA 12 vs 0.3) are not falsely
matched.

### Verdict & export

A verdict banner sits under the table. The **Excel** export (`payslip-offer-comparison.csv`)
lists both sides, the comparison (with Reason + Status), and an ad block.

## Privacy Features

The app stores **no user data**:

- Only `lang` (en/ta) is persisted, in `localStorage`. Calculator inputs live
  in JS memory and are cleared on reload/close.
- `sw.js` (service worker) caches **only static assets** (HTML/JS/CSS), never
  inputs.

### UI surfaces (all i18n-aware, EN/TA)

| Surface | Where | Behavior |
|---------|-------|----------|
| Floating 🔒 button | `#privacyFab` (injected site-wide by `injectPrivacyFab()` in `common.js`) | Tapping opens a popup that **cycles 4 messages** (`PRIVACY_MSGS`) each tap |
| Home banner | `.privacy-banner` in `index.html` (`data-i18n="privacyTagline"`) | Always *"🔒 100% private — nothing you type is ever stored or sent."* |
| Footer line | `.privacy-line` (injected by `injectPrivacy()`) | **Home** = "100% private"; **other pages** = a random tagline from `PRIVACY_TAGLINES` on each load |
| Input-page badge | `.privacy-badge` on `offer.html` & `payslip.html` | Short "🔒 Private — nothing you type is stored or sent." pill above the form |

i18n keys: `privacyTagline`, `privacyBadge`, `privacyFabTitle`,
`privacyPopTitle`, `privacyMsg1`–`privacyMsg4`.

## SEO

On-page and crawl optimization for search engines.

### Per-page `<head>` metadata

Every HTML page carries:

| Tag | Purpose |
|-----|---------|
| `<title>` | Descriptive, unique per page |
| `<meta name="description">` | Concise summary shown in SERPs |
| `<meta name="keywords">` | Relevant search terms |
| `<meta name="author">`, `theme-color`, `robots` | Metadata / browser hint / crawl directive |
| `<link rel="canonical">` | Preferred URL (set to the GitHub Pages URL) |
| Open Graph `og:*` | Link previews on social platforms |
| `twitter:card` | Twitter summary card |

### Structured data

`emi.html`, `ebbill.html` and `tax.html` include a JSON-LD `SoftwareApplication`
(`applicationCategory: FinanceApplication`, free INR offer) for rich results.

### Crawl files (root)

| File | Role |
|------|------|
| `robots.txt` | Allows all crawlers; points to `sitemap.xml` |
| `sitemap.xml` | Lists `index.html`, `emi.html`, `ebbill.html`, `tax.html`, `irpart.html`, `offer.html`, `payslip.html` |

> **Action required:** replace the placeholder
> `https://your-username.github.io/your-repo/` in `index.html`, `emi.html`,
> `ebbill.html`, `tax.html`, `robots.txt`, and `sitemap.xml` with the real GitHub Pages URL
> before deploying. Submit the sitemap in Google Search Console for indexing.

## Internationalization (en / ta)

The site supports English and Tamil via a lightweight, dependency-free i18n
layer in `common.js`.

### How it works

- `TRANSLATIONS` holds two dictionaries, `en` and `ta`, keyed by string id.
- `t(key)` returns the translation for the active language (falls back to `en`).
- `applyLanguage(lang)` scans the DOM for:
  - `[data-i18n]` - sets `textContent`
  - `[data-i18n-placeholder]` - sets `placeholder`
  - `[data-i18n-title]` - sets `title`
  then updates `<html lang>`, highlights the active switch button, and
  dispatches a `langchange` event so the calculator scripts re-render their
  dynamic text.
- The chosen language is persisted in `localStorage` (`lang`) and restored on
  load. Default is `en`.

### UI

Every page has a `.lang-switch` pill (EN / தமிழ்) in the top-right corner.
Static labels use `data-i18n` attributes; dynamic strings produced in JS
(legend, schedule column header, chart label, validation message, slab
placeholders) are rendered through `t()`.

### Scope

| Page | Translated |
|------|------------|
| `index.html` | Hero, card titles/descriptions, CTA, footer, privacy banner |
| `emi.html` | Header, loan tabs, all fields, scheme, summary, chart, schedule |
| `ebbill.html` | Header, fields, slab labels, summary, slab placeholders |
| `tax.html` | Header, regime/age tabs, all fields, summary, comparison |
| `irpart.html` | Header, part-payment fields, schedule |
| `offer.html` | Header, generator + verifier fields, summaries, privacy badge |
| `payslip.html` | Header, offer/payslip fields, comparison, verdict, privacy badge |

> To add another language, add a third dictionary to `TRANSLATIONS` and a
> button with `data-lang` in each page's `.lang-switch`.

---

*Auto-generated for Simple Calculators - 2026-08-21*
