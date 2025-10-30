# Interactive Component Library — Detailed Specifications

**Date:** 2025-01-27  
**Authority:** `style.md` (Single Source of Truth)

## Component 1: Card

### Purpose
Base surface container for all content sections. Provides depth and structure.

### Visual Design
- **Background**: `--surface-card` (`#09090B`)
- **Border**: Box-shadow with `--border-outer-w` and `--border-color`:
  - `box-shadow: 0 0 0 var(--border-outer-w) var(--border-color), 0 1px 2px var(--shadow-tint)`
- **Border Radius**: `--r-sm` (`4px`) or `--r-md` (`6px`) as needed
- **Padding**: Varies by use case (see variants)
- **Width**: 100% within container (no max-width on card itself)

### Variants

#### `.card`
Base card with no additional modifiers.

#### `.card.border-b`
Adds bottom border using `--border-w` and `--border-color`.

#### `.card.hero`
Hero section variant with centered content, padding `4rem 2rem`.

#### `.card.table-section`
Table container variant with padding `1rem 1rem 2rem`.

### States
- **Default**: Standard appearance as above
- **Hover**: No visual change (cards are not interactive surfaces)
- **Focus**: Not applicable (card is not focusable)

### Accessibility
- Cards are containers; ensure interactive children are keyboard-accessible
- Use semantic HTML (`<section>`, `<article>`) where appropriate
- Add `aria-label` or `aria-labelledby` if card has distinct purpose

### Example Usage

```html
<section class="card border-b hero">
  <h1 class="tagline">REAL-TIME SUPPLY CHAIN KPIs</h1>
</section>

<section class="card table-section">
  <div class="table-header meta-sm">WAREHOUSE BREAKDOWN</div>
  <!-- table content -->
</section>
```

### Style.md Token References
- `--surface-card`
- `--border-outer-w`
- `--border-color`
- `--border-w`
- `--shadow-tint`
- `--r-sm`
- `--r-md`

---

## Component 2: KPIStat (KPI Stat Card)

### Purpose
Displays a single metric with label and value. Used in KPI tile grid.

### Visual Design
- **Container**: Part of `.grid-tiles` layout within `.card`
- **Label**: `.meta-sm` style (uppercase, `--text-muted`, `0.05em` letter-spacing)
- **Value**: Large number/text in `--text-primary`, responsive font-size
- **Padding**: Inherits from `.tile` (`1.5rem 1rem`)
- **Alignment**: Center-aligned text

### Props (React/Component Model)

```typescript
interface KPIStatProps {
  label: string;              // Required: Metric name (e.g., "AVG FULFILLMENT HRS")
  value: number | string;     // Required: Metric value (e.g., 24.5 or "--")
  hint?: string;              // Optional: Tooltip text for additional context
  loading?: boolean;          // Optional: Show loading state
  error?: string;             // Optional: Error message to display
  ariaLabel?: string;         // Optional: Accessible label override
  format?: 'number' | 'percent' | 'currency' | 'default'; // Optional: Value formatting
}
```

### Variants

#### Default KPIStat
Standard metric display.

#### Loading State
- Value replaced with placeholder text in `--text-subtle`
- Pulse animation (≤200ms) on placeholder
- Label remains visible

#### Error State
- Value replaced with error icon + message in `--text-highlight`
- Optional border ring using `--border-color`
- Error message in tooltip (`.tooltip`) if `hint` provided

#### Empty State
- Value shows "--" or "N/A" in `--text-subtle`
- Label remains visible

### States
- **Default**: Normal display with value and label
- **Hover**: No elevation change (per `style.md`)
- **Focus**: Not applicable (stat is not interactive)
- **Loading**: Pulse animation on placeholder
- **Error**: Error message displayed
- **Empty**: Placeholder value shown

### Formatting Rules

#### Number Format
- Format: `value.toFixed(1)` for decimals, `value.toLocaleString()` for integers
- Example: `24.5`, `1,234`

#### Percent Format
- Format: `(value * 100).toFixed(1) + '%'`
- Example: `87.5%`

#### Currency Format (if needed)
- Format: `value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })`
- Example: `$1,234.56`

#### Default Format
- Display as string or number without formatting

