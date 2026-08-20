'use strict';

var $ = function (id) { return document.getElementById(id); };
var fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

function currency(n) { return fmt.format(n); }

function parseDigits(v) {
  if (typeof v === 'number') return v;
  var s = String(v == null ? '' : v).replace(/[^\d.]/g, '');
  var n = parseFloat(s);
  return isFinite(n) ? n : 0;
}

function groupIndian(n) {
  if (n === '' || n == null || isNaN(n)) return '';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 20 }).format(n);
}

// ---------- Internationalization (en / ta) ----------

var TRANSLATIONS = {
  en: {
    heroTitle: 'Calculators',
    heroSub: 'Choose a calculator to get started',
    emiTitle: 'EMI Calculator',
    emiDesc: 'Home loan, car loan & personal loan EMI, total interest and payment schedule.',
    emiCta: 'Open calculator \u2192',
    precloseTitle: 'Preclosure / Early Closure',
    monthsDone: 'Months completed',
    partPay: 'Part-prepayment now',
    outstanding: 'Outstanding Principal',
    paidSoFar: 'Paid So Far',
    interestSaved: 'Interest Saved',
    closeNow: 'Amount to Close Now',
    bankLbl: 'Bank (optional)',
    chargeLbl: 'Preclosure charge %',
    chargeNote: 'Charges are indicative; confirm with your bank.',
    chargeAmtLbl: 'Preclosure Charge',
    precloseDisclaimer: 'The figures shown are estimates. Actual amounts may differ slightly due to rounding, lender-specific charges, or policy changes. Please confirm the final payable amount with your bank.',
    ebTitle: 'EB Bill Calculator',
    ebDesc: 'Estimate your electricity bill from units consumed using editable slab tariffs.',
    ebCta: 'Open calculator \u2192',
    footer: 'Built for practice. Amounts are rounded to two decimals.',

    back: '\u2190 All calculators',
    emiH1: 'EMI Calculator',
    emiSub: 'Home Loan, Car Loan & Personal Loan',
    tabHome: 'Home Loan',
    tabPersonal: 'Personal Loan',
    tabCar: 'Car Loan',
    tabGold: 'Gold Loan',
    goldRepay: 'Gold Loan Repayment',
    goldEmi: 'EMI',
    goldInterestOnly: 'Interest Only',
    goldInterestHint: 'Pay only the interest each period; the full principal is repaid as a lump sum at the end.',
    loanAmount: 'Loan Amount',
    interestRate: 'Interest Rate',
    loanTenure: 'Loan Tenure',
    startDate: 'Loan Start Date',
    emiScheme: 'EMI Scheme',
    emiArrears: 'EMI in Arrears',
    emiAdvance: 'EMI in Advance',
    hint: 'EMI in advance lowers total interest because the first payment is made at disbursement.',
    regPartLabel: 'Regular Part-Payment',
    regPartHint: 'Extra amount paid every month or year reduces the principal, which lowers total interest and closes the loan sooner. EMI stays the same; only the tenure shortens.',
    everyMonth: 'Every Month',
    everyYear: 'Every Year',
    shortenTenure: 'Shorten Tenure',
    reduceEmi: 'Reduce EMI',
    closesIn: 'Loan closes in',
    summary: 'Summary',
    loanEmi: 'Loan EMI',
    totalInterest: 'Total Interest Payable',
    totalPayment: 'Total Payment (Principal + Interest)',
    breakUp: 'Payment Break-up',
    principalLbl: 'Principal',
    interestLbl: 'Interest',
    schedule: 'Payment Schedule',
    yearWise: 'Year wise',
    monthWise: 'Month wise',
    colPayment: 'Payment',
    colPrincipal: 'Principal',
    colInterest: 'Interest',
    colBalance: 'Balance',
    year: 'Year',
    month: 'Month',
    validMsg: 'Enter valid loan details to see the result.',
    principalCenter: 'principal',

    ebH1: 'EB Bill Calculator',
    ebSub: 'Estimate your electricity bill from units consumed using editable slab tariffs.',
    unitsConsumed: 'Units Consumed',
    unitsMax: '10000+',
    connLoad: 'Connected Load (W)',
    connLoadHint: 'Optional. Leave 0 for energy charge only — fixed charge applies automatically once you enter a load.',
    fixedCharge: 'Fixed Charge',
    fixedChargesTitle: 'Fixed Charges (bi-monthly)',
    connLoadCol: 'Connected Load',
    fixedPerBi: 'Fixed Charge per Bi-Month',
    above1kW: 'Above 1 kW',
    cliffTitle: 'The 500-Unit Cliff: Why Tier 2 Hurts',
    cliffP1: 'The biggest single jump in TANGEDCO’s domestic structure is not between slabs — it is between the two tiers. Cross 500 units bi-monthly and the subsidised free quota drops from 200 units to just 100 units. You also unlock the steep upper slabs (₹8.40 → ₹11.55 per unit).',
    cliffEx1: '200 free + 200 × ₹4.70 + 100 × ₹6.30 = ₹1,570 energy charge',
    cliffEx2: '100 free + 300 × ₹4.70 + 100 × ₹6.30 + 100 × ₹8.40 = ₹2,880 energy charge',
    cliffP2: '100 extra units added ₹1,310 to the bill — an effective rate of ₹13.10 per unit for the extra consumption (because both the lost subsidy and the new top slab hit at once).',
    cliffP3: 'This is precisely where a small solar system delivers outsized returns: even a 1 kW system generating 120–140 units bi-monthly can push you back under the 500-unit threshold, restoring the 200-unit subsidy and shaving off the ₹8.40 slab entirely.',
    printHint: 'Download / Print: Use Ctrl+P (or ⌘+P) to save this page as PDF — the table is print-optimised.',
    tariffSlabs: 'Tariff Slabs (\u20b9/unit)',
    addSlab: '+ Add slab',
    billSummary: 'Bill Summary',
    energyCharge: 'Energy Charge',
    totalBill: 'Total Bill',
    effectiveRate: 'Effective Rate / Unit',
    freeUnits: 'Free Units (Subsidy)',
    phFrom: 'From',
    phTo: 'To (\u221e)',
    phRate: 'Rate',
    perUnit: '/unit',

    taxH1: 'Income Tax Calculator',
    taxSub: 'Estimate your Indian income tax for FY 2025-26 (New & Old Regime).',
    taxRegime: 'Tax Regime',
    taxNew: 'New Regime',
    taxOld: 'Old Regime',
    taxAge: 'Age Category',
    ageBelow: 'Below 60',
    ageSenior: '60 - 80',
    ageSuper: '80 & above',
    taxIncome: 'Annual Income',
    ded80C: 'Section 80C Deduction',
    hraLbl: 'HRA Exemption',
    otherDed: 'Other Deductions (80D, etc.)',
    hintOld: '80C, HRA and other deductions apply only under the Old Regime. The New Regime allows only the standard deduction.',
    resultSummary: 'Tax Summary',
    stdDeduction: 'Standard Deduction',
    totalDeductions: 'Total Deductions',
    taxableIncome: 'Taxable Income',
    incomeTax: 'Income Tax',
    rebate: 'Rebate (Sec 87A)',
    cess: 'Health & Education Cess (4%)',
    totalTax: 'Total Tax Payable',
    effectiveRate: 'Effective Tax Rate',
    compareTitle: 'New vs Old Regime',
    lowerTax: 'gives the lower tax',
    note: 'Estimates for FY 2025-26. Illustrative only - not financial advice.',
    taxDesc: 'Estimate Indian income tax and compare New vs Old regime for FY 2025-26.',
    taxCta: 'Open calculator \u2192',

    irpartTitle: 'Irregular Part-Payment Calculator',
    irpartDesc: 'Plan a loan with irregular one-off part payments and see how they shorten the tenure or lower the EMI.',
    irpartCta: 'Open calculator \u2192',
    irpartH1: 'Irregular Part-Payment Calculator',
    irpartSub: 'Add one-off part payments at any month and see the impact',
    paymentsTitle: 'Part Payments',
    addPayment: '+ Add payment',
    payHint: 'Month = month from loan start (1 = first EMI month). Amount is the one-off part payment made that month.',
    pasteList: 'Or paste a list',
    loadList: 'Load from list',
    pasteFmt: 'One entry per line: Month,Amount (comma or space separated).',
    colMonth: 'Month',
    colPrepay: 'Prepay',
    addPrepay: '+ Prepay',
    modeLabel: 'Apply part payments to',
    noPayments: 'No part payments added yet.',
    pgIrpartTitle: 'Irregular Part-Payment EMI Calculator (Free)',
    pgIrpartDesc: 'Plan a loan with irregular one-off part payments and see how they shorten the tenure or lower the EMI, with a full amortization schedule.',

    offerTitle: 'Offer Letter Salary Split-up',
    offerDesc: 'Generate an ideal CTC break-up and verify the split-up in your job offer letter.',
    offerCta: 'Open calculator →',
    offerH1: 'Offer Letter Salary Split-up',
    offerSub: 'Generate an ideal CTC break-up and verify the split-up in your job offer letter.',
    genHint: 'A typical Indian structure keeps Basic at 40–50% of CTC. HRA is 50% of Basic; Employer PF and Gratuity are 12% and 4.81% of Basic respectively.',
    ctcLbl: 'Annual CTC',
    basicPctLbl: 'Basic % of CTC',
    refTitle: 'Salary Break-up (Reference)',
    colBasic: 'Basic',
    colHra: 'HRA',
    colSpecial: 'Special Allowance',
    colEmpPf: 'Employer PF',
    colGrat: 'Employer Gratuity',
    colTotalCtc: 'Total = CTC',
    takeHomeTitle: 'Take-Home Estimate',
    colEmpPfDed: 'Employee PF',
    colProfTax: 'Professional Tax',
    colIncTax: 'Est. Income Tax',
    colTakeHome: 'Est. Monthly In-Hand',
    taxNote: 'Income tax is a New-Regime estimate (FY 2025-26) and excludes HRA exemption, 80C, etc. Treat it as approximate.',
    verifyTitle: 'Verify Your Offer Letter',
    verifyHint: 'Enter the numbers exactly as printed in your offer letter. Leave a field blank if it is not mentioned. We check the split-up for internal consistency.',
    vBasicLbl: 'Basic',
    vHraLbl: 'HRA',
    vSpecialLbl: 'Special Allowance',
    vEmpPfLbl: 'Employer PF',
    vGratLbl: 'Employer Gratuity',
    vVarLbl: 'Variable / Other',
    vTravelLbl: 'Travel Allowance (LTA)',
    vMedLbl: 'Medical Insurance Premium',
    vEmpPfDedLbl: 'Employee PF (deducted)',
    vPtLbl: 'Prof. Tax / month',
    vInhandLbl: 'Stated Monthly In-Hand',
    checkTitle: 'Consistency Check',
    verifyDisclaimer: 'This is a sanity check, not financial advice. Employers may use different (valid) structures — a warning only means the number is worth double-checking.',
    verifyEmpty: 'Enter the figures from your offer letter above to run a consistency check.',
    chkSum: 'Components add up to CTC',
    matches: 'Matches CTC',
    vsCtc: 'vs CTC',
    chkEmpPf: 'Employer PF ≈ 12% of Basic',
    chkGrat: 'Gratuity ≈ 4.81% of Basic',
    chkEmpPfDed: 'Employee PF ≈ 12% of Basic',
    chkInhand: 'Monthly in-hand recomputed',
    exp: 'exp',
    notGiven: 'not given',
    stated: 'stated',
    verdictOk: 'Looks consistent — the split-up adds up.',
    verdictIssue: 'Check the items marked above before relying on this offer.',
    pgOfferTitle: 'Offer Letter Salary Split-up Generator & Verifier (Free)',
    pgOfferDesc: 'Generate an ideal Indian salary break-up (Basic, HRA, PF, Gratuity) from your CTC and verify the split-up shown in your job offer letter.'
  },
  ta: {
    heroTitle: '\u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd\u0b95\u0bb3\u0bcd',
    heroSub: '\u0ba4\u0bca\u0b9f\u0b99\u0bcd\u0b95 \u0b92\u0bb0\u0bc1 \u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bc8\u0ba4\u0bcd \u0ba4\u0bc7\u0bb0\u0bcd\u0ba8\u0bcd\u0ba4\u0bc6\u0b9f\u0bc1\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd',
    emiTitle: '\u0b87\u0b8e\u0bae\u0bcd\u0b90 \u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd',
    emiDesc: '\u0bb5\u0bc0\u0b9f\u0bcd\u0b9f\u0bc1\u0b95\u0bcd \u0b95\u0b9f\u0ba9\u0bcd, \u0b95\u0bbe\u0bb0\u0bcd \u0b95\u0b9f\u0ba9\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0ba4\u0ba9\u0bbf\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f \u0b87\u0b8e\u0bae\u0bcd\u0b90, \u0bae\u0bca\u0ba4\u0bcd\u0ba4 \u0bb5\u0b9f\u0bcd\u0b9f\u0bbf \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4 \u0ba4\u0bbf\u0b9f\u0bcd\u0b9f\u0bae\u0bcd.',
    emiCta: '\u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bc8\u0ba4\u0bcd \u0ba4\u0bbf\u0bb1 \u2192',
    precloseTitle: '\u0bae\u0bc1\u0ba9\u0bcd\u0b95\u0bc2\u0b9f\u0bcd\u0b9f\u0bb2\u0bcd (\u0b85)\u0baa\u0bbf\u0bb0\u0bbf\u0b95\u0bc1\u0bb3\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd',
    monthsDone: '\u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f \u0bae\u0bbe\u0ba4\u0b99\u0bcd\u0b95\u0bb3\u0bcd',
    partPay: '\u0ba4\u0bb1\u0bcd\u0baa\u0bcb\u0ba4\u0bc1 \u0b95\u0bc2\u0b9f\u0bc1\u0ba4\u0bb2\u0bcd \u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4\u0bc1\u0ba4 \u0ba4\u0bca\u0b95\u0bc8',
    outstanding: '\u0bae\u0bc0\u0ba4\u0bae\u0bc1\u0bb3\u0bcd\u0bb3 \u0b85\u0b9a\u0bb2\u0bcd',
    paidSoFar: '\u0b87\u0ba4\u0bc1\u0bb5\u0bb0\u0bc8 \u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4\u0bbf\u0baf \u0ba4\u0bca\u0b95\u0bc8',
    interestSaved: '\u0bae\u0bbf\u0b9a\u0bcd\u0b9a\u0baa\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0bbf\u0baf \u0bb5\u0b9f\u0bcd\u0b9f\u0bbf',
    closeNow: '\u0b87\u0baa\u0bcd\u0baa\u0bcb\u0ba4\u0bc1 \u0bae\u0bc2\u0b9f \u0bb5\u0bc7\u0ba3\u0bcd\u0b9f\u0bbf\u0baf \u0ba4\u0bca\u0b95\u0bc8',
    bankLbl: '\u0bb5\u0b99\u0bcd\u0b95\u0bbf (\u0bb5\u0bbf\u0bb0\u0bc1\u0baa\u0bcd\u0baa\u0bae\u0bcd)',
    chargeLbl: '\u0bae\u0bc1\u0ba9\u0bcd\u0b95\u0bc2\u0b9f\u0bcd\u0b9f\u0bc0\u0b9f\u0bcd\u0ba4\u0bc1 \u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0bae\u0bcd %',
    chargeNote: '\u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b9a\u0bc1\u0b9f\u0bcd\u0b9f\u0bbf\u0b95\u0bcd\u0b95\u0bbe\u0b9f\u0bcd\u0b9f\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f\u0bb5\u0bc8; \u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0bb5\u0b99\u0bcd\u0b95\u0bbf\u0baf\u0bbf\u0b9f\u0bae\u0bcd \u0b89\u0bb1\u0bc1\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0bb5\u0bc1\u0bae\u0bcd.',
    chargeAmtLbl: '\u0bae\u0bc1\u0ba9\u0bcd\u0b95\u0bc2\u0b9f\u0bcd\u0b9f\u0bc0\u0b9f\u0bcd\u0ba4\u0bc1 \u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0bae\u0bcd',
    precloseDisclaimer: '\u0b95\u0bbe\u0b9f\u0bcd\u0b9f\u0baa\u0b9f\u0bcd\u0b9f \u0ba4\u0bca\u0b95\u0bc8\u0b95\u0bb3\u0bcd \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1\u0b95\u0bb3\u0bcd \u0bae\u0b9f\u0bcd\u0b9f\u0bc1\u0bae\u0bc7. \u0bae\u0bca\u0ba4\u0bcd\u0ba4\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bb3\u0bcd, \u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0bb5\u0bbf\u0ba4\u0bbf\u0b95\u0bb3\u0bcd \u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0b95\u0bcb\u0bb3\u0bcd\u0b95\u0bca\u0bb3\u0bcd\u0bb3\u0bae\u0bbe\u0bb1\u0bcd\u0bb1\u0bae\u0bbe\u0b9f\u0bc1 \u0b89\u0ba3\u0bcd\u0bae\u0bc8\u0baf\u0ba9 \u0ba4\u0bca\u0b95\u0bc8 \u0b9a\u0bbf\u0bb1\u0bbf\u0ba4\u0bae\u0bcd \u0bb5\u0bc6\u0bb5\u0bc7\u0bb1\u0bc1\u0bae\u0bcd. \u0b87\u0ba4\u0bbf\u0bb0\u0b95\u0bcd \u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4 \u0bb5\u0bc7\u0ba3\u0bcd\u0b9f\u0bbf\u0baf \u0ba4\u0bca\u0b95\u0bc8\u0b95\u0bcd\u0b95\u0bc1 \u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0bb5\u0b99\u0bcd\u0b95\u0bbf\u0baf\u0bbf\u0b9f\u0bae\u0bcd \u0b89\u0bb1\u0bc1\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bb5\u0bc1\u0bae\u0bcd.',
    ebTitle: '\u0bae\u0bbf\u0ba9\u0bcd\u0b9a\u0bbe\u0bb0 \u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd',
    ebDesc: '\u0ba4\u0bbf\u0bb0\u0bc1\u0ba4\u0bcd\u0ba4\u0b95\u0bcd\u0b95\u0ba4 \u0baf\u0bc2\u0ba9\u0bbf\u0b9f\u0bcd\u0b9f\u0bc1\u0b95\u0bb3\u0bbf\u0bb2\u0bbf\u0bb0\u0bc1\u0ba8\u0bcd\u0ba4 \u0bae\u0bbe\u0bb1\u0bcd\u0bb1\u0ba4 \u0b9a\u0bcd\u0bb2\u0bbe\u0baa\u0bcd \u0bb5\u0bb0\u0bbf \u0baa\u0baf\u0ba9\u0bcd\u0baa\u0b9f\u0bc1\u0ba4\u0bc8\u0baf\u0bc1\u0ba8\u0bcd \u0ba4\u0bbf\u0bb0\u0bc1\u0ba4\u0bcd\u0ba4\u0bb2\u0bc1\u0b95\u0bcd \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bbf\u0b9f\u0bb5\u0bc1\u0bae\u0bcd.',
    ebCta: '\u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bc8\u0ba4\u0bcd \u0ba4\u0bbf\u0bb1 \u2192',
    footer: '\u0baa\u0baf\u0bb1\u0bcd\u0b9a\u0bbf\u0b95\u0bcd\u0b95\u0bbe\u0b95 \u0b89\u0bb0\u0bc1\u0bb5\u0bbe\u0b95\u0bcd\u0b95\u0baa\u0b9f\u0bcd\u0b9f\u0ba4\u0bc1. \u0ba4\u0bca\u0b95\u0bc8\u0b95\u0bb3\u0bcd \u0b87\u0bb0\u0ba3\u0bcd\u0b9f\u0bc1 \u0ba4\u0b9a\u0bae\u0b99\u0bcd\u0b95\u0bb3\u0bbf\u0bb2\u0bcd \u0bb5\u0b9f\u0bcd\u0b9f\u0bae\u0bbf\u0b9f\u0baa\u0baa\u0b9f\u0bc1\u0ba4\u0bc1.',

    back: '\u2190 \u0b85\u0ba9\u0bc8\u0ba4\u0bcd\u0ba4\u0bc1 \u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd\u0b95\u0bb3\u0bcd',
    emiH1: '\u0b87\u0b8e\u0bae\u0bcd\u0b90 \u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd',
    emiSub: '\u0bb5\u0bc0\u0b9f\u0bcd\u0b9f\u0bc1\u0b95\u0bcd \u0b95\u0b9f\u0ba9\u0bcd, \u0b95\u0bbe\u0bb0\u0bcd \u0b95\u0b9f\u0ba9\u0bcd & \u0ba4\u0ba9\u0bbf\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f \u0b95\u0b9f\u0ba9\u0bcd',
    tabHome: '\u0bb5\u0bc0\u0b9f\u0bcd\u0b9f\u0bc1\u0b95\u0bcd \u0b95\u0b9f\u0ba9\u0bcd',
    tabPersonal: '\u0ba4\u0ba9\u0bbf\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f \u0b95\u0b9f\u0ba9\u0bcd',
    tabCar: '\u0b95\u0bbe\u0bb0\u0bcd \u0b95\u0b9f\u0ba9\u0bcd',
    tabGold: '\u0ba4\u0b99\u0bcd\u0b95 \u0b95\u0b9f\u0ba9\u0bcd',
    goldRepay: '\u0ba4\u0b99\u0bcd\u0b95 \u0b95\u0b9f\u0ba9\u0bcd \u0ba4\u0bbf\u0bb0\u0bc1\u0baa\u0bcd\u0baa\u0bc1',
    goldEmi: '\u0b87\u0b8e\u0bae\u0bcd\u0b90',
    goldInterestOnly: '\u0bb5\u0b9f\u0bcd\u0b9f\u0bbf \u0bae\u0b9f\u0bcd\u0b9f\u0bc1\u0bae\u0bcd',
    goldInterestHint: '\u0b92\u0bb5\u0bcd\u0bb5\u0bc7\u0bb1\u0bc1 \u0b95\u0bbe\u0bb2\u0ba4\u0bcd\u0ba4\u0bbf\u0bb2\u0bcd \u0bb5\u0b9f\u0bcd\u0b9f\u0bbf\u0baf\u0bc8 \u0bae\u0b9f\u0bcd\u0b9f\u0bc1\u0bae\u0bcd; \u0bae\u0bc1\u0b9f\u0bbf\u0baf\u0bc1\u0bae\u0bcd \u0b85\u0b9a\u0bb2\u0bc8 \u0b95\u0b9f\u0ba9\u0bc1\u0ba4\u0bcd\u0ba4\u0bbf\u0ba9\u0bcd \u0b92\u0bb0\u0bc1 \u0ba4\u0bb5\u0ba3\u0bc8\u0baf\u0bbf\u0bb2\u0bcd \u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4\u0baa\u0b9f\u0bc1\u0bae\u0bcd.',
    loanAmount: '\u0b95\u0b9f\u0ba9\u0bcd \u0ba4\u0bca\u0b95\u0bc8',
    interestRate: '\u0bb5\u0b9f\u0bcd\u0b9f\u0bbf \u0bb5\u0bbf\u0b95\u0bbf\u0ba4\u0bae\u0bcd',
    loanTenure: '\u0b95\u0b9f\u0ba9\u0bcd \u0b95\u0bbe\u0bb2\u0bcd \u0b85\u0bb3\u0bb5\u0bc1',
    startDate: '\u0b95\u0b9f\u0ba9\u0bcd \u0ba4\u0bca\u0b9f\u0b99\u0bcd\u0b95 \u0ba4\u0bc7\u0ba4\u0bbf',
    emiScheme: '\u0b87\u0b8e\u0bae\u0bcd\u0b90 \u0ba4\u0bbf\u0b9f\u0bcd\u0b9f\u0bae\u0bcd',
    emiArrears: '\u0ba4\u0bbe\u0bae\u0ba4\u0baa\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0bca\u0bb0\u0bc1 \u0b87\u0b8e\u0bae\u0bcd\u0b90',
    emiAdvance: '\u0bae\u0bc1\u0ba9\u0bcd\u0baa\u0ba3\u0bc8 \u0b87\u0b8e\u0bae\u0bcd\u0b90',
    hint: '\u0bae\u0bc1\u0ba4\u0bb2\u0bcd \u0ba4\u0bb5\u0ba3\u0bc8 \u0bb5\u0bb4\u0b99\u0bcd\u0b95\u0bb2\u0bbf\u0bb2\u0bcd \u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4\u0baa\u0b9f\u0bc1\u0ba4\u0bc1\u0ba9\u0bcd \u0bae\u0bc1\u0ba9\u0bcd\u0baa\u0ba3\u0bc8 \u0b87\u0b8e\u0bae\u0bcd\u0b90 \u0bae\u0bca\u0ba4\u0bcd\u0ba4 \u0bb5\u0b9f\u0bcd\u0b9f\u0bbf\u0baf\u0bc1\u0bae\u0bcd \u0b95\u0bc1\u0bb1\u0bc8\u0b95\u0bcd\u0b95\u0bbf\u0bb1\u0ba4\u0bc1.',
    regPartLabel: '\u0ba4\u0bca\u0b9f\u0bb0\u0bcd \u0b95\u0bc2\u0b9f\u0bc1\u0ba4\u0bb2\u0bcd \u0ba4\u0bb5\u0ba3\u0bc8',
    regPartHint: '\u0b92\u0bb5\u0bcd\u0bb5\u0bc7\u0bb1\u0bc1 \u0bae\u0bbe\u0ba4\u0bae\u0bcd \u0b85\u0bb2\u0bcd\u0bb3\u0bc6\u0ba4\u0bcd\u0ba4\u0bc1 \u0b95\u0bc2\u0b9f\u0bc1\u0ba4\u0bb2\u0bbe\u0b95 \u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4\u0bc1\u0ba4 \u0ba4\u0bca\u0b95\u0bc8 \u0b85\u0b9a\u0bb2\u0bc8\u0b95\u0bcd \u0b95\u0bc1\u0bb1\u0bc8\u0ba4\u0bcd\u0ba4\u0bc1, \u0bae\u0bca\u0ba4\u0bcd\u0ba4 \u0bb5\u0b9f\u0bcd\u0b9f\u0bbf\u0baf\u0bc1\u0bae\u0bcd \u0b95\u0bc1\u0bb1\u0bc8\u0ba4\u0bcd\u0ba4\u0bc1 \u0b95\u0b9f\u0ba9\u0bc8 \u0bae\u0bc1\u0ba9\u0bcd\u0b95\u0bc2\u0b9f\u0bcd\u0b9f\u0bbf \u0bae\u0bc1\u0b9f\u0bbf\u0b95\u0bcd\u0b95\u0bbf\u0bb1\u0ba4\u0bc1. \u0b87\u0b8e\u0bae\u0bcd\u0b90 \u0b85\u0baa\u0bcd\u0baa\u0b9f\u0bbf\u0baf\u0bc7 \u0b87\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0baa\u0b9f\u0bc1\u0bae\u0bcd; \u0b95\u0bbe\u0bb2 \u0b85\u0bb5\u0b95\u0bbe\u0b9a\u0bae\u0bcd \u0bae\u0b9f\u0bcd\u0b9f\u0bc1\u0bae\u0bc7 \u0b95\u0bc1\u0bb1\u0bc8\u0baf\u0bc1\u0bae\u0bcd.',
    everyMonth: '\u0b92\u0bb5\u0bcd\u0bb5\u0bc7\u0bb1\u0bc1 \u0bae\u0bbe\u0ba4\u0bae\u0bc1\u0bae\u0bcd',
    everyYear: '\u0b92\u0bb5\u0bcd\u0bb5\u0bc7\u0bb1\u0bc1 \u0b86\u0b83\u0b9f\u0bc1\u0bae\u0bc1\u0bae\u0bcd',
    shortenTenure: '\u0b95\u0bbe\u0bb2 \u0b85\u0bb5\u0b95\u0bbe\u0b9a\u0ba4\u0bcd\u0ba4\u0bc8 \u0b95\u0bc1\u0bb1\u0bc8',
    reduceEmi: '\u0b87\u0b8e\u0bae\u0bcd\u0b90\u0baf\u0bc8 \u0b95\u0bc1\u0bb1\u0bc8',
    closesIn: '\u0b95\u0b9f\u0ba9\u0bcd \u0bae\u0bc1\u0b9f\u0bbf\u0baf\u0bc1\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bae\u0bcd',
    summary: '\u0b9a\u0bc1\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bae\u0bcd',
    loanEmi: '\u0b95\u0b9f\u0ba9\u0bcd \u0b87\u0b8e\u0bae\u0bcd\u0b90',
    totalInterest: '\u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4 \u0bb5\u0bc7\u0ba3\u0bcd\u0b9f\u0bbf\u0baf \u0bae\u0bca\u0ba4\u0bcd\u0ba4 \u0bb5\u0b9f\u0bcd\u0b9f\u0bbf',
    totalPayment: '\u0bae\u0bca\u0ba4\u0bcd\u0ba4 \u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4 \u0ba4\u0bca\u0b95\u0bc8 (\u0b85\u0b9a\u0bb2\u0bcd + \u0bb5\u0b9f\u0bcd\u0b9f\u0bbf)',
    breakUp: '\u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4 \u0ba4\u0bca\u0b95\u0bc8 \u0baa\u0bbf\u0bb0\u0bbf\u0bb5\u0bc1',
    principalLbl: '\u0b85\u0b9a\u0bb2\u0bcd',
    interestLbl: '\u0bb5\u0b9f\u0bcd\u0b9f\u0bbf',
    schedule: '\u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4 \u0ba4\u0bbf\u0b9f\u0bcd\u0b9f\u0bae\u0bcd',
    yearWise: '\u0b86\u0b83\u0b9f\u0bc1 \u0bb5\u0bbe\u0bb0\u0bbf\u0baf\u0bbe\u0b95',
    monthWise: '\u0bae\u0bbe\u0ba4 \u0bb5\u0bbe\u0bb0\u0bbf\u0baf\u0bbe\u0b95',
    colPayment: '\u0b9a\u0bc6\u0bb2\u0bc1\u0ba4\u0bcd\u0ba4 \u0ba4\u0bca\u0b95\u0bc8',
    colPrincipal: '\u0b85\u0b9a\u0bb2\u0bcd',
    colInterest: '\u0bb5\u0b9f\u0bcd\u0b9f\u0bbf',
    colBalance: '\u0bae\u0bc0\u0ba4\u0bbf',
    year: '\u0b86\u0b83\u0b9f\u0bc1',
    month: '\u0bae\u0bbe\u0ba4\u0bae\u0bcd',
    validMsg: '\u0bae\u0bc1\u0b9f\u0bbf\u0bb5\u0bc8 \u0b95\u0bbe\u0bb3\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd \u0bb5\u0bbf\u0bb5\u0bb0\u0b99\u0bcd\u0b95\u0bb3\u0bc8\u0b95\u0bcd \u0b9a\u0bb0\u0bbf\u0baf\u0bc1 \u0b89\u0bb3\u0bcd\u0bb3\u0bbf\u0b9f\u0bb5\u0bc1\u0bae\u0bcd.',
    principalCenter: '\u0b85\u0b9a\u0bb2\u0bcd',

    ebH1: '\u0bae\u0bbf\u0ba9\u0bcd\u0b9a\u0bbe\u0bb0 \u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd',
    ebSub: '\u0ba4\u0bbf\u0bb0\u0bc1\u0ba4\u0bcd\u0ba4\u0b95\u0bcd\u0b95\u0ba4 \u0baf\u0bc2\u0ba9\u0bbf\u0b9f\u0bcd\u0b9f\u0bc1\u0b95\u0bb3\u0bbf\u0bb2\u0bbf\u0bb0\u0bc1\u0ba8\u0bcd\u0ba4 \u0bae\u0bbe\u0bb1\u0bcd\u0bb1\u0ba4 \u0b9a\u0bcd\u0bb2\u0bbe\u0baa\u0bcd \u0bb5\u0bb0\u0bbf \u0baa\u0baf\u0ba9\u0bcd\u0baa\u0b9f\u0bc1\u0ba4\u0bc8\u0baf\u0bc1\u0ba8\u0bcd \u0ba4\u0bbf\u0bb0\u0bc1\u0ba4\u0bcd\u0ba4\u0bb2\u0bc1\u0b95\u0bcd \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bbf\u0b9f\u0bb5\u0bc1\u0bae\u0bcd.',
    unitsConsumed: '\u0ba8\u0bc1\u0b95\u0bb0\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f \u0baf\u0bc2\u0ba9\u0bbf\u0b9f\u0bcd\u0b9f\u0bc1\u0b95\u0bb3\u0bcd',
    unitsMax: '10000+',
    connLoad: 'Connected Load (W)',
    connLoadHint: 'Optional. 0 vaithaal energy charge matum thaan (fixed charge 0). Load podina fixed charge automatic-a varum.',
    fixedCharge: '\u0ba8\u0bbf\u0bb2\u0bc8\u0baf\u0bbe\u0ba9 \u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0bae\u0bcd',
    fixedChargesTitle: 'Fixed Charges (bi-monthly)',
    connLoadCol: 'Connected Load',
    fixedPerBi: 'Fixed Charge per Bi-Month',
    above1kW: 'Above 1 kW',
    cliffTitle: 'The 500-Unit Cliff: Why Tier 2 Hurts',
    cliffP1: 'The biggest single jump in TANGEDCO’s domestic structure is not between slabs — it is between the two tiers. Cross 500 units bi-monthly and the subsidised free quota drops from 200 units to just 100 units. You also unlock the steep upper slabs (₹8.40 → ₹11.55 per unit).',
    cliffEx1: '200 free + 200 × ₹4.70 + 100 × ₹6.30 = ₹1,570 energy charge',
    cliffEx2: '100 free + 300 × ₹4.70 + 100 × ₹6.30 + 100 × ₹8.40 = ₹2,880 energy charge',
    cliffP2: '100 extra units added ₹1,310 to the bill — an effective rate of ₹13.10 per unit for the extra consumption (because both the lost subsidy and the new top slab hit at once).',
    cliffP3: 'This is precisely where a small solar system delivers outsized returns: even a 1 kW system generating 120–140 units bi-monthly can push you back under the 500-unit threshold, restoring the 200-unit subsidy and shaving off the ₹8.40 slab entirely.',
    printHint: 'Download / Print: Use Ctrl+P (or ⌘+P) to save this page as PDF — the table is print-optimised.',
    tariffSlabs: '\u0bb5\u0bb0\u0bbf \u0bb8\u0bcd\u0bb2\u0bbe\u0baa\u0bcd\u0b95\u0bb3\u0bcd (\u20b9/\u0baf\u0bc2\u0ba9\u0bbf\u0b9f\u0bcd\u0b9f\u0bc1)',
    addSlab: '+ \u0bb8\u0bcd\u0bb2\u0bbe\u0baa\u0bcd \u0b9a\u0bc7\u0bb0\u0bcd',
    billSummary: '\u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0bae\u0bcd \u0b9a\u0bc1\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bae\u0bcd',
    energyCharge: '\u0b86\u0bb1\u0bcd\u0bb1\u0bb2\u0bcd \u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0bae\u0bcd',
    totalBill: '\u0bae\u0bca\u0ba4\u0bcd\u0ba4 \u0b95\u0b9f\u0bcd\u0b9f\u0ba3\u0bae\u0bcd',
    effectiveRate: '\u0baa\u0baf\u0ba9\u0bcd\u0baa\u0b9f\u0bc1\u0ba4 \u0bb5\u0bbf\u0b95\u0bbf\u0ba4\u0bae\u0bcd / \u0baf\u0bc2\u0ba9\u0bbf\u0b9f\u0bcd\u0b9f\u0bc1',
    freeUnits: '\u0b87\u0bb2\u0bc8\u0baf\u0bbe\u0ba9 \u0baf\u0bc2\u0ba9\u0bbf\u0b9f\u0bcd\u0b9f\u0bc1\u0b95\u0bb3\u0bcd',
    phFrom: '\u0b87\u0bb0\u0bc1\u0ba8\u0bcd\u0ba4\u0bc1',
    phTo: '\u0bb5\u0bb0\u0bc8 (\u221e)',
    phRate: '\u0bb5\u0bbf\u0b95\u0bbf\u0ba4\u0bae\u0bcd',
    perUnit: '/\u0baf\u0bc2\u0ba9\u0bbf\u0b9f\u0bcd\u0b9f\u0bc1',

    taxH1: '\u0bb5\u0bb0\u0bc1\u0bae\u0bbe\u0ba9 \u0bb5\u0bb0\u0bbf \u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd',
    taxSub: '\u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bbf\u0ba9\u0bcd \u0bb5\u0bb0\u0bc1\u0bae\u0bbe\u0ba9 \u0bb5\u0bb0\u0bbf (FY 2025-26) \u0baa\u0bc1\u0ba4\u0bbf\u0baf \u0bae\u0bc1\u0bb1\u0bc8 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bcd.',
    taxRegime: '\u0bb5\u0bb0\u0bbf \u0bae\u0bc1\u0bb1\u0bc8',
    taxNew: '\u0baa\u0bc1\u0ba4\u0bbf\u0baf \u0bae\u0bc1\u0bb1\u0bc8',
    taxOld: '\u0baa\u0bb4\u0bc8\u0baf \u0bae\u0bc1\u0bb1\u0bc8',
    taxAge: '\u0bb5\u0baf\u0bb8\u0bcd \u0b9a\u0bbf\u0bb1\u0baa\u0bcd\u0baa\u0bc1',
    ageBelow: '60 \u0b95\u0bc0\u0bb4\u0bc7',
    ageSenior: '60 - 80',
    ageSuper: '80 \u0bae\u0bc7\u0bb2\u0bc1\u0bae\u0bcd',
    taxIncome: '\u0b86\u0ba3\u0bcd\u0b9f\u0bc1 \u0bb5\u0bb0\u0bc1\u0bb5\u0bbe\u0baf\u0bae\u0bcd',
    ded80C: '\u0b9a\u0bc6\u0b95\u0bcd\u0bb7\u0ba9\u0bcd 80C \u0b95\u0bb3\u0bbf\u0bb1\u0bcd\u0b95\u0bbf\u0bb4\u0ba4\u0bcd\u0ba4\u0bc1',
    hraLbl: 'HRA \u0bb5\u0bbf\u0bb4\u0bc1\u0bb5\u0bbe\u0bae\u0bcd',
    otherDed: '\u0bae\u0bb1\u0bcd\u0bb1\u0bc1 \u0b95\u0bb3\u0bbf\u0bb1\u0bcd\u0b95\u0bbf\u0bb4\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bb3\u0bcd (80D \u0bae\u0bc1.)',
    hintOld: '\u0b9a\u0bc6\u0b95\u0bcd\u0bb7\u0ba9\u0bcd 80C, HRA \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0baa\u0bb4\u0bc8\u0baf \u0bae\u0bc1\u0bb1\u0bc8\u0baf\u0bbf\u0bb2\u0bcd \u0baa\u0baf\u0ba9\u0baa\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0bbe\u0bb2\u0bcd \u0baa\u0bcd\u0bb0\u0baf\u0bcb\u0b95\u0bcd\u0b95\u0baa\u0b9f\u0bc1\u0bae\u0bcd. \u0baa\u0bc1\u0ba4\u0bbf\u0baf \u0bae\u0bc1\u0bb1\u0bc8\u0baf\u0bbf\u0bb2\u0bcd \u0b9a\u0bbf\u0b9f\u0bcd\u0b9f \u0ba4\u0b9f\u0bcd\u0b9f\u0bb5\u0bc1 \u0b95\u0bb3\u0bbf\u0bb1\u0bcd\u0b95\u0bbf\u0bb4\u0ba4\u0bcd\u0ba4\u0bc1 \u0bae\u0b9f\u0bcd\u0b9f\u0bc1\u0bae\u0bcd.',
    resultSummary: '\u0bb5\u0bb0\u0bbf \u0b9a\u0bc1\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bae\u0bcd',
    stdDeduction: '\u0b9a\u0bbf\u0b9f\u0bcd\u0b9f \u0b95\u0bb3\u0bbf\u0bb1\u0bcd\u0b95\u0bbf\u0bb4\u0ba4\u0bcd\u0ba4\u0bc1',
    totalDeductions: '\u0bae\u0bca\u0ba4\u0bcd\u0ba4 \u0b95\u0bb3\u0bbf\u0bb1\u0bcd\u0b95\u0bbf\u0bb4\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bb3\u0bcd',
    taxableIncome: '\u0bb5\u0bb0\u0bbf\u0b95\u0bcd\u0b95\u0bc1\u0bb0\u0bbf\u0baf \u0bb5\u0bb0\u0bc1\u0bb5\u0bbe\u0baf\u0bae\u0bcd',
    incomeTax: '\u0bb5\u0bb0\u0bc1\u0bb5\u0bc1 \u0bb5\u0bb0\u0bbf',
    rebate: '\u0b95\u0bb1\u0bb1\u0bc1\u0baa\u0bcd\u0baa\u0bc1 (\u0b9a\u0bc6\u0b95\u0bcd\u0bb7\u0ba9\u0bcd 87A)',
    cess: '\u0b9a\u0bc1\u0b95\u0bbe\u0ba4\u0bbe\u0bb0 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd & \u0b95\u0bb2\u0bcd\u0bb5\u0bbf (4%)',
    totalTax: '\u0bae\u0bca\u0ba4\u0bcd\u0ba4 \u0bb5\u0bb0\u0bbf \u0b95\u0b9f\u0ba9\u0bcd\u0b9f\u0bb5\u0bc1\u0bae\u0bcd',
    effectiveRate: '\u0ba8\u0bc1\u0b9f\u0baa\u0b9f\u0bbf\u0b9f \u0bb5\u0bb0\u0bbf \u0bb5\u0bbf\u0b95\u0bbf\u0ba4\u0bae\u0bcd',
    compareTitle: '\u0baa\u0bc1\u0ba4\u0bbf\u0baf vs \u0baa\u0bb4\u0bc8\u0baf \u0bae\u0bc1\u0bb1\u0bc8',
    lowerTax: '\u0b95\u0bc1\u0bb1\u0bc8\u0baf \u0bb5\u0bb0\u0bbf \u0b95\u0bc1\u0bb1\u0bc8\u0bb5\u0bbe\u0b95 \u0b89\u0bb3\u0bcd\u0bb3\u0ba4\u0bc1',
    note: 'FY 2025-26 \u0b95\u0bcd\u0b95\u0bbe\u0ba9 \u0b95\u0ba3\u0b95\u0bcd\u0b95\u0bc1\u0baa\u0bbf\u0b9f\u0bb5\u0bc1\u0bae\u0bcd. \u0b87\u0ba4\u0bc1 \u0b89\u0ba4\u0bbe\u0bb0\u0ba3\u0bae\u0bbe\u0ba9 \u0b95\u0bbe\u0b9f\u0bcd\u0b9f\u0bbf\u0b9f\u0bae\u0bcd \u0bae\u0b9f\u0bcd\u0b9f\u0bc1\u0bae\u0bcd.',
    taxDesc: '\u0b87\u0ba8\u0bcd\u0ba4\u0bbf\u0baf \u0bb5\u0bb0\u0bc1\u0bae\u0bbe\u0ba9 \u0bb5\u0bb0\u0bbf\u0baf\u0bc8 \u0b95\u0ba3\u0b95\u0bcd\u0b95\u0bc1\u0baa\u0bbf\u0b9f\u0bcd\u0b9f\u0bc1 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0baa\u0bc1\u0ba4\u0bbf\u0baf vs \u0baa\u0bb4\u0bc8\u0baf \u0bae\u0bc1\u0bb1\u0bc8\u0baf\u0bc8 FY 2025-26 \u0bb2\u0bbf\u0ba4\u0bcd \u0b8f\u0ba9\u0bcd\u0baa\u0bbf\u0b9f\u0bc1\u0b95\u0bcd\u0b95\u0baa\u0b9f\u0bc1\u0bae\u0bcd.',
    taxCta: '\u0b95\u0bbe\u0bb2\u0bcd\u0b95\u0bc1\u0bb2\u0bc7\u0b9f\u0bcd\u0b9f\u0bb0\u0bc8\u0ba4\u0bcd \u0ba4\u0bbf\u0bb1 \u2192',
    pgIndexTitle: 'கணக்கீட்டாளர்கள் - இலவச இஎம்ஐ, எப் பில் & வருமான வரி கால்குலேட்டர்',
    pgIndexDesc: 'இலவச இணைய கணக்கீட்டாளர்கள்: வீட்டுக் கடன், கார் கடன் மற்றும் தனிப்பட்ட கடன் இஎம்ஐ, மின்சார பில் (EB) மற்றும் இந்திய வருமான வரி.',
    pgEmiTitle: 'இஎம்ஐ கால்குலேட்டர் - வீடு, கார் & தனிப்பட்ட கடன் (இலவச)',
    pgEmiDesc: 'வீடு, கார் மற்றும் தனிப்பட்ட கடன் இஎம்ஐ கணக்கிடுங்கள். மொத்த வட்டி, மொத்த செலுத்துத் தொகை, அசல் எதிர் வட்டி விளக்கப்படம் மற்றும் ஆண்டு/மாத அட்டவணையைப் பார்க்கவும்.',
    pgEbTitle: 'எப் பில் கால்குலேட்டர் - யூனிட்களிலிருந்து மின்சார பில் (இலவச)',
    pgEbDesc: 'நுகரப்பட்ட யூனிட்களிலிருந்து உங்கள் மின்சார (EB) பில்லை எடிட் செய்யக்கூடிய ஸ்லாப் கட்டணங்கள் மற்றும் நிலையான கட்டணத்துடன் மதிப்பிடுங்கள்.',
    pgTaxTitle: 'வருமான வரி கால்குலேட்டர் - புதிய & பழைய முறை (FY 2025-26)',
    pgTaxDesc: 'உங்கள் இந்திய வருமான வரியை (FY 2025-26) புதிய மற்றும் பழைய முறையில் மதிப்பிடுங்கள்; பிரிவு 87A குறைப்பு, 80C, HRA மற்றும் இரு முறைகளையும் ஒப்பிடுங்கள்.',

    irpartTitle: 'ஒழுங்கற்ற கூடுதல் தவணை கால்குலேட்டர்',
    irpartDesc: 'ஒழுங்கற்ற ஒருமுறை கூடுதல் தவணைகளுடன் கடனைத் திட்டமிட்டு, அவை கால அவகாசத்தைக் குறைக்கின்றனவா அல்லது இஎம்ஐயைக் குறைக்கின்றனவா எனப் பாருங்கள்.',
    irpartCta: 'கால்குலேட்டரைத் திறக்க \u2192',
    irpartH1: 'ஒழுங்கற்ற கூடுதல் தவணை கால்குலேட்டர்',
    irpartSub: 'எந்த மாதத்திலும் ஒருமுறை கூடுதல் தவணைகளைச் சேர்த்து அதன் தாக்கத்தைப் பாருங்கள்',
    paymentsTitle: 'கூடுதல் தவணைகள்',
    addPayment: '+ தவணை சேர்',
    payHint: 'மாதம் = கடன் தொடக்கத்திலிருந்து மாதம் (1 = முதல் இஎம்ஐ மாதம்). தொகை அம்மாதம் செலுத்தும் ஒருமுறை கூடுதல் தவணை.',
    pasteList: 'அல்லது பட்டியலை ஒட்டவும்',
    loadList: 'பட்டியலிலிருந்து ஏற்றவும்',
    pasteFmt: 'வரிக்கு ஒன்று: மாதம்,தொகை (காற்புள்ளி அல்லது இடைவெளியால் பிரிக்கவும்).',
    colMonth: 'மாதம்',
    colPrepay: 'முன்கட்டணம்',
    addPrepay: '+ முன்கட்டணம்',
    modeLabel: 'கூடுதல் தவணைகளை பயன்படுத்து',
    noPayments: 'இதுவரை கூடுதல் தவணைகள் எதுவும் சேர்க்கப்படவில்லை.',
    pgIrpartTitle: 'ஒழுங்கற்ற கூடுதல் தவணை இஎம்ஐ கால்குலேட்டர் (இலவசம்)',
    pgIrpartDesc: 'ஒழுங்கற்ற ஒருமுறை கூடுதல் தவணைகளுடன் கடனைத் திட்டமிட்டு, அவை கால அவகாசத்தைக் குறைக்கின்றனவா அல்லது இஎம்ஐயைக் குறைக்கின்றனவா என முழு அட்டவணையுடன் பாருங்கள்.',
    offerTitle: 'ஆஃபர் லெட்டர் சம்பளப் பிரிவு',
    offerDesc: 'ஒரு நிலையான CTC பிரிவை உருவாக்கவும் மற்றும் உங்கள் வேலை ஆஃபர் கடிதத்தில் உள்ள பிரிவைச் சரிபார்க்கவும்.',
    offerCta: 'கால்குலேட்டரைத் திறக்க →',
    vTravelLbl: 'பயணப்படி (LTA)',
    vMedLbl: 'மருத்துவக் காப்பீட்டுக் கட்டணம்',
    pgOfferTitle: 'ஆஃபர் லெட்டர் சம்பளப் பிரிவு உருவாக்கி & சரிபார்ப்பான (இலவசம்)',
    pgOfferDesc: 'உங்கள் CTC-இலிருந்து ஒரு நிலையான இந்திய சம்பளப் பிரிவை (அடிப்படை, HRA, PF, கிராட்டுவிட்டி) உருவாக்கவும் மற்றும் உங்கள் வேலை ஆஃபர் கடிதப் பிரிவைச் சரிபார்க்கவும்.'
  }
};

