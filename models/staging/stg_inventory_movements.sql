SELECT warehouse_id::varchar, TO_TIMESTAMP(ts) AS ts, sku::varchar, qty_change::int
FROM {{ source('raw','inventory_movements') }}
