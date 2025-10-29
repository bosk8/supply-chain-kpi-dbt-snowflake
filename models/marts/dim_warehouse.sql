SELECT warehouse_id, city, capacity_units
FROM {{ ref('stg_warehouses') }}
QUALIFY ROW_NUMBER() OVER (PARTITION BY warehouse_id ORDER BY warehouse_id)=1