var currentLang = (function () {
  try {
    var p = new URLSearchParams(location.search).get('lang');
    if (p === 'ta' || p === 'en') return p;
    return localStorage.getItem('lang') || 'en';
  } catch (e) { return 'en'; }
})();

function t(key) {
  var dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  if (dict[key] !== undefined) return dict[key];
  if (TRANSLATIONS.en[key] !== undefined) return TRANSLATIONS.en[key];
  return key;
}

var PAGE = (function () {
  var m = document.querySelector('meta[name="i18n-page"]');
  return m ? m.getAttribute('content') : '';
})();

var _origTitle = document.title;
var _mDesc = document.querySelector('meta[name="description"]');
var _mOgT = document.querySelector('meta[property="og:title"]');
var _mOgD = document.querySelector('meta[property="og:description"]');
var _origDesc = _mDesc ? _mDesc.getAttribute('content') : '';
var _origOgT = _mOgT ? _mOgT.getAttribute('content') : '';
var _origOgD = _mOgD ? _mOgD.getAttribute('content') : '';

var META_KEYS = {
  index: ['pgIndexTitle', 'pgIndexDesc'],
  emi: ['pgEmiTitle', 'pgEmiDesc'],
  eb: ['pgEbTitle', 'pgEbDesc'],
  tax: ['pgTaxTitle', 'pgTaxDesc'],
  irpart: ['pgIrpartTitle', 'pgIrpartDesc'],
  offer: ['pgOfferTitle', 'pgOfferDesc']
};

