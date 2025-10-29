# Real-Time Supply Chain KPI Dashboard — Project Scope  
**Stack:** dbt • Snowflake • Looker (Looker Studio) • GitHub Actions

## 0) Purpose
Expose daily and hourly KPIs for fulfillment speed, on-time rate, and volume. Use **dbt** to model data in **Snowflake**, visualize in **Looker/Looker Studio**, and schedule hourly runs via **GitHub Actions**.

## 1) Success Criteria
- `dbt seed/run/test` succeed locally and in CI.
- Dashboard reads Snowflake tables and refreshes.
- Hourly workflow succeeds with secrets managed in GitHub.

## 2) Scope and Non-Goals
- Scope: seeds → staging → marts → metrics → dashboard, plus tests and exposure.
- Non-Goals: complex CDC ingestion, near-real-time streaming beyond hourly.

## 3) Prereqs
- Snowflake account with role capable of creating DB/Schema.
- GitHub repo with Actions enabled.
- Google account for Looker Studio, or Looker instance access.

## 4) Repository Layout
````

supplychain-dbt/
├─ models/
│  ├─ staging/
│  │  ├─ stg_orders.sql
│  │  ├─ stg_warehouses.sql
│  │  └─ stg_inventory_movements.sql
│  ├─ marts/
│  │  ├─ dim_warehouse.sql
│  │  └─ fct_orders.sql
│  ├─ metrics/
│  │  └─ kpi_daily_fulfillment.sql
│  ├─ schema.yml
│  └─ exposures.yml
├─ seeds/
│  ├─ orders.csv
│  ├─ warehouses.csv
│  └─ inventory_movements.csv
├─ dbt_project.yml
├─ profiles.example.yml
└─ .github/workflows/dbt-hourly.yml

````

## 5) Snowflake Bootstrap (run as admin)
```sql
CREATE ROLE IF NOT EXISTS ANALYTICS_ROLE;
CREATE WAREHOUSE IF NOT EXISTS WH_TINY WITH WAREHOUSE_SIZE = XSMALL AUTO_SUSPEND=60 AUTO_RESUME=TRUE;
CREATE DATABASE IF NOT EXISTS ANALYTICS;
CREATE SCHEMA IF NOT EXISTS ANALYTICS.RAW;
CREATE SCHEMA IF NOT EXISTS ANALYTICS.MODEL;

GRANT USAGE ON WAREHOUSE WH_TINY TO ROLE ANALYTICS_ROLE;
GRANT USAGE ON DATABASE ANALYTICS TO ROLE ANALYTICS_ROLE;
GRANT USAGE ON SCHEMA ANALYTICS.RAW TO ROLE ANALYTICS_ROLE;
GRANT USAGE ON SCHEMA ANALYTICS.MODEL TO ROLE ANALYTICS_ROLE;
GRANT CREATE TABLE, CREATE VIEW, CREATE STAGE ON SCHEMA ANALYTICS.MODEL TO ROLE ANALYTICS_ROLE;
-- Optional service user:
-- CREATE USER DBT_SVC PASSWORD='***' DEFAULT_ROLE=ANALYTICS_ROLE MUST_CHANGE_PASSWORD=TRUE;
-- GRANT ROLE ANALYTICS_ROLE TO USER DBT_SVC;
````

## 6) Initialize dbt

```bash
python -m venv .venv && source .venv/bin/activate
pip install dbt-core dbt-snowflake
dbt init supplychain-dbt
```

`~/.dbt/profiles.yml` (local dev)

```yaml
snowflake_portfolio:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: <account>           # e.g., xy12345.us-east-1
      user: <user>
      password: <password>
      role: ANALYTICS_ROLE
      database: ANALYTICS
      warehouse: WH_TINY
      schema: MODEL
```

`dbt_project.yml` minimal

```yaml
name: supplychain_dbt
profile: snowflake_portfolio
version: 1.0.0
config-version: 2
model-paths: ["models"]
seed-paths: ["seeds"]
```

## 7) Seeds

Create CSVs:

**seeds/orders.csv**

```
order_id,order_ts,ship_ts,warehouse_id,sku,qty,status
1001,2025-01-01T10:05:00,2025-01-02T11:15:00,WH1,S1,3,shipped_on_time
...
```

**seeds/warehouses.csv**

```
warehouse_id,city,capacity_units
WH1,Atlanta,100000
...
```

**seeds/inventory_movements.csv**

```
warehouse_id,ts,sku,qty_change
WH1,2025-01-01T12:00:00,S1,50
...
```

Load:

```bash
dbt seed
```

## 8) Models

### Staging

`models/staging/stg_orders.sql`

```sql
SELECT
  order_id::varchar,
  TO_TIMESTAMP(order_ts) AS order_ts,
  TO_TIMESTAMP(ship_ts)  AS ship_ts,
  warehouse_id::varchar,
  sku::varchar,
  qty::int,
  status::varchar
