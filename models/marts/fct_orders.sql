SELECT
  o.order_id,
  o.warehouse_id,
  DATEDIFF('hour', o.order_ts, o.ship_ts) AS fulfillment_hours,
  CASE WHEN status='shipped_on_time' THEN 1 ELSE 0 END AS on_time_flag,
  o.qty,
  o.order_ts
FROM {{ ref('stg_orders') }} o