function setMetaContent(name, content) {
  if (content == null) return;
  var el = document.head.querySelector('meta[name="' + name + '"], meta[property="' + name + '"]');
  if (el) el.setAttribute('content', content);
}

function applyMeta(lang) {
  var keys = META_KEYS[PAGE];
  if (lang === 'ta' && keys) {
    var title = t(keys[0]);
    var desc = t(keys[1]);
    document.title = title;
    setMetaContent('description', desc);
    setMetaContent('og:title', title);
    setMetaContent('og:description', desc);
  } else {
    document.title = _origTitle;
    setMetaContent('description', _origDesc);
    setMetaContent('og:title', _origOgT);
    setMetaContent('og:description', _origOgD);
  }
}

function applyCanonical(lang) {
  var c = document.querySelector('link[rel="canonical"]');
  if (!c) return;
  var base = location.origin + location.pathname;
  c.setAttribute('href', lang === 'ta' ? base + '?lang=ta' : base);
}

function syncUrl(lang) {
  try {
    var url = new URL(location.href);
    if (lang === 'ta') url.searchParams.set('lang', 'ta'); else url.searchParams.delete('lang');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  } catch (e) {}
}

function applyLanguage(lang) {
  currentLang = lang;
  try { localStorage.setItem('lang', lang); } catch (e) {}
  document.documentElement.lang = lang === 'ta' ? 'ta' : 'en';
  applyMeta(lang);
  applyCanonical(lang);
  syncUrl(lang);

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
  document.querySelectorAll('.lang-switch button').forEach(function (b) {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });

  document.dispatchEvent(new Event('langchange'));
}

