'use strict';

(function () {
  var RECOMMENDED_VAR_MAX = 30; // typical upper bound for variable pay as % of CTC
  var state = { ctc: 0, basicPct: 50, ref: {}, verify: {} };

  function r2(n) { return Math.round(n * 100) / 100; }

  function newRegimeTax(income) {
    if (income <= 1200000) return 0; // Sec 87A rebate fully exempts up to 12L taxable
    var bands = [
      [400000, 0.05], [800000, 0.10], [1200000, 0.15],
      [1600000, 0.20], [2000000, 0.25], [2400000, 0.30]
    ];
    var prev = 0, tax = 0;
    for (var i = 0; i < bands.length; i++) {
      if (income > prev) {
        var amt = Math.min(income, bands[i][0]) - prev;
        if (amt > 0) tax += amt * bands[i][1];
        prev = bands[i][0];
      }
    }
    return tax;
  }

  function grossFrom(basic, hra, special) {
    return basic + hra + special;
  }

  function renderReference() {
    var ctc = parseDigits($('ctcInput').value) || 0;
    var basicPct = parseDigits($('basicPctInput').value) || 50;
    var basic = ctc * basicPct / 100;
    var hra = basic * 0.5;
    var empPf = basic * 0.12;
    var grat = basic * 0.0481;
    var special = ctc - (basic + hra + empPf + grat);

    var gross = grossFrom(basic, hra, special);
    var empPfDed = basic * 0.12;
    var profTax = 2400; // standard annual professional tax
    var taxable = Math.max(0, gross - 75000);
    var incTax = newRegimeTax(taxable) * 1.04; // + 4% cess
    var netAnnual = gross - empPfDed - profTax - incTax;
    var takeHome = gross > 0 ? netAnnual / 12 : 0;

    $('refBasic').textContent = currency(basic);
    $('refHra').textContent = currency(hra);
    $('refSpecial').textContent = currency(Math.max(0, special));
    $('refEmpPf').textContent = currency(empPf);
    $('refGrat').textContent = currency(grat);
    $('refTotal').textContent = currency(basic + hra + empPf + grat + Math.max(0, special));

    $('refEmpPfDed').textContent = currency(empPfDed);
    $('refPt').textContent = currency(profTax);
    $('refTax').textContent = currency(incTax);
    $('refTakeHome').textContent = currency(Math.max(0, takeHome));

    state.ctc = ctc;
    state.basicPct = basicPct;
    state.ref = {
      basic: basic, hra: hra, special: Math.max(0, special),
      empPf: empPf, grat: grat, total: basic + hra + empPf + grat + Math.max(0, special),
      empPfDed: empPfDed, profTax: profTax, incTax: incTax, takeHome: Math.max(0, takeHome)
    };
  }

  function row(status, label, detail) {
    var cls, mark;
    if (status === true) { cls = 'ok'; mark = '✓'; }
    else if (status === false) { cls = 'warn'; mark = '⚠'; }
    else { cls = 'na'; mark = '–'; }
    return '<div class="verify-row ' + cls + '"><span class="v-mark">' + mark + '</span>' +
      '<span class="v-label">' + label + '</span>' +
      '<span class="v-detail">' + detail + '</span></div>';
  }

  function near(a, b, tol) {
    return Math.abs(a - b) <= tol;
  }

  function renderVerify() {
    var report = $('verifyReport');
    if (!report) return;

    var ctc = parseDigits($('ctcInput').value) || 0;
    var basic = parseDigits($('vBasic').value);
    var hra = parseDigits($('vHra').value);
    var special = parseDigits($('vSpecial').value);
    var empPf = parseDigits($('vEmpPf').value);
    var grat = parseDigits($('vGrat').value);
    var vari = parseDigits($('vVar').value);
    var travel = parseDigits($('vTravel').value);

    // Auto-populate the variable % of CTC (don't overwrite while the user edits it)
    if (vari > 0 && ctc > 0 && document.activeElement !== $('vVarCap')) {
      $('vVarCap').value = (vari / ctc * 100).toFixed(1);
    }
    var med = parseDigits($('vMed').value);
    var empPfDed = parseDigits($('vEmpPfDed').value);
    var pt = parseDigits($('vPt').value);
    var inhand = parseDigits($('vInhand').value);

    var filled = [basic, hra, special, empPf, grat, vari, travel, med, empPfDed, pt, inhand]
      .some(function (v) { return v > 0; });

    if (!filled) {
      report.innerHTML = '<p class="hint">' + t('verifyEmpty') + '</p>';
      $('vGross').textContent = '-';
      $('vTakeHome').textContent = '-';
      $('vTotal').textContent = '-';
      return;
    }

    var gross = basic + hra + special + travel + vari;
    var total = gross + empPf + grat + med;
    $('vGross').textContent = currency(gross);
    $('vTotal').textContent = currency(total);

    var gTake = basic + hra + special + travel;
    var ded = empPfDed > 0 ? empPfDed : basic * 0.12;
    var pTax = (pt > 0 ? pt : 200) * 12;
    var taxInc = newRegimeTax(Math.max(0, gTake - 75000)) * 1.04;
    var takeHome = gTake > 0 ? (gTake - ded - pTax - taxInc) / 12 : 0;
    $('vTakeHome').textContent = currency(Math.max(0, takeHome));

    state.verify = { gross: gross, takeHome: Math.max(0, takeHome), total: total };

    var html = '';
    var checks = [];
    var allOk = true;

    function addCheck(status, label, detail) {
      checks.push({ ok: status, label: label, detail: detail });
      html += row(status, label, detail);
    }

    // 1. Sum of CTC-side components vs stated CTC
    if (ctc > 0 && (basic > 0 || hra > 0 || special > 0 || empPf > 0 || grat > 0 || vari > 0)) {
      var sum = basic + hra + special + empPf + grat + vari + travel + med;
      var diff = ctc - sum;
      var ok = near(ctc, sum, 1);
      allOk = allOk && ok;
      addCheck(ok,
        t('chkSum'),
        ok ? t('matches') : (diff > 0 ? '+' : '') + currency(diff) + ' ' + t('vsCtc'));
    }

    // 2. Employer PF ~ 12% of Basic
    if (basic > 0) {
      var expPf = basic * 0.12;
      if (empPf > 0) {
        var ok2 = near(empPf, expPf, Math.max(1, expPf * 0.01));
        allOk = allOk && ok2;
        addCheck(ok2,
          t('chkEmpPf'),
          currency(empPf) + ' / ' + t('exp') + ' ' + currency(expPf));
      } else {
        addCheck('na', t('chkEmpPf'), t('notGiven'));
      }
    }

    // 3. Gratuity ~ 4.81% of Basic
    if (basic > 0) {
      var expG = basic * 0.0481;
      if (grat > 0) {
        var ok3 = near(grat, expG, Math.max(1, expG * 0.01));
        allOk = allOk && ok3;
        addCheck(ok3,
          t('chkGrat'),
          currency(grat) + ' / ' + t('exp') + ' ' + currency(expG));
      } else {
        addCheck('na', t('chkGrat'), t('notGiven'));
      }
    }

    // 4. Employee PF (deducted) ~ 12% of Basic and ~ Employer PF
    if (basic > 0) {
      var expDed = basic * 0.12;
      if (empPfDed > 0) {
        var ok4 = near(empPfDed, expDed, Math.max(1, expDed * 0.01));
        allOk = allOk && ok4;
        addCheck(ok4,
          t('chkEmpPfDed'),
          currency(empPfDed) + ' / ' + t('exp') + ' ' + currency(expDed));
      } else {
        addCheck('na', t('chkEmpPfDed'), t('notGiven'));
      }
    }

    // 5. Recompute take-home and compare to stated in-hand
    if (basic > 0) {
      var g = basic + hra + special + travel;
      var ded = parseDigits($('vEmpPfDed').value) || (basic * 0.12);
      var pTax = (pt || 200) * 12;
      var taxInc = newRegimeTax(Math.max(0, g - 75000)) * 1.04;
      var calcInhand = (g - ded - pTax - taxInc) / 12;
      if (inhand > 0) {
        var ok5 = near(calcInhand, inhand, Math.max(1, inhand * 0.02));
        allOk = allOk && ok5;
        addCheck(ok5,
          t('chkInhand'),
          currency(calcInhand) + ' / ' + t('stated') + ' ' + currency(inhand));
      } else {
        allOk = false;
        addCheck(false,
          t('chkInhand'),
          t('chkInhandPrompt'));
      }
    }

    // 6. Variable pay within typical limit (% of CTC)
    if (vari > 0 && ctc > 0) {
      var pct = vari / ctc * 100;
      var ok6 = pct <= RECOMMENDED_VAR_MAX;
      allOk = allOk && ok6;
      addCheck(ok6,
        t('chkVarpct'),
        pct.toFixed(1) + '% ' + t('ofCtc') + ' (' + t('typicalLimit') + ' ' + RECOMMENDED_VAR_MAX + '%)');
    }

    html += '<div class="verify-verdict ' + (allOk ? 'ok' : 'warn') + '">' +
      (allOk ? '✓ ' + t('verdictOk') : '⚠ ' + t('verdictIssue')) + '</div>';

    checks.push({ ok: allOk, label: allOk ? t('verdictOk') : t('verdictIssue'), detail: '' });
    state.verify.checks = checks;

    report.innerHTML = html;
  }

  function renderAll() {
    renderReference();
    renderVerify();
  }

  function esc(s) { return '"' + String(s).replace(/"/g, '""') + '"'; }

  function buildCsv() {
    var R = state.ref, V = state.verify;
    var rows = [];
    rows.push([t('offerH1')]);
    rows.push([]);
    rows.push([t('ctcLbl'), r2(state.ctc)]);
    rows.push([t('basicPctLbl'), state.basicPct + '%']);
    rows.push([]);
    rows.push([t('refTitle'), t('colTotalCtc')]);
    rows.push([t('colBasic'), r2(R.basic)]);
    rows.push([t('colHra'), r2(R.hra)]);
    rows.push([t('colSpecial'), r2(R.special)]);
    rows.push([t('colEmpPf'), r2(R.empPf)]);
    rows.push([t('colGrat'), r2(R.grat)]);
    rows.push([t('colTotalCtc'), r2(R.total)]);
    rows.push([]);
    rows.push([t('takeHomeTitle'), '']);
    rows.push([t('colEmpPfDed'), r2(R.empPfDed)]);
    rows.push([t('colProfTax'), r2(R.profTax)]);
    rows.push([t('colIncTax'), r2(R.incTax)]);
    rows.push([t('colTakeHome'), r2(R.takeHome)]);
    rows.push([]);
    rows.push([t('verifyTitle'), '']);
    rows.push([t('vBasicLbl'), r2(parseDigits($('vBasic').value))]);
    rows.push([t('vHraLbl'), r2(parseDigits($('vHra').value))]);
    rows.push([t('vSpecialLbl'), r2(parseDigits($('vSpecial').value))]);
    rows.push([t('vEmpPfLbl'), r2(parseDigits($('vEmpPf').value))]);
    rows.push([t('vGratLbl'), r2(parseDigits($('vGrat').value))]);
    rows.push([t('vVarLbl'), r2(parseDigits($('vVar').value))]);
    rows.push([t('vVarCapLbl'), r2(parseDigits($('vVarCap').value) || 30)]);
    rows.push([t('vTravelLbl'), r2(parseDigits($('vTravel').value))]);
    rows.push([t('vMedLbl'), r2(parseDigits($('vMed').value))]);
    rows.push([t('vEmpPfDedLbl'), r2(parseDigits($('vEmpPfDed').value))]);
    rows.push([t('vPtLbl'), r2(parseDigits($('vPt').value))]);
    rows.push([t('vInhandLbl'), r2(parseDigits($('vInhand').value))]);
    rows.push([]);
    rows.push([t('verifyTitle') + ' — ' + t('computedLbl')]);
    rows.push([t('vGrossLbl'), r2(V.gross)]);
    rows.push([t('vTakeHomeLbl'), r2(V.takeHome)]);
    rows.push([t('vTotalLbl'), r2(V.total)]);
    rows.push([]);
    rows.push([t('checkTitle'), t('statusLbl'), t('detailLbl')]);
    (V.checks || []).forEach(function (c) {
      var st = c.ok === true ? 'OK' : (c.ok === false ? 'CHECK' : 'N/A');
      rows.push([c.label, st, c.detail]);
    });
    rows.push([]);
    rows.push(['Advertisement']);
    rows.push(['simplecalculator.in - Free EMI, Income Tax, EB Bill & Offer Letter calculators']);
    rows.push(['Visit https://www.simplecalculator.in']);
    return rows.map(function (r) { return r.map(esc).join(','); }).join('\r\n');
  }

  function downloadCsv() {
    var csv = '﻿' + buildCsv();
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'offer-salary-splitup.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function groupOnBlur(el) {
    el.addEventListener('blur', function () {
      var v = parseDigits(el.value);
      el.value = v ? groupIndian(v) : '';
    });
  }

  function init() {
    $('ctcInput').value = groupIndian(1200000);
    $('ctc').value = 1200000;
    $('basicPctInput').value = 50;
    $('basicPct').value = 50;

    $('ctcInput').addEventListener('input', renderAll);
    $('ctc').addEventListener('input', function () {
      var v = parseDigits($('ctc').value) || 0;
      $('ctcInput').value = groupIndian(v);
      renderAll();
    });
    $('ctcInput').addEventListener('blur', function () { $('ctcInput').value = groupIndian(parseDigits($('ctcInput').value)); });

    $('basicPctInput').addEventListener('input', function () {
      $('basicPct').value = $('basicPctInput').value;
      renderAll();
    });
    $('basicPct').addEventListener('input', function () {
      $('basicPctInput').value = $('basicPct').value;
      renderAll();
    });

    document.querySelectorAll('.vnum').forEach(function (el) {
      el.addEventListener('input', renderVerify);
      groupOnBlur(el);
    });

    $('btnCsv').addEventListener('click', downloadCsv);
    $('btnPdf').addEventListener('click', function () { window.print(); });
    $('vVarCap').addEventListener('input', renderVerify);

    renderAll();
  }

  document.addEventListener('langchange', renderAll);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
