# Developer Handoff Artifacts

**Date:** 2025-01-27  
**Authority:** `style.md` (Single Source of Truth)

## Overview

This document provides implementation-ready tokens, CSS, HTML/CSS/React snippets, and acceptance criteria for developer handoff.

---

## Design Tokens (CSS Variables)

### Complete Token Map

Copy this into your root CSS file (`:root` selector):

```css
:root {
  /* Typography */
  --font-ui: JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, DejaVu Sans Mono, Courier New, monospace;
  --fs-base: clamp(16px, calc(15.2px + 0.25vw), 20px);

  /* Backgrounds */
  --bg-black: #000000;
  --bg-elev1: #0A0A0A;
  --surface-card: #09090B;

  /* Text Colors */
  --text-primary: #FFFFFF;
  --text-muted: #E8E8E8;
  --text-subtle: #A1A1AA;
  --text-dim: #71717A;
  --text-highlight: #F4F4F5;

  /* Accent Colors */
  --accent-success: #22C55E;

  /* Borders */
  --border-color: rgb(39 39 42);
  --border-w: 1px;
  --border-outer-w: 1px;

  /* Shadows */
  --shadow-tint: #0000000d;

  /* Border Radius */
  --r-sm: 4px;
  --r-md: 6px;

  /* Spacing */
  --space-0_5: 0.5rem;
  --space-0_75: 0.75rem;
  --space-1: 1rem;
  --space-1_5: 1.5rem;
  --space-2: 2rem;
  --space-4: 4rem;
}

/* Responsive border widths */
@media (min-width: 1024px) {
  :root {
    --border-w: 1.5px;
    --border-outer-w: 2px;
  }
}
```

### Derived Tokens (Implementation)

These are derived from tokens above; log usage in Style Decisions Log:

```css
/* Derived tokens (not in :root, but used in components) */
.kpi-value {
  font-size: 1.75rem; /* Derived from --fs-base */
}

.data-table tbody tr:hover {
  background: #18181b; /* Derived from style.md FAQ hover pattern */
}

.input-field:disabled,
.button:disabled {
  opacity: 0.6; /* Derived for disabled state */
}
```

---

## Global Resets & Base Styles

```css
/* Global Resets */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: var(--fs-base);
}

html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-black);
  font-family: var(--font-ui);
  color: var(--text-primary);
}

/* Main Layout */
main.bosk8 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-4) var(--space-1) var(--space-1);
  padding-top: 10rem; /* hero spacing */
  background-color: var(--bg-elev1);
}

.container {
  width: 100%;
  max-width: min(1100px, 90vw);
  position: relative;
}

/* Focus Styles */
:focus-visible {
  outline: 2px solid var(--border-color);
  outline-offset: 2px;
}
```

---

## Component CSS Snippets

### Card Component

```css
.card {
  background-color: var(--surface-card);
  box-shadow: 0 0 0 var(--border-outer-w) var(--border-color), 0 1px 2px var(--shadow-tint);
}

.card.border-b {
  border-bottom: var(--border-w) solid var(--border-color);
}

.card.border-r {
  border-right: var(--border-w) solid var(--border-color);
}

.card.hero {
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card.table-section {
  padding: 1rem 1rem 2rem;
}
```

### Typography

```css
.tagline, .meta, .label, .nav {
  font-family: var(--font-ui);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.tagline {
  font-size: 1rem;
  text-align: center;
}

.meta-sm {
  font-size: 0.75rem;
}

.meta-md {
  font-size: 0.875rem;
}
```

### Link / Action Button

```css
.link {
  color: var(--text-muted);
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.15s;
}

.link:hover {
  color: var(--text-primary);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.link:disabled,
.link[aria-disabled="true"] {
  color: var(--text-dim);
  opacity: 0.6;
  cursor: not-allowed;
}

.link:disabled:hover,
.link[aria-disabled="true"]:hover {
  text-decoration: none;
  color: var(--text-dim);
}
```

### KPI Stat Component

