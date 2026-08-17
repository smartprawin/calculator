# EMI Calculator - Requirements Document (PRD)

Version: 1.0 (Draft)
Date: 2026-08-17
Status: Draft - pending review

## 1. Overview

A simple EMI (Equated Monthly Installment) calculator that lets a user compute
loan installments based on principal, interest rate, and tenure. The calculator
also supports **custom fields** so that real-world loan costs (fees, insurance,
etc.) can be included in the computation.

## 2. Goals

- Compute accurate EMI and repayment schedule for standard loans.
- Allow additional/custom fields that affect the total cost of the loan.
- Simple, fast, and usable interface (web app).
- Clear breakdown of principal, interest, and fees.

## 3. Non-Goals

- No loan origination, approval, or account management.
- No regulatory/compliance features (e.g. disclosure documents).
- No user accounts or data persistence in the first version.

## 4. Personas

| Persona | Description |
| --- | --- |
| Individual borrower | Wants to know EMI and total cost before taking a loan. |
| Financial advisor | Wants to compare scenarios with fees and insurance added. |

## 5. Functional Requirements

### 5.1 Core inputs (built-in)

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| Loan amount (principal) | Number | - | Positive amount |
| Annual interest rate (%) | Number | - | e.g. 9.5 |
| Tenure | Number | - | In years or months |
| Repayment frequency | Select | Monthly | Monthly, Quarterly, Half-yearly, Yearly |
| Interest type | Select | Fixed | Fixed or Floating |
| Disbursement date | Date | Today | Used to build the schedule |

### 5.2 Custom fields (configurable)

Custom fields extend the base loan with extra costs. Each custom field has:

- Name (user-defined or from a preset list)
- Type: one-time amount, recurring amount, or percentage of principal
- Whether it is added to the loan (increases financed amount)
  or paid upfront (out of pocket)
- Whether GST/tax applies to it
- Timing: at disbursement, monthly, annual, at end of tenure

Proposed built-in presets (to be confirmed):

| Preset | Type | Typical behavior |
| --- | --- | --- |
| Processing fee | One-time % or amount | Upfront, GST applies |
| Loan insurance | Recurring | Monthly or annual |
| Documentation fee | One-time amount | Upfront |
| Prepayment penalty | One-time % | On prepayment |
| Late payment penalty | Recurring | Per missed installment |

### 5.3 Outputs

- EMI amount (principal + interest portion)
- Total interest paid
- Total cost of loan (principal + interest + all fees/costs)
- Amortization schedule (installment no, date, principal, interest, balance, fees)
- Optional monthly breakdown chart

### 5.4 Validation rules

- All numeric inputs must be positive.
- Interest rate within reasonable bounds (e.g. 0.01% - 100%).
- Tenure >= 1 month.
- Custom field percentages must be >= 0.

## 6. Non-Functional Requirements

- Calculation runs entirely in the browser; no network needed.
- Responsive UI (mobile and desktop).
- Results update as user types (no "Calculate" button required).
- Amounts formatted with 2 decimals and currency symbol.

## 7. Custom fields - Open questions

1. Should custom fields be user-defined (free text) or only from a preset list?
2. Should presets include GST configurable, or fixed at the current rate?
3. Should the amortization schedule be downloadable (CSV/Excel/PDF)?
4. Should the user be able to save/share scenarios?

## 8. Acceptance criteria (initial)

- [ ] Given principal, rate, and tenure, EMI matches standard formula within 0.01.
- [ ] Adding a one-time processing fee updates the total cost and schedule.
- [ ] Adding recurring insurance adds to each installment.
- [ ] Amortization schedule balances to zero at the final installment.
- [ ] Validation messages shown for invalid inputs.