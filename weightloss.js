'use strict';

(function () {
  var CAL_PER_KG = 7700;
  var state = { unit: 'metric', heightCm: 170, weightKg: 80, gender: 'male', age: 30, activity: 1.2, goalKg: 70, goalWeeks: 12, intakeCals: null, workoutKey: null, workoutMins: 30, manualWorkout: false };

  var CM_PER_IN = 2.54, IN_PER_FT = 12, KG_PER_LB = 0.45359237;

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function round(v, d) { var f = Math.pow(10, d || 0); return Math.round(v * f) / f; }
  function parseNum(v) { var n = parseFloat(String(v == null ? '' : v).replace(/[^\d.]/g, '')); return isFinite(n) ? n : 0; }

  function toMetric() {
    if (state.unit === 'imperial') {
      return { cm: state.heightCm * CM_PER_IN, kg: state.weightKg * KG_PER_LB };
    }
    return { cm: state.heightCm, kg: state.weightKg };
  }

  function bmiOf(kg, cm) { var h = cm / 100; return (kg > 0 && h > 0) ? kg / (h * h) : 0; }
  function bmrOf(weightKg, heightCm, age, gender) {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);
  }

  function drawForecastChart(svgId, weeks, startKg, goalKg, weeklyLoss, opts) {
    opts = opts || {};
    var factor = opts.unit === 'imperial' ? KG_PER_LB : 1;
    var unit = opts.unit === 'imperial' ? 'lb' : 'kg';
    var startW = startKg * factor, goalW = goalKg * factor;
    var svg = document.getElementById(svgId);
    var W = 340, H = 230, padL = 42, padR = 14, padT = 18, padB = 32;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var yLo = Math.min(startW, goalW), yHi = Math.max(startW, goalW);
    var yMin = yLo - (yHi - yLo) * 0.18 - 0.5;
    var yMax = yHi + (yHi - yLo) * 0.18 + 0.5;
    if (yMax - yMin < 3) { var mid = (yMax + yMin) / 2; yMin = mid - 1.5; yMax = mid + 1.5; }
    function X(w) { return padL + (weeks <= 0 ? 0 : (w / weeks) * plotW); }
    function Y(v) { return padT + (yMax - v) / (yMax - yMin) * plotH; }

    var step = Math.max(1, Math.round(weeks / 60));
    var pts = [];
    for (var w = 0; w <= weeks; w += step) {
      var wt = Math.max(goalW, startW - weeklyLoss * factor * w);
      pts.push([X(w), Y(wt)]);
    }
    pts.push([X(weeks), Y(goalW)]);
    var linePts = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');

    var html = '';
    html += '<defs><linearGradient id="wlArea" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#0f766e" stop-opacity="0.32"/>' +
      '<stop offset="100%" stop-color="#0f766e" stop-opacity="0.02"/></linearGradient></defs>';

    var ticks = 4;
    for (var i = 0; i <= ticks; i++) {
      var tv = yMin + (yMax - yMin) * i / ticks;
      var ty = Y(tv);
      html += '<line x1="' + padL + '" y1="' + ty.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + ty.toFixed(1) + '" stroke="#e2e8f0" stroke-width="1"/>';
      html += '<text x="' + (padL - 6) + '" y="' + (ty + 3).toFixed(1) + '" text-anchor="end" font-size="9" fill="#94a3b8">' + round(tv, 0) + '</text>';
    }
    var xLabels = 4;
    for (var j = 0; j <= xLabels; j++) {
      var tw = weeks * j / xLabels;
      var tx = X(tw);
      var lbl = weeks > 52 ? (tw / 4.345).toFixed(1) + ' mo' : Math.round(tw) + ' wk';
      html += '<text x="' + tx.toFixed(1) + '" y="' + (H - 12) + '" text-anchor="middle" font-size="9" fill="#94a3b8">' + lbl + '</text>';
    }
    html += '<text x="' + padL + '" y="' + (H - 1) + '" font-size="9" fill="#64748b">' + t('goalTimeLbl') + ' →</text>';

    html += '<polygon points="' + padL + ',' + (padT + plotH) + ' ' + linePts + ' ' + (padL + plotW) + ',' + (padT + plotH) + '" fill="url(#wlArea)"/>';
    html += '<line x1="' + padL + '" y1="' + Y(goalW).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + Y(goalW).toFixed(1) + '" stroke="#16a34a" stroke-dasharray="5 3" stroke-width="1.5"/>';
    html += '<text x="' + (W - padR) + '" y="' + (Y(goalW) - 5).toFixed(1) + '" text-anchor="end" font-size="10" font-weight="600" fill="#16a34a">' + round(goalW, 1) + ' ' + unit + ' · ' + t('goalWeightLbl') + '</text>';
    html += '<polyline points="' + linePts + '" fill="none" stroke="#0f766e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';

    html += '<circle cx="' + X(0).toFixed(1) + '" cy="' + Y(startW).toFixed(1) + '" r="4.5" fill="#0f766e"/>';
    html += '<text x="' + X(0).toFixed(1) + '" y="' + (Y(startW) - 8).toFixed(1) + '" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">' + round(startW, 1) + '</text>';
    html += '<circle cx="' + X(weeks).toFixed(1) + '" cy="' + Y(goalW).toFixed(1) + '" r="4.5" fill="#16a34a"/>';

    [0.5].forEach(function (f) {
      var wm = weeks * f;
      var v = Math.max(goalW, startW - weeklyLoss * factor * wm);
      var px = X(wm), py = Y(v);
      html += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="2.5" fill="#0d9488"/>';
      html += '<text x="' + px.toFixed(1) + '" y="' + (py - 7).toFixed(1) + '" text-anchor="middle" font-size="9" fill="#0d9488">' + round(v, 1) + ' ' + unit + '</text>';
    });

    if (opts.goalDateStr) {
      html += '<text x="' + X(weeks).toFixed(1) + '" y="' + (Y(goalW) + 14).toFixed(1) + '" text-anchor="middle" font-size="9" fill="#16a34a">' + opts.goalDateStr + '</text>';
    }
    svg.innerHTML = html;
  }

  function render() {
    var isImperial = state.unit === 'imperial';

    var hMin, hMax, hUnit, wMin, wMax, wUnit, gMin, gMax, gUnit;
    if (isImperial) {
      hMin = 3 * IN_PER_FT; hMax = 7.5 * IN_PER_FT; hUnit = 'ft-in';
      wMin = 66; wMax = 440; wUnit = 'lb';
      gMin = 66; gMax = 440; gUnit = 'lb';
      var totalIn = state.heightCm;
      var ft = Math.floor(totalIn / IN_PER_FT);
      var inch = round(totalIn - ft * IN_PER_FT, 1);
      $('heightUnit').textContent = hUnit;
      $('heightInput').value = ft + "'" + inch + '"';
      $('weightUnit').textContent = wUnit;
      $('weightInput').value = round(state.weightKg, 1);
      $('goalWeightUnit').textContent = gUnit;
      $('goalWeightInput').value = round(state.goalKg, 1);
    } else {
      hMin = 100; hMax = 220; hUnit = 'cm';
      wMin = 30; wMax = 200; wUnit = 'kg';
      gMin = 30; gMax = 200; gUnit = 'kg';
      $('heightUnit').textContent = hUnit;
      if (document.activeElement !== $('heightInput')) $('heightInput').value = round(state.heightCm, 1);
      $('weightUnit').textContent = wUnit;
      if (document.activeElement !== $('weightInput')) $('weightInput').value = round(state.weightKg, 1);
      $('goalWeightUnit').textContent = gUnit;
      if (document.activeElement !== $('goalWeightInput')) $('goalWeightInput').value = round(state.goalKg, 1);
    }

    $('height').min = hMin; $('height').max = hMax; $('height').step = 0.5; $('height').value = state.heightCm;
    $('weight').min = wMin; $('weight').max = wMax; $('weight').step = 0.5; $('weight').value = state.weightKg;
    $('goalWeight').min = gMin; $('goalWeight').max = gMax; $('goalWeight').step = 0.5; $('goalWeight').value = state.goalKg;
    $('goalWeeks').min = 1; $('goalWeeks').max = 104; $('goalWeeks').step = 1; $('goalWeeks').value = state.goalWeeks;
    if (document.activeElement !== $('goalWeeksInput')) $('goalWeeksInput').value = state.goalWeeks;
    $('age').value = state.age;
    if (document.activeElement !== $('ageInput')) $('ageInput').value = state.age;

    document.querySelectorAll('#unitTabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.unit === state.unit); });
    document.querySelectorAll('#genderTabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.gender === state.gender); });
    document.querySelectorAll('#activityTabs button').forEach(function (b) { b.classList.toggle('active', Number(b.dataset.activity) === state.activity); });

    var m = toMetric();
    var age = state.age;
    if (!(m.kg > 0 && m.cm > 0 && age >= 2 && age <= 100)) {
      $('fcIntake').textContent = $('wlMaintain').textContent = $('fcExercise').textContent = $('fcDaily').textContent = $('fcWeekly').textContent = $('fcWeeks').textContent = $('fcDate').textContent = $('fcDeficit').textContent = $('wlBmi').textContent = '-';
      document.getElementById('forecastChart').innerHTML = '';
      return;
    }

    var bmr = bmrOf(m.kg, m.cm, age, state.gender);
    var tdee = bmr * state.activity;
    var goal = state.goalKg;

    // Daily food intake slider (the single driver; replaces "Daily Target Calories").
    var iMin = 0, iMax = Math.max(6000, Math.round((tdee * 2) / 100) * 100);
    if (tdee <= 0) { iMin = 0; iMax = 6000; }
    if (state.intakeCals == null) state.intakeCals = Math.round((tdee - 500) / 10) * 10;
    state.intakeCals = clamp(state.intakeCals, iMin, iMax);
    $('intakeCals').min = iMin; $('intakeCals').max = iMax; $('intakeCals').step = 10;
    $('intakeCals').value = state.intakeCals;
    if (document.activeElement !== $('intakeCalsInput')) $('intakeCalsInput').value = Math.round(state.intakeCals);

    $('wlMaintain').textContent = Math.round(tdee) + ' kcal';
    $('fcIntake').textContent = Math.round(state.intakeCals) + ' kcal';

    var intake = state.intakeCals;
    updateAutoPlan(m.kg, tdee, intake);

    var exerciseBurned = (m.kg > 0 && state.workoutKey) ? metOf(state.workoutKey) * 3.5 * m.kg / 200 * state.workoutMins : 0;
    var netDeficit = tdee + exerciseBurned - intake;

    $('fcExercise').textContent = Math.round(exerciseBurned) + ' kcal';
    $('fcDaily').textContent = formatDeficit(netDeficit);
    $('workoutBurnText').textContent = '~' + Math.round(exerciseBurned).toLocaleString('en-IN') + ' kcal burned/day';

    var weeklyLoss = Math.max(0, netDeficit) * 7 / CAL_PER_KG;

    if (!(goal > 0 && intake > 0 && goal < m.kg)) {
      $('fcWeekly').textContent = $('fcWeeks').textContent = $('fcDate').textContent = $('fcDeficit').textContent = '-';
      $('wlBmi').textContent = bmiOf(m.kg, m.cm).toFixed(1) + ' → -';
      document.getElementById('forecastChart').innerHTML = '<text x="160" y="104" text-anchor="middle" class="chart-center-label">' + t('fcSetGoal') + '</text>';
      return;
    }

    if (netDeficit <= 0) {
      $('fcWeekly').textContent = '0 kg/wk';
      $('fcWeeks').textContent = $('fcDate').textContent = $('fcDeficit').textContent = '-';
      $('wlBmi').textContent = bmiOf(m.kg, m.cm).toFixed(1) + ' → ' + bmiOf(goal, m.cm).toFixed(1);
      document.getElementById('forecastChart').innerHTML = '<text x="160" y="104" text-anchor="middle" class="chart-center-label">' + t('fcBelow') + '</text>';
      return;
    }

    var weeks = (m.kg - goal) / weeklyLoss;
    var months = weeks / 4.345;
    var totalDeficit = (m.kg - goal) * CAL_PER_KG;

    $('fcWeekly').textContent = weeklyLoss.toFixed(2) + ' kg/wk';
    $('fcWeeks').textContent = Math.round(weeks) + ' wk (' + months.toFixed(1) + ' mo)';
    $('fcDeficit').textContent = Math.round(totalDeficit).toLocaleString('en-IN') + ' kcal';
    $('wlBmi').textContent = bmiOf(m.kg, m.cm).toFixed(1) + ' → ' + bmiOf(goal, m.cm).toFixed(1);

    var goalDate = new Date();
    goalDate.setDate(goalDate.getDate() + Math.round(weeks * 7));
    $('fcDate').textContent = goalDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    drawForecastChart('forecastChart', weeks, m.kg, goal, weeklyLoss, {
      unit: state.unit,
      goalDateStr: goalDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });
  }

  function metOf(key) {
    for (var i = 0; i < EXERCISES.length; i++) { if (EXERCISES[i].key === key) return EXERCISES[i].met; }
    return 0;
  }

  function formatDeficit(n) {
    if (n > 0) return Math.round(n) + ' kcal';
    if (n < 0) return 'Surplus ' + Math.round(-n) + ' kcal';
    return '0 kcal';
  }

  var MAX_PLAN_MINS = 120;

  function perMinBurn(met, kg) { return met * 3.5 * kg / 200; }

  function updateAutoPlan(kg, tdee, intake) {
    var pReqDef = $('plReqDeficit'), pReqBurn = $('plReqBurn'),
        pStatus = $('planStatus'), pSugg = $('planSuggestion');
    if (!pReqDef) return;

    var goal = state.goalKg, weeks = state.goalWeeks;
    if (!(kg > 0 && goal > 0 && goal < kg && weeks > 0 && intake > 0)) {
      pReqDef.textContent = pReqBurn.textContent = '-';
      pStatus.className = 'plan-status';
      pStatus.textContent = t('exNone');
      pSugg.textContent = '-';
      renderWorkoutList(null);
      return;
    }

    var totalDeficit = (kg - goal) * CAL_PER_KG;
    var reqDailyDeficit = totalDeficit / (weeks * 7);
    var foodDeficit = tdee - intake;
    var reqExBurn = reqDailyDeficit - foodDeficit;

    pReqDef.textContent = Math.round(reqDailyDeficit).toLocaleString('en-IN') + ' kcal';
    pReqBurn.textContent = (reqExBurn > 0 ? Math.round(reqExBurn) : 0) + ' kcal';

    if (reqExBurn <= 0) {
      pStatus.className = 'plan-status ok';
      pStatus.textContent = t('planFeasible') + ' — ' + t('planNoWorkout');
      pSugg.textContent = t('planNoWorkout');
      if (!state.manualWorkout) { state.workoutKey = null; state.workoutMins = 0; }
      renderWorkoutList(null);
      return;
    }

    var best = null, bestMins = Infinity;
    EXERCISES.forEach(function (ex) {
      var mins = reqExBurn / perMinBurn(ex.met, kg);
      if (mins < bestMins) { bestMins = mins; best = ex; }
    });
    if (!state.manualWorkout) { state.workoutKey = best.key; state.workoutMins = Math.round(bestMins); }

    renderWorkoutList(kg, tdee, intake);

    var bestPerDay = perMinBurn(best.met, kg) * MAX_PLAN_MINS;
    if (reqExBurn <= bestPerDay) {
      pStatus.className = 'plan-status ok';
      pStatus.textContent = t('planFeasible');
      pSugg.textContent = t('planSuggestPrefix') + t(best.key) + ' ' + Math.ceil(bestMins / 5) * 5 + ' min/day (easiest). Tap any workout above to choose.';
    } else {
      pStatus.className = 'plan-status bad';
      pStatus.textContent = t('planInfeasible') + ' — ' + t('planAdjust');
      pSugg.textContent = t('planBestEffort') + t(best.key) + ' ' + MAX_PLAN_MINS + ' min/day (' + Math.round(bestPerDay) + ' kcal) still falls short. ' + t('planAdjust');
    }
    if (intake < 1200) { pStatus.className = 'plan-status warn'; pSugg.textContent += ' ' + t('planLowIntake'); }
  }

  function renderWorkoutList(kg, tdee, intake) {
    var listEl = $('workoutList');
    if (!listEl) return;
    var goal = state.goalKg, weeks = state.goalWeeks;
    if (!(kg > 0 && goal > 0 && goal < kg && weeks > 0 && intake > 0)) { listEl.innerHTML = ''; return; }
    var reqExBurn = (kg - goal) * CAL_PER_KG / (weeks * 7) - (tdee - intake);
    if (reqExBurn <= 0) { listEl.innerHTML = ''; return; }
    listEl.innerHTML = EXERCISES.map(function (ex) {
      var mins = reqExBurn / perMinBurn(ex.met, kg);
      var rMins = Math.max(1, Math.round(mins));
      var hard = mins > MAX_PLAN_MINS;
      var active = state.workoutKey === ex.key;
      return '<button type="button" class="wk-row' + (active ? ' active' : '') + (hard ? ' too-much' : '') + '" data-key="' + ex.key + '" data-mins="' + rMins + '">' +
        '<span class="wk-name">' + t(ex.key) + '</span>' +
        '<span class="wk-mins">' + rMins + ' min/day</span></button>';
    }).join('');
  }

  var EXERCISES = [
    { key: 'exWalk', met: 3.5 },
    { key: 'exBrisk', met: 4.8 },
    { key: 'exCycle', met: 7.5 },
    { key: 'exRun', met: 8.3 },
    { key: 'exSwim', met: 6.0 },
    { key: 'exHiit', met: 8.0 },
    { key: 'exRope', met: 11 },
    { key: 'exStrength', met: 6.0 }
  ];

  $('unitTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var next = b.dataset.unit; if (next === state.unit) return;
    var m = toMetric();
    if (next === 'imperial') { state.heightCm = m.cm / CM_PER_IN; state.weightKg = m.kg / KG_PER_LB; state.goalKg = state.goalKg / KG_PER_LB; }
    else { state.heightCm = m.cm; state.weightKg = m.kg; state.goalKg = state.goalKg * KG_PER_LB; }
    state.unit = next; render();
  });
  $('genderTabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; state.gender = b.dataset.gender; render(); });
  $('activityTabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; state.activity = Number(b.dataset.activity); render(); });

  $('height').addEventListener('input', function (e) { state.heightCm = parseNum(e.target.value); render(); });
  $('weight').addEventListener('input', function (e) { state.weightKg = parseNum(e.target.value); render(); });
  $('goalWeight').addEventListener('input', function (e) { state.goalKg = parseNum(e.target.value); render(); });
  $('age').addEventListener('input', function (e) { state.age = Math.round(parseNum(e.target.value)); render(); });
  $('intakeCals').addEventListener('input', function (e) { state.intakeCals = parseNum(e.target.value); render(); });

  $('goalWeeks').addEventListener('input', function (e) { state.goalWeeks = Math.round(parseNum(e.target.value)) || 1; render(); });
  $('goalWeeksInput').addEventListener('input', function (e) { var v = Math.round(Number(e.target.value)); state.goalWeeks = isFinite(v) && v >= 1 ? v : 1; render(); });

  $('heightInput').addEventListener('blur', function (e) {
    var v = String(e.target.value).match(/(\d+)\s*['′]\s*(\d+(?:\.\d+)?)\s*["“”]?/);
    if (state.unit === 'imperial' && v) state.heightCm = parseNum(v[1]) * IN_PER_FT + parseNum(v[2]);
    else state.heightCm = parseNum(e.target.value);
    render();
  });
  $('heightInput').addEventListener('input', function (e) { if (state.unit !== 'imperial') { state.heightCm = parseNum(e.target.value); render(); } });
  $('weightInput').addEventListener('input', function (e) { state.weightKg = parseNum(e.target.value); render(); });
  $('weightInput').addEventListener('blur', function () { render(); });
  $('goalWeightInput').addEventListener('input', function (e) { state.goalKg = parseNum(e.target.value); render(); });
  $('goalWeightInput').addEventListener('blur', function () { render(); });
  $('ageInput').addEventListener('input', function (e) { var v = Math.round(Number(e.target.value)); state.age = isFinite(v) && v >= 0 ? v : 0; render(); });
  $('intakeCalsInput').addEventListener('input', function (e) { var v = Number(e.target.value); state.intakeCals = isFinite(v) && v > 0 ? v : 0; render(); });

  document.addEventListener('langchange', render);
  render();

  // ---------- Daily food intake (slider drives the whole plan) ----------
  $('intakeCals').addEventListener('input', function (e) {
    state.intakeCals = parseNum(e.target.value);
    if (document.activeElement !== $('intakeCalsInput')) $('intakeCalsInput').value = Math.round(state.intakeCals);
    render();
  });
  $('intakeCalsInput').addEventListener('input', function (e) {
    var v = Number(e.target.value);
    state.intakeCals = isFinite(v) && v > 0 ? v : 0;
    if (document.activeElement !== $('intakeCals')) $('intakeCals').value = state.intakeCals;
    render();
  });

  $('workoutList').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.workoutKey = b.dataset.key;
    state.workoutMins = Number(b.dataset.mins);
    state.manualWorkout = true;
    render();
  });
  document.addEventListener('langchange', function () { render(); });
})();
