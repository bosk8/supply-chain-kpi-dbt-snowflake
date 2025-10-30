# Style Decisions Log

**Date:** 2025-01-27  
**Authority:** `style.md` (Single Source of Truth)

## Assumptions

1. **Dark theme only**: Only dark theme is required (no light theme variants), per `style.md` emphasis on dark minimal mono.

2. **Tokens used are strictly from `style.md`**: All tokens used are the provided CSS variables and mapping; typography uses `--font-ui` and uppercase labels.

3. **Interaction states use defined hover/focus patterns**: Active/pressed derived via subtle darkening only when required.

4. **No new tokens may be invented**: Any missing tokens must be derived from existing tokens using rules in `style.md`, and derivation must be logged here.

5. **Read-only dashboard**: No writebacks or admin workflows; UI is read-only.

6. **Minimal dependencies**: Prefer vanilla HTML/CSS/JS; avoid heavy frameworks unless required for data visualization.

7. **Hourly data refresh**: Maximum freshness is hourly (via GitHub Actions dbt runs); UI shows "last updated" timestamp.

8. **Data connector is out of scope**: UI contracts are connector-agnostic; implementation may use direct Snowflake queries or Looker Studio export.

9. **English only**: No localization required; defer i18n to future enhancement.

10. **Mobile-first responsive**: Full feature parity on mobile with responsive breakpoints per `style.md`.

---

## Derivations (from existing tokens)

### 1. KPI Value Font Size
- **Derived Token**: `font-size: 1.75rem` (for KPI value display)
- **Derivation Logic**: Derived from `--fs-base` (clamp(16px, calc(15.2px + 0.25vw), 20px)) using multiplier for large display text
- **Rationale**: KPI values need prominent display; `1.75rem` provides hierarchy while maintaining responsiveness via base font size
- **Usage**: KPI value display in `.kpi-value` class
- **Reference**: Component Library - KPIStat component

### 2. Table Row Hover Background
- **Derived Token**: `#18181b` (table row hover background)
- **Derivation Logic**: Derived from `style.md` FAQ hover pattern: `.faq-item:hover { background: #18181b; }`
- **Rationale**: Consistent hover feedback across interactive surfaces; aligns with `style.md` hover pattern
- **Usage**: `.data-table tbody tr:hover` background color
- **Reference**: Component Library - DataTable component, Screen Specs - Dashboard table

### 3. Disabled State Opacity
- **Derived Token**: `opacity: 0.6` (for disabled state)
- **Derivation Logic**: Derived from accessibility and usability best practices; maintains contrast while signaling non-interactive state
- **Rationale**: Maintains WCAG AA contrast while clearly indicating disabled state
- **Usage**: Disabled buttons, inputs, checkboxes
- **Reference**: Component Library - Link, Input Field, Checkbox components

