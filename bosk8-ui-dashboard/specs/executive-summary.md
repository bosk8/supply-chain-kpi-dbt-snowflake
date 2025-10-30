# Executive Summary — Bosk8 Supply Chain KPI Dashboard

**Date:** 2025-01-27  
**Project:** Real-Time Supply Chain KPI Dashboard UI System  
**Authority:** `style.md` (Single Source of Truth for all visual/interaction decisions)

## Goals

Deliver a production-ready, accessible UI/UX system for monitoring supply chain KPIs from dbt/Snowflake models, strictly adhering to the Bosk8 Dark Minimal Mono design system. The system provides:

1. **Real-time KPI visibility**: Average fulfillment hours, on-time rate, and shipped units at daily granularity
2. **Warehouse-level drill-down**: Per-warehouse performance breakdowns and trends
3. **Data quality transparency**: Freshness status and model test results
4. **Accessible, keyboard-navigable interface**: WCAG 2.2 AA compliance with full keyboard operation
5. **Minimal, engineered aesthetic**: Dark minimal mono design using JetBrains Mono, subtle borders, precise spacing

## Primary Personas

### 1. Operations Manager
- **Needs**: Daily overview of fulfillment performance across all warehouses, trend identification, quick alerts on degradation
- **Key Flows**: Dashboard home → Review KPIs → Identify warehouse issues → Drill to warehouse detail
- **Technical Level**: Moderate; comfortable with tables and charts

### 2. Warehouse Lead
- **Needs**: Focused view of specific warehouse performance, comparison to network averages, historical trends
- **Key Flows**: Dashboard → Select warehouse filter → View warehouse detail → Review time series trends
- **Technical Level**: Moderate; prefers specific, actionable metrics

### 3. Data Analyst
- **Needs**: Drill-down capability, data export, freshness context, validation of data quality tests
- **Key Flows**: Dashboard → Apply filters → Review data quality page → Export data → Validate metrics
- **Technical Level**: High; comfortable with raw data and technical metadata

## Major User Flows

### Happy Path: Daily KPI Review
1. Navigate to `/dashboard` (default route)
2. View hero section with tagline "REAL-TIME SUPPLY CHAIN KPIs"
3. Review three primary KPI cards: Avg Fulfillment Hours, On-Time Rate, Units
4. Observe time-series chart (default: last 30 days, aggregated by day)
5. Review warehouse breakdown table with sortable columns
6. Apply optional filters (date range, warehouse selection)
7. Click warehouse row to drill to `/warehouse/:id` detail view

### Happy Path: Warehouse Drill-Down
1. From dashboard table, click warehouse row or warehouse filter
2. Navigate to `/warehouse/:id`
3. View warehouse-specific KPIs (aligned with dashboard format)
4. Review warehouse metadata (city, capacity) from `dim_warehouse`
5. View time-series chart filtered to selected warehouse
6. Review recent order performance from `fct_orders` drill-down table
7. Return to dashboard via navigation link

### Happy Path: Data Quality Check
1. Navigate to `/data-quality`
2. View source freshness status (from `schema.yml` freshness checks)
3. Review model test results (not_null, unique constraints)
4. View last run timestamp and success/failure indicators
5. Link to dbt documentation or exposure metadata

### Edge Cases

#### No Data State
- **Scenario**: First run, no data loaded, or date range returns empty results
- **Behavior**: Display `.card` with message in `--text-subtle`: "No data available for selected filters. Verify data pipeline status."
- **Location**: Replace chart/table content with empty state message; KPI cards show "--"

#### Error State
- **Scenario**: API/data connector failure, network error, or invalid query
- **Behavior**: Display error message in `--text-highlight` within `.card`, optional tooltip for details using `.tooltip`
- **Location**: Replace affected section (KPI cards show error state; table shows error row)

#### Loading State
- **Scenario**: Initial page load or filter change triggering data fetch
- **Behavior**: KPI cards show placeholder text in `--text-subtle` (pulse animation ≤200ms); table shows skeleton rows; chart shows loading indicator
- **Duration**: Display until `/api/kpi-daily` or equivalent returns

#### Partial Data State
- **Scenario**: Some warehouses have data, others don't; date range partially populated
- **Behavior**: Show available data; missing warehouses omitted from table; chart renders partial series with gap indicators

## Constraints

### Technical Constraints
- **Data Source**: Read-only access to Snowflake `ANALYTICS.MODEL` schema (via dbt models or Looker Studio export)
- **Refresh Cadence**: Hourly (via GitHub Actions dbt runs); UI shows "last updated" timestamp
- **Real-time Limitation**: Not true real-time; maximum freshness is hourly; surface freshness metadata in UI
- **Authentication**: Out of scope for first pass; assume read-only API key or embed authentication handled externally
- **Data Volume**: Models are aggregated (`kpi_daily_fulfillment`); assume <10 warehouses, <365 days of history for initial implementation

### Design Constraints
- **Single Source of Truth**: `style.md` is authoritative; no new tokens may be invented without derivation and logging
- **Dark Theme Only**: No light theme variants; grayscale palette with functional green (`--accent-success`) only
- **Motion Limits**: Transitions ≤200ms; no parallax or auto-animations; loading pulse respects motion guidance
- **Typography**: JetBrains Mono exclusively; UI labels uppercase with 0.05em letter-spacing
- **Minimal Dependencies**: Prefer vanilla HTML/CSS/JS; avoid heavy frameworks unless required for data visualization

### Functional Constraints
- **Read-Only**: No writebacks, annotations, or target-setting workflows
- **No Multi-Tenancy**: Single organization context; warehouse filtering is data-level, not tenant-level
- **No Localization**: English only; defer i18n to future enhancement

## Assumptions and Open Questions

### Assumptions
1. **Data Connector**: UI assumes either:
   - Direct Snowflake query API (Node/Edge function) with credentials managed externally, OR
   - Looker Studio embed/export (simplest path)
   - Decision deferred to implementation; UI contracts are connector-agnostic

2. **Date Range Default**: Last 30 days when no filter applied; persisted in URL query params or localStorage

3. **Warehouse Filter**: Multi-select dropdown or checkboxes; "All" selected by default

4. **Chart Library**: Implementation-agnostic (Chart.js, D3, or Looker embed); styling must adhere to `style.md` tokens

5. **Routing**: Client-side routing (SPA) or server-side; routing model is framework-agnostic

### Open Questions (Logged for Future Resolution)
1. **Auth Method**: If direct Snowflake queries chosen, what auth mechanism? (SSO/JWT/OAuth) → Out of scope for this spec
2. **Export Format**: CSV, JSON, or both? → Assume CSV export button on data quality page
3. **Mobile Support**: Full feature parity or simplified mobile view? → Assume responsive design with mobile-optimized layouts
4. **Hourly Metrics**: Future enhancement mentioned in README; not included in initial scope
5. **Incremental Models**: Large dataset handling deferred; current scope assumes full refresh viable

## Success Metrics

- ✅ All screens render with correct `style.md` tokens; no visual drift
- ✅ WCAG 2.2 AA contrast ratios validated; keyboard navigation covers all controls
- ✅ All three personas can complete primary flows without friction
- ✅ Loading/error/empty states handled gracefully per spec
- ✅ Dev handoff artifacts enable developer to implement without design ambiguity
- ✅ Style Compliance Matrix and Style Decisions Log fully documented

---

**Next Steps**: See Information Architecture, Screen Specs, Component Library, and Dev Handoff artifacts for detailed implementation guidance.

