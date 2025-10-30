# Function-to-UI Mapping

**Date:** 2025-01-27  
**Authority:** `style.md` (Single Source of Truth)

## Overview

This document maps backend dbt models and data sources to UI components, defining data contracts, validations, error states, and feedback patterns.

## Data Source: `kpi_daily_fulfillment`

### dbt Model Definition
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

### UI Mapping

#### Primary Use: Dashboard Home (`/dashboard`)

**Input Contract (API Request)**
```typescript
interface KPIDailyRequest {
  start?: string;        // ISO date string (YYYY-MM-DD), optional (default: 30 days ago)
  end?: string;          // ISO date string (YYYY-MM-DD), optional (default: today)
  warehouse_ids?: string[]; // Array of warehouse_id strings, optional (default: all)
}
```

**Output Contract (API Response)**
```typescript
interface KPIDailyResponse {
  data: Array<{
    day: string;                    // ISO date string (YYYY-MM-DD)
    warehouse_id: string;           // Warehouse identifier (e.g., "WH1")
    avg_fulfillment_hours: number;  // Float (e.g., 24.5)
    on_time_rate: number;           // Float between 0 and 1 (e.g., 0.875)
    units: number;                  // Integer (e.g., 1234)
  }>;
  meta: {
    total_rows: number;
    date_range: { start: string; end: string };
    warehouses_included: string[];
    last_updated: string;          // ISO timestamp
  };
}
```

**Validation Rules**

1. **Input Validation**
   - `start` and `end` must be valid ISO date strings
   - `start` must be ≤ `end`
   - Date range must not exceed 365 days (warn if >365 days)
   - `warehouse_ids` must be non-empty if provided (array length > 0)

2. **Output Validation**
   - `avg_fulfillment_hours` must be ≥ 0 and finite (not `NaN` or `Infinity`)
   - `on_time_rate` must be between 0 and 1 (inclusive)
   - `units` must be ≥ 0 and integer
   - `day` must be valid ISO date string
   - `warehouse_id` must be non-empty string

3. **Error Handling**
   - Invalid date range → Show error message in `--text-highlight`: "Invalid date range. Start date must be before end date."
   - Date range >365 days → Show warning in `--text-subtle`: "Large date range may affect performance. Consider narrowing range."
   - No data for filters → Show empty state message
   - API error → Show error message with retry button

**UI Components**

1. **KPI Cards** (Aggregate across all data)
   - Avg Fulfillment Hours: `AVG(data.avg_fulfillment_hours)`
   - On-Time Rate: `AVG(data.on_time_rate) * 100 + '%'`
   - Units: `SUM(data.units).toLocaleString()`

2. **Time-Series Chart** (Grouped by `day`)
   - X-axis: `day` (sorted chronologically)
   - Y-axis: `avg_fulfillment_hours`, `on_time_rate`, `units` (three series or separate charts)
   - Styling: Axes `--text-dim`/`--text-subtle`, data series `--text-primary`

3. **Warehouse Breakdown Table** (Grouped by `warehouse_id`)
   - Columns: `warehouse_id`, `avg_fulfillment_hours`, `on_time_rate * 100 + '%'`, `units`
   - Sortable by any column (default: `warehouse_id`)
   - Clickable rows → Navigate to `/warehouse/:id`

**States**

- **Loading**: Placeholder text in KPI cards (`--text-subtle` with pulse), skeleton chart, skeleton table rows
- **Success**: Display data as above
- **Empty**: Show message "No data available for selected filters. Verify data pipeline status." in `--text-subtle`
- **Error**: Show error message in `--text-highlight` with retry button (`.link` style)

---

## Data Source: `fct_orders`

### dbt Model Definition
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

### UI Mapping

#### Primary Use: Warehouse Detail (`/warehouse/:id`)

**Input Contract (API Request)**
```typescript
interface OrdersRequest {
  warehouse_id: string;   // Required: Warehouse identifier
  start?: string;          // ISO date string (YYYY-MM-DD), optional (default: 30 days ago)
  end?: string;            // ISO date string (YYYY-MM-DD), optional (default: today)
  limit?: number;          // Integer, optional (default: 100, max: 1000)
  order_by?: 'order_ts' | 'fulfillment_hours'; // Optional (default: 'order_ts DESC')
}
```

**Output Contract (API Response)**
```typescript
interface OrdersResponse {
  data: Array<{
    order_id: string;              // Order identifier (e.g., "1001")
    warehouse_id: string;           // Warehouse identifier (e.g., "WH1")
    fulfillment_hours: number;    // Integer (e.g., 25)
    on_time_flag: number;          // 0 or 1 (boolean as number)
    qty: number;                   // Integer (e.g., 3)
    order_ts: string;             // ISO timestamp (e.g., "2025-01-01T10:05:00Z")
  }>;
  meta: {
    total_rows: number;
    warehouse_id: string;
    date_range: { start: string; end: string };
    last_updated: string;          // ISO timestamp
  };
}
```

