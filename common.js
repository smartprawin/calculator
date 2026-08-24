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
    vVarCapLbl: 'Variable % of CTC',
    chkVarpct: 'Variable pay within typical limit',
    ofCtc: 'of CTC',
    typicalLimit: 'typical limit',
    vTravelLbl: 'Travel Allowance (LTA)',
    vMedLbl: 'Medical Insurance Premium',
    vGrossLbl: 'Gross Salary',
    vTakeHomeLbl: 'Est. Monthly In-Hand',
    vTotalLbl: 'Total (CTC)',
    inhandNote: 'Monthly in-hand is usually not printed in offer letters — this is the computed value from your entries.',
    btnPdf: '📄 Save as PDF',
    btnCsv: '📊 Download Excel',
    computedLbl: 'Computed',
    statusLbl: 'Status',
    detailLbl: 'Detail',
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
    chkInhandPrompt: 'Please enter the Stated Monthly In-Hand to verify take-home.',
    exp: 'exp',
    notGiven: 'not given',
    stated: 'stated',
    verdictOk: 'Looks consistent — the split-up adds up.',
    verdictIssue: 'Check the items marked above before relying on this offer.',
    pgOfferTitle: 'Offer Letter Salary Split-up Generator & Verifier (Free)',
    pgOfferDesc: 'Generate an ideal Indian salary break-up (Basic, HRA, PF, Gratuity) from your CTC and verify the split-up shown in your job offer letter.',

    payslipTitle: 'Payslip vs Offer Letter',
    payslipDesc: 'Compare your annual offer-letter salary split-up with your monthly payslip and flag mismatches.',
    payslipCta: 'Open calculator →',
    psH1: 'Payslip vs Offer Letter',
    psSub: 'Compare your annual offer-letter split-up with your monthly payslip.',
    psOfferH1: 'Offer Letter (Annual)',
    psPayslipH1: 'Payslip (Monthly)',
    oBasicLbl: 'Basic',
    oHraLbl: 'HRA',
    oSpecialLbl: 'Special Allowance',
    oEmpPfLbl: 'Employer PF',
    oGratLbl: 'Employer Gratuity',
    oVarLbl: 'Variable (annual)',
    oTravelLbl: 'Travel Allowance (LTA)',
    oMedLbl: 'Medical Insurance',
    oInhandLbl: 'Stated Monthly In-Hand',
    pBasicLbl: 'Basic',
    pHraLbl: 'HRA',
    pSpecialLbl: 'Special / Allowances',
    pEmpPfLbl: 'Employee PF',
    pTravelLbl: 'Travel Allowance (LTA)',
    pMedLbl: 'Medical Insurance',
    pPtLbl: 'Professional Tax',
    pTaxLbl: 'Income Tax (TDS)',
    pNetLbl: 'Net Paid (In-Hand)',
    cmpTax: 'Income Tax',
    cmpTravel: 'Travel Allowance',
    cmpMed: 'Medical Insurance',
    payslip: 'Payslip',
    increased: 'higher',
    decreased: 'lower',
    compareTitle: 'Comparison (Monthly)',
    colComponent: 'Component',
    colOffer: 'Offer (Monthly)',
    colPayslip: 'Payslip',
    colReason: 'Reason',
    colStatus: 'Status',
    compareNote: 'Offer figures are divided by 12 to match the monthly payslip. N/A means a figure was not entered on one side.',
    checkTitle: 'Consistency Check',
    cmpBasic: 'Basic',
    cmpHra: 'HRA',
    cmpSpecial: 'Special Allowance',
    cmpPf: 'Employee PF',
    cmpInhand: 'In-Hand',
    naLbl: 'N/A',
    matches: 'Matches',
    naReason: 'Not provided',
    checkMismatch: 'Mismatch',
    psInhandPrompt: 'Please enter Stated Monthly In-Hand (offer) and Net Paid (payslip) to compare.',
    psEmpty: 'Enter the figures from your offer letter and payslip above to compare them.',
    verdictOk: 'Looks consistent — offer and payslip agree.',
    verdictIssue: 'Check the items marked above before relying on this comparison.',
    btnPdf: '📄 Save as PDF',
    btnCsv: '📊 Download Excel',
    statusLbl: 'Status',
    detailLbl: 'Detail',
    pgPayslipTitle: 'Payslip vs Offer Letter Comparator (Free)',
    pgPayslipDesc: 'Compare your annual offer-letter salary split-up with your monthly payslip and flag mismatches in Basic, HRA, PF and in-hand pay.',
    privacyTagline: '🔒 100% private — nothing you type is ever stored or sent.',
    privacyBadge: '🔒 Private — nothing you type is stored or sent.',
    privacyFabTitle: 'Privacy — tap to learn more',
    privacyPopTitle: 'Your privacy',
    privacyMsg1: '🔒 100% private — nothing you type is ever stored or sent.',
    privacyMsg2: 'Your numbers never leave your device. We can’t see them.',
    privacyMsg3: 'No accounts, no sign-up, no tracking — just the math.',
    privacyMsg4: 'Nothing is saved and nothing is sent. Reload the page and it’s gone.',

    bmiTitle: 'BMI Calculator',
    bmiDesc: 'Calculate your Body Mass Index from height and weight with a live slider and colour-coded scale.',
    bmiCta: 'Open calculator →',
    bmiH1: 'BMI Calculator',
    bmiSub: 'Body Mass Index from Height & Weight',
    unitMetric: 'Metric (cm / kg)',
    unitImperial: 'Imperial (ft-in / lb)',
    heightLbl: 'Height',
    weightLbl: 'Weight',
    bmiHint: 'BMI is a screening tool, not a diagnosis. It does not distinguish muscle from fat.',
    bmiScale: 'BMI Scale',
    catUnder: 'Underweight',
    catNormal: 'Normal',
    catOver: 'Overweight',
    catObese: 'Obese',
    bmiResult: 'Your BMI',
    healthyRange: 'Healthy weight range',
    bmiFaqQ1: 'What is a healthy BMI?',
    bmiFaqA1: 'A BMI between 18.5 and 24.9 is considered normal. Below 18.5 is underweight, 25–29.9 is overweight, and 30+ is obese.',
    bmiFaqQ2: 'Is BMI accurate for everyone?',
    bmiFaqA2: 'No. Athletes with high muscle mass may show a high BMI despite low body fat. It is a quick screening measure, not a full health assessment.',
    genderLbl: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    ageLbl: 'Age',
    activityLbl: 'Activity Level',
    actSedentary: 'Sedentary',
    actLight: 'Light',
    actModerate: 'Moderate',
    actActive: 'Active',
    dietTitle: 'Diet Suggestion',
    dietCals: 'Target Calories / day',
    dietMaintain: 'Maintenance Calories',
    dietGoal: 'Suggested Goal',
    macroProtein: 'Protein',
    macroCarbs: 'Carbohydrates',
    macroFat: 'Fats',
    goalGain: 'Gain weight',
    goalMaintain: 'Maintain weight',
    goalLose: 'Lose weight',
    nutrientsTitle: 'Other Nutrients',
    fiberLbl: 'Fiber',
    waterLbl: 'Water',
    sugarLbl: 'Added Sugar (max)',
    satFatLbl: 'Saturated Fat (max)',
    macroCalLbl: 'of calories',
    dietHint: 'Estimates for guidance only. Calorie and macro needs vary by individual — consult a qualified nutritionist.',
    dietFaqQ1: 'How are the diet calories calculated?',
    dietFaqA1: 'We first estimate your Basal Metabolic Rate (BMR) with the Mifflin-St Jeor equation: 10×weight(kg) + 6.25×height(cm) − 5×age + 5 (men) or −161 (women). Multiplying BMR by your activity level gives your maintenance calories (TDEE). The target is then adjusted by your BMI category: +300 kcal to gain, 0 to maintain, and −400/−500 kcal to lose.',
    dietFaqQ2: 'How is the macro and nutrient split worked out?',
    dietFaqA2: 'Protein is set at 1.6–2.0 g per kg of body weight (higher when cutting to preserve muscle). Fat is 25% of target calories, and carbohydrates fill the remainder. Fiber is ~14 g per 1000 kcal, water ~35 ml per kg body weight, added sugar is capped at 5% of energy, and saturated fat at 10%.',
    forecastTitle: 'Weight Reduction Forecast',
    goalWeightLbl: 'Goal Weight',
    weeklyLossLbl: 'Weekly Weight Loss',
    forecastTargetCals: 'Daily Target Calories',
    forecastWeeks: 'Time to Goal',
    forecastDeficit: 'Total Deficit Needed',
    forecastHint: 'Linear estimate using ~7700 kcal per kg. Real weight loss is rarely perfectly linear — treat as a guide.',
    fcSetGoal: 'Set a goal weight below your current weight',
    fcBelow: 'Set target calories below maintenance to lose weight',
    fcDaily: 'Daily Deficit',
    fcDateLbl: 'Estimated Goal Date',
    exTitle: 'Exercise to Close the Gap',
    exHint: 'The workouts below burn your daily deficit (Maintenance − Food Intake). Pick any one activity — minutes shown are per day for that single activity, not combined. Adjusted for your current weight.',
    exRelation: 'Maintenance = Food Intake + Exercise to Close the Gap',
    exBurnTitle: 'Exercise to Burn the Excess',
    exBurnHint: 'If you ate above your maintenance calories, these are the minutes of each activity needed to burn off the excess. Eat at or below maintenance and no extra workout is needed. Pick any one activity — minutes are per day for that single activity, not combined.',
    exBurnRelation: 'Food Intake = Maintenance + Exercise (to burn any excess)',
    exNoneBurn: 'You’re at or below maintenance — no extra workout needed to burn off your intake. Exercise is optional if you want a bigger deficit.',
    wlWorkout: 'Workout (optional)',
    wlWorkoutHint: 'Add a daily workout to burn extra calories. It combines with your food intake to set your weight-loss pace.',
    wlActivity: 'Activity',
    wlMinutes: 'Duration / day',
    wlExBurn: 'Exercise Burned',
    fcNet: 'Net Daily Deficit',
    fcNetNote: 'Net Daily Deficit = Maintenance + Exercise Burned − Food Intake',
    exNone: 'Increase your deficit (lower target calories or add exercise) to see suggestions.',
    exWalk: 'Walking (4 km/h)',
    exBrisk: 'Brisk walking (5.6 km/h)',
    exCycle: 'Cycling (moderate)',
    exRun: 'Running (8 km/h)',
    exSwim: 'Swimming (moderate)',
    exHiit: 'HIIT',
    exRope: 'Jump rope',
    exStrength: 'Strength training',
    goalTimeLbl: 'Goal Time',
    goalTimeUnit: 'weeks',
    autoPlanTitle: 'Auto Workout Plan',
    autoPlanHint: 'Using your fixed target time and daily food intake, this workout will hit your goal weight on schedule.',
    reqDailyDeficitLbl: 'Required Daily Deficit',
    reqExBurnLbl: 'Required Exercise Burn',
    planFeasible: 'Feasible',
    planInfeasible: 'Not feasible',
    planNoWorkout: 'Your food plan alone meets the goal — no extra workout needed.',
    planSuggestPrefix: 'Suggested: ',
    planApply: 'Apply suggested plan',
    planAdjust: 'To make it feasible, increase your target time, lower your goal weight, or reduce daily intake.',
    planLowIntake: 'Daily intake is very low (under 1200 kcal). For safety, allow more time rather than eating less.',
    planBestEffort: 'Best effort shown — even the hardest workout at 2 hr/day falls short. ',
    wlH1: 'Weight Loss Planner',
    wlSub: 'Plan your calorie deficit & goal weight',
    wlResult: 'Your Plan',
    wlMaintain: 'Maintenance Calories',
    wlBmi: 'Current → Goal BMI',
    wlChart: 'Projected Weight',
    wlDesc: 'Plan your weight loss with target calories, time to goal and a projected weight chart.',
    wlCta: 'Open calculator →',
    intakeTitle: 'Daily Food Intake',
    intakeSub: 'Enter the calories you consumed today',
    intakeCalsLbl: 'Daily Intake Calories',
    intakeDate: 'Date',
    intakeFood: 'Food / Drink',
    intakeCals: 'Calories (kcal)',
    intakeAdd: '+ Add item',
    intakeTotal: 'Total Intake',
    intakeTarget: 'Daily Target',
    intakeRemaining: 'Remaining',
    intakeOver: 'Over budget',
    intakeEmpty: 'No items logged for this date yet.',
    intakeClear: 'Clear date',
    intakeVsTarget: 'You are tracking intake against your plan target. The two numbers are independent — adjust the target above without losing your log.',
    intakeUnderNote: 'Under target — room left for today.',
    intakeOverNote: 'Over target — consider a lighter next meal or extra movement.',
    pgWlTitle: 'Weight Loss Planner - Calorie & Goal Calculator (Free)',
    pgWlDesc: 'Plan your weight loss: estimate daily target calories, weeks to your goal weight, and a projected weight-loss chart using BMR and a calorie deficit.',
    pgBmiTitle: 'BMI Calculator - Body Mass Index (Free)',
    pgBmiDesc: 'Calculate your Body Mass Index (BMI) from height and weight with a live slider, category and colour-coded scale.',

    sipTitle: 'SIP Calculator',
    sipDesc: 'Estimate the maturity value of your monthly SIP investment with compound growth.',
    sipCta: 'Open calculator →',
    sipH1: 'SIP Calculator',
    sipSub: 'Mutual Fund Systematic Investment Plan',
    sipMonthly: 'Monthly Investment',
    sipRate: 'Expected Return (p.a.)',
    sipTenure: 'Investment Period',
    sipLump: 'Initial Lump Sum (optional)',
    sipHint: 'Returns are illustrative. Mutual fund investments are subject to market risk — past performance is not a guarantee of future returns.',
    sipMaturity: 'Maturity Value',
    sipInvested: 'Amount Invested',
    sipGains: 'Wealth Gained',
    sipSchedule: 'Yearly Growth',
    sipYear: 'Year',
    sipValue: 'Value',
    sipFaqQ1: 'How is SIP maturity calculated?',
    sipFaqA1: 'Each monthly investment grows at the expected annual rate compounded monthly. The maturity is the future value of this annuity plus any initial lump sum.',
    sipFaqQ2: 'Are SIP returns guaranteed?',
    sipFaqA2: 'No. Equity and debt funds fluctuate with the market. This calculator assumes a constant rate for illustration only.',
    pgSipTitle: 'SIP Calculator - Mutual Fund Returns (Free)',
    pgSipDesc: 'Calculate the maturity value of your monthly SIP investment with compound growth, total invested and wealth gained.',
    gstTitle: 'GST Calculator',
    gstDesc: 'Add or remove GST from a price and split the tax into CGST, SGST and IGST.',
    gstCta: 'Open calculator →',
    gstH1: 'GST Calculator',
    gstSub: 'Add or Remove GST from a Price',
    gstMode: 'Calculation',
    gstAdd: 'Add GST',
    gstRemove: 'Remove GST',
    gstAmount: 'Amount',
    gstRate: 'GST Rate',
    gstType: 'Supply Type',
    gstIntra: 'Intra-state (CGST+SGST)',
    gstInter: 'Inter-state (IGST)',
    gstBreakup: 'GST Break-up',
    gstBase: 'Base Amount',
    gstInclusive: 'Inclusive Amount',
    gstTaxVal: 'GST Amount',
    gstTaxAdded: 'GST Added',
    gstTotal: 'Total Amount',
    gstSplit: 'Tax Split',
    gstCgst: 'CGST',
    gstSgst: 'SGST',
    gstIgst: 'IGST',
    gstFaqQ1: 'What is the difference between CGST, SGST and IGST?',
    gstFaqA1: 'For intra-state sales the tax is split equally into CGST (central) and SGST (state). For inter-state sales the whole tax is levied as IGST (integrated).',
    gstFaqQ2: 'Add GST vs Remove GST?',
    gstFaqA2: '"Add GST" treats your amount as the base and adds tax on top. "Remove GST" treats your amount as tax-inclusive and works the tax back out to find the base.',
    pgGstTitle: 'GST Calculator - Add / Remove GST (Free)',
    pgGstDesc: 'Add or remove GST from a price and split the tax into CGST, SGST and IGST for intra- and inter-state supplies.',

    foodTitle: 'Food Calculator',
    foodDesc: 'Plan daily calories & macros from your profile and food log, and estimate your monthly food budget.',
    foodCta: 'Open calculator →',
    foodH1: 'Food Calculator',
    foodSub: 'Daily calories & macros + monthly food budget',
    foodMode: 'Mode',
    nutritionLbl: 'Nutrition',
    budgetLbl: 'Monthly Budget',
    nutritionTitle: 'Calorie & Macro Targets',
    foodLogTitle: 'Food Calorie Counter',
    foodSelect: 'Food / Drink',
    foodGrams: 'Quantity (g / ml)',
    foodKcal: 'kcal',
    foodAddItem: '+ Add item',
    foodTotal: 'Total from log',
    foodVsTarget: 'vs daily target',
    foodUnderNote: 'Under target — room left for today.',
    foodOverNote: 'Over target — consider a lighter next meal or extra movement.',
    foodEmpty: 'No items logged yet. Pick a food and enter the quantity.',
    foodCustom: 'Custom (enter kcal)',
    foodCustomKcal: 'kcal per 100g',
    budgetTitle: 'Monthly Food Budget',
    budgetPeople: 'Number of people',
    budgetItem: 'Item / Category',
    budgetPrice: 'Price (₹)',
    budgetQty: 'Qty / month',
    budgetFreq: 'Frequency',
    freqDaily: 'Daily',
    freqWeekly: 'Weekly',
    freqMonthly: 'Monthly',
    budgetAdd: '+ Add item',
    budgetTotal: 'Total Monthly Food Cost',
    budgetPerDay: 'Per day',
    budgetPerPerson: 'Per person / month',
    budgetEmpty: 'No budget items yet. Add a row to start.',
    budgetHint: 'Each row is one item you buy for food. Pick how often you buy it; the monthly cost is worked out automatically.',
    pgFoodTitle: 'Food Calculator - Calories, Macros & Monthly Budget (Free)',
    pgFoodDesc: 'Estimate daily calorie & macro targets from your profile and a food log, and plan your monthly food budget.'
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
    vVarCapLbl: 'மாறும் சம்பளம் % CTC',
    chkVarpct: 'மாறும் சம்பளம் பொதுவான வரம்புக்குள் உள்ளது',
    ofCtc: 'CTC-இன்',
    typicalLimit: 'பொதுவான வரம்பு',
    vGrossLbl: 'மொத்த ஊதியம்',
    vTakeHomeLbl: 'மதிப்பிடப்பட்ட மாதாந்திர கைநீக்கம்',
    vTotalLbl: 'மொத்தம் (CTC)',
    inhandNote: 'மாதாந்திர கைநீக்கம் பொதுவாக ஆஃபர் கடிதங்களில் அச்சிடப்படுவதில்லை — இது உங்கள் உள்ளீடுகளிலிருந்து கணிக்கப்பட்ட மதிப்பு.',
    chkInhandPrompt: 'கைநீக்கத்தைச் சரிபார்க்க, குறிப்பிட்ட மாதாந்திர கைநீக்கத்தை உள்ளிடவும்.',
    btnPdf: '📄 PDF ஆக சேமி',
    btnCsv: '📊 எக்செல் பதிவிறக்கம்',
    computedLbl: 'கணிக்கப்பட்ட',
    pgOfferTitle: 'ஆஃபர் லெட்டர் சம்பளப் பிரிவு உருவாக்கி & சரிபார்ப்பான (இலவசம்)',
    pgOfferDesc: 'உங்கள் CTC-இலிருந்து ஒரு நிலையான இந்திய சம்பளப் பிரிவை (அடிப்படை, HRA, PF, கிராட்டுவிட்டி) உருவாக்கவும் மற்றும் உங்கள் வேலை ஆஃபர் கடிதப் பிரிவைச் சரிபார்க்கவும்.',
    payslipTitle: 'சம்பளப் படிவம் எதிர் ஆஃபர் கடிதம்',
    payslipDesc: 'உங்கள் ஆண்டு ஆஃபர் கடித சம்பளப் பிரிவை உங்கள் மாதாந்திர சம்பளப் படிவத்துடன் ஒப்பிடவும்.',
    payslipCta: 'கால்குலேட்டரைத் திறக்க →',
    pTaxLbl: 'வருமான வரி (TDS)',
    cmpTax: 'வருமான வரி',
    oTravelLbl: 'பயணப் படி (LTA)',
    oMedLbl: 'மருத்துவக் காப்பீடு',
    pTravelLbl: 'பயணப் படி (LTA)',
    pMedLbl: 'மருத்துவக் காப்பீடு',
    cmpTravel: 'பயணப் படி',
    cmpMed: 'மருத்துவக் காப்பீடு',
    colReason: 'காரணம்',
    matches: 'பொருந்துகிறது',
    naReason: 'வழங்கப்படவில்லை',
    checkMismatch: 'பொருந்தாமை',
    payslip: 'சம்பளப் படிவம்',
    increased: 'அதிகம்',
    decreased: 'குறைவு',
    pgPayslipTitle: 'சம்பளப் படிவம் எதிர் ஆஃபர் கடிதம் ஒப்பீட்டாளர் (இலவசம்)',
    pgPayslipDesc: 'உங்கள் ஆண்டு ஆஃபர் சம்பளப் பிரிவை உங்கள் மாதாந்திர சம்பளப் படிவத்துடன் ஒப்பிட்டு, அடிப்படை, HRA, PF மற்றும் கைநீக்கத்தில் முரண்பாடுகளைக் காட்டவும்.',
    privacyTagline: '🔒 முழுமையாக தனிப்பட்டது — நீங்கள் தட்டச்சு செய்வது எதுவும் சேமிக்கப்படாது அல்லது அனுப்பப்படாது.',
    privacyBadge: '🔒 தனிப்பட்டது — நீங்கள் உள்ளிடும் தகவல் சேமிக்கப்படாது.',
    privacyFabTitle: 'தனியுரிமை — மேலும் அறிய தட்டவும்',
    privacyPopTitle: 'உங்கள் தனியுரிமை',
    privacyMsg1: '🔒 முழுமையாக தனிப்பட்டது — நீங்கள் தட்டச்சு செய்வது எதுவும் சேமிக்கப்படாது அல்லது அனுப்பப்படாது.',
    privacyMsg2: 'உங்கள் எண்கள் உங்கள் சாதனத்தை விட்டு வெளியேறுவதில்லை. நாங்கள் அவற்றைப் பார்க்க முடியாது.',
    privacyMsg3: 'கணக்குகள் இல்லை, பதிவு இல்லை, கண்காணிப்பு இல்லை — வெறும் கணக்கீடுகள் மட்டும்.',
    privacyMsg4: 'எதுவும் சேமிக்கப்படாது, எதுவும் அனுப்பப்படாது. பக்கத்தை மீண்டும் ஏற்றினால் அது மறைந்துவிடும்.',

    bmiTitle: 'பிஎம்ஐ கால்குலேட்டர்',
    bmiDesc: 'உயரம் மற்றும் எடையிலிருந்து உங்கள் உடல் நிறைக் குறியீட்டை (பிஎம்ஐ) நேரடி சிலைடர் மற்றும் வண்ண அளவுகோலுடன் கணக்கிடுங்கள்.',
    bmiCta: 'கால்குலேட்டரைத் திறக்க →',
    bmiH1: 'பிஎம்ஐ கால்குலேட்டர்',
    bmiSub: 'உயரம் & எடையிலிருந்து உடல் நிறைக் குறியீடு',
    unitMetric: 'மெட்ரிக் (செ.மீ / கிலோ)',
    unitImperial: 'இம்பீரியல் (அடி-இன்ச் / பவுண்ட்)',
    heightLbl: 'உயரம்',
    weightLbl: 'எடை',
    bmiHint: 'பிஎம்ஐ ஒரு திரையிடல் கருவி, நோயறிதல் அல்ல. இது தசை மற்றும் கொழுப்பை வேறுபடுத்தாது.',
    bmiScale: 'பிஎம்ஐ அளவுகோல்',
    catUnder: 'குறைந்த எடை',
    catNormal: 'இயல்பான',
    catOver: 'அதிக எடை',
    catObese: 'பருமன்',
    bmiResult: 'உங்கள் பிஎம்ஐ',
    healthyRange: 'ஆரோக்கியமான எடை வரம்பு',
    bmiFaqQ1: 'ஆரோக்கியமான பிஎம்ஐ என்றால் என்ன?',
    bmiFaqA1: '18.5 முதல் 24.9 வரையிலான பிஎம்ஐ இயல்பானதாக கருதப்படுகிறது. 18.5க்குக் கீழே குறைந்த எடை, 25–29.9 அதிக எடை, மற்றும் 30+ பருமன்.',
    bmiFaqQ2: 'பிஎம்ஐ அனைவருக்கும் துல்லியமானதா?',
    bmiFaqA2: 'இல்லை. அதிக தசை நிறை கொண்ட விளையாட்டு வீரர்கள் குறைந்த உடல் கொழுப்புடன் அதிக பிஎம்ஐ காட்டலாம். இது ஒரு விரைவான திரையிடல் முறை மட்டுமே, முழுமையான ஆரோக்கிய மதிப்பீடு அல்ல.',
    genderLbl: 'பாலினம்',
    genderMale: 'ஆண்',
    genderFemale: 'பெண்',
    ageLbl: 'வயது',
    activityLbl: 'செயல்பாட்டு நிலை',
    actSedentary: 'அமைதியான',
    actLight: 'இலேசான',
    actModerate: 'மிதமான',
    actActive: 'சுறுசுறுப்பான',
    dietTitle: 'உணவுக் குறிப்பு',
    dietCals: 'இலக்கு கலோரிகள் / நாள்',
    dietMaintain: 'பராமரிப்பு கலோரிகள்',
    dietGoal: 'பரிந்துரைக்கப்பட்ட இலக்கு',
    macroProtein: 'புரதம்',
    macroCarbs: 'கார்போஹைட்ரேட்டுகள்',
    macroFat: 'கொழுப்புகள்',
    goalGain: 'எடையை அதிகரிக்க',
    goalMaintain: 'எடையைப் பராமரிக்க',
    goalLose: 'எடையைக் குறைக்க',
    nutrientsTitle: 'மற்ற ஊட்டச்சத்துகள்',
    fiberLbl: 'நார்ச்சத்து',
    waterLbl: 'நீர்',
    sugarLbl: 'சேர்க்கப்பட்ட சர்க்கரை (அதிகபட்சம்)',
    satFatLbl: 'செறிவூட்டப்பட்ட கொழுப்பு (அதிகபட்சம்)',
    macroCalLbl: 'கலோரிகளில்',
    dietHint: 'வழிகாட்டுதலுக்கான மதிப்பீடுகள் மட்டுமே. கலோரி மற்றும் புரதத் தேவைகள் தனிநபருக்குத் தனி — தகுதியான ஊட்டச்சத்து நிபுணரை அணுகவும்.',
    dietFaqQ1: 'உணவுக் கலோரிகள் எப்படி கணக்கிடப்படுகின்றன?',
    dietFaqA1: 'முதலில் உங்கள் அடித்தள வளர்சிதை மாற்ற விகிதம் (BMR) மிஃப்ளின்-செயின்ட் ஜியோர் சமன்பாட்டுடன் மதிப்பிடப்படுகிறது: 10×எடை(கிலோ) + 6.25×உயரம்(செ.மீ) − 5×வயது + 5 (ஆண்) அல்லது −161 (பெண்). BMR-ஐ உங்கள் செயல்பாட்டு நிலையால் பெருக்குவதால் பராமரிப்பு கலோரிகள் (TDEE) கிடைக்கிறது. பிறகு இலக்கு உங்கள் பிஎம்ஐ வகையால் சரிசெய்யப்படுகிறது: எடை அதிகரிக்க +300 கலோரி, பராமரிக்க 0, எடை குறைக்க −400/−500 கலோரி.',
    dietFaqQ2: 'புரதம் மற்றும் ஊட்டச்சத்துப் பிரிப்பு எப்படி கணக்கிடப்படுகிறது?',
    dietFaqA2: 'புரதம் உடல் எடைக்கு கிலோவுக்கு 1.6–2.0 கிராம் (தசையைப் பாதுகாக்க குறைக்கும்போது அதிகம்). கொழுப்பு இலக்கு கலோரிகளில் 25%, மீதமுள்ளவை கார்போஹைட்ரேட்டுகள். நார்ச்சத்து 1000 கலோரிக்கு ~14 கிராம், நீர் கிலோ உடல் எடைக்கு ~35 மில்லி, சேர்க்கப்பட்ட சர்க்கரை ஆற்றலில் 5% வரை, செறிவூட்டப்பட்ட கொழுப்பு 10% வரை வரம்பிடப்படுகிறது.',
    forecastTitle: 'எடை குறைப்பு முன்னறிவிப்பு',
    goalWeightLbl: 'இலக்கு எடை',
    weeklyLossLbl: 'வாராந்திர எடை இழப்பு',
    forecastTargetCals: 'தினசரி இலக்கு கலோரிகள்',
    forecastWeeks: 'இலக்கை அடைய நேரம்',
    forecastDeficit: 'தேவையான மொத்த குறைப்பு',
    forecastHint: 'கிலோவுக்கு ~7700 கலோரி பயன்படுத்தி நேரிய மதிப்பீடு. உண்மையான எடை இழப்பு அரிதாகவே முற்றிலும் நேரியதாக இருக்கும் — இதை ஒரு வழிகாட்டியாக எடுத்துக் கொள்ளுங்கள்.',
    fcSetGoal: 'உங்கள் தற்போதைய எடையை விட குறைவான இலக்கு எடையை நிர்ணயிக்கவும்',
    fcBelow: 'எடை குறைய இலக்கு கலோரிகளை பராமரிப்பு அளவுக்குக் கீழே நிர்ணயிக்கவும்',
    fcDaily: 'தினசரி குறைப்பு',
    fcDateLbl: 'மதிப்பிடப்பட்ட இலக்குத் தேதி',
    exTitle: 'இடைவெளியை குறைக்க பயிற்சிகள்',
    exHint: 'கீழே உள்ள உடற்பயிற்சிகள் உங்கள் தினசரி குறைப்பை (பராமரிப்பு − உட்கொள்ளல்) எரிக்கும். ஏதேனும் ஒரு உடற்பயிற்சியைத் தேர்ந்தெடுங்கள் — காட்டப்படும் நிமிடங்கள் அந்த ஒரு உடற்பயிற்சிக்கான தினசரி அளவு, ஒருங்கிணைக்கப்படவில்லை. உங்கள் தற்போதைய எடைக்கு ஏற்ப மாற்றப்பட்டது.',
    exRelation: 'பராமரிப்பு = உட்கொள்ளல் + இடைவெளியை மூடும் உடற்பயிற்சி',
    exBurnTitle: 'உபரியை எரிக்க உடற்பயிற்சி',
    exBurnHint: 'உங்கள் பராமரிப்பு கலோரிகளுக்கு மேல் நீங்கள் சாப்பிட்டால், அந்த உபரியை எரிக்க ஒவ்வொரு உடற்பயிற்சிக்கும் தேவையான நிமிடங்கள் இவை. பராமரிப்புக்குக் கீழ் அல்லது சமமாக சாப்பிட்டால் கூடுதல் உடற்பயிற்சி தேவையில்லை. ஏதேனும் ஒரு உடற்பயிற்சியைத் தேர்ந்தெடுங்கள் — நிமிடங்கள் அந்த ஒரு உடற்பயிற்சிக்கான தினசரி அளவு.',
    exBurnRelation: 'உட்கொள்ளல் = பராமரிப்பு + உடற்பயிற்சி (உபரியை எரிக்க)',
    exNoneBurn: 'நீங்கள் பராமரிப்புக்குக் கீழ் அல்லது சமமாக உள்ளீர்கள் — உங்கள் உட்கொள்ளலை எரிக்க கூடுதல் உடற்பயிற்சி தேவையில்லை. பெரிய குறைப்பு வேண்டுமானால் உடற்பயிற்சி விருப்பமானது.',
    wlWorkout: 'உடற்பயிற்சி (விருப்பம்)',
    wlWorkoutHint: 'கூடுதல் கலோரிகளை எரிக்க தினசரி உடற்பயிற்சியைச் சேர்க்கவும். உங்கள் உட்கொள்ளலுடன் சேர்ந்து உங்கள் எடைக் குறைப்பு வேகத்தை நிர்ணயிக்கிறது.',
    wlActivity: 'உடற்பயிற்சி',
    wlMinutes: 'கால அளவு / நாள்',
    wlExBurn: 'உடற்பயிற்சியால் எரிக்கப்பட்டவை',
    fcNet: 'நிகர தினசரி குறைப்பு',
    fcNetNote: 'நிகர தினசரி குறைப்பு = பராமரிப்பு + உடற்பயிற்சியால் எரிக்கப்பட்டவை − உட்கொள்ளல்',
    exNone: 'பரிந்துரைகளைப் பார்க்க உங்கள் குறைப்பை அதிகரிக்கவும் (இலக்கு கலோரிகளைக் குறைக்கவும் அல்லது பயிற்சி சேர்க்கவும்).',
    exWalk: 'நடைப்பயிற்சி (4 km/h)',
    exBrisk: 'வேகமான நடை (5.6 km/h)',
    exCycle: 'சைக்கிள் ஓட்டுதல் (மிதமான)',
    exRun: 'ஓட்டம் (8 km/h)',
    exSwim: 'நீச்சல் (மிதமான)',
    exHiit: 'HIIT',
    exRope: 'தாவடம் (Jump rope)',
    exStrength: 'பலம் பயிற்சி',
    wlH1: 'எடைக் குறைப்பு திட்டம்',
    wlSub: 'உங்கள் கலோரி குறைப்பு மற்றும் இலக்கு எடையைத் திட்டமிடுங்கள்',
    wlResult: 'உங்கள் திட்டம்',
    wlMaintain: 'பராமரிப்பு கலோரிகள்',
    wlBmi: 'தற்போதைய → இலக்கு பிஎம்ஐ',
    wlChart: 'முன்னறிவிக்கப்பட்ட எடை',
    wlDesc: 'இலக்கு கலோரிகள், இலக்கை அடைய நேரம் மற்றும் முன்னறிவிக்கப்பட்ட எடை விளக்கப்படத்துடன் உங்கள் எடைக் குறைப்பைத் திட்டமிடுங்கள்.',
    wlCta: 'கால்குலேட்டரைத் திறக்க →',
    intakeTitle: 'தினசரி உணவு உட்கொள்ளல்',
    intakeSub: 'இன்று நீங்கள் உட்கொண்ட கலோரிகளை உள்ளிடவும்',
    intakeCalsLbl: 'தினசரி உட்கொள்ளல் கலோரிகள்',
    intakeDate: 'தேதி',
    intakeFood: 'உணவு / பானம்',
    intakeCals: 'கலோரிகள் (kcal)',
    intakeAdd: '+ உருப்படியைச் சேர்',
    intakeTotal: 'மொத்த உட்கொள்ளல்',
    intakeTarget: 'தினசரி இலக்கு',
    intakeRemaining: 'மீதமுள்ளது',
    intakeOver: 'பட்ஜெட்டை மீறியது',
    intakeEmpty: 'இந்தத் தேதிக்கான உருப்படிகள் இன்னும் பதிவு செய்யப்படவில்லை.',
    intakeClear: 'தேதியை அழி',
    intakeVsTarget: 'உங்கள் திட்ட இலக்குக்கு எதிராக உட்கொள்ளலைக் கண்காணிக்கிறீர்கள். இரண்டு எண்களும் தனித்தன்மை வாய்ந்தவை — உங்கள் பதிவை இழக்காமல் மேலே உள்ள இலக்கைச் சரிசெய்யலாம்.',
    intakeUnderNote: 'இலக்குக்குக் கீழே — இன்று இடம் மீதமுள்ளது.',
    intakeOverNote: 'இலக்கை மீறியது — அடுத்த உணவை இலலாக எடுத்துக்கொள்ளவும் அல்லது கூடுதல் இயக்கத்தைக் கருத்தில் கொள்ளவும்.',
    pgWlTitle: 'எடைக் குறைப்பு திட்டம் - கலோரி & இலக்கு கால்குலேட்டர் (இலவசம்)',
    pgWlDesc: 'உங்கள் எடைக் குறைப்பைத் திட்டமிடுங்கள்: தினசரி இலக்கு கலோரிகள், இலக்கு எடையை அடைய வாரங்கள் மற்றும் BMR மற்றும் கலோரி குறைப்பைப் பயன்படுத்தி முன்னறிவிக்கப்பட்ட எடைக் குறைப்பு விளக்கப்படம்.',
    pgBmiTitle: 'பிஎம்ஐ கால்குலேட்டர் - உடல் நிறைக் குறியீடு (இலவசம்)',
    pgBmiDesc: 'உயரம் மற்றும் எடையிலிருந்து உங்கள் உடல் நிறைக் குறியீட்டை (பிஎம்ஐ) நேரடி சிலைடர், வகை மற்றும் வண்ண அளவுகோலுடன் கணக்கிடுங்கள்.',

    sipTitle: 'எஸ்ஐபி கால்குலேட்டர்',
    sipDesc: 'கூட்டு வளர்ச்சியுடன் உங்கள் மாதாந்திர எஸ்ஐபி முதலீட்டின் முதிர்வு மதிப்பை மதிப்பிடுங்கள்.',
    sipCta: 'கால்குலேட்டரைத் திறக்க →',
    sipH1: 'எஸ்ஐபி கால்குலேட்டர்',
    sipSub: 'மியூச்சுவல் ஃபண்ட் கட்டமைப்பான முதலீட்டுத் திட்டம்',
    sipMonthly: 'மாதாந்திர முதலீடு',
    sipRate: 'எதிர்பார்க்கப்படும் வருமானம் (ஆண்டுக்கு)',
    sipTenure: 'முதலீட்டுக் காலம்',
    sipLump: 'ஆரம்ப சொத்துத் தொகை (விருப்பத்தேர்வு)',
    sipHint: 'வருமானங்கள் சுட்டிக்காட்டும் மட்டுமே. மியூச்சுவல் ஃபண்ட் முதலீடுகள் சந்தை அபாயத்திற்கு உட்பட்டவை — கடந்த கால செயல்திறன் எதிர்கால வருமானத்திற்கான உத்தரவாதம் அல்ல.',
    sipMaturity: 'முதிர்வு மதிப்பு',
    sipInvested: 'முதலீடு செய்த தொகை',
    sipGains: 'ஈட்டிய செல்வம்',
    sipSchedule: 'ஆண்டு வளர்ச்சி',
    sipYear: 'ஆண்டு',
    sipValue: 'மதிப்பு',
    sipFaqQ1: 'எஸ்ஐபி முதிர்வு எப்படி கணக்கிடப்படுகிறது?',
    sipFaqA1: 'ஒவ்வொரு மாத முதலீடும் எதிர்பார்க்கப்படும் ஆண்டு விகிதத்தில் மாதாந்திர கூட்டு வட்டியில் வளர்கிறது. முதிர்வு என்பது இந்த ஆயுள் தொகையின் எதிர்கால மதிப்பு மற்றும் ஏதேனும் ஆரம்ப சொத்துத் தொகை.',
    sipFaqQ2: 'எஸ்ஐபி வருமானங்கள் உத்தரவாதமானவையா?',
    sipFaqA2: 'இல்லை. பங்கு மற்றும் கடன் நிதிகள் சந்தையுடன் ஏற்றத்தாழ்வாக இருக்கும். இந்த கால்குலேட்டர் சுட்டிக்காட்டும் நிலையான விகிதத்தை மட்டுமே வைத்திருக்கிறது.',
    pgSipTitle: 'எஸ்ஐபி கால்குலேட்டர் - மியூச்சுவல் ஃபண்ட் வருமானங்கள் (இலவசம்)',
    pgSipDesc: 'கூட்டு வளர்ச்சியுடன் உங்கள் மாதாந்திர எஸ்ஐபி முதலீட்டின் முதிர்வு மதிப்பு, முதலீடு செய்த தொகை மற்றும் ஈட்டிய செல்வத்தைக் கணக்கிடுங்கள்.',

    gstTitle: 'ஜிஎஸ்டி கால்குலேட்டர்',
    gstDesc: 'விலையில் ஜிஎஸ்டியைச் சேர்க்கவோ அல்லது நீக்கவோ செய்து, வரியை சிஜிஎஸ்டி, எஸ்ஜிஎஸ்டி மற்றும் ஐஜிஎஸ்டியாகப் பிரிக்கவும்.',
    gstCta: 'கால்குலேட்டரைத் திறக்க →',
    gstH1: 'ஜிஎஸ்டி கால்குலேட்டர்',
    gstSub: 'விலையில் ஜிஎஸ்டியைச் சேர்க்கவோ அல்லது நீக்கவோ',
    gstMode: 'கணக்கீடு',
    gstAdd: 'ஜிஎஸ்டி சேர்',
    gstRemove: 'ஜிஎஸ்டி நீக்கு',
    gstAmount: 'தொகை',
    gstRate: 'ஜிஎஸ்டி விகிதம்',
    gstType: 'வழங்கல் வகை',
    gstIntra: 'மாநில உள் (சிஜிஎஸ்டி+எஸ்ஜிஎஸ்டி)',
    gstInter: 'மாநிலங்களுக்கு இடையே (ஐஜிஎஸ்டி)',
    gstBreakup: 'ஜிஎஸ்டி பிரிப்பு',
    gstBase: 'அடிப்படைத் தொகை',
    gstInclusive: 'உள்ளடக்கிய தொகை',
    gstTaxVal: 'ஜிஎஸ்டி தொகை',
    gstTaxAdded: 'சேர்க்கப்பட்ட ஜிஎஸ்டி',
    gstTotal: 'மொத்தத் தொகை',
    gstSplit: 'வரிப் பிரிப்பு',
    gstCgst: 'சிஜிஎஸ்டி',
    gstSgst: 'எஸ்ஜிஎஸ்டி',
    gstIgst: 'ஐஜிஎஸ்டி',
    gstFaqQ1: 'சிஜிஎஸ்டி, எஸ்ஜிஎஸ்டி மற்றும் ஐஜிஎஸ்டிக்கு இடையேயான வேறுபாடு என்ன?',
    gstFaqA1: 'மாநில உள் விற்பனைகளுக்கு வரி சிஜிஎஸ்டி (மத்திய) மற்றும் எஸ்ஜிஎஸ்டி (மாநில) ஆக சமமாகப் பிரிக்கப்படுகிறது. மாநிலங்களுக்கு இடையேயான விற்பனைகளுக்கு முழு வரியும் ஐஜிஎஸ்டியாக (ஒருங்கிணைந்த) விதிக்கப்படுகிறது.',
    gstFaqQ2: 'ஜிஎஸ்டி சேர் vs நீக்கு?',
    gstFaqA2: '"ஜிஎஸ்டி சேர்" உங்கள் தொகையை அடிப்படையாகக் கருதி மேலே வரியைச் சேர்க்கிறது. "ஜிஎஸ்டி நீக்கு" உங்கள் தொகையை வரி உள்ளடக்கியதாகக் கருதி, அடிப்படையைக் கண்டறிய வரியைப் பின்னுக்குப் பெறுகிறது.',
    pgGstTitle: 'ஜிஎஸ்டி கால்குலேட்டர் - ஜிஎஸ்டியைச் சேர் / நீக்கு (இலவசம்)',
    pgGstDesc: 'விலையில் ஜிஎஸ்டியைச் சேர்க்கவோ அல்லது நீக்கவோ செய்து, மாநில உள் மற்றும் மாநிலங்களுக்கு இடையேயான வழங்கல்களுக்கு சிஜிஎஸ்டி, எஸ்ஜிஎஸ்டி மற்றும் ஐஜிஎஸ்டியாக வரியைப் பிரிக்கவும்.',

    foodTitle: 'உணவு கால்குலேட்டர்',
    foodDesc: 'உங்கள் சுயவிவரம் மற்றும் உணவுப் பதிவிலிருந்து தினசரி கலோரிகள் & மேக்ரோக்களைத் திட்டமிடவும், மாதாந்திர உணவுப் பட்ஜெட்டை மதிப்பிடவும்.',
    foodCta: 'கால்குலேட்டரைத் திறக்க →',
    foodH1: 'உணவு கால்குலேட்டர்',
    foodSub: 'தினசரி கலோரிகள் & மேக்ரோக்கள் + மாதாந்திர உணவுப் பட்ஜெட்',
    foodMode: 'பயன்முறை',
    nutritionLbl: 'ஊட்டச்சத்து',
    budgetLbl: 'மாதாந்திர பட்ஜெட்',
    nutritionTitle: 'கலோரி & மேக்ரோ இலக்குகள்',
    foodLogTitle: 'உணவு கலோரி கணிப்பான்',
    foodSelect: 'உணவு / பானம்',
    foodGrams: 'அளவு (g / ml)',
    foodKcal: 'கலோரி',
    foodAddItem: '+ உருப்படியைச் சேர்',
    foodTotal: 'பதிவிலிருந்து மொத்தம்',
    foodVsTarget: 'தினசரி இலக்குக்கு எதிராக',
    foodUnderNote: 'இலக்குக்குக் கீழே — இன்று இடம் மீதமுள்ளது.',
    foodOverNote: 'இலக்கை மீறியது — அடுத்த உணவை இலலாக எடுத்துக்கொள்ளவும் அல்லது கூடுதல் இயக்கத்தைக் கருத்தில் கொள்ளவும்.',
    foodEmpty: 'இதுவரை உருப்படிகள் பதிவு செய்யப்படவில்லை. உணவைத் தேர்ந்தெடுத்து அளவை உள்ளிடவும்.',
    foodCustom: 'தனிப்பயன் (கலோரியை உள்ளிடவும்)',
    foodCustomKcal: '100g உள்ள கலோரிகள்',
    budgetTitle: 'மாதாந்திர உணவுப் பட்ஜெட்',
    budgetPeople: 'நபர்களின் எண்ணிக்கை',
    budgetItem: 'உருப்படி / வகை',
    budgetPrice: 'விலை (₹)',
    budgetQty: 'அளவு / மாதம்',
    budgetFreq: 'அடிக்கடித் தன்மை',
    freqDaily: 'தினசரி',
    freqWeekly: 'வாராந்திர',
    freqMonthly: 'மாதாந்திர',
    budgetAdd: '+ உருப்படியைச் சேர்',
    budgetTotal: 'மொத்த மாதாந்திர உணவுச் செலவு',
    budgetPerDay: 'நாள் ஒன்றுக்கு',
    budgetPerPerson: 'நபர் ஒருவருக்கு / மாதம்',
    budgetEmpty: 'இதுவரை பட்ஜெட் உருப்படிகள் இல்லை. தொடங்க ஒரு வரிசையைச் சேர்க்கவும்.',
    budgetHint: 'உணவுக்காக நீங்கள் வாங்கும் ஒவ்வொரு உருப்படியும் ஒரு வரிசை. நீங்கள் எவ்வளவு அடிக்கடி வாங்குகிறீர்கள் என்பதைத் தேர்ந்தெடுங்கள்; மாதாந்திர செலவு தானாகக் கணக்கிடப்படும்.',
    pgFoodTitle: 'உணவு கால்குலேட்டர் - கலோரிகள், மேக்ரோக்கள் & மாதாந்திர பட்ஜெட் (இலவசம்)',
    pgFoodDesc: 'உங்கள் சுயவிவரம் மற்றும் உணவுப் பதிவிலிருந்து தினசரி கலோரி & மேக்ரோ இலக்குகளை மதிப்பிட்டு, உங்கள் மாதாந்திர உணவுப் பட்ஜெட்டைத் திட்டமிடுங்கள்.'
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
  offer: ['pgOfferTitle', 'pgOfferDesc'],
  payslip: ['pgPayslipTitle', 'pgPayslipDesc'],
  bmi: ['pgBmiTitle', 'pgBmiDesc'],
  sip: ['pgSipTitle', 'pgSipDesc'],
  gst: ['pgGstTitle', 'pgGstDesc'],
  weightloss: ['pgWlTitle', 'pgWlDesc'],
  food: ['pgFoodTitle', 'pgFoodDesc']
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

