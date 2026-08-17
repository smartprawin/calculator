# EMI Calculator - Technical Design Document

Version: 1.0 (Draft)
Date: 2026-08-17
Status: Draft - pending review

## 1. Tech stack

| Layer | Choice | Reason |
| --- | --- | --- |
| Language | TypeScript | Type safety for financial logic |
| Frontend | React (Vite) | Fast dev, component reuse |
| Styling | CSS (plain/modules) | Keep dependencies minimal |
| Backend | None (client-side only) | Simple calculator, no data |
| Testing | Vitest | Unit tests for calc logic |
| Build/package | npm | Standard tooling |

Note: stack is proposed and can change based on team preference.

## 2. Architecture

```
+-----------------------------+
| UI (React components)       |
+-------------+---------------+
              | typed inputs
+-------------v---------------+
| State (local component state)|
+-------------+---------------+
              |
+-------------v---------------+
| Calculation engine (pure TS) |
|  - EMI formula              |
|  - amortization schedule    |
|  - custom field effects     |
+-------------+---------------+
              |
+-------------v---------------+
| View model / formatters     |
+-----------------------------+
```

Key principle: the **calculation engine is pure** (no DOM, no I/O), so it can be
unit tested independently of the UI.

## 3. Core calculation logic

### 3.1 Standard EMI formula

For fixed interest, equal installments:

```
EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)

P = principal
r = periodic interest rate (annual rate / periods per year)
n = total number of installments
```

### 3.2 Amortization (reducing balance)

For each period k:
```
interest_k = balance_k * r
principal_k = EMI - interest_k
balance_{k+1} = balance_k - principal_k
```

The final installment is adjusted so the balance lands exactly on zero.

### 3.3 Custom fields effect

| Field type | Effect on computation |
| --- | --- |
| Upfront one-time fee (paid out of pocket) | Added to total cost, not to financed principal |
| Upfront fee (financed) | Added to principal, spread across installments |
| Recurring fee | Added to the EMI for each period it applies |
| Percentage-of-principal fee | Converted to amount at start |

Total cost = principal + total interest + all fees/costs.

## 4. Data model

```ts
interface LoanInput {
  principal: number;
  annualRatePct: number;
  tenureMonths: number;
  frequency: 'monthly' | 'quarterly' | 'halfyearly' | 'yearly';
  interestType: 'fixed' | 'floating';
  startDate: string; // ISO
}

interface CustomField {
  id: string;
  name: string;
  type: 'oneTime' | 'recurring' | 'percentage';
  basis: 'upfront' | 'financed';
  amount?: number;        // for oneTime
  percentOfPrincipal?: number; // for percentage
  frequency?: 'monthly' | 'annual'; // for recurring
  gstApplied: boolean;
  gstRatePct?: number;
  timing: 'atStart' | 'eachPeriod' | 'atEnd';
}

interface ScheduleRow {
  period: number;
  date: string;
  payment: number;       // EMI incl. recurring fees
  principal: number;
  interest: number;
  fees: number;
  balance: number;
}

interface CalculationResult {
  emi: number;
  totalInterest: number;
  totalFees: number;
  totalCost: number;
  schedule: ScheduleRow[];
}
```

## 5. Module layout

```
src/
  core/
    emi.ts            // EMI formula + amortization
    customFields.ts   // applies custom fields to schedule
    validation.ts     // input validation rules
    types.ts          // shared types (above)
  components/
    CalculatorForm.tsx
    ScheduleTable.tsx
    SummaryCards.tsx
  utils/
    format.ts         // currency/percent/date formatting
  App.tsx
  main.tsx
tests/
  emi.test.ts
  customFields.test.ts
  validation.test.ts
```

## 6. Verification

- `npm run dev` - local dev server
- `npm test` - run unit tests (Vitest)
- `npm run lint` - lint
- `npm run build` - production build + type check

## 7. Out of scope for v1

- Backend/persistence
- Auth/user accounts
- Export/download (pending requirement)
- Floating-rate interpolation model (uses fixed rate in v1)