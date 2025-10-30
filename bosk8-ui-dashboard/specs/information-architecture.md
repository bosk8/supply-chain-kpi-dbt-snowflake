# Information Architecture and User Flows

**Date:** 2025-01-27  
**Authority:** `style.md` (Single Source of Truth)

## Sitemap

```
/
├── /dashboard (default/home)
│   ├── Hero section: "REAL-TIME SUPPLY CHAIN KPIs"
│   ├── KPI cards: Avg Fulfillment Hours, On-Time Rate, Units
│   ├── Time-series chart (default: last 30 days)
│   ├── Warehouse breakdown table
│   └── Filters: Date range, Warehouse selection
│
├── /warehouse/:id
│   ├── Warehouse header: ID, City, Capacity (from dim_warehouse)
│   ├── Warehouse-specific KPIs (same format as dashboard)
│   ├── Time-series chart (filtered to warehouse)
│   └── Recent orders table (from fct_orders, filtered by warehouse)
│
└── /data-quality
    ├── Source freshness status
    ├── Model test results summary
    ├── Last run timestamp
    └── Link to dbt documentation/exposure
```

**Note**: No global navigation bar required per `style.md` minimal aesthetic. Use in-page links (`.link` style) or breadcrumbs (`.meta-sm` uppercase) for navigation.

## User Flows

### Flow 1: Daily KPI Review (Operations Manager)

**Actor**: Operations Manager  
**Goal**: Review overall fulfillment performance across all warehouses

**Steps**:
1. **Entry**: Navigate to `/dashboard` (default route on app load)
2. **Hero**: View tagline "REAL-TIME SUPPLY CHAIN KPIs" in `.tagline` style
3. **KPI Overview**: Review three primary metrics:
   - Avg Fulfillment Hours (number, e.g., "24.5")
   - On-Time Rate (percentage, e.g., "87%")
   - Units (integer, e.g., "1,234")
4. **Time Trend**: Observe time-series chart showing metrics over last 30 days (default)
5. **Warehouse Breakdown**: Review table sorted by `warehouse_id` showing:
   - Warehouse ID
   - Avg Hours (per warehouse)
   - On-Time Rate (per warehouse)
   - Units (per warehouse)
6. **Filter Interaction** (optional):
   - Click "Filters" link in KPI tile section
   - Adjust date range (date picker or input fields)
   - Select/deselect warehouses (multi-select or checkboxes)
   - KPIs, chart, and table update to reflect filters
7. **Drill-Down** (optional): Click warehouse row → navigate to `/warehouse/:id`

**Success Criteria**: User can identify which warehouses are performing below network average within 30 seconds.

**Edge Cases**:
- **No Data**: All sections show empty state message
- **Loading**: KPI cards show pulse placeholder; chart shows loading indicator
- **Error**: Error message displayed; user can retry or navigate to data quality page

---

### Flow 2: Warehouse Drill-Down (Warehouse Lead)

**Actor**: Warehouse Lead  
**Goal**: ous performance for specific warehouse

**Steps**:
1. **Entry**: Navigate to `/warehouse/:id` (via dashboard table click or direct URL)
2. **Warehouse Context**: View header with:
   - Warehouse ID (e.g., "WH1")
   - City (from `dim_warehouse`, e.g., "Atlanta")
   - Capacity Units (from `dim_warehouse`, e.g., "100,000")
3. **Warehouse KPIs**: Review same three metrics (Avg Hours, On-Time Rate, Units) filtered to selected warehouse
4. **Time Trend**: View time-series chart filtered to warehouse (same date range as dashboard default)
5. **Recent Orders**: Review table of recent orders from `fct_orders`:
   - Order ID
   - Fulfillment Hours
   - On-Time Flag (Yes/No or icon)
   - Quantity
   - Order Timestamp
6. **Navigation**: Click "← Dashboard" link to return to home

**Success Criteria**: User can identify specific order-level issues within warehouse context.

**Edge Cases**:
- **Warehouse Not Found**: Display 404-style message in `--text-subtle`; link back to dashboard
- **No Orders**: Recent orders table shows empty state; KPIs may show "--" if no data
- **Date Filter**: Same date range controls as dashboard; persist in URL or localStorage

---

### Flow 3: Data Quality Check (Data Analyst)

**Actor**: Data Analyst  
**Goal**: Verify data freshness and model test results

**Steps**:
1. **Entry**: Navigate to `/data-quality` (via footer link or direct URL)
2. **Freshness Status**: View cards or table showing:
   - Source name (e.g., "raw.orders")
   - Last updated timestamp
   - Freshness status (OK/WARN/ERROR based on `schema.yml` thresholds)
   - Warnings after 2 hours, errors after 6 hours (per schema.yml)
3. **Model Tests**: Review test results:
   - Model name (e.g., "fct_orders")
   - Test name (e.g., "not_null", "unique")
   - Test status (PASS/FAIL)
   - Last run timestamp
