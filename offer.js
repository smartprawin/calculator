'use strict';

(function () {
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
  }

  function row(ok, label, detail) {
    var cls = ok ? 'ok' : 'warn';
    var mark = ok ? '✓' : '⚠';
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

    var html = '';
    var allOk = true;

    // 1. Sum of CTC-side components vs stated CTC
    if (ctc > 0 && (basic > 0 || hra > 0 || special > 0 || empPf > 0 || grat > 0 || vari > 0)) {
      var sum = basic + hra + special + empPf + grat + vari + travel + med;
      var diff = ctc - sum;
      var ok = near(ctc, sum, 1);
      allOk = allOk && ok;
      html += row(ok,
        t('chkSum'),
        ok ? t('matches') : (diff > 0 ? '+' : '') + currency(diff) + ' ' + t('vsCtc'));
    }

    // 2. Employer PF ~ 12% of Basic
    if (basic > 0 && empPf >= 0) {
      var expPf = basic * 0.12;
      var ok2 = empPf <= 0 ? true : near(empPf, expPf, Math.max(1, expPf * 0.01));
      allOk = allOk && ok2;
      html += row(ok2,
        t('chkEmpPf'),
        empPf <= 0 ? t('notGiven') : (empPf === 0 ? '' : currency(empPf) + ' / ' + t('exp') + ' ' + currency(expPf)));
    }

    // 3. Gratuity ~ 4.81% of Basic
    if (basic > 0 && grat >= 0) {
      var expG = basic * 0.0481;
      var ok3 = grat <= 0 ? true : near(grat, expG, Math.max(1, expG * 0.01));
      allOk = allOk && ok3;
      html += row(ok3,
        t('chkGrat'),
        grat <= 0 ? t('notGiven') : currency(grat) + ' / ' + t('exp') + ' ' + currency(expG));
    }

    // 4. Employee PF (deducted) ~ 12% of Basic and ~ Employer PF
    if (basic > 0 && empPfDed >= 0) {
      var expDed = basic * 0.12;
      var ok4 = empPfDed <= 0 ? true : near(empPfDed, expDed, Math.max(1, expDed * 0.01));
      allOk = allOk && ok4;
      html += row(ok4,
        t('chkEmpPfDed'),
        empPfDed <= 0 ? t('notGiven') : currency(empPfDed) + ' / ' + t('exp') + ' ' + currency(expDed));
    }

    // 5. Recompute take-home and compare to stated in-hand
    if (basic > 0 && inhand > 0) {
      var g = grossFrom(basic, hra, special);
      var ded = parseDigits($('vEmpPfDed').value) || (basic * 0.12);
      var pTax = (pt || 200) * 12;
      var taxInc = newRegimeTax(Math.max(0, g - 75000)) * 1.04;
      var calcInhand = (g - ded - pTax - taxInc) / 12;
      var ok5 = near(calcInhand, inhand, Math.max(1, inhand * 0.02));
      allOk = allOk && ok5;
      html += row(ok5,
        t('chkInhand'),
        currency(calcInhand) + ' / ' + t('stated') + ' ' + currency(inhand));
    }

    html += '<div class="verify-verdict ' + (allOk ? 'ok' : 'warn') + '">' +
      (allOk ? '✓ ' + t('verdictOk') : '⚠ ' + t('verdictIssue')) + '</div>';

    report.innerHTML = html;
  }

  function renderAll() {
    renderReference();
    renderVerify();
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

    renderAll();
  }

  document.addEventListener('langchange', renderAll);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
