# Screen-by-Screen Specifications

**Date:** 2025-01-27  
**Authority:** `style.md` (Single Source of Truth)

## Screen 1: Dashboard Home (`/dashboard`)

### Purpose
Primary landing page showing aggregate KPIs, time-series trends, and warehouse breakdown. Entry point for all users.

### Wireframe (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│ main.bosk8 (--bg-elev1, padding-top: 10rem)                │
│                                                             │
│   ┌───────────────────────────────────────────────────┐   │
│   │ .container (max-width: min(1100px, 90vw))        │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card.border-b.hero                         │ │   │
│   │ │ padding: 4rem 2rem                          │ │   │
│   │ │                                             │ │   │
│   │ │   REAL-TIME SUPPLY CHAIN KPIs              │ │   │
│   │ │   (.tagline: --text-muted, uppercase)       │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card.grid-tiles.border-b                   │ │   │
│   │ │ ┌──────┐┌──────┐┌──────┐┌──────┐          │ │   │
│   │ │ │ KPI  ││ KPI  ││ KPI  ││FILTER│          │ │   │
│   │ │ │ Tile ││ Tile ││ Tile ││Link  │          │ │   │
│   │ │ │.border-r│    ││.border-r│    │          │ │   │
│   │ │ └──────┘└──────┘└──────┘└──────┘          │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card (time-series chart section)            │ │   │
│   │ │ padding: 2rem                                │ │   │
│   │ │                                             │ │   │
│   │ │   [Time-series chart: avg_fulfillment_hours]│ │   │
│   │ │   [Time-series chart: on_time_rate]         │ │   │
│   │ │   [Time-series chart: units]                │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card.table-section                         │ │   │
│   │ │ ┌───────────────────────────────────────┐  │ │   │
│   │ │ │ .table-header (.meta-sm)              │  │ │   │
│   │ │ │ WAREHOUSE BREAKDOWN                   │  │ │   │
│   │ │ └───────────────────────────────────────┘  │ │   │
│   │ │ ┌───────────────────────────────────────┐  │ │   │
│   │ │ │ .data-table                           │  │ │   │
│   │ │ │ [Table: warehouse_id, avg_hours, ...] │  │ │   │
│   │ │ └───────────────────────────────────────┘  │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Layout Grid

- **Container**: `max-width: min(1100px, 90vw)`, centered
- **Cards**: Full width within container, stacked vertically
- **Grid Tiles**: 2 columns on mobile (`<768px`), 4 columns on desktop (`≥768px`)
- **Spacing**: Cards separated by borders (`.border-b`); internal padding per card type
- **Responsive Breakpoints**:
  - Mobile: `<768px` (2-column grid, reduced padding)
  - Tablet: `768px - 1023px` (4-column grid, standard padding)
  - Desktop: `≥1024px` (4-column grid, elevated border widths)

### Components Used

1. **Hero Section**:
   - `.card.border-b.hero`
   - `.tagline` (h1)
   - Purpose: Brand/context header

2. **KPI Cards Section**:
   - `.card.grid-tiles.border-b`
   - 3x `KPIStat` components (see Component Library)
   - 1x Filter link (`.link` button)
   - Purpose: Primary metrics at-a-glance

3. **Time-Series Chart Section**:
   - `.card` with padding `var(--space-2)`
   - Chart container (implementation-agnostic; Chart.js/D3/Looker embed)
   - Axes styled with `--text-dim`/`--text-subtle`
   - Data series styled with `--text-primary`
   - Purpose: Trend visualization over time

4. **Warehouse Breakdown Table**:
   - `.card.table-section`
   - `.table-header` with `.meta-sm`
   - `.data-table` component (see Component Library)
   - Purpose: Detailed warehouse-level metrics

### States

#### Default State
- All KPIs display numeric values or "--" if loading
- Chart renders with data from last 30 days (default filter)
- Table shows all warehouses sorted by `warehouse_id`
- Filters collapsed (link visible, panel hidden)

#### Loading State
- KPI cards: Show pulse animation on placeholder text (`--text-subtle`)
- Chart: Show loading spinner or skeleton (styled with `--text-dim`)
- Table: Show skeleton rows (3-5 rows with "--" placeholders)
- Animation duration: ≤200ms pulse (per motion guidance)

#### Error State
- KPI cards: Display error icon + message in `--text-highlight`
- Chart: Display error message in `.card` with `--text-highlight`
- Table: Display error row with message
- All sections show retry button (`.link` style)