```css
.kpi-value {
  font-size: 1.75rem;
  margin-top: 0.5rem;
  color: var(--text-primary);
}

.kpi-loading {
  color: var(--text-subtle);
  animation: pulse 200ms ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.kpi-error {
  color: var(--text-highlight);
  border: var(--border-w) solid var(--border-color);
  padding: var(--space-0_5);
  border-radius: var(--r-sm);
}
```

### Grid Tiles

```css
.grid-tiles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 768px) {
  .grid-tiles {
    grid-template-columns: repeat(4, 1fr);
  }
}

.tile {
  padding: 1.5rem 1rem;
  text-align: center;
}
```

### Data Table

```css
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead th {
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: var(--border-w) solid var(--border-color);
  color: var(--text-muted);
}

.data-table tbody td {
  padding: 0.75rem 1rem;
  color: var(--text-subtle);
  border-bottom: var(--border-w) solid var(--border-color);
}

.data-table tbody tr:hover {
  background: #18181b;
}

.data-table tbody tr:focus-visible {
  outline: 2px solid var(--border-color);
  outline-offset: -2px;
}
```

### Tooltip

```css
.tooltip-trigger {
  position: relative;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.5rem);
  transform: translate(-50%);
  background-color: var(--surface-card);
  border: var(--border-w) solid var(--border-color);
  padding: 0.5rem;
  font-size: 0.625rem;
  font-family: var(--font-ui);
  color: var(--text-subtle);
  max-width: 280px;
  width: max-content;
  line-height: 1.5;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s, visibility 0.15s;
  pointer-events: none;
  z-index: 10;
}

.tooltip:before {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--border-color);
}

.tooltip:after {
  content: "";
  position: absolute;
  top: calc(100% - 1px);
  left: 50%;
  transform: translate(-50%);
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 3px solid rgb(9 9 11);
}

@media (min-width: 768px) {
  .tooltip-trigger:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
}

@media (max-width: 767px) {
  .tooltip-trigger.active .tooltip {
    opacity: 1;
    visibility: visible;
  }
}
```

### Input Field (Derived)

```css
.input-field {
  background: transparent;
  border: var(--border-w) solid var(--border-color);
  color: var(--text-primary);
  padding: var(--space-0_75);
  border-radius: var(--r-sm);
  font-family: var(--font-ui);
  font-size: var(--fs-base);
}

.input-field:focus-visible {
  outline: 2px solid var(--border-color);
  outline-offset: 2px;
}

.input-field:disabled {
  color: var(--text-dim);
  opacity: 0.6;
  cursor: not-allowed;
}

.input-field.error,
.input-field[aria-invalid="true"] {
  border-color: var(--text-highlight);
}

.input-error {
  color: var(--text-highlight);
  font-size: 0.75rem;
  margin-top: var(--space-0_5);
}
```

### Checkbox (Derived)

```css
.checkbox {
  width: 1rem;
  height: 1rem;
  border: var(--border-w) solid var(--border-color);
  border-radius: var(--r-sm);
  background: transparent;
  cursor: pointer;
}

.checkbox:checked {
  background: var(--accent-success);
  border-color: var(--accent-success);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-0_75);
  cursor: pointer;
}

.checkbox-label:hover .meta-sm {
  color: var(--text-primary);
}

.checkbox:focus-visible {
  outline: 2px solid var(--border-color);
  outline-offset: 2px;
}
```

---

## HTML Snippets

### Dashboard Hero Section

```html
<main class="bosk8">
  <div class="container">
    <section class="card border-b hero">
      <h1 class="tagline">REAL-TIME SUPPLY CHAIN KPIs</h1>
    </section>
  </div>
</main>
```

### KPI Cards Section

```html
<section class="card grid-tiles border-b">
  <div class="tile border-r">
    <span class="meta-sm">AVG FULFILLMENT HRS</span>
    <div class="kpi-value" aria-live="polite">24.5</div>
  </div>
  <div class="tile">
    <span class="meta-sm">ON-TIME RATE</span>
    <div class="kpi-value" aria-live="polite">87.5%</div>
  </div>
  <div class="tile border-r">
    <span class="meta-sm">UNITS</span>
    <div class="kpi-value" aria-live="polite">1,234</div>
  </div>
  <div class="tile">
    <button class="link" aria-label="Open filters">Filters</button>
  </div>
</section>
```

