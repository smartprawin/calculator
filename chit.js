(function () {
  if (typeof document === 'undefined') return;

  function $(id) { return document.getElementById(id); }
  var currency = window.currency || function (n) { return '₹' + Math.round(n).toLocaleString('en-IN'); };
  var currentLang = window.currentLang || 'en';
  document.addEventListener('langchange', function () { currentLang = window.currentLang || 'en'; render(); });

  var ASSUMED_RATE = 0.06 / 12; // 6% p.a. assumed finance / reinvest rate for MIRR

  // Modified internal rate of return that handles multiple sign changes.
  function mirr(cf, n, rate) {
    var fp = 0, pn = 0;
    for (var i = 0; i < cf.length; i++) {
      var c = cf[i];
      if (c >= 0) fp += c * Math.pow(1 + rate, n - (i + 1));
      else pn += c / Math.pow(1 + rate, i + 1);
    }
    if (pn === 0) return null;
    return Math.pow(fp / -pn, 1 / n) - 1;
  }

  function mirrDetail(cf, n, rate) {
    var fp = 0, pn = 0;
    for (var i = 0; i < cf.length; i++) {
      var c = cf[i];
      if (c >= 0) fp += c * Math.pow(1 + rate, n - (i + 1));
      else pn += c / Math.pow(1 + rate, i + 1);
    }
    if (pn === 0) return null;
    var monthly = Math.pow(fp / -pn, 1 / n) - 1;
    return { fv: fp, pv: -pn, monthly: monthly, annual: (Math.pow(1 + monthly, 12) - 1) * 100 };
  }

  var DEFAULT_DIV = 18;
  var state = {
    value: 500000,
    members: 40,
    months: 40,
    foreman: 5,
    payout: 'A',
    prizes: []
  };

  function defaultPrize() { return Math.round(state.value * (1 - DEFAULT_DIV / 100)); }

  function ensurePrizes() {
    var arr = state.prizes.slice();
    arr.length = state.months;
    for (var i = 0; i < state.months; i++) {
      if (!isFinite(arr[i]) || arr[i] <= 0) arr[i] = defaultPrize();
    }
    state.prizes = arr;
  }

  // Dividend per eligible member in month k (1-indexed).
  function monthDividend(k) {
    var pool = Math.max(0, (state.value - state.prizes[k - 1]) - state.value * (state.foreman / 100));
    var elig = (state.payout === 'B') ? (state.members - 1) : (state.members - k);
    if (elig <= 0) return 0;
    return pool / elig;
  }

  // Outcome for the member who wins in month w (1-indexed).
  function position(w) {
    var inst = state.value / state.members;
    var n = state.months;
    var cf = [], divEarned = 0, paid = 0;
    for (var k = 1; k <= n; k++) {
      var flow = 0;
      var pays = !(state.payout === 'C' && k > w); // winner exits after winning
      if (pays) { flow -= inst; paid += inst; }
      var getsDiv = false;
      if (k < w) getsDiv = true;
      else if (k === w) getsDiv = false;
      else getsDiv = (state.payout === 'B'); // all except winner get dividend
      if (getsDiv) { var d = monthDividend(k); flow += d; divEarned += d; }
      if (k === w) flow += state.prizes[w - 1];
      cf.push(flow);
    }
    var net = cf.reduce(function (a, b) { return a + b; }, 0);
    var r = mirr(cf, n, ASSUMED_RATE);
    var ret = (r === null) ? null : (Math.pow(1 + r, 12) - 1) * 100;
    return { month: w, prize: state.prizes[w - 1], divEarned: divEarned, paid: paid, net: net, ret: ret, cf: cf };
  }

  // A member who never wins: pays every month, collects dividend every month.
  function neverWin() {
    var inst = state.value / state.members;
    var n = state.months;
    var div = 0;
    for (var k = 1; k <= n; k++) div += monthDividend(k);
    var paid = n * inst;
    return { divEarned: div, paid: paid, net: div - paid };
  }

  function computeAll() {
    var rows = [];
    for (var w = 1; w <= state.months; w++) rows.push(position(w));
    var last = rows[rows.length - 1];
    var best = rows[0], worst = rows[0];
    for (var i = 1; i < rows.length; i++) {
      if (rows[i].net > best.net) best = rows[i];
      if (rows[i].net < worst.net) worst = rows[i];
    }
    var nw = neverWin();
    var avgDiv = 0;
    for (var m = 1; m <= state.months; m++) avgDiv += monthDividend(m);
    avgDiv = state.months > 0 ? avgDiv / state.months : 0;
    return {
      rows: rows, last: last, best: best, worst: worst, nw: nw, avgDiv: avgDiv,
      bestMonth: rows.indexOf(best) + 1, worstMonth: rows.indexOf(worst) + 1
    };
  }

  function fmtRet(r) { return (r === null) ? '—' : (r >= 0 ? '+' : '') + r.toFixed(2) + '%'; }
  function fmtNet(n) { return (n >= 0 ? '' : '-') + currency(Math.abs(n)); }

  function renderSchedule() {
    var n = state.months;
    var inst = state.value / state.members;
    var rows = [];
    for (var mm = 1; mm <= n; mm++) {
      var div = monthDividend(mm);
      var net = -(inst - div);
      rows.push(
        '<tr' + (mm === n ? ' class="last"' : '') + '>' +
          '<td>' + mm + (mm === n ? ' ★' : '') + '</td>' +
          '<td>' + currency(inst) + '</td>' +
          '<td>' + currency(div) + '</td>' +
          '<td>' + currency(net) + '</td>' +
          '<td><input class="prize-input" data-month="' + mm + '" inputmode="numeric" placeholder="—" value="' + groupIndian(state.prizes[mm - 1]) + '"></td>' +
        '</tr>'
      );
    }
    $('scheduleBody').innerHTML = rows.join('');
  }

  function renderResults(data) {
    var rows = [];
    for (var i = 0; i < data.rows.length; i++) {
      var r = data.rows[i];
      var isLast = (i === data.rows.length - 1);
      rows.push(
        '<tr' + (isLast ? ' class="last"' : '') + '>' +
          '<td>' + r.month + (isLast ? ' ★' : '') + '</td>' +
          '<td>' + currency(r.prize) + '</td>' +
          '<td>' + currency(r.divEarned) + '</td>' +
          '<td>' + currency(r.paid) + '</td>' +
          '<td class="' + (r.net >= 0 ? 'pos' : 'neg') + '">' + fmtNet(r.net) + '</td>' +
          '<td>' + fmtRet(r.ret) + '</td>' +
        '</tr>'
      );
    }
    $('posBody').innerHTML = rows.join('');

    $('sumInstallment').textContent = currency(state.value / state.members);
    $('avgDiv').textContent = currency(data.avgDiv);

    $('lastPrize').textContent = currency(data.last.prize);
    $('lastDiv').textContent = currency(data.last.divEarned);
    $('lastPaid').textContent = currency(data.last.paid);
    $('lastNet').textContent = fmtNet(data.last.net);
    $('lastRet').textContent = fmtRet(data.last.ret);

    $('bestMonth').textContent = data.bestMonth + (currentLang === 'ta' ? ' மாதம்' : '');
    $('bestNet').textContent = fmtNet(data.best.net);
    $('worstMonth').textContent = data.worstMonth + (currentLang === 'ta' ? ' மாதம்' : '');
    $('worstNet').textContent = fmtNet(data.worst.net);

    $('nwDiv').textContent = currency(data.nw.divEarned);
    $('nwPaid').textContent = currency(data.nw.paid);
    $('nwNet').textContent = fmtNet(data.nw.net);

    $('calcBreakdown').innerHTML = lastBreakdown(data.last);
  }

  function lastBreakdown(r) {
    function row(label, formula, val) {
      return '<div class="step"><span>' + label + ' <em>' + formula + '</em></span><b>' + val + '</b></div>';
    }
    var inst = state.value / state.members;
    var d = mirrDetail(r.cf, state.months, ASSUMED_RATE);
    var html = '';
    html += row('Monthly installment / member', 'value ÷ members', currency(inst));
    html += row('Prize (last month)', 'entered for month ' + r.month, currency(r.prize));
    html += row('Dividend earned (total)', 'sum of monthly dividends', currency(r.divEarned));
    html += row('Total installments paid', 'installment × ' + state.months + ' months', currency(r.paid));
    html += '<div class="step"><span>Cashflow</span><b>−' + currency(inst) + ' each month, +' + currency(r.divEarned) + ' dividends, +' + currency(r.prize) + ' in month ' + r.month + '</b></div>';
    if (d) {
      html += '<div class="step"><span>Effective Annual Return (MIRR)</span><b>' + (d.annual >= 0 ? '+' : '') + d.annual.toFixed(2) + '%</b></div>';
      html += '<div class="step sub"><span>· FV of inflows @' + (ASSUMED_RATE * 12 * 100) + '% p.a. to end</span><b>' + currency(d.fv) + '</b></div>';
      html += '<div class="step sub"><span>· PV of outflows @' + (ASSUMED_RATE * 12 * 100) + '% p.a.</span><b>' + currency(d.pv) + '</b></div>';
      html += '<div class="step sub"><span>· Monthly rate = (FV ÷ PV)<sup>1/' + state.months + '</sup> − 1</span><b>' + (d.monthly * 100).toFixed(4) + '%</b></div>';
    }
    html += '<div class="step"><span>Net savings (gain / loss)</span><b>' + fmtNet(r.net) + '</b></div>';
    html += '<div class="note">The rate is time-weighted (MIRR, assumed 6% p.a. finance/reinvest). Net savings is the actual rupee difference: prize + dividends − installments paid.</div>';
    return html;
  }

  function render() {
    ensurePrizes();
    var data = computeAll();
    renderSchedule();
    renderResults(data);
  }

  // Initialise input fields from state
  function initInputs() {
    $('valueInput').value = groupIndian(state.value);
    $('value').value = state.value;
    $('membersInput').value = state.members;
    $('members').value = Math.min(state.members, 200);
    $('monthsInput').value = state.months;
    $('months').value = Math.min(state.months, 120);
    $('foremanInput').value = state.foreman;
    $('foreman').value = state.foreman;
    $('payout').value = state.payout;
    $('applyDiv').value = DEFAULT_DIV;
  }

  function bind() {
    $('valueInput').addEventListener('input', function (e) { state.value = parseDigits(e.target.value); render(); });
    $('value').addEventListener('input', function (e) { state.value = parseDigits(e.target.value); $('valueInput').value = groupIndian(state.value); render(); });

    $('membersInput').addEventListener('input', function (e) {
      var v = Math.round(Number(e.target.value)); state.members = isFinite(v) && v >= 1 ? v : 1; render();
    });
    $('members').addEventListener('input', function (e) { state.members = Math.round(Number(e.target.value)); $('membersInput').value = state.members; render(); });

    $('monthsInput').addEventListener('input', function (e) {
      var v = Math.round(Number(e.target.value)); state.months = isFinite(v) && v >= 1 ? v : 1; render();
    });
    $('months').addEventListener('input', function (e) { state.months = Math.round(Number(e.target.value)); $('monthsInput').value = state.months; render(); });

    $('foremanInput').addEventListener('input', function (e) { state.foreman = parseDigits(e.target.value); render(); });
    $('foreman').addEventListener('input', function (e) { state.foreman = parseDigits(e.target.value); $('foremanInput').value = state.foreman; render(); });

    $('payout').addEventListener('change', function (e) { state.payout = e.target.value; render(); });

    $('applyAll').addEventListener('click', function () {
      var x = parseFloat($('applyDiv').value);
      if (!isFinite(x)) x = DEFAULT_DIV;
      var p = Math.round(state.value * (1 - x / 100));
      for (var i = 0; i < state.months; i++) state.prizes[i] = p;
      render();
    });

    // Editable prize cells: typing updates that month's prize and recomputes
    // everything, without rebuilding the table (so focus is preserved).
    $('scheduleBody').addEventListener('input', function (e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains('prize-input')) return;
      var m = parseInt(t.getAttribute('data-month'), 10);
      var clean = t.value.replace(/\.\d*$/, '');
      if (clean !== t.value) t.value = clean;
      var p = parseDigits(clean);
      if (!isFinite(p) || p <= 0) return;
      state.prizes[m - 1] = Math.round(p);
      var row = t.parentNode.parentNode;
      if (row && row.cells) {
        var div = monthDividend(m);
        var inst = state.value / state.members;
        row.cells[2].textContent = currency(div);
        row.cells[3].textContent = currency(-(inst - div));
      }
      renderResults(computeAll());
    });
    $('scheduleBody').addEventListener('blur', function (e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains('prize-input')) return;
      var m = parseInt(t.getAttribute('data-month'), 10);
      if (isFinite(state.prizes[m - 1])) t.value = groupIndian(state.prizes[m - 1]);
    }, true);

    render();
  }

  function start() {
    initInputs();
    bind();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