FROM {{ source('raw','orders') }}
```

`models/staging/stg_warehouses.sql`

```sql
SELECT warehouse_id::varchar, city::varchar, capacity_units::int
FROM {{ source('raw','warehouses') }}
```

`models/staging/stg_inventory_movements.sql`

```sql
SELECT warehouse_id::varchar, TO_TIMESTAMP(ts) AS ts, sku::varchar, qty_change::int
FROM {{ source('raw','inventory_movements') }}
```

### Marts

`models/marts/dim_warehouse.sql`

```sql
SELECT warehouse_id, city, capacity_units
FROM {{ ref('stg_warehouses') }}
QUALIFY ROW_NUMBER() OVER (PARTITION BY warehouse_id ORDER BY warehouse_id)=1
```

`models/marts/fct_orders.sql`

```sql
SELECT
  o.order_id,
  o.warehouse_id,
  DATEDIFF('hour', o.order_ts, o.ship_ts) AS fulfillment_hours,
  CASE WHEN status='shipped_on_time' THEN 1 ELSE 0 END AS on_time_flag,
  o.qty,
  o.order_ts
FROM {{ ref('stg_orders') }} o
```

### Metrics

`models/metrics/kpi_daily_fulfillment.sql`

```sql
SELECT
  CAST(DATE_TRUNC('day', order_ts) AS DATE) AS day,
  warehouse_id,
  AVG(fulfillment_hours) AS avg_fulfillment_hours,
  AVG(on_time_flag)      AS on_time_rate,
  SUM(qty)               AS units
FROM {{ ref('fct_orders') }}
GROUP BY 1,2
```

### Tests and Sources (`models/schema.yml`)

```yaml
version: 2
sources:
  - name: raw
    database: ANALYTICS
    schema: RAW
    tables:
      - name: orders
        freshness: { warn_after: {count: 2, period: hour}, error_after: {count: 6, period: hour} }
      - name: warehouses
      - name: inventory_movements

models:
  - name: fct_orders
    tests:
      - not_null:
          column_name: order_id
      - unique:
          column_name: order_id
```

### Exposure (`models/exposures.yml`)

```yaml
version: 2
exposures:
  - name: supply_chain_kpis
    type: dashboard
    maturity: low
    url: https://lookerstudio.google.com/reporting/your-public-link
    depends_on:
      - ref('kpi_daily_fulfillment')
    owner:
      name: Portfolio Owner
      email: you@example.com
```

## 9) Run Locally

```bash
dbt deps
dbt seed
dbt run
dbt test
```

## 10) Build the Dashboard (Looker or Looker Studio)

* **Connector:** Snowflake → set account, user, password, DB `ANALYTICS`, schema `MODEL`.
* **Charts:**

  * KPI cards: avg fulfillment hours, on-time rate, units.
  * Time-series by `day`.
  * Table by `warehouse_id`.
* **Share:** enable link sharing for portfolio demos.

## 11) CI via GitHub Actions

Create `.github/workflows/dbt-hourly.yml`:

```yaml
name: dbt-hourly
on:
  schedule:
    - cron: "0 * * * *"   # hourly UTC
  workflow_dispatch: {}
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }
      - run: python -m pip install dbt-core dbt-snowflake
      - name: Configure profiles.yml
        run: |
          mkdir -p ~/.dbt
          cat > ~/.dbt/profiles.yml <<'YML'
          snowflake_portfolio:
            target: prod
            outputs:
              prod:
                type: snowflake
                account: ${{ secrets.SF_ACCOUNT }}
                user:     ${{ secrets.SF_USER }}
                password: ${{ secrets.SF_PASSWORD }}
                role:     ANALYTICS_ROLE
                database: ANALYTICS
                warehouse: WH_TINY
                schema: MODEL
          YML
      - run: dbt deps
      - run: dbt seed --profiles-dir ~/.dbt --project-dir .
      - run: dbt run  --profiles-dir ~/.dbt --project-dir .
      - run: dbt test --profiles-dir ~/.dbt --project-dir .
```

## 12) QA

* Reconcile Looker metrics with direct Snowflake queries.
* Confirm warehouse autosuspend to control cost.
* CI succeeds; failures surface in Actions logs.

## 13) Deliverables

* dbt project, Snowflake objects, dashboard URL, CI workflow, README.
* Commit history ≥6 meaningful commits.

## 14) Troubleshooting

* Authentication errors: verify `SF_ACCOUNT` format without domain suffix.
* Dashboard empty: check dataset credentials and schema `MODEL`.
* Freshness warnings: adjust `freshness` windows or CI cadence.