### Warehouse Breakdown Table

```html
<section class="card table-section">
  <div class="table-header meta-sm">WAREHOUSE BREAKDOWN</div>
  <div class="table-wrapper">
    <table class="data-table" role="table" aria-label="Warehouse KPI breakdown">
      <thead>
        <tr role="row">
          <th scope="col" class="meta-sm">WAREHOUSE</th>
          <th scope="col" class="meta-sm">AVG HRS</th>
          <th scope="col" class="meta-sm">ON-TIME RATE</th>
          <th scope="col" class="meta-sm">UNITS</th>
        </tr>
      </thead>
      <tbody>
        <tr role="row" tabindex="0" onclick="handleRowClick(row)">
          <td>WH1</td>
          <td>24.5</td>
          <td>87.5%</td>
          <td>1,234</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
```

### Loading State

```html
<div class="tile">
  <span class="meta-sm">AVG FULFILLMENT HRS</span>
  <div class="kpi-value kpi-loading" aria-live="polite">--</div>
</div>
```

### Error State

```html
<div class="tile">
  <span class="meta-sm">AVG FULFILLMENT HRS</span>
  <div class="kpi-value kpi-error" aria-live="assertive">
    Error loading data
  </div>
</div>
```

### Empty State

```html
<section class="card">
  <p style="color: var(--text-subtle); padding: var(--space-2);">
    No data available for selected filters. Verify data pipeline status.
  </p>
  <a href="/data-quality" class="link">Check data quality status</a>
</section>
```

---

## React Component Examples

### KPIStat Component

```tsx
interface KPIStatProps {
  label: string;
  value: number | string;
  loading?: boolean;
  error?: string;
  format?: 'number' | 'percent' | 'default';
  ariaLabel?: string;
}

function KPIStat({ label, value, loading, error, format = 'default', ariaLabel }: KPIStatProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'number':
        return Number.isInteger(val) 
          ? val.toLocaleString() 
          : val.toFixed(1);
      case 'percent':
        return (val * 100).toFixed(1) + '%';
      default:
        return String(val);
    }
  };

  return (
    <div className="tile">
      <span className="meta-sm">{label}</span>
      {error ? (
        <div className="kpi-value kpi-error" aria-live="assertive" aria-label={ariaLabel}>
          {error}
        </div>
      ) : loading ? (
        <div className="kpi-value kpi-loading" aria-live="polite" aria-label={ariaLabel}>
          --
        </div>
      ) : (
        <div className="kpi-value" aria-live="polite" aria-label={ariaLabel}>
          {formatValue(value)}
        </div>
      )}
    </div>
  );
}
```

### DataTable Component

```tsx
interface DataTableProps {
  columns: Array<{ key: string; label: string; sortable?: boolean }>;
  data: Array<Record<string, any>>;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  onRowClick?: (row: Record<string, any>) => void;
  ariaLabel?: string;
}

function DataTable({ columns, data, loading, error, emptyMessage, onRowClick, ariaLabel }: DataTableProps) {
  return (
    <div className="table-wrapper">
      <table className="data-table" role="table" aria-label={ariaLabel}>
        <thead>
          <tr role="row">
            {columns.map(col => (
              <th key={col.key} scope="col" className="meta-sm">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan={columns.length} style={{ color: 'var(--text-highlight)' }}>
                {error}
              </td>
            </tr>
          ) : loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col.key}>--</td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ color: 'var(--text-subtle)' }}>
                {emptyMessage || 'No data available.'}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                role="row"
                tabIndex={onRowClick ? 0 : undefined}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
              >
                {columns.map(col => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Spacing / Redlines

### Standard Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0_5` | 0.5rem (8px) | Tooltip padding, small gaps |
| `--space-0_75` | 0.75rem (12px) | Input padding, checkbox label gap |
| `--space-1` | 1rem (16px) | Standard padding, cell padding |
| `--space-1_5` | 1.5rem (24px) | Tile vertical padding |
| `--space-2` | 2rem (32px) | Card section padding |
| `--space-4` | 4rem (64px) | Main wrapper padding |

