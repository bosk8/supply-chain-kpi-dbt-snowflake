# Navigation & Routing Model

**Date:** 2025-01-27  
**Authority:** `style.md` (Single Source of Truth)

## Route Definitions

### Route Table

| Route | Purpose | Component | Data Source | Query Params | Default State |
|-------|---------|-----------|-------------|--------------|---------------|
| `/` | Redirect to dashboard | Redirect | None | None | Redirect to `/dashboard` |
| `/dashboard` | Dashboard home | Dashboard | `kpi_daily_fulfillment`, `dim_warehouse` | `start`, `end`, `warehouses` | Last 30 days, all warehouses |
| `/warehouse/:id` | Warehouse detail | WarehouseDetail | `kpi_daily_fulfillment`, `fct_orders`, `dim_warehouse` | `start`, `end` | Last 30 days, filtered to warehouse |
| `/data-quality` | Data quality status | DataQuality | Freshness, test results | None | No filters |

### Route Structure

```
/ (root)
├── /dashboard (default/home)
│   ├── Query params: ?start=YYYY-MM-DD&end=YYYY-MM-DD&warehouses=WH1,WH2
│   └── Default: Last 30 days, all warehouses
│
├── /warehouse/:id
│   ├── Required param: :id (warehouse_id)
│   ├── Query params: ?start=YYYY-MM-DD&end=YYYY-MM-DD
│   └── Default: Last 30 days, filtered to warehouse
│
└── /data-quality
    └── No query params or filters
```

---

## Navigation Patterns

### Global Navigation

**Minimal Navigation**: Per `style.md` minimal aesthetic, no global navigation bar. Use in-page links and breadcrumbs (optional).

#### In-Page Links (`.link` style)
- **Dashboard → Warehouse Detail**: "← Dashboard" link in warehouse header
- **Dashboard → Data Quality**: Optional footer link "Data Quality" (`.meta-sm`, `--text-muted`)
- **Warehouse Detail → Dashboard**: "← Dashboard" link in warehouse header
- **Data Quality → Dashboard**: "← Dashboard" link (optional, or footer link)

#### Breadcrumbs (Optional)
If breadcrumbs are used, format as:
```
DASHBOARD / WAREHOUSE / WH1
```

**Styling**:
- Container: `.meta-sm` uppercase, `--text-muted`
- Separator: " / " in `--text-dim`
- Active item: `--text-primary`
- Inactive items: `--text-muted`

**Example**:
```html
<nav aria-label="Breadcrumb" class="breadcrumb">
  <a href="/dashboard" class="link">DASHBOARD</a>
  <span class="breadcrumb-separator" aria-hidden="true"> / </span>
  <span class="breadcrumb-active">WAREHOUSE / WH1</span>
</nav>
```

**CSS Implementation**:
```css
.breadcrumb {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: var(--space-0_5);
}

.breadcrumb-separator {
  color: var(--text-dim);
}

.breadcrumb-active {
  color: var(--text-primary);
}
```

---

## Route-Specific Navigation

### Dashboard (`/dashboard`)

#### Entry Points
- Default route (`/`) redirects to `/dashboard`
- Direct URL: `/dashboard`
- From warehouse detail: Click "← Dashboard" link
- From data quality: Click "← Dashboard" link (optional footer)

#### Internal Navigation
- **KPI Cards**: Not interactive (display only)
- **Filter Link**: Click "Filters" link → Open filter panel (overlay or expandable)
- **Warehouse Table Rows**: Click row → Navigate to `/warehouse/:id`
- **Chart Interaction**: Chart may support drill-down (implementation-dependent)

#### Query Parameter Handling
- **Read on Load**: Parse `start`, `end`, `warehouses` from URL query params
- **Update on Filter Change**: Update URL query params when filters change
- **Shareable URLs**: Filters preserved in URL for sharing
- **Default Values**: If no query params, use defaults (last 30 days, all warehouses)

**Example URLs**:
- `/dashboard` (default)
- `/dashboard?start=2025-01-01&end=2025-01-31` (date range)
- `/dashboard?start=2025-01-01&end=2025-01-31&warehouses=WH1,WH2` (date range + warehouses)

**Query Parameter Parsing**:
```typescript
interface DashboardParams {
  start?: string;        // ISO date string (YYYY-MM-DD)
  end?: string;          // ISO date string (YYYY-MM-DD)
  warehouses?: string;   // Comma-separated warehouse IDs (e.g., "WH1,WH2")
}

// Default values
const defaultParams: DashboardParams = {
  start: getDefaultStartDate(), // 30 days ago
  end: getDefaultEndDate(),      // today
  warehouses: undefined,         // all warehouses
};
```

---

### Warehouse Detail (`/warehouse/:id`)

#### Entry Points
- From dashboard: Click warehouse row in table → Navigate to `/warehouse/:id`
- Direct URL: `/warehouse/WH1` (requires valid `warehouse_id`)
- URL with filters: `/warehouse/WH1?start=2025-01-01&end=2025-01-31`

#### Internal Navigation
- **Back Link**: Click "← Dashboard" link → Navigate to `/dashboard` (preserve query params if desired)
- **Chart Interaction**: Chart filtered to warehouse (no drill-down needed)
- **Orders Table**: Sortable by `order_ts` or `fulfillment_hours`

#### Parameter Handling
- **Required Param**: `:id` (warehouse_id) must be valid warehouse identifier
- **Invalid Warehouse**: Show 404 message "Warehouse not found." with link back to dashboard
- **Query Params**: Same date range handling as dashboard (`start`, `end`)

**Example URLs**:
- `/warehouse/WH1` (default date range)
- `/warehouse/WH1?start=2025-01-01&end=2025-01-31` (custom date range)

