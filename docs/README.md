# Documentation Index

All project documents are organized by type so planning docs and codebase docs
never mix.

## Folder rules

| Folder | Purpose | Examples |
|--------|---------|----------|
| `01-planning/` | Requirements, design, decisions, plans | PRD, tech design, project plan |
| `02-codebase/` | Auto-generated docs describing the actual code | `EMI-CALCULATOR-DOCUMENTATION.md` |
| `03-calculations/` | The math/formulas behind each calculator | `CALCULATIONS.md` |
| `04-guides/` | How-to / run / deploy guides | deployment + custom-domain guide |
| `05-changelog/` | Release notes, version history | v0.1.0 notes (future) |

**Naming rule:** numbering prefix = category, then a descriptive name, e.g.
`01-planning/01-requirements.md`, `02-codebase/EMI-CALCULATOR-DOCUMENTATION.md`.
Future docs should go into the matching numbered folder.

## Documents

### 01-planning

| Document | Description |
|----------|-------------|
| [`01-requirements.md`](01-planning/01-requirements.md) | PRD: features, custom fields, acceptance criteria |
| [`02-technical-design.md`](01-planning/02-technical-design.md) | Architecture, data model, module layout |
| [`03-project-plan.md`](01-planning/03-project-plan.md) | Phases, timeline, definition of done |

### 02-codebase

| Document | Description |
|----------|-------------|
| [`EMI-CALCULATOR-DOCUMENTATION.md`](02-codebase/EMI-CALCULATOR-DOCUMENTATION.md) | Auto-generated docs of the app (index.html landing + emi.html + ebbill.html + tax.html): engines, UI, and state |

### 03-calculations

| Document | Description |
|----------|-------------|
| [`CALCULATIONS.md`](03-calculations/CALCULATIONS.md) | Every formula used, kept separate from the code docs: EMI amortization, EB tier/slab/free-units/fixed charge, and FY 2025-26 income tax (New vs Old) |

### 04-guides

| Document | Description |
|----------|-------------|
| [`DEPLOYMENT.md`](04-guides/DEPLOYMENT.md) | Deploy on GitHub Pages, bind the custom domain `simplecalculator.in` (DNS, `CNAME`, Settings), SEO URLs, hreflang/i18n (en/ta), and social sharing |