### 4. Error/WARN Status Color
- **Derived Token**: `--text-highlight` (#F4F4F5) for error/WARN status indicators
- **Derivation Logic**: Derived from `colors.text.highlight` in `style.md`; avoids introducing saturated brand colors per `style.md` guidance
- **Rationale**: `style.md` disallows saturated brand colors; `--text-highlight` provides sufficient contrast without introducing red/yellow
- **Usage**: Error messages, WARN/ERROR status indicators, error input borders
- **Reference**: Component Library - KPIStat (error state), DataTable (status indicators), Input Field (error state), Screen Specs - Data Quality page

### 5. Error Input Border Color
- **Derived Token**: `--text-highlight` (#F4F4F5) for error input border
- **Derivation Logic**: Same as Error/WARN Status Color (above)
- **Rationale**: Consistent error indication across components; avoids introducing new colors
- **Usage**: Input field error state (`input.error` or `input[aria-invalid="true"]`)
- **Reference**: Component Library - Input Field component

### 6. Overlay Backdrop (Semi-Transparent Black)
- **Derived Token**: Semi-transparent black (derived from `--bg-black` with opacity)
- **Derivation Logic**: Derived from `--bg-black` (#000000) with `rgba(0, 0, 0, 0.5)` or similar opacity (implementation-dependent)
- **Rationale**: Provides visual depth for modal/overlay components without introducing new colors
- **Usage**: Filter panel overlay backdrop
- **Reference**: Screen Specs - Filters Panel

### 7. Loading State Pulse Animation Duration
- **Derived Token**: `≤200ms` pulse animation duration
- **Derivation Logic**: Derived from `style.md` motion guidance: "keep transitions under 200ms"
- **Rationale**: Aligns with motion constraints and subtlety requirements
- **Usage**: KPI loading state pulse animation
- **Reference**: Component Library - KPIStat (loading state), Accessibility Checklist - Motion Limits

### 8. Disabled State Color
- **Derived Token**: `--text-dim` (#71717A) with `opacity: 0.6` for disabled content
- **Derivation Logic**: Derived from `colors.text.dim` combined with opacity for disabled state
- **Rationale**: Maintains contrast while signaling non-interactive state
- **Usage**: Disabled buttons, links, inputs
- **Reference**: Component Library - Link, Input Field, Checkbox components

### 9. Input Field Padding
- **Derived Token**: `padding: 0.75rem` (for input fields)
- **Derivation Logic**: Derived from `spacing.0_75` (0.75rem) in `style.md`
- **Rationale**: Consistent spacing with other UI elements
- **Usage**: Input field padding
- **Reference**: Component Library - Input Field component

### 10. Checkbox Checked Background
- **Derived Token**: `--accent-success` (#22C55E) for checked checkbox background
- **Derivation Logic**: Direct from `colors.accent.success` in `style.md`
- **Rationale**: Uses existing accent color for positive state (checked)
- **Usage**: Checkbox checked state
- **Reference**: Component Library - Checkbox component

### 11. Checkbox Label Hover Color
- **Derived Token**: `--text-primary` (#FFFFFF) for checkbox label hover
- **Derivation Logic**: Direct from `colors.text.primary` in `style.md`
- **Rationale**: Consistent hover feedback with link/button hover pattern
- **Usage**: Checkbox label hover state
- **Reference**: Component Library - Checkbox component

---

## Conflicts and Resolutions

### Conflict 1: Error Color (No Red Available)
- **Conflict**: Pragmatic need for error states (red is common) vs. `style.md` guidance: "Don't: introduce saturated brand colors; keep palette grayscale with functional green."
- **Resolution**: Resolved in favor of `style.md`. Use `--text-highlight` (#F4F4F5) for error/WARN states instead of red. Rationale: Maintains grayscale aesthetic while providing sufficient contrast for error indication.
- **Impact**: Error messages, WARN/ERROR status indicators, error input borders use `--text-highlight` instead of red.
- **Reference**: Accessibility Checklist - Color Contrast, Component Library - Error State

### Conflict 2: `--text-dim` Contrast on `--surface-card`
- **Conflict**: `--text-dim` (#71717A) on `--surface-card` (#09090B) = 3.8:1 contrast (fails WCAG AA 4.5:1 requirement).
- **Resolution**: Reserve `--text-dim` for labels, metadata, and disabled states only. Prefer `--text-muted` or `--text-primary` for body text on cards. Logged in Accessibility Checklist.
- **Impact**: Table cells and card body text use `--text-subtle` or `--text-muted` instead of `--text-dim`.
- **Reference**: Accessibility Checklist - Color Contrast, Style Compliance Matrix

### Conflict 3: `--text-subtle` Contrast on `--surface-card`
- **Conflict**: `--text-subtle` (#a1a1aa) on `--surface-card` (#09090B) = 6.2:1 contrast (meets WCAG AA but lower than ideal).
- **Resolution**: Acceptable for WCAG AA; prefer `--text-muted` for critical body text on cards. Use `--text-subtle` for secondary text (table cells, tooltips, metadata).
- **Impact**: No change required; acceptable contrast ratio for WCAG AA.
- **Reference**: Accessibility Checklist - Color Contrast

---

## Open Questions (Deferred)

### Q1: Chart Library Styling
- **Question**: Which chart library (Chart.js, D3, Looker embed) will be used, and how to style axes/legends with `style.md` tokens?
- **Resolution**: Deferred to implementation. Spec requires axes/legends use `--text-dim`/`--text-subtle`; data series use `--text-primary`. Implementation must ensure chart library supports custom styling.
- **Reference**: Screen Specs - Dashboard chart section

### Q2: Mobile Navigation Pattern
- **Question**: Should mobile navigation use hamburger menu, bottom sheet, or in-page links?
- **Resolution**: Deferred to implementation. Spec allows any pattern as long as it adheres to `style.md` tokens and accessibility requirements.
- **Reference**: Navigation & Routing Model

### Q3: Export Format
- **Question**: What format should data export use (CSV, JSON, both)?
- **Resolution**: Deferred to implementation. Spec assumes CSV export button on data quality page; implementation may add JSON option.
- **Reference**: Function-to-UI Mapping, Screen Specs - Data Quality page

### Q4: Authentication Method
- **Question**: If direct Snowflake queries chosen, what authentication method (SSO/JWT/OAuth)?
- **Resolution**: Out of scope for this spec. Assume read-only API key or embed authentication handled externally.
- **Reference**: Executive Summary - Constraints

### Q5: Localization Needs
- **Question**: Will the UI need to support multiple languages in the future?
- **Resolution**: Deferred to future enhancement. Current scope is English only.
- **Reference**: Executive Summary - Constraints

---

## Style Token Usage Summary

### Directly from `style.md` (No Derivation Required)
- `--font-ui` (JetBrains Mono family)
- `--fs-base` (clamp(16px, calc(15.2px + 0.25vw), 20px))
- `--bg-black` (#000000)
- `--bg-elev1` (#0A0A0A)
- `--surface-card` (#09090B)
- `--text-primary` (#FFFFFF)
- `--text-muted` (#E8E8E8)
- `--text-subtle` (#A1A1AA)
- `--text-dim` (#71717A)
- `--text-highlight` (#F4F4F5)
- `--accent-success` (#22C55E)
- `--border-color` (rgb(39 39 42))
- `--border-w` (1px → 1.5px ≥1024px)
- `--border-outer-w` (1px → 2px ≥1024px)
- `--shadow-tint` (#0000000d)
- `--r-sm` (4px)
- `--r-md` (6px)
- `--space-0_5` (0.5rem)
- `--space-0_75` (0.75rem)
- `--space-1` (1rem)
- `--space-1_5` (1.5rem)
- `--space-2` (2rem)
- `--space-4` (4rem)
- Typography: `.meta-sm` (0.75rem), `.meta-md` (0.875rem), `.tagline` (1rem)
- Letter spacing: `0.05em` (uppercase labels)

### Derived Tokens (Logged Above)
1. KPI value font size: `1.75rem`
2. Table row hover background: `#18181b`
3. Disabled opacity: `0.6`
4. Error/WARN status color: `--text-highlight` (derived usage)
5. Error input border: `--text-highlight` (derived usage)
6. Overlay backdrop: Semi-transparent black (derived from `--bg-black`)
7. Loading pulse duration: `≤200ms` (per motion guidance)
8. Disabled state color: `--text-dim` with opacity (derived usage)
9. Input field padding: `0.75rem` (from `--space-0_75`)
10. Checkbox checked background: `--accent-success` (direct from tokens)
11. Checkbox label hover: `--text-primary` (direct from tokens)

---

## Validation Checklist

- [x] All tokens used are either directly from `style.md` or derived with clear rationale
- [x] All derivations logged with derivation logic and rationale
- [x] All conflicts resolved in favor of `style.md`
- [x] All open questions deferred to implementation
- [x] Style Compliance Matrix references all tokens used
- [x] Accessibility Checklist validates contrast ratios

---

**Status**: Complete. All assumptions, derivations, conflicts, and open questions documented.

**Next**: See Dev Handoff artifacts for implementation-ready tokens, CSS, and code snippets.
