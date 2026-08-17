# Calculations Reference

This document describes, in one place, every formula used by the calculators
in this project. It is kept separate from the code-level documentation so the
math can be reviewed independently. All amounts are in Indian Rupees (₹) and use
Indian number grouping (e.g. `12,00,000`).

For implementation details, see `docs/02-codebase/EMI-CALCULATOR-DOCUMENTATION.md`.

---

## 1. EMI Calculator (`emi.js`)

Computes a fixed (equated) monthly installment for a reducing-balance loan.

### Inputs
- `P` = principal / loan amount
- `R` = annual interest rate (%)
- `N` = tenure in months (`years × 12 + extra months`)
- `scheme` = `arrears` (normal) or `advance`

### Monthly rate
```
r = R / 12 / 100
```

### EMI (arrears)
Standard amortization formula for a fully amortizing loan:
```
EMI = P · r · (1 + r)^N / ((1 + r)^N − 1)
```
Edge cases handled in code:
- `P ≤ 0` or `N ≤ 0`  → `EMI = 0`
- `R = 0`             → `EMI = P / N` (interest-free split)

### Amortization schedule
For each period `k = 1 … N`:
```
interest_k = balance_{k-1} · r
principal_k = EMI − interest_k
balance_k   = balance_{k-1} − principal_k
```
- **Arrears:** first payment is one period after disbursement; interest is
  charged normally each period.
- **Advance:** the first payment is made at disbursement, so for period 1
  `interest_1 = 0` and `principal_1 = min(EMI, balance)`. This lowers total
  interest because the principal starts reducing immediately.
- On the **last period**, `principal_N` is forced to the remaining balance so
  the loan closes exactly at zero.

### Totals
```
total_interest = Σ interest_k
total_payment  = Σ payment_k  = P + total_interest
```
The donut chart shows `P` vs `total_interest` as a share of `total_payment`.

---

## 2. EB Bill Calculator (`ebbill.js`)

Estimates a Tamil Nadu (TANGEDCO) domestic electricity bill from units consumed,
using a **tier-aware, telescopic slab** tariff with a government free-units
allowance and a connected-load fixed charge.

### Tier selection
```
tier = units ≤ 500  →  Tier 1
       units > 500  →  Tier 2
```
The editable slab table follows the active tier; edits per tier are preserved
when switching.

### Slabs (telescopic, bi-monthly)
A slab `[from, to)` with rate `rate` charges only the units that fall inside
that block. `to = ∞` means open-ended.

**Tier 1 (≤ 500 units):**
| From | To | Rate ₹/unit |
|------|----|-------------|
| 0 | 100 | Free (0) |
| 100 | 200 | 2.35 |
| 200 | 500 | 4.70 |

**Tier 2 (> 500 units):**
| From | To | Rate ₹/unit |
|------|----|-------------|
| 0 | 100 | Free (0) |
| 100 | 400 | 4.70 |
| 400 | 500 | 6.30 |
| 500 | 600 | 8.40 |
| 600 | 800 | 9.45 |
| 800 | 1000 | 10.50 |
| 1000 | ∞ | 11.55 |

### Energy charge (with free-units scheme)
The government allowance makes the lowest units free:
```
free_units = units ≤ 500 ? 200 : 100
```
Energy is computed as the full telescopic charge minus the charge on the free
portion, so the free allowance always wipes out the cheapest units first:
```
energy = calc(units) − calc( min(units, free_units) )
where calc(U) = Σ over slabs of ( min(U, slab.to) − slab.from ) · slab.rate
                (only for units above slab.from)
```
- `calc(150) − calc(150) = 0` → 150 units fully free.
- `calc(250) − calc(200) = 50 × 4.70 = 235` → 200 free + 50 charged.

### Fixed charge (from connected load)
Auto-computed from the **Connected Load (W)** input, bi-monthly:
```
load ≤ 500 W            → ₹30
501 W ≤ load ≤ 1000 W   → ₹45
load > 1000 W           → ₹45 + ₹30 × ceil((load − 1000) / 1000)
```
(Charged per kW or part thereof above 1 kW.)

### Totals
```
free_applied = min(units, free_units)
total        = energy + fixed
effective_rate = units > 0 ? total / units : 0
```
The "Free Units (Subsidy)" line shows `free_applied`.

### Error margins / simplifications
- Fuel-cost (power) adjustment and 5% electricity duty are **not** modelled.
- Slabs are treated as **bi-monthly** consumption.
- Fixed charge is derived purely from connected load (no manual override).

---

## 3. Income Tax Calculator (`tax.js`)

Estimates Indian income tax for **FY 2025-26** under the **New** and **Old**
regimes and compares them.

### Inputs
- `income` = gross total income (capped at ₹50,00,000 in the UI)
- `regime` = `new` | `old`
- `age` = `below` (< 60) | `senior` (60–80) | `super` (> 80)  (Old regime only)
- `80C`, `HRA`, `other` deductions (Old regime only; 80C capped at ₹1,50,000)

### Deductions
```
standard_deduction = regime == new ? 75,000 : 50,000
deductions        = standard_deduction
if regime == old:
    deductions += 80C + HRA + other      (80C already capped at 1,50,000)
taxable = max(0, income − deductions)
```

### Progressive tax
Each regime/age uses marginal brackets `[limit, rate]`. Tax is the sum of
`(min(income, limit) − previous_limit) × rate` across brackets:
```
tax = Σ ( min(taxable, limit_i) − prev_i ) × rate_i
```
**New regime brackets:**
| Up to ₹ | Rate |
|---------|------|
| 4,00,000 | 0% |
| 8,00,000 | 5% |
| 12,00,000 | 10% |
| 16,00,000 | 15% |
| 20,00,000 | 20% |
| 24,00,000 | 25% |
| ∞ | 30% |

**Old regime brackets:**
| Age | 0% up to | 5% up to | 20% up to | 30% above |
|-----|----------|----------|-----------|-----------|
| Below 60 | 2,50,000 | 5,00,000 | 10,00,000 | ∞ |
| Senior 60–80 | 3,00,000 | 5,00,000 | 10,00,000 | ∞ |
| Super > 80 | 5,00,000 | 10,00,000 | — | ∞ |

### Section 87A rebate
```
new regime:  if income ≤ 12,00,000  → rebate = min(tax, 60,000)
old regime:  if income ≤  5,00,000  → rebate = min(tax, 12,500)
after_rebate = max(0, tax − rebate)
```

### Cess and totals
```
cess        = after_rebate × 0.04
total_tax   = after_rebate + cess
effective%  = income > 0 ? total_tax / income × 100 : 0
```

### Regime comparison
Both regimes are computed for the same income; the lower `total_tax` is flagged
as "best" and the applicable regime name is shown.

### Simplifications
- No surcharge, no marginal-relief calculation.
- Old-regime deductions are limited to 80C (capped), HRA, and a generic
  "other" field; section 80D, 80CCD(1B), etc. are not modelled.
- Income is capped at ₹50,00,000 in the UI slider/input.
