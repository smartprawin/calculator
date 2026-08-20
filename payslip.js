'use strict';

(function () {
  var state = { offer: {}, payslip: {}, compare: [] };

  function r2(n) { return Math.round(n * 100) / 100; }

  function near(a, b, tol) { return Math.abs(a - b) <= tol; }

  // New-Regime income-tax estimate (FY 2025-26): nil up to 12L (Sec 87A rebate),
  // then slab bands + 4% cess. Returns ANNUAL tax for the given taxable income.
  function newRegimeTax(income) {
    if (income <= 0) return 0;
    if (income <= 1200000) return 0;
    var bands = [[400000,0.05],[800000,0.10],[1200000,0.15],[1600000,0.20],[2000000,0.25],[2400000,0.30]];
    var tax = 0;
    for (var i = 0; i < bands.length; i++) {
      var limit = bands[i][0], rate = bands[i][1];
      var next = (i + 1 < bands.length) ? bands[i + 1][0] : Infinity;
      if (income > limit) tax += (Math.min(income, next) - limit) * rate;
      else break;
    }
    return tax * 1.04;
  }

  function render() {
    var o = {
      basic: parseDigits($('oBasic').value),
      hra: parseDigits($('oHra').value),
      special: parseDigits($('oSpecial').value),
      empPf: parseDigits($('oEmpPf').value),
      grat: parseDigits($('oGrat').value),
      vari: parseDigits($('oVar').value),
      travel: parseDigits($('oTravel').value),
      med: parseDigits($('oMed').value),
      inhand: parseDigits($('oInhand').value)
    };
    var p = {
      basic: parseDigits($('pBasic').value),
      hra: parseDigits($('pHra').value),
      special: parseDigits($('pSpecial').value),
      empPf: parseDigits($('pEmpPf').value),
      travel: parseDigits($('pTravel').value),
      med: parseDigits($('pMed').value),
      pt: parseDigits($('pPt').value),
      tax: parseDigits($('pTax').value),
      net: parseDigits($('pNet').value)
    };
    state.offer = o;
    state.payslip = p;

    // Offer-side estimated MONTHLY income tax, derived from offer gross
    // (Basic + HRA + Special + Travel + Variable), New-Regime FY 2025-26 estimate.
    var grossO = o.basic + o.hra + o.special + o.travel + o.vari;
    var taxOmonth = grossO > 0 ? (newRegimeTax(Math.max(0, grossO - 75000)) * 1.04) / 12 : 0;

    var items = [
      { key: t('cmpBasic'), o: o.basic / 12, p: p.basic },
      { key: t('cmpHra'), o: o.hra / 12, p: p.hra },
      { key: t('cmpSpecial'), o: o.special / 12, p: p.special },
      { key: t('cmpPf'), o: o.empPf / 12, p: p.empPf },
      { key: t('cmpTax'), o: taxOmonth, p: p.tax, offerComputed: true },
      { key: t('cmpTravel'), o: o.travel / 12, p: p.travel },
      { key: t('cmpMed'), o: o.med / 12, p: p.med },
      { key: t('cmpInhand'), o: o.inhand, p: p.net }
    ];

    var body = '';
    var allOk = true;
    var promptMsg = '';

    items.forEach(function (it) {
      var status, note = '';
      // Tax on the offer side is auto-computed, so a 0 estimate is a VALID value
      // and must NOT be treated as "not provided" when TDS is actually entered.
      var provided = it.offerComputed ? (it.p > 0) : (it.o > 0 && it.p > 0);
      if (provided) {
        var ok = near(it.o, it.p, Math.max(it.o, it.p) * 0.02);
        allOk = allOk && ok;
        status = ok;
        if (!ok) {
          var diff = it.p - it.o;
          if (diff < 0) note = t('payslip') + ' ' + currency(-diff) + ' ' + t('decreased');
          else if (diff > 0) note = t('payslip') + ' ' + currency(diff) + ' ' + t('increased');
        }
      } else {
        status = 'na';
      }
      var cls = status === true ? 'ok' : (status === false ? 'warn' : 'na');
      var mark = status === true ? '✓' : (status === false ? '⚠' : '–');
      var reason = (status === true) ? t('matches') : (status === false ? note : t('naReason'));
      it.ok = (status === true);
      it.reason = reason;
      body += '<div class="compare-row">' +
        '<span>' + it.key + '</span>' +
        '<span>' + (it.o > 0 ? currency(it.o) : '–') + '</span>' +
        '<span>' + (it.p > 0 ? currency(it.p) : '–') + '</span>' +
        '<span class="cmp-reason">' + reason + '</span>' +
        '<span class="cmp-mark ' + cls + '">' + mark + '</span>' +
        '</div>';
    });

    $('compareBody').innerHTML = body;

    // In-hand prompt (both sides needed for the In-Hand comparison)
    if (o.inhand <= 0 || p.net <= 0) {
      allOk = false;
      promptMsg = t('psInhandPrompt');
    }

    state.compare = items;

    // Overall verdict (replaces the separate Consistency Check card)
    var vtext = allOk ? ('✓ ' + t('verdictOk')) :
      (promptMsg ? ('⚠ ' + promptMsg) : ('⚠ ' + t('verdictIssue')));
    $('verdict').innerHTML = '<div class="verify-verdict ' + (allOk ? 'ok' : 'warn') + '">' + vtext + '</div>';

    var anyFilled = [o.basic, o.hra, o.special, o.empPf, o.grat, o.vari, o.travel, o.med, o.inhand,
      p.basic, p.hra, p.special, p.empPf, p.travel, p.med, p.pt, p.tax, p.net].some(function (v) { return v > 0; });
    if (!anyFilled) {
      $('compareBody').innerHTML = '';
      $('verdict').innerHTML = '<p class="hint">' + t('psEmpty') + '</p>';
    }
  }

  function esc(s) { return '"' + String(s).replace(/"/g, '""') + '"'; }

  function buildCsv() {
    var o = state.offer, p = state.payslip, items = state.compare;
    var rows = [];
    rows.push([t('psH1')]);
    rows.push([]);
    rows.push([t('psOfferH1')]);
    rows.push([t('oBasicLbl'), r2(o.basic)]);
    rows.push([t('oHraLbl'), r2(o.hra)]);
    rows.push([t('oSpecialLbl'), r2(o.special)]);
    rows.push([t('oEmpPfLbl'), r2(o.empPf)]);
    rows.push([t('oGratLbl'), r2(o.grat)]);
    rows.push([t('oVarLbl'), r2(o.vari)]);
    rows.push([t('oTravelLbl'), r2(o.travel)]);
    rows.push([t('oMedLbl'), r2(o.med)]);
    rows.push([t('oInhandLbl'), r2(o.inhand)]);
    rows.push([]);
    rows.push([t('psPayslipH1')]);
    rows.push([t('pBasicLbl'), r2(p.basic)]);
    rows.push([t('pHraLbl'), r2(p.hra)]);
    rows.push([t('pSpecialLbl'), r2(p.special)]);
    rows.push([t('pEmpPfLbl'), r2(p.empPf)]);
    rows.push([t('pTravelLbl'), r2(p.travel)]);
    rows.push([t('pMedLbl'), r2(p.med)]);
    rows.push([t('pPtLbl'), r2(p.pt)]);
    rows.push([t('pTaxLbl'), r2(p.tax)]);
    rows.push([t('pNetLbl'), r2(p.net)]);
    rows.push([]);
    rows.push([t('compareTitle'), t('colOffer'), t('colPayslip'), t('colReason'), t('colStatus')]);
    (items || []).forEach(function (it) {
      var st = it.ok === true ? 'OK' : (it.ok === false ? 'CHECK' : 'N/A');
      rows.push([it.key, it.o > 0 ? r2(it.o) : 'N/A', it.p > 0 ? r2(it.p) : 'N/A', it.reason || '', st]);
    });
    rows.push([]);
    rows.push(['Advertisement']);
    rows.push(['simplecalculator.in - Free EMI, Income Tax, EB Bill, Offer Letter & Payslip calculators']);
    rows.push(['Visit https://www.simplecalculator.in']);
    return rows.map(function (r) { return r.map(esc).join(','); }).join('\r\n');
  }

  function downloadCsv() {
    var csv = '﻿' + buildCsv();
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'payslip-offer-comparison.csv';
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
    document.querySelectorAll('.onum, .pnum').forEach(function (el) {
      el.addEventListener('input', render);
      groupOnBlur(el);
    });
    $('btnCsv').addEventListener('click', downloadCsv);
    $('btnPdf').addEventListener('click', function () { window.print(); });
    render();
  }

  document.addEventListener('langchange', render);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
