'use strict';

(function () {
  // 6% p.a. assumed finance/reinvest rate for the MIRR-based return.
  var ASSUMED_RATE = 0.06 / 12;
  var state = { value: 500000, members: 40, months: 40, foreman: 5, div: 18, win: 12 };

  // Modified IRR: single-valued and stable even when the cashflow has
  // several sign changes (many outflows + one prize inflow).
  function mirr(cashflows, n, rate) {
    var fvPos = 0, pvNeg = 0;
    for (var i = 0; i < cashflows.length; i++) {
      var cf = cashflows[i];
      if (cf >= 0) fvPos += cf * Math.pow(1 + rate, n - (i + 1));
      else pvNeg += cf / Math.pow(1 + rate, i + 1);
    }
    if (pvNeg === 0) return null;
    return Math.pow(fvPos / -pvNeg, 1 / n) - 1;
  }

  function row(label, formula, value) {
    return '<div class="step"><span>' + label + ' <em>(' + formula + ')</em></span><b>' + value + '</b></div>';
  }

  function compute() {
    var n = state.months;
    var m = state.members;
    var installment = state.value / m;
    var discount = state.value * (state.div / 100);
    var foremanAmt = state.value * (state.foreman / 100);
    var dividendPool = Math.max(0, discount - foremanAmt);
    var divPerMember = dividendPool / m;
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
    var r = mirr(cf, n, ASSUMED_RATE);
    var annual = (r === null) ? null : (Math.pow(1 + r, 12) - 1) * 100;

    $('sumInstallment').textContent = currency(installment);
    $('sumDiv').textContent = currency(divPerMember);
    $('sumEff').textContent = currency(effInstallment);
    $('winLabel').textContent = state.win + (currentLang === 'ta' ? ' மாதம்' : '');
    $('sumPrize').textContent = currency(prize);
    $('sumPaid').textContent = currency(totalPaid);
    $('sumReturn').textContent = (annual === null) ? '—' : (annual >= 0 ? '+' : '') + annual.toFixed(2) + '%';

    // --- Effective Annual Return breakdown (transparency) ---
    var fvPrize = prize * Math.pow(1 + ASSUMED_RATE, n - state.win);
    var pvInst = 0;
    for (var bi = 1; bi <= n; bi++) pvInst += effInstallment / Math.pow(1 + ASSUMED_RATE, bi);
    var mirrMonthly = Math.pow(fvPrize / pvInst, 1 / n) - 1;
    var netAmount = prize - totalPaid;
    var perYear = netAmount / (n / 12);
    $('calcBreakdown').innerHTML =
      row('Monthly installment / member', 'value ÷ members', currency(installment)) +
      row('Discount amount', 'value × ' + state.div + '%', currency(discount)) +
      row('Foreman commission', 'value × ' + state.foreman + '%', currency(foremanAmt)) +
      row('Dividend pool', 'discount − foreman', currency(dividendPool)) +
      row('Dividend / member / month', 'dividend pool ÷ members', currency(divPerMember)) +
      row('Effective installment', 'installment − dividend', currency(effInstallment)) +
      row('Prize (if you win)', 'value − discount', currency(prize)) +
      row('Total paid (net)', 'effective installment × ' + n + ' months', currency(totalPaid)) +
      '<div class="step"><span>Cashflow</span><b>−' + currency(effInstallment) + ' every month, +' + currency(prize) + ' in month ' + state.win + '</b></div>' +
      '<div class="step"><span>Effective Annual Return (MIRR)</span><b>' + (annual === null ? '—' : (annual >= 0 ? '+' : '') + annual.toFixed(2) + '%') + '</b></div>' +
      '<div class="step sub"><span>· FV of prize @' + (ASSUMED_RATE * 12 * 100) + '% p.a. to end</span><b>' + currency(fvPrize) + '</b></div>' +
      '<div class="step sub"><span>· PV of installments @' + (ASSUMED_RATE * 12 * 100) + '% p.a.</span><b>' + currency(pvInst) + '</b></div>' +
      '<div class="step sub"><span>· Monthly rate = (FV ÷ PV)<sup>1/' + n + '</sup> − 1</span><b>' + (mirrMonthly * 100).toFixed(4) + '%</b></div>' +
      '<div class="step"><span>Net amount (gain / loss)</span><b>' + currency(netAmount) + '</b></div>' +
      '<div class="step sub"><span>· ≈ per year over ' + (n / 12).toFixed(1) + ' yrs</span><b>' + currency(perYear) + '</b></div>' +
      '<div class="note">The rate is time-weighted (MIRR, assumed 6% p.a. finance/reinvest). The net amount is the actual rupee difference: prize − total paid (the dividend is already built into the lower installment). They can differ in sign because the large prize arrives early (month ' + state.win + ') while installments are spread out.</div>';

    // Non-winner outcome: pays the same discounted installments every month,
    // collects dividends, but never receives a prize.
    var totalDivNW = divPerMember * n;
    $('sumPrizeNW').textContent = currency(0);
    $('sumDivNW').textContent = currency(totalDivNW);
    $('sumPaidNW').textContent = currency(totalPaid);
    $('sumNetNW').textContent = currency(-totalPaid);

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
    $('members').value = state.members;
    $('membersInput').value = state.members;
    $('months').value = state.months;
    $('monthsInput').value = state.months;
    $('foreman').value = state.foreman;
    $('foremanInput').value = state.foreman.toFixed(1);
    $('div').value = state.div;
    if (document.activeElement !== $('divInput')) $('divInput').value = groupIndian(Math.round(state.value * state.div / 100));
    $('divPct').textContent = state.div.toFixed(1) + '%';
    $('win').value = state.win;
    $('winInput').value = state.win;

    var valid = state.value > 0 && state.members >= 1 && state.members <= 1000 &&
                state.months >= 1 && state.months <= 100 &&
                state.foreman >= 0 && state.foreman <= 100 &&
                state.div >= 0 && state.div <= 100 && state.win >= 1 && state.win <= state.months;
    if (!valid) {
      ['sumInstallment', 'sumDiv', 'sumEff', 'sumPrize', 'sumPaid', 'sumReturn',
       'sumPrizeNW', 'sumDivNW', 'sumPaidNW', 'sumNetNW'].forEach(function (id) {
        $(id).textContent = '-';
      });
      $('calcBreakdown').innerHTML = '';
      $('winLabel').textContent = '';
      $('scheduleBody').innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748b;padding:24px">' + t('validMsg') + '</td></tr>';
      return;
    }
    compute();
  }

  $('value').addEventListener('input', function (e) { state.value = parseDigits(e.target.value); render(); });
  $('valueInput').addEventListener('input', function (e) { state.value = parseDigits(e.target.value); render(); });
  $('valueInput').addEventListener('blur', function () { $('valueInput').value = groupIndian(state.value); });
  $('members').addEventListener('input', function (e) { state.members = Math.round(parseDigits(e.target.value)); render(); });
  $('membersInput').addEventListener('input', function (e) {
    var v = Math.round(Number(e.target.value));
    state.members = isFinite(v) && v >= 1 ? v : 1;
    render();
  });
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