### Accessibility
- Use `aria-live="polite"` on value container for screen reader announcements
- Provide `ariaLabel` if label text is not descriptive enough
- If tooltip used, ensure keyboard accessible (`.tooltip-trigger` pattern)

### Example Usage

```html
<div class="tile">
  <span class="meta-sm">AVG FULFILLMENT HRS</span>
  <div class="kpi-value" aria-live="polite">24.5</div>
</div>
```

```html
<!-- Loading state -->
<div class="tile">
  <span class="meta-sm">AVG FULFILLMENT HRS</span>
  <div class="kpi-value kpi-loading" aria-live="polite">--</div>
</div>
```

### CSS Implementation

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

### Style.md Token References
- `--text-primary`
- `--text-muted`
- `--text-subtle`
- `--text-highlight`
- `--border-color`
- `--border-w`
- `--r-sm`
- `.meta-sm` (typography)

---

## Component 3: Link / Action Button

### Purpose
Interactive link or button for navigation and actions. Used for filters, navigation, and CTAs.

### Visual Design
- **Default**: `.link` style
  - Color: `--text-muted`
  - Text decoration: none
  - Background: transparent
  - Border: none
  - Transition: `all 0.15s`
- **Hover**:
  - Color: `--text-primary`
  - Text decoration: underline
  - `text-underline-offset: 4px`
- **Focus**: `:focus-visible` outline `2px solid var(--border-color)`, offset `2px`

### Props

```typescript
interface LinkProps {
  href?: string;             // Optional: URL for navigation (if button, omit)
  onClick?: () => void;      // Optional: Click handler
  children: ReactNode;        // Required: Link text
  variant?: 'default' | 'button'; // Optional: Style variant
  disabled?: boolean;         // Optional: Disabled state
  ariaLabel?: string;        // Optional: Accessible label
}
```

### Variants

#### Default Link (`.link`)
Standard navigation link.

#### Button Variant (`.link` as button)
Same visual style, but rendered as `<button>` element.

#### Disabled State
- Color: `--text-dim` with `opacity: 0.6`
- Cursor: `not-allowed`
- No hover/focus effects

### States
- **Default**: `--text-muted`, no underline
- **Hover**: `--text-primary`, underline
- **Focus**: Outline ring per `style.md`
- **Active/Pressed**: No visual change (per `style.md` minimal aesthetic)
- **Disabled**: `--text-dim`, reduced opacity, no interaction

### Accessibility
- Use semantic `<a>` for navigation, `<button>` for actions
- Ensure keyboard navigation (Tab, Enter, Space)
- Provide `ariaLabel` if link text is not descriptive
- If disabled, use `aria-disabled="true"` and prevent interaction

### Example Usage

```html
<a href="/dashboard" class="link">← Dashboard</a>

<button class="link" onclick="handleFilter()">Filters</button>

<button class="link" disabled aria-disabled="true">Apply</button>
```

### CSS Implementation

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

### Style.md Token References
- `--text-muted`
- `--text-primary`
- `--text-dim`
- `--border-color`

---

## Component 4: DataTable

### Purpose
Tabular display of warehouse breakdown, recent orders, freshness status, and test results.

### Visual Design
- **Container**: `.table-wrapper` with `overflow-x: auto` for mobile scrolling
- **Table**: `.data-table` with `width: 100%`, `border-collapse: collapse`
- **Header**: `.meta-sm` style (uppercase, `--text-muted`), padding `0.75rem 1rem`
- **Cells**: `--text-subtle`, padding `0.75rem 1rem`
- **Borders**: `--border-w` and `--border-color` on header bottom and cell bottoms
- **Row Hover**: Background `#18181b` (from `style.md`)

### Props

```typescript
interface DataTableProps {
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    format?: (value: any) => string;
  }>;
  data: Array<Record<string, any>>;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  onRowClick?: (row: Record<string, any>) => void;
  ariaLabel?: string;
}
```

### Variants

#### Default Table
Standard data display.

#### Sortable Columns
- Header cells with sort indicator (arrow: `↑`/`↓` in `--text-dim`)
- Active sort: Header color `--text-primary`
- Click handler to sort data

#### Clickable Rows
- Cursor: `pointer`
- Row click triggers `onRowClick` handler
- Focus state: Outline on row (via keyboard navigation)