#### Empty State
- KPI cards: Show "--" or "N/A" in `--text-subtle`
- Chart: Display message "No data available for selected filters. Verify data pipeline status." in `--text-subtle`
- Table: Display message "No warehouse data found." in `--text-subtle`
- Optional: Link to data quality page

#### Hover State
- Table rows: Background `#18181b` (from `style.md` table hover)
- Filter link: Underline with `text-underline-offset: 4px`, color `--text-primary`
- KPI cards: No elevation change (per `style.md`)

#### Focus State
- All interactive elements: `:focus-visible` outline `2px solid var(--border-color)`, offset `2px`
- Table cells (if sortable): Focus ring on header cells
- Filter controls: Focus ring on inputs/buttons

#### Active/Selected State
- Filter panel: Expanded when active; uses `.card` container
- Selected warehouse (if multi-select): Visual indicator (border or background `#18181b`)
- Sorted table column: Indicator arrow + `--text-primary` header color

### Responsive Rules

#### Mobile (`<768px`)
- Grid tiles: 2 columns (stack KPI cards 2x2)
- Container padding: `var(--space-1)` (sides)
- Chart: Full width, scrollable if needed
- Table: Horizontal scroll enabled (`.table-wrapper` overflow-x)
- Filter panel: Full-width overlay or bottom sheet style

#### Tablet (`768px - 1023px`)
- Grid tiles: 4 columns
- Standard padding
- Chart: Full width
- Table: Full width, no scroll needed

#### Desktop (`≥1024px`)
- Grid tiles: 4 columns
- Elevated border widths: `--border-w: 1.5px`, `--border-outer-w: 2px`
- Chart: Full width with more horizontal space
- Table: Full width with comfortable column spacing

---

## Screen 2: Warehouse Detail (`/warehouse/:id`)

### Purpose
Drill-down view for specific warehouse showing KPIs, trends, and recent order-level data.

### Wireframe (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│ main.bosk8                                                   │
│                                                             │
│   ┌───────────────────────────────────────────────────┐   │
│   │ .container                                        │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card.border-b                              │ │   │
│   │ │ padding: 2rem                               │ │   │
│   │ │                                             │ │   │
│   │ │   ← Dashboard (.link)                       │ │   │
│   │ │                                             │ │   │
│   │ │   Warehouse: WH1                            │ │   │
│   │ │   City: Atlanta                             │ │   │
│   │ │   Capacity: 100,000 units                   │ │   │
│   │ │   (.meta-sm: --text-muted)                  │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card.grid-tiles.border-b                   │ │   │
│   │ │ [Same 3 KPI cards as dashboard, filtered]   │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card (time-series chart, filtered)         │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card.table-section                         │ │   │
│   │ │ .table-header: RECENT ORDERS                │ │   │
│   │ │ .data-table: [order_id, fulfillment_hours,  │ │   │
│   │ │              on_time_flag, qty, order_ts]   │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Layout Grid
- Same container and card structure as dashboard
- Warehouse header section replaces hero section
- KPI cards and chart use same components but filtered to `warehouse_id`
- Recent orders table shows drill-down from `fct_orders`

### Components Used
1. **Navigation Link**: `.link` style "← Dashboard"
2. **Warehouse Header**: `.card.border-b` with warehouse metadata (ID, city, capacity)
3. **KPI Cards**: Same `KPIStat` components, filtered data
4. **Time-Series Chart**: Same chart component, filtered to warehouse
5. **Recent Orders Table**: `.data-table` with columns: order_id, fulfillment_hours, on_time_flag, qty, order_ts

### States
- **Default**: Warehouse data loaded and displayed
- **Loading**: Skeleton/placeholder for KPIs, chart, table
- **Error**: Error message if warehouse not found or data fetch fails
- **Empty**: No orders found for warehouse (table empty, KPIs may show "--")
- **404**: Warehouse ID not in `dim_warehouse` → display "Warehouse not found" message

### Responsive Rules
- Same as dashboard (mobile/tablet/desktop breakpoints)

---

## Screen 3: Data Quality (`/data-quality`)

### Purpose
Show data freshness status, model test results, and pipeline metadata.