**Parameter Validation**:
```typescript
interface WarehouseParams {
  id: string;            // Required: warehouse_id
  start?: string;        // ISO date string (YYYY-MM-DD)
  end?: string;          // ISO date string (YYYY-MM-DD)
}

// Validation
if (!isValidWarehouseId(params.id)) {
  // Show 404 message
  return <NotFound message="Warehouse not found." />;
}
```

---

### Data Quality (`/data-quality`)

#### Entry Points
- Direct URL: `/data-quality`
- From dashboard: Optional footer link "Data Quality" (`.meta-sm`, `--text-muted`)
- From warehouse detail: Optional footer link "Data Quality"

#### Internal Navigation
- **No Filters**: Data quality page has no filters or query params
- **Export Link**: Click "Export Results" button → Download CSV/JSON (implementation-dependent)
- **dbt Docs Link**: Click "dbt Docs" link → Open external link (if configured in `exposures.yml`)

---

## Empty and First-Run States

### Empty State Handling

#### Dashboard Empty State
- **Scenario**: No data available for selected filters
- **Display**: Message in `.card` with `--text-subtle`: "No data available for selected filters. Verify data pipeline status."
- **Actions**: 
  - Link to data quality page: "Check data quality status" (`.link` style)
  - Reset filters button (optional)

#### Warehouse Detail Empty State
- **Scenario**: Warehouse found but no orders in date range
- **Display**: 
  - Warehouse header: Display warehouse metadata (ID, city, capacity)
  - KPI cards: Show "--" in `--text-subtle`
  - Chart: Show empty state message
  - Orders table: Show message "No orders found for this warehouse." in `--text-subtle`
- **Actions**: Link back to dashboard or adjust date range

#### Data Quality Empty State
- **Scenario**: Freshness checks not configured or tests not run
- **Display**: Message in `.card` with `--text-subtle`: "Freshness checks not configured." or "No test results available."
- **Actions**: Link to dbt documentation or setup guide

---

## 404 Handling

### Unknown Routes
- **Scenario**: User navigates to unknown route (e.g., `/unknown`, `/warehouse/INVALID`)
- **Display**: Message in `.card` with `--text-subtle`: "Page not found."
- **Actions**: Link back to dashboard (`.link` style)

**Implementation**:
```typescript
// Catch-all route handler
<Route path="*">
  <NotFound message="Page not found." />
</Route>

// Component
function NotFound({ message }: { message: string }) {
  return (
    <main class="bosk8">
      <div class="container">
        <section class="card hero">
          <h1 class="tagline">{message}</h1>
          <a href="/dashboard" class="link">← Dashboard</a>
        </section>
      </div>
    </main>
  );
}
```

---

## URL Persistence and Shareability

### Query Parameter Persistence
- **Filters**: Dashboard and warehouse detail preserve filters in URL query params
- **Shareable URLs**: Users can share URLs with filters applied
- **Browser History**: Back/forward buttons work correctly with query params
- **Default Handling**: If no query params, use default values (last 30 days, all warehouses)

### localStorage (Optional)
- **Filter Preferences**: Optional localStorage persistence for user's preferred date range or warehouse selection
- **Note**: Per `style.md` minimal aesthetic, prefer URL-based state over localStorage

---

## Navigation Accessibility

### Keyboard Navigation
- **Tab Order**: Follows visual layout:
  1. Navigation links (breadcrumbs, back links)
  2. Filter controls (if visible)
  3. KPI cards (not interactive, skip)
  4. Chart (if interactive)
  5. Table (row by row)
  6. Footer links
- **Skip Links**: Optional "Skip to main content" link (hidden until focused)

### Focus Management
- **Route Changes**: Focus moves to main content area on route change
- **Filter Panel**: Focus trapped within filter panel when open (modal)
- **Table Rows**: Focusable rows can be activated with Enter or Space

### ARIA Labels
- **Navigation Links**: Use `aria-label` if link text is not descriptive (e.g., "← Dashboard" is descriptive)
- **Breadcrumbs**: Use `aria-label="Breadcrumb"` on `<nav>` element
- **Active Route**: Use `aria-current="page"` on active navigation item (if applicable)

**Example**:
```html
<nav aria-label="Breadcrumb">
  <a href="/dashboard" aria-current="page">DASHBOARD</a>
  <span aria-hidden="true"> / </span>
  <span>WAREHOUSE</span>
</nav>
```

---

## Route Guards (Optional)

### Data Loading States
- **Before Route Load**: Show loading indicator while fetching data
- **After Route Load**: Display content or show empty/error state

### Authentication (Out of Scope)
- **Note**: Authentication is out of scope for this spec. If required in future:
  - Redirect unauthenticated users to login page
  - Store auth state in context or localStorage
  - Protect routes with authentication guard

---

## Implementation Notes

### Framework-Agnostic Routing
- **React Router**: Use `react-router-dom` with `BrowserRouter`, `Route`, `Link`, `useParams`, `useSearchParams`
- **Vue Router**: Use `vue-router` with `RouterView`, `router-link`, `route.params`, `route.query`
- **Vanilla JS**: Use `window.location.pathname` and `window.location.search` for routing
- **Note**: Routing implementation is framework-agnostic; this spec defines route structure and behavior

### URL Structure Recommendations
- **Clean URLs**: Use `/dashboard`, `/warehouse/WH1` instead of `/dashboard.php` or query-based routes
- **Query Params**: Use query params for filters (`?start=...&end=...&warehouses=...`)
- **Hash Routing**: Avoid hash-based routing (`#dashboard`) unless necessary for static hosting

---

**Next**: See Accessibility Checklist for WCAG 2.2 AA compliance requirements.