### Component-Specific Spacing

- **Hero card**: Padding `4rem 2rem` (`--space-4` / `--space-2`)
- **KPI tile**: Padding `1.5rem 1rem` (`--space-1_5` / `--space-1`)
- **Table cell**: Padding `0.75rem 1rem` (`--space-0_75` / `--space-1`)
- **Table section**: Padding `1rem 1rem 2rem` (`--space-1` / `--space-1` / `--space-2`)
- **Input field**: Padding `0.75rem` (`--space-0_75`)

---

## Acceptance Checklist

### Style Compliance
- [ ] All CSS uses tokens from `style.md`; no hardcoded colors or values
- [ ] All derived tokens logged in Style Decisions Log
- [ ] No new tokens invented without derivation
- [ ] All tokens referenced by exact `style.md` token names/paths

### Components
- [ ] All components match visual specs from Component Library
- [ ] All states (default/hover/focus/active/disabled/error/loading) implemented
- [ ] All components have accessibility attributes (`aria-label`, `role`, etc.)
- [ ] All components keyboard accessible (Tab → Enter/Space)

### Screens
- [ ] Dashboard home (`/dashboard`) matches screen spec
- [ ] Warehouse detail (`/warehouse/:id`) matches screen spec
- [ ] Data quality (`/data-quality`) matches screen spec
- [ ] All screens responsive (mobile/tablet/desktop breakpoints)
- [ ] All empty/error/loading states implemented

### Accessibility
- [ ] WCAG 2.2 AA contrast ratios validated (use WebAIM Contrast Checker)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (`:focus-visible` outline)
- [ ] Screen reader tested (NVDA/JAWS/VoiceOver)
- [ ] All images have `alt` text or `aria-hidden="true"`
- [ ] All tables have `aria-label` and proper structure
- [ ] Loading states announced (`aria-live="polite"`)
- [ ] Error states announced (`aria-live="assertive"`)

### Motion
- [ ] All transitions ≤200ms
- [ ] No parallax or auto-animations
- [ ] Loading pulse animation ≤200ms

### Data Contracts
- [ ] API requests match Function-to-UI Mapping contracts
- [ ] Input validation implemented (date range, warehouse selection)
- [ ] Error handling implemented (network errors, validation errors)
- [ ] Empty states displayed when no data

### Navigation
- [ ] Routes match Navigation & Routing Model
- [ ] Query parameters handled (date range, warehouse filters)
- [ ] 404 handling implemented
- [ ] Navigation links keyboard accessible

### Browser Testing
- [ ] Tested in Chrome, Firefox, Safari, Edge
- [ ] Tested on mobile (iOS Safari, Chrome Android)
- [ ] Tested with browser zoom (200%)
- [ ] Tested with keyboard only (no mouse)

---

## Implementation Notes

### Framework-Agnostic
- CSS and HTML snippets work with any framework (React, Vue, Vanilla JS)
- React components provided as examples; adapt to your framework
- Routing implementation is framework-agnostic

### Data Connector
- API contracts are connector-agnostic (direct Snowflake or Looker Studio export)
- Implementation must match Function-to-UI Mapping contracts

### Chart Library
- Chart styling must use `style.md` tokens:
  - Axes/legends: `--text-dim` / `--text-subtle`
  - Data series: `--text-primary`
- Implementation must ensure chart library supports custom styling

### Testing
- Use automated accessibility tools (axe DevTools, WAVE)
- Validate HTML with W3C HTML Validator
- Test color contrast with WebAIM Contrast Checker
- Test with screen readers (NVDA, JAWS, VoiceOver)

---

## References

- **Style Reference**: `style.md` (single source of truth)
- **Component Specs**: `components-library-detailed.md`
- **Screen Specs**: `screen-specs.md`
- **Function Mapping**: `function-to-ui-mapping.md`
- **Navigation**: `navigation-routing.md`
- **Accessibility**: `accessibility-checklist.md`
- **Style Compliance**: `style-compliance-matrix.md`
- **Style Decisions**: `style-decisions-log.md`

---

**Status**: Ready for developer handoff. All tokens, CSS, snippets, and acceptance criteria provided.

