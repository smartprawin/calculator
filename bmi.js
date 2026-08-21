'use strict';

(function () {
  var state = { unit: 'metric', heightCm: 170, weightKg: 65, gender: 'male', age: 30, activity: 1.2, goalKg: 62, targetCals: null };
  var CAL_PER_KG = 7700;

  var CM_PER_IN = 2.54;
  var IN_PER_FT = 12;
  var KG_PER_LB = 0.45359237;

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function round(v, d) { var f = Math.pow(10, d || 0); return Math.round(v * f) / f; }

  // Convert the current state into metric cm / kg regardless of display unit.
  function toMetric() {
    if (state.unit === 'imperial') {
      var totalIn = state.heightCm; // store imperial height as total inches in heightCm field
      var cm = totalIn * CM_PER_IN;
      var kg = state.weightKg * KG_PER_LB; // store imperial weight as pounds in weightKg field
      return { cm: cm, kg: kg };
    }
    return { cm: state.heightCm, kg: state.weightKg };
  }

  function category(bmi) {
    if (bmi < 18.5) return { key: 'catUnder', cls: 'under', color: '#0ea5e9' };
    if (bmi < 25)   return { key: 'catNormal', cls: 'normal', color: '#16a34a' };
    if (bmi < 30)   return { key: 'catOver', cls: 'over', color: '#f59e0b' };
    return { key: 'catObese', cls: 'obese', color: '#e11d48' };
  }

  function render() {
    var isImperial = state.unit === 'imperial';

    // Configure labels, ranges and current values for the chosen unit.
    var hMin, hMax, hStep, hUnit, wMin, wMax, wStep, wUnit;
    if (isImperial) {
      var totalIn = state.heightCm; // heightCm holds inches while imperial
      var ft = Math.floor(totalIn / IN_PER_FT);
      var inch = round(totalIn - ft * IN_PER_FT, 1);
      hUnit = 'ft-in'; wUnit = 'lb';
      hMin = 3 * IN_PER_FT; hMax = 7.5 * IN_PER_FT; hStep = 0.5;
      wMin = 66; wMax = 440; wStep = 0.5;
      $('heightUnit').textContent = hUnit;
      $('weightUnit').textContent = wUnit;
      $('heightInput').value = ft + "'" + inch + '"';
      $('weightInput').value = round(state.weightKg, 1); // pounds stored in weightKg
    } else {
      hUnit = 'cm'; wUnit = 'kg';
      hMin = 100; hMax = 220; hStep = 0.5;
      wMin = 30; wMax = 200; wStep = 0.5;
      $('heightUnit').textContent = hUnit;
      $('weightUnit').textContent = wUnit;
      if (document.activeElement !== $('heightInput')) $('heightInput').value = round(state.heightCm, 1);
      if (document.activeElement !== $('weightInput')) $('weightInput').value = round(state.weightKg, 1);
    }

    $('height').min = hMin; $('height').max = hMax; $('height').step = hStep;
    $('weight').min = wMin; $('weight').max = wMax; $('weight').step = wStep;
    $('height').value = isImperial ? state.heightCm : state.heightCm;
    $('weight').value = state.weightKg;
    $('heightMin').textContent = isImperial ? (Math.floor(hMin / IN_PER_FT) + "'") : (hMin + ' cm');
    $('heightMax').textContent = isImperial ? (Math.floor(hMax / IN_PER_FT) + "'") : (hMax + ' cm');
    $('weightMin').textContent = wMin + ' ' + wUnit;
    $('weightMax').textContent = wMax + ' ' + wUnit;

    document.querySelectorAll('#unitTabs button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.unit === state.unit);
    });

    document.querySelectorAll('#genderTabs button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.gender === state.gender);
    });
    document.querySelectorAll('#activityTabs button').forEach(function (b) {
      b.classList.toggle('active', Number(b.dataset.activity) === state.activity);
    });
    $('age').value = state.age;
    if (document.activeElement !== $('ageInput')) $('ageInput').value = state.age;

    // Goal weight (unit-aware, mirrors the weight field: stored in current unit).
    var gMin, gMax, gUnit, gVal;
    if (isImperial) { gMin = 66; gMax = 440; gUnit = 'lb'; gVal = state.goalKg; }
    else { gMin = 30; gMax = 200; gUnit = 'kg'; gVal = state.goalKg; }
    $('goalWeight').min = gMin; $('goalWeight').max = gMax; $('goalWeight').step = 0.5;
    $('goalWeight').value = gVal;
    $('goalWeightUnit').textContent = gUnit;
    if (document.activeElement !== $('goalWeightInput')) $('goalWeightInput').value = round(gVal, 1);
    var m = toMetric();
    var age = state.age;
    var bmr = (m.kg > 0 && m.cm > 0 && age >= 2 && age <= 100) ? bmrOf(m.kg, m.cm, age, state.gender) : 0;
    var tdee = bmr * state.activity;
    var h = m.cm / 100;
    var bmi = (m.kg > 0 && h > 0) ? m.kg / (h * h) : 0;

    if (bmi <= 0) {
      $('bmiValue').textContent = '-';
      $('bmiCategory').textContent = '-';
      $('bmiCategory').className = 'bmi-category';
      $('bmiHealthy').textContent = '-';
      $('bmiHeight').textContent = '-';
      $('bmiWeight').textContent = '-';
      $('bmiMarker').style.left = '0%';
      resetDiet();
      resetForecast();
      return;
    }

    var cat = category(bmi);
    $('bmiValue').textContent = bmi.toFixed(1);
    $('bmiValue').style.color = cat.color;
    $('bmiCategory').textContent = t(cat.key);
    $('bmiCategory').className = 'bmi-category ' + cat.cls;

    // Healthy weight range for the given height: 18.5–24.9 BMI.
    var lo = 18.5 * h * h;
    var hi = 24.9 * h * h;
    if (isImperial) {
      $('bmiHealthy').textContent = round(lo / KG_PER_LB, 1) + '–' + round(hi / KG_PER_LB, 1) + ' lb';
    } else {
      $('bmiHealthy').textContent = round(lo, 1) + '–' + round(hi, 1) + ' kg';
    }

    $('bmiHeight').textContent = isImperial
      ? (Math.floor(m.cm / CM_PER_IN / IN_PER_FT) + "'" + round((m.cm / CM_PER_IN) % IN_PER_FT, 1) + '"')
      : round(m.cm, 1) + ' cm';
    $('bmiWeight').textContent = isImperial ? round(m.kg / KG_PER_LB, 1) + ' lb' : round(m.kg, 1) + ' kg';

    // Marker position on a 10–40 BMI scale.
    var pos = clamp((bmi - 10) / (40 - 10) * 100, 0, 100);
    $('bmiMarker').style.left = pos + '%';
    $('bmiMarker').style.background = cat.color;

    // Daily target calories slider (range derived from maintenance calories).
    var tMin = Math.max(800, Math.round((tdee - 1500) / 10) * 10);
    var tMax = Math.round((tdee + 200) / 10) * 10;
    if (tdee <= 0) { tMin = 800; tMax = 4000; }
    if (state.targetCals == null) state.targetCals = Math.round((tdee - 500) / 10) * 10;
    state.targetCals = clamp(state.targetCals, tMin, tMax);
    $('targetCals').min = tMin; $('targetCals').max = tMax; $('targetCals').step = 10;
    $('targetCals').value = state.targetCals;
    if (document.activeElement !== $('targetCalsInput')) $('targetCalsInput').value = Math.round(state.targetCals);

    renderDiet(m.kg, m.cm, cat.cls);
    renderForecast(m.kg, m.cm, cat.cls, tdee);
  }

  function bmrOf(weightKg, heightCm, age, gender) {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);
  }

  function resetDiet() {
    $('dietCals').textContent = $('dietMaintain').textContent = $('dietGoal').textContent = '-';
    $('dietProtein').textContent = $('dietCarbs').textContent = $('dietFat').textContent = '-';
    $('dietFiber').textContent = $('dietWater').textContent = $('dietSugar').textContent = $('dietSatFat').textContent = '-';
    $('legendProtein').textContent = $('legendCarbs').textContent = $('legendFat').textContent = '-';
    var svg = $('dietChart'); if (svg) svg.innerHTML = '';
  }

  function resetForecast() {
    $('fcTarget').textContent = $('fcDaily').textContent = $('fcWeekly').textContent = $('fcWeeks').textContent = $('fcDate').textContent = $('fcDeficit').textContent = '-';
    var svg = $('forecastChart'); if (svg) svg.innerHTML = '';
    var ex = $('exerciseList'); if (ex) ex.innerHTML = '';
  }

  // Mifflin-St Jeor BMR, TDEE, and a goal-adjusted macro split.
  function polar(cx, cy, r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }
  function wedge(cx, cy, r, startDeg, endDeg) {
    if (endDeg - startDeg >= 360) endDeg = startDeg + 359.999;
    var s = polar(cx, cy, r, startDeg);
    var e = polar(cx, cy, r, endDeg);
    var large = (endDeg - startDeg) > 180 ? 1 : 0;
    return 'M ' + cx + ' ' + cy + ' L ' + s.x + ' ' + s.y +
           ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + e.x + ' ' + e.y + ' Z';
  }

  function drawDietPie(pPct, cPct, fPct) {
    var svg = $('dietChart');
    var cx = 80, cy = 80, r = 70;
    if (pPct + cPct + fPct <= 0) { svg.innerHTML = ''; return; }
    var html = '';
    var a0 = 0, a1 = pPct * 3.6;
    html += '<path d="' + wedge(cx, cy, r, a0, a1) + '" fill="#e11d48"/>';
    a0 = a1; a1 = a1 + cPct * 3.6;
    html += '<path d="' + wedge(cx, cy, r, a0, a1) + '" fill="#f59e0b"/>';
    a0 = a1; a1 = a1 + fPct * 3.6;
    html += '<path d="' + wedge(cx, cy, r, a0, a1) + '" fill="#0ea5e9"/>';
    html += '<circle cx="80" cy="80" r="42" fill="#fff"/>';
    html += '<text x="80" y="78" text-anchor="middle" class="chart-center-value">' + Math.round(pPct + cPct + fPct) + '%</text>';
    html += '<text x="80" y="94" text-anchor="middle" class="chart-center-label">' + t('macroCalLbl') + '</text>';
    svg.innerHTML = html;
  }

  function renderDiet(weightKg, heightCm, catCls) {
    var age = state.age;
    if (!(weightKg > 0 && heightCm > 0 && age >= 2 && age <= 100)) {
      $('dietCals').textContent = $('dietMaintain').textContent = $('dietGoal').textContent = '-';
      $('dietProtein').textContent = $('dietCarbs').textContent = $('dietFat').textContent = '-';
      $('dietFiber').textContent = $('dietWater').textContent = $('dietSugar').textContent = $('dietSatFat').textContent = '-';
      $('legendProtein').textContent = $('legendCarbs').textContent = $('legendFat').textContent = '-';
      drawDietPie(0, 0, 0);
      return;
    }

    var bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (state.gender === 'male' ? 5 : -161);
    var tdee = bmr * state.activity;

    // Goal + calorie adjustment driven by BMI category.
    var goalKey, adj;
    if (catCls === 'under')  { goalKey = 'goalGain';    adj = 300; }
    else if (catCls === 'normal') { goalKey = 'goalMaintain'; adj = 0; }
    else if (catCls === 'over')   { goalKey = 'goalLose';    adj = -400; }
    else                          { goalKey = 'goalLose';    adj = -500; }
    var target = tdee + adj;

    // Protein target g/kg by goal (higher when cutting to spare muscle).
    var protPerKg = (catCls === 'under') ? 1.8 : (catCls === 'over' || catCls === 'obese') ? 2.0 : 1.6;
    var proteinG = weightKg * protPerKg;
    var proteinCal = proteinG * 4;
    // Fats at 25% of target calories; carbs fill the rest.
    var fatCal = target * 0.25;
    var fatG = fatCal / 9;
    var carbCal = target - proteinCal - fatCal;
    if (carbCal < 0) carbCal = 0;
    var carbG = carbCal / 4;

    var totalCal = proteinCal + fatCal + carbCal;
    var pPct = totalCal > 0 ? (proteinCal / totalCal * 100) : 0;
    var cPct = totalCal > 0 ? (carbCal / totalCal * 100) : 0;
    var fPct = totalCal > 0 ? (fatCal / totalCal * 100) : 0;

    // Other nutrients / limits from dietary guidelines.
    var fiberG = target / 1000 * 14;                 // ~14 g fibre per 1000 kcal
    var fiberPct = totalCal > 0 ? (fiberG * 2 / totalCal * 100) : 0; // ~2 kcal/g
    var waterL = weightKg * 35 / 1000;               // ~35 ml per kg body weight
    var sugarG = target * 0.05 / 4;                  // WHO: added sugar < 5% energy
    var satFatG = target * 0.10 / 9;                 // sat fat < 10% energy

    $('dietCals').textContent = Math.round(target) + ' kcal';
    $('dietMaintain').textContent = Math.round(tdee) + ' kcal';
    $('dietGoal').textContent = t(goalKey);
    $('dietProtein').textContent = Math.round(proteinG) + ' g (' + Math.round(pPct) + '%)';
    $('dietCarbs').textContent = Math.round(carbG) + ' g (' + Math.round(cPct) + '%)';
    $('dietFat').textContent = Math.round(fatG) + ' g (' + Math.round(fPct) + '%)';
    $('dietFiber').textContent = Math.round(fiberG) + ' g (' + Math.round(fiberPct) + '%)';
    $('dietWater').textContent = waterL.toFixed(1) + ' L';
    $('dietSugar').textContent = Math.round(sugarG) + ' g';
    $('dietSatFat').textContent = Math.round(satFatG) + ' g';

    drawDietPie(pPct, cPct, fPct);
    $('legendProtein').textContent = t('macroProtein') + ': ' + Math.round(pPct) + '%';
    $('legendCarbs').textContent = t('macroCarbs') + ': ' + Math.round(cPct) + '%';
    $('legendFat').textContent = t('macroFat') + ': ' + Math.round(fPct) + '%';
  }

  // Projected weight loss from the current weight to the goal at a weekly rate.
  function renderForecast(weightKg, heightCm, catCls, tdee) {
    var age = state.age;
    var svg = $('forecastChart');
    if (!(weightKg > 0 && age >= 2 && age <= 100)) { resetForecast(); return; }

    var goal = state.goalKg;
    var target = state.targetCals;
    var weeklyLoss = Math.max(0, (tdee - target)) * 7 / CAL_PER_KG;

    if (!(goal > 0 && target > 0 && goal < weightKg)) {
      $('fcTarget').textContent = $('fcWeekly').textContent = $('fcWeeks').textContent = $('fcDeficit').textContent = '-';
      svg.innerHTML = '<text x="160" y="84" text-anchor="middle" class="chart-center-label">' + (goal >= weightKg ? t('fcSetGoal') : t('fcSetGoal')) + '</text>';
      return;
    }

    if (weeklyLoss <= 0) {
      $('fcTarget').textContent = Math.round(target) + ' kcal';
      $('fcDaily').textContent = Math.round(tdee - target) + ' kcal';
      $('fcWeekly').textContent = '0 kg/wk';
      $('fcWeeks').textContent = $('fcDate').textContent = $('fcDeficit').textContent = '-';
      svg.innerHTML = '<text x="160" y="84" text-anchor="middle" class="chart-center-label">' + t('fcBelow') + '</text>';
      renderExercises(0, weightKg);
      return;
    }

    var weeks = (weightKg - goal) / weeklyLoss;
    var months = weeks / 4.345;
    var totalDeficit = (weightKg - goal) * CAL_PER_KG;
    var dailyDeficit = tdee - target;

    $('fcTarget').textContent = Math.round(target) + ' kcal';
    $('fcDaily').textContent = Math.round(dailyDeficit) + ' kcal';
    $('fcWeekly').textContent = weeklyLoss.toFixed(2) + ' kg/wk';
    $('fcWeeks').textContent = Math.round(weeks) + ' wk (' + months.toFixed(1) + ' mo)';
    $('fcDeficit').textContent = Math.round(totalDeficit).toLocaleString('en-IN') + ' kcal';

    var goalDate = new Date();
    goalDate.setDate(goalDate.getDate() + Math.round(weeks * 7));
    $('fcDate').textContent = goalDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    drawForecastChart('forecastChart', weeks, weightKg, goal, weeklyLoss);
    renderExercises(Math.round(dailyDeficit), weightKg);
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

  function drawForecastChart(svgId, weeks, startW, goalW, weeklyLoss) {
    var svg = $(svgId);
    var W = 320, H = 160, padL = 34, padR = 10, padT = 12, padB = 22;
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
    // ensure final goal point
    pts.push(X(weeks).toFixed(1) + ',' + Y(goalW).toFixed(1));

    var html = '';
    // goal weight reference line
    html += '<line x1="' + padL + '" y1="' + Y(goalW).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + Y(goalW).toFixed(1) + '" stroke="#16a34a" stroke-dasharray="4 3" stroke-width="1"/>';
    html += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#e11d48" stroke-width="2.5" stroke-linejoin="round"/>';
    html += '<text x="' + (W - padR) + '" y="' + (Y(goalW) - 4).toFixed(1) + '" text-anchor="end" class="chart-center-label" fill="#16a34a">' + t('goalWeightLbl') + '</text>';
    svg.innerHTML = html;
  }

  $('unitTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var next = b.dataset.unit;
    if (next === state.unit) return;
    // Convert current values into the new unit so nothing jumps.
    var m = toMetric();
    if (next === 'imperial') {
      state.heightCm = m.cm / CM_PER_IN;            // inches
      state.weightKg = m.kg / KG_PER_LB;            // pounds
      state.goalKg = state.goalKg / KG_PER_LB;      // pounds
    } else {
      state.heightCm = m.cm;                        // cm
      state.weightKg = m.kg;                        // kg
      state.goalKg = state.goalKg * KG_PER_LB;      // kg
    }
    state.unit = next;
    render();
  });

  $('height').addEventListener('input', function (e) {
    state.heightCm = parseDigits(e.target.value); render();
  });
  $('weight').addEventListener('input', function (e) {
    state.weightKg = parseDigits(e.target.value); render();
  });

  $('heightInput').addEventListener('blur', function (e) {
    var isImperial = state.unit === 'imperial';
    if (isImperial) {
      var v = String(e.target.value).match(/(\d+)\s*['′]\s*(\d+(?:\.\d+)?)\s*["“”]?/);
      if (v) { var inches = parseDigits(v[1]) * IN_PER_FT + parseDigits(v[2]); state.heightCm = inches; }
    } else {
      state.heightCm = parseDigits(e.target.value);
    }
    render();
  });
  $('heightInput').addEventListener('input', function (e) {
    if (state.unit !== 'imperial') { state.heightCm = parseDigits(e.target.value); render(); }
  });

  $('weightInput').addEventListener('input', function (e) {
    var isImperial = state.unit === 'imperial';
    state.weightKg = parseDigits(e.target.value); render();
  });
  $('weightInput').addEventListener('blur', function () { render(); });

  $('genderTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.gender = b.dataset.gender; render();
  });
  $('activityTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.activity = Number(b.dataset.activity); render();
  });
  $('age').addEventListener('input', function (e) { state.age = Math.round(parseDigits(e.target.value)); render(); });
  $('ageInput').addEventListener('input', function (e) {
    var v = Math.round(Number(e.target.value));
    state.age = isFinite(v) && v >= 0 ? v : 0;
    render();
  });

  $('goalWeight').addEventListener('input', function (e) {
    state.goalKg = parseDigits(e.target.value);
    render();
  });
  $('goalWeightInput').addEventListener('input', function (e) {
    state.goalKg = parseDigits(e.target.value);
    render();
  });
  $('goalWeightInput').addEventListener('blur', function () { render(); });
  $('targetCals').addEventListener('input', function (e) { state.targetCals = parseDigits(e.target.value); render(); });
  $('targetCalsInput').addEventListener('input', function (e) {
    var v = Number(e.target.value);
    state.targetCals = isFinite(v) && v > 0 ? v : 0;
    render();
  });

  document.addEventListener('langchange', render);
  render();
})();
