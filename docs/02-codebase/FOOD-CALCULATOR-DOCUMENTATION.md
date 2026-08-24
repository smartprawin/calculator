# Food Calculator Documentation

Auto-generated notes for `food.html` + `food.js`. The Food Calculator combines a
**nutrition** planner (calorie & macro targets plus a food-log calorie counter)
with a **monthly food budget** planner. It reuses the shared i18n system and
theme classes from the rest of the project.

## Entry points

| File | Purpose |
|------|---------|
| `food.html` | Page markup: two views toggled by a `segmented` control (`#modeTabs`) |
| `food.js` | All logic (nutrition, food log, budget) |
| `common.js` | `foodTitle` / `foodDesc` / `foodCta` i18n keys, `CALCULATORS` landing entry, `META_KEYS.food` |
| `style.css` | `.theme-food` accent (`#ea580c` / `#16a34a`) and `.cell-input` / `.row-del` table styles |

It is registered in `common.js` `CALCULATORS` as id `food` (icon 🍱, accent
`#ea580c`), so it appears automatically on the homepage landing grid.

## Modes

### 1. Nutrition (`#nutritionView`)

Inputs (state): `gender`, `age`, `weight` (kg), `height` (cm), `activity`
factor (1.2 / 1.375 / 1.55 / 1.725), `goal` (lose / maintain / gain).

- **BMR** — Mifflin-St Jeor: `10·w + 6.25·h − 5·age + (male ? 5 : −161)`.
- **TDEE (maintenance)** — `BMR × activity`.
- **Target** — `TDEE + (lose ? −500 : gain ? +300 : 0)`, floored at 1000 kcal.
- **Macros** — protein `1.8 g/kg`; fat `25%` of target kcal; carbs fill the
  remainder. Rendered as a pie chart (`#macroChart`) with a protein/carbs/fat
  legend.
- **Other nutrients** — fiber `14 g/1000 kcal`, water `35 ml/kg`, added sugar
  `≤5%` of energy, saturated fat `≤10%` of energy.

UI labels reuse existing keys (`genderLbl`, `ageLbl`, `weightLbl`, `heightLbl`,
`activityLbl`, `act*`, `goal*`, `diet*`, `nutrientsTitle`, …) so no duplicate
translations were needed.

### 2. Food calorie counter (`#foodLogBody`)

- Built-in `FOOD_DB` (~191 common Indian foods with full macros: kcal, protein, carbs, fat, fiber per 100g).
- User picks a food (or "Custom" and enters kcal/100 g), enters quantity in g/ml,
  and adds it. Each row stores `{name, grams, kcal}` with `kcal = kcalPer100 × grams / 100`.
- The log total is compared against the daily **target** from the nutrition
  section; shows remaining (`foodUnderNote`) or over (`foodOverNote`).

### 3. Monthly Budget (`#budgetView`)

Line items `{name, price, qty, freq}` where `freq ∈ {daily, weekly, monthly}`.
Monthly cost per row = `price × qty × FREQ_FACTOR` (`daily 30`, `weekly 4.3333`,
`monthly 1`). Totals: **Total Monthly Food Cost**, **Per day** (÷30), and
**Per person / month** (÷ `peopleInput`). Seeded with 3 example rows on first load.

## State & events

- `state` holds `mode`, nutrition inputs, `log[]`, and `budget[]`.
- All inputs re-render on `input` / `click`; `langchange` re-renders everything
  and rebuilds the food `<select>` so translations stay current.
- `t()` (from `common.js`) provides English/Tamil text; missing Tamil keys fall
  back to English.

## Notes

- Food-item names are proper nouns and kept in English (a "Custom" option covers
  exact label values).
- Figures are estimates for guidance only — not medical/nutrition advice.
- Web changes require `npm run build && npx cap sync` to reach the Android app.