#### Loading State
- Show skeleton rows (3-5 rows with "--" placeholders in `--text-subtle`)

#### Error State
- Display error row with message in `--text-highlight`
- Optional: Full table replaced with error message in `.card`

#### Empty State
- Display message in `--text-subtle`: "No data available."

### States
- **Default**: Normal display
- **Row Hover**: Background `#18181b`
- **Header Hover** (if sortable): Background `#18181b`, cursor `pointer`
- **Focus**: Row outline per `:focus-visible` if keyboard navigable
- **Loading**: Skeleton rows
- **Error**: Error message displayed

### Accessibility
- Use semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
- Add `aria-label` on table for context
- If sortable, use `aria-sort="ascending|descending|none"` on header
- If clickable rows, ensure keyboard accessible (Enter/Space on row)
- Ensure proper `scope` on `<th>` elements

### Example Usage

```html
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
```

### CSS Implementation

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

### Style.md Token References
- `--text-muted`
- `--text-subtle`
- `--border-w`
- `--border-color`
- `--border-color` (outline)
- `#18181b` (hover background)
- `.meta-sm` (typography)

---

## Component 5: Tooltip

### Purpose
Contextual help text appearing on hover/focus. Used for KPI hints, error details, and metadata.

### Visual Design
- **Trigger**: `.tooltip-trigger` (transparent button/icon)
- **Tooltip**: `.tooltip` positioned above trigger
  - Background: `--surface-card`
  - Border: `--border-w` and `--border-color`
  - Padding: `0.5rem`
  - Font size: `0.625rem` (from `style.md`)
  - Color: `--text-subtle`
  - Max width: `280px`
  - Arrow: Border triangle pointing down (from `style.md`)

### Props

```typescript
interface TooltipProps {
  content: string;            // Required: Tooltip text
  position?: 'top' | 'bottom' | 'left' | 'right'; // Optional: Default 'top'
  trigger?: 'hover' | 'click' | 'focus'; // Optional: Default 'hover' (desktop) / 'click' (mobile)
  ariaLabel?: string;        // Optional: Accessible label for trigger
}
```

### Variants

#### Desktop (≥768px)
- Trigger on hover: Tooltip appears
- Trigger on focus: Tooltip appears (keyboard accessible)

#### Mobile (<768px)
- Trigger on click/tap: Add `.active` class, tooltip appears
- Click outside: Remove `.active`, tooltip hides

### States
- **Hidden**: `opacity: 0`, `visibility: hidden`
- **Visible**: `opacity: 1`, `visibility: visible`
- **Transition**: `0.15s` opacity and visibility

### Accessibility
- Use `aria-describedby` to link trigger to tooltip content
- Ensure keyboard accessible (focus triggers tooltip)
- On mobile, ensure touch target size ≥44x44px
- Tooltip content should be screen reader accessible

### Example Usage

```html
<button class="tooltip-trigger" aria-describedby="kpi-hint-tooltip">
  <span class="copy-icon">?</span>
  <div class="tooltip" id="kpi-hint-tooltip" role="tooltip">
    Average time from order placement to shipment across all warehouses.
  </div>
</button>
```

### CSS Implementation
(Per `style.md`, already documented in existing CSS)

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

/* Arrow */
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

### Style.md Token References
- `--surface-card`
- `--border-w`
- `--border-color`
- `--text-subtle`
- `0.625rem` (font size from `style.md`)

---

## Component 6: Input Field (Derived)

### Purpose
Date range inputs, text inputs for filters. Derived from `style.md` tokens (not explicitly defined; derive patterns).

### Visual Design (Derived)
- **Background**: Transparent or `--surface-card`
- **Border**: `--border-w` and `--border-color`
- **Color**: `--text-primary`
- **Padding**: `var(--space-0_75)` (`0.75rem`)
- **Border Radius**: `--r-sm`
- **Focus**: `:focus-visible` outline `2px solid var(--border-color)`, offset `2px`

### Props

```typescript
interface InputProps {
  type?: 'text' | 'date' | 'email' | 'number';
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  ariaLabel?: string;
}
```

