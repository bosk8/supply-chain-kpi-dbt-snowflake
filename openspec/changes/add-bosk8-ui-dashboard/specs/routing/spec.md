## ADDED Requirements

### Requirement: Navigation and Routing
The system SHALL define minimal routes for dashboard and drill-down.

#### Scenario: Routes
- **THEN** `/dashboard` shows home KPIs and charts
- **AND** `/warehouse/:id` shows per-warehouse KPIs and recent performance
- **AND** `/data-quality` shows freshness and model test summaries

#### Scenario: Breadcrumbs/labels
- **THEN** labels use uppercase mono with `.meta-sm` and `--text-muted`; active label uses `--text-primary`.

#### Scenario: Empty/first-run states
- **THEN** routes render `.card` with guidance text `--text-subtle` when no data exists.


