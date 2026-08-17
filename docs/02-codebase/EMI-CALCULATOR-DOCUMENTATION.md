# EMI Calculator - Complete Documentation

> Auto-generated documentation of the EMI calculator codebase (HTML + CSS + vanilla JS).
>
> **Last updated:** 2026-08-18 (added Income Tax Calculator: tax.html + tax.js, New/Old regime comparison, landing card, i18n keys)

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
 11. [Internationalization (en / ta)](#internationalization-en--ta)

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
| Markup | `index.html` / `emi.html` / `ebbill.html` / `tax.html` |
| Styling | `style.css` |
| Logic | `common.js` / `emi.js` / `ebbill.js` / `tax.js` |
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
├── common.js                # shared helpers: $(), currency(), i18n
├── emi.js                   # EMI engine + UI logic
├── ebbill.js                # EB engine + UI logic
├── tax.js                   # Income tax engine + UI logic
├── style.css                # all styles (shared by every page)
├── robots.txt               # crawler rules; points to sitemap
├── sitemap.xml              # lists all public pages for search engines
└── .gitignore
```

The site is **multi-page**: opening it shows a selection screen
(`index.html`) with three options - EMI Calculator, EB Bill Calculator and
Income Tax Calculator. Choosing one navigates to that page; the other
calculators are never shown on the same page. Each calculator has a
"← All calculators" back link to the selection screen.

Responsibilities by file:

| File | Contents |
|------|----------|
| `index.html` | Selection/landing page with links to `emi.html` / `ebbill.html` / `tax.html` |
| `emi.html` | Markup for the EMI calculator |
| `ebbill.html` | Markup for the EB calculator |
| `tax.html` | Markup for the income tax calculator |
| `common.js` | Shared helpers (`$()`, `currency()`) |
| `emi.js` | EMI engine + DOM logic (IIFE) |
| `ebbill.js` | EB engine + DOM logic (IIFE) |
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
| `sitemap.xml` | Lists `index.html`, `emi.html`, `ebbill.html`, `tax.html` |

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
| `index.html` | Hero, card titles/descriptions, CTA, footer |
| `emi.html` | Header, loan tabs, all fields, scheme, summary, chart, schedule |
| `ebbill.html` | Header, fields, slab labels, summary, slab placeholders |
| `tax.html` | Header, regime/age tabs, all fields, summary, comparison |

> To add another language, add a third dictionary to `TRANSLATIONS` and a
> button with `data-lang` in each page's `.lang-switch`.

---

*Auto-generated for Simple EMI calculator - 2026-08-17*