**Validation Rules**

1. **Input Validation**
   - `warehouse_id` must be non-empty string
   - `start` and `end` must be valid ISO date strings
   - `limit` must be between 1 and 1000
   - `order_by` must be one of allowed values

2. **Output Validation**
   - `fulfillment_hours` must be ≥ 0 and integer
   - `on_time_flag` must be 0 or 1
   - `qty` must be ≥ 0 and integer
   - `order_ts` must be valid ISO timestamp
   - `order_id` must be non-empty string

3. **Error Handling**
   - Warehouse not found → Show 404 message: "Warehouse not found." with link back to dashboard
   - No orders → Show empty state message in table
   - API error → Show error message with retry button

**UI Components**

1. **Recent Orders Table** (`/warehouse/:id`)
   - Columns: `order_id`, `fulfillment_hours`, `on_time_flag` (display as "Yes"/"No" or icon), `qty`, `order_ts` (formatted as date/time)
   - Sortable by `order_ts` (default: DESC) or `fulfillment_hours`
   - Display format:
     - `fulfillment_hours`: Integer with "h" suffix (e.g., "25h")
     - `on_time_flag`: "Yes" (`--accent-success`) or "No" (`--text-highlight`)
     - `order_ts`: Formatted as "MMM DD, YYYY HH:mm" (e.g., "Jan 01, 2025 10:05")

**States**

- **Loading**: Skeleton table rows
- **Success**: Display orders table
- **Empty**: Show message "No orders found for this warehouse." in `--text-subtle`
- **Error**: Show error message in `--text-highlight` with retry button

---

## Data Source: `dim_warehouse`

### dbt Model Definition
```sql
SELECT warehouse_id, city, capacity_units
FROM {{ ref('stg_warehouses') }}
QUALIFY ROW_NUMBER() OVER (PARTITION BY warehouse_id ORDER BY warehouse_id)=1
```

### UI Mapping

#### Primary Use: Warehouse Detail Header (`/warehouse/:id`)

**Input Contract (API Request)**
```typescript
interface WarehouseRequest {
  warehouse_id: string;   // Required: Warehouse identifier
}
```

**Output Contract (API Response)**
```typescript
interface WarehouseResponse {
  data: {
    warehouse_id: string;    // Warehouse identifier (e.g., "WH1")
    city: string;            // City name (e.g., "Atlanta")
    capacity_units: number;  // Integer (e.g., 100000)
  } | null;                  // null if warehouse not found
  meta: {
    last_updated: string;    // ISO timestamp
  };
}
```

**Validation Rules**

1. **Input Validation**
   - `warehouse_id` must be non-empty string

2. **Output Validation**
   - `city` must be non-empty string
   - `capacity_units` must be ≥ 0 and integer

3. **Error Handling**
   - Warehouse not found → Return `null` in data, show 404 message

**UI Components**

1. **Warehouse Header** (`/warehouse/:id`)
   - Display: Warehouse ID (`.meta-sm`, `--text-muted`)
   - Display: City (`.meta-sm`, `--text-muted`)
   - Display: Capacity Units (`.meta-sm`, `--text-muted`): Formatted as `capacity_units.toLocaleString() + " units"`

**States**

- **Loading**: Placeholder text in `--text-subtle`
- **Success**: Display warehouse metadata
- **404**: Show message "Warehouse not found." with link back to dashboard

#### Secondary Use: Warehouse Filter Dropdown (`/dashboard`)

**Input Contract (API Request)**
```typescript
interface WarehousesListRequest {
  // No parameters (returns all warehouses)
}
```

**Output Contract (API Response)**
```typescript
interface WarehousesListResponse {
  data: Array<{
    warehouse_id: string;
    city: string;
    capacity_units: number;
  }>;
  meta: {
    total_warehouses: number;
    last_updated: string;
  };
}
```

**UI Components**

1. **Warehouse Filter Checkboxes** (Filter panel)
   - Display: Checkbox with label `"{warehouse_id} - {city}"`
   - Value: `warehouse_id`
   - Default: All warehouses selected

---

## Data Source: Source Freshness (from `schema.yml`)

### dbt Source Definition
```yaml
sources:
  - name: raw
    database: ANALYTICS
    schema: RAW
    tables:
      - name: orders
        freshness:
          warn_after: {count: 2, period: hour}
          error_after: {count: 6, period: hour}
```

### UI Mapping

#### Primary Use: Data Quality Page (`/data-quality`)

**Input Contract (API Request)**
```typescript
interface FreshnessRequest {
  // No parameters (returns all source freshness checks)
}
```

