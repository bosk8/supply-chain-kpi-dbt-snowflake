SELECT warehouse_id::varchar, city::varchar, capacity_units::int
FROM {{ source('raw','warehouses') }}