function initLang() {
  var sw = document.querySelector('.lang-switch');
  if (sw) {
    sw.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { applyLanguage(b.getAttribute('data-lang')); });
    });
  }
  applyLanguage(currentLang);
}

// ---------- Home landing (data-driven) ----------
// To add a calculator, append one entry here (no HTML/CSS edits required).
var CALCULATORS = [
  { id: 'emi', href: 'emi.html',    icon: '💰', accent: '#2563eb', titleKey: 'emiTitle', descKey: 'emiDesc', ctaKey: 'emiCta' },
  { id: 'eb',  href: 'ebbill.html', icon: '⚡',  accent: '#f59e0b', titleKey: 'ebTitle',  descKey: 'ebDesc',  ctaKey: 'ebCta' },
  { id: 'tax', href: 'tax.html',    icon: '🧾', accent: '#16a34a', titleKey: 'taxH1',   descKey: 'taxDesc', ctaKey: 'taxCta' },
  { id: 'irpart', href: 'irpart.html', icon: '💸', accent: '#7c3aed', titleKey: 'irpartTitle', descKey: 'irpartDesc', ctaKey: 'irpartCta' },
  { id: 'offer', href: 'offer.html', icon: '📄', accent: '#db2777', titleKey: 'offerTitle', descKey: 'offerDesc', ctaKey: 'offerCta' }
];