4. **Metadata**: View:
   - Last dbt run timestamp (from CI/CD or manual run)
   - Exposure link (if configured in `exposures.yml`)
   - Link to dbt docs (if available)
5. **Export** (optional): Click "Export Test Results" to download factors or metrics as CSV

**Success Criteria**: User can identify stale data sources or failing tests within 15 seconds.

**Edge Cases**:
- **No Freshness Data**: Show "Freshness checks not configured" message
- **Test Failures**: Highlight failed tests with `--text-highlight` and border ring
- **Stale Data**: Display warning in `--text-highlight`; link to troubleshooting guide

---

### Flow 4: Filter and Explore (All Personas)

**Actor**: Any user  
**Goal**: Explore data with different filters and time ranges

**Steps**:
1. **Open Filters**: Click "Filters" link in KPI tile section on dashboard
2. **Date Range**: Select start and end date (date picker or input fields)
   - Default: Last 30 days
   - Min date: Earliest available data (from `kpi_daily_fulfillment.day`)
   - Max date: Latest available data (from `kpi_daily_fulfillment.day`)
3. **Warehouse Selection**: Multi-select warehouses or toggle "All"
   - Default: All warehouses selected
   - Individual warehouses listed from `dim_warehouse`
4. **Apply Filters**: Click "Apply" button (or auto-update on change)
5. **Results Update**: KPI cards, chart, and table update to reflect filters
6. **URL Persistence**: Filters reflected in URL query params (e.g., `?start=2025-01-01&end=2025-01-31&warehouses=WH1,WH2`)
7. **Reset**: Click "Reset" to return to defaults

**Success Criteria**: Filters persist on page reload; URL shareable with filters applied.

**Edge Cases**:
- **Invalid Date Range**: Start > End → show validation error in `--text-highlight`
- **No Warehouses Selected**: Display message "Select at least one warehouse"
- **Date Range Too Large**: Warn if >365 days (performance consideration)

---

### Flow 5: Empty State / First Run

**Actor**: New user or first-time visitor  
**Goal**: Understand system state when no data exists

**Steps**:
1. **Entry**: Navigate to `/dashboard` before any data is loaded
2. **Empty State Display**: View `.card` sections with:
   - Hero: Tagline still visible
   - KPI Cards: Show "--" or "N/A" in `--text-subtle`
   - Chart: Empty state message "No data available. Verify data pipeline status."
   - Table: Empty state message "No warehouse data found."
3. **Guidance**: Display helpful message:
   - "Run `dbt seed && dbt run` to load initial data."
   - Link to data quality page: "Check data quality status"
4. **Navigation**: User can navigate to `/data-quality` to investigate

**Success Criteria**: User understands why no data is shown and knows next steps.

---

### Flow 6: Error Recovery

**Actor**: Any user  
**Goal**: Peterson errors and recover gracefully

**Steps**:
1. **Error Occurs**: Network failure, API error, or invalid query
2. **Error Display**: Affected section shows:
   - Error message in `--text-highlight` within `.card`
   - Optional tooltip (`.tooltip`) with detailed error for debugging
   - Retry button (`.link` style) to re-fetch data
3. **Partial Errors**: If one section fails but others succeed:
   - Failed section shows error state
   - Successful sections continue to display data
4. **Retry**: Click retry button → re-fetch affected data
5. **Fallback**: If retry fails, link to data quality page for investigation

**Success Criteria**: User understands what failed and can retry or investigate.

---

## Navigation Patterns

### Breadcrumbs (Optional, Minimal)
If breadcrumbs are used, format as:
```
DASHBOARD / WAREHOUSE / WH1
```
- Style: `.meta-sm` uppercase, `--text-muted` (active: `--text-primary`)
- Separator: " / " in `--text-dim`

### In-Page Links
- Use `.link` style for navigation between routes
- Example: "← Dashboard" link on warehouse detail page
- Hover state: underline with `text-underline-offset: 4px`

### Footer Links (Optional)
Minimal footer with:
- "Data Quality" link → `/data-quality`
- "dbt Docs" link (if available)
- Last updated timestamp in `.meta-sm` `--text-dim`

---

## Route Definitions

| Route | Purpose | Data Source | Required Params | Optional Params |
|-------|---------|-------------|----------------|-----------------|
| `/` or `/dashboard` | Home dashboard | `kpi_daily_fulfillment`, `dim_warehouse` | None | `start`, `end`, `warehouses` (query params) |
| `/warehouse/:id` | Warehouse detail | `kpi_daily_fulfillment`, `fct_orders`, `dim_warehouse` | `id` (warehouse_id) | `start`, `end` (query params) |
| `/data-quality` | Data quality status | `schema.yml` freshness, dbt test results | None | None |

**404 Handling**: Unknown routes redirect to `/dashboard` with console warning (or display 404 message in `.card`).

---

**Next**: See Screen-by-Screen Specs for detailed wireframes, layout grids, and component specifications.

