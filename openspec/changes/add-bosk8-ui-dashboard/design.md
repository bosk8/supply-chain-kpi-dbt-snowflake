## Context
The repo provides dbt models in Snowflake with guidance for Looker Studio dashboards. We add a Bosk8 UI spec and handoff artifacts that can be rendered as a static site or embedded in an app. The UI consumes read-only data from either:
1) Looker Studio export/embeds (simplest) or
2) Direct Snowflake queries via a thin API (Node/Edge) or a BI connector.

## Goals / Non-Goals
- Goals: UI shell, dashboard screens, components, routing, a11y, style compliance, handoff artifacts.
- Non-Goals: writebacks, multi-tenant auth, complex theming beyond `style.md`.

## Decisions
- Styling: Use `style.md` CSS variables as the canonical token map. No new tokens.
- Layout: Use `.bosk8` main wrapper, `.container`, `.card`, `.grid-tiles`, `.tooltip`, `.faq-*` per `style.md`.
- Focus/keyboard: Use `:focus-visible` outline defined in `style.md`.
- Data: Prefer `kpi_daily_fulfillment` as primary source; link to `fct_orders`, `dim_warehouse` for drill-down.

## Data Contracts
- Inputs: date range, warehouse filter, granularity (day default), metric selection.
- Outputs (primary): `avg_fulfillment_hours`, `on_time_rate`, `units` by `day`, optionally by `warehouse_id`.
- Error/empty states: show card-level and page-level messages, surfaced as text with `--text-subtle`.

## Risks / Trade-offs
- Embeds vs direct queries: Embeds simpler but limited interactivity. Direct queries need auth and cost controls.
- Real-time vs hourly freshness: default to hourly; surface freshness in UI meta.

## Migration Plan
1) Ship specs and handoff artifacts.
2) Prototype static dashboard using provided HTML/CSS snippets.
3) Integrate data connector of choice (embed or API).

## Open Questions
- Auth method for direct queries (if chosen): SSO/JWT? Out of scope for this change.
- Localization needs? Not specified; defer.