### Wireframe (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│ main.bosk8                                                   │
│                                                             │
│   ┌───────────────────────────────────────────────────┐   │
│   │ .container                                        │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card.border-b.hero                         │ │   │
│   │ │   DATA QUALITY STATUS                       │ │   │
│   │ │   (.tagline)                                │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card                                        │ │   │
│   │ │ .table-header: SOURCE FRESHNESS             │ │   │
│   │ │ .data-table:                                │ │   │
│   │ │   [source_name, last_updated, status]       │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card                                        │ │   │
│   │ │ .table-header: MODEL TESTS                  │ │   │
│   │ │ .data-table:                                │ │   │
│   │ │   [model_name, test_name, status, timestamp]│ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   │                                                   │   │
│   │ ┌─────────────────────────────────────────────┐ │   │
│   │ │ .card                                        │ │   │
│   │ │   Last dbt run: [timestamp]                 │ │   │
│   │ │   Export Results (.link button)             │ │   │
│   │ │   dbt Docs (.link)                          │ │   │
│   │ └─────────────────────────────────────────────┘ │   │
│   └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Layout Grid
- Same container structure
- Multiple `.card` sections stacked vertically
- Tables use same `.data-table` component

### Components Used
1. **Hero Section**: `.card.border-b.hero` with "DATA QUALITY STATUS" tagline
2. **Freshness Table**: `.data-table` showing source freshness from `schema.yml`
3. **Test Results Table**: `.data-table` showing model test results
4. **Metadata Section**: `.card` with timestamps and action links
5. **Status Indicators**: Visual status (OK/WARN/ERROR) using `--accent-success` for OK, `--text-highlight` for errors

### States
- **Default**: Freshness and test data loaded
- **Loading**: Placeholder tables
- **Error**: Error fetching freshness/test data
- **Warnings**: Stale data sources highlighted in `--text-highlight`
- **Failures**: Failed tests highlighted with border ring and `--text-highlight`

### Responsive Rules
- Same breakpoints as dashboard
- Tables scroll horizontally on mobile if needed

---

## Screen 4: Filters Panel (Modal/Overlay)

### Purpose
Overlay or expandable panel for date range and warehouse selection filters.

### Wireframe (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│ [Overlay: semi-transparent backdrop or side panel]          │
│                                                             │
│   ┌───────────────────────────────────────────────────┐   │
│   │ .card (filter panel)                              │   │
│   │ padding: 2rem                                     │   │
│   │                                                   │   │
│   │   FILTERS (.meta-sm)                              │   │
│   │                                                   │   │
│   │   Date Range:                                     │   │
│   │   [Start: _____] [End: _____]                     │   │
│   │   (.meta-sm labels, input fields)                 │   │
│   │                                                   │   │
│   │   Warehouses:                                     │   │
│   │   ☑ All                                           │   │
│   │   ☐ WH1 - Atlanta                                 │   │
│   │   ☐ WH2 - [City]                                  │   │
│   │   [Checkboxes styled per style.md]                │   │
│   │                                                   │   │
│   │   [Apply] [Reset] (.link buttons)                 │   │
│   │                                                   │   │
│   │   [Close X]                                       │   │
│   └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Layout Grid
- Overlay: Full viewport or side panel (implementation choice)
- Panel: `.card` with padding `var(--space-2)`
- Form fields: Stacked vertically with `.meta-sm` labels
- Buttons: Inline or stacked, depending on screen size

### Components Used
1. **Input Fields**: Date inputs or text inputs (styled with `--border-color`, `--text-primary`)
2. **Checkboxes**: Multi-select for warehouses (styled per `style.md` if pattern exists; otherwise derive from tokens)
3. **Buttons**: `.link` style for Apply/Reset/Close actions

### States
- **Closed**: Hidden or collapsed
- **Open**: Visible overlay/panel
- **Dirty**: Filters changed but not applied → visual indicator (optional)
- **Applied**: Filters applied → panel can close or remain open
- **Error**: Validation error (e.g., start > end) → message in `--text-highlight`

### Responsive Rules
- Mobile: Full-screen overlay or bottom sheet
- Desktop: Side panel or modal centered overlay

---

## Universal States (All Screens)

### Focus Navigation
- Tab order: Hero/header → KPI cards → Chart (if interactive) → Table (row by row) → Footer links
- Skip links: Optional "Skip to main content" link (hidden until focused)

### Loading Indicators
- Page-level: Skeleton screens for all sections
- Section-level: Loading state per component (KPI pulse, chart spinner, table skeleton)
- Button-level: Loading spinner on action buttons (if applicable)

### Error Handling
- Network errors: Retry button with error message
- Validation errors: Inline error messages in `--text-highlight`
- 404 errors: "Page not found" message with navigation link

### Empty States
- Consistent message format: "No [resource] available. [Actionable guidance]." in `--text-subtle`
- Optional illustrations/icons: Use minimal monospace characters or geometric shapes (per `style.md` minimal aesthetic)

---

**Next**: See Component Library for detailed component specifications with props, variants, and states.