var PRIVACY_TAGLINES = ['privacyTagline', 'privacyMsg2', 'privacyMsg3', 'privacyMsg4', 'privacyBadge'];

function isHomePage() {
  if (PAGE === 'index') return true;
  var path = location.pathname || '';
  return path === '/' || path.endsWith('/') || /(^|\/)index\.html$/.test(path);
}

function injectPrivacy() {
  // Footer privacy line: home page always uses "100% private"; other pages
  // randomly pick one of the taglines on each load.
  var key = isHomePage() ? 'privacyTagline' : PRIVACY_TAGLINES[Math.floor(Math.random() * PRIVACY_TAGLINES.length)];
  document.querySelectorAll('footer').forEach(function (f) {
    if (f.querySelector('.privacy-line')) return;
    var p = document.createElement('p');
    p.className = 'privacy-line';
    p.setAttribute('data-i18n', key);
    p.textContent = t(key);
    f.appendChild(p);
  });
}

var PRIVACY_MSGS = ['privacyMsg1', 'privacyMsg2', 'privacyMsg3', 'privacyMsg4'];
var privacyIdx = 0;

function injectPrivacyFab() {
  if (document.getElementById('privacyFab')) return;

  var fab = document.createElement('button');
  fab.id = 'privacyFab';
  fab.className = 'privacy-fab';
  fab.setAttribute('aria-label', 'Privacy');
  fab.title = t('privacyFabTitle');
  fab.innerHTML = '🔒';

  var pop = document.createElement('div');
  pop.id = 'privacyPop';
  pop.className = 'privacy-pop';
  pop.innerHTML = '<strong>' + t('privacyPopTitle') + '</strong><p id="privacyPopText"></p>';

  document.body.appendChild(fab);
  document.body.appendChild(pop);

  function currentKey() { return PRIVACY_MSGS[(privacyIdx - 1 + PRIVACY_MSGS.length) % PRIVACY_MSGS.length]; }

  function show() {
    var key = PRIVACY_MSGS[privacyIdx % PRIVACY_MSGS.length];
    document.getElementById('privacyPopText').textContent = t(key);
    pop.classList.add('open');
    privacyIdx++;
  }
  function hide() { pop.classList.remove('open'); }

  fab.addEventListener('click', function (e) {
    e.stopPropagation();
    if (pop.classList.contains('open')) hide(); else show();
  });
  document.addEventListener('langchange', function () {
    if (pop.classList.contains('open')) document.getElementById('privacyPopText').textContent = t(currentKey());
    fab.title = t('privacyFabTitle');
  });
  document.addEventListener('click', function (e) {
    if (pop.classList.contains('open') && !pop.contains(e.target) && e.target !== fab && !fab.contains(e.target)) hide();
  });
}

