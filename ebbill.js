'use strict';

(function () {
  var TIER1 = [
    { from: 0,    to: 100,  rate: 0 },
    { from: 100,  to: 200,  rate: 2.35 },
    { from: 200,  to: 500,  rate: 4.70 }
  ];
  var TIER2 = [
    { from: 0,    to: 100,  rate: 0 },
    { from: 100,  to: 400,  rate: 4.70 },
    { from: 400,  to: 500,  rate: 6.30 },
    { from: 500,  to: 600,  rate: 8.40 },
    { from: 600,  to: 800,  rate: 9.45 },
    { from: 800,  to: 1000, rate: 10.50 },
    { from: 1000, to: '',    rate: 11.55 }
  ];

  function cloneSlabs(arr) {
    return arr.map(function (s) { return { from: s.from, to: s.to, rate: s.rate }; });
  }

  var state = {
    units: 250,
    fixed: 0,
    shownTier: 1,
    tier1: cloneSlabs(TIER1),
    tier2: cloneSlabs(TIER2)
  };

  function activeTier(units) { return units <= 500 ? 1 : 2; }

  function syncDomToState(tierNum) {
    var rows = document.querySelectorAll('#ebSlabs .slab-row');
    var arr = [];
    rows.forEach(function (row) {
      var from = parseDigits(row.querySelector('.slab-from').value);
      var toRaw = row.querySelector('.slab-to').value;
      var to = (toRaw === '' || toRaw == null) ? '' : parseDigits(toRaw);
      var rate = parseDigits(row.querySelector('.slab-rate').value);
      arr.push({ from: from, to: to, rate: rate });
    });
    state['tier' + tierNum] = arr;
  }

  function calcEb(units, fixed, slabs) {
    var energy = 0;
    var sorted = slabs.slice().sort(function (a, b) { return a.from - b.from; });
    for (var i = 0; i < sorted.length; i++) {
      var s = sorted[i];
      var to = (s.to === '' || s.to === Infinity) ? Infinity : s.to;
      if (units > s.from) {
        var upTo = (to === Infinity) ? units : Math.min(units, to);
        energy += (upTo - s.from) * s.rate;
      }
    }
    return { energy: energy, fixed: fixed, total: energy + fixed };
  }

  function calcFixed(loadW) {
    if (!loadW || loadW <= 0) return 0;
    if (loadW <= 500) return 30;
    if (loadW <= 1000) return 45;
    var extraKW = Math.ceil((loadW - 1000) / 1000);
    return 45 + 30 * extraKW;
  }

  function buildTable(tierNum) {
    $('ebSlabs').innerHTML = '';
    state['tier' + tierNum].forEach(function (s) { addSlabRow(s.from, s.to, s.rate); });
  }

  function renderEb() {
    var units = parseDigits($('ebUnits').value) || 0;
    var loadW = parseDigits($('ebLoad').value) || 0;
    var fixed = calcFixed(loadW);
    state.units = units;

    syncDomToState(state.shownTier);
    var tier = activeTier(units);
    if (tier !== state.shownTier) {
      state.shownTier = tier;
      buildTable(tier);
      syncDomToState(tier);
    }

    var slabs = state['tier' + tier];
    var freeUnits = 0;
    if (units > 0) freeUnits = (units <= 500) ? 200 : 100;

    var fullEnergy = calcEb(units, 0, slabs).energy;
    var freeEnergy = calcEb(Math.min(units, freeUnits), 0, slabs).energy;
    var energy = Math.max(0, fullEnergy - freeEnergy);
    var total = energy + fixed;
    var freeApplied = Math.min(units, freeUnits);

    $('ebEnergy').textContent = currency(energy);
    $('ebFree').textContent = freeApplied ? freeApplied + ' units' : '-';
    $('ebFixedOut').textContent = currency(fixed);
    $('ebTotal').textContent = currency(total);
    $('ebRate').textContent = units > 0 ? currency(total / units) + ' ' + t('perUnit') : '-';
  }

  function addSlabRow(from, to, rate) {
    var row = document.createElement('div');
    row.className = 'slab-row';
    var fromStr = (from != null && from !== '' && from !== Infinity) ? groupIndian(from) : '';
    var toStr = (to != null && to !== '' && to !== Infinity) ? groupIndian(to) : '';
    var rateStr = (rate != null && rate !== '') ? groupIndian(rate) : '';
    row.innerHTML =
      '<input type="text" class="slab-from" inputmode="numeric" autocomplete="off" value="' + fromStr + '" placeholder="' + t('phFrom') + '">' +
      '<span class="slab-sep">to</span>' +
      '<input type="text" class="slab-to" inputmode="numeric" autocomplete="off" value="' + toStr + '" placeholder="' + t('phTo') + '">' +
      '<span class="slab-sep">@ ₹</span>' +
      '<input type="text" class="slab-rate" inputmode="decimal" autocomplete="off" value="' + rateStr + '" placeholder="' + t('phRate') + '">' +
      '<button type="button" class="slab-remove" title="Remove">×</button>';
    row.querySelectorAll('input').forEach(function (inp) {
      inp.addEventListener('input', renderEb);
      inp.addEventListener('blur', function () {
        var v = inp.value.trim();
        if (v !== '') inp.value = groupIndian(parseDigits(v));
      });
    });
    row.querySelector('.slab-remove').addEventListener('click', function () { row.remove(); renderEb(); });
    $('ebSlabs').appendChild(row);
  }

  function initEb() {
    state.shownTier = activeTier(200);
    $('ebUnits').value = groupIndian(200);
    $('ebLoad').value = '';
    buildTable(state.shownTier);
    $('ebUnitsRange').value = 200;

    $('ebUnits').addEventListener('input', renderEb);
    $('ebLoad').addEventListener('input', renderEb);
    $('ebUnits').addEventListener('blur', function () { $('ebUnits').value = groupIndian(parseDigits($('ebUnits').value)); });
    $('ebLoad').addEventListener('blur', function () { $('ebLoad').value = groupIndian(parseDigits($('ebLoad').value)); });
    $('ebAddSlab').addEventListener('click', function () { addSlabRow('', '', ''); renderEb(); });

    $('ebUnitsRange').addEventListener('input', function () {
      var v = parseDigits($('ebUnitsRange').value) || 0;
      $('ebUnits').value = groupIndian(v);
      renderEb();
    });
    $('ebUnits').addEventListener('input', function () {
      var v = parseDigits($('ebUnits').value) || 0;
      $('ebUnitsRange').value = Math.min(10000, v);
    });

    renderEb();
  }

  document.addEventListener('langchange', function () {
    document.querySelectorAll('#ebSlabs .slab-row').forEach(function (row) {
      row.querySelector('.slab-from').setAttribute('placeholder', t('phFrom'));
      row.querySelector('.slab-to').setAttribute('placeholder', t('phTo'));
      row.querySelector('.slab-rate').setAttribute('placeholder', t('phRate'));
    });
    renderEb();
  });

  initEb();
})();
