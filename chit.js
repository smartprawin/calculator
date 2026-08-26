'use strict';

(function () {
  var state = { value: 500000, months: 40, foreman: 5, div: 18, win: 12 };

  function clampWin() {
    if (state.win < 1) state.win = 1;
    if (state.win > state.months) state.win = state.months;
  }

  function irr(cashflows) {
    // cashflows: array of numbers indexed 1..n (month). Solve sum cf_i/(1+r)^i = 0.
    function npv(r) {
      var s = 0;
      for (var i = 0; i < cashflows.length; i++) {
        s += cashflows[i] / Math.pow(1 + r, i + 1);
      }
      return s;
    }
    // NPV can have multiple roots; scan for sign changes then refine each.
    var roots = [];
    var step = 0.005, a = -0.95, prev = npv(a);
    for (var x = a + step; x <= 3; x += step) {
      var cur = npv(x);
      if (prev === 0) { roots.push(x - step); }
      else if (prev * cur < 0) {
        var lo = x - step, hi = x, fLo = prev, fHi = cur;
        for (var k = 0; k < 100; k++) {
          var mid = (lo + hi) / 2, fMid = npv(mid);
          if (Math.abs(fMid) < 1e-9) { lo = mid; break; }
          if (fLo * fMid < 0) { hi = mid; fHi = fMid; }
          else { lo = mid; fLo = fMid; }
        }
        roots.push((lo + hi) / 2);
      }
      prev = cur;
    }
    if (roots.length === 0) return null;
    var positive = roots.filter(function (r) { return r > 0; });
    if (positive.length) return Math.min.apply(null, positive);
    return Math.max.apply(null, roots);
  }

  function compute() {
    var n = state.months;
    var installment = state.value / n;
    var discount = state.value * (state.div / 100);
    var foremanAmt = state.value * (state.foreman / 100);
    var dividendPool = Math.max(0, discount - foremanAmt);
    var divPerMember = dividendPool / n;
    var effInstallment = installment - divPerMember;
    var prize = state.value * (1 - state.div / 100);

    var totalPaid = effInstallment * n;

    // Winner cashflows (month 1..n)
    var cf = [];
    for (var i = 1; i <= n; i++) {
      var flow = -effInstallment;
      if (i === state.win) flow += prize;
      cf.push(flow);
    }
    var r = irr(cf);
    var annual = (r === null) ? null : (Math.pow(1 + r, 12) - 1) * 100;

    $('sumInstallment').textContent = currency(installment);
    $('sumDiv').textContent = currency(divPerMember);
    $('sumEff').textContent = currency(effInstallment);
    $('winLabel').textContent = state.win + (currentLang === 'ta' ? ' மாதம்' : '');
    $('sumPrize').textContent = currency(prize);
    $('sumPaid').textContent = currency(totalPaid);
    $('sumReturn').textContent = (annual === null) ? '—' : (annual >= 0 ? '' : '') + annual.toFixed(2) + '%';

    var rows = [];
    for (var m = 1; m <= n; m++) {
      var isWin = m === state.win;
      var net = -effInstallment;
      rows.push({
        month: m,
        install: effInstallment,
        div: divPerMember,
        net: net,
        prize: isWin ? prize : 0,
        win: isWin
      });
    }
    $('scheduleBody').innerHTML = rows.map(function (rw) {
      return '<tr' + (rw.win ? ' style="background:rgba(192,38,211,0.08);font-weight:600"' : '') + '>' +
        '<td>' + rw.month + (rw.win ? ' ★' : '') + '</td>' +
        '<td>' + currency(rw.install) + '</td>' +
        '<td>' + currency(rw.div) + '</td>' +
        '<td>' + currency(rw.net) + '</td>' +
        '<td>' + (rw.prize ? currency(rw.prize) : '-') + '</td>' +
        '</tr>';
    }).join('');
  }

  function render() {
    state.win = Math.min(state.win, state.months);
    $('value').value = state.value;
    if (document.activeElement !== $('valueInput')) $('valueInput').value = groupIndian(state.value);
    $('months').value = state.months;
    $('monthsInput').value = state.months;
    $('foreman').value = state.foreman;
    $('foremanInput').value = state.foreman.toFixed(1);
    $('div').value = state.div;
    if (document.activeElement !== $('divInput')) $('divInput').value = groupIndian(Math.round(state.value * state.div / 100));
    $('divPct').textContent = state.div.toFixed(1) + '%';
    $('win').value = state.win;
    $('winInput').value = state.win;

    var valid = state.value > 0 && state.months >= 1 && state.months <= 100 &&
                state.foreman >= 0 && state.foreman <= 100 &&
                state.div >= 0 && state.div <= 100 && state.win >= 1 && state.win <= state.months;
    if (!valid) {
      ['sumInstallment', 'sumDiv', 'sumEff', 'sumPrize', 'sumPaid', 'sumReturn'].forEach(function (id) {
        $(id).textContent = '-';
      });
      $('winLabel').textContent = '';
      $('scheduleBody').innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748b;padding:24px">' + t('validMsg') + '</td></tr>';
      return;
    }
    compute();
  }

  $('value').addEventListener('input', function (e) { state.value = parseDigits(e.target.value); render(); });
  $('valueInput').addEventListener('input', function (e) { state.value = parseDigits(e.target.value); render(); });
  $('valueInput').addEventListener('blur', function () { $('valueInput').value = groupIndian(state.value); });
  $('months').addEventListener('input', function (e) { state.months = Math.round(parseDigits(e.target.value)); render(); });
  $('monthsInput').addEventListener('input', function (e) {
    var v = Math.round(Number(e.target.value));
    state.months = isFinite(v) && v >= 1 ? v : 1;
    render();
  });
  $('foreman').addEventListener('input', function (e) { state.foreman = parseDigits(e.target.value); render(); });
  $('foremanInput').addEventListener('input', function (e) {
    var v = Number(e.target.value);
    state.foreman = isFinite(v) && v >= 0 ? v : 0;
    render();
  });
  $('div').addEventListener('input', function (e) { state.div = parseDigits(e.target.value); render(); });
  $('divInput').addEventListener('input', function (e) {
    var amt = parseDigits(e.target.value);
    var pct = state.value > 0 ? (amt / state.value) * 100 : 0;
    state.div = isFinite(pct) && pct >= 0 ? pct : 0;
    render();
  });
  $('divInput').addEventListener('blur', function () { $('divInput').value = groupIndian(Math.round(state.value * state.div / 100)); });
  $('win').addEventListener('input', function (e) { state.win = Math.round(parseDigits(e.target.value)); render(); });
  $('winInput').addEventListener('input', function (e) {
    var v = Math.round(Number(e.target.value));
    state.win = isFinite(v) && v >= 1 ? v : 1;
    render();
  });

  document.addEventListener('langchange', render);
  render();
})();
