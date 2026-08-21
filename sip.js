'use strict';

(function () {
  var state = { amount: 5000, rate: 12, years: 10, lump: 0 };

  function calculateSip(monthly, annualRatePct, months, lump) {
    var r = annualRatePct / 12 / 100;
    var fvMonthly = 0;
    if (r === 0) {
      fvMonthly = monthly * months;
    } else {
      var factor = Math.pow(1 + r, months);
      // Investment at the start of each month (typical SIP).
      fvMonthly = monthly * ((factor - 1) / r) * (1 + r);
    }
    var fvLump = lump * Math.pow(1 + r, months);
    return fvMonthly + fvLump;
  }

  function compute() {
    var months = state.years * 12;
    var r = state.rate / 12 / 100;
    var investedMonthly = state.amount * months;
    var investedLump = state.lump;
    var invested = investedMonthly + investedLump;
    var maturity = calculateSip(state.amount, state.rate, months, state.lump);
    var gains = maturity - invested;

    $('sumMaturity').textContent = currency(maturity);
    $('sumInvested').textContent = currency(invested);
    $('sumGains').textContent = currency(gains);

    var rows = [];
    for (var y = 1; y <= state.years; y++) {
      var m = y * 12;
      var inv = state.amount * m + state.lump;
      var val = calculateSip(state.amount, state.rate, m, state.lump);
      rows.push({ year: y, invested: inv, value: val, gains: val - inv });
    }
    $('scheduleBody').innerHTML = rows.map(function (rw) {
      return '<tr><td>' + rw.year + '</td><td>' + currency(rw.invested) + '</td><td>' +
             currency(rw.value) + '</td><td>' + currency(rw.gains) + '</td></tr>';
    }).join('');
  }

  function render() {
    $('amount').value = state.amount;
    if (document.activeElement !== $('amountInput')) $('amountInput').value = groupIndian(state.amount);
    $('rate').value = state.rate;
    $('rateInput').value = state.rate.toFixed(1);
    $('years').value = state.years;
    $('yearsInput').value = state.years;
    if (document.activeElement !== $('lumpInput')) $('lumpInput').value = groupIndian(state.lump);

    var valid = state.amount > 0 && state.years >= 1 && state.years <= 40 && state.rate >= 0 && state.rate <= 50;
    if (!valid) {
      $('sumMaturity').textContent = $('sumInvested').textContent = $('sumGains').textContent = '-';
      $('scheduleBody').innerHTML = '<tr><td colspan="4" style="text-align:center;color:#64748b;padding:24px">' + t('validMsg') + '</td></tr>';
      return;
    }
    compute();
  }

  $('amount').addEventListener('input', function (e) { state.amount = parseDigits(e.target.value); render(); });
  $('amountInput').addEventListener('input', function (e) { state.amount = parseDigits(e.target.value); render(); });
  $('amountInput').addEventListener('blur', function () { $('amountInput').value = groupIndian(state.amount); });
  $('rate').addEventListener('input', function (e) { state.rate = parseDigits(e.target.value); render(); });
  $('rateInput').addEventListener('input', function (e) {
    var v = Number(e.target.value);
    state.rate = isFinite(v) && v >= 0 ? v : 0;
    render();
  });
  $('years').addEventListener('input', function (e) { state.years = Math.round(parseDigits(e.target.value)); render(); });
  $('yearsInput').addEventListener('input', function (e) {
    var v = Math.round(Number(e.target.value));
    state.years = isFinite(v) && v >= 0 ? v : 0;
    render();
  });
  $('lumpInput').addEventListener('input', function (e) { state.lump = parseDigits(e.target.value); render(); });
  $('lumpInput').addEventListener('blur', function () { $('lumpInput').value = groupIndian(state.lump); });

  document.addEventListener('langchange', render);
  render();
})();
