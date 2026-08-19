'use strict';

(function () {
  var state = { amount: 1000000, rate: 10, years: 5, months: 0, scheme: 'arrears', mode: 'tenure', view: 'year', payments: [], preMonths: 0, prePart: 0, preBank: '', preChargePct: 0, startDate: todayStr() };

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  function parseStart(s) {
    if (!s) return null;
    var p = String(s).split('-');
    if (p.length < 2) return null;
    var y = Number(p[0]), m = Number(p[1]) - 1;
    if (!isFinite(y) || !isFinite(m)) return null;
    return new Date(y, m, 1);
  }

  var BANK_CHARGES = { '': 0, sbi: 0, hdfc: 0, icici: 2, axis: 2, kotak: 2, bajaj: 4, pnb: 0 };

  function calculateEmi(principal, annualRatePct, months) {
    if (principal <= 0 || months <= 0) return 0;
    if (annualRatePct === 0) return principal / months;
    var r = annualRatePct / 12 / 100;
    var factor = Math.pow(1 + r, months);
    return (principal * r * factor) / (factor - 1);
  }

  function monthDate(period) {
    var base = parseStart(state.startDate) || new Date();
    base = new Date(base.getFullYear(), base.getMonth(), 1);
    base.setMonth(base.getMonth() + period);
    return base.getFullYear() + '-' + String(base.getMonth() + 1).padStart(2, '0');
  }

  function buildSchedule() {
    var months = state.years * 12 + state.months;
    var r = state.rate / 12 / 100;
    var emi = calculateEmi(state.amount, state.rate, months);
    var balance = state.amount;
    var runningEmi = emi;

    var pays = state.payments
      .filter(function (p) { return p.period >= 1 && p.amount > 0; })
      .slice()
      .sort(function (a, b) { return a.period - b.period; });
    var idx = 0;

    var rows = [];
    for (var period = 1; period <= months; period++) {
      if (balance <= 0) break;
      var isFirst = period === 1;
      var currentEmi = runningEmi;
      var interest = balance * r;
      var emiPrincipal = currentEmi - interest;
      if (state.scheme === 'advance' && isFirst) { interest = 0; emiPrincipal = Math.min(currentEmi, balance); }
      if (emiPrincipal > balance) emiPrincipal = balance;
      var payment = interest + emiPrincipal;
      balance = balance - emiPrincipal;

      while (idx < pays.length && pays[idx].period === period) {
        var amt = Math.min(pays[idx].amount, balance);
        balance = balance - amt;
        payment = payment + amt;
        if (state.mode === 'emi' && balance > 0) {
          var remaining = months - period;
          if (remaining > 0) runningEmi = calculateEmi(balance, state.rate, remaining);
        }
        idx++;
      }

      var isLast = balance <= 0;
      if (isLast) balance = 0;
      rows.push({
        date: state.scheme === 'advance' && isFirst ? monthDate(0) : monthDate(period),
        payment: payment,
        principal: payment - interest,
        interest: interest,
        balance: balance
      });
      if (isLast) break;
    }
    return { rows: rows, emi: emi };
  }

  function computePreclosure(schedule) {
    var total = schedule.length;
    var n = Math.round(state.preMonths);
    if (!isFinite(n) || n < 0) n = 0;
    if (n > total) n = total;
    var paid = 0, interestPaid = 0, totalInterestAll = 0;
    for (var i = 0; i < total; i++) {
      totalInterestAll += schedule[i].interest;
      if (i < n) { paid += schedule[i].payment; interestPaid += schedule[i].interest; }
    }
    var outstanding = (n <= 0) ? state.amount : (n >= total ? 0 : schedule[n - 1].balance);
    var part = Math.max(0, parseDigits(state.prePart) || 0);
    if (part > outstanding) part = outstanding;
    var netPrincipal = Math.max(0, outstanding - part);
    var charge = netPrincipal * (state.preChargePct / 100);
    var closeNow = netPrincipal + charge;
    var interestSaved = Math.max(0, totalInterestAll - interestPaid);
    $('preOutstanding').textContent = currency(outstanding);
    $('prePaidSoFar').textContent = currency(paid);
    $('preInterestSaved').textContent = currency(interestSaved);
    $('preChargeAmt').textContent = currency(charge);
    $('preCloseNow').textContent = currency(closeNow);
  }

  function isInvalid() {
    var months = state.years * 12 + state.months;
    return !(state.amount > 0 && state.rate >= 0 && state.rate <= 100 &&
             state.years >= 0 && state.years <= 50 && state.months >= 0 && state.months <= 11 && months >= 1);
  }

  function arc(cx, cy, r, startAngle, endAngle) {
    var s = polar(cx, cy, r, endAngle);
    var e = polar(cx, cy, r, startAngle);
    var large = endAngle - startAngle <= 180 ? 0 : 1;
    return 'M ' + s.x + ' ' + s.y + ' A ' + r + ' ' + r + ' 0 ' + large + ' 0 ' + e.x + ' ' + e.y;
  }
  function polar(cx, cy, r, angleDeg) {
    var a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function renderChart(principal, interest) {
    var total = principal + interest;
    var share = total > 0 ? principal / total : 0;
    var svg = $('chart');
    var html = '';
    if (total > 0) {
      html += '<path d="' + arc(80, 80, 70, 0, share * 360) + '" fill="#2563eb"/>';
      html += '<path d="' + arc(80, 80, 70, share * 360, 360) + '" fill="#f59e0b"/>';
    }
    html += '<circle cx="80" cy="80" r="45" fill="#fff"/>';
    html += '<text x="80" y="76" text-anchor="middle" class="chart-center-value">' + (total > 0 ? Math.round(share * 100) : 0) + '%</text>';
    html += '<text x="80" y="94" text-anchor="middle" class="chart-center-label">' + t('principalCenter') + '</text>';
    svg.innerHTML = html;
  }

  function renderPaymentsTable() {
    var tb = $('paymentsBody');
    if (!state.payments.length) {
      tb.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#64748b;padding:14px" data-i18n="noPayments">No part payments added yet.</td></tr>';
      return;
    }
    tb.innerHTML = state.payments.map(function (p, i) {
      return '<tr>' +
        '<td><input type="number" class="pp-month" data-i="' + i + '" min="1" value="' + p.period + '"></td>' +
        '<td><input type="number" class="pp-amt" data-i="' + i + '" min="0" step="1000" value="' + p.amount + '"></td>' +
        '<td><button type="button" class="pp-del" data-i="' + i + '" aria-label="Remove">×</button></td>' +
        '</tr>';
    }).join('');
  }

  function renderResults() {
    var built = buildSchedule();
    var schedule = built.rows;
    var emi = built.emi;
    var totalPayment = 0, totalInterest = 0;
    schedule.forEach(function (row) { totalPayment += row.payment; totalInterest += row.interest; });

    var closeMonths = schedule.length;
    var closeY = Math.floor(closeMonths / 12);
    var closeM = closeMonths % 12;
    var closeLabel = (closeY > 0 ? closeY + ' yr' : '') + (closeM > 0 ? (closeY > 0 ? ' ' : '') + closeM + ' mo' : (closeY === 0 ? '0 mo' : ''));

    $('sumEmi').textContent = currency(emi);
    $('sumInterest').textContent = currency(totalInterest);
    $('sumPayment').textContent = currency(totalPayment);
    $('sumClosesIn').textContent = closeLabel + (closeMonths < (state.years * 12 + state.months) ? ' (was ' + (state.years * 12 + state.months) + ' mo)' : '');
    $('legendPrincipal').textContent = t('principalLbl') + ': ' + currency(state.amount) + ' (' + (totalPayment > 0 ? ((state.amount / totalPayment) * 100).toFixed(1) : 0) + '%)';
    $('legendInterest').textContent = t('interestLbl') + ': ' + currency(totalInterest) + ' (' + (totalPayment > 0 ? ((totalInterest / totalPayment) * 100).toFixed(1) : 0) + '%)';
    renderChart(state.amount, totalInterest);
    computePreclosure(schedule);

    var rows;
    if (state.view === 'month') {
      rows = schedule.map(function (r) { return { label: r.date, payment: r.payment, principal: r.principal, interest: r.interest, balance: r.balance }; });
    } else {
      var map = {};
      schedule.forEach(function (r) {
        var y = r.date.slice(0, 4);
        var agg = map[y] || { label: y, payment: 0, principal: 0, interest: 0, balance: 0 };
        agg.payment += r.payment; agg.principal += r.principal; agg.interest += r.interest; agg.balance = r.balance;
        map[y] = agg;
      });
      rows = Object.keys(map).map(function (k) { return map[k]; });
    }

    $('scheduleBody').innerHTML = rows.map(function (r) {
      return '<tr><td>' + r.label + '</td><td>' + currency(r.payment) + '</td><td>' + currency(r.principal) +
             '</td><td>' + currency(r.interest) + '</td><td>' + currency(r.balance) + '</td></tr>';
    }).join('');
  }

  function render() {
    var months = state.years * 12 + state.months;

    $('amount').value = state.amount;
    if (document.activeElement !== $('amountInput')) $('amountInput').value = groupIndian(state.amount);
    $('rate').value = state.rate;
    $('rateInput').value = state.rate.toFixed(1);
    $('tenureYears').value = state.years;
    $('tenureYearsInput').value = state.years;
    $('tenureMonthsInput').value = state.months;
    if (document.activeElement !== $('startDate')) $('startDate').value = state.startDate;
    $('preMonths').max = months;
    $('preMonths').value = state.preMonths;
    $('preBank').value = state.preBank;
    if (document.activeElement !== $('prePart')) $('prePart').value = groupIndian(state.prePart);
    if (document.activeElement !== $('preCharge')) $('preCharge').value = state.preChargePct;

    document.querySelectorAll('#schemeTabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.scheme === state.scheme); });
    document.querySelectorAll('#viewTabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.view === state.view); });
    document.querySelectorAll('#irMode input').forEach(function (b) { b.checked = (b.value === state.mode); });
    $('thPeriod').textContent = t(state.view);

    if (isInvalid()) {
      $('sumEmi').textContent = $('sumInterest').textContent = $('sumPayment').textContent = '-';
      $('legendPrincipal').textContent = t('principalLbl') + ': -';
      $('legendInterest').textContent = t('interestLbl') + ': -';
      $('scheduleBody').innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748b;padding:24px">' + t('validMsg') + '</td></tr>';
      renderChart(0, 0);
      return;
    }

    renderResults();
  }

  $('schemeTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.scheme = b.dataset.scheme; render();
  });

  $('viewTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.view = b.dataset.view; render();
  });

  $('irMode').addEventListener('change', function (e) {
    if (e.target.name !== 'irMode') return;
    state.mode = e.target.value; render();
  });

  $('amount').addEventListener('input', function (e) { state.amount = parseDigits(e.target.value); render(); });
  $('rate').addEventListener('input', function (e) { state.rate = parseDigits(e.target.value); render(); });
  $('tenureYears').addEventListener('input', function (e) { state.years = parseDigits(e.target.value); render(); });

  $('amountInput').addEventListener('input', function (e) { state.amount = parseDigits(e.target.value); render(); });
  $('amountInput').addEventListener('blur', function () { $('amountInput').value = groupIndian(state.amount); });
  $('rateInput').addEventListener('input', function (e) {
    var v = Number(e.target.value);
    state.rate = isFinite(v) && v >= 0 ? v : 0;
    render();
  });
  $('tenureYearsInput').addEventListener('input', function (e) {
    var v = Math.round(Number(e.target.value));
    state.years = isFinite(v) && v >= 0 ? v : 0;
    render();
  });
  $('tenureMonthsInput').addEventListener('input', function (e) {
    var v = Math.round(Number(e.target.value));
    state.months = isFinite(v) ? Math.max(0, Math.min(11, v)) : 0;
    render();
  });
  $('startDate').addEventListener('input', function (e) { state.startDate = e.target.value || todayStr(); renderResults(); });

  $('addPayment').addEventListener('click', function () {
    var next = state.payments.length ? (state.payments[state.payments.length - 1].period + 1) : 1;
    state.payments.push({ period: next, amount: 0 });
    renderPaymentsTable();
    renderResults();
  });

  $('paymentsBody').addEventListener('input', function (e) {
    var el = e.target;
    var i = parseInt(el.dataset.i, 10);
    if (isNaN(i) || !state.payments[i]) return;
    if (el.classList.contains('pp-month')) state.payments[i].period = Math.max(1, Math.round(parseDigits(el.value)));
    else if (el.classList.contains('pp-amt')) state.payments[i].amount = parseDigits(el.value);
    renderResults();
  });

  $('paymentsBody').addEventListener('click', function (e) {
    var b = e.target.closest('.pp-del'); if (!b) return;
    var i = parseInt(b.dataset.i, 10);
    if (!isNaN(i)) state.payments.splice(i, 1);
    renderPaymentsTable();
    renderResults();
  });

  $('loadList').addEventListener('click', function () {
    var text = $('pasteArea').value || '';
    var lines = text.split(/\r?\n/);
    var parsed = [];
    lines.forEach(function (line) {
      var parts = line.split(/[\s,]+/).filter(function (x) { return x.length; });
      if (parts.length < 2) return;
      var period = Math.round(parseDigits(parts[0]));
      var amount = parseDigits(parts[1]);
      if (period >= 1 && amount > 0) parsed.push({ period: period, amount: amount });
    });
    if (parsed.length) {
      state.payments = parsed;
      renderPaymentsTable();
      renderResults();
    }
  });

  $('preMonths').addEventListener('input', function (e) { state.preMonths = parseDigits(e.target.value); renderResults(); });
  $('prePart').addEventListener('input', function (e) { state.prePart = parseDigits(e.target.value); renderResults(); });
  $('prePart').addEventListener('blur', function () { $('prePart').value = groupIndian(state.prePart); });
  $('preBank').addEventListener('change', function (e) {
    state.preBank = e.target.value;
    if (BANK_CHARGES.hasOwnProperty(state.preBank)) { state.preChargePct = BANK_CHARGES[state.preBank]; }
    renderResults();
  });
  $('preCharge').addEventListener('input', function (e) { state.preChargePct = parseDigits(e.target.value); renderResults(); });

  document.addEventListener('langchange', function () { renderPaymentsTable(); render(); });
  renderPaymentsTable();
  render();
})();
