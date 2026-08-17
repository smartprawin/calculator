# EMI Calculator - Project Plan

Version: 1.0 (Draft)
Date: 2026-08-17

## 1. Objective

Build a simple EMI calculator (client-side web app) with core loan inputs and
configurable custom fields (fees/insurance), covering the requirements in
`docs/01-planning/01-requirements.md` per the design in
`docs/01-planning/02-technical-design.md`.

## 2. Phases

### Phase 1 - Setup & foundation
- [ ] Init project (Vite + React + TypeScript)
- [ ] Set up Vitest, ESLint, npm scripts
- [ ] Create `src/core/types.ts` shared types

### Phase 2 - Calculation engine (pure logic)
- [ ] Implement EMI formula + amortization (`core/emi.ts`)
- [ ] Implement custom field handling (`core/customFields.ts`)
- [ ] Implement validation (`core/validation.ts`)
- [ ] Unit tests for engine (target: 100% of core coverage)

### Phase 3 - UI
- [ ] Calculator form (principal, rate, tenure, frequency, interest type)
- [ ] Custom fields editor (add/edit/remove fields)
- [ ] Summary cards (EMI, total interest, total cost)
- [ ] Amortization schedule table
- [ ] Live updates + validation messages

### Phase 4 - Polish & release
- [ ] Responsive styling
- [ ] Lint/typecheck/build clean
- [ ] Manual acceptance testing vs criteria in requirements doc
- [ ] Release v1.0

## 3. Timeline estimate (part-time)

| Phase | Est. duration |
| --- | --- |
| 1 - Setup | 0.5 day |
| 2 - Engine + tests | 1-2 days |
| 3 - UI | 2-3 days |
| 4 - Polish & release | 1 day |
| **Total** | **~5-7 days** |

## 4. Open decisions to resolve before Phase 2

1. Confirm custom field presets and behavior (requirements doc section 5.2).
2. Confirm tech stack (design doc section 1) or pick alternatives.
3. Decide whether export/download is needed (requirements doc section 7).
4. Decide on currency symbol and supported locales.

## 5. Definition of done (per phase)

- Phase 2: all core logic covered by passing unit tests.
- Phase 3: form, custom fields, summary, and schedule working end to end.
- Phase 4: `npm run lint`, `npm test`, `npm run build` all pass; acceptance
  criteria in requirements doc verified.