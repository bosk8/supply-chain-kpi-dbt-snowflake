## ADDED Requirements

### Requirement: KPI Dashboard Screens
The system SHALL provide a read-only KPI dashboard mapped to dbt models with Bosk8 styling from `style.md`.

#### Scenario: Dashboard home
- **WHEN** user navigates to `/dashboard`
- **THEN** show hero `.card` with `.tagline` using `--text-muted` and uppercase
- **AND** show 3 KPI cards: avg fulfillment hours, on-time rate, units
- **AND** cards use `.card` with border ring and typography per `.meta-sm|.meta-md`

#### Scenario: Time series chart by day
- **WHEN** a date range is selected (default last 30 days)
- **THEN** show time-series (implementation-agnostic) grouped by `day` from `kpi_daily_fulfillment`
- **AND** axes/legends use `--text-dim`/`--text-subtle` while data labels use `--text-primary`

#### Scenario: Warehouse breakdown table
- **WHEN** data is available
- **THEN** render a table with columns: `warehouse_id`, `avg_fulfillment_hours`, `on_time_rate`, `units`
- **AND** table rows use subtle borders `--border-w`/`--border-color` and hover background `#18181b`

#### Scenario: Filters
- **WHEN** user adjusts warehouse or date filters
- **THEN** KPIs and charts update consistently; filter controls use `.link`/`.copy-btn` styles where applicable

#### Scenario: Empty/error state
- **WHEN** no data or error occurs
- **THEN** display message in `--text-subtle` within a `.card`, with optional tooltip for details using `.tooltip`

### Requirement: Function-to-UI Mapping
The system SHALL map backend models to UI elements with inputs/outputs and validation.

#### Scenario: Data contracts
- **WHEN** fetching `kpi_daily_fulfillment`
- **THEN** inputs: `date_start`, `date_end`, `warehouse_id?`
- **AND** outputs: `day`, `warehouse_id`, `avg_fulfillment_hours:number`, `on_time_rate:number(0..1)`, `units:int`
- **AND** validation: numeric fields present and finite; rate within [0,1]

#### Scenario: Freshness meta
- **WHEN** rendering dashboard meta
- **THEN** show last `dbt source freshness` result in `.meta-sm` using `--text-dim`

### Requirement: Style Compliance Matrix (excerpt)
Each screen/component SHALL list exact tokens used from `style.md`.

#### Scenario: KPI card tokens
- **THEN** background: `--surface-card`; text: `--text-primary|--text-muted`; border: `--border-color`; radii: `--r-sm|--r-md`; spacing: `--space-1|--space-1_5|--space-2`; shadow: `--shadow-tint`.