### States
- **Default**: Standard border and text color
- **Focus**: Outline ring per `style.md`
- **Error**: Border color uses `--text-highlight` (derived), error message in `--text-highlight`
- **Disabled**: `--text-dim`, `opacity: 0.6`, cursor `not-allowed`

### Accessibility
- Use semantic `<label>` linked via `for`/`id` or wrap input in label
- Provide `aria-invalid="true"` if error state
- Ensure error message linked via `aria-describedby`

### Example Usage

```html
<label class="meta-sm" for="date-start">START DATE</label>
<input 
  type="date" 
  id="date-start" 
  class="input-field"
  aria-label="Start date for date range filter"
/>
```

### CSS Implementation (Derived)

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

.input-field.error {
  border-color: var(--text-highlight);
}

.input-error {
  color: var(--text-highlight);
  font-size: 0.75rem;
  margin-top: var(--space-0_5);
}
```

### Style.md Token References (Derived)
- `--border-w`
- `--border-color`
- `--text-primary`
- `--text-dim`
- `--text-highlight` (derived for error)
- `--r-sm`
- `--space-0_75`
- `--fs-base`

---

## Component 7: Checkbox (Derived)

### Purpose
Multi-select warehouses in filter panel. Derived from `style.md` tokens.

### Visual Design (Derived)
- **Checkbox**: Square border using `--border-w` and `--border-color`
- **Checked**: Background `--accent-success` or checkmark in `--text-primary`
- **Label**: `.meta-sm` style, `--text-muted`
- **Hover**: Label color `--text-primary`
- **Focus**: Outline ring per `style.md`

### Props

```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  value: string;
  disabled?: boolean;
  ariaLabel?: string;
}
```

### States
- **Default**: Unchecked, border visible
- **Checked**: Checkmark visible, background or checkmark color per design
- **Hover**: Label color changes to `--text-primary`
- **Focus**: Outline ring
- **Disabled**: `--text-dim`, reduced opacity

### Accessibility
- Use semantic `<input type="checkbox">` with `<label>`
- Ensure keyboard accessible (Space to toggle)
- Group related checkboxes in `<fieldset>` with `<legend>`

### Example Usage

```html
<label class="checkbox-label">
  <input type="checkbox" class="checkbox" value="WH1" />
  <span class="meta-sm">WH1 - Atlanta</span>
</label>
```

### CSS Implementation (Derived)

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

### Style.md Token References (Derived)
- `--border-w`
- `--border-color`
- `--accent-success` (checked state)
- `--text-primary` (checkmark/hover)
- `--text-muted` (label)
- `--text-dim` (disabled)
- `--r-sm`
- `.meta-sm` (typography)

---

## Component Summary Table

| Component | Base Tokens | Derived Tokens | States | Accessibility |
|-----------|-------------|----------------|--------|---------------|
| Card | `--surface-card`, `--border-outer-w`, `--border-color`, `--shadow-tint`, `--r-sm|--r-md` | None | Default only | Semantic HTML |
| KPIStat | `--text-primary`, `--text-muted`, `--text-subtle`, `--text-highlight`, `.meta-sm` | Loading pulse | Default, Loading, Error, Empty | `aria-live`, `ariaLabel` |
| Link | `--text-muted`, `--text-primary`, `--text-dim` | None | Default, Hover, Focus, Disabled | Semantic `<a>`/`<button>` |
| DataTable | `--text-muted`, `--text-subtle`, `--border-w`, `--border-color` | `#18181b` (hover) | Default, Hover, Loading, Error, Empty | Semantic `<table>`, `aria-label`, `aria-sort` |
| Tooltip | `--surface-card`, `--border-w`, `--border-color`, `--text-subtle`, `0.625rem` | None | Hidden, Visible | `aria-describedby` |
| Input | `--border-w`, `--border-color`, `--text-primary`, `--text-dim`, `--r-sm`, `--space-0_75` | `--text-highlight` (error) | Default, Focus, Error, Disabled | Semantic `<label>`, `aria-invalid` |
| Checkbox | `--border-w`, `--border-color`, `--accent-success`, `--text-primary`, `--text-muted`, `--r-sm` | None | Default, Checked, Hover, Focus, Disabled | Semantic `<input type="checkbox">` |

---

**Next**: See Function-to-UI Mapping for backend contract specifications.

