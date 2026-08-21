'use strict';

(function () {
  var CAL_PER_KG = 7700;
  var state = { unit: 'metric', heightCm: 170, weightKg: 80, gender: 'male', age: 30, activity: 1.2, goalKg: 70, targetCals: null };

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

  function drawForecastChart(svgId, weeks, startW, goalW, weeklyLoss) {
    var svg = document.getElementById(svgId);
    var W = 320, H = 200, padL = 34, padR = 10, padT = 12, padB = 22;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var yMin = Math.min(startW, goalW) - 1;
    var yMax = Math.max(startW, goalW) + 1;
    if (yMax - yMin < 2) yMax = yMin + 2;
    function X(w) { return padL + (weeks <= 0 ? 0 : (w / weeks) * plotW); }
    function Y(v) { return padT + (yMax - v) / (yMax - yMin) * plotH; }

    var step = weeks > 60 ? Math.ceil(weeks / 50) : 1;
    var pts = [];
    for (var w = 0; w <= weeks; w += step) {
      var wt = Math.max(goalW, startW - weeklyLoss * w);
      pts.push(X(w).toFixed(1) + ',' + Y(wt).toFixed(1));
    }
    pts.push(X(weeks).toFixed(1) + ',' + Y(goalW).toFixed(1));

    var html = '';
    html += '<line x1="' + padL + '" y1="' + Y(goalW).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + Y(goalW).toFixed(1) + '" stroke="#16a34a" stroke-dasharray="4 3" stroke-width="1"/>';
    html += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#0f766e" stroke-width="2.5" stroke-linejoin="round"/>';
    html += '<text x="' + (W - padR) + '" y="' + (Y(goalW) - 4).toFixed(1) + '" text-anchor="end" class="chart-center-label" fill="#16a34a">' + t('goalWeightLbl') + '</text>';
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
    $('age').value = state.age;
    if (document.activeElement !== $('ageInput')) $('ageInput').value = state.age;

    document.querySelectorAll('#unitTabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.unit === state.unit); });
    document.querySelectorAll('#genderTabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.gender === state.gender); });
    document.querySelectorAll('#activityTabs button').forEach(function (b) { b.classList.toggle('active', Number(b.dataset.activity) === state.activity); });

    var m = toMetric();
    var age = state.age;
    if (!(m.kg > 0 && m.cm > 0 && age >= 2 && age <= 100)) {
      $('fcTarget').textContent = $('wlMaintain').textContent = $('fcDaily').textContent = $('fcWeekly').textContent = $('fcWeeks').textContent = $('fcDate').textContent = $('fcDeficit').textContent = $('wlBmi').textContent = '-';
      document.getElementById('forecastChart').innerHTML = '';
      var ex0 = $('exerciseList'); if (ex0) ex0.innerHTML = '';
      return;
    }

    var bmr = bmrOf(m.kg, m.cm, age, state.gender);
    var tdee = bmr * state.activity;
    var goal = state.goalKg;

    // Daily target calories slider (range derived from maintenance calories).
    var tMin = Math.max(800, Math.round((tdee - 1500) / 10) * 10);
    var tMax = Math.round((tdee + 200) / 10) * 10;
    if (tdee <= 0) { tMin = 800; tMax = 4000; }
    if (state.targetCals == null) state.targetCals = Math.round((tdee - 500) / 10) * 10;
    state.targetCals = clamp(state.targetCals, tMin, tMax);
    $('targetCals').min = tMin; $('targetCals').max = tMax; $('targetCals').step = 10;
    $('targetCals').value = state.targetCals;
    if (document.activeElement !== $('targetCalsInput')) $('targetCalsInput').value = Math.round(state.targetCals);

    $('wlMaintain').textContent = Math.round(tdee) + ' kcal';

    var target = state.targetCals;
    var weeklyLoss = Math.max(0, (tdee - target)) * 7 / CAL_PER_KG;

    if (!(goal > 0 && target > 0 && goal < m.kg)) {
      $('fcTarget').textContent = $('fcDaily').textContent = $('fcWeekly').textContent = $('fcWeeks').textContent = $('fcDate').textContent = $('fcDeficit').textContent = '-';
      $('wlBmi').textContent = bmiOf(m.kg, m.cm).toFixed(1) + ' → -';
      document.getElementById('forecastChart').innerHTML = '<text x="160" y="104" text-anchor="middle" class="chart-center-label">' + t('fcSetGoal') + '</text>';
      renderExercises(0, m.kg);
      return;
    }

    if (weeklyLoss <= 0) {
      $('fcTarget').textContent = Math.round(target) + ' kcal';
      $('fcDaily').textContent = Math.round(tdee - target) + ' kcal';
      $('fcWeekly').textContent = '0 kg/wk';
      $('fcWeeks').textContent = $('fcDate').textContent = $('fcDeficit').textContent = '-';
      $('wlBmi').textContent = bmiOf(m.kg, m.cm).toFixed(1) + ' → ' + bmiOf(goal, m.cm).toFixed(1);
      document.getElementById('forecastChart').innerHTML = '<text x="160" y="104" text-anchor="middle" class="chart-center-label">' + t('fcBelow') + '</text>';
      renderExercises(0, m.kg);
      return;
    }

    var weeks = (m.kg - goal) / weeklyLoss;
    var months = weeks / 4.345;
    var totalDeficit = (m.kg - goal) * CAL_PER_KG;
    var dailyDeficit = tdee - target;

    $('fcTarget').textContent = Math.round(target) + ' kcal';
    $('fcDaily').textContent = Math.round(dailyDeficit) + ' kcal';
    $('fcWeekly').textContent = weeklyLoss.toFixed(2) + ' kg/wk';
    $('fcWeeks').textContent = Math.round(weeks) + ' wk (' + months.toFixed(1) + ' mo)';
    $('fcDeficit').textContent = Math.round(totalDeficit).toLocaleString('en-IN') + ' kcal';
    $('wlBmi').textContent = bmiOf(m.kg, m.cm).toFixed(1) + ' → ' + bmiOf(goal, m.cm).toFixed(1);

    var goalDate = new Date();
    goalDate.setDate(goalDate.getDate() + Math.round(weeks * 7));
    $('fcDate').textContent = goalDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    drawForecastChart('forecastChart', weeks, m.kg, goal, weeklyLoss);
    renderExercises(Math.round(dailyDeficit), m.kg);
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

  function renderExercises(deficit, weightKg) {
    var ul = $('exerciseList');
    if (!ul) return;
    if (!(deficit > 0) || !(weightKg > 0)) {
      ul.innerHTML = '<li class="ex-empty">' + t('exNone') + '</li>';
      return;
    }
    var html = '';
    EXERCISES.forEach(function (ex) {
      var kcalPerMin = ex.met * 3.5 * weightKg / 200;
      var mins = Math.ceil(deficit / kcalPerMin / 5) * 5;
      if (mins < 5) mins = 5;
      html += '<li><span class="ex-name">' + t(ex.key) + '</span><span class="ex-min">~' + mins + ' min/day</span></li>';
    });
    ul.innerHTML = html;
  }

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
  $('targetCals').addEventListener('input', function (e) { state.targetCals = parseNum(e.target.value); render(); });

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
  $('targetCalsInput').addEventListener('input', function (e) { var v = Number(e.target.value); state.targetCals = isFinite(v) && v > 0 ? v : 0; render(); });

  document.addEventListener('langchange', render);
  render();
})();
