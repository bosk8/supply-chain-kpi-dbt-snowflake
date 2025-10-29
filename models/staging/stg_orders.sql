SELECT
  order_id::varchar,
  TO_TIMESTAMP(order_ts) AS order_ts,
  TO_TIMESTAMP(ship_ts)  AS ship_ts,
  warehouse_id::varchar,
  sku::varchar,
  qty::int,
  status::varchar
FROM {{ source('raw','orders') }}