function renderLanding() {
  var main = document.querySelector('main.landing');
  if (!main) return;
  main.innerHTML = '';
  CALCULATORS.forEach(function (c) {
    var a = document.createElement('a');
    a.className = 'calc-card ' + c.id;
    a.href = c.href;
    a.style.borderTop = '5px solid ' + c.accent;
    a.innerHTML =
      '<div class="calc-icon">' + c.icon + '</div>' +
      '<h2 data-i18n="' + c.titleKey + '">' + t(c.titleKey) + '</h2>' +
      '<p data-i18n="' + c.descKey + '">' + t(c.descKey) + '</p>' +
      '<span class="calc-cta" data-i18n="' + c.ctaKey + '">' + t(c.ctaKey) + '</span>';
    main.appendChild(a);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () { renderLanding(); initLang(); });
} else {
  renderLanding(); initLang();
}

// Register the service worker for PWA (installable + offline use)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
}

// In-app update: only show the Download/Update button when a newer APK version exists.
// On the website (non-native) the Download button always shows as usual.
function initAppUpdate() {
  var dl = document.querySelector('.app-download');
  var isNative = !!(window.Capacitor && (Capacitor.isNativePlatform ? Capacitor.isNativePlatform() :
    (Capacitor.getPlatform && Capacitor.getPlatform() === 'android')));
  if (!isNative) return; // website: keep the Download APK button visible

  // Inside the app, hide it by default; reveal only if a newer version is available.
  if (dl) dl.hidden = true;
  var box = document.getElementById('appUpdate');
  if (box) box.hidden = true;

  if (!(window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.App)) return;
  var App = Capacitor.Plugins.App;
  Promise.all([
    App.getInfo(),
    fetch('https://simplecalculator.in/version.json?ts=' + Date.now())
      .then(function (r) { return r.json(); })
      .catch(function () { return null; })
  ]).then(function (res) {
    var info = res[0];
    var latest = res[1];
    if (!latest) return; // can't determine -> show nothing (don't spoil layout)
    var instCode = parseInt(info.build, 10);
    var latestCode = parseInt(latest.versionCode, 10);
    if (instCode !== latestCode && dl) {
      dl.hidden = false;
      dl.textContent = '📱 Update / Reinstall App (APK)';
      dl.href = latest.apkUrl || 'https://simplecalculator.in/downloads/app-release.apk';
    }
    // same version -> leave hidden (nothing shown)
  }).catch(function () { /* leave hidden */ });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAppUpdate);
} else {
  initAppUpdate();
}
