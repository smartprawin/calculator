'use strict';

(function () {
  var NEW_BRACKETS = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.10],
    [1600000, 0.15],
    [2000000, 0.20],
    [2400000, 0.25],
    [Infinity, 0.30]
  ];
  var OLD_BRACKETS = {
    below: [[250000, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]],
    senior: [[300000, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]],
    super: [[500000, 0], [1000000, 0.20], [Infinity, 0.30]]
  };

  function progressiveTax(income, brackets) {
    var tax = 0, prev = 0;
    for (var i = 0; i < brackets.length; i++) {
      var limit = brackets[i][0], rate = brackets[i][1];
      var amt = Math.min(income, limit) - prev;
      if (amt > 0) tax += amt * rate;
      prev = limit;
      if (income <= limit) break;
    }
    return tax;
  }

  var state = { income: 1200000, regime: 'new', age: 'below', d80c: 150000, hra: 0, other: 0 };

  function compute(regime) {
    var std = regime === 'new' ? 75000 : 50000;
    var deductions = std;
    if (regime === 'old') deductions += (state.d80c || 0) + (state.hra || 0) + (state.other || 0);
    var taxable = Math.max(0, state.income - deductions);
    var brackets = regime === 'new' ? NEW_BRACKETS : OLD_BRACKETS[state.age];
    var tax = progressiveTax(taxable, brackets);
    var rebate = 0;
    if (regime === 'new' && state.income <= 1200000) rebate = Math.min(tax, 60000);
    else if (regime === 'old' && state.income <= 500000) rebate = Math.min(tax, 12500);
    var after = Math.max(0, tax - rebate);
    var cess = after * 0.04;
    var total = after + cess;
    return { std: std, deductions: deductions, taxable: taxable, tax: tax, rebate: rebate, cess: cess, total: total };
  }

  function render() {
    var r = compute(state.regime);
    $('sumStd').textContent = currency(r.std);
    $('sumDed').textContent = currency(r.deductions);
    $('sumTaxable').textContent = currency(r.taxable);
    $('sumTax').textContent = currency(r.tax);
    $('sumRebate').textContent = currency(r.rebate);
    $('sumCess').textContent = currency(r.cess);
    $('sumTotal').textContent = currency(r.total);
    $('sumEff').textContent = state.income > 0 ? (r.total / state.income * 100).toFixed(2) + '%' : '-';

    var n = compute('new'), o = compute('old');
    $('cmpNewVal').textContent = currency(n.total);
    $('cmpOldVal').textContent = currency(o.total);
    $('cmpNew').classList.toggle('best', n.total <= o.total);
    $('cmpOld').classList.toggle('best', o.total < n.total);
    $('cmpNote').textContent = (n.total <= o.total ? t('taxNew') : t('taxOld')) + ' ' + t('lowerTax');
  }

  function setDeductionEnabled(on) {
    ['ded80C', 'ded80CInput', 'hra', 'other'].forEach(function (id) {
      $(id).disabled = !on;
      $(id).closest('.field').classList.toggle('is-disabled', !on);
    });
  }

  function syncIncome(v, fromInput) {
    state.income = Math.max(0, parseDigits(v) || 0);
    $('taxIncome').value = Math.min(state.income, 5000000);
    if (!fromInput) $('taxIncomeInput').value = groupIndian(state.income);
    render();
  }

  function sync80C(v, fromInput) {
    state.d80c = Math.max(0, Math.min(150000, parseDigits(v) || 0));
    $('ded80C').value = state.d80c;
    if (!fromInput) $('ded80CInput').value = groupIndian(state.d80c);
    render();
  }

  function initTax() {
    syncIncome(state.income);
    sync80C(state.d80c);

    $('taxIncome').addEventListener('input', function (e) { syncIncome(e.target.value, false); });
    $('taxIncomeInput').addEventListener('input', function (e) { syncIncome(e.target.value, true); });
    $('taxIncomeInput').addEventListener('blur', function () { $('taxIncomeInput').value = groupIndian(state.income); });

    $('ded80C').addEventListener('input', function (e) { sync80C(e.target.value, false); });
    $('ded80CInput').addEventListener('input', function (e) { sync80C(e.target.value, true); });
    $('ded80CInput').addEventListener('blur', function () { $('ded80CInput').value = groupIndian(state.d80c); });

    $('hra').addEventListener('input', function (e) {
      state.hra = Math.max(0, parseDigits(e.target.value)); render();
    });
    $('hra').addEventListener('blur', function () { $('hra').value = groupIndian(state.hra); });
    $('other').addEventListener('input', function (e) {
      state.other = Math.max(0, parseDigits(e.target.value)); render();
    });
    $('other').addEventListener('blur', function () { $('other').value = groupIndian(state.other); });

    $('regimeTabs').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state.regime = b.getAttribute('data-regime');
      [].forEach.call(this.querySelectorAll('button'), function (x) { x.classList.toggle('active', x === b); });
      setDeductionEnabled(state.regime === 'old');
      render();
    });

    $('ageTabs').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state.age = b.getAttribute('data-age');
      [].forEach.call(this.querySelectorAll('button'), function (x) { x.classList.toggle('active', x === b); });
      render();
    });

    setDeductionEnabled(state.regime === 'old');
    render();
  }

  document.addEventListener('langchange', render);
  initTax();
})();