function initLang() {
  var sw = document.querySelector('.lang-switch');
  if (sw) {
    sw.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { applyLanguage(b.getAttribute('data-lang')); });
    });
  }
  injectPrivacy();
  injectPrivacyFab();
  applyLanguage(currentLang);
}

// ---------- Home landing (data-driven) ----------
// To add a calculator, append one entry here (no HTML/CSS edits required).
var CALCULATORS = [
  { id: 'emi', href: 'emi.html',    icon: '💰', accent: '#2563eb', titleKey: 'emiTitle', descKey: 'emiDesc', ctaKey: 'emiCta' },
  { id: 'eb',  href: 'ebbill.html', icon: '⚡',  accent: '#f59e0b', titleKey: 'ebTitle',  descKey: 'ebDesc',  ctaKey: 'ebCta' },
  { id: 'tax', href: 'tax.html',    icon: '🧾', accent: '#16a34a', titleKey: 'taxH1',   descKey: 'taxDesc', ctaKey: 'taxCta' },
  { id: 'irpart', href: 'irpart.html', icon: '💸', accent: '#7c3aed', titleKey: 'irpartTitle', descKey: 'irpartDesc', ctaKey: 'irpartCta' },
  { id: 'offer', href: 'offer.html', icon: '📄', accent: '#db2777', titleKey: 'offerTitle', descKey: 'offerDesc', ctaKey: 'offerCta' },
  { id: 'payslip', href: 'payslip.html', icon: '🧾', accent: '#0ea5e9', titleKey: 'payslipTitle', descKey: 'payslipDesc', ctaKey: 'payslipCta' },
  { id: 'bmi', href: 'bmi.html', icon: '🏃', accent: '#e11d48', titleKey: 'bmiTitle', descKey: 'bmiDesc', ctaKey: 'bmiCta' },
  { id: 'sip', href: 'sip.html', icon: '📈', accent: '#7c3aed', titleKey: 'sipTitle', descKey: 'sipDesc', ctaKey: 'sipCta' },
  { id: 'gst', href: 'gst.html', icon: '🧮', accent: '#0d9488', titleKey: 'gstTitle', descKey: 'gstDesc', ctaKey: 'gstCta' },
  { id: 'weightloss', href: 'weightloss.html', icon: '🏋️', accent: '#0f766e', titleKey: 'wlH1', descKey: 'wlDesc', ctaKey: 'wlCta' },
  { id: 'food', href: 'food.html', icon: '🍱', accent: '#ea580c', titleKey: 'foodTitle', descKey: 'foodDesc', ctaKey: 'foodCta' }
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
