SELECT
  CAST(DATE_TRUNC('day', order_ts) AS DATE) AS day,
  warehouse_id,
  AVG(fulfillment_hours) AS avg_fulfillment_hours,
  AVG(on_time_flag)      AS on_time_rate,
  SUM(qty)               AS units
FROM {{ ref('fct_orders') }}
GROUP BY 1,2
