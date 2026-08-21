'use strict';

(function () {
  var state = { mode: 'add', amount: 50000, rate: 18, type: 'intra' };

  function compute() {
    var amt = state.amount;
    var g = state.rate;
    var base, gst, total;
    if (state.mode === 'add') {
      base = amt;
      gst = base * g / 100;
      total = base + gst;
    } else {
      total = amt;
      base = g === 0 ? amt : amt / (1 + g / 100);
      gst = total - base;
    }
    return { base: base, gst: gst, total: total };
  }

  function renderSplit(r) {
    var half = r.gst / 2;
    var list = $('splitList');
    if (state.type === 'intra') {
      list.innerHTML =
        '<div class="summary-item"><dt data-i18n="gstCgst">CGST (' + (state.rate / 2) + '%)</dt><dd>' + currency(half) + '</dd></div>' +
        '<div class="summary-item"><dt data-i18n="gstSgst">SGST (' + (state.rate / 2) + '%)</dt><dd>' + currency(half) + '</dd></div>';
    } else {
      list.innerHTML =
        '<div class="summary-item"><dt data-i18n="gstIgst">IGST (' + state.rate + '%)</dt><dd>' + currency(r.gst) + '</dd></div>';
    }
    list.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
  }

  function render() {
    $('amount').value = state.amount;
    if (document.activeElement !== $('amountInput')) $('amountInput').value = groupIndian(state.amount);
    $('rate').value = state.rate;
    $('rateInput').value = state.rate.toFixed(1);

    document.querySelectorAll('#modeTabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.mode === state.mode); });
    document.querySelectorAll('#typeTabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.type === state.type); });
    document.querySelectorAll('#presetRates button').forEach(function (b) {
      b.classList.toggle('active', Number(b.dataset.preset) === state.rate);
    });

    $('amountLabel').textContent = state.mode === 'add' ? t('gstBase') : t('gstInclusive');
    $('gstLabel').textContent = state.mode === 'add' ? t('gstTaxAdded') : t('gstTaxVal');
    $('totalLabel').textContent = state.mode === 'add' ? t('gstTotal') : t('gstBase');

    if (!(state.amount > 0) || state.rate < 0) {
      $('sumBase').textContent = $('sumGst').textContent = $('sumTotal').textContent = '-';
      $('splitList').innerHTML = '';
      return;
    }

    var r = compute();
    $('sumBase').textContent = currency(r.base);
    $('sumGst').textContent = currency(r.gst);
    $('sumTotal').textContent = currency(r.total);
    renderSplit(r);
  }

  $('modeTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.mode = b.dataset.mode; render();
  });
  $('typeTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.type = b.dataset.type; render();
  });
  $('presetRates').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.rate = Number(b.dataset.preset); render();
  });

  $('amount').addEventListener('input', function (e) { state.amount = parseDigits(e.target.value); render(); });
  $('amountInput').addEventListener('input', function (e) { state.amount = parseDigits(e.target.value); render(); });
  $('amountInput').addEventListener('blur', function () { $('amountInput').value = groupIndian(state.amount); });
  $('rate').addEventListener('input', function (e) { state.rate = parseDigits(e.target.value); render(); });
  $('rateInput').addEventListener('input', function (e) {
    var v = Number(e.target.value);
    state.rate = isFinite(v) && v >= 0 ? v : 0;
    render();
  });

  document.addEventListener('langchange', render);
  render();
})();