**Output Contract (API Response)**
```typescript
interface FreshnessResponse {
  data: Array<{
    source_name: string;        // e.g., "raw.orders"
    last_updated: string;       // ISO timestamp
    status: 'OK' | 'WARN' | 'ERROR';
    warn_threshold?: string;    // e.g., "2 hours"
    error_threshold?: string;   // e.g., "6 hours"
    age_hours?: number;         // Float (age since last update)
  }>;
  meta: {
    last_check: string;         // ISO timestamp of freshness check
  };
}
```

**Validation Rules**

1. **Output Validation**
   - `status` must be one of 'OK', 'WARN', 'ERROR'
   - `last_updated` must be valid ISO timestamp
   - `age_hours` must be ≥ 0 if provided

**UI Components**

1. **Freshness Table** (`/data-quality`)
   - Columns: `source_name`, `last_updated` (formatted as date/time), `status` (visual indicator), `age_hours` (formatted as "X hours")
   - Status indicators:
     - OK: `--accent-success` text or icon
     - WARN: `--text-highlight` text or icon
     - ERROR: `--text-highlight` text or icon with border ring

**States**

- **Loading**: Skeleton table rows
- **Success**: Display freshness table
- **Error**: Show error message in `--text-highlight`
- **Warnings**: Highlight WARN/ERROR rows with `--text-highlight`

---

## Data Source: Model Tests (from `schema.yml`)

### dbt Test Definition
```yaml
models:
  - name: fct_orders
    tests:
      - not_null:
          column_name: order_id
      - unique:
          column_name: order_id
```

### UI Mapping

#### Primary Use: Data Quality Page (`/data-quality`)

**Input Contract (API Request)**
```typescript
interface TestsRequest {
  // No parameters (returns all model test results)
}
```

**Output Contract (API Response)**
```typescript
interface TestsResponse {
  data: Array<{
    model_name: string;         // e.g., "fct_orders"
    test_name: string;          // e.g., "not_null", "unique"
    test_status: 'PASS' | 'FAIL';
    last_run: string;           // ISO timestamp
    error_message?: string;     // Optional error message if FAIL
  }>;
  meta: {
    total_tests: number;
    passed_tests: number;
    failed_tests: number;
    last_run: string;           // ISO timestamp of test run
  };
}
```

**Validation Rules**

1. **Output Validation**
   - `test_status` must be 'PASS' or 'FAIL'
   - `last_run` must be valid ISO timestamp
   - `error_message` must be provided if `test_status` is 'FAIL'

**UI Components**

1. **Test Results Table** (`/data-quality`)
   - Columns: `model_name`, `test_name`, `test_status` (visual indicator), `last_run` (formatted as date/time), `error_message` (if FAIL)
   - Status indicators:
     - PASS: `--accent-success` text or icon
     - FAIL: `--text-highlight` text or icon with border ring

**States**

- **Loading**: Skeleton table rows
- **Success**: Display test results table
- **Error**: Show error message in `--text-highlight`
- **Failures**: Highlight failed tests with `--text-highlight` and border ring

---

## API Endpoint Summary

| Endpoint | Method | Request | Response | UI Component |
|----------|--------|---------|----------|--------------|
| `/api/kpi-daily` | GET | `KPIDailyRequest` | `KPIDailyResponse` | Dashboard KPIs, Chart, Table |
| `/api/orders` | GET | `OrdersRequest` | `OrdersResponse` | Warehouse Detail Orders Table |
| `/api/warehouse/:id` | GET | `WarehouseRequest` | `WarehouseResponse` | Warehouse Header |
| `/api/warehouses` | GET | `WarehousesListRequest` | `WarehousesListResponse` | Warehouse Filter Dropdown |
| `/api/freshness` | GET | `FreshnessRequest` | `FreshnessResponse` | Data Quality Freshness Table |
| `/api/tests` | GET | `TestsRequest` | `TestsResponse` | Data Quality Test Results Table |

**Note**: Actual API implementation (direct Snowflake queries vs. Looker Studio export) is out of scope for this spec. These contracts are connector-agnostic.

---

## Error Response Format

All API endpoints should return errors in this format:

```typescript
interface ErrorResponse {
  error: {
    code: string;           // e.g., "INVALID_DATE_RANGE", "WAREHOUSE_NOT_FOUND"
    message: string;         // Human-readable error message
    details?: string;        // Optional detailed error information
  };
  meta: {
    timestamp: string;       // ISO timestamp
  };
}
```

**UI Error Handling**

- Display error message in `--text-highlight` within `.card`
- Optional tooltip (`.tooltip`) with `details` if provided
- Retry button (`.link` style) to re-fetch data
- Link to data quality page if persistent errors

---

**Next**: See Navigation & Routing Model for route definitions and navigation patterns.

