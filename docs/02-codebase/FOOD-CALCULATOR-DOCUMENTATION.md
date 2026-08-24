# Food Calculator Documentation

Auto-generated notes for `food.html` + `food.js`. The Food Calculator combines a
**nutrition** planner (calorie & macro targets plus a food-log calorie counter)
with a **monthly food budget** planner. It reuses the shared i18n system and
theme classes from the rest of the project.

## Entry points

| File | Purpose |
|------|---------|
| `food.html` | Page markup: two views toggled by a `segmented` control (`#modeTabs`) |
| `food.js` | All logic (nutrition, food log, budget, comparison) |
| `common.js` | `foodTitle` / `foodDesc` / `foodCta` i18n keys, `CALCULATORS` landing entry, `META_KEYS.food` |
| `style.css` | `.theme-food` accent (`#ea580c` / `#16a34a`), `.cell-input` / `.row-del` table styles, food calculator mobile layout, comparison table styles |

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

**Sliders:** Age, weight, and height inputs now have range sliders for easier
mobile input. Sliders sync with numeric inputs bidirectionally.

### 2. Food calorie counter (`#foodLogBody`)

- Built-in `FOOD_DB` (~260+ common Indian foods with full macros: kcal, protein, carbs, fat, fiber per 100g).
- **Searchable combobox:** Type to search food items (case-insensitive substring match). Dropdown shows top 10 matches with calorie info.
- **Unit selection:** Supports g, ml, pcs, cup, spoon, tbsp, tsp, serving, bowl, plate, glass, slice.
- **Auto-match:** Exact name match auto-selects the food item.
- Each row stores `{name, grams, qty, unit, kcal, protein, carbs, fat, fiber}`.
- The log total is compared against the daily **target** from the nutrition
  section; shows remaining (`foodUnderNote`) or over (`foodOverNote`).

**Food categories include:**
- Staples (rice, roti, bread, oats)
- South Indian (idli, dosa, vada, uttapam)
- Dals & lentils
- Vegetables (cooked and raw)
- Curries & gravies
- Snacks & street food
- Chinese & Indo-Chinese
- Grilled & fast food
- Sweets & desserts
- Dairy & beverages
- Raw vegetables & salads (cucumber, tomato, onion, lettuce, broccoli, etc.)

### 3. Monthly Budget (`#budgetView`)

Line items `{name, price, qty, freq}` where `freq ∈ {daily, weekly, monthly}`.
Monthly cost per row = `price × qty × FREQ_FACTOR` (`daily 30`, `weekly 4.3333`,
`monthly 1`). Totals: **Total Monthly Food Cost**, **Per day** (÷30), and
**Per person / month** (÷ `peopleInput`). Seeded with 3 example rows on first load.

### 4. Target vs Actual Comparison (`#comparisonBody`)

Comparison table showing target vs actual values for:
- **Calories** — Target from nutrition calc vs actual from food log
- **Protein** — 1.8g/kg body weight vs actual
- **Carbs** — Calculated target vs actual
- **Fat** — 25% of target calories vs actual
- **Fiber** — Based on calorie intake vs actual
- **Water** — 35ml/kg body weight vs estimated from food
- **Sugar (max)** — 5% of target energy
- **Saturated Fat (max)** — 10% of target energy

**Status indicators:**
- Green: Under target (good)
- Orange: Slightly over target (warning)
- Red: Over target (bad)
- Gray: No data available

## State & events

- `state` holds `mode`, nutrition inputs, `log[]`, and `budget[]`.
- All inputs re-render on `input` / `click`; `langchange` re-renders everything.
- `t()` (from `common.js`) provides English/Tamil text; missing Tamil keys fall
  back to English.
- `renderComparison()` updates the comparison table whenever nutrition or food log changes.

## Mobile layout

- Responsive grid layout: 2-column on desktop, single column on mobile
- Food add row stacks vertically on mobile (search → qty → unit → add)
- Segmented controls wrap on mobile
- Comparison table responsive with smaller fonts on mobile
- Cards have consistent min-height across breakpoints

## Notes

- Food-item names are proper nouns and kept in English.
- Figures are estimates for guidance only — not medical/nutrition advice.
- Web changes require `npm run build && npx cap sync` to reach the Android app.
- `food.html` and `food.js` are included in `scripts/copy-web.js` for mobile sync.
