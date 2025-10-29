# Real-Time Supply Chain KPI Dashboard

**Stack:** dbt • Snowflake • Looker Studio • GitHub Actions

## Overview

This project provides a complete analytics stack for supply chain KPIs, exposing daily and hourly metrics for fulfillment speed, on-time rate, and volume. The system uses dbt to model data in Snowflake, visualizes in Looker Studio, and schedules hourly runs via GitHub Actions.

## Project Structure

```
supplychain-dbt/
├── models/
│   ├── staging/          # Staging layer models (cleansing and type casting)
│   ├── marts/            # Dimensional and fact tables
│   ├── metrics/          # Aggregated KPI metrics
│   ├── schema.yml        # Source definitions and model tests
│   └── exposures.yml     # Dashboard exposure metadata
├── seeds/                # Initial CSV data files
├── dbt_project.yml       # dbt project configuration
├── profiles.example.yml  # Example dbt profiles template
├── snowflake_bootstrap.sql  # Snowflake infrastructure setup script
└── .github/workflows/    # CI/CD workflows
```

## Prerequisites

- Snowflake account with administrative privileges
- Python 3.11+ with pip
- GitHub repository with Actions enabled
- Google account for Looker Studio (or Looker instance access)

## Setup

### 1. Snowflake Bootstrap

Run the bootstrap script as a Snowflake administrator to create the required infrastructure:

```sql
-- Execute snowflake_bootstrap.sql in Snowflake UI or CLI
```

This creates:
- Role: `ANALYTICS_ROLE`
- Warehouse: `WH_TINY` (XSMALL, auto-suspend enabled)
- Database: `ANALYTICS`
- Schemas: `ANALYTICS.RAW` (for source data) and `ANALYTICS.MODEL` (for transformed models)

### 2. Local Development Setup

1. Create a Python virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dbt dependencies:
```bash
pip install dbt-core dbt-snowflake
```

3. Configure dbt profiles:
   - Copy `profiles.example.yml` to `~/.dbt/profiles.yml`
   - Update with your Snowflake credentials:
     - `account`: Your Snowflake account identifier (e.g., xy12345.us-east-1)
     - `user`: Your Snowflake username
     - `password`: Your Snowflake password
     - Verify `role`, `database`, `warehouse`, and `schema` match the bootstrap setup

### 3. Load Seed Data

```bash
dbt seed
```

This loads the CSV files from `seeds/` into Snowflake `ANALYTICS.RAW` schema.

### 4. Build Models

```bash
dbt deps   # Install dbt packages (if any)
dbt run    # Build all models
dbt test   # Run data quality tests
```

### 5. GitHub Actions Setup

Configure the following secrets in your GitHub repository (Settings → Secrets and variables → Actions):

- `SF_ACCOUNT`: Snowflake account identifier
- `SF_USER`: Snowflake username for CI/CD
- `SF_PASSWORD`: Snowflake password for CI/CD

The workflow runs hourly and can be manually triggered via `workflow_dispatch`.

## Data Models

### Staging Layer
- `stg_orders`: Cleansed order data with type casting and timestamp conversion
- `stg_warehouses`: Warehouse dimension source
- `stg_inventory_movements`: Inventory movement transactions

### Marts Layer
- `dim_warehouse`: Deduplicated warehouse dimension table
- `fct_orders`: Fact table with fulfillment hours and on-time flags

### Metrics Layer
- `kpi_daily_fulfillment`: Daily aggregated KPIs by warehouse
  - `avg_fulfillment_hours`: Average time from order to shipment
  - `on_time_rate`: Percentage of orders shipped on time
  - `units`: Total units shipped

## Dashboard Setup (Looker Studio)

1. **Connect to Snowflake:**
   - Open Looker Studio
   - Create new data source
   - Select Snowflake connector
   - Enter credentials: account, user, password
   - Connect to database `ANALYTICS`, schema `MODEL`

2. **Create Dashboard:**
   - Use table `kpi_daily_fulfillment` as data source
   - Create KPI cards for:
     - Average fulfillment hours
     - On-time rate
     - Total units
   - Add time-series charts grouped by `day`
   - Add warehouse breakdown table grouped by `warehouse_id`

3. **Enable Sharing:**
   - Enable link sharing for portfolio demonstrations
   - Update `models/exposures.yml` with the dashboard URL

## Data Quality

The project includes:
- **Model tests**: Not null and unique constraints on key columns
- **Source freshness**: Monitors `orders` table with warnings after 2 hours, errors after 6 hours

Run tests:
```bash
dbt test                    # Run model tests
dbt source freshness        # Check source data freshness
```

## Local Development Workflow

1. Activate virtual environment: `source .venv/bin/activate`
2. Make changes to models, seeds, or configurations
3. Validate: `dbt compile` (check SQL syntax)
4. Test locally: `dbt seed && dbt run && dbt test`
5. Commit and push (GitHub Actions will run on schedule)

## Cost Control

- Warehouse `WH_TINY` is configured with `AUTO_SUSPEND=60` seconds
- Warehouse auto-resumes when queries are submitted
- Monitor Snowflake usage dashboard to track costs

## Troubleshooting

### Authentication Errors
- Verify `SF_ACCOUNT` format (no domain suffix needed, e.g., `xy12345.us-east-1`)
- Check credentials in profiles.yml or GitHub Secrets

### Dashboard Empty
- Verify Looker Studio dataset credentials
- Confirm connection to schema `MODEL` (not `RAW`)
- Check that `dbt run` completed successfully

### Freshness Warnings
- Adjust freshness windows in `models/schema.yml` if data updates less frequently
- Review CI/CD schedule to ensure hourly runs

### Model Compilation Errors
- Run `dbt compile` to see compiled SQL
- Check source references in `schema.yml` match actual Snowflake tables
- Verify all `ref()` and `source()` functions point to existing models/sources

## Success Criteria

✅ `dbt seed`, `dbt run`, `dbt test` succeed locally  
✅ Dashboard reads from Snowflake and displays KPIs  
✅ Hourly GitHub Actions workflow runs successfully  
✅ Data quality tests pass  
✅ Source freshness checks execute without errors  

## Future Enhancements

- Migrate from seeds to proper ETL pipelines
- Add incremental models for large datasets
- Implement dbt snapshots for dimension history
- Support multiple environments (dev/staging/prod)
- Add hourly KPI metrics in addition to daily

## License

[Add your license here]

## Contact

[Add contact information or links]
